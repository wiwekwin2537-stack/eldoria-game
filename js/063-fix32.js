// fix32.js (v4.37) — ออนไลน์ 100%: ไม่มีโหมดออฟไลน์อีกต่อไป
//  · สมัคร/ล็อกอินผ่านเซิร์ฟเวอร์เท่านั้น (ไม่มีบัญชีในเครื่อง)
//  · เซฟบนเซิร์ฟเวอร์คือของจริง (ในเครื่องเป็นแค่แคช) — เข้าเกมทุกครั้งตรวจกับเซิร์ฟเวอร์ก่อน
//  · ต้องเชื่อมต่อเซิร์ฟเวอร์ตลอด — หลุดเมื่อไหร่ เกมหยุดและเชื่อมต่อใหม่ให้อัตโนมัติ
// =====================================================================
const ONL32={dev:/[?&]devtest=1/.test(location.search)&&(location.protocol==='file:'||/^(localhost|127\.)/.test(location.hostname)),
 downAt:0,shown:false,paused:false,verified:false,verifying:false};
// ---------- ที่อยู่เซิร์ฟเวอร์: ล็อกไว้ที่เซิร์ฟเวอร์หลักของเกม (ตั้งเองไม่ได้แล้ว) ----------
ONL32.url=(()=>{try{const q=new URLSearchParams(location.search).get('server');if(q&&/^(wss?|https?):\/\//.test(q))return q.replace(/^http/,'ws');const m=document.querySelector('meta[name="eldoria-server"]');return m&&m.content||''}catch(e){return ''}})();
if(ONL32.url){SET.server=ONL32.url;try{saveSet()}catch(e){}}
const onlErr32=r=>r&&r.err==='offline'?'🔌 เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — เช็คอินเทอร์เน็ตแล้วลองใหม่ (เซิร์ฟเวอร์อาจกำลังตื่น รอสักครู่)':(CLOUD_ERR[r&&r.err]||('เซิร์ฟเวอร์ตอบกลับผิดพลาด ('+(r&&r.err)+')'));
const CL_REG32=accRegister,CL_LOGIN32=accLogin; // (เวอร์ชันคลาวด์ — ใช้ตอน CLOUD.busy เพื่อสร้างแคชบัญชีในเครื่อง)
function sameCloudSave32(remote,local){try{const a=typeof remote==='string'?JSON.parse(remote):remote,b=typeof local==='string'?JSON.parse(local):local,ka=Object.keys(a||{}).sort(),kb=Object.keys(b||{}).sort();return ka.length===kb.length&&ka.every((k,i)=>k===kb[i]&&a[k]===b[k])}catch(e){return false}}
// Revisions establish server ordering, but equal revisions do not prove the
// local snapshot matches the server. Only upload a mismatch if this device has
// a known successful snapshot and its local data changed since that snapshot.
function cloudBootDecision32({sr,lr,hasRemote,same,localHash,lastHash}){
 if(!hasRemote)return 'upload';
 if(sr>lr)return 'pull';
 if(sr<lr)return 'upload';
 if(same)return 'same';
 return lastHash&&localHash!==lastHash?'upload':'pull';
}
window.cloudBootDecision32=cloudBootDecision32;
// สร้าง/อัปเดต "แคช" บัญชีในเครื่อง หลังเซิร์ฟเวอร์ยืนยันแล้ว แล้วเข้าเกม
ONL32.finish=async function(id,pw,rem,name){const A=ACC.all;let key=Object.keys(A).find(k=>k.toLowerCase()===id.toLowerCase());
 if(!key||!(await accVerify(key,pw))){ // ยังไม่มีแคชในเครื่อง / รหัสเปลี่ยนจากเครื่องอื่น → สร้างแคชใหม่ (เซฟเดิมยังอยู่)
  const k=key||id,s=rndHex(16),it=SEC.iter;A[k]=Object.assign({},A[k]||{},{s,it,h:await pbkdf2(pw,s,it),c:(A[k]&&A[k].c)||Date.now(),n:(name||k).slice(0,14)});ACC.save(A);
  if(!key)try{FM_RAW.set('u:'+k+':fm_name',(name||k).slice(0,14))}catch(e){}key=k}
 CLOUD.busy=true;try{return await CL_LOGIN32(key,pw,rem)}finally{CLOUD.busy=false}};
// ---------- สมัคร (ต้องผ่านเซิร์ฟเวอร์) ----------
accRegister=async function(id,pw,pw2,nm,mig){if(CLOUD.busy)return CL_REG32(id,pw,pw2,nm,mig);
 id=(id||'').trim();nm=(nm||'').trim().slice(0,14);
 if(!/^[A-Za-z0-9_ก-๙]{3,16}$/.test(id))return 'ไอดี 3–16 ตัว (ตัวอักษร ตัวเลข _ ภาษาไทยได้)';
 if(typeof pwStrong==='function'?!pwStrong(pw):(pw||'').length<6)return 'รหัสผ่านอย่างน้อย 6 ตัว มีทั้งตัวเลขและตัวอักษร';
 if(pw!==pw2)return 'รหัสผ่านไม่ตรงกัน';if(!nm)return 'ตั้งชื่อตัวละครก่อน';
 if(Object.keys(ACC.all).some(k=>k.toLowerCase()===id.toLowerCase()))return 'ไอดีนี้เคยใช้ในเครื่องนี้ — กด "เข้าสู่ระบบ" แทน (ระบบจะย้ายขึ้นเซิร์ฟเวอร์ให้)';
 cloudMsg('⏳ กำลังเชื่อมต่อเซิร์ฟเวอร์ (ครั้งแรกอาจใช้เวลาถึง 1 นาที)…');
 const r=await CLOUD.call('/api/register',{id,pw,name:nm},60000);if(!r.ok)return onlErr32(r);
 try{FM_RAW.set(CLOUD.tokKey(id),r.token);FM_RAW.set('cloud_rev_'+id.toLowerCase(),'0')}catch(e){}
 CLOUD.busy=true;try{return await CL_REG32(id,pw,pw,nm,mig)}finally{CLOUD.busy=false}};
// ---------- ล็อกอิน (ต้องผ่านเซิร์ฟเวอร์ · ใช้เซฟบนเซิร์ฟเวอร์เสมอ) ----------
accLogin=async function(id,pw,rem){if(CLOUD.busy)return CL_LOGIN32(id,pw,rem);
 id=(id||'').trim();if(!id||!pw)return 'กรอกไอดีและรหัสผ่าน';
 const A=ACC.all,key=Object.keys(A).find(k=>k.toLowerCase()===id.toLowerCase());
 cloudMsg('⏳ กำลังเชื่อมต่อเซิร์ฟเวอร์ (ครั้งแรกอาจใช้เวลาถึง 1 นาที)…');
 const r=await CLOUD.call('/api/login',{id,pw},60000);
 if(r.err==='locked')return '🔒 ใส่รหัสผิดหลายครั้ง ลองใหม่ใน '+r.wait+' วินาที';
 if(r.err==='badpw')return 'รหัสผ่านไม่ถูกต้อง';
 if(r.err==='nouser'){
  // บัญชีเก่าที่เคยเล่นแบบออฟไลน์ในเครื่องนี้ → ย้ายขึ้นเซิร์ฟเวอร์ (พร้อมเซฟ)
  if(!key||!(await accVerify(key,pw)))return 'ไม่พบไอดีนี้ — สมัครก่อนนะ';
  const rr=await CLOUD.call('/api/register',{id:key,pw,name:(FM_RAW.get('u:'+key+':fm_name')||A[key].n||key)},60000);
  if(!rr.ok)return rr.err==='badpw'?'รหัสผ่านเดิมสั้นเกินไปสำหรับเซิร์ฟเวอร์ — สมัครไอดีใหม่ (รหัส 6 ตัวขึ้นไป)':onlErr32(rr);
  try{FM_RAW.set(CLOUD.tokKey(key),rr.token);FM_RAW.set('cloud_rev_'+key.toLowerCase(),'0')}catch(e){}
  return ONL32.finish(key,pw,rem,A[key].n)}
 if(!r.ok)return onlErr32(r);
 const cid=key||r.id||id;
 // Keep the last revision known by this device. tPlay compares it with the server
 // and decides whether to download a newer cloud save or upload local unsynced data.
 try{FM_RAW.set(CLOUD.tokKey(cid),r.token)}catch(e){}
 return ONL32.finish(cid,pw,rem,r.name)};
// ---------- เปลี่ยนรหัส: เปลี่ยนบนเซิร์ฟเวอร์ก่อน ----------
accChangePw=async function(o,n,n2){if(!FM_ACCT)return 'ยังไม่ได้เข้าสู่ระบบ';if(typeof pwStrong==='function'&&!pwStrong(n))return 'รหัสใหม่อย่างน้อย 6 ตัว มีทั้งตัวเลขและตัวอักษร';if(n!==n2)return 'รหัสใหม่ไม่ตรงกัน';if(n===o)return 'รหัสใหม่ต้องไม่ซ้ำรหัสเดิม';
 const r=await CLOUD.call('/api/pw',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT),old:o,pw:n},30000);if(r.err==='badpw')return 'รหัสผ่านเดิมไม่ถูกต้อง';if(!r.ok)return onlErr32(r);
 try{FM_RAW.set(CLOUD.tokKey(FM_ACCT),r.token)}catch(e){}
 try{const A=ACC.all,a=A[FM_ACCT];if(a){a.s=rndHex(16);a.it=SEC.iter;a.h=await pbkdf2(n,a.s,a.it);a.pwAt=Date.now();ACC.save(A)}}catch(e){}return ''};
// ---------- ซิงค์เซฟ: เซิร์ฟเวอร์ชนะเสมอเมื่อชนกัน ----------
ONL32.pull=async function(msg){const l=await CLOUD.call('/api/load',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT)},40000);
 if(l.ok&&l.save){try{sessionStorage.setItem(CLOUD.pendKey,JSON.stringify({id:FM_ACCT,save:l.save}));sessionStorage.setItem('fm_go','1')}catch(e){}FM_RAW.set(CLOUD.revKey(),String(l.rev|0));if(msg)try{say(msg)}catch(e){}CLOUD.reloading=true;setTimeout(()=>location.reload(),700);return true}return l};
