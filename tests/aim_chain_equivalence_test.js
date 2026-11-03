'use strict';
/* Compare the current sole owner with unmodified source blocks captured from main.
 * No game/server/browser is started. VM dependencies are deliberately observable. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fixture = require('./fixtures/aim_chain_before.json');
const root = path.resolve(__dirname, '..');
assert.equal(fixture.commit, '1f3f836d5e85720cfff273f08252ba89c312f2c3');
/* Verify the fixture really belongs to the pinned commit, not a draft oracle. */
const fixtureBlocks = {
  'js/031-core.js': ['base'], 'js/036-fix5.js': ['mouse'],
  'js/064-fix33.js': ['filter', 'network'], 'js/198-click-move.js': ['desktop'],
};
for (const [file, blocks] of Object.entries(fixtureBlocks)) {
  const original = execFileSync('git', ['show', `${fixture.commit}:${file}`], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  assert.equal(createHash('sha256').update(original).digest('hex'), fixture.sourceSha256[file], `Fixture source hash: ${file}`);
  for (const key of blocks) assert(original.includes(fixture[key]), `Fixture ${key} is not exact pinned source`);
}
const currentSource = fs.readFileSync(path.join(root, 'js/031-core.js'), 'utf8');
const start = currentSource.indexOf('function aimDir(range){');
const end = currentSource.indexOf('// Segment/circle contact', start);
assert(start >= 0 && end > start, 'Cannot locate current aimDir owner');
const current = currentSource.slice(start, end);
assert.equal((currentSource.match(/function aimDir\(/g) || []).length, 1);
for (const file of ['036-fix5.js', '064-fix33.js', '198-click-move.js']) {
  const text = fs.readFileSync(path.join(root, 'js', file), 'utf8');
  assert(!/aimDir\s*=\s*function/.test(text), `${file} still wraps aimDir`);
}
const stages = ['base', 'mouse', 'network', 'desktop', 'touch'];
function environment(spec, before) {
  const input = JSON.parse(JSON.stringify(spec));
  const events = [];
  const stage = input.stage || 'desktop';
  const hasMouse = stage !== 'base';
  const hasNetwork = ['network', 'desktop', 'touch'].includes(stage);
  const hasClick = ['desktop', 'touch'].includes(stage);
  const c = {
    P: { x: 0, y: 0, dir: 'r', ...input.player },
    DIRV: { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] },
    performance: { now: () => 10000 },
    enemies() {
      events.push(['enemies', c.AIM33 === undefined ? null : c.AIM33]);
      if (input.throwEnemies) throw Error('enemies failed');
      return input.mobs || [];
    },
    LOS9(x, y, tx, ty) {
      events.push(['los', x, y, tx, ty, c.AIM33 === undefined ? null : c.AIM33]);
      if (input.throwLOS) throw Error('LOS failed');
      return !(input.blocked || []).some(p => p[0] === tx && p[1] === ty);
    },
    AUTO: { on: !!input.auto },
    A2_110: { goal: input.goal || null },
    SKILLAIM46: { cast: input.cast ? { dv: input.cast.slice() } : null },
  };
  c.window = c;
  if (Object.hasOwn(input, 'flag')) c.AIM33 = input.flag;
  if (hasMouse) c.MS9 = { x: 130, y: 70, t: -9e9, ...input.mouse };
  if (hasClick) c.CLICK594 = { on: stage === 'desktop', tgt: input.target || null };
  c.CM = c.CLICK594;
  c.alive = e => e && !e.dead && e.hp > 0;
  vm.createContext(c);
  if (before) {
    vm.runInContext(fixture.base, c);
    if (hasMouse) vm.runInContext(fixture.mouse, c);
    if (hasNetwork) {
      vm.runInContext(fixture.filter, c);
      vm.runInContext(fixture.network, c);
      c.W33 = {};
    }
    if (stage === 'desktop') vm.runInContext(fixture.desktop, c);
  } else {
    if (hasNetwork) { vm.runInContext(fixture.filter, c); c.W33 = {}; }
    vm.runInContext(current, c);
    assert.equal(c.aimDir, c.window.aimDir, 'Public alias differs from owner');
  }
  if (input.throwCast) c.SKILLAIM46.cast = { dv: { slice() { throw Error('cast failed'); } } };
  let result, error = null, copied = null;
  try {
    result = c.aimDir(input.range);
    if (c.SKILLAIM46.cast && !input.throwCast && stage !== 'base') {
      copied = result !== c.SKILLAIM46.cast.dv;
    }
  } catch (e) { error = `${e.name}: ${e.message}`; }
  return JSON.parse(JSON.stringify({
    result, error, copied, dir: c.P.dir,
    flag: c.AIM33 === undefined ? null : c.AIM33,
    mouse: c.MS9 || null, events,
  }));
}
let checks = 0;
function compare(name, spec, expected) {
  const old = environment(spec, true), actual = environment(spec, false);
  assert.deepEqual(actual, old, `${name}\ncase=${JSON.stringify(spec)}`);
  if (expected) expected(actual);
  checks++;
  return actual;
}
const mob = (x, y, extra = {}) => ({ x, y, hp: 10, dead: false, ...extra });
for (const stage of stages) {
  compare(`${stage}: no target`, { stage, range: 300 });
  compare(`${stage}: direction`, { stage, range: 300, player: { dir: 'u' }, mobs: [mob(2, -100)] });
  compare(`${stage}: cast`, { stage, range: 300, cast: [0, -1], target: mob(100, 0), auto: true, mouse: { t: 9999 } }, a => {
    if (stage !== 'base') { assert.deepEqual(a.result, [0, -1]); assert.equal(a.copied, true); }
  });
  compare(`${stage}: old mouse`, { stage, range: 300, mouse: { t: 5999 }, mobs: [mob(100, 0)] });
  compare(`${stage}: exact expiry`, { stage, range: 300, mouse: { t: 6000 }, mobs: [mob(100, 0)] });
  compare(`${stage}: active mouse`, { stage, range: 300, mouse: { t: 6001 }, mobs: [mob(130, 80)] });
  compare(`${stage}: PvP preference outside range`, { stage, range: 100, mobs: [mob(500, 0), mob(50, 0, { pvp7: 1 })] });
  compare(`${stage}: PvP only`, { stage, range: 300, mobs: [mob(50, 0, { pvp7: 1 })] });
  compare(`${stage}: wall/dead filtering`, { stage, range: 300, mobs: [mob(50, 0), mob(80, 0, { dead: true }), mob(110, 20)], blocked: [[50, -4]] });
  compare(`${stage}: throw enemies`, { stage, range: 300, auto: true, mouse: { t: 9999 }, flag: 7, throwEnemies: true });
  compare(`${stage}: throw LOS`, { stage, range: 300, auto: true, mouse: { t: 9999 }, flag: 7, mobs: [mob(50, 0)], throwLOS: true });
  if (stage !== 'base') compare(`${stage}: cast throws`, { stage, range: 300, auto: true, mouse: { t: 9999 }, flag: 7, throwCast: true });
}
compare('click outranks auto/mouse and bypasses LOS', { range: 100, target: mob(-60, 20), auto: true, goal: { k: 'mob', m: mob(80, 0) }, mouse: { t: 9999 }, throwLOS: true }, a => {
  assert.equal(a.error, null); assert.equal(a.dir, 'l'); assert.deepEqual(a.events, []);
});
compare('auto target outranks mouse', { range: 300, auto: true, goal: { k: 'mob', m: mob(-80, 0) }, mouse: { t: 9999 } }, a => assert.equal(a.dir, 'l'));
compare('auto suppresses then restores mouse on exception', { range: 300, auto: true, mouse: { t: 9999 }, throwEnemies: true }, a => {
  assert.equal(a.mouse.t, 9999); assert.equal(a.flag, 0); assert.equal(a.error, 'Error: enemies failed');
});
compare('touch auto retains mouse path', { stage: 'touch', range: 300, auto: true, mouse: { x: -100, y: -14, t: 9999 } }, a => assert.deepEqual(a.result, [-1, 0]));
for (const d of [0, 1, 1.0001, 359.999, 360, 360.001]) {
  compare(`clicked range boundary ${d}`, { range: 300, target: mob(d, -4), mouse: { t: 9999 } });
}
for (const range of [undefined, 0, 1, 40, 300]) {
  compare(`range argument ${range}`, { range, auto: true, target: mob(100, 0), mobs: [mob(50, 0)] });
}
for (const offset of [59.999, 60, 60.001]) {
  compare(`mouse snap boundary ${offset}`, { range: 300, mouse: { x: 150, y: -14, t: 9999 }, mobs: [mob(150, offset - 4)] });
}
for (const distance of [339.999, 340, 340.001]) {
  compare(`mouse range+40 boundary ${distance}`, { range: 300, mouse: { x: distance, y: -14, t: 9999 }, mobs: [mob(distance, 0)] });
}
for (const stage of ['network', 'desktop', 'touch']) {
  compare(`${stage}: PvP filtered when distant dead monster exists`, { stage, range: 100, mobs: [mob(900, 0, { dead: true }), mob(50, 0, { pvp7: 1 })] }, a => assert.deepEqual(a.result, [1, 0]));
  compare(`${stage}: cast exception clears flag without changing mouse`, { stage, range: 100, cast: [0, -1], throwCast: true, flag: 7, mouse: { t: 9999 } }, a => {
    assert.equal(a.flag, 0); assert.equal(a.mouse.t, 9999); assert.equal(a.error, 'Error: cast failed');
  });
}
compare('auto normal fallback restores mouse and clears flag', { range: 300, auto: true, mouse: { t: 9999 }, mobs: [mob(50, 0)] }, a => {
  assert.equal(a.mouse.t, 9999); assert.equal(a.flag, 0); assert.equal(a.error, null);
});
/* Fixed seed: preserve reproductions across machines and future refactors. */
let seed;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 0x100000000; };
const choose = xs => xs[Math.floor(random() * xs.length)];
for (const initialSeed of [0x59433, 71831]) {
seed = initialSeed;
for (let i = 0; i < 4000; i++) {
  const mobs = Array.from({ length: Math.floor(random() * 9) }, () => mob(Math.round(random() * 1000 - 500), Math.round(random() * 1000 - 500), { dead: random() < .15, pvp7: random() < .3 ? 1 : 0 }));
  const spec = {
    stage: choose(stages), range: choose([0, 1, 40, 100, 300, 520, 800]),
    player: { x: random() * 100 - 50, y: random() * 100 - 50, dir: choose(['l', 'r', 'u', 'd']) },
    mobs, target: random() < .5 ? choose(mobs.length ? mobs : [null]) : null,
    auto: random() < .5, goal: { k: choose(['mob', 'ore']), m: choose(mobs.length ? mobs : [null]) },
    cast: random() < .2 ? [Math.cos(i), Math.sin(i)] : null,
    mouse: { x: random() * 800 - 400, y: random() * 800 - 400, t: choose([-9e9, 5999, 6000, 6001, 9999]) },
    blocked: mobs.filter(() => random() < .25).map(m => [m.x, m.y - 4]),
    flag: choose([0, 7]), throwEnemies: random() < .015, throwLOS: random() < .015,
  };
  compare(`seed ${initialSeed} case ${i}`, spec);
}
}
console.log(`PASS aimDir: ${checks} differential cases; pinned main ${fixture.commit}; boot/desktop/touch, errors and state restoration`);
