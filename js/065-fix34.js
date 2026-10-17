// fix34.js (v4.38) — ผู้เล่นอื่นเคลื่อนที่นุ่ม (ไม่วาร์ป) · เห็นสกิล/ลูกธนู/เวทของกันและกัน · ชื่อสกิลลอยเหนือหัว · คลาสตรงกับตัวจริง
// =====================================================================
// ---------- 1) ส่งเวลาประทับ + สกิลล่าสุด ไปกับสถานะตัวละคร ----------
const FX34={q:{v:[],p:[],e:[]},rx:false,cl:null,lastT:0};
{const _send=WebSocket.prototype.send;WebSocket.prototype.send=function(s){try{if(this===NET.ws&&typeof s==='string'&&s.startsWith('{"t":"st"')){const o=JSON.parse(s);o.q=Date.now();if(FX34.cl)o.cl=FX34.cl;s=JSON.stringify(o)}}catch(e){}return _send.call(this,s)}}
// base ส่งสถานะเฉพาะตอนเปลี่ยน — ส่งต่อเนื่องระหว่างเคลื่อนที่ให้ได้จังหวะสม่ำเสมอ
{const _nt=netTick;netTick=function(dt){if(NET.on&&P.mv)NET.lastSt='';return _nt(dt)}}
// ---------- 2) เคลื่อนที่นุ่ม: บัฟเฟอร์ตำแหน่งแล้วเล่นย้อนหลัง 120ms (interpolation) ----------
const DELAY34=120;
window.NETV8=function(o,s){const q=+s.q||0,now=Date.now();o.sn=performance.now();o.hpP=s.hpP;if(!q){o.buf34=null;return}
 if(!o.buf34)o.buf34=[];const B=o.buf34;if(B.length&&q<=B[B.length-1].q)return;
 const off=now-q;o.off34=o.off34==null?off:Math.min(off,o.off34+2);
 B.push({q,x:s.x,y:s.y});while(B.length>30)B.shift();
 if(s.cl&&s.cl.t&&s.cl.t!==o.clT34){o.clT34=s.cl.t;if(now-o.off34-s.cl.t<2500){o.sk34={n:String(s.cl.n||'').slice(0,24),until:performance.now()+1400}}}};
window.NETSMOOTH8=function(o,dt){const B=o.buf34;if(!B||!B.length){const k=Math.min(1,dt*10);o.x+=(o.tx-o.x)*k;o.y+=(o.ty-o.y)*k;return}
 const rt=Date.now()-(o.off34||0)-DELAY34;let x,y;
 if(rt<=B[0].q){x=B[0].x;y=B[0].y}
 else if(rt>=B[B.length-1].q){const L=B[B.length-1],Pv=B[B.length-2],ex=Math.min(150,rt-L.q);x=L.x;y=L.y;
  if(Pv&&L.q>Pv.q&&Math.hypot(L.x-Pv.x,L.y-Pv.y)<200){const k=ex/(L.q-Pv.q);x+=(L.x-Pv.x)*Math.min(1,k);y+=(L.y-Pv.y)*Math.min(1,k)}}
 else{let i=B.length-1;while(i>0&&B[i-1].q>rt)i--;const a=B[i-1],b=B[i],u=(rt-a.q)/Math.max(1,b.q-a.q);
  if(Math.hypot(b.x-a.x,b.y-a.y)>260){x=u<.5?a.x:b.x;y=u<.5?a.y:b.y}else{x=a.x+(b.x-a.x)*u;y=a.y+(b.y-a.y)*u}}
 const d=Math.hypot(x-o.x,y-o.y);if(d>300||d<.5){o.x=x;o.y=y}else{const k=Math.min(1,dt*25);o.x+=(x-o.x)*k;o.y+=(y-o.y)*k}};
// ---------- 3) วาดผู้เล่นอื่นด้วยคลาสของเขาเอง + ชื่อสกิล + ออร่าสกิลต่อเนื่อง ----------
{const _do=drawOther;drawOther=function(o){const c=P.cls;try{if(o.cls&&CSKILLS[o.cls]||o.cls==='none')P.cls=o.cls;_do(o)}finally{P.cls=c}
  try{const n=performance.now();
   if(o.au34&&o.au34.until>n){const a=o.au34,t=n/1000,al=Math.min(1,(a.until-n)/400);ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<18;i++){const ang=i/18*6.283+t*2.2,r=a.r||60,x=o.x+Math.cos(ang)*r,y=o.y-6+Math.sin(ang)*r*.6;const g=ctx.createRadialGradient(x,y,1,x,y,10);g.addColorStop(0,'rgba('+a.c+','+(.8*al)+')');g.addColorStop(1,'rgba('+a.c+',0)');ctx.fillStyle=g;ctx.fillRect(x-10,y-10,20,20)}
    ctx.restore()}
   if(o.sk34&&o.sk34.until>n){const a=Math.min(1,(o.sk34.until-n)/300);ctx.save();ctx.globalAlpha=a;ctx.font='900 12px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';const y=o.y-96-(1-a)*6;
    ctx.lineWidth=4;ctx.strokeStyle='rgba(20,10,30,.9)';ctx.strokeText('✦ '+o.sk34.n,o.x,y);ctx.fillStyle='#ffe27a';ctx.fillText('✦ '+o.sk34.n,o.x,y);ctx.restore()}}catch(e){}}}
