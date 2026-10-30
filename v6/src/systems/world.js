/* world — ฉาก/แมพ · ชนกำแพง · ทางเข้า-ออก (spec01 §4) · เจ้าของ G.scene และ G.player.scene (CONTRACT §2)
   - G.scene = { id, map, w, h (px), tw, th (ช่อง), camOy, floor }
   - ตอนเปลี่ยนฉาก world วางตัวละครที่จุดเกิด (เขียน G.player.x y dir) — นอกจากนั้น x y เป็นของ movement
   - ออกจากดัน/เมือง/ร้าน = กลับไปยืนหน้าทางเข้าที่เดินเข้ามา (DECISIONS 2026-10-30) ด้วยตาราง ret[ฉาก] = จุดหน้าทางเข้า
   ฟังก์ชันให้ระบบอื่นใช้: hit · tileAt · isSolidAt · enter · linkNear · getMap · setChooser */
import { T } from '../config.js';
import { emit } from '../core/bus.js';
import { srvNow } from '../core/time.js';
import { MAPS, TILE, WORLD, MENUS, TOWER, DUNGEON } from '../data/maps.js';
import { drawLayer } from '../draw/tiles.js';

const S = {
  G: null,
  maps: new Map(),   /* id → แมพที่แปลงแถวแล้ว (แคช) */
  ret: {},           /* ฉาก → { scene, x, y, dir } จุดยืนหน้าทางเข้าที่ใช้เข้ามา */
  lock: 0,           /* วิที่ประตูแบบเดิน ยังไม่ทำงานหลังเข้าแมพ */
  chooser: null,     /* core/ui ตั้งได้ (เมนูเลือกปลายทาง) · ไม่มี = เลือกตัวแรก */
};

/* ---------- สุ่มแบบมีเมล็ด + noise (ตามเกมเดิม · ใช้สร้างดันเจี้ยน และ draw/tiles ใช้แต่งพื้น) ---------- */
export { srand, hash, vn } from '../core/rand.js'; /* ย้ายไป core/rand.js (หัวหน้า 30 ต.ค.) · คงชื่อเดิมให้โค้ด/เทสที่อ้าง */
import { srand, hash, vn } from '../core/rand.js';

/* ---------- แปลงแถว RLE → ตารางช่อง ---------- */
export function decodeRow(s) {
  let out = '';
  for (const m of s.matchAll(/(\D)(\d*)/g)) out += m[1].repeat(m[2] ? +m[2] : 1);
  return out;
}
function makeGrid(rows, w, h, id) {
  const g = new Uint8Array(w * h);
  if (rows.length !== h) throw new Error(`แมพ ${id}: มี ${rows.length} แถว ต้องเป็น ${h}`);
  rows.forEach((r, y) => {
    const s = typeof r === 'string' && r.length === w && !/\d/.test(r) ? r : decodeRow(r);
    if (s.length !== w) throw new Error(`แมพ ${id} แถว ${y}: กว้าง ${s.length} ต้องเป็น ${w}`);
    for (let x = 0; x < w; x++) g[y * w + x] = s.charCodeAt(x);
  });
  return g;
}

/* ---------- หาแมพตาม id (แมพคงที่ · หอคอยรายชั้น 'tower:3' · ดันเจี้ยน 'dg:5') ---------- */
export function getMap(id) {
  if (S.maps.has(id)) {
    const m = S.maps.get(id);
    if (!m.round || m.round === dgRound()) return m;
  }
  let m = null;
  const [base, arg] = String(id).split(':');
  if (MAPS[id]) {
    const d = MAPS[id];
    m = { ...d, id, grid: makeGrid(d.rows, d.w, d.h, id) };
  } else if ((base === TOWER.base || base === TOWER.endless) && +arg >= 1) {
    const d = getMap(TOWER.base);
    m = { ...d, id, floor: +arg, kind: base === TOWER.endless ? 'endless' : 'tower', grid: d.grid };
  } else if (base === MENUS.dungeon.scene && +arg >= 1) {
    m = genDungeon(Math.floor(+arg), dgRound());
    for (const k of [...S.maps.keys()]) if (k.startsWith(base + ':') && k !== id) S.maps.delete(k); /* เก็บดันไว้ชั้นเดียว (enterDg 031:2352) */
  }
  if (!m) return null;
  S.maps.set(id, m);
  return m;
}

