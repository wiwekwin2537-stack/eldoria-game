/* v5.78 ภาพมอนสเตอร์ชุด 1 จาก ChatGPT: ด้วง · โกเลม · ค้างคาว · โครงกระดูก (4 ทิศ: หน้า · ซ้าย · ขวา · หลัง)
   - ครอบ MOBDRAW เดิม: ภาพยังไม่โหลด/พัง → วาดด้วยโค้ดเดิมทุกอย่าง · ไม่เปลี่ยนเลือด/ดาเมจ/ดรอป/XP/ขนาดชนกัน
   - ภาพเป็นสีม่วงเข้มสีเดียว แต่ในเกมมอนตระกูลเดียวกันมีหลายสี (ปู สการับ โกเลมน้ำแข็ง ฯลฯ) → ย้อมสีตามชุดสีของมอนตัวนั้น (ความสว่าง → ไล่สีเข้ม..อ่อน · ดวงตา → สีเรืองแสง) แล้วเก็บแคชต่อชุดสี
   - ภาพนิ่ง 4 ทิศ ไม่มีเฟรมเดิน → ขยับด้วยโค้ด (เด้ง/โยกตามระยะที่เดินจริง · ค้างคาวกระพือโดยยืดปีก) · ทิศ: เดินขึ้น-ลงเป็นหน้า/หลัง ที่เหลือเป็นด้านข้างหันขวา (ตัวเกมพลิกซ้ายให้เอง)
   - โกเลม: ภาพต้นฉบับสลับลำดับ (ช่อง 2 หันขวา) จัดการในตาราง side */
