/* save — เซฟ/โหลดตัวละครกับเซิร์ฟเวอร์ (รูปแบบเดียว · CONTRACT §1 · ตารางข้อความ v6/server/PROTOCOL.md)
   เซฟ = { seq, systems:{ <id ระบบ>: ผลจาก save(G) } } · โหลด = เรียก load(G, data) ของทุกระบบตามลำดับใน systems/index.js
   - เงิน G.player.coin มาจาก doc.server.coin (เซิร์ฟเวอร์ถือ · เครื่องเราไม่ส่งเงินขึ้นไป · DECISIONS 2026-10-30)
   - เซฟเมื่อ: ทุก 30 วิ (ข้ามถ้าไม่มีอะไรเปลี่ยน) · อีเวนต์ save:request (รอ 0.3 วิ รวมหลายคำขอ) · ซ่อนแท็บ/ปิดหน้า
   - เซิร์ฟเวอร์รับไม่ถี่กว่า 1 ครั้ง/วิ → เว้นห่าง ≥1.1 วิ · seq เพิ่มทุกครั้งที่ส่ง
   - เซิร์ฟเวอร์ตอบ busy → save:status { ok:false, error:'busy' } + ถอยเวลา 5→60 วิ (1B-g N2)
   - เครื่องเก่าห้ามทับเซฟใหม่กว่า (ผลตรวจ 1B H3): ทุกการโหลดสุ่ม sid ใหม่ → เซิร์ฟเวอร์จำว่าเครื่องนี้เป็นผู้เขียนล่าสุด
     ตอบ replaced (เครื่องอื่นโหลดไปเล่นต่อแล้ว) หรือ old (เซิร์ฟเวอร์มีเซฟใหม่กว่า) → หยุดเซฟ ทิ้งของในเครื่อง แล้วโหลดใหม่จากเซิร์ฟเวอร์
     (ห้ามข้าม seq แล้วส่งทับ — ของที่เล่นบนเครื่องอื่นจะหาย)
   - ยังโหลดไม่เสร็จ/โหลดพัง = ห้ามเซฟ · save/JSON พังหรือระบบที่เคยมีข้อมูลหาย = หยุดส่งทั้งก้อน (SAVE-SAFE)
   อีเวนต์: save:loaded { isNew } · save:status { ok, error? } (CONTRACT §4) */
import { on, emit } from './bus.js';
import * as net from './net.js';

export const AUTOSAVE_MS = 30000;
export const MIN_GAP_MS = 1100;
export const REQUEST_DEBOUNCE_MS = 300;
export const RETRY_MS = 5000;
/* เซิร์ฟเวอร์ตอบ busy (งบคำสั่งที่เก็บเต็ม) → ถอยเวลา 5→10→20→40→60 วิ (1B-g N2 · เดิมลองทุก 1.1 วิ เงียบ ๆ) */
export const BUSY_MS = [5000, 10000, 20000, 40000, 60000];
export function busyDelay(n) { return BUSY_MS[Math.min(Math.max(0, n - 1), BUSY_MS.length - 1)]; }

/* sid ของการโหลดแต่ละครั้ง (32 ตัวฐาน 16) */
export function newSid() {
  const b = new Uint8Array(16);
  try { globalThis.crypto.getRandomValues(b); } catch (e) { for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256); }
  return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}
/* ตัวจับเวลาเริ่มต้น — ต้องห่อเป็นฟังก์ชัน: เรียก setTimeout ผ่าน this ของอ็อบเจกต์อื่น เบราว์เซอร์ฟ้อง "Illegal invocation"
   (ต้นเหตุ login.spec พังสุ่ม: เกิดเฉพาะตอนเซฟถี่จนต้องรอ later()) */
const DEFAULT_TIMER = { now: () => Date.now(), set: (fn, ms) => setTimeout(fn, ms), clear: id => clearTimeout(id) };

/* ---------- ฟังก์ชันล้วน (เทสได้ใน node) ---------- */

