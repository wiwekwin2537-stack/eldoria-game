/* save — เซฟ/โหลดตัวละครกับเซิร์ฟเวอร์ (รูปแบบเดียว · CONTRACT §1 · ตารางข้อความ v6/server/PROTOCOL.md)
   เซฟ = { seq, systems:{ <id ระบบ>: ผลจาก save(G) } } · โหลด = เรียก load(G, data) ของทุกระบบตามลำดับใน systems/index.js
   - เงิน G.player.coin มาจาก doc.server.coin (เซิร์ฟเวอร์ถือ · เครื่องเราไม่ส่งเงินขึ้นไป · DECISIONS 2026-10-30)
   - เซฟเมื่อ: ทุก 30 วิ (ข้ามถ้าไม่มีอะไรเปลี่ยน) · อีเวนต์ save:request (รอ 0.3 วิ รวมหลายคำขอ) · ซ่อนแท็บ/ปิดหน้า
   - เซิร์ฟเวอร์รับไม่ถี่กว่า 1 ครั้ง/วิ → เว้นห่าง ≥1.1 วิ · seq เพิ่มทุกครั้งที่ส่ง
   - เครื่องเก่าห้ามทับเซฟใหม่กว่า (ผลตรวจ 1B H3): ทุกการโหลดสุ่ม sid ใหม่ → เซิร์ฟเวอร์จำว่าเครื่องนี้เป็นผู้เขียนล่าสุด
     ตอบ replaced (เครื่องอื่นโหลดไปเล่นต่อแล้ว) หรือ old (เซิร์ฟเวอร์มีเซฟใหม่กว่า) → หยุดเซฟ ทิ้งของในเครื่อง แล้วโหลดใหม่จากเซิร์ฟเวอร์
     (ห้ามข้าม seq แล้วส่งทับ — ของที่เล่นบนเครื่องอื่นจะหาย)
   - ยังโหลดไม่เสร็จ = ห้ามเซฟ (กันเซฟตัวละครว่างทับของจริง)
   อีเวนต์: save:loaded { isNew } · save:status { ok, error? } (CONTRACT §4) */
import { on, emit } from './bus.js';
import * as net from './net.js';

export const AUTOSAVE_MS = 30000;
export const MIN_GAP_MS = 1100;
export const REQUEST_DEBOUNCE_MS = 300;
export const RETRY_MS = 5000;

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

/* รวมข้อมูลเซฟจากทุกระบบ · ระบบที่พังตอน save ไม่ทำให้ระบบอื่นหาย */
export function collect(G, systems) {
  const out = {};
  for (const s of systems) {
    if (typeof s.save !== 'function') continue;
    try {
      const d = s.save(G);
      if (d !== undefined) out[s.id] = JSON.parse(JSON.stringify(d)); /* JSON ล้วน (ตัด function/Set) */
    } catch (e) { console.error('[save]', s.id, e); }
  }
  return out;
}

/* ใส่เซฟเข้าเกม → true ถ้าเป็นตัวละครใหม่ */
export function applyLoad(G, systems, doc) {
  const sys = (doc && doc.systems) || {};
  for (const s of systems) {
    if (typeof s.load !== 'function') continue;
    try { s.load(G, sys[s.id]); } catch (e) { console.error('[load]', s.id, e); }
  }
  const coin = Math.floor(+(doc && doc.server && doc.server.coin));
  G.player.coin = Number.isFinite(coin) && coin > 0 ? coin : 0;
  return !doc || !(doc.seq > 0);
}

/* ตัวเซฟ (แยกจากเน็ต ให้เทสได้): io = { request(msg)→Promise, send(msg)→bool, ready()→bool }
   timer = { now, set(fn, ms)→id, clear(id) } */
