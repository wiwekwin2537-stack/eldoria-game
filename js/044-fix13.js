// fix13.js (v4.22) — ชุด 6 เซ็ตทรงใหม่ทั้งหมด (ไม่ใช่แค่เปลี่ยนสี) ตามวัสดุของแต่ละเซ็ต
//  0 นักล่าเงา  : ฮู้ดหนัง+ผ้าปิดหน้า ตาเรืองม่วง · เสื้อหนังสายคาดไขว้ บ่าปีกค้างคาว · ขาพันผ้า · สนับแขนหนังพันเชือก
//  1 พฤกษาโบราณ: มงกุฎไม้แตกกิ่ง+ใบไม้ · เกราะเปลือกไม้ซ้อน ใบไม้ที่บ่า เถาวัลย์คาดเอว · สนับขาเปลือกไม้มีมอส
//  2 มังกรเพลิง : หมวกหัวมังกรมีเขาโค้ง+เขี้ยว · เกราะเกล็ด บ่าหนามแหลม · ขาเกล็ดซ้อน · ถุงมือกรงเล็บ
//  3 ผลึกน้ำแข็ง: มงกุฎผลึกแหลม · เกราะเหลี่ยมผลึก บ่าแท่งน้ำแข็ง · ขาเหลี่ยมผลึก · สนับแขนเกล็ดน้ำแข็ง
//  4 เงาจันทรา  : หมวกเขาจันทร์เสี้ยว+ผ้าคลุม · เสื้อคลุมเกราะตราจันทร์ ชายผ้าพลิ้ว · กระโปรงผ้าซ้อนแผ่นเงิน · สนับแขนเรียว
//  5 เทพตำนาน   : หมวกปีกคู่+วงรัศมี · เกราะทองลวดลายสุริยะ บ่าขนนก · ขาเกราะประดับอัญมณี · ถุงมือปีก
// =====================================================================
const S13={};
const P13=(k,Q,t,seed,pts)=>part(k,Q,t===0?1:t,()=>{k.beginPath();pts.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath()},seed,0,0,64,64);
const E13=(k,Q,t,seed,x,y,rx,ry)=>part(k,Q,t===0?1:t,()=>{k.beginPath();k.ellipse(x,y,rx,ry,0,0,7)},seed,x-rx,y-ry,x+rx,y+ry);
const glow13=(k,x,y,r,c)=>{const g=k.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(x-r,y-r,r*2,r*2)};
const L13=(k,c,w,pts)=>{k.strokeStyle=c;k.lineWidth=w;k.lineCap='round';k.beginPath();pts.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.stroke()};
const LEATHER={hi:'#8a6a4a',mid:'#5a3e26',lo:'#2e1e10',dk:'#160e06',gl:'#a070ff',gd:'#c8a06a',k:0};
// ---------------- 0 นักล่าเงา ----------------
S13[0]={
 helm(k,Q,t,v){const side=v==='side',back=v==='back';
  P13(k,Q,t,8,side?[[14,58],[12,30],[20,10],[36,6],[50,14],[54,30],[50,40],[40,40],[40,58]]:[[10,58],[10,30],[18,10],[32,4],[46,10],[54,30],[54,58],[44,52],[20,52]]);
  if(back){L13(k,'rgba(0,0,0,.45)',1.4,[[32,8],[32,50]]);P13(k,Q,t,9,[[24,52],[32,62],[40,52]]);return}
  k.fillStyle='#07060c';k.beginPath();side?k.ellipse(46,30,7,10,0,0,7):k.ellipse(32,32,15,13,0,0,7);k.fill();
  P13(k,{hi:Q.lo,mid:Q.dk,lo:'#05040a',gl:Q.gl,k:0},0,10,side?[[40,34],[54,32],[54,44],[42,44]]:[[17,36],[47,36],[44,48],[32,52],[20,48]]);
  for(const x of side?[48]:[26,38]){glow13(k,x,30,6,'rgba(190,140,255,.95)');k.fillStyle='#f0e0ff';k.fillRect(x-2.5,29,5,2)}
  L13(k,Q.gd,1.2,side?[[20,22],[42,16]]:[[18,22],[32,14],[46,22]])},
 chest(k,Q,t,v){const side=v==='side';
  if(side){P13(k,LEATHER,0,21,[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]);P13(k,Q,t,22,[[20,10],[34,6],[46,16],[30,22]]);L13(k,Q.mid,2.6,[[24,14],[40,50]]);return}
  P13(k,LEATHER,0,11,[[15,12],[25,10],[32,18],[39,10],[49,12],[51,30],[46,57],[18,57],[13,30]]);
  for(const s of [-1,1]){const x=32+s*22;P13(k,Q,t,30+s,[[x,10],[x+s*10,6],[x+s*6,14],[x+s*12,16],[x+s*4,22],[x-s*6,18]])}
  L13(k,Q.mid,3,[[18,16],[46,50]]);L13(k,Q.mid,3,[[46,16],[18,50]]);k.fillStyle=Q.gd;k.beginPath();k.arc(32,33,3,0,7);k.fill();
  if(v!=='back'){glow13(k,32,33,6,'rgba(170,120,255,.6)')}P13(k,Q,t,12,[[15,45],[49,45],[49,51],[15,51]])},
 pants(k,Q,t){P13(k,LEATHER,0,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);
  for(const x of [17,34])for(let y=28;y<56;y+=5)L13(k,Q.mid,2.2,[[x,y],[x+13,y+2]]);P13(k,Q,t,16,[[12,8],[52,8],[52,15],[12,15]])},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,LEATHER,0,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);for(let y=14;y<50;y+=6)L13(k,Q.mid,2,[[x0,y],[x0+19,y-2]]);P13(k,Q,t,60+x0,[[x0+16,14],[x0+24,20],[x0+18,30]])}}};
