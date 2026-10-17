// fix24.js (v4.32) — ข้อ 68 ส่วนที่ 1: เลเวลสูงสุด 150 · แมพใหม่ 2 แมพ (Lv.100–150) · เซ็ตใหม่ระดับ 10–11 · วัตถุดิบใหม่
// =====================================================================
CROWN.push({lv:100,n:'เพชรรุ้ง',a:'#e8fbff',b:'#7ad8ff',c:'#2a4a8a',gem:'#ff7ad8'},{lv:130,n:'เทพ',a:'#fffbe0',b:'#ff9ad8',c:'#5a1a6a',gem:'#7affd8'});
// ---------- วัตถุดิบใหม่ ----------
const MAT24={woodH:['ไม้สวรรค์','ตัดได้ใน "ทุ่งเมฆสวรรค์" · ทำด้ามอาวุธระดับสวรรค์','#f4f0d8','#ffe08a','wood'],
 woodG:['ไม้ทวยเทพ','ตัดได้ใน "บัลลังก์ทวยเทพ" · ทำด้ามอาวุธระดับเทพ','#3a2a5a','#ff9ad8','wood'],
 starc:['ผลึกดารา','ดรอปจากมอนใน "ทุ่งเมฆสวรรค์"','#fffbe0','#7ad8ff','gem'],
 godc:['แก่นทวยเทพ','ดรอปจากมอนใน "บัลลังก์ทวยเทพ"','#ffe8f8','#c84aff','gem']};
for(const k in MAT24){MAPMAT14[k]=MAT24[k];INVMETA[k]=[MAT24[k][0],MAT24[k][1]];if(!INVORDER.includes(k))INVORDER.splice(INVORDER.indexOf('ingSt'),0,k);WT[k]=k.startsWith('wood')?.6:.2;if(inv[k]===undefined)inv[k]=0;try{const im=new Image();im.src=iconURL('mat:'+k);DROPIMG[k]=im}catch(e){}}
// ---------- ต้นไม้ใหม่ ----------
OREK.treeH={n:'ต้นไม้สวรรค์',req:4,hp:20,drop:'woodH',cnt:[1,3],xp:40,fx:'255,240,180',tree:1};
OREK.treeG={n:'ต้นไม้ทวยเทพ',req:5,hp:24,drop:'woodG',cnt:[1,3],xp:60,fx:'255,150,230',tree:1};
TREEPAL15.treeH=['#e8e0c0','#fff6d8','#ffe08a','rgba(255,240,170,.4)'];TREEPAL15.treeG=['#3a2a5a','#c84aff','#ff9ad8','rgba(255,150,230,.45)'];
CUTSPR16.treeH=glowTree16(dark16(makeTree(61,46),'rgba(255,250,225,.42)'),'rgba(255,250,210,.95)',16,61);CUTSPR16.treeG=glowTree16(makeTree(62,300),'rgba(255,180,240,.95)',18,62);
// ---------- แมพใหม่ (ธรรมชาติ) ----------
NAT16.heaven={g:[[214,226,236],[226,236,244],[196,210,226],[240,244,250]],path:'#e8d8a8',pathD:'#c8b888',liq:['#9ad8ff','#6ab8f0','#ffffff'],shore:'#ffffff',forest:.58,rockMix:.25,river:1,ponds:3,lava:0,
 spr:()=>[glowTree16(dark16(makeTree(71,48),'rgba(255,252,235,.5)'),'rgba(255,250,210,.95)',10,71),dark16(makeTree(72,205),'rgba(240,250,255,.5)'),glowTree16(dark16(makeTree(73,335),'rgba(255,245,250,.55)'),'rgba(255,255,255,.95)',12,73)],dec:'heaven'};
NAT16.throne={g:[[52,40,70],[64,48,84],[40,30,58],[80,60,100]],path:'#8a6ab8',pathD:'#5a4088',liq:['#ff7ad8','#a03ab8','#ffe0ff'],shore:'#2a1a40',forest:.58,rockMix:.4,river:1,ponds:3,lava:1,
 spr:()=>[glowTree16(makeTree(81,300),'rgba(255,170,240,.9)',14,81),glowTree16(makeTree(82,280),'rgba(200,170,255,.9)',12,82),makeTree(83,320)],dec:'shadow'};
