// =====================================================================
// fix138 (v5.03) — 💰 เศรษฐกิจ: ทางใช้เงินน้อยเกินเทียบรายได้ (ฟาร์มได้หลักแสน/ชม.)
//  ค่าตีบวก (Gold) เดิมไม่ดูระดับของ → ตี +0→+15 ทั้งชุดใช้แค่ ~68,000 (ผู้เล่น Lv.150 ฟาร์ม ~15 นาที)
//  ตอนนี้คูณตามระดับไอเท็ม: ระดับ 0–2 เท่าเดิม (มือใหม่ไม่ลำบาก) · ระดับละ +50% หลังจากนั้น (ระดับ 5 ×2.5 · ระดับ 8 ×4 · ระดับ 10 ×5 · สูงสุด ×7)
// =====================================================================
try{
const mult=id=>{try{const t=(ITEMS[id]&&ITEMS[id].tier)|0;return 1+.5*Math.max(0,Math.min(14,t)-2)}catch(e){return 1}};window.ENHMULT138=mult;
{const _c=ENHCFG.cost;ENHCFG.cost=function(l){const c=Object.assign({},_c.apply(this,arguments));try{const id=(typeof ENHS!=='undefined')&&ENHS.sel;if(id)c.gold=Math.round(c.gold*mult(id)/10)*10}catch(e){}return c}}
}catch(e){console.warn('fix138',e)}
