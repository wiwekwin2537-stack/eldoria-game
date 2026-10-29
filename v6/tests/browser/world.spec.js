/* เทสเบราว์เซอร์ 1A-2 (แมพ/ประตู/วาดฉาก) · รัน: node v6/tests/browser/world.spec.js [--long]
   เปิด dev-server พอร์ตว่าง → /v6/ ใน Chromium จริง → เข้าแมพต่าง ๆ ผ่านฟังก์ชันของ world (ยังไม่มีระบบเดิน 1A-3)
   กด E จริงที่หน้าประตูร้าน · แคปจอ → /tmp/v6-1a2-*.png (ไม่เก็บในโปรเจกต์) · --long = รอ 50 วิ เช็กคืนหน่วยความจำ 45 วิ */
import { createRequire } from 'module';
import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(HERE, '..', '..', 'tools', 'dev-server.cjs');
const LONG = process.argv.includes('--long');

let pass = 0, fail = 0;
const ok = (cond, name, info = '') => { if (cond) { pass++; console.log('  ✅', name); } else { fail++; console.log('  ❌', name, info); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
function freePort() { return new Promise(r => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); }); }

/* เข้าแมพ id ที่จุด at (ช่อง) แล้วรอให้ภาพโหลด */
async function go(page, id, at) {
  return page.evaluate(async ([id, at]) => {
    const w = await import('/v6/src/systems/world.js');
    const r = w.enter(id, at);
    return { r, scene: window.__G.scene && window.__G.scene.id };
  }, [id, at || null]);
}
/* นับพิกเซลที่ไม่ใช่สีพื้นหลัง/ดำ (ฉากวาดจริง ไม่ใช่จอดำ) + จำนวนสีต่างกัน */
async function painted(page) {
  return page.evaluate(() => {
    const c = document.getElementById('c'), k = c.getContext('2d'), d = k.getImageData(0, 0, c.width, c.height).data;
    let n = 0, cols = new Set();
    for (let i = 0; i < d.length; i += 4 * 97) { const s = d[i] + d[i + 1] + d[i + 2]; if (s > 40) n++; cols.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); }
    return { frac: n / (d.length / 4 / 97), cols: cols.size };
  });
}
async function shot(page, name) { const p = `/tmp/v6-1a2-${name}.png`; await page.screenshot({ path: p }); return p; }

