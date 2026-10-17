// fix8.js (v4.17) — 🗼 หอคอยบอส 12 ชั้น + 🔥 โหมดยาก
// =====================================================================
const TW10={MAXF:12,LIM:300,Zm:{},st:null};
TW10.load=()=>{try{return JSON.parse(localStorage.getItem('fm_tower10')||'{}')||{}}catch(e){return {}}};
TW10.save=d=>{try{localStorage.setItem('fm_tower10',JSON.stringify(d))}catch(e){}};
TW10.data=TW10.load();if(!TW10.data.max)TW10.data.max=0;if(!TW10.data.clr)TW10.data.clr={};
TW10.lvOf=f=>Math.min(110,22+f*7);
TW10.needLv=f=>Math.max(20,TW10.lvOf(f)-12);
TW10.PAL=[['#2a2438','#3a3150','#8a6aff'],['#2a1a1a','#3a2626','#ff5a3a'],['#14262a','#1e383e','#4affd8'],['#2a2614','#3e381e','#ffd84a']];
TW10.boss=f=>{let B;try{B=dgBossOf7(f*8+2)}catch(e){B=null}if(!B||!FAM[B.f])B={f:'golem',n:'โกเลม',c:'#8a8a9a'};
  const T=['ผู้เฝ้าประตู','อัศวินเงา','ราชันย์โลหิต','เทพอสุรา','จักรพรรดิมรณะ','มหาทรราช'][Math.min(5,(f-1)>>1)];
  return {f:B.f,n:T+' '+String(B.n).replace(/ ชั้น \d+/,'')+' (ชั้น '+f+')',c:B.c,lv:TW10.lvOf(f)}};
