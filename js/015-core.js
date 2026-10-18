// ===== v2.1 : 6 ระดับ หิน→เหล็ก→ทองแดง→เงิน→ทอง→เพชร · ชุดอัศวินทรงเดียวกันทุกระดับ (เปลี่ยนแค่วัสดุ/สี) =====
// ภาพไอคอน (ร้าน/กระเป๋า/ช่องลัด/ในมือ) และชุดที่สวมบนตัวละคร ใช้ชุดสีเดียวกันและทรงเดียวกัน
const TIERS=[
 {k:'stone',  hi:'#d9dbe0',mid:'#9a9da5',lo:'#5c5f67',dk:'#2b2d33',gl:'#aab4c0',gd:'#6e727b',gr:'#5a3b22',pm:'#8a8d96',cloth:'#8a8d95',pants:'#666a72',tr:'rgba(200,205,215,.5)'},
 {k:'iron',   hi:'#f2f5fa',mid:'#aab4c5',lo:'#5d6779',dk:'#262b38',gl:'#c8d6ee',gd:'#7a8090',gr:'#2a1e14',pm:'#9aa3b5',cloth:'#8a909c',pants:'#5e6470',tr:'rgba(200,215,240,.55)'},
 {k:'copper', hi:'#ffd9b0',mid:'#d98443',lo:'#7a3b16',dk:'#3a1a08',gl:'#e0803a',gd:'#a0612f',gr:'#2a1608',pm:'#f0a56a',cloth:'#c0743a',pants:'#8a4f26',tr:'rgba(240,140,70,.55)'},
 {k:'silver', hi:'#ffffff',mid:'#cfd7e6',lo:'#7d869b',dk:'#30364a',gl:'#d6e2ff',gd:'#b8c0d0',gr:'#22242c',pm:'#eaf0ff',cloth:'#c8d0e0',pants:'#8f98ab',tr:'rgba(225,235,255,.55)'},
 {k:'gold',   hi:'#fff6b8',mid:'#f2c230',lo:'#9a6f0e',dk:'#4a3406',gl:'#ffd23a',gd:'#d6a82a',gr:'#2a1d08',pm:'#ffd23a',cloth:'#f2c230',pants:'#b8901e',tr:'rgba(255,215,70,.55)'},
 {k:'diamond',hi:'#e6fbff',mid:'#5ec8ff',lo:'#1f5fc4',dk:'#0e2a5c',gl:'#2f8bff',gd:'#7fb8ee',gr:'#10182c',pm:'#5db0ff',cloth:'#5ec8ff',pants:'#2f7fd6',tr:'rgba(90,170,255,.55)'}];
const KINDS={sword:'ดาบ',axe:'ขวาน',pick:'ที่ขุดแร่',helm:'หมวก',chest:'เสื้อเกราะ',pants:'กางเกง',arm:'เกราะแขน',neck:'สร้อย',ring:'แหวน'};
const TNAMES=['หินธรรมดา','เหล็ก','ทองแดง','เงิน','ทอง','เพชร'];
const SWATK=[0,2,3,5,8,12],ADEF={helm:[1,2,3,4,5,7],chest:[2,3,5,6,8,11],pants:[1,2,3,4,5,7],arm:[1,1,2,3,4,6]},NECKHP=[6,12,20,30,45,70],RINGATK=[0,1,2,3,4,6];
const MATKEY=['ingSt','ingot','ingCu','ingAg','ingAu','ingDm'],MATN=['แท่งหิน','แท่งเหล็ก','แท่งทองแดง','แท่งเงิน','แท่งทอง','แท่งเพชร'];
const RECIPE={sword:{m:3,wood:1},axe:{m:3,wood:2},pick:{m:3,wood:2},helm:{m:3,wood:0},chest:{m:5,wood:0},pants:{m:4,wood:0},arm:{m:3,wood:0},neck:{m:2,wood:0},ring:{m:1,wood:0}};
const RMULT=[1,1,1,1,1,1];
const need_m=(k,t)=>RECIPE[k].m*RMULT[t];
const BESTORE=['เหล็ก','ทองแดง','เงิน','ทอง','เพชร','เพชร'];
const ITEMS={},GEAR={},ENH={};
for(let t=0;t<6;t++)for(const k in KINDS){const tool=k==='sword'||k==='axe'||k==='pick',id=k+t;
 ITEMS[id]={id,kind:k,tier:t,tool,name:KINDS[k]+TNAMES[t],
  stat:k==='sword'?'โจมตี +'+SWATK[t]:k==='axe'?'ตัดไม้แรงขึ้น (ตีต้นไม้ '+(1+(t>>1))+' หน่วย/ที)':k==='pick'?'ขุดแร่ได้ถึงแร่'+BESTORE[t]+' · แรงขุด '+(1+(t>>1)):k==='neck'?'เลือดสูงสุด +'+NECKHP[t]:k==='ring'?'โจมตี +'+RINGATK[t]:'ป้องกัน +'+ADEF[k][t]}}
Object.assign(inv,{stone:0,iron:0,copper:0,silver:0,gold:0,ingSt:0,ingCu:0,ingAg:0,ingAu:0,ingDm:0,coal:0,bread:0,apple:0});
Object.assign(P,{tier:{sword:0,axe:0,pick:0},armor:{sword:null,helm:null,chest:null,pants:null,arm:null,neck:null,ring:null},draw:false,bagLv:0,fa:100,hu:100,sp:0,stats:{str:0,vit:0,int:0,agi:0,end:0}});
const DROPMAP={gem:'ore'};
// ชุดเริ่มต้นสำหรับทดสอบ (ดาบ/ขวาน/ที่ขุดแร่หินธรรมดา) · เปิดเกมจริงให้ใส่ ?real=1 ท้าย URL → ตัวละครไม่มีอะไรเลย
const TESTKIT=/[?&]devtest=1(&|$)/.test(location.search);
if(TESTKIT){P.armor.sword='sword0';GEAR.axe0=1;GEAR.pick0=1}
const syncSword=()=>{P.tier.sword=P.armor.sword?ITEMS[P.armor.sword].tier:0};
const ringAtk=()=>{const id=P.armor.ring;return id?RINGATK[ITEMS[id].tier]+(window.enhX7?enhX7(id):0):0},neckHp=()=>{const id=P.armor.neck;return id?NECKHP[ITEMS[id].tier]+(window.enhX7?enhX7(id):0):0};
const armorDef=()=>{let d=0;for(const k of ['helm','chest','pants','arm']){const id=P.armor[k];if(id){const it=ITEMS[id];d+=ADEF[k][it.tier]+(window.enhDef?enhDef(ENH[id]||0):(ENH[id]||0)>>1)}}return d};
const PICKDMG=()=>1+(P.tier.pick>>1)+(window.enhT7?enhT7('pick'):0),AXEDMG=()=>1+(P.tier.axe>>1)+(window.enhT7?enhT7('axe'):0);
function EQCOL(){const a=P.armor,ch=a.chest&&ITEMS[a.chest],pa=a.pants&&ITEMS[a.pants];
 return{BLK:pa?TIERS[pa.tier].pants:'#14141a',LEG2:pa?TIERS[pa.tier].lo:'#0b0b10',TOP:ch?TIERS[ch.tier].cloth:'#262631',COLLAR:ch?TIERS[ch.tier].lo:'#0b0b10',HAIR:'#14141a'}}
