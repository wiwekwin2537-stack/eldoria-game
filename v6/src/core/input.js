/* input — รวมทุกอุปกรณ์เป็นชุดเดียว (เจ้าของ G.input · CONTRACT §5 · spec01 §5)
   คีย์บอร์ด · คลิกเมาส์ (คอม) · จอย+ปุ่มบนจอ (มือถือแนวนอน) · จอยเกม (Gamepad API)

   G.input = { mx, my  ทิศเดิน −1..1 (ยังไม่ทำให้ยาวเท่ากันตอนเดินเฉียง — movement ทำ)
               run     true = วิ่ง (Ctrl ค้าง / ดันจอยสุด / ดันอนาล็อกสุด)
               pressed Set(action) กดใหม่ "เฟรมนี้"  · held Set(action) กำลังกดค้าง
               click   {wx,wy} คลิกพื้นในโลก px เฟรมนี้ (คอมเท่านั้น) | null }

   ⏱️ อายุของ pressed / click: ปุ่มที่กดระหว่างเฟรมถูกเก็บคิวไว้ → ระบบ input (ต้องอยู่ "แรกสุด" ใน systems/index.js)
   ย้ายคิวเข้า G.input.pressed/click ตอนต้น update ของเฟรมถัดไป → ทุกระบบหลังจากนั้นเห็นครบ 1 เฟรมพอดี
   → ต้น update เฟรมถัดไป input สร้าง Set ใหม่ทับ (= ล้าง) · ระบบอื่นห้ามล้างเอง
   🔁 กดซ้ำหลายครั้งก่อนเฟรมถัดไป (เช่น J 3 ครั้งในเฟรมเดียว): pressed ยังเป็น Set ตาม CONTRACT §5
   → ครั้งที่ซ้ำถูก "เลื่อน" ไปเฟรมถัดไป (takePressed) = attack 3 เฟรมติดกัน ไม่หาย (เกมเดิมเรียก attack() ทุก keydown)
   · คลิกพื้นหลายครั้งในเฟรมเดียว = ใช้จุดล่าสุด (คลิกคือ "ไปที่นี่" จุดสุดท้ายคือที่ผู้เล่นตั้งใจ)
   · กดแล้วปล่อยเร็วกว่า 1 เฟรม (แตะปุ่มเดิน/ปุ่มบนจอ) → held ยังเห็น 1 เฟรม (createHeld) = เดิน 1 ก้าว
   ยังไม่ทำ: บทสนทนาเปิดแล้วกินคีย์ทั้งหมด (031:2880) — ทำตอนมีระบบบทสนทนา */
import {
  MOVE_KEYS, RUN_KEYS, RUN_KEY_DEFAULT, ACTION_KEYS, JOY, ACT_BOX, ACT_BUTTONS,
  PAD, PAD_BUTTONS, PAD_DPAD, PAD_RIGHT_STICK,
} from '../data/controls.js';
import { DOUBLE_TAP_MS } from '../data/view.js';
import { screenToWorld } from './camera.js';
import { isCoarse } from './render.js';

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
export function joyVector(dx, dy, R, cfg = JOY, runOn = true) {
  const d = Math.hypot(dx, dy), m = d / R;
  if (m < cfg.deadzone) return { x: 0, y: 0, m, run: false };
  const k = Math.min(1, (m - cfg.deadzone) / (1 - cfg.deadzone)) / Math.max(d, 1e-6);
  return { x: dx * k, y: dy * k, m, run: !!runOn && m > cfg.runAt }; /* runOn = ตั้งค่า joyRun */
}

/* กันซูมเบราว์เซอร์ Ctrl/⌘ + = - 0 — เช็ก e.code (ตำแหน่งปุ่ม) ด้วย เพราะแป้นไทย e.key เป็น ช/ข/จ (113-fix81:55) */
export const ZOOM_CODES = ['Equal', 'Minus', 'Digit0', 'NumpadAdd', 'NumpadSubtract', 'Numpad0'];
export function isZoomKey(e) {
  return !!((e.ctrlKey || e.metaKey) && (ZOOM_CODES.includes(e.code) || /^(=|\+|-|_|0)$/.test(e.key)));
}

/* ย้ายคิวปุ่มเข้าเฟรมนี้: action ละ 1 ครั้งต่อเฟรม · ที่ซ้ำเหลือในคิวไปเฟรมถัดไป (ไม่หาย) */
export function takePressed(queue) {
  const out = new Set(), rest = [];
  for (const a of queue) { if (out.has(a)) rest.push(a); else out.add(a); }
  queue.length = 0; queue.push(...rest);
  return out;
}

