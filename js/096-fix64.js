// fix64 (v4.60) — ระบบเกมให้เล่นนาน/ไม่ฟาร์มซ้ำ:
//   (1) XP ทั้งเกม ×0.65 · ของหายาก (หินตีบวก/หินพร/อัญมณี/เกล็ด/แกน) ดรอปลดเหลือ 70%
//   (2) ดันเจี้ยน: ชั้นที่เคยผ่านแล้ว (ต่ำกว่าชั้นสูงสุด) บอสไม่ให้กุญแจ กล่องได้แค่ของเล็กน้อย → กันวนลงชั้นเก่าฟาร์ม
//   (3) หอคอย: ชั้นที่เคลียร์แล้วเข้าซ้ำไม่ได้ (ไม่มีปุ่มสู้ซ้ำ) · (4) บอสตำนานชนะแล้วรอ 30 นาที (เก็บถาวร ข้ามการออก-เข้าเกม)
//   (5) เมนูหลัก: เอาวาปหอคอย/บอสโลก/บอสตำนานออก — หอคอยเดินเข้าประตูในเมือง · บอสโลกเดินไปประตูลานบอสโลกในทุ่งหญ้า · แท่นบอสตำนานอยู่ที่ประตูหอคอย
try{
// ---------- 1) XP / ดรอป ----------
const XPM64=.65;window.XPM64=XPM64;
{const _g=gainXp;gainXp=function(n){if(typeof n==='number'&&n>0&&!window.__noXpm64)n=Math.max(1,Math.round(n*XPM64));return _g.call(this,n)};window.gainXp=gainXp}
const RARE64=new Set(['estone','bless','gem','scale','core','phoenix']);
{const _ad=addDrop;addDrop=function(type,x,y){if(RARE64.has(type)&&Math.random()>.7)return;return _ad.apply(this,arguments)};window.addDrop=addDrop}
// ---------- 2) ดันเจี้ยนชั้นเก่า ----------
{const _mk=mobKill;mobKill=function(m){if(m&&m.boss&&D&&D.dg&&!m.lb62){D.rep64=D.dg<(DG.max|0)}return _mk.apply(this,arguments)};window.mobKill=mobKill}
{const _ad=addDrop;addDrop=function(type,x,y){if(type==='dgkey'&&D&&D.dg&&D.rep64){return}return _ad.apply(this,arguments)};window.addDrop=addDrop}
{const _dr=dgReward;dgReward=function(f){const R=_dr.apply(this,arguments);try{if(D&&D.rep64){const c=R.filter(k=>k==='coin').slice(0,3);setTimeout(()=>{try{say('📦 ชั้นนี้เคยผ่านแล้ว — กล่องให้แค่ของเล็กน้อย (ลงชั้นใหม่เพื่อรับของดี)')}catch(e){}},300);return c.length?c:['coin']}}catch(e){}return R};window.dgReward=dgReward}
// ---------- 3) หอคอย: ไม่ให้เข้าชั้นที่เคลียร์แล้ว ----------
{const _et=enterTower10;enterTower10=function(f){f=f|0;try{if(f>0&&f<=(TW10.data.max|0)){say('🗼 ชั้น '+f+' เคลียร์ไปแล้ว — ท้าชั้นถัดไปได้เลย');sfx('thud');return}}catch(e){}return _et.apply(this,arguments)};window.enterTower10=enterTower10}
{const _ot=openTower10;openTower10=function(){const r=_ot.apply(this,arguments);try{if(DLG.open)DLG.ch=DLG.ch.filter(c=>!/เลือกชั้นที่ผ่านแล้ว|สู้ชั้นนี้อีกครั้ง/.test(c.t||''))}catch(e){}return r};window.openTower10=openTower10}
{const _tk=talk;talk=function(n,txt,ch,name){try{if(Array.isArray(ch)&&ch.some(c=>/สู้ชั้นนี้อีกครั้ง/.test(c&&c.t||'')))ch=ch.filter(c=>!/สู้ชั้นนี้อีกครั้ง/.test(c&&c.t||''))}catch(e){}return _tk.call(this,n,txt,ch,name)};window.talk=talk}
// ---------- 4) บอสตำนาน: รอ 30 นาทีหลังชนะ ----------
const LBCD64={get(){try{return JSON.parse(localStorage.getItem('fm_lbcd64')||'{}')}catch(e){return{}}},set(o){try{localStorage.setItem('fm_lbcd64',JSON.stringify(o))}catch(e){}},ms:30*60e3};
{const _en=enter62;enter62=function(i){const t=LBCD64.get()[i],rem=t?t+LBCD64.ms-srvNow():0;if(rem>0){say('🕒 '+LB62[i].n+' เพิ่งถูกผนึก — กลับมาได้ในอีก '+Math.ceil(rem/60000)+' นาที');sfx('thud');return}return _en.apply(this,arguments)};window.enter62=enter62}
{const _mk=mobKill;mobKill=function(m){const w=m&&m.lb62&&D&&D.lb62!=null&&!D.won,i=D&&D.lb62;const r=_mk.apply(this,arguments);try{if(w&&D.won===1){const o=LBCD64.get();o[i]=srvNow();LBCD64.set(o)}}catch(e){}return r};window.mobKill=mobKill}
{const _oa=openAltar62;openAltar62=function(){const r=_oa.apply(this,arguments);try{const o=LBCD64.get();if(DLG.open)for(const c of DLG.ch){const m=/^(\S+) (.+?) \(Lv/.exec(c.t||'');if(!m)continue;const i=LB62.findIndex(B=>B.n===m[2]);const rem=i>=0&&o[i]?o[i]+LBCD64.ms-srvNow():0;if(rem>0){c.t+=' 🕒'+Math.ceil(rem/60000)+'น.';c.c=''}}if(DLG.open)dlgShowChoices()}catch(e){}return r};window.openAltar62=openAltar62}
// ---------- 5) เมนูหลัก: เอาวาปออก ----------
try{for(const nm of ['หอคอย','บอสโลก','บอสตำนาน']){const i=PM7.findIndex(m=>m[1]===nm);if(i>=0)PM7.splice(i,1)}pmRender7()}catch(e){}
// บอสโลก: ไม่มีปุ่มวาป — เดินไปประตูลานบอสโลกในทุ่งหญ้า (ข้างประตูมิติ)
const WBG64=(()=>{try{let best=null,bd=1e9;for(let ty=ZG.ty-9;ty<=ZG.ty-4;ty++)for(let tx=ZG.tx-3;tx<=ZG.tx+3;tx++){const t=map[ty]&&map[ty][tx];if(t===GRASS||t===SAND){const d=Math.abs(tx-ZG.tx)+Math.abs(ty-(ZG.ty-6));if(d<bd){bd=d;best={tx,ty}}}}if(!best)best={tx:ZG.tx,ty:ZG.ty-6};return{x:best.tx*T+16,y:best.ty*T+16}}catch(e){return{x:ZG.x,y:ZG.y-180}}})();window.WBG64=WBG64;
{const _ow=openWb10;openWb10=function(){const r=_ow.apply(this,arguments);try{if(DLG.open&&!inWb10()){DLG.ch=DLG.ch.filter(c=>!/ไปลานบอสโลก/.test(c.t||''));DLG.txt+='\n🚶 ทางเข้า: ประตูลานบอสโลก 🔥 ในทุ่งหญ้า (เหนือประตูมิติ) — เดินไปแล้วกดโต้ตอบ';dlgShowChoices&&0}}catch(e){}return r};window.openWb10=openWb10}
try{wbHud10.onclick=()=>{try{say('🐉 ลานบอสโลกอยู่ในทุ่งหญ้า เหนือประตูมิติ — เดินไปที่ประตูไฟแล้วกดโต้ตอบ')}catch(e){}}}catch(e){}
{const _it=interact;interact=function(){try{if(!D&&Math.hypot(P.x-WBG64.x,P.y-WBG64.y)<48){if(WB10.on)enterWb10();else openWb10();return true}}catch(e){}return _it.apply(this,arguments)};window.interact=interact}
{const _h=hero;hero=function(){try{if(!D&&Math.abs(P.x-WBG64.x)<900&&Math.abs(P.y-WBG64.y)<700){const x=WBG64.x,y=WBG64.y,t=performance.now()/1000,on=WB10&&WB10.on;ctx.save();
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+6,26,8,0,0,7);ctx.fill();ctx.fillStyle='#3a1a10';ctx.fillRect(x-24,y-50,8,56);ctx.fillRect(x+16,y-50,8,56);ctx.fillRect(x-26,y-56,52,9);
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-22,2,x,y-22,26);g.addColorStop(0,on?'rgba(255,220,120,.95)':'rgba(255,140,60,.45)');g.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y-22,16,26+Math.sin(t*4)*2,0,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';
  ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#2a0a04';const s='🐉 ลานบอสโลก'+(on?' (เปิดแล้ว!)':'');ctx.strokeText(s,x,y-62);ctx.fillStyle=on?'#ffe08a':'#ffb07a';ctx.fillText(s,x,y-62);
  if(Math.hypot(P.x-x,P.y-y)<48){ctx.strokeText('กดโต้ตอบเพื่อเข้า',x,y+22);ctx.fillStyle='#fff';ctx.fillText('กดโต้ตอบเพื่อเข้า',x,y+22)}ctx.restore()}}catch(e){}return _h()};window.hero=hero}
}catch(e){console.warn('fix64',e)}
