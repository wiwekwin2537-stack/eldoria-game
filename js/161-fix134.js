// =====================================================================
// fix134 (v5.03) — จุดเข้า-ออกเป็นธรรมชาติ + 🧭 ผู้นำทางสองพี่น้อง (วาปแบบเสียเงิน ไปได้เฉพาะที่เคยไป)
//  A) ลานผนึก (บอสตำนาน): เข้าจากในหอผนึกอสูร → ออกมากลางเมือง ✗ → ตอนนี้กลับเข้าไปยืนในหอผนึกอสูรที่เดิม
//  B) ล่องเรือกลับจากเมือง 2 → เดิมโผล่ขอบเมือง → ตอนนี้ขึ้นฝั่งข้างผู้นำทางที่น้ำพุ
//  C) กัปตันเรือ 2 คน → "อาร์เทน ผู้นำทาง" (เมืองเอลโดเรีย) และ "เอเดน ผู้นำทาง" น้องชาย (นครวารี)
//     พาไปได้ทุกที่ "ที่เคยไปแล้ว" เสียเงินรายครั้ง · เมนูลัด 🏙️ เมือง 2 (วาปฟรี) เปลี่ยนเป็นบอกทางไปหาผู้นำทาง
// =====================================================================
try{
const cover=(o,f)=>{try{if(window.LoadingScreenManager&&LoadingScreenManager.cover)return LoadingScreenManager.cover(o,f)}catch(e){}f()};
// ---------- A) ลานผนึก → กลับเข้าหอผนึกอสูร ----------
const RT={};window.RT134=RT;
{const _e=enter62;enter62=function(){const was=D&&D.shop==='seal113'?{x:P.x,y:P.y,t:Date.now()}:null;const r=_e.apply(this,arguments);if(was)RT.lb=was;return r};window.enter62=enter62}
{const _l=leave62;leave62=function(){const R=RT.lb;if(!R||!in62()||Date.now()-R.t>6*3600e3)return _l.apply(this,arguments);delete RT.lb;try{AOE62.length=0}catch(e){}
  cover({icon:'🔮',title:'กลับหอผนึกอสูร'},()=>{try{exitD()}catch(e){}try{if(!D||!D.town)enterTown(1)}catch(e){}try{enterShop('seal113')}catch(e){}P.x=R.x;P.y=R.y;P.dir='d';P.kx=P.ky=0;try{say('🔮 กลับมาที่หอผนึกอสูรแล้ว')}catch(e){}})};window.leave62=leave62}
// ---------- สถานที่ที่เคยไป ----------
const VK='fm_visit134';let V={};try{V=JSON.parse(localStorage.getItem(VK)||'{}')||{}}catch(e){}
const visit=k=>{if(V[k])return;V[k]=Date.now();try{localStorage.setItem(VK,JSON.stringify(V))}catch(e){}};window.visit134=visit;window.VISIT134=V;
{const _ez=enterZone;enterZone=function(i){const r=_ez.apply(this,arguments);try{const Z=ZONES[i];if(Z&&!Z.dg&&i<200&&D&&D.zone&&!D.dg)visit('z:'+i)}catch(e){}return r};window.enterZone=enterZone}
setInterval(()=>{try{if(!titleEl.hidden)return;if(D&&D.city2)visit('c2');if(!D)visit('field');if(D&&D.dg)visit('cave')}catch(e){}},1500);
// ---------- C) ผู้นำทาง ----------
const NM1='อาร์เทน ผู้นำทาง',NM2='เอเดน ผู้นำทาง';
setInterval(()=>{try{if(!D||!D.npcs)return;for(const n of D.npcs){if(!n.c2warp||n.g134)continue;n.g134=1;
  if(D.city2){n.name=NM2;n.lines=['ข้าชื่อเอเดน น้องชายของอาร์เทนที่เมืองเอลโดเรีย','เคยไปที่ไหนมาแล้ว ข้าพาไปได้หมด — ค่าเดินทางนิดหน่อย']}
  else{n.name=NM1;n.lines=['ข้าชื่ออาร์เทน ผู้นำทางแห่งเอลโดเรีย','น้องชายข้า เอเดน ประจำอยู่ที่นครวารี','ที่ไหนที่เจ้าเคยไปแล้ว ข้าพาไปได้ในพริบตา']}}}catch(e){}},500);
const leaveAll=()=>{try{if(D&&D.shop)leaveShop(true)}catch(e){}for(let k=0;k<3&&D;k++){try{exitD()}catch(e){break}}};
const nearGuide=()=>{P.x=24.5*T;P.y=20.2*T;P.dir='d';P.kx=P.ky=0};
/* ค่าเดินทาง (fix137 ปรับตามรายได้จริง): มอนให้ ≈ เลเวล+8 เหรียญ/ตัว · ฟาร์มจริง ~30 ตัว/นาที → 1 นาที ≈ 30×(Lv+8)
   ใกล้ (ทุ่งหญ้า/ถ้ำ) ≈ 20 วิของรายได้ · เหมือง/ป่า ≈ 40 วิตามเลเวลแมพ · ข้ามเมือง ≈ 1.5 นาที (ขั้นต่ำ 2,000) — เดินไปเองยังฟรี */
const r10=v=>Math.max(10,Math.round(v/10)*10),feeNear=()=>r10(10*((P.lv|0)+8)),feeZone=lv=>r10(20*(lv+8)),feeCross=()=>Math.max(2000,r10(45*((P.lv|0)+8)));window.FEE137={feeNear,feeZone,feeCross};
function dests(){const L=[],c2=!!(D&&D.city2);
 if(c2)L.push({k:'town',n:'🏰 เมืองเอลโดเรีย (ข้างอาร์เทน)',p:feeCross(),go:()=>{leaveAll();enterTown(1);nearGuide()}});
 else if(V.c2&&P.lv>=C2.LV)L.push({k:'c2',n:'🏙️ นครวารีอัสตรา (ข้างเอเดน)',p:feeCross(),go:()=>{try{enterCity2()}catch(e){}}});
 L.push({k:'field',n:'🌾 ทุ่งหญ้า — หน้าประตูมิติ',p:feeNear(),go:()=>{leaveAll();P.x=ZG.x;P.y=ZG.y+48;P.dir='d'}});
 if(V.cave)L.push({k:'cave',n:'🗝️ หน้าถ้ำดันเจี้ยน',p:r10(feeNear()*1.5),go:()=>{leaveAll();P.x=CV.tx*T+16;P.y=(CV.ty+2)*T+16;P.dir='d'}});
 if(V.port144&&window.enterRoad144)L.push({k:'port',n:'⚓ ท่าเรือตะวันออก (ข้างลุงบรอม)',p:c2?feeCross():feeNear(),go:()=>{leaveAll();enterRoad144('port',1)}});
 ZONES.forEach((Z,i)=>{if(!Z||Z.dg||i>=200||!V['z:'+i])return;const lv=(Z.lv&&Z.lv[0])|0;L.push({k:'z'+i,n:(Z.e||'⛏️')+' '+Z.n+' (Lv.'+lv+')',p:feeZone(lv),go:()=>{leaveAll();enterZone(i)}})});
 return L}
function guide(n){const L=dests(),me=D&&D.city2?NM2:NM1;
 const txt=(D&&D.city2?'ข้าคือเอเดน น้องชายอาร์เทน':'ข้าคืออาร์เทน ผู้นำทางแห่งเอลโดเรีย')+' — จะไปที่ไหนดี?\nพาไปได้เฉพาะที่ที่เจ้าเคยไปมาแล้ว · คิดค่าเดินทางรายครั้ง · 🪙 มี '+(inv.coin|0).toLocaleString()+(L.length<=2?'\n(ไปเที่ยวเหมือง ป่า ถ้ำ หรือนครวารีก่อน แล้วจะมีที่ให้เลือกมากขึ้น)':'');
 const ch=L.slice(0,12).map(d=>({t:d.n+' · 🪙'+d.p.toLocaleString(),c:inv.coin>=d.p?'go':'',f:()=>{if((inv.coin|0)<d.p){say('🪙 ค่าเดินทางไม่พอ (ต้องใช้ '+d.p+')');sfx('thud');return}
   inv.coin-=d.p;try{refreshInv();saveGame(true)}catch(e){}sfx('warp');cover({icon:'🧭',title:d.n.replace(/^\S+\s/,''),tip:me+' พาเดินทาง'},()=>{try{d.go()}catch(e){console.warn('guide134',e)}});setTimeout(()=>{try{say('🧭 '+me+': ถึงแล้ว เดินทางปลอดภัยนะ!')}catch(e){}},900)}}));
 ch.push(BYE);G134.on=1;try{talk(n,txt,ch,'🧭 ผู้นำทาง')}finally{G134.on=0}}
window.guide134=guide;
const G134={on:0};
{const _tk=talk;talk=function(n){if(n&&n.c2warp&&!G134.on){guide(n);return}return _tk.apply(this,arguments)};window.talk=talk}
{const _nt=npcTalk;npcTalk=function(n){if(n&&n.c2warp){guide(n);return}return _nt.apply(this,arguments)};window.npcTalk=npcTalk}
/* เมือง 2 → คุยกับเอเดน (ป้าย "กด E คุยกับ" ใช้ npcTalk) · ท่าเรือขาออกยังกลับเมือง 1 ได้ฟรีเหมือนเดิม แต่ขึ้นฝั่งข้างอาร์เทน */
{const _ex=exitD;exitD=function(){const fromC2=!!(D&&D.city2);const r=_ex.apply(this,arguments);if(fromC2)RT.c2t=Date.now();return r};window.exitD=exitD}
{const _et=enterTown;enterTown=function(){const r=_et.apply(this,arguments);try{if(RT.c2t&&Date.now()-RT.c2t<4000){RT.c2t=0;nearGuide();setTimeout(()=>{try{if(D&&D.town&&!D.shop)nearGuide()}catch(e){}},80)}}catch(e){}return r};window.enterTown=enterTown}
/* เมนูลัด "เมือง 2" เดิมวาปฟรีทันที → บอกให้ไปหาผู้นำทาง */
try{const m=PM7.find(x=>x[1]==='เมือง 2');if(m)m[2]=()=>{if(D&&D.city2){say('อยู่ในนครวารีอัสตราแล้ว — คุยกับเอเดนผู้นำทางที่ท่าเรือเพื่อเดินทาง');return}say('🧭 ไปนครวารี: คุยกับ "อาร์เทน ผู้นำทาง" ข้างน้ำพุกลางเมือง หรือเดินออกขอบขวาของเมือง');try{if(typeof GUIDE!=='undefined'&&D&&D.town)GUIDE.to=[24.5*T,20*T]}catch(e){}}}catch(e){}
}catch(e){console.warn('fix134',e)}
