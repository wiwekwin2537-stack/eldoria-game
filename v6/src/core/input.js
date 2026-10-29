/* input — รวมทุกอุปกรณ์เป็นชุดเดียว (เจ้าของ G.input · CONTRACT §5 · spec01 §5)
   คีย์บอร์ด · คลิกเมาส์ (คอม) · จอย+ปุ่มบนจอ (มือถือแนวนอน) · จอยเกม (Gamepad API)

   G.input = { mx, my  ทิศเดิน −1..1 (ยังไม่ทำให้ยาวเท่ากันตอนเดินเฉียง — movement ทำ)
               run     true = วิ่ง (Ctrl ค้าง / ดันจอยสุด / ดันอนาล็อกสุด)
               pressed Set(action) กดใหม่ "เฟรมนี้"  · held Set(action) กำลังกดค้าง
               click   {wx,wy} คลิกพื้นในโลก px เฟรมนี้ (คอมเท่านั้น) | null }

   ⏱️ อายุของ pressed / click: ปุ่มที่กดระหว่างเฟรมถูกเก็บคิวไว้ → ระบบ input (ต้องอยู่ "แรกสุด" ใน systems/index.js)
   ย้ายคิวเข้า G.input.pressed/click ตอนต้น update ของเฟรมถัดไป → ทุกระบบหลังจากนั้นเห็นครบ 1 เฟรมพอดี
   → ต้น update เฟรมถัดไป input สร้าง Set ใหม่ทับ (= ล้าง) · ระบบอื่นห้ามล้างเอง
   ยังไม่ทำ: บทสนทนาเปิดแล้วกินคีย์ทั้งหมด (031:2880) — ทำตอนมีระบบบทสนทนา */
import {
  MOVE_KEYS, RUN_KEYS, RUN_KEY_DEFAULT, ACTION_KEYS, JOY, ACT_BOX, ACT_BUTTONS,
  PAD, PAD_BUTTONS, PAD_DPAD, PAD_RIGHT_STICK,
} from '../data/controls.js';
import { screenToWorld } from './camera.js';

/* ---------- ฟังก์ชันล้วน (เทสได้ใน node) ---------- */

/* คีย์ทิศที่กดค้าง (Set ของ e.code) → mx,my */
export function keyMove(codes) {
  let u = 0, d = 0, l = 0, r = 0;
  for (const c of codes) {
    const m = MOVE_KEYS[c];
    if (m === 'up') u = 1; else if (m === 'down') d = 1; else if (m === 'left') l = 1; else if (m === 'right') r = 1;
  }
  return { mx: r - l, my: d - u };
}

/* e.code → action (null = ไม่ใช่ปุ่ม action) */
export function keyAction(code) { return ACTION_KEYS[code] || null; }
export function isRunKey(code, runKey = RUN_KEY_DEFAULT) { return (RUN_KEYS[runKey] || []).includes(code); }
export function isGameKey(code, runKey) { return !!(MOVE_KEYS[code] || ACTION_KEYS[code] || isRunKey(code, runKey)); }

/* ดันจอยบนจอ: ระยะจากกลาง (dx,dy px) · R = รัศมี → {x,y,m,run} (026:56 joyMove)
   m = ระยะ/R · ต่ำกว่า deadzone = 0 · เกิน deadzone ยืดสเกลให้เริ่มจาก 0 ถึง 1 ที่ขอบ */
export function joyVector(dx, dy, R, cfg = JOY) {
  const d = Math.hypot(dx, dy), m = d / R;
  if (m < cfg.deadzone) return { x: 0, y: 0, m, run: false };
  const k = Math.min(1, (m - cfg.deadzone) / (1 - cfg.deadzone)) / Math.max(d, 1e-6);
  return { x: dx * k, y: dy * k, m, run: m > cfg.runAt };
}

/* จุดกลางจอยแบบ float: ตรงที่แตะ แต่ไม่ให้ล้นกรอบพื้นที่จอย */
export function joyCenter(x, y, rect, R) {
  const cl = (v, a, b) => Math.min(Math.max(v, a), Math.max(a, b));
  return { x: cl(x, rect.left + R, rect.right - R), y: cl(y, rect.top + R, rect.bottom - R) };
}

/* อ่านจอยเกม 1 เฟรม (141-fix109 poll109) · st = สถานะที่จำข้ามเฟรม (เริ่ม {}) · ui = มีหน้าต่างเปิดอยู่
   คืน { mx, my, run, moving, pressed:[], held:[] } */
