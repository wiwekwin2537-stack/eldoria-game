// fix92 (v4.80) — เนื้อหาหลังเลเวลตัน Lv.150 (เจ้าของสั่ง 2026-10-14: "ผู้เล่นเล่นจนจบเกมแล้ว lv150 คนน้อยลง ให้คิด content ต่อ")
//  เมนูใหม่ "🌠 ตำนาน" รวม 3 ระบบ (ต่อยอดระบบหลักเดิมทั้งหมด ไม่สร้างของซ้ำ):
//  A) 🌠 ดาวตำนาน: ถึง Lv.150 แล้ว XP ไม่ทิ้ง → สะสมเป็นเลเวลดาวตำนาน (สูงสุด 200) ได้แต้มละ 1 ใส่พลัง 4 แบบ (ผ่าน PTX ตัวหลักของพาสซีฟ)
//     ดาเมจ +0.6%/แต้ม · เลือด +1% · ลดดาเมจที่โดน +0.3% · คริ +0.3% (แต่ละแบบใส่ได้สูงสุด 50 แต้ม) · ล้างแต้มได้ (🪙 50,000)
//  B) ♾️ หอคอยนิรันดร์: ต่อจากหอคอยบอส 12 ชั้นเดิม (ใช้ฉาก/เวลา/สมุนของ tower10) ชั้น 13 ขึ้นไปไม่มีที่สิ้นสุด บอสเก่งขึ้นทุกชั้น
//     ต้อง Lv.150 + ผ่านหอคอยชั้น 12 · ทุกวันจันทร์ (เวลาไทย) เริ่มปีนใหม่จากชั้น 13 · อันดับ "ชั้นสูงสุดสัปดาห์นี้" ทั้งเซิร์ฟ (server: accounts.js rf/rw)
//     รางวัล: เหรียญ หินตีบวก หินพร + ✨ ดาวนิรันดร์ (เงินใหม่) + 🥚 ไข่สัตว์ลึกลับ (ทุก 5 ชั้นได้แน่ ๆ) · ร้านแลกดาวนิรันดร์
//  C) 🥚 ฟักไข่: วางไข่ในแท่นฟัก 3 ช่อง รอ 20 นาที (เวลาจริง) → ได้สัตว์เลี้ยงสุ่ม + ระดับดาว ★1–★5 (สเตตัสทุกอย่าง +2 ต่อดาว)
//     คอลเลกชันสัตว์เลี้ยง: สลับตัวที่พาเดินได้ฟรี · สัตว์ที่ซื้อจากร้านก็เข้าคอลเลกชัน (★0) · ได้ซ้ำดาวต่ำกว่า → แปลงเป็นดาวนิรันดร์
//  บันทึกใน localStorage 'fm_end92' (ขึ้นคลาวด์อัตโนมัติเพราะขึ้นต้น fm_)
try{
const E92=(()=>{let d={};try{d=JSON.parse(localStorage.getItem('fm_end92')||'{}')||{}}catch(e){}
 d.pg=d.pg||{lv:0,xp:0,a:{dmg:0,hp:0,dr:0,crit:0}};d.pg.a=Object.assign({dmg:0,hp:0,dr:0,crit:0},d.pg.a||{});
 d.e=d.e||{wk:0,cur:0,best:0};d.eggs=Array.isArray(d.eggs)?d.eggs:[];d.pets=d.pets||{};d.f=d.f||{kills:0,best:0,waves:0};d.ver=1;return d})();
window.E92=E92;
const save92=()=>{try{localStorage.setItem('fm_end92',JSON.stringify({pg:E92.pg,e:E92.e,eggs:E92.eggs,pets:E92.pets,f:E92.f}))}catch(e){}};
window.save92=save92;
const fmt92=n=>Math.round(n).toLocaleString('en-US');
const wk92=()=>Math.floor(((srvNow()+7*36e5)/864e5+3)/7); // สัปดาห์เริ่มวันจันทร์ 00:00 เวลาไทย (ตรงกับ accounts.js)
const wkFix92=()=>{const w=wk92();if(E92.e.wk!==w){E92.e.wk=w;E92.e.cur=0;save92()}};wkFix92();
const PGMAX92=200,PGCAP92=50;
const PGK92=[['dmg','⚔️','ดาเมจ',.006,'%'],['hp','❤️','เลือดสูงสุด',.01,'%'],['dr','🛡️','ลดดาเมจที่โดน',.003,'%'],['crit','💥','โอกาสคริ',.003,'%']];
const pgNeed92=l=>Math.round(need(150)*(.8+.04*l));
const pgUsed92=()=>PGK92.reduce((s,k)=>s+(E92.pg.a[k[0]]|0),0);
const pgFree92=()=>Math.max(0,E92.pg.lv-pgUsed92());
window.pgFree92=pgFree92;

// ---------- A) ดาวตำนาน ----------
let pgTxtT92=0,pgAcc92=0;
function pgAdd92(n){if(!(n>0))return;const g=E92.pg;if(g.lv>=PGMAX92){g.xp=0;return}g.xp+=n;let up=0;
 while(g.lv<PGMAX92&&g.xp>=pgNeed92(g.lv)){g.xp-=pgNeed92(g.lv);g.lv++;up++}if(g.lv>=PGMAX92)g.xp=0;save92();
 pgAcc92+=n;const t=performance.now();if(t-pgTxtT92>700){pgTxtT92=t;try{dmgTxt(P.x,P.y-46,'+'+fmt92(pgAcc92)+' 🌠','#c8a8ff')}catch(e){}pgAcc92=0}
 if(up){try{sfx('lvl')}catch(e){}try{banner('🌠 ดาวตำนาน Lv.'+g.lv,'ได้แต้มตำนาน +'+up+' — เปิดเมนู 🌠 ตำนาน เพื่อใส่แต้ม','green')}catch(e){}
  try{sysSay('🌠 ดาวตำนานขึ้นเป็น Lv.'+g.lv+' (แต้มว่าง '+pgFree92()+')')}catch(e){}}
 try{lvHud()}catch(e){}}
window.pgAdd92=pgAdd92;
{const _g=gainXp;gainXp=function(n){
  if(typeof MAXLV!=='undefined'&&P.lv>=MAXLV&&typeof n==='number'&&n>0){const m=window.__noXpm64?n:Math.round(n*(window.XPM64||1));pgAdd92(m);return}
  return _g.apply(this,arguments)};window.gainXp=gainXp}
{const _l=lvHud;lvHud=function(){_l.apply(this,arguments);try{if(P.lv>=MAXLV){const g=E92.pg,nd=pgNeed92(g.lv),pc=g.lv>=PGMAX92?100:Math.min(100,g.xp/nd*100);
  const x=gid('xpb');if(x)x.style.width=pc+'%';const t=gid('xpt');if(t)t.textContent='⭐ Lv.'+P.lv+' · 🌠 '+g.lv+'  '+(g.lv>=PGMAX92?'MAX':Math.floor(pc)+'%');
  const b=gid('xphud');if(b)b.textContent='🌠'+g.lv}}catch(e){}};window.lvHud=lvHud}
// พลังดาวตำนาน → ใส่ใน PTX (ตัวหลักของโบนัส dmg/hp/dr/crit) แบบไม่บวกซ้ำ
let pgVer92=1;
{const _p=PTX;PTX=function(){const o=_p.apply(this,arguments);try{if(o&&o.__pg92!==pgVer92){const old=o.__pa92||{};
   for(const [k,,,per] of PGK92){o[k]=(o[k]||0)-(old[k]||0)}const add={};
   for(const [k,,,per] of PGK92){add[k]=(E92.pg.a[k]|0)*per;o[k]=(o[k]||0)+add[k]}o.__pa92=add;o.__pg92=pgVer92}}catch(e){}return o};window.PTX=PTX}
function pgDirty92(){pgVer92++;try{ptDirty()}catch(e){}try{recalcStats();P.hp=Math.min(P.hp,BAL.hp)}catch(e){}save92()}
function pgPut92(k,n){const a=E92.pg.a,cur=a[k]|0,can=Math.min(n,pgFree92(),PGCAP92-cur);if(can<=0){say(cur>=PGCAP92?'แบบนี้ใส่เต็ม '+PGCAP92+' แต้มแล้ว':'ไม่มีแต้มตำนานว่าง — สะสม XP ต่อหลัง Lv.150');sfx('thud');return}
 a[k]=cur+can;sfx('ui');pgDirty92();render92()}
function pgReset92(){if(!pgUsed92()){say('ยังไม่ได้ใส่แต้ม');return}if((inv.coin|0)<50000){say('ต้องใช้ 🪙 50,000');sfx('thud');return}
 inv.coin-=50000;for(const k in E92.pg.a)E92.pg.a[k]=0;refreshInv();pgDirty92();sfx('warp');say('🔄 ล้างแต้มดาวตำนานแล้ว');render92()}
window.pgPut92=pgPut92;window.pgReset92=pgReset92;

// ---------- B) หอคอยนิรันดร์ (ชั้น 13+) ----------
const EF0=12; // ชั้นนิรันดร์ n → ชั้นจริง f=12+n
const endOk92=()=>P.lv>=150&&(TW10.data.max|0)>=EF0;
const endNext92=()=>{wkFix92();return EF0+(E92.e.cur|0)+1};
function enterEnd92(){return Guard.run('enterEnd92',()=>{wkFix92();
  if(!endOk92()){say(P.lv<150?'🔒 หอคอยนิรันดร์ ต้อง Lv.150':'🔒 ต้องผ่านหอคอยบอสชั้น 12 ก่อน');sfx('thud');return}
  if(D&&(D.zone||D.shop)&&!inTower10()){say('เข้าหอคอยได้จากเมืองหรือทุ่งหญ้า');sfx('thud');return}
  const f=endNext92(),n=f-EF0,Zm=buildTower10(f);
  try{p6close(w92)}catch(e){}
  LoadingScreenManager.cover({icon:'♾️',title:'หอคอยนิรันดร์ ชั้น '+f,tip:'บอสแข็งขึ้นทุกชั้น · เวลา 5 นาที · ตายแล้วกลับมาท้าชั้นเดิมได้'},()=>{
   if(D&&D.town){try{exitD()}catch(e){}}
   try{closeZMenu()}catch(e){}ZW=Zm.W;ZH=Zm.H;sfx('warp');setScene('cave');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;
   D={zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret:[ZG.x,ZG.y+40],ban:0,tower10:f,end92:n,t0:performance.now(),sumT:14,won:0};dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,4);
   P.x=Zm.ent.x*T;P.y=(Zm.ent.y-1)*T+16;P.dir='u';P.kx=P.ky=0;MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}
   const B0=TW10.boss(((n-1)%EF0)+1),nm='ร่างนิรันดร์ '+String(B0.n).replace(/\s*\(ชั้น \d+\)/,'')+' (ชั้น '+f+')';
   const b=mkMob(B0.f,nm,B0.c,150+n*2,Zm.arena.x*T,Zm.arena.y*T+16,{boss:1});
   const k=(2+EF0*.35)*Math.pow(1.09,n-1),ka=1.35*Math.pow(1.035,n-1);b.hp=b.max=Math.round(b.hp*k);b.atk=Math.round(b.atk*ka);b.end92=n;b.phase=0;b.sk=3;b.sc*=1.2;
   D.boss=b;D.bossT=1e9;D.mobs.push(b)});
  setTimeout(()=>{try{sysSay('♾️ หอคอยนิรันดร์ชั้น '+f+' — ปราบบอสภายใน 5 นาที!')}catch(e){}},900)})}
