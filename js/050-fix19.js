// fix19.js (v4.27) — ข้อ 10–12: โกดังรับฝากของ + ธนาคาร เป็นอาคารในเมือง · คลังฝาก/ถอนทีละหลายชิ้น/ทั้งหมด/กรอกจำนวน
// =====================================================================
// ---------- อาคารใหม่ 2 หลัง (บ้านว่างเดิม) ----------
SD.bank={name:'ธนาคารเอลโดเรีย',emoji:'🏦',icon:'bank',img:'house1',b:[30,24,5,4],door:Object.assign({},SD.potion.door),sign:Object.assign({},SD.potion.sign),
 owner:{name:'คุณธนา (นายธนาคาร)',c:'#2a3a5a',h:'#3a2a1a',g:'m',age:'adult',greet:['สวัสดีครับ ธนาคารเอลโดเรียยินดีให้บริการ','ฝากเหรียญไว้กับเรา ปลอดภัยและได้ดอกเบี้ยทุกวันครับ'],
  lines:['ดอกเบี้ยวันละ 0.2% ของยอดฝาก (สูงสุดวันละ 400 เหรียญ) สะสมได้สูงสุด 7 วันครับ','เงินในธนาคารไม่หายไปไหน ต่อให้ล้มกลางดันเจี้ยนก็ตาม','ถ้าจะฝากของ เดินไปคลังสมบัติที่หัวเมืองฝั่งขวาได้เลยครับ']},solid:SD.potion.solid.slice(),sell:[],buy:[]};
SD.ware={name:'โกดังรับฝากของลุงคลัง',emoji:'📦',icon:'ware',img:'house2',b:[30,3,5,4],door:Object.assign({},SD.skill.door),sign:Object.assign({},SD.skill.sign),
 owner:{name:'ลุงคลัง',c:'#7a5a2a',h:'#d8d4c8',g:'m',age:'elder',apron:1,greet:['มาฝากของหรือจ๊ะหลาน ลุงเก็บให้อย่างดี','ของเยอะก็ไม่ต้องห่วง ฝากทีเดียวได้หมด'],
  lines:['ของที่ฝากไว้ไม่มีน้ำหนัก ไม่ถ่วงกระเป๋านะหลาน','อยากได้ช่องเพิ่ม ลุงขยายโกดังให้ได้ แค่จ่ายเหรียญนิดหน่อย','ที่ดินของหลานก็มีหีบคลังเหมือนกันนะ']},solid:SD.skill.solid?SD.skill.solid.slice():SD.potion.solid.slice(),sell:[],buy:[]};
SHOP_ORDER.push('bank','ware');
for(const [id,src] of [['bank','store'],['ware','store']]){SHOP_ART[id]=SHOP_ART[src]||SHOP_ART.potion;SHOP_ANIM[id]=SHOP_ANIM[src]||SHOP_ANIM.potion;SHOP_TINT[id]=id==='bank'?'rgba(255,220,120,.10)':'rgba(200,160,100,.10)'}
SIGN_ICONS.bank=k=>{k.strokeStyle='#3a2a08';k.lineWidth=2;for(let i=0;i<3;i++){k.fillStyle=i%2?'#e8c14a':'#ffd23a';k.beginPath();k.ellipse(0,10-i*6,11,4,0,0,7);k.fill();k.stroke()}k.fillStyle='#ffd23a';k.beginPath();k.arc(4,-8,7,0,7);k.fill();k.stroke();k.fillStyle='#3a2a08';k.font='bold 9px system-ui';k.textAlign='center';k.fillText('฿',4,-5);k.textAlign='left'};
SIGN_ICONS.ware=k=>{k.fillStyle='#b8864a';k.strokeStyle='#3a2408';k.lineWidth=2.5;k.fillRect(-12,-10,24,22);k.strokeRect(-12,-10,24,22);k.beginPath();k.moveTo(-12,-10);k.lineTo(12,12);k.moveTo(12,-10);k.lineTo(-12,12);k.stroke();k.fillStyle='#8a5a2a';k.fillRect(-12,-2,24,4)};
{const _ot=ownerTalk;ownerTalk=function(id){if(id!=='bank'&&id!=='ware')return _ot(id);const o=D.owner,S=SD[id];
 if(id==='bank')talk(o,pick(S.owner.greet)+' — รับบริการอะไรดีครับ?',[{t:'🏦 ฝาก/ถอนเหรียญ',c:'go',f:()=>openBank19()},{t:'📦 ฝากของ (คลัง)',f:()=>openVault8()},{t:'💬 สอบถาม',stay:true,f:()=>talk(o,pick(S.owner.lines),[BYE])},BYE],S.owner.name);
 else talk(o,pick(S.owner.greet),[{t:'📦 เปิดคลังเก็บของ',c:'go',f:()=>openVault8()},{t:'💬 คุยเล่น',stay:true,f:()=>talk(o,pick(S.owner.lines),[BYE])},BYE],S.owner.name);return true}}
