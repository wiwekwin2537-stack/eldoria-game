/* เทสยิงหนัก /v6ws (1B-f · ต้องผ่านก่อนตั้ง V6_ENABLE=1 บน Render) — รันในเครื่องเท่านั้น ไม่แตะเน็ตนอก
   node v6/tests/server.load.cjs [วินาที=12]
   จำลอง: ws เกมเดิม (ตอบ ping) + v6 บน http.Server เดียวกัน · ที่เก็บช้า 150 ms/คำสั่ง (เหมือน Upstash ข้ามภูมิภาค)
   ผู้โจมตี 20 IP × 4 ซ็อกเก็ต ยิง 30 ข้อความ/วิ: hello แนบขยะ 300 KB · hello โทเคนมั่ว · บัญชีจริงเซฟ 250 KB รัว · ต่อใหม่ทันทีเมื่อโดนตัด
   ผู้โจมตีรันเป็นโปรเซสลูกแยก (ไม่แย่ง CPU ของเซิร์ฟเวอร์ที่วัด — เหมือนของจริงที่ผู้โจมตีอยู่เครื่องอื่น)
   ผ่านเมื่อ: heap โตไม่เกิน 80 MB · ws เกมเดิมตอบครบ p95 < 250 ms · คำสั่งที่เก็บไม่เกินงบต่อนาที (120) */
const http = require('http');
const path = require('path');
const { spawnSync, spawn } = require('child_process');

