/* v5.92 รีเซ็ตไอดีทั้งหมด: เซฟสำรองเก่าในเบราว์เซอร์ถูกล้าง 1 ครั้ง (กันไอดีเก่าอัปกลับขึ้นเซิร์ฟเวอร์ใหม่) · เปิดครั้งถัดไปไม่ล้างซ้ำ · เซิร์ฟเวอร์ใช้ที่เก็บ eld4: */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.join(__dirname,'..');for(const f of ['accounts.js','world.js','pvp.js','market.js']){const s=fs.readFileSync(path.join(root,f),'utf8');assert.ok(!/eld3:/.test(s),f+' ยังใช้ที่เก็บเก่า eld3:');assert.ok(/eld4:/.test(s),f+' ไม่ได้ใช้ eld4:')}
(async()=>{const port='8873',base='http://127.0.0.1:'+port,dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-reset-'));let b;const errors=[];const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:port,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
try{await new Promise(r=>server.stdout.once('data',r));for(let i=0;i<60;i++){try{await fetch(base+'/');break}catch(e){await new Promise(r=>setTimeout(r,500))}}
b=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader']});const ctx=await b.newContext();const pg=await ctx.newPage();pg.on('pageerror',e=>errors.push(e.message));await pg.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
await pg.goto(base+'/manifest.webmanifest');await pg.evaluate(()=>{localStorage.clear();localStorage.setItem('u:oldhero:fm_save_v1',JSON.stringify({v:1,lv:120}));localStorage.setItem('fm_accts','{"oldhero":{}}')});
await pg.goto(base+'/?epochtest=1',{waitUntil:'domcontentloaded'});await pg.waitForFunction(()=>window.FM_RAW!==undefined,null,{timeout:120000});
const a=await pg.evaluate(()=>({wiped:window.ELD_EPOCH_WIPED,old:FM_RAW.get?FM_RAW.get('u:oldhero:fm_save_v1'):null,ep:FM_RAW.get?FM_RAW.get('eldoria_data_epoch'):null}));console.log(JSON.stringify(a));
assert.equal(a.wiped,'eld4','ไม่ได้ล้างเซฟสำรองเก่า');assert.ok(!a.old,'เซฟเก่ายังอยู่ในเครื่อง');
await pg.evaluate(()=>{try{FM_RAW.set('u:newhero:fm_save_v1','{"v":1,"lv":3}')}catch(e){localStorage.setItem('u:newhero:fm_save_v1','{"v":1,"lv":3}')}});
await pg.goto(base+'/?epochtest=1',{waitUntil:'domcontentloaded'});await pg.waitForFunction(()=>window.FM_RAW!==undefined,null,{timeout:120000});
const c=await pg.evaluate(()=>({wiped:window.ELD_EPOCH_WIPED||null,kept:FM_RAW.get('eldoria_data_epoch')}));console.log(JSON.stringify(c));
assert.equal(c.wiped,null,'ล้างซ้ำทุกครั้งที่เปิด');assert.equal(c.kept,'eld4','เครื่องหมายรีเซ็ตหาย → จะล้างซ้ำ');assert.deepEqual(errors,[]);console.log('PASS รีเซ็ตไอดี eld4: ล้างเซฟสำรองเก่า 1 ครั้ง');
}finally{await b?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}})().catch(e=>{console.error(e);process.exit(1)});
