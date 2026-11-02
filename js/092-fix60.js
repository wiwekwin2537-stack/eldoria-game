// fix60 (v4.58) — ออร่าตีบวกชุดแบบ 3 มิติ (แทนออร่าแบนเดิม) · ผู้เล่นอื่นเห็นด้วย
//   วัดจากระดับตีบวกเฉลี่ยของชุด 4 ชิ้น: +4 วงเวทใต้เท้าหมุน · +7 วงแหวนเอียงโคจร+ลูกแสง (อ้อมหน้า-หลังตัวจริง) · +10 วงแหวนคู่+เกลียวแสงลอยขึ้น
//   +13 เสาแสง+ปีกแสง+มงกุฎรัศมี · +16 สีรุ้งเปลี่ยนสี · สีตามเซ็ตที่ใส่ครบ (หรือเซ็ตสูงสุด)
try{
const old60=drawArmorAura;drawArmorAura=function(){};window.drawArmorAura=drawArmorAura;
function info60(){let L=0,n=0,top=0;for(const s of ['helm','chest','pants','arm']){const id=P.armor&&P.armor[s];if(!id||!ITEMS[id])continue;L+=(ENH&&ENH[id])||0;n++;top=Math.max(top,ITEMS[id].tier|0)}
 if(!n)return null;let full=null;try{const c=setCount();for(const t in c)if(c[t]>=4)full=+t}catch(e){}const a=L/4;if(a<4)return null; /* fix127: เดิมใส่ครบเซ็ต +0 ก็ขึ้นออร่า → ต้องตีบวกก่อน */
 const rgb=ARMC[full!=null?full:top]||'200,200,255';return{a,rgb,full:full!=null,tier:full!=null?full:top}}
const hsl60=h=>{const f=n=>{const k=(n+h/30)%12,a=.6*Math.min(.5,1-.5);return Math.round(255*(.62-.38*Math.max(-1,Math.min(k-3,9-k,1))))};return f(0)+','+f(8)+','+f(4)};
function ring60(cx,cy,R,r,rot,rgb,w,front,alpha){ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);const N=28;for(let i=0;i<N;i++){const a0=i/N*Math.PI*2,a1=(i+1)/N*Math.PI*2,d=Math.sin((a0+a1)/2);if((d>0)!==front)continue;
  ctx.strokeStyle='rgba('+rgb+','+(alpha*(front?.55+.45*d:.25+.25*(1+d)))+')';ctx.lineWidth=w*(front?1+.3*d:.8);ctx.beginPath();ctx.moveTo(Math.cos(a0)*R,Math.sin(a0)*r);ctx.lineTo(Math.cos(a1)*R,Math.sin(a1)*r);ctx.stroke()}ctx.restore()}
function orbs60(cx,cy,R,r,rot,rgb,t,sp,n,front,sz){for(let i=0;i<n;i++){const th=t*sp+i*Math.PI*2/n,d=Math.sin(th);if((d>0)!==front)continue;const x0=Math.cos(th)*R,y0=Math.sin(th)*r,x=cx+x0*Math.cos(rot)-y0*Math.sin(rot),y=cy+x0*Math.sin(rot)+y0*Math.cos(rot),s=sz*(1+.35*d);
  const g=ctx.createRadialGradient(x,y,0,x,y,s*2.6);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.35,'rgba('+rgb+',.8)');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,s*2.6,0,7);ctx.fill()}}
