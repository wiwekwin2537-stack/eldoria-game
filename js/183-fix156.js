// fix156 (v5.12) — ⭐ เสกเลเวล 150 เมื่อตัวละครถึง Lv.7 (เจ้าของสั่ง 2026-10-17) · ครั้งเดียวต่อไอดี
//  เซิร์ฟเวอร์ (accounts.js) ตอบ b150:true (ล็อกอิน/โหลด/เซฟ) เมื่อเลเวลบัญชี >= 7 (B150_MIN) และยังไม่เคยได้ · เซฟที่ Lv.140–155 = ปิดสิทธิ์ (ไม่ติดธงโกง)
//  v5.12: ไม่รอ ONL32.verified แล้ว (ต้นเหตุที่เสกไม่ขึ้น) · ถามเซิร์ฟเวอร์ (/api/load) ทุก 20 วิเมื่อ Lv.>=7 · ถ้าเซิร์ฟเวอร์ตอบ b150:false = ไม่เสก
//  ให้ XP ผ่าน gainXp ตามปกติ (แต้ม/เลือดขึ้นตามทุกชั้นเดิม) จนถึง Lv.150
try{
let B156=false,deny156=false,done156=false,ask156=0,busy156=false,dbg156=0;
window.ST156=()=>({b:B156,deny:deny156,d:done156,lv:(typeof P!=='undefined'&&P)?P.lv:null});
const dbgSay156=m=>{try{say(m)}catch(e){}try{if(dbg156<=1&&typeof banner==='function')banner('🔍 fix156',m)}catch(e){}};
{const _c=CLOUD.call;CLOUD.call=async function(path){const r=await _c.apply(this,arguments);try{if(r&&r.ok&&(path==='/api/login'||path==='/api/load'||path==='/api/save')){if(r.b150)B156=true;else if(r.b150===false&&path==='/api/load')deny156=true}}catch(e){}return r}}
const tick156=setInterval(()=>{try{if(done156)return;if(typeof P==='undefined'||!P||!P.name||P.dead||typeof FM_ACCT==='undefined'||!FM_ACCT)return;
  const t=gid('title');if(t&&t.hidden===false)return;
  if(P.lv>=150){done156=true;clearInterval(tick156);return}
  if(P.lv<7)return;
  if(!B156){const now=Date.now();if(!busy156&&now-ask156>20000){ask156=now;busy156=true;deny156=false;
    try{CLOUD.call('/api/load',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT)},20000).then(r=>{if(dbg156++<3)dbgSay156('fix156: Lv.'+P.lv+' · เซิร์ฟเวอร์ ok='+(r&&r.ok)+' lv='+(r&&r.lv)+' b150='+(r&&r.b150)+(r&&r.err?' err='+r.err:''))}).catch(e=>{dbgSay156('fix156: ถามเซิร์ฟเวอร์ไม่สำเร็จ '+(e&&e.message||e))}).finally(()=>{busy156=false})}catch(e){busy156=false}}
    return}
  done156=true;clearInterval(tick156);
  window.__noXpm64=1;let g=0,st=0,l=P.lv;try{while(P.lv<150&&g++<3000&&st<60){gainXp(Math.max(1,(need(P.lv)-P.xp)*3));if(P.lv>l){l=P.lv;st=0}else st++}}finally{window.__noXpm64=0}
  try{recalcStats()}catch(e){}try{lvHud();refreshInv()}catch(e){}
  try{say('⭐ ช่วงทดสอบ: เสกเลเวลเป็น Lv.'+P.lv+' ให้แล้ว — ช่วยลองระบบต่าง ๆ หาบัคด้วยนะ!')}catch(e){}
  setTimeout(()=>{try{saveGame(true)}catch(e){}try{CLOUD.sync(true)}catch(e){}},1500)}catch(e){console.warn('fix156',e)}},1000);
}catch(e){console.warn('fix156',e)}
