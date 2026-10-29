/* รายชื่อระบบทั้งหมดตามลำดับทำงาน — ไฟล์เดียวที่เพิ่มระบบ (CONTRACT §1)
   ลำดับสำคัญ (update ทุกระบบก่อน แล้วค่อย draw ทุกระบบ ตามลำดับนี้):
   - input แรกสุด: ย้ายปุ่มที่กดเข้า G.input ก่อนทุกระบบอ่าน
   - render ที่ 2: draw ของมันต้องมาก่อนระบบที่วาดทุกตัว (ล้างจอ + ตั้งพิกัดวาดแต่ละชั้น)
   - login ที่ 3: ต่อเซิร์ฟเวอร์ + หน้าล็อกอิน (HTML ใน #ui ไม่วาด canvas) + เริ่มระบบเซฟ — load() ของทุกระบบถูกเรียกหลังล็อกอิน
   - camera ท้ายสุด: ตามตำแหน่งตัวละครหลังระบบที่ขยับตัวละครทำงานแล้ว */
import input from '../core/input.js';
import render from '../core/render.js';
import login from './login.js';
import camera from '../core/camera.js';

export default [
  input,
  render,
  login,
  /* ← ระบบเกม (world/movement ...) ใส่ตรงนี้ */
  camera,
];
