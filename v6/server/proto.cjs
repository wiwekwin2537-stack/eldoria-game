/* proto — ข้อความ WebSocket ของ v6 (ตารางเต็ม: v6/server/PROTOCOL.md)
   รับ "การเชื่อมต่อ" แบบนามธรรม { send(obj), close(code, why), ip } — ใช้ได้ทั้ง ws จริงและเทส
   - ยังไม่ล็อกอิน: ใช้ได้แค่ register · login · hello · time · อื่น ๆ → err auth · ไม่ล็อกอินภายใน 60 วิ → ตัด (L2)
   - ข้อความผิดรูป → err bad (ผิดเกิน 10 ครั้ง → ตัด) · เกิน 30 ข้อความ/วิ หรือ 512 KB/วิ → ตัด (M2)
   - กันหน่วยความจำบวม (ผลตรวจ H1): ค้างในคิวเกิน 8 ข้อความ → ตัด · ยังไม่ล็อกอินรับข้อความ ≤2 KB · ข้อความอื่นที่ไม่ใช่ save ≤4 KB
     · เก็บเข้าคิวแค่ช่องที่ใช้ (ทิ้งช่องขยะก่อนเข้าคิว)
   - กันเผาโควตาที่เก็บ (ผลตรวจ H2): hello ≤10/นาที/IP + ≤3/นาที/ซ็อกเก็ต · load ≤1 ครั้ง/5 วิ/ซ็อกเก็ต + ≤20/นาที/IP
     · save ≤2/วิ/ซ็อกเก็ต (เกินตอบ rate โดยไม่แตะที่เก็บ) · ทั้งหมดอยู่ใต้งบรวมใน index.cjs (budgetStore)
   - ไอดีเดียวเข้าซ้อน: ตัวเก่าได้ dupe แล้วถูกตัด (เซสชันเดียว · spec05 §2.5, §4) */
const { counter, ipKey } = require('./limits.cjs');

const PROTO_V = 1;
const MSG_PER_SEC = 30, BAD_MAX = 10;
const BYTES_PER_SEC = 512 * 1024;
const MAX_PENDING = 8;
const PRE_AUTH_MAX = 2048, SMALL_MAX = 4096;
const AUTH_TIMEOUT_MS = 60000;
const LIM = {
  helloIp: { max: 10, ms: 60000 }, helloSock: { max: 3, ms: 60000 },
  loadSock: { max: 1, ms: 5000 }, loadIp: { max: 20, ms: 60000 },
  saveSock: { max: 2, ms: 1000 },
};
const PRE_AUTH = new Set(['register', 'login', 'hello', 'time']);
const TYPES = new Set(['register', 'login', 'hello', 'time', 'load', 'save', 'logout']);
const FIELDS = ['t', 'r', 'id', 'pw', 'name', 'token', 'c', 'seq', 'sid', 'systems'];

