// ภาพร้านค้า: ไอคอนป้าย (ดาบ+โล่ / ขวดยา / แก้วเบียร์) · ของตกแต่ง · ฉากด้านในร้าน (วาดลงแคนวาสครั้งเดียว)
// ฉากร้านกว้าง IW×IH ช่อง: แถว 0-1 = ผนังหลัง · แถว 2 = ที่ยืนของเจ้าของร้าน · แถว 3 = เคาน์เตอร์ · แถว 4-9 = พื้นที่ลูกค้า · แถว 10 = ผนังหน้า+ประตูออก
const IW=26,IH=15,CNT=6,OUT='#1b1c24';const OXT=5,OX=OXT*T;
function rr(k,x,y,w,h,r){k.beginPath();k.moveTo(x+r,y);k.arcTo(x+w,y,x+w,y+h,r);k.arcTo(x+w,y+h,x,y+h,r);k.arcTo(x,y+h,x,y,r);k.arcTo(x,y,x+w,y,r);k.closePath()}
const dot_=(k,x,y,r,f)=>{k.fillStyle=f;k.beginPath();k.arc(x,y,r,0,7);k.fill()};
const spr=f=>(k,x,y,s=1,a=0,...r)=>{k.save();k.translate(x,y);k.rotate(a);k.scale(s,s);k.lineJoin='round';f(k,...r);k.restore()};
const lg=(k,x0,y0,x1,y1,c0,c1)=>{const g=k.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,c0);g.addColorStop(1,c1);return g};
// ---- ชุดสไปรต์ของในร้าน (จุดอ้างอิงอยู่ที่ก้น/กึ่งกลางของแต่ละชิ้น) ----
const IT={
 sword:spr((k,bl='#e9eff8')=>{k.lineWidth=1;k.strokeStyle=OUT;k.fillStyle=bl;k.beginPath();k.moveTo(-3,0);k.lineTo(-3,-22);k.lineTo(0,-29);k.lineTo(3,-22);k.lineTo(3,0);k.closePath();k.fill();k.stroke();
  k.fillStyle='#a9b8cf';k.fillRect(0,-24,1.5,24);k.fillStyle='#e0b84a';k.fillRect(-8,0,16,3.6);k.strokeRect(-8,0,16,3.6);
  k.fillStyle='#6b3f1f';k.fillRect(-2,3.6,4,8);k.strokeRect(-2,3.6,4,8);k.fillStyle='#e0b84a';k.beginPath();k.arc(0,13.5,2.8,0,7);k.fill();k.stroke()}),
 shield:spr((k,c1='#5d92e6',c2='#254a9a',em='#f0c648')=>{const p=()=>{k.beginPath();k.moveTo(-12,-13);k.lineTo(12,-13);k.lineTo(12,3);k.quadraticCurveTo(12,14,0,21);k.quadraticCurveTo(-12,14,-12,3);k.closePath()};
  p();k.fillStyle=lg(k,-12,-13,12,21,c1,c2);k.fill();k.strokeStyle=OUT;k.lineWidth=4.6;k.stroke();k.strokeStyle='#d9deea';k.lineWidth=2.4;k.stroke();k.fillStyle=em;k.fillRect(-2.2,-10,4.4,24);k.fillRect(-8,-3,16,4.4)}),
 axe:spr(k=>{k.lineWidth=1;k.strokeStyle=OUT;k.fillStyle='#7a4a24';k.fillRect(-1.8,-24,3.6,40);k.strokeRect(-1.8,-24,3.6,40);
  k.fillStyle='#cfd6e2';k.beginPath();k.moveTo(1.8,-24);k.quadraticCurveTo(15,-27,14,-9);k.quadraticCurveTo(7,-12,1.8,-10);k.closePath();k.fill();k.stroke();
  k.fillStyle='#8b97ab';k.beginPath();k.moveTo(-1.8,-24);k.lineTo(-6,-22);k.lineTo(-6,-13);k.lineTo(-1.8,-11);k.closePath();k.fill();k.stroke()}),
 pick:spr(k=>{k.lineWidth=1;k.strokeStyle=OUT;k.fillStyle='#7a4a24';k.fillRect(-1.8,-20,3.6,38);k.strokeRect(-1.8,-20,3.6,38);k.lineCap='round';
  k.beginPath();k.arc(0,-2,17,Math.PI*1.18,Math.PI*1.82);k.strokeStyle=OUT;k.lineWidth=6;k.stroke();k.strokeStyle='#cfd6e2';k.lineWidth=3.4;k.stroke()}),
 spear:spr(k=>{k.lineWidth=1;k.strokeStyle=OUT;k.fillStyle='#8a5a30';k.fillRect(-1.5,-26,3,52);k.strokeRect(-1.5,-26,3,52);k.fillStyle='#dfe6f1';k.beginPath();k.moveTo(0,-40);k.lineTo(5,-26);k.lineTo(0,-23);k.lineTo(-5,-26);k.closePath();k.fill();k.stroke()}),
 helm:spr(k=>{k.lineWidth=1.2;k.strokeStyle=OUT;k.fillStyle='#b9c2d2';k.beginPath();k.moveTo(-10,8);k.lineTo(-10,-2);k.quadraticCurveTo(-10,-14,0,-14);k.quadraticCurveTo(10,-14,10,-2);k.lineTo(10,8);k.closePath();k.fill();k.stroke();
  k.fillStyle=OUT;k.fillRect(-7,-2,14,4);k.fillRect(-1,-2,2,10);k.fillStyle='#c0392b';k.fillRect(-1.5,-19,3,6)}),
 anvil:spr(k=>{k.lineWidth=1.2;k.strokeStyle=OUT;k.fillStyle='#4a4d58';k.beginPath();k.moveTo(-14,-14);k.lineTo(16,-14);k.lineTo(10,-8);k.lineTo(6,-8);k.lineTo(8,0);k.lineTo(-8,0);k.lineTo(-6,-8);k.lineTo(-10,-8);k.closePath();k.fill();k.stroke();k.fillStyle='#6a6e7c';k.fillRect(-14,-14,30,3)}),
 bottle:spr((k,col='#c04bff',kind=0)=>{const body=()=>{k.beginPath();if(kind===1){k.moveTo(-4.5,0);k.lineTo(-4.5,-14);k.lineTo(-2,-18);k.lineTo(-2,-23);k.lineTo(2,-23);k.lineTo(2,-18);k.lineTo(4.5,-14);k.lineTo(4.5,0)}
   else if(kind===2){k.moveTo(-8,0);k.lineTo(-2,-14);k.lineTo(-2,-19);k.lineTo(2,-19);k.lineTo(2,-14);k.lineTo(8,0)}
   else{k.moveTo(-2.5,-12);k.lineTo(-2.5,-18);k.lineTo(2.5,-18);k.lineTo(2.5,-12);k.bezierCurveTo(10,-9,9,0,0,0);k.bezierCurveTo(-9,0,-10,-9,-2.5,-12)}k.closePath()};
  body();k.fillStyle='rgba(225,240,255,.4)';k.fill();k.save();body();k.clip();k.fillStyle=col;k.fillRect(-10,kind===1?-12:-9,20,22);k.fillStyle='rgba(255,255,255,.35)';k.fillRect(-3.4,-14,1.6,12);k.restore();
  body();k.strokeStyle=OUT;k.lineWidth=1.2;k.stroke();k.fillStyle='#b9854a';k.fillRect(-2.6,kind===1?-26:kind===2?-22:-21,5.2,3.4)}),
 mug:spr(k=>{k.strokeStyle='#cfd8e2';k.lineWidth=2.4;k.beginPath();k.arc(5.5,-6,3.6,-1.4,1.4);k.stroke();k.fillStyle=lg(k,0,-12,0,0,'#f6c342','#d9871a');k.fillRect(-5,-12,10,12);k.strokeStyle=OUT;k.lineWidth=1;k.strokeRect(-5,-12,10,12);
  k.fillStyle='rgba(255,255,255,.4)';k.fillRect(-3.4,-10,1.6,7);for(const [x,y,r] of [[-3,-13,2.6],[0,-14.5,3],[3.2,-13,2.6]])dot_(k,x,y,r,'#fffdf2')}),
 barrel:spr((k,c='#8a5a2e')=>{k.beginPath();k.moveTo(-11,0);k.quadraticCurveTo(-14,-14,-11,-27);k.lineTo(11,-27);k.quadraticCurveTo(14,-14,11,0);k.closePath();k.fillStyle=lg(k,-12,0,12,0,'#5a3a1c',c);k.fill();k.strokeStyle=OUT;k.lineWidth=1.2;k.stroke();
  k.fillStyle='#3a3d46';k.fillRect(-12.5,-22,25,3);k.fillRect(-12.5,-7,25,3);k.strokeStyle='rgba(0,0,0,.3)';k.lineWidth=1;for(const x of [-5,0,5]){k.beginPath();k.moveTo(x,-27);k.lineTo(x,0);k.stroke()}
  k.fillStyle='#9a6a38';k.beginPath();k.ellipse(0,-27,11,3.4,0,0,7);k.fill();k.stroke()}),
 crate:spr((k,c='#a27440')=>{k.fillStyle=c;k.fillRect(-12,-20,24,20);k.strokeStyle=OUT;k.lineWidth=1.2;k.strokeRect(-12,-20,24,20);k.strokeStyle='rgba(40,22,8,.6)';k.beginPath();k.moveTo(-12,-20);k.lineTo(12,0);k.moveTo(12,-20);k.lineTo(-12,0);k.stroke();k.fillStyle='rgba(255,255,255,.12)';k.fillRect(-12,-20,24,3)}),
 keg:spr(k=>{k.fillStyle=lg(k,0,-15,0,15,'#a06c38','#6e451f');k.beginPath();k.arc(0,0,15,0,7);k.fill();k.strokeStyle=OUT;k.lineWidth=1.2;k.stroke();k.strokeStyle='#3a3d46';k.lineWidth=2.4;for(const r of [12,7]){k.beginPath();k.arc(0,0,r,0,7);k.stroke()}
  k.fillStyle='#c9a13a';k.fillRect(-2.4,-1,4.8,8);dot_(k,0,-1,2.6,'#e8c14a')}),
 gem:spr((k,c='#5ec8ff')=>{k.beginPath();k.moveTo(0,-9);k.lineTo(7,-3);k.lineTo(0,8);k.lineTo(-7,-3);k.closePath();k.fillStyle=lg(k,-7,-9,7,8,'#e9fbff',c);k.fill();k.strokeStyle=OUT;k.lineWidth=1;k.stroke();k.strokeStyle='rgba(255,255,255,.8)';k.beginPath();k.moveTo(-7,-3);k.lineTo(7,-3);k.moveTo(0,-9);k.lineTo(-2,-3);k.lineTo(0,8)}),
 pouch:spr(k=>{k.fillStyle='#8a5a30';k.beginPath();k.moveTo(-8,0);k.quadraticCurveTo(-10,-10,-3,-12);k.lineTo(3,-12);k.quadraticCurveTo(10,-10,8,0);k.closePath();k.fill();k.strokeStyle=OUT;k.lineWidth=1.1;k.stroke();k.fillStyle='#c9a13a';k.fillRect(-4,-13,8,3);dot_(k,0,-5,3,'#f0c648')}),
 book:spr((k,c='#7a2a2a')=>{k.fillStyle=c;k.fillRect(-12,-4,24,5);k.fillStyle='#f3ead0';k.beginPath();k.moveTo(0,-5);k.lineTo(-11,-8);k.lineTo(-11,-1);k.lineTo(0,2);k.closePath();k.fill();k.beginPath();k.moveTo(0,-5);k.lineTo(11,-8);k.lineTo(11,-1);k.lineTo(0,2);k.closePath();k.fill();k.strokeStyle='rgba(60,40,20,.6)';k.lineWidth=.8;k.stroke()}),
 orb:spr(k=>{k.fillStyle='#3a2a1a';k.fillRect(-6,-3,12,3);dot_(k,0,-11,8,'rgba(150,200,255,.55)');k.strokeStyle='#cfe6ff';k.lineWidth=1.2;k.beginPath();k.arc(0,-11,8,0,7);k.stroke();dot_(k,-2.4,-13.4,2.4,'rgba(255,255,255,.75)')}),
 mortar:spr(k=>{k.fillStyle='#8f8a82';k.beginPath();k.moveTo(-8,-9);k.lineTo(8,-9);k.lineTo(6,0);k.lineTo(-6,0);k.closePath();k.fill();k.strokeStyle=OUT;k.lineWidth=1.1;k.stroke();k.fillStyle='#5c9c4a';k.fillRect(-6,-11,12,3);k.strokeStyle='#d9d3c4';k.lineWidth=3;k.beginPath();k.moveTo(2,-9);k.lineTo(9,-20);k.stroke()}),
 herb:spr((k,c='#4f8a3a')=>{k.strokeStyle='#5a4426';k.lineWidth=1.2;k.beginPath();k.moveTo(0,0);k.lineTo(0,6);k.stroke();k.fillStyle='#8a6a3a';k.fillRect(-2,5,4,3);for(let i=0;i<7;i++){const a=-.9+i*.3;k.strokeStyle=i%2?c:'#6aa04a';k.lineWidth=2.4;k.beginPath();k.moveTo(0,8);k.lineTo(Math.sin(a)*3.6,8+Math.cos(a)*15+i%3*2);k.stroke()}}),
 plant:spr((k)=>{k.fillStyle='#8a4a2a';k.beginPath();k.moveTo(-8,-12);k.lineTo(8,-12);k.lineTo(6,0);k.lineTo(-6,0);k.closePath();k.fill();k.strokeStyle=OUT;k.lineWidth=1.1;k.stroke();for(let i=0;i<6;i++){const a=-1.2+i*.48;k.strokeStyle=i%2?'#3f8a3a':'#5fae4a';k.lineWidth=3.4;k.beginPath();k.moveTo(0,-12);k.lineTo(Math.sin(a)*13,-12-Math.cos(a)*15);k.stroke()}}),
 candle:spr(k=>{k.fillStyle='#f4ecd0';k.fillRect(-2,-9,4,9);k.strokeStyle=OUT;k.lineWidth=.8;k.strokeRect(-2,-9,4,9);k.fillStyle='#3a2a1a';k.fillRect(-4,0,8,2)}),
 stool:spr(k=>{k.fillStyle='#6e451f';k.beginPath();k.ellipse(0,-9,8,3.6,0,0,7);k.fill();k.strokeStyle=OUT;k.lineWidth=1;k.stroke();k.fillStyle='#4a2c14';k.fillRect(-6,-8,2.6,8);k.fillRect(3.4,-8,2.6,8)}),
 plate:spr(k=>{k.fillStyle='#e9e2d0';k.beginPath();k.ellipse(0,0,7,3,0,0,7);k.fill();k.strokeStyle='rgba(60,40,20,.6)';k.lineWidth=.8;k.stroke();dot_(k,0,-1.6,2.6,'#d9a45a')}),
};
// ---- ป้ายหน้าร้าน: แผ่นป้ายไม้ขอบทอง + รูปสัญลักษณ์ ----
const SIGN_ICONS={
 gear(k){IT.sword(k,7,-6,1.05,.72);IT.shield(k,-4,2,.98,0)},
 potion(k){const body=()=>{k.beginPath();k.moveTo(-4.5,-20);k.lineTo(4.5,-20);k.lineTo(4.5,-10);k.bezierCurveTo(16,-4,17,10,10,17);k.quadraticCurveTo(0,23,-10,17);k.bezierCurveTo(-17,10,-16,-4,-4.5,-10);k.closePath()};
  body();k.fillStyle='rgba(225,240,255,.4)';k.fill();k.save();body();k.clip();k.fillStyle=lg(k,0,-4,0,22,'#e063ff','#6d20cc');k.beginPath();k.moveTo(-20,-1);k.quadraticCurveTo(-10,-5,0,-1);k.quadraticCurveTo(10,3,20,-1);k.lineTo(20,26);k.lineTo(-20,26);k.fill();
  dot_(k,-4,10,2.2,'rgba(255,255,255,.75)');dot_(k,4,5,1.6,'rgba(255,255,255,.75)');dot_(k,2,14,1.3,'rgba(255,255,255,.75)');k.restore();
  body();k.strokeStyle=OUT;k.lineWidth=3.6;k.stroke();k.strokeStyle='#e6f4ff';k.lineWidth=1.5;k.stroke();k.strokeStyle='rgba(255,255,255,.8)';k.lineWidth=2;k.beginPath();k.moveTo(-10,3);k.quadraticCurveTo(-12,9,-9,13);k.stroke();
  k.fillStyle='#b9854a';k.fillRect(-5.5,-26,11,7);k.strokeStyle=OUT;k.lineWidth=1.2;k.strokeRect(-5.5,-26,11,7);
  for(const [x,y,s] of [[16,-15,4.5],[-18,-9,3]]){k.fillStyle='#ffe27a';k.beginPath();k.moveTo(x,y-s);k.lineTo(x+s*.3,y-s*.3);k.lineTo(x+s,y);k.lineTo(x+s*.3,y+s*.3);k.lineTo(x,y+s);k.lineTo(x-s*.3,y+s*.3);k.lineTo(x-s,y);k.lineTo(x-s*.3,y-s*.3);k.closePath();k.fill()}},
 beer(k){k.lineCap='round';k.strokeStyle=OUT;k.lineWidth=8;k.beginPath();k.arc(13,2,7.5,-1.3,1.3);k.stroke();k.strokeStyle='#d8e3ee';k.lineWidth=4.4;k.beginPath();k.arc(13,2,7.5,-1.3,1.3);k.stroke();
  const body=()=>{k.beginPath();k.moveTo(-13,-12);k.lineTo(10,-12);k.lineTo(8.5,18);k.quadraticCurveTo(8,21,5,21);k.lineTo(-8,21);k.quadraticCurveTo(-11.5,21,-11.8,18);k.closePath()};
  body();k.fillStyle='rgba(235,245,255,.4)';k.fill();k.save();body();k.clip();k.fillStyle=lg(k,0,-10,0,22,'#ffd75a','#e08a14');k.fillRect(-14,-9,26,32);k.fillStyle='rgba(255,255,255,.35)';k.fillRect(-8,-8,3,26);
  dot_(k,-1,10,1.6,'rgba(255,255,255,.7)');dot_(k,3,2,1.3,'rgba(255,255,255,.7)');dot_(k,1,15,1.2,'rgba(255,255,255,.7)');k.restore();body();k.strokeStyle=OUT;k.lineWidth=3.4;k.stroke();k.strokeStyle='#e6f4ff';k.lineWidth=1.3;k.stroke();
  for(const [x,y,r] of [[-9,-12,5],[-3,-16,6.4],[4,-14,5.6],[9.5,-10.5,3.6],[-12.5,-8,3.4]])dot_(k,x,y,r,'#fffdf2');k.strokeStyle='rgba(150,120,60,.5)';k.lineWidth=1;k.beginPath();k.arc(-3,-16,6.4,3.4,5.6);k.stroke()}};
