// เทสกันโกง field.js (v5.13): เซิร์ฟเวอร์ใช้ตารางเลือด/ชั้นเครื่องมือ/ดาเมจของตัวเอง ไม่เชื่อค่าที่เครื่องส่ง
// รัน: node tests/field_kd_test.js
const path = process.argv[2] || '../field';
const F = require(path.startsWith('.') ? require('path').join(__dirname, path) : path);
const players = new Map(); const out = new Map();
const mk = (id, name, x, y, tier, sc = 'field') => { const log = []; out.set(id, log); const p = { id, name, joined: true, sc, st: { x, y, dead: false, tier: tier || { sword: 0, axe: 0, pick: 0 } }, ws: { readyState: 1, send: s => log.push(JSON.parse(s)) } }; players.set(id, p); return p; };
F.init({ players, send: (p, o) => p.ws.send(JSON.stringify(o)) });
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } else console.log('ok  ', m); };
const last = id => out.get(id)[out.get(id).length - 1];
let t0 = Date.now(); const tick = () => (t0 += 1500); // เลื่อนเวลาเอง จะได้ไม่ติดเพดาน 6 ครั้ง/วิ
const hit = (p, key, kd, extra) => F.onMsg(p, Object.assign({ t: 'fhit', sc: p.sc, key, kd, x: p.st.x, y: p.st.y, max: 1, dmg: 1, rg: 20 }, extra || {}), tick());
const A = mk(1, 'เอ', 100, 100, { sword: 0, axe: 0, pick: 0 });
const B = mk(2, 'บี', 100, 100, { sword: 0, axe: 6, pick: 6 });
const node = (sc, key) => F.NODES.get(sc) && F.NODES.get(sc).get(key);

hit(A, 't1,1', 't_large', { max: 1 });
ok(node('field', 't1,1') && node('field', 't1,1').max === 8, 'โกงส่ง max:1 → เซิร์ฟเวอร์ใช้เลือดต้นไม้ใหญ่จากตาราง (8) ไม่ใช่ 1');
ok(last(1).hp === 7 && !last(1).dead, 'ตีครั้งแรกเลือดเหลือ 7 ต้นยังไม่ล้ม (เดิมโกง max:1 แล้วล้มทันที)');
hit(A, 't2,2', 't_large', { dmg: 999 });
ok(node('field', 't2,2').hp === 8 - 7, 'โกงส่ง dmg:999 → ถูกตัดที่สูตรขวานชั้น 0 สูงสุด (1+0+ตีบวก 6 = 7) เลือด 8 เหลือ 1 ยังไม่ล้ม');
hit(A, 'o3,3', 'copper');
ok(!node('field', 'o3,3') && out.get(1).length === 2, 'ที่ขุดชั้น 0 ขุดแร่ทองแดง (ต้องชั้น 1) → ไม่รับ ไม่สร้างโหนดค้าง ไม่ตอบอะไร');
hit(B, 'o3,3', 'copper');
ok(node('field', 'o3,3') && node('field', 'o3,3').max === 8, 'ที่ขุดชั้น 6 ขุดทองแดงได้ · เลือดจากตาราง (8)');
hit(A, 'o4,4', 'treeG', { max: 1 }); hit(B, 'o4,4', 'treeG', { max: 1 });
ok(node('field', 'o4,4') && node('field', 'o4,4').max === 24, 'ต้นไม้ทวยเทพ: ขวานชั้น 6 ตัดได้ · เลือด 24 จากตาราง · ชั้น 0 ตัดไม่ได้');
hit(B, 't5,5', 'iron'); ok(!node('field', 't5,5'), 'คีย์ต้นไม้ทุ่ง (t…) แต่ kd เป็นแร่ → ไม่รับ');
hit(B, 'o6,6', 't_large'); ok(!node('field', 'o6,6'), 'คีย์แร่ (o…) แต่ kd เป็นต้นไม้ทุ่ง → ไม่รับ');
hit(B, 'o7,7', 'ของปลอม'); ok(!node('field', 'o7,7'), 'kd ที่ไม่มีในตาราง (ไม่ใช่ไม่ส่ง) → ไม่รับ');
hit(B, 'o8,8', 'stone', { rg: 20 });
ok(node('field', 'o8,8').rg === 90, 'โกงส่ง rg:20 (งอกเร็ว) → เซิร์ฟเวอร์ใช้เวลางอกแร่ทุ่งจากตาราง (90 วิ)');
const Z = mk(3, 'ซี', 100, 100, { sword: 0, axe: 6, pick: 6 }, 'z:40');
hit(Z, 'o9,9', 'treeS', { rg: 20 }); ok(node('z:40', 'o9,9').rg === 75, 'ต้นไม้ประจำแมพ: เวลางอก 75 วิจากตาราง');
hit(Z, 'o10,10', 'gold', { rg: 20 }); ok(node('z:40', 'o10,10').rg === 60, 'แร่ประจำแมพ: เวลางอก 60 วิจากตาราง');
// ฆ่าทีละดาเมจ: ที่ขุดชั้น 6 → ดาเมจสูงสุด 1+3+6=10 · ต้องใช้ 2 ครั้งกับทอง (เลือด 12) แม้ส่ง dmg:999
hit(Z, 'o11,11', 'gold', { dmg: 999 }); ok(!node('z:40', 'o11,11').dead && node('z:40', 'o11,11').hp === 2, 'ส่ง dmg:999 กับแร่ทอง (12) → ตัดเหลือ 10 → เลือดเหลือ 2 ยังไม่แตก');
// เกมรุ่นเก่า (ไม่ส่ง kd) ยังทำงานเหมือนเดิม
hit(B, 't12,12', undefined, { max: 3 }); ok(node('field', 't12,12') && node('field', 't12,12').max === 3, 'เกมรุ่นเก่าไม่ส่ง kd → ยังทำงานแบบเดิม (ไม่ค้าง)');
console.log(fail ? 'FAILED ' + fail : 'ALL PASS'); process.exit(fail ? 1 : 0);
