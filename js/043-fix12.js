// fix12.js (v4.21) — ระบบคราฟใหม่ (33,34,36–39)
//  · ชุด/อาวุธ 6 เซ็ตใหม่ (แทนชื่อแร่) สีและหน้าตาแยกกัน · ใช้แก่นเวทมนตร์ + ชิ้นส่วนมอน + แท่งแร่ + ไม้
//  · ไม่มีชุดหินแล้ว (ระดับแรก = เซ็ตนักล่าเงา ทำจากแก่นเวท) · เครื่องมือใช้สูตรเดิม
//  · โต๊ะคราฟแยกแท็บ: ⚔️ อาวุธ · 🛡️ ชุด · ⛏️ เครื่องมือ · 🔮 ของใช้ (หลอมแก่นเวท / หินลับคม)
// =====================================================================
const SETN12=['นักล่าเงา','พฤกษาโบราณ','มังกรเพลิง','ผลึกน้ำแข็ง','เงาจันทรา','เทพตำนาน'];
const RARE12=[['ทั่วไป','#c8c8d8'],['ไม่ธรรมดา','#7ad86a'],['หายาก','#5ab4ff'],['ฮีโร่','#c88aff'],['ตำนาน','#ffb03a'],['เทพ','#ff5a8a']];
const OREN12=TNAMES.slice();               // ชื่อแร่เดิม (ใช้กับเครื่องมือ)
const WEAP12=['sword','staff','bow'],ARM12=['helm','chest','pants','arm','neck','ring'],TOOL12=['axe','pick'];
// ---------- เปลี่ยนชื่อระดับ + ชื่ออุปกรณ์ ----------
for(let t=0;t<6;t++)TNAMES[t]=SETN12[t];
for(const id in ITEMS){const it=ITEMS[id];if(!it||TOOL12.includes(it.kind)||!KINDS[it.kind])continue;it.name=KINDS[it.kind]+SETN12[it.tier]}
try{for(let n=1;n<=5;n++)if(SMQ[n])SMQ[n].n='ตำราช่าง: เซ็ต'+SETN12[n]}catch(e){}
try{STCH[2].d='ถึง Lv.5 และคราฟอาวุธเซ็ตพฤกษาโบราณขึ้นไป'}catch(e){}
// ---------- สีประจำเซ็ต (สลับเฉพาะตอนวาดชุด/อาวุธ — เครื่องมือ/แร่/แท่ง ยังเป็นสีเดิม) ----------
const SETPAL12=[
 {hi:'#9a9ab2',mid:'#3e3e52',lo:'#22222e',dk:'#0e0e16',gl:'#a070ff',gd:'#5a4a7a',gr:'#1a1420',pm:'#7a6a9a',cloth:'#2a2a3a',pants:'#1e1e2a',tr:'rgba(150,110,255,.55)'},
 {hi:'#d8f0b0',mid:'#6a9a4a',lo:'#3a5a28',dk:'#1a2a12',gl:'#8aff6a',gd:'#c8a04a',gr:'#3a2412',pm:'#9ad86a',cloth:'#4a7a3a',pants:'#3a5a2a',tr:'rgba(140,240,110,.55)'},
 {hi:'#ffd0a0',mid:'#d84a2a',lo:'#7a1a10',dk:'#3a0806',gl:'#ff7a2a',gd:'#e8a030',gr:'#2a0a06',pm:'#ff8a4a',cloth:'#b8341a',pants:'#7a2414',tr:'rgba(255,110,40,.6)'},
 {hi:'#ffffff',mid:'#a8dcf4',lo:'#5a8ab0',dk:'#20384a',gl:'#8ae8ff',gd:'#d8f4ff',gr:'#1a2a3a',pm:'#c8f0ff',cloth:'#9acde8',pants:'#6a9ab8',tr:'rgba(160,230,255,.6)'},
 {hi:'#e8e0ff',mid:'#7a68b8',lo:'#3a2e6a',dk:'#16102e',gl:'#d8c8ff',gd:'#c8c0e8',gr:'#140e24',pm:'#b8a8f0',cloth:'#4a3a7a',pants:'#2e2450',tr:'rgba(200,180,255,.6)'},
 {hi:'#fffbe8',mid:'#ffe08a',lo:'#c8902a',dk:'#5a3a08',gl:'#fff2a0',gd:'#ffffff',gr:'#3a2a10',pm:'#ffe8a0',cloth:'#fff4d8',pants:'#e8d8b0',tr:'rgba(255,240,170,.65)'}];
