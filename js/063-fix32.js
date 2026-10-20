/* v5.46: one server snapshot, one active writer, no device save or import reload. */
const ONL32={dev:/[?&]devtest=1/.test(location.search)&&/^(localhost|127\.)/.test(location.hostname),downAt:0,shown:false,paused:false,verified:false,verifying:false};
ONL32.url=SERVER_BOOT.base().replace(/^http/,'ws');if(ONL32.url){SET.server=ONL32.url;try{saveSet()}catch(e){}}
const onlErr32=r=>r&&r.err==='offline'?'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่':(CLOUD_ERR[r&&r.err]||'เซิร์ฟเวอร์ยังไม่พร้อม กรุณาลองใหม่');
function sameCloudSave32(a,b){try{return JSON.stringify(JSON.parse(a))===JSON.stringify(JSON.parse(b))}catch(e){return false}}
function cloudBootDecision32({hasRemote,same}){return hasRemote?(same?'same':'pull'):'upload'}
window.cloudBootDecision32=cloudBootDecision32;
ONL32.finish=async function(id,token,rem){FM_RAW.set(CLOUD.tokKey(id),token);sessionStorage.setItem('fm_acct',id);sessionStorage.setItem('fm_go','1');FM_RAW.set('fm_last_acct',id);FM_RAW.set('fm_remember',rem?'1':'0');location.reload();return ''};
accRegister=async function(id,pw,pw2,nm){id=(id||'').trim();if(pw!==pw2)return 'รหัสผ่านไม่ตรงกัน';const look=typeof CC41!=='undefined'&&CC41.L||null;const r=await CLOUD.call('/api/register',{id,pw,name:nm,look,protocol:2},60000);if(!r.ok)return onlErr32(r);return ONL32.finish(id,r.token,true)};
accLogin=async function(id,pw,rem){if(FM_ACCT&&ONL32.verified&&!await safeSync123())return 'ยังบันทึกข้อมูลเดิมไม่สำเร็จ กรุณาลองใหม่ก่อนสลับบัญชี';id=(id||'').trim();if(!id||!pw)return 'กรอกไอดีและรหัสผ่าน';cloudMsg('กำลังตรวจบัญชีและโหลดตัวละคร…');const r=await CLOUD.call('/api/login',{id,pw,protocol:2},60000);if(r.err==='badpw')return 'รหัสผ่านไม่ถูกต้อง';if(r.err==='nouser')return 'ไม่พบบัญชีนี้บนเซิร์ฟเวอร์';if(r.err==='locked')return 'ลองเข้าสู่ระบบอีกครั้งใน '+r.wait+' วินาที';if(!r.ok)return onlErr32(r);return ONL32.finish(r.id||id,r.token,rem)};
accChangePw=async function(o,n,n2){if(ONL32.verified&&!await safeSync123())return 'ยังบันทึกไม่สำเร็จ กรุณาลองใหม่ก่อนเปลี่ยนรหัส';if(n!==n2)return 'รหัสผ่านใหม่ไม่ตรงกัน';if(typeof pwStrong==='function'&&!pwStrong(n))return 'รหัสผ่านอย่างน้อย6ตัว มีตัวเลขและตัวอักษร';const r=await CLOUD.call('/api/pw',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT),old:o,pw:n},30000);if(!r.ok)return onlErr32(r);FM_RAW.set(CLOUD.tokKey(FM_ACCT),r.token);ONL32.kick('เปลี่ยนรหัสแล้ว กรุณาเข้าสู่ระบบใหม่');return ''};
CLOUD.rev=SERVER_BOOT.rev;CLOUD.seq=SERVER_BOOT.seq;CLOUD.pending=null;CLOUD.inflight=false;CLOUD.capturing=false;
function pendingSaveKey32(){return 'cloud_pending_'+String(FM_ACCT||'').toLowerCase()}
function readPendingSave32(){return CLOUD.pending}
CLOUD.capture=function(){CLOUD.capturing=true;try{saveGame(true);if(SAVE_STATE.localError)throw Error('snapshot');const data=saveKeys8();if(data.fm_save_v1){const main=JSON.parse(data.fm_save_v1);main.t=0;data.fm_save_v1=JSON.stringify(main)}const save=JSON.stringify(data);if(CLOUD.pending&&CLOUD.pending.save===save)return CLOUD.pending;if(save===CLOUD.last&&!CLOUD.pending)return null;return CLOUD.pending={save,lv:P.lv|0,cls:P.cls||'',name:P.name||'',base:CLOUD.rev,seq:++CLOUD.seq,document:SERVER_BOOT.document,protocol:2,stat:{floor:window.__MAXFLOOR8|0,mine:0,kills:0}}}finally{CLOUD.capturing=false}};
CLOUD.send=async function(p,ka){const body={...p,id:FM_ACCT,token:CLOUD.tok(FM_ACCT),ka:!!ka};const r=await CLOUD.call('/api/save',body,40000);if(r.ok){CLOUD.rev=Math.max(CLOUD.rev,r.rev||0);FM_RAW.set(CLOUD.revKey(),String(CLOUD.rev));CLOUD.fails=0;CLOUD.lastError='';CLOUD.t=srvNow();if(CLOUD.pending&&CLOUD.pending.seq<=p.seq){CLOUD.last=p.save;CLOUD.pending=null}return true}CLOUD.lastError=r.err||'network';if(['auth','session-replaced','conflict','sequence','protocol'].includes(r.err))ONL32.kick(r.err==='session-replaced'?'บัญชีนี้เปิดเล่นในแท็บ หน้าต่าง หรืออุปกรณ์อื่นแล้ว หน้านี้หยุดบันทึก กรุณาล็อกอินใหม่เพื่อเล่นที่นี่':'ข้อมูลบัญชีเปลี่ยน กรุณาเข้าสู่ระบบใหม่');else CLOUD.fails++;return false};
CLOUD.sync=function(force,ka){if(!FM_ACCT){CLOUD.lastError='no-account';return Promise.resolve(false)}if(!ONL32.verified){CLOUD.lastError='unverified';return Promise.resolve(false)}if(CLOUD.reloading||window.__qa154){CLOUD.lastError='busy';return Promise.resolve(false)}let p;try{p=CLOUD.capture()}catch(e){CLOUD.lastError='snapshot';CLOUD.fails++;return Promise.resolve(false)}if(!p)return CLOUD.task||Promise.resolve(true);
 if(ka){if(CLOUD.exitTask&&CLOUD.exitSeq===p.seq)return CLOUD.exitTask||CLOUD.task||Promise.resolve(false);CLOUD.exitSeq=p.seq;return CLOUD.exitTask=CLOUD.send(p,true).finally(()=>{CLOUD.exitTask=null})}
 if(CLOUD.task)return CLOUD.task;CLOUD.inflight=true;CLOUD.task=(async()=>{for(let i=0;i<8&&CLOUD.pending&&ONL32.verified;i++){const next=CLOUD.pending;if(!await CLOUD.send(next,false))return false}return !CLOUD.pending})().finally(()=>{CLOUD.inflight=false;CLOUD.task=null});return CLOUD.task};