/* ปุ่มค้าง: นับว่าใครกดอยู่ (คีย์/นิ้วแต่ละนิ้ว) — ปล่อยเมื่อไม่เหลือใครกด
   ปุ่มที่กดแล้วปล่อยก่อนเฟรมแรกเห็น → ยังนับค้าง 1 เฟรม (late) */
export function createHeld() { return { on: new Map(), fresh: new Set(), late: new Set() }; }
export function heldDown(h, key, src = 'k') {
  let s = h.on.get(key);
  if (!s) { s = new Set(); h.on.set(key, s); h.fresh.add(key); }
  s.add(src);
}
export function heldUp(h, key, src = 'k') {
  const s = h.on.get(key);
  if (!s) return;
  s.delete(src);
  if (s.size) return;
  h.on.delete(key);
  if (h.fresh.has(key)) h.late.add(key);
}
export function heldFrame(h) { /* เรียกครั้งเดียวต่อเฟรม → Set ของปุ่มที่ถือว่าค้างเฟรมนี้ */
  const out = new Set([...h.on.keys(), ...h.late]);
  h.fresh.clear(); h.late.clear();
  return out;
}
export function heldClear(h) { h.on.clear(); h.fresh.clear(); h.late.clear(); }

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
  keys: createHeld(),      /* e.code ที่กดค้าง */
  queue: [],               /* action ที่กดใหม่ รอเข้าเฟรมถัดไป */
  click: null,             /* คลิกที่รอเข้าเฟรมถัดไป */
  touchHeld: createHeld(), /* action จากปุ่มบนจอที่กดค้าง (src = pointerId → สองนิ้วปุ่มเดียว ยกนิ้วเดียวยังค้าง) */
  joy: { on: false, id: null, c: null, x: 0, y: 0, m: 0, run: false },
  pad: {}, padOn: false,
  runKey: RUN_KEY_DEFAULT,
  joySide: JOY.side, joyRun: JOY.run, /* ตั้งค่าผู้เล่น (setJoySide / setJoyRun) */
  shown: null, hintShown: null,       /* ค่า display ล่าสุดที่เขียน → ไม่แตะ DOM ทุกเฟรม */
  el: {},
};

function typing(t) { return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); }
/* ออกจากหน้า: ปล่อยปุ่มค้าง + ทิ้งปุ่ม/คลิกที่กดไว้แต่เฟรมยังไม่ได้อ่าน (ไม่ให้ทำงานตอนกลับมา · 1A-1g N3) */
function releaseAll() {
  heldClear(S.keys); heldClear(S.touchHeld);
  S.queue.length = 0; S.click = null;
  stopJoy();
}

/* ---------- คีย์บอร์ด + กันซูมเบราว์เซอร์ (113-fix81:54–57) ---------- */
function bindKeyboard() {
  addEventListener('keydown', e => {
    /* กันซูมเบราว์เซอร์ Ctrl/⌘ + = - 0 */
    if (isZoomKey(e)) { e.preventDefault(); return; }
    if (typing(e.target)) return;
    const code = e.code;
    if (!isGameKey(code, S.runKey)) return;
    e.preventDefault();
    if (!e.repeat) { const a = keyAction(code); if (a) S.queue.push(a); }
    heldDown(S.keys, code);
  });
  addEventListener('keyup', e => { heldUp(S.keys, e.code); });
  /* ปล่อยทุกปุ่มเมื่อออกจากหน้า — บางเบราว์เซอร์มือถือ/สลับแอปไม่ส่ง blur */
  addEventListener('blur', releaseAll);
  addEventListener('pagehide', releaseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });
  /* กดวิ่ง (Ctrl) ค้างแล้วเผลอ Ctrl+W → ถามก่อนปิดแท็บ (026:19) */
  addEventListener('beforeunload', e => {
    if ([...S.keys.on.keys()].some(c => isRunKey(c, S.runKey))) { e.preventDefault(); e.returnValue = ''; }
  });
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
  /* cancelable=false (เช่น กำลังลากจอยอยู่) → เรียก preventDefault ไม่ได้ ไม่งั้นคอนโซลขึ้น error */
  document.addEventListener('touchmove', e => { if (e.cancelable && e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false }); /* ล้อเมาส์ไม่ซูม (DECISIONS) */
  let lt = 0;
  document.addEventListener('touchend', e => { /* แตะซ้ำ <DOUBLE_TAP_MS นอกปุ่ม = กันซูม (วัดช่วงแตะ ไม่ใช่คูลดาวน์) */
    const n = performance.now();
    if (e.cancelable && n - lt < DOUBLE_TAP_MS && !(e.target && e.target.closest && e.target.closest('input,textarea,select,button,a,[data-act]'))) e.preventDefault();
    lt = n;
  }, { passive: false });
}

