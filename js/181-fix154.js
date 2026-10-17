// =====================================================================
// fix154 (v5.08) — 🤖 บอทตรวจ QA ทำเซฟจริงเพี้ยน (เจอระหว่างตรวจเล่นจริง 2026-10-17)
//  ต้นเหตุ: QA (SystemValidator.runFullGamePlaytest) ปรับเลเวล/ให้ของ/ให้เงินเพื่อทดสอบ และกันเซฟลงเครื่องไว้แค่ "ระหว่างรัน"
//   แต่ระบบซิงค์คลาวด์ยังส่ง lv ขึ้นเซิร์ฟเวอร์ระหว่างรัน และพอ QA จบ เซฟอัตโนมัติก็อัปสถานะทดสอบขึ้นเซิร์ฟเวอร์ทันที
//   (ทดสอบจริง: ไอดีทดสอบ Lv.1 เงิน 0 → หลังรัน QA โหลดใหม่กลายเป็น Lv.99 เงิน 103,339)
//  แก้: กด QA เมื่อไหร่ = หยุดเซฟทั้งหมด (ในเครื่อง + ขึ้นเซิร์ฟเวอร์) จนกว่าจะโหลดเกมใหม่ — ตรงกับข้อความเดิมที่ให้ "โหลดเกมใหม่เพื่อคืนสถานะ"
// =====================================================================
try{
window.__qa154=0;
{const SP=Storage.prototype,_si=SP.setItem;SP.setItem=function(k,v){if(window.__qa154&&/fm_|eldoria/.test(String(k)))return;return _si.apply(this,arguments)}}
{const _c=CLOUD.call;CLOUD.call=function(p,body,to){if(window.__qa154&&p==='/api/save')return Promise.resolve({err:'qa'});return _c.apply(this,arguments)}}
{const _s=CLOUD.sync;if(typeof _s==='function')CLOUD.sync=function(){if(window.__qa154)return Promise.resolve();return _s.apply(this,arguments)}}
{const _r=SystemValidator.runFullGamePlaytest;SystemValidator.runFullGamePlaytest=async function(){window.__qa154=1;
  try{say('🤖 QA: หยุดเซฟทั้งหมดจนกว่าจะโหลดเกมใหม่ (เซฟจริงไม่โดนแตะ)')}catch(e){}
  return _r.apply(this,arguments)}}
/* REG136 */
try{if(window.REG136)REG136.push(
 ['QA ไม่อัปสถานะทดสอบขึ้นเซิร์ฟเวอร์ (fix154)',async()=>{if(!window.__qa154)return 'ธงหยุดเซฟไม่ทำงานระหว่าง QA';const r=await CLOUD.call('/api/save',{});return r&&r.err==='qa'?null:'ระหว่าง QA ยังส่งเซฟขึ้นเซิร์ฟเวอร์ได้'}]);}catch(e){}
}catch(e){console.warn('fix154',e)}
