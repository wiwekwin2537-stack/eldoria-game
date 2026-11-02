// fix69 (v4.61) — 💠 เหรียญแฟชั่น: ใช้ซื้อชุด/อาวุธแฟชั่นที่บูติกมาดามโรส (แทนเหรียญทอง)
//   ยอดเหรียญเก็บที่เซิร์ฟเวอร์ (accounts.js /api/gem) → แก้ในเครื่องไม่ได้ · ของที่ซื้อผูกกับบัญชี ใช้ได้ทุกเครื่อง
//   ได้ฟรีจากการเล่น (สูงสุด 10/วัน): เข้าเกมวันละ +2 · ชนะบอสตำนาน +2 · บอสโลก +3 · แลก 30,000 🪙 → 1 💠 (วันละ 5)
//   เติมเงิน: เลือกแพ็ก → ได้รหัสอ้างอิง + QR พร้อมเพย์ (ข้อมูลรับเงินตั้งที่ Render env TOPUP_*) → ส่งสลิป → GM อนุมัติในเกม
try{
const GEMP69={"b:night":45,"b:sakura":60,"b:star":80,"b:pirate":70,"b:flame":180,"b:frost":180,"b:th_chakkri":120,"b:th_boromphiman":100,"b:th_chitlada":60,"b:th_nangram":160,"b:th_khon":220,"b:th_nakrop":90,"b:th_khunnang":120,"b:th_chaona":35,"b:th_thep":300,"b:c_sword":140,"b:c_mage":160,"b:c_archer":140,"b:c_ninja":150,"b:c_sniper":140,"b:c_paladin":180,"b:c_cleric":160,"b:c_necro":160,"b:c_monk":140,"b:c_dragoon":180,"b:c_summoner":150,"w:dragon":90,"w:sakura":65,"w:crystal":90,"w:moon":120,"w:holy":200,"w:thunder":150,"w:w_sword":160,"w:w_mage":160,"w:w_archer":160,"w:w_ninja":160,"w:w_sniper":160,"w:w_paladin":180,"w:w_cleric":160,"w:w_necro":180,"w:w_monk":150,"w:w_dragoon":180,"w:w_summoner":160};
const XCOIN69=30000;
const G69={gem:null,fown:[],earn:0,cap:10,xchg:0,xmax:5,pkg:[],top:{},gm:false,pend:[],t:0};window.G69=G69;window.GEMP69=GEMP69;
const on69=()=>{try{return !!(window.FM_ACCT&&window.CLOUD&&CLOUD.base()&&CLOUD.tok(FM_ACCT))}catch(e){return false}};
async function gemApi69(op,x){if(!on69())return {err:'off'};try{return await CLOUD.call('/api/gem',Object.assign({id:FM_ACCT,token:CLOUD.tok(FM_ACCT),op},x||{}),20000)||{err:'fail'}}catch(e){return {err:'fail'}}}
window.gemApi69=gemApi69;
const ERR69={off:'ต้องล็อกอินออนไลน์ก่อน',gem:'💠 เหรียญแฟชั่นไม่พอ',cap:'วันนี้ได้เหรียญฟรีครบ 10 แล้ว (พรุ่งนี้ได้ใหม่)',cd:'ยังไม่ถึงเวลารับอีกครั้ง',xmax:'วันนี้แลกครบ 5 ครั้งแล้ว',closed:'ยังไม่เปิดระบบเติมเงิน',many:'มีรายการรอตรวจ 3 รายการแล้ว รอ GM อนุมัติก่อน',perm:'เฉพาะ GM',fail:'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',store:'บันทึกไม่สำเร็จ ลองใหม่',item:'ไม่มีสินค้านี้',nouser:'ไม่พบไอดีนี้',noreq:'รายการนี้จัดการไปแล้ว'};
const em69=r=>ERR69[r&&r.err]||('ผิดพลาด: '+(r&&r.err));
function take69(r){if(!r||!r.ok)return r;for(const k of ['gem','fown','earn','cap','xchg','xmax','pkg','top','gm'])if(r[k]!=null)G69[k]=r[k];if(r.pend)G69.pend=r.pend;G69.t=Date.now();
 let ch=0;for(const k of G69.fown||[])if(!FASH.own.includes(k)){FASH.own.push(k);ch=1}if(ch)try{saveFash()}catch(e){}return r}
async function gemRefresh69(){const r=await gemApi69('bal');take69(r);try{gemHud69()}catch(e){}return r}window.gemRefresh69=gemRefresh69;
// เหรียญเข้าจากการเล่น
async function gemEarn69(src){const r=await gemApi69('earn',{src});if(r&&r.ok){take69(r);if(r.got>0){sysSay('💠 ได้เหรียญแฟชั่น +'+r.got+' (วันนี้ '+G69.earn+'/'+G69.cap+') · มี '+G69.gem);try{banner('💠 +'+r.got+' เหรียญแฟชั่น','ใช้ซื้อชุดที่บูติกมาดามโรส','')}catch(e){}}}return r}
window.gemEarn69=gemEarn69;
{const _mk=mobKill;mobKill=function(m){const was=!!(typeof D!=='undefined'&&D&&D.won);const r=_mk.apply(this,arguments);try{if(m&&m.lb62&&D&&D.won&&!was)gemEarn69('lboss')}catch(e){}return r};window.mobKill=mobKill}
{const _w=wbReward10;wbReward10=function(){const r=_w.apply(this,arguments);try{gemEarn69('wboss')}catch(e){}return r};window.wbReward10=wbReward10}
// ตรวจยอด + โบนัสเข้าเกมรายวัน (เมื่อออนไลน์)
let lastDay69='';setInterval(()=>{try{if(!on69())return;const d=new Date(Date.now()+7*3600e3).toISOString().slice(0,10);if(d!==lastDay69){lastDay69=d;const g0=G69.gem;gemRefresh69().then(r=>{if(r&&r.ok&&g0!=null&&r.gem>g0)sysSay('💠 โบนัสเข้าเกมวันนี้ +'+(r.gem-g0)+' เหรียญแฟชั่น')})}}catch(e){}},8000);
// ---------- บูติก: ราคาเป็น 💠 ----------
const css69=document.createElement('style');css69.textContent='#fashw .gem69{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:6px 10px;background:linear-gradient(90deg,rgba(90,200,255,.16),rgba(255,140,220,.12));border-bottom:1px solid rgba(255,255,255,.12);font:700 13px system-ui,"Noto Sans Thai",sans-serif;color:#e8f6ff}#fashw .gem69 b{font-size:15px;color:#9fe6ff}#fashw .gem69 button,#gem69w .bt69{border:0;border-radius:9px;padding:6px 10px;font:800 12.5px system-ui,"Noto Sans Thai";cursor:pointer;background:#2a4a6a;color:#fff}#fashw .gem69 .top69,#gem69w .go69{background:linear-gradient(180deg,#ffd86a,#e0a020);color:#3a2400}#gem69w .bd{display:block!important;overflow-y:auto;padding:10px 12px;font:600 13px/1.55 system-ui,"Noto Sans Thai",sans-serif;color:#eee}#gem69w .pk{display:inline-flex;flex-direction:column;align-items:center;gap:2px;margin:4px;padding:10px 14px;border-radius:12px;border:1px solid rgba(159,230,255,.45);background:rgba(90,200,255,.1);cursor:pointer;color:#fff;font:800 15px system-ui,"Noto Sans Thai"}#gem69w .pk small{font-weight:600;color:#ffd86a}#gem69w .box{background:rgba(255,255,255,.06);border-radius:10px;padding:8px 10px;margin:6px 0}#gem69w .qr{background:#fff;padding:8px;border-radius:10px;display:inline-block;color:#333;font-size:12px}#gem69w .ref{font:900 22px monospace;letter-spacing:3px;color:#ffd86a}#gem69w table{width:100%;border-collapse:collapse;font-size:12px}#gem69w td{padding:4px;border-bottom:1px solid rgba(255,255,255,.1)}';document.head.appendChild(css69);
{const _rf=renderFash;renderFash=function(){const r=_rf.apply(this,arguments);try{
  const hd=fsW.querySelector('.hd b');if(hd)hd.innerHTML='👗 บูติกมาดามโรส';
  const bd=fsW.querySelector('.bd');if(bd&&!fsW.querySelector('.gem69'))bd.insertAdjacentHTML('beforebegin','<div class="gem69">💠 <b>'+(G69.gem==null?'…':G69.gem.toLocaleString())+'</b> เหรียญแฟชั่น <small style="opacity:.75">(ฟรีวันนี้ '+G69.earn+'/'+G69.cap+')</small><span style="flex:1"></span><button onclick="openGem69(\'x\')">🔁 แลก</button><button class="top69" onclick="openGem69(\'top\')">💳 เติมเหรียญ</button></div>');
  for(const b of fsW.querySelectorAll('button[onclick^="fashBuy"]')){const m=/fashBuy\('(\w)','([^']+)'\)/.exec(b.getAttribute('onclick'));if(!m)continue;const key=m[1]+':'+m[2],p=GEMP69[key];if(!p)continue;
   b.textContent='ซื้อ 💠 '+p;b.disabled=!(G69.gem>=p);if(!(G69.gem>=p))b.title='เหรียญแฟชั่นไม่พอ'}
 }catch(e){}return r};window.renderFash=renderFash}
{const _of=openFash;openFash=function(){const r=_of.apply(this,arguments);if(Date.now()-G69.t>15000)gemRefresh69().then(()=>{if(!fsW.hidden)renderFash()});return r};window.openFash=openFash}
let buying69=false;
window.fashBuy=async(ty,k)=>{const key=ty+':'+k,p=GEMP69[key],D6=ty==='w'?FWPN[k]:OUTFIT[k];if(!D6||!p||buying69)return;if(FASH.own.includes(key)){fashWear(ty,k);return}
 if(!on69()){say('💠 ซื้อแฟชั่นต้องล็อกอินออนไลน์');sfx('thud');return}
 if(!(G69.gem>=p)){say('💠 เหรียญแฟชั่นไม่พอ (ต้องใช้ '+p+' มี '+(G69.gem|0)+')');sfx('thud');openGem69('top');return}
 buying69=true;const r=await gemApi69('buy',{key});buying69=false;
 if(!r||!r.ok){say(em69(r));sfx('thud');if(r&&r.gem!=null)G69.gem=r.gem;renderFash();return}
 take69(r);if(!FASH.own.includes(key))FASH.own.push(key);try{saveFash()}catch(e){}sfx('chest');for(let i=0;i<5;i++)tone(800+i*200,0,.15,'triangle',.04,i*.07);fashWear(ty,k);
 try{banner('✨ ได้'+D6.n+'!','ใช้ 💠 '+p+' · เหลือ '+G69.gem,'')}catch(e){}if(!fsW.hidden)renderFash()};
