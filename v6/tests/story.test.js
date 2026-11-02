/* เทสแกนความก้าวหน้า ไม่ใช่เทส UI/รางวัลเซิร์ฟเวอร์ (STORY-E1) */
import { createStory, migrateLegacyStory } from '../src/core/story.js';
import { CHAPTERS, STORY_ID } from '../src/data/story.js';
import { MAPS } from '../src/data/maps.js';
import fs from 'node:fs';
const ok = (v, m) => { if (!v) throw new Error(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + ': ' + JSON.stringify(a));
const throws = fn => { let threw = false; try { fn(); } catch { threw = true; } ok(threw, 'ต้องปฏิเสธเซฟผิดรูป'); };
function report(story, id) { const r = story.requestReport('king', id); ok(r, 'พร้อมส่งบท'); return { ...r, ok: true }; }
function first() { const s = createStory(); s.record({ chapterId: s.view().chapter.id, id: 'king-intro', kind: 'talk', target: 'king' }); s.confirmReport(report(s, 'intro')); return s; }

export default [
  ['เรื่องใหม่อยู่ในเอโดเรีย 28 ตอน id ไม่ซ้ำ และทุกแมพมีจริง', () => {
    eq(CHAPTERS.length, 28, 'บท 0–26 + ส่งท้าย'); eq(new Set(CHAPTERS.map(c => c.id)).size, 28, 'id คงที่ไม่ซ้ำ');
    for (const c of CHAPTERS) { ok(MAPS[c.scene], 'มีพื้นที่ ' + c.scene); ok(!/นครวารี|city2|dg96|ลุงบรอม/.test(JSON.stringify(c)), 'ไม่มีภาคที่ตัด'); ok(c.intro && c.outro && c.objectives.length, 'มีเนื้อเรื่องและเป้าหมาย'); }
    eq(CHAPTERS[13].id, 'dawn', 'ตอนปลดบ้านยังเป็นบท13'); eq(CHAPTERS.at(-1).rewardKey, null, 'ส่งท้ายไม่แจกรางวัล');
  }],
  ['ตาราง STORY.md ตรงกับ id ชื่อ แมพ และเงื่อนไขที่ UI จะใช้', () => {
    const doc = fs.readFileSync(new URL('../STORY.md', import.meta.url), 'utf8');
    for (const c of CHAPTERS) { const o = c.objectives[0]; const line = `| ${c.number === null ? 'ส่งท้าย' : c.number} | \`${c.id}\` | ${c.title} | \`${c.scene}\` | \`${o.kind}:${o.target}\` | ${o.count} |`; ok(doc.includes(line), 'ตารางไม่ตรง ' + c.id); }
  }],
  ['เริ่มเรื่องคุยพระราชา ส่งแล้วจึงไปล่าสไลม์ ไม่ข้ามด้วยเหตุการณ์อื่น', () => {
    const s = createStory(); eq(s.view().chapter.id, 'awakening', 'บทนำ'); eq(s.record({ chapterId: s.view().chapter.id, id: 'early', kind: 'kill', target: 'slime' }), false, 'ไม่นับล่าก่อนรับบท');
    eq(s.requestReport('king', 'too-soon'), null, 'ส่งก่อนเป้าหมายไม่ได้'); s.record({ chapterId: s.view().chapter.id, id: 'talk-1', kind: 'talk', target: 'king' });
    eq(s.requestReport('unknown-npc', 'bad'), null, 'ต้องส่งกับ NPC ที่กำหนด'); eq(s.view().chapter.id, 'awakening', 'ทำเป้าหมายไม่เลื่อนบทเอง');
    ok(s.confirmReport(report(s, 'turn-in-0')), 'รับผลส่งบท'); eq(s.view().chapter.id, 'first-light', 'ไปบทแรก'); eq(s.view().progress, [0], 'เริ่มนับใหม่');
  }],
  ['สไลม์ 8 ตัวนับเฉพาะบท active ไม่นับมอนอื่น เหตุการณ์ซ้ำ หรือ bulk count', () => {
    const s = first(); eq(s.record({ chapterId: 'awakening', id: 'late', kind: 'kill', target: 'slime' }), false, 'หลักฐานค้างของบทก่อน'); eq(s.record({ chapterId: s.view().chapter.id, id: 'wrong', kind: 'kill', target: 'wolf' }), false, 'ผิดชนิด'); eq(s.record({ chapterId: s.view().chapter.id, id: 'bulk', kind: 'kill', target: 'slime', count: 8 }), false, 'ป้องกันยอดรวม');
    s.record({ chapterId: s.view().chapter.id, id: 's1', kind: 'kill', target: 'slime' }); eq(s.record({ chapterId: s.view().chapter.id, id: 's1', kind: 'kill', target: 'slime' }), false, 'ซ้ำ');
    for (let i = 2; i <= 7; i++) s.record({ chapterId: s.view().chapter.id, id: 's' + i, kind: 'kill', target: 'slime' }); ok(!s.view().ready, '7 ยังไม่พร้อม');
    s.record({ chapterId: s.view().chapter.id, id: 's8', kind: 'kill', target: 'slime' }); ok(s.view().ready, '8 พร้อม'); eq(s.record({ chapterId: s.view().chapter.id, id: 's9', kind: 'kill', target: 'slime' }), false, 'เต็มแล้วไม่เพิ่ม');
  }],
  ['ส่งซ้ำ/โหลดระหว่างรอผล ใช้ request เดิม ไม่เลื่อนบทจากคำตอบผิดหรือเก่า', () => {
    const s = createStory(); s.record({ chapterId: s.view().chapter.id, id: 't', kind: 'talk', target: 'king' }); const r = report(s, 'receipt-0');
    eq(s.requestReport('king', 'another-id').requestId, 'receipt-0', 'retry ใช้ id เดิม'); const loaded = createStory(s.save());
    eq(loaded.confirmReport({ ...r, requestId: 'wrong' }), false, 'ผิด request'); eq(loaded.confirmReport({ ...r, ok: false }), false, 'server ไม่ยืนยัน');
    ok(loaded.confirmReport(r), 'รับผลหลังโหลด'); eq(loaded.confirmReport(r), false, 'ตอบซ้ำไม่เลื่อนสองบท'); eq(loaded.view().chapter.id, 'first-light', 'บทไม่ข้าม');
  }],
  ['เซฟโหลดกลางล่าเก็บยอดและ dedup; snapshot ภายนอกแก้สถานะจริงไม่ได้', () => {
    const s = first(); s.record({ chapterId: s.view().chapter.id, id: 'one', kind: 'kill', target: 'slime' }); const data = s.save(); const loaded = createStory(data);
    eq(loaded.view().progress, [1], 'โหลดแล้วมี1'); eq(loaded.record({ chapterId: loaded.view().chapter.id, id: 'one', kind: 'kill', target: 'slime' }), false, 'โหลดแล้วไม่นับซ้ำ');
    data.progress[0] = 8; loaded.view().progress[0] = 8; eq(s.view().progress, [1], 'save เป็นสำเนา'); eq(loaded.view().progress, [1], 'view เป็นสำเนา');
  }],
  ['ข้อมูลรุ่นใหม่/ผิดรูปต้องหยุด ห้ามรีเซ็ตเงียบ ๆ', () => {
    throws(() => createStory({ version: 99 })); throws(() => createStory(null));
    const x = first().save(); throws(() => createStory({ ...x, progress: [999] })); throws(() => createStory({ ...x, completed: ['wrong'] })); throws(() => createStory({ ...x, chapterId: 'city2' }));
    throws(() => createStory({ ...x, seen: ['same', 'same'] })); throws(() => createStory({ ...x, pending: { chapterId: x.chapterId, requestId: 'x' } }));
  }],
  ['import บทเก่าต้องรอกระทบยอด ภาคเมือง2ไปส่งท้าย ไม่อนุมานสิทธิ์รับของ', () => {
    for (const ch of [0, 13, 15, 26, 27, 30, 34, 35]) {
      const s = createStory(migrateLegacyStory({ ch })); ok(s.view().needsReconciliation, 'รอเซิร์ฟเวอร์');
      eq(s.view().chapter.id, ch >= 27 ? 'free' : CHAPTERS[ch].id, 'mapping บท' + ch);
      eq(s.record({ chapterId: s.view().chapter.id, id: 'fake', kind: 'visit', target: 'town' }), false, 'ยังนับไม่ได้'); eq(s.requestReport('king', 'fake'), null, 'ยังส่งไม่ได้');
      ok(createStory(s.save()).view().needsReconciliation, 'โหลดใหม่ยังระงับ');
    }
    throws(() => migrateLegacyStory({ ch: -1 })); throws(() => migrateLegacyStory({ ch: 99 }));
  }],
  ['หลักฐานจากบทเก่าห้าม replay ไปนับซ้ำในบทที่มีเป้าหมายชนิดเดียวกัน', () => {
    const s = createStory();
    for (const c of CHAPTERS.slice(0, 22)) {
      if (c.id === 'open-sky') eq(s.record({ chapterId: s.view().chapter.id, id: 'iron-heart-0', kind: 'boss', target: 'iron' }), false, 'บอสบท5ไม่นับในบท16');
      if (c.id === 'companions') for (let i = 0; i < 3; i++) eq(s.record({ chapterId: s.view().chapter.id, id: 'hands-' + i, kind: 'guild', target: 'quest-completed' }), false, 'กิลด์บท6ไม่นับในบท21');
      for (const o of c.objectives) for (let n = 0; n < o.count; n++) s.record({ chapterId: s.view().chapter.id, id: c.id + '-' + n, kind: o.kind, target: o.target === 'any' ? 'wolf' : o.target });
      ok(s.confirmReport(report(s, 'r-' + c.id)), 'ส่งบทตามปกติ');
    }
  }],
  ['เดินตรรกะครบทุกบท จบในเมืองเดิมและไม่ย้อนเริ่ม/รับส่งท้ายซ้ำ', () => {
    let s = createStory();
    for (const c of CHAPTERS) {
      eq(s.view().chapter.id, c.id, 'ลำดับ ' + c.id);
      for (const o of c.objectives) for (let n = 0; n < o.count; n++) ok(s.record({ chapterId: s.view().chapter.id, id: c.id + '-' + n, kind: o.kind, target: o.target === 'any' ? 'wolf' : o.target }), 'หลักฐาน');
      const reply = report(s, 'report-' + c.id); s = createStory(s.save()); ok(s.confirmReport(reply), 'ส่ง ' + c.id);
    }
    ok(s.view().finished, 'จบ'); eq(s.view().chapter, null, 'ไม่มีภาคเมืองอื่น'); eq(s.requestReport('king', 'extra'), null, 'ไม่ส่งซ้ำ'); ok(createStory(s.save()).view().finished, 'โหลดแล้วจบ');
  }],
];
