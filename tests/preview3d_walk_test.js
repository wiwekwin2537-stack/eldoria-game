/* Observable movement, collisions, input cancellation, real expanded-land travel. */
const assert=require('node:assert/strict'),{once}=require('node:events');
const {movementModule}=require('../tools/legacy-movement.cjs');
const {createPreviewServer}=require('../tools/serve-3d-preview.cjs');
const {chromium}=require('playwright');
(async()=>{
 const {createLegacyMotion}=await import('data:text/javascript;base64,'+Buffer.from(movementModule()).toString('base64'));
 const neutral=(x=320,y=320)=>({x,y,at:-1,fa:100,hu:100,stats:{agi:0},t:0,dir:'d',mv:false});
 const open=Array.from({length:100},()=>Array(100).fill(0));
 for(const [ix,iy,run,speed]of [[1,0,false,95],[1,1,false,95],[1,0,true,170]]){const p=neutral(),m=createLegacyMotion(p,open);for(let i=0;i<20;i++)m.step(ix,iy,.05,run);assert(Math.abs(Math.hypot(p.x-320,p.y-320)-speed)<1e-8,'neutral speed and normalized diagonal match legacy units')}
 const walls=open.map(r=>r.slice());for(const row of walls)row[15]=1;const p=neutral(),m=createLegacyMotion(p,walls);for(let i=0;i<100;i++)m.step(1,0,.05);assert(p.x+7<15*32,'cannot penetrate a solid wall');const before=p.y;for(let i=0;i<20;i++)m.step(0,1,.05);assert(p.y>before,'can move along the wall');const unchanged={...p};m.step(NaN,1,1);assert.deepEqual(p,unchanged,'invalid input cannot corrupt position');
 const server=createPreviewServer();server.listen(0,'127.0.0.1');await once(server,'listening');const origin=`http://127.0.0.1:${server.address().port}`;let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox','--enable-unsafe-swiftshader']});const ctx=await browser.newContext({viewport:{width:915,height:412},isMobile:true,hasTouch:true,serviceWorkers:'block'});const page=await ctx.newPage();const errors=[],api=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(new URL(r.url()).origin!==origin||/\/api\//.test(r.url())||r.method()!=='GET')api.push(r.url())});
  await page.goto(origin);await page.waitForFunction(()=>window.ELDORIA3D?.ready);await page.locator('[data-view="walk"]').click();assert.equal(await page.locator('#walkpad').isVisible(),true);
  const visibleObstacle=await page.evaluate(()=>{const ray=new THREE.Raycaster(new THREE.Vector3(-15.5,12,8.5),new THREE.Vector3(0,-1,0));return ray.intersectObjects(ELDORIA3D.scene.children,true).some(h=>h.point.y>.5)});assert(visibleObstacle,'legacy solid cells near spawn must have visible 3D obstacles, not invisible walls');
  const initial=await page.evaluate(()=>({...ELDORIA3D.walker.P}));await page.keyboard.down('s');await page.waitForFunction(y=>ELDORIA3D.walker.P.y>y+10,initial.y);await page.keyboard.up('s');
  const walk=await page.evaluate(()=>{const A=ELDORIA3D,p=A.walker.P,r=A.worldData.toRender(p);return{p:{x:p.x,y:p.y},render:{x:A.traveler.position.x,z:A.traveler.position.z},target:{x:A.view.target.x,z:A.view.target.z},expected:r}});assert.equal(walk.render.x,walk.expected.x);assert.equal(walk.render.z,walk.expected.z);assert.deepEqual(walk.target,walk.expected);
  await page.locator('#run').click();assert.equal(await page.locator('#run').getAttribute('aria-pressed'),'true');await page.locator('[data-view="town"]').click();assert.equal(await page.locator('#walkpad').isVisible(),false);assert.equal(await page.locator('#run').getAttribute('aria-pressed'),'false');
  await page.locator('[data-view="walk"]').click();const pad=await page.locator('#walkpad').boundingBox(),x=pad.x+pad.width/2,y=pad.y+pad.height/2,touch=await ctx.newCDPSession(page);
  const beforeJoy=await page.evaluate(()=>ELDORIA3D.walker.P.x);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+32,y}]});await page.waitForFunction(x=>ELDORIA3D.walker.P.x>x+5,beforeJoy);await touch.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  const stopped=await page.evaluate(()=>({...ELDORIA3D.walker.P}));await page.waitForTimeout(250);assert.deepEqual(await page.evaluate(()=>({x:ELDORIA3D.walker.P.x,y:ELDORIA3D.walker.P.y})),{x:stopped.x,y:stopped.y},'cancelled joystick must stop');
  /* Traverse an actual collision-checked path out of the old district into the ring. */
  const result=await page.evaluate(()=>{const A=ELDORIA3D,W=A.worldData,m=A.walker.motion,p=A.walker.P,sx=Math.floor(p.x/32),sy=Math.floor(p.y/32),q=[[sx,sy]],seen=new Map([[sy*W.width+sx,null]]);let goal=null;
   for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x<W.width/4-3){goal=[x,y];break}for(const [dx,dy]of [[-1,0],[0,1],[1,0],[0,-1]]){const nx=x+dx,ny=y+dy,id=ny*W.width+nx;if(nx<0||ny<0||nx>=W.width||ny>=W.height||seen.has(id)||m.hit(nx*32+16,ny*32+16))continue;seen.set(id,[x,y]);q.push([nx,ny])}}
   if(!goal)throw Error('No walking route into expanded land');const route=[];for(let a=goal;a;a=seen.get(a[1]*W.width+a[0]))route.unshift(a);
   for(const [x,y]of route){const tx=x*32+16,ty=y*32+16;for(let i=0;i<80;i++){const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);if(d<.2)break;m.step(dx,dy,Math.min(.05,d/95));if(m.hit(p.x,p.y))throw Error('Entered collision while following path')}}
   return{position:W.toRender(p),pathLength:route.length,outside:W.toRender(p).x<-W.width/4,blocked:m.hit(p.x,p.y),trees:W.trees.length};
  });assert(result.outside,'player must actually leave the old map bounds');assert.equal(result.blocked,false);
  await page.keyboard.down('d');await page.evaluate(()=>dispatchEvent(new Event('blur')));const blur=await page.evaluate(()=>({...ELDORIA3D.walker.P}));await page.waitForTimeout(200);await page.keyboard.up('d');assert.equal(await page.evaluate(()=>ELDORIA3D.walker.P.x),blur.x,'focus loss stops held movement');
  assert.deepEqual(errors,[]);assert.deepEqual(api,[]);assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);console.log('3D WALK PASS',JSON.stringify(result),'legacy speed, diagonal, wall slide, world travel, keyboard, joystick cancel, focus loss, camera follow, no save APIs');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
