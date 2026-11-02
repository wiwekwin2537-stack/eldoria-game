# PLAY-E2c — ตรวจอิสระ 2026-11-02

ผู้ตรวจ /root/validate_skill ไม่ได้เขียนimplementation ตรวจread-only ไม่แก้ไฟล์หรือเขียนภายนอก

## ขอบเขต

server/slime-ai.cjs + field-combat.cjs/field-training.cjs, data/combat.js, core/prologue-client.js, systems/prologue.js และtests/slime-ai/training เทียบ017updSlimes/014hurtPlayer/playerTick/031:7191 เป็นลานทดสอบLv1stats0sword0 defaultoff memory/file single-writer ไม่รับรองโลกproduction

## ผลตรวจ

ไม่พบข้อบกพร่องที่มีผลจริงในขอบเขต ตรวจslime-ai9/9 trainingล่าสุด10/10 server.combat16/16 prologue10/10ผ่าน trainingรวมWebSocketจริงทั้งวงจรโดยใช้clockserverจำลอง

เจาะเพิ่มเติม: ตายหรือมึนก่อนจังหวะโดนยกเลิกswing มอนไม่เสียHPและไม่มีkillproofเพิ่ม ปล่อยAIผ่านcontrollerตีจนHP0ที่176tick รอต่อ10วินาทียังไม่ฟื้นเอง กลับhallและออกโหมดคืนHP73/maxHP123ตามbookmark ไม่มีHPเขียนลงprofile/character ตรวจสองintegrationใหม่ยืนยันHP0หยุดเดิน/ฟันและคืนHPเมื่อhall/หลุดผ่าน

ข้อเดิมด้านขอบลาน/session/ส่งซ้ำ/lostACK/pendingproofยังผ่าน ผู้พัฒนารันชุดเต็ม280ผ่าน1รันไม่ได้เพราะflood testอ้างwsที่ไม่มี บางรายการข้าม ไม่อ้างผ่านทั้งชุด

## ข้อจำกัด

AI/HPเดินหน้าตามคำขอที่serverจำกัดdt ไม่ใช่fixed-stepโลกต่อเนื่อง ไม่มีspawn/respawnโลก/ดรอป/XPมอน/คอมโบฟัน/อาชีพอื่น HPลานเป็นsessionชั่วคราว มีปุ่มกลับhallเมื่อล้ม ไม่อ้างระบบตายฟื้น/บทลงโทษproduction

browser/prologue.spec.jsปรับตามมอนเคลื่อนที่และลองรันไม่เริ่มเพราะChromium executableไม่มี ไม่มีผลภาพ/browser/มือถือจริง ผู้ตรวจไม่รับรองภาพหรือทัช

คำสั่งจากrootrepo: node v6/tests/run.cjs slime-ai และ ELDORIA_TEST_WS_BUNDLE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/lib/utilsBundle.js node v6/tests/run.cjs training
