"""เปิดเกมจริงในเบราว์เซอร์ (จอมือถือแนวนอน) → ล็อกอิน → รันสคริปต์ JS → แคปจอ  (ใช้ทำให้บัคเกิดซ้ำ / ตรวจหลังแก้)
ก่อนรัน: เปิดเซิร์ฟเวอร์ในเครื่อง  DATA_DIR=/tmp/eld PORT=8787 node server.js
usage:  python3 tests/play.py ID PASS script.js [shot.png] [--new]
  --new = สมัครไอดีใหม่ (ID/PASS) แทนการล็อกอิน · script.js = ฟังก์ชัน async () => {...} คืนค่าที่อยากดู (พิมพ์ออกมา)
ตัวอย่าง script: async () => { enterZone(0); await new Promise(r=>setTimeout(r,1500)); return {lv:P.lv, zone:D.zone&&D.zone.Zd.id} }
หมายเหตุ: ล็อกอินแล้วเกมรีโหลดหน้า 1 ครั้ง (ปกติ) · ค่าโปร่งใส/แมพดำ ฯลฯ ต้องดูจากรูปแคปจอ ไม่ใช่แค่ค่าตัวแปร"""
import sys, json
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:8787/?server=ws://127.0.0.1:8787'
LOGIN = """async ([id,pw,isNew]) => { const sl=ms=>new Promise(r=>setTimeout(r,ms));
  (isNew&&typeof tRegForm==='function'?tRegForm:tLoginForm)(); await sl(400);
  const ins=[...document.querySelectorAll('#title input')].filter(i=>i.offsetParent!==null);
  const t=ins.filter(i=>i.type!=='password'), p=ins.filter(i=>i.type==='password');
  if(t[0]){t[0].value=id;t[0].dispatchEvent(new Event('input',{bubbles:true}))} if(t[1]){t[1].value=id;t[1].dispatchEvent(new Event('input',{bubbles:true}))}
  for(const x of p){x.value=pw;x.dispatchEvent(new Event('input',{bubbles:true}))}
  const go=[...document.querySelectorAll('#title button')].filter(b=>b.offsetParent!==null&&/เข้าสู่|เข้าเกม|ล็อกอิน|สมัคร|สร้าง/.test(b.textContent)).pop(); if(go)go.click(); }"""
id_, pw, js = sys.argv[1], sys.argv[2], open(sys.argv[3], encoding='utf-8').read()
shot = next((a for a in sys.argv[4:] if a.endswith('.png')), None)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_context(viewport={'width': 915, 'height': 412}, is_mobile=True, has_touch=True).new_page()
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200])); pg.on('dialog', lambda d: d.accept())
    pg.set_default_timeout(600000)
    pg.goto(URL, wait_until='load', timeout=180000); pg.wait_for_timeout(4000)
    try: pg.evaluate(LOGIN, [id_, pw, '--new' in sys.argv])
    except Exception: pass
    pg.wait_for_timeout(10000)
    try: pg.evaluate("() => { const s=[...document.querySelectorAll('button')].find(b=>/ข้าม/.test(b.textContent)&&b.offsetParent!==null); if(s)s.click() }")
    except Exception: pass
    r = pg.evaluate(js)
    print(json.dumps(r, ensure_ascii=False, indent=1))
    if errs: print('PAGE ERRORS:', errs[:5])
    if shot: pg.screenshot(path=shot); print('shot:', shot)
    b.close()
