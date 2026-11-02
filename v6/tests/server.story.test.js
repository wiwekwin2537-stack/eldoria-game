/* STORY-E3a ทดสอบบริการภายใน ไม่ใช่ WebSocket/รางวัล production
   ตารางและกระเป๋าด้านล่างเป็น fixture เพื่อพิสูจน์ธุรกรรมเท่านั้น ไม่ใช่ค่ารางวัลที่เปิดใช้งานจริง */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createStoryService } = require('../server/story.cjs');
const { createSaves, keyOf, COIN_MAX } = require('../server/saves.cjs');
const { memoryStore } = require('../server/store.cjs');
const { createProto } = require('../server/proto.cjs');
const clone = x => JSON.parse(JSON.stringify(x));
const ok = (v, m) => { if (!v) throw new Error(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + ': ' + JSON.stringify(a));
const rejects = async (fn, code) => { let err; try { await fn(); } catch (e) { err = e; } ok(err, 'ต้องปฏิเสธ'); if (code) eq(err.code || err.message, code, 'รหัสผิดพลาด'); };
const LID = 'story-test', SID = 'a'.repeat(32);
const REWARDS = { 'story.0': { coin: 50, xp: 20, items: { hpp: 3, scroll: 2 } }, 'story.1': { coin: 120, xp: 60, items: { mpp: 2 } } };
async function setup({ capacity = 8, omit = [], rewards = REWARDS } = {}) {
  const memory = memoryStore(), proof = new Map(), talk = new Map(), clock = { ms: 1e6 };
  const fault = { mode: null }, stat = { writes: 0, grants: 0 }, settings = { rejectGrant: false };
  const store = { kind: 'memory', get: k => memory.get(k), create: (k,v) => memory.create(k,v), async set(k,v) { const mode = fault.mode; fault.mode = null; if (mode === 'before') throw new Error('disk-offline'); await memory.set(k,v); stat.writes++; if (mode === 'after') throw new Error('reply-lost'); } };
  const saves = createSaves({ store, now: () => clock.ms });
  await saves.updateServer(LID, s => ({ ...s, xp: 0, inventory: { capacity, stacks: {} } }));
  const config = { saves, storageMode: 'single-writer', rewards,
    verifyEvidence: ({ lid, ticket }) => { const p = proof.get(ticket); return p?.lid === lid ? clone(p.event) : false; },
    verifyReport: ({ lid, ticket }) => { const p = talk.get(ticket); return p?.lid === lid ? clone(p.proof) : false; },
    grant: (profile, reward) => {
      stat.grants++; profile.coin += reward.coin; profile.xp += reward.xp;
      if (settings.rejectGrant) return false;
      const stacks = profile.inventory.stacks;
      for (const [id, n] of Object.entries(reward.items)) stacks[id] = (stacks[id] || 0) + n;
      if (Object.keys(stacks).length > profile.inventory.capacity) throw new Error('bag-full');
      return true;
    },
  };
  for (const key of omit) delete config[key];
  const service = await createStoryService(config);
  const t = { service, config, saves, memory, store, fault, stat, settings, clock, proof, talk };
  t.event = (ticket, event, lid = LID) => proof.set(ticket, { lid, event });
  t.npc = (ticket, chapterId, npc = 'king', lid = LID) => talk.set(ticket, { lid, proof: { chapterId, npc } });
  t.readyIntro = async () => { t.event('intro-proof', { id: 'talk-1', chapterId: 'awakening', kind: 'talk', target: 'king' }); return service.record(LID, 'intro-proof'); };
  t.reportIntro = () => service.report(LID, { chapterId: 'awakening', requestId: 'request-0', ticket: 'king-proof' });
  t.npc('king-proof', 'awakening');
  return t;
}

export default [
  ['STORY-E3a ค่าเริ่มต้นไม่เปิดรับหลักฐาน/รางวัล และไม่ยอมใช้ storage ที่ยังไม่รับรอง single-writer', async () => {
    await rejects(() => createStoryService({}), 'story-storage-not-ready');
    const t = await setup({ omit: ['verifyEvidence'] }); await rejects(() => t.readyIntro(), 'story-evidence-unavailable');
    const r = await setup({ omit: ['grant'] }); await r.readyIntro(); const before = await r.saves.readServer(LID); await rejects(() => r.reportIntro(), 'story-rewards-not-ready'); eq(await r.saves.readServer(LID), before, 'ไม่ผ่านบท/ไม่หักของ');
    const empty = await setup({ rewards: {} }); await empty.readyIntro(); await rejects(() => empty.reportIntro(), 'story-rewards-not-ready');
  }],
  ['STORY-E3a client ส่ง event เอง/ผิดบัญชี/ผิดบท/ผิดชนิด/นับรวดเดียวไม่ได้', async () => {
    const t = await setup(); const before = await t.saves.readServer(LID);
    await rejects(() => t.service.record(LID, { id: 'fake', chapterId: 'awakening', kind: 'talk', target: 'king' }), 'story-evidence');
    t.event('other-user', { id: 'a', chapterId: 'awakening', kind: 'talk', target: 'king' }, 'someone-else'); await rejects(() => t.service.record(LID, 'other-user'), 'story-evidence');
    t.event('wrong-chapter', { id: 'b', chapterId: 'first-light', kind: 'kill', target: 'slime' }); await rejects(() => t.service.record(LID, 'wrong-chapter'), 'story-chapter');
    t.event('bulk', { id: 'c', chapterId: 'awakening', kind: 'talk', target: 'king', count: 8 }); await rejects(() => t.service.record(LID, 'bulk'), 'story-evidence');
    t.event('wrong-kind', { id: 'd', chapterId: 'awakening', kind: 'kill', target: 'king' }); await rejects(() => t.service.record(LID, 'wrong-kind'), 'story-evidence');
    eq(await t.saves.readServer(LID), before, 'ข้อมูลไม่เปลี่ยนจากหลักฐานปลอม');
  }],
  ['STORY-E3a หลักฐานที่เซิร์ฟเวอร์รับรองนับครั้งเดียวและโหลดต่อจาก storage ได้', async () => {
    const t = await setup(); const first = await t.readyIntro(); ok(first.view.ready, 'คุยครบ'); const writes = t.stat.writes;
    eq((await t.service.record(LID, 'intro-proof')).duplicate, true, 'นับซ้ำไม่ได้'); eq(t.stat.writes, writes, 'ไม่เขียนซ้ำ');
    const restarted = await createStoryService({ ...t.config, saves: createSaves({ store: t.store, now: () => t.clock.ms }) });
    eq((await restarted.read(LID)).state.progress, [1], 'โหลดความคืบหน้า'); eq((await restarted.record(LID, 'intro-proof')).duplicate, true, 'dedupหลังรีสตาร์ต');
  }],
  ['STORY-E3a ส่งบทก่อนครบ/คุย NPC ผิด/ไม่มี verifier ไม่รับรางวัล', async () => {
    const t = await setup(); await rejects(() => t.reportIntro(), 'story-not-ready'); await t.readyIntro();
    t.npc('wrong-king', 'awakening', 'not-king'); const before = await t.saves.readServer(LID);
    await rejects(() => t.service.report(LID, { chapterId: 'awakening', requestId: 'x', ticket: 'wrong-king' }), 'story-report');
    const noVerifier = await createStoryService({ ...t.config, verifyReport: undefined }); await rejects(() => noVerifier.report(LID, { chapterId: 'awakening', requestId: 'x' }), 'story-report-unavailable');
    eq(await t.saves.readServer(LID), before, 'ไม่แจกหรือเลื่อนบท');
  }],
  ['STORY-E3a รางวัล/บท/receipt commit พร้อมกัน ส่งซ้ำ20คำขอพร้อมกันได้ครั้งเดียว', async () => {
    const t = await setup(); await t.readyIntro(); const results = await Promise.all(Array.from({ length: 20 }, () => t.reportIntro()));
    eq(results.filter(r => !r.duplicate).length, 1, 'ส่งสำเร็จใหม่ครั้งเดียว'); eq(t.stat.grants, 1, 'grantครั้งเดียว');
    const profile = await t.saves.readServer(LID); eq(profile.coin, 50, 'coin'); eq(profile.xp, 20, 'xp'); eq(profile.inventory.stacks, { hpp: 3, scroll: 2 }, 'ของครบ'); eq(profile.storyLedger.state.chapterId, 'first-light', 'บทถัดไป');
    eq(Object.keys(profile.storyLedger.receipts), ['awakening'], 'receiptเดียว'); await rejects(() => t.service.report(LID, { chapterId: 'awakening', requestId: 'new-key' }), 'story-already-claimed');
  }],
  ['STORY-E3a กระเป๋าเต็มหรือ grant ปฏิเสธ ไม่ได้เงินบางส่วนและไม่เลื่อนบท', async () => {
    const t = await setup({ capacity: 1 }); await t.readyIntro(); const before = await t.saves.readServer(LID);
    await rejects(() => t.reportIntro(), 'bag-full'); eq(await t.saves.readServer(LID), before, 'แม้grantแก้coinก่อนโยนerrorก็ย้อนทั้งชุด');
    await t.saves.updateServer(LID, p => { p.inventory.capacity = 8; return p; }); t.settings.rejectGrant = true; const afterCapacity = await t.saves.readServer(LID);
    await rejects(() => t.reportIntro(), 'story-reward-rejected'); eq(await t.saves.readServer(LID), afterCapacity, 'grantfalseไม่เปลี่ยนข้อมูล');
    t.settings.rejectGrant = false; await t.reportIntro(); eq((await t.saves.readServer(LID)).coin, 50, 'แก้แล้วรับได้ครั้งเดียว');
  }],
  ['STORY-E3a ที่เก็บพังก่อนเขียน: ไม่แจก ไม่เลื่อน และ retry ได้ครบ', async () => {
    const t = await setup(); await t.readyIntro(); const before = await t.saves.readServer(LID); t.fault.mode = 'before';
    await rejects(() => t.reportIntro(), 'disk-offline'); eq(await t.saves.readServer(LID), before, 'persist/cacheยังเดิม');
    await t.reportIntro(); eq((await t.saves.readServer(LID)).coin, 50, 'retryไม่ซ้ำ');
  }],
  ['STORY-E3a เขียนสำเร็จแต่คำตอบหาย: อ่านใหม่และ retry ไม่แจกซ้ำ/ไม่ทับการเปลี่ยนเงินภายหลัง', async () => {
    const t = await setup(); await t.readyIntro(); t.fault.mode = 'after'; await rejects(() => t.reportIntro(), 'reply-lost');
    await t.saves.updateServer(LID, p => ({ ...p, coin: p.coin + 7 }));
    const result = await t.reportIntro(); eq(result.duplicate, true, 'อ่านreceiptที่commitไปแล้ว'); eq(t.stat.grants, 1, 'ไม่เรียกgrantซ้ำ');
    eq((await t.saves.readServer(LID)).coin, 57, 'ไม่ทำเงินภายหลังหาย');
  }],
  ['STORY-E3a report ซ้ำหลัง restart คืน receipt เดิมและไม่เพิ่มเงิน', async () => {
    const t = await setup(); await t.readyIntro(); const first = await t.reportIntro(); const writes = t.stat.writes;
    const restarted = await createStoryService({ ...t.config, saves: createSaves({ store: t.store, now: () => t.clock.ms }) });
    const replay = await restarted.report(LID, { chapterId: 'awakening', requestId: 'request-0' }); eq(replay.receipt, first.receipt, 'receiptเดิม'); eq(replay.duplicate, true, 'retry'); eq(t.stat.writes, writes, 'ไม่เขียนซ้ำ');
  }],
  ['STORY-E3a เซฟทั่วไปจาก client ปลอมเรื่อง/เงินไม่ได้ และไม่ทับข้อมูล server ที่รับแล้ว', async () => {
    const t = await setup(); await t.readyIntro(); await t.reportIntro(); const before = await t.saves.readServer(LID);
    await t.saves.load(LID, SID); t.clock.ms += 2000;
    ok((await t.saves.save(LID, { seq: 1, sid: SID, systems: { story: { chapterId: 'free', progress: [999] }, server: { coin: 999999 } }, server: { coin: 999999 } })).ok, 'เซฟclientส่วนของตัวเองได้');
    eq(await t.saves.readServer(LID), before, 'ส่วนserverไม่เปลี่ยน'); eq((await t.service.read(LID)).state.chapterId, 'first-light', 'เรื่องจริงไม่ข้าม');
  }],
  ['STORY-E3a เควสต์ล่าสไลม์8ตัวและส่งบท2ครั้ง: rewardหนึ่งครั้ง ใช้requestIdซ้ำข้ามบทไม่ได้', async () => {
    const t = await setup(); await t.readyIntro(); await t.reportIntro();
    for (let i = 0; i < 8; i++) { t.event('slime-' + i, { id: 'kill-' + i, chapterId: 'first-light', kind: 'kill', target: 'slime' }); await t.service.record(LID, 'slime-' + i); }
    t.npc('king-1', 'first-light'); await rejects(() => t.service.report(LID, { chapterId: 'first-light', requestId: 'request-0', ticket: 'king-1' }), 'story-request-used');
    const request = { chapterId: 'first-light', requestId: 'request-1', ticket: 'king-1' }; await t.service.report(LID, request); await t.service.report(LID, request);
    const p = await t.saves.readServer(LID); eq(p.coin, 170, 'รวมcoin'); eq(p.xp, 80, 'รวมxp'); eq(p.inventory.stacks.mpp, 2, 'ของครั้งเดียว'); eq(p.storyLedger.state.chapterId, 'own-blade', 'ไปบท2');
    await rejects(() => t.service.record(LID, 'slime-0'), 'story-chapter');
  }],
  ['STORY-E3a read/update ไม่เปิดเผยแคช nested และ callbackพังไม่ทำให้แคชเปลี่ยน', async () => {
    const t = await setup(); const before = await t.saves.readServer(LID); const copy = await t.saves.readServer(LID); copy.inventory.stacks.hack = 100;
    await rejects(() => t.saves.updateServer(LID, p => { p.inventory.stacks.hack = 999; throw new Error('abort'); }), 'abort'); eq(await t.saves.readServer(LID), before, 'cacheไม่เปลี่ยน');
    const doc = await t.saves.load(LID, SID); doc.server.inventory.stacks.hack = 3; eq(await t.saves.readServer(LID), before, 'loadเป็นสำเนา');
  }],
  ['STORY-E3a ไม่รับ JSON เสีย/ledgerเสีย/รุ่นใหม่เป็นตัวละครใหม่เพื่อรับซ้ำ', async () => {
    const t = await setup(); await t.readyIntro(); await t.reportIntro(); const raw = await t.memory.get(keyOf(LID));
    await t.memory.set(keyOf(LID), '{broken'); const fresh = createSaves({ store: t.store }); await rejects(() => fresh.readServer(LID), 'save-data'); eq(await t.memory.get(keyOf(LID)), '{broken', 'ไม่เขียนทับ');
    const data = JSON.parse(raw); data.server.storyLedger.state.version = 99; await t.memory.set(keyOf(LID), JSON.stringify(data));
    const service = await createStoryService({ ...t.config, saves: createSaves({ store: t.store }) }); await rejects(() => service.read(LID), 'story-version');
    data.server.storyLedger.state.version = 1; delete data.server.storyLedger.receipts.awakening; await t.memory.set(keyOf(LID), JSON.stringify(data));
    const s2 = await createStoryService({ ...t.config, saves: createSaves({ store: t.store }) }); await rejects(() => s2.read(LID), 'story-receipt');
  }],
  ['STORY-E3a async grant/verifier และเงินเกินเพดานต้องหยุดก่อน commit', async () => {
    const t = await setup(); await t.readyIntro(); const before = await t.saves.readServer(LID);
    const asyncGrant = await createStoryService({ ...t.config, grant: async () => true }); await rejects(() => asyncGrant.report(LID, { chapterId: 'awakening', requestId: 'a', ticket: 'king-proof' }), 'story-async');
    const asyncProof = await createStoryService({ ...t.config, verifyReport: async () => ({ chapterId: 'awakening', npc: 'king' }) }); await rejects(() => asyncProof.report(LID, { chapterId: 'awakening', requestId: 'b', ticket: 'king-proof' }), 'story-async');
    const over = await createStoryService({ ...t.config, grant: p => { p.coin = COIN_MAX + 1; return true; } }); await rejects(() => over.report(LID, { chapterId: 'awakening', requestId: 'c', ticket: 'king-proof' }), 'story-coin'); eq(await t.saves.readServer(LID), before, 'ทุกกรณีไม่commit');
  }],
  ['STORY-E3a ยังไม่มี WebSocket route ให้ client ส่งหลักฐานหรือรับรางวัลเอง', async () => {
    const t = await setup(); const before = await t.saves.readServer(LID), out = [];
    const proto = createProto({ accounts: {}, saves: t.saves, now: () => t.clock.ms, authTimeoutMs: 0 }); const conn = { ip: '127.0.0.1', send: m => out.push(m), close() {} }; proto.open(conn); conn.lid = LID;
    for (const type of ['story_record', 'story_report']) { await proto.message(conn, JSON.stringify({ t: type, chapterId: 'awakening', requestId: 'fake', coin: 999 })); eq(out.at(-1)?.why, 'bad', 'routeยังปิด'); }
    eq(await t.saves.readServer(LID), before, 'ไม่เพิ่มเงิน'); proto.closed(conn);
  }],
];
