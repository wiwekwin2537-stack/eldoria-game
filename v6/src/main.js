/* main — เริ่มเกม: สร้าง G → init ทุกระบบ → เริ่มลูป */
import { createState } from './core/state.js';
import { startLoop } from './core/loop.js';
import systems from './systems/index.js';

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const G = createState();
window.__G = G; /* สำหรับเทสในเบราว์เซอร์เท่านั้น (CONTRACT §1) */

function fit() {
  /* ชั่วคราว — core/camera (ใบงาน 1A-1) จะคุมขนาดจอ VIEW_H ตามสเปก */
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener('resize', fit);
fit();

for (const s of systems) {
  try { s.init?.(G); } catch (e) { console.error('[init]', s.id, e); }
}
startLoop(G, systems, ctx);
