// fix78 (v4.70) — งานชุดใหม่จากเจ้าของ (HANDOFF ข้อ 13, 14, 25) · ต่อท้ายแบบห่อฟังก์ชัน ไม่แก้ของเดิม
//  A) 🌾 โหมดทำฟาร์มใหม่ในที่ดินผู้กล้า (ใช้ HOME/BLD เดิม · เซฟเดิมไม่หาย · ข้อมูลใหม่อยู่ใน HOME.f77 / ฟิลด์เพิ่มใน HOME.builds[])
//     · แปลงผักยกสูงแบบ 3 มิติ (ขอบไม้ ด้านข้างดิน) · พืชวาดใหม่ 5 ขั้น (เมล็ด→ต้นอ่อน→โต→ออกดอก→พร้อมเก็บ) มีแสงเงา
//     · ต้นไม้ผล 5 ชนิด โตเป็นขั้น (8 วัน) แล้วออกผลเป็นรอบ · สัตว์ใหม่ 4 ชนิด (เป็ด กระต่าย แพะ หมูแคระ+คอกหมู) · รังผึ้ง
//     · พืชใหม่ 5 ชนิด · ของตกแต่งใหม่ (กังหันลม กองฟาง ทางหิน รั้วขาว ซุ้มดอกไม้ ศาลา) · อาหารใหม่ 2 เมนู
//     · ระดับฟาร์ม (XP จากการเก็บเกี่ยว/ผลไม้/ผลผลิตสัตว์) ปลดล็อกของใหม่ทีละขั้น = เล่นได้นาน · 📒 สมุดฟาร์มที่ลุงบุญมี
//  B) 📜 เนื้อเรื่องภาค 3 “ผนึกจักรพรรดิเงา” บทที่ 18–26 ต่อจากบท 17 (แทรกก่อนบทอิสระ · ผู้เล่นที่จบบท 17 แล้วจะได้บท 18 ทันที)
//  C) 📖 คู่มือผู้กล้าอัปเดต: ตีบวกแหก/ซ่อม · 💠/โดเนท · ประตูบอสโลก · ตลาดประตูใต้ · ปาร์ตี้/เพื่อน · ฟาร์มใหม่ · เนื้อเรื่อง 26 บท
try{
// =====================================================================
// A) ฟาร์ม
// =====================================================================
const F77=()=>HOME.f77||(HOME.f77={xp:0,hv:0,lv:1});
const flv77=()=>Math.min(20,1+Math.floor(Math.sqrt((F77().xp|0)/30)));
const fxpAt77=l=>30*(l-1)*(l-1);
window.flv77=flv77;
function fxp77(n,why){if(!(n>0))return;const a=flv77();F77().xp=(F77().xp|0)+n;const b=flv77();F77().lv=b;
 if(b>a){const c=500*b;inv.coin+=c;try{refreshInv()}catch(e){}sfx('chest');try{banner('🌾 ระดับฟาร์ม '+b+'!','ได้ 🪙 '+c.toLocaleString()+(UNL77[b]?' · ปลดล็อก: '+UNL77[b]:''),'green')}catch(e){}
  try{sysSay('🌾 ฟาร์มขึ้นระดับ '+b+(UNL77[b]?' — ปลดล็อก '+UNL77[b]:'')+' (ดูที่ 📒 สมุดฟาร์ม กับลุงบุญมี)')}catch(e){}}saveHome()}
window.fxp77=fxp77;
// ---------- ของใหม่ (ไอเท็ม) ----------
const IT77={fapple:['แอปเปิลสวน','🍎',90],forange:['ส้มสวน','🍊',100],fpeach:['ลูกพีช','🍑',140],fmango:['มะม่วงน้ำดอกไม้','🥭',160],fcherry:['เชอร์รีทับทิม','🍒',260],
 degg:['ไข่เป็ด','🥚',60],rfur:['ขนกระต่ายแองโกรา','🐇',150],gmilk:['นมแพะ','🥛',110],truffle:['เห็ดทรัฟเฟิล','🍄',380]};
const NC77={chili:{n:'พริกขี้หนู',d:4,re:2,seed:18,sell:28,c:['#e8302a','#a01a14'],lv77:1,e:'🌶️',g:'bush'},
 eggplant:{n:'มะเขือม่วง',d:4,re:2,seed:22,sell:34,c:['#8a4ac0','#4a1a6a'],lv77:2,e:'🍆',g:'bush'},
 watermelon:{n:'แตงโม',d:7,seed:45,sell:150,c:['#4aa04a','#226a22'],lv77:2,e:'🍉',g:'ground'},
 sunflower:{n:'ทานตะวัน',d:6,seed:35,sell:110,c:['#ffd23a','#8a5a1a'],lv77:4,e:'🌻',g:'tall'},
 melon:{n:'เมลอนญี่ปุ่น',d:9,seed:120,sell:420,c:['#c8e890','#6aa040'],lv77:6,e:'🍈',g:'ground'}};
const CG77={turnip:'root',carrot:'root',wheat:'grain',corn:'grain',cabbage:'head',tomato:'bush',strawberry:'bush',pumpkin:'ground'};
for(const k in NC77){CG77[k]=NC77[k].g;if(!CROPS[k]){const C=NC77[k];CROPS[k]={n:C.n,d:C.d,re:C.re,seed:C.seed,sell:C.sell,c:C.c,lv77:C.lv77};
  INVMETA[k]=[C.n,'ผลผลิตจากที่ดินผู้กล้า · ขายที่ลุงบุญมี หรือใช้ทำอาหาร'];WT[k]=.2;if(inv[k]===undefined)inv[k]=0;if(!INVORDER.includes(k))INVORDER.push(k);
  const s='sd_'+k;INVMETA[s]=['เมล็ด'+C.n,'ปลูกในแปลงที่ขุดด้วยจอบ · โต '+C.d+' วัน'+(C.re?' · เก็บซ้ำทุก '+C.re+' วัน':'')+' · ต้องรดน้ำทุกวัน · ต้องระดับฟาร์ม '+C.lv77];WT[s]=.05;if(inv[s]===undefined)inv[s]=0;if(!INVORDER.includes(s))INVORDER.push(s)}}
for(const k in IT77){INVMETA[k]=[IT77[k][0],'ผลผลิตจากที่ดินผู้กล้า · ขายที่ลุงบุญมี ('+IT77[k][2]+' 🪙) หรือใช้ทำอาหาร'];WT[k]=.2;if(inv[k]===undefined)inv[k]=0;if(!INVORDER.includes(k))INVORDER.push(k)}
const DISH77={fruitpie:{n:'พายผลไม้สวน',e:'🥧',hu:45,st:{str:5,agi:5,end:3},dur:600,need:{fapple:2,fpeach:1,wheat:1,egg:1},price:240},
 truffrice:{n:'ริซอตโต้เห็ดทรัฟเฟิล',e:'🍛',hu:70,hpP:.5,st:{str:7,vit:7,agi:5,end:5,int:7},dur:900,need:{truffle:1,gmilk:1,wheat:2},price:900}};
for(const k in DISH77){const F=DISH77[k];DISH[k]=F;FOOD[k]={n:F.n,e:F.e,hu:F.hu,hpP:F.hpP,mpP:F.mpP,st:F.st,dur:F.dur,price:F.price,w:.3};INVMETA[k]=[F.n,foodTxt(FOOD[k])+' · อาหารปรุงเอง'];WT[k]=.3;if(inv[k]===undefined)inv[k]=0;if(!INVORDER.includes(k))INVORDER.push(k);if(!QCONS.includes(k))QCONS.push(k)}
{const _mi=matIcon;matIcon=function(key){if(IT77[key])return emojiIcon(IT77[key][1],'rgba(255,240,200,.35)');if(NC77[key])return emojiIcon(NC77[key].e);if(DISH77[key])return emojiIcon(DISH77[key].e,'rgba(255,240,200,.5)');return _mi(key)};window.matIcon=matIcon}
// ---------- สิ่งก่อสร้างใหม่ ----------
const FT77={ft_apple:{n:'ต้นแอปเปิล',fr:'fapple',re:3,c:{wood:15,coin:1200},lv:1,col:['#ff4a4a','#b01a1a']},ft_orange:{n:'ต้นส้ม',fr:'forange',re:3,c:{wood:15,coin:1800},lv:2,col:['#ffa03a','#c8600a']},
 ft_peach:{n:'ต้นพีช',fr:'fpeach',re:4,c:{wood:20,coin:2600},lv:3,col:['#ffb0a0','#e86a6a']},ft_mango:{n:'ต้นมะม่วง',fr:'fmango',re:4,c:{wood:25,coin:3500},lv:4,col:['#ffd84a','#e8a020']},
 ft_cherry:{n:'ต้นเชอร์รี',fr:'fcherry',re:5,c:{wood:25,ingAg:2,coin:6000},lv:6,col:['#e8203a','#80101e']}};
for(const k in FT77){const F=FT77[k];BLD[k]={n:F.n,w:1,h:1,c:F.c,ht:0,lv77:F.lv,ft77:1,d:'ต้นไม้ผล: โต 5 ขั้น (8 วัน ไม่ต้องรดน้ำ) แล้วออก'+IT77[F.fr][0]+'ทุก '+F.re+' วัน · กด E เก็บผล · ระดับฟาร์ม '+F.lv}}
Object.assign(BLD,{
 hive77:{n:'รังผึ้ง',w:1,h:1,c:{wood:10,coin:800},ht:0,lv77:2,d:'ให้น้ำผึ้งทุก 2 วัน · มีดอกไม้/ทานตะวันรอบ ๆ ได้มากขึ้น · ระดับฟาร์ม 2'},
 sty:{n:'คอกหมู',w:3,h:2,c:{wood:30,ingot:6,coin:1500},ht:1,cap:3,lv77:5,d:'เลี้ยงหมูแคระได้ 3 ตัว (ขุดเห็ดทรัฟเฟิล) · ระดับฟาร์ม 5'},
 path77:{n:'ทางเดินหิน',w:1,h:1,c:{ingSt:1},ht:0,deco:1,walk77:1,lv77:1,d:'เดินผ่านได้'},
 pfence77:{n:'รั้วไม้สีขาว',w:1,h:1,c:{wood:3},ht:0,deco:1,lv77:1},
 hay77:{n:'กองฟาง',w:1,h:1,c:{hay:3,wood:2},ht:0,deco:1,lv77:1},
 arch77:{n:'ซุ้มดอกไม้',w:2,h:1,c:{wood:8,coin:300},ht:0,deco:1,lv77:2,walk77:1,d:'เดินลอดได้'},
 wmill77:{n:'กังหันลม',w:2,h:2,c:{wood:30,ingot:4,coin:1500},ht:1,deco:1,lv77:3,d:'ใบพัดหมุนตามลม'},
 gazebo77:{n:'ศาลาพักผ่อน',w:3,h:2,c:{wood:40,ingSt:10,coin:3000},ht:2,deco:1,lv77:5}});
const FA77={duck:{n:'เป็ด',p:1200,need:'coop',pr:'degg',lv:2,d:'ให้ไข่เป็ดทุกวันเมื่อได้กินอาหาร'},rabbit:{n:'กระต่ายแองโกรา',p:3500,need:'coop',pr:'rfur',lv:3,d:'ให้ขนกระต่าย (ขายแพง)'},
 goat:{n:'แพะ',p:3200,need:'barn',pr:'gmilk',lv:3,d:'ให้นมแพะทุกวัน'},pig:{n:'หมูแคระ',p:6000,need:'sty',pr:'truffle',lv:5,d:'ขุดเห็ดทรัฟเฟิล (ทุก 2 วัน)'}};
for(const k in FA77){const A=FA77[k];ANIM_HOUSE[k]=A.need;if(!ANIMS.some(q=>q.k===k)){const i=ANIMS.findIndex(q=>q.pet||q.mount);ANIMS.splice(i<0?ANIMS.length:i,0,{k,n:A.n,p:A.p,need:A.need,homeOnly:1,d:A.d+' · ระดับฟาร์ม '+A.lv,lv77:A.lv})}}
const UNL77={2:'แตงโม · มะเขือม่วง · ต้นส้ม · เป็ด · รังผึ้ง · ซุ้มดอกไม้',3:'ต้นพีช · กระต่าย · แพะ · กังหันลม',4:'ทานตะวัน · ต้นมะม่วง',5:'คอกหมู + หมูแคระ · ศาลาพักผ่อน',6:'เมลอนญี่ปุ่น · ต้นเชอร์รี'};
const lockLv77=lv=>flv77()<(lv|0);
// ---------- ล็อกตามระดับฟาร์ม ----------
{const _sp=startPlace;startPlace=function(k){const B=BLD[k];if(B&&lockLv77(B.lv77)){say('🔒 '+B.n+' ต้องระดับฟาร์ม '+B.lv77+' (ตอนนี้ '+flv77()+')');sfx('thud');return}return _sp.apply(this,arguments)};window.startPlace=startPlace}
{const _ba=buyAnimal;buyAnimal=function(k){const A=FA77[k];if(A&&lockLv77(A.lv)){say('🔒 '+A.n+' ต้องระดับฟาร์ม '+A.lv);sfx('thud');return}return _ba.apply(this,arguments)};window.buyAnimal=buyAnimal}
{const _lb=lifeBuy;lifeBuy=function(id,p,silent){const m=/^sd_(.+)$/.exec(id||'');if(m&&NC77[m[1]]&&lockLv77(NC77[m[1]].lv77)){if(!silent){say('🔒 เมล็ด'+NC77[m[1]].n+' ต้องระดับฟาร์ม '+NC77[m[1]].lv77);sfx('thud')}return}return _lb.apply(this,arguments)};window.lifeBuy=lifeBuy}
// หน้าต่างฟาร์ม: ทำเครื่องหมายของที่ล็อก + ขายของใหม่
{const _rl=renderLife;renderLife=function(){const r=_rl.apply(this,arguments);try{const T2=LIFE.tab,lb=lifeEl.querySelector('.lb');if(!lb)return r;
  for(const b of lb.querySelectorAll('button[onclick]')){const s=b.getAttribute('onclick');let lv=0,m;
   if((m=/startPlace\('([^']+)'\)/.exec(s))&&BLD[m[1]])lv=BLD[m[1]].lv77|0;else if((m=/buyAnimal\('([^']+)'\)/.exec(s))&&FA77[m[1]])lv=FA77[m[1]].lv;else if((m=/lifeBuy\('sd_([^']+)'/.exec(s))&&NC77[m[1]])lv=NC77[m[1]].lv77;
   if(lv&&lockLv77(lv)){b.disabled=true;b.textContent='🔒 ฟาร์ม Lv.'+lv;const it=b.closest('.it');if(it)it.classList.add('lock')}}
  if(T2==='sell'){const L=Object.keys(IT77).filter(k=>inv[k]>0);if(L.length){const emp=lb.querySelector('.it[style*="grid-column"]');if(emp&&/ยังไม่มีผลผลิต/.test(emp.textContent))emp.remove();
    lb.insertAdjacentHTML('beforeend',L.map(k=>'<div class="it"><div class="th" style="align-items:center"><img src="'+iconURL('mat:'+k)+'" style="width:48px;height:48px"></div><b>'+MN(k)+' ×'+inv[k]+'</b><small>ชิ้นละ '+IT77[k][2]+' 🪙</small><button onclick="lifeSell(\''+k+'\','+IT77[k][2]+')">ขายทั้งหมด (+'+(IT77[k][2]*inv[k]).toLocaleString()+')</button></div>').join(''))}}
  if(T2==='shop'||T2==='pet'||T2==='sell'){const h=lifeEl.querySelector('.lh b');if(h&&!h.querySelector('.f77'))h.insertAdjacentHTML('beforeend',' <small class="f77" style="font-weight:700;color:#bff59a">🌾 ฟาร์ม Lv.'+flv77()+'</small>')}}catch(e){console.warn('rl77',e)}return r};window.renderLife=renderLife}
// ---------- วันใหม่: ต้นไม้ผลโต / รังผึ้ง / หมู ----------
{const _nd=newDay;newDay=function(){const r=_nd.apply(this,arguments);try{for(const b of HOME.builds){if(FT77[b.k]){if((b.g|0)<8)b.g=(b.g|0)+1;else b.fd=(b.fd|0)+1}}saveHome()}catch(e){}return r};window.newDay=newDay}
// ---------- เก็บเกี่ยว → XP ฟาร์ม ----------
const cropSum77=()=>Object.keys(CROPS).reduce((s,k)=>s+(inv[k]|0)*Math.max(1,Math.round(CROPS[k].sell/25)),0);
const cropCnt77=()=>Object.keys(CROPS).reduce((s,k)=>s+(inv[k]|0),0);
{const _hu=homeUse;homeUse=function(){try{if(D&&D.home&&P.draw&&P.tool==='hamr'){const [tx,ty]=target(),o=ZCACHE[300]&&ZCACHE[300].oreAt[ty*HW+tx];if(o&&o.type==='bld'&&(FT77[o.b.k]||o.b.k==='hive77')){askRemove(o.b);return true}}}catch(e){}
  if(D&&D.home&&P.draw&&P.tool==='sick'){const a=cropSum77(),n0=cropCnt77(),r=_hu.apply(this,arguments);const g=cropSum77()-a,n=cropCnt77()-n0;if(n>0){F77().hv=(F77().hv|0)+n;fxp77(g)}return r}
  return _hu.apply(this,arguments)};window.homeUse=homeUse}
// ---------- กด E: ต้นไม้ผล · รังผึ้ง · สัตว์ใหม่ · ลุงบุญมี ----------
function nearB77(test,r){let best=null,bd=r;for(const b of HOME.builds){if(!test(b))continue;const B=BLD[b.k],d=Math.hypot(P.x-(b.x+B.w/2)*T,P.y-(b.y+B.h)*T+6);if(d<bd){bd=d;best=b}}return best}
function hiveReady77(b){return b.hd===undefined||HOME.day-(b.hd|0)>=2}
function farmBook77(){const l=flv77(),nx=fxpAt77(l+1),cur=F77().xp|0;let s='🌾 ระดับฟาร์ม '+l+' · XP '+cur.toLocaleString()+(l<20?' / '+nx.toLocaleString()+' (อีก '+(nx-cur).toLocaleString()+')':' (สูงสุด)')+' · เก็บผลผลิตแล้ว '+(F77().hv|0).toLocaleString()+' ชิ้น\n';
 const nxt=Object.keys(UNL77).map(Number).filter(v=>v>l).slice(0,2);s+=nxt.length?'ปลดล็อกถัดไป: '+nxt.map(v=>'Lv.'+v+' '+UNL77[v]).join(' | '):'ปลดล็อกของฟาร์มครบทุกอย่างแล้ว!';
 s+='\n💡 XP ได้จาก: เก็บเกี่ยวผัก (ผักแพงได้มาก) · เก็บผลไม้ · เก็บผลผลิตสัตว์ · น้ำผึ้ง';talk(RANCHER,s,[{t:'🛒 ร้านฟาร์ม',c:'go',f:()=>openLife('shop')},BYE],'📒 สมุดฟาร์ม')}
window.farmBook77=farmBook77;
{const _ha=homeAct;homeAct=function(){if(!(D&&D.home))return _ha.apply(this,arguments);
  try{if(Math.hypot(P.x-RANCHER.x,P.y-RANCHER.y)<52){talk(RANCHER,pick(RANCHER.lines.concat(['ต้นไม้ผลไม่ต้องรดน้ำ รอให้โตก็พอ','ยิ่งฟาร์มระดับสูง ลุงยิ่งมีของดีมาขาย'])),[{t:'🛒 ร้านฟาร์ม',c:'go',f:()=>openLife('shop')},{t:'🐾 สัตว์เลี้ยง / สัตว์ขี่',f:()=>openLife('pet')},{t:'💰 ขายผลผลิต',f:()=>openLife('sell')},{t:'📒 สมุดฟาร์ม (Lv.'+flv77()+')',stay:true,f:()=>farmBook77()},BYE]);return true}
   for(const a of HOME.animals)if(FA77[a.k]&&Math.hypot(P.x-a.x,P.y-a.y)<40){animal77(a);return true}
   const tr=nearB77(b=>!!FT77[b.k],46);if(tr){const F=FT77[tr.k],g=tr.g|0;if(g<8){say('🌳 '+F.n+' — กำลังโต ขั้น '+(1+Math.min(4,g>>1))+'/5 (อีก '+(8-g)+' วันจะโตเต็มที่)');return true}
    if((tr.fd|0)<F.re){say('🌳 '+F.n+' — ผลจะสุกในอีก '+(F.re-(tr.fd|0))+' วัน');return true}
    const q=2+(Math.random()<.4?1:0)+(flv77()>=8&&Math.random()<.3?1:0);inv[F.fr]=(inv[F.fr]|0)+q;tr.fd=0;sfx('coin');refreshInv();say('🧺 เก็บ'+IT77[F.fr][0]+' ×'+q);F77().hv=(F77().hv|0)+q;fxp77(q*3);
    for(let i=0;i<12;i++)rfxP((tr.x+.5)*T,(tr.y)*T-20,(Math.random()-.5)*90,-30-Math.random()*60,.7,'255,230,140',2.4,'spark');saveHome();return true}
   const hv=nearB77(b=>b.k==='hive77',44);if(hv){if(!hiveReady77(hv)){say('🐝 ผึ้งกำลังทำน้ำผึ้ง — อีก '+(2-(HOME.day-(hv.hd|0)))+' วัน');return true}
    let fl=0;for(const b of HOME.builds)if((b.k==='flower'||b.k==='arch77')&&Math.hypot(b.x-hv.x,b.y-hv.y)<=3)fl++;for(const key in HOME.tiles){const t=HOME.tiles[key];if(t.crop&&t.crop.k==='sunflower'){const [x,y]=key.split(',').map(Number);if(Math.hypot(x-hv.x,y-hv.y)<=3)fl++}}
    const q=1+Math.min(2,Math.floor(fl/2));inv.honey=(inv.honey|0)+q;hv.hd=HOME.day;sfx('coin');refreshInv();say('🍯 เก็บน้ำผึ้ง ×'+q+(fl?' (ดอกไม้รอบรัง '+fl+')':' · วางดอกไม้/ปลูกทานตะวันรอบรังจะได้มากขึ้น'));F77().hv=(F77().hv|0)+q;fxp77(q*2);saveHome();return true}}catch(e){console.warn('ha77',e)}
  return _ha.apply(this,arguments)};window.homeAct=homeAct}
function animal77(a){const A=FA77[a.k],k=A.pr,pigOK=a.k!=='pig'||HOME.day-(a.td===undefined?-9:a.td)>=2;
 if(a.ready&&pigOK){const q=1+(a.heart>=6&&Math.random()<.3?1:0);inv[k]=(inv[k]|0)+q;a.ready=false;if(a.k==='pig')a.td=HOME.day;sfx('coin');refreshInv();say((a.k==='pig'?'🐷 หมูขุดเจอ':'เก็บ')+MN(k)+' ×'+q+' จาก'+A.n);F77().hv=(F77().hv|0)+q;fxp77(q*Math.max(2,Math.round(IT77[k][2]/40)));saveHome();return}
 if(a.ready&&!pigOK){say('🐷 หมูแคระยังขุดเห็ดไม่เจอ — พรุ่งนี้ลองใหม่');return}
 if(a.fed!==HOME.day){const f=inv.hay>0?'hay':inv.wheat>0?'wheat':null;if(!f){say(A.n+'หิว — ป้อนหญ้าแห้ง/ข้าวสาลี (ซื้อหญ้าแห้งที่ลุงบุญมี)');return}inv[f]--;a.fed=HOME.day;a.heart=Math.min(10,(a.heart||0)+.3);sfx('pop');refreshInv();say('🌿 ป้อนอาหาร'+A.n+'แล้ว — พรุ่งนี้จะให้ผลผลิต');saveHome();return}
 a.heart=Math.min(10,(a.heart||0)+.05);say('💗 ลูบหัว'+A.n+' (ความผูกพัน '+(a.heart||0).toFixed(1)+'/10)');sfx('ui')}
// ผลผลิตสัตว์เดิม (ไข่/นม/ขนแกะ) → XP ฟาร์ม
{const _aa=animalAct;animalAct=function(a){if(a&&FA77[a.k])return animal77(a);const s=(inv.egg|0)+(inv.milk|0)+(inv.wool|0),r=_aa.apply(this,arguments),n=(inv.egg|0)+(inv.milk|0)+(inv.wool|0)-s;if(n>0){F77().hv=(F77().hv|0)+n;fxp77(n*2)}return r};window.animalAct=animalAct}
// ทางเดิน/ซุ้มเดินผ่านได้ (ไม่กันชน) + วาดใต้ตัวละคร
{const _ho=homeObjects;homeObjects=function(){const r=_ho.apply(this,arguments);try{const Zm=ZCACHE[300];if(Zm)for(const o of Zm.ores){if(o.type==='bld'&&BLD[o.b.k]&&BLD[o.b.k].walk77){const B=BLD[o.b.k];for(let y=o.ty;y<o.ty+B.h;y++)for(let x=o.tx;x<o.tx+B.w;x++)if(Zm.oreAt[y*HW+x]===o)delete Zm.oreAt[y*HW+x];if(o.b.k==='path77')o.y=o.ty*T-2}}}catch(e){}return r};window.homeObjects=homeObjects}
// ---------- ภาพ 3 มิติ: เครื่องมือวาด ----------
const LIT77=(k,x,y,r,c0,c1)=>{const g=k.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r*1.05);g.addColorStop(0,'#ffffff');g.addColorStop(.18,c0);g.addColorStop(1,c1);return g};
function ball77(x,y,r,c0,c1,sx,sy){ctx.fillStyle=LIT77(ctx,x,y,r,c0,c1);ctx.beginPath();ctx.ellipse(x,y,r*(sx||1),r*(sy||1),0,0,7);ctx.fill()}
function leaf77(x,y,len,ang,c0,c1,wd){ctx.save();ctx.translate(x,y);ctx.rotate(ang);const g=ctx.createLinearGradient(0,-len*.3,0,len*.3);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(len/2,0,len/2,len*(wd||.24),0,0,7);ctx.fill();
 ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(len*.9,0);ctx.stroke();ctx.restore()}
function shad77(x,y,rx,ry){ctx.fillStyle='rgba(20,30,10,.28)';ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill()}
const GL=['#9ee86a','#3f8a2a'],GD=['#7acc52','#2a6a1e'];
// ---------- แปลงผักยกสูง (วาดลงพื้นแคช) ----------
{const _hp=homePaintTile;const tl=(x,y)=>{const t=HOME.tiles[x+','+y];return !!(t&&t.till)};
 function bed77(x,y){_hp(x,y);const Zm=ZCACHE[300];if(!Zm||!Zm.m[y]||Zm.m[y][x]!==FL)return;const t=HOME.tiles[x+','+y];if(!(t&&t.till))return;const k=Zm.cv.getContext('2d'),px=x*T,py=y*T,wet=t.w===HOME.day;
  const up=tl(x,y-1),dn=tl(x,y+1),lf=tl(x-1,y),rt=tl(x+1,y);
  const g=k.createLinearGradient(0,py,0,py+T);if(wet){g.addColorStop(0,'#5e3e24');g.addColorStop(1,'#3e2614')}else{g.addColorStop(0,'#a8784a');g.addColorStop(1,'#7a5230')}
  k.fillStyle=g;k.fillRect(px+(lf?0:3),py+(up?0:3),T-(lf?0:3)-(rt?0:3),T-(up?0:3)-(dn?0:8));
  // ร่องดิน
  for(let i=0;i<3;i++){const yy=py+(up?4:7)+i*7;k.fillStyle=wet?'rgba(0,0,0,.28)':'rgba(70,40,15,.35)';k.fillRect(px+(lf?1:5),yy+2,T-(lf?1:5)-(rt?1:5),2);k.fillStyle=wet?'rgba(140,190,255,.18)':'rgba(255,230,180,.25)';k.fillRect(px+(lf?1:5),yy,T-(lf?1:5)-(rt?1:5),1.5)}
  if(wet){k.fillStyle='rgba(150,200,255,.12)';k.fillRect(px+2,py+2,T-4,T-10)}
  // ขอบไม้ (ด้านที่ไม่ต่อกับแปลงอื่น)
  k.fillStyle='#ecece4';if(!up)k.fillRect(px,py,T,3);if(!lf)k.fillRect(px,py,3,T);if(!rt)k.fillRect(px+T-3,py,3,T);
  k.fillStyle='rgba(255,255,255,.9)';if(!up)k.fillRect(px,py,T,1);if(!lf)k.fillRect(px,py,1,T);
  // ด้านหน้าของแปลง (ความสูง 3 มิติ)
  if(!dn){const sg=k.createLinearGradient(0,py+T-8,0,py+T);sg.addColorStop(0,'#e4e4dc');sg.addColorStop(1,'#a2a29a');k.fillStyle=sg;k.fillRect(px,py+T-8,T,8);k.fillStyle='rgba(0,0,0,.25)';k.fillRect(px,py+T-8,T,1);
   k.fillStyle='rgba(255,255,255,.5)';k.fillRect(px,py+T-8,T,1);k.fillStyle='rgba(0,0,0,.18)';k.fillRect(px,py+T,T,2)}}
 homePaintTile=function(x,y){bed77(x,y);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(tl(x+a,y+b))bed77(x+a,y+b)};window.homePaintTile=homePaintTile}
// ---------- พืช 5 ขั้น ----------
function drawCrop77(t,x,y){const k=t.crop.k,C=CROPS[k];if(!C)return;const s=t.crop.s,max=C.d,u=Math.min(1,s/max),st=s===0?0:s>=max?4:u<.34?1:u<.67?2:3,px=x*T+16,py=y*T+24,tm=performance.now()/1000,sw=Math.sin(tm*1.7+x*.9+y*.4)*1.4,G=CG77[k]||'bush',c0=C.c[0],c1=C.c[1];ctx.save();
 if(st===4){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(px,py-10,1,px,py-10,18);g.addColorStop(0,'rgba(255,240,150,'+(.22+.12*Math.sin(tm*3+x))+')');g.addColorStop(1,'rgba(255,240,150,0)');ctx.fillStyle=g;ctx.fillRect(px-18,py-28,36,36);ctx.globalCompositeOperation='source-over'}
 if(st===0){shad77(px,py+1,5,2);ball77(px,py-1,4,'#b88a58','#6a4a28',1.2,.7);ctx.fillStyle='#5aa040';ctx.fillRect(px-.5,py-5,1.5,3)}
 else if(G==='root'){shad77(px,py+1,6+st*1.5,2.5);const n=st+1;for(let i=0;i<n*2;i++){const a=-Math.PI/2+(i/(n*2-1)-.5)*1.9;leaf77(px,py-1,5+st*3.2,a+sw*.03,GL[0],GL[1],.3)}
  if(st>=3){ball77(px,py+1,st===4?6:4,c0,c1,1.15,.75);if(k==='carrot'){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(px-3,py,6,1)}}}
 else if(G==='grain'){const n=k==='corn'?2:4,h=6+st*(k==='corn'?6:4.5);shad77(px,py+1,7,2.5);for(let i=0;i<n;i++){const dx=(i-(n-1)/2)*4,tx=px+dx+sw*(h/14);const g=ctx.createLinearGradient(px+dx-1,0,px+dx+1,0);g.addColorStop(0,st===4&&k==='wheat'?'#e8c860':'#5aaa3a');g.addColorStop(1,st===4&&k==='wheat'?'#b08a30':'#2e6a1e');
   ctx.strokeStyle=g;ctx.lineWidth=k==='corn'?2.6:1.6;ctx.beginPath();ctx.moveTo(px+dx,py);ctx.quadraticCurveTo(px+dx,py-h*.6,tx,py-h);ctx.stroke();
   if(k==='corn'&&st>=2){leaf77(px+dx,py-h*.45,8+st*2,-.5+(i?.9:0)*1.6-0.4,GL[0],GL[1],.18)}
   if(st===4){if(k==='wheat'){ball77(tx,py-h-3,2.6,'#ffe890','#c8a040',.9,1.8)}else{ball77(tx+2,py-h*.55,3.2,'#ffe060','#d89a10',.9,2);ctx.fillStyle='#8ac850';ctx.beginPath();ctx.ellipse(tx+3,py-h*.55+4,2,4,.3,0,7);ctx.fill()}}}}
 else if(G==='head'){const r=3+st*2.4;shad77(px,py+1,r+2,3);for(let i=0;i<5+st;i++){const a=i/(5+st)*6.28+tm*.1;leaf77(px,py-r*.4,r*1.15,a,GD[0],GD[1],.45)}if(st>=2)ball77(px,py-r*.55,r*.8,st===4?'#d8f8b0':'#a8e080',st===4?'#5aa040':'#4a8a2a',1.1,.85)}
 else if(G==='ground'){const r=2+st*2.6;shad77(px,py+1,r+5,3);ctx.strokeStyle='#3f8a2a';ctx.lineWidth=1.4;for(const a of [-.4,.4,2.7,3.5]){ctx.beginPath();ctx.moveTo(px,py-2);ctx.quadraticCurveTo(px+Math.cos(a)*r*1.4,py-2+Math.sin(a)*r*.5-3,px+Math.cos(a)*r*2,py+Math.sin(a)*r*.6);ctx.stroke()}
  for(const a of [-.6,.5,2.6,3.6])leaf77(px+Math.cos(a)*r*1.3,py-2+Math.sin(a)*r*.4,4+st*1.6,-Math.PI/2+Math.cos(a)*.6,GL[0],GL[1],.5);
  if(st>=3){const R=st===4?(k==='pumpkin'?9:k==='melon'?7.5:9.5):4;ball77(px,py-R*.55,R,c0,c1,k==='watermelon'?1.25:1.1,.82);
   if(k==='watermelon'){ctx.strokeStyle='rgba(20,70,20,.6)';ctx.lineWidth=1.3;for(const d of [-.5,0,.5]){ctx.beginPath();ctx.ellipse(px+d*R,py-R*.55,R*.22,R*.8,0,-1.4,1.4);ctx.stroke()}}
   else if(k==='pumpkin'){ctx.strokeStyle='rgba(120,50,0,.45)';ctx.lineWidth=1.2;for(const d of [-.45,0,.45]){ctx.beginPath();ctx.ellipse(px+d*R,py-R*.55,R*.32,R*.8,0,0,7);ctx.stroke()}ctx.fillStyle='#5a7a2a';ctx.fillRect(px-1,py-R*1.4,2.5,4)}
   else if(k==='melon'){ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=.7;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(px+i*2.2-3,py-R*1.25);ctx.lineTo(px+i*2.2+3,py+R*.1);ctx.stroke()}}}}
 else if(G==='tall'){const h=6+st*7;shad77(px,py+1,5,2);ctx.strokeStyle='#3f8a2a';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px,py-h*.5,px+sw,py-h);ctx.stroke();
  for(let i=1;i<=Math.min(3,st);i++)leaf77(px,py-h*i/4,5+st,i%2?-.3:Math.PI+.3,GL[0],GL[1],.42);
  if(st>=3){const R=st===4?7:4;ctx.fillStyle='#ffc820';for(let i=0;i<12;i++){const a=i/12*6.28;ctx.beginPath();ctx.ellipse(px+sw+Math.cos(a)*R,py-h+Math.sin(a)*R,R*.45,R*.2,a,0,7);ctx.fill()}ball77(px+sw,py-h,R*.6,'#8a5a1a','#3a2008')}}
 else{// bush: มะเขือเทศ สตรอว์เบอร์รี มะเขือม่วง พริก
  const r=3+st*2.6;shad77(px,py+1,r+2,3);ctx.strokeStyle='#4a7a2a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+sw*.5,py-r);ctx.stroke();
  for(let i=0;i<4+st*2;i++){const a=-Math.PI/2+(i/(3+st*2)-.5)*2.8+sw*.04;leaf77(px,py-r*.5,r*1.05,a,i%2?GL[0]:GD[0],GL[1],.42)}
  if(st===3){ctx.fillStyle='#fff';for(const [dx,dy] of [[-4,-r],[4,-r*.7],[0,-r*1.3]]){ctx.beginPath();ctx.arc(px+dx,py+dy,1.6,0,7);ctx.fill()}ctx.fillStyle='#ffd23a';for(const [dx,dy] of [[-4,-r],[4,-r*.7],[0,-r*1.3]])ctx.fillRect(px+dx-.5,py+dy-.5,1,1)}
  if(st===4){const F=k==='eggplant'?[[-4,-r*.5],[4,-r*.3]]:k==='chili'?[[-5,-r*.7],[0,-r*.45],[5,-r*.75],[2,-r*1.1]]:[[-5,-r*.6],[5,-r*.8],[0,-r*1.2],[-2,-r*.2]];
   for(const [dx,dy] of F){const fx=px+dx+sw,fy=py+dy;if(k==='eggplant'){ball77(fx,fy+3,3.6,c0,c1,.8,1.6);ctx.fillStyle='#4a7a2a';ctx.fillRect(fx-1.5,fy-3,3,2)}
    else if(k==='chili'){ball77(fx,fy+2,1.6,c0,c1,.8,2.6)}else if(k==='strawberry'){ball77(fx,fy,3.2,c0,c1,.9,1.1);ctx.fillStyle='rgba(255,240,150,.8)';ctx.fillRect(fx-1,fy-1,1,1);ctx.fillRect(fx+1,fy+1,1,1)}else ball77(fx,fy,3.6,c0,c1)}}}
 if(t.w!==HOME.day&&s<max){ctx.font='9px system-ui';ctx.textAlign='center';ctx.fillText('💧',px,py-16-st*4)}
 ctx.restore()}
{const _dc=drawCrop;drawCrop=function(t,x,y){try{return drawCrop77(t,x,y)}catch(e){return _dc.apply(this,arguments)}};window.drawCrop=drawCrop}
// ---------- สิ่งก่อสร้างใหม่ (วาด) ----------
function tree77(b){const F=FT77[b.k],real=HOME.builds.includes(b),g=real?(b.g|0):8,st=Math.min(4,g>>1),ripe=real?(g>=8&&(b.fd|0)>=F.re):true,x=b.x*T+16,y=(b.y+1)*T-4,tm=performance.now()/1000,sw=Math.sin(tm*1.2+b.x)*1.2;
 const H=[6,16,30,44,56][st],R=[0,6,11,17,22][st];shad77(x,y,4+R*.9,3+R*.2);
 if(st===0){ball77(x,y-2,5,'#b88a58','#6a4a28',1.3,.6);ctx.fillStyle='#6a4422';ctx.fillRect(x-1,y-12,2,10);leaf77(x,y-10,6,-.6,GL[0],GL[1],.4);return}
 const tg=ctx.createLinearGradient(x-4,0,x+4,0);tg.addColorStop(0,'#8a5a30');tg.addColorStop(1,'#4a2c14');ctx.fillStyle=tg;const tw=1.5+st*1.2;ctx.beginPath();ctx.moveTo(x-tw,y);ctx.lineTo(x-tw*.6+sw*.3,y-H*.6);ctx.lineTo(x+tw*.6+sw*.3,y-H*.6);ctx.lineTo(x+tw,y);ctx.fill();
 const cy=y-H*.62-R*.4;const blobs=st<2?[[0,0,1]]:[[-.55,.15,.72],[.55,.15,.72],[0,-.35,.85],[0,.1,1]];for(const [dx,dy,s] of blobs)ball77(x+dx*R+sw,cy+dy*R,R*s,st>=3?'#6ac84a':'#8ae060',st>=3?'#1e5a1a':'#2e7a22',1,.9);
 if(st===4&&b.k==='ft_cherry'&&!ripe){ctx.fillStyle='rgba(255,200,220,.9)';for(let i=0;i<9;i++){const a=i*2.4;ctx.beginPath();ctx.arc(x+Math.cos(a)*R*.7+sw,cy+Math.sin(a)*R*.55,1.6,0,7);ctx.fill()}}
 if(st===4&&ripe){for(let i=0;i<7;i++){const a=i*0.9+.3,fx=x+Math.cos(a)*R*.72+sw,fy=cy+Math.sin(a)*R*.55+2;if(b.k==='ft_cherry'){ball77(fx-1.5,fy,2,F.col[0],F.col[1]);ball77(fx+1.5,fy+.5,2,F.col[0],F.col[1])}else ball77(fx,fy,b.k==='ft_mango'?3.4:3,F.col[0],F.col[1],b.k==='ft_mango'?.8:1,b.k==='ft_mango'?1.2:1)}}
 if(real&&Math.hypot(P.x-x,P.y-y)<46)homeChip(g<8?'🌳 กำลังโต '+(st+1)+'/5':ripe?'กด E เก็บผล 🧺':'ผลยังไม่สุก',x,y+14)}
