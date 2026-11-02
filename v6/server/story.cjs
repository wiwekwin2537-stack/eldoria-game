/* STORY-E3a: บริการภายในเซิร์ฟเวอร์เท่านั้น ไม่ได้ต่อ WebSocket/หน้าจอจริง
   หลักฐานและการคุย NPC ต้องมาจาก verifier ที่เชื่อถือได้ ไม่รับข้อมูล client เป็นหลักฐานโดยตรง
   รางวัล/ความก้าวหน้า/receipt เขียนส่วน server ในเอกสารเดียว ผ่านคิว createSaves เดียวกัน
   เปิดได้เฉพาะ single-writer ที่ผู้เรียกยืนยันเท่านั้น ยังใช้กับหลายโปรเซสไม่ได้ (ต้องทำ CAS ก่อน)
   ไม่มีตารางรางวัล production หรือ grant กระเป๋าเริ่มต้น: ขาด adapter = หยุด ไม่ให้ผ่านบทแล้วของหาย */
const { COIN_MAX } = require('./saves.cjs');
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const clone = value => JSON.parse(JSON.stringify(value));
const plain = value => !!value && typeof value === 'object' && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
function fail(code) { const e = new Error(code); e.code = code; throw e; }
function textId(s) { return typeof s === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(s); }
function sync(value) { if (value && typeof value.then === 'function') { Promise.resolve(value).catch(() => {}); fail('story-async'); } return value; }

