// fix17.js (v4.25) — ออกแบบแมพป่าใหม่ให้เป็นธรรมชาติ: พื้นไล่สีด้วย noise · ป่าทึบเป็นต้นไม้จริง · ลำธาร/บ่อ/ลาวา · ทางเดินดิน · สะพาน
// หิน ดอกไม้ เห็ด · ลานบอสเป็นวงหินตั้ง · ต้นไม้บังตัวละครแบบโปร่งเมื่อเดินหลังต้น
// =====================================================================
function makeDead16(seed){const c=document.createElement('canvas');c.width=80;c.height=100;const k=c.getContext('2d'),r=i=>hash(seed*5.3+i,seed*2.1+i*.53);
 k.fillStyle='rgba(0,0,0,.3)';k.beginPath();k.ellipse(40,92,20,5,0,0,7);k.fill();
 const br=(x,y,a,len,w,d)=>{if(d>4||len<5)return;const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;k.strokeStyle=d<1?'#1c1210':'#2a1a14';k.lineWidth=w;k.lineCap='round';k.beginPath();k.moveTo(x,y);k.quadraticCurveTo((x+x2)/2+(r(d*7+len)-.5)*8,(y+y2)/2,x2,y2);k.stroke();
  if(d>1){k.strokeStyle='rgba(255,110,30,.55)';k.lineWidth=Math.max(.6,w*.25);k.beginPath();k.moveTo(x,y);k.lineTo(x2,y2);k.stroke()}
  const n=d<1?3:2;for(let i=0;i<n;i++)br(x2,y2,a+(r(d*11+i+len)-.5)*1.5-(i?.35:-.35),len*(.62+r(i+d)*.15),w*.62,d+1)};
 const g=k.createLinearGradient(32,0,48,0);g.addColorStop(0,'#140c0a');g.addColorStop(.5,'#3a2620');g.addColorStop(1,'#120a08');k.fillStyle=g;k.beginPath();k.moveTo(31,93);k.quadraticCurveTo(37,80,37,58);k.lineTo(43,58);k.quadraticCurveTo(43,80,49,93);k.closePath();k.fill();
 br(40,60,-Math.PI/2+(r(1)-.5)*.3,26,6,0);
 k.strokeStyle='rgba(255,120,40,.7)';k.lineWidth=1;k.beginPath();k.moveTo(39,90);k.lineTo(41,78);k.lineTo(39,66);k.stroke();
 for(let i=0;i<10;i++){k.fillStyle=r(i+40)>.5?'rgba(255,150,50,.8)':'rgba(255,90,30,.7)';k.fillRect(14+r(i+60)*52,10+r(i+80)*40,2,2)}attachTreeArt(c,seed,24,'fire');return c}
function dark16(src,col){const c=document.createElement('canvas');c.width=80;c.height=100;const k=c.getContext('2d');const paint=()=>{k.globalCompositeOperation='source-over';k.clearRect(0,0,80,100);k.drawImage(src,0,0);k.globalCompositeOperation='source-atop';k.fillStyle=col;k.fillRect(0,0,80,100);if(c.treeWatch)for(const fn of c.treeWatch)fn()};paint();watchTreeArt(src,paint);return c}
function glowTree16(src,col,n,seed){const c=document.createElement('canvas');c.width=80;c.height=100;const k=c.getContext('2d');const paint=()=>{k.globalCompositeOperation='source-over';k.clearRect(0,0,80,100);k.drawImage(src,0,0);k.globalCompositeOperation='source-atop';
 for(let i=0;i<n;i++){const x=12+hash(seed+i,3)*56,y=10+hash(i,seed+7)*50,g=k.createRadialGradient(x,y,0,x,y,4);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(x-4,y-4,8,8)}if(c.treeWatch)for(const fn of c.treeWatch)fn()};paint();watchTreeArt(src,paint);return c}
