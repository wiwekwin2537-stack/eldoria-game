/* ตัดคำตอบหลัง commit ต้อง retry snapshot เดิมก่อนส่งความคืบหน้าใหม่ */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/063-fix32.js','utf8'),start=source.indexOf('function pendingSaveKey32()'),end=source.indexOf('setInterval(()=>{if(ONL32.verified',start);
assert.ok(start>=0&&end>start,'cloud uploads have a durable retry journal');
(async()=>{
 const raw=new Map(),requests=[];let local={fm_save_v1:'A'},server={save:'',rev:0},lose=true,kicks=0,failJournal=false;
 const box={FM_ACCT:'tester',P:{lv:200,cls:'paladin',name:'test'},ONL32:{verified:true,kick:()=>kicks++},SAVE_STATE:{localError:''},saveGame(){},saveKeys8:()=>local,srvNow:()=>123,sha256hex8:s=>'hash:'+s,
  FM_RAW:{get:k=>raw.get(k)||null,set:(k,v)=>{if(failJournal&&k.startsWith('cloud_pending_'))throw Error('quota');raw.set(k,v)},del:k=>raw.delete(k)},
  CLOUD:{fails:0,base:()=> 'server',tok:()=> 'token',revKey:()=> 'rev',call:async(p,b)=>{requests.push({...b});if(b.base!==server.rev){if(b.save===server.save)return {ok:true,rev:server.rev,upd:123};return {err:'conflict',rev:server.rev}}
    server={save:b.save,rev:server.rev+1};if(lose){lose=false;return {err:'offline'}}return {ok:true,rev:server.rev,upd:123}}}};
 box.window=box;vm.createContext(box);vm.runInContext(source.slice(start,end),box);
 assert.equal(await box.CLOUD.sync(true),false);assert.ok(raw.has('cloud_pending_tester'));assert.equal(server.rev,1);
 local={fm_save_v1:'B'};assert.equal(await box.CLOUD.sync(true),true);assert.equal(kicks,0);assert.equal(server.rev,2);assert.equal(server.save,JSON.stringify(local));assert.equal(requests[0].save,requests[1].save,'retry never replaces an ambiguous snapshot with new state');assert.equal(requests[2].base,1);assert.equal(raw.has('cloud_pending_tester'),false);
 box.SAVE_STATE.localError='quota';const count=requests.length;assert.equal(await box.CLOUD.sync(true),false);assert.equal(requests.length,count,'a failed local snapshot never uploads stale inventory');box.SAVE_STATE.localError='';
 failJournal=true;assert.equal(await box.CLOUD.sync(true),false);assert.equal(requests.length,count,'journal failure does not send an untraceable upload');
 console.log('CLOUD RETRY PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
