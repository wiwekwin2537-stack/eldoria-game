/* เทสลำดับวาดของสูง (draw/tiles ผ่าน core/zsort · CONTRACT §1 · ผลตรวจ 1A-2 M2)
   รันใน Node ด้วย document/Image ปลอม · ctx ปลอมจดลำดับภาพที่วาด → เช็กว่าต้นไม้/อาคาร/หลังคา เรียงรวมกับตัวละครอื่น (NPC/มอน) ตาม y */
import world, { enter } from '../src/systems/world.js';
import { drawLayer } from '../src/draw/tiles.js';
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
    const shop = TOWN_ART.src.findIndex(s => /shops\.png/.test(s)); ok(shop >= 0, 'มีภาพร้าน');
    const roof = log.map((e, k) => [e, k]).filter(([e]) => /shops\.png/.test(e.src || '') && Math.abs(e.dy - 239) < 1);
    ok(roof.length >= 1, 'วาดหลังคาร้านอาวุธ (y 239) ' + roof.length);
    const b = log.findIndex(e => e.src === 'BEHIND'), f = log.findIndex(e => e.src === 'FRONT');
    ok(roof.every(([, k]) => k > b), 'หลังคาวาดทับตัวที่อยู่หลังแนว'); ok(roof.every(([, k]) => k < f), 'ตัวที่อยู่หน้าแนววาดทับหลังคา');
  })],
  ['ต้นไม้หน้าตัวเรา (ตัวเราอยู่ในกรอบภาพ หลังฐาน) โปร่ง .4 · ต้นไม้อื่นทึบ', () => withDom(() => {
    const G = scene('town', [13.5, 8.4, 'd']), log = [], ctx = fakeCtx(log); /* ต้นไม้เมือง (396,199,72,90) ฐาน 290 · ตัวเรา (432,269) */
    drawLayer(G, ctx, 'world'); zflush(ctx);
    const t = log.filter(e => /tree-/.test(e.src || '') && Math.abs(e.dy - 199) < 1);
    ok(t.length === 1, 'เจอต้นไม้ (396,199) ' + t.length); eq(t[0].alpha, TREE.fade, 'ต้นไม้หน้าตัวโปร่ง');
    ok(log.filter(e => /tree-/.test(e.src || '') && Math.abs(e.dy - 199) >= 1).every(e => e.alpha === 1), 'ต้นไม้อื่นทึบ');
  })],
];
