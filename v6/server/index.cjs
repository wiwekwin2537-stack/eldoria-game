/* v6 server — โมดูลที่เซิร์ฟเวอร์เกมเดิม (server.js) ต่อเข้ามา ไม่พึ่งโค้ดเกมเดิม
   ใช้ใน server.js:
     const V6 = require('./v6/server/index.cjs');
     ...ในตัวรับ HTTP ก่อนข้อความสุดท้าย:  if (V6.http(req, res)) return;
     ...หลังสร้าง WebSocketServer เดิม:      V6.attach(server);
   - HTTP: เสิร์ฟ /v6/ (index.html + src/** + assets/*.webp|png) และ /assets/ (ภาพ · ยกเว้น /assets/incoming/) · ไม่เสิร์ฟ server/ tests/ tools/ spec/ *.md
   - WebSocket: path /v6ws เท่านั้น (เกมเดิมใช้ path อื่นตามเดิม) · เปิดเมื่อ env V6_ENABLE=1
   - กันเกมเดิมล่มเพราะ v6 (ผลตรวจ L4): ไฟล์นี้ require ส่วนอื่นใน try · V6.http / V6.attach / ตัวรับ upgrade ของ v6 ห่อ try ทุกตัว
     → v6 พังตอนบูตหรือระหว่างทำงาน เกมเดิมยังบูตและทำงานต่อ (เทส server.limits.test.js "v6 พังตอนโหลด") */
const fs = require('fs'), path = require('path');
let M = null, loadErr = null;
try {
  M = { ...require('./store.cjs'), ...require('./accounts.cjs'), ...require('./saves.cjs'), ...require('./proto.cjs'), ...require('./limits.cjs') };
} catch (e) {
  loadErr = e;
  try { console.error('[v6] โหลดโมดูล v6 ไม่ได้ — ปิด /v6ws (เกมเดิมทำงานต่อ): ' + (e && e.stack || e)); } catch (e2) {}
}

const ROOT = path.resolve(__dirname, '..', '..'); /* รากโปรเจกต์ */
const V6_DIR = path.join(ROOT, 'v6');
const WS_PATH = '/v6ws';
const MAX_PAYLOAD = 320 * 1024; /* เซฟสูงสุด 256 KB + หัวข้อความ */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const ASSET_EXT = new Set(['.png', '.webp', '.jpg', '.jpeg', '.svg', '.mp3', '.ogg', '.json']);

/* IP ผู้เล่น (ผลตรวจ M1) — x-forwarded-for = "ที่ผู้เล่นใส่มาเอง(ปลอมได้), ..., IP ที่พร็อกซีตัวแรกเห็น, IP ของพร็อกซีถัด ๆ ไป"
   พร็อกซีทุกตัว "ต่อท้าย" IP ที่ตัวเองเห็น → ตัวซ้าย ๆ ปลอมได้ ต้องอ่านจากขวา
   env V6_PROXY_HOPS:
     - ไม่ตั้ง / 'auto' (ค่าเริ่ม · ใช้บน Render): ถ้าคนที่ต่อเข้ามาตรง ๆ (socket) เป็นเครือข่ายภายใน/Cloudflare = มาผ่านพร็อกซี
       → ไล่จากขวาข้ามตัวที่เป็นพร็อกซี (เครือข่ายภายใน 10.x/172.16/192.168/100.64/127 · IPv6 ภายใน · ช่วง IP ของ Cloudflare)
       แล้วใช้ตัวแรกที่ไม่ใช่พร็อกซี = ผู้เล่นจริง · ถ้า socket เป็น IP สาธารณะ (ต่อตรง ไม่ผ่านพร็อกซี) → ไม่เชื่อ header เลย
       เหตุผล: Render บอกไม่ตรงกันว่าตัวท้ายเป็นผู้เล่นหรือพร็อกซีของ Render (community.render.com "Accessing client IPs" ·
       feedback.render.com "Send the correct X_FORWARDED_FOR") และหน้า Render มี Cloudflare · วิธีนี้ถูกทั้งสองแบบ
       ข้อจำกัด: ถ้าผู้โจมตียิงผ่าน Cloudflare Workers (IP ของ Cloudflare) จะปลอมตัวซ้ายได้ → ตั้งจำนวนชั้นตายตัวแทน
     - ตัวเลข N ≥1: เชื่อพร็อกซี N ชั้นพอดี → ใช้ตัวที่ N นับจากขวา (N=1 = ตัวท้ายสุด)
     - 0: ไม่มีพร็อกซี → ใช้ IP ของ socket (ไม่อ่าน header)
   env V6_LOG_XFF=1 → พิมพ์ header ดิบ 5 ครั้งแรกลง log (ให้เจ้าของดูบน Render ว่าตัวไหนคือผู้เล่นจริง แล้วตั้ง V6_PROXY_HOPS) */
