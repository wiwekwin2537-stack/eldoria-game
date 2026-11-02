// fix14.js (v4.23) — คทา/ธนู 9 ทรงตามเซ็ต · เซ็ตใหม่ 3 เซ็ต (ระดับ 7–9) · ด้ามอาวุธใช้ไม้ประจำแมพ
// =====================================================================
// ---------- วัตถุดิบจากแมพใหม่ ----------
const MAPMAT14={woodE:['ไม้โบราณ','ตัดได้ใน "ป่าหมอกโบราณ" · ทำด้ามอาวุธระดับต้น–กลาง','#8a6a3a','#3a2a14','wood'],
 woodF:['ไม้ทนไฟ','ตัดได้ใน "หุบเขาภูเขาไฟ" · ทำด้ามอาวุธระดับสูง','#3a2a2a','#ff6a2a','wood'],
 woodS:['ไม้วิญญาณ','ตัดได้ใน "ถ้ำเงามืด" · ทำคทาและธนู','#4a3a6a','#c8a8ff','wood'],
 mistc:['ผลึกหมอก','ดรอปจากมอนใน "ป่าหมอกโบราณ"','#bff0e8','#3aa890','gem'],
 obsid:['หินออบซิเดียน','ดรอปจากมอนใน "หุบเขาภูเขาไฟ"','#2a2230','#ff5a1a','gem'],
 soulc:['ผลึกวิญญาณ','ดรอปจากมอนใน "ถ้ำเงามืด"','#e8d8ff','#7a3ad8','gem']};
for(const k in MAPMAT14){INVMETA[k]=[MAPMAT14[k][0],MAPMAT14[k][1]];if(!INVORDER.includes(k))INVORDER.splice(INVORDER.indexOf('ingSt'),0,k);WT[k]=k.startsWith('wood')?.6:.2;if(inv[k]===undefined)inv[k]=0}
{const _mi=matIcon;matIcon=function(key){const M=MAPMAT14[key];if(!M)return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';k.strokeStyle='rgba(15,10,5,.8)';k.lineWidth=1.6;
  if(M[4]==='wood'){for(const [y,s] of [[30,1],[20,.9]]){const g=k.createLinearGradient(0,y-6,0,y+6);g.addColorStop(0,M[2]);g.addColorStop(1,M[3]==='#ff6a2a'?'#1a1010':'#2a1a0a');k.fillStyle=g;k.beginPath();k.rect(8,y-6*s,30,12*s);k.fill();k.stroke();
    k.fillStyle=M[2];k.beginPath();k.ellipse(38,y,4*s,6*s,0,0,7);k.fill();k.stroke();k.strokeStyle=M[3];k.lineWidth=1;k.beginPath();k.ellipse(38,y,2*s,3.4*s,0,0,7);k.stroke();k.strokeStyle='rgba(15,10,5,.8)';k.lineWidth=1.6}
   if(key==='woodF'){k.fillStyle='rgba(255,120,30,.8)';for(const x of [14,22,30])k.fillRect(x,28,4,1.6)}if(key==='woodS'){const g=k.createRadialGradient(24,24,0,24,24,22);g.addColorStop(0,'rgba(200,170,255,.45)');g.addColorStop(1,'rgba(200,170,255,0)');k.fillStyle=g;k.fillRect(0,0,48,48)}return c}
  const g=k.createRadialGradient(20,18,1,24,24,18);g.addColorStop(0,'#ffffff');g.addColorStop(.4,M[2]);g.addColorStop(1,M[3]);k.fillStyle=g;k.beginPath();k.moveTo(24,6);k.lineTo(36,18);k.lineTo(32,40);k.lineTo(16,40);k.lineTo(12,18);k.closePath();k.fill();k.stroke();
  k.strokeStyle='rgba(255,255,255,.6)';k.lineWidth=1;k.beginPath();k.moveTo(24,6);k.lineTo(22,22);k.lineTo(16,40);k.moveTo(22,22);k.lineTo(32,40);k.stroke();return c}}
