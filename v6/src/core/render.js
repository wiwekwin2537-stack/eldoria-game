/* render — ขนาด canvas / คุณภาพภาพ / ตั้งพิกัดวาดแต่ละชั้น / หน้า "หมุนจอ" (spec01 §3)
   ระบบนี้ต้องอยู่ก่อนระบบที่วาดอื่นๆ ใน systems/index.js เพราะ draw() ของมันตั้ง setTransform ให้ทุกชั้น:
   ground/world/top = พิกัดโลก (px) · ui = พิกัดจอ (หน่วย VW×VH ไม่ต้องคูณ RES) */
import { viewSize, setView, ensureCam } from './camera.js';
import { GQ, GQ_ORDER, GQ_AUTO } from '../data/view.js';

/* ตาราง GQ / ลำดับ / ค่าลดอัตโนมัติ อยู่ data/view.js (CONTRACT §3) · ส่งต่อให้ไฟล์ที่ import จากที่นี่ */
export { GQ, GQ_ORDER, GQ_AUTO };
const BG = '#1b2433';

/* เดาคุณภาพจากเครื่อง (gqGuess 031:2683) */
export function guessQuality(coarse, cores = 4, mem = 4) {
  if (coarse) return cores <= 4 || mem <= 3 ? 'low' : cores >= 8 && mem >= 6 ? 'high' : 'med';
  return cores <= 2 ? 'med' : 'high';
}

/* ขนาด CSS ของ canvas ให้พอดีหน้าต่างโดยไม่ยืดภาพ (เกินสัดส่วน 2.4 → ขอบดำ) */
export function fitBox(w, h, vw, vh) {
  const k = Math.min(w / vw, h / vh);
  const cw = Math.round(vw * k), ch = Math.round(vh * k);
  return { cw, ch, left: Math.floor((w - cw) / 2), top: Math.floor((h - ch) / 2) };
}

export function isCoarse() {
  try { return matchMedia('(pointer: coarse)').matches; } catch (e) { return false; }
}

/* ตัววัด FPS (ฟังก์ชันล้วน เทสได้ใน node) — นับจาก rAF ของตัวเอง ไม่ใช่ dt ของเกม (dt ถูกตัดเพดาน .05 + ลูปอาจจำกัด 30 FPS)
   fpsTick(m, ห่างจากเฟรมก่อน ms, ข้าม?, เป้า FPS) → true = ควรลดคุณภาพ 1 ขั้น
   ข้าม = หยุดเกม/แท็บซ่อน/หมุนจอ · เฟรมห่างเกิน gapMs ไม่นับ (031:2697 gqMon)
   เกณฑ์ = min(fpsLow, min(เป้า, ความเร็วจอ) × capRatio) → เครื่องจำกัด 30 FPS ที่เดินนิ่ง 30 ไม่ถูกลด */
export function createFpsMon() { return { iv: [], t: 0, lowN: 0, fps: 0, peak: 0, limit: 0 }; }
export function fpsTick(m, dtMs, skip, target = 60, cfg = GQ_AUTO) {
  if (skip || !(dtMs > 0) || dtMs > cfg.gapMs) return false;
  m.iv.push(dtMs); m.t += dtMs;
  if (m.t < cfg.every) return false;
  const n = m.iv.length, sorted = m.iv.slice().sort((a, b) => a - b);
  m.fps = n * 1000 / m.t;
  m.peak = 1000 / sorted[Math.floor((n - 1) * cfg.fastPct)];
  m.limit = Math.min(cfg.fpsLow, Math.min(target, m.peak) * cfg.capRatio);
  m.iv.length = 0; m.t = 0;
  if (m.fps < m.limit) m.lowN++; else m.lowN = 0;
  if (m.lowN >= cfg.rounds) { m.lowN = 0; return true; }
  return false;
}

const R = { canvas: null, G: null, level: 'high', auto: true, mon: createFpsMon(), fpsCap: 60, rot: null, rotOn: null };

