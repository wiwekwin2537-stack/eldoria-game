/* PLAY-P0 route + client controller + server trace · ไม่ใช่หลักฐาน render เบราว์เซอร์ */
import { createRequire } from 'node:module';
import { createPrologueClient } from '../src/core/prologue-client.js';
import { createState } from '../src/core/state.js';
import world,{enter} from '../src/systems/world.js';
import movement from '../src/systems/movement.js';
import { _reset } from '../src/core/bus.js';
import { PROLOGUE as P } from '../src/data/prologue.js';
const require=createRequire(import.meta.url),{createSaves}=require('../server/saves.cjs'),{memoryStore}=require('../server/store.cjs'),{createPrologue}=require('../server/prologue.cjs'),{createV6}=require('../server/index.cjs');
const ok=(v,m)=>{if(!v)throw new Error(m);},eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m+': '+JSON.stringify(a));
async function setup(){let clock=1e6;const saves=createSaves({store:memoryStore(),now:()=>clock}),conn={lid:'prologue-test',sid:'a'.repeat(32)},live=new Set([conn]);await saves.load(conn.lid,conn.sid);const runtime=await createPrologue({saves,now:()=>clock,isActive:c=>live.has(c)&&!!c.lid});const send=c=>runtime.handle(conn,c);return {saves,conn,live,runtime,send,advance:ms=>{clock+=ms;}};}
async function approach(t){let result=await t.send({op:'start'});let y=result.actor.y;while(y>214){t.advance(100);y=Math.max(214,y-16);result=await t.send({op:'move',trace:[{x:416,y,dir:'u'}]});ok(result.ok,'เดินถูกทาง '+result.error);}return result;}
export default [
 ['P0 startเกิดจากเซิร์ฟเวอร์ ไม่เชื่อตำแหน่ง/รางวัลที่clientส่ง; อยู่ไกลคุยไม่ได้',async()=>{
  const t=await setup(),r=await t.send({op:'start',scene:'field',x:416,y:200,coin:99999});eq(r.actor,{scene:P.scene,x:416,y:428.8,dir:'u'},'spawnเซิร์ฟเวอร์');eq((await t.send({op:'talk'})).error,'near','ไกล');eq((await t.send({op:'claim'})).error,'near','ห้ามรับของจากไกล');eq((await t.saves.readServer(t.conn.lid)).coin,0,'ไม่ให้เงิน');
 }],
 ['P0 traceห้ามวาร์ป/เดินทะลุกำแพง/เปลี่ยนscene/เพิ่มระยะด้วยclientเวลา',async()=>{
  const t=await setup();await t.send({op:'start'});const original={scene:P.scene,x:416,y:428.8,dir:'u'};
  eq((await t.send({op:'move',dt:999999,trace:[{x:416,y:214,dir:'u'}]})).error,'speed','ไม่ใช้dtclient');t.advance(1000);
  const wall=await t.send({op:'move',trace:[{x:352,y:460,dir:'u'}]});eq(wall.error,'wall','ชน');eq(wall.actor,original,'ทิ้งทั้งtrace');eq((await t.send({op:'move',trace:Array(P.traceMax+1).fill({x:416,y:428.8,dir:'u'})})).error,'trace','จำกัดจำนวน');
  const r=await t.send({op:'move',scene:'field',trace:[{x:416,y:420,dir:'u'}]});ok(r.ok,'เดินได้');eq(r.actor.scene,P.scene,'sceneไม่เปลี่ยน');
 }],
 ['P0 ส่งmoveถี่ไม่เพิ่มงบระยะทาง และdashไม่เติมเครดิตซ้ำก่อนcooldown',async()=>{
  const t=await setup();await t.send({op:'start'});ok((await t.send({op:'move',trace:[{x:416,y:420.8,dir:'u'}]})).ok,'เครดิต8');eq((await t.send({op:'move',trace:[{x:416,y:412.8,dir:'u'}]})).error,'speed','ไม่เพิ่มเครดิตตามจำนวนข้อความ');
  ok((await t.send({op:'move',dash:true,trace:[{x:416,y:380.8,dir:'u'}]})).ok,'dashเพิ่มครั้งเดียว');eq((await t.send({op:'move',dash:true,trace:[{x:416,y:350.8,dir:'u'}]})).error,'speed','cooldown');
 }],
 ['P0 เดินคุยและรับรางวัลจริงชุดแรก ส่งซ้ำและเริ่มใหม่ไม่แจกซ้ำ',async()=>{
  const t=await setup();await approach(t);eq((await t.send({op:'claim'})).error,'story-not-ready','ต้องคุยก่อน');const talk=await t.send({op:'talk'});ok(talk.ok&&talk.story.view.ready,'คุยจริงผ่านroute');
  const claimed=await t.send({op:'claim',coin:99999});ok(claimed.ok,'รับได้');eq(claimed.story.state.chapterId,'first-light','บทใหม่');eq(claimed.profile.coin,50,'เงิน50');eq(claimed.profile.inventory.stacks,{hpp:3,scroll:2},'ของใช้');const ids=Object.keys(claimed.profile.inventory.gear);eq(ids.length,3,'kit3ชิ้น');
  const duplicate=await t.send({op:'claim'});ok(duplicate.ok,'retry');eq(duplicate.profile.coin,50,'ไม่ซ้ำ');eq(Object.keys(duplicate.profile.inventory.gear),ids,'UIDเดิม');t.runtime.closed(t.conn);const resumed=await t.send({op:'start'});eq(resumed.story.state.chapterId,'first-light','เก็บความคืบหน้า');
 }],
 ['P0 sessionที่ถูกแทนที่/ปิดไปแล้วไม่ใช้proofเก่ารับรางวัล',async()=>{
  const t=await setup();await approach(t);await t.send({op:'talk'});await t.saves.load(t.conn.lid,'b'.repeat(32));eq((await t.send({op:'claim'})).error,'session','writerถูกแทนที่');eq((await t.saves.readServer(t.conn.lid)).coin,0,'ไม่ให้รางวัล');
  t.live.delete(t.conn);eq((await t.send({op:'start'})).error,'session','connectionไม่ใช่session');
 }],
 ['P0 clientเชื่อมrouteจริง: เริ่ม คุย รับของ closeและโหลดใหม่ใช้ข้อมูลserver',async()=>{
  const t=await setup();_reset();world._reset();const G=createState();world.init(G);const before=movement.save(G),request=async m=>({t:'prologue',...await t.send(m.command)}),C=createPrologueClient(G,{request,ready:()=>true,enter});
  ok(await C.start(),'เริ่ม');eq(G.scene.id,P.scene,'ห้องทดสอบ');ok(G.ui.prologueActive,'active');eq(movement.save(G),before,'เซฟยังใช้bookmarkเดิม');eq(world.save(G).scene,'town','เซฟฉากเมืองเดิม');
  while(G.player.y>214){t.advance(100);G.player.y=Math.max(214,G.player.y-16);C.sample();ok(await C.sync(),'sync');}ok(await C.talk(),'คุย');ok(C.state.dialog,'เปิดข้อความ');ok(await C.claim(),'รับชุด');eq(G.player.coin,50,'clientรับค่าจากserver');eq(C.state.profile.inventory.stacks.hpp,3,'ของจากprofile');
  C.end();eq(G.scene.id,'town','กลับbookmark');eq(movement.save(G).x,before.x,'ตำแหน่งเดิม');eq(G.ui.prologueActive,false,'ปิดโหมด');eq(G.player.coin,50,'เงินserverยังอยู่');
 }],
 ['P0 คำตอบมาช้าหลังdisconnectไม่วาร์ปผู้เล่นหรือเปลี่ยนเงิน/เปิดmodalกลับมา',async()=>{
  _reset();world._reset();const G=createState();world.init(G);const before=G.scene.id;let release;const C=createPrologueClient(G,{request:()=>new Promise(r=>{release=r;}),ready:()=>true,enter});const pending=C.start();C.disconnect();release({t:'prologue',ok:true,actor:{scene:P.scene,x:416,y:428.8,dir:'u'},story:{state:{chapterId:'awakening'}},profile:{coin:999}});eq(await pending,false,'ทิ้งคำตอบ');eq(G.scene.id,before,'ไม่วาร์ป');eq(G.player.coin,0,'ไม่เปลี่ยนเงิน');eq(C.state.mode,false,'ไม่เปิดโหมด');
 }],
 ['P0 เริ่มไม่สำเร็จต้องทิ้งbookmarkเก่า retryแล้วกลับตำแหน่งก่อนเข้าโหมดจริง',async()=>{
  const t=await setup();_reset();world._reset();const G=createState();world.init(G);let first=true;const C=createPrologueClient(G,{request:async m=>first?(first=false,{t:'prologue',ok:false,error:'busy'}):({t:'prologue',...await t.send(m.command)}),ready:()=>true,enter});
  eq(await C.start(),false,'ครั้งแรกล้มเหลว');enter('field',[5,7,'r'],G);ok(await C.start(),'retry');C.end();eq(G.scene.id,'field','กลับฉากล่าสุด');eq([G.player.x,G.player.y],[160,224],'ตำแหน่งล่าสุด');
 }],
 ['P0 WebSocketจริงผ่าน register/load/walk/talk/claim/retry โดยไม่ใช้transportจำลอง',async()=>{
  const http=require('node:http');let b;
  try{b=process.env.ELDORIA_TEST_WS_BUNDLE?require(process.env.ELDORIA_TEST_WS_BUNDLE):require('ws');}catch{throw new Error('ต้องมี ws เพื่อทดสอบการเชื่อมต่อจริง');}
  const WS=b.WebSocket||b.ws||b,WebSocketServer=b.WebSocketServer||b.wsServer;
  const api=createV6({store:memoryStore(),env:{V6_PROLOGUE_TEST:'1'},wsLib:{WebSocketServer},authTimeoutMs:0,log:()=>{}}),server=http.createServer((q,s)=>{if(!api.http(q,s)){s.writeHead(404);s.end();}});api.attach(server);
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const ws=new WS('ws://127.0.0.1:'+server.address().port+'/v6ws'),pending=new Map();let rid=0;
  const req=m=>new Promise((resolve,reject)=>{const r=++rid,t=setTimeout(()=>{pending.delete(r);reject(new Error('ws-timeout'));},5000);pending.set(r,x=>{clearTimeout(t);resolve(x);});ws.send(JSON.stringify({...m,r}));});
  const welcome=new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('ws-connect-timeout')),5000);ws.on('error',reject);ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.t==='welcome'){clearTimeout(t);resolve(m);}if(pending.has(m.r)){const f=pending.get(m.r);pending.delete(m.r);f(m);}});});
  try{ok((await welcome).features.prologue,'featureจริง');const id='p0'+Date.now().toString(36);eq((await req({t:'register',id,pw:'test-only-123'})).t,'auth_ok','สมัคร');await req({t:'load',sid:'a'.repeat(32)});let r=await req({t:'prologue',command:{op:'start'}}),y=r.actor.y;
    while(y>214){await new Promise(r=>setTimeout(r,110));y=Math.max(214,y-16);r=await req({t:'prologue',command:{op:'move',trace:[{x:416,y,dir:'u'}]}});ok(r.ok,'เดินจริง '+r.error);}
    ok((await req({t:'prologue',command:{op:'talk'}})).ok,'คุย');r=await req({t:'prologue',command:{op:'claim'}});ok(r.ok,'รับของ');eq(r.profile.coin,50,'เงินจริง');const ids=Object.keys(r.profile.inventory.gear);eq(ids.length,3,'kitจริง');const replay=await req({t:'prologue',command:{op:'claim'}});eq(replay.profile.coin,50,'ไม่ซ้ำ');eq(Object.keys(replay.profile.inventory.gear),ids,'UIDเดิม');
  }finally{ws.terminate();api.stop();await new Promise(r=>server.close(r));}
 }],
 ['P0 โหมดปิดค่าเริ่มต้น และเปิดเฉพาะstorageทดสอบในcreateV6',async()=>{
  const api=createV6({store:memoryStore(),env:{},authTimeoutMs:0,log:()=>{}}),out=[],conn={ip:'127.0.0.1',send:m=>out.push(m),close(){}};try{api.proto.open(conn);eq(out[0].features,undefined,'ไม่โฆษณาfeature');conn.lid='test';await api.proto.message(conn,JSON.stringify({t:'prologue',command:{op:'start'}}));eq(out.at(-1).error,'unavailable','ไม่เปิดrouteจริง');}finally{api.proto.closed(conn);api.stop();}
  let threw=false;try{createV6({store:{kind:'upstash'},env:{V6_PROLOGUE_TEST:'1'},log:()=>{}});}catch{threw=true;}ok(threw,'ไม่เปิดทดลองกับremote storage');
 }],
];