// ---------- คลัง: เปิดได้ที่โกดัง/ธนาคาร/ที่ดินของตัวเองเท่านั้น (เอาออกจากเมนูตัวละคร) ----------
const vHere19=()=>!!(D&&((D.shop==='ware'||D.shop==='bank')||D.home));
openVault8=function(){if(!vHere19()){say('📦 ฝากของได้ที่ "คลังสมบัติ" (หัวเมืองฝั่งขวา) · ธนาคาร · หรือที่ดินของคุณ');sfx('thud');return}p6open(vW8);vRender8()};window.openVault8=openVault8;
try{const i=PM7.findIndex(m=>m[1]==='คลัง');if(i>=0)PM7.splice(i,1)}catch(e){}
// ---------- คลัง UI ใหม่: กรอกจำนวน · เลือกหลายชิ้น · ฝาก/ถอนทั้งหมด ----------
const VS19={sel:false,pick:new Set(),n:''};
const TOOLK19=new Set(['pick','axe','hoe','rod','can','sick','hamr']);
function vMove19(dir,t,k,n){const src=dir==='in'?(t==='g'?GEAR:inv):(t==='g'?VAULT8.gear:VAULT8.mats),dst=dir==='in'?(t==='g'?VAULT8.gear:VAULT8.mats):(t==='g'?GEAR:inv);
 if(!(src[k]>0))return 0;if(dir==='in'&&!(dst[k]>0)&&vUsed8()>=vCap8())return -1;n=Math.min(src[k],n);let got=0;
 if(dir==='in'){src[k]-=n;got=n}else{for(;got<n;got++){const c=t==='g'?canTakeGear(k):canTake(k);if(c!==true){if(!got)return -2;break}src[k]--}}
 if(src[k]<=0){if(src===inv)inv[k]=0;else delete src[k]}dst[k]=(dst[k]|0)+got;return got}
function vDone19(msg){sfx('ui');vSave8();refreshInv();try{updQuick()}catch(e){}if(msg)say(msg);vRender8()}
const vQty19=()=>{const v=parseInt(VS19.n,10);return v>0?v:VQ8.q};
window.vIn8=(t,k)=>{if(VS19.sel){VS19.pick.has('in:'+t+':'+k)?VS19.pick.delete('in:'+t+':'+k):VS19.pick.add('in:'+t+':'+k);vRender8();return}const r=vMove19('in',t,k,vQty19());if(r===-1){say('คลังเต็ม — ขยายคลังได้');sfx('thud');return}if(r>0)vDone19()};
window.vOut8=(t,k)=>{if(VS19.sel){VS19.pick.has('out:'+t+':'+k)?VS19.pick.delete('out:'+t+':'+k):VS19.pick.add('out:'+t+':'+k);vRender8();return}const r=vMove19('out',t,k,vQty19());if(r===-2){noRoom(t==='g'?canTakeGear(k):canTake(k));return}if(r>0)vDone19()};
window.vAll19=what=>{let moved=0,full=false,heavy=false;const L=[];
 if(what==='mats')for(const k of INVORDER)if(k!=='coin'&&inv[k]>0)L.push(['in','m',k]);
 if(what==='gear')for(const k in GEAR)if(GEAR[k]>0&&ITEMS[k]&&!TOOLK19.has(ITEMS[k].kind))L.push(['in','g',k]);
 if(what==='out'){for(const k in VAULT8.mats)if(VAULT8.mats[k]>0)L.push(['out','m',k]);for(const k in VAULT8.gear)if(VAULT8.gear[k]>0)L.push(['out','g',k])}
 if(what==='sel'){for(const s of VS19.pick){const [d,t,k]=s.split(':');L.push([d,t,k])}VS19.pick.clear()}
 for(const [d,t,k] of L){const r=vMove19(d,t,k,what==='sel'?vQty19():1e9);if(r===-1)full=true;else if(r===-2)heavy=true;else moved+=r}
 vDone19(moved?(L[0]&&L[0][0]==='out'?'📤 ถอน':'📥 ฝาก')+'แล้ว '+moved.toLocaleString()+' ชิ้น'+(full?' · คลังเต็มบางส่วน':'')+(heavy?' · กระเป๋าเต็ม/หนักเกิน ถอนได้ไม่หมด':''):(full?'คลังเต็ม — ขยายคลังได้':heavy?'กระเป๋าเต็ม/หนักเกิน':'ไม่มีของให้ย้าย'))};
