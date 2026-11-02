# PLAY-E2b — ตรวจอิสระ 2026-11-02

ผู้ตรวจ /root/validate_skill ไม่ได้เขียนimplementation ตรวจread-only ไม่แก้ไฟล์หรือเขียนภายนอก

## ขอบเขต

server/field-training.cjs + prologue.cjs, data/prologue.js, core/prologue-client.js, systems/prologue.js/movement.js และ tests/training.test.js เป็นลานแยกสไลม์นิ่ง defaultoff ไม่มีAI/สวนกลับ/ดรอป/XPมอน ไม่รับรองcombatครบโลกหรือหลายwriter

## รอบแรก

training7/prologue10/combat16ผ่าน แต่เจาะพบP2 input.runทำให้ยืนนิ่งเสียแรง100→99.7หลัง100ms ต่างmovementเดิมที่ฟื้นแรงขณะยืนนิ่ง ผู้พัฒนาเพิ่มregressionก่อนแก้7ผ่าน1พัง แล้วผูกrunกับam>0 กลับ8ผ่าน0พัง

## ตรวจซ้ำ

ปิดP2ได้ training8ผ่าน0พัง ผู้ตรวจเจาะยืนนิ่งกดrun1วินาทีตำแหน่งคงเดิม แรง100และไม่ขึ้นสถานะวิ่ง เมื่อเดินพร้อมrun100msยังเคลื่อนที่และแรง99.7ถูกต้อง

ไม่พบข้อเพิ่มด้านsession/bookmark/late reply/claim retryในกรณีที่ตรวจ เจาะlostACKระหว่างบันทึกkillแล้วretry progressคง1ไม่เพิ่มซ้ำและไม่ค้างpending กลับhallแล้วเข้าลานใหม่รักษาprogress

คำสั่งจากrootrepo: ELDORIA_TEST_WS_BUNDLE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/lib/utilsBundle.js node v6/tests/run.cjs training

trainingรวมWebSocketจริงสมัคร/โหลด/บทนำ/fieldinput/ฟัน/ฆ่า8/กลับhall/ส่งบท1/รับซ้ำ โดยใช้clockserverจำลองและauthorityfield-trainingจริง ไม่fixtureยอดฆ่าหรือtransportจำลอง Controllerทดสอบเซฟbookmark/หยุดmovementclient/คำตอบfieldมาช้าหลังหลุด

browser/prologue.spec.jsเพิ่มวงจรถึงบท1และลองรันแล้วแต่Chromium executableไม่มี ไม่เกิดการตรวจหน้าเกมหรือภาพ ไม่มีผลมือถือหรือภาพก่อน–หลัง ผู้ตรวจไม่รับรองภาพหรือมือถือ

ผู้พัฒนารันชุดเต็มท้ายรอบ269ผ่าน1รันไม่ได้เพราะflood testอ้างwsที่ไม่มี บางรายการข้ามด้วยเหตุเดียวกัน ไม่อ้างผ่านทั้งชุด
