/* tiles — วาดฉาก: พื้น → (ระบบอื่นวาดตัวละคร) → ของสูงเรียงตาม y (spec01 §3 ลำดับชั้น)
   - พื้นวาดเป็นแผ่น 512×512 px เก็บไว้ (ไม่สร้างภาพทั้งแมพ · มือถือไม่กินหน่วยความจำ)
   - คืนหน่วยความจำ (fix157): เฉพาะแผ่น/ภาพของฉากที่ไม่ได้อยู่ และไม่ได้ใช้เกิน 45 วิ · ฉากปัจจุบันไม่คืน (ยืนในเมืองนานแล้วพื้นไม่ต้องโหลดใหม่ · ผลตรวจ 1A-2 M4)
   - สร้างแผ่นพื้นไม่เกิน ~BUILD_MS ต่อเฟรม (แผ่นที่ตัวละครยืนก่อน) → วาปเข้าแมพใหญ่ไม่ค้างเฟรมยาว (ผลตรวจ L9)
   - ภาพโหลดตอนต้องใช้เท่านั้น ไม่ฝัง base64 · ภาพยังไม่มา = วาดสีแทน แล้ววาดใหม่เมื่อภาพมาถึง
   - ภาพเก็บเป็น ImageBitmap (fetch → blob → createImageBitmap · งาน 1Y): ถอดรหัสนอกเฟรมเสร็จก่อนใช้ → วาดครั้งแรก ~0.3 ms
     (เดิม <img> + decode() วาดภาพ 1536×1024 ครั้งแรก 42–53 ms · คำขอ 1Z) · เบราว์เซอร์ที่ไม่มี createImageBitmap (Safari เก่า) ใช้ <img> + decode() แบบเดิม
     คืนภาพ = bitmap.close() (คืนหน่วยความจำทันที ไม่รอเก็บขยะ)
   - เดินใกล้ประตู/วงเวท (PRE_PX) → โหลด+ถอดรหัสภาพของฉากปลายทางไว้ก่อน (ไม่สร้างแผ่นพื้น) · ไม่ได้เข้า = คืนตามกติกา 45 วิ เหมือนภาพอื่น
   - กติกาภาพ (spec01 §10): ใช้ภาพเฉพาะ พื้น · อาคาร · ต้นไม้ · ของตกแต่งฉาก — อย่างอื่นวาดด้วยโค้ด
   - ของสูง (อาคาร ต้นไม้ เสาไฟ หลังคา): ส่งเข้าคิวกลาง zpush(ฐาน y, fn) ในชั้น 'world' (CONTRACT §1) → เรียงหน้า-หลังรวมกับตัวละคร/NPC/มอน
     ต้นไม้ที่อยู่หน้าและบังตัวเรา → โปร่ง (คิดตอนวาดใน fn) · หลังคาอาคารวาดซ้ำที่ฐานแนวหลังคา → เดินหลังอาคาร หลังคาบังตัว
   - ชื่อภาพ/สี อยู่ data/art.js (CONTRACT §3) */
import { T } from '../config.js';
import { WORLD, MAPS, TOWN_FLOOR, TOWN_ART, CITY2_ART, ROOM } from '../data/maps.js';
import { zpush } from '../core/zsort.js';
import { TREE_SRC, TERRAIN, TREE, COLORS } from '../data/art.js';
import { hash, vn } from '../core/rand.js'; /* ไม่ import วนกับ world แล้ว (หัวหน้า 30 ต.ค.) */

const CH = WORLD.chunk;
const BUILD_MS = 8;      /* ms ต่อเฟรมที่ยอมใช้สร้างแผ่นพื้น (อย่างน้อย 1 แผ่นเสมอ) */

const PRE_PX = 160;      /* px — ระยะจากประตู/วงเวทที่เริ่มเตรียมภาพของฉากปลายทาง (5 ช่อง) */

const RETRY_S = [2, 5, 15]; /* วิ — โหลดภาพไม่ได้ (เน็ตมือถือสะดุด/404) → ลองใหม่หลัง 2 · 5 · 15 วิ แล้วเลิก (ผลตรวจ 1Y L3 · 404 จริงยิงแค่ 4 ครั้ง) */

const IMG = new Map();   /* src → { img (ImageBitmap หรือ <img>), ok, bad, fails, retryAt, gone, used, scenes:Set } */
const CHUNK = new Map(); /* 'ฉาก|cx,cy' → { cv, used, miss, scene } */
let clock = 0, lastSweep = 0, curScene = null;

