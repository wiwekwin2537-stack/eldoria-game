// fix101 (v4.86) — ⚔️ ชุด+อาวุธใหม่ 5 เซ็ต ดรอปในดันเจี้ยนนครวารี (เจ้าของสั่ง 2026-10-14 15:33: ดีไซน์ใหม่ ไม่ใช่เปลี่ยนสี · อาวุธทุกอาชีพไม่ซ้ำกัน · สเตตัสลงตัวกับพาสซีฟ)
//  ต่อท้ายระดับเดิมแบบ fix59 (TIERS/SWATK/ADEF/…/S13/SW13/STAFF14/BOWDECO14/BOWSHAPE14) · tier T0_101..T0_101+4
//  เซ็ต (ธีมตามดันเจี้ยน): ❄️ ราชินีหิมะ Lv150 · 🍄 ราชันเห็ดพิษ Lv160 · 🔥 แม่ทัพอสูรเพลิง Lv170 · 🌊 ผู้พิทักษ์สมุทร Lv180 · 🌠 เทพดาราร่วง Lv190
//  - ชุด 4 ชิ้น + ดาบ/คทา/ธนู วาดใหม่ทั้งหมดตามธีม · อาวุธประจำอาชีพ 8 อาชีพ (นินจา ทวน พาลาดิน มังค์ นักบวช เนโคร ซัมมอนเนอร์ สไนเปอร์) ทรงใหม่ต่างกันทุกธีม (ห่อ wpn25 / drawBow6)
//  - ใส่ครบ 4 ชิ้น: พลังพิเศษผ่าน PTX (เข้ากับต้นไม้พาสซีฟ: dmg/crit/hp/dr/cdr/mpr) + โบนัสสเตตัส 2/4 ชิ้น (SETB)
//  - ดรอป: ดันเจี้ยนนครวารีแต่ละแห่ง → เซ็ตธีมเดียวกัน (บอส 40% · หัวหน้า 4% · มอน 0.5%) · ต้องเลเวลตามเซ็ต
try{
const B101=[
 {n:'ราชินีหิมะ',r:['ตำนาน','#ffb03a'],lv:150,dg:'dg96a',pal:{k:'ice101',hi:'#ffffff',mid:'#9ad8f0',lo:'#3a6a90',dk:'#10203a',gl:'#c8f4ff',gd:'#e8f8ff',gr:'#1a2a40',pm:'#bfeaff',cloth:'#dceefa',pants:'#4a6a8a',tr:'rgba(190,240,255,.8)'},
  st:[55,26,41,26,23,430,33],bow:['#1a2a40','#e8f8ff','#7ad8ff'],arm:'170,235,255',sb:[{st:{vit:12,int:8}},{st:{vit:22,int:16,str:12},x:'ใจราชินีน้ำแข็ง'}],fx:{dr:.06,hp:.08},fxd:'ลดดาเมจที่โดน +6% · เลือด +8%'},
 {n:'ราชันเห็ดพิษ',r:['ตำนาน','#ffb03a'],lv:160,dg:'dg96b',pal:{k:'mush101',hi:'#f0c8ff',mid:'#8a3ab8',lo:'#3a1050',dk:'#1a0624',gl:'#b0ff6a',gd:'#f4ead0',gr:'#2a1a10',pm:'#c86aff',cloth:'#5a2a6a',pants:'#2a3a14',tr:'rgba(176,255,106,.7)'},
  st:[62,29,46,29,26,480,37],bow:['#2a1a10','#8a3ab8','#b0ff6a'],arm:'176,255,106',sb:[{st:{agi:12,vit:8}},{st:{agi:22,vit:14,str:12},x:'สปอร์มรณะ'}],fx:{dmg:.05,hpr:.004,crit:.02},fxd:'ดาเมจ +5% · คริ +2% · ฟื้นเลือดต่อเนื่อง'},
 {n:'แม่ทัพอสูรเพลิง',r:['เทพนิยาย','#ff6ad8'],lv:170,dg:'dg96c',pal:{k:'fire101',hi:'#ffb070',mid:'#4a2420',lo:'#140808',dk:'#060202',gl:'#ff5a1a',gd:'#ffcc40',gr:'#0a0404',pm:'#ff3a1a',cloth:'#4a0a08',pants:'#1a0606',tr:'rgba(255,90,30,.85)'},
  st:[70,32,51,32,29,540,41],bow:['#0a0404','#4a2420','#ff5a1a'],arm:'255,90,30',sb:[{st:{str:14,vit:8}},{st:{str:26,vit:16,agi:12},x:'โลหิตอสูรเดือด'}],fx:{dmg:.08,crit:.03},fxd:'ดาเมจ +8% · คริ +3%'},
 {n:'ผู้พิทักษ์สมุทร',r:['เทพนิยาย','#ff6ad8'],lv:180,dg:'dg96d',pal:{k:'sea101',hi:'#c8fff4',mid:'#1a8a8a',lo:'#0a3a4a',dk:'#04161e',gl:'#6affe0',gd:'#ffd86a',gr:'#0a2028',pm:'#3ad8c8',cloth:'#e8e0c8',pants:'#0e4a5a',tr:'rgba(90,255,220,.75)'},
  st:[78,36,57,36,32,600,46],bow:['#0a2028','#1a8a8a','#ffd86a'],arm:'90,255,220',sb:[{st:{vit:14,int:12}},{st:{vit:26,int:20,str:14},x:'สายเลือดสมุทร'}],fx:{hp:.10,mpr:.3,dr:.04},fxd:'เลือด +10% · ลดดาเมจ +4% · ฟื้นมานาเร็ว'},
 {n:'เทพดาราร่วง',r:['อมตะ','#6affff'],lv:190,dg:'dg96e',pal:{k:'star101',hi:'#ffffff',mid:'#f0e0a0',lo:'#3a3a8a',dk:'#0a0a2a',gl:'#ffe88a',gd:'#9ad8ff',gr:'#14143a',pm:'#c8b0ff',cloth:'#1a1a4a',pants:'#14143a',tr:'rgba(255,240,170,.9)'},
  st:[88,40,64,40,36,680,52],bow:['#14143a','#f0e0a0','#9ad8ff'],arm:'255,240,170',sb:[{st:{str:16,int:16}},{st:{str:28,int:28,agi:18,vit:18},x:'ผู้ร่วงจากดารา'}],fx:{dmg:.07,crit:.04,cdr:.06},fxd:'ดาเมจ +7% · คริ +4% · คูลดาวน์ -6%'}];
const T0_101=TIERS.length;window.T0_101=T0_101;window.B101=B101;
B101.forEach((S,i)=>{const t=T0_101+i;S.t=t;
 TIERS.push(S.pal);TNAMES.push(S.n);SETN12.push(S.n);RARE12.push(S.r);PARTS12.push(['scale','core']);ING12.push('ingDm');MATKEY.push('ingDm');MATN.push('แท่งเพชร');
 SWATK.push(S.st[0]);ADEF.helm.push(S.st[1]);ADEF.chest.push(S.st[2]);ADEF.pants.push(S.st[3]);ADEF.arm.push(S.st[4]);NECKHP.push(S.st[5]);RINGATK.push(S.st[6]);
 BOWT.push(S.bow);ARMC.push(S.arm);GEMC.push(S.pal.gl);GEMC6.push(S.pal.gl);SETB.push(S.sb);GWT[t]=1;
 for(const k in KINDS){if(k==='axe'||k==='pick')continue;const id=k+t;if(ITEMS[id])continue;
  ITEMS[id]={id,kind:k,tier:t,tool:k==='sword'||k==='staff'||k==='bow',boss59:1,c2101:1,name:KINDS[k]+S.n,
   stat:(k==='sword'?'โจมตี +'+SWATK[t]:k==='staff'?'โจมตีเวท +'+SWATK[t]+' · ยิงลูกเวท (INT)':k==='bow'?'โจมตีธนู +'+SWATK[t]+' · ยิงธนู (AGI)':k==='neck'?'เลือดสูงสุด +'+NECKHP[t]:k==='ring'?'โจมตี +'+RINGATK[t]:'ป้องกัน +'+ADEF[k][t])+' · 🌀 ดรอปในดันเจี้ยนนครวารี · ต้อง Lv.'+S.lv+' · ครบ 4 ชิ้น: '+S.fxd}}});
// ---------- ตัวช่วยวาด ----------
const helmB=side=>side?[[14,56],[14,28],[22,10],[42,10],[52,24],[54,46],[40,58]]:[[11,56],[11,28],[20,10],[44,10],[53,28],[53,56],[40,60],[24,60]];
const chestB=side=>side?[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]:[[15,12],[25,10],[32,16],[39,10],[49,12],[52,30],[46,57],[18,57],[12,30]];
const pantsB=[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]];
const clip=(k,b,fn)=>{k.save();k.beginPath();b.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath();k.clip();try{fn()}finally{k.restore()}};
const poly=(k,fill,stroke,pts,w)=>{k.beginPath();pts.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath();if(fill){k.fillStyle=fill;k.fill()}if(stroke){k.strokeStyle=stroke;k.lineWidth=w||1;k.stroke()}};
const lg=(k,x0,y0,x1,y1,a,b,c)=>{const g=k.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,a);if(c){g.addColorStop(.5,b);g.addColorStop(1,c)}else g.addColorStop(1,b);return g};
const eyes=(k,side,col,glow)=>{k.fillStyle=col;side?k.fillRect(40,30,14,7):k.fillRect(17,31,30,7);for(const x of side?[47]:[25,39])glow13(k,x,34,5,glow)};
const crystal=(k,x,y,w,h,a,c1,c2)=>{k.save();k.translate(x,y);k.rotate(a||0);poly(k,lg(k,-w,0,w,0,c1||'#ffffff',c2||'#7ac8f0'),'rgba(20,40,70,.9)',[[0,-h],[w,-h*.35],[w*.7,h*.2],[-w*.7,h*.2],[-w,-h*.35]],1);k.strokeStyle='rgba(255,255,255,.7)';k.lineWidth=.8;k.beginPath();k.moveTo(0,-h);k.lineTo(0,h*.15);k.stroke();k.restore()};
const flake=(k,x,y,r,c)=>{k.strokeStyle=c||'#ffffff';k.lineWidth=1.2;for(let i=0;i<6;i++){const a=i*Math.PI/3;k.beginPath();k.moveTo(x,y);k.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);k.stroke();k.beginPath();k.moveTo(x+Math.cos(a)*r*.6,y+Math.sin(a)*r*.6);k.lineTo(x+Math.cos(a+.5)*r*.85,y+Math.sin(a+.5)*r*.85);k.stroke()}};
const cap=(k,x,y,w,h,c,sp)=>{k.fillStyle=c||'#a03ac8';k.strokeStyle='#1a0624';k.lineWidth=1.2;k.beginPath();k.ellipse(x,y,w,h,0,Math.PI,0);k.quadraticCurveTo(x+w*1.05,y+h*.25,x,y+h*.2);k.quadraticCurveTo(x-w*1.05,y+h*.25,x-w,y);k.fill();k.stroke();
 k.fillStyle=sp||'#f4ead0';for(const [dx,dy,r] of [[-.45,-.45,.16],[.2,-.7,.13],[.5,-.3,.12],[-.1,-.2,.1]]){k.beginPath();k.arc(x+dx*w,y+dy*h,Math.max(1,r*w),0,7);k.fill()}};
