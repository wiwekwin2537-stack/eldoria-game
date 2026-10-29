/* accounts — สมัคร / ล็อกอิน / โทเคน / GM ของ v6 (spec05 §1, §3)
   - ไอดี /^[A-Za-z0-9_ก-๙]{3,16}$/ เทียบตัวเล็ก · รหัส 6–64 ตัว · ชื่อ ≤14 ตัว ตัดอักขระควบคุม/<>   (spec05 §1.2)
   - รหัส: scrypt N=16384 r=8 p=1 · 32 ไบต์ + salt 16 ไบต์                                         (spec05 §1.2)
   - ผิด ≥8 ครั้ง → ล็อก min(900, 20×2^(n-8)) วิ · จำกัดการลองต่อ IP                                  (spec05 §1.2)
   - โทเคน: สุ่ม 24 ไบต์ เก็บแค่ sha256 · อายุ 90 วัน · เก็บ 8 อันล่าสุด                               (spec05 §1.2)
   - GM = ไอดีใน env GM_IDS (เริ่มต้น tiksi,wiwekwin2537) · สมัครไอดี GM ได้เฉพาะ GM_ALLOW_REG=1       (spec05 §3) */
const crypto = require('crypto');
const { PREFIX } = require('./store.cjs');

const ID_RE = /^[A-Za-z0-9_ก-๙]{3,16}$/;
const PW_MIN = 6, PW_MAX = 64, NAME_MAX = 14;
const TOKEN_DAYS = 90, TOKEN_KEEP = 8;
const FAIL_FREE = 8, LOCK_BASE_S = 20, LOCK_MAX_S = 900;
const IP_TRIES_PER_MIN = 20; /* สมัคร+ล็อกอินรวมกัน ต่อ IP ต่อนาที */
const FAIL_FORGET_MS = 15 * 60 * 1000; /* ผิดครั้งล่าสุดนานกว่านี้ + ไม่ล็อกอยู่ → ลืม (L1) */
const MAP_CAP = 50000;                 /* เพดานจำนวนรายการต่อตาราง (กันหน่วยความจำโตจากไอดี/IP มั่ว) */
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const keyOf = lid => PREFIX + 'acct:' + sha(lid).slice(0, 40);
const cleanName = s => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, NAME_MAX);
const scrypt = (pw, salt) => new Promise((ok, no) => crypto.scrypt(String(pw), salt, 32, SCRYPT, (e, k) => e ? no(e) : ok(k)));