const ORIGT12=TIERS.map(o=>Object.assign({},o));let PALN12=0;
function palIn12(){if(PALN12++===0)for(let t=0;t<6;t++)Object.assign(TIERS[t],SETPAL12[t])}
function palOut12(){if(--PALN12===0)for(let t=0;t<6;t++)Object.assign(TIERS[t],ORIGT12[t])}
const withPal12=(fn,self,args)=>{palIn12();try{return fn.apply(self,args)}finally{palOut12()}};
for(const nm of ['eqSpr','EQCOL','drawNeck','drawRing','slashFx','magicCol7','paintStaff','paintBow','drawStaff','drawBow','paintStaffIcon','paintBowIcon','renderBuffs']){
 try{const f=window[nm]||eval('typeof '+nm+"==='function'?"+nm+':null');if(typeof f!=='function')continue;const w=function(){return withPal12(f,this,arguments)};eval(nm+'=w');window[nm]=w}catch(e){console.warn('[pal12]',nm,e.message)}}
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(TOOL12.includes(type)||!(WEAP12.includes(type)||ARM12.includes(type)))return _ti(type,tier,sz);return withPal12(_ti,this,arguments)}}
for(const k in SPRC)delete SPRC[k];for(const k in TICON)if(!/^(axe|pick)/.test(k))delete TICON[k];for(const k in IURL)if(/^item:/.test(k)&&!/^item:(axe|pick)/.test(k))delete IURL[k];
// ---------- วัตถุดิบใหม่: เศษแก่นเวทมนตร์ / แก่นเวทมนตร์ / หินลับคม ----------
INVMETA.essf=['เศษแก่นเวทมนตร์','ดรอปจากมอนทุกชนิด · 5 ชิ้น + แท่งหิน 1 หลอมเป็นแก่นเวทมนตร์ที่โต๊ะคราฟ'];
INVMETA.ess=['แก่นเวทมนตร์','วัตถุดิบหลักของชุดและอาวุธทุกเซ็ต'];
INVMETA.whet=['หินลับคม','ใช้แล้วโจมตี +12% นาน 10 นาที (ทำจากแท่งหิน)'];
for(const k of ['essf','ess','whet']){if(!INVORDER.includes(k))INVORDER.splice(INVORDER.indexOf('ingSt'),0,k);WT[k]=.1;if(inv[k]===undefined)inv[k]=0}
{const _mi=matIcon;matIcon=function(key){if(key!=='essf'&&key!=='ess'&&key!=='whet')return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';
  if(key==='whet'){const g=k.createLinearGradient(0,14,0,36);g.addColorStop(0,'#c8ccd6');g.addColorStop(1,'#6a6e7a');k.fillStyle=g;k.strokeStyle='#2a2c34';k.lineWidth=1.6;k.beginPath();k.moveTo(8,30);k.lineTo(14,16);k.lineTo(40,16);k.lineTo(34,30);k.closePath();k.fill();k.stroke();k.strokeStyle='rgba(255,255,255,.6)';k.beginPath();k.moveTo(16,19);k.lineTo(36,19);k.stroke();k.fillStyle='#ffd84a';k.font='bold 12px sans-serif';k.fillText('✦',30,42);return c}
  const big=key==='ess',g=k.createRadialGradient(24,22,1,24,24,big?17:11);g.addColorStop(0,'#ffffff');g.addColorStop(.35,'#d8a8ff');g.addColorStop(1,'rgba(110,40,220,.15)');
  if(big){k.fillStyle=g;k.beginPath();k.arc(24,24,17,0,7);k.fill();k.fillStyle='#8a4ad8';k.strokeStyle='#3a1478';k.lineWidth=1.6;k.beginPath();k.moveTo(24,10);k.lineTo(33,24);k.lineTo(24,38);k.lineTo(15,24);k.closePath();k.fill();k.stroke();k.fillStyle='rgba(255,255,255,.7)';k.beginPath();k.moveTo(24,13);k.lineTo(19,23);k.lineTo(24,22);k.closePath();k.fill()}
  else{k.fillStyle=g;k.fillRect(8,8,32,32);for(const [x,y,s] of [[18,22,1],[30,18,.8],[26,32,.9]]){k.fillStyle='#a86ae8';k.strokeStyle='#3a1478';k.lineWidth=1.2;k.beginPath();k.moveTo(x,y-7*s);k.lineTo(x+4*s,y);k.lineTo(x,y+7*s);k.lineTo(x-4*s,y);k.closePath();k.fill();k.stroke()}}
  return c}}
