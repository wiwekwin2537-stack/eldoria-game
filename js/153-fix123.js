// fix123 (v5.00) — 🔒 ปิดช่องโหว่ก่อนเปิดเซิร์ฟ (ตรวจเล่นจริง 2026-10-15)
//  1) นาฬิกาเซิร์ฟเวอร์: เดิมรางวัลรายวัน/เควสรายวัน/โควตาบอสตำนาน/คูลดาวน์/ดอกเบี้ยธนาคาร ใช้เวลาเครื่อง → เลื่อนเวลามือถือ = รับซ้ำได้ไม่จำกัด
//     → ใช้เวลาเซิร์ฟเวอร์ (/api/ping + เวลาที่ได้จากการเซฟ) · ระหว่างยังไม่ได้เวลาเซิร์ฟเวอร์ ระบบรายวันรอก่อน
//  2) ซื้อของแผงร้านผู้เล่น / ประมูล / เปิดแผงขาย: เดิมหักเหรียญ/เอาของออก แล้วส่งให้เซิร์ฟเวอร์ทันที โดยเซฟขึ้นคลาวด์ทีหลัง (ทุก 15 วิ)
//     → ปิดแอปทันทีหลังซื้อ = เหรียญกลับมา (อีกฝ่ายได้เงินไปแล้ว) = ปั๊มเงิน/ปั๊มของกับเพื่อนได้
//     → ต้องเซฟขึ้นคลาวด์สำเร็จก่อน ค่อยส่งคำสั่งซื้อ/ประมูล/วางขาย
//  3) ประมูล: เดิมหักเงินตอนเซิร์ฟเวอร์ตอบรับ (ถ้าเงินไม่พอตอนนั้นจะหักเหลือ 0) → กดประมูลหลายชิ้นพร้อมกันด้วยเงินก้อนเดียว แล้วโดนแซง = ได้คืนหลายเท่า
//     → หักเงินก่อนส่ง · ประมูลได้ทีละครั้ง · ไม่สำเร็จคืนเงิน
try{
// ---------- 1) server clock ----------
const setOff123=(st,t0,t1)=>{if(!(st>1.5e12))return;SRV.pb=st-(t0+t1)/2;SRV.ok=true};
{const _c=CLOUD.call;CLOUD.call=async function(path,body,ms){const t0=performance.now();const r=await _c.apply(this,arguments);try{const t1=performance.now();if(r&&r.ok){if(path==='/api/ping'&&r.t)setOff123(r.t,t0,t1);else if(path==='/api/save'&&r.upd&&t1-t0<8000)setOff123(r.upd,t0,t1)}}catch(e){}return r}}
const ping123=async()=>{try{if(!CLOUD.base()){SRV.ok=true;return}await CLOUD.call('/api/ping',{},8000)}catch(e){}};
ping123();setInterval(()=>{if(!SRV.ok||Math.random()<.02)ping123()},5000);
// ---------- 2) sync-before-send for player trades ----------
const sl123=ms=>new Promise(r=>setTimeout(r,ms));
async function safeSync123(){for(let i=0;i<80&&CLOUD.inflight;i++)await sl123(100);const t0=CLOUD.t||0;try{saveGame(true)}catch(e){}
 try{await CLOUD.sync(true)}catch(e){}return (CLOUD.t||0)>t0}
window.safeSync123=safeSync123;
const HOLD123=/^\{"t":"(stall|sbuy|abid)"/;let q123=Promise.resolve();
{const _send=WebSocket.prototype.send;WebSocket.prototype.send=function(m){const ws=this;
 if(typeof m==='string'&&HOLD123.test(m)&&!(m.startsWith('{"t":"stall"')&&/"items":\[\]|^\{"t":"stall"\}$/.test(m))&&CLOUD.base()&&typeof FM_ACCT!=='undefined'&&FM_ACCT){
  q123=q123.then(async()=>{const ok=await safeSync123();if(ok){try{_send.call(ws,m)}catch(e){}}
   else{const t=(m.match(/^\{"t":"(\w+)"/)||[])[1];try{say('☁️ เซฟขึ้นเซิร์ฟเวอร์ไม่สำเร็จ — '+(t==='stall'?'ยังไม่ได้เปิดแผงขาย':'ยกเลิกรายการนี้แล้ว')+' ลองใหม่อีกครั้ง');sfx('thud')}catch(e){}
    if(t==='abid')try{aucFail123()}catch(e){}}});return}
 return _send.call(this,m)}}
// ซื้อจากแผง: ตอบกลับช้าเกิน 10 วิ เกมคืนเงินไปแล้ว แต่ซื้อสำเร็จทีหลัง → หักเงินอีกครั้ง (เดิมได้ของฟรี)
{const _g=stallGot10;stallGot10=function(d){try{const key=d.from+':'+(d.item?d.item.i:d.i);if(d.ok&&d.item&&BUY10[key]==null){inv.coin=Math.max(0,(inv.coin|0)-(d.item.p|0));try{say('🪙 หักค่าของ '+(d.item.p|0).toLocaleString()+' (ซื้อสำเร็จหลังหมดเวลา)')}catch(e){}}}catch(e){}const r=_g.apply(this,arguments);try{if(d&&d.ok)safeSync123()}catch(e){}return r};window.stallGot10=stallGot10}
// ปิดแผง/ถอนของ พร้อมกับที่มีคนซื้อพอดี → เดิมของกลับเข้ากระเป๋าผู้ขาย และผู้ซื้อก็ได้ของ (ของซ้ำ) → ถ้าขายไปแล้วให้หักของคืน + ได้เงินตามปกติ
{const _s=stallSold10;stallSold10=function(d){try{const it=d&&d.item;if(it&&!STALL10.items.some(x=>x.i===d.i)){
  if(it.k==='mat'){inv[it.id]=Math.max(0,(inv[it.id]|0)-(it.n|0))}else if(GEAR[it.id]>0){GEAR[it.id]--;if(GEAR[it.id]<=0)delete GEAR[it.id]}
  inv.coin=(inv.coin|0)+(it.p|0);try{refreshInv();saveGame(true)}catch(e){}try{say('💰 '+(d.bn||'ผู้เล่น')+' ซื้อ '+(it.nm||it.id)+' ไปก่อนเก็บร้าน — ได้ 🪙 '+(it.p|0).toLocaleString())}catch(e){}try{safeSync123()}catch(e){}return}}catch(e){}const r=_s.apply(this,arguments);try{safeSync123()}catch(e){}return r};window.stallSold10=stallSold10}
// ---------- 3) auction: pay first, one bid at a time ----------
let AUCP=null;
function aucFail123(){if(!AUCP)return;inv.coin=(inv.coin|0)+AUCP.amt;AUCP=null;try{refreshInv();saveGame(true)}catch(e){}}
window.aucBid10=id=>{const el=gid('ab10_'+id),amt=Math.floor(+(el&&el.value)||0);if(!ON10.auth){say('🔨 ต้องเข้าสู่ระบบบัญชีออนไลน์ก่อน');sfx('thud');return}
 if(AUCP){say('🔨 รอผลการประมูลครั้งก่อนสักครู่');sfx('thud');return}
 if(!(amt>0)||amt>(inv.coin|0)){say('🪙 เหรียญไม่พอ');sfx('thud');return}
 inv.coin-=amt;AUCP={amt,id,t:Date.now()};try{refreshInv();saveGame(true)}catch(e){}ws10({t:'abid',id,amt});
 setTimeout(()=>{if(AUCP&&Date.now()-AUCP.t>=29e3){aucFail123();say('⌛ ประมูลไม่สำเร็จ (หมดเวลา) — คืนเหรียญแล้ว')}},30000)};
{const _nm=netMsg;netMsg=function(d){try{if(d&&d.t==='abid_ok'){if(AUCP){inv.coin=(inv.coin|0)+(d.amt|0);AUCP=null}else if((inv.coin|0)<(d.amt|0)){d=Object.assign({},d)}}
 else if(d&&d.t==='abid_no'){aucFail123()}}catch(e){}return _nm.call(this,d)};window.netMsg=netMsg}
// ---------- 3b) ปุ่ม GM: เดิมดูแค่ชื่อไอดีในเครื่อง → ต้องให้เซิร์ฟเวอร์ยืนยันว่าเป็น GM ด้วย (ON10.gm จาก auth) ----------
try{const _ga=gmAllowed;gmAllowed=function(){if(!_ga())return false;try{if(sessionStorage.getItem('fm_gm7')==='1')return true;if(CLOUD.base()&&!(typeof ON10!=='undefined'&&ON10.gm))return false}catch(e){}return true};window.gmAllowed=gmAllowed;
 setInterval(()=>{try{if(gmAllowed()&&!document.getElementById('gmb'))gmBtn()}catch(e){}},3000)}catch(e){}
// ---------- 3c) fix125: ใส่อุปกรณ์ระดับ 1–8 ได้ทุกเลเวล (ระดับ 9–10 / ชุดบอส / ชุดนครวารี มีเลเวลขั้นต่ำอยู่แล้ว) ----------
//  → Lv.1 รับชุดระดับ 8 จากเพื่อน (แผงร้าน/ทิ้งของ) แล้วใส่ได้ทันที = ข้ามการเก็บเลเวล
//  → เลเวลขั้นต่ำ = เลเวลที่ปลดตำราช่างระดับนั้น (1:Lv5 · 2:Lv20 · 3:Lv40 · 4:Lv60 · 5:Lv80 · 6:Lv85 · 7:Lv92 · 8:Lv98)
try{const req125=it=>{if(!it||it.boss59||it.c2101||it.extra7||!(it.tier>=1&&it.tier<=8))return 0;if(it.kind==='axe'||it.kind==='pick')return 0;const q=SMQ[it.tier];return q?(q.lv|0):0};window.req125=req125;
 const _eq=equipItem;equipItem=function(id){const it=ITEMS[id],L=req125(it);if(L&&P.lv<L){say('🔒 '+it.name+' ต้อง Lv.'+L+' ขึ้นไป');sfx('thud');return}return _eq.apply(this,arguments)};window.equipItem=equipItem}catch(e){console.warn('fix125 eq',e)}
// ---------- 3d) fix125: บอร์ดเควสกิลด์ ----------
//  1) Lv.111 ขึ้นไป เปิดบอร์ดเควสแล้วเกม error (ทุกเควสตั้งเลเวลสูงสุดไว้ 100+10 → ไม่มีเควสให้สุ่ม) → เลเวลเกินใช้เควสระดับสูงสุดแทน
//  2) ฟาร์ม XP ไม่จำกัด: รับเควส → มีเควสใหม่มาแทนทันที + รีเฟรช 20🪙 ได้ไม่จำกัด → เลือกแต่ "ขุดแร่ 6 ก้อน" 3 อันพร้อมกัน
//     ขุดหิน 8 ก้อน (ครั้งเดียวนับทั้ง 3 เควส) = 17% ของเลเวล ทุก ~1 นาที (Lv.100 ≈ 10 เลเวล/ชม.)
//     → รับเควสแล้วช่องว่างจนบอร์ดรีเฟรชรอบชั่วโมง · รีเฟรชแบบจ่ายเงินได้ 3 ครั้ง/ชม. · รับรางวัล XP ได้ 12 เควส/วัน (เกินนั้นได้เหรียญ/หินตามปกติ ไม่ได้ XP)
try{
 qGen=function(){const L=P.lv;let C=QT.filter(q=>L>=q[4]&&L<=q[5]+10);if(!C.length)C=QT.filter(q=>L>=q[4]&&q[5]>=100);const q=C[Math.random()*C.length|0];
  const n=q[0]==='floor'?Math.min(DGMAX7(),DG.max+1+Math.floor(Math.random()*3)):Math.max(1,Math.round(q[3]*(.8+Math.random()*.6)));
  return{t:q[0],k:q[1],d:q[2]+' '+n+(q[0]==='floor'?'':q[0]==='item'?' ชิ้น':q[0]==='fish'?' ตัว':q[0]==='mine'?' ก้อน':' ตัว'),n,c:0,coin:Math.round((20+L*8)*(q[0]==='boss'?3:q[0]==='floor'?2:1)),xp:Math.round(need(L)*(q[0]==='boss'?.35:.18)),es:q[0]==='boss'||q[0]==='floor'?2:Math.random()<.5?1:0}};window.qGen=qGen;
 const GQ={get(){let o={};try{o=JSON.parse(localStorage.getItem('fm_gq125')||'{}')||{}}catch(e){}const d=new Date(srvNow()+7*3600e3).toISOString().slice(0,10),h=Math.floor(srvNow()/3600000);if(o.d!==d){o.d=d;o.x=0}if(o.h!==h){o.h=h;o.r=0}return o},set(o){try{localStorage.setItem('fm_gq125',JSON.stringify(o))}catch(e){}}};
 const XMAX=12,RMAX=3;window.GQ125=GQ;
 qRefresh=function(force){const d=Math.floor(srvNow()/3600000);if(force){const o=GQ.get();if((o.r|0)>=RMAX)return false;o.r=(o.r|0)+1;GQ.set(o)}
  if(force||QST.day!==d||!QST.offer.length){QST.day=d;QST.offer=[qGen(),qGen(),qGen(),qGen()]}return true};window.qRefresh=qRefresh;
 qTake=function(i){if(QST.act.length>=3){say('รับเควสได้สูงสุด 3 เควส');sfx('thud');return}const q=QST.offer.splice(i,1)[0];if(!q)return;if(q.t==='floor'&&DG.max>=q.n)q.c=q.n;QST.act.push(q);sfx('ui');say('📜 รับเควส: '+q.d);saveX();openGuild('mine')};window.qTake=qTake;
 {const _qc=qClaim;qClaim=function(i){const q=QST.act[i];const o=GQ.get();let cut=false;if(q&&(o.x|0)>=XMAX&&q.xp>0){q.xp=0;cut=true}
  const n0=QST.act.length;const r=_qc.apply(this,arguments);if(QST.act.length<n0){o.x=(o.x|0)+1;GQ.set(o);if(cut)say('📜 วันนี้รับ XP จากเควสกิลด์ครบ '+XMAX+' เควสแล้ว — ได้เหรียญ/หินตามปกติ (XP รีเซ็ตเที่ยงคืน)')}return r};window.qClaim=qClaim}
 {const _og=openGuild;openGuild=function(){const r=_og.apply(this,arguments);try{const o=GQ.get();const sm=shopEl.querySelector('.ghd small')||shopEl.querySelector('small');
   if(sm)sm.textContent='เควสสำเร็จแล้ว '+QST.done+' · รับได้พร้อมกัน 3 เควส · บอร์ดใหม่ทุก 1 ชม. · รีเฟรชเองเหลือ '+Math.max(0,RMAX-(o.r|0))+'/'+RMAX+' · รับ XP วันนี้ '+Math.min(o.x|0,XMAX)+'/'+XMAX;
   for(const b of shopEl.querySelectorAll('button')){if(/รีเฟรช/.test(b.textContent))b.setAttribute('onclick',"refresh125()")}
   const em=shopEl.querySelector('.gempty');if(em&&/ไม่มีเควสบนบอร์ด/.test(em.textContent))em.textContent='รับเควสบนบอร์ดหมดแล้ว — เควสใหม่มาต้นชั่วโมงถัดไป'}catch(e){}return r};window.openGuild=openGuild}
 window.refresh125=()=>{if((inv.coin|0)<20){say('เหรียญไม่พอ');return}if(!qRefresh(1)){say('🔄 รีเฟรชครบ '+RMAX+' ครั้งในชั่วโมงนี้แล้ว — รอบอร์ดใหม่ต้นชั่วโมง');sfx('thud');return}inv.coin-=20;refreshInv();openGuild('board')};
}catch(e){console.warn('fix125 guild',e)}
// ---------- 3e) fix126: มือถือแนวนอน — กล่องบทสอน (#tut z26) และแชต (#chatBox z4) ทับหน้าต่างสถานะ (#chp z4) / กระเป๋า / ร้าน (z22) จนอ่านไม่ได้ ----------
try{const st=document.createElement('style');st.textContent='#tut{z-index:19!important}#chp{z-index:23!important}';document.head.appendChild(st)}catch(e){}
// ---------- 3f) fix126: เดินจากเมืองไปนครวารี ขึ้นข้อความ "ออกจากเมือง — ทุ่งหญ้าเอลโดเรีย" (ผิดที่) ----------
try{const _c2=enterCity2;enterCity2=function(){const r=_c2.apply(this,arguments);setTimeout(()=>{try{if(inC2())say('⚓ นครวารีอัสตรา — เมืองท่าแห่งดันเจี้ยน · ประตูมิติดันเจี้ยนอยู่เกาะเหนือ · ผู้บัญชาการไลอ้อสอยู่กลางลาน')}catch(e){}},1600);return r};window.enterCity2=enterCity2}catch(e){}
// ---------- 4) เนื้อเรื่องที่ไม่ตรงกับเกม ----------
try{const F=t=>STCH.find(c=>c&&typeof c.t==='string'&&c.t.startsWith(t));
 // บท 13: บอสชั้น 100 ชื่อ "จักรพรรดิเงาแห่งห้วงลึก" ซ้ำกับ "จักรพรรดิเงา" บอสใหญ่ภาค 3 (บท 22–26 บอกว่าจักรพรรดิเงาคือผู้อยู่เบื้องหลัง "เงาแห่งห้วงลึก")
 const c13=F('บทที่ 13:');if(c13){c13.d='ลงดันเจี้ยนชั้น 100 และปราบ '+ABYSS.n;if(typeof c13.intro==='string')c13.intro=c13.intro.replace(/จักรพรรดิเงาแห่งห้วงลึก/g,ABYSS.n);if(Array.isArray(c13.done))c13.done=c13.done.map(x=>x.replace('ปราบจักรพรรดิเงาได้จริง','ปราบเงาแห่งห้วงลึกได้จริง'))}
 // บท 2: บอกให้ตี "อาวุธเหล็ก" แต่เงื่อนไขคืออาวุธเซ็ตพฤกษาโบราณ (ดาบเริ่มต้นคือดาบนักล่าเงา ไม่ใช่ดาบหิน)
 const c2=F('บทที่ 2:');if(c2&&typeof c2.intro==='string')c2.intro='อาวุธเริ่มต้นสู้อสูรในเหมืองไม่ไหวแล้ว! ไปหาบอริน "หนวดเหล็ก" ที่โรงตีเหล็ก รับตำราช่าง แล้วคราฟอาวุธเซ็ตพฤกษาโบราณด้วยมือเจ้าเอง (Lv.5)';
 // บท 3: มี 11 อาชีพ ไม่ใช่แค่ ดาบ เวท ธนู
 const c3=F('บทที่ 3:');if(c3&&typeof c3.intro==='string')c3.intro='ปรมาจารย์อาชีพที่จัตุรัสรอคนอย่างเจ้าอยู่ เมื่อถึง Lv.10 จงไปเลือกทางของตน — มีให้เลือกถึง 11 อาชีพ ตั้งแต่นักรบ จอมเวท นักธนู ไปจนถึงนินจาและนักอัญเชิญ';
 // บท 18: แท่นผนึกย้ายมาอยู่ในหอผนึกอสูรกลางเมืองแล้ว (fix113) ไม่ได้อยู่ใต้หอคอย
 const c18=F('บทที่ 18:');if(c18&&typeof c18.intro==='string')c18.intro=c18.intro.replace('แท่นผนึกอสูรใต้หอคอยสั่นสะเทือน','แท่นผนึกอสูรในหอผนึกกลางเมืองสั่นสะเทือน');
 // บท 27: ที่ดินผู้กล้าถูกเอาออกจากเกมแล้ว (fix114) ผู้เล่นใหม่ไม่เคยเห็น
 const c27=F('บทที่ 27:');if(c27&&typeof c27.intro==='string')c27.intro=c27.intro.replace('ประตูขวาของเมืองที่เคยพาไปที่ดินผู้กล้า บัดนี้คือถนนสู่นครวารี','ประตูขวา (ตะวันออก) ของเมืองคือถนนสู่นครวารี');
}catch(e){console.warn('fix123 story',e)}
}catch(e){console.warn('fix123',e)}
