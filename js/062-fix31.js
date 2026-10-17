// fix31.js (v4.36) — มอนในเหมือง/โซนไม่ดรอปแร่-ไม้-แท่งแร่อีกต่อไป (ดรอปของเฉพาะตัว เช่น โกเลม → แกนหินเวท)
//                  · เศรษฐกิจตึงขึ้น (เหรียญหายากขึ้น) · เกมยากขึ้น (มอนอึด/แรงขึ้น · XP ช้าลง)
// =====================================================================
// ---------- 1) ของดรอปจากมอน ----------
// วัตถุดิบจากการขุด/ตัดไม้ — ต้องหาเองจากเหมือง/ต้นไม้ ไม่ดรอปจากมอนแล้ว
const NOMOB31=new Set(['stone','iron','copper','silver','gold','gem','ore','ingSt','ingot','ingCu','ingAg','ingAu','ingDm','wood','woodE','woodF','woodS','woodH','woodG']);
let MK31=0;
{const _ad=addDrop;addDrop=function(type,x,y){if(MK31>0&&NOMOB31.has(type))return;return _ad(type,x,y)};window.addDrop=addDrop}
// เหรียญจากการล้มมอน (ส่วนที่บวกตรง ๆ) เหลือ 45% · โอกาสดรอปของเฉพาะตัวมอนสูงขึ้นเล็กน้อย
{const _mk=mobKill;mobKill=function(m){MK31++;const c0=inv.coin;let r;try{r=_mk(m)}finally{MK31--}
  try{const g=inv.coin-c0;if(g>0)inv.coin=c0+Math.round(g*.45);
   const j=JFAM[m.f];if(j&&!m.wb10&&!m.boss&&Math.random()<.15)addDrop(j,m.x,m.y);
   // บอสเหมือง: แทนแร่ด้วยของเฉพาะตัว ×3 + หินตีบวก
   if(m.boss&&D&&D.zone&&!D.dg&&!m.wb10){if(j)for(let i=0;i<3;i++)addDrop(j,m.x,m.y);addDrop('estone',m.x,m.y)}}catch(e){}return r}}
// ---------- 2) เศรษฐกิจ ----------
// ราคาขายของให้ร้าน ×0.6
try{for(const k in SD2){const S=SD2[k];if(S&&Array.isArray(S.sell))for(const e of S.sell)if(typeof e[2]==='number')e[2]=Math.max(1,Math.round(e[2]*.6))}}catch(e){}
try{for(let i=0;i<GP.length;i++)GP[i]=Math.max(1,Math.round(GP[i]*.6))}catch(e){}
try{const _ls=lifeSell;lifeSell=function(k,p){return _ls(k,Math.max(1,Math.round(p*.7)))};window.lifeSell=lifeSell}catch(e){}
// กล่องสมบัติดันเจี้ยน: เหรียญเหลือครึ่ง
try{const _oc=openChest_;openChest_=function(){const c0=inv.coin;const r=_oc.apply(this,arguments);try{const g=inv.coin-c0;if(g>0)inv.coin=c0+Math.round(g*.5)}catch(e){}return r};window.openChest_=openChest_}catch(e){}
// ---------- 3) ความยาก ----------
{const _ms=mobStats;mobStats=function(L,f,el,bo){const s=_ms(L,f,el,bo);return Object.assign({},s,{hp:Math.round(s.hp*1.25),atk:Math.round(s.atk*1.2)})}}
{const _gx=gainXp;gainXp=function(n){return _gx(Math.max(1,Math.round((+n||0)*.8)))};window.gainXp=gainXp}

// กระสุน/ดาวกระจายห้ามทำดาเมจทะลุกำแพง (ตรวจเส้นระหว่างจุดกระสุนกับเป้า)
{const _h=hurtE;hurtE=function(e,mult,o){try{if(o&&o.fx!=null&&e&&!e.pvp7&&typeof wallBetween7==='function'&&D&&D.zone&&wallBetween7(o.fx,o.fy,e.x,e.y-6))return 0}catch(_){}return _h(e,mult,o)}}

// =====================================================================
