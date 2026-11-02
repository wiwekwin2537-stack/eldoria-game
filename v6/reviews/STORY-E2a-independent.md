# STORY-E2a — ตรวจอิสระ 2026-11-02

ผู้ตรวจ /root/validate_skill ไม่ใช่ผู้เขียนimplementation ตรวจread-only ไม่แก้ไฟล์หรือเขียนภายนอก

## ขอบเขต

ข้อมูลcombat.js, server/field-combat.cjs และ tests/server.combat.test.js เทียบสไลม์017-core:20, ATK030-core:7, meleeContact031-core:1970, atkDur031-core:774 และการหักแรง1711–1715 APIภายในนี้ต้องมีauthorityตำแหน่ง/แรง/server spawn; เทสจำลองadapterเหล่านี้ ไม่ใช่WebSocketหรือbrowser ไม่รับรองการเล่นจริง

## รอบแรกและการแก้

ชุดเดิม14/14ผ่าน แต่เจาะเพิ่มพบ2P2:

1. ตั้งresolvedหลังตรวจครั้งแรก ทำให้เดินเข้าระยะภายหลังภายในhitwindowแล้วไม่โดน ผู้พัฒนาเพิ่มregressionเป้า61pxที่111msไม่โดน→ขยับ2pxที่200msต้องโดน แล้วแก้ให้ตรวจต่อและเก็บhitIdsรายมอน
2. durationใช้แรงก่อนหัก3 แรง20เหลือ17ยังเป็น550ms ผู้พัฒนาเพิ่มregressionแล้วใช้แรงหลังหักเพื่อกำหนด715ms

บันทึกred→green: ก่อนแก้14ผ่าน2พัง (HPยัง3และduration550) หลังแก้16ผ่าน0พัง

## ตรวจซ้ำ

ผู้ตรวจรัน16ผ่าน0พัง ตรวจอิสระหลายเป้าต่างtick:111ms HP[2,3]→เข้าระยะอีกเป้าที่200ms[2,2]→220msยัง[2,2] ผลโดนรวม2ครั้ง เป้าเดิมไม่โดนซ้ำ ปิดP2ข้อ1

แรงเริ่ม20–22หลังหัก3เป็น715ms; เริ่ม23เหลือ20เป็น550ms ปิดP2ข้อ2 ปฏิเสธอาชีพผ่านprofile.classId/profile.cls/character.classId/character.cls

HP2+lv, ATKดาบ0/stats0, spread/critและรูปทรงระยะตรงแหล่งอ้าง ไม่พบข้อเพิ่มด้านคิว/session/retry lostACK/pendingproofในกรณีที่ตรวจ ไม่รับรองauthorityadapterที่ยังไม่ได้ต่อ, หลายwriter, AI, คอมโบ, มอนสวน, ดรอป/XPมอน, route/UIหรือมือถือ

คำสั่งจากrootrepo: node v6/tests/run.cjs server.combat
