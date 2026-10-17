// ---- รถม้า / เกวียนวัว: วาดมุมข้าง ม้าก้าวขาแบบเดินจริง ล้อหมุนตามระยะทาง ----
// ข้อมูลรถ (ตำแหน่ง ความเร็ว สีขน สิ่งของที่บรรทุก) อยู่ที่ data/town.js
const COAT={
 bay:{hi:'#a8683a',b:'#8a4f2a',s:'#5a3018',m:'#1a110c',leg:'#2a1a12'},
 chestnut:{hi:'#c9783a',b:'#a65a2a',s:'#6e3a1c',m:'#4a2a12',leg:'#8a4a22'},
 grey:{hi:'#dde0e6',b:'#b3b9c3',s:'#7c828e',m:'#656a75',leg:'#8f95a0'},
 black:{hi:'#4a4852',b:'#2c2a32',s:'#14131a',m:'#0c0b10',leg:'#0c0b10'},
 ox:{hi:'#b3a288',b:'#8f7e68',s:'#5c5040',m:'#3a2e22',leg:'#5c5040'}};
const mkCart=c=>({...c,y:c.lane*T,hw:74,ph:Math.random()*6,amp:1,moving:true,ht:0});

// กันตัวละครติดรถ/NPC/กำแพง: ถ้าจุดที่ยืนอยู่ชนอะไร ให้ขยับออกไปจุดว่างที่ใกล้สุด
function unstick(){if(!dhit(P.x,P.y))return;
 for(let r=10;r<=160;r+=8)for(let a=0;a<12;a++){const nx=P.x+Math.cos(a*.5236)*r,ny=P.y+Math.sin(a*.5236)*r;if(!dhit(nx,ny)){P.x=nx;P.y=ny;P.kx=P.ky=0;return}}}
function updCarts(dt){if(!DOORA.k)unstick();
 for(const c of D.carts){let go=true;const ahead=(x,y,w)=>{const dx=(x-c.x)*c.dir;return dx>-24&&dx<c.hw+w&&Math.abs(y-c.y)<24};
  for(const o of D.carts)if(o!==c&&Math.abs(o.y-c.y)<8&&(o.x-c.x)*c.dir>0&&(o.x-c.x)*c.dir<c.hw*2+16)go=false;
  c.moving=go;c.amp+=((go?1:0)-c.amp)*Math.min(1,dt*6);
  if(go){c.x+=c.dir*c.v*dt;c.ph+=c.v*dt/12.6;c.ht-=dt;const dp=Math.hypot(P.x-c.x,P.y-c.y);if(c.ht<=0&&dp<320){c.ht=Math.max(.22,16.5/c.v);sfx('hoof')}}
  if(c.x>TW*T+130)c.x=-130;if(c.x<-130)c.x=TW*T+130}}

// ขา: สะโพก→เข่า/ข้อเท้า→กีบ  ph=เฟสก้าว A=แอมพลิจูด(0=ยืน) hind=ขาหลัง far=ขาอีกฝั่ง(สีเข้ม)
function beastLeg(hx,hy,ph,A,hind,K,far,ox){
 const L1=ox?11:13,L2=ox?12:15,s=Math.sin(ph),lift=Math.max(0,Math.cos(ph))*A,
  a1=A*.38*s+(hind?-.1:0),kx=hx+L1*Math.sin(a1),ky=hy+L1*Math.cos(a1),
  a2=a1*.4+(hind?.2:0)-lift*(hind?.7:.95),fx=kx+L2*Math.sin(a2),fy=ky+L2*Math.cos(a2);
 ctx.lineCap='round';ctx.strokeStyle=far?K.s:K.b;ctx.lineWidth=hind?6:5;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(kx,ky);ctx.stroke();
 ctx.strokeStyle=far?K.s:K.leg;ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(fx,fy);ctx.stroke();
 ctx.fillStyle='#1a1210';ctx.beginPath();ctx.ellipse(fx+1,fy,3.4,2.2,0,0,7);ctx.fill()}