const NAT16={
 mist:{g:[[52,92,60],[62,104,66],[44,80,54],[72,112,70]],path:'#7a6a4c',pathD:'#5a4a34',liq:['#3a7a8a','#2a5a6a','#9ad8e0'],shore:'#5a6a4a',forest:.56,rockMix:.08,river:1,ponds:2,lava:0,
  spr:()=>[makeTree(21,138),makeTree(22,128),makeTree(23,150),makeTree(24,142)],dec:'mist'},
 volcano:{g:[[74,58,52],[86,66,58],[58,44,40],[96,76,64]],path:'#3a2c28',pathD:'#241a18',liq:['#ff8a1a','#c02a08','#ffe27a'],shore:'#1e1210',forest:.6,rockMix:.45,river:1,ponds:2,lava:1,
  spr:()=>[makeDead16(31),makeDead16(32),makeDead16(33),dark16(makeTree(34,10),'rgba(40,12,6,.5)')],dec:'volcano'},
 shadow:{g:[[44,40,58],[52,46,68],[36,32,50],[60,54,78]],path:'#4a4258',pathD:'#2e2840',liq:['#2a1e4a','#140e2a','#b89aff'],shore:'#1c1830',forest:.57,rockMix:.3,river:0,ponds:4,lava:0,
  spr:()=>[glowTree16(dark16(makeTree(41,252),'rgba(12,8,30,.45)'),'rgba(220,180,255,.9)',14,41),glowTree16(dark16(makeTree(42,238),'rgba(12,8,30,.45)'),'rgba(160,230,255,.9)',10,42),dark16(makeTree(43,262),'rgba(12,8,30,.5)')],dec:'shadow'}};
