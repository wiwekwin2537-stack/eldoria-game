/* main — เริ่มเกม: สร้าง G → init ทุกระบบ → เริ่มลูป */
import { createState } from './core/state.js';
import { startLoop, setCapSource } from './core/loop.js';
import systems from './systems/index.js';
import { attachCanvas, fpsCap } from './core/render.js';

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const G = createState();
window.__G = G; /* สำหรับเทสในเบราว์เซอร์เท่านั้น (CONTRACT §1) */

/* จอ: ขนาด canvas ล็อกสูง 448 + ปรับเมื่อหมุน/ย่อหน้าต่าง (core/render · spec01 §3) */
attachCanvas(G, canvas);

for (const s of systems) {
  try { s.init?.(G); } catch (e) { console.error('[init]', s.id, e); }
}
setCapSource(fpsCap); /* มือถือจำกัด 30 FPS จริง ตามเป้าที่ render ใช้วัดคุณภาพ (หัวหน้า 30 ต.ค.) */
startLoop(G, systems, ctx);
