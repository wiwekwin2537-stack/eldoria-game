/* เทสโหลดภาพฉาก (draw/tiles · งาน 1Y): ImageBitmap · คืนภาพด้วย close() · Safari เก่าใช้ <img> · เตรียมภาพฉากถัดไปตอนเดินใกล้ประตู
   รันใน Node ด้วย document / fetch / createImageBitmap ปลอม (ไม่มีเบราว์เซอร์) · เบราว์เซอร์จริงดู tests/browser/world.spec.js */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import world, { enter } from '../src/systems/world.js';
import * as tiles from '../src/draw/tiles.js';
import { zflush } from '../src/core/zsort.js';
import { TERRAIN } from '../src/data/art.js';
import { CITY2_ART, MAPS } from '../src/data/maps.js';
import { createState } from '../src/core/state.js';
import { _reset } from '../src/core/bus.js';

const ok = (v, m) => { if (!v) throw new Error(m); };
const tick = () => new Promise(r => setTimeout(r, 0));
const ticks = async (n = 5) => { for (let i = 0; i < n; i++) await tick(); };
const noop = () => {};
const ctx = () => new Proxy({}, { get: (_, k) => (k === 'createPattern' || k === 'createRadialGradient' ? () => ({ addColorStop: noop }) : noop), set: () => true });

/* เบราว์เซอร์ปลอม · mode 'bitmap' = มี createImageBitmap · 'img' = ไม่มี (Safari เก่า) · delay = ถอดรหัสค้างไว้จนกว่าจะปล่อย */
async function withBrowser(mode, fn, { delay = false } = {}) {
  const keep = { document: globalThis.document, Image: globalThis.Image, fetch: globalThis.fetch, cib: globalThis.createImageBitmap };
  const st = { fetched: [], imgs: 0, bitmaps: [], pending: [] };
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: ctx }) };
  globalThis.fetch = async u => { st.fetched.push(String(u)); return { ok: true, status: 200, blob: async () => new Blob([String(u)]) }; };
  globalThis.Image = class { constructor() { st.imgs++; this.naturalWidth = 256; this.naturalHeight = 320; } set src(v) { this._s = v; if (v && this.onload) setTimeout(() => this.onload && this.onload(), 0); } get src() { return this._s; } decode() { return Promise.resolve(); } };
  if (mode === 'bitmap') globalThis.createImageBitmap = blob => {
    const bm = { width: 256, height: 320, closed: false, close() { this.closed = true; this.width = this.height = 0; } };
    st.bitmaps.push(bm);
    return blob.text().then(t => { bm.src = t; return delay ? new Promise(r => st.pending.push(() => r(bm))) : bm; });
  };
  else delete globalThis.createImageBitmap;
  tiles._reset && tiles._reset();
  try { return await fn(st); } finally {
    tiles._reset && tiles._reset();
    for (const [k, v] of Object.entries({ document: keep.document, Image: keep.Image, fetch: keep.fetch, createImageBitmap: keep.cib })) if (v === undefined) delete globalThis[k]; else globalThis[k] = v;
  }
}
function scene(id, at) {
  _reset(); world._reset(); const G = createState(); world.init(G); enter(id, at, G);
  G.cam = { x: G.player.x - 450, y: G.player.y - 224, vw: 900, vh: 448 }; G.time = { now: 1, dt: 0, frame: 1 };
  return G;
}
const go = (G, id, at) => { enter(id, at, G); G.cam = { x: G.player.x - 450, y: G.player.y - 224, vw: 900, vh: 448 }; };
const draw = G => tiles.drawLayer(G, ctx(), 'ground');
const info = () => tiles.cacheInfo();
const peek = s => (tiles.peekImage ? tiles.peekImage(s) : null);

