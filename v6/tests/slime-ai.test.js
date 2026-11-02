/* ค่ามาจาก017/014/031:7191 เทสserver simulation ไม่รับรองภาพbrowser */
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{createSlimeSimulation}=require('../server/slime-ai.cjs');
const ok=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),(m||'เท่ากัน')+': '+JSON.stringify(a)),near=(a,b,m)=>ok(Math.abs(a-b)<1e-7,m+': '+a);
const bounds={x:0,y:0,radius:96};
async function setup(random=()=>.99){const s=await createSlimeSimulation({blocked:()=>false,random}),p={...s.initial(),x:50,y:0},m={id:'server-slime',x:0,y:0,level:1,hp:3,dead:false,pending:null,phase:.85,hurt:0,cool:0};return{s,p,m};}
export default [
 ['E2c สไลม์เลือกทิศไล่ตอนครบรอบ.9 เดิน70เฉพาะช่วง.3ถึง.7',async()=>{
  const {s,p,m}=await setup();s.step([m],p,.1,bounds);near(m.phase,.05,'ครบรอบ');eq(m.x,0,'ยังไม่hop');near(m.dx,1,'ไล่');s.step([m],p,.12,bounds);s.step([m],p,.12,bounds);eq(m.x,0);s.step([m],p,.1,bounds);near(m.x,7,'70px/s');m.phase=.75;const x=m.x;s.step([m],p,.1,bounds);eq(m.x,x,'recoveryไม่เดิน');
 }],
 ['E2c ไกล170ไม่ล็อกเป้าผู้เล่น สุ่มเดิน/หยุดจากserver',async()=>{
  const a=await setup(()=>.99);a.p.x=300;a.s.step([a.m],a.p,.1,bounds);eq([a.m.dx,a.m.dy],[0,0],'สุ่มหยุด');const b=await setup(()=>.1);b.p.x=300;b.s.step([b.m],b.p,.1,bounds);ok(b.m.dx!==0&&b.m.dy!==0,'สุ่มเดิน');
 }],
 ['E2c มอน/ผู้เล่นกระเด็นไม่ทะลุกำแพงหรือขอบลานและdtผิดถูกปฏิเสธ',async()=>{
  const s=await createSlimeSimulation({blocked:x=>x>20}),p={...s.initial(),x:10,y:0},m={id:'m',x:19,y:0,level:1,hp:3,phase:.4,dx:1,dy:0,cool:99};s.step([m],p,.1,bounds);ok(m.x<=20,'กำแพง');s.move(p,500,0,bounds);ok(p.x<=20,'playerwall');const a=await setup();a.m.x=95;a.m.kx=240;a.m.ky=0;a.m.cool=99;a.s.step([a.m],a.p,.1,bounds);ok(a.m.x<=96,'ขอบ');const before=JSON.stringify(a.m);for(const dt of [-1,NaN,.121]){let threw=false;try{a.s.step([a.m],a.p,dt,bounds);}catch(e){threw=e.code==='combat-simulation';}ok(threw,'dtผิด');eq(JSON.stringify(a.m),before);}
 }],
 ['E2c สัมผัส20pxหลังphase.3: ดาเมจ3 iframe.8 stun.28 และcooldown1.2',async()=>{
  const {s,p,m}=await setup();p.x=10;m.phase=.35;s.step([m],p,.01,bounds);eq(p.hp,97);near(p.iframe,.8,'iframe');near(p.stunT,.28,'stun');near(m.cool,1.2,'cooldown');eq(p.lastHit.damage,3);ok(p.stunned&&p.alive,'ชะงัก');const hp=p.hp;s.step([m,{...m,id:'second',cool:0}],p,.01,bounds);eq(p.hp,hp,'iframeร่วมกัน');
 }],
 ['E2c ถูกตีซ้ำใน4วิเป็น11+กระเด็น240 แล้วรีเซ็ตcombo',async()=>{
  const {s,p,m}=await setup();p.x=10;s.hurt(p,m);p.iframe=0;s.hurt(p,m);eq(p.hp,86);eq(p.lastHit.damage,11);eq(p.lastHit.heavy,true);eq(p.kx,240);eq(p.combo,0);eq(p.comboT,0);p.iframe=0;s.hurt(p,m);eq(p.hp,83,'รอบใหม่กลับ3');
 }],
 ['E2c comboหมด4วิไม่บวก8 และฟื้นเลือดหลัง4.5วิ2.2/วิ',async()=>{
  const {s,p,m}=await setup();p.x=10;s.hurt(p,m);p.kx=p.ky=0;for(let i=0;i<45;i++)s.vitals(p,.1,bounds);near(p.hp,97,'ยังไม่regenที่4.5');s.vitals(p,.1,bounds);near(p.hp,97.22,'regen');s.hurt(p,m);near(p.hp,94.22,'comboหมดเหลือ3');
 }],
 ['E2c ฟันแล้วมอนhurt.25และกระเด็น240 หยุดสวนระหว่างhurt',async()=>{
  const {s,p,m}=await setup();p.x=10;m.x=0;m.phase=.4;s.slash(m,p);near(m.hurt,.25,'hurt');near(m.kx,-240,'knockback');s.step([m],p,.1,bounds);eq(p.hp,100,'ไม่สวน');ok(m.x<0,'กระเด็น');ok(Math.abs(m.kx)<240,'หน่วง');
 }],
 ['E2c ศพ/pendingไม่เดินไม่ตี เลือด0ไม่ฟื้นหรือสวนต่อเอง',async()=>{
  const {s,p,m}=await setup();p.x=0;p.hp=1;m.x=0;m.phase=.4;s.step([m],p,.01,bounds);eq(p.hp,0);eq(p.alive,false);eq(p.moving,false);s.vitals(p,10,bounds);eq(p.hp,0,'ไม่autoฟื้น');const dead={...m,dead:true,phase:.85,x:0},pending={...m,pending:{id:'proof'},phase:.85,x:0};const alive={...s.initial(),x:10,y:0};s.step([dead,pending],alive,.1,bounds);eq([dead.x,pending.x],[0,0]);eq(alive.hp,100);
 }],
 ['E2c cooldownมอน/iframeผู้เล่นไม่ถูกล้างด้วยdt0หรือข้อความรัว',async()=>{
  const {s,p,m}=await setup();p.x=10;m.phase=.4;s.step([m],p,.01,bounds);for(let i=0;i<100;i++)s.step([m],p,0,bounds);eq(p.hp,97);near(m.cool,1.2,'cooldownคงเดิม');near(p.iframe,.8,'iframeคงเดิม');
 }],
];
