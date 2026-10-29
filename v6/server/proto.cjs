/* proto — ข้อความ WebSocket ของ v6 (ตารางเต็ม: v6/server/PROTOCOL.md)
   รับ "การเชื่อมต่อ" แบบนามธรรม { send(obj), close(code, why), ip } — ใช้ได้ทั้ง ws จริงและเทส
   - ยังไม่ล็อกอิน: ใช้ได้แค่ register · login · hello · time · อื่น ๆ → err auth
   - ข้อความผิดรูป → err bad (ผิดเกิน 10 ครั้ง → ตัด) · เกิน 30 ข้อความ/วิ → ตัด
   - ไอดีเดียวเข้าซ้อน: ตัวเก่าได้ dupe แล้วถูกตัด (เซสชันเดียว · spec05 §2.5, §4) */
const PROTO_V = 1;
const MSG_PER_SEC = 30, BAD_MAX = 10;
const PRE_AUTH = new Set(['register', 'login', 'hello', 'time']);
const TYPES = new Set(['register', 'login', 'hello', 'time', 'load', 'save', 'logout']);

function createProto({ accounts, saves, now = () => Date.now(), log = () => {} }) {
  const sessions = new Map(); /* lid → conn ที่ใช้งานอยู่ */
  const conns = new Set();

  function open(conn) {
    Object.assign(conn, { lid: null, id: null, token: null, rate: 0, rateT: 0, bad: 0, q: Promise.resolve(), dead: false });
    conns.add(conn);
    reply(conn, { t: 'welcome', v: PROTO_V, s: now() });
  }

  function closed(conn) {
    conn.dead = true;
    conns.delete(conn);
    if (conn.lid && sessions.get(conn.lid) === conn) sessions.delete(conn.lid);
  }

  function reply(conn, o) { if (!conn.dead) { try { conn.send(o); } catch (e) { /* ซ็อกเก็ตปิดแล้ว */ } } }

  function bad(conn, r) {
    reply(conn, { t: 'err', why: 'bad', r });
    if (++conn.bad >= BAD_MAX) conn.close(1008, 'bad');
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
    sessions.set(acc.lid, conn);
  }

  async function handleOne(conn, d) {
    const r = d.r;
    switch (d.t) {
      case 'time':
        return reply(conn, { t: 'time', r, c: Number.isFinite(+d.c) ? +d.c : 0, s: now() });
      case 'register':
      case 'login': {
        const res = await accounts[d.t]({ id: d.id, pw: d.pw, name: d.name }, conn.ip);
        if (!res.ok) return reply(conn, { t: 'auth_no', r, why: res.err, sec: res.sec });
        bind(conn, res, res.token);
        return reply(conn, { t: 'auth_ok', r, id: res.id, name: res.name, gm: res.gm, token: res.token, created: !!res.created });
      }
      case 'hello': {
        const res = await accounts.verify(d.id, d.token);
        if (!res.ok) return reply(conn, { t: 'auth_no', r, why: 'auth' });
        bind(conn, res, String(d.token));
        return reply(conn, { t: 'auth_ok', r, id: res.id, name: res.name, gm: res.gm });
      }
      case 'load': {
        const doc = await saves.load(conn.lid);
        return reply(conn, { t: 'load', r, doc });
      }
      case 'save': {
        const lid = conn.lid;
        const res = await saves.save(lid, { seq: d.seq, systems: d.systems });
        if (!res.ok) return reply(conn, { t: 'save_no', r, why: res.err, seq: res.seq });
        return reply(conn, { t: 'save_ok', r, seq: res.seq, upd: res.upd });
      }
      case 'logout': {
        if (conn.token) await accounts.logout(conn.id, conn.token);
        if (sessions.get(conn.lid) === conn) sessions.delete(conn.lid);
        conn.lid = conn.id = conn.token = null;
        return reply(conn, { t: 'bye', r });
      }
    }
  }

  /* ข้อความดิบจากซ็อกเก็ต */
  function message(conn, raw) {
    if (conn.dead) return;
    const t = now();
    if (t - conn.rateT > 1000) { conn.rateT = t; conn.rate = 0; }
    if (++conn.rate > MSG_PER_SEC) { conn.close(1008, 'rate'); return; }
    let d;
    try { d = JSON.parse(String(raw)); } catch (e) { return bad(conn); }
    if (!d || typeof d !== 'object' || Array.isArray(d) || !TYPES.has(d.t)) return bad(conn, d && d.r);
    if (d.r != null && !(typeof d.r === 'number' || (typeof d.r === 'string' && d.r.length <= 32))) return bad(conn);
    /* ทำทีละข้อความตามลำดับที่ส่งมา (ล็อกอินเสร็จก่อนโหลด) */
    conn.q = conn.q.then(async () => {
      if (conn.dead) return;
      if (!PRE_AUTH.has(d.t) && !conn.lid) return reply(conn, { t: 'err', why: 'auth', r: d.r });
      try { await handleOne(conn, d); }
      catch (e) { log('[v6] ' + d.t + ' error: ' + (e && e.message)); reply(conn, { t: 'err', why: 'server', r: d.r }); }
    });
    return conn.q;
  }

  return { open, message, closed, sessions, conns, PROTO_V };
}

module.exports = { createProto, PROTO_V, MSG_PER_SEC };