if (process.argv[2] === 'attack') { runAttacker(+process.argv[3], process.argv[4]); return; }
if (typeof global.gc !== 'function') { /* เปิด gc ให้วัด heap ได้แม่น แล้วรันตัวเองใหม่ */
  const r = spawnSync(process.execPath, ['--expose-gc', __filename, ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(r.status == null ? 1 : r.status);
}
const req = m => { try { return require(m); } catch (e) { return require('/opt/npm-tools/node_modules/' + m); } };
const WS = req('ws');
const V6 = require(path.join(__dirname, '..', 'server', 'index.cjs'));
const { memoryStore } = require(path.join(__dirname, '..', 'server', 'store.cjs'));

const SECS = +process.argv[2] || 12;
const wait = ms => new Promise(r => setTimeout(r, ms));
const heapMB = () => { global.gc(); return process.memoryUsage().heapUsed / 1048576; };

function slowStore(ms) {
  const m = memoryStore(), s = { kind: 'memory', ops: 0 };
  for (const k of ['get', 'set', 'create']) s[k] = async (a, b) => { s.ops++; await wait(ms); return m[k](a, b); };
  return s;
}

(async () => {
  const store = slowStore(150);
  const v6 = V6.createV6({ store, env: { GM_IDS: 'tiksi', MAX_PER_IP: '4', V6_PROXY_HOPS: '1' }, log: () => {}, wsLib: WS });
  const server = http.createServer((q, s) => { if (v6.http(q, s)) return; s.end('old'); });
  const oldWss = new WS.WebSocketServer({ server, maxPayload: 32768, perMessageDeflate: false });
  oldWss.on('connection', s => s.on('message', m => s.send(String(m))));
  v6.attach(server);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port, URL6 = `ws://127.0.0.1:${port}/v6ws`;

  /* บัญชีจริงของผู้โจมตี (เซฟรัว) */
  const token = await new Promise((ok, no) => {
    const s = new WS.WebSocket(URL6, { headers: { 'x-forwarded-for': '198.51.100.250' } });
    s.on('message', m => { const d = JSON.parse(String(m)); if (d.t === 'welcome') s.send(JSON.stringify({ t: 'register', id: 'loadatk', pw: 'abc123' })); if (d.t === 'auth_ok') { s.close(); ok(d.token); } if (d.t === 'auth_no') no(new Error(d.why)); });
    s.on('error', no);
  });

  const base = heapMB();
  const kid = spawn(process.execPath, [__filename, 'attack', String(port), token], { stdio: ['ignore', 'pipe', 'inherit'] });
  let kidOut = ''; kid.stdout.on('data', d => kidOut += d);

  /* ws เกมเดิม: ping ทุก 200 ms วัดเวลาไป-กลับ */
  const old = new WS.WebSocket(`ws://127.0.0.1:${port}/`);
  await new Promise(r => old.on('open', r));
  const rtts = []; let sent = 0, got = 0; const pend = new Map();
  old.on('message', m => { const t = pend.get(String(m)); if (t) { pend.delete(String(m)); got++; rtts.push(Date.now() - t); } });
  const pinger = setInterval(() => { const k = 'p' + (++sent); pend.set(k, Date.now()); old.send(k); }, 200);

  const heap = [];
  const t0 = Date.now();
  while (Date.now() - t0 < SECS * 1000) { await wait(1000); heap.push(heapMB()); }
  clearInterval(pinger);
  kid.kill('SIGTERM');
  await new Promise(r => kid.on('exit', r));
  await wait(800);
  const atk = (() => { try { return JSON.parse(kidOut.trim().split('\n').pop()); } catch (e) { return {}; } })();
  const opened = atk.opened, closedBy = atk.closedBy;
  const end = heapMB();
  rtts.sort((a, b) => a - b);
  const p95 = rtts[Math.floor(rtts.length * 0.95)] || 0, maxHeap = Math.max(...heap);
  const opsPerMin = store.ops / (SECS / 60);
  console.log(`เวลา ${SECS} วิ · เปิดซ็อกเก็ต ${opened} · ถูกตัด ${JSON.stringify(closedBy)}`);
  console.log(`heap เริ่ม ${base.toFixed(1)} MB · สูงสุด ${maxHeap.toFixed(1)} MB (+${(maxHeap - base).toFixed(1)}) · จบ ${end.toFixed(1)} MB · ทุกวินาที: ${heap.map(h => h.toFixed(0)).join(' ')}`);
  console.log(`ws เกมเดิม: ส่ง ${sent} ได้คืน ${got} · p95 ${p95} ms · สูงสุด ${rtts[rtts.length - 1] || 0} ms`);
  console.log(`คำสั่งที่เก็บ ${store.ops} (${opsPerMin.toFixed(0)}/นาที · งบ 120/นาที) · ปฏิเสธเพราะงบ ${(v6.store.used || {}).refused}`);
  const fails = [];
  if (maxHeap - base > 80) fails.push('heap โตเกิน 80 MB');
  if (got < sent - 1) fails.push('ws เกมเดิมตอบไม่ครบ');
  if (p95 >= 250) fails.push('ws เกมเดิมช้า p95 ≥250 ms');
  if (store.ops > 120 * Math.ceil(SECS / 60) + 5) fails.push('คำสั่งที่เก็บเกินงบ');
  console.log(fails.length ? '❌ ไม่ผ่าน: ' + fails.join(' · ') : '✅ ผ่าน');
  v6.stop(); old.terminate(); for (const c of oldWss.clients) c.terminate(); oldWss.close(); server.closeAllConnections?.(); server.close();
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.log('❌ พัง', e && e.stack); process.exit(1); });

/* โปรเซสผู้โจมตี */
function runAttacker(port, token) {
  const WS = (m => { try { return require(m); } catch (e) { return require('/opt/npm-tools/node_modules/' + m); } })('ws');
  const URL6 = `ws://127.0.0.1:${port}/v6ws`;
  let stop = false, opened = 0, closedBy = {};
  const junk = 'x'.repeat(300 * 1024), bigSave = 'y'.repeat(250 * 1024);
  function attacker(ip, kind) {
    if (stop) return;
    const s = new WS.WebSocket(URL6, { headers: { 'x-forwarded-for': ip } });
    let tm = null, seq = 0;
    s.on('open', () => {
      opened++;
      if (kind === 'save') s.send(JSON.stringify({ t: 'hello', id: 'loadatk', token }));
      tm = setInterval(() => {
        if (s.readyState !== 1) return;
        for (let i = 0; i < 3; i++) {
          if (kind === 'junk') s.send(JSON.stringify({ t: 'hello', id: 'victim', token: 'a'.repeat(48), junk }));
          else if (kind === 'hello') s.send(JSON.stringify({ t: 'hello', id: 'victim', token: Math.random().toString(16).slice(2).padEnd(48, '0').slice(0, 48) }));
          else s.send(JSON.stringify({ t: 'save', sid: 'e'.repeat(32), seq: ++seq, systems: { a: { s: bigSave } } }));
        }
      }, 100); /* 30 ข้อความ/วิ */
    });
    s.on('close', (code, why) => { clearInterval(tm); const k = code + ':' + String(why); closedBy[k] = (closedBy[k] || 0) + 1; if (!stop) setTimeout(() => attacker(ip, kind), 50); });
    s.on('error', () => {});
  }

  const kinds = ['junk', 'hello', 'save', 'hello'];
  for (let i = 0; i < 20; i++) for (let j = 0; j < 4; j++) attacker('198.51.100.' + (i + 1), kinds[j]);
  process.on('SIGTERM', () => { stop = true; process.stdout.write(JSON.stringify({ opened, closedBy }) + '\n', () => process.exit(0)); });
}