for(const k in MAPMAT14)try{const im=new Image();im.src=iconURL('mat:'+k);DROPIMG[k]=im}catch(e){}
// ---------- ขยายระดับอุปกรณ์เป็น 9 ระดับ (เซ็ตใหม่ 7–9) ----------
const NEWSET14=[['พิทักษ์พงไพร','ลึกลับ','#3affc8','mistc','woodE'],['อัคคีภูผา','อมตะ','#ff3a2a','obsid','woodF'],['วิญญาณอนธการ','ปฐมกาล','#e8e0ff','soulc','woodS']];
const NEWPAL14=[
 {k:'mist',hi:'#d8fff4',mid:'#4ab89a',lo:'#1e5a4a',dk:'#0a2a22',gl:'#6affd8',gd:'#c8e8a0',gr:'#1a2a1a',pm:'#8af0d0',cloth:'#2a6a58',pants:'#1e4a3e',tr:'rgba(110,255,216,.6)'},
 {k:'lava',hi:'#ff9a5a',mid:'#3a2a30',lo:'#1a1014',dk:'#0a0608',gl:'#ff5a1a',gd:'#ffb030',gr:'#1a0a06',pm:'#ff7a3a',cloth:'#2a1a1e',pants:'#1a1014',tr:'rgba(255,100,30,.7)'},
 {k:'soul',hi:'#f0e8ff',mid:'#5a4a8a',lo:'#241a40',dk:'#0c0818',gl:'#c8a0ff',gd:'#b8f0ff',gr:'#0c0818',pm:'#a888ff',cloth:'#2a2048',pants:'#181030',tr:'rgba(200,160,255,.7)'}];
SWATK.push(16,21,27);ADEF.helm.push(9,11,13);ADEF.chest.push(14,17,21);ADEF.pants.push(9,11,13);ADEF.arm.push(8,10,12);NECKHP.push(100,140,190);RINGATK.push(8,11,15);
MATKEY.push('ingDm','ingDm','ingDm');MATN.push('แท่งเพชร','แท่งเพชร','แท่งเพชร');
for(let i=0;i<3;i++){TIERS.push(NEWPAL14[i]);TNAMES.push(NEWSET14[i][0]);SETN12.push(NEWSET14[i][0]);RARE12.push([NEWSET14[i][1],NEWSET14[i][2]]);PARTS12.push(['scale','core']);ING12.push('ingDm')}
BOWT.splice(0,6,['#1a1a24','#3e3e52','#a070ff'],['#3a2414','#6a9a4a','#c8e8a0'],['#3a1408','#d84a2a','#ffb070'],['#20384a','#a8dcf4','#ffffff'],['#1e1640','#7a68b8','#e8e0ff'],['#5a3a08','#ffe08a','#fffbe8']);BOWT.push(['#0e3a30','#4ab89a','#bff0e8'],['#1a1014','#3a2a30','#ff7a3a'],['#140c24','#5a4a8a','#e8d8ff']);
ARMC.push('110,255,216','255,100,30','200,160,255');GEMC.push('#6affd8','#ff5a1a','#c8a0ff');GEMC6.push('#6affd8','#ff5a1a','#c8a0ff');
SETB.push([{st:{vit:8}},{st:{str:12,vit:12,agi:8,int:8},x:'ผู้พิทักษ์พงไพร'}],[{st:{str:8}},{st:{str:16,vit:12,end:10},x:'เปลวไฟนิรันดร์'}],[{st:{int:10}},{st:{int:16,agi:14,str:10,vit:10},x:'จ้าวแห่งวิญญาณ'}]);
for(let t=6;t<9;t++)for(const k in KINDS){if(k==='axe'||k==='pick')continue;const id=k+t;if(ITEMS[id])continue;
 ITEMS[id]={id,kind:k,tier:t,tool:k==='sword'||k==='staff'||k==='bow',name:KINDS[k]+TNAMES[t],
  stat:k==='sword'?'โจมตี +'+SWATK[t]:k==='staff'?'โจมตีเวท +'+SWATK[t]+' · ยิงลูกเวท (INT)':k==='bow'?'โจมตีธนู +'+SWATK[t]+' · ยิงธนู (AGI)':k==='neck'?'เลือดสูงสุด +'+NECKHP[t]:k==='ring'?'โจมตี +'+RINGATK[t]:'ป้องกัน +'+ADEF[k][t]}}
