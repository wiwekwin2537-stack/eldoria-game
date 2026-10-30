# 🔌 สัญญาโค้ด v6 — ทุกคนที่เขียนโค้ดต้องอ่านก่อน (หัวหน้างานเป็นเจ้าของไฟล์นี้ · เปลี่ยนได้เฉพาะหัวหน้า)

ภาษา: JavaScript ES modules ล้วน (ไม่มี build step · ไม่มี framework) · เบราว์เซอร์โหลด `v6/index.html` → `src/main.js`
ทดสอบ: `node v6/tests/run.cjs` (Node 18+) · เปิดเกมในเครื่อง: `node v6/tools/dev-server.cjs 8820` แล้วเปิด `http://127.0.0.1:8820/v6/`

## 1. รูปแบบไฟล์ระบบ (`src/systems/*.js`)
ทุกระบบ export อ็อบเจกต์ default หน้าตานี้ (ทุกฟิลด์ไม่บังคับ ยกเว้น `id`):
```js
export default {
  id: 'movement',                 // ชื่อไม่ซ้ำ = ชื่อไฟล์
  init(G) {},                     // เรียกครั้งเดียวตอนเริ่มเกม
  update(G, dt) {},               // ทุกเฟรม dt ≤ 0.05 วิ
  draw(G, ctx, layer) {},         // layer: 'ground' | 'world' | 'top' | 'ui'
  save(G) { return {...} },       // ข้อมูลของระบบนี้ที่ต้องเซฟ (JSON ล้วน) — ไม่มี = ไม่เซฟ
  load(G, data) {},               // รับข้อมูลที่ save() เคยคืน (data อาจเป็น undefined = ตัวละครใหม่)
};
```
- ลำดับทำงาน = ลำดับใน `src/systems/index.js` (ไฟล์เดียวที่รวมรายชื่อระบบ) · เพิ่มระบบ = เพิ่ม 1 บรรทัดในไฟล์นั้น
- **ลำดับบังคับ** (หัวหน้าอนุมัติ 30 ต.ค.): `input` แรกสุด (สร้าง pressed/click ใหม่ต้นเฟรม · ระบบอื่นห้ามล้าง) → `render` ที่ 2 (ล้างจอ + ตั้งพิกัดวาดของแต่ละชั้น) → ระบบเกม → `camera` ท้ายสุด
- **วาดเรียงหน้า-หลัง**: ของที่ต้องบังกันตามแกน y (ต้นไม้ อาคาร ตัวละคร NPC มอน) ส่งเข้าคิวในชั้น `'world'` ด้วย `zpush(y, fn)` จาก `core/zsort.js` · loop วาดคิวเรียง y หลังทุกระบบวาดชั้นนั้นเสร็จ · ห้ามแยกวาดหน้า/หลังตัวเราเอง
- **หยุดเกม**: `G.paused = true` หรือ `G.cam.portrait = true` → loop ไม่เรียก `update` และเวลาเกมไม่เดิน ยกเว้นระบบที่ประกาศ `always: true` (input · render · camera · login · ui) · `draw` ยังทำทุกเฟรม
- **ห้าม import ไฟล์ระบบอื่นเพื่อแก้ค่า/ฟังก์ชันของมัน** · คุยกันผ่าน `bus` หรือฟังก์ชันที่อีกระบบ export ไว้ชัดเจน (`export function ...`) และระบุในหัวข้อ 4
- ห้ามแก้ฟังก์ชันของโมดูลอื่นด้วยการกำหนดค่าทับ (ES modules ไม่ยอมอยู่แล้ว — ห้ามหาทางเลี่ยงผ่าน `window`)
- ห้ามใช้ตัวแปร global (`window.xxx`) ยกเว้น `window.__G` สำหรับเทสในเบราว์เซอร์

