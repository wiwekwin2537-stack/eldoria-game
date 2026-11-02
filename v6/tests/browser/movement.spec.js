/* เทสเบราว์เซอร์ 1A-3 (เดิน/วิ่ง/พุ่ง/คลิกเดิน/จอยมือถือ + วาดตัวละคร) · รัน: node v6/tests/browser/movement.spec.js
   เปิด dev-server พอร์ตว่าง → /v6/ ใน Chromium จริง → กดปุ่มจริง (คีย์บอร์ด/เมาส์/สัมผัส) แบบผู้เล่น
   แคปจอ → โฟลเดอร์ชั่วคราวของรอบนี้ (mkdtemp · ไม่เก็บในโปรเจกต์ ไม่ชนกับ AI อื่นที่รันพร้อมกัน · ผลตรวจ 1A-2f N5) */
import { createRequire } from 'module';
import { spawn } from 'child_process';
import net from 'net';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(HERE, '..', '..', 'tools', 'dev-server.cjs');
const T = 32;

let pass = 0, fail = 0;
const ok = (cond, name, info = '') => { if (cond) { pass++; console.log('  ✅', name); } else { fail++; console.log('  ❌', name, info); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
function freePort() { return new Promise(r => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); }); }
const pos = page => page.evaluate(() => { const G = window.__G, P = G.player; return { x: P.x, y: P.y, dir: P.dir, scene: G.scene.id, sp: P.sp, dash: { ...P.dash }, moving: P.moving }; });

/* เดินด้วยคีย์บอร์ดจริงไปที่ (tx,ty) ช่อง — กดลูกศรตามทิศที่ยังห่าง (เหมือนผู้เล่นกดเอง) */
async function walkTo(page, tx, ty, ms = 8000) {
  const held = new Set(), t0 = Date.now();
  const set = async (k, on) => { if (on && !held.has(k)) { held.add(k); await page.keyboard.down(k); } else if (!on && held.has(k)) { held.delete(k); await page.keyboard.up(k); } };
  let p;
  while (Date.now() - t0 < ms) {
    p = await pos(page);
    const dx = tx * T - p.x, dy = ty * T - p.y;
    if (Math.abs(dx) < 4 && Math.abs(dy) < 4) break;
    await set('ArrowRight', dx > 3); await set('ArrowLeft', dx < -3); await set('ArrowDown', dy > 3); await set('ArrowUp', dy < -3);
    await wait(30);
  }
  for (const k of [...held]) await set(k, false);
  await wait(60);
  return pos(page);
}
const SHOTS = fs.mkdtempSync(path.join(os.tmpdir(), 'v6-1a3-'));
async function shot(page, name) { const p = path.join(SHOTS, name + '.png'); await page.screenshot({ path: p }); return p; }
/* แคปเฉพาะรอบตัวละคร (ใช้เทียบกับเกมเดิม) */
async function heroShot(page, name) {
  const r = await page.evaluate(() => {
    const G = window.__G, c = document.getElementById('c').getBoundingClientRect(), k = c.height / G.cam.vh;
    return { x: c.left + (G.player.x - G.cam.x) * k, y: c.top + (G.player.y - G.cam.y) * k, k };
  });
  const p = path.join(SHOTS, 'hero-' + name + '.png');
  await page.screenshot({ path: p, clip: { x: r.x - 40 * r.k, y: r.y - 70 * r.k, width: 80 * r.k, height: 85 * r.k } });
  return p;
}

