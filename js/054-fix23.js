// fix23.js (v4.31) — ข้อ 70–71: ฉายาพิเศษระดับตำนาน + ป้ายชื่อหรูบนหัว (กรอบทองรุ้ง ปีก ประกาย)
// ปลดล็อกอัตโนมัติ · ฉายาช่วงเบต้าเก็บถาวร (หลังเปิดจริงให้ตั้ง BETA23=false แล้วจะไม่มีใครได้เพิ่ม)
// =====================================================================
const BETA23=true;
ST20.perm=ST20.perm||{};
const ENHALL23=()=>{for(const k of ['sword','helm','chest','pants','arm']){const id=P.armor[k];if(!id||(ENH[id]|0)<15)return false}return true};
// [id, ชื่อ, สี, คำอธิบาย, เงื่อนไข, ระดับ] — ระดับ: 'leg' ตำนาน (ป้ายชื่อหรู) · 'epic' (ป้ายชื่อเรือง)
const SPT23=[
 ['beta','🎖️ ผู้ทดสอบรุ่นแรก','#9fe0ff','เล่นในช่วงทดสอบเบต้า',()=>BETA23,'epic'],
 ['betaleg','🏆 เบต้าเทสเตอร์ตำนาน','#ffd23a','ถึง Lv.99 ในช่วงทดสอบเบต้า',()=>BETA23&&P.lv>=99,'leg'],
 ['conq','👑 ผู้พิชิตปฐมบท','#ff9ad8','จบเนื้อเรื่องหลักทั้งหมด',()=>!!STORY.done,'leg'],
 ['smith15','🔥 ช่างตีเหล็กเทวะ','#ff7a3a','สวมอาวุธ+ชุดเกราะ +15 ครบทุกชิ้น',()=>ENHALL23(),'leg'],
 ['wbslayer','🐉 ผู้สังหารมหาอสูร','#ff5a5a','ล้มบอส 100 ตัว',()=>ST20.boss>=100,'leg']];