const PLUME=['#a82a22','#d9483c','#ff8070'];
// ================= ชุดที่สวมบนตัวละคร: ใช้ภาพต้นแบบเดียวกับในกระเป๋า (วาดจากฟังก์ชันเดียวกัน) =================
const SPRC={};
function eqSpr(kind,tier,view){const key=kind+tier+view;if(SPRC[key])return SPRC[key];const c=document.createElement('canvas');c.width=c.height=64;const k=c.getContext('2d');const Q=TIERS[tier];
 if(kind==='helm')paintHelm(k,Q,tier,view);else if(kind==='chest')paintChest(k,Q,tier,view);else if(kind==='arm')paintArm(k,Q,tier);else if(kind==='neck')paintNeck(k,Q,tier);else paintPants(k,Q,tier);return SPRC[key]=c}
function drawHelm(R,x,by,side,f,d){const id=P.armor.helm;if(!id)return;const t=ITEMS[id].tier,v=d==='u'?'back':side?'side':'front',s=.4,w=Math.round(64*s),dy=Math.round(by-46-8*s);
 if(v==='side'&&f<0){ctx.save();ctx.translate(Math.round(x),0);ctx.scale(-1,1);ctx.drawImage(eqSpr('helm',t,v),-Math.round(34*s)+1,dy,w,w);ctx.restore()}
 else ctx.drawImage(eqSpr('helm',t,v),Math.round(x-(v==='side'?34*s-1:32*s)),dy,w,w)}
function drawChest(R,x,by,side,f,d){const id=P.armor.chest;if(!id)return;const t=ITEMS[id].tier;
 if(side){ctx.drawImage(eqSpr('chest',t,'side'),Math.round(x-16),Math.round(by-36),32,28)}
 else ctx.drawImage(eqSpr('chest',t,d==='u'?'back':'front'),Math.round(x-17.6),Math.round(by-36),35,28)}
function kneeFront(R,x,by,l1,l2){const id=P.armor.pants;if(!id)return;const t=ITEMS[id].tier,sp=eqSpr('pants',t,'front');
 ctx.drawImage(sp,12,20,21,40,Math.round(x-8),Math.round(by-13-l1),8,14);ctx.drawImage(sp,31,20,21,40,Math.round(x),Math.round(by-13-l2),8,14)}
function kneeSide(R,x,by,s,f){const id=P.armor.pants;if(!id)return;const t=ITEMS[id].tier,sp=eqSpr('pants',t,'front');
 for(const px of [x-3-s*6*f,x-3+s*6*f])ctx.drawImage(sp,22,20,20,40,Math.round(px-1),Math.round(by-13),8,14)}
// ================= ไอคอนของ (ใช้ซ้ำทุกที่) — วาดแบบมีมิติ: ไล่เฉด ขอบ ประกาย พื้นผิวตามวัสดุ =================
const TICON={};
function toolIcon(type,tier,sz){sz=sz||64;const key=type+tier+'_'+sz;return TICON[key]||(TICON[key]=iconCanvasT(type,sz,tier))}
function iconCanvas(type,sz,tier){return iconCanvasT(type,sz||64,tier|0)}
function iconCanvasT(type,sz,tier){const c=document.createElement('canvas');c.width=c.height=sz;const k=c.getContext('2d');k.scale(sz/64,sz/64);paintItem(k,type,tier);return c}
const OL='#14161e';
function texture(k,Q,t,seed){
 if(t===0){for(let i=0;i<80;i++){const x=hash(i,seed)*64,y=hash(seed,i+9)*64,r=.5+hash(i,3)*1.6;k.fillStyle=hash(i,5)>.5?'rgba(255,255,255,.17)':'rgba(10,10,22,.24)';k.beginPath();k.arc(x,y,r,0,7);k.fill()}
  k.strokeStyle='rgba(15,15,25,.55)';k.lineWidth=.9;for(let i=0;i<4;i++){let x=10+hash(i,seed+1)*44,y=6+hash(i,seed+2)*24;k.beginPath();k.moveTo(x,y);for(let j=0;j<3;j++){x+=(hash(i,j+4)-.5)*10;y+=5+hash(j,i)*6;k.lineTo(x,y)}k.stroke()}
  k.fillStyle='rgba(105,150,78,.38)';for(let i=0;i<4;i++){k.beginPath();k.arc(6+hash(i,seed+7)*52,40+hash(seed,i)*22,1.6+hash(i,9)*2.6,0,7);k.fill()}}
 else{const g=k.createLinearGradient(0,0,64,64);g.addColorStop(0,'rgba(255,255,255,.32)');g.addColorStop(.38,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.28)');k.fillStyle=g;k.fillRect(0,0,64,64);
  k.strokeStyle='rgba(255,255,255,.08)';k.lineWidth=1;for(let i=0;i<14;i++){const y=hash(i,seed)*64;k.beginPath();k.moveTo(0,y);k.lineTo(64,y+hash(i,2)*6-3);k.stroke()}
  if(t===2){k.fillStyle='rgba(70,170,140,.22)';for(let i=0;i<5;i++){k.beginPath();k.arc(hash(i,seed+3)*64,36+hash(seed,i+1)*28,1.5+hash(i,8)*3,0,7);k.fill()}}
  if(t===4){const g2=k.createLinearGradient(0,40,64,10);g2.addColorStop(0,'rgba(255,255,200,0)');g2.addColorStop(.5,'rgba(255,255,220,.38)');g2.addColorStop(1,'rgba(255,255,200,0)');k.fillStyle=g2;k.fillRect(0,0,64,64)}
  if(t===5){k.strokeStyle='rgba(255,255,255,.45)';k.lineWidth=.9;for(let i=0;i<7;i++){k.beginPath();k.moveTo(hash(i,seed)*64,hash(seed,i)*64);k.lineTo(hash(i,seed+5)*64,hash(seed+5,i)*64);k.stroke()}}
  if(t>=3){const n=t-1;for(let i=0;i<n;i++){const x=10+hash(i,seed+11)*44,y=8+hash(seed+3,i)*46,r=2.2+hash(i,seed)*2+(t-3)*.8;
   k.fillStyle='rgba(255,255,255,.9)';k.beginPath();k.moveTo(x,y-r*1.6);k.lineTo(x+r*.28,y-r*.28);k.lineTo(x+r*1.6,y);k.lineTo(x+r*.28,y+r*.28);k.lineTo(x,y+r*1.6);k.lineTo(x-r*.28,y+r*.28);k.lineTo(x-r*1.6,y);k.lineTo(x-r*.28,y-r*.28);k.closePath();k.fill()}}}}
// วาดชิ้นส่วน: ไล่เฉดวัสดุ + พื้นผิว + เส้นขอบ + ไฮไลท์ขอบบน
function part(k,Q,t,path,seed,x0,y0,x1,y1){const g=k.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,Q.hi);g.addColorStop(.45,Q.mid);g.addColorStop(1,Q.lo);
 k.save();if(t>=3){k.shadowColor=Q.gl;k.shadowBlur=t===5?8:t===4?6:4}k.fillStyle=g;path();k.fill();k.restore();
 k.save();path();k.clip();texture(k,Q,t,seed);k.restore();
 k.strokeStyle=OL;k.lineWidth=1.8;k.lineJoin='round';path();k.stroke();
 k.save();path();k.clip();k.strokeStyle='rgba(255,255,255,.28)';k.lineWidth=1.2;k.translate(.8,.8);path();k.stroke();k.restore()}
