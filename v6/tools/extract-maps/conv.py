#!/usr/bin/env python3
"""แปลงผลดึงข้อมูลแมพจากเกมเดิม (dump*.json) → v6/src/data/maps/*.js"""
import json, re, os, math, sys
HERE = os.path.dirname(os.path.abspath(__file__))
# ผลดึง dump*.json: ส่งโฟลเดอร์เป็นอาร์กิวเมนต์แรก หรือ env EXTRACT_DIR (ค่าเริ่ม = โฟลเดอร์นี้) · ผลลง v6/src/data/maps/ ของ repo เดียวกับสคริปต์
X = os.path.join(sys.argv[1] if len(sys.argv) > 1 else os.environ.get('EXTRACT_DIR', HERE), '')
OUT = os.path.join(HERE, '..', '..', 'src', 'data', 'maps', '')
os.makedirs(OUT, exist_ok=True)
d1 = json.load(open(X + 'dump.json'))
d3 = json.load(open(X + 'dump3.json'))
tw2 = json.load(open(X + 'town2.json'))
c2t = json.load(open(X + 'c2t.json'))
T = 32

def rle(row):
    out, i = [], 0
    while i < len(row):
        j = i
        while j < len(row) and row[j] == row[i]: j += 1
        n = j - i
        out.append(row[i] + (str(n) if n > 1 else ''))
        i = j
    return ''.join(out)

def rows_js(rows, ind='    '):
    return '[\n' + ''.join(f"{ind}  '{rle(r)}',\n" for r in rows) + f'{ind}]'

def remap(rows, table):
    return [''.join(table.get(c, c) for c in r) for r in rows]

def num(v):
    v = round(v, 2)
    return str(int(v)) if v == int(v) else str(v)

def js(o):
    """JSON ที่อ่านง่ายขึ้นเล็กน้อย (คีย์ไม่มีเครื่องหมายคำพูด)"""
    s = json.dumps(o, ensure_ascii=False, separators=(',', ':'))
    return re.sub(r'"([A-Za-z_][A-Za-z0-9_]*)":', r'\1:', s)

ZONE = {'0': '.', '1': '#', '2': '.', '3': '.', '5': 'G', '4': '#'}

# ---------------- flatten: ภาพที่วาดลง canvas ซ้อนกัน → ภาพจาก assets/ ตรง ๆ ----------------
def build_index(ops):
    by = {}
    for o in ops:
        by.setdefault(o['c'], []).append(o)
    return by

def cid(src):
    m = re.match(r'#(\d+):', src)
    return int(m.group(1)) if m else None

TREE_SRC = 'assets/incoming/tree-oak-v585.png'

def flatten(op, by, depth=0, clip=None):
    """คืนรายการ [src, s(4), d(4), clip|None] ในพิกัดของ canvas ที่ op วาดลง"""
    src, s, dd = op['src'].split('?')[0], op['s'], op['d']
    t = op.get('t') or [1, 0, 0, 1, 0, 0]
    # ใช้เฉพาะ transform แบบเลื่อน/ขยาย
    a, b, c_, dd_, e, f = t
    if abs(b) > 1e-6 or abs(c_) > 1e-6:
        return []
    D = [a * dd[0] + e, dd_ * dd[1] + f, a * dd[2], dd_ * dd[3]]
    if D[2] < 0: D = [D[0] + D[2], D[1], -D[2], D[3]]  # กลับด้าน → ยังวาดได้ (ไม่กลับภาพ · ยอมรับ)
    if src.startswith('assets/'):
        return [[src, s, D, clip]]
    k = cid(src)
    if k is None or depth > 4:
        return []
    m = re.match(r'#\d+:(\d+)x(\d+)', src)
    cw, ch = int(m.group(1)), int(m.group(2))
    if k not in by:
        if (cw, ch) == (80, 100):  # canvas ต้นไม้ (สร้างก่อนเริ่มดัก) → ภาพต้นไม้ oak ทั้งภาพ
            sx = D[2] / s[2]; sy = D[3] / s[3]
            return [[TREE_SRC, [0, 0, 256, 320], [D[0] - s[0] * sx, D[1] - s[1] * sy, 80 * sx, 100 * sy], clip or D]]
        return []
    sx = D[2] / s[2] if s[2] else 1
    sy = D[3] / s[3] if s[3] else 1
    full = s[0] <= 0.5 and s[1] <= 0.5 and abs(s[2] - cw) < 1 and abs(s[3] - ch) < 1
    nclip = clip if full else D
    res = []
    for q in by[k]:
        for (qs, qsr, qd, qc) in flatten(q, by, depth + 1, None):
            md = [D[0] + (qd[0] - s[0]) * sx, D[1] + (qd[1] - s[1]) * sy, qd[2] * sx, qd[3] * sy]
            mc = None
            if qc: mc = [D[0] + (qc[0] - s[0]) * sx, D[1] + (qc[1] - s[1]) * sy, qc[2] * sx, qc[3] * sy]
            cc = mc or nclip
            res.append([qs, qsr, md, cc])
    return res

