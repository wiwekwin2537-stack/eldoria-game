/* เทส: สคริปต์โหลดช้า (มือถือ/เน็ตช้า) จนต่อออนไลน์และส่ง "hi" ก่อน js/040-fix9.js โหลดเสร็จ → ต้องยืนยันบัญชีออนไลน์ (ON10.auth) ได้เอง
   บัคเดิม: auth ส่งเฉพาะตอนตัวดักใน fix9 เห็น "hi" · ถ้า hi ออกไปก่อน fix9 โหลด จะไม่มีใครส่ง auth อีกเลย
   → ตลาด/เทรด/จดหมาย/บอสโลก ใช้ไม่ได้จนกว่าจะหลุดแล้วต่อใหม่ · test_supplies_browser_test สุ่มพังด้วยเหตุนี้ตอนเครื่องหนัก
   รัน: NODE_PATH=... ELD_CHROMIUM=... node tests/ws_auth_late_browser_test.js  (พอร์ต ELD_WSAUTH_PORT ค่าเริ่ม 8842) */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{const root=path.join(__dirname,'..'),port=process.env.ELD_WSAUTH_PORT||'8842',origin='http://127.0.0.1:'+port,dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-wsauth-'));let browser,slow=false;
const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:port,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
try{await new Promise((r,j)=>{server.stdout.once('data',r);server.once('exit',c=>j(new Error('server exit '+c)))});
browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox']});const ctx=await browser.newContext({viewport:{width:915,height:412},isMobile:true,hasTouch:true});
/* ถ่วงไฟล์ fix9 จนกว่าซ็อกเก็ตจะส่ง hi แล้ว (รอเงื่อนไขจริง ไม่ใช่เดาเวลา) */
let hiSent=null,release;const hiGate=new Promise(r=>release=r);
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());if(u.origin!==origin)return r.abort();if(slow&&u.pathname==='/js/040-fix9.js'){await Promise.race([hiGate,new Promise(x=>setTimeout(x,45000))])}return r.continue()});
const page=await ctx.newPage();page.setDefaultTimeout(60000);
/* เกมส่ง hi 2 ครั้ง (ตอนต่อ + รอบเช็กชื่อ 2 วินาที) · ปล่อย fix9 หลัง hi ครั้งที่ 2 = กรณีที่ผู้เล่นเครื่องช้าเจอ */let hiCount=0;page.on('websocket',ws=>ws.on('framesent',f=>{if(slow&&/"t":"hi"/.test(String(f.payload))&&++hiCount===2){hiSent=Date.now();setTimeout(release,300)}}));
const url=origin+'/?server=ws://127.0.0.1:'+port;await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!window.FM_LOADING&&window.REG136);
await page.evaluate(()=>tRegForm());await page.locator('#rId').fill('wsauthtester');await page.locator('#rPw').fill('Test1234');await page.locator('#rPw2').fill('Test1234');await page.locator('#rGo').click();await page.locator('#cc41n').fill('นักทดสอบ');
await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('#cc41go').click()]);
const enter=async()=>{await page.waitForFunction(()=>typeof ONL32!=='undefined'&&(ONL32.verified||!!document.getElementById('tPlay')));if(!await page.evaluate(()=>ONL32.verified))await page.locator('#tPlay').click();await page.waitForFunction(()=>ONL32.verified,null,{timeout:30000})};
await enter();await page.waitForFunction(()=>ON10.auth,null,{timeout:30000});
slow=true;await page.reload({waitUntil:'commit'});await page.waitForFunction(()=>!window.FM_LOADING&&window.REG136,null,{timeout:90000});await enter();
const auth=await page.waitForFunction(()=>ON10.auth,null,{timeout:20000}).then(()=>true,()=>false);
const out={hiBeforeFix9:!!hiSent,auth};console.log(JSON.stringify(out));
assert.equal(out.hiBeforeFix9,true,'setup: socket must send hi before fix9 loads (otherwise this test proves nothing)');
assert.equal(auth,true,'account must authenticate online even when fix9 loads after the socket said hi');console.log('WS AUTH LATE BROWSER PASS');
}finally{await browser?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}})().catch(e=>{console.error(e);process.exitCode=1});