function buildTower10(f){if(TW10.Zm[f])return TW10.Zm[f];const W=30,H=24,m=[],[c1,c2,cg]=TW10.PAL[(f-1)%4];
 for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++){const dx=(x-W/2+.5)/(W/2-1),dy=(y-H/2+.5)/(H/2-1);m[y][x]=(dx*dx+dy*dy>1)?WL:FL}}
 for(const [x,y] of [[8,7],[21,7],[8,16],[21,16]])m[y][x]=WL;
 for(let y=H-3;y<H;y++)for(let x=W/2-1;x<=W/2;x++)m[y][x]=FL;for(let x=0;x<W;x++)m[H-1][x]=WL;
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=y*T,h=hash(x*1.7,y*2.3);
  if(m[y][x]===WL){k.fillStyle='#0c0a12';k.fillRect(px,py,T,T);k.fillStyle=c2;k.fillRect(px+2,py+2,T-4,T-8);k.fillStyle='rgba(0,0,0,.4)';k.fillRect(px,py+T-6,T,6)}
  else{k.fillStyle=(x+y)%2?c1:c2;k.fillRect(px,py,T,T);k.strokeStyle='rgba(0,0,0,.25)';k.strokeRect(px+.5,py+.5,T-1,T-1);if(h>.86){k.fillStyle='rgba(255,255,255,.05)';k.fillRect(px+6,py+10,10,3)}}}
 const cx=W*T/2,cy=H*T/2;k.save();k.strokeStyle=cg;k.globalAlpha=.55;k.lineWidth=3;for(const r of [.32,.22]){k.beginPath();k.arc(cx,cy,W*T*r*.6,0,7);k.stroke()}
 k.beginPath();for(let i=0;i<=5;i++){const a=-Math.PI/2+i*Math.PI*4/5,R=W*T*.19;i?k.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R):k.moveTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R)}k.stroke();k.restore();
 for(const [x,y] of [[8,7],[21,7],[8,16],[21,16]]){const px=x*T+16,py=y*T+16;k.fillStyle='#1a1624';k.fillRect(px-7,py-34,14,44);k.fillStyle=cg;k.beginPath();k.arc(px,py-38,5,0,7);k.fill()}
 k.font='900 20px Georgia,serif';k.textAlign='center';k.fillStyle='rgba(255,255,255,.25)';k.fillText('🗼 ชั้น '+f,cx,T*2.4);
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 return TW10.Zm[f]={zi:500+f,name:'tower'+f,Zd:{id:'tower',n:'หอคอยบอส ชั้น '+f,e:'🗼',lv:[TW10.lvOf(f),TW10.lvOf(f)],dark:1,amb:'dust',pal:{vd:'#0c0a12'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt'},
  m,ores:[],oreAt:{},floor,ent:{x:W/2,y:H-3},arena:{x:W/2,y:Math.floor(H/2)-1},seen:new Uint8Array(W*H).fill(1),W,H,cv:c}}
const inTower10=()=>!!(D&&D.tower10);window.inTower10=inTower10;
function enterTower10(f){return Guard.run('enterTower',()=>{f=Math.max(1,Math.min(TW10.MAXF,f|0));
  if(D&&(D.zone||D.shop)&&!inTower10()){say('เข้าหอคอยได้จากเมืองหรือทุ่งหญ้า');sfx('thud');return}
  if(f>TW10.data.max+1){say('🔒 ต้องผ่านชั้น '+(f-1)+' ก่อน');sfx('thud');return}
  if(P.lv<TW10.needLv(f)){say('🔒 ชั้น '+f+' ต้อง Lv.'+TW10.needLv(f)+' ขึ้นไป');sfx('thud');return}
  const Zm=buildTower10(f);
  LoadingScreenManager.cover({icon:'🗼',title:'หอคอยบอส ชั้น '+f,tip:'บอสเลือดสูงมาก · มีเวลา 5 นาที · ตายแล้วออกจากหอคอย'},()=>{
   if(D&&D.town){try{exitD()}catch(e){}}if(inTower10()){}
   try{closeZMenu()}catch(e){}ZW=Zm.W;ZH=Zm.H;sfx('warp');setScene('cave');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;
   D={zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret:[ZG.x,ZG.y+40],ban:0,tower10:f,t0:performance.now(),sumT:14,won:0};dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,4);
   P.x=Zm.ent.x*T;P.y=(Zm.ent.y-1)*T+16;P.dir='u';P.kx=P.ky=0;MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}
   const B=TW10.boss(f);const b=mkMob(B.f,B.n,B.c,B.lv,Zm.arena.x*T,Zm.arena.y*T+16,{boss:1});
   const k=2+f*.35,ka=1+f*.04;b.hp=b.max=Math.round(b.hp*k);b.atk=Math.round(b.atk*ka);b.tower10=1;b.phase=0;b.sk=3;b.sc*=1.15;
   D.boss=b;D.bossT=1e9;D.mobs.push(b)});
  setTimeout(()=>{try{sysSay('🗼 หอคอยชั้น '+f+' — ปราบ '+TW10.boss(f).n+' ภายใน 5 นาที!')}catch(e){}},900)})}
