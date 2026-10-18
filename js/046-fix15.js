// fix15.js (v4.23) — แมพใหม่ 3 แมพ + ประตูมิติในเหมือง (40–42) · ต้นไม้ประจำแมพ · มอนดรอปไม้/วัตถุดิบ/เครื่องมือ
// =====================================================================
OREK.treeE={n:'ต้นไม้โบราณ',req:1,hp:10,drop:'woodE',cnt:[1,3],xp:10,fx:'150,210,120',tree:1};
OREK.treeF={n:'ต้นไม้ทนไฟ',req:2,hp:13,drop:'woodF',cnt:[1,3],xp:16,fx:'255,140,60',tree:1};
OREK.treeS={n:'ต้นไม้วิญญาณ',req:3,hp:16,drop:'woodS',cnt:[1,3],xp:24,fx:'200,170,255',tree:1};
const NZ15=[
 {id:'mist',n:'ป่าหมอกโบราณ',e:'🌫️',lv:[30,50],gateIn:0,ulv:30,ores:[['treeE',.5],['iron',.2],['silver',.3]],raw:'woodE',ing:'mistc',amb:'mote',dark:0,
  pal:{fl:['#3a5a42','#36543e','#32503a'],top:'#26402c',face:'#1a2e20',edge:'#0e1a12',ac:'#9af0c8',vd:'#08120c'},
  mobs:[['wolf','หมาป่าหมอก',['#9ab8aa','#4a6a5a','#bff0e8']],['wisp','ภูตหมอก',['#d8fff4','#6ab8a0','#ffffff']],['golem','พฤกษาเฝ้าป่า',['#5a7a3a','#2a4a1a','#9aff7a']]],
  boss:{f:'golem',n:'ราชาพฤกษาโบราณ',lv:55,c:['#4a7a3a','#1e3a12','#6affd8']}},
 {id:'volcano',n:'หุบเขาภูเขาไฟ',e:'🌋',lv:[50,75],gateIn:1,ulv:50,ores:[['treeF',.45],['gold',.25],['copper',.3]],raw:'woodF',ing:'obsid',amb:'ember',dark:1,
  pal:{fl:['#3a2422','#36201e','#2e1c1a'],top:'#24140e',face:'#160a06',edge:'#0a0402',ac:'#ff7a2a',vd:'#060202'},
  mobs:[['beetle','ด้วงลาวา',['#3a2a2a','#1a0a06','#ff7a2a']],['drake','ซาลาแมนเดอร์',['#c84a1a','#5a1a08','#ffd060']],['golem','โกเลมแมกมา',['#4a3030','#1a0a08','#ff5a1a']]],
  boss:{f:'dragon',n:'มังกรภูเขาไฟ',lv:80,c:['#c8301a','#3a0a04','#ffb030']}},
 {id:'shadow',n:'ถ้ำเงามืด',e:'🕳️',lv:[80,100],gateIn:4,ulv:80,ores:[['treeS',.45],['diamond',.25],['gold',.3]],raw:'woodS',ing:'soulc',amb:'mote',dark:1,
  pal:{fl:['#1e1a2c','#1a1628','#161224'],top:'#120e1e',face:'#0a0814',edge:'#04030a',ac:'#c8a0ff',vd:'#020106'},
  mobs:[['bat','ค้างคาวเงา',['#3a2a5a','#140a24','#c8a0ff']],['wisp','วิญญาณมืด',['#8a6ad8','#2a1a5a','#e8d8ff']],['skeleton','อัศวินเงา',['#6a6a8a','#1a1a2a','#c8a0ff']]],
  boss:{f:'skeleton',n:'จ้าวแห่งเงา',lv:105,c:['#5a5a7a','#140e24','#e0b8ff']}}];
