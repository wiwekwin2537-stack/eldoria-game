// fix59 (v4.58) — ชุด+อาวุธดรอปจากบอส 6 เซ็ต (ไม่ต้องคราฟ) ระดับทั่วไป→ตำนาน · tier 11–16
//   11 หนามพงไพร(ทั่วไป Lv10) · 12 เกล็ดอสรพิษ(ไม่ธรรมดา Lv25) · 13 เขี้ยวเหมันต์(หายาก Lv45) · 14 ฟาโรห์สุริยัน(ฮีโร่ Lv65) · 15 มังกรโลหิต(ตำนาน Lv85) · 16 จักรพรรดิเงา(ตำนาน Lv110)
//   บอสตาย → สุ่มได้ 1 ชิ้นของเซ็ตตามเลเวลบอส (เข้ากระเป๋าทันที) — v4.59 ลดเหลือ 2–5% (บอสโลก 50%) แหล่งหลักย้ายไปบอสตำนาน fix62 · คราฟไม่ได้ (โต๊ะคราฟแสดงแค่ 11 เซ็ตเดิม)
try{
const B59=[
 {n:'หนามพงไพร',r:['ทั่วไป','#c8c8d8'],lv:10,pal:{k:'thorn',hi:'#c8e8a0',mid:'#5a8a3a',lo:'#2a4a1a',dk:'#142410',gl:'#9aff6a',gd:'#c8a060',gr:'#3a2a14',pm:'#7ab84a',cloth:'#4a6a2a',pants:'#3a2a14',tr:'rgba(150,255,100,.5)'},
  st:[4,3,5,3,2,22,2],bow:['#3a2a14','#5a8a3a','#9aff6a'],arm:'150,255,110',sb:[{st:{vit:3}},{st:{vit:5,str:3},x:'ผู้พิทักษ์ป่า'}]},
 {n:'เกล็ดอสรพิษ',r:['ไม่ธรรมดา','#7ad86a'],lv:25,pal:{k:'serp',hi:'#bff0d8',mid:'#2a9a7a',lo:'#0e4a3a',dk:'#06201a',gl:'#6affc8',gd:'#e8c860',gr:'#0e2a20',pm:'#3ad8a8',cloth:'#1a6a5a',pants:'#0e3a30',tr:'rgba(80,255,200,.55)'},
  st:[9,5,8,5,4,50,5],bow:['#0e2a20','#2a9a7a','#e8c860'],arm:'80,255,200',sb:[{st:{agi:5}},{st:{agi:8,str:5},x:'พิษอสรพิษ'}]},
 {n:'เขี้ยวเหมันต์',r:['หายาก','#5ab4ff'],lv:45,pal:{k:'frost',hi:'#ffffff',mid:'#a8d8f0',lo:'#4a7aa0',dk:'#1a2a40',gl:'#bfe8ff',gd:'#e8f4ff',gr:'#2a3a50',pm:'#d8f0ff',cloth:'#e8f0f8',pants:'#5a7a98',tr:'rgba(190,235,255,.7)'},
  st:[15,8,13,8,7,95,8],bow:['#2a3a50','#e8f4ff','#7ad8ff'],arm:'120,190,240',sb:[{st:{vit:6,int:4}},{st:{vit:10,str:6,agi:6},x:'ราชันย์หมาป่าน้ำแข็ง'}]},
 {n:'ฟาโรห์สุริยัน',r:['ฮีโร่','#c88aff'],lv:65,pal:{k:'phar',hi:'#fff6c0',mid:'#e0b030',lo:'#7a5a10',dk:'#2a1e04',gl:'#ffe880',gd:'#2a5ac8',gr:'#2a1e04',pm:'#2a5ac8',cloth:'#f0e8d0',pants:'#2a5ac8',tr:'rgba(255,230,120,.75)'},
  st:[22,11,18,11,10,150,12],bow:['#2a1e04','#e0b030','#2a5ac8'],arm:'255,220,110',sb:[{st:{int:8,vit:6}},{st:{int:14,str:10,vit:10},x:'บุตรแห่งดวงอาทิตย์'}]},
 {n:'มังกรโลหิต',r:['ตำนาน','#ffb03a'],lv:85,pal:{k:'blood',hi:'#ffb0a0',mid:'#c81a2a',lo:'#5a0610',dk:'#1a0204',gl:'#ff5a3a',gd:'#ffc040',gr:'#1a0204',pm:'#ff3a3a',cloth:'#7a0a14',pants:'#2a0608',tr:'rgba(255,80,60,.8)'},
  st:[30,14,23,14,13,210,17],bow:['#1a0204','#c81a2a','#ffc040'],arm:'255,90,60',sb:[{st:{str:12,vit:8}},{st:{str:20,vit:16,agi:10},x:'เลือดมังกรเดือด'}]},
 {n:'จักรพรรดิเงา',r:['ตำนาน','#ffb03a'],lv:110,pal:{k:'void',hi:'#d8c8ff',mid:'#3a2a5a',lo:'#120a22',dk:'#06020c',gl:'#b07aff',gd:'#e8e8ff',gr:'#06020c',pm:'#9a5aff',cloth:'#1a1028',pants:'#0e0818',tr:'rgba(180,120,255,.85)'},
  st:[40,19,30,19,17,310,24],bow:['#06020c','#3a2a5a','#b07aff'],arm:'180,120,255',sb:[{st:{str:14,int:14}},{st:{str:24,vit:22,agi:16,int:20},x:'ผู้ครองห้วงเงา'}]}];
const T0_59=TIERS.length;window.T0_59=T0_59;window.B59=B59;window.CRAFTN59=SETN12.length;
B59.forEach((S,i)=>{const t=T0_59+i;S.t=t;
 TIERS.push(S.pal);TNAMES.push(S.n);SETN12.push(S.n);RARE12.push(S.r);PARTS12.push(['scale','core']);ING12.push('ingDm');MATKEY.push('ingDm');MATN.push('แท่งเพชร');
 SWATK.push(S.st[0]);ADEF.helm.push(S.st[1]);ADEF.chest.push(S.st[2]);ADEF.pants.push(S.st[3]);ADEF.arm.push(S.st[4]);NECKHP.push(S.st[5]);RINGATK.push(S.st[6]);
 BOWT.push(S.bow);ARMC.push(S.arm);GEMC.push(S.pal.gl);GEMC6.push(S.pal.gl);SETB.push(S.sb);GWT[t]=1;
 for(const k in KINDS){if(k==='axe'||k==='pick')continue;const id=k+t;if(ITEMS[id])continue;
  ITEMS[id]={id,kind:k,tier:t,tool:k==='sword'||k==='staff'||k==='bow',boss59:1,name:KINDS[k]+S.n,
   stat:(k==='sword'?'โจมตี +'+SWATK[t]:k==='staff'?'โจมตีเวท +'+SWATK[t]+' · ยิงลูกเวท (INT)':k==='bow'?'โจมตีธนู +'+SWATK[t]+' · ยิงธนู (AGI)':k==='neck'?'เลือดสูงสุด +'+NECKHP[t]:k==='ring'?'โจมตี +'+RINGATK[t]:'ป้องกัน +'+ADEF[k][t])+' · 👑 ดรอปจากบอส · ต้อง Lv.'+S.lv}}});
// ---------- หน้าตา ----------
const sc59=(k,body,fn)=>{k.save();k.beginPath();body.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath();k.clip();fn();k.restore()};
const thorn59=(k,x,y,dx,dy,c)=>{k.fillStyle=c||'#2a1a0a';k.beginPath();k.moveTo(x-2*dy,y+2*dx);k.lineTo(x+dx*6,y+dy*6);k.lineTo(x+2*dy,y-2*dx);k.closePath();k.fill()};
const leaf59=(k,x,y,a,s,c)=>{k.save();k.translate(x,y);k.rotate(a);k.fillStyle=c||'#7ad84a';k.strokeStyle='#1a3a0e';k.lineWidth=.8;k.beginPath();k.ellipse(0,0,s*2.2,s,0,0,7);k.fill();k.stroke();k.beginPath();k.moveTo(-s*2,0);k.lineTo(s*2,0);k.stroke();k.restore()};
const scl59=(k,x0,y0,x1,y1,r,c1,c2)=>{for(let y=y0,row=0;y<y1;y+=r*1.3,row++)for(let x=x0+(row%2?r:0);x<x1;x+=r*2){k.fillStyle=c1;k.beginPath();k.arc(x,y,r,0,Math.PI);k.fill();k.strokeStyle=c2;k.lineWidth=.7;k.stroke()}};
const fur59=(k,x0,x1,y,len,c)=>{k.strokeStyle=c||'#ffffff';k.lineWidth=1.4;for(let x=x0;x<=x1;x+=2.4){k.beginPath();k.moveTo(x,y);k.lineTo(x+(Math.sin(x)*2),y+len*(.6+.4*Math.abs(Math.sin(x*1.7))));k.stroke()}};
const helmB=side=>side?[[14,56],[14,28],[22,10],[42,10],[52,24],[54,46],[40,58]]:[[11,56],[11,28],[20,10],[44,10],[53,28],[53,56],[40,60],[24,60]];
const chestB=side=>side?[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]:[[15,12],[25,10],[32,16],[39,10],[49,12],[52,30],[46,57],[18,57],[12,30]];
const pantsB=[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]];
const visor=(k,side,col,eye)=>{k.fillStyle=col||'#0a0a0a';side?k.fillRect(40,30,14,8):k.fillRect(17,31,30,8);if(eye)for(const x of side?[47]:[25,39])glow13(k,x,34,5,eye)};
const D59=[
 // 11 หนามพงไพร
 {helm(k,Q,t,v){const side=v==='side',b=helmB(side);P13(k,Q,2,7,b);sc59(k,b,()=>{for(let y=14;y<58;y+=7){L13(k,'rgba(40,24,10,.55)',1.2,[[8,y],[60,y+3]])}});
   for(let i=0;i<6;i++)thorn59(k,side?18+i*6:14+i*7,14-Math.abs(i-2.5)*1.2,0,-1);leaf59(k,side?20:16,22,-.6,3.2);leaf59(k,side?48:48,22,.6,3.2,'#9aee5a');if(v==='back')return;visor(k,side,'#14240c','rgba(150,255,100,.95)')},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,2,11,b);sc59(k,b,()=>{for(let i=0;i<5;i++)L13(k,'rgba(40,24,10,.6)',1.4,[[10,18+i*9],[54,22+i*9]])});
   L13(k,'#3a6a1a',2.6,side?[[24,14],[38,30],[26,46],[40,56]]:[[14,14],[30,26],[20,40],[44,52]]);for(let i=0;i<6;i++)thorn59(k,side?26+i*2:16+i*5.5,side?18+i*7:16+i*7,1,0,'#2a1a0a');
   for(const s of side?[1]:[-1,1])leaf59(k,side?32:32+s*19,13,s*.4,4.2);if(v==='front'){ORB14(k,32,28,4.5,'#9aff6a','#1a3a0e');glow13(k,32,28,10,'rgba(150,255,100,.5)')}},
  pants(k,Q,t){P13(k,Q,2,13,pantsB);L13(k,'#3a6a1a',2,[[16,14],[22,30],[18,46],[24,58]]);L13(k,'#3a6a1a',2,[[48,14],[42,30],[46,46],[40,58]]);for(const x of [20,44])leaf59(k,x,22,.3,2.6)},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,2,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);for(let i=0;i<4;i++)thorn59(k,x0+18,16+i*9,1,0);leaf59(k,x0+10,30,.8,3)}},
  sword(k,Q,t){P13(k,{hi:'#8a6a4a',mid:'#5a3e26',lo:'#2e1e10',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,3,2,[[27,48],[37,48],[38,20],[33,2],[26,18]]);for(let i=0;i<5;i++){thorn59(k,26,40-i*6,-1,0);thorn59(k,38,42-i*6,1,0)}leaf59(k,22,48,-.3,3);leaf59(k,42,48,.3,3);glow13(k,32,20,10,'rgba(150,255,100,.4)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#3a2a14','#7a5a32',1);L13(k,'#5a8a3a',2,[[30,10],[24,4],[22,12]]);L13(k,'#5a8a3a',2,[[34,10],[40,4],[42,12]]);ORB14(k,32,10,5,'#9aff6a','#1a3a0e');leaf59(k,24,16,-.6,3);leaf59(k,40,16,.6,3);glow13(k,32,10,13,'rgba(150,255,100,.55)')},
  bowdeco(c,s){leaf59(c,-6,s*22,s*.8,2.4)},bowshape:[8,3.6,1]},
 // 12 เกล็ดอสรพิษ
 {helm(k,Q,t,v){const side=v==='side',b=side?[[14,58],[12,26],[22,8],[44,8],[58,22],[56,40],[40,46],[40,58]]:[[10,58],[10,26],[20,8],[44,8],[54,26],[54,58],[40,60],[24,60]];P13(k,Q,3,7,b);sc59(k,b,()=>scl59(k,8,10,60,58,3.4,'rgba(255,255,255,.18)','rgba(6,32,26,.6)'));
   if(v==='back')return;k.fillStyle='#06201a';side?k.fillRect(38,28,20,8):k.fillRect(16,30,32,9);for(const x of side?[44,52]:[22,42]){k.fillStyle='#ffffff';k.beginPath();k.moveTo(x-2,38);k.lineTo(x,46);k.lineTo(x+2,38);k.fill()}
   for(const x of side?[48]:[25,39]){glow13(k,x,33,5,'rgba(255,230,60,.95)');k.fillStyle='#ffe040';k.fillRect(x-.8,31,1.6,4)}},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,3,11,b);sc59(k,b,()=>scl59(k,8,12,58,58,3,'rgba(255,255,255,.16)','rgba(6,32,26,.55)'));
   L13(k,Q.gd,2,side?[[24,30],[40,30]]:[[14,30],[50,30]]);if(v==='front'){k.strokeStyle=Q.gd;k.lineWidth=2.2;k.beginPath();k.moveTo(26,20);k.bezierCurveTo(40,24,24,34,38,40);k.stroke();k.fillStyle=Q.gd;k.beginPath();k.ellipse(38,41,3,2,0,0,7);k.fill();glow13(k,32,30,12,'rgba(80,255,200,.4)')}},
  pants(k,Q,t){P13(k,Q,3,13,pantsB);sc59(k,pantsB,()=>scl59(k,12,12,52,58,2.8,'rgba(255,255,255,.15)','rgba(6,32,26,.5)'));L13(k,Q.gd,1.8,[[14,12],[50,12]])},
  arm(k,Q,t){for(const x0 of [8,36]){const b=[[x0+2,10],[x0+17,8],[x0+21,50],[x0-1,54]];P13(k,Q,3,50+x0,b);sc59(k,b,()=>scl59(k,x0,10,x0+22,54,2.6,'rgba(255,255,255,.18)','rgba(6,32,26,.5)'));L13(k,Q.gd,1.6,[[x0+1,26],[x0+19,24]])}},
  sword(k,Q,t){P13(k,{hi:'#e8c860',mid:'#a08020',lo:'#4a3a08',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);const w=[];for(let i=0;i<=8;i++){const y=48-i*5.5;w.push([31+Math.sin(i*1.4)*3-3,y])}w.push([33,1]);for(let i=8;i>=0;i--){const y=48-i*5.5;w.push([33+Math.sin(i*1.4)*3+3,y])}P13(k,Q,3,2,w);L13(k,'#06201a',1,[[32,46],[32,6]]);k.fillStyle=Q.gd;k.fillRect(22,47,20,3);glow13(k,32,20,11,'rgba(80,255,200,.45)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#0e2a20','#2a9a7a');k.strokeStyle='#3ad8a8';k.lineWidth=3;k.beginPath();for(let y=56;y>12;y-=1){const x=32+Math.sin(y*.35)*5;y===56?k.moveTo(x,y):k.lineTo(x,y)}k.stroke();k.fillStyle='#2a9a7a';k.beginPath();k.ellipse(32,9,6,5,0,0,7);k.fill();k.fillStyle='#ffe040';k.fillRect(29,7,2,2);k.fillRect(33,7,2,2);glow13(k,32,9,13,'rgba(80,255,200,.55)')},
  bowdeco(c,s){c.fillStyle='#ffffff';c.beginPath();c.moveTo(-5,s*20);c.lineTo(-9,s*27);c.lineTo(-3,s*23);c.closePath();c.fill()},bowshape:[9,3.4,0]},
 // 13 เขี้ยวเหมันต์
 {helm(k,Q,t,v){const side=v==='side',b=side?[[12,58],[12,26],[20,8],[44,6],[58,24],[58,38],[42,44],[40,58]]:[[9,58],[9,26],[20,6],[44,6],[55,26],[55,58],[40,60],[24,60]];P13(k,{hi:'#ffffff',mid:'#e8eef4',lo:'#9aa8b8',dk:'#2a3a50',gl:'#fff',gd:'#fff',k:0},1,7,b);
   sc59(k,b,()=>fur59(k,8,58,8,8,'rgba(150,170,190,.6)'));for(const s of side?[1]:[-1,1]){const x=side?24:32+s*14;k.fillStyle='#e8eef4';k.strokeStyle='#2a3a50';k.lineWidth=1.2;k.beginPath();k.moveTo(x-5,12);k.lineTo(x+s*2,-2);k.lineTo(x+5,12);k.closePath();k.fill();k.stroke()}
   if(v==='back')return;visor(k,side,'#1a2a40','rgba(140,220,255,1)');for(const x of side?[44,52]:[20,28,36,44]){k.fillStyle='#bfe8ff';k.beginPath();k.moveTo(x-2,39);k.lineTo(x,47);k.lineTo(x+2,39);k.fill()}},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,2,11,b);for(const s of side?[1]:[-1,1]){const x=side?32:32+s*18;E13(k,{hi:'#ffffff',mid:'#e8eef4',lo:'#a8b8c8',gl:'#fff',k:0},1,30+s,x,15,12,8);fur59(k,x-11,x+11,16,7,'#ffffff')}
   for(let i=0;i<3;i++)shard13(k,Q,side?28:22+i*8,52,6,10+i%2*4,40+i);if(v==='front'){k.fillStyle='#e8f4ff';k.beginPath();k.moveTo(32,24);k.lineTo(37,32);k.lineTo(32,42);k.lineTo(27,32);k.closePath();k.fill();glow13(k,32,32,11,'rgba(140,220,255,.6)')}},
  pants(k,Q,t){P13(k,Q,2,13,pantsB);fur59(k,14,50,10,8,'#ffffff');for(const x of [22,42])shard13(k,Q,x-3,54,6,9,x)},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,2,50+x0,[[x0+2,10],[x0+17,8],[x0+21,50],[x0-1,54]]);fur59(k,x0+1,x0+18,10,7,'#ffffff');shard13(k,Q,x0+15,42,6,10,x0)}},
  sword(k,Q,t){P13(k,{hi:'#e8eef4',mid:'#9aa8b8',lo:'#4a5a6a',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);const b=[[26,48],[38,48]];for(let i=0;i<7;i++){b.push([39-(i%2)*3,42-i*5.5])}b.push([33,1]);for(let i=6;i>=0;i--){b.push([25+(i%2)*3,42-i*5.5])}P13(k,Q,2,2,b);fur59(k,22,42,46,5,'#ffffff');glow13(k,32,20,12,'rgba(170,230,255,.55)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#4a7aa0','#e8f4ff');for(const s of [-1,1]){k.fillStyle='#e8eef4';k.strokeStyle='#2a3a50';k.beginPath();k.moveTo(32+s*3,14);k.lineTo(32+s*12,2);k.lineTo(32+s*7,16);k.closePath();k.fill();k.stroke()}ORB14(k,32,12,5.5,'#bfe8ff','#2a3a50');glow13(k,32,12,14,'rgba(170,230,255,.6)')},
  bowdeco(c,s){c.fillStyle='#e8f4ff';c.beginPath();c.moveTo(-5,s*19);c.lineTo(-12,s*25);c.lineTo(-4,s*24);c.closePath();c.fill()},bowshape:[10,3,2]},
 // 14 ฟาโรห์สุริยัน
 {helm(k,Q,t,v){const side=v==='side',b=side?[[10,60],[12,24],[22,8],[42,8],[52,22],[52,40],[44,46],[46,60]]:[[6,60],[10,24],[20,8],[44,8],[54,24],[58,60],[44,52],[20,52]];P13(k,Q,4,7,b);
   sc59(k,b,()=>{for(let y=12;y<62;y+=6){k.fillStyle='rgba(42,90,200,.85)';k.fillRect(0,y,64,3)}});if(v==='back')return;
   k.fillStyle=Q.gd;k.strokeStyle='#2a1e04';k.lineWidth=1;k.beginPath();side?(k.moveTo(46,12),k.quadraticCurveTo(54,8,52,18)):(k.moveTo(28,12),k.quadraticCurveTo(32,2,36,12));k.closePath();k.fill();k.stroke();
   k.fillStyle='#2a1e04';side?k.fillRect(40,28,14,10):k.fillRect(18,28,28,10);for(const x of side?[47]:[25,39]){k.fillStyle='#ffffff';k.fillRect(x-3,31,6,3);k.fillStyle='#14100a';k.fillRect(x-1,31,2,3)}},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,{hi:'#ffffff',mid:'#f0e8d0',lo:'#b8a880',gl:'#fff',k:0},1,11,b);
   if(v!=='back'){for(let r=0;r<4;r++){k.strokeStyle=r%2?'#2a5ac8':'#e0b030';k.lineWidth=3;k.beginPath();side?k.arc(32,10,10+r*3.2,.1*Math.PI,.9*Math.PI):k.arc(32,8,12+r*3.4,.12*Math.PI,.88*Math.PI);k.stroke()}}
   L13(k,Q.mid,2.4,side?[[24,42],[40,42]]:[[16,44],[48,44]]);if(v==='front'){k.fillStyle='#e0b030';k.beginPath();k.arc(32,34,5,0,7);k.fill();glow13(k,32,34,11,'rgba(255,220,100,.6)')}},
  pants(k,Q,t){P13(k,{hi:'#ffffff',mid:'#f0e8d0',lo:'#b8a880',gl:'#fff',k:0},1,13,pantsB);P13(k,Q,4,14,[[24,10],[40,10],[38,46],[32,52],[26,46]]);sc59(k,[[24,10],[40,10],[38,46],[32,52],[26,46]],()=>{for(let y=14;y<52;y+=6){k.fillStyle='rgba(42,90,200,.85)';k.fillRect(0,y,64,2.5)}})},
  arm(k,Q,t){for(const x0 of [8,36]){const b=[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]];P13(k,Q,4,50+x0,b);sc59(k,b,()=>{for(let y=14;y<54;y+=7){k.fillStyle='rgba(42,90,200,.85)';k.fillRect(0,y,64,3)}})}},
  sword(k,Q,t){P13(k,{hi:'#e0b030',mid:'#7a5a10',lo:'#2a1e04',gl:'#fff',k:0},1,1,[[29,48],[35,48],[35,60],[29,60]]);P13(k,Q,4,2,[[29,48],[35,48],[36,30],[44,20],[46,8],[40,2],[38,12],[32,22],[28,30]]);k.fillStyle='#2a5ac8';k.fillRect(24,46,16,3);glow13(k,38,14,10,'rgba(255,230,120,.5)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#7a5a10','#e0b030');k.strokeStyle='#e0b030';k.lineWidth=3.2;k.beginPath();k.ellipse(32,10,5,7,0,0,7);k.stroke();L13(k,'#e0b030',3.2,[[24,18],[40,18]]);ORB14(k,32,10,3,'#2a5ac8','#0a1a4a');glow13(k,32,12,15,'rgba(255,230,120,.55)')},
  bowdeco(c,s){c.fillStyle='#e0b030';c.beginPath();c.arc(-5.6,s*22.3,3,0,7);c.fill();c.fillStyle='#2a5ac8';c.beginPath();c.arc(-5.6,s*22.3,1.4,0,7);c.fill()},bowshape:[9,3.8,1]},
 // 15 มังกรโลหิต
 {helm(k,Q,t,v){const side=v==='side';for(const s of side?[1]:[-1,1]){const hx=side?22:32+s*15;L13(k,'#1a0204',5,[[hx,18],[hx+s*(side?-10:12),6],[hx+s*(side?-6:20),-2]]);L13(k,Q.gd,2.6,[[hx,18],[hx+s*(side?-10:12),6],[hx+s*(side?-6:20),-2]])}
   const b=side?[[14,56],[14,30],[22,12],[40,10],[52,22],[60,34],[54,44],[44,46],[40,58]]:[[11,56],[11,28],[20,12],[32,6],[44,12],[53,28],[53,56],[44,58],[20,58]];P13(k,Q,5,18,b);sc59(k,b,()=>scl59(k,8,10,60,58,3.2,'rgba(255,255,255,.14)','rgba(26,2,4,.6)'));
   if(v==='back')return;k.fillStyle='#1a0204';side?k.fillRect(40,30,18,8):k.fillRect(17,30,30,9);for(const x of side?[47]:[25,39]){glow13(k,x,34,6,'rgba(255,200,60,1)');k.fillStyle='#ffe060';k.fillRect(x-.8,32,1.6,4)}},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,5,11,b);sc59(k,b,()=>scl59(k,8,12,58,58,3,'rgba(255,255,255,.14)','rgba(26,2,4,.55)'));
   for(const s of side?[1]:[-1,1]){const x=side?32:32+s*20;for(let i=0;i<3;i++){k.fillStyle=Q.gd;k.strokeStyle='#1a0204';k.lineWidth=1;k.beginPath();k.moveTo(x-6+i*6,12);k.lineTo(x-4+i*6+s*2,-1);k.lineTo(x-2+i*6,12);k.fill();k.stroke()}}
   if(v==='front'){ORB14(k,32,30,6,'#ff3a3a','#3a0004');glow13(k,32,30,14,'rgba(255,80,40,.65)');L13(k,Q.gd,1.6,[[26,30],[20,22]]);L13(k,Q.gd,1.6,[[38,30],[44,22]])}},
  pants(k,Q,t){P13(k,Q,5,13,pantsB);sc59(k,pantsB,()=>scl59(k,12,12,52,58,2.8,'rgba(255,255,255,.13)','rgba(26,2,4,.5)'));L13(k,Q.gd,1.8,[[14,12],[50,12]]);for(const x of [23,41])glow13(k,x,40,4,'rgba(255,120,60,.9)')},
  arm(k,Q,t){for(const x0 of [8,36]){const b=[[x0+2,10],[x0+17,8],[x0+21,50],[x0-2,54]];P13(k,Q,5,50+x0,b);sc59(k,b,()=>scl59(k,x0,10,x0+22,54,2.6,'rgba(255,255,255,.14)','rgba(26,2,4,.5)'));for(let i=0;i<3;i++){k.fillStyle=Q.gd;k.beginPath();k.moveTo(x0+18,16+i*10);k.lineTo(x0+25,18+i*10);k.lineTo(x0+19,22+i*10);k.fill()}}},
  sword(k,Q,t){P13(k,{hi:'#3a0a0a',mid:'#1a0204',lo:'#000',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,5,2,[[26,48],[38,48],[41,36],[37,30],[41,22],[36,14],[32,0],[27,12],[24,22],[28,30],[23,38]]);L13(k,'#ffc040',1.2,[[32,46],[32,6]]);
   k.fillStyle=Q.gd;k.beginPath();k.moveTo(18,46);k.lineTo(32,50);k.lineTo(46,46);k.lineTo(42,52);k.lineTo(22,52);k.closePath();k.fill();glow13(k,32,22,13,'rgba(255,80,40,.55)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#1a0204','#c81a2a',1);for(const a of [-.9,-.3,.3,.9]){L13(k,Q.gd,2.2,[[32,18],[32+Math.sin(a)*10,12-Math.cos(a)*6],[32+Math.sin(a)*7,6]])}ORB14(k,32,9,5.5,'#ff3a3a','#3a0004');glow13(k,32,9,15,'rgba(255,80,40,.65)')},
  bowdeco(c,s){c.fillStyle='#c81a2a';c.beginPath();c.moveTo(-5,s*16);c.lineTo(-14,s*24);c.lineTo(-9,s*26);c.lineTo(-4,s*22);c.closePath();c.fill()},bowshape:[11,3.6,2]},
 // 16 จักรพรรดิเงา
 {helm(k,Q,t,v){const side=v==='side',b=side?[[14,58],[12,28],[22,10],[44,10],[54,28],[54,58],[40,52]]:[[9,58],[11,28],[20,10],[44,10],[53,28],[55,58],[44,52],[20,52]];P13(k,Q,5,7,b);
   for(let i=0;i<5;i++){const x=side?18+i*7:14+i*9,h=i===2?20:i%2?12:15;shard13(k,{hi:'#ffffff',mid:'#3a2a5a',lo:'#06020c',gl:'#b07aff',k:0},x-3,12,6,h,x)}glow13(k,32,4,16,'rgba(180,120,255,.45)');if(v==='back')return;
   k.fillStyle='#06020c';side?k.fillRect(40,30,14,8):k.fillRect(17,31,30,8);ORB14(k,side?47:32,34,3.4,'#e8c8ff','#5a2a9a');glow13(k,side?47:32,34,8,'rgba(200,140,255,.9)')},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,5,11,b);for(const s of side?[1]:[-1,1]){const x=side?32:32+s*21;shard13(k,{hi:'#ffffff',mid:'#3a2a5a',lo:'#06020c',gl:'#b07aff',k:0},x-4,2,8,16,x)}
   L13(k,Q.gd,1.8,side?[[24,40],[40,40]]:[[16,42],[48,42]]);sc59(k,b,()=>{k.strokeStyle='rgba(180,120,255,.55)';k.lineWidth=1;for(let i=0;i<5;i++){k.beginPath();k.moveTo(32,30);k.lineTo(32+Math.cos(i*1.25)*30,30+Math.sin(i*1.25)*30);k.stroke()}});
   if(v==='front'){k.fillStyle='#000';k.beginPath();k.arc(32,30,7,0,7);k.fill();k.strokeStyle='#b07aff';k.lineWidth=1.6;k.beginPath();k.arc(32,30,7,0,7);k.stroke();glow13(k,32,30,15,'rgba(180,120,255,.6)')}},
  pants(k,Q,t){P13(k,Q,5,13,pantsB);L13(k,Q.gd,1.6,[[14,12],[50,12]]);for(const x of [23,41]){shard13(k,{hi:'#ffffff',mid:'#3a2a5a',lo:'#06020c',gl:'#b07aff',k:0},x-3,46,6,12,x);glow13(k,x,30,4,'rgba(180,120,255,.8)')}},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,5,50+x0,[[x0+2,10],[x0+17,8],[x0+21,50],[x0-2,54]]);shard13(k,{hi:'#ffffff',mid:'#3a2a5a',lo:'#06020c',gl:'#b07aff',k:0},x0+6,40,8,14,x0);glow13(k,x0+10,24,4,'rgba(180,120,255,.85)')}},
  sword(k,Q,t){P13(k,{hi:'#3a2a5a',mid:'#120a22',lo:'#000',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,5,2,[[25,48],[39,48],[41,14],[32,0],[23,14]]);k.strokeStyle='#b07aff';k.lineWidth=1.3;k.beginPath();k.moveTo(32,44);k.lineTo(29,34);k.lineTo(34,26);k.lineTo(30,16);k.lineTo(32,6);k.stroke();
   k.fillStyle=Q.gd;k.fillRect(19,46,26,3.5);ORB14(k,32,47.5,2.6,'#e8c8ff','#5a2a9a');glow13(k,32,24,15,'rgba(180,120,255,.6)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#06020c','#3a2a5a',1);k.strokeStyle='rgba(200,160,255,.9)';k.lineWidth=1.4;k.beginPath();k.ellipse(32,10,11,4,.3,0,7);k.stroke();k.beginPath();k.ellipse(32,10,11,4,-.5,0,7);k.stroke();k.fillStyle='#000';k.beginPath();k.arc(32,10,5.5,0,7);k.fill();k.strokeStyle='#b07aff';k.beginPath();k.arc(32,10,5.5,0,7);k.stroke();glow13(k,32,10,16,'rgba(180,120,255,.65)')},
  bowdeco(c,s){c.fillStyle='#b07aff';c.beginPath();c.moveTo(-5,s*18);c.lineTo(-10,s*28);c.lineTo(-3,s*24);c.closePath();c.fill()},bowshape:[10,3.4,2]}];