function leaveTower10(){if(!inTower10())return;LoadingScreenManager.cover({icon:'🏰',title:'ออกจากหอคอย'},()=>{exitD();enterTown(1)})}
window.enterTower10=enterTower10;window.leaveTower10=leaveTower10;
{const _ns=netScene;netScene=function(){if(D&&D.tower10)return 'tower'+D.tower10;return _ns()}}
// ของรางวัล
TW10.reward=function(f,first){const R=[],add=(k,n,lab)=>{n=Math.round(n);if(n<=0)return;inv[k]=(inv[k]|0)+n;R.push(lab+' ×'+n)};
 const m=first?1:.3;add('coin',(first?3000:900)*f,'🪙');add('estone',(3+f)*(first?1:.5),'💠 หินตีบวก');add('bless',(first?2:0)+Math.floor(f/3)*(first?1:Math.random()<.4?1:0),'✨ หินพร');
 add(MATKEY[Math.min(5,f>>1)],(3+f/2)*m+1,'🧱 '+MATN[Math.min(5,f>>1)]);if(f>=6)add('gem',(f-4)*m+1,'💎 อัญมณี');add('hpp',3+f,'❤️ ยาเลือด');
 try{const x=Math.round(need(P.lv)*(first?.35:.12));gainXp(x);R.push('⭐ XP +'+x)}catch(e){}
 try{refreshInv();saveGame(true)}catch(e){}return R};
{const _mk=mobKill;mobKill=function(m){if(!(D&&D.tower10&&m.tower10))return _mk(m);
  const f=D.tower10;D.boss=null;D.bossT=1e9;_mk(m);D.boss=null;D.bossT=1e9;if(D.won)return;D.won=1;
  for(const q of D.mobs)if(!q.dead&&q!==m){q.dead=true}D.mobs=D.mobs.filter(q=>!q.dead||q===m);
  const sec=Math.round(D.el||0),first=!TW10.data.clr[f];TW10.data.clr[f]=TW10.data.clr[f]&&TW10.data.clr[f]<sec?TW10.data.clr[f]:sec;if(f>TW10.data.max)TW10.data.max=f;TW10.save(TW10.data);
  const R=TW10.reward(f,first);flash('#ffd84a',.4);sfx('chest');
  try{sysSay('🏆 พิชิตหอคอยชั้น '+f+' ใน '+sec+' วินาที'+(first?' (ครั้งแรก!)':''))}catch(e){}
  try{if(NET.on)netSend({t:'chat',ch:'gen',txt:'🗼 พิชิตหอคอยชั้น '+f+' ใน '+sec+' วิ!'})}catch(e){}
  setTimeout(()=>{try{talk({name:'วิญญาณผู้เฝ้าหอคอย',c:'#8a6aff'},'🏆 พิชิตชั้น '+f+' แล้ว'+(first?' — รางวัลพิชิตครั้งแรก!':'')+'\n'+R.join(' · ')+(f>=TW10.MAXF?'\n👑 เจ้าคือผู้พิชิตหอคอยทั้ง 12 ชั้น!':''),
   (f<TW10.MAXF?[{t:'⬆️ ขึ้นชั้น '+(f+1),c:'go',f:()=>enterTower10(f+1)}]:[]).concat([{t:'🔁 สู้ชั้นนี้อีกครั้ง',f:()=>enterTower10(f)},{t:'🏰 ออกจากหอคอย',f:()=>leaveTower10()},BYE]),'🗼 หอคอย')}catch(e){}},1600)}}
// บอสหอคอย: เรียกลูกน้อง + จับเวลา
setInterval(()=>{try{if(!inTower10()||P.dead)return;if(!PAUSED&&D.won<=0)D.el=(D.el||0)+.5;if(PAUSED)return;const b=D.boss;
  const left=TW10.LIM-(D.el||0);
  if(!D.won&&left<=0){D.won=-1;say('⌛ หมดเวลา! ถูกพลังหอคอยผลักออกมา');sfx('thud');leaveTower10();return}
  if(b&&!b.dead&&b.aggro){D.sumT-=.5;if(D.sumT<=0){const f=D.tower10;D.sumT=Math.max(7,15-f*.6)*(b.hp/b.max<.3?.6:1);
   const n=1+(f>=5)+(f>=9);for(let i=0;i<n;i++){const a=Math.random()*6.28,x=b.x+Math.cos(a)*60,y=b.y+Math.sin(a)*40;if(zHit(x,y))continue;const q=mkMob(b.f,'สมุนหอคอย',b.col,Math.max(1,b.L-8),x,y,{elite:f>=8});q.aggro=1;D.mobs.push(q)}
   try{dmgTxt(b.x,b.y-60*b.sc,'📣 เรียกสมุน!','#ff9a5a',true)}catch(e){}}}
 }catch(e){}},500);