// ---------------- 1 พฤกษาโบราณ ----------------
const leaf13=(k,x,y,a,s,c)=>{k.save();k.translate(x,y);k.rotate(a);k.scale(s,s);k.fillStyle=c||'#5aa83a';k.strokeStyle='#1e3a12';k.lineWidth=1;k.beginPath();k.moveTo(0,0);k.quadraticCurveTo(6,-5,12,0);k.quadraticCurveTo(6,5,0,0);k.fill();k.stroke();k.strokeStyle='rgba(255,255,255,.35)';k.beginPath();k.moveTo(1,0);k.lineTo(10,0);k.stroke();k.restore()};
const BARK={hi:'#a87a4a',mid:'#6a4628',lo:'#3a2414',dk:'#1a0e06',gl:'#8aff6a',gd:'#c8a04a',k:0};
S13[1]={
 helm(k,Q,t,v){const side=v==='side';
  P13(k,BARK,0,8,side?[[16,40],[18,26],[50,26],[52,40],[46,44],[22,44]]:[[12,40],[14,26],[50,26],[52,40],[44,44],[20,44]]);
  for(const [x,h] of side?[[22,14],[34,20],[46,12]]:[[16,12],[26,18],[38,18],[48,12]]){L13(k,'#3a2414',3,[[x,28],[x-2,28-h*.6],[x+2,28-h]]);L13(k,'#6a4628',1.6,[[x,28],[x-2,28-h*.6],[x+2,28-h]]);leaf13(k,x+1,28-h,-1.2,.8);leaf13(k,x-1,28-h*.55,2.6,.7,'#7ac84a')}
  if(v==='back'){for(let i=0;i<4;i++)leaf13(k,16+i*10,44,1.4,.9);return}
  leaf13(k,side?40:26,34,.2,.9,'#9ae86a');k.fillStyle='#8aff6a';k.beginPath();k.arc(side?44:32,34,2.2,0,7);k.fill();glow13(k,side?44:32,34,6,'rgba(140,255,110,.6)')},
 chest(k,Q,t,v){const side=v==='side';
  if(side){P13(k,BARK,0,21,[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]);for(let y=18;y<54;y+=9)P13(k,Q,t,20+y,[[23,y],[41,y-2],[41,y+5],[23,y+7]]);leaf13(k,26,12,-.6,1.3);return}
  P13(k,BARK,0,11,[[15,12],[25,10],[32,17],[39,10],[49,12],[52,30],[46,57],[18,57],[12,30]]);
  for(let i=0;i<3;i++)for(const s of [-1,1])P13(k,Q,t,40+i+s,[[32+s*2,20+i*9],[32+s*16,18+i*9],[32+s*15,25+i*9],[32+s*2,27+i*9]]);
  for(const s of [-1,1]){leaf13(k,32+s*20,13,s<0?Math.PI+.4:-.4,1.4);leaf13(k,32+s*24,18,s<0?Math.PI-.2:.2,1.1,'#7ac84a')}
  L13(k,'#2e6a1e',2.4,[[15,47],[24,44],[32,48],[40,44],[49,47]]);if(v!=='back'){k.fillStyle='#8aff6a';k.beginPath();k.arc(32,46,2.6,0,7);k.fill();glow13(k,32,46,7,'rgba(140,255,110,.55)')}},
 pants(k,Q,t){P13(k,BARK,0,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);
  for(const x of [17,34])for(let y=26;y<58;y+=8)P13(k,Q,t,x+y,[[x,y],[x+13,y-1],[x+13,y+5],[x,y+6]]);for(const x of [20,40])leaf13(k,x,36,.6,.9,'#6ab84a');P13(k,BARK,0,16,[[12,8],[52,8],[52,15],[12,15]]);leaf13(k,28,12,0,1)},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,BARK,0,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);for(let y=16;y<50;y+=10)P13(k,Q,t,y+x0,[[x0+1,y],[x0+19,y-2],[x0+19,y+4],[x0+1,y+6]]);leaf13(k,x0+6,10,-.8,1)}}};