window.enterEnd92=enterEnd92;
function endReward92(n){const R=[],add=(k,c,lab)=>{c=Math.round(c);if(c<=0)return;inv[k]=(inv[k]|0)+c;R.push(lab+' ×'+fmt92(c))};
 add('coin',20000+n*3000,'🪙');add('estone',5+n,'💠 หินตีบวก');add('bless',1+Math.floor(n/3),'✨ หินพร');add('star92',2+Math.floor(n/2),'🌟 ดาวนิรันดร์');
 if(n%5===0||Math.random()<.12)add('egg92',1,'🥚 ไข่สัตว์ลึกลับ');
 const x=Math.round(need(150)*.3);pgAdd92(x);R.push('🌠 XP ดาวตำนาน +'+fmt92(x));
 try{refreshInv();saveGame(true)}catch(e){}return R}
{const _mk=mobKill;mobKill=function(m){const r=_mk.apply(this,arguments);
  try{if(m&&m.end92&&D&&D.end92&&!D.won){D.won=1;D.boss=null;D.bossT=1e9;const n=D.end92,f=EF0+n,sec=Math.round(D.el||0);
   for(const q of D.mobs)if(!q.dead&&q!==m)q.dead=true;D.mobs=D.mobs.filter(q=>!q.dead||q===m);
   wkFix92();if(n>(E92.e.cur|0))E92.e.cur=n;if(n>(E92.e.best|0))E92.e.best=n;save92();
   const R=endReward92(n);flash('#c8a8ff',.45);sfx('chest');
   try{sysSay('♾️ พิชิตหอคอยนิรันดร์ชั้น '+f+' ใน '+sec+' วินาที')}catch(e){}
   try{if(NET.on)netSend({t:'chat',ch:'gen',txt:'♾️ พิชิตหอคอยนิรันดร์ชั้น '+f+' ใน '+sec+' วิ!'})}catch(e){}
   setTimeout(()=>{try{talk({name:'วิญญาณผู้เฝ้าหอคอย',c:'#c8a8ff'},'🏆 พิชิตชั้นนิรันดร์ '+f+' แล้ว!\n'+R.join(' · '),
     [{t:'⬆️ ขึ้นชั้น '+(f+1),c:'go',f:()=>enterEnd92()},{t:'🏰 ออกจากหอคอย',f:()=>leaveTower10()},BYE],'♾️ หอคอยนิรันดร์')}catch(e){}},1600)}}catch(e){console.warn('fix92 end',e)}
  return r};window.mobKill=mobKill}
