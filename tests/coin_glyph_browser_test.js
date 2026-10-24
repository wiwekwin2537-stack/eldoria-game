/* v5.94/v5.98 เหรียญ 🪙 / ไอคอน 🥷 ขึ้นเป็นกล่อง □ บนคอมที่ไม่มีอีโมจิ (เจ้าของแจ้ง 2026-10-25 ราคาในร้าน □25) · บังคับโหมดเครื่องไม่มีอีโมจิด้วย ?coinglyph=0 แล้วเปิดร้านจริง */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{const port='8874',base='http://127.0.0.1:'+port,dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-coin-'));let b;const errors=[];const server=spawn(process.execPath,['server.js'],{cwd:path.join(__dirname,'..'),env:{...process.env,PORT:port,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
try{await new Promise(r=>server.stdout.once('data',r));for(let i=0;i<60;i++){try{await fetch(base+'/');break}catch(e){await new Promise(r=>setTimeout(r,500))}}
b=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader']});const pg=await b.newPage({viewport:{width:915,height:500}});pg.on('pageerror',e=>errors.push(e.message));await pg.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
await pg.goto(base+'/?devtest=1&coinglyph=0&server=ws://127.0.0.1:'+port,{waitUntil:'domcontentloaded'});await pg.waitForFunction(()=>!window.FM_LOADING&&window.COIN594&&typeof openShop==='function',null,{timeout:180000});
const r=await pg.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const id=Object.keys(SHOP_DATA)[0];try{openShop(id)}catch(e){return{err:String(e)}}await sl(300);
 const vis=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(n.nodeValue.includes('\u{1FA99}')&&!['SCRIPT','STYLE'].includes(n.parentNode.nodeName))vis.push(n.parentNode.nodeName+':'+n.nodeValue.slice(0,20));
 const d=document.createElement('div');document.body.appendChild(d);d.innerHTML='<b>ราคา \u{1FA99}150</b>';await sl(50);const live=!d.textContent.includes('\u{1FA99}')&&!!d.querySelector('.coin594');d.remove();
 return{ok:COIN594.ok,swapped:COIN594.swapped,vis:vis.slice(0,5),live,shop:document.querySelectorAll('.coin594').length,hud:!!gid('coinbox').querySelector('.coin594')}});
console.log(JSON.stringify(r));assert.equal(r.ok,false,'ต้องอยู่ในโหมดเครื่องไม่มีอีโมจิ');assert.deepEqual(r.vis,[],'ยังมี 🪙 ที่จะขึ้นเป็นกล่อง');assert.ok(r.live,'ข้อความใหม่ที่สร้างทีหลังไม่ถูกแทน');assert.ok(r.hud,'เหรียญที่หัวจอไม่ถูกแทน');assert.ok(r.shop>3,'ราคาในร้านไม่มีเหรียญ');
/* v5.98: ไอคอนนินจา 🥷 ในหน้าอาชีพ + ตัวหนังสือบนแคนวาส (ป้ายเหนือหัวมอน) */
const r2=await pg.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));try{closeShop()}catch(e){}try{openClassMenu()}catch(e){return{err:String(e)}}await sl(300);
 const vis=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(/\u{1F977}|\u{1FA99}|\u{1FABD}|\u{1FAB5}|\u{1FA93}/u.test(n.nodeValue)&&!['SCRIPT','STYLE'].includes(n.parentNode.nodeName))vis.push(n.nodeValue.slice(0,30));
 const c=document.createElement('canvas');c.width=120;c.height=40;const k=c.getContext('2d');const raw=[];const F=CanvasRenderingContext2D.prototype.fillText;
 k.font='bold 16px system-ui';k.textAlign='center';k.textBaseline='middle';k.fillStyle='#fff';
 const orig=Object.getPrototypeOf(k);let passed=[];const wrap=orig.fillText;
 k.fillText('\u{1FA99}+25 \u{1F977}',60,20);const d=k.getImageData(0,0,120,40).data;let gold=0;for(let i=0;i<d.length;i+=4)if(d[i]>200&&d[i+1]>150&&d[i+2]<90&&d[i+3]>200)gold++;
 const mw=k.measureText('\u{1FA99}').width===k.measureText(' ').width;
 return{vis:vis.slice(0,5),gold,mw,bad:Object.keys(COIN594.bad).length}});
console.log('class+canvas',JSON.stringify(r2));assert.deepEqual(r2.vis,[],'อีโมจิใหม่ยังอยู่ในหน้าอาชีพ (จะขึ้นกล่อง)');assert.ok(r2.gold>15,'เหรียญบนแคนวาสไม่ถูกวาดเป็นเหรียญทอง');assert.ok(r2.mw,'ความกว้างตัวหนังสือบนแคนวาสไม่ตรงกับที่วาด');assert.ok(r2.bad>10,'ไม่ได้แทนอีโมจิใหม่ตัวอื่น');
await pg.goto(base+'/?devtest=1&coinglyph=1&server=ws://127.0.0.1:'+port,{waitUntil:'domcontentloaded'});await pg.waitForFunction(()=>!window.FM_LOADING&&window.COIN594,null,{timeout:180000});
const s=await pg.evaluate(()=>({ok:COIN594.ok,n:document.querySelectorAll('.coin594').length}));assert.deepEqual(s,{ok:true,n:0},'เครื่องที่วาด 🪙 ได้ต้องไม่ถูกเปลี่ยน');
assert.deepEqual(errors,[]);console.log('PASS เหรียญไม่ขึ้นเป็นกล่อง (ร้าน + หัวจอ + ข้อความใหม่)');
}finally{await b?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}})().catch(e=>{console.error(e);process.exit(1)});
