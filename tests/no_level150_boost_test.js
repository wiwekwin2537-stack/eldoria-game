/* v5.82: เปิดจริงแล้ว — บัญชีใหม่ถึง Lv.7 ต้องไม่ถูกเสกเป็น Lv.150 (เซิร์ฟเวอร์ห้ามตอบ b150:true) */
const assert=require('node:assert/strict'),os=require('node:os'),fs=require('node:fs'),path=require('node:path');
process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'eldb150-'));process.env.UPSTASH_REDIS_REST_URL='';process.env.UPSTASH_REDIS_REST_TOKEN='';delete process.env.B150_ENABLE;
const api=require('../accounts');
(async()=>{
 const id='newbieseven',pw='Test1234',r=await api.handle('/api/register',{id,pw,protocol:2},'ip-b150');assert.equal(r.ok,true);
 let tok=r.token,base=0,seq=0;
 for(const lv of [3,7,8,20]){
  const save=JSON.stringify({fm_name:'x',fm_save_v1:JSON.stringify({v:1,lv})});
  const s=await api.handle('/api/save',{id,token:tok,save,base,lv,protocol:2,seq:++seq,document:undefined},'ip-b150');
  assert.equal(s.ok,true,'save lv'+lv+' '+JSON.stringify(s));base=s.rev;
  assert.equal(!!s.b150,false,'เซิร์ฟเวอร์ห้ามเสก Lv.150 ที่ Lv.'+lv);
 }
 const l=await api.handle('/api/load',{id,token:tok,protocol:2},'ip-b150');assert.equal(!!l.b150,false,'load ต้องไม่ให้สิทธิ์เสก');
 const lg=await api.handle('/api/login',{id,pw,protocol:2},'ip-b150');assert.equal(!!lg.b150,false,'login ต้องไม่ให้สิทธิ์เสก');
 console.log('PASS no_level150_boost');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
