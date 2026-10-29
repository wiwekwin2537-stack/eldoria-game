สถานะ: ผ่านตรวจ (แบบมีข้อแก้ — เติม/แก้ 6 จุด ✏️ · ดู "ผลตรวจอิสระ" ท้ายไฟล์)

# 05 — ออนไลน์และเซิร์ฟเวอร์ (สเปกระบบสุดท้ายจริง · v5.98)

ขอบเขต: `server.js` `accounts.js` `world.js` `pvp.js` `party.js` `market.js` `field.js` (อ่านครบทุกบรรทัด) + ฝั่งเกมที่คุยกับเซิร์ฟเวอร์
หมวดใน SYSTEMS.md: "เซฟ / ล็อกอิน / บัญชี", "ตลาดกลาง / เทรด", "ปาร์ตี้ / กิลด์", "PvP"
บอสโลก/ประมูลเขียนเฉพาะส่วนเซิร์ฟเวอร์ (รายละเอียดฉาก/รางวัลในหมวดบอส) · ต้นไม้/แร่ฝั่งเกมอยู่หมวดเก็บของ

---

## 0. ภาพรวมสถาปัตยกรรม

| ชั้น | ทำอะไร | ไฟล์ |
|---|---|---|
| HTTP `/api/*` | บัญชี เซฟ อันดับ กิลด์ เหรียญแฟชั่น เพื่อน (JSON POST, gzip ได้) | `accounts.js` `middleware/handle` |
| WebSocket (`ws`, path `/`) | ตำแหน่ง แชท PvP ปาร์ตี้ ตลาด/เทรด จดหมาย บอสโลก ประมูล แผงร้าน ต้นไม้/แร่ ส่งต่อข้อมูลมอน | `server.js:78` → ส่งต่อ `PARTY`→`MARKET`→`FIELD`→`PVP`→`WORLD` ตามลำดับ (`server.js:127-130`) |
| ที่เก็บถาวร | Upstash Redis REST (`UPSTASH_REDIS_REST_URL/_TOKEN`) หรือไฟล์ใน `DATA_DIR` | `accounts.js:2-8` |
| เสิร์ฟไฟล์เกม | `index.html` `js/*.js` `assets/...` (รายการ regex ยาว `server.js:14-44`) · โค้ด/ภาพจริงโหลดผ่าน jsDelivr ก่อน (`js/000-cdn.js`) | `server.js` |

- v6: ใช้ตาม DECISIONS — ยังไม่ใช้ CDN (jsDelivr) · ทำเกมให้เบาแทน ✏️
- เกมเป็น **ออนไลน์ 100%** — ไม่มีเซฟในดิสก์ของเครื่องแล้ว (v5.46 `js/004-core.js` ห่อ `localStorage` ให้ข้อมูลเกมอยู่ใน RAM) ต้องล็อกอินและโหลดเซฟจากเซิร์ฟเวอร์ก่อนสคริปต์เกมโหลด
- ที่อยู่เซิร์ฟเวอร์: `<meta name="eldoria-server" content="wss://eldoria-online-q0vs.onrender.com">` (index.html) หรือ `?server=` · HTTP base = แปลง ws→http (`SERVER_BOOT.base` `js/004-core.js:13`, `CLOUD.base` `js/031-core.js:7255`)
- Render: `render.yaml` (free, `MAX_PLAYERS=200`, `MAX_PER_IP=4`, `ALLOWED_ORIGINS=https://chatchai2537.github.io`) · `package.json` ต้องการแค่ `ws ^8.18` Node ≥18
- `USE_PAGES=1` → redirect หน้าแรกไป `GAME_URL` (GitHub Pages) และเสิร์ฟ sw.js ที่ลบตัวเอง — **ตัดออก** (เจ้าของสั่ง 2026-10-15 เลิกใช้ Pages) ค่าเริ่มต้นเสิร์ฟเอง
- `/api/pvptop` (GET, CORS *) คืนอันดับ PvP (`server.js:25`)

### env ทั้งหมด
| env | ค่าเริ่มต้น | ที่มา |
|---|---|---|
| PORT | 8787 | server.js:6 |
| MAX_PLAYERS / MAX_PER_IP | 1000 / 4 | server.js:7 |
| ALLOWED_ORIGINS | ว่าง (=ยอมทุก origin) | server.js:8 |
| AOI_R / AOI_MAX | 1000 / 40 | server.js:137 |
| DATA_DIR | `./data` | accounts.js:5 |
| UPSTASH_REDIS_REST_URL/TOKEN | — ต้องตั้งคู่กัน ไม่งั้น throw · บน Render ถ้าไม่มี Upstash ต้อง `ALLOW_FILE_STORE=1` ไม่งั้น throw | accounts.js:6-8 |
| GM_IDS | `tiksi,wiwekwin2537` | accounts.js:13 |
| GM_ALLOW_REG | — (=1 ให้สมัครไอดี GM ได้ชั่วคราว) | accounts.js:284 |
| UNFLAG_IDS | `armwasin,kakaboy2537,kittapas,chatchai1` | accounts.js:15 |
| FORCE_RELOGIN_AFTER / FORCE_RELOGIN_NAMES | `2026-10-17T20:40:00+07:00` / ว่าง=ทุกคน | accounts.js:82-85 |
| B150_ENABLE / B150_UNTIL / B150_MIN | ปิด / 2026-10-26 / 7 | accounts.js:147-151 |
| TOPUP_PROMPTPAY / TOPUP_NAME / TOPUP_CONTACT | ว่าง (=ปิดเติมเงิน) | accounts.js:222 |
| WB_HOURS / WB_HP / AUC_MIN | `12,20` / 4,500,000 / 10 | world.js:4-5 |
| DUEL_COUNT / DUEL_DUR / PVP_ORB_MS | 3000 / 90000 / 20000 ms | pvp.js:5 |
| MK_TAX / MK_MAX / MK_HOURS | 0.05 / 12 / 72 | market.js:11-13 |
| FIELD_REQUIRE_KIND | ปิด | field.js:20 |
| USE_PAGES / SERVE_LOCAL / GAME_URL | ตัดออก | server.js:167-170 |

### คีย์ที่เก็บ (prefix `eld4:` หลังรีเซ็ต v5.92)
| คีย์ Upstash | ไฟล์ (โหมดไฟล์) | เนื้อหา |
|---|---|---|
| `eld4:acct:<sha256(lid)[0:40]>` | `acct/<hash>.json` | บัญชี 1 คน (ดู §2.1) — เขียนด้วย Lua CAS เทียบเอกสารทั้งก้อน |
| `eld4:history:<hash>` (LIST 20) | `acct/<hash>.history.json` | snapshot เซฟเก่า 20 รุ่น `{rev,upd,lv,save,hash}` |
| `eld4:lb` | `lb.json` | ตารางอันดับ (map lid→entry, ≤5000) |
| `eld4:guilds` | `guilds.json` | กิลด์ทั้งหมด |
| `eld4:topq` | `topq.json` | คิวคำขอเติมเงิน (≤2000) |
| `eld4:world` | `world.json` + `eld4_world.json` | ล็อตประมูล + slot บอสโลก |
| `eld4:market` | `market.json` + `eld4_market.json` | ตลาด/escrow เทรด |
| `eld4:pvp` | `pvp.json` | เรตติ้ง ELO |
| `eld:dbtest` | — | `/api/dbtest` เขียนทดสอบ (ไม่มี prefix eld4) |

---

## 1. สมัคร / ล็อกอิน / รหัสผ่าน

### 1. ผู้เล่นเห็น/ทำอะไร
หน้าแรก (`#title`) → สมัคร (ไอดี · รหัส×2 · ชื่อตัวละคร · เลือกหน้าตา CC41) หรือ เข้าสู่ระบบ (ไอดี · รหัส · จดจำ) → หน้าโหลดใหม่ (`location.reload`) → `SERVER_BOOT.load` ดึงเซฟ → กด "เล่น" → เข้าเกม · เปลี่ยนรหัสในเมนูตั้งค่า → ถูกเด้งออกให้ล็อกอินใหม่

