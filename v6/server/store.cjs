/* store — ที่เก็บข้อมูล v6 (คีย์ขึ้นต้น eld6: แยกจากเกมเดิมเด็ดขาด · spec05 §0 + PLAN กฎข้อ 7)
   3 แบบ ใช้หน้าตาเดียวกัน: get(key) → สตริง|null · set(key, val) · create(key, val) → true ถ้าสร้างได้ (ยังไม่มีคีย์นี้)
   - Upstash  : มี env UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN ครบคู่
   - ไฟล์      : ไม่มี env → DATA_DIR/v6/ (DATA_DIR เริ่มต้น ./data เหมือนเกมเดิม)
   - หน่วยความจำ: ใช้ในเทส */
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const PREFIX = 'eld6:';

function memoryStore() {
  const m = new Map();
  return {
    kind: 'memory',
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async set(k, v) { m.set(k, String(v)); },
    async create(k, v) { if (m.has(k)) return false; m.set(k, String(v)); return true; },
    _map: m,
  };
}

function fileStore(dir) {
  /* สร้างโฟลเดอร์ตอนเขียนครั้งแรก (ไม่ใช่ตอนบูต) — สร้างไม่ได้ = เซฟ v6 พัง แต่เซิร์ฟเวอร์เกมเดิมยังบูตขึ้น (ผลตรวจ L4) */
  let made = false;
  const ensure = async () => { if (!made) { await fs.promises.mkdir(dir, { recursive: true }); made = true; } };
  /* ชื่อไฟล์ = sha256 ของคีย์ (คีย์มีอักษรไทยได้) */
  const fp = k => path.join(dir, crypto.createHash('sha256').update(k).digest('hex').slice(0, 40) + '.json');
  return {
    kind: 'file', dir,
    async get(k) { try { return await fs.promises.readFile(fp(k), 'utf8'); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } },
    async set(k, v) {
      /* เขียนไฟล์ชั่วคราวแล้วเปลี่ยนชื่อ — ไฟดับกลางทางไม่ทำให้เซฟครึ่งไฟล์ */
      await ensure();
      const f = fp(k), tmp = f + '.' + process.pid + '.' + crypto.randomBytes(4).toString('hex') + '.tmp';
      await fs.promises.writeFile(tmp, String(v));
      await fs.promises.rename(tmp, f);
    },
    async create(k, v) {
      await ensure();
      try { await fs.promises.writeFile(fp(k), String(v), { flag: 'wx' }); return true; }
      catch (e) { if (e.code === 'EEXIST') return false; throw e; }
    },
  };
}

function upstashStore(url, token, fetchFn = globalThis.fetch) {
  const base = url.replace(/\/+$/, '');
  async function cmd(args) {
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 10000); /* 10 วิ เหมือนเกมเดิม spec05 §2.8 */
    try {
      const r = await fetchFn(base, { method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(args), signal: ctl.signal });
      const j = await r.json();
      if (!r.ok || j.error) throw new Error('upstash: ' + (j.error || r.status));
      return j.result;
    } finally { clearTimeout(tm); }
  }
  return {
    kind: 'upstash',
    async get(k) { const v = await cmd(['GET', k]); return v == null ? null : String(v); },
    async set(k, v) { await cmd(['SET', k, String(v)]); },
    async create(k, v) { return (await cmd(['SET', k, String(v), 'NX'])) === 'OK'; },
  };
}

/* เลือกที่เก็บจาก env */
function fromEnv(env = process.env) {
  const u = env.UPSTASH_REDIS_REST_URL, t = env.UPSTASH_REDIS_REST_TOKEN;
  if (u && t) return upstashStore(u, t);
  return fileStore(path.join(env.DATA_DIR || path.join(process.cwd(), 'data'), 'v6'));
}

module.exports = { PREFIX, memoryStore, fileStore, upstashStore, fromEnv };
