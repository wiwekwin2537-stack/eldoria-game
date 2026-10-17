// fix93 (v4.80) — ⚔️ ทุ่งสังหาร: แมพฟาร์มมอนเป็นกลุ่มหลัง Lv.150 (เจ้าของสั่ง 2026-10-14 10:48: "อยากได้เกมฟาร์มมอน แบบยืนฟาร์มมอนเป็นกลุ่ม")
//  ต่อยอดระบบหลักทั้งหมด: แมพใหม่ใน ZONES/NZ15 (ประตูมิติในบัลลังก์ทวยเทพ) · มอนร่วมกันทุกจอด้วย W33 โฮสต์/คนดู · ฟาร์มออโต้ 🤖 เดิมใช้ได้ · XP เข้าดาวตำนาน (fix92)
//  1) ฝูงมอน: มอนเกิดเป็นฝูง 4–7 ตัว รอบ ๆ ผู้เล่น แล้ววิ่งเข้าหา (เลือดน้อย ตายง่าย มาเยอะ) → ยืนกดสกิลวงกว้างฟาร์มได้รัว ๆ · มอนที่ห่างทุกคนเกิน 950px หายไปเกิดใหม่ใกล้คน
//  2) คอมโบ: ฆ่าต่อเนื่องไม่ขาดเกิน 4 วิ → XP +2% ทุก 5 คอมโบ (สูงสุด +60%) · ฆ่า 5 ตัวในพริบตา = "สังหารหมู่"
//  3) ฟาร์มเป็นกลุ่ม: มีเพื่อนอยู่ใกล้ (700px) XP +20% ต่อคน (สูงสุด +80%)
//  4) เกจคลั่ง (ทั้งแมพร่วมกัน · โฮสต์นับ ส่งให้ทุกจอด้วย sx 'rg'): ทุกคนฆ่ารวม 150 ตัว → ⚠️ คลื่นอสูรคลั่ง 45 วิ (มอนมาเป็น 2 เท่า + ก้อนทองอสูรดรอปเหรียญ)
//     จบคลื่น → 👑 ราชาอสูรคลั่ง โผล่ (ทุกคนที่ช่วยตีได้ไข่สัตว์ลึกลับ + ดาวนิรันดร์)
//  5) ของ: ดาวนิรันดร์ (ใช้ร่วมกับร้าน fix92) · ไข่สัตว์ลึกลับ (หายาก) · เหรียญจากก้อนทอง
try{
const RZ93={id:'rage',n:'ทุ่งสังหารอสูรคลั่ง',e:'⚔️',lv:[150,158],gateIn:NZI15.throne,ulv:150,ores:[['treeG',1]],raw:'woodG',ing:'godc',amb:'mote',dark:1,
 pal:{fl:['#4a2420','#43201c','#3c1c18'],top:'#2e1612',face:'#1e0e0c',edge:'#0e0606',ac:'#ff5a2a',vd:'#120606'},
 mobs:[['wolf','หมาป่านรกคลั่ง',['#5a1a14','#2a0a08','#ff4a1a']],['skeleton','ทหารกระดูกอสูร',['#e8d0c0','#6a2a1a','#ff6a2a']],['bat','ค้างคาวโลหิต',['#7a1a2a','#3a0a14','#ffd84a']],['beetle','ด้วงเกราะลาวา',['#3a2a2a','#1a0e0e','#ff8a2a']]],
 boss:{f:'dragon',n:'👑 ราชาอสูรคลั่ง',lv:165,c:['#ff3a1a','#2a0606','#ffe060']}};
if(!ZONES.some(q=>q.id==='rage'))ZONES.push(RZ93);NZI15.rage=ZONES.findIndex(q=>q.id==='rage');if(!NZ15.some(q=>q.id==='rage'))NZ15.push(RZ93);
const RZI93=NZI15.rage;window.RZI93=RZI93;
const inRage93=()=>!!(D&&D.zone&&D.zone.Zd&&D.zone.Zd.id==='rage'&&!D.tower10);window.inRage93=inRage93;
const RG93={meter:0,need:150,wave:0,waveT:0,bossDue:0,sendT:0,
 combo:0,comboT:0,best:0,mk:[],partyN:0,xpMul:1};window.RG93=RG93;
const WAVE93=45;

// ---------- มอนเบาแต่มาเยอะ ----------
{const _ms=mobStats;mobStats=function(L,f,elite,boss){const s=_ms.apply(this,arguments);try{if(inRage93()&&!boss){s.hp=Math.round(s.hp*.32);s.atk=Math.round(s.atk*.6)}}catch(e){}return s};window.mobStats=mobStats}
function spotNear93(ax,ay,r0,r1){const Zm=D.zone;for(let g=0;g<260;g++){const [x,y]=Zm.floor[Math.floor(Math.random()*Zm.floor.length)];const px=x*T+16,py=y*T+16,d=Math.hypot(px-ax,py-ay);
  if(d<r0||d>r1)continue;if(Zm.oreAt[y*ZW+x]&&Zm.oreAt[y*ZW+x].alive)continue;if(Math.hypot(x-Zm.ent.x,y-Zm.ent.y)<5)continue;return [px,py]}return null}
function pack93(gold){const Zd=D.zone.Zd,ps=[{x:P.x,y:P.y,dead:P.dead}];try{for(const o of NET.others.values())ps.push(o)}catch(e){}
 const live=ps.filter(p=>!p.dead);if(!live.length)return;const a=live[Math.floor(Math.random()*live.length)];
 const s=spotNear93(a.x,a.y,230,380);if(!s)return;const [f,nm,col]=Zd.mobs[Math.floor(Math.random()*Zd.mobs.length)];
 const n=(RG93.wave?6:4)+Math.floor(Math.random()*(RG93.wave?4:4));
 for(let i=0;i<n;i++){const x=s[0]+(Math.random()-.5)*70,y=s[1]+(Math.random()-.5)*50;if(zHit(x,y))continue;const L=Zd.lv[0]+Math.floor(Math.random()*(Zd.lv[1]-Zd.lv[0]+1));
  const m=mkMob(f,nm,col,L,x,y,{elite:Math.random()<.06});m.aggro=1;m.st='chase';m.r93=1;D.mobs.push(m)}
 if(gold){const s2=spotNear93(a.x,a.y,180,300);if(s2){const m=mkMob('beetle','💰 ก้อนทองอสูร',['#ffd84a','#b07a10','#ffffff'],155,s2[0],s2[1],{elite:1});m.hp=m.max=Math.round(m.max*1.5);m.gold93=1;m.r93=1;m.aggro=0;D.mobs.push(m)}}}
let packT93=0;
{const _uz=updZone;updZone=function(dt){try{if(inRage93()&&!RG93.bossDue&&!D.boss)D.bossT=1e9}catch(e){}const r=_uz.apply(this,arguments);try{if(inRage93()&&!P.dead)for(const d of drops){if(d.t<.4)continue;const dx=P.x-d.x,dy=(P.y-8)-d.y,q=Math.hypot(dx,dy)||1;if(q<320&&q>12){const sp=Math.min(q,(420+(320-q))*dt);d.x+=dx/q*sp;d.y+=dy/q*sp}}}catch(e){}try{if(inRage93()&&W33.mode!=='mirror'&&!P.dead&&!PAUSED){
   const cap=RG93.wave?95:55,normal=D.mobs.filter(m=>!m.boss&&!m.dead).length;
   if((packT93-=dt)<=0){packT93=RG93.wave?.55:1.1;if(normal<cap)pack93(RG93.wave&&Math.random()<.18)}
   // มอนที่ห่างทุกคนเกินไป → เอาออก (ให้เกิดใหม่ใกล้คน)
   if(Math.random()<dt*2){const ps=[P];try{for(const o of NET.others.values())ps.push(o)}catch(e){}
    for(const m of D.mobs){if(m.boss||m.dead||!m.r93)continue;let near=false;for(const p of ps)if(Math.hypot(p.x-m.x,p.y-m.y)<950){near=true;break}if(!near){m.dead=true}}}
   // คลื่นจบ → ราชาอสูร
   if(RG93.wave){RG93.waveT-=dt;if(RG93.waveT<=0){RG93.wave=0;RG93.meter=0;if(!D.boss){D.bossT=.1;RG93.bossDue=1}send93(true)}}
   if(!RG93.wave&&!RG93.bossDue&&!D.boss)D.bossT=1e9; // บอสโผล่จากคลื่นเท่านั้น
   if((RG93.sendT-=dt)<=0){RG93.sendT=1;send93(false)}}}catch(e){console.warn('rage93',e)}return r};window.updZone=updZone}
{const _sb=spawnBoss;spawnBoss=function(){const r=_sb.apply(this,arguments);try{if(inRage93()&&D.boss){RG93.bossDue=0;const b=D.boss;try{const s=spotNear93(P.x,P.y,200,300);if(s){b.x=b.hx=s[0];b.y=b.hy=s[1]}}catch(e){}b.hp=b.max=Math.round(b.max*(2+NET.others.size*.8));b.aggro=1;b.r93=1;
   bossAnn93()}}catch(e){}return r};window.spawnBoss=spawnBoss}
function bossAnn93(){try{banner('👑 ราชาอสูรคลั่งปรากฏตัว!','ช่วยกันล้ม — ทุกคนที่ตีได้ไข่สัตว์ลึกลับ','');flash('#ff3a1a',.5);sfx('crumble')}catch(e){}}
// ---------- เกจคลั่ง: โฮสต์นับทุกตัวที่ตาย · ส่งให้ทุกจอ ----------
function send93(force){try{if(NET.on&&NET.others.size)netSend({t:'sx',k:'rg',v:Math.round(RG93.meter),w:RG93.wave?Math.round(RG93.waveT):0,b:D&&D.boss&&!D.boss.dead?1:0})}catch(e){}}
function waveStart93(){RG93.wave=1;RG93.waveT=WAVE93;RG93.meter=RG93.need;try{E92.f.waves=(E92.f.waves|0)+1;save92()}catch(e){}
 try{banner('⚠️ คลื่นอสูรคลั่ง!','ฝูงอสูรบุกจากทุกทิศ '+WAVE93+' วิ — รอดให้ได้ แล้วราชาอสูรจะปรากฏ!','');flash('#ff2a1a',.55);sfx('crumble');sysSay('⚠️ คลื่นอสูรคลั่งเริ่มแล้ว! มอนมาเป็น 2 เท่า + 💰 ก้อนทองอสูร')}catch(e){}}
{const _o=onSx33;onSx33=function(d){if(d&&d.k==='rg'){try{if(inRage93()&&d.sc===netScene()&&d.from===W33.host&&W33.mode==='mirror'){
    const was=RG93.wave;RG93.meter=+d.v||0;RG93.wave=d.w>0?1:0;RG93.waveT=+d.w||0;if(!was&&RG93.wave)waveStart93();if(d.b&&!RG93.sawB){RG93.sawB=1;bossAnn93()}if(!d.b)RG93.sawB=0}}catch(e){}return}
  return _o.apply(this,arguments)};window.onSx33=onSx33}
// ---------- ฆ่ามอน: คอมโบ / สังหารหมู่ / ของ / เกจ ----------
const comboMul93=()=>1+Math.min(.6,Math.floor(RG93.combo/5)*.02);
const partyMul93=()=>1+Math.min(.8,RG93.partyN*.2);
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);const r=_mk.apply(this,arguments);
  try{if(!m||was||!m.dead||!inRage93())return r;
   if(W33.mode!=='mirror'&&!m.boss&&!RG93.wave){RG93.meter=Math.min(RG93.need,RG93.meter+1);if(RG93.meter>=RG93.need){waveStart93();send93(true)}}
   const mine=W33.mode==='solo'||m.my33>0;if(!mine)return r;
   const now=performance.now();RG93.combo=now-RG93.comboT<4000?RG93.combo+1:1;RG93.comboT=now;if(RG93.combo>RG93.best)RG93.best=RG93.combo;
   try{E92.f.kills=(E92.f.kills|0)+1;if(RG93.combo>(E92.f.best|0))E92.f.best=RG93.combo}catch(e){}
   if([50,100,200,300,500,1000].indexOf(RG93.combo)>=0){try{banner('🔥 คอมโบ '+RG93.combo+'!','XP +'+Math.round((comboMul93()-1)*100)+'% — อย่าให้ขาด!','green');sfx('lvl');if(RG93.combo>=200&&NET.on)netSend({t:'chat',ch:'gen',txt:'🔥 '+P.name+' คอมโบ '+RG93.combo+' ในทุ่งสังหาร!'})}catch(e){}}
   RG93.mk=RG93.mk.filter(t=>now-t<700);RG93.mk.push(now);if(RG93.mk.length===5||RG93.mk.length===10){try{dmgTxt(P.x,P.y-70,'💥 สังหารหมู่ x'+RG93.mk.length+'!','#ff6a2a',true);D.shake=Math.max(D.shake||0,.25)}catch(e){}}
   const add=(k,n,t,c)=>{inv[k]=(inv[k]|0)+n;try{dmgTxt(m.x,m.y-34,t,c)}catch(e){}};
   if(m.boss){add('egg92',1,'🥚 ไข่สัตว์ลึกลับ!','#ffe08a');add('star92',10,'🌟 +10','#ffd86a');try{banner('👑 ล้มราชาอสูรคลั่งแล้ว!','ได้ 🥚 ไข่สัตว์ลึกลับ + 🌟 ดาวนิรันดร์ ×10','green')}catch(e){}}
   else{if(m.gold93){for(let i=0;i<10;i++)addDrop('coin',m.x+(Math.random()-.5)*30,m.y);add('star92',2,'🌟 +2','#ffd86a')}
    else if(Math.random()<(m.elite?.5:.06))add('star92',1,'🌟 +1','#ffd86a');
    if(Math.random()<.003)add('egg92',1,'🥚 ไข่สัตว์ลึกลับ!','#ffe08a')}
   if(RG93.combo%25===0){try{refreshInv();save92()}catch(e){}}}catch(e){console.warn('rage93 kill',e)}return r};window.mobKill=mobKill}
