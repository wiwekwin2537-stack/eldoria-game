// ---- ของ/อุปกรณ์/ไอเท็ม/ขุด/ตัด ----
const blurOK='filter' in CanvasRenderingContext2D.prototype,TOOLS=['sword','axe','pick'],TNAME=['ดาบ','ขวาน','ที่ขุดแร่'],SZN={tiny:'ต้นเล็กมาก',small:'ต้นเล็ก',medium:'ต้นกลาง',large:'ต้นใหญ่'};
const say=t=>{document.getElementById('msg').textContent=t};
function iconCanvasOld(type,sz){sz=sz||64;const c=document.createElement('canvas');c.width=c.height=sz;const k=c.getContext('2d');k.scale(sz/64,sz/64);
 const wood=(x0,y0,w,h)=>{const g=k.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,'#5a3a1e');g.addColorStop(.5,'#9a6a3a');g.addColorStop(1,'#4a2e18');k.fillStyle=g;k.fillRect(x0,y0,w,h);k.strokeRect(x0,y0,w,h)};
 const steel=(x0,y0,x1,y1)=>{const g=k.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#f3f6fb');g.addColorStop(.5,'#a9b3c4');g.addColorStop(1,'#5d6779');return g};
 k.lineJoin='round';k.strokeStyle='#1d222c';k.lineWidth=1.6;
 if(type==='axe'){wood(29,14,7,48);
   k.fillStyle='#3a2414';k.fillRect(29,45,7,11);k.strokeRect(29,45,7,11);k.fillStyle='#7a5430';for(let i=0;i<3;i++)k.fillRect(29,47+i*3,7,1);
   k.fillStyle='#4a2e18';k.fillRect(28,60,9,3);
   k.fillStyle=steel(4,4,44,36);k.beginPath();
   k.moveTo(28,10);k.lineTo(41,10);k.lineTo(41,16);k.lineTo(45,16);k.lineTo(45,26);k.lineTo(41,26);k.lineTo(41,31);k.lineTo(28,31);k.lineTo(15,38);k.quadraticCurveTo(2,22,15,3);k.closePath();k.fill();k.stroke();
   k.fillStyle='rgba(25,32,48,.4)';k.fillRect(28,10,13,21);
   k.fillStyle='#9a6a3a';k.fillRect(30,7,5,5);k.strokeRect(30,7,5,5);
   k.strokeStyle='#fff';k.lineWidth=1.6;k.beginPath();k.moveTo(15,37);k.quadraticCurveTo(3.5,22,15,4);k.stroke();
   k.strokeStyle='rgba(255,255,255,.55)';k.lineWidth=1;k.beginPath();k.moveTo(17,9);k.lineTo(27,12);k.moveTo(17,32);k.lineTo(27,29);k.stroke()}
 else if(type==='pick'){wood(29,16,6,46);
  k.fillStyle=steel(4,6,60,26);k.beginPath();k.moveTo(3,26);k.quadraticCurveTo(32,-2,61,26);k.lineTo(55,27);k.quadraticCurveTo(32,10,9,27);k.closePath();k.fill();k.stroke();
  k.fillStyle='#2a2f3a';k.fillRect(27,14,10,6)}
 else{k.shadowColor='#2f8bff';k.shadowBlur=6;k.fillStyle='#1b1d29';k.fillRect(29.5,8,5,34);k.beginPath();k.moveTo(29.5,8);k.lineTo(32,2);k.lineTo(34.5,8);k.fill();
  k.fillStyle='#8fc6ff';k.fillRect(31.2,9,1.6,32);k.shadowBlur=0;k.fillStyle='#6d7280';k.fillRect(24,42,16,4);k.fillStyle='#0e0e14';k.fillRect(30.5,46,3,10);k.fillStyle='#5db0ff';k.fillRect(30,56,4,5)}
 return c}
function gemIcon(){const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');
 const g=k.createLinearGradient(8,6,40,44);g.addColorStop(0,'#d9f6ff');g.addColorStop(.5,'#4cb8ff');g.addColorStop(1,'#1f5fc4');
 k.fillStyle=g;k.strokeStyle='#103a86';k.lineWidth=1.6;k.beginPath();k.moveTo(14,6);k.lineTo(34,6);k.lineTo(45,19);k.lineTo(24,44);k.lineTo(3,19);k.closePath();k.fill();k.stroke();
 k.strokeStyle='rgba(255,255,255,.7)';k.lineWidth=1;k.beginPath();k.moveTo(3,19);k.lineTo(45,19);k.moveTo(14,6);k.lineTo(19,19);k.lineTo(24,44);k.moveTo(34,6);k.lineTo(29,19);k.lineTo(24,44);k.stroke();return c}