function bld77(b,o){const B=BLD[b.k],x=b.x*T,y=b.y*T,w=B.w*T,h=B.h*T,tm=performance.now()/1000;ctx.save();
 switch(b.k){
  case 'hive77':{shad77(x+16,y+28,12,4);ctx.fillStyle='#6a4422';ctx.fillRect(x+14,y+14,4,14);for(let i=0;i<4;i++){const r=11-i*1.6;ball77(x+16,y+12-i*5,r,'#ffd860','#b07a10',1,.55)}ctx.fillStyle='#3a2408';ctx.beginPath();ctx.arc(x+16,y+11,2.2,0,7);ctx.fill();
   for(let i=0;i<3;i++){const a=tm*2+i*2.1;ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(x+16+Math.cos(a)*14,y+2+Math.sin(a*1.3)*7,1.6,0,7);ctx.fill();ctx.fillStyle='#222';ctx.fillRect(x+15.5+Math.cos(a)*14,y+1.5+Math.sin(a*1.3)*7,1,1)}
   if(HOME.builds.includes(b)&&hiveReady77(b)){ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText('🍯',x+16,y-14)}if(HOME.builds.includes(b)&&Math.hypot(P.x-x-16,P.y-y-32)<44)homeChip(hiveReady77(b)?'กด E เก็บน้ำผึ้ง':'ผึ้งกำลังทำงาน 🐝',x+16,y+44);break}
  case 'sty':{shad77(x+w/2,y+h-2,w/2+2,5);ctx.fillStyle='#8a6a48';ctx.fillRect(x+2,y+h*.35,w-4,h*.65-2);const rg=ctx.createLinearGradient(0,y-h*.1,0,y+h*.4);rg.addColorStop(0,'#c8784a');rg.addColorStop(1,'#8a4a2a');ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(x-4,y+h*.4);ctx.lineTo(x+w/2,y-h*.1);ctx.lineTo(x+w+4,y+h*.4);ctx.fill();
   ctx.fillStyle='rgba(90,60,30,.55)';ctx.beginPath();ctx.ellipse(x+w*.75,y+h-8,12,4,0,0,7);ctx.fill();ctx.fillStyle='#3a2410';ctx.fillRect(x+w/2-9,y+h-24,18,22);ctx.fillStyle='#ffb0c0';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText('🐷',x+w/2,y+h*.32);break}
  case 'path77':{const g=ctx.createLinearGradient(0,y,0,y+T);g.addColorStop(0,'#c8c4b8');g.addColorStop(1,'#9a968a');ctx.fillStyle=g;for(const [a,c,r] of [[9,10,7],[22,9,6],[15,22,7.5],[26,24,4]]){ctx.beginPath();ctx.ellipse(x+a,y+c,r,r*.75,0,0,7);ctx.fill()}ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x+6,y+7,4,1.5);ctx.fillRect(x+12,y+19,4,1.5);break}
  case 'pfence77':{ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x,y+27,T,3);for(const px of [4,14,24]){const g=ctx.createLinearGradient(x+px,0,x+px+5,0);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#c8ccd6');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+px,y+28);ctx.lineTo(x+px,y+8);ctx.lineTo(x+px+2.5,y+4);ctx.lineTo(x+px+5,y+8);ctx.lineTo(x+px+5,y+28);ctx.fill()}ctx.fillStyle='#e8eaf0';ctx.fillRect(x,y+12,T,3);ctx.fillRect(x,y+21,T,3);break}
  case 'hay77':{shad77(x+16,y+28,14,4);ball77(x+16,y+18,13,'#ffe890','#c8a040',1.1,.8);ctx.strokeStyle='rgba(140,100,30,.5)';ctx.lineWidth=.8;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(x+5+i*3.5,y+12+(i%2)*3);ctx.lineTo(x+7+i*3.5,y+24);ctx.stroke()}break}
  case 'arch77':{for(const sx of [x+4,x+w-8]){ctx.fillStyle='#8a5a2e';ctx.fillRect(sx,y-26,4,54)}ctx.strokeStyle='#8a5a2e';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+w/2,y-24,w/2-6,Math.PI,0);ctx.stroke();
   for(let i=0;i<16;i++){const a=Math.PI+i/15*Math.PI,fx=x+w/2+Math.cos(a)*(w/2-6),fy=y-24+Math.sin(a)*(w/2-6);leaf77(fx,fy,6,a+1.4,GL[0],GL[1],.45);ball77(fx+Math.sin(i)*2,fy,2.4,['#ff6a8a','#ffffff','#ffb0d0','#c08bff'][i%4],'#a03a60')}
   for(const sx of [x+6,x+w-6])for(let j=0;j<4;j++)ball77(sx+(j%2?-2:2),y-14+j*10,2.2,['#ff6a8a','#ffffff'][j%2],'#a03a60');break}
  case 'wmill77':{shad77(x+w/2,y+h-3,w/2,6);const g=ctx.createLinearGradient(x+10,0,x+w-10,0);g.addColorStop(0,'#f4ead6');g.addColorStop(1,'#b8a888');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+12,y+h-2);ctx.lineTo(x+20,y-14);ctx.lineTo(x+w-20,y-14);ctx.lineTo(x+w-12,y+h-2);ctx.fill();
   ctx.fillStyle='#8a3a22';ctx.beginPath();ctx.moveTo(x+16,y-12);ctx.lineTo(x+w/2,y-34);ctx.lineTo(x+w-16,y-12);ctx.fill();ctx.fillStyle='#5a3418';ctx.fillRect(x+w/2-6,y+h-20,12,18);ctx.fillStyle='#9fd0ff';ctx.fillRect(x+w/2-4,y+4,8,8);
   const hx=x+w/2,hy=y-14,a0=tm*1.6;for(let i=0;i<4;i++){const a=a0+i*Math.PI/2;ctx.save();ctx.translate(hx,hy);ctx.rotate(a);ctx.fillStyle='#6a4422';ctx.fillRect(0,-1.5,34,3);ctx.fillStyle='rgba(250,245,230,.92)';ctx.fillRect(10,1.5,22,8);ctx.strokeStyle='rgba(120,90,50,.6)';ctx.lineWidth=.8;ctx.strokeRect(10,1.5,22,8);ctx.restore()}
   ball77(hx,hy,3,'#c8a060','#5a3a18');break}
  case 'gazebo77':{shad77(x+w/2,y+h-2,w/2+4,7);ctx.fillStyle='#d8c8a8';ctx.beginPath();ctx.ellipse(x+w/2,y+h-8,w/2-2,10,0,0,7);ctx.fill();ctx.fillStyle='#b8a888';ctx.fillRect(x+4,y+h-8,w-8,6);
   for(const px of [x+10,x+w-14,x+w/2-2])ctx.fillStyle='#f4ead6',ctx.fillRect(px,y-10,5,h);const rg=ctx.createLinearGradient(0,y-46,0,y-8);rg.addColorStop(0,'#5a8ae0');rg.addColorStop(1,'#2a4a8a');ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(x-6,y-6);ctx.lineTo(x+w/2,y-46);ctx.lineTo(x+w+6,y-6);ctx.closePath();ctx.fill();
   ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.moveTo(x-6,y-6);ctx.lineTo(x+w/2,y-46);ctx.lineTo(x+w/2-8,y-40);ctx.lineTo(x+4,y-6);ctx.fill();ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(x+w/2,y-48,3,0,7);ctx.fill();ctx.fillStyle='#8a5a2e';ctx.fillRect(x+w/2-14,y+h-20,28,5);break}}
 ctx.restore()}
{const _db=drawBuild;drawBuild=function(b,o){try{if(FT77[b.k]){ctx.save();tree77(b);ctx.restore();return}if(['hive77','sty','path77','pfence77','hay77','arch77','wmill77','gazebo77'].includes(b.k)){bld77(b,o);return}}catch(e){try{ctx.restore()}catch(_){}}return _db.apply(this,arguments)};window.drawBuild=drawBuild}
// ---------- สัตว์ใหม่ (วาด) ----------
function animal77d(a){const t=performance.now()/1000,x=a.x,y=a.y,f=a.vx<0?-1:1,bob=a.mv?Math.abs(Math.sin(t*8+(a.ph||0)))*2:0;ctx.save();shad77(x,y,a.k==='duck'||a.k==='rabbit'?8:13,4);ctx.translate(x,y-bob);ctx.scale(f,1);
 if(a.k==='duck'){ball77(0,-8,8,'#ffffff','#c8ccd6',1.1,.75);ball77(6,-15,4.5,'#ffffff','#d0d4dc');ctx.fillStyle='#ffa020';ctx.beginPath();ctx.ellipse(11,-14,3.5,1.6,0,0,7);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(7,-16.5,1.6,1.6);ctx.fillStyle='#ffa020';ctx.fillRect(-3,-2,2,2.5);ctx.fillRect(2,-2,2,2.5);ctx.fillStyle='rgba(180,190,210,.8)';ctx.beginPath();ctx.ellipse(-2,-8,5,3,-.3,0,7);ctx.fill()}
 else if(a.k==='rabbit'){ball77(-1,-7,7,'#ffffff','#d8d0d8',1.1,.85);ball77(5,-13,4.6,'#ffffff','#e0d8e0');for(const dx of [3,6]){ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(dx,-22,1.8,5.5,dx===3?-.2:.15,0,7);ctx.fill();ctx.fillStyle='#ffb0c8';ctx.beginPath();ctx.ellipse(dx,-22,.8,3.8,dx===3?-.2:.15,0,7);ctx.fill()}
  ctx.fillStyle='#d04a6a';ctx.fillRect(8,-14,1.6,1.6);ctx.fillStyle='#ffb0c8';ctx.fillRect(9,-12,1.5,1);ball77(-8,-6,2.6,'#ffffff','#e0e0e0')}
 else if(a.k==='goat'){ball77(0,-14,12,'#f0ece4','#b8b0a0',1.15,.75);ball77(13,-19,5.5,'#f4f0e8','#c0b8a8',.9,1);ctx.strokeStyle='#8a7a60';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(11,-23);ctx.quadraticCurveTo(8,-30,4,-27);ctx.stroke();ctx.fillStyle='#e8e0d0';ctx.beginPath();ctx.moveTo(15,-15);ctx.lineTo(16,-9);ctx.lineTo(13,-14);ctx.fill();
  ctx.fillStyle='#111';ctx.fillRect(14,-21,1.6,1.6);ctx.fillStyle='#6a5a48';for(const lx of [-8,-3,5,9])ctx.fillRect(lx,-6,2.6,6)}
 else if(a.k==='pig'){ball77(0,-11,10,'#ffc8d0','#e07a90',1.2,.8);ball77(11,-13,5.5,'#ffd0d8','#e88a9a');ctx.fillStyle='#f0909e';ctx.beginPath();ctx.ellipse(16,-12,2.6,2.2,0,0,7);ctx.fill();ctx.fillStyle='#a04a5a';ctx.fillRect(15.5,-12.6,.9,1.2);ctx.fillRect(17,-12.6,.9,1.2);
  ctx.fillStyle='#111';ctx.fillRect(12,-16,1.6,1.6);ctx.fillStyle='#ffb0bc';ctx.beginPath();ctx.moveTo(8,-18);ctx.lineTo(11,-23);ctx.lineTo(12,-17);ctx.fill();ctx.fillStyle='#e07a90';for(const lx of [-7,-2,4,8])ctx.fillRect(lx,-4,2.6,4);ctx.strokeStyle='#e07a90';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(-12,-13,2,0,5);ctx.stroke()}
 ctx.restore();const A=FA77[a.k];if(a.ready&&(a.k!=='pig'||HOME.day-(a.td===undefined?-9:a.td)>=2)){ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText(IT77[A.pr][1],x,y-30)}else if(a.fed!==HOME.day){ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText('🌿?',x,y-28)}}
{const _da=drawAnimal;drawAnimal=function(a){if(a&&FA77[a.k]){try{return animal77d(a)}catch(e){}return}return _da.apply(this,arguments)};window.drawAnimal=drawAnimal}
// ---------- ป้ายระดับฟาร์มบนจอ (เฉพาะในที่ดิน) ----------
{const el=document.createElement('div');el.id='farm77';el.hidden=true;el.style.cssText='position:absolute;left:50%;transform:translateX(-50%);top:calc(6px + var(--st,0px));z-index:14;background:linear-gradient(180deg,rgba(40,70,20,.88),rgba(20,40,10,.88));border:1px solid #9ee86a;border-radius:12px;padding:3px 10px;font:700 12px system-ui,"Noto Sans Thai",sans-serif;color:#eaffd8;pointer-events:auto;cursor:pointer;min-width:150px;text-align:center';
 el.onclick=()=>{try{farmBook77()}catch(e){}};gid('wrap').appendChild(el);
 setInterval(()=>{try{const on=!!(D&&D.home)&&titleEl.hidden;el.hidden=!on;if(!on)return;const l=flv77(),a=fxpAt77(l),b=fxpAt77(l+1),p=l>=20?1:Math.max(0,Math.min(1,((F77().xp|0)-a)/(b-a)));
  el.innerHTML='🌾 ฟาร์ม Lv.'+l+' · วันที่ '+HOME.day+'<div style="height:4px;background:rgba(0,0,0,.4);border-radius:3px;margin-top:2px"><i style="display:block;height:100%;width:'+(p*100).toFixed(0)+'%;background:linear-gradient(90deg,#9ee86a,#ffe060);border-radius:3px"></i></div>'}catch(e){}},700)}
