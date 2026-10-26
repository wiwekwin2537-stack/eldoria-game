/* Verify the standalone 3D presentation without running or signing into the game. */
const assert=require('node:assert/strict'),{once}=require('node:events');
const {createPreviewServer}=require('../tools/serve-3d-preview.cjs');
const {chromium}=require('playwright');
(async()=>{
 const server=createPreviewServer();server.listen(0,'127.0.0.1');await once(server,'listening');const origin=`http://127.0.0.1:${server.address().port}`;let browser;
 try{
  const data=await(await fetch(origin+'/scene.json')).json();assert.equal(data.base.width,44);assert.equal(data.base.height,34);assert.equal(data.base.shops.gear.b[0],3);
  for(const endpoint of ['/api/save','/api/load','/server.js','/accounts.js','/sw.js','/../accounts.js','/%2e%2e/server.js','/models.js/../server.js'])assert.equal((await fetch(origin+endpoint)).status,404,endpoint+' must not expose game APIs/source');
  for(const method of ['POST','PUT','DELETE'])assert.equal((await fetch(origin+'/scene.json',{method})).status,405);
  const head=await fetch(origin+'/app.js',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');assert.equal(head.headers.get('cache-control'),'no-store');
  browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const errors=[],unexpected=[],ctx=await browser.newContext({viewport:{width:915,height:412},hasTouch:true,isMobile:true,serviceWorkers:'block'});
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{const u=new URL(r.url());if(u.origin!==origin||r.method()!=='GET')unexpected.push(r.method()+' '+r.url())});
  await page.addInitScript(()=>localStorage.setItem('eldoria-2d-sentinel','untouched'));
  await page.goto(origin);await page.waitForFunction(()=>window.ELDORIA3D?.ready);
  const snapshot=await page.evaluate(()=>{const A=ELDORIA3D;let n=0,sprite=0,invalid=0;A.scene.traverse(o=>{if(o.isSprite)sprite++;if(o.isMesh){n++;const a=o.geometry.getAttribute('position');for(let i=0;i<a.count;i++)if(!Number.isFinite(a.getX(i)+a.getY(i)+a.getZ(i)))invalid++}});return{dimensions:A.dimensions,mode:A.mode,gameplay:A.gameplayConnected,meshes:n,sprite,invalid,triangles:A.renderer.info.render.triangles,drawCalls:A.renderer.info.render.calls,source:A.source.kind}});
  assert.deepEqual(snapshot.dimensions,{width:88,height:68,areaRatio:4});assert.equal(snapshot.mode,'movement-prototype');assert.equal(snapshot.gameplay,false);assert(snapshot.meshes>20);assert.equal(snapshot.sprite,0);assert.equal(snapshot.invalid,0);assert(snapshot.triangles>1000);assert(snapshot.drawCalls<250,'static scene must be batched');assert.equal(snapshot.source,'baseline-regression-fixture');
  for(const name of ['forest','models','town']){await page.locator(`[data-view="${name}"]`).click();assert.equal(await page.evaluate(()=>ELDORIA3D.view.name),name);assert.equal(await page.locator(`[data-view="${name}"]`).getAttribute('aria-pressed'),'true')}
  const before=await page.evaluate(()=>ELDORIA3D.view.angle);await page.mouse.move(420,190);await page.mouse.down();await page.mouse.move(530,190);await page.mouse.up();assert.notEqual(await page.evaluate(()=>ELDORIA3D.view.angle),before);
  await page.locator('#plus').click();const span=await page.evaluate(()=>ELDORIA3D.view.span);assert(span<36);await page.locator('#reset').click();assert.equal(await page.evaluate(()=>ELDORIA3D.view.span),36);
  await page.locator('#bounds').click();assert.match(await page.locator('#hint').textContent(),/88 × 68/);assert.equal(await page.locator('#bounds').getAttribute('aria-pressed'),'true');
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.locator('[data-view="models"]').tap();assert.equal(await page.evaluate(()=>ELDORIA3D.view.name),'models');
  const touch=await ctx.newCDPSession(page),touchAngle=await page.evaluate(()=>ELDORIA3D.view.angle);
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:160,y:300}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:230,y:300}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  assert.notEqual(await page.evaluate(()=>ELDORIA3D.view.angle),touchAngle);
  const cancelledAngle=await page.evaluate(()=>ELDORIA3D.view.angle);
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:170,y:320}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:240,y:320}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.notEqual(await page.evaluate(()=>ELDORIA3D.view.angle),cancelledAngle);
  assert.equal(await page.evaluate(()=>localStorage.getItem('eldoria-2d-sentinel')),'untouched');assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['eldoria-2d-sentinel']);assert.deepEqual(errors,[]);assert.deepEqual(unexpected,[]);
  const broken=await ctx.newPage();await broken.route('**/scene.json',r=>r.fulfill({status:503,body:'unavailable'}));await broken.goto(origin);await broken.waitForFunction(()=>!document.getElementById('error').hidden);assert.match(await broken.locator('#error').textContent(),/โหลดข้อมูลฉาก/);
  console.log('3D PREVIEW PASS',JSON.stringify(snapshot),'HTTP isolation, real WebGL, controls, mobile viewport, failure UI, unchanged storage');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