window.vSel19=()=>{VS19.sel=!VS19.sel;VS19.pick.clear();vRender8()};
window.vN19=v=>{VS19.n=String(v||'').replace(/\D/g,'').slice(0,6)};
vRender8=function(){const cap=vCap8(),used=vUsed8(),Q=VQ8.q,sel=VS19.sel;
 const cell=(t,k,n,act,dir)=>{const on=sel&&VS19.pick.has(dir+':'+t+':'+k);return '<div class="v8c'+(on?' v19on':'')+'" onclick="'+act+'(\''+t+'\',\''+k+'\')" title="'+(t==='g'?ITEMS[k].name:MN(k))+'"><img src="'+vIcon8(t,k)+'"><em>'+n+'</em>'+(on?'<i>✔</i>':'')+'</div>'};
 let vh='',bh='';for(const k in VAULT8.gear)if(VAULT8.gear[k]>0&&ITEMS[k])vh+=cell('g',k,VAULT8.gear[k],'vOut8','out');for(const k in VAULT8.mats)if(VAULT8.mats[k]>0&&INVMETA[k])vh+=cell('m',k,VAULT8.mats[k],'vOut8','out');
 for(const k in GEAR)if(GEAR[k]>0&&ITEMS[k])bh+=cell('g',k,GEAR[k],'vIn8','in');for(const k of INVORDER)if(k!=='coin'&&inv[k]>0)bh+=cell('m',k,inv[k],'vIn8','in');
 const nx=VCOST8[VAULT8.lv|0],B=(q,l)=>'<button class="'+(Q===q&&!VS19.n?'on':'')+'" onclick="VS19n19();vQ8('+q+')">'+l+'</button>';
 vW8.innerHTML='<div class="w"><div class="hd"><b>📦 คลังเก็บของ · '+used+'/'+cap+' ช่อง</b><button onclick="p6close(vW8)">✕</button></div>'
  +'<div class="v19bar"><span>จำนวนต่อครั้ง:</span>'+B(1,'×1')+B(10,'×10')+B(1e9,'ทั้งหมด')+'<input id="v19n" type="number" min="1" inputmode="numeric" placeholder="กรอกจำนวน" value="'+VS19.n+'" oninput="vN19(this.value)">'
  +'<button class="'+(sel?'on':'')+'" onclick="vSel19()">☑️ เลือกหลายชิ้น</button>'+(sel?'<button class="g" onclick="vAll19(\'sel\')">✅ ย้ายที่เลือก ('+VS19.pick.size+')</button>':'')+'</div>'
  +'<div class="bd v8"><div class="v8p"><div class="v8t">📦 ในคลัง ('+(sel?'แตะเพื่อเลือก':'แตะ = ถอน')+')</div><div class="v8g">'+(vh||'<small>ยังว่าง</small>')+'</div><button class="bt v19b" onclick="vAll19(\'out\')">📤 ถอนทั้งหมด</button>'+(nx?'<button class="bt v8up" onclick="vUp8()">➕ ขยายคลัง +'+(VCAP8[(VAULT8.lv|0)+1]-cap)+' ช่อง · 🪙 '+nx.toLocaleString()+'</button>':'<small>คลังขนาดสูงสุดแล้ว</small>')+'</div>'
  +'<div class="v8p"><div class="v8t">🎒 กระเป๋า ('+(sel?'แตะเพื่อเลือก':'แตะ = ฝาก')+') · ของที่สวมอยู่ฝากไม่ได้</div><div class="v8g">'+(bh||'<small>กระเป๋าว่าง</small>')+'</div><div class="v19row"><button class="bt v19b" onclick="vAll19(\'mats\')">📥 ฝากวัตถุดิบทั้งหมด</button><button class="bt v19b" onclick="vAll19(\'gear\')">📥 ฝากอุปกรณ์ทั้งหมด</button></div><small style="opacity:.75">* "ฝากอุปกรณ์ทั้งหมด" ไม่รวมเครื่องมือ (ขวาน/ที่ขุด/เบ็ด ฯลฯ)</small></div></div></div>'};
