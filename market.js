// ตำนานเอลโดเรีย — 🏪 ตลาดกลาง + 🤝 เทรดระหว่างผู้เล่น (v5.03)
// หลักการ (กันของหาย/ของปั๊ม):
//  • ของที่ลงขาย/ของในเทรดที่ยืนยันแล้ว "ฝากไว้ที่เซิร์ฟเวอร์" (escrow) — เก็บไฟล์ + Upstash (eld:market) รอดการรีสตาร์ต
//  • ของทุกชิ้นส่งถึงมือผ่าน 📬 กล่องจดหมาย (ACC.mailAdd) → หลุดเกม/ออฟไลน์ก็ไม่หาย
//  • ซื้อ = จองก่อน (mkBuy) → เครื่องผู้ซื้อหักเงิน + เซฟขึ้นคลาวด์ → จ่าย (mkPay) → ส่งของ/เงินผ่านจดหมาย
//    เซิร์ฟเวอร์ไม่เคย "คืนเงิน" เอง → ไม่มีช่องเสกเงินจากการส่งข้อความปลอม
//  • ชนิดของ (KINDS) แยกเป็นทะเบียน — อนาคตจะเพิ่มของชนิดใหม่ (สัตว์ขี่/แฟชั่น/ของสัตว์เลี้ยง) แค่เพิ่มตัวตรวจในนี้ + ฝั่งเกม
const fs = require('fs'), path = require('path');
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data'), FILE = path.join(DATA, 'market.json');
const CFG = {
  TAX: +process.env.MK_TAX || 0.05,          /* ภาษีตลาด 5% (ดึงเงินออกจากระบบ) */
  MAX_LIST: +process.env.MK_MAX || 12,       /* ลงขายได้พร้อมกันต่อบัญชี */
  DUR: (+process.env.MK_HOURS || 72) * 3600e3, /* ลงขายนานสุด */
  HOLD: 25e3,                                 /* เวลาจองตอนกดซื้อ */
  HIST_DAYS: 14,
  TR_COMMIT: 30e3,                            /* เวลารอทั้งสองฝ่ายยืนยันตอนเทรด */
  TR_ITEMS: 8, MAX_PRICE: 1e9
};
// ---------- ทะเบียนชนิดของ ----------
const ID_RE = /^[A-Za-z0-9_:]{1,32}$/;
const KINDS = {
  mat: { norm(it, num) { const n = Math.floor(num(it.n, 0, 99999)); if (n < 1) return null; return { k: 'mat', id: String(it.id), n }; } },
  gear: { norm(it, num) { const o = Array.isArray(it.o) ? it.o.slice(0, 6).filter(x => Array.isArray(x) && /^[a-z]{1,10}$/.test(String(x[0]))).map(x => [String(x[0]), Math.round(num(x[1], 0, 999) * 1000) / 1000]) : null;
    return { k: 'gear', id: String(it.id), n: 1, e: Math.floor(num(it.e, 0, 30)), o: o && o.length ? o : null }; } }
};
function normItem(it, num) { if (!it || typeof it !== 'object' || !KINDS[it.k] || !ID_RE.test(String(it.id || ''))) return null; return KINDS[it.k].norm(it, num); }
const itemKey = it => it.k + ':' + it.id;

let H = null; // { players, send, ACC, clean, num, findByName }
const M = { list: [], next: 1, hist: {}, esc: [], gone: {}, void: {}, trlog: {}, t: 0 };
try { const j = JSON.parse(fs.readFileSync(FILE, 'utf8')); if (j && Array.isArray(j.list)) Object.assign(M, j); } catch (e) {}
let kvT = null;
function save() { M.t = Date.now(); const st = { list: M.list, next: M.next, hist: M.hist, esc: M.esc, gone: M.gone, void: M.void, trlog: M.trlog, t: M.t };
  try { fs.mkdirSync(DATA, { recursive: true }); const tmp = FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(st)); fs.renameSync(tmp, FILE); } catch (e) {}
  if (H && H.ACC && H.ACC.kvSet && !kvT) kvT = setTimeout(() => { kvT = null; H.ACC.kvSet('eld4:market', Object.assign({}, st, { t: Date.now() })); }, 800); }
