// fix1.js — ชุดแก้บั๊กหลัก #1 (v4.10)
//  NPC ชนแล้วค้าง · รถม้าหยุดให้คน+ตะโกน · แจ้งผลซื้อของในร้าน · บอสรีเซ็ตตอนเข้าออก
//  มอนติดแร่/กำแพง · เมนูไม่หยุดเกมตอนออนไลน์ · หิว/เหนื่อย · สกิลไม่ต่อกันเร็วเกิน · อัลติเก็บเต็มไม่ได้ · ผู้เล่นอื่นไม่กระตุก
// =====================================================================
// ---------- 1) NPC ถูกชน/ยืนชิดแล้วไม่ค้างอีก ----------
updNPCs=function(dt){for(const n of D.npcs){n.mv=false;if(n.bub&&(n.bub.t-=dt)<=0)n.bub=null;if(n.wave>0)n.wave-=dt;npcRescue(n);if(n.fixed)continue;
 if(n.ign>0)n.ign-=dt;const dp=Math.hypot(P.x-n.x,P.y-n.y);
 if(dp<46&&!(n.ign>0)){const dx=P.x-n.x,dy=P.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');n.nearT=(n.nearT||0)+dt;
  // คุยอยู่ (มีบับเบิล) = ยืนอยู่ได้ · ถ้าไม่ได้คุย แล้วโดนชนชิด/ยืนนานเกิน -> เดินหลบออกไป
  if(!n.bub&&((dp<30&&n.nearT>.6)||n.nearT>3.2)){n.nearT=0;n.ign=2.4;const base=Math.atan2(n.y-P.y,n.x-P.x);let got=null;
   for(const da of [0,.7,-.7,1.4,-1.4,2.1,-2.1,3.1]){const a=base+da;for(const r of [46,34,22]){const x=n.x+Math.cos(a)*r,y=n.y+Math.sin(a)*r;if(npcStatic(x,y)&&npcClear(n.x,n.y,x,y)&&Math.hypot(x-P.x,y-P.y)>20){got={x,y};break}}if(got)break}
   n.tg=got||npcPick(n);n.stuck=0;n.wait=0}
  else continue}
 else if(dp>=46)n.nearT=0;
 if(n.wait>0){n.wait-=dt;continue}
 if(!n.tg){n.tg=npcPick(n);n.stuck=0;if(!n.tg){n.wait=1+Math.random()*2;continue}}
 const dx=n.tg.x-n.x,dy=n.tg.y-n.y,d=Math.hypot(dx,dy);if(d<4||n.stuck>.35){n.tg=null;n.wait=n.stuck>.35?.2:1+Math.random()*4;continue}
 const sx=dx/d*n.sp*dt,sy=dy/d*n.sp*dt;let m=false;if(npcFree(n,n.x+sx,n.y+sy)){n.x+=sx;n.y+=sy;m=true}else{if(npcFree(n,n.x+sx,n.y)){n.x+=sx;m=true}if(npcFree(n,n.x,n.y+sy)){n.y+=sy;m=true}}
 if(m){n.mv=true;n.stuck=0;n.t+=dt*8;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}else n.stuck+=dt}};
// ---------- 2) รถม้า/เกวียนหยุดเมื่อมีคนขวางทาง + คนขับตะโกน ----------
const CARTSHOUT8=['ดูทางด้วยสิเห้ย!','หลบหน่อยครับ รถจะไป!','ยืนขวางทำไมเนี่ย!','อ้าว! ระวังหน่อยสิ!','เดี๋ยวม้าชนนะเว้ย!','ขอทางหน่อยจ้า!'];
{const _uc=updCarts;updCarts=function(dt){const pre=D.carts.map(c=>[c.x,c.ph]);_uc(dt);
 const who=[[P.x,P.y,P.dead]];if(typeof NET!=='undefined'&&NET.on)for(const o of NET.others.values())who.push([o.x,o.y,o.dead]);
 for(let i=0;i<D.carts.length;i++){const c=D.carts[i];if(c.bub&&(c.bub.t-=dt)<=0)c.bub=null;
  let blocked=false;for(const [x,y,dead] of who){if(dead)continue;const dx=(x-pre[i][0])*c.dir;if(dx>-c.hw*.55&&dx<c.hw+44&&Math.abs(y-c.y)<30){blocked=true;break}}
  if(blocked){c.x=pre[i][0];c.ph=pre[i][1];c.moving=false;c.amp=Math.max(0,c.amp-dt*5);
   if(!c.shT||performance.now()>c.shT){c.shT=performance.now()+5200+Math.random()*2500;c.bub={txt:CARTSHOUT8[Math.random()*CARTSHOUT8.length|0],t:2.6}}}}}}
{const _db=drawBubbles;drawBubbles=function(){_db();if(D&&D.carts)for(const c of D.carts)if(c.bub)bubble(c.bub.txt,Math.round(c.x),Math.round(c.y-96),Math.min(1,c.bub.t*3))}}
// ---------- 3) ซื้อของในร้าน: แจ้งผลชัดเจน (สำเร็จ/ไม่สำเร็จเพราะอะไร) ----------
{const _b=buyItem;buyItem=function(id){const snap=()=>[inv.coin,JSON.stringify(inv),JSON.stringify(GEAR),P.w,P.ap,P.bagLv,Math.round(P.hp),Math.round(P.mp),P.fa|0,P.hu|0,P.tool].join('|');
  const msgEl=document.getElementById('msg');let b0;try{b0=snap()}catch(e){return _b(id)}try{_ctMsg=0}catch(e){}if(msgEl)msgEl.textContent='';
  _b(id);let ok;try{ok=snap()!==b0}catch(e){return}
  if(!shopEl||shopEl.hidden)return;let txt=(msgEl&&msgEl.textContent||'').trim();
  if(!ok){if(!txt)txt='ซื้อไม่ได้';if(/หนัก|เต็ม/.test(txt)){try{txt+=' (น้ำหนัก '+Math.round(bagWeight()*10)/10+'/'+bagCapMax()+' กก. · ช่อง '+bagCells().length+'/'+bagSlotsMax()+')'}catch(e){}}}
  else txt='✅ ซื้อสำเร็จ'+(txt?' — '+txt:'');
  const old=shopEl.querySelector('.shnote');if(old)old.remove();
  shopEl.insertAdjacentHTML('afterbegin','<div class="shnote" style="margin:4px 0;padding:6px 8px;border-radius:8px;font-size:12px;font-weight:700;background:'+(ok?'#1d4a2a':'#5a1f1f')+';border:1px solid '+(ok?'#4fd27a':'#ff7a6a')+';color:#fff">'+txt.replace(/[<>]/g,'')+'</div>');
  const el=shopEl.querySelector('.shnote');setTimeout(()=>{try{el&&el.remove()}catch(e){}},3200)}}
