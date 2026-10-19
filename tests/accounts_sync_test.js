// Tests write confirmation, retry after transient storage failures, and leaderboard durability.
const assert = require('assert');

process.env.UPSTASH_REDIS_REST_URL = 'https://redis.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
const stored = new Map();
let failLbRead = 1, failAccountWrite = 0, failLbWrite = 1;
const reply = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
global.fetch = async (url, options = {}) => {
  const u = new URL(url), key = decodeURIComponent(u.pathname.replace(/^\/(get|set)\//, ''));
  if (u.pathname.startsWith('/get/')) {
    if (key === 'eld:lb' && failLbRead-- > 0) return reply(503, { error: 'temporary read failure' });
    return reply(200, { result: stored.get(key) ?? null });
  }
  if (u.pathname.startsWith('/set/')) {
    if (key.startsWith('eld:acct:') && failAccountWrite-- > 0) return reply(503, { error: 'temporary account write failure' });
    if (key === 'eld:lb' && failLbWrite-- > 0) return reply(503, { error: 'temporary leaderboard write failure' });
    stored.set(key, String(options.body));
    return reply(200, { result: 'OK' });
  }
  throw new Error('unexpected fake store request ' + u.pathname);
};

const oldRank = { n: 'ผู้เล่นเดิม', lv: 20, cls: '', fl: 0, rf: 0, rw: 0, k: 21, b: 0, w: 0, t: '', flag: 0, gm: 0, u: Date.now() };
stored.set('eld:lb', JSON.stringify({ old: oldRank }));
const freshAccounts = () => { const p = require.resolve('../accounts'); delete require.cache[p]; return require('../accounts'); };

(async () => {
  let accounts = freshAccounts();
  const firstTop = await accounts.handle('/api/top', {}, 'test-ip');
  assert.equal(firstTop.err, 'store', 'failed first leaderboard read is reported, not cached as an empty table');
  const secondTop = await accounts.handle('/api/top', {}, 'test-ip');
  assert.equal(secondTop.ok, true, 'leaderboard read retries after the transient failure');
  assert.equal(secondTop.k[0].n, 'ผู้เล่นเดิม', 'existing leaderboard entry remains visible');

  const reg = await accounts.handle('/api/register', { id: 'syncaudit', pw: 'pass1234', name: 'ทดสอบซิงค์' }, 'test-ip');
  assert.equal(reg.ok, true, 'account registration succeeds');
  failAccountWrite = 1;
  const saveBody = { id: 'syncaudit', token: reg.token, base: 0, save: JSON.stringify({ fm_save_v1: '{"lv":10}' }), lv: 10, name: 'ทดสอบซิงค์', stat: { kills: 34 } };
  const failedSave = await accounts.handle('/api/save', saveBody, 'test-ip');
  assert.equal(failedSave.err, 'store', 'failed account write is not acknowledged as saved');
  const saved = await accounts.handle('/api/save', saveBody, 'test-ip');
  assert.equal(saved.ok, true, 'same revision can retry successfully after a failed write');
  assert.equal(saved.rev, 1, 'failed write did not advance the cached revision');
  assert.equal(saved.rankSaved, false, 'leaderboard write failure is explicitly reported as pending');

  const retryTop = await accounts.handle('/api/top', {}, 'test-ip');
  assert.equal(retryTop.ok, true, 'leaderboard endpoint retries failed write');
  assert.equal(retryTop.pending, false, 'successful retry clears pending state');
  assert.deepEqual(retryTop.k.map(x => x.n).sort(), ['ผู้เล่นเดิม', 'ทดสอบซิงค์'].sort(), 'old and new player rankings are retained');

  accounts = freshAccounts();
  const afterRestart = await accounts.handle('/api/top', {}, 'test-ip');
  assert.equal(afterRestart.ok, true, 'leaderboard is readable after a server restart');
  assert.deepEqual(afterRestart.k.map(x => x.n).sort(), ['ผู้เล่นเดิม', 'ทดสอบซิงค์'].sort(), 'rankings survive server restart');
  const loaded = await accounts.handle('/api/load', { id: 'syncaudit', token: reg.token }, 'test-ip');
  assert.equal(loaded.save, saveBody.save, 'account save survives restart too');
  console.log('ALL PASS');
})().catch(e => { console.error(e); process.exitCode = 1; });