const NATSPR16={};const natSpr16=id=>NATSPR16[id]||(NATSPR16[id]=NAT16[id].spr());
const CUTSPR16={};const cutSpr16=kd=>CUTSPR16[kd]||(CUTSPR16[kd]=kd==='treeE'?glowTree16(makeTree(51,112),'rgba(210,255,200,.95)',12,51):kd==='treeF'?glowTree16(makeTree(52,24),'rgba(255,200,80,.95)',14,52):glowTree16(makeTree(53,288),'rgba(230,200,255,.95)',16,53));
// ---------- สร้างแมพธรรมชาติ ----------
function natGen16(zi){const Zd=ZONES[zi],S=NAT16[Zd.id];ZW=62;ZH=44;const R=srand(7331*(zi+3)),sd=zi*13.7,cx=ZW>>1,K=[],m=[];
 for(let y=0;y<ZH;y++){K[y]=[];for(let x=0;x<ZW;x++){const e=Math.min(x,y,ZW-1-x,ZH-1-y),n=vn(x/3+sd,y/3+5);let k=0;
  if(e<2+n*3.2)k=(S.rockMix>.3&&vn(x/4+90,y/4+sd)>.6)?3:1;
  else{const f=vn(x/7+sd+50,y/7+20)*.6+vn(x/2.6+sd,y/2.6+90)*.4;if(f>S.forest)k=R()<S.rockMix?3:1;else if(f>S.forest-.07&&R()<.18)k=R()<S.rockMix?3:1;else if(R()<.012)k=R()<.5?3:1}
  K[y][x]=k}}
 const blob=(x0,y0,r,k)=>{x0=Math.round(x0);y0=Math.round(y0);const ri=Math.ceil(r);for(let y=Math.max(2,y0-ri-2);y<Math.min(ZH-2,y0+ri+3);y++)for(let x=Math.max(2,x0-ri-2);x<Math.min(ZW-2,x0+ri+3);x++){const d=Math.hypot((x-x0)*.85,y-y0)+(vn(x/2+sd,y/2)-.5)*2.2;if(d<r)K[y][x]=k}};
 if(S.river){const y0=Math.round(ZH*(.42+R()*.12)),ph=R()*6;for(let x=0;x<ZW;x++){const yy=Math.round(y0+Math.sin(x*.17+ph)*2.6+Math.sin(x*.06+ph*2)*3.5),w=vn(x/4,sd)>.55?1:0;for(let dy=-1-w;dy<=w;dy++){const y=yy+dy;if(y>1&&y<ZH-2)K[y][x]=2}}}
 for(let i=0;i<S.ponds;i++)blob(6+Math.floor(R()*(ZW-12)),8+Math.floor(R()*(ZH-16)),2+R()*2.4,2);
 const ent={x:cx,y:ZH-5},arena={x:cx,y:9};
 const clr=(x0,y0,r)=>{for(let y=y0-r-1;y<=y0+r+1;y++)for(let x=x0-r-1;x<=x0+r+1;x++)if(K[y]&&K[y][x]!==undefined&&x>1&&y>1&&x<ZW-2&&y<ZH-2&&Math.hypot(x-x0,y-y0)<=r+.3)K[y][x]=0};
 const path=new Set(),bridge=new Set(),dig=(x,y,w,mark,al)=>{for(let dy=-w;dy<=w;dy++)for(let dx=-w;dx<=w;dx++){const xx=x+dx,yy=y+dy;if(xx>1&&yy>1&&xx<ZW-2&&yy<ZH-2&&dx*dx+dy*dy<=w*w+1){if(K[yy][xx]===2){if(!al)continue;bridge.add(yy*ZW+xx)}K[yy][xx]=0;if(mark)path.add(yy*ZW+xx)}}};
 const walk=(x,y,tx,ty,w,mark,al)=>{let g=0;while((Math.abs(x-tx)>1||Math.abs(y-ty)>1)&&g++<900){if(R()<.7){if(Math.abs(tx-x)>Math.abs(ty-y)?R()<.75:R()<.25)x+=Math.sign(tx-x);else y+=Math.sign(ty-y)}else{if(R()<.5)x+=R()<.5?-1:1;else y+=R()<.5?-1:1}x=clamp(x,3,ZW-4);y=clamp(y,3,ZH-4);dig(x,y,w,mark,al)}};
 clr(ent.x,ent.y,4);clr(arena.x,arena.y,7);
 walk(ent.x,ent.y-3,arena.x,arena.y+6,1,1,1);
 for(let i=0;i<3;i++){const tx=i===0?6+Math.floor(R()*8):i===1?ZW-7-Math.floor(R()*8):6+Math.floor(R()*(ZW-12)),ty=8+Math.floor(R()*(ZH-18));walk(ent.x+(R()<.5?-2:2),ent.y-6-Math.floor(R()*10),tx,ty,0,1)}
 for(let i=0;i<5;i++)walk(6+Math.floor(R()*(ZW-12)),6+Math.floor(R()*(ZH-12)),ent.x+Math.floor(R()*7)-3,ent.y-4-Math.floor(R()*14),0,0);
 // ไม่ให้แม่น้ำ/ลาวาตัดขาดแมพ: ทุกจุดที่เป็นพื้นแต่เดินไม่ถึง → กลายเป็นป่า
 for(let y=0;y<ZH;y++){m[y]=[];for(let x=0;x<ZW;x++)m[y][x]=K[y][x]?WL:FL}
 const seen=new Uint8Array(ZW*ZH),q=[ent.y*ZW+ent.x];seen[q[0]]=1;
 while(q.length){const i=q.pop(),x=i%ZW,y=(i/ZW)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=(y+dy)*ZW+x+dx;if(!seen[j]&&m[y+dy]&&m[y+dy][x+dx]===FL){seen[j]=1;q.push(j)}}}
 const floor=[];for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){if(m[y][x]===FL&&!seen[y*ZW+x]){m[y][x]=WL;K[y][x]=1}else if(m[y][x]===FL)floor.push([x,y])}
 // ต้นไม้ให้ตัด
 const ores=[],oreAt={},wsum=Zd.ores.reduce((a,b)=>a+b[1],0);
 for(let n=0,g=0;n<46&&g<9000;g++){const [x,y]=floor[Math.floor(R()*floor.length)];
  if(path.has(y*ZW+x)||bridge.has(y*ZW+x)||Math.hypot(x-ent.x,y-ent.y)<6||Math.hypot(x-arena.x,y-arena.y)<9||oreAt[y*ZW+x])continue;
  let nb=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(m[y+dy][x+dx]===WL)nb++;if(nb>=2)continue;
  let r=R()*wsum,kd=Zd.ores[0][0];for(const [k,w] of Zd.ores){if(r<w){kd=k;break}r-=w}
  const KK=OREK[kd],o={tx:x,ty:y,x:x*T+16,y:y*T+16,kind:kd,hp:KK.hp,max:KK.hp,alive:true,regen:0,shake:0};ores.push(o);oreAt[y*ZW+x]=o;n++}
 {const done=new Set();for(const s0 of [...bridge]){if(done.has(s0))continue;const comp=[],q=[s0];done.add(s0);while(q.length){const i=q.pop();comp.push(i);for(const d of [1,-1,ZW,-ZW]){const j=i+d;if(bridge.has(j)&&!done.has(j)){done.add(j);q.push(j)}}}if(comp.length<4)for(const i of comp)bridge.delete(i)}}
 const Zm={zi,Zd,m,ores,oreAt,floor,ent,arena,seen,W:62,H:44,K,path,bridge,nat16:1};natPaint16(Zm,R,S);return Zm}