function clientIp(req, env = {}) {
  const sock = String(req.socket && req.socket.remoteAddress || '');
  const xf = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
  const mode = String(env.V6_PROXY_HOPS == null ? 'auto' : env.V6_PROXY_HOPS).trim() || 'auto';
  const norm = ip => (M ? M.normIp(ip) : ip) || ip;
  if (/^\d+$/.test(mode)) {
    const n = +mode;
    if (n === 0 || !xf.length) return norm(sock);
    return norm(xf[Math.max(0, xf.length - n)]);
  }
  if (!M || !xf.length || !M.isProxyIp(sock)) return norm(sock);
  for (let i = xf.length - 1; i >= 0; i--) if (!M.isProxyIp(xf[i])) return norm(xf[i]);
  return norm(xf[0]);
}

/* Origin (ผลตรวจ M3 · ตรงกับ PROTOCOL.md): ไม่มี Origin (โปรแกรม/เทส ไม่ใช่เบราว์เซอร์) → ผ่าน
   · โดเมนเดียวกับ host → ผ่าน · อยู่ใน ALLOWED_ORIGINS → ผ่าน · อื่น ๆ รวม 'null' (iframe sandbox/ไฟล์) → ไม่ผ่าน */
function originOk(origin, host, allowed = []) {
  if (!origin) return true;
  if (allowed.includes(origin)) return true;
  if (origin === 'null') return false;
  try { return new URL(origin).host === host; } catch (e) { return false; }
}

const INDEX_FILE = path.join(V6_DIR, 'index.html');
const markIndex = html => html.replace(/<html\b/i, '<html data-v6-server="1"');

/* หาไฟล์จริงจาก url · คืน null = ไม่ใช่ของ v6 (ให้เกมเดิมจัดการต่อ) · { code } = ตอบรหัสนั้น · { file } = เสิร์ฟไฟล์ */
function resolveStatic(u) {
  if (u === '/v6') return { redirect: '/v6/' };
  const isV6 = u.startsWith('/v6/'), isAsset = u.startsWith('/assets/');
  if (!isV6 && !isAsset) return null;
  if (u.includes('\0') || u.split('/').some(s => s === '..' || s === '.')) return isV6 ? { code: 400 } : null;
  if (isV6) {
    if (u === '/v6/' || u === '/v6/index.html') return { file: INDEX_FILE };
    /* ภาพของ v6 (งาน 1A-4 · สร้างด้วย tools/make-webp.py) — webp/png เท่านั้น · ชื่อไฟล์มีเลขเวอร์ชัน → แคช 7 วันได้ */
    const a = /^\/v6\/assets\/([\w\-/.]+\.(?:webp|png))$/.exec(u);
    if (a) {
      const f = path.join(V6_DIR, 'assets', a[1]);
      if (!f.startsWith(path.join(V6_DIR, 'assets') + path.sep)) return { code: 404 };
      return { file: f, missing: 404, cache: 'public, max-age=604800' };
    }
    /* เสิร์ฟเฉพาะโค้ดเกมใน src/ (.js/.json) */
    const m = /^\/v6\/src\/([\w\-/.]+\.(?:js|json))$/.exec(u);
    if (!m) return { code: 404 };
    const f = path.join(V6_DIR, 'src', m[1]);
    if (!f.startsWith(path.join(V6_DIR, 'src') + path.sep)) return { code: 404 };
    return { file: f, missing: 404 };
  }
  /* /assets/ — เฉพาะไฟล์ภาพ/เสียงที่มีอยู่จริง · ไม่มี → ให้เกมเดิมตอบเหมือนเดิม
     /assets/incoming/ = ภาพที่ยังไม่ผ่านตรวจ → v6 ไม่เสิร์ฟ (เกมเดิมเสิร์ฟเฉพาะชื่อที่ตัวเองระบุไว้เหมือนเดิม · ผลตรวจ L5) */
  if (u.toLowerCase().startsWith('/assets/incoming/')) return null;
  if (!ASSET_EXT.has(path.extname(u).toLowerCase())) return null;
  const f = path.join(ROOT, u);
  if (!f.startsWith(path.join(ROOT, 'assets') + path.sep)) return null;
  return { file: f, missing: null };
}