(function(){
const SPEC={
 beetle:{src:'assets/monsters/beetle-v578.webp',k:.25,side:[2,1],cells:[[13,1,93,120],[122,3,116,118],[242,3,115,118],[372,1,96,120]]},
 golem:{src:'assets/monsters/golem-v578.webp',k:.33,side:[1,2],cells:[[2,1,97,128],[125,1,56,128],[226,1,57,128],[308,1,98,128]]},
 bat:{src:'assets/monsters/bat-v578.webp',k:.31,side:[2,1],cells:[[2,6,144,67],[161,1,121,72],[310,1,119,72],[446,5,143,68]]},
 skeleton:{src:'assets/monsters/skeleton-v578.webp',k:.34,side:[2,1],cells:[[2,1,70,128],[86,1,49,128],[160,1,49,128],[224,1,70,128]]}
};
const MA={spec:SPEC,tint:new Map(),on:true};window.MOBART578=MA;
const hex=s=>{s=String(s||'').trim();let m=/^#([0-9a-f]{6})$/i.exec(s);if(m){const n=parseInt(m[1],16);return[n>>16&255,n>>8&255,n&255]}m=/^#([0-9a-f]{3})$/i.exec(s);if(m){const v=m[1];return[parseInt(v[0]+v[0],16),parseInt(v[1]+v[1],16),parseInt(v[2]+v[2],16)]}return null};
const lerp=(a,b,t)=>a+(b-a)*t;
for(const f in SPEC){const S=SPEC[f];S.img=new Image();S.ok=false;S.img.decoding='async';
 S.img.onload=()=>{try{if(!(S.img.naturalWidth>0))return;const c=document.createElement('canvas');c.width=S.img.naturalWidth;c.height=S.img.naturalHeight;const q=c.getContext('2d');q.drawImage(S.img,0,0);S.src0=q.getImageData(0,0,c.width,c.height);const d=S.src0.data,Ls=[];for(let i=0;i<d.length;i+=4){if(d[i+3]>0&&!(d[i+2]>180&&d[i]>100&&d[i+1]<110))Ls.push(.299*d[i]+.587*d[i+1]+.114*d[i+2])}Ls.sort((a,b)=>a-b);S.lo=Ls[Math.floor(Ls.length*.02)]||0;S.hi=Ls[Math.floor(Ls.length*.98)]||255;if(S.hi-S.lo<20)S.hi=S.lo+20;S.ok=true}catch(e){S.ok=false}};
 S.img.onerror=()=>{S.ok=false};S.img.src=S.src}
/* ย้อมสีทั้งแผ่น: ความสว่าง (ตัดช่วง 2–98%) → ไล่ระหว่างสีเข้ม c[1] กับสีอ่อน c[0] · พิกเซลม่วงเรืองแสง (ดวงตา) → c[2] */
function tinted(f,c){const S=SPEC[f],a=hex(c&&c[0]),b=hex(c&&c[1]),e=hex(c&&c[2]);if(!S.ok||!S.src0||!a||!b||!e)return null;const key=f+'|'+c[0]+c[1]+c[2];let t=MA.tint.get(key);if(t)return t;
 const W=S.src0.width,H=S.src0.height,out=new ImageData(W,H),s=S.src0.data,o=out.data,span=S.hi-S.lo;
 for(let i=0;i<s.length;i+=4){const al=s[i+3];if(!al)continue;const r=s[i],g=s[i+1],bl=s[i+2];
  if(bl>180&&r>100&&g<110){o[i]=e[0];o[i+1]=e[1];o[i+2]=e[2];o[i+3]=al;continue}
  let u=((.299*r+.587*g+.114*bl)-S.lo)/span;u=u<0?0:u>1?1:u;
  o[i]=lerp(b[0],a[0],u);o[i+1]=lerp(b[1],a[1],u);o[i+2]=lerp(b[2],a[2],u);o[i+3]=al}
 t=document.createElement('canvas');t.width=W;t.height=H;t.getContext('2d').putImageData(out,0,0);if(MA.tint.size>80)MA.tint.clear();MA.tint.set(key,t);return t}
function wrap(f){const orig=MOBDRAW[f];if(typeof orig!=='function'||orig.__art578)return;
 const fn=function(m,t,c){const S=SPEC[f];let sheet=null;try{sheet=MA.on&&S.ok?tinted(f,c):null}catch(e){sheet=null}
  if(!sheet)return orig.apply(this,arguments);
  const fake=m.x==null||(m.x===0&&m.y===0);let v=2;let ph=0,moving=false;
  if(!fake){const dx=m.x-(m._ax==null?m.x:m._ax),dy=m.y-(m._ay==null?m.y:m._ay),d=Math.hypot(dx,dy);m._ax=m.x;m._ay=m.y;
   if(d>.3){m._av=Math.abs(dy)>Math.abs(dx)*1.3?(dy>0?0:3):2;if(Math.abs(dx)>.2)m._asx=dx>0?1:-1}
   if(d>0&&d<40)m._aph=(m._aph||0)+d*2*Math.PI/20;ph=m._aph||0;moving=d>.15||!!m.mv;v=m._av==null?2:m._av}else v=0;
  if(f==='bat'&&!fake){const sx=m._asx||(m.fx<0?-1:1);v=(m._av===0||m._av===3)?m._av:(sx>0?S.side[0]:S.side[1])}
  else if(v===2)v=S.side[0];
  const B=S.cells[v],k=S.k,w=B[2]*k,h=B[3]*k;
  ctx.save();
  try{
   if(f==='bat'){const fl=Math.sin(t*(m.st==='wu'?30:16)),z=-14+Math.sin(t*3)*3;ctx.translate(0,z-6);ctx.scale(1,1+.12*fl)}
   else{const bob=moving?-Math.abs(Math.sin(ph))*(f==='beetle'?1:1.6):Math.sin(t*2)*.5;ctx.translate(0,bob);if(moving&&f!=='beetle')ctx.rotate(Math.sin(ph)*.04);
    else if(moving)ctx.scale(1+Math.sin(ph*2)*.04,1);
    if(m.st==='wu'||m.st==='slamWU'){ctx.scale(1.05,.94)}else if(m.st==='strike'||m.st==='slam'){ctx.translate(0,-1);ctx.scale(.96,1.05)}}
   const dy=f==='bat'?-h/2:-h;ctx.drawImage(sheet,B[0],B[1],B[2],B[3],-w/2,dy,w,h);
   if(m.hurt>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6;ctx.drawImage(sheet,B[0],B[1],B[2],B[3],-w/2,dy,w,h)}
  }finally{ctx.restore()}};
 fn.__art578=1;fn.orig=orig;MOBDRAW[f]=fn}
for(const f in SPEC)wrap(f);
})();
if(window.REG136)REG136.push(['ภาพมอนชุด 1: ด้วง/โกเลม/ค้างคาว/โครงกระดูกวาดจากภาพ ย้อมสีตามชนิด · ภาพพัง → วาดเดิม (v578)',async()=>{const A=window.MOBART578;if(!A)return'ไม่มีระบบภาพมอน';const need=['beetle','golem','bat','skeleton'];for(let i=0;i<60&&!need.every(f=>A.spec[f].ok);i++)await new Promise(r=>setTimeout(r,100));
 const px=(f,col,ok)=>{const c=document.createElement('canvas');c.width=c.height=160;const k=c.getContext('2d'),sv=ctx,S=A.spec[f],was=S.ok,wasOn=A.on;ctx=k;try{S.ok=ok;k.translate(80,120);MOBDRAW[f]({x:0,y:0,f,fx:1,sc:1,mv:false,st:'idle',hurt:0,F:{r:10},t:0},1,col)}finally{ctx=sv;S.ok=was;A.on=wasOn}const d=k.getImageData(0,0,160,160).data;let n=0,r=0,g=0,b=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>200){n++;r+=d[i];g+=d[i+1];b+=d[i+2]}return{n,r:r/(n||1),g:g/(n||1),b:b/(n||1)}};
 for(const f of need){if(!A.spec[f].ok)return f+' ภาพไม่โหลด';if(typeof MOBDRAW[f].orig!=='function')return f+' ไม่ได้ครอบตัววาดเดิม';
  const red=px(f,['#e04a3a','#5a1008','#ffff00'],true),blu=px(f,['#3a6ae0','#081a5a','#ffff00'],true),old=px(f,['#e04a3a','#5a1008','#ffff00'],false);
  if(red.n<150)return f+' วาดจากภาพไม่ขึ้น';if(!(red.r>red.b*1.25&&blu.b>blu.r*1.25))return f+' ย้อมสีไม่ตามชุดสี';if(old.n<30)return f+' ภาพพัง แต่ตัววาดเดิมไม่ขึ้น'}return null}]);
