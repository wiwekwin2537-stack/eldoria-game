#!/bin/bash
# เทสเร็วก่อน push (เจ้าของสั่ง 2026-10-22): ใช้ ~2–5 นาที แทนเทสเต็ม ~40 นาที
#  1) ตรวจ syntax ทุกไฟล์  2) เปิดเกมจริง รันเช็กกันบัคเก่า REG136 ทุกข้อ  3) รันเทสใน tests/ เฉพาะที่เกี่ยวกับงาน
# ใช้: bash tests/quick.sh tests/xxx_test.js tests/yyy_test.js   (ใส่ชื่อเทสของระบบที่แก้ · ไม่ใส่ = ข้อ 1–2 อย่างเดียว)
cd "$(dirname "$0")/.." || exit 1
export NODE_PATH="${NODE_PATH:+$NODE_PATH:}/opt/npm-tools/node_modules" # v5.76: ต่อท้ายเสมอ (เครื่องที่ตั้ง NODE_PATH ไว้แล้วแต่ไม่มี ws → เซิร์ฟเวอร์เปิดไม่ขึ้น)
fail=0
for f in js/*.js sw.js server.js accounts.js world.js pvp.js party.js market.js; do [ -f "$f" ] && { node --check "$f" 2>/dev/null || { echo "SYNTAX FAIL $f"; fail=1; }; }; done
[ -d node_modules/ws ] || npm install --silent >/dev/null 2>&1
pkill -f "^node server.js" 2>/dev/null; sleep 1
D=$(mktemp -d); DATA_DIR=$D PORT=8787 UPSTASH_REDIS_REST_URL= UPSTASH_REDIS_REST_TOKEN= node server.js >/dev/null 2>&1 & S=$!; sleep 3
node tests/quick_reg.js || fail=1
kill $S 2>/dev/null; wait $S 2>/dev/null; rm -rf "$D"; for i in $(seq 1 20); do (echo >/dev/tcp/127.0.0.1/8787) 2>/dev/null || break; sleep 0.5; done # v5.76: รอพอร์ต 8787 ว่างจริง ไม่งั้นเทสถัดไปเปิดเซิร์ฟเวอร์ชนพอร์ต
for t in "$@"; do if timeout 900 node "$t" >/tmp/quick_t.out 2>&1; then echo "PASS $t"; else echo "FAIL $t"; tail -4 /tmp/quick_t.out; fail=1; fi; done
pin=$(grep -o 'eldoria-game@[0-9a-f]\{40\}' index.html | cut -d@ -f2)
if [ -n "$pin" ] && ! git diff --quiet "$pin" HEAD -- js assets 2>/dev/null; then echo "⚠️ CDN ยังปักหมุดคอมมิตเก่า ${pin:0:7} แต่ js/ หรือ assets/ เปลี่ยนแล้ว → commit แล้วรัน bash tools/pin_cdn.sh ก่อน push"; fi
if ! git diff --quiet HEAD -- js assets; then echo "ℹ️ ยังมี js/assets ที่ไม่ commit — commit แล้วรัน bash tools/pin_cdn.sh ก่อน push"; fi
[ $fail = 0 ] && echo "✅ QUICK PASS" || echo "❌ QUICK FAIL"; exit $fail
