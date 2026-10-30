/* เทสเบราว์เซอร์ 1A-2 (แมพ/ประตู/วาดฉาก) · รัน: node v6/tests/browser/world.spec.js [--long]
   เปิด dev-server พอร์ตว่าง → /v6/ ใน Chromium จริง → เข้าแมพต่าง ๆ ผ่านฟังก์ชันของ world (ยังไม่มีระบบเดิน 1A-3)
   กด E จริงที่หน้าประตูร้าน · แคปจอ → โฟลเดอร์ชั่วคราวของรอบนี้ (mkdtemp · ไม่เก็บในโปรเจกต์ ไม่ชนกับ AI อื่น) · --long = รอ 50 วิ เช็กคืนหน่วยความจำ 45 วิ
   1A-2f: บังหน้า-หลังผ่าน zpush (หลังคา/ต้นไม้ vs ตัวละคร · เทียบพิกเซล) · ยืนในเมืองเกิน 45 วิ พื้นไม่โหลดใหม่ (M4) · เวลาเฟรมตอนวาป (L9) */
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
const SHOTS = fs.mkdtempSync(path.join(os.tmpdir(), 'v6-1a2-'));
async function shot(page, name) { const p = path.join(SHOTS, name + '.png'); await page.screenshot({ path: p }); return p; }
/* ยืนที่ (x,y) px แบบหยุดเกม (เวลา/อนิเมชันไม่เดิน) แล้วอ่านพิกเซลบริเวณลำตัว ตอนเสื้อแดง/เสื้อเขียว → ต่างกันเท่าไร
   ลำตัวถูกของอื่นบังมิด = ต่างกัน ~0 · ตัวอยู่บนสุด = ต่างกันมาก · ถูกบังแบบโปร่ง = อยู่ระหว่างกลาง */