function shopSign(k,S){const [bx,by]=S.b,sg=S.sign,w=sg.arm?50:56,h=sg.arm?36:38;k.save();k.translate(bx*T+sg.x,by*T+sg.y);k.lineJoin='round';k.lineCap='round';
 if(sg.arm){const ay=-h/2-6;k.strokeStyle=OUT;k.lineWidth=4.6;k.beginPath();k.moveTo(-sg.arm-6,ay+3);k.lineTo(w/2+6,ay);k.stroke();k.strokeStyle='#5a5d6a';k.lineWidth=2.2;k.stroke();
  k.strokeStyle=OUT;k.lineWidth=3.4;k.beginPath();k.moveTo(-sg.arm-6,ay+19);k.lineTo(-sg.arm+14,ay+1);k.stroke();k.strokeStyle='#5a5d6a';k.lineWidth=1.6;k.stroke();
  k.lineWidth=1.6;k.strokeStyle='#8a8d98';for(const cx of [-w/2+7,w/2-7]){k.beginPath();k.moveTo(cx,ay+1);k.lineTo(cx,-h/2+2);k.stroke()}}
 k.fillStyle='rgba(0,0,0,.3)';rr(k,-w/2+3,-h/2+4,w,h,6);k.fill();
 rr(k,-w/2,-h/2,w,h,6);k.fillStyle=lg(k,0,-h/2,0,h/2,'#5e3d20','#33200f');k.fill();k.strokeStyle=OUT;k.lineWidth=3;k.stroke();k.strokeStyle='#e8c14a';k.lineWidth=1.6;k.stroke();
 rr(k,-w/2+3.5,-h/2+3.5,w-7,h-7,4);k.strokeStyle='rgba(0,0,0,.45)';k.lineWidth=1;k.stroke();
 k.save();k.scale(.74,.74);SIGN_ICONS[S.icon](k);k.restore();k.restore()}

