// fix36.js (v4.39) — แก้: เมนูดันเจี้ยนจากรูปปั้นในกิลด์ (หอโถง) เปิดแล้วปิดเองทันที
//  สาเหตุ: ตัวตรวจระยะเก่าปิดเมนูทุก 0.3 วิ ถ้าไม่ได้ยืนหน้าประตูถ้ำในทุ่ง (แต่ในกิลด์ไม่มีประตูถ้ำ)
// =====================================================================
const nearHall36=()=>!!(D&&D.shop==='hall'&&typeof DGST11!=='undefined'&&Math.hypot(P.x-DGST11.x,P.y-DGST11.y)<90);
{const _om=openDgMenu;openDgMenu=function(){const r=_om.apply(this,arguments);if(nearHall36()){ZM.open=false;ZM.hall36=true}return r}}
{const _cz=closeZMenu;closeZMenu=function(){ZM.hall36=false;return _cz.apply(this,arguments)}}
{const _sa=shopAct;shopAct=function(){if(nearHall36()&&ZM.hall36&&!shopEl.hidden&&!P.sit){closeZMenu();return true}return _sa()}}
setInterval(()=>{try{if(ZM.hall36&&!shopEl.hidden&&!nearHall36())closeZMenu()}catch(e){}},300);
// ตัวอัปเดตร้าน (ปิดหน้าต่างถ้าไม่ได้ยืนใกล้คนขายในอาคาร) — ยกเว้นตอนเปิดเมนูดันเจี้ยนที่รูปปั้น
{const _us=updShop;updShop=function(dt){if(ZM.hall36&&!shopEl.hidden&&nearHall36()){const sv=STN.open;STN.open=sv||'hall36';try{return _us(dt)}finally{STN.open=sv}}return _us(dt)}}

// =====================================================================