/* ---------- ภาพ ---------- */
function url(src) { return new URL('../../../' + src, import.meta.url).href; }
/* ภาพพร้อมวาดของ src (null = ยังไม่มา) · scene = ฉากที่ใช้ภาพนี้ (เตรียมล่วงหน้าส่ง null = ยังไม่ผูกฉาก) */
export function image(src, scene = curScene) {
  let e = IMG.get(src);
  if (!e) { e = { src, img: null, ok: false, bad: false, fails: 0, retryAt: 0, gone: false, used: clock, scenes: new Set() }; IMG.set(src, e); load(e, src); }
  e.used = clock;
  if (scene) e.scenes.add(scene);
  return e.ok ? e.img : null;
}
const canBitmap = () => typeof createImageBitmap === 'function' && typeof fetch === 'function' && typeof Blob === 'function';
function load(e, src) {
  const done = im => {
    if (e.gone) { release(im); return; } /* ถูกคืนระหว่างโหลด → ทิ้งเลย */
    e.img = im; e.ok = imgW(im) > 0; dropMissing();
  };
  const viaImg = () => {
    if (e.gone) return;
    const im = new Image(); im.decoding = 'async'; e.el = im;
    /* ถอดรหัสก่อนใช้ (decode) · เบราว์เซอร์ที่ไม่มี decode ใช้ได้ทันที */
    im.onload = () => { if (im.decode) im.decode().then(() => done(im), () => done(im)); else done(im); };
    im.onerror = () => fail(e);
    im.src = url(src);
  };
  if (!canBitmap()) { viaImg(); return; }
  fetch(url(src)).then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.blob(); }).then(
    b => createImageBitmap(b).then(done, viaImg), /* ถอดรหัส blob ไม่ได้ (เบราว์เซอร์เก่า) → <img> */
    () => fail(e));                                /* โหลดไม่ได้ (404/เน็ต) → ลองใหม่แบบเว้นช่วง (fail) */
}
/* โหลดพลาด: ลองใหม่หลัง RETRY_S[ครั้งที่พลาด] วิ (นับจากเวลาเกม clock · retry() ทุกเฟรม) · ครบ 3 ครั้งแล้วเลิก = สีแทนภาพ
   (เดิมพลาดครั้งเดียว = bad ถาวร → ยืนในเมืองเห็นแต่สีพื้นแทนอาคารจนออกฉากเกิน 45 วิ · ผลตรวจ 1Y L3)
   ลองใหม่เฉพาะภาพที่ยังใช้อยู่ (ฉากปัจจุบัน หรือเพิ่งขอไม่เกิน artTtl) · ได้ภาพแล้ว dropMissing() สร้างแผ่นพื้นที่วาดสีแทนใหม่ */
const BAD = new Set(); /* entry ที่รอลองใหม่ (ว่าง = retry() ไม่ทำอะไร) */
function fail(e) {
  if (e.gone) return;
  e.bad = true; e.fails++;
  if (e.fails <= RETRY_S.length) { e.retryAt = clock + RETRY_S[e.fails - 1]; BAD.add(e); }
}
function retry() {
  if (!BAD.size) return;
  for (const e of BAD) {
    if (e.gone) { BAD.delete(e); continue; }
    if (clock < e.retryAt) continue;
    if (!e.scenes.has(curScene) && clock - e.used > WORLD.artTtl) continue; /* ไม่มีใครใช้ตอนนี้ → ยังไม่ยิง (กลับมาใช้ = ลองต่อ · sweep คืน = ออกจากรายการ) */
    BAD.delete(e); e.bad = false; load(e, e.src);
  }
}
/* ขนาดภาพ: ImageBitmap มี width/height · <img> ใช้ naturalWidth (ไม่ขึ้นกับขนาดที่แสดง) */
const imgW = im => im.naturalWidth || im.width || 0, imgH = im => im.naturalHeight || im.height || 0;
function release(im) { if (im && typeof im.close === 'function') im.close(); }
function drop(e) {
  e.gone = true; e.ok = false;
  release(e.img); e.img = null;
  if (e.el) { e.el.onload = e.el.onerror = null; e.el.src = ''; e.el = null; }
}
function dropMissing() { for (const [k, c] of CHUNK) if (c.miss) { free(c); CHUNK.delete(k); } }
function free(c) { c.cv.width = c.cv.height = 0; }

