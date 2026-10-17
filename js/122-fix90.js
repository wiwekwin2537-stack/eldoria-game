// fix90 (v4.79) — HANDOFF ข้อ 36 (เจ้าของสั่ง): ของในเกมต้องลิงก์/ตรงกันทุกหน้า + แตะไอเท็มจากที่ไหนก็ต้องเห็นชื่อ+หาได้จากไหน
//  A) "📍 หาได้จากที่ไหน" (src7) แก้ให้ถูกกับเกมตอนนี้: อาวุธอาชีพ/ชุดเซ็ต → โต๊ะคราฟ เซ็ตอะไร · ชุดบอส (เซ็ต 12–17) → บอส/บอสตำนาน (คราฟไม่ได้)
//     · ไม้แต่ละชนิด → ต้นไม้อะไร ในแมพไหน · ตราอสูร → บอสตำนานตัวไหน · ของจากระบบฟาร์มเดิม (ปิดแล้ว v4.75) บอกตรง ๆ · ของที่เคยขึ้น "ยังไม่มีข้อมูล" 40 ชิ้นมีข้อมูลครบ
//  B) แตะได้ทุกที่: โต๊ะคราฟ (ปุ่ม ℹ️ บนการ์ด + แตะชิปวัตถุดิบ) → การ์ดรายละเอียดไอเท็มอันเดียวกับในกระเป๋า (icShow แบบดูอย่างเดียว)
//  C) สกิล: ร้านสกิลใช้รูปไอคอนสกิลเดียวกับหน้าสกิล/ปุ่มบนจอ (เดิมเป็นอีโมจิ) · หน้าดูสกิลในร้านไม่มีปุ่มจำนวน (+/−) ปุ่มเป็น "📖 เรียนสกิล"
//     · หน้าเลือกอาชีพ: บรรทัด "อาวุธ:" เป็นอาวุธจริงของอาชีพ (เดิมมังค์/อัศวินมังกร/นินจา เขียน "ดาบ" · สไนเปอร์ "ธนู" · เนโคร "คทา") · แตะสกิลดูรายละเอียด (มานา/คูลดาวน์/คำอธิบาย) ได้
try{
// ---------- A) แหล่งที่มา ----------
const zonesWith90=pred=>{const L=[];for(let i=0;i<ZONES.length;i++){const Zd=ZONES[i];if(!Zd||Zd.dg)continue;let Z=null;try{Z=ZCACHE[i]||genZone(i)}catch(e){}if(Z&&Z.ores&&Z.ores.some(pred))L.push(Zd.e+' '+Zd.n)}return L};
const ZW90={};const zw90=kind=>ZW90[kind]||(ZW90[kind]=zonesWith90(o=>o.kind===kind));
const FARMOLD90=new Set(['wool','hay','degg','rfur','gmilk','truffle','fapple','forange','fpeach','fmango','fcherry','t_hoe','t_can','t_sick','turnip','chili','eggplant','watermelon','sunflower','melon','fruitpie','truffrice']);
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)}catch(e){}const add=(i,t)=>S.push([i,t]);
 try{
  // ลบบรรทัดที่อ้างระบบฟาร์ม (ถูกลบแล้ว)
  S=S.filter(x=>!/ปลูกในที่ดิน|ร้านฟาร์ม \(ลุงบุญมี\)|ยังไม่มีข้อมูล/.test(x[1]));
  S=S.map(x=>[x[0],String(x[1]).replace('ตกปลา (บ่อในที่ดิน/แหล่งน้ำ)','ตกปลาที่แหล่งน้ำ (ถือเบ็ดตกปลา ยืนริมน้ำ)')]);
  if(key.startsWith('item:')){const id=key.slice(5),it=ITEMS[id];if(!it)return S;const t=it.tier|0,setN=SETN12[t]||'';S=[];
   if(it.cls&&CLS[it.cls])add('⚒️','คราฟที่โต๊ะคราฟ (ร้านอุปกรณ์) → ⚔️ อาวุธ · เซ็ต'+setN+' · ใช้ได้เฉพาะ'+CLS[it.cls].n);
   else if(it.kind==='axe'||it.kind==='pick'){add('⚒️','คราฟที่โต๊ะคราฟ (ร้านอุปกรณ์) → ⛏️ เครื่องมือ');if(t===0)add('🏪','ซื้อที่ร้านอุปกรณ์')}
   else if(t>=(window.CRAFTN59||11)){add('👑','ดรอปจากบอส (คราฟไม่ได้) — เซ็ต'+setN);const lb=typeof LB62!=='undefined'&&LB62[t-(window.CRAFTN59||11)];if(lb)add('🐲','บอสตำนาน '+lb.e+' '+lb.n+' (Lv.'+lb.lv+') · หอคอยในเมือง → ลานบอสตำนาน · แลกด้วยตราอสูร');add('🐉','บอสโลก (ลุ้น 50%) · บอสอื่น ๆ (2–5%)')}
   else{add('⚒️','คราฟที่โต๊ะคราฟ (ร้านอุปกรณ์) → '+(['sword','staff','bow'].includes(it.kind)?'⚔️ อาวุธ':'🛡️ ชุด')+' · เซ็ต'+setN+(t>0?' (ปลดล็อกด้วยตำราช่าง)':''));if(t===0)add('🏪','ซื้อที่ร้านอุปกรณ์');add('🎁','กล่องสมบัติดันเจี้ยน · รางวัลเควส (บางชิ้น)')}
   return S}
  const k=key.replace(/^mat:/,'');
  for(const tk in OREK){const K=OREK[tk];if(K&&K.tree&&K.drop===k){const z=zw90(tk);add('🪓','ตัด'+K.n+' ด้วยขวาน'+(K.req>0&&ITEMS['axe'+K.req]?' ('+ITEMS['axe'+K.req].name+'ขึ้นไป)':'')+(z.length?' ใน '+z.join(' · '):''))}}
  if(k==='wood'&&!S.some(x=>/ทุ่งหญ้า/.test(x[1])))add('🪓','ตัดต้นไม้ในทุ่งหญ้ารอบเมือง');
  const lb=/^lbm(\d)$/.exec(k);if(lb&&typeof LB62!=='undefined'&&LB62[+lb[1]]){const B=LB62[+lb[1]];add('🐲','ล้ม '+B.e+' '+B.n+' (Lv.'+B.lv+') ที่ลานบอสตำนาน (หอคอยในเมือง)');add('🔁','ใช้แลกชิ้นชุดบอสเซ็ต'+(SETN12[(window.CRAFTN59||11)+(+lb[1])]||''))}
  if(k==='ore')add('⛏️','ขุดแร่ในเหมือง (ใช้หลอมที่เตาหลอม)');
  if(k==='ess'){add('🔮','รวมเศษแก่นเวท 5 ชิ้น ที่โต๊ะคราฟ → 🔮 ของใช้');add('👑','บอส · รางวัลเควส')}
  if(k==='whet')add('🔮','คราฟที่โต๊ะคราฟ → 🔮 ของใช้ (แท่งหิน 3)');
  if(k==='dgkey')add('🏰','บอสดันเจี้ยนแต่ละชั้น (ใช้เปิดชั้นถัดไป)');
  if(k==='rshard'){add('👑','รูนที่ดรอปจากบอส/อีลิท/ดันเจี้ยน จะกลายเป็นเศษรูน');add('🔁','5 ชิ้น แลกรูนธาตุที่เลือกได้ (แตะในกระเป๋า) · ขายที่กิลด์')}
  if(k==='candy7')add('🎃','กิจกรรมฮาโลวีน (ช่วงเทศกาล)');
  if(k==='bouquet'||k==='pendant')add('💞','ไอเท็มความสัมพันธ์กับชาวเมือง (ทำ/ซื้อในที่ดิน) ใช้มอบให้คนที่สนิท');
  if(k==='t_hamr')add('🔨','ค้อนช่างสร้างของในที่ดินผู้กล้า (ได้ตอนได้ที่ดิน)');
  if(typeof DISH!=='undefined'&&DISH[k])add('🍳','ทำอาหารที่เตาครัวในบ้าน (ที่ดินผู้กล้า) · วัตถุดิบ: '+Object.keys(DISH[k].need||{}).map(q=>q==='fish'?'ปลา (ชนิดไหนก็ได้)':MN(q)).join(' · '));
  if(FARMOLD90.has(k)||/^sd_/.test(k))add('🧺','ของจากระบบฟาร์มเดิม (ปิดแล้วตั้งแต่ v4.75) — หาเพิ่มไม่ได้ · ขายที่ร้านได้');
 }catch(e){}
 if(!S.length)S.push(['❔','ยังไม่มีข้อมูลแหล่งที่มา']);return S};window.src7=src7}