function createProto({ accounts, saves, now = () => Date.now(), log = () => {}, authTimeoutMs = AUTH_TIMEOUT_MS }) {
  const sessions = new Map(); /* lid → conn ที่ใช้งานอยู่ */
  const conns = new Set();
  const lim = {};
  for (const k in LIM) lim[k] = counter({ ...LIM[k], now });
  let sockN = 0;

  function armAuthTimer(conn) {
    clearTimeout(conn.authTimer);
    if (!(authTimeoutMs > 0)) return;
    conn.authTimer = setTimeout(() => { if (!conn.dead && !conn.lid) conn.close(4002, 'auth-timeout'); }, authTimeoutMs);
    conn.authTimer.unref && conn.authTimer.unref();
  }

  function open(conn) {
    Object.assign(conn, { lid: null, id: null, token: null, rate: 0, bytes: 0, rateT: 0, bad: 0, pending: 0, q: Promise.resolve(), dead: false,
      key: ipKey(conn.ip), sk: 's' + (++sockN), authTimer: null });
    conns.add(conn);
    armAuthTimer(conn);
    reply(conn, { t: 'welcome', v: PROTO_V, s: now() });
  }

  function closed(conn) {
    conn.dead = true;
    clearTimeout(conn.authTimer);
    conns.delete(conn);
    if (conn.lid && sessions.get(conn.lid) === conn) sessions.delete(conn.lid);
  }

  function reply(conn, o) { if (!conn.dead) { try { conn.send(o); } catch (e) { /* ซ็อกเก็ตปิดแล้ว */ } } }
  function cut(conn, code, why) { if (conn.dead) return; conn.dead = true; try { conn.close(code, why); } catch (e) {} }

  function bad(conn, r) {
    reply(conn, { t: 'err', why: 'bad', r });
    if (++conn.bad >= BAD_MAX) cut(conn, 1008, 'bad');
  }

  /* ผูกการเชื่อมต่อกับบัญชี · ตัวเก่าของไอดีเดียวกันถูกเตะ */
  function bind(conn, acc, token) {
    const old = sessions.get(acc.lid);
    if (old && old !== conn) {
      reply(old, { t: 'dupe' });
      old.lid = null; /* ตัวเก่าเซฟไม่ได้อีก ตั้งแต่ตอนนี้ */
      sessions.delete(acc.lid);
      setTimeout(() => old.close(4001, 'dupe'), 300);
    }
    if (conn.lid && conn.lid !== acc.lid && sessions.get(conn.lid) === conn) sessions.delete(conn.lid);
    conn.lid = acc.lid; conn.id = acc.id; conn.token = token;
    clearTimeout(conn.authTimer);
    sessions.set(acc.lid, conn);
  }

  async function handleOne(conn, d) {
    const r = d.r;
    switch (d.t) {
      case 'time':
        return reply(conn, { t: 'time', r, c: Number.isFinite(+d.c) ? +d.c : 0, s: now() });
      case 'register':
      case 'login': {
        const res = await accounts[d.t]({ id: d.id, pw: d.pw, name: d.name }, conn.key);
        if (!res.ok) return reply(conn, { t: 'auth_no', r, why: res.err, sec: res.sec });
        bind(conn, res, res.token);
        return reply(conn, { t: 'auth_ok', r, id: res.id, name: res.name, gm: res.gm, token: res.token, created: !!res.created });
      }
      case 'hello': {
        /* อ่านที่เก็บทุกครั้ง → จำกัดต่อ IP และต่อซ็อกเก็ต (ไม่บอกว่าโทเคนผิด แค่ rate → เกมรอแล้วลองใหม่ ไม่ลืมโทเคน) */
        if (!lim.helloSock.hit(conn.sk) || !lim.helloIp.hit(conn.key)) return reply(conn, { t: 'auth_no', r, why: 'rate' });
        const res = await accounts.verify(d.id, d.token);
        if (!res.ok) return reply(conn, { t: 'auth_no', r, why: 'auth' });
        bind(conn, res, String(d.token));
        return reply(conn, { t: 'auth_ok', r, id: res.id, name: res.name, gm: res.gm });
      }
      case 'load': {
        if (!lim.loadSock.hit(conn.sk) || !lim.loadIp.hit(conn.key)) return reply(conn, { t: 'err', why: 'rate', r });
        const doc = await saves.load(conn.lid, d.sid);
        return reply(conn, { t: 'load', r, doc });
      }
      case 'save': {
        if (!lim.saveSock.hit(conn.sk)) return reply(conn, { t: 'save_no', r, why: 'rate' });
        const res = await saves.save(conn.lid, { seq: d.seq, sid: d.sid, systems: d.systems });
        if (!res.ok) return reply(conn, { t: 'save_no', r, why: res.err, seq: res.seq });
        return reply(conn, { t: 'save_ok', r, seq: res.seq, upd: res.upd });
      }
      case 'logout': {
        if (conn.token) await accounts.logout(conn.id, conn.token);
        if (sessions.get(conn.lid) === conn) sessions.delete(conn.lid);
        conn.lid = conn.id = conn.token = null;
        armAuthTimer(conn);
        return reply(conn, { t: 'bye', r });
      }
    }
  }

  /* ข้อความดิบจากซ็อกเก็ต */
  function message(conn, raw) {
    if (conn.dead) return;
    const size = typeof raw === 'string' ? Buffer.byteLength(raw) : (raw && raw.length) || 0;
    const t = now();
    if (t - conn.rateT >= 1000) { conn.rateT = t; conn.rate = 0; conn.bytes = 0; }
    conn.bytes += size;
    if (++conn.rate > MSG_PER_SEC || conn.bytes > BYTES_PER_SEC) { cut(conn, 1008, 'rate'); return; }
    if (!conn.lid && size > PRE_AUTH_MAX) { cut(conn, 1009, 'size'); return; } /* ยังไม่ล็อกอิน: ข้อความใหญ่ = ไม่ใช่เกมจริง */
    if (conn.pending >= MAX_PENDING) { cut(conn, 1008, 'queue'); return; }     /* ที่เก็บช้า + ยิงรัว → ไม่ให้คิวโต (H1) */
    let d;
    try { d = JSON.parse(String(raw)); } catch (e) { return bad(conn); }
    raw = null;
    if (!d || typeof d !== 'object' || Array.isArray(d) || !TYPES.has(d.t)) return bad(conn, d && typeof d.r !== 'object' ? d.r : undefined);
    if (d.r != null && !(typeof d.r === 'number' || (typeof d.r === 'string' && d.r.length <= 32))) return bad(conn);
    if (d.t !== 'save' && size > SMALL_MAX) return bad(conn, d.r);
    const m = {};
    for (const k of FIELDS) if (Object.prototype.hasOwnProperty.call(d, k)) m[k] = d[k];
    d = null;
    /* ทำทีละข้อความตามลำดับที่ส่งมา (ล็อกอินเสร็จก่อนโหลด) */
    conn.pending++;
    conn.q = conn.q.then(async () => {
      try {
        if (conn.dead) return;
        if (!PRE_AUTH.has(m.t) && !conn.lid) return reply(conn, { t: 'err', why: 'auth', r: m.r });
        try { await handleOne(conn, m); }
        catch (e) {
          const busy = e && e.code === 'busy';
          if (!busy) log('[v6] ' + m.t + ' error: ' + (e && e.message));
          reply(conn, { t: 'err', why: busy ? 'busy' : 'server', r: m.r });
        }
      } finally { conn.pending--; }
    });
    return conn.q;
  }

  function sweep() { for (const k in lim) lim[k].sweep(); }

  return { open, message, closed, sweep, sessions, conns, PROTO_V, _lim: lim };
}

module.exports = { createProto, PROTO_V, MSG_PER_SEC, BYTES_PER_SEC, MAX_PENDING, PRE_AUTH_MAX, SMALL_MAX, AUTH_TIMEOUT_MS, LIM };