/* คืนหน่วยความจำ: แผ่นพื้น/ภาพของฉากที่ไม่ได้อยู่ และไม่ได้ใช้เกิน artTtl วิ (fix157 คืนเฉพาะแมพที่ไม่ได้อยู่) */
function sweep() {
  if (Math.abs(clock - lastSweep) < 5) return;
  lastSweep = clock;
  const ttl = WORLD.artTtl;
  for (const [k, c] of CHUNK) if (c.scene !== curScene && clock - c.used > ttl) { free(c); CHUNK.delete(k); }
  for (const [k, e] of IMG) if (!e.scenes.has(curScene) && clock - e.used > ttl) { drop(e); IMG.delete(k); }
}
export function cacheInfo() { /* เทส */
  return {
    chunks: CHUNK.size, images: IMG.size, clock, scene: curScene, srcs: [...IMG.keys()], chunkScenes: [...new Set([...CHUNK.values()].map(c => c.scene))],
    ready: [...IMG].filter(([, e]) => e.ok).map(([k]) => k),
    bitmaps: [...IMG.values()].filter(e => e.ok && typeof e.img.close === 'function').length,
  };
}
export function _reset() { for (const e of IMG.values()) drop(e); IMG.clear(); BAD.clear(); for (const c of CHUNK.values()) free(c); CHUNK.clear(); FADE.clear(); fadeScene = fadeAt = null; lastSweep = 0; } /* เทส */
export function peekImage(src) { const e = IMG.get(src); return e ? e.img : null; } /* เทส: ภาพที่เก็บอยู่ (ไม่นับว่าใช้) */

/* ---------- เตรียมภาพฉากถัดไป ---------- */
/* ภาพทั้งหมดที่ฉาก map ใช้ (ตามชนิดพื้น/ต้นไม้/ภาพอาคาร) · จำผลต่อแมพ (แมพไม่เปลี่ยน · prefetch เรียกทุกเฟรมตอนยืนใกล้ประตู · ผลตรวจ 1Y L5)
   คืนอาร์เรย์เดิมทุกครั้ง (แช่แข็ง ห้ามแก้) */
const SCENE_IMG = new WeakMap();
export function sceneImages(map) {
  if (map && typeof map === 'object') {
    let a = SCENE_IMG.get(map);
    if (!a) { a = Object.freeze(listSceneImages(map)); SCENE_IMG.set(map, a); }
    return a;
  }
  return listSceneImages(map);
}
function listSceneImages(map) {
  const L = (map && map.look) || {}, out = new Set();
  if (L.floor === 'terrain' || (L.floor === 'zone' || !L.floor) && L.tile != null) out.add(TERRAIN.src);
  if (L.floor === 'terrain' || L.floor === 'nature' || L.floor === 'road') out.add(TREE_SRC[L.tree || L.trees] || TREE_SRC.oak);
  if (L.floor === 'town') out.add(TOWN_FLOOR.src);
  if (L.floor === 'city2') out.add(CITY2_ART.street);
  const art = artOf(map);
  if (art) for (const s of art.src) out.add(s);
  return [...out];
}
function linkDist(l, x, y) { /* ระยะ px จากจุด (x,y) ถึงขอบประตู/วงเวท */
  if (l.box) { const b = l.box, dx = Math.max(b[0] * T - x, 0, x - (b[0] + b[2]) * T), dy = Math.max(b[1] * T - y, 0, y - (b[1] + b[3]) * T); return Math.hypot(dx, dy); }
  if (l.circle) return Math.max(0, Math.hypot(x - l.circle[0] * T, y - l.circle[1] * T) - l.circle[2]);
  return Infinity;
}
/* ตัวละครอยู่ใกล้ทางไปฉากที่มีภาพ → ขอภาพของฉากนั้นไว้ก่อน (ภาพที่มีอยู่แล้ว = แค่ต่อเวลา used) */
function prefetch(G) {
  const P = G.player;
  for (const l of G.scene.map.links || []) {
    const to = typeof l.to === 'string' && MAPS[l.to];
    if (!to || l.to === G.scene.id || linkDist(l, P.x, P.y) > PRE_PX) continue;
    for (const s of sceneImages(to)) image(s, null);
  }
}

