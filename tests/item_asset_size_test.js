/* The entire active artwork set must stay small, retain layout and stable item IDs. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process');
const source=fs.readFileSync('js/011-item-catalog.js','utf8'),box={window:{}};vm.runInNewContext(source,box);
const old={window:{}};vm.runInNewContext(cp.execFileSync('git',['show','f60399f226178ba919dc2eb92cdbdd13a5cbceb0:js/011-item-catalog.js'],{encoding:'utf8'}),old);
const current=box.window.ITEM_CATALOG;assert.equal(current.sheets.length,old.window.ITEM_CATALOG.sheets.length);
let total=0,original=0;const paths=new Set();
for(let i=0;i<current.sheets.length;i++){const s=current.sheets[i],was=old.window.ITEM_CATALOG.sheets[i];assert.deepEqual(JSON.parse(JSON.stringify(s.keys)),JSON.parse(JSON.stringify(was.keys)),'item identities and atlas ordering must not change');assert.equal(s.columns,was.columns);assert.equal(s.rows,was.rows);assert.match(s.src,/-v543(?:-\d+)?\.webp$/);assert.ok(!paths.has(s.src),'different atlases need distinct filenames');paths.add(s.src);const b=fs.readFileSync(s.src);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');total+=b.length;original+=fs.statSync(was.src).size;}
assert.ok(total<original*.3,'active item artwork must shrink by at least70%');console.log('ITEM ASSET SIZE PASS',JSON.stringify({files:paths.size,before:original,after:total,reduction:Math.round((1-total/original)*100)}));