function bodyFill(K,y0,y1){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,K.hi);g.addColorStop(.45,K.b);g.addColorStop(1,K.s);ctx.fillStyle=g;ctx.strokeStyle='rgba(20,10,5,.55)';ctx.lineWidth=1;ctx.fill();ctx.stroke()}

function drawHorse(c,t,K,A,g){
 beastLeg(27,-30,g+Math.PI,A,1,K,1);beastLeg(52,-30,g+4.712,A,0,K,1);
 ctx.save();ctx.translate(0,-Math.abs(Math.sin(g*2))*1.2*A);
 // หาง
 const sw=Math.sin(t*2.2+c.x*.05)*.3+Math.sin(g)*.15*A;ctx.strokeStyle=K.m;ctx.lineCap='round';
 for(let i=0;i<4;i++){ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(13,-40);ctx.bezierCurveTo(6-i,-38,3+sw*12-i*1.5,-26,2+sw*16-i*2,-12+i*1.5);ctx.stroke()}
 // ลำตัว+คอ
 ctx.beginPath();ctx.moveTo(12,-36);ctx.bezierCurveTo(11,-45,21,-46,29,-44);ctx.bezierCurveTo(37,-43,42,-46,47,-48);ctx.bezierCurveTo(51,-54,54,-61,58,-68);ctx.lineTo(62,-62);ctx.bezierCurveTo(61,-55,59,-47,58,-40);ctx.bezierCurveTo(58,-32,52,-26,43,-25);ctx.bezierCurveTo(33,-23.5,23,-25,17,-28);ctx.bezierCurveTo(12,-30,11,-33,12,-36);ctx.closePath();bodyFill(K,-68,-24);
 ctx.fillStyle='rgba(0,0,0,.11)';ctx.beginPath();ctx.ellipse(21,-33,8,9,.2,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(47,-36,6,9,-.2,0,7);ctx.fill();
 // ผ้ารองอานและสายรัด
 ctx.fillStyle='#7a2a2a';ctx.fillRect(28,-47,13,5);ctx.fillStyle='#e8c14a';ctx.fillRect(28,-43,13,1);
 ctx.strokeStyle='#3a2410';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(34,-44);ctx.lineTo(35,-25);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(52,-38);ctx.quadraticCurveTo(46,-28,38,-27);ctx.stroke();
 // แผงคอ
 ctx.strokeStyle=K.m;ctx.lineWidth=3.2;for(let i=0;i<8;i++){const u=i/7,px=47+u*11,py=-48-u*20,w=Math.sin(t*3+i*.7)*1.5;ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px-3,py+1,px-6+w,py+9);ctx.stroke()}
 // หัว
 ctx.save();ctx.translate(58,-66);ctx.rotate(Math.sin(g)*.04*A+Math.sin(t*1.3+c.x)*.015);ctx.translate(-58,66);
 ctx.beginPath();ctx.moveTo(56,-69);ctx.bezierCurveTo(62,-72,68,-66,74,-56);ctx.bezierCurveTo(77,-52,76,-48,72,-48);ctx.bezierCurveTo(68,-49,65,-53,61,-58);ctx.closePath();bodyFill(K,-72,-48);
 ctx.fillStyle=K.b;ctx.beginPath();ctx.moveTo(57,-70);ctx.lineTo(59,-78);ctx.lineTo(62,-70);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=K.s;ctx.beginPath();ctx.moveTo(58.5,-71);ctx.lineTo(59.3,-75.5);ctx.lineTo(60.8,-71);ctx.fill();
 ctx.fillStyle='#120a08';ctx.beginPath();ctx.ellipse(65,-62,1.7,1.4,0,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(64.4,-62.8,.9,.9);ctx.beginPath();ctx.ellipse(74.2,-51.5,1,1.5,.5,0,7);ctx.fillStyle='#120a08';ctx.fill();
 ctx.strokeStyle='#3a2410';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(57,-68);ctx.lineTo(64,-58);ctx.lineTo(72,-52);ctx.stroke();ctx.fillStyle='#c9ccd6';ctx.fillRect(71,-51,2,2);
 ctx.strokeStyle=K.m;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(60,-70);ctx.quadraticCurveTo(64,-68,65,-63);ctx.stroke();ctx.restore();
 // ปลอกคอ
 ctx.save();ctx.translate(54,-43);ctx.rotate(.25);ctx.fillStyle='#4a2c16';ctx.strokeStyle='#1a0e06';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,5,9,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#e8c14a';for(const yy of [-5,0,5]){ctx.beginPath();ctx.arc(1,yy,1,0,7);ctx.fill()}ctx.restore();
 ctx.restore();
 beastLeg(20,-30,g,A,1,K,0);beastLeg(48,-30,g+Math.PI/2,A,0,K,0)}

function drawOx(c,t,K,A,g){const O=true;
 beastLeg(24,-24,g+Math.PI,A,1,K,1,O);beastLeg(53,-24,g+4.712,A,0,K,1,O);
 ctx.save();ctx.translate(0,-Math.abs(Math.sin(g*2))*.8*A);
 const sw=Math.sin(t*1.6+c.x*.05)*.3+Math.sin(g)*.1*A;ctx.strokeStyle=K.m;ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(10,-38);ctx.bezierCurveTo(4,-34,2+sw*10,-24,3+sw*14,-12);ctx.stroke();ctx.fillStyle=K.m;ctx.beginPath();ctx.ellipse(3+sw*14,-10,3,5,0,0,7);ctx.fill();
 ctx.beginPath();ctx.moveTo(10,-30);ctx.bezierCurveTo(9,-41,20,-43,30,-42);ctx.bezierCurveTo(38,-41,41,-46,47,-47);ctx.bezierCurveTo(53,-47,57,-42,61,-38);ctx.bezierCurveTo(62,-33,61,-27,55,-23);ctx.bezierCurveTo(45,-20,28,-20,18,-22);ctx.bezierCurveTo(11,-23,9,-26,10,-30);ctx.closePath();bodyFill(K,-47,-20);
 ctx.fillStyle='rgba(0,0,0,.12)';ctx.beginPath();ctx.ellipse(20,-31,9,9,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.1)';ctx.beginPath();ctx.ellipse(46,-42,6,3,0,0,7);ctx.fill();
 ctx.save();ctx.translate(58,-40);ctx.rotate(Math.sin(g)*.05*A);ctx.translate(-58,40);
 ctx.beginPath();ctx.moveTo(58,-42);ctx.bezierCurveTo(64,-44,71,-40,76,-31);ctx.bezierCurveTo(78,-27,75,-24,71,-25);ctx.bezierCurveTo(66,-28,61,-33,58,-37);ctx.closePath();bodyFill(K,-44,-24);
 ctx.strokeStyle='#e8e0c8';ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(61,-43);ctx.quadraticCurveTo(62,-51,69,-49);ctx.stroke();
 ctx.fillStyle=K.s;ctx.beginPath();ctx.ellipse(57,-40,4,2,.4,0,7);ctx.fill();ctx.fillStyle='#120a08';ctx.beginPath();ctx.ellipse(66,-37,1.5,1.3,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(74,-28,1,1.5,.4,0,7);ctx.fill();
 ctx.strokeStyle='#d9c8a0';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(75.5,-27,2.4,.4,2.6);ctx.stroke();ctx.restore();
 // แอกวัว
 ctx.strokeStyle='#5a3a1e';ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(50,-48);ctx.lineTo(60,-38);ctx.stroke();ctx.strokeStyle='#d9c8a0';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(54,-47);ctx.lineTo(58,-41);ctx.stroke();
 ctx.restore();
 beastLeg(18,-24,g,A,1,K,0,O);beastLeg(48,-24,g+Math.PI/2,A,0,K,0,O)}

function barrel(bx,by){ctx.fillStyle='#8a5a2e';ctx.beginPath();ctx.moveTo(bx-6,by);ctx.quadraticCurveTo(bx-9,by-8,bx-6,by-16);ctx.lineTo(bx+6,by-16);ctx.quadraticCurveTo(bx+9,by-8,bx+6,by);ctx.closePath();ctx.fill();ctx.strokeStyle='#2a1808';ctx.lineWidth=1;ctx.stroke();
 ctx.fillStyle='#4a4d55';ctx.fillRect(bx-8,by-12,16,1.6);ctx.fillRect(bx-8,by-4,16,1.6);ctx.strokeStyle='rgba(40,20,8,.45)';for(const o of [-3,0,3]){ctx.beginPath();ctx.moveTo(bx+o,by-15);ctx.lineTo(bx+o,by-1);ctx.stroke()}
 ctx.fillStyle='#c9a06a';ctx.beginPath();ctx.ellipse(bx,by-16,6,1.8,0,0,7);ctx.fill();ctx.stroke()}
function drawWagon(c,load){
 ctx.fillStyle='#3a2410';ctx.fillRect(-72,-23,58,4);
 const wb=ctx.createLinearGradient(0,-36,0,-22);wb.addColorStop(0,'#b07c44');wb.addColorStop(1,'#744a24');ctx.fillStyle=wb;ctx.fillRect(-74,-36,62,14);
 ctx.strokeStyle='rgba(30,16,6,.55)';ctx.lineWidth=1;for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(-74,-36+i*4.7);ctx.lineTo(-12,-36+i*4.7);ctx.stroke()}
 ctx.fillStyle='#3a3d44';for(const bx of [-72,-50,-30,-14])ctx.fillRect(bx,-36,2.4,14);
 ctx.fillStyle='#8a5a2e';ctx.fillRect(-75,-38,64,3);ctx.strokeStyle='#2a1808';ctx.strokeRect(-74.5,-36.5,62,14);
 if(load==='cover'){
  ctx.beginPath();ctx.moveTo(-72,-38);ctx.bezierCurveTo(-72,-70,-58,-78,-48,-78);ctx.bezierCurveTo(-38,-78,-28,-68,-26,-38);ctx.closePath();
  const cg=ctx.createLinearGradient(0,-78,0,-38);cg.addColorStop(0,'#f4efe0');cg.addColorStop(1,'#cfc6aa');ctx.fillStyle=cg;ctx.fill();ctx.strokeStyle='#8a8068';ctx.lineWidth=1.2;ctx.stroke();
  ctx.strokeStyle='rgba(90,76,50,.4)';ctx.lineWidth=1;for(let i=0;i<5;i++){const x=-66+i*9,yt=Math.max(-72,-78+Math.pow((x+49)/24,2)*38);ctx.beginPath();ctx.moveTo(x,-38);ctx.quadraticCurveTo(x-1.5,(yt-38)/2-19,x,yt+3);ctx.stroke()}
  ctx.fillStyle='rgba(120,100,60,.25)';ctx.fillRect(-71,-44,44,6);ctx.strokeStyle='#6a5a38';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-72,-42);ctx.lineTo(-26,-42);ctx.stroke()}
 else if(load==='hay'){
  ctx.beginPath();ctx.moveTo(-72,-38);ctx.bezierCurveTo(-74,-58,-60,-68,-46,-66);ctx.bezierCurveTo(-34,-64,-24,-54,-24,-38);ctx.closePath();
  const hg=ctx.createLinearGradient(0,-68,0,-38);hg.addColorStop(0,'#e6c968');hg.addColorStop(1,'#b38a30');ctx.fillStyle=hg;ctx.fill();ctx.strokeStyle='#8a6a22';ctx.lineWidth=1;ctx.stroke();
  ctx.save();ctx.clip();ctx.strokeStyle='rgba(120,84,20,.55)';for(let i=0;i<46;i++){const x=-72+hash(i,1)*50,y=-66+hash(i,2)*28,a=hash(i,3)*3.1-1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*6,y+Math.sin(a)*4);ctx.stroke()}ctx.strokeStyle='#6a4a1a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-48,-67);ctx.lineTo(-48,-38);ctx.moveTo(-32,-60);ctx.lineTo(-32,-38);ctx.stroke();ctx.restore()}
 else{barrel(-64,-38);barrel(-49,-38);barrel(-34,-38);barrel(-56.5,-54);ctx.strokeStyle='#c9b27a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-72,-50);ctx.lineTo(-24,-46);ctx.stroke()}
 // ล้อ: ขอบเหล็ก + ซี่ล้อ 8 ซี่ หมุนตามระยะทาง
 for(const wx of [-58,-26]){ctx.save();ctx.translate(wx,-12.6);ctx.rotate(c.ph);
  ctx.strokeStyle='#1c1208';ctx.lineWidth=3.2;ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();
  ctx.strokeStyle='#8a5a2e';ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(0,0,8.9,0,7);ctx.stroke();
  ctx.strokeStyle='#6a4220';ctx.lineWidth=1.6;for(let i=0;i<8;i++){const a=i*.7854;ctx.beginPath();ctx.moveTo(Math.cos(a)*3,Math.sin(a)*3);ctx.lineTo(Math.cos(a)*8.9,Math.sin(a)*8.9);ctx.stroke()}
  ctx.fillStyle='#3a2410';ctx.beginPath();ctx.arc(0,0,3.4,0,7);ctx.fill();ctx.fillStyle='#b8bcc6';ctx.beginPath();ctx.arc(0,0,1.2,0,7);ctx.fill();ctx.restore()}}
function drawDriver(c,ox,t){const by=c.moving?Math.sin(c.ph*2.2)*.8:0,col=ox?'#6a8a5a':'#3a5a9a';
 ctx.save();ctx.translate(0,by);
 ctx.fillStyle='#6a4220';ctx.fillRect(-27,-41,17,3);ctx.fillRect(-27,-52,2,11);
 ctx.fillStyle='#4a3a2a';ctx.fillRect(-20,-45,12,5);ctx.fillRect(-9,-45,5,14);ctx.fillStyle='#2a1a10';ctx.fillRect(-10,-34,7,4);
 ctx.fillStyle=col;ctx.fillRect(-22,-59,9,15);
 ctx.strokeStyle=col;ctx.lineWidth=3.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-15,-55);ctx.lineTo(-6,-48);ctx.stroke();ctx.fillStyle='#f1d2b0';ctx.fillRect(-8,-50,3,3);
 ctx.fillRect(-21,-68,8,8);ctx.fillStyle='#111';ctx.fillRect(-14,-65,1.4,2);ctx.fillStyle='#5a3a1e';ctx.fillRect(-24,-69,14,2);ctx.fillRect(-22,-74,10,6);ctx.restore()}

