# จุดต่อใน server.js (✅ ใส่แล้ว 30 ต.ค. โดยช่าง 1B · quick.sh ✅ REG136 115/115 · เทส `v6/tests/browser/login.spec.js` ตรวจว่าเกมเดิมไม่เปลี่ยน)

3 บรรทัดนี้อยู่ใน `server.js` ของเกมเดิม (ถอด v6 ออก = ลบ 3 บรรทัดนี้ เกมเดิมกลับเป็นเหมือนก่อน):

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
