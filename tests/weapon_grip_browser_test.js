/* อาวุธยิงไกลทุกแบบ (เจ้าของแจ้งซ้ำ 3 รอบ 2026-10-21): ธนูทุกอาชีพ×ทุกแฟชั่น×ระดับ 0–10 ต้องโค้งเข้าหาคนยิง · ปืนสไนต้องไม่มีออร่ารูปคันธนู · สไนลากเล็งต้องหันข้าง
   รันเช็ก REG136 ของเรื่องนี้ในเกมจริง · เทสนี้พังกับโค้ด v5.60 (ธนูปีกหงส์ 11 ระดับกลับด้าน + ออร่าคันธนูบนปืน) */
const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eld-weapon-'));
  const srv = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, DATA_DIR: dir, PORT: '8787', UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' }, stdio: ['ignore', 'pipe', 'inherit'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { srv.stdout.once('data', resolve); srv.once('error', reject); srv.once('exit', code => reject(Error('server exited ' + code))); });
    const launch = { args: ['--no-sandbox', '--enable-unsafe-swiftshader'] };
    if (process.env.ELD_CHROMIUM) launch.executablePath = process.env.ELD_CHROMIUM;
    browser = await chromium.launch(launch);
    const page = await browser.newPage({ viewport: { width: 915, height: 412 }, isMobile: true, hasTouch: true });
    page.setDefaultTimeout(180000); const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', r => r.request().url().startsWith('http://127.0.0.1:8787') ? r.continue() : r.abort());
    await page.goto('http://127.0.0.1:8787/?server=ws://127.0.0.1:8787', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !window.FM_LOADING && typeof window.REG136 !== 'undefined');
    const res = await page.evaluate(() => REG136.filter(r => /v561|v557/.test(r[0])).map(r => [r[0], r[1]()]));
    console.log(JSON.stringify(res));
    assert.equal(res.length, 3, 'มีเช็กอาวุธครบ 3 ข้อ');
    for (const [name, err] of res) assert.equal(err, null, name + ': ' + err);
    assert.deepEqual(errors, []);
    console.log('WEAPON GRIP PASS');
  } finally { try { await browser?.close() } catch (e) {} srv.kill(); fs.rmSync(dir, { recursive: true, force: true }) }
})().catch(e => { console.error(e); process.exit(1) });
