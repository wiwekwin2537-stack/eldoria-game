// fix115 (v4.96) — ตามที่เจ้าของสั่ง 2026-10-14 22:28
//  A) 📊 หน้าคุณสมบัติบอกค่าครบทุกตัว (แสดงแม้เป็น 0) + "ความเสียหายคริ" (เดิมมีในระบบ CRITD แต่ไม่แสดง/ไม่มีที่เพิ่ม) → เพิ่มออป cdmg (fix111) และให้ PTX().cdmg เข้า CRITD
//  B) ⭐ ดาวสัตว์เลี้ยง/สัตว์ขี่ 4 ขั้น: ทองแดง → เงิน → เขียว → แดง ขั้นละ 5 ดาว (รวม 20 ระดับ) · สัตว์ทุกตัวที่ซื้อ/ฟักแล้วอัปได้ทุกตัว (เดิมเห็นเฉพาะบางตัว)
//     ชิ้นส่วน 8 ชนิด ตามขั้น (สัตว์เลี้ยง 4 + สัตว์ขี่ 4) ดรอปตามเลเวลมอน: ทองแดง Lv.1–49 · เงิน 50–99 · เขียว 100–149 · แดง 150+ / ดันเจี้ยนนครวารี
//     (ค่าดาวเก็บที่เดิม: สัตว์เลี้ยง E92.pets[k] · สัตว์ขี่ MS112[k] — ระดับ 1–20 · โบนัสต่อระดับเหมือนเดิม)
//  C) เนื้อเรื่องที่พูดถึงแท่นผนึก → "หอผนึกอสูร" (บ้านหลังคาม่วงแถวบนของเมือง — fix113 ปรับ v4.96)
try{
// ---------- A) ความเสียหายคริ ----------
try{FXL26.cdmg=['ความเสียหายคริ +',1]}catch(e){}
{const _cd=window.CRITD;window.CRITD=()=>{let v=0;try{v=_cd?_cd():0}catch(e){}try{v+=PTX().cdmg||0}catch(e){}return v}}
const pct=v=>(v*100).toFixed(1)+'%';
window.open111=()=>{try{ptDirty();applyBonus();recalcStats()}catch(e){}const x=PTX();let pa={};try{pa=PAX()}catch(e){}
 const cell=(n,v,s)=>'<div class="c111"><small>'+n+'</small><b>'+v+'</b>'+(s?'<small>'+s+'</small>':'')+'</div>';
 let atk=0,def=0,cc=0,cd=0;try{atk=clsAtk()}catch(e){try{atk=ATK()}catch(e2){}}try{def=armorDef()}catch(e){}try{cc=critCh()}catch(e){}try{cd=1.8+(window.CRITD?CRITD():0)}catch(e){cd=1.8}
 const ab=P.ab||{};const base=k=>(P.stats[k]|0)-(ab[k]|0);
 let h='<div class="w"><div class="hd"><b>📊 คุณสมบัติตัวละคร</b><button onclick="p6close(gid(\'cs111\'))">✕</button></div><div class="bd"><small style="color:#aaa">รวมค่าจากทุกระบบ (ต้นไม้พาสซีฟ · ออปอุปกรณ์ · โบนัสชุด · ตีบวก · ดาวสัตว์ · ของสวมสัตว์เลี้ยง · บัฟ) — ใช้เทียบบิลด์</small>';
 h+='<h4>⚔️ พลังหลัก</h4><div class="g111">'+cell('พลังโจมตี',atk)+cell('ป้องกัน',def)+cell('เลือดสูงสุด',BAL.hp)+cell('มานาสูงสุด',BAL.mp)+cell('เลเวล','Lv.'+P.lv)+cell('อาชีพ',(CLS[P.cls]||{}).n||'ยังไม่มี')+'</div>';
 h+='<h4>💪 ค่าพลัง (พื้นฐาน + โบนัส)</h4><div class="g111">'+['str','vit','agi','int','end'].map(k=>cell(STN_TH[k],P.stats[k]|0,base(k)+' + '+(ab[k]|0)+' · '+({str:'โจมตีกายภาพ',vit:'เลือด',agi:'ธนู/คริ',int:'เวท/มานา',end:'แรง/วิ่ง'})[k])).join('')+'</div>';
 h+='<h4>🎯 การโจมตี</h4><div class="g111">'+cell('โอกาสคริ',pct(cc))+cell('ความเสียหายคริ',Math.round(cd*100)+'%','ตีคริ = ดาเมจ ×'+cd.toFixed(2))+cell('ดาเมจเพิ่ม','+'+pct(x.dmg||0))+cell('ดาเมจสกิล','+'+pct(x.skill||0))+cell('ตีเร็ว','+'+pct(x.aspd||0))+cell('คูลดาวน์สกิล','-'+pct(x.cdr||0))+cell('สกิลใช้มานา','-'+pct(x.mpc||0))+cell('พื้นที่สกิล','+'+pct(x.area||0))
  +cell('กระสุนเพิ่ม','+'+(x.proj|0)+' ลูก')+cell('โซ่/วาปเพิ่ม','+'+(x.chain|0)+' ครั้ง')+cell('เจาะเกราะ','+'+pct(pa.pen||0))+'</div>';
 h+='<h4>🐾 สมุน</h4><div class="g111">'+cell('สมุนเพิ่ม','+'+(x.minion|0)+' ตัว')+cell('ดาเมจสมุน','+'+pct(x.mdmg||0))+cell('เวลาสมุน','+'+pct(x.mdur||0))+'</div>';
 h+='<h4>🛡️ การเอาตัวรอด</h4><div class="g111">'+cell('ดาเมจที่ได้รับ','-'+pct((x.dr||0)+(pa.dr||0)))+cell('เลือดสูงสุดเพิ่ม','+'+pct(x.hp||0))+cell('ฟื้นเลือด',((x.hpr||0)*100).toFixed(1)+'%/วิ')+cell('มานาฟื้น','+'+pct(x.mpr||0))+cell('ต้านคริ','+'+pct(pa.cres||0))+cell('ความเร็วเดิน','+'+pct(x.spd||0))+cell('แรงฟื้น','+'+pct(x.far||0))+cell('ใช้แรง','-'+pct(x.fac||0))+'</div>';
 if(pa.crit||pa.cdmg||pa.dmg)h+='<h4>🐶 ของสวมสัตว์เลี้ยง</h4><div class="g111">'+cell('คริ','+'+pct(pa.crit||0))+cell('ความเสียหายคริ','+'+pct(pa.cdmg||0))+cell('ดาเมจ','+'+pct(pa.dmg||0))+'</div>';
 h+='<h4>📦 มาจากไหน</h4><div class="src111">';const SL=['sword','helm','chest','pants','arm','neck','ring'],ol=[];
 for(const s of SL){const id=P.armor[s];if(!id||!ITEMS[id])continue;const L=(window.ST111&&ST111.o[id])||[];ol.push('• '+ITEMS[id].name+(ENH[id]?' +'+ENH[id]:'')+(L.length&&window.line111?' — '+L.map(line111).join(', '):''))}
 h+='<b>🎲 ออปอุปกรณ์ที่ใส่</b><br>'+(ol.join('<br>')||'— ยังไม่ได้ใส่อุปกรณ์');
 try{const c7=setCount7();const ts=Object.keys(c7).filter(t=>c7[t]>=1).sort((a,b)=>c7[b]-c7[a]).slice(0,2);h+='<br><b>🛡️ โบนัสชุด</b>'+ts.map(setTxt111).join('')}catch(e){}
 for(const f of (window.EXTRA111||[])){try{const r=f();if(r)h+='<br><b>'+r.n+'</b><br>'+r.txt}catch(e){}}
 h+='</div></div></div>';const W=gid('cs111');W.innerHTML=h;p6open(W)};
// ---------- B) ดาว 4 ขั้น ----------
const GR=[{n:'ทองแดง',c:'#e08a3a',g:['#ffd2a8','#cd7f32','#6a3a10']},{n:'เงิน',c:'#d8e0f0',g:['#ffffff','#c0c8d8','#5a6478']},{n:'เขียว',c:'#4ae87a',g:['#e8ffe8','#3ad86a','#0a5a2a']},{n:'แดง',c:'#ff4a5a',g:['#ffe0e0','#ff3a4a','#7a0a14']}];
const PK=['pshard112','ps2_115','ps3_115','ps4_115'],MK=['mshard112','ms2_115','ms3_115','ms4_115'];
const LVR=['1–49','50–99','100–149','150+ / ดันเจี้ยนนครวารี'];
const MAXN=20,CNT=[4,6,9,13,18],COIN=n=>Math.round(1500*Math.pow(n+1,1.8)/100)*100;
GR.forEach((G,i)=>{INVMETA[PK[i]]=['ชิ้นส่วนสัตว์เลี้ยง·'+G.n,'อัปดาวสัตว์เลี้ยงขั้น'+G.n+' (ดาวละ ค่าพลังทุกอย่าง +2) · เมนู ⭐ อัปดาว'];INVMETA[MK[i]]=['ชิ้นส่วนสัตว์ขี่·'+G.n,'อัปดาวสัตว์ขี่ขั้น'+G.n+' (ดาวละ เลือด +2% · เดินเร็ว +1% · ดาเมจที่ได้รับ -0.6%) · เมนู ⭐ อัปดาว']});
for(const k of PK.concat(MK))try{if(window.INVORDER&&!INVORDER.includes(k))INVORDER.push(k)}catch(e){}
try{const _mi=matIcon;matIcon=function(key){let gi=PK.indexOf(key),pet=true;if(gi<0){gi=MK.indexOf(key);pet=false}if(gi<0)return _mi.apply(this,arguments);const G=GR[gi].g,c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';
 const g=k.createLinearGradient(8,6,40,42);g.addColorStop(0,G[0]);g.addColorStop(.5,G[1]);g.addColorStop(1,G[2]);k.fillStyle=g;k.strokeStyle='#1a0a0a';k.lineWidth=2;
 if(pet){k.beginPath();k.ellipse(24,30,11,9,0,0,7);k.fill();k.stroke();for(const [x,y] of [[12,17],[20,11],[28,11],[36,17]]){k.beginPath();k.ellipse(x,y,4.4,5.4,0,0,7);k.fill();k.stroke()}}
 else{k.lineWidth=9;k.strokeStyle='#1a0a0a';k.beginPath();k.arc(24,22,13,Math.PI*.15,Math.PI*.85,true);k.stroke();k.lineWidth=6;k.strokeStyle=g;k.stroke();k.fillStyle='#fff';for(const a of [-.6,-1.2,-1.9,-2.5]){k.beginPath();k.arc(24+Math.cos(a)*13,22+Math.sin(a)*13,1.4,0,7);k.fill()}}
 k.fillStyle=G[1];k.strokeStyle='#000';k.lineWidth=2.5;k.font='bold 15px system-ui';k.strokeText('★',30,45);k.fillText('★',30,45);return c};window.matIcon=matIcon}catch(e){}
try{for(const k of PK.concat(MK))if(window.IURL)delete IURL['mat:'+k]}catch(e){}
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)||[]}catch(e){}const k=String(key).replace(/^mat:/,'');let gi=PK.indexOf(k);if(gi<0)gi=MK.indexOf(k);if(gi>=0)S=[['⚔️','ดรอปจากมอน Lv.'+LVR[gi]+' (3%)'],['👑','บอสระดับเดียวกัน 50% ครั้งละ 2–4 ชิ้น'+(gi>0?' · บอสขั้นก่อนหน้ามีโอกาสดรอปขั้นนี้ 15%':'')]];return S};window.src7=src7}
const grOf=m=>{try{if(window.dgOf96&&dgOf96())return 3}catch(e){}const lv=(m&&(m.lv||m.L))|0||P.lv;return lv>=150?3:lv>=100?2:lv>=50?1:0};
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);if(m&&!was)m.s112=1;// ปิดดรอปชิ้นส่วนแบบเดิม (fix112 ทองแดงอย่างเดียว)
 const r=_mk.apply(this,arguments);try{if(m&&!was&&m.dead&&!m.s115&&(typeof W33==='undefined'||W33.mode==='solo'||m.my33>0)){m.s115=1;const gi=grOf(m),pick=g=>(Math.random()<.5?PK:MK)[g];
  if(m.boss){if(Math.random()<.5){const n=2+(Math.random()*3|0);for(let i=0;i<n;i++)addDrop(pick(gi),m.x+(Math.random()-.5)*24,m.y)}if(gi<3&&Math.random()<.15)addDrop(pick(gi+1),m.x,m.y)}
  else if(Math.random()<.03)addDrop(pick(gi),m.x,m.y)}}catch(e){}return r};window.mobKill=mobKill}
