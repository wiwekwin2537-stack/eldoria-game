// An immediate cloud save must include the latest leaderboard stats in the
// persisted save blob as well as in the separate stat field.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('js/051-fix20.js', 'utf8');
const state = source.match(/^const ST20=.*$/m)?.[0];
const save = source.match(/^const st20Save=.*$/m)?.[0] || source.match(/^let st20T=.*$/m)?.[0];
const add = source.match(/^const st20Add=.*$/m)?.[0];
assert.ok(state && save && add);
const map = new Map();
const box = { localStorage: { getItem: k => map.get(k) || null, setItem: (k, v) => map.set(k, v) },
  clearTimeout, setTimeout, ttlCheck20() {} };
vm.createContext(box);
vm.runInContext(`${state}\n${save}\n${add}\nst20Add('kills');`, box);
assert.equal(JSON.parse(map.get('fm_stat20')).kills, 1,
  'the next saveKeys8 snapshot must include the kill before cloud sync');
console.log('ALL PASS');