function lashing(k,x,y,w){k.strokeStyle='#8a6a3a';k.lineWidth=1.6;for(let i=0;i<4;i++){k.beginPath();k.moveTo(x,y+i*2.6);k.lineTo(x+w,y+i*2.6+1.4);k.stroke()}k.strokeStyle='#3a2a14';k.lineWidth=.7;for(let i=0;i<4;i++){k.beginPath();k.moveTo(x,y+i*2.6+1);k.lineTo(x+w,y+i*2.6+2.4);k.stroke()}}
function paintItem(k,type,t){const Q=TIERS[t];k.lineJoin='round';
 const wood=(x0,y0,w,h)=>{const g=k.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,'#5a3a1e');g.addColorStop(.45,'#a87a4a');g.addColorStop(1,'#46291a');k.fillStyle=g;k.fillRect(x0,y0,w,h);k.strokeStyle='rgba(30,16,6,.45)';k.lineWidth=.8;for(let i=0;i<5;i++){const yy=y0+4+i*(h/5);k.beginPath();k.moveTo(x0,yy);k.lineTo(x0+w,yy+2);k.stroke()}k.strokeStyle=OL;k.lineWidth=1.6;k.strokeRect(x0,y0,w,h)};
 if(type==='axe'){wood(29,14,7,48);k.fillStyle='#2e1c10';k.fillRect(29,45,7,11);k.strokeStyle=OL;k.lineWidth=1.4;k.strokeRect(29,45,7,11);k.fillStyle='#7a5430';for(let i=0;i<3;i++)k.fillRect(29,47+i*3,7,1);k.fillStyle='#46291a';k.fillRect(28,60,9,3);
  const path=()=>{k.beginPath();k.moveTo(28,10);k.lineTo(41,10);k.lineTo(41,16);k.lineTo(45,16);k.lineTo(45,26);k.lineTo(41,26);k.lineTo(41,31);k.lineTo(28,31);k.lineTo(15,38);k.quadraticCurveTo(2,22,15,3);k.closePath()};
  part(k,Q,t,path,3,4,4,44,36);k.fillStyle='rgba(20,26,40,.35)';k.fillRect(28,10,13,21);
  k.strokeStyle='rgba(255,255,255,.75)';k.lineWidth=1.5;k.beginPath();k.moveTo(15,37);k.quadraticCurveTo(3.5,22,15,4);k.stroke();
  if(t===0)lashing(k,28,11,13);else{k.fillStyle=Q.gd;k.fillRect(30,7,5,5);k.strokeStyle=OL;k.lineWidth=1.2;k.strokeRect(30,7,5,5)}}
 else if(type==='pick'){wood(29,16,6,46);k.fillStyle='#46291a';k.fillRect(28,60,8,3);
  const path=()=>{k.beginPath();k.moveTo(3,26);k.quadraticCurveTo(32,-2,61,26);k.lineTo(55,27);k.quadraticCurveTo(32,10,9,27);k.closePath()};
  part(k,Q,t,path,4,4,6,60,26);k.fillStyle='#2a2f3a';k.fillRect(27,14,10,6);k.strokeStyle=OL;k.lineWidth=1.2;k.strokeRect(27,14,10,6);
  k.strokeStyle='rgba(255,255,255,.6)';k.lineWidth=1;k.beginPath();k.moveTo(10,22);k.quadraticCurveTo(32,3,54,22);k.stroke();
  if(t===0)lashing(k,27,14,10);else{k.fillStyle=Q.hi;k.fillRect(29,15,6,1.5)}}
 else if(type==='sword'){
  const blade=()=>{k.beginPath();if(t===0){k.moveTo(32,1);k.lineTo(36,6);k.lineTo(37,14);k.lineTo(35.5,22);k.lineTo(37,30);k.lineTo(36.5,41);k.lineTo(27.5,41);k.lineTo(27,31);k.lineTo(28.5,22);k.lineTo(27,13);k.lineTo(28,6)}else{k.moveTo(32,.5);k.lineTo(36.5,7.5);k.lineTo(36.5,41);k.lineTo(27.5,41);k.lineTo(27.5,7.5)}k.closePath()};
  part(k,Q,t,blade,5,27,2,37,41);
  k.strokeStyle=t===0?'rgba(30,32,40,.45)':Q.lo;k.lineWidth=1.6;k.beginPath();k.moveTo(32,9);k.lineTo(32,37);k.stroke();k.strokeStyle='rgba(255,255,255,.6)';k.lineWidth=.9;k.beginPath();k.moveTo(33,10);k.lineTo(33,36);k.stroke();
  const guard=()=>{k.beginPath();if(t===0){k.rect(23,41,18,4.5)}else{k.moveTo(20.5,42);k.quadraticCurveTo(24,39.5,29,41);k.lineTo(35,41);k.quadraticCurveTo(40,39.5,43.5,42);k.lineTo(41.5,46.5);k.lineTo(22.5,46.5);k.closePath()}};
  const gq=t===0?{hi:'#8a5a30',mid:'#6a4322',lo:'#3a2412'}:{hi:Q.hi,mid:Q.gd,lo:Q.lo};part(k,gq,t===0?1:t,guard,6,21,40,43,47);
  if(t>=3){k.fillStyle=t===5?'#e63a3a':t===4?'#4fd6ff':'#e63a3a';k.beginPath();k.arc(32,43.8,1.8,0,7);k.fill();k.strokeStyle=OL;k.lineWidth=.7;k.stroke()}
  const gg=k.createLinearGradient(30,0,34,0);gg.addColorStop(0,'#2a1a10');gg.addColorStop(.5,t===0?'#6a4a28':'#3a2616');gg.addColorStop(1,'#1a0e08');k.fillStyle=gg;k.fillRect(30,46.5,4,11);k.strokeStyle=OL;k.lineWidth=1;k.strokeRect(30,46.5,4,11);
  k.strokeStyle=t===0?'#b89a62':Q.gd;k.lineWidth=1;for(let i=0;i<4;i++){k.beginPath();k.moveTo(30,48.5+i*2.6);k.lineTo(34,50+i*2.6);k.stroke()}
  part(k,gq,t===0?1:t,()=>{k.beginPath();k.arc(32,59.8,3.6,0,7)},7,28,56,36,64)}
 else if(type==='helm')paintHelm(k,Q,t);
 else if(type==='chest')paintChest(k,Q,t);
 else if(type==='pants')paintPants(k,Q,t);
 else if(type==='arm')paintArm(k,Q,t);else if(type==='neck')paintNeck(k,Q,t);else if(type==='ring')paintRing(k,Q,t)}
