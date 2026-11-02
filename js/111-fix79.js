// fix79 (v4.70) — เจ้าของส่งรูปโมเดลฟาร์ม (เกษตรผสมผสาน) มาเป็นแบบ: ของตกแต่งชุดใหม่ + ปุ่ม “จัดฟาร์มตามแบบ”
//  · โรงเรือนหลังคาโค้งสีน้ำเงิน · เรือนกระจกเพาะชำ · กระท่อมมุงจาก · ต้นมะพร้าว · พุ่มไม้กลม · บ่อบัว · ทางเดินปูน · กำแพงปูน · ขอบอิฐ
//  · แปลงผักยกขอบปูนสีขาว (แก้สีขอบใน fix78) · จัดผังสำเร็จรูป: วางเฉพาะช่องที่ว่าง จ่ายวัตถุดิบตามราคาปกติ (ไม่แจกฟรี) ข้ามของที่ยังล็อก
try{
Object.assign(BLD,{
 shed78:{n:'โรงเรือนหลังคาโค้ง',w:4,h:3,c:{wood:30,ingot:8,coin:2500},ht:1,deco:1,lv77:2,d:'หลังคาลอนสีน้ำเงิน แบบฟาร์มต้นแบบ'},
 ghouse78:{n:'เรือนกระจกเพาะชำ',w:3,h:3,c:{wood:20,ingot:6,coin:3000},ht:1,deco:1,lv77:3,d:'โรงเรือนใส มีต้นกล้าอยู่ข้างใน'},
 hut78:{n:'กระท่อมมุงจาก',w:2,h:2,c:{wood:25,hay:4,coin:800},ht:0,deco:1,lv77:1,d:'กระท่อมไม้ไผ่ หลังคาจาก'},
 palm78:{n:'ต้นมะพร้าว',w:1,h:1,c:{wood:3,coin:150},ht:0,deco:1,lv77:1},
 bush78:{n:'พุ่มไม้กลม',w:1,h:1,c:{wood:2,coin:60},ht:0,deco:1,lv77:1},
 pond78:{n:'บ่อบัว',w:4,h:3,c:{ingSt:6,coin:2000},ht:0,deco:1,lv77:2,d:'บ่อน้ำมีใบบัวและดอกบัว'},
 cpath78:{n:'ทางเดินปูน',w:1,h:1,c:{coin:20},ht:0,deco:1,walk77:1,lv77:1,d:'เดินผ่านได้'},
 wall78:{n:'กำแพงปูน',w:1,h:1,c:{coin:40},ht:0,deco:1,lv77:1},
 brick78:{n:'ขอบอิฐ',w:1,h:1,c:{coin:25},ht:0,deco:1,lv77:1}});
// ทางเดินปูนวาดใต้ตัวละคร
{const _ho=homeObjects;homeObjects=function(){const r=_ho.apply(this,arguments);try{const Zm=ZCACHE[300];if(Zm)for(const o of Zm.ores)if(o.type==='bld'&&o.b.k==='cpath78')o.y=o.ty*T-2}catch(e){}return r};window.homeObjects=homeObjects}
const LG78=(y0,y1,a,b)=>{const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g};
const RB78=(x,y,r,a,b)=>{const g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);g.addColorStop(0,'#ffffff');g.addColorStop(.2,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()};
const SH78=(x,y,rx,ry)=>{ctx.fillStyle='rgba(20,30,10,.28)';ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill()};
function frond78(x,y,len,a,sw){ctx.save();ctx.translate(x,y);ctx.rotate(a+sw);ctx.strokeStyle='#3a7a2a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(len*.5,-len*.18,len,len*.22);ctx.stroke();
 ctx.strokeStyle='#5ab040';ctx.lineWidth=1.2;for(let i=2;i<10;i++){const u=i/10,px=len*u,py=-len*.18*4*u*(1-u)+len*.22*u*u;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+3,py+6);ctx.moveTo(px,py);ctx.lineTo(px+4,py-4);ctx.stroke()}ctx.restore()}