// ---------------- 2 มังกรเพลิง ----------------
const scales13=(k,Q,x0,y0,x1,y1,r)=>{k.save();k.strokeStyle=Q.lo;k.lineWidth=1;for(let y=y0,row=0;y<y1;y+=r*.9,row++)for(let x=x0+(row%2?r:0);x<x1;x+=r*2){k.beginPath();k.arc(x,y,r,0,Math.PI);k.stroke();k.fillStyle='rgba(255,255,255,.12)';k.beginPath();k.arc(x,y+r*.3,r*.5,Math.PI,0);k.fill()}k.restore()};
S13[2]={
 helm(k,Q,t,v){const side=v==='side';
  for(const s of side?[1]:[-1,1]){const hx=side?22:32+s*16;L13(k,'#2a0a06',5,[[hx,20],[hx+s*(side?-12:10),8],[hx+s*(side?-18:18),14]]);L13(k,Q.gd,3,[[hx,20],[hx+s*(side?-12:10),8],[hx+s*(side?-18:18),14]])}
  const dom=side?[[14,56],[14,30],[22,12],[40,10],[52,22],[60,34],[54,44],[44,46],[40,58]]:[[11,56],[11,28],[20,12],[32,8],[44,12],[53,28],[53,56],[44,58],[20,58]];P13(k,Q,t,18,dom);
  k.save();k.beginPath();dom.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath();k.clip();scales13(k,Q,8,10,60,58,3.4);k.restore();
  if(v==='back')return;
  k.fillStyle='#1a0402';side?k.fillRect(40,30,18,8):k.fillRect(17,30,30,9);
  for(const x of side?[44,50,56]:[20,26,32,38,44]){k.fillStyle='#fff4e0';k.beginPath();k.moveTo(x-2,38);k.lineTo(x,44);k.lineTo(x+2,38);k.fill()}
  for(const x of side?[48]:[25,39]){glow13(k,x,33,5,'rgba(255,170,40,.95)');k.fillStyle='#ffe060';k.fillRect(x-2,32,4,2)}},
 chest(k,Q,t,v){const side=v==='side';const body=side?[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]:[[15,12],[25,10],[32,16],[39,10],[49,12],[52,30],[46,57],[18,57],[12,30]];
  P13(k,Q,t,11,body);k.save();k.beginPath();body.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath();k.clip();scales13(k,Q,10,14,56,56,3.2);k.restore();
  for(const s of side?[1]:[-1,1]){const x=side?32:32+s*20;E13(k,Q,t,30+s,x,16,10,7);for(let i=0;i<3;i++){k.fillStyle=Q.gd;k.strokeStyle='#2a0a06';k.lineWidth=1;k.beginPath();k.moveTo(x-6+i*6,12);k.lineTo(x-4+i*6+s*2,0);k.lineTo(x-2+i*6,12);k.fill();k.stroke()}}
  if(v==='front'){k.fillStyle='#ffb030';k.beginPath();k.moveTo(32,26);k.lineTo(37,34);k.lineTo(32,42);k.lineTo(27,34);k.closePath();k.fill();glow13(k,32,34,9,'rgba(255,120,30,.55)')}
  P13(k,{hi:'#5a2a14',mid:'#3a1a0a',lo:'#1a0a04',gl:Q.gl,k:0},0,12,side?[[22,45],[42,45],[42,51],[22,51]]:[[15,45],[49,45],[49,51],[15,51]])},
 pants(k,Q,t){const g=[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]];P13(k,Q,t,13,g);k.save();k.beginPath();g.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath();k.clip();scales13(k,Q,10,16,54,58,3);k.restore();
  for(const x of [17,34])P13(k,{hi:'#6a2a14',mid:'#3a1408',lo:'#1a0804',gl:Q.gl,k:0},0,x,[[x,51],[x+13,51],[x+13,59],[x,59]]);for(const x of [23.5,40.5]){k.fillStyle=Q.gd;k.beginPath();k.moveTo(x-4,40);k.lineTo(x,32);k.lineTo(x+4,40);k.fill()}},
 arm(k,Q,t){for(const x0 of [8,36]){const p=[[x0+2,10],[x0+17,8],[x0+20,46],[x0-1,48]];P13(k,Q,t,50+x0,p);k.save();k.beginPath();p.forEach((q,i)=>i?k.lineTo(q[0],q[1]):k.moveTo(q[0],q[1]));k.closePath();k.clip();scales13(k,Q,x0-2,10,x0+22,48,2.6);k.restore();
  for(let i=0;i<4;i++){k.fillStyle='#fff0d8';k.strokeStyle='#2a0a06';k.lineWidth=.8;k.beginPath();k.moveTo(x0+1+i*5,47);k.lineTo(x0+3+i*5,57);k.lineTo(x0+5+i*5,47);k.fill();k.stroke()}}}};