export function createSaver(G, systems, io, timer = DEFAULT_TIMER) {
  const S = { loaded: false, seq: 0, last: '', inflight: false, again: false, lastSent: -1e15, wait: null, sid: '', resyncing: false, resyncs: 0 };

  function status(ok, error) { emit('save:status', ok ? { ok: true } : { ok: false, error }); }
  function later(ms) {
    if (S.wait) return;
    S.wait = timer.set(() => { S.wait = null; save(); }, Math.max(0, ms));
  }

  async function load() {
    S.loaded = false;
    const sid = newSid();
    const m = await io.request({ t: 'load', sid });
    if (!m || m.t !== 'load' || !m.doc) throw new Error((m && m.why) || 'load');
    S.sid = sid;
    const isNew = applyLoad(G, systems, m.doc);
    S.seq = +m.doc.seq || 0;
    S.last = JSON.stringify(collect(G, systems)); /* เพิ่งโหลด = ยังไม่มีอะไรต้องเซฟ */
    S.loaded = true;
    emit('save:loaded', { isNew });
    return { isNew };
  }

  /* เซฟถ้ามีอะไรเปลี่ยน → 'same' | 'wait' | 'sent' */
  async function save() {
    if (!S.loaded) return 'wait';
    if (S.inflight) { S.again = true; return 'wait'; }
    if (!io.ready()) { S.again = true; return 'wait'; } /* ต่อได้แล้วค่อยส่ง (ฟัง net:status) */
    const gap = timer.now() - S.lastSent;
    if (gap < MIN_GAP_MS) { later(MIN_GAP_MS - gap); return 'wait'; }
    const systemsData = collect(G, systems), str = JSON.stringify(systemsData);
    if (str === S.last) return 'same';
    S.inflight = true; S.again = false;
    const seq = ++S.seq;
    S.lastSent = timer.now();
    try {
      const m = await io.request({ t: 'save', seq, sid: S.sid, systems: systemsData });
      if (m.t === 'save_ok') { S.seq = Math.max(S.seq, +m.seq || seq); S.last = str; status(true); }
      else if (m.why === 'replaced' || m.why === 'old') { S.inflight = false; S.again = false; resync(m.why); return 'sent'; }
      else if (m.why === 'rate' || m.why === 'busy') { S.again = true; }
      else { status(false, m.why || 'server'); later(RETRY_MS); }
    } catch (e) {
      status(false, 'offline'); S.again = true;
    } finally {
      S.inflight = false;
    }
    if (S.again && io.ready()) later(MIN_GAP_MS);
    return 'sent';
  }

  /* เซิร์ฟเวอร์มีเซฟที่ใหม่กว่าของเครื่องนี้ → หยุดเซฟ แล้วโหลดของเซิร์ฟเวอร์มาแทน (ไม่ส่งของเก่าทับ · H3) */
  function resync(why) {
    S.loaded = false;
    if (S.wait) { timer.clear(S.wait); S.wait = null; }
    if (S.resyncing) return;
    S.resyncing = true; S.resyncs++;
    status(false, why);
    const go = () => {
      if (!io.ready()) { timer.set(go, RETRY_MS); return; }
      load().then(() => { S.resyncing = false; }, () => timer.set(go, RETRY_MS));
    };
    go();
  }

  /* ปิดหน้า/ซ่อนแท็บ: ส่งทันทีไม่รอคำตอบ (ไม่ดูระยะห่าง — ถ้าเซิร์ฟเวอร์ตอบ rate ก็ยังมีเซฟล่าสุดก่อนหน้า 1 วิ) */
  function flushNow() {
    if (!S.loaded || !io.ready()) return false;
    const systemsData = collect(G, systems), str = JSON.stringify(systemsData);
    if (str === S.last) return false;
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
  saver = createSaver(G, systems, { request: net.request, send: net.send, ready: net.isReady });
  let deb = null;
  on('net:auth', () => {
    saver.load().catch(e => {
      console.error('[save] โหลดไม่สำเร็จ', e);
      status(false, 'load');
      /* ต่อใหม่ได้ → ลองโหลดอีกครั้ง (net:auth ไม่ส่งซ้ำ จึงฟัง net:status เอง) */
      const off = on('net:status', d => { if (d.online) setTimeout(() => { if (!saver.state.loaded && net.isReady()) { off(); saver.load().catch(() => {}); } }, 1500); });
    });
  });
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
