/* บัค A (TASKS ระยะ 3): "สู้ที่แท่นผนึกอสูรแล้วออก ไปโผล่หน้าทางออกทุ่งหญ้า แทนที่จะกลับหอผนึกอสูร" (เจ้าของแจ้ง 3 รอบ)
   เล่นแบบผู้เล่นจริง: สมัคร → ล็อกอิน → เดินเข้าหอผนึกอสูร → กด E ที่แท่น → กดปุ่ม "⚔️ ท้าสู้" → ออกจากลานด้วยทุกทาง แล้วดูว่าโผล่ที่ไหน
   ทุกทางที่เข้าจากในหอผนึก ต้องกลับมาในหอผนึก (shop:seal113) — ห้ามโผล่ทุ่งหญ้า (field) / หน้าประตูมิติ
   ตาย → ฟื้นที่วิหาร = ไปจุดเกิดในเมือง (เป็นการฟื้นที่วิหาร ไม่ใช่ทางออกลาน) · ห้ามโผล่ทุ่งหญ้า
   พอร์ต: ELD_PORT (ค่าเริ่ม 8844) · ใช้ ELD_ROUTES=a,b,c เลือกเฉพาะบางทางได้ */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const PORT = String(process.env.ELD_PORT || 8844), ORIGIN = 'http://127.0.0.1:' + PORT, URL = ORIGIN + '/?server=ws://127.0.0.1:' + PORT;
