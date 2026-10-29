/* เซิร์ฟเวอร์ไฟล์สำหรับทดสอบในเครื่อง: node v6/tools/dev-server.cjs [พอร์ต] → http://127.0.0.1:<พอร์ต>/v6/
   เสิร์ฟทั้งโปรเจกต์ (ให้ /assets/ ของเกมเดิมใช้ได้) · ไม่ใช่เซิร์ฟเวอร์จริง */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const PORT = +process.argv[2] || 8820;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.css': 'text/css' };

http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || '/').split('?')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(ROOT, u);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(buf);
  });
}).listen(PORT, '127.0.0.1', () => console.log('v6 dev server http://127.0.0.1:' + PORT + '/v6/'));
