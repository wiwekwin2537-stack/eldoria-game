/* tiles — วาดฉาก: พื้น → (ระบบอื่นวาดตัวละคร) → ของสูงเรียงตาม y (spec01 §3 ลำดับชั้น)
   - พื้นวาดเป็นแผ่น 512×512 px เก็บไว้ (ไม่สร้างภาพทั้งแมพ · มือถือไม่กินหน่วยความจำ) · แผ่น/ภาพที่ไม่ได้ใช้เกิน 45 วิ คืนหน่วยความจำ (fix157)
   - ภาพโหลดตอนต้องใช้เท่านั้น ไม่ฝัง base64 · ภาพยังไม่มา = วาดสีแทน แล้ววาดใหม่เมื่อภาพมาถึง
   - กติกาภาพ (spec01 §10): ใช้ภาพเฉพาะ พื้น · อาคาร · ต้นไม้ · ของตกแต่งฉาก — อย่างอื่นวาดด้วยโค้ด
   - ของสูง (อาคาร ต้นไม้ เสาไฟ): ฐานอยู่เหนือตัวเรา → วาดชั้น 'world' (ก่อนตัวละคร) · ฐานอยู่ใต้ตัวเรา → ชั้น 'top' (บังตัวละคร) */
import { T } from '../config.js';
import { WORLD, TOWN_FLOOR, TOWN_ART, CITY2_ART, ROOM } from '../data/maps.js';
import { hash, vn } from '../systems/world.js';

const CH = WORLD.chunk;
const TREE_SRC = {
  oak: 'assets/incoming/tree-oak-v585.png', ancient: 'assets/incoming/tree-ancient-v585.png',
  fire: 'assets/incoming/tree-fire-v585.png', spirit: 'assets/incoming/tree-spirit-v585.png',
}; /* TREEART 013:30 */
const TERRAIN = 'assets/incoming/terrain-v585.png'; /* WORLDART.tile 012-world-art */

const IMG = new Map();   /* src → { img, ok, bad, used } */
const CHUNK = new Map(); /* 'ฉาก|cx,cy' → { cv, used, miss } */
let clock = 0, lastSweep = 0;

/* ---------- ภาพ ---------- */
function url(src) { return new URL('../../../' + src, import.meta.url).href; }
export function image(src) {
  let e = IMG.get(src);
  if (!e) {
    e = { img: new Image(), ok: false, bad: false, used: clock };
    e.img.decoding = 'async';
    e.img.onload = () => { e.ok = e.img.naturalWidth > 0; dropMissing(); };
    e.img.onerror = () => { e.bad = true; };
    e.img.src = url(src);
    IMG.set(src, e);
  }
  e.used = clock;
  return e.ok ? e.img : null;
}
function dropMissing() { for (const [k, c] of CHUNK) if (c.miss) { free(c); CHUNK.delete(k); } }
function free(c) { c.cv.width = c.cv.height = 0; }

/* คืนหน่วยความจำ: แผ่นพื้น/ภาพที่ไม่ได้ใช้เกิน artTtl วิ */
function sweep() {
  if (clock - lastSweep < 5) return;
  lastSweep = clock;
  const ttl = WORLD.artTtl;
  for (const [k, c] of CHUNK) if (clock - c.used > ttl) { free(c); CHUNK.delete(k); }
  for (const [k, e] of IMG) if (clock - e.used > ttl) { e.img.onload = e.img.onerror = null; e.img.src = ''; IMG.delete(k); }
}
export function cacheInfo() { return { chunks: CHUNK.size, images: IMG.size, clock }; } /* เทส */

/* ---------- สีช่วย ---------- */
const rgb = a => 'rgb(' + (a[0] | 0) + ',' + (a[1] | 0) + ',' + (a[2] | 0) + ')';
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function ch(map, x, y) { return x < 0 || y < 0 || x >= map.w || y >= map.h ? '#' : String.fromCharCode(map.grid[y * map.w + x]); }

