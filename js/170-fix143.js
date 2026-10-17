// =====================================================================
// fix143 (v5.03) — 🎬 สกิลแบบ MMORPG 2D (เจ้าของ: "ใช้สกิลต้องมีท่าทาง · นินจาต้องเป็นเงาวับสับไปมา · วาปต้องมีเงาพุ่ง · แยกร่างต้องเป็นร่างนินจา ไม่ใช่กระดูก")
//  1) เงาตัวละคร (afterimage) วาดจากตัวละครจริง (ชุด/อาวุธที่ใส่) ย้อมสีตามอาชีพ
//  2) ทุกสกิลที่พุ่ง/วาป (ตัวละครย้ายตำแหน่งทันที) → เงาไล่ตามทาง + เส้นแสงพุ่ง
//  3) อัลตินินจา "พันเงาพิฆาต": ตัวจริงหายเป็นเงา วาบไปฟันศัตรูทีละตัว (เงาโผล่ข้างเป้า + รอยดาบเสี้ยวจันทร์) ปิดท้ายฟันกากบาท
//  4) ร่างแยกเงา (นินจา) = เงานินจาจริง แทนโครงกระดูก
//  5) ใช้สกิลทุกครั้ง: วงเวทหมุนใต้เท้า + แสงลอยขึ้น + ตัวลอยนิดหนึ่ง (ท่าร่าย) สีตามอาชีพ
//  6) กระสุนเวท (ฉีดเวท): หางแสงไล่ แกนสว่าง ประกายตอนยิง และระเบิดตอนโดน
// =====================================================================
try{
const now=()=>performance.now();
const CC={sword:'150,205,255',mage:'150,120,255',archer:'255,210,90',ninja:'140,120,255',sniper:'120,230,255',paladin:'255,232,150',cleric:'190,240,255',necro:'120,255,170',monk:'255,180,100',dragoon:'255,110,90',summoner:'160,225,110',none:'255,240,200'};
const rgbOf=()=>CC[P.cls]||CC.none;
const TINT={ninja:'brightness(.32) sepia(1) hue-rotate(210deg) saturate(2.4)',mage:'brightness(.9) sepia(1) hue-rotate(200deg) saturate(3)',sword:'brightness(.85) sepia(1) hue-rotate(175deg) saturate(2)',monk:'brightness(.95) sepia(1) hue-rotate(-5deg) saturate(2.5)',dragoon:'brightness(.8) sepia(1) hue-rotate(-30deg) saturate(3)',paladin:'brightness(1.1) sepia(1) hue-rotate(5deg) saturate(1.6)'};
const tintOf=c=>c||P.cls;
const FILT=(()=>{try{const k=document.createElement('canvas').getContext('2d');k.filter='blur(1px)';return k.filter==='blur(1px)'}catch(e){return false}})();
// ---------- 1) วาดเงาตัวละคร ----------
let HIDE=0;
const GOFF=document.createElement('canvas');GOFF.width=GOFF.height=128;const GK=GOFF.getContext('2d');
const TCOL={ninja:'34,26,80',mage:'90,80,230',sword:'70,120,200',monk:'200,130,40',dragoon:'180,50,40',paladin:'220,190,90',cleric:'140,200,240',necro:'40,140,90',summoner:'80,150,60',archer:'200,150,40',sniper:'60,160,200'};
function ghost(x,y,dir,a,tint,at,glow){if(a<=.02)return;const sv={x:P.x,y:P.y,dir:P.dir,mv:P.mv,at:P.at,dash:P.dash,t:P.t,draw:P.draw},od=window._drawingOther,hid=HIDE,sc=ctx;
 try{GK.setTransform(1,0,0,1,0,0);GK.globalCompositeOperation='source-over';GK.clearRect(0,0,128,128);ctx=GK;window._drawingOther=true;HIDE=0;P.x=64;P.y=100;P.dir=dir||P.dir;P.mv=false;P.at=at==null?-1:at;P.dash=0;P.draw=true;heroBody()}
 catch(e){}finally{ctx=sc;Object.assign(P,sv);window._drawingOther=od;HIDE=hid}
 try{const col=(typeof tint==='string'&&/^\d/.test(tint))?tint:(TCOL[tint]||TCOL[P.cls]||'40,30,90');GK.setTransform(1,0,0,1,0,0);GK.globalCompositeOperation='source-atop';GK.fillStyle='rgba('+col+',.86)';GK.fillRect(0,0,128,128);GK.globalCompositeOperation='source-over';
  ctx.save();if(glow){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-18,2,x,y-18,38);g.addColorStop(0,'rgba('+glow+','+(.55*a)+')');g.addColorStop(1,'rgba('+glow+',0)');ctx.fillStyle=g;ctx.fillRect(x-38,y-56,76,76);ctx.globalCompositeOperation='source-over'}
  ctx.globalAlpha*=a;ctx.drawImage(GOFF,x-64,y-100);if(glow){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.35;ctx.drawImage(GOFF,x-65,y-101);ctx.drawImage(GOFF,x-63,y-99)}ctx.restore()}catch(e){}}
