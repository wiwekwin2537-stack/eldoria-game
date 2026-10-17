// =====================================================================
// fix146 (v5.04) — 💰 กันเงินเฟ้อ: "ทุกบริการต้องแลกด้วยเงิน" (เจ้าของ: ฟาร์มได้เป็นล้านแต่ไม่มีที่ใช้ · การดึงของก็ต้องเสียเงิน)
//  รายได้ฟาร์มจริง ≈ (เลเวล+8) เหรียญ/ตัว ×1.3 · ~30 ตัว/นาที → Lv.150 ≈ 6,000/นาที ≈ 360,000/ชั่วโมง — ราคาทั้งหมดเทียบจากตัวเลขนี้
//  1) เปลี่ยนอาชีพ: เดิม 500 เท่ากันทุกเลเวล → 300×(Lv+8) (≈10 นาทีฟาร์ม · Lv.150 ≈ 47,400) · เลือกครั้งแรกฟรีเหมือนเดิม
//  2) คลังเก็บของ: ฝากฟรี · ถอน (ดึงของ) ครั้งละ 3×(Lv+8) — ถอนทีละหลายชิ้น/ถอนทั้งหมด = จ่ายครั้งเดียว
//  3) ธนาคาร: ฝากฟรี · ถอนเสียค่าธรรมเนียม 1% (ขั้นต่ำ 10)
//  4) สุ่มออปใหม่: ใช้หินสุ่มออป + ค่าช่าง 50×(Lv+8)
//  5) คราฟอุปกรณ์ที่ทั่ง: ค่าแรงช่าง ตามระดับเซ็ต 15×(Lv ของตำรา+8) — ไม่ขึ้นกับเลเวลผู้เล่น (ของซื้อขายได้ ราคาต้องเท่ากันทุกคน)
//  6) กิลด์นักผจญภัย: "ร้านกิลด์" ขายหินหายากด้วยเหรียญ (จำกัดต่อวันตามเวลาเซิร์ฟเวอร์) — ที่ใช้เงินสำหรับคนเงินเหลือ
//     หินสุ่มออป 30,000 (5/วัน) · หินล็อกออป 80,000 (3/วัน) · หินเสริมพลัง 2,500 (20/วัน) — ราคาคงที่ทุกเลเวล (กันซื้อถูกด้วยตัวเลเวลต่ำแล้วไปขายตลาด)
// =====================================================================
try{
const r10=v=>Math.max(10,Math.round(v/10)*10),LV=()=>Math.max(1,P.lv|0);
const FEE146={cls:()=>r10(300*(LV()+8)),vault:()=>r10(3*(LV()+8)),bank:n=>Math.max(10,Math.ceil(n*.01)),opt:()=>r10(50*(LV()+8)),
 craft:id=>{const it=ITEMS[id];const t=it?it.tier|0:0;const q=typeof SMQ!=='undefined'&&SMQ[t];return r10(15*(((q&&q.lv)||Math.max(1,t*12))+8))}};
window.FEE146=FEE146;
const fmt=n=>(n|0).toLocaleString();
const noMoney=(what,fee)=>{say('🪙 เหรียญไม่พอ — '+what+' ต้องใช้ '+fmt(fee)+' เหรียญ (มี '+fmt(inv.coin)+')');sfx('thud')};
const pay=(fee)=>{inv.coin=Math.max(0,(inv.coin|0)-fee);try{refreshInv()}catch(e){}};
/* ---------- 1) เปลี่ยนอาชีพ ---------- */
{const _pc=pickClass;pickClass=function(k){try{if(P.cls!=='none'&&P.cls!==k&&P.lv>=CLASS_LV){const fee=FEE146.cls();if((inv.coin|0)<fee){noMoney('เปลี่ยนอาชีพ',fee);return}
   const c0=inv.coin|0,cl0=P.cls;const r=_pc.apply(this,arguments);
   if(P.cls===k&&cl0!==k){const paid=c0-(inv.coin|0),extra=fee-paid;if(extra>0)pay(extra);try{saveGame(true)}catch(e){}setTimeout(()=>{try{say('🎓 เปลี่ยนเป็น'+CLS[k].e+' '+CLS[k].n+' แล้ว · ค่าเปลี่ยนอาชีพ 🪙'+fmt(fee)+' · ไปเรียนสกิลใหม่ที่ร้านสกิล')}catch(e){}},50)}
   else if(window.CLSCONF9&&CLSCONF9.k===k)say('⚠️ เปลี่ยนอาชีพ ค่าใช้จ่าย 🪙'+fmt(fee)+' · สเตตัส พาสซีฟ สกิลอาชีพ รีเซ็ตทั้งหมด (ได้แต้มคืน) — แตะอีกครั้งภายใน 6 วิเพื่อยืนยัน');
   return r}}catch(e){console.warn('cls146',e)}return _pc.apply(this,arguments)};window.pickClass=pickClass}
{const _oc=openClassMenu;openClassMenu=function(){const r=_oc.apply(this,arguments);try{const fee=FEE146.cls();for(const el of document.querySelectorAll('small,div,span')){if(el.children.length>3)continue;for(const n of el.childNodes)if(n.nodeType===3&&/เปลี่ยนอาชีพ 500/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/เปลี่ยนอาชีพ 500\s*🪙?/,'เปลี่ยนอาชีพ '+fmt(fee)+' 🪙')}}catch(e){}return r};window.openClassMenu=openClassMenu}
/* ---------- 2) คลัง: ถอนของเสียค่าบริการ ---------- */
const vSnap=()=>{const o={};try{for(const k in VAULT8.mats)o['m:'+k]=VAULT8.mats[k]|0;for(const k in VAULT8.gear)o['g:'+k]=VAULT8.gear[k]|0}catch(e){}return o};
const vOutN=(a)=>{const b=vSnap();let n=0;for(const k in a){const d=a[k]-(b[k]|0);if(d>0)n+=d}return n};
const vWrap=(name,isOut)=>{const f=window[name];if(typeof f!=='function')return;window[name]=function(){try{if(isOut.apply(this,arguments)){const fee=FEE146.vault();if((inv.coin|0)<fee){noMoney('ค่าถอนของจากคลัง',fee);return}
   const s0=vSnap();const r=f.apply(this,arguments);const got=vOutN(s0);if(got>0){pay(fee);try{vSave8()}catch(e){}try{saveGame(true)}catch(e){}try{vRender8()}catch(e){}setTimeout(()=>{try{say('📤 ถอนของ '+fmt(got)+' ชิ้น · ค่าบริการคลัง 🪙'+fmt(fee))}catch(e){}},30)}return r}}catch(e){console.warn('vault146',e)}return f.apply(this,arguments)}};
const VSok=()=>typeof VS19!=='undefined';
vWrap('vOut8',()=>!(VSok()&&VS19.sel));
vWrap('vAll19',w=>w==='out'||(w==='sel'&&VSok()&&[...VS19.pick].some(s=>s.startsWith('out:'))));
{const _vr=vRender8;vRender8=function(){const r=_vr.apply(this,arguments);try{const t=vW8.querySelector('.v8t');if(t&&!vW8.querySelector('.fee146')){const s=document.createElement('div');s.className='fee146';s.style.cssText='margin:2px 0 4px;font:700 11px system-ui;color:#ffd86a';s.textContent='🪙 ฝากฟรี · ถอนของครั้งละ '+fmt(FEE146.vault())+' เหรียญ (ถอนทีละหลายชิ้น/ถอนทั้งหมด = จ่ายครั้งเดียว)';t.parentNode.insertBefore(s,t.nextSibling)}}catch(e){}return r};window.vRender8=vRender8}
/* ---------- 3) ธนาคาร: ถอนเสียค่าธรรมเนียม 1% ---------- */
{const f=window.bkDo19;if(typeof f==='function')window.bkDo19=function(dir){if(dir!=='out')return f.apply(this,arguments);const c0=inv.coin|0;const r=f.apply(this,arguments);try{const got=(inv.coin|0)-c0;if(got>0){const fee=FEE146.bank(got);pay(fee);try{saveGame(true)}catch(e){}setTimeout(()=>{try{say('📤 ถอนเหรียญ '+fmt(got)+' · ค่าธรรมเนียม 1% = 🪙'+fmt(fee)+' · ได้รับ '+fmt(got-fee))}catch(e){}},30);note()}}catch(e){}return r}}
const note=()=>{try{const el=document.getElementById('bank19');if(!el)return;for(const sm of el.querySelectorAll('small'))if(/ดอกเบี้ย 0\.2%/.test(sm.textContent)&&!/ค่าธรรมเนียม/.test(sm.textContent))sm.textContent='ฝากฟรี · ถอนเสียค่าธรรมเนียม 1% (ขั้นต่ำ 10) · '+sm.textContent}catch(e){}};
for(const n of ['openBank19','bkSet19','bkDo19']){const f=window[n];if(typeof f!=='function')continue;window[n]=function(){const r=f.apply(this,arguments);note();return r}}
/* ---------- 4) สุ่มออปใหม่: ค่าช่าง ---------- */
{const f=window.opRoll111;if(typeof f==='function')window.opRoll111=function(id){if(!(inv.opt111>0))return f.apply(this,arguments);const fee=FEE146.opt();if((inv.coin|0)<fee){noMoney('ค่าช่างสุ่มออป',fee);return}
  const s0=inv.opt111|0;const r=f.apply(this,arguments);if((inv.opt111|0)<s0){pay(fee);try{saveGame(true)}catch(e){}}return r}}
try{const mo=new MutationObserver(()=>{try{for(const b of icEl.querySelectorAll('button[onclick*="opRoll111"]')){if(b.dataset.f146)continue;b.dataset.f146=1;b.textContent=b.textContent.replace(/\)\s*$/,'')+' · 🪙'+fmt(FEE146.opt())+')'}}catch(e){}});mo.observe(icEl,{childList:true,subtree:true})}catch(e){}
/* ---------- 5) คราฟที่ทั่ง: ค่าแรงช่าง ---------- */
{const _cs=craftSet12;craftSet12=function(id){try{const it=ITEMS[id];if(it&&!it.boss59){const fee=FEE146.craft(id);if((inv.coin|0)<fee){noMoney('ค่าแรงช่างคราฟ'+it.name,fee);return}
   const g0=GEAR[id]|0;const r=_cs.apply(this,arguments);if((GEAR[id]|0)>g0){pay(fee);try{saveGame(true)}catch(e){}setTimeout(()=>{try{say('⚒️ คราฟ '+it.name+' สำเร็จ! · ค่าแรงช่าง 🪙'+fmt(fee)+' · เปิดกระเป๋า 🎒 เพื่อสวมใส่')}catch(e){}},30)}return r}}catch(e){console.warn('craft146',e)}return _cs.apply(this,arguments)};window.craftSet12=craftSet12}
{const _ah=anvilHTML;anvilHTML=function(){let h=_ah.apply(this,arguments);try{if(FUI.tab!=='craft')return h;
  h=h.replace(/(<button[^>]*onclick="craftSet12\('([^']+)'\)"[^>]*>)/g,(m,a,id)=>ITEMS[id]?a+'<em class="fee146" style="display:block;font:700 10px system-ui;color:#ffd86a">ค่าแรง 🪙'+fmt(FEE146.craft(id))+'</em>':m);
  h=h.replace(/(<button[^>]*onclick="craftCls88\('([a-z]+)',(\d+)\)"[^>]*>)/g,(m,a,c,t)=>{const id=NEEDW[c]+t;return ITEMS[id]?a+'<em class="fee146" style="display:block;font:700 10px system-ui;color:#ffd86a">ค่าแรง 🪙'+fmt(FEE146.craft(id))+'</em>':m})}catch(e){}return h};window.anvilHTML=anvilHTML}
