/* เทสฝั่งเกม 1B: core/save (รวม/โหลด/ลำดับ seq/เงินอ่านอย่างเดียว) + core/net (ต่อ/เวลา/โทเคน/โดนเตะ/ต่อใหม่)
   ใช้ WebSocket ปลอม ไม่ต่อเน็ตจริง · รัน: node v6/tests/run.cjs save */
import { on, _reset as busReset } from '../src/core/bus.js';
import { createState } from '../src/core/state.js';
import { collect, applyLoad, createSaver, MIN_GAP_MS } from '../src/core/save.js';
import * as net from '../src/core/net.js';
import { srvNow } from '../src/core/time.js';
import { checkForm, viewOf, errText, saveErrText, KICK_TH } from '../src/systems/login.js';
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

  /* ---------- 1B-g N2: เซิร์ฟเวอร์ busy ต้องบอกผู้เล่น + ถอยเวลา ---------- */
  ['N2: เซิร์ฟเวอร์ตอบ busy → save:status(false,busy) + ข้อความไทย · ถอย 5→10 วิ (ไม่ยิงทุก 1.1 วิ · เซฟอัตโนมัติไม่ลัดคิว) · สำเร็จแล้วกลับปกติ', async () => {
    busReset();
    const G = createState(), T = fakeTimer();
    let busy = 2;
    const io = fakeIo(m => m.t === 'load' ? { t: 'load', doc: { seq: 1, systems: {}, server: {} } }
      : busy > 0 ? (busy--, { t: 'err', why: 'busy', r: m.r }) : { t: 'save_ok', seq: m.seq });
    const st = []; on('save:status', d => st.push(d));
    const sv = createSaver(G, [sysA], io, T);
    await sv.load();
    const sent = () => io.sent.filter(m => m.t === 'save').length;
    G.player.x = 11; await sv.save();
    eq(sent(), 1, 'ส่งครั้งแรก');
    const s0 = st[st.length - 1];
    eq(s0 && s0.ok === false && s0.error, 'busy', 'แจ้ง save:status busy');
    truthy(/[ก-๙]/.test(saveErrText('busy')) && /ยังไม่ได้บันทึก/.test(saveErrText('busy')), 'ผู้เล่นเห็นข้อความไทย');
    eq(saveErrText('offline'), '', 'offline มีป้ายของมันเองแล้ว');
    for (let i = 0; i < 4; i++) await T.run(1100);
    eq(sent(), 1, 'ภายใน 5 วิ ไม่ยิงซ้ำ (เดิมทุก 1.1 วิ)');
    eq(await sv.save(), 'wait', 'เซฟอัตโนมัติ/คำขอเซฟ ไม่ลัดคิวช่วงถอย');
    await T.run(700);
    eq(sent(), 2, 'ครบ 5 วิ ลองใหม่');
    eq(st[st.length - 1].error, 'busy', 'busy อีก');
    await T.run(9000); eq(sent(), 2, 'รอบสองถอย 10 วิ');
    await T.run(1100); eq(sent(), 3, 'ครบ 10 วิ ลองใหม่');
    eq(st[st.length - 1].ok, true, 'สำเร็จ → status ok');
    eq(sv.state.busyN, 0, 'ล้างตัวนับถอย');
    G.player.x = 12; await T.run(1100); await sv.save(); eq(sent(), 4, 'กลับมาเซฟปกติ');
  }],

  ['1Z L1: ถูกแทนที่ (replaced) แล้วโหลดใหม่ได้ busy → ถอยเวลา 5→10→20 วิ (ไม่ลองทุก 5 วิ) + ป้ายไทย · โหลดได้แล้วเซฟต่อ', async () => {
    busReset();
    const G = createState(), T = fakeTimer();
    let loads = 0, busyLoads = 0;
    const io = fakeIo(m => {
      if (m.t === 'load') { loads++; if (loads === 1) return { t: 'load', doc: { seq: 1, systems: {}, server: {} } }; if (busyLoads-- > 0) return { t: 'err', why: 'busy', r: m.r }; return { t: 'load', doc: { seq: 7, systems: { alpha: { x: 70 } }, server: {} } }; }
      return loads === 1 ? { t: 'save_no', why: 'replaced', seq: 6 } : { t: 'save_ok', seq: m.seq };
    });
    const st = []; on('save:status', d => st.push(d));
    const sv = createSaver(G, [sysA], io, T);
    await sv.load();
    busyLoads = 3;
    G.player.x = 1; await sv.save(); await tick(); await tick();
    eq(st[0].error, 'replaced', 'แจ้ง replaced');
    truthy(/[ก-๙]/.test(saveErrText('replaced')) && /[ก-๙]/.test(saveErrText('old')), 'replaced/old มีป้ายไทย');
    eq(loads, 2, 'โหลดใหม่ทันที 1 ครั้ง');
    eq(st[st.length - 1].error, 'busy', 'โหลดไม่ผ่าน → ป้าย busy');
    await T.run(5000); eq(loads, 3, 'ลองใหม่ที่ 5 วิ');
    await T.run(5000); eq(loads, 3, 'รอบสองไม่ใช่ 5 วิ (ถอยเวลา)');
    await T.run(5000); eq(loads, 4, 'รอบสอง 10 วิ');
    await T.run(15000); eq(loads, 4, 'รอบสามยังไม่ถึง 20 วิ');
    await T.run(5000); eq(loads, 5, 'รอบสาม 20 วิ → โหลดได้');
    eq(sv.state.loaded, true, 'โหลดสำเร็จ'); eq(G.player.x, 70, 'ใช้ของบนเซิร์ฟเวอร์');
  }],

  /* ---------- 1B-g N3: ต่อใหม่เองห้ามเตะเครื่องที่กำลังเล่นอยู่ ---------- */
  ['N3: A พักแท็บ (หลุด) → B ล็อกอินเล่น+เซฟ → A ตื่นต่อใหม่เอง → B เล่นต่อได้ (ไม่โดน dupe) · A หยุดพร้อมข้อความไทย · กด "เล่นที่เครื่องนี้แทน" ถึงเตะ B', quiet(async () => {
    busReset(); FakeWS.all = [];
    const c = { t: 1.8e12 }, now = () => c.t, store = memoryStore();
    const accounts = createAccounts({ store, env: {}, now });
    const proto = createProto({ accounts, saves: createSaves({ store, now }), now, authTimeoutMs: 0 });
    let ipN = 0;
    /* WebSocket ปลอมที่คุยกับ proto จริง (เครื่อง A ใช้ core/net จริง) */
    class Bridge {
      constructor() {
        this.readyState = 1; Bridge.last = this;
        this.k = { ip: '10.33.0.' + (++ipN), out: [], send: o => { this.k.out.push(o); setTimeout(() => this.onmessage && this.onmessage({ data: JSON.stringify(o) }), 0); }, close: () => this.drop() };
        setTimeout(() => proto.open(this.k), 0);
      }
      send(x) { proto.message(this.k, x); }
      close() { this.drop(); }
      drop() { if (this.readyState === 3) return; this.readyState = 3; proto.closed(this.k); setTimeout(() => this.onclose && this.onclose(), 0); }
    }
    const raw = () => { const k = { ip: '10.34.0.' + (++ipN), out: [], send(o) { this.out.push(o); }, close() { this.closedFlag = true; } }; proto.open(k); return k; };
    const say = async (k, o) => { await proto.message(k, JSON.stringify(o)); return k.out[k.out.length - 1]; };
    const until = async (f, ms = 3000) => { const t0 = Date.now(); while (!f()) { if (Date.now() - t0 > ms) throw new Error('รอนานเกิน'); await new Promise(r => setTimeout(r, 10)); } };
    globalThis.localStorage = { m: {}, getItem(k) { return this.m[k] ?? null; }, setItem(k, v) { this.m[k] = v; }, removeItem(k) { delete this.m[k]; } };
    const kicks = []; on('net:kicked', d => kicks.push(d.reason));
    const sys = [{ id: 'bag', save: G => ({ who: G.player.name }), load: (G, d) => { G.player.name = d ? d.who : 'new'; } }];
    try {
      /* เครื่อง A: สมัคร โหลด เซฟ A1 */
      const GA = createState();
      net.connect(GA, { url: 'ws://x/v6ws', WebSocket: Bridge });
      await until(() => GA.net.phase === 'login');
      eq((await net.register('n3dev', 'abc123')).ok, true, 'A สมัคร');
      const A = createSaver(GA, sys, { request: net.request, send: net.send, ready: net.isReady, setSid: net.setResumeSid });
      await A.load(); GA.player.name = 'A1'; await A.save();
      /* A พักแท็บ: ซ็อกเก็ตหลุด (ยังไม่ต่อใหม่จนกว่าจะครบ 1 วิ) */
      Bridge.last.drop();
      /* เครื่อง B: พิมพ์รหัสเข้า โหลด เล่น เซฟ B2 */
      c.t += 2000;
      const kB = raw();
      eq((await say(kB, { t: 'login', id: 'n3dev', pw: 'abc123' })).t, 'auth_ok', 'B ล็อกอิน');
      const sB = 'b'.repeat(32);
      eq((await say(kB, { t: 'load', sid: sB })).doc.systems.bag.who, 'A1', 'B เห็น A1');
      c.t += 2000; eq((await say(kB, { t: 'save', seq: 5, sid: sB, systems: { bag: { who: 'B2' } } })).t, 'save_ok', 'B เซฟ');
      /* A ตื่น → ต่อใหม่เอง */
      await until(() => GA.net.phase === 'kicked', 4000);
      eq(kicks[kicks.length - 1], 'replaced', 'A ได้ replaced');
      truthy(!kB.out.some(o => o.t === 'dupe') && !kB.closedFlag, 'B ต้องไม่โดนเตะ');
      c.t += 2000; eq((await say(kB, { t: 'save', seq: 6, sid: sB, systems: { bag: { who: 'B3' } } })).t, 'save_ok', 'B เล่น/เซฟต่อได้');
      truthy(net.readAcct() && net.readAcct().id === 'n3dev', 'A ไม่ลืมโทเคน (กดเล่นต่อได้ไม่ต้องพิมพ์รหัส)');
      await new Promise(r => setTimeout(r, 1200));
      eq(Bridge.last.readyState, 3, 'A ไม่ต่อใหม่เองวนไป');
      truthy(/[ก-๙]/.test(KICK_TH.replaced) && /เครื่องอื่น/.test(KICK_TH.replaced), 'ข้อความไทยชัดเจน');
      eq(viewOf('kicked', true), 'kicked', 'บังจอถามผู้เล่น');
      /* ผู้เล่นกด "เล่นที่เครื่องนี้แทน" = รีโหลดหน้า → เปิดเกมใหม่ (ไม่มี resume) → ตั้งใจเล่นเครื่องนี้ → B ถูกเตะแบบเดิม */
      net._reset();
      const GA2 = createState();
      net.connect(GA2, { url: 'ws://x/v6ws', WebSocket: Bridge });
      await until(() => GA2.net.phase === 'ready');
      await until(() => kB.out.some(o => o.t === 'dupe'));
    } finally { net._reset(); delete globalThis.localStorage; }
  })],
  ['N3: เครื่องเดิมหลุดแล้วต่อใหม่ (ยังเป็นผู้เขียนล่าสุด) → เข้าต่อได้ · ไม่ส่ง resume ตอนเปิดเกมใหม่ · ต่อใหม่ส่ง resume + sid', async () => {
    const c = { t: 1.8e12 }, now = () => c.t, store = memoryStore();
    const accounts = createAccounts({ store, env: {}, now });
    const proto = createProto({ accounts, saves: createSaves({ store, now }), now, authTimeoutMs: 0 });
    let ipN = 0;
    const raw = () => { const k = { ip: '10.35.0.' + (++ipN), out: [], send(o) { this.out.push(o); }, close() { this.closedFlag = true; } }; proto.open(k); return k; };
    const say = async (k, o) => { await proto.message(k, JSON.stringify(o)); return k.out[k.out.length - 1]; };
    const k1 = raw(); const reg = await say(k1, { t: 'register', id: 'n3same', pw: 'abc123' });
    const sA = 'a'.repeat(32); await say(k1, { t: 'load', sid: sA });
    proto.closed(k1);
    const k2 = raw();
    eq((await say(k2, { t: 'hello', id: 'n3same', token: reg.token, resume: 1, sid: sA })).t, 'auth_ok', 'ผู้เขียนเดิมต่อใหม่ได้');
    c.t += 2000; eq((await say(k2, { t: 'save', seq: 1, sid: sA, systems: {} })).t, 'save_ok', 'เซฟต่อได้');
    const k3 = raw();
    eq((await say(k3, { t: 'hello', id: 'n3same', token: reg.token, resume: 1, sid: 'f'.repeat(32) })).why, 'replaced', 'sid ไม่ใช่ผู้เขียน → replaced');
    truthy(!k2.out.some(o => o.t === 'dupe'), 'เครื่องที่เล่นอยู่ไม่โดนเตะ');
    /* ฝั่งเกม: เปิดหน้าใหม่ไม่ส่ง resume · ต่อใหม่หลังโหลดส่ง resume + sid */
    busReset(); FakeWS.all = [];
    globalThis.localStorage = { m: { 'eld6:acct': JSON.stringify({ id: 'n3same', token: reg.token }) }, getItem(k) { return this.m[k] ?? null; }, setItem(k, v) { this.m[k] = v; }, removeItem(k) { delete this.m[k]; } };
    try {
      const G = createState();
      net.connect(G, { url: 'ws://x/v6ws', WebSocket: FakeWS });
      let w = lastWs(); w.srv({ t: 'welcome', s: Date.now() }); await tick();
      const h1 = w.last('hello'); eq(h1.resume, undefined, 'เปิดเกมใหม่ไม่ใช่ resume');
      w.srv({ t: 'auth_ok', r: h1.r, id: 'n3same', name: 'n' }); await tick();
      net.setResumeSid(sA);
      w.close(); await new Promise(r => setTimeout(r, 1100));
      w = lastWs(); w.srv({ t: 'welcome', s: Date.now() }); await tick();
      const h2 = w.last('hello'); eq(h2.resume, 1, 'ต่อใหม่ = resume'); eq(h2.sid, sA, 'ส่ง sid');
    } finally { net._reset(); delete globalThis.localStorage; }
  }],

  /* ---------- 1Z (ผลตรวจ 1B-g M2): B เพิ่งเปิดเกม (ยังโหลดไม่เสร็จ) → แท็บพักของ A ต่อใหม่เองห้ามเตะ B ---------- */
  ['1Z M2: B เปิดเกมใหม่ (hello) แต่ยังโหลดไม่เสร็จ → A ที่พักแท็บต่อใหม่เอง (net จริง) ได้ replaced · B ไม่โดน dupe และโหลด/เซฟต่อได้ · ซ็อกเก็ตเก่าของ A เอง (sid เดียวกัน) ไม่ขวาง', quiet(async () => {
    busReset(); FakeWS.all = [];
    const c = { t: 1.8e12 }, now = () => c.t, store = memoryStore();
    const accounts = createAccounts({ store, env: {}, now });
    const proto = createProto({ accounts, saves: createSaves({ store, now }), now, authTimeoutMs: 0 });
    let ipN = 0;
    class Bridge {
      constructor() {
        this.readyState = 1; Bridge.last = this;
        this.k = { ip: '10.36.0.' + (++ipN), out: [], send: o => { this.k.out.push(o); setTimeout(() => this.onmessage && this.onmessage({ data: JSON.stringify(o) }), 0); }, close: () => this.drop() };
        setTimeout(() => proto.open(this.k), 0);
      }
      send(x) { proto.message(this.k, x); }
      close() { this.drop(); }
      drop() { if (this.readyState === 3) return; this.readyState = 3; proto.closed(this.k); setTimeout(() => this.onclose && this.onclose(), 0); }
    }
    const raw = () => { const k = { ip: '10.37.0.' + (++ipN), out: [], send(o) { this.out.push(o); }, close() { this.closedFlag = true; } }; proto.open(k); return k; };
    const say = async (k, o) => { await proto.message(k, JSON.stringify(o)); return k.out[k.out.length - 1]; };
    const until = async (f, ms = 3000) => { const t0 = Date.now(); while (!f()) { if (Date.now() - t0 > ms) throw new Error('รอนานเกิน'); await new Promise(r => setTimeout(r, 10)); } };
    globalThis.localStorage = { m: {}, getItem(k) { return this.m[k] ?? null; }, setItem(k, v) { this.m[k] = v; }, removeItem(k) { delete this.m[k]; } };
    const kicks = []; on('net:kicked', d => kicks.push(d.reason));
    const sys = [{ id: 'bag', save: G => ({ who: G.player.name }), load: (G, d) => { G.player.name = d ? d.who : 'new'; } }];
    try {
      const GA = createState();
      net.connect(GA, { url: 'ws://x/v6ws', WebSocket: Bridge });
      await until(() => GA.net.phase === 'login');
      eq((await net.register('m2dev', 'abc123')).ok, true, 'A สมัคร');
      const A = createSaver(GA, sys, { request: net.request, send: net.send, ready: net.isReady, setSid: net.setResumeSid });
      await A.load(); GA.player.name = 'A1'; await A.save();
      const token = net.readAcct().token;
      Bridge.last.drop(); /* A พักแท็บ */
      /* B เปิดเกม (จำโทเคนไว้ → hello ไม่มี resume) แต่ยังไม่ได้โหลด (เช่น โหลดได้ busy แล้วรอถอยเวลา) */
      const kB = raw();
      eq((await say(kB, { t: 'hello', id: 'm2dev', token })).t, 'auth_ok', 'B เปิดเกม');
      /* A ตื่น → ต่อใหม่เอง (resume + sid ของ A ซึ่งยังเป็นผู้เขียนล่าสุดในที่เก็บ) */
      await until(() => GA.net.phase === 'kicked', 4000);
      eq(kicks[kicks.length - 1], 'replaced', 'A ได้ replaced (เครื่องที่เปิดใหม่ล่าสุดชนะ)');
      truthy(!kB.out.some(o => o.t === 'dupe') && !kB.closedFlag, 'B ต้องไม่โดนเตะ');
      const sB = 'b'.repeat(32);
      c.t += 6000; eq((await say(kB, { t: 'load', sid: sB })).doc.systems.bag.who, 'A1', 'B โหลดได้ เห็นของล่าสุดของ A');
      c.t += 2000; eq((await say(kB, { t: 'save', seq: 9, sid: sB, systems: { bag: { who: 'B1' } } })).t, 'save_ok', 'B เซฟได้');
      /* ซ็อกเก็ตเก่าของเครื่องเดียวกันที่เซิร์ฟเวอร์ยังไม่รู้ว่าหลุด (มือถือเปลี่ยนเน็ต) → ต่อใหม่ด้วย sid เดิมได้ */
      const k1 = raw(); const reg = await say(k1, { t: 'register', id: 'm2same', pw: 'abc123' });
      const sA = 'a'.repeat(32); await say(k1, { t: 'load', sid: sA });
      const k2 = raw();
      eq((await say(k2, { t: 'hello', id: 'm2same', token: reg.token, resume: 1, sid: sA })).t, 'auth_ok', 'sid เดียวกัน = เครื่องเดิม ต่อได้');
      truthy(k1.out.some(o => o.t === 'dupe'), 'ซ็อกเก็ตเก่าของตัวเองถูกปิด');
      c.t += 2000; eq((await say(k2, { t: 'save', seq: 1, sid: sA, systems: {} })).t, 'save_ok', 'เซฟต่อได้');
    } finally { net._reset(); delete globalThis.localStorage; }
  })],

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