// XP ในทุ่งสังหาร: มอนเยอะ → XP ต่อตัวลดลง แต่คูณคอมโบ × กลุ่ม
{const _g=gainXp;gainXp=function(n){try{if(inRage93()&&typeof n==='number'&&n>0)n=Math.round(n*.4*comboMul93()*partyMul93())}catch(e){}return _g.call(this,n)};window.gainXp=gainXp}
setInterval(()=>{try{if(!inRage93()){RG93.partyN=0;return}let c=0;for(const o of NET.others.values())if(!o.dead&&Math.hypot(o.x-P.x,o.y-P.y)<700)c++;RG93.partyN=Math.min(4,c);
  if(RG93.combo&&performance.now()-RG93.comboT>4000){if(RG93.combo>=20)try{say('คอมโบขาด ('+RG93.combo+')')}catch(e){}RG93.combo=0}}catch(e){}},300);
// ---------- HUD ----------
{const st=document.createElement('style');st.textContent=
 '#rg93{position:absolute;left:50%;top:calc(64px + var(--st,0px));transform:translateX(-50%);z-index:5;pointer-events:none;display:none;text-align:center;font:900 11px system-ui,"Noto Sans Thai",sans-serif;color:#fff;min-width:210px}'+
 '#rg93 .bx{background:rgba(30,8,6,.85);border:1.5px solid #ff5a2a;border-radius:10px;padding:4px 10px}#rg93 .bar{height:8px;border-radius:4px;background:#1a0606;overflow:hidden;margin:3px 0 2px}'+
 '#rg93 .bar i{display:block;height:100%;background:linear-gradient(90deg,#ff8a2a,#ff2a1a)}#rg93.wv .bx{border-color:#ffd84a;animation:rg93p .5s infinite alternate}@keyframes rg93p{from{box-shadow:0 0 4px #ff2a1a}to{box-shadow:0 0 16px #ff2a1a}}'+
 '#cb93{position:absolute;right:14px;top:42%;z-index:5;pointer-events:none;display:none;text-align:right;font:900 34px system-ui,"Noto Sans Thai",sans-serif;color:#ffd86a;text-shadow:0 2px 0 #7a2a06,0 0 12px rgba(255,90,40,.8)}'+
 '#cb93 small{display:block;font-size:12px;color:#fff;text-shadow:0 1px 2px #000}'+
 '#vg93{position:absolute;inset:0;z-index:3;pointer-events:none;display:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(200,20,10,.38) 100%)}';document.head.appendChild(st)}
