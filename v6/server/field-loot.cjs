/* ดรอปสไลม์030/043/031: XPกับหลักฐานฆ่าcommitเดียว ของบนพื้นเก็บเมื่อเข้าใกล้
   journalหนึ่งencounterไม่เกิน24ตัว เก็บของค้างก่อนเริ่มห้องใหม่ ไม่ทิ้งของเมื่อdisconnect */
const {randomUUID}=require('crypto');
const {COIN_MAX}=require('./saves.cjs');
const {createStoryRewardAdapter}=require('./story-rewards.cjs');
const fail=code=>{throw Object.assign(Error(code),{code});};
const idOk=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(s);
async function createFieldLoot({saves,isActive,random=Math.random}={}){
 const [{FIELD_LOOT:L},adapter]=await Promise.all([import('../src/data/combat.js'),createStoryRewardAdapter()]);
 const allowed=new Set(['coin','gel','essf','pa_collar_1','pa_bell_1','pa_ring_1']);
 const rng=()=>{const r=random();if(!Number.isFinite(r)||r<0||r>=1)fail('combat-random');return r;};
 function read(value){if(value===undefined)return null;const j=structuredClone(value);
  if(!j||j.version!==1||!idOk(j.encounterId)||!Array.isArray(j.kills)||j.kills.length>24)fail('field-loot-data');
  const ids=new Set();for(const k of j.kills){if(!idOk(k.id)||ids.has(k.id)||!Number.isInteger(k.level)||k.level<1||k.level>5||!Number.isFinite(k.at)||!Array.isArray(k.drops)||k.drops.length>10)fail('field-loot-data');ids.add(k.id);
   for(const d of k.drops){if(!idOk(d.id)||ids.has(d.id)||!allowed.has(d.itemId)||![d.x,d.y].every(Number.isFinite)||typeof d.taken!=='boolean')fail('field-loot-data');ids.add(d.id);}}
  return j;
 }
 function roll(id,m,at){const drops=[],add=itemId=>drops.push({id:randomUUID(),itemId,x:m.x,y:m.y,taken:false});
  const gel=1+(rng()<L.extraGelChance?1:0),coin=1+Math.floor(rng()*L.coinRoll)+(m.level>>1);for(let n=0;n<gel;n++)add('gel');for(let n=0;n<coin;n++)add('coin');
  if(rng()<L.essenceChance)add('essf');if(rng()<L.petChance)add(L.petItems[Math.floor(rng()*L.petItems.length)]);
  return {id,level:m.level,at,drops};
 }
 function grant(profile,proof){const j=read(profile.fieldLoot),reward=proof.reward;if(!j||j.encounterId!==proof.encounterId||!reward||reward.id!==proof.id)fail('field-loot-proof');
  if(j.kills.some(k=>k.id===proof.id))return true;if(j.kills.length>=24)fail('field-loot-full');
  const c=adapter.character(profile.character),high=c.level>=100?.6:c.level>=80?.75:1;
  const xp=Math.max(1,Math.round(Math.max(1,Math.round(L.xpPerLevel*reward.level*high))*L.xpPermanentMul));
  profile.character=adapter.gain(c,xp);j.kills.push(structuredClone(reward));profile.fieldLoot=read(j);return true;
 }
 function take(profile,j,ids){if(!j)return null;let error=null;const c=adapter.character(profile.character);
  if(!Number.isSafeInteger(profile.coin)||profile.coin<0||profile.coin>COIN_MAX)fail('field-loot-data');
  for(const d of j.kills.flatMap(k=>k.drops)){if(d.taken||(ids&&!ids.has(d.id)))continue;
   if(d.itemId==='coin'){if(profile.coin>=COIN_MAX){error='coin-full';continue;}profile.coin++;d.taken=true;continue;}
   try{profile.inventory=adapter.inventory.add(profile.inventory,{stacks:{[d.itemId]:1}},c.stats);d.taken=true;}catch(e){if(!['bag-full','bag-weight'].includes(e.code))throw e;error=e.code;}
  }
  profile.fieldLoot=j;return error;
 }
 async function update(conn,fn){const lid=conn.lid,sid=conn.sid,active=()=>conn.lid===lid&&conn.sid===sid&&isActive(conn)===true;
  if(!lid||!sid||!active()||!await saves.claim(lid,sid,active))fail('combat-session');const result=await saves.updateServer(lid,p=>{if(!active())fail('combat-session');fn(p);return p;});if(!active())fail('combat-session');return result;
 }
 async function start(conn,encounterId){return update(conn,p=>{const j=read(p.fieldLoot);take(p,j);if(j?.kills.some(k=>k.drops.some(d=>!d.taken)))fail('field-loot-pending');p.fieldLoot={version:1,encounterId,kills:[]};});}
 async function collect(conn,encounterId,ids){let error=null;const profile=await update(conn,p=>{const j=read(p.fieldLoot);if(!j||j.encounterId!==encounterId)fail('field-loot-encounter');error=take(p,j,ids?new Set(ids):null);});return {profile,error};}
 function drops(profile){const j=read(profile.fieldLoot);return j?j.kills.flatMap(k=>k.drops.filter(d=>!d.taken).map(d=>({...d,at:k.at}))):[];}
 const recover=conn=>update(conn,p=>{take(p,read(p.fieldLoot));});
 return {read,roll,grant,start,collect,recover,drops};
}
module.exports={createFieldLoot};