// ของประดับพื้นสวรรค์: ก้อนเมฆ ดอกไม้ขาว ขนนก
{const _np=natPaint16;natPaint16=function(Zm,R,S){if(S.dec!=='heaven')return _np(Zm,R,S);const S2=Object.assign({},S,{dec:'mist'});_np(Zm,R,S2);try{const k=Zm.cv.getContext('2d');
  for(let i=0;i<70;i++){const [x,y]=Zm.floor[Math.floor(R()*Zm.floor.length)],px=x*T+R()*T,py=y*T+R()*T;k.fillStyle='rgba(255,255,255,.55)';for(let j=0;j<4;j++){k.beginPath();k.arc(px+j*7-10,py+(j%2)*3,6+R()*4,0,7);k.fill()}}
  for(let i=0;i<60;i++){const [x,y]=Zm.floor[Math.floor(R()*Zm.floor.length)],px=x*T+R()*T,py=y*T+R()*T;k.strokeStyle='rgba(255,240,180,.8)';k.lineWidth=1;k.beginPath();k.moveTo(px,py);k.quadraticCurveTo(px+4,py-6,px+2,py-12);k.stroke()}
  k.fillStyle='rgba(255,250,220,.08)';for(let i=0;i<30;i++){k.beginPath();k.ellipse(R()*Zm.cv.width,R()*Zm.cv.height,90+R()*80,20+R()*20,0,0,7);k.fill()}}catch(e){}}}
const NZ24=[
 {id:'heaven',n:'ทุ่งเมฆสวรรค์',e:'☁️',lv:[100,125],gateIn:NZI15.shadow,ulv:100,ores:[['treeH',.75],['treeS',.25]],raw:'woodH',ing:'starc',amb:'mote',dark:0,
  pal:{fl:['#d8e4ee','#cfdce8','#c4d4e2'],top:'#a8bccc',face:'#7a8ea0',edge:'#4a5a6a',ac:'#fff6c0',vd:'#e8f0f8'},
  mobs:[['wisp','ภูตเมฆา',['#ffffff','#9ad8ff','#fff6c0']],['wolf','สิงห์ขาวสวรรค์',['#f4f0e0','#c8b888','#ffd23a']],['dragon','วิหคเทวะ',['#fff6d8','#e8c060','#ffffff']]],
  boss:{f:'dragon',n:'ราชันมังกรสวรรค์',lv:130,c:['#ffffff','#e8c060','#7ad8ff']}},
 {id:'throne',n:'บัลลังก์ทวยเทพ',e:'🌌',lv:[125,150],gateIn:-2,ulv:125,ores:[['treeG',.75],['treeH',.25]],raw:'woodG',ing:'godc',amb:'mote',dark:1,
  pal:{fl:['#40305a','#3a2a52','#34264a'],top:'#2a1e40',face:'#1a1228',edge:'#0a0614',ac:'#ff9ad8',vd:'#0a0614'},
  mobs:[['golem','อสูรผลึกเทพ',['#c84aff','#3a1a6a','#ff9ad8']],['wisp','วิญญาณทวยเทพ',['#ffd8f8','#a03ab8','#ffffff']],['skeleton','อัศวินเทพพิทักษ์',['#e8d8ff','#5a3a8a','#ffd23a']]],
  boss:{f:'dragon',n:'จ้าวแห่งทวยเทพ',lv:155,c:['#ff9ad8','#3a1a6a','#ffe060']}}];
for(const z of NZ24){if(!ZONES.some(q=>q.id===z.id))ZONES.push(z);NZI15[z.id]=ZONES.findIndex(q=>q.id===z.id);NZ15.push(z)}
NZ24[1].gateIn=NZI15.heaven;
for(const id of ['heaven','throne'])delete ZCACHE[NZI15[id]];
// mob family fallback: skeleton อาจไม่มีใน FAM บางรุ่น
if(!FAM.skeleton)FAM.skeleton=FAM.wolf;
// ---------- อุปกรณ์ระดับ 10–11 ----------
const NEWSET24=[['ประกายสวรรค์','ศักดิ์สิทธิ์','#fff6a0','starc','woodH'],['ทวยเทพนิรันดร์','เทพเจ้า','#ff7ad8','godc','woodG']];
const NEWPAL24=[{k:'heav',hi:'#ffffff',mid:'#cfe4f4',lo:'#7a9ab8',dk:'#2a3a52',gl:'#fff6c0',gd:'#ffe08a',gr:'#2a3a52',pm:'#bfe8ff',cloth:'#e8f0f8',pants:'#a8bccc',tr:'rgba(255,250,200,.75)'},
 {k:'god',hi:'#ffe8ff',mid:'#b05ad8',lo:'#4a1a7a',dk:'#1a0a2a',gl:'#ff9ad8',gd:'#ffe060',gr:'#1a0a2a',pm:'#ff9ad8',cloth:'#5a2a8a',pants:'#3a1a5a',tr:'rgba(255,150,230,.8)'}];