const horn=(k,x,y,s,dir,c)=>{k.fillStyle=lg(k,x,y,x+dir*14*s,y-20*s,c||'#e8d8c0','#3a1a10');k.strokeStyle='#0a0404';k.lineWidth=1;k.beginPath();k.moveTo(x,y);k.quadraticCurveTo(x+dir*16*s,y-4*s,x+dir*12*s,y-22*s);k.quadraticCurveTo(x+dir*8*s,y-8*s,x-dir*3*s,y-3*s);k.closePath();k.fill();k.stroke()};
const flame=(k,x,y,s,a)=>{k.save();k.globalCompositeOperation='lighter';for(const [c,f] of [['rgba(255,80,20,.8)',1],['rgba(255,200,60,.85)',.6],['rgba(255,255,220,.9)',.3]]){k.fillStyle=c;k.beginPath();k.moveTo(x-5*s*f,y);k.quadraticCurveTo(x-6*s*f,y-8*s*f,x,y-16*s*f*(a||1));k.quadraticCurveTo(x+6*s*f,y-8*s*f,x+5*s*f,y);k.closePath();k.fill()}k.restore()};
const shell=(k,x,y,r,c)=>{k.fillStyle=c||'#ffd86a';k.strokeStyle='#5a3a10';k.lineWidth=1;k.beginPath();k.moveTo(x,y+r*.6);for(let i=0;i<=6;i++){const a=Math.PI+i*Math.PI/6;k.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}k.closePath();k.fill();k.stroke();k.strokeStyle='rgba(90,58,16,.7)';for(let i=1;i<6;i++){const a=Math.PI+i*Math.PI/6;k.beginPath();k.moveTo(x,y+r*.6);k.lineTo(x+Math.cos(a)*r*.95,y+Math.sin(a)*r*.95);k.stroke()}};
const pearl=(k,x,y,r)=>{const g=k.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);g.addColorStop(0,'#ffffff');g.addColorStop(.6,'#e8f0ff');g.addColorStop(1,'#8aa8c8');k.fillStyle=g;k.beginPath();k.arc(x,y,r,0,7);k.fill()};
const star=(k,x,y,r,c,n)=>{n=n||5;k.fillStyle=c||'#ffe88a';k.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,rr=i%2?r*.42:r;k.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}k.closePath();k.fill()};
const wing=(k,x,y,dir,s,c)=>{k.save();k.translate(x,y);k.scale(dir*s,s);for(let i=0;i<4;i++){k.fillStyle=i%2?(c||'#ffffff'):'#e8eef8';k.strokeStyle='rgba(60,60,110,.8)';k.lineWidth=.8;k.beginPath();k.moveTo(0,0);k.quadraticCurveTo(8+i*2,-10-i*3,16+i*3,-4-i*5);k.quadraticCurveTo(10+i*2,-2-i,0,2);k.closePath();k.fill();k.stroke()}k.restore()};
const crack=(k,pts,c)=>{k.save();k.globalCompositeOperation='lighter';L13(k,c||'rgba(255,110,30,.95)',1.6,pts);L13(k,'rgba(255,230,120,.8)',.6,pts);k.restore()};
const scales=(k,x0,y0,x1,y1,r,c1,c2)=>{for(let y=y0,row=0;y<y1;y+=r*1.3,row++)for(let x=x0+(row%2?r:0);x<x1;x+=r*2){k.fillStyle=c1;k.beginPath();k.arc(x,y,r,0,Math.PI);k.fill();k.strokeStyle=c2;k.lineWidth=.7;k.stroke()}};
const gold=(k,pts,w)=>{L13(k,'#5a3a08',(w||2)+1.2,pts);L13(k,'#ffd86a',w||2,pts)};
// ---------- ดีไซน์ 5 เซ็ต ----------
const D101=[
 // ❄️ ราชินีหิมะ
 {helm(k,Q,t,v){const side=v==='side',b=helmB(side);P13(k,Q,3,7,b);clip(k,b,()=>{for(let i=0;i<4;i++)L13(k,'rgba(255,255,255,.35)',1,[[10,20+i*10],[56,14+i*10]])});
   const xs=side?[18,26,34,42]:[14,22,32,42,50];xs.forEach((x,i)=>crystal(k,x,12-(i===Math.floor(xs.length/2)?6:0),3.4,i===Math.floor(xs.length/2)?14:9,(x-32)*.02));if(v==='back')return;eyes(k,side,'#0c1a2c','rgba(150,230,255,.95)');if(!side)flake(k,32,22,5,'#e8f8ff')},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,3,11,b);clip(k,b,()=>{k.strokeStyle='rgba(30,70,110,.55)';k.lineWidth=1;for(let i=-3;i<6;i++){k.beginPath();k.moveTo(i*10,10);k.lineTo(i*10+30,60);k.stroke();k.beginPath();k.moveTo(i*10+30,10);k.lineTo(i*10,60);k.stroke()}});
   for(const s of side?[1]:[-1,1]){crystal(k,32+s*(side?2:17),14,3.6,12,s*.6);crystal(k,32+s*(side?6:21),18,2.6,8,s*.9)}if(v==='front'){crystal(k,32,34,6,14,0,'#ffffff','#5ab8f0');glow13(k,32,30,13,'rgba(170,240,255,.6)')}},
  pants(k,Q,t){P13(k,Q,3,13,pantsB);for(const x of [21,43]){crystal(k,x,34,4,8,0);L13(k,'rgba(255,255,255,.4)',1,[[x-6,46],[x+6,50]])}},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,3,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);crystal(k,x0+10,30,3,8,.3);crystal(k,x0+14,44,2.4,6,-.3)}},
  sword(k,Q,t){P13(k,{hi:'#e8f4ff',mid:'#8aa8c8',lo:'#3a4a6a',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,61],[29,61]]);
   P13(k,Q,3,2,[[25,47],[39,47],[41,40],[38,36],[42,30],[38,26],[41,18],[32,1],[23,18],[26,26],[22,30],[26,36],[23,40]]);L13(k,'rgba(255,255,255,.8)',1.2,[[32,44],[32,6]]);
   flake(k,32,49,8,'#ffffff');crystal(k,44,10,2.6,6,.6);crystal(k,20,14,2,5,-.6);glow13(k,32,22,13,'rgba(170,240,255,.55)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#3a5a7a','#e8f4ff',1);for(const [a,h] of [[-.55,13],[0,18],[.55,13]])crystal(k,32+Math.sin(a)*4,13,3.6,h,a);k.strokeStyle='rgba(200,245,255,.8)';k.lineWidth=1.4;k.beginPath();k.ellipse(32,12,13,5,0,0,7);k.stroke();glow13(k,32,8,16,'rgba(170,240,255,.6)')},
  bowdeco(c,s){crystal(c,-5,s*24,2.4,6,s*.6);crystal(c,-2,s*14,1.6,4,s*.3)},bowshape:[11,3.6,2]},
 // 🍄 ราชันเห็ดพิษ
 {helm(k,Q,t,v){const side=v==='side';const b=side?[[16,56],[16,30],[22,22],[46,22],[52,30],[52,56],[40,58]]:[[14,56],[14,30],[20,22],[44,22],[50,30],[50,56],[40,60],[24,60]];P13(k,Q,3,7,b);
   cap(k,side?34:32,24,side?24:28,20,Q.mid,Q.gd);if(v==='back')return;eyes(k,side,'#14061a','rgba(176,255,106,.95)');for(const x of side?[44]:[22,42])glow13(k,x,52,4,'rgba(176,255,106,.6)')},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,3,11,b);clip(k,b,()=>{k.strokeStyle='#3a6a1a';k.lineWidth=2.4;for(const o of [0,14]){k.beginPath();k.moveTo(8+o,12);k.bezierCurveTo(30+o,22,4+o,40,34+o,58);k.stroke()}});
   for(const s of side?[1]:[-1,1]){cap(k,32+s*(side?2:17),16,8,7,Q.pm,Q.gd)}if(v==='front'){for(const [x,y] of [[24,36],[40,42],[30,48]]){k.fillStyle='#b0ff6a';k.beginPath();k.arc(x,y,3,0,7);k.fill();glow13(k,x,y,7,'rgba(176,255,106,.6)')}}},
  pants(k,Q,t){P13(k,Q,3,13,pantsB);L13(k,'#3a6a1a',2.2,[[16,14],[24,34],[18,56]]);L13(k,'#3a6a1a',2.2,[[48,14],[40,34],[46,56]]);for(const x of [21,43])cap(k,x,38,6,5,'#c86aff')},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,3,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);L13(k,'#3a6a1a',2,[[x0+2,20],[x0+18,30],[x0+2,40]]);cap(k,x0+11,14,7,5,'#a03ac8')}},
  sword(k,Q,t){P13(k,{hi:'#8a6a4a',mid:'#5a3e26',lo:'#2e1e10',gl:'#fff',k:0},0,1,[[29,50],[35,50],[35,61],[29,61]]);
   P13(k,Q,3,2,[[27,47],[37,47],[42,34],[44,20],[38,4],[34,10],[36,22],[30,36]]);L13(k,'rgba(176,255,106,.8)',1.2,[[33,44],[39,22],[38,10]]);cap(k,32,49,12,7,'#a03ac8');
   for(const [x,y] of [[40,16],[36,30]])glow13(k,x,y,6,'rgba(176,255,106,.7)')},
  staff(k,Q,t){k.strokeStyle='#4a2e14';k.lineWidth=4;k.beginPath();k.moveTo(32,62);k.bezierCurveTo(26,44,38,30,32,18);k.stroke();cap(k,32,16,16,12,'#a03ac8','#f4ead0');for(const [x,y] of [[22,24],[42,26],[32,30]]){k.fillStyle='#b0ff6a';k.beginPath();k.arc(x,y,1.8,0,7);k.fill()}glow13(k,32,14,16,'rgba(176,255,106,.5)')},
  bowdeco(c,s){cap(c,-5,s*22,5,4,'#a03ac8')},bowshape:[9,4,1]},
 // 🔥 แม่ทัพอสูรเพลิง
 {helm(k,Q,t,v){const side=v==='side',b=helmB(side);P13(k,Q,3,7,b);clip(k,b,()=>{crack(k,[[14,40],[22,34],[18,26],[28,18]]);crack(k,[[50,44],[42,36],[46,28]])});
   if(side){horn(k,30,14,1.2,1)}else{horn(k,18,16,1.2,-1);horn(k,46,16,1.2,1)}flame(k,32,10,1.1);if(v==='back')return;eyes(k,side,'#0a0202','rgba(255,90,20,1)')},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,3,11,b);clip(k,b,()=>{crack(k,[[14,18],[22,30],[16,44],[26,56]]);crack(k,[[50,20],[42,32],[48,46],[38,56]])});
   for(const s of side?[1]:[-1,1]){const x=32+s*(side?4:19);k.fillStyle='#2a1210';k.beginPath();k.arc(x,14,7,0,7);k.fill();for(let i=0;i<3;i++){k.fillStyle='#d8c8b0';k.beginPath();k.moveTo(x-3+i*3,10);k.lineTo(x-2+i*3+s*2,0);k.lineTo(x-1+i*3,10);k.fill()}}
   if(v==='front'){k.fillStyle='#1a0806';k.beginPath();k.ellipse(32,34,9,10,0,0,7);k.fill();for(const x of [28,36]){k.fillStyle='#ff5a1a';k.beginPath();k.moveTo(x-3,31);k.lineTo(x+3,33);k.lineTo(x-2,35);k.fill()}k.fillStyle='#e8d8c0';for(let i=0;i<4;i++){k.beginPath();k.moveTo(27+i*3.4,40);k.lineTo(28.5+i*3.4,44);k.lineTo(30+i*3.4,40);k.fill()}glow13(k,32,34,14,'rgba(255,90,20,.45)')}},
  pants(k,Q,t){P13(k,Q,3,13,pantsB);crack(k,[[18,16],[22,32],[18,52]]);crack(k,[[46,16],[42,32],[46,52]]);for(const x of [21,43]){k.fillStyle='#d8c8b0';k.beginPath();k.moveTo(x-3,38);k.lineTo(x,30);k.lineTo(x+3,38);k.fill()}},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,3,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);crack(k,[[x0+4,18],[x0+12,30],[x0+6,44]]);for(let i=0;i<3;i++){k.fillStyle='#e8d8c0';k.beginPath();k.moveTo(x0+3+i*6,52);k.lineTo(x0+5+i*6,62);k.lineTo(x0+7+i*6,52);k.fill()}}},
  sword(k,Q,t){P13(k,{hi:'#4a2a20',mid:'#2a1410',lo:'#0a0404',gl:'#ff5a1a',k:0},0,1,[[29,50],[35,50],[35,61],[29,61]]);
   P13(k,Q,3,2,[[24,47],[40,47],[44,32],[40,30],[44,18],[36,2],[30,8],[26,4],[22,18],[26,24],[21,32]]);crack(k,[[32,44],[34,30],[30,20],[34,10]]);horn(k,26,48,.6,-1);horn(k,38,48,.6,1);glow13(k,34,20,12,'rgba(255,90,20,.5)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#1a0806','#4a2420',1);k.fillStyle='#e8dcc8';k.strokeStyle='#1a0806';k.lineWidth=1.2;k.beginPath();k.ellipse(32,16,9,10,0,0,7);k.fill();k.stroke();k.fillStyle='#1a0806';k.beginPath();k.arc(28,15,2.4,0,7);k.arc(36,15,2.4,0,7);k.fill();k.fillRect(29,21,6,2);
   horn(k,25,10,.7,-1);horn(k,39,10,.7,1);flame(k,32,6,1);glow13(k,32,12,16,'rgba(255,90,20,.55)')},
  bowdeco(c,s){c.fillStyle='#e8d8c0';c.beginPath();c.moveTo(-3,s*14);c.lineTo(-11,s*22);c.lineTo(-4,s*20);c.closePath();c.fill()},bowshape:[11,3.2,3]},
 // 🌊 ผู้พิทักษ์สมุทร
 {helm(k,Q,t,v){const side=v==='side',b=helmB(side);P13(k,Q,3,7,b);clip(k,b,()=>scales(k,8,14,60,58,3.2,'rgba(255,255,255,.16)','rgba(4,40,40,.6)'));
   k.fillStyle=lg(k,32,0,32,18,'#ffd86a','#1a8a8a');k.strokeStyle='#5a3a08';k.lineWidth=1;k.beginPath();if(side){k.moveTo(20,14);k.quadraticCurveTo(30,-4,48,6);k.lineTo(40,16)}else{k.moveTo(24,14);k.quadraticCurveTo(32,-6,40,14)}k.closePath();k.fill();k.stroke();
   if(v==='back')return;eyes(k,side,'#04161e','rgba(106,255,224,.95)');if(!side){shell(k,32,24,6);pearl(k,32,24,2)}},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,3,11,b);clip(k,b,()=>scales(k,10,12,56,58,3.4,'rgba(255,255,255,.18)','rgba(4,40,40,.55)'));gold(k,side?[[24,30],[40,30]]:[[13,30],[51,30]],1.6);
   for(const s of side?[1]:[-1,1])shell(k,32+s*(side?3:18),16,8);if(v==='front'){gold(k,[[32,16],[32,40]],1.4);pearl(k,32,38,4.5);glow13(k,32,38,10,'rgba(106,255,224,.5)')}},
  pants(k,Q,t){P13(k,Q,3,13,pantsB);clip(k,pantsB,()=>scales(k,12,12,52,58,3,'rgba(255,255,255,.14)','rgba(4,40,40,.5)'));gold(k,[[13,13],[51,13]],2);pearl(k,32,13,2.4)},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,3,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);k.fillStyle=lg(k,x0,20,x0+20,40,'#ffd86a','#1a8a8a');k.beginPath();k.moveTo(x0+18,16);k.quadraticCurveTo(x0+28,30,x0+18,46);k.lineTo(x0+16,30);k.closePath();k.fill();gold(k,[[x0+1,46],[x0+19,44]],1.4)}},
  sword(k,Q,t){P13(k,{hi:'#ffd86a',mid:'#c09030',lo:'#5a3a08',gl:'#fff',k:0},0,1,[[29,50],[35,50],[35,61],[29,61]]);
   P13(k,Q,3,2,[[27,46],[37,46],[40,38],[36,30],[40,22],[36,14],[33,1],[28,12],[31,22],[26,30],[30,38]]);L13(k,'rgba(200,255,244,.7)',1,[[32,44],[34,30],[32,16]]);shell(k,32,52,9);pearl(k,32,49,2.4);glow13(k,32,20,11,'rgba(106,255,224,.45)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#0a3a4a','#ffd86a',0);k.strokeStyle='#ffd86a';k.lineWidth=2.4;k.beginPath();k.moveTo(32,26);k.lineTo(32,4);k.moveTo(22,24);k.quadraticCurveTo(21,12,22,6);k.moveTo(42,24);k.quadraticCurveTo(43,12,42,6);k.moveTo(21,24);k.lineTo(43,24);k.stroke();
   for(const x of [22,32,42]){k.fillStyle='#fff6c8';k.beginPath();k.moveTo(x-2.4,8);k.lineTo(x,0);k.lineTo(x+2.4,8);k.fill()}pearl(k,32,20,4);glow13(k,32,16,16,'rgba(106,255,224,.5)')},
  bowdeco(c,s){shell(c,-5,s*22,4)},bowshape:[10,3.8,2]},
 // 🌠 เทพดาราร่วง
 {helm(k,Q,t,v){const side=v==='side',b=helmB(side);P13(k,Q,3,7,b);gold(k,side?[[16,30],[50,26]]:[[12,30],[52,30]],1.6);
   if(side){wing(k,18,30,-1,.9)}else{wing(k,12,30,-1,.9);wing(k,52,30,1,.9)}k.strokeStyle='rgba(255,240,170,.9)';k.lineWidth=1.6;k.beginPath();k.ellipse(32,4,14,3,0,0,7);k.stroke();star(k,32,12,6,'#ffe88a');
   if(v==='back')return;eyes(k,side,'#0a0a2a','rgba(255,240,170,1)')},
  chest(k,Q,t,v){const side=v==='side',b=chestB(side);P13(k,Q,3,11,b);clip(k,b,()=>{k.fillStyle='rgba(20,20,70,.55)';k.fillRect(0,26,64,40);const S=[[18,34],[26,42],[22,52],[36,46],[44,38],[42,52]];k.strokeStyle='rgba(200,220,255,.7)';k.lineWidth=.8;k.beginPath();S.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.stroke();for(const [x,y] of S){k.fillStyle='#ffffff';k.beginPath();k.arc(x,y,1.2,0,7);k.fill()}});
   for(const s of side?[1]:[-1,1])wing(k,32+s*(side?4:16),18,s,.8);if(v==='front'){star(k,32,24,7,'#ffe88a',8);glow13(k,32,24,13,'rgba(255,240,170,.6)')}},
  pants(k,Q,t){P13(k,Q,3,13,pantsB);clip(k,pantsB,()=>{for(let i=0;i<9;i++){star(k,16+(i*13)%34,18+(i*17)%38,1.6,'#ffe88a',4)}});gold(k,[[13,13],[51,13]],2)},
  arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,3,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);gold(k,[[x0+1,24],[x0+19,22]],1.4);star(k,x0+10,36,4,'#9ad8ff');glow13(k,x0+10,36,7,'rgba(154,216,255,.5)')}},
  sword(k,Q,t){P13(k,{hi:'#fff8e0',mid:'#e8c870',lo:'#9a7020',gl:'#fff',k:0},5,1,[[29,50],[35,50],[35,61],[29,61]]);
   P13(k,Q,3,2,[[28,46],[36,46],[38,16],[32,0],[26,16]]);L13(k,'rgba(255,255,255,.85)',1,[[32,44],[32,4]]);k.strokeStyle='#ffd86a';k.lineWidth=2.4;k.beginPath();k.arc(32,48,9,Math.PI*1.1,Math.PI*1.9,true);k.stroke();
   wing(k,26,47,-1,.75);wing(k,38,47,1,.75);star(k,32,60,3.4,'#9ad8ff');glow13(k,32,18,13,'rgba(255,240,170,.6)')},
  staff(k,Q,t){SHAFT14(k,Q,t,'#3a3a8a','#fff8e0',0);wing(k,26,22,-1,.8);wing(k,38,22,1,.8);k.strokeStyle='rgba(255,240,170,.95)';k.lineWidth=1.4;k.beginPath();k.ellipse(32,11,13,4,-.3,0,7);k.stroke();
   ORB14(k,32,11,5.5,'#ffe88a','#3a3a8a');star(k,45,9,2.6,'#ffffff');star(k,19,14,2,'#9ad8ff');glow13(k,32,11,17,'rgba(255,240,170,.6)')},
  bowdeco(c,s){star(c,-5,s*24,3,'#ffe88a')},bowshape:[12,3.4,3]}];
