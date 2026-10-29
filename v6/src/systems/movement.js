/* movement — ตัวละครเดิน/วิ่ง/พุ่ง/ว่ายน้ำ + คลิกเดิน (spec01 §5 §6 · spec03 ระบบ 8 · DECISIONS 2026-10-30 01:20)
   เจ้าของ G.player: x y dir moving dash anim (CONTRACT §2 · world เขียน x y dir moving ได้เฉพาะตอนเปลี่ยนฉาก)
   - G.player.dash = { t เหลือเวลาพุ่ง, cd คูลดาวน์, iframe อมตะจากพุ่ง, dv ทิศพุ่ง [x,y], since วิตั้งแต่เริ่มพุ่ง, perfect null|{slow,boost} }
   - G.player.anim = { t จังหวะแกว่งแขนขา, run กำลังวิ่ง, swim กำลังว่ายน้ำ, gh ตัวนับเงา, trail [เงาตอนพุ่ง {x,y,dir,l}] } — ให้ draw/hero อ่าน
   - แรง G.player.sp: วิ่งเสีย 3/วิ · พุ่งเสีย 6 · ฟื้นเอง (ยังไม่มีระบบ stats → movement ทำไปก่อน · ดูคำขอใน TASKS)
   ตัวเลขทั้งหมดอยู่ data/movement.js · ชนกำแพงใช้ world.hit ตัวเดียวกับทุกระบบ
   ฟังก์ชันให้ระบบอื่นใช้: dodge(G) (ต่อสู้เรียกตอนจะโดนตี) · clickGoal(G) (HUD/เทสอ่านจุดหมายคลิกเดิน) · stopClick() */
import { T } from '../config.js';
import { emit, on } from '../core/bus.js';
import { zpush } from '../core/zsort.js';
import { hit, tileAt, linkNear, follow } from './world.js';
import { TILE } from '../data/maps.js';
import { MOVE, STAMINA, DASH, SWIM, CLICK, ANIM } from '../data/movement.js';
import { drawHero, heroView } from '../draw/hero.js';

const DIRV = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };

/* สถานะคลิกเดิน (ไม่เซฟ) */
const C = { goal: null, path: null, repath: 0, stk: 0, lx: 0, ly: 0 };
let offEnter = null;

/* ---------- ช่วยเหลือ ---------- */
function ensure(P) {
  const d = P.dash || (P.dash = {});
  d.t = +d.t || 0; d.cd = +d.cd || 0; d.iframe = +d.iframe || 0;
  if (!Array.isArray(d.dv)) d.dv = [0, 1];
  if (!(d.since >= 0)) d.since = 99;
  if (d.perfect === undefined) d.perfect = null;
  if (!P.anim) P.anim = { t: 0, run: false, swim: false, gh: 0, trail: [] };
  if (!Number.isFinite(P.sp)) P.sp = STAMINA.max;
  return P;
}
/* ว่ายน้ำได้ไหม: เฉพาะทุ่งหญ้า และไม่ขี่สัตว์ (spec01 §6) */
export function canSwim(G) { return !!(G.scene && SWIM.kinds.includes(G.scene.kind) && !G.player.mount); }
function opt(G) { return canSwim(G) ? { swim: true } : undefined; }
export function blocked(G, x, y) { return hit(x, y, opt(G), G.scene.map); }
/* ยืนอยู่บนน้ำ (กลางตัว) */
export function inWater(G, x = G.player.x, y = G.player.y) {
  const t = TILE[tileAt(Math.floor(x / T), Math.floor(y / T), G.scene.map)];
  return !!(t && t.swim);
}
/* ตัวคูณความเร็ว (spdMul ชั้นรวม spec01 §6): ตอนนี้มีแค่ว่ายน้ำ ×.62 · พาสซีฟ/สัตว์ขี่/บัฟ = เฟส 3–5 ใส่ตรงนี้ · เพดาน 2.05 */
export function speedMul(G) {
  let m = 1;
  if (canSwim(G) && inWater(G)) m *= SWIM.mul;
  return Math.min(m, MOVE.spdCap);
}
/* วิ่งได้: กดวิ่ง + แรง > 3 (isRun 014:24) */
export function isRunning(G) { return !!(G.input && G.input.run) && G.player.sp > MOVE.runMinSp; }

