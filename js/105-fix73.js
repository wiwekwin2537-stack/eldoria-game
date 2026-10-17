// fix73 (v4.65) — รอบ 3 สกิลและสมดุล (HANDOFF ข้อ 7, 19, 22)
//  A) 📘 พาสซีฟเสริมสกิลใหม่ (ช่อง 4–6) ทุกอาชีพ: ปลดล็อกตามเลเวลหลังเรียนสกิล (+5 / +15 / +30 เลเวล)
//     ขั้น I ดาเมจสกิล +15% · ขั้น II คูลดาวน์ −15% · ขั้น III ดาเมจ +15% (รวม +30%) และมานา −20% · สมุนที่เรียกจากสกิลนั้นเลือดเพิ่มตามดาเมจ
//  B) ⚖️ สมดุล PvP (วัดด้วย tools/scenarios/pvpdps.js แยกทีละอาชีพ): สายประชิดเป้า ~520 · สายไกล/เวท ~450 · นักบวช ~430 (มีฮีล) — คูณเพิ่มใน PVPCB29
//  C) 🌟 อัลติเมทไม่ซ้ำกันทุกอาชีพ: 8 อาชีพที่เคยยืมท่าดาบ/ธนู/เวท (fix28) ได้ท่าใหม่ของตัวเอง + ไอคอนใหม่
//  D) 🛡️ ระหว่างร่ายอัลติจนท่าจบ (~3.6 วิ) ไม่โดนดาเมจจากมอน/บอส/ผู้เล่น
try{
// ---------- A) พาสซีฟเสริมสกิลใหม่ ----------
const SSP73=[{d:5,n:'I',t:'ดาเมจสกิล +15%'},{d:15,n:'II',t:'คูลดาวน์ −15%'},{d:30,n:'III',t:'ดาเมจ +15% · มานา −20%'}];window.SSP73=SSP73;
const learned73=i=>{try{return i<3||(window.bought56?bought56(i):true)}catch(e){return true}};
function sspTier73(i){const S=(CSKILLS[P.cls]||[])[i];if(!S||i<3||!learned73(i))return 0;let t=0;for(let k=0;k<3;k++)if(P.lv>=Math.min(150,S.lv+SSP73[k].d))t=k+1;return t}
window.sspTier73=sspTier73;window.SKM73=1;
{const _us=useSkill;useSkill=function(i){const t=(i>=3&&P.cls!=='none'&&!P.dead)?sspTier73(i):0;if(!t)return _us.apply(this,arguments);
  const cd0=CS.cd[i]||0,mp0=P.mp,m=1+(t>=1?.15:0)+(t>=3?.15:0),o0=window.SKM73;window.SKM73=m;let r;try{r=_us.apply(this,arguments)}finally{window.SKM73=o0}
  try{const cast=(CS.cd[i]||0)>cd0+.01;if(cast){if(t>=2)CS.cd[i]*=.85;if(t>=3&&P.mp<mp0)P.mp=Math.min(BAL.mp,P.mp+(mp0-P.mp)*.2)}}catch(e){}return r};window.useSkill=useSkill}
{const _h=hurtE;hurtE=function(e,mult,o){if(window.SKM73!==1&&!(o&&o.ult)&&isFinite(mult))mult*=window.SKM73;return _h.call(this,e,mult,o)};window.hurtE=hurtE}
{const _sh=shoot;shoot=function(kind,o){if(window.SKM73!==1&&o&&isFinite(o.mult))o=Object.assign({},o,{mult:o.mult*window.SKM73});return _sh.apply(this,[kind,o])};window.shoot=shoot}
{const _sm=summon;summon=function(k,n){const n0=MIN.length,r=_sm.apply(this,arguments);try{if(window.SKM73!==1)for(let j=n0;j<MIN.length;j++){const m=MIN[j];if(m&&m.hp){m.hp=Math.round(m.hp*window.SKM73);if(m.mhp)m.mhp=Math.round(m.mhp*window.SKM73)}}}catch(e){}return r};window.summon=summon}
{const _r=renderSkw;renderSkw=function(){const r=_r.apply(this,arguments);try{if(skwEl.hidden||P.cls==='none'||skwEl.querySelector('.ssp73'))return r;const card=[...skwEl.querySelectorAll('.card')].find(c=>/พาสซีฟอาชีพ/.test((c.querySelector('b')||{}).textContent||''));if(!card)return r;
  const L=CSKILLS[P.cls]||[];let h='<div class="card ssp73"><b>📘 พาสซีฟเสริมสกิลใหม่ (ช่อง 4–6)</b><small style="display:block;opacity:.75;margin:2px 0 6px">ปลดล็อกเองตามเลเวลหลังเรียนสกิลที่ร้านสกิล</small>';
  for(let i=3;i<Math.min(6,L.length);i++){const S=L[i],ok=learned73(i);h+='<div style="margin:6px 0 2px;font-weight:800">'+(S.e||'')+' '+S.n+(ok?'':' <span style="color:#ff9a7a;font-size:11px">🔒 ยังไม่ได้เรียน</span>')+'</div>';
   SSP73.forEach((T,k)=>{const lv=Math.min(150,S.lv+T.d),on=ok&&P.lv>=lv;h+='<div style="display:flex;justify-content:space-between;gap:8px;font-size:12px;padding:3px 8px;margin:2px 0;border-radius:8px;background:'+(on?'rgba(122,255,154,.12)':'rgba(255,255,255,.04)')+'"><span>'+(on?'✅':'🔒')+' ขั้น '+T.n+' · '+T.t+'</span><span style="opacity:.8">Lv.'+lv+'</span></div>'})}
  card.insertAdjacentHTML('afterend',h+'</div>')}catch(e){}return r};window.renderSkw=renderSkw}
// ---------- B) สมดุล PvP ----------
const PVPB73={sword:.82,monk:.71,ninja:1.08,dragoon:1.13,paladin:1.26,mage:.77,archer:1.48,sniper:1.05,cleric:.59,necro:.87,summoner:1.24}; // วัด 3 รอบ/อาชีพ หลังพาสซีฟเสริมสกิล → ปรับครึ่งทางเข้าหาเป้าwindow.PVPB73=PVPB73;
try{for(const c in PVPB73)if(PVPCB29[c]!=null)PVPCB29[c]=Math.round(PVPCB29[c]*PVPB73[c]*100)/100}catch(e){}
// ---------- D) อมตะระหว่างอัลติ ----------
window.INV73=0;
{const _cu=castUlt;castUlt=function(){const was=!!ULT.cast;const r=_cu.apply(this,arguments);try{if(!was&&ULT.cast)window.INV73=performance.now()+3600}catch(e){}return r};window.castUlt=castUlt}
const inv73=()=>performance.now()<window.INV73&&!P.dead;
{const _z=zHurt;zHurt=function(src,dmg,kbm,msg){try{if(inv73()&&!(typeof W33!=='undefined'&&W33.swap)){if(Math.random()<.25)dmgTxt(P.x,P.y-46,'ไม่ระคาย','#ffe9a0');return}}catch(e){}return _z.apply(this,arguments)};window.zHurt=zHurt}
{const _hp=hurtPlayer;hurtPlayer=function(){if(inv73())return;return _hp.apply(this,arguments)};window.hurtPlayer=hurtPlayer}
{const _pv=pvpHurt8;pvpHurt8=function(d){if(inv73())return;return _pv.apply(this,arguments)};window.pvpHurt8=pvpHurt8}
// ---------- C) อัลติเมทใหม่ 8 อาชีพ ----------
const FX73=[];window.FX73=FX73;
const fx73=(o)=>{o.t=0;o.dl=o.dl||0;FX73.push(o);return o};
const ring73=(x,y,rgb,s,l)=>{try{RFX.push({k:'ring',x,y,t:0,l:l||.5,rgb,s})}catch(e){}};
const sp73=(x,y,n,rgb,sp,up)=>{for(let j=0;j<n;j++){const a=Math.random()*6.28,s=(sp||120)*(.4+Math.random());try{rfxP(x,y,Math.cos(a)*s,Math.sin(a)*s*.55-(up||40),.7,rgb,1.8+Math.random()*1.6,'spark')}catch(e){}}};
const foes73=r=>enemies().filter(e=>!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<r).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y));
const dv73=()=>{const v=DIRV[(ULT.cast&&ULT.cast.dir)||P.dir]||[1,0];return [v[0],v[1]]};
function gst73(x,y,a,col,dir){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);if(dir<0)ctx.scale(-1,1);ctx.fillStyle=col;ctx.fillRect(-5,-30,10,10);ctx.fillRect(-7,-20,14,14);ctx.fillRect(-6,-6,5,8);ctx.fillRect(1,-6,5,8);ctx.fillRect(7,-18,14,3);ctx.restore()}
const NEWU73={
 ninja(){const L=foes73(300),n=10;for(let i=0;i<n;i++){fx73({k:'nslash',dl:i*.09,l:.32,i,tick:f=>{if(f.hit)return;f.hit=1;const e=L.length?L[i%L.length]:null;f.x=e?e.x:P.x+(Math.random()-.5)*200;f.y=e?e.y-10:P.y-10+(Math.random()-.5)*120;f.a=Math.random()*3.14;
   if(e)hurtE(e,2.2,{kb:60,ult:1,col:'#c8d0ff'});tone(1500,500,.12,'square',.03);sp73(f.x,f.y,6,'150,160,255',140)}})}
  fx73({k:'nx',dl:1.0,l:.6,tick:f=>{if(f.hit)return;f.hit=1;eachIn(P.x,P.y,170,e=>hurtE(e,6,{kb:300,stun:1,ult:1,col:'#ffffff'}));shake(7,.4);boom(1);ring73(P.x,P.y,'140,150,255',180,.6);sp73(P.x,P.y,40,'200,200,255',260)}})},
 sniper(){const v=dv73();fx73({k:'laser',l:.55,v,x:P.x,y:P.y-12});
  fx73({k:'beam',dl:.55,l:.7,v,tick:f=>{f.x=P.x;f.y=P.y-12;if(f.hit)return;f.hit=1;line25(v,720,60,e=>hurtE(e,18,{kb:340,ult:1,col:'#bff8ff'}));shake(9,.5);boom(1.3);FADE.a=.35;FADE.c='#e0ffff';
   for(let k=1;k<=3;k++){const bx=P.x+v[0]*k*190,by=P.y-12+v[1]*k*190;fx73({k:'pop',dl:.12*k,l:.5,x:bx,y:by,tick:g=>{if(g.hit)return;g.hit=1;eachIn(g.x,g.y,110,e=>hurtE(e,6,{kb:160,ult:1,col:'#ffe08a'}));ring73(g.x,g.y,'255,220,120',100,.45);sp73(g.x,g.y,20,'255,220,120',200)}})}}})},
 paladin(){const e=foeNear(320),tx=e?e.x:P.x+dv73()[0]*120,ty=e?e.y:P.y+dv73()[1]*90;
  fx73({k:'hammer',l:1.0,x:tx,y:ty,tick:f=>{if(f.hit||f.t<.5)return;f.hit=1;eachIn(f.x,f.y,200,q=>hurtE(q,10,{kb:380,stun:1.5,ult:1,col:'#fff6c0'}));shake(11,.6);boom(1.4);FADE.a=.5;FADE.c='#fff8d8';ring73(f.x,f.y,'255,240,170',220,.8);ring73(f.x,f.y,'255,255,255',140,.5);sp73(f.x,f.y,60,'255,235,160',300,80);
   P.hp=Math.min(BAL.hp,P.hp+BAL.hp*.3);dmgTxt(P.x,P.y-50,'+'+Math.round(BAL.hp*.3),'#8fff9a');
   fx73({k:'cross',l:2.2,x:f.x,y:f.y,tk:0,tick:g=>{g.tk-=DT||.016;if(g.tk<=0){g.tk=.4;eachIn(g.x,g.y,150,q=>hurtE(q,1.2,{ult:1,col:'#fff6c0'}))}}})}})},
 cleric(){fx73({k:'wings',l:2.6});P.hp=Math.min(BAL.hp,P.hp+BAL.hp*.5);dmgTxt(P.x,P.y-50,'+'+Math.round(BAL.hp*.5),'#8fff9a');
  for(let i=0;i<8;i++)fx73({k:'rain',dl:.2+i*.25,l:.4,tick:f=>{if(f.hit)return;f.hit=1;eachIn(P.x,P.y,220,e=>{hurtE(e,1.6,{ult:1,col:'#bff0ff'});sp73(e.x,e.y-20,5,'190,240,255',80,60)});tone(1800,2400,.15,'sine',.03)}});
  fx73({k:'nova',dl:2.3,l:.6,tick:f=>{if(f.hit)return;f.hit=1;eachIn(P.x,P.y,240,e=>hurtE(e,5,{kb:300,ult:1,col:'#ffffff'}));shake(6,.4);boom(.9);ring73(P.x,P.y,'190,240,255',240,.7);sp73(P.x,P.y,50,'220,250,255',260)}})},
 necro(){const e=foeNear(320),tx=e?e.x:P.x+dv73()[0]*130,ty=e?e.y:P.y+dv73()[1]*90;try{summon('skel',3)}catch(er){}
  fx73({k:'gate',l:2.4,x:tx,y:ty,tk:.3,n:0,tick:f=>{f.tk-=DT||.016;if(f.tk<=0&&f.n<5){f.tk=.35;f.n++;eachIn(f.x,f.y,190,q=>hurtE(q,2.4,{ult:1,col:'#7affb0'}));sp73(f.x,f.y,12,'120,255,170',120,80)}
   if(!f.hit&&f.t>2){f.hit=1;eachIn(f.x,f.y,210,q=>hurtE(q,8,{kb:360,stun:1.2,ult:1,col:'#c8ffd8'}));shake(9,.5);boom(1.2);ring73(f.x,f.y,'120,255,170',230,.8);sp73(f.x,f.y,60,'160,90,255',280,90)}}})},
 monk(){const e=foeNear(220);for(let i=0;i<12;i++)fx73({k:'fist',dl:i*.07,l:.25,tick:f=>{if(f.hit)return;f.hit=1;const q=e&&!e.dead?e:foeNear(220);f.x=(q?q.x:P.x+dv73()[0]*60)+(Math.random()-.5)*26;f.y=(q?q.y-14:P.y-14)+(Math.random()-.5)*22;if(q)hurtE(q,1.3,{kb:20,ult:1,col:'#ffd8a0'});tone(300,120,.06,'square',.05);sp73(f.x,f.y,4,'255,190,110',90)}});
  const v=dv73();fx73({k:'palm',dl:.95,l:.7,x:P.x+v[0]*80,y:P.y+v[1]*60-6,tick:f=>{if(f.hit||f.t<.15)return;f.hit=1;eachIn(f.x,f.y,170,q=>hurtE(q,9,{kb:420,stun:1.2,ult:1,col:'#ffffff'}));shake(10,.5);boom(1.3);ring73(f.x,f.y,'255,190,110',200,.7);sp73(f.x,f.y,50,'255,210,140',300)}})},
 dragoon(){const e=foeNear(320),tx=e?e.x:P.x+dv73()[0]*130,ty=e?e.y:P.y+dv73()[1]*90;
  fx73({k:'dragon',l:1.5,x:tx,y:ty,tick:f=>{if(f.hit||f.t<.75)return;f.hit=1;eachIn(f.x,f.y,220,q=>hurtE(q,11,{kb:420,stun:1.3,ult:1,burn:3,col:'#ffb0a0'}));shake(12,.7);boom(1.5);FADE.a=.45;FADE.c='#ffd0c0';ring73(f.x,f.y,'255,110,90',240,.8);sp73(f.x,f.y,70,'255,140,90',320,90);
   fx73({k:'flame',l:2,x:f.x,y:f.y,tk:0,tick:g=>{g.tk-=DT||.016;if(g.tk<=0){g.tk=.5;eachIn(g.x,g.y,170,q=>hurtE(q,1.5,{ult:1,col:'#ff9a6a'}))}}})}})},
 summoner(){const v=dv73(),hit=new Set();try{summon('lion',1)}catch(er){}
  for(let i=0;i<7;i++){const off=(i-3)*22;fx73({k:'beast',dl:i*.08,l:1.1,v,off,i,tick:f=>{const s=Math.min(1,f.t/1.0)*620-80;f.x=P.x+v[0]*s-v[1]*off;f.y=P.y-6+v[1]*s+v[0]*off*.6;eachIn(f.x,f.y,48,q=>{const key=q;if(!f.hs)f.hs=new Set();if(f.hs.has(key))return;f.hs.add(key);hurtE(q,2.4,{kb:120,ult:1,col:'#c8ff9a'});sp73(q.x,q.y-10,6,'160,225,110',120)})}})}
  shake(5,.8);boom(.8)}};
