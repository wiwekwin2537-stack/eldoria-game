/* v5.34: คลังของสำหรับช่วงทดสอบ เจ้าของอนุมัติให้ผู้เล่นที่ล็อกอินรับของได้ */
const TEST_SUPPLY={enabled:/[?&]testsupply=1/.test(location.search)&&/^(localhost|127\.)/.test(location.hostname),/* v5.80 เปิดจริง: ปิดคลังทดสอบ · เปิดได้เฉพาะเครื่องตัวเอง (localhost) ด้วย ?testsupply=1 สำหรับเทสอัตโนมัติ */busy:false,pending:false,q:'',cat:'all',page:0,size:18};
function testSupplyCatalog(){
 const list=[];
 for(const [id,it] of Object.entries(ITEMS)){
  const cat=['axe','pick'].includes(it.kind)?'tool':it.cls||['sword','staff','bow','rifle'].includes(it.kind)?'weapon':'armor';
  list.push({key:'gear:'+id,id,kind:'gear',cat,name:it.name||id,desc:it.stat||'',tier:it.tier});
 }
 for(const [id,m] of Object.entries(INVMETA))list.push({key:'mat:'+id,id,kind:'mat',cat:'mat',name:m[0]||id,desc:m[1]||''});
 return list;
}
function testSupplyGuard(){
 if(!TEST_SUPPLY.enabled)return 'คลังทดสอบปิดอยู่';
 if(window.__qa154)return 'โหลดเกมใหม่ก่อนรับของ — ขณะนี้บอท QA หยุดการบันทึกอยู่';
 if(!FM_ACCT||!ONL32.verified||!ON10.auth||!netOk10()||!CLOUD.tok(FM_ACCT))return 'เข้าสู่ระบบและเชื่อมต่อเซิร์ฟเวอร์ก่อนรับของ';
 if(CLOUD.busy||CLOUD.reloading)return 'กำลังโหลดข้อมูลตัวละคร กรุณารอสักครู่';
 const n=D&&D.town&&!D.shop&&(D.npcs||[]).find(n=>n.name==='คลังของทดสอบ');
 if(!n||P.dead||Math.hypot(P.x-n.x,P.y-n.y)>96)return 'ยืนใกล้คลังของทดสอบในเมืองเอลโดเรียก่อนรับของ';
 return '';
}
function testSupplyStatus(text){const el=gid('testSupplyStatus');if(el)el.textContent=text;}
async function testSupplySave(){
 try{const ok=await safeSync123();TEST_SUPPLY.pending=!ok;return !!ok}catch(e){TEST_SUPPLY.pending=true;return false}
}
async function testSupplyRetry(){
 if(TEST_SUPPLY.busy)return;const err=testSupplyGuard();if(err){testSupplyStatus(err);return}
 TEST_SUPPLY.busy=true;testSupplyRender();testSupplyStatus('กำลังบันทึกขึ้นเซิร์ฟเวอร์…');
 try{const ok=await testSupplySave();testSupplyStatus(ok?'บันทึกขึ้นเซิร์ฟเวอร์แล้ว':'ยังบันทึกขึ้นเซิร์ฟเวอร์ไม่สำเร็จ — กดบันทึกอีกครั้งก่อนออกเกม')}finally{TEST_SUPPLY.busy=false;testSupplyRender()}
}
/* v5.65 เจ้าของสั่ง: NPC คลังทดสอบเสกเงิน 999,999,999 (ตั้งเป็นค่านี้ ไม่บวกเพิ่ม · ใช้ได้ช่วงเทสเท่านั้น ต้องปิดกันโกง AC.testOff) */
const TEST_COIN64=999999999;
async function testSupplyCoin64(){if(TEST_SUPPLY.busy)return {ok:false};const err=testSupplyGuard();if(err){testSupplyStatus(err);return {ok:false,reason:err}}
 if(!(window.AC&&AC.testOff)){testSupplyStatus('เสกเงินได้เฉพาะช่วงเทส');return {ok:false}}
 TEST_SUPPLY.busy=true;testSupplyRender();try{inv.coin=TEST_COIN64;refreshInv();testSupplyStatus('ได้รับเงิน '+TEST_COIN64.toLocaleString('en-US')+' · กำลังบันทึกขึ้นเซิร์ฟเวอร์…');const synced=await testSupplySave();
  testSupplyStatus('ได้รับเงิน '+TEST_COIN64.toLocaleString('en-US')+' · '+(synced?'บันทึกขึ้นเซิร์ฟเวอร์แล้ว':'ยังบันทึกขึ้นเซิร์ฟเวอร์ไม่สำเร็จ — กดบันทึกอีกครั้งก่อนออกเกม'));return {ok:true,synced}}finally{TEST_SUPPLY.busy=false;testSupplyRender()}}