/* ---------- สีช่วย ---------- */
const rgb = a => 'rgb(' + (a[0] | 0) + ',' + (a[1] | 0) + ',' + (a[2] | 0) + ')';
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function ch(map, x, y) { return x < 0 || y < 0 || x >= map.w || y >= map.h ? '#' : String.fromCharCode(map.grid[y * map.w + x]); }

/* ย่อภาพคุณภาพสูง: ImageBitmap ถูกย่อแบบหยาบถ้าไม่ตั้ง (ผลตรวจ 1Y M1 · หัวหน้า 30 ต.ค.) */
function hq(k) { if (k.imageSmoothingQuality !== 'high') { k.imageSmoothingEnabled = true; k.imageSmoothingQuality = 'high'; } }

/* ---------- ภาพจากตารางข้อมูล [ภาพ, sx,sy,sw,sh, dx,dy,dw,dh, กรอบตัด?] ---------- */
function op(k, src, o) {
  const im = image(src[o[0]]);
  if (!im) return false;
  if (o[9]) { k.save(); k.beginPath(); k.rect(o[9][0], o[9][1], o[9][2], o[9][3]); k.clip(); }
  hq(k); k.drawImage(im, o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8]);
  if (o[9]) k.restore();
  return true;
}
const hits = (o, x0, y0, x1, y1) => o[5] < x1 && o[5] + o[7] > x0 && o[6] < y1 && o[6] + o[8] > y0;

/* ---------- ผู้วาดพื้นแต่ละแบบ (look.floor) — วาดช่อง x0..x1, y0..y1 ลง k (พิกัดโลก) · คืน false ถ้ามีภาพยังไม่มา ---------- */
const FLOOR = {
  /* ทุ่ง: ช่องจากภาพ terrain (buildGround 031:818) */
  terrain(k, map, x0, y0, x1, y1) {
    const im = image(TERRAIN.src), L = map.look.tiles, C = COLORS.terrain;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const c = ch(map, x, y), n = L[c] ?? 0;
      if (im) terrainCell(k, im, n, x * T, y * T);
      else { k.fillStyle = c === '~' ? C.water : c === ':' ? C.sand : C.grass; k.fillRect(x * T, y * T, T, T); }
      if (c === 'W') { /* หินวาร์ป (วาดด้วยโค้ด) */
        const cx = x * T + 16, cy = y * T + 18;
        k.fillStyle = COLORS.warp.stone; k.beginPath(); k.ellipse(cx, cy, 12, 9, 0, 0, 7); k.fill();
        k.fillStyle = COLORS.warp.glow; k.beginPath(); k.ellipse(cx, cy - 2, 6, 4, 0, 0, 7); k.fill();
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
      const w = imgW(im) / 2, h = imgH(im) / 2;
      for (const [kind, q] of Object.entries(F.quad)) {
        const c = document.createElement('canvas'); c.width = c.height = F.size;
        { const g2 = c.getContext('2d'); hq(g2); g2.drawImage(im, q[0] * w, q[1] * h, w, h, 0, 0, F.size, F.size); }
        pat[kind] = k.createPattern(c, 'repeat');
      }
    }
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const kind = inR(x, y, F.marble) ? 'marble' : inR(x, y, F.earth) ? 'earth' : road(x, y) ? 'stone' : 'grass';
      k.fillStyle = pat ? pat[kind] : COLORS.town[kind];
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
      if (x >= L.sea[0] && ch(map, x, y) === '#' && y > 1 && y < map.h - 2) { k.fillStyle = COLORS.sea[(x + y) & 1 ? 0 : 1]; k.fillRect(x * T, y * T, T, T); continue; }
      if (ch(map, x, y) !== '#' && Math.abs(y - roadY(x, L.path)) <= 1) {
        k.fillStyle = L.pathC; k.fillRect(x * T, y * T, T, T);
        k.fillStyle = L.pathD; for (let i = 0; i < 4; i++) { const r = hash(x * 3.1 + i, y * 1.7 - i); k.fillRect(x * T + (r * 28 | 0), y * T + (r * 97 % 28 | 0), 3, 2); }
      }
    }
    return true;
  },
  /* เมือง 2: ถนนจากภาพ ground-v558 · พื้นอื่นสีตามชนิด (build98 130-fix98:117) */
  city2(k, map, x0, y0, x1, y1) {
    const im = image(CITY2_ART.street), C = CITY2_ART.colors, G = map.groundGrid;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const g = G ? String.fromCharCode(G[y * map.w + x]) : 'l';
      if (g === 's' && im) { const px = x * T, py = y * T; k.drawImage(im, px % 384, py % 384, T, T, px, py, T, T); continue; }
      const c = C[g] || C.l; k.fillStyle = c[0]; k.fillRect(x * T, y * T, T, T);
      k.fillStyle = c[1]; for (let i = 0; i < 3; i++) { const r = hash(x * 2.3 + i, y * 1.9 - i); k.fillRect(x * T + (r * 26 | 0), y * T + (r * 89 % 26 | 0), 5, 3); }
    }
    return !!im;
  },
};
function roadY(x, p) { /* roadY 171-fix144 · sm = smoothstep */
  const sm = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  return Math.round(p.y + p.amp * sm((x - p.x0) / p.ramp) * sm((p.x1 - x) / p.ramp) * Math.sin(x / p.period));
}

