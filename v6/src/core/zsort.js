/* zsort — คิวกลางวาดเรียงตามแกน y (หัวหน้า 30 ต.ค. · คำขอ 1A-2)
   ระหว่างชั้น 'world' ทุกระบบ (ต้นไม้ อาคาร ตัวละคร NPC มอน) ส่งของเข้าคิวด้วย zpush(y, fn)
   loop เรียก zflush หลังทุกระบบวาดชั้นนั้นเสร็จ → วาดจาก y น้อย (หลัง) ไป y มาก (หน้า) · y เท่ากันวาดตามลำดับที่ส่ง
   fn(ctx) ต้องวาดเสร็จในตัว (save/restore เอง) · ห้ามเก็บคิวข้ามเฟรม */
const Q = [];
let seq = 0;

export function zpush(y, fn) { Q.push([+y || 0, seq++, fn]); }

export function zflush(ctx) {
  if (!Q.length) return;
  Q.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  for (const [, , fn] of Q) {
    try { fn(ctx); } catch (e) { console.error('[zsort]', e); }
  }
  Q.length = 0; seq = 0;
}

/* ใช้ในเทสเท่านั้น */
export function _size() { return Q.length; }