const day = t => new Date((t || Date.now()) + 7 * 3600e3).toISOString().slice(0, 10);
const online = acct => { for (const p of H.players.values()) if (p.acct === acct && p.joined) return p; return null; };
async function deliver(acct, item) { if (!acct) return false; let m = null; try { m = await H.ACC.mailAdd(acct, item); } catch (e) {}
  const p = online(acct); if (p && m) { try { H.send(p, { t: 'mbox', list: await H.ACC.mailList(acct), fresh: m.id }); } catch (e) {} }
  if (!m) console.log('market: mail failed', acct, JSON.stringify(item).slice(0, 200)); return !!m; }

// ---------- ตลาด ----------
const pub = l => ({ id: l.id, item: l.item, price: l.price, seller: l.sn, t: l.t, exp: l.exp, held: !!(l.hold && l.hold.until > Date.now()) });
function stats() { const out = {}, cut = day(Date.now() - CFG.HIST_DAYS * 864e5); for (const k in M.hist) { const d = M.hist[k]; const a = []; for (const dd in d) if (dd > cut) a.push([dd].concat(d[dd])); if (a.length) out[k] = a.sort((x, y) => x[0] < y[0] ? -1 : 1); } return out; }
function record(it, price) { const k = itemKey(it), d = day(); const h = M.hist[k] || (M.hist[k] = {}); const r = h[d] || (h[d] = [0, 0, 0]); r[0]++; r[1] += it.n || 1; r[2] += price;
  const cut = day(Date.now() - (CFG.HIST_DAYS + 1) * 864e5); for (const kk in M.hist) { for (const dd in M.hist[kk]) if (dd < cut) delete M.hist[kk][dd]; if (!Object.keys(M.hist[kk]).length) delete M.hist[kk]; } }
