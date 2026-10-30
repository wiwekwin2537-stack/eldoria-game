/* saves — เซฟต่อบัญชีของ v6
   เอกสาร: { v:SAVE_VERSION, seq, upd, systems:{ <system id>: data }, server:{ coin } }
   - systems  = เครื่องผู้เล่นส่งมา (ข้อมูลจาก save() ของแต่ละระบบ · CONTRACT §1)
   - server.* = เซิร์ฟเวอร์ถือ เครื่องผู้เล่นเขียนไม่ได้ (DECISIONS 2026-10-30 "เซิร์ฟเวอร์ถือเงิน")
   - จำกัดขนาด · บันทึกถี่เกินไม่ได้ · seq ต้องเพิ่มขึ้นเสมอ (เซฟเก่าที่มาช้าไม่ทับเซฟใหม่)
   - ผู้เขียน (1B-f H3 · แบบ writer/session-replaced ของเกมเดิม accounts.js:301–304):
     โหลดพร้อม sid (สุ่มต่อการโหลด 1 ครั้งในเครื่องผู้เล่น) → เอกสารจำ w = sid ล่าสุด
     เซฟต้องมี sid ตรงกับ w → เครื่องเก่าที่ต่อใหม่ (sid เก่า) ได้ 'replaced' เขียนทับเซฟใหม่กว่าไม่ได้
   - แคชในหน่วยความจำ (เซิร์ฟเวอร์เดียว · v6 เขียนคีย์ eld6:save เองคนเดียว) → เซฟ = 1 คำสั่งที่เก็บ ไม่ต้องอ่านก่อน (H2)
     เก็บ systems เป็นสตริงพร้อมงบรวมเป็นไบต์ (1B-g N1) · ข้อจำกัดหลายโปรเซส: PROTOCOL.md (N5) */
const { PREFIX } = require('./store.cjs');
const crypto = require('crypto');

const SAVE_VERSION = 1;              /* ต้องตรงกับ v6/src/config.js (มีเทสเทียบ) */
const MAX_SAVE_CHARS = 256 * 1024;   /* ขนาด systems (JSON) สูงสุด */
const SAVE_MIN_MS = 1000;            /* เซฟได้ไม่ถี่กว่า 1 ครั้ง/วิ ต่อบัญชี (เกมเซฟจริงทุก 30 วิ + ตอนเปลี่ยนแมพ) */
const MAX_SYSTEMS = 64;
const SYS_ID_RE = /^[a-z][a-z0-9_-]{0,31}$/;
const COIN_MAX = 99999999;           /* เพดานเงินค่าเดียวทั้งเกม (DECISIONS 2026-10-30) */
const SID_RE = /^[0-9a-f]{16,64}$/;
const CACHE_BYTES = 32 * 1024 * 1024; /* งบแคชข้อมูลเซฟ (สตริง systems) รวมทั้งเซิร์ฟเวอร์ · ตั้งได้ด้วย V6_SAVE_CACHE_MB (1B-g N1) */
const CACHE_MAX = 20000;             /* จำนวนบัญชีในแคช "ข้อมูลเล็ก" (seq/w/server ~200 ไบต์ต่อตัว) · เกินแล้วลบตัวที่ใช้นานสุด */

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

/* ตรวจ systems ที่เครื่องผู้เล่นส่งมา → { err } ไม่ผ่าน / { str } = systems เป็นสตริง JSON (ใช้เขียนต่อเลย ไม่ต้องแปลงซ้ำ) */
function checkSystems(systems) {
  if (!isPlain(systems)) return { err: 'bad' };
  const keys = Object.keys(systems);
  if (keys.length > MAX_SYSTEMS) return { err: 'bad' };
  for (const k of keys) if (!SYS_ID_RE.test(k)) return { err: 'bad' };
  let s;
  try { s = JSON.stringify(systems); } catch (e) { return { err: 'bad' }; }
  if (s.length > MAX_SAVE_CHARS) return { err: 'size' };
  return { str: s };
}

