/* v6 server — โมดูลที่เซิร์ฟเวอร์เกมเดิม (server.js) ต่อเข้ามา ไม่พึ่งโค้ดเกมเดิม
   ใช้ใน server.js:
     const V6 = require('./v6/server/index.cjs');
     ...ในตัวรับ HTTP ก่อนข้อความสุดท้าย:  if (V6.http(req, res)) return;
     ...หลังสร้าง WebSocketServer เดิม:      V6.attach(server);
   - HTTP: เสิร์ฟ /v6/ (index.html + src/**) และ /assets/ (ภาพ) · ไม่เสิร์ฟ server/ tests/ tools/ spec/ *.md
   - WebSocket: path /v6ws เท่านั้น (เกมเดิมใช้ path อื่นตามเดิม) */
const fs = require('fs'), path = require('path');
const { fromEnv } = require('./store.cjs');
const { createAccounts } = require('./accounts.cjs');
const { createSaves } = require('./saves.cjs');
const { createProto } = require('./proto.cjs');

const ROOT = path.resolve(__dirname, '..', '..'); /* รากโปรเจกต์ */
const V6_DIR = path.join(ROOT, 'v6');
const WS_PATH = '/v6ws';
const MAX_PAYLOAD = 320 * 1024; /* เซฟสูงสุด 256 KB + หัวข้อความ */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const ASSET_EXT = new Set(['.png', '.webp', '.jpg', '.jpeg', '.svg', '.mp3', '.ogg', '.json']);

/* IP ผู้เล่น: ตัวท้ายสุดของ x-forwarded-for (Render เติมเอง ปลอมไม่ได้ · spec05 §1.7) */
const clientIp = req => {
  const xf = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
  return xf.length ? xf[xf.length - 1] : String(req.socket && req.socket.remoteAddress || '');
};

function originOk(origin, host, allowed) {
  if (!origin || origin === 'null') return true;
  if (!allowed.length || allowed.includes(origin)) return true;
  try { return new URL(origin).host === host; } catch (e) { return false; }
}

/* หาไฟล์จริงจาก url · คืน null = ไม่ใช่ของ v6 (ให้เกมเดิมจัดการต่อ) · { code } = ตอบรหัสนั้น · { file } = เสิร์ฟไฟล์ */
function resolveStatic(u) {
  if (u === '/v6') return { redirect: '/v6/' };
  const isV6 = u.startsWith('/v6/'), isAsset = u.startsWith('/assets/');
  if (!isV6 && !isAsset) return null;
  if (u.includes('\0') || u.split('/').some(s => s === '..' || s === '.')) return isV6 ? { code: 400 } : null;
  if (isV6) {
    if (u === '/v6/' || u === '/v6/index.html') return { file: path.join(V6_DIR, 'index.html') };
    /* เสิร์ฟเฉพาะโค้ดเกมใน src/ (.js/.json) */
    const m = /^\/v6\/src\/([\w\-/.]+\.(?:js|json))$/.exec(u);
    if (!m) return { code: 404 };
    const f = path.join(V6_DIR, 'src', m[1]);
    if (!f.startsWith(path.join(V6_DIR, 'src') + path.sep)) return { code: 404 };
    return { file: f, missing: 404 };
  }
  /* /assets/ — เฉพาะไฟล์ภาพ/เสียงที่มีอยู่จริง · ไม่มี → ให้เกมเดิมตอบเหมือนเดิม */
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
    'cache-control': u.startsWith('/assets/') ? 'public, max-age=3600' : 'no-cache', etag };
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, hd); res.end(); return true; }
  hd['content-length'] = st.size;
  res.writeHead(200, hd);
  if (req.method === 'HEAD') { res.end(); return true; }
  fs.createReadStream(hit.file).on('error', () => res.destroy()).pipe(res);
  return true;
}

/* สร้างชุดเซิร์ฟเวอร์ v6 (เทสสร้างเองได้ด้วย store ในหน่วยความจำ) */
function createV6({ store, env = process.env, now = () => Date.now(), log = m => console.log(m) } = {}) {
  store = store || fromEnv(env);
  const accounts = createAccounts({ store, env, now });
  const saves = createSaves({ store, now });
  const proto = createProto({ accounts, saves, now, log });
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const MAX_CONN = +env.V6_MAX_PLAYERS || 1000, MAX_PER_IP = +env.MAX_PER_IP || 4;
  const ipCount = new Map();
  let wss = null, pingTimer = null;

  function reject(socket, code, why) {
    try { socket.write(`HTTP/1.1 ${code} ${why}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`); } catch (e) {}
    socket.destroy();
  }

  function upgrade(req, socket, head) {
    const { WebSocketServer } = require('ws');
    if (!wss) {
      wss = new WebSocketServer({ noServer: true, maxPayload: MAX_PAYLOAD, perMessageDeflate: false });
      pingTimer = setInterval(() => {
        for (const ws of wss.clients) { if (ws._v6dead) { ws.terminate(); continue; } ws._v6dead = true; try { ws.ping(); } catch (e) {} }
      }, 20000);
      pingTimer.unref && pingTimer.unref();
    }
    const ip = clientIp(req);
    if (!originOk(req.headers.origin || '', req.headers.host || '', allowed)) return reject(socket, 403, 'Forbidden');
    if (proto.conns.size >= MAX_CONN) return reject(socket, 503, 'Full');
    if ((ipCount.get(ip) || 0) >= MAX_PER_IP) return reject(socket, 429, 'Too Many');
    wss.handleUpgrade(req, socket, head, ws => {
      ipCount.set(ip, (ipCount.get(ip) || 0) + 1);
      const conn = { ip, send: o => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); }, close: (c, w) => { try { ws.close(c, w); } catch (e) {} } };
      ws.on('pong', () => { ws._v6dead = false; });
      ws.on('message', raw => proto.message(conn, raw));
      ws.on('error', () => {});
      ws.on('close', () => {
        proto.closed(conn);
        const n = (ipCount.get(ip) || 1) - 1; if (n > 0) ipCount.set(ip, n); else ipCount.delete(ip);
      });
      proto.open(conn);
    });
  }

  /* ต่อเข้ากับ http.Server ที่มี WebSocketServer ของเกมเดิมอยู่แล้ว:
     ดึงตัวรับ upgrade เดิมออก แล้วส่ง /v6ws มาที่ v6 · path อื่นส่งให้ตัวรับเดิมเหมือนเดิมทุกอย่าง */
  function attach(server) {
    const old = server.listeners('upgrade');
    server.removeAllListeners('upgrade');
    server.on('upgrade', (req, socket, head) => {
      if ((req.url || '').split('?')[0] === WS_PATH) return upgrade(req, socket, head);
      for (const f of old) f.call(server, req, socket, head);
    });
    return api;
  }

  function stop() { if (pingTimer) clearInterval(pingTimer); if (wss) for (const ws of wss.clients) ws.terminate(); }

  const api = { http: serveHttp, attach, upgrade, stop, accounts, saves, proto, store };
  return api;
}

/* ตัวหลักที่ server.js ใช้ — สร้างครั้งแรกที่เรียก (อ่าน env ตอนนั้น) */
let main = null;
const get = () => (main = main || createV6());
module.exports = {
  createV6, resolveStatic, clientIp, WS_PATH,
  http: (req, res) => serveHttp(req, res),
  attach: server => get().attach(server),
};
