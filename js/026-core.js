function attack(){if(P.at<0&&P.stun<=0){if(interact())return;autoDraw();P.at=0;atkId++;sfx(P.tool==='sword'?'swing':'swing2')}}
function act(){attack()}
document.querySelectorAll('[data-d]').forEach(b=>{const k=b.dataset.d;
 b.onpointerdown=e=>{e.preventDefault();keys[k]=1};
 ['onpointerup','onpointerleave','onpointercancel'].forEach(ev=>b[ev]=()=>{keys[k]=0})});
document.getElementById('atk').onpointerdown=e=>{e.preventDefault();attack()};if(!COARSE)cv.onpointerdown=attack;
const rb=document.getElementById('run');rb.onclick=()=>{P.run=!P.run;rb.style.outline=P.run?'3px solid #3a8dff':''};
document.getElementById('dashb').onpointerdown=e=>{e.preventDefault();doDash()};
const KM={ArrowUp:'u',w:'u',ArrowDown:'d',s:'d',ArrowLeft:'l',a:'l',ArrowRight:'r',d:'r'};
const kk=e=>KM[e.key.length===1?e.key.toLowerCase():e.key];
// ปุ่มเดิน WASD/ลูกศร · Shift พุ่ง · Ctrl วิ่ง (เปลี่ยนเป็น C ได้ในตั้งค่า เพราะ Ctrl+W ในบางเบราว์เซอร์จะปิดแท็บ)
const isRunKey=e=>SET.runKey==='c'?(e.key==='c'||e.key==='C'):e.key==='Control';
addEventListener('keydown',e=>{if(isRunKey(e)){keys.ctrl=1;e.preventDefault();return}
 if(e.key==='Shift'){e.preventDefault();if(!e.repeat)doDash();return}
 if(SET.runKey!=='c')keys.ctrl=e.ctrlKey?1:keys.ctrl;
 const k=kk(e);
 if(k){e.preventDefault();keys[k]=1}else if(e.key==='e'||e.key===' '){e.preventDefault();act()}else if('jJfF'.includes(e.key)&&e.key.length===1){attack()}else if(e.key==='i'||e.key==='I'){toggleBag()}else if(e.key==='k'||e.key==='K'){doDash()}else if(e.key==='m'||e.key==='M'){toggleMute()}else if(e.key==='Escape'||e.key==='p'||e.key==='P'){toggleMenu()}else if(e.key==='t'||e.key==='T'){useScroll()}else if(e.key.length===1&&'1234'.includes(e.key)){quickUse(+e.key-1)}else if(e.key==='q'||e.key==='Q'){stowToggle()}});
addEventListener('keyup',e=>{if(isRunKey(e))keys.ctrl=0;const k=kk(e);if(k)keys[k]=0});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0;stopJoy()});
addEventListener('beforeunload',e=>{if(keys.ctrl){e.preventDefault();e.returnValue=''}}); // กด Ctrl+W ตอนวิ่งพลาด → ถามก่อนปิดแท็บ
const bagEl=document.getElementById('bag');function toggleBag(){bagEl.hidden=!bagEl.hidden;if(!bagEl.hidden&&typeof renderBag==='function')renderBag()}
document.getElementById('bagb').onclick=toggleBag;
document.getElementById('dbg').onclick=()=>{dbg=!dbg};
document.getElementById('cp').onclick=async()=>{const L=trees.filter(t=>t.alive).map(t=>({id:t.id,tx:t.tx,ty:t.ty,px:t.px,py:t.py,border:t.border})),m=document.getElementById('msg');
 try{await navigator.clipboard.writeText(JSON.stringify(L));m.textContent='คัดลอกพิกัดต้นไม้ '+L.length+' ต้นแล้ว'}catch(e){m.textContent='คัดลอกไม่ได้ในหน้านี้ — พิมพ์ GAME.trees ในคอนโซลแทน'}};
window.GAME={trees,map,P,slimes,BAL};
(()=>{const f=document.getElementById('face').getContext('2d');
 const g=f.createLinearGradient(0,0,0,48);g.addColorStop(0,'#4a7bb8');g.addColorStop(1,'#2b4a73');f.fillStyle=g;f.fillRect(0,0,48,48);
 f.fillStyle='#0d0d12';f.fillRect(5,38,38,10);f.fillStyle='#14141a';f.fillRect(5,44,38,4);
 f.fillStyle='#f1d2b0';f.fillRect(12,14,24,24);
 f.fillStyle='#14141a';f.fillRect(10,10,28,10);f.fillRect(10,10,5,22);f.fillRect(33,10,5,22);f.fillRect(11,3,8,9);f.fillRect(21,1,7,11);f.fillRect(31,4,7,8);
 f.fillRect(18,26,4,6);f.fillRect(27,26,4,6);f.fillStyle='#b5796a';f.fillRect(21,34,7,2)})();
const barEl=document.getElementById('bar');

