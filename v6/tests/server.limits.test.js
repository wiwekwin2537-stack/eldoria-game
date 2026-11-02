/* เทส 1B-f — กันยิง /v6ws จนเกมเดิมล่ม/โควตาหมด (ผลตรวจ v6/reviews/1B-claude-review.md)
   H1 คิว/ขนาด · H2 จำกัด hello/load/save + งบที่เก็บ · M2 ไบต์/วิ · M3 Origin · L1 ล้างตาราง · L2 ตัดคนไม่ล็อกอิน
   L4 v6 พังแล้วเกมเดิมยังบูต · L5 ไม่เสิร์ฟ /assets/incoming/ · รัน: node v6/tests/run.cjs limits */
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SRV = path.join(HERE, '..', 'server');
const { memoryStore } = require('../server/store.cjs');
const { createAccounts, MAP_CAP } = require('../server/accounts.cjs');
const { createSaves, CACHE_MAX, CACHE_BYTES } = require('../server/saves.cjs');
const { createProto, MAX_PENDING, LIM } = require('../server/proto.cjs');
const P = require('../server/proto.cjs');
const { counter, budgetStore } = require('../server/limits.cjs');
const V6 = require('../server/index.cjs');

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${JSON.stringify(a)} ต้องเป็น ${JSON.stringify(b)}`); };
const truthy = (v, m) => { if (!v) throw new Error(m); };
const wait = ms => new Promise(r => setTimeout(r, ms));
const SID = 'c'.repeat(32);

/* ที่เก็บที่นับคำสั่ง + หน่วงได้ */
function countingStore(delayMs = 0) {
  const inner = memoryStore(), s = { ops: 0, bops: 0, kind: 'memory', _map: inner._map };
  /* ops = คำสั่งข้อมูล v6 · bops = บันทึกตัวนับงบวัน (eld6:budget: · 1B-g N4 มีเพดานแยก) */
  for (const k of ['get', 'set', 'create']) s[k] = async (a, b) => { if (String(a).startsWith('eld6:budget:')) s.bops++; else s.ops++; if (delayMs) await wait(delayMs); return inner[k](a, b); };
  return s;
}
function setup({ delayMs = 0, budget = null, authTimeoutMs = 0 } = {}) {
  const c = { t: 1.8e12 }; const now = () => c.t;
  const counting = countingStore(delayMs);
  const store = budget ? budgetStore(counting, { ...budget, now }) : counting;
  const accounts = createAccounts({ store, env: { GM_IDS: 'tiksi' }, now });
  const saves = createSaves({ store, now });
  const proto = createProto({ accounts, saves, now, authTimeoutMs });
  return { c, counting, store, accounts, saves, proto };
}
let ipN = 0;
function conn(proto, ip = '10.7.0.' + (++ipN)) {
  const k = { ip, out: [], closed: null, send(o) { this.out.push(o); }, close(code, why) { if (!this.closed) this.closed = { code, why }; } };
  proto.open(k);
  return k;
}
const say = async (proto, k, o) => { await proto.message(k, JSON.stringify(o)); return k.out[k.out.length - 1]; };

export default [
  /* ---------- H1 ---------- */
  ['H1: ที่เก็บช้า + ยิง hello รัว → ค้างในคิวเกิน 8 ถูกตัด (คิวไม่โตไม่จำกัด)', async () => {
    const { proto } = setup({ delayMs: 200 });
    const k = conn(proto);
    let maxPending = 0;
    for (let i = 0; i < 25 && !k.closed; i++) { proto.message(k, JSON.stringify({ t: 'hello', id: 'abc', token: 'a'.repeat(48) })); maxPending = Math.max(maxPending, k.pending); }
    truthy(k.closed && k.closed.why === 'queue', 'ต้องถูกตัดเพราะคิวเต็ม: ' + JSON.stringify(k.closed));
    truthy(maxPending <= MAX_PENDING, 'คิวค้างสูงสุด ' + maxPending);
  }],
  ['H1: ก่อนล็อกอินรับข้อความ ≤2 KB (ใหญ่กว่าตัดทันที ไม่ parse) · หลังล็อกอิน ข้อความที่ไม่ใช่ save >4 KB → bad · ช่องขยะไม่เข้าคิว', async () => {
    const { proto } = setup();
    const a = conn(proto);
    await proto.message(a, JSON.stringify({ t: 'hello', id: 'abc', token: 'a'.repeat(48), junk: 'x'.repeat(300 * 1024) }));
    eq(a.closed && a.closed.why, 'size', 'ขยะ 300 KB ก่อนล็อกอิน');
    const b = conn(proto);
    eq((await say(proto, b, { t: 'register', id: 'h1big', pw: 'abc123' })).t, 'auth_ok', 'สมัคร');
    eq((await say(proto, b, { t: 'time', junk: 'x'.repeat(5000) })).why, 'bad', 'time ใหญ่เกิน');
    eq((await say(proto, b, { t: 'save', sid: SID, seq: 1, systems: { a: { s: 'x'.repeat(100000) } } })).t, 'save_ok', 'save ใหญ่ได้');
    eq(b.closed, null, 'ยังไม่ตัด');
  }],

  /* ---------- H2 ---------- */
  ['H2: hello โทเคนมั่วจาก IP เดียว 60 ครั้ง (หลายซ็อกเก็ต) → อ่านที่เก็บ ≤10 ครั้ง · ตอบ rate ไม่ใช่ auth', async () => {
    const { proto, counting } = setup();
    const ipA = '203.0.113.9'; let rate = 0;
    for (let s = 0; s < 20; s++) {
      const k = conn(proto, ipA);
      for (let i = 0; i < 3; i++) { const r = await say(proto, k, { t: 'hello', id: 'victim1', token: 'a'.repeat(48) }); if (r.why === 'rate') rate++; }
    }
    truthy(counting.ops <= LIM.helloIp.max, 'คำสั่งที่เก็บ ' + counting.ops);
    eq(rate, 60 - LIM.helloIp.max, 'ที่เหลือได้ rate');
    const k = conn(proto, '203.0.113.10');
    eq((await say(proto, k, { t: 'hello', id: 'victim1', token: 'a'.repeat(48) })).why, 'auth', 'IP อื่นไม่โดนลูกหลง');
  }],
  ['H2: load ≤1/5 วิ ต่อซ็อกเก็ต · save ที่ตอบ old/rate ไม่อ่านที่เก็บซ้ำ (แคช + นับทุกครั้ง)', async () => {
    const { proto, counting, c } = setup();
    const k = conn(proto);
    await say(proto, k, { t: 'register', id: 'h2load', pw: 'abc123' });
    eq((await say(proto, k, { t: 'load', sid: SID })).t, 'load', 'โหลดครั้งแรก');
    eq((await say(proto, k, { t: 'load', sid: SID })).why, 'rate', 'โหลดซ้ำทันที');
    c.t += 5000;
    eq((await say(proto, k, { t: 'load', sid: SID })).t, 'load', 'ครบ 5 วิ');
    c.t += 1100;
    eq((await say(proto, k, { t: 'save', sid: SID, seq: 3, systems: {} })).t, 'save_ok', 'เซฟ');
    const before = counting.ops;
    for (let i = 0; i < 30; i++) { c.t += 1100; await say(proto, k, { t: 'save', sid: SID, seq: 1, systems: {} }); }
    eq(counting.ops, before, 'เซฟ old 30 ครั้ง ไม่แตะที่เก็บ');
    let rate = 0; for (let i = 0; i < 10; i++) { const r = await say(proto, k, { t: 'save', sid: SID, seq: 99 + i, systems: {} }); if (r.why === 'rate') rate++; }
    truthy(rate >= 8, 'เซฟรัวในวินาทีเดียว ได้ rate ' + rate);
  }],
  ['H2: งบคำสั่งที่เก็บรวม (ต่อนาที/ต่อวัน) เต็ม → err busy ไม่แตะที่เก็บ · ครบนาทีใช้ได้อีก', async () => {
    const { proto, counting, c } = setup({ budget: { perMin: 3, perDay: 5 } });
    const k = conn(proto);
    eq((await say(proto, k, { t: 'register', id: 'bud1', pw: 'abc123' })).t, 'auth_ok', 'สมัคร (1)');
    eq((await say(proto, k, { t: 'load', sid: SID })).t, 'load', 'โหลด (get+set = 3)');
    c.t += 6000;
    const r = await say(proto, k, { t: 'load', sid: 'd'.repeat(32) });
    eq(r.t, 'err', 'เต็ม'); eq(r.why, 'busy', 'busy');
    eq(counting.ops, 3, 'ไม่เกินงบ');
    c.t += 60000;
    eq((await say(proto, k, { t: 'load', sid: 'd'.repeat(32) })).t, 'load', 'นาทีใหม่');
    c.t += 60000;
    const k2 = conn(proto);
    eq((await say(proto, k2, { t: 'login', id: 'bud1', pw: 'abc123' })).why, 'busy', 'งบวันหมด (5)');
  }],

  /* ---------- 1B-g N1: แคชเซฟห้ามทำหน่วยความจำบวม ---------- */
  ['N1: 100 บัญชี × เซฟ 256 KB แบบ [[],[],…] → heap โต < 30 MB · แคชไม่เกินงบไบต์ (เดิม +333 MB)', async () => {
    const r = await new Promise((ok, no) => {
      const p = spawn(process.execPath, ['--expose-gc', path.join(HERE, 'server.heap.cjs')], { stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '', err = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
      p.on('close', code => { try { ok(JSON.parse(out.trim().split('\n').pop())); } catch (e) { no(new Error('ผลวัดอ่านไม่ได้ ' + code + ' ' + out + err)); } });
    });
    eq(r.saved, 100, 'เซฟสำเร็จทุกบัญชี');
    truthy(r.grow < 30, 'heap โต ' + r.grow + ' MB (ต้อง < 30)');
    truthy(r.cacheBytes != null && r.cacheBytes <= CACHE_BYTES, 'แคช ' + r.cacheBytes + ' ไบต์ ต้อง ≤ ' + CACHE_BYTES);
  }],
  ['N1: แคชเกินงบไบต์ → ทิ้ง systems ของตัวเก่า (เก็บ seq/w) · load ตัวนั้นอ่านจากที่เก็บได้ถูก · เซฟต่อได้ไม่ต้องอ่านก่อน', async () => {
    const c = { t: 1.8e12 }, now = () => c.t, store = countingStore();
    const saves = createSaves({ store, now, cacheBytes: 3000 }); /* ~1.5 KB ต่อตัว → ถือ systems ได้ 1–2 ตัว */
    const sys = n => ({ bag: { s: String(n).repeat(600) } });
    for (let i = 0; i < 4; i++) { c.t += 2000; await saves.load('n1u' + i, SID); eq((await saves.save('n1u' + i, { seq: 1, sid: SID, systems: sys(i) })).ok, true, 'เซฟ ' + i); }
    truthy(saves._cacheStat.bytes <= 3000, 'ไม่เกินงบ ' + saves._cacheStat.bytes);
    eq(saves._cache.size, 4, 'ข้อมูลเล็กยังอยู่ครบ');
    eq(saves._cache.get('n1u0').sys, null, 'ตัวเก่าสุดถูกทิ้ง systems');
    const before = store.ops; c.t += 2000;
    eq((await saves.save('n1u0', { seq: 2, sid: SID, systems: sys(9) })).ok, true, 'เซฟตัวที่ถูกทิ้ง');
    eq(store.ops - before, 1, 'เซฟ = 1 คำสั่ง (ไม่ต้องอ่านก่อน)');
    eq((await saves.load('n1u1', SID)).systems.bag.s, '1'.repeat(600), 'โหลดตัวที่ถูกทิ้ง → อ่านจากที่เก็บถูก');
    eq((await saves.load('n1u0', SID)).systems.bag.s, '9'.repeat(600), 'ของล่าสุด');
  }],

  ['N4: ตัวนับงบต่อวันเก็บในที่เก็บ → รีสตาร์ต/deploy แล้วยังเต็ม (เดิมนับใหม่ที่ 0) · ขึ้นวันใหม่ (เที่ยงคืนไทย) ใช้ได้อีก · ต่อนาทีอยู่ในหน่วยความจำ', async () => {
    const c = { t: Date.UTC(2026, 9, 30, 10, 0, 0) }, now = () => c.t; /* 17:00 เวลาไทย */
    const raw = countingStore();
    const tick2 = () => new Promise(r => setTimeout(r, 5));
    let b = budgetStore(raw, { perMin: 100, perDay: 5, now });
    for (let i = 0; i < 5; i++) await b.set('eld6:x' + i, '1');
    let e = null; try { await b.get('eld6:x0'); } catch (x) { e = x; }
    eq(e && e.code, 'busy', 'วันนี้เต็ม'); await tick2();
    /* รีสตาร์ต = สร้างตัวห่อใหม่บนที่เก็บเดิม */
    b = budgetStore(raw, { perMin: 100, perDay: 5, now });
    e = null; try { await b.get('eld6:x0'); } catch (x) { e = x; }
    eq(e && e.code, 'busy', 'รีสตาร์ตแล้วงบวันยังเต็ม');
    eq(raw.ops, 5, 'คำสั่งข้อมูลไม่เกินงบวันรวมทุกการรีสตาร์ต');
    c.t = Date.UTC(2026, 9, 30, 17, 1, 0); /* 00:01 เวลาไทยวันใหม่ */
    eq(await b.get('eld6:x0'), '1', 'วันใหม่ใช้ได้');
    truthy(raw.bops <= 6, 'บันทึกตัวนับไม่ถี่เกิน: ' + raw.bops);
    /* ต่อนาที: ในหน่วยความจำ */
    const b2 = budgetStore(countingStore(), { perMin: 2, perDay: 4000, now });
    await b2.get('a'); await b2.get('a');
    e = null; try { await b2.get('a'); } catch (x) { e = x; } eq(e && e.code, 'busy', 'นาทีเต็ม');
    c.t += 60000; await b2.get('a');
    const big = budgetStore(countingStore(), { perDay: 4000, now }); eq(big._day().flushEvery, 40, 'งบ 4000 → บันทึกทุก 40 คำสั่ง (≥10 วิ)');
  }],

  /* ---------- M2 ---------- */
  ['M2: เกิน 512 KB/วิ ต่อซ็อกเก็ต → ตัด · 30 ข้อความ/วิ ยังได้', async () => {
    const { proto, c } = setup();
    const k = conn(proto);
    await say(proto, k, { t: 'register', id: 'm2big', pw: 'abc123' });
    const big = { t: 'save', sid: SID, seq: 1, systems: { a: { s: 'x'.repeat(200 * 1024) } } };
    await say(proto, k, big); await say(proto, k, { ...big, seq: 2 });
    eq(k.closed, null, '400 KB ยังได้');
    await say(proto, k, { ...big, seq: 3 });
    eq(k.closed && k.closed.why, 'rate', '600 KB ใน 1 วิ ถูกตัด');
    c.t += 1;
  }],

  /* ---------- M3 ---------- */
  ['M3: Origin — ไม่ตั้ง ALLOWED_ORIGINS ยอมแค่โดเมนเดียวกัน · null/เว็บอื่นไม่ผ่าน · ไม่มี Origin (ไม่ใช่เบราว์เซอร์) ผ่าน · รายการใน env ผ่าน', () => {
    const O = V6.originOk;
    eq(O('https://evil.com', 'game.onrender.com', []), false, 'เว็บอื่น');
    eq(O('null', 'game.onrender.com', []), false, 'null');
    eq(O('https://game.onrender.com', 'game.onrender.com', []), true, 'โดเมนเดียวกัน');
    eq(O('', 'game.onrender.com', []), true, 'ไม่มี Origin');
    eq(O('https://my.site', 'game.onrender.com', ['https://my.site']), true, 'ใน ALLOWED_ORIGINS');
    eq(O('https://evil.com', 'game.onrender.com', ['https://my.site']), false, 'ไม่อยู่ในรายการ');
    eq(O('not a url', 'x', []), false, 'ผิดรูป');
  }],

  /* ---------- L1 ---------- */
  ['L1: ตารางในหน่วยความจำไม่โตเรื่อย ๆ — sweep ลบของหมดอายุ · มีเพดาน', async () => {
    const { accounts, saves, proto, c } = setup();
    for (let i = 0; i < 50; i++) await accounts.login({ id: 'nobody' + i, pw: 'x' }, 'ip' + i);
    eq(accounts._ipTries.size, 50, 'ipTries'); eq(accounts._fails.size, 50, 'fails');
    c.t += 61000; accounts.sweep();
    eq(accounts._ipTries.size, 0, 'ipTries ลบหลัง 1 นาที'); eq(accounts._fails.size, 50, 'fails ยังจำ (ยังไม่ครบ 15 นาที)');
    c.t += 15 * 60000; accounts.sweep();
    eq(accounts._fails.size, 0, 'fails ลบหลัง 15 นาที');
    await saves.save('l1', { sid: SID, seq: 1, systems: {} });
    c.t += 2000; saves.sweep(); eq(saves._lastSave.size, 0, 'lastSave');
    const k = conn(proto); await say(proto, k, { t: 'hello', id: 'abc', token: 'a'.repeat(48) });
    truthy(proto._lim.helloIp.size() > 0, 'มีรายการ'); c.t += 61000; proto.sweep(); eq(proto._lim.helloIp.size(), 0, 'limiter ลบ');
    const ct = counter({ max: 1, ms: 1000, now: () => c.t, cap: 3 });
    for (let i = 0; i < 3; i++) ct.hit('k' + i);
    eq(ct.hit('k9'), false, 'เต็มเพดาน → ปฏิเสธคีย์ใหม่'); eq(ct.size(), 3, 'ไม่เกินเพดาน');
    c.t += 1000; eq(ct.hit('k9'), true, 'ของเก่าหมดอายุ → รับได้');
    truthy(MAP_CAP >= 1000 && CACHE_MAX >= 100, 'มีเพดาน');
  }],

  /* ---------- L2 ---------- */
  ['L2: ต่อแล้วไม่ล็อกอินภายในเวลา → ตัด (4002) · ล็อกอินแล้วไม่ตัด', async () => {
    const { proto } = setup({ authTimeoutMs: 60 });
    const idle = conn(proto), ok = conn(proto);
    await say(proto, ok, { t: 'register', id: 'l2ok', pw: 'abc123' });
    await wait(120);
    eq(idle.closed && idle.closed.code, 4002, 'ไม่ล็อกอิน ถูกตัด');
    eq(ok.closed, null, 'ล็อกอินแล้ว ไม่ตัด');
  }],

  /* ---------- L5 ---------- */
  ['L5: /assets/incoming/ (ภาพยังไม่ผ่านตรวจ) v6 ไม่เสิร์ฟ — ให้เกมเดิมตอบเหมือนก่อนมี v6', () => {
    eq(V6.resolveStatic('/assets/incoming/hero-parts-sword-20261021.png'), null, 'incoming');
    eq(V6.resolveStatic('/assets/INCOMING/x.png'), null, 'ตัวใหญ่');
    truthy(V6.resolveStatic('/assets/nope.png'), 'โฟลเดอร์อื่นยังเสิร์ฟ');
  }],

  /* ---------- L4 ---------- */
  ['L4: โมดูล v6 โหลดไม่ได้ / DATA_DIR สร้างไม่ได้ / http โยน error → require ไม่ล้ม · attach ไม่แตะ ws เกมเดิม', async () => {
    const Module = require('module');
    const realLoad = Module._load;
    const files = ['index.cjs', 'store.cjs', 'accounts.cjs', 'saves.cjs', 'proto.cjs', 'limits.cjs'].map(f => path.join(SRV, f));
    const fresh = () => { for (const f of files) delete require.cache[f]; return require(path.join(SRV, 'index.cjs')); };
    const savedEnv = process.env.V6_ENABLE, savedErr = console.error;
    process.env.V6_ENABLE = '1'; console.error = () => {};
    try {
      Module._load = function (req, parent, ...a) { if (/store\.cjs$/.test(req) && parent && /index\.cjs$/.test(parent.filename)) throw new Error('จำลอง v6 พัง'); return realLoad.call(this, req, parent, ...a); };
      let X; try { X = fresh(); } catch (e) { throw new Error('require ล้ม: ' + e.message); }
      Module._load = realLoad;
      truthy(X.loadError(), 'จำได้ว่าโหลดพัง');
      const { EventEmitter } = require('events'); const srv = new EventEmitter(); const f = () => {}; srv.on('upgrade', f);
      eq(X.attach(srv), null, 'attach ไม่ทำ'); eq(srv.listeners('upgrade')[0], f, 'ตัวรับเดิมอยู่');
      eq(X.http({ url: '/x', method: 'GET', headers: {} }, {}), false, 'url อื่น → เกมเดิมตอบ');
      /* http โยน error (เช่น req เพี้ยน) → คืน false ให้เกมเดิมตอบ ไม่โยนต่อ */
      const Y = fresh();
      const evil = { get url() { throw new Error('boom'); }, headers: {} };
      eq(Y.http(evil, { headersSent: false }), false, 'http พัง → false');
      /* DATA_DIR เป็นไฟล์ (สร้างโฟลเดอร์ไม่ได้) → สร้าง v6 ได้ ไม่ล้มตอนบูต */
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v6l4-')), asFile = path.join(tmp, 'file');
      fs.writeFileSync(asFile, 'x');
      const v = Y.createV6({ env: { DATA_DIR: asFile }, log: () => {} });
      let err = null; try { await v.saves.load('x', SID); } catch (e) { err = e; }
      truthy(err, 'เขียนไม่ได้ → error ตอนใช้ (ไม่ใช่ตอนบูต)');
      v.stop(); fs.rmSync(tmp, { recursive: true, force: true });
    } finally { Module._load = realLoad; fresh(); console.error = savedErr; if (savedEnv === undefined) delete process.env.V6_ENABLE; else process.env.V6_ENABLE = savedEnv; }
  }],
  ['L4: เปิด server.js จริงโดยทำให้ v6 พังตอนโหลด (V6_ENABLE=1) → เกมเดิมบูตขึ้น หน้า / และ ws เกมเดิมยังทำงาน', async () => {
    let WS; try { WS = require('ws'); } catch (e) { try { WS = require('/opt/npm-tools/node_modules/ws'); } catch (e2) {} }
    if (!WS) { console.log('     (ข้าม: ไม่มีโมดูล ws)'); return; }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v6l4s-'));
    const pre = path.join(tmp, 'break-v6.cjs');
    fs.writeFileSync(pre, `const M=require('module'),L=M._load;M._load=function(r,p,...a){if(/store\\.cjs$/.test(r)&&p&&/v6[\\\\/]server[\\\\/]index\\.cjs$/.test(p.filename))throw new Error('จำลอง v6 พัง');return L.call(this,r,p,...a)};`);
    const port = 21000 + Math.floor(Math.random() * 8000);
    const env = { ...process.env, PORT: String(port), DATA_DIR: tmp, UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', V6_ENABLE: '1',
      NODE_PATH: [process.env.NODE_PATH, '/opt/npm-tools/node_modules'].filter(Boolean).join(':') };
    const p = spawn(process.execPath, ['-r', pre, 'server.js'], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d);
    try {
      let res = null;
      for (let i = 0; i < 50 && !res; i++) { try { res = await fetch(`http://127.0.0.1:${port}/`); } catch (e) { await wait(200); } }
      truthy(res && res.status === 200, 'เกมเดิมบูตขึ้น: ' + out.slice(-400));
      truthy(/v6/.test(out), 'มี log ว่า v6 ปิด');
      const msg = await new Promise((ok, no) => { const s = new WS.WebSocket(`ws://127.0.0.1:${port}/`); const tm = setTimeout(() => { s.terminate(); no(new Error('ws timeout')); }, 8000); s.on('message', m => { clearTimeout(tm); s.close(); ok(JSON.parse(String(m))); }); s.on('error', e => { clearTimeout(tm); no(e); }); });
      eq(msg.t, 'welcome', 'ws เกมเดิม'); truthy(Number.isFinite(msg.id), 'welcome ของเกมเดิม');
    } finally { p.kill(); await wait(200); fs.rmSync(tmp, { recursive: true, force: true }); }
  }],

  /* ---------- 1Z (ผลตรวจ 1B-g M1): เซฟก้อนใหญ่ค้างในคิวตอนที่เก็บช้า ---------- */
  ['1Z M1: ที่เก็บช้า 1–3 วิ + 100 บัญชียิงเซฟ [[],…] 256 KB ทุกวิ → heap โต ≤ 50 MB · ws เกมเดิมตอบครบ (เดิม +1,024 MB · p95 4 วิ)', async () => {
    const r = await new Promise((ok, no) => {
      const p = spawn(process.execPath, ['--expose-gc', path.join(HERE, 'server.flood.cjs'), '6'], { stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '', err = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
      p.on('close', code => { try { ok(JSON.parse(out.trim().split('\n').pop())); } catch (e) { no(new Error('ผลวัดอ่านไม่ได้ ' + code + ' ' + out + err)); } });
    });
    truthy(r.grow <= 50, 'heap โต ' + r.grow + ' MB (ต้อง ≤ 50)');
    truthy(r.got >= r.sent - 1 && r.p95 < 250, `ws เกมเดิมตอบ ${r.got}/${r.sent} p95 ${r.p95} ms`);
    truthy(r.saved > 0, 'ยังเซฟได้บ้าง (ไม่ปิดตาย) ' + r.saved);
    truthy(r.busy > 0 && r.busyR, 'เกินโควตา → ตอบ busy พร้อมเลข r ของคำขอ');
    truthy(r.answered, 'ทุกข้อความได้คำตอบ');
    eq(r.left, 0, 'ทำเสร็จแล้วคืนโควตาไบต์ครบ');
  }],
  ['1Z M1: ก้อนใหญ่เกินโควตา → save_no busy ก่อน parse (ไม่เรียก JSON.parse · ได้ r) · ต่อซ็อกเก็ต ≤2 · คืนโควตาเมื่อเสร็จ/ผิดรูป', async () => {
    const { proto, c } = setup({ delayMs: 150 });
    const k = conn(proto);
    await say(proto, k, { t: 'register', id: 'm1sock', pw: 'abc123' });
    await say(proto, k, { t: 'load', sid: SID });
    const body = 'x'.repeat(3000);
    const msg = (seq, r) => JSON.stringify({ t: 'save', seq, sid: SID, systems: { a: { s: body } }, r });
    const parse = JSON.parse; let parsed = 0;
    JSON.parse = function (s) { if (typeof s === 'string' && s.length > 2000) parsed++; return parse.apply(this, arguments); };
    let q;
    try {
      c.t += 2000;
      q = [proto.message(k, msg(1, 11)), proto.message(k, msg(2, 12))];
      eq(proto._big.bytes, 2 * Buffer.byteLength(msg(1, 11)), 'นับไบต์ 2 ก้อน');
      proto.message(k, msg(3, 13));
      eq(parsed, 2, 'ก้อนที่ 3 ไม่ถูก parse');
    } finally { JSON.parse = parse; }
    const last = k.out[k.out.length - 1];
    eq(last.t + ':' + last.why + ':' + last.r, 'save_no:busy:13', 'ตอบ busy พร้อม r');
    await Promise.all(q);
    eq(proto._big.bytes, 0, 'เสร็จแล้วคืนโควตา'); eq(k.bigN, 0, 'ต่อซ็อกเก็ตคืนครบ');
    await proto.message(k, '{"t":"save",' + 'x'.repeat(2000));
    eq(proto._big.bytes, 0, 'ผิดรูปก็คืนโควตา');
    /* ทั้งเซิร์ฟเวอร์: หลายซ็อกเก็ตรวมกันเกิน 2 MB → busy */
    const huge = JSON.stringify({ t: 'save', seq: 9, sid: SID, systems: { a: { s: 'y'.repeat(250 * 1024) } }, r: 5 });
    const ks = [];
    for (let i = 0; i < 12; i++) { const ki = conn(proto); ki.lid = 'fake' + i; ks.push(ki); proto.message(ki, huge); }
    truthy(proto._big.bytes <= P.BIG_PENDING_BYTES, 'ไม่เกิน 2 MB ' + proto._big.bytes);
    truthy(ks.some(ki => ki.out.some(o => o.why === 'busy' && o.r === 5)), 'ตัวที่เกิน 2 MB ได้ busy');
    eq(P.peekR('{"r":77,"t":"save"}'), 77, 'r หัวข้อความ'); eq(P.peekR(Buffer.from('{"t":"save","r":8}')), 8, 'r ท้าย (Buffer)'); eq(P.peekR('{"t":"x"}'), undefined, 'ไม่มี r');
  }],
  ['1Z L2: อ่านตัวนับงบวันไม่ได้ตอนบูต → ไม่เขียนทับค่าที่ใหญ่กว่าในที่เก็บ · อ่านได้ภายหลังแล้วรวมค่า', async () => {
    const c = { t: Date.UTC(2026, 9, 30, 10, 0, 0) }, now = () => c.t;
    const raw = countingStore();
    const day = Math.floor((c.t + 7 * 3600e3) / 864e5), key = 'eld6:budget:day:' + day;
    raw._map.set(key, '3000');
    let down = true;
    const persist = { get: async k => { if (down) throw new Error('ที่เก็บล่ม'); return raw.get(k); }, set: (k, v) => raw.set(k, v) };
    const b = budgetStore(raw, { perMin: 1000, perDay: 4000, now, persist });
    for (let i = 0; i < 80; i++) { await b.get('eld6:x'); if (i % 20 === 0) c.t += 11000; }
    c.t += 400000; await b.get('eld6:x'); await wait(10);
    eq(raw._map.get(key), '3000', 'ห้ามเขียน 81 ทับ 3000');
    down = false;
    c.t += 400000; await b.get('eld6:x'); await wait(10);
    eq(b._day().known, true, 'อ่านได้แล้ว');
    eq(raw._map.get(key), String(3000 + 82), 'รวมค่าเดิม + ที่นับไป');
    eq(b.left().day, 4000 - 3082, 'งบที่เหลือคิดจากค่ารวม');
  }],
];
