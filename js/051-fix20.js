// fix20.js (v4.28) — ฉายา (Titles) + ตารางอันดับ (Leaderboard) + ผู้เล่นอื่นเห็นชุดแฟชั่น/ฉายาของเรา
// =====================================================================
// ---------- สถิติผู้เล่น ----------
const ST20=(()=>{let S={kills:0,boss:0,ore:0,tree:0,fish:0,maps:{},title:''};try{Object.assign(S,JSON.parse(localStorage.getItem('fm_stat20')||'{}')||{})}catch(e){}S.maps=S.maps||{};return S})();
let st20T=0;const st20Save=()=>{clearTimeout(st20T);st20T=setTimeout(()=>{try{localStorage.setItem('fm_stat20',JSON.stringify(ST20))}catch(e){}},800)};
const st20Add=(k,n)=>{ST20[k]=(ST20[k]|0)+(n||1);st20Save();try{ttlCheck20()}catch(e){}};
{const _mk=mobKill;mobKill=function(m){const was=m&&m.dead;const r=_mk(m);try{if(m&&!was&&!m.wb10&&!window.__IN_OTHER8){st20Add('kills');if(m.boss)st20Add('boss')}}catch(e){}return r}}
{const _h=hitOre;hitOre=function(o){const a=o&&o.alive!==false;const r=_h(o);try{if(a&&o&&o.alive===false)st20Add('ore')}catch(e){}return r}}
{const _z=zMine;zMine=function(o){const a=o&&o.alive;const r=_z(o);try{if(a&&!o.alive)st20Add('ore')}catch(e){}return r}}
{const _t=hitTree;hitTree=function(tr){const a=tr&&tr.alive!==false;const r=_t(tr);try{if(a&&tr&&tr.alive===false)st20Add('tree')}catch(e){}return r}}
{const _c=chop15;chop15=function(o){const a=o&&o.alive;const r=_c(o);try{if(a&&!o.alive)st20Add('tree')}catch(e){}return r}}
{const _f=fishCatch;fishCatch=function(){const k=FISH.fish,n0=inv[k]|0;const r=_f();try{if((inv[k]|0)>n0)st20Add('fish')}catch(e){}return r}}
{const _ez=enterZone;enterZone=function(i){const r=_ez(i);try{const z=ZONES[i];if(z&&['mist','volcano','shadow'].includes(z.id)&&!ST20.maps[z.id]){ST20.maps[z.id]=1;st20Save();ttlCheck20()}}catch(e){}return r}}
const wealth20=()=>(inv.coin|0)+((typeof BANK19!=='undefined'&&BANK19.coin)|0);
const fashN20=()=>(FASH.own||[]).length,thaiN20=()=>(FASH.own||[]).filter(k=>/^b:th_/.test(k)).length;
const isGM20=()=>{try{return !!(window.gmAllowed&&gmAllowed())||!!(typeof ON10!=='undefined'&&ON10.gm)}catch(e){return false}};
// ---------- ฉายา ----------
const TTL20=[
 ['newbie','ผู้กล้าหน้าใหม่','#c8d0dc','เริ่มต้นการผจญภัย',()=>true],
 ['lv10','นักผจญภัย','#9fd8ff','ถึง Lv.10',()=>P.lv>=10],
 ['lv30','ยอดฝีมือ','#7ae0a0','ถึง Lv.30',()=>P.lv>=30],
 ['lv50','วีรชนแห่งเอลโดเรีย','#ffd23a','ถึง Lv.50',()=>P.lv>=50],
 ['lv80','ตำนานผู้กล้า','#ff9a3a','ถึง Lv.80',()=>P.lv>=80],
 ['lv100','จอมราชันย์','#ff5a8a','ถึง Lv.100',()=>P.lv>=100],
 ['k100','นักล่ามอนสเตอร์','#c8e0a0','ล้มมอนสเตอร์ 100 ตัว',()=>ST20.kills>=100],
 ['k1000','เพชฌฆาตพันศพ','#ff7a5a','ล้มมอนสเตอร์ 1,000 ตัว',()=>ST20.kills>=1000],
 ['k5000','มัจจุราชแห่งสนามรบ','#ff3a3a','ล้มมอนสเตอร์ 5,000 ตัว',()=>ST20.kills>=5000],
 ['b10','ผู้พิชิตบอส','#ffb04a','ล้มบอส 10 ตัว',()=>ST20.boss>=10],
 ['b50','ราชันผู้ล้มยักษ์','#ff6a1a','ล้มบอส 50 ตัว',()=>ST20.boss>=50],
 ['ore200','นักขุดขยัน','#c8a878','ขุดแร่ 200 ก้อน',()=>ST20.ore>=200],
 ['ore2000','เจ้าแห่งเหมือง','#9af0ff','ขุดแร่ 2,000 ก้อน',()=>ST20.ore>=2000],
 ['tree200','คนตัดไม้มือทอง','#9ad87a','ตัดต้นไม้ 200 ต้น',()=>ST20.tree>=200],
 ['fish100','นักตกปลาผู้อดทน','#7ac8ff','ตกปลา 100 ตัว',()=>ST20.fish>=100],
 ['rich','เศรษฐี','#ffe27a','มีเงิน (กระเป๋า+ธนาคาร) 100,000',()=>wealth20()>=1e5],
 ['tycoon','มหาเศรษฐี','#ffd000','มีเงิน (กระเป๋า+ธนาคาร) 1,000,000',()=>wealth20()>=1e6],
 ['dg10','นักสำรวจดันเจี้ยน','#b89aff','ผ่านดันเจี้ยนถึงชั้น 10',()=>(DG.max|0)>=10],
 ['dg30','จ้าวแห่งเขาวงกต','#c870ff','ผ่านดันเจี้ยนถึงชั้น 30',()=>(DG.max|0)>=30],
 ['wild','ผู้เดินทางข้ามมิติ','#3affc8','ไปครบ ป่าหมอก · ภูเขาไฟ · ถ้ำเงามืด',()=>ST20.maps.mist&&ST20.maps.volcano&&ST20.maps.shadow],
 ['fash','แฟชั่นนิสต้า','#ff8ad8','มีของแฟชั่น 8 ชิ้น',()=>fashN20()>=8],
 ['thai','ผู้สืบสานวัฒนธรรมไทย','#e8c14a','มีชุดไทย 3 ชุด',()=>thaiN20()>=3],
 ['gm','👑 ผู้ดูแลเกม','#ff4a4a','เฉพาะ GM',()=>isGM20()]];
