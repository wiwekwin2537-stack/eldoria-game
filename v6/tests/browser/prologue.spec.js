/* PLAY-E2c browser acceptance: ต้องมี playwright Chromium และ ws · บัญชีทดสอบในmemoryเท่านั้น
   node v6/tests/browser/prologue.spec.js · ไม่เปิดเว็บไซต์จริง/ไม่เปลี่ยนenvของRender */
import {createRequire} from 'node:module';
import http from 'node:http';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const {createV6}=require('../../server/index.cjs'),{memoryStore}=require('../../server/store.cjs');
const bundle=process.env.ELDORIA_TEST_WS_BUNDLE?require(process.env.ELDORIA_TEST_WS_BUNDLE):require('ws');const ws={WebSocketServer:bundle.WebSocketServer||bundle.wsServer};
const api=createV6({store:memoryStore(),env:{V6_PROLOGUE_TEST:'1'},wsLib:ws,authTimeoutMs:0,log:()=>{}});
const server=http.createServer((q,s)=>{if(!api.http(q,s)){s.writeHead(404);s.end();}});api.attach(server);
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
const assert=(v,m)=>{if(!v)throw new Error(m);};
try{
 browser=await chromium.launch({headless:true});
 for(const [label,viewport] of [['desktop',{width:1366,height:768}],['mobile-landscape',{width:844,height:390}]]){
  const context=await browser.newContext({viewport,hasTouch:label!=='desktop',isMobile:label!=='desktop'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/v6/');await page.getByRole('button',{name:'สมัครใหม่',exact:true}).click();
  const id='p0'+Date.now().toString(36);await page.locator('input[name=id]').fill(id);await page.locator('input[name=pw]').fill('test-only-123');await page.locator('input[name=pw2]').fill('test-only-123');await page.getByRole('button',{name:'สมัครและเข้าเกม'}).click();
  await page.locator('#p0-start').waitFor({state:'visible'});const original=await page.evaluate(()=>({id:window.__G.scene.id,x:window.__G.player.x,y:window.__G.player.y}));await page.locator('#p0-start').click();
  await page.waitForFunction(()=>window.__G.scene.id==='shop.hall'&&window.__G.ui.prologueActive);await page.keyboard.down('ArrowUp');await page.waitForFunction(()=>window.__G.player.y<225);await page.keyboard.up('ArrowUp');
  await page.locator('#p0-talk').click();await page.locator('#p0-claim').waitFor({state:'visible'});assert((await page.locator('#p0-dialog').innerText()).includes('พระราชาอัลดริค'),'พระราชา');await page.locator('#p0-claim').click();await page.waitForFunction(()=>window.__G.player.coin===50);
  await page.locator('#p0-items summary').click();const initialItems=await page.locator('#p0-items ul').innerText();assert(initialItems.includes('ยาเลือด × 3')&&initialItems.includes('ม้วนวาร์ป × 2'),'ของใช้ยืนยัน');assert(initialItems.includes('ดาบนักล่าเงา · สวมอยู่')&&initialItems.includes('ขวานหินธรรมดา')&&initialItems.includes('ที่ขุดแร่หินธรรมดา'),'kitยืนยัน');
  const profile=await api.saves.readServer(id);assert(profile.coin===50&&Object.keys(profile.inventory.gear).length===3,'รางวัลครบ');assert(profile.inventory.stacks.hpp===3&&profile.inventory.stacks.scroll===2,'ของครบ');
  await page.locator('#p0-field').click();await page.waitForFunction(()=>window.__G.ui.prologueField);
  await page.waitForFunction(()=>window.__G.player.hp<100,{},{timeout:20000});assert((await page.locator('#p0-bar').innerText()).includes('HP'),'แสดงHP');
  for(let attempt=0;attempt<90;attempt++){
    const saved=await api.saves.readServer(id);if(saved.storyLedger.state.progress[0]>=8)break;
    if(await page.evaluate(()=>window.__G.player.hp<=0)){
      await page.locator('#p0-hall').click();await page.waitForFunction(()=>window.__G.scene.id==='shop.hall');await page.keyboard.down('ArrowUp');await page.waitForFunction(()=>window.__G.player.y<225);await page.keyboard.up('ArrowUp');await page.locator('#p0-talk').click();await page.locator('#p0-field').click();await page.waitForFunction(()=>window.__G.ui.prologueField);
    }
    if(await page.locator('#p0-attack').isEnabled())await page.locator('#p0-attack').click();await page.waitForTimeout(650);
  }
  const hunted=await api.saves.readServer(id);assert(hunted.storyLedger.state.progress[0]===8,'ล่า8');await page.locator('#p0-hall').click();await page.waitForFunction(()=>window.__G.scene.id==='shop.hall');await page.keyboard.down('ArrowUp');await page.waitForFunction(()=>window.__G.player.y<225);await page.keyboard.up('ArrowUp');await page.locator('#p0-talk').click();await page.locator('#p0-claim').click();await page.waitForFunction(()=>window.__G.player.coin===170);assert((await api.saves.readServer(id)).inventory.stacks.mpp===2,'รางวัลบท1');assert(await page.locator('#p0-items').evaluate(e=>e.open),'detailsยังเปิดหลังข้อมูลอัปเดต');assert((await page.locator('#p0-items ul').innerText()).includes('ยามานา × 2'),'รายการหลังส่งบท1');
  const box=await page.locator('#p0-close').boundingBox();assert(box&&box.x>=0&&box.y>=0&&box.x+box.width<=viewport.width&&box.y+box.height<=viewport.height,'ปุ่มอยู่ในจอ');await page.locator('#p0-close').click();
  const after=await page.evaluate(()=>({id:window.__G.scene.id,x:window.__G.player.x,y:window.__G.player.y}));assert(JSON.stringify(after)===JSON.stringify(original),'กลับตำแหน่งเดิม');assert(errors.length===0,errors.join('\n'));await context.close();console.log('PASS',label);
 }
}finally{await browser?.close();api.stop();await new Promise(r=>server.close(r));}
