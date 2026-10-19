// fix76 (v4.68) — เจ้าของสั่ง: (1) สัตว์ขี่ทุกมุมต้องเป็นตัวเดียวกัน: มังกร 2 ตัวมีท่าหันหน้า (ลง) / หันหลัง (ขึ้น) ของตัวเอง ไม่ยืมม้า · กิเลนมีเขาทุกมุม
//  (2) ตลาดเป็นธรรมชาติ: เอาซุ้มลอย (fix74) ออก → เปิด "ประตูใต้" ในกำแพงเมือง (ช่อง 32–33) มีทางหินจากถนนล่างเดินลงไป ป้ายตลาดนัด ธงทิว ลังของ
//      เดินชนประตู/กดโต้ตอบที่ประตู = เข้าตลาด · ออกจากตลาดกลับมายืนหน้าประตู
try{
// ---------- (1) มังกรมุมหน้า/หลัง ----------
function dragonUD76(k,x,y,dir,A,ph){const K=MPAL[k],t=performance.now()/1000,g=t*(A?9.5:0),sw=Math.sin(t*3);ctx.save();ctx.translate(x,y);ctx.lineJoin='round';
 const sc=(c,l)=>{ctx.strokeStyle=c;ctx.lineWidth=l};
 if(ph===0){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,1,22,6,0,0,7);ctx.fill();
  // ขา 4 ข้าง (อ้วน มีกรงเล็บ)
  [[-11,0,1],[11,Math.PI,1],[-6,Math.PI*.5,.85],[6,Math.PI*1.5,.85]].sort((a,b)=>a[2]-b[2]).forEach(([lx,p2,s])=>{const lift=A?Math.max(0,Math.sin(g*2+p2))*3:0;ctx.fillStyle=s<1?K.s:K.leg;ctx.fillRect(lx-3.4,-20*s-lift,6.8,20*s);ctx.fillStyle=K.hi;for(const c of [-2.2,0,2.2])ctx.fillRect(lx+c-.8,-2*s-lift,1.6,3)});
  if(dir==='d'){// หางโผล่ด้านหลัง (ไกลกล้อง) โค้งขึ้นข้างตัว
   sc(K.s,8);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(6,-30);ctx.bezierCurveTo(20,-36+sw*3,26,-52+sw*4,18,-62+sw*5);ctx.stroke();sc(K.b,5);ctx.stroke();ctx.fillStyle=K.m;ctx.beginPath();ctx.moveTo(18,-62+sw*5);ctx.lineTo(24,-70+sw*5);ctx.lineTo(14,-66+sw*5);ctx.fill()}
  if(dir==='u'){// คอ+หัวยื่นไปด้านหน้า (ไกลกล้อง = สูงขึ้นไปบนจอ)
   const hb=Math.sin(t*2)*1.5;ctx.fillStyle=K.b;ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-6,-38);ctx.quadraticCurveTo(-4,-56,-3,-64+hb);ctx.lineTo(3,-64+hb);ctx.quadraticCurveTo(4,-56,6,-38);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.ellipse(0,-68+hb,7,6,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle=K.hi;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*3,-72+hb);ctx.lineTo(s*9,-82+hb);ctx.lineTo(s*5,-71+hb);ctx.fill()}
   ctx.fillStyle=K.m;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-1.5,-44-i*5);ctx.lineTo(0,-49-i*5);ctx.lineTo(1.5,-44-i*5);ctx.fill()}}
  const bg=ctx.createRadialGradient(-5,-34,2,0,-27,18);bg.addColorStop(0,K.hi);bg.addColorStop(.6,K.b);bg.addColorStop(1,K.s);ctx.fillStyle=bg;ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,-28,16,15,0,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle=K.hi;ctx.globalAlpha=.5;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(-6+i*4,-22,1.8,1.3,0,0,7);ctx.fill()}ctx.globalAlpha=1;
  ctx.fillStyle=K.m;for(const s of [-1,1])for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(s*(9+i*2),-38+i*4);ctx.lineTo(s*(14+i*2),-41+i*4);ctx.lineTo(s*(11+i*2),-35+i*4);ctx.fill()}
  ctx.fillStyle='#3a1e0c';ctx.beginPath();ctx.ellipse(0,-39,13,4.5,0,0,7);ctx.fill();ctx.fillStyle=K.m;ctx.fillRect(-13,-39.5,26,1.6)}
 else{if(dir==='d'){// หัวมังกรหันหากล้อง อยู่หน้าผู้ขี่
   const nod=A?Math.sin(g*2)*1.2:0;ctx.translate(0,nod);ctx.fillStyle=K.b;ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.1;
   ctx.beginPath();ctx.moveTo(-7,-46);ctx.quadraticCurveTo(-10,-34,-6,-24);ctx.quadraticCurveTo(0,-18,6,-24);ctx.quadraticCurveTo(10,-34,7,-46);ctx.quadraticCurveTo(0,-51,-7,-46);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.fillStyle=K.s;ctx.beginPath();ctx.ellipse(0,-23,6,3.6,0,0,7);ctx.fill();ctx.fillStyle='#120a06';for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*2.2,-23,1,0,7);ctx.fill()}
   ctx.globalCompositeOperation='lighter';for(const s of [-1,1]){const gg=ctx.createRadialGradient(s*4.4,-38,0,s*4.4,-38,4);gg.addColorStop(0,'rgba(255,255,220,1)');gg.addColorStop(1,'rgba('+(NM75[k]?NM75[k].aur:'255,200,80')+',0)');ctx.fillStyle=gg;ctx.fillRect(s*4.4-4,-42,8,8)}ctx.globalCompositeOperation='source-over';
   ctx.fillStyle=K.hi;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*4,-48);ctx.lineTo(s*12,-62);ctx.lineTo(s*7,-47);ctx.closePath();ctx.fill();ctx.stroke()}
   sc(K.m,1.3);for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*5,-24);ctx.quadraticCurveTo(s*14,-20+sw*2,s*16,-12+sw*3);ctx.stroke()}
   ctx.fillStyle=K.m;ctx.beginPath();ctx.moveTo(-3,-49);ctx.lineTo(0,-55);ctx.lineTo(3,-49);ctx.fill()}
  else if(dir==='u'){// หางเข้าหากล้อง (ล่างจอ)
   sc(K.s,9);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-18);ctx.bezierCurveTo(4,-8,-10+sw*4,-2,-16+sw*6,6);ctx.stroke();sc(K.b,6);ctx.stroke();ctx.fillStyle=K.m;ctx.beginPath();ctx.moveTo(-16+sw*6,6);ctx.lineTo(-24+sw*6,4);ctx.lineTo(-18+sw*6,12);ctx.fill()}}
 ctx.restore()}
