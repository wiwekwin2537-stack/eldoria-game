/* view — ค่าเครื่องยนต์ของจอ/กล้อง/คุณภาพภาพ/เวลาแตะ (CONTRACT §3 · หัวหน้าอนุมัติ 30 ต.ค.) · ข้อมูลล้วน ไม่มี logic
   core/camera · core/render · core/input อ่านจากไฟล์นี้ */

/* กล้อง (spec01 §3 · fix81 fitView + 024:15 cam) */
export const VIEW = {
  ratioMin: 1.2, ratioMax: 2.4, /* VW = clamp(VH×w/h, VH×1.2, VH×2.4) */
  portraitW: 360,               /* จอแนวตั้ง: ล็อกความกว้างแทน */
  follow: 9,                    /* กล้องลื่น a = 1-exp(-9·dt) */
  oy: .55,                      /* ตัวละครอยู่ที่ 55% ความสูงจอ (เมือง/ร้าน/zone) · world ใส่ G.scene.camOy ได้ (ทุ่ง .58 ดัน .5) */
};

/* คุณภาพภาพ (spec01 §3 · GQ 031:2680 + ค่าทับ 031:3850) · ใช้ GQ อย่างเดียว ไม่ใช้ SET.res (บัคเดิม)
   res = ความละเอียด canvas ต่อ 1 px โลก · fx = เพดานอนุภาค · dust = สัดส่วนฝุ่น · mm = มินิแมพวาดทุก n เฟรม
   grass = วาดหญ้า · grade = วาด grade() (vignette/แสงอุ่น/ลำแสง) — ระบบวาดรุ่นหลังอ่านจาก quality() */
export const GQ = {
  low:   { res: .6,  fx: 30,  dust: .25, mm: 10, grass: false, grade: false }, /* 031:3850 ทับ res .75→.6 fx 40→30 mm 8→10 */
  med:   { res: .85, fx: 110, dust: .6,  mm: 4,  grass: true,  grade: false }, /* 031:3850 ทับ res 1→.85 */
  high:  { res: 1.5, fx: 240, dust: 1,   mm: 3,  grass: true,  grade: true },
  ultra: { res: 2.2, fx: 500, dust: 1,   mm: 2,  grass: true,  grade: true },
};
export const GQ_ORDER = ['low', 'med', 'high', 'ultra'];

/* ลดคุณภาพอัตโนมัติ (gqMon 031:2697) — วัด FPS จริงด้วย rAF ของตัวเอง แยกจากลูปเกม
   ทุก 3 วิ · FPS ต่ำกว่าเกณฑ์ 2 รอบติด → ลด 1 ขั้น · ข้ามเฟรมตอนหยุดเกม/แท็บซ่อน/ห่างเกิน 250ms (เหมือนเดิม)
   เกณฑ์ = min(42, ความเร็วจอ × .7) — ความเร็วจอ = เฟรมที่เร็วสุด 10% ของรอบ:
   จอ 60Hz → 42 เท่าเดิม · เครื่องที่จำกัด 30 FPS (มือถือค่าเริ่ม fpsCap 30 / iPhone ประหยัดแบต) → 21 ไม่ถูกลดเพราะ "30 = เป้า" (spec01 §1) */
export const GQ_AUTO = {
  every: 3000,     /* ms */
  fpsLow: 42,      /* เกณฑ์เดิม (จอ 60Hz) */
  capRatio: .7,    /* เกณฑ์ไม่เกิน ความเร็วจอ × .7 */
  fastPct: .1,     /* ความเร็วจอ = เฟรมที่เร็วสุด 10% */
  gapMs: 250,      /* เฟรมห่างเกินนี้ = สะดุด/สลับแท็บ ไม่นับ */
  rounds: 2,
};

/* แตะซ้ำเร็วกว่านี้นอกปุ่ม = กันเบราว์เซอร์ซูม (113-fix81:57) */
export const DOUBLE_TAP_MS = 300;
