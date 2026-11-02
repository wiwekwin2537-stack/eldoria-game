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
async function hunt(t,r){for(let n=0;n<8;n++){const m=r.battle.entities.find(x=>!x.dead);if(!m)break;let guard=0;
  while(Math.hypot(r.actor.x-m.x,r.actor.y-(m.y+16))>8){ok(++guard<100,'เดินไม่ติด');const dx=m.x-r.actor.x,dy=m.y+16-r.actor.y,l=Math.max(1,Math.hypot(dx,dy));t.advance(100);r=await t.send({op:'input',mx:dx/l,my:dy/l,run:false});ok(r.ok,r.error);}
  await t.send({op:'input',mx:0,my:-1,run:false});t.advance(1);r=await t.send({op:'input',mx:0,my:0,run:false});
  for(let k=0;k<3&&!r.battle.entities.find(x=>x.id===m.id).dead;k++){r=await t.send({op:'attack',sequence:r.battle.sequence+1});ok(r.ok,'attack '+r.error);for(let j=0;j<8;j++){t.advance(100);r=await t.send({op:'input',mx:0,my:0,run:false});ok(r.ok,'step '+r.error);}}
 }return r;}
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
 ['E2b WebSocketจริงทั้งวงจรinput/ฟัน/ledger/ส่งบท1 ไม่ใช้transportจำลอง',async()=>{
  const http=require('node:http'),lib=process.env.ELDORIA_TEST_WS_BUNDLE?require(process.env.ELDORIA_TEST_WS_BUNDLE):require('ws'),WS=lib.WebSocket||lib.ws||lib,WebSocketServer=lib.WebSocketServer||lib.wsServer;let clock=1e6;
  const api=createV6({store:memoryStore(),env:{V6_PROLOGUE_TEST:'1'},now:()=>clock,wsLib:{WebSocketServer},authTimeoutMs:0,log:()=>{}}),server=http.createServer((q,s)=>{if(!api.http(q,s)){s.writeHead(404);s.end();}});api.attach(server);await new Promise(r=>server.listen(0,'127.0.0.1',r));const ws=new WS('ws://127.0.0.1:'+server.address().port+'/v6ws'),pending=new Map();let seq=0;
  const req=m=>new Promise((resolve,reject)=>{const r=++seq,t=setTimeout(()=>{pending.delete(r);reject(Error('ws-timeout'));},5000);pending.set(r,x=>{clearTimeout(t);resolve(x);});ws.send(JSON.stringify({...m,r}));});
  const welcome=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('connect-timeout')),5000);ws.on('error',reject);ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.t==='welcome'){clearTimeout(timer);resolve(m);}if(pending.has(m.r)){const f=pending.get(m.r);pending.delete(m.r);f(m);}});});
  try{await welcome;const id='e2b'+Date.now().toString(36);eq((await req({t:'register',id,pw:'test-only-123'})).t,'auth_ok');await req({t:'load',sid:'a'.repeat(32)});const t={send:c=>req({t:'prologue',command:c}),advance:n=>{clock+=n;}};let r=await intro(t);r=await hunt(t,r);eq(r.story.view.progress,[8]);await t.send({op:'hall'});await king(t);r=await t.send({op:'claim-first-light'});ok(r.ok,r.error);eq(r.profile.coin,170);eq((await t.send({op:'claim-first-light'})).profile.coin,170);eq((await api.saves.readServer(id)).storyLedger.state.chapterId,'own-blade');
  }finally{ws.terminate();api.stop();await new Promise(r=>server.close(r));}
 }],
];
