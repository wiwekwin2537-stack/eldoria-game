/* SAVE-SAFE: เทสข้อมูลไม่ครบต้องไม่ทับเซฟเดิม ใช้ in-memory transport ไม่ต่อเซิร์ฟเวอร์จริง */
import { collect, applyLoad, createSaver, MIN_GAP_MS } from '../src/core/save.js';
import { createState } from '../src/core/state.js';
import { on, _reset } from '../src/core/bus.js';
import { saveErrText } from '../src/systems/login.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createSaves } = require('../server/saves.cjs');
const { memoryStore } = require('../server/store.cjs');
const ok = (v, m) => { if (!v) throw new Error(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + ': ' + JSON.stringify(a));
const clone = x => JSON.parse(JSON.stringify(x));
const throws = (fn, code) => { let e; try { fn(); } catch (err) { e = err; } ok(e, 'ต้องหยุดเมื่อข้อมูลไม่ครบ'); if (code) eq(e.code, code, 'รหัสผิดพลาด'); };
const rejects = async fn => { let failed = false; try { await fn(); } catch { failed = true; } ok(failed, 'ต้องปฏิเสธโหลดที่ไม่ครบ'); };
const quiet = fn => async () => { const old = console.error; console.error = () => {}; try { await fn(); } finally { console.error = old; } };
function setup() {
  _reset(); const G = createState(); G.bag = { sword: 2 }; G.story = { chapter: 'first-light' };
  const flags = { save: false, load: false, omit: false };
  const systems = [
    { id: 'position', load: (g, d) => { g.player.x = d?.x || 0; }, save: g => ({ x: g.player.x }) },
    { id: 'bag', load: (g, d) => { if (flags.load) throw new Error('bag-load'); g.bag = clone(d || { sword: 2 }); }, save: g => { if (flags.save) throw new Error('bag-save'); return flags.omit ? undefined : g.bag; } },
    { id: 'story', load: (g, d) => { g.story = clone(d || { chapter: 'first-light' }); }, save: g => g.story },
  ];
  let doc = { seq: 7, systems: { position: { x: 4 }, bag: { sword: 2 }, story: { chapter: 'first-light' } }, server: { coin: 150 } };
  const timer = { ms: 1e6, now: () => timer.ms, set: () => 1, clear() {} };
  const io = { sent: [], beacons: [], ready: () => true, request: async m => { io.sent.push(clone(m)); if (m.t === 'load') return { t: 'load', doc: clone(doc) }; doc = { ...doc, seq: m.seq, systems: clone(m.systems) }; return { t: 'save_ok', seq: m.seq }; }, send: m => { io.beacons.push(clone(m)); doc = { ...doc, seq: m.seq, systems: clone(m.systems) }; return true; } };
  const events = []; on('save:status', d => events.push(d));
  return { G, flags, systems, timer, io, events, doc: () => clone(doc), setDoc: d => { doc = clone(d); }, saver: createSaver(G, systems, io, timer) };
}

export default [
  ['SAVE-SAFE collect: ระบบหนึ่งโยน error ต้องไม่คืน snapshot บางส่วน', quiet(() => {
    throws(() => collect(createState(), [{ id: 'good', save: () => ({ x: 1 }) }, { id: 'bag', save() { throw new Error('bag'); } }]), 'save-incomplete');
    throws(() => collect({}, [{ id: 'same', save: () => ({ a: 1 }) }, { id: 'same', save: () => ({ a: 2 }) }]), 'save-incomplete');
  })],
  ['SAVE-SAFE collect: ข้อมูล JSON ที่จะหาย/เปลี่ยนค่าเงียบ ๆ ต้องหยุดทั้งก้อน', quiet(() => {
    const cyclic = {}; cyclic.self = cyclic;
    for (const value of [{ n: NaN }, { n: Infinity }, { n: undefined }, [undefined], [,], { n: () => 1 }, { n: 1n }, new Map([['sword', 2]]), new Set([1]), Promise.resolve({ sword: 2 }), cyclic]) throws(() => collect({}, [{ id: 'bag', save: () => value }]), 'save-incomplete');
    const shared = { x: 1 }; eq(collect({}, [{ id: 'data', save: () => ({ a: shared, b: shared, list: [1, null, false] }) }]), { data: { a: { x: 1 }, b: { x: 1 }, list: [1, null, false] } }, 'JSONปกติ/อ้างซ้ำเก็บครบ');
  })],
  ['SAVE-SAFE applyLoad: ระบบโหลดพังต้องโยน error ไม่แกล้งโหลดสำเร็จ', quiet(() => {
    throws(() => applyLoad(createState(), [{ id: 'bag', load() { throw new Error('broken'); } }], { seq: 1, systems: { bag: { sword: 2 } } }), 'load-incomplete');
    throws(() => applyLoad(createState(), [], { seq: 1, systems: [] }), 'load-incomplete');
  })],
  ['SAVE-SAFE โหลดระบบพัง: ไม่ส่ง save:loaded ไม่เซฟทั้งปกติ/ปิดหน้า จนโหลดครบได้จริง', quiet(async () => {
    const t = setup(); let loaded = 0; on('save:loaded', () => loaded++); t.flags.load = true;
    await rejects(() => t.saver.load()); eq(t.saver.state.loaded, false, 'ยังไม่ครบ'); eq(loaded, 0, 'ไม่ประกาศสำเร็จ'); eq(await t.saver.save(), 'wait', 'ไม่ส่ง'); eq(t.saver.flushNow(), false, 'ปิดหน้าก็ไม่ส่ง'); eq(t.io.sent.filter(m => m.t === 'save').length, 0, 'ไม่มีแพ็กเก็ต');
    eq(t.events.at(-1)?.error, 'load-incomplete', 'มีป้ายผิดพลาด'); t.flags.load = false; await t.saver.load(); eq(loaded, 1, 'โหลดครบครั้งเดียว'); eq(t.G.bag.sword, 2, 'ของอยู่');
  })],
  ['SAVE-SAFE save พัง: ไม่มีแพ็กเก็ต ไม่เพิ่ม seq ไม่แก้ baseline และไม่ทับของเดิม', quiet(async () => {
    const t = setup(); await t.saver.load(); const before = t.doc(), seq = t.saver.state.seq, last = t.saver.state.last;
    t.G.player.x = 99; t.flags.save = true;
    eq(await t.saver.save(), 'blocked', 'หยุดส่ง'); eq(t.saver.flushNow(), false, 'หยุด flush'); eq(t.doc(), before, 'เซฟเซิร์ฟเวอร์เดิมครบ'); eq(t.saver.state.seq, seq, 'seqไม่เพิ่ม'); eq(t.saver.state.last, last, 'baselineไม่เปลี่ยน');
    eq(t.events.at(-1)?.error, 'save-incomplete', 'บอกผู้เล่น'); t.flags.save = false; eq(await t.saver.save(), 'sent', 'แก้แล้วส่งใหม่'); eq(t.doc().systems.bag.sword, 2, 'ของครบ'); eq(t.doc().systems.position.x, 99, 'ความคืบหน้ายังอยู่'); eq(t.events.at(-1)?.ok, true, 'ป้ายสำเร็จ');
  })],
  ['SAVE-SAFE serializer คืน undefined ทั้งที่เคยมีข้อมูล ห้ามถือว่าเป็นการลบระบบ', quiet(async () => {
    const t = setup(); await t.saver.load(); const before = t.doc(); t.G.player.x = 50; t.flags.omit = true;
    eq(await t.saver.save(), 'blocked', 'ป้องกันหาย'); eq(t.saver.flushNow(), false, 'flushหยุด'); eq(t.doc(), before, 'ไม่ลบbag');
    t.flags.omit = false; eq(await t.saver.save(), 'sent', 'ครบแล้วส่งได้');
  })],
  ['SAVE-SAFE snapshot ใหม่ที่ post-load serialize ไม่ได้ ต้องไม่ปลดล็อกการเซฟ', quiet(async () => {
    const t = setup(); t.flags.save = true; await rejects(() => t.saver.load()); eq(t.saver.state.loaded, false, 'ยังไม่สำเร็จ'); eq(t.events.at(-1)?.error, 'load-incomplete', 'โหลดไม่ครบ'); eq(t.saver.flushNow(), false, 'ปิดหน้าไม่ส่ง');
  })],
  ['SAVE-SAFE เซฟมีระบบที่รุ่นนี้ไม่รองรับ: หยุดแทนการเขียนทับจนข้อมูลระบบนั้นหาย', quiet(async () => {
    const t = setup(); const d = t.doc(); d.systems.future = { rare: 1 }; t.setDoc(d);
    await rejects(() => t.saver.load()); eq(t.saver.state.loaded, false, 'รอ migration'); eq(t.saver.flushNow(), false, 'ไม่มีข้อมูลบางส่วนทับ'); eq(t.doc().systems.future.rare, 1, 'เก็บข้อมูลเดิม');
  })],
  ['SAVE-SAFE JSONพังระหว่างปิดหน้า: flush ไม่โยน error และไม่มี snapshot บางส่วนหลุด', quiet(async () => {
    const t = setup(); await t.saver.load(); const before = t.doc(); t.G.bag.sword = NaN;
    eq(t.saver.flushNow(), false, 'ไม่ส่งnullแทนNaN'); eq(t.doc(), before, 'ของเดิมไม่เปลี่ยน'); eq(t.events.at(-1)?.error, 'save-incomplete', 'มีสถานะผิดพลาด');
  })],
  ['SAVE-SAFE สถานะกลับปกติเมื่อเก็บข้อมูลครบ แม้ข้อมูลเท่า baseline เดิม', quiet(async () => {
    const t = setup(); await t.saver.load(); t.flags.save = true; await t.saver.save(); t.flags.save = false;
    eq(await t.saver.save(), 'same', 'ไม่มีอะไรใหม่'); eq(t.events.at(-1)?.ok, true, 'ล้างป้ายเมื่อกลับปกติ');
  })],
  ['SAVE-SAFE ต่อ createSaves จริง: serializer พังแล้วเซฟบนเซิร์ฟเวอร์ยังครบทุกระบบ', quiet(async () => {
    _reset(); const clock = { ms: 1e6 }, server = createSaves({ store: memoryStore(), now: () => clock.ms }); const sid = 'a'.repeat(32);
    await server.load('safe-account', sid); await server.save('safe-account', { seq: 1, sid, systems: { bag: { sword: 2 }, position: { x: 4 } } });
    const G = createState(); let broken = false;
    const systems = [{ id: 'position', load: (g, d) => { g.player.x = d.x; }, save: g => ({ x: g.player.x }) }, { id: 'bag', load: (g, d) => { g.bag = d; }, save: g => { if (broken) throw new Error('serialize'); return g.bag; } }];
    const io = { ready: () => true, request: async m => m.t === 'load' ? { t: 'load', doc: await server.load('safe-account', m.sid) } : (await server.save('safe-account', m)).ok ? { t: 'save_ok', seq: m.seq } : { t: 'save_no' }, send: () => { throw new Error('ห้ามส่งตอนพัง'); } };
    const s = createSaver(G, systems, io, { now: () => clock.ms, set: () => 1, clear() {} }); await s.load(); const original = clone((await server.load('safe-account', s.state.sid)).systems);
    G.player.x = 88; broken = true; await s.save(); eq(s.flushNow(), false, 'ไม่ส่งตอนพัง'); eq((await server.load('safe-account', s.state.sid)).systems, original, 'ข้อมูลจริงไม่เปลี่ยน');
    broken = false; clock.ms += MIN_GAP_MS; eq(await s.save(), 'sent', 'ส่งก้อนครบ'); const saved = await server.load('safe-account', s.state.sid); eq(saved.systems.bag.sword, 2, 'ของครบ'); eq(saved.systems.position.x, 88, 'เซฟใหม่ครบ');
  })],
  ['SAVE-SAFE คำตอบเซฟที่มาช้าห้ามล้างป้ายข้อมูลไม่ครบที่เกิดขึ้นระหว่างรอ', quiet(async () => {
    const t = setup(); await t.saver.load(); const request = t.io.request; let release;
    t.io.request = m => m.t === 'save' ? new Promise(resolve => { release = async () => resolve(await request(m)); }) : request(m);
    t.G.player.x = 9; const saving = t.saver.save(); t.flags.save = true; eq(t.saver.flushNow(), false, 'เกิดข้อผิดพลาดระหว่างรอ');
    await release(); await saving; eq(t.events.at(-1)?.error, 'save-incomplete', 'ackเก่าห้ามล้างป้ายผิดพลาดใหม่');
  })],
  ['SAVE-SAFE ระบบใหม่ที่ส่งข้อมูลครั้งแรกต้องไม่หายจาก flush ระหว่างรอ ACK', quiet(async () => {
    const t = setup(); t.systems.push({ id: 'newbag', save: g => g.newbag }); await t.saver.load();
    const request = t.io.request; let release; t.io.request = m => m.t === 'save' ? new Promise(resolve => { release = async () => resolve(await request(m)); }) : request(m);
    t.G.newbag = { gem: 1 }; const saving = t.saver.save(); t.G.newbag = undefined; t.G.player.x = 10;
    eq(t.saver.flushNow(), false, 'เคยอยู่ในsnapshotที่กำลังส่งแล้ว ห้ามทิ้ง'); eq(t.io.beacons.length, 0, 'ไม่มีflushบางส่วน'); await release(); await saving;
  })],
  ['SAVE-SAFE เริ่มโหลดใหม่แต่โหลดไม่ครบ ACK ของเซฟก่อนหน้าต้องไม่ยืนยัน baseline หรือปลดเซฟ', quiet(async () => {
    const t = setup(); await t.saver.load(); const baseline = t.saver.state.last, request = t.io.request; let release;
    t.io.request = m => m.t === 'save' ? new Promise(resolve => { release = async () => resolve(await request(m)); }) : request(m);
    t.G.player.x = 9; const saving = t.saver.save(); t.flags.load = true; await rejects(() => t.saver.load());
    await release(); await saving; eq(t.saver.state.loaded, false, 'ยังโหลดไม่ครบ'); eq(t.saver.state.last, baseline, 'ไม่ใช้baselineของเซฟก่อนโหลด'); eq(t.events.at(-1)?.error, 'load-incomplete', 'ป้ายยังอยู่'); eq(await t.saver.save(), 'wait', 'ไม่เซฟ'); eq(t.saver.flushNow(), false, 'ไม่flush');
  })],
  ['SAVE-SAFE ข้อความไทยแยกโหลดไม่ครบกับเก็บข้อมูลไม่ครบ', () => {
    for (const code of ['load-incomplete', 'save-incomplete']) ok(/[ก-๙]/.test(saveErrText(code)) && /ไม่ครบ/.test(saveErrText(code)), 'ป้ายไทย '+code);
  }],
];