/* หันหน้า: แกนที่มากกว่า · เท่ากันคงแนวนอนถ้าหันข้างอยู่ (070-core) */
export function faceOf(ix, iy, cur) {
  if (Math.abs(ix) > Math.abs(iy) || (Math.abs(ix) === Math.abs(iy) && (cur === 'l' || cur === 'r'))) return ix < 0 ? 'l' : 'r';
  return iy < 0 ? 'u' : 'd';
}

/* ---------- ชน + ไถลตามกำแพง (moveSlide/slideAxis 031:1570) ---------- */
function slideAxis(G, dx, dy) {
  const P = G.player, sp = Math.abs(dx || dy);
  for (const k of MOVE.slide) for (const s of [-1, 1]) {
    if (dx) {
      if (!blocked(G, P.x + dx, P.y + s * k)) { const m = Math.min(sp, k); if (!blocked(G, P.x, P.y + s * m)) { P.y += s * m; return; } }
    } else if (!blocked(G, P.x + s * k, P.y + dy)) { const m = Math.min(sp, k); if (!blocked(G, P.x + s * m, P.y)) { P.x += s * m; return; } }
  }
}
function slideStep(G, dx, dy) {
  const P = G.player;
  if (dx) { if (!blocked(G, P.x + dx, P.y)) P.x += dx; else if (Math.abs(dy) < Math.abs(dx) * MOVE.slideRatio) slideAxis(G, dx, 0); }
  if (dy) { if (!blocked(G, P.x, P.y + dy)) P.y += dy; else if (Math.abs(dx) < Math.abs(dy) * MOVE.slideRatio) slideAxis(G, 0, dy); }
}
/* ขยับ dx,dy px โดยแบ่งเป็นช่วงละ ≤ MOVE.step (กันทะลุกำแพงตอน dt สูง) · slide=false = ชนทีละแกนไม่ไถล (แบบพุ่งเดิม) */
export function moveBy(G, dx, dy, slide = true) {
  const P = G.player, n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / MOVE.step));
  const sx = dx / n, sy = dy / n;
  for (let i = 0; i < n; i++) {
    if (slide) slideStep(G, sx, sy);
    else { if (sx && !blocked(G, P.x + sx, P.y)) P.x += sx; if (sy && !blocked(G, P.x, P.y + sy)) P.y += sy; }
  }
}
/* ติดในกำแพง → ดันออกจุดว่างใกล้สุด (unstick 027:12) · คืน true ถ้าย้าย */
export function unstick(G) {
  const P = G.player;
  if (!G.scene || !blocked(G, P.x, P.y)) return false;
  const [r0, r1, rs, n] = MOVE.unstick;
  for (let r = r0; r <= r1; r += rs) for (let a = 0; a < n; a++) {
    const x = P.x + Math.cos(a * 2 * Math.PI / n) * r, y = P.y + Math.sin(a * 2 * Math.PI / n) * r;
    if (!blocked(G, x, y)) { P.x = x; P.y = y; return true; }
  }
  return false;
}

