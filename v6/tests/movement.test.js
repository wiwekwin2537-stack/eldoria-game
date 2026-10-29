/* เทสเดิน/วิ่ง/พุ่ง/ว่ายน้ำ/คลิกเดิน + ตัววาดไม่แก้ค่าผู้เล่น (systems/movement + draw/hero)
   spec01 §5 §6 · spec03 ระบบ 8 · DECISIONS 2026-10-30 01:20 (พุ่ง cd 1.0 · อมตะ +.18 · หลบพอดีจังหวะ .2) */
import movement, { step, startDash, dodge, pathTo, clickGoal, unstick } from '../src/systems/movement.js';
import world from '../src/systems/world.js';
import { drawHero, heroView, shade } from '../src/draw/hero.js';
import { _size, zflush } from '../src/core/zsort.js';
import { createState } from '../src/core/state.js';
import { on, _reset } from '../src/core/bus.js';
import { MOVE, DASH, STAMINA, SWIM, CLICK } from '../src/data/movement.js';
import { T } from '../src/config.js';

const ok = (v, m) => { if (!v) throw new Error(m); };
const near = (a, b, e, m) => { if (!(Math.abs(a - b) <= e)) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b} ±${e}`); };

/* แมพทดสอบ: '.' พื้น '#' กำแพง '~' น้ำ · ขอบเป็นกำแพง */
function scene(rows, kind = 'town', links = []) {
  const h = rows.length, w = rows[0].length, grid = new Uint8Array(w * h);
  rows.forEach((r, y) => { for (let x = 0; x < w; x++) grid[y * w + x] = r.charCodeAt(x); });
  return { id: 'test', map: { id: 'test', w, h, grid, links, kind }, w: w * T, h: h * T, tw: w, th: h, kind, floor: 0 };
}
const OPEN = Array.from({ length: 20 }, (_, y) => y === 0 || y === 19 ? '#'.repeat(40) : '#' + '.'.repeat(38) + '#');
function fresh(rows = OPEN, kind, links) {
  _reset(); world._reset(); movement._reset();
  const G = createState();
  world.init(G); movement.init(G);
  G.scene = scene(rows, kind, links); G.player.scene = 'test';
  G.player.x = 5 * T + 16; G.player.y = 5 * T + 16; G.player.dir = 'd';
  return G;
}
const key = (G, mx, my, run = false) => { G.input = { mx, my, run, pressed: new Set(), held: new Set(), click: null }; };
function run(G, secs, dt = 1 / 60, every) { const n = Math.round(secs / dt); for (let i = 0; i < n; i++) { if (every) every(G, i); step(G, dt); if (i === 0) G.input.pressed = new Set(); G.input.click = null; } }

export default [
  ['เดิน 95 px/วิ (spec01 §6)', () => {
    const G = fresh(); key(G, 1, 0); const x0 = G.player.x;
    run(G, 1);
    near(G.player.x - x0, MOVE.walk, .5, 'ระยะเดิน 1 วิ'); ok(G.player.dir === 'r' && G.player.moving, 'หันขวา+กำลังเดิน');
  }],
  ['วิ่ง 170 px/วิ + เสียแรง 3/วิ', () => {
    const G = fresh(); key(G, 0, 1, true); const y0 = G.player.y;
    run(G, 1);
    near(G.player.y - y0, MOVE.run, .5, 'ระยะวิ่ง 1 วิ'); near(G.player.sp, STAMINA.max - STAMINA.run, .1, 'แรงหลังวิ่ง 1 วิ');
    ok(G.player.anim.run, 'anim.run ต้องเป็น true');
  }],
  ['แรง ≤ 3 วิ่งไม่ได้ (เดินแทน) · แรง 0 เดินช้า ×.6 · ยืนนิ่งฟื้น 20/วิ', () => {
    let G = fresh(); G.player.sp = 3; key(G, 1, 0, true); let x0 = G.player.x;
    step(G, .05); near(G.player.x - x0, MOVE.walk * .05, .01, 'แรง 3 = เดิน');
    G = fresh(); G.player.sp = 0; key(G, 1, 0); x0 = G.player.x;
    step(G, .05); near(G.player.x - x0, MOVE.walk * .05 * MOVE.tiredMul, .01, 'แรงหมดเดินช้า');
    G = fresh(); G.player.sp = 50; key(G, 0, 0); run(G, 1);
    near(G.player.sp, 50 + STAMINA.regenIdle, .2, 'ยืนฟื้น 20');
  }],
  ['เดินเฉียงความเร็วเท่าเดิม (ทำให้ยาวเท่ากัน)', () => {
    const G = fresh(); key(G, 1, 1); const x0 = G.player.x, y0 = G.player.y;
    run(G, 1);
    near(Math.hypot(G.player.x - x0, G.player.y - y0), MOVE.walk, .5, 'ระยะเฉียง');
  }],
  ['จอยดันครึ่งเดียว → ความเร็ว ×(.5+.5·.5)', () => {
    const G = fresh(); key(G, .5, 0); const x0 = G.player.x;
    run(G, 1);
    near(G.player.x - x0, MOVE.walk * .75, .5, 'ระยะจอยครึ่ง');
  }],
  ['ชนกำแพงหยุด · dt .05 วิ่งไม่ทะลุกำแพงหนา 1 ช่อง · พุ่งไม่ทะลุ', () => {
    const rows = OPEN.map((r, y) => y > 0 && y < 19 ? r.slice(0, 10) + '#' + r.slice(11) : r);
    const G = fresh(rows); key(G, 1, 0, true);
    run(G, 2, .05);
    ok(G.player.x < 10 * T, 'ทะลุกำแพงช่อง 10 ได้ x=' + G.player.x);
    near(G.player.x, 10 * T - 7, 8.1, 'ยืนชิดกำแพง');
    key(G, 1, 0); G.input.pressed = new Set(['dash']); G.player.dash.cd = 0;
    run(G, .5, .05);
    ok(G.player.x < 10 * T, 'พุ่งทะลุกำแพง x=' + G.player.x);
  }],
  ['เดินเฉียงชนกำแพงตั้ง → ไถลตามกำแพง', () => {
    const rows = OPEN.map((r, y) => y > 0 && y < 19 ? r.slice(0, 8) + '#' + r.slice(9) : r);
    const G = fresh(rows); G.player.x = 8 * T - 8; key(G, 1, 1); const y0 = G.player.y;
    run(G, .5);
    ok(G.player.x < 8 * T - 6.9, 'ไม่เข้ากำแพง');
    ok(G.player.y - y0 > 20, 'ต้องไถลลงตามกำแพง ได้ ' + (G.player.y - y0));
  }],
  ['ชนมุมกำแพง → เลื่อนหลบข้าง (slideAxis)', () => {
    /* กำแพงช่องเดียวที่ (8,5) · ยืนแถว y ชิดขอบล่างของกำแพง แล้วเดินขวาตรงๆ → ต้องเลื่อนหลบลงแล้วผ่านไปได้ */
    const rows = OPEN.map((r, y) => y === 5 ? r.slice(0, 8) + '#' + r.slice(9) : r);
    const G = fresh(rows); G.player.x = 7 * T; G.player.y = 6 * T + 2; key(G, 1, 0);
    run(G, 1);
    ok(G.player.x > 9 * T, 'ต้องผ่านมุมไปได้ x=' + G.player.x);
  }],
  ['พุ่ง: ระยะ ≈73 px · อมตะตลอดพุ่ง +.18 วิ · cd 1.0 วิ · ใช้แรง 6 · ส่ง player:dash', () => {
    const G = fresh(); let ev = null; on('player:dash', d => { ev = d; });
    G.player.dir = 'r'; key(G, 0, 0); G.input.pressed = new Set(['dash']);
    const x0 = G.player.x, dt = 1 / 60;
    step(G, dt); G.input.pressed = new Set();
    ok(ev && ev.dir === 'r', 'ไม่มีอีเวนต์ player:dash'); near(G.player.sp, STAMINA.max - DASH.cost, .01, 'แรงหลังพุ่ง');
    let t = dt, ifEnd = -1;
    while (t < 1.2) { step(G, dt); t += dt; if (ifEnd < 0 && G.player.dash.iframe <= 0) ifEnd = t; if (t > .5 && t < .9 && startDash(G) === true) throw new Error('cd ยังไม่ครบแต่พุ่งได้ t=' + t.toFixed(2)); }
    near(G.player.x - x0, DASH.speed * DASH.time, .5, 'ระยะพุ่ง');
    near(ifEnd, DASH.time + DASH.iframeAfter, 2 * dt + .001, 'อมตะรวม');
    ok(startDash(G) === true, 'ครบ 1.0 วิแล้วต้องพุ่งได้');
  }],
  ['พุ่ง: แรงไม่พอ → tired · ไม่กดทิศ = ทิศที่หัน · กดทิศ = ทิศนั้น', () => {
    let G = fresh(); G.player.sp = 5; key(G, 0, 0);
    ok(startDash(G) === 'tired', 'แรง 5 ต้องพุ่งไม่ได้');
    G = fresh(); G.player.dir = 'u'; key(G, 0, 0); startDash(G);
    ok(G.player.dash.dv[1] === -1, 'ต้องพุ่งขึ้น');
    G = fresh(); G.player.dir = 'u'; key(G, -1, 0); startDash(G);
    ok(G.player.dash.dv[0] === -1 && G.player.dir === 'l', 'ต้องพุ่งซ้ายและหันซ้าย');
  }],
  ['หลบพอดีจังหวะ: โดนภายใน .2 วิแรก = perfect (ครั้งเดียว) · หลังนั้นยังอมตะแต่ไม่ perfect · หมดอมตะ = โดน', () => {
    const G = fresh(); let pe = 0; on('player:perfect-dodge', () => pe++);
    key(G, 1, 0); startDash(G); step(G, .1);
    let r = dodge(G); ok(r.dodged && r.perfect, 'ที่ .1 วิ ต้อง perfect');
    ok(G.player.dash.perfect && G.player.dash.perfect.slow === DASH.slowmo && G.player.dash.perfect.boost === DASH.nextSkill, 'ต้องตั้ง dash.perfect');
    r = dodge(G); ok(r.dodged && !r.perfect, 'ครั้งที่ 2 ไม่ perfect ซ้ำ'); ok(pe === 1, 'อีเวนต์ perfect ครั้งเดียว');
    const G2 = fresh(); key(G2, 1, 0); startDash(G2); step(G2, .05); step(G2, .05); step(G2, .05); step(G2, .05); step(G2, .05); /* .25 วิ */
    r = dodge(G2); ok(r.dodged && !r.perfect, 'ที่ .25 วิ ยังอมตะแต่ไม่ perfect');
    for (let i = 0; i < 4; i++) step(G2, .05); /* .45 วิ */
    r = dodge(G2); ok(!r.dodged, 'เลย .35 วิ ต้องโดน');
  }],
  ['ว่ายน้ำ: ทุ่งหญ้าลงน้ำได้ ช้าลง ×.62 · ในเมืองน้ำคือกำแพง', () => {
    const rows = OPEN.map((r, y) => y > 0 && y < 19 ? r.slice(0, 8) + '~'.repeat(20) + r.slice(28) : r);
    let G = fresh(rows, 'field'); G.player.x = 10 * T; key(G, 1, 0); let x0 = G.player.x;
    run(G, 1);
    near(G.player.x - x0, MOVE.walk * SWIM.mul, .5, 'ความเร็วว่าย'); ok(G.player.anim.swim, 'anim.swim ต้องเป็น true');
    G = fresh(rows, 'field'); G.player.x = 6 * T; key(G, 1, 0); run(G, 1);
    ok(G.player.x > 8 * T, 'ทุ่งหญ้าต้องเดินลงน้ำได้');
    G = fresh(rows, 'town'); G.player.x = 6 * T; key(G, 1, 0); run(G, 1);
    ok(G.player.x < 8 * T, 'ในเมืองน้ำต้องขวาง');
  }],
  ['คลิกเดิน: BFS อ้อมกำแพงไปถึงประตูแบบเดิน → เปลี่ยนฉาก', () => {
    /* กำแพงแนวตั้ง x=10 มีช่องว่างที่ y=15 · ประตูเดิน (box) ที่ (14,5) → town */
    const rows = OPEN.map((r, y) => y > 0 && y < 19 && y !== 15 ? r.slice(0, 10) + '#' + r.slice(11) : r);
    const G = fresh(rows, 'town', [{ id: 'd1', on: 'walk', box: [14, 5, 1, 1], to: 'town' }]);
    world.update(G, 1); /* ปลดล็อกประตูหลังเข้าแมพ */
    let to = null; on('scene:enter', d => { to = d.to; });
    key(G, 0, 0); G.input.click = { wx: 14 * T + 16, wy: 5 * T + 16 };
    for (let i = 0; i < 60 * 15 && !to; i++) { world.update(G, 1 / 60); step(G, 1 / 60); G.input.click = null; }
    ok(to === 'town', 'คลิกประตูแล้วต้องเดินไปถึงและเข้าเมือง');
  }],
  ['คลิกเดิน: ถึงวงเวทแบบกด E → หันหน้า + ใช้เอง', () => {
    const G = fresh(OPEN, 'town', [{ id: 'm', on: 'use', circle: [12.5, 5.5, 40], to: 'town' }]);
    let to = null; on('scene:enter', d => { to = d.to; });
    key(G, 0, 0); G.input.click = { wx: 12.5 * T, wy: 5.5 * T };
    for (let i = 0; i < 60 * 5 && !to; i++) { step(G, 1 / 60); G.input.click = null; }
    ok(to === 'town', 'ถึงวงเวทแล้วต้องใช้เอง');
  }],
  ['คลิกเดิน: ทางเดินไม่ผ่านประตูแบบเดินที่ไม่ได้คลิก', () => {
    /* ประตูเดินกว้างขวางกลางทาง y=5 x=8..9 → ทางต้องอ้อม */
    const G = fresh(OPEN, 'town', [{ id: 'd', on: 'walk', box: [8, 1, 1, 8], to: 'town' }]);
    const p = pathTo(G, 12, 5);
    ok(p.length && p[p.length - 1][0] === 12 && p[p.length - 1][1] === 5, 'ต้องถึงเป้า');
    ok(!p.some(([x, y]) => x === 8 && y >= 1 && y < 9), 'ทางเดินผ่านช่องประตู');
  }],
  ['คลิกเดิน: ติด > .5 วิ ใกล้ < 72 px → ใช้เลย (ประตูในกำแพง)', () => {
    /* วงเวทอยู่ในช่องกำแพง (8,5) ห่างจากช่องเดินได้ใกล้สุด < 72 px */
    const rows = OPEN.map((r, y) => y === 5 ? r.slice(0, 8) + '#' + r.slice(9) : r);
    const G = fresh(rows, 'town', [{ id: 'm', on: 'use', circle: [8.5, 5.5, 50], to: 'town' }]);
    let to = null; on('scene:enter', d => { to = d.to; });
    key(G, 0, 0); G.input.click = { wx: 8.5 * T, wy: 5.5 * T };
    for (let i = 0; i < 60 * 5 && !to; i++) { step(G, 1 / 60); G.input.click = null; }
    ok(to === 'town', 'ต้องใช้ประตูเมื่อติดใกล้ๆ');
  }],
  ['คลิกเดิน: ไปไม่ถึงและไกล → หยุดภายใน ~1.2–2.5 วิ หลังติด', () => {
    const rows = OPEN.map((r, y) => y > 0 && y < 19 ? r.slice(0, 10) + '#' + r.slice(11) : r);
    const G = fresh(rows); key(G, 0, 0); G.input.click = { wx: 20 * T, wy: 5 * T + 16 };
    let stopped = -1;
    for (let i = 0; i < 60 * 8; i++) { step(G, 1 / 60); G.input.click = null; if (!clickGoal()) { stopped = i / 60; break; } }
    ok(stopped > 2 && stopped < 4.5, 'ต้องหยุดเองหลังติด 1.2–2.5 วิ (เดินถึงกำแพง ~1.5 วิ) ได้ ' + stopped); ok(G.player.x < 10 * T, 'ไม่ทะลุกำแพง');
    ok(!G.player.moving || stopped > 0, 'หยุดเดิน');
  }],
  ['คลิกเดิน: กดปุ่มเดิน = ยกเลิกทันที', () => {
    const G = fresh(); key(G, 0, 0); G.input.click = { wx: 20 * T, wy: 5 * T };
    step(G, 1 / 60); G.input.click = null; ok(clickGoal(), 'ต้องมีจุดหมาย');
    G.input.mx = -1; step(G, 1 / 60);
    ok(!clickGoal(), 'กดเดินแล้วต้องยกเลิก'); ok(G.player.dir === 'l', 'เดินตามปุ่ม');
  }],
  ['เซฟ/โหลดตำแหน่ง: ฉากเดียวกันกลับที่เดิม · คนละฉากใช้จุดของ world · ติดกำแพงดันออก', () => {
    let G = fresh(); G.player.x = 300; G.player.y = 200; G.player.dir = 'l'; G.player.sp = 40;
    const s = JSON.parse(JSON.stringify(movement.save(G)));
    const G2 = fresh(); movement.load(G2, s);
    ok(G2.player.x === 300 && G2.player.y === 200 && G2.player.dir === 'l' && G2.player.sp === 40, 'โหลดตำแหน่งไม่ตรง ' + JSON.stringify(s));
    const G3 = fresh(); const x3 = G3.player.x; movement.load(G3, { ...s, scene: 'other' });
    ok(G3.player.x === x3, 'คนละฉากต้องไม่ย้าย');
    const G4 = fresh(); movement.load(G4, { ...s, x: 2, y: 2 }); /* มุมกำแพง */
    ok(!unstick(G4), 'ต้องดันออกจากกำแพงแล้ว (unstick ซ้ำต้องไม่ต้องย้าย)');
    const G5 = fresh(); const x5 = G5.player.x; movement.load(G5, undefined);
    ok(G5.player.x === x5, 'ตัวละครใหม่ = จุดเกิดของฉาก');
  }],
  ['ตัวละครใหม่เกิดที่จุดเกิดเมือง ไม่ติดกำแพง แล้วเดินได้', () => {
    _reset(); world._reset(); movement._reset();
    const G = createState(); world.init(G); movement.init(G);
    ok(G.scene.id === 'town', 'ต้องเริ่มในเมือง');
    near(G.player.x, 7 * T, .01, 'จุดเกิด x'); near(G.player.y, 21.5 * T, .01, 'จุดเกิด y');
    key(G, 0, 1); const y0 = G.player.y; run(G, .5);
    ok(G.player.y - y0 > 40, 'เดินจากจุดเกิดไม่ได้');
  }],
  ['ตัววาด: ไม่แก้ค่าผู้เล่น · ส่งเข้าคิว zpush ตาม y ในชั้น world เท่านั้น · วาดได้ทุกทิศ/พุ่ง/ว่าย/ผู้หญิง/ถือดาบ', () => {
    const G = fresh(); key(G, 1, 0); run(G, .2); startDash(G); step(G, 1 / 60);
    G.player.name = 'ทดสอบ'; G.player.look = { g: 'f', hair: '#a05020' }; G.player.weapon = { kind: 'sword', drawn: true };
    const calls = [];
    const ctx = new Proxy({}, { get: (o, k) => k in o ? o[k] : (k === 'measureText' ? () => ({ width: 30 }) : (...a) => { calls.push(k); }), set: (o, k, v) => { o[k] = v; return true; } });
    const snap = JSON.stringify(G.player);
    movement.draw(G, ctx, 'ground'); movement.draw(G, ctx, 'top'); ok(_size() === 0, 'ต้องไม่วาดชั้นอื่น');
    movement.draw(G, ctx, 'world'); ok(_size() === 1, 'ต้องส่งเข้าคิว 1 ครั้ง');
    zflush(ctx);
    for (const dir of ['u', 'd', 'l', 'r']) for (const swim of [false, true]) {
      const v = heroView(G); v.dir = dir; v.swim = swim; v.moving = true; drawHero(ctx, v); v.dash = null; drawHero(ctx, v);
    }
    ok(calls.includes('fillRect') && calls.includes('fillText'), 'ต้องวาดตัว+ป้ายชื่อ');
    ok(JSON.stringify(G.player) === snap, 'ตัววาดแก้ค่าผู้เล่น');
    ok(shade('#262631', -26) === '#0c0c17', 'สีปกเสื้อ');
  }],
];