const TTLMAP20=Object.fromEntries(TTL20.map(t=>[t[0],t]));
const ttlHas20=id=>{const t=TTLMAP20[id];try{return !!(t&&t[4]())}catch(e){return false}};
const UNL20=new Set();let ttlInit20=false;
function ttlCheck20(){for(const t of TTL20){if(UNL20.has(t[0]))continue;if(ttlHas20(t[0])){UNL20.add(t[0]);if(ttlInit20&&t[0]!=='newbie'&&t[0]!=='gm'){try{banner('🏅 ได้รับฉายาใหม่!','「'+t[1]+'」 — เลือกใช้ได้ที่เมนู ฉายา');sfx('chest')}catch(e){}}}}ttlInit20=true}
setTimeout(ttlCheck20,3000);setInterval(ttlCheck20,15000);
const myTtl20=()=>{const id=ST20.title;return id&&ttlHas20(id)?id:''};
// วาดฉายาเหนือป้ายชื่อ (ของเราและผู้เล่นอื่น)
function drawTtl20(id,x,y){const t=TTLMAP20[id];if(!t)return;ctx.save();ctx.font='800 9px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';const s='「'+t[1]+'」';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(s,x,y);ctx.fillStyle=t[2];ctx.fillText(s,x,y);ctx.restore()}
{const _nt=nameTag;nameTag=function(){_nt();try{if(!P.name||P.dead)return;const id=window.__IN_OTHER8?window.__OTTL20:myTtl20();if(id)drawTtl20(id,Math.round(P.x),Math.round(P.y-84))}catch(e){}}}
// เมนูเลือกฉายา
const ttW20=mk6('ttl20');
function openTtl20(){ttlCheck20();p6open(ttW20);ttRender20()}window.openTtl20=openTtl20;
function ttRender20(){const cur=myTtl20();let h='<div class="w"><div class="hd"><b>🏅 ฉายา · ปลดล็อก '+TTL20.filter(t=>ttlHas20(t[0])).length+'/'+TTL20.length+'</b><button onclick="p6close(ttW20)">✕</button></div><div class="bd tt20">';
 h+='<div class="it"><b>📊 สถิติของคุณ</b><small>ล้มมอน '+ST20.kills.toLocaleString()+' · ล้มบอส '+ST20.boss+' · ขุดแร่ '+ST20.ore.toLocaleString()+' · ตัดไม้ '+ST20.tree.toLocaleString()+' · ตกปลา '+ST20.fish+' · ดันเจี้ยนชั้น '+(DG.max|0)+' · ทรัพย์สิน '+wealth20().toLocaleString()+'</small><button class="bt" onclick="p6close(ttW20);openLb20()">🏆 ดูตารางอันดับ</button></div>';
 for(const [id,n,c,d] of TTL20){if(id==='gm'&&!ttlHas20('gm'))continue;const ok=ttlHas20(id),on=cur===id;
  h+='<div class="it'+(on?' wear':'')+'" style="'+(ok?'':'opacity:.55')+'"><b style="color:'+c+'">「'+n+'」</b><small>'+(ok?'✅ ':'🔒 ')+d+'</small>'+(ok?'<button class="bt '+(on?'':'g')+'" onclick="ttSet20(\''+(on?'':id)+'\')">'+(on?'ถอดฉายา':'ใช้ฉายานี้')+'</button>':'')+'</div>'}
 ttW20.innerHTML=h+'</div></div>'}
