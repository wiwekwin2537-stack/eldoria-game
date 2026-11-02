// เทส WebSocket จริง (v5.12): เปิด server.js ตัวจริง + ผู้เล่นหลายคนต่อผ่าน ws จริง → ตรวจว่าต้นไม้/แร่ซิงค์กันจริง
// รัน: node tests/ws_integration_test.js   (ต้องมีแพ็กเกจ ws · ไฟล์ accounts/world/pvp/party/market ถ้าไม่มีในโฟลเดอร์ จะใช้ตัวปลอมแทนให้อัตโนมัติ)
const path = require('path'), Module = require('module'), fs = require('fs');
const root = path.join(__dirname, '..');
const noop = () => {}, no = () => false;
const STUB = {
  accounts: { middleware: no, setTopHook: noop, setGuildHook: noop },
  world: { init: noop, onMsg: no, onClose: noop },
  pvp: { init: noop, onMsg: no, onClose: noop, top: () => [], duelOk: no, ko: no },
  party: { init: noop, onMsg: no, onClose: noop, hostFor: () => 0, cleanHosts: noop },
  market: { init: noop, onMsg: no, onClose: noop },
};
const origLoad = Module._load;
Module._load = function (req, parent, isMain) {
  if (req === 'ws' && typeof WS !== 'undefined' && WS) return WS; /* server.js ขอ ws → ใช้ตัวที่หาเจอ (เผื่อไม่ได้ npm install ในโฟลเดอร์นี้) */
  const m = /^\.\/(accounts|world|pvp|party|market)$/.exec(req);
  if (m && parent && path.dirname(parent.filename) === root && !fs.existsSync(path.join(root, m[1] + '.js'))) return STUB[m[1]];
  return origLoad.apply(this, arguments);
};
let WS; try { WS = require('ws'); } catch (e) {
  for (const p of (process.env.NODE_PATH || '').split(path.delimiter).concat(['/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules'])) { try { WS = require(path.join(p, 'ws')); break; } catch (e2) {} }
}
if (!WS) { console.log('SKIP: ไม่พบแพ็กเกจ ws'); process.exit(0); }
const PORT = 20000 + Math.floor(Math.random() * 20000); process.env.PORT = PORT;
require(path.join(root, 'server.js'));
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } else console.log('ok  ', m); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
function client(name) {
  return new Promise((res, rej) => {
    const ws = new WS('ws://127.0.0.1:' + PORT), c = { ws, name, got: [], id: 0 };
    ws.on('message', raw => { const d = JSON.parse(raw); if (d.t === 'welcome') c.id = d.id; if (d.t !== 'snap') c.got.push(d); });
    ws.on('open', () => { c.send = o => ws.send(JSON.stringify(o)); c.send({ t: 'hi', name }); res(c); });
    ws.on('error', rej);
  });
}
const place = (c, sc, x, y) => c.send({ t: 'st', sc, x, y, dir: 'd', lv: 10 });
const fres = (c, key) => c.got.filter(d => d.t === 'fres' && d.key === key);
const hit = (c, sc, key, x, y, o) => c.send(Object.assign({ t: 'fhit', sc, key, x, y, max: 3, dmg: 1, rg: 100 }, o || {}));
(async () => {
  await sleep(300);
  const A = await client('เอ'), B = await client('บี'), C = await client('ซี');
  await sleep(100);
  place(A, 'field', 100, 100); place(B, 'field', 110, 100); place(C, 'z:40', 100, 100);
  await sleep(150);
  ok(A.id && B.id && C.id && A.id !== B.id, 'ทั้ง 3 คนต่อ WebSocket เข้าเซิร์ฟเวอร์จริงได้ และได้ id ไม่ซ้ำ');
  hit(A, 'field', 't5,5', 100, 100); await sleep(150);
  ok(fres(A, 't5,5').length === 1 && fres(B, 't5,5').length === 1, 'เอ ฟันต้นไม้ → ทั้ง เอ และ บี ได้ข้อความ fres ผ่านสายจริง');
  ok(fres(B, 't5,5')[0].hp === 2 && fres(B, 't5,5')[0].hb === A.id, 'เลือดต้นลด 3→2 และบอกว่าใครตี (hb = เอ)');
  ok(C.got.filter(d => d.t === 'fres').length === 0, 'ซี อยู่คนละฉาก (z:40) ไม่ได้รับ');
  hit(B, 'field', 't5,5', 110, 100); await sleep(80); hit(B, 'field', 't5,5', 110, 100); await sleep(150);
  const last = fres(A, 't5,5').pop();
  ok(last.dead === 1 && last.by === B.id && last.bn === 'บี', 'บี ฟันครั้งสุดท้าย → ต้นล้ม เจ้าของของ = บี · เอ เห็นตรงกัน');
  const n0 = fres(A, 't5,5').length; hit(A, 'field', 't5,5', 100, 100); await sleep(150);
  ok(fres(A, 't5,5').length === n0 + 1 && fres(A, 't5,5').pop().by === B.id && fres(B, 't5,5').length === n0, 'เอ ฟันซ้ำหลังล้ม → ไม่ได้ของ ได้สถานะ "บี ล้มแล้ว" เฉพาะตัวเอง (บี ไม่ถูกส่งซ้ำ)');
  hit(A, 'field', 't9,9', 900, 900); await sleep(120);
  ok(fres(A, 't9,9').length === 0, 'ส่งพิกัดไกลจากตัวจริง → เซิร์ฟเวอร์ไม่รับ');
  hit(C, 'field', 't1,1', 100, 100); await sleep(120);
  ok(fres(C, 't1,1').length === 0, 'ซี ยืนอยู่ z:40 แต่อ้างฉาก field → ไม่รับ');
  hit(C, 'z:40', 'o2,2', 100, 100); await sleep(120);
  ok(fres(C, 'o2,2').length === 1 && fres(A, 'o2,2').length === 0, 'แมพเหมือง z:40: ซีขุดแร่ ได้ผลเฉพาะคนในฉากนั้น');
  const D = await client('ดี'); await sleep(80); place(D, 'field', 105, 100); await sleep(100);
  D.send({ t: 'fq', sc: 'field' }); await sleep(150);
  const sn = D.got.filter(d => d.t === 'fsnap').pop();
  ok(sn && sn.list.some(e => e.key === 't5,5' && e.dead === 1 && e.by === B.id && e.left > 0), 'ดี เข้าฉากทีหลัง ขอ fq → ได้ fsnap เห็นต้นที่ บี ล้มไว้ + เวลางอกที่เหลือ');
  for (let i = 0; i < 12; i++) hit(A, 'field', 't30,30', 100, 100, { max: 500, dmg: 1 });
  await sleep(250);
  ok(fres(A, 't30,30').length <= 6, 'ยิง fhit รัว 12 ครั้งในรอบเดียว → เซิร์ฟเวอร์รับไม่เกิน 6 ครั้ง/วิ');
  B.ws.close(); await sleep(150);
  ok(true, 'บี หลุดการเชื่อมต่อ เซิร์ฟเวอร์ไม่ล่ม');
  hit(D, 'field', 't31,31', 105, 100); await sleep(120); /* ใช้ ดี (ยังไม่ติดเพดานความถี่) */
  ok(fres(D, 't31,31').length === 1, 'หลังมีคนหลุด เซิร์ฟเวอร์ยังตอบคนที่เหลือปกติ');
  for (const c of [A, C, D]) c.ws.close();
  console.log(fail ? ('FAILED ' + fail) : 'ALL PASS'); process.exit(fail ? 1 : 0);
})().catch(e => { console.log('ERROR', e); process.exit(1); });
