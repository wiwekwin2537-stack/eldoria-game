// =====================================================================
// fix130 (v5.03) — 🏪 ตลาดกลาง + 🤝 เทรดระหว่างผู้เล่น (เซิร์ฟเวอร์: market.js)
//  • ลงขายได้แม้ออฟไลน์ (ของฝากไว้ที่เซิร์ฟเวอร์) · ค้นหา · หมวด · เรียงราคา · กราฟของขายดี 7 วัน + กราฟราคา 14 วัน
//  • ซื้อ = จองของ → หักเงิน+เซฟคลาวด์ → จ่าย · ของ/เงินส่งผ่าน 📬 จดหมาย (รับอัตโนมัติ) · ภาษีตลาด 5%
//  • เทรด: ขอเทรด (เมนู/แตะผู้เล่น/หน้าผู้คน) → ใส่ของ+เหรียญ → 🔒 ล็อกทั้งคู่ → ✅ ยืนยันทั้งคู่ → ฝากเซิร์ฟเวอร์ → ส่งของให้กัน
//  • อุปกรณ์: เกมเก็บตีบวก/ออปต่อ "ชนิด" → ขาย/เทรดชิ้นสุดท้าย = ตีบวก+ออปติดไปด้วย · ยังมีชิ้นเดียวกันเหลือ = ไปเป็น +0 ไม่มีออป (กันปั๊ม +12)
//  • ทะเบียนชนิดของ MKK130 — อนาคตเพิ่มชนิดใหม่ (สัตว์ขี่/แฟชั่น/ของสัตว์เลี้ยง) ได้โดยเพิ่ม 1 รายการที่นี่ + KINDS ใน market.js
// =====================================================================
try{
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(n||0).toLocaleString();
const on=()=>{try{return netOk10()&&ON10.auth}catch(e){return false}};
const tx=o=>{try{ws10(o)}catch(e){}};
const sync=async()=>{try{return await safeSync123()}catch(e){return false}};
const OPT=()=>window.OPT111||{o:{},p:{}};
function svOpt(){const S=OPT();S.v=(S.v|0)+1;try{localStorage.setItem('fm_opt111',JSON.stringify({o:S.o,p:S.p,v:S.v}))}catch(e){}try{ptDirty()}catch(e){}try{applyBonus();recalcStats()}catch(e){}}
const equipped=id=>{try{return Object.values(P.armor||{}).includes(id)}catch(e){return false}};
// ---------- ทะเบียนชนิดของ ----------
const MAT_NO=new Set(['coin','pendant','rod','rod2']);
const SPECIAL=/^(estone|bless|opt|r_|gem$|pshard|ps\d|mshard|ms\d|scroll|phoenix|lock130|polish130)/;
const MKK130={
 mat:{
  list(){const L=[];for(const k in inv){const n=inv[k]|0;if(n<=0||MAT_NO.has(k)||!INVMETA[k])continue;const d=String(INVMETA[k][1]||'');if(/เควส|เนื้อเรื่อง/.test(d))continue;L.push({k:'mat',id:k,n})}return L},
  have:it=>(inv[it.id]|0)>=(it.n|0),
  peek:it=>({k:'mat',id:it.id,n:it.n|0}),
  take(it){if(!this.have(it))return null;inv[it.id]-=it.n;return {k:'mat',id:it.id,n:it.n|0}},
  give(it){inv[it.id]=(inv[it.id]|0)+(it.n|0||1)},
  restore(it){this.give(it)},
  name:it=>(INVMETA[it.id]&&INVMETA[it.id][0])||it.id,
  icon:it=>{try{return iconURL('mat:'+it.id)}catch(e){return ''}},
  stat:it=>String((INVMETA[it.id]&&INVMETA[it.id][1])||'').slice(0,70),
  cat:it=>SPECIAL.test(it.id)?'sp':/อิ่ม|ฟื้น|เลือด|มานา/.test(String((INVMETA[it.id]||[])[1]||''))?'food':'mat'},
 gear:{
  list(){const L=[];for(const id in GEAR){if((GEAR[id]|0)<=0||!ITEMS[id])continue;const k=ITEMS[id].kind;if(k==='axe'||k==='pick')continue;L.push({k:'gear',id,n:GEAR[id]|0})}return L},
  have:it=>(GEAR[it.id]|0)>=1,
  last:id=>(GEAR[id]|0)<=1&&!equipped(id),
  peek(it){const last=this.last(it.id),o=OPT().o[it.id];return {k:'gear',id:it.id,n:1,e:last?(ENH[it.id]|0):0,o:last&&o&&o.length?o.map(x=>[x[0],x[1]]):null}},
  take(it){if(!this.have(it))return null;const r=this.peek(it);GEAR[it.id]--;if(GEAR[it.id]<=0)delete GEAR[it.id];
   if(this.last(it.id)&&!(GEAR[it.id]>0)){delete ENH[it.id];const S=OPT();delete S.o[it.id];delete S.p[it.id];svOpt()}return r},
  give(it){if(!ITEMS[it.id])return;GEAR[it.id]=(GEAR[it.id]|0)+1;if(it.e)ENH[it.id]=Math.max(ENH[it.id]|0,it.e|0);
   if(it.o&&it.o.length){const S=OPT();if(!S.o[it.id]||!S.o[it.id].length)S.o[it.id]=it.o;else S.p[it.id]=it.o;svOpt()}},
  restore(it){if(!ITEMS[it.id])return;GEAR[it.id]=(GEAR[it.id]|0)+1;if(it.e)ENH[it.id]=Math.max(ENH[it.id]|0,it.e|0);if(it.o&&it.o.length){const S=OPT();if(!S.o[it.id]||!S.o[it.id].length){S.o[it.id]=it.o;svOpt()}}},
  name:it=>((ITEMS[it.id]&&ITEMS[it.id].name)||it.id)+(it.e?' +'+it.e:''),
  icon:it=>{try{return iconURL('item:'+it.id)}catch(e){return ''}},
  stat:it=>{const I=ITEMS[it.id]||{};let s=I.stat||'';try{if(it.o&&window.line111)s+=' · '+it.o.map(line111).join(', ')}catch(e){}return s},
  cat:it=>{const k=(ITEMS[it.id]||{}).kind;return (k==='sword'||k==='staff'||k==='bow'||(ITEMS[it.id]||{}).cls)?'wpn':(k==='neck'||k==='ring')?'acc':'arm'}}
};
window.MKK130=MKK130;
const K=it=>MKK130[it&&it.k];
const itName=it=>{try{return K(it).name(it)}catch(e){return String(it&&it.id)}};
const itIcon=it=>{try{return K(it).icon(it)}catch(e){return ''}};
const itStat=it=>{try{return K(it).stat(it)}catch(e){return ''}};
const itCat=it=>{try{return K(it).cat(it)}catch(e){return 'mat'}};
const giveIt=it=>{try{K(it).give(it)}catch(e){}};
const restoreIt=it=>{try{K(it).restore(it)}catch(e){}};
const itLabel=it=>itName(it)+((it.n|0)>1?' ×'+fmt(it.n):'');
window.give130=giveIt;
// ---------- 📬 จดหมาย: ชนิดใหม่ + รับอัตโนมัติ ----------
{const _m=mail10;mail10=function(list){const rest=[],L=[];for(const m of list||[]){try{
   if(m.k==='mk'){giveIt(m.item);L.push('🏪 ซื้อจากตลาด: '+itLabel(m.item));MK.bought(m)}
   else if(m.k==='mkret'){giveIt(m.item);L.push('🏪 คืนของ ('+(m.why||'')+'): '+itLabel(m.item))}
   else if(m.k==='tr'){for(const it of m.items||[])giveIt(it);if(m.coin)inv.coin=(inv.coin|0)+(m.coin|0);L.push((m.back?'↩️ คืนของจากเทรด':'🤝 ได้จากเทรดกับ '+(m.from||''))+': '+[...(m.items||[]).map(itLabel),m.coin?'🪙 '+fmt(m.coin):''].filter(Boolean).join(', '))}
   else rest.push(m)}catch(e){console.warn('mail130',e)}}
  if(L.length){try{refreshInv();saveGame(true)}catch(e){}sfx('chest');try{sysSay('📬 ได้รับ: '+L.join(' · '))}catch(e){}try{banner('📬 ได้รับของแล้ว',L[0])}catch(e){}try{safeSync123()}catch(e){}}
  if(rest.length)return _m.call(this,rest)};window.mail10=mail10}
try{const _d=W81.mailDesc81||null;}catch(e){}
const AUTO=new Set(['mk','mkret','tr']),asked=new Map();let AUTOL=[],autoT=0;
/* รับของจากตลาด/เทรดอัตโนมัติ (เซิร์ฟเวอร์จำกัดกดรับ 0.7 วิ/ครั้ง → รวมเป็นชุด + ลองซ้ำถ้ายังค้าง) */
function autoClaim(){clearTimeout(autoT);autoT=setTimeout(()=>{try{if(!on())return;const n=Date.now();const ids=(AUTOL||[]).filter(m=>(AUTO.has(m.k)||(m.k==='coin'&&m.mk))&&!(n-(asked.get(m.id)||0)<4000)).map(m=>m.id);
 if(!ids.length)return;ids.forEach(i=>asked.set(i,n));tx({t:'mclaim',ids});setTimeout(()=>{if(on())tx({t:'mlist'})},4500)}catch(e){}},900)}
// ---------- สถานะตลาด ----------
const MK={list:[],mine:[],stats:{},tax:.05,max:12,tab:'buy',q:'',cat:'all',sort:'low',sel:null,qty:1,price:'',sq:'',chart:null,loading:false,
 pend:{},buy:null,
 bought(m){try{if(MK.buy&&m.lid===MK.buy.id){MK.buy=null;saveB()}}catch(e){}}};
window.MK130=MK;
try{MK.pend=JSON.parse(localStorage.getItem('fm_mkpend130')||'{}')||{}}catch(e){}
try{MK.buy=JSON.parse(localStorage.getItem('fm_mkbuy130')||'null')}catch(e){}
const saveP=()=>{try{localStorage.setItem('fm_mkpend130',JSON.stringify(MK.pend))}catch(e){}};
const saveB=()=>{try{localStorage.setItem('fm_mkbuy130',JSON.stringify(MK.buy))}catch(e){}};
/* กู้รายการค้าง: ส่งลงขายแล้วแต่ไม่ได้คำตอบ / จ่ายเงินแล้วหลุด */
function reconcile(){const now=Date.now();
 for(const n in MK.pend){const P0=MK.pend[n];if(MK.mine.some(l=>l.nonce===n)){delete MK.pend[n];continue}
  if(now-P0.t>20000){tx({t:'mkVoid',nonce:n});restoreIt(P0.it);delete MK.pend[n];try{refreshInv();saveGame(true)}catch(e){}try{say('🏪 ลงขายไม่สำเร็จ — คืน '+itLabel(P0.it)+' เข้ากระเป๋าแล้ว')}catch(e){}}}
 saveP();
 if(MK.buy&&MK.buy.paid&&now-MK.buy.t>8000)tx({t:'mkChk',id:MK.buy.id})}
// ---------- ข้อความจากเซิร์ฟเวอร์ ----------
{const _nm=netMsg;netMsg=function(d){const r=_nm.apply(this,arguments);try{if(!d||typeof d.t!=='string')return r;
 if(d.t==='mbox'&&Array.isArray(d.list)&&on()){AUTOL=d.list;autoClaim()}
 else if(d.t==='auth_ok'){setTimeout(()=>tx({t:'mkq'}),1500)}
 else if(d.t==='mkls'){MK.list=d.list||[];MK.mine=d.mine||[];MK.stats=d.stats||{};MK.tax=d.tax||.05;MK.max=d.max||12;MK.loading=false;reconcile();if(!mkW.hidden)render()}
 else if(d.t==='mkSellOk'){const P0=MK.pend[d.nonce];delete MK.pend[d.nonce];saveP();if(P0){sfx('gem');say('🏪 ลงขาย '+itLabel(P0.it)+' แล้ว');MK.sel=null;MK.tab='mine'}if(!mkW.hidden)render()}
 else if(d.t==='mkNo'){if(d.nonce&&MK.pend[d.nonce]&&d.back){restoreIt(MK.pend[d.nonce].it);delete MK.pend[d.nonce];saveP();try{refreshInv();saveGame(true)}catch(e){}}
  if(MK.buy&&!MK.buy.paid&&d.id===MK.buy.id){MK.buy=null;saveB()}say('🏪 '+(d.why||'ทำรายการไม่สำเร็จ'));sfx('thud');if(!mkW.hidden)render()}
 else if(d.t==='mkHold')payHold(d);
 else if(d.t==='mkPayOk'){if(MK.buy&&MK.buy.id===d.id){MK.buy=null;saveB()}sfx('chest');say('🏪 ซื้อ '+itLabel(d.item)+' สำเร็จ! ของกำลังส่งเข้ากระเป๋า');try{flash('#ffd84a',.25)}catch(e){}}
 else if(d.t==='mkPayNo'){if(MK.buy&&MK.buy.id===d.id&&MK.buy.paid){inv.coin=(inv.coin|0)+(MK.buy.price|0);try{refreshInv();saveGame(true)}catch(e){}say('🏪 '+(d.why||'ซื้อไม่สำเร็จ')+' — คืน 🪙 '+fmt(MK.buy.price));MK.buy=null;saveB()}sfx('thud')}
 else if(d.t==='mkChk'){if(MK.buy&&MK.buy.id===d.id&&MK.buy.paid){if(d.mine){MK.buy=null;saveB()}else if(!d.live||true){inv.coin=(inv.coin|0)+(MK.buy.price|0);try{refreshInv();saveGame(true)}catch(e){}say('🏪 การซื้อครั้งก่อนไม่สำเร็จ — คืน 🪙 '+fmt(MK.buy.price));MK.buy=null;saveB()}}}
 else if(d.t==='mkCancelOk'){say('🏪 ยกเลิกแล้ว — ของจะคืนเข้ากระเป๋าทางจดหมาย');sfx('ui')}
 else if(d.t==='mkSold'){sfx('gem');try{banner('💰 ขายได้แล้ว!',itLabel(d.item)+' · +🪙 '+fmt(d.net))}catch(e){}try{sysSay('💰 '+(d.by||'ผู้เล่น')+' ซื้อ '+itLabel(d.item)+' ของคุณ — ได้ 🪙 '+fmt(d.net)+' (หักภาษีแล้ว · รับทางจดหมาย)')}catch(e){}}
 else if(d.t.startsWith('tr'))trNet(d);
}catch(e){console.warn('net130',e)}return r};window.netMsg=netMsg}
async function payHold(d){if(!MK.buy||MK.buy.id!==d.id||MK.buy.paid)return;const price=d.price|0;
 if((inv.coin|0)<price){tx({t:'mkRel',id:d.id});MK.buy=null;saveB();say('🪙 เหรียญไม่พอ');sfx('thud');return}
 inv.coin-=price;MK.buy.paid=true;MK.buy.t=Date.now();saveB();try{refreshInv()}catch(e){}
 const ok=await sync();if(!ok){inv.coin+=price;try{refreshInv();saveGame(true)}catch(e){}tx({t:'mkRel',id:d.id});MK.buy=null;saveB();say('☁️ เซฟขึ้นเซิร์ฟเวอร์ไม่สำเร็จ — ยกเลิกการซื้อ ลองใหม่อีกครั้ง');sfx('thud');return}
 tx({t:'mkPay',id:d.id,price})}
window.mkBuy130=id=>{const l=MK.list.find(x=>x.id===id);if(!l)return;if(!on()){say('🏪 ต้องเชื่อมต่อออนไลน์และเข้าสู่ระบบก่อน');return}
 if(MK.buy){say('🏪 รอการซื้อครั้งก่อนเสร็จก่อน');sfx('thud');return}if((inv.coin|0)<l.price){say('🪙 เหรียญไม่พอ (ต้องใช้ '+fmt(l.price)+')');sfx('thud');return}
 MK.buy={id,price:l.price,t:Date.now(),paid:false};saveB();tx({t:'mkBuy',id,price:l.price});
 setTimeout(()=>{if(MK.buy&&MK.buy.id===id&&!MK.buy.paid){MK.buy=null;saveB();say('🏪 เซิร์ฟเวอร์ไม่ตอบ ลองใหม่อีกครั้ง')}},12000)};
window.mkSell130=async()=>{const s=MK.sel;if(!s)return;if(!on()){say('🏪 ต้องเชื่อมต่อออนไลน์และเข้าสู่ระบบก่อน');return}
 const n=s.k==='mat'?Math.max(1,Math.min(s.max,Math.floor(+MK.qty||1))):1,price=Math.floor(+String(MK.price).replace(/[^0-9]/g,'')||0);
 if(price<1){say('🏪 ใส่ราคาก่อน');sfx('thud');return}if(MK.mine.length+Object.keys(MK.pend).length>=MK.max){say('🏪 ลงขายได้สูงสุด '+MK.max+' รายการ');sfx('thud');return}
 const it=K(s).take({k:s.k,id:s.id,n});if(!it){say('ของไม่พอ');sfx('thud');return}const nonce=Date.now().toString(36)+Math.random().toString(36).slice(2,8);
 MK.pend[nonce]={it,t:Date.now()};saveP();try{refreshInv()}catch(e){}render();
 const ok=await sync();if(!ok){restoreIt(it);delete MK.pend[nonce];saveP();try{refreshInv();saveGame(true)}catch(e){}say('☁️ เซฟขึ้นเซิร์ฟเวอร์ไม่สำเร็จ — ยังไม่ได้ลงขาย ลองใหม่');sfx('thud');render();return}
 MK.pend[nonce].t=Date.now();saveP();tx({t:'mkSell',nonce,item:it,price})};
window.mkCancel130=id=>{if(!on())return;tx({t:'mkCancel',id})};
// ---------- หน้าต่างตลาด ----------
const css=document.createElement('style');css.textContent=`
#mk130 .w,#tr130 .w{width:min(900px,98%);height:min(560px,96%)}
#mk130 .bd,#tr130 .bd{display:flex!important;flex-direction:column;gap:8px;padding:8px 10px;overflow:hidden;font:600 12.5px/1.4 system-ui,"Noto Sans Thai",sans-serif}
.tb130{display:flex;gap:6px;flex-wrap:wrap}.tb130 button{flex:1;min-width:84px;border:1px solid #e8c14a55;background:#2a2040;color:#e8e0f8;border-radius:10px;padding:7px 6px;font:800 12.5px system-ui,"Noto Sans Thai";cursor:pointer}
.tb130 button.on{background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06;border-color:#ffe9a0}
.fl130{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.fl130 input,.fl130 select,.sv130 input{background:#120e1e;color:#fff;border:1px solid #e8c14a66;border-radius:9px;padding:6px 9px;font:600 13px system-ui,"Noto Sans Thai";min-width:0}
.fl130 input{flex:1 1 160px}.ch130{border:1px solid #ffffff22;background:#1c1630;color:#d8d0e8;border-radius:16px;padding:4px 10px;font:700 11.5px system-ui,"Noto Sans Thai";cursor:pointer}.ch130.on{background:#4a3a1a;border-color:#ffd86a;color:#ffe9a0}
.sc130{flex:1;overflow-y:auto;min-height:0;padding-right:2px}
.gr130{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:7px}
.cd130{display:flex;gap:8px;align-items:center;background:linear-gradient(180deg,#2a2140,#1b1530);border:1px solid #ffffff1a;border-radius:12px;padding:7px 8px;position:relative}
.cd130:hover{border-color:#e8c14a88}.cd130 img{width:40px;height:40px;image-rendering:pixelated;background:#0006;border-radius:9px;padding:2px;flex:none}
.cd130 .t{flex:1;min-width:0}.cd130 .t b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;color:#fff;font-size:13px;overflow:hidden;line-height:1.25}.cd130 .t small{display:block;color:#b8b0c8;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cd130 .t .op{color:#9fe8ff}.cd130 .pr{color:#ffd86a;font:900 13px system-ui}.cd130 .pu{color:#9a90aa;font-size:10px}
.bt130{border:0;border-radius:9px;padding:7px 11px;font:800 12px system-ui,"Noto Sans Thai";cursor:pointer;background:linear-gradient(180deg,#5ad06a,#2f8a3a);color:#fff;white-space:nowrap}
.bt130.r{background:linear-gradient(180deg,#e0604a,#9a2a1a)}.bt130.g{background:#3a3450;color:#ddd}.bt130.y{background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}.bt130:disabled{opacity:.4;cursor:default}
.em130{text-align:center;color:#a8a0b8;padding:26px 10px}
.sv130{display:flex;gap:10px;min-height:0;flex:1}.sv130 .l{flex:1.15;display:flex;flex-direction:column;gap:6px;min-width:0}.sv130 .r{flex:1;background:#18132a;border:1px solid #e8c14a44;border-radius:12px;padding:10px;overflow-y:auto}
.ls130{display:flex;flex-direction:column;gap:4px}.ls130 .cd130{cursor:pointer;padding:5px 7px}.ls130 .cd130.on{border-color:#ffd86a;background:#3a2e1a}.ls130 img{width:32px;height:32px}
.kv130{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px dotted #ffffff18}.kv130 b{color:#ffd86a}
.nt130{font-size:11px;color:#c8c0d8;background:#0004;border-radius:8px;padding:6px 8px;margin:6px 0}
.bar130{display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:9px;cursor:pointer}.bar130:hover,.bar130.on{background:#2a2040}.bar130 img{width:26px;height:26px}
.bar130 .nm{width:150px;flex:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bar130 .bg{flex:1;height:14px;background:#0005;border-radius:7px;overflow:hidden}.bar130 .bg i{display:block;height:100%;background:linear-gradient(90deg,#d9a42a,#ffd86a);border-radius:7px}
.bar130 .v{width:132px;white-space:nowrap;text-align:right;color:#ffd86a;font-size:11px}
.cht130{background:#120e1e;border:1px solid #e8c14a44;border-radius:12px;padding:8px;margin-top:8px}.cht130 svg{width:100%;height:150px;display:block}
.sm130{display:flex;gap:8px;flex-wrap:wrap}.sm130 div{flex:1;min-width:110px;background:#1c1630;border-radius:10px;padding:6px 9px}.sm130 small{display:block;color:#a8a0b8;font-size:10.5px}.sm130 b{font-size:16px;color:#ffe9a0}
.cd130 .t,.sv130 .r,.ls130 .t{text-align:left}
#mk130 .hd button,#tr130 .hd button{min-width:36px;font-size:16px;margin-left:auto}#mk130 button,#tr130 button,#cf130 button,#trInv130 button{min-height:0;height:auto}
@media (max-height:480px){#mk130 .w,#tr130 .w{height:98%}#mk130 .tb130 button{height:30px}#mk130 .hd button,#tr130 .hd button{padding:2px 8px}#mk130 .hd,#tr130 .hd{padding:4px 10px}#mk130 .bd,#tr130 .bd{gap:5px;padding:5px 8px}.tb130 button{padding:4px 6px;font-size:12px}.ch130{padding:2px 9px}.fl130 input,.fl130 select{padding:4px 8px}.cd130{padding:5px 7px}.cd130 img{width:34px;height:34px}.sl130{min-height:34px}.slots130{grid-template-columns:repeat(8,1fr)}}
@media (max-width:620px){.sv130{flex-direction:column}.bar130 .nm{width:96px}.gr130{grid-template-columns:1fr}}
.tw130{display:flex;gap:10px;flex:1;min-height:0}.tw130 .sd{flex:1;display:flex;flex-direction:column;gap:6px;background:#18132a;border:1px solid #ffffff22;border-radius:12px;padding:8px;min-width:0}
.tw130 .sd.lk{border-color:#7dffa0;box-shadow:inset 0 0 18px rgba(125,255,160,.18)}.tw130 .sd h4{margin:0;display:flex;justify-content:space-between;align-items:center;color:#ffe9a0;font-size:13px}
.slots130{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.sl130{aspect-ratio:1;background:#0006;border:1px dashed #ffffff30;border-radius:10px;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;min-height:44px}
.sl130 img{width:70%;height:70%;image-rendering:pixelated}.sl130 em{position:absolute;right:3px;bottom:1px;font:900 10px system-ui;font-style:normal;color:#fff;text-shadow:0 1px 2px #000}.sl130 .x{position:absolute;right:-4px;top:-5px;background:#c03a2a;border-radius:50%;width:16px;height:16px;font:900 10px/16px system-ui;text-align:center;color:#fff}
.inv130{position:absolute;right:0;top:0;bottom:0;width:min(360px,100%);background:#141020;border-left:2px solid #e8c14a;display:flex;flex-direction:column;padding:8px;gap:6px;z-index:2}
#cf130{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45)}#cf130[hidden]{display:none}#cf130 .bx{background:linear-gradient(180deg,#2a2040,#141020);border:2px solid #ffd86a;border-radius:14px;padding:14px 18px;max-width:min(92vw,380px);color:#fff;font:700 14px/1.5 system-ui,"Noto Sans Thai";text-align:center;box-shadow:0 10px 30px #000b}
#trInv130{position:absolute;left:50%;top:14%;transform:translateX(-50%);z-index:31;background:linear-gradient(180deg,#2a2040,#141020);border:2px solid #7dffa0;border-radius:14px;padding:10px 14px;color:#fff;font:700 13px system-ui,"Noto Sans Thai";text-align:center;box-shadow:0 8px 30px #000a}
`;document.head.appendChild(css);
const mkW=mk6('mk130');window.mkW130=mkW;
const CATS=[['all','ทั้งหมด'],['wpn','⚔️ อาวุธ'],['arm','🛡️ ชุดเกราะ'],['acc','💍 เครื่องประดับ'],['sp','✨ หิน/รูน/พิเศษ'],['mat','⛏️ วัตถุดิบ'],['food','🍞 อาหาร/ยา']];
const unit=l=>l.price/Math.max(1,l.item.n|0);
function avgUnit(key){const a=MK.stats[key];if(!a||!a.length)return 0;let q=0,s=0;for(const r of a.slice(-7)){q+=r[2];s+=r[3]}return q?s/q:0}
function minUnit(it){let m=0;for(const l of MK.list)if(l.item.k===it.k&&l.item.id===it.id){const u=unit(l);if(!m||u<m)m=u}return m}
const left=t=>{const s=Math.max(0,(t-Date.now())/1000);return s>86400?Math.floor(s/86400)+' วัน':s>3600?Math.floor(s/3600)+' ชม.':Math.ceil(s/60)+' นาที'};
function card(it,right,sub){const o=it.k==='gear'&&it.o&&it.o.length?'<small class="op">🎲 '+esc(it.o.map(x=>{try{return line111(x)}catch(e){return ''}}).join(' · '))+'</small>':'';
 return '<div class="cd130"><img src="'+itIcon(it)+'"><div class="t"><b>'+esc(itLabel(it))+'</b>'+o+'<small>'+esc(sub||itStat(it))+'</small></div>'+(right||'')+'</div>'}
function vBuy(){let L=MK.list.slice();const q=MK.q.trim().toLowerCase();
 if(MK.cat!=='all')L=L.filter(l=>itCat(l.item)===MK.cat);if(q)L=L.filter(l=>(itName(l.item)+' '+l.item.id+' '+l.seller).toLowerCase().includes(q));
 L.sort(MK.sort==='new'?(a,b)=>b.t-a.t:MK.sort==='high'?(a,b)=>b.price-a.price:(a,b)=>unit(a)-unit(b));
 let h='<div class="fl130"><input id="mkq130" placeholder="🔎 ค้นหาไอเท็ม / ชื่อผู้ขาย…" value="'+esc(MK.q)+'"><select data-a="sort"><option value="low"'+(MK.sort==='low'?' selected':'')+'>ราคาต่อชิ้น ต่ำ→สูง</option><option value="high"'+(MK.sort==='high'?' selected':'')+'>ราคารวม สูง→ต่ำ</option><option value="new"'+(MK.sort==='new'?' selected':'')+'>ลงใหม่ล่าสุด</option></select><button class="bt130 g" data-a="ref">🔄</button></div>';
 h+='<div class="fl130">'+CATS.map(([k,n])=>'<button class="ch130'+(MK.cat===k?' on':'')+'" data-a="cat" data-v="'+k+'">'+n+'</button>').join('')+'</div><div class="sc130">';
 if(MK.loading&&!MK.list.length)h+='<div class="em130">กำลังโหลดตลาด…</div>';
 else if(!L.length)h+='<div class="em130">'+(MK.list.length?'ไม่พบของที่ค้นหา':'ยังไม่มีใครลงขาย — เป็นคนแรกเลย! ไปแท็บ 💰 ลงขาย')+'</div>';
 else{h+='<div class="gr130">';for(const l of L.slice(0,150)){const mine=MK.mine.some(m=>m.id===l.id),busy=MK.buy&&MK.buy.id===l.id;
   h+=card(l.item,'<div style="text-align:right;flex:none"><div class="pr">🪙 '+fmt(l.price)+'</div>'+((l.item.n|0)>1?'<div class="pu">ชิ้นละ '+fmt(unit(l))+'</div>':'')+(mine?'<small style="color:#9a90aa">ของคุณ</small>':'<button class="bt130" data-a="buy" data-v="'+l.id+'"'+(l.held||busy||(inv.coin|0)<l.price?' disabled':'')+'>'+(busy?'กำลังซื้อ…':l.held?'มีคนจอง':'ซื้อ')+'</button>')+'</div>','👤 '+l.seller+' · ⏳ '+left(l.exp))}
  h+='</div>'}
 return h+'</div>'}
function sellList(){const L=[];for(const k in MKK130){try{for(const x of MKK130[k].list())L.push(x)}catch(e){}}return L}
function vSell(){const all=sellList(),q=MK.sq.trim().toLowerCase(),L=all.filter(x=>!q||(itName(x)+' '+x.id).toLowerCase().includes(q));
 let h='<div class="sv130"><div class="l"><div class="fl130"><input id="mksq130" placeholder="🔎 หาของในกระเป๋า…" value="'+esc(MK.sq)+'"></div><div class="sc130"><div class="ls130">';
 if(!L.length)h+='<div class="em130">ไม่มีของที่ขายได้</div>';
 for(const x of L.slice(0,250)){const sel=MK.sel&&MK.sel.k===x.k&&MK.sel.id===x.id;h+='<div class="cd130'+(sel?' on':'')+'" data-a="pick" data-k="'+x.k+'" data-v="'+esc(x.id)+'"><img src="'+itIcon(x)+'"><div class="t"><b>'+esc(itName(x))+'</b><small>มี ×'+fmt(x.n)+'</small></div></div>'}
 h+='</div></div></div><div class="r">';const s=MK.sel;
 if(!s)h+='<div class="em130">👈 เลือกของที่จะขาย<br><small>ลงขายได้ '+MK.max+' รายการ · อยู่ในตลาด 3 วัน · ไม่มีคนซื้อ = คืนเข้ากระเป๋าทางจดหมาย<br>ภาษีตลาด '+Math.round(MK.tax*100)+'% หักตอนขายได้</small></div>';
 else{const n=s.k==='mat'?Math.max(1,Math.min(s.max,Math.floor(+MK.qty||1))):1,it=K(s).peek({k:s.k,id:s.id,n}),key=s.k+':'+s.id,av=avgUnit(key),mn=minUnit(s),pr=Math.floor(+String(MK.price).replace(/[^0-9]/g,'')||0);
  h+=card(it,'','มีอยู่ ×'+fmt(s.max));
  if(s.k==='gear')h+='<div class="nt130">'+(it.e||it.o?'✅ ชิ้นสุดท้าย — ตีบวก +'+(it.e|0)+(it.o?' และออป':'')+' ติดไปกับของ':'ℹ️ คุณยังมี/สวม '+esc(itName({k:'gear',id:s.id}))+' ชิ้นเดียวกันอยู่ — ชิ้นนี้ขายเป็น +0 ไม่มีออป (ระบบเก็บตีบวกต่อชนิด) · อยากขายพร้อมตีบวก ให้ขายชิ้นสุดท้าย')+'</div>';
  if(s.k==='mat')h+='<div class="kv130"><span>จำนวน</span><span><input class="bt130 g" style="width:90px;text-align:center" id="mkqty130" type="number" min="1" max="'+s.max+'" value="'+n+'"> <button class="ch130" data-a="qmax">สูงสุด</button></span></div>';
  h+='<div class="kv130"><span>ราคารวม (🪙)</span><span><input class="bt130 g" style="width:130px;text-align:right" id="mkpr130" inputmode="numeric" value="'+esc(MK.price)+'" placeholder="ใส่ราคา"></span></div>';
  h+='<div class="fl130" style="margin:6px 0">'+(av?'<button class="ch130" data-a="pset" data-v="'+Math.round(av*n)+'">📈 ราคาเฉลี่ย '+fmt(av*n)+'</button>':'')+(mn?'<button class="ch130" data-a="pset" data-v="'+Math.max(1,Math.floor(mn*n*.98))+'">🏷️ ถูกกว่าตลาด '+fmt(Math.max(1,Math.floor(mn*n*.98)))+'</button>':'')+(!av&&!mn?'<small style="color:#a8a0b8">ยังไม่มีราคาอ้างอิงในตลาด — ตั้งเองได้เลย</small>':'')+'</div>';
  h+='<div class="kv130"><span>ภาษีตลาด '+Math.round(MK.tax*100)+'%</span><span>-'+fmt(Math.ceil(pr*MK.tax))+'</span></div><div class="kv130"><span>ได้รับเมื่อขายได้</span><b>🪙 '+fmt(pr-Math.ceil(pr*MK.tax))+'</b></div>';
  h+='<div style="display:flex;gap:6px;margin-top:10px"><button class="bt130 y" style="flex:1" data-a="sell"'+(pr>0?'':' disabled')+'>💰 ลงขาย</button><button class="bt130 g" data-a="unpick">ยกเลิก</button></div>'}
 return h+'</div></div>'}
function vMine(){let h='<div class="fl130"><small style="color:#a8a0b8">ลงขายอยู่ '+MK.mine.length+'/'+MK.max+' · ขายได้แล้วเงินเข้าทางจดหมายอัตโนมัติ (แม้ออฟไลน์อยู่)</small></div><div class="sc130">';
 const pend=Object.keys(MK.pend);for(const n of pend)h+=card(MK.pend[n].it,'<small style="color:#ffd86a">⏳ กำลังส่ง…</small>');
 if(!MK.mine.length&&!pend.length)h+='<div class="em130">ยังไม่ได้ลงขายอะไร</div>';
 else{h+='<div class="gr130">';for(const l of MK.mine)h+=card(l.item,'<div style="text-align:right;flex:none"><div class="pr">🪙 '+fmt(l.price)+'</div><button class="bt130 r" data-a="cancel" data-v="'+l.id+'"'+(l.held?' disabled':'')+'>'+(l.held?'มีคนจอง':'ยกเลิก')+'</button></div>','⏳ เหลือ '+left(l.exp));h+='</div>'}
 return h+'</div>'}
function itemOfKey(key){const i=key.indexOf(':');return {k:key.slice(0,i),id:key.slice(i+1),n:1}}
function vStats(){const S=MK.stats,cut=new Date(Date.now()+7*3600e3-7*864e5).toISOString().slice(0,10);const rows=[];let tc=0,tv=0;
 for(const key in S){let c=0,v=0,q=0;for(const r of S[key])if(r[0]>cut){c+=r[1];q+=r[2];v+=r[3]}if(c){rows.push({key,c,v,q});tc+=c;tv+=v}}
 rows.sort((a,b)=>b.c-a.c||b.v-a.v);const top=rows.slice(0,10),mx=top.length?top[0].c:1;
 let h='<div class="sm130"><div><small>ขายได้ 7 วัน</small><b>'+fmt(tc)+' ครั้ง</b></div><div><small>มูลค่าซื้อขาย 7 วัน</small><b>🪙 '+fmt(tv)+'</b></div><div><small>ของในตลาดตอนนี้</small><b>'+fmt(MK.list.length)+' รายการ</b></div></div><div class="sc130"><b style="color:#ffe9a0">🔥 ของขายดี 7 วัน</b>';
 if(!top.length)h+='<div class="em130">ยังไม่มีการซื้อขาย — กราฟจะขึ้นเมื่อมีคนซื้อของในตลาด</div>';
 for(const r of top){const it=itemOfKey(r.key);h+='<div class="bar130'+(MK.chart===r.key?' on':'')+'" data-a="chart" data-v="'+esc(r.key)+'"><img src="'+itIcon(it)+'"><span class="nm">'+esc(itName(it))+'</span><span class="bg"><i style="width:'+Math.max(4,r.c/mx*100)+'%"></i></span><span class="v">'+r.c+' ครั้ง · ~'+fmt(r.v/Math.max(1,r.q))+'/ชิ้น</span></div>'}
 const ck=MK.chart||(top[0]&&top[0].key);if(ck&&S[ck])h+=chart(ck);
 return h+'</div>'}
function chart(key){const A=MK.stats[key]||[],it=itemOfKey(key);const days=[];for(let i=13;i>=0;i--)days.push(new Date(Date.now()+7*3600e3-i*864e5).toISOString().slice(0,10));
 const m=new Map(A.map(r=>[r[0],r]));const pts=days.map(d=>{const r=m.get(d);return r?{d,p:r[3]/Math.max(1,r[2]),c:r[1]}:{d,p:null,c:0}});
 const ps=pts.filter(x=>x.p!=null).map(x=>x.p),hi=Math.max(1,...ps),lo=ps.length?Math.min(...ps):0,cm=Math.max(1,...pts.map(x=>x.c));const W=560,Hh=150,pad=30;
 const X=i=>pad+i*(W-pad-8)/13,Y=v=>Hh-22-(v-lo*.9)/(hi-lo*.9||1)*(Hh-44);
 let s='<svg viewBox="0 0 '+W+' '+Hh+'" preserveAspectRatio="none">';for(let i=0;i<14;i++){const c=pts[i].c;if(c)s+='<rect x="'+(X(i)-9)+'" y="'+(Hh-22-c/cm*40)+'" width="18" height="'+(c/cm*40)+'" fill="rgba(159,216,255,.25)" rx="3"/>'}
 const line=pts.map((x,i)=>x.p!=null?[X(i),Y(x.p)]:null).filter(Boolean);
 if(line.length>1)s+='<polyline points="'+line.map(q=>q.join(',')).join(' ')+'" fill="none" stroke="#ffd86a" stroke-width="2.5" stroke-linejoin="round"/>';
 for(const q of line)s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="3.5" fill="#fff6c0" stroke="#d9a42a"/>';
 s+='<text x="4" y="14" fill="#c8c0d8" font-size="11">'+fmt(hi)+'</text><text x="4" y="'+(Hh-24)+'" fill="#c8c0d8" font-size="11">'+fmt(lo)+'</text>';
 for(const i of [0,6,13])s+='<text x="'+X(i)+'" y="'+(Hh-6)+'" fill="#9a90aa" font-size="10" text-anchor="middle">'+days[i].slice(5).replace('-','/')+'</text>';
 return '<div class="cht130"><b style="color:#ffe9a0">📈 ราคาเฉลี่ยต่อชิ้น 14 วัน — '+esc(itName(it))+'</b> <small style="color:#9fd8ff">(แท่งฟ้า = จำนวนครั้งที่ขาย)</small>'+s+'</svg></div>'}
function render(keep){if(mkW.hidden)return;const T=MK.tab;let h='<div class="w"><div class="hd"><b>🏪 ตลาดกลางเอลโดเรีย</b><small style="color:#ffd86a;margin-right:6px">🪙 '+fmt(inv.coin)+'</small><button data-a="close">✕</button></div><div class="bd">';
 if(!on())h+='<div class="nt130">⚠️ ต้องเชื่อมต่อออนไลน์และเข้าสู่ระบบบัญชีก่อน จึงจะซื้อขายได้</div>';
 h+='<div class="tb130">'+[['buy','🛒 ซื้อของ'],['sell','💰 ลงขาย'],['mine','📦 ของที่ฉันขาย ('+MK.mine.length+')'],['stats','📈 ขายดี']].map(([k,n])=>'<button class="'+(T===k?'on':'')+'" data-a="tab" data-v="'+k+'">'+n+'</button>').join('')+'</div>';
 h+=T==='sell'?vSell():T==='mine'?vMine():T==='stats'?vStats():vBuy();
 const sc=mkW.querySelector('.sc130'),st=sc?sc.scrollTop:0,fid=document.activeElement&&document.activeElement.id,pos=fid&&document.activeElement.selectionStart;
 mkW.innerHTML=h+'</div></div>';const sc2=mkW.querySelector('.sc130');if(sc2&&keep)sc2.scrollTop=st;
 if(keep&&fid){const e=gid(fid);if(e){e.focus();try{e.setSelectionRange(pos,pos)}catch(er){}}}
 for(const i of mkW.querySelectorAll('input,select'))for(const ev of ['keydown','keyup','keypress'])i.addEventListener(ev,e=>e.stopPropagation())}
window.render130=render;
mkW.addEventListener('input',e=>{const t=e.target;if(t.id==='mkq130'){MK.q=t.value;render(1)}else if(t.id==='mksq130'){MK.sq=t.value;render(1)}else if(t.id==='mkqty130'){MK.qty=t.value;render(1)}else if(t.id==='mkpr130'){MK.price=t.value.replace(/[^0-9]/g,'');render(1)}});
mkW.addEventListener('change',e=>{const t=e.target;if(t.dataset.a==='sort'){MK.sort=t.value;render()}});
mkW.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.tagName==='SELECT')return;const a=b.dataset.a,v=b.dataset.v;
 if(a==='close'){closeMk()}else if(a==='tab'){MK.tab=v;sfx('ui');render()}else if(a==='cat'){MK.cat=v;render()}else if(a==='ref'){MK.loading=true;tx({t:'mkq'});render()}
 else if(a==='buy'){const l=MK.list.find(x=>x.id===+v);if(!l)return;confirm130('ซื้อ '+itLabel(l.item)+' ราคา 🪙 '+fmt(l.price)+' ?',()=>{mkBuy130(+v);render()})}
 else if(a==='pick'){const x=sellList().find(q=>q.k===b.dataset.k&&q.id===v);if(x){MK.sel={k:x.k,id:x.id,max:x.n};MK.qty=x.k==='mat'?Math.min(x.n,MK.qty>1?MK.qty:x.n):1;MK.price='';sfx('ui');render(1)}}
 else if(a==='unpick'){MK.sel=null;render(1)}else if(a==='qmax'&&MK.sel){MK.qty=MK.sel.max;render(1)}else if(a==='pset'){MK.price=String(v);render(1)}
 else if(a==='sell'){const s=MK.sel;if(!s)return;const n=s.k==='mat'?Math.max(1,Math.min(s.max,Math.floor(+MK.qty||1))):1;confirm130('ลงขาย '+itLabel(K(s).peek({k:s.k,id:s.id,n}))+' ราคา 🪙 '+fmt(+MK.price)+' ?',()=>mkSell130())}
 else if(a==='cancel'){confirm130('ยกเลิกการขาย? ของจะคืนทางจดหมาย',()=>mkCancel130(+v))}
 else if(a==='chart'){MK.chart=v;render(1)}});