async function createStoryService({ saves, storageMode, verifyEvidence, verifyReport, rewards = {}, grant } = {}) {
  if (storageMode !== 'single-writer') fail('story-storage-not-ready');
  if (!saves || typeof saves.readServer !== 'function' || typeof saves.updateServer !== 'function') fail('story-storage-not-ready');
  const { createStory } = await import('../src/core/story.js');
  const { CHAPTERS, STORY_ID } = await import('../src/data/story.js');
  const chapterIds = new Set(CHAPTERS.map(c => c.id));
  /* จับตารางฝั่งเซิร์ฟเวอร์ไว้ตั้งแต่สร้าง service เครื่องผู้เล่นไม่มีช่องส่ง rewardKey/จำนวนรางวัลมาแทน */
  if (!plain(rewards)) fail('story-rewards');
  const table = clone(rewards);
  function account(lid) { if (typeof lid !== 'string' || !lid || lid.length > 128) fail('story-account'); }
  function ledger(profile) {
    if (!own(profile, 'storyLedger')) return { version: 1, storyId: STORY_ID, revision: 0, state: createStory().save(), receipts: {} };
    const l = clone(profile.storyLedger);
    if (!plain(l) || l.version !== 1 || l.storyId !== STORY_ID || !Number.isSafeInteger(l.revision) || l.revision < 0 || !plain(l.receipts) || Object.keys(l.receipts).length > CHAPTERS.length) fail('story-data');
    const engine = createStory(l.state), completed = new Set(l.state.completed);
    for (const [id, r] of Object.entries(l.receipts)) {
      if (!chapterIds.has(id) || !completed.has(id) || !plain(r) || r.ok !== true || r.storyId !== STORY_ID || r.chapterId !== id || !textId(r.requestId) || !Number.isSafeInteger(r.revision) || r.revision < 1 || r.revision > l.revision) fail('story-receipt');
    }
    /* เซฟ imported/legacy ยังต้องรอกระทบยอด ไม่เดาว่าได้รางวัลไปแล้วจากเลขบท */
    if (!engine.view().needsReconciliation && completed.size !== Object.keys(l.receipts).length) fail('story-receipt');
    return l;
  }
  function snapshot(l) { return { storyId: STORY_ID, revision: l.revision, state: clone(l.state), view: createStory(l.state).view(), receipts: clone(l.receipts) }; }
  function readyCoin(profile) { if (!Number.isSafeInteger(profile.coin) || profile.coin < 0 || profile.coin > COIN_MAX) fail('story-coin'); }

  async function read(lid) { account(lid); return snapshot(ledger(await saves.readServer(lid))); }
  async function record(lid, ticket) {
    account(lid);
    if (typeof verifyEvidence !== 'function') fail('story-evidence-unavailable');
    let result;
    await saves.updateServer(lid, profile => {
      const l = ledger(profile), engine = createStory(l.state);
      const proof = sync(verifyEvidence({ lid, ticket, current: engine.view(), revision: l.revision }));
      if (!plain(proof) || !textId(proof.id) || !textId(proof.chapterId) || typeof proof.kind !== 'string' || typeof proof.target !== 'string') fail('story-evidence');
      const event = { id: proof.id, chapterId: proof.chapterId, kind: proof.kind, target: proof.target, count: 1 };
      if (proof.count !== undefined && proof.count !== 1) fail('story-evidence');
      if (proof.chapterId !== l.state.chapterId) fail('story-chapter');
      if (l.state.seen.includes(event.id)) { result = { ok: true, duplicate: true, ...snapshot(l) }; return profile; }
      if (!engine.record(event)) fail('story-evidence');
      l.state = engine.save(); l.revision++; profile.storyLedger = l;
      result = { ok: true, duplicate: false, ...snapshot(l) }; return profile;
    });
    return result;
  }
  async function report(lid, request) {
    account(lid);
    if (!plain(request) || !textId(request.chapterId) || !chapterIds.has(request.chapterId) || !textId(request.requestId)) fail('story-request');
    /* จับ request ก่อนเข้าคิว ป้องกันผู้เรียกเปลี่ยน id ระหว่างรอ */
    const chapterId = request.chapterId, requestId = request.requestId, ticket = request.ticket;
    let result;
    await saves.updateServer(lid, profile => {
      const l = ledger(profile);
      if (own(l.receipts, chapterId)) {
        const receipt = l.receipts[chapterId];
        if (receipt.requestId !== requestId) fail('story-already-claimed');
        result = { receipt: clone(receipt), duplicate: true, ...snapshot(l) }; return profile;
      }
      const engine = createStory(l.state);
      if (engine.view().needsReconciliation) fail('story-reconcile');
      if (l.state.chapterId !== chapterId) fail('story-chapter');
      if (Object.values(l.receipts).some(r => r.requestId === requestId)) fail('story-request-used');
      if (!engine.view().ready) fail('story-not-ready');
      if (typeof verifyReport !== 'function') fail('story-report-unavailable');
      const proof = sync(verifyReport({ lid, ticket, chapterId, current: engine.view(), revision: l.revision }));
      if (!plain(proof) || proof.chapterId !== chapterId || proof.npc !== engine.view().chapter.npc) fail('story-report');
      const pending = engine.requestReport(proof.npc, requestId);
      if (!pending) fail('story-not-ready');
      if (pending.rewardKey !== null) {
        if (!own(table, pending.rewardKey) || !plain(table[pending.rewardKey]) || typeof grant !== 'function') fail('story-rewards-not-ready');
        /* grant ต้องแก้สำเนา profile นี้เท่านั้น ไม่ส่งจดหมาย/เขียนที่เก็บภายนอกเองก่อน commit */
        const applied = sync(grant(profile, clone(table[pending.rewardKey]), { lid, chapterId, rewardKey: pending.rewardKey, requestId }));
        if (applied !== true) fail('story-reward-rejected');
      }
      readyCoin(profile);
      if (!engine.confirmReport({ ...pending, ok: true })) fail('story-report');
      l.state = engine.save(); l.revision++;
      const receipt = { ok: true, storyId: STORY_ID, chapterId, requestId, rewardKey: pending.rewardKey, revision: l.revision, nextChapterId: l.state.chapterId };
      l.receipts[chapterId] = receipt; profile.storyLedger = l;
      result = { receipt: clone(receipt), duplicate: false, ...snapshot(l) }; return profile;
    });
    return result;
  }
  return { read, record, report };
}
module.exports = { createStoryService };
