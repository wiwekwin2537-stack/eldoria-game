const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/031-core.js','utf8'),registry=fs.readFileSync('js/011-item-art.js','utf8');
const helper=source.match(/function itemDropIcon\(type\)\{[^}]*\}/);assert.ok(helper,'diamond loot must use the inventory artwork selector');
const canvas={},fallback={},box={ITEMART:{key:k=>['gem','diamond'].includes(k)?'ore':k,icon:k=>k==='ore'?canvas:null},matIcon:k=>fallback,OREKEYS:['stone','iron','copper','silver','gold'],OSPR:{stone:fallback}};vm.createContext(box);vm.runInContext(helper[0],box);
for(const key of ['gem','ore','diamond'])assert.equal(box.itemDropIcon(key),canvas,'all diamond visual aliases select one icon');assert.equal(box.itemDropIcon('stone'),fallback);
box.ITEMART.icon=()=>null;assert.equal(box.itemDropIcon('gem'),fallback,'failed atlas uses the same legacy icon as the bag');assert.equal(box.itemDropIcon('unknown'),null);
assert.ok(source.includes('const art=itemDropIcon(t)'));assert.ok(source.includes("ITEMART.url(key.startsWith('mat:')?key.slice(4):key)"));assert.ok(registry.includes('ITEM_CATALOG.sheets'));console.log('ITEM ART ALIASES AND FALLBACK PASS');
