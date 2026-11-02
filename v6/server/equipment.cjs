/* เปลี่ยนเฉพาะช่องดาบจาก UID ที่มีจริงในเซฟ ไม่รับค่าสถานะจาก client */
const {createStoryRewardAdapter}=require('./story-rewards.cjs');
const fail=code=>{throw Object.assign(Error(code),{code});};
async function createEquipment({saves,isActive,storageMode}={}){
 if(storageMode!=='single-writer'||typeof isActive!=='function')fail('equipment-authority');
 const {inventory,character}=await createStoryRewardAdapter();
 async function equip(conn,uid){
  if(uid!==null&&(typeof uid!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(uid)))fail('inventory-gear');
  const lid=conn.lid,sid=conn.sid;
  const active=()=>conn.lid===lid&&conn.sid===sid&&isActive(conn);
  if(!lid||!sid||!active()||!await saves.claim(lid,sid,active))fail('session');
  await saves.updateServer(lid,profile=>{
   if(!active())fail('session');const c=character(profile.character);
   profile.inventory=uid===null?inventory.unequip(profile.inventory,'sword',c.stats):inventory.equip(profile.inventory,uid,c.level,c.stats);
   return profile;
  });
  if(!active())fail('session');
 }
 return {equip};
}
module.exports={createEquipment};
