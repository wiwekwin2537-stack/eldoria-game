const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('js/063-fix32.js', 'utf8');
const match = source.match(/function cloudBootDecision32\([\s\S]*?\n\}/);
assert(match, 'cloud boot policy exists');
const decide = vm.runInNewContext(`(${match[0]})`);
const base = { hasRemote: true, same: false, localHash: 'local', lastHash: '' };

assert.equal(decide({ ...base, sr: 5, lr: 4 }), 'pull', 'newer server revision always wins');
assert.equal(decide({ ...base, sr: 4, lr: 4 }), 'pull', 'unknown local snapshot cannot overwrite equal-revision cloud data');
assert.equal(decide({ ...base, sr: 4, lr: 4, lastHash: 'old-hash' }), 'upload', 'known local changes can upload if cloud revision did not advance');
assert.equal(decide({ ...base, sr: 4, lr: 4, same: true, lastHash: 'old-hash' }), 'same', 'identical snapshots do not need a restore');
assert.equal(decide({ ...base, sr: 3, lr: 4, lastHash: 'old-hash' }), 'upload', 'confirmed local revision can recover a server behind it');
assert.equal(decide({ ...base, hasRemote: false, sr: 0, lr: 0 }), 'upload', 'legacy local-only account can seed an empty cloud save');
assert(source.includes("FM_RAW.set('cloud_hash_'+String(FM_ACCT).toLowerCase(),sha256hex8(save))"), 'successful cloud save records the local snapshot fingerprint');

const core = fs.readFileSync('js/031-core.js', 'utf8');
assert(core.includes('CLOUD.sync(true,true)'), 'vault save starts an immediate keepalive cloud sync');
assert(core.includes('แต่ยังซิงค์ไม่สำเร็จ'), 'vault reports a cloud failure instead of implying it synced');
console.log('ALL PASS');