/* main.js เรียกครั้งเดียว: ผูก canvas + ปรับขนาดเมื่อหน้าต่างเปลี่ยน */
export function attachCanvas(G, canvas) {
  R.canvas = canvas; R.G = G;
  ensureCam(G);
  R.level = guessQuality(isCoarse(), navigator.hardwareConcurrency || 4, navigator.deviceMemory || 4);
  R.fpsCap = isCoarse() ? 30 : 60; /* เป้า FPS ค่าเริ่ม มือถือ 30 / คอม 60 (spec01 §1 · 031:3845) — ตั้งใหม่ด้วย setFpsCap */
  startFpsMon();
  addEventListener('resize', () => fit());
  addEventListener('orientationchange', () => setTimeout(fit, 50));
  /* มือถือ: แตะครั้งแรกขอเต็มจอ (031:595) */
  if (isCoarse()) {
    addEventListener('pointerdown', () => {
      try { document.documentElement.requestFullscreen?.().catch(() => {}); } catch (e) {}
    }, { once: true });
  }
  fit();
}

export function setQuality(level, auto = false) {
  if (!GQ[level]) return;
  R.level = level; R.auto = auto;
  fit();
}
export function quality() { return { level: R.level, auto: R.auto, fps: R.mon.fps, ...GQ[R.level] }; }
/* เป้า FPS (30/60) — หน้าตั้งค่า/loop เรียกเมื่อผู้เล่นเปลี่ยน · ใช้คิดเกณฑ์ลดคุณภาพ */
export function setFpsCap(n) { if (n === 30 || n === 60) R.fpsCap = n; }

export function fit() {
  const G = R.G, cv = R.canvas;
  if (!G || !cv) return;
  const w = innerWidth || 640, h = innerHeight || 448;
  const { VW, VH } = viewSize(w, h);
  const res = GQ[R.level].res;
  cv.width = Math.round(VW * res);
  cv.height = Math.round(VH * res);
  const b = fitBox(w, h, VW, VH);
  Object.assign(cv.style, { width: b.cw + 'px', height: b.ch + 'px', marginLeft: b.left + 'px', marginTop: b.top + 'px' });
  const portrait = h > w && isCoarse();
  setView(G, VW, VH, res, portrait);
  showRotate(portrait);
}

/* rAF แยกของตัวเอง (เหมือน gqMon เดิม) — วัดความเร็วจอจริง ไม่ขึ้นกับลูปเกม */
function startFpsMon() {
  let last = 0;
  const tick = now => {
    requestAnimationFrame(tick);
    const dt = last ? now - last : 0;
    last = now;
    if (!R.auto) return;
    const G = R.G, skip = document.hidden || !!(G && (G.paused || (G.cam && G.cam.portrait)));
    if (fpsTick(R.mon, dt, skip, R.fpsCap)) {
      const i = GQ_ORDER.indexOf(R.level);
      if (i > 0) { R.level = GQ_ORDER[i - 1]; fit(); }
    }
  };
  requestAnimationFrame(tick);
}

/* มือถือแนวตั้ง → "หมุนจอ" (spec01 §3 #rot) · ระหว่างนี้ core/input ส่งปุ่มว่าง (หยุดเกมจริงรอหัวหน้าเพิ่มใน loop) */
function showRotate(on) {
  if (!R.rot) {
    const ui = document.getElementById('ui');
    if (!ui) return;
    const d = document.createElement('div');
    d.id = 'rot';
    d.innerHTML = '<div style="font-size:56px">📱↻</div><div>หมุนจอเป็นแนวนอนเพื่อเล่น</div>';
    Object.assign(d.style, {
      position: 'fixed', inset: '0', zIndex: '50', display: 'none', flexDirection: 'column', gap: '12px',
      alignItems: 'center', justifyContent: 'center', background: 'rgba(10,12,20,.96)', color: '#f2c95a',
      font: '700 20px system-ui,"Noto Sans Thai",sans-serif', textAlign: 'center',
    });
    ui.appendChild(d);
    R.rot = d;
  }
  if (R.rotOn === on) return; /* แตะ DOM เฉพาะตอนเปลี่ยน */
  R.rotOn = on;
  R.rot.style.display = on ? 'flex' : 'none';
}

export default {
  id: 'render',
  always: true, /* ไม่มี update แล้ว (วัด FPS ด้วย rAF ของตัวเอง) · ใส่ไว้ตาม CONTRACT §1 */
  draw(G, ctx, layer) {
    const c = G.cam, res = c.res || 1;
    if (layer === 'ui') { ctx.setTransform(res, 0, 0, res, 0, 0); return; }
    ctx.setTransform(res, 0, 0, res, -c.x * res, -c.y * res);
    if (layer === 'ground') {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
  },
};
