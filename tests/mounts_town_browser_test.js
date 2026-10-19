/* v5.38 real browser: every owned mount renders/moves in four directions; town layout and doors remain intact. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{const root=path.join(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-mount-town-')),port='8795';let browser;
 const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:port,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
 try{await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j)});
 browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox','--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:1000,height:660}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 await page.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:'+port?r.continue():r.abort());
 await page.goto('http://127.0.0.1:'+port+'/?server=ws://127.0.0.1:'+port+'&devtest=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.REG136&&window.MOUNTART&&TOWNART.settled&&TOWNFLOOR.state==='ready');
 const result=await page.evaluate(async()=>{await Promise.all(MOUNTART.keys.map(k=>MOUNTART.load(k).ready));return {keys:Object.keys(MOUNTS),loaded:Object.fromEntries(MOUNTART.keys.map(k=>[k,{state:MOUNTART.sheets[k].state,rows:MOUNTART.sheets[k].rows}]))}});
 assert.deepEqual(result.keys.sort(),Object.keys(result.loaded).sort());for(const [key,s]of Object.entries(result.loaded)){assert.equal(s.state,'ready',key);assert.equal(s.rows.length,3);for(const row of s.rows)assert.ok(row.w>0&&row.h>0)}
 await page.evaluate(()=>{titleEl.hidden=true;intro.hidden=true;dlgClose(true);CINE.L=null;cineEl.hidden=true;TUT.on=false;gid('tut').hidden=true;P.dead=false;P.stun=0;P.at=-1;PAUSED=false;buildTown();placeAtSpawn()});
 const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/town_layout_v536.json'),'utf8'));
 assert.deepEqual(await page.evaluate(()=>dm),fixture.dm,'painted floor and enlarged roofs never alter collision');
 assert.deepEqual(await page.evaluate(()=>D.doors),fixture.doors,'all town entrances unchanged');
 const sizes=await page.evaluate(()=>({scale:TOWNART.buildingScale,floor:TOWNFLOOR.state,door:doorGeom('store')}));assert.ok(sizes.scale>=1.4);assert.ok(sizes.door.bot>sizes.door.top);
 for(const key of result.keys){await page.evaluate(key=>{HOME.mount=key;P.x=22*T;P.y=18*T;P.lv=100;MOUNT.on=true;PAUSED=false;P.stun=0;},key);
  for(const [direction,button]of [['u','ArrowUp'],['d','ArrowDown'],['l','ArrowLeft'],['r','ArrowRight']]){const before=await page.evaluate(()=>({x:P.x,y:P.y}));await page.keyboard.down(button);await page.waitForFunction(({direction,before})=>P.dir===direction&&Math.hypot(P.x-before.x,P.y-before.y)>0,{direction,before});await page.keyboard.up(button);const after=await page.evaluate(()=>({x:P.x,y:P.y,dir:P.dir,on:MOUNT.on}));assert.equal(after.dir,direction,key);assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>0,key+' moves '+direction);assert.equal(after.on,true)}
 }
 const captures=await page.evaluate(()=>{const sv={x:P.x,y:P.y,dir:P.dir,mv:P.mv,mount:HOME.mount,on:MOUNT.on,ctx},out=document.createElement('canvas');out.width=1000;out.height=MOUNTART.keys.length*155;const q=out.getContext('2d');q.fillStyle='#21382f';q.fillRect(0,0,out.width,out.height);ctx=q;
  try{MOUNT.on=true;P.mv=true;P.draw=false;for(let i=0;i<MOUNTART.keys.length;i++){const key=MOUNTART.keys[i];HOME.mount=key;q.fillStyle='#f3e4bd';q.font='16px sans-serif';q.fillText(MOUNTS[key].n,12,i*155+24);for(let d=0;d<4;d++){P.dir=['r','l','u','d'][d];P.x=170+d*220;P.y=i*155+128;hero()}}return out.toDataURL('image/png')}
  finally{ctx=sv.ctx;P.x=sv.x;P.y=sv.y;P.dir=sv.dir;P.mv=sv.mv;HOME.mount=sv.mount;MOUNT.on=sv.on}
 });fs.writeFileSync(path.join(root,'..','mounts-v538-contact.png'),Buffer.from(captures.split(',')[1],'base64'));
 const town=await page.evaluate(()=>dcv.toDataURL('image/png'));fs.writeFileSync(path.join(root,'..','town-v538.png'),Buffer.from(town.split(',')[1],'base64'));
 await page.route('**/assets/mounts/horse.png*',r=>r.abort());
 const fallback=await page.evaluate(async()=>{delete MOUNTART.sheets.horse;const before=JSON.stringify({speed:MOUNTS.horse.spd,home:HOME.mount,mounts:HOME.mounts});MOUNTART.version='forced-failure';const s=MOUNTART.load('horse');MOUNTART.version='5.38';const pending=MOUNTART.paint('horse',P.x,P.y,'r',1,0);await s.ready;drawSteed('horse',P.x,P.y,1,1);drawSteedUD7('horse',P.x,P.y,'d',1,0);drawSteedUD7('horse',P.x,P.y,'d',1,1);return {pending,state:s.state,same:before===JSON.stringify({speed:MOUNTS.horse.spd,home:HOME.mount,mounts:HOME.mounts})}});
 assert.equal(fallback.pending,false);assert.equal(fallback.state,'failed');assert.equal(fallback.same,true,'asset failure never changes ownership or speed');
 assert.deepEqual(errors,[]);console.log('MOUNTS TOWN PASS',result.keys.length,'mounts x 4 directions, collision/doors, scale, new floor and failed-image fallback');
 }finally{await browser?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
