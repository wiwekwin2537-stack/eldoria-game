/* STORY-E2a: เฉพาะฟันดาบเริ่มต้นใส่สไลม์ทุ่ง ไม่ใช่สูตรมอนโซน
   017-core:6/20 hp=2+lv และคริ .08+AGI*.004; 031-core:774/1970 ระยะและช่วงฟัน
   015-core:12 SWATK[0]=0; 030-core:7 ATK; fix28 PRIM=str สำหรับดาบที่ยังไม่มีอาชีพ */
export const FIELD_COMBAT = {
  scene: 'field',
  slime: { minLevel:1, maxLevel:5, baseHp:2 },
  slash: { durationMs:550, hitFrom:.2, hitTo:.7, radius:34, reach:26, behind:12, stamina:3 },
  lowStamina:20, tiredDurationMul:1.3,
  damage: { base:1, sword0:0, spreadMin:.9, spreadWidth:.2, critBase:.08, critAgi:.004, critMul:1.8 },
  /* ขอบเขตความจำ session ของAPIใหม่ ไม่ใช่ค่าดุลเกม */
  maxEntities:24, maxSequence:2147483647,
};
/* 017-core updSlimes/hurtPlayer014 + ค่าสุดท้าย031-core:7191
   ขอบเขตลานLv1 stats0: DEF0/หลบ0 ไม่มีเกราะ/บัฟ/อาชีพ */
export const SLIME_AI = {
  cycle:.9, hopFrom:.3, hopTo:.7, chaseRange:170, speed:70, wanderChance:.7,
  contactRange:20, cooldown:1.2, hurtTime:.25, slashKnockback:240, recoil:140,
  decay:.02, stopImpulse:4,
};
export const TRAINING_VITALS = {
  hp:100, damage:3, levelDamage:2, comboDamage:8, comboWindow:4,
  iframe:.8, stun:.28, knockback:55, heavyKnockback:240,
  regenDelay:4.5, regen:2.2,
};