// รายการสัตว์ทั้งหมด + ที่มีแล้ว
const allP=()=>ANIMS.filter(a=>a.pet),allM=()=>ANIMS.filter(a=>a.mount);
const ownP=k=>!!((window.E92&&E92.pets&&k in E92.pets)||HOME.pet===k);
const ownM=k=>!!((HOME.mounts||[]).includes(k)||HOME.mount===k);
const stP=k=>(window.E92&&E92.pets&&E92.pets[k])|0,stM=k=>(window.MS112&&MS112[k])|0;
// ให้ตัวที่ซื้อแล้วอยู่ในรายการเสมอ
setInterval(()=>{try{if(HOME.pet&&window.E92&&!(HOME.pet in E92.pets)){E92.pets[HOME.pet]=0;save92()}if(HOME.mount){const L=HOME.mounts||(HOME.mounts=[]);if(!L.includes(HOME.mount))L.push(HOME.mount)}}catch(e){}},1500);
const starHTML=n=>{if(n<=0)return '<span style="color:#666">☆☆☆☆☆</span> <small style="display:inline;color:#888">ยังไม่มีดาว</small>';const g=Math.min(3,Math.floor((n-1)/5)),s=((n-1)%5)+1;return '<span style="color:'+GR[g].c+';text-shadow:0 0 4px '+GR[g].c+'">'+'★'.repeat(s)+'</span><span style="color:#555">'+'★'.repeat(5-s)+'</span> <small style="display:inline;color:'+GR[g].c+'">ขั้น'+GR[g].n+'</small>'};
const W115=mk6('st115');
const css=document.createElement('style');css.textContent='#st115 .w{width:min(640px,97%);height:auto;max-height:96%}#st115 .bd{display:block!important;overflow:auto;padding:10px 12px}#st115 h4{margin:8px 0 5px;color:#ffd86a;font-size:13px}#st115 .r115{display:flex;align-items:center;gap:10px;background:#1a1426;border:1px solid #e8c14a33;border-radius:10px;padding:8px 10px;margin-bottom:6px}#st115 .r115.on{border-color:#7ed957}#st115 .r115.lk{opacity:.55}#st115 .r115 .n{flex:1;text-align:left}#st115 .r115 .n b{font-size:14px}#st115 .r115 .s115{font-size:16px;letter-spacing:1px}#st115 .r115 small{display:block;color:#aaa;font-size:11px}#st115 .bd button{padding:9px 12px;border-radius:9px;border:0;font-weight:800;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06;min-width:92px}#st115 .bd button:disabled{background:#3a3450;color:#888}#st115 .hv115{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:6px 0;font-size:11px}#st115 .hv115 span{background:#120e1e;border-radius:8px;padding:4px;display:flex;align-items:center;gap:4px}#st115 .hv115 img{width:22px;height:22px}#st115 .gr115{display:flex;gap:8px;flex-wrap:wrap;font-size:11px;color:#bbb;margin-bottom:4px}';document.head.appendChild(css);
function row115(kind,a){const k=a.k,own=kind==='p'?ownP(k):ownM(k),n=kind==='p'?stP(k):stM(k),on=kind==='p'?HOME.pet===k:HOME.mount===k,mx=n>=MAXN,gi=Math.min(3,Math.floor(n/5)),mat=(kind==='p'?PK:MK)[gi],need=mx?0:CNT[n%5],coin=mx?0:COIN(n),ok=own&&!mx&&(inv[mat]|0)>=need&&inv.coin>=coin;
 const bon=kind==='p'?'ค่าพลังทุกอย่าง +'+2*n:'เลือด +'+2*n+'% · เดินเร็ว +'+n+'% · ดาเมจที่ได้รับ -'+(0.6*n).toFixed(1)+'%';
 return '<div class="r115'+(on?' on':'')+(own?'':' lk')+'"><div class="n"><b>'+a.n+(on?' ✅':'')+'</b> <span class="s115">'+starHTML(n)+'</span><small>'+(own?('ระดับ '+n+'/'+MAXN+' · '+(n?bon:'ยังไม่มีโบนัส')+(on?'':' (ได้โบนัสเมื่อ'+(kind==='p'?'พาเดิน':'เลือกขี่')+')')):'🔒 ยังไม่มี — ซื้อที่ร้านสัตว์ (ลุงขายผัก)'+(kind==='p'?' หรือฟักไข่':''))+'</small>'
  +(own&&!mx?'<small>อัปต้องใช้: '+MN(mat)+' ×'+need+' (มี '+(inv[mat]|0)+') · 🪙 '+coin.toLocaleString('en-US')+'</small>':own?'<small>⭐ ดาวเต็ม (แดง ★5)</small>':'')+'</div><button '+(ok?'':'disabled')+' onclick="up115(\''+kind+'\',\''+k+'\')">'+(mx?'ดาวเต็ม':own?'⭐ อัปดาว':'🔒')+'</button></div>'}
