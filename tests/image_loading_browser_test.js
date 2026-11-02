/* Mobile first paint and real Service Worker cache with an unavailable origin. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{const root=path.join(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-images-'));let browser;
const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:'8803',DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
try{
 await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j)});
 browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:915,height:412},isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.setDefaultTimeout(120000);
 let release;const gate=new Promise(r=>release=r);
 await page.route('**/js/001-core.js*',async route=>{await gate;await route.continue()});
 await page.route('**/assets/ui/loading-v543.webp',async route=>{await gate;await route.continue()});
 const navigation=page.goto('http://127.0.0.1:8803/?devtest=1&server=ws://127.0.0.1:8803',{waitUntil:'domcontentloaded'});
 await page.locator('#boot106').waitFor({state:'visible'});
 const preview=await page.evaluate(()=>({background:getComputedStyle(document.getElementById('boot106')).backgroundImage,inline:getComputedStyle(document.documentElement).getPropertyValue('--loading-preview')}));
 assert.ok(preview.background.includes('data:image/webp')&&preview.inline.length>100,'preview exists before artwork and scripts arrive');
 if(process.env.ELD_IMAGE_SHOT)await page.screenshot({path:process.env.ELD_IMAGE_SHOT});
 release();await navigation;await page.waitForFunction(()=>window.SCENEART&&window.REG136);await page.waitForFunction(()=>!document.getElementById('boot106'));
 assert.equal(await page.evaluate(async()=>{const result=REG136.find(([name])=>name.includes('(v543)'));return result&&await result[1]()}),null);
 assert.equal(await page.evaluate(()=>SCENEART.pick({id:'ice'})),'ice');
 await page.evaluate(async()=>{await SCENEART.warm();await navigator.serviceWorker.register('sw.js');await navigator.serviceWorker.ready;await new Promise(resolve=>{if(navigator.serviceWorker.controller)return resolve();navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})});});
 assert.equal(await page.evaluate(()=>Object.keys(SCENEART.sources).every(key=>SCENEART.images[key]&&SCENEART.images[key].complete&&SCENEART.images[key].naturalWidth>0)),true,'all six scene images decode successfully');
 await page.unroute('**/assets/ui/loading-v543.webp');
 const result=await page.evaluate(async()=>{const url='assets/ui/loading-v543.webp';const r=await fetch(url);await r.arrayBuffer();const c=await caches.open('eldoria-images-v1');return {cached:!!(await c.match(new URL(url,location.href).href)),type:r.headers.get('content-type'),policy:r.headers.get('cache-control')}});
 assert.equal(result.cached,true);assert.equal(result.type,'image/webp');assert.ok(result.policy.includes('immutable'));
 const itemPaths=['assets/items/materials-v543-01.webp','assets/tools/axe0-v543.webp'];
 await page.evaluate(async paths=>{for(const path of paths){const r=await fetch(path);if(!r.ok)throw Error('missing item '+path);await r.arrayBuffer()}},itemPaths);
 await context.setOffline(true);
 const repeated=await page.evaluate(async()=>{const start=performance.now(),r=await fetch('assets/ui/loading-v543.webp');return {bytes:(await r.arrayBuffer()).byteLength,status:r.status,ms:performance.now()-start}});
 const offlineItems=await page.evaluate(async paths=>Promise.all(paths.map(async path=>{const r=await fetch(path);return {status:r.status,bytes:(await r.arrayBuffer()).byteLength}})),itemPaths);
 for(let i=0;i<itemPaths.length;i++){assert.equal(offlineItems[i].status,200);assert.equal(offlineItems[i].bytes,fs.statSync(path.join(root,itemPaths[i])).size)}
 assert.equal(repeated.status,200);assert.equal(repeated.bytes,fs.statSync(path.join(root,'assets/ui/loading-v543.webp')).size);assert.ok(repeated.ms<1000,'cached image must not wait for origin');
 await context.setOffline(false);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!window.FM_LOADING&&window.REG136&&window.SCENEART);await page.waitForFunction(()=>!document.getElementById('boot106'));assert.deepEqual(errors,[]);
 console.log('IMAGE LOADING BROWSER PASS',JSON.stringify({previewBeforeNetwork:true,...result,repeatOffline:repeated}));
}finally{await browser?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