// อันดับทั้งเซิร์ฟ: ส่งชั้นสูงสุดสัปดาห์นี้ไปกับเซฟ (accounts.js เก็บ rf/rw)
{const _c=CLOUD.call;CLOUD.call=function(p,body,to){try{if(p==='/api/save'&&body){wkFix92();body.stat=Object.assign({},body.stat||{},{rift:E92.e.cur?EF0+E92.e.cur:0,rw:wk92()})}}catch(e){}return _c.call(this,p,body,to)}}
const LB92={data:null,t:-1e9,busy:0};
async function lbLoad92(){if(LB92.busy||performance.now()-LB92.t<30000)return;LB92.busy=1;
 try{if(window.CLOUD&&CLOUD.base()){const r=await CLOUD.call('/api/top',{});if(r&&r.ok){LB92.data=r.rf||[];LB92.t=performance.now()}}}catch(e){}LB92.busy=0;if(!w92.hidden&&TAB92.t==='end')render92()}
// ปุ่มในหน้าต่างหอคอยเดิม
{const _ot=openTower10;openTower10=function(){const r=_ot.apply(this,arguments);try{if(DLG.open&&!inTower10())DLG.ch.splice(0,0,{t:'♾️ หอคอยนิรันดร์ (ชั้น 13+ · Lv.150)',c:'go',stay:true,f:()=>open92('end')})}catch(e){}return r};window.openTower10=openTower10}