try{SMQ.push({lv:85,n:'ตำราช่าง: เซ็ต'+TNAMES[6],need:{mistc:12,woodE:20,ingDm:10},w:'ผลึกหมอกและไม้โบราณ หาได้ใน "ป่าหมอกโบราณ" (ประตูมิติในเหมืองเหล็กร้าง)'},
 {lv:92,n:'ตำราช่าง: เซ็ต'+TNAMES[7],need:{obsid:14,woodF:20,ingDm:14},w:'หินออบซิเดียนและไม้ทนไฟ หาได้ใน "หุบเขาภูเขาไฟ" (ประตูมิติในถ้ำทองแดงลาวา)'},
 {lv:98,n:'ตำราช่าง: เซ็ต'+TNAMES[8],need:{soulc:16,woodS:20,ingDm:18},w:'ผลึกวิญญาณและไม้วิญญาณ หาได้ใน "ถ้ำเงามืด" (ประตูมิติในห้วงลึกเพชร)'})}catch(e){}
// ---------- สูตร: ด้ามอาวุธใช้ไม้ประจำแมพ · เซ็ต 7–9 ใช้วัตถุดิบหายาก ----------
{const _rc=recipe12;recipe12=function(id){const it=ITEMS[id],t=it.tier,m=(RECIPE[it.kind]||{m:3}).m,w=WEAP12.includes(it.kind);
  if(t>=6){const S=NEWSET14[t-6],R={ingDm:m*2,ess:m+4+(t-6)*2,[S[3]]:m*2+(t-6)*2,scale:m,dust:m};if(w)R[it.kind==='sword'?'woodF':'woodS']=4+(t-6)*2;R[S[4]]=(R[S[4]]||0)+(w?6:3);R.coin=50*(t+1)*m*2;return R}
  const R=_rc(id);if(w&&t>0){const n=R.wood||0;delete R.wood;const wk=(it.kind!=='sword'&&t>=2)?'woodS':t>=3?'woodF':'woodE';R[wk]=Math.max(2,n-1)}return R}}
window.recipe12=recipe12;
// ---------- ทรงคทา 9 แบบ ----------
const G14=(k,x,y,r,c)=>{const g=k.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(x-r,y-r,r*2,r*2)};
const ORB14=(k,x,y,r,c,dark)=>{const g=k.createRadialGradient(x-r*.3,y-r*.35,1,x,y,r);g.addColorStop(0,'#ffffff');g.addColorStop(.35,c);g.addColorStop(1,dark||'#1a1a2a');k.fillStyle=g;k.beginPath();k.arc(x,y,r,0,7);k.fill();k.strokeStyle=OL;k.lineWidth=1.2;k.stroke();k.fillStyle='rgba(255,255,255,.85)';k.beginPath();k.ellipse(x-r*.35,y-r*.4,r*.3,r*.2,-.6,0,7);k.fill()};
const SHAFT14=(k,Q,t,c1,c2,twist)=>{const g=k.createLinearGradient(28,0,36,0);g.addColorStop(0,c1);g.addColorStop(.5,c2);g.addColorStop(1,c1);k.fillStyle=g;k.strokeStyle=OL;k.lineWidth=1.4;k.beginPath();
 if(twist){k.moveTo(30,20);for(let y=20;y<=60;y+=4)k.lineTo(30+Math.sin(y*.4)*1.4,y);k.lineTo(34+Math.sin(60*.4)*1.4,60);for(let y=60;y>=20;y-=4)k.lineTo(34+Math.sin(y*.4)*1.4,y)}else k.rect(29.5,20,5,40);k.closePath();k.fill();k.stroke()};
