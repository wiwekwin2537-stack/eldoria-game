/* Legacy targeting parity and visible, reachable mesh resource feedback. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{once}=require('node:events');
const {movementModule}=require('../tools/legacy-movement.cjs'),{createPreviewServer}=require('../tools/serve-3d-preview.cjs'),{chromium}=require('playwright');
(async()=>{
 const {createLegacyTargeting}=await import('data:text/javascript;base64,'+Buffer.from(movementModule()).toString('base64'));
 const world={width:12,height:12,trees:[{x:.5,z:.5}],ores:[{x:2.5,z:.5,kind:'iron'}],obstacles:[{id:'tree-0',x:.5,z:.5,w:1,d:1},{id:'ore-0',x:2.5,z:.5,w:1,d:1}]};
 const P={x:0,y:0,dir:'d'},api=createLegacyTargeting(P,world);
 /* Compare original source execution for cardinal directions and exact tile boundaries. */
 const core=fs.readFileSync('js/014-core.js','utf8'),a=core.indexOf('const DIRV='),b=core.indexOf('\n',core.indexOf('const target=',a));const ctx={P,T:32};vm.createContext(ctx);vm.runInContext(core.slice(a,b)+';globalThis.originalTarget=target;',ctx);
 for(const dir of ['u','d','l','r'])for(const x of [0,191.99,192,208,224])for(const y of [0,192,208,223.99]){Object.assign(P,{x,y,dir});assert.deepEqual(api.target(),Array.from(ctx.originalTarget()))}
 Object.assign(P,{x:192-8,y:208,dir:'r'});assert.equal(api.pickTarget()?.kind,'tree');P.dir='l';assert.equal(api.pickTarget(),null,'turning away loses adjacent target');
 Object.assign(P,{x:256-8,y:208,dir:'r'});assert.equal(api.pickTarget()?.o.kind,'iron');Object.assign(P,{x:208,y:208,dir:'u'});assert.equal(api.pickTarget()?.kind,'tree','original current-tile fallback retained');
 const server=createPreviewServer();server.listen(0,'127.0.0.1');await once(server,'listening');let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox','--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>window.ELDORIA3D?.ready);await page.locator('[data-view="walk"]').click();
  const found=await page.evaluate(()=>{const A=ELDORIA3D,p=A.walker.P,W=A.worldData;const hits={};
   for(const kind of ['tree','ore']){let candidate=null;for(let y=1;y<W.height-1&&!candidate;y++)for(let x=1;x<W.width-1&&!candidate;x++){if(A.walker.motion.hit(x*32+16,y*32+16))continue;for(const dir of ['u','d','l','r']){Object.assign(p,{x:x*32+16,y:y*32+16,dir});const t=A.targeting.pickTarget();if(t?.o&&t.kind===kind){candidate={x:p.x,y:p.y,dir,id:t.o.id};break}}}hits[kind]=candidate}if(hits.tree)Object.assign(p,hits.tree);return hits});assert(found.tree,'tree reachable from collision-free position');assert(found.ore,'ore reachable from collision-free position');
  await page.waitForFunction(()=>ELDORIA3D.targetMarker.visible);assert.match(await page.locator('#target-info').innerText(),/ต้นไม้/);let marker=await page.evaluate(()=>{const A=ELDORIA3D,t=A.targeting.pickTarget();return{actual:[A.targetMarker.position.x,A.targetMarker.position.z],expected:[t.o.x,t.o.z]}});assert.deepEqual(marker.actual,marker.expected);
  await page.evaluate(p=>Object.assign(ELDORIA3D.walker.P,p),found.ore);await page.waitForFunction(()=>document.getElementById('target-info').textContent.includes('ที่ขุดแร่'));
  await page.locator('[data-view="town"]').click();assert(await page.locator('#target-info').isHidden());assert.equal(await page.evaluate(()=>ELDORIA3D.targetMarker.visible),false);
  assert.deepEqual(errors,[]);assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);console.log('3D TARGET PASS: original cardinal/boundary parity, fallback, reachable tree/ore, marker coordinates, mobile UI, no save');
 }finally{await browser?.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
