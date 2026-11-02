// fix9.js (v4.18) — ระบบออนไลน์: 🐉 บอสโลก 12:00/20:00 · 🔨 โรงประมูล · 🏪 ตลาดกลาง + แผงร้านผู้เล่น
//                    · ผู้เล่นอื่นเห็นออร่า/ชุดแฟชั่น/สัตว์ขี่ของกันและกัน
// =====================================================================
const ON10={auth:false,acct:null};
const netOk10=()=>!!(NET.on&&NET.ws&&NET.ws.readyState===1);
const ws10=o=>{try{if(netOk10())NET.ws.send(JSON.stringify(o))}catch(e){}};
const esc10=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt10=n=>Math.round(n||0).toLocaleString();
const itName10=it=>it.k==='gear'?((ITEMS[it.id]&&ITEMS[it.id].name)||it.id)+(it.e?' +'+it.e:''):((INVMETA[it.id]&&INVMETA[it.id][0])||it.id);
const itIcon10=it=>{try{return iconURL(it.k==='gear'?'item:'+it.id:'mat:'+it.id)}catch(e){return ''}};
// ---------- ส่งสถานะเพิ่ม: ออร่า/รูน/แฟชั่น/สัตว์ขี่/แผงร้าน + ยืนยันบัญชีหลังต่อเซิร์ฟเวอร์ ----------
function myFx10(){const e={};for(const s in P.armor){const id=P.armor[s];if(id&&ENH[id])e[s]=ENH[id]|0}const r=P.armor.sword&&runeOf(RUNES[P.armor.sword]);
 return {e,rn:r?{el:r.el,g:r.g}:null,fw:FASH.wpn||'',fb:FASH.body||'',m:HOME.mount||'',mo:!!(MOUNT.on&&HOME.mount)}}
{const _send=WebSocket.prototype.send;WebSocket.prototype.send=function(s){let hi=false;
  try{if(this===NET.ws&&typeof s==='string'){if(s.startsWith('{"t":"st"')){const o=JSON.parse(s);o.fx=myFx10();if(STALL10.open)o.stl={ti:STALL10.ti,n:STALL10.items.length};s=JSON.stringify(o)}else if(s.startsWith('{"t":"hi"'))hi=true}}catch(e){}
  const r=_send.call(this,s);if(hi)setTimeout(auth10,300);return r}}
function auth10(){try{if(!window.FM_ACCT||!CLOUD.base())return;const tok=CLOUD.tok(FM_ACCT);if(tok)ws10({t:'auth',id:FM_ACCT,token:tok,document:window.SERVER_BOOT&&SERVER_BOOT.document})}catch(e){}}
/* v5.77: ไฟล์นี้โหลดช้ากว่าการต่อซ็อกเก็ต (มือถือ/เน็ตช้า) → hi ออกไปก่อนตัวดักด้านบนติดตั้ง จึงไม่เคยส่ง auth · ถ้าเปิดอยู่แล้วตอนโหลด ส่ง auth เองครั้งเดียว · tests/ws_auth_late_browser_test.js */
try{if(netOk10()&&!ON10.auth)setTimeout(auth10,300)}catch(e){}
// ---------- รับข้อความจากเซิร์ฟเวอร์ ----------
{const _nm=netMsg;netMsg=function(d){const r=_nm(d);try{
  if(d.t==='snap'){for(const s of d.ps){const o=NET.others.get(s.id);if(o){o.fx=s.fx||null;o.stl=s.stl||null}}}
  else if(d.t==='auth_no'){ON10.auth=false;if(window.ONL32)ONL32.kick('บัญชีนี้เปลี่ยนการเข้าสู่ระบบแล้ว กรุณาล็อกอินใหม่')}
  else if(d.t==='auth_ok'){ON10.auth=true;ON10.gm=!!d.gm;ws10({t:'wbq'})}
  else if(d.t==='mail')mail10(d.list||[]);
  else if(d.t==='wb')wbMsg10(d);
  else if(d.t==='wbwin')wbWin10(d);
  else if(d.t==='alots'){AUC10.lots=d.lots||[];if(!aucW10.hidden)aucRender10()}
  else if(d.t==='abid_ok'){inv.coin=Math.max(0,inv.coin-(d.amt|0));try{refreshInv();saveGame(true)}catch(e){}say('🔨 ให้ราคา '+fmt10(d.amt)+' สำหรับ '+d.nm+' แล้ว (ถ้าโดนแซงจะได้เหรียญคืนทางจดหมาย)');sfx('gem')}
  else if(d.t==='abid_no'){say('🔨 '+(d.why||'ประมูลไม่สำเร็จ'));sfx('thud')}
  else if(d.t==='sitems')stallView10(d);
  else if(d.t==='ssold')stallSold10(d);
  else if(d.t==='sgot')stallGot10(d);
 }catch(e){console.warn('[net10]',e)}return r}}
// ---------- ของที่ได้รับ (จดหมาย/ประมูล/บอสโลก) ----------
function give10(it){if(!it)return;
 if(it.k==='mat'){inv[it.id]=(inv[it.id]|0)+(it.n|0||1)}
 else if(it.k==='gear'&&ITEMS[it.id]){GEAR[it.id]=(GEAR[it.id]|0)+1;if(it.e)ENH[it.id]=Math.max(ENH[it.id]|0,it.e|0)}
 else if(it.k==='mount'&&typeof MOUNTS!=='undefined'&&MOUNTS[it.id]){const own=HOME.mounts||(HOME.mounts=[]);if(!own.includes(it.id))own.push(it.id);if(!HOME.mount)HOME.mount=it.id;try{mountB.hidden=false}catch(e){}saveHome()}
 else if(it.k==='fash'){if(!FASH.own.includes(it.id))FASH.own.push(it.id);saveFash()}}