export function readPad(pad, st, dt, ui = false) {
  const out = { mx: 0, my: 0, run: false, moving: false, pressed: [], held: [] };
  const B = (pad.buttons || []).map(b => !!(b && (b.pressed || b.value > .5)));
  const prev = st.prev || [];
  for (const i in PAD_BUTTONS) {
    let a = PAD_BUTTONS[i];
    if (+i === 1 && ui) a = 'back'; /* B: มีหน้าต่างเปิด = ปิดหน้าต่าง · ไม่มี = พุ่ง */
    if (B[i] && !prev[i]) out.pressed.push(a);
    if (B[i]) out.held.push(a);
  }
  /* A ค้าง = ตีซ้ำทุก 0.26 วิ */
  if (B[0] && !prev[0]) st.atkT = PAD.attackRepeat;
  else if (B[0]) { st.atkT = (st.atkT || 0) - dt; if (st.atkT <= 0) { st.atkT = PAD.attackRepeat; out.pressed.push('attack'); } }
  /* เดิน: อนาล็อกซ้าย + ปุ่มทิศ (แบบ 8 ทิศเหมือนเดิม) */
  const ax = pad.axes?.[0] || 0, ay = pad.axes?.[1] || 0, dz = PAD.deadzone;
  const dir = n => Object.keys(PAD_DPAD).some(k => PAD_DPAD[k] === n && B[k]);
  const u = ay < -dz || dir('up'), d = ay > dz || dir('down'), l = ax < -dz || dir('left'), r = ax > dz || dir('right');
  out.mx = (r ? 1 : 0) - (l ? 1 : 0);
  out.my = (d ? 1 : 0) - (u ? 1 : 0);
  out.moving = !!(u || d || l || r);
  const mag = Math.hypot(ax, ay);
  if (mag > PAD.runAt) st.run = true; else if (mag < PAD.runOff) st.run = false;
  out.run = !!st.run;
  /* อนาล็อกขวา 4 ทิศ = กดครั้งเดียวต่อการดัน */
  const rx = pad.axes?.[2] || 0, ry = pad.axes?.[3] || 0, t = PAD.rightStick;
  const rs = rx > t ? 'right' : rx < -t ? 'left' : ry < -t ? 'up' : ry > t ? 'down' : '';
  if (rs && rs !== st.rs) out.pressed.push(PAD_RIGHT_STICK[rs]);
  st.rs = rs;
  st.prev = B;
  return out;
}

/* ---------- สถานะภายใน (เบราว์เซอร์) ---------- */
const S = {
  G: null,
  keys: new Set(),        /* e.code ที่กดค้าง */
  queue: [],              /* action ที่กดใหม่ รอเข้าเฟรมถัดไป */
  click: null,            /* คลิกที่รอเข้าเฟรมถัดไป */
  touchHeld: new Set(),   /* action จากปุ่มบนจอที่กดค้าง */
  joy: { on: false, id: null, c: null, x: 0, y: 0, m: 0, run: false },
  pad: {}, padOn: false,
  runKey: RUN_KEY_DEFAULT,
  el: {},
};

function coarse() { try { return matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } }
function typing(t) { return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); }
function releaseAll() {
  S.keys.clear(); S.touchHeld.clear();
  stopJoy();
}

/* ---------- คีย์บอร์ด + กันซูมเบราว์เซอร์ (113-fix81:54–57) ---------- */
function bindKeyboard() {
  addEventListener('keydown', e => {
    /* กันซูมเบราว์เซอร์ Ctrl/⌘ + = - 0 */
    if ((e.ctrlKey || e.metaKey) && /^(=|\+|-|_|0)$/.test(e.key)) { e.preventDefault(); return; }
    if (typing(e.target)) return;
    const code = e.code;
    if (!isGameKey(code, S.runKey)) return;
    e.preventDefault();
    if (!e.repeat) { const a = keyAction(code); if (a) S.queue.push(a); }
    S.keys.add(code);
  });
  addEventListener('keyup', e => { S.keys.delete(e.code); });
  addEventListener('blur', releaseAll);
  /* กดวิ่ง (Ctrl) ค้างแล้วเผลอ Ctrl+W → ถามก่อนปิดแท็บ (026:19) */
  addEventListener('beforeunload', e => {
    if ([...S.keys].some(c => isRunKey(c, S.runKey))) { e.preventDefault(); e.returnValue = ''; }
  });
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
  document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false }); /* ล้อเมาส์ไม่ซูม (DECISIONS) */
  let lt = 0;
  document.addEventListener('touchend', e => { /* แตะซ้ำ <300ms นอกปุ่ม = กันซูม (วัดช่วงแตะ ไม่ใช่คูลดาวน์) */
    const n = performance.now();
    if (n - lt < 300 && !(e.target && e.target.closest && e.target.closest('input,textarea,select,button,a,[data-act]'))) e.preventDefault();
    lt = n;
  }, { passive: false });
}

