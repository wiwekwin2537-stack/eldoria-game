/* Exercise the enhancement transaction and repair against the actual game functions. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=fs.readFileSync(require.resolve('../js/031-core.js'),'utf8');
const repair=fs.readFileSync(require.resolve('../js/100-fix68.js'),'utf8');
function extract(source,start,end){
  const a=source.indexOf(start),b=source.indexOf(end,a+1);
  assert(a>=0&&b>a);
  return source.slice(a,b);
}
const saves=[];
const box=vm.createContext({
  ITEMS:{bow1:{kind:'bow',name:'bow'}}, ENH:{bow1:6,c68_bow1:2},
  ENHS:{sel:'bow1',busy:false}, P:{armor:{sword:'bow1'}},GEAR:{},
  inv:{coin:100000,estone:100,ingot:3,bless:1},enhW:{},
  Math:{random:()=>.99,ceil:Math.ceil}, ENHCFG:{rate:()=>50},
  enhCheck7:()=>null,enhLv7:id=>box.ENH[id],enhStat7:(id,level)=>level,
  enhMats7:()=>[{k:'coin',n:100},{k:'estone',n:2},{k:'ingot',n:1}],
  recalcStats(){},refreshInv(){},forgeStart7(){},sfx(){},banner(){},sysSay(){},
  unequip(slot){const id=box.P.armor[slot];box.P.armor[slot]=null;box.GEAR[id]=1},
  saveGame(){saves.push(JSON.parse(JSON.stringify({inv:box.inv,enh:box.ENH,armor:box.P.armor,gear:box.GEAR})))},
});
box.window=box;
vm.runInContext(extract(repair,'const BRK68=','/* ใช้ผลตีบวก').split('// ตีบวกไม่ได้ถ้าพัง')[0],box);
vm.runInContext(extract(repair,'window.recordEnhancementFailure=','// แจ้งผลหลังตีเสร็จ'),box);
vm.runInContext(extract(core,'function enhStart7()','window.enhStart7='),box);
vm.runInContext(extract(repair,'function repair68(','window.repair68='),box);
box.enhStart7();
assert.equal(saves.length,1);
assert.equal(saves[0].inv.ingot,2);
assert.equal(saves[0].inv.bless,0);
assert.equal(saves[0].enh.c68_bow1,2);
assert.equal(saves[0].enh.bow1,6);
assert.equal(saves[0].armor.sword,'bow1');
box.enhStart7();
assert.equal(saves.length,1,'second click while busy must not spend items');
box.ENHS.busy=false;
box.enhStart7();
assert.equal(saves.length,2);
assert.equal(saves[1].inv.ingot,1);
assert.equal(saves[1].enh.bow1,0);
assert.equal(saves[1].enh.b68_bow1,5);
assert.equal(saves[1].armor.sword,null);
assert.equal(saves[1].gear.bow1,1);
assert.equal(box.repair68('bow1'),true);
assert.equal(saves[2].enh.bow1,5);
assert.equal(saves[2].enh.c68_bow1,undefined);
console.log('Enhancement and repair save checks passed');