const ICON={sword:iconCanvas('sword'),axe:iconCanvas('axe'),pick:iconCanvas('pick')};
function toolSpr(hx,hy,ang){ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r')ctx.scale(-1,1);if(P.dir==='u'&&P.tool==='axe')ctx.scale(.36,1);ctx.drawImage(toolIcon(P.tool,P.tier[P.tool],64),-23,-36,46,46);ctx.restore()}
function makeStump(){const c=document.createElement('canvas');c.width=32;c.height=26;const k=c.getContext('2d');
 k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(16,21,13,4,0,0,7);k.fill();
 const g=k.createLinearGradient(5,0,27,0);g.addColorStop(0,'#3a2615');g.addColorStop(.5,'#7d5632');g.addColorStop(1,'#3a2615');
 k.fillStyle=g;k.beginPath();k.moveTo(5,21);k.quadraticCurveTo(9,18,9,12);k.lineTo(23,12);k.quadraticCurveTo(23,18,27,21);k.quadraticCurveTo(16,24,5,21);k.fill();
 k.fillStyle='#d9b27a';k.beginPath();k.ellipse(16,12,7.5,3.6,0,0,7);k.fill();
 k.strokeStyle='#a97c4a';k.lineWidth=.8;for(const rr of [2.2,4.6]){k.beginPath();k.ellipse(16,12,rr,rr*.48,0,0,7);k.stroke()}
 k.strokeStyle='#4a3018';k.lineWidth=1;k.beginPath();k.ellipse(16,12,7.5,3.6,0,0,7);k.stroke();return c}
function makeRubble(){const c=document.createElement('canvas');c.width=c.height=32;const k=c.getContext('2d');
 k.fillStyle='rgba(0,0,0,.22)';k.beginPath();k.ellipse(16,24,12,4,0,0,7);k.fill();
 [[10,21,5,3.5,'#6e6e78'],[19,22,6,4,'#585862'],[15,18,4,3,'#7c7c86']].forEach(([x,y,rx,ry,col])=>{k.fillStyle=col;k.beginPath();k.ellipse(x,y,rx,ry,0,0,7);k.fill()});
 k.fillStyle='#5ec8ff';k.fillRect(13,17,2,2);k.fillRect(21,20,2,2);return c}
const stumpSpr=makeStump(),rubbleSpr=makeRubble();
const ores=[],oreAt={},falling=[],drops=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(map[y][x]===ORE){const kd=oreKind(x,y),o={id:ores.length+1,tx:x,ty:y,kind:kd,hp:OREK[kd].hp,max:OREK[kd].hp,shake:0,bar:0,regen:0};ores.push(o);oreAt[y*W+x]=o}
function addDrop(type,x,y){drops.push({type,x,y,z:0,vz:120+Math.random()*80,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*60,t:0})}
function dropLoot(x,y){const n=1+(Math.random()<.4?1:0),c=1+Math.floor(Math.random()*3);for(let i=0;i<n;i++)addDrop('gel',x,y);for(let i=0;i<c;i++)addDrop('coin',x,y)}
function refreshInv(){const c=document.getElementById('coinhud');if(c)c.textContent=inv.coin;const sb=document.getElementById('scrollbadge');if(sb)sb.textContent=inv.scroll;const b=document.getElementById('bag');if(b&&!b.hidden&&typeof renderBag==='function')renderBag();const cp=document.getElementById('chp');if(cp&&!cp.hidden&&typeof renderChar==='function')renderChar()}
const isBorder=()=>false;
function pickTarget(){const [x,y]=target();
 for(const [a,b] of [[x,y],[Math.floor(P.x/T),Math.floor(P.y/T)]]){const t=map[b]&&map[b][a];
  if(t===TREE&&!isBorder(a,b))return{kind:'tree',o:treeAt[b*W+a]};if(t===ORE)return{kind:'ore',o:oreAt[b*W+a]}}return null}
function useToolHit(){const tg=D?null:pickTarget();
 if(P.tool==='sword'){if(tg)say('ดาบฟันของแข็งไม่เข้า — กด 2 ใช้ขวาน หรือ 3 ใช้ที่ขุดแร่');return}
 if(!tg)return;
 if(P.tool==='axe'){if(tg.kind==='tree')hitTree(tg.o);else say('แร่ต้องใช้ที่ขุดแร่ (กด 3)')}
 else{if(tg.kind==='ore')hitOre(tg.o);else say('ต้นไม้ต้องใช้ขวาน (กด 2)')}}
function hitTree(tr){const sh=window.FW&&FW.act(),dm=AXEDMG();if(sh)FW.send('t',tr,dm,120);tr.hp-=dm;tr.shake=.35;tr.bar=2;const sc=tr.sc;sfx('chop');
 for(let k=0;k<5;k++)fx.push({x:tr.px+(Math.random()-.5)*50*sc,y:tr.ty*T+28-55*sc,vx:(Math.random()-.5)*70,vy:-10-Math.random()*30,l:1,c:'80,170,70'});
 for(let k=0;k<4;k++)fx.push({x:tr.px+(Math.random()-.5)*10,y:tr.ty*T+22,vx:(Math.random()-.5)*110,vy:-60-Math.random()*50,l:.6,c:'170,120,60'});
 if(tr.hp<=0&&sh){tr.hp=1;say('รอเซิร์ฟเวอร์ตัดสิน...')}
 else if(tr.hp<=0){tr.alive=false;map[tr.ty][tr.tx]=STUMP;falling.push({tr,ft:0,dir:P.x<tr.px?1:-1,landed:false});say('ต้นไม้กำลังล้ม!');sfx('creak')}
 else say('ฟัน'+SZN[tr.size]+' เหลืออีก '+tr.hp+' ที')}
function hitOre(o){o.hp--;o.shake=.3;o.bar=2;sfx('mine');
 for(let k=0;k<6;k++)fx.push({x:o.tx*T+16+(Math.random()-.5)*20,y:o.ty*T+14,vx:(Math.random()-.5)*160,vy:-50-Math.random()*80,l:.5,c:'170,235,255'});
 if(o.hp<=0){map[o.ty][o.tx]=RUBBLE;o.regen=90;const n=2+Math.floor(Math.random()*2);for(let k=0;k<n;k++)addDrop('gem',o.tx*T+16,o.ty*T+16);say('ขุดแร่เพชรแตก! ได้เพชร +'+n)}
 else say('ขุดแร่เพชร... ความคืบหน้า '+Math.round((1-o.hp/o.max)*100)+'%')}
function updWorld(dt){
 const pr=Math.floor(P.y/T);
 for(const tr of trees){if(tr.shake>0)tr.shake-=dt;if(tr.bar>0)tr.bar-=dt;
  if(tr.alive){const by=tr.ty*T+28,sc=tr.sc,ov=tr.ty>pr&&Math.abs(P.x-tr.px)<34*sc+8&&(P.y-48)<by-24*sc&&P.y>by-92*sc;
   tr.fade+=((ov?1:0)-tr.fade)*Math.min(1,dt*10)}}
 for(const o of ores){if(o.shake>0)o.shake-=dt;if(o.bar>0)o.bar-=dt;
  if(map[o.ty][o.tx]===RUBBLE&&!(window.FW&&FW.act())){o.regen-=dt;if(o.regen<=0&&Math.hypot(P.x-(o.tx*T+16),P.y-(o.ty*T+16))>44){map[o.ty][o.tx]=ORE;o.hp=o.max}}}
 for(let i=falling.length-1;i>=0;i--){const f=falling[i];f.ft+=dt;
  if(!f.landed&&f.ft>=1.1){f.landed=true;const tr=f.tr,ex=tr.tx*T+16+f.dir*62*tr.sc,ey=tr.ty*T+28;
   if(f.own!==false){for(let k=0;k<tr.wood;k++)addDrop('wood',ex+(Math.random()-.5)*24,ey+(Math.random()-.5)*10);if(Math.random()<.3+tr.wood*.05)addDrop('apple',ex+(Math.random()-.5)*30,ey)}
   for(let k=0;k<14;k++)fx.push({x:ex+(Math.random()-.5)*60*tr.sc,y:ey-8,vx:(Math.random()-.5)*120,vy:-30-Math.random()*60,l:.8,c:'70,150,60'});
   say(f.own===false?('ต้นไม้ล้มแล้ว — ไม้เป็นของ '+(f.bn||'ผู้เล่นอื่น')):'ต้นไม้ล้มแล้ว! ได้ไม้ +'+tr.wood);sfx('thud')}
  if(f.ft>2.3)falling.splice(i,1)}
 for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t+=dt;
  if(d.z>0||d.vz>0){d.vz-=520*dt;d.z+=d.vz*dt;if(d.z<=0){d.z=0;d.vz=d.vz<-80?-d.vz*.35:0}}
  const fr=Math.pow(d.z>0?.6:.03,dt);d.vx*=fr;d.vy*=fr;d.x+=d.vx*dt;d.y+=d.vy*dt;
  const dx=P.x-d.x,dy=(P.y-8)-d.y,dist=Math.hypot(dx,dy)||1;
  if(d.t>.55&&dist<80&&(!window.dropOK7||dropOK7(d))){const sp=(260-dist*1.5+60)*dt;d.x+=dx/dist*sp;d.y+=dy/dist*sp}
  if(d.t>.35&&dist<14){{const ik=DROPMAP[d.type]||d.type;const cr=canTake(ik);if(cr!==true){noRoom(cr);continue}inv[ik]++;sfx(d.type==='coin'?'coin':(d.type==='gem'||d.type==='gold'||d.type==='silver')?'gem':'pop');if(window.logPick)logPick(ik);refreshInv();drops.splice(i,1)}}}}
