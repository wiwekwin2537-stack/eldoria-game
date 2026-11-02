/* STORY-E3b1 ใช้ตารางและ grant จริงจาก data/economy + story-rewards ไม่ใช้ grant จำลอง */
import { createRequire } from 'node:module';
import { ECONOMY } from '../src/data/economy.js';
const require = createRequire(import.meta.url);
const { createInventory } = require('../server/inventory.cjs');
const { createStoryRewardAdapter, createEldoriaStoryService } = require('../server/story-rewards.cjs');
const { createSaves, COIN_MAX } = require('../server/saves.cjs');
const { memoryStore } = require('../server/store.cjs');
const clone = x=>structuredClone(x), stats={str:0,end:0};
const ok=(v,m)=>{if(!v)throw new Error(m);};
const eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m+': '+JSON.stringify(a));
const throws=(fn,code)=>{let e;try{fn();}catch(x){e=x;}ok(e,'ต้องปฏิเสธ');if(code)eq(e.code||e.message,code,'รหัส');};
const rejects=async(fn,code)=>{let e;try{await fn();}catch(x){e=x;}ok(e,'ต้องปฏิเสธ');if(code)eq(e.code||e.message,code,'รหัส');};
async function setup() {
 const store=memoryStore(), clock={ms:1e6}, saves=createSaves({store,now:()=>clock.ms}), tickets=new Map();
 const options={saves,storageMode:'single-writer',verifyEvidence:({lid,ticket})=>{const e=tickets.get(ticket);return e?.lid===lid?clone(e.event):false;},verifyReport:({lid,ticket,chapterId})=>ticket==='king-'+chapterId?{npc:'king',chapterId}:false};
 const service=await createEldoriaStoryService(options), lid='inventory-player';
 async function evidence(chapterId,kind,target,n=1) {for(let i=0;i<n;i++){const ticket=chapterId+'-'+i;tickets.set(ticket,{lid,event:{id:ticket,chapterId,kind,target}});await service.record(lid,ticket);}}
 const report=chapterId=>service.report(lid,{chapterId,requestId:'report-'+chapterId,ticket:'king-'+chapterId});
 return {store,clock,saves,service,options,lid,evidence,report};
}
export default [
 ['E3b1 กระเป๋าฐาน/กอง99/น้ำหนักตรงชั้นสุดท้ายเกมเดิม',async()=>{
  const inv=await createInventory();eq(inv.usage(inv.fresh(),stats),{slots:0,maxSlots:24,weight10:0,maxWeight10:600},'ฐาน');
  let b=inv.add(undefined,{stacks:{hpp:99}},stats);eq(inv.usage(b,stats).slots,1,'99หนึ่งช่อง');b=inv.add(b,{stacks:{hpp:1}},stats);eq(inv.usage(b,stats).slots,2,'100สองช่อง');eq(inv.usage(b,stats).weight10,400,'40กก.');
  for(let i=0;i<4;i++){const x=inv.fresh();x.bagLevel=i;const u=inv.usage(x,{str:2,end:3});eq(u.maxSlots,[24,32,40,56][i],'ช่อง');eq(u.maxWeight10,[600,900,1300,2000][i]+70,'STR/END');}
 }],
 ['E3b1 เต็มน้ำหนัก/เต็มช่องปฏิเสธทั้งแพ็กโดยไม่แก้กระเป๋าต้นฉบับ',async()=>{
  let n=0;const inv=await createInventory({uid:()=> 'gear-'+(++n)});const b=inv.add(undefined,{stacks:{hpp:150}},stats);eq(inv.usage(b,stats).weight10,600,'พอดี60กก.');
  const before=clone(b);throws(()=>inv.add(b,{stacks:{scroll:1}},stats),'bag-weight');eq(b,before,'เดิมไม่เปลี่ยน');
  const strong={str:20,end:0}, full=inv.add(undefined,{gear:Array(24).fill('sword0')},strong);eq(inv.usage(full,strong).slots,24,'24ชิ้น');throws(()=>inv.add(full,{stacks:{scroll:1}},strong),'bag-full');
 }],
 ['E3b1 ของไม่รู้จัก/จำนวนผิด/UIDชนกันไม่แทรกหรือเขียนทับของ',async()=>{
  const inv=await createInventory({uid:()=> 'same'});for(const n of [-1,0,NaN,1.2,Infinity,Number.MAX_SAFE_INTEGER+1])throws(()=>inv.add(undefined,{stacks:{hpp:n}},stats),'inventory-count');
  throws(()=>inv.add(undefined,{stacks:{unknown:1}},stats),'inventory-item');throws(()=>inv.add(undefined,{gear:['city2-sword']},stats),'inventory-item');throws(()=>inv.add(undefined,{gear:['sword0','sword0']},stats),'inventory-uid');
  throws(()=>inv.read({version:99}),'inventory-version'); throws(()=>inv.add(undefined,{stacks:null},stats),'inventory-add'); throws(()=>inv.add(undefined,{gear:null},stats),'inventory-add');
 }],
 ['E3b1 ดาบชนิดเดียวกันมี UID/ตีบวก/ออป/รูนแยกชิ้นและสำเนาไม่ทับกัน',async()=>{
  let n=0;const inv=await createInventory({uid:()=> 'sword-'+(++n)});const b=inv.add(undefined,{gear:['sword0','sword0']},stats),ids=Object.keys(b.gear);eq(ids.length,2,'2ชิ้น');ok(ids[0]!==ids[1],'uidต่าง');
  b.gear[ids[0]].enhance=7;b.gear[ids[0]].options.push({key:'str',value:1});b.gear[ids[0]].rune='fire1';eq(b.gear[ids[1]].enhance,0,'ตีบวกอีกเล่ม0');eq(b.gear[ids[1]].options,[],'ออปไม่แชร์');eq(b.gear[ids[1]].rune,null,'รูนไม่แชร์');
  const copy=inv.read(b);copy.gear[ids[0]].options[0].value=99;eq(b.gear[ids[0]].options[0].value,1,'readแยกnested');
 }],
 ['E3b1 สวม/ถอดดาบไม่เพิ่มหรือลดช่อง/น้ำหนัก และไม่สวมของพัง/เลเวลไม่ถึง',async()=>{
  let n=0;const inv=await createInventory({uid:()=> 'eq-'+(++n)});const b=inv.add(undefined,{gear:['sword0','sword1','axe0']},stats),ids=Object.keys(b.gear),u=inv.usage(b,stats);
  const equipped=inv.equip(b,ids[0],1,stats);eq(inv.usage(equipped,stats),u,'สวมยังนับดาบ1ช่อง');eq(inv.usage(inv.unequip(equipped,'sword',stats),stats),u,'ถอดไม่เสกช่อง');
  throws(()=>inv.equip(b,ids[1],1,stats),'inventory-level');ok(inv.equip(b,ids[1],5,stats).equipped.sword===ids[1],'Lv5ใส่tier1ได้');
  b.gear[ids[0]].broken=true;throws(()=>inv.equip(b,ids[0],1,stats),'inventory-equipped');throws(()=>inv.equip(b,ids[2],5,stats),'inventory-equipped');
 }],
 ['E3b1 แพ็กบทนำจริงครบเงิน XP ยา scroll และ kit ไม่ข้ามเครื่องมือ',async()=>{
  let n=0;const a=await createStoryRewardAdapter({uid:()=> 'starter-'+(++n)}),p={coin:0};ok(a.grant(p,a.rewards['story.0']),'grant');
  eq(p.coin,50,'coin50');eq(p.character.level,1,'Lv1');eq(p.character.xp,20,'xp20');eq(p.inventory.stacks,{hpp:3,scroll:2},'ของใช้ครบ');
  eq(Object.values(p.inventory.gear).map(g=>g.itemId),['sword0','axe0','pick0'],'kit3ชิ้น');eq(p.inventory.gear[p.inventory.equipped.sword].itemId,'sword0','สวมดาบเริ่มต้น');eq(a.inventory.usage(p.inventory,p.character.stats),{slots:5,maxSlots:24,weight10:102,maxWeight10:600},'ช่อง/น้ำหนักรวมของสวม');
 }],
 ['E3b1 kit ไม่ให้ดาบ/ขวาน/ที่ขุดชนิดเดิมซ้ำหากมีอยู่แล้ว',async()=>{
  let n=0;const a=await createStoryRewardAdapter({uid:()=> 'kit-'+(++n)}),p={coin:0};p.inventory=a.inventory.add(undefined,{gear:['sword0','axe0']},stats);const oldIds=Object.keys(p.inventory.gear);
  a.grant(p,a.rewards['story.0']);eq(Object.keys(p.inventory.gear).length,3,'เพิ่มแค่pick');ok(oldIds.every(id=>p.inventory.gear[id]),'uidเก่าอยู่');
 }],
 ['E3b1 grantจริงกระเป๋าเต็ม/เงินเต็มไม่แก้coin XP ของแม้บางส่วน',async()=>{
  const a=await createStoryRewardAdapter(),p={coin:0,inventory:a.inventory.add(undefined,{stacks:{hpp:150}},stats)},before=clone(p);
  throws(()=>a.grant(p,a.rewards['story.0']),'bag-weight');eq(p,before,'ทั้งแพ็กไม่เปลี่ยน');throws(()=>a.grant({coin:0},{coin:1,xp:1,stacks:null}),'reward-data');const rich={coin:COIN_MAX},old=clone(rich);throws(()=>a.grant(rich,a.rewards['story.0']),'coin-full');eq(rich,old,'เงินเต็มไม่ตัดทิ้ง');
 }],
 ['E3b1 XP สูตรเดิมเลเวล/แต้ม+3 และ XP ที่เลเวลตันไม่ถูกลบทิ้ง',async()=>{
  const a=await createStoryRewardAdapter();eq(a.need(1),32,'need1');eq(a.need(5),320,'need5');eq(a.need(20),4820,'need20');let c=a.character();c=a.gain(c,180);eq([c.level,c.xp,c.unspentStats],[3,80,6],'180xp');
  c=a.character();c.level=200;c=a.gain(c,80);eq(c.xp,0,'MAX');eq(c.legendXpPending,80,'พักXPรอดาวตำนาน');c=a.gain(c,100);eq(c.legendXpPending,180,'สะสมไม่หาย');
  const top=a.character();top.level=199;top.xp=a.need(199)-10;const capped=a.gain(top,30);eq([capped.level,capped.xp,capped.legendXpPending,capped.unspentStats],[200,0,20,3],'ข้าม200เก็บส่วนเหลือ');
  throws(()=>a.gain(a.character(),NaN),'reward-xp');
 }],
 ['E3b1 ต่อ serviceจริง ส่งบทนำซ้ำ/โหลดใหม่ได้ของและUIDเดิมครบ',async()=>{
  const t=await setup();await t.evidence('awakening','talk','king');const first=await t.report('awakening'),p=await t.saves.readServer(t.lid),ids=Object.keys(p.inventory.gear);eq(ids.length,3,'kitครบ');eq(first.receipt.nextChapterId,'first-light','บทใหม่');
  await t.report('awakening');const restarted=await createEldoriaStoryService({...t.options,saves:createSaves({store:t.store,now:()=>t.clock.ms})});const retry=await restarted.report(t.lid,{chapterId:'awakening',requestId:'report-awakening'});ok(retry.duplicate,'retry');
  eq((await t.saves.readServer(t.lid)).coin,50,'เงินครั้งเดียว');eq(Object.keys((await t.saves.readServer(t.lid)).inventory.gear),ids,'uidไม่เปลี่ยนหลังretry');
 }],
 ['E3b1 บท0–2ใช้ตารางจริง รวมเงิน320 XP180 และของตรงต้นฉบับ',async()=>{
  const t=await setup();await t.evidence('awakening','talk','king');await t.report('awakening');await t.evidence('first-light','kill','slime',8);await t.report('first-light');await t.evidence('own-blade','milestone','weapon-tier-1-level-5');await t.report('own-blade');
  const p=await t.saves.readServer(t.lid);eq(p.coin,320,'เงิน320');eq([p.character.level,p.character.xp,p.character.unspentStats],[3,80,6],'XP180เฉพาะรางวัล ไม่นับXPจากหลักฐานfixture');eq(p.inventory.stacks,{hpp:3,scroll:2,mpp:2,estone:2},'ของครบ');eq(p.storyLedger.state.chapterId,'calling','จบบท2');
 }],
 ['E3b1 รางวัลจริงกระเป๋าเต็มคงบทพร้อมส่งและรับใหม่ได้เมื่อมีที่',async()=>{
  const t=await setup(),a=await createStoryRewardAdapter();await t.saves.updateServer(t.lid,p=>({...p,inventory:a.inventory.add(undefined,{stacks:{hpp:150}},stats)}));await t.evidence('awakening','talk','king');const before=await t.saves.readServer(t.lid);
  await rejects(()=>t.report('awakening'),'bag-weight');eq(await t.saves.readServer(t.lid),before,'ไม่ได้เงิน/เลื่อนบท');
  await t.saves.updateServer(t.lid,p=>{p.inventory.stacks={};return p;});await t.report('awakening');eq((await t.saves.readServer(t.lid)).coin,50,'มีที่แล้วรับได้');
 }],
 ['E3b1 client save ปลอม inventory/character ไม่เปลี่ยนข้อมูลจริงบนserver',async()=>{
  const t=await setup();await t.evidence('awakening','talk','king');await t.report('awakening');const before=await t.saves.readServer(t.lid),sid='a'.repeat(32);await t.saves.load(t.lid,sid);t.clock.ms+=2000;
  ok((await t.saves.save(t.lid,{seq:1,sid,systems:{inventory:{stacks:{hpp:999}},character:{level:200}},server:{coin:99999,inventory:{stacks:{hpp:999}}}})).ok,'clientเซฟได้');eq(await t.saves.readServer(t.lid),before,'serverไม่เชื่อค่าที่ปลอม');
 }],
 ['E3b1 grantจริง commitแล้วคำตอบหาย retryคงเงิน XP kitและUIDเดิม',async()=>{
  const t=await setup();await t.evidence('awakening','talk','king');const set=t.store.set;let lost=true;
  t.store.set=async(k,v)=>{await set(k,v);if(lost){lost=false;throw new Error('reply-lost');}};
  await rejects(()=>t.report('awakening'),'reply-lost');const committed=await createSaves({store:t.store}).readServer(t.lid),ids=Object.keys(committed.inventory.gear);eq(ids.length,3,'commitkitครบ');
  const retried=await t.report('awakening');ok(retried.duplicate,'retryไม่grantใหม่');const restarted=createSaves({store:t.store}),p=await restarted.readServer(t.lid);eq(p.inventory,committed.inventory,'กระเป๋า/UIDไม่เปลี่ยน');eq([p.coin,p.character.xp],[50,20],'ไม่ได้เงินXPซ้ำ');
 }],
 ['E3b1 ตารางรางวัลจำกัด0–2และ wrapperไม่เปิดให้ callerสลับgrant/tableเอง',async()=>{
  eq(Object.keys(ECONOMY.storyRewards),['story.0','story.1','story.2'],'ยังไม่เดารางวัลบทอื่น');const t=await setup();const injected=await createEldoriaStoryService({...t.options,rewards:{'story.0':{coin:999999}},grant:p=>{p.coin=999999;return true;}});
  await t.evidence('awakening','talk','king');await injected.report(t.lid,{chapterId:'awakening',requestId:'report-awakening',ticket:'king-awakening'});eq((await t.saves.readServer(t.lid)).coin,50,'ใช้ตารางจริง');
 }],
];
