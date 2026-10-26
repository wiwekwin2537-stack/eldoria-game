/* Device input and coordinate adapter; legacy motion owns speed and sliding. */
export async function createWalker(T,world){
 const {createLegacyMotion}=await import('./legacy-motion.js');
 const P={...world.spawn,at:-1,fa:100,hu:100,stats:{agi:0},dir:'d',t:0,mv:false};
 const motion=createLegacyMotion(P,world.grid),keys=new Set(),pad=document.getElementById('walkpad'),knob=document.getElementById('knob'),runButton=document.getElementById('run');
 let enabled=false,held=null,joy={x:0,y:0},running=false;
 function release(){held=null;joy={x:0,y:0};knob.style.transform='translate(-50%,-50%)';keys.clear();P.mv=false}
 function stop(){release();enabled=false;pad.hidden=runButton.hidden=true;running=false;runButton.setAttribute('aria-pressed','false')}
 function setEnabled(on){if(!on){stop();return;}enabled=true;pad.hidden=runButton.hidden=false}
 function updatePointer(e){const b=pad.getBoundingClientRect(),dx=e.clientX-b.left-b.width/2,dy=e.clientY-b.top-b.height/2,r=b.width*.32,n=Math.hypot(dx,dy)||1,k=Math.min(r,n);joy={x:dx/n*k/r,y:dy/n*k/r};knob.style.transform=`translate(calc(-50% + ${dx/n*k}px),calc(-50% + ${dy/n*k}px))`}
 pad.addEventListener('pointerdown',e=>{if(!enabled||held!==null)return;e.preventDefault();held=e.pointerId;pad.setPointerCapture(e.pointerId);updatePointer(e)});
 pad.addEventListener('pointermove',e=>{if(held===e.pointerId)updatePointer(e)});
 const end=e=>{if(held===e.pointerId)release()};for(const ev of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(ev,end);
 const allowed=new Set(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','control']);
 addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!enabled||!allowed.has(k))return;e.preventDefault();keys.add(k)});
 addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden)release()});
 runButton.onclick=()=>{running=!running;runButton.setAttribute('aria-pressed',String(running))};
 return{P,motion,setEnabled,release,get enabled(){return enabled},tick(dt,angle){if(!enabled)return false;let x=joy.x,y=joy.y;if(held===null){x=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));y=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'))}
  const wx=x*Math.cos(angle)+y*Math.sin(angle),wy=-x*Math.sin(angle)+y*Math.cos(angle);P.mv=false;motion.step(wx,wy,dt,running||keys.has('control'));return P.mv;
 }};
}