const STAFF14=[
 (k,Q,t)=>{SHAFT14(k,Q,t,'#1a1a24','#4a4a5e',1);P13(k,Q,t,1,[[32,22],[20,18],[12,6],[22,10],[26,2],[32,10],[38,2],[42,10],[52,6],[44,18]]);ORB14(k,32,12,6,'#b48cff','#2a1048');G14(k,32,12,12,'rgba(170,120,255,.45)')},
 (k,Q,t)=>{SHAFT14(k,Q,t,'#3a2414','#8a6a3a',1);L13(k,'#3a2414',3,[[32,22],[22,12],[20,4]]);L13(k,'#3a2414',3,[[32,22],[42,12],[44,4]]);L13(k,'#5a3a1e',2,[[32,22],[32,16]]);leaf13(k,20,6,-2,1.1);leaf13(k,44,6,-1,1.1);leaf13(k,28,40,Math.PI,.9);ORB14(k,32,13,5.5,'#8aff6a','#1a4a12');G14(k,32,13,11,'rgba(140,255,110,.45)')},
 (k,Q,t)=>{SHAFT14(k,Q,t,'#3a1408','#c8743a');for(let y=26;y<58;y+=6){k.fillStyle=Q.lo;k.beginPath();k.arc(32,y,3.2,Math.PI,0);k.fill()}for(const s of [-1,1])for(let i=0;i<2;i++){L13(k,'#fff0d8',2.2,[[32+s*4,22],[32+s*(9+i*2),14-i*4],[32+s*(5+i*3),4+i*2]])}ORB14(k,32,12,6,'#ff7a2a','#5a0a04');G14(k,32,12,12,'rgba(255,120,30,.5)')},
 (k,Q,t)=>{for(let y=22;y<60;y+=8)P13(k,Q,t,y,[[29,y],[35,y],[34,y+8],[30,y+8]]);for(const [x,h] of [[22,14],[27,20],[37,20],[42,14]])shard13(k,Q,x-3,22,6,h,x);ORB14(k,32,13,5.5,'#bff0ff','#2a5a8a');G14(k,32,13,12,'rgba(170,240,255,.5)')},
 (k,Q,t)=>{SHAFT14(k,Q,t,'#3a2e6a','#c8c0e8');moon13(k,32,13,11,Q.hi);ORB14(k,30,14,4.5,'#e8e0ff','#3a2e6a');L13(k,Q.gd,1.2,[[28,40],[36,40]]);G14(k,32,13,12,'rgba(220,210,255,.45)')},
 (k,Q,t)=>{SHAFT14(k,Q,t,'#9a7020','#fff2b8');wing13(k,28,20,-1,.9);wing13(k,36,20,1,.9);k.strokeStyle='rgba(255,230,140,.9)';k.lineWidth=1.6;k.beginPath();k.ellipse(32,12,10,3,0,0,7);k.stroke();ORB14(k,32,13,5.5,'#ffe060','#8a5a08');G14(k,32,13,13,'rgba(255,240,170,.55)')},
 (k,Q,t)=>{SHAFT14(k,Q,t,'#1e4a3e','#8ad0b8',1);for(const s of [-1,1]){L13(k,'#d8c8a0',2.2,[[32,20],[32+s*8,12],[32+s*14,4]]);L13(k,'#d8c8a0',1.6,[[32+s*8,12],[32+s*12,12]])}leaf13(k,26,30,Math.PI+.4,.8,'#4ab89a');ORB14(k,32,13,6,'#6affd8','#0e3a30');for(let i=0;i<3;i++)G14(k,24+i*8,24+i*3,7,'rgba(200,255,240,.25)')},
 (k,Q,t)=>{SHAFT14(k,Q,t,'#1a1014','#3a2a30');for(let y=24;y<58;y+=7)L13(k,'#ff6a1a',1.2,[[30,y],[33,y+3],[31,y+6]]);P13(k,Q,t,3,[[24,22],[40,22],[38,8],[32,2],[26,8]]);ORB14(k,32,13,5.5,'#ffb030','#5a0a04');G14(k,32,13,13,'rgba(255,100,30,.55)')},
 (k,Q,t)=>{for(let y=22;y<60;y+=5){k.fillStyle='#d8d0e8';k.strokeStyle=OL;k.lineWidth=1;k.beginPath();k.ellipse(32,y+2,3,2.2,0,0,7);k.fill();k.stroke()}k.fillStyle='#e8e0f0';k.beginPath();k.arc(32,13,8,0,7);k.fill();k.stroke();k.fillStyle='#14102a';k.beginPath();k.arc(29,12,1.8,0,7);k.arc(35,12,1.8,0,7);k.fill();k.fillRect(30,16,4,2);G14(k,29,12,5,'rgba(200,160,255,.9)');G14(k,35,12,5,'rgba(200,160,255,.9)');L13(k,'#8a7aa8',1,[[24,22],[28,30],[24,38]]);L13(k,'#8a7aa8',1,[[40,22],[36,30],[40,38]]);G14(k,32,13,15,'rgba(200,160,255,.4)')}];
