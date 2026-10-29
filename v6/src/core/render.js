/* render — ขนาด canvas / คุณภาพภาพ / ตั้งพิกัดวาดแต่ละชั้น / หน้า "หมุนจอ" (spec01 §3)
   ระบบนี้ต้องอยู่ก่อนระบบที่วาดอื่นๆ ใน systems/index.js เพราะ draw() ของมันตั้ง setTransform ให้ทุกชั้น:
   ground/world/top = พิกัดโลก (px) · ui = พิกัดจอ (หน่วย VW×VH ไม่ต้องคูณ RES) */
import { viewSize, setView, ensureCam } from './camera.js';

/* คุณภาพภาพ (spec01 §3 · ใช้ GQ อย่างเดียว ไม่ใช้ SET.res — บัคเดิม) · ค่าทับ 031:3850 แล้ว
   res = ความละเอียด canvas ต่อ 1 px โลก · fx = เพดานอนุภาค · dust · mm = มินิแมพวาดทุก n เฟรม (ระบบอื่นอ่าน) */
export const GQ = {
  low:   { res: .6,  fx: 30,  dust: .25, mm: 10 },
  med:   { res: .85, fx: 110, dust: .6,  mm: 4 },
  high:  { res: 1.5, fx: 240, dust: 1,   mm: 2 },
  ultra: { res: 2.2, fx: 500, dust: 1,   mm: 1 },
};
export const GQ_ORDER = ['low', 'med', 'high', 'ultra'];
export const GQ_AUTO = { every: 3, fpsLow: 42, rounds: 2 }; /* วัดทุก 3 วิ · FPS<42 สองรอบติด → ลด 1 ขั้น */
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

const R = { canvas: null, G: null, level: 'high', auto: true, fr: 0, t0: 0, lowN: 0, rot: null };

/* main.js เรียกครั้งเดียว: ผูก canvas + ปรับขนาดเมื่อหน้าต่างเปลี่ยน */
export function attachCanvas(G, canvas) {
  R.canvas = canvas; R.G = G;
  ensureCam(G);
  R.level = guessQuality(isCoarse(), navigator.hardwareConcurrency || 4, navigator.deviceMemory || 4);
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
export function quality() { return { level: R.level, ...GQ[R.level] }; }

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
  R.rot.style.display = on ? 'flex' : 'none';
}

/* ลดคุณภาพอัตโนมัติเมื่อเครื่องช้า */
function autoQuality(dt) {
  if (!R.auto) return;
  R.fr++; R.t0 += dt;
  if (R.t0 < GQ_AUTO.every) return;
  const fps = R.fr / R.t0;
  R.fr = 0; R.t0 = 0;
  if (fps < GQ_AUTO.fpsLow) R.lowN++; else R.lowN = 0;
  const i = GQ_ORDER.indexOf(R.level);
  if (R.lowN >= GQ_AUTO.rounds && i > 0) { R.lowN = 0; R.level = GQ_ORDER[i - 1]; fit(); }
}

/* ===== ดีบักชั่วคราว (ลบใน 1A-2 เมื่อมีแมพจริง) ===== */
function debugGrid(G, ctx) {
  const c = G.cam, s = 64;
  ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = Math.floor(c.x / s) * s; x < c.x + c.vw; x += s) { ctx.moveTo(x, c.y); ctx.lineTo(x, c.y + c.vh); }
  for (let y = Math.floor(c.y / s) * s; y < c.y + c.vh; y += s) { ctx.moveTo(c.x, y); ctx.lineTo(c.x + c.vw, y); }
  ctx.stroke();
  ctx.fillStyle = '#e2a548';
  ctx.beginPath(); ctx.arc(G.player.x, G.player.y, 6, 0, Math.PI * 2); ctx.fill();
  const k = G.input.click;
  if (k) { ctx.strokeStyle = '#7fd1ff'; ctx.strokeRect(k.wx - 5, k.wy - 5, 10, 10); }
}
function debugText(G, ctx) {
  const I = G.input, c = G.cam;
  if (I.pressed.size) R.lastPressed = [...I.pressed].join(' ');
  if (I.click) R.lastClick = Math.round(I.click.wx) + ', ' + Math.round(I.click.wy);
  const lines = [
    'ตำนานเอลโดเรีย v6 — ทดสอบจอ/ปุ่ม (ชั่วคราว)',
    `ทิศเดิน ${I.mx.toFixed(2)}, ${I.my.toFixed(2)}${I.run ? ' · วิ่ง' : ''}`,
    'กดค้าง: ' + ([...I.held].join(' ') || '-'),
    'กดล่าสุด: ' + (R.lastPressed || '-'),
    'คลิก: ' + (R.lastClick || '-'),
    `จอ ${c.vw}×${c.vh} · คุณภาพ ${R.level} (${c.res}) · เฟรม ${G.time.frame}`,
  ];
  ctx.font = '14px system-ui, "Noto Sans Thai", sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,.45)';
  ctx.fillRect(8, 8, 330, 20 * lines.length + 10);
  lines.forEach((t, i) => { ctx.fillStyle = i ? '#cfd8e6' : '#e2a548'; ctx.fillText(t, 16, 28 + i * 20); });
}
/* ===== จบดีบักชั่วคราว ===== */

export default {
  id: 'render',
  update(G, dt) { autoQuality(dt); },
  draw(G, ctx, layer) {
    const c = G.cam, res = c.res || 1;
    if (layer === 'ui') { ctx.setTransform(res, 0, 0, res, 0, 0); debugText(G, ctx); return; }
    ctx.setTransform(res, 0, 0, res, -c.x * res, -c.y * res);
    if (layer === 'ground') {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
      debugGrid(G, ctx);
    }
  },
};
