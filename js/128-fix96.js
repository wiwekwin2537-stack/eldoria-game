// fix96 (v4.82) — 🌀 ดันเจี้ยนเมืองที่ 2 (5 แห่ง Lv.150–200) + วัตถุดิบใหม่ + ช่างหลอมอัสตรา
//  เจ้าของสั่ง 2026-10-14 14:23: "ไม่ตัดไม้แล้ว เน้นลงดันเจี้ยนหาวัตถุดิบมาทำของ · ต้องมีดันเจี้ยนหลายที่ให้ผู้เล่นค้นหา · ใช้ระบบเดิม"
//  - ใช้ระบบโซนเดิม (genZone/enterZone · มอนร่วมกันทุกจอ W33 · บอสประจำดันเจี้ยน) แต่ไม่มีต้นไม้/แร่ (ลบ ores หลังสร้าง) → เน้นต่อสู้
//  - เข้าได้จากประตูมิติที่ "ลานประตูมิติ" เกาะเหนือของนครวารี (C2.portals) · ออกจากวงเวทแล้วกลับนครวารี
//  - มอนดรอปวัตถุดิบประจำดันเจี้ยน (Zd.raw · ระบบดรอปเดิมของโหมดยาก 25%) · บอสดรอปแก่นบอส ×3 + มีโอกาสดรอปชุดบอสเซ็ต 11–16 (25%)
//  - ช่างหลอมอัสตรา (NPC ในนครวารี): แลกวัตถุดิบดันเจี้ยน → หินตีบวก / หินพร / อัญมณี (ใช้กับระบบตีบวกเดิม)
//  - ตันเลเวลเป็น 200 (แก้ค่าคงที่ MAXLV=200 ในโค้ดเดิม 1 จุด — เจ้าของสั่งให้เพิ่มเลเวล) · server accounts.js clamp 200
try{
const DG96=[
 {id:'dg96a',n:'ถ้ำผลึกน้ำแข็ง',e:'❄️',lv:[150,160],col:'130,220,255',amb:'snow',dark:1,
  pal:{fl:['#5a7a9a','#52728f','#4a6a86'],top:'#3a5470',face:'#2a3e54',edge:'#16222e',ac:'#bfe8ff',vd:'#0c1620'},
  mobs:[['wisp','ภูตหิมะ',['#e8f6ff','#7ab8e8','#ffffff']],['wolf','หมาป่าน้ำแข็ง',['#d8eef8','#6a9ab8','#9ae0ff']],['golem','โกเลมน้ำแข็ง',['#a8d8f0','#4a7a9a','#e8ffff']]],
  boss:{f:'dragon',n:'ราชินีหิมะนิรันดร์',lv:165,c:['#e8f8ff','#5a9ac8','#ffffff']},raw:'ice96',ing:'icec96',rn:'ผลึกน้ำแข็งนิรันดร์',inn:'หัวใจราชินีหิมะ'},
 {id:'dg96b',n:'หนองเห็ดพิษ',e:'🍄',lv:[160,170],col:'150,255,90',amb:'mote',dark:1,
  pal:{fl:['#3a4a2a','#344326','#2e3c22'],top:'#26321c',face:'#1a2414',edge:'#0c120a',ac:'#b0ff6a',vd:'#0a1008'},
  mobs:[['beetle','ด้วงสปอร์',['#7a9a3a','#3a4a1a','#d0ff6a']],['bat','ค้างคาวพิษ',['#6a3a8a','#2a1a3a','#b0ff6a']],['wisp','วิญญาณหนอง',['#c8ff9a','#4a8a2a','#ffffff']]],
  boss:{f:'golem',n:'ราชาเห็ดยักษ์',lv:175,c:['#c84a8a','#5a2a4a','#ffe0f0']},raw:'spore96',ing:'swpc96',rn:'สปอร์พิษม่วง',inn:'แก่นราชาเห็ด'},
 {id:'dg96c',n:'ป้อมเพลิงอสูร',e:'🔥',lv:[170,180],col:'255,120,40',amb:'ember',dark:1,
  pal:{fl:['#4a2a22','#43241e','#3c1f1a'],top:'#301814',face:'#20100c',edge:'#100604',ac:'#ff7a2a',vd:'#140604'},
  mobs:[['skeleton','ทหารเพลิง',['#f0c8a0','#8a2a14','#ffb03a']],['golem','อสูรลาวา',['#8a3a1a','#3a1408','#ffa040']],['dragon','มังกรเพลิงน้อย',['#e8501a','#6a1a08','#ffe060']]],
  boss:{f:'dragon',n:'แม่ทัพเพลิงอสูร',lv:185,c:['#ff4a1a','#3a0804','#ffe060']},raw:'ember96',ing:'flmc96',rn:'ถ่านอสูร',inn:'หัวใจแม่ทัพเพลิง'},
 {id:'dg96d',n:'วิหารใต้สมุทร',e:'🌊',lv:[180,190],col:'90,200,255',amb:'mote',dark:1,
  pal:{fl:['#2a4a5a','#264454','#223e4c'],top:'#1a3240',face:'#10222e',edge:'#06121a',ac:'#6ae0ff',vd:'#04101a'},
  mobs:[['wisp','ภูตทะเลลึก',['#9af0ff','#2a7aa8','#ffffff']],['beetle','ปูเกราะสมุทร',['#e86a4a','#6a2a1a','#ffd0a0']],['wolf','ฉลามบก',['#7a9ab0','#2a3a4a','#ffffff']]],
  boss:{f:'dragon',n:'อสรพิษแห่งสมุทร',lv:195,c:['#2ac8b8','#0a3a4a','#e8fff8']},raw:'pearl96',ing:'tidec96',rn:'ไข่มุกทะเลลึก',inn:'ตราแห่งสมุทร'},
 {id:'dg96e',n:'หอดาราร่วง',e:'🌠',lv:[190,200],col:'255,220,120',amb:'mote',dark:1,
  pal:{fl:['#2a2a4a','#262644','#22223e'],top:'#1a1a34',face:'#101024',edge:'#060612',ac:'#ffe08a',vd:'#04040c'},
  mobs:[['wisp','วิญญาณดารา',['#fff6c0','#c8a040','#ffffff']],['golem','ผู้พิทักษ์ดารา',['#d8d0ff','#4a3a8a','#ffe08a']],['skeleton','อัศวินดาวตก',['#f0e8ff','#5a4aa8','#ffd84a']]],
  boss:{f:'dragon',n:'เทพดาราร่วง',lv:205,c:['#fff0a0','#3a2a8a','#ffffff']},raw:'stard96',ing:'astrc96',rn:'ฝุ่นดาราร่วง',inn:'แก่นดาราร่วง'}];
window.DG96=DG96;const DGI96={};
for(const d of DG96){const z={id:d.id,n:d.n,e:d.e,lv:d.lv,gateIn:-1,ulv:d.lv[0],ores:[['stone',1]],raw:d.raw,ing:d.ing,amb:d.amb,dark:d.dark,pal:d.pal,mobs:d.mobs,boss:d.boss,dg96:1};
 if(!ZONES.some(q=>q.id===d.id))ZONES.push(z);DGI96[d.id]=ZONES.findIndex(q=>q.id===d.id);try{delete ZCACHE[DGI96[d.id]]}catch(e){}}
const dgOf96=()=>{try{const Zd=D&&D.zone&&D.zone.Zd;return Zd&&Zd.dg96?DG96.find(q=>q.id===Zd.id):null}catch(e){return null}};window.dgOf96=dgOf96;
// ไม่มีต้นไม้/แร่ในดันเจี้ยนเมือง 2
{const _gz=genZone;genZone=function(zi){const Zd=ZONES[zi];const r=_gz.apply(this,arguments);try{if(Zd&&Zd.dg96&&r&&r.ores&&r.ores.length){r.ores=[];r.oreAt={}}}catch(e){}return r};window.genZone=genZone}
// ซ่อนจากเมนูประตูมิติในทุ่งหญ้า (เข้าได้จากนครวารีเท่านั้น)
{const _oz=openZMenu;openZMenu=function(){const r=_oz.apply(this,arguments);try{for(const b of [...shopEl.querySelectorAll('button.zbtn')]){const m=/enterZone\((\d+)\)/.exec(b.getAttribute('onclick')||'');if(m&&ZONES[+m[1]]&&ZONES[+m[1]].dg96)b.remove()}}catch(e){}return r};window.openZMenu=openZMenu}
// เข้า/ออก
function enterDg96(i){const d=DG96[i];if(!d)return;if(P.lv<d.lv[0]){say('🔒 '+d.n+' ต้อง Lv.'+d.lv[0]+' ขึ้นไป');sfx('thud');return}
 LoadingScreenManager.cover({icon:d.e,title:d.n,tip:'มอน Lv.'+d.lv[0]+'–'+d.lv[1]+' · ดรอป '+d.rn+' · บอส '+d.boss.n+' ดรอป '+d.inn+' และชุดบอส'},()=>{try{exitD()}catch(e){}enterZone(DGI96[d.id]);
  setTimeout(()=>{try{sysSay(d.e+' '+d.n+' — ล่ามอนเก็บ '+d.rn+' · บอส 👑 '+d.boss.n+' อยู่ทางเหนือ · ออกที่วงเวทด้านล่างเพื่อกลับนครวารี')}catch(e){}},900)})}
window.enterDg96=enterDg96;
C2.portals.length=0;DG96.forEach((d,i)=>C2.portals.push({n:d.e+' '+d.n,lv:d.lv[0],lv2:d.lv[1],col:d.col,go:()=>enterDg96(i)}));
{const _it=interact;interact=function(){try{if(dgOf96()&&zExitNear()){LoadingScreenManager.cover({icon:'🏙️',title:'นครวารีอัสตรา',tip:'กลับเมือง'},()=>{try{exitD()}catch(e){}enterCity2('dg')});return true}}catch(e){}return _it.apply(this,arguments)};window.interact=interact}
// ป้ายวงเวทออก
{const _dl=window.dgExitLbl11;if(typeof _dl==='function')window.dgExitLbl11=function(){if(dgOf96())return '🏙️ กลับนครวารี (E)';return _dl.apply(this,arguments)}}
// บอส: แก่นบอส ×3 + ชุดบอส 25%
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);const r=_mk.apply(this,arguments);try{const d=dgOf96();if(d&&m&&!was&&m.dead&&m.boss&&!m.k96&&(W33.mode==='solo'||m.my33>0)){m.k96=1;
   inv[d.ing]=(inv[d.ing]|0)+3;try{dmgTxt(P.x,P.y-60,'👑 '+d.inn+' ×3','#ffd84a',true)}catch(e){}if(Math.random()<.25&&typeof drop59==='function'){try{drop59(m)}catch(e){}}refreshInv()}}catch(e){console.warn('dg96 boss',e)}return r};window.mobKill=mobKill}