// ---- หมวกอัศวิน (ทรงเดียวกันทุกระดับ · มุมมอง front/side/back ใช้ตัวเดียวกับที่สวมบนตัวละคร) ----
function paintHelm(k,Q,t,view){view=view||'front';
 k.save();const pl=()=>{k.beginPath();if(view==='side'){k.moveTo(22,15);k.bezierCurveTo(12,-2,36,-6,50,8);k.bezierCurveTo(44,14,34,13,24,18)}else{k.moveTo(32,13);k.bezierCurveTo(20,-4,43,-6,53,7);k.bezierCurveTo(47,13,39,12,32,16)}k.closePath()};
 const g=k.createLinearGradient(20,0,52,14);g.addColorStop(0,PLUME[2]);g.addColorStop(.4,PLUME[1]);g.addColorStop(1,PLUME[0]);k.fillStyle=g;pl();k.fill();k.strokeStyle=OL;k.lineWidth=1.6;pl();k.stroke();
 k.strokeStyle='rgba(255,170,150,.55)';k.lineWidth=.9;for(let i=0;i<4;i++){k.beginPath();k.moveTo(26+i*5.5,9);k.quadraticCurveTo(33+i*4,3+i,46+i*1.5,6);k.stroke()}k.restore();
 if(view==='side'){
  const dome=()=>{k.beginPath();k.moveTo(14,54);k.lineTo(14,30);k.quadraticCurveTo(14,8,34,8);k.quadraticCurveTo(55,8,55,30);k.lineTo(55,47);k.lineTo(49,57);k.lineTo(22,57);k.closePath()};
  part(k,Q,t,dome,18,14,8,55,57);
  k.fillStyle='#10121a';k.beginPath();k.moveTo(37,30);k.lineTo(55,30);k.lineTo(55,40);k.lineTo(39,40);k.closePath();k.fill();
  k.strokeStyle='rgba(255,255,255,.12)';k.lineWidth=.8;for(const y of [33,36.5]){k.beginPath();k.moveTo(39,y);k.lineTo(54,y);k.stroke()}
  part(k,Q,t,()=>{k.beginPath();k.moveTo(24,34);k.lineTo(40,36);k.lineTo(44,52);k.lineTo(34,57);k.lineTo(22,52);k.closePath()},19,22,34,44,57);
  k.fillStyle='rgba(10,12,20,.7)';for(const [x,y] of [[30,43],[35,46]]){k.beginPath();k.arc(x,y,1,0,7);k.fill()}
  k.fillStyle=Q.lo;k.fillRect(14,27.5,41,3);k.strokeStyle=OL;k.lineWidth=1.2;k.strokeRect(14,27.5,41,3);k.fillStyle=Q.hi;k.fillRect(15,27.9,39,.9);
  part(k,Q,t,()=>{k.beginPath();k.rect(51,30,4,19)},20,50,30,56,49);
  k.fillStyle=Q.hi;for(const x of [19,28,44]){k.beginPath();k.arc(x,29,1.1,0,7);k.fill()}
  k.strokeStyle='rgba(255,255,255,.5)';k.lineWidth=1.5;k.beginPath();k.moveTo(18,27);k.quadraticCurveTo(18,13,34,11);k.stroke();return}
 const dome=()=>{k.beginPath();k.moveTo(11,52);k.lineTo(11,30);k.quadraticCurveTo(11,8,32,8);k.quadraticCurveTo(53,8,53,30);k.lineTo(53,52);k.lineTo(45,59);k.lineTo(41,47);k.lineTo(23,47);k.lineTo(19,59);k.closePath()};
 part(k,Q,t,dome,8,11,8,53,59);
 if(view==='back'){
  k.strokeStyle='rgba(15,18,28,.55)';k.lineWidth=1.3;k.beginPath();k.moveTo(32,12);k.lineTo(32,47);k.stroke();
  k.fillStyle=Q.lo;k.fillRect(11,27.5,42,3);k.strokeStyle=OL;k.lineWidth=1.2;k.strokeRect(11,27.5,42,3);k.fillStyle=Q.hi;k.fillRect(12,27.9,40,.9);
  for(const x of [20,44])part(k,Q,t,()=>{k.beginPath();k.rect(x-8,36,16,12)},30+x,x-8,36,x+8,48);
  k.strokeStyle='rgba(255,255,255,.5)';k.lineWidth=1.5;k.beginPath();k.moveTo(15,27);k.quadraticCurveTo(15,13,30,11);k.stroke();return}
 k.fillStyle='#10121a';k.beginPath();k.moveTo(17,30);k.lineTo(47,30);k.lineTo(46,41);k.lineTo(18,41);k.closePath();k.fill();
 k.strokeStyle='rgba(255,255,255,.12)';k.lineWidth=.8;for(const y of [33,36,39]){k.beginPath();k.moveTo(19,y);k.lineTo(45,y);k.stroke()}
 part(k,Q,t,()=>{k.beginPath();k.rect(30,28,4,21)},9,29,28,35,49);
 k.fillStyle=Q.lo;k.fillRect(11,27.5,42,3);k.strokeStyle=OL;k.lineWidth=1.2;k.strokeRect(11,27.5,42,3);k.fillStyle=Q.hi;k.fillRect(12,27.9,40,.9);
 k.fillStyle=Q.hi;for(const x of [15,22,42,49]){k.beginPath();k.arc(x,29,1.1,0,7);k.fill()}
 k.fillStyle='rgba(10,12,20,.7)';for(const [x,y] of [[15,42],[15,45],[49,42],[49,45]]){k.beginPath();k.arc(x,y,1,0,7);k.fill()}
 k.strokeStyle='rgba(255,255,255,.5)';k.lineWidth=1.5;k.beginPath();k.moveTo(15,27);k.quadraticCurveTo(15,13,30,11);k.stroke();
 k.fillStyle=Q.gd;k.beginPath();k.arc(32,18,2.4,0,7);k.fill();k.strokeStyle=OL;k.lineWidth=1;k.stroke()}
// ---- เสื้อเกราะอัศวิน (front/side/back) ----
function paintChest(k,Q,t,view){view=view||'front';
 if(view==='side'){
  const body=()=>{k.beginPath();k.moveTo(23,12);k.lineTo(41,12);k.lineTo(42,30);k.lineTo(40,57);k.lineTo(24,57);k.lineTo(22,30);k.closePath()};
  part(k,Q,t,body,21,22,12,42,57);
  k.strokeStyle='rgba(15,18,28,.5)';k.lineWidth=1.2;k.beginPath();k.moveTo(24,31);k.lineTo(40,31);k.stroke();
  const tab=()=>{k.beginPath();k.moveTo(36,20);k.lineTo(41,20);k.lineTo(41,54);k.lineTo(38.5,58);k.lineTo(36,54);k.closePath()};k.fillStyle=PLUME[1];tab();k.fill();k.strokeStyle=OL;k.lineWidth=1.2;tab();k.stroke();
  part(k,Q,t,()=>{k.beginPath();k.rect(22,45,20,6)},22,22,45,42,51);k.fillStyle='#e0b84a';k.fillRect(37,44.5,5,7);k.strokeStyle=OL;k.lineWidth=1;k.strokeRect(37,44.5,5,7);
  part(k,Q,t,()=>{k.beginPath();k.ellipse(32,17,11,8,0,0,7)},23,21,9,43,25);k.fillStyle=Q.hi;k.beginPath();k.arc(32,14,1.2,0,7);k.fill();return}
 for(const x of [11,53])part(k,Q,t,()=>{k.beginPath();k.ellipse(x,17,10,8,0,0,7)},10+x,x-10,9,x+10,25);
 const body=()=>{k.beginPath();k.moveTo(15,12);k.lineTo(25,10);k.quadraticCurveTo(32,17,39,10);k.lineTo(49,12);k.lineTo(52,30);k.lineTo(46,57);k.lineTo(18,57);k.lineTo(12,30);k.closePath()};
 part(k,Q,t,body,11,12,10,52,57);
 k.fillStyle='#10121a';k.beginPath();k.moveTo(26,10);k.quadraticCurveTo(32,19,38,10);k.closePath();k.fill();
 if(view==='back'){
  k.strokeStyle='rgba(15,18,28,.55)';k.lineWidth=1.3;k.beginPath();k.moveTo(32,17);k.lineTo(32,46);k.moveTo(17,31);k.quadraticCurveTo(25,35,32,31);k.quadraticCurveTo(39,35,47,31);k.stroke();
  for(const y of [22,34])part(k,Q,t,()=>{k.beginPath();k.rect(22,y,20,6)},40+y,22,y,42,y+6);
 }else{
  k.strokeStyle='rgba(15,18,28,.55)';k.lineWidth=1.2;k.beginPath();k.moveTo(32,22);k.lineTo(32,45);k.moveTo(17,31);k.quadraticCurveTo(25,35,32,31);k.quadraticCurveTo(39,35,47,31);k.stroke();
  const tab=()=>{k.beginPath();k.moveTo(26,20);k.lineTo(38,20);k.lineTo(39,54);k.lineTo(32,58);k.lineTo(25,54);k.closePath()};
  const tg=k.createLinearGradient(26,0,38,0);tg.addColorStop(0,PLUME[0]);tg.addColorStop(.35,PLUME[1]);tg.addColorStop(1,PLUME[0]);k.fillStyle=tg;tab();k.fill();k.strokeStyle=OL;k.lineWidth=1.3;tab();k.stroke();
  k.strokeStyle='#e0b84a';k.lineWidth=1.2;k.beginPath();k.moveTo(27.5,23);k.lineTo(36.5,23);k.stroke();
  k.fillStyle='#e0b84a';k.beginPath();k.moveTo(32,29);k.lineTo(35,34);k.lineTo(32,39);k.lineTo(29,34);k.closePath();k.fill();k.strokeStyle=OL;k.lineWidth=.8;k.stroke()}
 part(k,Q,t,()=>{k.beginPath();k.rect(15,45,34,6)},12,15,45,49,51);k.fillStyle='#e0b84a';k.fillRect(29,44.5,6,7);k.strokeStyle=OL;k.lineWidth=1;k.strokeRect(29,44.5,6,7);
 k.fillStyle=Q.hi;for(const [x,y] of [[17,16],[47,16],[16,33],[48,33]]){k.beginPath();k.arc(x,y,1.1,0,7);k.fill()}}
