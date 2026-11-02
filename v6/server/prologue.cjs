/* PLAY-P0 โหมดทดสอบบทนำในห้องแยก: ปิดค่าเริ่มต้น ไม่ใช้เป็น authority ต่อสู้ทั้งเกม
   pose เริ่มจาก spawn เซิร์ฟเวอร์ ไม่อ่าน systems.movement จาก client; trace ผ่านขอบเขตเวลาเซิร์ฟเวอร์และช่องชน
   route รับแค่ start/move/talk/claim ไม่มีทางส่ง kill/reward/scene ตามใจ */
const { randomUUID, createHash } = require('crypto');
const { createEldoriaStoryService } = require('./story-rewards.cjs');
async function createPrologue({ saves, now=()=>Date.now(), isActive=()=>false }={}) {
  const [{PROLOGUE:P},{MOVE,DASH},{getMap,hit},{T}] = await Promise.all([import('../src/data/prologue.js'),import('../src/data/movement.js'),import('../src/systems/world.js'),import('../src/config.js')]);
  const map=getMap(P.scene), actors=new WeakMap(), proofs=new Map();
  const fail=code=>{const e=new Error(code);e.code=code;throw e;};
  const near=a=>Math.hypot(a.x-P.king.x,a.y-P.king.y)<P.king.range&&a.y>P.king.minY;
  const current=conn=>{const a=actors.get(conn);return a&&a.lid===conn.lid&&a.sid===conn.sid?a:null;};
  function valid({lid,ticket}) { const a=proofs.get(ticket);return a&&a.lid===lid&&now()-a.issued<=P.proofMs&&current(a.conn)===a&&isActive(a.conn)&&near(a)?a:null; }
  const service=await createEldoriaStoryService({saves,storageMode:'single-writer',verifyEvidence:ctx=>{
    const a=valid(ctx);return a?{id:a.ticket,chapterId:'awakening',kind:'talk',target:'king'}:false;
  },verifyReport:ctx=>valid(ctx)?{chapterId:'awakening',npc:'king'}:false});
  function closed(conn) { const a=actors.get(conn);if(a?.ticket)proofs.delete(a.ticket);actors.delete(conn); }
  function actor(conn) {
    let a=current(conn);if(!a){closed(conn);a={conn,lid:conn.lid,sid:conn.sid,x:P.spawn[0]*T,y:P.spawn[1]*T,dir:P.spawn[2],at:now(),budget:P.initialCredit,dashAt:-1e15,ticket:null};actors.set(conn,a);}return a;
  }
  const pose=a=>({scene:P.scene,x:a.x,y:a.y,dir:a.dir});
  function issue(a) {if(a.ticket)proofs.delete(a.ticket);a.ticket=randomUUID();a.issued=now();proofs.set(a.ticket,a);return a.ticket;}
  function move(a,command) {
    if(!Array.isArray(command.trace)||command.trace.length>P.traceMax)fail('trace');
    const time=now(),elapsed=Math.max(0,Math.min(P.creditMs,time-a.at));let credit=Math.min(MOVE.run*P.creditMs/1000+P.initialCredit,a.budget+MOVE.run*elapsed/1000),dashAt=a.dashAt;
    if(command.dash===true&&time-dashAt>=DASH.cd*1000){credit+=(DASH.speed-MOVE.run)*DASH.time;dashAt=time;}
    let x=a.x,y=a.y,dir=a.dir;
    for(const p of command.trace){
      if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.y<0||p.x>=map.w*T||p.y>=map.h*T||!['u','d','l','r'].includes(p.dir))fail('position');
      const distance=Math.hypot(p.x-x,p.y-y);credit-=distance;if(credit<-.01)fail('speed');
      const steps=Math.max(1,Math.ceil(distance/MOVE.step));for(let i=1;i<=steps;i++)if(hit(x+(p.x-x)*i/steps,y+(p.y-y)*i/steps,null,map))fail('wall');
      x=p.x;y=p.y;dir=p.dir;
    }
    Object.assign(a,{x,y,dir,budget:Math.max(0,credit),at:time,dashAt});
  }
  async function state(lid) { const [story,profile]=await Promise.all([service.read(lid),saves.readServer(lid)]);return {story,profile:{coin:profile.coin,character:profile.character||null,inventory:profile.inventory||null}}; }
  async function handle(conn,command) {
    if(!conn.lid||!conn.sid||!isActive(conn))return {ok:false,error:'session'};
    const lid=conn.lid;if(!await saves.claim(lid,conn.sid,()=>isActive(conn)))return {ok:false,error:'session'};
    if(!command||typeof command!=='object'||Array.isArray(command))return {ok:false,error:'command'};
    let a=current(conn);
    try {
      if(command.op==='start'){a=actor(conn);return {ok:true,actor:pose(a),...await state(lid)};}
      if(!a)fail('start');
      if(command.op==='move'){move(a,command);return {ok:true,actor:pose(a)};}
      if(command.op==='talk'){
        if(!near(a))fail('near');const s=await service.read(lid);
        if(s.state.chapterId==='awakening'&&!s.view.ready)await service.record(lid,issue(a));
        return {ok:true,actor:pose(a),...await state(lid)};
      }
      if(command.op==='claim'){
        const s=await service.read(lid);
        if(s.state.chapterId==='awakening'&&!near(a))fail('near');
        const receipt=await service.report(lid,{chapterId:'awakening',requestId:createHash('sha256').update('eld6:prologue:'+lid).digest('hex'),ticket:issue(a)});
        return {ok:true,actor:pose(a),receipt:receipt.receipt,...await state(lid)};
      }
      if(command.op==='end'){closed(conn);return {ok:true};}
      fail('command');
    }catch(e){return {ok:false,error:e.code||e.message||'server',...(a?{actor:pose(a)}:{})};}
  }
  return {handle,closed};
}
module.exports={createPrologue};
