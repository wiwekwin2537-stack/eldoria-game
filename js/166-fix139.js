// =====================================================================
// fix139 (v5.03) — เมนูหลัก 4 หมวด + ระบบค้าขายไม่ซ้ำซ้อน
//  A) เมนู 27 ปุ่มเรียงมั่ว → จัดเป็น 4 หมวดมีหัวข้อ (ตัวละคร · พัฒนา&ผจญภัย · สังคม&ค้าขาย · ระบบ) · ปุ่ม 🎮 จอย ย้ายเข้าตั้งค่า → ปุ่มควบคุม
//  B) แผงร้านในลานตลาด (ต้องยืนออนไลน์) ซ้ำกับตลาดกลาง → เปิดแผงใหม่ = ไปลงขายตลาดกลาง (ขายได้แม้ออฟไลน์) · เดินเข้าลานตลาด = เปิดกระดานตลาดกลาง
//     ของที่ค้างในแผงเดิมยังเก็บคืนได้ · บทที่ 15 นับการลงขาย/ซื้อในตลาดกลางด้วย · "ประมูล" → "ประมูลบอส" (ของจากบอสโลก)
// =====================================================================
try{
// ---------- A) เมนู ----------
const GROUPS=[['👤 ตัวละคร',['สถานะ','กระเป๋า','สกิล','พาสซีฟ','ชำนาญ','เควส','รายวัน','จดหมาย']],
 ['⚔️ พัฒนา & ผจญภัย',['แนะนำ','อัปดาว','อัญมณี','ตำนาน','PvP','ฉายา','อันดับ']],
 ['🤝 สังคม & ค้าขาย',['ตลาดกลาง','เทรด','ประมูลบอส','กิลด์','ปาร์ตี้','ผู้คน','เหรียญ/โดเนท']],
 ['⚙️ ระบบ',['คู่มือ','ตั้งค่า','เสียง','ติดตั้งเกม','ออกเกม']]];
try{const j=PM7.findIndex(m=>m[1]==='จอย');if(j>=0)PM7.splice(j,1);const a=PM7.find(m=>m[1]==='ประมูล');if(a)a[1]='ประมูลบอส'}catch(e){}
const base=l=>String(l||'').replace(/\s+\d+$/,'').replace(/^(เปิดเสียง|ปิดเสียง)$/,'เสียง');
const st=document.createElement('style');st.textContent='#pm7 .gh139{grid-column:1/-1;font:800 11px system-ui,"Noto Sans Thai",sans-serif;color:#ffd86a;letter-spacing:.3px;padding:2px 2px 0;border-bottom:1px solid rgba(232,193,74,.3);margin-top:2px}#pm7 .gh139:first-child{margin-top:0}';document.head.appendChild(st);
{const _r=pmRender7;pmRender7=function(){const r=_r.apply(this,arguments);try{const btns=[...pm7.querySelectorAll('button[data-i]')],used=new Set(),frag=document.createDocumentFragment();
  for(const [gn,L] of GROUPS){const mine=btns.filter(b=>{const m=PM7[+b.dataset.i];return m&&L.includes(base(m[1]))&&!used.has(b)}).sort((a,b)=>L.indexOf(base(PM7[+a.dataset.i][1]))-L.indexOf(base(PM7[+b.dataset.i][1])));
   if(!mine.length)continue;const h=document.createElement('div');h.className='gh139';h.textContent=gn;frag.appendChild(h);for(const b of mine){used.add(b);frag.appendChild(b)}}
  const rest=btns.filter(b=>!used.has(b));if(rest.length){const h=document.createElement('div');h.className='gh139';h.textContent='✨ อื่น ๆ';frag.appendChild(h);rest.forEach(b=>frag.appendChild(b))}
  pm7.innerHTML='';pm7.appendChild(frag)}catch(e){console.warn('pm139',e)}return r};window.pmRender7=pmRender7}
try{pmRender7()}catch(e){}
/* จอย → ตั้งค่า > ปุ่มควบคุม */
try{const sec=[...menuEl.querySelectorAll('b.sec')].find(b=>/ปุ่มควบคุม/.test(b.textContent));if(sec&&typeof open109==='function'){const b=document.createElement('button');b.className='mini';b.style.cssText='display:block;width:100%;margin:4px 0 6px;height:auto;padding:7px;font-size:13px';b.textContent='🎮 เล่นด้วยจอย (Bluetooth/USB) — ตั้งค่าจอย';b.onclick=()=>{try{toggleMenu()}catch(e){}open109()};sec.after(b)}}catch(e){}
// ---------- B) ค้าขาย ----------
const toMk=why=>{try{p6close(stW10)}catch(e){}say('🏪 '+why);try{openMk130('sell')}catch(e){}};
try{const _g=window.stallGo10;window.stallGo10=function(){toMk('แผงร้านเปลี่ยนเป็นตลาดกลางแล้ว — ลงขายที่นี่ ขายได้แม้ออฟไลน์ เงินเข้าจดหมายเอง')}}catch(e){}
try{const _a=window.stallAdd10;window.stallAdd10=function(){toMk('วางของขายที่ 🏪 ตลาดกลางได้เลย (ขายได้แม้ออฟไลน์)')}}catch(e){}
{const _e=enterMk10;enterMk10=function(){const r=_e.apply(this,arguments);setTimeout(()=>{try{if(inMk10()&&typeof openMk130==='function'){openMk130('buy');say('🏪 ลานตลาดกลาง — ซื้อขายผ่านกระดานตลาดกลาง (เปิดได้จากเมนูตัวละครทุกที่)')}}catch(e){}},1400);return r};window.enterMk10=enterMk10}
/* บทที่ 15 */
const mk15=()=>{try{if(!STORY.mk11){STORY.mk11=1;saveStory()}}catch(e){}};
{const _nm=netMsg;netMsg=function(d){try{if(d&&(d.t==='mkSellOk'||d.t==='mkPayOk'||d.t==='mkSold'))mk15()}catch(e){}return _nm.apply(this,arguments)};window.netMsg=netMsg}
try{const c=STCH.find(c=>c&&c.t&&c.t.indexOf('บทที่ 15:')===0);if(c)c.d='เปิด 🏪 ตลาดกลาง (เมนูตัวละคร หรือเดินเข้าลานตลาดประตูใต้) แล้วลงขายหรือซื้อของ 1 ครั้ง'}catch(e){}
}catch(e){console.warn('fix139',e)}
