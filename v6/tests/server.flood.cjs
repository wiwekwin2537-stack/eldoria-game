/* เทสยิงเซฟก้อนใหญ่ตอนที่เก็บช้า (1Z · ผลตรวจ 1B-g M1) — รันในเครื่องเท่านั้น
   node v6/tests/server.flood.cjs [วินาที=8] [ซ็อกเก็ต=100] [ช้าต่ำสุด ms=1000] [ช้าสูงสุด ms=3000] [โฟลเดอร์ server]
   จำลองแบบผู้ตรวจ: proto + saves + accounts + budgetStore จริง · 100 บัญชีล็อกอิน/โหลดแล้ว (ก่อนเริ่มนับงบ)
   ที่เก็บช้า 1–3 วิ/คำสั่ง (Upstash ช้าชั่วคราว) · ทุกซ็อกเก็ตยิงเซฟ {"a":[[],[],…]} 256 KB 1 ก้อน/วิ (แปลงแล้ว ~3.5 MB/ก้อน)
   + ws เกมเดิม (echo) บน http.Server จริงในโปรเซสเดียวกัน ping ทุก 200 ms
   วัด heap (gc ก่อนวัด) ทุก 250 ms → พิมพ์ JSON { grow, p95, sent, got, saved, busy, left } บรรทัดสุดท้าย
   ผ่าน (server.limits.test.js): grow ≤ 50 MB · ws เกมเดิมตอบครบ p95 < 250 ms · คิวคืนโควตาครบ (left = 0) */
if (typeof global.gc !== 'function') {
  const r = require('child_process').spawnSync(process.execPath, ['--expose-gc', __filename, ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(r.status == null ? 1 : r.status);
}
const http = require('http'), path = require('path');
const SECS = +process.argv[2] || 8, N = +process.argv[3] || 100;
const SLOW_MIN = +process.argv[4] || 1000, SLOW_MAX = +process.argv[5] || 3000;
const SRV = process.argv[6] || path.join(__dirname, '..', 'server');
const req = m => { try { return require(m); } catch (e) { return require('/opt/npm-tools/node_modules/' + m); } };
const WS = req('ws');
const { memoryStore } = require(path.join(SRV, 'store.cjs'));
const { createAccounts } = require(path.join(SRV, 'accounts.cjs'));
const { createSaves } = require(path.join(SRV, 'saves.cjs'));
const { createProto } = require(path.join(SRV, 'proto.cjs'));
const { budgetStore } = require(path.join(SRV, 'limits.cjs'));
const wait = ms => new Promise(r => setTimeout(r, ms));
const heapMB = () => { global.gc(); global.gc(); return process.memoryUsage().heapUsed / 1048576; };

(async () => {
  /* ที่เก็บ: ตอนตั้งค่าไม่ช้า ไม่นับงบ · ตอนยิงช้า 1–3 วิ ผ่านงบจริง (120/นาที · 4000/วัน) */
  const mem = memoryStore();
  let slow = 0;
  const raw = { kind: 'memory' };
  for (const k of ['get', 'set', 'create']) raw[k] = async (a, b) => { if (slow) await wait(SLOW_MIN + Math.random() * (SLOW_MAX - SLOW_MIN)); return mem[k](a, b); };
  let cur = raw;
  const sw = { kind: 'memory', get: k => cur.get(k), set: (k, v) => cur.set(k, v), create: (k, v) => cur.create(k, v) };
  const accounts = createAccounts({ store: sw, env: {} });
  const saves = createSaves({ store: sw });
  const proto = createProto({ accounts, saves, authTimeoutMs: 0, log: () => {} });

  const conns = [];
  for (let i = 0; i < N; i++) {
    const k = { ip: '10.77.' + (i >> 8) + '.' + (i & 255), n: 0, busy: 0, saved: 0, r: [], send(o) { this.n++; if (o.t === 'save_ok') this.saved++; if (o.why === 'busy') { this.busy++; this.r.push(o.r); } }, close() {} };
    proto.open(k);
    await proto.message(k, JSON.stringify({ t: 'register', id: 'fl' + i, pw: 'abc123' }));
    await proto.message(k, JSON.stringify({ t: 'load', sid: 'e'.repeat(32) }));
    conns.push(k);
  }
  cur = budgetStore(raw, { now: () => Date.now() }); slow = 1;

  /* ws เกมเดิม */
  const server = http.createServer((q, s) => s.end('old'));
  const oldWss = new WS.WebSocketServer({ server, perMessageDeflate: false });
  oldWss.on('connection', s => s.on('message', m => s.send(String(m))));
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const old = new WS.WebSocket(`ws://127.0.0.1:${server.address().port}/`);
  await new Promise(r => old.on('open', r));
  const rtts = []; let sent = 0, got = 0; const pend = new Map();
  old.on('message', m => { const t = pend.get(String(m)); if (t) { pend.delete(String(m)); got++; rtts.push(Date.now() - t); } });

  const big = (seq, r) => '{"t":"save","seq":' + seq + ',"sid":"' + 'e'.repeat(32) + '","systems":{"a":[' + BODY + ']},"r":' + r + '}';
  const BODY = Array(Math.floor((256 * 1024 - 120) / 3)).fill('[]').join(',');
  const base = heapMB();
  const heap = [];
  const pinger = setInterval(() => { const k = 'p' + (++sent); pend.set(k, Date.now()); old.send(k); }, 200);
  const sampler = setInterval(() => heap.push(heapMB()), 250);
  let seq = 0, rid = 0, msgs = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < SECS * 1000) {
    seq++;
    for (const k of conns) { k.lastR = ++rid; proto.message(k, big(seq, rid)); msgs++; }
    await wait(1000);
  }
  /* รอคิวที่ค้างทำเสร็จ (ที่เก็บช้าสุด 3 วิ × คิว) */
  const t1 = Date.now();
  while (Date.now() - t1 < 30000 && conns.some(k => k.pending > 0)) await wait(200);
  await wait(300);
  clearInterval(pinger); clearInterval(sampler);
  await wait(300);
  rtts.sort((a, b) => a - b);
  const maxHeap = Math.max(...heap);
  const out = {
    grow: +(maxHeap - base).toFixed(1), p95: rtts[Math.floor(rtts.length * 0.95)] || 0, max: rtts[rtts.length - 1] || 0, sent, got,
    msgs, saved: conns.reduce((a, k) => a + k.saved, 0), busy: conns.reduce((a, k) => a + k.busy, 0),
    busyR: conns.every(k => k.r.every(r => typeof r === 'number')), answered: conns.every(k => k.n >= 3 + seq),
    left: proto._big ? proto._big.bytes : null, pending: conns.reduce((a, k) => a + k.pending, 0),
  };
  console.log(`heap เริ่ม ${base.toFixed(1)} MB · สูงสุด +${out.grow} MB · ws เกมเดิม ${got}/${sent} p95 ${out.p95} ms · เซฟสำเร็จ ${out.saved} · busy ${out.busy} / ${msgs}`);
  console.log(JSON.stringify(out));
  old.terminate(); for (const c of oldWss.clients) c.terminate(); oldWss.close(); server.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
