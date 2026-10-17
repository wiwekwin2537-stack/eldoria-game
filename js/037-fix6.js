// fix6.js — ชุดแก้ #6 (v4.15)  101 ห้ามใช้ยาในสนามประลอง · 98 แตะผู้เล่น→เมนู · 95 สาเหตุการตาย · 93 ออโต้ฟาร์ม
// =====================================================================
// ---------- 101: สนามประลอง PvP ห้ามใช้ยา ----------
{const _ui=useItem;useItem=function(k){if(typeof inArena8==='function'&&inArena8()&&(k==='hpp'||k==='mpp')){say('🚫 สนามประลองห้ามใช้ยา');sfx('thud');return}return _ui(k)}}
// ---------- 95: สาเหตุการตาย ----------
window.LAST9={n:'',t:0};
{const _z=zHurt;zHurt=function(src,dmg,kbm,msg){if(src&&!(P.iframe>0)&&P.hp>0){LAST9.n=src.pvp7?('ผู้เล่น '+(src.nm||'?')):((src.boss?'บอส ':src.elite?'อีลิท ':'')+(src.nm||src.name||'มอนสเตอร์'));LAST9.t=performance.now()}return _z(src,dmg,kbm,msg)}}
{const _hp=hurtPlayer;hurtPlayer=function(sl){if(P.hp>0){LAST9.n='สไลม์';LAST9.t=performance.now()}return _hp(sl)}}
window.deathCause9=function(){if((P.hu|0)<=0&&performance.now()-LAST9.t>2500)return '🍖 อดอาหารตาย — ความหิวหมด';if(LAST9.n&&performance.now()-LAST9.t<30000)return '⚔️ ถูก '+LAST9.n+' สังหาร';return '❔ ไม่ทราบสาเหตุ (โรค/สถานะต่อเนื่อง)'};
{const _sd=startDeath;startDeath=function(){if(P.dead)return;const c=deathCause9();_sd();window.DCAUSE9=c;try{sysSay('💀 '+c)}catch(e){}}}
{const _sh=showDeath;showDeath=function(){_sh();try{const h=deathEl.querySelector('small');if(h)h.insertAdjacentHTML('afterend','<div style="margin:6px 0;color:#ffb0b8;font-size:13px">'+(window.DCAUSE9||'')+'</div>')}catch(e){}}}
// ---------- 98: แตะผู้เล่นคนอื่น → เมนู ----------
const FR9={list:[]};try{FR9.list=JSON.parse(localStorage.getItem('fm_friends9')||'[]')}catch(e){}
const pm9=document.createElement('div');pm9.id='pm9';pm9.hidden=true;pm9.style.cssText='position:absolute;z-index:60;min-width:170px;background:#1A1A24;border:1.5px solid #D4AF37;border-radius:10px;padding:8px;color:#f2e9c9;font:13px system-ui,"Noto Sans Thai",sans-serif;box-shadow:0 6px 20px #000a';gid('wrap').appendChild(pm9);
window.PM9CLOSE=()=>{pm9.hidden=true};
window.PM9=(act,id)=>{const o=NET.others.get(id);const nm=o&&o.name||String(id);
  if(act==='w'){PM9CLOSE();try{const ti=gid('chatTi');ti.value='/w '+nm+' ';ti.focus();say('💬 พิมพ์ข้อความแล้วกดส่งเพื่อกระซิบถึง '+nm)}catch(e){}}
  else if(act==='f'){if(FR9.list.includes(nm)){FR9.list=FR9.list.filter(x=>x!==nm);say('ลบ '+nm+' ออกจากเพื่อนแล้ว')}else{FR9.list.push(nm);say('🤝 เพิ่ม '+nm+' เป็นเพื่อนแล้ว')}try{localStorage.setItem('fm_friends9',JSON.stringify(FR9.list))}catch(e){}PM9CLOSE()}
  else if(act==='m'){try{CHAT8.mute.add(String(id));say('🔇 ปิดเสียงแชทของ '+nm)}catch(e){}PM9CLOSE()}};
