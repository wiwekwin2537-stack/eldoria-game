/* เทส: แตะปุ่มติดกันเร็ว ๆ (ห่างกันไม่ถึง 300ms) ต้องไม่ทำให้การแตะครั้งหลังหาย
   บัคเดิม: ตัวกันซูมแตะสองครั้ง (js/113-fix81.js) เรียก preventDefault() ที่ touchend ทุกครั้งที่ห่างจากครั้งก่อน <300ms
   → เบราว์เซอร์ไม่ส่ง click → ปุ่ม onclick ไม่ทำงาน (กดรวมอัญมณีรัว ๆ ได้ครึ่งเดียว · ปิดหน้าต่างแล้วค้าง)
   ยังต้องกันซูมแตะสองครั้งบนพื้นที่ที่ไม่ใช่ปุ่มเหมือนเดิม
   รัน: NODE_PATH=... ELD_CHROMIUM=... node tests/tap_guard_browser_test.js  (พอร์ต ELD_TAP_PORT ค่าเริ่ม 8841) */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{const root=path.join(__dirname,'..'),port=process.env.ELD_TAP_PORT||'8841',base='http://127.0.0.1:'+port,dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-tap-'));let browser;
const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:port,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
try{await new Promise((r,j)=>{server.stdout.once('data',r);server.once('exit',c=>j(new Error('server exit '+c)))});
browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:853,height:384},hasTouch:true,isMobile:true});page.setDefaultTimeout(60000);
await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
await page.goto(base+'/?devtest=1');await page.addStyleTag({content:'#rot{display:none!important}'});
await page.waitForFunction(()=>!FM_LOADING&&window.REG136);await page.waitForFunction(()=>!gid('boot106'));
await page.evaluate(()=>{PAUSED=true;titleEl.hidden=true;intro.hidden=true;dlgClose(true)});
const fails=[];
/* 1) ผู้เล่นมีอัญมณีแดงขั้น 1 จำนวน 9 เม็ด → แตะปุ่ม "รวม" 3 ครั้งติดกัน ห่างกัน ~120ms → ต้องได้ขั้น 2 = 3 เม็ด */
await page.evaluate(()=>{inv.gm117_r1=9;inv.gm117_r2=0;open117()});
const mixBtn=()=>page.locator('#gm117w .gc button').first();
const label=await mixBtn().getAttribute('onclick');assert.match(label,/gMix117\('r',1\)/,'first merge button is red tier 1');
for(let i=0;i<3;i++){await mixBtn().tap();await page.waitForTimeout(120)}
const mix=await page.evaluate(()=>({r1:inv.gm117_r1|0,r2:inv.gm117_r2|0}));
if(mix.r1!==0||mix.r2!==3)fails.push({rapidMerge:mix,want:{r1:0,r2:3}});
/* 2) ปิดหน้าต่างอัญมณี → เปิดใหม่ → ปิดทันที (2 แตะห่างกัน <300ms) → หน้าต่างต้องปิดจริง */
await page.locator('#gm117w .hd button').tap();await page.evaluate(()=>open117());await page.locator('#gm117w .hd button').tap();
const still=await page.evaluate(()=>!gid('gm117w').hidden);if(still)fails.push('gem window stays open after quick re-open + close');
/* 3) ตัวกันซูมยังทำงาน: แตะพื้นที่ว่าง (ไม่ใช่ปุ่ม) 2 ครั้งติดกัน → touchend ครั้งที่ 2 ต้องถูก preventDefault */
await page.evaluate(()=>{window.__te=[];document.addEventListener('touchend',e=>{const t=Date.now();setTimeout(()=>__te.push({t,p:e.defaultPrevented}))},false);
 const d=document.createElement('div');d.id='tap_guard_blank';d.style.cssText='position:fixed;left:0;top:0;width:60px;height:60px;z-index:2147483647';document.body.appendChild(d)});
/* ตัวกันซูมทำงานเมื่อแตะห่างกัน <300ms เท่านั้น → วัดช่วงจริง ถ้าเครื่องช้าจนห่างเกิน 250ms ให้ลองใหม่ (ไม่ใช่การรอแบบเดา) */
let zoom=null;for(let i=0;i<8&&!zoom;i++){await page.waitForTimeout(400);const n0=await page.evaluate(()=>__te.length);await page.touchscreen.tap(20,20);await page.touchscreen.tap(20,20);
 await page.waitForFunction(n=>__te.length>=n+2,n0);const [x,y]=await page.evaluate(n=>__te.slice(n,n+2),n0);if(y.t-x.t<250)zoom={gap:y.t-x.t,first:x.p,second:y.p}}
if(!zoom)fails.push('could not tap twice within 250ms');else if(zoom.second!==true)fails.push({doubleTapZoomGuard:zoom});
console.log(JSON.stringify(fails,null,2));assert.deepEqual(fails,[]);console.log('TAP GUARD BROWSER PASS');
}finally{await browser?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}})().catch(e=>{console.error(e);process.exitCode=1});