function sendList(p) { if (!p) return; H.send(p, { t: 'mkls', list: M.list.map(pub), mine: p.acct ? M.list.filter(l => l.acct === p.acct).map(l => Object.assign(pub(l), { nonce: l.nonce })) : [], stats: stats(), tax: CFG.TAX, max: CFG.MAX_LIST }); }
function bumpAll() { for (const p of H.players.values()) if (p.joined && p.mkOpen && Date.now() - p.mkOpen < 30 * 60e3) sendList(p); }
function mkMsg(p, d, now) {
  const { send, num, clean } = H;
  if (d.t === 'mkq') { p.mkOpen = now; sendList(p); return true; }
  if (d.t === 'mkClose') { p.mkOpen = 0; return true; }
  if (!p.acct) { send(p, { t: 'mkNo', why: 'ต้องเข้าสู่ระบบบัญชีออนไลน์ก่อน', nonce: d.nonce }); return true; }
  if (/^mk(Sell|Buy|Cancel)$/.test(d.t)) { if (p.mkT && now - p.mkT < 250) { send(p, { t: 'mkNo', why: 'ช้าลงหน่อย', nonce: d.nonce, id: d.id, back: d.t === 'mkSell' ? 1 : 0 }); return true; } p.mkT = now; }
  switch (d.t) {
    case 'mkSell': { const nonce = clean(d.nonce, 24), it = normItem(d.item, num), price = Math.floor(num(d.price, 0, CFG.MAX_PRICE));
      if (!nonce || M.void[nonce]) { send(p, { t: 'mkNo', why: 'รายการนี้ถูกยกเลิกแล้ว', nonce, back: 1 }); return true; }
      const dup = M.list.find(l => l.nonce === nonce && l.acct === p.acct); if (dup) { send(p, { t: 'mkSellOk', nonce, id: dup.id }); return true; }
      if (!it || price < 1) { send(p, { t: 'mkNo', why: 'ข้อมูลของไม่ถูกต้อง', nonce, back: 1 }); return true; }
      if (M.list.filter(l => l.acct === p.acct).length >= CFG.MAX_LIST) { send(p, { t: 'mkNo', why: 'ลงขายได้สูงสุด ' + CFG.MAX_LIST + ' รายการ', nonce, back: 1 }); return true; }
      const l = { id: M.next++, nonce, acct: p.acct, sn: p.name, item: it, price, t: now, exp: now + CFG.DUR, hold: null }; M.list.push(l); save();
      send(p, { t: 'mkSellOk', nonce, id: l.id }); bumpAll(); return true; }
    case 'mkVoid': { const nonce = clean(d.nonce, 24); if (!nonce) return true; M.void[nonce] = now; const i = M.list.findIndex(l => l.nonce === nonce && l.acct === p.acct); if (i >= 0) M.list.splice(i, 1); save(); bumpAll(); return true; }
    case 'mkCancel': { const i = M.list.findIndex(l => l.id === (d.id | 0) && l.acct === p.acct); if (i < 0) { send(p, { t: 'mkNo', why: 'ไม่พบรายการ (อาจขายไปแล้ว)', id: d.id | 0 }); return true; }
      const l = M.list[i]; if (l.hold && l.hold.until > now) { send(p, { t: 'mkNo', why: 'มีคนกำลังซื้ออยู่ ลองใหม่ในอีกครู่', id: l.id }); return true; }
      M.list.splice(i, 1); M.gone[l.id] = { t: now, b: '' }; save(); deliver(l.acct, { k: 'mkret', item: l.item, why: 'ยกเลิกการขาย' }); send(p, { t: 'mkCancelOk', id: l.id }); bumpAll(); return true; }
    case 'mkBuy': { const l = M.list.find(x => x.id === (d.id | 0)); if (!l) { send(p, { t: 'mkNo', why: 'ของชิ้นนี้ถูกขายไปแล้ว', id: d.id | 0 }); return true; }
      if (l.acct === p.acct) { send(p, { t: 'mkNo', why: 'ซื้อของตัวเองไม่ได้', id: l.id }); return true; }
      if (l.hold && l.hold.until > now && l.hold.acct !== p.acct) { send(p, { t: 'mkNo', why: 'มีคนกำลังซื้อชิ้นนี้อยู่', id: l.id }); return true; }
      if ((d.price | 0) !== l.price) { send(p, { t: 'mkNo', why: 'ราคาเปลี่ยนแล้ว ลองรีเฟรช', id: l.id }); return true; }
      l.hold = { acct: p.acct, until: now + CFG.HOLD }; send(p, { t: 'mkHold', id: l.id, price: l.price, item: l.item }); bumpAll(); return true; }
    case 'mkChk': { const g = M.gone[d.id | 0], live = M.list.some(x => x.id === (d.id | 0)); send(p, { t: 'mkChk', id: d.id | 0, mine: !!(g && g.b && g.b === p.acct), live }); return true; }
    case 'mkRel': { const l = M.list.find(x => x.id === (d.id | 0)); if (l && l.hold && l.hold.acct === p.acct) { l.hold = null; bumpAll(); } return true; }
    case 'mkPay': { const l = M.list.find(x => x.id === (d.id | 0));
      const mine = l && l.hold && l.hold.acct === p.acct, free = l && !(l.hold && l.hold.until > now);
      if (!l || !(mine || free) || (d.price | 0) !== l.price || l.acct === p.acct) { send(p, { t: 'mkPayNo', id: d.id | 0, price: d.price | 0, why: 'ซื้อไม่ทัน — ของถูกขายไปแล้ว' }); return true; }
      M.list.splice(M.list.indexOf(l), 1); M.gone[l.id] = { t: now, b: p.acct }; const tax = Math.ceil(l.price * CFG.TAX); record(l.item, l.price); save();
      deliver(p.acct, { k: 'mk', item: l.item, paid: l.price, from: l.sn, lid: l.id });
      deliver(l.acct, { k: 'coin', n: l.price - tax, why: 'ขายของที่ตลาดกลาง ให้ ' + p.name + ' (หักภาษี ' + Math.round(CFG.TAX * 100) + '%)', mk: 1 });
      const s = online(l.acct); if (s) send(s, { t: 'mkSold', item: l.item, price: l.price, net: l.price - tax, by: p.name });
      send(p, { t: 'mkPayOk', id: l.id, item: l.item, price: l.price }); bumpAll(); return true; }
  }
  return false;
}
// ---------- เทรด ----------
const TR = new Map(); let trNext = 1;
/* v5.03: เทรดต้องเจอตัว — ฉากเดียวกัน ห่างไม่เกิน 220 พิกเซล (เจ้าของสั่ง: นัดเพื่อนมาเจอก่อนค่อยเทรด) */
const near = (a, b) => !!(a.st && b.st && a.sc && a.sc === b.sc && Math.hypot(a.st.x - b.st.x, a.st.y - b.st.y) <= 220);
const trOf = p => p.tr && TR.get(p.tr);
const other = (T, p) => T.a === p.id ? T.b : T.a;
function trState(T) { for (const id of [T.a, T.b]) { const p = H.players.get(id); if (!p) continue; const o = other(T, p);
  H.send(p, { t: 'trState', tid: T.id, st: T.st, me: T.off[id], them: T.off[o], lockMe: !!T.lock[id], lockThem: !!T.lock[o], okMe: !!T.ok[id], okThem: !!T.ok[o], comMe: !!T.com[id], name: T.nm[o], lv: T.lv[o] }); } }