for(const k of ['essf','ess','whet'])try{const im=new Image();im.src=iconURL('mat:'+k);DROPIMG[k]=im}catch(e){}
// ดรอปเศษแก่นเวท: มอนในเหมือง/ดันเจี้ยน/หอคอย 30% · บอส 4–6 ชิ้น · สไลม์ทุ่งหญ้า 6%
{const _mk=mobKill;mobKill=function(m){const r=_mk(m);try{if(m.wb10)return r;const n=m.boss?4+Math.floor(Math.random()*3):m.elite?2:(Math.random()<.3?1:0);for(let i=0;i<n;i++)addDrop('essf',m.x,m.y)}catch(e){}return r}}
{const _dl=dropLoot;dropLoot=function(x,y,s){_dl(x,y,s);try{if(Math.random()<.06)addDrop('essf',x,y)}catch(e){}}}
// หินลับคม: โจมตี +12% 10 นาที
const WHET12={until:0};try{WHET12.until=+localStorage.getItem('fm_whet12')||0}catch(e){}
{const _am=atkMul;atkMul=function(){return _am()*(Date.now()<WHET12.until?1.12:1)}}
{const _ui=useItem;useItem=function(k){if(k!=='whet')return _ui(k);if((inv.whet|0)<=0)return;inv.whet--;WHET12.until=Math.max(Date.now(),WHET12.until)+600e3;try{localStorage.setItem('fm_whet12',WHET12.until)}catch(e){}
  try{refreshInv();recalcStats()}catch(e){}sfx('gem');say('🗡️ ลับคมอาวุธแล้ว! โจมตี +12% นาน '+Math.round((WHET12.until-Date.now())/60e3)+' นาที')}}
try{if(typeof QCONS!=='undefined'&&!QCONS.includes('whet'))QCONS.push('whet')}catch(e){}
// ---------- สูตรคราฟใหม่ของชุด/อาวุธ ----------
const PARTS12=[['gel','wing'],['shell','wing'],['pelt','dust'],['pelt','core'],['shell','dust'],['scale','core']];
const ING12=[null,'ingot','ingCu','ingAg','ingAu','ingDm'];
function recipe12(id){const it=ITEMS[id],t=it.tier,m=(RECIPE[it.kind]||{m:3}).m,w=WEAP12.includes(it.kind),[pa,pb]=PARTS12[t],R={};
 if(t===0){R.ess=Math.ceil(m/2);R[pa]=m*2;R[pb]=Math.ceil(m/2)}
 else{R[ING12[t]]=m;R.ess=Math.ceil(m/2)+t;R[pa]=m;R[pb]=Math.ceil(m/2)}
 if(w)R.wood=(R.wood||0)+2+t;R.coin=50*(t+1)*m;return R}