function mail10(list){const L=[];for(const m of list){try{
  if(m.k==='coin'){inv.coin+=m.n|0;L.push('🪙 '+fmt10(m.n)+(m.why?' ('+m.why+')':''))}
  else if(m.k==='auc'){give10(m.item);L.push('🔨 ชนะประมูล: '+m.nm)}
  else if(m.k==='wbwin'){L.push(wbReward10(m))}
 }catch(e){}}
 if(!L.length)return;try{refreshInv();saveGame(true)}catch(e){}sfx('chest');try{sysSay('📬 ได้รับ: '+L.join(' · '))}catch(e){}
 try{banner('📬 จดหมายใหม่',L.slice(0,2).join(' · '))}catch(e){}}

// =====================================================================
// 🐉 บอสโลก
// =====================================================================
const WB10={on:false,hp:0,max:0,end:0,top:[],next:0,n:0,Zm:null,killed:false};
function buildWb10(){if(WB10.Zm)return WB10.Zm;const W=40,H=30,m=[];
 for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++){const dx=(x-W/2+.5)/(W/2-1),dy=(y-H/2+.5)/(H/2-1);m[y][x]=(dx*dx+dy*dy>1)?WL:FL}}
 for(let y=H-3;y<H;y++)for(let x=W/2-1;x<=W/2;x++)m[y][x]=FL;for(let x=0;x<W;x++)m[H-1][x]=WL;
 for(const [x,y] of [[10,9],[29,9],[10,20],[29,20],[20,6]])m[y][x]=WL;
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=y*T,h=hash(x*1.1,y*1.9);
  if(m[y][x]===WL){k.fillStyle='#120606';k.fillRect(px,py,T,T);k.fillStyle='#3a1410';k.fillRect(px+2,py+2,T-4,T-8);k.fillStyle='rgba(255,90,20,.25)';k.fillRect(px+4,py+T-10,T-8,3)}
  else{k.fillStyle=h>.5?'#2a1612':'#24120e';k.fillRect(px,py,T,T);k.strokeStyle='rgba(0,0,0,.35)';k.strokeRect(px+.5,py+.5,T-1,T-1);
   if(h>.9){k.strokeStyle='rgba(255,110,30,.55)';k.lineWidth=2;k.beginPath();k.moveTo(px+4,py+8);k.lineTo(px+14,py+16);k.lineTo(px+26,py+12);k.stroke();k.lineWidth=1}}}
 const cx=W*T/2,cy=H*T/2;k.save();k.strokeStyle='rgba(255,90,30,.5)';k.lineWidth=4;for(const r of [.3,.2,.1]){k.beginPath();k.arc(cx,cy,W*T*r*.55,0,7);k.stroke()}k.restore();
 for(const [x,y] of [[10,9],[29,9],[10,20],[29,20],[20,6]]){const px=x*T+16,py=y*T+16;k.fillStyle='#1a0a08';k.fillRect(px-8,py-40,16,50);const g=k.createRadialGradient(px,py-44,0,px,py-44,14);g.addColorStop(0,'rgba(255,200,80,1)');g.addColorStop(1,'rgba(255,60,0,0)');k.fillStyle=g;k.fillRect(px-14,py-58,28,28)}
 k.font='900 22px Georgia,serif';k.textAlign='center';k.fillStyle='rgba(255,160,90,.35)';k.fillText('🐉 ลานบอสโลก',cx,T*2.6);
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 return WB10.Zm={zi:600,name:'wboss',Zd:{id:'wboss',n:'ลานบอสโลก',e:'🐉',lv:[1,1],dark:1,amb:'dust',pal:{vd:'#120606'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingAu'},
  m,ores:[],oreAt:{},floor,ent:{x:W/2,y:H-3},arena:{x:W/2,y:Math.floor(H/2)-2},seen:new Uint8Array(W*H).fill(1),W,H,cv:c}}
const inWb10=()=>!!(D&&D.wb10);window.inWb10=inWb10;
function enterZone10(Zm,extra,title,tip,scene){if(D&&(D.zone||D.shop)&&!(D.wb10||D.mk10)){say('ไปได้จากเมืองหรือทุ่งหญ้า');sfx('thud');return false}
 LoadingScreenManager.cover({icon:Zm.Zd.e,title,tip},()=>{if(D&&(D.town||D.wb10||D.mk10)){try{exitD()}catch(e){}}
  try{closeZMenu()}catch(e){}ZW=Zm.W;ZH=Zm.H;sfx('warp');setScene(scene||'town');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;
  D=Object.assign({zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret:[ZG.x,ZG.y+40],ban:0},extra);dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,4);
  P.x=Zm.ent.x*T;P.y=(Zm.ent.y-1)*T+16;P.dir='u';P.kx=P.ky=0;MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}
  if(extra.wb10)wbSpawnLocal10()});return true}
function wbSpawnLocal10(){if(!inWb10()||!WB10.on||D.boss)return;const Zm=D.zone,L=Math.min(110,P.lv+8);
 const b=mkMob('dragon','มหาอสูรอัคคีเอลโดเรีย',['#a8382a','#3a0e0a','#ffb04a'],L,Zm.arena.x*T,Zm.arena.y*T+16,{boss:1});
 b.max=WB10.max||b.max;b.hp=Math.max(1,WB10.hp||b.max);b.lh=b.hp;b.wb10=1;b.phase=0;b.sk=3;b.sc*=1.6;b.atk=Math.round(mobStats(Math.min(110,P.lv+6),'dragon',0,1).atk*.8);
 D.boss=b;D.bossT=1e9;D.mobs.push(b)}
