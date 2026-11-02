/* ค่าเกมเดิมที่ย้ายมาเป็นฐาน v6 ไม่ใช้ตัวคูณ XP×5 ของช่วงทดสอบ
   เพดานเงินยังใช้ COIN_MAX ที่มีอยู่ใน server/saves.cjs ไม่คัดลอกค่าอีกที่ */
export const ECONOMY = {
  stackMax: 99, /* spec04 §2 */
  bagSlots: [24, 32, 40, 56], /* 031-core:2673 (ชั้นสุดท้าย) */
  bagWeight10: [600, 900, 1300, 2000], /* 60/90/130/200 กก. */
  strCarry10: 20, endCarry10: 10, /* STR×2กก. + END×1กก. */
  maxLevel: 200,
  xpNeed: { base: 20, square: 12, threshold: 20, slope: 40 }, /* need() 030-core:7 */
  statPointsPerLevel: 3, /* 031-core:335 */
  starterKit: ['sword0', 'axe0', 'pick0'], /* giveRw 031-core:3647 */
  storyRewards: { /* STCH 031-core:3612–3620 · แพ็กครบ ห้ามข้าม kit */
    'story.0': { coin: 50, xp: 20, stacks: { hpp: 3, scroll: 2 }, starterKit: true },
    'story.1': { coin: 120, xp: 60, stacks: { mpp: 2 } },
    'story.2': { coin: 150, xp: 100, stacks: { estone: 2 } },
  },
};
