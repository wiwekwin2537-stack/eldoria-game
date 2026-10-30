/* login — หน้าเข้าสู่ระบบ/สมัคร + เริ่มต่อเซิร์ฟเวอร์และระบบเซฟ (เจ้าของ G.player.id · name)
   ลำดับใน systems/index.js: หลัง render (ไม่วาดบน canvas · UI เป็น HTML ใน #ui) ก่อนระบบเกม
   - init: net.connect → initSave(G, รายชื่อระบบทั้งหมด) · ต่อได้ + จำโทเคนไว้ → เข้าเกมเอง ไม่เห็นหน้านี้
   - หน้าบังจอแสดงเมื่อ: ต้องใส่ไอดี/รหัส · กำลังตรวจ · กำลังโหลดเซฟ · ถูกเตะ
     ต่อเซิร์ฟเวอร์ไม่ได้ / เปิดผ่าน dev-server (ไม่มีเซิร์ฟเวอร์ v6) → แค่ป้ายเล็กด้านบน ไม่บังจอ
   - ฟอร์มเป็น <input> → core/input ไม่รับคีย์ตอนพิมพ์ (เช็ก typing() ในไฟล์นั้น)
   หมายเหตุ: รายชื่อระบบ (./index.js) โหลดแบบ import() ใน init — ห้าม import ตรงหัวไฟล์ เพราะ index.js import ไฟล์นี้
   (วนกัน → ไฟล์ที่ import login.js ก่อน index.js พัง "Cannot access 'login' before initialization") */
import { on } from '../core/bus.js';
import * as net from '../core/net.js';
import { initSave } from '../core/save.js';

/* ข้อความไทยของรหัสผิดพลาด (PROTOCOL.md ตาราง why) */
export const ERR_TH = {
  'bad-id': 'ไอดีต้องเป็น a-z 0-9 _ หรือภาษาไทย 3–16 ตัว',
  'bad-pw': 'รหัสผ่านต้องยาว 6–64 ตัว',
  taken: 'ไอดีนี้มีคนใช้แล้ว',
  wrong: 'ไอดีหรือรหัสผ่านไม่ถูกต้อง',
  locked: 'ใส่รหัสผิดบ่อยเกินไป รออีก {sec} วินาที',
  rate: 'ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่',
  offline: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง',
  server: 'เซิร์ฟเวอร์ขัดข้อง ลองใหม่อีกครั้ง',
  busy: 'เซิร์ฟเวอร์ไม่ว่าง รอสักครู่แล้วลองใหม่',
  mismatch: 'รหัสผ่านทั้งสองช่องไม่ตรงกัน',
};
/* ถูกเตะเพราะอะไร → ข้อความ + ปุ่ม (replaced = ต่อใหม่เองแต่เครื่องอื่นเล่นอยู่ · 1B-g N3) */
export const KICK_TH = {
  dupe: 'ไอดีนี้เข้าเล่นจากเครื่องหรือแท็บอื่น',
  replaced: 'ไอดีนี้กำลังเล่นอยู่ที่เครื่องหรือแท็บอื่น — เครื่องนี้หยุดไว้ก่อน (ของที่เล่นหลังบันทึกล่าสุดบนเครื่องนี้ไม่ถูกบันทึก) · ถ้าจะเล่นที่เครื่องนี้ กดปุ่มด้านล่าง เครื่องอื่นจะออกจากเกม',
  auth: 'การเข้าสู่ระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่',
};
/* เซฟไม่เข้าระหว่างเล่น → ป้ายบนจอ (1B-g N2 · เดิม busy เงียบ ผู้เล่นไม่รู้ว่าเซฟไม่เข้า) · '' = ไม่ต้องแสดง
   offline มีป้ายของมันเอง · replaced/old = กำลังโหลดใหม่ (ปกติเร็ว แต่ถ้าโหลดไม่ผ่านจะถอยเวลา → ต้องมีป้าย · 1Z) */
export const SAVE_TH = {
  busy: 'เซิร์ฟเวอร์ไม่ว่าง — ยังไม่ได้บันทึก กำลังลองใหม่เอง (อย่าเพิ่งปิดเกม)',
  server: 'บันทึกไม่สำเร็จ — กำลังลองใหม่เอง (อย่าเพิ่งปิดเกม)',
  size: 'ข้อมูลตัวละครใหญ่เกิน บันทึกไม่ได้ — แจ้งผู้ดูแลเกม',
  bad: 'บันทึกไม่สำเร็จ (ข้อมูลผิดรูป) — แจ้งผู้ดูแลเกม',
  load: 'โหลดตัวละครไม่สำเร็จ — กำลังลองใหม่เอง',
  /* 1Z (1B-g L1): ถูกแทนที่/เซิร์ฟเวอร์มีเซฟใหม่กว่า → กำลังโหลดของล่าสุด (ระหว่างนี้ไม่บันทึก) */
  replaced: 'ไอดีนี้มีการเล่นที่เครื่องอื่น — กำลังโหลดข้อมูลล่าสุด (ระหว่างนี้ยังไม่บันทึก)',
  old: 'เซิร์ฟเวอร์มีข้อมูลที่ใหม่กว่า — กำลังโหลดข้อมูลล่าสุด (ระหว่างนี้ยังไม่บันทึก)',
};
export function saveErrText(err) { return (err && SAVE_TH[err]) || ''; }
export function errText(err, sec) { return (ERR_TH[err] || ERR_TH.server).replace('{sec}', sec || 0); }

