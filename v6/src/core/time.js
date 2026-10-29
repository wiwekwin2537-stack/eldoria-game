/* time — เวลาเซิร์ฟเวอร์ (ห้ามใช้ Date.now() กับรายวัน/คูลดาวน์ที่มีผลต่อของ) */
let offset = 0;
let synced = false;

export function srvNow() { return Date.now() + offset; }
export function isSynced() { return synced; }

/* core/net เรียกเมื่อได้เวลาจากเซิร์ฟเวอร์ */
export function setServerTime(serverMs) {
  offset = serverMs - Date.now();
  synced = true;
}
