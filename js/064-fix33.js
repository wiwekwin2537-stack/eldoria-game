// fix33.js (v4.38) — โลกร่วมกันจริง: ผู้เล่นในเหมือง/ดันเจี้ยนเดียวกันเห็นแผนที่เดียวกัน มอนตัวเดียวกัน ตีบอสด้วยกันได้
//  · แผนที่เหมืองสุ่มแบบตายตัว (ทุกคนได้แผนที่เดียวกัน) · ชื่อฉากแยกตามเหมือง/รอบดันเจี้ยน/บ้านใครบ้านมัน
//  · "โฮสต์" (คนที่อยู่ในฉากนานสุด — เซิร์ฟเวอร์เลือกให้) เป็นคนคุมมอน · คนอื่นเห็นมอนชุดเดียวกัน ตีแล้วดาเมจไปถึงโฮสต์
//  · มอนเลือกไล่คนที่ใกล้สุด (ไม่ใช่แค่โฮสต์) · ใครช่วยตีได้รางวัลของตัวเองตอนมอนตาย
// =====================================================================
const W33={host:0,mode:'solo',uidc:0,sentT:0,allT:0,reqT:0,inSync:false,lastSc:'',swap:null,newZ:[]};
// ---------- ชื่อฉาก ----------
{const _ns=netScene;netScene=function(){try{if(D&&D.home)return 'home:'+String(FM_ACCT||NET.id||'x').toLowerCase();
  if(D&&D.dg&&!D.tower10)return 'dg:'+D.dg+':'+(D.dgR33!=null?D.dgR33:(D.dgR33=(window.DGROUND8?DGROUND8():0)));
  if(D&&D.zone&&!D.tower10&&!D.wb10&&!D.mk10&&!D.arena8&&!D.duel29&&D.zone.zi!=null)return 'z:'+D.zone.zi}catch(e){}return _ns()}}
const syncSc33=()=>{const sc=netScene();return /^(z|dg):/.test(sc)};
// ---------- แผนที่เหมืองแบบตายตัว (ทุกคนได้เหมือนกัน) ----------
{const _gz=genZone;genZone=function(zi){const Zd=ZONES[zi];if(ZCACHE[zi]||!Zd||Zd.dg)return _gz(zi);
  const R=srand(90001+zi*7919),mr=Math.random;Math.random=R;try{return _gz(zi)}finally{Math.random=mr}}}
for(const k in ZCACHE)if(+k<200)delete ZCACHE[k];
// ---------- โหมด: solo / host / mirror ----------
const others33=()=>{const L=[];for(const o of NET.others.values())L.push(o);return L};
const mobByUid33=uid=>{if(!D||!D.mobs)return null;for(const m of D.mobs)if(m.uid===uid)return m;return null};
function ser33(m){const o={};for(const k in m){const v=m[k];if(typeof v==='function'||k==='tg'||k==='dv'||k==='tgt33'||k==='my33')continue;if(v&&typeof v==='object'){if(Array.isArray(v)){if(v.every(x=>typeof x!=='object'))o[k]=v}else if(k==='F'){const f={};for(const q in v)if(typeof v[q]!=='object'&&typeof v[q]!=='function')f[q]=v[q];o.F=f}continue}o[k]=typeof v==='number'?Math.round(v*100)/100:v}return o}
function setMode33(m){if(m===W33.mode)return;const prev=W33.mode;W33.mode=m;
 if(m==='mirror'){ // ทิ้งมอนของเราเอง รอรับชุดเดียวกับโฮสต์
  if(D&&D.mobs){D.mobs.length=0;D.boss=null}ZPROJ.length=0;W33.reqT=0;reqFull33()}
 else if(m==='host'&&prev==='mirror'&&D&&D.mobs){ // รับช่วงคุมมอนต่อจากโฮสต์เดิม
  for(const m2 of D.mobs){m2.tx=m2.ty=undefined;if(!m2.F&&FAM[m2.f])m2.F=Object.assign({},FAM[m2.f])}
  D.boss=D.mobs.find(x=>x.boss&&!x.dead)||null;if(!D.boss&&!(D.bossT>0))D.bossT=60;try{sysSay('🌐 คุณเป็นผู้คุมมอนในพื้นที่นี้แล้ว')}catch(e){}}}
