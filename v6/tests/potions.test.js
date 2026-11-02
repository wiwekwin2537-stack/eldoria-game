import {createState} from '../src/core/state.js';
import world,{enter} from '../src/systems/world.js';
import {_reset} from '../src/core/bus.js';
import {createPrologueClient} from '../src/core/prologue-client.js';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{createPotions}=require('../server/potions.cjs'),{createSaves}=require('../server/saves.cjs'),{memoryStore}=require('../server/store.cjs'),{createStoryRewardAdapter}=require('../server/story-rewards.cjs'),{createPrologue}=require('../server/prologue.cjs'),{createV6}=require('../server/index.cjs');
const ok=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),(m||'เท่ากัน')+': '+JSON.stringify(a));
async function rejects(fn,code){try{await fn();}catch(e){eq(e.code||e.message,code);return;}throw Error('ไม่ปฏิเสธ '+code);}
async function setup({hp=20,store=memoryStore()}={}){let time=1000000,active=true,applied=0;const conn={lid:'potion-test',sid:'a'.repeat(32)},saves=createSaves({store,now:()=>time});await saves.load(conn.lid,conn.sid);const adapter=await createStoryRewardAdapter();await saves.updateServer(conn.lid,p=>{adapter.grant(p,adapter.rewards['story.0']);return p;});
 const actor={encounterId:'encounter-1',potionSequence:0,hp,maxHp:100,alive:true};const config={saves,storageMode:'single-writer',now:()=>time,isActive:()=>active,readEncounter:()=>actor,applyHeal:(_,r)=>{actor.hp=Math.min(actor.maxHp,actor.hp+r.amount);actor.potionSequence=r.sequence;applied++;return true;}};
 const service=await createPotions(config),use=(sequence=1,extra={})=>service.use(conn,{encounterId:actor.encounterId,sequence,...extra});return{conn,saves,actor,service,config,use,advance:n=>{time+=n;},applied:()=>applied,deactivate:()=>{active=false;},store};}
