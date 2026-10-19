// fix107 (v4.92) — ☁️ ใช้เซฟออนไลน์อัตโนมัติ ซ่อนปุ่มเซฟในเกม (เจ้าของเลือก 2026-10-14 20:17 "แนะนำดีกว่า")
//  - ซ่อนปุ่ม "💾 บันทึกตอนนี้" (saveGame(true)) และเมนู "💾 ย้ายเซฟ" (openSave8) ออกจากเมนูผู้เล่น
//  - ระบบเดิมยังทำงาน: ล็อกอินแล้วเซฟขึ้นเซิร์ฟเวอร์อัตโนมัติทุก 15 วิ (CLOUD.sync) + เซฟสำรองในเครื่องทุก 20 วิ (saveGame → fm_save_v1) — ห้ามลบเซฟในเครื่อง
//  - เพิ่ม: ปิด/สลับแอป (หน้าเว็บถูกซ่อน) → เซฟในเครื่อง + ส่งขึ้นเซิร์ฟเวอร์ทันที กันของหายตอนผู้เล่นปัดแอปทิ้ง
try{
{const st=document.createElement('style');st.textContent='button[onclick="saveGame(true)"]{display:none!important}';document.head.appendChild(st)}
try{const i=PM7.findIndex(m=>m[1]==='ย้ายเซฟ');if(i>=0){PM7.splice(i,1);try{pmRender7()}catch(e){}}}catch(e){}
// Local save events schedule a cloud sync too; CLOUD.sync's own save is ignored while inflight.
const _save107=saveGame;let saveTimer107=0;saveGame=function(){const r=_save107.apply(this,arguments);try{if(window.ONL32&&ONL32.verified&&window.CLOUD&&!CLOUD.inflight&&!CLOUD.reloading){clearTimeout(saveTimer107);saveTimer107=setTimeout(()=>{try{CLOUD.sync(false)}catch(e){}},2000)}}catch(e){}return r};
let last107=0;const flush107=()=>{const now=Date.now();if(now-last107<3000)return;last107=now;try{if(!P.dead)saveGame(false)}catch(e){}try{if(window.ONL32&&ONL32.verified&&typeof CLOUD!=='undefined'&&CLOUD.sync)CLOUD.sync(false)}catch(e){}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)flush107()});addEventListener('pagehide',flush107);
}catch(e){console.warn('fix107',e)}
