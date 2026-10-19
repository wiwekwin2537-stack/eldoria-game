// ทดสอบว่าซิงค์เซฟล้มเหลวแล้วตารางยังอ่าน API ได้: node tests/leaderboard_test.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'js/051-fix20.js'), 'utf8');
const match = source.match(/^async function loadLb20.*$/m);
if (!match) throw new Error('ไม่พบ loadLb20');
const box = { Promise, setTimeout, clearTimeout };
vm.createContext(box);
vm.runInContext(match[0], box);
let fail = 0;
const ok = (c, m) => { if (c) console.log('ok  ', m); else { console.log('FAIL', m); fail++; } };

(async () => {
  let topCalls = 0;
  const q1 = await box.loadLb20(() => Promise.reject(new Error('cloud save failed')), async () => { topCalls++; return { ok: true, k: [{ n: 'เพื่อน', v: 25 }] }; }, 50);
  ok(q1.syncErr && q1.top.ok && topCalls === 1 && q1.top.k[0].n === 'เพื่อน', 'ซิงค์เซฟล้มเหลว → ยังเรียก API และได้รายการอันดับพร้อมสถานะเตือน');

  const q2 = await box.loadLb20(() => new Promise(() => {}), async () => { topCalls++; return { ok: true, k: [] }; }, 5);
  ok(q2.syncErr && q2.top.ok && topCalls === 2, 'ซิงค์ค้างเกินเวลาที่กำหนด → ตารางยังโหลดได้');

  const q3 = await box.loadLb20(async () => {}, async () => ({ ok: true, k: [] }), 50);
  ok(!q3.syncErr && q3.top.ok, 'ซิงค์ปกติ → ไม่มีคำเตือนและโหลดตารางได้');

  const ui = fs.readFileSync(path.join(__dirname, '..', 'js/097-fix65.js'), 'utf8');
  ok(source.includes('await loadLb20(') && ui.includes('LB20.syncErr?') && ui.includes("LB20.err==='rate'"), 'UI ยังแสดงอันดับเมื่อ sync มีปัญหาและบอกสาเหตุ rate limit');
  console.log(fail ? `FAILED ${fail}` : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
