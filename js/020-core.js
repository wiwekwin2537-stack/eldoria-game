const shopEl=document.getElementById('shop');
function buildTown(){
 dm=[];for(let y=0;y<TH;y++)dm[y]=Array(TW).fill(0);
 dcv=document.createElement('canvas');dcv.width=TW*T;dcv.height=TH*T;const k=dcv.getContext('2d');
 const rd=new Set(),road=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rd.add(j*TW+i)};
 road(0,19,TW,2);road(19,9,2,6);road(15,15,10,5);
 for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){const px=x*T,py=y*T;
  if(rd.has(y*TW+x)){k.drawImage(ART.cobble,(x%4)*64,(y%4)*64,64,64,px,py,T,T);for(const [ax,ay] of [[0,-1],[0,1],[-1,0],[1,0]])if(x+ax>=0&&y+ay>=0&&x+ax<TW&&y+ay<TH&&!rd.has((y+ay)*TW+x+ax)){k.fillStyle='rgba(40,32,22,.5)';const qx=ax>0?px+T-3:px,qy=ay>0?py+T-3:py;ax?k.fillRect(qx,py,3,T):k.fillRect(px,qy,T,3)}}
  else k.drawImage(grassV[gv(x,y)],px,py)}
 const box=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)dm[j][i]=c};
 const put=(n,x,y,w,h)=>{box(x,y,w,h,1);k.drawImage(ART[n],x*T,y*T,w*T,h*T)};
 for(const id of SHOP_ORDER){const S=SHOP_DATA[id];put(S.img,...S.b);shopSign(k,S);shopName(k,S)}   // ร้านอุปกรณ์ · ร้านขายยา · โรงเตี๊ยม (ป้ายรูปสัญลักษณ์)
    // บ้านชาวบ้าน (ประตูล็อก)
 k.drawImage(ART.castle,13*T,1*T,14*T,8*T);box(13,1,14,8,1);box(19,8,2,1,4);
 k.drawImage(ART.fountain,20*T-48,17*T-62,96,96);box(19,16,2,2,1);
 for(const [x,y,i] of [[2,12,0],[2,17,1],[37,12,2],[37,17,0],[11,24,1],[28,24,2],[10,9,0],[29,9,1],[2,26,2],[37,27,1]]){box(x,y,1,1,1);if(window.prop)prop(kk=>kk.drawImage(treeSpr[i],x*T+16-36,y*T+28-85,72,90),y*T+28,x*T-24,y*T-58,80,92,true);else k.drawImage(treeSpr[i],x*T+16-36,y*T+28-85,72,90)}
 k.fillStyle='rgba(110,190,255,.5)';k.fillRect(0,19*T,T,2*T);k.fillStyle='#fff';k.font='bold 10px system-ui,sans-serif';k.fillText('ทางออก',0,19*T-4);box(0,19,1,2,GATE);
for(const f of FORGE)box(f.x,f.y,1,1,1);D={town:true,ret:[(W-3)*T+16,WC.y],road:rd,npcs:NPC_DATA.map(mkNPC),carts:CART_DATA.map(mkCart),stalls:STALL_DATA,doors:townDoors()};for(const s of STALL_DATA)box(s.x,s.y,2,1,1);for(const [lx,ly] of LAMP_DATA){box(lx,ly,1,1,1);const px=lx*T+16,py=ly*T+30;prop(k=>{k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(px+4,py,9,3,0,0,7);k.fill();k.fillStyle='#2b2b32';k.fillRect(px-2,py-46,4,46);k.fillRect(px-6,py-4,12,4);k.fillStyle='#ffcf5a';k.fillRect(px-5,py-58,10,12);k.fillStyle='#2b2b32';k.fillRect(px-7,py-60,14,3)},py,px-12,py-62,28,68)}}
function placeAtSpawn(){P.x=TOWN_SPAWN.x*T;P.y=TOWN_SPAWN.y*T;P.dir='d';P.kx=P.ky=0;P.dash=0;unstick()}
function enterTown(gate){fade('#fff');sfx('warp');setScene('town');flushDrops();dsav=slimes.splice(0);buildTown();mkMini(dcv,TW,TH,2.6);placeAtSpawn();if(gate){P.x=1.5*T;P.y=17*T;P.dir='r';unstick()}say('ถึงเมืองเอลโดเรียแล้ว! ยืนหน้าประตูร้านแล้วกด E/⚔️ เพื่อเปิดประตูเข้าไป')}
// จุดเกิด = เมือง: ใช้ตอนตาย / ใช้ม้วนวาป (ออกจากถ้ำก่อนถ้าอยู่ในถ้ำ)
function toTown(){if(D&&D.shop)leaveShop(true);if(D&&!D.town)exitD();if(!D)enterTown();else{placeAtSpawn();fade('#fff');sfx('warp')}}
// เริ่มเกมที่เมือง (รอรูปอาคารโหลดก่อน เพราะฉากเมืองวาดลงแคนวาสครั้งเดียว)
function startInTown(){const go=()=>{if(D)return;setScene('town');dsav=slimes.splice(0);buildTown();mkMini(dcv,TW,TH,2.6);placeAtSpawn();say('ยินดีต้อนรับสู่เมืองเอลโดเรีย — นี่คือจุดเกิดของคุณ เดินชนขอบซ้ายสุดเพื่อออกไปทุ่งหญ้า · ยืนหน้าประตูร้านแล้วกด E/⚔️ เพื่อเข้าร้าน')};
 const pend=Object.values(ART).filter(im=>!im.complete);if(!pend.length)return go();let n=pend.length;const f=()=>{if(--n===0)go()};pend.forEach(im=>{im.addEventListener('load',f);im.addEventListener('error',f)})}
