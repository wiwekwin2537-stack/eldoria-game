/* ตรวจทุกแหล่งรีเจนหลักและผลฮีลจากเพื่อน โดยคงมานา/ลดดาเมจเดิม */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('js/014-core.js','utf8'), core=fs.readFileSync('js/031-core.js','utf8');
const start=src.indexOf('const BOSS_HEAL_FIGHT=');assert.ok(start>=0);
const helper=src.slice(start,src.indexOf('let ctx;',start));
const timers=[];let clock=1000;
const box={P:{hp:100,mp:10,dead:false,stun:0,iframe:0,kx:0,ky:0,comboT:0,red:0,sinceHit:99,x:0,y:0},BAL:{hp:20000,mp:100,regen:2.2,mpRegen:2,regenDelay:4.5},D:null,PAUSED:false,pvp:false,
 pvpOn8:()=>box.pvp,setInterval:fn=>timers.push(fn),pasOn:()=>[{regen:.02,mpr:.5}],PTX:()=>({hpr:.026,mpr:.4}),
 hpb:{style:{}},mpb:{style:{}},hpt:{},mpt:{},faceEl:{style:{}},srvNow:()=>clock,performance:{now:()=>1000},Math,console};
vm.createContext(box);box.window=box;
vm.runInContext(helper+'\n'+src.slice(src.indexOf('function playerTick')),box);
for(const marker of ['for(const p of pasOn())','const x=PTX();if(x.hpr']){
 const line=core.split('\n').find(l=>l.startsWith('setInterval')&&l.includes(marker));assert.ok(line);vm.runInContext(line,box);
}
const boss={boss:1,aggro:1,dead:false,hp:1000};
for(const [name,pvp,D,blocked] of [['outdoor_pvp',true,null,true],['boss',false,{boss,mobs:[boss]},true],['secondary_boss',false,{mobs:[boss]},true],['normal',false,null,false],['dormant',false,{boss:{...boss,aggro:0}},false],['defeated',false,{boss:{...boss,dead:true}},false],['town',false,{town:1,boss},false]]){
 box.pvp=pvp;box.D=D;box.P.hp=100;box.P.mp=10;
 box.playerTick(1);timers.forEach(fn=>fn());
 assert.equal(box.P.hp===100,blocked,name+' HP regeneration');assert.ok(box.P.mp>10,name+' MP regeneration preserved');
}
/* ยิงบอสจากไกลแล้ว AI หยุดไล่ ต้องยังห้ามฮีลจนพ้นช่วงพักการต่อสู้เดิม */
box.pvp=false;box.D={boss,mobs:[boss]};boss.aggro=0;box.noteBossFight(boss);assert.equal(box.passiveRegenBlocked(),true);
clock+=box.BAL.regenDelay*1000-1;assert.equal(box.passiveRegenBlocked(),true);
clock+=2;assert.equal(box.passiveRegenBlocked(),false,'recovery resumes after combat delay');
boss.aggro=1;
/* ฮีลและบัฟที่กดใช้จากปาร์ตี้ยังทำงานใน PvP/บอส */
box.Q52={};box.NET={on:false,others:new Map()};box.RX52={on:false};box.useSkill=()=>{};box.onSx33=()=>{};box.netScene=()=> 'test';box.PTY35={mem:[{id:7}]};box.say=()=>{};box.dmgTxt=()=>{};
const partyTimers=[];box.setInterval=fn=>partyTimers.push(fn);
vm.runInContext(fs.readFileSync('js/084-fix52.js','utf8'),box);
function support(c){box.onSx33({k:'fx',sc:'test',from:7,sup:[{c,x:0,y:0,nm:'เพื่อน'}]})}
box.pvp=true;box.D=null;box.P.hp=100;box.P.stun=2;support('cleric:0');assert.ok(box.P.hp>100,'party instant healing works in PvP');assert.equal(box.P.stun,0,'cleanse still works');
support('paladin:4');assert.equal(box.PB52.dr,.15,'party damage reduction is retained');
box.P.hp=100;box.PB52.last=null;partyTimers.forEach(fn=>fn());assert.equal(box.P.hp,100,'paladin party defense must not heal');support('cleric:2');partyTimers.forEach(fn=>fn());assert.ok(box.P.hp>100,'cleric party HoT works in PvP');
box.pvp=false;box.D={boss,mobs:[boss]};box.P.hp=100;box.PB52.last=null;partyTimers.forEach(fn=>fn());assert.ok(box.P.hp>100,'active party HoT works in boss combat');
box.D=null;partyTimers.forEach(fn=>fn());assert.ok(box.P.hp>100,'party HoT resumes outside combat');
box.pvp=true;box.PB52.regU=0;box.P.hp=90;box.PB52.last=100;partyTimers.forEach(fn=>fn());assert.equal(box.P.hp,91.5,'damage reduction refunds remain active during combat');
console.log('COMBAT HEALING UNIT PASS');
/* ผู้เล่นเครื่องที่สองต้องเห็นการถอนตัวจาก combat รวมข้อมูลดาเมจล่าสุดจาก host */
const shared=fs.readFileSync('js/064-fix33.js','utf8');const packet=shared.slice(shared.indexOf("if(k==='ms')"),shared.indexOf("if(k==='mall')"));
const mirror={boss:1,aggro:1,hp:1000,max:1000,dead:false,x:0,y:0};box.D={zone:{},boss:mirror,mobs:[mirror]};box.pvp=false;box.mobByUid33=()=>mirror;box.reqFull33=()=>{};
vm.runInContext('function snapshot(d){const k="ms";'+packet+'}',box);
box.snapshot({v:[['b',0,0,1000,'idle',1,0,0,null,0,null]]});assert.equal(mirror.aggro,0);assert.equal(box.passiveRegenBlocked(),false,'mirror is no longer stuck in aggro after disengage');
box.snapshot({v:[['b',0,0,900,'idle',1,0,0,null,0,null]]});assert.equal(box.passiveRegenBlocked(),true,'remote ranged damage still blocks healing');
const shootLines=core.split('\n').filter(l=>l.includes('ZPROJ.push({'));
assert.equal(shootLines.length,3);assert.ok(shootLines.every(l=>/boss:!![mb]\.boss/.test(l)),'boss projectiles retain source flag for zHurt');
console.log('SHARED BOSS RECOVERY PASS');
