// fix116 (v4.97) — 🪟 หน้าต่างทุกอันมีปุ่ม ✕ ให้เห็นเสมอ + เลื่อนขึ้นลงได้ (เจ้าของแจ้ง 2026-10-15 00:44 พร้อมรูปการ์ดไอเท็มที่ยาวจนปุ่มปิดหลุดจอ)
//  - การ์ดรายละเอียดไอเท็ม #icard: สูงไม่เกินจอ เลื่อนได้ · ปุ่ม ✕ ติดมุมขวาบนตลอด (sticky) ปุ่มใหญ่กดง่าย
//  - หน้าต่างแบบ .p6w: เนื้อหา (.bd) เลื่อนได้ · ปุ่ม ✕ บนหัวหน้าต่างใหญ่ขึ้น · ร้าน #shop เลื่อนได้
//  - หน้าต่างที่ไม่มีปุ่มปิด → เติมปุ่ม ✕ ให้อัตโนมัติ
try{
const st=document.createElement('style');st.textContent=
 '#icard{max-height:min(88vh,88%);overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}'
+'#icard>.ix,#icard .ix{position:sticky!important;top:0;float:right;margin:-6px -6px 0 6px;width:38px;height:38px;border-radius:50%;background:rgba(20,16,30,.92)!important;border:1.5px solid #e8c14a!important;color:#ffd86a!important;font-size:18px!important;font-weight:900;z-index:5;line-height:1}'
+'.p6w .bd{overflow-y:auto!important;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}'
+'.p6w .w{max-height:96%}'
+'.p6w .hd button[onclick*="p6close"]{min-width:40px;min-height:36px;font-size:18px;font-weight:900;border-radius:10px;border:1.5px solid #e8c14a;background:rgba(20,16,30,.8);color:#ffd86a;margin-left:auto;flex:none}'
+'#shop{overflow-y:auto!important;overscroll-behavior:contain;touch-action:pan-y;max-height:92%!important}'
+'#shop .x116{position:sticky;top:0;align-self:flex-end;width:38px;height:34px;border-radius:9px;border:1.5px solid #e8c14a;background:rgba(20,16,30,.92);color:#ffd86a;font-size:17px;font-weight:900;z-index:5;margin-bottom:-34px}';
document.head.appendChild(st);
// เติมปุ่ม ✕ ให้หน้าต่างที่ไม่มี
setInterval(()=>{try{for(const w of document.querySelectorAll('.p6w')){if(w.hidden)continue;const hd=w.querySelector('.hd');if(hd&&!hd.querySelector('button')){const b=document.createElement('button');b.textContent='✕';b.onclick=()=>p6close(w);hd.appendChild(b)}}
 if(!shopEl.hidden&&!shopEl.querySelector('.x116,.xclose,.x')){const b=document.createElement('button');b.className='x116';b.textContent='✕';b.onclick=()=>{shopEl.hidden=true;try{if(typeof GM!=='undefined')GM.open=false}catch(e){}try{SHOPK=null}catch(e){}PAUSED=false};shopEl.insertBefore(b,shopEl.firstChild)}
 if(!icEl.hidden&&!icEl.querySelector('.ix')){const b=document.createElement('button');b.className='ix';b.textContent='✕';b.onclick=()=>icClose();icEl.insertBefore(b,icEl.firstChild)}}catch(e){}},400);
}catch(e){console.warn('fix116',e)}
