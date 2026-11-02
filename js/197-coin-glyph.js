/* v5.94 + v5.98 อีโมจิใหม่ขึ้นเป็นกล่อง □ บนคอมบางเครื่อง (เจ้าของแจ้ง 2026-10-25: ราคา □25 · ไอคอนนินจาเป็นกล่อง · เหรียญบนหัวมอนเป็นกล่อง)
   ต้นเหตุ: อีโมจิรุ่นใหม่ (Unicode 11–15 เช่น 🪙 🥷 🪽 🪵 🪓) ไม่มีในฟอนต์ของ Windows/เบราว์เซอร์รุ่นเก่า → เบราว์เซอร์วาดกล่องแทน
   แก้: ตรวจทีละตัวว่าเครื่องนี้วาดได้ไหม · ตัวที่วาดไม่ได้ →
     - 🪙 = เหรียญทองวาดเอง (หน้าเว็บ: CSS .coin594 · แคนวาส: วงกลมทอง)
     - ตัวอื่น = อีโมจิรุ่นเก่าที่ความหมายใกล้กัน (ตาราง FB)
   ครอบคลุมทั้งหน้าเว็บ (ของเดิม + ที่สร้างทีหลัง) และตัวหนังสือบนแคนวาส (fillText/strokeText เช่น ป้ายเหนือหัวมอน)
   เครื่องที่วาดได้อยู่แล้วไม่เปลี่ยนอะไร · ไม่แตะตัวเลข/ระบบเกม · เทส: ?coinglyph=0 = บังคับโหมดเครื่องไม่มีอีโมจิใหม่ */
