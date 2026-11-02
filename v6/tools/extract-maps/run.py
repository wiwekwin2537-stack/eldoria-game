import sys, json, os
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','..'))  # โฟลเดอร์เกมเดิม (repo เดียวกับสคริปต์)
sys.path.insert(0,os.path.join(ROOT,'tests'))
from playwright.sync_api import sync_playwright
src=open(os.path.join(ROOT,'tests','play.py'),encoding='utf-8').read()
LOGIN=src.split('LOGIN = """')[1].split('"""')[0]
URL='http://127.0.0.1:8787/?server=ws://127.0.0.1:8787'
id_,pw,js,out=sys.argv[1],sys.argv[2],open(sys.argv[3],encoding='utf-8').read(),sys.argv[4]
shots=sys.argv[5] if len(sys.argv)>5 else None
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_context(viewport={'width':1366,'height':768}).new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]));pg.on('dialog',lambda d:d.accept())
    pg.set_default_timeout(900000)
    pg.goto(URL,wait_until='load',timeout=180000);pg.wait_for_timeout(4000)
    try: pg.evaluate(LOGIN,[id_,pw,'--new' in sys.argv])
    except Exception: pass
    pg.wait_for_timeout(12000)
    try: pg.evaluate("() => { const s=[...document.querySelectorAll('button')].find(b=>/ข้าม/.test(b.textContent)&&b.offsetParent!==null); if(s)s.click() }")
    except Exception: pass
    pg.wait_for_timeout(1500)
    r=pg.evaluate(js)
    json.dump(r,open(out,'w'),ensure_ascii=False)
    print('ok',len(json.dumps(r)),'errs',errs[:5])
    if shots: pg.screenshot(path=shots)
    b.close()
