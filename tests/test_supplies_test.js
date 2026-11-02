/* ตรวจการรับของ/บันทึกผิดพลาด โดยไม่แก้ข้อมูลผู้เล่นจริง */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/186-test-supplies.js','utf8');let status='',saves=0,mode='ok',release;
const b={location:{search:'?testsupply=1',hostname:'127.0.0.1'},ITEMS:{sword:{name:'ดาบ',kind:'sword',tier:1},armor:{name:'เกราะ',kind:'chest',tier:1}},INVMETA:{wood:['ไม้','วัตถุดิบ'],coin:['เหรียญ','เงิน']},GEAR:{},ENH:{},inv:{wood:0,coin:0},MAXP:15,FM_ACCT:'tester',ONL32:{verified:true},ON10:{auth:true},netOk10:()=>true,CLOUD:{busy:false,reloading:false,tok:()=> 'test-token'},P:{hp:100,dead:false,x:0,y:0,armor:{}},D:{town:true,npcs:[{name:'คลังของทดสอบ',x:0,y:0}]},gid:()=>({set textContent(t){status=t}}),canTakeGear:id=>(b.GEAR[id]||0)<3?true:'weight',canTake:id=>b.inv[id]<3||id==='coin'?true:'slot',noRoom:()=>{},refreshInv:()=>{},recalcStats:()=>{},testSupplyRender:()=>{},safeSync123:async()=>{saves++;if(mode==='wait')return new Promise(r=>release=r);return mode==='ok'}};
b.window=b;vm.createContext(b);vm.runInContext(source.slice(0,source.indexOf('/* UI:'))+'\nwindow.TS=TEST_SUPPLY;',b);
(async()=>{
 assert.equal(b.testSupplyCatalog().length,4);b.ITEMS.late={name:'บอส190',kind:'helm',tier:21};assert.ok(b.testSupplyCatalog().some(x=>x.id==='late'),'late item definitions are included dynamically');
 for(const [key,q,e]of [['gear:missing',1,0],['gear:__proto__',1,0],['gear:sword',NaN,0],['gear:sword',-1,0],['gear:sword',100,0],['gear:sword',1,16],['gear:sword',1,.5]])assert.equal((await b.testSupplyGive(key,q,e)).ok,false);
 assert.equal(saves,0,'invalid requests do not save or mutate');assert.equal(Object.keys(b.GEAR).length,0);
 b.ONL32.verified=false;assert.equal((await b.testSupplyGive('gear:sword',1,0)).ok,false);b.ONL32.verified=true;b.P.x=100;assert.equal((await b.testSupplyGive('gear:sword',1,0)).ok,false);b.P.x=0;b.__qa154=1;assert.equal((await b.testSupplyGive('gear:sword',1,0)).ok,false);b.__qa154=0;
 let r=await b.testSupplyGive('gear:sword',5,14);assert.equal(r.n,3);assert.equal(r.reason,'weight');assert.equal(b.GEAR.sword,3);assert.equal(b.ENH.sword,14);assert.equal(saves,1);assert.match(status,/บันทึกขึ้นเซิร์ฟเวอร์แล้ว/);
 r=await b.testSupplyGive('gear:sword',1,15);assert.equal(r.n,0);assert.equal(b.ENH.sword,14,'failed grant does not change enhancement');assert.equal(saves,1);
 b.GEAR.sword=0;b.ENH.sword=15;await b.testSupplyGive('gear:sword',1,13);assert.equal(b.ENH.sword,15,'never downgrade existing enhancement');
 r=await b.testSupplyGive('mat:wood',5,0);assert.equal(r.n,3);assert.equal(b.inv.wood,3);assert.equal(r.reason,'slot');
 mode='fail';r=await b.testSupplyGive('gear:armor',1,13);assert.equal(r.synced,false);assert.equal(b.TS.pending,true);assert.equal(b.GEAR.armor,1,'sync failure preserves local grant for retry');assert.match(status,/ยังบันทึกขึ้นเซิร์ฟเวอร์ไม่สำเร็จ/);
 r=await b.testSupplyGive('gear:armor',1,13);assert.equal(r.reason,'pending');assert.equal(b.GEAR.armor,1,'pending save blocks further claims');mode='ok';await b.testSupplyRetry();assert.equal(b.TS.pending,false);
 mode='wait';const first=b.testSupplyGive('gear:armor',1,13);assert.equal((await b.testSupplyGive('gear:armor',1,13)).reason,'busy');release(true);await first;assert.equal(b.GEAR.armor,2,'rapid duplicate click is ignored');
 console.log('TEST SUPPLIES UNIT PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