const cfEl=document.createElement('div');cfEl.id='cf130';cfEl.hidden=true;gid('wrap').appendChild(cfEl);cfEl.addEventListener('pointerdown',e=>e.stopPropagation());
function confirm130(msg,yes){cfEl.innerHTML='<div class="bx"><div>'+esc(msg)+'</div><div style="display:flex;gap:8px;margin-top:12px;justify-content:center"><button class="bt130 y" id="cfy130">✅ ยืนยัน</button><button class="bt130 g" id="cfn130">ยกเลิก</button></div></div>';cfEl.hidden=false;sfx('ui');
 gid('cfy130').onclick=()=>{cfEl.hidden=true;yes()};gid('cfn130').onclick=()=>{cfEl.hidden=true}}
window.confirm130=confirm130;
function openMk(tab){if(tab)MK.tab=tab;MK.loading=true;p6open(mkW);render();tx({t:'mkq'})}
function closeMk(){p6close(mkW);tx({t:'mkClose'})}
window.openMk130=openMk;
setInterval(()=>{try{if(!mkW.hidden&&!(document.activeElement&&mkW.contains(document.activeElement)&&document.activeElement.tagName==='INPUT'))render(1)}catch(e){}},5000);
setInterval(()=>{try{if(on()&&(Object.keys(MK.pend).length||(MK.buy&&MK.buy.paid)))tx({t:'mkq'})}catch(e){}},15000);
// ---------- 🤝 เทรด ----------
const TR={tid:0,st:null,me:{items:[],coin:0},them:{items:[],coin:0},name:'',lv:0,lockMe:false,lockThem:false,okMe:false,okThem:false,picking:false,pq:'',inv:null};
window.TR130=TR;
const trW=mk6('tr130');window.trW130=trW;
window.trReq130=name=>{if(!on()){say('🤝 ต้องเชื่อมต่อออนไลน์และเข้าสู่ระบบก่อน');return}if(!name)return;if(TR.tid){say('🤝 กำลังเทรดอยู่');openTr();return}tx({t:'trReq',to:name})};
function trNet(d){
 if(d.t==='trInv'){showInv(d)}
 else if(d.t==='trSent'){say('🤝 ส่งคำขอเทรดถึง '+d.to+' แล้ว — รออีกฝ่ายตอบรับ');sfx('ui')}
 else if(d.t==='trNo'){say('🤝 '+(d.why||'เทรดไม่ได้'));sfx('thud')}
 else if(d.t==='trOpen'){TR.tid=d.tid;TR.st='open';TR.me={items:[],coin:0};TR.them={items:[],coin:0};TR.picking=false;hideInv();openTr();sfx('gem')}
 else if(d.t==='trState'){if(d.tid!==TR.tid)return;Object.assign(TR,{st:d.st,me:d.me,them:d.them,lockMe:d.lockMe,lockThem:d.lockThem,okMe:d.okMe,okThem:d.okThem,name:d.name,lv:d.lv});if(trW.hidden)openTr();else renderTr()}
 else if(d.t==='trCommit'){if(d.tid===TR.tid)commit(d)}
 else if(d.t==='trDone'){if(TRC[d.tid]){delete TRC[d.tid];saveC()}if(d.tid!==TR.tid)return;TR.tid=0;TR.st=null;sfx('chest');try{flash('#7dffa0',.25)}catch(e){}say('🤝 เทรดกับ '+d.name+' สำเร็จ! ของกำลังส่งเข้ากระเป๋า');if(!trW.hidden)p6close(trW)}
 else if(d.t==='trEnd'){const c=TRC[d.tid];if(c&&!c.sent)trBack(d.tid);if(d.tid!==TR.tid)return;TR.tid=0;TR.st=null;
  say('🤝 '+(d.why||'เทรดถูกยกเลิก'));sfx('thud');if(!trW.hidden)renderTr()}
 else if(d.t==='trComNo'){trBack(d.tid)}
 else if(d.t==='trChk'){const c=TRC[d.tid];if(!c||d.live)return;if(d.com){delete TRC[d.tid];saveC()}else trBack(d.tid)}}