/* เอกสารเต็ม (สตริง) จากส่วนเล็ก + systems ที่เป็นสตริงอยู่แล้ว — ไม่ต้อง parse systems กลับเป็นอ็อบเจกต์ */
function docString(m, sysStr) {
  return '{"v":' + (+m.v || SAVE_VERSION) + ',"seq":' + (+m.seq || 0) + ',"upd":' + (+m.upd || 0) +
    ',"server":' + JSON.stringify(m.server) + (m.w ? ',"w":' + JSON.stringify(m.w) : '') + ',"systems":' + sysStr + '}';
}

/* แคช (1B-g N1 · ผลตรวจ 1B-f: เดิมเก็บเอกสารแบบอ็อบเจกต์ 500 ตัว → เซฟ [[],[],…] 256 KB = ~3.4 MB/ตัว → heap +365 MB/100 บัญชี)
   ต่อบัญชีเก็บ 2 ส่วน:
   - m   = ข้อมูลเล็ก { v, seq, upd, w, server } — ที่เซฟ/hello ต้องใช้ (เซฟ = 1 คำสั่งที่เก็บ ไม่ต้องอ่านก่อน · H2)
   - sys = systems เป็น "สตริง" (ไม่ใช่อ็อบเจกต์) | null — ใช้ตอน load/เขียนเอกสารเต็ม · ไม่มี → อ่านจากที่เก็บ
   งบ sys รวมเป็นไบต์ (นับ length×2 = กรณีแย่สุดของสตริงใน V8) เกินงบ → ทิ้ง sys ของตัวที่ใช้นานสุดก่อน (เก็บ m ไว้)
   จำนวนบัญชีเกิน CACHE_MAX → ลบทั้งรายการของตัวที่ใช้นานสุด */
