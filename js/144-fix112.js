// fix112 (v4.95) — ⭐ อัปดาวสัตว์เลี้ยง/สัตว์ขี่ด้วยชิ้นส่วนที่ดรอป (เจ้าของขอ 2026-10-14 21:55 "เพิ่มการดรอปชิ้นส่วนสัตว์เลี้ยงและสัตว์ขี่เพื่อเอามาอัพดาวหาค่าสเตตัสเพิ่ม")
//  ต่อยอดดาวสัตว์เลี้ยงเดิมของ fix92 (E92.pets[k] = ดาว · ดาวละ ค่าพลังทุกอย่าง +2 เฉพาะตัวที่พาเดิน) → อัปได้ถึง ★10 ด้วย "ชิ้นส่วนสัตว์เลี้ยง"
//  สัตว์ขี่ (เดิมไม่มีดาว) → ดาวใหม่ใน fm_star112 · ดาวละ เลือด +2% · ความเร็วเดิน +1% · ดาเมจที่ได้รับ -0.6% (เฉพาะตัวที่เลือกขี่) ผ่าน PTX
//  ดรอป: มอนทั่วไป 2.5% · มอนในดันเจี้ยนนครวารี 5% · บอส 50% ครั้งละ 2–4 ชิ้น · ค่าอัปเพิ่มขึ้นทุกดาว (ต้องฟาร์มเยอะ) · เมนู ⭐ อัปดาว
try{
const MAXS112=10,COST112=[5,8,12,18,25,35,45,60,80,100],COIN112=s=>2000*(s+1)*(s+1);
const MS=(()=>{let d={};try{d=JSON.parse(localStorage.getItem('fm_star112')||'{}')||{}}catch(e){}return d})();
const svMS=()=>{try{localStorage.setItem('fm_star112',JSON.stringify(MS))}catch(e){}};
const mounts112=()=>{const L=(HOME.mounts||[]).slice();if(HOME.mount&&!L.includes(HOME.mount))L.push(HOME.mount);return L.filter(k=>ANIMS.some(a=>a.k===k&&a.mount))};
const pets112=()=>Object.keys((window.E92&&E92.pets)||{}).filter(k=>ANIMS.some(a=>a.k===k&&a.pet));
const nm112=k=>{const a=ANIMS.find(q=>q.k===k);return a?a.n:k};
const pStar=k=>(window.E92&&E92.pets[k])|0,mStar=k=>MS[k]|0;
// ---------- วัตถุดิบ ----------
INVMETA.pshard112=['ชิ้นส่วนสัตว์เลี้ยง','ใช้อัปดาวสัตว์เลี้ยง (ดาวละ ค่าพลังทุกอย่าง +2) · เมนู ⭐ อัปดาว'];
INVMETA.mshard112=['ชิ้นส่วนสัตว์ขี่','ใช้อัปดาวสัตว์ขี่ (ดาวละ เลือด +2% · เดินเร็ว +1% · ดาเมจที่ได้รับ -0.6%) · เมนู ⭐ อัปดาว'];
try{const _mi=matIcon;matIcon=function(key){if(key!=='pshard112'&&key!=='mshard112')return _mi.apply(this,arguments);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');const pet=key==='pshard112';
 k.lineJoin='round';const g=k.createLinearGradient(8,6,40,42);g.addColorStop(0,'#ffffff');g.addColorStop(.5,pet?'#ffb0d8':'#8ad8ff');g.addColorStop(1,pet?'#c83a8a':'#2a6ac8');k.fillStyle=g;k.strokeStyle='#1a0a1a';k.lineWidth=2;
 if(pet){// อุ้งเท้า
  k.beginPath();k.ellipse(24,30,11,9,0,0,7);k.fill();k.stroke();for(const [x,y] of [[12,17],[20,11],[28,11],[36,17]]){k.beginPath();k.ellipse(x,y,4.4,5.4,0,0,7);k.fill();k.stroke()}}
 else{// เกือกม้า
  k.lineWidth=9;k.strokeStyle='#1a0a1a';k.beginPath();k.arc(24,22,13,Math.PI*.15,Math.PI*.85,true);k.stroke();k.lineWidth=6;k.strokeStyle=g;k.stroke();k.fillStyle='#fff';for(const a of [-.6,-1.2,-1.9,-2.5]){k.beginPath();k.arc(24+Math.cos(a)*13,22+Math.sin(a)*13,1.4,0,7);k.fill()}}
 k.fillStyle='#ffe08a';k.font='bold 14px system-ui';k.fillText('★',30,44);return c};window.matIcon=matIcon}catch(e){}
for(const k of ['pshard112','mshard112'])try{if(window.INVORDER&&!INVORDER.includes(k))INVORDER.push(k)}catch(e){}
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)||[]}catch(e){}const k=String(key).replace(/^mat:/,'');if(k==='pshard112'||k==='mshard112')S=[['⚔️','ดรอปจากมอนทุกแมพ 2.5% (ดันเจี้ยนนครวารี 5%)'],['👑','บอส 50% ครั้งละ 2–4 ชิ้น']];return S};window.src7=src7}
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);const r=_mk.apply(this,arguments);try{if(m&&!was&&m.dead&&!m.s112&&(typeof W33==='undefined'||W33.mode==='solo'||m.my33>0)){m.s112=1;
  const dg=!!(window.dgOf96&&dgOf96());if(m.boss){if(Math.random()<.5){const n=2+(Math.random()*3|0);for(let i=0;i<n;i++)addDrop(Math.random()<.5?'pshard112':'mshard112',m.x+(Math.random()-.5)*20,m.y)}}
  else if(Math.random()<(dg?.05:.025))addDrop(Math.random()<.5?'pshard112':'mshard112',m.x,m.y)}}catch(e){}return r};window.mobKill=mobKill}