D101.forEach((d,i)=>{const t=T0_101+i;S13[t]={helm:d.helm,chest:d.chest,pants:d.pants,arm:d.arm};SW13[t]=d.sword;STAFF14[t]=d.staff;BOWDECO14[t]=d.bowdeco;BOWSHAPE14[t]=d.bowshape});
for(const k in SPRC)delete SPRC[k];for(const k in TICON)if(!/^(axe|pick)/.test(k))delete TICON[k];for(const k in IURL)if(/^item:/.test(k)&&!/^item:(axe|pick)/.test(k))delete IURL[k];
// ---------- อาวุธประจำอาชีพ: ทรงใหม่ต่อธีม (ไม่ใช่เปลี่ยนสี) ----------
const th101=()=>{const t=P.tier&&P.tier.sword|0;return t>=T0_101&&t<T0_101+5?t-T0_101:-1};window.th101=th101;
const CW101={
 ninja(k,Q,th){k.strokeStyle='#14141a';k.lineWidth=3;k.beginPath();k.moveTo(0,10);k.lineTo(0,-2);k.stroke();
  const blade=[[[-1.5,-2],[1.8,-2],[2.4,-30],[0,-44],[-1.6,-30]],[[-1.5,-2],[2,-2],[6,-22],[8,-40],[3,-34],[1,-18]],[[-2,-2],[2,-2],[4,-14],[1.6,-18],[4.4,-26],[1.4,-30],[3,-40],[-1,-46],[-2.4,-30],[-.6,-24],[-2.4,-16]],[[-1.5,-2],[2,-2],[4,-12],[1,-22],[4,-32],[0,-46],[-2,-32],[1,-22],[-2,-12]],[[-1.4,-2],[1.6,-2],[2,-36],[0,-50],[-2,-36]]][th];
  poly(k,lg(k,-3,0,3,0,'#c8d8ee','#ffffff',Q.hi),'#1a1e2a',blade,1);
  [()=>{flake(k,0,-1,5,'#e8f8ff');crystal(k,4,-36,1.6,4,.4)},()=>{cap(k,0,-1,7,4,'#a03ac8')},()=>{horn(k,-2,0,.45,-1);horn(k,2,0,.45,1);crack(k,[[0,-6],[1,-20],[-1,-34]])},()=>{shell(k,0,1,5);pearl(k,0,0,1.6)},()=>{wing(k,-1,0,-1,.45);wing(k,1,0,1,.45);star(k,0,-48,3,'#ffe88a')}][th]()},
 dragoon(k,Q,th){k.strokeStyle='#3a2414';k.lineWidth=3;k.beginPath();k.moveTo(0,16);k.lineTo(0,-34);k.stroke();k.strokeStyle=Q.mid;k.lineWidth=1.4;k.stroke();
  [()=>{crystal(k,0,-44,4,16,0);crystal(k,-5,-36,2,6,-.6);crystal(k,5,-36,2,6,.6)},
   ()=>{poly(k,lg(k,-6,0,6,0,'#c86aff','#5a1a7a'),'#1a0624',[[0,-60],[7,-44],[3,-34],[-3,-34],[-7,-44]],1);L13(k,'#b0ff6a',1,[[0,-56],[0,-36]]);cap(k,0,-33,7,4,'#a03ac8')},
   ()=>{poly(k,lg(k,-10,0,10,0,'#3a1a14','#ff5a1a','#140606'),'#0a0202',[[0,-58],[4,-46],[12,-42],[6,-38],[10,-30],[0,-34],[-10,-30],[-6,-38],[-12,-42],[-4,-46]],1);flame(k,0,-56,.6)},
   ()=>{k.strokeStyle='#ffd86a';k.lineWidth=2.2;k.beginPath();k.moveTo(0,-34);k.lineTo(0,-56);k.moveTo(-8,-36);k.quadraticCurveTo(-9,-46,-8,-52);k.moveTo(8,-36);k.quadraticCurveTo(9,-46,8,-52);k.moveTo(-9,-36);k.lineTo(9,-36);k.stroke();for(const x of [-8,0,8]){k.fillStyle='#fff6c8';k.beginPath();k.moveTo(x-2,-52);k.lineTo(x,-60);k.lineTo(x+2,-52);k.fill()}pearl(k,0,-38,2.2)},
   ()=>{k.strokeStyle='#ffd86a';k.lineWidth=3;k.beginPath();k.arc(0,-46,10,Math.PI*.2,Math.PI*.8,true);k.stroke();k.fillStyle='#fff8e0';k.beginPath();k.moveTo(0,-62);k.lineTo(3,-44);k.lineTo(-3,-44);k.fill();star(k,0,-36,3.4,'#9ad8ff');wing(k,-2,-38,-1,.5);wing(k,2,-38,1,.5)}][th]()},
 paladin(k,Q,th){const bl=[[-4,-2],[4,-2],[4,-28],[0,-38],[-4,-28]];poly(k,lg(k,-5,0,5,0,Q.lo,Q.hi,Q.lo),'#1a1e2a',th===2?[[-5,-2],[5,-2],[6,-14],[3,-18],[6,-26],[0,-40],[-6,-26],[-3,-18],[-6,-14]]:th===3?[[-4,-2],[4,-2],[6,-16],[2,-26],[5,-34],[0,-40],[-4,-30],[-1,-20],[-5,-12]]:bl,1);
  k.fillStyle='#4a3010';k.fillRect(-1.6,0,3.2,9);[()=>{crystal(k,-8,0,2.6,7,-.9);crystal(k,8,0,2.6,7,.9);flake(k,0,-1,4,'#fff')},()=>{cap(k,0,0,9,5,'#a03ac8')},()=>{horn(k,-4,0,.6,-1);horn(k,4,0,.6,1)},()=>{shell(k,0,2,7);pearl(k,0,0,2)},()=>{wing(k,-3,0,-1,.6);wing(k,3,0,1,.6);star(k,0,1,3,'#ffe88a')}][th]()},
 monk(k,Q,th){k.save();k.globalCompositeOperation='lighter';G14(k,0,0,11,['rgba(170,235,255,.7)','rgba(176,255,106,.6)','rgba(255,110,30,.75)','rgba(106,255,224,.6)','rgba(255,240,170,.75)'][th]);k.restore();
  [()=>{for(let i=0;i<3;i++)crystal(k,-3+i*3,-4,1.4,5,(i-1)*.4)},()=>{for(let i=0;i<3;i++)cap(k,-3+i*3,-3,2.6,2.2,'#a03ac8')},()=>{for(let i=0;i<3;i++){k.fillStyle='#e8d8c0';k.beginPath();k.moveTo(-4+i*3,-2);k.lineTo(-3+i*3,-10);k.lineTo(-2+i*3,-2);k.fill()}},()=>{shell(k,0,-1,4.4)},()=>{for(let i=0;i<2;i++){k.strokeStyle='#ffd86a';k.lineWidth=1.2;k.beginPath();k.ellipse(0,-1,6+i*2.4,2.4+i,0,0,7);k.stroke()}star(k,0,-4,2.6,'#ffffff')}][th]()},
 cleric(k,Q,th){k.strokeStyle='#c8a040';k.lineWidth=3;k.beginPath();k.moveTo(0,10);k.lineTo(0,-28);k.stroke();k.strokeStyle='#fff6d8';k.lineWidth=1.2;k.stroke();
  [()=>{flake(k,0,-36,8,'#e8f8ff');crystal(k,0,-36,2.6,6,0)},()=>{cap(k,0,-34,10,8,'#a03ac8');for(const x of [-6,6]){k.fillStyle='#b0ff6a';k.beginPath();k.arc(x,-28,1.6,0,7);k.fill()}},()=>{k.strokeStyle='#ff5a1a';k.lineWidth=2;k.beginPath();k.arc(0,-35,7,0,7);k.stroke();flame(k,0,-30,.8)},()=>{shell(k,0,-31,8);pearl(k,0,-36,3)},()=>{k.strokeStyle='#ffe08a';k.lineWidth=2;k.beginPath();k.arc(0,-35,7,0,7);k.stroke();star(k,0,-35,5,'#ffffff');wing(k,-6,-34,-1,.5);wing(k,6,-34,1,.5)}][th]();
  k.save();k.globalCompositeOperation='lighter';G14(k,0,-35,12,'rgba(255,250,210,.5)');k.restore()},
 necro(k,Q,th){k.strokeStyle='#1a1414';k.lineWidth=3;k.beginPath();k.moveTo(0,12);k.lineTo(0,-36);k.stroke();
  const B=[[[0,-36],[-14,-46],[-30,-40],[-20,-38],[-6,-32]],[[0,-36],[-10,-48],[-28,-46],[-22,-40],[-6,-34]],[[0,-36],[-8,-44],[-14,-40],[-20,-46],[-30,-36],[-18,-34],[-6,-32]],[[0,-36],[-12,-44],[-22,-38],[-30,-44],[-26,-34],[-6,-32]],[[0,-36],[-16,-48],[-34,-42],[-22,-38],[-6,-32]]][th];
  poly(k,lg(k,-30,-40,0,-36,'#e8eef4',Q.hi,Q.mid),'#1a1e2a',B,1);[()=>crystal(k,2,-38,2,6,.3),()=>cap(k,1,-37,5,4,'#a03ac8'),()=>{horn(k,1,-34,.5,1);crack(k,[[-6,-36],[-18,-41]])},()=>{shell(k,0,-35,4);pearl(k,0,-38,1.4)},()=>{star(k,0,-37,3.4,'#ffe88a');wing(k,1,-34,1,.45)}][th]()},
 summoner(k,Q,th){k.strokeStyle='#5a3a1e';k.lineWidth=3.4;k.beginPath();k.moveTo(0,10);k.quadraticCurveTo(2,-12,0,-30);k.stroke();
  [()=>{for(const s of [-1,1]){crystal(k,s*7,-36,2.4,10,s*.5);crystal(k,s*11,-30,1.8,6,s*.9)}},()=>{for(const s of [-1,1]){k.strokeStyle='#5a3a1e';k.lineWidth=2;k.beginPath();k.moveTo(0,-30);k.quadraticCurveTo(s*8,-36,s*10,-44);k.stroke();cap(k,s*10,-44,4.4,3.4,'#a03ac8')}},
   ()=>{horn(k,-2,-30,.8,-1);horn(k,2,-30,.8,1);flame(k,0,-32,.6)},()=>{k.strokeStyle='#ff8a7a';k.lineWidth=2.2;for(const s of [-1,1]){k.beginPath();k.moveTo(0,-30);k.lineTo(s*6,-38);k.lineTo(s*4,-46);k.moveTo(s*6,-38);k.lineTo(s*12,-42);k.stroke()}pearl(k,0,-32,2.6)},
   ()=>{for(const s of [-1,1]){k.strokeStyle='#ffd86a';k.lineWidth=2;k.beginPath();k.moveTo(0,-30);k.quadraticCurveTo(s*10,-34,s*12,-46);k.stroke();star(k,s*12,-46,2.6,'#ffffff')}star(k,0,-34,3.4,'#9ad8ff')}][th]()}};