paintStaff=function(k,t){try{return STAFF14[t|0](k,TIERS[t],t)}catch(e){console.warn('[staff14]',e)}};
// ---------- ทรงธนู 9 แบบ (ใช้ทั้งในมือและไอคอน) ----------
const BOWDECO14=[
 (c,s,C)=>{c.fillStyle='#2a2a3a';c.beginPath();c.moveTo(-5,s*22);c.lineTo(-12,s*28);c.lineTo(-4,s*26);c.lineTo(-8,s*32);c.lineTo(-1,s*25);c.closePath();c.fill()},
 (c,s,C)=>{leaf13(c,-5,s*22,s>0?2.4:-2.4,.9);leaf13(c,2,s*10,s>0?1.2:-1.2,.7,'#7ac84a')},
 (c,s,C)=>{c.fillStyle='#fff0d8';c.strokeStyle='#2a0a06';c.lineWidth=.8;c.beginPath();c.moveTo(-6,s*21);c.lineTo(-10,s*28);c.lineTo(-3,s*23);c.fill();c.stroke();c.beginPath();c.moveTo(5,s*8);c.lineTo(10,s*11);c.lineTo(5,s*13);c.fill();c.stroke()},
 (c,s,C)=>{c.fillStyle='#e8f8ff';c.strokeStyle='#5a8ab0';c.lineWidth=.8;c.beginPath();c.moveTo(-6,s*20);c.lineTo(-7,s*30);c.lineTo(-3,s*22);c.fill();c.stroke();c.beginPath();c.moveTo(6,s*6);c.lineTo(12,s*4);c.lineTo(6,s*10);c.fill();c.stroke()},
 (c,s,C)=>{moon13(c,-6,s*22,4,'#e8e0ff')},
 (c,s,C)=>{wing13(c,-4,s*20,-1,.5);c.fillStyle='#ffe060';c.beginPath();c.arc(-5.6,s*22.3,2,0,7);c.fill()},
 (c,s,C)=>{c.strokeStyle='#d8c8a0';c.lineWidth=1.6;c.beginPath();c.moveTo(-5,s*22);c.lineTo(-11,s*27);c.moveTo(-8,s*24.5);c.lineTo(-7,s*30);c.stroke()},
 (c,s,C)=>{c.strokeStyle='#ff6a1a';c.lineWidth=1.1;c.beginPath();c.moveTo(4,s*6);c.lineTo(6,s*12);c.lineTo(3,s*17);c.stroke();c.fillStyle='#ffb030';c.beginPath();c.arc(-5.6,s*22.3,2,0,7);c.fill()},
 (c,s,C)=>{c.fillStyle='rgba(220,200,255,.55)';c.beginPath();c.moveTo(-5,s*22);c.quadraticCurveTo(-14,s*30,-8,s*34);c.quadraticCurveTo(-6,s*28,-2,s*24);c.fill();c.fillStyle='#14102a';c.beginPath();c.arc(1,s*12,1.2,0,7);c.fill()}];
const BOWSHAPE14=[ // [ความโค้ง, ความหนา, ทรงปลาย]
 [6,3,0],[8,3.6,1],[9,3.8,0],[6,3,2],[10,2.6,1],[8,3.2,1],[9,3.6,0],[7,4,2],[10,3,1]];