const TRC=(()=>{try{return JSON.parse(localStorage.getItem('fm_trcom130')||'{}')||{}}catch(e){return {}}})();
const saveC=()=>{try{localStorage.setItem('fm_trcom130',JSON.stringify(TRC))}catch(e){}};
function trBack(tid){const c=TRC[tid];if(!c)return;delete TRC[tid];saveC();for(const it of c.items)restoreIt(it);if(c.coin)inv.coin=(inv.coin|0)+c.coin;try{refreshInv();saveGame(true)}catch(e){}try{say('↩️ คืนของจากเทรดที่ไม่สำเร็จเข้ากระเป๋าแล้ว')}catch(e){}}
setInterval(()=>{try{if(!on())return;const n=Date.now();for(const k in TRC)if(n-TRC[k].t>40000)tx({t:'trChk',tid:+k})}catch(e){}},10000);
async function commit(d){const mine=d.mine||{items:[],coin:0};
 for(const it of mine.items)if(!K(it)||!K(it).have(it)){say('🤝 ของในเทรดไม่ครบแล้ว — ยกเลิก');tx({t:'trX',tid:TR.tid});return}
 if((inv.coin|0)<(mine.coin|0)){say('🤝 เหรียญไม่พอ — ยกเลิก');tx({t:'trX',tid:TR.tid});return}
 const tid=TR.tid,took=[];for(const it of mine.items){const r=K(it).take(it);if(r)took.push(r)}inv.coin-=mine.coin|0;TRC[tid]={items:took,coin:mine.coin|0,sent:false,t:Date.now()};saveC();try{refreshInv()}catch(e){}renderTr();
 const ok=await sync();if(!TRC[tid])return;if(!ok){trBack(tid);say('☁️ เซฟขึ้นเซิร์ฟเวอร์ไม่สำเร็จ — ยกเลิกเทรด');tx({t:'trX',tid});return}
 TRC[tid].sent=true;TRC[tid].t=Date.now();saveC();tx({t:'trCom',tid})}
