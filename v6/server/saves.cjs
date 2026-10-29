/* saves — เซฟต่อบัญชีของ v6
   เอกสาร: { v:SAVE_VERSION, seq, upd, systems:{ <system id>: data }, server:{ coin } }
   - systems  = เครื่องผู้เล่นส่งมา (ข้อมูลจาก save() ของแต่ละระบบ · CONTRACT §1)
   - server.* = เซิร์ฟเวอร์ถือ เครื่องผู้เล่นเขียนไม่ได้ (DECISIONS 2026-10-30 "เซิร์ฟเวอร์ถือเงิน")
   - จำกัดขนาด · บันทึกถี่เกินไม่ได้ · seq ต้องเพิ่มขึ้นเสมอ (เซฟเก่าที่มาช้าไม่ทับเซฟใหม่)
   - ผู้เขียน (1B-f H3 · แบบ writer/session-replaced ของเกมเดิม accounts.js:301–304):
     โหลดพร้อม sid (สุ่มต่อการโหลด 1 ครั้งในเครื่องผู้เล่น) → เอกสารจำ w = sid ล่าสุด
     เซฟต้องมี sid ตรงกับ w → เครื่องเก่าที่ต่อใหม่ (sid เก่า) ได้ 'replaced' เขียนทับเซฟใหม่กว่าไม่ได้
   - แคชเอกสารล่าสุดในหน่วยความจำ (เซิร์ฟเวอร์เดียว · v6 เขียนคีย์ eld6:save เองคนเดียว) → เซฟ = 1 คำสั่งที่เก็บ ไม่ต้องอ่านก่อน (H2) */
const { PREFIX } = require('./store.cjs');
const crypto = require('crypto');

const SAVE_VERSION = 1;              /* ต้องตรงกับ v6/src/config.js (มีเทสเทียบ) */
const MAX_SAVE_CHARS = 256 * 1024;   /* ขนาด systems (JSON) สูงสุด */
const SAVE_MIN_MS = 1000;            /* เซฟได้ไม่ถี่กว่า 1 ครั้ง/วิ ต่อบัญชี (เกมเซฟจริงทุก 30 วิ + ตอนเปลี่ยนแมพ) */
const MAX_SYSTEMS = 64;
const SYS_ID_RE = /^[a-z][a-z0-9_-]{0,31}$/;
const COIN_MAX = 99999999;           /* เพดานเงินค่าเดียวทั้งเกม (DECISIONS 2026-10-30) */
const SID_RE = /^[0-9a-f]{16,64}$/;
const CACHE_MAX = 500;               /* เอกสารในแคชสูงสุด (~เท่าคนเล่นพร้อมกัน · เกินแล้วลบตัวที่ใช้นานสุด) */

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
  const lastSave = new Map(); /* lid → เวลาที่ลองเซฟล่าสุด (ms) — นับทุกครั้งที่ถึงที่เก็บ ไม่ใช่แค่ที่สำเร็จ (H2: old ก็นับ) */
  const locks = new Map();
  const cache = new Map();    /* lid → เอกสารล่าสุด (เรียงตามใช้ล่าสุด) */

  function remember(lid, doc) {
    cache.delete(lid); cache.set(lid, doc);
    while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  }
  /* ลบรายการหมดอายุ (เรียกเป็นระยะจาก index.cjs · L1) */
  function sweep() { const t = now(); for (const [k, v] of lastSave) if (t - v >= SAVE_MIN_MS) lastSave.delete(k); }

  function serial(lid, fn) {
    const prev = locks.get(lid) || Promise.resolve();
    const run = prev.then(fn, fn);
    const tail = run.catch(() => {});
    locks.set(lid, tail);
    tail.then(() => { if (locks.get(lid) === tail) locks.delete(lid); });
    return run;
  }

  async function readStore(lid) {
    const raw = await store.get(keyOf(lid));
    if (!raw) return freshDoc();
    let d; try { d = JSON.parse(raw); } catch (e) { return freshDoc(); }
    if (!isPlain(d)) return freshDoc();
    const doc = { v: d.v || SAVE_VERSION, seq: +d.seq || 0, upd: +d.upd || 0, systems: isPlain(d.systems) ? d.systems : {}, server: normServer(d.server) };
    if (typeof d.w === 'string') doc.w = d.w;
    return doc;
  }
  async function read(lid) {
    const c = cache.get(lid);
    if (c) { remember(lid, c); return c; }
    const doc = await readStore(lid);
    remember(lid, doc);
    return doc;
  }
  async function write(lid, doc) {
    await store.set(keyOf(lid), JSON.stringify(doc));
    remember(lid, doc);
  }
  const pub = d => ({ v: d.v, seq: d.seq, upd: d.upd, systems: d.systems, server: { ...d.server } }); /* ไม่ส่ง w ให้เครื่องผู้เล่น */

  /* โหลด → เอกสารเต็ม (ไม่มี = ตัวละครใหม่) · sid = เครื่องนี้เป็นผู้เขียนคนล่าสุด (เครื่องอื่นเซฟไม่ได้แล้ว) */
  function load(lid, sid) {
    return serial(lid, async () => {
      const cur = await read(lid);
      if (SID_RE.test(String(sid || '')) && cur.w !== sid) await write(lid, { ...cur, w: sid });
      return pub(cur);
    });
  }

  /* เซฟจากเครื่องผู้เล่น: รับแค่ seq + systems · ส่วน server ใช้ของเดิมบนเซิร์ฟเวอร์เสมอ */
  function save(lid, d) {
    if (!isPlain(d)) return Promise.resolve({ err: 'bad' });
    const seq = Math.floor(+d.seq);
    if (!Number.isFinite(seq) || seq < 1) return Promise.resolve({ err: 'bad' });
    const sid = String(d.sid || '');
    if (!SID_RE.test(sid)) return Promise.resolve({ err: 'bad' });
    const bad = checkSystems(d.systems);
    if (bad) return Promise.resolve({ err: bad });
    return serial(lid, async () => {
      const t = now();
      if (t - (lastSave.get(lid) || 0) < SAVE_MIN_MS) return { err: 'rate' };
      lastSave.set(lid, t);
      const cur = await read(lid);
      if (cur.w && cur.w !== sid) return { err: 'replaced', seq: cur.seq }; /* เครื่องอื่นโหลดไปเล่นต่อแล้ว */
      if (seq <= cur.seq) return { err: 'old', seq: cur.seq };
      const doc = { v: SAVE_VERSION, seq, upd: t, systems: d.systems, server: cur.server, w: sid };
      await write(lid, doc);
      return { ok: true, seq, upd: t };
    });
  }

  /* ให้โค้ดฝั่งเซิร์ฟเวอร์เปลี่ยนส่วน server (เช่น เงิน · เฟส 4/6) — เครื่องผู้เล่นเรียกตรงไม่ได้ */
  function updateServer(lid, fn) {
    return serial(lid, async () => {
      const cur = await read(lid);
      const next = normServer(fn({ ...cur.server }) || cur.server);
      await write(lid, { ...cur, server: next });
      return next;
    });
  }

  return { load, save, updateServer, sweep, _cache: cache, _lastSave: lastSave };
}

module.exports = { createSaves, SAVE_VERSION, MAX_SAVE_CHARS, SAVE_MIN_MS, COIN_MAX, SID_RE, CACHE_MAX, freshDoc, keyOf };