function reqFull33(){const now=performance.now();if(now-W33.reqT<2500||!W33.host)return;W33.reqT=now;netSend({t:'sx',k:'mreq',to:W33.host})}
// ---------- ข้อความ ----------
{const _nm=netMsg;netMsg=function(d){
  if(d&&d.t==='snap'){try{W33.host=d.h|0;const sc=netScene();if(sc!==W33.lastSc){W33.lastSc=sc;W33.mode='solo'}
    if(!NET.on||!syncSc33()||!W33.host||!D||!D.zone)setMode33('solo');
    else if(W33.host===NET.id||!(d.ps&&d.ps.length))setMode33('host');else setMode33('mirror')}catch(e){}}
  if(d&&d.t==='sx'){try{onSx33(d)}catch(e){console.warn('sx',e)}return}
  return _nm(d)}}
function onSx33(d){if(!D||!D.zone||d.sc!==netScene())return;const k=d.k;
 if(k==='mreq'&&W33.mode==='host'){sendFull33(d.from);return}
 if(k==='md'&&W33.mode==='host'){const m=mobByUid33(d.uid);if(!m||m.dead)return;const dmg=Math.max(0,Math.min(5e7,+d.dmg||0));m.hp-=dmg;if(dmg>0)noteBossFight(m);m.hurt=.2;m.aggro=1;m.tgt33=d.from;if(m.st==='idle')m.st='chase';
   try{dmgTxt(m.x+(Math.random()-.5)*10,m.y-(m.F?26*m.sc:24),(d.cr?'💥':'')+Math.round(dmg),d.cr?'#ffd84a':'#cfe8ff',!!d.cr)}catch(e){}
   if(d.stun>0&&m.F&&!m.boss){m.st='strike';m.stt=Math.min(2,d.stun)}
   if(m.hp<=0)mobKill(m);return}
 if(W33.mode!=='mirror'||d.from!==W33.host)return; // ข้อมูลมอนรับจากโฮสต์เท่านั้น
 if(k==='mn'||k==='mf'){for(const o of d.list||[]){if(!o||!o.uid)continue;let m=mobByUid33(o.uid);if(m){if(o.hp<m.hp)noteBossFight(m);Object.assign(m,{hp:o.hp,max:o.max});continue}
   m=Object.assign({},o,{tx:o.x,ty:o.y});if(!m.F||!m.F.sz&&FAM[m.f])m.F=Object.assign({},FAM[m.f]||{},m.F||{});D.mobs.push(m);if(m.boss)D.boss=m}return}
 if(k==='ms'){for(const r of d.v||[]){const m=mobByUid33(r[0]);if(!m){reqFull33();continue}
   m.tx=r[1];m.ty=r[2];if(Math.hypot(m.x-r[1],m.y-r[2])>220){m.x=r[1];m.y=r[2]}if(!m.pend33){if(r[3]<m.hp)noteBossFight(m);m.hp=Math.min(m.max,r[3])}m.st=r[4]||m.st;m.fx=r[5]||m.fx;m.mv33=!!r[6];m.aggro=r[7]?1:0;m.tg=r[8]?{x:r[8][0],y:r[8][1],r:r[8][2]}:null;m.stt=r[9]||0;if(r[10])m.dv=r[10];else if(!m.dv)m.dv=[1,0];if(m.pend33&&performance.now()-m.pend33>3000)m.pend33=0}return}
 if(k==='mall'){const S=new Set(d.v||[]);for(const m of D.mobs)if(m.uid&&!S.has(m.uid)&&!m.pend33){m.dead=true;if(D.boss===m)D.boss=null}for(const u of S)if(!mobByUid33(u)){reqFull33();break}return}
 if(k==='mk'){const m=mobByUid33(d.uid);if(!m||m.dead)return;m.ok33=1;m.pend33=0;if(m.my33>0){m.hp=0;mobKill(m)}else{m.dead=true;if(D.boss===m)D.boss=null;partyXp33(m)}return}
 if(k==='zp'){for(const p of d.v||[])ZPROJ.push({x:p[0],y:p[1],vx:p[2],vy:p[3],l:p[4],r:p[5],c:p[6]||'#ff6a2a',dmg:0,vis33:1});return}}
