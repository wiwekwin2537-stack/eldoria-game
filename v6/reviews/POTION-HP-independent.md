# POTION-HP — ตรวจอิสระ 2026-11-03

ผู้ตรวจ /root/validate_skill ไม่ได้เขียนimplementation ตรวจread-only ไม่แก้ไฟล์หรือเขียนภายนอก

ขอบเขต: potions.cjs/field-training/prologue, economy.hpPotion, controllerและUIbutton/H เฉพาะลานฝึก memory/file single-writer สูตร031:1775+fix82 HP30%min60/CD8วิ ไม่รวมมานา/อาหาร/HPpersistโลกจริง

ตรวจผ่าน ไม่พบข้อบกพร่องที่มีผลจริง ชุดล่าสุด14/14ผ่าน รวมcontrollerและWebSocketจริง หักยา+receiptก่อนฟื้นHP retry/lostACKไม่หักหรือฟื้นซ้ำ epochเก่าไม่ฟื้นชีวิตใหม่ cooldownคงข้ามencounter

เจาะlostACKผ่านrouteแล้วพัก5วิให้timerresolve: ฟื้นครั้งเดียว hppเหลือ2 pendingfalse sequence0/-1/NaN/3ไม่ทำห้องค้างถาวร KeyboardHแม้ส่งตอนbuttondisabledก็serverrejectโดยไม่consume

WSเทสแรกpoll20msเกินโปรโต30ข้อความ/วิจึงถูกcut ผู้พัฒนาปรับเฉพาะเวลาpollในเทสเป็น100msตามclient120msโดยไม่แก้rate limit แล้วตรวจซ้ำ14ผ่าน0พัง ไม่ใช้การปิดlimitให้เทสผ่าน

ยังไม่รับรองภาพ/mobile/browser ผลHPในลานชั่วคราว ไม่claimatomicHPpersistพร้อมinventory และไม่applyreceiptหลังepochเปลี่ยน หากออกก่อนpendingจบไม่คืนรายการยาที่commitแล้วโดยอัตโนมัติ

คำสั่งจากrootrepo: ELDORIA_TEST_WS_BUNDLE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/lib/utilsBundle.js node v6/tests/run.cjs potions

ผู้พัฒนารันชุดเต็มท้ายรอบ306ผ่าน1รันไม่ได้เพราะflood testอ้างwsที่ไม่มี บางรายการข้าม ไม่อ้างผ่านทั้งชุด
