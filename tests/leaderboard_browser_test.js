/* เปิดหน้าเกมจริง กดอันดับ/ทุกแท็บ/รีเฟรช บนมือถือแนวนอนและจอแคบ */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eld-rank-ui-'));
  const srv = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, DATA_DIR: dir, PORT: '8787', UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' }, stdio: ['ignore', 'pipe', 'inherit'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { srv.stdout.once('data', resolve); srv.once('error', reject); srv.once('exit', code => reject(Error('server exited '+code))); });
    const launch = { args: ['--no-sandbox', '--enable-unsafe-swiftshader'] };
    if (process.env.ELD_CHROMIUM) launch.executablePath = process.env.ELD_CHROMIUM;
    if (process.env.ELD_CHROMIUM_ARGS) launch.args = JSON.parse(process.env.ELD_CHROMIUM_ARGS);
    browser = await chromium.launch(launch);
    const page = await browser.newPage({ viewport: { width: 915, height: 412 }, isMobile: true, hasTouch: true });
    page.setDefaultTimeout(120000); const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => {
      const url = route.request().url();
      if (!url.startsWith('http://127.0.0.1:8787')) return route.abort();
      if (process.env.ELD_RANK_BASELINE && url.includes('/js/097-fix65.js')) return route.fulfill({ contentType: 'text/javascript', body: execFileSync('git', ['show', 'HEAD:js/097-fix65.js'], { cwd: path.join(__dirname, '..') }) });
      return route.continue();
    });
    await page.goto('http://127.0.0.1:8787/?server=ws://127.0.0.1:8787', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !window.FM_LOADING && typeof window.openLb20 === 'function' && typeof window.REG136 !== 'undefined').catch(async e=>{console.log('BOOT DIAGNOSTIC',await page.evaluate(()=>({loading:window.FM_LOADING,boot:window.SERVER_BOOT&&{ready:SERVER_BOOT.ready,error:SERVER_BOOT.error},text:document.body.innerText.slice(0,700),last:[...document.scripts].slice(-10).map(s=>s.src)})));throw e});
    /* ไม่มีบัญชี: UI ต้องบอกเหตุผลซิงค์ แม้ยังไม่มีชื่อบนเซิร์ฟเวอร์ */
    await page.evaluate(() => { titleEl.hidden = true; intro.hidden = true; dlgClose(true); });
    await page.evaluate(() => openLb20(true, true));
    assert.match(await page.locator('#lb20').innerText(), /ไม่พบบัญชีที่เข้าสู่ระบบ/, 'empty rankings must show sync failure');
    /* เตรียมผู้เล่นจำลองผ่าน API จริง แล้วให้ปุ่มรีเฟรชอ่านจากเซิร์ฟเวอร์ */
    await page.evaluate(async () => {
      const post = async (url, body) => (await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })).json();
      for (const [id, name, lv, kills, coin] of [['rankone', 'อันดับหนึ่ง', 12, 100, 2147483748], ['ranktwo', 'อันดับสอง', 10, 20, 500]]) {
        const a = await post('/api/register', { id, pw: 'Test1234', name });
        const s = await post('/api/save', { id, token: a.token, base: 0, save: '{}', lv, name, stat: { kills, boss: lv, floor: lv, w: coin } });
        if (!s.ok) throw Error(JSON.stringify(s));
      }
    });
    await page.locator('#lb20 [data-lb-refresh]').click();
    await page.waitForFunction(() => !LB20.busy && LB20.data?.n === 2);
    for (const tab of ['lv', 'k', 'b', 'w', 'fl']) {
      await page.locator(`#lb20 button[onclick="lbTab20('${tab}')"]`).click();
      assert.match(await page.locator('#lb20 .p1').innerText(), /อันดับหนึ่ง/);
    }
    assert.equal(await page.evaluate(() => LB20.data.w[0].v), 2147483748);
    await page.evaluate(() => { LB20.syncPending = true; lbRender20(); });
    assert.match(await page.locator('#lb20').innerText(), /กำลังรอผลซิงค์/);
    await page.evaluate(async () => { if(document.fullscreenElement)await document.exitFullscreen(); });
    await page.setViewportSize({ width: 568, height: 320 });
    await page.evaluate(() => lbRender20());
    assert.ok(await page.locator('#lb20 .tabs').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'tabs must fit a narrow screen');
    await page.locator('#lb20 .hd button').last().click();
    assert.equal(await page.locator('#lb20').isVisible(), false);
    assert.deepEqual(errors, [], 'ranking interactions must not throw page errors');
    console.log('RANKING UI PASS');
    if (process.env.ELD_FULL_PLAYTEST) {
      await page.exposeFunction('rankTestProgress', message => console.log('QA', message));
      let deadline;
      const result = await Promise.race([page.evaluate(() => SystemValidator.runFullGamePlaytest({onProgress: message => window.rankTestProgress(message)})), new Promise((_, reject) => { deadline = setTimeout(() => reject(Error('full playtest exceeded 420 seconds')), 420000); })]).finally(() => clearTimeout(deadline));
      console.log('FULL PLAYTEST', JSON.stringify(result));
      assert.deepEqual(result.bugs, []);
      assert.equal(result.regression.fail, 0);
    }
    console.log('ALL PASS');
  } finally {
    await browser?.close(); srv.kill(); await new Promise(resolve => srv.exitCode !== null ? resolve() : srv.once('exit', resolve)); fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
