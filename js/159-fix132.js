// =====================================================================
// fix132 (v5.03) — ดันเจี้ยน: กด E ลงชั้นต่อทันทีหลังเปิดกล่อง → ของจากกล่องที่ยังไม่ได้เก็บ (หรือกระเป๋าเต็ม) ถูกทิ้งไว้หายหมด
//   → ก่อนลงชั้น เก็บของรอบกล่องเข้ากระเป๋าให้เอง · ถ้าเต็มเก็บไม่หมด เตือนก่อน (กด E อีกครั้งภายใน 5 วิ = ยืนยันลง)
// =====================================================================
try{
const nearChest=()=>{try{const c=D&&D.dg&&D.chest;if(!c)return [];return drops.filter(d=>Math.hypot(d.x-c.x,d.y-c.y)<160)}catch(e){return []}};
let warnT=0;
{const _g=dgGo7;dgGo7=function(f){try{if(D&&D.dg&&D.chest&&D.chest.open){const L=nearChest();let got=0,left=0;
   for(const d of L){const ik=DROPMAP[d.type]||d.type;if(canTake(ik)===true){inv[ik]=(inv[ik]|0)+1;got++;drops.splice(drops.indexOf(d),1);try{if(window.logPick)logPick(ik)}catch(e){}}else left++}
   if(got){try{refreshInv();sfx('coin')}catch(e){}}
   if(left&&performance.now()>warnT){warnT=performance.now()+5000;say('🎒 กระเป๋าเต็ม — ของจากกล่องยังเหลือ '+left+' ชิ้น · กด E อีกครั้งภายใน 5 วิ ถ้าจะทิ้งแล้วลงชั้นต่อ');sfx('thud');return}
   warnT=0}}catch(e){console.warn('dg132',e)}return _g.apply(this,arguments)};window.dgGo7=dgGo7}
}catch(e){console.warn('fix132',e)}
