/* เทสฝั่งเกม 1B: core/save (รวม/โหลด/ลำดับ seq/เงินอ่านอย่างเดียว) + core/net (ต่อ/เวลา/โทเคน/โดนเตะ/ต่อใหม่)
   ใช้ WebSocket ปลอม ไม่ต่อเน็ตจริง · รัน: node v6/tests/run.cjs save */
import { on, _reset as busReset } from '../src/core/bus.js';
import { createState } from '../src/core/state.js';
import { collect, applyLoad, createSaver, MIN_GAP_MS } from '../src/core/save.js';
import * as net from '../src/core/net.js';
import { srvNow } from '../src/core/time.js';
import { checkForm, viewOf, errText } from '../src/systems/login.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { memoryStore } = require('../server/store.cjs');
const { createAccounts } = require('../server/accounts.cjs');
const { createSaves } = require('../server/saves.cjs');
const { createProto } = require('../server/proto.cjs');

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${JSON.stringify(a)} ต้องเป็น ${JSON.stringify(b)}`); };
const truthy = (v, m) => { if (!v) throw new Error(m); };
const tick = () => new Promise(r => setTimeout(r, 0));

/* ระบบตัวอย่าง */
const sysA = { id: 'alpha', save: G => ({ x: G.player.x }), load: (G, d) => { G.player.x = d ? d.x : 7; } };
const sysB = { id: 'beta', save: () => undefined };
const sysBoom = { id: 'boom', save: () => { throw new Error('x'); }, load: () => { throw new Error('y'); } };
const SYS = [sysA, sysB, sysBoom, { id: 'nosave' }];

/* ตัวส่งปลอม: เก็บคำขอ ตอบตามฟังก์ชันที่ตั้ง */
function fakeIo(answer) {
  const io = { sent: [], ready: () => io.isReady, isReady: true, beacons: [] };
  io.request = async msg => { io.sent.push(msg); return answer(msg, io); };
  io.send = msg => { io.beacons.push(msg); return true; };
  return io;
}
function fakeTimer() {
  const t = { ms: 1e6, jobs: [], now: () => t.ms, set: (fn, ms) => { t.jobs.push({ fn, at: t.ms + ms }); return t.jobs.length; }, clear: () => {} };
  t.run = async ms => { t.ms += ms; const due = t.jobs.filter(j => j.at <= t.ms); t.jobs = t.jobs.filter(j => j.at > t.ms); for (const j of due) await j.fn(); await tick(); };
  return t;
}
const quiet = fn => async () => { const e = console.error; console.error = () => {}; try { await fn(); } finally { console.error = e; } };

/* WebSocket ปลอมสำหรับ net */
class FakeWS {
  static all = [];
  constructor(url) { this.url = url; this.readyState = 1; this.out = []; FakeWS.all.push(this); }
  send(s) { this.out.push(JSON.parse(s)); }
  close() { if (this.readyState === 3) return; this.readyState = 3; this.onclose && this.onclose(); }
  srv(o) { this.onmessage && this.onmessage({ data: JSON.stringify(o) }); }
  last(t) { return [...this.out].reverse().find(m => m.t === t); }
}
const lastWs = () => FakeWS.all[FakeWS.all.length - 1];

export default [
  ['collect: รวม save() ทุกระบบ · undefined ไม่เก็บ · ระบบพังไม่ทำให้ตัวอื่นหาย', quiet(() => {
    const G = createState(); G.player.x = 3;
    const d = collect(G, SYS);
    eq(JSON.stringify(d), '{"alpha":{"x":3}}', 'ผล');
  })],
  ['applyLoad: ส่ง data ตาม id · ตัวใหม่ได้ undefined · เงินมาจาก server.coin เท่านั้น', quiet(() => {
    const G = createState();
    eq(applyLoad(G, SYS, { seq: 0, systems: {}, server: { coin: 0 } }), true, 'ตัวใหม่');
    eq(G.player.x, 7, 'ค่าเริ่ม');
    eq(applyLoad(G, SYS, { seq: 4, systems: { alpha: { x: 9 }, coin: 1e9 }, server: { coin: 250 } }), false, 'ตัวเดิม');
    eq(G.player.x, 9, 'x'); eq(G.player.coin, 250, 'coin');
    applyLoad(G, SYS, { seq: 5, systems: {}, server: { coin: 'x' } });
    eq(G.player.coin, 0, 'coin เพี้ยน → 0');
  })],
  ['saver: ยังไม่โหลดห้ามเซฟ · โหลดแล้วไม่มีอะไรเปลี่ยน = ไม่ส่ง · เปลี่ยนแล้วส่ง seq ถัดไป · ไม่ส่งเงิน', async () => {
    busReset();
    const G = createState(), T = fakeTimer();
    const io = fakeIo(m => m.t === 'load' ? { t: 'load', doc: { seq: 4, systems: { alpha: { x: 2 } }, server: { coin: 10 } } } : { t: 'save_ok', seq: m.seq });
    const sv = createSaver(G, [sysA], io, T);
    eq(await sv.save(), 'wait', 'ก่อนโหลด');
    eq(io.sent.length, 0, 'ไม่ส่งก่อนโหลด');
    let loaded = null; on('save:loaded', d => { loaded = d; });
    await sv.load();
    eq(loaded && loaded.isNew, false, 'save:loaded'); eq(G.player.x, 2, 'x'); eq(G.player.coin, 10, 'coin');
    eq(await sv.save(), 'same', 'ไม่เปลี่ยน');
    G.player.x = 5; G.player.coin = 999999;
    let st = null; on('save:status', d => { st = d; });
    eq(await sv.save(), 'sent', 'ส่ง');
    const s = io.sent[1];
    eq(s.seq, 5, 'seq ต่อจากเซฟ'); eq(s.systems.alpha.x, 5, 'ข้อมูล');
    truthy(!JSON.stringify(s).includes('999999'), 'ห้ามส่งเงิน');
    eq(st && st.ok, true, 'save:status ok');
  }],
  ['saver: ถี่เกินเว้น 1.1 วิ · ตอบ old → หยุดเซฟแล้วโหลดใหม่ (ไม่ข้าม seq ส่งทับ · H3) · ตอบ rate → ลองใหม่ · หลุด → status offline แล้วส่งเมื่อพร้อม', async () => {
    busReset();
    const G = createState(), T = fakeTimer();
    let mode = 'ok', loadSeq = 1;
    const io = fakeIo(m => {
      if (m.t === 'load') return { t: 'load', doc: { seq: loadSeq, systems: { alpha: { x: 30 } }, server: { coin: 0 } } };
      if (mode === 'old') { mode = 'ok'; return { t: 'save_no', why: 'old', seq: 40 }; }
      if (mode === 'rate') { mode = 'ok'; return { t: 'save_no', why: 'rate' }; }
      if (mode === 'down') throw new Error('offline');
      return { t: 'save_ok', seq: m.seq };
    });
    const sv = createSaver(G, [sysA], io, T);
    await sv.load();
    G.player.x = 1; await sv.save();
    G.player.x = 2; eq(await sv.save(), 'wait', 'ถี่เกิน');
    await T.run(MIN_GAP_MS);
    eq(io.sent.filter(m => m.t === 'save').length, 2, 'ส่งเมื่อครบเวลา');
    mode = 'old'; loadSeq = 40; G.player.x = 3; await T.run(MIN_GAP_MS); await sv.save(); await tick();
    await T.run(MIN_GAP_MS);
    const saves = io.sent.filter(m => m.t === 'save');
    eq(saves.filter(m => m.systems.alpha.x === 3).length, 1, 'ของเก่า (x=3) ไม่ถูกส่งซ้ำหลัง old');
    eq(io.sent.filter(m => m.t === 'load').length, 2, 'โหลดใหม่จากเซิร์ฟเวอร์');
    eq(G.player.x, 30, 'ใช้ของบนเซิร์ฟเวอร์'); eq(sv.state.seq, 40, 'seq ตามเซิร์ฟเวอร์'); eq(sv.state.loaded, true, 'เซฟต่อได้');
    mode = 'rate'; G.player.x = 4; await T.run(MIN_GAP_MS); await sv.save();
    await T.run(MIN_GAP_MS);
    eq(io.sent.filter(m => m.t === 'save').pop().systems.alpha.x, 4, 'ส่งซ้ำหลัง rate');
    let st = null; on('save:status', d => { st = d; });
    mode = 'down'; G.player.x = 5; await T.run(MIN_GAP_MS); await sv.save();
    eq(st && st.ok === false && st.error, 'offline', 'status offline');
    io.isReady = false; mode = 'ok'; await T.run(MIN_GAP_MS);
    eq(await sv.save(), 'wait', 'ยังไม่พร้อม');
    io.isReady = true; await sv.save();
    const lastSave = io.sent.filter(m => m.t === 'save').pop();
    eq(lastSave.systems.alpha.x, 5, 'ส่งเมื่อต่อได้'); eq(st.ok, true, 'status ok');
    truthy(saves.every((m, i) => i === 0 || m.seq > saves[i - 1].seq), 'seq เพิ่มเสมอ');
  }],
  ['saver: ปิดหน้า (flushNow) ส่งทันทีถ้ามีของเปลี่ยน · ไม่เปลี่ยนไม่ส่ง', async () => {
    busReset();
    const G = createState(), T = fakeTimer();
    const io = fakeIo(m => m.t === 'load' ? { t: 'load', doc: { seq: 2, systems: {}, server: {} } } : { t: 'save_ok', seq: m.seq });
    const sv = createSaver(G, [sysA], io, T);
    eq(sv.flushNow(), false, 'ก่อนโหลด');
    await sv.load();
    eq(sv.flushNow(), false, 'ไม่เปลี่ยน');
    G.player.x = 8;
    eq(sv.flushNow(), true, 'ส่ง');
    eq(io.beacons[0].seq, 3, 'seq'); eq(io.beacons[0].systems.alpha.x, 8, 'ข้อมูล');
  }],

  /* ---------- net ---------- */
  ['net: welcome ตั้งเวลาเซิร์ฟเวอร์ · ไม่มีโทเคน → หน้าล็อกอิน · login สำเร็จ → net:auth ครั้งเดียว + จำโทเคน', async () => {
    busReset(); FakeWS.all = [];
    const G = createState();
    const auths = [], status = [];
    on('net:auth', d => auths.push(d)); on('net:status', d => status.push(d.online));
    net.connect(G, { url: 'ws://x/v6ws', WebSocket: FakeWS });
    try {
      eq(G.net.phase, 'connecting', 'กำลังต่อ');
      const w = lastWs();
      w.srv({ t: 'welcome', v: 1, s: Date.now() + 3600e3 });
      await tick();
      truthy(Math.abs(srvNow() - (Date.now() + 3600e3)) < 1000, 'srvNow ตามเซิร์ฟเวอร์');
      eq(G.net.online, true, 'online'); eq(status[0], true, 'net:status');
      eq(G.net.phase, 'login', 'ต้องล็อกอิน');
      const tm = w.last('time'); truthy(tm, 'ขอเวลา');
      w.srv({ t: 'time', r: tm.r, c: tm.c, s: Date.now() + 7200e3 });
      await tick();
      truthy(Math.abs(srvNow() - (Date.now() + 7200e3)) < 1000, 'ซิงก์เวลาจาก time');
      const p = net.login('Hero1', 'abc123');
      eq(G.net.phase, 'authing', 'กำลังตรวจ');
      const lm = w.last('login'); eq(lm.id, 'Hero1', 'id');
      w.srv({ t: 'auth_no', r: lm.r, why: 'locked', sec: 20 });
      const bad = await p;
      eq(bad.err, 'locked', 'err'); eq(bad.sec, 20, 'sec'); eq(G.net.phase, 'login', 'กลับฟอร์ม');
      const p2 = net.login('Hero1', 'abc123');
      w.srv({ t: 'auth_ok', r: w.last('login').r, id: 'Hero1', name: 'ฮี', gm: false, token: 'a'.repeat(48) });
      eq((await p2).ok, true, 'ok');
      eq(G.net.phase, 'ready', 'พร้อม'); eq(net.isReady(), true, 'isReady');
      eq(auths.length, 1, 'net:auth'); eq(auths[0].name, 'ฮี', 'ชื่อ');
      eq(net.readAcct().token, 'a'.repeat(48), 'จำโทเคน');
      /* หลุด → ต่อใหม่เอง → hello ด้วยโทเคน · ไม่ส่ง net:auth ซ้ำ (ไม่โหลดเซฟทับ) */
      w.close();
      eq(G.net.online, false, 'หลุด'); eq(G.net.phase, 'offline', 'offline');
      await new Promise(r => setTimeout(r, 1100));
      const w2 = lastWs(); truthy(w2 !== w, 'ต่อใหม่');
      w2.srv({ t: 'welcome', v: 1, s: Date.now() }); await tick();
      const h = w2.last('hello'); eq(h && h.token, 'a'.repeat(48), 'hello ด้วยโทเคน');
      w2.srv({ t: 'auth_ok', r: h.r, id: 'Hero1', name: 'ฮี', gm: false }); await tick();
      eq(G.net.phase, 'ready', 'พร้อมอีกครั้ง'); eq(auths.length, 1, 'net:auth ไม่ซ้ำ');
    } finally { net._reset(); }
  }],
  ['net: เปิดเกมใหม่มีโทเคน → เข้าเอง · ถูกเข้าซ้อน (dupe) → net:kicked ไม่ต่อใหม่ · โทเคนหมดอายุ → หน้าล็อกอิน', async () => {
    busReset(); FakeWS.all = [];
    let G = createState();
    const kicks = [];
    on('net:kicked', d => kicks.push(d.reason));
    /* เตรียมโทเคนที่จำไว้ */
    net.connect(G, { url: 'ws://x/v6ws', WebSocket: FakeWS });
    let w = lastWs(); w.srv({ t: 'welcome', s: Date.now() }); await tick();
    const p = net.login('dupe1', 'abc123');
    w.srv({ t: 'auth_ok', r: w.last('login').r, id: 'dupe1', name: 'd', token: 'b'.repeat(48) }); await p;
    const remembered = net.readAcct();
    net._reset();
    try {
      /* เปิดหน้าใหม่ (จำลอง localStorage ด้วยการเขียนกลับ) */
      globalThis.localStorage = { m: { 'eld6:acct': JSON.stringify(remembered) }, getItem(k) { return this.m[k] ?? null; }, setItem(k, v) { this.m[k] = v; }, removeItem(k) { delete this.m[k]; } };
      G = createState();
      net.connect(G, { url: 'ws://x/v6ws', WebSocket: FakeWS });
      w = lastWs(); w.srv({ t: 'welcome', s: Date.now() }); await tick();
      const h = w.last('hello'); eq(h && h.id, 'dupe1', 'เข้าเองด้วยโทเคน');
      w.srv({ t: 'auth_ok', r: h.r, id: 'dupe1', name: 'd' }); await tick();
      eq(G.net.phase, 'ready', 'พร้อม');
      const n = FakeWS.all.length;
      w.srv({ t: 'dupe' });
      eq(G.net.phase, 'kicked', 'kicked'); eq(kicks[0], 'dupe', 'net:kicked dupe');
      await new Promise(r => setTimeout(r, 1200));
      eq(FakeWS.all.length, n, 'ไม่ต่อใหม่หลังโดนเตะ');
      net._reset();
      /* โทเคนหมดอายุ ตอนเปิดเกม → ฟอร์ม ไม่ใช่เตะ + ลืมโทเคน */
      G = createState();
      net.connect(G, { url: 'ws://x/v6ws', WebSocket: FakeWS });
      w = lastWs(); w.srv({ t: 'welcome', s: Date.now() }); await tick();
      w.srv({ t: 'auth_no', r: w.last('hello').r, why: 'auth' }); await tick();
      eq(G.net.phase, 'login', 'หน้าล็อกอิน'); eq(kicks.length, 1, 'ไม่ใช่เตะ');
      eq(net.readAcct(), null, 'ลืมโทเคน');
    } finally { net._reset(); delete globalThis.localStorage; }
  }],

  ['net: หน้าเว็บไม่มีป้าย data-v6-server (dev-server) → ไม่ต่อ ws · phase nosrv', () => {
    FakeWS.all = [];
    const doc = v => ({ documentElement: { dataset: v ? { v6Server: '1' } : {} } });
    eq(net.hasServer(doc(true)), true, 'มีป้าย'); eq(net.hasServer(doc(false)), false, 'ไม่มีป้าย');
    const G = createState();
    globalThis.document = doc(false); globalThis.WebSocket = FakeWS;
    try { net.connect(G); eq(G.net.phase, 'nosrv', 'phase'); eq(FakeWS.all.length, 0, 'ไม่ต่อ ws'); }
    finally { net._reset(); delete globalThis.document; delete globalThis.WebSocket; }
  }],

  /* ---------- หน้าล็อกอิน (ฟังก์ชันล้วน) ---------- */
  ['login: ตรวจฟอร์ม · ข้อความไทย · หน้าจอตามสถานะ (ต่อไม่ได้ = ป้ายเล็ก ไม่บังจอ)', () => {
    eq(checkForm('login', { id: 'ab', pw: 'x' }), 'bad-id', 'ไอดีสั้น');
    eq(checkForm('login', { id: 'abc', pw: '' }), 'wrong', 'ไม่ใส่รหัส');
    eq(checkForm('register', { id: 'abc', pw: '12345', pw2: '12345' }), 'bad-pw', 'รหัสสั้น');
    eq(checkForm('register', { id: 'abc', pw: '123456', pw2: '123457' }), 'mismatch', 'ไม่ตรง');
    eq(checkForm('register', { id: 'ผู้เล่น1', pw: '123456', pw2: '123456' }), null, 'ผ่าน');
    eq(errText('locked', 40), 'ใส่รหัสผิดบ่อยเกินไป รออีก 40 วินาที', 'locked');
    truthy(/[ก-๙]/.test(errText('???')), 'ไม่รู้จัก → ข้อความไทย');
    eq(viewOf('connecting', false), 'banner', 'กำลังต่อ');
    eq(viewOf('offline', false), 'banner', 'ต่อไม่ได้');
    eq(viewOf('login', false), 'form', 'ฟอร์ม');
    eq(viewOf('authing', false, true), 'form', 'กดส่งฟอร์มอยู่');
    eq(viewOf('ready', false), 'wait', 'โหลดเซฟ');
    eq(viewOf('ready', true), 'none', 'เล่นได้');
    eq(viewOf('authing', true), 'banner', 'ต่อใหม่ระหว่างเล่น');
    eq(viewOf('kicked', true), 'kicked', 'โดนเตะ');
    eq(viewOf('nosrv', false), 'banner', 'dev-server ไม่บังจอ');
  }],

  /* ---------- 1B-f H3: เครื่องเก่าต่อใหม่ต้องไม่เขียนทับเซฟที่ใหม่กว่า (ใช้ createSaver + proto/saves จริงของเซิร์ฟเวอร์) ---------- */
  ['H3: เครื่อง A หลุด → B เล่น+เซฟ → A ต่อใหม่ (hello) แล้วเซฟ → เซิร์ฟเวอร์ยังเป็นของ B · A โหลดของ B มาแทน', quiet(async () => {
    busReset();
    const c = { t: 1.8e12 }, now = () => c.t, store = memoryStore();
    const accounts = createAccounts({ store, env: { GM_IDS: 'tiksi' }, now });
    const proto = createProto({ accounts, saves: createSaves({ store, now }), now });
    let ipN = 0;
    const conn = () => { const k = { ip: '10.9.0.' + (++ipN), out: [], send(o) { this.out.push(o); }, close() { this.closedFlag = true; } }; proto.open(k); return k; };
    const say = async (k, o) => { await proto.message(k, JSON.stringify(o)); return k.out[k.out.length - 1]; };
    /* io ของ saver ที่คุยกับ proto จริงผ่านการเชื่อมต่อปลอม (เปลี่ยนการเชื่อมต่อได้ = ต่อใหม่) */
    const mkIo = k => { const io = { k, n: 0 }; io.ready = () => !!io.k && !io.k.closedFlag;
      io.request = async m => { const r = 'q' + (++io.n); await proto.message(io.k, JSON.stringify({ ...m, r })); return io.k.out.filter(x => x.r === r).pop(); };
      io.send = m => { proto.message(io.k, JSON.stringify(m)); return true; }; return io; };
    const sys = [{ id: 'bag', save: G => ({ who: G.player.name }), load: (G, d) => { G.player.name = d ? d.who : 'new'; } }];
    /* A สมัคร โหลด เซฟ A1 */
    const kA = conn(); const reg = await say(kA, { t: 'register', id: 'h3dev', pw: 'abc123' });
    const GA = createState(), ioA = mkIo(kA), TA = fakeTimer(), A = createSaver(GA, sys, ioA, TA);
    await A.load(); GA.player.name = 'A1'; eq(await A.save(), 'sent', 'A1'); 
    /* A หลุด · B ล็อกอิน (เครื่องใหม่) โหลด เซฟ B2 */
    proto.closed(kA); kA.closedFlag = true; c.t += 2000;
    const kB = conn(); eq((await say(kB, { t: 'login', id: 'h3dev', pw: 'abc123' })).t, 'auth_ok', 'B login');
    const GB = createState(), B = createSaver(GB, sys, mkIo(kB), fakeTimer());
    await B.load(); eq(GB.player.name, 'A1', 'B เห็น A1');
    GB.player.name = 'B2'; c.t += 2000; eq(await B.save(), 'sent', 'B2');
    /* A ต่อใหม่ด้วยโทเคนเดิม (hello เตะ B) แล้วเซฟของเก่า */
    c.t += 2000; const kA2 = conn(); eq((await say(kA2, { t: 'hello', id: 'h3dev', token: reg.token })).t, 'auth_ok', 'A hello');
    ioA.k = kA2; GA.player.name = 'A2-stale'; TA.ms += 5000;
    for (let i = 0; i < 4; i++) { c.t += 2000; TA.ms += 2000; await A.save(); await TA.run(2000); }
    const k3 = conn(); await say(k3, { t: 'login', id: 'h3dev', pw: 'abc123' });
    const doc = (await say(k3, { t: 'load', sid: 'f'.repeat(32) })).doc;
    eq(doc.systems.bag.who, 'B2', 'เซฟบนเซิร์ฟเวอร์ต้องยังเป็นของ B (ห้ามโดนทับด้วยของเก่า)');
    eq(GA.player.name, 'B2', 'เครื่อง A โหลดของใหม่จากเซิร์ฟเวอร์มาแทน');
  })],
  ['H3: เซิร์ฟเวอร์ปฏิเสธเซฟจากเซสชันที่ไม่ใช่ผู้เขียนล่าสุด (sid ไม่ตรง → replaced) แม้ seq สูงกว่า', async () => {
    const c = { t: 1.8e12 }, now = () => c.t, store = memoryStore();
    const saves = createSaves({ store, now });
    const sA = 'a'.repeat(32), sB = 'b'.repeat(32);
    await saves.load('w1', sA);
    eq((await saves.save('w1', { seq: 1, sid: sA, systems: { x: { v: 1 } } })).ok, true, 'A เขียน');
    await saves.load('w1', sB); c.t += 2000;
    eq((await saves.save('w1', { seq: 99, sid: sA, systems: { x: { v: 'stale' } } })).err, 'replaced', 'A ถูกแทนที่แล้ว');
    c.t += 2000;
    eq((await saves.save('w1', { seq: 2, sid: sB, systems: { x: { v: 2 } } })).ok, true, 'B เขียนได้');
    eq((await saves.load('w1', sB)).systems.x.v, 2, 'ของ B');
  }],
  ['saver: ตัวจับเวลาเริ่มต้นเรียก setTimeout แบบไม่ผูก this (เบราว์เซอร์ฟ้อง Illegal invocation · ต้นเหตุ login.spec พังสุ่ม)', async () => {
    busReset();
    const real = globalThis.setTimeout;
    let illegal = 0;
    globalThis.setTimeout = function (fn, ms, ...a) { if (this !== undefined && this !== globalThis) { illegal++; throw new TypeError('Illegal invocation'); } return real(fn, ms, ...a); };
    try {
      const G = createState();
      const io = fakeIo(m => m.t === 'load' ? { t: 'load', doc: { seq: 1, systems: {}, server: {} } } : { t: 'save_ok', seq: m.seq });
      const sv = createSaver(G, [sysA], io); /* ตัวจับเวลาเริ่มต้น */
      await sv.load();
      G.player.x = 1; await sv.save();
      G.player.x = 2; eq(await sv.save(), 'wait', 'ถี่เกิน → รอ (เรียก later → setTimeout)');
      eq(illegal, 0, 'ต้องไม่เรียก setTimeout ผ่าน this ของอ็อบเจกต์อื่น');
    } finally { globalThis.setTimeout = real; }
  }],
];