window.testSupplyCoin64=testSupplyCoin64;
async function testSupplyGive(key,qty,enh){
 if(TEST_SUPPLY.busy)return {ok:false,reason:'busy'};
 const err=testSupplyGuard();if(err){testSupplyStatus(err);return {ok:false,reason:err}}
 const item=testSupplyCatalog().find(x=>x.key===key);
 qty=Number(qty);enh=Number(enh);
 if(!item||!Number.isInteger(qty)||qty<1||qty>99||!Number.isInteger(enh)||enh<0||enh>MAXP){testSupplyStatus('เลือกของ จำนวน 1–99 และระดับตีบวกที่ถูกต้อง');return {ok:false,reason:'input'}}
 if(TEST_SUPPLY.pending){testSupplyStatus('บันทึกของที่รับก่อนหน้าให้สำเร็จก่อนรับเพิ่ม');return {ok:false,reason:'pending'}}
 TEST_SUPPLY.busy=true;let n=0,reason='';
 try{
  for(let i=0;i<qty;i++){
   const have=item.kind==='gear'?(GEAR[item.id]||0):(inv[item.id]||0);
   if(!Number.isSafeInteger(have)||have<0||have>=(item.kind==='gear'?999:5e9)){reason='limit';break}
   const room=item.kind==='gear'?canTakeGear(item.id):canTake(item.id);if(room!==true){reason=room;break}
   if(item.kind==='gear'){GEAR[item.id]=have+1;ENH[item.id]=Math.max(ENH[item.id]||0,enh)}else inv[item.id]=have+1;
   n++;
  }
  if(!n){if(reason==='slot'||reason==='weight')noRoom(reason);testSupplyStatus(reason==='weight'?'รับไม่ได้ — น้ำหนักกระเป๋าเต็ม':reason==='slot'?'รับไม่ได้ — ช่องกระเป๋าเต็ม':'รับไม่ได้ — จำนวนของถึงขีดจำกัด');return {ok:false,n:0,reason}}
  refreshInv();recalcStats();testSupplyRender();testSupplyStatus('ได้รับ '+item.name+' ×'+n+' · กำลังบันทึกขึ้นเซิร์ฟเวอร์…');
  const synced=await testSupplySave();
  const detail=(n<qty?' (กระเป๋ารับได้ '+n+' จาก '+qty+')':'');
  testSupplyStatus('ได้รับ '+item.name+' ×'+n+detail+' · '+(synced?'บันทึกขึ้นเซิร์ฟเวอร์แล้ว':'ยังบันทึกขึ้นเซิร์ฟเวอร์ไม่สำเร็จ — กดบันทึกอีกครั้งก่อนออกเกม'));
  return {ok:true,n,reason,synced};
 }finally{TEST_SUPPLY.busy=false;testSupplyRender()}
}
/* UI: สร้างรายการจากทะเบียนของจริงตอนเปิด เพื่อรวมของที่ประกาศท้ายเกมด้วย */
const testSupplyWindow=document.createElement('div');testSupplyWindow.id='testSupply';testSupplyWindow.className='p6w';testSupplyWindow.hidden=true;testSupplyWindow.setAttribute('role','dialog');testSupplyWindow.setAttribute('aria-label','คลังของทดสอบ');
testSupplyWindow.innerHTML='<div class="ts-box"><header><b>📦 คลังของทดสอบ</b><button type="button" id="testSupplyClose" aria-label="ปิดคลัง">✕</button></header><div class="ts-body"><small>รับของฟรีสำหรับช่วงทดสอบ · เลือกอุปกรณ์ วัตถุดิบ หรือของใช้ แล้วกดรับ</small><div class="ts-controls"><input id="testSupplySearch" type="search" placeholder="ค้นหาชื่อของ / รหัสของ" aria-label="ค้นหาของ"><select id="testSupplyCat" aria-label="หมวดของ"><option value="all">ทุกหมวด</option><option value="weapon">อาวุธ</option><option value="armor">ชุด / เครื่องประดับ</option><option value="tool">เครื่องมือ</option><option value="mat">วัตถุดิบ / ของใช้ / เหรียญ</option></select><label>จำนวน <input id="testSupplyQty" type="number" min="1" max="99" value="1" inputmode="numeric"></label><label>ตีบวกอุปกรณ์ <select id="testSupplyEnh"></select></label></div><small>อุปกรณ์ที่ตีบวกสูงกว่าเดิมจะคงระดับสูงไว้ · รับได้ตามพื้นที่กระเป๋า</small><div class="ts-status"><span id="testSupplyStatus" role="status" aria-live="polite">เลือกของที่ต้องการรับได้เลย</span><button type="button" id="testSupplySave">บันทึกอีกครั้ง</button><button type="button" id="testSupplyCoin">💰 เสกเงิน 999,999,999</button></div><div id="testSupplyList"></div><nav><button id="testSupplyPrev" type="button">‹ ก่อนหน้า</button><span id="testSupplyCount"></span><button id="testSupplyNext" type="button">ถัดไป ›</button></nav></div></div>';
gid('wrap').appendChild(testSupplyWindow);
const testSupplyStyle=document.createElement('style');testSupplyStyle.textContent='#testSupply{position:absolute;inset:0;z-index:55;background:#0009;display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box}#testSupply[hidden]{display:none}#testSupply .ts-box{width:760px;max-width:100%;max-height:100%;display:flex;flex-direction:column;background:#201d2c;color:#f4edde;border:2px solid #9a8456;border-radius:10px;overflow:hidden;font:13px system-ui,"Noto Sans Thai",sans-serif}#testSupply header{display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:#342c36;flex:none}#testSupply button,#testSupply input,#testSupply select{font:inherit;box-sizing:border-box;border:1px solid #807258;border-radius:5px;padding:6px;background:#332e3c;color:#fff;min-width:0}#testSupply button{cursor:pointer;height:auto;min-height:32px;line-height:1.2}#testSupply button:disabled{opacity:.45;cursor:default}#testSupply .ts-body{padding:8px;overflow:auto;min-height:0}#testSupply small{color:#d2c9b7;display:block;overflow-wrap:anywhere}#testSupply .ts-controls{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}#testSupplySearch{flex:1 1 220px;width:100%}#testSupply label{display:flex;align-items:center;gap:4px}#testSupplyQty{width:58px}#testSupply .ts-status{display:flex;align-items:center;gap:8px;margin:8px 0;padding:7px;background:#121d21;border-radius:5px}#testSupplyStatus{flex:1;overflow-wrap:anywhere;color:#b7efcf}#testSupplySave{flex:none}#testSupplyList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}#testSupply .ts-item{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:7px;align-items:center;padding:7px;border:1px solid #554b5b;border-radius:6px;min-width:0}#testSupply .ts-item img{width:36px;height:36px;image-rendering:pixelated}#testSupply .ts-item b{display:block;overflow-wrap:anywhere}#testSupply .ts-item small{font-size:11px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}#testSupply nav{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:8px}#testSupplyCount{font-size:11px;text-align:center}@media(max-width:620px){#testSupplyList{grid-template-columns:1fr}#testSupply .ts-controls{gap:4px}#testSupply .ts-box{font-size:12px}#testSupply .ts-status{align-items:flex-start}}';document.head.appendChild(testSupplyStyle);
gid('testSupplyEnh').innerHTML=Array.from({length:MAXP+1},(_,i)=>'<option value="'+i+'">+'+i+'</option>').join('');
gid('testSupplyClose').onclick=()=>p6close(testSupplyWindow);gid('testSupplySave').onclick=testSupplyRetry;gid('testSupplyCoin').onclick=testSupplyCoin64;
gid('testSupplySearch').oninput=e=>{TEST_SUPPLY.q=e.target.value;TEST_SUPPLY.page=0;testSupplyRender()};
gid('testSupplyCat').onchange=e=>{TEST_SUPPLY.cat=e.target.value;TEST_SUPPLY.page=0;testSupplyRender()};
gid('testSupplyPrev').onclick=()=>{TEST_SUPPLY.page--;testSupplyRender()};gid('testSupplyNext').onclick=()=>{TEST_SUPPLY.page++;testSupplyRender()};
function testSupplyRender(){
 const q=TEST_SUPPLY.q.trim().toLowerCase(),all=testSupplyCatalog(),list=all.filter(x=>(TEST_SUPPLY.cat==='all'||x.cat===TEST_SUPPLY.cat)&&(!q||[x.id,x.name,x.desc].join(' ').toLowerCase().includes(q)));
 const pages=Math.max(1,Math.ceil(list.length/TEST_SUPPLY.size));TEST_SUPPLY.page=Math.max(0,Math.min(pages-1,TEST_SUPPLY.page));
 gid('testSupplyList').innerHTML=list.slice(TEST_SUPPLY.page*TEST_SUPPLY.size,(TEST_SUPPLY.page+1)*TEST_SUPPLY.size).map(x=>{
  let icon='';try{icon=iconURL((x.kind==='gear'?'item:':'mat:')+x.id)}catch(e){}
  const owned=x.kind==='gear'?(GEAR[x.id]||0)+Object.values(P.armor).filter(k=>k===x.id).length:(inv[x.id]||0);
  return '<div class="ts-item">'+(icon?'<img alt="" src="'+icon+'">':'<span>📦</span>')+'<div><b>'+esc(x.name)+'</b><small>'+esc(x.id)+' · มี '+owned+(x.kind==='gear'?' · +'+(ENH[x.id]||0):'')+'</small><small>'+esc(x.desc)+'</small></div><button type="button" data-supply-key="'+esc(x.key)+'"'+(TEST_SUPPLY.busy?' disabled':'')+'>รับของ</button></div>';
 }).join('')||'<p>ไม่พบของที่ค้นหา</p>';
 for(const b of gid('testSupplyList').querySelectorAll('[data-supply-key]'))b.onclick=()=>testSupplyGive(b.dataset.supplyKey,gid('testSupplyQty').value,gid('testSupplyEnh').value);
 gid('testSupplyCount').textContent=list.length+' รายการ · หน้า '+(TEST_SUPPLY.page+1)+'/'+pages;
 gid('testSupplyPrev').disabled=TEST_SUPPLY.busy||TEST_SUPPLY.page===0;gid('testSupplyNext').disabled=TEST_SUPPLY.busy||TEST_SUPPLY.page>=pages-1;gid('testSupplySave').disabled=TEST_SUPPLY.busy;{const cb=gid('testSupplyCoin');if(cb)cb.disabled=TEST_SUPPLY.busy};
}
function openTestSupplies(){if(!TEST_SUPPLY.enabled){say('คลังทดสอบปิดอยู่');return}dlgClose(true);TEST_SUPPLY.page=0;testSupplyRender();testSupplyStatus(TEST_SUPPLY.pending?'ยังมีของที่รอบันทึก — กดบันทึกอีกครั้งก่อนออกเกม':testSupplyGuard()||'เลือกของที่ต้องการรับได้เลย');p6open(testSupplyWindow)}
/* v5.80 เปิดจริง: คลังทดสอบปิด (TEST_SUPPLY.enabled=false) → เอา NPC คลังของทดสอบออกจากเมือง · เปิดเทสอีกครั้ง: ตั้ง enabled:true แล้วลบบรรทัดนี้ */
if(!TEST_SUPPLY.enabled){for(let i=NPC_DATA.length-1;i>=0;i--)if(NPC_DATA[i].name==='คลังของทดสอบ')window.TS_NPC_OFF=NPC_DATA.splice(i,1)[0]}  /* เก็บตัว NPC ไว้ให้เทสเปิดคลังกลับมา: TEST_SUPPLY.enabled=true;NPC_DATA.push(TS_NPC_OFF) */
