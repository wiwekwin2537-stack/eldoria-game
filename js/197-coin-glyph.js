/* v5.94 เหรียญ 🪙 ขึ้นเป็นกล่อง □ บนคอมบางเครื่อง (เจ้าของแจ้ง 2026-10-25: ราคาในร้านเป็น □25 · □150)
   ต้นเหตุ: อีโมจิ 🪙 (U+1FA99 · Unicode 13 ปี 2020) ไม่มีในฟอนต์ของ Windows/เบราว์เซอร์รุ่นเก่า → เบราว์เซอร์วาดกล่องแทน
   แก้: ตรวจว่าเครื่องวาด 🪙 ได้ไหม · ถ้าไม่ได้ แทนตัว 🪙 ในหน้าเว็บทุกจุด (162 จุดในโค้ด) ด้วยเหรียญวาดด้วย CSS (.coin594) ทั้งที่มีอยู่แล้วและที่สร้างใหม่
   ไม่แตะตัวเลข/ราคา/ระบบเงิน · เครื่องที่วาด 🪙 ได้อยู่แล้วไม่เปลี่ยนอะไร · บังคับโหมดแทนได้ด้วย ?coinglyph=0 (ใช้เทส) */
(function(){
 const G='\u{1FA99}',q=location.search;
 function supported(){if(/[?&]coinglyph=0/.test(q))return false;if(/[?&]coinglyph=1/.test(q))return true;
  try{const c=document.createElement('canvas');c.width=c.height=32;const k=c.getContext('2d');k.textBaseline='top';k.font='24px sans-serif';
   const shot=s=>{k.clearRect(0,0,32,32);k.fillText(s,0,0);return c.toDataURL()};const coin=shot(G);
   /* ฟอนต์ไม่มีตัวนี้ = วาดเหมือนตัวที่ไม่มีแน่ ๆ (กล่อง) หรือไม่วาดอะไรเลย */
   return coin!==shot('\u{10FFFD}')&&coin!==shot('')}catch(e){return true}}
 const ok=supported();window.COIN594={ok,swapped:0};if(ok)return;
 const st=document.createElement('style');st.textContent='.coin594{display:inline-block;width:.95em;height:.95em;border-radius:50%;box-sizing:border-box;vertical-align:-.14em;margin:0 .06em;background:radial-gradient(circle at 35% 32%,#fff6b0 0,#ffd23a 45%,#d9a21a 100%);border:1px solid #8a5a0a;box-shadow:inset 0 0 0 1.5px rgba(255,240,170,.55)}';
 document.head.appendChild(st);
 const SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,OPTION:1,TITLE:1,NOSCRIPT:1};
 function fixText(n){const p=n.parentNode;if(!p||SKIP[p.nodeName]||n.nodeValue.indexOf(G)<0)return;
  if(p.nodeName==='SELECT'){n.nodeValue=n.nodeValue.split(G).join('●');return}
  const parts=n.nodeValue.split(G),f=document.createDocumentFragment();
  parts.forEach((t,i)=>{if(i){const s=document.createElement('i');s.className='coin594';s.setAttribute('aria-label','เหรียญ');f.appendChild(s);window.COIN594.swapped++}if(t)f.appendChild(document.createTextNode(t))});
  p.replaceChild(f,n)}
 function scan(root){if(!root)return;if(root.nodeType===3){fixText(root);return}if(root.nodeType!==1&&root.nodeType!==11)return;if(SKIP[root.nodeName])return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),L=[];let n;while((n=w.nextNode()))if(n.nodeValue.indexOf(G)>=0)L.push(n);L.forEach(fixText);
  /* option ใน select วาด span ไม่ได้ → ใช้จุดกลม */
  if(root.querySelectorAll)root.querySelectorAll('option').forEach(o=>{if(o.text.indexOf(G)>=0)o.text=o.text.split(G).join('●')})}
 window.COIN594.scan=scan;
 const start=()=>{scan(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')fixText(m.target);else m.addedNodes.forEach(scan)}}).observe(document.body,{childList:true,subtree:true,characterData:true})};
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();
if(window.REG136)REG136.push(['เหรียญ 🪙 ไม่ขึ้นเป็นกล่องบนเครื่องที่ไม่มีอีโมจิ (v594)',()=>{const C=window.COIN594;if(!C)return'ไม่มีตัวแก้เหรียญ';if(C.ok)return null;
 const d=document.createElement('div');d.textContent='ราคา \u{1FA99}25';document.body.appendChild(d);C.scan(d);const bad=d.textContent.indexOf('\u{1FA99}')>=0||!d.querySelector('.coin594');d.remove();return bad?'ยังมี 🪙 ในหน้าเว็บ':null}]);