/* ---------- ดันเจี้ยน (ย้ายจาก genDungeon 031:3204 · ผลเหมือนเกมเดิมเมื่อเมล็ดเดียวกัน) ---------- */
export function dgRound(now = srvNow()) { return Math.floor(now / DUNGEON.roundMs); }
export function genDungeon(f, round) {
  const [, W, H] = DUNGEON.size.find(s => f <= s[0]);
  const [k1, k2, k3, k4] = DUNGEON.seed;
  const R = srand((round * k1 + (f | 0) * k2) * k3 + f * k4), ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const zi = 200 + f; /* เกมเดิมใช้ ZONES[200+f] ใน noise ของห้องถ้ำ */
  const FL = 0, WL = 1, m = [];
  for (let y = 0; y < H; y++) { m[y] = []; for (let x = 0; x < W; x++) m[y][x] = WL; }
  const inb = (x, y) => x > 1 && y > 1 && x < W - 2 && y < H - 2, set = (x, y) => { if (inb(x, y)) m[y][x] = FL; };
  const [cw, ch] = DUNGEON.cell, cols = Math.floor((W - 4) / cw), rows = Math.floor((H - 4) / ch);
  const ox = Math.floor((W - cols * cw) / 2), oy = Math.floor((H - rows * ch) / 2), rooms = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cave = R() < DUNGEON.cave, rw = ri(7, cw - 4), rh = ri(6, ch - 4), x0 = ox + c * cw + ri(1, cw - rw - 1), y0 = oy + r * ch + ri(1, ch - rh - 1);
    const cx = x0 + (rw >> 1), cy = y0 + (rh >> 1), room = { c, r, x0, y0, rw, rh, cx, cy, cave, adj: [] };
    rooms.push(room);
    if (cave) {
      const rx = rw / 2, ry = rh / 2;
      for (let y = y0 - 1; y <= y0 + rh; y++) for (let x = x0 - 1; x <= x0 + rw; x++) {
        const nx = (x - cx) / rx, ny = (y - cy) / ry, n = vn(x / 3.1 + f, y / 3.1 + zi) * .5;
        if (nx * nx + ny * ny < 1 + n * .6 - .15) set(x, y);
      }
    } else for (let y = y0; y < y0 + rh; y++) for (let x = x0; x < x0 + rw; x++) set(x, y);
  }
  const at = (c, r) => rooms.find(q => q.c === c && q.r === r);
  const ent = at(cols >> 1, rows - 1), vis = new Set([ent]), st = [ent], links = [];
  while (st.length) {
    const a = st[st.length - 1], nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => at(a.c + dx, a.r + dy)).filter(b => b && !vis.has(b));
    if (!nb.length) { st.pop(); continue; }
    const b = nb[Math.floor(R() * nb.length)]; vis.add(b); links.push([a, b]); st.push(b);
  }
  for (const a of rooms) for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const b = at(a.c + dx, a.r + dy);
    if (b && R() < DUNGEON.loop && !links.some(([p, q]) => (p === a && q === b) || (p === b && q === a))) links.push([a, b]);
  }
  const carveL = (x, y, w) => { for (let dy = -w; dy <= w; dy++) for (let dx = -w; dx <= w; dx++) set(x + dx, y + dy); };
  for (const [a, b] of links) {
    a.adj.push(b); b.adj.push(a);
    const w = R() < .3 ? 1 : R() < .6 ? 1 : 0; let x = a.cx, y = a.cy; const hf = R() < .5;
    const step = (tx, ty) => { let g = 0; while ((x !== tx || y !== ty) && g++ < 400) { if (x !== tx && (hf || y === ty)) x += Math.sign(tx - x); else if (y !== ty) y += Math.sign(ty - y); carveL(x, y, w); if (R() < .08) carveL(x, y, w + 1); } };
    if (hf) { step(b.cx, a.cy); step(b.cx, b.cy); } else { step(a.cx, b.cy); step(b.cx, b.cy); }
  }
  const dist = new Map([[ent, 0]]), q = [ent];
  while (q.length) { const a = q.shift(); for (const b of a.adj) if (!dist.has(b)) { dist.set(b, dist.get(a) + 1); q.push(b); } }
  let boss = ent;
  for (const [r, d] of dist) if (d > dist.get(boss) || (d === dist.get(boss) && r.r < boss.r)) boss = r;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, [ax, ay] = DUNGEON.arena;
  const arena = { x: clamp(boss.cx, 12, W - 13), y: clamp(boss.cy, 10, H - 11) };
  for (let y = arena.y - ay; y <= arena.y + ay; y++) for (let x = arena.x - ax; x <= arena.x + ax; x++) { const nx = (x - arena.x) / ax, ny = (y - arena.y) / ay; if (nx * nx + ny * ny < 1) set(x, y); }
  carveL(arena.x, arena.y, 0);
  const e = { x: ent.cx, y: Math.min(H - 6, ent.cy) };
  for (let y = e.y - 3; y <= e.y + 3; y++) for (let x = e.x - 3; x <= e.x + 3; x++) set(x, y);
  /* พื้นที่ไปไม่ถึง → ผนัง */
  const seen = new Uint8Array(W * H), qq = [e.y * W + e.x]; seen[qq[0]] = 1;
  while (qq.length) { const i = qq.pop(), x = i % W, y = (i / W) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const j = (y + dy) * W + x + dx; if (!seen[j] && m[y + dy] && m[y + dy][x + dx] === FL) { seen[j] = 1; qq.push(j); } } }
  const grid = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) grid[y * W + x] = (m[y][x] === FL && seen[y * W + x] ? '.' : '#').charCodeAt(0);
  const band = Math.floor((f - 1) / 20);
  return {
    id: 'dg:' + f, n: 'ดันเจี้ยนชั้น ' + f, kind: 'dungeon', w: W, h: H, camOy: .5, floor: f, round, grid,
    look: { floor: 'zone', pal: { ...DUNGEON.pal, ac: DUNGEON.ac[band % 5] }, dark: 1 },
    spawn: [e.x + .5, e.y - .5, 'u'], /* enterZone P=(ent.x, ent.y-1) */
    links: [{ id: 'exit', on: 'use', circle: [e.x + .5, e.y + 2.5, 40], to: '@back' }], /* วงเวท → หน้ารูปปั้นในท้องพระโรง (DECISIONS) */
    arena, rooms: rooms.map(({ c, r, x0, y0, rw, rh, cx, cy, cave }) => ({ c, r, x0, y0, rw, rh, cx, cy, cave })),
    bossRoom: rooms.indexOf(boss), entRoom: rooms.indexOf(ent),
  };
}