/* ---------- คลิกเมาส์บนพื้น (คอมเท่านั้น · 198-click-move) ---------- */
function bindMouse() {
  const cv = document.getElementById('c');
  if (!cv) return;
  cv.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0 || isCoarse()) return;
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
function joyMove(x, y) {
  const j = S.joy, R = JOY.size / 2, dx = x - j.c.x, dy = y - j.c.y;
  j.px = x; j.py = y; /* จำตำแหน่งนิ้วล่าสุด (ใช้ตอนจอเปลี่ยนขนาดกลางลาก) */
  knobAt(dx, dy);
  const v = joyVector(dx, dy, R, JOY, S.joyRun);
  j.x = v.x; j.y = v.y; j.m = v.m; j.run = v.run;
}

/* เว้นขอบ iPhone (รอยบาก/ขีด Home) — index.html ใช้ viewport-fit=cover (เกมเดิม index.html:79 --sl/--sr/--sb) */
const SAFE = side => `env(safe-area-inset-${side}, 0px)`;
const safe = (px, side) => `calc(${px}px + ${SAFE(side)})`;

/* จุดกลางจอยแบบ fixed: มุมล่างฝั่งที่ตั้ง (026:50 joyCenterFixed) */
function fixedC(r) {
  const R = JOY.size / 2, m = JOY.fixedMargin;
  return { x: S.joySide === 'right' ? r.right - m - R : r.left + m + R, y: r.bottom - m - R };
}
function placeBase(c) {
  const r = S.el.zone.getBoundingClientRect(), R = JOY.size / 2;
  S.el.base.style.left = (c.x - r.left - R) + 'px'; S.el.base.style.top = (c.y - r.top - R) + 'px';
}

/* วางพื้นที่จอย/วงใบ้ตามฝั่ง (joySide) · ปุ่มขวาล่างอยู่ที่เดิมเหมือนเกมเดิม (#joyzone.r ย้ายแค่พื้นที่จอย) */
function applySide() {
  const { zone, hint } = S.el;
  if (!zone) return;
  const r = S.joySide === 'right';
  Object.assign(zone.style, r ? { left: 'auto', right: SAFE('right') } : { left: SAFE('left'), right: 'auto' });
  Object.assign(hint.style, r ? { left: 'auto', right: safe(JOY.hintMargin, 'right') } : { left: safe(JOY.hintMargin, 'left'), right: 'auto' });
  reflowJoy();
}

/* จอเปลี่ยนขนาด/หมุน/เปลี่ยนฝั่ง: วางวงจอยใหม่ให้ "วงที่เห็น" กับ "จุดกลางที่ใช้คิดทิศ" ตรงกันเสมอ */
function reflowJoy() {
  const j = S.joy, zone = S.el.zone;
  if (!zone) return;
  const r = zone.getBoundingClientRect(), R = JOY.size / 2;
  if (j.on && j.c) {
    j.c = JOY.mode === 'fixed' ? fixedC(r) : joyCenter(j.c.x, j.c.y, r, R);
    placeBase(j.c); joyMove(j.px, j.py);
  } else if (JOY.mode === 'fixed') placeBase(fixedC(r));
}