// ---------------- 3 ผลึกน้ำแข็ง ----------------
const shard13=(k,Q,x,y,w,h,seed)=>{P13(k,Q,3,seed,[[x,y],[x+w/2,y-h],[x+w,y]]);k.strokeStyle='rgba(255,255,255,.7)';k.lineWidth=.8;k.beginPath();k.moveTo(x+w/2,y-h+2);k.lineTo(x+w/2,y-1);k.stroke()};
S13[3]={
 helm(k,Q,t,v){const side=v==='side';
  P13(k,Q,t,8,side?[[16,46],[18,28],[50,26],[52,46]]:[[12,46],[14,26],[50,26],[52,46]]);
  for(const [x,w,h] of side?[[16,8,16],[24,8,24],[34,8,18],[44,8,12]]:[[13,7,14],[20,8,22],[28,8,30],[36,8,22],[45,7,14]])shard13(k,Q,x,28,w,h,x);
  k.fillStyle='rgba(255,255,255,.55)';for(const x of side?[30]:[24,40]){k.beginPath();k.arc(x,36,1.5,0,7);k.fill()}if(v!=='back')glow13(k,side?40:32,34,8,'rgba(170,240,255,.6)')},
 chest(k,Q,t,v){const side=v==='side';
  if(side){P13(k,Q,t,21,[[23,12],[41,12],[44,30],[40,57],[24,57],[20,30]]);shard13(k,Q,26,16,10,16,5);L13(k,'rgba(255,255,255,.5)',1,[[24,30],[42,30]]);return}
  P13(k,Q,t,11,[[15,12],[25,10],[32,16],[39,10],[49,12],[54,30],[46,57],[18,57],[10,30]]);
  L13(k,'rgba(20,40,60,.5)',1.2,[[32,16],[22,30],[32,46],[42,30],[32,16]]);L13(k,'rgba(255,255,255,.55)',1,[[16,14],[22,30],[18,56]]);L13(k,'rgba(255,255,255,.55)',1,[[48,14],[42,30],[46,56]]);
  for(const s of [-1,1]){shard13(k,Q,32+s*20-5,16,10,16,9+s);shard13(k,Q,32+s*25-4,18,8,10,12+s)}
  if(v==='front'){P13(k,{hi:'#ffffff',mid:'#bff0ff',lo:'#5ab4e8',gl:'#fff',k:0},5,14,[[32,24],[38,31],[32,40],[26,31]]);glow13(k,32,31,10,'rgba(170,240,255,.6)')}},
 pants(k,Q,t){P13(k,Q,t,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);for(const x of [17,34]){L13(k,'rgba(20,40,60,.45)',1.1,[[x,30],[x+6,40],[x+13,30]]);shard13(k,Q,x+3,42,7,10,x)}L13(k,'rgba(255,255,255,.6)',1,[[16,12],[20,58]])},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,t,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);shard13(k,Q,x0+4,20,10,12,x0);shard13(k,Q,x0+6,40,8,10,x0+1);L13(k,'rgba(255,255,255,.55)',1,[[x0+3,12],[x0+1,50]])}}};