CLOUD.sync=async function(force,ka){if(!FM_ACCT){CLOUD.lastError='no-account';return false}if(CLOUD.busy||CLOUD.reloading){CLOUD.lastError='busy';return false}if(!CLOUD.base()){CLOUD.lastError='no-server';return false}if(!CLOUD.tok(FM_ACCT)){CLOUD.lastError='auth';return false}if(typeof P==='undefined'||!P||P.dead&&!force){CLOUD.lastError='player-state';return false}
 if(!ONL32.verified){CLOUD.lastError='unverified';return false} // ยังไม่ได้ตรวจกับเซิร์ฟเวอร์ — ห้ามเอาแคชเก่าทับ
 if(CLOUD.inflight){CLOUD.lastError='inflight';return false}CLOUD.inflight=true;
 try{try{saveGame()}catch(e){}
  const save=JSON.stringify(saveKeys8());if(!force&&save===CLOUD.last){CLOUD.fails=0;CLOUD.lastError='';return true}
  const body={id:FM_ACCT,token:CLOUD.tok(FM_ACCT),save,lv:P.lv|0,cls:P.cls||'',name:P.name||'',base:+FM_RAW.get(CLOUD.revKey())||0,ka:!!ka,stat:{floor:(window.__MAXFLOOR8|0),mine:0,kills:0}};
  const r=await CLOUD.call('/api/save',body,40000);
  if(r.ok){CLOUD.last=save;CLOUD.fails=0;CLOUD.lastError='';FM_RAW.set(CLOUD.revKey(),String(r.rev|0));FM_RAW.set('cloud_hash_'+String(FM_ACCT).toLowerCase(),sha256hex8(save));CLOUD.t=Date.now();return true}
  CLOUD.lastError=(r&&r.err)||'unknown';
  if(r.err==='conflict'){ONL32.kick('⚠️ บัญชีนี้ถูกเข้าเล่นจากอีกเครื่อง — เข้าสู่ระบบใหม่เพื่อโหลดข้อมูลล่าสุด')}
  else if(r.err==='auth'){try{FM_RAW.del(CLOUD.tokKey(FM_ACCT))}catch(e){}ONL32.kick('🔑 เซสชันหมดอายุ — เข้าสู่ระบบใหม่')}
  else CLOUD.fails++;
  return false
 }catch(e){CLOUD.fails++;CLOUD.lastError='network';return false}finally{CLOUD.inflight=false}};