function serveHttp(req, res) {
  let u;
  try { u = decodeURIComponent((req.url || '/').split('?')[0]); } catch (e) { u = null; }
  if (u == null) { if (String(req.url || '').startsWith('/v6')) { res.writeHead(400); res.end(); return true; } return false; }
  const hit = resolveStatic(u);
  if (!hit) return false;
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return true; }
  if (hit.redirect) { res.writeHead(301, { location: hit.redirect }); res.end(); return true; }
  if (hit.code) { res.writeHead(hit.code, { 'content-type': 'text/plain; charset=utf-8' }); res.end(hit.code === 404 ? 'not found' : 'bad request'); return true; }
  let st;
  try { st = fs.statSync(hit.file); } catch (e) { st = null; }
  if (!st || !st.isFile()) {
    if (hit.missing === null) return false;
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('not found'); return true;
  }
  const etag = 'W/"' + st.size.toString(36) + '-' + Math.floor(st.mtimeMs).toString(36) + '"';
  const hd = { 'content-type': TYPES[path.extname(hit.file).toLowerCase()] || 'application/octet-stream', 'x-content-type-options': 'nosniff',
    'cache-control': hit.cache || (u.startsWith('/assets/') ? 'public, max-age=3600' : 'no-cache'), etag };
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, hd); res.end(); return true; }
  if (hit.file === INDEX_FILE) {
    /* ติดป้าย data-v6-server ให้เกมรู้ว่ามีเซิร์ฟเวอร์ v6 (ws /v6ws) · เปิดผ่าน dev-server ไม่มีป้าย → เกมไม่ต่อ ws (core/net) */
    let body;
    try { body = Buffer.from(markIndex(fs.readFileSync(hit.file, 'utf8'))); } catch (e) { res.writeHead(500); res.end(); return true; }
    hd['content-length'] = body.length;
    res.writeHead(200, hd);
    res.end(req.method === 'HEAD' ? undefined : body);
    return true;
  }
  hd['content-length'] = st.size;
  res.writeHead(200, hd);
  if (req.method === 'HEAD') { res.end(); return true; }
  fs.createReadStream(hit.file).on('error', () => res.destroy()).pipe(res);
  return true;
}

/* สร้างชุดเซิร์ฟเวอร์ v6 (เทสสร้างเองได้ด้วย store ในหน่วยความจำ)
   env ที่ใช้: V6_MAX_PLAYERS · MAX_PER_IP · ALLOWED_ORIGINS · V6_PROXY_HOPS · V6_LOG_XFF
   · V6_SAVE_CACHE_MB (ค่าเริ่ม 32 = งบแคชเซฟเป็นไบต์ · N1)
   · V6_STORE_PER_MIN (ค่าเริ่ม 120) · V6_STORE_PER_DAY (ค่าเริ่ม 4000) = งบคำสั่งที่เก็บของ v6 ทั้งหมด (กันโควตา Upstash เกมเดิม · H2) */