// ---------- วาดแมพลงแคนวาส ----------
function natPaint16(Zm,R,S){const {m,K,Zd}=Zm,id=Zd.id,c=document.createElement('canvas');c.width=ZW*T;c.height=ZH*T;const k=c.getContext('2d'),sd=Zm.zi*7.1;
 const rgb=a=>'rgb('+(a[0]|0)+','+(a[1]|0)+','+(a[2]|0)+')',mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],G=S.g,rn=(a,b)=>a+R()*(b-a);
 // 1) พื้นไล่สีนุ่ม ๆ
 for(let py=0;py<c.height;py+=8)for(let px=0;px<c.width;px+=8){const n1=vn(px/150+sd,py/150+3),n2=vn(px/40+sd*2,py/40+11),n3=hash(px*.37,py*.71);
  let col=mix(G[0],G[1],n1);col=mix(col,G[2],Math.max(0,n2-.55)*1.6);col=mix(col,G[3],Math.max(0,.35-n2)*1.2);const j=(n3-.5)*7;k.fillStyle=rgb([col[0]+j,col[1]+j,col[2]+j]);k.fillRect(px,py,8,8)}
 // ร่มเงาใต้ป่า (พื้นติดป่าเข้มลง)
 for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){if(K[y][x]!==1&&K[y][x]!==3)continue;const g=k.createRadialGradient(x*T+16,y*T+22,4,x*T+16,y*T+22,34);g.addColorStop(0,'rgba(0,0,0,.30)');g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(x*T-18,y*T-12,68,68)}
 // 2) ทางเดินดิน: เส้นโค้งต่อเนื่อง (วาดบนแคนวาสแยกแล้วผสมโปร่ง)
 {const pc=document.createElement('canvas');pc.width=c.width;pc.height=c.height;const q=pc.getContext('2d');q.lineCap='round';q.lineJoin='round';
  const P2=[...Zm.path].filter(i=>!K[(i/ZW)|0][i%ZW]||Zm.bridge.has(i)),has=i=>Zm.path.has(i);
  for(const [lw,col] of [[30,S.pathD],[21,S.path]]){q.strokeStyle=col;q.fillStyle=col;q.lineWidth=lw;
   for(const i of P2){const x=i%ZW,y=(i/ZW)|0,cx0=x*T+16+(hash(x,y)-.5)*4,cy0=y*T+16+(hash(y,x)-.5)*4;q.beginPath();q.arc(cx0,cy0,lw/2,0,7);q.fill();
    for(const [dx,dy] of [[1,0],[0,1],[1,1],[-1,1]])if(has(i+dy*ZW+dx)){const j=i+dy*ZW+dx,x2=j%ZW,y2=(j/ZW)|0;q.beginPath();q.moveTo(cx0,cy0);q.lineTo(x2*T+16+(hash(x2,y2)-.5)*4,y2*T+16+(hash(y2,x2)-.5)*4);q.stroke()}}}
  q.globalCompositeOperation='source-atop';for(let i=0;i<P2.length*3;i++){const t=P2[Math.floor(R()*P2.length)],x=t%ZW,y=(t/ZW)|0;q.fillStyle=R()<.5?'rgba(0,0,0,.18)':'rgba(255,255,255,.08)';q.beginPath();q.ellipse(x*T+rn(2,30),y*T+rn(2,30),rn(1.5,3),rn(1,2),0,0,7);q.fill()}
  k.globalAlpha=.62;k.drawImage(pc,0,0);k.globalAlpha=1}
 // 3) น้ำ / ลาวา / บ่อมืด: รูปทรงต่อเนื่อง ขอบโค้ง
 const L=S.liq,lt=[],isL=(x,y)=>K[y]&&(K[y][x]===2||Zm.bridge.has(y*ZW+x));for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++)if(isL(x,y))lt.push([x,y]);
 // หน้ากากแบบเบลอ+ตัดขอบ → รูปทรงโค้งธรรมชาติ
 const mask=(th)=>{const sc=4,w=Math.ceil(c.width/sc),h=Math.ceil(c.height/sc),m1=document.createElement('canvas');m1.width=w;m1.height=h;const a1=m1.getContext('2d');a1.fillStyle='#fff';for(const [x,y] of lt)a1.fillRect(x*T/sc,y*T/sc,T/sc,T/sc);
   const m2=document.createElement('canvas');m2.width=w;m2.height=h;const a2=m2.getContext('2d');a2.filter='blur(3px)';a2.drawImage(m1,0,0);a2.filter='none';const id2=a2.getImageData(0,0,w,h),d=id2.data;
   for(let i=3;i<d.length;i+=4){const v=d[i];d[i]=v>th+20?255:v<th-20?0:Math.round((v-(th-20))/40*255);d[i-1]=d[i-2]=d[i-3]=255}a2.putImageData(id2,0,0);
   const out=document.createElement('canvas');out.width=c.width;out.height=c.height;const o=out.getContext('2d');o.imageSmoothingEnabled=true;o.drawImage(m2,0,0,c.width,c.height);return out};
 const tint=(mk,col,alpha)=>{const t2=document.createElement('canvas');t2.width=c.width;t2.height=c.height;const o=t2.getContext('2d');o.drawImage(mk,0,0);o.globalCompositeOperation='source-in';if(typeof col==='function')col(o);else{o.fillStyle=col;o.fillRect(0,0,c.width,c.height)}k.globalAlpha=alpha==null?1:alpha;k.drawImage(t2,0,0);k.globalAlpha=1};
 if(lt.length){const mS=mask(70),mW=mask(128),mD=mask(200);
  tint(mS,S.shore);tint(mW,L[0]);tint(mD,L[1],.6);
  tint(mW,o=>{for(let i=0;i<lt.length*2;i++){const [x,y]=lt[Math.floor(R()*lt.length)],px=x*T+rn(0,32),py=y*T+rn(0,32);
    if(S.lava){o.strokeStyle=L[2];o.globalAlpha=.65;o.lineWidth=1.6;o.beginPath();o.moveTo(px,py);o.lineTo(px+rn(-9,9),py+rn(3,8));o.lineTo(px+rn(-9,9),py+rn(8,15));o.stroke();if(R()<.3){o.globalAlpha=.85;o.fillStyle='#2a1208';o.beginPath();o.ellipse(px,py,rn(3,8),rn(2,4),rn(0,3),0,7);o.fill()}}
    else{o.strokeStyle=L[2];o.globalAlpha=.35;o.lineWidth=1.2;o.beginPath();o.moveTo(px,py);o.quadraticCurveTo(px+6,py-2,px+12,py);o.stroke()}}
   o.globalAlpha=1;o.globalCompositeOperation='source-atop';const lg=o.createLinearGradient(0,0,0,c.height);lg.addColorStop(0,'rgba(255,255,255,.04)');lg.addColorStop(1,'rgba(0,0,0,.04)');o.fillStyle=lg;o.fillRect(0,0,c.width,c.height)});}
 if(S.lava){k.globalCompositeOperation='lighter';for(const [x,y] of lt){if(R()<.5)continue;const g=k.createRadialGradient(x*T+16,y*T+16,0,x*T+16,y*T+16,46);g.addColorStop(0,'rgba(255,110,30,.2)');g.addColorStop(1,'rgba(255,60,0,0)');k.fillStyle=g;k.fillRect(x*T-30,y*T-30,92,92)}k.globalCompositeOperation='source-over'}
 // สะพาน
 {const B=Zm.bridge,done=new Set();for(const s0 of B){if(done.has(s0))continue;const comp=[],q=[s0];done.add(s0);while(q.length){const i=q.pop();comp.push(i);for(const d of [1,-1,ZW,-ZW]){const j=i+d;if(B.has(j)&&!done.has(j)){done.add(j);q.push(j)}}}
  let x0=1e9,x1=-1,y0=1e9,y1=-1;for(const i of comp){const x=i%ZW,y=(i/ZW)|0;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}const hz=(x1-x0)>(y1-y0);
  const W1=S.lava?['#5a4e48','#4a3e3a','#2a2020']:['#8a6238','#7a5430','#4a3018'];
  for(const i of comp){const x=i%ZW,y=(i/ZW)|0;k.fillStyle='rgba(0,0,0,.35)';k.fillRect(x*T,y*T+4,T,T)}
  for(const i of comp){const x=i%ZW,y=(i/ZW)|0,px=x*T,py=y*T;for(let j=0;j<4;j++){k.fillStyle=W1[(j+(hz?x:y))%2];if(hz)k.fillRect(px+j*8,py,7,T);else k.fillRect(px,py+j*8,T,7)}
   k.fillStyle='rgba(0,0,0,.25)';for(let j=0;j<2;j++)if(hz)k.fillRect(px+3+j*16,py+4,1.5,T-8);else k.fillRect(px+4,py+3+j*16,T-8,1.5)}
  k.fillStyle=W1[2];for(const i of comp){const x=i%ZW,y=(i/ZW)|0,px=x*T,py=y*T;if(hz){if(!B.has(i-ZW))k.fillRect(px,py-3,T,4);if(!B.has(i+ZW))k.fillRect(px,py+T-1,T,4)}else{if(!B.has(i-1))k.fillRect(px-3,py,4,T);if(!B.has(i+1))k.fillRect(px+T-1,py,4,T)}}}}
 // 4) ของประดับพื้น
 const fl=Zm.floor;for(let i=0;i<fl.length*1.4;i++){const [x,y]=fl[Math.floor(R()*fl.length)];if(Zm.path.has(y*ZW+x))continue;const px=x*T+rn(3,29),py=y*T+rn(5,29),r=R();
  if(S.dec==='mist'){if(r<.45){k.strokeStyle=['#5fa05a','#7ab86a','#3f7a40'][i%3];k.lineWidth=1.3;k.lineCap='round';for(let j=0;j<3;j++){k.beginPath();k.moveTo(px,py);k.quadraticCurveTo(px+(j-1)*3,py-5,px+(j-1)*5,py-8);k.stroke()}}
   else if(r<.6){k.fillStyle=['#e8f4ff','#bfe0ff','#fff2b0','#e0c8ff'][i%4];for(let j=0;j<3;j++){k.beginPath();k.arc(px+j*4-4,py+(j%2)*3,1.6,0,7);k.fill()}}
   else if(r<.68){k.fillStyle='#e8e0d0';k.fillRect(px,py-4,2,4);k.fillStyle=['#c84a3a','#d8a050','#e8e0f0'][i%3];k.beginPath();k.ellipse(px+1,py-4,4,2.6,0,Math.PI,0);k.fill()}
   else if(r<.74){k.fillStyle='#3a6a3a';k.beginPath();k.ellipse(px,py,9,6,0,0,7);k.fill();k.fillStyle='#4f8a4a';k.beginPath();k.ellipse(px-2,py-2,6,4,0,0,7);k.fill()}
   else if(r<.78){k.fillStyle='#7a7a72';k.beginPath();k.ellipse(px,py,3.5,2.4,0,0,7);k.fill()}
   else if(r<.795){k.fillStyle='#5a3c22';k.save();k.translate(px,py);k.rotate(rn(-.6,.6));k.fillRect(-16,-3,32,6);k.fillStyle='#8a6a44';k.beginPath();k.ellipse(16,0,3,3,0,0,7);k.fill();k.fillStyle='rgba(90,160,80,.7)';k.fillRect(-10,-4,8,2);k.restore()}}
  else if(S.dec==='volcano'){if(r<.3){k.strokeStyle='rgba(20,10,8,.55)';k.lineWidth=1.2;k.beginPath();k.moveTo(px,py);k.lineTo(px+rn(-9,9),py+rn(-5,5));k.lineTo(px+rn(-12,12),py+rn(-8,8));k.stroke()}
   else if(r<.4){k.strokeStyle='rgba(255,110,30,.6)';k.lineWidth=1;k.beginPath();k.moveTo(px,py);k.lineTo(px+rn(-7,7),py+rn(2,6));k.stroke()}
   else if(r<.55){k.fillStyle='rgba(30,22,20,.6)';k.beginPath();k.ellipse(px,py,rn(4,9),rn(2,4),0,0,7);k.fill()}
   else if(r<.63){k.fillStyle='#2e2420';k.beginPath();k.moveTo(px-5,py+2);k.lineTo(px-2,py-5);k.lineTo(px+4,py-3);k.lineTo(px+6,py+2);k.closePath();k.fill();k.fillStyle='rgba(255,255,255,.08)';k.fillRect(px-2,py-4,3,2)}
   else if(r<.66){k.fillStyle='#d8d0c0';k.fillRect(px-4,py,8,2);k.beginPath();k.arc(px+5,py+1,2,0,7);k.fill()}}
  else{if(r<.18){const g=k.createRadialGradient(px,py-3,0,px,py-3,9);g.addColorStop(0,'rgba(170,140,255,.5)');g.addColorStop(1,'rgba(120,80,255,0)');k.fillStyle=g;k.fillRect(px-9,py-12,18,18);k.fillStyle='#d8d0e8';k.fillRect(px-.8,py-4,1.6,4);k.fillStyle=['#a080ff','#80d8ff','#ff90e0'][i%3];k.beginPath();k.ellipse(px,py-4,3.6,2.4,0,Math.PI,0);k.fill()}
   else if(r<.3){k.fillStyle=['#8a6ad8','#6ab8e8'][i%2];k.beginPath();k.moveTo(px,py-9);k.lineTo(px+3,py);k.lineTo(px-3,py);k.closePath();k.fill();k.fillStyle='rgba(255,255,255,.4)';k.fillRect(px-1,py-6,1,4)}
   else if(r<.5){k.strokeStyle=['#4a4268','#3a3458'][i%2];k.lineWidth=1.2;for(let j=0;j<3;j++){k.beginPath();k.moveTo(px,py);k.quadraticCurveTo(px+(j-1)*3,py-4,px+(j-1)*5,py-7);k.stroke()}}
   else if(r<.6){k.fillStyle='rgba(10,8,20,.4)';k.beginPath();k.ellipse(px,py,rn(4,8),rn(2,4),0,0,7);k.fill()}}}
 // 5) ลานบอส: วงหินตั้ง
 {const ax=Zm.arena.x*T+16,ay=Zm.arena.y*T+16;k.fillStyle=id==='volcano'?'rgba(20,10,8,.35)':'rgba(0,0,0,.14)';k.beginPath();k.ellipse(ax,ay,140,100,0,0,7);k.fill();
  k.strokeStyle=id==='volcano'?'rgba(255,100,30,.35)':id==='shadow'?'rgba(180,140,255,.3)':'rgba(220,240,200,.2)';k.lineWidth=2;k.beginPath();k.ellipse(ax,ay,118,84,0,0,7);k.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,sx=ax+Math.cos(a)*140,sy=ay+Math.sin(a)*100;if(m[(sy/T)|0]&&m[(sy/T)|0][(sx/T)|0]!==FL)continue;
   k.fillStyle='rgba(0,0,0,.35)';k.beginPath();k.ellipse(sx+3,sy+4,9,4,0,0,7);k.fill();const g=k.createLinearGradient(sx-7,0,sx+7,0);g.addColorStop(0,id==='volcano'?'#3a2a26':id==='shadow'?'#3a3450':'#7a7e78');g.addColorStop(1,id==='volcano'?'#1a1210':id==='shadow'?'#1a1628':'#4a4e48');
   k.fillStyle=g;k.beginPath();k.moveTo(sx-7,sy+3);k.lineTo(sx-6,sy-16);k.quadraticCurveTo(sx,sy-22,sx+6,sy-16);k.lineTo(sx+7,sy+3);k.closePath();k.fill();
   k.fillStyle=id==='volcano'?'rgba(255,120,40,.8)':id==='shadow'?'rgba(200,160,255,.8)':'rgba(140,220,180,.6)';k.fillRect(sx-1,sy-12,2,6)}}
 // 6) หิน (บล็อก)
 for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){if(K[y][x]!==3)continue;{const g0=k.createRadialGradient(x*T+16,y*T+18,2,x*T+16,y*T+18,24);g0.addColorStop(0,id==='volcano'?'rgba(24,16,14,.7)':'rgba(20,18,30,.5)');g0.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g0;k.fillRect(x*T-8,y*T-6,48,48)}if(hash(x*1.7,y*2.9)<.35)continue;const px=x*T+16+rn(-8,8),py=y*T+22+rn(-5,5),s=rn(.8,1.45);k.fillStyle='rgba(0,0,0,.35)';k.beginPath();k.ellipse(px+3,py+4,17*s,6*s,0,0,7);k.fill();
  const g=k.createLinearGradient(px-14,py-26,px+14,py);const RC=id==='volcano'?['#4a3a36','#1e1614']:id==='shadow'?['#4a4462','#1c182c']:['#8a8e86','#4a4e48'];g.addColorStop(0,RC[0]);g.addColorStop(1,RC[1]);k.fillStyle=g;k.strokeStyle='rgba(0,0,0,.5)';k.lineWidth=1.2;
  k.beginPath();k.moveTo(px-16*s,py+2);k.lineTo(px-14*s,py-14*s);k.lineTo(px-5*s,py-24*s);k.lineTo(px+8*s,py-22*s);k.lineTo(px+16*s,py-10*s);k.lineTo(px+15*s,py+3);k.closePath();k.fill();k.stroke();
  k.fillStyle='rgba(255,255,255,.12)';k.beginPath();k.moveTo(px-12*s,py-13*s);k.lineTo(px-5*s,py-21*s);k.lineTo(px+4*s,py-19*s);k.lineTo(px-4*s,py-12*s);k.closePath();k.fill();
  if(id==='volcano'){k.strokeStyle='rgba(255,120,30,.75)';k.lineWidth=1.2;k.beginPath();k.moveTo(px-6*s,py-2);k.lineTo(px-2*s,py-10*s);k.lineTo(px+4*s,py-14*s);k.stroke()}
  else if(id==='shadow'&&R()<.5){k.fillStyle='rgba(180,140,255,.9)';k.beginPath();k.moveTo(px+4,py-20*s);k.lineTo(px+8,py-34*s);k.lineTo(px+11,py-19*s);k.closePath();k.fill()}
  else if(id==='mist'){k.fillStyle='rgba(90,150,80,.6)';k.beginPath();k.ellipse(px-3*s,py-20*s,8*s,3*s,-.3,0,7);k.fill()}}
 // 7) ต้นไม้ป่า (เรียงตามแกน y)
 const spr=natSpr16(id),tr=[];for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){if(K[y][x]!==1)continue;const h=hash(x*1.31+Zm.zi,y*2.17),sc=.88+h*.32;tr.push({x:x*T+16+(hash(x,y*3)-.5)*10,base:y*T+28+(hash(y,x*5)-.5)*6,sc,s:spr[Math.floor(h*spr.length)%spr.length],f:hash(x*3,y)>.5})}
 tr.sort((a,b)=>a.base-b.base);for(const t of tr)natTree16(k,t);Zm.trees16=tr;
 // 8) หมอกบาง ๆ
 if(id==='mist'){k.fillStyle='rgba(210,240,230,.05)';for(let i=0;i<50;i++){k.beginPath();k.ellipse(R()*c.width,R()*c.height,70+R()*90,16+R()*20,0,0,7);k.fill()}}
 Zm.cv=c}