// ---- กางเกง/เกราะขาอัศวิน ----
function paintPants(k,Q,t){
 const legs=()=>{k.beginPath();k.moveTo(14,10);k.lineTo(50,10);k.lineTo(52,24);k.lineTo(47,59);k.lineTo(34,59);k.lineTo(32,32);k.lineTo(30,59);k.lineTo(17,59);k.lineTo(12,24);k.closePath()};
 part(k,Q,t,legs,13,12,10,52,59);
 k.strokeStyle='rgba(15,18,28,.5)';k.lineWidth=1.3;k.beginPath();k.moveTo(32,16);k.lineTo(32,32);k.moveTo(15,20);k.lineTo(30,22);k.moveTo(49,20);k.lineTo(34,22);k.stroke();
 for(const x of [23.5,40.5])part(k,Q,t,()=>{k.beginPath();k.ellipse(x,38,7.5,6.5,0,0,7)},14+x,x-7,32,x+7,44);
 k.fillStyle=Q.hi;for(const x of [23.5,40.5]){k.beginPath();k.arc(x,38,1.5,0,7);k.fill()}
 for(const x of [17,34])part(k,{hi:Q.lo,mid:Q.dk,lo:Q.dk,gl:Q.gl,k:Q.k},t===0?1:t,()=>{k.beginPath();k.rect(x,51,13,8)},15+x,x,51,x+13,59);
 part(k,Q,t,()=>{k.beginPath();k.rect(12,8,40,8)},16,12,8,52,16);
 for(const x of [18,24,30,36,42])part(k,Q,t,()=>{k.beginPath();k.moveTo(x,16);k.lineTo(x+6,16);k.lineTo(x+5,24);k.lineTo(x+1,24);k.closePath()},17+x,x,16,x+6,24);
 k.fillStyle='#e0b84a';k.fillRect(29,8,6,8);k.strokeStyle=OL;k.lineWidth=1;k.strokeRect(29,8,6,8)}

// ✨ ประกายวิบวับบนชุด/อาวุธระดับเงินขึ้นไป (เฉพาะของหายาก) — ยิ่งระดับสูงยิ่งแวววาวและถี่
function eqGlitter(x,by,d,f){const L=[];
 for(const k of ['helm','chest','pants','arm','neck','ring']){const id=P.armor[k];if(id&&ITEMS[id]&&ITEMS[id].tier>=3&&((ENH&&ENH[id])|0)>=3)L.push([ITEMS[id].tier,k])} /* fix127: ชุดที่ยังไม่ตีบวก (+0–2) ไม่วิบวับ */
 const tt=P.tier[P.tool],sw=P.armor&&P.armor.sword;if(tt>=3&&sw&&((ENH&&ENH[sw])|0)>=3)L.push([tt,'tool']);if(!L.length)return;
 const hx=d==='d'?-12:d==='u'?12:f*9;
 const A={helm:[[-6,-50],[6,-45],[0,-55],[-8,-42]],chest:[[-10,-30],[10,-29],[0,-22],[-4,-17],[5,-26]],pants:[[-4,-8],[4,-6],[-3,-3],[5,-10]],tool:[[hx,-36],[hx+2,-27],[hx-1,-45],[hx,-19]],arm:[[-14,-19],[14,-19],[-13,-24]],neck:[[0,-26],[1,-21]],ring:[[11,-13]]};
 const T0=performance.now()/1000;ctx.save();ctx.globalCompositeOperation='lighter';
 const dens=L.length>2?.34:.5;/* fix127: ประกายน้อยลง ไม่บังตัวละคร */
 for(const [tier0,k] of L){const Q=TIERS[tier0]||TIERS[5],pts=A[k],tier=Math.min(5,tier0);/* fix127: ขนาด/ความถี่ไม่เกินระดับเพชร — ชุดบอสเคยประกายใหญ่จนบังตัว */
  pts.forEach(([ax,ay],j)=>{if(dens<.4?j%3:j%2)return;const per=1.5+hash(j,tier)*1.3-(tier-3)*.18,ph=((T0+hash(j+3,tier*7)*9)/per)%1,a=Math.pow(Math.max(0,Math.sin(ph*Math.PI*1.25)),7);if(a<.06)return;
   const r=(.7+(Math.min(tier,4)-2)*.2)*(.45+a*.6),px=x+ax,py=by+ay;
   const g=ctx.createRadialGradient(px,py,0,px,py,r*2);g.addColorStop(0,'rgba(255,255,255,'+(.5*a)+')');g.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=g;ctx.fillRect(px-r*2,py-r*2,r*4,r*4);
   ctx.fillStyle='rgba(255,255,255,'+a+')';ctx.beginPath();ctx.moveTo(px,py-r*2.2);ctx.lineTo(px+r*.3,py-r*.3);ctx.lineTo(px+r*2.2,py);ctx.lineTo(px+r*.3,py+r*.3);ctx.lineTo(px,py+r*2.2);ctx.lineTo(px-r*.3,py+r*.3);ctx.lineTo(px-r*2.2,py);ctx.lineTo(px-r*.3,py-r*.3);ctx.closePath();ctx.fill();
   if(tier>=4){ctx.fillStyle=Q.gl.startsWith('#')?Q.gl:'#fff';ctx.globalAlpha=.55*a;ctx.beginPath();ctx.arc(px,py,r*.9,0,7);ctx.fill();ctx.globalAlpha=1}})}
 ctx.restore()}

// ================= เครื่องประดับ/เกราะแขน (ไอคอนเดียวกับที่สวมบนตัวละคร) =================
const GEMC=['#9aa0aa','#b9c8de','#e8855a','#aee0ff','#ff4a5a','#7fe8ff'];
function paintArm(k,Q,t){
 const L=(x0)=>()=>{k.beginPath();k.moveTo(x0+2,10);k.lineTo(x0+17,8);k.lineTo(x0+20,50);k.lineTo(x0-1,54);k.closePath()};
 for(const [x0,sd] of [[8,0],[36,1]]){part(k,Q,t,L(x0),50+x0,x0,8,x0+20,54);
  k.strokeStyle='rgba(15,18,28,.55)';k.lineWidth=1.3;for(const y of [20,31,42]){k.beginPath();k.moveTo(x0+1+(y-8)*.03,y);k.lineTo(x0+19+(y-8)*.04,y-1.4);k.stroke()}
  k.fillStyle=Q.hi;for(const y of [15,26,37,47]){k.beginPath();k.arc(x0+10+(y-8)*.03,y,1.1,0,7);k.fill()}
  part(k,Q,t,()=>{k.beginPath();k.rect(x0-1,5,22,6)},60+x0,x0-1,5,x0+21,11);
  k.fillStyle=PLUME[0];k.fillRect(x0+4,50,12,4);k.strokeStyle=OL;k.lineWidth=1;k.strokeRect(x0+4,50,12,4)}}
