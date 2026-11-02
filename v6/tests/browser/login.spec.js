/* เทสเบราว์เซอร์ 1B (ล็อกอิน/เซฟผ่านเซิร์ฟเวอร์จริงของเกมเดิม + จุดต่อ v6) · รัน: node v6/tests/browser/login.spec.js
   เปิด `node server.js` (เกมเดิม + v6) พอร์ต 8830 · DATA_DIR ชั่วคราว · ไม่ใช้ Upstash จริง · ไอดีทดสอบสุ่ม
   ต้องมี ws + playwright (เครื่องนี้: NODE_PATH=/opt/npm-tools/node_modules) · รูปแคปจอ → /tmp/v6-1b-*.png */
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const req = m => { try { return require(m); } catch (e) { return require('/opt/npm-tools/node_modules/' + m); } };
const { chromium } = req('playwright');
const WS = req('ws');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..');
const PORT = +process.env.V6_TEST_PORT || 8830;
const BASE = `http://127.0.0.1:${PORT}`;

let pass = 0, fail = 0;
const ok = (cond, name, info = '') => { if (cond) { pass++; console.log('  ✅', name); } else { fail++; console.log('  ❌', name, info); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const shot = async (page, n) => { const f = `/tmp/v6-1b-${n}.png`; await page.screenshot({ path: f }); console.log('     รูป', f); };

/* ws ตรง (ไม่ผ่านเบราว์เซอร์) → ข้อความแรก หรือคำตอบของลำดับข้อความ */
function wsTalk(p, msgs = []) {
  return new Promise((ok2, no) => {
    const s = new WS.WebSocket(BASE.replace('http', 'ws') + p), got = [];
    const tm = setTimeout(() => { s.terminate(); no(new Error('ws timeout ' + p)); }, 15000);
    s.on('message', m => {
      got.push(JSON.parse(String(m)));
      if (got.length === 1) for (const x of msgs) s.send(JSON.stringify(x));
      if (got.length >= msgs.length + 1) { clearTimeout(tm); s.close(); ok2(got); }
    });
    s.on('error', e => { clearTimeout(tm); no(e); });
  });
}

async function openV6(browser) {
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true }); /* มือถือแนวนอน */
  const page = await ctx.newPage();
  const errors = [], assets = [];
  page.on('response', r => { if (r.url().includes('/v6/assets/')) assets.push({ u: r.url(), s: r.status(), t: r.headers()['content-type'] }); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(BASE + '/v6/');
  await page.waitForFunction(() => window.__G && window.__G.time.frame > 5);
  return { ctx, page, errors, assets };
}
const phase = page => page.evaluate(() => window.__G.net.phase);
const visible = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' && e.offsetParent !== null; }, sel);

(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v6-1b-'));
  const env = { ...process.env, PORT: String(PORT), DATA_DIR: dataDir, UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', GM_ALLOW_REG: '', V6_ENABLE: '1', /* เปิด /v6ws เฉพาะเทส (หัวหน้า 30 ต.ค.) */
    NODE_PATH: [process.env.NODE_PATH, '/opt/npm-tools/node_modules'].filter(Boolean).join(':') };
  const srv = spawn(process.execPath, ['server.js'], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let srvLog = ''; srv.stdout.on('data', d => srvLog += d); srv.stderr.on('data', d => srvLog += d);
  for (let i = 0; i < 50; i++) { try { await fetch(BASE + '/v6/'); break; } catch (e) { await wait(200); } }
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ID = 'qa1b_' + Math.random().toString(36).slice(2, 8), PW = 'test1234';
  try {
    /* ===== เกมเดิมยังเหมือนเดิม ===== */
    console.log('— เกมเดิม');
    const root = await fetch(BASE + '/');
    const rootBody = await root.text();
    ok(root.status === 200 && rootBody === fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), 'หน้า / ยังเป็น index.html ของเกมเดิม', root.status);
    const jsFile = fs.readdirSync(path.join(ROOT, 'js')).find(f => f.endsWith('.js'));
    ok((await fetch(BASE + '/js/' + jsFile)).status === 200, 'ไฟล์ /js/ ของเกมเดิมโหลดได้');
    const fallback = await (await fetch(BASE + '/ไม่มีหน้านี้')).text();
    ok(fallback.startsWith('Eldoria online server OK'), 'url อื่นยังตอบข้อความเดิม', fallback.slice(0, 40));
    const oldWs = await wsTalk('/');
    ok(oldWs[0].t === 'welcome' && Number.isFinite(oldWs[0].id) && oldWs[0].v === undefined, 'ws เกมเดิม (/) ยังได้ welcome ของเกมเดิม', JSON.stringify(oldWs[0]));
    const v6Ws = await wsTalk('/v6ws');
    ok(v6Ws[0].t === 'welcome' && v6Ws[0].v === 1 && v6Ws[0].id === undefined, 'ws /v6ws ได้ welcome ของ v6', JSON.stringify(v6Ws[0]));
    ok((await fetch(BASE + '/v6/server/accounts.cjs')).status === 404, '/v6/server/ ไม่ถูกเสิร์ฟ');

    /* ===== สมัคร → เข้าเกม ===== */
    console.log('— สมัครที่ /v6/ (มือถือแนวนอน 844×390)');
    const A = await openV6(browser);
    await A.page.waitForFunction(() => window.__G.net.phase === 'login', null, { timeout: 10000 });
    /* 1Z (คำขอ 1A-4): ภาพ webp ของ v6 ต้องโหลดได้จากเซิร์ฟเวอร์จริง (dev-server ในเครื่องเสิร์ฟได้ แต่ server.js เดิม 404) */
    for (let i = 0; i < 40 && !A.assets.some(a => /\/town\/.+\.webp/.test(a.u)); i++) await wait(100);
    const town = A.assets.filter(a => /\/town\/.+\.webp/.test(a.u));
    ok(town.length > 0 && town.every(a => a.s === 200 && a.t === 'image/webp') && A.assets.every(a => a.s === 200 || a.s === 304),
      'ภาพเมือง /v6/assets/town/*.webp ได้ 200 image/webp จาก server.js จริง', JSON.stringify(A.assets.slice(0, 4)));
    ok(await visible(A.page, '#lg-id'), 'เห็นฟอร์มล็อกอิน');
    await shot(A.page, '1-login');
    await A.page.click('button[data-mode="register"]');
    await A.page.fill('#lg-id', ID); await A.page.fill('#lg-pw', PW); await A.page.fill('#lg-pw2', 'ไม่ตรง99');
    await A.page.click('#lg button.go');
    ok((await A.page.textContent('#lg-msg')) === 'รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'รหัสไม่ตรง → ข้อความไทย');
    await A.page.fill('#lg-pw2', PW); await A.page.fill('#lg-name', 'นักทดสอบ');
    const box = await A.page.evaluate(() => { const r = document.querySelector('#lg .box').getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; });
    ok(box.top >= 0 && box.bottom <= 390 + 1, 'ฟอร์มสมัครพอดีจอแนวนอน 390px', JSON.stringify(box));
    await shot(A.page, '2-register');
    await A.page.click('#lg button.go');
    await A.page.waitForFunction(() => window.__G.net.phase === 'ready', null, { timeout: 15000 });
    await wait(500);
    ok(!(await visible(A.page, '#lg')), 'เข้าเกมแล้ว หน้าล็อกอินหายไป');
    const p1 = await A.page.evaluate(() => ({ id: window.__G.player.id, name: window.__G.player.name, coin: window.__G.player.coin }));
    ok(p1.id === ID && p1.name === 'นักทดสอบ' && p1.coin === 0, 'G.player id/ชื่อ/เงินเริ่ม 0', JSON.stringify(p1));
    const synced = await A.page.evaluate(async () => (await import('/v6/src/core/time.js')).isSynced());
    ok(synced, 'srvNow ซิงก์เวลาเซิร์ฟเวอร์แล้ว');
    await shot(A.page, '3-ingame');

    /* ===== เซฟผ่านระบบเซฟจริง (ใส่ระบบทดสอบเข้ารายชื่อ เฉพาะในเทส) ===== */
    const st = await A.page.evaluate(async () => {
      const sys = (await import('/v6/src/systems/index.js')).default, bus = await import('/v6/src/core/bus.js');
      sys.push({ id: 'qatest', save: () => ({ n: 42, t: 'ทดสอบ' }) });
      return new Promise(r => { bus.on('save:status', d => r(d)); bus.emit('save:request'); setTimeout(() => r({ ok: false, error: 'timeout' }), 8000); });
    });
    ok(st.ok === true, 'save:request → save:status ok', JSON.stringify(st));

    /* ===== รีโหลด → ยังล็อกอิน (ไม่เห็นฟอร์ม) ===== */
    console.log('— รีโหลดหน้า');
    await A.page.reload();
    await A.page.waitForFunction(() => window.__G && window.__G.net.phase === 'ready', null, { timeout: 15000 });
    await wait(500);
    ok(!(await visible(A.page, '#lg')), 'รีโหลดแล้วยังล็อกอิน ไม่ต้องพิมพ์รหัส');
    ok((await A.page.evaluate(() => window.__G.player.name)) === 'นักทดสอบ', 'ชื่อยังอยู่');
    await shot(A.page, '4-reload');

    /* ===== ไอดีเดียวเข้าซ้อนจากเครื่องอื่น → เครื่องแรกถูกเตะ + ข้อความไทย ===== */
    console.log('— เครื่องที่ 2 ล็อกอินไอดีเดียวกัน');
    const B = await openV6(browser);
    await B.page.waitForFunction(() => window.__G.net.phase === 'login', null, { timeout: 10000 });
    await B.page.fill('#lg-id', ID); await B.page.fill('#lg-pw', 'ผิดรหัส1');
    await B.page.click('#lg button.go');
    await B.page.waitForFunction(() => document.querySelector('#lg-msg').textContent !== '', null, { timeout: 10000 });
    ok((await B.page.textContent('#lg-msg')) === 'ไอดีหรือรหัสผ่านไม่ถูกต้อง', 'รหัสผิด → ข้อความไทย');
    ok((await B.page.inputValue('#lg-id')) === ID, 'ใส่ผิดแล้วไอดีที่พิมพ์ไม่หาย');
    await B.page.fill('#lg-pw', PW); await B.page.click('#lg button.go');
    await B.page.waitForFunction(() => window.__G.net.phase === 'ready', null, { timeout: 15000 });
    await A.page.waitForFunction(() => window.__G.net.phase === 'kicked', null, { timeout: 10000 });
    ok((await A.page.textContent('#lg-info')) === 'ไอดีนี้เข้าเล่นจากเครื่องหรือแท็บอื่น', 'เครื่องแรกเห็นว่าถูกเข้าซ้อน');
    await shot(A.page, '5-kicked');
    const errs = [...A.errors, ...B.errors].filter(e => !/WebSocket|ERR_CONNECTION|Failed to load resource/.test(e));
    ok(errs.length === 0, 'ไม่มี error ในหน้าเว็บ', errs.join(' | '));
    await A.ctx.close(); await B.ctx.close();

    /* ===== เซฟอยู่บนเซิร์ฟเวอร์จริง (ล็อกอินตรงผ่าน ws) ===== */
    const got = await wsTalk('/v6ws', [{ t: 'login', r: 1, id: ID, pw: PW }, { t: 'load', r: 2 }]);
    const doc = got[2] && got[2].doc;
    ok(doc && doc.seq >= 1 && doc.systems.qatest && doc.systems.qatest.n === 42 && doc.server.coin === 0, 'เซฟอยู่บนเซิร์ฟเวอร์หลังปิดเกม', JSON.stringify(doc));
    const files = fs.readdirSync(path.join(dataDir, 'v6'));
    ok(files.length >= 2, 'เก็บที่ DATA_DIR/v6/ (แยกจากเกมเดิม)', files.join(','));
  } catch (e) {
    fail++; console.log('  ❌ เทสพัง', e && e.stack);
  } finally {
    await browser.close();
    srv.kill();
    await wait(300);
    fs.rmSync(dataDir, { recursive: true, force: true });
    if (fail) console.log('— log เซิร์ฟเวอร์:\n' + srvLog.slice(-1500));
  }
  console.log(`\nผ่าน ${pass} · พัง ${fail}`);
  process.exit(fail ? 1 : 0);
})();
