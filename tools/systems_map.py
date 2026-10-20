"""สร้าง SYSTEMS.md ใหม่ (อ่านโค้ดจาก js/*.js) (แผนที่ระบบ: แจ้งบัคเรื่องไหน → แก้ที่ไหน) — รันใหม่ทุกครั้งที่แก้ index.html
usage: python3 tools/systems_map.py   (รันจากโฟลเดอร์โปรเจกต์)"""
import re, collections, datetime

import os, glob
FILES = sorted(glob.glob('js/*.js'))
L, LOC = [], []          # LOC[i] = (ไฟล์, บรรทัดในไฟล์)
for f in FILES:
    for j, l in enumerate(open(f, encoding='utf-8').read().split('\n')):
        L.append(l); LOC.append((f, j + 1))
at = lambda n: '%s:%d' % LOC[n - 1]

# หัวชุดแก้ fixNNN (บรรทัด // fixNN ... ตัวแรกของบล็อก)
heads = []
for i, l in enumerate(L):
    m = re.match(r'^//\s*(fix\d+)(?:\.js)?\b(.*)', l)
    if m and not any(h[1] == m.group(1) for h in heads[-3:]):
        heads.append((i + 1, m.group(1), m.group(2).strip(' —-:')[:110]))
BASE_END = next((h[0] for h in heads if h[1] == 'fix1'), 1)

def block_of(n):
    b = ('เกมหลัก', '')
    for ln, nm, t in heads:
        if ln <= n: b = (nm, t)
        else: break
    return b if n >= BASE_END else ('เกมหลัก', '')

def where(fn):
    base, wraps = [], []
    for i, l in enumerate(L):
        n = i + 1
        if re.search(r'(?<![\w.])function\s+' + fn + r'\s*\(', l): base.append(n)
        for _ in re.finditer(r'(?<![\w.])' + fn + r'\s*=\s*function\b', l): wraps.append((n, block_of(n)[0]))
    return base, wraps

# ---- หมวด: คำที่เจ้าของใช้แจ้งบัค → ฟังก์ชันหลัก + คำค้นในหัวชุดแก้ ----
CATS = [
 ('ลงดันเจี้ยน / ชั้นดัน / กุญแจ / กล่องในดัน', ['enterDg', 'dgReward', 'openDgMenu'], r'ดันเจี้ยน|ดัน'),
 ('ดรอปของ / ของตก / เก็บของ / กระเป๋าเต็ม', ['addDrop', 'dropLoot', 'drawDrops', 'mobKill'], r'ดรอป|กระเป๋า|น้ำหนัก'),
 ('XP / เลเวล / เลเวลขึ้นเร็ว-ช้า', ['gainXp', 'mobKill', 'lvHud'], r'XP|เลเวล|Lv\.'),
 ('เข้า-ออกแมพ / วาป / ไปโผล่ผิดที่', ['exitD', 'enterZone', 'enterTown', 'enterShop', 'leaveShop', 'enter62', 'leave62', 'interact', 'toTown'], r'เข้า-ออก|ออกจาก|ทางออก|วาป|ประตู|โผล่'),
 ('แท่นผนึกอสูร / บอสตำนาน', ['enter62', 'leave62', 'openAltar62', 'open113'], r'ผนึก|บอสตำนาน'),
 ('ทุ่งสังหาร', ['inRage93'], r'ทุ่งสังหาร'),
 ('บอสโลก', ['wbWin10', 'spawnBoss'], r'บอสโลก'),
 ('หอคอยบอส', ['openTower10'], r'หอคอย'),
 ('คราฟ / โต๊ะคราฟ / ช่างตีเหล็ก', ['openForge', 'forgeStart7', 'forgeEnd7', 'recipe12', 'anvilHTML'], r'คราฟ|หลอม|ช่าง'),
 ('ตีบวก / ชุดแตก / ซ่อม / หินตีบวก', ['enhItem', 'enhStart7', 'enhRender7', 'enhCheck7', 'openEnh7'], r'ตีบวก|แตก|ซ่อม|อำนวยพร'),
 ('ออปชั่น / หินสุ่มออป / หินล็อก / เจาะรู-อัญมณี', ['calcBonus'], r'ออป|ล็อก|อัญมณี|เจาะรู'),
 ('ใส่-ถอดชุด / ค่าสเตตัส', ['equipItem', 'unequip', 'recalcStats', 'calcBonus'], r'สเตตัส|ใส่ชุด|ถอด'),
 ('ร้านค้า / ซื้อ-ขาย', ['buyItem', 'openShop', 'renderShop', 'shopAct', 'sellBar', 'buyList'], r'ร้าน|ซื้อ|ขาย'),
 ('ตลาดกลาง / เทรด / ประมูล / แผงร้าน / จดหมาย', ['drawStall', 'stallGot10'], r'ตลาด|เทรด|ประมูล|แผง|จดหมาย'),
 ('ปาร์ตี้ / กิลด์ / เล่นออนไลน์ด้วยกัน', ['netMsg', 'drawOther', 'openGuild'], r'ปาร์ตี้|กิลด์|ออนไลน์|ผู้เล่นอื่น'),
 ('PvP / สนามประลอง / ดวล', [], r'PvP|ประลอง|ดวล'),
 ('สกิล / อาชีพ / พาสซีฟ', ['useSkill', 'skTick', 'castUlt', 'pickClass', 'openClassMenu'], r'สกิล|อาชีพ|พาสซีฟ|คลาส'),
 ('ต่อสู้ / ดาเมจ / มอนตี / ตาย-ฟื้น', ['attack', 'hurtE', 'zHurt', 'hurtPlayer', 'updMob', 'startDeath', 'die'], r'ดาเมจ|โจมตี|ตาย|ฟื้น|สมดุล'),
 ('ขุดแร่ / ตัดไม้ / เครื่องมือ (ขวาน-ที่ขุด)', ['useToolHit', 'hitOre', 'hitTree', 'toolSpr', 'zMine'], r'ขุด|แร่|ต้นไม้|ขวาน|ตัดไม้'),
 ('เนื้อเรื่อง / เควส / เควสรายวัน', ['qTake', 'qClaim', 'talk'], r'เนื้อเรื่อง|เควส|บทที่|เช็กอิน'),
 ('คลังของทดสอบ / NPC แจกของ / รับของทดสอบ', ['openTestSupplies', 'testSupplyCatalog', 'testSupplyGive', 'testSupplyRetry', 'testSupplyGuard'], r'คลังของทดสอบ|NPC'),
 ('NPC / คุยกับ NPC', ['npcTalk', 'ownerTalk', 'updNPCs', 'drawNPC'], r'NPC'),
 ('สัตว์ขี่ / สัตว์เลี้ยง', ['toggleMount', 'drawSteed', 'drawPet'], r'สัตว์ขี่|สัตว์เลี้ยง'),
 ('แฟชั่น / คอสตูม / เหรียญแฟชั่น', ['fashPreview'], r'แฟชั่น|คอสตูม|บูติก'),
 ('หน้าตาตัวละคร / อาวุธในมือ / ออร่า', ['hero', 'heroBody', 'renderChar', 'backSword', 'drawArmorAura'], r'ออร่า|หน้าตา|อาวุธในมือ|วาด'),
 ('เซฟ / ล็อกอิน / บัญชี / ตารางอันดับ (ฝั่งเกม)', ['saveGame', 'netConnect'], r'เซฟ|ล็อกอิน|บัญชี|อันดับ'),
 ('หน้าโหลด / เตรียมภาพฉาก / เกิดที่จุดวาร์ป', ['tPlay', 'placeAtSpawn'], r'หน้าโหลด|เตรียมฉาก|จุดเกิด'),
 ('ฟาร์มออโต้', ['autoToggle'], r'ออโต้'),
 ('ปุ่มบนจอ / เมนู / หน้าต่าง', ['toggleMenu', 'toggleBag'], r'ปุ่ม|เมนู|หน้าต่าง|UI'),
]