const TIER23={};for(const t of SPT23){TTL20.unshift([t[0],t[1],t[2],t[3]+(t[0].startsWith('beta')?' (ได้ถาวร)':''),()=>!!ST20.perm[t[0]]]);TIER23[t[0]]=t[5]}
TIER23.gm='leg';TIER23.lv100='epic';TIER23.tycoon='epic';TIER23.k5000='epic';TIER23.dg30='epic';
for(const t of TTL20)TTLMAP20[t[0]]=t;
function perm23(){let ch=false;for(const t of SPT23){if(!ST20.perm[t[0]]){let ok=false;try{ok=t[4]()}catch(e){}if(ok){ST20.perm[t[0]]=1;ch=true}}}if(ch){try{localStorage.setItem('fm_stat20',JSON.stringify(ST20))}catch(e){}try{ttlCheck20()}catch(e){}}}
setTimeout(perm23,2500);setInterval(perm23,10000);
// ---------- ป้ายชื่อหรู ----------
const SPK23=[];
function fancyPlate23(tier,x,y,name,lv,t){ctx.save();ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';const tw=ctx.measureText(name).width;ctx.font='bold 8px system-ui,sans-serif';const lw=ctx.measureText('Lv.'+lv).width;
 const w=tw+lw+40,h=18,px=Math.round(x-w/2),py=Math.round(y-80),leg=tier==='leg';
 // ปีกสองข้าง
 if(leg){for(const s of [-1,1]){const bx=s<0?px-2:px+w+2,flap=Math.sin(t*3)*1.5;ctx.save();ctx.translate(bx,py+h/2);ctx.scale(s,1);
   const g=ctx.createLinearGradient(0,-10,14,6);g.addColorStop(0,'#fff6c0');g.addColorStop(1,'#e8a020');ctx.fillStyle=g;ctx.strokeStyle='rgba(90,50,0,.8)';ctx.lineWidth=.8;
   for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,-2+i*2);ctx.quadraticCurveTo(7+i*2,-10+i*3-flap,15-i*2,-7+i*5-flap);ctx.quadraticCurveTo(8,1+i,0,2+i*2);ctx.closePath();ctx.fill();ctx.stroke()}ctx.restore()}}
 // กรอบเรืองแสงไล่สี
 const hue=(t*60)%360,gr=ctx.createLinearGradient(px,0,px+w,0);
 if(leg){gr.addColorStop(0,'hsl('+hue+',95%,65%)');gr.addColorStop(.5,'#fff2a0');gr.addColorStop(1,'hsl('+((hue+180)%360)+',95%,65%)')}else{gr.addColorStop(0,'#7ad8ff');gr.addColorStop(.5,'#e0f6ff');gr.addColorStop(1,'#b48cff')}
 ctx.shadowColor=leg?'rgba(255,210,80,.9)':'rgba(120,200,255,.8)';ctx.shadowBlur=8+3*Math.sin(t*4);ctx.strokeStyle=gr;ctx.lineWidth=2.2;rr(ctx,px-1.5,py-1.5,w+3,h+3,10);ctx.stroke();ctx.shadowBlur=0;
 // อัญมณีหัวท้าย
 for(const gx of [px-1.5,px+w+1.5]){ctx.fillStyle=leg?'#ff4a8a':'#7ad8ff';ctx.strokeStyle='#fff';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(gx,py+h/2-4);ctx.lineTo(gx+3,py+h/2);ctx.lineTo(gx,py+h/2+4);ctx.lineTo(gx-3,py+h/2);ctx.closePath();ctx.fill();ctx.stroke()}
 // แถบแสงวิ่งผ่าน
 ctx.save();rr(ctx,px,py,w,h,9);ctx.clip();const sx=px+((t*70)%(w+60))-30,sg=ctx.createLinearGradient(sx-14,0,sx+14,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.35)');sg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=sg;ctx.fillRect(sx-14,py,28,h);ctx.restore();
 // ชื่อสีทองไล่เฉด (เขียนทับ)
 ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='left';const nx=px+24,ng=ctx.createLinearGradient(nx,py,nx,py+h);ng.addColorStop(0,leg?'#fffbe0':'#ffffff');ng.addColorStop(1,leg?'#ffc830':'#9fe0ff');
 ctx.fillStyle='rgba(14,10,20,.95)';ctx.fillRect(nx-1,py+3,tw+2,h-6);ctx.fillStyle=ng;ctx.fillText(name,nx,py+h/2+4);
 // ประกาย
 if(Math.random()<(leg?.35:.15))SPK23.push({x:px+Math.random()*w,y:py+Math.random()*h,l:.6,c:leg?'255,230,140':'170,220,255'});
 ctx.globalCompositeOperation='lighter';for(let i=SPK23.length-1;i>=0;i--){const s=SPK23[i];s.l-=.016;s.y-=.25;if(s.l<=0){SPK23.splice(i,1);continue}if(Math.abs(s.x-x)>w)continue;ctx.fillStyle='rgba('+s.c+','+s.l+')';ctx.beginPath();ctx.moveTo(s.x,s.y-2.5);ctx.lineTo(s.x+.8,s.y);ctx.lineTo(s.x,s.y+2.5);ctx.lineTo(s.x-.8,s.y);ctx.closePath();ctx.fill();ctx.fillRect(s.x-2.5,s.y-.4,5,.8)}
 ctx.restore()}
// ฉายาระดับพิเศษ: วงเล็บ [ ] ไล่สี + เรืองแสง
{const _dt=drawTtl20;drawTtl20=function(id,x,y){const tier=TIER23[id],t=TTLMAP20[id];if(!tier||!t)return _dt(id,x,y);const tm=performance.now()/1000;ctx.save();
  ctx.font='900 '+(tier==='leg'?10:9.5)+'px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';const s='[ '+t[1]+' ]',w=ctx.measureText(s).width;
  const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);if(tier==='leg'){const h=(tm*50)%360;g.addColorStop(0,t[2]);g.addColorStop(.5,'#ffffff');g.addColorStop(1,'hsl('+h+',90%,70%)')}else{g.addColorStop(0,t[2]);g.addColorStop(1,'#ffffff')}
  ctx.lineWidth=3.2;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(s,x,y);ctx.shadowColor=t[2];ctx.shadowBlur=tier==='leg'?8+3*Math.sin(tm*3):5;ctx.fillStyle=g;ctx.fillText(s,x,y);ctx.restore()}}
// วาดป้ายหรูทับป้ายเดิม (ของเราและผู้เล่นอื่น)
{const _nt=nameTag;nameTag=function(){_nt();try{if(!P.name||P.dead)return;const id=window.__IN_OTHER8?window.__OTTL20:myTtl20(),tier=TIER23[id];if(tier)fancyPlate23(tier,Math.round(P.x),Math.round(P.y),P.name,P.lv,performance.now()/1000)}catch(e){}}}

// =====================================================================