function draw78(b){const B=BLD[b.k],x=b.x*T,y=b.y*T,w=B.w*T,h=B.h*T,tm=performance.now()/1000;ctx.save();
 switch(b.k){
  case 'shed78':{SH78(x+w/2,y+h-2,w/2+4,7);ctx.fillStyle=LG78(y+h*.4,y+h,'#e4e4dc','#b0b0a8');ctx.fillRect(x+2,y+h*.45,w-4,h*.55-2);ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(x+2,y+h-4,w-4,2);
   for(const px of [x+6,x+w/3,x+w*2/3-3,x+w-10])ctx.fillStyle='#d8c8a8',ctx.fillRect(px,y+h*.05,4,h*.92);
   ctx.fillStyle='#5a8a3a';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(x+14+i*18,y+h-12,4,0,7);ctx.fill()}
   const ry=y+h*.08,rh=h*.42;const g=ctx.createLinearGradient(0,ry-rh,0,ry+rh*.3);g.addColorStop(0,'#6a8ae8');g.addColorStop(.5,'#2a4ab8');g.addColorStop(1,'#16286a');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-4,ry+rh*.3);ctx.quadraticCurveTo(x-4,ry-rh,x+w/2,ry-rh);ctx.quadraticCurveTo(x+w+4,ry-rh,x+w+4,ry+rh*.3);ctx.closePath();ctx.fill();
   ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=1;for(let i=1;i<w/4;i++){const px=x-4+i*4;const t=(px-x+4)/(w+8),yy=ry+rh*.3-(rh*1.3)*(1-Math.pow(2*t-1,2))*.95;ctx.beginPath();ctx.moveTo(px,ry+rh*.3);ctx.lineTo(px,yy);ctx.stroke()}
   ctx.fillStyle='#e8e8f0';ctx.fillRect(x-4,ry+rh*.3,w+8,2.5);break}
  case 'ghouse78':{SH78(x+w/2,y+h-2,w/2+3,6);ctx.fillStyle='#c8b890';ctx.fillRect(x+3,y+h-8,w-6,6);ctx.fillStyle='rgba(220,240,255,.45)';ctx.fillRect(x+4,y+h*.3,w-8,h*.7-8);
   ctx.fillStyle='#6ac84a';for(let r=0;r<2;r++)for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(x+12+i*(w-24)/4,y+h-16-r*12,3.2,0,7);ctx.fill()}
   ctx.fillStyle='rgba(235,248,255,.6)';ctx.beginPath();ctx.moveTo(x,y+h*.32);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w,y+h*.32);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.strokeRect(x+4,y+h*.3,w-8,h*.7-8);ctx.beginPath();ctx.moveTo(x,y+h*.32);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w,y+h*.32);ctx.stroke();
   ctx.lineWidth=1;for(let i=1;i<6;i++){const px=x+4+i*(w-8)/6;ctx.beginPath();ctx.moveTo(px,y+h*.3);ctx.lineTo(px,y+h-8);ctx.stroke()}ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h*.3);ctx.stroke();
   ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x+8,y+h*.34,6,h*.5);ctx.fillStyle='#c8a868';ctx.fillRect(x+w/2-5,y+h-22,10,14);break}
  case 'hut78':{SH78(x+w/2,y+h-2,w/2+3,6);for(const px of [x+5,x+w-9])ctx.fillStyle='#7a5a30',ctx.fillRect(px,y+h*.45,4,h*.55-2);
   ctx.fillStyle=LG78(y+h*.25,y+h*.7,'#d8b878','#a8884a');ctx.fillRect(x+6,y+h*.3,w-12,h*.4);ctx.strokeStyle='rgba(90,60,20,.4)';ctx.lineWidth=1;for(let i=0;i<8;i++){const px=x+8+i*(w-16)/7;ctx.beginPath();ctx.moveTo(px,y+h*.3);ctx.lineTo(px,y+h*.7);ctx.stroke()}
   ctx.fillStyle='#8a6a3a';ctx.fillRect(x+4,y+h*.7,w-8,4);ctx.fillStyle='#4a3010';ctx.fillRect(x+w/2-6,y+h*.4,12,h*.3);
   const g=LG78(y-14,y+h*.35,'#e8c880','#9a7030');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-6,y+h*.38);ctx.lineTo(x+w/2,y-14);ctx.lineTo(x+w+6,y+h*.38);ctx.closePath();ctx.fill();
   ctx.strokeStyle='rgba(120,80,20,.55)';for(let i=0;i<16;i++){const px=x-6+i*(w+12)/15;ctx.beginPath();ctx.moveTo(px,y+h*.38+2);ctx.lineTo(x+w/2+(px-x-w/2)*.25,y-10);ctx.stroke()}
   ctx.fillStyle='rgba(255,240,190,.5)';for(let i=0;i<14;i++)ctx.fillRect(x-6+i*(w+12)/14,y+h*.38,2,3);break}
  case 'palm78':{const cx=x+16,gy=y+28,sw=Math.sin(tm*1.1+b.x)*.06;SH78(cx+6,gy,14,4);ctx.strokeStyle='#8a6a40';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx,gy);ctx.quadraticCurveTo(cx+8,gy-34,cx+4,gy-62);ctx.stroke();
   ctx.strokeStyle='rgba(60,40,15,.45)';ctx.lineWidth=1;for(let i=1;i<10;i++){const u=i/10,px=cx+16*u*(1-u)+4*u*u,py=gy-62*u;ctx.beginPath();ctx.moveTo(px-2.5,py);ctx.lineTo(px+2.5,py);ctx.stroke()}
   const tx=cx+4,ty=gy-62;for(let i=0;i<8;i++){const a=i/8*6.28;frond78(tx,ty,22,a<Math.PI?a-Math.PI:a-Math.PI,sw)}for(let i=0;i<8;i++)frond78(tx,ty,24,-Math.PI+i/7*Math.PI,sw);
   RB78(tx-3,ty+3,3,'#8a6a30','#3a2808');RB78(tx+3,ty+4,3,'#8a6a30','#3a2808');RB78(tx,ty+6,3,'#9a7a3a','#3a2808');break}
  case 'bush78':{SH78(x+16,y+28,12,4);ctx.fillStyle='#6a4422';ctx.fillRect(x+15,y+20,3,8);RB78(x+16,y+12,11,'#4ab03a','#1a5018');RB78(x+12,y+8,5,'#6ad050','#2a7a22');break}
  case 'pond78':{ctx.fillStyle=LG78(y,y+h,'#c8c4b8','#8a8678');ctx.beginPath();ctx.roundRect(x+1,y+3,w-2,h-4,10);ctx.fill();ctx.fillStyle=LG78(y,y+h,'#2e5a3a','#163a22');ctx.beginPath();ctx.roundRect(x+5,y+7,w-10,h-14,8);ctx.fill();
   ctx.strokeStyle='rgba(180,230,200,.25)';ctx.lineWidth=1;for(let i=0;i<3;i++){const r=(tm*12+i*14)%40;ctx.beginPath();ctx.ellipse(x+w*.62,y+h*.55,r,r*.4,0,0,7);ctx.stroke()}
   const P8=[[.2,.3],[.35,.6],[.55,.3],[.75,.65],[.85,.3],[.15,.7],[.6,.75]];for(const [u,v] of P8){const px=x+5+u*(w-10),py=y+7+v*(h-14);ctx.fillStyle='#5ab040';ctx.beginPath();ctx.moveTo(px,py);ctx.ellipse(px,py,7,4.5,0,.4,6.1);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,255,.2)';ctx.beginPath();ctx.ellipse(px-1.5,py-1,3,1.5,0,0,7);ctx.fill()}
   for(const [u,v] of [[.36,.55],[.78,.6]]){const px=x+5+u*(w-10),py=y+7+v*(h-14)-3;for(let i=0;i<6;i++){const a=i/6*6.28;ctx.fillStyle=i%2?'#ffb0d0':'#ff7ab0';ctx.beginPath();ctx.ellipse(px+Math.cos(a)*2.5,py+Math.sin(a)*1.5,2.6,1.4,a,0,7);ctx.fill()}ctx.fillStyle='#ffe060';ctx.beginPath();ctx.arc(px,py,1.3,0,7);ctx.fill()}break}
  case 'cpath78':{ctx.fillStyle=LG78(y,y+T,'#d8d8d0','#b4b4ac');ctx.fillRect(x,y+1,T,T-2);ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(x,y+T-2,T,1);ctx.fillRect(x+T-1,y,1,T);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x,y+1,T,1);break}
  case 'wall78':{SH78(x+16,y+30,16,3);ctx.fillStyle=LG78(y+2,y+30,'#e8e8e0','#a8a8a0');ctx.fillRect(x,y+2,T,28);ctx.fillStyle='#f6f6f0';ctx.fillRect(x,y,T,4);ctx.fillStyle='rgba(0,0,0,.1)';ctx.fillRect(x,y+16,T,1);break}
  case 'brick78':{ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(x,y+26,T,4);for(let r=0;r<2;r++)for(let i=-1;i<3;i++){const bx=x+i*12+(r?6:0);ctx.fillStyle=(i+r)%2?'#b85a3a':'#a84a2e';ctx.fillRect(Math.max(x,bx),y+16+r*6,Math.min(11,x+T-Math.max(x,bx)),5)}ctx.fillStyle='#d8d0c0';ctx.fillRect(x,y+14,T,2);break}}
 ctx.restore()}