SWATK.push(34,42);ADEF.helm.push(16,20);ADEF.chest.push(26,32);ADEF.pants.push(16,20);ADEF.arm.push(15,18);NECKHP.push(250,330);RINGATK.push(20,26);
MATKEY.push('ingDm','ingDm');MATN.push('แท่งเพชร','แท่งเพชร');
for(let i=0;i<2;i++){TIERS.push(NEWPAL24[i]);TNAMES.push(NEWSET24[i][0]);SETN12.push(NEWSET24[i][0]);RARE12.push([NEWSET24[i][1],NEWSET24[i][2]]);PARTS12.push(['scale','core']);ING12.push('ingDm')}
BOWT.push(['#a8bccc','#ffffff','#ffe08a'],['#2a0a3a','#b05ad8','#ff9ad8']);ARMC.push('255,250,200','255,150,230');GEMC.push('#fff6c0','#ff9ad8');GEMC6.push('#fff6c0','#ff9ad8');
SETB.push([{st:{vit:12,int:8}},{st:{str:20,vit:20,agi:14,int:14},x:'ผู้ได้รับพรสวรรค์'}],[{st:{str:14,int:14}},{st:{str:26,vit:24,agi:18,int:22},x:'ทายาททวยเทพ'}]);
for(let t=9;t<11;t++)for(const k in KINDS){if(k==='axe'||k==='pick')continue;const id=k+t;if(ITEMS[id])continue;
 ITEMS[id]={id,kind:k,tier:t,tool:k==='sword'||k==='staff'||k==='bow',name:KINDS[k]+TNAMES[t],
  stat:k==='sword'?'โจมตี +'+SWATK[t]:k==='staff'?'โจมตีเวท +'+SWATK[t]+' · ยิงลูกเวท (INT)':k==='bow'?'โจมตีธนู +'+SWATK[t]+' · ยิงธนู (AGI)':k==='neck'?'เลือดสูงสุด +'+NECKHP[t]:k==='ring'?'โจมตี +'+RINGATK[t]:'ป้องกัน +'+ADEF[k][t]}}
try{SMQ.push({lv:110,n:'ตำราช่าง: เซ็ต'+TNAMES[9],need:{starc:16,woodH:24,ingDm:20},w:'ผลึกดาราและไม้สวรรค์ หาได้ใน "ทุ่งเมฆสวรรค์" (ทางขึ้นในถ้ำเงามืด)'},
 {lv:130,n:'ตำราช่าง: เซ็ต'+TNAMES[10],need:{godc:20,woodG:24,ingDm:26},w:'แก่นทวยเทพและไม้ทวยเทพ หาได้ใน "บัลลังก์ทวยเทพ" (ทางขึ้นในทุ่งเมฆสวรรค์)'})}catch(e){}
{const _rc=recipe12;recipe12=function(id){const it=ITEMS[id];if(!it||it.tier<9)return _rc(id);const t=it.tier,S=NEWSET24[t-9],m=(RECIPE[it.kind]||{m:3}).m,w=WEAP12.includes(it.kind);
  const R={ingDm:m*3,ess:m+10+(t-9)*3,[S[3]]:m*2+4+(t-9)*3,scale:m+1,dust:m+1,core:2};if(w)R[S[4]]=8+(t-9)*2;else R[S[4]]=3;R.coin=60*(t+1)*m*2;return R}}