/* ---------- พุ่ง (doDash/dashStep 070-core · DECISIONS 2026-10-30 01:20) ---------- */
/* คืน true = เริ่มพุ่ง · 'tired' = แรงไม่พอ · false = ยังพุ่งไม่ได้ */
export function startDash(G) {
  const P = ensure(G.player), D = P.dash, I = G.input || {};
  if (G.paused || D.t > 0 || D.cd > 0 || (P.at >= 0 && P.at !== undefined && P.at !== null) || P.stun > 0) return false;
  if (P.sp < DASH.cost) return 'tired'; /* เกมเดิม tiredMsg — ข้อความเป็นงาน HUD */
  let ix = I.mx || 0, iy = I.my || 0;
  if (!ix && !iy) [ix, iy] = DIRV[P.dir] || DIRV.d;
  const n = Math.hypot(ix, iy) || 1;
  D.dv = [ix / n, iy / n];
  if (Math.abs(ix) > Math.abs(iy)) P.dir = ix < 0 ? 'l' : 'r'; else if (iy) P.dir = iy < 0 ? 'u' : 'd';
  D.t = DASH.time; D.cd = DASH.cd; D.since = 0; D.perfect = null; D.used = false;
  P.sp = Math.max(0, P.sp - DASH.cost);
  P.anim.gh = 0;
  emit('player:dash', { x: P.x, y: P.y, dir: P.dir });
  return true;
}
function dashStep(G, dt) {
  const P = G.player, D = P.dash, step = Math.min(dt, D.t), sp = DASH.speed * step;
  moveBy(G, D.dv[0] * sp, D.dv[1] * sp, false); /* ชนทีละแกน = ไถลตามกำแพง (spec03 ระบบ 8) */
  D.t = Math.max(0, D.t - dt);
  D.iframe = Math.max(D.iframe, DASH.iframeAfter); /* อมตะตลอดพุ่ง + .18 หลังจบ */
  P.anim.t += dt * ANIM.dash;
  P.anim.gh -= dt;
  if (P.anim.gh <= 0) { P.anim.gh = DASH.ghostEvery; P.anim.trail.push({ x: P.x, y: P.y, dir: P.dir, l: DASH.ghostLife }); }
}
/* ต่อสู้ (เฟส 2) เรียกตอนผู้เล่นจะโดนตี → { dodged, perfect }
   dodged = อมตะจากพุ่ง (ไม่ต้องรับดาเมจ) · perfect = โดนภายใน .2 วิแรกของพุ่ง (ครั้งแรกของการพุ่งนั้น)
   ผล perfect: ตั้ง dash.perfect = { slow: .3, boost: 1.3 } + อีเวนต์ player:perfect-dodge
   ⚠️ hook: จอช้าลง (อ่าน dash.perfect.slow) = loop/เฟส 2 · สกิลถัดไป ×1.3 (อ่านแล้วล้าง dash.perfect.boost) = เฟส 3 */
export function dodge(G) {
  const P = ensure(G.player), D = P.dash;
  if (!(D.iframe > 0)) return { dodged: false, perfect: false };
  const perfect = D.since <= DASH.perfect && !D.used;
  if (perfect) {
    D.used = true;
    D.perfect = { slow: DASH.slowmo, boost: DASH.nextSkill };
    emit('player:perfect-dodge', { x: P.x, y: P.y });
  }
  return { dodged: true, perfect };
}

/* ---------- คลิกเดิน (198-click-move · spec01 §5) ---------- */
export function stopClick() { C.goal = C.path = null; C.stk = 0; C.repath = 0; }
export function clickGoal() { return C.goal ? { ...C.goal, path: C.path ? C.path.map(p => [...p]) : null } : null; }
export function setClick(G, wx, wy) {
  stopClick();
  C.goal = { x: wx, y: wy };
  C.lx = G.player.x; C.ly = G.player.y;
}
function inBox(tx, ty, b) { const x = tx + .5, y = ty + .5; return x >= b[0] && x < b[0] + b[2] && y >= b[1] && y < b[1] + b[3]; }
/* ช่องนี้อยู่ในประตูแบบเดิน (เปลี่ยนฉากทันที) — คลิกเดินไม่ผ่าน ยกเว้นคลิกที่ประตูนั้นเอง (เกมเดิมไม่เดินเข้า TOWNGATE) */
function walkLinkAt(map, tx, ty) {
  for (const l of map.links || []) if (l.on === 'walk' && l.box && inBox(tx, ty, l.box)) return l;
  return null;
}
/* BFS รอบตัว (รัศมี 30 ช่อง) → รายการช่องไปเป้า หรือช่องเดินได้ที่ใกล้เป้าที่สุด */
export function pathTo(G, gx, gy) {
  const P = G.player, map = G.scene.map, R = CLICK.radius, [cx, cy] = CLICK.cell;
  const sx = Math.floor(P.x / T), sy = Math.floor(P.y / T), N = R * 2 + 1;
  const id = (x, y) => (y - sy + R) * N + (x - sx + R), inR = (x, y) => Math.abs(x - sx) <= R && Math.abs(y - sy) <= R;
  const goalLink = walkLinkAt(map, gx, gy);
  const walk = (x, y) => !blocked(G, x * T + cx, y * T + cy) && (() => { const l = walkLinkAt(map, x, y); return !l || l === goalLink; })();
  const par = new Int32Array(N * N).fill(-2), q = [sx, sy];
  par[id(sx, sy)] = -1;
  let h = 0, best = [sx, sy], bd = Math.hypot(gx - sx, gy - sy);
  while (h < q.length) {
    const x = q[h++], y = q[h++], dd = Math.hypot(gx - x, gy - y);
    if (dd < bd) { bd = dd; best = [x, y]; }
    if (x === gx && y === gy) break;
    for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + ax, ny = y + ay;
      if (!inR(nx, ny)) continue;
      const j = id(nx, ny);
      if (par[j] !== -2 || !walk(nx, ny)) continue;
      par[j] = id(x, y); q.push(nx, ny);
    }
  }
  const L = [];
  let j = id(best[0], best[1]), g = 0;
  while (j >= 0 && par[j] !== -1 && g++ < 4000) { L.push([sx - R + j % N, sy - R + Math.floor(j / N)]); j = par[j]; }
  return L.reverse();
}
/* ถึงที่หมาย → หันหน้าเข้าจุดที่คลิก แล้ว "ใช้" (เหมือนกด E: ประตู/ร้าน/วงเวท ผ่าน world)
   hook: คุย NPC/เก็บของ = ระบบเฟส 5 (ตอนนี้ world รับเฉพาะทางเข้า-ออก) */