// แทนรูปอาวุธอาชีพเดิมเมื่อถือของเซ็ตใหม่
{const _w=wpn25;wpn25=function(cls,k){const th=th101();if(th>=0&&CW101[cls]){try{k.lineCap='round';k.lineJoin='round';CW101[cls](k,TIERS[P.tier.sword|0],th);return}catch(e){}}return _w.apply(this,arguments)};window.wpn25=wpn25}
// สไนเปอร์: ปืนเดิม + ของประดับตามธีม
{const _db=drawBow6;drawBow6=function(x,y,aim,tier,pull,arrow,sc){const r=_db.apply(this,arguments);try{const th=(tier|0)-T0_101;if(P.cls==='sniper'&&th>=0&&th<5&&window.cwOk25&&cwOk25()){ctx.save();ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc||1,sc||1);
   [()=>{crystal(ctx,10,-8,1.8,5,0);crystal(ctx,20,-6,1.4,4,.4)},()=>{cap(ctx,10,-7,5,3,'#a03ac8')},()=>{flame(ctx,30,1,.5,.6);crack(ctx,[[2,0],[24,0]])},()=>{shell(ctx,8,-4,3.4);pearl(ctx,16,-5,1.6)},()=>{wing(ctx,4,-3,-1,.4);star(ctx,22,-6,2.4,'#ffe88a')}][th]();ctx.restore()}}catch(e){}return r};window.drawBow6=drawBow6}
