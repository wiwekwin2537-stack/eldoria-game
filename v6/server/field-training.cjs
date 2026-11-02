/* PLAY-E2b โหมดทดสอบเท่านั้น สไลม์นิ่ง ไม่มีAI/สวนกลับ/ดรอป/XPมอน
   clientส่งmx/my/runเท่านั้น ไม่รับพิกัด/เวลา/แรง/damage; serverเดินบนพื้นที่clearที่เลือกเอง
   เวลาเดินจำกัดต่อคำขอและinputมีlease ไม่เดินย้อนหลังหลังขาดการเชื่อมต่อ
   เรียกผ่านคิวprologueเดียวต่อconnectionเท่านั้น */
const {createFieldCombat}=require('./field-combat.cjs');
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
async function createFieldTraining({saves,now,isActive}){
 const [{TRAINING:C},{MOVE,STAMINA},{getMap,hit,tileAt},{T}]=await Promise.all([import('../src/data/prologue.js'),import('../src/data/movement.js'),import('../src/systems/world.js'),import('../src/config.js')]);
 const map=getMap('field'),actors=new WeakMap();let center=null;
 for(let y=C.radius+T;y<map.h*T-C.radius-T&&!center;y+=T)for(let x=C.radius+T;x<map.w*T-C.radius-T&&!center;x+=T){let clear=true;
  for(let dy=-C.radius;dy<=C.radius&&clear;dy+=MOVE.step)for(let dx=-C.radius;dx<=C.radius;dx+=MOVE.step)if(hit(x+dx,y+dy,null,map)||!['.','t','G','W'].includes(tileAt(Math.floor((x+dx)/T),Math.floor((y+dy)/T),map))){clear=false;break;}
  if(clear)center={x,y};
 }if(!center)fail('training-ground');
 const current=conn=>{const a=actors.get(conn);if(!a||a.lid!==conn.lid||a.sid!==conn.sid||!isActive(conn))fail('combat-session');return a;};
 const combat=await createFieldCombat({saves,storageMode:'single-writer',now,isActive,readActor:conn=>current(conn),spendStamina:(conn,n)=>{const a=current(conn);if(a.sp<n)return false;a.sp-=n;return true;}});
 const pose=a=>({scene:'field',x:a.x,y:a.y,dir:a.dir,sp:a.sp,moving:a.moving,running:!!a.running,attack:!!a.battle?.swing,bounds:{x:center.x,y:center.y,radius:C.radius}});
 const response=a=>({actor:pose(a),battle:a.battle});
 function advance(a){const t=now(),elapsed=Math.max(0,Math.min(C.stepMs,t-a.at)),dt=elapsed/1000;a.at=t;
  const input=t-a.inputAt<=C.inputLeaseMs?a.input:{mx:0,my:0,run:false},am=Math.min(1,Math.hypot(input.mx,input.my)),attacking=(a.battle?.swing?.end||0)>t;
  a.moving=am>0;const run=am>0&&input.run&&a.sp>MOVE.runMinSp&&!attacking;a.running=run&&am>0;
  if(am){const n=Math.hypot(input.mx,input.my),vx=input.mx/n,vy=input.my/n;if(!attacking)a.dir=Math.abs(vx)>Math.abs(vy)?(vx<0?'l':'r'):(vy<0?'u':'d');
   const distance=(attacking?MOVE.atkMul:1)*(run?MOVE.run:MOVE.walk)*dt*(MOVE.analogMin+(1-MOVE.analogMin)*am)*(a.sp<=0?MOVE.tiredMul:1),steps=Math.max(1,Math.ceil(distance/MOVE.step));
   for(let i=0;i<steps;i++){const x=a.x+vx*distance/steps,y=a.y+vy*distance/steps;if(Math.abs(x-center.x)<=C.radius&&!hit(x,a.y,null,map))a.x=x;if(Math.abs(y-center.y)<=C.radius&&!hit(a.x,y,null,map))a.y=y;}
  }
  a.sp=Math.max(0,Math.min(STAMINA.max,a.sp+(run?-STAMINA.run:(am?STAMINA.regenMove:STAMINA.regenIdle))*dt));
 }
 async function enter(conn){if(actors.has(conn))return response(current(conn));const a={lid:conn.lid,sid:conn.sid,scene:'field',x:center.x,y:center.y+C.spawnY,dir:'u',sp:STAMINA.max,alive:true,stunned:false,moving:false,at:now(),inputAt:now(),input:{mx:0,my:0,run:false},battle:null};actors.set(conn,a);
  try{const o=C.mobOffset,points=[[-o,-o],[0,-o],[o,-o],[-o,0],[o,0],[-o,o],[0,o],[o,o]];a.battle=await combat.open(conn,points.map(([dx,dy])=>({kind:'slime',level:1,x:center.x+dx,y:center.y+dy})));return response(a);}catch(e){actors.delete(conn);throw e;}
 }
 async function input(conn,command){const a=current(conn);if(!Number.isFinite(command.mx)||!Number.isFinite(command.my)||Math.abs(command.mx)>1||Math.abs(command.my)>1||typeof command.run!=='boolean')fail('training-input');advance(a);a.input={mx:command.mx,my:command.my,run:command.run};a.inputAt=now();a.battle=await combat.step(conn);return response(a);}
 async function attack(conn,sequence){const a=current(conn);advance(a);a.battle=await combat.attack(conn,sequence);return response(a);}
 async function leave(conn){const a=current(conn);advance(a);a.battle=await combat.step(conn);close(conn);}
 function close(conn){combat.close(conn);actors.delete(conn);}
 return {enter,input,attack,leave,close,active:conn=>actors.has(conn)};
}
module.exports={createFieldTraining};
