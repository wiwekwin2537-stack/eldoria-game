/* เส้นทางจริง: เปิด PvP → กดฮีล/เดินเวลา, ต่อสู้บอส → ถอนตัว/ชนะ → ฮีลกลับได้ */
const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const {spawn, execFileSync} = require('node:child_process');
const {chromium} = require('playwright');
(async()=>{
 const root=path.join(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-combat-heal-'));
 const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,DATA_DIR:dir,PORT:'8787',UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});let browser;
 try{
  await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j)});
  const opts={args:['--no-sandbox','--enable-unsafe-swiftshader']};if(process.env.ELD_CHROMIUM)opts.executablePath=process.env.ELD_CHROMIUM;if(process.env.ELD_CHROMIUM_ARGS)opts.args=JSON.parse(process.env.ELD_CHROMIUM_ARGS);
  browser=await chromium.launch(opts);const page=await browser.newPage({viewport:{width:915,height:412},isMobile:true,hasTouch:true});const errors=[];page.on('console',m=>{if(m.text().startsWith('CLASS CAST'))console.log(m.text())});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin!=='http://127.0.0.1:8787')return route.abort();if(process.env.ELD_COMBAT_BASELINE_DIR&&url.pathname.startsWith('/js/')&&fs.existsSync(path.join(process.env.ELD_COMBAT_BASELINE_DIR,url.pathname.slice(1))))return route.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(process.env.ELD_COMBAT_BASELINE_DIR,url.pathname.slice(1)))});if(process.env.ELD_COMBAT_BASELINE&&url.pathname.startsWith('/js/'))return route.fulfill({contentType:'text/javascript',body:execFileSync('git',['show','HEAD:'+url.pathname.slice(1)],{cwd:root})});return route.continue()});
  await page.goto('http://127.0.0.1:8787/?server=ws://127.0.0.1:8787',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.REG136&&window.NEWU73);
  await page.evaluate(()=>{titleEl.hidden=true;intro.hidden=true;dlgClose(true);D=null;P.dead=false;P.cls='paladin';P.lv=150;P.hp=1000;BAL.hp=20000;PAUSED=false;PVP8.tog=-1e9;togglePvp8()});
  /* วัด skTick จริง: มี regen อาชีพ แม้ผู้เล่นไม่ได้โดนตีเมื่อเร็ว ๆ นี้ */
  const pvp=await page.evaluate(()=>{const hp=P.hp;skTick(.5);return {hp,after:P.hp,on:pvpOn8()}});
  assert.equal(pvp.on,true);assert.equal(pvp.after,pvp.hp,'PvP must suppress paladin innate regeneration');
  /* กดฮีลใน PvP ต้องฟื้นจริง ใช้มานา และกดซ้ำทันทีไม่ได้เพราะคูลดาวน์ */
  const heal=await page.evaluate(()=>{SK.own[2]=1;P.mp=100;const hp=P.hp,mp=P.mp;gid('sk4').onpointerdown({preventDefault(){}});return{hp,after:P.hp,mp,mpAfter:P.mp}});
  assert.ok(heal.after>heal.hp,'manual healing must work in PvP');assert.equal(heal.mpAfter,heal.mp-15,'manual healing costs MP');
  const second=await page.evaluate(()=>{const hp=P.hp,mp=P.mp;gid('sk4').onpointerdown({preventDefault(){}});return {hp,mp,after:P.hp,mpAfter:P.mp}});assert.equal(second.after,second.hp);assert.equal(second.mpAfter,second.mp,'cooldown prevents a second heal');
  const cases=await page.evaluate(async()=>{
   const results={};const check=(n,run,allow=false)=>{P.hp=1000;const hp=P.hp;run();results[n]=allow?P.hp>hp:P.hp===hp};
   /* ปิด PvP แล้วใช้บอสในฉากปัจจุบัน ไม่อิงตัวจับเวลาบอสโลกทั่วเซิร์ฟเวอร์ */
   B25.lastHp=null;B46.lastHp=null;PB52.last=null;PB52.regU=0;PB52.drU=0;B25.shieldT=0;B25.blessT=0;
   PVP8.on=false;const boss={boss:1,aggro:1,hp:20000,max:20000,dead:false,x:P.x+100,y:P.y,st:'chase'};D={zone:{},boss,mobs:[boss]};
   check('boss_regen',()=>{skTick(.5)});check('boss_heal25',()=>heal25(.3),true);check('boss_healSk',()=>healSk(),true);
   /* บัฟจากสกิลที่กดใช้ยังฟื้น HP/MP และมีระยะเวลาตามเดิม */
   B25.shieldT=6;B25.blessT=8;P.mp=10;BAL.mp=100;check('boss_hot',()=>skTick(.5),true);results.mana_kept=P.mp>10;results.duration_kept=B25.blessT<8;
   B25.shieldT=0;B25.blessT=0;B25.lastHp=null;B46.lastHp=null;
   /* กลับออกจากระยะต่อสู้/บอสตาย/อยู่ในเมือง ต้องฟื้นได้อีก */
   boss.aggro=0;check('disengage',()=>heal25(.3),true);boss.aggro=1;boss.dead=true;check('boss_dead',()=>heal25(.3),true);
   D={town:1,mobs:[],boss:null};WB10.on=true;check('town_global_boss',()=>healSk(),true);
   D=null;P.cls='none';check('normal_regen',()=>{P.sinceHit=99;playerTick(.5)},true);
   /* อัลติยังทำหน้าที่ฮีลได้ใน PvP */
   PVP8.on=true;P.cls='cleric';check('cleric_ult',()=>NEWU73.cleric(),true);
   /* ลดดาเมจยังคืนส่วนที่ลดได้ และยาตอนสู้บอสคงเดิม */
   PVP8.on=false;boss.dead=false;boss.aggro=1;D={zone:{},boss,mobs:[boss]};P.cls='paladin';B25.lastHp=1100;P.hp=1000;skTick(.1);results.dr_kept=P.hp>1000;
   B25.lastHp=null;B46.lastHp=null;inv.hpp=2;P.hp=1000;drink('hpp');results.boss_potion=P.hp>1000;
   /* ยิง sniper จากนอกระยะไล่: AI เลิกไล่แล้ว แต่เพิ่งโดนยิงยังฮีลไม่ได้ */
   const far=mkMob('golem','ทดสอบระยะไกล',['#777','#555','#fff'],100,P.x+650,P.y,{boss:1});far.hp=far.max=1e8;far.F=Object.assign({},far.F,{spd:0});far.stt=99;far.aggro=1;D={zone:{Zd:{id:'test',lv:[100,100]}},boss:far,mobs:[far]};P.cls='sniper';P.at=-1;const h0=far.hp;hurtE(far,.1,{kb:0});results.far_damage=far.hp<h0;updMob(far,.01);results.far_ai_disengaged=!far.aggro;results.far_no_passive=passiveRegenBlocked();check('far_manual_heal',()=>heal25(.3),true);
   /* กระสุนบอสที่มาถึงหลังบอสเลิกไล่ ต้องเริ่มช่วงห้ามฮีลใหม่ */
   const shotBoss=Object.assign({},far,{aggro:0});D={zone:{Zd:{id:'test',lv:[100,100]}},boss:shotBoss,mobs:[shotBoss]};P.iframe=0;P.hp=1000;abyssShot(shotBoss,0,100,30,'#f00',5);const shot=ZPROJ[ZPROJ.length-1];zHurt(shot,30,0,'ทดสอบกระสุนบอส');const shotHp=P.hp;results.boss_projectile_damage=shotHp<1000;results.boss_projectile_no_passive=passiveRegenBlocked();heal25(.3);results.boss_projectile_heal=P.hp>shotHp;
   /* เริ่มดวล/สนามแม้ไม่เปิด flag PvP ในทุ่งก็ห้ามฮีล */
   D={arena8:1,duel29:1,mobs:[]};PVP8.on=false;results.duel_no_passive=passiveRegenBlocked();check('duel_manual_heal',()=>healSk(),true);
   /* ทดสอบสกิลประจำอาชีพจริง ทั้งสองโหมด: ฮีลได้ จ่ายมานา และติดคูลดาวน์ */
   for(const mode of ['pvp','boss'])for(const cls of ['paladin','cleric']){
    /* เคารพจังหวะร่ายรวม 640ms ของเกม แยกแต่ละเคสออกจากกัน */
    D=null;PVP8.on=false;PAUSED=true;await new Promise(r=>setTimeout(r,700));
    D=mode==='pvp'?{arena8:1,zone:{Zd:{id:'arena'}},mobs:[]}:{zone:{Zd:{id:'test'}},boss,mobs:[boss]};boss.dead=false;boss.aggro=1;PVP8.on=false;
    P.cls=cls;P.lv=150;P.hp=1000;P.mp=100;P.stun=0;P.dash=0;P.cast=0;P.dead=false;PAUSED=false;DOORA.k=0;FISH.st=0;P.armor.sword=cls==='cleric'?'staff0':'sword0';syncSword();CS.cd=CS.cd.map(()=>0);CS.step=0;B25.lastHp=null;B46.lastHp=null;
    const hp=P.hp,mp=P.mp;PSTATE.lastError=null;useSkill(0);console.log('CLASS CAST',JSON.stringify({mode,cls,kind:wKind(),mp:P.mp,hp:P.hp,cd:CS.cd[0],message:gid('msg').textContent,error:PSTATE.lastError}));results[mode+'_'+cls+'_heal']=P.hp>hp;results[mode+'_'+cls+'_mana']=P.mp<mp;results[mode+'_'+cls+'_cooldown']=CS.cd[0]>0;
   }
   D=null;PVP8.on=false;PAUSED=true;return results;
  });
  console.log('CASES',JSON.stringify(cases));
  for(const [name,pass]of Object.entries(cases))assert.equal(pass,true,name);
  assert.deepEqual(errors,[]);
  console.log('COMBAT HEALING PASS',JSON.stringify(cases));
 }finally{await browser?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