/* ข้อมูลไม่ครบต้องยกเลิกทั้ง snapshot ห้ามคืนข้อมูลบางระบบไปเขียนทับของเดิม */
function incomplete(stage, id, cause) {
  const e = new Error(stage + '-incomplete');
  e.code = stage + '-incomplete'; e.system = id; e.cause = cause;
  return e;
}
function systemId(s, seen) {
  if (!s || !/^[a-z][a-z0-9_-]{0,31}$/.test(s.id) || seen.has(s.id)) throw new Error('system-id');
  seen.add(s.id);
}
/* snapshot JSON แบบไม่สูญเสียค่า: ไม่ยอมให้ NaN→null หรือ undefined/function/Map/Promise→หายเงียบ ๆ */
function jsonValue(value, ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object' || ancestors.has(value)) throw new Error('json-value');
  const array = Array.isArray(value), proto = Object.getPrototypeOf(value);
  if (!array && proto !== Object.prototype && proto !== null) throw new Error('json-object');
  if (Object.getOwnPropertySymbols(value).length) throw new Error('json-symbol');
  const keys = Object.keys(value);
  if (array && (keys.length !== value.length || keys.some((k, i) => k !== String(i)))) throw new Error('json-array');
  ancestors.add(value);
  try {
    const out = array ? [] : {};
    for (const key of keys) Object.defineProperty(out, key, { value: jsonValue(value[key], ancestors), enumerable: true, configurable: true, writable: true });
    return out;
  } finally { ancestors.delete(value); }
}
function syncResult(result) {
  if (result && typeof result.then === 'function') {
    Promise.resolve(result).catch(() => {}); /* หยุดก่อนใช้ผล async และรับ rejection ไม่ให้หลุดเป็น unhandled */
    throw new Error('async-system');
  }
  return result;
}
export function collect(G, systems) {
  const out = {}, seen = new Set();
  for (const s of systems) {
    if (typeof s.save !== 'function') continue;
    try {
      systemId(s, seen);
      const d = syncResult(s.save(G));
      if (d !== undefined) Object.defineProperty(out, s.id, { value: jsonValue(d), enumerable: true });
    } catch (e) { throw incomplete('save', s.id, e); }
  }
  return out;
}

/* โหลดผิดแม้ระบบเดียวต้องโยน error: ผู้เรียกห้ามปลดล็อกเซฟจนโหลดใหม่ครบทุกระบบ */
export function applyLoad(G, systems, doc) {
  const sys = doc?.systems === undefined ? {} : doc.systems;
  if (!sys || typeof sys !== 'object' || Array.isArray(sys)) throw incomplete('load', null, new Error('systems-shape'));
  const seen = new Set();
  for (const s of systems) {
    if (typeof s.load !== 'function') continue;
    try { systemId(s, seen); syncResult(s.load(G, Object.hasOwn(sys, s.id) ? sys[s.id] : undefined)); }
    catch (e) { throw incomplete('load', s.id, e); }
  }
  const coin = Math.floor(+(doc && doc.server && doc.server.coin));
  G.player.coin = Number.isFinite(coin) && coin > 0 ? coin : 0;
  return !doc || !(doc.seq > 0);
}

/* ตัวเซฟ (แยกจากเน็ต ให้เทสได้): io = { request(msg)→Promise, send(msg)→bool, ready()→bool }
   timer = { now, set(fn, ms)→id, clear(id) } */
