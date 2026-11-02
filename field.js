// ตำนานเอลโดเรีย — โลกร่วมกัน (v5.12): ต้นไม้/แร่ ในทุ่งหญ้า + แมพเหมือง เซิร์ฟเวอร์เป็นคนตัดสิน
// · ผู้เล่นส่งแค่ "ฉันฟัน/ขุดจุดนี้" (fhit) → เซิร์ฟเวอร์ลดเลือด · คนที่ฟัน/ขุดครั้งสุดท้ายจนล้ม = เจ้าของของดรอป (by)
// · ทุกคนในฉากเดียวกันเห็นสถานะเดียวกัน (fres) · งอกใหม่นับเวลาที่เซิร์ฟเวอร์ (ไม่งอกทับตัวผู้เล่น)
// · คนเข้าฉากทีหลังขอสถานะปัจจุบันด้วย fq → ได้ fsnap
// คีย์โหนด: 't'|'o' + tx + ',' + ty  (ฉาก 'field' หรือ 'z:<เลขแมพ>')
let H = null; // { players, send }
const NODES = new Map(); // sc -> Map(key -> node)
const SC_OK = /^(field|z:\d{1,3})$/, KEY_OK = /^[to]\d{1,3},\d{1,3}$/;
const HIT_PER_SEC = 6, REACH = 190, DMG_MAX = 80, HP_MAX = 1000, IDLE_HEAL_MS = 60e3, ON_TOP = 56;
// v5.13 กันโกง: ตารางค่าจริงอยู่ที่เซิร์ฟเวอร์ (สำเนาจาก OREK ใน js/015-core.js · 046 · 055 · 074 และขนาดต้นไม้ทุ่งใน js/013-core.js) — แก้เกมต้องแก้ตารางนี้ด้วย
// kd ที่เครื่องส่งมา: ต้นไม้ทุ่ง = 't_tiny|t_small|t_medium|t_large' · แร่/ต้นไม้ประจำแมพ = ชื่อ kind ใน OREK  →  hp/ชั้นเครื่องมือที่ต้องใช้/ขวานหรือที่ขุด มาจากตารางนี้ ไม่เชื่อเครื่อง
const KIND = {
  t_tiny: { hp: 2, req: 0, axe: 1 }, t_small: { hp: 3, req: 0, axe: 1 }, t_medium: { hp: 5, req: 0, axe: 1 }, t_large: { hp: 8, req: 0, axe: 1 },
  stone: { hp: 6, req: 0 }, iron: { hp: 7, req: 0 }, copper: { hp: 8, req: 1 }, silver: { hp: 10, req: 2 }, gold: { hp: 12, req: 3 }, diamond: { hp: 14, req: 4 },
  treeN: { hp: 7, req: 0, axe: 1 }, treeE: { hp: 10, req: 1, axe: 1 }, treeF: { hp: 13, req: 2, axe: 1 }, treeS: { hp: 16, req: 3, axe: 1 }, treeH: { hp: 20, req: 4, axe: 1 }, treeG: { hp: 24, req: 5, axe: 1 },
};
const ENH_TOOL_MAX = 6; // ตีบวกสูงสุด +20 (js/099-fix67.js) → enhTool7 = floor(20/3) = 6
const toolDmgMax = tier => Math.min(DMG_MAX, 1 + ((tier | 0) >> 1) + ENH_TOOL_MAX); // สูตรเดียวกับ AXEDMG/PICKDMG ใน js/015-core.js
const regenSec = (sc, axe) => sc === 'field' ? (axe ? 120 : 90) : (axe ? 75 : 60); // วินาทีงอกใหม่ (ตรงกับที่เกมส่งมาเดิม: ต้นไม้ทุ่ง 120 · แร่ทุ่ง 90 · ต้นไม้แมพ 75 · แร่แมพ 60)
const REQUIRE_KIND = !!process.env.FIELD_REQUIRE_KIND; // =1 → ปฏิเสธ fhit ที่ไม่มี kd (เกมรุ่นเก่า) · ค่าเริ่มต้น: ยอมรับแบบเดิมเพื่อไม่ให้รุ่นเก่าค้าง
const num = (v, a, b) => { v = +v; return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : a; };
function init(h) { H = h; const iv = setInterval(tick, 1000); if (iv.unref) iv.unref(); }
const res = (sc, key, n, rs) => ({ t: 'fres', sc, key, hp: n.dead ? 0 : Math.max(0, Math.round(n.hp)), max: n.max, dead: n.dead ? 1 : 0, by: n.by || 0, bn: n.bn || '', left: n.dead ? Math.max(0, n.rs - Date.now()) : 0, rs: rs ? 1 : 0 });
function bc(sc, msg) { const s = JSON.stringify(msg); for (const p of H.players.values()) if (p.joined && p.sc === sc && p.ws.readyState === 1) p.ws.send(s); }
function snapshot(sc) { const m = NODES.get(sc), list = [], now = Date.now(); if (m) for (const [key, n] of m) list.push({ key, hp: n.dead ? 0 : Math.round(n.hp), max: n.max, dead: n.dead ? 1 : 0, left: n.dead ? Math.max(0, n.rs - now) : 0, by: n.by || 0, bn: n.bn || '' }); return { t: 'fsnap', sc, list }; }
function onMsg(p, d, now) {
  if (d.t === 'fq') { if (!p.joined) return true; const sc = String(d.sc || ''); if (!SC_OK.test(sc)) return true; H.send(p, snapshot(sc)); return true; }
  if (d.t !== 'fhit') return false;
  if (!p.joined || !p.st || p.st.dead) return true;
  const sc = String(d.sc || ''), key = String(d.key || '');
  if (!SC_OK.test(sc) || !KEY_OK.test(key) || p.sc !== sc) return true;
  if (now - (p.fhT || 0) > 1000) { p.fhT = now; p.fhN = 0; } if (++p.fhN > HIT_PER_SEC) return true; // กันยิงถี่เกินคน
  const x = num(d.x, -1e4, 1e5), y = num(d.y, -1e4, 1e5);
  if (Math.hypot(p.st.x - x, p.st.y - y) > REACH) return true; // ต้องอยู่ใกล้จุดจริง
  let m = NODES.get(sc); let n = m && m.get(key);
  const K = typeof d.kd === 'string' && Object.prototype.hasOwnProperty.call(KIND, d.kd) ? KIND[d.kd] : null; // ชนิดโหนดที่เครื่องอ้าง
  if (d.kd != null && !K) return true; // ส่ง kd มาแต่ไม่มีในตาราง → ไม่รับ (ไม่ส่งเลย = เกมรุ่นเก่า)
  if (K && (key[0] === 't') !== d.kd.startsWith('t_')) return true; // คีย์ต้นไม้ทุ่ง (t…) ต้องคู่กับ kd แบบ t_… เท่านั้น
  if (!K && REQUIRE_KIND) return true;
  const kk = n && n.kd ? KIND[n.kd] : K; // โหนดที่มีอยู่แล้วใช้ชนิดที่เซิร์ฟเวอร์จำไว้ ไม่ใช่ที่เครื่องอ้างรอบนี้
  let cap = DMG_MAX;
  if (kk) { // ตรวจเครื่องมือก่อนสร้าง/แตะโหนด: ชั้นต้องถึง · ดาเมจไม่เกินสูตรของเครื่องมือชั้นนั้น (ใช้ชั้นที่เครื่องรายงานใน st)
    const tier = (p.st.tier && p.st.tier[kk.axe ? 'axe' : 'pick']) | 0;
    if (tier < kk.req) return true;
    cap = toolDmgMax(tier);
  }
  if (!m) NODES.set(sc, m = new Map());
  if (!n) {
    if (K) n = { hp: K.hp, max: K.hp, dead: 0, rs: 0, by: 0, bn: '', x, y, t: now, rg: regenSec(sc, K.axe), kd: d.kd }; // ค่าจากตารางเซิร์ฟเวอร์ ไม่ใช่จากเครื่อง
    else { const max = Math.max(1, num(d.max, 1, HP_MAX) | 0); n = { hp: max, max, dead: 0, rs: 0, by: 0, bn: '', x, y, t: now, rg: num(d.rg, 20, 300) }; } // เกมรุ่นเก่า (ไม่ส่ง kd): ทำงานแบบเดิม
    m.set(key, n);
  }
  if (n.dead) { H.send(p, res(sc, key, n)); return true; } // มาช้า — คนอื่นล้มไปแล้ว บอกสถานะให้เครื่องนี้ตรงกัน
  n.hp -= Math.max(1, num(d.dmg == null ? d.d : d.dmg, 1, cap) | 0); n.t = now;
  if (n.hp <= 0) { n.hp = 0; n.dead = 1; n.by = p.id; n.bn = p.name; n.rs = now + n.rg * 1000 * (0.85 + Math.random() * 0.3); }
  bc(sc, Object.assign(res(sc, key, n), { hb: p.id })); return true; // hb = คนที่ตีครั้งนี้ (ให้เครื่องอื่นเล่นเสียง/สั่นตอนมีคนตีต้นเดียวกัน)
}
function tick() {
  const now = Date.now();
  for (const [sc, m] of NODES) {
    let near = null;
    for (const [key, n] of m) {
      if (n.dead) {
        if (now < n.rs) continue;
        if (near === null) { near = []; for (const p of H.players.values()) if (p.joined && p.sc === sc && p.st) near.push(p.st); }
        if (near.some(s => Math.hypot(s.x - n.x, s.y - n.y) < ON_TOP)) { n.rs = now + 3000; continue; } // มีคนยืนทับ → เลื่อน
        m.delete(key); bc(sc, res(sc, key, { hp: n.max, max: n.max, dead: 0 }, 1));
      } else if (now - n.t > IDLE_HEAL_MS) { m.delete(key); bc(sc, res(sc, key, { hp: n.max, max: n.max, dead: 0 }, 1)); } // เลือดที่ฟันค้างไว้ฟื้นเต็มเมื่อไม่มีใครแตะ 60 วิ
    }
    if (!m.size) NODES.delete(sc);
  }
}
function onClose(p) {}
module.exports = { init, onMsg, onClose, tick, NODES, snapshot, KIND };
