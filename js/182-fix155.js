// fix155 (v5.09) — 📦 คลังเก็บของบนมือถือ: ปุ่มถอน/ฝากใหญ่บังช่องของ เห็นแค่แถวเดียว กดถอนไม่ได้ (ผู้เล่นแจ้ง 2026-10-17 · แคปจอ)
//  ต้นเหตุ: จอแนวนอนมือถือสูง ~400px · หัว+แถบจำนวน+ปุ่มใหญ่+หมายเหตุ กินพื้นที่ · กล่องช่องของ (.v8g) ไม่มี min-height:0 จึงหดไม่เลื่อน
//  แก้: เฉพาะหน้าต่างคลัง (#vlt8) เฉพาะจอเตี้ย — ปุ่ม/ตัวหนังสือเล็กลง · ช่องของเลื่อนขึ้นลงได้ · ไม่แตะระบบฝาก-ถอน
try{const st=document.createElement('style');st.textContent='@media (max-height:560px){'
 +'#vlt8 .w{height:96%!important;max-height:96%!important;display:flex;flex-direction:column}'
 +'#vlt8 .hd{padding:3px 8px!important;font-size:12px!important}#vlt8 .hd b{font-size:12px!important}'
 +'#vlt8 .v19bar{padding:3px 6px 0!important;gap:3px!important;font-size:10px!important}#vlt8 .v19bar button{padding:2px 6px!important;font-size:10px!important}#vlt8 .v19bar input{width:70px!important;padding:2px 4px!important;font-size:10px!important}'
 +'#vlt8 .bd.v8{flex:1;min-height:0;padding:4px!important;gap:4px!important}#vlt8 .v8p{min-height:0;padding:4px!important}'
 +'#vlt8 .v8t{font-size:10px!important;margin-bottom:2px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
 +'#vlt8 .v8g{min-height:0;grid-template-columns:repeat(auto-fill,minmax(36px,1fr))!important;gap:3px!important}'
 +'#vlt8 .v8p>small{display:none}#vlt8 .v19row{margin-top:3px!important;gap:3px!important}'
 +'#vlt8 .v8p .bt{flex:none!important;height:auto!important;padding:4px!important;font-size:11px!important;min-height:0!important;line-height:1.2!important;margin-top:3px!important}#vlt8 .v19row .bt{flex:1 1 0!important}'
 +'#vlt8 .v8g{flex:1 1 auto!important;min-height:76px!important}#vlt8 .v8p>div:not(.v8g):not(.v8t):not(.v19row){font-size:9px!important;line-height:1.25!important;margin:0!important}}';
document.head.appendChild(st)}catch(e){console.warn('fix155',e)}
