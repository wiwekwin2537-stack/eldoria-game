/* v5.92 รีเซ็ตไอดีทั้งหมด (เจ้าของสั่ง 2026-10-25 "ลบหมดเลย"): เซิร์ฟเวอร์ย้ายที่เก็บเป็น eld4: (ไอดี/เซฟ/อันดับ/กิลด์/ตลาด/PvP เริ่มใหม่)
   เกมเก็บเซฟสำรองในเบราว์เซอร์ผู้เล่น ถ้าไม่ล้าง ตอนล็อกอินจะสมัครไอดีเดิมบนเซิร์ฟเวอร์ใหม่แล้วอัปเซฟเก่าขึ้นไป (031-core accLogin) → ไอดีเก่ากลับมา
   → ล้าง localStorage/sessionStorage ของเกม 1 ครั้งต่อเครื่อง ก่อน 004-core ห่อ localStorage · ไม่ล้างตอนเปิดในเครื่อง (localhost เทส) เว้นแต่ ?epochtest=1 */
(function(){try{const EP='eld4',K='eldoria_data_epoch',local=location.protocol==='file:'||/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
 if(local&&!/[?&]epochtest=1/.test(location.search))return;const ls=window.localStorage;if(!ls||ls.getItem(K)===EP)return;
 ls.clear();try{window.sessionStorage.clear()}catch(e){}ls.setItem(K,EP);window.ELD_EPOCH_WIPED=EP}catch(e){}})();