window.ttSet20=id=>{ST20.title=id||'';st20Save();sfx('ui');try{localStorage.setItem('fm_stat20',JSON.stringify(ST20))}catch(e){}ttRender20()};
{const st=document.createElement('style');st.textContent='#ttl20 .tt20{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px;padding:8px;overflow-y:auto}#ttl20 .tt20 .it:first-child{grid-column:1/-1}#lb20 .lb20{padding:8px;overflow-y:auto}#lb20 .lbt{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px}#lb20 .lbt button{padding:5px 10px;border-radius:8px;border:1px solid #5a4a7a;background:#2a2238;color:#fff;font:700 12px system-ui;cursor:pointer}#lb20 .lbt button.on{background:#ffe9a0;color:#3a2408}#lb20 .lbr{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.25);margin-bottom:4px;font:700 13px system-ui}#lb20 .lbr.me{outline:2px solid #7aff9a}#lb20 .lbr i{font-style:normal;width:30px;text-align:center;font-weight:900}#lb20 .lbr b{flex:1}#lb20 .lbr small{opacity:.75}#lb20 .lbr em{font-style:normal;color:#ffe27a;font-weight:900}';document.head.appendChild(st)}
// ---------- ตารางอันดับ ----------
const lbW20=mk6('lb20');const LB20={tab:'lv',data:null,err:'',syncErr:false,t:0,busy:false,again:false};
const LBT20=[['lv','⭐ เลเวล','Lv.'],['k','⚔️ ล่ามอน','ตัว'],['b','👑 ล้มบอส','ตัว'],['w','💰 ร่ำรวย','เหรียญ'],['fl','🏰 ดันเจี้ยน','ชั้น']];
async function syncLb20(force){const until=Date.now()+45000;while(CLOUD.inflight&&Date.now()<until)await new Promise(r=>setTimeout(r,100));if(CLOUD.inflight)throw 'sync';const t=CLOUD.t||0;await CLOUD.sync(force);while(CLOUD.inflight&&Date.now()<until)await new Promise(r=>setTimeout(r,100));if(CLOUD.inflight||(force&&(!(CLOUD.t>t)||CLOUD.fails)))throw 'sync'}
async function loadLb20(sync,fetchTop,limit=8000){let syncErr=false,tm;try{await Promise.race([Promise.resolve().then(sync).catch(()=>{syncErr=true}),new Promise(r=>tm=setTimeout(()=>{syncErr=true;r()},limit))])}finally{clearTimeout(tm)}const top=await fetchTop();return{top,syncErr}}
async function openLb20(force,pushSave){p6open(lbW20);lbRender20();if(LB20.busy){if(pushSave)LB20.again=true;return}if(!force&&LB20.data&&performance.now()-LB20.t<30000)return;LB20.err='';LB20.busy=true;
 try{if(!(window.CLOUD&&CLOUD.base()))throw 'off';const q=await loadLb20(()=>syncLb20(pushSave!==false),()=>CLOUD.call('/api/top',{}));LB20.syncErr=q.syncErr;const r=q.top;if(r&&r.ok){LB20.data=r;LB20.t=performance.now()}else LB20.err=r&&r.err==='unknown'?'old':r&&r.err==='rate'?'rate':'fail'}catch(e){LB20.err=e==='off'?'off':'fail'}finally{LB20.busy=false;lbRender20();if(LB20.again){LB20.again=false;openLb20(true,true)}}}
