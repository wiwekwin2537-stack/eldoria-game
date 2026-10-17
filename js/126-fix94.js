// fix94 (v4.81) — สกิลสวยขึ้นทุกอาชีพ (เจ้าของสั่ง 2026-10-14 14:06: "ตัวละครสไตล์เดิม แค่เพิ่มให้สกิลมันสวย")
//  ชั้นเอฟเฟกต์เสริม วาดทับบนท่าสกิลเดิม (ไม่แก้ท่า/ดาเมจ/กลไกเดิม):
//   - ทุกสกิล: วงเวทหมุนใต้เท้า + แสงเรืองรอบตัว + ประกายลอยขึ้น (สีตามธาตุของสกิล)
//   - แยกตามชนิดสกิล (ดูจากชื่อ): วงกว้าง = คลื่นกระแทก 2 ชั้น · ยิงไปข้างหน้า = ลำแสงพุ่ง · ตกจากฟ้า = เสาแสงจากฟ้า
//     บัฟ = เสาออร่า+ริบบิ้นเกลียว · พุ่ง/วาร์ป = เส้นลม+เงาค้าง · เรียกสัตว์ = วงอัญเชิญ
//   - ระหว่างสกิลยังทำงาน (3.5 วิ) มอนที่โดน → แสงวาบ+ประกายที่ตัวมอน
//   - ผู้เล่นอื่นเห็นด้วย: ส่ง sx 'fx' ฟิลด์ v94 (ช่องเดิมของเอฟเฟกต์ภาพ ไม่ต้องแก้เซิร์ฟเวอร์)
//  ปิดได้ในตั้งค่า? ไม่ต้อง — เบามาก (สูงสุด 40 เอฟเฟกต์ · วาดแบบ lighter)
try{
const V94={list:[],last:0,hitT:0,el:'255,255,255'};window.V94=V94;
const ELEM94=[[/น้ำแข็ง|หิมะ/,'130,225,255'],[/สายฟ้า|เรลกัน|อาร์เคน/,'160,190,255'],[/พิษ|หนาม|งูเห่า/,'150,255,90'],
 [/ศักดิ์สิทธิ์|แสง|เทพ|สวรรค์|เทวา|เทวทูต|ระฆัง|อวยพร|ชำระ|ศรัทธา|ตัดสิน|รักษา|เยียวยา|วัชระ|อรหันต์/,'255,226,130'],
 [/เงา|วิญญาณ|มรณะ|คำสาป|กระดูก|ค้างคาว|จันทร์โลหิต/,'180,100,255'],[/เพลิง|ไฟ|อุกกาบาต|ระเบิด|มังกร|นภา/,'255,130,50'],
 [/พายุ|วายุ|ลม|เมฆา|ทะยาน|กระจาย/,'120,255,215'],[/ป่า|หมาป่า|ราชสีห์|นาค|เต่า|สัญชาตญาณ|แตร/,'160,245,110'],[/เวท|วาร์ป|ธาตุ/,'200,150,255']];
const TYPE94=[[/ปราการ|ออร่า|อวยพร|กายวัชระ|ผิวเกล็ด|โหมดซุ่ม|สัญชาตญาณ|ปีกเทวทูต|แสงรักษา|ชำระล้าง|เยียวยา|จิตอรหันต์|แตร/,'buff'],
 [/ปลุก|เรียก|ราชสีห์|พญานาค|อัศวินมรณะ|ร่างแยก|กองทัพ|เต่าผู้พิทักษ์|ฝูงค้างคาว/,'summon'],
 [/อุกกาบาต|พิพากษา|ผ่าฟ้า|ลงมา|ร่วงจาก|ตัดสิน|ฝนธนู|ห่าธนู|ห่ากระสุน|ระฆัง/,'sky'],
 [/ทะยาน|วาร์ป|พริบตา|ก้าวเมฆา|พุ่ง|กระโดด|ตีลังกา/,'dash'],
 [/กระทืบ|พายุ|วงแหวน|ระเบิด|คุก|พันเงา|หมุน|ฝ่ามือ|กับดัก|ประทับ/,'aoe']];
const hex2rgb94=h=>{try{const n=parseInt(String(h).slice(1),16);return (n>>16)+','+(n>>8&255)+','+(n&255)}catch(e){return '255,255,255'}};
function info94(cls,i){let S=null;try{S=(CSKILLS[cls]||[])[i]}catch(e){}if(!S)try{S=SKILLS[i]}catch(e){}
 const nm=S?(S.n||S.name||''):'';let col=null,ty='line';for(const [re,c] of ELEM94)if(re.test(nm)){col=c;break}
 if(!col)col=hex2rgb94(CLS[cls]&&CLS[cls].col||'#ffffff');for(const [re,t] of TYPE94)if(re.test(nm)){ty=t;break}return {nm,col,ty}}
function add94(o){o.t0=performance.now();V94.list.push(o);if(V94.list.length>40)V94.list.shift()}
function spark94(x,y,col,n,sp,up){try{for(let k=0;k<n;k++){const a=Math.random()*6.283,v=(sp||90)*(.4+Math.random()*.6);fx.push({x:x+(Math.random()-.5)*8,y:y+(Math.random()-.5)*8,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6-(up||0),l:.35+Math.random()*.45,c:col})}}catch(e){}}
// เริ่มเอฟเฟกต์ของสกิล (ใช้ทั้งของเราและของผู้เล่นอื่น)
function cast94(x,y,cls,i,dir){const I=info94(cls,i),dv=DIRV[dir]||[0,1],c=I.col;
 add94({k:'cast',x,y,c,dur:.85});
 if(I.ty==='aoe'){add94({k:'wave',x,y,c,dur:.6,r:120});add94({k:'wave',x,y,c,dur:.85,r:170,d:.12});add94({k:'disk',x,y,c,dur:.7,r:110})}
 else if(I.ty==='line')add94({k:'beam',x,y:y-14,c,dur:.45,dx:dv[0],dy:dv[1],len:230});
 else if(I.ty==='sky'){const tx=x+dv[0]*90,ty=y+dv[1]*70;add94({k:'pillar',x:tx,y:ty,c,dur:.9,w:46,h:420});add94({k:'wave',x:tx,y:ty,c,dur:.7,r:140,d:.15})}
 else if(I.ty==='buff')add94({k:'aura',x,y,c,dur:1.6,follow:x===P.x&&y===P.y});
 else if(I.ty==='dash')add94({k:'dash',x,y,c,dur:.5,dx:dv[0],dy:dv[1]});
 else if(I.ty==='summon'){const tx=x+dv[0]*46,ty=y+dv[1]*36;add94({k:'sumc',x:tx,y:ty,c,dur:1.3});add94({k:'pillar',x:tx,y:ty,c,dur:.8,w:34,h:160,up:1})}
 spark94(x,y-14,c,14,110,40);return I}
window.cast94=cast94;
// ใช้สกิลสำเร็จ (มานาลด) → เอฟเฟกต์ + บอกคนอื่น
{const _us=useSkill;useSkill=function(i){const mp0=P.mp,cd0=JSON.stringify((window.CS&&CS.cd)||[]);const r=_us.apply(this,arguments);
  try{if(P.mp<mp0-.5||JSON.stringify((window.CS&&CS.cd)||[])!==cd0){const I=cast94(P.x,P.y,P.cls||'none',i,P.dir);V94.last=performance.now();V94.el=I.col;
    try{if(NET.on&&NET.others&&NET.others.size)netSend({t:'sx',k:'fx',v:[],p:[],e:[],v94:[P.cls||'none',i|0,P.dir]})}catch(e){}}}catch(e){}
  return r};window.useSkill=useSkill}
{const _o=onSx33;onSx33=function(d){try{if(d&&d.k==='fx'&&Array.isArray(d.v94)&&d.sc===netScene()){const o=NET.others.get(d.from);
   if(o){const cls=String(d.v94[0]||'none'),i=d.v94[1]|0,dir=['l','r','u','d'].indexOf(d.v94[2])>=0?d.v94[2]:'d';if(CLS[cls])cast94(o.x,o.y,cls,i,dir)}}}catch(e){}return _o.apply(this,arguments)};window.onSx33=onSx33}
// มอนโดนสกิล → แสงวาบ
{const _h=hurtE;hurtE=function(e,mult,o){const r=_h.apply(this,arguments);try{const now=performance.now();if(e&&!e.pvp7&&now-V94.last<3500&&now-V94.hitT>35&&(typeof r!=='number'||r>0)){V94.hitT=now;
   const sc=e.sc||1;add94({k:'hit',x:e.x,y:e.y-14*sc,c:V94.el,dur:.28});spark94(e.x,e.y-14*sc,V94.el,5,140)}}catch(e2){}return r};window.hurtE=hurtE}
// ---------- วาด ----------
const glow94=(x,y,r,c,a)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+c+','+a+')');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)};
function rune94(x,y,r,c,a,rot){ctx.save();ctx.translate(x,y);ctx.scale(1,.5);ctx.rotate(rot);ctx.strokeStyle='rgba('+c+','+a+')';ctx.lineWidth=2;
 ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.stroke();ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,r*.78,0,6.283);ctx.stroke();
 ctx.beginPath();for(let k=0;k<6;k++){const q=k*2*6.283/6;ctx[k?'lineTo':'moveTo'](Math.cos(q)*r*.78,Math.sin(q)*r*.78)}ctx.closePath();ctx.stroke();
 ctx.beginPath();for(let k=0;k<6;k++){const q=(k*2+1)*6.283/6;ctx[k?'lineTo':'moveTo'](Math.cos(q)*r*.78,Math.sin(q)*r*.78)}ctx.closePath();ctx.stroke();
 ctx.fillStyle='rgba('+c+','+a+')';for(let k=0;k<12;k++){const q=k*6.283/12;ctx.fillRect(Math.cos(q)*r*.89-1.5,Math.sin(q)*r*.89-1.5,3,3)}ctx.restore()}
