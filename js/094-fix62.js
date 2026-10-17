// fix62 (v4.59) — 🐲 บอสตำนาน 6 ตัว + ลานบอสใหม่ 6 แมพ = แหล่งหลักของชุดดรอปบอส (fix59)
//   เข้าที่ "แท่นผนึกอสูร" (เมนูหอคอยบอส / ปุ่ม 🐲 ในเมนูหลัก) · ค่าท้า 🪙 · เลือดมหาศาล · มีท่าไม้ตายเตือนวงแดงก่อนลง · เรียกสมุน · คลั่งเมื่อเลือด <30% · เวลา 8 นาที
//   ชนะ: ได้ "ตราอสูร" 1–2 อัน (10 อัน แลกชิ้นเซ็ตที่ต้องการได้) + 12% ดรอปชิ้นเซ็ตสุ่มทันที · บอสทั่วไปลดเหลือ 2–3% (ได้ยากจริง)
try{
const LB62=[
 {id:'thorn',n:'ราชาพฤกษาหนาม',e:'🌿',f:'golem',c:['#5a8a3a','#1e3a12','#9aff6a'],lv:20,hp:6,atk:1.3,cost:3000,adds:'wisp',sc:1.9,
  map:{fl:['#2a3a1a','#33461f'],wl:'#14200c',ac:'#9aff6a',deco:'tree'},tip:'หนามแทงจากพื้นใต้เท้า · เรียกภูตป่า'},
 {id:'serp',n:'นาคราชอสรพิษ',e:'🐍',f:'drake',c:['#2a9a7a','#0e3a30','#6affc8'],lv:35,hp:6,atk:1.35,cost:6000,adds:'bat',sc:2.0,pool:1,
  map:{fl:['#1a2e2a','#203a34'],wl:'#08140f',ac:'#6affc8',deco:'pool'},tip:'บ่อพิษค้างบนพื้น (อย่ายืนแช่) · พ่นพิษวงกว้าง'},
 {id:'frost',n:'ราชันย์หมาป่าเหมันต์',e:'🐺',f:'wolf',c:['#e8f4ff','#7a9ab8','#bfe8ff'],lv:55,hp:5.5,atk:1.4,cost:12000,adds:'wolf',sc:2.3,
  map:{fl:['#c8dce8','#b8ccdc'],wl:'#4a6a88',ac:'#7ad8ff',deco:'ice'},tip:'วงน้ำแข็งรอบตัวบอส (หนีออกนอกวง) · เรียกฝูงหมาป่า'},
 {id:'phar',n:'ฟาโรห์อมตะสุริยัน',e:'☀️',f:'skeleton',c:['#e0b030','#2a5ac8','#ffe880'],lv:75,hp:5.5,atk:1.45,cost:20000,adds:'skeleton',sc:2.1,
  map:{fl:['#c8a868','#b89858'],wl:'#5a4020',ac:'#ffe880',deco:'pillar'},tip:'ลำแสงสุริยะตกหลายจุด · ปลุกทหารโครงกระดูก'},
 {id:'blood',n:'มังกรโลหิตโบราณ',e:'🐉',f:'dragon',c:['#c81a2a','#3a0408','#ffc040'],lv:95,hp:3.5,atk:1.5,cost:35000,adds:'drake',sc:2.0,
  map:{fl:['#2a1612','#341a14'],wl:'#120604',ac:'#ff5a2a',deco:'lava'},tip:'ฝนไฟถล่มทั้งลาน · คลั่งแล้วพ่นไฟถี่ขึ้น'},
 {id:'void',n:'จักรพรรดิเงานิรันดร์',e:'🌑',f:'skeleton',c:['#3a2a5a','#06020c','#b07aff'],lv:115,hp:10,atk:1.6,cost:60000,adds:'wisp',sc:2.6,tele:1,
  map:{fl:['#140e20','#1a1228'],wl:'#050208',ac:'#b07aff',deco:'void'},tip:'วาปหายแล้วโผล่ใหม่ · หลุมเงาหลายจุด · เรียกเงาสมุน'}];
window.LB62=LB62;
// ---------- ตราอสูร (ไอเท็มในกระเป๋า) ----------
LB62.forEach((B,i)=>{const k='lbm'+i;INVMETA[k]=['ตราอสูร: '+B.n,'ได้จากการปราบ'+B.n+' · สะสม 10 อันแลกชิ้นเซ็ต '+((window.B59&&B59[i])?B59[i].n:'')+' ที่แท่นผนึกอสูร'];if(!INVORDER.includes(k))INVORDER.push(k);WT[k]=.05;if(inv[k]===undefined)inv[k]=0});
{const _mi=matIcon;matIcon=function(key){const m=/^lbm(\d)$/.exec(key||'');if(!m)return _mi(key);const B=LB62[+m[1]],c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');
  const g=k.createRadialGradient(24,22,2,24,24,22);g.addColorStop(0,B.c[2]);g.addColorStop(.6,B.c[0]);g.addColorStop(1,B.c[1]);k.fillStyle=g;k.strokeStyle='#14100a';k.lineWidth=2.4;k.beginPath();for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3;k.lineTo(24+Math.cos(a)*20,24+Math.sin(a)*20)}k.closePath();k.fill();k.stroke();
  k.font='20px serif';k.textAlign='center';k.textBaseline='middle';k.fillText(B.e,24,25);return c}}
