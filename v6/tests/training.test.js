/* PLAY-E2b actual server authority + route/controller. Browser QAแยกต่างหาก */
import {createRequire} from 'node:module';
import {createPrologueClient} from '../src/core/prologue-client.js';
import {createState} from '../src/core/state.js';
import world,{enter} from '../src/systems/world.js';
import movement from '../src/systems/movement.js';
import {_reset} from '../src/core/bus.js';
const require=createRequire(import.meta.url),{createPrologue}=require('../server/prologue.cjs'),{createSaves}=require('../server/saves.cjs'),{memoryStore}=require('../server/store.cjs'),{createV6}=require('../server/index.cjs');
const ok=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),(m||'เท่ากัน')+': '+JSON.stringify(a));
async function setup(){let clock=100000,live=true;const store=memoryStore(),saves=createSaves({store,now:()=>clock}),conn={lid:'training-test',sid:'a'.repeat(32)};await saves.load(conn.lid,conn.sid);const p=await createPrologue({saves,now:()=>clock,isActive:()=>live});const send=c=>p.handle(conn,c);return {send,saves,store,conn,p,advance:n=>{clock+=n;},deactivate:()=>{live=false;}};}
async function king(t){let r=await t.send({op:'start'}),y=r.actor.y;while(y>214){t.advance(100);y=Math.max(214,y-16);r=await t.send({op:'move',trace:[{x:416,y,dir:'u'}]});ok(r.ok,r.error);}return r;}
async function intro(t){await king(t);ok((await t.send({op:'talk'})).ok,'talk');ok((await t.send({op:'claim'})).ok,'claim0');return t.send({op:'field'});}
async function hunt(t,r){let trips=0;for(let tick=0;tick<1800;tick++){
  if(r.story.view.progress[0]>=8)return r;
  if(!r.actor.alive){ok(++trips<12,'ล้มซ้ำเกินขอบเขตทดสอบ');await t.send({op:'hall'});await king(t);r=await t.send({op:'field'});ok(r.ok,r.error);continue;}
  const mobs=r.battle.entities.filter(m=>!m.dead&&!m.pending);const m=mobs.sort((a,b)=>Math.hypot(a.x-r.actor.x,a.y-r.actor.y)-Math.hypot(b.x-r.actor.x,b.y-r.actor.y))[0];ok(m,'มีเป้า');
  const dx=m.x-r.actor.x,dy=m.y-r.actor.y,d=Math.hypot(dx,dy),moving=d>26;t.advance(80);r=await t.send({op:'input',mx:moving?dx/Math.max(1,d):0,my:moving?dy/Math.max(1,d):0,run:false});ok(r.ok,r.error);
  if(r.actor.alive&&!r.actor.stunned&&!r.battle.swing&&Math.hypot(m.x-r.actor.x,m.y-r.actor.y)<52){const hit=await t.send({op:'attack',sequence:r.battle.sequence+1});if(hit.ok)r=hit;else ok(hit.error==='combat-actor'||hit.error==='combat-chapter','attack '+hit.error);}
 }throw Error('ล่าสไลม์เคลื่อนไหวไม่ครบ8');}
