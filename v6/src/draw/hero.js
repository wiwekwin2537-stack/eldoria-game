/* hero — วาดตัวละครผู้เล่นด้วยโค้ด (spec01 §7 · กติกาภาพ: ตัวละครห้ามใช้ภาพ)
   ตัววาดเดียว แทน hero 53 ชั้น + heroBody 12 ชั้นของเกมเดิม · "ไม่แก้ค่าผู้เล่น" — รับภาพรวม (view) เป็นข้อมูล
   heroView(G) สร้าง view จาก G (อ่านอย่างเดียว) → drawHero(ctx, view) วาด (ctx อยู่ในพิกัดโลก ชั้น 'world' ผ่าน zpush)
   หน้าตาย้ายจาก: heroBody 018:11 · sideLegs 031:743 · hero (เอนตัว) 031:761 · hairOv8 031:7070 · EQCOL+LOOKDEF8 015:32/031:7062
                  dashStreaks/drawGhosts 018 · ว่ายน้ำ 038-fix7:83 · ดาบ sword() 018:2
   ยังไม่ทำ (รอเฟสที่มีข้อมูล): ชุดเกราะ/หมวก/สร้อย/แหวน (เฟส 4) · ออร่าตีบวก/ชุด (เฟส 4) · ท่าโจมตี/สกิล (เฟส 2–3)
                  สัตว์ขี่/ปีก/แฟชั่น (เฟส 5) · ฝุ่นเท้า (ระบบ fx) */
import { DASH, HERO } from '../data/movement.js';

/* สีเข้ม/อ่อนลง (shade8 031) */
export function shade(h, a) {
  const n = parseInt(String(h).slice(1), 16);
  if (!Number.isFinite(n)) return h;
  const c = v => Math.max(0, Math.min(255, v + a));
  return '#' + ((1 << 24) + (c(n >> 16) << 16) + (c((n >> 8) & 255) << 8) + c(n & 255)).toString(16).slice(1);
}

/* สีชุดจากหน้าตา (EQCOL ไม่ใส่เกราะ) */
export function colors(look = HERO.look) {
  const L = { ...HERO.look, ...look };
  return {
    TOP: L.top, COLLAR: shade(L.top, HERO.collarShade),
    LGA: L.pants, LGB: shade(L.pants, HERO.legShade),
    HAIR: L.hair || HERO.hairDefault, fem: L.g === 'f',
  };
}

/* ภาพรวมตัวละคร — อ่านจาก G อย่างเดียว (คัดลอกค่า ไม่อ้างอิงอ็อบเจกต์ของผู้เล่น) */
export function heroView(G) {
  const P = G.player, D = P.dash || {}, A = P.anim || {};
  return {
    x: P.x, y: P.y, dir: P.dir || 'd', moving: !!P.moving, run: !!A.run, t: A.t || 0,
    now: (G.time && G.time.now) || 0,
    dash: D.t > 0 ? { t: D.t, dv: [...(D.dv || [0, 1])] } : null,
    swim: !!A.swim,
    trail: (A.trail || []).map(g => ({ x: g.x, y: g.y, dir: g.dir, l: g.l })),
    look: { ...HERO.look, ...(P.look || {}) },
    weapon: P.weapon !== undefined ? P.weapon : HERO.weapon, /* { kind:'sword', drawn:true } | null */
    name: P.name || '', lv: P.lv || 1,
  };
}

/* ดาบ (sword() 018:2) — ตัวแทนอาวุธในมือจนกว่าเฟส 4 จะมีหน้าตาอาวุธจริง */
function sword(k, hx, hy, ang) {
  k.save(); k.translate(hx, hy); k.rotate(ang); k.translate(0, -4);
  k.shadowColor = '#2f8bff'; k.shadowBlur = 10;
  k.fillStyle = '#1b1d29'; k.fillRect(-2.5, -30, 5, 28);
  k.beginPath(); k.moveTo(-2.5, -30); k.lineTo(0, -37); k.lineTo(2.5, -30); k.fill();
  k.fillStyle = '#8fc6ff'; k.fillRect(-.8, -30, 1.6, 27);
  k.fillStyle = '#6d7280'; k.fillRect(-7, -3, 14, 3);
  k.fillStyle = '#0e0e14'; k.fillRect(-1.5, 0, 3, 8);
  k.fillStyle = '#5db0ff'; k.fillRect(-2, 8, 4, 4);
  k.restore();
}
const WEAPONS = { sword };

