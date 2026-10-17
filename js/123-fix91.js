// fix91 (v4.79) — ไล่รายการ 101 ข้อของเจ้าของ (HANDOFF ข้อ 40) ข้อที่ยังไม่เคยทำ:
//  ข้อ 23: ตั้งค่า "ขนาดปุ่มโจมตี/สกิล" 70–150% (เดิมปรับได้แค่จอย)
//  ข้อ 53: เกมเดิมล็อกตัวระหว่างร่าย (P.stun) อยู่แล้ว แต่กดสกิลอื่นระหว่างท่า ปุ่มจะหายเฉย ๆ → ตอนนี้ "จองไว้" แล้วร่ายให้เองทันทีที่ท่าเดิมจบ (ภายใน 1.3 วิ) · สกิลกดต่อ 3 จังหวะยังกดต่อได้ปกติ
//  ข้อ 73: ตรากิลด์ — โล่สีประจำกิลด์ (สีคิดจากชื่อย่อกิลด์ ทุกเครื่องเห็นตรงกัน ไม่ต้องแก้เซิร์ฟเวอร์) หน้าชื่อย่อกิลด์บนหัวตัวละคร
try{
// ---------- ข้อ 23 ขนาดปุ่ม ----------
try{if(!(SET.btn91>0))SET.btn91=1}catch(e){}
const applyBtn91=()=>{try{const a=gid('acts');if(a)a.style.zoom=String(Math.max(.7,Math.min(1.5,+SET.btn91||1)))}catch(e){}};applyBtn91();
{const _tm=toggleMenu;toggleMenu=function(){const r=_tm.apply(this,arguments);try{if(!menuEl.hidden&&!gid('btn91')){const jo=gid('joyopts');const host=jo||menuEl.querySelector('label');if(host){
   const lb=document.createElement('label');lb.id='btn91';lb.innerHTML='ขนาดปุ่มโจมตี/สกิล <b id="btn91v">'+Math.round((SET.btn91||1)*100)+'%</b><input type="range" min="0.7" max="1.5" step="0.05" value="'+(SET.btn91||1)+'">';
   const inp=lb.querySelector('input');inp.oninput=()=>{SET.btn91=+inp.value;gid('btn91v').textContent=Math.round(SET.btn91*100)+'%';applyBtn91();try{saveSet()}catch(e){}};
   (jo||host).insertAdjacentElement('afterend',lb)}}}catch(e){}return r};window.toggleMenu=toggleMenu}
// ---------- ข้อ 53 รอท่าสกิลจบ ----------
const Q91={i:-1,t:0,last:-1,ct:0};window.Q91=Q91;
const posing91=()=>{try{return P.stun>0&&performance.now()-Q91.ct<1500}catch(e){return false}};
{const _us=useSkill;useSkill=function(i){try{if(i!==Q91.last&&posing91()&&!P.dead){Q91.i=i;Q91.t=performance.now();return}}catch(e){}
  const cd0=(CS.cd||[]).slice(),mp0=P.mp;const r=_us.apply(this,arguments);try{if(P.mp<mp0-.01||(CS.cd||[]).some((v,k)=>v>(cd0[k]||0)+.05)){Q91.last=i;Q91.ct=performance.now()}}catch(e){}return r};window.useSkill=useSkill}
// เกมเดิมมีหน่วงหลังท่าจบอีกเล็กน้อย → ลองร่ายซ้ำทุก 40ms จนสำเร็จ หรือครบ 1.3 วินับจากที่กด
setInterval(()=>{try{if(Q91.i<0)return;if(performance.now()-Q91.t>1300){Q91.i=-1;return}if(!posing91()){const i=Q91.i,ct=Q91.ct;Q91.i=-1;Q91.last=-1;useSkill(i);if(Q91.ct===ct&&Q91.i<0){Q91.i=i}}}catch(e){Q91.i=-1}},40);
// ---------- ข้อ 73 ตรากิลด์ ----------
const gcol91=tag=>{let h=0;for(const ch of String(tag))h=(h*31+ch.charCodeAt(0))>>>0;const a=h%360,b=(a+140+(h>>9)%80)%360;return ['hsl('+a+',70%,52%)','hsl('+b+',75%,62%)',(h>>4)%4]};
function emblem91(x,y,tag){const [c1,c2,m]=gcol91(tag);ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(-5,-6);ctx.lineTo(5,-6);ctx.lineTo(5,0);ctx.quadraticCurveTo(5,5,0,7);ctx.quadraticCurveTo(-5,5,-5,0);ctx.closePath();
 ctx.fillStyle=c1;ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.stroke();ctx.fillStyle=c2;
 if(m===0)ctx.fillRect(-1.2,-5,2.4,10);else if(m===1){ctx.beginPath();ctx.arc(0,0,2.6,0,7);ctx.fill()}else if(m===2){ctx.fillRect(-5,-1.2,10,2.4)}else{ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(3,1);ctx.lineTo(-3,1);ctx.closePath();ctx.fill()}ctx.restore()}
window.emblem91=emblem91;
{const _nt=nameTag;nameTag=function(){const r=_nt.apply(this,arguments);try{if(!P.name||P.dead)return r;const tag=window.__IN_OTHER8?window.__OGTAG21:(typeof G21!=='undefined'&&G21.tag);if(!tag)return r;
  const hasT=window.__IN_OTHER8?!!window.__OTTL20:!!myTtl20();ctx.save();ctx.font='900 9px system-ui,"Noto Sans Thai",sans-serif';const w=ctx.measureText('⟦'+tag+'⟧').width;ctx.restore();
  emblem91(Math.round(P.x-w/2-8),Math.round(P.y-(hasT?95:84))-3,tag)}catch(e){}return r};window.nameTag=nameTag}
}catch(e){console.warn('fix91',e)}