export default [
 ['E2b regression ยืนนิ่งกดวิ่งค้างไม่เสียแรง',async()=>{
  const t=await setup();await intro(t);await t.send({op:'input',mx:0,my:0,run:true});t.advance(100);const r=await t.send({op:'input',mx:0,my:0,run:true});eq(r.actor.moving,false);eq(r.actor.sp,100,'ยืนนิ่งไม่หักแรง');
 }],
 ['E2b ก่อนรับบทนำ/ไกลราชาเข้าลานไม่ได้; inputไม่รับวาร์ปหรือclientdt/sp/damage',async()=>{
  const t=await setup();eq((await t.send({op:'field'})).error,'start');await t.send({op:'start'});eq((await t.send({op:'field'})).error,'near');await king(t);eq((await t.send({op:'field'})).error,'combat-chapter');const r=await intro(t);ok(r.ok,r.error);const before=r.actor;
  eq((await t.send({op:'input',mx:99,my:0,run:true})).error,'training-input');const x=await t.send({op:'input',mx:0,my:0,run:false,x:999,y:999,dt:999,sp:999,damage:999});eq([x.actor.x,x.actor.y,x.actor.sp],[before.x,before.y,100]);eq((await t.send({op:'move',trace:[{x:416,y:214,dir:'u'}]})).error,'training-active');eq((await t.send({op:'claim-first-light'})).error,'training-active');
 }],
 ['E2b เวลาจากserver ข้อความรัวไม่เพิ่มระยะ; inputหมดอายุไม่เดินย้อนหลังและชนขอบลาน',async()=>{
  const t=await setup(),r=await intro(t);await t.send({op:'input',mx:1,my:0,run:true});for(let i=0;i<20;i++)await t.send({op:'input',mx:1,my:0,run:true});let s=await t.send({op:'input',mx:1,my:0,run:true});eq(s.actor.x,r.actor.x,'รัวไม่เดิน');t.advance(100);s=await t.send({op:'input',mx:1,my:0,run:true});eq(Math.round(s.actor.x-r.actor.x),17);ok(s.actor.sp<100,'วิ่งเสียแรง');t.advance(10000);const old=s.actor.x;s=await t.send({op:'input',mx:1,my:0,run:true});eq(s.actor.x,old,'หมดlease');for(let i=0;i<100;i++){t.advance(100);s=await t.send({op:'input',mx:1,my:0,run:true});}ok(s.actor.x<=s.actor.bounds.x+s.actor.bounds.radius,'ขอบ');
 }],
 ['E2b เดิน/ฆ่า8/กลับราชา/รับstory1/retry/โหลดใหม่ครบจากroute ไม่มีkillfixture',async()=>{
  const t=await setup();let r=await intro(t);r=await hunt(t,r);eq(r.story.view.progress,[8]);ok(r.story.view.ready,'ครบ');ok((await t.send({op:'hall'})).ok,'กลับ');eq((await t.send({op:'claim-first-light'})).error,'near','กลับมาไกล');await king(t);await t.send({op:'talk'});r=await t.send({op:'claim-first-light',coin:99999});ok(r.ok,r.error);eq(r.profile.coin,170);eq(r.profile.inventory.stacks.mpp,2);eq(r.story.state.chapterId,'own-blade');eq((await t.send({op:'claim-first-light'})).profile.coin,170);eq((await t.send({op:'field'})).error,'combat-chapter');t.p.closed(t.conn);eq((await t.send({op:'start'})).story.state.chapterId,'own-blade');
 }],
 ['E2b clientcontrollerรับposefieldจากserver หยุดmovementclient/เซฟbookmark/หลุดแล้วคืนเดิม',async()=>{
  const t=await setup();await intro(t);await t.send({op:'hall'});_reset();world._reset();const G=createState();world.init(G);const before=movement.save(G);const c=createPrologueClient(G,{request:async m=>({t:'prologue',...await t.send(m.command)}),ready:()=>true,enter});ok(await c.start(),'resume');
  while(c.state.pose.y>214){G.player.y=Math.max(214,c.state.pose.y-16);t.advance(100);c.sample();await c.sync();}ok(await c.talk(),'king');ok(await c.field(),'field');eq(G.scene.id,'field');ok(G.ui.prologueField,'authorityflag');eq(movement.save(G).x,before.x,'bookmark');const x=G.player.x;G.input.mx=1;movement.update(G,.1);eq(G.player.x,x,'movementไม่เขียน');t.advance(100);await c.sync();t.advance(100);await c.sync();ok(G.player.x>x,'serverเดิน');c.disconnect();eq(G.scene.id,'town');eq([G.player.x,G.player.y,G.player.sp],[before.x,before.y,before.sp]);eq(G.ui.prologueField,false);
 }],
 ['E2b fieldซ้ำไม่respawn และsessionเก่าคุมactorไม่ได้',async()=>{
  const t=await setup(),r=await intro(t);eq((await t.send({op:'field'})).battle.entities.map(x=>x.id),r.battle.entities.map(x=>x.id));await t.saves.load(t.conn.lid,'b'.repeat(32));eq((await t.send({op:'input',mx:1,my:0,run:true})).error,'session');eq((await t.send({op:'attack',sequence:1})).error,'session');
 }],
 ['E2b คำตอบเข้าfieldมาช้าหลังdisconnectไม่เปิดflagหรือวาร์ปกลับ',async()=>{
  const t=await setup();await intro(t);await t.send({op:'hall'});await king(t);_reset();world._reset();const G=createState();world.init(G);let release;const c=createPrologueClient(G,{request:async m=>m.command.op==='field'?new Promise(r=>{release=r;}):({t:'prologue',...await t.send(m.command)}),ready:()=>true,enter});await c.start();while(c.state.pose.y>214){G.player.y=Math.max(214,c.state.pose.y-16);t.advance(100);c.sample();await c.sync();}const pending=c.field();while(!release)await Promise.resolve();c.disconnect();release({t:'prologue',...await t.send({op:'field'})});eq(await pending,false);eq(G.scene.id,'town');eq(G.ui.prologueField,false);eq(c.state.mode,false);
 }],
 ['E2c AIไล่และสวนจริง เลือด0หยุดเดิน/ฟัน กลับhallได้โดยไม่เสียเงินหรือเสกของ',async()=>{
  const t=await setup();let r=await intro(t),moved=false,hurt=false;const first=r.battle.entities.map(m=>[m.x,m.y]);for(let i=0;i<1600&&r.actor.alive;i++){t.advance(120);r=await t.send({op:'input',mx:0,my:0,run:false,hp:99999,alive:true});ok(r.ok,r.error);if(r.actor.hp<100)hurt=true;if(JSON.stringify(r.battle.entities.map(m=>[m.x,m.y]))!==JSON.stringify(first))moved=true;}ok(moved&&hurt,'AIเดินและสวน');eq(r.actor.hp,0);eq(r.actor.alive,false);const at=[r.actor.x,r.actor.y];eq((await t.send({op:'attack',sequence:r.battle.sequence+1})).error,'combat-actor');t.advance(100);const still=await t.send({op:'input',mx:1,my:1,run:true,hp:100});eq(still.actor.hp,0);eq([still.actor.x,still.actor.y],at,'ล้มไม่เดิน');ok((await t.send({op:'hall'})).ok,'กลับhallได้');const profile=await t.saves.readServer(t.conn.lid);eq(profile.coin,50);eq(profile.character.xp,20);eq(Object.keys(profile.inventory.gear).length,3);
 }],
 ['E2c clientHPมาจากserverและออก/หลุดคืนHPปกติ ไม่เซฟเลือดลานทับ',async()=>{
  const t=await setup();await intro(t);await t.send({op:'hall'});_reset();world._reset();const G=createState();world.init(G);G.player.hp=63;G.player.maxHp=111;const c=createPrologueClient(G,{request:async m=>({t:'prologue',...await t.send(m.command)}),ready:()=>true,enter});await c.start();while(c.state.pose.y>214){G.player.y=Math.max(214,c.state.pose.y-16);t.advance(100);c.sample();await c.sync();}await c.field();eq([G.player.hp,G.player.maxHp],[100,100]);for(let i=0;i<100&&G.player.hp===100;i++){t.advance(120);await c.sync();}ok(G.player.hp<100,'รับเลือดที่serverหัก');eq(G.player.hp,c.state.pose.hp);await c.hall();eq([G.player.hp,G.player.maxHp],[63,111],'กลับhallคืนปกติ');c.disconnect();eq([G.player.hp,G.player.maxHp],[63,111],'หลุดคืนเดิม');eq(G.scene.id,'town');
 }],
 ['E2b WebSocketจริงทั้งวงจรinput/ฟัน/ledger/ส่งบท1 ไม่ใช้transportจำลอง',async()=>{
  const http=require('node:http'),lib=process.env.ELDORIA_TEST_WS_BUNDLE?require(process.env.ELDORIA_TEST_WS_BUNDLE):require('ws'),WS=lib.WebSocket||lib.ws||lib,WebSocketServer=lib.WebSocketServer||lib.wsServer;let clock=1e6;
  const api=createV6({store:memoryStore(),env:{V6_PROLOGUE_TEST:'1'},now:()=>clock,wsLib:{WebSocketServer},authTimeoutMs:0,log:()=>{}}),server=http.createServer((q,s)=>{if(!api.http(q,s)){s.writeHead(404);s.end();}});api.attach(server);await new Promise(r=>server.listen(0,'127.0.0.1',r));const ws=new WS('ws://127.0.0.1:'+server.address().port+'/v6ws'),pending=new Map();let seq=0;
  const req=m=>new Promise((resolve,reject)=>{const r=++seq,t=setTimeout(()=>{pending.delete(r);reject(Error('ws-timeout'));},5000);pending.set(r,x=>{clearTimeout(t);resolve(x);});ws.send(JSON.stringify({...m,r}));});
  const welcome=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('connect-timeout')),5000);ws.on('error',reject);ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.t==='welcome'){clearTimeout(timer);resolve(m);}if(pending.has(m.r)){const f=pending.get(m.r);pending.delete(m.r);f(m);}});});
  try{await welcome;const id='e2b'+Date.now().toString(36);eq((await req({t:'register',id,pw:'test-only-123'})).t,'auth_ok');await req({t:'load',sid:'a'.repeat(32)});const t={send:c=>req({t:'prologue',command:c}),advance:n=>{clock+=n;}};let r=await intro(t);r=await hunt(t,r);eq(r.story.view.progress,[8]);await t.send({op:'hall'});await king(t);r=await t.send({op:'claim-first-light'});ok(r.ok,r.error);eq(r.profile.coin,170);eq((await t.send({op:'claim-first-light'})).profile.coin,170);eq((await api.saves.readServer(id)).storyLedger.state.chapterId,'own-blade');
  }finally{ws.terminate();api.stop();await new Promise(r=>server.close(r));}
 }],
];
