/* rand — สุ่มแบบกำหนดเมล็ด + noise ใช้ร่วมกันหลายระบบ (หัวหน้าย้ายมาจาก systems/world 30 ต.ค. · คำขอ 1A-2f ตัด import วน) */
export function srand(seed) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; } /* 031:842 */
export function hash(x, y) { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); } /* 013 hash */
export function vn(x, y) { /* value noise 013 vn */
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
