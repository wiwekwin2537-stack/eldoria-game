/* PLAY-E2d นาฬิกาและtimerของserver: ไม่ใช้browser/ทัช */
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{createFixedStep}=require('../server/fixed-step.cjs'),{createPrologue}=require('../server/prologue.cjs'),{createSaves}=require('../server/saves.cjs'),{memoryStore}=require('../server/store.cjs'),{createV6}=require('../server/index.cjs');
const ok=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),(m||'เท่ากัน')+': '+JSON.stringify(a));
const clock=start=>createFixedStep({start,stepMs:20,maxSteps:10});
const takeAll=(c,t)=>{const out=[];let tick;while((tick=c.take(t)))out.push(tick);return out;};
async function setup(){let time=100000;const saves=createSaves({store:memoryStore(),now:()=>time}),conn={lid:'clock-test',sid:'a'.repeat(32)};await saves.load(conn.lid,conn.sid);const live=new Set([conn]),p=await createPrologue({saves,now:()=>time,isActive:c=>live.has(c)}),send=c=>p.handle(conn,c);await send({op:'start'});let y=428.8;while(y>214){time+=100;y=Math.max(214,y-16);ok((await send({op:'move',trace:[{x:416,y,dir:'u'}]})).ok,'king');}await send({op:'talk'});await send({op:'claim'});const first=await send({op:'field'});ok(first.ok,first.error);return {saves,conn,p,send,first,live,now:()=>time,advance:n=>{time+=n;}};}
export default [
 ['E2d regression storageของAค้างไม่หยุดtimerของBที่คิวว่าง',async()=>{
  const t=await setup(),b={lid:'clock-second',sid:'b'.repeat(32)};t.live.add(b);await t.saves.load(b.lid,b.sid);const send=c=>t.p.handle(b,c);await send({op:'start'});let y=428.8;while(y>214){t.advance(100);y=Math.max(214,y-16);await send({op:'move',trace:[{x:416,y,dir:'u'}]});}await send({op:'talk'});await send({op:'claim'});await send({op:'field'});await t.p.tick();
  const original=t.saves.claim;let release;const held=new Promise(r=>{release=r;});t.saves.claim=(lid,...args)=>lid===t.conn.lid?held.then(()=>original(lid,...args)):original(lid,...args);t.advance(20);const first=t.p.tick();const before=await send({op:'start'});t.advance(100);const next=t.p.tick();const after=await send({op:'start'});const changed=JSON.stringify(before.battle.entities.map(m=>m.phase))!==JSON.stringify(after.battle.entities.map(m=>m.phase));t.saves.claim=original;release();await first;await next;t.p.stop();ok(changed,'Bต้องเดินต่อแม้Aค้าง');
 }],
 ['E2d regression storageช้าก่อนcommitท่าฟันต้องใช้เวลาสด ไม่เสียแรงกับwindowที่หมดไปแล้ว',async()=>{
  const t=await setup(),original=t.saves.claim;let calls=0;t.saves.claim=async(...args)=>{if(++calls===3)t.advance(1000);return original(...args);};const r=await t.send({op:'attack',sequence:1});t.saves.claim=original;ok(r.ok,r.error);eq(r.battle.swing.start,t.now(),'เริ่มเมื่อcommitหลังawait');t.advance(20);await t.p.tick();const after=await t.send({op:'start'});ok(after.battle.swing,'ท่ายังไม่หมดทันที');t.p.stop();
 }],
 ['E2d fixed-step20ms remainderไม่หายและviewไม่เปิดให้แก้นาฬิกา',()=>{
  const c=clock(100);eq(c.take(119),null);eq(c.take(120),{at:120,dt:.02,skippedMs:0});eq(c.take(139),null);eq(c.take(140).at,140);const v=c.view();v.through=999;eq(c.view().through,140);
 }],
 ['E2d jitter/ส่งถี่ต่างกันให้จำนวนก้าวและเวลาจำลองเท่ากัน',()=>{
  const a=clock(0),b=clock(0),one=[],two=[];for(let t=0;t<=200;t+=5)one.push(...takeAll(a,t));for(const t of [0,33,91,146,200])two.push(...takeAll(b,t));eq(one,two);eq(one.length,10);
 }],
 ['E2d backlogเกิน200msทิ้งช่วงเก่า จำกัด10ก้าว ไม่ตามย้อนหลังไม่สิ้นสุด',()=>{
  const c=clock(0),ticks=takeAll(c,10000);eq(ticks.length,10);eq(ticks[0].at,9820);eq(ticks.at(-1).at,10000);eq(c.view().droppedMs,9800);eq(c.take(10000),null);
 }],
 ['E2d เวลาถอย/ผิดไม่ทำให้เดินย้อนหรือสร้างtickซ้ำ',()=>{
  const c=clock(0);eq(c.take(40).at,20);eq(c.take(30),null);eq(c.take(40).at,40);const before=c.view();for(const t of [NaN,Infinity]){let threw=false;try{c.take(t);}catch{threw=true;}ok(threw,'เวลาเสีย');eq(c.view(),before);}eq(c.take(0),null);
 }],
 ['E2d tickถูกconsumeก่อนdispatch errorจึงไม่จำลองเวลาเดิมซ้ำ',()=>{
  const c=clock(0);eq(c.take(20).at,20);/* dispatch/storageพังหลังนำtickไปใช้ */eq(c.take(20),null);eq(c.take(40).at,40);c.skipBefore(105);eq(c.view().through,100);eq(c.take(120).at,120);
 }],
 ['E2d configผิดเปิดนาฬิกาไม่ได้',()=>{
  for(const cfg of [{start:NaN,stepMs:20,maxSteps:10},{start:0,stepMs:0,maxSteps:10},{start:0,stepMs:20,maxSteps:0},{start:0,stepMs:1.2,maxSteps:10}]){let threw=false;try{createFixedStep(cfg);}catch{threw=true;}ok(threw,'config');}
 }],
 ['E2d runtime tickเองโดยไม่มีinput มอนเดิน/สวนและleaseหยุดวิ่ง',async()=>{
  const t=await setup();await t.send({op:'input',mx:1,my:0,run:true});for(let i=0;i<15;i++){t.advance(20);await t.p.tick();}let r=await t.send({op:'start'});eq(r.actor.moving,false,'leaseหมด');eq(r.actor.running,false);for(let i=0;i<300;i++){t.advance(20);await t.p.tick();}r=await t.send({op:'start'});ok(r.battle.entities.some((m,i)=>m.x!==t.first.battle.entities[i].x||m.y!==t.first.battle.entities[i].y),'มอนไม่รอinput');ok(r.actor.hp<100,'สวนเอง');t.p.stop();
 }],
 ['E2d tick/ข้อความรัวที่เวลาเดิมไม่เร่งAI เลิกfield/stopไม่ทิ้งactorเดินต่อ',async()=>{
  const t=await setup();t.advance(20);await t.p.tick();const before=await t.send({op:'start'});for(let i=0;i<25;i++)await t.p.tick();const after=await t.send({op:'start'});eq(after.actor,before.actor);eq(after.battle,before.battle);await t.send({op:'hall'});t.advance(1000);await t.p.tick();eq((await t.send({op:'start'})).actor.scene,'shop.hall');t.p.stop();eq((await t.send({op:'start'})).error,'unavailable');await t.p.tick();
 }],
 ['E2d pumpช้าไม่มีtimerงานซ้อนหรือคิวสะสม',async()=>{
  const t=await setup(),original=t.saves.claim;let release,calls=0;t.saves.claim=()=>new Promise(r=>{calls++;release=()=>r(true);});t.advance(20);const a=t.p.tick(),b=t.p.tick();while(!release)await Promise.resolve();eq(calls,1,'ไม่เพิ่มงานซ้อน');t.saves.claim=original;release();await a;await b;await t.p.tick();t.p.stop();
 }],
 ['E2d createV6 timerทำงานจริงแม้WSหยุดส่งinput และstopปิดได้',async()=>{
  const http=require('node:http'),lib=process.env.ELDORIA_TEST_WS_BUNDLE?require(process.env.ELDORIA_TEST_WS_BUNDLE):require('ws'),WS=lib.WebSocket||lib.ws||lib,WebSocketServer=lib.WebSocketServer||lib.wsServer;let time=1e6;
  const api=createV6({store:memoryStore(),env:{V6_PROLOGUE_TEST:'1'},now:()=>time,wsLib:{WebSocketServer},authTimeoutMs:0,log:()=>{}}),server=http.createServer((q,s)=>{if(!api.http(q,s)){s.writeHead(404);s.end();}});api.attach(server);await new Promise(r=>server.listen(0,'127.0.0.1',r));const ws=new WS('ws://127.0.0.1:'+server.address().port+'/v6ws'),pending=new Map();let sequence=0;
  const req=m=>new Promise((resolve,reject)=>{const r=++sequence,timer=setTimeout(()=>{pending.delete(r);reject(Error('ws-timeout'));},5000);pending.set(r,v=>{clearTimeout(timer);resolve(v);});ws.send(JSON.stringify({...m,r}));});
  const welcome=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('ws-connect')),5000);ws.on('error',reject);ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.t==='welcome'){clearTimeout(timer);resolve(m);}if(pending.has(m.r)){const f=pending.get(m.r);pending.delete(m.r);f(m);}});});
  try{await welcome;const id='clk'+Date.now().toString(36);eq((await req({t:'register',id,pw:'test-only-123'})).t,'auth_ok');await req({t:'load',sid:'a'.repeat(32)});const send=c=>req({t:'prologue',command:c});await send({op:'start'});let y=428.8;while(y>214){time+=100;y=Math.max(214,y-16);await send({op:'move',trace:[{x:416,y,dir:'u'}]});}await send({op:'talk'});await send({op:'claim'});const first=await send({op:'field'});ok(first.ok,first.error);time+=100;
   /* ไม่มีinput/attack; startอ่านsnapshotโดยไม่pump จึงพิสูจน์timerจริง */
   await new Promise(r=>setTimeout(r,80));const r=await send({op:'start'});ok(r.battle.entities.some(m=>m.phase!==0),'timerทำงาน');await send({op:'end'});
  }finally{ws.terminate();api.stop();await new Promise(r=>server.close(r));}
 }],
];
