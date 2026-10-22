/* เทสเร็ว (~1 นาที): เปิดเกมจริง → รันเช็กกันบัคเก่ากลับมา REG136 ทุกข้อ + ดัก error ตอนโหลด
   ใช้ผ่าน tests/quick.sh (เซิร์ฟเวอร์ในเครื่องต้องเปิดอยู่ที่พอร์ต 8787) */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  const pg = await (await b.newContext({ viewport: { width: 915, height: 412 }, isMobile: true, hasTouch: true })).newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await pg.goto('http://127.0.0.1:8787/?server=ws://127.0.0.1:8787');
  await pg.waitForFunction(() => !window.FM_LOADING && window.REG136, null, { timeout: 180000 }); await pg.waitForTimeout(3000);
  const bad = await pg.evaluate(async () => { /* รันแบบเดียวกับบอท QA (163-fix136): await ทีละข้อ · เปิดอมตะ · คืนค่าตัวละครหลังจบ */
    const sv = { cls: P.cls, lv: P.lv, coin: inv.coin }, god = window.GM7 && GM7.god; try { if (window.GM7) GM7.god = true } catch (e) {}
    window.__qa154 = true; /* เหมือนบอท QA: หยุดเซฟขึ้นเซิร์ฟเวอร์ระหว่างเทส */ const out = []; for (const [name, fn] of REG136) { let m = null; try { m = await fn() } catch (e) { m = 'error ' + e.message } if (m) out.push(name + ' — ' + m) }
    try { P.cls = sv.cls; P.lv = sv.lv; inv.coin = sv.coin; recalcStats(); refreshInv() } catch (e) {} try { if (window.GM7) GM7.god = god } catch (e) {} return out });
  const n = await pg.evaluate(() => REG136.length); await b.close();
  for (const x of bad) console.log('REG FAIL', x); for (const e of errs) console.log('PAGE ERROR', e);
  console.log('REG136', n - bad.length + '/' + n, 'ผ่าน');
  process.exit(bad.length || errs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1) });
