import { on, emit, _reset } from '../src/core/bus.js';
import { createState } from '../src/core/state.js';
import { stepFrame, MAX_DT } from '../src/core/loop.js';
import systems from '../src/systems/index.js';

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b}`); };

export default [
  ['bus ส่งอีเวนต์ถึงผู้ฟัง และยกเลิกได้', () => {
    _reset();
    let n = 0;
    const off = on('x', d => { n += d; });
    emit('x', 2); off(); emit('x', 5);
    eq(n, 2, 'ผลรวม');
  }],
  ['bus ผู้ฟังพังไม่ทำให้ตัวอื่นพัง', () => {
    _reset();
    let ok = false;
    const err = console.error; console.error = () => {};
    on('y', () => { throw new Error('boom'); });
    on('y', () => { ok = true; });
    emit('y');
    console.error = err;
    eq(ok, true, 'ผู้ฟังตัวที่ 2 ทำงาน');
  }],
  ['ลูปจำกัด dt ไม่เกิน 0.05 วิ', () => {
    const G = createState();
    stepFrame(G, [], 3);
    eq(G.time.dt, MAX_DT, 'dt');
    eq(G.time.frame, 1, 'frame');
  }],
  ['ลูปเรียก update ตามลำดับรายชื่อระบบ', () => {
    const G = createState(); const order = [];
    stepFrame(G, [{ id: 'a', update: () => order.push('a') }, { id: 'b', update: () => order.push('b') }], .01);
    eq(order.join(), 'a,b', 'ลำดับ');
  }],
  ['ทุกระบบมี id ไม่ซ้ำ', () => {
    const ids = systems.map(s => s.id);
    eq(new Set(ids).size, ids.length, 'id ซ้ำ');
    for (const id of ids) if (!id) throw new Error('ระบบไม่มี id');
  }],
  ['เงินผู้เล่นเริ่ม 0 (เซิร์ฟเวอร์เป็นคนให้)', () => {
    eq(createState().player.coin, 0, 'coin');
  }],
  ['หยุดเกม: ระบบปกติไม่ update เวลาไม่เดิน แต่ระบบ always ยังทำงาน', () => {
    const G = createState(); const order = [];
    G.paused = true;
    stepFrame(G, [{ id: 'a', update: () => order.push('a') }, { id: 'b', always: true, update: () => order.push('b') }], .02);
    eq(order.join(), 'b', 'ระบบที่ทำงาน'); eq(G.time.now, 0, 'เวลา');
    G.paused = false; G.cam.portrait = true; order.length = 0;
    stepFrame(G, [{ id: 'a', update: () => order.push('a') }], .02);
    eq(order.length, 0, 'จอแนวตั้งก็หยุด');
  }],
];