// ---------------- 4 เงาจันทรา ----------------
const moon13=(k,x,y,r,c)=>{k.save();k.fillStyle=c;k.beginPath();k.arc(x,y,r,0,7);k.fill();k.globalCompositeOperation='destination-out';k.beginPath();k.arc(x+r*.45,y-r*.2,r*.85,0,7);k.fill();k.restore()};
const CLOTH4={hi:'#6a5aa8',mid:'#3a2e6a',lo:'#1e1640',dk:'#0e0a20',gl:'#d8c8ff',gd:'#c8c0e8',k:0};
S13[4]={
 helm(k,Q,t,v){const side=v==='side';
  P13(k,CLOTH4,0,7,side?[[14,58],[14,28],[22,14],[44,14],[52,28],[52,40],[40,40],[40,58]]:[[10,58],[12,28],[22,14],[42,14],[52,28],[54,58],[44,50],[20,50]]);
  P13(k,Q,t,8,side?[[18,30],[22,16],[46,16],[50,30]]:[[14,30],[22,16],[42,16],[50,30]]);
  for(const s of side?[1]:[-1,1]){k.save();k.translate(side?30:32+s*14,16);k.scale(s,1);k.fillStyle=Q.hi;k.strokeStyle='#1e1640';k.lineWidth=1.2;k.beginPath();k.moveTo(0,0);k.quadraticCurveTo(10,-6,8,-20);k.quadraticCurveTo(4,-10,-4,-2);k.closePath();k.fill();k.stroke();k.restore()}
  if(v==='back')return;moon13(k,side?36:32,23,5,'#fff6d0');glow13(k,side?36:32,23,9,'rgba(220,210,255,.5)');k.fillStyle='rgba(8,6,20,.85)';side?k.fillRect(40,32,12,7):k.fillRect(18,32,28,7)},
 chest(k,Q,t,v){const side=v==='side';
  if(side){P13(k,CLOTH4,0,21,[[23,12],[41,12],[44,40],[46,60],[20,60],[22,30]]);P13(k,Q,t,22,[[22,12],[42,12],[42,24],[22,24]]);return}
  P13(k,CLOTH4,0,11,[[15,12],[25,10],[32,16],[39,10],[49,12],[52,34],[56,60],[8,60],[12,34]]);
  P13(k,Q,t,12,[[18,12],[46,12],[48,30],[32,36],[16,30]]);for(const s of [-1,1])E13(k,Q,t,30+s,32+s*20,15,9,6);
  if(v==='front'){moon13(k,32,24,6,'#fff6d0');glow13(k,32,24,10,'rgba(220,210,255,.55)')}else L13(k,Q.hi,1.4,[[20,40],[32,60],[44,40]]);
  L13(k,Q.gd,1.6,[[12,34],[32,40],[52,34]])},
 pants(k,Q,t){P13(k,CLOTH4,0,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);for(const x of [16,33])P13(k,Q,t,x,[[x+1,22],[x+14,22],[x+12,36],[x+7,40],[x+3,36]]);P13(k,Q,t,16,[[12,8],[52,8],[52,14],[12,14]]);moon13(k,32,11,3,'#fff6d0')},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,CLOTH4,0,50+x0,[[x0+3,10],[x0+16,8],[x0+18,50],[x0+1,54]]);P13(k,Q,t,60+x0,[[x0+2,26],[x0+18,24],[x0+19,40],[x0+1,42]]);moon13(k,x0+10,33,3.2,'#fff6d0')}}};