setInterval(()=>{if(ONL32.verified&&!document.hidden)CLOUD.sync(false)},15000);
ONL32.kick=function(msg){ONL32.verified=false;try{sessionStorage.removeItem('fm_acct');FM_RAW.set('fm_remember','0')}catch(e){}
 try{sessionStorage.setItem('fm_kick32',msg||'')}catch(e){}CLOUD.reloading=true;location.reload()};
// ---------- หน้าเริ่มเกม ----------
{const _tm=tMain;tMain=function(){
  if(FM_ACCT&&!CLOUD.tok(FM_ACCT)&&!ONL32.dev){tLoginForm();setTimeout(()=>tErr('🌐 เกมนี้เป็นออนไลน์แล้ว — เข้าสู่ระบบอีกครั้งเพื่อผูกบัญชีกับเซิร์ฟเวอร์'),30);return}
  _tm();const pan=gid('tpan');if(!pan)return;
  for(const t of pan.querySelectorAll('.tip'))t.remove();
  pan.insertAdjacentHTML('beforeend','<div class="tip" id="srv32">🌐 เกมออนไลน์ · เซฟเก็บบนเซิร์ฟเวอร์ · <span>กำลังเช็คเซิร์ฟเวอร์…</span></div>');
  ONL32.ping()}}
