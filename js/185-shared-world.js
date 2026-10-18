// =====================================================================
// 185-shared-world.js (v5.12) — 🌍 โลกร่วมกัน: ต้นไม้/แร่ เซิร์ฟเวอร์เป็นคนตัดสิน (ทุ่งหญ้า + แมพเหมือง/ป่า ฉาก 'field' และ 'z:N')
//  เดิม: ต้นไม้/แร่เก็บสถานะ (ล้ม/เลือด/ตัวนับงอกใหม่) ในเครื่องใครเครื่องมัน → ไม่มีใครเห็นตรงกัน แย่งกันฟาร์มไม่ได้
//  ใหม่: ทุกครั้งที่ฟัน/ขุด เครื่องส่ง fhit ให้เซิร์ฟเวอร์ (field.js) → เซิร์ฟเวอร์ลดเลือดกลาง · คนฟัน/ขุดครั้งสุดท้ายจนล้ม = ได้ของ
//   ทุกคนในฉากเห็นต้นไม้ล้ม/แร่แตก/งอกใหม่พร้อมกัน (fres) · เข้าฉากทีหลังขอสถานะปัจจุบัน (fq → fsnap)
//  ไม่ได้ต่อเซิร์ฟเวอร์ / เซิร์ฟเวอร์รุ่นเก่า (ไม่ตอบ fsnap) → FW.act()=false → เกมทำงานแบบเดิมในเครื่อง (ออฟไลน์เล่นคนเดียวได้)
//  จุดที่เรียก FW: hitTree (016) · hitOre/zMine (031) · chop15 (046) · งอกใหม่ในเครื่อง: updWorld (016) · updZone (031,064) · regrow149 (176)
// =====================================================================
try{
const FW=window.FW={srv:false,_a:false,reqSc:'',reqWs:null,snap:null,pend:false,tries:0};
const scOK=sc=>sc==='field'||/^z:\d+$/.test(sc);
const curSc=()=>{try{return netScene()}catch(e){return ''}};
FW.act=()=>FW._a; /* แคชค่า (ถูกเรียกทุกเฟรมจากลูปงอกใหม่) — อัปเดตทุก 250ms และตอนรับข้อความเซิร์ฟเวอร์ */
const refresh=()=>{try{if(!NET.on)FW.srv=false;FW._a=!!(NET.on&&FW.srv&&scOK(curSc()))}catch(e){FW._a=false}};
// ---------- ส่งการฟัน/ขุดให้เซิร์ฟเวอร์ ----------
FW.send=(k,o,dm,rg)=>{try{const tx=o.tx,ty=o.ty,x=o.px!=null?o.px:(o.x!=null?o.x:tx*T+16),y=o.px!=null?ty*T+16:(o.y!=null?o.y:ty*T+16);
 netSend({t:'fhit',sc:curSc(),key:k+tx+','+ty,kd:o.kind||('t_'+o.size),max:o.max,dmg:Math.max(1,Math.round(dm)),rg,x:Math.round(x),y:Math.round(y)})}catch(e){console.warn('FW.send',e)}};
// ---------- หาโหนดในเครื่องจากคีย์ ----------
function nodeOf(sc,key){const k=key[0],a=key.slice(1).split(','),tx=+a[0],ty=+a[1];
 if(sc==='field')return k==='t'?treeAt[ty*W+tx]:oreAt[ty*W+tx];
 if(D&&D.zone&&D.zone.oreAt)return D.zone.oreAt[ty*ZW+tx]||null;return null}
const keyOf=(sc,o)=>sc==='field'?(o.size!==undefined&&o.wood!==undefined?'t':'o')+o.tx+','+o.ty:'o'+o.tx+','+o.ty;
const isDead=(sc,o)=>sc==='field'?(o.size!==undefined&&o.wood!==undefined?o.alive===false:map[o.ty][o.tx]===RUBBLE):o.alive===false;
const isFTree=(sc,o)=>sc==='field'&&o.size!==undefined&&o.wood!==undefined;
const pos=o=>isFTree('field',o)?[o.px,o.ty*T+16]:(o.x!=null?[o.x,o.y]:[o.tx*T+16,o.ty*T+16]);
const snd=(n,o)=>{try{const p=pos(o);sfx(n,p[0],p[1])}catch(e){}};
// ---------- ล้ม / แตก ----------
function setDead(sc,o,mine,bn,leftMs,anim){const left=Math.max(1,(leftMs||60000)/1000);
 if(isFTree(sc,o)){if(o.alive===false)return;o.alive=false;map[o.ty][o.tx]=STUMP;o.rg149=null;o.hp=0;
  if(anim){falling.push({tr:o,ft:0,dir:P.x<o.px?1:-1,landed:false,own:mine,bn});sfx('creak');say(mine?'ต้นไม้กำลังล้ม!':'🌳 '+(bn||'ผู้เล่นอื่น')+' ฟันต้นนี้ล้มก่อน');if(mine)try{st20Add('tree')}catch(e){}}return}
 if(sc==='field'){if(map[o.ty][o.tx]===RUBBLE)return;map[o.ty][o.tx]=RUBBLE;o.regen=left;o.hp=0;
  if(anim){snd('crumble',o);if(mine)rewardOre(sc,o);else say('⛏️ '+(bn||'ผู้เล่นอื่น')+' ขุดแร่นี้ได้ก่อน')}return}
 if(o.alive===false)return;o.alive=false;o.regen=left;o.hp=0;
 if(anim){const K=OREK[o.kind],tree=!!(K&&K.tree);
  if(tree){try{window.FALL89&&FALL89.push({kind:o.kind,x:o.tx*T+16,y:o.ty*T+28,dir:P.x<o.tx*T+16?1:-1,t0:performance.now(),landed:false,sc:D&&D.zone?D.zone:null})}catch(e){}sfx('creak')}else snd('crumble',o);
  if(mine)rewardOre(sc,o);else say((tree?'🌳 ':'⛏️ ')+(bn||'ผู้เล่นอื่น')+(tree?' ตัดต้นนี้ล้มก่อน':' ขุดแร่นี้ได้ก่อน'))}}
/* ของรางวัลของ "คนล้ม" เท่านั้น — สูตรเดียวกับ hitOre/zMine/chop15 เดิม */
function rewardOre(sc,o){try{const K=OREK[o.kind],n=K.cnt[0]+Math.floor(Math.random()*(K.cnt[1]-K.cnt[0]+1)),x=o.x!=null?o.x:o.tx*T+16,y=o.y!=null?o.y:o.ty*T+16;
 for(let k=0;k<n;k++)addDrop(K.drop,x,y);
 if(sc!=='field'&&K.tree){say('🌳 ตัด'+K.n+'ล้ม! ได้'+MN(K.drop)+' +'+n);gainXp(K.xp*3);try{st20Add('tree')}catch(e){}}
 else{say('ขุด'+K.n+'แตก! ได้'+(K.drop==='gem'?'เพชร':MN(K.drop))+' +'+n);gainXp(sc==='field'?K.xp:K.xp*(1+D.zone.zi));try{questEv('mine')}catch(e){}try{st20Add('ore')}catch(e){}}}catch(e){console.warn('FW.reward',e)}}
// ---------- งอกใหม่ / ฟื้น ----------
function revive(sc,o,anim){
 if(isFTree(sc,o)){if(o.alive!==false&&map[o.ty][o.tx]===TREE){o.hp=o.max;return}if(falling.some(f=>f.tr===o))falling.splice(falling.findIndex(f=>f.tr===o),1);
  map[o.ty][o.tx]=TREE;o.alive=true;o.hp=o.max;o.shake=0;o.bar=0;o.fade=0;o.rg149=null;
  if(anim)for(let k=0;k<8;k++)fx.push({x:o.px+(Math.random()-.5)*36*o.sc,y:o.ty*T+20-Math.random()*40*o.sc,vx:(Math.random()-.5)*40,vy:-20-Math.random()*30,l:.7,c:'90,190,80'});return}
 if(sc==='field'){map[o.ty][o.tx]=ORE;o.hp=o.max;o.shake=0;o.bar=0;return}
 o.alive=true;o.hp=o.max;o.shake=0}
// ---------- รับสถานะจากเซิร์ฟเวอร์ ----------
function applyOne(sc,o,m,anim){const dead=isDead(sc,o),mine=!!m.by&&m.by===NET.id;
 if(m.dead&&!dead)setDead(sc,o,mine,m.bn,m.left,anim);
 else if(!m.dead&&dead)revive(sc,o,anim);
 else if(!m.dead){const dmg=o.hp>m.hp;o.hp=m.hp;if(anim&&dmg&&m.hb&&m.hb!==NET.id){o.shake=.3;o.bar=2;snd(isFTree(sc,o)||(OREK[o.kind]&&OREK[o.kind].tree)?'chop':'mine',o)}}
 else{if(sc==='field'){if(o.regen!=null)o.regen=Math.max(1,(m.left||1000)/1000)}else o.regen=Math.max(1,(m.left||1000)/1000)}}
FW.onRes=m=>{try{if(!m||m.sc!==curSc())return;const o=nodeOf(m.sc,m.key);if(!o)return;applyOne(m.sc,o,m,true)}catch(e){console.warn('FW.onRes',e)}};
FW.onSnap=m=>{FW.srv=true;FW.snap=m;FW.pend=true;FW.tries=0;refresh()};
function trySnap(){const m=FW.snap;if(!m||!FW.pend)return;const sc=curSc();if(sc!==m.sc){FW.pend=false;return}
 const idx=new Map();for(const e of m.list)idx.set(e.key,e);let nodes=null;
 if(sc==='field')nodes=trees.concat(ores);else if(D&&D.zone&&D.zone.ores)nodes=D.zone.ores;
 if(!nodes||!nodes.length){if(++FW.tries>24)FW.pend=false;return}
 for(const o of nodes){const key=keyOf(sc,o),e=idx.get(key);
  if(isFTree(sc,o)&&falling.some(f=>f.tr===o))continue;
  const dead=isDead(sc,o);
  if(e)applyOne(sc,o,e,false);else if(dead)revive(sc,o,false);else if(o.hp<o.max)o.hp=o.max}
 FW.pend=false}
// ---------- ผูกเข้ากับข้อความเน็ต ----------
{const _nm=netMsg;netMsg=function(d){if(d&&d.t==='fres'){FW.onRes(d);return}if(d&&d.t==='fsnap'){FW.onSnap(d);return}return _nm.apply(this,arguments)};window.netMsg=netMsg}
setInterval(()=>{try{refresh();const sc=curSc(),ok=NET.on&&scOK(sc);
 if(!ok){FW.reqSc='';return}
 if(FW.reqSc!==sc||FW.reqWs!==NET.ws){FW.reqSc=sc;FW.reqWs=NET.ws;FW.pend=false;netSend({t:'fq',sc})}
 if(FW.pend)trySnap()}catch(e){}},250);
FW._t={nodeOf,applyOne,trySnap,keyOf,isDead,setDead,revive};
/* REG136 */
try{if(window.REG136)REG136.push(['โลกร่วมกัน: ต้นไม้/แร่ ส่ง fhit ให้เซิร์ฟเวอร์ · ล้มด้วยคำสั่งเซิร์ฟเวอร์ (fix 185)',async()=>{
 if(typeof FW.act!=='function'||typeof FW.send!=='function'||!FW._t)return 'FW ไม่ครบ';
 if(typeof hitTree!=='function'||!/FW\.act\(\)/.test(String(hitTree)))return 'hitTree ไม่ถามเซิร์ฟเวอร์';
 return null}])}catch(e){}
}catch(e){console.warn('fix185 shared-world',e)}