function buildTouchUI() {
  const ui = document.getElementById('ui');
  if (!ui) return;
  const wrap = css(div('touch', ui), { position: 'fixed', inset: '0', pointerEvents: 'none', display: 'none' });
  S.el.wrap = wrap;
  /* พื้นที่จอย ล่างซ้าย (หรือขวา) 42%×66% */
  const zone = css(div('joyzone', wrap), {
    position: 'absolute', bottom: SAFE('bottom'), width: JOY.zoneW * 100 + 'vw', height: JOY.zoneH * 100 + 'vh',
    pointerEvents: 'auto', touchAction: 'none',
  });
  const hint = css(div('joyhint', wrap), {
    position: 'absolute', bottom: safe(JOY.hintMargin, 'bottom'), width: JOY.hintSize + 'px', height: JOY.hintSize + 'px',
    borderRadius: '50%', border: '3px dashed rgba(255,255,255,.35)', pointerEvents: 'none', display: 'none',
    alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.55)', font: '700 11px system-ui,"Noto Sans Thai",sans-serif',
  });
  hint.textContent = JOY.hint;
  const base = css(div('joybase', zone), {
    position: 'absolute', width: JOY.size + 'px', height: JOY.size + 'px', borderRadius: '50%', display: 'none',
    boxSizing: 'border-box', /* ขอบ 4px อยู่ในขนาด → กลางวงที่เห็น = จุดกลางที่คิดทิศ (เดิมเลื่อน 4px) */
    border: '4px solid rgba(255,255,255,.45)', background: 'rgba(20,24,36,.35)', opacity: JOY.opacity, pointerEvents: 'none',
  });
  const knob = css(div('joyknob', base), {
    position: 'absolute', left: '50%', top: '50%', width: JOY.size * JOY.knob + 'px', height: JOY.size * JOY.knob + 'px',
    borderRadius: '50%', background: 'rgba(255,255,255,.7)', transform: 'translate(-50%,-50%)',
  });
  Object.assign(S.el, { zone, hint, base, knob });
  zone.addEventListener('pointerdown', e => {
    const j = S.joy;
    if (j.id !== null) return;
    e.preventDefault();
    const r = zone.getBoundingClientRect(), R = JOY.size / 2;
    if (JOY.mode === 'fixed') { const c = fixedC(r); if (Math.hypot(e.clientX - c.x, e.clientY - c.y) > R * JOY.fixedGrab) return; j.c = c; }
    else j.c = joyCenter(e.clientX, e.clientY, r, R);
    j.id = e.pointerId; j.on = true;
    try { zone.setPointerCapture(e.pointerId); } catch (_) {}
    base.style.display = 'block'; placeBase(j.c); joyMove(e.clientX, e.clientY);
  });
  zone.addEventListener('pointermove', e => { if (e.pointerId === S.joy.id) { e.preventDefault(); joyMove(e.clientX, e.clientY); } });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) zone.addEventListener(ev, e => { if (e.pointerId === S.joy.id) stopJoy(); });
  zone.addEventListener('contextmenu', e => e.preventDefault());
  if (JOY.mode === 'fixed') base.style.display = 'block';
  addEventListener('resize', reflowJoy);
  addEventListener('orientationchange', () => setTimeout(reflowJoy, 60));

  /* ปุ่มขวาล่าง (เว้นขอบขวา/ล่างของ iPhone) */
  const box = css(div('acts', wrap), {
    position: 'absolute', right: safe(ACT_BOX.margin, 'right'), bottom: safe(ACT_BOX.margin, 'bottom'),
    width: ACT_BOX.w + 'px', height: ACT_BOX.h + 'px', pointerEvents: 'none',
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
      S.queue.push(b.action); heldDown(S.touchHeld, b.action, e.pointerId);
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(ev, e => heldUp(S.touchHeld, b.action, e.pointerId));
    el.addEventListener('contextmenu', e => e.preventDefault());
    box.appendChild(el);
  }
  S.el.acts = box;
  applySide();
}

/* แสดงปุ่มบนจอเฉพาะเครื่องสัมผัสแนวนอน · เขียน DOM เฉพาะตอนค่าเปลี่ยน */
function touchVisible(G) {
  const w = S.el.wrap;
  if (!w) return;
  const show = isCoarse() && !G.cam.portrait;
  if (S.shown !== show) { S.shown = show; w.style.display = show ? 'block' : 'none'; }
  const hint = show && JOY.mode !== 'fixed' && !S.joy.on;
  if (S.hintShown !== hint) { S.hintShown = hint; S.el.hint.style.display = hint ? 'flex' : 'none'; }
  if (!show && (S.joy.on || S.touchHeld.on.size)) { stopJoy(); heldClear(S.touchHeld); }
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
    const pressed = takePressed(S.queue), held = new Set();
    I.click = S.click; S.click = null;
    /* 2) คีย์บอร์ด (รวมปุ่มที่แตะสั้นกว่า 1 เฟรม) */
    const keys = heldFrame(S.keys);
    let { mx, my } = keyMove(keys);
    let run = [...keys].some(c => isRunKey(c, S.runKey));
    for (const c of keys) { const a = keyAction(c); if (a) held.add(a); }
    /* 3) ปุ่มบนจอ */
    for (const a of heldFrame(S.touchHeld)) held.add(a);
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
    if (G.cam.portrait) { mx = my = 0; run = false; pressed.clear(); held.clear(); I.click = null; S.queue.length = 0; }
    I.mx = mx; I.my = my; I.run = run; I.pressed = pressed; I.held = held;
  },
};

/* ตั้งปุ่มวิ่ง 'ctrl' | 'c' (ระบบตั้งค่าเรียก) */
export function setRunKey(k) { if (RUN_KEYS[k]) S.runKey = k; }

/* ตั้งค่าจอยบนจอ (หน้าตั้งค่าเรียก · spec01 §5 SET.joySide / SET.joyRun) */
export function setJoySide(side) { if (side === 'left' || side === 'right') { S.joySide = side; if (typeof document !== 'undefined') applySide(); } }
export function setJoyRun(on) { S.joyRun = !!on; }
export function joySettings() { return { side: S.joySide, run: S.joyRun, mode: JOY.mode, size: JOY.size }; }
