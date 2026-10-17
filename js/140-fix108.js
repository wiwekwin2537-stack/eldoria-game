// fix108 (v4.93) — 📅 เช็กอินรายวัน + เควสรายวัน (เจ้าของขอ 2026-10-14 20:32)
//  เช็กอิน: รับของวันละครั้ง (นับวันตามเวลาไทย) วนรอบ 7 วัน · วันที่ 7 ของใหญ่ · เข้าเกมวันใหม่แล้วหน้าต่างเด้งเอง
//  เควสรายวัน: วันละ 4 เควส สุ่มตามเลเวล (ล้มมอน/ล้มบอส/ตัดไม้/ขุดแร่/ตกปลา/ตีบวก/บอสดันเจี้ยนนครวารี) · ทำครบ 4 ได้หีบโบนัส
//  นับความคืบหน้าจากสถิติกลาง ST20 (kills boss tree ore fish — ระบบเดียวกับฉายา) + STORY.c2b (บอสดันเจี้ยนเมือง 2) + ห่อ enhItem (ตีบวก)
//  เก็บใน localStorage 'fm_daily108' (ขึ้นคลาวด์พร้อมเซฟอื่นอัตโนมัติ) · เมนู 📅 รายวัน
try{
const day108=()=>new Date(srvNow()+7*3600e3).toISOString().slice(0,10);
const DY={day:'',ci:0,ciDay:'',q:[],bonus:0,shown:''};try{Object.assign(DY,JSON.parse(localStorage.getItem('fm_daily108')||'{}')||{})}catch(e){}
const sv108=()=>{try{localStorage.setItem('fm_daily108',JSON.stringify(DY))}catch(e){}};
// ---------- รางวัล ----------
const CI108=[ // วันที่ 1–7 (lv = เลเวลผู้เล่น)
 lv=>[['coin',300+lv*15]],
 lv=>[['hpp',8],['mpp',8]],
 lv=>[['estone',3]],
 lv=>[['coin',600+lv*30],['scroll',3]],
 lv=>[['whet',2],['estone',2]],
 lv=>[['bless',1],['coin',400+lv*20]],
 lv=>[['estone',6],['bless',2],['dgkey',1],['coin',1000+lv*40]]];
const nm108=k=>k==='coin'?'เหรียญ':MN(k);
const ic108=k=>{try{return k==='coin'?'':iconURL('mat:'+k)}catch(e){return ''}};
const fmt108=n=>Number(n).toLocaleString('en-US');
const rwTxt108=L=>L.map(([k,n])=>(k==='coin'?'🪙 '+fmt108(n):nm108(k)+' ×'+n)).join(' · ');
const give108=L=>{for(const [k,n] of L){if(k==='xp'){try{gainXp(n)}catch(e){}continue}inv[k]=(inv[k]|0)+n}try{refreshInv()}catch(e){}try{saveGame(false)}catch(e){}};
// ---------- เควสรายวัน ----------
const QP108=[
 {t:'kills',d:'ล้มมอนสเตอร์',n:lv=>30+Math.min(40,lv>>2),u:'ตัว'},
 {t:'boss',d:'ล้มบอส',n:()=>1,u:'ตัว',min:10},
 {t:'tree',d:'ตัดต้นไม้',n:()=>12,u:'ต้น',max:160},
 {t:'ore',d:'ขุดแร่',n:()=>15,u:'ก้อน',max:160},
 {t:'fish',d:'ตกปลา',n:()=>5,u:'ตัว'},
 {t:'enh',d:'ตีบวกอุปกรณ์',n:()=>3,u:'ครั้ง',min:5},
 {t:'c2b',d:'ล้มบอสดันเจี้ยนนครวารี',n:()=>1,u:'ตัว',min:150}];
const snap108=()=>{const s={kills:ST20.kills|0,boss:ST20.boss|0,tree:ST20.tree|0,ore:ST20.ore|0,fish:ST20.fish|0,c2b:0};try{const B=STORY.c2b||{};for(const k in B)s.c2b+=B[k]|0}catch(e){}return s};
let base108=snap108();
function roll108(){const lv=P.lv|0,C=QP108.filter(q=>lv>=(q.min||0)&&lv<=(q.max||999));const L=[];const pool=C.slice();
 while(L.length<4&&pool.length){const q=pool.splice(Math.random()*pool.length|0,1)[0];const n=q.n(lv);L.push({t:q.t,d:q.d+' '+n+' '+q.u,n,c:0,ok:0,coin:Math.round(150+lv*12),xp:Math.round(need(lv)*.08),es:q.t==='boss'||q.t==='c2b'?2:1})}
 DY.q=L;DY.bonus=0}
function chkDay108(){if(!SRV.ok)return;const d=day108();if(DY.day!==d){DY.day=d;roll108();sv108();base108=snap108()}}
function prog108(t,n){if(!n)return;let ch=0;for(const q of DY.q){if(q.t!==t||q.ok||q.c>=q.n)continue;q.c=Math.min(q.n,q.c+n);ch=1;if(q.c>=q.n){try{say('📅 เควสรายวันสำเร็จ: '+q.d+' — เปิดเมนู 📅 รายวัน เพื่อรับรางวัล');sfx('bell')}catch(e){}}}if(ch){sv108();if(!W108.hidden)render108()}}
setInterval(()=>{try{if(typeof P==='undefined'||!P||!titleEl.hidden)return;chkDay108();const s=snap108();for(const k in s){const d=s[k]-(base108[k]|0);if(d>0&&d<500)prog108(k,d)}base108=s}catch(e){}},1000);
{const _e=enhItem;enhItem=function(id){const l0=(ENH&&ENH[id])||0,c0=inv.coin;const r=_e.apply(this,arguments);try{if(((ENH&&ENH[id])||0)!==l0||inv.coin!==c0)prog108('enh',1)}catch(e){}return r};window.enhItem=enhItem}
// fix123: ตีบวกจริงอยู่ที่ enhStart7 (enhItem แค่เปิดหน้าต่าง) → เควสรายวัน "ตีบวก" ไม่เคยขยับ
{const _s=enhStart7;enhStart7=function(){const b0=!!ENHS.busy,c0=inv.coin;const r=_s.apply(this,arguments);try{if(!b0&&ENHS.busy&&inv.coin!==c0)prog108('enh',1)}catch(e){}return r};window.enhStart7=enhStart7}
// ---------- หน้าต่าง ----------
const W108=mk6('dy108');
const css108=document.createElement('style');css108.textContent=
 '#dy108 .w{width:min(560px,96%);height:auto;max-height:95%}#dy108 .bd{display:block!important;overflow:auto;padding:10px 12px}'
+'#dy108 .tb108{display:flex;gap:6px;margin-bottom:8px}#dy108 .tb108 button{flex:1;padding:9px;border-radius:10px;border:1px solid #e8c14a55;background:#2a2140;color:#ddd;font-weight:800}#dy108 .tb108 button.on{background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}'
+'#dy108 .cal108{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}#dy108 .dd108{border:1px solid #e8c14a44;border-radius:10px;background:#1a1426;padding:6px 3px;text-align:center;font-size:11px;min-height:86px;display:flex;flex-direction:column;align-items:center;gap:3px}'
+'#dy108 .dd108 b{color:#ffd86a}#dy108 .dd108 img{width:26px;height:26px;image-rendering:pixelated}#dy108 .dd108.got{opacity:.45}#dy108 .dd108.now{border-color:#ffd86a;box-shadow:0 0 10px #ffd86a88;background:#2a2140}#dy108 .dd108.big{background:linear-gradient(180deg,#3a2a10,#1a1426)}'
+'#dy108 .go108{display:block;width:100%;margin-top:10px;padding:12px;border-radius:12px;border:0;font-weight:900;font-size:15px;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}#dy108 .go108:disabled{background:#3a3450;color:#999}'
+'#dy108 .q108{border:1px solid #e8c14a33;border-radius:10px;background:#1a1426;padding:8px 10px;margin-bottom:6px}#dy108 .q108 .pb108{height:8px;border-radius:5px;background:#0a0814;overflow:hidden;margin:5px 0}#dy108 .q108 .pf108{height:100%;background:linear-gradient(90deg,#7ed957,#c8ff8a)}'
+'#dy108 .q108 small{color:#bbb}#dy108 .q108 .rw108{display:flex;justify-content:space-between;align-items:center;gap:8px}#dy108 .q108 button{padding:7px 14px;border-radius:9px;border:0;font-weight:800;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}#dy108 .q108.done{opacity:.55}'
+'#dy108 .hint108{font-size:11px;color:#aaa;margin:4px 0 8px}';
document.head.appendChild(css108);
let tab108='ci';
function render108(){chkDay108();const lv=P.lv|0,today=day108(),can=DY.ciDay!==today,cur=DY.ci%7;let h='<div class="w"><div class="hd"><b>📅 รายวัน</b><button onclick="p6close(gid(\'dy108\'))">✕</button></div><div class="bd">';
 h+='<div class="tb108"><button class="'+(tab108==='ci'?'on':'')+'" onclick="tab108x(\'ci\')">🎁 เช็กอินรายวัน</button><button class="'+(tab108==='q'?'on':'')+'" onclick="tab108x(\'q\')">📜 เควสรายวัน</button></div>';
 if(tab108==='ci'){h+='<div class="hint108">เข้าเกมวันละครั้งกดรับของ · วนรอบ 7 วัน (วันที่ 7 ของใหญ่) · ขาดวันไม่รีเซ็ต</div><div class="cal108">';
  for(let i=0;i<7;i++){const L=CI108[i](lv),got=i<cur||(i===cur&&!can),k=L[0][0];h+='<div class="dd108'+(got?' got':'')+(i===cur&&can?' now':'')+(i===6?' big':'')+'"><b>วันที่ '+(i+1)+'</b>'+(ic108(k)?'<img src="'+ic108(k)+'">':'<span style="font-size:22px">🪙</span>')+'<span>'+rwTxt108(L)+'</span>'+(got?'✅':'')+'</div>'}
  h+='</div><button class="go108" onclick="claim108()" '+(can?'':'disabled')+'>'+(can?'🎁 รับของวันที่ '+(cur+1):'✅ รับของวันนี้แล้ว — พรุ่งนี้มาใหม่นะ')+'</button>'}
 else{h+='<div class="hint108">เควสใหม่ทุกวัน (เที่ยงคืนเวลาไทย) · ทำครบทั้ง 4 เควส รับหีบโบนัสเพิ่ม</div>';
  DY.q.forEach((q,i)=>{const pc=Math.round(q.c/q.n*100),ok=q.c>=q.n;h+='<div class="q108'+(q.ok?' done':'')+'"><div class="rw108"><b>'+(q.ok?'✅ ':ok?'🎉 ':'⏳ ')+q.d+'</b><span>'+q.c+'/'+q.n+'</span></div><div class="pb108"><div class="pf108" style="width:'+pc+'%"></div></div><div class="rw108"><small>รางวัล: 🪙 '+fmt108(q.coin)+' · XP '+fmt108(q.xp)+' · หินเสริมพลัง ×'+q.es+'</small>'+(q.ok?'<small>รับแล้ว</small>':ok?'<button onclick="qc108('+i+')">รับ</button>':'')+'</div></div>'});
  const all=DY.q.length&&DY.q.every(q=>q.ok);h+='<div class="q108'+(DY.bonus?' done':'')+'"><div class="rw108"><b>🎁 หีบโบนัสทำครบทุกเควส</b><span>'+DY.q.filter(q=>q.ok).length+'/'+DY.q.length+'</span></div><div class="rw108"><small>รางวัล: '+rwTxt108(bonusL108())+'</small>'+(DY.bonus?'<small>รับแล้ว</small>':all?'<button onclick="qb108()">รับ</button>':'')+'</div></div>'}
 h+='</div></div>';W108.innerHTML=h}
const bonusL108=()=>[['coin',800+(P.lv|0)*30],['estone',3],['bless',1]];
window.tab108x=t=>{tab108=t;sfx('ui');render108()};
window.claim108=()=>{if(!SRV.ok){say('⏳ กำลังเทียบเวลากับเซิร์ฟเวอร์ ลองใหม่อีกครั้ง');sfx('thud');return}chkDay108();const today=day108();if(DY.ciDay===today)return;const cur=DY.ci%7,L=CI108[cur](P.lv|0);DY.ciDay=today;DY.ci++;sv108();give108(L);try{sfx('chest');flash('#ffe9a0',.25)}catch(e){}try{banner('🎁 เช็กอินวันที่ '+(cur+1),rwTxt108(L),'green')}catch(e){say('🎁 ได้รับ '+rwTxt108(L))}render108()};
window.qc108=i=>{const q=DY.q[i];if(!q||q.ok||q.c<q.n)return;q.ok=1;sv108();give108([['coin',q.coin],['estone',q.es]]);try{gainXp(q.xp)}catch(e){}try{sfx('chest')}catch(e){}say('📅 รับรางวัลเควสรายวัน: 🪙 '+fmt108(q.coin)+' · XP '+fmt108(q.xp)+' · หินเสริมพลัง ×'+q.es);render108()};
window.qb108=()=>{if(DY.bonus||!DY.q.every(q=>q.ok))return;DY.bonus=1;sv108();const L=bonusL108();give108(L);try{sfx('chest');flash('#ffe9a0',.3)}catch(e){}try{banner('🎁 หีบโบนัสรายวัน',rwTxt108(L),'green')}catch(e){}render108()};
const open108=t=>{if(t)tab108=t;render108();p6open(W108)};window.open108=open108;
// เมนู
try{if(!PM7.some(m=>m[1]==='รายวัน')){const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length:at,0,['📅','รายวัน',()=>open108()]);pmRender7()}}catch(e){}
// เด้งเองเมื่อเข้าเกมวันใหม่ (ยังไม่รับเช็กอิน)
setInterval(()=>{try{const today=day108();if(DY.ciDay===today||DY.shown===today)return;if(/devtest/.test(location.search)&&!window.__popup108)return;if(!(D&&(D.town||D.city2)))return;if(!titleEl.hidden||(typeof intro!=='undefined'&&!intro.hidden)||PAUSED||document.getElementById('boot106')||(typeof DLG!=='undefined'&&DLG.open)||(typeof cineEl!=='undefined'&&!cineEl.hidden))return;if(!(P.lv>0)||P.dead)return;if(typeof STORY!=='undefined'&&(STORY.ch|0)<1)return;/* fix123: ผู้เล่นใหม่ยังไม่ได้คุยกับพระราชา — ไม่เด้งทับคำแนะนำการเล่น */DY.shown=today;sv108();open108('ci')}catch(e){}},2500);
window.DY108=DY;
}catch(e){console.warn('fix108',e)}