// ---------------- 5 เทพตำนาน ----------------
const wing13=(k,x,y,s,sc)=>{k.save();k.translate(x,y);k.scale(s*sc,sc);for(let i=0;i<4;i++){k.fillStyle=i%2?'#ffffff':'#fff2c8';k.strokeStyle='rgba(120,90,30,.6)';k.lineWidth=.9;k.beginPath();k.moveTo(0,i*3);k.quadraticCurveTo(10,-6+i*3,18-i*2,-12+i*5);k.quadraticCurveTo(8,0+i*3,0,4+i*3);k.closePath();k.fill();k.stroke()}k.restore()};
const sun13=(k,x,y,r)=>{k.save();k.fillStyle='#ffd23a';k.strokeStyle='#8a5a08';k.lineWidth=1;for(let i=0;i<8;i++){const a=i*Math.PI/4;k.beginPath();k.moveTo(x+Math.cos(a)*r*.6,y+Math.sin(a)*r*.6);k.lineTo(x+Math.cos(a+.2)*r*1.4,y+Math.sin(a+.2)*r*1.4);k.lineTo(x+Math.cos(a+.4)*r*.6,y+Math.sin(a+.4)*r*.6);k.fill()}k.beginPath();k.arc(x,y,r*.65,0,7);k.fill();k.stroke();k.fillStyle='#ff5a8a';k.beginPath();k.arc(x,y,r*.3,0,7);k.fill();k.restore()};
S13[5]={
 helm(k,Q,t,v){const side=v==='side';
  k.strokeStyle='rgba(255,230,140,.9)';k.lineWidth=2;k.beginPath();k.ellipse(side?34:32,6,14,3.5,0,0,7);k.stroke();glow13(k,side?34:32,6,14,'rgba(255,240,170,.45)');
  const dom=side?[[14,56],[14,30],[22,12],[44,10],[54,24],[55,46],[42,56]]:[[11,54],[11,28],[20,12],[32,9],[44,12],[53,28],[53,54],[44,58],[20,58]];P13(k,Q,t,18,dom);
  for(const s of side?[-1]:[-1,1])wing13(k,side?18:32+s*20,24,s,side?1.1:.9);
  if(v==='back')return;k.fillStyle='#1a1408';side?k.fillRect(40,30,14,8):k.fillRect(17,31,30,8);sun13(k,side?34:32,20,4)},
 chest(k,Q,t,v){const side=v==='side';const body=side?[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]:[[15,12],[25,10],[32,16],[39,10],[49,12],[52,30],[46,57],[18,57],[12,30]];
  P13(k,Q,t,11,body);L13(k,Q.lo,1.2,side?[[24,30],[40,30]]:[[17,31],[32,36],[47,31]]);
  for(const s of side?[1]:[-1,1])wing13(k,side?30:32+s*16,14,s,side?1:.85);
  if(v==='front')sun13(k,32,26,6);P13(k,{hi:'#fff8e0',mid:'#e8c870',lo:'#9a7020',gl:'#fff',k:0},5,12,side?[[22,45],[42,45],[42,51],[22,51]]:[[15,45],[49,45],[49,51],[15,51]]);
  k.fillStyle='#5ad8ff';for(const x of side?[32]:[22,32,42]){k.beginPath();k.arc(x,48,1.8,0,7);k.fill()}},
 pants(k,Q,t){P13(k,Q,t,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);for(const x of [17,34])P13(k,{hi:'#fff8e0',mid:'#e8c870',lo:'#9a7020',gl:'#fff',k:0},5,x,[[x,20],[x+13,20],[x+11,36],[x+6.5,42],[x+2,36]]);
  k.fillStyle='#ff5a8a';for(const x of [23.5,40.5]){k.beginPath();k.arc(x,30,2,0,7);k.fill()}P13(k,Q,t,16,[[12,8],[52,8],[52,15],[12,15]])},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,Q,t,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);wing13(k,x0+(x0<20?2:18),26,x0<20?-1:1,.6);k.fillStyle='#5ad8ff';k.beginPath();k.arc(x0+10,40,2,0,7);k.fill()}}};