/* ตัว (heroBody 018:11 · ไม่ใส่เกราะ) · b = { x, y, dir, moving, run, t, now, dp (ท่าพุ่ง), look, weapon } */
function body(k, b) {
  const E = colors(b.look), SK = HERO.skin, run = b.run;
  const s = b.moving ? Math.sin(b.t) : 0;
  const bob = b.moving ? Math.abs(Math.cos(b.t)) * (run ? 2.5 : 1.5) : (Math.sin(b.now * 1000 / 420) * .5 + .5) * 1.2;
  const x = Math.round(b.x), y = Math.round(b.y), d = b.dir, side = d === 'l' || d === 'r', f = d === 'l' ? -1 : 1, by = Math.round(y - bob);
  const R = (c, a, bb, w, h) => { k.fillStyle = c; k.fillRect(Math.round(a), Math.round(bb), w, h); };
  const tilt = run ? .35 : 0, DP = b.dp;
  const W = b.weapon && b.weapon.drawn !== false && WEAPONS[b.weapon.kind];
  const held = (hx, hy, ang) => { if (W) W(k, hx, hy, ang); R(SK, hx - 3, hy - 2, 6, 4); };
  const leg = (hx, hy, ang, col, h) => { k.save(); k.translate(hx, hy); k.rotate(ang); R(col, 0, 0, 6, h); k.restore(); };

  k.fillStyle = HERO.shadow; k.beginPath(); k.ellipse(x, y + 1, 11, 4, 0, 0, 7); k.fill();
  if (DP) { k.save(); k.translate(x, y); if (side) k.rotate(f * .42); else k.scale(1, .9); k.translate(-x, -y); }

  if (side) { /* มองข้าง: ขาและแขนแกว่งหน้า-หลัง */
    if (DP) { leg(x - 3, by - 12, f * .95, E.LGB, 13); leg(x - 3, by - 12, -f * .7, E.LGA, 12); }
    else { /* sideLegs 031:743 — ต้นขา+หน้าแข้ง งอเข่าตอนยกเท้า */
      const ph = b.t, amp = run ? .75 : .5;
      const one = (o, col) => {
        const a = Math.sin(ph + o) * amp, lift = Math.max(0, Math.cos(ph + o)), knee = lift * (run ? 1.1 : .7);
        k.save(); k.translate(x, by - 12); k.rotate(-a * f);
        k.fillStyle = col; k.fillRect(-3, 0, 6, 7);
        k.translate(0, 6); k.rotate(knee * f);
        k.fillStyle = col; k.fillRect(-3, 0, 6, 6); k.fillStyle = HERO.boot; k.fillRect(-3 + (f > 0 ? 0 : -2), 4, 8, 3);
        k.restore();
      };
      one(Math.PI, E.LGB); one(0, E.LGA);
    }
    R(E.TOP, x - 4.5, by - 26, 9, 14); R(E.COLLAR, x - 5, by - 28, 10, 4);
    R(SK, x - 6, by - 40, 12, 12); R(HERO.hairDefault, x - 7, by - 43, 14, 7); R(HERO.hairDefault, x - 7 + (f < 0 ? 6 : 0), by - 43, 8, 13);
    R(HERO.hairDefault, x - 6, by - 48, 4, 6); R(HERO.hairDefault, x - 1, by - 49, 4, 7); R(HERO.hairDefault, x + 3, by - 47, 4, 5);
    R(HERO.eye, x + 3 * f - 1, by - 36, 2, 3);
    let hnd;
    if (DP) { k.save(); k.translate(x - 3, by - 25); k.rotate(f * 1.15); R(E.TOP, 0, 0, 6, 12); R(SK, 0, 9, 6, 4); k.restore(); }
    else { /* แขนมีข้อศอก (v5.79) */
      const ph = s * (run ? .7 : .5), t1 = -ph * f, t2 = t1 - f * (.3 + Math.max(0, ph) * (run ? 1.1 : .8));
      const ex = x - 6 * Math.sin(t1), ey = by - 26 + 6 * Math.cos(t1);
      hnd = [ex - 7 * Math.sin(t2), ey + 7 * Math.cos(t2)];
      k.save(); k.translate(x, by - 26); k.rotate(t1); R(E.TOP, -3, 0, 6, 7); k.translate(0, 6); k.rotate(t2 - t1); R(E.TOP, -3, 0, 6, 7); R(SK, -3, 5, 6, 4); k.restore();
    }
    if (DP) held(x - f * 10, by - 19, -f * 1.35); else held(hnd[0], hnd[1], f * (.9 - tilt));
  } else { /* มองหน้า/หลัง */
    const l1 = DP ? 7 : Math.max(0, s) * (run ? 5 : 3.5), l2 = DP ? 0 : Math.max(0, -s) * (run ? 5 : 3.5);
    R(E.LGA, x - 7, by - 12 - l1, 6, 12); R(E.LGA, x + 1, by - 12 - l2, 6, 12);
    R(E.TOP, x - 8, by - 26, 16, 14); R(E.COLLAR, x - 8, by - 28, 16, 4);
    if (DP) { k.save(); k.translate(x - 8, by - 25); k.rotate(.95); R(E.TOP, -6, 0, 6, 12); R(SK, -6, 9, 6, 4); k.restore(); }
    else { R(E.TOP, x - 14, by - 26 + s * 3, 6, 12); R(SK, x - 14, by - 15 + s * 3, 6, 4); }
    if (DP) { k.save(); k.translate(x + 8, by - 25); k.rotate(-.95); R(E.TOP, 0, 0, 6, 12); R(SK, 0, 9, 6, 4); k.restore(); }
    else { R(E.TOP, x + 8, by - 26 - s * 3, 6, 12); R(SK, x + 8, by - 15 - s * 3, 6, 4); }
    R(SK, x - 6, by - 40, 12, 12); R(HERO.hairDefault, x - 7, by - 43, 14, d === 'u' ? 15 : 6);
    R(HERO.hairDefault, x - 7, by - 47, 4, 5); R(HERO.hairDefault, x - 2, by - 48, 4, 6); R(HERO.hairDefault, x + 3, by - 47, 4, 5);
    if (d === 'd') { R(HERO.eye, x - 3, by - 36, 2, 3); R(HERO.eye, x + 1, by - 36, 2, 3); }
    if (d === 'd') DP ? held(x - 16, by - 15, -1.25) : held(x - 11, by - 13 + s * 3, -.5 - tilt);
  }
  hair(R, E, x, by, side, f, d);
  if (!side && d === 'u') DP ? held(x + 16, by - 15, 1.25) : held(x + 11, by - 13 - s * 3, .5 + tilt);
  if (DP) k.restore();
}