// ---------- หน้าต่างแลก / เติมเหรียญ / GM ----------
const gW69=mk6('gem69w');window.gW69=gW69;const GU69={tab:'top',q:null,gm:null,look:null};
function crc69(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function ppPayload69(id,amt){const f=(t,v)=>t+String(v.length).padStart(2,'0')+v;let acc;id=String(id).replace(/\D/g,'');
 if(id.length>=15)acc=f('03',id);else if(id.length>=13)acc=f('02',id);else acc=f('01',('0000000000000'+('66'+id.replace(/^0/,''))).slice(-13));
 let p=f('00','01')+f('01','12')+f('29',f('00','A000000677010111')+acc)+f('53','764')+f('54',amt.toFixed(2))+f('58','TH')+'6304';return p+crc69(p)}
window.ppPayload69=ppPayload69;
function qr69(el,text){const go=()=>{try{const q=qrcode(0,'M');q.addData(text);q.make();el.innerHTML=q.createSvgTag(4,2)}catch(e){el.textContent='(แสดง QR ไม่ได้)'}};
 if(window.qrcode)return go();const U=['https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js','https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'];
 const ld=i=>{if(i>=U.length){el.textContent='(โหลด QR ไม่ได้ — โอนด้วยเลขพร้อมเพย์ด้านล่างได้)';return}const s=document.createElement('script');s.src=U[i];s.onload=()=>window.qrcode?go():ld(i+1);s.onerror=()=>ld(i+1);document.head.appendChild(s)};ld(0)}
function openGem69(t){GU69.tab=t||'top';p6open(gW69);render69();gemRefresh69().then(()=>{if(!gW69.hidden)render69()});if(t==='gm')gmLoad69()}
window.openGem69=openGem69;
function render69(){const T=GU69.tab,tb=(k,n)=>'<button class="'+(T===k?'on':'')+'" onclick="openGem69(\''+k+'\')">'+n+'</button>';
 let h='<div class="w"><div class="hd"><b>💠 เหรียญแฟชั่น · '+(G69.gem==null?'…':G69.gem.toLocaleString())+'</b>'+tb('top','💳 เติม')+tb('x','🔁 แลก/รับฟรี')+(G69.gm?tb('gm','🛠️ GM'):'')+'<button onclick="p6close(gW69)">✕</button></div><div class="bd">';
 if(!on69())h+='<div class="box">⚠️ ต้อง<b>ล็อกอินออนไลน์</b>ก่อน เหรียญแฟชั่นเก็บไว้ที่เซิร์ฟเวอร์ (ปลอดภัย ใช้ได้ทุกเครื่อง)</div>';
 else if(T==='x'){h+='<div class="box">ได้ฟรีจากการเล่น <b>สูงสุด '+G69.cap+' เหรียญ/วัน</b> · วันนี้ได้แล้ว <b>'+G69.earn+'/'+G69.cap+'</b><br>📅 เข้าเกมวันละครั้ง +2 · 🐲 ชนะบอสตำนาน +2 · 🐉 ร่วมบอสโลก +3</div>'
  +'<div class="box">🔁 แลก <b>'+XCOIN69.toLocaleString()+' 🪙 → 1 💠</b> (วันนี้ '+G69.xchg+'/'+G69.xmax+') · มี 🪙 '+(inv.coin|0).toLocaleString()+'<br><button class="bt69 go69" '+((inv.coin|0)>=XCOIN69&&G69.xchg<G69.xmax&&G69.earn<G69.cap?'':'disabled')+' onclick="xchg69()">แลก 1 เหรียญ</button></div>'}
 else if(T==='top'){const tp=G69.top||{};
  if(!tp.pp)h+='<div class="box">🔒 <b>ยังไม่เปิดระบบเติมเงิน</b> — ระหว่างนี้รับเหรียญฟรีได้ที่แท็บ 🔁 แลก/รับฟรี</div>';
  else if(GU69.q){const q=GU69.q;h+='<div class="box" style="text-align:center">โอน <b style="font-size:18px;color:#ffd86a">'+q.baht+' บาท</b> → ได้ 💠 <b>'+q.gem+'</b><br><span class="qr" id="qr69"></span><br>พร้อมเพย์ <b>'+tp.pp.replace(/(\d{3})(\d{3})(\d+)/,'$1-$2-$3')+'</b>'+(tp.nm?' · '+tp.nm:'')+'<br>รหัสอ้างอิง <span class="ref">'+q.ref+'</span></div>'
   +'<div class="box">1) สแกน QR หรือโอนเข้าพร้อมเพย์ด้านบน ยอด <b>'+q.baht+' บาท</b><br>2) ส่ง<b>สลิป + รหัส '+q.ref+' + ไอดี '+FM_ACCT+'</b> ไปที่ <b>'+(tp.ct||'แอดมิน')+'</b><br>3) GM ตรวจแล้วเหรียญเข้าอัตโนมัติ (ไม่ต้องออกเกม)<br><small style="opacity:.75">⚠️ โอนตามยอดที่แสดงเท่านั้น · ห้ามโอนแทนผู้อื่นโดยไม่ได้รับอนุญาต · ผู้เยาว์ควรขออนุญาตผู้ปกครองก่อน</small></div><button class="bt69" onclick="GU69q69(null)">← กลับ</button>'}
  else{h+='<div class="box">เลือกแพ็กเกจ (ได้รหัสอ้างอิง + QR พร้อมเพย์)</div><div style="text-align:center">'+(G69.pkg||[]).map(p=>'<button class="pk" onclick="req69(\''+p.id+'\')">💠 '+p.gem+'<small>'+p.baht+' บาท</small></button>').join('')+'</div>';
   if(G69.pend&&G69.pend.length)h+='<div class="box">⏳ รอ GM ตรวจ: '+G69.pend.map(p=>'<b>'+p.ref+'</b> ('+p.baht+'฿→💠'+p.gem+') <button class="bt69" onclick="cancel69(\''+p.ref+'\')">ยกเลิก</button>').join('<br>')+'</div>'}}
 else if(T==='gm'){h+='<div class="box">🛠️ <b>รายการเติมเงินรออนุมัติ</b> — ตรวจยอดเงินเข้าบัญชีจริงก่อนกด ✅ ทุกครั้ง <button class="bt69" onclick="gmLoad69()">🔄</button></div>';
  const L=GU69.gm;if(!L)h+='<div class="box">กำลังโหลด…</div>';else if(!L.length)h+='<div class="box">ไม่มีรายการค้าง</div>';
  else h+='<table>'+L.map(q=>'<tr><td><b>'+q.ref+'</b><br><small>'+new Date(q.t).toLocaleString('th-TH')+'</small></td><td>'+q.id+'<br><small>'+(q.n||'')+'</small></td><td><b>'+q.baht+'฿</b><br>💠'+q.gem+'</td><td><button class="bt69 go69" onclick="gmAct69(\'ok\',\''+q.ref+'\')">✅</button> <button class="bt69" onclick="gmAct69(\'no\',\''+q.ref+'\')">❌</button></td></tr>').join('')+'</table>';
  h+='<div class="box">เติม/หักเหรียญด้วยมือ: ไอดี <input id="gm69to" style="width:110px"> จำนวน <input id="gm69n" type="number" style="width:70px"> <button class="bt69 go69" onclick="gmCredit69()">ยืนยัน</button> <button class="bt69" onclick="gmLook69()">ดูประวัติ</button></div>';
  if(GU69.look){const l=GU69.look;h+='<div class="box"><b>'+l.id+'</b> ('+(l.n||'')+') 💠 '+l.gem+'<br>'+(l.log||[]).slice().reverse().map(x=>new Date(x.t).toLocaleString('th-TH')+' '+(x.n>0?'+':'')+x.n+' '+x.w).join('<br>')+'</div>'}}
 gW69.innerHTML=h+'</div></div>';const qe=gW69.querySelector('#qr69');if(qe&&GU69.q)qr69(qe,ppPayload69(G69.top.pp,GU69.q.baht))}
window.GU69q69=q=>{GU69.q=q;render69()};
window.req69=async id=>{const r=await gemApi69('req',{pkg:id});if(!r||!r.ok){say(em69(r));sfx('thud');return}if(r.top)G69.top=r.top;GU69.q=r;sfx('ui');render69();gemRefresh69()};
window.cancel69=async ref=>{await gemApi69('cancel',{ref});await gemRefresh69();render69()};
window.xchg69=async()=>{if((inv.coin|0)<XCOIN69){say('🪙 ไม่พอ');return}const r=await gemApi69('earn',{src:'xchg'});if(!r||!r.ok){say(em69(r));sfx('thud');await gemRefresh69();render69();return}
 inv.coin-=XCOIN69;try{refreshInv();saveGame(true)}catch(e){}take69(r);sfx('chest');sysSay('🔁 แลก '+XCOIN69.toLocaleString()+' 🪙 → 💠 +'+r.got+' (มี '+G69.gem+')');render69();try{if(!fsW.hidden)renderFash()}catch(e){}};
window.gmLoad69=async()=>{const r=await gemApi69('list');GU69.gm=r&&r.ok?r.list:[];if(!gW69.hidden&&GU69.tab==='gm')render69()};
window.gmAct69=async(op,ref)=>{const r=await gemApi69(op,{ref});say(r&&r.ok?(op==='ok'?'✅ อนุมัติ '+ref+' แล้ว เหรียญเข้าบัญชีผู้เล่น':'❌ ปฏิเสธ '+ref):em69(r));gmLoad69()};
window.gmCredit69=async()=>{const to=(gid('gm69to')||{}).value,n=+((gid('gm69n')||{}).value||0);if(!to||!n)return;const r=await gemApi69('credit',{to,n,note:'manual'});say(r&&r.ok?'💠 '+r.to+' มี '+r.gem:em69(r));if(r&&r.ok)gmLook69()};
window.gmLook69=async()=>{const to=(gid('gm69to')||{}).value;if(!to)return;const r=await gemApi69('look',{to});if(r&&r.ok)GU69.look=r;else say(em69(r));render69()};
function gemHud69(){}
// เมนูหลัก: 💠 เหรียญแฟชั่น
try{const at=PM7.findIndex(m=>m[1]==='คู่มือ');PM7.splice(at<0?PM7.length:at+1,0,['💠','เหรียญแฟชั่น',()=>openGem69('top')]);pmRender7()}catch(e){}
// มาดามโรสบอกเรื่องเหรียญ
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot.apply(this,arguments);try{if(id==='fashion'&&DLG.open&&Array.isArray(DLG.ch)){DLG.ch.splice(DLG.ch.length-1,0,{t:'💠 เหรียญแฟชั่น (แลก/เติม)',f:()=>openGem69('x')});if(!DLG.typing)dlgShowChoices()}}catch(e){}return r};window.ownerTalk=ownerTalk}
}catch(e){console.warn('fix69',e)}
