/* เทสเบราว์เซอร์ 1A-1 (จอ/กล้อง/ปุ่ม) · รัน: node v6/tests/browser/input.spec.js
   เปิด dev-server พอร์ตว่าง → เปิด /v6/ ใน Chromium จริง → กดปุ่มแบบผู้เล่น → เช็ก window.__G
   รูปแคปจอ → /tmp/v6-1a1-*.png (ไม่เก็บในโปรเจกต์) */
import { createRequire } from 'module';
import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(HERE, '..', '..', 'tools', 'dev-server.cjs');

let pass = 0, fail = 0;
const ok = (cond, name, info = '') => { if (cond) { pass++; console.log('  ✅', name); } else { fail++; console.log('  ❌', name, info); } };

function freePort() {
  return new Promise(r => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); });
}

/* ตัวจดปุ่มที่กด (pressed อยู่แค่ 1 เฟรม → ต้องจดทุกเฟรม) · ใส่จากเทสเท่านั้น */
const RECORDER = () => {
  window.__seen = []; window.__clicks = [];
  const tick = () => {
    const I = window.__G.input;
    for (const a of I.pressed) window.__seen.push(a);
    if (I.click) window.__clicks.push(I.click);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const wait = ms => new Promise(r => setTimeout(r, ms));

async function openGame(browser, url, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => window.__G && window.__G.time.frame > 5);
  await page.evaluate(RECORDER);
  return { ctx, page, errors };
}

(async () => {
  const port = await freePort();
  const srv = spawn(process.execPath, [SERVER, String(port)], { stdio: 'ignore' });
  await wait(400);
  const url = `http://127.0.0.1:${port}/v6/`;
  const browser = await chromium.launch();
  try {
    /* ===== คอม 1366×768 ===== */
    console.log('— คอม 1366×768');
    {
      const { ctx, page, errors } = await openGame(browser, url, { viewport: { width: 1366, height: 768 } });
      const v = await page.evaluate(() => { const c = window.__G.cam, cv = document.getElementById('c'); return { vw: c.vw, vh: c.vh, res: c.res, w: cv.width, h: cv.height, cssH: cv.getBoundingClientRect().height }; });
      ok(v.vw === 797 && v.vh === 448, 'จอโลก 797×448 (เท่าเกมเดิม)', JSON.stringify(v));
      ok(v.w === Math.round(v.vw * v.res) && v.h === Math.round(v.vh * v.res), 'canvas = VW×RES', JSON.stringify(v));
      ok(Math.abs(v.cssH - 768) <= 1, 'canvas เต็มความสูงหน้าต่าง', v.cssH);

      await page.keyboard.down('KeyD'); await page.keyboard.down('KeyW'); await wait(80);
      let I = await page.evaluate(() => ({ mx: window.__G.input.mx, my: window.__G.input.my, run: window.__G.input.run }));
      ok(I.mx === 1 && I.my === -1 && !I.run, 'กด D+W → เดินขวาบน', JSON.stringify(I));
      await page.keyboard.down('ControlLeft'); await wait(80);
      ok(await page.evaluate(() => window.__G.input.run), 'กด Ctrl ค้าง → วิ่ง');
      await page.keyboard.up('ControlLeft'); await page.keyboard.up('KeyD'); await page.keyboard.up('KeyW'); await wait(80);
      I = await page.evaluate(() => ({ mx: window.__G.input.mx, my: window.__G.input.my, run: window.__G.input.run }));
      ok(I.mx === 0 && I.my === 0 && !I.run, 'ปล่อยปุ่ม → หยุด', JSON.stringify(I));

      for (const k of ['KeyJ', 'Shift', 'KeyK', 'KeyE', 'Digit5', 'KeyU', 'KeyI', 'Escape']) { await page.keyboard.press(k); await wait(40); }
      await wait(80);
      const seen = await page.evaluate(() => window.__seen);
      ok(['attack', 'dash', 'skills', 'interact', 'skill1', 'ult', 'bag', 'menu'].every(a => seen.includes(a)), 'J Shift K E 5 U I Esc → attack dash skills interact skill1 ult bag menu', seen.join());
      ok(seen.filter(a => a === 'attack').length === 1, 'กดครั้งเดียว = pressed ครั้งเดียว (อยู่ 1 เฟรม)', seen.join());

      await page.keyboard.down('KeyJ'); await wait(300);
      ok(await page.evaluate(() => window.__G.input.held.has('attack')), 'กด J ค้าง → held มี attack');
      await page.keyboard.up('KeyJ');

      await page.mouse.click(683, 384); await wait(80);
      const ck = await page.evaluate(() => ({ k: window.__clicks.at(-1), cam: { ...window.__G.cam } }));
      ok(ck.k && Math.abs(ck.k.wx - (ck.cam.x + ck.cam.vw / 2)) < 2 && Math.abs(ck.k.wy - (ck.cam.y + ck.cam.vh / 2)) < 2,
        'คลิกกลางจอ → click = จุดกลางจอในโลก', JSON.stringify(ck.k));
      ok(await page.evaluate(() => window.__clicks.length === 1), 'คลิก 1 ครั้ง = click 1 เฟรม');

      await page.mouse.wheel(0, -500); await page.keyboard.down('Control'); await page.mouse.wheel(0, -500); await page.keyboard.up('Control'); await wait(80);
      const z = await page.evaluate(() => ({ zoom: window.__G.cam.zoom, vw: window.__G.cam.vw, dpr: devicePixelRatio }));
      ok(z.zoom === 1 && z.vw === 797 && z.dpr === 1, 'ล้อเมาส์/Ctrl+ล้อ ไม่ซูม', JSON.stringify(z));
      ok(await page.evaluate(() => getComputedStyle(document.getElementById('touch')).display === 'none'), 'คอมไม่แสดงจอย/ปุ่มบนจอ');
      await page.screenshot({ path: '/tmp/v6-1a1-desktop.png' });
      ok(errors.length === 0, 'ไม่มี error ในคอนโซล', errors.join(' | '));
      await ctx.close();
    }

    /* ===== มือถือแนวนอน 915×412 ===== */
    console.log('— มือถือแนวนอน 915×412');
    {
      const { ctx, page, errors } = await openGame(browser, url, { viewport: { width: 915, height: 412 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      const v = await page.evaluate(() => { const c = window.__G.cam, cv = document.getElementById('c'); return { vw: c.vw, vh: c.vh, res: c.res, w: cv.width, portrait: c.portrait }; });
      ok(v.vw === 995 && v.vh === 448 && !v.portrait, 'จอโลก 995×448 (วัดจากเกมเดิม)', JSON.stringify(v));
      ok(v.w === Math.round(995 * v.res), 'canvas = VW×RES', JSON.stringify(v));
      const box = await page.evaluate(() => {
        const r = id => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), vis: getComputedStyle(e).display !== 'none' && b.width > 0 }; };
        return { atk: r('atk'), dash: r('dashb'), sk1: r('sk1'), sk2: r('sk2'), sk3: r('sk3'), ult: r('ultb'), zone: r('joyzone'), hint: r('joyhint'), rot: getComputedStyle(document.getElementById('rot')).display };
      });
      ok(box.atk && box.atk.vis && box.atk.x === 835 && box.atk.y === 332 && box.atk.w === 68, 'ปุ่ม ⚔️ 68px ที่ (835,332) เท่าเกมเดิม', JSON.stringify(box.atk));
      ok(box.dash.x === 782 && box.dash.y === 358, 'ปุ่มพุ่ง (782,358)', JSON.stringify(box.dash));
      ok(box.sk1.x === 781 && box.sk1.y === 297 && box.sk2.x === 807 && box.sk2.y === 246 && box.sk3.x === 859 && box.sk3.y === 280, 'สกิล 1–3 ตำแหน่งเท่าเกมเดิม', JSON.stringify([box.sk1, box.sk2, box.sk3]));
      ok(box.zone.vis && box.zone.w === Math.round(915 * .42), 'พื้นที่จอย 42% กว้าง', JSON.stringify(box.zone));
      ok(box.hint.vis, 'วงใบ้ "ลากเพื่อเดิน" แสดง');
      ok(box.rot === 'none', 'แนวนอนไม่แสดงหน้าหมุนจอ');

      const cdp = await ctx.newCDPSession(page);
      const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) });
      /* ลากจอย: แตะ (150,300) ลากขวา 40px (ไม่สุด) */
      await touch('touchStart', [[150, 300]]); await touch('touchMove', [[190, 300]]); await wait(100);
      let I = await page.evaluate(() => ({ mx: window.__G.input.mx, my: window.__G.input.my, run: window.__G.input.run, base: getComputedStyle(document.getElementById('joybase')).display }));
      ok(I.mx > .3 && I.mx < .7 && Math.abs(I.my) < .01 && !I.run && I.base === 'block', 'ลากจอยขวาครึ่งทาง → เดินขวา ไม่วิ่ง', JSON.stringify(I));
      await touch('touchMove', [[150, 220]]); await wait(100);
      I = await page.evaluate(() => ({ mx: window.__G.input.mx, my: window.__G.input.my, run: window.__G.input.run }));
      ok(I.my < -.99 && I.run, 'ลากขึ้นสุด → เดินขึ้น + วิ่ง', JSON.stringify(I));
      await page.screenshot({ path: '/tmp/v6-1a1-mobile-joy.png' });
      /* นิ้วที่ 2 กดปุ่มตีระหว่างลากจอย (เล่นจริงใช้ 2 นิ้ว) */
      await touch('touchStart', [[150, 220], [869, 366]]); await wait(60);
      await touch('touchEnd', [[150, 220]]); await wait(60);
      await touch('touchEnd', []); await wait(100);
      I = await page.evaluate(() => ({ mx: window.__G.input.mx, my: window.__G.input.my, seen: window.__seen, held: [...window.__G.input.held] }));
      ok(I.seen.includes('attack'), 'นิ้วที่ 2 แตะ ⚔️ ระหว่างลากจอย → attack', I.seen.join());
      ok(I.mx === 0 && I.my === 0 && I.held.length === 0, 'ปล่อยทุกนิ้ว → หยุด ไม่มีปุ่มค้าง', JSON.stringify(I));
      await page.evaluate(() => { window.__seen.length = 0; });
      await page.tap('#sk2'); await page.tap('#dashb'); await wait(100);
      const seen = await page.evaluate(() => window.__seen);
      ok(seen.includes('skill2') && seen.includes('dash'), 'แตะสกิล 2 / พุ่ง', seen.join());
      ok(await page.evaluate(() => window.__clicks.length === 0), 'มือถือแตะจอไม่สร้าง click (คลิกเดินเฉพาะคอม)');
      await page.screenshot({ path: '/tmp/v6-1a1-mobile.png' });
      ok(errors.length === 0, 'ไม่มี error ในคอนโซล', errors.join(' | '));

      /* ===== หมุนเป็นแนวตั้ง ===== */
      console.log('— มือถือแนวตั้ง 412×915');
      /* แตะครั้งแรกเกมขอเต็มจอ (031:595) → ออกก่อน ไม่งั้นเครื่องเทสปรับขนาดหน้าต่างไม่ได้ */
      ok(await page.evaluate(() => !!document.fullscreenElement), 'แตะครั้งแรก → ขอเต็มจอ');
      await page.evaluate(() => document.exitFullscreen()); await wait(150);
      await page.setViewportSize({ width: 412, height: 915 }); await wait(250);
      const p = await page.evaluate(() => ({ portrait: window.__G.cam.portrait, vw: window.__G.cam.vw, rot: getComputedStyle(document.getElementById('rot')).display, touch: getComputedStyle(document.getElementById('touch')).display }));
      ok(p.portrait && p.rot === 'flex' && p.touch === 'none', 'แนวตั้ง → หน้า "หมุนจอ" + ซ่อนปุ่ม', JSON.stringify(p));
      ok(p.vw === 360, 'แนวตั้ง VW 360', p.vw);
      await page.screenshot({ path: '/tmp/v6-1a1-portrait.png' });
      await page.setViewportSize({ width: 915, height: 412 }); await wait(250);
      const back = await page.evaluate(() => ({ portrait: window.__G.cam.portrait, rot: getComputedStyle(document.getElementById('rot')).display, vw: window.__G.cam.vw }));
      ok(!back.portrait && back.rot === 'none' && back.vw === 995, 'หมุนกลับแนวนอน → เล่นต่อได้', JSON.stringify(back));
      await ctx.close();
    }
  } catch (e) {
    fail++; console.log('  ❌ เทสพังกลางทาง', e && e.stack);
  } finally {
    await browser.close();
    srv.kill();
  }
  console.log(`\nผ่าน ${pass} · พัง ${fail}`);
  process.exit(fail ? 1 : 0);
})();