setInterval(()=>{if(ONL32.verified&&!document.hidden)CLOUD.sync(false)},3000);
ONL32.kick=function(msg){ONL32.verified=false;CLOUD.pending=null;PAUSED=true;CLOUD.lastError='session-replaced';if(typeof window.cancelPlay81==='function')cancelPlay81();else window.__play81=0;if(NET.ws){NET.ws.onclose=null;try{NET.ws.close()}catch(e){}NET.ws=null;NET.on=false}sessionStorage.removeItem('fm_acct');FM_RAW.set('fm_remember','0');ONL32.show(false);showTitle();tLoginForm();tErr(msg||'กรุณาเข้าสู่ระบบใหม่')};
ONL32.pull=async()=>{ONL32.kick('กรุณาเข้าสู่ระบบเพื่อโหลดตัวละครล่าสุด');return false};
{const _tm=tMain;tMain=function(){if(FM_ACCT&&!CLOUD.tok(FM_ACCT)&&!ONL32.dev){tLoginForm();return}_tm()}}
{const _tp=tPlay;tPlay=async function(){if(ONL32.dev||ONL32.verified)return _tp();if(!FM_ACCT||!CLOUD.tok(FM_ACCT)){showTitle();return}if(!SERVER_BOOT.ready&&['auth','session-replaced'].includes(SERVER_BOOT.error)){ONL32.kick(SERVER_BOOT.error==='session-replaced'?'บัญชีนี้มีการเข้าสู่ระบบใหม่ในแท็บ หน้าต่าง หรืออุปกรณ์อื่น กรุณาล็อกอินเพื่อเล่นที่นี่':'กรุณาเข้าสู่ระบบใหม่');return}if(!SERVER_BOOT.ready){titleEl.hidden=false;PAUSED=true;const pan=gid('tpan');pan.innerHTML='<h3>ยังโหลดตัวละครจากเซิร์ฟเวอร์ไม่ได้</h3><div class="tip">ข้อมูลบนเซิร์ฟเวอร์ยังไม่ถูกแทนที่</div><button class="tb" onclick="location.reload()">ลองเชื่อมต่ออีกครั้ง</button><button class="tb ghost" onclick="accLogout()">เข้าสู่ระบบใหม่</button>';return}ONL32.verified=true;FM_RAW.set(CLOUD.revKey(),String(CLOUD.rev));if(!NET.ws)netConnect();_tp();CLOUD.sync(true)}}
/* All user logout buttons share this gate; session replacement pauses on the login screen. */
ONL32.saveFailureText=function(){
 const key=CLOUD.lastError;
 return ({'snapshot':'เตรียมข้อมูลบันทึกไม่สำเร็จ — ยังไม่ออกจากเกม',store:'เซิร์ฟเวอร์ยังบันทึกข้อมูลไม่ได้ — ของยังอยู่ในเกมนี้ กรุณาลองอีกครั้ง',offline:'ยังเชื่อมต่อเซิร์ฟเวอร์เพื่อบันทึกไม่ได้ — กรุณาลองอีกครั้ง',network:'ยังเชื่อมต่อเซิร์ฟเวอร์เพื่อบันทึกไม่ได้ — กรุณาลองอีกครั้ง',size:'ข้อมูลบันทึกมีขนาดเกินที่เซิร์ฟเวอร์รองรับ — ยังไม่ออกจากเกม',inflight:'กำลังส่งข้อมูลบันทึกก่อนหน้า — รอสักครู่แล้วลองอีกครั้ง',auth:'เซสชันหมดอายุ — กรุณาเข้าสู่ระบบใหม่', 'invalid-save':'เซิร์ฟเวอร์ไม่ยอมรับข้อมูลบันทึก — ยังไม่ออกจากเกม'})[key]||'บันทึกขึ้นเซิร์ฟเวอร์ยังไม่สำเร็จ — ยังไม่ออกจากเกม กรุณาลองอีกครั้ง';
};
ONL32.logout=function(leave){
 if(ONL32.logoutTask)return ONL32.logoutTask;
 const wasPaused=PAUSED;let leaving=false;PAUSED=true;
 const button=gid('off32')&&gid('off32').querySelector('button'),label=button&&button.textContent;
 if(button){button.disabled=true;button.textContent='กำลังบันทึกก่อนออก…'}
 ONL32.logoutTask=(async()=>{
  try{
   const ok=await safeSync123();
   if(!ok){const message=ONL32.saveFailureText();if(ONL32.shown)gid('off32s').textContent=message;try{say(message)}catch(e){}return false}
   const result=leave();leaving=true;return result;
  }catch(e){const message=ONL32.saveFailureText();if(ONL32.shown)gid('off32s').textContent=message;try{say(message)}catch(_){}return false}
  finally{if(!leaving)PAUSED=wasPaused;if(button){button.disabled=false;button.textContent=label}ONL32.logoutTask=null}
 })();return ONL32.logoutTask;
};
// ---------- ต้องออนไลน์ตลอด: หลุดแล้วหยุดเกม + ต่อใหม่ให้อัตโนมัติ ----------
{const st=document.createElement('style');st.textContent='#off32{position:fixed;inset:0;z-index:99999;background:rgba(6,8,20,.86);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;font:600 16px system-ui,"Noto Sans Thai",sans-serif;text-align:center;padding:20px}#off32[hidden]{display:none}#off32 .sp{width:46px;height:46px;border:5px solid rgba(255,255,255,.2);border-top-color:#ffd84a;border-radius:50%;animation:off32 1s linear infinite;margin-bottom:14px}@keyframes off32{to{transform:rotate(360deg)}}#off32 small{display:block;opacity:.75;margin-top:6px;font-weight:400}#off32 button{margin-top:14px;height:42px;padding:0 18px;font-size:15px;border-radius:10px;border:2px solid #e8c14a;background:#2a2340;color:#fff}';document.head.appendChild(st)}
{const o=document.createElement('div');o.id='off32';o.hidden=true;o.innerHTML='<div class="sp"></div><div id="off32t">🔌 การเชื่อมต่อหลุด</div><small id="off32s">กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่… (เกมหยุดชั่วคราว)</small><button onclick="saveGame(true);accLogout()">ออกจากระบบ</button>';document.body.appendChild(o)}
ONL32.tick=function(){if(ONL32.dev)return;if(ONL32.logoutTask){PAUSED=true;return}const ingame=titleEl.hidden&&FM_ACCT&&ONL32.verified;
 if(!ingame){if(ONL32.shown)ONL32.show(false);return}
 const now=Date.now();if(!NET.on){if(!ONL32.downAt)ONL32.downAt=now;if(!NET.ws)try{netConnect()}catch(e){}}else ONL32.downAt=0;
 const wsBad=ONL32.downAt&&now-ONL32.downAt>6000,saveBad=CLOUD.fails>=1;
 if(saveBad&&!CLOUD.inflight&&now-(ONL32.lastTry||0)>5000){ONL32.lastTry=now;CLOUD.sync(true)}
 if(wsBad||saveBad){gid('off32t').textContent=saveBad&&!wsBad?'☁️ บันทึกขึ้นเซิร์ฟเวอร์ไม่ได้':'🔌 การเชื่อมต่อหลุด';gid('off32s').textContent=saveBad?ONL32.saveFailureText():'กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่… (เกมหยุดชั่วคราว)';ONL32.show(true)}else ONL32.show(false)};