function drawBowShape14(c,tier,pull,arrow){const C=BOWT[tier]||BOWT[0],[cv,th,tp]=BOWSHAPE14[tier]||BOWSHAPE14[0],sx=-5-pull*11;
 c.strokeStyle=tier===8?'rgba(220,200,255,.9)':'rgba(235,230,215,.9)';c.lineWidth=.9;c.beginPath();c.moveTo(-5,-22);c.lineTo(sx,0);c.lineTo(-5,22);c.stroke();
 const limb=s=>{c.beginPath();c.moveTo(1,0);if(tp===2){c.lineTo(cv*.8,s*8);c.lineTo(cv*.5,s*16);c.lineTo(-6,s*22)}else c.bezierCurveTo(cv+1,s*7,cv,s*17,-2,s*22);if(tp===1)c.quadraticCurveTo(-8,s*26,-6,s*22.2);else c.quadraticCurveTo(-4.5,s*23.5,-6,s*22.2)};
 c.lineCap='round';c.lineJoin='round';c.strokeStyle='#100a06';c.lineWidth=th+1.6;limb(-1);c.stroke();limb(1);c.stroke();c.strokeStyle=C[1];c.lineWidth=th;limb(-1);c.stroke();limb(1);c.stroke();
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(3,-3);c.bezierCurveTo(cv+1.5,-9,cv+.5,-16,0,-21);c.stroke();
 for(const s of [-1,1])try{BOWDECO14[tier](c,s,C)}catch(e){}
 c.fillStyle=C[0];c.fillRect(-1,-5,5,10);c.fillStyle=C[2];c.fillRect(-1,-5.5,5,1.4);c.fillRect(-1,4.1,5,1.4);
 if(tier>=2){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(4,0,0,4,0,26);g.addColorStop(0,'rgba('+(ARMC[tier]||'255,230,150')+',.3)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(-24,-28,52,56);c.restore()}
 if(arrow){c.strokeStyle='#7a5a32';c.lineWidth=1.6;c.beginPath();c.moveTo(sx,0);c.lineTo(14,0);c.stroke();c.fillStyle=C[2];c.beginPath();c.moveTo(19,0);c.lineTo(13,-2.6);c.lineTo(13,2.6);c.closePath();c.fill();c.fillStyle='#e04a3a';c.beginPath();c.moveTo(sx,0);c.lineTo(sx-3,-2.5);c.lineTo(sx+3,0);c.lineTo(sx-3,2.5);c.closePath();c.fill();
  if(pull>.6){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(17,0,0,17,0,7);g.addColorStop(0,'rgba(255,240,180,.8)');g.addColorStop(1,'rgba(255,200,80,0)');c.fillStyle=g;c.fillRect(10,-7,14,14);c.restore()}}}
drawBow6=function(x,y,aim,tier,pull,arrow,sc){ctx.save();ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc||1,sc||1);try{drawBowShape14(ctx,tier|0,pull||0,arrow)}catch(e){}ctx.restore()};
paintBow=function(k,t){k.save();k.translate(34,32);k.scale(-1.3,1.3);try{drawBowShape14(k,t|0,0,false)}catch(e){}k.restore()};
// ---------- ชุดเซ็ตใหม่ 7–9 ----------
const MOSS14={hi:'#8ab86a',mid:'#3a6a3a',lo:'#1e3a1e',dk:'#0a1a0a',gl:'#6affd8',gd:'#c8e8a0',k:0};
S13[6]={
 helm(k,Q,t,v){const side=v==='side';P13(k,MOSS14,1,7,side?[[14,58],[14,28],[24,12],[44,12],[54,28],[52,42],[40,40],[40,58]]:[[10,58],[12,28],[22,12],[42,12],[52,28],[54,58],[44,50],[20,50]]);
  for(const s of side?[-1]:[-1,1]){const x=side?24:32+s*12;L13(k,'#3a2a14',3.4,[[x,16],[x+s*6,6],[x+s*14,2]]);L13(k,'#d8c8a0',2.2,[[x,16],[x+s*6,6],[x+s*14,2]]);L13(k,'#d8c8a0',1.6,[[x+s*6,6],[x+s*4,-1]])}
  for(let i=0;i<5;i++)leaf13(k,14+i*9,22+(i%2)*3,1.4+i*.2,.8,i%2?'#4ab89a':'#6ac86a');if(v==='back')return;
  k.fillStyle='#0a1a14';side?k.fillRect(40,30,12,9):k.fillRect(18,30,28,10);for(const x of side?[46]:[26,38])G14(k,x,34,6,'rgba(110,255,216,.95)')},
 chest(k,Q,t,v){const side=v==='side';const body=side?[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]:[[15,12],[25,10],[32,16],[39,10],[49,12],[52,30],[46,57],[18,57],[12,30]];
  P13(k,MOSS14,1,11,body);for(let i=0;i<4;i++)P13(k,Q,t,30+i,side?[[24,16+i*10],[40,15+i*10],[40,22+i*10],[24,23+i*10]]:[[18,18+i*9],[46,17+i*9],[45,23+i*9],[19,24+i*9]]);
  for(const s of side?[1]:[-1,1]){const x=side?32:32+s*20;E13(k,MOSS14,1,40+s,x,15,10,7);L13(k,'#d8c8a0',2,[[x,10],[x+s*6,2],[x+s*10,0]])}
  if(v==='front'){ORB14(k,32,30,4,'#6affd8','#0e3a30');G14(k,32,30,10,'rgba(110,255,216,.5)')}L13(k,'#2e6a1e',2.4,[[15,47],[32,50],[49,47]])},
 pants(k,Q,t){P13(k,MOSS14,1,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);for(const x of [17,34])for(let y=24;y<58;y+=7)L13(k,Q.mid,2.4,[[x,y],[x+13,y+3]]);for(const x of [23.5,40.5])G14(k,x,40,4,'rgba(110,255,216,.8)')},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,MOSS14,1,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);P13(k,Q,t,60+x0,[[x0+2,24],[x0+18,22],[x0+19,38],[x0+1,40]]);G14(k,x0+10,31,4,'rgba(110,255,216,.9)')}}};