function townAct(){const v=DIRV[P.dir],ax=P.x+v[0]*26,ay=P.y-8+v[1]*26;
 for(const n of D.npcs)if(Math.hypot(n.x-ax,n.y-8-ay)<28){n.bub={txt:n.lines[n.i++%n.lines.length],t:4};n.wave=0;sfx('ui');return true}
 const fgt=target(),fg=FORGE.find(f=>f.x===fgt[0]&&f.y===fgt[1]);if(fg){openForge(fg.k);return true}
  const dr=doorNear();
 if(dr){if(dr.id==='locked'){say('บ้านชาวบ้าน — ประตูล็อกอยู่ ไม่มีใครอยู่');sfx('thud');return true}startDoor(dr.id);return true}
 const [x,y]=target(),t=dm[y]&&dm[y][x];
 if(t===4){say('ประตูปราสาท — ทหารยาม: "พระราชาทรงรอท่านอยู่ ภารกิจจะมาในเร็ว ๆ นี้"');return true}return false}
// ประตูร้านค้า: จุดกึ่งกลางประตู (cx) และขอบล่างอาคาร (cy) — ยืนใต้ประตูแล้วกด E/⚔️ เพื่อเปิด
function townDoors(){const L=SHOP_ORDER.map(id=>{const S=SHOP_DATA[id],[bx,by,bw,bh]=S.b;return{id,cx:bx*T+S.door.x+S.door.w/2,cy:(by+bh)*T}});
 return L}