// ---- โครง: พื้น ผนัง เคาน์เตอร์ ประตูออก ----
function shell(k,th){const W_=IW*T,H_=IH*T;
 if(th.floor==='slate'){for(let y=2;y<IH;y++)for(let x=0;x<IW;x++){const px=x*T,py=y*T,h=hash(x*3.1,y*5.3);k.fillStyle=h>.5?th.f1:th.f2;k.fillRect(px,py,T,T);k.fillStyle='rgba(0,0,0,.22)';k.fillRect(px,py,T,1);k.fillRect(px,py,1,T);k.fillStyle='rgba(255,255,255,.05)';k.fillRect(px+2,py+2,T-4,2);
   if(h>.82){k.strokeStyle='rgba(0,0,0,.22)';k.beginPath();k.moveTo(px+6,py+8);k.lineTo(px+15,py+16);k.lineTo(px+12,py+25);k.stroke()}}}
 else for(let y=2*T;y<H_;y+=8){const r=(y/8)|0;k.fillStyle=r%2?th.f1:th.f2;k.fillRect(0,y,W_,8);k.fillStyle='rgba(0,0,0,.24)';k.fillRect(0,y,W_,1);for(let x=hash(r,2)*60;x<W_;x+=64+hash(r,x)*44)k.fillRect(x|0,y,1,8);k.fillStyle='rgba(255,255,255,.05)';k.fillRect(0,y+1,W_,1)}
 // ผนังหลัง
 k.fillStyle=lg(k,0,0,0,2*T,th.w1,th.w2);k.fillRect(0,0,W_,2*T);
 if(th.brick){k.strokeStyle='rgba(0,0,0,.2)';k.lineWidth=1;for(let y=0;y<2*T;y+=8){k.beginPath();k.moveTo(0,y+.5);k.lineTo(W_,y+.5);k.stroke();for(let x=((y/8)%2)*12;x<W_;x+=24){k.beginPath();k.moveTo(x+.5,y);k.lineTo(x+.5,y+8);k.stroke()}}}
 else{k.fillStyle='rgba(0,0,0,.06)';for(let x=0;x<W_;x+=16)k.fillRect(x,0,1,2*T)}
 k.fillStyle=th.wood;k.fillRect(0,2*T-18,W_,18);k.fillStyle='rgba(0,0,0,.28)';for(let x=0;x<W_;x+=20)k.fillRect(x,2*T-18,1,18);k.fillStyle='rgba(255,255,255,.1)';k.fillRect(0,2*T-18,W_,2);
 k.fillStyle=th.beam;k.fillRect(0,0,W_,9);k.fillStyle='rgba(255,255,255,.1)';k.fillRect(0,0,W_,2);for(const x of [T,5*T,9*T,13*T-4,17*T,21*T,W_-T-8]){k.fillStyle=th.beam;k.fillRect(x,0,8,2*T-18);k.fillStyle='rgba(255,255,255,.07)';k.fillRect(x,0,2,2*T-18)}
 const sh=k.createLinearGradient(0,2*T,0,2*T+16);sh.addColorStop(0,'rgba(0,0,0,.4)');sh.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=sh;k.fillRect(0,2*T,W_,16);
 // ผนังข้าง + ผนังหน้า
 for(const sx of [0,W_-T]){k.fillStyle=lg(k,sx,0,sx+T,0,sx?th.w2:th.beam,sx?th.beam:th.w2);k.fillRect(sx,0,T,H_);k.fillStyle=th.wood;k.fillRect(sx?sx+T-8:sx,0,8,H_)}
 const sg=k.createLinearGradient(0,0,0,0);k.fillStyle='rgba(0,0,0,.28)';k.fillRect(T,2*T,10,H_-3*T);k.fillRect(W_-T-10,2*T,10,H_-3*T);
 k.fillStyle=th.beam;k.fillRect(0,(IH-1)*T,W_,T);k.fillStyle=th.wood;k.fillRect(0,(IH-1)*T,W_,6);
 // ประตูออก (ช่อง 7-8 แถวสุดท้าย)
 const dx=((IW>>1)-1)*T,dy=(IH-1)*T;k.fillStyle=lg(k,0,dy,0,dy+T,'#fff3c4','#e8b866');k.fillRect(dx,dy,2*T,T);k.fillStyle=th.beam;k.fillRect(dx-8,dy,8,T);k.fillRect(dx+2*T,dy,8,T);k.fillRect(dx-8,dy,2*T+16,5);
 k.fillStyle='#4a2c14';k.fillRect(dx+4,dy+8,4,T-8);k.fillStyle='rgba(255,255,255,.65)';k.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillText('▼ ทางออก ▼',dx+T,dy+T-6);k.textAlign='left';
 // ผ้าปูทางเดิน
 k.save();k.translate(OX,0);
 if(th.rug){k.fillStyle=th.rug[0];k.fillRect(7*T+4,4*T,2*T-8,6*T-4);k.fillStyle=th.rug[1];k.fillRect(7*T+8,4*T+4,2*T-16,6*T-12);k.strokeStyle=th.rug[2];k.lineWidth=2;k.strokeRect(7*T+9,4*T+5,2*T-18,6*T-14);
  k.fillStyle=th.rug[2];for(let i=0;i<5;i++){k.beginPath();k.moveTo(8*T,4*T+12+i*30);k.lineTo(8*T+9,4*T+22+i*30);k.lineTo(8*T,4*T+32+i*30);k.lineTo(8*T-9,4*T+22+i*30);k.closePath();k.fill()}
  k.fillStyle=th.rug[0];for(let x=7*T+4;x<9*T-4;x+=5)k.fillRect(x,4*T-3,2,3),k.fillRect(x,10*T-4,2,3)}k.restore();wings(k,th);k.translate(OX,0)}