ONL32.show=function(v){const o=gid('off32');if(!o)return;if(v){if(!ONL32.shown){ONL32.shown=true;o.hidden=false;if(!PAUSED){PAUSED=true;ONL32.paused=true}}else if(!PAUSED){PAUSED=true;ONL32.paused=true}}
 else if(ONL32.shown){ONL32.shown=false;o.hidden=true;if(ONL32.paused){ONL32.paused=false;if(menuEl.hidden)PAUSED=false}try{sysSay('🌐 เชื่อมต่อเซิร์ฟเวอร์กลับมาแล้ว')}catch(e){}}};
setInterval(ONL32.tick,1000);
// ---------- เอาตัวเลือก "ออฟไลน์/ตั้งเซิร์ฟเวอร์เอง" ออกจากเมนู ----------
try{const inp=gid('netUrl');if(inp){const sec=inp.closest('div');for(const id of ['netGo','netOff'])gid(id)&&gid(id).remove();inp.closest('label').remove()}
 const nb=gid('netb');if(nb)nb.onclick=()=>{try{sysSay(NET.on?'🌐 ออนไลน์ '+NET.n+' คน':'🔌 กำลังเชื่อมต่อเซิร์ฟเวอร์…')}catch(e){}}}catch(e){}
{const _ns=netStatus;netStatus=function(){_ns();const b=gid('netb');if(b)b.title=NET.on?'ออนไลน์ '+NET.n+' คน':'กำลังเชื่อมต่อ…';const s=gid('netst');if(s&&!NET.on)s.textContent=NET.ws?'🟡 กำลังเชื่อมต่อ…':'🔴 ไม่ได้เชื่อมต่อ — กำลังลองใหม่'}}
// เชื่อมต่อใหม่เร็วขึ้น (ไม่หน่วงนานแบบเดิม)
setInterval(()=>{if(!ONL32.dev&&ONL32.verified&&FM_ACCT&&!NET.ws&&SET.server&&!document.hidden)try{netConnect()}catch(e){}},3000);
window.ONL32=ONL32;
// กันสถานะค้าง: on=true แต่ซ็อกเก็ตถูกปิดไปแล้ว (ตอนต่อใหม่/รีโหลด)
{const _nt=netTick;netTick=function(dt){if(NET.on&&(!NET.ws||NET.ws.readyState!==1)){if(!NET.ws)NET.on=false;return}return _nt(dt)}}
try{const v=titleEl.querySelector('.ver');if(v)v.textContent='v4.37 · ออนไลน์'}catch(e){}

// =====================================================================

/* Acknowledgement status is visible without asking players to press Save or Logout. */
{const badge=document.createElement('div');badge.id='saveStatus32';badge.style.cssText='position:fixed;left:12px;top:calc(98px + env(safe-area-inset-top,0px));z-index:8;padding:3px 7px;border-radius:6px;background:#101c28cc;color:#aff0b5;font:11px system-ui;pointer-events:none';badge.hidden=true;document.body.appendChild(badge);setInterval(()=>{badge.hidden=!ONL32.verified||!titleEl.hidden;if(badge.hidden)return;badge.textContent=CLOUD.fails?'บันทึกไม่สำเร็จ · กำลังลองใหม่':CLOUD.pending||CLOUD.inflight?'กำลังบันทึก…':CLOUD.t?'บันทึกบนเซิร์ฟเวอร์แล้ว':'กำลังบันทึก…';badge.style.color=CLOUD.fails?'#ffc4a5':CLOUD.pending?'#ffe49d':'#aff0b5'},500)}
