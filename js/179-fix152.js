// =====================================================================
// fix152 (v5.08) — 🪓 ขวาน/ที่ขุดดรอปจนกระเป๋าเต็ม + น้ำหนักเกิน (เจ้าของแจ้ง 2026-10-17 พร้อมรูป: กระเป๋า 56/56 ขวานซ้ำ ~29 อัน · น้ำหนัก 722.8/632)
//  ต้นเหตุ: มอนในแมพป่า/ทุ่งสังหาร (ตัวห่อ mobKill "มอนในแมพใหม่: ดรอปไม้ วัตถุดิบหายาก และเครื่องมือ")
//   มีโอกาส 2% (บอส 50%) ยัดขวาน/ที่ขุดเข้ากระเป๋าตรง ๆ (GEAR[id]+1) — ไม่เช็กช่องว่าง/น้ำหนัก และไม่เช็กว่ามีอยู่แล้ว
//   → ทุ่งสังหารฆ่าได้หลายร้อยตัว/นาที = ได้ขวาน/ที่ขุดเพชรซ้ำ ๆ ~8 อัน/นาที (วัดจริง) จนกระเป๋าล้นและแบกเกินน้ำหนัก
//  แก้ (เฉพาะจุด): บรรทัดเดิมเรียก toolDrop152(m,id) แทนการยัดตรง (ถ้าบล็อกนี้โหลดไม่ขึ้น บรรทัดเดิมยังทำงานแบบเก่า)
//   · ดรอปเฉพาะ "ของที่ยังไม่มี" — มีชนิดเดียวกันระดับเท่ากันหรือดีกว่าอยู่แล้ว (ในกระเป๋า/คลังเก็บของ) = ไม่ดรอป
//   · กระเป๋าเต็ม/หนักเกิน = ไม่ยัดเข้า (แจ้งข้อความแทน) — ผู้เล่นใหม่ยังได้เครื่องมืออัปเกรดจากแมพป่าเหมือนเดิม
// =====================================================================
try{
function toolOwned152(kind){let best=-1;const scan=o=>{if(!o)return;for(const k in o){if(!((o[k]|0)>0))continue;const it=ITEMS[k];if(it&&it.kind===kind)best=Math.max(best,it.tier|0)}};
 scan(GEAR);try{scan(VAULT8&&VAULT8.gear)}catch(e){}return best}
function toolDrop152(m,id){const it=ITEMS[id];if(!it)return false;
 if(toolOwned152(it.kind)>=(it.tier|0))return false;
 const c=canTakeGear(id);if(c!==true){try{say('🎒 '+(m&&m.nm||'มอน')+' ทิ้ง '+it.name+' แต่'+(c==='weight'?'แบกหนักเกิน':'กระเป๋าเต็ม')+' — เก็บไม่ได้')}catch(e){}return false}
 GEAR[id]=(GEAR[id]|0)+1;try{refreshInv()}catch(e){}try{say('🎁 '+(m&&m.nm||'มอน')+' ทิ้ง '+it.name+'!');sfx('chest')}catch(e){}return true}
window.toolDrop152=toolDrop152;window.toolOwned152=toolOwned152;
/* REG136 */
try{if(window.REG136)REG136.push(
 ['ขวาน/ที่ขุดจากมอนแมพป่า: ไม่ดรอปซ้ำ + ไม่ล้นกระเป๋า (fix152)',async()=>{const sv=JSON.stringify(GEAR),vg=JSON.stringify((window.VAULT8&&VAULT8.gear)||{}),bl=P.bagLv;let bad=null;
   try{for(const k in GEAR)delete GEAR[k];if(window.VAULT8)VAULT8.gear={};P.bagLv=3;
    if(!toolDrop152({nm:'QA'},'axe3'))bad='ไม่มีขวานเลยแต่ไม่ได้ขวาน';
    else if(toolDrop152({nm:'QA'},'axe3')||toolDrop152({nm:'QA'},'axe2'))bad='มีขวานระดับนี้แล้วยังดรอปซ้ำ';
    else if(!toolDrop152({nm:'QA'},'axe4'))bad='ขวานระดับสูงกว่า (อัปเกรด) ไม่ดรอป';
    else{for(const k in GEAR)delete GEAR[k];GEAR.helm0=999;if(toolDrop152({nm:'QA'},'pick1'))bad='กระเป๋าเต็ม/หนักเกินแล้วยังยัดที่ขุดเข้า'}}
   catch(e){bad='error '+e.message}
   finally{for(const k in GEAR)delete GEAR[k];Object.assign(GEAR,JSON.parse(sv));if(window.VAULT8)VAULT8.gear=JSON.parse(vg);P.bagLv=bl;try{refreshInv()}catch(e){}}
   return bad}]);}catch(e){}
}catch(e){console.warn('fix152',e)}