/* ผมสี/ผมยาวผู้หญิง วาดทับผมดำเริ่มต้น (hairOv8 031:7070) */
function hair(R, E, x, by, side, f, d) {
  const H = E.HAIR, fem = E.fem, re = H !== HERO.hairDefault, rb = HERO.fem.ribbon;
  if (!fem && !re) return;
  if (side) {
    if (re) { R(H, x - 7, by - 43, 14, 7); R(H, x - 7 + (f < 0 ? 6 : 0), by - 43, 8, 13); R(H, x - 6, by - 48, 4, 6); R(H, x - 1, by - 49, 4, 7); R(H, x + 3, by - 47, 4, 5); }
    if (fem) { R(H, x - f * 5 - 3, by - 43, 6, 19); R(H, x - f * 7 - 2, by - 30, 4, 8); R(H, x - 7, by - 44, 14, 3); R(rb, x - f * 4 - 1, by - 46, 3, 3); }
  } else {
    if (re) { R(H, x - 7, by - 43, 14, d === 'u' ? 15 : 6); R(H, x - 7, by - 47, 4, 5); R(H, x - 2, by - 48, 4, 6); R(H, x + 3, by - 47, 4, 5); }
    if (fem) {
      if (d === 'u') { R(H, x - 7, by - 43, 14, 21); R(H, x - 6, by - 23, 12, 3); }
      else { R(H, x - 9, by - 43, 3, 18); R(H, x + 6, by - 43, 3, 18); R(H, x - 7, by - 44, 14, 4); R(H, x - 6, by - 41, 4, 2); R(H, x + 2, by - 41, 4, 2); R(HERO.eye, x - 4, by - 37, 1, 1); R(HERO.eye, x + 4, by - 37, 1, 1); R(HERO.fem.lip, x - 1, by - 31, 2, 1); }
      R(rb, x + 3, by - 48, 4, 3); R(rb, x + 6, by - 47, 2, 2);
    }
  }
}

