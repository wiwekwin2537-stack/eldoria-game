// fix5.js — ชุดแก้ #5 (v4.14)  สายตามอนสเตอร์ (LOS): มองไม่เห็นผู้เล่นผ่านกำแพง/แร่ → ไม่ล็อกเป้า · เสียเป้านานแล้วเลิกไล่
// =====================================================================
window.LOS9=function(x0,y0,x1,y1){try{const Zm=D&&D.zone;if(!Zm)return true;const dx=x1-x0,dy=y1-y0,d=Math.hypot(dx,dy);if(d<24)return true;const n=Math.ceil(d/14);
  for(let i=1;i<n;i++){const x=x0+dx*i/n,y=y0+dy*i/n,tx=Math.floor(x/T),ty=Math.floor((y-4)/T);
   if(!Zm.m[ty]||Zm.m[ty][tx]!==FL)return false;const o=Zm.oreAt[ty*ZW+tx];if(o&&o.alive)return false}return true}catch(e){return true}};
{const _um=updMob;updMob=function(m,dt){
  if(D&&D.zone&&m.aggro&&!m.dead){m.lt9=(m.lt9||0)+dt;if(m.lt9>.35){m.lt9=0;const d=Math.hypot(P.x-m.x,P.y-m.y);
    if(LOS9(m.x,m.y-4,P.x,P.y-4))m.nlos9=0;else{m.nlos9=(m.nlos9||0)+.35;if(m.nlos9>6&&d>200&&!m.boss&&m.st!=='lunge'&&m.st!=='charge'){m.aggro=0;m.st='idle';m.nlos9=0}}}}
  return _um(m,dt)}}
// ---------- ข้อ 50/91: เล็งสกิลแม่นขึ้น — เมาส์ (เดสก์ท็อป) ชี้ทิศ + จับเป้าใกล้สุดในมุมกว้างขึ้น + ตัวละครหันตามทิศที่ยิง ----------
window.MS9={x:0,y:0,t:-9e9};
cv.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=cv.getBoundingClientRect(),sx=(e.clientX-r.left)*(VW/r.width),sy=(e.clientY-r.top)*(VH/r.height),c=window.LASTCAM||[0,0];MS9.x=c[0]+sx/Z;MS9.y=c[1]+sy/Z;MS9.t=performance.now()});
{const _ad=aimDir;aimDir=function(range){if(P.cls==='sniper'&&window.SKILLAIM46&&SKILLAIM46.cast)return SKILLAIM46.cast.dv.slice();let dv=null;
   if(performance.now()-MS9.t<4000){const dx=MS9.x-P.x,dy=MS9.y-(P.y-14),d=Math.hypot(dx,dy);if(d>10){dv=[dx/d,dy/d];
     // ดูดเข้าหามอนที่อยู่ใกล้เส้นเล็ง (เมาส์ห่างมอนไม่เกิน 60px)
     let bd=60,bt=null;for(const e of enemies()){if(e.dead||!LOS9(P.x,P.y-4,e.x,e.y-4))continue;const q=Math.hypot(e.x-MS9.x,(e.y-10)-MS9.y);if(q<bd&&Math.hypot(e.x-P.x,e.y-P.y)<=range+40){bd=q;bt=e}}
     if(bt){const ex=bt.x-P.x,ey=(bt.y-10)-(P.y-14),ed=Math.hypot(ex,ey)||1;dv=[ex/ed,ey/ed]}}}
   if(!dv){const v=DIRV[P.dir];let best=null,bs=-9;for(const e of enemies()){if(e.dead||!LOS9(P.x,P.y-4,e.x,e.y-4))continue;const dx=e.x-P.x,dy=(e.y-10)-(P.y-14),d=Math.hypot(dx,dy);if(d>range||d<1)continue;const c=(dx*v[0]+dy*v[1])/d;if(c>.15){const sc=c-d/range*.5;if(sc>bs){bs=sc;best=[dx/d,dy/d]}}}dv=best||v}
   try{if(Math.abs(dv[0])>Math.abs(dv[1]))P.dir=dv[0]<0?'l':'r';else P.dir=dv[1]<0?'u':'d'}catch(e){}
   return dv}}
// ---------- ข้อ 97: ธนู/คทา ติดสถานะ CC ได้ (ธนู=ชะลอ · คทา=มึน) ----------
{const _sh=shoot;shoot=function(kind,o){_sh(kind,o);try{const p=PROJ[PROJ.length-1];if(!p||p.cc9)return;p.cc9=1;const sk=!!(o&&o.dv&&!o.basic);
    if(kind==='arrow'&&!p.slow&&Math.random()<(sk?.35:.2))p.slow=1.6;
    else if(kind==='bolt'&&!p.stun&&Math.random()<(sk?.3:.14))p.stun=.55}catch(e){}}}
// ---------- ข้อ 65/66: ลดข้อความสแปมตอนทำฟาร์ม ----------
const FARMRX9=/รดน้ำ|ปลูก|เก็บเกี่ยว|ขุด|แปลง|ผลผลิต|เมล็ด|บัวรดน้ำ|ดินแล้ว|จอบ|เคียว/;
{const _ss=sysSay;let last=0,lt='';sysSay=function(t){try{if(D&&D.home&&FARMRX9.test(t)&&!/ไม่พอ|เต็ม|หมด/.test(t)){const n=performance.now();if(t===lt&&n-last<4000)return;if(n-last<900&&!/เก็บเกี่ยวได้/.test(t))return;last=n;lt=t}}catch(e){}return _ss(t)}}

// =====================================================================