// ---------- ค่าพลังสัตว์ขี่ → PTX ----------
const mfx112=s=>({hp:.02*s,spd:.01*s,dr:.006*s});
{const _p=PTX;PTX=function(){const o=_p.apply(this,arguments);try{if(!o)return o;const s=HOME.mount?mStar(HOME.mount):0,key=(HOME.mount||'')+':'+s;if(o.__k112!==key){const old=o.__a112||{};for(const k in old)o[k]=(o[k]||0)-old[k];const W=s?mfx112(s):{};for(const k in W)o[k]=(o[k]||0)+W[k];o.__a112=W;o.__k112=key}}catch(e){}return o};window.PTX=PTX}
// ---------- หน้าต่างอัปดาว ----------
const W112=mk6('st112');
const css=document.createElement('style');css.textContent='#st112 .w{width:min(600px,97%);height:auto;max-height:95%}#st112 .bd{display:block!important;overflow:auto;padding:10px 12px}#st112 h4{margin:8px 0 5px;color:#ffd86a;font-size:13px}#st112 .r112{display:flex;align-items:center;gap:10px;background:#1a1426;border:1px solid #e8c14a33;border-radius:10px;padding:8px 10px;margin-bottom:6px}#st112 .r112.on{border-color:#7ed957}#st112 .r112 .n{flex:1}#st112 .r112 .s{color:#ffd86a;letter-spacing:1px}#st112 .r112 small{display:block;color:#aaa;font-size:11px}#st112 .bd button{padding:8px 12px;border-radius:9px;border:0;font-weight:800;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06;min-width:96px}#st112 .bd button:disabled{background:#3a3450;color:#888}#st112 .hv{display:flex;gap:12px;align-items:center;margin-bottom:6px;font-size:13px}#st112 .hv img{width:26px;height:26px;vertical-align:middle}';document.head.appendChild(css);
const stars112=s=>'★'.repeat(s)+'☆'.repeat(Math.max(0,MAXS112-s));
function row112(kind,k){const s=kind==='p'?pStar(k):mStar(k),on=kind==='p'?HOME.pet===k:HOME.mount===k,mx=s>=MAXS112,need=mx?0:COST112[s],coin=mx?0:COIN112(s),mat=kind==='p'?'pshard112':'mshard112',ok=!mx&&(inv[mat]|0)>=need&&inv.coin>=coin;
 const bon=kind==='p'?'ค่าพลังทุกอย่าง +'+(2*s):'เลือด +'+(2*s)+'% · เดินเร็ว +'+s+'% · ดาเมจที่ได้รับ -'+(0.6*s).toFixed(1)+'%';
 return '<div class="r112'+(on?' on':'')+'"><div class="n"><b>'+nm112(k)+(on?' ✅':'')+'</b> <span class="s">'+stars112(s)+'</span><small>ตอนนี้: '+(s?bon:'ยังไม่มีโบนัส')+(on?'':' · (ได้โบนัสเมื่อ'+(kind==='p'?'พาเดิน':'เลือกขี่')+')')+'</small>'+(mx?'<small>⭐ ดาวเต็มแล้ว</small>':'<small>อัปต้องใช้: '+MN(mat)+' ×'+need+' · 🪙 '+coin.toLocaleString('en-US')+'</small>')+'</div><button '+(ok?'':'disabled')+' onclick="up112(\''+kind+'\',\''+k+'\')">'+(mx?'ดาวเต็ม':'⭐ อัปดาว')+'</button></div>'}
