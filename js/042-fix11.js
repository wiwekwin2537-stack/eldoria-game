// fix11.js (v4.20) — ดันเจี้ยนย้ายเข้าปราสาท (46,47) · กุญแจบอส/ไม่ดรอปแท่ง/ออกต้องใช้ใบวาร์ป (35)
//                    · วาร์ปสายฟ้าขาว (43) · หมวกแฟชั่นอยู่บนหัวจริงและซ่อนผม (45)
// =====================================================================
// ---------- 🗝️ กุญแจดันเจี้ยน ----------
INVMETA.dgkey=['กุญแจดันเจี้ยน','ได้จากบอสดันเจี้ยน · ใช้เปิดทางลงชั้นถัดไป'];
if(!INVORDER.includes('dgkey'))INVORDER.splice(INVORDER.indexOf('scroll')+1,0,'dgkey');WT.dgkey=.1;if(inv.dgkey===undefined)inv.dgkey=0;
{const _mi=matIcon;matIcon=function(key){if(key!=='dgkey')return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');
  const g=k.createLinearGradient(0,8,0,40);g.addColorStop(0,'#fff0a0');g.addColorStop(1,'#c8901a');k.fillStyle=g;k.strokeStyle='#5a3a08';k.lineWidth=2;
  k.beginPath();k.arc(16,18,9,0,7);k.fill();k.stroke();k.fillStyle='#3a2408';k.beginPath();k.arc(16,18,3.5,0,7);k.fill();
  k.fillStyle=g;k.fillRect(23,15,18,6);k.strokeRect(23,15,18,6);k.fillRect(33,21,4,7);k.strokeRect(33,21,4,7);k.fillRect(38,21,3,5);k.strokeRect(38,21,3,5);
  k.fillStyle='rgba(180,140,255,.6)';k.beginPath();k.arc(16,18,1.6,0,7);k.fill();return c}}
try{const im=new Image();im.src=iconURL('mat:dgkey');DROPIMG.dgkey=im}catch(e){}
// บอสดันเจี้ยน: ดรอปกุญแจแทนการปลดชั้นทันที
{const _mk=mobKill;mobKill=function(m){const dg=D&&D.dg,mx=DG.max,sl=DG.sel;const r=_mk(m);
  try{if(dg&&m.boss){DG.max=mx;DG.sel=sl;saveX();if(dg<DGMAX7()){addDrop('dgkey',m.x,m.y);setTimeout(()=>{try{say('🗝️ บอสดรอปกุญแจดันเจี้ยน! เปิดกล่องแล้วใช้กุญแจลงชั้น '+(dg+1))}catch(_){}},1200)}}}catch(_){}return r}}
function dgUseKey11(next){if((inv.dgkey|0)<=0){say('🔒 ต้องมีกุญแจดันเจี้ยน (ได้จากบอสชั้นนี้)');sfx('thud');return false}
 inv.dgkey--;if(DG.max<next){DG.max=next;DG.sel=next}saveX();try{refreshInv();saveGame(true)}catch(_){}sfx('gem');return true}
// ---------- ทางออก/ทางลง ในดันเจี้ยน ----------
{const _it=interact;interact=function(){
  if(D&&D.dg&&D.chest&&D.chest.open&&Math.hypot(P.x-D.chest.x,P.y-D.chest.y)<46&&D.dg<DGMAX7()){const n=D.dg+1;if(DG.max>=n||dgUseKey11(n))dgGo7(n);return true}
  if(D&&D.dg&&typeof zExitNear==='function'&&zExitNear()){
   if(D.dg>1){const f=D.dg-1;say('⬆️ กลับขึ้นไปชั้น '+f+' (ออกจากดันเจี้ยนต้องใช้ม้วนวาป)');dgGo7(f)}
   else{say('🏰 ออกจากดันเจี้ยนกลับสู่ปราสาท');toTown();setTimeout(()=>{try{if(D&&D.town)enterShop('hall')}catch(_){}},700)}return true}
  if(!D&&!FISH.st){const [x,y]=target();if(y===CV.ty&&Math.abs(x-CV.tx)<=1&&map[y]&&map[y][x]===DOOR){say('🏰 ทางเข้าดันเจี้ยนย้ายไปอยู่ในปราสาทพระราชาแล้ว (ใต้ท้องพระโรง)');sfx('ui');return true}}
  return _it()}}