export default [
  ['1X (ผลตรวจ 1Z L1): ทุกภาพที่โค้ด v6 อ้าง (src/ · make-webp.py) ชื่อมีเลขเวอร์ชัน -vN และมีไฟล์จริง (แคช 7 วัน → แก้ภาพต้องเปลี่ยนชื่อ)', () => {
    const V6 = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'), refs = new Set();
    (function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p); else if (/\.(js|json|html)$/.test(f.name)) for (const m of fs.readFileSync(p, 'utf8').matchAll(/v6\/assets\/[\w\-/.]+\.(?:webp|png)/g)) refs.add(m[0]);
    } })(path.join(V6, 'src'));
    for (const m of fs.readFileSync(path.join(V6, 'tools', 'make-webp.py'), 'utf8').matchAll(/'([\w\-]+\/[\w\-.]+\.webp)'/g)) refs.add('v6/assets/' + m[1]);
    ok(refs.size >= 16, 'พบภาพที่อ้าง ' + refs.size);
    const noVer = [...refs].filter(r => !/-v\d+\.(?:webp|png)$/.test(r)), missing = [...refs].filter(r => !fs.existsSync(path.join(V6, '..', r)));
    ok(!noVer.length, 'ชื่อไม่มีเลขเวอร์ชัน: ' + noVer.join(', '));
    ok(!missing.length, 'ไม่มีไฟล์: ' + missing.join(', '));
  }],
  ['ภาพฉากโหลดเป็น ImageBitmap (fetch → createImageBitmap) ไม่ใช้ <img> · วาดครั้งแรกไม่ต้องถอดรหัสในเฟรม (คำขอ 1Z)', () => withBrowser('bitmap', async st => {
    const G = scene('field', [20, 20, 'd']);
    draw(G); await ticks();
    ok(st.fetched.some(u => /terrain-v585\.webp/.test(u)), 'โหลดภาพพื้นทุ่งผ่าน fetch ' + st.fetched.length);
    ok(st.imgs === 0, 'ไม่สร้าง <img> เลย ได้ ' + st.imgs);
    const bm = peek(TERRAIN.src);
    ok(bm && typeof bm.close === 'function' && bm.width === 256, 'ภาพที่เก็บคือ ImageBitmap ' + (bm && bm.constructor && bm.constructor.name));
    ok(info().bitmaps >= 1, 'cacheInfo นับ bitmap ' + info().bitmaps);
  })],
  ['คืนภาพของฉากที่ไม่ได้อยู่เกิน 45 วิ → bitmap.close() (คืนหน่วยความจำทันที) · ภาพฉากปัจจุบันไม่ปิด', () => withBrowser('bitmap', async () => {
    const G = scene('field', [20, 20, 'd']);
    draw(G); await ticks(); draw(G);
    const terrain = peek(TERRAIN.src); ok(terrain && !terrain.closed, 'ภาพพื้นทุ่งพร้อม');
    const before = info().ready;
    go(G, 'town', [22, 17, 'd']); draw(G); await ticks(); draw(G);
    const town = info().ready.filter(s => !before.includes(s)).map(peek); ok(town.length >= 2, 'ภาพเมืองพร้อม ' + town.length);
    G.time.now += 30; draw(G);
    ok(!terrain.closed && info().srcs.includes(TERRAIN.src), 'ยังไม่ถึง 45 วิ → ยังไม่คืน (กติกา 45 วิ เดิม)');
    G.time.now += 20; draw(G);
    ok(terrain.closed === true, 'เกิน 45 วิ → ภาพพื้นทุ่ง close() แล้ว');
    ok(!info().srcs.includes(TERRAIN.src), 'ลบออกจากแคชแล้ว');
    const still = town.filter(b => b && b.closed); ok(!still.length, 'ภาพของเมือง (ฉากปัจจุบัน) ไม่ถูกปิด ' + still.length);
  })],
  ['ภาพถูกคืนระหว่างกำลังถอดรหัส → bitmap ที่มาทีหลังถูก close() ทันที ไม่ค้างในหน่วยความจำ', () => withBrowser('bitmap', async st => {
    const G = scene('field', [20, 20, 'd']);
    draw(G); await ticks(); ok(st.pending.length >= 1, 'กำลังถอดรหัส ' + st.pending.length);
    go(G, 'town', [22, 17, 'd']); G.time.now += 60; draw(G); /* ไปเมืองนานเกิน 45 วิ ก่อนภาพทุ่งถอดรหัสเสร็จ */
    ok(!info().srcs.includes(TERRAIN.src), 'คืนภาพทุ่งแล้ว ' + info().srcs.join());
    st.pending.splice(0).forEach(f => f()); await ticks();
    const tb = st.bitmaps.find(b => /terrain-v585/.test(b.src));
    ok(tb && tb.closed, 'bitmap ภาพทุ่งที่มาหลังถูกคืน → close() ' + (tb && tb.closed));
    ok(!peek(TERRAIN.src), 'ไม่เก็บภาพที่ถูกคืนแล้ว');
  }, { delay: true })],
  ['เบราว์เซอร์ไม่มี createImageBitmap (Safari เก่า) → ใช้ <img> + decode() แบบเดิม วาดได้', () => withBrowser('img', async st => {
    const G = scene('field', [20, 20, 'd']);
    draw(G); await ticks();
    ok(st.imgs >= 1, 'สร้าง <img> ' + st.imgs);
    ok(info().ready.includes(TERRAIN.src), 'ภาพพื้นทุ่งพร้อม ' + JSON.stringify(info().ready));
    const im = peek(TERRAIN.src); ok(im && im.naturalWidth === 256, 'ภาพคือ <img>');
  })],
  ['เดินใกล้วงเวทเรือ (≤5 ช่อง) → โหลด+ถอดรหัสภาพเมือง 2 ไว้ก่อนวาป · อยู่ไกล = ไม่โหลด · ไม่เข้า = คืนตามกติกา 45 วิ', () => withBrowser('bitmap', async () => {
    const want = [...new Set(CITY2_ART.src.concat(CITY2_ART.street))];
    ok(tiles.sceneImages && tiles.sceneImages(MAPS.city2).length === want.length, 'รายชื่อภาพเมือง 2 ครบ');
    const G = scene('road', [60, 12.5, 'r']); /* ไกลจากเรือ (113,11.5) */
    draw(G); await ticks();
    ok(!want.some(s => info().srcs.includes(s)), 'ไกลประตู → ยังไม่โหลดภาพเมือง 2');
    G.player.x = 107 * 32; G.player.y = 12.5 * 32; /* ห่างขอบวง ~4 ช่อง */
    draw(G); await ticks(); draw(G);
    ok(want.every(s => info().ready.includes(s)), 'ใกล้เรือ → ภาพเมือง 2 พร้อมก่อนวาป ' + want.filter(s => !info().ready.includes(s)).join());
    G.player.x = 60 * 32; G.time.now += 50; draw(G); G.time.now += 6; draw(G);
    ok(!want.some(s => info().srcs.includes(s)), 'เดินออกห่างเกิน 45 วิ → คืนภาพเมือง 2 ' + info().srcs.join());
  })],
  ['1X (ผลตรวจ 1Y L3): โหลดภาพพลาดครั้งแรก (เน็ตสะดุด) → ลองใหม่หลัง 2 วิ แล้วได้ภาพ · ก่อนถึงเวลาไม่ยิงซ้ำ · 404 ถาวรยิงแค่ 4 ครั้ง (2·5·15 วิ แล้วเลิก)', () => withBrowser('bitmap', async st => {
    const real = globalThis.fetch, n = {};
    globalThis.fetch = async u => { u = String(u); n[u] = (n[u] || 0) + 1;
      if (/terrain-v585/.test(u) && n[u] === 1) throw new TypeError('network'); /* พลาดครั้งแรกครั้งเดียว */
      if (/tree-\w+-v585/.test(u)) return { ok: false, status: 404 };         /* ต้นไม้ 404 ตลอด */
      return real(u); };
    const cnt = re => Object.entries(n).filter(([u]) => re.test(u)).reduce((a, [, c]) => a + c, 0);
    const G = scene('field', [20, 20, 'd']);
    const at = async t => { G.time.now = t; draw(G); const k = ctx(); tiles.drawLayer(G, k, 'world'); zflush(k); await ticks(); };
    await at(1);
    ok(!peek(TERRAIN.src), 'ครั้งแรกพลาด → ยังไม่มีภาพ');
    await at(2); await at(2.9);
    ok(cnt(/terrain-v585/) === 1, 'ยังไม่ถึง 2 วิ ห้ามยิงซ้ำ ได้ ' + cnt(/terrain-v585/));
    await at(3.1); await at(3.2);
    ok(cnt(/terrain-v585/) === 2, 'ครบ 2 วิ → ลองใหม่ 1 ครั้ง ได้ ' + cnt(/terrain-v585/));
    ok(peek(TERRAIN.src) && peek(TERRAIN.src).width === 256, 'ลองใหม่แล้วได้ภาพพื้นทุ่ง');
    ok(info().ready.includes(TERRAIN.src), 'ภาพพื้นพร้อมวาด (แผ่นพื้นที่วาดสีแทนถูกสร้างใหม่)');
    for (let t = 3.5; t < 120; t += .5) await at(t);
    const trees = Object.entries(n).filter(([u]) => /tree-/.test(u));
    ok(trees.length >= 1 && trees.every(([, c]) => c === 4), '404 ถาวร: ยิงครั้งแรก + ลองใหม่ 3 ครั้ง = 4 ต่อภาพ ได้ ' + JSON.stringify(trees.map(([u, c]) => u.split('/').pop() + ':' + c)));
  })],
  ['1X (ผลตรวจ 1Y L5): sceneImages() จำผลต่อแมพ — เรียกซ้ำได้อาร์เรย์เดิม (ยืนใกล้ประตูไม่สร้างรายการใหม่ทุกเฟรม) · แก้ไม่ได้', () => {
    for (const id of ['city2', 'town', 'field', 'road', 'mist']) {
      const a = tiles.sceneImages(MAPS[id]), b = tiles.sceneImages(MAPS[id]);
      ok(a === b, id + ': ต้องได้อาร์เรย์เดิม'); ok(Object.isFrozen(a), id + ': แช่แข็ง');
    }
    ok(tiles.sceneImages(MAPS.city2).length >= 4, 'รายการเมือง 2 ครบ');
  }],
  ['1X (ผลตรวจ 1Y M1): ภาพที่วาดย่อ/ขยายทุกครั้ง (พื้น · อาคาร · ต้นไม้ · ช่องทุ่ง) ctx ต้องตั้ง imageSmoothingQuality = high (ค่าเริ่มของ canvas = low → ย่อหยาบ)', () => withBrowser('bitmap', async () => {
    const bad = [], seen = new Set();
    const spy = () => { /* canvas ปลอม: เก็บค่า smoothing + save/restore เหมือนจริง · จด drawImage ที่ย่อ/ขยายตอน quality ≠ high */
      let S = { imageSmoothingEnabled: true, imageSmoothingQuality: 'low', globalAlpha: 1 }; const stack = [];
      return new Proxy({}, {
        get(_, k) {
          if (k in S) return S[k];
          if (k === 'save') return () => stack.push({ ...S });
          if (k === 'restore') return () => { if (stack.length) S = stack.pop(); };
          if (k === 'drawImage') return (im, ...a) => {
            if (!im || typeof im.close !== 'function') return; /* แผ่นพื้นที่สร้างเอง (canvas) วาด 1:1 */
            const [sw, sh, dw, dh] = a.length >= 8 ? [a[2], a[3], a[6], a[7]] : a.length >= 4 ? [im.width, im.height, a[2], a[3]] : [1, 1, 1, 1];
            if (Math.abs(sw - dw) < .01 && Math.abs(sh - dh) < .01) return;
            seen.add(im.src);
            if (!(S.imageSmoothingEnabled && S.imageSmoothingQuality === 'high')) bad.push(String(im.src).split('/').pop() + ' ' + sw + '→' + dw);
          };
          if (k === 'createPattern' || k === 'createRadialGradient' || k === 'createLinearGradient') return () => ({ addColorStop: () => {} });
          return () => {};
        },
        set(_, k, v) { if (k in S) S[k] = v; return true; },
      });
    };
    globalThis.document = { createElement: () => { const c = { width: 0, height: 0, _k: null }; c.getContext = () => c._k || (c._k = spy()); return c; } };
    for (const [id, at] of [['field', [20, 20, 'd']], ['town', [22, 17, 'd']], ['city2', null], ['road', null], ['mist', null]]) {
      const G = scene(id, at);
      for (let i = 0; i < 3; i++) { G.time.now += .1; const k = spy(); tiles.drawLayer(G, k, 'ground'); tiles.drawLayer(G, k, 'world'); zflush(k); await ticks(); }
    }
    ok(seen.size >= 4, 'ต้องเจอภาพที่วาดย่อหลายแบบ ' + [...seen].join());
    ok(!bad.length, 'วาดย่อ/ขยายตอน quality ไม่ใช่ high: ' + [...new Set(bad)].slice(0, 6).join(' · '));
  })],
  ['make-webp.py จดรุ่น Pillow/libwebp ที่ใช้สร้างภาพ และเตือนเมื่อรุ่นไม่ตรง (ผลตรวจ 1A-4 L5)', () => {
    const src = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'tools', 'make-webp.py'), 'utf8');
    const head = src.slice(0, 1500);
    ok(/Pillow 12\.3\.0/.test(head) && /libwebp 1\.6\.0/.test(head), 'หัวไฟล์ต้องมี Pillow 12.3.0 · libwebp 1.6.0');
    ok(/features\.version\(['"]webp['"]\)/.test(src) && /PIL\.__version__|__version__/.test(src), 'สคริปต์เช็กรุ่นตอนรัน');
    /* 1X (ผลตรวจ 1Y L4): บรรทัดแรกที่บอก "ผลเหมือนเดิมทุกครั้ง" ต้องบอกเงื่อนไขรุ่นในบรรทัดเดียวกัน (ไม่ขัดกับคำเตือนด้านล่าง) */
    const first = src.split('\n').find(l => /ผลเหมือนเดิม/.test(l));
    ok(first && /เฉพาะ Pillow 12\.3\.0 \/ libwebp 1\.6\.0/.test(first), 'บรรทัด "ผลเหมือนเดิม" ต้องบอก (เฉพาะ Pillow 12.3.0 / libwebp 1.6.0): ' + first);
  }],
];