function render112(){let h='<div class="w"><div class="hd"><b>⭐ อัปดาวสัตว์เลี้ยง / สัตว์ขี่</b><button onclick="p6close(gid(\'st112\'))">✕</button></div><div class="bd"><small style="color:#aaa">ฟาร์มชิ้นส่วนจากมอนและบอส แล้วอัปดาวได้สูงสุด ★'+MAXS112+' · โบนัสใช้กับตัวที่พาเดิน/เลือกขี่</small>'
 +'<div class="hv"><span><img src="'+iconURL('mat:pshard112')+'"> '+MN('pshard112')+' <b>'+(inv.pshard112|0)+'</b></span><span><img src="'+iconURL('mat:mshard112')+'"> '+MN('mshard112')+' <b>'+(inv.mshard112|0)+'</b></span><span>🪙 <b>'+(inv.coin|0).toLocaleString('en-US')+'</b></span></div>';
 const P1=pets112(),M1=mounts112();h+='<h4>🐾 สัตว์เลี้ยง</h4>'+(P1.length?P1.map(k=>row112('p',k)).join(''):'<small>ยังไม่มีสัตว์เลี้ยง — ซื้อที่ร้านสัตว์ หรือฟักไข่ที่เมนู 🌠 ตำนาน</small>');
 h+='<h4>🐎 สัตว์ขี่</h4>'+(M1.length?M1.map(k=>row112('m',k)).join(''):'<small>ยังไม่มีสัตว์ขี่ — ซื้อที่ร้านสัตว์</small>');W112.innerHTML=h+'</div></div>'}
window.up112=(kind,k)=>{const s=kind==='p'?pStar(k):mStar(k);if(s>=MAXS112)return;const need=COST112[s],coin=COIN112(s),mat=kind==='p'?'pshard112':'mshard112';
 if((inv[mat]|0)<need||inv.coin<coin){say('ของไม่พอ');sfx('thud');return}inv[mat]-=need;inv.coin-=coin;
 if(kind==='p'){E92.pets[k]=s+1;try{save92()}catch(e){}try{if(HOME.pet===k&&window.pgDirty92)pgDirty92()}catch(e){}}else{MS[k]=s+1;svMS()}
 try{ptDirty();applyBonus();recalcStats();refreshInv();saveGame(false)}catch(e){}sfx('chest');try{flash('#ffe08a',.3);banner('⭐ อัปดาวสำเร็จ!',nm112(k)+' '+'★'.repeat(s+1),'green')}catch(e){say('⭐ '+nm112(k)+' ★'+(s+1))}render112()};
window.open112=()=>{render112();p6open(W112)};
try{if(!PM7.some(m=>m[1]==='อัปดาว')){const at=PM7.findIndex(m=>m[1]==='คุณสมบัติ');PM7.splice(at<0?PM7.length:at+1,0,['⭐','อัปดาว',()=>open112()]);pmRender7()}}catch(e){}
// หน้าคุณสมบัติรวม (fix111)
(window.EXTRA111=window.EXTRA111||[]).push(()=>{const a=[];if(HOME.pet)a.push('🐾 '+nm112(HOME.pet)+' ★'+pStar(HOME.pet)+' — ค่าพลังทุกอย่าง +'+2*pStar(HOME.pet));if(HOME.mount)a.push('🐎 '+nm112(HOME.mount)+' ★'+mStar(HOME.mount)+(mStar(HOME.mount)?' — เลือด +'+2*mStar(HOME.mount)+'% · เดินเร็ว +'+mStar(HOME.mount)+'% · ดาเมจที่ได้รับ -'+(0.6*mStar(HOME.mount)).toFixed(1)+'%':''));return {n:'⭐ ดาวสัตว์เลี้ยง/สัตว์ขี่',txt:a.join('<br>')||'— ยังไม่มี'}});
window.MS112=MS;
}catch(e){console.warn('fix112',e)}
