/* STORY-E2a — API ภายใน ยังไม่มี route/AI/ภาพ/ดรอป/XPมอน
   ผู้เรียกต้องส่ง authority ฝั่งserver: readActor(conn) sync คืน scene/x/y/dir/sp/alive/stunned,
   spendStamina(conn,cost) sync หักแรงจริงแล้วคืนtrue และ isActive ตรวจsessionปัจจุบัน
   ห้ามต่อ readActor กับพิกัดจากrequest/G.player ของclientโดยไม่มีระบบตรวจการเดิน
   open(conn, entities) รับเฉพาะข้อมูล spawn จากระบบมอนserver ไม่เปิดให้clientสร้างมอน
   attack รับแค่ลำดับคำสั่ง; server เลือกเป้า/คิดdamage/จับเวลาและให้proofเอง
   เริ่มเฉพาะfirst-light+kitดาบ0ไม่มีออป คอมโบสามจังหวะตามชั้นท้ายเกมเดิม ยังไม่รองรับอาชีพ/ของขั้นอื่น */
const {randomUUID}=require('crypto');
const {createSlimeSimulation}=require('./slime-ai.cjs');
const {createEldoriaStoryService,createStoryRewardAdapter}=require('./story-rewards.cjs');
function fail(code){const e=new Error(code);e.code=code;throw e;}
function sync(v){if(v&&typeof v.then==='function'){Promise.resolve(v).catch(()=>{});fail('combat-authority-async');}return v;}
async function createFieldCombat({saves,storageMode,isActive,readActor,spendStamina,enableAI=false,now=Date.now,random=Math.random}={}){
  if(storageMode!=='single-writer'||![isActive,readActor,spendStamina].every(f=>typeof f==='function'))fail('combat-authority-unavailable');
  const [{FIELD_COMBAT:C},{getMap,hit},{T},{MOVE}]=await Promise.all([import('../src/data/combat.js'),import('../src/systems/world.js'),import('../src/config.js'),import('../src/data/movement.js')]);
  const simulation=await createSlimeSimulation({blocked:(x,y)=>hit(x,y,null,getMap(C.scene)),random});
  const map=getMap(C.scene),adapter=await createStoryRewardAdapter(),encounters=new WeakMap(),proofs=new Map(),queues=new Map();
  const dirs={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
  const active=conn=>!!conn?.lid&&!!conn.sid&&sync(isActive(conn))===true;
  function pose(conn){const p=sync(readActor(conn));if(!p||p.scene!==C.scene||![p.x,p.y,p.sp].every(Number.isFinite)||p.sp<0||p.x<0||p.y<0||p.x>=map.w*T||p.y>=map.h*T||!dirs[p.dir]||p.alive!==true||p.stunned!==false||hit(p.x,p.y,null,map))fail('combat-actor');return {...p};}
  function current(conn){const e=encounters.get(conn);if(!e||e.lid!==conn.lid||e.sid!==conn.sid)fail('combat-encounter');return e;}
  const service=await createEldoriaStoryService({saves,storageMode,verifyEvidence:({lid,ticket,current:view})=>{
    const p=proofs.get(ticket);if(!p||p.lid!==lid||!active(p.conn)||encounters.get(p.conn)!==p.encounter||p.conn.sid!==p.encounter.sid||view.chapter?.id!=='first-light')return false;
    return {id:p.id,chapterId:'first-light',kind:'kill',target:'slime'};
  },verifyReport:()=>false});
  function serial(conn,work){const lid=conn?.lid;if(!lid)return Promise.reject(Object.assign(new Error('combat-session'),{code:'combat-session'}));
    const previous=queues.get(lid)||Promise.resolve(),next=previous.catch(()=>{}).then(async()=>{if(!active(conn)||!await saves.claim(lid,conn.sid,()=>active(conn)))fail('combat-session');return work();});
    queues.set(lid,next);return next.finally(()=>{if(queues.get(lid)===next)queues.delete(lid);});
  }
  function rng(){const n=random();if(!Number.isFinite(n)||n<0||n>=1)fail('combat-random');return n;}
  function snapshot(e){return {sequence:e.sequence,queuedSequence:e.queuedSequence,queuedError:e.queuedError,swing:e.swing?{sequence:e.swing.sequence,start:e.swing.start,end:e.swing.end,hitAt:e.swing.hitAt,combo:e.swing.combo,spin:e.swing.spin,phase:e.swing.phase,radius:e.swing.radius}:null,entities:e.entities.map(m=>({id:m.id,x:m.x,y:m.y,level:m.level,hp:m.hp,maxHp:m.maxHp,dead:m.dead,pending:!!m.pending,phase:m.phase||0,hurt:m.hurt||0})),last:e.last?structuredClone(e.last):null};}
  async function flush(e){for(const m of e.entities){if(!m.pending)continue;const event=m.pending;
      try{const current=await service.read(e.lid);if(current.state.chapterId==='first-light'&&!current.view.ready)await service.record(e.lid,event.id);m.dead=true;m.pending=null;proofs.delete(event.id);}catch(err){throw err;}
    }}
  function weapon(profile){const c=adapter.character(profile.character),bag=adapter.inventory.read(profile.inventory),g=bag.gear[bag.equipped.sword];
    if(c.level!==1||Object.values(c.stats).some(n=>n!==0)||profile.classId||profile.cls||c.classId||c.cls||!g||g.itemId!=='sword0'||g.broken||g.enhance||g.options.length||g.sockets.length||g.rune!==null)fail('combat-loadout-unsupported');
    return c;
  }
  function contact(p,m,spin){const [vx,vy]=dirs[p.dir],dx=m.x-p.x,dy=m.y-p.y,along=dx*vx+dy*vy;
    if(spin){if(Math.hypot(dx,dy)>=C.spin.radius)return false;}
    else {if(along<0&&Math.hypot(dx,dy)>C.slash.behind)return false;const u=Math.max(0,Math.min(C.slash.reach,along));if(Math.hypot(dx-vx*u,dy-vy*u)>=C.slash.radius)return false;}
    /* สไลม์เดิมไม่อยู่ในD.zone แต่ตรวจLOSฝั่งserverเพื่อไม่สร้างหลักฐานผ่านสิ่งกีดขวาง */
    const n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/MOVE.step));for(let i=1;i<=n;i++)if(hit(p.x+dx*i/n,p.y+dy*i/n,null,map))return false;return true;
  }
  function interrupt(e){e.swing=null;e.queuedSequence=null;e.comboIndex=-1;e.completedAt=null;e.queuedError=null;}
  async function stepCore(conn,e){await flush(e);if(!active(conn))fail('combat-session');const actor=sync(readActor(conn));if(actor?.alive===false||actor?.stunned===true){interrupt(e);return snapshot(e);}const s=e.swing;if(!s)return snapshot(e);
    const t=now(conn);if(!Number.isFinite(t)||t<s.start)fail('combat-clock');s.phase=Math.max(0,Math.min(1,(t-s.start)/(s.end-s.start)));
    if(!s.resolved&&t>=s.hitAt){
      if(t<s.hitEnd){const p=pose(conn);const staged=[];
        /* เตรียมdamageทั้งหมดก่อนแตะเลือด กันrandom/dataพังแล้วเกิดผลบางตัว */
        for(const m of e.entities){if(m.dead||m.pending||m.hp<=0||s.hitIds.has(m.id)||!contact(p,m,s.spin))continue;const crit=rng()<C.damage.critBase+s.character.stats.agi*C.damage.critAgi;
          const base=Math.round(C.damage.base+C.damage.sword0+s.character.stats.str+((s.character.level-1)>>1));
          const damage=Math.max(1,Math.round(base*(C.damage.spreadMin+rng()*C.damage.spreadWidth)*(crit?C.damage.critMul:1)));staged.push({m,damage,crit});}
        for(const {m,damage,crit} of staged){s.hitIds.add(m.id);m.hp=Math.max(0,m.hp-damage);if(enableAI)simulation.slash(m,p);e.last.hits.push({id:m.id,damage,crit});if(m.hp===0){const id=randomUUID();m.pending={id};proofs.set(id,{id,lid:e.lid,conn,encounter:e});}}
      }else s.resolved=true;
      await flush(e);
    }
    if(t>=s.end){e.swing=null;e.completedAt=s.end;const queued=e.queuedSequence;e.queuedSequence=null;if(queued!==null){try{await begin(conn,e,queued);}catch(error){e.queuedError=error.code||'combat-queued';}}}return snapshot(e);
  }
  function open(conn,entities){return serial(conn,async()=>{
    if(encounters.has(conn))return snapshot(current(conn));pose(conn);
    const story=await service.read(conn.lid);if(story.state.chapterId!=='first-light'||story.view.needsReconciliation||story.view.ready)fail('combat-chapter');weapon(await saves.readServer(conn.lid));
    if(!Array.isArray(entities)||!entities.length||entities.length>C.maxEntities)fail('combat-spawn');
    const mobs=entities.map(m=>{if(!m||m.kind!=='slime'||!Number.isInteger(m.level)||m.level<C.slime.minLevel||m.level>C.slime.maxLevel||![m.x,m.y].every(Number.isFinite)||m.x<0||m.y<0||m.x>=map.w*T||m.y>=map.h*T||hit(m.x,m.y,null,map))fail('combat-spawn');
      return {id:randomUUID(),x:m.x,y:m.y,level:m.level,hp:C.slime.baseHp+m.level,maxHp:C.slime.baseHp+m.level,dead:false,pending:null};});
    const e={lid:conn.lid,sid:conn.sid,entities:mobs,sequence:0,swing:null,last:null,comboIndex:-1,completedAt:null,queuedSequence:null,queuedError:null};if(!active(conn))fail('combat-session');encounters.set(conn,e);return snapshot(e);
  });}
  async function begin(conn,e,sequence){
    const story=await service.read(conn.lid);if(story.state.chapterId!=='first-light'||story.view.ready||story.view.needsReconciliation)fail('combat-chapter');
    const c=weapon(await saves.readServer(conn.lid)),p=pose(conn),t=now(conn,'attack');if(!Number.isFinite(t))fail('combat-clock');
    const chain=e.completedAt!==null&&t>=e.completedAt&&t-e.completedAt<C.combo.windowMs,combo=chain?(e.comboIndex+1)%C.combo.steps:0,spin=combo===C.combo.steps-1,move=spin?C.spin:C.slash,cost=move.stamina;
    if(p.sp<cost)fail('combat-stamina');const duration=move.durationMs*(p.sp-cost<C.lowStamina?C.tiredDurationMul:1);
    if(!active(conn)||encounters.get(conn)!==e)fail('combat-session');if(sync(spendStamina(conn,cost))!==true)fail('combat-stamina');
    e.sequence=sequence;e.comboIndex=combo;e.queuedError=null;e.last={sequence,hits:[]};e.swing={sequence,combo,spin,radius:move.radius,phase:0,start:t,end:t+duration,hitAt:t+duration*move.hitFrom,hitEnd:t+duration*move.hitTo,resolved:false,hitIds:new Set(),character:c};return snapshot(e);
  }
  function attack(conn,sequence){return serial(conn,async()=>{
    const e=current(conn);if(!Number.isSafeInteger(sequence)||sequence<1||sequence>C.maxSequence)fail('combat-sequence');
    await stepCore(conn,e);if(sequence===e.sequence)return snapshot(e);if(sequence!==e.sequence+1)fail('combat-sequence');
    if(e.swing){const t=now(conn),phase=(t-e.swing.start)/(e.swing.end-e.swing.start);if(phase<=C.combo.queueAfter)fail('combat-cooldown');e.queuedSequence=sequence;e.queuedError=null;return snapshot(e);}
    return begin(conn,e,sequence);
  });}
  function step(conn,frame){return serial(conn,async()=>{const e=current(conn);await flush(e);if(frame!==undefined){if(enableAI!==true)fail('combat-authority-unavailable');simulation.step(e.entities,sync(readActor(conn)),frame.dt,frame.bounds);}return stepCore(conn,e);});}
  function close(conn){const e=encounters.get(conn);if(e)for(const m of e.entities)if(m.pending)proofs.delete(m.pending.id);encounters.delete(conn);}
  return {open,attack,step,close,readStory:lid=>service.read(lid)};
}
module.exports={createFieldCombat};