// ป้ายกล่อง/ทางออก ให้ตรงกับระบบใหม่
window.dgExitLbl11=()=>D&&D.dg?(D.dg>1?'กด E กลับขึ้นชั้น '+(D.dg-1):'กด E ออกสู่ปราสาท'):'กด E / ⚔️ กลับทุ่งหญ้า';
// ---------- ทางลงดันเจี้ยนในท้องพระโรง ----------
const DGST11={x:OX+21.4*T,y:9.3*T};
function drawDgStair11(){const x=DGST11.x,y=DGST11.y,t=performance.now()/1000;ctx.save();
 ctx.fillStyle='#2a2430';ctx.fillRect(x-22,y-46,44,46);ctx.fillStyle='#4a4058';ctx.beginPath();ctx.moveTo(x-26,y-44);ctx.quadraticCurveTo(x,y-70,x+26,y-44);ctx.lineTo(x+22,y-44);ctx.quadraticCurveTo(x,y-62,x-22,y-44);ctx.closePath();ctx.fill();
 ctx.fillStyle='#08060c';ctx.beginPath();ctx.moveTo(x-16,y);ctx.lineTo(x-16,y-34);ctx.quadraticCurveTo(x,y-52,x+16,y-34);ctx.lineTo(x+16,y);ctx.closePath();ctx.fill();
 for(let i=0;i<5;i++){ctx.fillStyle='rgba(120,100,150,'+(.55-i*.1)+')';ctx.fillRect(x-14+i*1.5,y-4-i*5,28-i*3,3)}
 const g=ctx.createRadialGradient(x,y-20,2,x,y-20,30);g.addColorStop(0,'rgba(170,110,255,'+(.35+.15*Math.sin(t*3))+')');g.addColorStop(1,'rgba(120,60,255,0)');ctx.fillStyle=g;ctx.fillRect(x-30,y-50,60,60);
 for(const s of [-1,1]){ctx.fillStyle='#5a4a3a';ctx.fillRect(x+s*28-3,y-40,6,40);const fl=ctx.createRadialGradient(x+s*28,y-44,0,x+s*28,y-44,10);fl.addColorStop(0,'rgba(255,220,120,.95)');fl.addColorStop(1,'rgba(255,120,30,0)');ctx.fillStyle=fl;ctx.fillRect(x+s*28-10,y-56+Math.sin(t*9+s)*1.5,20,20)}
 ctx.restore()}
{const _h=hero;hero=function(){if(!(D&&D.shop==='hall'))return _h();try{if(DGST11.y<=P.y+3){drawDgStair11();_h()}else{_h();drawDgStair11()}
  plate7('🗝️ ทางลงดันเจี้ยน',DGST11.x,DGST11.y-78,Math.hypot(P.x-DGST11.x,P.y-DGST11.y)<50?'#fff':'#d8b8ff');
  if(Math.hypot(P.x-DGST11.x,P.y-DGST11.y)<50&&!ZM.open)plate7('กด E / ⚔️ เลือกชั้นดันเจี้ยน',DGST11.x,DGST11.y+18,'#ffe27a')}catch(e){_h()}}}
{const _es=enterShop;enterShop=function(id){const r=_es(id);try{if(id==='hall'){if(D.owner)DGST11.x=Math.round(2*D.owner.x-ALT7.x);const tx=Math.floor(DGST11.x/T),ty=Math.floor((DGST11.y-4)/T);if(dm[ty])dm[ty][tx]=WL}}catch(_){}return r}}
{const _sa=shopAct;shopAct=function(){if(D&&D.shop==='hall'&&!P.sit&&Math.hypot(P.x-DGST11.x,P.y-DGST11.y)<50){if(ZM.open)closeZMenu();else openDgMenu();return true}return _sa()}}
setInterval(()=>{try{if(ZM.open&&D&&D.shop==='hall'&&Math.hypot(P.x-DGST11.x,P.y-DGST11.y)>90)closeZMenu()}catch(_){}},300);
// เมนูเลือกชั้น: เพิ่มปุ่มใช้กุญแจ · ลงดันจากปราสาท
{const _om=openDgMenu;openDgMenu=function(){_om();try{const n=DG.max+1;if((inv.dgkey|0)>0&&n<=DGMAX7())shopEl.insertAdjacentHTML('beforeend','<button class="mini" onclick="if(dgUseKey11('+n+')){DG.sel='+n+';openDgMenu()}">🗝️ ใช้กุญแจเปิดชั้น '+n+' (มี ×'+inv.dgkey+')</button>');
  shopEl.insertAdjacentHTML('beforeend','<small style="opacity:.75">ออกจากดันเจี้ยนต้องใช้ 📜 ม้วนวาป · ทางออกในดันจะพากลับขึ้นชั้นก่อนหน้า</small>')}catch(_){}}}
