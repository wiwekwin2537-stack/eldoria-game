/* ใช้ยาเลือด: inventoryและreceiptเอกสารเดียวก่อนapplyHPชั่วคราวของencounter
   callerต้องfreeze encounterเมื่อผลstorageคลุมเครือแล้วretry seqเดิมก่อนเดินsimulationต่อ
   ไม่รับitem/จำนวน/HPจากclient receiptล่าสุดตัวเดียว ขอบเขตmemory/file single-writer */
const {createInventory}=require('./inventory.cjs');
const fail=code=>{const e=Object.assign(Error(code),{code,potionRejected:true});throw e;};
const idOk=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(s);
async function createPotions({saves,isActive,readEncounter,applyHeal,now=Date.now,storageMode}={}){
 if(storageMode!=='single-writer'||![isActive,readEncounter,applyHeal].every(f=>typeof f==='function'))fail('potion-authority');
 const [{ECONOMY:E},inventory]=await Promise.all([import('../src/data/economy.js'),createInventory()]),P=E.hpPotion,queues=new Map();
 const sync=v=>{if(v&&typeof v.then==='function'){Promise.resolve(v).catch(()=>{});fail('potion-authority');}return v;};
 function receipt(value){if(value===undefined)return null;const r=structuredClone(value);
  if(!r||r.version!==1||!idOk(r.encounterId)||!Number.isSafeInteger(r.sequence)||r.sequence<1||r.sequence>2147483647||r.itemId!=='hpp'||!Number.isSafeInteger(r.usedAt)||r.usedAt<0||r.until!==r.usedAt+P.cooldownMs||![r.beforeHp,r.maxHp,r.amount].every(Number.isFinite)||r.beforeHp<=0||r.beforeHp>=r.maxHp||r.maxHp<=0||r.amount!==Math.min(r.maxHp-r.beforeHp,Math.max(P.minimum,Math.round(r.maxHp*P.fraction))))fail('potion-data');return r;
 }
 function actor(conn,eid){if(!sync(isActive(conn)))fail('potion-session');const a=sync(readEncounter(conn));if(!a||a.encounterId!==eid)fail('potion-encounter');return a;}
 async function run(conn,eid,sequence){const lid=conn.lid,sid=conn.sid;if(!idOk(eid)||!Number.isSafeInteger(sequence)||sequence<1||sequence>2147483647)fail('potion-sequence');
  if(!lid||!sid||!await saves.claim(lid,sid,()=>sync(isActive(conn))))fail('potion-session');let result;
  await saves.updateServer(lid,profile=>{if(conn.lid!==lid||conn.sid!==sid)fail('potion-session');const a=actor(conn,eid),r=receipt(profile.potionUse);
   if(r?.encounterId===eid&&sequence===r.sequence){result=r;return profile;}
   const last=r?.encounterId===eid?r.sequence:0;if(sequence!==last+1||a.potionSequence!==last)fail('potion-sequence');
   if(!a.alive||!Number.isFinite(a.hp)||!Number.isFinite(a.maxHp)||a.hp<=0)fail('potion-dead');if(a.hp>=a.maxHp)fail('potion-full');
   const usedAt=now();if(!Number.isSafeInteger(usedAt)||usedAt<0)fail('potion-clock');if(r&&usedAt<r.until)fail('potion-cooldown');
   let bag;try{bag=inventory.read(profile.inventory);}catch{fail('potion-inventory');}if(!(bag.stacks.hpp>0))fail('potion-empty');bag.stacks.hpp--;if(!bag.stacks.hpp)delete bag.stacks.hpp;
   result={version:1,encounterId:eid,sequence,itemId:'hpp',beforeHp:a.hp,maxHp:a.maxHp,amount:Math.min(a.maxHp-a.hp,Math.max(P.minimum,Math.round(a.maxHp*P.fraction))),usedAt,until:usedAt+P.cooldownMs};profile.inventory=bag;profile.potionUse=result;return profile;
  });
  const a=actor(conn,eid);if(conn.lid!==lid||conn.sid!==sid)fail('potion-session');if(a.potionSequence<result.sequence){if(!a.alive)fail('potion-dead');if(sync(applyHeal(conn,structuredClone(result)))!==true)fail('potion-authority');}
  return structuredClone(result);
 }
 function use(conn,{encounterId,sequence}={}){const lid=conn?.lid;if(!lid)return Promise.reject(Object.assign(Error('potion-session'),{code:'potion-session',potionRejected:true}));const previous=queues.get(lid)||Promise.resolve(),next=previous.catch(()=>{}).then(()=>run(conn,encounterId,sequence));queues.set(lid,next);return next.finally(()=>{if(queues.get(lid)===next)queues.delete(lid);});}
 async function cooldown(lid){return receipt((await saves.readServer(lid)).potionUse)?.until||0;}
 return {use,cooldown};
}
module.exports={createPotions};
