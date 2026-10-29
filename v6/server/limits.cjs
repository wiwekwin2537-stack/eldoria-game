/* limits — ตัวนับจำกัดอัตรา + งบคำสั่งที่เก็บ (ผลตรวจ 1B H2/M2/L1 · 1B-f)
   - counter : นับครั้งต่อช่วงเวลาแยกตามคีย์ (IP/บัญชี/ซ็อกเก็ต) · ลบคีย์หมดอายุเอง · จำนวนคีย์มีเพดาน (หน่วยความจำไม่โต)
   - budgetStore : ห่อที่เก็บ ให้ทั้ง v6 ใช้คำสั่ง get/set/create ได้ไม่เกิน X/นาที และ Y/วัน
     (Upstash เป็นฐานเดียวกับเกมเดิม → ถ้ามีคนยิง /v6ws โควตาเกมเดิมต้องไม่หมด) · เกินงบ → โยน error code 'busy'
   - ipKey : คีย์ของ IP สำหรับจำกัด (IPv6 ใช้ /64 — ผู้เล่นหนึ่งคนมักได้ทั้งบล็อก /64 เปลี่ยนเลขท้ายได้ฟรี) */

function counter({ max, ms, now = () => Date.now(), cap = 20000 }) {
  const m = new Map(); /* key → { n, t } */
  function sweep() { const t = now(); for (const [k, e] of m) if (t - e.t >= ms) m.delete(k); }
  /* นับ 1 ครั้ง → true = ยังไม่เกิน */
  function hit(key, n = 1) {
    const t = now();
    let e = m.get(key);
    if (e && t - e.t >= ms) { m.delete(key); e = null; }
    if (!e) {
      if (m.size >= cap) sweep();
      if (m.size >= cap) return false; /* คีย์เต็มแม้ล้างแล้ว = มีคนยิงจากหลายที่มาก → ปฏิเสธคีย์ใหม่ (หน่วยความจำไม่โต) */
      e = { n: 0, t }; m.set(key, e);
    }
    e.n += n;
    return e.n <= max;
  }
  return { hit, sweep, size: () => m.size, _map: m };
}

/* งบคำสั่งที่เก็บ: ทุก get/set/create นับ 1 */
function budgetStore(store, { perMin = 120, perDay = 4000, now = () => Date.now(), log = () => {} } = {}) {
  let minT = 0, minN = 0, dayT = 0, dayN = 0, warned = 0;
  const used = { total: 0, refused: 0 };
  function take() {
    const t = now();
    if (t - minT >= 60000) { minT = t; minN = 0; }
    if (t - dayT >= 864e5) { dayT = t; dayN = 0; }
    if (minN >= perMin || dayN >= perDay) {
      used.refused++;
      if (t - warned > 60000) { warned = t; log(`[v6] งบคำสั่งที่เก็บเต็ม (นาทีนี้ ${minN}/${perMin} · วันนี้ ${dayN}/${perDay}) — ปฏิเสธชั่วคราว กันโควตาเกมเดิม`); }
      const e = new Error('v6 store budget'); e.code = 'busy'; throw e;
    }
    minN++; dayN++; used.total++;
  }
  return {
    kind: store.kind, inner: store, used,
    async get(k) { take(); return store.get(k); },
    async set(k, v) { take(); return store.set(k, v); },
    async create(k, v) { take(); return store.create(k, v); },
    left: () => ({ min: perMin - minN, day: perDay - dayN }),
  };
}

/* ---------- IP ---------- */
function v4num(s) {
  const p = s.split('.');
  if (p.length !== 4) return null;
  let n = 0;
  for (const x of p) { if (!/^\d{1,3}$/.test(x) || +x > 255) return null; n = n * 256 + +x; }
  return n;
}
/* ขยาย IPv6 เป็น 8 กลุ่ม (ตัวเล็ก) · ผิดรูป → null */
function v6groups(s) {
  s = s.toLowerCase();
  if (!/^[0-9a-f:.]+$/.test(s) || s.split('::').length > 2) return null;
  let tail = [];
  const m4 = /:(\d+\.\d+\.\d+\.\d+)$/.exec(s);
  if (m4) { const n = v4num(m4[1]); if (n == null) return null; s = s.slice(0, -m4[1].length) + '0:0'; tail = [(n >>> 16).toString(16), (n & 0xffff).toString(16)]; }
  const [a, b] = s.split('::');
  const A = a ? a.split(':') : [], B = b != null ? (b ? b.split(':') : []) : null;
  let g;
  if (B == null) g = A; else { const fill = 8 - A.length - B.length; if (fill < 0) return null; g = [...A, ...Array(fill).fill('0'), ...B]; }
  if (g.length !== 8 || g.some(x => !/^[0-9a-f]{1,4}$/.test(x))) return null;
  g = g.map(x => parseInt(x, 16).toString(16));
  if (tail.length) { g[6] = tail[0]; g[7] = tail[1]; }
  return g;
}
/* ทำ IP ให้เป็นรูปเดียว: ตัด [ ] / พอร์ต / ::ffff: ของ IPv4 · ผิดรูป → '' */
function normIp(ip) {
  let s = String(ip || '').trim();
  if (!s) return '';
  const br = /^\[([^\]]+)\](?::\d+)?$/.exec(s); if (br) s = br[1];
  else if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(s)) s = s.replace(/:\d+$/, '');
  if (/^::ffff:\d+\.\d+\.\d+\.\d+$/i.test(s)) s = s.slice(7);
  if (v4num(s) != null) return s;
  const g = v6groups(s);
  return g ? g.join(':') : '';
}
const CIDR4 = [
  /* ภายใน/ส่วนตัว */
  '10.0.0.0/8', '127.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '100.64.0.0/10', '169.254.0.0/16', '0.0.0.0/8',
  /* Cloudflare (พร็อกซีหน้า Render) — https://www.cloudflare.com/ips-v4 */
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18',
  '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
  '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
].map(c => { const [a, b] = c.split('/'); return [v4num(a), +b]; });
/* IPv6 ภายใน + Cloudflare (https://www.cloudflare.com/ips-v6) · [กลุ่มแรก, กลุ่มที่สอง|null, บิตของกลุ่มแรกที่ต้องตรง] */
const PROXY6 = [/^0:0:0:0:0:0:0:[01]$/, /^f[cd][0-9a-f]{0,2}:/, /^fe[89ab][0-9a-f]:/,
  /^2400:cb00:/, /^2606:4700:/, /^2803:f800:/, /^2405:b500:/, /^2405:8100:/, /^2a06:98c[0-7]:/, /^2c0f:f248:/];
/* IP นี้เป็นพร็อกซีที่เชื่อถือได้ (เครือข่ายภายใน / Cloudflare) ไหม */
function isProxyIp(ip) {
  const s = normIp(ip);
  if (!s) return false;
  const n = v4num(s);
  if (n != null) return CIDR4.some(([base, bits]) => bits === 0 || (n >>> (32 - bits)) === (base >>> (32 - bits)));
  return PROXY6.some(re => re.test(s));
}
/* คีย์สำหรับนับ: IPv4 เต็ม · IPv6 แค่ /64 */
function ipKey(ip) {
  const s = normIp(ip);
  if (!s || v4num(s) != null) return s || '?';
  return s.split(':').slice(0, 4).join(':') + '::/64';
}

module.exports = { counter, budgetStore, normIp, isProxyIp, ipKey };
