// Exercise the actual HTTP middleware: JSON quoting can make the request
// larger than the unescaped save while it remains within the save limit.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eldoria-http-save-'));
process.env.DATA_DIR = dir;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
const accounts = require('../accounts');
const server = http.createServer((req, res) => accounts.middleware(req, res, () => true));

async function post(port, endpoint, data) {
  const response = await fetch(`http://127.0.0.1:${port}${endpoint}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data)
  });
  return response.json();
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const register = await post(port, '/api/register', { id: 'httpaudit', pw: 'pass1234', name: 'นักทดสอบ' });
  assert.equal(register.ok, true);
  // About 1 MB decoded, but the outer JSON must escape thousands of quotes.
  const save = JSON.stringify({ fm_save_v1: JSON.stringify({v:1,lv:8,gear:{chest21:1},armor:{},enh:{chest21:14},inv:{coin:100}}), fm_padding: 'a"'.repeat(330000) });
  assert.ok(save.length < 1200 * 1024);
  assert.ok(JSON.stringify({ save }).length > 1200 * 1024 + 4096);
  const body = { id: 'httpaudit', token: register.token, base: 0, save, lv: 8,
    name: 'นักทดสอบ', stat: { kills: 34, boss: 2, w: 100 } };
  const saved = await post(port, '/api/save', body);
  assert.equal(saved.ok, true, 'valid save is acknowledged over HTTP');
  assert.equal(saved.rankSaved, true);
  const loaded = await post(port, '/api/load', { id: 'httpaudit', token: register.token });
  assert.equal(loaded.save, save, 'the full inventory/save survives a request');
  const top = await post(port, '/api/top', {});
  assert.equal(top.k.find(x => x.n === 'นักทดสอบ')?.v, 34, 'rank reflects the saved stats');
  const rejected = await post(port, '/api/save', { ...body, base: saved.rev, save: 'x'.repeat(1200 * 1024 + 1) });
  assert.equal(rejected.err, 'size', 'oversized decoded saves get an explicit error');
  const file = require.resolve('../accounts');
  delete require.cache[file];
  const afterRestart = require('../accounts');
  const recovered = await afterRestart.handle('/api/load', { id: 'httpaudit', token: register.token }, 'restart-ip');
  assert.equal(recovered.save, save, 'a rejected upload does not erase inventory after restart');
  assert.equal((await afterRestart.handle('/api/top', {}, 'restart-ip')).k[0].v, 34,
    'leaderboard survives restart');
  console.log('ALL PASS');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(dir, { recursive: true, force: true });
});