/* ---------- ภาพจากตารางข้อมูล [ภาพ, sx,sy,sw,sh, dx,dy,dw,dh, กรอบตัด?] ---------- */
function op(k, src, o) {
  const im = image(src[o[0]]);
  if (!im) return false;
  if (o[9]) { k.save(); k.beginPath(); k.rect(o[9][0], o[9][1], o[9][2], o[9][3]); k.clip(); }
  k.drawImage(im, o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8]);
  if (o[9]) k.restore();
  return true;
}
const hits = (o, x0, y0, x1, y1) => o[5] < x1 && o[5] + o[7] > x0 && o[6] < y1 && o[6] + o[8] > y0;

/* ---------- ผู้วาดพื้นแต่ละแบบ (look.floor) — วาดช่อง x0..x1, y0..y1 ลง k (พิกัดโลก) · คืน false ถ้ามีภาพยังไม่มา ---------- */
const FLOOR = {
  /* ทุ่ง: ช่องจากภาพ terrain (buildGround 031:818) */
  terrain(k, map, x0, y0, x1, y1) {
    const im = image(TERRAIN), L = map.look.tiles;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const c = ch(map, x, y), n = L[c] ?? 0;
      if (im) k.drawImage(im, (n % 4) * 128, Math.floor(n / 4) * 128, 128, 128, x * T, y * T, T, T);
      else { k.fillStyle = c === '~' ? '#3a7ab0' : c === ':' ? '#d8c890' : '#5a9a48'; k.fillRect(x * T, y * T, T, T); }
      if (c === 'W') { /* หินวาร์ป (วาดด้วยโค้ด) */
        const cx = x * T + 16, cy = y * T + 18;
        k.fillStyle = '#6a6a7a'; k.beginPath(); k.ellipse(cx, cy, 12, 9, 0, 0, 7); k.fill();
        k.fillStyle = '#9ad8ff'; k.beginPath(); k.ellipse(cx, cy - 2, 6, 4, 0, 0, 7); k.fill();
      }
    }
    return !!im;
  },
  /* เมือง 1: ลายพื้น 4 แบบจากภาพ ground-v538 (TOWNFLOOR 012-town-floor) */
  town(k, map, x0, y0, x1, y1) {
    const im = image(TOWN_FLOOR.src);
    const F = TOWN_FLOOR, road = (x, y) => F.roads.some(r => x >= r[0] && x < r[0] + r[2] && y >= r[1] && y < r[1] + r[3]);
    const inR = (x, y, r) => x >= r[0] && x < r[0] + r[2] && y >= r[1] && y < r[1] + r[3];
    let pat = null;
    if (im) {
      pat = {};
      const w = im.naturalWidth / 2, h = im.naturalHeight / 2;
      for (const [kind, q] of Object.entries(F.quad)) {
        const c = document.createElement('canvas'); c.width = c.height = F.size;
        c.getContext('2d').drawImage(im, q[0] * w, q[1] * h, w, h, 0, 0, F.size, F.size);
        pat[kind] = k.createPattern(c, 'repeat');
      }
    }
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const kind = inR(x, y, F.marble) ? 'marble' : inR(x, y, F.earth) ? 'earth' : road(x, y) ? 'stone' : 'grass';
      k.fillStyle = pat ? pat[kind] : { stone: '#a89a86', grass: '#5a8a3e', earth: '#8a6a44', marble: '#d8d4cc' }[kind];
      k.fillRect(x * T, y * T, T, T);
    }
    k.fillStyle = F.edge; /* ขอบหินตามถนน */
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (road(x, y)) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (x + dx < 0 || y + dy < 0 || x + dx >= map.w || y + dy >= map.h || road(x + dx, y + dy)) continue;
      if (dx) k.fillRect(x * T + (dx > 0 ? T - 2 : 0), y * T, 2, T); else k.fillRect(x * T, y * T + (dy > 0 ? T - 2 : 0), T, 2);
    }
    return !!im;
  },
  /* ห้องในร้าน (วาดด้วยโค้ด) */
  room(k, map, x0, y0, x1, y1) {
    const P = map.look.shop === 'hall' ? { ...ROOM, ...ROOM.hall } : ROOM;
    zoneTiles(k, map, x0, y0, x1, y1, P, null);
    if (P.carpet) { k.fillStyle = P.carpet; k.fillRect(12 * T, 3 * T, 2 * T, (map.h - 4) * T); }
    return true;
  },
  /* เหมือง/ดัน/หอคอย/ลาน (paintZone 031:961) */
  zone(k, map, x0, y0, x1, y1) {
    let pal = map.look.pal;
    if (map.look.floors && map.floor) { const f = map.look.floors[(map.floor - 1) % map.look.floors.length]; pal = { ...pal, fl: [f[0], f[0], f[1]], top: f[1], ac: f[2] }; }
    return zoneTiles(k, map, x0, y0, x1, y1, pal, map.look.tile);
  },
  /* ป่า (natPaint16 048-fix17 แบบย่อ) */
  nature(k, map, x0, y0, x1, y1) {
    natureGround(k, map, x0, y0, x1, y1);
    return true;
  },
  /* ถนนตะวันออก (171-fix144 แบบย่อ): หญ้า + ทางดิน + ทะเลฝั่งท่าเรือ */
  road(k, map, x0, y0, x1, y1) {
    natureGround(k, map, x0, y0, x1, y1);
    const L = map.look;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (x >= L.sea[0] && ch(map, x, y) === '#' && y > 1 && y < map.h - 2) { k.fillStyle = (x + y) & 1 ? '#2a74aa' : '#22689c'; k.fillRect(x * T, y * T, T, T); continue; }
      if (ch(map, x, y) !== '#' && Math.abs(y - roadY(x, L.path)) <= 1) { k.fillStyle = (hash(x, y) > .5 ? L.pathC : L.pathD); k.fillRect(x * T, y * T, T, T); }
    }
    return true;
  },
  /* เมือง 2: ถนนจากภาพ ground-v558 · พื้นอื่นสีตามชนิด (build98 130-fix98:117) */
  city2(k, map, x0, y0, x1, y1) {
    const im = image(CITY2_ART.street), C = CITY2_ART.colors, G = map.groundGrid;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const g = G ? String.fromCharCode(G[y * map.w + x]) : 'l';
      if (g === 's' && im) { const px = x * T, py = y * T; k.drawImage(im, px % 384, py % 384, T, T, px, py, T, T); continue; }
      const c = C[g] || C.l; k.fillStyle = c[hash(x * 1.3, y * 2.7) > .5 ? 1 : 0]; k.fillRect(x * T, y * T, T, T);
    }
    return !!im;
  },
};
function roadY(x, p) { /* roadY 171-fix144 · sm = smoothstep */
  const sm = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  return Math.round(p.y + p.amp * sm((x - p.x0) / p.ramp) * sm((p.x1 - x) / p.ramp) * Math.sin(x / p.period));
}