function createV6({ store, env = process.env, now = () => Date.now(), log = m => console.log(m), wsLib = null, authTimeoutMs } = {}) {
  if (!M) throw loadErr || new Error('v6 modules not loaded');
  const raw = store || M.fromEnv(env);
  store = M.budgetStore(raw, { perMin: +env.V6_STORE_PER_MIN || 120, perDay: +env.V6_STORE_PER_DAY || 4000, now, log });
  const accounts = M.createAccounts({ store, env, now });
  const saves = M.createSaves({ store, now, cacheBytes: (+env.V6_SAVE_CACHE_MB > 0 ? +env.V6_SAVE_CACHE_MB : 32) * 1048576 }); /* 1B-g N1 */
  const proto = M.createProto({ accounts, saves, now, log, authTimeoutMs });
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const MAX_CONN = +env.V6_MAX_PLAYERS || 1000, MAX_PER_IP = +env.MAX_PER_IP || 4;
  const ipCount = new Map();
  let wss = null, pingTimer = null, xffLogged = 0;
  /* ล้างรายการหมดอายุทุก 5 นาที (L1) */
  const sweep = () => { try { accounts.sweep(); saves.sweep(); proto.sweep(); } catch (e) { log('[v6] sweep: ' + e.message); } };
  const sweepTimer = setInterval(sweep, 5 * 60 * 1000);
  sweepTimer.unref && sweepTimer.unref();

  function reject(socket, code, why) {
    try { socket.write(`HTTP/1.1 ${code} ${why}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`); } catch (e) {}
    try { socket.destroy(); } catch (e) {}
  }

  function upgrade(req, socket, head) {
    if (!wss) {
      let WebSocketServer;
      try { ({ WebSocketServer } = wsLib || require('ws')); } catch (e) { log('[v6] ไม่มีโมดูล ws: ' + e.message); return reject(socket, 503, 'Unavailable'); } /* ไม่ให้เซิร์ฟเวอร์ทั้งตัวล้ม */
      wss = new WebSocketServer({ noServer: true, maxPayload: MAX_PAYLOAD, perMessageDeflate: false });
      pingTimer = setInterval(() => {
        for (const ws of wss.clients) { if (ws._v6dead) { ws.terminate(); continue; } ws._v6dead = true; try { ws.ping(); } catch (e) {} }
      }, 20000);
      pingTimer.unref && pingTimer.unref();
    }
    if (env.V6_LOG_XFF === '1' && xffLogged < 5) { xffLogged++; log('[v6] x-forwarded-for=' + JSON.stringify(req.headers['x-forwarded-for'] || '') + ' socket=' + (req.socket && req.socket.remoteAddress)); }
    const ip = M.ipKey(clientIp(req, env));
    if (!originOk(req.headers.origin || '', req.headers.host || '', allowed)) return reject(socket, 403, 'Forbidden');
    if (proto.conns.size >= MAX_CONN) return reject(socket, 503, 'Full');
    if ((ipCount.get(ip) || 0) >= MAX_PER_IP) return reject(socket, 429, 'Too Many');
    ipCount.set(ip, (ipCount.get(ip) || 0) + 1); /* นับตั้งแต่ก่อน handshake เสร็จ (กันยิง upgrade พร้อมกันหลายอันทะลุเพดาน) */
    let counted = true;
    const uncount = () => { if (!counted) return; counted = false; const n = (ipCount.get(ip) || 1) - 1; if (n > 0) ipCount.set(ip, n); else ipCount.delete(ip); };
    socket.once('close', uncount);
    wss.handleUpgrade(req, socket, head, ws => {
      const conn = { ip, send: o => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); }, close: (c, w) => { try { ws.close(c, w); } catch (e) { try { ws.terminate(); } catch (e2) {} } } };
      ws.on('pong', () => { ws._v6dead = false; });
      ws.on('message', raw => { try { proto.message(conn, raw); } catch (e) { log('[v6] message: ' + e.message); conn.close(1011, 'error'); } });
      ws.on('error', () => {});
      ws.on('close', () => { proto.closed(conn); uncount(); });
      proto.open(conn);
    });
  }

  /* ตัวรับ upgrade ของ v6 — error ใด ๆ ปิดแค่ซ็อกเก็ตนั้น ไม่ให้หลุดไปถึง server (กันโปรเซสล่ม) */
  function safeUpgrade(req, socket, head) {
    try { upgrade(req, socket, head); }
    catch (e) { log('[v6] upgrade error: ' + (e && e.message)); try { socket.destroy(); } catch (e2) {} }
  }

  /* ต่อเข้ากับ http.Server ที่มี WebSocketServer ของเกมเดิมอยู่แล้ว:
     ดึงตัวรับ upgrade เดิมออก แล้วส่ง /v6ws มาที่ v6 · path อื่นส่งให้ตัวรับเดิมเหมือนเดิมทุกอย่าง
     (เตรียมตัวรับใหม่ให้เสร็จก่อนค่อยสลับ → สลับไม่สำเร็จ ตัวรับเดิมยังอยู่ครบ) */
  function attach(server) {
    const old = server.listeners('upgrade');
    const route = (req, socket, head) => {
      let isV6 = false;
      try { isV6 = String(req.url || '').split('?')[0] === WS_PATH; } catch (e) {}
      if (isV6) return safeUpgrade(req, socket, head);
      for (const f of old) f.call(server, req, socket, head);
    };
    server.removeAllListeners('upgrade');
    try { server.on('upgrade', route); }
    catch (e) { server.removeAllListeners('upgrade'); for (const f of old) server.on('upgrade', f); throw e; }
    return api;
  }

  function stop() { clearInterval(sweepTimer); if (pingTimer) clearInterval(pingTimer); if (wss) for (const ws of wss.clients) ws.terminate(); }

  const api = { http: serveHttp, attach, upgrade: safeUpgrade, stop, sweep, accounts, saves, proto, store, rawStore: raw, ipCount };
  return api;
}

