/* ภาพใหม่ต้องไม่ทำให้ต้นไม้หายระหว่างโหลด และยังใช้ canvas เดิมตอนล้ม */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../js/013-core.js'), 'utf8');
const start = src.indexOf('const TREEART=');
assert.ok(start >= 0, 'ต้องมีตัวโหลดต้นไม้ที่มีภาพสำรอง');
const block = src.slice(start, src.indexOf('// ---- 2)', start));
function world() {
  const canvases = [];
  const box = { Image: class {}, hash: (x, y) => Math.abs(Math.sin(x + y)) % 1,
    document: { createElement() {
      const calls = [];
      const gradient = { addColorStop() {} };
      const context = new Proxy({ calls }, { get(o, key) {
        if (key in o) return o[key];
        if (/^create.*Gradient$/.test(key)) return () => gradient;
        return (...args) => calls.push([key, ...args]);
      } });
      const canvas = { getContext: () => context, calls };
      canvases.push(canvas); return canvas;
    } } };
  vm.createContext(box);
  vm.runInContext(block + ';this.art=TREEART;this.kinds=TREEKINDS;this.sprites=treeSpr;', box);
  return { box, canvases };
}
const w = world();
const originals = [...w.box.sprites];
assert.ok(originals.every(c => c.width === 80 && c.height === 100));
assert.ok(originals.every(c => c.calls.some(a => a[0] === 'fill')));
assert.ok(originals.every(c => !c.calls.some(a => a[0] === 'clearRect')));
const normal = w.box.makeTree(70, 104);
const magic = w.box.makeTree(51, 112);
const core = fs.readFileSync(path.join(__dirname, '../js/031-core.js'), 'utf8');
const propCode = core.slice(core.indexOf('const TOWNPROPS=[];'), core.indexOf('{const _bt=buildTown;', core.indexOf('const TOWNPROPS=[];')));
vm.runInContext('const T=32;' + propCode, w.box);
let townPaints = 0;
w.box.prop(() => { townPaints++; }, 200, 10, 20, 80, 92, true);
w.box.prop(() => { townPaints++; }, 200, 10, 20, 80, 92);
assert.equal(townPaints, 2);
let refreshed = 0;
w.box.art.pending.push(() => { refreshed++; });
w.box.art.image.naturalWidth = 1024;
w.box.art.image.naturalHeight = 1280;
w.box.art.image.onload();
assert.equal(w.box.art.ready, true);
assert.equal(refreshed, 1);
assert.equal(townPaints, 3, 'โหลดช้าแล้ววาดใหม่เฉพาะ snapshot ต้นไม้ในเมือง');
assert.equal(w.box.art.pending.length, 0);
assert.ok(originals.every((c, i) => c === w.box.sprites[i] && c.calls.some(a => a[0] === 'drawImage')));
assert.ok(normal.calls.some(a => a[0] === 'drawImage'));
assert.ok(!magic.calls.some(a => a[0] === 'drawImage'));
const helpers=fs.readFileSync(path.join(__dirname,'../js/048-fix17.js'),'utf8');
vm.runInContext(helpers.slice(helpers.indexOf('function makeDead16('),helpers.indexOf('const NAT16=')),w.box);
for(const [kind,seed,hue] of [['ancient',51,112],['fire',52,24],['spirit',53,288]]){
 const base=w.box.makeTree(seed,hue),derived=w.box.glowTree16(w.box.dark16(base,'rgba(0,0,0,.2)'),'white',3,seed);
 const before=derived.calls.length,art=w.box.kinds[kind];art.image.naturalWidth=768;art.image.naturalHeight=1024;art.image.onload();
 assert.ok(base.calls.some(a=>a[0]==='drawImage'&&a[1]===art.image));assert.ok(derived.calls.length>before,'ภาพห่อสองชั้นวาดใหม่เมื่อ PNG โหลดช้า');
 const f=world(),fallback=f.box.makeTree(seed,hue);f.box.kinds[kind].image.onerror();assert.equal(f.box.kinds[kind].pending.length,0);assert.ok(!fallback.calls.some(a=>a[0]==='clearRect'));
}
assert.ok(magic.calls.some(a=>a[0]==='drawImage'));
assert.ok(w.box.makeDead16(31).calls.some(a=>a[0]==='drawImage'&&a[1]===w.box.kinds.fire.image));
for(const [seed,hue] of [[61,46],[62,300],[71,48],[81,140]])assert.ok(w.box.makeTree(seed,hue).calls.some(a=>a[0]==='drawImage'));

assert.ok(w.box.makeTree(1, 105).calls.some(a => a[0] === 'drawImage'), 'สร้างหลังโหลดใช้รูปใหม่ทันที');
for (const invalid of [false, true]) {
  const f = world();
  if (invalid) f.box.art.image.onload(); else f.box.art.image.onerror();
  assert.equal(f.box.art.ready, false);
  assert.equal(f.box.art.pending.length, 0);
  assert.ok(f.box.sprites.every(c => !c.calls.some(a => a[0] === 'clearRect')));
  f.box.makeTree(70, 104);
  assert.equal(f.box.art.pending.length, 0, 'โหลดพลาดแล้วไม่สะสม callback');
}
const server = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
const sw = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');
assert.ok(server.includes("'/assets/trees/oak.png': ['assets/trees/oak.png','image/png']"));
assert.ok(sw.includes("'assets/trees/oak.png'"));
for(const kind of ['ancient','fire','spirit']){assert.ok(server.includes("'/assets/trees/"+kind+".png'"));assert.ok(sw.includes("'assets/trees/"+kind+".png'"));const b=fs.readFileSync(path.join(__dirname,'../assets/trees/'+kind+'.png'));assert.equal(b.subarray(1,4).toString(),'PNG')}
const png = fs.readFileSync(path.join(__dirname, '../assets/trees/oak.png'));
assert.equal(png.subarray(1, 4).toString(), 'PNG');
console.log('tree_sprite_test: PASS (โหลดช้า/โหลดแล้ว/โหลดพลาด/รูปเดิม/ธีม/เส้นทางภาพ)');