// ทำให้แปลงเดิมที่ขุดไว้แล้วแสดงแบบใหม่ทันที (ถ้าสร้างแผนที่ที่ดินไปแล้ว)
try{if(ZCACHE[300]){for(const key in HOME.tiles){const [x,y]=key.split(',').map(Number);homePaintTile(x,y)}homeObjects()}}catch(e){}

// =====================================================================
// B) เนื้อเรื่องภาค 3: “ผนึกจักรพรรดิเงา” (บท 18–26)
// =====================================================================
// ตัวนับเหตุการณ์
{const _mk=mobKill;mobKill=function(m){let lb=null,pb=false;try{if(m&&m.lb62&&typeof in62==='function'&&in62()&&!D.won)lb=D.lb62;pb=!!(m&&m.pb72&&!m.pbRew72)}catch(e){}const r=_mk.apply(this,arguments);
  try{if(lb!=null&&D&&D.won===1){STORY.lbn77=(STORY.lbn77|0)+1;(STORY.lb77||(STORY.lb77={}))[lb]=1;saveStory()}if(pb&&m.pbRew72){STORY.pbn77=(STORY.pbn77|0)+1;saveStory()}}catch(e){}return r};window.mobKill=mobKill}
{const _ww=wbWin10;wbWin10=function(d){const r=_ww.apply(this,arguments);try{const now=Date.now();if(now-(STORY.wbt77|0)>10*60000){STORY.wbt77=now;STORY.wbn77=(STORY.wbn77|0)+1;saveStory()}}catch(e){}return r};window.wbWin10=wbWin10}
const B77=(id,cur)=>{const b=STORY.b77||(STORY.b77={});if(b[id]===undefined){b[id]=cur;saveStory()}return b[id]};
const enh77=()=>{try{const id=P.armor&&P.armor.sword;return id?(ENH[id]|0):0}catch(e){return 0}};
const dgm77=()=>Math.max(0,(DG.max|0)-1);
try{const free=STCH.findIndex(c=>c.free);if(free>0&&!STCH.some(c=>c.ch77)){
 if(!STCH[free].intro)STCH[free].intro='เอลโดเรียสงบสุขแล้ว เจ้าจะสำรวจ ตีบวก ทำฟาร์ม หรือท้าดันเจี้ยนต่อก็ได้ตามใจ — ประตูปราสาทเปิดต้อนรับเจ้าเสมอ';
 const L=[
  {ch77:1,id:'lb1',t:'บทที่ 18: เสียงจากแท่นผนึก',d:'ปราบบอสตำนานตัวใดก็ได้ 1 ครั้ง (ประตูหอคอย → แท่นผนึกอสูร)',need:()=>[(STORY.lbn77|0)-B77('lb1',STORY.lbn77|0),1],sat:()=>{STORY.lbn77=(STORY.lbn77|0)+1},
   intro:'ยอดหอคอยสงบลงแล้ว แต่ทุกคืนแท่นผนึกอสูรใต้หอคอยสั่นสะเทือน… อสูรทั้งหกที่ถูกผนึกไว้ตั้งแต่ยุคก่อนกำลังตื่น ไปทดสอบผนึกด้วยการปราบมันสักตัว',
   done:['ผนึกยังแข็งแรง… แต่ข้าเห็นรอยร้าวสีม่วงบนแท่นหิน','นักบวชบอกว่าพลังผนึกมาจากผืนดิน — ถ้าผืนดินอ่อนแอ ผนึกก็อ่อนแอ'],rw:{coin:30000,xp:20000,estone:15,bless:3}},
  {ch77:1,id:'farm',t:'บทที่ 19: ผืนดินที่ฟื้นคืน',d:'เก็บผลผลิตในที่ดินผู้กล้า 40 ชิ้น (ผัก ผลไม้ ผลผลิตสัตว์ น้ำผึ้ง)',need:()=>[(F77().hv|0)-B77('farm',F77().hv|0),40],sat:()=>{F77().hv=(F77().hv|0)+40},
   intro:'ผืนดินของเจ้าคือหัวใจของผนึก! กลับไปที่ดินผู้กล้า ปลูกผัก เลี้ยงสัตว์ ปลูกต้นไม้ผล ให้แผ่นดินกลับมามีชีวิต แล้วเก็บผลผลิตมาให้ได้ 40 ชิ้น',
   done:['ดูสิ! รอยร้าวบนแท่นผนึกเริ่มเลือนลง ผืนดินที่อุดมสมบูรณ์ส่งพลังกลับไปจริง ๆ','แต่ศึกที่จะมาถึงต้องการอาวุธที่แข็งแกร่งยิ่งกว่านี้'],rw:{coin:25000,xp:15000,estone:20,scroll:3}},
  {ch77:1,id:'enh',t:'บทที่ 20: ช่างผู้ไม่ยอมแพ้',d:'ตีบวกอาวุธที่ถืออยู่ให้ถึง +10',need:()=>[Math.min(10,enh77()),10],sat:()=>{const id=P.armor.sword;if(id)ENH[id]=Math.max(ENH[id]|0,10)},
   intro:'ช่างหนวดเหล็กบอกว่าอาวุธทั่วไปทำร้ายอสูรในผนึกไม่ได้ ต้องตีบวกให้ถึง +10 เสียก่อน — ระวังนะ ตีบวกอาจแหก แหกครบสามครั้งของจะพัง แต่บอรินซ่อมให้ได้',
   done:['อาวุธเล่มนี้สะท้อนแสงอรุณ! ช่างหนวดเหล็กภูมิใจในตัวเจ้ามาก','อสูรตัวต่อไปแข็งแกร่งเกินกว่าจะสู้คนเดียว จงหาพวกพ้อง'],rw:{coin:40000,xp:25000,estone:20,bless:5}},
  {ch77:1,id:'pb',t:'บทที่ 21: สายใยแห่งปาร์ตี้',d:'ปราบอสูรปาร์ตี้ในแมพป่า 3 ตัว (ไปเป็นปาร์ตี้ได้ — เมนู 👥 ปาร์ตี้)',need:()=>[(STORY.pbn77|0)-B77('pb',STORY.pbn77|0),3],sat:()=>{STORY.pbn77=(STORY.pbn77|0)+3},
   intro:'อสูรที่หลุดจากรอยร้าวผนึกไปซ่อนในป่าลึก มันแข็งแกร่งขึ้นทุกครั้งที่มีผู้กล้าเข้าใกล้ ชวนสหายจาก 🌐 ผู้คน ตั้งปาร์ตี้ แล้วปราบมันให้ได้สามตัว',
   done:['ฝีมือการร่วมรบของพวกเจ้าไร้ที่ติ!','จากร่างอสูรมีเศษเงาไหลกลับลงไปใต้ดิน… ลึกลงไปในห้วงลึกที่เราคิดว่าผนึกไปแล้ว'],rw:{coin:45000,xp:30000,estone:20,rune:3}},
  {ch77:1,id:'dg150',t:'บทที่ 22: ห้วงลึกชั้นร้อยห้าสิบ',d:'พิชิตดันเจี้ยนชั้น 150',go:'cave',need:()=>[Math.min(150,dgm77()),150],sat:()=>{DG.max=Math.max(DG.max,151)},
   intro:'เงาไม่ได้ตายไปพร้อมเงาแห่งห้วงลึก มันไหลลึกลงไปกว่าชั้นร้อย ลงไปให้ถึงชั้นร้อยห้าสิบ แล้วตามรอยมันไป',
   done:['ที่ชั้นร้อยห้าสิบ เจ้าพบตราประทับของ “จักรพรรดิเงา” สลักไว้บนกำแพง…','มันคือผู้ที่ถูกผนึกไว้ในแท่นผนึกอสูรตัวสุดท้าย! เราต้องทำให้ผนึกอีกห้าตัวอ่อนแรงลงก่อน มันจึงจะยอมปรากฏ'],rw:{coin:60000,xp:45000,estone:25,bless:5}},
  {ch77:1,id:'lb3',t:'บทที่ 23: ห้าผนึกแตกร้าว',d:'ปราบบอสตำนานต่างกันให้ครบ 3 ตัว',need:()=>[Math.min(3,Object.keys(STORY.lb77||{}).length),3],sat:()=>{STORY.lb77=Object.assign(STORY.lb77||{},{0:1,1:1,2:1})},
   intro:'จงท้าทายผู้เฝ้าผนึกให้ครบสามตน — ราชาพฤกษาหนาม นาคราช หมาป่าเหมันต์ หรือใครก็ได้ — ยิ่งผนึกอื่นอ่อนแรง จักรพรรดิเงายิ่งถูกบังคับให้ตื่น',
   done:['สามผนึกสงบลงด้วยมือเจ้า แท่นผนึกตัวสุดท้ายเริ่มส่องแสงสีดำ','มันส่งเปลวไฟโลกออกมาอีกครั้งเพื่อทดสอบพวกเรา!'],rw:{coin:70000,xp:55000,estone:25,rune:3}},
  {ch77:1,id:'wb3',t:'บทที่ 24: ไฟโลกครั้งที่สาม',d:'ร่วมปราบบอสโลก 3 ครั้ง (12:00 / 20:00 · ประตูมิติบอสโลกในทุ่งหญ้า)',need:()=>[(STORY.wbn77|0)-B77('wb3',STORY.wbn77|0),3],sat:()=>{STORY.wbn77=(STORY.wbn77|0)+3},
   intro:'จักรพรรดิเงาปลุกมหาอสูรอัคคีขึ้นมาซ้ำแล้วซ้ำเล่า รวมพลผู้กล้าทั้งแผ่นดินที่ประตูมิติบอสโลก แล้วดับไฟของมันให้ได้สามครั้ง',
   done:['ไฟโลกดับลงเป็นครั้งที่สาม เถ้าถ่านไม่ลอยกลับไปที่หอคอยอีกแล้ว','เหลือเพียงขั้นสุดท้าย — ลงไปที่ชั้นสองร้อยเพื่อทำลายแหล่งพลังของมัน'],rw:{coin:80000,xp:65000,estone:30,bless:6}},
  {ch77:1,id:'dg200',t:'บทที่ 25: บัลลังก์ใต้ห้วงลึก',d:'พิชิตดันเจี้ยนชั้น 200',go:'cave',need:()=>[Math.min(200,dgm77()),200],sat:()=>{DG.max=Math.max(DG.max,201)},
   intro:'ที่ชั้นสองร้อยคือบัลลังก์ที่จักรพรรดิเงาใช้ดูดพลังจากใต้พิภพ ทำลายมันเสีย แล้วมันจะไม่มีที่ซ่อนอีกต่อไป',
   done:['บัลลังก์เงาแตกสลาย! เสียงคำรามดังก้องมาจากแท่นผนึกอสูร','จักรพรรดิเงาไม่มีที่หนีแล้ว จงไปปิดตำนานของมันด้วยมือเจ้าเอง'],rw:{coin:100000,xp:80000,estone:35,rune:3}},
  {ch77:1,id:'emp',t:'บทที่ 26: ผนึกจักรพรรดิเงา',d:'ปราบจักรพรรดิเงา (บอสตำนานตัวที่ 6 · แท่นผนึกอสูร)',need:()=>[STORY.lb77&&STORY.lb77[5]?1:0,1],sat:()=>{(STORY.lb77||(STORY.lb77={}))[5]=1},
   intro:'นี่คือศึกสุดท้ายแห่งภาคนี้ จักรพรรดิเงา — ผู้อยู่เบื้องหลังเงาแห่งห้วงลึกและมหาทรราช — รออยู่ในแท่นผนึก จงผนึกมันให้สิ้นซาก!',
   done:['จักรพรรดิเงาสลายเป็นแสงอรุณ… ผนึกทั้งหกกลับมาสงบนิ่ง','ข้า อัลดริคที่สาม ขอมอบฉายา “ผู้ผนึกจักรพรรดิเงา” แด่เจ้า — วีรชนแห่งเอลโดเรียตลอดกาล'],rw:{coin:150000,xp:120000,estone:50,bless:10,rune:3}}];
 STCH.splice(free,0,...L);try{updTrack()}catch(_){}}}catch(e){console.warn('[story77]',e)}
