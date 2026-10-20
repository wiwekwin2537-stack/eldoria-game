/* เส้นทางปุ่มสกิลจริง: กติกาแยกท่าป้องกัน/ฮีลเหมือนกันใน PvP และบอส */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,execFileSync}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{
 const root=path.join(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-skill-role-'));
 const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,DATA_DIR:dir,PORT:'8787',UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});let browser;
 try{
  await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j)});
  const opts={args:['--no-sandbox','--enable-unsafe-swiftshader']};if(process.env.ELD_CHROMIUM)opts.executablePath=process.env.ELD_CHROMIUM;if(process.env.ELD_CHROMIUM_ARGS)opts.args=JSON.parse(process.env.ELD_CHROMIUM_ARGS);
  browser=await chromium.launch(opts);const page=await browser.newPage({viewport:{width:915,height:412},isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!=='http://127.0.0.1:8787')return route.abort();if(process.env.ELD_ROLES_BASELINE&&u.pathname.startsWith('/js/'))return route.fulfill({contentType:'text/javascript',body:execFileSync('git',['show','HEAD:'+u.pathname.slice(1)],{cwd:root})});return route.continue()});
  await page.goto('http://127.0.0.1:8787/?server=ws://127.0.0.1:8787',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!window.FM_LOADING&&window.REG136&&window.NEWU73);
  await page.evaluate(()=>{titleEl.hidden=true;intro.hidden=true;dlgClose(true);D=null;PAUSED=true});
  const results=[];
  for(const mode of ['pvp','boss'])for(const name of ['shield','aura','heal','cleanse','bless','attack_shield','attack_cap','attack_low','attack_failed','heal_existing_shield','ult_paladin','ult_cleric','ult_sword']){
   await page.waitForTimeout(700);
   const r=await page.evaluate(({mode,name})=>{
    const cls=['shield','aura','ult_paladin'].includes(name)?'paladin':name==='ult_sword'?'sword':'cleric';
    P.cls=cls;P.lv=150;P.dead=false;P.stun=0;P.slowT=0;P.burnT=0;P.dash=0;P.cast=0;P.iframe=0;P.at=-1;P.draw=true;P.armor.sword=cls==='cleric'?'staff0':'sword0';syncSword();BAL.hp=20000;BAL.mp=200;P.hp=1000;P.mp=200;
    CS.cd=CS.cd.map(()=>0);CS.step=0;CSK[cls]=[1,1,1,1,1,1];SKBAR[cls]=[0,1,2,3,4,5];DOORA.k=0;FISH.st=0;
    Object.assign(B25,{shieldT:0,blessT:0,lastHp:null});Object.assign(B46,{buf:{},st:{},lastHp:null,skT:0,cast:null});Object.assign(PB52,{regU:0,drU:0,last:null});FX73.length=0;E46.length=0;PROJ.length=0;ZPROJ.length=0;INV73=0;ULT.cast=null;ULT.v=100;
    const boss={boss:1,aggro:1,hp:1e6,max:1e6,dead:false,x:P.x+100,y:P.y,st:'chase'};D=mode==='pvp'?{arena8:1,zone:{Zd:{id:'arena'}},mobs:[]}:{zone:{Zd:{id:'test'}},boss,mobs:[]};PVP8.on=false;
    const slot={shield:2,aura:4,heal:0,cleanse:3,bless:2,attack_shield:1,attack_cap:1,attack_low:1,attack_failed:1,heal_existing_shield:0}[name];if(['heal','attack_shield','attack_cap','attack_failed','heal_existing_shield'].includes(name))P.hp=BAL.hp*.99;
    if(name==='attack_cap'||name==='heal_existing_shield')B46.buf.shield46={t:10,v:3500};if(name==='attack_failed')P.mp=0;if(name==='cleanse'){P.slowT=2;P.burnT=2;}
    const hp=P.hp,mp=P.mp;PAUSED=false;
    if(name.startsWith('ult_'))castUlt();else for(const type of ['pointerdown','pointerup'])SBTN[slot].dispatchEvent(new PointerEvent(type,{pointerType:'touch',pointerId:1,bubbles:true,cancelable:true}));
    const r={mode,name,hp,after:P.hp,mpSpent:mp-P.mp,cd:slot==null?null:CS.cd[slot],iframe:P.iframe,inv:INV73>performance.now(),shield:B46.buf.shield46?.v||0,cast:!!ULT.cast};
    if(name.startsWith('ult_')&&name!=='ult_sword'){ultTick(1.2);playerTick(.6);r.firedHP=P.hp;r.firedIframe=P.iframe;r.firedInv=INV73>performance.now();}
    if(name==='shield'||name==='aura'||name==='bless'){
     skTick(.5);r.afterTick=P.hp;r.buff=name==='shield'?B25.shieldT:name==='aura'?B46.buf.aura?.t:B25.blessT;
     if(name!=='bless'){const before=P.hp;P.hp-=100;skTick(0);r.damageTaken=before-P.hp;}
    }
    if(name==='cleanse')r.cleansed=P.stun===0&&P.slowT===0&&P.burnT===0;
    PAUSED=true;D=null;PVP8.on=false;ULT.cast=null;return r;
   },{mode,name});
   results.push(r);console.log('ROLE',JSON.stringify(r));
   if(name==='attack_failed'){assert.equal(r.mpSpent,0);assert.equal(r.shield,0,'failed cast cannot grant shield');continue}
   if(name==='ult_sword'){assert.ok(r.cast);assert.ok(r.iframe>0&&r.inv,'other ultimate protection is retained');continue}
   if(name.startsWith('ult_')){assert.ok(r.cast,name+' started');assert.equal(r.iframe,0,name+' healing ultimate must not grant iframe');assert.equal(r.inv,false,name+' healing ultimate must not grant INV73');assert.ok(r.firedHP>r.hp,name+' actual ultimate still heals');assert.equal(r.firedIframe,0);assert.equal(r.firedInv,false);continue}
   assert.ok(r.mpSpent>0,name+' costs MP');if(!name.startsWith('attack_'))assert.ok(r.cd>0,name+' has cooldown');
   if(name==='shield'||name==='aura'){assert.equal(r.afterTick,r.hp,name+' must not heal');assert.ok(r.buff>0,name+' defense active');assert.ok(r.damageTaken>0&&r.damageTaken<100,name+' still reduces damage');}
   if(name==='heal'||name==='cleanse'){assert.ok(r.after>r.hp,name+' still heals');assert.equal(r.shield,0,name+' must not grant shield');assert.equal(r.iframe,0,name+' must not grant invulnerability');}
   if(name==='bless')assert.ok(r.afterTick>r.hp,'dedicated HoT retained');
   if(name==='heal_existing_shield'){assert.ok(r.after>r.hp);assert.equal(r.shield,3500,'healing preserves a shield from another skill without adding to it');}
   if(name==='attack_cap')assert.equal(r.shield,4000,'shield retains original 20% cap');
   if(name==='attack_low')assert.equal(r.shield,0,'low HP does not trigger defensive passive');
   if(name==='cleanse')assert.ok(r.cleansed,'cleanse is retained');
   if(name==='attack_shield'){assert.equal(r.after,r.hp,'offensive shield trigger does not heal');assert.equal(r.shield,2000,'Lv40 passive retains original shield size');}
  }
  assert.deepEqual(errors,[]);console.log('SKILL ROLES BROWSER PASS',results.length);
 }finally{await browser?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
