/* v5.84 ภาพวิ่ง 8 เฟรม × 4 ทิศ แทนตัด/หมุนขาจากภาพนิ่ง v581
   แก้ตัวรับภาพ v578 ตรงนี้ ไม่เพิ่มชั้นครอบ MOBDRAW; ไม่แตะเลือด ดาเมจ ดรอป XP หรือการชน
   ภาพวิ่งโหลดพลาดใช้ภาพนิ่ง v578; ไม่เรียกตัววาดรูปทรงเดิมในเส้นทางวาดมอนชุดนี้ */
(function(){
const SPEC={
 beetle:{src:'assets/monsters/beetle-v578.webp',k:.25,side:[2,1],stride:22,height:33,cells:[[13,1,93,120],[122,3,116,118],[242,3,115,118],[372,1,96,120]]},
 golem:{src:'assets/monsters/golem-v578.webp',k:.33,side:[1,2],stride:30,height:45,cells:[[2,1,97,128],[125,1,56,128],[226,1,57,128],[308,1,98,128]]},
 bat:{src:'assets/monsters/bat-v578.webp',k:.31,side:[2,1],stride:24,height:58,cells:[[2,6,144,67],[161,1,121,72],[310,1,119,72],[446,5,143,68]]},
 skeleton:{src:'assets/monsters/skeleton-v578.webp',k:.34,side:[2,1],stride:28,height:46,cells:[[2,1,70,128],[86,1,49,128],[160,1,49,128],[224,1,70,128]]}
};
const MA={spec:SPEC,tint:new Map(),on:true,maxPixels:4194304,pixels:0};window.MOBART578=MA;
const hex=s=>{s=String(s||'').trim();let m=/^#([0-9a-f]{6})$/i.exec(s);if(m){const n=parseInt(m[1],16);return[n>>16&255,n>>8&255,n&255]}m=/^#([0-9a-f]{3})$/i.exec(s);if(m){const v=m[1];return[parseInt(v[0]+v[0],16),parseInt(v[1]+v[1],16),parseInt(v[2]+v[2],16)]}return null};
function load(src,target){target.img=new Image();target.ok=false;target.img.decoding='async';
 target.img.onload=()=>{try{const W=target.img.naturalWidth,H=target.img.naturalHeight;if(!W||!H)return;if(target.run&&(W!==512||H!==320))return;
 const c=document.createElement('canvas');c.width=W;c.height=H;const q=c.getContext('2d',{willReadFrequently:true});q.drawImage(target.img,0,0);target.src0=q.getImageData(0,0,W,H);
 const d=target.src0.data,hist=new Uint32Array(256);let n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>40&&!(d[i+2]>180&&d[i]>100&&d[i+1]<110)){hist[Math.round(.299*d[i]+.587*d[i+1]+.114*d[i+2])]++;n++}
 let acc=0;target.lo=0;target.hi=255;for(let j=0;j<256;j++){acc+=hist[j];if(acc<n*.02)target.lo=j;if(acc<n*.98)target.hi=j+1}if(target.hi-target.lo<20)target.hi=target.lo+20;target.ok=true;
 }catch(e){target.ok=false}};target.img.onerror=()=>{target.ok=false};target.img.src=src}
for(const f in SPEC){const S=SPEC[f];load(S.src,S);S.atlas={run:true};load('assets/incoming/monster-'+f+'-run-20261023.png',S.atlas)}
/* แคชแบบ LRU จำกัดพิกเซล ~16 MB; ย้อมเมื่อเจอชุดสีใหม่เท่านั้น ไม่สร้าง canvas/ตัดขาขณะวาด */
function tinted(f,c,T){const a=hex(c&&c[0]),b=hex(c&&c[1]),e=hex(c&&c[2]);if(!T.src0||!a||!b||!e)return T.img;
 const key=f+'|'+(T.run?'run':'still')+'|'+c.join('|');let cv=MA.tint.get(key);if(cv){MA.tint.delete(key);MA.tint.set(key,cv);return cv}
 const W=T.src0.width,H=T.src0.height,out=new ImageData(W,H),s=T.src0.data,o=out.data,span=T.hi-T.lo;
 for(let i=0;i<s.length;i+=4){if(!s[i+3])continue;const r=s[i],g=s[i+1],bl=s[i+2];let u=Math.max(0,Math.min(1,((.299*r+.587*g+.114*bl)-T.lo)/span));
 if(bl>180&&r>100&&g<110){o[i]=e[0];o[i+1]=e[1];o[i+2]=e[2]}else{for(let j=0;j<3;j++)o[i+j]=b[j]+(a[j]-b[j])*u}o[i+3]=s[i+3]}
 cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.getContext('2d').putImageData(out,0,0);
 while(MA.pixels+W*H>MA.maxPixels&&MA.tint.size){const k=MA.tint.keys().next().value,old=MA.tint.get(k);MA.pixels-=old.width*old.height;MA.tint.delete(k)}MA.tint.set(key,cv);MA.pixels+=W*H;return cv}
function pose(f,m,t){const S=SPEC[f],fake=m.x==null||(m.x===0&&m.y===0);let v=0,phase=0,moving=false;
 if(!fake){const dx=m.x-(m._ax==null?m.x:m._ax),dy=m.y-(m._ay==null?m.y:m._ay),d=Math.hypot(dx,dy);m._ax=m.x;m._ay=m.y;
 if(d>.05&&d<40){m._av=Math.abs(dy)>Math.abs(dx)*1.3?(dy>0?0:3):2;if(Math.abs(dx)>.05)m._asx=dx>0?1:-1;m._aph=((m._aph||0)+d*2*Math.PI/S.stride)%(2*Math.PI)}
 phase=m._aph||0;moving=d>.05&&d<40||!!m.mv;v=m._av==null?2:m._av}
 /* drawMob พลิกซ้ายให้มอนบนพื้นอยู่แล้ว; ค้างคาวไม่ถูกพลิกจึงใช้แถวซ้ายจริง */
 const row=v===0?0:v===3?3:f==='bat'&&(m._asx||(m.fx<0?-1:1))<0?2:1;
 const frame=f==='bat'?Math.floor(Math.max(0,t)*12)%8:moving?Math.floor(((phase/(2*Math.PI))%1+1)%1*8):0;
 return {v,row,frame,moving,fake}}
MA.pose=pose;
for(const f in SPEC){const orig=MOBDRAW[f];if(typeof orig!=='function')continue;
 const fn=function(m,t,c){const S=SPEC[f],p=pose(f,m,t),T=MA.on&&S.ok&&S.atlas.ok?S.atlas:S;
 if(!T.img.naturalWidth)return;const sheet=tinted(f,c,T);ctx.save();try{
 let B,w,h,dy;if(T.run){B=[p.frame*64,p.row*80,64,80];h=S.height;w=h*.8;dy=f==='bat'?-h-8:-h}
 else{const v=p.v===2?(f==='bat'&&p.row===2?S.side[1]:S.side[0]):p.v;B=S.cells[v];w=B[2]*S.k;h=B[3]*S.k;dy=f==='bat'?-h-8:-h}
 if(m.st==='wu'||m.st==='slamWU')ctx.scale(1.05,.94);else if(m.st==='strike'||m.st==='slam')ctx.scale(.96,1.05);
 ctx.drawImage(sheet,B[0],B[1],B[2],B[3],-w/2,dy,w,h);
 if(m.hurt>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6;ctx.drawImage(sheet,B[0],B[1],B[2],B[3],-w/2,dy,w,h)}
 }finally{ctx.restore()}};
 fn.__art578=1;fn.orig=orig;MOBDRAW[f]=fn}
})();
if(window.REG136)REG136.push(['ภาพมอนชุด 1: ด้วง/โกเลม/ค้างคาว/โครงกระดูกวาดจากภาพ ย้อมสีตามชนิด · ภาพวิ่งพัง → ภาพนิ่งสำรอง (v578)',async()=>{const A=window.MOBART578;if(!A)return'ไม่มีระบบภาพมอน';const need=['beetle','golem','bat','skeleton'];for(let i=0;i<60&&!need.every(f=>A.spec[f].ok);i++)await new Promise(r=>setTimeout(r,100));
 const px=(f,col,ok)=>{const c=document.createElement('canvas');c.width=c.height=160;const k=c.getContext('2d'),sv=ctx,S=A.spec[f],was=S.ok,wasOn=A.on;ctx=k;try{S.ok=ok;k.translate(80,120);MOBDRAW[f]({x:0,y:0,f,fx:1,sc:1,mv:false,st:'idle',hurt:0,F:{r:10},t:0},1,col)}finally{ctx=sv;S.ok=was;A.on=wasOn}const d=k.getImageData(0,0,160,160).data;let n=0,r=0,g=0,b=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>200){n++;r+=d[i];g+=d[i+1];b+=d[i+2]}return{n,r:r/(n||1),g:g/(n||1),b:b/(n||1)}};
 for(const f of need){if(!A.spec[f].ok)return f+' ภาพไม่โหลด';if(typeof MOBDRAW[f].orig!=='function')return f+' ไม่ได้ครอบตัววาดเดิม';
  const red=px(f,['#e04a3a','#5a1008','#ffff00'],true),blu=px(f,['#3a6ae0','#081a5a','#ffff00'],true),old=px(f,['#e04a3a','#5a1008','#ffff00'],false);
  if(red.n<150)return f+' วาดจากภาพไม่ขึ้น';if(!(red.r>red.b*1.25&&blu.b>blu.r*1.25))return f+' ย้อมสีไม่ตามชุดสี';if(old.n<30)return f+' ภาพพัง แต่ตัววาดเดิมไม่ขึ้น'}return null}]);
