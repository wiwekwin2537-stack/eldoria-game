# แผนที่ระบบเกมเดิม — โค้ดปัจจุบัน

ฐานตรวจอ่าน: main `1f3f836d5e85720cfff273f08252ba89c312f2c3` วันที่3พฤศจิกายน2026 หน้าindex.htmlอ้างถึงjs200ไฟล์ ไม่มีsrcซ้ำในรายการนั้น เทียบhashไฟล์กับmainก่อนอ่าน ส่วนaimDirใช้ต้นฉบับจากmain ไม่ใช้แพตช์รวมในเครื่อง
นี่คือการสแกนข้อความและอ่านเฉพาะระบบตัวอย่าง ไม่ใช่ผลรันเกมหรือรับรองทั้งเกม จำนวนด้านล่างนับเฉพาะรูปแบบชื่อ=function ไม่ใช่จำนวนruntime layer/บัค และไม่ครอบคลุมassignment/aliasทุกแบบ

โครงสร้างv6ถูกตัดออกพร้อมจุดrequire/HTTP/WebSocketในserver.jsและข้อยกเว้นแคชในsw.jsตามคำสั่งเจ้าของ ไม่มีระบบเกมที่ต้องย้ายจากv6มารวมเอง

## ทางเข้าหลัก
| ส่วน | เจ้าของ/จุดเริ่ม |
|---|---|
| โหลด/บูต/UI | index.html ลำดับscriptจริง รวมinline callback |
| server/เครือข่าย | server.js และaccounts/world/pvp/party/market.js |
| asset/วาดเมือง | js/012-world-art.js และผู้เรียกในjs/031-core.js |
| ฉากและการออก | js/023-core.js; enterZone/enterTownยังมีชั้นอื่น |
| input/คลิกเดิน | js/198-click-move.js; ดูbindingในindexด้วย |
| schema/เซฟ | ค้นsaveGame/loadGameและaccounts.jsตามเส้นทางจริง อย่านับsaveGameอย่างเดียว |

## จุดกำหนดหน้าที่ที่ต้องไล่ก่อนแก้
| ชื่อ | assign matches | จุดตั้งต้นที่พบ | จุดกำหนดท้ายตามลำดับscript |
|---|---:|---|---|
| hero | 53 | js/018-core.js:56 | js/177-fix150.js:14 |
| mobKill | 40 | js/031-core.js:1014 | js/180-fix153.js:24 |
| interact | 25 | js/023-core.js:42 | js/198-click-move.js:45 |
| hurtE | 21 | js/031-core.js:1958 | js/155-fix128.js:15 |
| useSkill | 17 | js/029-core.js:10 | js/170-fix143.js:37 |
| gainXp | 15 | js/030-core.js:10 | js/180-fix153.js:43 |
| dropLoot | 8 | js/016-core.js:44 | js/151-fix119.js:9 |
| addDrop | 7 | js/016-core.js:43 | js/180-fix153.js:37 |
| saveGame | 3 | js/031-core.js:1888 | js/139-fix107.js:5 |
| aimDir | 3 | js/031-core.js:1967 | js/198-click-move.js:66 |
| exitD | 0 | js/023-core.js:26 | js/023-core.js:26 |
| enemies | 3 | js/031-core.js:1956 | js/064-fix33.js:112 |
| enterZone | 6 | js/031-core.js:1102 | js/161-fix134.js:18 |
| enterTown | 3 | js/020-core.js:20 | js/161-fix134.js:49 |
| leave62 | 1 | js/094-fix62.js:59 | js/161-fix134.js:13 |
| canTake | 0 | js/015-core.js:234 | js/015-core.js:234 |
| drink | 1 | js/030-core.js:18 | js/031-core.js:1783 |
| equipItem | 8 | js/031-core.js:66 | js/153-fix123.js:50 |

จุดท้ายไม่ได้แปลว่าพฤติกรรมก่อนหน้าตายทั้งหมด ต้องอ่านว่าเรียกตัวเก่า/alias/hookใดอยู่และเงื่อนไขเมื่อใด

## ตัวอย่าง aimDir จากmain
| ลำดับ | แหล่ง | หน้าที่ที่ต้องรักษา |
|---|---|---|
| 1 | js/031-core.js:1967 | declarationเริ่มต้น ตรวจผู้เรียกก่อนบูตเสร็จก่อนลบ |
| 2 | js/036-fix5.js:13 | แทนaimDirทั้งชุด ตัวเก่าที่จับไว้ไม่ได้ถูกเรียก |
| 3 | js/064-fix33.js:113 | เปิดAIM33ระหว่างเล็งและคืนผ่านfinally; enemiesบรรทัด112ยังเป็นอีกหน้าที่ |
| 4 | js/198-click-move.js:66 | ลากสกิล→มอนคลิก→auto→ทางเดิม; เงื่อนไขอุปกรณ์และคืนเมาส์ชั่วคราว |

mainยังไม่รวมaimDirตัวเดียว แพตช์ก่อนหน้าที่อยู่ในZIP/สำเนาเครื่องไม่ใช่หลักฐานว่าเผยแพร่แล้ว exitDมีfunctionที่js/023-core.js:26และไม่พบname=functionใน200ไฟล์ จึงไม่ใส่งานรวมซ้ำโดยไม่มีบัคใหม่

## วิธีเปิดโค้ดอย่างพอดี
อ่านชื่อฟังก์ชันและทุกassignmentในไฟล์ที่indexโหลดตามลำดับ รวมwindow alias, Registry, handler, closure และcallbackที่รันทีหลัง จดเงื่อนไข/เรียกตัวเก่าหรือไม่/ผลข้างเคียงในหมวดระบบที่กำลังแก้ แล้วแทนเฉพาะหน้าที่นั้น ไม่ลบไฟล์fixทั้งไฟล์เพราะมีwrapperหนึ่งตัว

SYSTEMSเก็บตำแหน่งปัจจุบัน ไม่ใช่รายการงานเก่าหรือประวัติfixทุกชุด งานเปิดอยู่TASKSที่เดียว