function counter(k,th){const x=3*T,w=10*T,y=3*T;k.fillStyle='rgba(0,0,0,.32)';k.fillRect(x+3,y+T-3,w,7);
 k.fillStyle=th.cf;k.fillRect(x,y+12,w,T-12);k.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<=w;i+=16)k.fillRect(x+i,y+12,1,T-12);k.fillStyle=th.wood;k.fillRect(x,y+T-5,w,5);
 k.fillStyle=lg(k,0,y+1,0,y+13,th.ct,th.cf);k.fillRect(x-5,y+1,w+10,12);k.fillStyle='rgba(255,255,255,.18)';k.fillRect(x-5,y+1,w+10,2);k.strokeStyle=OUT;k.lineWidth=1;k.strokeRect(x-4.5,y+1.5,w+9,11);
 k.fillStyle='rgba(0,0,0,.2)';k.fillRect(x-5,y+12,w+10,2)}
// ฐาน 2x2 ช่อง ด้านข้างเคาน์เตอร์ (กันไม่ให้เดินอ้อมไปหลังร้าน)
function station(k,x,th,fn){const px=x*T,py=2*T;k.fillStyle='rgba(0,0,0,.3)';k.fillRect(px+2,py+2*T-3,2*T,6);fn(k,px,py)}

// ================= ร้านอุปกรณ์ =================
function artGear(k){const th={floor:'slate',f1:'#6a666e',f2:'#5f5b66',w1:'#7a7268',w2:'#5c564e',brick:1,wood:'#59381c',beam:'#35220f',ct:'#a67a48',cf:'#6a4524',rug:['#7a1f1f','#a02c2c','#e0b84a']};
 shell(k,th);
 // กระดาน + ราวอาวุธด้านซ้าย
 for(const [x0,x1] of [[56,206]]){k.fillStyle='#4a2c14';k.fillRect(x0,14,x1-x0,4);k.fillRect(x0,46,x1-x0,4);k.fillStyle='rgba(255,255,255,.12)';k.fillRect(x0,14,x1-x0,1)}
 IT.sword(k,74,38,.95);IT.axe(k,98,36,.9);IT.sword(k,122,38,.95,0,'#cfe6ff');IT.pick(k,148,34,.85);IT.spear(k,172,34,.9);IT.sword(k,194,38,.95);
 // โล่ + หมวกเหล็กด้านขวา
 for(const [x0,x1] of [[306,456]]){k.fillStyle='#4a2c14';k.fillRect(x0,14,x1-x0,4);k.fillRect(x0,46,x1-x0,4)}
 IT.shield(k,330,34,.82);IT.shield(k,372,34,.82,0,'#d9534a','#8a1f1f','#e9e2cc');IT.shield(k,414,34,.82,0,'#4fae6a','#1f6a3a');IT.helm(k,444,38,.9);
 // ป้ายตราโล่+ดาบไขว้ เหนือเจ้าของร้าน
 IT.sword(k,246,30,.9,-.9);IT.sword(k,266,30,.9,.9);IT.shield(k,256,20,.7);
 // เตาหลอมซ้าย
 station(k,1,th,(k,px,py)=>{k.fillStyle='#3d3a3f';k.fillRect(px+8,0,40,py+8);k.fillStyle='#4a474d';k.fillRect(px+10,0,10,py+8);
  k.fillStyle=lg(k,0,py,0,py+2*T,'#6a666e','#4a474d');k.fillRect(px,py+6,2*T,2*T-10);k.strokeStyle='rgba(0,0,0,.3)';for(let i=0;i<4;i++){k.beginPath();k.moveTo(px,py+14+i*13);k.lineTo(px+2*T,py+14+i*13);k.stroke()}
  k.fillStyle='#16110e';rr(k,px+10,py+24,44,26,6);k.fill();k.fillStyle=lg(k,0,py+30,0,py+50,'#ff8a2a','#b03a10');rr(k,px+13,py+30,38,19,4);k.fill();k.strokeStyle=OUT;k.lineWidth=1.4;rr(k,px+10,py+24,44,26,6);k.stroke();
  });
 // ตู้โชว์เกราะขวา
 station(k,13,th,(k,px,py)=>{k.fillStyle='#3a2412';k.beginPath();k.ellipse(px+32,py+2*T-6,24,8,0,0,7);k.fill();
   k.fillStyle=lg(k,px+12,0,px+52,0,'#4a2c14','#8a5a2e');k.fillRect(px+14,py+38,36,20);k.strokeStyle=OUT;k.lineWidth=1.2;k.strokeRect(px+14.5,py+38.5,35,19);k.fillStyle='rgba(0,0,0,.25)';for(let q=0;q<4;q++)k.fillRect(px+18+q*9,py+39,1,19);
   IT.helm(k,px+32,py+32,.85);IT.shield(k,px+20,py+30,.42,0,'#c0392b','#7a1a12');IT.shield(k,px+44,py+30,.42,0,'#4f7ae8','#1f3a8a');
   
   k.fillStyle='#4a6a8a';k.fillRect(px+2,py+44,10,12);k.strokeRect(px+2.5,py+44.5,9,11);k.fillStyle='#7ab8e8';k.fillRect(px+3,py+46,8,3)});
 // ของตั้งในร้าน: ถังใส่ดาบซ้าย · ลังขวา
 for(const y of [6,7]){IT.barrel(k,1*T+16,y*T+30,1);IT.sword(k,1*T+10,y*T+6,.75,-.2);IT.sword(k,1*T+20,y*T+5,.75,.15,'#cfe6ff');IT.spear(k,1*T+16,y*T+2,.6)}
 IT.crate(k,14*T+16,8*T+30);IT.crate(k,14*T+16,9*T+30);IT.crate(k,14*T+16,9*T+10);
 counter(k,th);
 // ของบนเคาน์เตอร์
 IT.sword(k,132,106,.7,1.45);IT.shield(k,176,92,.5,0,'#6aa0ee','#2a4f9f');IT.gem(k,210,102,1);IT.gem(k,222,104,.8,0,'#9be6ff');IT.gem(k,200,104,.7,0,'#6fd0ff');
 IT.pouch(k,308,106,1);IT.axe(k,352,100,.55,1.5);IT.helm(k,390,98,.6);IT.pouch(k,418,106,.8)}