/* ---------- ชน ---------- */
export function tileAt(tx, ty, map = S.G && S.G.scene && S.G.scene.map) {
  if (!map || tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return '#';
  return String.fromCharCode(map.grid[ty * map.w + tx]);
}
export function isSolidTile(ch, opt) {
  const t = TILE[ch];
  if (!t) return true;
  if (t.swim && opt && opt.swim) return false;
  return !!t.solid;
}
export function isSolidAt(tx, ty, opt, map) { return isSolidTile(tileAt(tx, ty, map), opt); }
/* ตัวละครที่ (x,y) px ชนไหม — เช็ก 4 มุมแบบเกมเดิม · opt.swim = ว่ายน้ำได้ */
export function hit(x, y, opt, map) {
  for (const [a, b] of WORLD.hitBox) {
    if (isSolidAt(Math.floor((x + a) / T), Math.floor((y + b) / T), opt, map)) return true;
  }
  return false;
}

/* ---------- ทางเข้า-ออก ---------- */
function inBox(x, y, b) { return x >= b[0] * T && x < (b[0] + b[2]) * T && y >= b[1] * T && y < (b[1] + b[3]) * T; }
function linkHits(l, x, y) {
  if (l.box) return inBox(x, y, l.box);
  if (l.circle) return Math.hypot(x - l.circle[0] * T, y - l.circle[1] * T) < l.circle[2];
  return false;
}
/* ทาง 'use' ที่อยู่ในระยะ (ใกล้สุดก่อน) · ระบบอื่น (HUD) ใช้แสดงป้าย "กด E" ได้ */
export function linkNear(G = S.G, on = 'use') {
  const sc = G && G.scene;
  if (!sc) return null;
  const P = G.player;
  let best = null, bd = Infinity;
  for (const l of sc.map.links || []) {
    if (l.on !== on || !linkHits(l, P.x, P.y)) continue;
    const c = l.circle || [l.box[0] + l.box[2] / 2, l.box[1] + l.box[3] / 2];
    const d = Math.hypot(P.x - c[0] * T, P.y - c[1] * T);
    if (d < bd) { bd = d; best = l; }
  }
  return best;
}
function menuOptions(menu) {
  if (Array.isArray(menu)) return menu;
  const M = MENUS[menu];
  if (!M) return [];
  const out = [];
  for (let i = M.from; i <= M.to; i++) out.push(M.scene + ':' + i);
  return out;
}
/* core/ui ตั้งหน้าต่างเลือกปลายทาง: fn(options, link, done) → เรียก done(sceneId) เมื่อเลือก */
export function setChooser(fn) { S.chooser = fn; }

/* ใช้ทางเข้า-ออก (ระบบอื่นเรียกได้ เช่น NPC ผู้นำทาง) · คืน true ถ้าเปลี่ยนฉาก */
export function follow(link, G = S.G) {
  const P = G.player, from = G.scene && G.scene.id;
  if (link.use) { emit('world:use', { id: link.use, scene: from }); return false; }
  if (link.lv && (P.lv || 1) < link.lv) { emit('world:blocked', { link: link.id, lv: link.lv, scene: from }); return false; }
  if (link.menu) {
    const opts = menuOptions(link.menu);
    const go = id => id && follow({ ...link, menu: null, to: id }, G);
    if (S.chooser) { S.chooser(opts, link, go); return false; }
    return !!go(opts[0]);
  }
  if (link.to === '@back') {
    const r = S.ret[from];
    if (r && getMap(r.scene)) { delete S.ret[from]; return enter(r.scene, [r.x, r.y, r.dir], G); }
    return enter(link.home || WORLD.start, link.at, G); /* ไม่รู้ทางกลับ (เช่น โหลดเซฟ) → ฉากสำรอง home หรือเมืองเริ่มต้น */
  }
  if (!getMap(link.to)) { console.warn('[world] ไม่มีแมพ', link.to); return false; }
  const f = link.front || [P.x / T, P.y / T, P.dir];
  if (from) S.ret[link.to] = { scene: from, x: f[0], y: f[1], dir: f[2] || P.dir };
  return enter(link.to, link.at, G);
}

/* เข้าฉาก id ที่จุด at [x,y,ทิศ] (ช่อง) · ไม่ใส่ at = จุดเกิดของฉาก */
export function enter(id, at, G = S.G) {
  const m = getMap(id);
  if (!m) { console.warn('[world] ไม่มีแมพ', id); return false; }
  const from = G.scene ? G.scene.id : null;
  const sp = at || m.spawn;
  G.scene = { id, map: m, w: m.w * T, h: m.h * T, tw: m.w, th: m.h, camOy: m.camOy, floor: m.floor || 0, kind: m.kind };
  const P = G.player;
  P.scene = id;
  P.x = sp[0] * T; P.y = sp[1] * T;
  if (sp[2]) P.dir = sp[2];
  P.moving = false;
  S.lock = WORLD.lock;
  emit('scene:enter', { from, to: id, x: P.x, y: P.y });
  return true;
}

/* ทางกลับที่จำไว้ (ใช้ในเทส/ระบบอื่นอ่าน) */
export function returnPoint(id) { return S.ret[id] ? { ...S.ret[id] } : null; }

export default {
  id: 'world',
  init(G) { S.G = G; if (!G.scene) enter(WORLD.start, null, G); },
  update(G, dt) {
    S.G = G;
    if (!G.scene) return;
    if (S.lock > 0) S.lock -= dt;
    const P = G.player;
    if (S.lock <= 0) {
      for (const l of G.scene.map.links || []) if (l.on === 'walk' && linkHits(l, P.x, P.y)) { follow(l, G); return; }
    }
    if (G.input && G.input.pressed && G.input.pressed.has('interact')) {
      const l = linkNear(G);
      if (l) follow(l, G);
    }
  },
  draw(G, ctx, layer) { if (G.scene) drawLayer(G, ctx, layer); },
  save(G) { return G.scene ? { scene: G.scene.id, ret: S.ret } : undefined; },
  load(G, data) {
    S.G = G;
    if (!data || !data.scene) return;
    S.ret = data.ret && typeof data.ret === 'object' ? { ...data.ret } : {};
    const m = getMap(data.scene);
    if (m && WORLD.persist.includes(m.kind)) { enter(data.scene, null, G); return; }
    const r = S.ret[data.scene]; /* ดัน/หอคอย/ลาน → กลับหน้าทางเข้า */
    if (r && getMap(r.scene)) enter(r.scene, [r.x, r.y, r.dir], G); else enter(WORLD.start, null, G);
  },
  _reset() { S.maps.clear(); S.ret = {}; S.lock = 0; S.chooser = null; }, /* เทสเท่านั้น */
};