function useHere(G) {
  const P = G.player, g = C.goal;
  stopClick();
  if (!g) return;
  const dx = g.x - P.x, dy = g.y - P.y;
  if (Math.hypot(dx, dy) > 3) P.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'l' : 'r') : (dy < 0 ? 'u' : 'd');
  const l = linkNear(G);
  if (l) follow(l, G);
}
/* 1 เฟรมของคลิกเดิน → ทิศ [ix,iy] หรือ null (ไม่ได้เดินตามคลิก) */
function clickTick(G, dt) {
  if (!C.goal) return null;
  const P = G.player, tx = C.goal.x, ty = C.goal.y;
  if (Math.hypot(tx - P.x, ty - P.y) < CLICK.arrive) { useHere(G); return null; }
  C.repath -= dt;
  if (!C.path || C.repath <= 0) { C.path = pathTo(G, Math.floor(tx / T), Math.floor(ty / T)); C.repath = CLICK.repath; }
  const p = C.path;
  while (p.length && Math.floor(P.x / T) === p[0][0] && Math.floor(P.y / T) === p[0][1]) p.shift();
  const nx = p.length ? p[0][0] * T + CLICK.cell[0] : tx, ny = p.length ? p[0][1] * T + CLICK.cell[1] : ty;
  /* ติดอยู่กับที่นาน → ใช้ตรงนี้ / หาทางใหม่ / หยุด (spec01 §5) */
  const mv = Math.hypot(P.x - C.lx, P.y - C.ly);
  C.lx = P.x; C.ly = P.y;
  if (mv < CLICK.stuckMove && !(P.dash.t > 0)) {
    C.stk += dt;
    if (C.stk > CLICK.stuckUse && !p.length && Math.hypot(tx - P.x, ty - P.y) < CLICK.useNear) { useHere(G); return null; }
    if (C.stk > CLICK.stuckRepath) {
      if (!p.length) { stopClick(); return null; }
      C.path = null;
      if (C.stk > CLICK.stuckStop) { stopClick(); return null; }
    }
  } else C.stk = 0;
  const q = Math.hypot(nx - P.x, ny - P.y) || 1;
  return [(nx - P.x) / q, (ny - P.y) / q];
}

