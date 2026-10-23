/* Phase 2 player path: register -> opening scene -> audience with King Aldric -> tutorial -> Lv.10 -> choose class.
   Played with visible UI only: title buttons, character creation, tapping cutscenes, held arrow keys, E to enter/talk,
   J to attack, Shift to dash, the profile menu (HUD face) for bag/stats/passives, and the class master's card button.
   Shortcut (disclosed): after the tutorial and chapter 1 are done for real (Lv~5), XP is set to one point below Lv.9->10
   (P.lv=9, P.xp=need(9)-1) and the final level is earned by killing a real slime; grinding 5->10 takes ~10 minutes.
   Test-period gift (owner order, fix156 + accounts.js newbie150): every new account is raised to Lv.150 once it reaches Lv.7,
   so a new player meets the class master at Lv.150, never at Lv.10. The test records whichever happens and requires >= Lv.10.
   Run: ELD_CHROMIUM=... PORT=8843 node tests/new_player_path_browser_test.js */
const assert=require('node:assert/strict'),H=require('./player_path_helpers');
(async()=>{const srv=await H.startServer('newpath');let browser;const errors=[],T0=Date.now(),log=(...a)=>console.log('['+((Date.now()-T0)/1000).toFixed(0)+'s]',...a);
try{browser=await H.launch();const {p}=await H.device(browser,errors);await p.goto(H.GAME_URL);await H.ready(p);
 /* 1) title -> register -> character creation */
 assert.match(await p.locator('#tpan').innerText(),/สมัครไอดีใหม่/);await p.getByText('สมัครไอดีใหม่').click();
 await p.locator('#rId').fill('newpath'+(Date.now()%1e5));await p.locator('#rPw').fill('Test1234');await p.locator('#rPw2').fill('Test1234');await p.locator('#rGo').click();
 await p.waitForSelector('#cc41n',{state:'visible'});await p.locator('#cc41n').fill('ผู้กล้าเส้นทาง');
 await Promise.all([p.waitForEvent('domcontentloaded'),p.locator('#cc41go').click()]);await p.waitForFunction(()=>!window.FM_LOADING&&window.REG136);
 /* 2) opening scene: five prologue lines ending with the order to see King Aldric; a frame stamped before the text change must not throw */
 await p.waitForFunction(()=>!cineEl.hidden);await p.waitForTimeout(600);
 const first=await p.locator('#cine .ct').innerText();assert.match(first,/ผลึกอรุณ/);await p.locator('#cine').click({position:{x:500,y:300}});await p.waitForTimeout(450);
 const frameErr=await p.evaluate(()=>{try{cineDraw(CINE.t0-16);return null}catch(e){return e.message}});assert.equal(frameErr,null,'prologue shatter scene must draw a frame whose timestamp predates the text change (rAF time < CINE.t0)');
 const lines=[first,...await H.tapCutscenes(p,300)];log('prologue',lines.length,'lines');assert.equal(lines.length,5);assert.match(lines[4],/พระราชาอัลดริค/);
 assert.equal(await p.evaluate(()=>ONL32.verified),true);let v=await H.hud(p);
 assert.match(v.tutorial,/บทสอน 1\/\d+ · การเดิน/);assert.match(v.tracker,/บทนำ: การเข้าเฝ้า/);assert.match(v.lvText,/Lv\.1\b/);
 /* 3) walk to the castle (tutorial 1 -> 2), E to enter the throne hall, walk to the king, E to talk */
 assert.equal(await H.walkTo(p,22*32,10*32,{max:60000}),true,'walk to castle door');await p.waitForFunction(()=>/เข้าเฝ้าพระราชา/.test(gid('tut').innerText));
 await p.keyboard.press('e');await p.waitForFunction(()=>D&&D.shop==='hall');assert.equal(await H.walkTo(p,416,150,{max:30000}),true,'walk to throne');
 await p.keyboard.press('e');await p.waitForFunction(()=>DLG.open);assert.match(await p.locator('#dlg .dname').innerText(),/พระราชาอัลดริค/);
 const king=await H.readDialog(p);log('king dialog',king.map(d=>d.text.slice(0,30)));
 assert.match(king[0].text,/อัลดริคที่สาม/);assert.ok(king.some(d=>/รางวัล: 🪙 50/.test(d.text)),'reward line visible');assert.ok(king.some(d=>/บทที่ 1: บททดสอบแรก/.test(d.text)&&d.choices.some(c=>/รับภารกิจ/.test(c))),'next quest offered');
 v=await H.hud(p);assert.match(v.tracker,/บทที่ 1: บททดสอบแรก[\s\S]*0\/8/);assert.equal(v.coinText,'50');assert.match(v.tutorial,/บทสอน 3\/\d+ · กระเป๋า/);
 assert.deepEqual(await p.evaluate(()=>({sword:P.armor.sword,axe:GEAR.axe0|0,pick:GEAR.pick0|0,hpp:inv.hpp,scroll:inv.scroll})),{sword:'sword0',axe:1,pick:1,hpp:3,scroll:2});
 log('captain cutscene',(await H.tapCutscenes(p)).length);
 /* 4) tutorial: bag (via profile menu, the 🎒 HUD button is hidden), potions (timed), go hunting */
 await H.profileMenu(p,'กระเป๋า');await p.waitForFunction(()=>!bagEl.hidden);assert.match(await p.locator('#bag').innerText(),/🎒 \d+\/\d+/);assert.ok(await p.locator('#bag img, #bag canvas').count()>0,'bag shows item icons');await p.keyboard.press('i');
 await H.waitSee(p,()=>/ออกล่า/.test(gid('tut').innerText));
 await H.leaveHall(p);
 assert.equal((await p.evaluate(()=>guideTarget()))[2],'ทุ่งหญ้า','guide arrow points to the field');
 await H.walkTo(p,0,17*32,{max:60000,tol:8});await p.waitForFunction(()=>!D);await H.tapCutscenes(p);await H.closePopups(p);
 assert.match(await p.locator('#tut').innerText(),/โจมตี/);
 /* 5) attack (J), dash (Shift), stats (profile -> สถานะ), passives (profile -> พาสซีฟ), then the two timed steps */
 assert.equal(await H.hunt(p,1),1);await p.waitForFunction(()=>/พุ่งหลบ/.test(gid('tut').innerText));
 await p.waitForFunction(()=>P.at<0&&P.dcd<=0);await p.keyboard.press('Shift');await p.waitForFunction(()=>/อัพสเตตัส/.test(gid('tut').innerText)||P.lv<2);
 await p.waitForFunction(()=>P.lv>=2&&!gid('tut').hidden&&/อัพสเตตัส/.test(gid('tut').innerText),null,{timeout:120000}).catch(()=>H.hunt(p,3,{until:()=>P.lv>=2}));
 await H.profileMenu(p,'สถานะ');await p.waitForFunction(()=>!chp.hidden);await p.locator('#chp .bh button.x').click();
 await p.waitForFunction(()=>/สกิลและพาสซีฟ/.test(gid('tut').innerText));await H.profileMenu(p,'พาสซีฟ');await p.waitForFunction(()=>!skwEl.hidden);
 await p.locator('#skw .sh button',{hasText:'✕'}).click();await p.waitForFunction(()=>/อัลติเมท/.test(gid('tut').innerText));
 await p.waitForFunction(()=>STORY.tut>=TUTS.length&&gid('tut').hidden,null,{timeout:30000});log('tutorial finished, Lv',await p.evaluate(()=>P.lv));
 /* 6) chapter 1: 8 slimes, then report to the king */
 await H.hunt(p,12,{until:()=>STORY.st==='report'});await p.waitForFunction(()=>STORY.st==='report');assert.match(await p.locator('#qtrack').innerText(),/สำเร็จแล้ว! กลับไปรายงาน/);
 const gate=await p.evaluate(()=>guideTarget());assert.equal(gate[2],'เมือง');await H.walkTo(p,gate[0]+40,gate[1],{max:90000,tol:8});await p.waitForFunction(()=>D&&D.town);await H.closePopups(p);
 assert.equal((await p.evaluate(()=>guideTarget()))[2],'ปราสาท');await H.walkTo(p,22*32,10*32,{max:60000});await p.keyboard.press('e');await p.waitForFunction(()=>D&&D.shop==='hall');
 await H.walkTo(p,416,150,{max:30000});await p.keyboard.press('e');await p.waitForFunction(()=>DLG.open);const rep=await H.readDialog(p);
 assert.ok(rep.some(d=>/ฝีมือไม่เลว/.test(d.text)),'king accepts the report');assert.match(await p.locator('#qtrack').innerText(),/บทที่ 2: อาวุธคู่กาย/);await H.tapCutscenes(p);
 /* 7) class master refuses before Lv.10 (what the player sees) */
 await H.leaveHall(p);
 const master=await p.evaluate(()=>{const n=D.npcs.find(q=>q.name==='ปรมาจารย์อาชีพ');return [n.x,n.y]});
 const talkMaster=async()=>{assert.equal(await H.walkTo(p,master[0],master[1]+26,{max:60000,tol:10}),true,'walk to class master');await p.keyboard.press('ArrowUp');await p.keyboard.press('e');await p.waitForFunction(()=>DLG.open);
  assert.match(await p.locator('#dlg .dname').innerText(),/ปรมาจารย์/);await p.locator('#dlg .dbox').click({position:{x:400,y:40}});await p.waitForTimeout(300);const greet=await p.locator('#dlg .dtxt').innerText();
  await p.locator('#dlg .dch button',{hasText:'เลือกอาชีพ'}).click();await p.waitForFunction(()=>CM.open&&!shopEl.hidden);return greet};
 const greetLow=await talkMaster();assert.match(greetLow,/กลับมาเมื่อถึง Lv\.10/);const lockedText=await p.locator('#shop').innerText();assert.match(lockedText,/ต้อง Lv\.10/);
 await p.locator('#shop .cc7',{hasText:'นักดาบ'}).locator('button.ok').click();assert.match(await p.locator('#msg').innerText(),/เลือกอาชีพได้ตั้งแต่ Lv\.10/);assert.equal(await p.evaluate(()=>P.cls),'none');
 await p.locator('#shop .xclose').click();
 /* 8) reach Lv.10: shortcut to 1 XP below Lv.9->10, then earn the level from a real kill */
 const lvBefore=await p.evaluate(()=>P.lv);log('real Lv before shortcut',lvBefore);
 await H.walkTo(p,0,17*32,{max:60000,tol:8});await p.waitForFunction(()=>!D);await H.closePopups(p);
 await p.evaluate(()=>{P.lv=9;P.xp=need(9)-1});const k10=await H.hunt(p,8,{until:()=>P.lv>=10});await p.waitForTimeout(1500);
 const lv10=await p.evaluate(()=>({lv:P.lv,xp:P.xp,need:need(P.lv),field:!D,slimes:slimes.filter(s=>!s.dead).length}));log('after shortcut kills',k10,JSON.stringify(lv10));
 assert.ok(lv10.lv>=10,'reached the class level');const LV=lv10.lv;if(LV===150)log('NOTE: fix156 test-period gift raised the new character to Lv.150');
 await p.waitForFunction(lv=>new RegExp('Lv\\.'+lv+'\\b').test(gid('xpt').textContent),LV);await p.waitForFunction(()=>/เควส: เลือกอาชีพ/.test(qtEl.innerText),null,{timeout:10000});
 /* 9) choose a class at the class master */
 /* chapter 2 has no guide arrow; walk back through the field's town gate */
 const g2=await p.evaluate(()=>TGATE());await H.walkTo(p,g2[0]+40,g2[1],{max:90000,tol:8});await p.waitForFunction(()=>D&&D.town);await H.closePopups(p);
 await talkMaster();const menu=await p.locator('#shop').innerText();assert.match(menu,/11 อาชีพ/);assert.doesNotMatch(menu,/ต้อง Lv\.10/);
 await p.locator('#shop .cc7',{hasText:'นักดาบ'}).locator('button.ok').click();await p.waitForFunction(()=>P.cls==='sword');
 assert.match(await p.locator('#msg').innerText()+await p.evaluate(()=>[...document.querySelectorAll('#chatList *')].map(e=>e.textContent).join(' ')),/นักดาบ/);
 assert.match(await p.locator('#shop .cc7.on').innerText(),/นักดาบ[\s\S]*อาชีพปัจจุบัน/);await p.locator('#shop .xclose').click();
 await p.waitForFunction(()=>!/เควส: เลือกอาชีพ/.test(qtEl.innerText),null,{timeout:10000});
 await H.profileMenu(p,'สกิล');await p.waitForFunction(()=>!skwEl.hidden);const skw=await p.locator('#skw .sh b').innerText();assert.match(skw,new RegExp('นักดาบ · Lv\\.'+LV));await p.locator('#skw .sh button',{hasText:'✕'}).click();
 /* the class reaches the server save (another device would see it) */
 assert.equal(await p.evaluate(()=>CLOUD.sync(true)),true);const saved=await p.evaluate(async()=>{const r=await CLOUD.call('/api/load',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT)});const s=JSON.parse(r.save);return {cls:JSON.parse(s.fm_cls||"{}").cls,lv:JSON.parse(s.fm_save_v1).lv,story:JSON.parse(s.fm_story)}});
 assert.equal(saved.cls,'sword');assert.equal(saved.lv,LV);assert.equal(saved.story.ch,2);
 assert.deepEqual(errors,[]);log('NEW PLAYER PATH BROWSER PASS',JSON.stringify({skw,saved:{cls:saved.cls,lv:saved.lv,ch:saved.story.ch},realLvBeforeShortcut:lvBefore}));
}finally{await browser?.close();await srv.stop()}})().catch(e=>{console.error(e);process.exitCode=1});
