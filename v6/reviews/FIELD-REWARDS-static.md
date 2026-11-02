# FIELD-REWARDS — ตรวจอ่านอิสระเท่านั้น (2026-11-03)
ผู้ตรวจ /root/validate_skill · ไม่แก้ไฟล์ ไม่รันNode/syntax/unit/browser/gameตามคำสั่งเจ้าของ

ขอบเขต field-loot/story/story-rewards/field-combat/field-training/slime-ai/prologue และdata combat/items/UI prologue

รอบแรกพบP2ของค้างหลังครบ8แล้วdisconnect: combat.openตรวจreadyก่อนกู้journal ทำให้กลับมาเก็บไม่ได้ แก้ด้วยrecoverจากprologue.startโดยไม่ผูกchapter/สิทธิ์เริ่มcombat ผู้ตรวจอ่านซ้ำยืนยันว่าเส้นทางนี้แก้แล้ว
รอบถัดมาพบP2กระเป๋า/น้ำหนัก/เงินเต็มทำให้collectAll/recoverthrowแล้วhall/startติด แก้takeเก็บทีละชิ้น รับเหรียญแยก คงuntaken คืน{profile,error}; hall/startเข้าถึงได้แม้ค้าง ห้ามเริ่มสนามใหม่ทับjournalที่ไม่ว่าง ผู้ตรวจอ่านซ้ำปิดP2ในระดับstatic ไม่พบAPI mismatchเพิ่ม

ไม่พบข้อเพิ่มเรื่องXP+หลักฐานฆ่าในtransactionเดียว การเก็บrollเดิมระหว่างretry และการรับของผ่านjournalจากการอ่าน การยืนยันนี้ไม่ใช่ผลทดสอบstoragefailure/session/วงจรเกม/ภาพมือถือ

ยังไม่รันเทสและไม่deploy/รวมmain previewคงPOTION-HP code6e020f94729d397912efd3625fa07763bdb75f00 งานใหม่รวมCOMBO-3/EQUIP-SWORD/FIELD-REWARDSต้องตรวจร่วมก่อนเปิดให้เล่น