/* ---------- 6) ร้านกิลด์: หินหายากด้วยเหรียญ จำกัดต่อวัน ---------- */
const GS={opt111:{p:30000,n:5,nm:'หินสุ่มออป',e:'🎲'},lock130:{p:80000,n:3,nm:'หินล็อกออป',e:'🔒'},estone:{p:2500,n:20,nm:'หินเสริมพลัง',e:'💎'}};
const GK='fm_gshop146',day=()=>Math.floor((srvNow()+7*3600e3)/864e5);
const gst=()=>{let o={};try{o=JSON.parse(localStorage.getItem(GK)||'{}')||{}}catch(e){}if(o.d!==day())o={d:day(),c:{}};o.c=o.c||{};return o};
const left=k=>GS[k].n-((gst().c[k])|0);
{const d=Object.getOwnPropertyDescriptor(SHOP_DATA.guild,'buy');if(d&&d.get){const g0=d.get;Object.defineProperty(SHOP_DATA.guild,'buy',{configurable:true,get(){let L=g0.call(this);try{L=L.concat(Object.keys(GS).filter(k=>INVMETA[k]).map(k=>{const g=GS[k],l=left(k);return {id:'gs146_'+k,name:'🏛️ ร้านกิลด์: '+g.nm+' (วันนี้เหลือ '+Math.max(0,l)+'/'+g.n+')',mat:k,price:g.p,note:'ซื้อด้วยเหรียญ · จำกัด '+g.n+' ชิ้น/วัน (รีเซ็ตเที่ยงคืน ตามเวลาเซิร์ฟเวอร์)'}}))}catch(e){}return L}})}}
{const _bi=buyItem;buyItem=function(id){if(typeof id==='string'&&id.startsWith('gs146_')){const k=id.slice(6),g=GS[k];if(!g)return;
   if(!(typeof SRV!=='undefined'&&SRV.ok)){say('⏳ รอเชื่อมเวลาเซิร์ฟเวอร์สักครู่ แล้วลองใหม่');sfx('thud');return}
   if(left(k)<=0){say('🏛️ '+g.nm+' หมดโควตาวันนี้แล้ว ('+g.n+'/วัน) — มาใหม่พรุ่งนี้');sfx('thud');return}
   if((inv.coin|0)<g.p){noMoney(g.nm,g.p);return}
   try{const c=canTake(k);if(c!==true){noRoom(c);return}}catch(e){}
   const o=gst();o.c[k]=(o.c[k]|0)+1;try{localStorage.setItem(GK,JSON.stringify(o))}catch(e){}
   inv.coin-=g.p;inv[k]=(inv[k]|0)+1;try{refreshInv();saveGame(true)}catch(e){}sfx('gem');say(g.e+' ซื้อ'+g.nm+' แล้ว · 🪙'+fmt(g.p)+' · วันนี้เหลือ '+left(k)+'/'+g.n);try{openShop('guild')}catch(e){}return}
  return _bi.apply(this,arguments)};window.buyItem=buyItem}