// ข้อความตรงถึงเรา (มอนตีเรา) — ไม่ต้องอยู่ฉากเดียวกันกับ snap ล่าสุดก็ได้ แต่ต้องอยู่ฉากเดียวกันจริง
{const _o=onSx33;onSx33=function(d){if(d.k==='mh'){if(!D||!D.zone||d.sc!==netScene()||P.dead)return;zHurt({x:+d.x||P.x,y:+d.y||P.y,nm:d.nm,boss:!!d.boss},Math.max(1,Math.min(1e7,+d.dmg||1)),+d.kbm||1,d.msg||'โดนโจมตี');return}return _o(d)}}
function sendFull33(to){if(!D||!D.mobs)return;const L=D.mobs.filter(m=>!m.dead&&m.uid).map(ser33);for(let i=0;i<L.length;i+=20)netSend({t:'sx',k:'mf',to,list:L.slice(i,i+20)})}
// ---------- โฮสต์: แจก uid · ส่งตำแหน่งมอน ----------
function hostTick33(){if(!D||!D.mobs)return;const now=performance.now(),many=NET.others.size>0;const nw=[];
 for(const m of D.mobs)if(!m.uid&&!m.dead){m.uid=NET.id*1e6+(++W33.uidc);if(many)nw.push(ser33(m))}
 if(!many||!NET.on)return;
 for(let i=0;i<nw.length;i+=20)netSend({t:'sx',k:'mn',list:nw.slice(i,i+20)});
 if(W33.newZ.length){netSend({t:'sx',k:'zp',v:W33.newZ.splice(0,40)});W33.newZ.length=0}
 if(now-W33.sentT>=120){W33.sentT=now;const v=[];for(const m of D.mobs){if(m.dead||!m.uid)continue;v.push([m.uid,Math.round(m.x),Math.round(m.y),Math.round(m.hp),m.st,m.fx,m.mv?1:0,m.aggro?1:0,m.tg&&m.tg.r?[Math.round(m.tg.x),Math.round(m.tg.y),m.tg.r]:0,Math.round((m.stt||0)*100)/100,m.dv?[Math.round(m.dv[0]*100)/100,Math.round(m.dv[1]*100)/100]:0])}
  for(let i=0;i<v.length;i+=60)netSend({t:'sx',k:'ms',v:v.slice(i,i+60)})}
 if(now-W33.allT>=2000){W33.allT=now;netSend({t:'sx',k:'mall',v:D.mobs.filter(m=>!m.dead&&m.uid).map(m=>m.uid)})}}
// ---------- มอนเลือกเป้าหมาย: ผู้เล่นที่ใกล้สุด (โฮสต์จำลองการโจมตีใส่ผู้เล่นคนอื่น แล้วส่งดาเมจไปให้) ----------
function pickTarget33(m){let best=null,bd=(P.dead||P.hp<=0)?1e9:Math.hypot(P.x-m.x,P.y-m.y);
 if(m.tgt33&&m.tgt33!==NET.id){const o=NET.others.get(m.tgt33);if(o&&!o.dead){const d=Math.hypot(o.x-m.x,o.y-m.y);if(d<520&&d<bd*1.4)return o}else m.tgt33=0}
 for(const o of NET.others.values()){if(o.dead)continue;const d=Math.hypot(o.x-m.x,o.y-m.y);if(d<bd){bd=d;best=o}}return best}
{const _um=updMob;updMob=function(m,dt){
  if(W33.mode==='mirror'&&m.uid){ // คนดู: ไม่คิด AI เอง ขยับตามโฮสต์อย่างนุ่ม
   if(m.tx!=null){const k=Math.min(1,dt*10);m.x+=(m.tx-m.x)*k;m.y+=(m.ty-m.y)*k}m.t+=dt;if(m.hurt>0)m.hurt-=dt;if(m.flash>0)m.flash-=dt;m.mv=!!m.mv33;if(m.kx||m.ky){m.kx=m.ky=0}return}
  if(W33.mode!=='host'||!NET.others.size)return _um(m,dt);
  const o=pickTarget33(m);if(!o)return _um(m,dt);
  const sv={x:P.x,y:P.y,iframe:P.iframe,hp:P.hp,dead:P.dead,stun:P.stun,kx:P.kx,ky:P.ky,recall:P.recall},z0=ZPROJ.length;
  P.x=o.x;P.y=o.y;P.iframe=(o.ifr33||0)>performance.now()?1:0;P.dead=false;if(P.hp<=0)P.hp=1;W33.swap=o;
  try{return _um(m,dt)}finally{W33.swap=null;Object.assign(P,sv);for(let i=z0;i<ZPROJ.length;i++)ZPROJ[i].rid33=o.id}}}
{const _zh=zHurt;zHurt=function(src,dmg,kbm,msg){const o=W33.swap;if(o){if((o.ifr33||0)>performance.now())return;o.ifr33=performance.now()+(BAL.iframe||.6)*1000;
  netSend({t:'sx',k:'mh',to:o.id,dmg:Math.round(dmg),kbm:kbm||1,msg:msg||'',x:Math.round(src&&src.x||0),y:Math.round(src&&src.y||0),nm:src&&src.nm||'',boss:!!(src&&src.boss)});return}
  return _zh(src,dmg,kbm,msg)}}