async function training(store=memoryStore()){let time=1e6;const saves=createSaves({store,now:()=>time}),conn={lid:'potion-route',sid:'a'.repeat(32)};await saves.load(conn.lid,conn.sid);const p=await createPrologue({saves,now:()=>time,isActive:()=>true}),send=c=>p.handle(conn,c);await send({op:'start'});for(let y=412.8;y>=214;y=Math.max(214,y-16)){time+=100;ok((await send({op:'move',trace:[{x:416,y,dir:'u'}]})).ok,'king');if(y===214)break;}await send({op:'talk'});await send({op:'claim'});let r=await send({op:'field'});for(let i=0;i<200&&r.actor.hp>95;i++){time+=20;await p.tick();r=await send({op:'start'});}ok(r.actor.hp<100&&r.actor.alive,'AIทำเลือดลด');return{p,saves,conn,send,r,advance:n=>{time+=n;}};}
export default [
 ['POTION HP30%อย่างน้อย60 หักhppหนึ่งพร้อมreceipt ไม่เปลี่ยนเหรียญ/XP/UID',async()=>{
  const t=await setup(),before=await t.saves.readServer(t.conn.lid),r=await t.use();eq(r.amount,60);eq(t.actor.hp,80);const after=await t.saves.readServer(t.conn.lid);eq(after.inventory.stacks.hpp,2);eq(after.potionUse,r);eq([after.coin,after.character,Object.keys(after.inventory.gear)],[before.coin,before.character,Object.keys(before.inventory.gear)]);eq(r.until-r.usedAt,8000);
 }],
 ['POTION ไม่เกินmaxHPและใช้สูตร30%เมื่อmaxHPสูง',async()=>{
  const t=await setup({hp:95});eq((await t.use()).amount,5);eq(t.actor.hp,100);const u=await setup({hp:100});u.actor.maxHp=1000;eq((await u.use()).amount,300);eq(u.actor.hp,400);
 }],
 ['POTION 20คำขอพร้อมกันและretryหลังเลือดเต็มหัก/ฟื้นครั้งเดียว',async()=>{
  const t=await setup({hp:50});const all=await Promise.all(Array.from({length:20},()=>t.use()));eq(all.every(r=>r.sequence===1),true);eq(t.actor.hp,100);eq(t.applied(),1);eq((await t.saves.readServer(t.conn.lid)).inventory.stacks.hpp,2);
 }],
 ['POTION เลือดเต็ม/ล้ม/ยาไม่มีไม่หักหรือเขียนreceipt',async()=>{
  const t=await setup({hp:100});await rejects(()=>t.use(),'potion-full');eq((await t.saves.readServer(t.conn.lid)).potionUse,undefined);t.actor.hp=0;t.actor.alive=false;await rejects(()=>t.use(),'potion-dead');const u=await setup();await u.saves.updateServer(u.conn.lid,p=>{delete p.inventory.stacks.hpp;return p;});await rejects(()=>u.use(),'potion-empty');eq(u.applied(),0);
 }],
 ['POTION cooldown8วิจากserverรวมเปลี่ยนencounter ไม่รับค่าฟื้น/clienttime',async()=>{
  const t=await setup();await t.use(1,{amount:9999,itemId:'mpp',now:99999999});eq(t.actor.hp,80);t.actor.hp=30;await rejects(()=>t.use(2),'potion-cooldown');t.actor.encounterId='encounter-2';t.actor.potionSequence=0;await rejects(()=>t.use(),'potion-cooldown');t.advance(8000);await t.use();eq(t.actor.hp,90);eq((await t.saves.readServer(t.conn.lid)).inventory.stacks.hpp,1);
 }],
 ['POTION sequenceข้าม/ติดลบ/epochเก่าปฏิเสธ ไม่ใช้receiptเก่าฟื้นชีวิตใหม่',async()=>{
  const t=await setup();for(const n of [0,-1,1.1,NaN,2])await rejects(()=>t.use(n),'potion-sequence');await t.use();t.actor.encounterId='encounter-new';t.actor.potionSequence=0;t.actor.hp=10;await rejects(()=>t.service.use(t.conn,{encounterId:'encounter-1',sequence:1}),'potion-encounter');eq(t.actor.hp,10);eq((await t.saves.readServer(t.conn.lid)).inventory.stacks.hpp,2);
 }],
 ['POTION storageล้มก่อนเขียนไม่ฟื้น/หักบางส่วน retryจบครั้งเดียว',async()=>{
  const store=memoryStore(),set=store.set;let broken=false;store.set=async(k,v)=>{if(broken)throw Error('store-down');return set(k,v);};const t=await setup({store});broken=true;await rejects(()=>t.use(),'store-down');eq(t.actor.hp,20);eq((await t.saves.readServer(t.conn.lid)).inventory.stacks.hpp,3);broken=false;await t.use();eq(t.actor.hp,80);eq(t.applied(),1);
 }],
 ['POTION commitแล้วACKหาย retryอ่านreceiptเดิมไม่หักเพิ่ม และserviceใหม่ไม่ฟื้นซ้ำ',async()=>{
  const store=memoryStore(),set=store.set;let lose=false;store.set=async(k,v)=>{await set(k,v);if(lose){lose=false;throw Error('lost-ack');}};const t=await setup({store});lose=true;await rejects(()=>t.use(),'lost-ack');eq(t.actor.hp,20);eq((await t.saves.readServer(t.conn.lid)).inventory.stacks.hpp,2);const next=await createPotions(t.config);await next.use(t.conn,{encounterId:t.actor.encounterId,sequence:1});eq(t.actor.hp,80);await t.use();eq(t.applied(),1);eq((await t.saves.readServer(t.conn.lid)).inventory.stacks.hpp,2);
 }],
 ['POTION receiptเสียไม่รีเซ็ตเพื่อใช้ยาใหม่ sessionเก่าหักของไม่ได้',async()=>{
  const t=await setup();await t.saves.updateServer(t.conn.lid,p=>{p.potionUse={version:999};return p;});await rejects(()=>t.use(),'potion-data');eq(t.applied(),0);const u=await setup();await u.saves.load(u.conn.lid,'b'.repeat(32));await rejects(()=>u.use(),'potion-session');eq((await u.saves.readServer(u.conn.lid)).inventory.stacks.hpp,3);
 }],
 ['POTION ระหว่างรอACKถ้าencounterเปลี่ยน receiptไม่ฟื้นให้ตัวละครใหม่',async()=>{
  const store=memoryStore(),set=store.set;let changed=false,t;store.set=async(k,v)=>{await set(k,v);if(changed){changed=false;t.actor.encounterId='new-life';t.actor.potionSequence=0;t.actor.hp=5;}};t=await setup({store});changed=true;await rejects(()=>t.use(),'potion-encounter');eq(t.actor.hp,5);eq(t.applied(),0);eq((await t.saves.readServer(t.conn.lid)).inventory.stacks.hpp,2);
 }],
 ['POTION routeจริงใช้ยา/กดซ้ำ/เลือดและจำนวนยาจากserver',async()=>{
  const t=await training();const hp=t.r.actor.hp,command={op:'potion',encounterId:t.r.actor.encounterId,sequence:1,amount:999,hp:999};const r=await t.send(command);ok(r.ok,r.error);eq(r.actor.hp,Math.min(100,hp+60));eq(r.profile.inventory.stacks.hpp,2);eq(r.actor.potionSequence,1);ok(r.actor.potionCooldownMs>0,'cooldown');const again=await t.send(command);ok(again.ok,again.error);eq(again.profile.inventory.stacks.hpp,2);eq(again.actor.hp,r.actor.hp);t.p.stop();
 }],
 ['POTION route storageไม่ชัดพักAIของห้องนั้นจนแก้receiptก่อน แล้วฟื้นแค่ครั้งเดียว',async()=>{
  const store=memoryStore(),set=store.set;let broken=false;store.set=async(k,v)=>{if(broken)throw Error('store-down');return set(k,v);};const t=await training(store),hp=t.r.actor.hp;broken=true;const failed=await t.send({op:'potion',encounterId:t.r.actor.encounterId,sequence:1});eq(failed.ok,false);t.advance(1000);try{await t.p.tick();}catch{}const still=await t.send({op:'start'});eq(still.actor.hp,hp,'AIพัก');ok(still.actor.potionPending,'pending');broken=false;await t.p.tick();const fixed=await t.send({op:'start'});eq(fixed.actor.hp,Math.min(100,hp+60));eq(fixed.profile.inventory.stacks.hpp,2);eq(fixed.actor.potionPending,false);t.p.stop();
 }],
 ['POTION controllerส่งepoch/seqและรับHP/จำนวนยาจากroute ไม่เปิดdialogหลังใช้',async()=>{
  const t=await training();_reset();world._reset();const G=createState();world.init(G);G.player.hp=63;G.player.maxHp=111;const c=createPrologueClient(G,{request:async m=>({t:'prologue',...await t.send(m.command)}),ready:()=>true,enter});ok(await c.start(),'resume');const old=G.player.hp;ok(await c.potion(),'ใช้ยา');eq(G.player.hp,Math.min(100,old+60));eq(c.state.profile.inventory.stacks.hpp,2);eq(c.state.dialog,false);c.disconnect();eq([G.player.hp,G.player.maxHp],[63,111]);t.p.stop();
 }],
 ['POTION WebSocketจริงรับhpp/ถูกAIตี/ใช้ยา/ส่งซ้ำไม่หักเพิ่ม',async()=>{
  const http=require('node:http'),lib=process.env.ELDORIA_TEST_WS_BUNDLE?require(process.env.ELDORIA_TEST_WS_BUNDLE):require('ws'),WS=lib.WebSocket||lib.ws||lib,WebSocketServer=lib.WebSocketServer||lib.wsServer;let time=1e6;
  const api=createV6({store:memoryStore(),env:{V6_PROLOGUE_TEST:'1'},now:()=>time,wsLib:{WebSocketServer},authTimeoutMs:0,log:()=>{}}),server=http.createServer((q,s)=>{if(!api.http(q,s)){s.writeHead(404);s.end();}});api.attach(server);await new Promise(r=>server.listen(0,'127.0.0.1',r));const ws=new WS('ws://127.0.0.1:'+server.address().port+'/v6ws'),pending=new Map();let sequence=0;
  const req=m=>new Promise((resolve,reject)=>{const r=++sequence,timer=setTimeout(()=>{pending.delete(r);reject(Error('ws-timeout'));},5000);pending.set(r,v=>{clearTimeout(timer);resolve(v);});ws.send(JSON.stringify({...m,r}));});
  const welcome=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('ws-connect')),5000);ws.on('error',reject);ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.t==='welcome'){clearTimeout(timer);resolve(m);}if(pending.has(m.r)){const f=pending.get(m.r);pending.delete(m.r);f(m);}});});
  try{await welcome;const id='pot'+Date.now().toString(36);eq((await req({t:'register',id,pw:'test-only-123'})).t,'auth_ok');await req({t:'load',sid:'a'.repeat(32)});const send=c=>req({t:'prologue',command:c});await send({op:'start'});let y=428.8;while(y>214){time+=100;y=Math.max(214,y-16);await send({op:'move',trace:[{x:416,y,dir:'u'}]});}await send({op:'talk'});await send({op:'claim'});let r=await send({op:'field'});for(let i=0;i<200&&r.actor.hp===100;i++){time+=100;r=await send({op:'input',mx:0,my:0,run:false});}ok(r.actor.hp<100&&r.actor.alive,'AIตีจริง');const cmd={op:'potion',encounterId:r.actor.encounterId,sequence:1};r=await send(cmd);ok(r.ok,r.error);eq(r.actor.hp,100);eq(r.profile.inventory.stacks.hpp,2);const retry=await send(cmd);ok(retry.ok,retry.error);eq(retry.profile.inventory.stacks.hpp,2);eq(retry.actor.hp,r.actor.hp);
  }finally{ws.terminate();api.stop();await new Promise(r=>server.close(r));}
 }],

];