window.VS19n19=()=>{VS19.n=''};
{const st=document.createElement('style');st.textContent='#vlt8 .v19bar{display:flex;flex-wrap:wrap;gap:5px;align-items:center;padding:6px 8px 0;font:700 12px system-ui;color:#ffe9a0}#vlt8 .v19bar button{padding:4px 9px;border-radius:8px;border:1px solid #5a4a7a;background:#2a2238;color:#fff;font:700 12px system-ui;cursor:pointer}#vlt8 .v19bar button.on{background:#ffe9a0;color:#3a2408}#vlt8 .v19bar button.g{background:#2e7a3a}#vlt8 .v19bar input{width:96px;padding:4px 6px;border-radius:8px;border:1px solid #5a4a7a;background:#120e1c;color:#fff;font:700 12px system-ui}#vlt8 .v19row{display:flex;gap:5px;margin-top:6px}#vlt8 .v19row .bt{flex:1}#vlt8 .v19b{margin-top:6px}#vlt8 .v8c.v19on{border-color:#7aff9a;box-shadow:0 0 0 2px #2e7a3a inset}#vlt8 .v8c i{position:absolute;left:3px;top:1px;font-style:normal;color:#7aff9a;font:900 12px system-ui}';document.head.appendChild(st)}
// ---------- ธนาคาร ----------
const BANK19=(()=>{let B={coin:0,day:0,log:[]};try{Object.assign(B,JSON.parse(localStorage.getItem('fm_bank19')||'{}')||{})}catch(e){}B.coin=Math.max(0,Math.floor(B.coin||0));B.log=Array.isArray(B.log)?B.log.slice(-12):[];return B})();
const bankSave19=()=>{try{localStorage.setItem('fm_bank19',JSON.stringify(BANK19))}catch(e){}try{saveGame(true)}catch(e){}};
const dayNo19=()=>Math.floor((srvNow()+7*3600e3)/864e5);
const bankLog19=(t,n)=>{BANK19.log.push([Date.now(),t,n]);if(BANK19.log.length>12)BANK19.log.shift()};
function bankInterest19(){if(!SRV.ok)return 0;const d=dayNo19();if(!BANK19.day){BANK19.day=d;return 0}const days=Math.min(7,d-BANK19.day);if(days<=0)return 0;let tot=0;for(let i=0;i<days;i++){const it=Math.min(400,Math.floor(BANK19.coin*.002));BANK19.coin+=it;tot+=it}BANK19.day=d;if(tot>0)bankLog19('ดอกเบี้ย '+days+' วัน',tot);return tot}
const bkW19=mk6('bank19');const BK19={n:''};
function openBank19(){if(!(D&&D.shop==='bank')){say('🏦 ฝาก/ถอนเหรียญได้ที่ธนาคารเอลโดเรีย (ถนนล่าง ข้างกิลด์)');sfx('thud');return}const it=bankInterest19();if(it>0){bankSave19();say('💰 ได้ดอกเบี้ย +'+it.toLocaleString()+' เหรียญ')}p6open(bkW19);bankRender19()}
window.openBank19=openBank19;
function bankRender19(){const amt=parseInt(BK19.n,10)||0,Q=(v,l)=>'<button onclick="bkSet19('+v+')">'+l+'</button>';
 const log=BANK19.log.slice().reverse().map(([t,s,n])=>{const dt=new Date(t);return '<div class="bk19l"><span>'+dt.toLocaleDateString('th-TH',{day:'numeric',month:'short'})+' '+dt.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})+'</span><b>'+s+'</b><em class="'+(n>=0?'p':'m')+'">'+(n>=0?'+':'')+n.toLocaleString()+'</em></div>'}).join('')||'<small>ยังไม่มีรายการ</small>';
 bkW19.innerHTML='<div class="w"><div class="hd"><b>🏦 ธนาคารเอลโดเรีย</b><button onclick="p6close(bkW19)">✕</button></div><div class="bd bk19">'
  +'<div class="bk19c"><div><small>ยอดเงินในบัญชี</small><b>🏦 '+BANK19.coin.toLocaleString()+'</b></div><div><small>เหรียญในกระเป๋า</small><b>🪙 '+inv.coin.toLocaleString()+'</b></div></div>'
  +'<div class="bk19i"><input id="bk19n" type="number" min="1" inputmode="numeric" placeholder="กรอกจำนวนเหรียญ" value="'+BK19.n+'" oninput="BK19n19(this.value)"><div class="bk19q">'+Q(100,'100')+Q(1000,'1,000')+Q(10000,'10,000')+Q(-1,'ครึ่งหนึ่ง')+Q(-2,'ทั้งหมด')+'</div>'
  +'<div class="bk19a"><button class="bt g" onclick="bkDo19(\'in\')">📥 ฝากเหรียญ</button><button class="bt" onclick="bkDo19(\'out\')">📤 ถอนเหรียญ</button></div>'
  +'<small style="opacity:.8">ดอกเบี้ย 0.2% ต่อวัน (สูงสุด 400/วัน · สะสมได้ 7 วัน) · คิดให้อัตโนมัติเมื่อมาที่ธนาคาร</small></div>'
  +'<div class="bk19log"><div class="v8t">🧾 รายการล่าสุด</div>'+log+'</div></div></div>'}
