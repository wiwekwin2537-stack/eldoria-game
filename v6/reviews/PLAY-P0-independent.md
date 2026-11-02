# PLAY-P0 — ตรวจอิสระ 2026-11-02

ผู้ตรวจ: /root/validate_skill ผู้ไม่ได้เขียนimplementation ตรวจread-only ไม่แก้ไฟล์

รอบแรกพบ P2: startตอบล้มเหลวค้างbookmarkแรก เมื่อเดินไปพื้นที่อื่นแล้วretryสำเร็จ endกลับจุดเก่า ผู้พัฒนาเพิ่มregressionให้พังก่อนแก้ (8ผ่าน1พัง) แล้วล้างbookmarkทั้งok:falseและrequest exception ไม่วาร์ปผู้เล่น และห้ามstartซ้อนขณะmodeทำงาน

รอบตรวจซ้ำ: prologue10ผ่าน0พัง รวมWebSocketจริงสมัคร/โหลด/เริ่ม/เดิน/คุย/รับรางวัล/retry ตรวจทั้งstartไม่สำเร็จและrequest exception ล้างbookmarkโดยไม่วาร์ป ย้ายไปทุ่งแล้วretry/endกลับ(160,224)ถูกต้อง ไม่พบข้อบกพร่องเพิ่มในsession/pose/claim: sessionเก่าปฏิเสธ ตรวจตำแหน่งserver รับซ้ำไม่เพิ่มของ ค่าเริ่มปิด

คำสั่ง: ELDORIA_TEST_WS_BUNDLE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/lib/utilsBundle.js node v6/tests/run.cjs prologue (จากrootrepo) ใช้WebSocket implementationจริงที่ติดตั้งมากับPlaywright

รอบแรกยังตรวจinventory15/server.story15/save17/world26/movement31ผ่าน ผู้พัฒนารันชุดเต็มล่าสุด245ผ่าน1รันไม่ได้เพราะflood testอ้างwsที่ไม่มี และมีบางรายการข้าม ไม่ถือว่าชุดเต็มผ่าน

ขอบเขตผลตรวจ: isolated prologue memory/file single-writerเท่านั้น ไม่รับรองmultiwriter/stamina/combatครบเกม ไม่ได้รันbrowserหรือรับรองภาพ/มือถือ ไม่มีภาพในเกมจริงก่อน–หลัง เทสbrowser/prologue.spec.jsเขียนแล้วแต่ยังไม่รัน