function createAccounts({ store, env = process.env, now = () => Date.now() }) {
  const GM_IDS = new Set(String(env.GM_IDS || 'tiksi,wiwekwin2537').split(',').map(s => s.trim().toLowerCase()).filter(Boolean));
  const gmAllowReg = env.GM_ALLOW_REG === '1';
  const fails = new Map();   /* lid → { n, until } (หน่วยความจำ — รีสตาร์ตแล้วหาย เหมือนเกมเดิม) */
  const ipTries = new Map(); /* ip → { n, t } */
  const locks = new Map();   /* lid → Promise (เขียนบัญชีทีละครั้ง) */

  const isGM = lid => GM_IDS.has(String(lid || '').toLowerCase());

  function serial(lid, fn) {
    const prev = locks.get(lid) || Promise.resolve();
    const run = prev.then(fn, fn);
    const tail = run.catch(() => {});
    locks.set(lid, tail);
    tail.then(() => { if (locks.get(lid) === tail) locks.delete(lid); });
    return run;
  }

  /* ลบรายการหมดอายุ (index.cjs เรียกเป็นระยะ · ผลตรวจ L1) */
  function sweep() {
    const t = now();
    for (const [k, e] of ipTries) if (t - e.t > 60000) ipTries.delete(k);
    for (const [k, f] of fails) if (f.until <= t && t - (f.t || 0) > FAIL_FORGET_MS) fails.delete(k);
  }
  /* ใส่รายการใหม่โดยไม่ให้ตารางเกินเพดาน (ล้างของหมดอายุก่อน · ยังเต็ม → ลบตัวเก่าสุด) */
  function capPut(map, k, v) {
    if (!map.has(k) && map.size >= MAP_CAP) { sweep(); while (map.size >= MAP_CAP) map.delete(map.keys().next().value); }
    map.set(k, v);
  }

  function ipLimited(ip) {
    const t = now(), e = ipTries.get(ip);
    if (!e || t - e.t > 60000) { capPut(ipTries, ip, { n: 1, t }); return false; }
    return ++e.n > IP_TRIES_PER_MIN;
  }

  function lockedFor(lid) {
    const f = fails.get(lid);
    return f && f.until > now() ? Math.ceil((f.until - now()) / 1000) : 0;
  }
  function addFail(lid) {
    const f = fails.get(lid) || { n: 0, until: 0, t: 0 };
    f.n++; f.t = now();
    if (f.n >= FAIL_FREE) f.until = now() + Math.min(LOCK_MAX_S, LOCK_BASE_S * 2 ** (f.n - FAIL_FREE)) * 1000;
    capPut(fails, lid, f);
  }

  async function readRec(lid) {
    const raw = await store.get(keyOf(lid));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  /* ออกโทเคนใหม่ใส่ rec (ยังไม่เขียน) */
  function issueToken(rec) {
    const tok = crypto.randomBytes(24).toString('hex'), t = now();
    rec.tokens = (rec.tokens || []).filter(x => x.exp > t);
    rec.tokens.push({ h: sha(tok), exp: t + TOKEN_DAYS * 864e5 });
    if (rec.tokens.length > TOKEN_KEEP) rec.tokens = rec.tokens.slice(-TOKEN_KEEP);
    return tok;
  }

  const pub = (rec, token) => ({ ok: true, id: rec.id, lid: rec.lid, name: rec.name, gm: isGM(rec.lid), token });

  /* สมัคร → { ok, id, lid, name, gm, token, created:true } | { err } */
  async function register(d, ip = '') {
    const id = String(d && d.id || ''), pw = String(d && d.pw || '');
    if (ipLimited(ip)) return { err: 'rate' };
    if (!ID_RE.test(id)) return { err: 'bad-id' };
    if (pw.length < PW_MIN || pw.length > PW_MAX) return { err: 'bad-pw' };
    const lid = id.toLowerCase();
    if (isGM(lid) && !gmAllowReg) return { err: 'taken' }; /* spec05 §1.2 — ไอดี GM สมัครไม่ได้ ยกเว้น GM_ALLOW_REG=1 */
    const salt = crypto.randomBytes(16);
    const hash = (await scrypt(pw, salt)).toString('hex');
    const rec = { v: 1, id, lid, name: cleanName(d.name) || id, salt: salt.toString('hex'), hash, created: now(), tokens: [] };
    const token = issueToken(rec);
    const made = await serial(lid, () => store.create(keyOf(lid), JSON.stringify(rec)));
    if (!made) return { err: 'taken' };
    return { ...pub(rec, token), created: true };
  }

  /* ล็อกอิน → { ok, ..., token } | { err, sec? } */
  async function login(d, ip = '') {
    const id = String(d && d.id || ''), pw = String(d && d.pw || '');
    if (ipLimited(ip)) return { err: 'rate' };
    if (!ID_RE.test(id) || pw.length < 1 || pw.length > PW_MAX) return { err: 'wrong' };
    const lid = id.toLowerCase();
    const sec = lockedFor(lid);
    if (sec) return { err: 'locked', sec };
    return serial(lid, async () => {
      const rec = await readRec(lid);
      /* ไม่มีบัญชี ก็คิด scrypt เหมือนกัน — เวลาตอบเท่ากัน เดาไม่ได้ว่าไอดีมีอยู่ไหม */
      const k = await scrypt(pw, rec ? Buffer.from(rec.salt, 'hex') : Buffer.alloc(16));
      if (!rec || !crypto.timingSafeEqual(k, Buffer.from(rec.hash, 'hex'))) { addFail(lid); return { err: 'wrong' }; }
      fails.delete(lid);
      const token = issueToken(rec);
      await store.set(keyOf(lid), JSON.stringify(rec));
      return pub(rec, token);
    });
  }

  /* ตรวจโทเคน → { ok, ... } | { err:'auth' } */
  async function verify(id, token) {
    id = String(id || ''); token = String(token || '');
    if (!ID_RE.test(id) || !/^[0-9a-f]{48}$/.test(token)) return { err: 'auth' };
    const rec = await readRec(id.toLowerCase());
    const h = sha(token), t = now();
    if (!rec || !(rec.tokens || []).some(x => x.h === h && x.exp > t)) return { err: 'auth' };
    return pub(rec);
  }

  /* ออกจากระบบ: ลบโทเคนนี้ */
  async function logout(id, token) {
    const lid = String(id || '').toLowerCase(), h = sha(token);
    return serial(lid, async () => {
      const rec = await readRec(lid);
      if (!rec) return;
      rec.tokens = (rec.tokens || []).filter(x => x.h !== h);
      await store.set(keyOf(lid), JSON.stringify(rec));
    });
  }

  return { register, login, verify, logout, isGM, sweep, _fails: fails, _ipTries: ipTries };
}

module.exports = { MAP_CAP, FAIL_FORGET_MS, createAccounts, ID_RE, PW_MIN, PW_MAX, NAME_MAX, cleanName, keyOf };