function selectTool(i){quickUse(i)}
function cycleTool(){stowToggle()}
say('WASD เดิน · Shift พุ่ง · Ctrl วิ่ง · J/⚔️ ใช้ของ · E คุย/เปิดประตู · 1-4 ช่องลัด (ชักดาบ/เครื่องมือ/ยา) · Q เก็บของ · T ม้วนวาป · Esc ตั้งค่า');
window.GAME.ores=ores;window.GAME.drops=drops;
// ---- ซูม ----
let Z=1;const ZS=[.5,.75,1,1.25,1.5];let zi=2;
function setZ(d){zi=Math.max(0,Math.min(4,zi+d));Z=ZS[zi];say('ซูม '+Math.round(Z*100)+'%')}

document.getElementById('zin').onclick=()=>setZ(1);document.getElementById('zout').onclick=()=>setZ(-1);
cv.addEventListener('wheel',e=>{e.preventDefault();setZ(e.deltaY<0?1:-1)},{passive:false});
// ---- จอยสติ๊กบนจอ (มือถือ/จอสัมผัส) + เลือกรูปแบบปุ่มควบคุม ----
// SET.ctl: joy จอยสติ๊ก · dpad ปุ่มลูกศร · kbd ซ่อนปุ่มบนจอ (เล่นด้วยคีย์บอร์ด) · joyMode: float ลอยตามนิ้ว / fixed ตายตัว · joySide: left/right
const joyZone=document.getElementById('joyzone'),joyBase=document.getElementById('joybase'),joyKnob=document.getElementById('joyknob');
let joyId=null,joyC={x:0,y:0};
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
function joyCenterFixed(r){const R=SET.joySize/2,m=14;return{x:SET.joySide==='right'?r.right-m-R:r.left+m+R,y:r.bottom-m-R}}
function joyPlace(c){const r=joyZone.getBoundingClientRect(),R=SET.joySize/2;joyBase.style.left=(c.x-r.left-R)+'px';joyBase.style.top=(c.y-r.top-R)+'px'}
function joyKnobAt(dx,dy){const R=SET.joySize/2,d=Math.hypot(dx,dy),k=d>R?R/d:1;joyKnob.style.transform='translate(calc(-50% + '+dx*k+'px),calc(-50% + '+dy*k+'px))'}
function joyStyle(){const s=Math.round(SET.joySize*(innerHeight<520?.8:1));joyBase.style.width=joyBase.style.height=s+'px';joyKnob.style.width=joyKnob.style.height=s*.42+'px';joyBase.style.opacity=SET.joyOp;joyZone.classList.toggle('r',SET.joySide==='right');joyBase.classList.toggle('run',!!SET.joyRun)}
function joyRest(){joyKnobAt(0,0);if(SET.joyMode==='fixed'){joyBase.style.display='block';joyPlace(joyCenterFixed(joyZone.getBoundingClientRect()))}else joyBase.style.display='none'}
function stopJoy(){joyId=null;JOY.on=false;JOY.x=JOY.y=JOY.m=0;if(SET.ctl==='joy')joyRest()}
function joyMove(e){const R=SET.joySize/2,dx=e.clientX-joyC.x,dy=e.clientY-joyC.y,d=Math.hypot(dx,dy),dz=.14,m=d/R;joyKnobAt(dx,dy);
 JOY.m=m;if(m<dz){JOY.x=JOY.y=0;return}const k=Math.min(1,(m-dz)/(1-dz))/Math.max(d,1e-6);JOY.x=dx*k;JOY.y=dy*k}
joyZone.addEventListener('pointerdown',e=>{if(SET.ctl!=='joy'||joyId!==null)return;e.preventDefault();const r=joyZone.getBoundingClientRect(),R=SET.joySize/2;
 if(SET.joyMode==='fixed'){const c=joyCenterFixed(r);if(Math.hypot(e.clientX-c.x,e.clientY-c.y)>R*1.7)return;joyC=c}
 else{joyC={x:clampN(e.clientX,r.left+R,r.right-R),y:clampN(e.clientY,r.top+R,r.bottom-R)}}
 joyId=e.pointerId;try{joyZone.setPointerCapture(e.pointerId)}catch(_){}JOY.on=true;joyBase.style.display='block';joyPlace(joyC);joyMove(e)});
joyZone.addEventListener('pointermove',e=>{if(e.pointerId===joyId){e.preventDefault();joyMove(e)}});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])joyZone.addEventListener(ev,e=>{if(e.pointerId===joyId)stopJoy()});
joyZone.addEventListener('contextmenu',e=>e.preventDefault());
function applyCtl(){const m=SET.ctl;document.getElementById('padd').hidden=m!=='dpad';document.getElementById('acts').hidden=m==='kbd';joyZone.hidden=m!=='joy';
 for(const k of 'udlr')keys[k]=0;stopJoy();joyStyle();if(m==='joy')joyRest()}
addEventListener('resize',()=>{if(SET.ctl==='joy'&&joyId===null){joyStyle();joyRest()}});
applyCtl();