ONL32.ping=async function(){const s=document.querySelector('#srv32 span');if(!s)return;const b=CLOUD.base();if(!b){s.textContent='🔴 ไม่พบเซิร์ฟเวอร์';return}
 try{const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),60000);const r=await (await fetch(b+'/api/ping',{signal:ac.signal})).json();clearTimeout(tm);s.textContent=r&&r.ok?'🟢 เซิร์ฟเวอร์พร้อม':'🔴 เซิร์ฟเวอร์มีปัญหา'}
 catch(e){const x=document.querySelector('#srv32 span');if(x)x.textContent='🔴 เชื่อมต่อไม่ได้ — เช็คอินเทอร์เน็ต'}};
{const _sh=showTitle;showTitle=function(){_sh();try{const k=sessionStorage.getItem('fm_kick32');if(k){sessionStorage.removeItem('fm_kick32');tLoginForm();setTimeout(()=>tErr(k),60)}}catch(e){}}}
// ---------- เข้าเกม: ตรวจบัญชี+เซฟกับเซิร์ฟเวอร์ก่อนเสมอ ----------
{const _tp=tPlay;tPlay=async function(){
  if(ONL32.dev||ONL32.verified)return _tp();
  if(!FM_ACCT||!CLOUD.tok(FM_ACCT)){showTitle();return}
  if(ONL32.verifying)return;ONL32.verifying=true;
  titleEl.hidden=false;PAUSED=true;requestAnimationFrame(titleDraw);
  const pan=gid('tpan');pan.innerHTML='<h3>🌐 กำลังเชื่อมต่อเซิร์ฟเวอร์…</h3><div class="tip">ตรวจสอบบัญชีและโหลดเซฟล่าสุด<br>(ถ้าเซิร์ฟเวอร์เพิ่งตื่นอาจใช้เวลาถึง 1 นาที)</div><div class="err"></div>';
  let l;try{l=await CLOUD.call('/api/load',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT)},60000)}finally{ONL32.verifying=false}
  if(l.err==='auth'||l.err==='badid'){try{FM_RAW.del(CLOUD.tokKey(FM_ACCT))}catch(e){}tLoginForm();setTimeout(()=>tErr('🔑 เซสชันหมดอายุ — เข้าสู่ระบบใหม่'),30);return}
  if(!l.ok){pan.innerHTML='<h3>🔌 เชื่อมต่อเซิร์ฟเวอร์ไม่ได้</h3><div class="tip">เกมนี้ต้องเล่นออนไลน์ — เช็คอินเทอร์เน็ตแล้วลองใหม่</div><button class="tb" id="tRetry32">🔄 ลองใหม่</button><button class="tb ghost" onclick="accLogout()">ออกจากระบบ</button>';gid('tRetry32').onclick=()=>tPlay();return}
  const lr=+FM_RAW.get(CLOUD.revKey())||0,sr=l.rev|0,local=saveKeys8(),localBlob=JSON.stringify(local),same=!!l.save&&sameCloudSave32(l.save,local),localHash=sha256hex8(localBlob),lastHash=FM_RAW.get('cloud_hash_'+String(FM_ACCT).toLowerCase())||'',decision=cloudBootDecision32({sr,lr,hasRemote:!!l.save,same,localHash,lastHash});
  if(decision==='pull'&&l.save&&!same){try{const rk='eldoria_cloud_recovery_'+String(FM_ACCT).toLowerCase();if(!FM_RAW.get(rk))FM_RAW.set(rk,localBlob)}catch(e){}
   sessionStorage.setItem(CLOUD.pendKey,JSON.stringify({id:FM_ACCT,save:l.save}));sessionStorage.setItem('fm_go','1');FM_RAW.set(CLOUD.revKey(),String(sr));CLOUD.reloading=true;pan.innerHTML='<h3>☁️ โหลดเซฟล่าสุดจากเซิร์ฟเวอร์…</h3>';location.reload();return}
  if(decision==='upload'&&sr<lr){/* Previously confirmed local revision is ahead; server CAS still decides whether it is accepted. */FM_RAW.set(CLOUD.revKey(),String(sr));try{say('☁️ พบเซฟในเครื่องที่ใหม่กว่าเซิร์ฟเวอร์ · กำลังกู้ขึ้นคลาวด์')}catch(e){}}
  else FM_RAW.set(CLOUD.revKey(),String(sr));
  ONL32.verified=true;CLOUD.last=same?localBlob:'';if(!NET.ws)netConnect();_tp();setTimeout(()=>CLOUD.sync(decision==='upload'&&!same),1500)}}
