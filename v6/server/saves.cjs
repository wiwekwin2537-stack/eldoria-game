/* saves — เซฟต่อบัญชีของ v6
   เอกสาร: { v:SAVE_VERSION, seq, upd, systems:{ <system id>: data }, server:{ coin } }
   - systems  = เครื่องผู้เล่นส่งมา (ข้อมูลจาก save() ของแต่ละระบบ · CONTRACT §1)
   - server.* = เซิร์ฟเวอร์ถือ เครื่องผู้เล่นเขียนไม่ได้ (DECISIONS 2026-10-30 "เซิร์ฟเวอร์ถือเงิน")
   - จำกัดขนาด · บันทึกถี่เกินไม่ได้ · seq ต้องเพิ่มขึ้นเสมอ (เซฟเก่าที่มาช้าไม่ทับเซฟใหม่) */
const { PREFIX } = require('./store.cjs');
const crypto = require('crypto');

const SAVE_VERSION = 1;              /* ต้องตรงกับ v6/src/config.js (มีเทสเทียบ) */
const MAX_SAVE_CHARS = 256 * 1024;   /* ขนาด systems (JSON) สูงสุด */
const SAVE_MIN_MS = 1000;            /* เซฟได้ไม่ถี่กว่า 1 ครั้ง/วิ ต่อบัญชี (เกมเซฟจริงทุก 30 วิ + ตอนเปลี่ยนแมพ) */
const MAX_SYSTEMS = 64;
const SYS_ID_RE = /^[a-z][a-z0-9_-]{0,31}$/;
const COIN_MAX = 99999999;           /* เพดานเงินค่าเดียวทั้งเกม (DECISIONS 2026-10-30) */

const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const keyOf = lid => PREFIX + 'save:' + sha(lid).slice(0, 40);
const isPlain = o => !!o && typeof o === 'object' && !Array.isArray(o);

const freshDoc = () => ({ v: SAVE_VERSION, seq: 0, upd: 0, systems: {}, server: { coin: 0 } });

/* เติมช่องที่ขาด/ตัดค่าเพี้ยนของส่วน server */
function normServer(s) {
  const o = isPlain(s) ? { ...s } : {};
  const c = Math.floor(+o.coin);
  o.coin = Number.isFinite(c) ? Math.max(0, Math.min(COIN_MAX, c)) : 0;
  return o;
}

/* ตรวจ systems ที่เครื่องผู้เล่นส่งมา → null = ผ่าน / ข้อความ = ไม่ผ่าน */
function checkSystems(systems) {
  if (!isPlain(systems)) return 'bad';
  const keys = Object.keys(systems);
  if (keys.length > MAX_SYSTEMS) return 'bad';
  for (const k of keys) if (!SYS_ID_RE.test(k)) return 'bad';
  let s;
  try { s = JSON.stringify(systems); } catch (e) { return 'bad'; }
  if (s.length > MAX_SAVE_CHARS) return 'size';
  return null;
}

function createSaves({ store, now = () => Date.now() }) {
  const lastSave = new Map(); /* lid → เวลาเซฟล่าสุด (ms) */
  const locks = new Map();

  function serial(lid, fn) {
    const prev = locks.get(lid) || Promise.resolve();
    const run = prev.then(fn, fn);
    const tail = run.catch(() => {});
    locks.set(lid, tail);
    tail.then(() => { if (locks.get(lid) === tail) locks.delete(lid); });
    return run;
  }

  async function read(lid) {
    const raw = await store.get(keyOf(lid));
    if (!raw) return freshDoc();
    let d; try { d = JSON.parse(raw); } catch (e) { return freshDoc(); }
    if (!isPlain(d)) return freshDoc();
    return { v: d.v || SAVE_VERSION, seq: +d.seq || 0, upd: +d.upd || 0, systems: isPlain(d.systems) ? d.systems : {}, server: normServer(d.server) };
  }

  /* โหลด → เอกสารเต็ม (ไม่มี = ตัวละครใหม่) */
  function load(lid) { return serial(lid, () => read(lid)); }

  /* เซฟจากเครื่องผู้เล่น: รับแค่ seq + systems · ส่วน server ใช้ของเดิมบนเซิร์ฟเวอร์เสมอ */
  function save(lid, d) {
    if (!isPlain(d)) return Promise.resolve({ err: 'bad' });
    const seq = Math.floor(+d.seq);
    if (!Number.isFinite(seq) || seq < 1) return Promise.resolve({ err: 'bad' });
    const bad = checkSystems(d.systems);
    if (bad) return Promise.resolve({ err: bad });
    return serial(lid, async () => {
      const t = now();
      if (t - (lastSave.get(lid) || 0) < SAVE_MIN_MS) return { err: 'rate' };
      const cur = await read(lid);
      if (seq <= cur.seq) return { err: 'old', seq: cur.seq };
      const doc = { v: SAVE_VERSION, seq, upd: t, systems: d.systems, server: cur.server };
      await store.set(keyOf(lid), JSON.stringify(doc));
      lastSave.set(lid, t);
      return { ok: true, seq, upd: t };
    });
  }

  /* ให้โค้ดฝั่งเซิร์ฟเวอร์เปลี่ยนส่วน server (เช่น เงิน · เฟส 4/6) — เครื่องผู้เล่นเรียกตรงไม่ได้ */
  function updateServer(lid, fn) {
    return serial(lid, async () => {
      const cur = await read(lid);
      const next = normServer(fn({ ...cur.server }) || cur.server);
      const doc = { ...cur, server: next };
      await store.set(keyOf(lid), JSON.stringify(doc));
      return next;
    });
  }

  return { load, save, updateServer };
}

module.exports = { createSaves, SAVE_VERSION, MAX_SAVE_CHARS, SAVE_MIN_MS, COIN_MAX, freshDoc, keyOf };
