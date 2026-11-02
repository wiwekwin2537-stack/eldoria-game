// fix22.js (v4.30) — แก้บัค: เมนูหลักยาวเกินจอแนวนอน กด "ตั้งค่า"/ปุ่มแถวล่างไม่ได้ → เลื่อนได้ + จัดเป็น 8 คอลัมน์บนจอเตี้ย
// =====================================================================
{const st=document.createElement('style');st.textContent='#pm7{max-height:calc(100dvh - 72px - var(--st,0px));max-height:calc(100vh - 72px - var(--st,0px));overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y}'
 +'@media (max-height:520px){#pm7{grid-template-columns:repeat(8,52px)!important;gap:5px;padding:6px;top:calc(56px + var(--st,0px))}#pm7 button{width:52px!important;height:50px!important;font-size:18px!important}#pm7 button small{font-size:9px}}'
 +'@media (max-height:330px){#pm7{grid-template-columns:repeat(11,48px)!important}#pm7 button{width:48px!important;height:46px!important;font-size:16px!important}}';document.head.appendChild(st)}

// =====================================================================