cv.addEventListener('pointerup',e=>{try{if(!NET.on||!NET.others.size||!titleEl.hidden)return;if(e.target!==cv)return;
  const r=cv.getBoundingClientRect(),sx=(e.clientX-r.left)*(VW/r.width),sy=(e.clientY-r.top)*(VH/r.height),c=window.LASTCAM||[0,0],wx=c[0]+sx/Z,wy=c[1]+sy/Z;
  let best=null,bd=26;for(const o of NET.others.values()){if(o.dead)continue;const d=Math.hypot(o.x-wx,(o.y-14)-wy);if(d<bd){bd=d;best=o}}
  if(!best){PM9CLOSE();return}
  const fr=FR9.list.includes(best.name),b=(a,t)=>'<button class="mini" style="display:block;width:100%;margin-top:4px;background:#2a2a3a;color:#f2e9c9;border:1px solid #D4AF37" onclick="PM9(\''+a+'\',\''+String(best.id).replace(/'/g,'')+'\')">'+t+'</button>';
  pm9.innerHTML='<b>'+esc(best.name||'ผู้เล่น')+'</b> <small style="opacity:.8">Lv.'+(best.lv|0)+' · '+((typeof CLS!=='undefined'&&CLS[best.cls]&&CLS[best.cls].n)||'ไม่มีอาชีพ')+(best.pvp?' · ⚔️PvP':'')+'</small>'+b('w','💬 กระซิบ')+b('f',fr?'💔 ลบเพื่อน':'🤝 เพิ่มเพื่อน')+b('m','🔇 ปิดเสียงแชท')+'<button class="mini" style="display:block;width:100%;margin-top:4px;background:#2a2a3a;color:#f2e9c9;border:1px solid #D4AF37" onclick="PM9CLOSE()">✕ ปิด</button>';
  const w=gid('wrap').getBoundingClientRect();pm9.style.left=Math.max(6,Math.min(w.width-190,e.clientX-w.left+8))+'px';pm9.style.top=Math.max(6,Math.min(w.height-190,e.clientY-w.top-20))+'px';pm9.hidden=false}catch(er){}});
setInterval(()=>{if(!pm9.hidden&&(!NET.on||!NET.others.size))PM9CLOSE()},1000);
// ---------- 93: ออโต้ฟาร์ม (ในที่ดินผู้กล้า): เก็บเกี่ยว · รดน้ำ · ปลูกซ้ำ รอบตัว ----------
window.AF9={on:false,t:0};
const afb=document.createElement('button');afb.id='afb9';afb.hidden=true;afb.style.cssText='position:absolute;left:10px;bottom:150px;z-index:20;height:36px;padding:0 12px;border-radius:18px;background:#1A1A24;border:1.5px solid #D4AF37;color:#D4AF37;font:bold 13px system-ui,"Noto Sans Thai",sans-serif';gid('wrap').appendChild(afb);
function afUpd(){afb.textContent=AF9.on?'🤖 ออโต้ฟาร์ม: เปิด':'🤖 ออโต้ฟาร์ม: ปิด';afb.style.background=AF9.on?'#2c4a2c':'#1A1A24'}afUpd();
afb.onclick=()=>{AF9.on=!AF9.on;afUpd();sfx('ui');say(AF9.on?'🤖 ออโต้ฟาร์มเปิด — เดินไปที่แปลงแล้วเกมจะรดน้ำ/เก็บเกี่ยว/ปลูกซ้ำในรัศมี 3 ช่อง (ใช้บัวรดน้ำและเมล็ดในกระเป๋า)':'ปิดออโต้ฟาร์มแล้ว')};
setInterval(()=>{try{const home=!!(D&&D.home)&&titleEl.hidden&&!P.dead;afb.hidden=!home;if(!home){return}
  if(!AF9.on||PAUSED)return;const Zm=ZCACHE[300];if(!Zm)return;const px=Math.floor(P.x/T),py=Math.floor(P.y/T);let did=0,hv=0,wt=0,pl=0;
  for(let dy=-3;dy<=3&&did<4;dy++)for(let dx=-3;dx<=3&&did<4;dx++){const x=px+dx,y=py+dy,t=HOME.tiles[x+','+y];if(!t||!t.till)continue;
   if(t.crop){const C=CROPS[t.crop.k];
    if(t.crop.s>=C.d){const q=1+(Math.random()<.15?1:0);if(typeof canTake==='function'&&canTake(t.crop.k)!==true)continue;inv[t.crop.k]=(inv[t.crop.k]|0)+q;if(t.crop.k==='wheat')inv.hay=(inv.hay|0)+1;if(C.re)t.crop.s=C.d-C.re;else delete t.crop;hv+=q;did++;rfxP&&rfxP(x*T+16,y*T+16,0,-50,.6,'255,230,120',2,'spark')}
    else if(t.w!==HOME.day&&HOME.can>0){t.w=HOME.day;HOME.can--;wt++;did++;homePaintTile(x,y)}}
   else{const ks=Object.keys(CROPS);const k=(SEEDSEL9&&inv['sd_'+SEEDSEL9]>0)?SEEDSEL9:ks.find(q=>inv['sd_'+q]>0);if(k){inv['sd_'+k]--;t.crop={k,s:0};pl++;did++}}}
  if(did){homeObjects();saveHome();refreshInv();sfx('pop');say('🤖 ออโต้ฟาร์ม: '+[hv?'เก็บเกี่ยว '+hv:'',wt?'รดน้ำ '+wt:'',pl?'ปลูก '+pl:''].filter(Boolean).join(' · ')+(HOME.can<=0&&wt?' · น้ำหมดแล้ว':''))}}catch(e){}},800);

// =====================================================================