## 2. สถานะเกม `G` (สร้างใน `src/core/state.js`)
| ฟิลด์ | เจ้าของ (ระบบที่เขียนค่าได้) | ความหมาย |
|---|---|---|
| `G.player` | หลายระบบ — แต่ละฟิลด์ย่อยมีเจ้าของตามตารางล่าง | ตัวละครเรา |
| `G.scene` | `world` | `{ id, map, w, h, tw, th, floor?, kind, camOy? }` แมพปัจจุบัน · **w/h เป็น px** · tw/th = ช่อง · floor = ชั้นดัน/หอคอย · camOy ไม่บังคับ (ทุ่ง .58 · ค่าเริ่ม .55 · ดัน .5 — spec01 §3) |
| `G.cam` | `core/camera` | `{ x, y, zoom:1, vw, vh, res, portrait, shake }` ห้ามซูม (DECISIONS) · vw/vh = ขนาดโลกที่เห็น (px) · res = คุณภาพภาพ |
| `G.paused` | `core/ui` (เมนูตั้งค่า) | true = หยุดเกม (ดู §1) |
| `G.input` | `core/input` | สถานะปุ่มที่แปลงแล้ว (ดูหัวข้อ 5) |
| `G.time` | `core/loop` | `{ now, dt, frame }` |
| `G.net` | `core/net` | สถานะเชื่อมต่อ |
| `G.ui` | `core/ui` | หน้าต่างที่เปิดอยู่ |

`G.player` ฟิลด์เฟส 1: `id name` (login) · `x y dir moving` (movement · px · **world เขียนได้เฉพาะตอนเปลี่ยนฉาก**) · `dash:{t,cd,iframe,dv,since,used,perfect}` `anim` (movement) · `look` `weapon` (hero อ่านอย่างเดียว · เจ้าของ = ระบบชุด/อาชีพในเฟสหลัง) · `scene` (world) · `hp mp maxHp maxMp` (stats — เฟส 1 ใช้ค่าคงที่ใน data) · `sp` แรง: **movement เป็นเจ้าของ** (หัก/ฟื้นจากเดิน วิ่ง พุ่ง · หัวหน้าตัดสิน 30 ต.ค.) ระบบอื่นขอใช้แรงผ่านฟังก์ชันของ movement · `lv xp` (เฟส 2) · `coin` **อ่านอย่างเดียวในเกม เซิร์ฟเวอร์เป็นคนเปลี่ยน** (DECISIONS)
- เพิ่มฟิลด์ใหม่ใน `G.player` → เพิ่มแถวในตารางนี้ (ขอหัวหน้า) พร้อมระบุเจ้าของ

## 3. ข้อมูล `src/data/*.js`
- ค่าเครื่องยนต์ (ขนาดจอ `VIEW` · ตารางคุณภาพ `GQ` · เวลาแตะ) อยู่ `data/view.js` (หัวหน้าอนุมัติ 30 ต.ค.)
- ไฟล์ข้อมูล export ค่าคงที่ล้วน (`export const MAPS = {...}`) ไม่มี logic · ตัวเลขเศรษฐกิจอยู่ `data/economy.js` เท่านั้น
- ค่าที่มาจากเกมเดิม: หมายเหตุท้ายบรรทัด `/* spec01 §4 */` ชี้หัวข้อในสเปก · ค่าที่ต่างจากเกมเดิมเพราะ DECISIONS: `/* DECISIONS 2026-10-30 */`