// ---------- C) ไข่ + คอลเลกชันสัตว์เลี้ยง ----------
const HATCH92=20*60e3,SLOTS92=3,STARW92=[50,28,14,6,2];
const petList92=()=>ANIMS.filter(a=>a.pet);
const petName92=k=>{const a=ANIMS.find(q=>q.k===k);return a?a.n:k};
const star92=k=>(E92.pets[k]|0);
if(HOME&&HOME.pet&&!(HOME.pet in E92.pets))E92.pets[HOME.pet]=0;
{const _ba=buyAnimal;buyAnimal=function(k){const r=_ba.apply(this,arguments);try{const a=ANIMS.find(q=>q.k===k);if(a&&a.pet&&HOME.pet===k&&!(k in E92.pets)){E92.pets[k]=0;save92()}}catch(e){}return r};window.buyAnimal=buyAnimal}
function eggPut92(){if((inv.egg92|0)<1){say('ไม่มี 🥚 ไข่สัตว์ลึกลับ — ได้จากหอคอยนิรันดร์ / ร้านดาวนิรันดร์');sfx('thud');return}
 if(E92.eggs.length>=SLOTS92){say('แท่นฟักเต็มแล้ว ('+SLOTS92+' ช่อง)');sfx('thud');return}
 inv.egg92--;E92.eggs.push({t:srvNow()});refreshInv();save92();saveGame(true);sfx('ui');say('🥚 วางไข่ในแท่นฟักแล้ว — ฟักออกใน 20 นาที');render92()}
function eggRush92(i){const g=E92.eggs[i];if(!g)return;if((inv.star92|0)<5){say('ต้องใช้ 🌟 ดาวนิรันดร์ 5 ดวง');sfx('thud');return}
 inv.star92-=5;g.t-=HATCH92;refreshInv();save92();sfx('gem');render92()}
function eggOpen92(i){const g=E92.eggs[i];if(!g||srvNow()-g.t<HATCH92)return;
 const L=petList92();if(!L.length)return;const a=L[Math.floor(Math.random()*L.length)];let r=Math.random()*100,s=1;for(let j=0;j<STARW92.length;j++){if(r<STARW92[j]){s=j+1;break}r-=STARW92[j]}
 E92.eggs.splice(i,1);const had=a.k in E92.pets,old=star92(a.k);let msg;
 if(!had||s>old){E92.pets[a.k]=s;msg=(had?'⬆️ อัปดาว! ':'🎉 ได้สัตว์ใหม่! ')+a.n+' '+'★'.repeat(s)}
 else{const c=2+s*2;inv.star92=(inv.star92|0)+c;msg='ได้ '+a.n+' ★'+s+' ซ้ำ (มี ★'+old+' แล้ว) → แปลงเป็น 🌟 ดาวนิรันดร์ ×'+c}
 save92();refreshInv();saveGame(true);flash('#ffe08a',.35);sfx('chest');try{banner('🥚 ไข่ฟักแล้ว!',msg,'green')}catch(e){say(msg)}
 if(HOME.pet===a.k)pgDirty92();render92()}
