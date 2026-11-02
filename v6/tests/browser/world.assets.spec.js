/* เทสเบราว์เซอร์ 1A-4 (ภาพเบา) · รัน: node v6/tests/browser/world.assets.spec.js [--shots โฟลเดอร์] [--measure]
   แต่ละฉากเปิดหน้าใหม่ (แคชว่าง เหมือนผู้เล่นเข้าครั้งแรก) → วัดไบต์ที่โหลดจริงด้วย Performance API (resource timing)
   - เมือง 1 ครั้งแรก = ทุกอย่างตั้งแต่เปิดหน้า (HTML + โค้ด + ภาพ) · ฉากอื่น = ที่โหลดเพิ่มหลังเข้าฉากนั้น (ต่อจากเมือง 1)
   - ห้ามขอไฟล์จาก /assets/incoming/ (ภาพรอตรวจ · DECISIONS: v6 ใช้ภาพ webp ใน v6/assets/)
   - งบไบต์ต่อฉาก (BUDGET) · --measure = พิมพ์ตารางอย่างเดียว ไม่ตัดสินงบ (ใช้วัด "ก่อนแก้")
   - --shots โฟลเดอร์ = แคปจอมุมกล้องเดิมทุกครั้ง (หยุดเกม · ตัวละครยืนจุดเดียวกัน) ไว้เทียบก่อน/หลังด้วยตา */
import { createRequire } from 'module';
import { spawn } from 'child_process';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(HERE, '..', '..', 'tools', 'dev-server.cjs');
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const SHOTS = arg('--shots');
const MEASURE = process.argv.includes('--measure');
const MB = 1024 * 1024;

/* งบไบต์ (เป้างาน 1A-4: เมือง 1 ครั้งแรก ≤ 3 MB) · ฉากอื่น = ที่โหลดเพิ่ม */
const BUDGET = { town: 3 * MB, field: .5 * MB, mist: .5 * MB, iron: .5 * MB, 'dg:1': .5 * MB, city2: 2 * MB };
/* ฉาก · จุดยืน (ช่อง) · ชื่อรูป */
const SCENES = [
  ['town', [7, 21.5, 'd'], 'town'], ['field', [50, 22, 'l'], 'field'], ['mist', null, 'forest'],
  ['iron', null, 'mine'], ['dg:1', null, 'dungeon'], ['city2', [41, 30, 'd'], 'city2'],
];

let pass = 0, fail = 0;
const ok = (cond, name, info = '') => { if (cond) { pass++; console.log('  ✅', name); } else { fail++; console.log('  ❌', name, info); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
function freePort() { return new Promise(r => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); }); }
const kb = n => (n / 1024).toFixed(0).padStart(6) + ' KB';

/* รายการไฟล์ที่โหลดแล้ว (Performance API) · encodedBodySize = ขนาดที่ส่งจริงผ่านเน็ต (ไม่รวมหัว HTTP) */
const entries = page => page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const list = performance.getEntriesByType('resource').map(e => ({ url: e.name, bytes: e.encodedBodySize || e.transferSize || 0 }));
  if (nav) list.unshift({ url: nav.name, bytes: nav.encodedBodySize || nav.transferSize || 0 });
  return list;
});
/* รอจนภาพของฉากมาครบ: ไม่มีภาพค้างโหลด 2 ช่วงติดกัน */
async function settle(page) {
  let last = -1, same = 0;
  for (let i = 0; i < 60 && same < 3; i++) {
    await wait(300);
    const n = (await entries(page)).length;
    same = n === last ? same + 1 : 0; last = n;
  }
  await page.evaluate(async () => { for (const im of document.images) if (!im.complete) await new Promise(r => { im.onload = im.onerror = r; }); });
}
/* ยืนที่จุดเดิม หยุดเกม แล้วแคปจอ (กล้องตามตัวก่อนหยุด) */
async function snap(page, at, name) {
  await page.evaluate(at => { const G = window.__G; if (at) { G.player.x = at[0] * 32; G.player.y = at[1] * 32; } G.player.moving = false; G.player.dir = 'd'; }, at);
  await wait(1800);
  await page.evaluate(() => { window.__G.paused = true; });
  await wait(400);
  const p = path.join(SHOTS, name + '.png');
  await page.screenshot({ path: p });
  await page.evaluate(() => { window.__G.paused = false; });
  return p;
}

(async () => {
  const port = await freePort();
  const srv = spawn(process.execPath, [SERVER, String(port)], { stdio: 'ignore' });
  await wait(400);
  const browser = await chromium.launch();
  const rows = [];
  try {
    if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
    for (const [id, at, name] of SCENES) {
      const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
      const page = await ctx.newPage();
      const asked = [], errors = [];
      page.on('request', r => asked.push(r.url()));
      page.on('pageerror', e => errors.push(String(e)));
      await page.addInitScript(() => { performance.setResourceTimingBufferSize(2000); });
      await page.goto(`http://127.0.0.1:${port}/v6/`);
      await page.waitForFunction(() => window.__G && window.__G.time.frame > 5);
      await settle(page);
      const base = await entries(page);
      if (id !== 'town') {
        await page.evaluate(async ([id, at]) => { const w = await import('/v6/src/systems/world.js'); w.enter(id, at); }, [id, at]);
        await settle(page);
      }
      const all = await entries(page);
      const added = id === 'town' ? all : all.slice(base.length);
      const img = added.filter(e => /\.(png|webp|jpe?g)(\?|$)/i.test(e.url));
      const sum = a => a.reduce((s, e) => s + e.bytes, 0);
      const row = { id, total: sum(added), img: sum(img), code: sum(added) - sum(img), files: img.map(e => decodeURIComponent(e.url.replace(/^https?:\/\/[^/]+\//, '')) + ' ' + kb(e.bytes).trim()) };
      rows.push(row);
      const scene = await page.evaluate(() => window.__G.scene.id);
      ok(scene === id, 'เข้า ' + id, scene);
      const inc = asked.filter(u => /\/assets\/incoming\//i.test(u));
      ok(!inc.length, `${id}: ไม่ขอไฟล์จาก /assets/incoming/`, inc.join(' '));
      const old = asked.filter(u => /\/assets\//.test(u) && !/\/v6\/assets\//.test(u));
      if (!MEASURE) ok(!old.length, `${id}: ภาพทั้งหมดมาจาก v6/assets/ (ไม่ใช้ภาพ PNG หนักของเกมเดิม)`, old.join(' '));
      ok(!errors.length, `${id}: ไม่มี error`, errors.join(' | '));
      if (!MEASURE) ok(row.total <= BUDGET[id], `${id}: โหลด ${(row.total / MB).toFixed(2)} MB ≤ งบ ${(BUDGET[id] / MB).toFixed(1)} MB`, row.files.join(' · '));
      if (SHOTS) console.log('    รูป', await snap(page, at, name));
      await ctx.close();
    }
    console.log('\n| ฉาก | รวม | ภาพ | โค้ด/หน้า | ไฟล์ภาพ |');
    console.log('|---|---|---|---|---|');
    for (const r of rows) console.log(`| ${r.id}${r.id === 'town' ? ' (ครั้งแรก)' : ' (เพิ่ม)'} | ${(r.total / MB).toFixed(2)} MB | ${(r.img / MB).toFixed(2)} MB | ${kb(r.code).trim()} | ${r.files.join(' · ')} |`);
  } catch (e) { fail++; console.log('  ❌ เทสหยุดกลางทาง', e && e.stack); }
  finally { await browser.close(); srv.kill(); }
  console.log(`\nผ่าน ${pass} · พัง ${fail}`);
  process.exit(fail ? 1 : 0);
})();
