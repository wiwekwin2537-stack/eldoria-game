// fix29.js (v4.35) — PvP 2.0: ท้าดวล 1v1 (แรงก์ ELO) · สนามประลองแบบสะสมคิล (สตรีค/ค่าหัว/ลูกพลัง) · อันดับ · ร้านเกียรติยศ · ฉายา PvP
// =====================================================================
const PV29={me:null,acct:false,ranks:null,duel:null,inv:null,sb:[],orbs:[],feed:[],pow:0,haste:0,tab:'home',who:null,wantWho:0,top:null,orbReq:{}};
ST20.honor=ST20.honor|0;ST20.dw=ST20.dw|0;ST20.ast=ST20.ast|0;ST20.pvbest=ST20.pvbest|0;
const st29=()=>{try{localStorage.setItem('fm_stat20',JSON.stringify(ST20))}catch(e){}};
const PVPHP29=1.6; // PvP เลือดหนาขึ้น (สู้กันนานขึ้น ไม่โดนวันช็อต)
// ---------- ส่งเลือด % ให้คนอื่นเห็น ----------
{const _send=WebSocket.prototype.send;WebSocket.prototype.send=function(s){try{if(this===NET.ws&&typeof s==='string'&&s.startsWith('{"t":"st"')){const o=JSON.parse(s);o.hpP=Math.max(0,Math.min(100,Math.round(P.hp/Math.max(1,BAL.hp)*100)));s=JSON.stringify(o)}}catch(e){}return _send.call(this,s)}}
{const _ns=netScene;netScene=function(){if(D&&D.duel29)return 'duel:'+D.duel29;return _ns()}}
// ---------- สังเวียนดวล ----------
const DU29={W:26,H:18,Zm:null};
function buildDuel29(){const W=DU29.W,H=DU29.H,m=[];for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++){const nx=(x+.5-W/2)/(W/2-1),ny=(y+.5-H/2)/(H/2-1);m[y][x]=nx*nx+ny*ny>1?WL:FL}}
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d');k.fillStyle='#0c0a12';k.fillRect(0,0,c.width,c.height);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=y*T,h=hash(x*1.7,y*2.3);if(m[y][x]===FL){k.fillStyle=h>.5?'#3a3446':'#342e40';k.fillRect(px,py,T,T);k.strokeStyle='rgba(0,0,0,.25)';k.strokeRect(px+.5,py+.5,T-1,T-1);if(h>.8){k.fillStyle='rgba(120,100,160,.2)';k.fillRect(px+6,py+10,10,3)}}
  else{k.fillStyle='#16121e';k.fillRect(px,py,T,T);if(h>.6){k.fillStyle='#221c2c';k.fillRect(px+4,py+4,T-8,T-8)}}}
 const cx=W*T/2,cy=H*T/2;k.save();k.globalCompositeOperation='lighter';const g=k.createRadialGradient(cx,cy,10,cx,cy,W*T*.42);g.addColorStop(0,'rgba(255,90,60,.22)');g.addColorStop(1,'rgba(255,90,60,0)');k.fillStyle=g;k.fillRect(0,0,c.width,c.height);k.restore();
 k.strokeStyle='rgba(255,120,80,.6)';k.lineWidth=4;k.beginPath();k.ellipse(cx,cy,W*T*.38,H*T*.36,0,0,7);k.stroke();k.strokeStyle='rgba(255,220,160,.35)';k.lineWidth=2;k.beginPath();k.ellipse(cx,cy,W*T*.12,H*T*.12,0,0,7);k.stroke();
 k.beginPath();k.moveTo(cx,cy-H*T*.36);k.lineTo(cx,cy+H*T*.36);k.strokeStyle='rgba(255,220,160,.18)';k.stroke();
 for(const [x,y] of [[4,4],[W-5,4],[4,H-5],[W-5,H-5]]){const px=x*T+16,py=y*T+16;k.fillStyle='#4a3a2a';k.fillRect(px-7,py-18,14,24);k.fillStyle='#2a1a10';k.fillRect(px-9,py-20,18,5);const f=k.createRadialGradient(px,py-26,2,px,py-26,22);f.addColorStop(0,'rgba(255,220,120,.95)');f.addColorStop(.4,'rgba(255,120,40,.6)');f.addColorStop(1,'rgba(255,80,20,0)');k.fillStyle=f;k.beginPath();k.arc(px,py-26,22,0,7);k.fill()}
 k.font='900 26px Georgia,serif';k.textAlign='center';k.fillStyle='rgba(255,150,110,.35)';k.fillText('⚔  DUEL  ⚔',cx,cy+9);
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 return DU29.Zm={zi:401,Zd:{id:'duel',n:'สังเวียนดวล',e:'⚔️',lv:[1,1],dark:0,amb:'dust',pal:{vd:'#2a1a2a'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt'},m,ores:[],oreAt:{},floor,ent:{x:Math.floor(W/2),y:H-3},arena:{x:Math.floor(W/2),y:Math.floor(H/2)},seen:new Uint8Array(W*H).fill(1),W,H,cv:c}}
const okPlace29=()=>!D||D.town||D.arena8;
function enterDuel29(g){const Zm=DU29.Zm||buildDuel29();PV29.from=D&&D.town?'town':'field';const ret=D?(D.ret||[ZG.x,ZG.y+40]):[P.x,P.y];
 LoadingScreenManager.cover({icon:'⚔️',title:'ศึกดวล: '+P.name+' VS '+g.opp.name,tip:'ล้มคู่ต่อสู้ หรือเหลือเลือดมากกว่าตอนหมดเวลา'},()=>{try{if(D){exitD()}}catch(e){}try{closeZMenu()}catch(e){}
  ZW=Zm.W;ZH=Zm.H;sfx('warp');setScene('town');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;MIN.length=0;
  D={zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret,ban:0,arena8:1,duel29:g.did};dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,4);
  P.x=(g.side?Zm.W-5:4)*T+16;P.y=Math.floor(Zm.H/2)*T+16;P.dir=g.side?'l':'r';P.kx=P.ky=0;MOUNT.on=false;P.dead=false;P.hp=BAL.hp;P.mp=BAL.mp;P.draw=true;P.tool='sword';for(let i=0;i<CS.cd.length;i++)CS.cd[i]=0})}
function leaveDuel29(){if(!(D&&D.duel29))return;LoadingScreenManager.cover({icon:'🏰',title:'กลับจากสังเวียน'},()=>{exitD();if(PV29.from==='town')enterTown(1);P.hp=BAL.hp;P.dead=false;P.iframe=0})}
// ห้ามตีก่อนเริ่ม / หลังจบ · ลูกพลัง ⚔️ แรงขึ้น 30%
const PVPCB29={sword:.99,mage:.94,archer:.97,ninja:1.42,sniper:1.05,paladin:1.04,cleric:.69,necro:.78,monk:1.47,dragoon:1,summoner:.83};window.PVPCB29=PVPCB29;
{const _h=hurtE;hurtE=function(e,mult,o){if(e&&e.pvp7){mult*=PVPCB29[P.cls]||1;if(D&&D.duel29&&!(PV29.duel&&PV29.duel.st==='fight'&&!PV29.duel.ko))return 0;if(PV29.pow>performance.now())mult*=1.3}return _h(e,mult,o)}}
{const _sm=spdMul;spdMul=function(){return _sm()*(PV29.haste>performance.now()?1.35:1)}}
// ดาเมจ PvP ใหม่: ผู้ตีส่งดาเมจดิบ (ATK×สกิล×คริ) · ผู้โดนลดตามเกราะแบบ % + DR · ×0.3 · ดาเมจต่อครั้งไม่เกิน 18% เลือดสูงสุด (ไม่มีวันช็อต)
PVP8.dmgK=1;const PVPK29=.5;
pvpHurt8=function(d){if(!pvpOn8()||P.dead)return;const n=performance.now();PVPHEAL52.hitT=n;/* v5.52 จำเวลาโดนผู้เล่นตี เพื่อลดฮีลระหว่างสู้ PvP */if(n<PVP8.hitT)return;const du=D&&D.duel29;if(du&&!(PV29.duel&&PV29.duel.st==='fight'&&!PV29.duel.ko))return;
 let dmg=(d.dmg|0)*100/(100+DEF())*PVPK29*(1-Math.min(.5,PTX().dr||0));dmg=Math.max(1,Math.round(Math.min(dmg,BAL.hp*.18)));
 P.hp=Math.max(0,P.hp-dmg);P.red=.25;sfx('hurt');dmgTxt(P.x,P.y-44,'-'+dmg,d.crit?'#ffd84a':'#ff5a5a',!!d.crit);
 if(P.hp<=0){netSend({t:'pvpko',by:d.from});flash('#ff3a3a',.4);shake(5,.3);
  if(du){PV29.duel.ko=1;P.hp=1;P.iframe=99;big29('💀 K.O.','#ff5a5a');return}
  P.hp=Math.round(BAL.hp*.6);P.mp=Math.max(P.mp,Math.round(BAL.mp*.4));PVP8.hitT=n+3000;P.iframe=Math.max(P.iframe||0,3);
  if(inArena8()){const Z=D.zone;P.x=Z.ent.x*T+16;P.y=(Z.ent.y-1)*T+16;say('💥 แพ้ให้ '+d.name+' — เกิดใหม่ที่จุดเริ่ม (ไม่เสียของ/XP)')}else{PVP8.on=false;say('💥 แพ้ให้ '+d.name+' — ปิด PvP ให้อัตโนมัติ (ไม่เสียของ/XP)')}}};
// ฟันปกติ (ดาบ/หมัด/ทวน) โดนผู้เล่นได้ด้วย — เดิมฟันปกติตีได้แค่มอนสเตอร์
{const _st=skTick;skTick=function(dt){_st(dt);try{if(!NET.on||!pvpOn8()||P.tool!=='sword'||P.at<0||(typeof isRng==='function'&&isRng()))return;const SPN=P.cmb===2;if(!(SPN?(P.at>.12&&P.at<.88):(P.at>.2&&P.at<.7)))return;
  const ax=SPN?P.x:P.x+DIRV[P.dir][0]*26,ay=SPN?P.y-14:P.y-8+DIRV[P.dir][1]*26;for(const e of pvpTargets8()){if(e.sw29===atkId)continue;if(Math.hypot(e.x-ax,(e.y-10)-ay)<(SPN?50:34)+10){e.sw29=atkId;hurtE(e,SPN?1.15:1,{kb:60})}}}catch(e){}}}
// เลือด % ของคนอื่นจาก snapshot
{const _nm=netMsg;netMsg=function(d){const r=_nm(d);try{if(d.t==='snap')for(const s of d.ps){const o=NET.others.get(s.id);if(o)o.hpP=s.hpP}}catch(e){}return r}}
window.pvpHurt8=pvpHurt8;
// ---------- HUD ----------
{const st=document.createElement('style');st.textContent=`
#duel29{position:absolute;left:50%;top:6px;transform:translateX(-50%);z-index:40;display:flex;align-items:center;gap:8px;pointer-events:none;font:700 12px system-ui,"Noto Sans Thai",sans-serif;color:#fff}
#duel29 .pp{width:150px;background:rgba(10,8,18,.82);border:2px solid #5a3a8a;border-radius:10px;padding:4px 7px}#duel29 .pp.r{text-align:right;border-color:#8a2a2a}
#duel29 .hb{height:9px;border-radius:5px;background:#2a1a1a;overflow:hidden;margin-top:3px}#duel29 .hb i{display:block;height:100%;background:linear-gradient(90deg,#3aff7a,#d8ff5a);transition:width .15s}#duel29 .r .hb i{background:linear-gradient(90deg,#ff7a3a,#ff3a5a);margin-left:auto}
#duel29 .vs{font:900 20px Georgia,serif;color:#ffd84a;text-shadow:0 0 8px #ff5a2a;text-align:center;min-width:54px}#duel29 .vs small{display:block;font:700 12px system-ui;color:#fff}
#big29{position:absolute;left:0;right:0;top:34%;text-align:center;z-index:45;pointer-events:none;font:900 64px Georgia,"Noto Sans Thai",serif;text-shadow:0 0 18px currentColor,0 4px 0 #000;animation:pop29 .9s ease-out forwards}
@keyframes pop29{0%{transform:scale(2.2);opacity:0}25%{transform:scale(1);opacity:1}80%{opacity:1}100%{opacity:0;transform:scale(.9)}}
#dend29{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:46;min-width:260px;text-align:center;background:linear-gradient(180deg,#2a1a3a,#120e1c);border:3px solid #ffd84a;border-radius:18px;padding:14px 18px;color:#fff;box-shadow:0 0 30px rgba(255,200,80,.5);font-family:system-ui,"Noto Sans Thai",sans-serif}
#dend29 b{display:block;font:900 34px Georgia,"Noto Sans Thai",serif;margin-bottom:4px}#dend29 small{display:block;opacity:.85;margin:3px 0}#dend29 .rt{font-size:20px;font-weight:900;margin:6px 0}
#dinv29{position:absolute;left:50%;top:60px;transform:translateX(-50%);z-index:47;background:rgba(20,12,28,.95);border:2px solid #ff7a4a;border-radius:14px;padding:10px 14px;color:#fff;text-align:center;box-shadow:0 0 22px rgba(255,120,60,.5);font-family:system-ui,"Noto Sans Thai",sans-serif;animation:pop29b .3s}
#dinv29 b{display:block;font-size:15px}#dinv29 small{display:block;opacity:.8;margin:2px 0 8px}#dinv29 button{margin:0 4px;padding:6px 14px;border-radius:10px;border:0;font-weight:800;font-size:14px}#dinv29 .y{background:#3aa84a;color:#fff}#dinv29 .n{background:#6a2a2a;color:#fff}
@keyframes pop29b{from{transform:translateX(-50%) scale(.6);opacity:0}}
#arsb29{position:absolute;right:6px;top:120px;z-index:38;pointer-events:none;background:rgba(10,8,18,.72);border:1px solid rgba(255,120,80,.6);border-radius:10px;padding:5px 8px;color:#fff;font:700 11px system-ui,"Noto Sans Thai",sans-serif;min-width:130px}
#arsb29 .h{color:#ffb46a;margin-bottom:2px}#arsb29 .r{display:flex;justify-content:space-between;gap:8px}#arsb29 .r.me{color:#ffd84a}
#feed29{position:absolute;right:6px;top:250px;z-index:38;pointer-events:none;font:700 11px system-ui,"Noto Sans Thai",sans-serif;color:#fff;text-align:right}#feed29 div{background:rgba(10,8,18,.6);border-radius:6px;padding:2px 6px;margin-top:2px}
.p6w .bd.pv29{display:block!important;overflow-y:auto;text-align:left}.pv29 .rk{display:flex;align-items:center;gap:12px;padding:10px;border-radius:12px;background:linear-gradient(90deg,rgba(255,120,60,.18),rgba(255,255,255,.03));border:1px solid rgba(255,150,90,.5)}
.pv29 .rk .bd{font-size:40px}.pv29 .rk b{font-size:16px}.pv29 .tabs{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0}.pv29 .tabs button{flex:1 1 30%;padding:7px 4px;border-radius:9px;border:1px solid rgba(255,255,255,.18);background:#2a2236;color:#fff;font-weight:800;font-size:12px}.pv29 .tabs button.on{background:#a84a2a}
.pv29 .row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 8px;border-radius:9px;background:rgba(255,255,255,.05);margin:4px 0}.pv29 .row small{opacity:.75}
`;document.head.appendChild(st)}
const hudD29=document.createElement('div');hudD29.id='duel29';hudD29.hidden=true;gid('wrap').appendChild(hudD29);
const sb29=document.createElement('div');sb29.id='arsb29';sb29.hidden=true;gid('wrap').appendChild(sb29);
const fd29=document.createElement('div');fd29.id='feed29';gid('wrap').appendChild(fd29);
function big29(txt,col){const o=document.getElementById('big29');if(o)o.remove();const e=document.createElement('div');e.id='big29';e.style.color=col||'#ffd84a';e.textContent=txt;gid('wrap').appendChild(e);setTimeout(()=>{try{e.remove()}catch(_){}},1000)}
function feed29(t){PV29.feed.push({t,at:performance.now()});if(PV29.feed.length>5)PV29.feed.shift()}
const esc29=s=>String(s==null?'':s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
setInterval(()=>{try{const n=performance.now();
  const du=PV29.duel;if(du&&D&&D.duel29===du.did){const o=NET.others.get(du.opp.id),op=o?Math.max(0,Math.min(100,o.hpP==null?100:o.hpP)):100,mp=Math.max(0,P.hp/BAL.hp*100);
   const left=du.st==='fight'?Math.max(0,Math.ceil((du.end-n)/1000)):du.st==='count'?'':'';
   hudD29.innerHTML='<div class="pp"><span>'+esc29(P.name)+' <small>Lv.'+P.lv+'</small></span><div class="hb"><i style="width:'+mp.toFixed(0)+'%"></i></div></div><div class="vs">VS<small>'+(left!==''?left+' วิ':'')+'</small></div><div class="pp r"><span><small>Lv.'+du.opp.lv+'</small> '+esc29(du.opp.name)+'</span><div class="hb"><i style="width:'+op.toFixed(0)+'%"></i></div></div>';hudD29.hidden=false;
   if(du.st==='count'){const s=Math.ceil((du.fight-n)/1000);if(s!==du.cs&&s>0&&s<=3){du.cs=s;big29(String(s),'#ffd84a');sfx('ui')}}}
  else hudD29.hidden=true;
  if(inArena8()&&!(D&&D.duel29)){sb29.hidden=false;sb29.innerHTML='<div class="h">🏟️ สนามประลอง · คิล</div>'+(PV29.sb.length?PV29.sb.map((r,i)=>'<div class="r'+(r.id===NET.id?' me':'')+'"><span>'+(i+1)+'. '+esc29(r.n)+(r.s>=3?' 🔥'+r.s:'')+'</span><span>'+r.k+'/'+r.d+'</span></div>').join(''):'<div class="r"><span>ยังไม่มีใครล้มใคร</span></div>')}else sb29.hidden=true;
  PV29.feed=PV29.feed.filter(f=>n-f.at<7000);fd29.innerHTML=PV29.feed.map(f=>'<div>'+f.t+'</div>').join('');
  // เก็บลูกพลัง
  if(inArena8()&&!(D&&D.duel29)&&PV29.orbs.length)for(const o of PV29.orbs){if(Math.hypot(o.x-P.x,o.y-P.y)<46&&n-(PV29.orbReq[o.id]||0)>800){PV29.orbReq[o.id]=n;netSend({t:'aorbtake',id:o.id})}}
 }catch(e){}},100);
// วาดลูกพลังในสนาม
const ORB29={heal:['❤️','255,90,110','ฟื้นเลือด 40%'],power:['⚔️','255,200,60','ดาเมจ +30% 10 วิ'],haste:['⚡','120,220,255','เร็วขึ้น 35% 10 วิ']};
{const _da=drawAir;drawAir=function(){_da.apply(this,arguments);try{if(!inArena8()||(D&&D.duel29)||!PV29.orbs.length)return;const t=performance.now()/1000;for(const o of PV29.orbs){const O=ORB29[o.k]||ORB29.heal,b=Math.sin(t*3+o.id)*4;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(o.x,o.y-18+b,2,o.x,o.y-18+b,26);g.addColorStop(0,'rgba('+O[1]+',.9)');g.addColorStop(1,'rgba('+O[1]+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(o.x,o.y-18+b,26,0,7);ctx.fill();ctx.restore();
  ctx.save();ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(o.x,o.y,12,4,0,0,7);ctx.fill();ctx.font='18px "Noto Color Emoji","Apple Color Emoji",sans-serif';ctx.textAlign='center';ctx.fillText(O[0],o.x,o.y-11+b);ctx.restore()}}catch(e){}}}
// ---------- ข้อความจากเซิร์ฟเวอร์ ----------
{const _nm=netMsg;netMsg=function(d){try{switch(d.t){
  case 'duelinv':{if(!okPlace29()||(D&&D.duel29)||P.dead){netSend({t:'duelans',from:d.from,ok:false});return}PV29.inv=d;showInv29(d);sfx('swing2');return}
  case 'duelgo':{PV29.inv=null;try{document.getElementById('dinv29').remove()}catch(e){}const n=performance.now();PV29.duel={did:d.did,side:d.side,opp:d.opp,st:'count',fight:n+(d.count||3000),end:n+(d.count||3000)+(d.dur||90000)};try{p6close(pvW29)}catch(e){}enterDuel29(d);return}
  case 'duelfight':{const du=PV29.duel;if(du&&du.did===d.did){du.st='fight';du.end=performance.now()+(d.end||90000);big29('⚔️ FIGHT!','#ff7a3a');sfx('swing2');shake(3,.2)}return}
  case 'duelend':{const du=PV29.duel;if(du)du.st='end';showEnd29(d);return}
  case 'pvpme':{PV29.me=d.me;PV29.acct=d.acct;PV29.ranks=d.ranks;if(d.me){ST20.pvbest=Math.max(ST20.pvbest|0,d.me.best|0);st29()}pvRender29();return}
  case 'pvptop':{PV29.top=d.list||[];pvRender29();return}
  case 'arsb':{PV29.sb=d.list||[];return}
  case 'aorb':{PV29.orbs=d.orbs||[];return}
  case 'aorbgot':{PV29.orbs=PV29.orbs.filter(o=>o.id!==d.id);const O=ORB29[d.k]||ORB29.heal;feed29(esc29(d.name)+' เก็บ '+O[0]);
   if(d.by===NET.id){const n=performance.now();if(d.k==='heal'){P.hp=Math.min(BAL.hp,P.hp+BAL.hp*.4);vfx('heal',P.x,P.y,.6)}else if(d.k==='power')PV29.pow=n+10000;else PV29.haste=n+10000;say(O[0]+' '+O[2]);sfx('heal');flash('rgb('+O[1]+')',.25)}return}
  case 'akill':{feed29('⚔️ '+esc29(d.by)+' ➜ '+esc29(d.v)+(d.s>=3?' 🔥'+d.s:'')+(d.shut?' 🛑':''));if(d.by===P.name){if(d.s>=3)big29(d.s>=8?'👑 '+d.s+' KILLS!':d.s>=5?'💀 '+d.s+' KILLS!':'🔥 '+d.s+' KILLS!','#ff7a3a');ST20.ast=Math.max(ST20.ast|0,d.s|0);st29()}return}
  case 'honor':{ST20.honor=(ST20.honor|0)+(d.n|0);st29();feed29('🎖️ +'+d.n+' เกียรติยศ · '+esc29(d.why||''));return}
  case 'who':{if(PV29.wantWho&&performance.now()-PV29.wantWho<4000){PV29.wantWho=0;PV29.who=d.list||[];pvRender29();return}break}
 }}catch(e){console.warn('[pvp29]',e)}return _nm(d)}}
function showInv29(d){let e=document.getElementById('dinv29');if(e)e.remove();e=document.createElement('div');e.id='dinv29';const C=CLS[d.cls]||{e:'🧑',n:''};
 e.innerHTML='<b>⚔️ '+esc29(d.name)+' ท้าดวลคุณ!</b><small>'+C.e+' '+C.n+' Lv.'+(d.lv|0)+(d.pr?' · '+d.pr.rank+' '+d.pr.r:'')+' · 20 วิ</small><button class="y">✅ รับคำท้า</button><button class="n">❌ ปฏิเสธ</button>';
 e.querySelector('.y').onclick=()=>{e.remove();if(!okPlace29()){say('รับคำท้าได้เฉพาะในเมือง/ทุ่งหญ้า/สนามประลอง');netSend({t:'duelans',from:d.from,ok:false});return}netSend({t:'duelans',from:d.from,ok:true})};
 e.querySelector('.n').onclick=()=>{e.remove();netSend({t:'duelans',from:d.from,ok:false})};gid('wrap').appendChild(e);setTimeout(()=>{try{e.remove()}catch(_){}},20000)}
function showEnd29(d){let e=document.getElementById('dend29');if(e)e.remove();e=document.createElement('div');e.id='dend29';
 const hn=d.honor|0;if(hn){ST20.honor=(ST20.honor|0)+hn}if(d.win)ST20.dw=(ST20.dw|0)+1;if(d.me)ST20.pvbest=Math.max(ST20.pvbest|0,d.me.best|0);st29();try{ttlCheck20()}catch(_){}
 const why={ko:'น็อกเอาต์',time:'หมดเวลา — เลือดเหลือมากกว่า',quit:'คู่ต่อสู้ยอมแพ้',leave:'คู่ต่อสู้ออกจากสังเวียน'}[d.why]||'';
 e.innerHTML='<b style="color:'+(d.draw?'#9fd8ff':d.win?'#ffd84a':'#ff6a6a')+'">'+(d.draw?'🤝 เสมอ':d.win?'🏆 ชนะ!':'💀 แพ้')+'</b><small>vs '+esc29(d.opp)+' · '+why+'</small>'+(d.ranked&&d.me?'<div class="rt" style="color:'+(d.dr>=0?'#8fe08a':'#ff8a8a')+'">'+d.me.rank+' '+d.me.r+' ('+(d.dr>=0?'+':'')+d.dr+')</div>':'<small>'+(PV29.acct?'ดวลคู่เดิมซ้ำใน 10 นาที — ไม่คิดเรต':'ดวลไม่จัดอันดับ (ล็อกอินบัญชีออนไลน์ทั้งคู่จึงจะคิดเรต)')+'</small>')+(hn?'<small>🎖️ +'+hn+' เกียรติยศ</small>':'')+'<small style="opacity:.6">กลับใน 5 วิ…</small>';
 gid('wrap').appendChild(e);sfx(d.win?'chest':'thud');if(d.win){flash('#ffd84a',.3);for(let i=0;i<30;i++){const a=Math.random()*6.28;fx.push({x:P.x+Math.cos(a)*20,y:P.y-20,vx:Math.cos(a)*150,vy:Math.sin(a)*150-60,l:.9,c:'#ffd84a'})}}
 setTimeout(()=>{try{e.remove()}catch(_){}PV29.duel=null;leaveDuel29()},5000)}
// ---------- เมนู PvP ----------
const pvW29=mk6('pvp29');
const SHOP29=[['estone',5,40,'💠 หินตีบวก ×5'],['ess',10,50,'🔹 เศษแก่นเวท ×10'],['bless',1,90,'✨ หินพร ×1'],['ttl',0,300,'🔥 ฉายา "กระหายสงคราม"']];
function pvBuy29(i){const it=SHOP29[i];if(!it)return;if((ST20.honor|0)<it[2]){say('🎖️ เกียรติยศไม่พอ (ต้องใช้ '+it[2]+')');sfx('thud');return}
 if(it[0]==='ttl'){if(ST20.pvbuy){say('มีฉายานี้แล้ว');return}ST20.pvbuy=1}else inv[it[0]]=(inv[it[0]]|0)+it[1];ST20.honor-=it[2];st29();try{ttlCheck20();refreshInv();saveGame(true)}catch(e){}sfx('chest');say('🛒 แลก '+it[3]+' แล้ว');pvRender29()}
function pvTab29(t){PV29.tab=t;sfx('ui');if(t==='duel'){PV29.wantWho=performance.now();netSend({t:'who'})}if(t==='top')netSend({t:'pvptop'});pvRender29()}
function pvDuel29(name){if(!NET.on){say('ต้องเชื่อมต่อออนไลน์ก่อน');return}if(!okPlace29()){say('ท้าดวลได้จากเมือง/ทุ่งหญ้า/สนามประลอง');return}netSend({t:'duel',to:name});sfx('swing2')}
window.pvTab29=pvTab29;window.pvDuel29=pvDuel29;window.pvBuy29=pvBuy29;
function pvRender29(){if(pvW29.hidden)return;const me=PV29.me,on=pvpOn8(),ar=inArena8()&&!(D&&D.duel29);
 let h='<div class="w"><div class="hd"><b>⚔️ PvP · สังเวียนเอลโดเรีย</b><button onclick="p6close(pvW29)">✕</button></div><div class="bd pv29">';
 h+='<div class="rk"><div class="bd">'+(me?me.rank.split(' ')[0]:'🎖️')+'</div><div><b>'+(me?me.rank.split(' ').slice(1).join(' ')+' · '+me.r:(NET.on?(PV29.acct?'ยังไม่เคยดวลแรงก์':'ไม่จัดอันดับ (ยังไม่ล็อกอิน)'):'ยังไม่ได้เชื่อมต่อออนไลน์'))+'</b><small style="display:block;opacity:.8">'+(me?'ชนะ '+me.w+' · แพ้ '+me.l+' · เสมอ '+me.d+' · สูงสุด '+me.best:'ล็อกอินบัญชีออนไลน์เพื่อเก็บเรตติ้ง')+'</small><small style="display:block;color:#ffd84a">🎖️ เกียรติยศ '+(ST20.honor|0)+' · ชนะดวล '+(ST20.dw|0)+' · สตรีคสูงสุด '+(ST20.ast|0)+'</small></div></div>';
 h+='<div class="tabs">'+[['home','🏠 หลัก'],['duel','⚔️ ท้าดวล'],['top','🏆 อันดับ'],['shop','🛒 ร้านเกียรติยศ'],['rule','📜 กติกา']].map(([k,n])=>'<button class="'+(PV29.tab===k?'on':'')+'" onclick="pvTab29(\''+k+'\')">'+n+'</button>').join('')+'</div>';
 if(PV29.tab==='home'){h+='<div class="row"><div><b>🏟️ สนามประลอง (ทุกคนสู้ทุกคน)</b><br><small>เก็บคิล · สตรีค · ล่าค่าหัว · ลูกพลัง ❤️⚔️⚡</small></div>'+(ar?'<button class="bt" onclick="leaveArena8();p6close(pvW29)">ออก</button>':'<button class="bt ok" onclick="enterArena8();p6close(pvW29)">เข้า</button>')+'</div>';
  h+='<div class="row"><div><b>🌍 PvP โลกเปิด</b><br><small>นอกเมือง สู้กับคนที่เปิด PvP เหมือนกัน · ตอนนี้ '+(on?'⚔️ เปิด':'🛡️ ปิด')+'</small></div><button class="bt" onclick="togglePvp8();pvRender29()">'+(PVP8.on?'ปิด':'เปิด')+'</button></div>';
  h+='<div class="row"><div><b>⚔️ ท้าดวล 1v1 (แรงก์)</b><br><small>นับถอยหลัง 3 วิ · 90 วิ · ชนะได้เรต + 🎖️</small></div><button class="bt ok" onclick="pvTab29(\'duel\')">เลือกคู่ต่อสู้</button></div>'}
 else if(PV29.tab==='duel'){if(!NET.on)h+='<small>ต้องเชื่อมต่อออนไลน์ก่อน</small>';else if(!PV29.who)h+='<small>กำลังโหลดรายชื่อ…</small>';else{const L=PV29.who.filter(p=>p.name!==P.name);h+=L.length?L.map(p=>{const C=CLS[p.cls]||{e:'🧑'};return '<div class="row"><div><b>'+C.e+' '+esc29(p.name)+'</b> <small>Lv.'+p.lv+' · '+SCN8(p.sc)+'</small></div><button class="bt ok" onclick="pvDuel29(\''+esc29(p.name).replace(/'/g,'')+'\')">⚔️ ท้า</button></div>'}).join(''):'<small>ยังไม่มีผู้เล่นคนอื่นออนไลน์</small>';h+='<small style="opacity:.6">หรือพิมพ์ในแชท: /duel ชื่อ</small>'}}
 else if(PV29.tab==='top'){const L=PV29.top;h+=!L?'<small>กำลังโหลด…</small>':L.length?L.map((x,i)=>'<div class="row"><div><b>'+(i<3?['🥇','🥈','🥉'][i]:(i+1)+'.')+' '+esc29(x.n)+'</b> <small>'+((CLS[x.cls]||{}).e||'')+' Lv.'+x.lv+'</small></div><div style="text-align:right"><b>'+x.r+'</b><br><small>'+x.rank+' · '+x.w+'W '+x.l+'L</small></div></div>').join(''):'<small>ยังไม่มีการดวลแรงก์</small>'}
 else if(PV29.tab==='shop'){h+=SHOP29.map((it,i)=>'<div class="row"><div><b>'+it[3]+'</b><br><small>🎖️ '+it[2]+'</small></div><button class="bt'+((ST20.honor|0)>=it[2]&&!(it[0]==='ttl'&&ST20.pvbuy)?' ok':'')+'" onclick="pvBuy29('+i+')">'+(it[0]==='ttl'&&ST20.pvbuy?'มีแล้ว':'แลก')+'</button></div>').join('')+'<small style="opacity:.7">ได้เกียรติยศจาก: ชนะดวล +12 · แพ้ +4 · เสมอ +5 · ล้มคนในสนาม +2 · ล่าค่าหัวคนที่มีสตรีค +4~8</small>'}
 else h+='<div class="row"><small>• ดาเมจในการต่อสู้ระหว่างผู้เล่นถูกปรับให้สมดุล: เลือดหนาขึ้น และดาเมจต่อครั้งไม่เกิน 18% ของเลือดสูงสุด (ไม่มีใครโดนตีทีเดียวตาย)<br>• ดวล: นับถอยหลัง 3 วิ → สู้ 90 วิ · น็อกได้ชนะทันที · หมดเวลาใครเลือด % มากกว่าชนะ · หนีออก = แพ้<br>• ดวลแรงก์คิดเรต ELO (เริ่ม 1000) — ดวลคู่เดิมซ้ำภายใน 10 นาทีไม่คิดเรต<br>• แรงก์: 🥉บรอนซ์ · 🥈ซิลเวอร์ 1100 · 🥇โกลด์ 1250 · 💠แพลทินัม 1400 · 💎ไดมอนด์ 1550 · 👑มาสเตอร์ 1700 · 🔥ตำนาน 1900<br>• สนามประลอง: ล้มติดกัน 3/5/8 คนประกาศทั้งเซิร์ฟ · ล้มคนที่มีสตรีคได้ค่าหัว · ลูกพลังเกิดทุก 20 วิ<br>• แพ้ไม่เสียของ/XP</small></div>';
 pvW29.innerHTML=h+'</div></div>'}
openPvp8=function(){p6open(pvW29);PV29.tab='home';pvRender29();if(NET.on)netSend({t:'pvpme'})};window.openPvp8=openPvp8;window.pvW29=pvW29;
// คำสั่งแชท /duel ชื่อ · /ff (ยอมแพ้ดวล)
{const _cs=chatSend;chatSend=function(){const ti=gid('chatTi'),t=(ti&&ti.value||'').trim();let m;
 if((m=/^\/(duel|ดวล)\s+(\S+)$/i.exec(t))){ti.value='';pvDuel29(m[2]);return}
 if(/^\/(ff|ยอมแพ้)$/i.test(t)){ti.value='';if(PV29.duel){netSend({t:'duelquit'})}return}
 return _cs()}}
// ฉายา PvP
for(const t of [['pv_duel10','⚔️ นักดวล','#ff8a6a','ชนะดวล 10 ครั้ง',()=>(ST20.dw|0)>=10,'epic'],['pv_streak5','💀 ไร้เทียมทาน','#ff5a5a','ล้มติดกัน 5 คนในสนามประลอง',()=>(ST20.ast|0)>=5,'epic'],
 ['pv_master','👑 ราชันย์สังเวียน','#ffd23a','เรตติ้ง PvP ถึง 1700 (มาสเตอร์)',()=>(ST20.pvbest|0)>=1700,'leg'],['pv_buy','🔥 กระหายสงคราม','#ff7a3a','แลกด้วยเกียรติยศ 300 ที่ร้านเกียรติยศ',()=>!!ST20.pvbuy,'epic']]){TTL20.push(t.slice(0,5));TTLMAP20[t[0]]=TTL20[TTL20.length-1];try{TIER23[t[0]]=t[5]}catch(e){}}

// =====================================================================