function sendOffer(){tx({t:'trSet',tid:TR.tid,items:TR.me.items,coin:TR.me.coin|0})}
function addOffer(k,id){if(TR.st!=='open')return;const items=TR.me.items.slice();if(items.length>=8){say('ใส่ได้สูงสุด 8 ช่อง');return}
 const x=sellList().find(q=>q.k===k&&q.id===id);if(!x)return;
 if(k==='mat'){const ex=items.find(i=>i.k==='mat'&&i.id===id);const cur=ex?ex.n:0;const want=prompt130('ใส่ '+itName(x)+' กี่ชิ้น? (มี '+x.n+')',Math.max(1,x.n-cur));if(!want)return;const n=Math.max(1,Math.min(x.n,Math.floor(+want)));if(ex)ex.n=n;else items.push({k,id,n})}
 else{const used=items.filter(i=>i.k==='gear'&&i.id===id).length;if(used>=x.n){say('ใส่ครบทุกชิ้นแล้ว');return}const p=K(x).peek({k,id,n:1});if(used>0){p.e=0;p.o=null}items.push(p)}
 TR.me.items=items;TR.picking=false;sendOffer();renderTr()}
function prompt130(m,d){try{return window.prompt(m,d)}catch(e){return d}}
function renderTr(){if(trW.hidden)return;let h='<div class="w" style="position:relative"><div class="hd"><b>🤝 เทรดของ</b><button data-a="close">✕</button></div><div class="bd">';
 if(!TR.tid){h+='<div class="nt130">ขอเทรดได้ 3 ทาง: แตะตัวผู้เล่นอื่นในเกม → 🤝 เทรด · เมนู 🌐 ผู้คน → 🔁 · หรือพิมพ์ชื่อด้านล่าง<br>ขั้นตอน: ใส่ของ/เหรียญ → 🔒 ล็อก (ทั้งสองฝ่าย) → ✅ ยืนยัน (ทั้งสองฝ่าย) → ของส่งถึงกันผ่าน 📬 จดหมาย (รับอัตโนมัติ)</div>'
  +'<div class="fl130"><input id="trn130" placeholder="ชื่อผู้เล่นที่ออนไลน์อยู่…"><button class="bt130 y" data-a="req">🤝 ขอเทรด</button><button class="bt130 g" data-a="ppl">🌐 ผู้คน</button></div>'
  +(on()?'':'<div class="nt130">⚠️ ต้องเชื่อมต่อออนไลน์และเข้าสู่ระบบบัญชีก่อน</div>');}
 else{const side=(o,me)=>{let s='<div class="slots130">';for(let i=0;i<8;i++){const it=o.items[i];s+=it?'<div class="sl130" title="'+esc(itLabel(it)+' — '+itStat(it))+'"'+(me&&TR.st==='open'?' data-a="rm" data-v="'+i+'"':'')+'><img src="'+itIcon(it)+'">'+((it.n|0)>1?'<em>'+fmt(it.n)+'</em>':it.e?'<em>+'+it.e+'</em>':'')+(me&&TR.st==='open'?'<span class="x">✕</span>':'')+'</div>':'<div class="sl130"'+(me&&TR.st==='open'?' data-a="add"':'')+'>'+(me&&TR.st==='open'?'＋':'')+'</div>'}
   s+='</div><div class="kv130"><span>🪙 เหรียญ</span>'+(me&&TR.st==='open'?'<input id="trc130" class="bt130 g" style="width:120px;text-align:right" inputmode="numeric" value="'+(o.coin|0)+'">':'<b>'+fmt(o.coin)+'</b>')+'</div>';
   s+='<div style="font-size:11px;color:#c8c0d8">'+(o.items.length?o.items.map(it=>'• '+esc(itLabel(it))+(it.o?' <span style="color:#9fe8ff">🎲'+esc(it.o.map(x=>{try{return line111(x)}catch(e){return ''}}).join(', '))+'</span>':'')).join('<br>'):'— ยังไม่มีของ')+'</div>';return s};
  h+='<div class="tw130"><div class="sd'+(TR.lockMe?' lk':'')+'"><h4><span>🧑 คุณ</span><span>'+(TR.okMe?'✅ ยืนยันแล้ว':TR.lockMe?'🔒 ล็อกแล้ว':'✏️ กำลังจัดของ')+'</span></h4>'+side(TR.me,true)+'</div>'
   +'<div class="sd'+(TR.lockThem?' lk':'')+'"><h4><span>👤 '+esc(TR.name)+' <small style="color:#a8a0b8">Lv.'+(TR.lv|0)+'</small></span><span>'+(TR.okThem?'✅ ยืนยันแล้ว':TR.lockThem?'🔒 ล็อกแล้ว':'✏️ กำลังจัดของ')+'</span></h4>'+side(TR.them,false)+'</div></div>';
  if(TR.st==='commit')h+='<div class="nt130" style="text-align:center;color:#7dffa0">⏳ กำลังฝากของไว้ที่เซิร์ฟเวอร์และส่งให้อีกฝ่าย… อย่าปิดเกม</div>';
  else h+='<div style="display:flex;gap:6px"><button class="bt130 '+(TR.lockMe?'g':'y')+'" style="flex:1" data-a="lock">'+(TR.lockMe?'🔓 ปลดล็อกแก้ของ':'🔒 ล็อกของ')+'</button><button class="bt130" style="flex:1" data-a="ok"'+(TR.lockMe&&TR.lockThem&&!TR.okMe?'':' disabled')+'>✅ ยืนยันเทรด</button><button class="bt130 r" data-a="x">ยกเลิก</button></div>'
   +'<small style="color:#a8a0b8;text-align:center">อีกฝ่ายแก้ของเมื่อไหร่ การล็อกของทั้งคู่จะปลดเอง — ตรวจของให้ดีก่อนกดยืนยัน</small>';
  if(TR.picking){const q=TR.pq.trim().toLowerCase(),L=sellList().filter(x=>!q||(itName(x)+' '+x.id).toLowerCase().includes(q));
   h+='<div class="inv130"><div class="fl130"><b style="color:#ffe9a0;flex:1">🎒 เลือกของ</b><button class="bt130 g" data-a="pclose">✕</button></div><div class="fl130"><input id="trq130" placeholder="🔎 ค้นหา…" value="'+esc(TR.pq)+'"></div><div class="sc130"><div class="ls130">';
   for(const x of L.slice(0,250))h+='<div class="cd130" data-a="padd" data-k="'+x.k+'" data-v="'+esc(x.id)+'"><img src="'+itIcon(x)+'"><div class="t"><b>'+esc(itName(x))+'</b><small>มี ×'+fmt(x.n)+'</small></div></div>';
   h+='</div></div></div>'}}
 const fid=document.activeElement&&document.activeElement.id,pos=fid&&document.activeElement.selectionStart;
 trW.innerHTML=h+'</div></div>';if(fid){const e=gid(fid);if(e){e.focus();try{e.setSelectionRange(pos,pos)}catch(er){}}}
 for(const i of trW.querySelectorAll('input'))for(const ev of ['keydown','keyup','keypress'])i.addEventListener(ev,e=>{e.stopPropagation();if(ev==='keydown'&&e.key==='Enter'&&i.id==='trn130')trReq130(i.value.trim())})}
