/* เทสลำดับวาดของสูง (draw/tiles ผ่าน core/zsort · CONTRACT §1 · ผลตรวจ 1A-2 M2)
   รันใน Node ด้วย document/Image ปลอม · ctx ปลอมจดลำดับภาพที่วาด → เช็กว่าต้นไม้/อาคาร/หลังคา เรียงรวมกับตัวละครอื่น (NPC/มอน) ตาม y */
import world, { enter } from '../src/systems/world.js';
import { drawLayer, treeCovers } from '../src/draw/tiles.js';
import { zpush, zflush, _size } from '../src/core/zsort.js';
import { TOWN_ART } from '../src/data/maps.js';
import { TREE } from '../src/data/art.js';
import { createState } from '../src/core/state.js';
import { _reset } from '../src/core/bus.js';

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b}`); };
const ok = (v, m) => { if (!v) throw new Error(m); };

/* เบราว์เซอร์ปลอม: ภาพโหลดเสร็จทันที · ctx จด drawImage (ภาพ + y ปลายทาง) และ alpha */
function fakeCtx(log) {
  const st = []; let alpha = 1;
  const noop = () => {};
  return new Proxy({}, {
    get(_, k) {
      if (k === 'drawImage') return (im, ...a) => log.push({ src: im.src, dy: a.length >= 8 ? a[5] : a[1], alpha });
      if (k === 'rotate') return r => log.push({ rot: r });
      if (k === 'save') return () => st.push(alpha);
      if (k === 'restore') return () => { alpha = st.pop() ?? 1; };
      if (k === 'globalAlpha') return alpha;
      if (k === 'createRadialGradient' || k === 'createPattern') return () => ({ addColorStop: noop });
      return noop;
    },
    set(_, k, v) { if (k === 'globalAlpha') alpha = v; return true; },
  });
}
function withDom(fn) {
  const had = 'document' in globalThis, oldImg = globalThis.Image;
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => fakeCtx([]) }) };
  globalThis.Image = class { constructor() { this.naturalWidth = 256; this.naturalHeight = 320; } set src(v) { this._s = v; if (v && this.onload) this.onload(); } get src() { return this._s; } decode() { return { then: f => f() }; } };
  try { return fn(); } finally { if (!had) delete globalThis.document; globalThis.Image = oldImg; }
}
function scene(id, at) {
  _reset(); world._reset(); const G = createState(); world.init(G); enter(id, at, G);
  G.cam = { x: G.player.x - 450, y: G.player.y - 224, vw: 900, vh: 448 }; G.time = { now: 1, dt: 0, frame: 1 };
  return G;
}

export default [
  ['ชั้น world: ของสูงทุกชิ้นส่งเข้าคิว zpush (ไม่วาดตรง) · ชั้น top ไม่วาดอะไร (เลิกแบ่งหน้า/หลังตามตัวเรา)', () => withDom(() => {
    const G = scene('town', [12, 12, 'd']), log = [], ctx = fakeCtx(log);
    drawLayer(G, ctx, 'world');
    ok(_size() > 5, 'ของสูงในเมืองต้องอยู่ในคิว zpush ได้ ' + _size());
    eq(log.length, 0, 'ชั้น world ห้ามวาดตรงก่อน flush');
    drawLayer(G, ctx, 'top'); eq(log.length, 0, 'ชั้น top ต้องไม่วาดของสูง');
    zflush(ctx); ok(log.length > 5, 'flush แล้ววาด');
  })],
  ['NPC/มอน (ไม่ใช่ตัวเรา) ที่ y อยู่ระหว่างต้นไม้ 2 ต้น → วาดหลังต้นที่อยู่ข้างหลัง และก่อนต้นที่อยู่ข้างหน้า', () => withDom(() => {
    const G = scene('field', [20, 20, 'd']), log = [], ctx = fakeCtx(log);
    drawLayer(G, ctx, 'world');
    const npcY = G.player.y + 3 * 32; /* NPC ยืนต่ำกว่าตัวเรา 3 ช่อง — แบบเดิมแบ่งหน้า/หลังตาม y ตัวเรา จะวาดผิด */
    zpush(npcY, () => log.push({ src: 'NPC' }));
    G.player.y = -9999; /* ตัวเราไม่เกี่ยว */
    zflush(ctx);
    const i = log.findIndex(e => e.src === 'NPC'), trees = log.map((e, k) => [e, k]).filter(([e]) => /tree-/.test(e.src || ''));
    ok(trees.length > 3, 'มีต้นไม้ในจอ ' + trees.length);
    const before = trees.filter(([, k]) => k < i).length, after = trees.filter(([, k]) => k > i).length;
    ok(before > 0 && after > 0, `NPC ต้องอยู่ระหว่างต้นไม้ (ก่อน ${before} · หลัง ${after})`);
  })],
  ['หลังคา: ตัวละครใดก็ได้ที่ยืนหลังแนวหลังคาร้านอาวุธ (ฐาน 320) ถูกหลังคาวาดทับ · ยืนหน้าแนว วาดทีหลังหลังคา', () => withDom(() => {
    const G = scene('town', [5.5, 12, 'd']), log = [], ctx = fakeCtx(log);
    drawLayer(G, ctx, 'world');
    zpush(318, () => log.push({ src: 'BEHIND' })); zpush(330, () => log.push({ src: 'FRONT' }));
    zflush(ctx);
    const shop = TOWN_ART.src.findIndex(s => /shops\./.test(s)); ok(shop >= 0, 'มีภาพร้าน');
    const roof = log.map((e, k) => [e, k]).filter(([e]) => /shops\./.test(e.src || '') && Math.abs(e.dy - 239) < 1);
    ok(roof.length >= 1, 'วาดหลังคาร้านอาวุธ (y 239) ' + roof.length);
    const b = log.findIndex(e => e.src === 'BEHIND'), f = log.findIndex(e => e.src === 'FRONT');
    ok(roof.every(([, k]) => k > b), 'หลังคาวาดทับตัวที่อยู่หลังแนว'); ok(roof.every(([, k]) => k < f), 'ตัวที่อยู่หน้าแนววาดทับหลังคา');
  })],
  ['ต้นไม้หน้าตัวเรา (ตัวเราอยู่ในกรอบภาพ หลังฐาน) ค่อย ๆ จางจนเหลือ .4 · ออกมาแล้วค่อย ๆ กลับทึบ · ต้นไม้อื่นทึบ (ผลตรวจ 1A-2f N1)', () => withDom(() => {
    const G = scene('town', [13.5, 8.4, 'd']); /* ต้นไม้เมือง (396,199,72,90) ฐาน 290 · ตัวเรา (432,269) */
    const tree = () => { const log = [], ctx = fakeCtx(log); drawLayer(G, ctx, 'world'); zflush(ctx); return log.filter(e => /tree-/.test(e.src || '') && Math.abs(e.dy - 199) < 1); };
    const frames = n => { let t; for (let i = 0; i < n; i++) { G.time.now += 1 / 30; t = tree(); } return t; };
    G.player.y = 320; frames(5); G.player.y = 269; /* เริ่มจากยืนหน้าต้นไม้ (ทึบ) แล้วเดินเข้าไปหลังต้น */
    const a1 = frames(1)[0].alpha, a3 = frames(2)[0].alpha;
    ok(a1 < 1 && a1 > a3 && a3 > TREE.fade + .05, `ค่อย ๆ จาง ไม่โปร่งทันที (เฟรม 1 = ${a1.toFixed(3)} · เฟรม 3 = ${a3.toFixed(3)})`);
    const t = frames(30);
    ok(t.length === 1, 'เจอต้นไม้ (396,199) ' + t.length); ok(Math.abs(t[0].alpha - TREE.fade) < .01, 'จางจนเหลือ .4 · ได้ ' + t[0].alpha);
    const log = [], ctx = fakeCtx(log); drawLayer(G, ctx, 'world'); zflush(ctx);
    ok(log.filter(e => /tree-/.test(e.src || '') && Math.abs(e.dy - 199) >= 1).every(e => e.alpha === 1), 'ต้นไม้อื่นทึบ');
    G.player.y = 320; /* เดินออกมาหน้าต้นไม้ */
    const b1 = frames(1)[0].alpha; ok(b1 > TREE.fade && b1 < 1, 'ออกมาแล้วค่อย ๆ กลับทึบ ' + b1.toFixed(3));
    ok(Math.abs(frames(30)[0].alpha - 1) < .01, 'กลับทึบเต็ม');
    G.player.y = 269; /* หยุดเกม: เวลาเกมไม่เดิน (G.time.now เท่าเดิม) → ไม่จางต่อ */
    ok(tree()[0].alpha > .99 && tree()[0].alpha > .99, 'เวลาไม่เดิน → ไม่จาง');
  })],
  ['เช็กบังใช้กรอบตัวละคร ไม่ใช่แค่เท้า: เท้าอยู่นอกพุ่ม (34·sc) แต่ตัวทับ → นับว่าบัง (ผลตรวจ 1A-2f N2 · ระยะตามเกมเดิม 1A-4 L3)', () => {
    const rect = [396, 199, 72, 90], base = 290; /* ต้นไม้เมือง sc .9 → พุ่ม ±30.6 · บังเมื่อห่างกลาง < 30.6 + 8 = 38.6 */
    ok(treeCovers({ x: 432, y: 269 }, base, rect), 'ยืนกลางต้นไม้ข้างหลัง');
    ok(treeCovers({ x: 394, y: 269 }, base, rect), 'เท้าเลยขอบพุ่มซ้าย 7 px แต่แขน/ตัวทับต้นไม้ → บัง');
    ok(treeCovers({ x: 470, y: 269 }, base, rect), 'เท้าเลยขอบพุ่มขวา 7 px → บัง');
    ok(!treeCovers({ x: 380, y: 269 }, base, rect), 'ห่างกลาง 52 px → ไม่บัง');
    ok(!treeCovers({ x: 432, y: 300 }, base, rect), 'ยืนหน้าฐานต้นไม้ → ไม่บัง');
    ok(!treeCovers({ x: 432, y: 195 }, base, rect), 'เท้าอยู่เหนือยอดต้นไม้ → ต้นไม้ไม่ทับตัว');
  }],
  ['ระยะซ้าย-ขวาที่ต้นไม้จาง = 34·sc + 8 เท่าเกมเดิม (016-core:70 · ต้นปกติ ±42 px · ผลตรวจ 1A-4 L3 · เดิม v6 ±50)', () => {
    for (const sc of [1, .9, .5, 1.1]) {
      const by = 600, cx = 500, w = TREE.w * sc, h = TREE.h * sc * TREE.lift, rect = [cx - w / 2, by - h, w, h], r = 34 * sc + 8, y = by - 10;
      ok(treeCovers({ x: cx - r + .1, y }, by, rect) && treeCovers({ x: cx + r - .1, y }, by, rect), `sc ${sc}: ห่าง ${(r - .1).toFixed(1)} px → บัง`);
      ok(!treeCovers({ x: cx - r - .1, y }, by, rect) && !treeCovers({ x: cx + r + .1, y }, by, rect), `sc ${sc}: ห่าง ${(r + .1).toFixed(1)} px → ไม่บัง`);
    }
    const w = TREE.w, rect = [460, 600 - 92, w, 92];
    ok(!treeCovers({ x: 500 + 45, y: 590 }, 600, rect), 'ต้นปกติ ห่าง 45 px (เกมเดิมไม่จาง) → ไม่บัง');
  }],
  ['ต้นไม้จางเท่ากันทุก FPS: 30 vs 60 FPS หลัง 0.3 วิ ทึบต่างกันไม่เกิน 1% (1−exp(−dt·10) · ผลตรวจ 1A-4 L4)', () => withDom(() => {
    const G = scene('town', [13.5, 8.4, 'd']); /* ต้นไม้เมือง (396,199) ฐาน 290 */
    const alphaAt = dt => { const log = [], ctx = fakeCtx(log); G.time.now += dt; drawLayer(G, ctx, 'world'); zflush(ctx); return log.find(e => /tree-/.test(e.src || '') && Math.abs(e.dy - 199) < 1).alpha; };
    const run = fps => {
      G.player.y = 320; for (let i = 0; i < 120; i++) alphaAt(1 / 30); /* ยืนหน้าต้นจนทึบเต็ม */
      G.player.y = 269; let a; for (let i = 0; i < Math.round(.3 * fps); i++) a = alphaAt(1 / fps);
      return a;
    };
    const a30 = run(30), a60 = run(60), a144 = run(144);
    ok(a30 < .9 && a60 < .9, `จางจริง (30 FPS ${a30.toFixed(4)} · 60 FPS ${a60.toFixed(4)})`);
    ok(Math.abs(a30 - a60) / a60 < .01, `30 vs 60 FPS ต่าง ${(Math.abs(a30 - a60) / a60 * 100).toFixed(2)}% (ต้อง <1%)`);
    ok(Math.abs(a144 - a60) / a60 < .01, `144 vs 60 FPS ต่าง ${(Math.abs(a144 - a60) / a60 * 100).toFixed(2)}%`);
  })],
  ['ต้นไม้ทุ่งโยกเบา ๆ รอบโคนต้น (มุม ≤ .012 เรเดียน · เปลี่ยนตามเวลา · 024-core:34) · อาคาร/ต้นไม้เมืองไม่หมุน', () => withDom(() => {
    const G = scene('field', [20, 20, 'd']);
    const rots = () => { const log = [], ctx = fakeCtx(log); drawLayer(G, ctx, 'world'); zflush(ctx); return log.filter(e => 'rot' in e).map(e => e.rot); };
    G.player.y = -9999;
    const r1 = rots(); G.time.now += .7; const r2 = rots();
    ok(r1.length > 3, 'ต้นไม้ทุ่งหมุน (โยก) ' + r1.length);
    ok(r1.every(r => Math.abs(r) <= TREE.sway.field.amp + 1e-9), 'มุมโยกไม่เกิน amp');
    ok(r1.some((r, i) => Math.abs(r - r2[i]) > 1e-4), 'มุมเปลี่ยนตามเวลา');
    const T2 = scene('town', [12, 12, 'd']); T2.player.y = -9999;
    const log = [], ctx = fakeCtx(log); drawLayer(T2, ctx, 'world'); zflush(ctx);
    eq(log.filter(e => 'rot' in e).length, 0, 'เมือง 1 ไม่หมุนอะไร');
  })],
];
