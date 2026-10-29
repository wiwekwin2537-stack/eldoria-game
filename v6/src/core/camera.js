/* camera — ขนาดโลกที่เห็นบนจอ + กล้องตามตัวละคร (เจ้าของ G.cam · CONTRACT §2)
   spec01 §3: ล็อกความสูงโลก 448 ทุกเครื่อง (fix81) · ห้ามซูม (DECISIONS 2026-10-30)
   G.cam = { x, y, zoom:1, vw, vh, res, portrait, shake }  (x,y = มุมซ้ายบนของจอในโลก px) */
import { VIEW_H } from '../config.js';

/* ค่ากล้อง (spec01 §3) — ขอหัวหน้าย้ายไป data/ (ดู TASKS คำขอ) */
export const VIEW = {
  ratioMin: 1.2, ratioMax: 2.4, /* VW = clamp(VH×w/h, VH×1.2, VH×2.4) */
  portraitW: 360,               /* จอแนวตั้ง: ล็อกความกว้างแทน */
  follow: 9,                    /* กล้องลื่น a = 1-exp(-9·dt) */
  oy: .55,                      /* ตัวละครอยู่ที่ 55% ความสูงจอ (เมือง/ร้าน/zone) · world ใส่ G.scene.camOy ได้ (ทุ่ง .58 ดัน .5) */
};

/* ขนาดโลกที่เห็น (หน่วยโลก px) จากขนาดหน้าต่าง CSS — fitView ของ fix81 */
export function viewSize(w, h) {
  w = w || 640; h = h || 448;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  if (w >= h) {
    const VH = VIEW_H;
    return { VW: Math.round(clamp(VH * w / h, VH * VIEW.ratioMin, VH * VIEW.ratioMax)), VH };
  }
  const VW = VIEW.portraitW;
  return { VW, VH: Math.round(clamp(VW * h / w, VW * VIEW.ratioMin, VW * VIEW.ratioMax)) };
}

/* จุดที่กล้องอยากไป: แมพเล็กกว่าจอ → กึ่งกลาง · ไม่งั้นตามตัว แล้วไม่ให้เลยขอบแมพ
   mw/mh = ขนาดแมพ px (null = ไม่รู้ขนาด → ตามตัวอย่างเดียว) */
export function camTarget(mw, mh, px, py, vw, vh, oy = VIEW.oy) {
  const axis = (m, p, v, k) => {
    if (!(m > 0)) return p - v * k;
    if (m <= v) return (m - v) / 2;
    return Math.max(0, Math.min(m - v, p - v * k));
  };
  return { x: axis(mw, px, vw, .5), y: axis(mh, py, vh, oy) };
}

/* เลื่อนกล้องเข้าหาเป้าแบบลื่น · key เปลี่ยน (เปลี่ยนแมพ/ขนาดจอ) = กระโดดไปทันที */
export function stepCam(cam, tx, ty, dt, key) {
  if (cam._key !== key) { cam._key = key; cam._fx = tx; cam._fy = ty; }
  else {
    const a = 1 - Math.exp(-VIEW.follow * dt);
    cam._fx += (tx - cam._fx) * a;
    cam._fy += (ty - cam._fy) * a;
  }
}

/* ปัดให้ตรงพิกเซลจริงบนจอ (ภาพไม่สั่น/เบลอ) */
export function snap(v, res) { return Math.round(v * res) / res; }

/* แปลงพิกัด: หน้าต่าง (clientX/Y) ↔ โลก · rect = canvas.getBoundingClientRect() */
export function screenToWorld(cam, clientX, clientY, rect) {
  return {
    wx: cam.x + (clientX - rect.left) * (cam.vw / rect.width),
    wy: cam.y + (clientY - rect.top) * (cam.vh / rect.height),
  };
}
export function worldToScreen(cam, wx, wy, rect) {
  return {
    x: rect.left + (wx - cam.x) * (rect.width / cam.vw),
    y: rect.top + (wy - cam.y) * (rect.height / cam.vh),
  };
}

/* สั่นจอ (ระบบต่อสู้เรียกได้) — amp px · time วิ */
export function shake(G, amp, time = .25) {
  const s = G.cam.shake;
  if (amp >= s.amp * (s.t / (s.dur || 1))) { s.amp = amp; s.t = time; s.dur = time; }
}

/* ตั้งขนาดจอใน G.cam (render เรียกตอน fit) */
export function setView(G, vw, vh, res, portrait) {
  Object.assign(G.cam, { vw, vh, res, portrait: !!portrait });
}

export function ensureCam(G) {
  const c = G.cam;
  c.zoom = 1;
  if (!c.vw) { c.vw = viewSize(640, 448).VW; c.vh = VIEW_H; }
  if (!c.res) c.res = 1;
  if (!c.shake) c.shake = { amp: 0, t: 0, dur: 0 };
  return c;
}

export default {
  id: 'camera',
  always: true, /* ทำงานแม้หยุดเกม (CONTRACT §1) */
  init(G) { ensureCam(G); },
  update(G, dt) {
    const c = ensureCam(G), P = G.player, S = G.scene;
    const mw = S && S.w, mh = S && S.h;
    const t = camTarget(mw, mh, P.x, P.y, c.vw, c.vh, (S && S.camOy) || VIEW.oy);
    stepCam(c, t.x, t.y, dt, [S && S.id, mw, mh, c.vw, c.vh].join(','));
    let sx = 0, sy = 0;
    if (c.shake.t > 0) {
      c.shake.t = Math.max(0, c.shake.t - dt);
      const k = c.shake.amp * (c.shake.t / (c.shake.dur || 1));
      sx = (Math.random() * 2 - 1) * k; sy = (Math.random() * 2 - 1) * k;
    }
    c.x = snap(c._fx + sx, c.res);
    c.y = snap(c._fy + sy, c.res);
    c.zoom = 1; /* ห้ามซูม (DECISIONS) */
  },
};