function drawCart(c,t){const ox=c.kind==='ox',K=COAT[c.coat||(ox?'ox':'bay')],A=c.amp,g=c.ph*1.24,load=c.load||(ox?'hay':'cover');
 ctx.save();ctx.translate(Math.round(c.x),c.y);ctx.scale(c.dir,1);
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,1,76,6,0,0,7);ctx.fill();
 ctx.save();ctx.translate(ox?-6:-2,0);if(!ox)ctx.scale(.92,.92);ox?drawOx(c,t,K,A,g):drawHorse(c,t,K,A,g);ctx.restore();
 // คานลาก/ไม้ลากจากเกวียนถึงปลอกคอหรือแอก
 const ex=ox?51:46,ey=ox?-40:-38;ctx.lineCap='round';ctx.strokeStyle='#4a2e18';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-12,-27);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle='#8a5a30';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-28);ctx.lineTo(ex,ey-1);ctx.stroke();
 drawWagon(c,load);drawDriver(c,ox,t);
 if(load==='cover'){ctx.strokeStyle='#2a1808';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-27,-60);ctx.lineTo(-27,-56);ctx.stroke();const gl=ctx.createRadialGradient(-27,-53,1,-27,-53,13);gl.addColorStop(0,'rgba(255,200,90,.5)');gl.addColorStop(1,'rgba(255,200,90,0)');ctx.fillStyle=gl;ctx.fillRect(-40,-66,26,26);ctx.fillStyle='#ffcf5a';ctx.fillRect(-29.5,-56,5,6);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(-29.5,-56,5,6)}
 // สายบังคับ (ม้า) / ไม้แหย่ (วัว)
 ctx.strokeStyle='#2a1808';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-6,-47);if(ox){ctx.lineTo(26,-58)}else{ctx.quadraticCurveTo(28,-36+Math.sin(c.ph*2)*1.5*A,63,-48)}ctx.stroke();
 ctx.restore()}
