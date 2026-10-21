// fix7.js (v4.16) — ออร่าอาวุธไกล/ตีบวก, แยกสายสเตตัส, สมดุลสัตว์ขี่ + สัตว์ขี่บิน, ว่ายน้ำ + จระเข้, เพื่อนบนเซิร์ฟเวอร์
// =====================================================================
// ---------- ออร่าธนู/คทา (51/94) ----------
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){_ts(hx,hy,ang);
  try{if(P.tool!=='sword'||!isRng()||window.FRG7on)return;const W=wAura();if(!W)return;const kd=wKind(),t=performance.now()/1000,L=W.L;
   const pul=.75+.25*Math.sin(t*(4+L*.3)),a=Math.min(.8,(.2+L*.04+(W.r?.12+.06*W.r.g:0))*pul);
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
   if(kd==='bow'&&P.cls!=='sniper'){/* v5.61 ปืนสไนเก็บชนิดเป็น bow → เคยได้ออร่าโค้งรูปคันธนูค้างที่พานท้ายปืน · ปืนมีออร่าตามลำกล้องของตัวเองแล้ว (bowGlow145/aura151) */const at=P.at>=0&&P.at<.5;let bx=hx,by=hy;if(at){const sd=P.dir==='l'?-1:P.dir==='r'?1:0;bx+=sd*7;if(P.dir==='u')by-=6}
    const aim=at?AIM[P.dir]:(P.dir==='d'?Math.PI/2+.75:P.dir==='u'?-Math.PI/2-.6:AIM[P.dir]),sc=at?1:.85,HL=15*sc,px=-Math.sin(aim),py=Math.cos(aim),fx=Math.cos(aim),fy=Math.sin(aim);
    const x1=bx+px*HL,y1=by+py*HL,x2=bx-px*HL,y2=by-py*HL,cx=bx+fx*9*sc,cy=by+fy*9*sc;
    ctx.strokeStyle='rgba('+W.rgb+','+a*.5+')';ctx.lineWidth=7+L*.45;ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo(cx*2-bx,cy*2-by,x2,y2);ctx.stroke();
    ctx.strokeStyle='rgba('+W.rgb2+','+a*.75+')';ctx.lineWidth=2.4;ctx.stroke();
    if(L>=7||W.r){for(const [gx,gy] of [[x1,y1],[x2,y2]]){const g=ctx.createRadialGradient(gx,gy,0,gx,gy,8+L*.5);g.addColorStop(0,'rgba('+W.rgb2+','+a+')');g.addColorStop(1,'rgba('+W.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(gx-18,gy-18,36,36)}}
    ctx.restore();auraEmit(x1,y1,x2,y2,W,DT,1)}
   else{const tp=P.tip&&performance.now()-P.tip.t<120?P.tip:null;const tx=tp?tp.x:hx+Math.sin(ang)*28,ty=tp?tp.y:hy-Math.cos(ang)*28;
    ctx.strokeStyle='rgba('+W.rgb+','+a*.45+')';ctx.lineWidth=6+L*.45;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(tx,ty);ctx.stroke();
    ctx.strokeStyle='rgba('+W.rgb2+','+a*.7+')';ctx.lineWidth=2.2;ctx.stroke();
    const g=ctx.createRadialGradient(tx,ty,0,tx,ty,10+L*.7);g.addColorStop(0,'rgba('+W.rgb2+','+a+')');g.addColorStop(1,'rgba('+W.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(tx-26,ty-26,52,52);
    if(L>=10){const n=L>=15?4:2;for(let i=0;i<n;i++){const q=t*3+i*Math.PI*2/n,mx=(hx+tx)/2+Math.cos(q)*8,my=(hy+ty)/2+Math.sin(q)*6;const gg=ctx.createRadialGradient(mx,my,0,mx,my,5);gg.addColorStop(0,'rgba(255,255,255,.95)');gg.addColorStop(1,'rgba('+W.rgb+',0)');ctx.fillStyle=gg;ctx.fillRect(mx-5,my-5,10,10)}}
    ctx.restore();auraEmit(hx,hy,tx,ty,W,DT,1)}
  }catch(e){try{ctx.restore()}catch(_){}}}}
// ธนู/คทาที่เก็บไว้ข้างหลัง
{const _bs=backSword;backSword=function(x,by,side,f,d){_bs(x,by,side,f,d);
  try{if(!isRng()||!P.armor.sword||(P.draw&&P.tool==='sword'))return;const W=wAura();if(!W)return;auraEmit(x-5,by-12,x+9,by-38,W,DT,.35)}catch(e){}}}
// ออร่าค้างตอนตีบวก: โลกหยุดนิ่งระหว่างเปิดหน้าตีบวก → ล้างเอฟเฟกต์ที่ค้างอยู่
setInterval(()=>{try{if(typeof ENHS!=='undefined'&&ENHS.open&&!ENHS.busy&&!FRG.on)RFX.length=0}catch(e){}},120);
{const _fs=forgeStart7;forgeStart7=function(id,ok){try{RFX.length=0}catch(e){}return _fs(id,ok)}}
{const _fe=forgeEnd7;forgeEnd7=function(){const r=_fe();try{RFX.length=0}catch(e){}return r}}

// ---------- แยกสายสเตตัส: Str=ดาบ / Agi=ธนู / Int=เวท ----------
window.PRIM10=function(){const c=P.cls;let k=c==='mage'?'mage':c==='archer'?'archer':c==='sword'?'sword':null;
  if(!k){const w=(typeof wKind==='function')?wKind():'sword';k=w==='staff'?'mage':w==='bow'?'archer':'sword'}
  return k==='mage'?Math.round(P.stats.int*1.15):k==='archer'?Math.round(P.stats.agi*1.1):P.stats.str};
clsAtk=function(){return ATK()};

// ---------- สัตว์ขี่: สมดุลความเร็ว + สัตว์ขี่บิน (99) ----------
Object.assign(MOUNTS.horse,{spd:1.3});Object.assign(MOUNTS.unicorn,{spd:1.4});Object.assign(MOUNTS.flame,{spd:1.5});Object.assign(MOUNTS.wolf,{spd:1.45});
MOUNTS.pegasus={n:'เพกาซัสสายฟ้า',spd:1.35,fly:1,wing:'#e8f4ff',wing2:'#9fd0ff'};
MOUNTS.drake={n:'มังกรเวหาอเวจี',spd:1.5,fly:1,wing:'#6a2a5a',wing2:'#c04a8a'};
MPAL.pegasus={hi:'#ffffff',b:'#dfe9fa',s:'#a8b8d8',m:'#7ab8ff',leg:'#c8d4ee'};
MPAL.drake={hi:'#5a3a6a',b:'#34204a',s:'#160c24',m:'#e04a9a',leg:'#24143a'};
if(!ANIMS.some(a=>a.k==='pegasus'))ANIMS.push({k:'pegasus',n:'เพกาซัสสายฟ้า',p:80000,mount:1,d:'สัตว์ขี่บิน: ลอยข้ามน้ำได้ · ปีกแสงฟ้า · ต้อง Lv.50'});
if(!ANIMS.some(a=>a.k==='drake'))ANIMS.push({k:'drake',n:'มังกรเวหาอเวจี',p:180000,mount:1,d:'สัตว์ขี่บินหายาก: ลอยข้ามน้ำได้ · ปีกมังกรม่วง · ต้อง Lv.65'});
window.isFly10=()=>!!(MOUNT.on&&HOME.mount&&MOUNTS[HOME.mount]&&MOUNTS[HOME.mount].fly);
{const _ba=buyAnimal;buyAnimal=function(k){if(k==='pegasus'&&P.lv<50){say('ต้อง Lv.50 ขึ้นไป');sfx('thud');return}if(k==='drake'&&P.lv<65){say('ต้อง Lv.65 ขึ้นไป');sfx('thud');return}return _ba(k)}}
function wings10(x,y,f,ud,k){try{const M=MOUNTS[k];if(!M||!M.fly)return;const t=performance.now()/1000,fl=Math.sin(t*(P.mv?9:4.5)),spread=.55+.35*fl;
  ctx.save();ctx.translate(x,y-40*MSC);ctx.lineJoin='round';
  const wing=(s)=>{ctx.save();ctx.scale(s*(ud?1:f),1);ctx.rotate(-spread*(ud?1.1:.8));
   for(let i=0;i<5;i++){const L=26-i*3.2,a=i*.2-.1;ctx.save();ctx.rotate(a);ctx.fillStyle=i%2?M.wing2:M.wing;ctx.strokeStyle='rgba(20,20,40,.5)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(L*.5,-7-i,L,-2);ctx.quadraticCurveTo(L*.55,3,0,3);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}ctx.restore()};
  if(ud){wing(-1);wing(1)}else{ctx.translate(-f*2,0);wing(-1)}
  ctx.restore()}catch(e){try{ctx.restore()}catch(_){}}}
{const _ds=drawSteed;drawSteed=function(k,x,y,f,A){const fl=MOUNTS[k]&&MOUNTS[k].fly;if(fl)wings10(x,y,f,false,k);_ds(k,x,y,f,A);}}
{const _du=drawSteedUD7;drawSteedUD7=function(k,x,y,dir,A,ph){const fl=MOUNTS[k]&&MOUNTS[k].fly;if(fl&&ph===0)wings10(x,y,1,true,k);return _du(k,x,y,dir,A,ph)};window.drawSteedUD7=drawSteedUD7}
{const _mp=mountParticles;mountParticles=function(k,x,y,f,A,dt){if(MOUNTS[k]&&MOUNTS[k].fly){if(A&&Math.random()<dt*14){rfxP(x+(Math.random()-.5)*20,y-12+Math.random()*8,(Math.random()-.5)*14,16+Math.random()*10,.7,k==='drake'?'220,90,170':'170,215,255',2,'spark')}return}return _mp(k,x,y,f,A,dt)}}
// ลอยสูงจากพื้น + เงาที่พื้น
{const _h=hero;hero=function(){if(!(MOUNT.on&&!P.dead&&isFly10()&&!window.__IN_OTHER8))return _h();
  const t=performance.now()/1000;ctx.save();ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(P.x,P.y+3,20,6,0,0,7);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(0,-15+Math.sin(t*3)*2);try{_h()}finally{ctx.restore()}}}
// รวมความเร็วเดิน: เพดานไม่ให้เร็วเกินไป
{const _sm=spdMul;spdMul=function(){let v=_sm();if(swim10()&&!isFly10())v*=.62;return Math.min(v,2.05)}}

// ---------- ว่ายน้ำ + จระเข้ + สาเหตุการตาย (95) ----------
window.swim10=()=>{try{if(D||P.dead)return false;const tx=Math.floor(P.x/T),ty=Math.floor(P.y/T);return !!(map[ty]&&map[ty][tx]===WATER)}catch(e){return false}};
window.SWIM10=()=>!!(window.INPT10&&(isFly10()||swim10()||SWIMOK10()));
// ให้ก้าวลงน้ำได้: ถ้ากำลังยืนบนน้ำหรือเดินเข้าหาน้ำก็ผ่านได้
window.SWIMOK10=()=>!D&&!P.dead&&!MOUNT.on;
{const w=f=>function(){const o=window.INPT10;window.INPT10=1;try{return f.apply(this,arguments)}finally{window.INPT10=o}};
 playerTick=w(playerTick);moveSlide=w(moveSlide);slideAxis=w(slideAxis);setTimeout(()=>{try{dashStep=w(dashStep)}catch(e){}},500)}
const SW10={t:0,warn:0,cd:20};
window.CROC10={t:0};
setInterval(()=>{try{
  if(P.dead||D){SW10.t=0;SW10.warn=0;return}
  if(swim10()&&!isFly10()){
   if(MOUNT.on){MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}say('🌊 สัตว์ขี่ว่ายน้ำไม่ได้ — ลงจากหลังแล้ว')}
   SW10.t+=.25;SW10.cd-=.25;
   if(SW10.warn>0){SW10.warn-=.25;
    if(SW10.warn<=0){if(swim10()&&!(typeof GM7!=='undefined'&&GM7.god)){CROC10.t=performance.now();try{sfx('thud')}catch(e){}try{sysSay('🐊 จระเข้ลากคุณลงไปใต้น้ำ!')}catch(e){}startDeath()}SW10.warn=0;SW10.cd=40}}
   else if(SW10.t>5&&SW10.cd<=0&&Math.random()<.25/110){SW10.warn=1.4;try{sysSay('🌊 น้ำกระเพื่อมผิดปกติ… รีบขึ้นฝั่ง!')}catch(e){}}
  }else{SW10.t=0;SW10.warn=0;if(SW10.cd<20)SW10.cd=Math.min(20,SW10.cd+.25)}
 }catch(e){}},250);
{const _dc=deathCause9;window.deathCause9=function(){if(performance.now()-CROC10.t<6000)return '🐊 ถูกจระเข้ในน้ำลากลงไปกินตาย — ใครโชคร้ายก็โดน!';return _dc()}}
// ภาพว่ายน้ำ: ซ่อนครึ่งล่างใต้ผิวน้ำ + วงน้ำกระเพื่อม
{const _h=hero;hero=function(){if(!swim10()||isFly10()){return _h()}
  const t=performance.now()/1000,x=P.x,y=P.y;
  ctx.save();ctx.beginPath();ctx.rect(x-80,y-160,160,160-12+Math.sin(t*3)*1.2);ctx.clip();ctx.translate(0,5+Math.sin(t*3)*1);try{_h()}finally{ctx.restore()}
  ctx.save();ctx.strokeStyle='rgba(235,248,255,.75)';ctx.lineWidth=1.4;for(let i=0;i<3;i++){const u=((t*.9+i/3)%1);ctx.globalAlpha=(1-u)*.8;ctx.beginPath();ctx.ellipse(x,y+2,10+u*16,3+u*6,0,0,7);ctx.stroke()}
  if(SW10.warn>0){ctx.globalAlpha=.9;const a=t*5;ctx.fillStyle='#143a2a';ctx.beginPath();ctx.moveTo(x+Math.cos(a)*22,y+Math.sin(a)*8-7);ctx.lineTo(x+Math.cos(a)*22+5,y+Math.sin(a)*8+1);ctx.lineTo(x+Math.cos(a)*22-5,y+Math.sin(a)*8+1);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(20,60,40,.8)';ctx.beginPath();ctx.ellipse(x,y+2,26+Math.sin(t*8)*3,10,0,0,7);ctx.stroke()}
  ctx.restore()}}

// ---------- เพื่อนเก็บบนเซิร์ฟเวอร์ (98) ----------
window.FRSYNC10=async function(push){try{if(!window.FM_ACCT||!CLOUD.base())return false;
  const r=await CLOUD.call('/api/friends',push?{id:FM_ACCT,token:CLOUD.tok(FM_ACCT),op:'set',friends:FR9.list}:{id:FM_ACCT,token:CLOUD.tok(FM_ACCT),op:'get'},20000);
  if(!r||!r.ok)return false;
  if(!push){const dirty=localStorage.getItem('fm_friends9_dirty')==='1';
   if(dirty||(!r.friends.length&&FR9.list.length))return FRSYNC10(true);
   if(r.friends.length||!FR9.list.length){FR9.list=r.friends.slice();try{localStorage.setItem('fm_friends9',JSON.stringify(FR9.list))}catch(e){}}}
  else try{localStorage.removeItem('fm_friends9_dirty')}catch(e){}
  return true}catch(e){return false}};
{const _pm=PM9;window.PM9=function(act,id){const b=FR9.list.join('|');const r=_pm(act,id);if(act==='f'&&FR9.list.join('|')!==b){try{localStorage.setItem('fm_friends9_dirty','1')}catch(e){}FRSYNC10(true)}return r}}
{let tries=0;const iv=setInterval(async()=>{tries++;if(await FRSYNC10(false)||tries>8)clearInterval(iv)},9000)}

// =====================================================================
