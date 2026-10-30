import { zflush } from './zsort.js';
/* loop — ลูปเกม: update ทุกระบบตามลำดับ แล้ววาดทีละชั้น (dt ≤ 0.05 ตามเกมเดิม · spec01 §1) */
export const LAYERS = ['ground', 'world', 'top', 'ui'];
export const MAX_DT = 0.05;
export const CAP30_MS = 30;
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
  let last = performance.now();
  function frame(now) {
    /* จำกัด 30 FPS: ข้ามเฟรมที่ห่างจากเฟรมที่ทำล่าสุด < 30ms แบบเกมเดิม (spec01 §1 · 031:3848) · เป้ามาจาก core/render */
    if (capOf() === 30 && now - last < CAP30_MS) { requestAnimationFrame(frame); return; }
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