window.openLb20=openLb20;
window.lbRefresh20=()=>openLb20(true,true);
setInterval(()=>{if(!lbW20.hidden)openLb20(true,false)},30000);
window.lbTab20=t=>{LB20.tab=t;lbRender20()};
// Online exit must wait for the cloud write; the base game's 250 ms reload can abort it.
window.exitGame7=function(){talk({name:'ออกจากเกม',c:'#c0503a'},'บันทึกเกมแล้วกลับไปหน้าแรกไหม?',[{t:'🚪 บันทึกและออก',c:'go',f:()=>{
 try{saveGame(true)}catch(e){}
 if(!(typeof FM_ACCT!=='undefined'&&FM_ACCT&&window.CLOUD&&CLOUD.base()&&CLOUD.tok(FM_ACCT))){setTimeout(()=>location.reload(),250);return}
 if(!(window.ONL32&&ONL32.verified)){say('☁️ ยังยืนยันการเชื่อมต่อคลาวด์ไม่ได้ · กรุณาลองใหม่ก่อนออก');return false}
 say('☁️ กำลังบันทึกเซฟขึ้นคลาวด์…');
 (async()=>{const end=Date.now()+45000;try{
   while(CLOUD.inflight&&Date.now()<end)await new Promise(r=>setTimeout(r,100));
   if(CLOUD.inflight)throw Error('timeout');
   const prev=CLOUD.t||0;await CLOUD.sync(true);
   while(CLOUD.inflight&&Date.now()<end)await new Promise(r=>setTimeout(r,100));
   if(CLOUD.inflight||!(CLOUD.t>prev)||CLOUD.fails)throw Error('save');
   dlgClose(true);location.reload()
  }catch(e){say('⚠️ เซฟขึ้นคลาวด์ไม่สำเร็จ · ยังไม่ออกจากเกม กรุณากดบันทึกและออกอีกครั้ง')}})();
 return false
}},BYE],'🚪 ออกเกม')};
function lbRender20(){let h='<div class="w"><div class="hd"><b>🏆 ตารางอันดับผู้กล้า</b><button onclick="p6close(lbW20)">✕</button></div><div class="bd lb20"><div class="lbt">'+LBT20.map(([k,n])=>'<button class="'+(LB20.tab===k?'on':'')+'" onclick="lbTab20(\''+k+'\')">'+n+'</button>').join('')+'</div>';
 if(LB20.err==='off')h+='<small>ต้องเล่นแบบออนไลน์ (ล็อกอินบัญชี) จึงจะดูอันดับได้</small>';
 else if(LB20.err==='old')h+='<small>เซิร์ฟเวอร์ยังเป็นเวอร์ชันเก่า — ผู้ดูแลต้องกด Manual Deploy บน Render ก่อน</small>';
 else if(LB20.err)h+='<small>โหลดอันดับไม่สำเร็จ ลองใหม่อีกครั้ง</small>';
 else if(!LB20.data)h+='<small>กำลังโหลด…</small>';
 else{const L=LB20.data[LB20.tab]||[],u=(LBT20.find(x=>x[0]===LB20.tab)||[])[2],me=String(P.name||'');
  if(!L.length)h+='<small>ยังไม่มีข้อมูล</small>';
  L.forEach((x,i)=>{const t=TTLMAP20[x.t];h+='<div class="lbr'+(x.n===me?' me':'')+'"><i>'+(i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1)+'</i><b>'+String(x.n).replace(/[<>&]/g,'')+(t?' <small style="color:'+t[2]+'">「'+t[1]+'」</small>':'')+'</b><small>Lv.'+x.lv+'</small><em>'+(LB20.tab==='lv'?'':Number(x.v).toLocaleString()+' '+u)+'</em></div>'});
  h+='<small style="opacity:.7">ผู้เล่นทั้งหมด '+(LB20.data.n|0)+' คน · อัปเดตเมื่อบันทึกเกมขึ้นคลาวด์</small>'}
 lbW20.innerHTML=h+'</div></div>'}
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['🏅','ฉายา',()=>openTtl20()],['🏆','อันดับ',()=>openLb20()])}catch(e){}
// ส่งสถิติไปเซิร์ฟเวอร์ตอนบันทึกคลาวด์
{const _c=CLOUD.call;CLOUD.call=function(p,body,to){try{if(p==='/api/save'&&body){body.stat=Object.assign({},body.stat||{},{floor:Math.max(DG.max|0,(body.stat&&body.stat.floor)|0),kills:ST20.kills|0,boss:ST20.boss|0,mine:ST20.ore|0,w:wealth20(),t:myTtl20()})}}catch(e){}return _c.call(this,p,body,to)}}
// ---------- ออนไลน์: ส่งฉายาให้ผู้เล่นอื่นเห็น (ชุดแฟชั่นส่งผ่าน fx ของ fix9 อยู่แล้ว) ----------
{const _send=WebSocket.prototype.send;WebSocket.prototype.send=function(s){try{if(this===NET.ws&&typeof s==='string'&&s.startsWith('{"t":"st"')){const o=JSON.parse(s);o.ttl=myTtl20();s=JSON.stringify(o)}}catch(e){}return _send.call(this,s)}}
{const _nm=netMsg;netMsg=function(d){const r=_nm(d);try{if(d.t==='snap')for(const s of d.ps){const o=NET.others.get(s.id);if(o){o.ttl=s.ttl||''}}}catch(e){}return r}}
{const _do=drawOther;drawOther=function(o){window.__OTTL20=TTLMAP20[o.ttl]?o.ttl:'';try{return _do(o)}finally{window.__OTTL20=''}}}

// =====================================================================