(function(){
 const COIN='\u{1FA99}',q=location.search,force0=/[?&]coinglyph=0/.test(q),force1=/[?&]coinglyph=1/.test(q);
 const FB={'\u{1F977}':'🗡️','\u{1FABD}':'🕊️','\u{1FAB6}':'🕊️','\u{1FAB5}':'🌲','\u{1FA93}':'🔨','\u{1FA9E}':'🔮','\u{1FAB7}':'🌸','\u{1FAA4}':'⚙️','\u{1FAE7}':'💧',
  '\u{1FAB2}':'🐞','\u{1FAA8}':'⛰️','\u{1FAC0}':'❤️','\u{1FA9F}':'🖼️','\u{1FA7B}':'💀','\u{1FA82}':'🎈','\u{1FA78}':'💧','\u{1FA80}':'🎯','\u{1F7E2}':'●','\u{1F7E1}':'●',
  '\u{1F9F1}':'🏠','\u{1F9F6}':'🎀','\u{1F9F9}':'🌾','\u{1F9FA}':'👜','\u{1F9FE}':'📜','\u{1F9F0}':'🔧','\u{1F9E4}':'✋','\u{1F9B4}':'💀','\u{1F96C}':'🍀','\u{1F96D}':'🍑',
  '\u{1F9ED}':'🗺️','\u{1F9EA}':'⚗️','\u{1F9E8}':'💥','\u{1F9E1}':'❤️','\u{1F90D}':'🤍','\u{1F9D8}':'🙏','\u{1F9D9}':'🎩','\u{1F9DF}':'💀','\u{1F9D1}':'👤','\u{1F98E}':'🐍','\u{1F94B}':'👊','\u{1F967}':'🍰','\u{1F95A}':'🐣','\u{1F95B}':'🍼'};
 function canDraw(ch){if(force0)return false;if(force1)return true;
  try{const c=canDraw.c||(canDraw.c=document.createElement('canvas'));c.width=c.height=32;const k=c.getContext('2d');k.textBaseline='top';k.font='24px sans-serif';
   const shot=s=>{k.clearRect(0,0,32,32);k.fillText(s,0,0);return c.toDataURL()};const a=shot(ch);canDraw.none=canDraw.none||shot('\u{10FFFD}');canDraw.blank=canDraw.blank||shot('');
   /* ฟอนต์ไม่มีตัวนี้ = วาดเหมือนตัวที่ไม่มีแน่ ๆ (กล่อง) หรือไม่วาดอะไรเลย */
   return a!==canDraw.none&&a!==canDraw.blank}catch(e){return true}}
 const ok=canDraw(COIN),bad={};for(const ch in FB)if(!canDraw(ch))bad[ch]=FB[ch];
 /* ตัวสำรองก็ต้องวาดได้ ถ้าวาดไม่ได้อีกใช้จุดกลม */
 for(const ch in bad)if(bad[ch]!=='●'&&!canDraw(bad[ch].replace('️','')))bad[ch]='●';
 const keys=Object.keys(bad);window.COIN594={ok,swapped:0,bad};
 if(ok&&!keys.length)return;
 const RE=new RegExp((ok?'':COIN+'|')+keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')||'(?!)','u');
 const has=t=>t&&RE.test(t);
 const swapText=t=>{for(const k of keys)if(t.indexOf(k)>=0)t=t.split(k).join(bad[k]);return t};
 if(!ok){const st=document.createElement('style');st.textContent='.coin594{display:inline-block;width:.95em;height:.95em;border-radius:50%;box-sizing:border-box;vertical-align:-.14em;margin:0 .06em;background:radial-gradient(circle at 35% 32%,#fff6b0 0,#ffd23a 45%,#d9a21a 100%);border:1px solid #8a5a0a;box-shadow:inset 0 0 0 1.5px rgba(255,240,170,.55)}';document.head.appendChild(st)}
 const SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,TITLE:1,NOSCRIPT:1};
 function fixText(n){const p=n.parentNode;if(!p||SKIP[p.nodeName]||!has(n.nodeValue))return;let v=swapText(n.nodeValue);
  if(ok||v.indexOf(COIN)<0||p.nodeName==='OPTION'||p.nodeName==='SELECT'){if(!ok)v=v.split(COIN).join('●');if(v!==n.nodeValue)n.nodeValue=v;return}
  const parts=v.split(COIN),f=document.createDocumentFragment();
  parts.forEach((t,i)=>{if(i){const s=document.createElement('i');s.className='coin594';s.setAttribute('aria-label','เหรียญ');f.appendChild(s);window.COIN594.swapped++}if(t)f.appendChild(document.createTextNode(t))});
  p.replaceChild(f,n)}
 function scan(root){if(!root)return;if(root.nodeType===3){fixText(root);return}if(root.nodeType!==1&&root.nodeType!==11)return;if(SKIP[root.nodeName])return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),L=[];let n;while((n=w.nextNode()))if(has(n.nodeValue))L.push(n);L.forEach(fixText);
  /* title (ข้อความลอยตอนชี้) */
  if(root.querySelectorAll)root.querySelectorAll('[title]').forEach(e=>{const t=e.getAttribute('title');if(has(t))e.setAttribute('title',swapText(t).split(COIN).join('●'))})}
 window.COIN594.scan=scan;
 const start=()=>{scan(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')fixText(m.target);else m.addedNodes.forEach(scan)}}).observe(document.body,{childList:true,subtree:true,characterData:true})};
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
 /* แคนวาส: ป้ายเหนือหัวมอน/ตัวเลข/ป้ายต่าง ๆ ที่เขียนด้วย fillText */
 const CP=CanvasRenderingContext2D.prototype,F0=CP.fillText,S0=CP.strokeText,EM=' ';
 function fsize(k){const m=/(\d+(?:\.\d+)?)px/.exec(k.font||'');return m?+m[1]:10}
 function coinAt(k,text,x,y){/* วาดเหรียญทองตรงช่องว่างที่เว้นไว้แทน 🪙 */
  const fs=fsize(k),W=k.measureText(text).width,al=k.textAlign,dir=k.direction==='rtl';let left=x;
  if(al==='center')left=x-W/2;else if(al==='right'||(al==='end'&&!dir)||(al==='start'&&dir))left=x-W;
  const bl=k.textBaseline,cy=bl==='middle'?y:bl==='top'||bl==='hanging'?y+fs*.5:bl==='bottom'||bl==='ideographic'?y-fs*.5:y-fs*.34,r=fs*.38;
  let i=-1;k.save();try{k.shadowColor='transparent';while((i=text.indexOf(EM,i+1))>=0){const cx=left+k.measureText(text.slice(0,i)).width+k.measureText(EM).width/2;
   k.beginPath();k.arc(cx,cy,r,0,7);const g=k.createRadialGradient(cx-r*.3,cy-r*.35,r*.1,cx,cy,r);g.addColorStop(0,'#fff6b0');g.addColorStop(.5,'#ffd23a');g.addColorStop(1,'#d9a21a');k.fillStyle=g;k.fill();k.lineWidth=Math.max(.8,fs*.08);k.strokeStyle='#8a5a0a';k.stroke()}}finally{k.restore()}}
 CP.fillText=function(t,x,y,mw){if(typeof t!=='string'||!has(t))return F0.apply(this,arguments);let v=swapText(t);if(ok||v.indexOf(COIN)<0)return F0.call(this,v,x,y,mw);
  const hadEM=v.indexOf(EM)>=0;v=v.split(COIN).join(EM);const r=mw===undefined?F0.call(this,v,x,y):F0.call(this,v,x,y,mw);if(!hadEM&&mw===undefined)coinAt(this,v,x,y);return r};
 CP.strokeText=function(t,x,y,mw){if(typeof t!=='string'||!has(t))return S0.apply(this,arguments);const v=swapText(t).split(COIN).join(ok?COIN:EM);return mw===undefined?S0.call(this,v,x,y):S0.call(this,v,x,y,mw)};
 const M0=CP.measureText;CP.measureText=function(t){return M0.call(this,typeof t==='string'&&has(t)?swapText(t).split(COIN).join(ok?COIN:EM):t)};
})();
if(window.REG136)REG136.push(['อีโมจิใหม่ (🪙 🥷 ฯลฯ) ไม่ขึ้นเป็นกล่องบนเครื่องที่ไม่มีอีโมจิ ทั้งหน้าเว็บและแคนวาส (v594/v598)',()=>{const C=window.COIN594;if(!C)return'ไม่มีตัวแก้อีโมจิ';const bk=Object.keys(C.bad||{});if(C.ok&&!bk.length)return null;
 const probe='ราคา \u{1FA99}25 \u{1F977}'+bk.join('');const d=document.createElement('div');d.textContent=probe;document.body.appendChild(d);C.scan(d);const t=d.textContent;d.remove();
 if(!C.ok&&t.indexOf('\u{1FA99}')>=0)return'ยังมี 🪙 ในหน้าเว็บ';for(const k of bk)if(t.indexOf(k)>=0)return'ยังมี '+k+' ในหน้าเว็บ';return null}]);