if(window.REG136)REG136.push(['มอนภาพ: เดินแล้วขาขยับ · ยืนนิ่งภาพคงที่ (v584)',async()=>{
 const A=window.MOBART578;if(!A)return'ไม่มีระบบภาพมอน';for(let i=0;i<100&&!Object.values(A.spec).every(s=>s.atlas.ok);i++)await new Promise(r=>setTimeout(r,100));
 for(const f of Object.keys(A.spec)){const S=A.spec[f];if(!S.atlas.ok)return f+' ภาพวิ่งไม่โหลด';const c=document.createElement('canvas');c.width=c.height=100;const sv=ctx;ctx=c.getContext('2d');
 try{const shot=(ph,mv)=>{ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,100,100);ctx.translate(50,90);ctx.scale(1.8,1.8);MOBDRAW[f]({x:5,y:5,_ax:5,_ay:5,_av:2,_aph:ph,mv,st:'idle',hurt:0},1,['#aaa','#333','#f80']);return c.toDataURL()};if(f!=='bat'&&shot(0,true)===shot(Math.PI/2,true))return f+' เฟรมวิ่งไม่เปลี่ยน';if(f!=='bat'&&shot(0,false)!==shot(Math.PI/2,false))return f+' ยืนแล้วภาพเปลี่ยน'}finally{ctx=sv}}
 return null}]);
if(window.REG136)REG136.push(['มอนภาพ: 8 เฟรมตามระยะจริง · ไม่ตัดขา/เรียกวาดรูปทรง · แคชจำกัด (v584)',()=>{
 const A=window.MOBART578;if(!A)return'ไม่มีระบบภาพมอน';for(const f of['beetle','golem','skeleton']){const S=A.spec[f],m={x:5,y:5,_ax:5,_ay:5,_av:2,_aph:0,mv:true};const frames=new Set();for(let i=0;i<8;i++){frames.add(A.pose(f,m,1).frame);m.x+=S.stride/8}if(frames.size!==8)return f+' เฟรมไม่ครบ 8';m.x+=1000;if(!Number.isFinite(A.pose(f,m,1).frame))return f+' ย้ายฉากเฟรมพัง'}
 if(A.pixels>A.maxPixels)return'แคชภาพเกินเพดาน';return null}]);