function createSaves({ store, now = () => Date.now(), cacheBytes = CACHE_BYTES }) {
  const lastSave = new Map(); /* lid → เวลาที่ลองเซฟล่าสุด (ms) — นับทุกครั้งที่ถึงที่เก็บ ไม่ใช่แค่ที่สำเร็จ (H2: old ก็นับ) */
  const locks = new Map();
  const cache = new Map();    /* lid → { m, sys, bytes } (เรียงตามใช้ล่าสุด) */
  const stat = { bytes: 0 };

  function trim() {
    if (stat.bytes > cacheBytes) {
      for (const e of cache.values()) {
        if (stat.bytes <= cacheBytes) break;
        if (e.sys != null) { stat.bytes -= e.bytes; e.sys = null; e.bytes = 0; }
      }
    }
    while (cache.size > CACHE_MAX) {
      const k = cache.keys().next().value, e = cache.get(k);
      stat.bytes -= e.bytes; cache.delete(k);
    }
  }
  /* จำ (m, sys) ของบัญชี · sys === undefined = ไม่เปลี่ยน sys เดิม */
  function remember(lid, m, sys) {
    const old = cache.get(lid);
    if (old) { cache.delete(lid); stat.bytes -= old.bytes; }
    const s = sys === undefined ? (old ? old.sys : null) : sys;
    const e = { m, sys: s, bytes: s != null ? s.length * 2 : 0 };
    stat.bytes += e.bytes;
    cache.set(lid, e);
    trim();
    return e;
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

  /* อ่านจากที่เก็บ → { m, sys(สตริง) } */
  async function readStore(lid) {
    const raw = await store.get(keyOf(lid));
    let d = null;
    if (raw) { try { d = JSON.parse(raw); } catch (e) { d = null; } }
    if (!isPlain(d)) { const f = freshDoc(); return { m: { v: f.v, seq: 0, upd: 0, server: f.server }, sys: '{}' }; }
    const m = { v: d.v || SAVE_VERSION, seq: +d.seq || 0, upd: +d.upd || 0, server: normServer(d.server) };
    if (typeof d.w === 'string') m.w = d.w;
    return { m, sys: isPlain(d.systems) ? JSON.stringify(d.systems) : '{}' };
  }
  /* ข้อมูลเล็กของบัญชี (แคช → ไม่แตะที่เก็บ) */
  async function meta(lid) {
    const c = cache.get(lid);
    if (c) { remember(lid, c.m); return c.m; }
    const r = await readStore(lid);
    return remember(lid, r.m, r.sys).m;
  }
  /* ข้อมูลเล็ก + systems (สตริง) · sys ถูกทิ้งจากแคช → อ่านที่เก็บใหม่ (ใช้ m ในแคช เพราะใหม่กว่า/เท่ากัน) */
  async function full(lid) {
    const c = cache.get(lid);
    if (c && c.sys != null) { remember(lid, c.m); return { m: c.m, sys: c.sys }; }
    const r = await readStore(lid);
    const m = c ? c.m : r.m;
    remember(lid, m, r.sys);
    return { m, sys: r.sys };
  }
  async function write(lid, m, sys) {
    await store.set(keyOf(lid), docString(m, sys));
    remember(lid, m, sys);
  }

  /* โหลด → เอกสารเต็ม (ไม่มี = ตัวละครใหม่) · sid = เครื่องนี้เป็นผู้เขียนคนล่าสุด (เครื่องอื่นเซฟไม่ได้แล้ว) */
  function load(lid, sid) {
    return serial(lid, async () => {
      const { m, sys } = await full(lid);
      if (SID_RE.test(String(sid || '')) && m.w !== sid) await write(lid, { ...m, w: sid }, sys);
      return { v: m.v, seq: m.seq, upd: m.upd, systems: JSON.parse(sys), server: { ...m.server } }; /* ไม่ส่ง w ให้เครื่องผู้เล่น */
    });
  }

  /* เซฟจากเครื่องผู้เล่น: รับแค่ seq + systems · ส่วน server ใช้ของเดิมบนเซิร์ฟเวอร์เสมอ
     เก็บแค่ "สตริง" ของ systems — อ็อบเจกต์ที่ proto parse มาไม่ถูกจำไว้ (N1) */
  function save(lid, d) {
    if (!isPlain(d)) return Promise.resolve({ err: 'bad' });
    const seq = Math.floor(+d.seq);
    if (!Number.isFinite(seq) || seq < 1) return Promise.resolve({ err: 'bad' });
    const sid = String(d.sid || '');
    if (!SID_RE.test(sid)) return Promise.resolve({ err: 'bad' });
    const chk = checkSystems(d.systems);
    if (chk.err) return Promise.resolve({ err: chk.err });
    const str = chk.str;
    return serial(lid, async () => {
      const t = now();
      if (t - (lastSave.get(lid) || 0) < SAVE_MIN_MS) return { err: 'rate' };
      lastSave.set(lid, t);
      const cur = await meta(lid);
      if (cur.w && cur.w !== sid) return { err: 'replaced', seq: cur.seq }; /* เครื่องอื่นโหลดไปเล่นต่อแล้ว */
      if (seq <= cur.seq) return { err: 'old', seq: cur.seq };
      await write(lid, { v: SAVE_VERSION, seq, upd: t, server: cur.server, w: sid }, str);
      return { ok: true, seq, upd: t };
    });
  }

  /* ต่อใหม่เองด้วยโทเคน (hello resume · 1B-g N3): เครื่องนี้ยังเป็นผู้เขียนล่าสุดไหม
     ทำใน serial ของบัญชี → fn (ผูกเซสชัน) ทำต่อทันทีในคิวเดียวกัน ไม่มี load ของเครื่องอื่นแทรกกลางได้
     ยังไม่เคยมีผู้เขียน (ไม่เคยโหลด) → ถือว่าใช่ · คืน true = ผ่าน (เรียก fn แล้ว) / false = เครื่องอื่นเล่นอยู่ */
  function claim(lid, sid, fn) {
    return serial(lid, async () => {
      const m = await meta(lid);
      if (m.w && m.w !== String(sid || '')) return false;
      fn();
      return true;
    });
  }

  /* ให้โค้ดฝั่งเซิร์ฟเวอร์เปลี่ยนส่วน server (เช่น เงิน · เฟส 4/6) — เครื่องผู้เล่นเรียกตรงไม่ได้ */
  function updateServer(lid, fn) {
    return serial(lid, async () => {
      const { m, sys } = await full(lid);
      const next = normServer(fn({ ...m.server }) || m.server);
      await write(lid, { ...m, server: next }, sys);
      return next;
    });
  }

  return { load, save, claim, updateServer, sweep, _cache: cache, _cacheStat: stat, _lastSave: lastSave, cacheBytes };
}

module.exports = { createSaves, SAVE_VERSION, MAX_SAVE_CHARS, SAVE_MIN_MS, COIN_MAX, SID_RE, CACHE_MAX, CACHE_BYTES, freshDoc, keyOf };