def pack_ops(ops, srcs):
    out = []
    for (src, s, D, clip) in ops:
        if src not in srcs: srcs.append(src)
        row = [srcs.index(src)] + [round(v, 1) for v in s] + [round(v, 1) for v in D]
        if clip: row.append([round(v, 1) for v in clip])
        out.append(row)
    return out

def ops_js(rows, ind='    '):
    return '[\n' + ''.join(f'{ind}  {js(r)},\n' for r in rows) + f'{ind}]'

# ======================= เมือง 1 =======================
def town():
    tb = tw2['build']
    by = build_index(tb)
    dcv = tw2['dcv']
    ground = []
    for o in by.get(dcv, []):
        if o['src'].startswith('#'):
            k = cid(o['src'])
            if k not in by: continue  # พื้น TOWNFLOOR / หญ้า (วาดใหม่ใน tiles.js)
        ground += flatten(o, by)
    # ของตั้ง (เรียงตาม y) จากเฟรมจริง 9 มุมกล้อง
    seen, props = set(), []
    for fr in tw2['frames']:
        main = fr['main']
        for o in fr['ops']:
            if o['c'] != main: continue
            src = o['src']
            if src.startswith('#') and (cid(src) == dcv or re.match(r'#\d+:(1408x1088|96x96)', src)): continue
            if re.match(r'#\d+:(\d+)x(\d+)', src):
                w, h = map(int, re.match(r'#\d+:(\d+)x(\d+)', src).groups())
                if w >= 300: continue  # ชั้นแต่งสี/แสงทั้งจอ
            if not src.startswith('#'): continue  # ภาพเคลื่อนไหว (ธง ไฟ น้ำพุ) วาดสดทุกเฟรม → ข้าม
            key = src
            if key in seen: continue
            seen.add(key)
            # เฟรม: transform = กล้อง (เลื่อน -cam) → ตัดออกให้เป็นพิกัดโลก
            oo = dict(o); oo['t'] = [1, 0, 0, 1, 0, 0]
            fl = flatten(oo, by)
            if not fl: continue
            base = o['d'][1] + o['d'][3]
            props.append((base, fl))
    props.sort(key=lambda p: p[0])
    return ground, props

# ======================= เมือง 2 =======================
def city2():
    c = d3['c2']
    by = build_index(c['build'])
    seen, props = set(), []
    for fr in c['frames']:
        main = fr['main']
        for o in fr['ops']:
            src = o['src']
            if re.match(r'#\d+:(2688x2048|96x96)', src): continue
            m = re.match(r'#\d+:(\d+)x(\d+)', src)
            if m and int(m.group(1)) >= 400: continue
            if not src.startswith('#'): continue
            key = src
            if key in seen: continue
            seen.add(key)
            oo = dict(o); oo['t'] = [1, 0, 0, 1, 0, 0]
            fl = flatten(oo, by)
            if not fl: continue
            props.append((o['d'][1] + o['d'][3], fl))
    # ของที่วาดลงพื้นตอนสร้าง (ไม่ใช่ลายพื้น)
    ground = []
    for o in by.get(c['cv'], []):
        if o['src'].startswith('assets/city2/ground'): continue
        if re.match(r'#\d+:128x128', o['src']): continue
        ground += flatten(o, by)
    props.sort(key=lambda p: p[0])
    return ground, props

def write(name, header, body):
    open(OUT + name, 'w').write(header + body)
    print('wrote', name, len(header + body), 'bytes', (header + body).count('\n'), 'lines')

HEAD = '/* ข้อมูลแมพ (สร้างจากเกมเดิมด้วยเครื่องมือดึงข้อมูล · ห้ามมีโค้ดคำนวณ · CONTRACT §3)\n   แถว = RLE: ตัวอักษรช่อง + จำนวนซ้ำ (ไม่มีเลข = 1 ช่อง) · ความหมายตัวอักษร: data/maps.js TILE */\n'


def zone_rows(z, ores=None, extra=None):
    rows = [list(r) for r in remap(z['grid'], ZONE)]
    for (x, y, k) in (ores or []):
        if rows[y][x] == '.': rows[y][x] = 'o'
    if extra: extra(rows)
    return [''.join(r) for r in rows]