D59.forEach((d,i)=>{const t=T0_59+i;S13[t]={helm:d.helm,chest:d.chest,pants:d.pants,arm:d.arm};SW13.push(d.sword);STAFF14.push(d.staff);BOWDECO14.push(d.bowdeco);BOWSHAPE14.push(d.bowshape)});
for(const k in SPRC)delete SPRC[k];for(const k in TICON)if(!/^(axe|pick)/.test(k))delete TICON[k];for(const k in IURL)if(/^item:/.test(k)&&!/^item:(axe|pick)/.test(k))delete IURL[k];
// ---------- ใส่ได้ตามเลเวลของเซ็ต (ข้ามเงื่อนไข Lv.105/128 ของ tier>=9 เดิม) ----------
{const _eq=equipItem;equipItem=function(id){const it=ITEMS[id];if(it&&it.boss59){const S=B59[it.tier-T0_59];if(P.lv<S.lv){say('🔒 '+it.name+' ต้อง Lv.'+S.lv+' ขึ้นไป');sfx('thud');return}const lv=P.lv;P.lv=150;try{return _eq.apply(this,arguments)}finally{P.lv=lv;try{recalcStats()}catch(e){}}}return _eq.apply(this,arguments)};window.equipItem=equipItem}
// ---------- ดรอปจากบอส ----------
function pick59(m){if(m&&m.wb10)return 5;let L=m&&(m.L||m.lv)||P.lv;if(D&&D.dg)L=Math.max(L,Math.min(150,D.dg));return L<20?0:L<40?1:L<60?2:L<80?3:L<100?4:5}
const PIECES59=['sword','staff','bow','helm','chest','pants','arm','neck','ring'];
function drop59(m){const si=pick59(m),S=B59[si],kind=PIECES59[Math.random()*PIECES59.length|0],id=kind+S.t;if(!ITEMS[id])return;
 GEAR[id]=(GEAR[id]|0)+1;try{refreshInv();saveGame(true)}catch(e){}
 try{flash(S.r[1],.3);sfx('chest');banner('👑 ดรอปจากบอส!',ITEMS[id].name+' ['+S.r[0]+']','')}catch(e){try{say('👑 ได้ '+ITEMS[id].name+' ['+S.r[0]+'] จากบอส!')}catch(_){}}
 try{sysSay('👑 บอสดรอป '+ITEMS[id].name+' ['+S.r[0]+'] — เปิดกระเป๋า 🎒 เพื่อสวมใส่ (ต้อง Lv.'+S.lv+')')}catch(e){}
 try{if(si>=4&&typeof chatAnn==='function')chatAnn((P.name||'ผู้กล้า')+' ได้ '+ITEMS[id].name+' ['+S.r[0]+'] จากบอส!')}catch(e){}}
window.drop59=drop59;
// คราฟไม่ได้: สูตรว่าง (กันโค้ดเดิมที่เรียก recipe12 กับ tier ใหม่แล้วพัง)
{const _rc=recipe12;recipe12=function(id){const it=ITEMS[id];if(it&&it.boss59)return {coin:999999999};return _rc.apply(this,arguments)};window.recipe12=recipe12}
{const _cs=craftSet12;craftSet12=function(id){const it=ITEMS[id];if(it&&it.boss59){say('👑 '+it.name+' คราฟไม่ได้ — ดรอปจากบอสเท่านั้น');sfx('thud');return}return _cs.apply(this,arguments)};window.craftSet12=craftSet12}
{const _mk=mobKill;mobKill=function(m){const was=m&&!m.dead,boss=m&&m.boss;const r=_mk.apply(this,arguments);try{if(was&&boss&&m.dead&&!m.d59&&!(m.pvp7)){m.d59=1;const ch=m.lb62?0:m.wb10?.5:D&&D.tower10?.05:D&&D.dg?.02:.03;if(Math.random()<ch)drop59(m)}}catch(e){}return r};window.mobKill=mobKill}
}catch(e){console.warn('fix59',e)}
