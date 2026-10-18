// ---- น้ำเคลื่อนไหว ----
const isW=(x,y)=>map[y]&&map[y][x]===WATER;
function water(x,y,t){const px=x*T,py=y*T,deep=[[0,1],[0,-1],[1,0],[-1,0]].every(([a,b])=>isW(x+a,y+b));
 ctx.fillStyle=deep?'#245f9f':'#3a86cc';ctx.fillRect(px,py,T,T);ctx.lineWidth=1.2;
 for(let i=0;i<3;i++){const yy=py+5+i*11;ctx.strokeStyle=`rgba(190,230,255,${.22+.12*Math.sin(t*1.5+i)})`;ctx.beginPath();
  for(let xx=0;xx<=T;xx+=4){const wx=px+xx,wy=yy+Math.sin(wx*.11+t*1.8+i*2.2+yy*.04)*2.2;xx?ctx.lineTo(wx,wy):ctx.moveTo(wx,wy)}ctx.stroke()}
 if(Math.sin(t*3+hash(x,y)*30)>.85){ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(px+4+hash(y,x)*22,py+4+hash(x+1,y)*22,2,2)}
 ctx.fillStyle=`rgba(255,255,255,${.22+.14*Math.sin(t*2+x+y)})`;
 if(!isW(x,y-1))ctx.fillRect(px,py,T,3);if(!isW(x,y+1))ctx.fillRect(px,py+T-3,T,3);
 if(!isW(x-1,y))ctx.fillRect(px,py,3,T);if(!isW(x+1,y))ctx.fillRect(px+T-3,py,3,T)}
// ---- กล้อง / การแปลงภาพ / โทนสี ----
let CAMS={x:0,y:0,k:''};
const view=(cx,cy)=>{const s=Z*RES;ctx.setTransform(s,0,0,s,-cx*s,-cy*s)};
const ui=()=>ctx.setTransform(RES,0,0,RES,0,0);
function cam(mw,mh,oy){const vw=VW/Z,vh=VH/Z,tx=mw<=vw?(mw-vw)/2:Math.max(0,Math.min(mw-vw,P.x-vw/2)),ty=mh<=vh?(mh-vh)/2:Math.max(0,Math.min(mh-vh,P.y-vh*oy)),k=mw+','+mh+','+Z+','+VW+','+VH;
 if(CAMS.k!==k)CAMS={x:tx,y:ty,k};else{const a=1-Math.exp(-9*DT);CAMS.x+=(tx-CAMS.x)*a;CAMS.y+=(ty-CAMS.y)*a}
 const q=v=>Math.round(v*Z*RES)/(Z*RES);return[q(CAMS.x),q(CAMS.y)]}
const FADE={a:0,c:'#fff'};const fade=c=>{FADE.a=1;FADE.c=c};
function grade(t,k){if(!SET.grade)return;const cave=k==='cave',g=ctx.createRadialGradient(VW/2,VH/2,150,VW/2,VH/2,430);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,cave?'rgba(0,0,10,.55)':'rgba(8,16,30,.4)');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);
 ctx.fillStyle='rgba(255,196,110,.06)';ctx.fillRect(0,0,VW,VH);
 if(!cave){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const x=((i*210+t*7)%(VW+240))-120,lg=ctx.createLinearGradient(x,0,x-90,VH);lg.addColorStop(0,'rgba(255,230,160,.07)');lg.addColorStop(1,'rgba(255,230,160,0)');ctx.fillStyle=lg;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+46,0);ctx.lineTo(x-60,VH);ctx.lineTo(x-130,VH);ctx.fill()}ctx.restore()}}
