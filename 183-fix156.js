// fix156 (v5.11) — ⭐ เสกเลเวล 150 เมื่อตัวละครถึง Lv.5 (เจ้าของสั่ง 2026-10-17) · ครั้งเดียวต่อไอดี
//  เซิร์ฟเวอร์ (accounts.js) ส่ง b150:true ตอนล็อกอิน/โหลด/เซฟ เมื่อเลเวลบัญชี >= 5 (B150_MIN) และยังไม่เคยได้ · เซฟแรกที่ Lv.140–155 = ปิดสิทธิ์ (ไม่ติดธงโกง)
//  v5.11: เลิกเสกทันทีตอนสมัคร (เดิม /api/register ตั้งธงเอง ทั้งที่เซิร์ฟเวอร์ยังไม่ให้สิทธิ์) · เพิ่มถามเซิร์ฟเวอร์ซ้ำทุก 20 วิเมื่อถึง Lv.5 แต่ยังไม่ได้ธง
//  ให้ XP ผ่าน gainXp ตามปกติ (แต้ม/เลือดขึ้นตามทุกชั้นเดิม) จนถึง Lv.150
try{
let B156=false,done156=false,ask156=0,busy156=false;window.ST156=()=>({b:B156,d:done156,lv:(typeof P!=='undefined'&&P)?P.lv:null});
{const _c=CLOUD.call;CLOUD.call=async function(path){const r=await _c.apply(this,arguments);try{if(r&&r.ok&&r.b150&&(path==='/api/login'||path==='/api/load'||path==='/api/save'))B156=true}catch(e){}return r}}
const tick156=setInterval(()=>{try{if(done156)return;if(!(typeof ONL32!=='undefined'&&ONL32.verified)||!P||!P.name||P.dead)return;
  const t=gid('title');if(t&&t.hidden===false)return;
  if(P.lv>=150){done156=true;clearInterval(tick156);return}
  if(P.lv<5)return;
  if(!B156){const now=Date.now();if(!busy156&&now-ask156>20000){ask156=now;busy156=true;
    try{CLOUD.call('/api/load',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT)},20000).catch(()=>{}).finally(()=>{busy156=false})}catch(e){busy156=false}}
    return}
  done156=true;clearInterval(tick156);
  window.__noXpm64=1;let g=0,st=0,l=P.lv;try{while(P.lv<150&&g++<3000&&st<60){gainXp(Math.max(1,(need(P.lv)-P.xp)*3));if(P.lv>l){l=P.lv;st=0}else st++}}finally{window.__noXpm64=0}
  try{recalcStats()}catch(e){}try{lvHud();refreshInv()}catch(e){}
  try{say('⭐ ช่วงทดสอบ: เสกเลเวลเป็น Lv.'+P.lv+' ให้แล้ว — ช่วยลองระบบต่าง ๆ หาบัคด้วยนะ!')}catch(e){}
  setTimeout(()=>{try{saveGame(true)}catch(e){}},1500)}catch(e){console.warn('fix156',e)}},1000);
}catch(e){console.warn('fix156',e)}
