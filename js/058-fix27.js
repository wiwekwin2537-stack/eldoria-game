// fix27.js (v4.35) — อาวุธประจำอาชีพ 11 สาย · คลาสเดิมเหลือ 3 สกิล (นักเวท = ดาเมจเวทล้วน)
// =====================================================================
// ---------- 1) คลาสเดิมเหลือ 3 สกิล ----------
for(const k of ['sword','mage','archer'])if(CSKILLS[k]&&CSKILLS[k].length>3)CSKILLS[k].length=3;
for(const k in SKBAR)SKBAR[k]=[0,1,2,3];try{localStorage.setItem('fm_skbar',JSON.stringify(SKBAR))}catch(e){}
{const _u=updSkBar;updSkBar=function(){_u();try{const L=CSKILLS[P.cls];if(!L||L.length<=3)sk5.style.display='none'}catch(e){}}}
CLS.mage.d='จอมเวทดาเมจเวทล้วน — ลูกไฟ/สายฟ้า/อุกกาบาต ระเบิดวงกว้าง ดาเมจสกิลแรงที่สุด (ไม่มีสมุน) · ดาเมจจาก INT';
CLS.mage.pas='INT +4+Lv/2 · มานาฟื้นเร็ว ×2.5 · ดาเมจเวท +15%';
CLS.sword.d='อัศวินดาบ ประชิดตัว ถึก เลือดเยอะ ฟันวงกว้าง · ดาเมจจาก STR';CLS.archer.d='นักธนูยิงไกลและเร็ว ยิงหลายดอก คริติคอลสูง · ดาเมจจาก AGI';
// พาสซีฟ Lv.80 / Lv.120 ให้คลาสเดิมเท่ากับคลาสใหม่
PASSIVE.sword.push({lv:80,n:'ราชันย์สงคราม',d:'STR +20 · VIT +10',st:{str:20,vit:10}},{lv:120,n:'เทพสงคราม',d:'STR +28 · VIT +18',st:{str:28,vit:18}});
PASSIVE.mage.push({lv:80,n:'มหาจอมเวท',d:'INT +22 · VIT +6',st:{int:22,vit:6}},{lv:120,n:'ปราชญ์นิรันดร์',d:'INT +30 · VIT +14',st:{int:30,vit:14}});
PASSIVE.archer.push({lv:80,n:'ราชันย์ธนู',d:'AGI +22 · END +6',st:{agi:22,end:6}},{lv:120,n:'เนตรเทพ',d:'AGI +28 · VIT +14',st:{agi:28,vit:14}});
// ---------- 2) อาวุธประจำอาชีพ ----------
// [ชื่อ, perk(fx แบบเดียวกับต้นไม้พาสซีฟ), สีเรือง]
const CW27={sword:['ดาบราชันย์',{hp:.06,dmg:.04},'#ffd23a'],mage:['คทาอาคม',{skill:.08},'#c88aff'],archer:['ธนูพรานเงา',{crit:.04,aspd:.04},'#7ae08a'],
 ninja:['คาตานะ',{crit:.05},'#8a9aff'],sniper:['ไรเฟิลซุ่มยิง',{crit:.03,skill:.05},'#ffd23a'],paladin:['ดาบศักดิ์สิทธิ์',{dr:.05,hp:.03},'#ffe9a0'],
 cleric:['คทาแสงสวรรค์',{hpr:.004,mpr:.2},'#bff0ff'],necro:['เคียวมรณะ',{mdmg:.15,hpr:.002},'#7affb0'],monk:['สนับมือวัชระ',{aspd:.08},'#ffb46a'],
 dragoon:['ทวนมังกร',{dmg:.06},'#ff6a5a'],summoner:['ไม้เท้าเขาสัตว์',{mdmg:.15,mdur:.2},'#9adf6a']};
const cwId27=(c,t)=>'cw_'+c+t;
for(const c in CW27){if(!CLS[c]||!NEEDW[c])continue;const W=CW27[c],kind=NEEDW[c];for(let t=0;t<TNAMES.length;t++){const B=ITEMS[kind+t];if(!B)continue;const id=cwId27(c,t);
 ITEMS[id]=Object.assign({},B,{id,kind,tier:t,cls:c,name:W[0]+TNAMES[t],stat:B.stat+' · ✨ '+desc26(W[1])+' (เฉพาะ'+CLS[c].n+')'})}}