export function createSaver(G, systems, io, timer = DEFAULT_TIMER) {
  const S = { loaded: false, seq: 0, last: '', inflight: false, again: false, lastSent: -1e15, wait: null, sid: '', resyncing: false, resyncs: 0, busyN: 0, holdUntil: 0, failure: null, failureVersion: 0, epoch: 0 };
  let required = new Set(), loading = null;

  function status(ok, error) { emit('save:status', ok ? { ok: true } : { ok: false, error }); }
  function later(ms) {
    if (S.wait) return;
    S.wait = timer.set(() => { S.wait = null; save(); }, Math.max(0, ms));
  }

  function snapshot(keys = required) {
    const data = collect(G, systems);
    for (const id of keys) if (!Object.hasOwn(data, id)) throw incomplete('save', id, new Error('missing-system'));
    return data;
  }
  function dataFailure(code) { S.failure = code; S.failureVersion++; status(false, code); }
  function recovered() { if (S.failure) { S.failure = null; status(true); } }
  function load() {
    if (loading) return loading; /* ไม่ให้โหลดซ้อนกันแล้วผลเก่าทับผลใหม่ */
    loading = performLoad().finally(() => { loading = null; });
    return loading;
  }
  async function performLoad() {
    S.loaded = false; S.epoch++;
    if (S.wait) { timer.clear(S.wait); S.wait = null; }
    const sid = newSid();
    const m = await io.request({ t: 'load', sid });
    if (!m || m.t !== 'load' || !m.doc) throw new Error((m && m.why) || 'load');
    let isNew, data;
    try {
      isNew = applyLoad(G, systems, m.doc);
      data = snapshot(new Set(Object.keys(m.doc.systems || {})));
    } catch (e) {
      const error = e.code === 'load-incomplete' ? e : incomplete('load', e.system, e);
      dataFailure(error.code);
      throw error;
    }
    /* commit baseline/sid/loaded เฉพาะหลังโหลดและรวมข้อมูลครบ ระบบที่เลิกใช้ต้องมี migration ชัดเจนก่อน */
    S.sid = sid;
    if (typeof io.setSid === 'function') io.setSid(sid);
    S.seq = +m.doc.seq || 0;
    S.last = JSON.stringify(data);
    required = new Set(Object.keys(data));
    S.loaded = true; S.failure = null;
    emit('save:loaded', { isNew });
    return { isNew };
  }

  /* เซฟถ้ามีอะไรเปลี่ยน → 'same' | 'wait' | 'sent' | 'blocked' (ข้อมูลไม่ครบ) */
  async function save() {
    if (!S.loaded) return 'wait';
    if (S.inflight) { S.again = true; return 'wait'; }
    if (!io.ready()) { S.again = true; return 'wait'; } /* ต่อได้แล้วค่อยส่ง (ฟัง net:status) */
    const hold = S.holdUntil - timer.now();
    if (hold > 0) { later(hold); return 'wait'; } /* ถอยเพราะ busy — เซฟอัตโนมัติ 30 วิ ไม่ลัดคิว */
    const gap = timer.now() - S.lastSent;
    if (gap < MIN_GAP_MS) { later(MIN_GAP_MS - gap); return 'wait'; }
    let systemsData, str;
    try { systemsData = snapshot(); str = JSON.stringify(systemsData); }
    catch (e) { dataFailure('save-incomplete'); return 'blocked'; }
    for (const id of Object.keys(systemsData)) required.add(id); /* จดข้อมูลที่เคยรวมครบก่อนส่ง ไม่รอ ACK */
    if (str === S.last) { recovered(); return 'same'; }
    S.inflight = true; S.again = false;
    const seq = ++S.seq, epoch = S.epoch, failureVersion = S.failureVersion;
    S.lastSent = timer.now();
    try {
      const m = await io.request({ t: 'save', seq, sid: S.sid, systems: systemsData });
      if (epoch !== S.epoch) return 'sent'; /* คำตอบของเซฟก่อนเริ่มโหลดใหม่ห้ามยืนยัน baseline/ล้างข้อผิดพลาด */
      if (m.t === 'save_ok') { S.seq = Math.max(S.seq, +m.seq || seq); S.last = str; S.busyN = 0; if (failureVersion === S.failureVersion) { S.failure = null; status(true); } }
      else if (m.why === 'replaced' || m.why === 'old') { S.inflight = false; S.again = false; resync(m.why); return 'sent'; }
      else if (m.why === 'busy') { /* ผู้เล่นต้องรู้ว่ายังไม่ได้บันทึก (login.js แสดงป้ายไทย) */
        const ms = busyDelay(++S.busyN);
        S.holdUntil = timer.now() + ms;
        status(false, 'busy'); later(ms);
      }
      else if (m.why === 'rate') { S.again = true; }
      else { status(false, m.why || 'server'); later(RETRY_MS); }
    } catch (e) {
      if (epoch === S.epoch) { status(false, 'offline'); S.again = true; }
    } finally {
      S.inflight = false;
    }
    if (S.loaded && S.again && io.ready()) later(MIN_GAP_MS);
    return 'sent';
  }

  /* เซิร์ฟเวอร์มีเซฟที่ใหม่กว่าของเครื่องนี้ → หยุดเซฟ แล้วโหลดของเซิร์ฟเวอร์มาแทน (ไม่ส่งของเก่าทับ · H3) */
  function resync(why) {
    S.loaded = false;
    if (S.wait) { timer.clear(S.wait); S.wait = null; }
    if (S.resyncing) return;
    S.resyncing = true; S.resyncs++;
    status(false, why);
    /* โหลดใหม่ไม่สำเร็จ (busy/หลุด) → ถอยเวลา 5→60 วิ + ป้าย (1Z/1B-g L1 · เดิมลองทุก 5 วิ เงียบ ๆ ผู้เล่นไม่รู้ว่าไม่ได้บันทึก) */
    let n = 0;
    const go = () => {
      if (!io.ready()) { timer.set(go, RETRY_MS); return; }
      load().then(() => { S.resyncing = false; }, e => {
        status(false, e && e.code === 'load-incomplete' ? 'load-incomplete' : e && e.message === 'busy' ? 'busy' : 'load');
        timer.set(go, busyDelay(++n));
      });
    };
    go();
  }

  /* ปิดหน้า/ซ่อนแท็บ: ส่งทันทีไม่รอคำตอบ (ไม่ดูระยะห่าง — ถ้าเซิร์ฟเวอร์ตอบ rate ก็ยังมีเซฟล่าสุดก่อนหน้า 1 วิ) */
  function flushNow() {
    if (!S.loaded || !io.ready()) return false;
    let systemsData, str;
    try { systemsData = snapshot(); str = JSON.stringify(systemsData); }
    catch (e) { dataFailure('save-incomplete'); return false; }
    if (str === S.last) { recovered(); return false; }
    for (const id of Object.keys(systemsData)) required.add(id);
    const ok = io.send({ t: 'save', seq: ++S.seq, sid: S.sid, systems: systemsData });
    if (ok) S.lastSent = timer.now();
    return ok;
  }

  return { load, save, flushNow, resync, state: S };
}

