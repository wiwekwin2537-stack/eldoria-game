// fix157 (v5.09) — 🗺️ แมพดำ/จางทั้งจอ + เกมหน่วงบนมือถือ (ผู้เล่น "เทพกล้า" แคปจอ 2026-10-17 · เจ้าของ: "เป็นบ่อยมาก")
//  ต้นเหตุ (วัดจริง): ภาพแมพทุกแมพที่เคยเข้า ถูกเก็บไว้ใน ZCACHE ตลอด ไม่เคยคืนหน่วยความจำ — แมพละ 11–22 MB
//   เข้าครบ 19 แมพ = ~244 MB (ยังไม่นับเมือง/ทุ่งหญ้า) → มือถือหน่วยความจำไม่พอ เบราว์เซอร์ทิ้งภาพ canvas → แมพดำ/จาง · หน่วง
//   (เพิ่งเป็นช่วงหลัง เพราะแมพเพิ่มขึ้น: ดันเจี้ยนเมือง 2 · ทุ่งสังหาร · ป่าใหญ่)
//  แก้: แมพที่ไม่ได้อยู่เกิน 45 วิ → คืนหน่วยความจำภาพ (เก็บข้อมูลแร่/ต้นไม้ไว้) · กลับเข้าแมพนั้นใหม่ → สร้างภาพใหม่ (genZone)
try{
const FREE157=45e3,LAST157={};
const cvs157=z=>{const L=[];if(z)for(const k in z){const v=z[k];if(v&&typeof v==='object'&&v.getContext&&v.width>1)L.push(v)}return L};
{const _gz=genZone;genZone=function(zi){try{const z=ZCACHE[zi];if(z&&z.__f157)delete ZCACHE[zi]}catch(e){}return _gz.apply(this,arguments)};window.genZone=genZone}
setInterval(()=>{try{const now=performance.now(),cur=D&&D.zone;for(const k in ZCACHE){const z=ZCACHE[k];if(!z||z.__f157)continue;
  if(z===cur){LAST157[k]=now;continue}if(LAST157[k]===undefined){LAST157[k]=now;continue}if(now-LAST157[k]<FREE157)continue;
  for(const c of cvs157(z)){c.width=1;c.height=1}z.__f157=1}}catch(e){console.warn('fix157',e)}},5000);
window.FREE157=()=>{let a=0,n=0;for(const k in ZCACHE)for(const c of cvs157(ZCACHE[k])){a+=c.width*c.height;n++}return {n,mb:Math.round(a*4/1e6)}};
}catch(e){console.warn('fix157',e)}