window.BK19n19=v=>{BK19.n=String(v||'').replace(/\D/g,'').slice(0,9)};
window.bkSet19=v=>{const box=document.getElementById('bk19n');if(v===-1||v===-2){const src=Math.max(inv.coin,BANK19.coin);BK19.n=String(v===-2?'all':Math.floor(src/2))}else BK19.n=String(v);if(BK19.n==='all'){BK19.n='';BK19.all=1}else BK19.all=0;bankRender19();const b=document.getElementById('bk19n');if(b){if(BK19.all){b.placeholder='ทั้งหมด';b.value=''}}};
window.bkDo19=dir=>{if(!(D&&D.shop==='bank'))return;let n=BK19.all?(dir==='in'?inv.coin:BANK19.coin):(parseInt(BK19.n,10)||0);n=Math.floor(n);
 if(n<=0){say('กรอกจำนวนเหรียญก่อนครับ');sfx('thud');return}
 if(dir==='in'){if(inv.coin<n){say('เหรียญในกระเป๋าไม่พอ');sfx('thud');return}inv.coin-=n;BANK19.coin+=n;bankLog19('ฝากเหรียญ',n);say('📥 ฝาก '+n.toLocaleString()+' เหรียญแล้ว')}
 else{if(BANK19.coin<n){say('ยอดในบัญชีไม่พอ');sfx('thud');return}BANK19.coin-=n;inv.coin+=n;bankLog19('ถอนเหรียญ',-n);say('📤 ถอน '+n.toLocaleString()+' เหรียญแล้ว')}
 if(!BANK19.day)BANK19.day=dayNo19();BK19.n='';BK19.all=0;sfx('chest');bankSave19();refreshInv();bankRender19()};
{const st=document.createElement('style');st.textContent='#bank19 .bk19{display:flex;flex-direction:column;gap:8px;padding:10px;overflow-y:auto}#bank19 .bk19c{display:flex;gap:8px}#bank19 .bk19c>div{flex:1;background:rgba(0,0,0,.28);border-radius:10px;padding:8px;display:flex;flex-direction:column}#bank19 .bk19c b{font:900 20px system-ui;color:#ffe27a}#bank19 .bk19i{display:flex;flex-direction:column;gap:6px;background:rgba(0,0,0,.2);border-radius:10px;padding:8px}#bank19 input{padding:8px;border-radius:8px;border:1px solid #6a5a3a;background:#120e08;color:#fff;font:800 15px system-ui}#bank19 .bk19q{display:flex;flex-wrap:wrap;gap:5px}#bank19 .bk19q button{padding:5px 10px;border-radius:8px;border:1px solid #6a5a3a;background:#2a2218;color:#fff;font:700 12px system-ui;cursor:pointer}#bank19 .bk19a{display:flex;gap:6px}#bank19 .bk19a .bt{flex:1}#bank19 .bk19log{background:rgba(0,0,0,.2);border-radius:10px;padding:8px}#bank19 .bk19l{display:flex;gap:8px;font:600 12px system-ui;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.06)}#bank19 .bk19l span{opacity:.7;width:110px}#bank19 .bk19l b{flex:1}#bank19 .bk19l em{font-style:normal;font-weight:800}#bank19 .bk19l em.p{color:#7aff9a}#bank19 .bk19l em.m{color:#ff9a8a}';document.head.appendChild(st)}

// =====================================================================
