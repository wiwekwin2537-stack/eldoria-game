/* Server-first replaces the device revision/hash upload policy. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/063-fix32.js','utf8'),match=source.split('\n').find(x=>x.startsWith('function cloudBootDecision32'));assert.ok(match);const decide=vm.runInNewContext('('+match+')');
for(const args of [{sr:5,lr:4},{sr:4,lr:4,lastHash:'old',localHash:'changed'},{sr:3,lr:999}])assert.equal(decide({...args,hasRemote:true,same:false}),'pull');assert.equal(decide({hasRemote:true,same:true}),'same');assert.equal(decide({hasRemote:false}),'upload');
const core=fs.readFileSync('js/031-core.js','utf8');assert.ok(core.includes("if(window.FM_LOADING)addEventListener('eldoria:ready',startAccountGame"));assert.ok(core.includes('CLOUD.boot=function(){return false}'));console.log('CLOUD BOOT POLICY PASS: server-first, no import reload');

/* การนำเข้าเซฟที่เขียนได้ครึ่งเดียวต้องหยุดเล่นและคง pending ไว้ ไม่ซิงค์ทับคลาวด์ */
const apply=core.match(/CLOUD\.applyBlob=function\(blob\)\{[\s\S]*?return entries.length\};/);assert(apply);
{
 const local=new Map([['fm_save_v1','old'],['fm_x','oldx']]);let fail=true;
 const context={CLOUD:{},localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>{if(fail&&k==='fm_x'){fail=false;throw Error('quota')}local.set(k,v)},removeItem:k=>local.delete(k)}};
 vm.createContext(context);vm.runInContext(apply[0],context);
 assert.throws(()=>context.CLOUD.applyBlob(JSON.stringify({fm_save_v1:'{"v":1}',fm_x:'newx'})),/quota/);
 assert.equal(local.get('fm_save_v1'),'old');assert.equal(local.get('fm_x'),'oldx');
 assert.throws(()=>context.CLOUD.applyBlob('{"fm_save_v1":"null"}'),/invalid/);assert.equal(local.get('fm_save_v1'),'old');
 assert.equal(context.CLOUD.applyBlob(JSON.stringify({fm_save_v1:'{"v":1}',fm_x:'newx'})),2);
}
console.log('CLOUD IMPORT TRANSACTION PASS');
