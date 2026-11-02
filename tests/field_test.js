// เทสเซิร์ฟเวอร์ field.js (ไม่ต้องใช้ ws): node tests/field_test.js
const F = require('../field');
const players = new Map(); const out = new Map();
const mk = (id, name, x, y, sc = 'field') => { const log = []; out.set(id, log); const p = { id, name, joined: true, sc, st: { x, y, dead: false }, ws: { readyState: 1, send: s => log.push(JSON.parse(s)) } }; players.set(id, p); return p; };
F.init({ players, send: (p, o) => p.ws.send(JSON.stringify(o)) });
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } else console.log('ok  ', m); };
const A = mk(1, 'เอ', 100, 100), B = mk(2, 'บี', 110, 100), C = mk(3, 'ซี', 100, 100, 'z:40');
const hit = (p, key, extra) => F.onMsg(p, Object.assign({ t: 'fhit', sc: p.sc, key, max: 3, dmg: 1, rg: 100, x: 100, y: 100 }, extra || {}), Date.now());
const last = id => out.get(id)[out.get(id).length - 1];
hit(A, 't5,5'); hit(B, 't5,5');
ok(last(1).hp === 1 && last(2).hp === 1 && !last(1).dead, 'สองคนตีต้นเดียวกัน เลือดลดรวมกัน (3→1) และทั้งสองเห็นตรงกัน');
ok(out.get(3).length === 0, 'คนอยู่คนละฉากไม่ได้รับข้อความ');
hit(B, 't5,5');
ok(last(1).dead === 1 && last(1).by === 2 && last(2).by === 2, 'คนตีครั้งสุดท้าย (บี) เป็นเจ้าของ · ทุกคนเห็นว่า บี ล้ม');
const n0 = out.get(1).length; hit(A, 't5,5');
ok(out.get(1).length === n0 + 1 && last(1).dead === 1 && last(1).by === 2, 'เอ ตีช้า → ไม่ได้ของ ได้สถานะ "บี ล้มแล้ว"');
hit(A, 't9,9', { x: 900, y: 900 }); ok(!F.NODES.get('field').has('t9,9'), 'ตีจุดไกลเกินระยะ → ไม่รับ');
hit(A, 'x1,1'); ok(!F.NODES.get('field').has('x1,1'), 'คีย์ผิดรูปแบบ → ไม่รับ');
hit(C, 'o1,1'); ok(F.NODES.has('z:40'), 'ฉากแมพเหมือง (z:40) ใช้ได้');
hit(A, 'o3,3', { max: 5, dmg: 999 }); ok(last(1).hp === 5 - 80 || last(1).dead === 1, 'ดาเมจถูกจำกัดเพดาน');
let c = 0; for (let i = 0; i < 20; i++) { hit(A, 't20,20', { max: 100 }); c++; }
ok(F.NODES.get('field').get('t20,20').hp >= 100 - 80 * 6, 'ตีถี่เกิน 6 ครั้ง/วิ ถูกตัดทิ้ง');
// สแนปช็อต
F.onMsg(B, { t: 'fq', sc: 'field' }, Date.now()); const sn = last(2);
ok(sn.t === 'fsnap' && sn.list.some(e => e.key === 't5,5' && e.dead === 1 && e.left > 0 && e.by === 2), 'คนเข้าฉากทีหลังได้สถานะต้นที่ล้มอยู่ + เวลางอกที่เหลือ');
// งอกใหม่: มีคนยืนทับ → เลื่อน
const node = F.NODES.get('field').get('t5,5'); node.rs = Date.now() - 1; node.x = 100; node.y = 100;
const nb = out.get(1).length; F.tick();
ok(F.NODES.get('field').has('t5,5') && out.get(1).length === nb, 'มีคนยืนทับ → ยังไม่งอก');
A.st.x = 1000; B.st.x = 1000; node.rs = Date.now() - 1; F.tick();
ok(!F.NODES.get('field').has('t5,5') && last(1).rs === 1 && last(1).dead === 0 && last(1).hp === 3, 'ไม่มีคนทับ → งอกใหม่ ทุกคนได้ประกาศ (hp เต็ม)');
// เลือดค้างฟื้น
const nd = F.NODES.get('field').get('t20,20'); nd.t = Date.now() - 61e3; F.tick();
ok(!F.NODES.get('field').has('t20,20'), 'ต้นที่ฟันค้างไว้ไม่มีใครแตะ 60 วิ → ฟื้นเลือดเต็ม');
// คนตายตีไม่ได้
A.st.dead = true; const nn = F.NODES.get('field').size; hit(A, 't7,7'); ok(F.NODES.get('field').size === nn, 'ผู้เล่นที่ตายแล้วตีไม่ได้');
console.log(fail ? ('FAILED ' + fail) : 'ALL PASS'); process.exit(fail ? 1 : 0);
