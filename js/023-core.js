function dhit(x,y){for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);if(!dm[ty]||(dm[ty][tx]!==FL&&dm[ty][tx]!==GATE))return true}// ในเมือง: รถม้าไม่ขวางใคร · ถ้ายืนอยู่บนถนน เดินทะลุ NPC ได้ (ไม่ติดกัน) · นอกถนน NPC ยังเป็นสิ่งกีดขวางเบา ๆ
 if(D.town&&!onRoad(x,y))for(const n of D.npcs)if(!onRoad(n.x,n.y)&&Math.abs(x-n.x)<14&&Math.abs(y-n.y)<10)return true;return false}
function flushDrops(){for(const d of drops)inv[DROPMAP[d.type]||d.type]++;drops.length=0;refreshInv()}
function buildD(){
 dm=[];for(let y=0;y<DH;y++){dm[y]=[];for(let x=0;x<DW;x++)dm[y][x]=(x===0||y===0||x===DW-1||y===DH-1)?WL:FL}
 for(const [x,y] of [[5,5],[15,5],[5,9],[15,9],[10,7]])dm[y][x]=WL;
 dm[DH-1][10]=EXIT;dm[2][10]=CHEST;
 dcv=document.createElement('canvas');dcv.width=DW*T;dcv.height=DH*T;const k=dcv.getContext('2d');
 for(let y=0;y<DH;y++)for(let x=0;x<DW;x++){const px=x*T,py=y*T,t=dm[y][x];
  if(t===WL||t===EXIT){k.fillStyle='#363342';k.fillRect(px,py,T,T);k.fillStyle='#2a2833';k.fillRect(px,py+15,T,2);k.fillRect(px+(y%2?8:20),py,2,15);k.fillRect(px+(y%2?20:8),py+17,2,15);
   if(dm[y+1]&&dm[y+1][x]===FL){k.fillStyle='#4a475a';k.fillRect(px,py+T-5,T,5)}
   if(t===EXIT){const gg=k.createRadialGradient(px+16,py+18,2,px+16,py+18,26);gg.addColorStop(0,'#fff6c8');gg.addColorStop(1,'#5f8f55');k.fillStyle=gg;k.fillRect(px,py,T,T)}}
  else{k.fillStyle=(x+y)%2?'#4a4757':'#454252';k.fillRect(px,py,T,T);
   if(hash(x,y)>.8){k.strokeStyle='#37343f';k.beginPath();k.moveTo(px+6,py+8);k.lineTo(px+14,py+15);k.lineTo(px+11,py+24);k.stroke()}}}
dsav=slimes.splice(0);let n=0;for(const [tx,ty] of DUNGEON_SLIMES){slimes.push({x:tx*T+16,y:ty*T+16,hp:3,t:n*.13,dx:0,dy:0,kx:0,ky:0,hurt:0,last:-1,cool:0});n++}
 D={open:false,total:n,ret:[(W-4.5)*T,5.5*T]}}
function enterD(){fade('#000');sfx('cave');setScene('cave');flushDrops();buildD();mkMini(dcv,DW,DH,5);P.x=10.5*T;P.y=12.5*T;P.dir='u';P.kx=P.ky=0;say('เข้าดันเจี้ยน! กำจัดสไลม์ '+D.total+' ตัวเพื่อปลดผนึกหีบ')}
function exitD(){fade(D&&D.town?'#fff':'#000');sfx(D&&D.town?'warp':'cave');setScene('field');setMini(MINIW);shopEl.hidden=true;flushDrops();slimes.length=0;slimes.push(...dsav);const R=D.ret;D=null;dm=null;P.x=R[0];P.y=R[1];P.dir='d';P.kx=P.ky=0;say('ออกจากดันเจี้ยนแล้ว')}
function openChest(){sfx('chest');D.open=true;const cx=10*T+16,cy=3*T+4;
 for(let i=0;i<6;i++)addDrop('gem',cx,cy);for(let i=0;i<18;i++)addDrop('coin',cx,cy);for(let i=0;i<3;i++)addDrop('wood',cx,cy);
 for(let i=0;i<20;i++)fx.push({x:cx,y:cy-10,vx:(Math.random()-.5)*160,vy:-40-Math.random()*100,l:.9,c:'255,216,74'});
 say('เปิดหีบสมบัติ! ได้เพชร +6 เหรียญ +18 ไม้ +3')}