// ตุ๊กตาเกราะ (ของตั้งสูง วาดเรียงตามความลึกกับผู้เล่น)
function drawMannequin(x,y){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y,12,4,0,0,7);ctx.fill();ctx.fillStyle='#5a3a1c';ctx.fillRect(x-1.5,y-26,3,26);ctx.fillRect(x-10,y-2,20,3);
 ctx.fillStyle='#aab4c6';ctx.strokeStyle=OUT;ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(x-11,y-44);ctx.lineTo(x+11,y-44);ctx.lineTo(x+8,y-24);ctx.lineTo(x-8,y-24);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#8b97ab';ctx.fillRect(x-14,y-46,7,9);ctx.fillRect(x+7,y-46,7,9);ctx.strokeRect(x-14,y-46,7,9);ctx.strokeRect(x+7,y-46,7,9);ctx.fillStyle='#c0392b';ctx.fillRect(x-2,y-44,4,18);IT.helm(ctx,x,y-52,.9)}

// ================= ร้านขายยา =================
function artPotion(k){const th={floor:'plank',f1:'#4b3552',f2:'#42304a',w1:'#54426f',w2:'#3a2d52',brick:0,wood:'#33220f',beam:'#24160c',ct:'#8a5a96',cf:'#4a2c58',rug:['#2a6a6a','#3a8a86','#e8d58a']};
 shell(k,th);
 // ดาวบนผนัง
 for(let i=0;i<22;i++){const x=20+hash(i,1)*470,y=10+hash(i,2)*30;k.fillStyle='rgba(255,236,160,'+(.25+hash(i,3)*.35)+')';k.fillRect(x|0,y|0,2,2)}
 // ชั้นวางขวดบนผนัง
 const cols=['#c04bff','#ff5c7a','#4fd6ff','#6ef08a','#ffd14a','#ff8a3a','#9a7bff'];
 for(const [x0,x1] of [[52,226],[286,462]]){for(const y of [26,50]){k.fillStyle='#2a1a0c';k.fillRect(x0,y,x1-x0,4);k.fillStyle='rgba(255,255,255,.12)';k.fillRect(x0,y,x1-x0,1);
   for(let x=x0+10,i=0;x<x1-8;x+=15+hash(x,y)*6,i++)IT.bottle(k,x,y,1,0,cols[(i*3+y)%7],(i+(y>30?1:0))%3)}}
 // สมุนไพรแขวน
 for(const [x,c] of [[120,'#4f8a3a'],[190,'#a06a3a'],[320,'#6aa04a'],[400,'#8a5aa0']])IT.herb(k,x,8,1.1,0,c);
 // ชั้นหนังสือซ้าย
 station(k,1,th,(k,px,py)=>{k.fillStyle=lg(k,0,py,0,py+2*T,'#4a2c14','#33200f');k.fillRect(px+2,py+2,2*T-4,2*T-6);k.strokeStyle=OUT;k.lineWidth=1.2;k.strokeRect(px+2.5,py+2.5,2*T-5,2*T-7);
  for(const row of [0,1]){const y=py+6+row*28;k.fillStyle='#24160c';k.fillRect(px+6,y,2*T-12,24);let x=px+7;for(let i=0;x<px+2*T-9;i++){const w=4+hash(i,row)*4;k.fillStyle=['#7a2a2a','#2a4f7a','#3a6a3a','#8a6a2a','#5a3a7a'][(i+row*2)%5];k.fillRect(x,y+(hash(i,row+4)*5|0)+2,w,22-(hash(i,row+4)*5|0));x+=w+.6}}});
 // หม้อเวทขวา
 station(k,13,th,(k,px,py)=>{k.fillStyle='#4a4650';k.beginPath();k.ellipse(px+32,py+54,28,9,0,0,7);k.fill();k.fillStyle='#2a2830';k.fillRect(px+10,py+34,6,22);k.fillRect(px+48,py+34,6,22);
  k.fillStyle=lg(k,px,0,px+64,0,'#2a2a32','#4a4a54');k.beginPath();k.ellipse(px+32,py+40,25,22,0,0,7);k.fill();k.strokeStyle=OUT;k.lineWidth=1.4;k.stroke();
  k.fillStyle='#16151a';k.beginPath();k.ellipse(px+32,py+27,26,8,0,0,7);k.fill();k.stroke();k.fillStyle='#4fe08a';k.beginPath();k.ellipse(px+32,py+27,22,6,0,0,7);k.fill()});
 // ตู้ข้างผนัง (ซ้าย-ขวา)
 for(const x of [1,14])for(const y of [5,6,7]){const px=x*T,py=y*T;k.fillStyle=lg(k,0,py,0,py+T,'#4a2c14','#33200f');k.fillRect(px+(x===1?0:2),py,T-2,T);k.strokeStyle=OUT;k.lineWidth=1;k.strokeRect(px+(x===1?.5:2.5),py+.5,T-3,T-1);
  k.fillStyle='#24160c';k.fillRect(px+(x===1?3:5),py+3,T-8,T-6);k.fillStyle='#4a2c14';k.fillRect(px+(x===1?3:5),py+T/2-1,T-8,2);IT.bottle(k,px+(x===1?10:12),py+T/2-1,.62,0,cols[(y+x)%7],y%3);IT.bottle(k,px+(x===1?21:23),py+T/2-1,.62,0,cols[(y+x+3)%7],(y+1)%3);IT.bottle(k,px+(x===1?10:12),py+T-4,.62,0,cols[(y+x+2)%7],(y+2)%3);IT.bottle(k,px+(x===1?21:23),py+T-4,.62,0,cols[(y+x+5)%7],y%3)}
 IT.plant(k,1*T+16,9*T+30,1.1);IT.plant(k,14*T+16,9*T+30,1.1);
 counter(k,th);
 IT.orb(k,140,108,1);IT.bottle(k,196,106,1,0,cols[0],0);IT.bottle(k,214,106,1,0,cols[1],1);IT.bottle(k,232,106,.9,0,cols[2],2);
 IT.book(k,300,104,1);IT.mortar(k,340,106,1);IT.bottle(k,372,106,1,0,cols[3],1);IT.bottle(k,392,106,.9,0,cols[4],0);IT.candle(k,420,106,1)}

