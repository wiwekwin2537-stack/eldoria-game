/* ตารางอันดับต้องตอบได้เมื่อ storage ค้าง และยอดเงินต้องไม่ล้น int32 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('accounts.js', 'utf8');
async function stalledStore(mode = 'fetch') {
  const values = new Map([['eld3:lb', JSON.stringify({ old: { n: 'เพื่อน', lv: 10, k: 20 } })]]);
  const box = { require: name => name === 'fs' ? { mkdirSync() {} } : require(name), process: { env: { UPSTASH_REDIS_REST_URL: 'https://redis.test', UPSTASH_REDIS_REST_TOKEN: 'test' } },
    __dirname: '/tmp/eld-ranking-mock', module: { exports: {} }, console: { log() {} }, AbortController,
    setInterval: () => ({ unref() {} }), clearTimeout,
    setTimeout: (fn, ms) => setTimeout(fn, ms === 5000 ? 10 : ms),
    fetch: async (url, options) => {
      const key = url.split('/').pop();
      if (url === 'https://redis.test') {
        const [command,script,n,k,h,expected,next]=JSON.parse(options.body);
        assert.equal(command,'EVAL');assert.equal(n,2);
        if((values.get(k)||'')!==expected)return {ok:true,json:async()=>({result:0})};
        values.set(k,next);return {ok:true,json:async()=>({result:1})};
      }

      if (url.includes('/set/eld3:lb')) return mode === 'body' ? { ok: true, json: () => new Promise(() => {}) } : new Promise(() => {});
      if (url.includes('/set/')) { values.set(key, options.body); return { ok: true, json: async () => ({ result: 'OK' }) }; }
      return { ok: true, json: async () => ({ result: values.get(key) || null }) };
    } };
  vm.createContext(box); vm.runInContext(source, box);
  const api = box.module.exports;
  const reg = await api.handle('/api/register', { id: 'ranktest', pw: 'Test1234', name: 'เรา' }, 'test');
  const result = await Promise.race([api.handle('/api/save', { id: 'ranktest', token: reg.token, base: 0, save: '{}', lv: 10, stat: { kills: 25 } }, 'test'), new Promise(resolve => setTimeout(() => resolve({ hung: true }), 200))]);
  assert.equal(result.ok, true, 'rank write stall must not leave an already committed save unacknowledged');
  assert.equal(result.rankSaved, false);
  const top = await Promise.race([api.handle('/api/top', {}, 'test'), new Promise(resolve => setTimeout(() => resolve({ hung: true }), 200))]);
  assert.equal(top.ok, true, 'top must still return rows when rank storage is stalled');
  assert.equal(top.pending, true);
  assert.equal(top.k[0].v, 25);
  assert.equal(top.k[1].n, 'เพื่อน');
}
async function localReadRetry() {
  let reads = 0;
  const box = { require: name => name === 'fs' ? { mkdirSync() {}, existsSync: () => true, readFileSync: () => ++reads === 1 ? '{' : JSON.stringify({old:{n:'เดิม',lv:10,k:20}}) } : require(name),
    process: {env:{}}, __dirname:'/tmp/eld-ranking-mock', module:{exports:{}}, console:{log(){}},
    setInterval:()=>({unref(){}}), setTimeout, clearTimeout, AbortController };
  vm.createContext(box); vm.runInContext(source,box);
  assert.equal((await box.module.exports.handle('/api/top',{},'test')).err,'store');
  assert.equal((await box.module.exports.handle('/api/top',{},'test')).k[0].v,20,'local read failure must retry rather than cache a failed promise');
}
async function main() {
  const game = fs.readFileSync('js/051-fix20.js', 'utf8');
  const wealth = game.match(/^const wealth20=.*$/m)[0];
  const box = { inv: { coin: 2147483648 }, BANK19: { coin: 100 } };
  vm.createContext(box); vm.runInContext(wealth+';this.amount=wealth20()', box);
  assert.equal(box.amount, 2147483748, 'ranking wealth must retain positive values above int32');
  await stalledStore();
  await stalledStore('body');
  await localReadRetry();
  console.log('ALL PASS');
}
(process.argv.includes('--stall') ? stalledStore() : main()).catch(e => { console.error(e); process.exitCode = 1; });
