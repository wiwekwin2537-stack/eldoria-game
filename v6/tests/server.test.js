/* เทสเซิร์ฟเวอร์ v6 (1B) — บัญชี · เซฟ · ข้อความ ws · เสิร์ฟไฟล์ · ต่อ ws จริง
   ใช้ที่เก็บในหน่วยความจำ + นาฬิกาปลอม (ไม่แตะไฟล์/เน็ต) · รัน: node v6/tests/run.cjs server */
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const { memoryStore, PREFIX } = require('../server/store.cjs');
const { createAccounts } = require('../server/accounts.cjs');
const { createSaves, SAVE_VERSION, COIN_MAX, MAX_SAVE_CHARS } = require('../server/saves.cjs');
const { createProto, MSG_PER_SEC } = require('../server/proto.cjs');
const V6 = require('../server/index.cjs');

const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: ได้ ${JSON.stringify(a)} ต้องเป็น ${JSON.stringify(b)}`); };
const truthy = (v, m) => { if (!v) throw new Error(m); };

/* นาฬิกาปลอม */
function clock(t0 = 1.8e12) { const c = { t: t0, now: () => c.t, add: ms => { c.t += ms; } }; return c; }
function mkAcc(env = {}) {
  const c = clock(), store = memoryStore();
  return { c, store, acc: createAccounts({ store, env: { GM_IDS: 'tiksi,wiwekwin2537', ...env }, now: c.now }) };
}
let ipN = 0; const ip = () => '10.0.0.' + (++ipN);
const SID = '5'.repeat(32); /* sid ของเครื่องทดสอบ (1B-f H3) */

/* การเชื่อมต่อปลอมสำหรับ proto */
function fakeConn(ipAddr = ip()) {
  const c = { ip: ipAddr, out: [], closed: null, send(o) { this.out.push(o); }, close(code, why) { this.closed = { code, why }; } };
  c.last = () => c.out[c.out.length - 1];
  return c;
}
function mkProto() {
  const c = clock(), store = memoryStore();
  const accounts = createAccounts({ store, env: { GM_IDS: 'tiksi' }, now: c.now });
  const saves = createSaves({ store, now: c.now });
  const proto = createProto({ accounts, saves, now: c.now });
  const send = async (conn, o) => { await proto.message(conn, JSON.stringify(o)); return conn.last(); };
  return { c, store, accounts, saves, proto, send };
}

function loadWs() {
  try { return require('ws'); } catch (e) {}
  try { return require('/opt/npm-tools/node_modules/ws'); } catch (e) {}
  return null;
}

export default [
  /* ---------- บัญชี ---------- */
  ['สมัคร: ได้โทเคน · ไอดีซ้ำ (ตัวเล็กใหญ่) → taken · คีย์ขึ้นต้น eld6:', async () => {
    const { acc, store } = mkAcc();
    const r = await acc.register({ id: 'Hero_1', pw: 'abc123', name: 'ฮีโร่' }, ip());
    eq(r.ok, true, 'ok'); eq(r.created, true, 'created'); truthy(/^[0-9a-f]{48}$/.test(r.token), 'token 48 hex');
    eq(r.name, 'ฮีโร่', 'name'); eq(r.gm, false, 'gm');
    eq((await acc.register({ id: 'hero_1', pw: 'zzz999' }, ip())).err, 'taken', 'ซ้ำ');
    for (const k of store._map.keys()) truthy(k.startsWith(PREFIX) && PREFIX === 'eld6:', 'คีย์ ' + k);
    /* ไม่เก็บรหัส/โทเคนตรง ๆ */
    const raw = [...store._map.values()].join('');
    truthy(!raw.includes('abc123') && !raw.includes(r.token), 'เก็บรหัส/โทเคนเป็นข้อความตรง');
  }],
  ['สมัคร: ไอดี/รหัส/ชื่อ ผิดรูป', async () => {
    const { acc } = mkAcc();
    eq((await acc.register({ id: 'ab', pw: 'abc123' }, ip())).err, 'bad-id', 'สั้น');
    eq((await acc.register({ id: 'a b c', pw: 'abc123' }, ip())).err, 'bad-id', 'เว้นวรรค');
    eq((await acc.register({ id: 'x'.repeat(17), pw: 'abc123' }, ip())).err, 'bad-id', 'ยาว');
    eq((await acc.register({ id: 'abc', pw: '12345' }, ip())).err, 'bad-pw', 'รหัสสั้น');
    eq((await acc.register({ id: 'abc', pw: 'x'.repeat(65) }, ip())).err, 'bad-pw', 'รหัสยาว');
    const r = await acc.register({ id: 'ไทยดี', pw: 'abc123', name: '<b>ชื่อ\u0001ยาวมากเกินสิบสี่ตัวอักษร' }, ip());
    eq(r.ok, true, 'ไอดีไทยได้'); truthy(!/[<>\u0001]/.test(r.name) && r.name.length <= 14, 'ชื่อถูกตัด: ' + r.name);
  }],
  ['ล็อกอิน: ถูก → โทเคนใหม่ · ผิด/ไม่มีไอดี → wrong เหมือนกัน', async () => {
    const { acc } = mkAcc();
    await acc.register({ id: 'loginer', pw: 'pass1234' }, ip());
    const r = await acc.login({ id: 'LOGINER', pw: 'pass1234' }, ip());
    eq(r.ok, true, 'ok'); eq(r.id, 'loginer', 'id');
    eq((await acc.login({ id: 'loginer', pw: 'nope999' }, ip())).err, 'wrong', 'รหัสผิด');
    eq((await acc.login({ id: 'ghost99', pw: 'pass1234' }, ip())).err, 'wrong', 'ไม่มีไอดี');
  }],
  ['รหัสผิด 8 ครั้ง → ล็อก 20 วิ (แม้รหัสถูก) · ครบเวลาเข้าได้ · ผิดต่อ → 40 วิ', async () => {
    const { acc, c } = mkAcc();
    await acc.register({ id: 'locky', pw: 'right123' }, ip());
    for (let i = 0; i < 7; i++) eq((await acc.login({ id: 'locky', pw: 'bad' + i }, ip())).err, 'wrong', 'ผิดครั้ง ' + (i + 1));
    eq((await acc.login({ id: 'locky', pw: 'bad7' }, ip())).err, 'wrong', 'ครั้งที่ 8');
    const l = await acc.login({ id: 'locky', pw: 'right123' }, ip());
    eq(l.err, 'locked', 'ล็อกแล้ว'); eq(l.sec, 20, 'วินาที');
    c.add(20001);
    eq((await acc.login({ id: 'locky', pw: 'bad8' }, ip())).err, 'wrong', 'ครั้งที่ 9');
    eq((await acc.login({ id: 'locky', pw: 'right123' }, ip())).sec, 40, 'ล็อก 40 วิ');
    c.add(40001);
    eq((await acc.login({ id: 'locky', pw: 'right123' }, ip())).ok, true, 'เข้าได้หลังครบเวลา');
    eq((await acc.login({ id: 'locky', pw: 'bad' }, ip())).err, 'wrong', 'สำเร็จแล้วนับใหม่ (ไม่ล็อกทันที)');
  }],
  ['จำกัดต่อ IP: เกิน 20 ครั้ง/นาที → rate · ผ่านไป 1 นาทีลองได้', async () => {
    const { acc, c } = mkAcc();
    const myIp = ip();
    for (let i = 0; i < 20; i++) truthy((await acc.register({ id: 'ab', pw: 'x' }, myIp)).err !== 'rate', 'ครั้ง ' + (i + 1));
    eq((await acc.register({ id: 'iplim1', pw: 'abc123' }, myIp)).err, 'rate', 'สมัครครั้งที่ 21');
    eq((await acc.login({ id: 'iplim1', pw: 'abc123' }, myIp)).err, 'rate', 'ล็อกอินนับรวม');
    eq((await acc.register({ id: 'iplim1', pw: 'abc123' }, ip())).ok, true, 'IP อื่นไม่โดน');
    c.add(60001);
    eq((await acc.login({ id: 'iplim1', pw: 'abc123' }, myIp)).ok, true, 'ครบนาที');
  }],
  ['โทเคน: ใช้ได้ 90 วัน · หมดอายุ → auth · ออกจากระบบ → ใช้ไม่ได้ · เก็บ 8 อันล่าสุด', async () => {
    const { acc, c } = mkAcc();
    const r = await acc.register({ id: 'tokky', pw: 'abc123' }, ip());
    eq((await acc.verify('tokky', r.token)).ok, true, 'ใช้ได้');
    eq((await acc.verify('tokky', 'f'.repeat(48))).err, 'auth', 'โทเคนปลอม');
    eq((await acc.verify('other', r.token)).err, 'auth', 'ไอดีอื่น');
    c.add(89 * 864e5);
    eq((await acc.verify('TOKKY', r.token)).ok, true, '89 วัน');
    c.add(2 * 864e5);
    eq((await acc.verify('tokky', r.token)).err, 'auth', '91 วัน');
    const toks = [];
    for (let i = 0; i < 9; i++) toks.push((await acc.login({ id: 'tokky', pw: 'abc123' }, ip())).token);
    eq((await acc.verify('tokky', toks[0])).err, 'auth', 'อันแรกถูกดันออก (เก็บ 8)');
    eq((await acc.verify('tokky', toks[1])).ok, true, 'อันที่ 2 ยังใช้ได้');
    await acc.logout('tokky', toks[8]);
    eq((await acc.verify('tokky', toks[8])).err, 'auth', 'ออกแล้วใช้ไม่ได้');
    eq((await acc.verify('tokky', toks[7])).ok, true, 'โทเคนเครื่องอื่นไม่โดน');
  }],
  ['GM: สมัครไอดี GM ไม่ได้ (taken) · GM_ALLOW_REG=1 ได้และ gm:true · ไอดีอื่น gm:false', async () => {
    const a = mkAcc();
    eq((await a.acc.register({ id: 'Tiksi', pw: 'abc123' }, ip())).err, 'taken', 'ปิดสมัคร GM');
    const b = mkAcc({ GM_ALLOW_REG: '1' });
    const r = await b.acc.register({ id: 'tiksi', pw: 'abc123' }, ip());
    eq(r.ok, true, 'เปิดสมัคร'); eq(r.gm, true, 'gm');
    eq((await b.acc.login({ id: 'TIKSI', pw: 'abc123' }, ip())).gm, true, 'ล็อกอิน gm');
    eq((await b.acc.register({ id: 'normal1', pw: 'abc123' }, ip())).gm, false, 'ไอดีธรรมดา');
    const c2 = mkAcc({ GM_IDS: 'boss1' });
    eq((await c2.acc.register({ id: 'boss1', pw: 'abc123' }, ip())).err, 'taken', 'GM_IDS จาก env');
    eq((await c2.acc.register({ id: 'tiksi', pw: 'abc123' }, ip())).gm, false, 'env ตั้งเองแทนค่าเริ่มต้น');
  }],

  /* ---------- เซฟ ---------- */
  ['เซฟ: ตัวละครใหม่ seq 0 · เซฟแล้วโหลดคืนครบ · เวอร์ชันตรงกับ src/config.js', async () => {
    const c = clock(), saves = createSaves({ store: memoryStore(), now: c.now });
    const d0 = await saves.load('p1');
    eq(d0.seq, 0, 'seq'); eq(d0.server.coin, 0, 'coin'); eq(JSON.stringify(d0.systems), '{}', 'systems');
    const r = await saves.save('p1', { sid: SID, seq: 1, systems: { movement: { x: 5, y: 6 } } });
    eq(r.ok, true, 'ok');
    const d1 = await saves.load('p1');
    eq(d1.systems.movement.x, 5, 'x'); eq(d1.seq, 1, 'seq'); eq(d1.v, SAVE_VERSION, 'v');
    const cfg = await import('../src/config.js');
    eq(cfg.SAVE_VERSION, SAVE_VERSION, 'SAVE_VERSION เกม vs เซิร์ฟเวอร์');
    eq(cfg.SAVE_PREFIX, PREFIX, 'คีย์ eld6:');
  }],
  ['เซฟ: ถี่กว่า 1 วิ → rate · seq ไม่เพิ่ม → old (ตอบ seq ล่าสุด) · seq <1/ผิดรูป → bad', async () => {
    const c = clock(), saves = createSaves({ store: memoryStore(), now: c.now });
    eq((await saves.save('p', { sid: SID, seq: 1, systems: {} })).ok, true, '1');
    c.add(500);
    eq((await saves.save('p', { sid: SID, seq: 2, systems: {} })).err, 'rate', 'ถี่');
    c.add(600);
    const o = await saves.save('p', { sid: SID, seq: 1, systems: { a: 1 } });
    eq(o.err, 'old', 'seq เท่าเดิม'); eq(o.seq, 1, 'ตอบ seq ล่าสุด');
    eq((await saves.save('p', { sid: SID, seq: 0, systems: {} })).err, 'bad', 'seq 0');
    eq((await saves.save('p', { sid: SID, seq: 'x', systems: {} })).err, 'bad', 'seq ไม่ใช่เลข');
    eq((await saves.save('p', { sid: SID, seq: 5, systems: [] })).err, 'bad', 'systems เป็นอาร์เรย์');
    eq((await saves.save('p', { sid: SID, seq: 5, systems: { 'Bad Id': 1 } })).err, 'bad', 'ชื่อระบบผิด');
    const many = {}; for (let i = 0; i < 65; i++) many['s' + i] = 1;
    eq((await saves.save('p', { sid: SID, seq: 5, systems: many })).err, 'bad', '>64 ระบบ');
    c.add(1100);
    eq((await saves.save('p', { sid: SID, seq: 7, systems: { a: 2 } })).ok, true, 'ข้ามเลขได้ (7)');
    eq((await saves.load('p')).seq, 7, 'seq 7');
  }],
  ['เซฟ: ใหญ่เกิน 256 KB → size · พอดีขนาดผ่าน', async () => {
    const c = clock(), saves = createSaves({ store: memoryStore(), now: c.now });
    eq((await saves.save('p', { sid: SID, seq: 1, systems: { big: 'x'.repeat(MAX_SAVE_CHARS) } })).err, 'size', 'ใหญ่');
    eq((await saves.save('p', { sid: SID, seq: 1, systems: { big: 'x'.repeat(MAX_SAVE_CHARS - 20) } })).ok, true, 'พอดี');
  }],
  ['เงิน: เครื่องผู้เล่นเขียน server.coin ไม่ได้ · เซิร์ฟเวอร์เปลี่ยนได้ · เพดาน 99,999,999', async () => {
    const c = clock(), saves = createSaves({ store: memoryStore(), now: c.now });
    eq((await saves.updateServer('rich', s => ({ ...s, coin: 500 }))).coin, 500, 'ให้เงิน');
    await saves.save('rich', { sid: SID, seq: 1, systems: { stats: { coin: 9e9 } }, server: { coin: 9e9 } });
    c.add(1100);
    await saves.save('rich', { sid: SID, seq: 2, systems: { server: { coin: 9e9 } } });
    const d = await saves.load('rich');
    eq(d.server.coin, 500, 'เงินยังเท่าเดิม');
    eq((await saves.updateServer('rich', s => ({ ...s, coin: 1e12 }))).coin, COIN_MAX, 'เพดาน');
    eq(COIN_MAX, 99999999, 'ค่าเพดาน DECISIONS');
    eq((await saves.updateServer('rich', s => ({ ...s, coin: -5 }))).coin, 0, 'ไม่ติดลบ');
  }],

  /* ---------- ข้อความ ws (proto) ---------- */
  ['proto: ต่อแล้วได้ welcome+เวลา · ยังไม่ล็อกอิน load/save → err auth · time ตอบเวลาเซิร์ฟเวอร์', async () => {
    const { proto, send, c } = mkProto();
    const k = fakeConn(); proto.open(k);
    eq(k.out[0].t, 'welcome', 'welcome'); eq(k.out[0].s, c.t, 'เวลา');
    eq((await send(k, { t: 'load', r: 1, sid: SID })).why, 'auth', 'load');
    eq((await send(k, { t: 'save', sid: SID, r: 2, seq: 1, systems: {} })).why, 'auth', 'save');
    const t = await send(k, { t: 'time', r: 3, c: 123 });
    eq(t.t, 'time', 't'); eq(t.c, 123, 'c'); eq(t.s, c.t, 's'); eq(t.r, 3, 'r');
  }],
  ['proto: สมัคร → โหลด (ตัวใหม่) → เซฟ → hello ด้วยโทเคนจากเครื่องใหม่ → โหลดได้ของเดิม', async () => {
    const { proto, send, c } = mkProto();
    const a = fakeConn(); proto.open(a);
    const reg = await send(a, { t: 'register', r: 1, id: 'proto1', pw: 'abc123', name: 'พี' });
    eq(reg.t, 'auth_ok', 'auth_ok'); eq(reg.created, true, 'created'); truthy(reg.token, 'token');
    const l0 = await send(a, { t: 'load', r: 2, sid: SID });
    eq(l0.doc.seq, 0, 'ตัวใหม่');
    const s = await send(a, { t: 'save', sid: SID, r: 3, seq: 1, systems: { movement: { x: 1 } } });
    eq(s.t, 'save_ok', 'save_ok'); eq(s.seq, 1, 'seq');
    c.add(1500);
    const b = fakeConn(); proto.open(b);
    const h = await send(b, { t: 'hello', r: 1, id: 'proto1', token: reg.token });
    eq(h.t, 'auth_ok', 'hello'); eq(h.token, undefined, 'hello ไม่ออกโทเคนใหม่');
    eq((await send(b, { t: 'load', r: 2, sid: SID })).doc.systems.movement.x, 1, 'ของเดิม');
    eq((await send(b, { t: 'hello', r: 3, id: 'proto1', token: 'a'.repeat(48) })).why, 'auth', 'โทเคนผิด');
  }],
  ['proto: ไอดีเดียวเข้าซ้อน → ตัวเก่าได้ dupe ถูกตัด และเซฟไม่ได้อีก', async () => {
    const { proto, send } = mkProto();
    const a = fakeConn(); proto.open(a);
    const reg = await send(a, { t: 'register', id: 'dupe1', pw: 'abc123' });
    const b = fakeConn(); proto.open(b);
    await send(b, { t: 'hello', id: 'dupe1', token: reg.token });
    truthy(a.out.some(m => m.t === 'dupe'), 'ตัวเก่าได้ dupe');
    eq((await send(a, { t: 'save', sid: SID, seq: 1, systems: {} })).why, 'auth', 'ตัวเก่าเซฟไม่ได้');
    await new Promise(r => setTimeout(r, 350));
    eq(a.closed && a.closed.code, 4001, 'ตัวเก่าถูกปิด');
    eq(proto.sessions.get('dupe1'), b, 'เซสชันเป็นตัวใหม่');
  }],
  ['proto: เซฟพยายามเขียนเงิน → เงินไม่เปลี่ยน · logout แล้วใช้โทเคนเดิมไม่ได้', async () => {
    const { proto, send, saves } = mkProto();
    const a = fakeConn(); proto.open(a);
    const reg = await send(a, { t: 'register', id: 'cheat1', pw: 'abc123' });
    await saves.updateServer('cheat1', s => ({ ...s, coin: 77 }));
    eq((await send(a, { t: 'save', sid: SID, seq: 1, systems: { x: 1 }, server: { coin: 99999999 } })).t, 'save_ok', 'เซฟผ่าน');
    eq((await send(a, { t: 'load', sid: SID })).doc.server.coin, 77, 'เงินเท่าเดิม');
    eq((await send(a, { t: 'logout', r: 9 })).t, 'bye', 'bye');
    eq((await send(a, { t: 'load', sid: SID })).why, 'auth', 'ออกแล้ว load ไม่ได้');
    const b = fakeConn(); proto.open(b);
    eq((await send(b, { t: 'hello', id: 'cheat1', token: reg.token })).why, 'auth', 'โทเคนเดิมใช้ไม่ได้');
  }],
  ['proto: ข้อความผิดรูป → err bad · ผิดครบ 10 → ตัด · เกิน 30 ข้อความ/วิ → ตัด', async () => {
    const { proto } = mkProto();
    const a = fakeConn(); proto.open(a);
    await proto.message(a, 'not json');
    eq(a.last().why, 'bad', 'json เสีย');
    await proto.message(a, JSON.stringify({ t: 'hack' }));
    eq(a.last().why, 'bad', 'ชนิดไม่รู้จัก');
    await proto.message(a, JSON.stringify([1]));
    await proto.message(a, JSON.stringify({ t: 'time', r: { x: 1 } }));
    for (let i = 0; i < 6; i++) await proto.message(a, '{');
    eq(a.closed && a.closed.why, 'bad', 'ตัดหลัง 10');
    const b = fakeConn(); proto.open(b);
    for (let i = 0; i < MSG_PER_SEC; i++) await proto.message(b, JSON.stringify({ t: 'time' }));
    eq(b.closed, null, 'ยังไม่ตัดที่ 30');
    await proto.message(b, JSON.stringify({ t: 'time' }));
    eq(b.closed && b.closed.why, 'rate', 'ตัดที่ 31');
  }],

  /* ---------- เสิร์ฟไฟล์ HTTP ---------- */
  ['http: /v6/ → index · src/*.js ได้ · server/tests/spec/.md/.. ไม่ได้ · /assets/ ไม่มีไฟล์ → ให้เกมเดิมตอบ', () => {
    const R = V6.resolveStatic;
    eq(R('/v6').redirect, '/v6/', 'redirect');
    truthy(R('/v6/').file.endsWith(path.join('v6', 'index.html')), 'index');
    truthy(R('/v6/src/main.js').file.endsWith(path.join('v6', 'src', 'main.js')), 'main.js');
    eq(R('/v6/server/accounts.cjs').code, 404, 'server');
    eq(R('/v6/tests/run.cjs').code, 404, 'tests');
    eq(R('/v6/PLAN.md').code, 404, 'md');
    eq(R('/v6/src/../server/store.cjs').code, 400, '..');
    eq(R('/'), null, 'รากเป็นของเกมเดิม');
    eq(R('/api/login'), null, 'api เกมเดิม');
    eq(R('/assets/../server.js'), null, 'assets ..');
    eq(R('/assets/x.txt'), null, 'นามสกุลอื่น');
    eq(R('/assets/nope.png').missing, null, 'ไม่มีไฟล์ → เกมเดิมตอบ');
  }],
  ['IP ผู้เล่น (M1): ค่าเริ่ม auto ข้ามพร็อกซีภายใน/Cloudflare จากขวา · ตัวซ้ายปลอมไม่ได้ · ต่อตรงไม่เชื่อ header · V6_PROXY_HOPS ตั้งชั้นได้', () => {
    const R = (xff, sock, env = {}) => V6.clientIp({ headers: xff == null ? {} : { 'x-forwarded-for': xff }, socket: { remoteAddress: sock } }, env);
    /* Render แบบ "ต่อท้าย IP พร็อกซีของตัวเอง": ผู้เล่น 9.9.9.9 · ตัวท้ายเป็นพร็อกซีภายใน → ได้ผู้เล่น */
    eq(R('9.9.9.9, 10.1.2.3', '10.0.0.5'), '9.9.9.9', 'ข้ามพร็อกซีภายในตัวท้าย');
    /* ผ่าน Cloudflare + พร็อกซีภายใน */
    eq(R('9.9.9.9, 162.158.1.2, 10.1.2.3', '10.0.0.5'), '9.9.9.9', 'ข้าม Cloudflare');
    /* ผู้เล่นใส่ header ปลอมมาเอง → ตัวซ้ายถูกข้าม */
    eq(R('6.6.6.6, 9.9.9.9', '10.0.0.5'), '9.9.9.9', 'ปลอมตัวซ้ายไม่ได้');
    eq(R('6.6.6.6, 9.9.9.9, 10.0.0.7', '::ffff:10.0.0.5'), '9.9.9.9', 'socket แบบ ::ffff:');
    /* Render แบบ "ตัวท้าย = ผู้เล่น" ก็ได้ผลถูก */
    eq(R('1.1.1.1, 9.9.9.9', '10.0.0.5'), '9.9.9.9', 'ตัวท้ายเป็นผู้เล่น');
    /* ต่อตรง (socket เป็น IP สาธารณะ) → ไม่เชื่อ header */
    eq(R('1.2.3.4', '5.5.5.5'), '5.5.5.5', 'ต่อตรง ไม่เชื่อ header');
    eq(R(null, '5.5.5.5'), '5.5.5.5', 'ไม่มี header');
    eq(R('2001:db8::1, 10.0.0.9', '10.0.0.5'), '2001:db8:0:0:0:0:0:1', 'IPv6');
    /* ตั้งจำนวนชั้นเอง */
    eq(R('6.6.6.6, 9.9.9.9, 8.8.4.4', '10.0.0.5', { V6_PROXY_HOPS: '1' }), '8.8.4.4', 'HOPS=1 ตัวท้าย');
    eq(R('6.6.6.6, 9.9.9.9, 8.8.4.4', '10.0.0.5', { V6_PROXY_HOPS: '2' }), '9.9.9.9', 'HOPS=2');
    eq(R('9.9.9.9', '10.0.0.5', { V6_PROXY_HOPS: '3' }), '9.9.9.9', 'HOPS เกินความยาว → ตัวแรก');
    eq(R('9.9.9.9', '10.0.0.5', { V6_PROXY_HOPS: '0' }), '10.0.0.5', 'HOPS=0 ไม่อ่าน header');
  }],

  /* ---------- ต่อ ws จริง: /v6ws ไป v6 · path อื่นไปตัวเดิม (จำลอง server.js) ---------- */
  ['ws จริง: attach แยก /v6ws ออกจาก ws เกมเดิม · ล็อกอิน+เซฟผ่านซ็อกเก็ตจริง', async () => {
    const ws = loadWs();
    if (!ws) { console.log('     (ข้าม: ไม่มีโมดูล ws ในเครื่อง)'); return; }
    const http = require('http');
    const server = http.createServer((q, s) => { if (v6.http(q, s)) return; s.end('old'); });
    const oldWss = new ws.WebSocketServer({ server });
    oldWss.on('connection', s => s.send('old-hello'));
    const v6 = V6.createV6({ store: memoryStore(), env: { GM_IDS: 'tiksi' }, log: () => {}, wsLib: ws });
    v6.attach(server);
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const port = server.address().port;
    const open = p => new Promise((ok, no) => { const s = new ws.WebSocket(`ws://127.0.0.1:${port}${p}`); const q = []; s.on('message', m => q.push(String(m))); s.on('open', () => ok({ s, q })); s.on('error', no); });
    const next = async (c, n = 1) => { for (let i = 0; i < 100 && c.q.length < n; i++) await new Promise(r => setTimeout(r, 20)); return c.q[n - 1]; };
    try {
      const o = await open('/');
      eq(await next(o), 'old-hello', 'ws เกมเดิมยังทำงาน');
      const n = await open('/v6ws');
      eq(JSON.parse(await next(n)).t, 'welcome', 'v6 welcome');
      n.s.send(JSON.stringify({ t: 'register', id: 'wsreal1', pw: 'abc123' }));
      eq(JSON.parse(await next(n, 2)).t, 'auth_ok', 'สมัคร');
      n.s.send(JSON.stringify({ t: 'save', sid: SID, seq: 1, systems: { a: { b: 1 } } }));
      eq(JSON.parse(await next(n, 3)).t, 'save_ok', 'เซฟ');
      eq(oldWss.clients.size, 1, 'ws เกมเดิมไม่ได้รับ /v6ws');
      const res = await new Promise(r => http.get(`http://127.0.0.1:${port}/v6/`, x => { let b = ''; x.on('data', d => b += d); x.on('end', () => r({ code: x.statusCode, b })); }));
      eq(res.code, 200, '/v6/'); truthy(res.b.includes('src/main.js'), 'หน้า v6');
      truthy(res.b.includes('<html data-v6-server="1"'), 'ติดป้ายมีเซิร์ฟเวอร์ให้เกมต่อ ws');
      const root = await new Promise(r => http.get(`http://127.0.0.1:${port}/`, x => { let b = ''; x.on('data', d => b += d); x.on('end', () => r(b)); }));
      eq(root, 'old', 'รากยังเป็นเกมเดิม');
      o.s.close(); n.s.close();
    } finally { v6.stop(); for (const c of oldWss.clients) c.terminate(); oldWss.close(); server.closeAllConnections?.(); await new Promise(r => server.close(r)); }
  }],
  ['ปิด /v6ws ไว้จนกว่า V6_ENABLE=1 — ไม่แตะตัวรับ upgrade ของเกมเดิม', () => {
    eq(V6.enabled({}), false, 'ไม่ตั้ง env = ปิด');
    eq(V6.enabled({ V6_ENABLE: '0' }), false, '0 = ปิด');
    eq(V6.enabled({ V6_ENABLE: '1' }), true, '1 = เปิด');
    const saved = process.env.V6_ENABLE; delete process.env.V6_ENABLE;
    const { EventEmitter } = require('events'); const srv = new EventEmitter(); const f = () => {};
    srv.on('upgrade', f);
    eq(V6.attach(srv), null, 'ไม่ attach');
    eq(srv.listeners('upgrade').length, 1, 'ตัวรับเดิมยังอยู่'); eq(srv.listeners('upgrade')[0], f, 'ตัวเดิมตัวเดียวกัน');
    if (saved !== undefined) process.env.V6_ENABLE = saved;
  }],
];