/* ---------- REG136 ---------- */
try{if(window.REG136)REG136.push(
 ['เงิน: ค่าบริการตามเลเวล (เปลี่ยนอาชีพ/คลัง/ธนาคาร/สุ่มออป/คราฟ)',async()=>{const lv=P.lv;try{P.lv=150;const c=FEE146.cls(),v=FEE146.vault(),o=FEE146.opt();if(c<30000)return 'ค่าเปลี่ยนอาชีพ Lv150='+c;if(v<200)return 'ค่าถอนคลัง='+v;if(FEE146.bank(100000)!==1000)return 'ค่าถอนธนาคาร 1% ผิด';if(o<5000)return 'ค่าสุ่มออป='+o;
   const ids=Object.keys(ITEMS).filter(i=>ITEMS[i].tier>=1&&!ITEMS[i].boss59&&!ITEMS[i].cls);if(ids.length){P.lv=1;const a=FEE146.craft(ids[0]);P.lv=200;if(FEE146.craft(ids[0])!==a)return 'ค่าคราฟขึ้นกับเลเวลผู้เล่น (ต้องคงที่)'}}finally{P.lv=lv}
   if(!SHOP_DATA.guild.buy.some(b=>b.id==='gs146_opt111'))return 'ร้านกิลด์ไม่มีหินสุ่มออป';return null}],
 ['เงิน: เปลี่ยนอาชีพหักเงินจริง + ถอนคลังหักค่าบริการ',async()=>{const sv={cls:P.cls,lv:P.lv,coin:inv.coin,sp:P.sp,st:JSON.stringify(P.stats)};let bad=null;
   try{if(P.cls==='none'||P.lv<CLASS_LV)return null;const to=Object.keys(CLS).find(c=>c!=='none'&&c!==P.cls);inv.coin=0;const before=P.cls;pickClass(to);pickClass(to);if(P.cls!==before){bad='เงินไม่พอแต่เปลี่ยนอาชีพได้';P.cls=before;try{saveCls()}catch(e){}}}
   catch(e){bad='error '+e.message}finally{inv.coin=sv.coin;try{refreshInv()}catch(e){}}return bad}]);}catch(e){}
}catch(e){console.warn('fix146',e)}