// ---------- 4) เก็บเอฟเฟกต์ที่เราสร้าง แล้วส่งให้คนในฉากเดียวกันเห็น ----------
const okSend34=()=>NET.on&&NET.others.size>0&&!FX34.rx;
const prim34=o=>{const r={};if(!o)return r;let n=0;for(const k in o){const v=o[k];if(n>10)break;if(typeof v==='number'){r[k]=Math.round(v*100)/100;n++}else if(typeof v==='string'&&v.length<40){r[k]=v;n++}else if(typeof v==='boolean'){r[k]=v;n++}}return r};
{const _v=vfx;vfx=function(k,x,y,l,o){if(okSend34()&&FX34.q.v.length<50&&Math.abs(x-P.x)<900&&Math.abs(y-P.y)<700)FX34.q.v.push([k,Math.round(x),Math.round(y),Math.round(l*100)/100,prim34(o)]);return _v(k,x,y,l,o)}}
{const _p=PROJ.push;PROJ.push=function(...a){if(okSend34())for(const p of a)if(p&&!p.gh34&&!p.s34&&(p.s34=1)&&FX34.q.p.length<30)FX34.q.p.push([p.k,Math.round(p.x),Math.round(p.y),Math.round(p.vx),Math.round(p.vy),Math.round(p.l*100)/100,p.r||8,p.col||'',p.aoe||0,p.fire?1:0]);return _p.apply(this,a)}}
{const _p=PERS.push;PERS.push=function(...a){if(okSend34())for(const e of a)if(e&&!e.s34&&(e.s34=1)&&FX34.q.e.length<6)FX34.q.e.push([e.k,Math.round((e.l||2)*100)/100,Math.round(e.r||70)]);return _p.apply(this,a)}}
{const _cb=castBanner;castBanner=function(txt,col,big){FX34.cl={i:big?2:0,n:String(txt||'').slice(0,24),t:Date.now()};NET.lastSt='';return _cb(txt,col,big)}}
setInterval(()=>{const Q=FX34.q;if(!(Q.v.length||Q.p.length||Q.e.length))return;if(!okSend34()){Q.v.length=Q.p.length=Q.e.length=0;return}
 netSend({t:'sx',k:'fx',v:Q.v.splice(0),p:Q.p.splice(0),e:Q.e.splice(0)})},100);
// ---------- 5) รับเอฟเฟกต์ของคนอื่น (ภาพอย่างเดียว ไม่ทำดาเมจ) ----------
const GH34=[];
const PERSC34={firering:'255,140,40',swordstorm:'210,230,255',arrowrain:'140,255,170',meteor:'255,120,40'};
{const _o=onSx33;onSx33=function(d){if(d.k!=='fx')return _o(d);if(d.sc!==netScene())return;const o=NET.others.get(d.from);FX34.rx=true;
  try{for(const v of d.v||[])try{vfx(String(v[0]),+v[1],+v[2],+v[3]||.4,v[4]||{})}catch(e){}
   for(const p of d.p||[])if(GH34.length<120)GH34.push({k:String(p[0]),x:+p[1],y:+p[2],vx:+p[3],vy:+p[4],l:+p[5]||.5,r:+p[6]||8,col:p[7]||undefined,aoe:+p[8]||0,fire:p[9]?1:0,t:0,hit:new Set(),gh34:1});
   if(o)for(const e of d.e||[]){o.au34={k:e[0],until:performance.now()+Math.min(6,+e[1]||2)*1000,r:Math.min(160,+e[2]||70),c:PERSC34[e[0]]||'200,180,255'}}}
  finally{FX34.rx=false}}}
// ลูกธนู/เวทของคนอื่น: เคลื่อนเอง ชนกำแพงแล้วหาย · วาดร่วมกับของเรา (ใส่เข้า PROJ ชั่วคราวตอนวาดเท่านั้น)
{const _uw=updWorld;updWorld=function(dt){_uw(dt);for(let i=GH34.length-1;i>=0;i--){const p=GH34[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;let gone=p.t>p.l;
   if(!gone&&D&&D.zone){try{gone=zHit(p.x,p.y+14)}catch(e){}}
   if(!gone){for(const e of enemies()){if(e.pvp7||e.dead)continue;if(Math.hypot(e.x-p.x,(e.y-10)-p.y)<p.r+eR(e)){gone=true;break}}}
   if(gone){FX34.rx=true;try{vfx(p.aoe?'boom':'puff',p.x,p.y+(p.aoe?12:0),p.aoe?.5:.3,p.aoe?{r:p.aoe}:{c:p.k==='bolt'?'190,140,255':p.k==='ice'?'190,230,255':'255,230,170'})}catch(e){}FX34.rx=false;GH34.splice(i,1)}}}}
{const _da=drawAir;drawAir=function(){if(!GH34.length)return _da();const n=PROJ.length;for(const p of GH34)Array.prototype.push.call(PROJ,p);try{return _da()}finally{for(let i=PROJ.length-1;i>=n;i--)if(PROJ[i].gh34)PROJ.splice(i,1)}}}
// เปลี่ยนฉาก → ล้างเอฟเฟกต์คนอื่น
{let sc0='';setInterval(()=>{const s=netScene();if(s!==sc0){sc0=s;GH34.length=0}},500)}
window.FX34=FX34;

// =====================================================================