function petUse92(k){if(!(k in E92.pets))return;HOME.pet=k;PET.x=P.x;PET.y=P.y;try{saveHome()}catch(e){}pgDirty92();try{recalcStats()}catch(e){}sfx('ui');say('🐾 พา'+petName92(k)+'เดินด้วยแล้ว');render92()}
window.eggPut92=eggPut92;window.eggRush92=eggRush92;window.eggOpen92=eggOpen92;window.petUse92=petUse92;
// ดาวสัตว์เลี้ยง: สเตตัสทุกอย่าง +2 ต่อดาว (เฉพาะตัวที่พาเดิน)
{const _cb=calcBonus;calcBonus=function(){const b=_cb.apply(this,arguments);try{const s=HOME.pet?star92(HOME.pet):0;if(s>0)for(const k of ['str','vit','agi','int','end'])b[k]=(b[k]|0)+2*s}catch(e){}return b};window.calcBonus=calcBonus}
// วาดประกายดาวรอบสัตว์เลี้ยงที่มีดาว
{const _dp=drawPet;drawPet=function(p,x,y){const r=_dp.apply(this,arguments);try{if(p&&p.k===HOME.pet&&x===PET.x&&y===PET.y){const s=star92(p.k);if(s>0){const t=performance.now()/1000;
   ctx.save();for(let i=0;i<s;i++){const a=t*1.6+i*6.283/s,px=x+Math.cos(a)*13,py=y-12+Math.sin(a)*5;ctx.globalAlpha=.55+.45*Math.sin(t*5+i);ctx.fillStyle=s>=5?'#ff9ad8':s>=3?'#ffd86a':'#fff6c0';
    ctx.beginPath();for(let j=0;j<10;j++){const rr=j%2?1.3:3.2,aa=j*Math.PI/5-Math.PI/2;ctx.lineTo(px+Math.cos(aa)*rr,py+Math.sin(aa)*rr)}ctx.fill()}ctx.restore()}}}catch(e){}return r};window.drawPet=drawPet}

// ---------- ร้านแลกดาวนิรันดร์ ----------
const SHOP92=[['egg92',1,25,'🥚 ไข่สัตว์ลึกลับ'],['bless',1,4,'✨ หินพร'],['estone',5,3,'💠 หินตีบวก ×5'],['phoenix',1,6,'🪶 ขนนกฟีนิกซ์']];
function buy92(i){const s=SHOP92[i];if(!s)return;if((inv.star92|0)<s[2]){say('🌟 ดาวนิรันดร์ไม่พอ (ต้อง '+s[2]+')');sfx('thud');return}
 inv.star92-=s[2];inv[s[0]]=(inv[s[0]]|0)+s[1];refreshInv();saveGame(true);sfx('gem');say('ได้ '+s[3]);render92()}
window.buy92=buy92;

// ---------- ไอเท็มใหม่: ชื่อ/คำอธิบาย/ไอคอน/ที่มา ----------
INVMETA.star92=['ดาวนิรันดร์','เงินพิเศษหลัง Lv.150 · แลกไข่/หินพร/หินตีบวก ที่เมนู 🌠 ตำนาน → หอคอยนิรันดร์'];
INVMETA.egg92=['ไข่สัตว์ลึกลับ','วางที่แท่นฟัก (เมนู 🌠 ตำนาน → ฟักไข่) รอ 20 นาที ได้สัตว์เลี้ยงสุ่ม ★1–★5'];
for(const k of ['star92','egg92'])if(!INVORDER.includes(k))INVORDER.splice(3,0,k);
{const _mi=matIcon;matIcon=function(key){if(key!=='star92'&&key!=='egg92')return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';
  if(key==='star92'){const g=k.createRadialGradient(24,22,2,24,24,22);g.addColorStop(0,'#ffffff');g.addColorStop(.35,'#ffe08a');g.addColorStop(1,'#b06aff');k.fillStyle=g;k.strokeStyle='#4a2a7a';k.lineWidth=2;
   k.beginPath();for(let j=0;j<10;j++){const r=j%2?9:21,a=j*Math.PI/5-Math.PI/2;k.lineTo(24+Math.cos(a)*r,25+Math.sin(a)*r)}k.closePath();k.fill();k.stroke()}
  else{const g=k.createLinearGradient(0,6,0,44);g.addColorStop(0,'#fff8e8');g.addColorStop(1,'#d8b8ff');k.fillStyle=g;k.strokeStyle='#5a3a8a';k.lineWidth=2;
   k.beginPath();k.ellipse(24,26,14,18,0,0,7);k.fill();k.stroke();k.fillStyle='#b06aff';for(const [x,y,r] of [[18,20,3.5],[29,28,4.5],[21,35,3],[30,15,2.5]]){k.beginPath();k.arc(x,y,r,0,7);k.fill()}
   k.fillStyle='rgba(255,255,255,.7)';k.beginPath();k.ellipse(18,14,3,5,-.4,0,7);k.fill()}
  return c};window.matIcon=matIcon}
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)}catch(e){}const kk=String(key).replace(/^mat:/,'');
  if(kk==='star92'||kk==='egg92'){S=S.filter(q=>!/ยังไม่มีข้อมูล/.test(q[1]));S=S.filter(q=>q[0]!=='❔');S.push(['♾️','หอคอยนิรันดร์ (ชั้น 13+) — รางวัลทุกชั้น'+(kk==='egg92'?' · ทุก 5 ชั้นได้ไข่แน่นอน':'')]);
   if(kk==='egg92')S.push(['🌟','แลกที่ร้านดาวนิรันดร์ (25 ดวง)']);else S.push(['🥚','ฟักไข่ได้สัตว์ซ้ำดาวต่ำกว่า → แปลงเป็นดาวนิรันดร์'])}
  return S};window.src7=src7}