trW.addEventListener('input',e=>{const t=e.target;if(t.id==='trq130'){TR.pq=t.value;renderTr()}});
trW.addEventListener('change',e=>{const t=e.target;if(t.id==='trc130'){TR.me.coin=Math.max(0,Math.min(inv.coin|0,Math.floor(+t.value.replace(/[^0-9]/g,'')||0)));sendOffer();renderTr()}});
trW.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v;
 if(a==='close'){p6close(trW)}else if(a==='req'){const i=gid('trn130');trReq130(i&&i.value.trim())}else if(a==='ppl'){p6close(trW);try{openPeople72('on')}catch(er){}}
 else if(a==='add'){TR.picking=true;TR.pq='';renderTr()}else if(a==='pclose'){TR.picking=false;renderTr()}else if(a==='padd'){addOffer(b.dataset.k,v)}
 else if(a==='rm'){TR.me.items.splice(+v,1);sendOffer();renderTr()}
 else if(a==='lock'){tx({t:'trLock',tid:TR.tid,on:!TR.lockMe})}
 else if(a==='ok'){confirm130('ยืนยันเทรดกับ '+TR.name+'? ตรวจของอีกฝ่ายแล้วใช่ไหม',()=>tx({t:'trOk',tid:TR.tid}))}
 else if(a==='x'){tx({t:'trX',tid:TR.tid})}});
