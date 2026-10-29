/* state — สร้างสถานะเกม G (โครงและเจ้าของแต่ละฟิลด์: v6/CONTRACT.md §2) */
export function createState() {
  return {
    player: {
      id: null, name: '',
      x: 0, y: 0, dir: 'd', moving: false,
      dash: { t: 0, cd: 0, iframe: 0 },
      scene: null,
      hp: 100, mp: 50, maxHp: 100, maxMp: 50, sp: 100,
      lv: 1, xp: 0,
      coin: 0, /* อ่านอย่างเดียว — เซิร์ฟเวอร์เปลี่ยน (DECISIONS 2026-10-30) */
    },
    scene: null,
    cam: { x: 0, y: 0, zoom: 1 },
    input: { mx: 0, my: 0, pressed: new Set(), held: new Set(), click: null },
    time: { now: 0, dt: 0, frame: 0 },
    net: { online: false },
    ui: { open: new Set() },
  };
}
