// กันตารางเลือดฝั่งเซิร์ฟเวอร์ (field.js KIND) ไม่ตรงกับเกม: อ่านค่าจริงจาก js/*.js แล้วเทียบ
// รัน: node tests/field_table_sync_test.js   (ต้องมีโฟลเดอร์ js/ ครบ — ถ้าไม่มี จะข้ามพร้อมบอก)
const fs = require('fs'), path = require('path'), F = require('../field');
const dir = path.join(__dirname, '..', 'js');
if (!fs.existsSync(path.join(dir, '015-core.js'))) { console.log('SKIP: ไม่มี js/015-core.js (ต้องรันในโปรเจกต์เต็ม)'); process.exit(0); }
const all = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } else console.log('ok  ', m); };
// แร่ + ต้นไม้ประจำแมพ: OREK ชื่อ:{ ... req:N,hp:N ... } (ทั้งก้อน const OREK={...} และ OREK.xxx={...})
const found = {};
const blk = all.match(/const OREK=\{([\s\S]*?)\};/); if (blk) for (const m of blk[1].matchAll(/(\w+):\{[^}]*?req:(\d+),hp:(\d+)[^}]*\}/g)) found[m[1]] = { req: +m[2], hp: +m[3], tree: /tree:1/.test(m[0]) };
for (const m of all.matchAll(/OREK\.(\w+)=\{[^}]*?req:(\d+),hp:(\d+)[^}]*\}/g)) found[m[1]] = { req: +m[2], hp: +m[3], tree: /tree:1/.test(m[0]) };
ok(Object.keys(found).length >= 12, 'อ่าน OREK จากเกมได้ ' + Object.keys(found).length + ' ชนิด');
for (const [k, v] of Object.entries(found)) { const K = F.KIND[k]; ok(!!K && K.hp === v.hp && K.req === v.req && !!K.axe === v.tree, `${k}: เกม hp ${v.hp} ชั้น ${v.req} ${v.tree ? 'ขวาน' : 'ที่ขุด'} ↔ เซิร์ฟเวอร์ ${K ? `hp ${K.hp} ชั้น ${K.req} ${K.axe ? 'ขวาน' : 'ที่ขุด'}` : 'ไม่มี'}`); }
for (const k of Object.keys(F.KIND)) if (!k.startsWith('t_')) ok(!!found[k], `${k}: ตารางเซิร์ฟเวอร์มีชนิดนี้ และเกมก็มี (ไม่เหลือตัวที่เกมลบไปแล้ว)`);
// ต้นไม้ทุ่ง: hp:[2,3,5,8][sz] กับชื่อขนาด
const tr = all.match(/size:\['tiny','small','medium','large'\]\[sz\],sc:\[[^\]]*\]\[sz\],hp:\[([\d,]+)\]\[sz\]/);
ok(!!tr, 'พบสูตรเลือดต้นไม้ทุ่งในเกม');
if (tr) tr[1].split(',').forEach((h, i) => { const n = ['tiny', 'small', 'medium', 'large'][i], K = F.KIND['t_' + n]; ok(K && K.hp === +h, `ต้นไม้ทุ่ง ${n}: เกม ${h} ↔ เซิร์ฟเวอร์ ${K && K.hp}`); });
// สูตรดาเมจเครื่องมือ: 1+(tier>>1)+enhT7 · ตีบวกสูงสุด 20 → floor(20/3)
ok(/AXEDMG=\(\)=>1\+\(P\.tier\.axe>>1\)\+\(window\.enhT7\?enhT7\('axe'\):0\)/.test(all) && /PICKDMG=\(\)=>1\+\(P\.tier\.pick>>1\)/.test(all), 'สูตรดาเมจขวาน/ที่ขุดในเกมยังเป็น 1+(tier>>1)+enhT7 (ตรงกับเพดานฝั่งเซิร์ฟเวอร์)');
ok(/function enhTool7\(l\)\{return Math\.floor\(l\/3\)\}/.test(all) && /ENH\[id\]>20\)ENH\[id\]=20/.test(all), 'enhTool7 = floor(l/3) และตีบวกตันที่ 20 → เพดานโบนัส 6');
console.log(fail ? 'FAILED ' + fail : 'ALL PASS'); process.exit(fail ? 1 : 0);