function drawOres(x0,x1,y0,y1){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(map[y][x]===ORE){const o=oreAt[y*W+x];if(!o)continue;
 const sh=o.shake>0?Math.sin(o.shake*60)*2.5*(o.shake/.3):0;
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x*T+16,y*T+28,15,5,0,0,7);ctx.fill();
 const spr=oreSprite(o.kind);if(spr)ctx.drawImage(spr,x*T-5+sh,y*T-9,42,42);
 const n=Math.floor((1-o.hp/o.max)*6);ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=1;
 for(let i=0;i<n;i++){const cx=x*T+7+(i*5)%20,cy=y*T+4+(i*7)%14;ctx.beginPath();ctx.moveTo(cx+sh,cy);ctx.lineTo(cx+4+sh,cy+5);ctx.lineTo(cx+1+sh,cy+10);ctx.stroke()}}}
function drawFalling(){for(const f of falling){const tr=f.tr,sc=tr.sc,u=f.ft/1.1;let ang=Math.pow(Math.min(1,u),2.4)*1.5;if(u>1)ang+=Math.sin((u-1)*14)*.05*Math.exp(-(u-1)*5);
 ctx.save();ctx.globalAlpha=f.ft>1.7?Math.max(0,1-(f.ft-1.7)/.6):1;ctx.translate(tr.tx*T+16,tr.ty*T+28);ctx.rotate(f.dir*ang);
 ctx.drawImage(treeSpr[(tr.tx*7+tr.ty*13)%3],-40*sc,-94*sc,80*sc,100*sc);ctx.restore()}}
