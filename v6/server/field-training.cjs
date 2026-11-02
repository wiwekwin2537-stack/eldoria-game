/* PLAY-E2b โหมดทดสอบเท่านั้น สไลม์ไล่/สวนกลับ มีHP/ล้ม แต่ไม่มีดรอป/XPมอน
   clientส่งmx/my/runเท่านั้น ไม่รับพิกัด/เวลา/แรง/damage; serverเดินบนพื้นที่clearที่เลือกเอง
   เวลาเดินเป็นfixed-step20msจากserverและinputมีlease ไม่เดินย้อนหลังหลังขาดการเชื่อมต่อ
   คำสั่งและtimerเรียกผ่านคิวprologueเดียวต่อconnectionเท่านั้น */
const {randomUUID}=require('crypto');
const {createPotions}=require('./potions.cjs');
const {createFixedStep}=require('./fixed-step.cjs');
const {createSlimeSimulation}=require('./slime-ai.cjs');
const {createFieldCombat}=require('./field-combat.cjs');
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
async function createFieldTraining({saves,now,isActive}){
 const [{TRAINING:C,TRAINING_CLOCK:K},{MOVE,STAMINA},{getMap,hit,tileAt},{T}]=await Promise.all([import('../src/data/prologue.js'),import('../src/data/movement.js'),import('../src/systems/world.js'),import('../src/config.js')]);
 const map=getMap('field'),actors=new WeakMap();let center=null;
 for(let y=C.radius+T;y<map.h*T-C.radius-T&&!center;y+=T)for(let x=C.radius+T;x<map.w*T-C.radius-T&&!center;x+=T){let clear=true;
  for(let dy=-C.radius;dy<=C.radius&&clear;dy+=MOVE.step)for(let dx=-C.radius;dx<=C.radius;dx+=MOVE.step)if(hit(x+dx,y+dy,null,map)||!['.','t','G','W'].includes(tileAt(Math.floor((x+dx)/T),Math.floor((y+dy)/T),map))){clear=false;break;}
  if(clear)center={x,y};
 }if(!center)fail('training-ground');
 const bounds={...center,radius:C.radius},simulation=await createSlimeSimulation({blocked:(x,y)=>hit(x,y,null,map)});
 const current=conn=>{const a=actors.get(conn);if(!a||a.lid!==conn.lid||a.sid!==conn.sid||!isActive(conn))fail('combat-session');return a;};
 const combat=await createFieldCombat({saves,storageMode:'single-writer',enableAI:true,now:(conn,kind)=>{const a=current(conn);if(kind==='attack'){a.clockTime=Math.max(a.clockTime,now());a.clock.skipBefore(a.clockTime);}return a.clockTime;},isActive,readActor:conn=>current(conn),spendStamina:(conn,n)=>{const a=current(conn);if(a.sp<n)return false;a.sp-=n;return true;}});
 const potions=await createPotions({saves,storageMode:'single-writer',now,isActive,readEncounter:conn=>current(conn),applyHeal:(conn,r)=>{const a=current(conn);if(a.encounterId!==r.encounterId||!a.alive)return false;if(a.potionSequence>=r.sequence)return true;a.hp=Math.min(a.maxHp,a.hp+r.amount);a.potionSequence=r.sequence;a.hpPotionUntil=r.until;return true;}});
 const pose=a=>({scene:'field',encounterId:a.encounterId,potionSequence:a.potionSequence,potionCooldownMs:Math.max(0,a.hpPotionUntil-now()),potionPending:!!a.pendingPotion,x:a.x,y:a.y,dir:a.dir,sp:a.sp,hp:a.hp,maxHp:a.maxHp,alive:a.alive,stunned:a.stunned,hitCount:a.hitCount,lastHit:a.lastHit,moving:a.moving,running:!!a.running,attack:!!a.battle?.swing,bounds:{x:center.x,y:center.y,radius:C.radius}});
 const response=a=>({actor:pose(a),battle:a.battle});
 function advance(a,t,dt){a.clockTime=t;simulation.vitals(a,dt,bounds);
  const input=t>=a.inputAt&&t-a.inputAt<=C.inputLeaseMs?a.input:{mx:0,my:0,run:false},am=Math.min(1,Math.hypot(input.mx,input.my)),attacking=(a.battle?.swing?.end||0)>t;
  const canMove=a.alive&&!a.stunned;a.moving=canMove&&am>0;const run=canMove&&am>0&&input.run&&a.sp>MOVE.runMinSp&&!attacking;a.running=run&&am>0;
  if(canMove&&am){const n=Math.hypot(input.mx,input.my),vx=input.mx/n,vy=input.my/n;if(!attacking)a.dir=Math.abs(vx)>Math.abs(vy)?(vx<0?'l':'r'):(vy<0?'u':'d');
   const distance=(attacking?MOVE.atkMul:1)*(run?MOVE.run:MOVE.walk)*dt*(MOVE.analogMin+(1-MOVE.analogMin)*am)*(a.sp<=0?MOVE.tiredMul:1),steps=Math.max(1,Math.ceil(distance/MOVE.step));
   for(let i=0;i<steps;i++){const x=a.x+vx*distance/steps,y=a.y+vy*distance/steps;if(Math.abs(x-center.x)<=C.radius&&!hit(x,a.y,null,map))a.x=x;if(Math.abs(y-center.y)<=C.radius&&!hit(a.x,y,null,map))a.y=y;}
  }
  a.sp=Math.max(0,Math.min(STAMINA.max,a.sp+(run?-STAMINA.run:(a.moving?STAMINA.regenMove:STAMINA.regenIdle))*dt));return {dt,bounds};
 }
 async function enter(conn){if(actors.has(conn))return response(current(conn));const a={encounterId:randomUUID(),potionSequence:0,hpPotionUntil:0,pendingPotion:null,lid:conn.lid,sid:conn.sid,scene:'field',x:center.x,y:center.y+C.spawnY,dir:'u',sp:STAMINA.max,...simulation.initial(),moving:false,clock:createFixedStep({start:now(),...K}),clockTime:now(),inputAt:now(),input:{mx:0,my:0,run:false},battle:null};actors.set(conn,a);
  try{a.hpPotionUntil=await potions.cooldown(conn.lid);const o=C.mobOffset,points=[[-o,-o],[0,-o],[o,-o],[-o,0],[o,0],[-o,o],[0,o],[o,o]];a.battle=await combat.open(conn,points.map(([dx,dy])=>({kind:'slime',level:1,x:center.x+dx,y:center.y+dy})));return response(a);}catch(e){actors.delete(conn);throw e;}
 }
 async function pump(conn){const a=current(conn);if(a.pendingPotion)await resolvePotion(conn,a);const target=now();a.battle=await combat.step(conn);for(let n=0;n<K.maxSteps;n++){const frame=a.clock.take(target);if(!frame)break;advance(a,frame.at,frame.dt);a.battle=await combat.step(conn,{dt:frame.dt,bounds});}return response(a);}
 async function input(conn,command){const a=current(conn);if(!Number.isFinite(command.mx)||!Number.isFinite(command.my)||Math.abs(command.mx)>1||Math.abs(command.my)>1||typeof command.run!=='boolean')fail('training-input');await pump(conn);a.input={mx:command.mx,my:command.my,run:command.run};a.inputAt=now();a.clock.skipBefore(a.inputAt);return response(a);}
 async function attack(conn,sequence){const a=current(conn);await pump(conn);a.clockTime=Math.max(a.clockTime,now());a.clock.skipBefore(a.clockTime);a.battle=await combat.attack(conn,sequence);return response(a);}
 async function resolvePotion(conn,a){try{await potions.use(conn,a.pendingPotion);a.pendingPotion=null;a.clock.skipBefore(now());}catch(e){if(e.potionRejected)a.pendingPotion=null;throw e;}}
 async function potion(conn,request){const a=current(conn);await pump(conn);if(request.encounterId!==a.encounterId)fail('potion-encounter');a.pendingPotion={encounterId:request.encounterId,sequence:request.sequence};await resolvePotion(conn,a);return response(a);}
 async function leave(conn){await pump(conn);close(conn);}
 function close(conn){combat.close(conn);actors.delete(conn);}
 return {enter,input,attack,potion,leave,pump,tickMs:K.stepMs,close,active:conn=>actors.has(conn)};
}
module.exports={createFieldTraining};
