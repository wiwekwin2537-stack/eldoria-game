/* เทสเบราว์เซอร์: ลูปจำกัด 30 FPS บนมือถือ (เป้า 30 · spec01 §1) และคอมไม่จำกัด (เป้า 60) — หัวหน้า 30 ต.ค.
   รัน: node v6/tests/browser/loop.spec.js */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(HERE, '..', '..', 'tools', 'dev-server.cjs');
const PORT = 20000 + Math.floor(Math.random() * 20000);
let pass = 0, fail = 0;
const ok = (c, m, d) => { if (c) { pass++; console.log('  ✅', m); } else { fail++; console.log('  ❌', m, d ?? ''); } };

const srv = spawn(process.execPath, [SERVER, String(PORT)], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 600));
const browser = await chromium.launch();
async function rate(opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/v6/`);
  await page.waitForFunction(() => window.__G && window.__G.time.frame > 5);
  const r = await page.evaluate(async () => { const f0 = __G.time.frame, t0 = performance.now(); await new Promise(r => setTimeout(r, 3000)); return (__G.time.frame - f0) / ((performance.now() - t0) / 1000); });
  await ctx.close();
  return r;
}
try {
  const desk = await rate({ viewport: { width: 1366, height: 768 } });
  ok(desk > 45, 'คอม (เป้า 60) ไม่จำกัดเฟรม', desk.toFixed(1));
  const mob = await rate({ viewport: { width: 915, height: 412 }, hasTouch: true, isMobile: true });
  ok(mob > 24 && mob < 36, 'มือถือ (เป้า 30) จำกัด ~30 FPS', mob.toFixed(1));
} finally { await browser.close(); srv.kill(); }
console.log(`\nผ่าน ${pass} · พัง ${fail}`);
process.exit(fail ? 1 : 0);