function enterWb10(){if(!netOk10()){say('🐉 ต้องต่อเซิร์ฟเวอร์ออนไลน์ก่อน');sfx('thud');return}
 if(!WB10.on){say('🐉 บอสโลกยังไม่ปรากฏ — มาเวลา 12:00 และ 20:00 น.');sfx('thud');return}
 if(P.lv<15){say('🐉 ต้อง Lv.15 ขึ้นไป');sfx('thud');return}
 enterZone10(buildWb10(),{wb10:1},'ลานบอสโลก','บอสเลือดมหาศาล ต้องช่วยกันตีหลายคน · ดาเมจรวมจัดอันดับรับรางวัล','cave')}
function leaveWb10(){if(!inWb10())return;LoadingScreenManager.cover({icon:'🏰',title:'กลับเมือง'},()=>{exitD();enterTown(1)})}
window.enterWb10=enterWb10;window.leaveWb10=leaveWb10;
function wbMsg10(d){const was=WB10.on;Object.assign(WB10,{on:!!d.on,hp:d.hp|0,max:d.max|0,end:d.end||0,top:d.top||[],next:d.next||0,n:d.n|0});
 if(d.on&&!was)WB10.killed=false;
 if(inWb10()){const b=D.boss;if(d.on){if(!b)wbSpawnLocal10();else if(b.wb10){const pend=Math.max(0,(b.lh||b.hp)-b.hp);b.max=d.max;b.lh=d.hp;b.hp=Math.max(1,d.hp-pend)}}
  else if(b&&b.wb10&&!b.dead){if(d.hp<=0){WB10.killed=true;b.hp=0;mobKill(b)}else{b.dead=true;D.mobs=D.mobs.filter(q=>q!==b);D.boss=null;say('💨 บอสโลกหนีไปแล้ว!')}}}}
// ส่งดาเมจที่ทำกับบอสขึ้นเซิร์ฟเวอร์ (รวมทุก 250ms)
setInterval(()=>{try{if(!inWb10())return;const b=D.boss;if(!b||!b.wb10||b.dead)return;const dl=(b.lh||b.hp)-b.hp;if(dl>0){ws10({t:'wbhit',dmg:Math.round(dl)});b.lh=b.hp}}catch(e){}},250);
// บอสโลกไม่ตายฝั่งเครื่องเราเอง — รอเซิร์ฟเวอร์ยืนยัน
{const _mk=mobKill;mobKill=function(m){if(m&&m.wb10&&!WB10.killed){m.dead=false;m.hp=Math.max(1,m.hp);return}if(m&&m.wb10){D.boss=null;D.bossT=1e9}return _mk(m)}}
function wbReward10(d){const r=d.rank|0,top=r===1?3:r<=3?2:r<=10?1.4:1,R=[];const add=(k,n,lab)=>{n=Math.round(n);if(n>0){inv[k]=(inv[k]|0)+n;R.push(lab+' ×'+fmt10(n))}};
 add('coin',Math.min(250000,(4000+(d.d|0)*.25)*top),'🪙');add('estone',(5+Math.min(15,(d.share||0)*50))*top,'💠');add('bless',r===1?5:r<=3?3:r<=10?1:0,'✨');add('gem',r<=10?6-Math.min(5,r>>1):1,'💎');
 try{const x=Math.round(need(P.lv)*.4*top);gainXp(x);R.push('⭐ XP +'+fmt10(x))}catch(e){}
 return '🐉 บอสโลก อันดับ '+r+'/'+d.n+' ('+fmt10(d.d)+' ดาเมจ): '+R.join(' · ')}
function wbWin10(d){const s=wbReward10(d);try{refreshInv();saveGame(true)}catch(e){}flash('#ffd84a',.45);sfx('chest');try{sysSay('🏆 '+s)}catch(e){}
 setTimeout(()=>{try{talk({name:'เสียงจากฟากฟ้า',c:'#ff8a3a'},'🏆 ปราบบอสโลกสำเร็จ!\n'+s+'\nของหายากจากบอสถูกส่งเข้าโรงประมูลแล้ว',[{t:'🔨 ไปโรงประมูล',c:'go',f:()=>openAuc10()},{t:'🏰 กลับเมือง',f:()=>leaveWb10()},BYE],'🐉 บอสโลก')}catch(e){}},1500)}
// HUD บอสโลก (มุมบน) + ปุ่มเมนู
const wbHud10=document.createElement('div');wbHud10.style.cssText='position:absolute;left:50%;top:calc(66px + var(--st,0px));transform:translateX(-50%);z-index:5;font:900 11px system-ui,"Noto Sans Thai";color:#fff;background:rgba(60,16,8,.88);border:1.5px solid #ff8a3a;border-radius:10px;padding:3px 10px;display:none;text-align:center;min-width:170px;cursor:pointer';
gid('wrap').appendChild(wbHud10);wbHud10.onclick=()=>openWb10();
setInterval(()=>{try{const show=WB10.on&&titleEl.hidden&&!inTower10();wbHud10.style.display=show?'':'none';if(!show)return;const left=Math.max(0,(WB10.end-srvNow())/1000);
  wbHud10.innerHTML='🐉 บอสโลก '+(inWb10()?'':'ปรากฏแล้ว! (แตะเพื่อไป) ')+'· ⌛ '+Math.floor(left/60)+':'+String(Math.floor(left%60)).padStart(2,'0')+' · 👥 '+WB10.n+
   (inWb10()&&WB10.top.length?'<div style="font-weight:600;font-size:10px;opacity:.9">'+WB10.top.slice(0,3).map((t,i)=>(i+1)+'. '+esc10(t[0])+' '+fmt10(t[1])).join(' · ')+'</div>':'')}catch(e){}},500);