function trEnd(T, why, keep) { TR.delete(T.id); for (const id of [T.a, T.b]) { const p = H.players.get(id); if (p) { if (p.tr === T.id) p.tr = 0; if (!keep) H.send(p, { t: 'trEnd', tid: T.id, why }); } } }
function normOffer(d, num) { const items = []; for (const x of (Array.isArray(d.items) ? d.items : []).slice(0, CFG.TR_ITEMS)) { const it = normItem(x, num); if (it) items.push(it); }
  return { items, coin: Math.floor(num(d.coin, 0, CFG.MAX_PRICE)) }; }
const sameOffer = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function trFinish(T) { const pa = T.acct[T.a], pb = T.acct[T.b], oa = T.off[T.a], ob = T.off[T.b];
  deliver(pb, { k: 'tr', items: oa.items, coin: oa.coin, from: T.nm[T.a] }); deliver(pa, { k: 'tr', items: ob.items, coin: ob.coin, from: T.nm[T.b] });
  M.esc = M.esc.filter(e => e.tid !== T.id); save();
  for (const id of [T.a, T.b]) { const p = H.players.get(id); if (p) H.send(p, { t: 'trDone', tid: T.id, got: T.off[other(T, p)], name: T.nm[other(T, p)] }); }
  trEnd(T, 'done', true); }
function trRefund(T, why) { for (const e of M.esc.filter(e => e.tid === T.id)) deliver(e.acct, { k: 'tr', items: e.off.items, coin: e.off.coin, from: '', back: 1, why });
  M.esc = M.esc.filter(e => e.tid !== T.id); save(); trEnd(T, why); }
