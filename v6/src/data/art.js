/* ภาพและสีที่ตัววาดฉาก (draw/tiles.js) ใช้ — ตารางข้อมูลล้วน (CONTRACT §3 · ผลตรวจ 1A-2 L6)
   ภาพอาคาร/พื้นเมือง 1 และเมือง 2 อยู่ใน data/maps/town.js · city2.js (TOWN_FLOOR · TOWN_ART · CITY2_ART)
   ภาพยังอยู่ assets/incoming/ — ย้ายเมื่อทำงาน 1A-4 (webp) แล้วแก้พาธที่นี่ที่เดียว */

/* ภาพต้นไม้ 4 แบบ TREEART 013:30 · ป่าเลือกด้วย look.tree / look.trees */
export const TREE_SRC = {
  oak: 'assets/incoming/tree-oak-v585.png', ancient: 'assets/incoming/tree-ancient-v585.png',
  fire: 'assets/incoming/tree-fire-v585.png', spirit: 'assets/incoming/tree-spirit-v585.png',
};
/* ภาพช่องพื้น 4×4 ช่อง ช่องละ 128 px (WORLDART.tile 012-world-art) */
export const TERRAIN = { src: 'assets/incoming/terrain-v585.png', cell: 128, cols: 4 };

/* ต้นไม้: ขนาดภาพที่ scale 1 (px) · ฐานอยู่ที่ (ช่อง·T+16, ช่อง·T+28) · ต้นไม้ทุ่ง 4 ขนาด 013:84 */
export const TREE = {
  w: 80, h: 100, lift: .92, baseY: 28, jitter: 8,
  fieldScale: [.5, .7, .9, 1.1], fieldCut: [.2, .45, .78],
  forest: [.85, .35],          /* ป่าทึบ: .85 + สุ่ม×.35 */
  ore: .7,                     /* ต้นไม้ให้ตัด ('o' ในป่า) */
  fade: .4,                    /* ต้นไม้ที่อยู่หน้าและบังตัวละคร → โปร่ง (spec01 §3) */
  missing: 'rgba(30,70,30,.9)',/* ภาพยังไม่มา */
};

/* สีที่วาดด้วยโค้ด (ภาพยังไม่มา หรือของที่เกมเดิมวาดด้วยโค้ดอยู่แล้ว) */
export const COLORS = {
  bg: '#0b0f16',                                             /* นอกแมพ */
  terrain: { water: '#3a7ab0', sand: '#d8c890', grass: '#5a9a48' }, /* ทุ่ง ภาพยังไม่มา */
  warp: { stone: '#6a6a7a', glow: '#9ad8ff' },               /* หินวาร์ป */
  town: { stone: '#a89a86', grass: '#5a8a3e', earth: '#8a6a44', marble: '#d8d4cc' }, /* เมือง 1 ภาพยังไม่มา */
  ore: { rock: '#5a5a66', fleck: '#c8c8d8' },                 /* แร่ในเหมือง */
  liquid: ['#3a7ab0', '#2a5a8a', '#c8f0ff'],                 /* น้ำในป่า (ป่าที่ไม่มี look.liq) */
  shore: 'rgba(0,0,0,.3)',
  bridge: ['#7a5a3a', '#5a3e26'],
  cliff: 'rgba(0,0,0,.45)',
  treeShadow: 'rgba(0,0,0,.22)',
  rock: { shadow: 'rgba(0,0,0,.25)', body: '#7a7a82', light: '#9a9aa4' },
  sea: ['#2a74aa', '#22689c'],                               /* ทะเลฝั่งท่าเรือ ถนนตะวันออก */
  zone: { void: '#000', dirt: 'rgba(0,0,0,.08)', shine: 'rgba(255,255,255,.05)', topShine: 'rgba(255,255,255,.06)', drop: 'rgba(0,0,0,.35)' },
  link: { back: '230,255,240', menu: '200,160,255', door: '255,220,140' }, /* วงเวท: ทางกลับ · เมนู · ประตู (rgb) */
};