/* ทางออกทั้งหมด · want = ฉากที่ผู้เล่นต้องอยู่หลังออก */
const ROUTES = {
  circleE:   { want: 'shop:seal113', how: 'ยืนบนวงเวททางออก กด E' },
  attackBtn: { want: 'shop:seal113', how: 'ยืนบนวงเวททางออก กดปุ่มโจมตี (J / ⚔️)' },
  walkExit:  { want: 'shop:seal113', how: 'เดินลงไปเหยียบวงเวททางออก ไม่กดอะไร (ต้องยังอยู่ในลาน) แล้วกด E' },
  winExit:   { want: 'shop:seal113', how: 'ชนะบอส → กดปุ่ม "🏰 ออกจากลาน" ในหน้าต่างรางวัล' },
  winCircle: { want: 'shop:seal113', how: 'ชนะบอส → ปิดหน้าต่างรางวัล → เดินไปวงเวทกด E' },
  surrender: { want: 'shop:seal113', how: 'เมนู 🐲/แท่นผนึกในลาน → "🏰 ออกจากลาน" (ยอมแพ้)' },
  timeout:   { want: 'shop:seal113', how: 'ปล่อยให้หมดเวลา 8 นาที' },
  scroll:    { want: 'town',         how: 'ใช้ม้วนวาปกลับเมือง' },
  die:       { want: 'town',         how: 'ตายในลาน → ฟื้นที่วิหาร' },
  dieFeather:{ want: 'shop:seal113', how: 'ตายในลาน → ฟื้นด้วยขนนกฟีนิกซ์ → วงเวท กด E' },
  reconnect: { want: 'shop:seal113', how: 'เน็ตหลุดแล้วต่อใหม่ระหว่างอยู่ในลาน → วงเวท กด E' },
  reload:    { want: 'town',         how: 'รีโหลดเกมระหว่างอยู่ในลาน (เกมเริ่มที่เมืองเสมอ)' },
  twice:     { want: 'shop:seal113', how: 'ลงลานรอบ 2 ติดกัน (ชนะ → ออก → ท้าใหม่) → วงเวท กด E' },
};
(async () => {
  const pick = process.env.ELD_ROUTES ? process.env.ELD_ROUTES.split(',') : Object.keys(ROUTES);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eld-seal-'));
  const srv = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, NODE_PATH: [process.env.NODE_PATH, '/opt/npm-tools/node_modules'].filter(Boolean).join(':'), DATA_DIR: dir, PORT, UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' }, stdio: ['ignore', 'pipe', 'inherit'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { srv.stdout.once('data', resolve); srv.once('error', reject); srv.once('exit', code => reject(Error('server exited ' + code))); });
    const launch = { args: ['--no-sandbox', '--enable-unsafe-swiftshader'] };
    if (process.env.ELD_CHROMIUM) launch.executablePath = process.env.ELD_CHROMIUM;
    browser = await chromium.launch(launch);
    const ctx = await browser.newContext({ viewport: { width: 915, height: 412 } });
    await ctx.route('**/*', r => r.request().url().startsWith(ORIGIN) ? r.continue() : r.abort());
    const page = await ctx.newPage(); page.setDefaultTimeout(60000);
    const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept());
    const snap = () => page.evaluate(() => { const sc = !D ? 'field' : D.lb62 != null ? 'arena62:' + D.lb62 : D.shop ? 'shop:' + D.shop : D.town ? 'town' : D.zone ? 'zone:' + (D.zone.Zd && D.zone.Zd.id) : 'other';
      return { scene: sc, tx: +(P.x / T).toFixed(1), ty: +(P.y / T).toFixed(1), dead: !!P.dead, msg: (document.getElementById('msg') || {}).textContent } });
    const ready = async () => {
      await page.waitForFunction(() => typeof ONL32 !== 'undefined' && (ONL32.verified || !!document.getElementById('tPlay')));
      if (!await page.evaluate(() => ONL32.verified)) await page.locator('#tPlay').click();
      await page.waitForFunction(() => typeof ONL32 !== 'undefined' && ONL32.verified && window.SRV && SRV.ok && titleEl.hidden && !(window.SCENEREADY && SCENEREADY.busy), null, { timeout: 90000 });
      await page.evaluate(() => { try { intro.hidden = true; CINE.L = null; cineEl.hidden = true; TUT.on = false; gid('tut').hidden = true } catch (e) {} try { dlgClose(true) } catch (e) {}
        PAUSED = false; P.lv = Math.max(P.lv, 150); inv.coin = Math.max(inv.coin | 0, 5e6); inv.scroll = Math.max(inv.scroll | 0, 5); inv.phoenix = Math.max(inv.phoenix | 0, 3);
        try { refreshInv(); recalcStats() } catch (e) {} P.hp = BAL.hp; P.stun = 0 });
    };
    /* โควตาวันละ 2 ครั้ง (fix118) + คูลดาวน์ 30 นาที (fix64) เก็บใน fm_* ที่ซิงก์ขึ้นคลาวด์ → ล้างแล้วต้องเซฟขึ้นเซิร์ฟก่อนรีโหลด ไม่งั้นโหลดกลับมา */
    const freshQuota = () => page.evaluate(async () => { localStorage.removeItem('fm_lbcd64'); localStorage.removeItem('fm_seal118'); try { saveGame(true); await safeSync123() } catch (e) {} });
    const reloadGame = async () => { await freshQuota(); await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => !window.FM_LOADING && window.REG136); await ready(); };
    /* สมัคร + สร้างตัวละคร */
    await page.goto(URL, { waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => !window.FM_LOADING && window.REG136);
    await page.evaluate(() => tRegForm()); await page.locator('#rId').fill('sealtester'); await page.locator('#rPw').fill('Test1234'); await page.locator('#rPw2').fill('Test1234'); await page.locator('#rGo').click();
    await page.locator('#cc41n').fill('นักผนึก'); await Promise.all([page.waitForEvent('domcontentloaded'), page.locator('#cc41go').click()]);
    await ready();
    const press = async (k, ms = 2500) => { await page.keyboard.press(k); await page.waitForTimeout(ms) };
    const toCircle = () => page.evaluate(() => { P.x = D.zone.ent.x * T + 16; P.y = (D.zone.ent.y + 2) * T + 6; P.dir = 'd'; P.kx = P.ky = 0; P.stun = 0 });
    const clickDlg = async re => { await page.waitForFunction(() => DLG.open); await page.evaluate(() => { DLG.typing = false; DLG.shown = DLG.txt.length; dlgShowChoices() }); await page.waitForTimeout(200);
      await page.locator('#dlg button, #dlg .ch, #dlg [data-i]').filter({ hasText: re }).first().click(); await page.waitForTimeout(2500) };
    /* เข้าลานแบบผู้เล่น: เมือง → เดินเข้าหอผนึก → ยืนหน้าแท่น กด E → ปุ่ม ⚔️ ท้าสู้ */
    /* โควตา fix118 = วันละ 2 ครั้งต่อบอส (อ่านจาก localStorage ตอนโหลดเกมเท่านั้น) → หมุนบอส 6 ตัว แทนการรีโหลดทุกทาง (เทสเร็วขึ้น ~2 เท่า) */
    let entries = 0;
    const enterViaSeal = async () => { const boss = entries++ % 6;
      await page.evaluate(async () => { const sl = ms => new Promise(r => setTimeout(r, ms)); try { if (D && D.shop) leaveShop(true) } catch (e) {} for (let k = 0; k < 3 && D && !D.town; k++) { try { exitD() } catch (e) {} await sl(300) }
        if (!D || !D.town) { enterTown(1); await sl(600) } const d = D.doors.find(q => q.id === 'seal113'); P.x = d.cx; P.y = d.cy + 30; P.dir = 'u'; P.stun = 0 });
      await page.keyboard.down('w'); await page.waitForFunction(() => D && D.shop === 'seal113', null, { timeout: 8000 }).catch(() => {}); await page.keyboard.up('w');
      if (!await page.evaluate(() => D && D.shop === 'seal113')) await page.evaluate(() => enterShop('seal113')); /* ประตูบางบานต้องกด E */
      await page.waitForTimeout(800);
      await page.evaluate(() => { P.x = OX + 8 * T; P.y = 7 * T + 70; P.dir = 'u'; P.stun = 0 });
      await press('e', 900);
      const seal = await snap();
      await page.locator('#al113 .bc113').nth(boss).locator('button:not([disabled])', { hasText: 'ท้าสู้' }).click(); await page.waitForTimeout(2500);
      return seal;
    };
    const win = async () => { await page.evaluate(() => { const b = D.boss; b.hp = 1; mobKill(b) }); await page.waitForTimeout(1500) };
    const R = {};
    for (const name of pick) {
      await freshQuota(); const r = { how: ROUTES[name].how };
      try {
        r.from = await enterViaSeal();
        r.arena = await snap();
        if (!/^arena62/.test(r.arena.scene)) throw Error('เข้าลานไม่ได้ ' + JSON.stringify(r.arena));
        if (name === 'circleE') { await toCircle(); await press('e') }
        else if (name === 'attackBtn') { await toCircle(); await press('j') }
        else if (name === 'walkExit') { await page.evaluate(() => { P.x = D.zone.ent.x * T + 16; P.y = (D.zone.ent.y - 1) * T + 16; P.dir = 'd'; P.stun = 0 });
          /* เดินลงจนเท้าถึงวงเวท (เครื่องเทสเฟรมเรทต่ำ → กดค้างจนถึง ไม่ใช้เวลาตายตัว) */
          await page.keyboard.down('s'); await page.waitForFunction(() => !(D && D.lb62 != null) || zExitNear(), null, { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(1500); await page.keyboard.up('s'); await page.waitForTimeout(1500);
          r.stood = await snap(); r.near = await page.evaluate(() => !!(D && D.zone && zExitNear()));
          if (!/^arena62/.test(r.stood.scene)) throw Error('เหยียบวงเวทเฉย ๆ แล้วหลุดออกจากลาน ' + JSON.stringify(r.stood));
          if (!r.near) throw Error('เดินไม่ถึงวงเวท ' + JSON.stringify(r.stood)); await press('e') }
        else if (name === 'winExit') { await win(); await clickDlg(/ออกจากลาน/) }
        else if (name === 'winCircle') { await win(); await page.waitForFunction(() => DLG.open); await page.evaluate(() => dlgClose(true)); await toCircle(); await press('e') }
        else if (name === 'surrender') { await page.evaluate(() => openAltar62()); await clickDlg(/ออกจากลาน/) }
        else if (name === 'timeout') { await page.evaluate(() => { D.el = 479 }); await page.waitForTimeout(4000) }
        else if (name === 'scroll') { await page.evaluate(() => { P.x = D.zone.ent.x * T + 16; P.y = (D.zone.ent.y - 4) * T; P.kx = P.ky = 0; P.mv = false; P.at = -1; P.stun = 0; P.dash = 0; for (const m of D.mobs) m.dead = true; useScroll() }); r.cast = await snap();
          await page.waitForFunction(() => !(D && D.lb62 != null), null, { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(2500) }
        else if (name === 'die' || name === 'dieFeather') { await page.evaluate(() => { P.iframe = 0; P.hp = 1; die() }); await page.waitForTimeout(2200); r.dead = await snap();
          await page.locator(name === 'die' ? '#death button.tp' : '#death button.ph').click(); await page.waitForTimeout(2500);
          if (name === 'dieFeather') { await toCircle(); await press('e') } }
        else if (name === 'reconnect') { await page.evaluate(() => { try { NET.ws && NET.ws.close() } catch (e) {} }); await page.waitForFunction(() => NET.on, null, { timeout: 30000 }); await page.waitForTimeout(1500); r.back = await snap(); await toCircle(); await press('e') }
        else if (name === 'reload') { await page.waitForTimeout(2000); await reloadGame(); entries = 0; await page.waitForTimeout(1500) }
        else if (name === 'twice') { await win(); await clickDlg(/ออกจากลาน/); r.first = await snap(); await freshQuota(); r.from2 = await enterViaSeal(); r.arena2 = await snap(); await toCircle(); await press('e') }
        r.out = await snap();
      } catch (e) { r.err = String(e && e.message || e).slice(0, 200); try { r.out = await snap() } catch (_) {} }
      r.ok = !!(r.out && r.out.scene === ROUTES[name].want && !r.out.dead);
      R[name] = r; console.log(r.ok ? 'OK  ' : 'BAD ', name, JSON.stringify(r));
      try { await page.evaluate(() => { if (P.dead) reviveTemple() }) } catch (e) {}
      /* เก็บกวาดก่อนทางถัดไป: ปิดหน้าต่าง · ออกจากลาน/ร้านกลับเมือง · เลือดเต็ม */
      await page.evaluate(async () => { const sl = ms => new Promise(r => setTimeout(r, ms)); try { dlgClose(true) } catch (e) {} try { p6close(gid('al113')) } catch (e) {}
        try { if (D && D.lb62 != null) { exitD(); await sl(300) } } catch (e) {} try { if (D && D.shop) leaveShop(true) } catch (e) {} for (let k = 0; k < 3 && D && !D.town; k++) { try { exitD() } catch (e) {} await sl(300) }
        if (!D || !D.town) { enterTown(1); await sl(600) } P.recall = 0; P.hp = BAL.hp; P.stun = 0; PAUSED = false }).catch(() => {});
      if (entries >= 12 && name !== 'reload') { await reloadGame(); entries = 0 } /* ใช้โควตาครบทุกตัวแล้ว → โหลดเกมใหม่ */
    }
    const bad = Object.keys(R).filter(k => !R[k].ok);
    assert.deepEqual(errors.filter(e => !/ResizeObserver/.test(e)), [], 'ไม่มี error ในหน้าเกม');
    assert.equal(bad.length, 0, 'ออกจากลานผนึกแล้วโผล่ผิดที่: ' + bad.map(k => k + ' → ' + (R[k].out && R[k].out.scene) + (R[k].err ? ' (' + R[k].err + ')' : '')).join(' · '));
    console.log('SEAL EXIT ROUTES PASS', Object.keys(R).length);
  } finally { try { await browser?.close() } catch (e) {} srv.kill(); fs.rmSync(dir, { recursive: true, force: true }) }
})().catch(e => { console.error(e); process.exit(1) });
