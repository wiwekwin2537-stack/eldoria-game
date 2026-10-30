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
/* จอ hz จำลอง: แทน requestAnimationFrame ด้วยจังหวะ hz (ส่งเวลาของจังหวะจอให้เหมือน rAF จริง) — headless วัดได้แค่ ~60 Hz */
const FAKE_HZ = hz => `(() => {
  const P = 1000 / ${hz}, t0 = performance.now(); let q = [], armed = false;
  const fire = () => { armed = false; const now = performance.now(), k = Math.floor((now - t0) / P), ts = t0 + k * P; const run = q; q = []; for (const f of run) f(ts); };
  window.requestAnimationFrame = f => { q.push(f); if (!armed) { armed = true; const now = performance.now(), next = t0 + (Math.floor((now - t0) / P) + 1) * P; setTimeout(fire, Math.max(0, next - now)); } return q.length; };
})();`;
async function rate(opts, hz) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  if (hz) await page.addInitScript(FAKE_HZ(hz));
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
  ok(mob > 27 && mob < 32, 'มือถือ (เป้า 30) จำกัด ~30 FPS', mob.toFixed(1));
  /* 1Z (หัวหน้าตัดสิน · ผลตรวจ 1A-1g L1): จอ 75/100/144 Hz ต้องได้ใกล้ 30 (เดิม 75 Hz ได้ 25) */
  for (const hz of [75, 100, 144]) {
    const r = await rate({ viewport: { width: 915, height: 412 }, hasTouch: true, isMobile: true }, hz);
    ok(r > 27.5 && r < 31.5, `มือถือจอ ${hz} Hz (จำลอง) ได้ ~30 FPS`, r.toFixed(1));
  }
} finally { await browser.close(); srv.kill(); }
console.log(`\nผ่าน ${pass} · พัง ${fail}`);
process.exit(fail ? 1 : 0);
