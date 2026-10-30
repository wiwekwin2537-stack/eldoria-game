/* proto — ข้อความ WebSocket ของ v6 (ตารางเต็ม: v6/server/PROTOCOL.md)
   รับ "การเชื่อมต่อ" แบบนามธรรม { send(obj), close(code, why), ip } — ใช้ได้ทั้ง ws จริงและเทส
   - ยังไม่ล็อกอิน: ใช้ได้แค่ register · login · hello · time · อื่น ๆ → err auth · ไม่ล็อกอินภายใน 60 วิ → ตัด (L2)
   - ข้อความผิดรูป → err bad (ผิดเกิน 10 ครั้ง → ตัด) · เกิน 30 ข้อความ/วิ หรือ 512 KB/วิ → ตัด (M2)
   - กันหน่วยความจำบวม (ผลตรวจ H1): ค้างในคิวเกิน 8 ข้อความ → ตัด · ยังไม่ล็อกอินรับข้อความ ≤2 KB · ข้อความอื่นที่ไม่ใช่ save ≤4 KB
     · เก็บเข้าคิวแค่ช่องที่ใช้ (ทิ้งช่องขยะก่อนเข้าคิว)
   - กันเผาโควตาที่เก็บ (ผลตรวจ H2): hello ≤10/นาที/IP + ≤3/นาที/ซ็อกเก็ต · load ≤1 ครั้ง/5 วิ/ซ็อกเก็ต + ≤20/นาที/IP
     · save ≤2/วิ/ซ็อกเก็ต (เกินตอบ rate โดยไม่แตะที่เก็บ) · ทั้งหมดอยู่ใต้งบรวมใน index.cjs (budgetStore)
   - ไอดีเดียวเข้าซ้อน: ตัวเก่าได้ dupe แล้วถูกตัด (เซสชันเดียว · spec05 §2.5, §4)
     ยกเว้น hello แบบต่อใหม่เอง (resume) ที่ไม่ใช่ผู้เขียนล่าสุด → ไม่เตะ ตอบ replaced (1B-g N3 · PROTOCOL.md)
     และ resume ขณะที่อีกเครื่องเปิดเกมอยู่แต่ยังโหลดไม่เสร็จ → replaced เหมือนกัน (เครื่องที่เปิดใหม่ล่าสุดชนะ · 1Z/1B-g M2)
   - กันเซฟก้อนใหญ่ค้างในคิวตอนที่เก็บช้า (1Z/1B-g M1): ข้อความ >1 KB นับไบต์ที่ "ค้างอยู่" ทั้งเซิร์ฟเวอร์ (≤2 MB) และต่อซ็อกเก็ต (≤2 ก้อน)
     เกิน → ตอบ busy ทันที "ก่อน JSON.parse" (อ็อบเจกต์ที่แปลงแล้วบวมได้ ~14 เท่า: [[],[],…] 256 KB → ~3.5 MB)
     · ชนิดคำตอบดูจาก "t" หัวข้อความ (peekT · ผลตรวจ 1Z L2): save → save_no busy · อื่น ๆ (hello/login ก้อนใหญ่) → err busy
     คืนโควตาเมื่อข้อความนั้นทำเสร็จ (รวมเวลารอที่เก็บ) · เกมถอยเวลาเองเมื่อได้ busy (core/save · N2) */
const { counter, ipKey } = require('./limits.cjs');

const PROTO_V = 1;
const MSG_PER_SEC = 30, BAD_MAX = 10;
const BYTES_PER_SEC = 512 * 1024;
const MAX_PENDING = 8;
const PRE_AUTH_MAX = 2048, SMALL_MAX = 4096;
const AUTH_TIMEOUT_MS = 60000;
const BIG_MIN = 1024;                     /* ข้อความใหญ่กว่านี้ = "ก้อนใหญ่" ที่ต้องนับ (เซฟจริงเกือบทั้งหมด) */
const BIG_PENDING_BYTES = 2 * 1024 * 1024; /* ไบต์ดิบของก้อนใหญ่ที่ค้างรอพร้อมกันทั้งเซิร์ฟเวอร์ (แปลงแล้วแย่สุด ~30 MB) */
const BIG_PENDING_SOCK = 2;                /* ก้อนใหญ่ที่ค้างพร้อมกันต่อซ็อกเก็ต (เกมส่งทีละ 1 + flush ตอนปิดแท็บ) */
/* หัว/ท้ายข้อความดิบ n ตัวอักษร (ไม่แปลงทั้งก้อน) */
const headOf = (raw, n) => typeof raw === 'string' ? raw.slice(0, n) : raw.subarray(0, n).toString('latin1');
const tailOf = (raw, n) => typeof raw === 'string' ? raw.slice(-n) : raw.subarray(Math.max(0, raw.length - n)).toString('latin1');
/* เลข r ของคำขอโดยไม่ parse ทั้งก้อน: เกม (core/net) ใส่ r ไว้ท้ายสุด {...,"r":12} · หรือหัวสุด {"r":12,...}
   r เป็นตัวเลข หรือสตริง ≤32 ตัว (แบบเดียวกับที่ parse ยอมรับ · ผลตรวจ 1Z L2 เดิมสตริงได้ undefined → เครื่องรอจนหมดเวลา) */