const lava14=(k,pts)=>{L13(k,'rgba(255,90,20,.95)',1.8,pts);L13(k,'rgba(255,220,120,.9)',.7,pts)};
S13[7]={
 helm(k,Q,t,v){const side=v==='side';for(const s of side?[1]:[-1,1]){const hx=side?20:32+s*14;P13(k,Q,t,5+s,[[hx,18],[hx+s*(side?-14:14),4],[hx+s*(side?-6:8),20]])}
  const dom=side?[[14,56],[14,28],[22,10],[44,10],[54,26],[54,46],[40,58]]:[[11,56],[11,28],[20,10],[44,10],[53,28],[53,56],[40,60],[24,60]];P13(k,Q,t,8,dom);
  lava14(k,side?[[20,20],[26,30],[22,44]]:[[16,20],[22,30],[18,44]]);lava14(k,side?[[44,16],[48,26]]:[[48,20],[42,30],[46,44]]);if(v==='back')return;
  k.fillStyle='#0a0406';side?k.fillRect(40,30,14,8):k.fillRect(17,31,30,8);for(const x of side?[48]:[25,39])G14(k,x,34,6,'rgba(255,140,30,1)')},
 chest(k,Q,t,v){const side=v==='side';const body=side?[[23,12],[41,12],[43,30],[40,57],[24,57],[21,30]]:[[13,12],[25,9],[32,16],[39,9],[51,12],[53,30],[46,57],[18,57],[11,30]];P13(k,Q,t,11,body);
  lava14(k,side?[[26,20],[34,32],[28,48]]:[[20,20],[26,32],[22,48]]);if(!side)lava14(k,[[44,20],[38,32],[42,48]]);
  for(const s of side?[1]:[-1,1]){const x=side?32:32+s*21;P13(k,Q,t,30+s,[[x-9,18],[x-6,4],[x,12],[x+5,2],[x+9,18]])}
  if(v==='front'){ORB14(k,32,30,5,'#ffb030','#5a0a04');G14(k,32,30,12,'rgba(255,100,30,.6)')}},
 pants(k,Q,t){P13(k,Q,t,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);lava14(k,[[20,14],[24,34],[20,56]]);lava14(k,[[44,14],[40,34],[44,56]])},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,t,50+x0,[[x0+2,10],[x0+17,8],[x0+21,50],[x0-2,54]]);lava14(k,[[x0+5,14],[x0+12,30],[x0+6,48]]);for(let i=0;i<3;i++)P13(k,Q,t,i+x0,[[x0+2+i*6,50],[x0+5+i*6,58],[x0+8+i*6,50]])}}};