function doorNear(){for(const d of D.doors)if(Math.abs(P.x-d.cx)<30&&P.y>d.cy-4&&P.y<d.cy+30)return d;return null}
function drawTown(){const t=performance.now()/1000,[cx,cy]=cam(TW*T,TH*T,.55);
 view(cx,cy);ctx.fillStyle='#223';ctx.fillRect(cx,cy,VW/Z,VH/Z);ctx.drawImage(dcv,0,0);TOWNLIFE.drawBuildings(ctx);if(!D.city2)padLight();
 for(let i=0;i<3;i++){const u=((t*.5+i/3)%1);ctx.strokeStyle='rgba(235,248,255,'+(.7*(1-u))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(22*T,13*T+2,8+u*36,3.5+u*15,0,0,7);ctx.stroke()}
 drawGhosts();drawDrops();const L=D.npcs.map(n=>[n.y,()=>drawNPC(n,t)]).concat(D.carts.map(c=>[c.y,()=>drawCart(c,t)]),D.stalls.map(s=>[(s.y+1)*T,()=>drawStall(s,t)]),doorLayer(t),FORGE.map(f=>[(f.y+1)*T,()=>drawForge(f,t)]));
 L.push([P.y,()=>{ctx.globalAlpha=1;/* v5.14: เลิกกะพริบตัวตอนโดนโจมตี (เจ้าของสั่ง) — ช่วงอมตะหลังโดนยังทำงานเหมือนเดิม */hero();ctx.globalAlpha=1}]);
 L.sort((p,q)=>p[0]-q[0]);for(const o of L)o[1]();
  if(!D.city2){TOWNLIFE.drawFlags(ctx,t);TOWNLIFE.drawNativeFlags(ctx,t);TOWNLIFE.drawLights(ctx,t);TOWNLIFE.drawLabels(ctx);}drawBubbles();drawDoorPrompt(t);
 for(const p of fx){ctx.fillStyle=`rgba(${p.c||'90,170,255'},${Math.min(1,p.l*2)})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,7);ctx.fill()}
 ui();grade(t,'town');ctx.fillStyle='#000a';ctx.fillRect(VW/2-70,lby(),140,22);ctx.fillStyle='#fff';ctx.font='bold 13px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('เมืองเอลโดเรีย',VW/2,lby()+16);ctx.textAlign='left';
 if(P.red>0){ctx.fillStyle='rgba(255,0,0,'+P.red+')';ctx.fillRect(0,0,VW,VH)}}
// ---- NPC เดินได้ · รถม้า/เกวียน · แผงตลาด ----
const mkNPC=n=>({x:n.x*T,y:n.y*T,home:{x:n.x*T,y:n.y*T},name:n.name,c:n.c,h:n.h,lines:n.lines,i:0,spear:n.spear,fixed:n.fixed,g:n.g||'m',age:n.age||'adult',hs:n.hs,beard:n.beard,mu:n.mu,hat:n.hat,apron:n.apron,cane:n.cane,sk:n.sk,pants:n.pants,r:(n.r||4)*T,sp:n.sp||26,dir:'d',t:Math.random()*9,wait:Math.random()*3,tg:null,mv:false,bub:null,wave:0});
// ถนน = ช่องที่เป็นหินปูถนน (ถนนหลัก/ลานน้ำพุ) — บนถนน NPC ผู้เล่น รถม้า เดินทะลุกันได้ ไม่ติดกัน
const onRoad=(x,y)=>!!(D&&D.road&&D.road.has(Math.floor(y/T)*TW+Math.floor(x/T)));
// ช่องว่างจริง ๆ (ไม่ติดบ้าน แผงตลาด ต้นไม้ น้ำพุ ปราสาท)
function npcStatic(x,y){for(const [a,b] of [[-6,-3],[6,-3],[-6,3],[6,3]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);if(!dm[ty]||dm[ty][tx]!==0)return false}return true}
// เส้นตรงจาก (x0,y0) ไป (x1,y1) ไม่ชนอะไรเลยหรือไม่
function npcClear(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.ceil(d/6));for(let i=1;i<=n;i++)if(!npcStatic(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n))return false;return true}
// NPC/ผู้เล่น ชนกันเฉพาะนอกถนน
function npcFree(n,x,y){if(!npcStatic(x,y))return false;if(onRoad(x,y))return true;
 for(const o of D.npcs)if(o!==n&&!onRoad(o.x,o.y)&&Math.abs(x-o.x)<14&&Math.abs(y-o.y)<8)return false;
 return onRoad(P.x,P.y)||Math.hypot(x-P.x,y-P.y)>16}
// เลือกจุดเดินเล่นที่ไปถึงได้จริงแบบเส้นตรง (ไม่เล็งเข้าบ้าน/แผงตลาดแล้วยืนดันกำแพง)
function npcPick(n){for(let i=0;i<14;i++){const x=n.home.x+(Math.random()-.5)*2*n.r,y=n.home.y+(Math.random()-.5)*2*n.r;if(npcStatic(x,y)&&npcClear(n.x,n.y,x,y))return{x,y}}return null}
// ถ้า NPC ไปอยู่ในช่องที่ตันอยู่ (เช่นตอนเริ่ม) ให้ขยับออกไปจุดว่างใกล้สุด
function npcRescue(n){if(npcStatic(n.x,n.y))return;for(let r=6;r<=140;r+=6)for(let a=0;a<16;a++){const x=n.x+Math.cos(a*.3927)*r,y=n.y+Math.sin(a*.3927)*r;if(npcStatic(x,y)){n.x=x;n.y=y;n.home={x,y};return}}}
function updNPCs(dt){for(const n of D.npcs){n.mv=false;if(n.bub&&(n.bub.t-=dt)<=0)n.bub=null;if(n.wave>0)n.wave-=dt;npcRescue(n);if(n.fixed)continue;const dp=Math.hypot(P.x-n.x,P.y-n.y);
 if(dp<46){const dx=P.x-n.x,dy=P.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');continue}
 if(n.wait>0){n.wait-=dt;continue}
 if(!n.tg){n.tg=npcPick(n);n.stuck=0;if(!n.tg){n.wait=1+Math.random()*2;continue}}
 const dx=n.tg.x-n.x,dy=n.tg.y-n.y,d=Math.hypot(dx,dy);if(d<4||n.stuck>.35){n.tg=null;n.wait=n.stuck>.35?.2:1+Math.random()*4;continue}
 const sx=dx/d*n.sp*dt,sy=dy/d*n.sp*dt;let m=false;if(npcFree(n,n.x+sx,n.y+sy)){n.x+=sx;n.y+=sy;m=true}else{if(npcFree(n,n.x+sx,n.y)){n.x+=sx;m=true}if(npcFree(n,n.x,n.y+sy)){n.y+=sy;m=true}}
 if(m){n.mv=true;n.stuck=0;n.t+=dt*8;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}else n.stuck+=dt}}
function drawNPC(n,t){const x=Math.round(n.x),w=n.mv?Math.sin(n.t):0,b=Math.round(n.y-(n.mv?Math.abs(Math.cos(n.t))*1.8:Math.sin(t*1.8+n.x)*.7)),sway=n.mv?w*.03:Math.sin(t*1.1+n.x)*.018,R=(c,a,y,w2,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(y),w2,h)};
 ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(x,n.y+1,11,4,0,0,7);ctx.fill();
 ctx.save();ctx.translate(x,n.y);ctx.transform(1,0,sway,1,0,0);ctx.translate(-x,-n.y);
 if(n.spear)R('#c9ccd6',x+15,b-52,2,52);
 const l1=Math.max(0,w)*3,l2=Math.max(0,-w)*3,a1=w*3;
 R('#14141a',x-7,b-12-l1,6,12);R('#14141a',x+1,b-12-l2,6,12);R(n.c,x-8,b-26,16,14);R(n.c,x-14,b-26+a1,6,12);R('#f1d2b0',x-14,b-15+a1,6,4);
 if(n.wave>0){ctx.save();ctx.translate(x+8,b-26);ctx.rotate(-2.5+Math.sin(t*13)*.4);R(n.c,0,0,6,12);R('#f1d2b0',0,9,6,4);ctx.restore()}else{R(n.c,x+8,b-26-a1,6,12);R('#f1d2b0',x+8,b-15-a1,6,4)}

 R('#f1d2b0',x-6,b-40,12,12);R(n.h,x-7,b-44,14,n.dir==='u'?14:6);
 if(n.dir==='d'){R('#111',x-3,b-36,2,3);R('#111',x+1,b-36,2,3)}else if(n.dir==='l')R('#111',x-5,b-36,2,3);else if(n.dir==='r')R('#111',x+3,b-36,2,3);
 ctx.restore();
 ctx.fillStyle='#fff';ctx.font='bold 10px system-ui,sans-serif';ctx.textAlign='center';ctx.shadowColor='rgba(0,0,0,.9)';ctx.shadowBlur=0;ctx.shadowOffsetY=1;ctx.shadowOffsetX=1;ctx.fillText(n.dn||n.name,x,b-50);ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.textAlign='left';}
function drawBubbles(){if(!D||!D.npcs)return;const t=0;for(const n of D.npcs)if(n.bub){const b=Math.round(n.y-(n.mv?Math.abs(Math.cos(n.t))*1.8:0));bubble(n.bub.txt,Math.round(n.x),b-(14+Math.round(50*(NSC[n.age]||1))),Math.min(1,n.bub.t*3))}}
function drawStall(s,t){const x=s.x*T,y=s.y*T,w=2*T;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x+w/2+6,y+T-1,w/2+10,6,0,0,7);ctx.fill();
 ctx.fillStyle='#5a3a1e';ctx.fillRect(x+1,y-34,3,54);ctx.fillRect(x+w-4,y-34,3,54);
 ctx.fillStyle='#8a5a2e';ctx.fillRect(x,y+12,w,20);ctx.fillStyle='#b27a40';ctx.fillRect(x,y+12,w,4);ctx.fillStyle='#4a2c14';for(let i=1;i<8;i++)ctx.fillRect(x+i*8,y+16,1,16);
 const cols={veg:['#d94a2b','#e8892a','#4fa83a','#8a3fa0'],fruit:['#d03030','#f09a22','#f4d03a','#a0c83a'],bread:['#c8934a','#dba868','#b87a38','#e8c080']}[s.type];
 for(let i=0;i<8;i++){const px=x+5+i*8,py=y+9-(i%2)*3,r=s.type==='bread'?4:3.5+(i%3)*.5;ctx.fillStyle=cols[i%4];ctx.beginPath();if(s.type==='bread')ctx.ellipse(px,py,5,3,0,0,7);else ctx.arc(px,py,r,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(px-1.5,py-2,1.5,1.5)}
 const n=8,sw=Math.sin(t*1.6+s.x)*1.5;for(let i=0;i<n;i++){const ax=x-4+i*(w+8)/n;ctx.fillStyle=i%2?'#f2ead6':s.a;ctx.beginPath();ctx.moveTo(ax,y-34);ctx.lineTo(ax+(w+8)/n,y-34);ctx.lineTo(ax+(w+8)/n+sw*.5,y-14);ctx.quadraticCurveTo(ax+(w+8)/(2*n)+sw,y-9,ax+sw*.5,y-14);ctx.closePath();ctx.fill()}
 ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x-4,y-36,w+8,3)}
