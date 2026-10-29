/* controls — ปุ่มจริงของทุกอุปกรณ์ → action (CONTRACT §5) · ข้อมูลล้วน ไม่มี logic
   ระบบเกมอ่านแค่ action จาก G.input ไม่อ่านคีย์ตรงๆ · ตารางคีย์ตาม spec01 §5 */

/* คีย์บอร์ด: ใช้ e.code (ตำแหน่งปุ่ม) ไม่ใช่ e.key — แป้นภาษาไทยก็กดได้เหมือนกัน
   (เกมเดิมใช้ e.key → เปิดแป้นไทยแล้ว WASD ไม่ทำงาน) */
export const MOVE_KEYS = {
  KeyW: 'up', ArrowUp: 'up',
  KeyS: 'down', ArrowDown: 'down',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
}; /* spec01 §5 WASD/ลูกศร */

/* ปุ่มวิ่ง (กดค้าง) · ตั้งค่า runKey 'c' ในเกมเดิม = KeyC (ระบบตั้งค่ายังไม่มี) */
export const RUN_KEYS = { ctrl: ['ControlLeft', 'ControlRight'], c: ['KeyC'] }; /* spec01 §5 */
export const RUN_KEY_DEFAULT = 'ctrl';

export const ACTION_KEYS = {
  KeyJ: 'attack', KeyF: 'attack',          /* spec01 §5 */
  ShiftLeft: 'dash', ShiftRight: 'dash',   /* DECISIONS: K=หน้าสกิล พุ่ง=Shift (spec01 §5 บัค) */
  KeyE: 'interact', Space: 'interact',     /* spec01 §5 (เดิม Space = act: ตีก่อนแล้วค่อยคุย — ระบบคุยตัดสินเอง) */
  Digit5: 'skill1', Digit6: 'skill2', Digit7: 'skill3', Digit8: 'skill4',
  Digit9: 'skill5', Digit0: 'skill6',      /* spec01 §5 */
  KeyU: 'ult',
  KeyH: 'potionHp', KeyN: 'potionMp',
  Digit1: 'quick1', Digit2: 'quick2', Digit3: 'quick3', Digit4: 'quick4', /* ช่องลัด (4 ไม่ใช่ม้วนวาป · spec01 §5 ✏️) */
  KeyK: 'skills',                          /* หน้าสกิล (DECISIONS) */
  KeyI: 'bag',
  Escape: 'menu', KeyP: 'menu',
  KeyT: 'recall',                          /* ม้วนวาป */
  Tab: 'map',                              /* แผนที่ใหญ่ */
  KeyB: 'eat', KeyR: 'mount', KeyO: 'auto', KeyV: 'status',
  KeyM: 'mute', KeyQ: 'sheath', Enter: 'chat',
};

/* จอยบนจอ (มือถือแนวนอน) · spec01 §5 */
export const JOY = {
  mode: 'float',      /* float = เกิดตรงที่แตะ · fixed = อยู่มุมซ้ายล่าง */
  size: 140,          /* px เส้นผ่านศูนย์กลาง (ตั้งได้ 80–170) */
  sizeMin: 80, sizeMax: 170,
  opacity: .75,
  deadzone: .14,
  runAt: .92,         /* ดันเกินนี้ = วิ่ง */
  zoneW: .42, zoneH: .66, /* พื้นที่จอย ซ้ายล่าง (สัดส่วนจอ) */
  knob: .44,          /* ขนาดปุ่มกลาง เทียบ size */
  fixedMargin: 14,    /* แบบ fixed ห่างขอบ */
  fixedGrab: 1.7,     /* แบบ fixed แตะไกลจากกลางเกิน R×นี้ = ไม่จับ */
  hint: 'ลากเพื่อเดิน',
  hintSize: 120, hintMargin: 26,
};

/* ปุ่มขวาล่าง (มือถือ) · ผังหน้าเดียว 6 สกิล (fix41 v5.14) · วัดที่ 915×412 (spec01 §5)
   r/b = ห่างขอบขวา/ล่างของกล่อง · กล่อง 220×236 ห่างขอบจอ 6px */
export const ACT_BOX = { w: 220, h: 236, margin: 6 };
export const ACT_BUTTONS = [
  { id: 'atk',   action: 'attack', size: 68, r: 6,   b: 6,   icon: '⚔️' },
  { id: 'dashb', action: 'dash',   size: 44, r: 83,  b: 6,   icon: '💨' },
  { id: 'sk1',   action: 'skill1', size: 48, r: 80,  b: 61,  icon: '1' },
  { id: 'sk2',   action: 'skill2', size: 48, r: 54,  b: 112, icon: '2' },
  { id: 'sk3',   action: 'skill3', size: 48, r: 2,   b: 78,  icon: '3' },
  { id: 'sk4',   action: 'skill4', size: 48, r: 166, b: 60,  icon: '4' },
  { id: 'sk5',   action: 'skill5', size: 48, r: 137, b: 111, icon: '5' },
  { id: 'sk6',   action: 'skill6', size: 48, r: 103, b: 163, icon: '6' },
  { id: 'ultb',  action: 'ult',    size: 44, r: 2,   b: 164, icon: '🌟' },
];

/* จอยเกม (Gamepad API ปุ่มมาตรฐาน) · spec01 §5 (141-fix109) */
export const PAD = {
  deadzone: .35,
  runAt: .93, runOff: .85,   /* ดันเกิน .93 = วิ่ง · ต่ำกว่า .85 = เลิกวิ่ง */
  attackRepeat: .26,         /* A ค้าง = ตีทุก 0.26 วิ */
  rightStick: .6,            /* อนาล็อกขวาเกินนี้ = กด */
};
/* เลขปุ่ม → action (B: มีหน้าต่างเปิด = back ไม่งั้นพุ่ง — จัดการใน core/input) */
export const PAD_BUTTONS = {
  0: 'attack',    /* A */
  1: 'dash',      /* B */
  2: 'interact',  /* X */
  3: 'ult',       /* Y */
  4: 'skill1', 5: 'skill2', 6: 'skill3', 7: 'skill4', /* L1 R1 L2 R2 */
  8: 'bag',       /* SELECT */
  9: 'menu',      /* START */
  11: 'mount',    /* R3 */
};
export const PAD_DPAD = { 12: 'up', 13: 'down', 14: 'left', 15: 'right' };
export const PAD_RIGHT_STICK = { up: 'skill5', right: 'skill6', down: 'potionHp', left: 'potionMp' };
