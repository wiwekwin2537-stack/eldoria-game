/* net — เชื่อมต่อเซิร์ฟเวอร์ v6 ผ่าน WebSocket `/v6ws` (เจ้าของ G.net · ตารางข้อความ: v6/server/PROTOCOL.md)
   G.net = { online    ต่อเซิร์ฟเวอร์ได้แล้ว (ได้ welcome)
             phase     'nosrv' เปิดผ่าน dev-server ไม่มีเซิร์ฟเวอร์ v6 (ไม่ต่อ ws · ไม่เซฟ) · 'connecting' กำลังต่อ · 'offline' ต่อไม่ได้ (กำลังลองใหม่) · 'login' ต้องใส่ไอดี/รหัส
                       'authing' กำลังตรวจ · 'ready' ล็อกอินแล้ว · 'kicked' ถูกเตะ (ไม่ต่อใหม่เอง)
             authed id name gm  บัญชีที่ล็อกอิน · kicked: เหตุผล | null }
   - จำโทเคนในเครื่อง (localStorage `eld6:acct`) → เปิดเกมใหม่เข้าต่อเองด้วย hello ไม่ต้องพิมพ์รหัส
   - หลุดแล้วต่อใหม่เอง (1→2→4→8→15 วิ) และ hello ด้วยโทเคนเดิม · net:auth ส่งแค่ครั้งแรกของหน้าเว็บ
     (ต่อใหม่ไม่โหลดเซฟทับของที่เล่นอยู่ — core/save เซฟต่อจาก seq เดิม)
   - ต่อ ws เฉพาะเมื่อหน้าเว็บมาจากเซิร์ฟเวอร์ v6 จริง (<html data-v6-server="1"> ที่ v6/server/index.cjs ติดให้)
     dev-server (tools/dev-server.cjs) ไม่มี ws → ไม่ลองต่อ (กัน error ในคอนโซลของเทส 1A) · phase = 'nosrv'
   - เวลาเซิร์ฟเวอร์: welcome + ข้อความ time (หักครึ่งเวลาไป-กลับ) → core/time setServerTime */
import { emit } from './bus.js';
import { setServerTime } from './time.js';

export const ACCT_KEY = 'eld6:acct';
export const WS_PATH = '/v6ws';
export const RETRY_MS = [1000, 2000, 4000, 8000, 15000];
export const REQ_TIMEOUT_MS = 20000;
export const TIME_RESYNC_MS = 10 * 60 * 1000;

let G = null, ws = null, WS = null, url = '';
let rid = 0, retryN = 0, retryTimer = null, syncTimer = null, everAuthed = false;
const pending = new Map(); /* r → { ok, no, tm } */
let memAcct = null; /* สำรองเมื่อ localStorage ใช้ไม่ได้ */

/* ---------- ฟังก์ชันล้วน ---------- */
export function wsUrl(loc) { return (loc.protocol === 'https:' ? 'wss://' : 'ws://') + loc.host + WS_PATH; }
export function retryDelay(n) { return RETRY_MS[Math.min(n, RETRY_MS.length - 1)]; }
/* เวลาเซิร์ฟเวอร์ ณ ตอนได้คำตอบ = เวลาที่เซิร์ฟเวอร์ตอบ + ครึ่งเวลาไป-กลับ */
export function serverTimeAt(s, c, nowMs) { return s + Math.max(0, nowMs - c) / 2; }

/* ---------- บัญชีที่จำไว้ ---------- */
export function readAcct() {
  try { const o = JSON.parse(localStorage.getItem(ACCT_KEY) || 'null'); if (o && o.id && o.token) return o; } catch (e) {}
  return memAcct;
}
function writeAcct(o) { memAcct = o; try { localStorage.setItem(ACCT_KEY, JSON.stringify(o)); } catch (e) {} }
function clearAcct() { memAcct = null; try { localStorage.removeItem(ACCT_KEY); } catch (e) {} }

/* ---------- สถานะ ---------- */
function setPhase(p) { if (G) G.net.phase = p; }
function setOnline(on) {
  if (!G || G.net.online === on) return;
  G.net.online = on;
  emit('net:status', { online: on });
}

/* ---------- ส่ง/รับ ---------- */
export function isOpen() { return !!ws && ws.readyState === 1; }
export function isReady() { return isOpen() && !!G && G.net.authed && G.net.phase === 'ready'; }

/* ส่งแบบไม่รอคำตอบ → true ถ้าส่งออกไปได้ */
export function send(msg) {
  if (!isOpen()) return false;
  try { ws.send(JSON.stringify(msg)); return true; } catch (e) { return false; }
}

/* ส่งแล้วรอคำตอบที่มี r ตรงกัน → Promise(ข้อความตอบ) · ต่อไม่ได้/หมดเวลา → reject */
export function request(msg) {
  return new Promise((ok, no) => {
    if (!isOpen()) return no(new Error('offline'));
    const r = ++rid;
    const tm = setTimeout(() => { pending.delete(r); no(new Error('timeout')); }, REQ_TIMEOUT_MS);
    pending.set(r, { ok, no, tm });
    if (!send({ ...msg, r })) { clearTimeout(tm); pending.delete(r); no(new Error('offline')); }
  });
}

function failAll(why) {
  for (const [r, p] of pending) { clearTimeout(p.tm); p.no(new Error(why)); }
  pending.clear();
}

/* ---------- ล็อกอิน ---------- */
function authOk(m, token) {
  if (token) writeAcct({ id: m.id, token });
  Object.assign(G.net, { authed: true, id: m.id, name: m.name, gm: !!m.gm, kicked: null });
  setPhase('ready');
  if (!everAuthed) { everAuthed = true; emit('net:auth', { id: m.id, name: m.name, gm: !!m.gm }); }
}