const GHOST14={hi:'#f0e8ff',mid:'#8a7aa8',lo:'#3a2a58',dk:'#14102a',gl:'#c8a0ff',gd:'#b8f0ff',k:0};
S13[8]={
 helm(k,Q,t,v){const side=v==='side';P13(k,Q,t,7,side?[[14,60],[12,28],[22,10],[44,10],[54,28],[54,60],[40,52]]:[[8,60],[10,28],[20,8],[44,8],[54,28],[56,60],[44,52],[32,58],[20,52]]);
  for(let i=0;i<3;i++)G14(k,20+i*12,6+(i%2)*3,7,'rgba(200,160,255,.55)');if(v==='back')return;
  k.fillStyle='#e8e0f0';k.strokeStyle=OL;k.lineWidth=1.2;k.beginPath();side?k.ellipse(44,34,8,10,0,0,7):k.ellipse(32,35,12,13,0,0,7);k.fill();k.stroke();
  k.fillStyle='#14102a';for(const x of side?[47]:[27,37]){k.beginPath();k.arc(x,33,3,0,7);k.fill();G14(k,x,33,6,'rgba(200,160,255,1)')}k.fillRect(side?42:29,41,side?6:6,2.4)},
 chest(k,Q,t,v){const side=v==='side';const body=side?[[23,12],[41,12],[43,32],[42,60],[22,60],[21,32]]:[[14,12],[25,10],[32,16],[39,10],[50,12],[53,32],[50,60],[14,60],[11,32]];P13(k,Q,t,11,body);
  if(!side)for(let i=0;i<4;i++){L13(k,'#e8e0f0',2.2,[[32,20+i*7],[20,23+i*7]]);L13(k,'#e8e0f0',2.2,[[32,20+i*7],[44,23+i*7]])}L13(k,'#e8e0f0',2.6,side?[[32,16],[32,48]]:[[32,16],[32,48]]);
  L13(k,'#8a8a9a',1.6,[[12,44],[20,48],[28,44],[36,48],[44,44],[52,48]]);if(v==='front')G14(k,32,30,12,'rgba(200,160,255,.5)')},
 pants(k,Q,t){P13(k,Q,t,13,[[14,10],[50,10],[53,30],[50,60],[40,54],[34,60],[32,34],[30,60],[24,54],[14,60],[11,30]]);L13(k,'#8a8a9a',1.6,[[16,20],[48,22]])},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,GHOST14,1,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);for(let y=16;y<50;y+=9)L13(k,'#8a8a9a',1.6,[[x0,y],[x0+19,y+2]]);G14(k,x0+10,30,6,'rgba(200,160,255,.6)')}}};
// ดาบเซ็ตใหม่
SW13.push(
 (k,Q,t)=>{P13(k,{hi:'#8a6a3a',mid:'#5a3a1e',lo:'#2a1a0a',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,t,2,[[27,46],[37,46],[39,18],[32,3],[25,18]]);for(const s of [-1,1])L13(k,'#d8c8a0',2,[[32,46],[32+s*10,40],[32+s*14,44]]);leaf13(k,26,30,Math.PI,.8,'#6ac86a');G14(k,32,20,11,'rgba(110,255,216,.45)')},
 (k,Q,t)=>{P13(k,{hi:'#3a2a30',mid:'#1a1014',lo:'#0a0608',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,t,2,[[24,46],[40,46],[41,30],[38,14],[32,1],[26,14],[23,30]]);lava14(k,[[32,44],[30,34],[34,22],[32,8]]);P13(k,Q,t,3,[[18,44],[46,44],[42,50],[22,50]]);G14(k,32,24,12,'rgba(255,100,30,.5)')},
 (k,Q,t)=>{for(let y=50;y<61;y+=3){k.fillStyle='#e8e0f0';k.beginPath();k.ellipse(32,y,3,1.6,0,0,7);k.fill()}P13(k,GHOST14,1,2,[[28,46],[36,46],[38,16],[32,2],[26,16]]);k.fillStyle='#e8e0f0';k.beginPath();k.arc(32,48,5,0,7);k.fill();k.fillStyle='#14102a';k.beginPath();k.arc(30,47,1.2,0,7);k.arc(34,47,1.2,0,7);k.fill();G14(k,32,22,13,'rgba(200,160,255,.55)')});
for(const k in SPRC)delete SPRC[k];for(const k in TICON)if(!/^(axe|pick)/.test(k))delete TICON[k];for(const k in IURL)if(/^item:/.test(k)&&!/^item:(axe|pick)/.test(k))delete IURL[k];

// =====================================================================