out = ['# 🗺️ แผนที่ระบบ (SYSTEMS.md) — แจ้งบัคเรื่องไหน → แก้ที่ไหน',
 '',
 '> ไฟล์นี้สร้างอัตโนมัติด้วย `python3 tools/systems_map.py` (อัปเดต ' + datetime.date.today().isoformat() + ') · **แก้ไฟล์ใน js/ แล้วรันใหม่ทุกครั้ง**',
 '> โค้ดเกมอยู่ในโฟลเดอร์ `js/` (โหลดตามลำดับเลขหน้าชื่อไฟล์) · `js/031-core.js` = เกมหลัก · `js/NNN-fixXX.js` = ชุดแก้ · เลขบรรทัดเปลี่ยนได้ → ค้นด้วยชื่อฟังก์ชัน',
 '> **วิธีใช้:** เจ้าของบอกอาการ → หาหมวดข้างล่าง → อ่านเฉพาะฟังก์ชัน/ชุดแก้ในหมวดนั้น (ไม่ต้องอ่านทั้งไฟล์) → ก่อนแก้ต้องเห็น **ทุกชั้น** ของฟังก์ชันที่จะแตะ',
 '> ฝั่งเซิร์ฟเวอร์: บัญชี/เซฟ/ตารางอันดับ/กิลด์ = `accounts.js` · บอสโลก/ประมูล/แผงร้าน = `world.js` · ตลาด/เทรด = `market.js` · PvP = `pvp.js` · ปาร์ตี้ = `party.js` · เส้นทาง/ไฟล์ = `server.js`',
 '']
for title, fns, kw in CATS:
    out.append('## ' + title)
    if fns:
        out.append('| ฟังก์ชัน | ต้นฉบับ (ไฟล์:บรรทัด) | ถูกห่อทับ | ชั้นที่ห่อ (ไฟล์:บรรทัด) |')
        out.append('|---|---|---|---|')
        for fn in fns:
            b, w = where(fn)
            ws = ' · '.join(f'{at(n)}' for n, nm in w) or '—'
            out.append(f'| `{fn}` | {", ".join(at(x) for x in b) or "(ประกาศแบบอื่น)"} | {len(w)} ชั้น | {ws} |')
    rel = [h for h in heads if re.search(kw, h[2])]
    if rel:
        out.append('')
        out.append('ชุดแก้ที่เกี่ยวข้อง (จากหัวข้อ):')
        for ln, nm, t in rel: out.append(f'- `{nm}` `{LOC[ln-1][0]}` — {t}')
    out.append('')

out.append('## รายชื่อชุดแก้ทั้งหมด (ตามลำดับในไฟล์)')
for ln, nm, t in heads: out.append(f'- `{nm}` `{LOC[ln-1][0]}` — {t}')
open('SYSTEMS.md', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('SYSTEMS.md:', len(out), 'lines ·', len(heads), 'fix blocks')