// ---------- 4) บอสไม่รีเซ็ตเมื่อออก-เข้าใหม่ (มีคูลดาวน์จริง เก็บถาวร) ----------
const BCD8={get(){try{return JSON.parse(localStorage.getItem('fm_bcd8')||'{}')}catch(e){return{}}},set(o){try{const now=srvNow();for(const k in o)if(now-o[k]>3600e3)delete o[k];localStorage.setItem('fm_bcd8',JSON.stringify(o))}catch(e){}},ms:{z:10*60e3,dg:15*60e3}};
BCD8.apply=function(key,kind){if(!D||!D.zone)return;const t=BCD8.get()[key];if(!t)return;const rem=t+BCD8.ms[kind]-srvNow();if(rem<=0)return;
 D.bossT=Math.max(1,rem/1000);D.boss=null;D.mobs=D.mobs.filter(m=>!m.boss);
 if(kind==='dg'){D.chest={x:D.zone.arena.x*T+16,y:D.zone.arena.y*T+16,open:true}}
 setTimeout(()=>{try{say('🕒 บอสที่นี่เพิ่งถูกกำจัด — จะกลับมาในอีก '+Math.ceil(rem/60000)+' นาที'+(kind==='dg'?' (ไปชั้นถัดไปได้เลย)':''))}catch(e){}},50)};
{const _ez=enterZone;enterZone=function(i){_ez(i);try{const Z=ZONES[i];if(Z&&!Z.dg)BCD8.apply('z'+i,'z')}catch(e){}}}
{const _ed=enterDg;enterDg=function(f){_ed(f);try{BCD8.apply('dg'+f,'dg')}catch(e){}}}
{const _mk=mobKill;mobKill=function(m){const isB=m&&m.boss&&D&&D.zone,key=isB?(D.dg?'dg'+D.dg:'z'+D.zone.zi):null;_mk(m);
  if(key){const o=BCD8.get();o[key]=srvNow();BCD8.set(o);if(!D||!D.dg){try{if(D&&D.zone){D.bossT=BCD8.ms.z/1000;say('🏆 ปราบบอสสำเร็จ! บอสจะกลับมาอีกใน 10 นาที (ออกแล้วเข้าใหม่ก็ไม่รีเซ็ต)')}}catch(e){}}}}}
// ---------- 5) มอนติดแร่/กำแพงแล้วไม่ไล่ → เลี่ยงอ้อมไปอีกทาง ----------
{const _mv=mvM;mvM=function(m,dx,dy){const len=Math.hypot(dx,dy);if(!m||!m.F||len<1e-3||m.st==='lunge'||m.kx||m.ky)return _mv(m,dx,dy);
  const x0=m.x,y0=m.y;
  if(m.dtr>0&&m.st==='chase'){m.dtr--;const a=m.dsg*1.2,c=Math.cos(a),s=Math.sin(a);_mv(m,dx*c-dy*s,dx*s+dy*c);if(Math.hypot(m.x-x0,m.y-y0)<len*.25)m.dsg=-m.dsg;return}
  _mv(m,dx,dy);const mv=Math.hypot(m.x-x0,m.y-y0);
  if(m.st==='chase'&&mv<len*.35){m.blk=(m.blk||0)+1;if(m.blk>10){m.blk=0;m.dtr=50;m.dsg=Math.random()<.5?1:-1}}else m.blk=Math.max(0,(m.blk||0)-1)}}
