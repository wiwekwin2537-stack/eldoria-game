# PLAY-E2d — ตรวจอิสระ 2026-11-02

ผู้ตรวจ /root/validate_skill ไม่ได้เขียนimplementation ตรวจread-only ไม่แก้ไฟล์หรือเขียนภายนอก

## ขอบเขต

fixed-step.cjs/data prologue clock, field-training/combat, prologue/index lifecycle และ fixed-step.test.js เป็นtimerเฉพาะลานส่วนตัว memory/file single-writer ไม่ใช่shared-worldหรือproduction ระบบภาพไม่ได้เปลี่ยนและเจ้าของให้รวบตรวจหน้าจอก่อนเปิดทดสอบ

## พบและแก้

1. P2 swing.startเก่าหลังawaitภายในcombat.attack: หน่วงclaim1วิได้start101400แต่now102400 แล้วท่าหมดทันที ผู้พัฒนาเพิ่มregressionให้พังก่อนแก้ (10ผ่าน1พัง) แก้now(conn,attack)รับเวลาสด/syncclock ณcommitหลังawaitสุดท้าย
2. P2 pumpingรวมทุกconn ทำให้Aค้างแล้วBหยุด: เพิ่มregressionสองบัญชีก่อนแก้11ผ่าน1พัง แก้WeakMap in-flightรายconn ไม่รวมงานที่ค้างเดิมในpromiseรอบใหม่ จึงไม่สะสมคิว/promisesและห้องอื่นทำต่อได้

## ตรวจซ้ำ

ปิดP2ทั้งสองข้อได้ ไม่พบข้อเพิ่ม หน่วงstorage1วิ swingเริ่ม102400และยังมีช่วงฟันหลังtickถัดไป พักบัญชีAค้างงานเพียง1งานและBเดินต่อ เรียกstopระหว่างงานค้างแล้วปล่อยงานปิดได้และคำสั่งใหม่ตอบunavailable

fixed-step12/12 training10/10ผ่าน รวมWebSocket timerจริงและsessionเดิม ชุดก่อนแก้combat16ผ่าน ข้อจำกัด: clockในintegrationบางกรณีจำลองเพื่อไม่รอเวลาจริง แต่transport/timerเป็นของจริง ไม่ตรวจbrowser/มือถือ และไม่เปลี่ยนไฟล์อื่น

คำสั่งจากrootrepo: ELDORIA_TEST_WS_BUNDLE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/lib/utilsBundle.js node v6/tests/run.cjs fixed-step

ผู้พัฒนารันชุดเต็มท้ายรอบ292ผ่าน1รันไม่ได้เพราะflood testอ้างwsที่ไม่มี บางรายการข้าม ไม่อ้างผ่านทั้งชุด