try{for(let i=0;i<6;i++){const im=new Image();im.src=iconURL('mat:lbm'+i);DROPIMG['lbm'+i]=im}}catch(e){}
// ---------- แมพลานบอส ----------
const ZM62={};
function build62(i){if(ZM62[i])return ZM62[i];const B=LB62[i],M=B.map,W=36,H=28,m=[];
 for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++){const dx=(x-W/2+.5)/(W/2-1),dy=(y-H/2+.5)/(H/2-1);m[y][x]=(dx*dx+dy*dy>1)?WL:FL}}
 const pillars=[[9,8],[26,8],[9,19],[26,19]];for(const [x,y] of pillars)m[y][x]=WL;for(let y=H-3;y<H;y++)for(let x=W/2-1;x<=W/2;x++)m[y][x]=FL;for(let x=0;x<W;x++)m[H-1][x]=WL;
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d'),R=(a,b)=>a+Math.random()*(b-a);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=y*T,h=hash(x*1.3+i,y*2.1);
  if(m[y][x]===WL){k.fillStyle=M.wl;k.fillRect(px,py,T,T);k.fillStyle='rgba(255,255,255,.06)';k.fillRect(px+2,py+2,T-4,T-10);k.fillStyle='rgba(0,0,0,.45)';k.fillRect(px,py+T-6,T,6)}
  else{k.fillStyle=(x+y)%2?M.fl[0]:M.fl[1];k.fillRect(px,py,T,T);k.strokeStyle='rgba(0,0,0,.18)';k.strokeRect(px+.5,py+.5,T-1,T-1);
   if(M.deco==='tree'&&h>.88){k.fillStyle='#4a7a2a';for(let j=0;j<3;j++){k.beginPath();k.ellipse(px+8+j*7,py+20,4,2,j,0,7);k.fill()}}
   if(M.deco==='pool'&&h>.93){k.fillStyle='rgba(80,255,180,.25)';k.beginPath();k.ellipse(px+16,py+16,13,7,0,0,7);k.fill()}
   if(M.deco==='ice'&&h>.9){k.fillStyle='rgba(255,255,255,.55)';k.beginPath();k.moveTo(px+10,py+24);k.lineTo(px+14,py+8);k.lineTo(px+18,py+24);k.fill()}
   if(M.deco==='pillar'&&h>.9){k.fillStyle='rgba(120,90,40,.35)';k.fillRect(px+4,py+12,24,6)}
   if(M.deco==='lava'&&h>.86){k.strokeStyle='rgba(255,110,30,.6)';k.lineWidth=2;k.beginPath();k.moveTo(px+3,py+8);k.lineTo(px+14,py+17);k.lineTo(px+28,py+12);k.stroke();k.lineWidth=1}
   if(M.deco==='void'&&h>.9){k.fillStyle='rgba(200,160,255,.6)';k.fillRect(px+R(4,28),py+R(4,28),1.6,1.6)}}}
 const cx=W*T/2,cy=H*T/2;k.save();k.strokeStyle=M.ac;k.globalAlpha=.5;k.lineWidth=3;for(const r of [.34,.24,.12]){k.beginPath();k.arc(cx,cy,W*T*r*.55,0,7);k.stroke()}
 k.beginPath();for(let j=0;j<=6;j++){const a=-Math.PI/2+j*Math.PI*2/6*2,r=W*T*.17;j?k.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r):k.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}k.stroke();k.restore();
 for(const [x,y] of pillars){const px=x*T+16,py=y*T+16;k.fillStyle=M.wl;k.fillRect(px-9,py-40,18,50);k.fillStyle='rgba(255,255,255,.1)';k.fillRect(px-9,py-40,5,50);const g=k.createRadialGradient(px,py-44,0,px,py-44,14);g.addColorStop(0,M.ac);g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(px-14,py-58,28,28)}
 k.font='900 22px Georgia,serif';k.textAlign='center';k.fillStyle='rgba(255,255,255,.3)';k.fillText(B.e+' ลานผนึก'+B.n,cx,T*2.4);
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 return ZM62[i]={zi:700+i,name:'lb'+i,Zd:{id:'lboss'+i,n:'ลานผนึก'+B.n,e:B.e,lv:[B.lv,B.lv],dark:1,amb:'dust',pal:{vd:M.wl},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt'},m,ores:[],oreAt:{},floor,ent:{x:W/2,y:H-3},arena:{x:W/2,y:Math.floor(H/2)-1},seen:new Uint8Array(W*H).fill(1),W,H,cv:c}}
// ---------- เข้า/ออก ----------
const in62=()=>!!(D&&D.lb62!=null);window.in62=in62;
{const _ns=netScene;netScene=function(){if(D&&D.lb62!=null)return 'towerlb'+D.lb62;return _ns()};window.netScene=netScene}
const AOE62=[];window.AOE62=AOE62;
function enter62(i){const B=LB62[i];if(!B)return;if(D&&(D.zone||D.shop)&&!in62()){say('เข้าลานบอสได้จากเมืองหรือทุ่งหญ้า');sfx('thud');return}
 if(P.lv<B.lv){say('🔒 '+B.n+' ต้อง Lv.'+B.lv+' ขึ้นไป');sfx('thud');return}if((inv.coin|0)<B.cost){say('🪙 ค่าท้าไม่พอ (ต้อง '+B.cost.toLocaleString()+')');sfx('thud');return}
 inv.coin-=B.cost;try{refreshInv();saveGame(true)}catch(e){}const Zm=build62(i);AOE62.length=0;
 LoadingScreenManager.cover({icon:B.e,title:'ลานผนึก'+B.n,tip:B.tip+' · เวลา 8 นาที'},()=>{if(D&&D.town){try{exitD()}catch(e){}}try{closeZMenu()}catch(e){}
  ZW=Zm.W;ZH=Zm.H;sfx('warp');setScene('cave');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;
  D={zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret:[ZG.x,ZG.y+40],ban:0,lb62:i,t0:performance.now(),el:0,won:0,cyc:6,sumT:12};dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,4);
  P.x=Zm.ent.x*T;P.y=(Zm.ent.y-1)*T+16;P.dir='u';P.kx=P.ky=0;MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}
  const b=mkMob(B.f,B.n,B.c,B.lv+3,Zm.arena.x*T,Zm.arena.y*T+16,{boss:1});b.hp=b.max=Math.round(b.hp*B.hp);b.atk=Math.round(b.atk*B.atk);b.lb62=1;b.boss=1;b.sc*=B.sc/1.4;b.phase=0;b.sk=3;
  D.boss=b;D.bossT=1e9;D.mobs.push(b);setTimeout(()=>{try{banner(B.e+' '+B.n,'เลือด '+b.max.toLocaleString()+' · '+B.tip,'')}catch(e){}},700)})}