// ---------- ใส่ได้ตามเลเวล ----------
{const _eq=equipItem;equipItem=function(id){const it=ITEMS[id];if(it&&it.c2101){const S=B101[it.tier-T0_101];if(P.lv<S.lv){say('🔒 '+it.name+' ต้อง Lv.'+S.lv+' ขึ้นไป');sfx('thud');return}const b=it.boss59;it.boss59=0;try{return _eq.apply(this,arguments)}finally{it.boss59=b;try{recalcStats()}catch(e){}}}return _eq.apply(this,arguments)};window.equipItem=equipItem}
// ---------- โบนัสครบ 4 ชิ้น → PTX ----------
let ver101=0,key101='';
function bonus101(){let c={};try{c=setCount()}catch(e){}for(let i=0;i<5;i++)if((c[T0_101+i]|0)>=4)return i;return -1}
{const _p=PTX;PTX=function(){const o=_p.apply(this,arguments);try{const i=bonus101(),key=String(i);if(o&&o.__k101!==key){const old=o.__a101||{};for(const k in old)o[k]=(o[k]||0)-old[k];const add=i>=0?B101[i].fx:{};for(const k in add)o[k]=(o[k]||0)+add[k];o.__a101=add;o.__k101=key}}catch(e){}return o};window.PTX=PTX}
setInterval(()=>{try{const k=String(bonus101());if(k!==key101){key101=k;try{ptDirty()}catch(e){}try{recalcStats()}catch(e){}}}catch(e){}},700);
// ---------- ดรอปในดันเจี้ยนนครวารี ----------
const PCS101=['sword','staff','bow','helm','chest','pants','arm','neck','ring'];
function drop101(si,m){const S=B101[si],kind=PCS101[Math.random()*PCS101.length|0],id=kind+S.t;if(!ITEMS[id])return;GEAR[id]=(GEAR[id]|0)+1;try{refreshInv();saveGame(true)}catch(e){}
 try{flash(S.r[1],.3);sfx('chest');banner('🌀 ดรอปของเซ็ตใหม่!',ITEMS[id].name+' ['+S.r[0]+']','')}catch(e){}try{sysSay('🌀 ได้ '+ITEMS[id].name+' ['+S.r[0]+'] — เปิดกระเป๋า 🎒 เพื่อสวมใส่ (ต้อง Lv.'+S.lv+')')}catch(e){}
 try{if(typeof chatAnn==='function')chatAnn((P.name||'ผู้กล้า')+' ได้ '+ITEMS[id].name+' ['+S.r[0]+'] ในดันเจี้ยนนครวารี!')}catch(e){}}
window.drop101=drop101;
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);const r=_mk.apply(this,arguments);try{const d=window.dgOf96&&dgOf96();if(d&&m&&!was&&m.dead&&!m.d101&&(W33.mode==='solo'||m.my33>0)){m.d101=1;const si=B101.findIndex(S=>S.dg===d.id);
   if(si>=0){const ch=m.boss?.4:m.elite?.04:.005;if(Math.random()<ch)drop101(si,m)}}}catch(e){console.warn('drop101',e)}return r};window.mobKill=mobKill}
// ที่มาของไอเท็ม
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)}catch(e){}try{const id=String(key).replace(/^item:/,''),it=ITEMS[id];if(it&&it.c2101){const B=B101[it.tier-T0_101],d=(window.DG96||[]).find(q=>q.id===B.dg);
   S=S.filter(q=>!/บอส|ยังไม่มีข้อมูล|โต๊ะคราฟ/.test(q[1]));S.unshift(['🌀',(d?d.e+' '+d.n:'ดันเจี้ยน')+' (นครวารี) — บอส 40% · มอนหัวหน้า 4% · มอนทั่วไป 0.5% · ต้อง Lv.'+B.lv])}}catch(e){}return S};window.src7=src7}
}catch(e){console.warn('fix101',e)}