function paintNeck(k,Q,t){
 const chain=()=>{k.beginPath();k.moveTo(12,6);k.bezierCurveTo(12,36,52,36,52,6)};
 k.save();if(t>=3){k.shadowColor=Q.gl;k.shadowBlur=4}k.lineCap='round';chain();k.strokeStyle=OL;k.lineWidth=5;k.stroke();chain();k.strokeStyle=Q.mid;k.lineWidth=3.2;k.stroke();
 chain();k.strokeStyle=Q.hi;k.lineWidth=1.6;k.setLineDash([2.5,3]);k.stroke();k.setLineDash([]);k.restore();
 part(k,Q,t,()=>{k.beginPath();k.moveTo(32,28);k.lineTo(41,36);k.lineTo(38,52);k.lineTo(32,58);k.lineTo(26,52);k.lineTo(23,36);k.closePath()},70,23,28,41,58);
 const g=k.createLinearGradient(26,36,38,52);g.addColorStop(0,'#ffffff');g.addColorStop(.35,GEMC[t]);g.addColorStop(1,Q.dk);k.fillStyle=g;k.beginPath();k.moveTo(32,35);k.lineTo(37,41);k.lineTo(32,52);k.lineTo(27,41);k.closePath();k.fill();k.strokeStyle=OL;k.lineWidth=.9;k.stroke();
 k.strokeStyle='rgba(255,255,255,.7)';k.lineWidth=.8;k.beginPath();k.moveTo(27,41);k.lineTo(37,41);k.moveTo(32,35);k.lineTo(30,41);k.lineTo(32,52);k.stroke();
 k.fillStyle=Q.gd;k.beginPath();k.arc(32,27,2.6,0,7);k.fill();k.strokeStyle=OL;k.lineWidth=1;k.stroke()}
function paintRing(k,Q,t){
 const g=k.createLinearGradient(14,24,50,56);g.addColorStop(0,Q.hi);g.addColorStop(.5,Q.mid);g.addColorStop(1,Q.lo);
 k.save();if(t>=3){k.shadowColor=Q.gl;k.shadowBlur=t===5?8:5}k.fillStyle=g;k.beginPath();k.ellipse(32,40,19,17,0,0,7);k.fill();k.restore();
 k.save();k.beginPath();k.ellipse(32,40,19,17,0,0,7);k.clip();texture(k,Q,t,90);k.restore();
 k.save();k.globalCompositeOperation='destination-out';k.beginPath();k.ellipse(32,41,11,9.5,0,0,7);k.fill();k.restore();
 k.strokeStyle=OL;k.lineWidth=1.8;k.beginPath();k.ellipse(32,40,19,17,0,0,7);k.stroke();k.beginPath();k.ellipse(32,41,11,9.5,0,0,7);k.stroke();
 k.strokeStyle='rgba(255,255,255,.6)';k.lineWidth=1.4;k.beginPath();k.ellipse(32,40,16,14,0,3.4,4.7);k.stroke();
 part(k,Q,t,()=>{k.beginPath();k.moveTo(24,24);k.lineTo(40,24);k.lineTo(43,29);k.lineTo(21,29);k.closePath()},91,21,24,43,29);
 const gg=k.createLinearGradient(25,6,39,26);gg.addColorStop(0,'#ffffff');gg.addColorStop(.4,GEMC[t]);gg.addColorStop(1,Q.dk);k.fillStyle=gg;k.beginPath();k.moveTo(26,12);k.lineTo(32,5);k.lineTo(38,12);k.lineTo(36,24);k.lineTo(28,24);k.closePath();k.fill();k.strokeStyle=OL;k.lineWidth=1.2;k.stroke();
 k.strokeStyle='rgba(255,255,255,.75)';k.lineWidth=.8;k.beginPath();k.moveTo(26,12);k.lineTo(38,12);k.moveTo(32,5);k.lineTo(30,12);k.lineTo(32,24);k.stroke()}
// สวมบนตัวละคร
function drawArm(px,py){const id=P.armor.arm;if(!id)return;ctx.drawImage(eqSpr('arm',ITEMS[id].tier,'front'),6,6,24,50,Math.round(px-1),Math.round(py),8,11)}
function drawNeck(x,by,side,d){const id=P.armor.neck;if(!id)return;const t=ITEMS[id].tier,Q=TIERS[t];
 if(d==='u'){ctx.fillStyle=Q.mid;ctx.fillRect(Math.round(x-4),Math.round(by-29),8,1.5);return}
 if(side){ctx.drawImage(eqSpr('neck',t,'front'),18,18,28,42,Math.round(x-3),Math.round(by-31),7,11);return}
 ctx.drawImage(eqSpr('neck',t,'front'),10,4,44,56,Math.round(x-6),Math.round(by-32),12,14)}
function drawRing(hx,hy){const id=P.armor.ring;if(!id)return;const t=ITEMS[id].tier,Q=TIERS[t];ctx.fillStyle=Q.hi;ctx.fillRect(Math.round(hx+1),Math.round(hy+2),4,1.5);ctx.fillStyle=GEMC[t];ctx.fillRect(Math.round(hx+2),Math.round(hy+1),2,2)}
// ดาบเก็บไว้ที่หลัง (ชักออกมาด้วยช่องลัด)
function backSword(x,by,side,f,d){if(!P.armor.sword||(P.draw&&P.tool==='sword')||side)return;const ic=toolIcon('sword',P.tier.sword,64);
 // ด้ามแนบไหล่ · ใบดาบแนบหลัง หมุนตามทิศที่ตัวละครหัน (ไม่ลากไปข้างหน้า/ข้างหลัง)
 let gx,gy,rot,s;
 if(side){gx=x-f*5;gy=by-27;rot=f>0?Math.PI-.08:Math.PI+.08;s=.62}
 else if(d==='u'){gx=x+4;gy=by-34;rot=-2.62;s=1}
 else{gx=x+8;gy=by-33;rot=-2.72;s=1}
 ctx.save();ctx.translate(Math.round(gx),Math.round(gy));ctx.rotate(rot);ctx.scale(s,s);ctx.drawImage(ic,-23,-36,46,46);ctx.restore()}
// ================= น้ำหนักแบก · ช่องกระเป๋า =================
const WT={wood:.8,coal:.4,stone:1.2,iron:1.5,copper:1.5,silver:1.6,gold:2,ore:.4,ingSt:2,ingot:2.4,ingCu:2.2,ingAg:2.4,ingAu:3.5,ingDm:1,gel:.2,bottle:.3,hpp:.4,mpp:.4,bread:.3,apple:.2,scroll:.1};
const GWB={sword:2,axe:2.4,pick:2.4,helm:2,chest:5,pants:3,arm:1.5,neck:.3,ring:.1},GWT=[1.3,1.1,1,.95,1.2,.6];
const gearW=id=>{const it=ITEMS[id];return Math.round(GWB[it.kind]*GWT[it.tier]*10)/10};
const BAGSLOT=[20,26,32,40],BAGCAP=[40,55,70,90];
const bagSlotsMax=()=>BAGSLOT[P.bagLv|0],bagCapMax=()=>BAGCAP[P.bagLv|0]+P.stats.str*2+P.stats.end;
function bagCells(){const L=[];if(P.armor.sword)L.push({t:'gear',k:P.armor.sword,n:1,eq:1});for(const id of Object.keys(GEAR).sort())for(let q=0;q<GEAR[id];q++)L.push({t:'gear',k:id,n:1});
 for(const k of INVORDER){if(k==='coin')continue;let n=inv[k]||0;while(n>0){const m=Math.min(99,n);L.push({t:'mat',k,n:m});n-=m}}return L}
