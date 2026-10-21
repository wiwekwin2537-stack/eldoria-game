const P={tool:'sword',hp:100,mp:50,iframe:0,stun:0,kx:0,ky:0,combo:0,comboT:0,red:0,sinceHit:99,x:6.5*T,y:6.5*T,dir:'d',t:0,mv:false,run:false,at:-1,dash:0,dcd:0,dv:[0,1]};
/* v5.32: หยุดเฉพาะรีเจนอัตโนมัติระหว่าง PvP/สู้บอส; สกิลฮีลที่กดใช้และบัฟจากสกิลทำงานเดิม */
const BOSS_HEAL_FIGHT=new WeakMap();
function noteBossFight(m){
 if(typeof D==='undefined'||!D||!m||!m.boss)return;
 const b=m.hp==null?(D.boss||(D.mobs||[]).find(x=>x.boss&&!x.dead)):m;
 if(b)BOSS_HEAL_FIGHT.set(b,{scene:D,until:srvNow()+BAL.regenDelay*1000});
}
/* v5.52: ฮีลทุกแหล่งระหว่างสู้ PvP (สนามประลอง · ดวล · โดนผู้เล่นตีภายใน 10 วิ) ได้ผล 40% — สายฮีลยังรอดนานกว่าแต่ไม่อมตะ · นอก PvP ฮีลเต็มเหมือนเดิม */
const PVPHEAL52={k:.4,last:null,hitT:-1e9,fight(){if(typeof pvpOn8!=='function'||!pvpOn8())return false;try{if(inArena8()||(D&&D.duel29))return true}catch(e){}return performance.now()-this.hitT<10000},
 tick(){if(P.dead||this.last==null||!this.fight()){this.last=P.dead?null:P.hp;return}if(P.hp>this.last)P.hp=this.last+(P.hp-this.last)*this.k;this.last=P.hp}};window.PVPHEAL52=PVPHEAL52;
function passiveRegenBlocked(){
 if(typeof pvpOn8==='function'&&pvpOn8())return true;
 if(typeof D==='undefined'||!D||D.town||D.shop||D.home)return false;
 const fighting=m=>{if(!m||!m.boss||m.dead||!(m.hp>0))return false;const hit=BOSS_HEAL_FIGHT.get(m);return !!m.aggro||!!(hit&&hit.scene===D&&srvNow()<hit.until)};
 return fighting(D.boss)||(D.mobs||[]).some(fighting);
}
let ctx;const inv={wood:0,ore:0,gel:0,coin:0,ingot:0,bottle:0,hpp:0,mpp:0},keys={},cv=document.getElementById('c');ctx=cv.getContext('2d');
const solid=t=>(t===WATER&&!(window.SWIM10&&SWIM10()))||t===ORE||t===DOOR||t===WARP;
const hit=(x,y)=>{if(D)return dhit(x,y);for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);if(!map[ty]||map[ty][tx]===undefined||solid(map[ty][tx]))return true}return false};
const DIRV={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
const target=()=>{const v=DIRV[P.dir];return [Math.floor((P.x+v[0]*20)/T),Math.floor((P.y+v[1]*20)/T)]};
const JOY={on:false,x:0,y:0,m:0}; // จอยสติ๊กบนจอ: x,y = ทิศ(-1..1) · m = ระยะดัน(0..1)
const isRun=()=>(P.run||keys.ctrl||(JOY.on&&SET.joyRun&&JOY.m>.92))&&P.fa>3; // Ctrl ค้าง = วิ่ง · ดันจอยสุด = วิ่ง
const ghosts=[];
// ---- ผู้เล่นโดนตี / เลือด / มานา ----
function hurtPlayer(sl){
 sl.cool=BAL.slimeCd;sfx('hurt');if(P.recall>0)cancelRecall('โดนโจมตี — การวาปถูกยกเลิก');
 const d=Math.hypot(P.x-sl.x,P.y-sl.y)||1,nx=(P.x-sl.x)/d,ny=(P.y-sl.y)/d;
 if(P.comboT>0)P.combo++;else P.combo=1;P.comboT=BAL.comboWin;
 let dmg=Math.max(1,BAL.slimeDmg+((sl.lv||1)-1)*2-DEF()),kb=BAL.kb;
 if(P.combo>=2){dmg+=BAL.comboDmg;kb=BAL.kbHeavy;P.combo=0;P.comboT=0}
 P.hp=Math.max(0,P.hp-dmg);P.iframe=BAL.iframe;P.stun=BAL.stun;P.kx=nx*kb;P.ky=ny*kb;P.red=.25;P.sinceHit=0;
 sl.kx=-nx*140;sl.ky=-ny*140;
 for(let i=0;i<14;i++)fx.push({x:P.x,y:P.y-20,vx:(Math.random()-.5)*160,vy:-50-Math.random()*90,l:.7,c:'200,30,40'});
 document.getElementById('msg').textContent=kb>BAL.kb?'โดนสไลม์ซ้ำ! กระเด็นถอยหลัง เลือด -'+dmg:'โดนสไลม์ตี เลือด -'+dmg;
 if(P.hp<=0)die()}
function die(){sfx('die');P.hp=BAL.hp;P.mp=BAL.mp;P.kx=P.ky=0;P.iframe=2;P.stun=.3;P.combo=0;P.recall=0;toTown();
 document.getElementById('msg').textContent='ล้มแล้ว! ฟื้นที่เมืองเอลโดเรีย (จุดเกิด)'}
const hpb=document.getElementById('hpb'),mpb=document.getElementById('mpb'),hpt=document.getElementById('hpt'),mpt=document.getElementById('mpt'),faceEl=document.getElementById('face');
function playerTick(dt){
 PVPHEAL52.tick();
 if(P.stun>0)P.stun-=dt;
 if(P.kx||P.ky){const kx=P.kx*dt,ky=P.ky*dt;if(!hit(P.x+kx,P.y))P.x+=kx;if(!hit(P.x,P.y+ky))P.y+=ky;
  const d=Math.pow(.02,dt);P.kx*=d;P.ky*=d;if(Math.abs(P.kx)+Math.abs(P.ky)<4)P.kx=P.ky=0}
 P.iframe=Math.max(0,P.iframe-dt);P.comboT=Math.max(0,P.comboT-dt);P.red=Math.max(0,P.red-dt);P.sinceHit+=dt;
 if(P.sinceHit>BAL.regenDelay&&!passiveRegenBlocked())P.hp=Math.min(BAL.hp,P.hp+BAL.regen*dt);
 P.mp=Math.min(BAL.mp,P.mp+BAL.mpRegen*dt);
 hpb.style.width=P.hp/BAL.hp*100+'%';mpb.style.width=P.mp/BAL.mp*100+'%';
 hpt.textContent=Math.round(P.hp)+'/'+BAL.hp;mpt.textContent=Math.round(P.mp)+'/'+BAL.mp;
 faceEl.style.borderColor=P.iframe>0?'#ff4a4a':'#e8c14a'}
