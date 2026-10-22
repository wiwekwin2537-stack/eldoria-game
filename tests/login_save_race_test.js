/* Login must retry a stale account CAS without losing concurrent progress or mail. */
const assert=require('node:assert/strict'),crypto=require('node:crypto');
process.env.UPSTASH_REDIS_REST_URL='https://redis.test';
process.env.UPSTASH_REDIS_REST_TOKEN='test';
const values=new Map(),lists=new Map();let conflicts=0,dropReply=false;
const reply=result=>({ok:true,status:200,json:async()=>({result})});
global.fetch=async(url,options={})=>{
 const u=new URL(url);await new Promise(resolve=>setImmediate(resolve));
 if(u.pathname.startsWith('/get/'))return reply(values.get(decodeURIComponent(u.pathname.slice(5)))??null);
 if(u.pathname.startsWith('/set/')){values.set(decodeURIComponent(u.pathname.slice(5)),String(options.body));return reply('OK')}
 const command=JSON.parse(options.body||'[]');
 if(command[0]==='EVAL'){
  const [,script,count,key,history,expected,next,snapshot]=command;
  assert.equal(count,2);assert.match(script,/redis.call\('GET', KEYS\[1\]\)/);
  if((values.get(key)||'')!==expected){conflicts++;return reply(0)}
  if(snapshot){const entries=lists.get(history)||[];entries.unshift(snapshot);lists.set(history,entries.slice(0,20))}
  values.set(key,next);if(dropReply){dropReply=false;throw Error('lost committed response')}
  return reply(1);
 }
 if(command[0]==='LRANGE')return reply((lists.get(command[1])||[]).slice(+command[2],+command[3]+1));
 throw Error('unexpected mock request '+url);
};
const originalScrypt=crypto.scrypt;let gate=null;
crypto.scrypt=function(...args){const current=gate;gate=null;const done=args.pop();return originalScrypt.call(this,...args,(...result)=>{
 if(!current)return done(...result);current.enter();current.release.then(()=>done(...result));
})};
function holdPasswordCheck(){let enter,release;const entered=new Promise(resolve=>{enter=resolve}),released=new Promise(resolve=>{release=resolve});gate={enter,release:released};return {entered,release}}
const api=require('../accounts');
const blob=coin=>JSON.stringify({fm_save_v1:JSON.stringify({v:1,lv:1,armor:{},inv:{coin},gear:{},enh:{}})});
(async()=>{
 const id='loginrace',pw='Test1234',registered=await api.handle('/api/register',{id,pw,protocol:2},'registration');
 assert.equal(registered.ok,true);
 const first={id,token:registered.token,protocol:2,base:0,seq:1,lv:1,save:blob(10)};
 assert.equal((await api.handle('/api/save',first,'device-a')).ok,true);
 const paused=holdPasswordCheck(),login=api.handle('/api/login',{id,pw,protocol:2},'device-b');
 await paused.entered;
 const progress={...first,base:1,seq:2,save:blob(25)};
 assert.equal((await api.handle('/api/save',progress,'device-a')).ok,true);
 const mail=await api.mailAdd(id,{kind:'gear',item:'chest21'});assert.ok(mail);
 paused.release();const signedIn=await login;
 assert.equal(signedIn.ok,true,'valid login retries its account CAS after progress changes during password hashing');
 assert.equal(signedIn.rev,2);assert.equal(signedIn.save,blob(25));
 assert.equal((await api.mailList(id)).length,1,'login preserves concurrent incoming mail');
 assert.equal((await api.handle('/api/save',{...progress,base:2,seq:3,save:blob(999)},'device-a')).err,'session-replaced');
 assert.equal(await api.verify(id,registered.token),null,'previous websocket writer is retired too');
 assert.equal((await api.handle('/api/load',{id,token:signedIn.token,protocol:2},'device-b')).save,blob(25));
 const secondPause=holdPasswordCheck(),secondLogin=api.handle('/api/login',{id,pw,protocol:2},'device-c');
 await secondPause.entered;
 assert.equal(await api.gemAdd(id,7,'concurrent login reward'),true);
 assert.ok(await api.mailAdd(id,{kind:'gear',item:'helm21'}));
 secondPause.release();const finalLogin=await secondLogin;
 assert.equal(finalLogin.ok,true,'metadata-only account changes also retry login');
 assert.equal(finalLogin.save,blob(25));assert.equal(finalLogin.rev,2);
 const current={id,token:finalLogin.token,protocol:2};
 const account=[...values.entries()].find(([key])=>key.startsWith('eld3:acct:'));
 assert.equal(JSON.parse(account[1]).gem,1007,'login preserves the concurrent reward without invoking daily-login rewards');
 assert.equal((await api.mailList(id)).length,2);
 assert.equal((await api.handle('/api/load',{id,token:signedIn.token,protocol:2},'device-b')).err,'session-replaced');
 const next={...current,base:2,seq:1,lv:1,save:blob(30)};dropReply=true;
 const saved=await api.handle('/api/save',next,'device-c');assert.equal(saved.ok,true,'lost response is confirmed from storage');
 const duplicate=await api.handle('/api/save',next,'device-c');assert.equal(duplicate.ok,true);assert.equal(duplicate.rev,saved.rev,'retry never creates a second revision');
 assert.equal((await api.mailList(id)).length,2);assert.equal((await api.handle('/api/load',current,'device-c')).save,blob(30));
 assert.ok(conflicts>=2,'both login races actually exercised stale-document CAS rejection');
 console.log('LOGIN SAVE RACE PASS: progress, mail, metadata, writer retirement, lost response, duplicate retry');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>{crypto.scrypt=originalScrypt});