// ลูกศรนำทาง: บทที่ไปแท่นผนึก/ปาร์ตี้/ฟาร์ม (ถ้าเกมไม่มีจุดนำทาง ก็ไม่แสดง)
// ฉายาเมื่อจบบท 26
setInterval(()=>{try{const i=STCH.findIndex(c=>c.ch77&&c.id==='emp');if(i>0&&STORY.ch>i&&!STORY.t77){STORY.t77=1;saveStory();P.title='ผู้ผนึกจักรพรรดิเงา';try{chatAnn((P.name||'ผู้กล้า')+' ผนึกจักรพรรดิเงาสำเร็จ — ผู้ผนึกจักรพรรดิเงา!')}catch(_){}try{banner('👑 ผู้ผนึกจักรพรรดิเงา','จบเนื้อเรื่องภาค 3 แล้ว!','green')}catch(_){}try{saveGame(true)}catch(_){}}}catch(e){}},2000);

// =====================================================================
// C) 📖 คู่มือผู้กล้า (อัปเดต)
// =====================================================================
const GB77=[
 ['🏰 เริ่มต้น','จุดเกิดคือ<b>ลานหน้าปราสาท</b> · คุยกับ<b>พระราชา</b>ในปราสาทเพื่อเริ่มเนื้อเรื่อง (มีลูกศรนำทางบนจอ) · เดินออก<b>ขอบซ้ายของเมือง</b> = ทุ่งหญ้า (มอนเลเวลต่ำ) · NPC ที่มี <b style="color:#ffd84a">!</b> บนหัวมีเควสรองให้ · กลางคืน (21:00–05:30) ชาวเมือง<b>เข้าบ้านไปนอน</b> — ไปที่จุดประจำแล้วกดโต้ตอบ = เคาะประตูปลุกออกมาคุย'],
 ['🪵 วัตถุดิบ','<b>ไม้</b>: ตัดต้นไม้ในทุ่งหญ้า/ป่า (ป่าละเมาะ → ป่าลำธาร → ป่าสน → ป่าหมอก) · <b>แร่</b>: ประตูมิติในทุ่งหญ้า → เหมืองเหล็ก/ทองแดง/เงิน/ทอง/เพชร · <b>ของจากมอน</b>: เจลสไลม์ ปีกค้างคาว เปลือกด้วง หนังหมาป่า ผงวิญญาณ เกล็ดมังกร แกนหินเวท · <b>แก่นเวทมนตร์</b>: หลอมจากเศษแก่นเวทที่โต๊ะคราฟ · ว่ายน้ำได้ในลำธาร/บ่อของแมพป่า (มอนข้ามน้ำไม่ได้)'],
 ['⚒️ ตีอาวุธ/ชุด/ตีบวก','ร้านอาวุธเกราะ (ซ้ายบนของเมือง): <b>เตาหลอม</b> แร่→แท่ง · <b>โต๊ะคราฟ</b> สร้างอาวุธ/ชุด/อาวุธประจำอาชีพ · <b>แท่นตีบวก</b> ใช้หินเสริมพลัง — <b>ตีบวกมีโอกาสแหก 💥</b> (ยิ่งสูงยิ่งเสี่ยง · หินอวยพรกันระดับลดตั้งแต่ +3) · <b>แหกสะสม 3 ครั้ง = 💔 พัง</b> โบนัสตีบวกหายและตีต่อไม่ได้ → <b>ซ่อมที่ช่างหนวดเหล็ก (บอริน)</b> ใช้ 🪙 + 💎 หินเสริมพลัง ได้ระดับเดิมคืนและตัวนับแหกเริ่มใหม่ · ตีบวกชุดถึง +7 มีออร่า 3D · เซ็ตระดับสูงต้องรับ<b>ตำราช่าง</b>ก่อน'],
 ['🎓 อาชีพ & สกิล','Lv.10 คุยกับ<b>ปรมาจารย์อาชีพ</b> (จัตุรัส) เลือก 1 ใน 11 อาชีพ · สกิลช่อง 1–3 ปลดล็อกเองตามเลเวล · สกิลช่อง 4–6 <b>ซื้อที่ร้านสกิล</b> (5,000 / 12,000 / 30,000 🪙 ที่ Lv.50/75/100) · เรียนแล้วจะได้<b>พาสซีฟเสริมสกิล</b> 3 ขั้นตามเลเวล (ดาเมจ+ · คูลดาวน์− · มานา−) · <b>อัลติเมท</b>ไม่ซ้ำกันทุกอาชีพ ระหว่างร่ายไม่โดนดาเมจ · ต้องถืออาวุธประจำอาชีพจึงร่ายได้'],
 ['🗝️ ดันเจี้ยน','เข้าที่<b>รูปปั้นในท้องพระโรง</b> (ในปราสาท) · แต่ละชั้นมีบอส → ได้กุญแจ → เปิดกล่องแล้วกดลงชั้นต่อไป · <b>ชั้นที่เคยผ่านแล้ว</b>บอสไม่ให้กุญแจ กล่องให้แค่ของเล็กน้อย · บอสตายแล้วรอเกิดใหม่ 15 นาที (ออก-เข้าเกมก็ไม่รีเซ็ต)'],
 ['🗼 หอคอยบอส','ประตูหอคอยอยู่<b>มุมขวาบนของเมือง</b> · 12 ชั้น ชั้นละบอส 1 ตัว เวลา 5 นาที · <b>ชั้นที่เคลียร์แล้วเข้าซ้ำไม่ได้</b> ต้องท้าชั้นถัดไป'],
 ['🐲 บอสตำนาน (ชุดบอส)','ที่<b>ประตูหอคอย → แท่นผนึกอสูร</b> (หรือเมนู 🐲) · 6 บอส (Lv.20–115) เลือดมหาศาล หลบวงแดง · ชนะได้<b>ตราอสูร</b> (10 อัน แลกชิ้นเซ็ตที่ต้องการ) และมีโอกาสดรอปชิ้นเซ็ตทันที · ชนะแล้วรอ 30 นาทีต่อตัว · ชุดบอส 6 เซ็ต: หนามพงไพร → เกล็ดอสรพิษ → เขี้ยวเหมันต์ → ฟาโรห์สุริยัน → มังกรโลหิต → จักรพรรดิเงา'],
 ['🐉 บอสโลก','ปรากฏ <b>12:00 และ 20:00</b> น. อยู่ 30 นาที · เดินไป<b>ประตูมิติบอสโลก (ซุ้มหิน 3D) ในทุ่งหญ้า</b> เหนือประตูมิติ — <b>เปิดเฉพาะตอนบอสเกิด</b> (ซุ้มดับ = ยังเข้าไม่ได้) · ตีร่วมกับทุกคน จัดอันดับตามดาเมจ · ชนะ: มีโอกาสได้<b>ชิ้นชุดบอส</b> + <b>💠 10–30 เหรียญ</b>ตามดาเมจ'],
 ['💠 เหรียญแฟชั่น & 💝 โดเนท','ใช้ซื้อชุด/อาวุธแฟชั่นที่<b>บูติกมาดามโรส</b> (เปลี่ยนรูปลักษณ์ ✂️ ก็อยู่ที่บูติก) · ยอดเหรียญเก็บที่เซิร์ฟเวอร์ ของที่ซื้อผูกกับบัญชี ใช้ได้ทุกเครื่อง · <b>ได้ฟรีจากการเล่น สูงสุด 10/วัน</b>: เข้าเกม +2 · ชนะบอสตำนาน +2 · บอสโลก +3 · แลก 30,000 🪙 → 1 💠 (วันละ 5) · <b>💝 โดเนท</b> = สนับสนุนเกมด้วยความสมัครใจ ไม่บังคับ — เลือกแพ็ก ได้รหัสอ้างอิง โอนแล้วรอผู้ดูแลอนุมัติ · เปิดที่เมนูหลัก 💠'],
 ['🛒 ตลาดนัด (ซื้อขายกับผู้เล่น)','อยู่ที่<b>ประตูใต้ของกำแพงเมือง</b> — เดินตามทางหินจากถนนล่างลงไป (มีป้ายตลาดนัดและธงทิว) · <b>เดินชนประตูหรือกดโต้ตอบ = เข้าตลาด</b> · ตั้งแผงขายของ/ซื้อของจากผู้เล่นคนอื่น · ออกจากตลาดจะกลับมายืนหน้าประตู · <b>โรงประมูล</b>ก็ซื้อขายได้'],
 ['👥 ปาร์ตี้ & เพื่อน','เมนูหลัก <b>👥 ปาร์ตี้</b>: ดูสมาชิก (อาชีพ/เลเวล/เลือด/อยู่แมพไหน) · เชิญ (พิมพ์ชื่อหรือเลือกจากคนออนไลน์) · เตะ · โอนหัวหน้า · ออก · เมนู <b>🌐 ผู้คน</b>: คนออนไลน์ทั้งโลก ค้นชื่อ · แท็บเพื่อน · เพิ่ม/ลบเพื่อน · ชวนปาร์ตี้ · กระซิบ · ท้าดวล · <b>👹 อสูรปาร์ตี้</b>ในแมพป่า เลือดเพิ่มตามจำนวนคนในแมพ รางวัลดี เกิดใหม่ 20 นาที · <b>🛡️ กิลด์ผู้เล่น</b>เปิดจากเมนูหลัก'],
 ['🏡 ที่ดินผู้กล้า (ฟาร์ม)','ปลดล็อกหลังจบบท 13 · ไปที่<b>ประตูมิติในทุ่งหญ้า → 🏡</b> · <b>จอบ</b> ขุดแปลง → กด E ปลูกเมล็ด → <b>บัวรดน้ำ</b> ทุกวัน → <b>เคียว</b> เก็บเกี่ยว · <b>ค้อน</b> สร้างบ้าน/เล้า/โรงนา/ของตกแต่ง · <b>ต้นไม้ผล</b>โต 5 ขั้นแล้วออกผลเป็นรอบ (ไม่ต้องรดน้ำ) · <b>สัตว์</b> ป้อนหญ้าแห้งวันนี้ พรุ่งนี้ได้ผลผลิต · <b>รังผึ้ง</b>ให้น้ำผึ้ง · <b>ระดับฟาร์ม</b> ขึ้นจากการเก็บผลผลิต ปลดล็อกพืช/ต้นไม้/สัตว์ใหม่ (📒 สมุดฟาร์มที่ลุงบุญมี หรือแตะป้ายบนจอ) · นอนที่บ้านได้บัฟ'],
 ['🐎 สัตว์ขี่ & สัตว์เลี้ยง','ซื้อที่<b>ลุงบุญมี</b> (ที่ดินผู้กล้า) หรือร้านสัตว์ในเมือง · สัตว์ขี่ (ปุ่ม 🐎 / R): ม้า หมาป่าเงาจันทร์ และ 5 ตัวใหม่มีออร่า 3 มิติ — มังกรทองจักรพรรดิ · มังกรน้ำแข็งนิรันดร์ · พยัคฆ์ขาวสายฟ้า · กิเลนอัคคีมงคล · อาชาฟีนิกซ์ (มีเลเวลขั้นต่ำ) · สัตว์เลี้ยงตามติดทุกที่ ดูดของดรอป บางตัวมีโบนัสสเตตัส'],
 ['📜 เควส','<b>เนื้อเรื่อง</b>: พระราชา 26 บท (ภาค 1 ผลึกอรุณ บท 0–13 · ภาค 2 เงาเหนือหอคอย บท 14–17 · <b>ภาค 3 ผนึกจักรพรรดิเงา บท 18–26</b>) · <b>เควสกิลด์</b>: บอร์ดในกิลด์นักผจญภัย (รับได้ 3 เควส) · <b>เควสรอง</b>: ชาวเมืองที่มี ! · <b>ตำราช่าง</b>: ช่างหนวดเหล็ก'],
 ['🏦 อื่น ๆ','<b>ธนาคาร</b> ฝากเงินได้ดอกเบี้ย · <b>คลังสมบัติ</b> ฝากของ · <b>บูติก</b> ชุด/อาวุธแฟชั่น · <b>🏅 ฉายา</b> และ <b>🏆 อันดับ</b> ในเมนูหลัก · ตกปลาที่ริมน้ำ · เกมออนไลน์เซฟอัตโนมัติทุก 20 วินาที + ซิงก์คลาวด์']];