window.dgUseKey11=dgUseKey11;
{const _ed=enterDg;enterDg=function(f){if(D&&D.shop){try{leaveShop(true)}catch(_){}}if(D&&D.town){try{exitD()}catch(_){}}return _ed(f)}}
// ลูกศรนำทางภารกิจดันเจี้ยน → ปราสาท
{const _gt=guideTarget;guideTarget=function(){const g=_gt();if(!g||g[2]!=='ดันเจี้ยน')return g;
  if(!D){const tg=TGATE();return[tg[0],tg[1],'เมือง (ปราสาท)']}if(D.town)return[22*T,9.4*T,'ปราสาท (ดันเจี้ยน)'];if(D.shop==='hall')return[DGST11.x,DGST11.y,'ทางลงดันเจี้ยน'];return g}}

// ---------- ⚡ วาร์ปสายฟ้าขาว: ตอนร่ายและตอนถึงเมือง/จุดเกิด ----------
const BOLT11={list:[]};
function boltPath11(x,y,h){const pts=[[x,y-h]];let cx=x,cy=y-h;while(cy<y-4){cy+=8+Math.random()*12;cx+=(Math.random()-.5)*16;pts.push([cx,Math.min(cy,y)])}pts[pts.length-1]=[x,y];return pts}
function drawBolt11(pts,a,w){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineJoin='round';
 for(const [lw,c] of [[w*4,'rgba(150,200,255,'+a*.35+')'],[w*2,'rgba(210,235,255,'+a*.7+')'],[w,'rgba(255,255,255,'+a+')']]){ctx.strokeStyle=c;ctx.lineWidth=lw;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}ctx.restore()}
{const _rf=recallFx;recallFx=function(){_rf();try{const u=1-P.recall/P.recallMax;if(Math.random()<.18+u*.5){const a=Math.random()*6.28;drawBolt11(boltPath11(P.x+Math.cos(a)*14,P.y-4,60+u*60),.6+u*.4,1.2+u)}
   if(Math.random()<u*.3){ctx.save();ctx.fillStyle='rgba(235,245,255,'+(.08+u*.12)+')';ctx.fillRect(P.x-400,P.y-300,800,600);ctx.restore()}}catch(_){}}}
{const _tt=toTown;toTown=function(){const r=_tt.apply(this,arguments);try{BOLT11.list.push({x:P.x,y:P.y,t:0});setTimeout(()=>{try{sfx('thud');shake(4,.25)}catch(_){}},60)}catch(_){}return r}}
{const _h=hero;hero=function(){_h();try{if(!BOLT11.list.length||window.__IN_OTHER8)return;const dt=Math.min(.05,DT||.016);
  for(const b of BOLT11.list.slice()){b.t+=dt;const a=Math.max(0,1-b.t/.75);if(a<=0){BOLT11.list.splice(BOLT11.list.indexOf(b),1);continue}
   if(!b.p||Math.random()<.35)b.p=boltPath11(b.x,b.y,420);drawBolt11(b.p,a,2.4);if(b.t<.12){ctx.save();ctx.fillStyle='rgba(255,255,255,'+(.55*(1-b.t/.12))+')';ctx.fillRect(b.x-800,b.y-600,1600,1200);ctx.restore()}
   ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,50);g.addColorStop(0,'rgba(220,240,255,'+a*.8+')');g.addColorStop(1,'rgba(150,200,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(b.x,b.y,50,18,0,0,7);ctx.fill();ctx.restore()}}catch(_){}}}

// ---------- 🎩 หมวกแฟชั่น: วาดบนหัวจริง (ตามท่าเดิน/นั่ง/ขี่) และซ่อนผม ----------
const _hat11=drawHat;drawHat=function(){};
function hatCap11(x,by,col,edge){ctx.fillStyle=col;ctx.strokeStyle=edge||'rgba(0,0,0,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-8,by-37);ctx.lineTo(x-8,by-45);ctx.quadraticCurveTo(x,by-53,x+8,by-45);ctx.lineTo(x+8,by-37);ctx.closePath();ctx.fill();ctx.stroke()}
function drawHat11(F,x,by,side,f,d){const t=performance.now()/1000,R=(c,a,b,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),w,h)};ctx.save();
 if(F.hat==='kasa'){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x-7,by-37,14,3);ctx.fillStyle='#d8b86a';ctx.strokeStyle='#6a4a1a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-17,by-38);ctx.quadraticCurveTo(x,by-62,x+17,by-38);ctx.quadraticCurveTo(x,by-35,x-17,by-38);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(106,74,26,.5)';for(const o of [-10,-5,0,5,10]){ctx.beginPath();ctx.moveTo(x,by-55);ctx.lineTo(x+o*1.5,by-38);ctx.stroke()}ctx.fillStyle='#a8883a';ctx.beginPath();ctx.arc(x,by-56,2,0,7);ctx.fill()}
 else if(F.hat==='wizard'){hatCap11(x,by,'#1a2a6a','#0a1030');ctx.fillStyle='#1a2a6a';ctx.strokeStyle='#0a1030';ctx.beginPath();ctx.moveTo(x-9,by-46);ctx.lineTo(x+9,by-46);ctx.lineTo(x+(side?-f*12:4),by-72);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(x,by-45,15,3.5,0,0,7);ctx.fill();ctx.stroke();R('#ffd23a',x-9,by-49,18,2.5);ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(x+(side?-f*5:2),by-58,1.8,0,7);ctx.fill()}
 else if(F.hat==='tricorn'){hatCap11(x,by,'#14141a');ctx.fillStyle='#14141a';ctx.strokeStyle='#e8c14a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-15,by-44);ctx.quadraticCurveTo(x,by-62,x+15,by-44);ctx.quadraticCurveTo(x,by-48,x-15,by-44);ctx.fill();ctx.stroke();
  ctx.strokeStyle='#f4f0e8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+(side?-f*4:4),by-52);ctx.quadraticCurveTo(x+(side?-f*14:12),by-61,x+(side?-f*18:16),by-55);ctx.stroke()}
 else if(F.hat==='circlet'){hatCap11(x,by,'#4a2a7a','#2a1048');if(d!=='u'){ctx.fillStyle='#4a2a7a';ctx.fillRect(x-9,by-40,3,12);ctx.fillRect(x+6,by-40,3,12)}R('#d8dce8',x-8,by-46,16,2);R('#b07aff',x-1,by-48,2,3)}
 else if(F.hat==='flamecrown'||F.hat==='icecrown'){const fire=F.hat==='flamecrown';hatCap11(x,by,fire?'#7a1a10':'#c8e8ff',fire?'#3a0a04':'#5a86aa');R(fire?'#ffd060':'#e8f8ff',x-8,by-48,16,3);
  for(let i=0;i<5;i++){const px=x-7+i*3.5,hh=fire?6+Math.sin(t*12+i*2)*2.5:7+(i%2?3:0);ctx.fillStyle=fire?(i%2?'#ff6a1a':'#ffb030'):(i%2?'#bfe8ff':'#ffffff');ctx.beginPath();ctx.moveTo(px-1.6,by-48);ctx.lineTo(px,by-48-hh);ctx.lineTo(px+1.6,by-48);ctx.fill()}
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,by-52,0,x,by-52,14);g.addColorStop(0,fire?'rgba(255,140,40,.45)':'rgba(170,230,255,.45)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-14,by-66,28,28)}
 else{try{const sx=P.x,sy=P.y;P.x=x;P.y=by+3;_hat11(F,f,side,d,t);P.x=sx;P.y=sy}catch(_){}}
 ctx.restore()}
{const _dh=drawHelm;drawHelm=function(R,x,by,side,f,d){_dh(R,x,by,side,f,d);try{if(!window._fashOn||P.dead)return;const F=FASH.body&&OUTFIT[FASH.body];if(F&&F.hat)drawHat11(F,x,by,side,f,d)}catch(_){}}}
{const _ho=window.hairOv8;if(_ho)window.hairOv8=hairOv8=function(R,x,by,side,f,d,at){const F=window._fashOn&&FASH.body&&OUTFIT[FASH.body];if(F&&F.hat)return;return _ho(R,x,by,side,f,d,at)}}

// =====================================================================