const hud93=document.createElement('div');hud93.id='rg93';gid('wrap').appendChild(hud93);
const cb93=document.createElement('div');cb93.id='cb93';gid('wrap').appendChild(cb93);
const vg93=document.createElement('div');vg93.id='vg93';gid('wrap').appendChild(vg93);
setInterval(()=>{try{const on=inRage93();hud93.style.display=on?'block':'none';vg93.style.display=on&&RG93.wave?'block':'none';if(!on){cb93.style.display='none';return}
  hud93.className=RG93.wave?'wv':'';const pc=RG93.wave?Math.max(0,RG93.waveT/WAVE93*100):RG93.meter/RG93.need*100;
  hud93.innerHTML='<div class="bx">'+(RG93.wave?'⚠️ คลื่นอสูรคลั่ง · เหลือ '+Math.ceil(RG93.waveT)+' วิ':(D.boss&&!D.boss.dead?'👑 ราชาอสูรคลั่ง!':'🔥 เกจคลั่ง '+Math.floor(pc)+'% (ทุกคนฆ่ารวมกัน)'))+
   '<div class="bar"><i style="width:'+pc+'%"></i></div>'+(RG93.partyN?'👥 ฟาร์มกลุ่ม '+(RG93.partyN+1)+' คน · XP +'+Math.round((partyMul93()-1)*100)+'%':'👥 ชวนเพื่อนมาฟาร์มด้วย XP +20%/คน')+'</div>';
  const c=RG93.combo>=3&&performance.now()-RG93.comboT<4000;cb93.style.display=c?'block':'none';
  if(c){const left=Math.max(0,4-(performance.now()-RG93.comboT)/1000);cb93.innerHTML='🔥 x'+RG93.combo+'<small>คอมโบ · XP +'+Math.round((comboMul93()-1)*100)+'% · '+left.toFixed(1)+' วิ</small>';
   cb93.style.fontSize=(34+Math.min(18,RG93.combo/12))+'px'}}catch(e){}},120);
