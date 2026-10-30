/* เทส core/loop: เพดาน 30 FPS แบบเส้นเวลาเป้า (1Z · หัวหน้าตัดสินจากผลตรวจ 1A-1g L1)
   ขับ startLoop จริงด้วย requestAnimationFrame ปลอม (เวลา rAF จำลองของจอแต่ละ Hz + แกว่ง) · รัน: node v6/tests/run.cjs loop */
import { startLoop, setCapSource } from '../src/core/loop.js';
import { createState } from '../src/core/state.js';

const truthy = (v, m) => { if (!v) throw new Error(m); };

/* จำลองจอ hz เป็นเวลา secs วิ (แกว่ง ±jit ms) → { fps, gaps: ช่วงห่างระหว่างเฟรมเกม (ms) } */
function simulate(hz, { cap = 30, secs = 10, jit = 0.6, seed = 1 } = {}) {
  let rnd = seed;
  const rand = () => { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; };
  const cbs = [];
  const oldRaf = globalThis.requestAnimationFrame, oldPerf = globalThis.performance;
  let clock = 1000;
  globalThis.requestAnimationFrame = fn => { cbs.push(fn); return cbs.length; };
  globalThis.performance = { now: () => clock };
  const G = createState(), times = [];
  try {
    setCapSource(() => cap);
    startLoop(G, [{ id: 't', update: () => times.push(clock) }], null);
    const period = 1000 / hz, start = clock;
    for (let i = 1; clock - start < secs * 1000; i++) {
      clock = start + i * period + (rand() * 2 - 1) * jit; /* เวลา rAF = จังหวะจอ + แกว่ง */
      const run = cbs.splice(0);
      for (const f of run) f(clock);
    }
  } finally {
    globalThis.requestAnimationFrame = oldRaf; globalThis.performance = oldPerf; setCapSource(() => 60);
  }
  const gaps = times.slice(1).map((t, i) => t - times[i]);
  return { fps: times.length / secs, gaps };
}

export default [
  ['เพดาน 30: จอ 50/60/75/90/100/120/144 Hz (rAF แกว่ง ±0.6 ms) ได้ 29–30.5 FPS (เดิม "ข้าม <30 ms" ได้ 25 ที่ 50/75 Hz)', () => {
    for (const hz of [50, 60, 75, 90, 100, 120, 144]) {
      const { fps } = simulate(hz);
      truthy(fps >= 29 && fps <= 30.5, `${hz} Hz ได้ ${fps.toFixed(2)} FPS`);
    }
  }],
  ['เพดาน 30: ไม่วาดถี่เกิน (ช่วงห่างทุกเฟรม ≥ 1 ช่วงจอ และเฉลี่ย ≈33 ms) · จอ 30 Hz/24 Hz วาดทุกเฟรม', () => {
    for (const hz of [60, 75, 100, 120, 144]) {
      const { gaps } = simulate(hz, { jit: 0.3 });
      const min = Math.min(...gaps.slice(2));
      truthy(min >= 1000 / hz * 0.9 && min >= 16, `${hz} Hz ช่วงห่างสั้นสุด ${min.toFixed(1)} ms`);
      const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      truthy(Math.abs(avg - 1000 / 30) < 1.2, `${hz} Hz เฉลี่ย ${avg.toFixed(2)} ms`);
    }
    for (const hz of [30, 24]) {
      const { fps } = simulate(hz);
      truthy(Math.abs(fps - hz) < 0.6, `${hz} Hz ต้องวาดทุกเฟรม ได้ ${fps.toFixed(2)}`);
    }
  }],
  ['เป้า 60 (คอม) ไม่จำกัด: 60/144 Hz วาดทุก rAF', () => {
    for (const hz of [60, 144]) {
      const { fps } = simulate(hz, { cap: 60 });
      truthy(Math.abs(fps - hz) < 1, `${hz} Hz ได้ ${fps.toFixed(2)}`);
    }
  }],
];