window.recipe12=recipe12;
// ไอเท็มที่ต้องใช้เลเวล: อุปกรณ์ระดับ 10–11 ต้อง Lv.105 / Lv.128
{const _eq=equipItem;equipItem=function(id){const it=ITEMS[id];if(it&&it.tier>=9){const need=it.tier===9?105:128;if(P.lv<need){say('🔒 '+it.name+' ต้อง Lv.'+need+' ขึ้นไป');sfx('thud');return}}return _eq(id)}}
// ---------- หน้าตาอุปกรณ์ใหม่ ----------
const HV24={hi:'#ffffff',mid:'#dfeefa',lo:'#9ab8d0',dk:'#3a4a62',gl:'#fff6c0',gd:'#ffe08a',k:0};
const PR24=(k,x,y,r,a)=>{const cols=['#ff7a9a','#ffd23a','#7aff9a','#7ad8ff','#c87aff'];for(let i=0;i<5;i++){k.fillStyle=cols[i];k.globalAlpha=.85;k.beginPath();k.moveTo(x,y);k.arc(x,y,r,a+i*1.2566,a+(i+1)*1.2566);k.closePath();k.fill()}k.globalAlpha=1};
const halo24=(k,x,y,w)=>{k.strokeStyle='rgba(255,240,170,.95)';k.lineWidth=2;k.beginPath();k.ellipse(x,y,w,w*.26,0,0,7);k.stroke();G14(k,x,y,w+4,'rgba(255,250,200,.4)')};
const feather24=(k,x,y,s,n,sc)=>{for(let i=0;i<n;i++){const a=-.6+i*.32;k.fillStyle=i%2?'#ffffff':'#e8f0f8';k.strokeStyle='rgba(90,110,140,.6)';k.lineWidth=.8;k.beginPath();k.ellipse(x+s*Math.cos(a)*10*sc,y+Math.sin(a)*8*sc,7*sc,2.6*sc,a*s,0,7);k.fill();k.stroke()}};
S13[9]={
 helm(k,Q,t,v){const side=v==='side';halo24(k,side?34:32,4,13);P13(k,HV24,1,7,side?[[14,56],[14,28],[22,10],[44,10],[54,26],[54,46],[40,58]]:[[11,56],[11,28],[20,10],[44,10],[53,28],[53,56],[40,60],[24,60]]);
  for(const s of side?[-1]:[-1,1])feather24(k,side?16:32+s*19,22,s,4,1);L13(k,'#ffe08a',2,side?[[22,14],[44,14]]:[[20,14],[44,14]]);if(v==='back')return;
  k.fillStyle='#2a3a52';side?k.fillRect(40,30,14,8):k.fillRect(17,31,30,8);for(const x of side?[47]:[25,39])G14(k,x,34,6,'rgba(150,220,255,1)');G14(k,side?34:32,20,7,'rgba(255,250,200,.9)')},
 chest(k,Q,t,v){const side=v==='side';const body=side?[[23,12],[41,12],[42,30],[40,57],[24,57],[22,30]]:[[15,12],[25,10],[32,16],[39,10],[49,12],[52,30],[46,57],[18,57],[12,30]];
  P13(k,HV24,1,11,body);L13(k,'#ffe08a',2.2,side?[[24,30],[40,30]]:[[14,30],[50,30]]);L13(k,'#ffe08a',1.6,side?[[32,14],[32,56]]:[[32,16],[32,56]]);
  for(const s of side?[1]:[-1,1])feather24(k,side?32:32+s*20,14,s,3,.8);if(v==='front'){ORB14(k,32,26,5,'#bfe8ff','#3a5a8a');G14(k,32,26,13,'rgba(255,250,200,.6)')}},
 pants(k,Q,t){P13(k,HV24,1,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);L13(k,'#ffe08a',1.8,[[14,12],[50,12]]);for(const x of [23.5,40.5])G14(k,x,42,4,'rgba(150,220,255,.9)')},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,HV24,1,50+x0,[[x0+2,10],[x0+17,8],[x0+20,50],[x0-1,54]]);L13(k,'#ffe08a',1.6,[[x0+1,24],[x0+19,22]]);feather24(k,x0+18,12,1,2,.6);G14(k,x0+10,34,5,'rgba(255,250,200,.9)')}}};
