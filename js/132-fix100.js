// fix100 (v4.85) — ใส่คอสตูม (ชุดแฟชั่น) แล้วยังเห็นออร่าตีบวก (+) ของชุดหลัก (เจ้าของสั่ง 2026-10-14 15:33)
//  สาเหตุ: ตัวห่อ hero ของแฟชั่น (fix6) ล้าง P.armor ชั่วคราวตอนวาด → info60 (ออร่าตีบวก fix60) เห็นช่องว่าง → ไม่มีออร่า
//  แก้: จำชุดหลักไว้ก่อนวาด แล้วให้ info60 คำนวณจากชุดหลักจริงขณะวาดคอสตูม (ผู้เล่นอื่นใช้เส้นทางเดียวกันผ่าน drawOther)
try{
let ARM100=null;
{const _h=hero;hero=function(){const sv=ARM100;try{ARM100=P.armor?{helm:P.armor.helm,chest:P.armor.chest,pants:P.armor.pants,arm:P.armor.arm}:null}catch(e){ARM100=null}
  try{return _h.apply(this,arguments)}finally{ARM100=sv}};window.hero=hero}
{const _i=info60;window.info60=info60=function(){if(window._fashOn&&ARM100&&P.armor){const sv={helm:P.armor.helm,chest:P.armor.chest,pants:P.armor.pants,arm:P.armor.arm};Object.assign(P.armor,ARM100);
   try{return _i.apply(this,arguments)}finally{Object.assign(P.armor,sv)}}return _i.apply(this,arguments)}}
}catch(e){console.warn('fix100',e)}