window.dragonUD76=dragonUD76;
{const _du=drawSteedUD7;drawSteedUD7=function(k,x,y,dir,A,ph){const M=window.NM75&&NM75[k];
  if(M&&M.dragon){if(ph===0)try{aura75(k,x,y,false)}catch(e){}try{dragonUD76(k,x,y,dir,A,ph)}catch(e){}if(ph!==0)try{aura75(k,x,y,true)}catch(e){}return}
  const r=_du.apply(this,arguments);
  if(k==='kirin'&&ph!==0&&dir==='d')try{ctx.save();ctx.translate(x,y);ctx.fillStyle='#ffd23a';ctx.strokeStyle='#8a5a10';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-1.6,-53);ctx.lineTo(0,-66);ctx.lineTo(1.6,-53);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}catch(e){}
  if(k==='kirin'&&ph===0&&dir==='u')try{ctx.save();ctx.translate(x,y);ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(-1.4,-58);ctx.lineTo(0,-68);ctx.lineTo(1.4,-58);ctx.closePath();ctx.fill();ctx.restore()}catch(e){}
  return r};window.drawSteedUD7=drawSteedUD7}
// ---------- (2) ตลาด: ประตูใต้ของเมือง ----------
try{MKG74.x=-1e7;MKG74.y=-1e7}catch(e){}
const SG76={x0:32,x1:33,y:33};window.SG76=SG76;
function paintSouthGate76(){if(!(D&&D.town)||typeof dcv==='undefined')return;const k=dcv.getContext('2d'),X=SG76.x0*T,W=(SG76.x1-SG76.x0+1)*T,Y=SG76.y*T;
 for(let y=30;y<=32;y++)for(let x=SG76.x0;x<=SG76.x1;x++){TOWNFLOOR.state==='ready'?(k.fillStyle=k.createPattern(TOWNFLOOR.tile('stone'),'repeat'),k.fillRect(x*T,y*T,T,T)):k.drawImage(ART.cobble,(x%4)*64,(y%4)*64,64,64,x*T,y*T,T,T)}
 k.fillStyle='rgba(40,32,22,.45)';k.fillRect(X-3,30*T,3,3*T);k.fillRect(X+W,30*T,3,3*T);
 // ช่องประตูในกำแพง
 const og=k.createLinearGradient(0,Y,0,Y+T);og.addColorStop(0,'#2a1a10');og.addColorStop(1,'#0e0806');k.fillStyle=og;k.fillRect(X,Y,W,T);
 k.fillStyle='#e8c070';k.globalAlpha=.25;k.fillRect(X+4,Y+T-6,W-8,6);k.globalAlpha=1;
 for(const s of [0,1]){const px=s?X+W:X-10;k.fillStyle='#8a7a6a';k.fillRect(px,Y-26,10,T+26);k.fillStyle='#5a4a3e';k.fillRect(px,Y-26,10,4);k.fillStyle='#6a5a4a';k.fillRect(px+2,Y-8,6,3)}
 k.fillStyle='#7a6a5a';k.beginPath();k.moveTo(X-10,Y-22);k.quadraticCurveTo(X+W/2,Y-46,X+W+10,Y-22);k.lineTo(X+W+10,Y-14);k.quadraticCurveTo(X+W/2,Y-36,X-10,Y-14);k.closePath();k.fill();
 k.fillStyle='#f4e0b0';k.strokeStyle='#5a3a1a';k.lineWidth=2;k.fillRect(X-6,Y-52,W+12,16);k.strokeRect(X-6,Y-52,W+12,16);k.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillStyle='#5a2a10';k.fillText('🏪 ตลาดนัด ↓',X+W/2,Y-40);k.textAlign='left';
 // ลังของ + ตะกร้าข้างทาง
 const crate=(cx,cy)=>{k.fillStyle='#8a5a2a';k.fillRect(cx,cy,14,12);k.strokeStyle='#4a2a10';k.lineWidth=1;k.strokeRect(cx,cy,14,12);k.beginPath();k.moveTo(cx,cy);k.lineTo(cx+14,cy+12);k.stroke()};
 crate(X-28,31.9*T);crate(X-24,31.5*T);k.fillStyle='#c84a3a';k.beginPath();k.arc(X-22,31.48*T,3,0,7);k.arc(X-18,31.5*T,3,0,7);k.fill();
 crate(X+W+12,31.9*T);k.fillStyle='#e0b040';k.beginPath();k.ellipse(X+W+26,32.3*T,7,4,0,0,7);k.fill();k.fillStyle='#7ac83a';k.beginPath();k.arc(X+W+24,32.1*T,2.4,0,7);k.arc(X+W+28,32.1*T,2.4,0,7);k.fill();
 for(let y=30;y<=32;y++)for(let x=SG76.x0;x<=SG76.x1;x++)if(dm[y])dm[y][x]=0}
{const _bt=buildTown;buildTown=function(){const r=_bt.apply(this,arguments);try{paintSouthGate76()}catch(e){console.warn('sg76',e)}return r};window.buildTown=buildTown}
try{if(D&&D.town&&!D.shop){paintSouthGate76();try{mkMini(dcv,TW,TH,2.6)}catch(e){}}}catch(e){}
// ธงทิวเหนือประตู (ขยับตามลม)
{const _h=hero;hero=function(){let ok=false;try{ok=!!(D&&D.town&&!D.shop&&!window.__IN_OTHER8&&ctx.canvas.isConnected&&Math.abs(P.y-SG76.y*T)<700)}catch(e){}
  if(ok)try{const X=SG76.x0*T,W=(SG76.x1-SG76.x0+1)*T,Y=SG76.y*T,t=performance.now()/1000;ctx.save();for(let i=0;i<7;i++){const px=X-18+i*((W+36)/6),py=Y-30+Math.sin(i*.9)*2+Math.sin(t*2+i)*1.5;ctx.fillStyle=['#e04a3a','#f4c040','#4aa0e0','#5ac86a'][i%4];ctx.beginPath();ctx.moveTo(px-4,py);ctx.lineTo(px+4,py);ctx.lineTo(px,py+8+Math.sin(t*3+i));ctx.closePath();ctx.fill()}ctx.restore()}catch(e){}
  return _h.apply(this,arguments)};window.hero=hero}
const inGate76=()=>D&&D.town&&!D.shop&&P.x>=SG76.x0*T-4&&P.x<=(SG76.x1+1)*T+4&&P.y>=32.35*T;
{const _it=interact;interact=function(){try{if(D&&D.town&&!D.shop&&P.x>=SG76.x0*T-10&&P.x<=(SG76.x1+1)*T+10&&P.y>=31.3*T&&!(D.npcs||[]).some(n=>n.vis!==false&&Math.hypot(n.x-P.x,n.y-P.y)<56)){window.__mk76=1;enterMk10();return true}}catch(e){}return _it.apply(this,arguments)};window.interact=interact}
let gT76=0;setInterval(()=>{try{if(PAUSED||P.dead)return;if(inGate76()&&P.dir==='d'&&P.mv){if(++gT76>=2){gT76=0;window.__mk76=1;enterMk10()}}else gT76=0}catch(e){}},200);
setInterval(()=>{try{if(window.__mk76&&D&&D.town&&!D.shop&&!(typeof inMk10==='function'&&inMk10())){window.__mk76=0;P.x=(SG76.x0+1)*T;P.y=31*T;P.dir='u'}}catch(e){}},150);
}catch(e){console.warn('fix76',e)}