function openTr(){p6open(trW);renderTr()}
window.openTr130=openTr;
const invEl=document.createElement('div');invEl.id='trInv130';invEl.hidden=true;gid('wrap').appendChild(invEl);invEl.addEventListener('pointerdown',e=>e.stopPropagation());
function showInv(d){TR.inv=d;invEl.innerHTML='🤝 <b>'+esc(d.from)+'</b> <small>Lv.'+(d.lv|0)+'</small> ขอเทรดกับคุณ<div style="display:flex;gap:8px;margin-top:8px;justify-content:center"><button class="bt130" id="tia130">✅ รับ</button><button class="bt130 r" id="tin130">ปฏิเสธ</button></div>';invEl.hidden=false;sfx('gem');
 gid('tia130').onclick=()=>{tx({t:'trAns',fid:d.fid,yes:1});hideInv()};gid('tin130').onclick=()=>{tx({t:'trAns',fid:d.fid,yes:0});hideInv()};clearTimeout(invEl._t);invEl._t=setTimeout(hideInv,55000)}
function hideInv(){invEl.hidden=true;TR.inv=null}
/* ปิดเกม/รีโหลดระหว่างฝากของ: ของถูกหักไปแล้ว → เซิร์ฟเวอร์จะส่งของให้อีกฝ่าย หรือคืนเราทางจดหมายเอง */
// ---------- ทางเข้า ----------
try{const at=PM7.findIndex(m=>m[1]==='ประมูล');PM7.splice(at<0?PM7.length:at,0,['🏪','ตลาดกลาง',()=>openMk()],['🤝','เทรด',()=>openTr()]);pmRender7()}catch(e){}
{const pm=gid('pm9');if(pm){new MutationObserver(()=>{try{if(pm.hidden||pm.querySelector('.tr130'))return;const b0=pm.querySelector('button[onclick^="PM9("]');if(!b0)return;const id=(/,'([^']*)'\)/.exec(b0.getAttribute('onclick'))||[])[1];if(!id)return;
   const b=document.createElement('button');b.className='mini tr130';b.style.cssText='display:block;width:100%;margin-top:4px;background:#2a3a1f;color:#e8ffd8;border:1px solid #b8ff7d';b.textContent='🤝 ขอเทรด';
   b.onclick=()=>{const o=NET.others.get(+id)||NET.others.get(id);trReq130(o&&o.name);PM9CLOSE()};b0.parentNode.insertBefore(b,b0)}catch(e){}}).observe(pm,{childList:true,attributes:true,attributeFilter:['hidden']})}}