function zoneTiles(k, map, x0, y0, x1, y1, p, tile) {
  const im = tile != null ? image(TERRAIN) : null, solid = c => c === '#';
  k.fillStyle = p.vd || '#000'; k.fillRect(x0 * T, y0 * T, (x1 - x0 + 1) * T, (y1 - y0 + 1) * T);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const c = ch(map, x, y), px = x * T, py = y * T, h = hash(x * 1.3, y * 2.7);
    if (!solid(c)) {
      if (im) k.drawImage(im, (tile % 4) * 128, Math.floor(tile / 4) * 128, 128, 128, px, py, T, T);
      else { k.fillStyle = p.fl[Math.floor(h * p.fl.length) % p.fl.length]; k.fillRect(px, py, T, T); }
      k.fillStyle = 'rgba(0,0,0,.08)'; k.fillRect(px + (h * 20 | 0), py + (h * 97 % 20 | 0), 6, 4);
      k.fillStyle = 'rgba(255,255,255,.05)'; k.fillRect(px + ((h * 53) % 24 | 0), py + ((h * 31) % 24 | 0), 4, 3);
      if (c === 'o') { /* แร่ (วาดแบบง่าย · ระบบขุดแร่เฟส 4 วาดเอง) */
        k.fillStyle = '#5a5a66'; k.beginPath(); k.ellipse(px + 16, py + 20, 11, 8, 0, 0, 7); k.fill();
        k.fillStyle = p.ac || '#c8c8d8'; k.fillRect(px + 12, py + 15, 4, 3); k.fillRect(px + 18, py + 19, 3, 3);
      }
      continue;
    }
    const below = !solid(ch(map, x, y + 1)) && y + 1 < map.h;
    k.fillStyle = p.top; k.fillRect(px, py, T, T);
    k.fillStyle = 'rgba(255,255,255,.06)'; k.fillRect(px + 2 + (h * 12 | 0), py + 3, 10, 6);
    if (below) {
      k.fillStyle = p.face; k.fillRect(px, py + T - 12, T, 12);
      k.fillStyle = p.edge; k.fillRect(px, py + T - 12, T, 2);
      k.fillStyle = 'rgba(0,0,0,.35)'; k.fillRect(px, py + T, T, 5);
    }
    if (y > 0 && !solid(ch(map, x, y - 1))) { k.fillStyle = p.edge; k.fillRect(px, py, T, 2); }
    if (!solid(ch(map, x - 1, y))) { k.fillStyle = p.edge; k.fillRect(px, py, 2, T); }
    if (!solid(ch(map, x + 1, y))) { k.fillStyle = p.edge; k.fillRect(px + T - 2, py, 2, T); }
  }
  return tile == null || !!im;
}