/* ตรวจฟอร์มก่อนส่ง (กติกาเดียวกับเซิร์ฟเวอร์ · spec05 §1.2) → null = ผ่าน / รหัสผิดพลาด */
export const ID_RE = /^[A-Za-z0-9_ก-๙]{3,16}$/;
export function checkForm(mode, f) {
  if (!ID_RE.test(String(f.id || '').trim())) return 'bad-id';
  const pw = String(f.pw || '');
  if (mode === 'register') {
    if (pw.length < 6 || pw.length > 64) return 'bad-pw';
    if (pw !== String(f.pw2 || '')) return 'mismatch';
  } else if (!pw) return 'wrong';
  return null;
}

/* หน้าบังจอเมื่อไหร่ · ป้ายบนเมื่อไหร่ (ฟังก์ชันล้วน) */
export function viewOf(phase, loaded, busy = false) {
  if (phase === 'kicked') return 'kicked';
  if (phase === 'login' || (busy && phase === 'authing')) return 'form'; /* กดส่งฟอร์มอยู่ = ค้างฟอร์มไว้ (ผิดแล้วไอดีไม่หาย) */
  if (phase === 'authing') return loaded ? 'banner' : 'wait';
  if (phase === 'ready') return loaded ? 'none' : 'wait';
  return 'banner'; /* connecting / offline / nosrv */
}

const CSS = `
#lg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(8,10,20,.82);overflow:auto;padding:8px;box-sizing:border-box;z-index:50}
#lg .box{width:min(340px,100%);background:#1b1f33;border:1px solid #c9a24a;border-radius:12px;padding:12px 16px;box-shadow:0 6px 30px #000a;margin:auto}
#lg h1{margin:0 0 8px;font-size:20px;text-align:center;color:#ffd66b}
#lg .tabs{display:flex;gap:6px;margin-bottom:8px}
#lg .tabs button{flex:1;padding:7px;border-radius:8px;border:1px solid #556;background:#262b45;color:#ccd;font-size:15px}
#lg .tabs button.on{background:#c9a24a;color:#1b1f33;border-color:#c9a24a;font-weight:bold}
#lg label{display:block;font-size:13px;color:#aab;margin:5px 0 2px}
#lg input{width:100%;box-sizing:border-box;height:36px;font-size:16px;padding:4px 8px;border-radius:7px;border:1px solid #556;background:#0f1222;color:#fff}
#lg .go{width:100%;margin-top:10px;height:40px;font-size:17px;font-weight:bold;border:0;border-radius:8px;background:#3fa45b;color:#fff}
#lg .go:disabled{opacity:.5}
#lg .msg{min-height:18px;margin-top:6px;font-size:14px;color:#ff8a8a;text-align:center}
#lg .info{font-size:16px;text-align:center;color:#dde;padding:10px 0}
#lg-banner{position:absolute;top:6px;left:50%;transform:translateX(-50%);background:#000a;color:#ffd66b;font-size:13px;padding:3px 10px;border-radius:10px;pointer-events:none;z-index:50}
#lg .fields{display:grid;grid-template-columns:1fr;column-gap:12px}
@media (max-height:420px) and (min-width:560px){#lg .box{width:min(560px,100%)}#lg .fields{grid-template-columns:1fr 1fr}} /* มือถือแนวนอน: ช่องกรอก 2 คอลัมน์ */
@media (max-height:420px){#lg h1{font-size:16px;margin-bottom:4px}#lg label{margin-top:3px}#lg input{height:32px}#lg .go{height:36px;margin-top:6px}#lg .box{padding:8px 14px}}
`;

const U = { root: null, box: null, banner: null, mode: 'login', view: '', busy: false, loaded: false, kickReason: '', saveErr: '' };

function el(tag, attrs = {}, text) {
  const e = document.createElement(tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text != null) e.textContent = text;
  return e;
}