// ---------- เข้าแมพ ----------
function farmGo93(){if(P.lv<150){say('🔒 ทุ่งสังหาร ต้อง Lv.150');sfx('thud');return}
 if(D&&(D.tower10||D.wb10||D.mk10||D.arena8||D.duel29||D.dg)){say('ออกจากที่นี่ก่อน แล้วค่อยไปทุ่งสังหาร');sfx('thud');return}
 if(!NMAP15.unl.rage){NMAP15.unl.rage=1;nmapSave15()}try{p6close(w92)}catch(e){}
 LoadingScreenManager.cover({icon:'⚔️',title:RZ93.n,tip:'ฝูงอสูรวิ่งเข้าหา · ยืนกดสกิลวงกว้าง · ฆ่าไม่ให้ขาดเพื่อคอมโบ · ชวนเพื่อนมา XP เพิ่ม'},()=>{if(D){try{exitD()}catch(e){}}enterZone(RZI93);RG93.combo=0;
  setTimeout(()=>{try{sysSay('⚔️ ทุ่งสังหาร: ฝูงอสูรจะวิ่งเข้าหาเรื่อย ๆ · ฆ่ารวมกันจนเกจคลั่งเต็ม → คลื่นอสูรคลั่ง → ราชาอสูร · เปิด 🤖 ฟาร์มออโต้ได้')}catch(e){}},900)})}