function trMsg(p, d, now) {
  const { send, num, clean, findByName } = H;
  switch (d.t) {
    case 'trReq': { if (!p.acct) { send(p, { t: 'trNo', why: 'ต้องเข้าสู่ระบบบัญชีออนไลน์ก่อน' }); return true; }
      if (p.trReqT && now - p.trReqT < 3000) { send(p, { t: 'trNo', why: 'รอสักครู่ก่อนส่งคำขอใหม่' }); return true; } p.trReqT = now;
      const to = findByName(clean(d.to, 14)); if (!to || to === p) { send(p, { t: 'trNo', why: 'ไม่พบผู้เล่นที่ออนไลน์อยู่' }); return true; }
      if (!to.acct) { send(p, { t: 'trNo', why: to.name + ' ยังไม่ได้เข้าสู่ระบบบัญชี' }); return true; }
      if (to.acct === p.acct) { send(p, { t: 'trNo', why: 'เทรดกับบัญชีตัวเองไม่ได้' }); return true; }
      if (!near(p, to)) { send(p, { t: 'trNo', why: 'ต้องอยู่ใกล้กันถึงจะเทรดได้ — นัดเจอกันแล้วแตะตัวเพื่อน' }); return true; }
      if (trOf(p) || trOf(to)) { send(p, { t: 'trNo', why: 'มีคนกำลังเทรดอยู่' }); return true; }
      to.trInv = { from: p.id, t: now }; send(to, { t: 'trInv', fid: p.id, from: p.name, lv: p.st ? p.st.lv : 0 }); send(p, { t: 'trSent', to: to.name }); return true; }
    case 'trAns': { const f = H.players.get(d.fid | 0); const ok = p.trInv && p.trInv.from === (d.fid | 0) && now - p.trInv.t < 60e3; p.trInv = null;
      if (!f || !ok) { send(p, { t: 'trNo', why: 'คำขอเทรดหมดอายุแล้ว' }); return true; }
      if (!d.yes) { send(f, { t: 'trNo', why: p.name + ' ปฏิเสธการเทรด' }); return true; }
      if (trOf(p) || trOf(f) || !p.acct || !f.acct) { send(p, { t: 'trNo', why: 'เริ่มเทรดไม่ได้ตอนนี้' }); return true; }
      if (!near(p, f)) { send(p, { t: 'trNo', why: 'อยู่ห่างกันเกินไป — เดินไปใกล้ ๆ กันก่อน' }); send(f, { t: 'trNo', why: p.name + ' อยู่ห่างเกินไป' }); return true; }
      const T = { id: trNext++, a: f.id, b: p.id, st: 'open', off: { [f.id]: { items: [], coin: 0 }, [p.id]: { items: [], coin: 0 } }, lock: {}, ok: {}, com: {}, acct: { [f.id]: f.acct, [p.id]: p.acct }, nm: { [f.id]: f.name, [p.id]: p.name }, lv: { [f.id]: f.st ? f.st.lv : 0, [p.id]: p.st ? p.st.lv : 0 }, t: now };
      TR.set(T.id, T); f.tr = p.tr = T.id; for (const q of [f, p]) send(q, { t: 'trOpen', tid: T.id }); trState(T); return true; }
    case 'trSet': { const T = trOf(p); if (!T || T.st !== 'open' || T.id !== (d.tid | 0)) return true; const off = normOffer(d, num);
      if (sameOffer(off, T.off[p.id])) return true; T.off[p.id] = off; T.lock = {}; T.ok = {}; trState(T); return true; }
    case 'trLock': { const T = trOf(p); if (!T || T.st !== 'open' || T.id !== (d.tid | 0)) return true; T.lock[p.id] = !!d.on; T.ok = {}; trState(T); return true; }
    case 'trOk': { const T = trOf(p); if (!T || T.st !== 'open' || T.id !== (d.tid | 0)) return true; if (!(T.lock[T.a] && T.lock[T.b])) return true;
      if (!T.off[T.a].items.length && !T.off[T.a].coin && !T.off[T.b].items.length && !T.off[T.b].coin) { send(p, { t: 'trNo', why: 'ยังไม่มีของในเทรด' }); return true; }
      T.ok[p.id] = true; if (T.ok[T.a] && T.ok[T.b]) { T.st = 'commit'; T.dl = now + CFG.TR_COMMIT; for (const id of [T.a, T.b]) { const q = H.players.get(id); if (q) send(q, { t: 'trCommit', tid: T.id, mine: T.off[id] }); } }
      trState(T); return true; }
    case 'trCom': { const T = trOf(p); if (T && T.id === (d.tid | 0) && T.com[p.id]) return true;
      if (!T || T.st !== 'commit' || T.id !== (d.tid | 0)) { send(p, { t: 'trComNo', tid: d.tid | 0 }); return true; }
      T.com[p.id] = true; M.esc.push({ tid: T.id, acct: T.acct[p.id], off: T.off[p.id], t: now }); const lg = M.trlog[T.id] || (M.trlog[T.id] = { t: now, c: [] }); lg.c.push(p.acct); save();
      if (T.com[T.a] && T.com[T.b]) trFinish(T); else trState(T); return true; }
    case 'trChk': { const tid = d.tid | 0, lg = M.trlog[tid]; send(p, { t: 'trChk', tid, live: TR.has(tid), com: !!(lg && p.acct && lg.c.includes(p.acct)) }); return true; }
    case 'trX': { const T = trOf(p); if (!T || T.id !== (d.tid | 0)) return true; if (T.st === 'commit') trRefund(T, p.name + ' ยกเลิก — คืนของแล้ว'); else trEnd(T, p.name + ' ยกเลิกการเทรด'); return true; }
  }
  return false;
}
function init(h) { H = h;
  try { if (H.ACC && H.ACC.kvGet) H.ACC.kvGet('eld4:market').then(j => { if (!j || !Array.isArray(j.list) || (j.t || 0) <= (M.t || 0)) return; Object.assign(M, j); console.log('market: restored', M.list.length, 'listings'); afterLoad(); }).catch(() => {}); } catch (e) {}
  afterLoad();
  setInterval(() => { try { const now = Date.now(); let ch = false;
      for (const l of M.list.slice()) { if (l.hold && l.hold.until < now) l.hold = null; if (now > l.exp && !(l.hold)) { M.list.splice(M.list.indexOf(l), 1); M.gone[l.id] = { t: now, b: '' }; ch = true; deliver(l.acct, { k: 'mkret', item: l.item, why: 'หมดเวลาขาย' }); } }
      for (const k in M.gone) if (now - (M.gone[k].t || M.gone[k]) > 864e5) { delete M.gone[k]; ch = true; }
      for (const k in M.void) if (now - M.void[k] > 864e5) { delete M.void[k]; ch = true; }
      for (const k in M.trlog) if (now - M.trlog[k].t > 864e5) { delete M.trlog[k]; ch = true; }
      for (const T of [...TR.values()]) { if (T.st === 'commit' && now > T.dl) trRefund(T, 'อีกฝ่ายยืนยันไม่ทัน — คืนของแล้ว'); else if (T.st === 'open' && now - T.t > 30 * 60e3) trEnd(T, 'หมดเวลาเทรด'); }
      if (ch) { save(); bumpAll(); } } catch (e) { console.log('market tick', e.message); } }, 5000); }
/* เซิร์ฟเวอร์รีสตาร์ตกลางเทรด: ของที่ฝากไว้ (escrow) ส่งคืนเจ้าของทุกชิ้น */
function afterLoad() { if (!M.esc.length || !H) return; const L = M.esc.splice(0); for (const e of L) deliver(e.acct, { k: 'tr', items: e.off.items, coin: e.off.coin, from: '', back: 1, why: 'เซิร์ฟเวอร์รีสตาร์ตระหว่างเทรด — คืนของ' }); save(); }
function onMsg(p, d, now) { if (typeof d.t !== 'string') return false; if (d.t.startsWith('mk')) return mkMsg(p, d, now); if (d.t.startsWith('tr')) return trMsg(p, d, now); return false; }
function onClose(p) { const T = trOf(p); if (T && T.st === 'open') trEnd(T, p.name + ' ออกจากเกม — ยกเลิกเทรด'); /* ช่วง commit: รอครบเวลา แล้วค่อยส่ง/คืนผ่านจดหมาย */ }
module.exports = { init, onMsg, onClose, M, KINDS, CFG };