function openWb10(){const nx=WB10.next?new Date(WB10.next):null,th=nx?nx.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Bangkok'}):'12:00 / 20:00';
 if(inWb10()){talk({name:'เสียงจากฟากฟ้า',c:'#ff8a3a'},'บอสเหลือ '+fmt10(WB10.hp)+' / '+fmt10(WB10.max)+' · ผู้ร่วมรบ '+WB10.n+' คน',[{t:'🏰 ออกจากลาน',c:'go',f:()=>leaveWb10()},BYE],'🐉 บอสโลก');return}
 const txt='🐉 บอสโลก "มหาอสูรอัคคีเอลโดเรีย" ปรากฏทุกวันเวลา 12:00 และ 20:00 น. (เวลาไทย) อยู่ 30 นาที\nเลือดมหาศาล ต้องช่วยกันตีหลายคน · จัดอันดับตามดาเมจ · ของหายากเข้าโรงประมูล\n'+
  (WB10.on?'🔥 ตอนนี้บอสปรากฏอยู่! เหลือ '+fmt10(WB10.hp)+' HP':'⏰ ครั้งถัดไป: '+th)+(netOk10()?'':'\n⚠️ ยังไม่ได้ต่อเซิร์ฟเวอร์ออนไลน์');
 const ch=[];if(WB10.on)ch.push({t:'⚔️ ไปลานบอสโลก',c:'go',f:()=>enterWb10()});ch.push({t:'🔨 โรงประมูล',f:()=>openAuc10()});if(ON10.gm&&!WB10.on)ch.push({t:'🛠️ GM: เรียกบอสโลกทดสอบ',f:()=>ws10({t:'wbgm'})});ch.push(BYE);
 talk({name:'เสียงจากฟากฟ้า',c:'#ff8a3a'},txt,ch,'🐉 บอสโลก')}
window.openWb10=openWb10;
{const _ns=netScene;netScene=function(){if(D&&D.wb10)return 'wboss';if(D&&D.mk10)return 'market';return _ns()}}

// =====================================================================
// 🔨 โรงประมูล
// =====================================================================
const AUC10={lots:[]};const aucW10=mk6('auc10');
function openAuc10(){if(!netOk10()){say('🔨 ต้องต่อเซิร์ฟเวอร์ออนไลน์ก่อน');sfx('thud');return}ws10({t:'alist'});p6open(aucW10);aucRender10()}
function aucRender10(){const L=AUC10.lots,now=Date.now();
 let h='<div class="w" style="width:min(460px,96%);height:auto;max-height:92%"><div class="hd"><b>🔨 โรงประมูลของหายาก</b><button onclick="p6close(aucW10)">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto;padding:8px;gap:6px">';
 h+='<small style="opacity:.8">ของหายากจากบอสโลก · ให้ราคาสูงกว่าเดิม 5% ขึ้นไป · ถูกแซงได้เหรียญคืนทางจดหมาย · เหรียญของคุณ 🪙 '+fmt10(inv.coin)+(ON10.auth?'':'<br>⚠️ ต้องเข้าสู่ระบบบัญชีออนไลน์จึงจะประมูลได้')+'</small>';
 if(!L.length)h+='<div style="padding:18px;text-align:center;opacity:.7">ยังไม่มีของประมูล — ปราบบอสโลก (12:00 / 20:00) เพื่อให้ของหายากดรอปเข้าโรงประมูล</div>';
 for(const l of L){const left=Math.max(0,(l.end-now)/1000),need=l.bids?Math.ceil(l.cur*1.05):l.cur;
  h+='<div style="border:1px solid #D4AF37;border-radius:9px;padding:7px;background:#221d2c"><b>'+esc10(l.nm)+'</b><br><small>ราคาปัจจุบัน 🪙 '+fmt10(l.cur)+(l.by?' · โดย '+esc10(l.by):' · ยังไม่มีคนประมูล')+' · ⌛ '+Math.floor(left/3600)+' ชม. '+Math.floor(left%3600/60)+' นาที</small>'+
   '<div style="display:flex;gap:6px;margin-top:5px"><input id="ab10_'+l.id+'" type="number" min="'+need+'" value="'+need+'" style="flex:1;min-width:0;padding:4px;border-radius:6px;border:1px solid #888;background:#111;color:#fff"><button class="mini" onclick="aucBid10('+l.id+')">ให้ราคา</button></div></div>'}
 aucW10.innerHTML=h+'</div></div>'}
window.aucBid10=id=>{const el=gid('ab10_'+id),amt=Math.floor(+(el&&el.value)||0);if(!ON10.auth){say('🔨 ต้องเข้าสู่ระบบบัญชีออนไลน์ก่อน');sfx('thud');return}
 if(amt>inv.coin){say('🪙 เหรียญไม่พอ');sfx('thud');return}ws10({t:'abid',id,amt})};
window.openAuc10=openAuc10;window.aucW10=aucW10;
setInterval(()=>{if(!aucW10.hidden)aucRender10()},5000);