const R_VAL = '(\\d{1,15}|"[^"\\\\]{0,32}")';
const R_TAIL = new RegExp('"r"\\s*:\\s*' + R_VAL + '\\s*\\}\\s*$'), R_HEAD = new RegExp('^\\s*\\{\\s*"r"\\s*:\\s*' + R_VAL + '\\s*[,}]');
function peekR(raw) {
  try {
    const m = R_TAIL.exec(tailOf(raw, 60)) || R_HEAD.exec(headOf(raw, 60));
    if (!m) return undefined;
    return m[1][0] === '"' ? m[1].slice(1, -1) : +m[1];
  } catch (e) { return undefined; }
}
/* ชนิดข้อความ "t" โดยไม่ parse: เกมใส่ t ไว้หน้าสุดเสมอ ({t:'save',...} · core/save) · หาไม่เจอ = undefined */
function peekT(raw) {
  try {
    const m = /^\s*\{\s*(?:"r"\s*:\s*(?:\d{1,15}|"[^"\\]{0,32}")\s*,\s*)?"t"\s*:\s*"(\w{1,16})"/.exec(headOf(raw, 80));
    return m ? m[1] : undefined;
  } catch (e) { return undefined; }
}
const LIM = {
  helloIp: { max: 10, ms: 60000 }, helloSock: { max: 3, ms: 60000 },
  loadSock: { max: 1, ms: 5000 }, loadIp: { max: 20, ms: 60000 },
  saveSock: { max: 2, ms: 1000 },
};
const PRE_AUTH = new Set(['register', 'login', 'hello', 'time']);
const TYPES = new Set(['register', 'login', 'hello', 'time', 'load', 'save', 'logout']);
const FIELDS = ['t', 'r', 'id', 'pw', 'name', 'token', 'c', 'seq', 'sid', 'systems', 'resume'];

function createProto({ accounts, saves, now = () => Date.now(), log = () => {}, authTimeoutMs = AUTH_TIMEOUT_MS }) {
  const sessions = new Map(); /* lid → conn ที่ใช้งานอยู่ */
  const conns = new Set();
  const lim = {};
  for (const k in LIM) lim[k] = counter({ ...LIM[k], now });
  let sockN = 0;
  const big = { bytes: 0, refused: 0 }; /* ก้อนใหญ่ที่ค้างอยู่ทั้งเซิร์ฟเวอร์ (M1) */

  function armAuthTimer(conn) {
    clearTimeout(conn.authTimer);
    if (!(authTimeoutMs > 0)) return;
    conn.authTimer = setTimeout(() => { if (!conn.dead && !conn.lid) conn.close(4002, 'auth-timeout'); }, authTimeoutMs);
    conn.authTimer.unref && conn.authTimer.unref();
  }

  function open(conn) {
    Object.assign(conn, { lid: null, id: null, token: null, rate: 0, bytes: 0, rateT: 0, bad: 0, pending: 0, bigN: 0, sid: '', q: Promise.resolve(), dead: false,
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
        log('[v6] ' + d.t + ' id=' + JSON.stringify(String(d.id || '').slice(0, 24)) + ' pwLen=' + String(d.pw || '').length + ' → ' + (res.ok ? 'ok' : res.err + (res.diag ? '/' + res.diag : ''))); /* หัวหน้า 30 ต.ค.: หาสาเหตุ 'รหัสผิด' บนเว็บจริง (ไม่ log รหัส) */
        if (!res.ok) return reply(conn, { t: 'auth_no', r, why: res.err, sec: res.sec });
        bind(conn, res, res.token);
        return reply(conn, { t: 'auth_ok', r, id: res.id, name: res.name, gm: res.gm, token: res.token, created: !!res.created });
      }
      case 'hello': {
        /* อ่านที่เก็บทุกครั้ง → จำกัดต่อ IP และต่อซ็อกเก็ต (ไม่บอกว่าโทเคนผิด แค่ rate → เกมรอแล้วลองใหม่ ไม่ลืมโทเคน) */
        if (!lim.helloSock.hit(conn.sk) || !lim.helloIp.hit(conn.key)) return reply(conn, { t: 'auth_no', r, why: 'rate' });
        const res = await accounts.verify(d.id, d.token);
        if (!res.ok) log('[v6] hello id=' + JSON.stringify(String(d.id || '').slice(0, 24)) + ' → ' + res.err);
        if (!res.ok) return reply(conn, { t: 'auth_no', r, why: 'auth' });
        /* ต่อใหม่เองระหว่างเล่น (resume + sid ของการโหลดล่าสุดของเครื่องนี้ · 1B-g N3 · แบบ writer/document ของเกมเดิม):
           ถ้าเครื่องอื่นโหลดไปเล่นต่อแล้ว (w ≠ sid) → ไม่เตะเครื่องที่เล่นอยู่ ตอบ replaced ให้เครื่องนี้ถามผู้เล่นเอง
           ตรวจ w และผูกเซสชันในคิวเดียวกันของบัญชี (load ของเครื่องอื่นแทรกกลางไม่ได้)
           เปิดเกมใหม่ (ไม่มี resume) / พิมพ์รหัส = ตั้งใจเล่นเครื่องนี้ → เตะเครื่องเก่าเหมือนเดิม (dupe) */
        if (d.resume && typeof saves.claim === 'function') {
          if (conn.dead) return;
          const sid = String(d.sid || '');
          const okW = await saves.claim(res.lid, sid, () => {
            /* M2: อีกเครื่องเปิดเกมอยู่ (ซ็อกเก็ตยังเปิด) แต่ยังโหลดไม่เสร็จ → w ยังเป็นของเครื่องนี้ แต่ห้ามเตะเครื่องที่เพิ่งเปิด
               ยกเว้นซ็อกเก็ตนั้นเป็นของเครื่องนี้เอง (sid เดียวกัน = ซ็อกเก็ตเก่าที่ยังไม่รู้ว่าหลุด เช่น มือถือเปลี่ยนเน็ต) */
            const cur = sessions.get(res.lid);
            if (cur && cur !== conn && !cur.dead && cur.sid !== sid) return false;
            if (!conn.dead) { bind(conn, res, String(d.token)); conn.sid = sid; }
            return true;
          });
          if (!okW) return reply(conn, { t: 'auth_no', r, why: 'replaced' });
          if (conn.dead) return;
        } else bind(conn, res, String(d.token));
        return reply(conn, { t: 'auth_ok', r, id: res.id, name: res.name, gm: res.gm });
      }
      case 'load': {
        if (!lim.loadSock.hit(conn.sk) || !lim.loadIp.hit(conn.key)) return reply(conn, { t: 'err', why: 'rate', r });
        const doc = await saves.load(conn.lid, d.sid);
        conn.sid = String(d.sid || ''); /* เครื่องนี้โหลดแล้ว (M2: ซ็อกเก็ตที่ยังไม่โหลด = เครื่องที่เพิ่งเปิด) */
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

  /* แปลง + ตรวจรูปข้อความ → m (เฉพาะช่องที่ใช้) | null (ตอบ bad แล้ว) */
  function parse(conn, raw, size) {
    let d;
    try { d = JSON.parse(String(raw)); } catch (e) { bad(conn); return null; }
    if (!d || typeof d !== 'object' || Array.isArray(d) || !TYPES.has(d.t)) { bad(conn, d && typeof d.r !== 'object' ? d.r : undefined); return null; }
    if (d.r != null && !(typeof d.r === 'number' || (typeof d.r === 'string' && d.r.length <= 32))) { bad(conn); return null; }
    if (d.t !== 'save' && size > SMALL_MAX) { bad(conn, d.r); return null; }
    const m = {};
    for (const k of FIELDS) if (Object.prototype.hasOwnProperty.call(d, k)) m[k] = d[k];
    return m;
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
    /* M1: ก้อนใหญ่ → จองไบต์ก่อน parse · เต็ม = busy ทันที (ไม่ parse ไม่เข้าคิว) */
    const isBig = size > BIG_MIN;
    if (isBig) {
      if (big.bytes + size > BIG_PENDING_BYTES || conn.bigN >= BIG_PENDING_SOCK) {
        big.refused++;
        /* save → save_no (core/save ถอยเวลา) · อื่น ๆ → err busy (core/net ไม่ลืมโทเคน · ถอยเวลา) · ผลตรวจ 1Z L2 */
        const r = peekR(raw);
        return reply(conn, peekT(raw) === 'save' ? { t: 'save_no', why: 'busy', r } : { t: 'err', why: 'busy', r });
      }
      big.bytes += size; conn.bigN++;
    }
    const m = parse(conn, raw, size);
    raw = null;
    const release = () => { if (isBig) { big.bytes -= size; conn.bigN--; } };
    if (!m) { release(); return; }
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
      } finally { conn.pending--; release(); }
    });
    return conn.q;
  }

  function sweep() { for (const k in lim) lim[k].sweep(); }

  return { open, message, closed, sweep, sessions, conns, PROTO_V, _lim: lim, _big: big };
}

module.exports = { createProto, peekR, peekT, PROTO_V, MSG_PER_SEC, BYTES_PER_SEC, MAX_PENDING, PRE_AUTH_MAX, SMALL_MAX, AUTH_TIMEOUT_MS, LIM, BIG_MIN, BIG_PENDING_BYTES, BIG_PENDING_SOCK };