function renderForm() {
  const reg = U.mode === 'register';
  U.box.replaceChildren();
  U.box.append(el('h1', {}, 'ตำนานเอลโดเรีย'));
  const tabs = el('div', { class: 'tabs' });
  for (const [m, t] of [['login', 'เข้าสู่ระบบ'], ['register', 'สมัครใหม่']]) {
    const b = el('button', { type: 'button', 'data-mode': m, class: U.mode === m ? 'on' : '' }, t);
    b.onclick = () => { U.mode = m; renderForm(); };
    tabs.append(b);
  }
  U.box.append(tabs);
  const form = el('form', { autocomplete: 'on' });
  const fields = el('div', { class: 'fields' });
  form.append(fields);
  const field = (name, label, type, extra = {}) => { const f = el('div'); f.append(el('label', { for: 'lg-' + name }, label), el('input', { id: 'lg-' + name, name, type, ...extra })); fields.append(f); };
  field('id', 'ไอดี', 'text', { autocomplete: 'username', autocapitalize: 'off', spellcheck: 'false', maxlength: '16' });
  if (reg) field('name', 'ชื่อตัวละคร (ไม่ใส่ = ใช้ไอดี)', 'text', { maxlength: '14' });
  field('pw', 'รหัสผ่าน', 'password', { autocomplete: reg ? 'new-password' : 'current-password', maxlength: '64' });
  if (reg) {
    field('pw2', 'ยืนยันรหัสผ่าน', 'password', { autocomplete: 'new-password', maxlength: '64' });
  }
  const go = el('button', { type: 'submit', class: 'go' }, reg ? 'สมัครและเข้าเกม' : 'เข้าเกม');
  const msg = el('div', { class: 'msg', id: 'lg-msg' });
  form.append(go, msg);
  form.onsubmit = async e => {
    e.preventDefault();
    if (U.busy) return;
    const f = Object.fromEntries(new FormData(form));
    const bad = checkForm(U.mode, f);
    if (bad) { msg.textContent = errText(bad); return; }
    U.busy = true; go.disabled = true; msg.textContent = '';
    const r = U.mode === 'register' ? await net.register(f.id, f.pw, f.name) : await net.login(f.id, f.pw);
    U.busy = false; go.disabled = false;
    if (!r.ok) { msg.textContent = errText(r.err, r.sec); }
  };
  U.box.append(form);
}

function renderInfo(text, button) {
  U.box.replaceChildren(el('h1', {}, 'ตำนานเอลโดเรีย'), el('div', { class: 'info', id: 'lg-info' }, text));
  if (button) {
    const b = el('button', { type: 'button', class: 'go' }, button);
    b.onclick = () => location.reload();
    U.box.append(b);
  }
}

function show(view) {
  if (view === U.view) return;
  const prev = U.view;
  U.view = view;
  U.root.style.display = (view === 'form' || view === 'wait' || view === 'kicked') ? 'flex' : 'none';
  U.banner.style.display = view === 'banner' ? 'block' : 'none'; /* view none + เซฟไม่เข้า → update() เปิดเอง */
  if (view === 'form') { if (prev !== 'form') { renderForm(); } }
  else if (view === 'wait') renderInfo('กำลังโหลดตัวละคร…');
  else if (view === 'kicked') renderInfo(KICK_TH[U.kickReason] || KICK_TH.auth, U.kickReason === 'replaced' ? 'เล่นที่เครื่องนี้แทน' : 'เข้าสู่ระบบใหม่');
}

export default {
  id: 'login',
  always: true, /* หน้าล็อกอิน/ถูกเตะ ต้องแสดงแม้หยุดเกม (จอแนวตั้ง/เปิดเมนู) · CONTRACT §1 */
  init(G) {
    if (typeof document === 'undefined') return; /* เทสใน node: ไม่มีหน้าเว็บ */
    const ui = document.getElementById('ui');
    const style = el('style', {}, CSS);
    U.root = el('div', { id: 'lg' });
    U.box = el('div', { class: 'box' });
    U.root.append(U.box);
    U.banner = el('div', { id: 'lg-banner' }, 'กำลังเชื่อมต่อเซิร์ฟเวอร์…');
    U.root.style.display = 'none'; U.banner.style.display = 'none';
    ui.append(style, U.root, U.banner);
    on('net:auth', d => { G.player.id = d.id; G.player.name = d.name; });
    on('save:loaded', () => { U.loaded = true; U.saveErr = ''; });
    on('net:kicked', d => { U.kickReason = d.reason; });
    on('save:status', d => { U.saveErr = d.ok ? '' : d.error; });
    /* ตั้งระบบเซฟก่อนต่อเน็ต (กันพลาด net:auth) · import() เสร็จทันที เพราะ index.js โหลดไว้แล้ว */
    import('./index.js').then(m => { initSave(G, m.default); net.connect(G); });
  },
  update(G) {
    if (!U.root) return;
    show(viewOf(G.net.phase, U.loaded, U.busy));
    let t = '';
    if (U.view === 'banner') t = G.net.phase === 'offline' ? 'ออฟไลน์ — กำลังเชื่อมต่อใหม่…' : G.net.phase === 'nosrv' ? 'โหมดทดสอบ: ไม่มีเซิร์ฟเวอร์ (ไม่เซฟ)' : 'กำลังเชื่อมต่อเซิร์ฟเวอร์…';
    else if (U.view === 'none') t = saveErrText(U.saveErr); /* เซฟไม่เข้า (busy ฯลฯ) → ผู้เล่นต้องเห็น */
    else if (U.view === 'wait') {
      const info = document.getElementById('lg-info'), w = saveErrText(U.saveErr) || 'กำลังโหลดตัวละคร…';
      if (info && info.textContent !== w) info.textContent = w;
    }
    if (U.banner.textContent !== t && t) U.banner.textContent = t;
    const disp = t ? 'block' : 'none';
    if (U.banner.style.display !== disp) U.banner.style.display = disp;
  },
};
