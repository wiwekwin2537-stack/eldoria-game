// fix3.js — ชุดแก้ #3 (v4.12)
//  เปลี่ยนอาชีพ: ล้างสถานะสกิล/อัลติ/ท่าโจมตี · เก็บอาวุธผิดสาย + สวมอาวุธสายใหม่ให้เอง · ช่องลัดเรียกชื่อ "อาวุธ" ตามสาย
//  ทิ้งของจากการ์ดไอเท็ม (แตะ 2 ครั้งยืนยัน)
// =====================================================================
window.wName9=()=>{const id=P.armor&&P.armor.sword,it=id&&ITEMS[id];return it?it.name:({staff:'คทา',bow:'ธนู'}[NEEDW[P.cls]]||'ดาบ')};
// ---------- เปลี่ยนอาชีพ ----------
{const _pc=pickClass;pickClass=function(k){const before=P.cls;_pc(k);if(P.cls===before||P.cls!==k)return;
  try{P.draw=false;QS.cur=null;P.cast=0;P.at=0;P.cmb=0;CS.step=0;CS.cd=[0,0,0];CS.win=0;
   try{ULT.cast=null;ULT.fx.length=0}catch(e){}
   try{if(P.cls!=='none'&&typeof ZPROJ!=='undefined')ZPROJ.length=0}catch(e){}
   const need=NEEDW[k];let note='';
   const cur=P.armor.sword,ci=cur&&ITEMS[cur];
   if(ci&&ci.kind!==need){unequip('sword');note='เก็บ'+ci.name+'เข้ากระเป๋าแล้ว'}
   if(!P.armor.sword&&need){const c=Object.keys(GEAR).filter(id=>GEAR[id]>0&&ITEMS[id]&&ITEMS[id].kind===need).sort((a,b)=>ITEMS[b].tier-ITEMS[a].tier)[0];
    if(c){equipItem(c);note+=(note?' · ':'')+'สวม'+ITEMS[c].name+'ให้แล้ว'}
    else note+=(note?' · ':'')+'ยังไม่มี'+WNAME[need]+' — ซื้อ/คราฟได้ที่ร้านอุปกรณ์'}
   for(let i=0;i<QS.slots.length;i++){const s=QS.slots[i];if(s&&ITEMS[s]&&ITEMS[s].kind==='sword'&&need!=='sword')QS.slots[i]=null}
   if(P.armor.sword&&!QS.slots.includes('weapon')){const j=QS.slots.indexOf(null);if(j>=0)QS.slots[j]='weapon'}
   recalcStats();P.hp=Math.min(P.hp,BAL.hp);P.mp=Math.min(P.mp,BAL.mp||P.mp);try{refreshInv();updQuick()}catch(e){}
   if(note)say('🎓 '+note)}catch(e){console.warn('[v412] class',e)}}}
// ---------- ทิ้งไอเท็ม ----------
window.DROP9=function(t,k,all,sure){const n=t==='gear'?(GEAR[k]|0):(inv[k]|0);if(n<=0||k==='coin'){icClose();return}
  if(!sure){const b=document.getElementById(all?'drpA9':'drp19');if(b){b.textContent='⚠️ แตะอีกครั้งเพื่อยืนยัน';b.setAttribute('onclick',"DROP9('"+t+"','"+k+"',"+(all?1:0)+",1)");b.style.background='#7a1a1a'}return}
  const q=all?n:1;let nm;if(t==='gear'){nm=ITEMS[k].name;GEAR[k]-=q;if(GEAR[k]<=0)delete GEAR[k];try{updQuick()}catch(e){}}else{nm=MN(k);inv[k]-=q}
  sfx('thud');say('🗑️ ทิ้ง'+nm+(q>1?' ×'+q:'')+' แล้ว');icClose();try{refreshInv()}catch(e){}try{renderBag()}catch(e){}};
{const _ic=icShow;icShow=function(t,k,ro,at){_ic(t,k,ro,at);try{if(ro||icEl.hidden||!k||k==='coin'||icEl.querySelector('.drp9'))return;
  const n=t==='gear'?(GEAR[k]|0):(inv[k]|0);if(n<=0)return;
  let box=icEl.querySelector('.ib');if(!box){box=document.createElement('div');box.className='ib';icEl.appendChild(box)}
  box.insertAdjacentHTML('beforeend','<button class="drp9" style="background:#5a1f26;border-color:#c0475a;color:#ffd7dc;opacity:1" id="drp19" onclick="DROP9(\''+t+'\',\''+k+'\',0)">🗑️ ทิ้ง'+(n>1?' 1 ชิ้น':'')+'</button>'+(n>1?'<button class="drp9" style="background:#5a1f26;border-color:#c0475a;color:#ffd7dc;opacity:1" id="drpA9" onclick="DROP9(\''+t+'\',\''+k+'\',1)">🗑️ ทิ้งทั้งหมด ×'+n+'</button>':''))}catch(e){}}}

// =====================================================================