/* ---------- 1 เฟรม ---------- */
export function step(G, dt) {
  if (!G.scene) return;
  const P = ensure(G.player), D = P.dash, A = P.anim, I = G.input || {}, sid = G.scene.id;
  D.cd =Math.max(0, D.cd - dt);
  D.iframe = Math.max(0, D.iframe - dt);
  D.since += dt;
  if (D.perfect) { D.perfect.slow = Math.max(0, D.perfect.slow - dt); if (!D.perfect.slow && !D.perfect.boost) D.perfect = null; }
  for (let i = A.trail.length - 1; i >= 0; i--) { A.trail[i].l -= dt; if (A.trail[i].l <= 0) A.trail.splice(i, 1); }

  if (I.click) setClick(G, I.click.wx, I.click.wy);
  if (I.pressed && I.pressed.has('dash')) startDash(G);

  let ix = I.mx || 0, iy = I.my || 0, am = Math.min(1, Math.hypot(ix, iy));
  if (P.stun > 0) ix = iy = 0;
  if (ix || iy) { if (C.goal) stopClick(); } /* กดเดินเอง = ยกเลิกคลิกเดิน */
  else { const v = clickTick(G, dt); if (v) { [ix, iy] = v; am = 1; } }
  if (!G.scene || G.scene.id !== sid) return; /* useHere อาจเปลี่ยนฉาก */

  const run = isRunning(G);
  let running = false;
  if (D.t > 0) { dashStep(G, dt); P.moving = true; }
  else {
    P.moving = !!(ix || iy);
    if (P.moving) {
      const n = Math.hypot(ix, iy); ix /= n; iy /= n;
      const atk = P.at >= 0 && P.at !== null && P.at !== undefined;
      const sp = (atk ? MOVE.atkMul : 1) * (run && !atk ? MOVE.run : MOVE.walk) * dt * (MOVE.analogMin + (1 - MOVE.analogMin) * am)
        * (P.sp <= 0 ? MOVE.tiredMul : 1) * speedMul(G);
      if (!atk) P.dir = faceOf(ix, iy, P.dir);
      moveBy(G, ix * sp, iy * sp);
      running = run;
      A.t += dt * (run ? ANIM.run : ANIM.walk);
    } else A.t = 0;
  }
  /* แรง (vitalsTick 031:99) */
  if (running) P.sp -= STAMINA.run * dt;
  else if (!(D.t > 0)) P.sp += (P.moving ? STAMINA.regenMove : STAMINA.regenIdle) * dt;
  P.sp = Math.max(0, Math.min(STAMINA.max, P.sp));
  A.run = running;
  A.swim = canSwim(G) && inWater(G);
}

export default {
  id: 'movement',
  init(G) {
    ensure(G.player);
    if (offEnter) offEnter();
    offEnter = on('scene:enter', () => { /* เปลี่ยนฉาก: หยุดพุ่ง/คลิกเดิน ล้างเงา ดันออกจากกำแพง */
      const P = ensure(G.player);
      stopClick(); P.dash.t = 0; P.anim.trail.length = 0; P.anim.t = 0;
      if (G.scene) unstick(G);
    });
  },
  update(G, dt) { step(G, dt); },
  draw(G, ctx, layer) {
    if (layer !== 'world' || !G.scene) return;
    const v = heroView(G);
    zpush(G.player.y, k => drawHero(k, v));
  },
  save(G) {
    const P = G.player;
    if (!G.scene) return undefined;
    return { scene: G.scene.id, x: Math.round(P.x * 10) / 10, y: Math.round(P.y * 10) / 10, dir: P.dir, sp: Math.round(P.sp * 10) / 10 };
  },
  load(G, data) {
    const P = ensure(G.player);
    stopClick();
    P.dash.t = 0; P.dash.cd = 0; P.dash.iframe = 0; P.anim.trail.length = 0;
    if (data && Number.isFinite(+data.sp)) P.sp = Math.max(0, Math.min(STAMINA.max, +data.sp));
    /* ตำแหน่ง: ใช้เมื่อเป็นฉากเดียวกับที่ world โหลด (ไม่งั้น world วางจุดเกิด/หน้าทางเข้าไว้แล้ว) · ตัวละครใหม่ = จุดเกิดของฉาก */
    if (data && G.scene && data.scene === G.scene.id && Number.isFinite(+data.x) && Number.isFinite(+data.y)
      && data.x >= 0 && data.y >= 0 && data.x < G.scene.w && data.y < G.scene.h) {
      P.x = +data.x; P.y = +data.y;
      if (DIRV[data.dir]) P.dir = data.dir;
    }
    if (G.scene) unstick(G);
  },
  _reset() { stopClick(); if (offEnter) { offEnter(); offEnter = null; } }, /* เทสเท่านั้น */
};
