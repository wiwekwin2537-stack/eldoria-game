/* เทสแมพ/ชน/ประตู (systems/world + data/maps) — spec01 §4 · DECISIONS 2026-10-30 (ออกดัน = กลับหน้าทางเข้า) */
import world, { getMap, hit, tileAt, enter, follow, linkNear, returnPoint, genDungeon, decodeRow, setChooser } from '../src/systems/world.js';
import { MAPS, MENUS, TILE } from '../src/data/maps.js';
import { createState } from '../src/core/state.js';
import { on, _reset } from '../src/core/bus.js';
import { T } from '../src/config.js';

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${a} ต้องเป็น ${b}`); };
const ok = (v, m) => { if (!v) throw new Error(m); };
function fresh() { _reset(); world._reset(); const G = createState(); world.init(G); return G; }
const tiles = (x, y) => [x / T, y / T].map(v => +v.toFixed(2)).join(',');

/* รายชื่อปลายทางของ link (รวมเมนู) */
function targets(l) {
  if (l.use) return [];
  if (l.menu) {
    if (Array.isArray(l.menu)) return l.menu;
    const M = MENUS[l.menu]; return [M.scene + ':' + M.from, M.scene + ':' + M.to];
  }
  return [l.to];
}
/* ช่องเดินถึงได้จากจุดเกิด (ไม่ว่ายน้ำ) */
function reach(m, sx, sy) {
  const seen = new Uint8Array(m.w * m.h), q = [[Math.floor(sx), Math.floor(sy)]];
  const walk = (x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && !TILE[String.fromCharCode(m.grid[y * m.w + x])]?.solid;
  if (!walk(q[0][0], q[0][1])) return seen;
  seen[q[0][1] * m.w + q[0][0]] = 1;
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (walk(nx, ny) && !seen[ny * m.w + nx]) { seen[ny * m.w + nx] = 1; q.push([nx, ny]); }
    }
  }
  return seen;
}
/* ทางเข้า-ออกนี้ไปถึงได้ไหม: มีช่องที่เดินถึงและยืนแล้วอยู่ในระยะ */
function linkReachable(m, l, seen) {
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    if (!seen[y * m.w + x]) continue;
    for (const fy of [.15, .3, .5, .7, .85]) for (const fx of [.25, .3, .5, .7, .75]) {
      const px = (x + fx) * T, py = (y + fy) * T;
      if (hit(px, py, null, m)) continue;
      if (l.box) { const b = l.box; if (px >= b[0] * T && px < (b[0] + b[2]) * T && py >= b[1] * T && py < (b[1] + b[3]) * T) return true; }
      else if (Math.hypot(px - l.circle[0] * T, py - l.circle[1] * T) < l.circle[2]) return true;
    }
  }
  return false;
}

const SIZES = { /* spec01 §4 ตารางแมพ (วัดจากเกมจริง) */
  field: [60, 44], town: [44, 34], 'shop.gear': [26, 15], 'shop.hall': [26, 15], iron: [62, 44], diamond: [62, 44], mist: [62, 44],
  grove: [88, 60], creek: [88, 60], pine: [88, 60], rage: [62, 44], dg96a: [62, 44], tower: [30, 24], market: [44, 30],
  wboss: [40, 30], arena: [36, 26], duel: [26, 18], 'seal.thorn': [36, 28], city2: [84, 64], road: [124, 24],
};

export default [
  ['ถอดแถว RLE', () => { eq(decodeRow('#3.2G'), '###..G', 'rle'); eq(decodeRow('.12'), '.'.repeat(12), 'นับ 2 หลัก'); }],
  ['ทุกแมพในตารางโหลดได้ ขนาดตรงข้อมูล (แถว × คอลัมน์)', () => {
    for (const id of Object.keys(MAPS)) { const m = getMap(id); ok(m && m.grid.length === m.w * m.h, 'โหลดไม่ได้ ' + id); }
    ok(Object.keys(MAPS).length >= 40, 'แมพน้อยผิดปกติ ' + Object.keys(MAPS).length);
  }],
  ['ขนาดแมพตรงสเปก spec01 §4', () => { for (const [id, [w, h]] of Object.entries(SIZES)) { const m = getMap(id); eq(m.w + '×' + m.h, w + '×' + h, id); } }],
  ['ขนาดดันเจี้ยนตามชั้น (DGSZ 031:3204)', () => {
    for (const [f, w, h] of [[1, 70, 52], [20, 70, 52], [21, 84, 62], [50, 84, 62], [51, 98, 72], [100, 98, 72]]) { const m = genDungeon(f, 1234); eq(m.w + '×' + m.h, w + '×' + h, 'ชั้น ' + f); }
  }],
  ['จุดเกิดทุกแมพไม่อยู่ในกำแพง', () => {
    for (const id of Object.keys(MAPS)) { const m = getMap(id); ok(!hit(m.spawn[0] * T, m.spawn[1] * T, null, m), `${id} เกิดในกำแพงที่ ${m.spawn}`); }
  }],
  ['ทุกประตู: ปลายทางมีจริง · จุดเกิดปลายทาง/จุดหน้าประตูไม่อยู่ในกำแพง · ไม่เกิดทับประตูเดินของปลายทาง (กันเด้ง)', () => {
    for (const id of Object.keys(MAPS)) {
      const m = getMap(id);
      for (const l of m.links) {
        for (const to of targets(l)) {
          if (to === '@back') continue;
          const t = getMap(to); ok(t, `${id}.${l.id} → ไม่มีแมพ ${to}`);
          const at = l.at || t.spawn;
          ok(!hit(at[0] * T, at[1] * T, null, t), `${id}.${l.id} → ${to} เกิดในกำแพง ${at}`);
          for (const w of t.links.filter(q => q.on === 'walk')) {
            const b = w.box, x = at[0] * T, y = at[1] * T;
            ok(!(x >= b[0] * T && x < (b[0] + b[2]) * T && y >= b[1] * T && y < (b[1] + b[3]) * T), `${id}.${l.id} เกิดทับประตู ${to}.${w.id}`);
          }
        }
        if (l.to === '@back' && l.at) { const h = getMap(l.home || 'town'); ok(!hit(l.at[0] * T, l.at[1] * T, null, h), `${id}.${l.id} จุดสำรองในกำแพง`); }
        if (l.front) ok(!hit(l.front[0] * T, l.front[1] * T, null, m), `${id}.${l.id} จุดหน้าประตูในกำแพง ${l.front}`);
      }
    }
  }],
  ['ทุกประตูเดินไปถึงได้จากจุดเกิด (ตารางชนไม่ปิดทาง)', () => {
    for (const id of Object.keys(MAPS)) {
      const m = getMap(id), seen = reach(m, m.spawn[0], m.spawn[1]);
      for (const l of m.links) ok(linkReachable(m, l, seen), `${id}.${l.id} เดินไปไม่ถึง`);
    }
  }],
  ['ทุกแมพมีทางออก (ไม่ติดอยู่ในแมพ)', () => {
    for (const id of Object.keys(MAPS)) { const m = getMap(id); ok(m.links.some(l => l.to && !l.use), id + ' ไม่มีทางออก'); }
  }],
  ['ชนกำแพง: 4 มุม ±7/±4 px · นอกแมพชน · ทุ่ง: น้ำชน (ว่ายได้) ต้นไม้ไม่ชน (วัดจาก hit() เกมเดิม)', () => {
    const town = getMap('town');
    eq(hit(7 * T, 21.5 * T, null, town), false, 'จุดเกิดเมือง');
    eq(tileAt(0, 0, town), '#', 'มุมเมือง'); eq(hit(16, 16, null, town), true, 'ชนมุม');
    eq(tileAt(-1, 5, town), '#', 'นอกแมพ');
    eq(hit(7 * T, 21.5 * T - 18, null, town), hit(7 * T, 21.5 * T - 18, null, town), 'คงที่');
    const f = getMap('field'); let water = 0, solid = 0, tree = 0;
    for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
      const c = tileAt(x, y, f); if (c === '~') water++; if (c === 't') tree++;
      if (TILE[c].solid) solid++;
    }
    eq(water, 402, 'น้ำในทุ่ง (วัดเกมเดิม 402)'); eq(tree, 315, 'ต้นไม้ (315)'); eq(solid, 403, 'ช่องชนในทุ่ง = น้ำ + หินวาร์ป (403)');
    let wx = -1, wy = -1; for (let y = 0; y < f.h && wx < 0; y++) for (let x = 0; x < f.w; x++) if (tileAt(x, y, f) === '~' && tileAt(x + 1, y, f) === '~' && tileAt(x, y + 1, f) === '~' && tileAt(x + 1, y + 1, f) === '~') { wx = x; wy = y; break; }
    eq(hit((wx + 1) * T, (wy + 1) * T, null, f), true, 'น้ำชน'); eq(hit((wx + 1) * T, (wy + 1) * T, { swim: true }, f), false, 'ว่ายน้ำผ่านได้');
  }],
  ['เข้าแมพ: G.scene เป็น px · ตัวละครไปจุดเกิด · ส่งอีเวนต์ scene:enter {from,to,x,y}', () => {
    const G = fresh(); const ev = []; on('scene:enter', e => ev.push(e));
    eq(G.scene.id, 'town', 'เริ่มในเมือง'); eq(G.scene.w, 44 * T, 'w px'); eq(G.scene.h, 34 * T, 'h px'); eq(G.player.scene, 'town', 'player.scene');
    eq(tiles(G.player.x, G.player.y), '7,21.5', 'TOWN_SPAWN');
    enter('field', null, G);
    eq(ev.length, 1, 'อีเวนต์'); eq(ev[0].from, 'town', 'from'); eq(ev[0].to, 'field', 'to'); eq(ev[0].x, 57.5 * T, 'x'); eq(G.scene.camOy, .58, 'กล้องทุ่ง .58');
    eq(enter('ไม่มีแมพนี้', null, G), false, 'แมพไม่มี');
  }],
  ['เดินชนขอบซ้ายเมือง → ทุ่ง (57.5,22.5) · เดินชนขอบขวาทุ่ง → เมือง (1.5,17)', () => {
    const G = fresh();
    for (let i = 0; i < 30; i++) world.update(G, .05); /* หมดเวลาล็อก */
    G.player.x = 8; G.player.y = 16.5 * T; world.update(G, .05);
    eq(G.scene.id, 'field', 'ไปทุ่ง'); eq(tiles(G.player.x, G.player.y), '57.5,22.5', 'จุดเกิด'); eq(G.player.dir, 'l', 'หันซ้าย');
    world.update(G, .05); eq(G.scene.id, 'field', 'ล็อกกันเด้ง');
    for (let i = 0; i < 30; i++) world.update(G, .05);
    G.player.x = 59.7 * T; G.player.y = 22.5 * T; world.update(G, .05);
    eq(G.scene.id, 'town', 'กลับเมือง'); eq(tiles(G.player.x, G.player.y), '1.5,17', 'จากทุ่ง');
  }],
  ['ร้านทุกร้าน: กด E หน้าประตู → เข้าร้าน (13,13.4) → เดินลงขอบล่าง → ยืนหน้าประตูเดิม (cx, cy+24)', () => {
    const G = fresh(), town = getMap('town');
    for (const d of town.links.filter(l => l.to && l.to.startsWith('shop.') && l.box)) {
      enter('town', null, G);
      G.player.x = (d.box[0] + d.box[2] / 2) * T; G.player.y = (d.box[1] + d.box[3] / 2) * T;
      eq(linkNear(G).id, d.id, 'อยู่หน้าประตู ' + d.id);
      G.input.pressed = new Set(['interact']); world.update(G, .05); G.input.pressed = new Set();
      eq(G.scene.id, d.to, 'เข้า ' + d.id); eq(tiles(G.player.x, G.player.y), '13,13.4', 'จุดเกิดในร้าน');
      for (let i = 0; i < 30; i++) world.update(G, .05);
      const out = G.scene.map.links.find(l => l.id === 'out');
      G.player.x = (out.box[0] + out.box[2] / 2) * T; G.player.y = (out.box[1] + .2) * T; world.update(G, .05);
      eq(G.scene.id, 'town', 'ออก ' + d.id); eq(tiles(G.player.x, G.player.y), d.front.join(',').replace(/,[udlr]$/, ''), 'หน้าประตู ' + d.id);
    }
  }],
  ['ออกเหมืองทุกแห่ง → กลับหน้าประตูมิติในทุ่ง (DECISIONS)', () => {
    const G = fresh(); const portal = getMap('field').links.find(l => l.id === 'portal');
    for (const mine of portal.menu) {
      enter('field', null, G); setChooser((opts, l, go) => go(mine));
      follow(portal, G); eq(G.scene.id, mine, 'เข้า ' + mine);
      const ex = G.scene.map.links.find(l => l.id === 'exit');
      G.player.x = ex.circle[0] * T; G.player.y = (ex.circle[1] - .5) * T; G.input.pressed = new Set(['interact']); world.update(G, .05); G.input.pressed = new Set();
      eq(G.scene.id, 'field', 'ออก ' + mine); eq(tiles(G.player.x, G.player.y), '37.5,28.75', 'หน้าประตูมิติ');
    }
    setChooser(null);
  }],
  ['ป่าต่อกัน: ทุ่ง → ป่าละเมาะ → ลำธาร → ออกลำธาร = หน้าประตูในป่าละเมาะ → ออกป่าละเมาะ = ขอบตะวันตกทุ่ง', () => {
    const G = fresh(); enter('field', null, G);
    follow(getMap('field').links.find(l => l.id === 'grove'), G); eq(G.scene.id, 'grove', 'ป่าละเมาะ'); eq(G.player.dir, 'l', 'ป่าใหญ่หันซ้าย');
    G.player.lv = 99; follow(getMap('grove').links.find(l => l.id === 'gate'), G); eq(G.scene.id, 'creek', 'ลำธาร');
    follow(getMap('creek').links.find(l => l.id === 'exit'), G); eq(G.scene.id, 'grove', 'กลับป่าละเมาะ');
    const g = getMap('grove').links.find(l => l.id === 'gate'); eq(tiles(G.player.x, G.player.y), g.front[0] + ',' + g.front[1], 'หน้าประตูป่า');
    follow(getMap('grove').links.find(l => l.id === 'exit'), G); eq(G.scene.id, 'field', 'กลับทุ่ง'); eq(tiles(G.player.x, G.player.y), '3.5,22.5', 'ขอบตะวันตก');
  }],
  ['ดันเจี้ยน: รูปปั้นในท้องพระโรง → ชั้น 1 → วงเวท → ยืนหน้ารูปปั้น → ออกท้องพระโรง → หน้าปราสาท', () => {
    const G = fresh();
    follow(getMap('town').links.find(l => l.id === 'hall'), G); eq(G.scene.id, 'shop.hall', 'ท้องพระโรง');
    follow(getMap('shop.hall').links.find(l => l.id === 'dungeon'), G); eq(G.scene.id, 'dg:1', 'ชั้น 1 (เลือกตัวแรก)');
    eq(G.scene.camOy, .5, 'กล้องดัน .5');
    follow(G.scene.map.links.find(l => l.id === 'exit'), G); eq(G.scene.id, 'shop.hall', 'กลับท้องพระโรง'); eq(tiles(G.player.x, G.player.y), '16.41,10.4', 'หน้ารูปปั้น');
    follow(getMap('shop.hall').links.find(l => l.id === 'out'), G); eq(G.scene.id, 'town', 'เมือง'); eq(tiles(G.player.x, G.player.y), '22,10.4', 'หน้าปราสาท');
  }],
  ['ดันเจี้ยนทุกชั้น 1–100: จุดเกิดไม่ชน · เดินถึงวงเวทออก · ผังเดิมในรอบเดียวกัน · เปลี่ยนเมื่อรอบใหม่', () => {
    for (let f = 1; f <= 100; f++) {
      const m = genDungeon(f, 2041000 + f);
      ok(!hit(m.spawn[0] * T, m.spawn[1] * T, null, m), 'เกิดในกำแพง ชั้น ' + f);
      ok(linkReachable(m, m.links[0], reach(m, m.spawn[0], m.spawn[1])), 'วงเวทไปไม่ถึง ชั้น ' + f);
      const sx = Math.floor(m.arena.x), sy = Math.floor(m.arena.y); ok(reach(m, m.spawn[0], m.spawn[1])[sy * m.w + sx], 'ห้องบอสไปไม่ถึง ชั้น ' + f);
    }
    const a = genDungeon(7, 555), b = genDungeon(7, 555), c = genDungeon(7, 556);
    eq(a.grid.join(), b.grid.join(), 'รอบเดียวกันผังเดียวกัน'); ok(a.grid.join() !== c.grid.join(), 'รอบใหม่ผังเปลี่ยน');
  }],
  ['เมือง 2: ถนน → เรือ (Lv150) → นครวารี → ดันเมือง 2 → ออก = หน้าประตูมิติ → วงเวทใต้ = ท่าเรือ', () => {
    const G = fresh(); const blocked = []; on('world:blocked', e => blocked.push(e));
    follow(getMap('town').links.find(l => l.id === 'east'), G); eq(G.scene.id, 'road', 'ถนน'); eq(tiles(G.player.x, G.player.y), '2.2,12.5', 'ฝั่งตะวันตก');
    const ferry = getMap('road').links.find(l => l.id === 'ferry');
    eq(follow(ferry, G), false, 'Lv1 ขึ้นเรือไม่ได้'); eq(blocked.length, 1, 'แจ้งเลเวลไม่ถึง'); eq(blocked[0].lv, 150, 'Lv150');
    G.player.lv = 200; follow(ferry, G); eq(G.scene.id, 'city2', 'นครวารี'); eq(tiles(G.player.x, G.player.y), '42,56', 'ขึ้นจากเรือ');
    const p = getMap('city2').links.find(l => l.id === 'dg2'); follow(p, G); eq(G.scene.id, 'dg96c', 'ป้อมเพลิง');
    follow(G.scene.map.links.find(l => l.id === 'exit'), G); eq(G.scene.id, 'city2', 'กลับเมือง 2'); eq(tiles(G.player.x, G.player.y), p.front[0] + ',' + p.front[1], 'หน้าประตูมิติที่เข้า');
    follow(getMap('city2').links.find(l => l.id === 'exit'), G); eq(G.scene.id, 'road', 'ท่าเรือ'); eq(tiles(G.player.x, G.player.y), '110.5,12.5', 'ท่าเรือ');
    follow(getMap('road').links.find(l => l.id === 'town'), G); eq(G.scene.id, 'town', 'เมือง'); eq(tiles(G.player.x, G.player.y), '40,16.6', 'ประตูตะวันออก');
  }],
  ['ตลาดกลาง: ประตูใต้เมือง → ตลาด (22,2.9) → เดินขึ้น → เมือง (33,31)', () => {
    const G = fresh(); for (let i = 0; i < 30; i++) world.update(G, .05);
    G.player.x = 33 * T; G.player.y = 32.6 * T; world.update(G, .05);
    eq(G.scene.id, 'market', 'ตลาด'); eq(tiles(G.player.x, G.player.y), '22,2.9', 'จุดเกิด'); eq(G.player.dir, 'd', 'หันลง');
    for (let i = 0; i < 30; i++) world.update(G, .05);
    G.player.x = 22 * T; G.player.y = 1 * T; world.update(G, .05);
    eq(G.scene.id, 'town', 'เมือง'); eq(tiles(G.player.x, G.player.y), '33,31', 'หน้าประตูใต้');
  }],
  ['หอคอยรายชั้นใช้แมพเดียวกัน · ลานผนึก 6 แห่ง · แมพเฉพาะกิจ ออกแล้วกลับที่เดิม', () => {
    const G = fresh();
    follow(getMap('town').links.find(l => l.id === 'tower'), G); eq(G.scene.id, 'tower:1', 'หอคอยชั้น 1'); eq(G.scene.floor, 1, 'ชั้น');
    eq(getMap('tower:12').w, 30, 'ชั้น 12');
    follow(G.scene.map.links.find(l => l.id === 'exit'), G); eq(G.scene.id, 'town', 'ออกหอคอย'); eq(tiles(G.player.x, G.player.y), '38.5,9.2', 'หน้าหอคอย');
    follow(getMap('town').links.find(l => l.id === 'seal113'), G); eq(G.scene.id, 'shop.seal113', 'หอผนึก');
    const alt = getMap('shop.seal113').links.find(l => l.id === 'seal'); eq(alt.menu.length, 6, 'ลาน 6 แห่ง');
    for (const s of alt.menu) ok(getMap(s), 'มีลาน ' + s);
    for (const id of ['arena', 'duel', 'wboss']) { enter('town', null, G); G.player.x = 10 * T; G.player.y = 20 * T; follow({ to: id }, G); eq(G.scene.id, id, id); follow(G.scene.map.links.find(l => l.id === 'exit'), G); eq(G.scene.id + '@' + tiles(G.player.x, G.player.y), 'town@10,20', 'กลับที่เดิมจาก ' + id); }
  }],
  ['คลังสินค้า: กด E ไม่เปลี่ยนฉาก ส่ง world:use (เกมเดิมเปิดหน้าต่างคลัง)', () => {
    const G = fresh(); const ev = []; on('world:use', e => ev.push(e));
    const w = getMap('town').links.find(l => l.id === 'ware'); eq(follow(w, G), false, 'ไม่เปลี่ยนฉาก'); eq(G.scene.id, 'town', 'ยังอยู่เมือง'); eq(ev[0].id, 'ware', 'อีเวนต์');
  }],
  ['เซฟ/โหลด: ฉากถาวรกลับที่เดิม · ดันเจี้ยนกลับหน้าทางเข้า · ไม่มีเซฟ = เมือง', () => {
    let G = fresh(); enter('iron', null, G);
    let s = JSON.parse(JSON.stringify(world.save(G))); G = fresh(); world.load(G, s); eq(G.scene.id, 'iron', 'เหมืองถาวร');
    G = fresh(); follow(getMap('town').links.find(l => l.id === 'hall'), G); follow(getMap('shop.hall').links.find(l => l.id === 'dungeon'), G);
    s = JSON.parse(JSON.stringify(world.save(G))); G = fresh(); world.load(G, s); eq(G.scene.id, 'shop.hall', 'จากดัน → ท้องพระโรง'); eq(tiles(G.player.x, G.player.y), '16.41,10.4', 'หน้ารูปปั้น');
    G = fresh(); world.load(G, undefined); eq(G.scene.id, 'town', 'ตัวใหม่');
    eq(returnPoint('ไม่มี'), null, 'ไม่มีทางกลับ');
  }],
  ['ประตูที่ต้องใช้เลเวล: ภูเขาไฟ Lv50 จากขอบเหนือทุ่ง', () => {
    const G = fresh(); enter('field', null, G); const bl = []; on('world:blocked', e => bl.push(e));
    eq(follow(getMap('field').links.find(l => l.id === 'volcano'), G), false, 'Lv1 ไม่ได้'); eq(bl[0].lv, 50, 'Lv50');
    G.player.lv = 50; ok(follow(getMap('field').links.find(l => l.id === 'volcano'), G), 'Lv50 ได้'); eq(G.scene.id, 'volcano', 'ภูเขาไฟ');
  }],
];
