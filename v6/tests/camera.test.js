/* เทสจอ/กล้อง (core/camera + ส่วนคำนวณของ core/render) — spec01 §3 */
import { viewSize, camTarget, stepCam, snap, screenToWorld, worldToScreen, VIEW } from '../src/core/camera.js';
import camera from '../src/core/camera.js';
import { guessQuality, fitBox, GQ, createFpsMon, fpsTick } from '../src/core/render.js';
import * as VIEWDATA from '../src/data/view.js';
import { createState } from '../src/core/state.js';

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b}`); };
const near = (a, b, m, e = 1e-6) => { if (Math.abs(a - b) > e) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b}`); };

export default [
  ['จอแนวนอนล็อกสูง 448 · มือถือ 915×412 → 995×448 (วัดจากเกมเดิม)', () => {
    const v = viewSize(915, 412); eq(v.VH, 448, 'VH'); eq(v.VW, 995, 'VW');
  }],
  ['คอม 1366×768 → VW 797', () => { eq(viewSize(1366, 768).VW, 797, 'VW'); }],
  ['จอกว้างมาก/แคบมาก ถูกจำกัด 1.2–2.4 เท่า', () => {
    eq(viewSize(4000, 400).VW, Math.round(448 * 2.4), 'กว้างสุด');
    eq(viewSize(500, 448).VW, Math.round(448 * 1.2), 'แคบสุด');
  }],
  ['จอแนวตั้ง ล็อกกว้าง 360', () => {
    const v = viewSize(412, 915); eq(v.VW, 360, 'VW'); eq(v.VH, Math.round(Math.min(360 * 2.4, 360 * 915 / 412)), 'VH');
  }],
  ['แมพเล็กกว่าจอ → กล้องอยู่กึ่งกลาง (ค่าติดลบได้)', () => {
    const t = camTarget(400, 300, 50, 50, 800, 448);
    eq(t.x, -200, 'x'); eq(t.y, -74, 'y');
  }],
  ['แมพใหญ่ → ตามตัว และไม่เลยขอบ', () => {
    const vw = 800, vh = 448, mw = 3000, mh = 2000;
    let t = camTarget(mw, mh, 1500, 1000, vw, vh, .55);
    eq(t.x, 1100, 'x กลาง'); near(t.y, 1000 - 448 * .55, 'y ตาม oy');
    t = camTarget(mw, mh, 10, 10, vw, vh); eq(t.x, 0, 'ขอบซ้าย'); eq(t.y, 0, 'ขอบบน');
    t = camTarget(mw, mh, 2990, 1990, vw, vh); eq(t.x, mw - vw, 'ขอบขวา'); eq(t.y, mh - vh, 'ขอบล่าง');
  }],
  ['ไม่มีแมพ (scene=null) → ตามตัวอย่างเดียว', () => {
    const t = camTarget(undefined, undefined, 100, 100, 800, 448, .5);
    eq(t.x, -300, 'x'); eq(t.y, -124, 'y');
  }],
  ['กล้องลื่น a=1-exp(-9dt) · เปลี่ยนแมพ = กระโดดทันที', () => {
    const c = {};
    stepCam(c, 0, 0, .016, 'A');
    stepCam(c, 100, 0, .1, 'A');
    near(c._fx, 100 * (1 - Math.exp(-VIEW.follow * .1)), 'ลื่น');
    stepCam(c, 500, 70, .1, 'B'); eq(c._fx, 500, 'กระโดด x'); eq(c._fy, 70, 'กระโดด y');
  }],
  ['ปัดพิกเซลตาม RES', () => { eq(snap(10.3, 1), 10, 'res1'); eq(snap(10.3, 2), 10.5, 'res2'); }],
  ['แปลงพิกัดจอ↔โลก ไปกลับตรงกัน', () => {
    const cam = { x: 120, y: 40, vw: 995, vh: 448 }, rect = { left: 0, top: 10, width: 1990, height: 896 };
    const w = screenToWorld(cam, 1000, 458, rect);
    eq(w.wx, 620, 'wx'); eq(w.wy, 264, 'wy');
    const s = worldToScreen(cam, w.wx, w.wy, rect); eq(s.x, 1000, 'x'); eq(s.y, 458, 'y');
  }],
  ['ระบบกล้อง: ตามผู้เล่นใน G · ซูม 1 เสมอ · คลิปขอบแมพ', () => {
    const G = createState();
    camera.init(G); G.cam.vw = 800; G.cam.vh = 448; G.cam.res = 1; G.cam.zoom = 2;
    G.scene = { id: 'town', w: 2000, h: 1000 };
    G.player.x = 1000; G.player.y = 500;
    camera.update(G, .016);
    eq(G.cam.x, 600, 'x'); eq(G.cam.y, Math.round(500 - 448 * .55), 'y'); eq(G.cam.zoom, 1, 'zoom');
    G.player.x = 1990; for (let i = 0; i < 200; i++) camera.update(G, .05);
    eq(G.cam.x, 1200, 'ชิดขอบขวา');
  }],
  ['คุณภาพภาพ: เดาจากเครื่อง (gqGuess) + ค่า res ตามสเปก', () => {
    eq(guessQuality(true, 4, 8), 'low', 'มือถือ 4 คอร์'); eq(guessQuality(true, 8, 8), 'high', 'มือถือแรง');
    eq(guessQuality(true, 6, 4), 'med', 'มือถือกลาง'); eq(guessQuality(false, 2), 'med', 'คอม 2 คอร์'); eq(guessQuality(false, 8), 'high', 'คอม');
    eq(GQ.low.res, .6, 'low'); eq(GQ.med.res, .85, 'med'); eq(GQ.high.res, 1.5, 'high'); eq(GQ.ultra.res, 2.2, 'ultra');
  }],
  ['canvas พอดีหน้าต่างไม่ยืดภาพ (กว้างเกิน 2.4 = ขอบดำ)', () => {
    const b = fitBox(3000, 400, 1075, 448);
    eq(b.ch, 400, 'สูงเต็ม'); eq(b.cw, Math.round(1075 * 400 / 448), 'กว้างตามสัดส่วน'); eq(b.left, Math.floor((3000 - b.cw) / 2), 'กึ่งกลาง');
  }],
  /* ---- 1A-1f (แก้ตามผลตรวจ) ---- */
  ['ค่าจอ/คุณภาพ/เวลาแตะ อยู่ data/view.js (CONTRACT §3) และ core ใช้ชุดเดียวกัน', () => {
    eq(VIEWDATA.VIEW, VIEW, 'VIEW'); eq(VIEWDATA.GQ, GQ, 'GQ'); eq(VIEWDATA.DOUBLE_TAP_MS, 300, 'แตะซ้ำ 300ms');
  }],
  ['GQ ตรงเกมเดิม: mm high 3 / ultra 2 · low ปิดหญ้า · low/med ปิด grade (031:2680)', () => {
    eq(GQ.high.mm, 3, 'high mm'); eq(GQ.ultra.mm, 2, 'ultra mm'); eq(GQ.low.mm, 10, 'low mm'); eq(GQ.med.mm, 4, 'med mm');
    eq(GQ.low.grass, false, 'low หญ้า'); eq(GQ.med.grass, true, 'med หญ้า');
    eq(GQ.low.grade, false, 'low grade'); eq(GQ.med.grade, false, 'med grade'); eq(GQ.high.grade, true, 'high grade'); eq(GQ.ultra.grade, true, 'ultra grade');
  }],
  ['ลดคุณภาพอัตโนมัติ: เครื่องจำกัด 30 FPS เดินนิ่ง 30 → ไม่ลด (20 วิ)', () => {
    for (const target of [60, 30]) {
      const m = createFpsMon(); let down = 0;
      for (let i = 0; i < 600; i++) down += fpsTick(m, 1000 / 30 + (i % 3 - 1) * .4, false, target) ? 1 : 0;
      eq(down, 0, 'เป้า ' + target);
    }
  }],
  ['ลดคุณภาพอัตโนมัติ: จอ 60Hz แต่กระตุกเฉลี่ย ~30 FPS → ลด 1 ขั้นภายใน ~6 วิ (เหมือนเกมเดิม)', () => {
    const m = createFpsMon(); let t = 0, at = 0;
    for (let i = 0; i < 2000 && !at; i++) { const dt = i % 2 ? 1000 / 60 : 50; t += dt; if (fpsTick(m, dt, false, 60)) at = t; }
    if (!(at > 5000 && at < 7000)) throw new Error('ลดที่ ' + at + ' ms');
  }],
  ['ลดคุณภาพอัตโนมัติ: เครื่องจำกัด 30 ที่ช้าจริง (~15 FPS กระตุก) → ยังลดได้', () => {
    const m = createFpsMon(); let down = 0;
    for (let i = 0; i < 600; i++) down += fpsTick(m, i % 2 ? 1000 / 30 : 100, false, 30) ? 1 : 0;
    if (!down) throw new Error('ไม่ลด');
  }],
  ['ลดคุณภาพอัตโนมัติ: ช่วงหยุดเกม/แท็บซ่อน (skip) และเฟรมห่าง >250ms ไม่นับ', () => {
    const m = createFpsMon(); let down = 0;
    for (let i = 0; i < 600; i++) down += fpsTick(m, 100, true, 60) ? 1 : 0;      /* หยุดเกม: 10 FPS แต่ข้าม */
    for (let i = 0; i < 100; i++) down += fpsTick(m, 400, false, 60) ? 1 : 0;     /* สลับแท็บ/สะดุด */
    for (let i = 0; i < 600; i++) down += fpsTick(m, 1000 / 60, false, 60) ? 1 : 0; /* กลับมาลื่น */
    eq(down, 0, 'ไม่ลด'); eq(m.iv.length < 200, true, 'ไม่เก็บเฟรมที่ข้าม');
  }],
];