const NZI15={};for(const z of NZ15){if(!ZONES.some(q=>q.id===z.id))ZONES.push(z);NZI15[z.id]=ZONES.findIndex(q=>q.id===z.id)}
const NMAP15={unl:{}};try{Object.assign(NMAP15.unl,JSON.parse(localStorage.getItem('fm_nmap15')||'{}'))}catch(e){}
const nmapSave15=()=>{try{localStorage.setItem('fm_nmap15',JSON.stringify(NMAP15.unl))}catch(e){}};
// ---------- เมนูประตูมิติ: เหมืองต้องถึงเลเวล · แมพใหม่ต้องเปิดผ่านประตูมิติในเหมืองก่อน ----------
{const _oz=openZMenu;openZMenu=function(){_oz();try{for(const b of shopEl.querySelectorAll('button.zbtn')){const m=/enterZone\((\d+)\)/.exec(b.getAttribute('onclick')||'');if(!m)continue;const i=+m[1],z=ZONES[i];if(!z)continue;
   const nz=NZ15.find(q=>q.id===z.id);
   if(nz&&!NMAP15.unl[z.id]){b.setAttribute('onclick','say(\'🔒 เปิดผ่านประตูมิติใน '+ZONES[nz.gateIn].n+' (Lv.'+nz.ulv+')\');sfx(\'thud\')');b.style.opacity='.55';b.querySelector('b').insertAdjacentText('afterbegin','🔒 ')}
   else if(!nz&&P.lv<z.lv[0]){b.setAttribute('onclick','say(\'🔒 ต้อง Lv.'+z.lv[0]+' ก่อนจึงเข้า '+z.n+' ได้\');sfx(\'thud\')');b.style.opacity='.55';b.querySelector('b').insertAdjacentText('afterbegin','🔒 ')}}
  if(P.lv<5)shopEl.insertAdjacentHTML('beforeend','<small style="opacity:.85">📘 มือใหม่: ฝึกล่าสไลม์ในทุ่งหญ้าให้ถึง Lv.5 ก่อน แล้วกลับมาเลือก "เหมืองเหล็กร้าง"</small>')}catch(e){}}}
// ---------- ประตูมิติในเหมือง ----------
function gateOf15(Zm){if(Zm.gate15!==undefined)return Zm.gate15;const nz=NZ15.find(q=>ZONES[q.gateIn]&&ZONES[q.gateIn].id===Zm.Zd.id);if(!nz)return Zm.gate15=null;
 let best=null,bd=1e9;const tx=Zm.ent.x-9,ty=Zm.ent.y-7;for(const [x,y] of Zm.floor){if(Zm.oreAt[y*ZW+x])continue;let ok=true;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(!Zm.m[y+b]||Zm.m[y+b][x+a]!==FL)ok=false;if(!ok)continue;const d=Math.hypot(x-tx,y-ty);if(d<bd){bd=d;best=[x,y]}}
 return Zm.gate15=best?{x:best[0]*T+16,y:best[1]*T+16,nz}:null}