/* v5.68: ท่าออร่าตามทิศผู้เล่น (เจ้าของแจ้ง: ออร่าไม่หันตามตัว) — ปีกติดด้านหลังเสมอ · หันข้าง: ปีกสองข้างกางไปทางหลัง (ข้างไกลเล็ก/จางกว่า) · หันหลัง: ปีกวาดทับหน้าตัว · วงแหวนเอียงตามทิศ */
function pose60(){const d=P.dir;if(d==='r')return {ox:-7,list:[[-1,.62,.7],[-1,1,1]],front:false,rs:1};if(d==='l')return {ox:7,list:[[1,.62,.7],[1,1,1]],front:false,rs:-1};return {ox:0,list:[[-1,1,1],[1,1,1]],front:d==='u',rs:1}}
window.pose60=pose60;
function draw60(front,I){const t=performance.now()/1000,x=P.x,y=P.y,a=I.a,po=pose60();let rgb=I.rgb;if(a>=16)rgb=hsl60((t*60)%360);const al=Math.min(1,.45+a*.03);window.AURA60PH=front;
 ctx.save();ctx.globalCompositeOperation='lighter';
 if(!front){// วงเวทใต้เท้า
  ctx.save();ctx.translate(x,y);ctx.scale(1,.34);const R=22+Math.min(10,a*.6),rot=t*.8;ctx.strokeStyle='rgba('+rgb+','+(.55*al)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.stroke();ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,R*.72,0,7);ctx.stroke();
   for(let i=0;i<12;i++){const an=rot+i*Math.PI/6;ctx.save();ctx.rotate(an);ctx.fillStyle='rgba('+rgb+','+(.7*al)+')';ctx.fillRect(R*.76,-1.2,R*.18,2.4);ctx.restore()}
   ctx.strokeStyle='rgba(255,255,255,'+(.35*al)+')';ctx.beginPath();for(let i=0;i<=6;i++){const an=-rot*1.3+i*Math.PI*2/6*2;const px=Math.cos(an)*R*.7,py=Math.sin(an)*R*.7;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();ctx.restore();
  const g=ctx.createRadialGradient(x,y-22,2,x,y-22,30+a);g.addColorStop(0,'rgba('+rgb+','+(.16*al)+')');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.fillRect(x-40-a,y-62-a,80+a*2,80+a*2);
  if(a>=13){// เสาแสง + ปีก
   const pg=ctx.createLinearGradient(0,y-90,0,y);pg.addColorStop(0,'rgba('+rgb+',0)');pg.addColorStop(.6,'rgba('+rgb+','+(.12+.06*Math.sin(t*3))+')');pg.addColorStop(1,'rgba(255,255,255,.18)');ctx.fillStyle=pg;ctx.fillRect(x-14,y-90,28,90);
   }}
 if(a>=13&&front===po.front){/* ปีก: ติดด้านหลังตามทิศ */
   const f=Math.sin(t*3)*.15;if(window.wing127&&wing127(x,y,t,rgb,I,po)){}else for(const [s,k,wa] of po.list){ctx.save();ctx.globalAlpha=wa;ctx.translate(x+po.ox+s*4,y-31);ctx.scale(s*k,1);ctx.rotate(-.25+f);const wg=ctx.createLinearGradient(0,0,38,0);wg.addColorStop(0,'rgba(255,255,255,.55)');wg.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=wg;ctx.beginPath();ctx.moveTo(0,0);
    ctx.quadraticCurveTo(14,-24,40,-20);ctx.quadraticCurveTo(28,-11,35,-4);ctx.quadraticCurveTo(24,-2,30,6);ctx.quadraticCurveTo(14,4,0,6);ctx.closePath();ctx.fill();ctx.restore()}}
 if(a>=7||I.full){ring60(x,y-20,24,8,-.32*po.rs,rgb,2,front,al);orbs60(x,y-20,24,8,-.32*po.rs,rgb,t,2.2,a>=10?3:2,front,2.4)}
 if(a>=10){ring60(x,y-24,20,7,.42*po.rs,rgb,1.6,front,al*.9);orbs60(x,y-24,20,7,.42*po.rs,'255,255,255',t,-2.8,2,front,1.8);
  for(let i=0;i<10;i++){const th=t*2.4+i*.63,h=((t*.45+i/10)%1),d=Math.sin(th);if((d>0)!==front)continue;const px=x+Math.cos(th)*(15-h*5),py=y-4-h*56;ctx.fillStyle='rgba('+rgb+','+((1-h)*(.5+.4*d))+')';ctx.beginPath();ctx.arc(px,py,1.2+(1+d)*.8,0,7);ctx.fill()}}
 if(front&&a>=13){ctx.strokeStyle='rgba(255,240,180,'+(.5+.3*Math.sin(t*4))+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-56,10,3,0,0,7);ctx.stroke()}
 if(front&&Math.random()<Math.min(.5,a*.03))rfxP(x+(Math.random()-.5)*22,y-6-Math.random()*36,(Math.random()-.5)*8,-24-Math.random()*20,.8,Math.random()<.6?rgb:'255,255,255',1.4+Math.random(),'spark');
 ctx.restore();window.AURA60PH=false}
{const _hb=heroBody;heroBody=function(){let I=null;try{if(!P.dead)I=info60()}catch(e){}if(!I)return _hb.apply(this,arguments);
 try{draw60(false,I)}catch(e){}const r=_hb.apply(this,arguments);try{draw60(true,I)}catch(e){}return r};window.heroBody=heroBody}
window.info60=info60;
}catch(e){console.warn('fix60',e)}
