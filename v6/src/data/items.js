/* ทะเบียนชุดแรกของ v6 เท่านั้น ไม่ใช่ทะเบียนครบทั้งเกม
   น้ำหนักหน่วย 0.1 กก. จาก js/015-core:226–228 และ 031-core:2290 · ชื่อเซ็ต fix12
   ไม่รู้จักไอเท็ม = หยุด ห้ามเดาน้ำหนักเป็น0 · อุปกรณ์ทุกชิ้นมี UID ตาม DECISIONS */
export const ITEMS = {
  hpp: { name: 'ยาเลือด', type: 'stack', weight10: 4 },
  mpp: { name: 'ยามานา', type: 'stack', weight10: 4 },
  scroll: { name: 'ม้วนวาร์ป', type: 'stack', weight10: 1 },
  estone: { name: 'หินตีบวก', type: 'stack', weight10: 3 },
  sword0: { name: 'ดาบนักล่าเงา', type: 'gear', kind: 'sword', tier: 0, slot: 'sword', level: 1, weight10: 26 },
  axe0: { name: 'ขวานหินธรรมดา', type: 'gear', kind: 'axe', tier: 0, slot: null, level: 1, weight10: 31 },
  pick0: { name: 'ที่ขุดแร่หินธรรมดา', type: 'gear', kind: 'pick', tier: 0, slot: null, level: 1, weight10: 31 },
  sword1: { name: 'ดาบพฤกษาโบราณ', type: 'gear', kind: 'sword', tier: 1, slot: 'sword', level: 5, weight10: 22 },
};
