/* E2a: APIภายใน + authorityแบบจำลอง เทสresolverจริง ไม่ใช่การเล่นผ่านbrowser/route */
import {createRequire} from 'node:module';
import {getMap,hit} from '../src/systems/world.js';
import {FIELD_COMBAT as C} from '../src/data/combat.js';
const require=createRequire(import.meta.url),{createFieldCombat}=require('../server/field-combat.cjs'),{createPrologue}=require('../server/prologue.cjs'),{createSaves}=require('../server/saves.cjs'),{memoryStore}=require('../server/store.cjs');
const ok=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),(m||'ค่าเท่ากัน')+': '+JSON.stringify(a));
async function rejects(fn,code){try{await fn();}catch(e){eq(e.code||e.message,code,'ปฏิเสธ');return;}throw Error('ไม่ปฏิเสธ '+code);}
function ground(){const map=getMap('field');for(let y=64;y<map.h*32-96;y+=16)for(let x=64;x<map.w*32-96;x+=16){let clear=true;for(let dy=-64;dy<=64;dy+=8)for(let dx=-64;dx<=64;dx+=8)if(hit(x+dx,y+dy,null,map))clear=false;if(clear)return{x,y};}throw Error('หาพื้นที่ทดสอบไม่เจอ');}
async function setup({before=true,store=memoryStore(),rng=()=>.5}={}){
 let clock=100000,active=true;const saves=createSaves({store,now:()=>clock}),conn={lid:'combat-test',sid:'a'.repeat(32)};await saves.load(conn.lid,conn.sid);
 const p0=await createPrologue({saves,now:()=>clock,isActive:()=>active});if(before){await p0.handle(conn,{op:'start'});let y=428.8;while(y>214){clock+=100;y=Math.max(214,y-16);ok((await p0.handle(conn,{op:'move',trace:[{x:416,y,dir:'u'}]})).ok,'เดินราชา');}await p0.handle(conn,{op:'talk'});ok((await p0.handle(conn,{op:'claim'})).ok,'รับkitจริง');}
 const actor={...ground(),scene:'field',dir:'r',sp:100,alive:true,stunned:false};let spent=0;
 const config={saves,storageMode:'single-writer',isActive:c=>active&&c===conn,readActor:()=>actor,spendStamina:(_,n)=>{if(actor.sp<n)return false;actor.sp-=n;spent+=n;return true;},now:()=>clock,random:rng};
 const combat=await createFieldCombat(config),spawn=(n=1,dx=30,dy=0)=>Array.from({length:n},()=>({kind:'slime',level:1,x:actor.x+dx,y:actor.y+dy}));
 return {combat,saves,store,conn,actor,config,spawn,advance:n=>{clock+=n;},deactivate:()=>{active=false;},spent:()=>spent};
}
async function slash(t,seq){const start=await t.combat.attack(t.conn,seq);t.advance(start.swing.hitAt-start.swing.start+1);const hit=await t.combat.step(t.conn);t.advance(start.swing.end-start.swing.hitAt);await t.combat.step(t.conn);return hit;}
export default [
 ['E2a regression: เดินเข้าเป้าในhitwindowภายหลังยังโดน แต่เป้าเดิมไม่โดนซ้ำ',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn(1,61));await t.combat.attack(t.conn,1);t.advance(111);eq((await t.combat.step(t.conn)).entities[0].hp,3);t.actor.x+=2;t.advance(89);eq((await t.combat.step(t.conn)).entities[0].hp,2);t.advance(40);eq((await t.combat.step(t.conn)).entities[0].hp,2);
 }],
 ['E2a regression: แรง20หัก3เหลือ17ต้องช้า1.3ตามatkDurหลังหักแรง',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn());t.actor.sp=20;const r=await t.combat.attack(t.conn,1);eq(t.actor.sp,17);eq(r.swing.end-r.swing.start,715);
 }],
 ['E2a ไม่มีauthority/หลายwriter/Promise authorityเปิดไม่ได้',async()=>{
  await rejects(()=>createFieldCombat({storageMode:'single-writer'}),'combat-authority-unavailable');const t=await setup();await rejects(()=>createFieldCombat({...t.config,storageMode:'multi-writer'}),'combat-authority-unavailable');const bad=await createFieldCombat({...t.config,readActor:async()=>t.actor});await rejects(()=>bad.open(t.conn,t.spawn()),'combat-authority-async');
 }],
 ['E2a ต้องผ่านบทนำจริงและดาบเริ่มต้น ไม่อ่านเงิน/สเตตัสจากclient',async()=>{
  const t=await setup({before:false});await rejects(()=>t.combat.open(t.conn,t.spawn()),'combat-chapter');const u=await setup();await u.saves.updateServer(u.conn.lid,p=>{p.character.stats.str=100;return p;});await rejects(()=>u.combat.open(u.conn,u.spawn()),'combat-loadout-unsupported');
 }],
 ['E2a spawnจากserverมีUIDและhp2+lv ตรวจทั้งชุดก่อนสร้าง encounter',async()=>{
  const t=await setup();await rejects(()=>t.combat.open(t.conn,[...t.spawn(),{kind:'slime',level:6,x:1,y:1}]),'combat-spawn');const defs=t.spawn(2);defs[1].level=5;const r=await t.combat.open(t.conn,defs);eq(r.entities.map(m=>m.hp),[3,7]);ok(r.entities[0].id!==r.entities[1].id,'UID');defs[0].x=0;eq((await t.combat.open(t.conn,t.spawn())).entities,r.entities,'openซ้ำไม่respawn/ไม่alias');
 }],
 ['E2a ฟันยังไม่ถึงช่วงโดนไม่ลดเลือด damageจากserverไม่รับtarget/dmg/time',async()=>{
  const t=await setup();const r=await t.combat.open(t.conn,t.spawn());await rejects(()=>t.combat.attack(t.conn,{sequence:1,damage:999,target:r.entities[0].id,time:999999}),'combat-sequence');const a=await t.combat.attack(t.conn,1);eq(a.swing.end-a.swing.start,550);eq((await t.combat.step(t.conn)).entities[0].hp,3);t.advance(111);const h=await t.combat.step(t.conn);eq(h.entities[0].hp,2);eq(h.last.hits[0].damage,1);eq(t.spent(),3);eq((await t.combat.readStory(t.conn.lid)).view.progress,[0]);
 }],
 ['E2a ทุกtick/attackซ้ำและ20คำขอพร้อมกันโดนครั้งเดียว เสียแรงครั้งเดียว',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn());const a=await Promise.all(Array.from({length:20},()=>t.combat.attack(t.conn,1)));eq(t.spent(),3);eq(a.every(x=>x.sequence===1),true);t.advance(120);const hits=await Promise.all(Array.from({length:20},()=>t.combat.step(t.conn)));eq(hits.at(-1).entities[0].hp,2);await rejects(()=>t.combat.attack(t.conn,2),'combat-cooldown');t.advance(500);await t.combat.attack(t.conn,2);eq(t.spent(),6);await rejects(()=>t.combat.attack(t.conn,1),'combat-sequence');
 }],
 ['E2a ระยะ/ทิศ/ฉาก/ตาย/มึนใช้authority ไม่ฟันไกลหรือหลังตัวเกิน12',async()=>{
  const t=await setup();await t.combat.open(t.conn,[...t.spawn(1,61),...t.spawn(1,-20),...t.spawn(1,-11)]);const h=await slash(t,1);eq(h.entities.map(m=>m.hp),[3,3,2]);t.actor.scene='town';await rejects(()=>t.combat.attack(t.conn,2),'combat-actor');t.actor.scene='field';t.actor.alive=false;await rejects(()=>t.combat.attack(t.conn,2),'combat-actor');t.actor.alive=true;t.actor.stunned=true;await rejects(()=>t.combat.attack(t.conn,2),'combat-actor');
 }],
 ['E2a ทิศ/ตำแหน่งตอนโดนใช้serverตอนนั้น ฟันพลาดเลยhit windowไม่คิดย้อนหลัง',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn());await t.combat.attack(t.conn,1);t.actor.dir='l';t.advance(111);eq((await t.combat.step(t.conn)).entities[0].hp,3);t.advance(500);t.actor.dir='r';await t.combat.attack(t.conn,2);t.advance(551);eq((await t.combat.step(t.conn)).entities[0].hp,3);
 }],
 ['E2a แรงน้อยท่าช้า1.3 แรงไม่ถึง3/หักไม่สำเร็จไม่เริ่มท่า',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn());t.actor.sp=2;await rejects(()=>t.combat.attack(t.conn,1),'combat-stamina');eq(t.spent(),0);t.actor.sp=10;const a=await t.combat.attack(t.conn,1);eq(a.swing.end-a.swing.start,715);eq(t.actor.sp,7);
 }],
 ['E2a ฆ่าจริง8ตัว→ledgerพร้อมส่งบท โหลดใหม่ยัง8 ไม่มีเงิน/XPมอนหรือของเสก',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn(8));for(let i=1;i<=3;i++)await slash(t,i);const s=await t.combat.readStory(t.conn.lid);eq(s.view.progress,[8]);ok(s.view.ready,'พร้อมส่ง');eq(s.state.chapterId,'first-light','ยังไม่รับรางวัลบท1');const p=await t.saves.readServer(t.conn.lid);eq(p.coin,50);eq(p.character.xp,20);eq(Object.keys(p.inventory.gear).length,3);eq(Object.keys(s.receipts),['awakening']);const next=await createFieldCombat(t.config);eq((await next.readStory(t.conn.lid)).view.progress,[8]);await rejects(()=>t.combat.attack(t.conn,4),'combat-chapter');
 }],
 ['E2a เกิน8ศพพร้อมกันหยุดนับที่8 ไม่ค้างpending/เลื่อนข้ามบท',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn(9));let h;for(let i=1;i<=3;i++)h=await slash(t,i);eq(h.entities.filter(m=>m.dead).length,9);eq(h.entities.some(m=>m.pending),false);eq((await t.combat.readStory(t.conn.lid)).view.progress,[8]);
 }],
 ['E2a sessionเก่าหรือconnเปลี่ยนsidไม่ตี/ใช้proofค้างได้',async()=>{
  const t=await setup();await t.combat.open(t.conn,t.spawn());await t.combat.attack(t.conn,1);t.deactivate();t.advance(120);await rejects(()=>t.combat.step(t.conn),'combat-session');eq((await t.combat.readStory(t.conn.lid)).view.progress,[0]);const u=await setup();await u.combat.open(u.conn,u.spawn());u.conn.sid='b'.repeat(32);await rejects(()=>u.combat.attack(u.conn,1),'combat-session');
 }],
 ['E2a commitแล้วคำตอบหาย retryใช้kill idเดิมไม่เพิ่มเกิน1',async()=>{
  const store=memoryStore(),set=store.set;let lose=false;store.set=async(k,v)=>{await set(k,v);if(lose){lose=false;throw Error('lost-ack');}};
  const t=await setup({store});await t.combat.open(t.conn,t.spawn());await slash(t,1);await slash(t,2);await t.combat.attack(t.conn,3);t.advance(111);lose=true;await rejects(()=>t.combat.step(t.conn),'lost-ack');const r=await t.combat.step(t.conn);eq(r.entities[0].dead,true);eq(r.entities[0].pending,false);eq((await t.combat.readStory(t.conn.lid)).view.progress,[1]);eq(t.spent(),9);for(let i=0;i<3;i++)await t.combat.step(t.conn);eq((await t.combat.readStory(t.conn.lid)).view.progress,[1]);
 }],
 ['E2a storageเขียนไม่สำเร็จค้างหลักฐานไว้ retryไม่reroll/ไม่ตีใหม่',async()=>{
  const store=memoryStore(),set=store.set;let broken=false;store.set=async(k,v)=>{if(broken)throw Error('store-down');return set(k,v);};const t=await setup({store});await t.combat.open(t.conn,t.spawn());await slash(t,1);await slash(t,2);await t.combat.attack(t.conn,3);t.advance(111);broken=true;await rejects(()=>t.combat.step(t.conn),'store-down');eq((await t.combat.readStory(t.conn.lid)).view.progress,[0]);broken=false;const r=await t.combat.attack(t.conn,3);eq(r.entities[0].dead,true);eq(t.spent(),9);eq((await t.combat.readStory(t.conn.lid)).view.progress,[1]);
 }],
 ['E2a randomพังกลางหลายเป้าไม่ลดเลือดบางตัว snapshotไม่เปิดให้แก้entity',async()=>{
  let calls=0,bad=false;const t=await setup({rng:()=>bad&&++calls===3?NaN:.5});const opened=await t.combat.open(t.conn,t.spawn(2));opened.entities[0].hp=0;await t.combat.attack(t.conn,1);t.advance(111);bad=true;await rejects(()=>t.combat.step(t.conn),'combat-random');bad=false;const r=await t.combat.step(t.conn);eq(r.entities.map(m=>m.hp),[2,2]);
 }],
];