def tile_of_ops(ops):
    from collections import Counter
    c = Counter(int(o[1][0] // 128) + int(o[1][1] // 128) * 4 for o in ops if 'terrain' in o[0])
    return c.most_common(1)[0][0] if c else None

def circle(x, y, r=40): return [round(x, 3), round(y, 3), r]

def main():
    srcs = []
    out = []
    # ---------- ทุ่งหญ้า ----------
    f = d1['field']
    frows = remap(f['grid'], {'0': '.', '1': '~', '2': ':', '3': 't', '8': 'W', '9': 'G', '4': 'o', '5': '#', '6': '.', '7': '.'})
    zg = f['ZG']; wb = f['WBG64']
    field = f"""  field: {{
    n: 'ทุ่งหญ้า', kind: 'field', w: 60, h: 44, camOy: .58, /* spec01 §3 ทุ่ง oy .58 · §4 WORLD 60×44 (006:2) */
    look: {{ floor: 'terrain', tiles: {{ '.': 0, t: 0, G: 0, W: 0, '~': 3, ':': 2 }}, trees: 'oak' }}, /* buildGround 031:818 · WORLDART.tile 012-world-art */
    spawn: [57.5, 22.5, 'l'], /* D.ret เมือง → ทุ่ง (spec01 §4) */
    links: [
      {{ id: 'town', on: 'walk', box: [59.5, 21, .5, 3], to: 'town', at: [1.5, 17, 'r'] }}, /* TOWNGATE (59,21..23) 013:82 · enterTown(gate) 020:20 */
      {{ id: 'grove', on: 'walk', box: [0, 21, .5, 3], to: 'grove', front: [3.5, 22.5, 'r'] }}, /* EX16 ขอบตะวันตก (0,22) ret (112,720)px 047-fix16 */
      {{ id: 'volcano', on: 'walk', box: [29, 0, 3, .5], to: 'volcano', lv: 50, front: [30.5, 3.5, 'd'] }}, /* EX16 ขอบเหนือ (30,0) ret (976,112)px · ulv 50 */
      {{ id: 'portal', on: 'use', circle: {js(circle(zg['x']/T, zg['y']/T, 44))}, menu: ['iron', 'copper', 'silver', 'gold', 'diamond'], front: [37.5, 28.75, 'd'] }}, /* ประตูมิติ ZG (37,27) · zgNear · ret ZG+40px 031:1105 */
      {{ id: 'wboss', on: 'use', circle: {js(circle(wb['x']/T, wb['y']/T, 44))}, to: 'wboss', lv: 15, online: true, front: [37.5, 22.75, 'd'] }}, /* ลานบอสโลก WBG64 · ต้องออนไลน์+บอสเกิด+Lv15 (spec01 §4) */
    ],
    rows: {rows_js(frows)},
  }},
"""
    out.append(('field.js', 'field', field))

    # ---------- เมือง 1 ----------
    t = d1['town']
    trows = [list(r) for r in remap(t['grid'], ZONE)]
    for y in range(30, 33):
        for x in (32, 33): trows[y][x] = '.'  # ประตูใต้ fix76 SG76 108-fix76:55
    trows = [''.join(r) for r in trows]
    links = [
        "      { id: 'west', on: 'walk', box: [0, 16, .5, 2], to: 'field', at: [57.5, 22.5, 'l'] }, /* GATE ขอบซ้าย → ทุ่ง D.ret (spec01 §4) */",
        "      { id: 'east', on: 'walk', box: [42.6, 16, 1.4, 2], to: 'road', at: [2.2, 12.5, 'r'], front: [40, 16.6, 'l'] }, /* x>(TW-3)·T → enterRoad144('west') 023:26 · 171-fix144 setup */",
        "      { id: 'south', on: 'walk', box: [31.875, 32.35, 2.25, .65], to: 'market', at: [22, 2.9, 'd'], front: [33, 31, 'u'] }, /* ประตูใต้ SG76 inGate76 108-fix76:62 · MK81 113-fix81:171 */",
        "      { id: 'south-e', on: 'use', box: [31.69, 31.3, 2.63, 1.7], to: 'market', at: [22, 2.9, 'd'], front: [33, 31, 'u'] }, /* กด E ที่ประตูใต้ 108-fix76:63 */",
        "      { id: 'hall', on: 'use', circle: [22, 9.4, 40], to: 'shop.hall', at: [13, 13.4, 'u'], front: [22, 10.4, 'd'] }, /* ท้องพระโรง (22,9.4) spec01 §4 · enterHall 031 */",
        "      { id: 'tower', on: 'use', circle: [38.5, 8, 48], menu: 'tower', front: [38.5, 9.2, 'd'] }, /* หอคอยบอส TWR42 (38.5,8) spec01 §4 */",
    ]
    for dr in t['doors']:
        cx, cy = dr['cx'], dr['cy']
        to = 'use:ware' if dr['id'] == 'ware' else f"'shop.{dr['id']}'"
        if dr['id'] == 'ware':
            links.append(f"      {{ id: 'lodge', on: 'use', box: [{num((cx-30)/T)}, {num((cy-4)/T)}, {num(60/T)}, {num(34/T)}], use: 'lodge' }}, /* บ้านพักชาวเมือง (ประตู D.doors.ware เดิม ({cx},{cy})px): กด E → ป้าจันทร์คุย \"ฝากของไปที่ธนาคาร\" ไม่เข้าห้อง (164-fix137:10–16) · world ส่ง world:use {{id:'lodge'}} · บทพูดทำในเฟส NPC */")
        else:
            links.append(f"      {{ id: '{dr['id']}', on: 'use', box: [{num((cx-30)/T)}, {num((cy-4)/T)}, {num(60/T)}, {num(34/T)}], to: 'shop.{dr['id']}', at: [13, 13.4, 'u'], front: [{num(cx/T)}, {num((cy+24)/T)}, 'd'] }}, /* doorNear 020 ({cx},{cy})px |dx|<30 · กลับ (cx,cy+24) */")
    g, p = town()
    gpack = pack_ops(g, srcs)
    ppack = [[round(b, 1), pack_ops(fl, srcs)] for (b, fl) in p]
    town_js = f"""  town: {{
    n: 'เมืองเอลโดเรีย', kind: 'town', w: 44, h: 34, camOy: .55, /* TW/TH 010 */
    look: {{ floor: 'town', art: 'town' }}, /* พื้น TOWNFLOOR 012-town-floor · ภาพอาคาร TOWNART/DECOR560 012-core */
    spawn: [7, 21.5, 'd'], /* TOWN_SPAWN 031:1276 */
    links: [
{chr(10).join(links)}
    ],
    rows: {rows_js(trows)},
  }},
"""
    floor = """export const TOWN_FLOOR = {
  /* TOWNFLOOR.paint (012-town-floor) · ถนน road() ใน buildTown 031:1331 · ภาพ 4 ส่วน (stone grass / earth marble) */
  src: 'assets/town/ground-v538.png', size: 128,
  quad: { stone: [0, 0], grass: [1, 0], earth: [0, 1], marble: [1, 1] },
  roads: [[0, 16, 44, 2], [15, 10, 14, 14], [21, 9, 2, 1], [21, 24, 2, 4], [2, 28, 40, 2], [32, 30, 2, 3]], /* + ประตูใต้ fix76 */
  earth: [30, 19, 11, 5], marble: [3, 18, 9, 9],
  edge: 'rgba(240,223,179,.6)',
};
"""
    art_js = f"""/* ภาพอาคาร/ของตกแต่งเมือง 1 — ดึงจากการวาดจริงของเกมเดิม (buildTown + ของตั้งเรียงตาม y · 9 มุมกล้อง)
   ช่อง: [ภาพ, sx, sy, sw, sh, dx, dy, dw, dh, (กรอบตัด x,y,w,h)] · ภาพ = TOWN_ART.src[ช่องแรก] */
export const TOWN_ART = {{
  src: SRC,
  ground: {ops_js(gpack, '  ')},
  props: [ /* [ฐาน y (px) สำหรับเรียงหน้า-หลัง, รายการภาพ] */
{''.join(f'    {js(r)},' + chr(10) for r in ppack)}  ],
  roof: {{ part: .296, srcs: ['assets/town/shops.png', 'assets/town/houses-v560.webp', 'assets/town/landmarks.png'], skip: [[19, 2], [1132, 726], [1138, 492], [600, 478], [1020, 774]] }}, /* ส่วนหลังคาบังตัวละคร: TOWNART.bind roof=h·(1.42-1)/1.42 · ข้ามปราสาท/ลานวิหาร/หอคอย (ไม่มีหลังคา) */
}};
"""
    # ---------- ร้าน ----------
    shops = dict(d1['shops']); shops.update({k: v for k, v in d3['shops'].items() if k in ('hall', 'seal113')})
    names = {'gear': 'ร้านอาวุธ', 'potion': 'ร้านยา', 'inn': 'โรงเตี๊ยม', 'skill': 'ร้านสกิล', 'store': 'ร้านชำ', 'guild': 'กิลด์', 'fashion': 'ร้านแฟชั่น', 'bank': 'ธนาคาร', 'seal113': 'หอผนึก', 'hall': 'ท้องพระโรง'}
    shop_js = []
    for sid in ['gear', 'potion', 'inn', 'skill', 'store', 'guild', 'fashion', 'bank', 'seal113', 'hall']:
        v = shops[sid]
        rows = remap(v['grid'], ZONE)
        gx = [i for i, ch in enumerate(rows[-1]) if ch == 'G']
        extra = ''
        if sid == 'hall':
            extra = "\n      { id: 'dungeon', on: 'use', circle: [16.41, 9.3, 50], menu: 'dungeon', front: [16.41, 10.4, 'd'] }, /* รูปปั้นบันได DGST11 = 2·พระราชา−ALT7 (วัดในเกม 16.41,9.3) r50 042-fix11:40-41 → openDgMenu */"
        if sid == 'seal113':
            extra = "\n      { id: 'seal', on: 'use', circle: [13, 7.94, 90], menu: ['seal.thorn', 'seal.serp', 'seal.frost', 'seal.phar', 'seal.blood', 'seal.void'] }, /* แท่นผนึก (OX+8T, 7T+30) r90 145-fix113 · ลานผนึก LB62 094-fix62 */"
        shop_js.append(f"""  'shop.{sid}': {{
    n: '{names[sid]}', kind: 'shop', w: {v['W']}, h: {v['H']}, camOy: .55, /* IW/IH 26×15 */
    look: {{ floor: 'room', shop: '{sid}' }},
    spawn: [13, 13.4, 'u'], /* enterShop 022:39 วัด (416,428.8)px */
    links: [
      {{ id: 'out', on: 'walk', box: [{gx[0]}, {v['H']-1.2}, {len(gx)}, 1.2], to: '@back', at: [7, 21.5, 'd'] }}, /* แตะช่อง GATE แถวล่าง (ตัวชน y+4 ≥ 14·T) → หน้าประตู (leaveShop 022:51) */{extra}
    ],
    rows: {rows_js(rows)},
  }},
""")
    # ---------- เหมือง / ทุ่งสังหาร / ดันเมือง 2 (แบบ zone ทั่วไป) ----------
    zone_js = []
    for zi in ['0', '1', '2', '3', '4', '13', '14', '15', '16', '17', '18']:
        z = d1['zones'][zi]
        rows = zone_rows(z, z['ores'] if not z['id'].startswith('dg96') else [])
        e = z['ent']
        tile = tile_of_ops(z['ops'])
        pal = z['pal']
        kind = 'dg96' if z['id'].startswith('dg96') else 'mine' if int(zi) < 5 else 'zone'
        lv = z['lv']; ulv = z.get('ulv')
        extra = ''
        zone_js.append(f"""  {z['id']}: {{
    n: '{z['n']}', kind: '{kind}', w: {z['W']}, h: {z['H']}, camOy: .55, lv: {js(lv)},{f' ulv: {ulv},' if ulv else ''} /* ZONES[{zi}] · genZone 031:939 (ภาพรวม 1 แบบที่วัดได้) */
    look: {{ floor: 'zone', tile: {js(tile)}, pal: {js(pal)}, dark: {z.get('dark') or 0} }}, /* paintZone 031:961 · WORLDART.zoneTile */
    spawn: [{e['x']+.5}, {e['y']-.5}, 'u'], /* enterZone 031:1105 P=(ent.x, ent.y-1) */
    links: [
      {{ id: 'exit', on: 'use', circle: [{e['x']+.5}, {e['y']+2.5}, 40], to: '@back' }}, /* วงเวทใต้จุดเกิด zExitNear 031:1108 → กลับหน้าทางเข้า (DECISIONS 2026-10-30) */
    ],
    rows: {rows_js(rows)},
  }},
""")
    # ---------- ป่า (natGen16 / natGen42) ----------
    nat_js = []
    NATK = {'0': '.', '1': 'F', '2': 'w', '3': 'r', '4': 'L'}
    chain = {'grove': ('creek', 15), 'creek': ('pine', 22), 'pine': ('mist', 30)}
    for zi in ['5', '6', '7', '8', '9', '10', '11', '12']:
        z = d1['zones'][zi]; n3 = d3['nat'][zi]
        K = [list(remap([r], NATK)[0]) for r in n3['K']]
        W_ = z['W']
        for i in n3['path']:
            x, y = i % W_, i // W_
            if K[y][x] == '.': K[y][x] = 'p'
        for i in n3['bridge']:
            x, y = i % W_, i // W_
            K[y][x] = 'b'
        for (x, y, k) in n3['ores']:
            if K[y][x] in '.p': K[y][x] = 'o'
        # ตรวจ: ช่องเดินได้ต้องตรงกับ m ของเกมเดิม
        for y, r in enumerate(z['grid']):
            for x, ch in enumerate(r):
                walk = K[y][x] in '.pbo'
                assert walk == (ch == '0') or K[y][x] == 'o', (zi, x, y, ch, K[y][x])
        if z['gate15']:  # เสาประตูมิติชน: zHit 046-fix15:42 |x-gx|<12 · gy-10<y<gy+6 → ช่องที่ฐานเสาอยู่ (ผลตรวจ 1A-2 L3)
            gx, gy = int(z['gate15']['x'] // T), int(z['gate15']['y'] // T)
            K[gy][gx] = '#'
        rows = [''.join(r) for r in K]
        e = z['ent']; big = z['W'] == 88
        S = d3['NAT16'][z['id']]
        links = [f"      {{ id: 'exit', on: 'use', circle: [{e['x']+.5}, {e['y']+2.5}, 40], to: '@back' }}, /* วงเวท → กลับหน้าทางเข้า (DECISIONS) · เดิม D.ret */"]
        if z['gate15']:
            gt = z['gate15']
            links.append(f"      {{ id: 'gate', on: 'use', circle: [{num(gt['x']/T)}, {num(gt['y']/T)}, 44], to: '{gt['to']}', lv: {gt['ulv']}, front: [{num(gt['x']/T)}, {num((gt['y']+40)/T)}, 'd'] }}, /* ประตูมิติในป่า gateOf15 047-fix16 */")
        if z['gate42']:
            gt = z['gate42']; nx, nlv = chain[z['id']]
            links.append(f"      {{ id: 'gate', on: 'use', circle: [{num(gt['x']/T)}, {num(gt['y']/T)}, 44], to: '{nx}', lv: {nlv}, front: [{num(gt['x']/T)}, {num((gt['y']+40)/T)}, 'd'] }}, /* ประตู gate42 → แมพถัดไป CH42 074-fix42 */")
        spawn = f"[{e['x']+.5}, {e['y']-.5}, '{'l' if big else 'u'}']"
        nat_js.append(f"""  {z['id']}: {{
    n: '{z['n']}', kind: 'forest', w: {z['W']}, h: {z['H']}, camOy: .55, lv: {js(z['lv'])}, ulv: {z['ulv']}, /* ZONES[{zi}] · {'natGen42 074-fix42' if big else 'natGen16 048-fix17'} */
    look: {{ floor: 'nature', g: {js(S['g'])}, path: '{S['path']}', pathD: '{S['pathD']}', liq: {js(S['liq'])}, shore: '{S['shore']}', lava: {S.get('lava', 0)}, tree: '{ {'volcano': 'fire', 'shadow': 'spirit', 'throne': 'spirit', 'heaven': 'spirit', 'mist': 'ancient'}.get(z['id'], 'oak') }' }}, /* NAT16 · natPaint16 048-fix17 */
    spawn: {spawn}, /* ent{' · ป่าใหญ่หันซ้าย fix42' if big else ''} */
    links: [
{chr(10).join(links)}
    ],
    rows: {rows_js(rows)},
  }},
""")
    # ---------- แมพพิเศษ ----------
    sp = d1['special']
    def special(key, sid, n, kind, spawn, links, look, note, fix=None):
        v = sp[key]
        rows = [list(r) for r in remap(v['grid'], ZONE)]
        if fix: fix(rows)
        rows = [''.join(r) for r in rows]
        return f"""  '{sid}': {{
    n: '{n}', kind: '{kind}', w: {v['W']}, h: {v['H']}, camOy: .55, /* {note} */
    look: {js(look)},
    spawn: {js(spawn)},
    links: [
{chr(10).join('      ' + l for l in links)}
    ],
    rows: {rows_js(rows)},
  }},
"""
    sp_js = []
    ex = lambda v: f"{{ id: 'exit', on: 'use', circle: [{v['ent']['x']+.5}, {v['ent']['y']+2.5}, 40], to: '@back' }}, /* วงเวท → ปุ่มออกของแมพนั้น (fix147) → จุดที่เข้ามา (RET81) */"
    v = sp['tower']
    sp_js.append(special('tower', 'tower', 'หอคอยบอส', 'tower', [15, 20.5, 'u'], [ex(v)], {'floor': 'zone', 'pal': {'fl': ['#2a2438', '#262033', '#221d2e'], 'top': '#3a3150', 'face': '#2a2438', 'edge': '#141020', 'ac': '#8a6aff', 'vd': '#0c0a12'}, 'floors': d1['TW10PAL']}, 'buildTower10 039-fix8 · 30×24 · TW10.PAL สีตามชั้น · หอคอยนิรันดร์ end92 ใช้แมพเดียวกัน'))
    v = sp['mk']
    def mkfix(rows):
        for y in (0, 1):
            for x in (21, 22): rows[y][x] = '.'  # ช่องประตู mkGate81 113-fix81
    sp_js.append(special('mk', 'market', 'ตลาดกลาง', 'market', [22, 2.9, 'd'], ["{ id: 'out', on: 'walk', box: [20.875, 0, 2.25, 1.25], to: '@back', at: [33, 31, 'u'] }, /* เดินขึ้น y<1.25 ใกล้กลาง → leaveMk10 113-fix81:172 */"], {'floor': 'zone', 'pal': {'fl': ['#c8b08a', '#bfa680', '#b89c76'], 'top': '#6a4a32', 'face': '#8a6444', 'edge': '#4a3220', 'ac': '#ffd84a', 'vd': '#6a4a32'}}, 'buildMk10 040-fix9 · 44×30', mkfix))
    v = sp['wb']
    sp_js.append(special('wb', 'wboss', 'ลานบอสโลก', 'arena', [20.5, 26.5, 'u'], [ex(v)], {'floor': 'zone', 'pal': {'fl': ['#3a1a14', '#341612', '#2e1410'], 'top': '#2a0e0a', 'face': '#1a0806', 'edge': '#0a0302', 'ac': '#ff5a2a', 'vd': '#120606'}}, 'buildWb10 040-fix9 · 40×30 · ต้องออนไลน์'))
    v = sp['arena']
    sp_js.append(special('arena', 'arena', 'สนามประลอง', 'arena', [18.5, 22.5, 'u'], [ex(v)], {'floor': 'zone', 'pal': {'fl': ['#b89a6a', '#ae9062', '#a4875a'], 'top': '#5a4028', 'face': '#3a2a1a', 'edge': '#1e140a', 'ac': '#ffd84a', 'vd': '#3a2a1a'}}, 'buildArena8 031 · 36×26 · เข้าจากเมนู PvP'))
    v = sp['duel']
    sp_js.append(special('duel', 'duel', 'สังเวียนดวล', 'arena', [13.5, 14.5, 'u'], [ex(v)], {'floor': 'zone', 'pal': {'fl': ['#6a4a6a', '#624462', '#5a3e5a'], 'top': '#3a2a3a', 'face': '#2a1a2a', 'edge': '#140a14', 'ac': '#ff9ad8', 'vd': '#2a1a2a'}}, 'buildDuel29 060-fix29 · 26×18 · เข้าจากเมนูดวล'))
    for i, lb in enumerate(d1['LB62']):
        v = sp['lb%d' % i]
        m = lb['map']
        sp_js.append(special('lb%d' % i, 'seal.' + lb['id'], 'ลานผนึก' + lb['n'], 'seal', [18.5, 24.5, 'u'], [ex(v)], {'floor': 'zone', 'pal': {'fl': m['fl'] + [m['fl'][0]], 'top': m['wl'], 'face': m['wl'], 'edge': '#000000', 'ac': m['ac'], 'vd': m['wl']}, 'deco': m['deco']}, 'build62(%d) 094-fix62 · 36×28 · LB62' % i))
    v = sp['road']
    sp_js.append(special('road', 'road', 'ถนนตะวันออก', 'road', [2.2, 12.5, 'r'], [
        "{ id: 'town', on: 'walk', box: [0, 11, .5, 3], to: 'town', at: [40, 16.6, 'l'] }, /* ขอบซ้าย GATE → toTown144 171-fix144 */",
        "{ id: 'ferry', on: 'use', circle: [113, 11.5, 40], to: 'city2', lv: 150, at: [42, 56, 'u'], front: [110.5, 12.5, 'l'] }, /* ลุงบรอม คนเรือ (113,11.5) ferry · C2.LV 150 · ขึ้นเรือ (1344,1792)px วัดแล้ว */",
    ], {'floor': 'road', 'g': [[78, 124, 62], [90, 138, 70], [66, 110, 54], [104, 146, 78]], 'pathC': '#8a7450', 'pathD': '#66543a', 'tree': 'oak', 'sea': [103], 'path': {'y': 12, 'amp': 2.4, 'x0': 6, 'x1': 86, 'ramp': 10, 'period': 11}}, 'buildRoad144 171-fix144 · 124×24 · ไม่มีมอน · ท่าเรือ x≥110'))
    # ---------- เมือง 2 ----------
    c = d3['c2']
    crow = remap(c['grid'], ZONE)
    names2 = c2t['names']
    ter = {'sea': '~', 'plaza': 'P', 'land': 'l', 'bridge': 'b', 'street': 's', 'path': 'p', 'garden': 'g', 'dock': 'd'}
    trow = [''.join(ter[names2[int(ch, 36)]] for ch in r) for r in c2t['rows']]
    links = ["      { id: 'exit', on: 'use', circle: [41.5, 59.5, 40], to: '@back', home: 'road', at: [110.5, 12.5, 'l'] }, /* วงเวทเกาะใต้ → backToCity1 = enterRoad144('port') 171-fix144 */"]
    for i in range(5):
        x = 33.5 + 16 * i / 4 + .5
        links.append(f"      {{ id: 'dg{i}', on: 'use', circle: [{num(x)}, 5.225, 44], to: '{'dg96' + 'abcde'[i]}', lv: {150 + 10*i}, front: [{num(x)}, 6.6, 'd'] }}, /* portalPos95 127-fix95:151 · ดันเมือง 2 (DG96) */")
    for dr in c['doors']:
        links.append(f"      {{ id: '{dr['id']}', on: 'use', circle: [{num(dr['x']/T)}, {num(dr['y']/T)}, 40], to: 'shop.{dr['id']}', at: [13, 13.4, 'u'], front: [{num(dr['x']/T)}, {num(dr['y']/T + .75)}, 'd'] }}, /* ประตูร้าน C2.doors ({dr['n']}) near95 r40 */" if dr['id'] != 'ware' else f"      {{ id: 'ware', on: 'use', circle: [{num(dr['x']/T)}, {num(dr['y']/T)}, 40], use: 'ware' }}, /* คลังสินค้าท่าเรือ (หน้าต่างคลัง) */")
    g2, p2 = city2()
    c2g = pack_ops(g2, srcs)
    c2p = [[round(b, 1), pack_ops(fl, srcs)] for (b, fl) in p2]
    c2_js = f"""  city2: {{
    n: 'นครวารีอัสตรา', kind: 'town', w: 84, h: 64, camOy: .55, lv: 150, /* C2 127-fix95:8 · ผัง build98 130-fix98 */
    look: {{ floor: 'city2', art: 'city2' }},
    spawn: [42, 56, 'u'], /* ขึ้นจากเรือ (วัด 1344,1792 px) */
    links: [
{chr(10).join(links)}
    ],
    rows: {rows_js(crow)},
    ground: {rows_js(trow)}, /* ชนิดพื้น: ~ ทะเล · P ลาน · l ดิน · b สะพาน · s ถนน · p ทางเดิน · g สวน · d ท่าเรือ */
  }},
"""
    c2art = f"""export const CITY2_ART = {{
  src: SRC,
  street: 'assets/city2/ground-v558.webp', /* ถนน: ตัดภาพ 384×384 ตามตำแหน่ง px%384 (build98 130-fix98:117) */
  colors: {{ '~': ['#22689c', '#2a74aa'], P: ['#d8cfc0', '#cfc5b4'], l: ['#6a8a4a', '#62824a'], b: ['#8a6a44', '#7a5c3a'], p: ['#b8a888', '#ae9e7e'], g: ['#5a8a42', '#527e3c'], d: ['#7a5a3a', '#6e5034'] }}, /* สีแทนลายพื้นที่วาดด้วยโค้ด */
  ground: {ops_js(c2g, '  ')},
  props: [
{''.join(f'    {js(r)},' + chr(10) for r in c2p)}  ],
}};
"""
    # ---------- เขียนไฟล์ ----------
    srcjs = 'const SRC = ' + js(srcs) + '; /* ภาพจาก assets/ ของเกมเดิม (กติกาภาพ spec01 §10: อาคาร/พื้น/ต้นไม้/ของตกแต่ง) */\n'
    write('field.js', HEAD, 'export default {\n' + field + '};\n')
    write('town.js', HEAD + srcjs, 'export default {\n' + town_js + '};\n\n' + floor + '\n' + art_js)
    write('shops.js', HEAD, 'export default {\n' + ''.join(shop_js) + '};\n')
    write('zones.js', HEAD, 'export default {\n' + ''.join(zone_js) + '};\n')
    write('forests.js', HEAD, 'export default {\n' + ''.join(nat_js) + '};\n')
    write('special.js', HEAD, 'export default {\n' + ''.join(sp_js) + '};\n')
    write('city2.js', HEAD + srcjs, 'export default {\n' + c2_js + '};\n\n' + c2art)

main()