function natTree16(k,t,a){k.save();if(a!==undefined)k.globalAlpha=a;k.translate(t.x,t.base);if(t.f)k.scale(-1,1);k.drawImage(t.s,-40*t.sc,-94*t.sc,80*t.sc,100*t.sc);k.restore()}
{const _gz=genZone;genZone=function(zi){const Zd=ZONES[zi];if(Zd&&NAT16[Zd.id]){if(ZCACHE[zi]){ZW=62;ZH=44;return ZCACHE[zi]}return ZCACHE[zi]=natGen16(zi)}return _gz(zi)}}
for(const id in NAT16)delete ZCACHE[NZI15[id]];
// ---------- ต้นไม้บังตัวละคร (โปร่งเมื่ออยู่หลังต้น) + หมอกลอย ----------
{const _dd=drawDmgTxt;drawDmgTxt=function(dt){try{const Zm=D&&D.zone;if(Zm&&Zm.nat16&&Zm.trees16){const ent=[];ent.push([P.x,P.y,1]);for(const mb of D.mobs)ent.push([mb.x,mb.y,0]);
   for(const t of Zm.trees16){if(Math.abs(t.x-P.x)>520||Math.abs(t.base-P.y)>420)continue;const w=30*t.sc,top=t.base-88*t.sc;let pl=false,mo=false;for(const [x,y,isP] of ent){if(y<t.base-4&&y>top+10&&Math.abs(x-t.x)<w){if(isP)pl=true;else mo=true}}
    if(pl)natTree16(ctx,t,.45);else if(mo)natTree16(ctx,t)}
   if(Zm.Zd.id==='mist'){const tt=performance.now()/1000;ctx.save();ctx.fillStyle='rgba(220,245,235,.07)';for(let i=0;i<6;i++){const x=P.x-260+((i*170+tt*12)%560),y=P.y-160+i*60+Math.sin(tt*.3+i)*20;ctx.beginPath();ctx.ellipse(x,y,120,26,0,0,7);ctx.fill()}ctx.restore()}}}catch(e){}return _dd(dt)}}
