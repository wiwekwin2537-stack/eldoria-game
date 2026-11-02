#!/bin/bash
# ปักหมุด jsDelivr ให้โหลดโค้ด/ภาพจากคอมมิตล่าสุด (v5.73 · ทำทุกครั้งก่อน push ที่แก้ js/ หรือ assets/)
# ใช้: commit งานให้เสร็จก่อน → bash tools/pin_cdn.sh → push ครั้งเดียว (ได้ 2 คอมมิต: งาน + ปักหมุด)
# ทำไม: เกมโหลด js/ + assets/ จาก cdn.jsdelivr.net/gh/...@<คอมมิต> (ฟรี) แทน Render (เน็ตฟรีแค่ 5 GB/เดือน)
#       ส่ง tag ผ่านเครื่องมือ AI ไม่ได้ เลยใช้รหัสคอมมิตแทน
cd "$(dirname "$0")/.." || exit 1
if ! git diff --quiet HEAD -- js assets; then echo "❌ มีไฟล์ js/ หรือ assets/ ที่ยังไม่ commit — commit ก่อน"; exit 1; fi
sha=$(git rev-parse HEAD)
python3 - "$sha" <<'P'
import re,sys
p='index.html';s=open(p,encoding='utf8').read()
n=re.sub(r'(<meta name="eldoria-cdn" content="https://cdn\.jsdelivr\.net/gh/wiwekwin2537-stack/eldoria-game@)[^/"]*(/")',r'\g<1>'+sys.argv[1]+r'\2',s)
assert n!=s or sys.argv[1] in s, 'ไม่เจอ meta eldoria-cdn'
open(p,'w',encoding='utf8').write(n)
P
git add index.html && git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "ปักหมุด CDN → ${sha:0:7}" && echo "✅ ปักหมุด CDN ที่ ${sha:0:7} แล้ว — push ได้"
