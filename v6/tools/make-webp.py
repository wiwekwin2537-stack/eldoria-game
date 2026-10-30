#!/usr/bin/env python3
"""สร้างภาพ webp ของ v6 จากภาพเกมเดิม (งาน 1A-4 ภาพเบา) — รันซ้ำได้ ผลเหมือนเดิมทุกครั้ง
   รัน: python3 v6/tools/make-webp.py   (ต้องมี Pillow ที่รองรับ webp)
   - อ่านจาก assets/ ของเกมเดิม (ไม่แก้ ไม่ลบ) → เขียนลง v6/assets/
   - ขนาดภาพเท่าเดิมทุกภาพ (ตำแหน่งตัดภาพใน data/ ไม่ต้องเปลี่ยน) ยกเว้นที่เขียนเหตุผลไว้ในตาราง
   - ช่องโปร่งใส (alpha) เก็บแบบไม่เสียคุณภาพทุกภาพ (alpha_quality=100) → ขอบอาคาร/ต้นไม้คมเท่าเดิม
   - เลือกคุณภาพต่อภาพ (วัดแล้ว · ดูตาราง) · ภาพ PNG จานสี (ต้นไม้) = แบบไม่เสียคุณภาพ (เล็กกว่า PNG เดิมอยู่แล้ว)
   - ภาพที่ v6 ใช้ทั้งหมดอยู่ในตารางนี้ · ชื่อปลายทางคือชื่อที่ data/art.js · data/maps/town.js · city2.js อ้าง
   - ตรวจ: ทุกภาพเปิดได้ ขนาดตรงตาราง · พิมพ์ขนาดก่อน/หลัง
   - ⚠️ รุ่นที่ใช้สร้างภาพที่ commit อยู่: Pillow 12.3.0 · libwebp 1.6.0 (ผลตรวจ 1A-4 L5)
     "ผลเหมือนเดิม" จริงเฉพาะรุ่นนี้ · รุ่นอื่นได้ไบต์ต่าง → git เก็บภาพใหม่ทั้ง ~3.9 MB อีกรอบ
     → รันใหม่เฉพาะเมื่อภาพต้นฉบับเปลี่ยน/เพิ่มภาพ · สคริปต์เตือนถ้ารุ่นไม่ตรง · รันหนึ่งรอบ >2 นาที (method=6)"""
import os, sys
import PIL
from PIL import Image, features

BUILT_WITH = {'Pillow': '12.3.0', 'libwebp': '1.6.0'}  # รุ่นที่สร้างภาพใน v6/assets/ (ดูหัวไฟล์)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'v6', 'assets')

# (ต้นฉบับใน assets/ เกมเดิม, ปลายทางใน v6/assets/, วิธี, หมายเหตุ)
#   วิธี: ('lossy', q) = webp คุณภาพ q + alpha ไม่เสีย · ('lossless',) = ไม่เสียคุณภาพ · ('copy',) = คัดลอกไฟล์ webp เดิมตรง ๆ
#         ('lossy', q, (w, h)) = ย่อขนาดก่อน (เฉพาะภาพที่ตำแหน่งคิดจากขนาดภาพจริง ไม่ใช่พิกัดตายตัว)
# อาคาร/ของตกแต่ง: วาดย่อเหลือ 0.09–0.42 เท่า (สูงสุด 0.83) ของภาพ → q85 มองไม่เห็นความต่าง (วัด PSNR ~34–37 dB)
TABLE = [
    # เมือง 1 (TOWN_ART · TOWN_FLOOR · data/maps/town.js)
    ('assets/town/ground-v538.png',     'town/ground-v538.webp',     ('lossy', 90, (256, 256)),
     'พื้นเมือง 1: ใช้ 4 ส่วน (ย่อแยกทีละส่วน) แต่ละส่วนย่อเป็นลาย 128 px ตอนวาด (TOWN_FLOOR.size · tiles.js town) → ย่อไว้ก่อน 1254→256 ได้ภาพเท่าที่จอเห็นจริง'),
    ('assets/town/landmarks.png',       'town/landmarks.webp',       ('lossy', 85), 'สถานที่สำคัญ (PNG 2.9 MB)'),
    ('assets/town/shops.png',           'town/shops.webp',           ('lossy', 85), 'ร้านค้า (PNG 2.8 MB)'),
    ('assets/town/props-v560.webp',     'town/props-v560.webp',      ('lossy', 85), 'ของตกแต่ง (webp เดิม q สูง)'),
    ('assets/town/details-v560.webp',   'town/details-v560.webp',    ('lossy', 85), 'ของชิ้นเล็ก (วาดย่อ ≤0.24 เท่า)'),
    ('assets/town/houses-v560.webp',    'town/houses-v560.webp',     ('lossy', 85), 'บ้าน'),
    ('assets/town/goddess-v562.webp',   'town/goddess-v562.webp',    ('lossy', 85), 'รูปปั้นเทพี'),
    # เมือง 2 (CITY2_ART · data/maps/city2.js)
    ('assets/city2/houses-v560.webp',   'city2/houses-v560.webp',    ('lossy', 85), 'บ้านเมือง 2'),
    ('assets/city2/remaining-v560.webp','city2/remaining-v560.webp', ('lossy', 85), 'อาคารอื่นเมือง 2'),
    ('assets/city2/buildings-v558.webp','city2/buildings-v558.webp', ('lossy', 85), 'อาคารใหญ่เมือง 2'),
    ('assets/city2/ground-v558.webp',   'city2/ground-v558.webp',    ('copy',),     'ถนนเมือง 2: วาด 1:1 และเล็กอยู่แล้ว (63 KB) → คัดลอกตรง ๆ'),
    # ทุ่ง/ป่า/เหมือง (data/art.js · ภาพเดิมอยู่ assets/incoming/ — v6 ไม่โหลดจาก incoming แล้ว)
    ('assets/incoming/terrain-v585.png',     'world/terrain-v585.webp',     ('lossy', 90), 'ช่องพื้นทุ่ง/เหมือง 128 px วาดย่อเหลือ 32 · ช่อง 128 หาร 16 ลงตัว ไม่มีรอยต่อข้ามช่อง'),
    ('assets/incoming/tree-oak-v585.png',    'world/tree-oak-v585.webp',    ('lossless',), 'ต้นไม้ (PNG จานสี · แบบไม่เสียเล็กกว่า PNG)'),
    ('assets/incoming/tree-ancient-v585.png','world/tree-ancient-v585.webp',('lossless',), 'ต้นไม้'),
    ('assets/incoming/tree-fire-v585.png',   'world/tree-fire-v585.webp',   ('lossless',), 'ต้นไม้'),
    ('assets/incoming/tree-spirit-v585.png', 'world/tree-spirit-v585.webp', ('lossless',), 'ต้นไม้'),
]