// หญ้าโยกตามลม (ลมเป็นคลื่นพัดผ่านแมพ + ใบหญ้าหลบเมื่อตัวละครเดินผ่าน)
function tufts(x,y,t){const h=hash(x*2.3,y*1.9);if(h>.42)return;const n=h<.18?3:1,gust=Math.sin(x*.35+y*.18-t*1.5)*.5+.5;ctx.lineCap='round';ctx.lineWidth=1.4;
 for(let i=0;i<n;i++){const bx=x*T+4+hash(x+i*3.1,y*1.7)*24,by=y*T+10+hash(y+i*2.3,x*.9)*20,len=7+hash(i,x*y)*8,dx=bx-P.x,dy=by-P.y,dd=Math.hypot(dx,dy),push=dd<28?(1-dd/28)*Math.sign(dx||1)*9:0,sw=(Math.sin(t*2.3+bx*.05)*.6+gust*2.2)*len*.22+push;
  ctx.strokeStyle=['#5fae3f','#7cc65a','#3f8a30','#8ed168'][(i+x+y)&3];ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+sw*.4,by-len*.6,bx+sw,by-len);ctx.stroke()}}
// ---- วาดฉากโลกภายนอก ----
function draw(){if(D)return drawD();
 const t=performance.now()/1000,[cx,cy]=cam(W*T,H*T,.58);view(cx,cy);
 const x0=Math.max(0,Math.floor(cx/T)),x1=Math.min(W-1,Math.floor((cx+VW/Z)/T)),y0=Math.max(0,Math.floor(cy/T)),y1=Math.min(H-1,Math.floor((cy+VH/Z)/T));
 if(window.fieldGround)fieldGround(x0,x1,y0,y1,t);
 drawGate(t);drawOres(x0,x1,y0,y1);
 const drawTree=(x,y,front)=>{const tr=treeAt[y*W+x],sc=tr.sc;ctx.save();ctx.translate(x*T+16,y*T+28);
  ctx.fillStyle='rgba(12,30,18,.28)';ctx.beginPath();ctx.ellipse(20*sc,2,32*sc,7*sc,-.12,0,7);ctx.fill();
  ctx.rotate(Math.sin(t*1.25+x*.7+y*.4)*.012+(tr.shake>0?Math.sin(tr.shake*55)*.05*(tr.shake/.35):0));
  const f=front?tr.fade:0;if(f>.02){ctx.globalAlpha=1-.6*f}
  ctx.drawImage(treeSpr[(x*7+y*13)%3],-40*sc,-94*sc,80*sc,100*sc);ctx.restore()};
 const pr=Math.floor(P.y/T),[tx,ty]=target();ctx.strokeStyle='#fff8';ctx.strokeRect(tx*T+1,ty*T+1,T-2,T-2);
 drawGhosts();drawDrops();const L=[];
 for(let y=y0;y<=Math.min(H-1,y1+3);y++)for(let x=Math.max(0,x0-2);x<=Math.min(W-1,x1+2);x++)if(map[y][x]===TREE&&treeAt[y*W+x])L.push([y*T+28,()=>drawTree(x,y,y>pr)]);
 L.push([3*T+30,()=>drawCave(t)],[SP.y+14,()=>drawSign(t)]);
 for(const s of slimes)L.push([s.y,()=>drawSlime(s)]);
 L.push([P.y,()=>{ctx.globalAlpha=1;/* v5.14: เลิกกะพริบตัวตอนโดนโจมตี (เจ้าของสั่ง) — ช่วงอมตะหลังโดนยังทำงานเหมือนเดิม */hero();ctx.globalAlpha=1}]);
 L.sort((p,q)=>p[0]-q[0]);for(const o of L)o[1]();drawFalling();drawBars();
 if(dbg)for(const t2 of trees)if(t2.alive&&t2.tx>=x0-1&&t2.tx<=x1+1&&t2.ty>=y0&&t2.ty<=y1+3){ctx.strokeStyle='#ff0';ctx.strokeRect(t2.tx*T+.5,t2.ty*T+.5,T-1,T-1)}
 for(const p of fx){ctx.fillStyle=`rgba(${p.c||'90,170,255'},${Math.min(1,p.l*2)})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,7);ctx.fill()}
 ui();grade(t,'field');if(P.red>0){ctx.fillStyle='rgba(255,0,0,'+P.red+')';ctx.fillRect(0,0,VW,VH)}}