function natureGround(k, map, x0, y0, x1, y1) {
  const L = map.look, G = L.g, sd = (map.w * 7 + map.h) * .1;
  for (let py = y0 * T; py < (y1 + 1) * T; py += 8) for (let px = x0 * T; px < (x1 + 1) * T; px += 8) {
    const n1 = vn(px / 150 + sd, py / 150 + 3), n2 = vn(px / 40 + sd * 2, py / 40 + 11), n3 = hash(px * .37, py * .71);
    let c = mix(G[0], G[1], n1); c = mix(c, G[2], Math.max(0, n2 - .55) * 1.6); c = mix(c, G[3], Math.max(0, .35 - n2) * 1.2);
    const j = (n3 - .5) * 7; k.fillStyle = rgb([c[0] + j, c[1] + j, c[2] + j]); k.fillRect(px, py, 8, 8);
  }
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const c = ch(map, x, y), px = x * T, py = y * T, h = hash(x * 2.1, y * 1.7);
    if (c === 'w') { k.fillStyle = L.liq ? L.liq[(x + y) & 1] : '#3a7ab0'; k.fillRect(px, py, T, T); if (h > .8) { k.fillStyle = L.liq ? L.liq[2] : '#fff'; k.fillRect(px + (h * 20 | 0), py + 10, 6, 2); } }
    else if (c === 'p') { k.fillStyle = h > .5 ? L.path : L.pathD; k.fillRect(px + 2, py + 2, T - 4, T - 4); }
    else if (c === 'b') { k.fillStyle = '#7a5a3a'; k.fillRect(px, py, T, T); k.fillStyle = '#5a3e26'; for (let i = 4; i < T; i += 8) k.fillRect(px, py + i, T, 2); }
    else if (c === 'L') { k.fillStyle = 'rgba(0,0,0,.45)'; k.fillRect(px, py, T, T); }
    else if (c === 'F' || c === '#') { k.fillStyle = 'rgba(0,0,0,.22)'; k.fillRect(px, py, T, T); }
    else if (c === 'r') { k.fillStyle = 'rgba(0,0,0,.25)'; k.beginPath(); k.ellipse(px + 16, py + 26, 14, 5, 0, 0, 7); k.fill(); k.fillStyle = '#7a7a82'; k.beginPath(); k.ellipse(px + 16, py + 18, 13, 11, 0, 0, 7); k.fill(); k.fillStyle = '#9a9aa4'; k.beginPath(); k.ellipse(px + 12, py + 14, 6, 4, 0, 0, 7); k.fill(); }
  }
}