(async () => {
  const port = await freePort();
  const srv = spawn(process.execPath, [SERVER, String(port)], { stdio: 'ignore' });
  await wait(400);
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    const errors = [], bad = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await page.goto(`http://127.0.0.1:${port}/v6/`);
    await page.waitForFunction(() => window.__G && window.__G.time.frame > 5);

    console.log('— เมือง 1');
    const s0 = await page.evaluate(() => ({ id: window.__G.scene.id, w: window.__G.scene.w, h: window.__G.scene.h, x: window.__G.player.x, y: window.__G.player.y }));
    ok(s0.id === 'town' && s0.w === 1408 && s0.h === 1088, 'เริ่มในเมือง 44×34 ช่อง = 1408×1088 px', JSON.stringify(s0));
    ok(s0.x === 7 * 32 && s0.y === 21.5 * 32, 'ยืนที่จุดเกิด (7,21.5)', JSON.stringify(s0));
    await wait(2500);
    let p = await painted(page);
    ok(p.frac > .9 && p.cols > 40, 'เมืองวาดเต็มจอ (ไม่ใช่จอดำ)', JSON.stringify(p));
    console.log('    รูป', await shot(page, 'town-spawn'));
    await go(page, 'town', [22, 17, 'd']); await wait(1500);
    console.log('    รูป', await shot(page, 'town-plaza'));
    await go(page, 'town', [33, 26, 'u']); await wait(1500);
    console.log('    รูป', await shot(page, 'town-south'));

    /* กด E จริงหน้าประตูร้านอาวุธ → เข้าร้าน */
    await go(page, 'town', [5.5, 16.5, 'u']); await wait(300);
    await page.keyboard.press('KeyE'); await wait(300);
    let sc = await page.evaluate(() => ({ id: window.__G.scene.id, x: window.__G.player.x / 32, y: window.__G.player.y / 32 }));
    ok(sc.id === 'shop.gear', 'กด E หน้าประตูร้านอาวุธ → เข้าร้าน', JSON.stringify(sc));
    await wait(800);
    console.log('    รูป', await shot(page, 'shop-gear'));
    /* ยืนที่ประตูล่างของร้าน → ออกมายืนหน้าประตูเดิม */
    await page.evaluate(() => { window.__G.player.x = 12.5 * 32; window.__G.player.y = 13.95 * 32; });
    await wait(900);
    sc = await page.evaluate(() => ({ id: window.__G.scene.id, x: window.__G.player.x / 32, y: window.__G.player.y / 32 }));
    ok(sc.id === 'town' && sc.x === 5.5 && sc.y === 16.75, 'เดินลงประตูร้าน → กลับหน้าประตู (5.5,16.75)', JSON.stringify(sc));

    /* เดินชนขอบซ้ายเมือง → ทุ่ง */
    await page.evaluate(() => { window.__G.player.x = 9; window.__G.player.y = 16.5 * 32; });
    await wait(300);
    sc = await page.evaluate(() => window.__G.scene.id);
    ok(sc === 'field', 'ยืนที่ประตูซ้ายเมือง → ทุ่ง', sc);

    console.log('— ทุ่ง / ป่า / เหมือง / ดัน / เมือง 2 / ถนน');
    const views = [
      ['field', [50, 22, 'l'], 'field'], ['field', [12, 30, 'd'], 'field-west'], ['grove', null, 'grove'], ['volcano', null, 'volcano'],
      ['iron', null, 'mine-iron'], ['diamond', null, 'mine-diamond'], ['dg:1', null, 'dungeon-1'], ['dg:60', null, 'dungeon-60'],
      ['city2', null, 'city2'], ['city2', [41, 30, 'd'], 'city2-plaza'], ['road', [60, 12.5, 'r'], 'road'], ['tower:1', null, 'tower'],
      ['market', null, 'market'], ['shop.hall', null, 'hall'], ['seal.frost', null, 'seal-frost'],
    ];
    for (const [id, at, name] of views) {
      const r = await go(page, id, at);
      ok(r.r && r.scene === id, 'เข้า ' + id, JSON.stringify(r));
      await wait(1300);
      p = await painted(page);
      ok(p.frac > .5 && p.cols > 8, `${id} วาดฉาก`, JSON.stringify(p));
      console.log('    รูป', await shot(page, name));
    }
    /* ทุกแมพในตารางเข้าได้ ไม่มี error */
    const all = await page.evaluate(async () => {
      const { MAPS } = await import('/v6/src/data/maps.js');
      const w = await import('/v6/src/systems/world.js');
      const out = [];
      for (const id of Object.keys(MAPS)) { if (!w.enter(id)) out.push(id); await new Promise(r => requestAnimationFrame(r)); }
      return { n: Object.keys(MAPS).length, bad: out };
    });
    ok(!all.bad.length, `เข้าแมพทุกแมพ (${all.n}) ได้`, all.bad.join());
    await wait(500);
    const info = await page.evaluate(async () => (await import('/v6/src/draw/tiles.js')).cacheInfo());
    console.log('    แคช', JSON.stringify(info));
    ok(!errors.length, 'ไม่มี error ใน console', errors.slice(0, 5).join(' | '));
    ok(!bad.length, 'ไม่มีไฟล์ภาพ 404', bad.slice(0, 5).join(' | '));
    const imgs = await page.evaluate(() => performance.getEntriesByType('resource').filter(e => /assets\//.test(e.name)).map(e => e.name.replace(/^.*assets\//, '') + ' ' + Math.round((e.encodedBodySize || e.transferSize || 0) / 1024) + 'KB'));
    console.log('    ภาพที่โหลด', imgs.length, imgs.join(' · '));
    ok(!imgs.some(n => /base64|data:/.test(n)), 'ไม่มีภาพ base64');

    if (LONG) {
      console.log('— รอ 50 วิ: แมพที่ไม่ได้อยู่เกิน 45 วิ คืนหน่วยความจำ');
      await go(page, 'town'); await wait(50000);
      const after = await page.evaluate(async () => (await import('/v6/src/draw/tiles.js')).cacheInfo());
      ok(after.chunks <= 12 && after.images <= 8, 'เหลือแผ่นพื้น/ภาพเฉพาะเมือง', JSON.stringify(after));
    }
    await ctx.close();
  } finally {
    await browser.close();
    srv.kill();
  }
  console.log(`\nผ่าน ${pass} · พัง ${fail}`);
  process.exit(fail ? 1 : 0);
})();
