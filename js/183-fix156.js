// fix156 (v5.09) — ⭐ เสกเลเวล 150 ให้ไอดีเทส (เจ้าของสั่ง 2026-10-17: "ผู้เทสจะได้ลองระบบอื่น") · ครั้งเดียวต่อไอดี
//  เซิร์ฟเวอร์ (accounts.js) ส่ง b150 ตอนล็อกอิน ถ้าไอดีสมัครก่อน 2026-10-19 และยังไม่เคยได้ · เซฟแรกที่ Lv.140–155 = ปิดสิทธิ์ (ไม่ติดธงโกง)
//  ให้ XP ผ่าน gainXp ตามปกติ (แต้ม/เลือดขึ้นตามทุกชั้นเดิม) จนถึง Lv.150
try{
let B156=false,done156=false;window.ST156=()=>({b:B156,d:done156});
{const _c=CLOUD.call;CLOUD.call=async function(path){const r=await _c.apply(this,arguments);try{if((path==='/api/register'||path==='/api/login'||path==='/api/load'||path==='/api/save')&&r&&r.ok&&r.b150)B156=true}catch(e){}return r}}
const tick156=setInterval(()=>{try{if(!B156||done156)return;if(!(typeof ONL32!=='undefined'&&ONL32.verified)||!P||!P.name||P.dead)return;
  const t=gid('title');if(t&&t.hidden===false)return;
  done156=true;clearInterval(tick156);if(P.lv>=150)return;
  window.__noXpm64=1;let g=0,st=0,l=P.lv;try{while(P.lv<150&&g++<3000&&st<60){gainXp(Math.max(1,(need(P.lv)-P.xp)*3));if(P.lv>l){l=P.lv;st=0}else st++}}finally{window.__noXpm64=0}
  try{recalcStats()}catch(e){}try{lvHud();refreshInv()}catch(e){}
  try{say('⭐ ช่วงทดสอบ: เสกเลเวลเป็น Lv.'+P.lv+' ให้แล้ว — ช่วยลองระบบต่าง ๆ หาบัคด้วยนะ!')}catch(e){}
  setTimeout(()=>{try{saveGame(true)}catch(e){}},1500)}catch(e){console.warn('fix156',e)}},1000);
}catch(e){console.warn('fix156',e)}