// ---------- 6) ออนไลน์ → เปิดเมนู/หน้าต่างแล้วโลกไม่หยุด ----------
{const _t=toggleMenu;toggleMenu=function(){_t();try{if(NET&&NET.on)PAUSED=false}catch(e){}}}
{const _t=openSkw;openSkw=function(){_t.apply(this,arguments);try{if(NET&&NET.on)PAUSED=false}catch(e){}}}
{const _t=openLife;openLife=function(){_t.apply(this,arguments);try{if(NET&&NET.on)PAUSED=false}catch(e){}}}
// ---------- 7) หิวจัด/แรงหมด ----------
const TIRED8={on:false,msgT:0};
{const _vt=vitalsTick;vitalsTick=function(dt){_vt(dt);const was=TIRED8.on;TIRED8.on=P.fa<=3&&!P.dead;
  if(TIRED8.on&&!was&&performance.now()-TIRED8.msgT>6000){TIRED8.msgT=performance.now();P.bub={txt:'เหนื่อยแล้ว… ขอพักก่อน',until:performance.now()+3200};say('😮‍💨 แรงหมด — วิ่งไม่ไหว เดินช้า ๆ หรือนั่งพักให้แรงฟื้น')}}}
{const _hb=heroBody;heroBody=function(){if(!TIRED8.on||P.dead||window.__IN_OTHER8)return _hb();
  const t=performance.now()/1000;ctx.save();ctx.translate(P.x,P.y);ctx.scale(1.03,.95);ctx.translate(-P.x,-P.y+(P.mv?0:Math.sin(t*5)*1.2));try{_hb()}finally{ctx.restore()}
  ctx.save();ctx.fillStyle='#9fd8ff';for(let i=0;i<3;i++){const ph=(t*1.3+i*.34)%1;ctx.globalAlpha=1-ph;const x=P.x+(i-1)*9+Math.sin(t*3+i)*2,y=P.y-50+ph*14;ctx.beginPath();ctx.moveTo(x,y-4);ctx.quadraticCurveTo(x+3,y,x,y+2);ctx.quadraticCurveTo(x-3,y,x,y-4);ctx.fill()}ctx.restore()}}
// ---------- 8) สกิลต่อกันเร็วเกิน → ต้องรอท่าก่อนหน้าจบ ----------
{const _us=useSkill;let lock=0;useSkill=function(i){const now=performance.now();if(now<lock&&!PAUSED)return;const mp0=P.mp,cd0=(CS&&CS.cd?CS.cd.slice():[]);_us(i);
  let did=P.mp<mp0-.01;if(!did&&CS&&CS.cd)did=CS.cd.some((v,k)=>v>(cd0[k]||0)+.05);if(did)lock=now+((i===1&&CS&&CS.step>0)?430:640)}}
// ---------- 9) อัลติเก็บเต็มค้างไม่ได้ ----------
setInterval(()=>{try{if(typeof ULT==='undefined'||P.dead)return;
  if(ULT.v>=100&&!ULT.cast){ULT.full=(ULT.full||0)+1;if(ULT.full>=120){ULT.v=70;ULT.full=0;say('⚡ พลังอัลติเมทรั่วไหลเพราะเก็บไว้นานเกินไป (เหลือ 70%) — ใช้ในการต่อสู้จะคุ้มกว่า')}}else ULT.full=0;
  if(D&&(D.town||D.shop||D.home)&&ULT.v>30&&!ULT.cast)ULT.v=Math.max(30,ULT.v-1.5)}catch(e){}},1000);
// ---------- 10) ผู้เล่นอื่นเคลื่อนไหวนุ่ม (เดาตำแหน่งต่อจากความเร็ว ไม่กระตุก/วาร์ป) ----------
window.NETV8=function(o,s){const now=performance.now();if(o.sn){const dt=(now-o.sn)/1000;if(dt>.02&&dt<1.2){const vx=(s.x-o.sx)/dt,vy=(s.y-o.sy)/dt,cap=240;o.vx=Math.max(-cap,Math.min(cap,(o.vx||0)*.4+vx*.6));o.vy=Math.max(-cap,Math.min(cap,(o.vy||0)*.4+vy*.6))}}
 if(!s.mv){o.vx=0;o.vy=0}o.sn=now;o.sx=s.x;o.sy=s.y};
window.NETSMOOTH8=function(o,dt){const age=Math.min(.22,(performance.now()-(o.sn||0))/1000),gx=o.tx+(o.vx||0)*age,gy=o.ty+(o.vy||0)*age,d=Math.hypot(gx-o.x,gy-o.y);
 if(d>260){o.x=gx;o.y=gy;return}const k=Math.min(1,dt*(d>40?14:9));o.x+=(gx-o.x)*k;o.y+=(gy-o.y)*k};

// =====================================================================
