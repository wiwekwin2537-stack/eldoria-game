// =====================================================================
// fix153 (v5.08) — ⚔️ ทุ่งสังหาร: เลเวลขึ้นเร็วเกินจนผู้เล่นทดสอบตัน Lv.200 · เงินเฟ้อ (เจ้าของแจ้ง 2026-10-17 "แค่เปิดเทสก็มีคนเลเวลตันไปละ")
//  ต้นเหตุ (วัดจริงด้วยฟาร์มออโต้ · นินจาชุดตามระดับ):
//   ทุ่งสังหาร (fix93) ทำตอนเลเวลตันยังเป็น 150 — ตอนนั้น XP ในแมพนี้ "เข้าดาวตำนาน" อย่างเดียว ไม่ทำให้เลเวลขึ้น
//   fix96 เปิดเลเวลถึง 200 แต่ไม่ได้แก้ทุ่งสังหาร → XP ไหลเข้าเลเวลตรง ๆ
//   มอนเลือดน้อยเกิดเป็นฝูงรอบตัว → ฆ่าได้ 320–450 ตัว/นาที (แมพปกติ 2–9 ตัว/นาที) · XP ต่อตัว ×0.4 ไม่พอชดเชย
//   วัดได้: Lv.150 ≈ 314 เลเวล/ชม. (150→161 ใน 2.5 นาที) · Lv.185 ≈ 108 เลเวล/ชม. · เงิน 42,000–59,000/นาที
//   เทียบดันเจี้ยนเมือง 2 (ทางหลักของ Lv.150–200): ~6 เลเวล/ชม. · เงิน ~750/นาที
//  แก้ (ห่อเฉพาะตอนอยู่ในทุ่งสังหาร · ความมันของการกวาดฝูงเหมือนเดิม · แมพอื่นไม่เปลี่ยน):
//   1) โควตารางวัลเต็ม T153 ตัว/นาที (สะสมได้ 1 นาที) — ฆ่าเกินโควตาได้รางวัล LOW153 ของปกติ (XP · เงิน · ของดรอป · ดาวนิรันดร์ · ไข่)
//   2) XP ต่อตัวในทุ่งสังหาร ×KXP153 (ซ้อนกับ ×0.4/คอมโบ/ปาร์ตี้เดิม · รวม XP แบ่งปาร์ตี้) · เงินต่อตัว ×KC153
//   → ฆ่าเร็วสุดได้ราว ๆ ดันเจี้ยนเมือง 2 (ไม่ใช่ทางลัดอีกต่อไป) · ปรับความเร็วได้ที่ค่าคงที่ 4 ตัวบรรทัดล่างนี้ที่เดียว
//   XP จากเควส/เนื้อเรื่องที่กดรับในทุ่งสังหารไม่ถูกลดเพิ่ม (ลดเฉพาะ XP จากการฆ่า)
// =====================================================================
try{
const T153=60,LOW153=0.1,KXP153=0.09,KC153=0.08;
const RN153={tok:T153,t:performance.now(),ema:1,kill:null,n:0,over:0,share:0,q:[]};window.RN153=RN153;
window.RAGE153={T:T153,LOW:LOW153,KXP:KXP153,KC:KC153};
const inR153=()=>{try{return typeof window.inRage93==='function'&&inRage93()}catch(e){return false}};
function fill153(){const n=performance.now();RN153.tok=Math.min(T153,RN153.tok+(n-RN153.t)/60000*T153);RN153.t=n}
function peek153(){fill153();return RN153.tok>=1?1:LOW153}
window.fill153=fill153;window.peek153=peek153;
/* ฆ่ามอนในทุ่งสังหาร: ตัดสินรางวัลของตัวนี้ก่อน แล้วให้ระบบเดิมทำงานตามปกติ (บอสไม่ติดโควตา แต่ XP ก็คูณ KXP) */
{const _mk=mobKill;mobKill=function(m){
  if(!(m&&!m.dead&&inR153()))return _mk.apply(this,arguments);
  const boss=!!m.boss,f=boss?1:peek153(),keep=boss||Math.random()<f,c0=inv.coin,s0=inv.star92|0,e0=inv.egg92|0;
  RN153.kill={f,keep};let r;
  try{r=_mk.apply(this,arguments)}finally{RN153.kill=null}
  try{/* ได้รางวัลจริงในรอบนี้ไหม: ระบบเดิมให้เงินทุกครั้งที่ให้รางวัลการฆ่า (โฮสต์ที่ไม่ได้ช่วยตี = ไม่ได้ ใช้ XP แบ่งปาร์ตี้แทน) */
   const mine=inv.coin>c0;
   if(m.dead&&mine){let xn=0;try{xn=mobXp(m.L)*(m.elite?3:1)*(m.boss?15:1)}catch(e){}RN153.q.push({t:performance.now(),f,n:xn});if(RN153.q.length>400)RN153.q.splice(0,200);
    if(!boss){if(f>=1)RN153.tok-=1;else RN153.over++;RN153.n++;RN153.ema=RN153.ema*.85+f*.15;
     const dc=inv.coin-c0;if(dc>0)inv.coin=c0+Math.round(dc*f*KC153);
     if(!keep){if((inv.star92|0)>s0)inv.star92=s0;if((inv.egg92|0)>e0)inv.egg92=e0}}}}catch(e){}
  return r};window.mobKill=mobKill}
/* ของดรอปพื้น (วัตถุดิบ/เหรียญ) ของตัวที่เกินโควตา: ออกตามสัดส่วน */
{const _ad=addDrop;addDrop=function(type){const k=RN153.kill;if(k&&type!=='dgkey'&&Math.random()>=k.f)return;return _ad.apply(this,arguments)};window.addDrop=addDrop}
/* ตัวเลขลอย ดาว/ไข่ ที่ไม่ได้จริง — ไม่โชว์ */
{const _dt=dmgTxt;dmgTxt=function(x,y,t){const k=RN153.kill;if(k&&!k.keep&&/🌟|🥚/.test(String(t)))return;return _dt.apply(this,arguments)};window.dmgTxt=dmgTxt}
/* XP แบ่งปาร์ตี้ (เพื่อนฆ่าให้ เราได้ครึ่ง) — ทำเครื่องหมายไว้ให้ตัวลด XP รู้ */
{const _p=partyXp33;partyXp33=function(){RN153.share++;try{return _p.apply(this,arguments)}finally{RN153.share--}};window.partyXp33=partyXp33}
/* XP จากการฆ่าในทุ่งสังหาร: XP ของแต่ละตัวมาหลังฆ่า ~30ms → จับคู่กับคิวรางวัลของตัวนั้น (ตรงจำนวน XP ของมอนตัวนั้น) · XP แบ่งปาร์ตี้ใช้ค่าเฉลี่ยล่าสุด · XP เควส/รายวันที่กดรับระหว่างฟาร์มไม่โดนลด */
{const _g=gainXp;gainXp=function(n){try{if(typeof n==='number'&&n>0&&inR153()){
   if(RN153.share>0)n=Math.max(1,Math.round(n*KXP153*RN153.ema));
   else{const now=performance.now();while(RN153.q.length&&now-RN153.q[0].t>1500)RN153.q.shift();const i=RN153.q.findIndex(q=>q.n===n);if(i>=0){const q=RN153.q.splice(i,1)[0];n=Math.max(1,Math.round(n*KXP153*q.f))}}}}catch(e){}
  return _g.apply(this,arguments)};window.gainXp=gainXp}
/* ป้ายบอกโควตา (ใต้แถบเกจคลั่ง) + ข้อความแท็บทุ่งสังหารให้ตรงกับจริง (เดิมบอก "XP ทั้งหมดเข้าดาวตำนาน" ซึ่งเป็นของสมัยตัน Lv.150) */
const q153=document.createElement('div');q153.id='q153';gid('wrap').appendChild(q153);
{const st=document.createElement('style');st.textContent='#q153{position:absolute;left:50%;top:calc(126px + var(--st,0px));transform:translateX(-50%);z-index:5;pointer-events:none;display:none;font:800 10px system-ui,"Noto Sans Thai",sans-serif;color:#ffe0b0;background:rgba(30,8,6,.78);border:1px solid #a8401a;border-radius:8px;padding:2px 8px;white-space:nowrap}#q153.lo{color:#ffb0a0;border-color:#ff5a2a}';document.head.appendChild(st)}
setInterval(()=>{try{const on=inR153();q153.style.display=on?'block':'none';if(!on)return;const h=gid('rg93');if(h){const b=h.getBoundingClientRect(),w=gid('wrap').getBoundingClientRect();if(b.height)q153.style.top=Math.round(b.bottom-w.top+4)+'px'}
  fill153();const lo=RN153.tok<1;q153.className=lo?'lo':'';q153.textContent=lo?'😮‍💨 ฆ่าเกินโควตา — รางวัลเหลือ '+Math.round(LOW153*100)+'% ชั่วคราว (โควตาคืน '+T153+' ตัว/นาที)':'🎁 โควตารางวัลเต็ม '+Math.floor(RN153.tok)+'/'+T153+' ตัว'}catch(e){}},400);
try{const _f=window.TABX92&&TABX92.farm;if(_f)TABX92.farm=function(){return String(_f.apply(this,arguments)).replace('XP ทั้งหมดเข้า 🌠 ดาวตำนาน','XP เข้าเลเวลตามปกติ (ถึง Lv.200 แล้วเข้า 🌠 ดาวตำนาน) · รางวัลเต็ม '+T153+' ตัวแรกของทุกนาที เกินนั้นได้ '+Math.round(LOW153*100)+'%')}}catch(e){}
/* REG136: ฆ่ารัว 200 ตัวในทุ่งสังหาร (จำลองกวาดฝูงเร็วสุด) → เลเวล/เงิน/เครื่องมือ ต้องไม่พุ่ง */
try{if(window.REG136)REG136.push(
 ['ทุ่งสังหาร: ฆ่ารัว 200 ตัว เลเวล/เงิน/ของไม่พุ่ง (fix153)',async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));
   const cum=(l,x)=>{let s=0;for(let i=1;i<l;i++)s+=need(i);return s+(x||0)},tools=()=>Object.keys(GEAR).filter(k=>/^(axe|pick)\d+$/.test(k)).reduce((s,k)=>s+(GEAR[k]|0),0);
   const sv={lv:P.lv,xp:P.xp,inv:JSON.stringify(inv),gear:JSON.stringify(GEAR),rn:Object.assign({},RN153,{q:[]}),rg:Object.assign({},RG93),f92:JSON.stringify((window.E92&&E92.f)||{}),st:typeof ST20!=='undefined'?Object.assign({},ST20):null};let bad=null;
   try{try{if(D&&D.shop)leaveShop(true)}catch(e){}try{if(D)exitD()}catch(e){}await sl(300);P.lv=160;P.xp=0;enterZone(RZI93);await sl(900);
    if(!inR153())return 'เข้าทุ่งสังหารเพื่อทดสอบไม่ได้';
    D.mobs.length=0;RN153.tok=T153;RN153.t=performance.now();RN153.ema=1;RN153.kill=null;RN153.q.length=0;
    const x0=cum(P.lv,P.xp),c0=inv.coin,t0=tools(),Zd=D.zone.Zd;
    for(let i=0;i<200;i++){const q=Zd.mobs[i%Zd.mobs.length];const m=mkMob(q[0],q[1],q[2],155,P.x+20,P.y+20,{});m.my33=1;D.mobs.push(m);mobKill(m)}
    await sl(700);
    /* v5.67: XP ทั้งเกมถูกคูณช่วงทดสอบ (XPM64 ใน fix64) → วัดเทียบค่าปกติ .65 เพื่อตรวจระบบโควตา ไม่ใช่ตัวคูณทดสอบ */
    const lv=(cum(P.lv,P.xp)-x0)/need(160)*.65/((window.XPM64)||.65),coin=inv.coin-c0,tl=tools()-t0;
    /* ก่อนแก้: ~1.5 เลเวล · ~19,000 เหรียญ · เครื่องมือหลายชิ้น ต่อ 200 ตัว */
    if(lv>0.3)bad='XP ยังพุ่ง: ฆ่า 200 ตัวได้ '+lv.toFixed(2)+' เลเวล';
    else if(coin>6000)bad='เงินยังเฟ้อ: ฆ่า 200 ตัวได้ '+coin+' เหรียญ';
    else if(tl>2)bad='ขวาน/ที่ขุดยังดรอปซ้ำ ('+tl+' ชิ้น)';
    else if(lv<=0)bad='ฆ่าแล้วไม่ได้ XP เลย'}
   catch(e){bad='error '+e.message}
   finally{try{drops.length=0}catch(e){}P.lv=sv.lv;P.xp=sv.xp;for(const k in inv)delete inv[k];Object.assign(inv,JSON.parse(sv.inv));for(const k in GEAR)delete GEAR[k];Object.assign(GEAR,JSON.parse(sv.gear));
    Object.assign(RN153,sv.rn);Object.assign(RG93,sv.rg);try{if(window.E92)E92.f=JSON.parse(sv.f92)}catch(e){}if(sv.st)Object.assign(ST20,sv.st);try{D.mobs.length=0}catch(e){}try{exitD()}catch(e){}try{recalcStats();lvHud();refreshInv()}catch(e){}}
   return bad}]);}catch(e){}
}catch(e){console.warn('fix153',e)}
