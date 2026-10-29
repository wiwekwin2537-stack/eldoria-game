/* รายชื่อระบบทั้งหมดตามลำดับทำงาน — ไฟล์เดียวที่เพิ่มระบบ (CONTRACT §1)
   ลำดับสำคัญ (update ทุกระบบก่อน แล้วค่อย draw ทุกระบบ ตามลำดับนี้):
   - input แรกสุด: ย้ายปุ่มที่กดเข้า G.input ก่อนทุกระบบอ่าน
   - render ที่ 2: draw ของมันต้องมาก่อนระบบที่วาดทุกตัว (ล้างจอ + ตั้งพิกัดวาดแต่ละชั้น)
   - camera ท้ายสุด: ตามตำแหน่งตัวละครหลังระบบที่ขยับตัวละครทำงานแล้ว */
import input from '../core/input.js';
import render from '../core/render.js';
import camera from '../core/camera.js';

export default [
  input,
  render,
  /* ← ระบบเกม (world/movement ...) ใส่ตรงนี้ */
  camera,
];