/* ช่องพื้น 128 → 32 px (ย่อ 4 เท่า) · hq: ไม่ตั้ง = ย่อหยาบ (ช่องที่ 4 ของ M1 ที่ยังขาด · เทส 1X spy canvas) */
function terrainCell(k, im, n, px, py) { const S = TERRAIN.cell, C = TERRAIN.cols; hq(k); k.drawImage(im, (n % C) * S, Math.floor(n / C) * S, S, S, px, py, T, T); }

function zoneTiles(k, map, x0, y0, x1, y1, p, tile) {
  const im = tile != null ? image(TERRAIN.src) : null, solid = c => c === '#', Z = COLORS.zone;
  k.fillStyle = p.vd || Z.void; k.fillRect(x0 * T, y0 * T, (x1 - x0 + 1) * T, (y1 - y0 + 1) * T);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const c = ch(map, x, y), px = x * T, py = y * T, h = hash(x * 1.3, y * 2.7);
    if (!solid(c)) {
      if (im) terrainCell(k, im, tile, px, py);
      else { k.fillStyle = p.fl[Math.floor(h * p.fl.length) % p.fl.length]; k.fillRect(px, py, T, T); }
      k.fillStyle = Z.dirt; k.fillRect(px + (h * 20 | 0), py + (h * 97 % 20 | 0), 6, 4);
      k.fillStyle = Z.shine; k.fillRect(px + ((h * 53) % 24 | 0), py + ((h * 31) % 24 | 0), 4, 3);
      if (c === 'o') { /* แร่ (วาดแบบง่าย · ระบบขุดแร่เฟส 4 วาดเอง) */
        k.fillStyle = COLORS.ore.rock; k.beginPath(); k.ellipse(px + 16, py + 20, 11, 8, 0, 0, 7); k.fill();
        k.fillStyle = p.ac || COLORS.ore.fleck; k.fillRect(px + 12, py + 15, 4, 3); k.fillRect(px + 18, py + 19, 3, 3);
      }
      continue;
    }
    const below = !solid(ch(map, x, y + 1)) && y + 1 < map.h;
    k.fillStyle = p.top; k.fillRect(px, py, T, T);
    k.fillStyle = Z.topShine; k.fillRect(px + 2 + (h * 12 | 0), py + 3, 10, 6);
    if (below) {
      k.fillStyle = p.face; k.fillRect(px, py + T - 12, T, 12);
      k.fillStyle = p.edge; k.fillRect(px, py + T - 12, T, 2);
      k.fillStyle = Z.drop; k.fillRect(px, py + T, T, 5);
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
    if (c === 'w') { /* น้ำ/ลาวา: สีเดียวต่อเนื่อง + ขอบฝั่ง + ประกายเล็ก ๆ */
      const liq = L.liq || COLORS.liquid;
      k.fillStyle = liq[0]; k.fillRect(px, py, T, T);
      k.fillStyle = liq[1]; k.globalAlpha = .35; k.fillRect(px, py + (h * 16 | 0), T, 6); k.globalAlpha = 1;
      if (h > .7) { k.fillStyle = liq[2]; k.globalAlpha = .6; k.fillRect(px + (h * 20 | 0), py + 8 + (h * 13 % 12 | 0), 7, 2); k.globalAlpha = 1; }
      k.fillStyle = L.shore || COLORS.shore;
      if (ch(map, x, y - 1) !== 'w') k.fillRect(px, py, T, 3);
      if (ch(map, x, y + 1) !== 'w') k.fillRect(px, py + T - 3, T, 3);
      if (ch(map, x - 1, y) !== 'w') k.fillRect(px, py, 3, T);
      if (ch(map, x + 1, y) !== 'w') k.fillRect(px + T - 3, py, 3, T);
    }
    else if (c === 'p') { /* ทางดิน: เติมเต็มช่อง ลายจุดเล็ก ๆ */
      k.fillStyle = L.path; k.fillRect(px, py, T, T);
      k.fillStyle = L.pathD;
      for (let i = 0; i < 4; i++) { const r = hash(x * 3.1 + i, y * 1.7 - i); k.fillRect(px + (r * 28 | 0), py + (r * 97 % 28 | 0), 3, 2); }
    }
    else if (c === 'b') { k.fillStyle = COLORS.bridge[0]; k.fillRect(px, py, T, T); k.fillStyle = COLORS.bridge[1]; for (let i = 4; i < T; i += 8) k.fillRect(px, py + i, T, 2); }
    else if (c === 'L') { k.fillStyle = COLORS.cliff; k.fillRect(px, py, T, T); }
    else if (c === 'F' || c === '#') { k.fillStyle = COLORS.treeShadow; k.beginPath(); k.ellipse(px + 16, py + 24, 20, 10, 0, 0, 7); k.fill(); } /* เงาใต้ต้นไม้ */
    else if (c === 'r') { const R = COLORS.rock; k.fillStyle = R.shadow; k.beginPath(); k.ellipse(px + 16, py + 26, 14, 5, 0, 0, 7); k.fill(); k.fillStyle = R.body; k.beginPath(); k.ellipse(px + 16, py + 18, 13, 11, 0, 0, 7); k.fill(); k.fillStyle = R.light; k.beginPath(); k.ellipse(px + 12, py + 14, 6, 4, 0, 0, 7); k.fill(); }
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
  return { cv, used: clock, miss: !ok, scene: sc.id };
}
function artOf(map) { return map.look && map.look.art === 'town' ? TOWN_ART : map.look && map.look.art === 'city2' ? CITY2_ART : null; }

function drawGround(G, ctx) {
  const sc = G.scene, c = G.cam, map = sc.map;
  if (map.look && map.look.floor === 'city2' && !map.groundGrid && map.ground) map.groundGrid = groundGrid(map);
  ctx.fillStyle = (map.look && map.look.pal && map.look.pal.vd) || COLORS.bg;
  ctx.fillRect(c.x, c.y, c.vw, c.vh);
  const cx0 = Math.max(0, Math.floor(c.x / CH)), cy0 = Math.max(0, Math.floor(c.y / CH));
  const cx1 = Math.min(Math.ceil(sc.w / CH) - 1, Math.floor((c.x + c.vw) / CH)), cy1 = Math.min(Math.ceil(sc.h / CH) - 1, Math.floor((c.y + c.vh) / CH));
  /* แผ่นที่ยังไม่มี: สร้างแผ่นใกล้ตัวละครก่อน หยุดเมื่อเกินงบเวลาของเฟรม (เฟรมถัดไปสร้างต่อ · ระหว่างนั้นเห็นสีพื้นของแมพ) */
  const P = G.player, pcx = P.x / CH, pcy = P.y / CH, todo = [];
  for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) if (!CHUNK.has(chunkKey(sc, cx, cy))) todo.push([cx, cy]);
  if (todo.length) {
    todo.sort((a, b) => Math.hypot(a[0] + .5 - pcx, a[1] + .5 - pcy) - Math.hypot(b[0] + .5 - pcx, b[1] + .5 - pcy));
    const t0 = now();
    for (const [cx, cy] of todo) { CHUNK.set(chunkKey(sc, cx, cy), buildChunk(sc, cx, cy)); if (now() - t0 > BUILD_MS) break; }
  }
  for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
    const chk = CHUNK.get(chunkKey(sc, cx, cy));
    if (!chk) continue;
    chk.used = clock;
    ctx.drawImage(chk.cv, cx * CH, cy * CH);
  }
}
const now = () => (typeof performance !== 'undefined' ? performance.now() : 0); /* วัดงบเวลาวาดเท่านั้น (ไม่ใช่เวลาเกม) */
function groundGrid(map) { /* แถวชนิดพื้นเมือง 2 (RLE) → ตาราง */
  const g = new Uint8Array(map.w * map.h);
  map.ground.forEach((r, y) => { let s = ''; for (const m of r.matchAll(/(\D)(\d*)/g)) s += m[1].repeat(m[2] ? +m[2] : 1); for (let x = 0; x < map.w; x++) g[y * map.w + x] = s.charCodeAt(x); });
  return g;
}