const cwOf27=()=>{const it=ITEMS[P.armor.sword];return it&&it.cls?it:null};
window.cwOk25=()=>{const it=cwOf27();return !!(it&&it.cls===P.cls)};
// perk เข้า PTX (คิดเฉพาะอาชีพที่ตรง)
{const _px=PTX;PTX=function(){if(_ptx)return _ptx;const o=_px();const it=cwOf27();if(it&&it.cls===P.cls){const f=CW27[it.cls][1];for(const k in f)o[k]=(o[k]||0)+f[k]}return o}}
// สวมได้เฉพาะอาชีพของมัน
{const _eq=equipItem;equipItem=function(id){const it=ITEMS[id];if(it&&it.cls&&it.cls!==P.cls){say('🔒 '+it.name+' ใช้ได้เฉพาะ'+CLS[it.cls].n+'เท่านั้น');sfx('thud');return}const r=_eq(id);try{ptDirty()}catch(e){}return r};window.equipItem=equipItem}
{const _ue=unequip;unequip=function(k){const r=_ue(k);try{ptDirty()}catch(e){}return r};window.unequip=unequip}
// หลอม (อาวุธปกติ ↔ อาวุธประจำอาชีพ) ที่ปรมาจารย์อาชีพ — ระดับตีบวกติดไปด้วย
const cwCost27=t=>({coin:400*(t+1),ess:2+t});
// v4.42: นับเศษแก่นเวท (essf) ที่ดรอปจากมอน + แก่นเวทที่แลกมา (ess) — เดิมเช็กแค่ ess ทำให้กดหลอมไม่ได้ทั้งที่มีเศษครบ
const cwEss27=()=>(inv.essf|0)+(inv.ess|0);
function cwForge27(){const id=P.armor.sword,it=ITEMS[id];if(!it){say('ต้องถืออาวุธก่อน');return}
 if(it.cls){const base=it.kind+it.tier;P.armor.sword=base;ENH[base]=Math.max(ENH[base]|0,ENH[id]|0);syncSword();ptDirty();refreshInv();say('🔁 แปลง'+it.name+'กลับเป็น'+ITEMS[base].name+'แล้ว');sfx('ui');openClassMenu();return}
 if(P.cls==='none'||it.kind!==NEEDW[P.cls]){say('ต้องถือ'+WNAME[NEEDW[P.cls]]+'ก่อน');sfx('thud');return}
 const C=cwCost27(it.tier),hv=cwEss27();if(inv.coin<C.coin||hv<C.ess){say('ต้องใช้ '+C.coin+'🪙 + เศษแก่นเวท '+C.ess+' ชิ้น (มี '+(inv.coin|0)+'🪙 · เศษแก่นเวท '+hv+')');sfx('thud');return}
 inv.coin-=C.coin;{const f=Math.min(inv.essf|0,C.ess);inv.essf=(inv.essf|0)-f;inv.ess=(inv.ess|0)-(C.ess-f)}const nid=cwId27(P.cls,it.tier);ENH[nid]=Math.max(ENH[nid]|0,ENH[id]|0);P.armor.sword=nid;syncSword();ptDirty();refreshInv();try{saveGame(true)}catch(e){}
 sfx('chest');sfx('warp');flash(CW27[P.cls][2],.3);say('⚒️ ได้รับ '+ITEMS[nid].name+'! — '+desc26(CW27[P.cls][1]));chatAnn((P.name||'ผู้กล้า')+' หลอม '+ITEMS[nid].name+' สำเร็จ!');openClassMenu()}