// ---------- วัตถุดิบ: ชื่อ คำอธิบาย น้ำหนัก ไอคอน ที่มา ----------
const MATS96={};for(const d of DG96){MATS96[d.raw]={n:d.rn,col:d.col,core:0,d};MATS96[d.ing]={n:d.inn,col:d.col,core:1,d}}window.MATS96=MATS96;
for(const k in MATS96){const M=MATS96[k];INVMETA[k]=[M.n,(M.core?'แก่นบอสของ':'วัตถุดิบจาก')+M.d.n+' (Lv.'+M.d.lv[0]+'–'+M.d.lv[1]+') · นำไปให้ช่างหลอมอัสตราในนครวารีแลกหินตีบวก/หินพร/อัญมณี'];
 if(!INVORDER.includes(k))INVORDER.push(k);if(!(k in WT))WT[k]=M.core?.5:.2}
{const _mi=matIcon;matIcon=function(key){const M=MATS96[key];if(!M)return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');const col=M.col;
  const g=k.createRadialGradient(24,24,2,24,24,23);g.addColorStop(0,'rgba('+col+',.55)');g.addColorStop(1,'rgba('+col+',0)');k.fillStyle=g;k.fillRect(0,0,48,48);k.lineJoin='round';k.lineWidth=2;k.strokeStyle='rgba(20,10,30,.85)';
  const gr=k.createLinearGradient(10,6,38,42);gr.addColorStop(0,'#ffffff');gr.addColorStop(.35,'rgb('+col+')');gr.addColorStop(1,'rgba(20,20,40,1)');k.fillStyle=gr;
  if(M.core){k.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,r=i%2?10:19;k.lineTo(24+Math.cos(a)*r,24+Math.sin(a)*r)}k.closePath();k.fill();k.stroke();k.fillStyle='rgba(255,255,255,.85)';k.beginPath();k.arc(24,24,5,0,7);k.fill()}
  else{k.beginPath();k.moveTo(24,5);k.lineTo(36,18);k.lineTo(31,42);k.lineTo(17,42);k.lineTo(12,18);k.closePath();k.fill();k.stroke();k.strokeStyle='rgba(255,255,255,.6)';k.lineWidth=1.2;k.beginPath();k.moveTo(24,6);k.lineTo(24,41);k.moveTo(13,18);k.lineTo(35,18);k.stroke()}
  return c};window.matIcon=matIcon}
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)}catch(e){}const kk=String(key).replace(/^mat:/,''),M=MATS96[kk];
  if(M){S=S.filter(q=>!/ยังไม่มีข้อมูล/.test(q[1]));S.push([M.d.e,(M.core?'บอส 👑 '+M.d.boss.n+' ใน':'มอนใน')+M.d.n+' (Lv.'+M.d.lv[0]+'–'+M.d.lv[1]+') — เข้าทางลานประตูมิติ นครวารีอัสตรา'])}return S};window.src7=src7}