/* ---------- คลิกเมาส์บนพื้น (คอมเท่านั้น · 198-click-move) ---------- */
function bindMouse() {
  const cv = document.getElementById('c');
  if (!cv) return;
  cv.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0 || coarse()) return;
    S.click = screenToWorld(S.G.cam, e.clientX, e.clientY, cv.getBoundingClientRect());
  });
  cv.addEventListener('contextmenu', e => e.preventDefault());
}

/* ---------- จอย + ปุ่มบนจอ (มือถือแนวนอน) ---------- */
function css(el, o) { Object.assign(el.style, o); return el; }
function div(id, parent) { const d = document.createElement('div'); if (id) d.id = id; parent.appendChild(d); return d; }

function stopJoy() {
  const j = S.joy;
  j.on = false; j.id = null; j.x = j.y = j.m = 0; j.run = false;
  if (S.el.base) { S.el.base.style.display = JOY.mode === 'fixed' ? 'block' : 'none'; knobAt(0, 0); }
}
function knobAt(dx, dy) {
  const R = JOY.size / 2, d = Math.hypot(dx, dy), k = d > R ? R / d : 1;
  S.el.knob.style.transform = `translate(calc(-50% + ${dx * k}px), calc(-50% + ${dy * k}px))`;
}
function joyMove(e) {
  const j = S.joy, R = JOY.size / 2, dx = e.clientX - j.c.x, dy = e.clientY - j.c.y;
  knobAt(dx, dy);
  const v = joyVector(dx, dy, R);
  j.x = v.x; j.y = v.y; j.m = v.m; j.run = v.run;
}

function buildTouchUI() {
  const ui = document.getElementById('ui');
  if (!ui) return;
  const wrap = css(div('touch', ui), { position: 'fixed', inset: '0', pointerEvents: 'none', display: 'none' });
  S.el.wrap = wrap;
  /* พื้นที่จอย ซ้ายล่าง 42%×66% */
  const zone = css(div('joyzone', wrap), {
    position: 'absolute', left: '0', bottom: '0', width: JOY.zoneW * 100 + 'vw', height: JOY.zoneH * 100 + 'vh',
    pointerEvents: 'auto', touchAction: 'none',
  });
  const hint = css(div('joyhint', wrap), {
    position: 'absolute', left: JOY.hintMargin + 'px', bottom: JOY.hintMargin + 'px', width: JOY.hintSize + 'px', height: JOY.hintSize + 'px',
    borderRadius: '50%', border: '3px dashed rgba(255,255,255,.35)', pointerEvents: 'none', display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.55)', font: '700 11px system-ui,"Noto Sans Thai",sans-serif',
  });
  hint.textContent = JOY.hint;
  const base = css(div('joybase', zone), {
    position: 'absolute', width: JOY.size + 'px', height: JOY.size + 'px', borderRadius: '50%', display: 'none',
    border: '4px solid rgba(255,255,255,.45)', background: 'rgba(20,24,36,.35)', opacity: JOY.opacity, pointerEvents: 'none',
  });
  const knob = css(div('joyknob', base), {
    position: 'absolute', left: '50%', top: '50%', width: JOY.size * JOY.knob + 'px', height: JOY.size * JOY.knob + 'px',
    borderRadius: '50%', background: 'rgba(255,255,255,.7)', transform: 'translate(-50%,-50%)',
  });
  Object.assign(S.el, { zone, hint, base, knob });
  const place = c => { const r = zone.getBoundingClientRect(), R = JOY.size / 2; base.style.left = (c.x - r.left - R) + 'px'; base.style.top = (c.y - r.top - R) + 'px'; };
  const fixedC = r => { const R = JOY.size / 2; return { x: r.left + JOY.fixedMargin + R, y: r.bottom - JOY.fixedMargin - R }; };
  zone.addEventListener('pointerdown', e => {
    const j = S.joy;
    if (j.id !== null) return;
    e.preventDefault();
    const r = zone.getBoundingClientRect(), R = JOY.size / 2;
    if (JOY.mode === 'fixed') { const c = fixedC(r); if (Math.hypot(e.clientX - c.x, e.clientY - c.y) > R * JOY.fixedGrab) return; j.c = c; }
    else j.c = joyCenter(e.clientX, e.clientY, r, R);
    j.id = e.pointerId; j.on = true;
    try { zone.setPointerCapture(e.pointerId); } catch (_) {}
    base.style.display = 'block'; place(j.c); joyMove(e);
  });
  zone.addEventListener('pointermove', e => { if (e.pointerId === S.joy.id) { e.preventDefault(); joyMove(e); } });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) zone.addEventListener(ev, e => { if (e.pointerId === S.joy.id) stopJoy(); });
  zone.addEventListener('contextmenu', e => e.preventDefault());
  if (JOY.mode === 'fixed') { base.style.display = 'block'; place(fixedC(zone.getBoundingClientRect())); }

  /* ปุ่มขวาล่าง */
  const box = css(div('acts', wrap), {
    position: 'absolute', right: ACT_BOX.margin + 'px', bottom: ACT_BOX.margin + 'px', width: ACT_BOX.w + 'px', height: ACT_BOX.h + 'px',
    pointerEvents: 'none',
  });
  for (const b of ACT_BUTTONS) {
    const el = document.createElement('button');
    el.id = b.id; el.dataset.act = b.action; el.textContent = b.icon;
    css(el, {
      position: 'absolute', right: b.r + 'px', bottom: b.b + 'px', width: b.size + 'px', height: b.size + 'px',
      borderRadius: '50%', border: (b.size >= 60 ? 3 : 2) + 'px solid rgba(242,201,90,.85)', pointerEvents: 'auto',
      background: b.action === 'attack' ? 'radial-gradient(circle at 40% 35%,rgba(220,90,60,.85),rgba(120,25,15,.85))' : 'rgba(30,24,50,.8)',
      color: '#fff', font: `700 ${Math.round(b.size * .45)}px system-ui,"Noto Sans Thai",sans-serif`, padding: '0',
      touchAction: 'none', boxShadow: '0 3px 10px rgba(0,0,0,.55)',
    });
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      S.queue.push(b.action); S.touchHeld.add(b.action);
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(ev, () => S.touchHeld.delete(b.action));
    el.addEventListener('contextmenu', e => e.preventDefault());
    box.appendChild(el);
  }
  S.el.acts = box;
}

