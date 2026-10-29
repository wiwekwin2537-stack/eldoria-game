# จุดต่อใน server.js (ยังไม่ได้ใส่ — ต้องผ่าน `bash tests/quick.sh` ก่อน push)

ใส่ 3 บรรทัดนี้ใน `server.js` ของเกมเดิม:

1. ใต้บรรทัด `const MARKET = require('./market');`
   ```js
   const V6 = require('./v6/server/index.cjs'); /* v6: เกมใหม่ /v6/ + ws /v6ws (แยกจากเกมเดิม) */
   ```
2. ในตัวรับ HTTP ก่อนบรรทัดสุดท้าย `res.writeHead(200, { 'content-type': 'text/plain; ...` (ข้อความ "Eldoria online server OK"):
   ```js
   if (V6.http(req, res)) return; /* v6: /v6/ และภาพ /assets/ ที่เกมเดิมไม่ได้เสิร์ฟ */
   ```
   (วางท้ายสุด = เส้นทางเดิมของเกมเดิมทำงานเหมือนเดิมทุกอย่าง v6 รับแค่ url ที่เดิมตอบข้อความ fallback)
3. หลังสร้าง `const wss = new WebSocketServer({ server, ...})` (จบบล็อก verifyClient):
   ```js
   V6.attach(server); /* v6: ws path /v6ws ไปโมดูลใหม่ · path อื่นไปตัวเดิม */
   ```
   เหตุผล: ws ตัวเดิมผูก `{server}` รับทุก path และตอบ 400 กับ path ที่ไม่ใช่ของมัน → `attach` ย้ายตัวรับ upgrade เดิมไปอยู่หลังตัวคัดแยก

ตรวจหลังใส่: `node --check server.js` · `bash tests/quick.sh` ✅ · เปิด `PORT=8830 DATA_DIR=$(mktemp -d) node server.js` → `http://127.0.0.1:8830/v6/`
