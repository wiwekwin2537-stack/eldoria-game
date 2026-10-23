/* Phase 2 player path: play -> save -> log out with the real UI -> log in on a clean device -> items/level/coins/place.
   Adds to save_logout (failed-save guard) and login_resume (pre-seeded save): here every value is EARNED in play
   (kill slimes with J, walk over drops, level up, warp scroll used, walk out to the field) and logout uses the
   profile menu "🚪 ออกเกม -> บันทึกและออก" then the title "ออกจากระบบ" button.
   Position: the save has no zone/position fields (saveGame js/031-core.js:1877), so login always starts at the town
   spawn. The test pins that current behaviour; whether players should resume in the field is an owner decision.
   Run: ELD_CHROMIUM=... PORT=8843 node tests/relog_progress_browser_test.js */
const assert=require('node:assert/strict'),H=require('./player_path_helpers');
(async()=>{const srv=await H.startServer('relog');let browser;const errors=[],id='relog'+(Date.now()%1e5),pw='Test1234';
const post=async(p,d)=>(await fetch(H.BASE+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d)})).json();
try{/* account that already finished the opening + tutorial (covered by new_player_path_browser_test) */
 const reg=await post('/api/register',{id,pw,protocol:2,name:'นักเดินทาง'});assert.equal(reg.ok,true);
 const main={v:1,t:0,name:'นักเดินทาง',lv:1,xp:0,sp:0,stats:{str:1,vit:1,int:1,agi:1,end:1},hp:100,mp:50,fa:100,hu:100,armor:{sword:'sword0',helm:null,chest:null,pants:null,arm:null,neck:null,ring:null},tier:{sword:0,axe:0,pick:0},tool:'sword',draw:false,bagLv:0,inv:{coin:50,hpp:3,scroll:2},gear:{axe0:1,pick0:1},enh:{},sk:[],qs:['weapon','axe0','pick0',null],day:0,buffs:[]};
 assert.equal((await post('/api/save',{id,token:reg.token,protocol:2,base:0,seq:1,lv:1,save:JSON.stringify({fm_save_v1:JSON.stringify(main),fm_name:main.name,fm_cc41:'1',fm_story:JSON.stringify({intro:1,tut:99,ch:1,st:'active',k:{slime:0},base:{slime:0},cs:{s1:1}})})})).ok,true);
 browser=await H.launch();
 const login=async p=>{await p.goto(H.GAME_URL);await H.ready(p);await p.locator('#tpan button',{hasText:'เข้าสู่ระบบ'}).click();await p.locator('#lId').fill(id);await p.locator('#lPw').fill(pw);
  const nav=p.waitForEvent('domcontentloaded',{timeout:120000}).then(()=>null);await p.locator('#lGo').click();
  const err=await Promise.race([nav,p.waitForFunction(()=>{const e=document.querySelector('#tpan .err');return e&&e.textContent.trim()},null,{timeout:120000}).then(h=>h.jsonValue())]);if(err)throw new Error('login shows error: '+err);await H.ready(p);await p.waitForFunction(()=>ONL32.verified&&titleEl.hidden);await H.tapCutscenes(p,800);await H.closePopups(p)};
 /* ---- device A: play ---- */
 const A=await H.device(browser,errors),a=A.p;await login(a);
 assert.equal(await a.evaluate(()=>!!(D&&D.town)),true);
 await H.walkTo(a,0,17*32,{max:60000,tol:8});await a.waitForFunction(()=>!D);await H.tapCutscenes(a);await H.closePopups(a);
 const start=await a.evaluate(()=>({gel:inv.gel|0,coin:inv.coin|0}));
 await H.hunt(a,6,{until:()=>P.lv>=3});await a.waitForTimeout(1500);
 /* walk over anything still on the ground, like a player sweeping up loot */
 for(let i=0;i<6&&await a.evaluate(()=>drops.length>0);i++){const d=await a.evaluate(()=>[drops[0].x,drops[0].y+8]);await H.walkTo(a,d[0],d[1],{tol:10,max:6000});await a.waitForTimeout(500)}
 const got=await a.evaluate(()=>({gel:inv.gel|0,coin:inv.coin|0,lv:P.lv}));
 assert.ok(got.gel>start.gel,'picked up slime gel by walking over it');assert.ok(got.coin>start.coin,'picked up coins');assert.ok(got.lv>=2,'gained a level from kills');
 /* use one warp scroll (T, stand still) -> back in town, then walk out to the field again and stop at a spot */
 /* a slime hit or a step cancels the 2.2 s cast; a player just presses T again (toast shows why) */
 const recallMsgs=[];for(let i=0;i<8&&await a.evaluate(()=>!D);i++){await a.waitForFunction(()=>P.at<0&&!P.mv);await a.keyboard.press('t');await a.waitForTimeout(300);await a.waitForFunction(()=>!(P.recall>0),null,{timeout:30000});await a.waitForTimeout(500);recallMsgs.push(await a.locator('#msg').innerText());
  if(await a.evaluate(()=>!D)&&/โดนโจมตี/.test(recallMsgs.at(-1)))await H.hunt(a,1)}
 console.log('RECALL',JSON.stringify(recallMsgs));await a.waitForFunction(()=>D&&D.town,null,{timeout:15000});await a.waitForTimeout(1200);await H.closePopups(a);
 assert.equal(await a.evaluate(()=>inv.scroll),1);await H.walkTo(a,0,17*32,{max:60000,tol:8});await a.waitForFunction(()=>!D);await a.waitForTimeout(800);await H.closePopups(a);
 await H.walkTo(a,(await H.pos(a))[0]-200,(await H.pos(a))[1]+120,{max:8000,tol:16});
 const before=await a.evaluate(()=>({lv:P.lv,xp:P.xp,gel:inv.gel|0,coin:inv.coin|0,scroll:inv.scroll|0,hpp:inv.hpp|0,sword:P.armor.sword,axe:GEAR.axe0|0,slime:STORY.k.slime|0,field:!D,x:Math.round(P.x),y:Math.round(P.y)}));
 const hudBefore=await H.hud(a);assert.match(hudBefore.lvText,new RegExp('Lv\\.'+before.lv+'\\b'));assert.equal(hudBefore.coinText,String(before.coin));console.log('PLAYED',JSON.stringify(before));
 /* log out through the visible UI */
 await H.profileMenu(a,'ออกเกม');await a.waitForFunction(()=>DLG.open);assert.match(await a.locator('#dlg .dtxt').innerText().then(t=>t||'')+await a.evaluate(()=>DLG.txt),/บันทึกเกมแล้วกลับไปหน้าแรก/);
 await a.locator('#dlg .dbox').click({position:{x:400,y:40}});await Promise.all([a.waitForEvent('domcontentloaded',{timeout:60000}),a.locator('#dlg .dch button',{hasText:'บันทึกและออก'}).click()]);
 await H.ready(a);await a.waitForSelector('#tPlay');assert.match(await a.locator('#tpan .who').innerText(),new RegExp('Lv\\.'+before.lv));
 await Promise.all([a.waitForEvent('domcontentloaded'),a.locator('#tpan button',{hasText:'ออกจากระบบ'}).click()]);await H.ready(a);
 assert.equal(await a.evaluate(()=>FM_ACCT||''),'');assert.match(await a.locator('#tpan').innerText(),/เข้าสู่ระบบ/);await A.c.close();
 /* ---- device B: clean browser, log in again ---- */
 const B=await H.device(browser,errors),b=B.p;await login(b);
 const after=await b.evaluate(()=>({lv:P.lv,xp:P.xp,gel:inv.gel|0,coin:inv.coin|0,scroll:inv.scroll|0,hpp:inv.hpp|0,sword:P.armor.sword,axe:GEAR.axe0|0,slime:STORY.k.slime|0,town:!!(D&&D.town),x:Math.round(P.x),y:Math.round(P.y),spawn:[TOWN_SPAWN.x*T,TOWN_SPAWN.y*T]}));
 console.log('RELOGGED',JSON.stringify(after));
 for(const k of ['lv','xp','gel','coin','scroll','hpp','sword','axe','slime'])assert.equal(after[k],before[k],k+' restored after logout/login on a clean device');
 const hudAfter=await H.hud(b);assert.equal(hudAfter.coinText,hudBefore.coinText);assert.match(hudAfter.lvText,new RegExp('Lv\\.'+before.lv+'\\b'));assert.match(hudAfter.tracker,/บททดสอบแรก/);
 await H.profileMenu(b,'กระเป๋า');await b.waitForFunction(()=>!bagEl.hidden);assert.match(await b.locator('#bag').innerText(),new RegExp('×?'+before.gel+'|'+before.gel));await b.keyboard.press('i');
 /* place: current design = always the town spawn after login (zone/position are not part of the save) */
 assert.equal(after.town,true,'login starts in town (field position is not saved)');assert.deepEqual([after.x,after.y],after.spawn.map(Math.round));
 assert.deepEqual(errors,[]);console.log('RELOG PROGRESS BROWSER PASS: earned lv/xp/gel/coins/scroll/quest kills restored on a clean device; place = town spawn (field position not saved)');
}finally{await browser?.close();await srv.stop()}})().catch(e=>{console.error(e);process.exitCode=1});
