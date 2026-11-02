// ทดสอบว่าซิงค์เซฟล้มเหลวแล้วตารางยังอ่าน API ได้: node tests/leaderboard_test.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'js/051-fix20.js'), 'utf8');
const match = source.match(/^async function loadLb20.*$/m);
if (!match) throw new Error('ไม่พบ loadLb20');
const settle = source.match(/^async function settleLb20.*$/m);
if (!settle) throw new Error('ไม่พบ settleLb20');
const box = { Promise, setTimeout, clearTimeout };
vm.createContext(box);
vm.runInContext(match[0] + '\n' + settle[0], box);
let fail = 0;
const ok = (c, m) => { if (c) console.log('ok  ', m); else { console.log('FAIL', m); fail++; } };

(async () => {
  let topCalls = 0;
  const q1 = await box.loadLb20(() => Promise.reject(new Error('cloud save failed')), async () => { topCalls++; return { ok: true, k: [{ n: 'เพื่อน', v: 25 }] }; }, 50);
  ok(q1.syncErr === 'cloud save failed' && q1.top.ok && topCalls === 1 && q1.top.k[0].n === 'เพื่อน', 'ซิงค์เซฟล้มเหลว → ยังเรียก API และเก็บเหตุผลที่ล้มเหลว');

  const q2 = await box.loadLb20(() => new Promise(() => {}), async () => { topCalls++; return { ok: true, k: [] }; }, 5);
  ok(q2.syncPending && !q2.syncErr && q2.top.ok && topCalls === 2, 'ซิงค์เกินเวลารอ UI → ตารางยังโหลดได้และแสดงสถานะกำลังซิงค์ ไม่ฟันธงว่าล้มเหลว');

  const q3 = await box.loadLb20(async () => {}, async () => ({ ok: true, k: [] }), 50);
  ok(!q3.syncErr && q3.top.ok, 'ซิงค์ปกติ → ไม่มีคำเตือนและโหลดตารางได้');

  let finishSync;
  const q4 = await box.loadLb20(() => new Promise(resolve => { finishSync = resolve; }), async () => ({ ok: true, k: [] }), 5);
  finishSync();
  const settled = await q4.syncDone;
  ok(q4.syncPending && settled.ok, 'คำขอเกิน 8 วิแต่สำเร็จภายหลัง → ผลจริงยังส่งกลับให้ UI ล้างสถานะรอได้');

  const latest = await box.settleLb20(q4.syncDone, async () => ({ ok: true, k: [{ n: 'เรา', v: 38 }] }));
  ok(latest.state.ok && latest.top.k[0].v === 38, 'เซฟสำเร็จหลังหน้าตารางโหลดแล้ว → อ่านอันดับล่าสุดใหม่');

  const ui = fs.readFileSync(path.join(__dirname, '..', 'js/097-fix65.js'), 'utf8');
  ok(source.includes('await loadLb20(') && source.includes('CLOUD.lastError') && source.includes('settleLb20(q.syncDone') && ui.includes('LB20.syncPending?') && ui.includes('syncMsg65[LB20.syncErr]') && ui.includes("LB20.err==='rate'"), 'UI แยกสถานะรอ/ล้มเหลวและแสดงสาเหตุจริงจากเซิร์ฟเวอร์');
  console.log(fail ? `FAILED ${fail}` : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
