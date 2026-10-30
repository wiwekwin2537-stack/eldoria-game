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
  window.__seen = []; window.__clicks = []; window.__mx = [];
  const tick = () => {
    const I = window.__G.input;
    for (const a of I.pressed) window.__seen.push(a);
    window.__mx.push(I.mx);
    if (I.click) window.__clicks.push({ ...I.click, camx: window.__G.cam.x, camy: window.__G.cam.y }); /* กล้องของเฟรมที่คลิก (คลิกเดินแล้วกล้องเลื่อน) */
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const wait = ms => new Promise(r => setTimeout(r, ms));

async function openGame(browser, url, opts, init) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  if (init) await page.addInitScript(init);
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
      const ck = await page.evaluate(() => { const k = window.__clicks.at(-1); return { k, cam: { x: k && k.camx, y: k && k.camy, vw: window.__G.cam.vw, vh: window.__G.cam.vh } }; });
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
    /* ===================== 1A-1f (แก้ตามผลตรวจ) ===================== */
    const MOB = { viewport: { width: 915, height: 412 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
    /* จำกัด rAF ของทั้งหน้า (ทุก callback ในเฟรมเดียวกันผ่านพร้อมกัน) · gaps = ระยะห่างขั้นต่ำ ms วนตามลำดับ */
    const THROTTLE = gaps => {
      const raf = window.requestAnimationFrame.bind(window);
      let last = -1e9, i = 0;
      const ok = t => { if (t === last) return true; if (t - last >= gaps[i % gaps.length] - 4) { last = t; i++; return true; } return false; };
      window.requestAnimationFrame = cb => raf(function f(t) { if (ok(t)) cb(t); else raf(f); });
    };

    console.log('— 1A-1f คุณภาพอัตโนมัติ (คอม · จำกัด 30 FPS แบบโหมดประหยัดแบต vs กระตุกจริง)');
    {
      const [A, B] = await Promise.all([
        openGame(browser, url, { viewport: { width: 1366, height: 768 } }, `(${THROTTLE})([1000/30])`),
        openGame(browser, url, { viewport: { width: 1366, height: 768 } }, `(${THROTTLE})([1000/60, 50])`),
      ]);
      const r0 = await Promise.all([A.page, B.page].map(p => p.evaluate(() => window.__G.cam.res)));
      await wait(8500);
      const r1 = await Promise.all([A.page, B.page].map(p => p.evaluate(() => window.__G.cam.res)));
      const fpsA = await A.page.evaluate(() => { const t = []; return new Promise(r => { const f = n => { t.push(n); if (t.length < 31) requestAnimationFrame(f); else r(30000 / (t[30] - t[0])); }; requestAnimationFrame(f); }); });
      ok(fpsA > 26 && fpsA < 34, 'เครื่องทดสอบ A เดินที่ ~30 FPS จริง', fpsA.toFixed(1));
      ok(r1[0] === r0[0], 'จำกัด 30 FPS นิ่ง 8.5 วิ → ไม่ลดคุณภาพ (30 = เป้ามือถือ spec01 §1)', `${r0[0]} → ${r1[0]}`);
      ok(r1[1] < r0[1], 'กระตุกเฉลี่ย ~30 บนจอ 60Hz → ลดคุณภาพ 1 ขั้น (เหมือนเกมเดิม)', `${r0[1]} → ${r1[1]}`);
      await A.ctx.close(); await B.ctx.close();
    }

    console.log('— 1A-1f คอม: ปุ่ม/กันซูม/คลิกหลายจุด');
    {
      const { ctx, page, errors } = await openGame(browser, url, { viewport: { width: 1366, height: 768 } });
      /* กันซูม: เช็ก defaultPrevented ตรงๆ (headless ไม่ซูมจริงอยู่แล้ว ดูแค่ zoom ไม่พิสูจน์อะไร) */
      const z = await page.evaluate(() => {
        const key = (code, k, ctrl) => { const e = new KeyboardEvent('keydown', { code, key: k, ctrlKey: ctrl, bubbles: true, cancelable: true }); document.body.dispatchEvent(e); return e.defaultPrevented; };
        const wheel = ctrl => { const e = new WheelEvent('wheel', { deltaY: -100, ctrlKey: ctrl, bubbles: true, cancelable: true }); document.getElementById('c').dispatchEvent(e); return e.defaultPrevented; };
        return { thPlus: key('Equal', 'ช', true), thMinus: key('Minus', 'ข', true), th0: key('Digit0', 'จ', true), enPlus: key('Equal', '=', true),
          plainMinus: key('Minus', '-', false), wheelCtrl: wheel(true), wheelPlain: wheel(false) };
      });
      ok(z.thPlus && z.thMinus && z.th0 && z.enPlus, 'Ctrl + = - 0 (แป้นไทย ช ข จ และแป้นอังกฤษ) ถูกกันซูม', JSON.stringify(z));
      ok(!z.plainMinus, 'กด - เฉยๆ ไม่ถูกกัน (กันเฉพาะตอนมี Ctrl)', JSON.stringify(z));
      ok(z.wheelCtrl && !z.wheelPlain, 'Ctrl+ล้อ ถูกกัน · ล้อเฉยๆ ไม่ถูกกัน', JSON.stringify(z));

      /* ปล่อยปุ่มค้างตอนซ่อนแท็บ / pagehide (ไม่มี blur) */
      await page.keyboard.down('KeyA'); await wait(80);
      const held0 = await page.evaluate(() => window.__G.input.mx);
      await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
      await wait(80);
      const h1 = await page.evaluate(() => window.__G.input.mx);
      await page.evaluate(() => { delete document.hidden; });
      await page.keyboard.up('KeyA');
      ok(held0 === -1 && h1 === 0, 'กด A ค้าง → ซ่อนแท็บ (visibilitychange) → หยุดเดิน', `${held0} → ${h1}`);
      await page.keyboard.down('KeyD'); await wait(80);
      await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide')));
      await wait(80);
      ok(await page.evaluate(() => window.__G.input.mx) === 0, 'กด D ค้าง → pagehide → หยุดเดิน');
      await page.keyboard.up('KeyD');

      /* กด/ปล่อยภายในเฟรมเดียว */
      await page.evaluate(() => { window.__seen.length = 0; window.__mx.length = 0; });
      await page.evaluate(() => {
        const k = (t, code) => dispatchEvent(new KeyboardEvent(t, { code, key: 'x', bubbles: true, cancelable: true }));
        for (let i = 0; i < 3; i++) { k('keydown', 'KeyJ'); k('keyup', 'KeyJ'); }
        k('keydown', 'KeyD'); k('keyup', 'KeyD');
      });
      await wait(150);
      const q = await page.evaluate(() => ({ atk: window.__seen.filter(a => a === 'attack').length, steps: window.__mx.filter(v => v === 1).length }));
      ok(q.atk === 3, 'กด J 3 ครั้งก่อนเฟรมถัดไป → attack 3 ครั้ง (ไม่หาย)', JSON.stringify(q));
      ok(q.steps === 1, 'แตะ D สั้นกว่า 1 เฟรม → เดินขวา 1 เฟรม', JSON.stringify(q));

      /* คลิกหลายจุด: คำนวณจุดคาดหวังจากเรขาคณิตเอง (ไม่ใช้สูตรในเกม) */
      const k = 768 / 448, vw = 797; /* 1366×768 → 797×448 · canvas เต็มสูง กว้าง round(797·k) กึ่งกลาง */
      const left = Math.floor((1366 - Math.round(vw * k)) / 2);
      let worst = 0;
      for (const [x, y] of [[1, 1], [1365, 767], [1365, 1], [1, 767], [400, 600]]) {
        await page.evaluate(() => { window.__clicks.length = 0; });
        await page.mouse.click(x, y); await wait(60);
        const r = await page.evaluate(() => { const c = window.__clicks[0]; return { c, x: c && c.camx, y: c && c.camy }; });
        if (!r.c) { worst = 1e9; break; }
        worst = Math.max(worst, Math.abs(r.c.wx - (r.x + (x - left) / k)), Math.abs(r.c.wy - (r.y + y / k)));
      }
      ok(worst < .7, 'คลิก 5 จุด (4 มุม + ซ้ายล่าง) → พิกัดโลกถูก (คลาด < .7 px)', worst);
      ok(errors.length === 0, 'ไม่มี error ในคอนโซล', errors.join(' | '));
      await ctx.close();
    }

    console.log('— 1A-1f จอกว้างมาก 2400×700 (มีขอบดำ) คลิกหลายจุด');
    {
      const { ctx, page } = await openGame(browser, url, { viewport: { width: 2400, height: 700 } });
      const k = 700 / 448, vw = Math.round(448 * 2.4), left = Math.floor((2400 - Math.round(vw * k)) / 2);
      ok(await page.evaluate(() => window.__G.cam.vw) === vw && left === 360, 'จอกว้างสุด 1075 · ขอบดำซ้าย 360px');
      let worst = 0;
      for (const [x, y] of [[361, 1], [2039, 699], [1200, 350], [2039, 1]]) {
        await page.evaluate(() => { window.__clicks.length = 0; });
        await page.mouse.click(x, y); await wait(60);
        const r = await page.evaluate(() => { const c = window.__clicks[0]; return { c, x: c && c.camx, y: c && c.camy }; });
        if (!r.c) { worst = 1e9; break; }
        worst = Math.max(worst, Math.abs(r.c.wx - (r.x + (x - left) / k)), Math.abs(r.c.wy - (r.y + y / k)));
      }
      ok(worst < .7, 'คลิก 4 จุดบนจอที่มีขอบดำ → พิกัดโลกถูก', worst);
      await ctx.close();
    }

    console.log('— 1A-1f มือถือ: safe-area iPhone');
    {
      const { ctx, page } = await openGame(browser, url, MOB);
      const cdp = await ctx.newCDPSession(page);
      let emu = true;
      try { await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 0, left: 47, right: 47, bottom: 21 } }); } catch (e) { emu = false; }
      await wait(150);
      const b = await page.evaluate(() => { const r = id => document.getElementById(id).getBoundingClientRect(); return { atk: r('atk'), zone: r('joyzone'), hint: r('joyhint'), st: document.getElementById('acts').style.right }; });
      if (emu) {
        ok(Math.round(b.atk.left) === 835 - 47 && Math.round(b.atk.top) === 332 - 21, 'ขอบบาก 47 / ขีด Home 21 → ปุ่ม ⚔️ ขยับเข้า (788,311)', JSON.stringify(b.atk));
        ok(Math.round(b.zone.left) === 47 && Math.round(b.zone.bottom) === 412 - 21, 'พื้นที่จอยเว้นรอยบากซ้าย + ขีด Home', JSON.stringify(b.zone));
        ok(Math.round(b.hint.left) === 26 + 47, 'วงใบ้จอยเว้นรอยบาก', JSON.stringify(b.hint));
      } else ok(/safe-area-inset-right/.test(b.st), '(เบราว์เซอร์เทสจำลอง safe-area ไม่ได้) ปุ่มใช้ env(safe-area-inset-right)', b.st);
      await ctx.close();
    }

    console.log('— 1A-1f มือถือ: สองนิ้ว · ลากสองนิ้ว · resize กลางลาก · ไม่แตะ DOM ทุกเฟรม · joySide/joyRun');
    {
      const { ctx, page, errors } = await openGame(browser, url, MOB);
      const cdp = await ctx.newCDPSession(page);
      const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y, id]) => ({ x, y, id })) });
      /* แตะครั้งแรกขอเต็มจอ → ออกก่อน (ไม่งั้นเปลี่ยนขนาดหน้าต่างไม่ได้) */
      await touch('touchStart', [[600, 100, 9]]); await touch('touchEnd', []); await wait(120);
      await page.evaluate(() => document.fullscreenElement && document.exitFullscreen()); await wait(150);

      /* ไม่แตะ DOM ทุกเฟรม: นับการเขียน style.display ของ #touch/#joyhint/#rot ช่วง 0.5 วิ */
      const writes = await page.evaluate(() => new Promise(res => {
        let n = 0;
        for (const id of ['touch', 'joyhint', 'rot']) {
          const st = document.getElementById(id).style;
          Object.defineProperty(st, 'display', { configurable: true, get: () => st.getPropertyValue('display'), set: v => { n++; st.setProperty('display', v); } });
        }
        setTimeout(() => { for (const id of ['touch', 'joyhint', 'rot']) delete document.getElementById(id).style.display; res(n); }, 500);
      }));
      ok(writes === 0, 'ไม่มีอะไรเปลี่ยน → ไม่เขียน style.display เลยใน 0.5 วิ', writes);

      /* สองนิ้วกดปุ่ม ⚔️ เดียวกัน ยกนิ้วแรก → ยังค้าง */
      await touch('touchStart', [[862, 360, 1]]); await touch('touchStart', [[862, 360, 1], [876, 372, 2]]); await wait(80);
      await touch('touchEnd', [[876, 372, 2]]); await wait(80);
      const h1 = await page.evaluate(() => window.__G.input.held.has('attack'));
      await touch('touchEnd', []); await wait(80);
      const h2 = await page.evaluate(() => window.__G.input.held.has('attack'));
      ok(h1 && !h2, 'สองนิ้วบน ⚔️ ยกนิ้วแรก → ยังค้าง · ยกครบ → ปล่อย', `${h1} ${h2}`);

      /* ลากจอย + นิ้วที่ 2 ลากบนจอ → ไม่มี error คอนโซล */
      const e0 = errors.length;
      await touch('touchStart', [[150, 300, 1]]); await touch('touchMove', [[190, 300, 1]]);
      await touch('touchStart', [[190, 300, 1], [600, 150, 2]]);
      for (let i = 1; i <= 5; i++) await touch('touchMove', [[190 + i, 300 - i * 5, 1], [600 - i * 10, 150 + i * 5, 2]]);
      await touch('touchEnd', [[195, 275, 1]]); await touch('touchEnd', []); await wait(100);
      ok(errors.length === e0, 'ลากจอย + นิ้วที่ 2 ลาก → ไม่มี error ในคอนโซล', errors.slice(e0).join(' | '));

      /* ย่อหน้าต่างกลางลาก: วางนิ้วตรงกลางวงที่เห็น → ต้องไม่เดิน */
      await touch('touchStart', [[150, 300, 1]]); await touch('touchMove', [[170, 300, 1]]); await wait(60);
      const c0 = await page.evaluate(() => { const r = document.getElementById('joybase').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; });
      ok(Math.abs(c0.x - 150) < .5 && Math.abs(c0.y - 300) < .5 && c0.w === 140, 'วงจอยที่เห็น: กลางตรงจุดแตะ (150,300) · กว้าง 140 พอดี', JSON.stringify(c0));
      await page.setViewportSize({ width: 800, height: 360 }); await wait(250);
      const c = await page.evaluate(() => { const r = document.getElementById('joybase').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      await touch('touchMove', [[c.x, c.y, 1]]); await wait(80);
      const m = await page.evaluate(() => ({ mx: window.__G.input.mx, my: window.__G.input.my }));
      ok(m.mx === 0 && m.my === 0, 'ย่อจอกลางลาก แล้ววางนิ้วกลางวงจอยที่เห็น → ไม่เดิน (วงกับทิศตรงกัน)', JSON.stringify({ c, m }));
      await touch('touchMove', [[c.x + 60, c.y, 1]]); await wait(80);
      const m2 = await page.evaluate(() => ({ mx: window.__G.input.mx, my: window.__G.input.my }));
      ok(m2.mx > .5 && Math.abs(m2.my) < .05, '…ลากขวาจากวงที่เห็น → เดินขวาตรง', JSON.stringify(m2));
      await touch('touchEnd', []); await page.setViewportSize({ width: 915, height: 412 }); await wait(250);

      /* joySide = ขวา · joyRun = ปิด */
      await page.evaluate(async () => { const m = await import('/v6/src/core/input.js'); m.setJoySide('right'); m.setJoyRun(false); });
      await wait(60);
      const z = await page.evaluate(() => { const r = document.getElementById('joyzone').getBoundingClientRect(), h = document.getElementById('joyhint').getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), hr: Math.round(h.right) }; });
      ok(z.r === 915 && z.l === 915 - Math.round(915 * .42) && z.hr === 915 - 26, 'joySide ขวา → พื้นที่จอย + วงใบ้ ย้ายไปขวาล่าง', JSON.stringify(z));
      await touch('touchStart', [[620, 250, 1]]); await touch('touchMove', [[620, 120, 1]]); await wait(80);
      const j = await page.evaluate(() => ({ my: window.__G.input.my, run: window.__G.input.run }));
      ok(j.my < -.99 && !j.run, 'จอยฝั่งขวาเดินได้ · joyRun ปิด → ดันสุดไม่วิ่ง', JSON.stringify(j));
      await touch('touchEnd', []);
      await page.evaluate(async () => { const m = await import('/v6/src/core/input.js'); m.setJoySide('left'); m.setJoyRun(true); });
      ok(errors.length === 0, 'ไม่มี error ในคอนโซล', errors.join(' | '));
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