def convert(src, dst, how):
    if how[0] == 'copy':
        with open(src, 'rb') as a, open(dst, 'wb') as b:
            b.write(a.read())
        return Image.open(src).size
    im = Image.open(src)
    im.load()
    im = im.convert('RGBA' if ('A' in im.getbands() or im.mode == 'P') else 'RGB')
    if len(how) > 2:  # ย่อทีละส่วน 2×2 (ลายพื้น 4 แบบ) → ขอบลายไม่ปนกันตรงรอยแบ่ง
        w, h = im.size
        out = Image.new(im.mode, how[2])
        qw, qh = how[2][0] // 2, how[2][1] // 2
        for qy in range(2):
            for qx in range(2):
                part = im.crop((qx * w // 2, qy * h // 2, (qx + 1) * w // 2, (qy + 1) * h // 2)).resize((qw, qh), Image.LANCZOS)
                out.paste(part, (qx * qw, qy * qh))
        im = out
    if how[0] == 'lossless':
        im.save(dst, 'WEBP', lossless=True, quality=100, method=6)
    else:
        im.save(dst, 'WEBP', quality=how[1], method=6, alpha_quality=100)
    return im.size


def check_versions():
    now = {'Pillow': PIL.__version__, 'libwebp': features.version('webp')}
    if now != BUILT_WITH:
        print(f'⚠️ รุ่นไม่ตรงกับที่สร้างภาพเดิม: ตอนนี้ {now} · เดิม {BUILT_WITH} → ไบต์ภาพจะต่างจากที่ commit (ภาพทั้งชุดเปลี่ยน)')
    return now


def main():
    check_versions()
    tot_a = tot_b = 0
    bad = 0
    print(f'{"ภาพ":44} {"เดิม":>9} {"ใหม่":>9}  ขนาด')
    for src, dst, how, _note in TABLE:
        s, d = os.path.join(ROOT, src), os.path.join(OUT, dst)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        want = Image.open(s).size if len(how) < 3 else how[2]
        size = convert(s, d, how)
        chk = Image.open(d)
        chk.load()
        if chk.size != tuple(want) or chk.format != 'WEBP':
            bad += 1
            print('  ❌ ขนาด/ชนิดไม่ตรง', dst, chk.size, want, chk.format)
        a, b = os.path.getsize(s), os.path.getsize(d)
        tot_a += a
        tot_b += b
        print(f'{dst:44} {a // 1024:>6} KB {b // 1024:>6} KB  {size[0]}×{size[1]} {how}')
    print(f'{"รวม":44} {tot_a // 1024:>6} KB {tot_b // 1024:>6} KB')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