window.NEWU73=NEWU73;
{const _uf=ultFire;ultFire=function(k){if(NEWU73[k]){try{NEWU73[k]()}catch(e){console.warn('ult73',k,e)}return}return _uf.apply(this,arguments)};window.ultFire=ultFire}
{const _pt=playerTick;playerTick=function(dt){_pt.apply(this,arguments);try{for(let i=FX73.length-1;i>=0;i--){const f=FX73[i];if(f.dl>0){f.dl-=dt;continue}f.t+=dt;if(f.tick)f.tick(f,dt);if(f.t>=f.l)FX73.splice(i,1)}}catch(e){}};window.playerTick=playerTick}
function draw73(){const t=performance.now()/1000;for(const f of FX73){if(f.dl>0)continue;const u=Math.min(1,f.t/f.l),a=1-u;ctx.save();
 if(f.k==='nslash'&&f.x!=null){ctx.globalCompositeOperation='lighter';ctx.translate(f.x,f.y);ctx.rotate(f.a);ctx.strokeStyle='rgba(180,190,255,'+a+')';ctx.lineWidth=5*a+1;ctx.beginPath();ctx.moveTo(-44,0);ctx.lineTo(44,0);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-40,0);ctx.lineTo(40,0);ctx.stroke();ctx.restore();ctx.save();gst73(f.x-14,f.y+10,.45*a,'#3a2a6a',f.i%2?1:-1)}
 else if(f.k==='nx'){ctx.globalCompositeOperation='lighter';ctx.translate(P.x,P.y-14);const r=170*Math.min(1,f.t*4);ctx.strokeStyle='rgba(200,205,255,'+a+')';ctx.lineWidth=8*a+2;for(const s of [1,-1]){ctx.beginPath();ctx.moveTo(-r,-r*.5*s);ctx.lineTo(r,r*.5*s);ctx.stroke()}}
 else if(f.k==='laser'){ctx.strokeStyle='rgba(255,60,60,'+(.4+.5*Math.sin(t*40))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(P.x,P.y-12);ctx.lineTo(P.x+f.v[0]*720,P.y-12+f.v[1]*720);ctx.stroke();ctx.fillStyle='rgba(255,80,80,.8)';ctx.beginPath();ctx.arc(P.x+f.v[0]*24,P.y-12+f.v[1]*24,3+u*6,0,7);ctx.fill()}
 else if(f.k==='beam'&&f.x!=null){ctx.globalCompositeOperation='lighter';const w=44*a+4,ex=f.x+f.v[0]*720,ey=f.y+f.v[1]*720;ctx.lineCap='round';ctx.strokeStyle='rgba(120,230,255,'+(.55*a)+')';ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.lineWidth=w*.35;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(ex,ey);ctx.stroke()}
 else if(f.k==='hammer'){ctx.globalCompositeOperation='lighter';const fall=Math.min(1,f.t/.5),hy=f.y-260*(1-fall);const pg=ctx.createLinearGradient(0,f.y-300,0,f.y);pg.addColorStop(0,'rgba(255,240,170,0)');pg.addColorStop(1,'rgba(255,240,170,'+(.35*a)+')');ctx.fillStyle=pg;ctx.fillRect(f.x-30,f.y-300,60,300);
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=Math.min(1,a*1.5);ctx.fillStyle='#fff3c0';ctx.fillRect(f.x-5,hy-90,10,80);ctx.fillStyle='#ffd86a';ctx.fillRect(f.x-34,hy-20,68,30);ctx.fillStyle='#fffbe8';ctx.fillRect(f.x-30,hy-16,60,8)}
 else if(f.k==='cross'){ctx.globalCompositeOperation='lighter';ctx.translate(f.x,f.y);ctx.scale(1,.4);ctx.strokeStyle='rgba(255,240,170,'+(.6*a+.2)+')';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-120,0);ctx.lineTo(120,0);ctx.moveTo(0,-120);ctx.lineTo(0,120);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,140,0,7);ctx.stroke()}
 else if(f.k==='wings'){ctx.globalCompositeOperation='lighter';const fl=Math.sin(t*6)*.12,al=Math.min(1,f.t*3)*Math.min(1,(f.l-f.t)*2);for(const s of [-1,1]){ctx.save();ctx.translate(P.x+s*4,P.y-30);ctx.scale(s,1);ctx.rotate(-.35+fl);const g=ctx.createLinearGradient(0,0,70,0);g.addColorStop(0,'rgba(255,255,255,'+(.8*al)+')');g.addColorStop(1,'rgba(190,240,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(26,-50,76,-44);ctx.quadraticCurveTo(52,-24,66,-10);ctx.quadraticCurveTo(44,-6,56,8);ctx.quadraticCurveTo(26,6,0,10);ctx.closePath();ctx.fill();ctx.restore()}
  ctx.strokeStyle='rgba(255,245,200,'+(.8*al)+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(P.x,P.y-60,12,4,0,0,7);ctx.stroke();if(Math.random()<.4)try{rfxP(P.x+(Math.random()-.5)*160,P.y-110,0,50,1.4,'230,250,255',2.2,'spark')}catch(e){}}
 else if(f.k==='rain'){ctx.globalCompositeOperation='lighter';for(let j=0;j<6;j++){const x=P.x+(Math.random()-.5)*400,y=P.y+(Math.random()-.5)*200;ctx.strokeStyle='rgba(200,245,255,'+a+')';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-120);ctx.lineTo(x,y);ctx.stroke()}}
 else if(f.k==='nova'){ctx.globalCompositeOperation='lighter';const r=240*Math.min(1,f.t*3);const g=ctx.createRadialGradient(P.x,P.y,r*.2,P.x,P.y,r);g.addColorStop(0,'rgba(255,255,255,'+(.5*a)+')');g.addColorStop(1,'rgba(190,240,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(P.x,P.y,r,r*.55,0,0,7);ctx.fill()}
 else if(f.k==='gate'){const al=Math.min(1,f.t*3)*Math.min(1,(f.l-f.t)*3);ctx.translate(f.x,f.y);ctx.save();ctx.scale(1,.38);ctx.globalAlpha=al;ctx.fillStyle='rgba(10,20,14,.75)';ctx.beginPath();ctx.arc(0,0,170,0,7);ctx.fill();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(120,255,170,.9)';ctx.lineWidth=4;ctx.rotate(t*1.5);ctx.beginPath();ctx.arc(0,0,170,0,7);ctx.stroke();ctx.beginPath();for(let i=0;i<=5;i++){const an=i*2.513;i?ctx.lineTo(Math.cos(an)*150,Math.sin(an)*150):ctx.moveTo(Math.cos(an)*150,Math.sin(an)*150)}ctx.stroke();ctx.restore();
  ctx.globalAlpha=al;for(let j=0;j<5;j++){const sx=Math.sin(t*2+j*1.3)*110,sy=-((t*90+j*40)%160);ctx.fillStyle='rgba(200,255,220,'+(.7*(1+sy/160))+')';ctx.beginPath();ctx.arc(sx,sy,8,0,7);ctx.fill();ctx.fillStyle='#0a1a10';ctx.fillRect(sx-4,sy-2,3,3);ctx.fillRect(sx+1,sy-2,3,3)}}
 else if(f.k==='fist'&&f.x!=null){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,200,120,'+a+')';ctx.beginPath();ctx.arc(f.x,f.y,12*(1+u),0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,'+a+')';ctx.fillRect(f.x-7,f.y-5,14,10)}
 else if(f.k==='palm'){ctx.globalCompositeOperation='lighter';ctx.translate(f.x,f.y);const s=1+u*.6;ctx.scale(s,s);ctx.globalAlpha=a;ctx.fillStyle='rgba(255,200,110,.85)';ctx.beginPath();ctx.ellipse(0,0,46,56,0,0,7);ctx.fill();for(let j=0;j<4;j++){ctx.beginPath();ctx.ellipse(-27+j*18,-62,8,22,0,0,7);ctx.fill()}ctx.beginPath();ctx.ellipse(-52,-6,9,22,-.9,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.ellipse(0,0,22,26,0,0,7);ctx.fill()}
 else if(f.k==='dragon'){ctx.globalCompositeOperation='lighter';const dv=Math.min(1,f.t/.75),x0=f.x+160*(1-dv)*Math.cos(t*4),y0=f.y-280*(1-dv);for(let j=0;j<16;j++){const q=j/16,x=x0+Math.sin(t*8+j*.6)*20*(1-q),y=y0-j*14*(1-dv*.6);ctx.fillStyle='rgba(255,'+(90+j*8)+',70,'+(.85*(1-q)*Math.min(1,a*2))+')';ctx.beginPath();ctx.arc(x,y,14*(1-q)+3,0,7);ctx.fill()}
  ctx.fillStyle='rgba(255,240,200,'+Math.min(1,a*2)+')';ctx.beginPath();ctx.moveTo(x0-14,y0);ctx.lineTo(x0+14,y0);ctx.lineTo(x0,y0+26);ctx.closePath();ctx.fill()}
 else if(f.k==='flame'){ctx.globalCompositeOperation='lighter';ctx.translate(f.x,f.y);ctx.scale(1,.4);ctx.strokeStyle='rgba(255,120,60,'+(.5*a+.2)+')';ctx.lineWidth=12;ctx.beginPath();ctx.arc(0,0,160+Math.sin(t*10)*6,0,7);ctx.stroke()}
 else if(f.k==='beast'&&f.x!=null){ctx.globalCompositeOperation='lighter';ctx.translate(f.x,f.y);if(f.v[0]<0)ctx.scale(-1,1);ctx.globalAlpha=Math.min(1,a*2);ctx.fillStyle='rgba(160,230,110,.75)';ctx.beginPath();ctx.ellipse(0,-12,22,11,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(22,-20,10,8,0,0,7);ctx.fill();ctx.fillRect(26,-30,4,8);ctx.fillRect(18,-30,4,8);
  const lg=Math.sin(t*30+f.i)*5;ctx.fillRect(-14+lg,-4,5,12);ctx.fillRect(10-lg,-4,5,12);ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(25,-22,3,3);ctx.strokeStyle='rgba(200,255,160,.5)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-22,-12);ctx.lineTo(-60,-12);ctx.stroke()}
 else if(f.k==='pop'&&f.hit){}
 ctx.restore()}}
{const _h=hero;hero=function(){const r=_h.apply(this,arguments);try{if(FX73.length&&!window.__IN_OTHER8&&!(ctx&&ctx.canvas&&!ctx.canvas.isConnected))draw73()}catch(e){}return r};window.hero=hero}
// ไอคอนอัลติใหม่
try{const I73={ninja:['#2a2a6a','#04040c','140,150,255',q=>{q.strokeStyle='#e8ecff';q.lineWidth=6;q.beginPath();q.moveTo(14,80);q.lineTo(82,14);q.moveTo(14,14);q.lineTo(82,80);q.stroke();q.fillStyle='#2a2050';q.fillRect(40,34,16,28)}],
 sniper:['#0a4a5a','#020a0c','120,230,255',q=>{q.strokeStyle='#bff8ff';q.lineWidth=12;q.beginPath();q.moveTo(6,48);q.lineTo(92,48);q.stroke();q.strokeStyle='#ff5050';q.lineWidth=2;q.beginPath();q.arc(48,48,22,0,7);q.moveTo(48,18);q.lineTo(48,78);q.stroke()}],
 paladin:['#8a7a2a','#0c0a02','255,240,170',q=>{q.fillStyle='#fff3c0';q.fillRect(43,10,10,50);q.fillStyle='#ffd86a';q.fillRect(22,56,52,22);q.fillStyle='#fffbe8';q.fillRect(26,60,44,6)}],
 cleric:['#3a6a8a','#04080c','190,240,255',q=>{q.fillStyle='rgba(255,255,255,.9)';for(const s of [-1,1]){q.beginPath();q.moveTo(48,52);q.quadraticCurveTo(48+s*20,14,48+s*44,20);q.quadraticCurveTo(48+s*30,40,48+s*40,56);q.quadraticCurveTo(48+s*20,60,48,62);q.fill()}q.strokeStyle='#fff6c0';q.lineWidth=3;q.beginPath();q.ellipse(48,18,12,4,0,0,7);q.stroke()}],
 necro:['#1a4a2a','#020804','120,255,170',q=>{q.strokeStyle='#7affb0';q.lineWidth=4;q.beginPath();q.ellipse(48,66,36,12,0,0,7);q.stroke();q.fillStyle='#e8ffe8';q.beginPath();q.arc(48,40,16,0,7);q.fill();q.fillStyle='#0a1a10';q.fillRect(40,36,6,6);q.fillRect(50,36,6,6);q.fillRect(44,48,8,4)}],
 monk:['#8a5a1a','#0c0602','255,190,110',q=>{q.fillStyle='#ffc878';q.beginPath();q.ellipse(48,56,22,26,0,0,7);q.fill();for(let j=0;j<4;j++){q.beginPath();q.ellipse(34+j*9,26,4,12,0,0,7);q.fill()}q.beginPath();q.ellipse(24,52,4,12,-.9,0,7);q.fill()}],
 dragoon:['#8a1a1a','#0c0202','255,110,90',q=>{for(let j=0;j<10;j++){q.fillStyle='rgba(255,'+(90+j*12)+',70,'+(1-j/10)+')';q.beginPath();q.arc(30+j*5,72-j*6+Math.sin(j)*6,12-j,0,7);q.fill()}q.fillStyle='#fff0d0';q.beginPath();q.moveTo(70,14);q.lineTo(86,24);q.lineTo(70,30);q.fill()}],
 summoner:['#3a6a1a','#040802','160,225,110',q=>{q.fillStyle='rgba(180,240,130,.9)';for(let j=0;j<3;j++){const y=30+j*18;q.beginPath();q.ellipse(40+j*6,y,18,8,0,0,7);q.fill();q.beginPath();q.ellipse(60+j*6,y-6,8,6,0,0,7);q.fill()}}]};
 for(const k in I73){const [a,b,rgb,fn]=I73[k];SKART['ULT_'+k]=(q,S)=>{skBg(q,S,a,b,'#ffe9a0');sglow(q,48,48,44,rgb,.7);fn(q)};try{delete SKI6['ULT_'+k]}catch(e){}}}catch(e){console.warn('icon73',e)}
}catch(e){console.warn('fix73',e)}