/* ---------- ต่อเข้ากับเกม (เรียกครั้งเดียวจาก systems/login.js หลัง net.connect) ---------- */
let saver = null;
export function getSaver() { return saver; }

export function initSave(G, systems) {
  saver = createSaver(G, systems, { request: net.request, send: net.send, ready: net.isReady, setSid: net.setResumeSid });
  let deb = null;
  /* โหลดครั้งแรก · ไม่สำเร็จ (busy/หลุด/หมดเวลา) → ลองใหม่เองแบบถอยเวลา 5→60 วิ (1B-g N2 · เดิมรอแค่ต่อใหม่ ถ้าไม่หลุดค้างหน้าโหลดตลอด) */
  let loadN = 0, loadTm = null;
  const tryLoad = () => {
    loadTm = null;
    if (saver.state.loaded) return;
    if (!net.isReady()) { loadTm = setTimeout(tryLoad, 1500); return; }
    saver.load().then(() => { loadN = 0; }, e => {
      console.error('[save] โหลดไม่สำเร็จ', e);
      const why = e && e.code === 'load-incomplete' ? 'load-incomplete' : e && e.message === 'busy' ? 'busy' : 'load';
      status(false, why);
      if (!loadTm) loadTm = setTimeout(tryLoad, busyDelay(++loadN));
    });
  };
  on('net:auth', tryLoad);
  on('save:request', () => { clearTimeout(deb); deb = setTimeout(() => saver.save(), REQUEST_DEBOUNCE_MS); });
  on('net:status', d => { if (d.online) setTimeout(() => saver.save(), 1500); }); /* ต่อใหม่แล้วเซฟของที่ค้าง (รอ hello เสร็จ) */
  setInterval(() => saver.save(), AUTOSAVE_MS);
  if (typeof addEventListener === 'function') {
    addEventListener('pagehide', () => saver.flushNow());
    addEventListener('beforeunload', () => saver.flushNow());
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saver.flushNow(); });
  }
  return saver;
}
function status(ok, error) { emit('save:status', ok ? { ok: true } : { ok: false, error }); }