// ---------- B) แตะดูรายละเอียดในโต๊ะคราฟ ----------
window.info90=function(t,k){try{icShow(t,k,true);if(!icEl.querySelector('.ix')){const x=document.createElement('button');x.className='ix';x.textContent='✕';x.onclick=()=>icClose();icEl.insertBefore(x,icEl.firstChild)}}catch(e){}};
// การ์ดไอเท็ม: อาวุธประจำอาชีพบอกชนิดเป็นอาวุธของอาชีพ (เดิมขึ้น "ดาบ · ระดับ …" ทั้งที่เป็นสนับมือ/ทวน/เคียว)
{const _ic=icShow;icShow=function(t,k){const r=_ic.apply(this,arguments);try{const it=t==='gear'&&ITEMS[k];if(it&&it.cls&&CLS[it.cls]){const ik=icEl.querySelector('.ik');if(ik)ik.textContent='อาวุธประจำ'+CLS[it.cls].n+' · เซ็ต'+(SETN12[it.tier|0]||'')}}catch(e){}return r};window.icShow=icShow}
{const _ah=anvilHTML;anvilHTML=function(){const h=_ah.apply(this,arguments);try{if(FUI.tab!=='craft')return h;const T=document.createElement('template');T.innerHTML=h;let ch=false;
  for(const b of T.content.querySelectorAll('button.card')){const oc=b.getAttribute('onclick')||'';let id=null,m;
   if((m=/craftSet12\('([a-z0-9_]+)'\)/.exec(oc)))id=m[1];else if((m=/craftCls88\('([a-z]+)',(\d+)\)/.exec(oc)))id='cw_'+m[1]+m[2];else if((m=/craftGear\('([a-z0-9_]+)'\)/.exec(oc)))id=m[1];
   if(!id||!ITEMS[id]||b.querySelector('.i90'))continue;const s=document.createElement('span');s.className='i90';s.textContent='ℹ️';s.setAttribute('onclick',"event.stopPropagation();info90('gear','"+id+"')");b.appendChild(s);ch=true}
  for(const sp of T.content.querySelectorAll('.mats span')){const im=sp.querySelector('img');const src=im&&im.getAttribute('src');if(!src)continue;let key=null;for(const k in inv){if(src===iconURL('mat:'+k)){key=k;break}}
   if(!key)continue;sp.setAttribute('onclick',"info90('mat','"+key+"')");sp.style.cursor='pointer';ch=true}
  return ch?T.innerHTML:h}catch(e){return h}};window.anvilHTML=anvilHTML}
{const st=document.createElement('style');st.textContent='.cf56 button.card{position:relative}.cf56 .i90{position:absolute;right:6px;top:5px;font-size:15px;line-height:1;padding:3px;border-radius:8px;background:rgba(0,0,0,.35);cursor:pointer}.cf56 .mats span[onclick]:active{filter:brightness(1.4)}';document.head.appendChild(st)}