/* แสดงปุ่มบนจอเฉพาะเครื่องสัมผัสแนวนอน */
function touchVisible(G) {
  const w = S.el.wrap;
  if (!w) return;
  const show = coarse() && !G.cam.portrait;
  w.style.display = show ? 'block' : 'none';
  if (S.el.hint) S.el.hint.style.display = show && JOY.mode !== 'fixed' && !S.joy.on ? 'flex' : 'none';
  if (!show && (S.joy.on || S.touchHeld.size)) { stopJoy(); S.touchHeld.clear(); }
}

function getPad() {
  try {
    for (const g of (navigator.getGamepads ? navigator.getGamepads() : [])) if (g && g.connected) return g;
  } catch (e) {}
  return null;
}

/* ---------- ระบบ ---------- */
export default {
  id: 'input',
  always: true, /* ทำงานแม้หยุดเกม — ซ่อนปุ่มตอนแนวตั้ง (CONTRACT §1) */
  init(G) {
    S.G = G;
    if (typeof document === 'undefined') return;
    bindKeyboard();
    bindMouse();
    buildTouchUI();
  },
  update(G, dt) {
    const I = G.input;
    /* 1) ย้ายคิว → pressed/click ของเฟรมนี้ (ของเฟรมก่อนถูกแทนที่ = ล้าง) */
    const pressed = new Set(S.queue), held = new Set();
    S.queue.length = 0;
    I.click = S.click; S.click = null;
    /* 2) คีย์บอร์ด */
    let { mx, my } = keyMove(S.keys);
    let run = [...S.keys].some(c => isRunKey(c, S.runKey));
    for (const c of S.keys) { const a = keyAction(c); if (a) held.add(a); }
    /* 3) ปุ่มบนจอ */
    for (const a of S.touchHeld) held.add(a);
    if (typeof document !== 'undefined') touchVisible(G);
    /* 4) จอยเกม */
    const pad = typeof navigator !== 'undefined' ? getPad() : null;
    if (pad) {
      S.padOn = true;
      const p = readPad(pad, S.pad, dt, G.ui.open.size > 0);
      p.pressed.forEach(a => pressed.add(a));
      p.held.forEach(a => held.add(a));
      if (p.moving) { mx = p.mx; my = p.my; }
      run = run || p.run;
    } else if (S.padOn) { S.padOn = false; S.pad = {}; }
    /* 5) จอยบนจอ ชนะคีย์บอร์ด (เหมือนเกมเดิม) */
    if (S.joy.on) { mx = S.joy.x; my = S.joy.y; run = run || S.joy.run; }
    /* มือถือแนวตั้ง (หน้าหมุนจอ) = ไม่รับปุ่ม */
    if (G.cam.portrait) { mx = my = 0; run = false; pressed.clear(); held.clear(); I.click = null; }
    I.mx = mx; I.my = my; I.run = run; I.pressed = pressed; I.held = held;
  },
};

/* ตั้งปุ่มวิ่ง 'ctrl' | 'c' (ระบบตั้งค่าเรียก) */
export function setRunKey(k) { if (RUN_KEYS[k]) S.runKey = k; }
