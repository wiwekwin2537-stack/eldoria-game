/* ทดสอบทางแจก XP จริง โดยจำลองฉากและจับ callback หลังฆ่ามอน */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = file => fs.readFileSync(require.resolve('../' + file), 'utf8');
const core = read('js/031-core.js');
const party = read('js/064-fix33.js');
const rage = read('js/180-fix153.js');
const callbacks = [], received = [];
const context = vm.createContext({
  performance: { now: () => 0 },
  inRage93: () => true,
  inv: { coin: 0 }, P: { x: 0, y: 0 },
  NET: { others: new Map([['ally', { id: 'ally' }]]) }, PTY35: { mem: [{ id: 'self' }, { id: 'ally' }] },
  D: { zone: { Zd: {} } }, fx: [],
  mobXp: () => 1000, rndi: () => 3,
  sfx() {}, say() {}, dmgTxt() {}, addDrop() {}, refreshInv() {},
  setTimeout: fn => callbacks.push(fn),
  gainXp: xp => received.push(xp),
});
context.window = context;
vm.runInContext(core.slice(core.indexOf('function mobKill('), core.indexOf('function bossSkill(')), context);
vm.runInContext(party.slice(party.indexOf('function partyXp33('), party.indexOf('window.partyXp33=')), context);
vm.runInContext(rage.slice(rage.indexOf('try{\nconst T153'), rage.indexOf('/* ป้ายบอกโควตา')) + '}catch(e){throw e}', context);

context.mobKill({ L: 150, x: 0, y: 0, sc: 1 });
context.RN153.tok = 0;
context.mobKill({ L: 150, x: 0, y: 0, sc: 1 });
context.mobKill({ L: 165, x: 0, y: 0, sc: 1, boss: true });
context.gainXp(1000);
assert.deepEqual(received, [1000], 'XP เควสที่เท่ากับ XP มอนต้องได้เต็ม');
callbacks.reverse().forEach(fn => fn());
assert.deepEqual(received, [1000, 1350, 9, 90], 'รางวัลต้องผูกกับมอนที่ตาย แม้ callback สลับลำดับ');
context.RN153.ema = 0.5;
context.partyXp33({ L: 150, x: 0, y: 0 });
assert.equal(received.at(-1), 23, 'XP ปาร์ตี้ใช้ค่าเฉลี่ยโควตาเดิม');
context.inRage93 = () => false;
context.mobKill({ L: 150, x: 0, y: 0, sc: 1 });
callbacks.at(-1)();
context.partyXp33({ L: 150, x: 0, y: 0 });
assert.deepEqual(received.slice(-2), [1000, 500], 'นอกทุ่งสังหารใช้ XP เดิม');
console.log('Rage XP source checks passed');
