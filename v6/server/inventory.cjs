/* กระเป๋าฝั่งเซิร์ฟเวอร์ v1: อุปกรณ์ต่อชิ้น/กอง99/น้ำหนักจำนวนเต็มหน่วย0.1กก.
   API ภายในเท่านั้น ไม่มี route ให้ client เขียน inventory/stats เอง
   catalog ชุดแรกเท่านั้น ยังไม่ใช่คราฟ/ตลาด/ตีบวกครบระบบ */
const { randomUUID } = require('crypto');
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
const plain = o => !!o && typeof o === 'object' && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;
const clone = o => structuredClone(o);
function fail(code) { const e = new Error(code); e.code = code; throw e; }
const uint = n => Number.isSafeInteger(n) && n >= 0;
const uidOk = id => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id);

async function createInventory({ uid = randomUUID } = {}) {
  const [{ ITEMS }, { ECONOMY: E }] = await Promise.all([import('../src/data/items.js'), import('../src/data/economy.js')]);
  const item = (id, type) => { if (!own(ITEMS,id) || (type && ITEMS[id].type !== type)) fail('inventory-item'); return ITEMS[id]; };
  function fresh() { return { version: 1, bagLevel: 0, stacks: {}, gear: {}, equipped: { sword: null } }; }
  function read(saved) {
    if (saved === undefined) return fresh();
    if (!plain(saved) || saved.version !== 1) fail('inventory-version');
    if (!uint(saved.bagLevel) || saved.bagLevel >= E.bagSlots.length || !plain(saved.stacks) || !plain(saved.gear) || !plain(saved.equipped)) fail('inventory-data');
    for (const [id,n] of Object.entries(saved.stacks)) { item(id,'stack'); if (!uint(n) || n === 0) fail('inventory-count'); }
    for (const [id,g] of Object.entries(saved.gear)) {
      if (!uidOk(id) || !plain(g) || g.uid !== id || !uidOk(g.itemId)) fail('inventory-gear');
      item(g.itemId,'gear');
      if (!uint(g.enhance) || !Array.isArray(g.options) || !Array.isArray(g.sockets) || !(g.rune === null || typeof g.rune === 'string') || typeof g.broken !== 'boolean') fail('inventory-gear');
    }
    for (const [slot,id] of Object.entries(saved.equipped)) {
      if (slot !== 'sword') fail('inventory-slot'); /* ชุดแรกมีช่องอาวุธเท่านั้น เพิ่มเกราะพร้อมทะเบียน/การย้ายschemaภายหลัง */
      if (id !== null && (!uidOk(id) || !own(saved.gear,id) || item(saved.gear[id].itemId).slot !== slot || saved.gear[id].broken)) fail('inventory-equipped');
    }
    if (!own(saved.equipped,'sword')) fail('inventory-equipped');
    return clone(saved);
  }
  function usage(saved, stats = { str:0, end:0 }) {
    const bag = read(saved);
    if (!plain(stats) || !uint(stats.str) || !uint(stats.end)) fail('inventory-stats');
    let slots = Object.keys(bag.gear).length, weight10 = 0;
    for (const [id,n] of Object.entries(bag.stacks)) { slots += Math.ceil(n / E.stackMax); weight10 += item(id).weight10 * n; }
    for (const g of Object.values(bag.gear)) weight10 += item(g.itemId).weight10;
    const maxWeight10 = E.bagWeight10[bag.bagLevel] + stats.str * E.strCarry10 + stats.end * E.endCarry10;
    if (![slots,weight10,maxWeight10].every(uint)) fail('inventory-overflow');
    return { slots, maxSlots: E.bagSlots[bag.bagLevel], weight10, maxWeight10 };
  }
  function fits(bag, stats) {
    const u = usage(bag, stats);
    if (u.slots > u.maxSlots) fail('bag-full');
    if (u.weight10 > u.maxWeight10) fail('bag-weight');
  }
  function add(saved, addition, stats) {
    const bag = read(saved);
    if (!plain(addition) || Object.keys(addition).some(k=>!['stacks','gear'].includes(k)) || (addition.stacks !== undefined && !plain(addition.stacks)) || (addition.gear !== undefined && !Array.isArray(addition.gear))) fail('inventory-add');
    for (const [id,n] of Object.entries(addition.stacks || {})) {
      item(id,'stack'); if (!uint(n) || n === 0 || !uint((bag.stacks[id] || 0) + n)) fail('inventory-count');
      Object.defineProperty(bag.stacks,id,{value:(bag.stacks[id]||0)+n,enumerable:true,writable:true,configurable:true});
    }
    for (const itemId of addition.gear || []) {
      item(itemId,'gear'); const id = uid();
      if (!uidOk(id) || own(bag.gear,id)) fail('inventory-uid');
      Object.defineProperty(bag.gear,id,{value:{uid:id,itemId,enhance:0,options:[],sockets:[],rune:null,broken:false},enumerable:true,writable:true,configurable:true});
    }
    fits(bag,stats); return bag;
  }
  function equip(saved, id, level, stats) {
    const bag = read(saved); if (!own(bag.gear,id) || !uint(level)) fail('inventory-gear');
    const g = bag.gear[id], def = item(g.itemId,'gear');
    if (!def.slot || g.broken) fail('inventory-equipped'); if (level < def.level) fail('inventory-level');
    bag.equipped[def.slot] = id; fits(bag,stats); return bag;
  }
  function unequip(saved, slot, stats) {
    const bag = read(saved); if (!own(bag.equipped,slot)) fail('inventory-slot');
    bag.equipped[slot] = null; fits(bag,stats); return bag;
  }
  return { fresh, read, usage, add, equip, unequip };
}
module.exports = { createInventory };