function render115(){let h='<div class="w"><div class="hd"><b>⭐ อัปดาวสัตว์เลี้ยง / สัตว์ขี่</b><button onclick="p6close(gid(\'st115\'))">✕</button></div><div class="bd"><small style="color:#aaa">ดาว 4 ขั้น: ทองแดง → เงิน → เขียว → แดง (ขั้นละ 5 ดาว รวม 20 ระดับ) · ใช้ชิ้นส่วนตามขั้น · อัปได้ทุกตัวที่มี · โบนัสใช้กับตัวที่พาเดิน/เลือกขี่</small>'
 +'<div class="gr115">'+GR.map((G,i)=>'<span style="color:'+G.c+'">★ '+G.n+' = มอน Lv.'+LVR[i]+'</span>').join('')+'</div>'
 +'<div class="hv115">'+PK.concat(MK).map(k=>'<span><img src="'+iconURL('mat:'+k)+'">'+(inv[k]|0)+'</span>').join('')+'</div>';
 h+='<h4>🐾 สัตว์เลี้ยง</h4>'+allP().map(a=>row115('p',a)).join('');h+='<h4>🐎 สัตว์ขี่</h4>'+allM().map(a=>row115('m',a)).join('');W115.innerHTML=h+'</div></div>'}
window.up115=(kind,k)=>{const own=kind==='p'?ownP(k):ownM(k);if(!own)return;const n=kind==='p'?stP(k):stM(k);if(n>=MAXN)return;const gi=Math.min(3,Math.floor(n/5)),mat=(kind==='p'?PK:MK)[gi],need=CNT[n%5],coin=COIN(n);
 if((inv[mat]|0)<need||inv.coin<coin){say('ของไม่พอ');sfx('thud');return}inv[mat]-=need;inv.coin-=coin;
 if(kind==='p'){E92.pets[k]=n+1;try{save92()}catch(e){}try{if(HOME.pet===k&&window.pgDirty92)pgDirty92()}catch(e){}}else{MS112[k]=n+1;try{localStorage.setItem('fm_star112',JSON.stringify(MS112))}catch(e){}}
 try{ptDirty();applyBonus();recalcStats();refreshInv();saveGame(false)}catch(e){}sfx('chest');const nm=(ANIMS.find(q=>q.k===k)||{}).n||k,g=Math.min(3,Math.floor(n/5));
 try{flash('#ffe08a',.3);banner('⭐ อัปดาวสำเร็จ!',nm+' ขั้น'+GR[g].n+' ★'+((n%5)+1),'green')}catch(e){say('⭐ '+nm)}render115()};
window.open112=()=>{render115();p6open(W115)};window.up112=window.up115;
// ---------- D) บ้านว่าง 2 หลังเคยเป็นบ้านครอบครัวชาวเมือง (fix81 HOMES81 A/B) → ตอนนี้เป็น "บ้านของคุณ" (A) และ "หอผนึกอสูร" (B) → ชาวเมืองไปนอนโรงเตี๊ยมแทน ----------
try{const H=window.HOMES81||(window.W81&&W81.HOMES81)||null;if(H){for(const k of ['A','B'])if(H[k]){H[k].door='inn'}}}catch(e){}
// ---------- C) เนื้อเรื่อง ----------
try{for(const c of STCH){if(c&&typeof c.d==='string')c.d=c.d.replace('แท่นผนึกอสูร (คุยกับผู้เฝ้าแท่นผนึกในเมือง)','หอผนึกอสูร — บ้านหลังคาม่วงแถวบนของเมืองเอลโดเรีย')}}catch(e){}
}catch(e){console.warn('fix115',e)}