function bagWeight(){let w=0;for(const k in WT)w+=(inv[k]||0)*WT[k];for(const id in GEAR)w+=GEAR[id]*gearW(id);for(const k in P.armor)if(P.armor[k])w+=gearW(P.armor[k]);return Math.round(w*10)/10}
function canTake(k){if(k==='coin')return true;if(bagWeight()+(WT[k]||0)>bagCapMax())return 'weight';if((inv[k]||0)%99!==0)return true;return bagCells().length<bagSlotsMax()?true:'slot'}
function canTakeGear(id){if(bagWeight()+gearW(id)>bagCapMax())return 'weight';return bagCells().length<bagSlotsMax()?true:'slot'}
let _ctMsg=0;function noRoom(why){const n=performance.now();if(n-_ctMsg>1500){_ctMsg=n;say(why==='weight'?'⚖️ แบกหนักเกินไป — ขายหรือทิ้งของก่อน':'🎒 กระเป๋าเต็ม — ขายของหรือซื้อกระเป๋าใหญ่ขึ้น (ร้านชำป้าแดง)');sfx('thud')}}
let CARRY_SPD=1;setInterval(()=>{const w=bagWeight(),m=bagCapMax();CARRY_SPD=w<=m?1:Math.max(.5,1-(w-m)/m*1.2)},250);

// ---- แร่ในแมพ: หินธรรมดา · ทองแดง · เงิน · ทอง · เพชรใช้สไปรต์ assets/diamond-ore.png ----
const OREK={
 stone:{n:'หินธรรมดา',req:0,hp:6,drop:'stone',cnt:[1,2],xp:2,fx:'190,195,205'},
 iron:{n:'แร่เหล็ก',req:0,hp:7,drop:'iron',cnt:[1,2],xp:3,fx:'200,150,120'},
 copper:{n:'แร่ทองแดง',req:1,hp:8,drop:'copper',cnt:[1,2],xp:4,fx:'240,150,80'},
 silver:{n:'แร่เงิน',req:2,hp:10,drop:'silver',cnt:[1,2],xp:7,fx:'225,235,255'},
 gold:{n:'แร่ทอง',req:3,hp:12,drop:'gold',cnt:[1,2],xp:12,fx:'255,215,80'},
 diamond:{n:'แร่เพชร',req:4,hp:14,drop:'gem',cnt:[2,3],xp:20,fx:'170,235,255'}};
function paintOre(k,kind,size){const Q={copper:TIERS[2],silver:TIERS[3],gold:TIERS[4]}[kind];k.save();k.scale(size/42,size/42);k.lineJoin='round';
 k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(21,36,15,4,0,0,7);k.fill();
 const g=k.createLinearGradient(0,8,0,38);g.addColorStop(0,'#9a9da6');g.addColorStop(.55,'#6b6e77');g.addColorStop(1,'#43454c');
 k.fillStyle=g;k.strokeStyle='#1f2025';k.lineWidth=1.4;
 k.beginPath();k.moveTo(4,35);k.lineTo(3,24);k.lineTo(9,13);k.lineTo(19,7);k.lineTo(30,9);k.lineTo(38,19);k.lineTo(39,34);k.quadraticCurveTo(21,40,4,35);k.closePath();k.fill();k.stroke();
 k.fillStyle='rgba(255,255,255,.10)';k.beginPath();k.moveTo(9,13);k.lineTo(19,7);k.lineTo(21,20);k.lineTo(8,24);k.closePath();k.fill();
 k.fillStyle='rgba(0,0,10,.18)';k.beginPath();k.moveTo(30,9);k.lineTo(38,19);k.lineTo(39,34);k.lineTo(26,32);k.closePath();k.fill();
 if(Q){if(kind==='gold'){k.shadowColor=Q.gl;k.shadowBlur=5}
  for(const [x,y,w,h] of [[12,24,6,10],[22,17,7,14],[31,27,5,9],[16,32,5,6],[27,15,4,7]]){const gg=k.createLinearGradient(x-w/2,y,x+w/2,y+h);gg.addColorStop(0,Q.hi);gg.addColorStop(1,Q.mid);k.fillStyle=gg;k.strokeStyle=Q.lo;k.lineWidth=1;
   k.beginPath();k.moveTo(x,y+h);k.lineTo(x-w/2,y+h*.45);k.lineTo(x-w*.15,y);k.lineTo(x+w/2,y+h*.4);k.closePath();k.fill();k.stroke()}k.shadowBlur=0}
 else if(kind==='iron'){k.strokeStyle='rgba(15,15,20,.5)';k.lineWidth=1;k.beginPath();k.moveTo(14,12);k.lineTo(17,20);k.lineTo(13,27);k.stroke();
  for(const [x,y,w,h] of [[11,23,7,11],[23,17,8,15],[32,27,6,9],[17,32,6,6],[28,14,4,7]]){const gg=k.createLinearGradient(x-w/2,y,x+w/2,y+h);gg.addColorStop(0,'#c98a5a');gg.addColorStop(.5,'#8a4f2a');gg.addColorStop(1,'#4a2a18');k.fillStyle=gg;k.strokeStyle='#2a1810';k.lineWidth=1;
   k.beginPath();k.moveTo(x,y+h);k.lineTo(x-w/2,y+h*.45);k.lineTo(x-w*.15,y);k.lineTo(x+w/2,y+h*.4);k.closePath();k.fill();k.stroke();k.fillStyle='rgba(255,255,255,.35)';k.fillRect(x-w*.2,y+1,1.6,h*.4)}
  k.fillStyle='rgba(60,60,70,.55)';k.beginPath();k.arc(36,22,2,0,7);k.arc(8,30,1.8,0,7);k.fill()}
 else{k.strokeStyle='rgba(15,15,20,.55)';k.lineWidth=1;k.beginPath();k.moveTo(14,12);k.lineTo(17,20);k.lineTo(13,27);k.moveTo(29,13);k.lineTo(26,22);k.lineTo(31,30);k.stroke();
  k.fillStyle='rgba(120,160,100,.55)';k.beginPath();k.arc(10,32,3,0,7);k.arc(35,31,2.6,0,7);k.fill()}
 k.restore()}
// ---- ไอคอนวัสดุในกระเป๋า ----
function paintIngot(k,t){const Q=TIERS[t],g=k.createLinearGradient(8,20,40,36);g.addColorStop(0,Q.hi);g.addColorStop(.5,Q.mid);g.addColorStop(1,Q.lo);k.lineJoin='round';
 k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,38,17,4,0,0,7);k.fill();
 if(t>=4){k.shadowColor=Q.gl;k.shadowBlur=5}
 k.fillStyle=g;k.strokeStyle='#1d222c';k.lineWidth=1.6;k.beginPath();k.moveTo(6,35);k.lineTo(13,19);k.lineTo(36,19);k.lineTo(43,35);k.closePath();k.fill();k.stroke();k.shadowBlur=0;
 k.fillStyle=Q.hi;k.beginPath();k.moveTo(13,19);k.lineTo(36,19);k.lineTo(34,24);k.lineTo(15,24);k.closePath();k.fill();
 k.fillStyle='rgba(255,255,255,.5)';k.fillRect(16,26,9,2)}