// =====================================================================
// 🏪 ตลาดกลาง + แผงร้านผู้เล่น
// =====================================================================
const MK10={Zm:null};
function buildMk10(){if(MK10.Zm)return MK10.Zm;const W=44,H=30,m=[];
 for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++)m[y][x]=(x<1||y<2||x>=W-1||y>=H-1)?WL:FL}
 for(let y=H-1;y<H;y++)for(let x=W/2-1;x<=W/2;x++)m[y][x]=FL;for(let x=0;x<W;x++)if(m[H-1][x]===FL&&!(x>=W/2-1&&x<=W/2))m[H-1][x]=WL;m[H-1][W/2-1]=WL;m[H-1][W/2]=WL;
 const cx=W/2,cy=H/2;for(let y=cy-1;y<=cy;y++)for(let x=cx-1;x<=cx;x++)m[y][x]=WL; // น้ำพุ
 const trees=[[4,5],[39,5],[4,24],[39,24],[12,4],[31,4]];for(const [x,y] of trees)m[y][x]=WL;
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=y*T,h=hash(x*1.3,y*2.7);
  if(m[y][x]===WL&&(y<2||x<1||x>=W-1||y>=H-1)){k.fillStyle='#6a4a32';k.fillRect(px,py,T,T);k.fillStyle='#8a6444';k.fillRect(px+1,py+1,T-2,T-10);k.fillStyle='#b8865a';k.fillRect(px+1,py+1,T-2,4);continue}
  const road=Math.abs(x-cx+.5)<2.5||Math.abs(y-cy+.5)<2.5,ring=Math.hypot(x-cx+.5,y-cy+.5)<6;
  k.fillStyle=ring?(h>.5?'#d8c8a8':'#cdbd9c'):road?(h>.5?'#c8b08a':'#bfa680'):(h>.5?'#7aa85a':'#72a054');k.fillRect(px,py,T,T);
  if(road||ring){k.strokeStyle='rgba(90,70,50,.25)';k.strokeRect(px+.5,py+.5,T/2,T/2);k.strokeRect(px+T/2+.5,py+T/2+.5,T/2-1,T/2-1)}
  else if(h>.8){k.fillStyle=['#ff8ab0','#ffe06a','#ffffff','#b08aff'][Math.floor(h*97)%4];k.beginPath();k.arc(px+8+h*14,py+10+h*10,2,0,7);k.fill()}}
 // น้ำพุกลางลาน
 {const fx=cx*T,fy=cy*T;k.fillStyle='#8a8a9a';k.beginPath();k.ellipse(fx,fy,40,26,0,0,7);k.fill();k.fillStyle='#4aa0e0';k.beginPath();k.ellipse(fx,fy,34,21,0,0,7);k.fill();k.fillStyle='#9ad8ff';k.beginPath();k.ellipse(fx-8,fy-5,12,5,0,0,7);k.fill();k.fillStyle='#b0b0c0';k.fillRect(fx-5,fy-26,10,24);k.fillStyle='#d8f0ff';k.beginPath();k.arc(fx,fy-28,7,0,7);k.fill()}
 for(const [x,y] of trees){const px=x*T+16,py=y*T+16;k.fillStyle='#5a3a1a';k.fillRect(px-4,py-6,8,16);k.fillStyle='#3a8a3a';k.beginPath();k.arc(px,py-16,16,0,7);k.fill();k.fillStyle='#5aaa4a';k.beginPath();k.arc(px-5,py-21,9,0,7);k.fill()}
 // ธงทิวประดับรอบลาน
 for(let x=2;x<W-2;x+=1){const px=x*T,py=2*T+6+Math.sin(x)*3;k.fillStyle=['#e84a4a','#ffd84a','#4a9ae8','#6ad86a'][x%4];k.beginPath();k.moveTo(px,py);k.lineTo(px+T,py);k.lineTo(px+T/2,py+12);k.closePath();k.fill()}
 // ป้ายโรงประมูลด้านบน
 k.fillStyle='#4a2a1a';k.fillRect(cx*T-90,T*.2,180,40);k.strokeStyle='#ffd84a';k.lineWidth=2;k.strokeRect(cx*T-90,T*.2,180,40);k.font='900 18px Georgia,serif';k.textAlign='center';k.fillStyle='#ffd84a';k.fillText('🏪 ตลาดกลางเอลโดเรีย',cx*T,T*.2+27);
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 return MK10.Zm={zi:700,name:'market',Zd:{id:'market',n:'ตลาดกลาง',e:'🏪',lv:[1,1],dark:0,amb:'dust',pal:{vd:'#6a4a32'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt'},
  m,ores:[],oreAt:{},floor,ent:{x:W/2,y:H-2},arena:{x:W/2,y:H/2},seen:new Uint8Array(W*H).fill(1),W,H,cv:c}}
const inMk10=()=>!!(D&&D.mk10);window.inMk10=inMk10;
function enterMk10(){enterZone10(buildMk10(),{mk10:1},'ตลาดกลางเอลโดเรีย','ตั้งแผงขายของ ซื้อของจากผู้เล่นคนอื่น · ไม่มี PvP','town')}
function leaveMk10(){if(!inMk10())return;stallClose10(true);LoadingScreenManager.cover({icon:'🏰',title:'กลับเมือง'},()=>{exitD();enterTown(1)})}
window.enterMk10=enterMk10;window.leaveMk10=leaveMk10;
// แถบปุ่มในตลาด
const mkBar10=document.createElement('div');mkBar10.style.cssText='position:absolute;right:8px;top:calc(120px + var(--st,0px));z-index:6;display:none;flex-direction:column;gap:5px';
mkBar10.innerHTML='<button class="mini" onclick="stallOpenUI10()">🏪 แผงร้านของฉัน</button><button class="mini" onclick="openAuc10()">🔨 โรงประมูล</button><button class="mini" onclick="leaveMk10()">🏰 กลับเมือง</button>';
gid('wrap').appendChild(mkBar10);setInterval(()=>{mkBar10.style.display=inMk10()&&titleEl.hidden?'flex':'none';if(!inMk10()&&STALL10.open)stallClose10(true)},400);
// แผงร้านของเรา (ของที่วางขายถูกกันไว้ ไม่อยู่ในกระเป๋า — เก็บร้านแล้วคืนเข้ากระเป๋า)
const STALL10={open:false,ti:'',items:[],nx:0};try{Object.assign(STALL10,JSON.parse(localStorage.getItem('fm_stall10')||'{}'))}catch(e){}
const stallSave10=()=>{try{localStorage.setItem('fm_stall10',JSON.stringify(STALL10))}catch(e){}};
const stallSend10=()=>ws10(STALL10.open?{t:'stall',ti:STALL10.ti,items:STALL10.items.map(x=>({i:x.i,k:x.k,id:x.id,n:x.n,p:x.p,nm:itName10(x),e:x.e|0}))}:{t:'stall'});
function stallReturn10(it){if(it.k==='mat')inv[it.id]=(inv[it.id]|0)+it.n;else GEAR[it.id]=(GEAR[it.id]|0)+1}
function stallClose10(silent){if(!STALL10.open&&!STALL10.items.length)return;for(const it of STALL10.items)stallReturn10(it);STALL10.items=[];STALL10.open=false;stallSave10();stallSend10();try{refreshInv();saveGame(true)}catch(e){}if(!silent)say('🏪 เก็บร้านแล้ว — ของที่ยังไม่ขายกลับเข้ากระเป๋า')}
// ถ้าเกมปิดไปตอนเปิดร้านอยู่ ของต้องกลับเข้ากระเป๋า
setTimeout(()=>{try{if(STALL10.items.length&&!inMk10()){STALL10.open=true;stallClose10(true)}}catch(e){}},4000);
const stW10=mk6('stw10');
function stallOpenUI10(){if(!netOk10()){say('🏪 ต้องต่อเซิร์ฟเวอร์ออนไลน์ก่อน');sfx('thud');return}p6open(stW10);stallRender10()}
window.stallOpenUI10=stallOpenUI10;
function stallRender10(){const S=STALL10,eq=new Set(Object.values(P.armor).filter(Boolean));
 const mats=Object.keys(inv).filter(k=>k!=='coin'&&(inv[k]|0)>0&&INVMETA[k]),gear=Object.keys(GEAR).filter(id=>(GEAR[id]|0)>0&&ITEMS[id]);
 let h='<div class="w" style="width:min(480px,96%);height:auto;max-height:94%"><div class="hd"><b>🏪 แผงร้านของฉัน</b><button onclick="p6close(stW10)">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto;padding:8px;gap:6px">';
 h+='<div style="display:flex;gap:6px;align-items:center"><small>ชื่อร้าน</small><input id="st10ti" maxlength="24" value="'+esc10(S.ti||((P.name||'ผู้กล้า')+' ขายถูก!'))+'" style="flex:1;min-width:0;padding:4px;border-radius:6px;border:1px solid #888;background:#111;color:#fff"></div>';
 h+='<b style="font-size:12px">วางขายอยู่ ('+S.items.length+'/12)</b>';
 if(!S.items.length)h+='<small style="opacity:.7">ยังไม่มีของ — เลือกของจากกระเป๋าด้านล่าง</small>';
 for(const it of S.items)h+='<div style="display:flex;gap:6px;align-items:center;border:1px solid #555;border-radius:8px;padding:4px"><img src="'+itIcon10(it)+'" style="width:28px;height:28px"><span style="flex:1;font-size:12px">'+esc10(itName10(it))+' ×'+it.n+'<br><b>🪙 '+fmt10(it.p)+'</b></span><button class="mini" onclick="stallDel10('+it.i+')">ถอน</button></div>';
 h+='<b style="font-size:12px;margin-top:4px">เพิ่มของจากกระเป๋า</b><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><select id="st10it" style="flex:2;min-width:140px;padding:4px;background:#111;color:#fff;border-radius:6px">'+
  mats.map(k=>'<option value="mat|'+k+'">'+esc10(INVMETA[k][0])+' (มี '+inv[k]+')</option>').join('')+gear.map(id=>'<option value="gear|'+id+'">'+esc10(ITEMS[id].name)+(ENH[id]?' +'+ENH[id]:'')+(eq.has(id)?'':'')+' (มี '+GEAR[id]+')</option>').join('')+
  '</select><input id="st10n" type="number" min="1" value="1" style="width:60px;padding:4px;background:#111;color:#fff;border-radius:6px" title="จำนวน"><input id="st10p" type="number" min="1" value="100" style="width:90px;padding:4px;background:#111;color:#fff;border-radius:6px" title="ราคารวม"><button class="mini" onclick="stallAdd10()">➕ วางขาย</button></div><small style="opacity:.7">ราคา = ราคารวมของจำนวนนั้น · ของที่สวมอยู่ต้องถอดก่อนจึงจะขายได้</small>';
 h+='<div style="display:flex;gap:6px;margin-top:6px"><button class="mini" style="flex:1;background:#2f6b2a" onclick="stallGo10()">'+(S.open?'💾 อัปเดตร้าน':'🏪 เปิดร้าน')+'</button>'+(S.open||S.items.length?'<button class="mini" style="flex:1;background:#6b2a2a" onclick="stallClose10();stallRender10()">📦 เก็บร้าน</button>':'')+'</div></div></div>';
 stW10.innerHTML=h}
window.stallAdd10=()=>{if(STALL10.items.length>=12){say('วางขายได้สูงสุด 12 ช่อง');return}const v=(gid('st10it')||{}).value;if(!v)return;const [k,id]=v.split('|');
 let n=Math.max(1,Math.floor(+gid('st10n').value||1));const p=Math.max(1,Math.floor(+gid('st10p').value||1));
 if(k==='mat'){n=Math.min(n,inv[id]|0);if(n<=0)return;inv[id]-=n}else{if(!(GEAR[id]>0))return;n=1;GEAR[id]--}
 STALL10.items.push({i:++STALL10.nx,k,id,n,p,e:k==='gear'?ENH[id]|0:0});stallSave10();try{refreshInv()}catch(e){}if(STALL10.open)stallSend10();sfx('ui');stallRender10()};
window.stallDel10=i=>{const it=STALL10.items.find(x=>x.i===i);if(!it)return;stallReturn10(it);STALL10.items=STALL10.items.filter(x=>x!==it);stallSave10();try{refreshInv()}catch(e){}if(STALL10.open)stallSend10();stallRender10()};
window.stallGo10=()=>{if(!inMk10()){say('เปิดร้านได้เฉพาะในตลาดกลาง');return}if(!STALL10.items.length){say('ยังไม่มีของวางขาย');return}STALL10.ti=(gid('st10ti').value||'').trim().slice(0,24)||'ร้านของ '+(P.name||'ผู้กล้า');
 STALL10.open=true;stallSave10();stallSend10();say('🏪 เปิดร้าน "'+STALL10.ti+'" แล้ว — ยืนอยู่ในตลาดเพื่อขายของ');sfx('gem');p6close(stW10)};
window.stallClose10=stallClose10;window.stW10=stW10;
function stallSold10(d){const it=STALL10.items.find(x=>x.i===d.i);if(!it)return;STALL10.items=STALL10.items.filter(x=>x!==it);inv.coin+=it.p;stallSave10();try{refreshInv();saveGame(true)}catch(e){}
 sfx('chest');say('💰 '+d.bn+' ซื้อ '+itName10(it)+' ×'+it.n+' — ได้ 🪙 '+fmt10(it.p));try{sysSay('💰 ขาย '+itName10(it)+' ให้ '+d.bn+' ได้ '+fmt10(it.p)+' เหรียญ')}catch(e){}if(!STALL10.items.length){STALL10.open=false;stallSave10();stallSend10();say('🏪 ขายหมดแล้ว!')}if(!stW10.hidden)stallRender10()}
// ดูแผงร้านผู้เล่นอื่น
const svW10=mk6('svw10');const BUY10={};
function stallView10(d){p6open(svW10);let h='<div class="w" style="width:min(440px,96%);height:auto;max-height:92%"><div class="hd"><b>🏪 '+esc10(d.ti||'แผงร้าน')+'</b><button onclick="p6close(svW10)">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto;padding:8px;gap:6px"><small>เจ้าของ: '+esc10(d.name)+' · เหรียญของคุณ 🪙 '+fmt10(inv.coin)+'</small>';
 if(!d.items.length)h+='<div style="padding:16px;text-align:center;opacity:.7">ร้านนี้ปิดหรือขายหมดแล้ว</div>';
 for(const it of d.items)h+='<div style="display:flex;gap:6px;align-items:center;border:1px solid #D4AF37;border-radius:8px;padding:5px;background:#221d2c"><img src="'+itIcon10(it)+'" style="width:30px;height:30px"><span style="flex:1;font-size:12px">'+esc10(it.nm||itName10(it))+' ×'+it.n+'<br><b>🪙 '+fmt10(it.p)+'</b></span><button class="mini" onclick="stallBuy10('+d.id+','+it.i+','+it.p+')">ซื้อ</button></div>';
 svW10.innerHTML=h+'</div></div>'}
window.stallBuy10=(id,i,p)=>{if(inv.coin<p){say('🪙 เหรียญไม่พอ');sfx('thud');return}inv.coin-=p;BUY10[id+':'+i]=p;try{refreshInv()}catch(e){}ws10({t:'sbuy',id,i,p});
 setTimeout(()=>{if(BUY10[id+':'+i]){inv.coin+=BUY10[id+':'+i];delete BUY10[id+':'+i];try{refreshInv()}catch(e){}say('⌛ ซื้อไม่สำเร็จ (หมดเวลา) — คืนเหรียญแล้ว')}},10000)};
function stallGot10(d){const key=d.from+':'+(d.item?d.item.i:d.i),paid=BUY10[key];delete BUY10[key];
 if(!d.ok){if(paid){inv.coin+=paid;try{refreshInv()}catch(e){}}say('❌ ซื้อไม่สำเร็จ — ของอาจถูกซื้อไปแล้ว (คืนเหรียญแล้ว)');sfx('thud');return}
 const it=d.item;give10({k:it.k,id:it.id,n:it.n,e:it.e});try{refreshInv();saveGame(true)}catch(e){}sfx('chest');say('🛒 ซื้อ '+(it.nm||itName10(it))+' ×'+it.n+' จาก '+d.sn+' แล้ว');try{p6close(svW10)}catch(e){}}
window.svW10=svW10;
// แตะที่แผงร้านของผู้เล่นอื่นในตลาด
cv.addEventListener('pointerup',e=>{try{if(!inMk10()||!NET.others.size||!titleEl.hidden||e.target!==cv)return;
  const r=cv.getBoundingClientRect(),sx=(e.clientX-r.left)*(VW/r.width),sy=(e.clientY-r.top)*(VH/r.height),c=window.LASTCAM||[0,0],wx=c[0]+sx/Z,wy=c[1]+sy/Z;
  let best=null,bd=48;for(const o of NET.others.values()){if(!o.stl)continue;const q=Math.hypot(o.x-wx,o.y-36-wy);if(q<bd){bd=q;best=o}}
  if(best){ws10({t:'sget',id:best.id});setTimeout(()=>{try{gid('pm9').hidden=true}catch(e){}},30)}}catch(e){}});
// ภาพแผงร้าน (กันสาดลายทาง + ป้ายชื่อร้าน)
function drawStall10(x,y,ti,n){try{const t=performance.now()/1000;ctx.save();
  ctx.fillStyle='#6a4a2a';ctx.fillRect(x-30,y-96,3,100);ctx.fillRect(x+27,y-96,3,100);
  for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#fff4e0':'#d8402a';ctx.beginPath();ctx.moveTo(x-34+i*11.4,y-102);ctx.lineTo(x-34+(i+1)*11.4,y-102);ctx.lineTo(x-34+(i+1)*11.4,y-92);ctx.quadraticCurveTo(x-34+(i+.5)*11.4,y-86,x-34+i*11.4,y-92);ctx.closePath();ctx.fill()}
  ctx.fillStyle='#8a5a32';ctx.fillRect(x-32,y+2,64,9);ctx.fillStyle='#a8743e';ctx.fillRect(x-32,y+2,64,3);
  for(let i=0;i<Math.min(5,n);i++){ctx.fillStyle=['#ffd84a','#6ad8ff','#ff8ab0','#8aff8a','#d8a8ff'][i];ctx.beginPath();ctx.arc(x-22+i*11,y+1,3.5,0,7);ctx.fill()}
  ctx.font='900 10px system-ui,"Noto Sans Thai"';ctx.textAlign='center';const w=Math.min(150,ctx.measureText(ti).width+14),by=y-112+Math.sin(t*2)*1.5;
  ctx.fillStyle='rgba(60,30,10,.92)';ctx.strokeStyle='#ffd84a';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-w/2,by-11,w,16,6):ctx.rect(x-w/2,by-11,w,16);ctx.fill();ctx.stroke();ctx.fillStyle='#ffe9a8';ctx.fillText('🏪 '+ti,x,by+1);
  ctx.restore()}catch(e){try{ctx.restore()}catch(_){}}}
{const _h=hero;hero=function(){_h();try{if(STALL10.open&&inMk10()&&!P.dead)drawStall10(P.x,P.y,STALL10.ti,STALL10.items.length)}catch(e){}}}