const lockLv78=lv=>flv77()<(lv|0);
const K78=['shed78','ghouse78','hut78','palm78','bush78','pond78','cpath78','wall78','brick78'];
{const _db=drawBuild;drawBuild=function(b,o){if(b&&K78.includes(b.k)){try{draw78(b)}catch(e){try{ctx.restore()}catch(_){}}return}return _db.apply(this,arguments)};window.drawBuild=drawBuild}
// ---------- ผังฟาร์มต้นแบบ ----------
function plan78(){const L=[],till=[];const add=(k,x,y)=>L.push({k,x,y});const row=(k,x0,x1,y,st)=>{for(let x=x0;x<=x1;x+=(st||1))add(k,x,y)};const col=(k,x,y0,y1)=>{for(let y=y0;y<=y1;y++)add(k,x,y)};const plot=(x0,x1,y0,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)till.push([x,y])};
 add('shed78',3,10);row('bush78',9,15,10,2);row('bush78',9,15,12,2);add('palm78',17,11);add('palm78',24,10);add('ghouse78',27,10);plot(31,44,10,13);
 row('cpath78',3,20,15);row('cpath78',23,45,15);col('cpath78',24,16,25);
 add('hut78',13,18);add('palm78',11,18);add('palm78',16,18);add('pond78',15,21);
 for(const [x0,y0] of [[26,18],[31,18],[36,18],[26,22],[31,22],[36,22]])plot(x0,x0+3,y0,y0+1);
 plot(3,10,18,23);col('brick78',2,17,24);row('brick78',3,10,24);
 row('pfence77',3,20,27);row('pfence77',23,40,27);col('wall78',46,10,27);
 return {L:L.filter(o=>BLD[o.k]),till}}
