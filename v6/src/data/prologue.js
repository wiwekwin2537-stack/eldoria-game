/* โหมดทดสอบบทนำเท่านั้น · จุดเกิดปกติยังเป็นเมืองเดิม
   พระราชา: 031-core:3566 + enterShop 022:46 = (256+OX,114), OX=(26−16)×32/2=160
   shopNear 022:58 ระยะ118px และ y>116 · ภาพเดิม v5874×4 ช่อง96×128 */
export const PROLOGUE = {
  scene: 'shop.hall', spawn: [13, 13.4, 'u'],
  king: { x:416, y:114, range:118, minY:116, src:'v6/assets/npc/king-v587.png', cell:[96,128], size:[36,48] },
  syncMs:120, traceMax:24, creditMs:1000, initialCredit:8, proofMs:30000,
};
/* ลานทดสอบแยกบนพื้นทุ่งเดิม มีAI/สวนกลับ ยังไม่มีดรอป ไม่ใช่จุดเกิดโลกจริง */
export const TRAINING = { radius:96, mobOffset:40, spawnY:72, inputLeaseMs:250 };

/* จังหวะsimulationของลานฝึกใหม่ ไม่ใช่ค่าดุลเศรษฐกิจ */
export const TRAINING_CLOCK = { stepMs:20, maxSteps:10 };