const hasAll12=R=>Object.entries(R).every(([k,v])=>(inv[k]|0)>=v);
function craftSet12(id){const it=ITEMS[id];if(!it)return;if(it.tier>SMITH.u){say('🔒 ยังตีเซ็ต'+SETN12[it.tier]+'ไม่เป็น — รับตำราจากช่างหนวดเหล็ก (Lv.'+SMQ[it.tier].lv+')');sfx('thud');return}
 const R=recipe12(id);if(!hasAll12(R)){say('วัตถุดิบไม่พอ: '+Object.entries(R).map(([k,v])=>MN(k)+' '+(inv[k]|0)+'/'+v).join(' · '));sfx('thud');return}
 try{if(bagCells().length>=bagSlotsMax()){noRoom('slot');return}}catch(e){}
 for(const [k,v] of Object.entries(R))inv[k]-=v;GEAR[id]=(GEAR[id]||0)+1;try{refreshInv();saveGame(true)}catch(e){}sfx('chest');try{anvilFx()}catch(e){}
 say('⚒️ คราฟ '+it.name+' ['+RARE12[it.tier][0]+'] สำเร็จ! เปิดกระเป๋า 🎒 เพื่อสวมใส่');try{questEv&&questEv('craft',id)}catch(e){}openForge('anvil')}
window.craftSet12=craftSet12;
window.fuseEss12=n=>{n=Math.max(1,n|0);const can=Math.min(n,Math.floor((inv.essf|0)/5),inv.ingSt|0);if(can<=0){say('ต้องใช้เศษแก่นเวท 5 + แท่งหิน 1 ต่อ 1 ชิ้น');sfx('thud');return}
 inv.essf-=can*5;inv.ingSt-=can;inv.ess=(inv.ess|0)+can;try{refreshInv();saveGame(true)}catch(e){}sfx('gem');say('🔮 หลอมแก่นเวทมนตร์ได้ '+can+' ชิ้น');openForge('anvil')};
window.makeWhet12=n=>{n=Math.max(1,n|0);const can=Math.min(n,Math.floor((inv.ingSt|0)/3));if(can<=0){say('ต้องใช้แท่งหิน 3 ต่อหินลับคม 1 ก้อน');sfx('thud');return}
 inv.ingSt-=can*3;inv.whet=(inv.whet|0)+can;try{refreshInv();saveGame(true)}catch(e){}sfx('chest');say('🗡️ ทำหินลับคมได้ '+can+' ก้อน');openForge('anvil')};
