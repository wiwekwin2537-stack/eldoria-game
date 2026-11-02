// fix119 (v4.99) — 🔍 ตรวจเกมแบบเล่นจริง รอบ 1 (เจ้าของสั่ง 2026-10-15 01:37 "ให้คุณเป็นคนเล่นจริง … ห้ามโกง")
//  1) ล้มสไลม์ในทุ่งหญ้าไม่ถูกนับใน 📊 สถิติ "ล้มมอน" (ST20.kills) → เควสรายวัน "ล้มมอน" (fix108) / ฉายานักล่า / บท 19 ไม่ขยับตอนตีสไลม์
//     (สไลม์ทุ่งหญ้าตายผ่าน dropLoot(x,y,s) ไม่ผ่าน mobKill) → นับเพิ่มตรงนี้
//  2) หน้าสมัครไอดีบนมือถือแนวนอน (สูง ≤520px): ปุ่ม "← กลับ" หลุดใต้จอ ต้องเลื่อนถึงเห็น → ย้ายไปมุมซ้ายบนของกรอบ
//  3) ข้อความเก่าที่ไม่ตรงกับเกมแล้ว: บท 14 "(เมนู 🗼 หอคอย)" (เอาวาปหอคอยออกจากเมนูแล้ว) · บท 18/26 "ประตูหอคอย →" (หอผนึกย้ายมาเป็นอาคารในเมือง fix113)
//     คู่มือ 📖: บอสตำนาน "ประตูหอคอย → แท่นผนึกอสูร (หรือเมนู 🐲)" · หัวข้อ "ที่ดินผู้กล้า (ฟาร์ม)" (เลิกใช้ใน fix114 → บ้านของคุณในเมือง)
try{
// 1) นับสไลม์ทุ่งหญ้าเป็น "ล้มมอน"
{const _dl=dropLoot;dropLoot=function(x,y,s){const r=_dl.apply(this,arguments);try{if(s&&!window.__IN_OTHER8&&typeof st20Add==='function')st20Add('kills')}catch(e){}return r};window.dropLoot=dropLoot}
// 2) ปุ่มกลับหน้าสมัคร/เข้าสู่ระบบ บนจอเตี้ย
{const st=document.createElement('style');st.textContent='@media (max-height:520px){#tpan{position:relative}#tpan>button.tb.ghost[onclick="tMain()"]{position:absolute;top:8px;left:8px;width:auto!important;height:auto!important;margin:0!important;padding:4px 10px!important;min-height:0!important;font-size:12px!important;line-height:1.4!important;border-radius:9px}}';document.head.appendChild(st)}
// 3) ข้อความเนื้อเรื่อง
const SEAL119='หอผนึกอสูร (บ้านหลังคาม่วงแถวบนของเมืองเอลโดเรีย)';
const fixTxt119=s=>typeof s!=='string'?s:s.replace(/ประตูหอคอย\s*→\s*หอผนึกอสูร\s*—\s*บ้านหลังคาม่วงแถวบนของเมืองเอลโดเรีย/g,SEAL119)
 .replace(/ประตูหอคอย\s*→\s*(?:<b>)?\s*แท่นผนึกอสูร(?:<\/b>)?/g,SEAL119).replace(/\s*\(หรือเมนู 🐲\)/g,'').replace(/\(เมนู 🗼 หอคอย\)/g,'(ประตูหอคอย มุมขวาบนของเมือง)');
try{for(const c of STCH){if(!c)continue;if(typeof c.d==='string')c.d=fixTxt119(c.d)}}catch(e){}
// คู่มือ 📖 (ข้อมูลอยู่ในบล็อกปิด → แก้หลังเปิดหน้าต่าง)
const HOME119='<b>บ้านของคุณ</b> หลังคาเขียว <b>มุมซ้ายบนของเมืองเอลโดเรีย</b> (ปลดล็อกหลังจบบทที่ 13) · เดินเข้าบ้านแล้วกด E: <b>นอน</b>รับบัฟ · <b>สร้าง/อัปเกรดบ้าน</b> · ไม่มีแปลงปลูกผัก/ที่ดินนอกเมืองแล้ว';
const guide119=()=>{try{const bd=document.querySelector('#gb66 .bd');if(!bd)return;
 for(const el of bd.querySelectorAll('.nx,details>div')){const h=el.innerHTML,n=fixTxt119(h).replace(/ซื้อที่<b>ลุงบุญมี<\/b> \(ที่ดินผู้กล้า\) หรือร้านสัตว์ในเมือง/g,'ซื้อที่<b>ร้านสัตว์ (ลุงขายผักในเมือง)</b>');if(n!==h)el.innerHTML=n}
 for(const d of bd.querySelectorAll('details')){const s=d.querySelector('summary');if(s&&/ที่ดินผู้กล้า/.test(s.textContent)){s.textContent='🏡 บ้านของคุณ';const b=d.querySelector('div');if(b)b.innerHTML=HOME119}}}catch(e){}};
{const _g=openGuide77;openGuide77=function(){const r=_g.apply(this,arguments);guide119();return r};window.openGuide77=openGuide77;window.openGuide66=openGuide77}
try{const i=PM7.findIndex(m=>m[1]==='คู่มือ');if(i>=0){PM7[i]=['📖','คู่มือ',()=>openGuide77()];pmRender7()}}catch(e){}
// 4) สมดุลแมพเหมือง/ป่า (เล่นจริง: Lv.5 เข้าเหมืองเหล็กร้าง "Lv.5–20" ตามบทที่ 2 → ตายใน 1 นาทีทั้ง 2 รอบ
//    เพราะมอนเกิดเลเวลสุ่ม 5–20 เฉลี่ย ~11 · ด้วงหินสนิม L11 ทุบ ~69 จากเลือด 160)
//    → มอนที่เกิดใหม่ในแมพ สูงกว่าผู้เล่นได้ไม่เกิน +2 เลเวล (ไม่ต่ำกว่าเลเวลขั้นต่ำของแมพ) · ผู้เล่นเลเวลถึงช่วงบนของแมพแล้ว = เหมือนเดิมทุกอย่าง · บอสไม่เกี่ยว
{const _sm=spawnMob;spawnMob=function(){const n0=(D&&D.mobs)?D.mobs.length:0;const r=_sm.apply(this,arguments);
 try{if(D&&D.zone&&D.mobs&&D.mobs.length>n0){const Zd=D.zone.Zd,[a,b]=Zd.lv||[1,1],cap=Math.max(a,(P.lv|0)+2);
  for(let i=n0;i<D.mobs.length;i++){const m=D.mobs[i];if(!m||m.boss||!(m.L>cap))continue;const s=mobStats(cap,m.f,m.elite,false);m.L=cap;m.hp=m.max=s.hp;m.atk=s.atk}}}catch(e){}return r};window.spawnMob=spawnMob}
// 4b) ช่วงต้นเกม (มอน Lv.1–24): มอนเลือด/ตีแรงเกินผู้เล่นเลเวลเท่ากันมาก (เล่นจริง Lv.5 อัปสเตตัสแล้ว ATK 11 HP 208
//     เจอโกเลมดินเหนียว L9: เลือด 258 = ต้องฟัน 23 ที · มันทุบ ~80 = เราตายใน 3 ที) → ลดเลือด/พลังโจมตีมอนเลเวลต่ำลง
//     L1 ×0.60 → L13 ×0.80 → L25 ขึ้นไป ×1.00 (เท่าเดิม) · ใช้กับมอนทุกที่ที่สร้างผ่าน mobStats (เหมือง/ป่า/ดันเจี้ยนชั้นต้น)
{const _ms=mobStats;mobStats=function(L,f,elite,boss){const s=_ms.apply(this,arguments);try{const l=+L||1;if(l<25){const k=.6+.4*Math.max(0,l-1)/24;s.hp=Math.max(1,Math.round(s.hp*k));s.atk=Math.max(1,Math.round(s.atk*k))}}catch(e){}return s};window.mobStats=mobStats}
// 5) 🤖 ออโต้ไม่วิ่งเข้าหามอนที่เลเวลสูงกว่าตัวเอง 8 ขึ้นไป (ยกเว้นตัวที่ไล่ตีเราอยู่) — กันออโต้พาไปตาย
setInterval(()=>{try{const A=window.A2_110;if(!A||!AUTO.on||!D||!D.mobs)return;const t=performance.now()+900;for(const m of D.mobs){if(m&&!m.dead&&!m.boss&&m.L>=(P.lv|0)+8&&!m.aggro)A.ban.set(m,t)}}catch(e){}},400);
// 5b) 🤖 ออโต้ถอยหนีตอนเลือดต่ำ (เล่นจริง: ตายในเหมืองทั้งที่ยังมียาเลือด 7–9 ขวด เพราะยาติดคูลดาวน์ 8 วิ แต่ออโต้ยังยืนตีต่อ)
//     เลือด < 30% และดื่มยาไม่ได้ตอนนี้ (คูลดาวน์/ยาหมด) → เดินหนีออกจากมอนที่ไล่อยู่ · เลือด ≥ 55% หรือยาพร้อม → กลับมาฟาร์มต่อ
{const RT={on:false};const canDrink=()=>(inv.hpp|0)>0&&!(window.HPCD82&&performance.now()<HPCD82.until);
 const free=(x,y)=>{try{return !hit(x,y)}catch(e){return false}};
 const _at=autoTick;autoTick=function(dt){try{
  if(AUTO.on&&!P.dead&&!PAUSED&&D&&D.zone&&D.mobs&&window.AUTO110&&AUTO110.pot){const r=P.hp/BAL.hp,ok=canDrink();
   if(!RT.on&&r<.3&&!ok){RT.on=true;say('🤖 เลือดต่ำ — ถอยหนีรอยาพร้อม')}
   if(RT.on&&(r>=.55||ok)){RT.on=false}
   if(RT.on){let vx=0,vy=0;for(const m of D.mobs){if(!m||m.dead)continue;const dx=P.x-m.x,dy=P.y-m.y,d=Math.hypot(dx,dy)||1;if(d<300){vx+=dx/d/d;vy+=dy/d/d}}
    const n=Math.hypot(vx,vy);let best=null,bs=-9;for(let i=0;i<16;i++){const a=i/16*6.283,cx=Math.cos(a),cy=Math.sin(a),s=n?(cx*vx+cy*vy)/n:0;if(s>bs&&free(P.x+cx*40,P.y+cy*40)&&free(P.x+cx*20,P.y+cy*20)){bs=s;best=[cx,cy]}}
    AUTO.ix=best?best[0]:0;AUTO.iy=best?best[1]:0;return}}}catch(e){}
  return _at.apply(this,arguments)};window.autoTick=autoTick}
// 6) แต้มสเตตัสค้างไม่มีป้ายเตือน (เล่นจริง: ตัวละคร Lv.5 มีแต้มค้าง 12 แต้ม โจมตีแค่ 3 → ตีมอนเหมืองไม่เข้า)
//    ป้าย "+n" ข้างรูปโปรไฟล์ (#spb) อัปเดตแค่ตอนเลเวลอัป/ตอนเปิดเกมก่อนโหลดเซฟออนไลน์ → หลังเข้าเกมใหม่ป้ายหายทั้งที่ยังมีแต้ม
//    → อัปเดตป้ายทุกวินาที + ป้ายตัวเลขบนปุ่ม 👤 สถานะ ในเมนู
setInterval(()=>{try{if(typeof updBadge==='function')updBadge()}catch(e){}},1000);
{const _pr=pmRender7;pmRender7=function(){const r=_pr.apply(this,arguments);try{const n=P.sp|0;if(n>0)for(const b of pm7.querySelectorAll('button')){const s=b.querySelector('small');if(s&&s.textContent==='สถานะ'&&!b.querySelector('.sp119'))b.insertAdjacentHTML('beforeend','<i class="sp119" style="position:absolute;right:3px;top:2px;font:900 9px system-ui;font-style:normal;background:#e04a3a;color:#fff;border-radius:7px;padding:0 4px">+'+n+'</i>')}}catch(e){}return r};window.pmRender7=pmRender7}
// 7) ฉากเล่าเรื่อง (cinematic): แตะข้ามเร็ว ๆ 2 ครั้งในบรรทัดสุดท้าย → เกมแจ้ง error "reading 't'" (ตัวหน่วง 0.25 วิ ไปอ่านบรรทัดที่เลยท้ายแล้ว)
cineText=function(){const c=cineEl.querySelector('.ct');if(!c)return;c.style.opacity=0;setTimeout(()=>{const L=CINE.L&&CINE.L[CINE.i];if(!L)return;c.textContent=L.t;c.style.opacity=1},250);CINE.t0=performance.now()};window.cineText=cineText;
}catch(e){console.warn('fix119',e)}
