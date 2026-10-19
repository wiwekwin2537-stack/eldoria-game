/* เซฟพร้อมกัน/คำตอบหาย/ประวัติกู้คืน/สองเซิร์ฟเวอร์ ต้องไม่เขียนทับบัญชีเก่า */
const assert=require('node:assert/strict'),crypto=require('node:crypto');
process.env.UPSTASH_REDIS_REST_URL='https://redis.test';process.env.UPSTASH_REDIS_REST_TOKEN='test';process.env.GM_ALLOW_REG='1';
const values=new Map(),lists=new Map();let failWrite=false,dropReply=false;
const reply=result=>({ok:true,status:200,json:async()=>({result})});
global.fetch=async(url,options={})=>{
 const u=new URL(url);await new Promise(r=>setImmediate(r));
 if(u.pathname.startsWith('/get/'))return reply(values.get(decodeURIComponent(u.pathname.slice(5)))??null);
 if(u.pathname.startsWith('/set/')){if(failWrite)throw Error('offline');values.set(decodeURIComponent(u.pathname.slice(5)),String(options.body));if(dropReply){dropReply=false;throw Error('reply lost')}return reply('OK')}
 const cmd=JSON.parse(options.body||'[]');
 if(cmd[0]==='EVAL'){
  if(failWrite)throw Error('offline');
  const [,script,n,key,hkey,expected,next,snapshot]=cmd;assert.equal(n,2);assert.match(script,/redis.call\('GET', KEYS\[1\]\)/);assert.match(script,/ARGV\[1\]/);
  if((values.get(key)||'')!==expected)return reply(0);
  if(snapshot){const l=lists.get(hkey)||[];l.unshift(snapshot);lists.set(hkey,l.slice(0,20))}
  values.set(key,next);if(dropReply){dropReply=false;throw Error('reply lost')}return reply(1);
 }
 if(cmd[0]==='LRANGE')return reply((lists.get(cmd[1])||[]).slice(+cmd[2],+cmd[3]+1));
 throw Error('unexpected command '+url);
};
function fresh(){delete require.cache[require.resolve('../accounts')];return require('../accounts')}
const blob=n=>JSON.stringify({fm_save_v1:JSON.stringify({v:1,lv:200,gear:{chest21:n},enh:{chest21:14}})});
(async()=>{
 const a=fresh(),b=fresh();const reg=await a.handle('/api/register',{id:'durable',pw:'Test1234'},'one');assert.equal(reg.ok,true);
 const body={id:'durable',token:reg.token,base:0,lv:200,save:blob(1)};
 const pair=await Promise.all([a.handle('/api/save',body,'one'),b.handle('/api/save',{...body,save:blob(2)},'two')]);
 assert.equal(pair.filter(r=>r.ok).length,1,'two processes cannot both commit different saves from revision 0');
 const loaded=await b.handle('/api/load',body,'two');assert.equal(loaded.rev,1);
 const retry=await a.handle('/api/save',{...body,save:loaded.save},'one');assert.equal(retry.ok,true,'lost acknowledgment can retry identical snapshot');assert.equal(retry.rev,1);
 const next={...body,base:1,save:blob(3)};dropReply=true;assert.equal((await a.handle('/api/save',next,'one')).ok,true,'read-after-timeout confirms an already committed snapshot');assert.equal((await b.handle('/api/save',next,'two')).ok,true,'committed but lost response is safely acknowledged on retry');
 const parallel=await Promise.all([a.mailAdd('durable',{kind:'gear',id:'chest21'}),b.handle('/api/save',{...body,base:2,save:blob(4)},'two')]);
 const mails=await a.mailList('durable');assert.equal(mails.length,1,'concurrent save must not erase incoming mail');
 const current=await a.handle('/api/load',body,'one');assert.ok(current.rev>=2);
 failWrite=true;const failed=await a.handle('/api/save',{...body,base:current.rev,save:blob(8)},'one');assert.equal(failed.err,'store');failWrite=false;
 assert.equal((await fresh().handle('/api/load',body,'restart')).save,current.save,'failed write/restart retains last confirmed save');
 const beforeMail=await a.mailList('durable');dropReply=true;assert.ok(await a.mailAdd('durable',{kind:'gear',id:'helm21'}));assert.equal((await a.mailList('durable')).length,beforeMail.length+1,'lost mailAdd reply does not duplicate reward');
 const id=(await a.mailList('durable')).at(-1).id;dropReply=true;assert.equal((await a.mailClaim('durable',[id])).length,1,'lost mailClaim database reply still returns committed delivery');
 const gemBefore=await a.handle('/api/gem',{...body,op:'bal'},'one');
 dropReply=true;assert.equal(await a.gemAdd('durable',10,'test'),true);assert.equal((await a.handle('/api/gem',{...body,op:'bal'},'one')).gem,gemBefore.gem+10,'lost reward receipt is not paid twice');
 const now=await a.handle('/api/load',body,'one');await Promise.all([a.gemAdd('durable',10,'parallel'),b.handle('/api/save',{...body,base:now.rev,save:blob(5)},'two')]);assert.equal((await a.handle('/api/gem',{...body,op:'bal'},'one')).gem,gemBefore.gem+20,'reward retries a concurrent autosave');
 const latest=await a.handle('/api/load',body,'one');current.rev=latest.rev;current.save=latest.save;
 assert.equal((await a.handle('/api/save',{...body,base:latest.rev,save:'not-json'},'one')).err,'invalid-save');
 assert.equal((await a.handle('/api/save',{...body,base:latest.rev,save:'{}'},'one')).err,'invalid-save','empty snapshot cannot replace real player data');
 const gm=await a.handle('/api/register',{id:'tiksi',pw:'Test1234'},'gm');assert.equal(gm.ok,true);
 const auth={id:'tiksi',token:gm.token,to:'durable'};
 const history=await a.handle('/api/save-history',auth,'gm');assert.equal(history.ok,true);assert.ok(history.entries.length>=1,'old save revisions have recoverable snapshots');
 assert.equal((await a.handle('/api/save-history',{...body,to:'durable'},'one')).err,'perm','players cannot roll back items and duplicate them');
 const old=history.entries.at(-1);const preview=await a.handle('/api/save-history',{...auth,op:'get',rev:old.rev},'gm');assert.equal(preview.ok,true);assert.equal(preview.hash,crypto.createHash('sha256').update(preview.save).digest('hex'));
 assert.equal((await a.handle('/api/save-history',{...auth,op:'restore',rev:old.rev,base:-1},'gm')).err,'conflict','recovery cannot overwrite unseen new progress');
 const restored=await a.handle('/api/save-history',{...auth,op:'restore',rev:old.rev,base:current.rev},'gm');assert.equal(restored.ok,true);
 const final=await fresh().handle('/api/load',body,'restart');assert.equal(final.save,preview.save);assert.equal(final.rev,current.rev+1,'recovery creates a new revision');assert.equal((await a.mailList('durable')).length,1,'restore changes save only, preserving mail');
 console.log('SAVE RESILIENCE PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