// ---------- C) สกิลเหมือนกันทุกหน้า ----------
const skNode90=(n,sz)=>{try{const u=skillIcon(n);if(!u)return null;const im=document.createElement('img');im.src=u;im.style.cssText='width:'+sz+';height:'+sz+';border-radius:8px';return im}catch(e){return null}}; // skillIcon คืนค่าเป็น URL รูป
function fixSkShop90(){try{if(P.cls==='none'||!CSKILLS[P.cls]||!shopEl.querySelector('[onclick^="shopSel7(\'csk"]'))return;
  for(const b of shopEl.querySelectorAll('.bg7[onclick^="shopSel7(\'csk"]')){if(b.dataset.s90)continue;const m=/csk(\d)/.exec(b.getAttribute('onclick'));const S=m&&CSKILLS[P.cls][+m[1]];if(!S)continue;const im=skNode90(S.n,'80%');if(!im)continue;
   const tn=[...b.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(tn)b.replaceChild(im,tn);b.dataset.s90=1}
  const d=shopEl.querySelector('.bdet7');if(d&&!d.dataset.s90){const sel=typeof SHOP7!=='undefined'&&SHOP7.sel;const m=/^csk(\d)$/.exec(sel&&(sel.id||sel)||'');if(m){const i=+m[1],S=CSKILLS[P.cls][i];
    const ic=d.querySelector('.ic');const im=skNode90(S.n,'44px');if(ic&&im){ic.textContent='';ic.appendChild(im)}
    const rw=d.querySelector('.rw');if(rw)rw.remove();const bt=d.querySelector('button.ok');if(bt)bt.innerHTML=CSK[P.cls][i]?'✓ เรียนแล้ว':P.lv<S.lv?'🔒 ต้อง Lv.'+S.lv:'📖 เรียนสกิล · 🪙 '+(S.price||0).toLocaleString();if(bt&&(CSK[P.cls][i]||P.lv<S.lv))bt.disabled=true;d.dataset.s90=1}}}catch(e){}}
window.fixSkShop90=fixSkShop90;setInterval(fixSkShop90,250);
try{const _rs=renderShop;renderShop=function(){const r=_rs.apply(this,arguments);fixSkShop90();return r};window.renderShop=renderShop}catch(e){}
{const _oc=openClassMenu;openClassMenu=function(){const r=_oc.apply(this,arguments);try{
  for(const card of shopEl.querySelectorAll('.cc7')){const nm=card.querySelector('.ch b');if(!nm)continue;const k=Object.keys(CLS).find(c=>c!=='none'&&nm.textContent.indexOf(CLS[c].n)===0);if(!k)continue;
   const w=card.querySelector('.ch small');if(w&&CW27[k])w.textContent='อาวุธ: '+CW27[k][0]+' (คราฟที่โต๊ะคราฟ)';
   const L=CSKILLS[k]||[];card.querySelectorAll('.sk > span').forEach((sp,i)=>{if(!L[i])return;sp.setAttribute('onclick',"event.stopPropagation();skInfo90('"+k+"',"+i+")");sp.style.cursor='pointer'})}}catch(e){console.warn('fix90 class',e)}return r};window.openClassMenu=openClassMenu}
window.skInfo90=function(k,i){const S=CSKILLS[k]&&CSKILLS[k][i];if(!S)return;try{talk({name:CLS[k].n,c:CLS[k].col||'#ffd84a'},S.e+' '+S.n+' (Lv.'+S.lv+(i>=3?' · เรียนที่ร้านสกิล 🪙 '+(S.price||0).toLocaleString():'')+')\nมานา '+(Array.isArray(S.mp)?S.mp.join('/'):S.mp)+' · คูลดาวน์ '+S.cd+' วิ\n'+(S.d||''),[BYE],'📖 สกิล')}catch(e){say(S.n+' — '+(S.d||''))}};
{const st=document.createElement('style');st.textContent='.sk90{display:flex;flex-wrap:wrap;gap:4px;margin:3px 0}.sk90 .c90{display:inline-flex;align-items:center;gap:4px;padding:2px 7px 2px 2px;border-radius:9px;background:rgba(255,255,255,.08);border:1px solid rgba(232,193,74,.35);cursor:pointer;font-size:11px}.sk90 .c90 b{font-weight:700}.sk90 .c90 i{font-style:normal;opacity:.7;font-size:10px}';document.head.appendChild(st)}
}catch(e){console.warn('fix90',e)}