window.ghost143=ghost;
const G=[],ST=[];window.G143=G;
const addG=(x,y,dir,o)=>{o=o||{};G.push({x,y,dir,t:0,l:o.l||.42,a:o.a||.7,at:o.at,tint:o.tint||tintOf(P.cls),glow:o.glow||rgbOf(),dl:o.dl||0});if(G.length>40)G.shift()};
const addStreak=(x0,y0,x1,y1,rgb,l,w)=>{ST.push({x0,y0,x1,y1,rgb:rgb||rgbOf(),t:0,l:l||.3,w:w||10});if(ST.length>20)ST.shift()};
{const _hb=heroBody;heroBody=function(){if(HIDE&&!window._drawingOther&&!window.__IN_OTHER8)return;let lift=0;try{if(CAST.t<CAST.l&&!window._drawingOther&&!window.__IN_OTHER8)lift=Math.sin(Math.min(1,CAST.t/CAST.l)*Math.PI)*3.5}catch(e){}
  if(!lift)return _hb.apply(this,arguments);ctx.save();ctx.translate(0,-lift);try{return _hb.apply(this,arguments)}finally{ctx.restore()}};window.heroBody=heroBody}
// ---------- 5) วงเวทตอนใช้สกิล ----------
const CAST={t:9,l:.55,rgb:'255,255,255',big:0};
let LASTSK=0;
{const _u=useSkill;useSkill=function(i){const c0=(CS.cd&&CS.cd[i])||0;const r=_u.apply(this,arguments);try{if(((CS.cd&&CS.cd[i])||0)>c0+.01){LASTSK=now();Object.assign(CAST,{t:0,l:i>=3?.75:.55,rgb:rgbOf(),big:i>=2?1:0});
   for(let k=0;k<(i>=2?18:10);k++){const a=Math.random()*6.28,r0=14+Math.random()*16;rfxP(P.x+Math.cos(a)*r0,P.y+Math.sin(a)*r0*.4,0,-40-Math.random()*60,.7,CAST.rgb,1.6+Math.random()*1.4,'spark')}}}catch(e){}return r};window.useSkill=useSkill}
{const _cu=castUlt;castUlt=function(){const was=!!ULT.cast;const r=_cu.apply(this,arguments);try{if(!was&&ULT.cast){LASTSK=now()+1500;Object.assign(CAST,{t:0,l:1.1,rgb:rgbOf(),big:2})}}catch(e){}return r};window.castUlt=castUlt}
function drawCast(){if(CAST.t>=CAST.l)return;const u=CAST.t/CAST.l,a=u<.2?u/.2:1-(u-.2)/.8,R=(CAST.big?34:26)+u*10,t=now()/1000;ctx.save();ctx.translate(P.x,P.y+2);ctx.scale(1,.38);ctx.globalCompositeOperation='lighter';
 const g=ctx.createRadialGradient(0,0,R*.2,0,0,R*1.25);g.addColorStop(0,'rgba('+CAST.rgb+','+(.35*a)+')');g.addColorStop(1,'rgba('+CAST.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(-R*1.3,-R*1.3,R*2.6,R*2.6);
 ctx.strokeStyle='rgba('+CAST.rgb+','+(.9*a)+')';ctx.lineWidth=2.2;for(const [rr,sp] of [[R,1.4],[R*.66,-2.2]]){ctx.save();ctx.rotate(t*sp);ctx.beginPath();ctx.arc(0,0,rr,0,7);ctx.stroke();const n=rr>20?10:6;for(let i=0;i<n;i++){const aa=i*6.283/n;ctx.save();ctx.translate(Math.cos(aa)*rr,Math.sin(aa)*rr);ctx.rotate(aa);ctx.fillStyle='rgba(255,255,255,'+(.85*a)+')';ctx.fillRect(-2.5,-1,5,2);ctx.restore()}ctx.restore()}
 ctx.save();ctx.rotate(-t*.9);ctx.beginPath();for(let i=0;i<=5;i++){const aa=i*Math.PI*.8;ctx.lineTo(Math.cos(aa)*R*.66,Math.sin(aa)*R*.66)}ctx.stroke();ctx.restore();ctx.restore();
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.5;const pg=ctx.createLinearGradient(0,P.y-90,0,P.y);pg.addColorStop(0,'rgba('+CAST.rgb+',0)');pg.addColorStop(1,'rgba('+CAST.rgb+',.5)');ctx.fillStyle=pg;ctx.fillRect(P.x-14,P.y-90,28,90);ctx.restore()}
// ---------- 2) พุ่ง/วาป → เงาไล่ ----------
const LP={x:0,y:0,D:null,ok:false};
{const _pt=playerTick;playerTick=function(dt){const r=_pt.apply(this,arguments);try{const d=Math.min(.05,dt||.016);CAST.t+=d;
  for(let i=G.length-1;i>=0;i--){const g=G[i];if(g.dl>0){g.dl-=d;continue}g.t+=d;if(g.t>=g.l)G.splice(i,1)}for(let i=ST.length-1;i>=0;i--){ST[i].t+=d;if(ST[i].t>=ST[i].l)ST.splice(i,1)}
  if(LP.ok&&LP.D===D&&!P.dead&&P.cls!=='none'&&now()-LASTSK<1200){const dx=P.x-LP.x,dy=P.y-LP.y,dd=Math.hypot(dx,dy);
   if(dd>46&&dd<900){const n=Math.min(7,Math.max(3,Math.round(dd/26)));for(let k=0;k<n;k++){const u=k/n;addG(LP.x+dx*u,LP.y+dy*u,P.dir,{l:.28+u*.25,a:.25+u*.5,dl:0})}addStreak(LP.x,LP.y-16,P.x,P.y-16,rgbOf(),.32,14);
    for(let k=0;k<12;k++)rfxP(LP.x+dx*Math.random(),LP.y-16+dy*Math.random(),(Math.random()-.5)*40,-20-Math.random()*30,.5,rgbOf(),1.8,'spark')}}
  LP.x=P.x;LP.y=P.y;LP.D=D;LP.ok=true}catch(e){}return r};window.playerTick=playerTick}
// ---------- วาดทั้งหมด (โลก) ----------
function drawStreaks(){for(const s of ST){const a=1-s.t/s.l;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';const g=ctx.createLinearGradient(s.x0,s.y0,s.x1,s.y1);g.addColorStop(0,'rgba('+s.rgb+',0)');g.addColorStop(1,'rgba('+s.rgb+','+(.7*a)+')');
 ctx.strokeStyle=g;ctx.lineWidth=s.w*a+2;ctx.beginPath();ctx.moveTo(s.x0,s.y0);ctx.lineTo(s.x1,s.y1);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,'+(.8*a)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.x0+(s.x1-s.x0)*.4,s.y0+(s.y1-s.y0)*.4);ctx.lineTo(s.x1,s.y1);ctx.stroke();ctx.restore()}}
function crescent(x,y,ang,a,rgb,R){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+rgb+','+(.75*a)+')';ctx.beginPath();ctx.arc(0,0,R,-1.25,1.25);ctx.arc(-R*.28,0,R*.82,1.15,-1.15,true);ctx.closePath();ctx.fill();
 ctx.fillStyle='rgba(255,255,255,'+(.9*a)+')';ctx.beginPath();ctx.arc(0,0,R,-.9,.9);ctx.arc(-R*.12,0,R*.9,.85,-.85,true);ctx.closePath();ctx.fill();ctx.restore()}
{const _h=hero;hero=function(){const mine=!window.__IN_OTHER8&&!(ctx&&ctx.canvas&&!ctx.canvas.isConnected);
  if(mine){try{drawCast();for(const g of G){if(g.dl>0)continue;ghost(g.x,g.y,g.dir,g.a*(1-g.t/g.l),g.tint,g.at,g.glow)}drawStreaks()}catch(e){}}
  const r=_h.apply(this,arguments);
  if(mine){try{for(const f of (window.FX73||[])){if(f.k!=='ns144'||f.dl>0||f.x==null)continue;const u=Math.min(1,f.t/f.l);crescent(f.x+(f.side||1)*4,f.y-18,f.ang,1-u,'170,160,255',30+u*14)}}catch(e){}}
  return r};window.hero=hero}
// ---------- 3) อัลตินินจา ----------
try{if(window.NEWU73){NEWU73.ninja=function(){const L=enemies().filter(e=>!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<300).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y)),n=10,T0=now();
   HIDE=1;let px=P.x,py=P.y;setTimeout(()=>{HIDE=0},1150);
   for(let k=0;k<12;k++)rfxP(P.x+(Math.random()-.5)*20,P.y-10-Math.random()*30,(Math.random()-.5)*60,-30-Math.random()*40,.6,'90,80,160',3,'spark');
   for(let i=0;i<n;i++)FX73.push({k:'ns144',t:0,dl:i*.09,l:.3,i,tick:f=>{if(f.hit)return;f.hit=1;const e=L.length?L[i%L.length]:null,side=i%2?1:-1;f.side=side;
     f.x=e?e.x+side*24:P.x+(Math.random()-.5)*200;f.y=e?e.y:P.y+(Math.random()-.5)*120;f.ang=(side>0?Math.PI:0)+(Math.random()-.5)*1.2;
     if(e)hurtE(e,2.2,{kb:60,ult:1,col:'#c8d0ff'});tone(1500,500,.12,'square',.03);addStreak(px,py-16,f.x,f.y-16,'140,120,255',.25,12);
     addG(f.x,f.y,side>0?'l':'r',{l:.38,a:.95,at:.55,tint:tintOf('ninja'),glow:'140,120,255'});px=f.x;py=f.y;
     for(let k=0;k<8;k++)rfxP(f.x-side*10,f.y-18,(Math.random()-.5)*140,(Math.random()-.5)*90-20,.4,'190,180,255',2,'spark')}});
   FX73.push({k:'nx',t:0,dl:1.0,l:.6,tick:f=>{if(f.hit)return;f.hit=1;HIDE=0;addStreak(px,py-16,P.x,P.y-16,'140,120,255',.3,14);
     enemies().filter(e=>!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<170).forEach(e=>hurtE(e,6,{kb:300,stun:1,ult:1,col:'#ffffff'}));shake(7,.4);try{boom(1)}catch(e){}
     try{RFX.push({k:'ring',x:P.x,y:P.y,t:0,l:.6,rgb:'140,150,255',s:180})}catch(e){}for(let k=0;k<40;k++){const a=Math.random()*6.28,s=60+Math.random()*200;rfxP(P.x,P.y-14,Math.cos(a)*s,Math.sin(a)*s*.55-40,.7,'200,200,255',2.4,'spark')}}})}}}catch(e){console.warn('ult143',e)}
// ---------- 4) ร่างแยกเงา = เงานินจาจริง ----------
{const _md=minDraw;minDraw=function(o,t){try{const S=o&&o.S;if(S&&(S===MSPEC.shade46||S.n==='ร่างแยกเงา')){const fade=Math.min(1,(o.l-o.t)/1.5)*(1-(o.born||0)*.8);
   const dir=o.f<0?'l':o.f>0?'r':(o.vx<0?'l':'r'),atk=(o.cd!=null&&o.cd>(S.cd||.7)-.25)?.5:null;
   ctx.save();ctx.globalAlpha=.35*fade;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(o.x,o.y+2,10,4,0,0,7);ctx.fill();ctx.restore();
   ghost(o.x,o.y,dir,.82*fade,tintOf('ninja'),atk,'140,120,255');if(Math.random()<.25)rfxP(o.x+(Math.random()-.5)*14,o.y-8-Math.random()*24,0,-18,.6,'110,100,200',2.2,'spark');return}}catch(e){}return _md.apply(this,arguments)};window.minDraw=minDraw}
// ---------- 6) กระสุนเวท ----------
const PCOL=p=>p.fire?'255,140,50':p.ice?'140,220,255':p.bolt25||p.k==='spark'?'255,240,120':P.cls==='necro'?'120,255,170':P.cls==='cleric'?'200,240,255':'160,130,255';
const LIVE=new Map();
{const _da=drawAir;drawAir=function(){const r=_da.apply(this,arguments);try{const seen=new Set();for(const p of PROJ){if(p.k!=='bolt'&&!p.fire&&!p.ice)continue;seen.add(p);let L=LIVE.get(p);if(!L){L={tr:[],rgb:PCOL(p)};LIVE.set(p,L)}L.tr.push([p.x,p.y]);if(L.tr.length>9)L.tr.shift();L.x=p.x;L.y=p.y;
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(let i=1;i<L.tr.length;i++){const u=i/L.tr.length;ctx.strokeStyle='rgba('+L.rgb+','+(.55*u)+')';ctx.lineWidth=2+u*7;ctx.beginPath();ctx.moveTo(L.tr[i-1][0],L.tr[i-1][1]);ctx.lineTo(L.tr[i][0],L.tr[i][1]);ctx.stroke()}
   const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,14);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.35,'rgba('+L.rgb+',.8)');g.addColorStop(1,'rgba('+L.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(p.x-14,p.y-14,28,28);
   const tt=now()/120;for(let k=0;k<3;k++){const a=tt+k*2.09;ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(p.x+Math.cos(a)*8-1,p.y+Math.sin(a)*8-1,2,2)}ctx.restore()}
  for(const [p,L] of LIVE){if(seen.has(p))continue;LIVE.delete(p);try{RFX.push({k:'ring',x:L.x,y:L.y,t:0,l:.35,rgb:L.rgb,s:34});for(let k=0;k<12;k++){const a=Math.random()*6.28,s=40+Math.random()*90;rfxP(L.x,L.y,Math.cos(a)*s,Math.sin(a)*s*.6-20,.45,k%2?L.rgb:'255,255,255',2,'spark')}}catch(e){}}}catch(e){}return r};window.drawAir=drawAir}
{const _sh=shoot;shoot=function(kind,o){const r=_sh.apply(this,arguments);try{if(kind==='bolt'||kind==='fireball'){const dv=(o&&o.dv)||DIRV[P.dir]||[1,0],x=P.x+dv[0]*16,y=P.y-16+dv[1]*10,rgb=kind==='fireball'?'255,140,50':rgbOf();
   try{RFX.push({k:'ring',x,y,t:0,l:.25,rgb,s:22})}catch(e){}for(let k=0;k<7;k++)rfxP(x,y,dv[0]*80+(Math.random()-.5)*60,dv[1]*50+(Math.random()-.5)*50-20,.3,rgb,1.8,'spark')}}catch(e){}return r};window.shoot=shoot}
}catch(e){console.warn('fix143',e)}