function free78(x,y){const Zm=ZCACHE[300];if(!Zm)return false;if(occ(x,y))return false;const t=HOME.tiles[x+','+y];if(t&&t.till)return false;if(x>=HLOT.x-1&&x<HLOT.x+HLOT.w+1&&y>=HLOT.y&&y<HLOT.y+HLOT.h+1)return false;return true}
function preset78(go){if(!(D&&D.home)){say('ไปที่ที่ดินผู้กล้าก่อนนะ');return}const {L,till}=plan78(),ht=HOME.tools.hamr|0,cost={},ok=[],skip={lock:0,busy:0,ham:0},claim=new Set();
 for(const o of L){const B=BLD[o.k];if(lockLv78(B.lv77)){skip.lock++;continue}if(ht<(B.ht|0)){skip.ham++;continue}let f=true;for(let y=o.y;y<o.y+B.h&&f;y++)for(let x=o.x;x<o.x+B.w;x++)if(!free78(x,y)||claim.has(x+','+y)){f=false;break}
  if(!f){skip.busy++;continue}for(let y=o.y;y<o.y+B.h;y++)for(let x=o.x;x<o.x+B.w;x++)claim.add(x+','+y);ok.push(o);for(const [k,v] of Object.entries(B.c))cost[k]=(cost[k]|0)+v}
 const T2=till.filter(([x,y])=>free78(x,y)&&!claim.has(x+','+y));
 if(!go){const txt='🏡 จัดฟาร์มตามแบบ “เกษตรผสมผสาน” (โรงเรือนหลังคาโค้ง เรือนกระจก กระท่อมมุงจาก บ่อบัว ต้นมะพร้าว แปลงผักขอบปูน รั้วขาว ทางเดินปูน)\nจะวาง '+ok.length+' ชิ้น + ขุดแปลง '+T2.length+' ช่อง (ฟรี) · วางเฉพาะที่ว่าง'+(skip.busy?' · ข้าม '+skip.busy+' ชิ้น (ที่ไม่ว่าง)':'')+(skip.lock?' · ยังล็อก '+skip.lock+' ชิ้น (ระดับฟาร์มไม่ถึง)':'')+(skip.ham?' · ค้อนไม่ถึง '+skip.ham+' ชิ้น':'')+'\nราคารวม: '+Object.entries(cost).map(([k,v])=>(k==='coin'?'🪙':MN(k)+' ')+v.toLocaleString()).join(' · ');
  talk(RANCHER,txt,[...(ok.length||T2.length?[{t:costOK(cost)?'🔨 จัดเลย':'❌ วัตถุดิบไม่พอ',c:'go',f:()=>preset78(1)}]:[]),BYE],'🏡 ฟาร์มต้นแบบ');return}
 if(!costOK(cost)){say('วัตถุดิบไม่พอ: '+Object.entries(cost).filter(([k,v])=>(k==='coin'?inv.coin:(inv[k]|0))<v).map(([k,v])=>(k==='coin'?'🪙':MN(k))+' '+v).join(' · '));sfx('thud');return}
 payCost(cost);for(const o of ok)HOME.builds.push({k:o.k,x:o.x,y:o.y});for(const [x,y] of T2){const k=x+','+y,t=HOME.tiles[k]||(HOME.tiles[k]={});t.till=1}
 for(const [x,y] of T2)homePaintTile(x,y);homeObjects();saveHome();sfx('chest');try{fanfare()}catch(e){}shake(2,.3);banner('🏡 ฟาร์มต้นแบบเสร็จแล้ว!','วาง '+ok.length+' ชิ้น · แปลงผัก '+T2.length+' ช่อง','green')}
window.preset78=preset78;
// ปุ่มในหน้าต่างสร้าง (แท็บตกแต่ง) + เมนูลุงบุญมี
{const _rl=renderLife;renderLife=function(){const r=_rl.apply(this,arguments);try{if(LIFE.tab==='deco'&&D&&D.home){const lb=lifeEl.querySelector('.lb');if(lb)lb.insertAdjacentHTML('afterbegin','<div class="it" style="grid-column:1/-1;border-color:#9ee86a"><b>🏡 จัดฟาร์มตามแบบ “เกษตรผสมผสาน”</b><small>วางโรงเรือน เรือนกระจก กระท่อม บ่อบัว ต้นมะพร้าว แปลงผักขอบปูน รั้ว ทางเดิน ให้อัตโนมัติ (เฉพาะที่ว่าง · จ่ายตามราคาปกติ)</small><button onclick="closeLife();preset78()">🏡 ดูราคาและจัด</button></div>')}}catch(e){}return r};window.renderLife=renderLife}
}catch(e){console.warn('fix79',e)}