function draw94(){const L=V94.list;if(!L.length)return;const now=performance.now();ctx.save();ctx.globalCompositeOperation='lighter';
 for(let n=L.length-1;n>=0;n--){const o=L[n],t=(now-o.t0)/1000-(o.d||0);if(t>o.dur){L.splice(n,1);continue}if(t<0)continue;const k=t/o.dur,f=1-k,c=o.c;
  try{if(o.follow){o.x=P.x;o.y=P.y}
  if(o.k==='cast'){const r=26+k*14;rune94(o.x,o.y,r,c,.85*f,now/400);glow94(o.x,o.y-18,46,c,.35*f);if(Math.random()<.5)spark94(o.x+(Math.random()-.5)*40,o.y,c,1,20,60)}
  else if(o.k==='wave'){const r=o.r*(.15+k*.85);ctx.save();ctx.translate(o.x,o.y);ctx.scale(1,.5);ctx.strokeStyle='rgba('+c+','+(.85*f)+')';ctx.lineWidth=10*f+2;ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.stroke();
   ctx.strokeStyle='rgba(255,255,255,'+(.6*f)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.96,0,6.283);ctx.stroke();ctx.restore()}
  else if(o.k==='disk'){ctx.save();ctx.translate(o.x,o.y);ctx.scale(1,.5);glow94(0,0,o.r*(.6+k*.5),c,.45*f);ctx.restore()}
  else if(o.k==='beam'){const len=o.len*Math.min(1,k*3),x2=o.x+o.dx*len,y2=o.y+o.dy*len*.8;
   for(const [w,a,cc] of [[18,.35,c],[7,.7,c],[2.5,.95,'255,255,255']]){ctx.strokeStyle='rgba('+cc+','+(a*f)+')';ctx.lineWidth=w*(.6+f*.4);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(x2,y2);ctx.stroke()}
   glow94(o.x,o.y,34,c,.6*f);glow94(x2,y2,30,c,.5*f);if(Math.random()<.7)spark94(x2,y2,c,2,80)}
  else if(o.k==='pillar'){const w=o.w*(o.up?1:(1-k*.4)),top=o.up?o.y-o.h*Math.min(1,k*2.2):o.y-o.h;const g=ctx.createLinearGradient(0,top,0,o.y);g.addColorStop(0,'rgba('+c+',0)');g.addColorStop(.7,'rgba('+c+','+(.55*f)+')');g.addColorStop(1,'rgba(255,255,255,'+(.8*f)+')');
   ctx.fillStyle=g;ctx.fillRect(o.x-w/2,top,w,o.y-top);ctx.fillStyle='rgba(255,255,255,'+(.5*f)+')';ctx.fillRect(o.x-w*.12,top,w*.24,o.y-top);
   ctx.save();ctx.translate(o.x,o.y);ctx.scale(1,.45);glow94(0,0,w*1.6,c,.6*f);ctx.restore();if(Math.random()<.6)spark94(o.x+(Math.random()-.5)*w,o.y,c,1,30,120)}
  else if(o.k==='aura'){const h=70+20*Math.sin(t*6);const g=ctx.createLinearGradient(0,o.y-h,0,o.y);g.addColorStop(0,'rgba('+c+',0)');g.addColorStop(1,'rgba('+c+','+(.32*f)+')');ctx.fillStyle=g;
   ctx.beginPath();ctx.ellipse(o.x,o.y-h/2,22,h/2,0,0,6.283);ctx.fill();
   ctx.strokeStyle='rgba('+c+','+(.8*f)+')';ctx.lineWidth=2;for(let s=0;s<2;s++){ctx.beginPath();for(let q=0;q<=20;q++){const yy=o.y-q*4,a=t*7+q*.45+s*Math.PI;ctx.lineTo(o.x+Math.cos(a)*20,yy+Math.sin(a)*4)}ctx.stroke()}
   rune94(o.x,o.y,30,c,.6*f,-now/500)}
  else if(o.k==='dash'){for(let s=0;s<6;s++){const off=(s-2.5)*7,px=-o.dy,py=o.dx,x1=o.x+px*off-o.dx*(30+s*6),y1=o.y-14+py*off-o.dy*(30+s*6);
    ctx.strokeStyle='rgba('+c+','+(.7*f)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-o.dx*60*f,y1-o.dy*60*f);ctx.stroke()}glow94(o.x,o.y-16,40,c,.5*f)}
  else if(o.k==='sumc'){rune94(o.x,o.y,36*Math.min(1,k*3),c,.9*f,now/300);rune94(o.x,o.y,22,c,.7*f,-now/250);glow94(o.x,o.y-10,50,c,.4*f)}
  else if(o.k==='hit'){const r=10+k*22;glow94(o.x,o.y,r*1.6,c,.8*f);ctx.strokeStyle='rgba(255,255,255,'+(.9*f)+')';ctx.lineWidth=2;ctx.beginPath();
   for(let s=0;s<4;s++){const a=s*Math.PI/2+.4;ctx.moveTo(o.x,o.y);ctx.lineTo(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r)}ctx.stroke()}}catch(e){}}
 ctx.restore()}
{const _dt=drawDmgTxt;drawDmgTxt=function(dt){try{draw94()}catch(e){}return _dt.apply(this,arguments)};window.drawDmgTxt=drawDmgTxt}
}catch(e){console.warn('fix94',e)}