// ---------- ช่างหลอมอัสตรา ----------
const EX96=[{t:'💠 หินตีบวก ×4',need:{raw:10},give:{estone:4}},{t:'✨ หินพร ×1',need:{core:3},give:{bless:1}},{t:'💎 อัญมณี ×1',need:{raw:20,core:2},give:{gem:1}}];
const rawSum96=()=>DG96.reduce((s,d)=>s+(inv[d.raw]|0),0),coreSum96=()=>DG96.reduce((s,d)=>s+(inv[d.ing]|0),0);
function take96(kind,n){const L=DG96.map(d=>kind==='raw'?d.raw:d.ing);for(const k of L){const c=Math.min(n,inv[k]|0);inv[k]-=c;n-=c;if(n<=0)break}}
function smith96(n){const txt='⚒️ ข้าหลอมวัตถุดิบดันเจี้ยนให้เป็นของตีบวกได้\nมีวัตถุดิบ '+rawSum96()+' ชิ้น · แก่นบอส '+coreSum96()+' ชิ้น (นับรวมทุกดันเจี้ยน)';
 const ch=EX96.map(x=>{const nr=x.need.raw|0,nc=x.need.core|0,ok=rawSum96()>=nr&&coreSum96()>=nc;return {t:x.t+' ← '+(nr?'วัตถุดิบ '+nr:'')+(nr&&nc?' + ':'')+(nc?'แก่นบอส '+nc:'')+(ok?'':' (ไม่พอ)'),stay:true,c:ok?'go':'',
  f:()=>{if(!(rawSum96()>=nr&&coreSum96()>=nc)){say('วัตถุดิบไม่พอ — ลงดันเจี้ยนที่ลานประตูมิติ');sfx('thud');return}take96('raw',nr);take96('core',nc);for(const k in x.give)inv[k]=(inv[k]|0)+x.give[k];refreshInv();try{saveGame(true)}catch(e){}sfx('chest');say('⚒️ ได้ '+x.t);smith96(n)}}});
 talk(n,txt,ch.concat([BYE]),'⚒️ ช่างหลอมอัสตรา')}
window.smith96=smith96;

// เพิ่ม NPC ช่างหลอมในนครวารี (หน้าร้านอาวุธ)
{const _nt=npcTalk;npcTalk=function(n){if(n&&n.smith96){smith96(n);return}return _nt.apply(this,arguments)};window.npcTalk=npcTalk}
setInterval(()=>{try{if(inC2()&&D.npcs&&!D.npcs.some(n=>n.smith96)){const n=mkNPC({name:'ช่างหลอมอัสตรา',c:'#7a3a1a',h:'#2a1a0a',x:24,y:21.4,fixed:1,apron:1,beard:1,lines:[]});n.smith96=1;try{npcRescue(n)}catch(e){}n.home={x:n.x,y:n.y};D.npcs.push(n)}}catch(e){}},500);
}catch(e){console.warn('fix96',e)}