// ---------- ต้องออนไลน์ตลอด: หลุดแล้วหยุดเกม + ต่อใหม่ให้อัตโนมัติ ----------
{const st=document.createElement('style');st.textContent='#off32{position:fixed;inset:0;z-index:99999;background:rgba(6,8,20,.86);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;font:600 16px system-ui,"Noto Sans Thai",sans-serif;text-align:center;padding:20px}#off32[hidden]{display:none}#off32 .sp{width:46px;height:46px;border:5px solid rgba(255,255,255,.2);border-top-color:#ffd84a;border-radius:50%;animation:off32 1s linear infinite;margin-bottom:14px}@keyframes off32{to{transform:rotate(360deg)}}#off32 small{display:block;opacity:.75;margin-top:6px;font-weight:400}#off32 button{margin-top:14px;height:42px;padding:0 18px;font-size:15px;border-radius:10px;border:2px solid #e8c14a;background:#2a2340;color:#fff}';document.head.appendChild(st)}
{const o=document.createElement('div');o.id='off32';o.hidden=true;o.innerHTML='<div class="sp"></div><div id="off32t">🔌 การเชื่อมต่อหลุด</div><small id="off32s">กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่… (เกมหยุดชั่วคราว)</small><button onclick="saveGame(true);accLogout()">ออกจากระบบ</button>';document.body.appendChild(o)}
ONL32.tick=function(){if(ONL32.dev)return;const ingame=titleEl.hidden&&FM_ACCT&&ONL32.verified;
 if(!ingame){if(ONL32.shown)ONL32.show(false);return}
 const now=Date.now();if(!NET.on){if(!ONL32.downAt)ONL32.downAt=now;if(!NET.ws)try{netConnect()}catch(e){}}else ONL32.downAt=0;
 const wsBad=ONL32.downAt&&now-ONL32.downAt>6000,saveBad=CLOUD.fails>=3;
 if(saveBad&&!CLOUD.inflight&&now-(ONL32.lastTry||0)>5000){ONL32.lastTry=now;CLOUD.sync(true)}
 if(wsBad||saveBad){gid('off32t').textContent=saveBad&&!wsBad?'☁️ บันทึกขึ้นเซิร์ฟเวอร์ไม่ได้':'🔌 การเชื่อมต่อหลุด';ONL32.show(true)}else ONL32.show(false)};
