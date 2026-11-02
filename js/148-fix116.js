// fix116 (v4.97) — 🪟 หน้าต่างทุกอันมีปุ่ม ✕ ให้เห็นเสมอ + เลื่อนขึ้นลงได้ (เจ้าของแจ้ง 2026-10-15 00:44 พร้อมรูปการ์ดไอเท็มที่ยาวจนปุ่มปิดหลุดจอ)
//  - การ์ดรายละเอียดไอเท็ม #icard: สูงไม่เกินจอ เลื่อนได้ · ปุ่ม ✕ ติดมุมขวาบนตลอด (sticky) ปุ่มใหญ่กดง่าย
//  - หน้าต่างแบบ .p6w: เนื้อหา (.bd) เลื่อนได้ · ปุ่ม ✕ บนหัวหน้าต่างใหญ่ขึ้น · ร้าน #shop เลื่อนได้
//  - หน้าต่างที่ไม่มีปุ่มปิด → เติมปุ่ม ✕ ให้อัตโนมัติ
try{
const st=document.createElement('style');st.textContent=
 '#icard{max-height:min(88vh,88%);overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}'
+'#icard>.ix,#icard .ix{position:sticky!important;top:0;float:right;margin:-6px -6px 0 6px;width:38px;height:38px;border-radius:50%;background:rgba(20,16,30,.92)!important;border:1.5px solid #e8c14a!important;color:#ffd86a!important;font-size:18px!important;font-weight:900;z-index:5;line-height:1}'
+'.p6w .bd{overflow-y:auto!important;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}'
+'.p6w{box-sizing:border-box;padding:calc(6px + var(--st,0px)) calc(6px + var(--sr,0px)) calc(6px + var(--sb,0px)) calc(6px + var(--sl,0px))}.p6w .w{box-sizing:border-box;max-width:100%;max-height:100%}.p6w .hd{flex:none;min-height:44px;box-sizing:border-box;padding:5px 8px;gap:6px}.p6w .hd b{flex:1;min-width:0;font-size:14px}.p6w .hd button{box-sizing:border-box;flex:none;height:40px;min-width:40px;min-height:40px;padding:4px 8px;font-size:15px;line-height:1.2;touch-action:manipulation}.p6w .hd button+button{margin-left:0!important}#icard .ib>button{height:auto;min-height:40px;padding:8px;font-size:13px;line-height:1.4}#icard .op111,#icard .gm117{box-sizing:border-box;clear:both;font-size:13px;line-height:1.4}#icard .op111 small,#icard .gm117 small{font-size:12px;color:#b8b4c4!important}@media(pointer:coarse),(max-height:500px){#icard{left:calc(50% + (var(--sl,0px) - var(--sr,0px))/2);top:calc(50% + (var(--st,0px) - var(--sb,0px))/2);box-sizing:border-box;width:min(440px,calc(100% - 20px - var(--sl,0px) - var(--sr,0px)));max-height:calc(100% - 16px - var(--st,0px) - var(--sb,0px));padding:10px;font-size:13px}#icard .ix{width:40px;height:40px}}'
+'.p6w .hd button[onclick*="p6close"]{min-width:40px;height:40px;min-height:40px;font-size:18px;font-weight:900;border-radius:10px;border:1.5px solid #e8c14a;background:rgba(20,16,30,.8);color:#ffd86a;margin-left:auto;flex:none}'
+'#shop{overflow-y:auto!important;overscroll-behavior:contain;touch-action:pan-y;max-height:92%!important}'
+'#shop .x116{position:sticky;top:0;align-self:flex-end;width:38px;height:34px;border-radius:9px;border:1.5px solid #e8c14a;background:rgba(20,16,30,.92);color:#ffd86a;font-size:17px;font-weight:900;z-index:5;margin-bottom:-34px}';
document.head.appendChild(st);
// เติมปุ่ม ✕ ให้หน้าต่างที่ไม่มี
setInterval(()=>{try{for(const w of document.querySelectorAll('.p6w')){if(w.hidden)continue;const hd=w.querySelector('.hd');if(hd&&!hd.querySelector('button')){const b=document.createElement('button');b.textContent='✕';b.onclick=()=>p6close(w);hd.appendChild(b)}}
 if(!shopEl.hidden&&!shopEl.querySelector('.x116,.xclose,.x')){const b=document.createElement('button');b.className='x116';b.textContent='✕';b.onclick=()=>{shopEl.hidden=true;try{if(typeof GM!=='undefined')GM.open=false}catch(e){}try{SHOPK=null}catch(e){}PAUSED=false};shopEl.insertBefore(b,shopEl.firstChild)}
 if(!icEl.hidden&&!icEl.querySelector('.ix')){const b=document.createElement('button');b.className='ix';b.textContent='✕';b.onclick=()=>icClose();icEl.insertBefore(b,icEl.firstChild)}}catch(e){}},400);
}catch(e){console.warn('fix116',e)}