// ---------- ตีมอน: บันทึกดาเมจของเรา · คนดูส่งดาเมจไปให้โฮสต์ ----------
{const _h=hurtE;hurtE=function(e,mult,o){if(!e||e.pvp7||!e.F)return _h(e,mult,o);const hp0=e.hp;const r=_h(e,mult,o);const dmg=typeof r==='number'&&r>0?r:Math.max(0,hp0-e.hp);
  if(dmg>0&&e.uid){e.my33=(e.my33||0)+dmg;if(W33.mode==='mirror')netSend({t:'sx',k:'md',to:W33.host,uid:e.uid,dmg:Math.round(dmg),cr:r>0&&dmg>0&&o&&o.crit?1:0,stun:o&&o.stun||0})}return r}}
{const _mk=mobKill;mobKill=function(m){if(!m||!m.uid||W33.mode==='solo')return _mk(m);
  if(W33.mode==='mirror'){if(!m.ok33){m.hp=1;m.dead=false;m.pend33=m.pend33||performance.now();return}return _mk(m)}
  // โฮสต์: แจ้งทุกคน · ได้รางวัลเฉพาะถ้าเราช่วยตี
  if(NET.others.size)netSend({t:'sx',k:'mk',uid:m.uid});
  if(m.my33>0||!NET.others.size)return _mk(m);
  m.dead=true;if(m.boss&&D){D.boss=null;D.bossT=180}partyXp33(m)}}
// รางวัล XP ให้สมาชิกปาร์ตี้ที่อยู่ใกล้ แม้ไม่ได้ตี (ครึ่งหนึ่ง)
function partyXp33(m){try{if(!window.PTY35||!PTY35.mem||PTY35.mem.length<2)return;if(Math.hypot(P.x-m.x,P.y-m.y)>700||P.dead)return;
  const ids=new Set(PTY35.mem.map(x=>x.id));let near=false;for(const o of NET.others.values())if(ids.has(o.id)){near=true;break}if(!near)return;
  const xp=Math.round(mobXp(m.L)*(m.elite?3:1)*(m.boss?15:1)*.5);if(xp>0){gainXp(xp);dmgTxt(P.x,P.y-60,'👥 +'+xp+' XP','#9dffb0')}}catch(e){}}