## 4. อีเวนต์ `bus` (`src/core/bus.js` : `on(name, fn)` `off(name, fn)` `emit(name, data)`)
| อีเวนต์ | ใครส่ง | ข้อมูล |
|---|---|---|
| `scene:enter` | world | `{ from, to, x, y }` |
| `player:dash` | movement | `{ x, y, dir }` |
| `ui:open` / `ui:close` | core/ui | `{ id }` |
| `net:status` | core/net | `{ online }` |
| `save:request` | ใครก็ได้ | — (core/save เซฟครั้งถัดไป) |
| `player:perfect-dodge` | movement | `{ x, y }` หลบพอดีจังหวะ (DECISIONS 01:20 · ผลจอช้า/สกิล +30% ระบบต่อสู้ทำ) |
| `world:use` | world | `{ id, scene }` กด E ที่จุดใช้งานที่ไม่ใช่ประตู (เช่น คลังสินค้า) |
| `world:blocked` | world | `{ link, lv, scene }` เข้าประตูไม่ได้ (เลเวลไม่ถึง) |
| `net:auth` | core/net | `{ id, name, gm }` ล็อกอินสำเร็จ (หัวหน้าอนุมัติ 30 ต.ค. · 1B) |
| `net:kicked` | core/net | `{ reason }` ถูกเตะ/ล็อกอินที่เครื่องอื่น |
| `save:loaded` | core/save | `{ isNew }` โหลดเซฟเสร็จ ทุกระบบได้ load() แล้ว |
| `save:status` | core/save | `{ ok, error? }` ผลเซฟล่าสุด |
- เพิ่มอีเวนต์ใหม่ → เพิ่มแถวที่นี่ใน commit เดียวกัน

## 4b. ฟังก์ชันที่ระบบ export ให้ระบบอื่นเรียก (อ่านอย่างเดียว / สั่งงาน)
| ระบบ | ฟังก์ชัน |
|---|---|
| `systems/world` | `hit` `tileAt` `isSolidAt` `enter` `follow` `linkNear` `getMap` `setChooser` `returnPoint` |
| `core/camera` | `screenToWorld` `worldToScreen` `shake` `setView` |
| `core/render` | `setQuality` `quality` `setFpsCap` |
| `core/input` | `setRunKey` `setJoySide` `setJoyRun` `joySettings` |
| `core/zsort` | `zpush` |
| `systems/movement` | `dodge` `stopClick` `clickGoal` |

## 5. การควบคุม (core/input แปลงทุกอุปกรณ์เป็นชุดเดียว)
`G.input = { mx, my, (ทิศเดิน −1..1) · run (true = วิ่ง: Ctrl ค้าง / ดันจอยเกิน .92 / อนาล็อกเกิน .93) · pressed: Set(action) · held: Set(action) · click:{wx,wy}|null }` · pressed/click อยู่ 1 เฟรม
action: `attack dash interact skill1..skill6 ult menu bag map recall skills potionHp potionMp quick1..quick4 eat mount auto status mute sheath chat back` (หัวหน้าอนุมัติเพิ่ม 30 ต.ค. · 1A-1) — ระบบอ่านแค่ action ไม่อ่านคีย์ตรงๆ · ปุ่มจริงแต่ละอุปกรณ์อยู่ `data/controls.js`

## 6. เวลา / เงิน / ของ
- เวลาที่มีผลต่อของ/รายวัน/คูลดาวน์ข้ามวัน: `srvNow()` จาก `core/time.js` เท่านั้น
- เงินและของที่ซื้อขายได้: เซิร์ฟเวอร์ถือ (DECISIONS) · ของเข้ากระเป๋าต้องผ่าน `bag.canTake()` (เฟส 4)
- เก็บค่าอุปกรณ์ต่อชิ้น: ทุกชิ้นมี `uid` (DECISIONS)

## 7. เทส
- `v6/tests/<ชื่อ>.test.js` export `default [ ['ชื่อเทส', () => { ... throw ถ้าพัง }], ... ]` · รันทั้งหมด `node v6/tests/run.cjs`
- ระบบที่วาดหรือใช้เบราว์เซอร์: เทสด้วย Playwright (`require('playwright')` ใช้ได้ในเครื่องทำงาน) ไฟล์ `v6/tests/browser/<ชื่อ>.spec.js`
- ห้าม push ถ้า `node v6/tests/run.cjs` ไม่ผ่าน

## 8. git
- push เฉพาะไฟล์ในโฟลเดอร์/ไฟล์ที่ใบงานให้ · `git pull --rebase origin main` ก่อน push · push ทุก 30–45 นาที และก่อนหยุด · ข้อความ commit ขึ้นต้น `v6 <งาน>:`
- ห้ามแตะเกมเดิม (`js/` `index.html` `server.js` ฯลฯ) เว้นแต่ใบงานสั่งชัด