function next77(){try{const c=STCH[STORY.ch];if(c&&c.ch77&&STORY.intro){const n=c.need?c.need():null;return STORY.st==='report'?'กลับไปรายงานพระราชาที่ปราสาท ('+c.t+' สำเร็จแล้ว)':'📜 '+c.t+' — '+c.d+(n?' ('+Math.min(n[0],n[1])+'/'+n[1]+')':'')}}catch(e){}return ''}
const _og66=window.openGuide66;
function openGuide77(){if(_og66)_og66();const el=gid('gb66');if(!el)return;const bd=el.querySelector('.bd');if(!bd)return;for(const d of bd.querySelectorAll('details'))d.remove();
 const nx=next77();if(nx){const n=bd.querySelector('.nx');if(n)n.insertAdjacentHTML('beforeend','<br>'+nx)}
 bd.insertAdjacentHTML('beforeend',GB77.map(([t,d],i)=>'<details'+(i===0&&P.lv<10?' open':'')+'><summary>'+t+'</summary><div>'+d+'</div></details>').join(''))}
window.openGuide66=openGuide77;window.openGuide77=openGuide77;
try{const i=PM7.findIndex(m=>m[1]==='คู่มือ');if(i>=0)PM7[i]=['📖','คู่มือ',()=>openGuide77()];pmRender7()}catch(e){}
}catch(e){console.warn('fix78',e)}