// ================= โรงเตี๊ยม =================
function artInn(k){const th={floor:'plank',f1:'#9a6a3a',f2:'#8c5e32',w1:'#dccaa2',w2:'#bfa97f',brick:0,wood:'#5a3a1c',beam:'#3a2412',ct:'#7a4f26',cf:'#4f3015',rug:['#2a5a8a','#3a74a8','#e8d58a']};
 shell(k,th);
 // กระดานเมนู
 k.fillStyle='#2a3a2a';rr(k,224,8,64,30,3);k.fill();k.strokeStyle='#6a4524';k.lineWidth=3;rr(k,224,8,64,30,3);k.stroke();k.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<4;i++)k.fillRect(232,15+i*6,28+hash(i,2)*18,1.6);
 // ถังเบียร์ซ้าย · ชั้นแก้ว+ขวดขวา
 k.fillStyle='#3a2412';k.fillRect(70,14,130,4);IT.keg(k,86,32,.9);IT.keg(k,118,32,.9);IT.keg(k,150,32,.9);IT.keg(k,182,32,.9);
 k.fillStyle='#4a2c14';k.fillRect(306,26,150,4);k.fillRect(306,48,150,4);for(let i=0;i<7;i++)IT.mug(k,318+i*20,26,.95);for(let i=0;i<6;i++)IT.bottle(k,320+i*24,48,.95,0,['#3f8a4a','#7a3a1a','#c0392b'][i%3],1);
 // บันไดซ้าย
 station(k,1,th,(k,px,py)=>{k.fillStyle='#3a2412';k.fillRect(px+2,py+2,2*T-4,2*T-6);for(let i=0;i<6;i++){const y=py+2*T-8-i*9;k.fillStyle=i%2?'#8a5a2e':'#7a4a24';k.fillRect(px+4+i*3,y,2*T-8-i*3,8);k.fillStyle='rgba(0,0,0,.35)';k.fillRect(px+4+i*3,y+7,2*T-8-i*3,1)}
  k.fillStyle='#24160c';k.fillRect(px+4,py+6,5,2*T-14)});
 // เตาผิงขวา
 station(k,13,th,(k,px,py)=>{k.fillStyle='#7a766e';k.fillRect(px+2,0,2*T-4,py+2*T-4);k.strokeStyle='rgba(0,0,0,.25)';for(let y=4;y<py+2*T;y+=8){k.beginPath();k.moveTo(px+2,y);k.lineTo(px+2*T-2,y);k.stroke()}
  k.fillStyle='#4a2c14';k.fillRect(px-2,py+6,2*T+4,6);k.fillStyle='#16110e';rr(k,px+8,py+14,48,44,5);k.fill();k.strokeStyle=OUT;k.lineWidth=1.4;rr(k,px+8,py+14,48,44,5);k.stroke();k.fillStyle='#3a2412';k.fillRect(px+16,py+50,32,6);k.fillRect(px+14,py+46,36,4)});
 // โต๊ะกลม + เก้าอี้ (ซ้ายและขวา)
 for(const tx of [3,11]){const px=tx*T,py=7*T;IT.stool(k,px-T+16,py+30,1);IT.stool(k,px+3*T-16,py+30,1);
  k.fillStyle='rgba(0,0,0,.3)';k.beginPath();k.ellipse(px+T,py+27,34,9,0,0,7);k.fill();k.fillStyle='#4a2c14';k.fillRect(px+T-4,py+12,8,16);
  k.fillStyle=lg(k,px,py,px,py+20,'#a87a46','#7a4f26');k.beginPath();k.ellipse(px+T,py+11,34,12,0,0,7);k.fill();k.strokeStyle=OUT;k.lineWidth=1.2;k.stroke();k.fillStyle='rgba(255,255,255,.15)';k.beginPath();k.ellipse(px+T,py+9,28,7,0,0,7);k.fill();
  IT.mug(k,px+T-14,py+12,.9);IT.mug(k,px+T+14,py+13,.9);IT.plate(k,px+T,py+13,1);IT.candle(k,px+T-1,py+7,.8)}
 counter(k,th);
 // ของบนเคาน์เตอร์ : แก้ว ก๊อกเบียร์ ตะกร้าขนมปัง
 for(const x of [150,168,186])IT.mug(k,x,106,1);k.fillStyle='#7a766e';k.fillRect(236,86,40,12);k.strokeStyle=OUT;k.strokeRect(236.5,86.5,39,11);for(const x of [244,256,268]){k.fillStyle='#c9a13a';k.fillRect(x-2,98,4,8);k.fillStyle=['#c0392b','#e8c14a','#3f8a4a'][(x-244)/12];k.beginPath();k.arc(x,84,4,0,7);k.fill()}
 k.fillStyle='#a27440';k.beginPath();k.ellipse(332,100,18,7,0,0,7);k.fill();k.strokeStyle=OUT;k.stroke();for(const [x,y] of [[324,95],[334,93],[342,96]]){k.fillStyle='#d9a45a';k.beginPath();k.ellipse(x,y,6,3.6,0,0,7);k.fill()}
 IT.bottle(k,388,106,1,0,'#3f8a4a',1);IT.mug(k,410,106,1)}