// =====================================================================
// ผู้เล่นอื่นแสดงออร่า / รูน / ชุดแฟชั่น / สัตว์ขี่ ของตัวเอง (ไม่ใช่ของเรา)
// =====================================================================
if(typeof drawOther==='function'){const _do=drawOther;drawOther=function(o){const fx=o.fx;
  if(!fx){const sw=FASH.wpn,sb=FASH.body;FASH.wpn=null;FASH.body=null;try{return _do(o)}finally{FASH.wpn=sw;FASH.body=sb}}
  const svE={},svR={},sw=FASH.wpn,sb=FASH.body;
  try{for(const s in (o.armor||{})){const id=o.armor[s];if(!id||id in svE)continue;svE[id]=ENH[id];ENH[id]=(fx.e&&fx.e[s])|0;if(s==='sword'){svR[id]=RUNES[id];if(fx.rn&&fx.rn.el)RUNES[id]='r_'+fx.rn.el+(fx.rn.g|0);else delete RUNES[id]}}
   FASH.wpn=fx.fw&&FWPN[fx.fw]?fx.fw:null;FASH.body=fx.fb||null;window.CUROTH10=o;_do(o)}
  finally{window.CUROTH10=null;FASH.wpn=sw;FASH.body=sb;for(const id in svE){if(svE[id]===undefined)delete ENH[id];else ENH[id]=svE[id]}for(const id in svR){if(svR[id]===undefined)delete RUNES[id];else RUNES[id]=svR[id]}}
  if(o.stl&&inMk10())drawStall10(o.x,o.y,o.stl.ti,o.stl.n)}}
{const _hb=heroBody;heroBody=function(){const o=window.CUROTH10;if(!(o&&window.__IN_OTHER8&&o.fx))return _hb();const fx=o.fx;
  const mk=fx.mo&&fx.m&&MOUNTS[fx.m]&&!o.dead,A=P.mv?1:0;
  if(mk){const f=P.dir==='l'?-1:1,ud=P.dir==='u'||P.dir==='d';try{if(ud&&window.drawSteedUD7)drawSteedUD7(fx.m,P.x,P.y+2,P.dir,A,0);else drawSteed(fx.m,P.x,P.y+2,f,A)}catch(e){}
   ctx.save();ctx.translate(0,-30);const sm=P.mv;P.mv=false;try{try{drawArmorAura(true)}catch(e){}_hb();try{drawArmorAura(false)}catch(e){}}finally{P.mv=sm;ctx.restore()}
   if(ud&&window.drawSteedUD7)try{drawSteedUD7(fx.m,P.x,P.y+2,P.dir,A,1)}catch(e){}return}
  try{drawArmorAura(true)}catch(e){}_hb();try{drawArmorAura(false)}catch(e){}}}

// ---------- เมนูโปรไฟล์ ----------
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['🐉','บอสโลก',()=>openWb10()],['🏪','ตลาด',()=>{if(inMk10())leaveMk10();else enterMk10()}],['🔨','ประมูล',()=>openAuc10()]);pmRender7()}catch(e){console.warn('[net10] pm',e)}

// =====================================================================