const gateNear15=()=>{if(!(D&&D.zone&&!D.dg))return null;const g=gateOf15(D.zone);return g&&Math.hypot(P.x-g.x,P.y-g.y)<46?g:null};
{const _it=interact;interact=function(){const g=gateNear15();if(g){const nz=g.nz;if(P.lv<nz.ulv){say('🔒 ประตูมิติสู่ '+nz.n+' ยังปิดผนึก — ต้อง Lv.'+nz.ulv);sfx('thud');return true}
   if(!NMAP15.unl[nz.id]){NMAP15.unl[nz.id]=1;nmapSave15();try{sysSay('🌀 ปลดผนึกประตูมิติ: '+nz.n+'! ต่อไปเลือกจากประตูมิติในทุ่งหญ้าได้เลย');banner('🌀 ปลดผนึกแมพใหม่',nz.n)}catch(e){}}
   LoadingScreenManager.cover({icon:nz.e,title:nz.n,tip:'มีต้นไม้ประจำแมพให้ตัดด้วยขวาน · มอนดรอปวัตถุดิบหายาก'},()=>{try{exitD()}catch(e){}enterZone(NZI15[nz.id])});return true}return _it()}}
{const _h=hero;hero=function(){_h();try{if(!(D&&D.zone&&!D.dg)||window.__IN_OTHER8)return;const g=gateOf15(D.zone);if(!g)return;const t=performance.now()/1000,x=g.x,y=g.y,open=P.lv>=g.nz.ulv;ctx.save();ctx.globalAlpha=1;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+10,22,7,0,0,7);ctx.fill();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){ctx.strokeStyle=open?'rgba(160,120,255,'+(.7-i*.2)+')':'rgba(120,120,140,'+(.5-i*.15)+')';ctx.lineWidth=3-i;ctx.beginPath();ctx.ellipse(x,y-16,14+i*4+Math.sin(t*3+i)*1.5,22+i*4,0,0,7);ctx.stroke()}
  if(open){const gg=ctx.createRadialGradient(x,y-16,0,x,y-16,20);gg.addColorStop(0,'rgba(220,200,255,.8)');gg.addColorStop(1,'rgba(120,60,255,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.ellipse(x,y-16,14,22,0,0,7);ctx.fill()}
  ctx.restore();plate7((open?'🌀 ':'🔒 ')+g.nz.n+(open?'':' (Lv.'+g.nz.ulv+')'),x,y-52,Math.hypot(P.x-x,P.y-y)<46?'#fff':'#d8b8ff');
  if(Math.hypot(P.x-x,P.y-y)<46)plate7('กด E / ⚔️ เข้าประตูมิติ',x,y+22,'#ffe27a')}catch(e){}}}
{const _zh=zHit;zHit=function(x,y){try{if(D&&D.zone&&!D.dg){const g=gateOf15(D.zone);if(g&&Math.abs(x-g.x)<12&&y<g.y+6&&y>g.y-10)return true}}catch(e){}return _zh(x,y)}}
// ---------- ต้นไม้ประจำแมพ: ตัดด้วยขวาน ----------
{const _zm=zMine;zMine=function(o){if(OREK[o.kind]&&OREK[o.kind].tree){say('🌳 ต้นไม้ต้องตัดด้วยขวาน (กด 2)');return}return _zm(o)}}
function chop15(o){const K=OREK[o.kind];if(P.tier.axe<K.req){o.shake=.2;sfx('thud');say('ต้องใช้'+ITEMS['axe'+K.req].name+'ขึ้นไป จึงจะตัด'+K.n+'ได้');return}
 const sh=window.FW&&FW.act(),dm=AXEDMG();if(sh)FW.send('o',o,dm,75);o.hp-=dm;o.shake=.3;sfx('chop');for(let k=0;k<6;k++)fx.push({x:o.x+(Math.random()-.5)*24,y:o.y-16,vx:(Math.random()-.5)*160,vy:-50-Math.random()*80,l:.5,c:K.fx});
 if(o.hp<=0&&sh){o.hp=1;say('รอเซิร์ฟเวอร์ตัดสิน...')}
 else if(o.hp<=0){o.alive=false;o.regen=75;const n=K.cnt[0]+Math.floor(Math.random()*(K.cnt[1]-K.cnt[0]+1));for(let k=0;k<n;k++)addDrop(K.drop,o.x,o.y);say('🌳 ตัด'+K.n+'ล้ม! ได้'+MN(K.drop)+' +'+n);gainXp(K.xp*3)}
 else say('🪓 ตัด'+K.n+'... '+Math.round((1-o.hp/o.max)*100)+'%')}
{const _u=useToolHit;useToolHit=function(){if(D&&D.zone&&P.tool==='axe'){if(P.fa<=0){say('😮‍💨 เหนื่อยจนไม่มีแรงแล้ว… พักสักครู่');return}
   let best=null,bd=46;for(const q of D.zone.ores){if(!q.alive||!(OREK[q.kind]&&OREK[q.kind].tree))continue;const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<bd){bd=d;best=q}}
   if(best){P.fa=Math.max(0,P.fa-2);chop15(best);return}}return _u()}}