// ---------- ใช้ทรงใหม่แทนทรงอัศวินเดิม ----------
const _ph13=paintHelm,_pc13=paintChest,_pp13=paintPants,_pa13=paintArm;
paintHelm=function(k,Q,t,view){try{return S13[t|0].helm(k,Q,t,view||'front')}catch(e){return _ph13(k,Q,t,view)}};
paintChest=function(k,Q,t,view){try{return S13[t|0].chest(k,Q,t,view||'front')}catch(e){return _pc13(k,Q,t,view)}};
paintPants=function(k,Q,t){try{return S13[t|0].pants(k,Q,t)}catch(e){return _pp13(k,Q,t)}};
paintArm=function(k,Q,t){try{return S13[t|0].arm(k,Q,t)}catch(e){return _pa13(k,Q,t)}};
// ---------- ดาบ 6 ทรงตามเซ็ต ----------
const SW13=[
 // นักล่าเงา: กริชยาวโค้งดำ
 (k,Q,t)=>{P13(k,LEATHER,0,1,[[26,50],[38,50],[36,58],[28,58]]);P13(k,Q,t,2,[[30,48],[34,48],[36,30],[40,12],[34,6],[30,20]]);L13(k,'rgba(200,160,255,.6)',1,[[33,44],[36,18]]);P13(k,Q,t,3,[[22,46],[42,46],[40,50],[24,50]])},
 // พฤกษาโบราณ: ดาบไม้ใบกว้าง พันเถา
 (k,Q,t)=>{P13(k,BARK,0,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,t,2,[[26,46],[38,46],[40,22],[32,4],[24,22]]);L13(k,'#2e6a1e',1.6,[[32,44],[28,34],[36,26],[30,16]]);leaf13(k,24,46,Math.PI,1);leaf13(k,40,46,0,1);P13(k,BARK,0,3,[[20,44],[44,44],[42,49],[22,49]])},
 // มังกรเพลิง: ดาบใหญ่ฟันเลื่อย ด้ามเขี้ยว
 (k,Q,t)=>{P13(k,{hi:'#6a2a14',mid:'#3a1408',lo:'#1a0804',gl:Q.gl,k:0},0,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,t,2,[[25,46],[39,46],[41,36],[38,32],[41,26],[38,22],[40,14],[32,2],[24,16],[26,22],[23,28],[26,32],[23,38]]);glow13(k,32,26,10,'rgba(255,120,30,.45)');for(const s of [-1,1]){k.fillStyle='#fff0d8';k.beginPath();k.moveTo(32,46);k.lineTo(32+s*14,40);k.lineTo(32+s*8,50);k.fill()}},
 // ผลึกน้ำแข็ง: ดาบผลึกเหลี่ยมโปร่ง
 (k,Q,t)=>{P13(k,{hi:'#c8d8e8',mid:'#7a8aa0',lo:'#3a4a5a',gl:'#fff',k:0},0,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,t,2,[[28,46],[36,46],[39,16],[32,2],[25,16]]);L13(k,'rgba(255,255,255,.7)',1,[[32,44],[32,6]]);shard13(k,Q,22,48,8,10,4);shard13(k,Q,34,48,8,10,5);glow13(k,32,20,10,'rgba(170,240,255,.45)')},
 // เงาจันทรา: ดาบเรียวโค้ง การ์ดจันทร์เสี้ยว
 (k,Q,t)=>{P13(k,CLOTH4,0,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,t,2,[[30,46],[35,46],[38,24],[36,8],[31,4],[33,16],[31,30]]);moon13(k,32,48,7,Q.gd);L13(k,'rgba(255,255,255,.6)',1,[[33,42],[35,12]])},
 // เทพตำนาน: ดาบทองปีก พร้อมอัญมณี
 (k,Q,t)=>{P13(k,{hi:'#fff8e0',mid:'#e8c870',lo:'#9a7020',gl:'#fff',k:0},5,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,Q,t,2,[[27,46],[37,46],[38,14],[32,2],[26,14]]);wing13(k,26,46,-1,.8);wing13(k,38,46,1,.8);k.fillStyle='#ff5a8a';k.beginPath();k.arc(32,47,2.6,0,7);k.fill();glow13(k,32,20,12,'rgba(255,240,170,.5)')}];
{const _pi=paintItem;paintItem=function(k,type,t){if(type==='sword'&&SW13[t|0]){k.lineJoin='round';try{return SW13[t|0](k,TIERS[t],t)}catch(e){}}return _pi(k,type,t)}}
for(const k in SPRC)delete SPRC[k];for(const k in TICON)if(!/^(axe|pick|staff|bow)/.test(k))delete TICON[k];for(const k in IURL)if(/^item:/.test(k)&&!/^item:(axe|pick|staff|bow)/.test(k))delete IURL[k];

// =====================================================================
