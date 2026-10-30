/* เทสหน่วยความจำ 1B-g N1 (ผลตรวจ 1B-f): 100 บัญชี × เซฟ 256 KB แบบ {"a":[[],[],…]} (อ็อบเจกต์บวม ~3.4 MB/ตัว)
   ผ่าน proto + saves จริง · ที่เก็บเป็นไฟล์ในโฟลเดอร์ชั่วคราว (ไม่ให้ที่เก็บในหน่วยความจำปนผลวัด)
   รันเองด้วย --expose-gc → พิมพ์ JSON { grow, cache, cacheBytes, saved } · เรียกจาก server.limits.test.js */
if (typeof global.gc !== 'function') {
  const r = require('child_process').spawnSync(process.execPath, ['--expose-gc', __filename, ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(r.status == null ? 1 : r.status);
}
const fs = require('fs'), os = require('os'), path = require('path');
const SRV = process.argv[2] || path.join(__dirname, '..', 'server');
const N = +process.argv[3] || 100;
const { fileStore } = require(path.join(SRV, 'store.cjs'));
const { createAccounts } = require(path.join(SRV, 'accounts.cjs'));
const { createSaves } = require(path.join(SRV, 'saves.cjs'));
const { createProto } = require(path.join(SRV, 'proto.cjs'));
const heap = () => { global.gc(); global.gc(); return process.memoryUsage().heapUsed; };

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'v6-heap-'));
  try {
    const c = { t: 1.8e12 }, now = () => c.t;
    const store = fileStore(dir);
    const accounts = createAccounts({ store, env: {}, now });
    const saves = createSaves({ store, now });
    const proto = createProto({ accounts, saves, now, authTimeoutMs: 0 });
    /* เซฟก้อนเกือบ 256 KB: [[],[],[],…] */
    const big = '{"t":"save","seq":1,"sid":"' + 'e'.repeat(32) + '","systems":{"a":[' + Array(Math.floor((256 * 1024 - 20) / 3)).fill('[]').join(',') + ']}}';
    let saved = 0;
    const base = heap();
    for (let i = 0; i < N; i++) {
      c.t += 4000;
      const k = { ip: '10.' + (i >> 8) + '.' + (i & 255) + '.9', out: [], send(o) { this.out.push(o); }, close() {} };
      proto.open(k);
      await proto.message(k, JSON.stringify({ t: 'register', id: 'heap' + i, pw: 'abc123' }));
      await proto.message(k, JSON.stringify({ t: 'load', sid: 'e'.repeat(32) }));
      await proto.message(k, big);
      if (k.out.some(o => o.t === 'save_ok')) saved++;
      k.out.length = 0;
      proto.closed(k);
    }
    const grow = (heap() - base) / 1048576;
    const st = saves._cacheStat;
    console.log(JSON.stringify({ grow: +grow.toFixed(1), cache: saves._cache.size, cacheBytes: st ? st.bytes : null, saved }));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
})().catch(e => { console.error(e); process.exit(1); });