const GD24={hi:'#ffe8ff',mid:'#b05ad8',lo:'#4a1a7a',dk:'#1a0a2a',gl:'#ff9ad8',gd:'#ffe060',k:0};
S13[10]={
 helm(k,Q,t,v){const side=v==='side';P13(k,GD24,1,7,side?[[14,58],[12,28],[22,10],[44,10],[54,28],[54,58],[40,52]]:[[9,58],[11,28],[20,10],[44,10],[53,28],[55,58],[44,52],[20,52]]);
  for(let i=0;i<5;i++){const x=side?18+i*7:14+i*9,h=i===2?16:i%2?10:12;shard13(k,GD24,x-3,12,6,h,x)}G14(k,32,6,16,'rgba(255,170,240,.45)');if(v==='back')return;
  k.fillStyle='#14061e';side?k.fillRect(40,30,14,8):k.fillRect(17,31,30,8);PR24(k,side?47:32,34,4,performance.now()/900)},
 chest(k,Q,t,v){const side=v==='side';const body=side?[[23,12],[41,12],[43,30],[40,57],[24,57],[21,30]]:[[13,12],[25,9],[32,16],[39,9],[51,12],[53,30],[46,57],[18,57],[11,30]];P13(k,GD24,1,11,body);
  for(const s of side?[1]:[-1,1]){const x=side?32:32+s*21;shard13(k,GD24,x-4,0,8,14,x)}L13(k,'#ffe060',2,side?[[24,40],[40,40]]:[[16,42],[48,42]]);if(v==='front'){PR24(k,32,28,7,0);ORB14(k,32,28,4,'#ffffff','#b05ad8');G14(k,32,28,14,'rgba(255,170,240,.6)')}},
 pants(k,Q,t){P13(k,GD24,1,13,[[14,10],[50,10],[52,24],[47,59],[34,59],[32,32],[30,59],[17,59],[12,24]]);L13(k,'#ffe060',1.6,[[14,12],[50,12]]);for(const x of [23.5,40.5])PR24(k,x,40,3,0)},
 arm(k,Q,t){for(const x0 of [8,36]){P13(k,GD24,1,50+x0,[[x0+2,10],[x0+17,8],[x0+21,50],[x0-2,54]]);shard13(k,GD24,x0+6,40,8,12,x0);PR24(k,x0+10,26,3.5,0)}}};
SW13.push(
 (k,Q,t)=>{P13(k,{hi:'#ffe08a',mid:'#c8a040',lo:'#6a4a10',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,HV24,1,2,[[27,46],[37,46],[39,16],[32,1],[25,16]]);feather24(k,22,46,-1,3,.7);feather24(k,42,46,1,3,.7);L13(k,'#ffe08a',1.4,[[32,44],[32,6]]);G14(k,32,22,13,'rgba(255,250,200,.55)')},
 (k,Q,t)=>{P13(k,{hi:'#5a2a8a',mid:'#3a1a5a',lo:'#1a0a2a',gl:'#fff',k:0},1,1,[[29,50],[35,50],[35,60],[29,60]]);P13(k,GD24,1,2,[[24,46],[40,46],[42,26],[36,10],[32,0],[28,10],[22,26]]);PR24(k,32,47,5,0);L13(k,'#ffe8ff',1.2,[[32,44],[32,4]]);G14(k,32,22,15,'rgba(255,150,230,.55)')});
STAFF14.push(
 (k,Q,t)=>{SHAFT14(k,Q,t,'#c8a040','#fff6d8');halo24(k,32,10,12);feather24(k,26,18,-1,3,.7);feather24(k,38,18,1,3,.7);ORB14(k,32,12,6,'#ffffff','#7ad8ff');G14(k,32,12,14,'rgba(255,250,200,.6)')},
 (k,Q,t)=>{SHAFT14(k,Q,t,'#3a1a5a','#b05ad8',1);for(const x of [22,27,37,42])shard13(k,GD24,x-3,6,6,16,x);PR24(k,32,13,8,0);ORB14(k,32,13,5,'#ffffff','#b05ad8');G14(k,32,13,15,'rgba(255,150,230,.6)')});
BOWDECO14.push((c,s,C)=>{feather24(c,-5,s*22,-1,2,.5)},(c,s,C)=>{c.fillStyle='#ff9ad8';c.beginPath();c.moveTo(-5,s*20);c.lineTo(-10,s*28);c.lineTo(-2,s*24);c.closePath();c.fill();PR24(c,-5.6,s*22.3,2.4,0)});
BOWSHAPE14.push([9,3.4,1],[11,3.2,2]);
for(const k in SPRC)delete SPRC[k];for(const k in TICON)if(!/^(axe|pick)/.test(k))delete TICON[k];for(const k in IURL)if(/^item:/.test(k)&&!/^item:(axe|pick)/.test(k))delete IURL[k];

// ชื่อไอเท็มซ้ำ (ตัวตรวจระบบแจ้ง): ดาบฟักทองอีเวนต์ใช้ชื่อเดียวกับดาบระดับ 3
try{for(const id in ITEMS){if(id!=='sword3'&&ITEMS[id].name===ITEMS.sword3.name)ITEMS[id].name+=' (อีเวนต์)'}}catch(e){}

// =====================================================================