window.partyXp33=partyXp33;
// ---------- อัปเดตโซน (แทนของเดิม): โฮสต์คุมทุกอย่าง · คนดูไม่เกิดมอนเอง ----------
{const _uz=updZone;updZone=function(dt){if(!D||!D.zone)return;
  if(W33.mode==='solo')return _uz(dt);
  const Zm=D.zone,host=W33.mode==='host';
  for(let i=D.mobs.length-1;i>=0;i--){const m=D.mobs[i];if(m.dead){D.mobs.splice(i,1);continue}updMob(m,dt);if(!D||!D.zone)return;if(m.dead)D.mobs.splice(i,1)}
  if(host){const normal=D.mobs.filter(m=>!m.boss).length;if(normal<(D.dg?16:Math.round(16*ZW*ZH/1564))&&(D.spT-=dt)<=0){spawnMob(true);D.spT=5}
   if(!D.boss&&D.bossT>0&&(D.bossT-=dt)<=0)spawnBoss()}
  for(let i=ZPROJ.length-1;i>=0;i--){const p=ZPROJ[i];if(host&&!p.sid33){p.sid33=1;if(NET.others.size)W33.newZ.push([Math.round(p.x),Math.round(p.y),Math.round(p.vx),Math.round(p.vy),Math.round(p.l*100)/100,p.r,p.c])}
   p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
   if(p.l<=0||zHit(p.x,p.y+10)){ZPROJ.splice(i,1);continue}
   if(p.vis33)continue;
   if(Math.hypot(P.x-p.x,(P.y-14)-p.y)<p.r+8&&P.iframe<=0){zHurt(p,p.dmg,1,'โดนพลังเวท');ZPROJ.splice(i,1);if(!D||!D.zone)return;continue}
   if(host){let hit=false;for(const o of NET.others.values()){if(o.dead||(o.ifr33||0)>performance.now())continue;if(Math.hypot(o.x-p.x,(o.y-14)-p.y)<p.r+8){W33.swap=o;try{zHurt(p,p.dmg,1,'โดนพลังเวท')}finally{W33.swap=null}hit=true;break}}if(hit){ZPROJ.splice(i,1);continue}}}
  for(const o of Zm.ores){if(o.shake>0)o.shake-=dt;if(!o.alive&&!(window.FW&&FW.act())){o.regen-=dt;if(o.regen<=0&&Math.hypot(P.x-o.x,P.y-o.y)>60){o.alive=true;o.hp=o.max}}}
  if(D.shake>0)D.shake-=dt;if(D.ban>0)D.ban-=dt;
  if(host)try{hostTick33()}catch(e){}}}
// คนดู: ไม่เกิดมอน/บอสเอง (รอจากโฮสต์)
{const _sm=spawnMob;spawnMob=function(f){if(W33.mode==='mirror')return;return _sm(f)}}
{const _sb=spawnBoss;spawnBoss=function(){if(W33.mode==='mirror')return;return _sb()}}
{const _dp=dgPacks;dgPacks=function(f){const r=_dp(f);if(W33.mode==='mirror'&&D&&D.mobs){D.mobs.length=0;D.boss=null}return r}}
// ออก/เปลี่ยนฉาก → กลับเป็นโหมดเดี่ยวจนกว่าเซิร์ฟเวอร์บอกโฮสต์ใหม่
setInterval(()=>{try{const sc=netScene();if(sc!==W33.lastSc){W33.lastSc=sc;W33.mode='solo'}if(!NET.on&&W33.mode!=='solo')W33.mode='solo'}catch(e){}},250);
// เล็งอัตโนมัติ: ถ้ามีมอนในระยะ เล็งมอนก่อนผู้เล่น PvP (กันลูกธนูไปโดนเพื่อน)
{const _en=enemies;enemies=function(){const L=_en();if(window.AIM33&&L.some(e=>!e.pvp7))return L.filter(e=>!e.pvp7);return L}}
{const _ad=aimDir;aimDir=function(r){window.AIM33=1;try{return _ad(r)}finally{window.AIM33=0}}}
window.W33=W33;
// ---------- กันซ็อกเก็ตซ้อน (ซ็อกเก็ตเก่าที่ปิดไปแล้วมาลบซ็อกเก็ตใหม่ → ต่อซ้ำ → เห็นตัวเองซ้อน/ผู้เล่นวาร์ป) ----------
{const _nc=netConnect;netConnect=function(url){const r=_nc(url);const ws=NET.ws;if(ws&&!ws.g33){ws.g33=1;
   const om=ws.onmessage,oc=ws.onclose,oo=ws.onopen;
   ws.onmessage=e=>{if(NET.ws!==ws){try{ws.close()}catch(_){}return}return om&&om(e)};
   ws.onopen=e=>{if(NET.ws!==ws){try{ws.close()}catch(_){}return}return oo&&oo(e)};
   ws.onclose=e=>{if(NET.ws!==ws)return;return oc&&oc(e)}}return r}}

// =====================================================================