/* ---------- แผ่นพื้น ---------- */
function chunkKey(sc, cx, cy) { return sc.id + '|' + cx + ',' + cy; }
function buildChunk(sc, cx, cy) {
  const map = sc.map, cv = document.createElement('canvas');
  cv.width = cv.height = CH;
  const k = cv.getContext('2d');
  k.translate(-cx * CH, -cy * CH);
  const x0 = Math.floor(cx * CH / T), y0 = Math.floor(cy * CH / T);
  const x1 = Math.min(map.w - 1, Math.floor(((cx + 1) * CH - 1) / T)), y1 = Math.min(map.h - 1, Math.floor(((cy + 1) * CH - 1) / T));
  const fn = FLOOR[map.look && map.look.floor] || FLOOR.zone;
  let ok = fn(k, map, x0, y0, x1, y1) !== false;
  const art = artOf(map);
  if (art) {
    const X0 = cx * CH, Y0 = cy * CH;
    for (const o of art.ground) if (hits(o, X0, Y0, X0 + CH, Y0 + CH)) ok = op(k, art.src, o) && ok;
  }
  return { cv, used: clock, miss: !ok };
}
function artOf(map) { return map.look && map.look.art === 'town' ? TOWN_ART : map.look && map.look.art === 'city2' ? CITY2_ART : null; }

function drawGround(G, ctx) {
  const sc = G.scene, c = G.cam, map = sc.map;
  if (map.look && map.look.floor === 'city2' && !map.groundGrid && map.ground) map.groundGrid = groundGrid(map);
  ctx.fillStyle = (map.look && map.look.pal && map.look.pal.vd) || '#0b0f16';
  ctx.fillRect(c.x, c.y, c.vw, c.vh);
  const cx0 = Math.max(0, Math.floor(c.x / CH)), cy0 = Math.max(0, Math.floor(c.y / CH));
  const cx1 = Math.min(Math.ceil(sc.w / CH) - 1, Math.floor((c.x + c.vw) / CH)), cy1 = Math.min(Math.ceil(sc.h / CH) - 1, Math.floor((c.y + c.vh) / CH));
  for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
    const key = chunkKey(sc, cx, cy);
    let chk = CHUNK.get(key);
    if (!chk) { chk = buildChunk(sc, cx, cy); CHUNK.set(key, chk); }
    chk.used = clock;
    ctx.drawImage(chk.cv, cx * CH, cy * CH);
  }
}
function groundGrid(map) { /* แถวชนิดพื้นเมือง 2 (RLE) → ตาราง */
  const g = new Uint8Array(map.w * map.h);
  map.ground.forEach((r, y) => { let s = ''; for (const m of r.matchAll(/(\D)(\d*)/g)) s += m[1].repeat(m[2] ? +m[2] : 1); for (let x = 0; x < map.w; x++) g[y * map.w + x] = s.charCodeAt(x); });
  return g;
}