try{const pw=gid('ppl72');if(pw)new MutationObserver(()=>{try{for(const b of pw.querySelectorAll('button[onclick^="whisper72("]')){if(b.nextElementSibling&&b.nextElementSibling.classList.contains('tr130b'))continue;const nm=(/whisper72\('(.*)'\)$/.exec(b.getAttribute('onclick'))||[])[1];if(nm==null)continue;
  const t=document.createElement('button');t.className='b72 tr130b';t.title='ขอเทรด';t.textContent='🔁';t.onclick=()=>trReq130(nm.replace(/\\'/g,"'").replace(/\\\\/g,'\\'));b.after(t)}}catch(e){}}).observe(pw,{childList:true,subtree:true})}catch(e){}
// คำอธิบายในกล่องจดหมาย
try{if(typeof mailDesc81==='function'){const _md=mailDesc81;mailDesc81=function(m){try{if(m.k==='mk')return {ic:'🏪',t:'🏪 ซื้อจากตลาด: '+itLabel(m.item),s:'จ่าย 🪙 '+fmt(m.paid)+' · ผู้ขาย '+(m.from||'')};if(m.k==='mkret')return {ic:'🏪',t:'🏪 คืนของ: '+itLabel(m.item),s:m.why||''};
  if(m.k==='tr')return {ic:'🤝',t:(m.back?'↩️ คืนของจากเทรด':'🤝 ของจากเทรดกับ '+(m.from||'')),s:[...(m.items||[]).map(itLabel),m.coin?'🪙 '+fmt(m.coin):''].filter(Boolean).join(', ')}}catch(e){}return _md.apply(this,arguments)};window.mailDesc81=mailDesc81}}catch(e){}
}catch(e){console.warn('fix130',e)}