function matIcon(key){const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';
 const ING={ingSt:0,ingot:1,ingCu:2,ingAg:3,ingAu:4,ingDm:5};
 if(key==='stone'||key==='iron'||key==='copper'||key==='silver'||key==='gold'){const im=OREIMGS[key];if(im&&im.complete&&im.naturalWidth)k.drawImage(im,0,0,48,48);else paintOre(k,key,48)}
 else if(key==='ore')k.drawImage(gemIcon(),0,0,48,48);
 else if(key in ING)paintIngot(k,ING[key]);
 else if(key==='wood'){k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,38,17,4,0,0,7);k.fill();
  const g=k.createLinearGradient(0,14,0,34);g.addColorStop(0,'#a8744a');g.addColorStop(1,'#5a3a1e');k.fillStyle=g;k.strokeStyle='#2a1808';k.lineWidth=1.5;
  k.beginPath();k.moveTo(9,16);k.lineTo(36,16);k.lineTo(36,34);k.lineTo(9,34);k.closePath();k.fill();k.stroke();
  k.strokeStyle='rgba(40,20,8,.45)';k.lineWidth=1;for(const y of [21,26,30]){k.beginPath();k.moveTo(10,y);k.lineTo(35,y);k.stroke()}
  k.fillStyle='#d9b27a';k.beginPath();k.ellipse(36,25,6,9,0,0,7);k.fill();k.strokeStyle='#2a1808';k.lineWidth=1.4;k.stroke();
  k.strokeStyle='#a97c4a';k.lineWidth=1;for(const r of [2.2,4.6]){k.beginPath();k.ellipse(36,25,r*.7,r*1.5,0,0,7);k.stroke()}}
 else if(key==='gel'){const g=k.createRadialGradient(19,18,2,24,28,18);g.addColorStop(0,'#d6eeff');g.addColorStop(.5,'#4aa8ff');g.addColorStop(1,'#2a5fc4');k.fillStyle=g;k.strokeStyle='#0f2d6e';k.lineWidth=1.6;
  k.beginPath();k.moveTo(8,36);k.bezierCurveTo(5,22,16,10,24,10);k.bezierCurveTo(32,10,43,22,40,36);k.quadraticCurveTo(24,41,8,36);k.fill();k.stroke();
  k.fillStyle='rgba(255,255,255,.7)';k.beginPath();k.ellipse(17,20,4,2.5,-.5,0,7);k.fill()}
 else if(key==='coin'){const g=k.createRadialGradient(19,18,2,24,24,18);g.addColorStop(0,'#fff3a0');g.addColorStop(1,'#d9a21a');k.fillStyle=g;k.strokeStyle='#8a5a0a';k.lineWidth=1.8;k.beginPath();k.arc(24,24,16,0,7);k.fill();k.stroke();
  k.strokeStyle='#a8741a';k.lineWidth=1.4;k.beginPath();k.arc(24,24,11,0,7);k.stroke();k.fillStyle='#a8741a';k.fillRect(22,16,4,16)}
 else if(key==='scroll')return scrollIcon(48);
 else if(key==='hpp'||key==='mpp'||key==='bottle'){k.save();IT.bottle(k,24,42,1.5,0,key==='hpp'?'#ff5c7a':key==='mpp'?'#4fd6ff':'rgba(0,0,0,0)',key==='bottle'?1:0);k.restore()}
 else if(key==='coal'){k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,39,17,4,0,0,7);k.fill();
  for(const [x,y,s,r] of [[14,30,10,.1],[27,27,12,-.2],[20,19,9,.3],[32,35,8,.5]]){k.save();k.translate(x,y);k.rotate(r);const g=k.createLinearGradient(-s,-s,s,s);g.addColorStop(0,'#4a4a52');g.addColorStop(.5,'#1e1e24');g.addColorStop(1,'#0a0a0e');k.fillStyle=g;k.strokeStyle='#000';k.lineWidth=1.3;
   k.beginPath();k.moveTo(-s*.9,s*.3);k.lineTo(-s*.55,-s*.7);k.lineTo(s*.2,-s*.95);k.lineTo(s*.95,-s*.2);k.lineTo(s*.7,s*.7);k.lineTo(-s*.2,s*.85);k.closePath();k.fill();k.stroke();
   k.fillStyle='rgba(255,255,255,.22)';k.fillRect(-s*.4,-s*.6,s*.5,2);k.fillStyle='rgba(255,110,40,.55)';k.fillRect(s*.1,s*.1,2.2,2.2);k.restore()}}
 else if(key==='bread'){k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,36,16,4,0,0,7);k.fill();const g=k.createLinearGradient(0,16,0,36);g.addColorStop(0,'#e8b068');g.addColorStop(1,'#a8672a');k.fillStyle=g;k.strokeStyle='#5a3410';k.lineWidth=1.6;
  k.beginPath();k.ellipse(24,27,17,10,0,0,7);k.fill();k.stroke();k.strokeStyle='rgba(90,52,16,.6)';k.lineWidth=1.4;for(const x of [15,22,29]){k.beginPath();k.moveTo(x,20);k.lineTo(x+4,31);k.stroke()}}
 else if(key==='apple'){k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,38,12,3.5,0,0,7);k.fill();const g=k.createRadialGradient(19,22,2,24,27,15);g.addColorStop(0,'#ff8a7a');g.addColorStop(1,'#b3231f');k.fillStyle=g;k.strokeStyle='#5a0f0c';k.lineWidth=1.5;
  k.beginPath();k.moveTo(24,16);k.bezierCurveTo(16,11,7,17,9,28);k.bezierCurveTo(11,38,20,40,24,37);k.bezierCurveTo(28,40,37,38,39,28);k.bezierCurveTo(41,17,32,11,24,16);k.fill();k.stroke();
  k.strokeStyle='#5a3a1e';k.lineWidth=2;k.beginPath();k.moveTo(24,16);k.lineTo(26,8);k.stroke();k.fillStyle='#4fae3a';k.beginPath();k.ellipse(31,10,5,2.6,-.4,0,7);k.fill()}
 else if(key==='soup'){k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,38,16,4,0,0,7);k.fill();const g=k.createLinearGradient(0,24,0,38);g.addColorStop(0,'#c9b07a');g.addColorStop(1,'#8a6a3a');k.fillStyle=g;k.strokeStyle='#4a3010';k.lineWidth=1.6;
  k.beginPath();k.moveTo(8,25);k.lineTo(40,25);k.quadraticCurveTo(38,38,24,38);k.quadraticCurveTo(10,38,8,25);k.closePath();k.fill();k.stroke();
  k.fillStyle='#d9a45a';k.beginPath();k.ellipse(24,25,16,4,0,0,7);k.fill();k.stroke();k.strokeStyle='rgba(255,255,255,.5)';k.lineWidth=1.4;for(const x of [18,24,30]){k.beginPath();k.moveTo(x,20);k.quadraticCurveTo(x+3,15,x,10);k.stroke()}}
 return c}

function oreKind(x,y){const p=x/W,h=hash(x*2.1+7,y*3.3+1),w=[.5*(1-p)+.1,.26,.26,.1+.12*p,.03+.2*p,.005+.17*p*p],s=w.reduce((a,b)=>a+b,0);let r=h*s;
 const K=['stone','iron','copper','silver','gold','diamond'];for(let i=0;i<6;i++){if(r<w[i])return K[i];r-=w[i]}return 'stone'}