async function headDiff(page, x, y, name) {
  /* วางตัวก่อนแล้วรอกล้องตามให้นิ่ง (กล้องไม่ขยับตอนหยุดเกม) → ค่อยหยุดเกม */
  await page.evaluate(([x, y]) => { const G = window.__G; G.player.x = x; G.player.y = y; G.player.moving = false; G.player.dir = 'd'; G.player.look = { top: '#ff0000' }; }, [x, y]);
  await wait(1500);
  await page.evaluate(([x, y]) => { const G = window.__G; G.paused = true; G.player.x = x; G.player.y = y; G.player.dir = 'd'; }, [x, y]);
  await wait(300);
  const grab = () => page.evaluate(([x, y]) => {
    const G = window.__G, c = document.getElementById('c'), k = c.getContext('2d'), s = c.width / G.cam.vw;
    const sx = Math.round((x - 5 - G.cam.x) * s), sy = Math.round((y - 19 - G.cam.y) * s), w = Math.round(10 * s), h = Math.round(9 * s);
    if (sx < 0 || sy < 0 || sx + w > c.width || sy + h > c.height) throw new Error('หัวตัวละครอยู่นอกจอ ' + [sx, sy]);
    return Array.from(k.getImageData(sx, sy, w, h).data);
  }, [x, y]);
  const a = await grab();
  if (name) console.log('    รูป', await shot(page, name));
  await page.evaluate(() => { window.__G.player.look = { top: '#00ff00' }; }); await wait(250);
  const b = await grab();
  await page.evaluate(() => { window.__G.paused = false; delete window.__G.player.look; });
  let d = 0; for (let i = 0; i < a.length; i += 4) d += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
  return d / (a.length / 4);
}

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

    console.log('— บังหน้า-หลัง (zpush · ผลตรวจ M2): ร้านอาวุธ หลังคาฐาน y=320 · ต้นไม้ (396,199) ฐาน 290');
    await go(page, 'town', [5.5, 17, 'u']); await wait(1500);
    const roofBehind = await headDiff(page, 176, 318, 'occl-roof-behind'), roofFront = await headDiff(page, 176, 545, 'occl-roof-front');
    ok(roofBehind < roofFront * .05 && roofFront > 50, 'เดินหลังร้านอาวุธ → หลังคาบังตัว · ยืนหน้าร้าน → ตัวอยู่บน', `หลัง ${roofBehind.toFixed(1)} · หน้า ${roofFront.toFixed(1)}`);
    const treeBehind = await headDiff(page, 432, 272, 'occl-tree-behind'), treeFront = await headDiff(page, 432, 300, 'occl-tree-front');
    console.log(`    ต้นไม้: หลัง ${treeBehind.toFixed(1)} · หน้า ${treeFront.toFixed(1)}`);
    ok(treeBehind > treeFront * .2 && treeBehind < treeFront * .85, 'อยู่หลังต้นไม้ → ต้นไม้ทับแบบโปร่ง (ยังเห็นตัว) · อยู่หน้า → ตัวทับต้นไม้', `หลัง ${treeBehind.toFixed(1)} · หน้า ${treeFront.toFixed(1)}`);

    console.log('— คืนหน่วยความจำเฉพาะฉากที่ไม่ได้อยู่ (ผลตรวจ M4)');
    await go(page, 'field', [50, 22, 'l']); await wait(1500);
    /* 1Y: ภาพเป็น ImageBitmap · จับภาพพื้นทุ่งไว้ ดูว่าถูก close() ตอนคืน (bitmap ที่ปิดแล้ว width = 0) */
    const bm = await page.evaluate(async () => { const t = await import('/v6/src/draw/tiles.js'); const { TERRAIN } = await import('/v6/src/data/art.js'); window.__bm = t.peekImage ? t.peekImage(TERRAIN.src) : null; return { kind: window.__bm && window.__bm.constructor.name, w: window.__bm && window.__bm.width, n: t.cacheInfo().bitmaps }; });
    ok(bm.kind === 'ImageBitmap' && bm.w > 0 && bm.n >= 2, 'ภาพฉากเก็บเป็น ImageBitmap (1Y)', JSON.stringify(bm));
    await go(page, 'town', [22, 17, 'd']); await wait(2000);
    let groundReq = 0; const onReq = r => { if (/ground-v538/.test(r.url())) groundReq++; }; page.on('request', onReq);
    await page.evaluate(() => { window.__G.time.now += 60; }); /* ยืนในเมืองเกิน 45 วิ (เลื่อนนาฬิกาเกม แทนรอจริง) */
    await wait(600);
    let ci = await page.evaluate(async () => (await import('/v6/src/draw/tiles.js')).cacheInfo());
    ok(Array.isArray(ci.srcs) && ci.srcs.some(s => /ground-v538/.test(s)), 'ภาพพื้นเมืองยังอยู่หลังยืน 60 วิ', JSON.stringify(ci.srcs));
    ok(Array.isArray(ci.srcs) && !ci.srcs.some(s => /terrain-v585/.test(s)), 'ภาพพื้นทุ่ง (ฉากที่ไม่ได้อยู่) คืนแล้ว', JSON.stringify(ci.srcs));
    const closed = await page.evaluate(() => window.__bm && window.__bm.width === 0 && window.__bm.height === 0);
    ok(closed, 'ภาพพื้นทุ่งที่คืน → bitmap.close() แล้ว (width 0 · คืนหน่วยความจำทันที · 1Y)');
    ok(Array.isArray(ci.chunkScenes) && ci.chunkScenes.every(s => s === 'town'), 'แผ่นพื้นเหลือแต่ของเมือง', JSON.stringify(ci.chunkScenes));
    await go(page, 'town', [40, 30, 'd']); await wait(800); await go(page, 'town', [3, 3, 'd']); await wait(800);
    page.off('request', onReq);
    ok(groundReq === 0, 'เดินไปมุมเมืองหลังยืนนาน → ไม่โหลดภาพพื้นใหม่', 'คำขอ ' + groundReq);

    console.log('— เตรียมภาพเมือง 2 ตอนเดินใกล้เรือ (1Y)');
    await go(page, 'road', [60, 12.5, 'r']); await wait(800);
    const far = await page.evaluate(async () => (await import('/v6/src/draw/tiles.js')).cacheInfo().srcs.filter(s => /city2\//.test(s)).length);
    await go(page, 'road', [107, 12.5, 'r']); await wait(2500);
    const near = await page.evaluate(async () => { const t = await import('/v6/src/draw/tiles.js'); const { MAPS } = await import('/v6/src/data/maps.js'); if (!t.sceneImages) return { want: 0, ready: 0 }; const want = t.sceneImages(MAPS.city2), r = t.cacheInfo().ready; return { want: want.length, ready: want.filter(s => r.includes(s)).length }; });
    ok(far === 0 && near.want >= 4 && near.ready === near.want, 'ไกลเรือ = ไม่โหลดภาพเมือง 2 · ใกล้เรือ = ภาพเมือง 2 ถอดรหัสพร้อมก่อนวาป', JSON.stringify({ far, near }));

    console.log('— เวลาเฟรมตอนวาปเข้าแมพใหญ่ (ผลตรวจ L9 · 1Y) · ครั้งแรกของหน้า (ภาพยังไม่โหลด) · หน้าใหม่ทุกรอบ');
    /* 1Z: ช่วงค้างอยู่ที่เฟรมที่ 5–6 หลังวาป = ตอนภาพ 1536×1024 (3 ภาพ) โหลดเสร็จ → วาดครั้งแรก (<img> + decode ยังถอดรหัส/ส่งขึ้นการ์ดจอในเฟรม 42–53 ms ต่อภาพ)
       1Y: ภาพเป็น ImageBitmap (ถอดรหัสนอกเฟรม) → วาดครั้งแรก ~0.3 ms · วัดในเครื่องช่าง 7 รอบ: ก่อน มัธยฐาน 112 สูงสุด 133 ms → หลัง มัธยฐาน 26 สูงสุด 34 ms
       เกณฑ์เมือง 2 (5 รอบ): มัธยฐาน <50 ms และทุกรอบ <100 ms · grove/ดัน 60 (ไม่มีภาพใหญ่) มัธยฐาน 3 รอบ <100 ms เท่าเดิม */
    for (const [id, n] of [['city2', 5], ['grove', 3], ['dg:60', 3]]) {
      const runs = [];
      for (let k = 0; k < n; k++) {
        const c2 = await browser.newContext({ viewport: { width: 1366, height: 768 } });
        const p2 = await c2.newPage();
        await p2.goto(`http://127.0.0.1:${port}/v6/`);
        await p2.waitForFunction(() => window.__G && window.__G.time.frame > 5);
        const r = await p2.evaluate(async id => {
          /* รอเมืองโหลดเสร็จ (ไม่มี rAF เกิน 50 ms ติดกัน 600 ms) ก่อนวาป — ไม่ให้ค้างของเมืองปนผล */
          await new Promise(res => { let last = 0, calm = 0; const t0 = performance.now(); const f = n => { if (last) { const d = n - last; calm = d > 50 ? 0 : calm + d; } last = n; if (calm >= 600 || n - t0 > 8000) return res(); requestAnimationFrame(f); }; requestAnimationFrame(f); });
          const w = await import('/v6/src/systems/world.js');
          const ts = []; let last = performance.now();
          w.enter(id); last = performance.now();
          for (let i = 0; i < 60; i++) { await new Promise(r => requestAnimationFrame(r)); const n = performance.now(); ts.push(n - last); last = n; }
          return Math.max(...ts);
        }, id);
        runs.push(r);
        await c2.close();
      }
      const srt = [...runs].sort((a, b) => a - b), med = srt[srt.length >> 1], max = srt[srt.length - 1];
      console.log(`    ${id}: เฟรมนานสุดแต่ละรอบ ${runs.map(v => v.toFixed(0)).join(' / ')} ms · มัธยฐาน ${med.toFixed(0)} · สูงสุด ${max.toFixed(0)} ms`);
      if (id === 'city2') ok(med < 50 && max < 100, `วาปเข้าเมือง 2 ครั้งแรก ${n} รอบ: มัธยฐาน <50 ms และทุกรอบ <100 ms (ก่อน 1Y มัธยฐาน 112 · สูงสุด 133)`, runs.map(v => v.toFixed(0)).join(' / ') + ' ms');
      else ok(med < 100, `วาปเข้า ${id} ครั้งแรกไม่ค้างเฟรมยาว (มัธยฐาน ${n} รอบ <100 ms)`, runs.map(v => v.toFixed(0)).join(' / ') + ' ms');
    }

    console.log('— เปิดเกม 2 วิแรก: เฟรมนานสุด (ผลตรวจ 1Z L3 · 1Y L1) · หน้าใหม่ 5 รอบ (แคชว่าง)');
    /* วัดช่วงห่างระหว่าง rAF ของหน้า ตั้งแต่เฟรมแรกของเกม (G.time.frame ≥ 1) ถึง +2 วิ — ตรงกับที่ผู้เล่นเห็นตอนเข้าเกม
       1X วัดในเครื่องช่าง (เครื่องว่าง 14 หน้า): สูงสุดต่อหน้า 33–50 ms · ไม่มี long task · เฟรมเกม 20–38 ms ช่วง 300 ms แรก (สร้างแผ่นพื้น + วาดแผ่นใหม่ครั้งแรก)
       ค้าง ~116 ms (ผลตรวจ 1Y L1) เกิดเฉพาะตอนเครื่องมีงานอื่นแย่ง CPU (ช่างรัน login.spec พร้อมกัน → long task 115 ms 1 ใน 8 หน้า) ไม่ใช่โค้ดเกม
       ก่อน 1Y (<img> ถอดรหัสในเฟรม) ทุกหน้ามีเฟรม >50 ms 4–5 ครั้ง สูงสุด 100–480 ms
       เกณฑ์: มัธยฐานของ "สูงสุดต่อหน้า" <90 ms (ต่ำกว่า 3 ช่วงเฟรมที่ 30 FPS · พลาด 1 เฟรม = 67 ms ปกติ) และทุกหน้า <150 ms (เผื่อเครื่องเทสมีโหลด) */
    {
      const runs = [];
      for (let k = 0; k < 5; k++) {
        const c3 = await browser.newContext({ viewport: { width: 1366, height: 768 } });
        const p3 = await c3.newPage();
        await p3.addInitScript(() => {
          const L = window.__start = { raf: [], t0: null };
          const f = n => { L.raf.push(n); if (L.t0 == null && window.__G && window.__G.time && window.__G.time.frame >= 1) L.t0 = n; if (L.t0 == null || n - L.t0 < 2100) requestAnimationFrame(f); };
          requestAnimationFrame(f);
        });
        await p3.goto(`http://127.0.0.1:${port}/v6/`);
        await p3.waitForFunction(() => window.__start.t0 != null && performance.now() - window.__start.t0 > 2200, null, { timeout: 15000 });
        runs.push(await p3.evaluate(() => {
          const L = window.__start; let max = 0, n50 = 0;
          for (let i = 1; i < L.raf.length; i++) { if (L.raf[i] <= L.t0 || L.raf[i] > L.t0 + 2000) continue; const d = L.raf[i] - L.raf[i - 1]; if (d > max) max = d; if (d > 50.5) n50++; }
          return { max, n50 };
        }));
        await c3.close();
      }
      const mx = runs.map(r => r.max), srt = [...mx].sort((a, b) => a - b), med = srt[srt.length >> 1];
      const txt = runs.map(r => r.max.toFixed(0) + (r.n50 ? `(${r.n50}×>50)` : '')).join(' / ') + ' ms';
      console.log(`    เฟรมนานสุดต่อหน้า ${txt} · มัธยฐาน ${med.toFixed(0)} ms`);
      ok(med < 90 && srt[srt.length - 1] < 150, 'เปิดเกม 2 วิแรกไม่ค้าง: มัธยฐานเฟรมนานสุด <90 ms และทุกหน้า <150 ms (ก่อน 1Y 100–480 ms)', txt);
    }

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