// ---------- หน้าต่าง 🌠 ตำนาน ----------
{const st=document.createElement('style');st.textContent=
 '#w92 .tb92{display:flex;gap:6px;margin-bottom:8px}#w92 .tb92 button{flex:1;min-height:44px;border-radius:10px;border:1.5px solid #5a4a7a;background:#2a2140;color:#d8d0e8;font:800 12px system-ui,"Noto Sans Thai",sans-serif}'+
 '#w92 .tb92 button.on{background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06;border-color:#e8c14a}'+
 '#w92 .bx92{background:#1a1426;border:1px solid #4a3a6a;border-radius:11px;padding:9px;margin-bottom:8px;color:#e8e0f8;font:500 12px system-ui,"Noto Sans Thai",sans-serif}'+
 '#w92 .h92{font-weight:900;color:#ffd86a;font-size:13px;margin-bottom:5px}#w92 .hl92{font-size:11px;color:#6ab0e8;margin-bottom:8px}'+
 '#w92 .br92{height:12px;border-radius:6px;background:#0c0a12;border:1px solid #4a3a6a;overflow:hidden;margin:5px 0}#w92 .br92 i{display:block;height:100%;background:linear-gradient(90deg,#8a6aff,#ff9ad8)}'+
 '#w92 .rw92{display:flex;align-items:center;gap:7px;padding:5px 0;border-top:1px solid #2e2440}#w92 .rw92:first-of-type{border-top:0}#w92 .rw92 .nm{flex:1}'+
 '#w92 .bt92{min-width:48px;min-height:40px;border-radius:9px;border:0;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06;font:900 12px system-ui,"Noto Sans Thai",sans-serif;padding:0 9px}'+
 '#w92 .bt92[disabled]{filter:grayscale(1);opacity:.45}#w92 .bt92.g{background:#3a2e52;color:#e8e0f8;border:1px solid #5a4a7a}'+
 '#w92 .go92{width:100%;min-height:48px;font-size:14px}#w92 .ok92{color:#7ed957}#w92 .no92{color:#e84b4b}'+
 '#w92 .pg92{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px}#w92 .pc92{background:#2a2140;border:1.5px solid #4a3a6a;border-radius:10px;padding:4px;text-align:center;font-size:11px}'+
 '#w92 .pc92.on{border-color:#7ed957}#w92 .pc92.lk{opacity:.35}#w92 .pc92 canvas{width:100%;height:auto;border-radius:7px;display:block}#w92 .pc92 .st{color:#ffd86a;letter-spacing:-1px;min-height:14px}'+
 '#w92 .eg92{display:flex;gap:6px}#w92 .eg92>div{flex:1;background:#2a2140;border:1.5px dashed #5a4a7a;border-radius:10px;min-height:96px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:11px;text-align:center;padding:4px}'+
 '#w92 .eg92 img{width:40px;height:40px}#w92 .lb92 td{padding:3px 4px;border-top:1px solid #2e2440}#w92 .lb92{width:100%;border-collapse:collapse;font-size:12px}';
 document.head.appendChild(st)}