window.cwForge27=cwForge27;
{const _oc=openClassMenu;openClassMenu=function(){_oc();try{if(P.cls==='none'||shopEl.hidden)return;const it=ITEMS[P.armor.sword],W=CW27[P.cls];if(!W)return;let h='<div class="cw27"><div class="cwi"><img src="'+iconURL('item:'+cwId27(P.cls,it&&!it.cls?it.tier:(it?it.tier:0)))+'"></div><div><b style="color:'+W[2]+'">⚒️ อาวุธประจำอาชีพ: '+W[0]+'</b><small>หลอมอาวุธ'+WNAME[NEEDW[P.cls]]+'ที่ถืออยู่ให้เป็น'+W[0]+' (ระดับเดิม · ตีบวกติดไปด้วย) — หน้าตาเฉพาะอาชีพ + '+desc26(W[1])+'</small>';
  if(it&&it.cls===P.cls)h+='<small style="color:#8fe08a">✓ ถือ'+it.name+'อยู่</small>';
  else if(it&&it.cls)h+='<button class="mini" onclick="cwForge27()">🔁 แปลง'+it.name+'กลับเป็นอาวุธปกติ (ฟรี)</button>';
  else if(it&&it.kind===NEEDW[P.cls]){const C=cwCost27(it.tier),ok=inv.coin>=C.coin&&cwEss27()>=C.ess;h+='<small>มี '+(inv.coin|0)+'🪙 · เศษแก่นเวท '+cwEss27()+'</small><button class="mini'+(ok?' ok':'')+'" onclick="cwForge27()">⚒️ หลอม '+it.name+' → '+W[0]+TNAMES[it.tier]+' ('+C.coin+'🪙 · เศษแก่นเวท '+C.ess+')</button>'}
  else h+='<small style="color:#ff9a7a">ถือ'+WNAME[NEEDW[P.cls]]+'ก่อนจึงจะหลอมได้</small>';
  h+='</div></div>';const b=shopEl.querySelector('small');if(b)b.insertAdjacentHTML('afterend',h)}catch(e){console.warn('[cw27]',e)}};window.openClassMenu=openClassMenu}
{const st=document.createElement('style');st.textContent='.cw27{display:flex;gap:10px;align-items:center;margin:6px 0 8px;padding:8px 10px;border-radius:12px;background:linear-gradient(90deg,rgba(255,210,80,.14),rgba(255,255,255,.03));border:1px solid rgba(255,210,80,.45);text-align:left}.cw27 .cwi img{width:48px;height:48px;border-radius:10px;background:#16121f;box-shadow:0 0 10px rgba(255,210,80,.5)}.cw27 b{display:block;font-size:13px}.cw27 small{display:block;font-size:11px;opacity:.85;margin:2px 0 4px}';document.head.appendChild(st)}
// ---------- 3) หน้าตาอาวุธ ----------
// ปืนไรเฟิล (ไอคอน)
function rifle27(k,Q){k.fillStyle='#3a2414';k.strokeStyle='#100a06';k.lineWidth=1;k.beginPath();k.moveTo(-14,-3);k.lineTo(0,-3);k.lineTo(0,3);k.lineTo(-10,6);k.lineTo(-16,4);k.closePath();k.fill();k.stroke();
 const g=k.createLinearGradient(0,-2,0,2);g.addColorStop(0,'#5a5a6a');g.addColorStop(.5,Q.hi);g.addColorStop(1,'#2a2a34');k.fillStyle=g;k.fillRect(0,-2.4,26,4.2);k.strokeRect(0,-2.4,26,4.2);k.fillStyle='#1a1a22';k.fillRect(26,-1.6,6,2.6);
 k.fillStyle='#22222a';k.fillRect(4,-7,12,3.4);k.fillStyle=Q.gl;k.beginPath();k.arc(16,-5.3,1.8,0,7);k.fill();k.fillStyle='#14141a';k.fillRect(6,2,2,5)}
const FLT27={sword:'grayscale(1) sepia(1) saturate(3.2) brightness(1.18)',mage:'grayscale(1) sepia(1) saturate(3) hue-rotate(225deg) brightness(1.1)',archer:'grayscale(1) sepia(1) saturate(2.6) hue-rotate(65deg) brightness(1.05)'};
const CWI27={};
function cwIcon27(it){const key=it.id;if(CWI27[key])return CWI27[key];const c=document.createElement('canvas');c.width=c.height=64;const k=c.getContext('2d'),W=CW27[it.cls];
 if(FLT27[it.cls]){k.filter=FLT27[it.cls];k.drawImage(_tiBase27(it.kind,it.tier),0,0,64,64);k.filter='none'}
 else{const sv=P.tier.sword,sc=P.cls;P.tier.sword=it.tier;P.cls=it.cls;try{k.save();if(it.cls==='sniper'){k.translate(14,46);k.rotate(-.78);k.scale(1.45,1.45);rifle27(k,TIERS[it.tier]||TIERS[0])}
   else if(it.cls==='monk'){k.translate(32,34);knuckle27(k,TIERS[it.tier]||TIERS[0])}
   else{const s={ninja:1.25,paladin:1.2,dragoon:.86,monk:2.4,cleric:1.05,necro:1.0,summoner:1.05}[it.cls]||1;k.translate(32,it.cls==='monk'?34:it.cls==='dragoon'?52:48);if(it.cls!=='monk')k.rotate(.6);k.scale(s,s);wpn25(it.cls,k)}k.restore()}catch(e){}P.tier.sword=sv;P.cls=sc}
 // ตราอาชีพมุมขวาล่าง
 k.save();k.globalCompositeOperation='destination-over';const g=k.createRadialGradient(32,32,4,32,32,34);g.addColorStop(0,W[2]+'55');g.addColorStop(1,W[2]+'00');k.fillStyle=g;k.fillRect(0,0,64,64);k.restore();
 k.font='14px "Noto Color Emoji","Apple Color Emoji",sans-serif';k.textAlign='right';k.textBaseline='bottom';k.fillText(CLS[it.cls].e,63,64);return CWI27[key]=c}