/* ---------- ของสูงเรียงตาม y ---------- */
function treeAt(k, src, bx, by, sc, alpha) {
  const im = image(src);
  const w = 80 * sc, h = 100 * sc;
  if (!im) { k.fillStyle = 'rgba(30,70,30,.9)'; k.beginPath(); k.ellipse(bx, by - h * .6, w * .4, h * .35, 0, 0, 7); k.fill(); return; }
  if (alpha < 1) { k.save(); k.globalAlpha = alpha; }
  k.drawImage(im, 0, 0, im.naturalWidth, im.naturalHeight, bx - w / 2, by - h * .92, w, h);
  if (alpha < 1) k.restore();
}
/* เรียกทุกของสูงที่อยู่ในจอ: fn(ฐาน y, วาด(k, โปร่ง)) */
function eachTall(G, fn) {
  const sc = G.scene, map = sc.map, c = G.cam, L = map.look || {};
  const x0 = Math.floor(c.x / T) - 2, x1 = Math.ceil((c.x + c.vw) / T) + 2, y0 = Math.floor(c.y / T) - 1, y1 = Math.ceil((c.y + c.vh) / T) + 4;
  const kind = L.floor;
  if (kind === 'terrain' || kind === 'nature' || kind === 'road') {
    const src = TREE_SRC[L.tree || L.trees] || TREE_SRC.oak;
    for (let y = Math.max(0, y0); y <= Math.min(map.h - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(map.w - 1, x1); x++) {
      const t = ch(map, x, y);
      let sc2 = 0;
      if (t === 't') { const r = hash(x * 3.7 + 1, y * 5.1); sc2 = [.5, .7, .9, 1.1][r < .2 ? 0 : r < .45 ? 1 : r < .78 ? 2 : 3]; } /* ขนาดต้นไม้ทุ่ง 013:84 */
      else if (t === 'F' || (kind === 'road' && t === '#' && x < L.sea[0] && y > 1 && y < map.h - 2)) sc2 = .85 + hash(x * 1.7, y * 3.1) * .35;
      else if (t === 'o' && kind !== 'terrain') sc2 = .7;
      if (!sc2) continue;
      const bx = x * T + 16 + (hash(x, y * 1.3) - .5) * 8, by = y * T + 28;
      fn(by, (k, a) => treeAt(k, src, bx, by, sc2, a), [bx - 40 * sc2, by - 92 * sc2, 80 * sc2, 92 * sc2], true);
    }
  }
  const art = artOf(map);
  if (art) {
    const X0 = c.x - 64, Y0 = c.y - 64, X1 = c.x + c.vw + 64, Y1 = c.y + c.vh + 300;
    for (const [base, list] of art.props) {
      if (!list.some(o => hits(o, X0, Y0, X1, Y1))) continue;
      const tree = list.some(o => /tree-/.test(art.src[o[0]]));
      const r = list[0]; fn(base, (k, a) => { if (a < 1) { k.save(); k.globalAlpha = a; } for (const o of list) op(k, art.src, o); if (a < 1) k.restore(); }, [r[5], r[6], r[7], r[8]], tree);
    }
    if (art.roof) for (const o of art.ground) { /* หลังคาอาคาร: วาดซ้ำทับตัวละครเมื่อเดินอยู่หลังอาคาร (TOWNART.bind roof) */
      const s = art.src[o[0]];
      if (!art.roof.srcs.includes(s) || art.roof.skip.some(q => s.endsWith('landmarks.png') && Math.abs(q[0] - o[1]) < 2 && Math.abs(q[1] - o[2]) < 2)) continue;
      if (!hits(o, X0, Y0, X1, Y1)) continue;
      const band = o[8] * art.roof.part, base = o[6] + band;
      fn(base, k => { k.save(); k.beginPath(); k.rect(o[5], o[6], o[7], band); k.clip(); op(k, art.src, o); k.restore(); }, null, false, true);
    }
  }
}

function drawTall(G, ctx, front) {
  const P = G.player, list = [];
  eachTall(G, (base, draw, rect, fade, roofOnly) => {
    if (roofOnly) { if (front && base > P.y) list.push([base, draw, 1]); return; }
    if ((base > P.y) !== front) return;
    /* ต้นไม้หน้าตัวละครจางลง (alpha 1-.6) เมื่อบังตัว (spec01 §3) */
    const a = front && fade && rect && P.x > rect[0] && P.x < rect[0] + rect[2] && P.y > rect[1] && P.y < base ? .4 : 1;
    list.push([base, draw, a]);
  });
  list.sort((a, b) => a[0] - b[0]);
  for (const [, draw, a] of list) draw(ctx, a);
}

/* ---------- จุดเข้า: world.draw เรียกทุกชั้น ---------- */
export function drawLayer(G, ctx, layer) {
  if (typeof document === 'undefined') return;
  clock = G.time ? G.time.now : clock;
  if (layer === 'ground') { drawGround(G, ctx); drawLinks(G, ctx); sweep(); }
  else if (layer === 'world') drawTall(G, ctx, false);
  else if (layer === 'top') drawTall(G, ctx, true);
}

/* วงเวท/ประตูที่กดได้ (วาดด้วยโค้ด · ลำดับชั้น: พื้น → ประตู) */
function drawLinks(G, ctx) {
  const t = clock;
  for (const l of G.scene.map.links || []) {
    if (!l.circle || l.on !== 'use') continue;
    const x = l.circle[0] * T, y = l.circle[1] * T;
    const back = l.to === '@back', col = back ? '230,255,240' : l.menu ? '200,160,255' : '255,220,140';
    const g = ctx.createRadialGradient(x, y, 2, x, y, 30);
    g.addColorStop(0, `rgba(${col},${.55 + .25 * Math.sin(t * 3)})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 30, 14, 0, 0, 7); ctx.fill();
  }
}