/* เส้นลมตอนพุ่ง (dashStreaks 018) */
function streaks(k, v) {
  const [vx, vy] = v.dash.dv, px = -vy, py = vx, a = Math.min(1, v.dash.t / DASH.time * 1.6);
  k.save(); k.lineCap = 'round'; k.lineWidth = 1.6;
  for (let i = 0; i < 5; i++) {
    const o = (i - 2) * 6, len = 24 + ((i * 37) % 5) * 7, sx = v.x - vx * 8 + px * o, sy = v.y - 24 + py * o * .6;
    k.strokeStyle = 'rgba(235,245,255,' + (.55 * a) + ')';
    k.beginPath(); k.moveTo(sx, sy); k.lineTo(sx - vx * len, sy - vy * len * .7); k.stroke();
  }
  k.restore();
}

/* ป้ายชื่อเหนือหัว (nameTag 031:546 แบบเรียบ · ฉายา/กิลด์ = เฟสหลัง) */
function nameTag(k, v) {
  if (!v.name) return;
  const g = HERO.tag, txt = v.name, lv = 'Lv.' + v.lv;
  k.save(); k.font = g.font; k.textBaseline = 'middle';
  const w1 = k.measureText(txt).width, w2 = k.measureText(lv).width, w = w1 + w2 + 16, x = Math.round(v.x - w / 2), y = Math.round(v.y - g.dy);
  k.fillStyle = g.bg; k.strokeStyle = g.edge; k.lineWidth = 1;
  k.beginPath(); if (k.roundRect) k.roundRect(x, y, w, g.h, 4); else k.rect(x, y, w, g.h); k.fill(); k.stroke();
  k.fillStyle = g.fg; k.fillText(txt, x + 6, y + g.h / 2 + .5);
  k.fillStyle = g.lv; k.fillText(lv, x + 10 + w1, y + g.h / 2 + .5);
  k.restore();
}

/* วาดทั้งตัว (เงาพุ่ง → เส้นลม → ตัว (เอน/ว่ายน้ำ) → ป้ายชื่อ) */
export function drawHero(k, v) {
  for (const g of v.trail) { /* เงาตามตัวตอนพุ่ง (drawGhosts) */
    k.save(); k.globalAlpha = Math.min(.26, g.l * 1.4);
    body(k, { ...v, x: g.x, y: g.y, dir: g.dir, moving: true, dp: true });
    k.restore();
  }
  if (v.dash) streaks(k, v);
  const side = v.dir === 'l' || v.dir === 'r', f = v.dir === 'l' ? -1 : 1, t = v.now;
  let sw = v.moving ? Math.sin(v.t * 2) * .02 : Math.sin(t * 1.7) * .02 + Math.sin(t * .6) * .01;
  if (v.moving && side && !v.dash) sw += f * (v.run ? .16 : .07); /* เอนตัวไปข้างหน้าตอนเดิน (031:761) */
  k.save();
  if (v.swim) { /* ว่ายน้ำ: ซ่อนครึ่งล่างใต้ผิวน้ำ (038-fix7:83) */
    k.beginPath(); k.rect(v.x - 80, v.y - 160, 160, 160 - 12 + Math.sin(t * 3) * 1.2); k.clip(); k.translate(0, 5 + Math.sin(t * 3));
  }
  k.translate(v.x, v.y); k.transform(1, 0, sw, 1, 0, 0); k.translate(-v.x, -v.y);
  body(k, { ...v, dp: !!v.dash });
  k.restore();
  if (v.swim) { /* วงน้ำกระเพื่อม */
    k.save(); k.strokeStyle = 'rgba(235,248,255,.75)'; k.lineWidth = 1.4;
    for (let i = 0; i < 3; i++) { const u = (t * .9 + i / 3) % 1; k.globalAlpha = (1 - u) * .8; k.beginPath(); k.ellipse(v.x, v.y + 2, 10 + u * 16, 3 + u * 6, 0, 0, 7); k.stroke(); }
    k.restore();
  }
  nameTag(k, v);
}