(async () => {
  const port = await freePort();
  const srv = spawn(process.execPath, [SERVER, String(port)], { stdio: 'ignore' });
  await wait(400);
  const browser = await chromium.launch();
  try {
    /* ---------- คอม ---------- */
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`http://127.0.0.1:${port}/v6/`);
    await page.waitForFunction(() => window.__G && window.__G.time.frame > 5);
    /* หน้าล็อกอินบัง canvas → ซ่อนไว้ (เทสนี้ไม่ต่อเซิร์ฟเวอร์) */
    await page.evaluate(() => { for (const id of ['lg', 'lg-banner']) { const u = document.getElementById(id); if (u) u.remove(); } });
    await wait(300);

    console.log('— เดินในเมือง');
    let p0 = await pos(page);
    ok(p0.scene === 'town' && p0.x === 7 * T && p0.y === 21.5 * T, 'เกิดที่จุดเกิดเมือง (7,21.5)', JSON.stringify(p0));
    await page.keyboard.down('KeyS'); await wait(1000); await page.keyboard.up('KeyS');
    let p1 = await pos(page);
    ok(p1.y - p0.y > 70 && p1.y - p0.y < 120 && p1.dir === 'd', 'กด S 1 วิ เดินลง ~95 px', JSON.stringify(p1));
    await page.keyboard.down('ControlLeft'); await page.keyboard.down('KeyW'); await wait(1000); await page.keyboard.up('KeyW'); await page.keyboard.up('ControlLeft');
    let p2 = await pos(page);
    ok(p1.y - p2.y > 140 && p1.y - p2.y < 200, 'Ctrl+W 1 วิ วิ่งขึ้น ~170 px', JSON.stringify(p2));
    await page.keyboard.down('KeyD'); await wait(400);
    console.log('  แคป:', await shot(page, 'town-walk'));
    console.log('  แคป:', await heroShot(page, 'walk-r'));
    await page.keyboard.up('KeyD');
    for (const [k, d] of [['ArrowDown', 'd'], ['ArrowUp', 'u'], ['ArrowLeft', 'l'], ['ArrowRight', 'r']]) {
      await page.keyboard.down(k); await wait(80); await page.keyboard.up(k); await wait(250);
      console.log('  แคป:', await heroShot(page, 'idle-' + d));
    }

    console.log('— พุ่ง (Shift)');
    await walkTo(page, 14, 16.5); /* ถนนโล่งแถว 16–17 */
    await page.keyboard.press('ArrowRight'); await wait(200);
    const pa = await pos(page);
    await page.keyboard.press('ShiftLeft');
    await wait(60); console.log('  แคป:', await heroShot(page, 'dash'));
    await wait(400);
    const pb = await pos(page);
    ok(Math.abs(pb.x - pa.x - 86) < 4 && pb.y === pa.y, 'Shift พุ่งไปทางที่หัน ≈86 px (ไม่กดทิศ · DECISIONS 2026-10-30)', `${pa.x} → ${pb.x}`);
    ok(pb.dash.cd > 0 && pb.dash.cd <= 1, 'ติดคูลดาวน์ ≤ 1 วิ', JSON.stringify(pb.dash));

    console.log('— เดินเข้าร้านอาวุธ (เดินไปหน้าประตูแล้วกด E)');
    let q = await walkTo(page, 5.5, 16.6, 10000);
    ok(Math.abs(q.x - 5.5 * T) < 6 && Math.abs(q.y - 16.6 * T) < 6, 'เดินถึงหน้าร้าน (เส้นทางผู้เล่นไม่ติดกำแพง)', JSON.stringify(q));
    await page.keyboard.press('KeyE'); await wait(400);
    q = await pos(page);
    ok(q.scene === 'shop.gear', 'กด E แล้วเข้าร้านอาวุธ', q.scene);
    await wait(800); console.log('  แคป:', await shot(page, 'shop'));
    /* ออกจากร้าน: เดินลงไปทางออก */
    await page.keyboard.down('KeyS'); await wait(3000); await page.keyboard.up('KeyS'); await wait(300);
    q = await pos(page);
    ok(q.scene === 'town' && Math.abs(q.x - 5.5 * T) < 40, 'เดินออกจากร้าน กลับมาหน้าร้าน (DECISIONS)', JSON.stringify(q));

    console.log('— คลิกเดิน (คอม) ไปร้านยา');
    const cl = await page.evaluate(() => {
      const G = window.__G, c = document.getElementById('c').getBoundingClientRect(), k = c.height / G.cam.vh;
      return { x: c.left + (16.5 * 32 - G.cam.x) * k, y: c.top + (28.4 * 32 - G.cam.y) * k, k };
    });
    await page.mouse.click(cl.x, cl.y);
    let entered = false;
    for (let i = 0; i < 100 && !entered; i++) { await wait(100); entered = (await pos(page)).scene === 'shop.potion'; }
    ok(entered, 'คลิกที่ประตูร้านยา → เดินไปเอง + เข้าร้าน', JSON.stringify(await pos(page)));

    ok(errors.length === 0, 'ไม่มี error ในหน้า (คอม)', errors.slice(0, 3).join(' | '));
    await ctx.close();

    /* ---------- มือถือแนวนอน 915×412 จอย ---------- */
    console.log('— มือถือ 915×412 จอย');
    const mctx = await browser.newContext({ viewport: { width: 915, height: 412 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const mp = await mctx.newPage();
    const merr = [];
    mp.on('pageerror', e => merr.push(String(e)));
    await mp.goto(`http://127.0.0.1:${port}/v6/`);
    await mp.waitForFunction(() => window.__G && window.__G.time.frame > 5);
    await mp.evaluate(() => { for (const id of ['lg', 'lg-banner']) { const u = document.getElementById(id); if (u) u.remove(); } });
    await wait(300);
    const cdp = await mctx.newCDPSession(mp);
    const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) });
    const m0 = await pos(mp);
    await touch('touchStart', [[150, 320]]); await touch('touchMove', [[150, 280]]); await wait(600);
    const m1 = await pos(mp);
    console.log('  แคป:', await shot(mp, 'mobile-joy'));
    await touch('touchEnd', []); await wait(200);
    ok(m0.y - m1.y > 20 && m1.dir === 'u', 'ลากจอยขึ้น → เดินขึ้น (หันขึ้น)', `${m0.y} → ${m1.y}`);
    /* ปุ่ม 💨 บนจอ */
    const db = await mp.evaluate(() => { const r = document.getElementById('dashb').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    const d0 = await pos(mp);
    await touch('touchStart', [db]); await wait(60); await touch('touchEnd', []); await wait(300);
    const d1 = await pos(mp);
    ok(Math.abs(d0.y - d1.y - 86) < 4, 'แตะปุ่ม 💨 → พุ่งไปทางที่หัน ≈86 px', `${d0.x},${d0.y} → ${d1.x},${d1.y}`);
    ok(merr.length === 0, 'ไม่มี error ในหน้า (มือถือ)', merr.slice(0, 3).join(' | '));
    await mctx.close();
  } catch (e) {
    fail++; console.log('  ❌ เทสพัง', e && e.stack);
  } finally {
    await browser.close(); srv.kill();
    console.log(`\nผ่าน ${pass} · พัง ${fail}`);
    process.exit(fail ? 1 : 0);
  }
})();