// ---------- หน้าโต๊ะคราฟใหม่ ----------
if(!FUI.cat)FUI.cat='weapon';
{const _ah=anvilHTML;anvilHTML=function(){if(FUI.tab!=='craft')return _ah();
  const cat=FUI.cat||'weapon',tab=(k,t)=>'<button class="mini sm'+(cat===k?' on':'')+'" onclick="FUI.cat=\''+k+'\';openForge(\'anvil\')">'+t+'</button>';
  let h='<b>🛠️ โต๊ะคราฟ — สร้างอุปกรณ์</b><div class="rw">'+tab('weapon','⚔️ อาวุธ')+tab('armor','🛡️ ชุด')+tab('tool','⛏️ เครื่องมือ')+tab('misc','🔮 ของใช้')+'</div>';
  if(cat==='tool'){const tt=FUI.ttier|0;h+='<div class="rw">'+OREN12.map((n,i)=>'<button class="mini sm'+(tt===i?' on':'')+'" style="border-bottom:4px solid '+ORIGT12[i].mid+';padding:5px 7px" onclick="FUI.ttier='+i+';openForge(\'anvil\')">'+n+'</button>').join('')+'</div>';
   const mk=MATKEY[tt];h+='<small>เครื่องมือใช้สูตรเดิม · '+MN(mk)+' มี '+(inv[mk]|0)+' · ไม้ มี '+(inv.wood|0)+(tt>SMITH.u?'<br>🔒 ต้องรับตำราช่างระดับนี้ก่อน':'')+'</small>';
   for(const k of TOOL12){const id=k+tt,it=ITEMS[id];if(!it)continue;const r=RECIPE[k],ok=tt<=SMITH.u&&(inv[mk]|0)>=need_m(k,tt)&&(inv.wood|0)>=r.wood,own=owned(id);
    h+='<button class="mini cr'+(ok?'':' no')+'" onclick="craftGear(\''+id+'\')">'+imgT('item:'+id,'lg')+it.name+(own?' (มี ×'+own+')':'')+'<small>'+it.stat+' · ใช้'+MN(mk)+' '+need_m(k,tt)+(r.wood?' + ไม้ '+r.wood:'')+'</small></button>'}
   return h+'<button class="mini" onclick="closeForge()">ปิด</button>'}
  if(cat==='misc'){const fe=Math.min(Math.floor((inv.essf|0)/5),inv.ingSt|0),wh=Math.floor((inv.ingSt|0)/3);
   h+='<small>เศษแก่นเวท '+(inv.essf|0)+' · แก่นเวทมนตร์ '+(inv.ess|0)+' · แท่งหิน '+(inv.ingSt|0)+' · หินลับคม '+(inv.whet|0)+'</small>';
   h+='<button class="mini cr'+(fe?'':' no')+'" onclick="fuseEss12(1)">'+imgT('mat:ess','lg')+'หลอมแก่นเวทมนตร์ ×1<small>เศษแก่นเวท 5 + แท่งหิน 1 (หลอมได้ '+fe+')</small></button>';
   if(fe>1)h+='<button class="mini cr" onclick="fuseEss12('+fe+')">'+imgT('mat:ess','lg')+'หลอมทั้งหมด ×'+fe+'<small>ใช้เศษ '+fe*5+' + แท่งหิน '+fe+'</small></button>';
   h+='<button class="mini cr'+(wh?'':' no')+'" onclick="makeWhet12(1)">'+imgT('mat:whet','lg')+'หินลับคม ×1<small>แท่งหิน 3 → โจมตี +12% 10 นาที (ใช้จากกระเป๋า/ช่องลัด)</small></button>';
   return h+'<button class="mini" onclick="closeForge()">ปิด</button>'}
  const t=FUI.tier|0,[rn,rc]=RARE12[t];
  h+='<div class="rw">'+SETN12.map((n,i)=>'<button class="mini sm'+(t===i?' on':'')+'" style="border-bottom:4px solid '+RARE12[i][1]+';padding:5px 7px" onclick="FUI.tier='+i+';openForge(\'anvil\')">'+n+'</button>').join('')+'</div>';
  if(t>SMITH.u)h+='<div style="padding:7px;border-radius:9px;background:rgba(255,80,60,.15);border:1px solid #ff8a6a;margin:4px 0">🔒 <b>ยังตีเซ็ต'+SETN12[t]+'ไม่ได้</b><br><small>คุยกับช่างหนวดเหล็ก → 📜 ตำราช่าง (ต้อง Lv.'+SMQ[t].lv+')</small></div>';
  h+='<small>เซ็ต<b style="color:'+rc+'">'+SETN12[t]+'</b> · ระดับ <b style="color:'+rc+'">'+rn+'</b> · วัสดุ: แก่นเวทมนตร์ '+(inv.ess|0)+(ING12[t]?' · '+MN(ING12[t])+' '+(inv[ING12[t]]|0):'')+' · '+MN(PARTS12[t][0])+' '+(inv[PARTS12[t][0]]|0)+' · '+MN(PARTS12[t][1])+' '+(inv[PARTS12[t][1]]|0)+'</small>';
  for(const k of (cat==='weapon'?WEAP12:ARM12)){const id=k+t,it=ITEMS[id];if(!it)continue;const R=recipe12(id),ok=t<=SMITH.u&&hasAll12(R),own=owned(id);
   h+='<button class="mini cr'+(ok?'':' no')+'" onclick="craftSet12(\''+id+'\')">'+imgT('item:'+id,'lg')+it.name+(own?' (มี ×'+own+')':'')+'<small>'+(it.stat||'')+'<br>'+Object.entries(R).map(([q,v])=>'<span style="color:'+((inv[q]|0)>=v?'#9fe89a':'#ff9a8a')+'">'+(q==='coin'?'🪙':MN(q))+' '+v+'</span>').join(' · ')+'</small></button>'}
  return h+'<button class="mini" onclick="closeForge()">ปิด</button>'}}

// =====================================================================
