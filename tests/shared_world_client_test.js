// เทสตรรกะฝั่งเกมของโลกร่วมกัน (js/185-shared-world.js) ด้วยตัวจำลอง: node tests/shared_world_client_test.js
const vm = require('vm'), fs = require('fs'), path = require('path');
const R = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } else console.log('ok  ', m); };
function world() {
  const sent = [], said = [], drops = [], xp = [], ev = [];
  const W = 20, H = 20, T = 32, TREE = 5, STUMP = 6, ORE = 7, RUBBLE = 8, GRASS = 0;
  const map = Array.from({ length: H }, () => Array(W).fill(GRASS)); const trees = [], treeAt = {}, ores = [], oreAt = {}, falling = [], fx = [];
  const mkT = (x, y) => { map[y][x] = TREE; const t = { id: trees.length + 1, tx: x, ty: y, px: x * T + 16, size: 'medium', sc: .9, hp: 5, max: 5, wood: 3, alive: true, border: false, fade: 0, shake: 0, bar: 0 }; trees.push(t); treeAt[y * W + x] = t; return t; };
  const mkO = (x, y) => { map[y][x] = ORE; const o = { id: ores.length + 1, tx: x, ty: y, kind: 'stone', hp: 4, max: 4, shake: 0, bar: 0, regen: 0 }; ores.push(o); oreAt[y * W + x] = o; return o; };
  const tree = mkT(3, 3), ore = mkO(6, 6);
  const ZW = 30, zores = [], zoreAt = {};
  const zo = (x, y, kind) => { const o = { tx: x, ty: y, x: x * T + 16, y: y * T + 16, kind, hp: 3, max: 3, alive: true, regen: 0, shake: 0 }; zores.push(o); zoreAt[y * ZW + x] = o; return o; };
  const zOre = zo(4, 4, 'stone'), zTree = zo(8, 8, 'treeE');
  const ctx = { console, performance: { now: () => Date.now() }, Math, JSON, Map, Set, Date,
    T, W, H, TREE, STUMP, ORE, RUBBLE, map, trees, treeAt, ores, oreAt, falling, fx, ZW,
    P: { x: 100, y: 100, name: 'me', tier: { axe: 3, pick: 3 } }, NET: { on: true, id: 7, ws: {} }, D: null,
    OREK: { stone: { n: 'หิน', cnt: [2, 2], drop: 'stone', xp: 5 }, treeE: { n: 'ต้นไม้', cnt: [2, 2], drop: 'wood', xp: 4, tree: true } },
    netSend: o => sent.push(o), sfx() {}, say: m => said.push(m), addDrop: (t, x, y) => drops.push(t), gainXp: n => xp.push(n), MN: k => k, st20Add() {}, questEv: e => ev.push(e),
    AXEDMG: () => 2, SZN: { medium: 'ต้นไม้' }, REG136: [], FALL89: [], setInterval: () => 0 };
  ctx.window = ctx; ctx.netScene = () => ctx._sc; ctx._sc = 'field'; ctx.netMsg = () => { ctx._passed = true; };
  vm.createContext(ctx);
  vm.runInContext(R('js/185-shared-world.js'), ctx);
  // เอา hitTree ตัวจริงจากไฟล์ระบบมาลองด้วย
  const src = R('js/016-core.js'), m = src.match(/function hitTree\(tr\)\{[\s\S]*?\n else say\('ฟัน'\+SZN\[tr\.size\]\+' เหลืออีก '\+tr\.hp\+' ที'\)\}/);
  if (!m) throw new Error('หา hitTree ไม่เจอ'); vm.runInContext(m[0], ctx);
  return { ctx, sent, said, drops, xp, ev, tree, ore, zOre, zTree, FW: ctx.FW, map, falling, zores, zoreAt, set sc(v) { ctx._sc = v; } };
}
const fsnap = (sc, list) => ({ t: 'fsnap', sc, list });
{ // 1) ยังไม่ได้ต่อเซิร์ฟเวอร์/ไม่ตอบ fsnap → ทำงานแบบเดิมในเครื่อง
  const w = world(); ok(w.FW.act() === false, 'ยังไม่มี fsnap → FW.act()=false (โหมดเดิมในเครื่อง)');
  w.ctx.hitTree(w.tree); w.ctx.hitTree(w.tree); w.ctx.hitTree(w.tree); ok(w.tree.alive === false && w.map[3][3] === 6 && w.falling.length === 1, 'โหมดเดิม: ต้นไม้ล้มในเครื่องเมื่อเลือดหมด');
}
{ // 2) โหมดเซิร์ฟเวอร์: ตีแล้วส่ง fhit · ไม่ล้มเองจนกว่าเซิร์ฟเวอร์จะบอก
  const w = world(); w.ctx.netMsg(fsnap('field', [])); /* ผ่าน wrapper */ 
  w.ctx.netMsg(fsnap('field', [])); w.FW.onSnap(fsnap('field', [])); ok(w.FW.act() === true, 'ได้ fsnap แล้ว → FW.act()=true');
  for (let i = 0; i < 4; i++) w.ctx.hitTree(w.tree);
  ok(w.sent.filter(s => s.t === 'fhit').length === 4 && w.sent[0].key === 't3,3' && w.sent[0].sc === 'field' && w.sent[0].max === 5, 'ส่ง fhit ทุกครั้งที่ตี (คีย์ t3,3 · ฉาก field · max=5)');
  ok(w.tree.alive === true && w.map[3][3] === 5 && w.falling.length === 0, 'เลือดเครื่องหมดแล้วแต่ยังไม่ล้ม — รอเซิร์ฟเวอร์ตัดสิน');
  // เซิร์ฟเวอร์: คนอื่น (id 9) ฟันล้ม → เราไม่ได้ไม้
  w.FW.onRes({ t: 'fres', sc: 'field', key: 't3,3', hp: 0, max: 5, dead: 1, by: 9, bn: 'เพื่อน', left: 100000 });
  ok(w.tree.alive === false && w.map[3][3] === 6 && w.falling.length === 1 && w.falling[0].own === false && w.falling[0].bn === 'เพื่อน', 'คนอื่นฟันล้ม: ต้นไม้ล้มให้เราเห็น · own=false (ไม่ได้ไม้)');
  // งอกใหม่จากเซิร์ฟเวอร์
  w.FW.onRes({ t: 'fres', sc: 'field', key: 't3,3', hp: 5, max: 5, dead: 0, rs: 1 });
  ok(w.tree.alive === true && w.map[3][3] === 5 && w.tree.hp === 5, 'เซิร์ฟเวอร์สั่งงอก: ต้นไม้กลับมา เลือดเต็ม');
  // เราเป็นคนล้ม
  w.FW.onRes({ t: 'fres', sc: 'field', key: 't3,3', hp: 0, max: 5, dead: 1, by: 7, bn: 'me', left: 100000 });
  ok(w.falling.length === 1 && w.falling[0].own === true, 'เราฟันล้มเอง: own=true (ได้ไม้ตอนต้นกระแทกพื้น)');
}
{ // 3) แร่ทุ่งหญ้า: คนอื่นขุดได้ก่อน → ไม่ได้ของ · เราขุดได้ → ได้ของ
  const w = world(); w.FW.onSnap(fsnap('field', []));
  w.FW.onRes({ t: 'fres', sc: 'field', key: 'o6,6', hp: 0, max: 4, dead: 1, by: 9, bn: 'เพื่อน', left: 90000 });
  ok(w.map[6][6] === 8 && w.drops.length === 0 && w.xp.length === 0, 'คนอื่นขุดแร่แตก: เห็นกองหินพัง · เราไม่ได้ของ/XP');
  w.FW.onRes({ t: 'fres', sc: 'field', key: 'o6,6', hp: 4, max: 4, dead: 0, rs: 1 });
  w.FW.onRes({ t: 'fres', sc: 'field', key: 'o6,6', hp: 0, max: 4, dead: 1, by: 7, bn: 'me', left: 90000 });
  ok(w.drops.length === 2 && w.xp.length === 1 && w.ev.includes('mine'), 'เราขุดแตกเอง: ได้ของ 2 ชิ้น + XP + นับเควสขุดแร่');
}
{ // 4) แมพเหมือง (z:40): แร่ + ต้นไม้
  const w = world(); w.sc = 'z:40'; w.ctx.D = { zone: { zi: 40, oreAt: w.zoreAt, ores: w.zores } }; w.FW.onSnap(fsnap('z:40', []));
  ok(w.FW.act() === true, 'ในแมพเหมือง z:40 ใช้โหมดเซิร์ฟเวอร์ได้');
  w.FW.onRes({ t: 'fres', sc: 'z:40', key: 'o4,4', hp: 0, max: 3, dead: 1, by: 7, bn: 'me', left: 60000 });
  ok(w.zOre.alive === false && w.drops.includes('stone'), 'เหมือง: เราขุดแร่แตก → ได้ของ');
  w.FW.onRes({ t: 'fres', sc: 'z:40', key: 'o8,8', hp: 0, max: 3, dead: 1, by: 9, bn: 'เพื่อน', left: 60000 });
  ok(w.zTree.alive === false && !w.drops.includes('wood') && w.ctx.FALL89.length === 1, 'เหมือง: เพื่อนตัดต้นไม้ล้ม → เห็นต้นล้ม แต่ไม่ได้ไม้');
  w.FW.onRes({ t: 'fres', sc: 'z:41', key: 'o4,4', hp: 3, max: 3, dead: 0, rs: 1 }); ok(w.zOre.alive === false, 'ข้อความของฉากอื่นถูกเมิน');
}
{ // 5) เข้าฉากทีหลัง: สแนปช็อตตั้งสถานะให้ตรง + ล้างสถานะเก่าที่ค้างในเครื่อง
  const w = world(); w.tree.alive = false; w.map[3][3] = 6; /* ต้นนี้ตายค้างในเครื่อง แต่เซิร์ฟเวอร์บอกว่ายังอยู่ */
  w.FW.onSnap(fsnap('field', [{ key: 'o6,6', hp: 0, max: 4, dead: 1, left: 50000, by: 9, bn: 'x' }, { key: 't5,5', hp: 2, max: 5, dead: 0, left: 0 }]));
  w.FW.onSnap(fsnap('field', [{ key: 'o6,6', hp: 0, max: 4, dead: 1, left: 50000, by: 9, bn: 'x' }])); w.FW._t.trySnap();
  ok(w.map[6][6] === 8 && w.ore.regen >= 49, 'สแนปช็อต: แร่ที่ถูกขุดไปแล้วแสดงเป็นกองหิน (เหลือเวลางอก ~50 วิ)');
  ok(w.tree.alive === true && w.map[3][3] === 5, 'สแนปช็อต: ต้นที่เซิร์ฟเวอร์ว่ายังอยู่ แต่เครื่องเราว่าตายค้าง → ฟื้นให้ตรง');
}
// ตรวจว่าจุดตัด/ขุดในไฟล์ระบบถามเซิร์ฟเวอร์จริง ๆ
const need = [['js/016-core.js', /function hitTree[\s\S]{0,200}FW\.act\(\)[\s\S]{0,60}FW\.send\('t'/], ['js/031-core.js', /function hitOre[\s\S]{0,700}FW\.send\('o'/], ['js/031-core.js', /function zMine[\s\S]{0,600}FW\.send\('o'/], ['js/046-fix15.js', /function chop15[\s\S]{0,500}FW\.send\('o'/], ['js/016-core.js', /f\.own!==false/], ['js/176-fix149.js', /FW\.act\(\)\)return/]];
need.push(['js/185-shared-world.js', /FW\.send=[\s\S]{0,400}kd:o\.kind\|\|\('t_'\+o\.size\)/]); /* v5.13: ส่งชนิดโหนด (kd) ให้เซิร์ฟเวอร์ใช้ตารางของตัวเอง */
for (const [f, re] of need) ok(re.test(R(f)), f + ' ถาม/ส่งเซิร์ฟเวอร์ตามแบบ ' + re.source.slice(0, 40));
console.log(fail ? 'FAILED ' + fail : 'ALL PASS'); process.exit(fail ? 1 : 0);
