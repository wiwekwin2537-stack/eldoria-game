/* ระยะ 4 ข้อแรก: ล็อกพฤติกรรม "ออกจากสถานที่" (exitD) ทุกที่ ก่อนรวมชั้นที่เขียนทับกัน
   เข้าแต่ละที่ด้วยฟังก์ชันจริง → กดออก (exitD) → บันทึกสิ่งที่ผู้เล่นได้: ฉาก · ตำแหน่ง · ข้อความ · ล้างสมุน/กระสุน/แถบบอส
   บอสโลกไม่อยู่ในเทส (เข้าได้เฉพาะ 12:00/20:00 ผลจึงขึ้นกับเวลา) · ELD_RECORD=1 = บันทึกผลของโค้ดปัจจุบันลง fixtures (ทำครั้งเดียวกับโค้ดก่อนรวมชั้น) · ปกติ = ต้องตรงกับที่บันทึกไว้ทุกข้อ */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const FIX = path.join(__dirname, 'fixtures', 'exit_scenes.json');
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eld-exit-'));
  const srv = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, DATA_DIR: dir, PORT: '8787', UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' }, stdio: ['ignore', 'pipe', 'inherit'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { srv.stdout.once('data', resolve); srv.once('error', reject); srv.once('exit', code => reject(Error('server exited ' + code))); });
    const launch = { args: ['--no-sandbox', '--enable-unsafe-swiftshader'] };
    if (process.env.ELD_CHROMIUM) launch.executablePath = process.env.ELD_CHROMIUM;
    browser = await chromium.launch(launch);
    const page = await browser.newPage({ viewport: { width: 915, height: 412 }, isMobile: true, hasTouch: true });
    page.setDefaultTimeout(180000); const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:8787') ? route.continue() : route.abort());
    await page.goto('http://127.0.0.1:8787/?server=ws://127.0.0.1:8787', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !window.FM_LOADING && typeof window.exitD === 'function' && typeof window.REG136 !== 'undefined');
    const out = await page.evaluate(async () => {
      const sl = ms => new Promise(r => setTimeout(r, ms)), R = {};
      const flags = () => D ? Object.keys(D).filter(k => D[k] === true || D[k] === 1).sort().join(',') + (typeof D.name === 'string' ? '|' + D.name : '') : 'field';
      const msg = () => { const e = document.getElementById('msg'); return e ? e.textContent : '' };
      const snap = () => ({ scene: flags(), x: Math.round(P.x), y: Math.round(P.y), dir: P.dir, msg: msg(), min: MIN.length, zproj: typeof ZPROJ !== 'undefined' ? ZPROJ.length : -1, bm: typeof bmEl !== 'undefined' ? !!bmEl.hidden : null, sh: typeof shopEl !== 'undefined' ? !!shopEl.hidden : null });
      const reset = async () => { try { PAUSED = false; P.dead = false; P.hp = BAL.hp; P.lv = 150; P.kx = P.ky = 0 } catch (e) {} try { toTown() } catch (e) {} await sl(900); try { P.x = 20 * T; P.y = 12 * T; MIN.push({ k: 'probe', x: P.x, y: P.y }); if (typeof ZPROJ !== 'undefined') { ZPROJ.length = 0; ZPROJ.push({}) } } catch (e) {} };
      const CASES = [
        ['เมือง → ออก (ทั่วไป)', async () => {}],
        ['เมือง → ขอบตะวันออก Lv.150', async () => { P.x = (TW - 2) * T }],
        ['เมือง → ขอบตะวันออก Lv.1', async () => { P.lv = 1; P.x = (TW - 2) * T }],
        ['ร้าน gear', async () => enterShop('gear')],
        ['ร้าน inn', async () => enterShop('inn')],
        ['ร้าน hall', async () => enterShop('hall')],
        ['ร้าน seal113', async () => enterShop('seal113')],
        ['บ้าน', async () => enterHome()],
        ['ดันเจี้ยนแรก', async () => enterD()],
        ['ดันเจี้ยน 40', async () => enterDg(40)],
        ['เหมือง/ป่า 0', async () => enterZone(0)],
        ['เหมือง/ป่า 5', async () => enterZone(5)],
        ['หอคอย 1', async () => enterTower10(1)],
        ['ตลาด', async () => enterMk10()],
        ['หอประชุม', async () => enterHall()],
        ['สนามประลอง', async () => enterArena8()],
        ['สถานที่ 62-0', async () => enter62(0)],
        ['ดันเจี้ยน 96-0', async () => enterDg96(0)],
        ['ฉากจบ 92', async () => enterEnd92()],
        ['เมือง 2', async () => enterCity2()],
        ['ถนน 144', async () => enterRoad144('west', true)],
      ];
      for (const [name, go] of CASES) {
        await reset(); const r = {};
        try { await go(); await sl(1500); r.in = snap() } catch (e) { r.inErr = String(e && e.message || e).slice(0, 80) }
        try { exitD(); await sl(1500); r.out = snap() } catch (e) { r.outErr = String(e && e.message || e).slice(0, 80) }
        R[name] = r;
      }
      return R;
    });
    if (process.env.ELD_RECORD) { fs.mkdirSync(path.dirname(FIX), { recursive: true }); fs.writeFileSync(FIX, JSON.stringify(out, null, 1) + '\n'); console.log('EXIT SCENES RECORDED', Object.keys(out).length); }
    else {
      const want = JSON.parse(fs.readFileSync(FIX, 'utf8'));
      /* จุดเกิดตอนเข้า (in.x/y) ของดันเจี้ยนสุ่มแผนที่ เปลี่ยนทุกครั้ง — ไม่เกี่ยวกับ exitD จึงไม่เทียบ · ผลตอนออก (out) เทียบทุกค่า */
      const norm = v => v && v.in ? { ...v, in: { ...v.in, x: 0, y: 0 } } : v;
      const bad = Object.keys(want).filter(k => JSON.stringify(norm(out[k])) !== JSON.stringify(norm(want[k])));
      for (const k of bad) console.log('DIFF', k, '\n got ', JSON.stringify(out[k]), '\n want', JSON.stringify(want[k]));
      assert.equal(bad.length, 0, 'ออกจากสถานที่ต้องเหมือนเดิม: ' + bad.join(', '));
      console.log('EXIT SCENES PASS', Object.keys(want).length);
    }
  } finally { try { await browser?.close() } catch (e) {} srv.kill(); fs.rmSync(dir, { recursive: true, force: true }) }
})().catch(e => { console.error(e); process.exit(1) });