ONL32.show=function(v){const o=gid('off32');if(!o)return;if(v){if(!ONL32.shown){ONL32.shown=true;o.hidden=false;if(!PAUSED){PAUSED=true;ONL32.paused=true}}else if(!PAUSED){PAUSED=true;ONL32.paused=true}}
 else if(ONL32.shown){ONL32.shown=false;o.hidden=true;if(ONL32.paused){ONL32.paused=false;if(menuEl.hidden)PAUSED=false}try{sysSay('🌐 เชื่อมต่อเซิร์ฟเวอร์กลับมาแล้ว')}catch(e){}}};
setInterval(ONL32.tick,1000);
// ---------- เอาตัวเลือก "ออฟไลน์/ตั้งเซิร์ฟเวอร์เอง" ออกจากเมนู ----------
try{const inp=gid('netUrl');if(inp){const sec=inp.closest('div');for(const id of ['netGo','netOff'])gid(id)&&gid(id).remove();inp.closest('label').remove()}
 const nb=gid('netb');if(nb)nb.onclick=()=>{try{sysSay(NET.on?'🌐 ออนไลน์ '+NET.n+' คน':'🔌 กำลังเชื่อมต่อเซิร์ฟเวอร์…')}catch(e){}}}catch(e){}
{const _ns=netStatus;netStatus=function(){_ns();const b=gid('netb');if(b)b.title=NET.on?'ออนไลน์ '+NET.n+' คน':'กำลังเชื่อมต่อ…';const s=gid('netst');if(s&&!NET.on)s.textContent=NET.ws?'🟡 กำลังเชื่อมต่อ…':'🔴 ไม่ได้เชื่อมต่อ — กำลังลองใหม่'}}
// เชื่อมต่อใหม่เร็วขึ้น (ไม่หน่วงนานแบบเดิม)
setInterval(()=>{if(!ONL32.dev&&FM_ACCT&&!NET.ws&&SET.server&&!document.hidden)try{netConnect()}catch(e){}},3000);
window.ONL32=ONL32;
// Preserve a local snapshot before replacing it with a newer cloud revision.
// The recovery entry is device-local and is excluded from saveKeys8().
window.restoreCloudRecovery32=function(){try{const id=FM_ACCT,rk='eldoria_cloud_recovery_'+String(id||'').toLowerCase(),raw=FM_RAW.get(rk);if(!id||!raw){say('ไม่มีเซฟสำรองในเครื่องนี้');return}
 const d=JSON.parse(raw);talk({name:'กู้เซฟสำรอง',c:'#c0503a'},'กู้เซฟก่อนโหลดคลาวด์กลับมาใช้หรือไม่? เซฟปัจจุบันบนคลาวด์จะถูกแทนที่หลังซิงค์',[{t:'🛟 กู้เซฟจากเครื่องนี้',c:'go',f:()=>{for(const k in d)if(/^fm_/.test(k)&&!/^fm_(set|accts|acct|last_acct|remember|chatfold|dev|lock|gmkey8)$/.test(k))localStorage.setItem(k,d[k]);CLOUD.last='';location.reload()}},BYE],'⚠️ ตรวจสอบก่อนกู้')
 }catch(e){say('กู้เซฟสำรองไม่สำเร็จ')}};
try{if(FM_ACCT&&FM_RAW.get('eldoria_cloud_recovery_'+String(FM_ACCT).toLowerCase())&&Array.isArray(PM7)&&!PM7.some(m=>m[1]==='กู้เซฟสำรอง')){PM7.push(['🛟','กู้เซฟสำรอง',()=>window.restoreCloudRecovery32()]);try{pmRender7()}catch(e){}}}catch(e){}
// กันสถานะค้าง: on=true แต่ซ็อกเก็ตถูกปิดไปแล้ว (ตอนต่อใหม่/รีโหลด)
{const _nt=netTick;netTick=function(dt){if(NET.on&&(!NET.ws||NET.ws.readyState!==1)){if(!NET.ws)NET.on=false;return}return _nt(dt)}}
try{const v=titleEl.querySelector('.ver');if(v)v.textContent='v4.37 · ออนไลน์'}catch(e){}

// =====================================================================
