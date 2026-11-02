# COMBO-3 — อ่านตรวจอิสระเท่านั้น 2026-11-03

ผู้ตรวจ /root/validate_skill ไม่ได้เขียนimplementation ตรวจไฟล์ด้วยการอ่าน ไม่แก้ไฟล์หรือเผยแพร่ ไม่รันNode/syntax/unit/browser/เกมตามคำสั่งเจ้าของ

## ขอบเขตและผลจากการอ่าน

data/combat.js, server/field-combat.cjs และ systems/prologue.js อ้าง031:774/809/1710/2630,070:15,017updSlimes/meleeContact ตรวจอ่านยังไม่พบข้อขัดข้องหนักหรือกลางที่ยืนยันจากการอ่าน คิวหนึ่งsequence retryไม่หักแรงซ้ำ interruptล้างคิวและสาย เวลาเริ่มท่าหลังawait ตรวจsession/encounterก่อนหักแรง รักษาLOSและhitIdsต่อท่า สไลม์spinไม่เพิ่มdamage multiplierแบบมอนโซน

ข้อสังเกตUIเรื่องqueuedErrorและการวาดarc1/2ปรับแล้ว ผู้ตรวจอ่านซ้ำยืนยันUIแสดงs.errorหรือbattle.queuedError; arc1/2เคลื่อนคนละทิศจากphase/combo และspinใช้phase×2π

ค่าแรงสุดท้ายฟัน1/หมุน1.5จาก031:2630ทับค่าเริ่ม3/5 ไม่อ้างว่ารันเทสเดิมแล้ว ต้องทบทวนassertแรงและการห้ามจองท่าของtests/server.combatเมื่อเจ้าของให้ทำเทสรอบต่อไป

## ยังไม่รับรอง

ผลruntime/เวลา/comboครบสาม/คิว/ใช้แรง/duplicate/LOS/killretry/interruptและภาพจริงยังไม่ได้ทดสอบ ผล306ผ่านของรุ่นPOTION-HPไม่ใช่ผลคอมโบนี้ เก็บในdraft branchไม่deploypreviewหรือmain
