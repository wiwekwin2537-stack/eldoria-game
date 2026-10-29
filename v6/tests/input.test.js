/* เทสการควบคุม (core/input + data/controls) — CONTRACT §5 · spec01 §5 */
import { keyMove, keyAction, isRunKey, joyVector, joyCenter, readPad } from '../src/core/input.js';
import input from '../src/core/input.js';
import { ACTION_KEYS, JOY, ACT_BUTTONS, PAD_BUTTONS } from '../src/data/controls.js';
import { createState } from '../src/core/state.js';

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b}`); };
const near = (a, b, m, e = 1e-6) => { if (Math.abs(a - b) > e) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b}`); };
const pad = (btn = [], axes = [0, 0, 0, 0]) => ({ buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: btn.includes(i), value: btn.includes(i) ? 1 : 0 })), axes });

/* action ที่ CONTRACT §5 กำหนด + ที่ขอเพิ่ม (run แยกเป็นธง) */
const CONTRACT_ACTIONS = ['attack', 'dash', 'interact', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'skill6', 'ult', 'menu', 'bag', 'map', 'recall'];

export default [
  ['WASD/ลูกศร → ทิศเดิน · กดสวนกัน = 0', () => {
    let m = keyMove(new Set(['KeyW', 'KeyD'])); eq(m.mx, 1, 'mx'); eq(m.my, -1, 'my');
    m = keyMove(new Set(['ArrowLeft', 'ArrowDown'])); eq(m.mx, -1, 'mx'); eq(m.my, 1, 'my');
    m = keyMove(new Set(['KeyA', 'KeyD'])); eq(m.mx, 0, 'สวน');
  }],
  ['ตารางคีย์ตามสเปก (K=หน้าสกิล · Shift=พุ่ง ตาม DECISIONS)', () => {
    const want = { KeyJ: 'attack', KeyF: 'attack', ShiftLeft: 'dash', ShiftRight: 'dash', KeyK: 'skills', KeyE: 'interact', Space: 'interact',
      Digit5: 'skill1', Digit8: 'skill4', Digit9: 'skill5', Digit0: 'skill6', KeyU: 'ult', KeyH: 'potionHp', KeyN: 'potionMp',
      KeyI: 'bag', Escape: 'menu', KeyP: 'menu', KeyT: 'recall', Tab: 'map', Digit4: 'quick4' };
    for (const [k, a] of Object.entries(want)) eq(keyAction(k), a, k);
    eq(keyAction('KeyZ'), null, 'ปุ่มที่ไม่ใช้');
  }],
  ['Ctrl = วิ่ง (ตั้งเป็น C ได้)', () => {
    eq(isRunKey('ControlLeft'), true, 'Ctrl'); eq(isRunKey('KeyC'), false, 'C ปกติ'); eq(isRunKey('KeyC', 'c'), true, 'C ตั้งค่า');
  }],
  ['ทุก action ใน CONTRACT §5 มีปุ่มคีย์บอร์ด', () => {
    const have = new Set(Object.values(ACTION_KEYS));
    for (const a of CONTRACT_ACTIONS) if (!have.has(a)) throw new Error('ไม่มีปุ่ม ' + a);
  }],
  ['จอยบนจอ: ในวง deadzone .14 = ไม่เดิน', () => {
    const R = JOY.size / 2, v = joyVector(R * .1, 0, R);
    eq(v.x, 0, 'x'); eq(v.y, 0, 'y'); eq(v.run, false, 'run');
  }],
  ['จอยบนจอ: สเกลเริ่มจาก 0 หลัง deadzone · ขอบ = 1 · เกิน .92 = วิ่ง', () => {
    const R = 70;
    let v = joyVector(R * .57, 0, R); near(v.x, (.57 - .14) / (1 - .14), 'ครึ่งทาง', 1e-9); eq(v.run, false, 'ยังไม่วิ่ง');
    v = joyVector(0, -R * 2, R); near(v.y, -1, 'ดันเลยขอบ'); eq(v.run, true, 'วิ่ง');
    v = joyVector(R * .93, 0, R); eq(v.run, true, 'เกิน .92');
  }],
  ['จอยแบบ float: จุดกลางไม่ล้นกรอบพื้นที่จอย', () => {
    const r = { left: 0, top: 100, right: 400, bottom: 400 };
    const c = joyCenter(5, 395, r, 70); eq(c.x, 70, 'x'); eq(c.y, 330, 'y');
  }],
  ['ปุ่มมือถือ: ⚔️ 68px · พุ่ง 44 · สกิล 48 · มีครบ 6 สกิล + ult · ตำแหน่ง ⚔️ ตรงที่วัด (835,332 ที่ 915×412)', () => {
    const by = Object.fromEntries(ACT_BUTTONS.map(b => [b.action, b]));
    eq(by.attack.size, 68, 'atk'); eq(by.dash.size, 44, 'dash'); eq(by.skill1.size, 48, 'sk1');
    for (const a of ['skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'skill6', 'ult']) if (!by[a]) throw new Error('ไม่มี ' + a);
    eq(915 - 6 - by.attack.r - by.attack.size, 835, 'atk x'); eq(412 - 6 - by.attack.b - by.attack.size, 332, 'atk y');
    eq(915 - 6 - by.skill2.r - 48, 807, 'sk2 x'); eq(412 - 6 - by.skill2.b - 48, 246, 'sk2 y');
  }],
  ['จอยเกม: ปุ่มกดครั้งเดียว = pressed ครั้งเดียว · ค้าง = held', () => {
    const st = {};
    let o = readPad(pad([2]), st, .016); eq(o.pressed.join(), 'interact', 'X');
    o = readPad(pad([2]), st, .016); eq(o.pressed.length, 0, 'ค้างไม่กดซ้ำ'); eq(o.held.includes('interact'), true, 'held');
    eq(PAD_BUTTONS[4] + PAD_BUTTONS[5] + PAD_BUTTONS[6] + PAD_BUTTONS[7], 'skill1skill2skill3skill4', 'L1 R1 L2 R2');
    eq(PAD_BUTTONS[9] + PAD_BUTTONS[8] + PAD_BUTTONS[3], 'menubagult', 'START SELECT Y');
  }],
  ['จอยเกม: A ค้าง = ตีซ้ำทุก 0.26 วิ', () => {
    const st = {}; let n = 0;
    for (let i = 0; i < 60; i++) n += readPad(pad([0]), st, .01).pressed.filter(a => a === 'attack').length; /* 0.6 วิ */
    eq(n, 3, 'ตี 3 ครั้งใน 0.6 วิ (0 · .26 · .52)');
  }],
  ['จอยเกม: B = พุ่ง · มีหน้าต่างเปิด = back', () => {
    eq(readPad(pad([1]), {}, .016).pressed.join(), 'dash', 'ปกติ');
    eq(readPad(pad([1]), {}, .016, true).pressed.join(), 'back', 'มีหน้าต่าง');
  }],
  ['จอยเกม: อนาล็อกซ้าย dz .35 · D-pad · ดัน >.93 วิ่ง (<.85 เลิก)', () => {
    const st = {};
    let o = readPad(pad([], [.3, 0, 0, 0]), st, .016); eq(o.moving, false, 'ใน dz');
    o = readPad(pad([], [.5, -.5, 0, 0]), st, .016); eq(o.mx, 1, 'mx'); eq(o.my, -1, 'my'); eq(o.run, false, 'ยังไม่วิ่ง');
    o = readPad(pad([], [.95, 0, 0, 0]), st, .016); eq(o.run, true, 'วิ่ง');
    o = readPad(pad([], [.9, 0, 0, 0]), st, .016); eq(o.run, true, 'ยังวิ่ง (.9 > .85)');
    o = readPad(pad([], [.5, 0, 0, 0]), st, .016); eq(o.run, false, 'เลิกวิ่ง');
    o = readPad(pad([14]), st, .016); eq(o.mx, -1, 'D-pad ซ้าย');
  }],
  ['จอยเกม: อนาล็อกขวา ↑สกิล5 →สกิล6 ↓ยาเลือด ←ยามานา (ดันครั้งเดียว = 1 ครั้ง)', () => {
    const st = {};
    eq(readPad(pad([], [0, 0, 0, -.9]), st, .016).pressed.join(), 'skill5', '↑');
    eq(readPad(pad([], [0, 0, 0, -.9]), st, .016).pressed.length, 0, 'ค้างไม่ซ้ำ');
    eq(readPad(pad([], [0, 0, .9, 0]), st, .016).pressed.join(), 'skill6', '→');
    eq(readPad(pad([], [0, 0, 0, .9]), st, .016).pressed.join(), 'potionHp', '↓');
    eq(readPad(pad([], [0, 0, -.9, 0]), st, .016).pressed.join(), 'potionMp', '←');
  }],
  ['ระบบ input ใน node: ไม่มีปุ่ม → G.input ว่าง · pressed เป็น Set ใหม่ทุกเฟรม', () => {
    const G = createState();
    input.init(G);
    const before = G.input.pressed;
    input.update(G, .016);
    eq(G.input.mx, 0, 'mx'); eq(G.input.pressed.size, 0, 'pressed'); eq(G.input.click, null, 'click'); eq(G.input.run, false, 'run');
    eq(G.input.pressed !== before, true, 'Set ใหม่');
  }],
];
