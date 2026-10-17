"""ระยะ 1 — แยกโค้ดออกจาก index.html เป็นไฟล์ในโฟลเดอร์ js/ (ไม่เปลี่ยนการทำงาน) · ใช้ครั้งเดียวตอนแยก
- บล็อก <script> แต่ละบล็อก → 1 ไฟล์ (คงขอบเขตเดิม: error ในบล็อกหนึ่งไม่ลามบล็อกอื่น เหมือนเดิม)
- บล็อกยักษ์ (เกมหลัก + fix1–fix40 ที่เคยรวมกัน) → ตัดที่หัว "// fixN.js" ซึ่งเดิมเป็นไฟล์แยกกันอยู่แล้ว
- index.html เหลือ HTML + <script src="js/...?v=VER">
usage: python3 tools/split_html.py VER   (รันจากโฟลเดอร์โปรเจกต์)"""
import re, os, sys
VER = sys.argv[1]
s = open('index.html', encoding='utf-8').read()
os.makedirs('js', exist_ok=True)
blocks = list(re.finditer(r'<script>(.*?)</script>', s, re.S))
out, pos, n, files = [], 0, 0, []

def label(code, i):
    m = re.search(r'^//\s*(fix\d+)', code, re.M)
    if m and code.lstrip().startswith('//') and re.match(r'\s*//\s*=*\s*\n?\s*//\s*fix\d+|\s*//\s*fix\d+', code): return m.group(1)
    m = re.search(r'^//\s*(fix\d+)\b', code[:600], re.M)
    return m.group(1) if m else 'core'

def emit(code):
    global n
    n += 1
    name = '%03d-%s.js' % (n, label(code, n))
    open('js/' + name, 'w', encoding='utf-8').write(code.strip('\n') + '\n')
    files.append(name)
    return '<script src="js/%s?v=%s"></script>' % (name, VER)

for b in blocks:
    out.append(s[pos:b.start()])
    code = b.group(1)
    if code.count('\n') > 3000:  # บล็อกยักษ์: ตัดที่หัวไฟล์ fixN.js เดิม
        cuts = [m.start() for m in re.finditer(r'^// fix\d+\.js\b', code, re.M)]
        parts, last = [], 0
        for c in cuts:
            parts.append(code[last:c]); last = c
        parts.append(code[last:])
        out.append('\n'.join(emit(p) for p in parts if p.strip()))
    else:
        out.append(emit(code))
    pos = b.end()
out.append(s[pos:])
open('index.html', 'w', encoding='utf-8').write(''.join(out))
print(len(files), 'files ·', 'index.html', len(''.join(out)), 'bytes')
