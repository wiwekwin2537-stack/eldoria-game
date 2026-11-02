/* แกนเควสต์ล้วน · ยังไม่ลงทะเบียนเป็นระบบเล่นจริง (STORY.md / ใบงาน STORY-E2–E4)
   record รับหลักฐานผูก chapterId ตั้งแต่เกิด event จาก adapter ระบบเกมเท่านั้น ไม่ใช้เป็นหลักฐานแจกของฝั่งเซิร์ฟเวอร์
   confirmReport รับเฉพาะผลจากเซิร์ฟเวอร์ผ่าน adapter ที่เชื่อถือได้ ห้ามต่อกับปุ่มหรือข้อความจาก client โดยตรง
   ไม่มีการเพิ่มเงิน XP ของ หรือเขียน G.player และไม่มีเวลาเครื่อง */
import { CHAPTERS, STORY_ID, STORY_VERSION } from '../data/story.js';

const copy = data => JSON.parse(JSON.stringify(data));
const ids = CHAPTERS.map(c => c.id);
const validId = id => typeof id === 'string' && id.length > 0 && id.length <= 128;
function empty(index = 0) {
  return { version: STORY_VERSION, chapterId: ids[index] || null, completed: ids.slice(0, index), progress: CHAPTERS[index]?.objectives.map(() => 0) || [], seen: [], pending: null, reconciliation: null };
}
function ready(state) {
  const ch = CHAPTERS[state.completed.length];
  return !!ch && ch.objectives.every((o, i) => state.progress[i] >= o.count);
}
function restore(saved) {
  if (saved === undefined) return empty();
  if (!saved || saved.version !== STORY_VERSION) throw new Error('story-version');
  if (!Array.isArray(saved.completed) || saved.completed.length > ids.length || saved.completed.some((id, i) => id !== ids[i])) throw new Error('story-completed');
  const index = saved.completed.length, chapter = CHAPTERS[index];
  if (saved.chapterId !== (chapter?.id || null)) throw new Error('story-chapter');
  if (!Array.isArray(saved.progress) || saved.progress.length !== (chapter?.objectives.length || 0) || saved.progress.some((n, i) => !Number.isInteger(n) || n < 0 || n > chapter.objectives[i].count)) throw new Error('story-progress');
  if (!Array.isArray(saved.seen) || saved.seen.length > 128 || saved.seen.some(id => !validId(id)) || new Set(saved.seen).size !== saved.seen.length) throw new Error('story-events');
  if (saved.pending !== null && (!saved.pending || saved.pending.chapterId !== saved.chapterId || !validId(saved.pending.requestId) || !ready(saved))) throw new Error('story-pending');
  if (saved.reconciliation !== null && (!saved.reconciliation || !Number.isInteger(saved.reconciliation.legacyChapter) || saved.reconciliation.legacyChapter < 0 || saved.reconciliation.legacyChapter > 35)) throw new Error('story-reconciliation');
  return copy({ version: STORY_VERSION, chapterId: saved.chapterId, completed: saved.completed, progress: saved.progress, seen: saved.seen, pending: saved.pending, reconciliation: saved.reconciliation });
}

/* ใช้เฉพาะตอน import เซฟเกมเดิมที่ตรวจรูปแบบแล้ว · ไม่ใช้เลขบทเป็นสิทธิ์รับรางวัล
   snapshot นี้ถูกระงับไว้จน server ตรวจประวัติรางวัล/หลักฐานแล้วส่ง snapshot v1 ที่ reconciliation:null */
export function migrateLegacyStory(legacy) {
  if (!legacy || !Number.isInteger(legacy.ch) || legacy.ch < 0 || legacy.ch > 35) throw new Error('story-legacy');
  const state = empty(legacy.ch >= 27 ? ids.indexOf('free') : legacy.ch);
  state.reconciliation = { legacyChapter: legacy.ch };
  return state;
}

export function createStory(saved) {
  let state = restore(saved);
  const blocked = () => !!state.reconciliation || state.chapterId === null;
  return {
    save() { return copy(state); },
    view() {
      return { chapter: state.chapterId === null ? null : copy(CHAPTERS[state.completed.length]), progress: [...state.progress], ready: !blocked() && ready(state), pending: !!state.pending, needsReconciliation: !!state.reconciliation, finished: state.chapterId === null };
    },
    /* 1 event = 1 หลักฐาน ห้ามส่ง count เพื่อเพิ่มจำนวนรวดเดียว · ไม่นับซ้ำระหว่าง retry */
    record(event) {
      if (blocked() || state.pending || ready(state) || !event || !validId(event.id) || event.chapterId !== state.chapterId || (event.count !== undefined && event.count !== 1) || state.seen.includes(event.id)) return false;
      const chapter = CHAPTERS[state.completed.length];
      const matches = chapter.objectives.map((o, i) => event.kind === o.kind && typeof event.target === 'string' && (o.target === 'any' || event.target === o.target) && state.progress[i] < o.count);
      if (!matches.some(Boolean) || state.seen.length >= 128) return false;
      matches.forEach((match, i) => { if (match) state.progress[i]++; });
      state.seen.push(event.id);
      return true;
    },
    requestReport(npc, requestId) {
      if (blocked() || !ready(state) || npc !== CHAPTERS[state.completed.length].npc || !validId(requestId)) return null;
      if (!state.pending) state.pending = { chapterId: state.chapterId, requestId };
      const chapter = CHAPTERS[state.completed.length];
      return { storyId: STORY_ID, ...copy(state.pending), rewardKey: chapter.rewardKey };
    },
    /* ข้อมูลนี้ไม่พิสูจน์สิทธิ์รางวัลด้วยตัวเอง adapter ฝั่งเซิร์ฟเวอร์ต้องตรวจและ commit รางวัลก่อน */
    confirmReport(reply) {
      const p = state.pending;
      if (blocked() || !p || !reply || reply.ok !== true || reply.storyId !== STORY_ID || reply.chapterId !== p.chapterId || reply.requestId !== p.requestId) return false;
      const seen = state.seen;
      state = empty(state.completed.length + 1);
      state.seen = seen; /* รักษาหลักฐานข้ามบท ป้องกัน retry งานเก่าที่เป้าหมายซ้ำ */
      return true;
    },
  };
}