const SHOP_ART={gear:artGear,potion:artPotion,inn:artInn};
const SHOP_TINT={gear:'rgba(255,190,110,.06)',potion:'rgba(190,130,255,.08)',inn:'rgba(255,170,80,.09)'};
// ---- แอนิเมชันในร้าน (แสงไฟ ฟองหม้อ ประกายเตา) วาดทับฉากพื้น ----
function glow(x,y,r,c,a){const g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba('+c+','+a+')');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
const SHOP_ANIM={
 gear(t){ctx.save();ctx.globalCompositeOperation='lighter';const f=.8+.2*Math.sin(t*9)+.08*Math.sin(t*23);glow(64,100,70*f,'255,130,40',.5);glow(120,34,40,'255,200,120',.2+.04*Math.sin(t*5));glow(392,34,40,'255,200,120',.2+.04*Math.sin(t*5+2));ctx.restore();
  for(let i=0;i<5;i++){const u=(t*.8+i*.2)%1;ctx.fillStyle='rgba(255,'+(160+i*20)+',60,'+(1-u)+')';ctx.fillRect(48+i*7+Math.sin(t*3+i)*4,96-u*40,2,2)}},
 potion(t){ctx.save();ctx.globalCompositeOperation='lighter';glow(448,92,60,'80,255,150',.3+.1*Math.sin(t*4));glow(140,96,28,'150,200,255',.3+.08*Math.sin(t*3));
  for(const [x,y,c] of [[110,30,'200,100,255'],[190,30,'255,100,140'],[320,52,'90,220,255'],[420,30,'110,240,140']])glow(x,y,22,c,.18+.08*Math.sin(t*2+x));ctx.restore();
  for(let i=0;i<6;i++){const u=(t*.55+i/6)%1;ctx.fillStyle='rgba(120,255,170,'+(.8*(1-u))+')';ctx.beginPath();ctx.arc(436+Math.sin(t*2+i*2)*10+i*3,88-u*38,2+u*3,0,7);ctx.fill()}
  for(let i=0;i<10;i++){const u=(t*.2+i/10)%1,x=40+hash(i,4)*430+Math.sin(t+i)*8,y=330-u*250;ctx.fillStyle='rgba(255,236,160,'+(Math.sin(u*Math.PI)*.6)+')';ctx.fillRect(x,y,2,2)}},
 inn(t){ctx.save();ctx.globalCompositeOperation='lighter';const f=.85+.15*Math.sin(t*8)+.06*Math.sin(t*21);glow(448,100,92*f,'255,130,40',.55);glow(120,40,50,'255,190,110',.12);glow(256,330,50,'255,230,160',.35);ctx.restore();
  for(let i=0;i<5;i++){const u=(t*1.3+i*.2)%1,fx=432+i*7,h=18*(1-u*.4)*(.8+.3*Math.sin(t*10+i*2));ctx.fillStyle=['#ff7a1a','#ffb23a','#ffe27a','#ffb23a','#ff7a1a'][i];ctx.beginPath();ctx.ellipse(fx,114-h/2+4,4.4-Math.abs(i-2)*.7,h/2+2,0,0,7);ctx.fill()}
  for(let i=0;i<3;i++){const u=(t*.6+i/3)%1;ctx.fillStyle='rgba(255,170,80,'+(.8*(1-u))+')';ctx.fillRect(436+Math.sin(t*4+i*3)*8,96-u*40,2,2)}}};
