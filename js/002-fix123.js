// fix123: นาฬิกาเซิร์ฟเวอร์ (กันผู้เล่นเปลี่ยนเวลาเครื่องเพื่อรับของรายวัน/ล้างโควตา) — SRV.off ตั้งจาก /api/ping ใน fix123 ท้ายไฟล์
window.SRV={pb:null,ok:false};window.srvNow=function(){return SRV.pb!=null?performance.now()+SRV.pb:Date.now()}; // อิง performance.now() → เปลี่ยนนาฬิกาเครื่องระหว่างเล่นก็ไม่มีผล
