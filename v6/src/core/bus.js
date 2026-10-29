/* bus — อีเวนต์ระหว่างระบบ (รายชื่ออีเวนต์อยู่ v6/CONTRACT.md §4) */
const handlers = new Map();

export function on(name, fn) {
  if (!handlers.has(name)) handlers.set(name, new Set());
  handlers.get(name).add(fn);
  return () => off(name, fn);
}

export function off(name, fn) {
  handlers.get(name)?.delete(fn);
}

export function emit(name, data) {
  const set = handlers.get(name);
  if (!set) return;
  for (const fn of [...set]) {
    try { fn(data); } catch (e) { console.error('[bus]', name, e); }
  }
}

/* ใช้ในเทสเท่านั้น */
export function _reset() { handlers.clear(); }