### 2. กติกาและตัวเลข
- ไอดี `/^[A-Za-z0-9_ก-๙]{3,16}$/` เทียบตัวเล็ก (lid) · รหัส 6–64 ตัว (`accounts.js:78,280`) · ฝั่งเกมเปลี่ยนรหัสต้อง `pwStrong` (มีตัวเลข+ตัวอักษร) · ชื่อ ≤14 ตัว ตัดอักขระควบคุม/`<>`
- รหัส: scrypt N=16384 r=8 p=1 32 ไบต์ + salt 16 ไบต์ (`accounts.js:75`)
- ใส่รหัสผิด ≥8 ครั้ง → ล็อก `min(900, 20×2^(n-8))` วินาที (หน่วยความจำเท่านั้น `lockTbl`) `accounts.js:294-296`
- โทเคน: สุ่ม 24 ไบต์ hex เก็บแค่ sha256 · อายุ 90 วัน · เก็บ 8 อันล่าสุด (`accounts.js:86-87`) · โทเคนที่ออกก่อน `FORCE_RELOGIN` ใช้ไม่ได้
- สมัคร: ไอดีซ้ำ → `taken` · ไอดีใน GM_IDS → `taken` (ยกเว้น `GM_ALLOW_REG=1`) · บัญชีใหม่ได้ **💠1000 เหรียญแฟชั่น** (`gem:1000`, log `signup`) `accounts.js:286`
- protocol 2 (ปัจจุบัน): สมัคร/ล็อกอินตั้ง `rec.writer=sha(token)` = เครื่องเดียวที่เซฟได้ · สมัครพร้อม `look` → สร้างเซฟเริ่มต้น `{fm_name, fm_cc41:'1', fm_look8:{g,top,pants,hair}}` (สีผิดรูปแบบ→ค่าเริ่ม #262631/#14141a/#302020)
- เปลี่ยนรหัส `/api/pw`: ตรวจรหัสเดิม → salt ใหม่ · ลบโทเคนทั้งหมด · ลบ writer/saveSeq · คืนโทเคนใหม่ → ฝั่งเกม `ONL32.kick` ให้ล็อกอินใหม่
- rate limit HTTP (`accounts.js:275`): ทุก `/api/*` 600/นาที/IP · `/api/save`+`/api/load` 120/นาที/(IP+ไอดี) · อื่นทั้งหมด (register/login/top/guild/gem/friends/pw) **รวมกัน** 40/นาที/IP · `/api/ping` `/api/dbtest` ไม่จำกัด
- ข้อความ error ฝั่งเกม: `CLOUD_ERR` (`js/031-core.js:7262`) + `onlErr32` (`js/063-fix32.js:4`)

### 3. ตารางข้อมูล
`GM_IDS` (accounts.js:13 · ซ้ำในเกม js/031-core.js:5647) · `UNFLAG_IDS` accounts.js:15 · `ID_RE` accounts.js:78 · `CLOUD_ERR` js/031-core.js:7262

### 4. หน้าจอ/ปุ่ม
หน้า title (`tLoginForm`, `tMain`, `tPlay` ห่อใน fix32) · overlay `#off32` "การเชื่อมต่อหลุด" + ปุ่มออกจากระบบ · ป้าย `#saveStatus32` "บันทึกไม่สำเร็จ · กำลังลองใหม่"

### 5. ออนไลน์ — ฟังก์ชันสุดท้าย
`accRegister` / `accLogin` / `accChangePw` = **ตัวที่กำหนดใหม่ใน `js/063-fix32.js:9-11`** (แทนที่ทั้งก้อน) → `ONL32.finish` เก็บโทเคนใน sessionStorage+localStorage (`cloud_tok_<id>`, `fm_acct`, `fm_go`, `fm_last_acct`, `fm_remember`) แล้ว reload
- ชั้นเก่าใน `js/031-core.js:3481` (บัญชีในเครื่อง) และ wrapper cloud.js `js/031-core.js:7266-7307` (ย้ายบัญชีในเครื่องขึ้นเซิร์ฟ/`fm_cloudpend`) = **ตัดออก** (ถูกแทนที่ ไม่ทำงาน)

### 7. บัค/ความขัดกัน
- `/api/pw` ไม่ล้าง `rec.document` → ไม่มีผล (เครื่องใหม่ activate ใหม่) แต่ v6 ควรล้างให้ครบ
- สมัครได้ 💠1000 ฟรี ขณะที่ `GEM_PKG` ขาย 💠1000 ≈ 799 บาท และเพดานเล่นฟรี 10/วัน → **ถามเจ้าของ** ว่าเป็นของช่วงเทสหรือจริง
- `lockTbl`/`ipHits` อยู่ใน RAM → รีสตาร์ตแล้วหาย · IP มาจาก `x-forwarded-for` ตัวแรก (ปลอมได้) → v6 ใช้ IP ที่ Render เติมท้าย

---

## 2. เซฟคลาวด์

### 2.1 บันทึกบัญชีบนเซิร์ฟเวอร์ (`rec`)
`{ id, name, salt, hash, created, rev, lv, upd, save, bak, tokens:[{h,exp}], gem, newbie150, gm, writer, document, writerBase, writerRev, saveSeq, writes:[opId ≤128], cls, stat:{floor,mine,kills}, flag, b150, mail:[≤100], friends:[≤200], fown:[], glog:[≤50], gday, gearn, gx, gt:{src:time}, recovery }`
- `save` = สตริง JSON ของ **object ที่ทุกคีย์ขึ้นต้น `fm_` และค่าเป็นสตริง** · `bak` = เซฟก่อนหน้า 1 รุ่น · `rev` เพิ่มทุกเซฟ

### 2.2 เนื้อในเซฟ (snapshot ที่เกมส่ง)
สร้างโดย `CLOUD.capture` (`js/063-fix32.js:15`) = `saveGame(true)` แล้ว `saveKeys8()` (`js/031-core.js:7201`) เก็บทุกคีย์ `fm_*` ยกเว้น `fm_(set|accts|acct|last_acct|remember|chatfold|dev|lock|gmkey8)` · ตั้ง `fm_save_v1.t=0` ก่อนส่ง (ให้เทียบซ้ำได้)

**`fm_save_v1`** (`saveGame` js/031-core.js:1888): `v:1, t, name, lv, xp, sp, stats(baseStats), hp, mp, fa, hu, armor{slot:id}, tier{sword,axe,pick}, tool, draw, bagLv, inv{matId:n, coin}, gear{itemId:n}, enh{itemId:+n}, sk(SK.own), qs(QS.slots), day(DAY.t), buffs[{id,t}]` (+ ของที่ยังไม่รู้จัก `__PEND8` ใส่คืน)

**คีย์อื่นในเซฟ** (ระบบเจ้าของคีย์อยู่หมวดอื่น — ตารางนี้ใช้ตรวจว่าเซฟใหม่ครบ):
| คีย์ | ตัวแปร/เนื้อหา | ไฟล์ |
|---|---|---|
| fm_name · fm_cc41 · fm_look8 · fm_lookfree8 | ชื่อ · สร้างตัวแล้ว · เพศ/สี · ใช้สิทธิ์แก้หน้าตาฟรี | 031, 069-fix38 |
| fm_x | `{dg:DG.max, q:QST, own:SK.own}` (`saveX` 031:2423) | 031 |
| fm_cls | `{cls, csk}` | 031 |
| fm_pt | ต้นพาสซีฟ `{a:[...]}` | 031 |
| fm_skbar · fm_msk7 · fm_train | แถบสกิล · ชำนาญ · หุ่นฝึก | 031 |
| fm_fash · fm_home · fm_rune · fm_smith · fm_vault8 · fm_pacc · fm_lost · fm_story · fm_enhtut7 · fm_mute8 · fm_mtab · fm_ev7 | แฟชั่น(own/wear) · บ้าน/สัตว์ขี่ · รูน · ตำราช่าง · คลัง · บัญชีรอง · ของหาย · เนื้อเรื่อง · บทสอน · ปิดแชท · แท็บเมนู · อีเวนต์ | 031 |
| fm_bcd8 · fm_lbcd64 | คูลดาวน์บอส | 032-fix1, 096-fix64 |
| fm_friends9 · fm_friends9_dirty | เพื่อน | 037/038, 104 |
| fm_stall10 · fm_tower10 | แผงร้าน · หอคอย | 040-fix9, 039-fix8 |
| fm_whet12 · fm_nmap15 · fm_bank19 · fm_stat20 | หินลับ · แผนที่ · ธนาคาร · สถิติ/เกียรติยศ `ST20` | 043,046,050,051 |
| fm_tip66 · fm_pb72 · fm_end92 · fm_end92_hi · fm_daily108 · fm_auto110 · fm_opt111 · fm_star112 · fm_gem117 · fm_seal118 · fm_gq125 · fm_visit134 · fm_gshop146 · fm_book65 | ต่าง ๆ | ตามเลขไฟล์ |
| fm_mkpend130 · fm_mkbuy130 · fm_trcom130 | รายการตลาด/เทรดค้าง (ใช้กู้ของ) | 157-fix130 |
| fm_hard10 | ถูกลบทิ้ง | 039 |

### 2.3 ส่งเซฟ `/api/save`
payload: `{ id, token, save, lv, cls, name, base, seq, document, protocol:2, ka, stat:{floor, mine, kills, boss, w, t, av, rift, rw} }`
- `stat` ถูกเติมโดย 3 ชั้นที่ห่อ `CLOUD.call`: fix20 (`floor,kills,boss,mine=ST20.ore,w=wealth20(),t=ฉายา` js/051-fix20.js:101) · fix65 (`av` รูปตัวละคร 097:6) · fix92 (`rift,rw` 124:91)
- **บีบอัด**: ถ้า payload >45,000 ไบต์ และมี `CompressionStream` → gzip, content-type `application/octet-stream` (`js/031-core.js:7260`) · เซิร์ฟเวอร์ดู magic `1f 8b` แล้ว gunzip (`accounts.js:380`) · `MAX_SAVE`=1,228,800 ตัวอักษร · `MAX_REQUEST`=MAX_SAVE×8+8192 ไบต์ (เกิน → 413)
- `keepalive` เมื่อ `ka` และ <60,000 ไบต์
- timeout ฝั่งเกม 40 วิ (`CLOUD.send`)

### 2.4 เซิร์ฟเวอร์ตรวจอะไรตอนเซฟ (`accounts.js:300-334`)
1. โทเคนถูก + `writer===sha(token)` (ไม่งั้น `session-replaced`) + `document` ตรงกับที่ activate ล่าสุด
2. ขนาด · JSON: ทุกคีย์ `fm_` ค่าเป็นสตริง · `fm_save_v1` เป็น object · ถ้าเซฟเดิม v1 มี `armor/inv/gear/enh` เซฟใหม่ต้องมีเป็น object ด้วย → ไม่งั้น `invalid-save`
3. ลำดับ: `seq` ≥1 · seq เก่ากว่า → `ignored` · seq เท่ากันแต่เนื้อต่าง → `sequence` · `base` ต้อง = rev (หรืออยู่ช่วง writerBase..rev ของ writer เดียวกัน) ไม่งั้น `conflict`
4. บันทึก: `bak=save เดิม`, `rev++`, `upd=now`, `lv=clamp(d.lv,0,200)`, `cls`, `name`, `stat` · CAS ไม่ผ่าน → ลองซ้ำ ≤3 ครั้ง
5. **ธงโกง**: เลเวลขึ้น ≥40 ในเซฟเดียว → `flag=max(2,flag+2)` (ซ่อนจากอันดับทันที) · lv0≥5 และขึ้น ≥25 ภายใน 30 นาทีจากเซฟก่อน → `flag+1` · ยกเว้น `UNFLAG_IDS` และเคส b150
6. อัปเดตกิลด์ (`gTouchMember`) + ตารางอันดับ (§9) · ตอบ `{ok, rev, seq, hash, upd, b150, rankSaved}`
- **ไม่ตรวจเนื้อหาเกมเลย** (เงิน ของ ตีบวก ค่าสเตตัส) — เชื่อไคลเอนต์ทั้งหมด

### 2.5 โหลด `/api/load` + เซสชันเดียว
- ก่อนสคริปต์เกมโหลด: `SERVER_BOOT.load` (`js/004-core.js:14`) POST `{id, token, protocol:2, activate:true, document:<UUID ใหม่ต่อการเปิดหน้า>}` → เซิร์ฟเวอร์ตั้ง `rec.document` (เครื่อง/แท็บเก่าเซฟไม่ได้อีก) → ตรวจ snapshot แล้วเขียนลง RAM storage
- ตอบ `{ok, protocol, seq, name, lv, rev, upd, save, b150}`
- `tPlay` (fix32) รอ `SCENEREADY.enter()` → `ONL32.verified=true` → ต่อ ws → `CLOUD.sync(true)` · ก่อน verified **ห้ามเซฟ** (`saveGame` คืน false)
- error `auth`/`session-replaced` → `ONL32.kick` กลับหน้าล็อกอิน

### 2.6 เซฟอัตโนมัติ (ชั้นสุดท้ายรวมกัน)
| ทริกเกอร์ | ผล | ที่มา |
|---|---|---|
| ทุก 20 วิ · beforeunload · ซ่อนแท็บ · เลเวลอัป · ล้มบอส · ของสำคัญ (ซื้อ/ขาย/จดหมาย) | `saveGame()` เขียน RAM | 031:1893, 1883-1884 |
| ทุก `saveGame` | debounce 150 ms → `CLOUD.sync(false)` | 139-fix107.js:5 |
| ทุก 3 วิ (แท็บเปิด) | `CLOUD.sync(false)` | 063-fix32.js:18 |
| ซ่อนแท็บ / pagehide | `CLOUD.sync(true,true)` keepalive | 139-fix107.js:6 |
| ออกเกม / สลับบัญชี / เปลี่ยนรหัส / ก่อนเทรด-ตลาด-ประมูล-แผง | `safeSync123()` รอส่งสำเร็จก่อน | 153-fix123.js:15 |
- คิว: `CLOUD.pending` (snapshot ล่าสุด 1 ชุด) · ส่งซ้ำได้ ≤8 รอบต่อ task · ล้มเหลว → `CLOUD.fails++` → `#off32` บังจอ หยุดเกม ลองใหม่ทุก 5 วิ
- error `auth/session-replaced/conflict/sequence/protocol` → kick
- QA bot (`__qa154`) หยุดเซฟทั้งหมดจนรีโหลด (181-fix154.js)
- ปุ่ม "💾 บันทึกตอนนี้" ถูกซ่อน · เมนู "ย้ายเซฟ" (export/import `exportSave8`/`importSave8` 031:7203) ถูกลบ → **ตัดออก**

### 2.7 สำรองในเครื่อง
- **ไม่มีแล้ว** (v5.46): ข้อมูลเกมอยู่ RAM เท่านั้น · ดิสก์เก็บแค่ `cloud_tok_*`, `fm_last_acct`, `fm_remember`, `fm_set`, `fm_chatfold`, `fm_dev`, `fm_lock` (`js/004-core.js:4-6`)
- คอมเมนต์ cloud.js "เซฟในเครื่องยังอยู่เป็นสำรองเสมอ" และ `CLOUD_SYNC_MS`, `CLOUD.applyBlob`, `CLOUD.boot`, `CLOUD.localLv` = **ตัดออก** (ไม่ได้ใช้)
- สำรองฝั่งเซิร์ฟเวอร์: `bak` 1 รุ่น + history 20 รุ่น (ทุกครั้งที่ save เปลี่ยน) · GM กู้ได้ทาง `/api/save-history` op `list|get|restore` (ต้องระบุ `base` = rev ปัจจุบัน) — **ไม่มี UI ในเกม** (มีแต่เทส `tests/save_resilience_test.js`)

### 2.8 Upstash
- อ่าน: `GET {URL}/get/<key>` · เขียนบัญชี: `POST {URL}` body `["EVAL", ACCOUNT_CAS, 2, acctKey, histKey, expectedRaw, newRaw, snapshot]` (Lua: GET เทียบทั้งสตริง → LPUSH+LTRIM 20 → SET) `accounts.js:20-27,57-70`
- timeout บัญชี 10 วิ · อันดับ 5 วิ · กิลด์/topq/world/market/pvp **ไม่มี timeout**
- ล้มเหลวแล้วอ่านกลับ: ถ้า `writes` มี opId ของเรา = สำเร็จ
- `/api/dbtest` เขียน+อ่าน `eld:dbtest` เพื่อตรวจ Upstash · `/api/ping` คืน `{t, store}`

### 7. บัค/ความขัดกัน (เซฟ)
- **history 20 รุ่นสั้นมาก**: เซฟทุก ~3 วิ → 20 รุ่น ≈ 1 นาทีเล่น · GAME_DESIGN สั่ง "เก็บ 20 revision" แต่ใช้กู้ของหายจริงแทบไม่ได้ → เสนอ v6: เก็บ snapshot ตามเวลา (เช่น ทุก 10 นาที ×24 + รายวัน ×7)
- ธง "25 เลเวลใน 30 นาที" ใช้เวลาจากเซฟก่อนหน้า (3 วิ) จึงแทบเท่ากับ "25 เลเวลในเซฟเดียว"
- `rec.bak` ซ้ำซ้อนกับ history

---

## 3. GM

- เซิร์ฟเวอร์: GM = `rec.gm` (ตั้งตอนสมัคร) **หรือ** lid อยู่ใน `GM_IDS` env · `verify()` ส่ง `gm` → `auth_ok {gm}` (`world.js:71`)
- สิทธิ์ที่เซิร์ฟเวอร์ตรวจจริง: `wbgm` เรียกบอสโลก (`world.js:84`) · `/api/gem` op `list|ok|no|credit(±100000)|look` · `/api/save-history` · ได้ `gmtop` แจ้งคำขอเติมเงิน · ไม่ขึ้นตารางอันดับ (`lb.gm`)
- ฝั่งเกม `gmAllowed()` ชั้นสุดท้าย = `FM_ACCT ∈ GM_IDS(ฮาร์ดโค้ด)` **และ** `GM8.ok` (กุญแจ `/gmkey XXXX` ตรง `GM8_HASH` หรือ `GM71_HASH` เก็บใน `fm_gmkey8` · 031:7049, 103-fix71.js:23-27) **และ** `ON10.gm` จากเซิร์ฟเวอร์ (153-fix123.js:44)
- แผง GM (ปุ่ม `#gmb`): อมตะ · ไม่มีคูลดาวน์ · ฟื้นเต็ม · +10 เลเวล · Lv.99 · +100,000 เหรียญ · วัตถุดิบ×99 · อุปกรณ์ทุกชิ้น · ที่ดิน · เปลี่ยนอาชีพ · ถืออาวุธ · เวลา · วาปโซน · ฆ่ามอนรอบตัว · เซฟ (`GMA` 031:5656) — **ทั้งหมดทำในเครื่องแล้วเซฟขึ้น ไม่ผ่านเซิร์ฟเวอร์**
- แผง GM เหรียญแฟชั่น (fix69 แท็บ gm): รายการคำขอ · อนุมัติ/ปฏิเสธ · เติม/หักให้ไอดี · ดูประวัติ
- คำสั่ง `/gm รหัส` (GM7 เก่า) → ตอบ "ถูกยกเลิกแล้ว" = **ตัดออก** · `fm_gm7` ถูกลบทุกครั้งที่โหลด
- 7: GM_IDS อยู่ 2 ที่ (env กับโค้ดเกม) → v6 ให้เกมใช้ `auth_ok.gm` อย่างเดียว · ปุ่ม GM ให้ของในเครื่อง = GM ใช้เทสบนไอดีจริงแล้วอัปขึ้นเซฟจริง (เจ้าของยอมรับไว้: GM ไม่ขึ้นอันดับ)

---

## 4. WebSocket: เชื่อมต่อ ยืนยัน ซิงก์ตำแหน่ง

### กติกาเซิร์ฟเวอร์ (`server.js`)
- รับต่อเมื่อ: IP ไม่ถูกแบน · origin ผ่าน (`ALLOWED_ORIGINS` ว่าง = ทุก origin; host เดียวกัน/`null`/`file://` ผ่านเสมอ) · ต่อจาก IP เดียว <4 · ผู้เล่นรวม <MAX_PLAYERS
- `maxPayload` 32 KB · ส่งเกิน 90 ข้อความ/วิ → ปิด · strike ครบ 3 → แบน IP 10 นาที · ping ทุก 15 วิ ไม่ตอบ → ตัด
- ย้ายตำแหน่ง >900 px ในฉากเดิม (ไม่ตาย) → strike · >20 → ปิด `speed` (**ใช้ตัวนับ `p.strikes` ร่วมกับ flood** — ดู 7)
- `hi` ตั้งชื่อ (กรองคำหยาบ ≤14) ส่ง `hist` ประวัติแชท 40 ข้อความ + ประกาศเข้าเกม
- `auth` → `ACC.verify(id, token, document)` ตรวจโทเคน+writer+document → ไอดีเดียวกันออนไลน์อีกที่: ตัวเก่าได้ `dupe` + หายจากฉาก (`gone`) + ตัดใน 0.8 วิ · ตัวใหม่ได้ `auth_ok {gm, g:{id,tag,name}}` + `mbox` + `gmtop`(GM)
- ไม่ auth ก็เล่น/แชท/PvP ได้ แต่ทำตลาด/เทรด/จดหมาย/ประมูลไม่ได้ (`p.acct` null)

### snapshot ตำแหน่ง (ทุก 100 ms · `server.js:139-157`)
- จัดกลุ่มตามฉาก `sc` · คนในฉาก ≤41 คน → ส่งทุกคน · มากกว่า → AOI: grid 600 px รัศมี 1000 px ใกล้สุด 40 คน + เพื่อนปาร์ตี้เสมอ
- ข้อความ `snap {on:จำนวนคน, h:โฮสต์ของฉาก, ps:[{id,name,gtag, ...st}]}`
- `st` ที่เซิร์ฟเวอร์รับ (sanitize `server.js:70-76`): `x y(-1e4..1e5) dir(u/d/l/r) mv run at(-1..1) cmb(0-2) tool(sword/axe/pick/rod) draw armor{slot:id≤24} tier{sword,axe,pick 0-12} lv(1-999) dead cls(≤10) pvp look{g,top,pants,hair} mount fx{e{slot:0-30},rn{el,g},fw,fb,m,mo} stl{ti,n} ttl hpP(0-100) pb(0-3) q cl{i,n,t} mn[≤8 {k,x,y,f,m,s,c}]`

### ฝั่งเกม
- `NET` (031:2703) · `netConnect` (031:2709 + ห่อ 3821 บังคับ wss นอก LAN, 064-fix33:116 กันซ็อกเก็ตซ้อน) · ต่อใหม่ backoff ≤30 วิ + fix32 ต่อซ้ำทุก 3 วิ · หลุด >6 วิ → `#off32` หยุดเกม
- `netTick` ส่ง `st` ทุก 0.1 วิ เมื่อเปลี่ยน หรือนิ่ง >1 วิ · ฟิลด์เพิ่มโดยการห่อ `WebSocket.prototype.send` (ไม่ใช่ netTick): `pvp,look` (031:7331) · `fx,stl` (040-fix9:16) · `mn` (103-fix71) · ที่เหลือ (`ttl,hpP,pb,q,cl,mount`) ตามชุดแก้ 051/060/…
- `netScene()` ชั้นสุดท้าย: `wboss` · `market` · `duel:<id>` · `arena` · `home:<acct>` · `dg:<ชั้น>:<รอบ>` · `z:<zi>` · `town` · `shop:<x>` · `field`
- `netMsg` ถูกห่อ **16 ชั้น** (SYSTEMS.md) · `drawOther` 11 ชั้น (หมวดภาพตัวละคร)
- ผู้เล่นอื่นเคลื่อนนุ่ม (lerp `dt*12` · ห่าง >220 px วาร์ป) · เห็นสกิล/กระสุนผ่าน `sx k:'fx'`

---

## 5. โลกร่วม: มอนร่วม (โฮสต์) และ relay `sx`

- เซิร์ฟเวอร์เลือก **โฮสต์ต่อฉาก** = คนอยู่ในฉากนานสุด (`scT` น้อยสุด) ยกเว้นคนถูกแจ้ง `hstale` ใน 60 วิ · ไม่มีโฮสต์ในฉาก `town|shop|market|arena|duel|home|tower` (`party.js:25`)
- `sx` = relay ล้วน: เซิร์ฟเวอร์เติม `from, sc` แล้วส่งให้ทุกคนในฉาก (หรือ `to` คนเดียว) · `fx pj pe sk` ส่งเฉพาะคนในรัศมี 1400 px · k ที่ยอม: `ms mn mf mall mk md mh mreq zp fx pj pe sk rg`
- ฝั่งเกม (fix33 `js/064-fix33.js`): โหมด `solo/host/mirror` · โฮสต์คิด AI มอนทั้งหมด ส่ง `mn`(มอนใหม่ ทีละ 20) `ms`(ตำแหน่ง ทีละ 60) `mall`(ทุก 2 วิ) `zp`(กระสุนมอน) `mk`(ตาย) `mh`(มอนตีผู้เล่นคนอื่น) · คนดูส่ง `md`(ดาเมจที่เราตีให้โฮสต์) `mreq`(ขอชุดเต็ม → `mf`) · แผนที่เหมือง seed ตายตัว `srand(90001+zi*7919)`
- รางวัล: ใครตีมอน (`my33>0`) ได้รางวัลของตัวเองตอนมอนตาย · ปาร์ตี้ในระยะ 700 px ไม่ได้ตี ได้ XP 50% (`partyXp33`)
- `rg` = เกจคลั่งทุ่งสังหาร (fix93) · `mh` ในลานบอสโลกแนบ `ha` (พลังบอสฝั่งโฮสต์) ให้ผู้รับคิดดาเมจตามตัวเอง (114-fix82)

---

## 6. แชท

- ช่อง: ทั่วไป `gen` (ทุกคน + เก็บประวัติ 40) · กิลด์ `guild` (สมาชิก `p.gid` เดียวกัน, มีป้าย gtag) · ปาร์ตี้ `pchat` · กระซิบ `whisper`
- เซิร์ฟเวอร์: ≤140 ตัว · คูลดาวน์ 700 ms (กระซิบ 500, ปาร์ตี้ 500) · กรองคำหยาบ `BAD` (server.js:10) แทนด้วย `*` · ลบอักขระควบคุม/`<>`
- เกม: ≤5 ข้อความ/10 วิ (031:3819) · `chatClean` · แสดงประวัติล่าสุด 15 ตอนเข้า · บับเบิลเหนือหัว 4.5 วิ
- คำสั่ง (ไม่ถูกส่งเป็นแชท): `/help` `/who` `/w ชื่อ ข้อความ` `/r` `/mute ชื่อ` `/unmute` `/pvp` `/duel ชื่อ` `/ff` `/party ชื่อ` `/p ข้อความ` `/pleave` `/g ข้อความ` `/gmkey` (+`/gm` ตัดออก)
- `who` → รายชื่อ `{name,lv,sc,cls,pvp,ttl}`

---

## 7. ปาร์ตี้ (`party.js` + `js/066-fix35.js`, `104-fix72.js`)
- สูงสุด 5 คน · เชิญด้วยชื่อ (`findByName` ตรงตัวก่อน แล้วขึ้นต้นด้วย) · คำเชิญอายุ 60 วิ · หัวหน้าเท่านั้นเชิญ/เตะ/โอนหัวหน้า · เหลือ 1 คน = ยุบ · หัวหน้าออก → คนแรกใน Set
- ส่ง `pty {id, lead, mem:[{id,name,lv,cls,hpP,sc,dead,x,y}]}` ทุก 1 วิ · ออฟไลน์ = ออกปาร์ตี้
- UI: แถบสมาชิก `#pty35` (ซ้ายบน) · ป๊อปอัปคำเชิญ `#pinv35` · หน้าต่างปาร์ตี้ (fix72 เมนู 👥)
- ปาร์ตี้ไม่ถาวร (RAM)

## 8. กิลด์ (`accounts.js:156-214` + `js/052-fix21.js`)
- เก็บถาวร `eld4:guilds` · สูงสุด 30 คน · ใบสมัครค้าง ≤50 · ยศ leader 3 / officer 2 / member 1
- ชื่อ `/^[A-Za-z0-9ก-๙ _]{3,16}$/` · ป้าย `/^[A-Z0-9ก-๙]{2,4}$/` ไม่ซ้ำ · ค่าตั้ง **5,000 เหรียญ หักในเครื่อง** (`G21COST`)
- op: `my list(q, ≤40) create join(เปิด=เข้าเลย/ปิด=สมัคร) cancel accept reject(officer+) kick(ยศต่ำกว่า) role(leader: officer/member/โอนหัวหน้า) set(notice≤200, open) leave(หัวหน้าออก → ยศสูงสุด/เข้าก่อน) disband(leader)`
- id สมาชิกที่ส่งให้เกม = `mid` (hash) ไม่เปิด lid · เปลี่ยนกิลด์ → hook ส่ง `gupd` ให้ผู้เล่นที่ออนไลน์ + อัปเดต `p.gid/gtag`
- flush 1.5 วิหลังแก้ + ทุก 15 วิ

## 9. ตารางอันดับ
- อัปเดตเฉพาะตอนเซฟ (§2.4) · entry `{n, lv, cls, fl, rf, rw, k, b, w, t, av, flag, gm, u}` · ค่าเพดาน fl≤999, rf≤99999, k≤1e8, b≤1e7, w≤1e12
- `/api/top` → `{lv,k,b,w,fl,rf, n}` แต่ละหมวด 20 อันดับ เรียงค่า แล้วเลเวล · ซ่อน `flag` (ยกเว้น UNFLAG_IDS) และ GM · `rf` เฉพาะสัปดาห์ปัจจุบัน (`lbWk` จันทร์ 00:00 เวลาไทย) · เก็บ ≤5000 คน (ลบคนเซฟเก่าสุด) · flush ทุก 30 วิ + ทุกครั้งที่เรียก /api/top
- `av` รูปตัวละคร (`lbAv` ≤600 ตัวอักษร)
- UI: `openLb20` แท็บ เลเวล/ล่ามอน/ล้มบอส/ร่ำรวย/ดันเจี้ยน (fix20, โพเดียม fix65) + หอคอยนิรันดร์รายสัปดาห์ (fix92) · บังคับเซฟก่อนดู รอ ≤8 วิ · รีเฟรชทุก 30 วิ

---

## 10. PvP / สนามประลอง / ดวล (`server.js:115-126`, `pvp.js`, `js/031-core.js:7352-7370`, `js/060-fix29.js`)

### เงื่อนไขตี (เซิร์ฟเวอร์)
ฉากเดียวกัน · ไม่ใช่ `town|shop|market|wboss` · ไม่ตายทั้งคู่ · (ดวลคู่กันสถานะ fight ในฉาก `duel:<id>` **หรือ** ฉาก `arena` **หรือ** เปิด PvP ทั้งคู่) · คนอยู่ในดวลตีนอกดวลไม่ได้ · ระยะ ≤450 px · ≤10 ครั้ง/วิ · ดาเมจ clamp `1 .. 150+lv×45` (lv จาก st)

### ดาเมจ (เครื่องผู้ตีคิด → เครื่องผู้โดนคิดลด)
- ผู้ตี: `clsAtk()×mult×(0.9–1.1)×(คริ 1.5)×PVP8.dmgK` (`dmgK`=1 หลัง fix29) ส่ง `pvp {to,dmg,crit}`
- ผู้โดน (`pvpHurt8` fix29:36): `dmg×100/(100+DEF)×0.5(PVPK29)×(1−min(0.5,dr))` ไม่เกิน 18% เลือดสูงสุด/ครั้ง · ไม่โดนตอน iframe/เมืองอื่น · เลือดหมด → ส่ง `pvpko {by}` (ในดวล: เหลือ 1 HP + อมตะ)
- ห้ามใช้ยาในสนามประลอง (fix6) · ฮีลระหว่างโดนตีถูกลด (PVPHEAL52 — หมวดต่อสู้)

### น็อก (`pvp.ko`)
- ต้องมี `hitBy` จากผู้อ้างว่าชนะภายใน 6 วิ · ผู้ตายนับได้ทุก 4 วิ
- ดวล: น็อกจริง → `ko` · ไม่จริง → `quit`
- สนาม: เกียรติยศ +2 (+ค่าหัว: เหยื่อสตรีค ≥5 → +8, ≥3 → +4) · คู่เดิม >3 ครั้ง/10 นาที = ไม่ได้ · ประกาศสตรีค 3/5/8/12 · ปิดตำนานสตรีค ≥3
- เปิด PvP ทั้งคู่นอกสนาม: ประกาศอย่างเดียว ไม่มีแต้ม

### ดวล 1v1
- ท้า (`/duel ชื่อ` หรือแตะตัว) คูลดาวน์ 4 วิ · ตอบภายใน 20 วิ · นับถอยหลัง 3 วิ · สู้ 90 วิ · ออกจากฉากดวล >8 วิ = แพ้ (`leave`) · หมดเวลา: `hpP` มากกว่าชนะ เท่ากัน = เสมอ · `/ff` ยอมแพ้
- **แรงก์**: ทั้งคู่ล็อกอิน คนละบัญชี ไม่ได้ดวลคู่นี้ใน 10 นาที และไม่ใช่ "จบสั้น" (ไม่ใช่ ko/time และสู้ <20 วิ) · ELO เริ่ม 1000 K=32
- ขั้น: บรอนซ์ 0 · ซิลเวอร์ 1100 · โกลด์ 1250 · แพลทินัม 1400 · ไดมอนด์ 1550 · มาสเตอร์ 1700 · ตำนาน 1900
- เกียรติยศ: ชนะ 12 · แพ้ 4 · เสมอ 5 (คู่ซ้ำใน 10 นาที = 0)
- อันดับ PvP 20 คน (`pvptop`, `/api/pvptop`) — เฉพาะคนที่มีผลดวล

### สนามประลอง (`arena`)
ลูกพลัง: ทุก 20 วิ สูงสุด 3 ลูก 5 จุด `[576,416] [300,260] [852,260] [300,600] [852,600]` ชนิด heal(ฟื้น 40%) / power(ดาเมจ +30% 10 วิ) / haste(เร็ว +35% 10 วิ) · เก็บในระยะ 70 px · สกอร์บอร์ด 8 คน (`arsb`) ทุก 3 วิ/เมื่อเปลี่ยน · K/D รีเซ็ตเมื่อออกเกม

### ร้านเกียรติยศ (`SHOP29` fix29:118 — ในเครื่อง)
💠หินตีบวก×5 = 40 · 🔹เศษแก่นเวท×10 = 50 · ✨หินพร×1 = 90 · ฉายา "กระหายสงคราม" = 300 · เกียรติยศเก็บใน `ST20.honor` (`fm_stat20`)

---

## 11. ตลาดกลาง / เทรด / ประมูล / แผงร้าน / จดหมาย

### 11.1 จดหมาย 📬 (`accounts.js:389-398`, `world.js:68-77`, `js/113-fix81.js`)
- เก็บใน `rec.mail` (≤100, เก่าหลุด) · ชนิด `k`: `coin{n,why,mk?}` · `auc{item,nm,paid}` · `wbwin{rank,d,n,share,gem}` · `mk{item,paid,from,lid}` · `mkret{item,why}` · `tr{items,coin,from,back?,why?}`
- `mlist` → `mbox` · `mclaim{ids|all}` (≤100 id, 700 ms/ครั้ง) → `mgot` แล้ว `mbox` ใหม่ · ลบจากเซิร์ฟเวอร์ก่อน แล้วเกมเติมของเอง (`mail10` + ชั้น fix130)
- เกมรับอัตโนมัติ: `mk mkret tr` และ `coin` ที่ `mk:1` (debounce 0.9 วิ, ถามซ้ำ 4.5 วิ) · ที่เหลือกดรับในหน้าต่างจดหมาย
- ของจดหมายเข้ากระเป๋าตรง (ยกเว้นกฎ `canTake` ได้ตาม AGENTS.md)

### 11.2 ตลาดกลาง (`market.js` + `js/157-fix130.js`, `166-fix139.js`)
- ภาษี 5% (ผู้ขายได้ `price − ceil(price×0.05)`) · ลงขาย ≤12 รายการ/บัญชี · อยู่ 72 ชม. (หมด → คืนทางจดหมาย) · ราคา 1..1e9 · จอง 25 วิ · กดซ้ำ ≥250 ms · สถิติราคา 14 วัน `[จำนวนครั้ง, จำนวนชิ้น, ยอดเงิน]`/วัน
- ชนิดของ (`KINDS` market.js:21 ↔ `MKK130` fix130:20): `mat{id,n}` · `gear{id,e(0-30),o:[[stat,val]]≤6}` · id `/^[A-Za-z0-9_:]{1,32}$/` · ห้ามขาย `coin pendant rod rod2` และของเควส (เกม)
- **ขาย**: เกมหักของ → `fm_mkpend130` → `safeSync` → `mkSell{nonce,item,price}` → `mkSellOk` · ไม่ตอบ 20 วิ → `mkVoid` + คืนของ
- **ซื้อ**: `mkBuy{id,price}` → `mkHold` → เกมหักเงิน + sync → `mkPay` → เซิร์ฟเวอร์ลบรายการ ส่ง `mk` ให้ผู้ซื้อ + `coin` ให้ผู้ขายทางจดหมาย + `mkSold` · ล้มเหลว `mkPayNo` คืนเงิน · ค้าง >8 วิ `mkChk` (`mine` = ได้แล้ว)
- **ยกเลิก**: `mkCancel` (ถ้าไม่ถูกจองอยู่) → คืนทางจดหมาย
- อุปกรณ์: ตีบวก/ออปเก็บต่อ "ชนิด" → ขายชิ้นสุดท้ายติด +/ออปไปด้วย · ยังเหลือชิ้นชนิดเดียวกัน → ไปเป็น +0 ไม่มีออป
- รายการส่งใหม่ให้ทุกคนที่เปิดหน้าต่างตลาดใน 30 นาที (`bumpAll`)

### 11.3 เทรด (`market.js:86-137`)
- ต้องล็อกอินทั้งคู่ คนละบัญชี ฉากเดียวกัน ห่าง ≤220 px (เจ้าของสั่ง: ต้องเจอตัว) · ขอใหม่ทุก 3 วิ · คำขอ 60 วิ · เปิดค้าง ≤30 นาที
- ≤8 ช่อง + เหรียญ · แก้ข้อเสนอ → ปลดล็อก/ยืนยันทั้งคู่ · 🔒ล็อกทั้งคู่ → ✅ยืนยันทั้งคู่ → `trCommit` (30 วิ) → เกมหักของ+sync → `trCom` (ฝาก escrow) → ครบสองฝ่าย → ส่ง `tr` ทางจดหมายทั้งคู่ `trDone`
- ยกเลิกช่วง commit / หมดเวลา / เซิร์ฟเวอร์รีสตาร์ต → คืน escrow ทางจดหมาย · `trChk` ทุก 10 วิ สำหรับ `fm_trcom130` ค้าง >40 วิ
- ปุ่ม: แตะตัวผู้เล่น → 🤝 · เมนู 🌐 ผู้คน → 🔁 (ไม่มีในเมนูหลักแล้ว fix141)

### 11.4 แผงร้านผู้เล่น (`world.js:93-98`, `js/040-fix9.js:160-215`)
- เฉพาะฉาก `market` · ≤12 ช่อง · ราคา = ราคารวม · เปิดร้านแล้วยืนอยู่ในตลาด · ของถูกหักจากกระเป๋าตอนวาง (เก็บใน `fm_stall10`) ปิดร้าน/ออกตลาด → คืน
- ซื้อ: เกมหักเงินก่อน → `sbuy{id,i,p}` → เซิร์ฟเวอร์ลบช่อง ส่ง `ssold` ให้ผู้ขาย (ผู้ขายเติมเงินเอง) + `sgot` ให้ผู้ซื้อ (เติมของเอง) · ไม่ตอบ 10 วิ คืนเงิน (fix123 หักซ้ำถ้าสำเร็จทีหลัง)
- **ไม่มี escrow ไม่ผ่านจดหมาย** ของ/เงินอยู่ในเครื่องสองฝั่ง

### 11.4b บอสโลก ฝั่งเซิร์ฟเวอร์ (`world.js`) ✏️
- เกิดเมื่อชั่วโมงไทย ∈ `WB_HOURS` (12,20) และนาที <30 (ช่องละครั้ง `slot=วันที่@ชม.`) · อยู่ 30 นาที (`WB_DUR`) แล้วหนี · เตือนล่วงหน้าที่นาที ≥50 ของชั่วโมงก่อน · GM `wbgm` เรียกได้ทันที
- **เลือดตามจำนวนคน (fix126, world.js:27–28,83)**: `WB_PER=WB_HP/15=300,000` · เริ่ม `WB_PER×3 = 900,000` · คนตีใหม่คนที่ 4 ขึ้นไป +300,000 ต่อคน (ทั้ง max และ hp) จนถึง `WB_HP` 4,500,000
- `wbhit` เพดาน **`800 + st.lv×160` ดาเมจ/วินาที/คน** (lv จากเครื่อง) · ต้องอยู่ฉาก `wboss` ไม่ตาย · กุญแจผู้ตี = บัญชี หรือ `g:<ชื่อ>` ถ้าไม่ล็อกอิน
- ปราบได้: 💠 กอง 100 แจกตามสัดส่วนดาเมจ คนละ 10–30 (ต้อง ≥1% และล็อกอิน · `gemAdd` ไม่นับเพดานรายวัน) · ส่ง `wbwin` (ออนไลน์) หรือจดหมาย `wbwin` (ออฟไลน์) · เพิ่ม 3 ล็อตประมูล · รางวัลของ/XP คิดในเครื่อง (`wbReward10` — สเปก 02)

### 11.5 ประมูล (`world.js`)
- ปราบบอสโลก → สุ่ม 3 ล็อตจาก `LOOT` (world.js:13-21: มังกรเวหา 60k · เพกาซัส 35k · ดาบ/ธนู/คทาเพชร+12 50k · เสื้อ+10 40k · หมวก/แหวน+10 30k · อาวุธแฟชั่น 25k · หินพร×15 20k · หินตีบวก×80 15k · อัญมณี×25 15k)
- 10 นาที · บิดแรก ≥ราคาตั้ง · ถัดไป ≥ `ceil(cur×1.05)` · บิดสูงสุด 5e8 ✏️ · เหลือ <60 วิ → ต่อเป็น 60 วิ · ผู้ถูกแซงได้ `coin` คืนทางจดหมาย · ชนะได้ `auc` ทางจดหมาย
- เกม (fix123): หักเงินก่อนส่ง · ทีละครั้ง · 30 วิไม่ตอบคืนเงิน

---

## 12. เหรียญแฟชั่น 💠 / บริจาค (`accounts.js:216-266`, `js/101-fix69.js`)
- ยอดอยู่เซิร์ฟเวอร์เท่านั้น (`rec.gem`, `rec.fown` ชุดที่ซื้อแล้ว) · วันตามเวลาไทย (`bkkDay`)
- ได้ฟรี/วัน เพดาน 10 (`GEM_CAP`): เข้าเกม +2 อัตโนมัติ · บอสตำนาน `lboss` +2 คูลดาวน์ 25 นาที · แลก `xchg` 30,000🪙 → +1 สูงสุด 5/วัน (หักเหรียญในเครื่อง) · บอสโลก 10–30 ต่อคนจากกอง 100 (เซิร์ฟเวอร์แจก **ไม่นับเพดาน**)
- ราคา `GEMP` (accounts.js:217, สำเนาในเกม `GEMP69`) เช่น ปีก 300–380 · อาวุธแฟชั่นชุด 2 260–300
- แพ็กเติม `GEM_PKG`: 35฿→30 · 99฿→100 · 299฿→330 · 599฿→700 · ขอได้ค้าง ≤3 · รหัสอ้างอิง 6 hex · GM อนุมัติ → เติมเข้าบัญชี · แจ้ง GM ทันที (`gmtop`) · ปิดถ้าไม่ตั้ง `TOPUP_PROMPTPAY`
- op: `bal earn buy req cancel` (ผู้เล่น) · `list ok no credit look` (GM) · log `glog` 50 รายการ

---

## 13. srvNow (เวลาเซิร์ฟเวอร์)
- `js/002-fix123.js`: `srvNow() = SRV.pb!=null ? performance.now()+SRV.pb : Date.now()`
- ตั้ง `SRV.pb` จาก `/api/ping` (`t`) และจาก `/api/save` (`upd` ถ้า RTT <8 วิ) = `serverTime − (t0+t1)/2` (153-fix123.js:11-13) · ping ตอนเริ่ม + ทุก 5 วิจนสำเร็จ แล้วสุ่ม 2%/5 วิ
- ใช้กับรายวัน/คูลดาวน์/โควตา (`srvNow()` ใช้ใน ~18 ไฟล์) · กฎ AGENTS.md: ห้าม `Date.now()`
- เซิร์ฟเวอร์ใช้ `Date.now()` ของตัวเองสำหรับทุกอย่าง (วันไทย = UTC+7)

## 14. รีเซ็ตไอดี (`js/000-reset-eld4.js`, v5.92)
- เซิร์ฟเวอร์เปลี่ยน prefix คีย์เป็น `eld4:` ใน 4 ไฟล์ (accounts/world/market/pvp) = ข้อมูลเริ่มใหม่ทั้งหมด
- เกม: ถ้า `localStorage['eldoria_data_epoch'] !== 'eld4'` → `localStorage.clear()` + `sessionStorage.clear()` ครั้งเดียว แล้วตั้ง epoch (ไม่ทำบน localhost เว้น `?epochtest=1`) · ต้องโหลดก่อน 004-core
- รีเซ็ตครั้งหน้า: เปลี่ยน prefix 4 ไฟล์ + EP · ไอดี GM ต้องตั้ง `GM_ALLOW_REG=1` ชั่วคราวเพื่อสมัครใหม่
- เทส `tests/data_reset_eld4_browser_test.js`

## 15. ต้นไม้/แร่ร่วม (`field.js`, `js/185-shared-world.js`)
- ฉาก `field` หรือ `z:N` · คีย์ `t|o + tx,ty` · ≤6 hit/วิ/คน · ระยะ ≤190 px · ชั้นเครื่องมือ (`st.tier`) ≥`req` · ดาเมจ ≤`min(80, 1+(tier>>1)+6)`
- `KIND` (field.js:12-16): t_tiny 2 · t_small 3 · t_medium 5 · t_large 8 · stone 6 · iron 7 · copper 8/req1 · silver 10/2 · gold 12/3 · diamond 14/4 · treeN 7 · treeE 10/1 · treeF 13/2 · treeS 16/3 · treeH 20/4 · treeG 24/5 (**สำเนาของ OREK ในเกม — ต้องแก้คู่กัน**)
- งอกใหม่ (วิ): ทุ่ง ต้นไม้ 120 แร่ 90 · แมพ ต้นไม้ 75 แร่ 60 · ×0.85–1.15 · มีคนยืนทับ (<56 px) เลื่อน 3 วิ · ไม่มีใครแตะ 60 วิ เลือดเต็ม
- คนตีครั้งสุดท้าย = `by` = ได้ของ (เกมสุ่มดรอปเอง `rewardOre`) · `fq`→`fsnap` ตอนเข้าฉาก · `fres` ทุกครั้งที่ตี (`hb` = คนตี)
- ไม่ส่ง `kd` (เกมรุ่นเก่า) → ใช้ `max/rg` จากเครื่อง (ปิดได้ด้วย `FIELD_REQUIRE_KIND`)
- ⚠️ ตรวจระยะ 190 px เทียบกับ `x,y` **ที่เครื่องส่งมาในข้อความ** ไม่ใช่ตำแหน่งจริงของโหนด (`n.x,n.y` เก็บไว้แต่ไม่ได้ใช้ตรวจ) → แก้โค้ดตีต้นไม้/แร่ทั้งฉากจากจุดเดียวได้ · `fq` ไม่ตรวจว่าอยู่ฉากนั้น · ชั้นเครื่องมือ clamp 0–12 ใน `st` (field.js:52–57) ✏️

---

## 16. รายการข้อความ ws/API ทั้งหมด

ทิศทาง: C→S = เกมส่ง · S→C = เซิร์ฟเวอร์ส่ง · "ตัดสิน" = ใครเป็นผู้ตัดสินผลจริง

### HTTP `/api/*` (POST JSON; ทุกตัวยกเว้น ping/dbtest/top/register/login ต้อง `id, token`)
| path | ฟิลด์ส่ง | คืน | ตัดสิน |
|---|---|---|---|
| /api/ping | — | `t, store` | S |
| /api/dbtest (GET ได้) | — | ผลเขียน/อ่าน Upstash | S |
| /api/register | id, pw, name, look, protocol | token, rev, name, lv, gem, b150 | S |
| /api/login | id, pw, protocol | token, name, lv, rev, upd, save, gm, id, b150 | S |
| /api/load | protocol, activate, document | protocol, seq, name, lv, rev, upd, save, b150 | S (เซสชัน) |
| /api/save | save, lv, cls, name, base, seq, document, protocol, ka, stat{…} | rev, seq, hash, upd, b150, rankSaved | S ตรวจรูปแบบ/ลำดับ · **เนื้อหา = C** |
| /api/save-history (GM) | to, op(list/get/restore), rev, base | entries / snapshot / rev | S |
| /api/top | — | lv,k,b,w,fl,rf,n,pending | S เรียง · ค่า = C |
| /api/guild | op + name/tag/gid/mid/role/notice/open/q | g, list, pend, err | S (ค่าตั้ง 5,000 = C) |
| /api/gem | op + src/key/pkg/ref/to/n/note/all | gem, fown, earn, cap, xchg, xmax, pkg, top, gm, pend, got | S (การหัก 🪙 ตอน xchg = C) |
| /api/friends | op(set/get), friends | friends | S เก็บ |
| /api/pw | old, pw | token | S |
| /api/pvptop (GET) | — | list | S |

### WebSocket C→S
| type | ฟิลด์ | ไฟล์เซิร์ฟเวอร์ | ตัดสิน |
|---|---|---|---|
| hi | name, v | server.js:90 | S (ชื่อไม่ผูกบัญชี) |
| auth | id, token, document | world.js:68 | S |
| st | sc + ฟิลด์ §4 | server.js:94 | C (S clamp ช่วงค่า + เตือนวาร์ป) |
| chat | ch(gen/guild), txt | server.js:101 | S กรอง |
| whisper | to, txt | server.js:107 | S |
| who | — | server.js:112 | S |
| pvp | to, dmg, crit | server.js:115 | S เงื่อนไข/เพดาน · ดาเมจ = C |
| pvpko | by | server.js:125 → pvp.ko | S ตรวจ hitBy · การตาย = C |
| duel | to/id | pvp.js:60 | S |
| duelans | from, ok | pvp.js:66 | S |
| duelquit | — | pvp.js:69 | S |
| pvpme / pvptop | — | pvp.js:70-71 | S |
| aorbtake | id | pvp.js:72 | S (ระยะ) · ผลบัฟ = C |
| pinv / pans / pleave / pkick / plead | name / from,ok / — / id / id | party.js:42-55 | S |
| pchat | txt | party.js:56 | S |
| sx | k, to?, … | party.js:34 | **relay ไม่ตรวจ** · ผล = C (โฮสต์) |
| hstale | h | party.js:31 | S |
| mkq / mkClose | — | market.js:51-52 | S |
| mkSell | nonce, item, price | market.js:56 | S รับฝาก · **มีของจริงไหม = C** |
| mkVoid | nonce | market.js:63 | S |
| mkCancel | id | market.js:64 | S |
| mkBuy | id, price | market.js:67 | S |
| mkChk | id | market.js:72 | S |
| mkRel | id | market.js:73 | S |
| mkPay | id, price | market.js:74 | S โอน · **จ่ายเงินจริงไหม = C** |
| trReq / trAns | to / fid, yes | market.js:107-121 | S (ระยะ 220) |
| trSet | tid, items, coin | market.js:122 | S normalize · **มีจริงไหม = C** |
| trLock / trOk / trCom / trChk / trX | tid (+on) | market.js:124-134 | S |
| mlist | — | world.js:74 | S |
| mclaim | ids / all | world.js:75 | S ลบ · การเติมของ = C |
| wbq | — | world.js:78 | S |
| wbhit | dmg | world.js:79 | S เพดาน/วิ · ดาเมจ = C |
| wbgm | — | world.js:84 | S (GM) |
| alist | — | world.js:85 | S |
| abid | id, amt | world.js:86 | S ราคา · **มีเงินจริงไหม = C** |
| stall | ti, items[{i,k,id,n,p,nm,e}] | world.js:93 | **C ทั้งหมด** |
| sget | id | world.js:95 | S |
| sbuy | id, i, p | world.js:96 | S ตรงราคา · เงิน/ของ = C |
| fq | sc | field.js:27 | S |
| fhit | sc, key, kd, max, dmg, rg, x, y | field.js:28 | S เลือดโหนด/คนล้ม · ชั้นเครื่องมือ/ดรอป = C |

### WebSocket S→C
| type | ฟิลด์ | ส่งจาก |
|---|---|---|
| welcome | id, n | server.js:84 |
| hist | list[chat] | server.js:92 |
| sys | txt | หลายที่ |
| snap | on, h, ps[] | server.js:146 (100 ms) |
| gone | id | server.js:97,132 · world.js:70 |
| chat | id, name, ch, txt, ts, gtag? | server.js:104 · party.js:57 (ch:'party') |
| whisper / whisper_ok | from,txt / to,txt | server.js:111 |
| who | list | server.js:114 |
| pvphit | from, name, dmg, crit | server.js:124 |
| auth_ok / auth_no / dupe | gm, g / — / — | world.js:68-71 |
| mbox / mgot / mail | list (+fresh) | world.js · market.js |
| gmtop | n, who?, baht? | server.js:164 · world.js:73 |
| gupd | g | server.js:165 |
| wb | on, hp, max, end, top, next, n | world.js:31 (ทุก 1 วิในลาน / 10 วิที่อื่น) |
| wbwin | rank, d, n, share, gem | world.js:43 |
| alots | lots[] | world.js:47,60,92 |
| abid_ok / abid_no | id, amt, nm / why | world.js:86-92 |
| sitems / ssold / sgot | id,ti,name,items / i,by,bn,item / ok,from,sn,item | world.js:95-98 |
| duelinv / duelgo / duelfight / duelend | … | pvp.js |
| honor | n, why, streak | pvp.js:52 |
| akill / aorb / aorbgot / arsb | … | pvp.js |
| pvpme / pvptop | me, acct, ranks / list | pvp.js:70-71 |
| pty / pinv | id, lead, mem / from, name, lv | party.js |
| sx (relay) | k + from + sc | party.js:36 |
| mkls / mkSellOk / mkNo / mkHold / mkPayOk / mkPayNo / mkChk / mkCancelOk / mkSold | … | market.js |
| trInv / trSent / trNo / trOpen / trState / trCommit / trComNo / trDone / trEnd / trChk | … | market.js |
| fres / fsnap | sc,key,hp,max,dead,by,bn,left,rs,hb / sc,list | field.js |

---

## 17. กันโกง: อะไรเซิร์ฟเวอร์ตรวจ / อะไรเชื่อไคลเอนต์

**เซิร์ฟเวอร์ตัดสินจริง**: บัญชี/รหัส/โทเคน/เซสชันเดียว · ลำดับและรูปแบบเซฟ · เหรียญแฟชั่น 💠 + ชุดที่ซื้อ (`fown`) · กิลด์ · เรตติ้ง ELO · การมีอยู่ของรายการตลาด/ล็อตประมูล/escrow เทรด/จดหมาย · เลือดบอสโลก (ยอดรวม) · เลือดต้นไม้/แร่ร่วม + คนล้ม · เงื่อนไข PvP (ฉาก/ระยะ/ความถี่/เพดาน) · การน็อก (ต้องมีการตีจริง) · rate limit/แบน IP

**เชื่อไคลเอนต์ทั้งหมด**: เซฟทั้งก้อน (เงิน ของ ตีบวก ออป เลเวล XP สกิล เกียรติยศ) · ค่าในตารางอันดับ · ดาเมจทุกชนิด · ดรอป/รางวัลทุกอย่าง (รวมรางวัลบอสโลก `wbReward10`) · การหัก/เติมเงินในตลาด แผง ประมูล เทรด กิลด์ แลก 💠 · ชั้นเครื่องมือ (`st.tier`) · ชุดแฟชั่นที่สวม (FASH.own ในเซฟ) · ตำแหน่ง (เตือนแค่วาร์ป >900 px) · ผลของ `sx` ทั้งหมด

ฝั่งเกมมี `AC` (031:3799) ตรวจในเครื่อง: เวลาเร่ง (performance/Date ต่างกัน >35%) · เลเวล > MAXLV · แต้มสเตตัสเกิน · เหรียญ > 99,999,999 (**ตัดเหลือ 99,999,999 ทุก 3 วิ** — ขัดกับตลาด `MAX_PRICE` 1e9 และประมูล 5e8: ผู้ขายของราคา >~1 ร้อยล้านจะเสียเงินส่วนเกินเมื่อรับจดหมาย และช่องโหว่ข้อ 1 ได้จริงสูงสุด ~1 ร้อยล้าน/ครั้งถ้าไม่แก้โค้ด · v6 ต้องตั้งเพดานเงินตัวเดียวใช้ทั้งเกม+เซิร์ฟเวอร์) ✏️ · ตีบวก > MAXP · พาสซีฟเกิน — ปิดได้แค่ localhost `?testsupply=1` (เปิดอยู่บนเว็บจริง v5.80) · กันได้แค่คนไม่แก้โค้ด

### ช่องโหว่โกงที่เห็น (เรียงตามความรุนแรง)
1. **เสกเงินจากเซิร์ฟเวอร์ผ่านตลาด**: `mkPay` ไม่ตรวจว่าผู้ซื้อจ่ายจริง → 2 บัญชี: บัญชี A ลงขายของถูก ๆ ราคา 1e9, บัญชี B (แก้โค้ดไม่หักเงิน) ส่ง `mkBuy`+`mkPay` → A ได้ 950 ล้านเหรียญทางจดหมาย (market.js:74-79)
2. **เสกของจากตลาด/เทรด**: `mkSell`/`trSet` ไม่ตรวจว่ามีของจริง → ลง `gear sword5 e:30` หรือ `mat bless n:99999` แล้วให้เพื่อนซื้อ/เทรด → ของจริงจากเซิร์ฟเวอร์ (market.js:22-24 รับ e ≤30 ทั้งที่ตีบวกสูงสุดจริง +15 `MAXP` · แต่ฝั่งเกม AC ตัด ENH > 15 ทิ้งทุก 3 วิ) ✏️
3. **เสกเงินผ่านประมูล**: `abid` ไม่หักเงินที่เซิร์ฟเวอร์ แต่คืน `coin` ให้คนถูกแซง (world.js:90) → บิดหลายบัญชีวนกัน = เงินงอก · ชนะประมูลโดยไม่จ่ายก็ได้
4. **แผงร้าน**: `stall` items เชื่อเครื่องผู้ขายทั้งหมด → ขายของที่ไม่มีให้เพื่อน (world.js:93-98)
5. **ฆ่าผู้เล่นคนอื่นในแมพมอน** (ผู้รับต้องอยู่ `D.zone` ฉากเดียวกัน · ไม่รวมเมือง · ดาเมจ ≤1e7 ผ่าน `zHurt` 064-fix33:49) ✏️: ใครก็ส่ง `sx k:'mh' to:<id> dmg:1e7` ได้ (เซิร์ฟเวอร์ไม่ตรวจว่าเป็นโฮสต์ เกมผู้รับไม่ตรวจ `from`) · `md dmg:5e7` ถึงโฮสต์ = ฆ่าบอสทันที
6. **แก้เซฟตรง**: `/api/save` รับเงิน/ของ/ตีบวกอะไรก็ได้ · กันแค่เลเวลกระโดด (ซ่อนอันดับ) · อันดับร่ำรวย/ล่ามอน/ดันเจี้ยน ปลอมได้
7. **PvP เพดานตาม `st.lv`** ที่เครื่องรายงาน (≤999 → ดาเมจ ≤45,105) และเครื่องผู้โดนเป็นคนลดเลือดเอง (แก้โค้ดไม่ตายได้) · `wbhit` เพดานก็ใช้ `st.lv`
8. **ชื่อปลอม**: ชื่อใน ws มาจาก `hi` ไม่ผูกบัญชี → ตั้งชื่อเหมือน GM/คนอื่นได้ · `findByName` จับคู่แบบขึ้นต้น → กระซิบ/เชิญผิดคน
9. **แบน IP เลี่ยงได้** (x-forwarded-for ตัวแรก) · ตัวนับ `strikes` ใช้ร่วมกันระหว่างวาร์ป >900 px กับ flood → วาร์ปในฉากเดิม 2 ครั้ง + เกินอัตรา 1 ครั้ง = **แบนผู้เล่นปกติ 10 นาที**
10. `/api/dbtest` ไม่ติด rate limit → ยิงเขียน Upstash ได้ไม่จำกัด (กินโควตา) · `/api/top` สั่ง flush ทุกครั้ง
11. `xchg` 💠: เซิร์ฟเวอร์ไม่หัก 30,000🪙 → แก้โค้ดได้ 💠 ฟรี 5/วัน (ยังติดเพดาน 10)
12. ชุดแฟชั่น: `FASH.own` อยู่ในเซฟ → เพิ่มชุดที่ไม่ได้ซื้อเองได้ (เซิร์ฟเวอร์รู้แค่ `fown`)

ข้อเสนอ v6: ย้าย "เงิน + ของที่ซื้อขายได้" ไปเป็นยอดที่เซิร์ฟเวอร์ถือ (อย่างน้อยหักเงินที่เซิร์ฟเวอร์ใน mkPay/abid/sbuy/trCom โดยเทียบกับเซฟล่าสุด) · ตรวจของจริงในเซฟก่อนรับฝาก · `sx mh/md` ยอมเฉพาะจากโฮสต์ · ชื่อ ws มาจากบัญชี · แยกตัวนับ strike

---

## 18. เชื่อมกับระบบอื่น
- เซฟ ← ทุกระบบที่มีคีย์ `fm_*` (§2.2) · `saveGame` ถูกเรียกจากเกือบทุกระบบหลังได้ของ
- `srvNow` → รายวัน/คูลดาวน์ทุกระบบ (เควสกิลด์ GQ125, ร้านกิลด์ fix146, daily108, บอสตำนาน, ธนาคาร)
- โฮสต์มอน (fix33) ↔ ระบบต่อสู้ (`updMob`, `hurtE`, `mobKill`, `zHurt`, `spawnMob`) · บอสโลก (fix82) · ทุ่งสังหาร (rg)
- `field.js KIND` ↔ `OREK` (js/015, 046, 055, 074) + ต้นไม้ทุ่ง (js/013) — ต้องตรงกัน
- ตลาด/เทรด ↔ ตีบวก (`ENH`), ออปชั่น (`OPT111`), กระเป๋า (`inv`, `GEAR`)
- จดหมาย ↔ บอสโลก (`wbwin`), ประมูล, ตลาด, เทรด
- 💠 ↔ แฟชั่น (`FASH`, `fashBuy`, `GEMP69`), บอสตำนาน (`lb62`)
- อันดับ ↔ สถิติ `ST20`, ฉายา, รูปตัวละคร `myAv65`, หอคอยนิรันดร์ fix92
- เนื้อเรื่อง: บท 15 ตลาด (`STORY.mk11` จากแผงร้าน fix10) · บท 16/24 บอสโลก

## 19. บัค/ความขัดกันที่เจอ (สรุป)
1. ชั้นซ้อน: `accLogin/accRegister/accChangePw` มี 3 ชุด (บัญชีในเครื่อง 031:3481 → wrapper cloud.js 031:7266 → แทนทั้งก้อนใน fix32) — v6 ใช้แบบ fix32 อย่างเดียว
2. `WebSocket.prototype.send` ถูกห่อ ≥4 ชั้น (031:7331 pvp/look · fix9 fx/stl+auth · fix71 mn · fix123 กักข้อความ stall/sbuy/abid รอ sync) → v6 สร้าง `st` ในที่เดียว และ "sync ก่อนส่ง" เป็นฟังก์ชันชัดเจน
3. `netMsg` 16 ชั้น / `CLOUD.call` ห่อ 6 ชั้น (fix20, fix65, fix92 เติม stat · fix123 นาฬิกา · fix154 QA · fix156 b150) → v6 รวมเป็น router เดียว
4. fix156 (เสก Lv.150) ยังโหลด + ถาม `/api/load` ทุก 20 วิ ตอน Lv≥7 แต่เซิร์ฟเวอร์ปิด b150 แล้ว (v5.82) → **ตัดออก** ทั้งสองฝั่ง เว้นเจ้าของสั่งเปิด
5. คอมเมนต์ใน accounts.js ยังเขียน `eld:lb`/`eld:guilds` แต่คีย์จริง `eld4:` · โหมดไฟล์ไม่มี prefix eld4 (รีเซ็ตไม่มีผลกับโหมดไฟล์)
6. `ALLOWED_ORIGINS` ใน render.yaml = github.io เท่านั้น — ใช้ได้เพราะเกมเปิดจาก host เดียวกัน (ผ่าน sameHost) แต่ค่าเก่าจากยุค Pages
7. history เซฟ 20 รุ่น ≈ 1 นาที (§2.7)
8. ขัดคำสั่งเจ้าของ (GAME_DESIGN "ความถูกต้องของเซฟ"): ระบุว่า "ยังไม่ปิดงาน: ต้องมี backup อิสระ + ทดสอบ restore และธุรกรรมรับจดหมายถึงการยืนยัน inventory แบบถาวร" — ปัจจุบัน `mclaim` ลบจากเซิร์ฟเวอร์ก่อน เกมเติมของ แล้วรอเซฟ → ถ้าเกมปิดระหว่างนั้นของหาย (ไม่มี journal) · v6 ควรให้จดหมายถูกลบพร้อมเซฟที่มีของแล้ว (atomic ในเอกสารบัญชีเดียวกัน — ทำได้เพราะ mail อยู่ใน rec เดียวกับ save)
9. `srvNow` ก่อนได้เวลาเซิร์ฟเวอร์ ใช้ `Date.now()` (คอมเมนต์ fix123 บอกว่า "ระบบรายวันรอก่อน" แต่ไม่ได้ตรวจทุกระบบ)

## ส่วนที่ยังไม่แน่ใจ
- ไม่ได้ตรวจทีละระบบว่าทุกระบบรายวันรอ `SRV.ok` ก่อนใช้ `srvNow()` หรือไม่
- ฟิลด์ `st` บางตัว (`pb`, `q`, `cl`, `ttl`, `hpP`, `mount`) ไม่ได้ไล่ว่าชุดแก้ไหนเติม/ใช้ (รู้แค่ว่าเซิร์ฟเวอร์รับ) — `cl` น่าจะเป็นกิลด์/ตราสัญลักษณ์ `q` ไม่ทราบความหมาย
- คำสั่งแชทอาจมีเพิ่มในชุดแก้ที่ไม่ได้เปิด (ค้น `chatSend=function` เจอ 8 ชั้น อ่านแล้ว 6)
- ไม่ได้รันเซิร์ฟเวอร์ทดสอบช่องโหว่ข้อ 1–5 จริง (อนุมานจากโค้ด) — เทส `tests/ws_integration_test.js` อาจครอบคลุมบางส่วน
- 💠1000 ตอนสมัคร: ไม่พบคำสั่งเจ้าของยืนยัน
- เนื้อหาภายในแต่ละคีย์ `fm_*` (นอกจาก `fm_save_v1`) เป็นงานของหมวดเจ้าของระบบนั้น

## ผลตรวจอิสระ (2026-10-30 · ผู้ตรวจอิสระ Claude Opus 5.5)
- **ตรวจ 70+ จุด**: อ่านไฟล์เซิร์ฟเวอร์ครบทั้ง 7 ไฟล์ทุกบรรทัด (server/accounts/world/pvp/party/market/field) + render.yaml + ฝั่งเกม 12 จุด (CLOUD.call บีบอัด 45,000/keepalive 60,000 · CLOUD.send 40 วิ · sync 3 วิ · debounce 150 ms · srvNow/SRV.pb · ping 5 วิ/2% · แชท 5/10 วิ · gmAllowed 3 ชั้น · AC · sx mh/md clamp) · เทียบรายชื่อ type ws ทุกตัวที่เซิร์ฟเวอร์รับ (48 type) กับตาราง §16 = **ครบ ไม่ขาด** · k ของ `sx` ที่เกมส่งอยู่ใน `RELAY_K` ทั้งหมด
- **ถูกต้อง (ตัวอย่าง)**: env ทุกตัว · rate limit HTTP 600/120/40 · scrypt · ล็อกรหัสผิด · โทเคน 90 วัน 8 อัน · 💠1000 สมัคร · เงื่อนไข /api/save (writer/document/seq/base/conflict/ธงโกง 40 และ 25/30 นาที) · CAS Lua + history 20 · MAX_SAVE/MAX_REQUEST · กิลด์ (30 คน · ใบสมัคร 50 · ยศ · ชื่อ/ป้าย regex) · อันดับ (เพดาน · 5000 คน · rf รายสัปดาห์) · AOI 1000/40/600 · flood 90/วิ + strike 3 แบน 10 นาที · วาร์ป 900 · PvP เงื่อนไข/เพดาน/hitBy 6 วิ/4 วิ/คู่เดิม 3 ครั้ง · ดวล 3/90/8/20 วิ · ELO K32 + ขั้น · เกียรติยศ 12/4/5 · ลูกพลัง · ปาร์ตี้ 5 คน/60 วิ · ตลาด (ภาษี 5% · 12 รายการ · 72 ชม. · จอง 25 วิ · 250 ms · 14 วัน) · เทรด 220 px/3 วิ/60 วิ/30 นาที/commit 30 วิ · จดหมาย ≤100 · mclaim 700 ms · ประมูล 1.05/60 วิ · GEM_PKG/GEM_CAP/xchg · field KIND ตรง OREK · ช่องโหว่ข้อ 1–4, 6–12 ยืนยันจากโค้ดแล้ว
- **ผิด/ขาด 6 จุด (แก้แล้ว ✏️)**:
  1. ขาดสเปกบอสโลกฝั่งเซิร์ฟเวอร์: เลือดตามจำนวนคน (fix126: เริ่ม 900,000 +300,000/คน ถึง 4.5 ล้าน) · เพดาน `wbhit` 800+lv×160/วิ · เวลาเกิด/หนี/เตือน → เพิ่ม §11.4b
  2. เพดานเงินฝั่งเกม 99,999,999 (AC) ขัดกับตลาด 1e9 / ประมูล 5e8 — ผู้ขายจริงเสียเงินได้ · ช่องโหว่ข้อ 1 ถูกจำกัดโดยบังเอิญ
  3. field.js ตรวจระยะจาก x,y ที่เครื่องส่ง ไม่ใช่ตำแหน่งโหนด (ช่องโหว่ใหม่)
  4. ช่องโหว่ข้อ 2: ตีบวกสูงสุดคือ +15 ไม่ใช่ +20
  5. ช่องโหว่ข้อ 5: `mh` ทำงานเฉพาะในแมพมอน ไม่ใช่ทุกฉาก
  6. ประมูลบิดสูงสุด 5e8 (ไม่ได้ระบุ)
- **ระบบที่หายไป**: ไม่พบระบบเซิร์ฟเวอร์ที่สเปกไม่พูดถึง (นอกจากข้อ 1 ที่เติมแล้ว) · `hstale` แจ้งได้ 1 ครั้ง/5 วิ/คน (เล็กน้อย)
- ไม่ขัดกับ `v6/DECISIONS.md` (CDN: สเปกบอกว่าโหลดผ่าน jsDelivr — v6: ใช้ตาม DECISIONS คือยังไม่ใช้ CDN)
- **คะแนน: ผ่านแบบมีข้อแก้** · ความเสี่ยงหลักที่ v6 ต้องออกแบบใหม่: เงิน/ของที่ซื้อขายได้ต้องถือที่เซิร์ฟเวอร์ (ช่องโหว่ 1–4) · ตัวตนผู้ส่ง `sx` (ข้อ 5) · จดหมาย+เซฟ atomic (§19.8)
