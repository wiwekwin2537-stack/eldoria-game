// fix48 (v4.54) — NPC มีตารางชีวิต: ไม่เดินเตร่ไปมาแล้ว · กลางวัน (05:30–21:00) ยืนประจำจุดทำงาน หันหน้าหาผู้เล่น
//   กลางคืน (21:00–05:30) ชาวเมืองทั่วไปนอนหลับ ณ จุดประจำ (วาดนอนราบ + 💤) — แตะคุยได้ ตื่นมาคุย/ส่งเควสได้ปกติ แล้วหลับต่อ
//   คนสำคัญไม่นอน: ทหารยาม · นักบวชแห่งแสง · ปรมาจารย์อาชีพ · NPC ที่แพตช์อื่นเพิ่ม (ไม่อยู่ใน NPC_DATA เดิม)
try{
try{let mv=0;for(const l of LAMP_DATA)if(l[0]===31&&l[1]===23){l[0]=29;mv=1}if(mv&&D&&D.town&&!D.shop){buildTown();mkMini(dcv,TW,TH,2.6)}}catch(e){console.warn('fix48 lamp',e)}// โคมไฟบังป้ายธนาคาร → ขยับซ้าย
const ESS48=new Set(['ทหารยาม','นักบวชแห่งแสง','ปรมาจารย์อาชีพ']);
const BASE48=new Set(NPC_DATA.map(n=>n.name));
const WORK48={'พ่อค้า':['📦 จัดของอยู่','ของใหม่มาถึงแล้ว!'],'นักดื่ม':['🍺 อึก…','เบียร์อีกแก้ว!'],'ชาวบ้าน':['🧹 กวาดลานบ้าน','อากาศดีจัง'],'เด็กน้อย':['🪀 เล่นอยู่','ฮึบ! ฮึบ!'],
 'ชาวนา':['🌾 ดูแลไร่','ฝนจะตกไหมน้า'],'หญิงสาว':['🌸 รดน้ำดอกไม้','สวยจัง'],'ช่างตีเหล็ก':['🔨 เคร้ง! เคร้ง!','เหล็กร้อนได้ที่'],'นักเดินทาง':['🗺️ ดูแผนที่','ทางไหนดีน้า'],
 'แม่ค้าผัก':['🥬 ผักสดจ้า!'],'แม่ค้าผลไม้':['🍎 ผลไม้หวานจ้า!'],'คนขายขนมปัง':['🍞 อบใหม่ ๆ จ้า!'],'ลุงขายผัก':['🎃 ฟักทองหัวโต!']};
const night48=()=>{const h=((DAY.t%24)+24)%24;return h>=21||h<5.5};
window.night48=night48;
const ess48=n=>ESS48.has(n.name)||!BASE48.has(n.name)||n.hat==='crown';
// จุดประจำใหม่ (ช่อง) — เดิมยืนขวางประตูร้าน: ชาวนาหน้าธนาคาร · นักเดินทางหน้าร้านอาวุธ
const POST48={'ชาวนา':[5.5,31.6],'นักเดินทาง':[3.5,18.6]};
const SHORT48={'ทหารยามโรแลนด์':'ยามโรแลนด์','ทหารยามการ์ธ':'ยามการ์ธ'};
const VEND48=new Set(['แม่ค้าผัก','แม่ค้าผลไม้','คนขายขนมปัง','ลุงขายผัก']);
function init48(n){if(n.i48)return;n.i48=1;n.ess48=ess48(n);n.fixed=1;n.tg=null;const po=POST48[n.name];if(po)n.home={x:po[0]*T,y:po[1]*T};
 if(n.dn&&SHORT48[n.dn])n.dn=SHORT48[n.dn];if(n.home){n.x=n.home.x;n.y=n.home.y}n.wk48=4+Math.random()*10}
// ป้ายชื่อ + เครื่องหมายเควส วาดเอง (ใช้กับคนหลับ และแม่ค้าที่ป้ายชื่อเดิมทับป้ายแผง)
function lab48(n,nm,dn,x,y,z){ctx.save();ctx.font='bold 10px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.9)';ctx.shadowOffsetX=ctx.shadowOffsetY=1;if(!z||Math.hypot(P.x-x,P.y-y)<110)ctx.fillText((dn||nm)+(z?' 💤':''),x,y);
 let q=null;try{q=typeof sideOf==='function'?sideOf(nm):null}catch(e){}
 if(q){const s2=HOME.side[q.id],m=!s2?'!':sideProg(q)?'?':'';if(m){ctx.shadowColor='transparent';ctx.font='bold 16px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#3a2a06';ctx.strokeText(m,x,y-14);ctx.fillStyle=m==='!'?'#ffd84a':'#8fe08a';ctx.fillText(m,x,y-14)}}ctx.restore()}
{const _u=updNPCs;updNPCs=function(dt){
 if(D&&D.npcs){const ng=night48();for(const n of D.npcs){init48(n);if(n.wake48>0)n.wake48-=dt;
  const s=!!(D.town&&ng&&!n.ess48&&!(n.wake48>0)&&!(DLG&&DLG.open&&DLG.n===n));
  if(s&&!n.slp){n.bub=null}n.slp=s;
  if(n.home){const ty=n.home.y;if(Math.hypot(n.x-n.home.x,n.y-ty)>2){n.x=n.home.x;n.y=ty}}
  if(!s){const dp=Math.hypot(P.x-n.x,P.y-n.y);if(dp<60){const dx=P.x-n.x,dy=P.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}
   else if(dp<260&&!n.bub&&(n.wk48-=dt)<=0){n.wk48=10+Math.random()*14;const L=WORK48[n.name];if(L)n.bub={txt:L[Math.random()*L.length|0],t:2.4}}}}}
 _u(dt)};window.updNPCs=updNPCs}
// วาดตอนหลับ: เสื่อ + ตัวนอนราบ + 💤
{const _dn=drawNPC;drawNPC=function(n,t){if(!n.slp){if(VEND48.has(n.name)&&!(DLG&&DLG.open&&DLG.n===n)&&D&&D.town){const nm=n.name,dn=n.dn;n.name=' ';n.dn=' ';try{_dn(n,t)}finally{n.name=nm;n.dn=dn}lab48(n,nm,dn,Math.round(n.x),Math.round(n.y)-86);return}return _dn(n,t)}const x=Math.round(n.x),y=Math.round(n.y);
 ctx.save();ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x-14,y+1,24,6,0,0,7);ctx.fill();
 ctx.fillStyle='#7a4a3a';ctx.fillRect(x-38,y-8,46,12);ctx.fillStyle='#c9b48a';ctx.fillRect(x-38,y-8,10,12);
 ctx.fillStyle='#4a6a9a';ctx.fillRect(x-28,y-9,36,13);ctx.restore();
 const mv=n.mv,bub=n.bub,nm=n.name,dn=n.dn;n.mv=false;n.bub=null;n.name=' ';n.dn=' ';ctx.save();ctx.translate(x,y);ctx.rotate(-Math.PI/2);ctx.translate(-x,-y);try{_dn(n,0)}catch(e){}ctx.restore();n.mv=mv;n.bub=bub;n.name=nm;n.dn=dn;
 lab48(n,nm,dn,x-14,y-22,1);
 ctx.save();ctx.fillStyle='#4a6a9a';ctx.fillRect(x-24,y-8,30,11);ctx.restore();
 const k=(t*.6+(n.home?n.home.x:0)*.01)%1;ctx.save();ctx.globalAlpha=1-k;ctx.font='bold '+(10+k*6|0)+'px system-ui';ctx.textAlign='center';ctx.fillStyle='#cfe3ff';ctx.strokeStyle='#1a2440';ctx.lineWidth=3;
 const zx=x-30+k*10,zy=y-16-k*22;ctx.strokeText('z',zx,zy);ctx.fillText('z',zx,zy);ctx.restore()};window.drawNPC=drawNPC}
// คุยตอนหลับ = ปลุก (คุย/ส่งเควสได้ตามปกติ) แล้วหลับต่อเองภายหลัง
{const _nt=npcTalk;npcTalk=function(n){if(n&&n.slp){n.slp=false;n.wake48=12}else if(n&&!n.ess48&&D&&D.town&&night48())n.wake48=12;return _nt(n)};window.npcTalk=npcTalk}
}catch(e){console.warn('fix48',e)}