const TREEPAL15={treeE:['#5a3a1e','#3a6a3a','#6ab86a','rgba(200,255,230,.25)'],treeF:['#1a1010','#8a2a10','#ff7a2a','rgba(255,120,40,.35)'],treeS:['#3a3050','#5a4a8a','#c8a8ff','rgba(200,170,255,.35)']};
{const _do=drawOreZ;drawOreZ=function(o){const P15=TREEPAL15[o.kind];if(!P15)return _do(o);const sh=o.shake>0?Math.sin(o.shake*60)*2.5*(o.shake/.3):0,x=o.tx*T+16+sh,y=o.ty*T+26,t=performance.now()/1000;ctx.save();
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+2,16,5,0,0,7);ctx.fill();
  ctx.fillStyle=P15[0];ctx.strokeStyle='#0a0604';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x-3,y-26);ctx.lineTo(x+3,y-26);ctx.lineTo(x+6,y);ctx.closePath();ctx.fill();ctx.stroke();
  if(o.kind==='treeF'){ctx.strokeStyle='rgba(255,120,30,.9)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-1,y-4);ctx.lineTo(x+1,y-14);ctx.lineTo(x-1,y-22);ctx.stroke()}
  for(const [dx,dy,r,c] of [[0,-38,15,1],[-10,-30,10,2],[10,-31,10,1],[0,-48,9,2]]){ctx.fillStyle=P15[c];ctx.beginPath();ctx.arc(x+dx,y+dy+Math.sin(t*1.5+dx)*.6,r,0,7);ctx.fill()}
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-38,0,x,y-38,26);g.addColorStop(0,P15[3]);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-26,y-64,52,52);
  if(o.kind!=='treeE')for(let i=0;i<3;i++){const a=t*1.2+i*2.1;ctx.fillStyle=P15[2];ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(x+Math.cos(a)*14,y-40+Math.sin(a*1.3)*10,1.6,0,7);ctx.fill()}
  ctx.restore()}}
// ---------- มอนในแมพใหม่: ดรอปไม้ วัตถุดิบหายาก และเครื่องมือ ----------
{const _mk=mobKill;mobKill=function(m){const r=_mk(m);try{const Zd=D&&D.zone&&D.zone.Zd,nz=Zd&&NZ15.find(q=>q.id===Zd.id);if(!nz||m.wb10)return r;
  if(Math.random()<(m.boss?1:.25))for(let i=0;i<(m.boss?4:1);i++)addDrop(nz.raw,m.x,m.y);if(Math.random()<(m.boss?1:m.elite?.6:.15))for(let i=0;i<(m.boss?5:1);i++)addDrop(nz.ing,m.x,m.y);
  if(Math.random()<(m.boss?.5:.02)){/* fix124: เดิมระดับเครื่องมือ = ลำดับแมพในรายการ (2+index) → แมพที่เพิ่มทีหลัง (ป่าละเมาะ/ลำธาร/ป่าสน Lv.12–32) ดรอปขวาน/ที่ขุด "เพชร" ระดับสูงสุด ทั้งที่ปกติต้อง Lv.80 + ตำราช่าง = ข้ามการคราฟทั้งหมด → คิดจากเลเวลแมพ: ได้ระดับที่ผู้เล่นเลเวลนั้นคราฟได้อยู่แล้ว (ตำราช่าง Lv.5/20/40/60/80) · บอส +1 ระดับ */const zl=((nz.lv&&nz.lv[0])|0),ct=[1,2,3,4,5].filter(n=>SMQ[n]&&zl>=(SMQ[n].lv|0)).length,t=Math.max(1,Math.min(5,ct+(m.boss?1:0))),id=(Math.random()<.5?'axe':'pick')+t;if(window.toolDrop152)toolDrop152(m,id);else{GEAR[id]=(GEAR[id]|0)+1;try{refreshInv()}catch(_){}say('🎁 '+m.nm+' ทิ้ง '+ITEMS[id].name+'!');sfx('chest')}/* fix152: ดรอปเฉพาะเครื่องมือที่ยังไม่มี + กระเป๋ามีที่ */}}catch(e){}return r}}

// =====================================================================