// ---------- ต้นไม้ให้ตัด: ใช้สไปรต์จริง + แสงเรืองบอกว่าตัดได้ ----------
{const _do=drawOreZ;drawOreZ=function(o){if(!(D&&D.zone&&D.zone.nat16&&OREK[o.kind]&&OREK[o.kind].tree))return _do(o);const sh=o.shake>0?Math.sin(o.shake*60)*2.5*(o.shake/.3):0,x=o.tx*T+16+sh,y=o.ty*T+28,t=performance.now()/1000,c=TREEPAL15[o.kind]||['','','#fff','rgba(255,255,255,.3)'];
  ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,22);g.addColorStop(0,c[3]);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,22,8,0,0,7);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(x,y);ctx.rotate(o.shake>0?Math.sin(o.shake*55)*.05:Math.sin(t*1.2+o.tx)*.01);ctx.drawImage(cutSpr16(o.kind),-34,-80,68,85);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const a=t*1.1+i*2.1+o.tx;ctx.fillStyle=c[2];ctx.globalAlpha=.55+.3*Math.sin(t*3+i);ctx.beginPath();ctx.arc(x+Math.cos(a)*16,y-46+Math.sin(a*1.3)*12,1.5,0,7);ctx.fill()}ctx.restore()}}

// =====================================================================