window.farmGo93=farmGo93;
// แท็บในหน้าต่าง 🌠 ตำนาน (ขึ้นเป็นแท็บแรก + เปิดมาเจอก่อน)
TABS92.unshift(['farm','⚔️ ทุ่งสังหาร']);TAB92.t='farm';
TABX92.farm=()=>{const ok=P.lv>=150,f=E92.f||{};let h='<div class="hl92">แมพฟาร์มมอนเป็นกลุ่ม: อสูรมาเป็นฝูงวิ่งเข้าหา เลือดน้อยตายง่าย · ยืนกดสกิลวงกว้างฟาร์มรัว ๆ · XP ทั้งหมดเข้า 🌠 ดาวตำนาน</div>';
 h+='<div class="bx92"><div class="h92">⚔️ '+RZ93.n+' (Lv.150+)</div>'+
  '<div class="rw92"><span style="font-size:18px">🔥</span><div class="nm"><b>คอมโบ</b> — ฆ่าต่อเนื่องไม่ขาดเกิน 4 วิ · XP +2% ทุก 5 คอมโบ (สูงสุด +60%)</div></div>'+
  '<div class="rw92"><span style="font-size:18px">👥</span><div class="nm"><b>ฟาร์มเป็นกลุ่ม</b> — เพื่อนอยู่ใกล้ XP +20% ต่อคน (สูงสุด +80%) · มอนมาเยอะขึ้นตามจำนวนคน</div></div>'+
  '<div class="rw92"><span style="font-size:18px">⚠️</span><div class="nm"><b>คลื่นอสูรคลั่ง</b> — ทุกคนฆ่ารวมกัน '+RG93.need+' ตัว → 45 วิ มอน 2 เท่า + 💰 ก้อนทองอสูร</div></div>'+
  '<div class="rw92"><span style="font-size:18px">👑</span><div class="nm"><b>ราชาอสูรคลั่ง</b> — โผล่หลังคลื่น · ทุกคนที่ช่วยตีได้ 🥚 ไข่ + 🌟 ดาวนิรันดร์ ×10</div></div>'+
  '<div class="rw92"><span style="font-size:18px">🎁</span><div class="nm"><b>ของดรอป</b> — 🌟 ดาวนิรันดร์ (แลกของที่แท็บหอคอย) · 🥚 ไข่ (หายาก) · เหรียญ</div></div></div>';
 h+='<div class="bx92">สถิติ: ฆ่าไปแล้ว <b>'+fmtN93(f.kills|0)+'</b> ตัว · คอมโบสูงสุด <b>'+(f.best|0)+'</b> · ผ่านคลื่นคลั่ง <b>'+(f.waves|0)+'</b> ครั้ง</div>';
 h+=ok?'<button class="bt92 go92" onclick="farmGo93()">⚔️ ไปทุ่งสังหาร</button>':'<div class="bx92 no92">🔒 ต้อง Lv.150 (ตอนนี้ Lv.'+P.lv+')</div>';return h};
const fmtN93=n=>Math.round(n).toLocaleString('en-US');
}catch(e){console.warn('fix93',e)}
