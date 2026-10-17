// fix45 (v4.50) — ป้ายเวอร์ชันมุมขวาล่างหน้าแรกเดิมเขียนตายตัว 'v4.42' → ดึงเลขจริงจาก <title> ทุกครั้ง (ไม่ต้องแก้มืออีก)
try{const VER45=(document.title.match(/v[\d.]+/)||[''])[0];window.GAME_VER=VER45;
 const fixVer45=()=>{try{const v=titleEl&&titleEl.querySelector('.ver');if(v&&VER45&&v.textContent.indexOf(VER45)<0)v.textContent=VER45+' · ออนไลน์'}catch(e){}};
 fixVer45();setInterval(()=>{if(!titleEl.hidden)fixVer45()},500)}catch(e){console.warn('fix45',e)}