function knuckle27(k,Q){k.save();k.globalCompositeOperation='lighter';const g=k.createRadialGradient(0,0,2,0,0,26);g.addColorStop(0,'rgba(255,190,90,.55)');g.addColorStop(1,'rgba(255,190,90,0)');k.fillStyle=g;k.fillRect(-30,-30,60,60);k.restore();
 k.lineJoin='round';k.fillStyle=Q.mid;k.strokeStyle='#1a1208';k.lineWidth=2;k.beginPath();k.moveTo(-20,-4);k.quadraticCurveTo(0,-16,20,-4);k.lineTo(18,12);k.quadraticCurveTo(0,22,-18,12);k.closePath();k.fill();k.stroke();
 for(let i=0;i<4;i++){const x=-13.5+i*9;k.fillStyle='#16121f';k.beginPath();k.arc(x,-3,3.6,0,7);k.fill();k.strokeStyle=Q.hi;k.lineWidth=2;k.stroke()}
 k.fillStyle=Q.hi;k.globalAlpha=.6;k.fillRect(-14,6,28,2.5);k.globalAlpha=1;k.fillStyle='#ffb46a';k.beginPath();k.arc(0,12,2.6,0,7);k.fill()}
const _tiBase27=(t,tier)=>toolIcon(t,tier,64);
{const _iu=iconURL;iconURL=function(key){if(typeof key==='string'&&key.startsWith('item:')){const it=ITEMS[key.slice(5)];if(it&&it.cls){if(IURL[key])return IURL[key];try{return IURL[key]=cwIcon27(it).toDataURL()}catch(e){}}}return _iu(key)};window.iconURL=iconURL}
// คลาสเดิม (ดาบ/คทา/ธนู): ใช้ภาพเดิมแต่ย้อมสีประจำอาวุธ + เรืองแสง
const cwOld27=()=>{const it=cwOf27();return it&&it.cls===P.cls&&FLT27[it.cls]?it:null};
function withFlt27(fn,self,args){const it=cwOld27();if(!it)return fn.apply(self,args);ctx.save();ctx.filter=FLT27[it.cls];try{return fn.apply(self,args)}finally{ctx.restore()}}
{const _ts=toolSpr;toolSpr=function(){return withFlt27(_ts,this,arguments)}}
{const _bs=backSword;backSword=function(){return withFlt27(_bs,this,arguments)}}
{const _db=drawBow6;drawBow6=function(){return withFlt27(_db,this,arguments)}}
// คทาประจำอาชีพบนหลัง (นักบวช/เนโคร/ผู้อัญเชิญ)
const BKS27={};
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(window.BACKSW7>0&&type==='staff'&&STAFF25.has(P.cls)&&cwOk25()){const key=P.cls+'|'+(tier|0);let c=BKS27[key];if(!c){c=document.createElement('canvas');c.width=c.height=64;const k=c.getContext('2d');const sv=P.tier.sword;P.tier.sword=tier|0;try{k.translate(32,54);k.scale(.95,.95);wpn25(P.cls,k)}catch(e){}P.tier.sword=sv;BKS27[key]=c}return c}return _ti(type,tier,sz)}}
// ---------- 4) คืนไอเท็มที่ถูกพักไว้ตอนโหลด (ไอเท็ม Lv.105+/อาวุธอาชีพ) ----------
window.__CWLOAD27=1;

// =====================================================================