const tw10hud=document.createElement('div');tw10hud.id='tw10hud';tw10hud.style.cssText='position:absolute;left:50%;top:calc(66px + var(--st,0px));transform:translateX(-50%);z-index:5;font:900 11px system-ui,"Noto Sans Thai";color:#fff;background:rgba(30,20,50,.85);border:1.5px solid #8a6aff;border-radius:10px;padding:3px 10px;pointer-events:none;display:none;text-align:center;min-width:120px';gid('wrap').appendChild(tw10hud);
setInterval(()=>{try{if(!inTower10()){tw10hud.style.display='none';return}tw10hud.style.display='';const b=D.boss,left=Math.max(0,TW10.LIM-(D.el||0));
  const hp=b&&!b.dead?Math.max(0,b.hp/b.max):0;tw10hud.innerHTML='🗼 ชั้น '+D.tower10+' · ⌛ '+Math.floor(left/60)+':'+String(Math.floor(left%60)).padStart(2,'0')+(D.won>0?' · ✅ ผ่าน':'')}catch(e){}},250);
function openTower10(){const d=TW10.data,nx=Math.min(TW10.MAXF,d.max+1);
 if(inTower10()){talk({name:'วิญญาณผู้เฝ้าหอคอย',c:'#8a6aff'},'ยอมแพ้แล้วหรือ? ออกตอนนี้จะไม่ได้รางวัลของชั้นนี้',[{t:'🏰 ออกจากหอคอย',c:'go',f:()=>leaveTower10()},BYE],'🗼 หอคอย');return}
 let txt='🗼 หอคอยบอส — ทุกชั้นมีบอสเลือดสูงมากหนึ่งตัว เรียกสมุนได้ · เวลา 5 นาที · ตาย = ออกจากหอคอย\nผ่านแล้ว '+d.max+'/'+TW10.MAXF+' ชั้น · ชั้นถัดไป: '+nx+' (ต้อง Lv.'+TW10.needLv(nx)+')';
 const best=Object.keys(d.clr).sort((a,b)=>a-b).slice(-3).map(f=>'ชั้น '+f+': '+d.clr[f]+' วิ').join(' · ');if(best)txt+='\nสถิติ: '+best;
 const ch=[];if(d.max<TW10.MAXF)ch.push({t:'⚔️ ท้าชั้น '+nx,c:'go',f:()=>enterTower10(nx)});
 if(d.max>0)ch.push({t:'🔁 เลือกชั้นที่ผ่านแล้ว',stay:true,f:()=>talk({name:'วิญญาณผู้เฝ้าหอคอย',c:'#8a6aff'},'เลือกชั้น (ซ้ำได้ รางวัลลดลง)',Array.from({length:d.max},(_,i)=>({t:'ชั้น '+(i+1),f:()=>enterTower10(i+1)})).slice(-8).concat([BYE]),'🗼 หอคอย')});
 ch.push(BYE);
 talk({name:'วิญญาณผู้เฝ้าหอคอย',c:'#8a6aff'},txt,ch,'🗼 หอคอย')}
window.openTower10=openTower10;

// ---------- 🔥 เกมออนไลน์ = โหมดยากสำหรับทุกคน (ไม่มีปุ่มเปิด/ปิด) ----------
const HARD10={on:true};window.HARD10=HARD10;try{localStorage.removeItem('fm_hard10')}catch(e){}
{const _ms=mobStats;mobStats=function(L,f,elite,boss){const s=_ms(L,f,elite,boss);if(!(D&&(D.tower10||D.wb10))){s.hp=Math.round(s.hp*1.7);s.atk=Math.round(s.atk*1.35)}return s}}
{const _mk=mobKill;mobKill=function(m){const c0=inv.coin;const r=_mk(m);try{if(!(D&&(D.tower10||D.wb10))&&inv.coin>c0){inv.coin+=Math.round((inv.coin-c0)*.3);const Zd=D&&D.zone&&D.zone.Zd;if(Zd&&Math.random()<(m.boss?1:.25))addDrop(m.boss?Zd.ing:Zd.raw,m.x,m.y);if(Math.random()<(m.boss?1:.03))addDrop('estone',m.x,m.y)}}catch(e){}return r}}
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['🗼','หอคอย',()=>openTower10()]);pmRender7()}catch(e){console.warn('[tower] pm',e)}

// =====================================================================