function kick(reason) {
  if (G.net.phase === 'kicked') return;
  Object.assign(G.net, { authed: false, kicked: reason });
  setPhase('kicked');
  emit('net:kicked', { reason });
  try { ws && ws.close(); } catch (e) {}
}

/* ข้อความ auth_no → เหตุผล + วินาที (สำหรับหน้าล็อกอิน) */
async function auth(msg) {
  setPhase('authing');
  let m;
  try { m = await request(msg); } catch (e) { setPhase(isOpen() ? 'login' : 'offline'); return { err: 'offline' }; }
  if (m.t === 'auth_ok') { authOk(m, m.token); return { ok: true, created: !!m.created }; }
  setPhase('login');
  return { err: m.why || 'server', sec: m.sec };
}

export function login(id, pw) { return auth({ t: 'login', id: String(id).trim(), pw: String(pw) }); }
export function register(id, pw, name) { return auth({ t: 'register', id: String(id).trim(), pw: String(pw), name: String(name || '').trim() }); }

/* ออกจากระบบ: ลบโทเคนนี้บนเซิร์ฟเวอร์ + ลืมในเครื่อง (หน้าล็อกอินรีโหลดหน้าเว็บต่อเอง) */
export async function logout() {
  try { if (isReady()) await request({ t: 'logout' }); } catch (e) {}
  clearAcct();
  Object.assign(G.net, { authed: false, id: null, name: '', gm: false });
  setPhase(isOpen() ? 'login' : 'offline');
}

/* ต่อแล้วได้ welcome: ตั้งเวลา → ถ้าจำบัญชีไว้ เข้าต่อเอง */
async function onWelcome(m) {
  setServerTime(m.s);
  setOnline(true);
  syncTime();
  if (G.net.phase === 'kicked') return;
  const a = readAcct();
  if (!a) { retryN = 0; setPhase('login'); return; }
  setPhase('authing');
  let r;
  try { r = await request({ t: 'hello', id: a.id, token: a.token }); } catch (e) { return; } /* หลุดอีก → ต่อใหม่แล้วลองใหม่ */
  if (r.t === 'auth_ok') { retryN = 0; return authOk(r); }
  /* เซิร์ฟเวอร์ไม่ว่าง/ถี่เกิน (rate · busy · server) ≠ โทเคนเสีย → ไม่ลืมโทเคน · ตัดแล้วต่อใหม่ช้าลงเรื่อย ๆ (1→15 วิ) */
  if (r.why !== 'auth') { setPhase('offline'); try { ws && ws.close(); } catch (e) {} return; }
  retryN = 0;
  clearAcct();
  if (everAuthed) kick('auth'); /* เล่นอยู่แล้วโทเคนใช้ไม่ได้ (ออกจากระบบที่อื่น/เปลี่ยนรหัส) */
  else setPhase('login');       /* เปิดเกมใหม่ โทเคนหมดอายุ → ล็อกอินใหม่ */
}

async function syncTime() {
  try {
    const c = Date.now(); /* เวลาเครื่อง ใช้แค่วัดเวลาไป-กลับ */
    const m = await request({ t: 'time', c });
    setServerTime(serverTimeAt(m.s, m.c, Date.now()));
  } catch (e) {}
}

function onMessage(raw) {
  let m;
  try { m = JSON.parse(raw); } catch (e) { return; }
  if (!m || typeof m !== 'object') return;
  if (m.r != null && pending.has(m.r)) {
    const p = pending.get(m.r); pending.delete(m.r); clearTimeout(p.tm); p.ok(m);
    return;
  }
  if (m.t === 'welcome') onWelcome(m);
  else if (m.t === 'dupe') kick('dupe');
}

function open() {
  retryTimer = null;
  if (G.net.phase !== 'kicked') setPhase(G.net.authed ? 'authing' : 'connecting');
  let s;
  try { s = new WS(url); } catch (e) { return scheduleRetry(); }
  ws = s;
  s.onmessage = e => { if (ws === s) onMessage(e.data); };
  s.onclose = () => {
    if (ws !== s) return;
    ws = null;
    failAll('offline');
    setOnline(false);
    if (G.net.phase === 'kicked') return;
    setPhase('offline');
    scheduleRetry();
  };
  s.onerror = () => {};
}

function scheduleRetry() {
  if (retryTimer || G.net.phase === 'kicked') return;
  retryTimer = setTimeout(open, retryDelay(retryN++));
}

/* เริ่มต่อเซิร์ฟเวอร์ (เรียกครั้งเดียวจาก systems/login.js) · opts ใช้ในเทส: { url, WebSocket } */
export function hasServer(doc = globalThis.document) { return !!doc && doc.documentElement && doc.documentElement.dataset.v6Server === '1'; }

export function connect(g, opts = {}) {
  G = g;
  Object.assign(G.net, { online: false, phase: 'connecting', authed: false, id: null, name: '', gm: false, kicked: null });
  if (!opts.WebSocket && !hasServer()) { G.net.phase = 'nosrv'; return; }
  WS = opts.WebSocket || globalThis.WebSocket;
  url = opts.url || wsUrl(globalThis.location);
  everAuthed = false; retryN = 0;
  open();
  if (!syncTimer) syncTimer = setInterval(() => { if (isOpen()) syncTime(); }, TIME_RESYNC_MS);
}

/* ใช้ในเทสเท่านั้น: ตัดการเชื่อมต่อ/ล้างสถานะ */
export function _reset() {
  if (retryTimer) clearTimeout(retryTimer);
  if (syncTimer) clearInterval(syncTimer);
  retryTimer = syncTimer = null;
  const s = ws; ws = null;
  try { s && s.close(); } catch (e) {}
  failAll('reset');
  memAcct = null; everAuthed = false; G = null;
}