function leave62(){/* fix147: ฟังก์ชันนี้อยู่ในบล็อก try → ทางออกในลาน (หมดเวลา/ชนะ/ยอมแพ้) เรียกตัวนี้ตรง ๆ ไม่ผ่านตัวที่แก้ภายหลัง (fix81/fix134 กลับหอผนึก) → ส่งต่อให้ตัวล่าสุดก่อน */if(!leave62.__d&&typeof window.leave62==='function'&&window.leave62!==leave62){leave62.__d=1;try{return window.leave62.apply(this,arguments)}finally{leave62.__d=0}}if(!in62())return;AOE62.length=0;LoadingScreenManager.cover({icon:'🏰',title:'ออกจากลานผนึก'},()=>{exitD();enterTown(1)})}
window.enter62=enter62;window.leave62=leave62;
// ---------- ท่าไม้ตาย (วงเตือนแดง → ลง) ----------
function aoe62(x,y,r,l,mult,kind){AOE62.push({x,y,r,l,t:0,mult,kind:kind||'hit'})}
setInterval(()=>{try{if(!in62()||PAUSED)return;const b=D.boss;if(!b||b.dead||D.won)return;D.el+=.5;const B=LB62[D.lb62],rage=b.hp/b.max<.3;
 if(D.el>=480&&!D.won){D.won=-1;say('⌛ หมดเวลา! พลังผนึกผลักเจ้าออกมา');sfx('thud');leave62();return}
 if(!b.aggro&&Math.hypot(P.x-b.x,P.y-b.y)<400)b.aggro=1;if(!b.aggro)return;
 if(rage&&!b.rage62){b.rage62=1;b.atk=Math.round(b.atk*1.3);say('💢 '+B.n+' คลั่ง!');try{shake(6,.4)}catch(e){}}
 D.cyc-=.5*(rage?1.6:1);if(D.cyc<=0){D.cyc=6;const id=B.id,px=P.x,py=P.y;
  if(id==='thorn'){for(let j=0;j<3;j++)setTimeout(()=>{if(in62())aoe62(P.x,P.y,46,1.1,2.2,'thorn')},j*600)}
  else if(id==='serp'){for(let j=0;j<4;j++){const a=Math.random()*6.28,r=60+Math.random()*120;aoe62(px+Math.cos(a)*r,py+Math.sin(a)*r,58,1.3,.9,'pool')}aoe62(b.x,b.y,150,1.6,2,'hit')}
  else if(id==='frost'){aoe62(b.x,b.y,170,1.5,2.6,'ice');aoe62(px,py,50,1.2,1.8,'ice')}
  else if(id==='phar'){for(let j=0;j<6;j++){const a=Math.random()*6.28,r=Math.random()*180;aoe62(px+Math.cos(a)*r,py+Math.sin(a)*r,44,1.2+j*.15,2,'sun')}}
  else if(id==='blood'){const n=rage?12:8;for(let j=0;j<n;j++){const a=Math.random()*6.28,r=Math.random()*260;aoe62(b.x+Math.cos(a)*r,b.y+Math.sin(a)*r,50,1+Math.random()*.8,2.4,'fire')}aoe62(px,py,60,1.1,2.4,'fire')}
  else if(id==='void'){if(B.tele&&Math.random()<.6){const fl=D.zone.floor[Math.random()*D.zone.floor.length|0];if(fl){b.x=fl[0]*T+16;b.y=fl[1]*T+16;try{vfx('puff',b.x,b.y,.6,{c:'180,120,255'})}catch(e){}}}for(let j=0;j<5;j++){const a=j*1.2566+Math.random(),r=80+Math.random()*80;aoe62(px+Math.cos(a)*r*.6,py+Math.sin(a)*r*.6,52,1.3,2.6,'void')}}}
 D.sumT-=.5;if(D.sumT<=0){D.sumT=rage?9:14;const n=2+(rage?2:0);for(let j=0;j<n;j++){const a=Math.random()*6.28,x=b.x+Math.cos(a)*70,y=b.y+Math.sin(a)*50;if(zHit(x,y))continue;const q=mkMob(B.adds,'สมุน'+B.n,B.c,Math.max(1,B.lv-2),x,y,{elite:1});q.aggro=1;q.st='chase';D.mobs.push(q)}try{dmgTxt(b.x,b.y-60*b.sc,'📣 เรียกสมุน!','#ff9a5a',true)}catch(e){}}
}catch(e){}},500);
// อัปเดต/วาดวงเตือน
// ดาเมจท่าไม้ตาย = % ของเลือดสูงสุดผู้เล่น (โดน 3–4 ครั้งตาย · หลบได้ก็รอด) — ไม่ขึ้นกับเลเวลบอสจนโดนทีเดียวตาย
const PCT62={hit:.3,thorn:.25,pool:.2,ice:.3,sun:.25,fire:.28,void:.32};
const COL62={hit:'255,80,60',thorn:'150,255,100',pool:'80,255,190',ice:'170,230,255',sun:'255,230,120',fire:'255,90,40',void:'180,120,255'};
{let lt=performance.now();const _h=hero;hero=function(){const now=performance.now(),dt=Math.min(.05,(now-lt)/1000);lt=now;
 if(in62()&&D.boss&&!D.boss.dead){try{const b=D.boss,B=LB62[D.lb62],t=now/1000,rgb=COL62[['thorn','pool','ice','sun','fire','void'][D.lb62]],R=26*b.sc;ctx.save();ctx.globalCompositeOperation='lighter';
   ctx.translate(b.x,b.y+2);ctx.scale(1,.38);ctx.strokeStyle='rgba('+rgb+',.75)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,R*.7,0,7);ctx.stroke();
   for(let i=0;i<8;i++){const a=t*(b.rage62?2.4:1)+i*Math.PI/4;ctx.fillStyle='rgba('+rgb+',.9)';ctx.fillRect(Math.cos(a)*R*.85-2,Math.sin(a)*R*.85-2,4,4)}ctx.setTransform(1,0,0,1,0,0);ctx.restore();
   ctx.save();ctx.translate(b.x,b.y-58*b.sc-8+Math.sin(t*2)*3);ctx.font='bold '+Math.round(14+4*b.sc)+'px serif';ctx.textAlign='center';ctx.fillText(b.rage62?'💢':'👑',0,0);ctx.restore();
   if(Math.random()<.35)rfxP(b.x+(Math.random()-.5)*R*1.6,b.y-Math.random()*40*b.sc,(Math.random()-.5)*20,-30-Math.random()*30,.9,rgb,2,'spark')}catch(e){}}
 if(in62()&&AOE62.length){const b=D.boss;ctx.save();for(let j=AOE62.length-1;j>=0;j--){const a=AOE62[j];if(!PAUSED)a.t+=dt;const u=Math.min(1,a.t/a.l),c=COL62[a.kind]||COL62.hit;
   if(a.t<a.l){ctx.fillStyle='rgba('+c+','+(.12+.18*u)+')';ctx.beginPath();ctx.ellipse(a.x,a.y,a.r,a.r*.55,0,0,7);ctx.fill();ctx.strokeStyle='rgba('+c+',.9)';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba('+c+',.35)';ctx.beginPath();ctx.ellipse(a.x,a.y,a.r*u,a.r*.55*u,0,0,7);ctx.fill()}
   else if(!a.done){a.done=1;a.fade=.35;if(Math.hypot((P.x-a.x)/a.r,(P.y-a.y)/(a.r*.55))<1&&b&&!P.dead){zHurt(b,BAL.hp*(PCT62[a.kind]||.28)*(b.rage62?1.15:1)+(typeof DEF==='function'?DEF()*.8:0),1.2,b.nm);if(a.kind==='ice')P.slowT=Math.max(P.slowT||0,2);if(a.kind==='fire'||a.kind==='sun')P.burnT=Math.max(P.burnT||0,2)}
    try{for(let n=0;n<12;n++)rfxP(a.x+(Math.random()-.5)*a.r,a.y+(Math.random()-.5)*a.r*.5,(Math.random()-.5)*60,-40-Math.random()*60,.6,c,2,'spark')}catch(e){}if(a.kind==='pool'){a.linger=4}}
   else if(a.linger>0){a.linger-=dt;ctx.fillStyle='rgba('+c+',.22)';ctx.beginPath();ctx.ellipse(a.x,a.y,a.r,a.r*.55,0,0,7);ctx.fill();a.tick=(a.tick||0)-dt;if(a.tick<=0&&Math.hypot((P.x-a.x)/a.r,(P.y-a.y)/(a.r*.55))<1&&b&&!P.dead){a.tick=.8;zHurt(b,BAL.hp*.06+(typeof DEF==='function'?DEF()*.8:0),.2,'พิษ'+b.nm)}}
   else{a.fade-=dt;if(a.fade<=0){AOE62.splice(j,1);continue}ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+c+','+a.fade+')';ctx.beginPath();ctx.ellipse(a.x,a.y,a.r,a.r*.55,0,0,7);ctx.fill();ctx.globalCompositeOperation='source-over'}}ctx.restore()}
 return _h()};window.hero=hero}
// ---------- ชนะ / รางวัล ----------
{const _mk=mobKill;mobKill=function(m){if(!(m&&m.lb62&&in62()))return _mk.apply(this,arguments);const i=D.lb62,B=LB62[i],r=_mk.apply(this,arguments);if(D.won)return r;D.won=1;AOE62.length=0;
  for(const q of D.mobs)if(q!==m&&!q.dead)q.dead=true;const k='lbm'+i,n=1+(Math.random()<.25?1:0);inv[k]=(inv[k]|0)+n;const R=['🔱 ตราอสูร ×'+n+' (มี '+inv[k]+'/10)'];
  if(Math.random()<.12&&window.drop59){try{const piece=['sword','staff','bow','helm','chest','pants','arm','neck','ring'][Math.random()*9|0],id=piece+B59[i].t;GEAR[id]=(GEAR[id]|0)+1;R.push('👑 '+ITEMS[id].name)}catch(e){}}
  const coin=Math.round(B.cost*1.2);inv.coin+=coin;R.push('🪙 '+coin.toLocaleString());try{/* fix125: บอสตำนานตัวเลเวลต่ำให้ XP ครึ่งเลเวลของผู้เล่นเลเวลสูง → คิดจากเลเวลบอส */const x=Math.round(need(Math.min(P.lv,(m.L|0)||B.lv+3))*.5);gainXp(x);R.push('⭐ XP +'+x.toLocaleString())}catch(e){}
  try{refreshInv();saveGame(true)}catch(e){}flash('#ffd84a',.4);sfx('chest');try{chatAnn((P.name||'ผู้กล้า')+' ปราบ'+B.n+' สำเร็จ!')}catch(e){}
  setTimeout(()=>{try{talk({name:'แท่นผนึกอสูร',c:'#8a4aff'},'🏆 ปราบ '+B.n+' สำเร็จ!\n'+R.join(' · '),[{t:'🔱 แลกตราอสูร',f:()=>openAltar62()},{t:'🏰 ออกจากลาน',f:()=>leave62()},BYE],'🐲 บอสตำนาน')}catch(e){}},900);return r};window.mobKill=mobKill}
// ---------- แท่นผนึกอสูร (เมนู) ----------
function openAltar62(){if(in62()){talk({name:'แท่นผนึกอสูร',c:'#8a4aff'},'จะยอมแพ้หรือ? ออกตอนนี้ไม่ได้รางวัล',[{t:'🏰 ออกจากลาน',c:'go',f:()=>leave62()},BYE],'🐲 บอสตำนาน');return}
 const txt='🐲 บอสตำนาน 6 ตัว — เลือดมหาศาล มีท่าไม้ตาย (หลบวงแดง) · เวลา 8 นาที\nชนะได้ตราอสูร 1–2 อัน · 10 อัน = แลกชิ้นเซ็ตตามใจ · มีโอกาสดรอปชิ้นเซ็ตทันที';
 const ch=LB62.map((B,i)=>({t:B.e+' '+B.n+' (Lv.'+B.lv+' · '+B.cost.toLocaleString()+'🪙 · ตรา '+(inv['lbm'+i]|0)+'/10)',c:P.lv>=B.lv?'go':'',f:()=>window.enter62(i)}));
 ch.push({t:'🔱 แลกตราอสูร → ชิ้นเซ็ต',stay:true,f:()=>pickSet62()},BYE);talk({name:'แท่นผนึกอสูร',c:'#8a4aff'},txt,ch,'🐲 บอสตำนาน')}
function pickSet62(){const ch=LB62.map((B,i)=>({t:B.e+' '+(window.B59?B59[i].n:B.n)+' — ตรา '+(inv['lbm'+i]|0)+'/10',stay:true,f:()=>pickPiece62(i)}));ch.push(BYE);talk({name:'แท่นผนึกอสูร',c:'#8a4aff'},'เลือกเซ็ตที่จะแลก (ใช้ตราอสูรของบอสตัวนั้น 10 อัน)',ch,'🔱 แลกตรา')}
function pickPiece62(i){const S=B59[i],K=['sword','staff','bow','helm','chest','pants','arm','neck','ring'];const ch=K.map(k=>({t:KINDS[k]+S.n,f:()=>{if((inv['lbm'+i]|0)<10){say('🔱 ตราไม่พอ (มี '+(inv['lbm'+i]|0)+'/10)');sfx('thud');return}inv['lbm'+i]-=10;const id=k+S.t;GEAR[id]=(GEAR[id]|0)+1;try{refreshInv();saveGame(true)}catch(e){}sfx('chest');flash(S.r[1],.3);say('👑 แลกได้ '+ITEMS[id].name+' ['+S.r[0]+']')}}));ch.push(BYE);talk({name:'แท่นผนึกอสูร',c:'#8a4aff'},'เลือกชิ้นที่ต้องการ ('+S.n+' · ต้อง Lv.'+S.lv+')',ch,'🔱 แลกตรา')}
window.openAltar62=openAltar62;
{const _ot=openTower10;openTower10=function(){const r=_ot.apply(this,arguments);try{if(DLG.open&&!inTower10()&&!in62())DLG.ch.splice(Math.max(0,DLG.ch.length-1),0,{t:'🐲 แท่นผนึกอสูร (บอสตำนาน · ชุดบอส)',c:'go',stay:true,f:()=>openAltar62()})}catch(e){}return r};window.openTower10=openTower10}
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['🐲','บอสตำนาน',()=>openAltar62()]);pmRender7()}catch(e){}
// ตายในลาน = ล้างวงเตือน
setInterval(()=>{try{if(P.dead&&AOE62.length)AOE62.length=0}catch(e){}},500);
// ---------- บอสทั่วไปดรอปชุดบอสยากขึ้น (ให้บอสตำนานเป็นแหล่งหลัก) ----------
window.DROP59=window.DROP59||{};
}catch(e){console.warn('fix62',e)}