function drawBars(){const L=[];for(const t of trees)if(t.bar>0&&t.alive)L.push([t.tx,t.ty,t.hp/t.max]);for(const o of ores)if(o.bar>0&&map[o.ty][o.tx]===ORE)L.push([o.tx,o.ty,o.hp/o.max]);
 for(const [x,y,r] of L){ctx.fillStyle='#000b';ctx.fillRect(x*T+3,y*T+T+3,26,4);ctx.fillStyle=r>.5?'#7ed957':r>.25?'#ffc247':'#e84b4b';ctx.fillRect(x*T+4,y*T+T+4,24*r,2)}}
function drawDrops(){for(const d of drops){const px=Math.round(d.x),py=Math.round(d.y),yy=py-6-d.z;
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(px,py+2,5,2,0,0,7);ctx.fill();
 if(d.type==='coin'){const w=Math.abs(Math.cos(d.t*7+d.x))*5+1;ctx.fillStyle='#ffd23a';ctx.strokeStyle='#a8741a';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(px,yy,w,5,0,0,7);ctx.fill();ctx.stroke()}
 else if(d.type==='gel'){ctx.fillStyle='#5bb4ff';ctx.beginPath();ctx.ellipse(px,yy+1,5,4,0,0,7);ctx.fill();ctx.fillStyle='#d6eeff';ctx.fillRect(px-2,yy-2,2,2)}
 else if(d.type==='wood'){ctx.save();ctx.translate(px,yy);ctx.rotate(d.x*.3);ctx.fillStyle='#8a5a2e';ctx.fillRect(-7,-3,14,6);ctx.fillStyle='#d9b27a';ctx.fillRect(-7,-3,3,6);ctx.restore()}
 else{ctx.save();ctx.shadowColor='#6cf';ctx.shadowBlur=8;ctx.fillStyle='#5ec8ff';ctx.beginPath();ctx.moveTo(px-5,yy-3);ctx.lineTo(px+5,yy-3);ctx.lineTo(px,yy+6);ctx.closePath();ctx.fill();ctx.fillStyle='#d6f4ff';ctx.fillRect(px-3,yy-3,6,2);ctx.restore()}}}
