// fix141 (v5.03) — 🤝 เทรดต้องเจอตัวกัน (เจ้าของสั่ง): เอาปุ่มเทรดออกจากเมนูหลัก + ปุ่ม 🔁 หน้าผู้คน · ขอเทรดได้ทางเดียว = แตะตัวผู้เล่นที่อยู่ใกล้ → 🤝 ขอเทรด
//   (เซิร์ฟเวอร์ market.js ตรวจซ้ำ: ฉากเดียวกัน ห่างไม่เกิน 220px)
try{
try{const i=PM7.findIndex(m=>m[1]==='เทรด');if(i>=0){PM7.splice(i,1);pmRender7()}}catch(e){}
try{const st=document.createElement('style');st.textContent='#ppl72 .tr130b{display:none!important}';document.head.appendChild(st)}catch(e){}
{const _r=window.trReq130;window.trReq130=function(name){try{if(!name)return;let o=null;for(const x of NET.others.values())if(x.name===name){o=x;break}
  if(!o||Math.hypot(o.x-P.x,o.y-P.y)>200){say('🤝 ต้องอยู่ใกล้กันถึงจะเทรดได้ — นัดเจอกันแล้วแตะตัวเพื่อน → 🤝 ขอเทรด');sfx('thud');return}}catch(e){}return _r.apply(this,arguments)}}
}catch(e){console.warn('fix141',e)}