function interact(){const [x,y]=target();
 if(!D){if(y===CV.ty&&Math.abs(x-CV.tx)<=1&&map[y][x]===DOOR){enterD();return true}return false}
 if(D.town)return townAct();if(D.shop)return shopAct();const t=dm[y]&&dm[y][x];
 if(t===EXIT){exitD();return true}
 if(t===CHEST){if(D.open)say('หีบว่างแล้ว');else if(slimes.length)say('หีบถูกผนึกอยู่ — เหลือสไลม์อีก '+slimes.length+' ตัว');else openChest();return true}
 return false}
function drawD(){if(D.town)return drawTown();if(D.shop)return drawShop();const t=performance.now()/1000,[cx,cy]=cam(DW*T,DH*T,.5);
 view(cx,cy);ctx.fillStyle='#111';ctx.fillRect(cx,cy,VW/Z,VH/Z);ctx.drawImage(dcv,0,0);
 for(const x of [3,8,13,18]){const fl=.75+.25*Math.sin(t*9+x*3),px=x*T+16,py=T-8;
  const g2=ctx.createRadialGradient(px,py+12,2,px,py+12,52*fl);g2.addColorStop(0,'rgba(255,170,60,.45)');g2.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g2;ctx.fillRect(px-60,py-40,120,130);
  ctx.fillStyle='#6b4a2a';ctx.fillRect(px-2,py,4,10);ctx.fillStyle='#ffb43a';ctx.beginPath();ctx.ellipse(px,py-2,4*fl,7*fl,0,0,7);ctx.fill();ctx.fillStyle='#fff2a8';ctx.fillRect(px-1,py-3,2,4)}
 const hx=10*T,hy=2*T,op=D.open,rdy=!op&&!slimes.length;
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(hx+16,hy+28,15,5,0,0,7);ctx.fill();
 if(rdy){ctx.strokeStyle='rgba(255,216,74,'+(.4+.3*Math.sin(t*5))+')';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(hx+16,hy+18,22,18,0,0,7);ctx.stroke()}
 ctx.fillStyle='#7a4a22';ctx.fillRect(hx+3,hy+12,26,15);ctx.fillStyle='#e8c14a';ctx.fillRect(hx+3,hy+17,26,3);ctx.fillRect(hx+14,hy+15,4,6);
 if(op){ctx.fillStyle='#5a3818';ctx.fillRect(hx+3,hy+2,26,8);ctx.fillStyle='#ffe98a';ctx.fillRect(hx+5,hy+10,22,2)}
 else{ctx.fillStyle='#9a6230';ctx.fillRect(hx+3,hy+6,26,7);ctx.fillStyle='#e8c14a';ctx.fillRect(hx+3,hy+9,26,2);if(!rdy){ctx.fillStyle='#8fc6ff';ctx.fillRect(hx+14,hy+13,4,5)}}
 ctx.strokeStyle='#2b1808';ctx.lineWidth=1;ctx.strokeRect(hx+3.5,hy+12.5,25,14);
 drawGhosts();drawDrops();
 for(const s of slimes)if(s.y<=P.y)drawSlime(s);
 ctx.globalAlpha=(P.iframe>0&&P.dash<=0&&Math.floor(P.iframe*14)%2)?.3:1;hero();ctx.globalAlpha=1;
 for(const s of slimes)if(s.y>P.y)drawSlime(s);
 for(const p of fx){ctx.fillStyle=`rgba(${p.c||'90,170,255'},${Math.min(1,p.l*2)})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,7);ctx.fill()}
 ui();
 const sx=(P.x-cx)*Z,sy=(P.y-cy-20)*Z,vg=ctx.createRadialGradient(sx,sy,90,sx,sy,330);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(5,3,12,.7)');ctx.fillStyle=vg;ctx.fillRect(0,0,VW,VH);
 ctx.fillStyle='#000a';ctx.fillRect(VW/2-110,lby(),220,22);ctx.fillStyle='#fff';ctx.font='bold 13px system-ui,sans-serif';ctx.textAlign='center';
 ctx.fillText(op?'เปิดหีบแล้ว — ออกทางประตูด้านล่าง':slimes.length?'สไลม์เหลือ '+slimes.length+' ตัว':'หีบถูกปลดผนึกแล้ว!',VW/2,lby()+16);ctx.textAlign='left';
 if(P.red>0){ctx.fillStyle='rgba(255,0,0,'+P.red+')';ctx.fillRect(0,0,VW,VH)}}