/* ---------- ของสูงเรียงตาม y ---------- */
function treeAt(k, src, bx, by, sc, alpha, ang) {
  const im = image(src);
  const w = TREE.w * sc, h = TREE.h * sc;
  if (!im) { k.fillStyle = TREE.missing; k.beginPath(); k.ellipse(bx, by - h * .6, w * .4, h * .35, 0, 0, 7); k.fill(); return; }
  const tf = alpha < 1 || ang;
  if (tf) { k.save(); if (alpha < 1) k.globalAlpha = alpha; if (ang) { k.translate(bx, by); k.rotate(ang); k.translate(-bx, -by); } } /* โยกรอบโคนต้น */
  hq(k); k.drawImage(im, 0, 0, imgW(im), imgH(im), bx - w / 2, by - h * TREE.lift, w, h);
  if (tf) k.restore();
}
/* มุมโยกของต้นไม้ช่อง (x,y) ตามชนิด (TREE.sway) · ไม่มีชนิด = ไม่โยก */
function swayAt(kind, x, y) { const s = kind && TREE.sway[kind]; return s ? s.amp * Math.sin(clock * s.speed + x * s.kx + y * s.ky) : 0; }
/* เรียกทุกของสูงที่อยู่ในจอ: fn(ฐาน y, วาด(k, โปร่ง)) */
function eachTall(G, fn) {
  const sc = G.scene, map = sc.map, c = G.cam, L = map.look || {};
  const x0 = Math.floor(c.x / T) - 2, x1 = Math.ceil((c.x + c.vw) / T) + 2, y0 = Math.floor(c.y / T) - 1, y1 = Math.ceil((c.y + c.vh) / T) + 4;
  const kind = L.floor;
  if (kind === 'terrain' || kind === 'nature' || kind === 'road') {
    const src = TREE_SRC[L.tree || L.trees] || TREE_SRC.oak;
    for (let y = Math.max(0, y0); y <= Math.min(map.h - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(map.w - 1, x1); x++) {
      const t = ch(map, x, y);
      let sc2 = 0, sw = null;
      if (t === 't') { const r = hash(x * 3.7 + 1, y * 5.1), q = TREE.fieldCut; sc2 = TREE.fieldScale[r < q[0] ? 0 : r < q[1] ? 1 : r < q[2] ? 2 : 3]; sw = 'field'; } /* ขนาดต้นไม้ทุ่ง 013:84 */
      else if (t === 'F' || t === 'L' || (kind === 'road' && t === '#' && x < L.sea[0])) sc2 = TREE.forest[0] + hash(x * 1.7, y * 3.1) * TREE.forest[1]; /* ป่าทึบ/ขอบป่า = ต้นไม้แน่น */
      else if (t === 'o' && kind !== 'terrain') { sc2 = TREE.ore; sw = 'ore'; }
      if (!sc2) continue;
      const bx = x * T + 16 + (hash(x, y * 1.3) - .5) * TREE.jitter, by = y * T + TREE.baseY, tw = TREE.w * sc2, th = TREE.h * sc2 * TREE.lift;
      const ang = swayAt(sw, x, y);
      fn(by, (k, a) => treeAt(k, src, bx, by, sc2, a, ang), [bx - tw / 2, by - th, tw, th], true);
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
      if (!art.roof.srcs.includes(s) || art.roof.skip.some(q => /\/landmarks(-v\d+)?\./.test(s) && Math.abs(q[0] - o[1]) < 2 && Math.abs(q[1] - o[2]) < 2)) continue;
      if (!hits(o, X0, Y0, X1, Y1)) continue;
      const band = o[8] * art.roof.part, base = o[6] + band;
      fn(base, k => { k.save(); k.beginPath(); k.rect(o[5], o[6], o[7], band); k.clip(); op(k, art.src, o); k.restore(); }, null, false);
    }
  }
}

/* ส่งของสูงทุกชิ้นในจอเข้าคิวกลาง zpush(ฐาน y) — ตัวละคร/NPC/มอน ส่ง y เท้าเข้าคิวเดียวกัน → บังกันถูกทุกตัว (CONTRACT §1)
   ต้นไม้ (fade): ถ้าตัวเราอยู่หลังฐาน · เท้าต่ำกว่ายอดภาพ · ห่างกลางต้นซ้าย-ขวาไม่เกิน TREE.crown×กว้างภาพ + TREE.body.hw
     (= 34·sc + 8 เท่าเกมเดิม 016-core:70 · ต้นปกติ sc 1 → ±42 px · ผลตรวจ 1A-4 L3)
     → ค่อย ๆ จางลงจนทึบเหลือ TREE.fade · ออกจากหลังต้นไม้ → ค่อย ๆ กลับทึบ (ตัวนับต่อต้น เก็บใน tiles ไม่ใช่ G · เกมเดิม 016-core:71 + 024-core:35)
     อัตราจาง 1−exp(−dt·TREE.fadeRate) → จางเท่ากันทุก FPS (เกมเดิม min(1, dt·10): 30 FPS จางเร็วกว่า 60 FPS ~11% · ผลตรวจ 1A-4 L4)
   หลังคา: วาดซ้ำที่ฐานแนวหลังคา → ตัวที่ยืนหลังแนวนี้ถูกหลังคาบัง · ตัวที่อยู่หน้าวาดทับ (TOWNART.bind roof) */
const FADE = new Map(); /* 'ฐาน y,x' → ระดับจาง 0..1 (เฉพาะต้นที่กำลังจาง/กลับทึบ · ล้างเมื่อเปลี่ยนฉาก) */
let fadeAt = null, fadeScene = null;
export function treeCovers(P, base, rect) { /* ต้นไม้ (กรอบภาพ rect · ฐาน base) บังกรอบตัวละครที่ยืนข้างหลังไหม */
  const B = TREE.body, half = rect[2] * TREE.crown + B.hw;
  /* เงื่อนไขหัว (เท้า−B.top < ขอบล่างภาพ): ต้นไม้ทุกต้นตอนนี้ขอบล่างภาพ ≈ ฐาน และเช็ก 'อยู่หลังฐาน' แล้ว → จริงเสมอ (ดู TREE.body ใน data/art.js) */
  return P.y < base && Math.abs(P.x - (rect[0] + rect[2] / 2)) < half && P.y > rect[1] && P.y - B.top < rect[1] + rect[3];
}
function pushTall(G) {
  const P = G.player;
  if (fadeScene !== G.scene.id) { FADE.clear(); fadeScene = G.scene.id; fadeAt = null; }
  const dt = fadeAt == null ? 0 : Math.max(0, Math.min(.25, clock - fadeAt)); fadeAt = clock; /* หยุดเกม = เวลาไม่เดิน = ไม่จางต่อ */
  const step = 1 - Math.exp(-dt * TREE.fadeRate); /* ไม่ขึ้นกับ FPS (ผลตรวจ 1A-4 L4) */
  eachTall(G, (base, draw, rect, fade) => {
    let a = 1;
    if (fade && rect) {
      const key = base + ',' + Math.round(rect[0]), on = treeCovers(P, base, rect);
      let f = FADE.get(key) || 0;
      f += ((on ? 1 : 0) - f) * step;
      if (!on && f < .005) FADE.delete(key); else FADE.set(key, f);
      a = 1 - (1 - TREE.fade) * f;
    }
    zpush(base, k => draw(k, a));
  });
}

/* ---------- จุดเข้า: world.draw เรียกทุกชั้น ---------- */
export function drawLayer(G, ctx, layer) {
  if (typeof document === 'undefined') return;
  clock = G.time ? G.time.now : clock;
  curScene = G.scene.id;
  if (layer === 'ground') { retry(); drawGround(G, ctx); drawLinks(G, ctx); prefetch(G); sweep(); }
  else if (layer === 'world') pushTall(G);
}

/* วงเวท/ประตูที่กดได้ (วาดด้วยโค้ด · ลำดับชั้น: พื้น → ประตู) */
function drawLinks(G, ctx) {
  const t = clock;
  for (const l of G.scene.map.links || []) {
    if (!l.circle || l.on !== 'use') continue;
    const x = l.circle[0] * T, y = l.circle[1] * T;
    const back = l.to === '@back', L = COLORS.link, col = back ? L.back : l.menu ? L.menu : L.door;
    const g = ctx.createRadialGradient(x, y, 2, x, y, 30);
    g.addColorStop(0, `rgba(${col},${.55 + .25 * Math.sin(t * 3)})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 30, 14, 0, 0, 7); ctx.fill();
  }
}