/* ตัวหลักที่ server.js ใช้ — สร้างครั้งแรกที่เรียก (อ่าน env ตอนนั้น) · ทุกทางเข้าห่อ try: v6 พัง = เกมเดิมทำงานต่อ */
let main = null;
const get = () => (main = main || createV6());
const safeLog = m => { try { console.error(m); } catch (e) {} };
module.exports = {
  createV6, resolveStatic, clientIp, originOk, markIndex, WS_PATH, MAX_PAYLOAD,
  loadError: () => loadErr,
  http: (req, res) => {
    try { return serveHttp(req, res); }
    catch (e) {
      safeLog('[v6] http error: ' + (e && e.message));
      if (res.headersSent) { try { res.destroy(); } catch (e2) {} return true; }
      return false; /* ให้เกมเดิมตอบต่อเหมือนไม่มี v6 */
    }
  },
  /* ปิดไว้ก่อนจนกว่าจะตั้ง env V6_ENABLE=1 (หัวหน้า 30 ต.ค. · ผลตรวจ 1B H1/H2: กันยิง /v6ws จนเกมเดิมล่ม/เผาโควตา Upstash)
     ปิด = ไม่แตะตัวรับ upgrade ของเกมเดิมเลย (เหมือนก่อนใส่ v6 ทุกอย่าง) · หน้า /v6/ ยังเปิดดูได้ แต่ต่อเซิร์ฟเวอร์ไม่ได้ */
  enabled: env => (env || process.env).V6_ENABLE === '1',
  attach: server => {
    try { return module.exports.enabled() && M ? get().attach(server) : null; }
    catch (e) { safeLog('[v6] attach ไม่สำเร็จ — ปิด /v6ws (เกมเดิมทำงานต่อ): ' + (e && e.message)); return null; }
  },
};