const w92=mk6('w92');window.w92=w92;const TAB92={t:'pg'};window.TAB92=TAB92;
const TABS92=[['pg','🌠 ดาวตำนาน'],['end','♾️ หอคอย'],['egg','🥚 ฟักไข่']];window.TABS92=TABS92;window.TABX92={}; // แพตช์ถัดไปเพิ่มแท็บได้: TABS92.unshift([id,ชื่อ]) + TABX92[id]=()=>html
function open92(t){if(t)TAB92.t=t;p6open(w92);render92();if(TAB92.t==='end')lbLoad92()}
window.open92=open92;
const eggIcon92=()=>{try{return iconURL('mat:egg92')}catch(e){return ''}};
function render92(){if(w92.hidden)return;wkFix92();const t=TAB92.t;
 let h='<div class="w" style="width:min(480px,96%);height:auto;max-height:92%"><div class="hd"><b>🌠 ตำนาน — เนื้อหาหลัง Lv.150</b><button onclick="p6close(w92)">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto;padding:9px">';
 h+='<div class="tb92">'+TABS92.map(([k,n])=>'<button class="'+(t===k?'on':'')+'" onclick="TAB92_(\''+k+'\')">'+n+(k==='pg'&&pgFree92()?' ('+pgFree92()+')':'')+(k==='egg'&&E92.eggs.some(g=>srvNow()-g.t>=HATCH92)?' ❗':'')+'</button>').join('')+'</div>';
 if(TABX92[t]){try{h+=TABX92[t]()}catch(e){console.warn('tab92',e)}}
 else if(t==='pg'){const g=E92.pg,nd=pgNeed92(g.lv),pc=g.lv>=PGMAX92?100:Math.min(100,g.xp/nd*100);
  h+='<div class="hl92">ถึง Lv.'+MAXLV+' (เลเวลสูงสุด) แล้ว XP จะสะสมเป็น "ดาวตำนาน" แทน · ขึ้นดาว 1 ครั้ง = แต้ม 1 แต้ม · แตะ +1 / +5 เพื่อใส่พลัง</div>';
  h+='<div class="bx92"><div class="h92">🌠 ดาวตำนาน Lv.'+g.lv+' / '+PGMAX92+'</div>'+(P.lv<MAXLV?'<div class="no92">🔒 ปลดล็อกเมื่อ Lv.'+MAXLV+' (ตอนนี้ Lv.'+P.lv+')</div>':
   '<div class="br92"><i style="width:'+pc+'%"></i></div><div>'+(g.lv>=PGMAX92?'เต็มแล้ว':'XP '+fmt92(g.xp)+' / '+fmt92(nd)+' ('+Math.floor(pc)+'%)')+'</div>')+
   '<div style="margin-top:4px">แต้มว่าง: <b class="'+(pgFree92()?'ok92':'')+'">'+pgFree92()+'</b> · ใช้ไป '+pgUsed92()+'</div></div>';
  h+='<div class="bx92">';for(const [k,ic,n,per] of PGK92){const v=g.a[k]|0,fr=pgFree92()>0&&v<PGCAP92;
   h+='<div class="rw92"><span style="font-size:18px">'+ic+'</span><div class="nm"><b>'+n+'</b> +'+(Math.round(v*per*1000)/10)+'%<br><small style="opacity:.7">'+v+'/'+PGCAP92+' แต้ม · แต้มละ +'+(per*100)+'%</small></div>'+
    '<button class="bt92" '+(fr?'':'disabled')+' onclick="pgPut92(\''+k+'\',1)">+1</button><button class="bt92" '+(fr?'':'disabled')+' onclick="pgPut92(\''+k+'\',5)">+5</button></div>'}
  h+='</div><button class="bt92 g go92" onclick="pgReset92()">🔄 ล้างแต้มทั้งหมด (🪙 50,000)</button>'}
 else if(t==='end'){const ok=endOk92(),f=endNext92();
  const ms=((wk92()+1)*7-3)*864e5-7*36e5-srvNow(),dd=Math.floor(ms/864e5),hh=Math.floor(ms%864e5/36e5);
  h+='<div class="hl92">ต่อจากหอคอยบอส 12 ชั้น · ชั้น 13 ขึ้นไปไม่มีที่สิ้นสุด บอสเก่งขึ้นทุกชั้น · เวลา 5 นาที/ชั้น · ทุกวันจันทร์เริ่มปีนใหม่ แข่งอันดับทั้งเซิร์ฟ</div>';
  h+='<div class="bx92"><div class="h92">♾️ สัปดาห์นี้ถึงชั้น '+(E92.e.cur?EF0+E92.e.cur:'-')+'</div><div>สถิติสูงสุดตลอดกาล: ชั้น '+(E92.e.best?EF0+E92.e.best:'-')+' · รีเซ็ตใน '+dd+' วัน '+hh+' ชม.</div>'+
   '<div style="margin-top:3px">🌟 ดาวนิรันดร์ที่มี: <b>'+fmt92(inv.star92|0)+'</b> · 🥚 ไข่: <b>'+(inv.egg92|0)+'</b></div></div>';
  h+=ok?'<button class="bt92 go92" onclick="enterEnd92()">⚔️ ท้าชั้น '+f+' (บอส Lv.'+(150+(f-EF0)*2)+')</button>':
   '<div class="bx92 no92">🔒 ต้อง Lv.150 '+(P.lv>=150?'✅':'(ตอนนี้ '+P.lv+')')+' และผ่านหอคอยบอสชั้น 12 '+((TW10.data.max|0)>=12?'✅':'(ตอนนี้ '+(TW10.data.max|0)+'/12)')+'</div>';
  h+='<div class="bx92" style="margin-top:8px"><div class="h92">🏆 อันดับสัปดาห์นี้ (ชั้นสูงสุด)</div>';
  const L=LB92.data;if(!L)h+='<div style="opacity:.7">กำลังโหลด… (ต้องล็อกอินออนไลน์)</div>';else if(!L.length)h+='<div style="opacity:.7">ยังไม่มีใครปีนสัปดาห์นี้ — เป็นคนแรกเลย!</div>';
  else h+='<table class="lb92">'+L.slice(0,10).map((x,i)=>'<tr><td>'+(i<3?['🥇','🥈','🥉'][i]:(i+1))+'</td><td>'+esc92(x.n)+'</td><td style="text-align:right">ชั้น <b>'+x.v+'</b></td><td style="opacity:.6;text-align:right">Lv.'+x.lv+'</td></tr>').join('')+'</table>';
  h+='</div><div class="bx92"><div class="h92">🌟 ร้านแลกดาวนิรันดร์</div>';
  SHOP92.forEach((s,i)=>{h+='<div class="rw92"><img src="'+iconURL('mat:'+s[0])+'" style="width:30px;height:30px" onclick="info90&&info90(\'mat\',\''+s[0]+'\')"><div class="nm">'+s[3]+'</div><button class="bt92" '+((inv.star92|0)>=s[2]?'':'disabled')+' onclick="buy92('+i+')">🌟 '+s[2]+'</button></div>'});
  h+='</div>'}
 else{h+='<div class="hl92">วางไข่ในแท่นฟัก รอ 20 นาที ได้สัตว์เลี้ยงสุ่ม ★1–★5 · ทุกดาว = สเตตัสทุกอย่าง +2 (ตัวที่พาเดิน) · แตะการ์ดเพื่อสลับตัวที่พาเดิน</div>';
  h+='<div class="bx92"><div class="h92">🥚 แท่นฟักไข่ ('+E92.eggs.length+'/'+SLOTS92+') · มีไข่ '+(inv.egg92|0)+' ฟอง</div><div class="eg92">';
  for(let i=0;i<SLOTS92;i++){const g=E92.eggs[i];if(!g){h+='<div><span style="opacity:.6">ช่องว่าง</span>'+((inv.egg92|0)?'<button class="bt92" onclick="eggPut92()">วางไข่</button>':'')+'</div>';continue}
   const rem=HATCH92-(srvNow()-g.t);h+='<div><img src="'+eggIcon92()+'">'+(rem<=0?'<button class="bt92" onclick="eggOpen92('+i+')">🐣 ฟักเลย!</button>':
    '<span>⏳ '+Math.floor(rem/60000)+':'+String(Math.floor(rem%60000/1000)).padStart(2,'0')+'</span><button class="bt92 g" onclick="eggRush92('+i+')">เร่ง 🌟5</button>')+'</div>'}
  h+='</div></div><div class="bx92"><div class="h92">🐾 คอลเลกชันสัตว์เลี้ยง ('+Object.keys(E92.pets).length+'/'+petList92().length+')</div><div class="pg92">';
  for(const a of petList92()){const own=a.k in E92.pets,s=star92(a.k);h+='<div class="pc92 '+(HOME.pet===a.k?'on':own?'':'lk')+'" data-pk="'+a.k+'" '+(own?'onclick="petUse92(\''+a.k+'\')"':'')+'><span class="cv"></span><div><b>'+a.n+'</b></div><div class="st">'+(own?(s?'★'.repeat(s):'☆ ร้านค้า'):'🔒')+'</div>'+(HOME.pet===a.k?'<div class="ok92">พาเดินอยู่</div>':'')+'</div>'}
  h+='</div></div>'}
 w92.innerHTML=h+'</div></div>';
 if(t==='egg')for(const el of w92.querySelectorAll('[data-pk]')){try{const c=thumbCv('a',el.getAttribute('data-pk'));if(c&&c.nodeType)el.querySelector('.cv').replaceWith(c)}catch(e){}}}
window.render92=render92;window.TAB92_=k=>{TAB92.t=k;render92();if(k==='end')lbLoad92()};
const esc92=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
setInterval(()=>{try{if(!w92.hidden&&TAB92.t==='egg')render92()}catch(e){}},1000);
// เมนูหลัก
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['🌠','ตำนาน',()=>open92()]);pmRender7()}catch(e){}
// แจ้งเตือนครั้งแรกเมื่อถึง Lv.150
setTimeout(()=>{try{if(P.lv>=150&&!localStorage.getItem('fm_end92_hi')){localStorage.setItem('fm_end92_hi','1');
  sysSay('🌠 ใหม่! เนื้อหาหลัง Lv.150: ดาวตำนาน · หอคอยนิรันดร์ (แข่งอันดับทุกสัปดาห์) · ฟักไข่สัตว์เลี้ยง — เปิดที่เมนู 🌠 ตำนาน')}}catch(e){}},6000);
try{lvHud()}catch(e){}
}catch(e){console.warn('fix92',e)}
