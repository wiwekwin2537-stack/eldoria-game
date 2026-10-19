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
assert(source.includes("FM_RAW.set('cloud_hash_'+String(FM_ACCT).toLowerCase(),sha256hex8(pending.save))"), 'successful cloud save records the local snapshot fingerprint');

const core = fs.readFileSync('js/031-core.js', 'utf8');
assert(core.includes('CLOUD.sync(true,true)'), 'vault save starts an immediate keepalive cloud sync');
assert(core.includes('แต่ยังซิงค์ไม่สำเร็จ'), 'vault reports a cloud failure instead of implying it synced');
console.log('ALL PASS');

/* เข้าเกมหลังโหลดสคริปต์ทั้งหมด และปุ่มไม่เก็บฟังก์ชันก่อนชั้นยืนยันเซฟ */
const startup=core.match(/function startAccountGame\(\)[^\n]*\nif\(document.readyState[^\n]*/);
assert(startup,'account startup waits for DOM ready');
for(const ready of ['loading','complete']){
 const events={},calls=[];const ctx={FM_ACCT:'tester',document:{readyState:ready,addEventListener:(name,fn,opts)=>{assert.equal(opts.once,true);events[name]=fn}},sessionStorage:{getItem:()=> '1'},intro:{hidden:false},showTitle:()=>calls.push('title'),tPlay:()=>calls.push('old')};
 vm.createContext(ctx);vm.runInContext(startup[0],ctx);
 if(ready==='loading'){assert.deepEqual(calls,[],'does not enter before later scripts load');ctx.tPlay=()=>calls.push('verified');events.DOMContentLoaded();assert.deepEqual(calls,['verified']);}
 else assert.deepEqual(calls,['old'],'already loaded DOM starts immediately');
}
const button={};const clickCtx={gid:()=>button,tPlay:()=> 'old'};vm.createContext(clickCtx);
const binding=core.match(/const pb=gid\('tPlay'\);if\(pb\)pb.onclick=\(\)=>tPlay\(\)/);assert(binding);vm.runInContext(binding[0],clickCtx);clickCtx.tPlay=()=> 'verified';assert.equal(button.onclick(),'verified','button resolves the latest cloud-verifying handler');
console.log('ACCOUNT STARTUP ORDER PASS');
/* เซฟคลาวด์ที่นำเข้าแล้วเป็น baseline ที่ยืนยันแล้ว แม้ startup เพิ่มค่าเริ่มต้น */
const importBoot=core.match(/CLOUD\.boot=function\(\)\{[\s\S]*?return false\};/);
assert(importBoot,'cloud import boot exists');
{
 const raw=new Map(),local=new Map(),session=new Map(),remote=JSON.stringify({fm_save_v1:'{"lv":200,"gear":{"chest21":1},"enh":{"chest21":14}}'});
 class FakeStorage{setItem(k,v){local.set(k,v)}}
 session.set('pending',JSON.stringify({id:'tester',save:remote}));
 const context={FM_ACCT:'tester',CLOUD:{pendKey:'pending',applyBlob:blob=>{for(const [k,v]of Object.entries(JSON.parse(blob)))local.set(k,v);return 1}},FM_RAW:{set:(k,v)=>raw.set(k,v)},sessionStorage:{getItem:k=>session.get(k),removeItem:k=>session.delete(k),setItem:(k,v)=>session.set(k,v)},Storage:FakeStorage,location:{reload:()=>{}},sha256hex8:s=>'hash:'+s,console};
 vm.createContext(context);vm.runInContext(importBoot[0],context);assert.equal(context.CLOUD.boot(),true);assert.equal(local.get('fm_save_v1'),JSON.parse(remote).fm_save_v1);
 assert.equal(raw.get('cloud_hash_tester'),'hash:'+remote,'successful import records the confirmed remote fingerprint');
 assert.equal(decide({...base,sr:5,lr:5,localHash:'normalized-after-import',lastHash:raw.get('cloud_hash_tester')}),'upload','normalized imported save can sync instead of reloading forever');
 assert.equal(decide({...base,sr:6,lr:5,localHash:'normalized-after-import',lastHash:raw.get('cloud_hash_tester')}),'pull','a newer server revision still wins');
}
console.log('CLOUD IMPORT BASELINE PASS');

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
