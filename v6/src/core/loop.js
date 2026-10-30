import { zflush } from './zsort.js';
/* loop — ลูปเกม: update ทุกระบบตามลำดับ แล้ววาดทีละชั้น (dt ≤ 0.05 ตามเกมเดิม · spec01 §1) */
export const LAYERS = ['ground', 'world', 'top', 'ui'];
export const MAX_DT = 0.05;
/* เพดาน 30 FPS แบบเส้นเวลาเป้า (หัวหน้าตัดสิน 1Z · ผลตรวจ 1A-1g L1):
   วาดเมื่อ now ≥ เป้า − CAP_SLACK_MS · เป้าถัดไป = max(เป้า + 1000/30, now)
   → จอ 50/60/75/90/100/120/144 Hz ได้ ~30 FPS (เดิม "ข้ามถ้าห่าง <30 ms" แบบเกมเดิม 031:3848 ได้ 25 ที่ 75/50 Hz และ 28–33 สลับที่ 100 Hz)
   SLACK 4 ms = เผื่อเวลา rAF แกว่ง (ต้องน้อยกว่าครึ่งช่วงเฟรมของจอ 120 Hz = 4.2 ms ไม่งั้นวาดถี่เกิน) */
export const CAP30_FRAME_MS = 1000 / 30;
export const CAP_SLACK_MS = 4;
/* ตัวตัดสินเพดาน 30 (ฟังก์ชันล้วน · เทสด้วยเวลา rAF จำลองได้) → gate(now) = true วาดเฟรมนี้ */
export function cap30Gate() {
  let target = null;
  return now => {
    if (target !== null && now < target - CAP_SLACK_MS) return false;
    target = target === null ? now + CAP30_FRAME_MS : Math.max(target + CAP30_FRAME_MS, now);
    return true;
  };
}
let capOf = () => 60;
/* render ตั้งตัวอ่านเป้า FPS ให้ (ไม่ import render ตรง กันวน) */
export function setCapSource(fn) { capOf = fn; }

export function stepFrame(G, systems, dt) {
  /* หยุดเกม (เมนู/จอแนวตั้ง) → เวลาเกมไม่เดิน · เรียกเฉพาะระบบ always (CONTRACT §1) */
  const paused = !!(G.paused || (G.cam && G.cam.portrait));
  G.time.dt = paused ? 0 : Math.min(MAX_DT, Math.max(0, dt));
  G.time.now += G.time.dt;
  G.time.frame++;
  for (const s of systems) {
    if (!s.update) continue;
    if (paused && !s.always) continue;
    try { s.update(G, G.time.dt); } catch (e) { console.error('[update]', s.id, e); }
  }
}

export function drawFrame(G, systems, ctx) {
  for (const layer of LAYERS) {
    for (const s of systems) {
      if (!s.draw) continue;
      try { s.draw(G, ctx, layer); } catch (e) { console.error('[draw]', s.id, layer, e); }
    }
    zflush(ctx); /* วาดของที่ส่งเข้าคิวเรียง y ของชั้นนี้ (CONTRACT §1) */
  }
}

export function startLoop(G, systems, ctx, { beforeFrame, afterFrame } = {}) {
  let last = performance.now(), gate = null;
  function frame(now) {
    /* จำกัด 30 FPS (spec01 §1) ด้วยเส้นเวลาเป้า · เป้า FPS มาจาก core/render · เปลี่ยนเป้ากลับเป็น 30 = เริ่มเส้นเวลาใหม่ */
    if (capOf() === 30) {
      if (!gate) gate = cap30Gate();
      if (!gate(now)) { requestAnimationFrame(frame); return; }
    } else gate = null;
    const dt = (now - last) / 1000;
    last = now;
    beforeFrame?.(G);
    stepFrame(G, systems, dt);
    drawFrame(G, systems, ctx);
    afterFrame?.(G);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
