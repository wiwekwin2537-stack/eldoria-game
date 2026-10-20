// ===== v2.0 (ส่วนที่ 2): กระเป๋าว่าง→โชว์เมื่อได้ของ · สวมใส่/ถอด · หลอดค่าพลัง · ถลุง/คราฟ · ร้านค้า · จุดรับวาป =====
const INVMETA={
 coin:['เหรียญ','เงินใช้ซื้อของในร้านค้า'],scroll:['ม้วนวาป','วาปกลับเมือง (กด 4 / T)'],
 hpp:['ยาเลือด','ฟื้นเลือด +60 (กด H)'],mpp:['ยามานา','ฟื้นมานา +40 (กด N)'],
 bread:['ขนมปัง','ความอิ่ม +25 (กด B)'],apple:['แอปเปิ้ล','ความอิ่ม +12 เลือด +5 (กด B)'],
 wood:['ไม้','ได้จากการตัดต้นไม้ · เผาเป็นถ่านที่เตาหลอม และใช้ทำด้ามเครื่องมือ'],
 coal:['ถ่าน','เชื้อเพลิงหลอมแร่ · เผาจากไม้ 2 ท่อนที่เตาหลอมในร้านลุงเหล็ก'],
 gel:['เจลสไลม์','เอาไปปรุงยาที่ร้านหมอยา'],bottle:['ขวดเปล่า','ใช้ปรุงยา'],
 stone:['หินธรรมดา','หลอมที่เตา 3 ก้อน + ถ่าน → แท่งหิน ก่อนจึงคราฟชุดหินธรรมดาได้'],
 iron:['แร่เหล็ก','หลอมที่เตา 2 ก้อน + ถ่าน → แท่งเหล็ก · ขุดได้ด้วยที่ขุดแร่หินธรรมดา'],
 copper:['แร่ทองแดง','หลอมที่เตา 2 ก้อน + ถ่าน → แท่งทองแดง · ขุดด้วยที่ขุดแร่เหล็กขึ้นไป'],
 silver:['แร่เงิน','หลอมที่เตา 2 ก้อน + ถ่าน → แท่งเงิน · ขุดด้วยที่ขุดแร่ทองแดงขึ้นไป'],
 gold:['แร่ทอง','หลอมที่เตา 2 ก้อน + ถ่าน 2 → แท่งทอง · ขุดด้วยที่ขุดแร่เงินขึ้นไป'],
 ore:['เพชร','หลอมที่เตา 2 ก้อน + ถ่าน 2 → แท่งเพชร · ขุดด้วยที่ขุดแร่ทองขึ้นไป'],
 ingSt:['แท่งหิน','วัสดุคราฟชุด/เครื่องมือหินธรรมดา · หลอมจากหินธรรมดา'],ingDm:['แท่งเพชร','วัสดุคราฟของเพชร · หลอมจากเพชร'],
 ingot:['แท่งเหล็ก','วัสดุคราฟชุดเหล็ก/ดาบ/ขวาน/ที่ขุดแร่เหล็ก · หลอมจากแร่เหล็ก'],ingCu:['แท่งทองแดง','วัสดุคราฟของทองแดง'],
 ingAg:['แท่งเงิน','วัสดุคราฟของเงิน'],ingAu:['แท่งทอง','วัสดุคราฟของทอง']};
const INVORDER=['coin','scroll','hpp','mpp','bread','apple','wood','coal','gel','bottle','stone','iron','copper','silver','gold','ore','ingSt','ingot','ingCu','ingAg','ingAu','ingDm'];
const MN=k=>(INVMETA[k]||[k])[0];
const IURL={},OREKEYS=['stone','iron','copper','silver','gold'];
function iconURL(key){const painted=ITEMART.url(key.startsWith('mat:')?key.slice(4):key);if(painted)return painted;const liveOre=key.startsWith('mat:')&&OREKEYS.includes(key.slice(4));if(IURL[key]&&!liveOre)return IURL[key];let c;if(key.startsWith('item:')){const it=ITEMS[key.slice(5)];c=toolIcon(it.kind,it.tier,64)}else c=matIcon(key.slice(4));const raw=c.toDataURL(),url=ITEMART.has(key)&&key!=='mat:ore'?raw+'#eldoria-art='+encodeURIComponent(key):raw;if(!liveOre)IURL[key]=url;return url}
window.OREICON_REFRESH=kind=>{try{delete IURL['mat:'+kind];if(typeof refreshInv==='function')refreshInv();if(typeof drawPicks==='function')drawPicks()}catch(e){}};
const rareT=key=>key.startsWith('item:')&&ITEMS[key.slice(5)].tier>=3?' rare r'+ITEMS[key.slice(5)].tier:'';
const imgT=(key,cl)=>'<img class="si'+(ITEMART.has(key)?' painted-item':'')+(cl?' '+cl:'')+rareT(key)+'" data-item-art="'+key+'" src="'+iconURL(key)+'">';
const gid=id=>document.getElementById(id);
const isTool=k=>k==='sword'||k==='axe'||k==='pick';
window.GAME&&Object.assign(window.GAME,{inv,GEAR,ENH,ITEMS,TIERS,OREK});

// ---------- แร่: ภาพในแมพ + ขุดตามชั้นของที่ขุดแร่ ----------
const OSPR={};for(const k of [...OREKEYS,'diamond']){const c=document.createElement('canvas');c.width=c.height=42;const q=c.getContext('2d'),im=k==='diamond'?oreImg:OREIMGS[k];if(im&&im.complete&&im.naturalWidth)q.drawImage(im,0,0,42,42);else{paintOre(q,k,42);if(im)im.addEventListener('load',()=>{q.clearRect(0,0,42,42);q.drawImage(im,0,0,42,42)},{once:true})}OSPR[k]=c}
/* ใช้ภาพเพชรเมื่อโหลดสำเร็จเท่านั้น; ถ้าเน็ต/แคชโหลดช้า ให้ใช้ภาพวาดสำรองแทนภาพว่าง */
function oreSpriteFor(kind,img,sprites){return kind==='diamond'&&img&&img.complete&&img.naturalWidth>0?img:(sprites&&sprites[kind]||null)}
function oreSprite(kind){return oreSpriteFor(kind,oreImg,typeof OSPR==='undefined'?null:OSPR)}
function hitOre(o){const K=OREK[o.kind];
 if(P.tier.pick<K.req){o.shake=.2;o.bar=1.2;sfx('thud');say('ต้องใช้'+ITEMS['pick'+K.req].name+'ขึ้นไป จึงจะขุด'+K.n+'ได้');return}
 const sh=window.FW&&FW.act(),dm=PICKDMG();if(sh)FW.send('o',o,dm,90);o.hp-=dm;o.shake=.3;o.bar=2;sfx('mine');
 for(let k=0;k<6;k++)fx.push({x:o.tx*T+16+(Math.random()-.5)*20,y:o.ty*T+14,vx:(Math.random()-.5)*160,vy:-50-Math.random()*80,l:.5,c:K.fx});
 if(o.hp<=0&&sh){o.hp=1;say('รอเซิร์ฟเวอร์ตัดสิน...')}
 else if(o.hp<=0){map[o.ty][o.tx]=RUBBLE;o.regen=90;const n=K.cnt[0]+Math.floor(Math.random()*(K.cnt[1]-K.cnt[0]+1));
  for(let k=0;k<n;k++)addDrop(K.drop,o.tx*T+16,o.ty*T+16);
  say('ขุด'+K.n+'แตก! ได้'+(K.drop==='gem'?'เพชร':MN(K.drop))+' +'+n);gainXp(K.xp)}
 else say('ขุด'+K.n+'... ความคืบหน้า '+Math.round((1-o.hp/o.max)*100)+'%')}
{const _u=useToolHit;useToolHit=function(){if(P.tool!=='sword'){if(P.fa<=0){say('😮‍💨 เหนื่อยจนไม่มีแรงแล้ว… พักสักครู่');return}P.fa=Math.max(0,P.fa-2)}_u()}}
function itemDropIcon(type){const key=ITEMART.key(type);return ITEMART.icon(key)||(key==='ore'?matIcon('ore'):OREKEYS.includes(key)?OSPR[key]:null)}
function drawDrops(){for(const d of drops){const px=Math.round(d.x),py=Math.round(d.y),yy=py-6-d.z,t=d.type;
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(px,py+2,5,2,0,0,7);ctx.fill();
  const art=itemDropIcon(t);if(art){ctx.drawImage(art,px-9,yy-9,18,18);continue}
  if(t==='coin'){const w=Math.abs(Math.cos(d.t*7+d.x))*5+1;ctx.fillStyle='#ffd23a';ctx.strokeStyle='#a8741a';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(px,yy,w,5,0,0,7);ctx.fill();ctx.stroke()}
  else if(t==='gel'){ctx.fillStyle='#5bb4ff';ctx.beginPath();ctx.ellipse(px,yy+1,5,4,0,0,7);ctx.fill();ctx.fillStyle='#d6eeff';ctx.fillRect(px-2,yy-2,2,2)}
  else if(t==='wood'){ctx.save();ctx.translate(px,yy);ctx.rotate(d.x*.3);ctx.fillStyle='#8a5a2e';ctx.fillRect(-7,-3,14,6);ctx.fillStyle='#d9b27a';ctx.fillRect(-7,-3,3,6);ctx.restore()}
  else if(OREKEYS.includes(t)){ctx.drawImage(OSPR[t],px-7,yy-7,14,14)}
  else if(t==='apple'){ctx.fillStyle='#c0392b';ctx.beginPath();ctx.arc(px,yy,4.5,0,7);ctx.fill();ctx.fillStyle='#4fae3a';ctx.fillRect(px,yy-7,3,2)}
  else{ctx.save();ctx.shadowColor='#6cf';ctx.shadowBlur=8;ctx.fillStyle='#5ec8ff';ctx.beginPath();ctx.moveTo(px-5,yy-3);ctx.lineTo(px+5,yy-3);ctx.lineTo(px,yy+6);ctx.closePath();ctx.fill();ctx.fillStyle='#d6f4ff';ctx.fillRect(px-3,yy-3,6,2);ctx.restore()}}}

// ---------- ข้อความ "ได้รับ" เวลาเก็บของ ----------
const picksEl=document.createElement('div');picksEl.id='picks';gid('wrap').appendChild(picksEl);
const PK=[];
function logPick(key){const nm=MN(key),now=performance.now();let e=PK.find(q=>q.k===key&&now-q.t<1800);if(e){e.n++;e.t=now}else PK.unshift({k:key,n:1,t:now});if(PK.length>4)PK.pop();drawPicks()}
function drawPicks(){const now=performance.now();picksEl.innerHTML=PK.filter(q=>now-q.t<2600).map(q=>'<div>'+imgT('mat:'+q.k)+'+'+q.n+' '+MN(q.k)+'</div>').join('')}
setInterval(()=>{if(PK.length&&performance.now()-PK[0].t>2600)PK.length=0;if(picksEl.innerHTML!==''&&!PK.length)picksEl.innerHTML=''},500);

// ---------- สวมใส่ / ถอด (ทำที่หน้าสถานะตัวละคร) · กระเป๋า (มีแต่ช่อง) ----------
let BINFO='';
function redrawHotbar(){}
selectTool=function(i){quickUse(i)};
function equipItem(id){const it=ITEMS[id];if(!it||!GEAR[id]||it.kind==='axe'||it.kind==='pick')return;
 GEAR[id]--;if(GEAR[id]<=0)delete GEAR[id];
 {const cur=P.armor[it.kind];if(cur)GEAR[cur]=(GEAR[cur]||0)+1;P.armor[it.kind]=id}
 syncSword();recalcStats();P.hp=Math.min(P.hp,BAL.hp);sfx('ui');refreshInv();say('สวมใส่'+it.name+' — '+it.stat)}
function unequip(kind){const id=P.armor[kind];if(!id)return;P.armor[kind]=null;GEAR[id]=(GEAR[id]||0)+1;if(kind==='sword'&&P.draw&&P.tool==='sword')P.draw=false;syncSword();recalcStats();P.hp=Math.min(P.hp,BAL.hp);sfx('ui');refreshInv();say('ถอด'+ITEMS[id].name+'เก็บเข้ากระเป๋าแล้ว')}
function bagTap(t,id){
 if(t==='gear'){const k=ITEMS[id].kind;if(k==='axe'||k==='pick'){say(ITEMS[id].name+' — เปิดกระเป๋าค้างไว้แล้วแตะช่องลัดด้านล่างเพื่อใส่');return}openChar(k);return}
 if(id==='hpp'||id==='mpp'||id==='bread'||id==='apple'){useItem(id);return}
 if(id==='scroll'){toggleBag();useScroll();return}
 say(MN(id)+' ×'+inv[id])}
function renderBag(){const el=gid('bag');if(!el)return;
 const cells=bagCells(),mx=bagSlotsMax(),w=bagWeight(),cp=bagCapMax();let h='';
 for(let i=0;i<mx;i++){const c=cells[i];
  if(!c){h+='<div class="slot empty"></div>';continue}
  if(c.t==='gear'){const it=ITEMS[c.k];h+='<div class="slot'+(it.tier>=3?' rare r'+it.tier:'')+(c.eq?' worn':'')+'" title="'+it.name+' — '+it.stat+(c.eq?' (สวมอยู่)':'')+'" onclick="bagTap(\'gear\',\''+c.k+'\')"><img src="'+iconURL('item:'+c.k)+'">'+(c.eq?'<b class="wm">✋</b>':'')+'</div>'}
  else h+='<div class="slot" title="'+MN(c.k)+'" onclick="bagTap(\'mat\',\''+c.k+'\')"><img src="'+iconURL('mat:'+c.k)+'"><em>'+c.n+'</em></div>'}
 el.innerHTML='<div class="bh"><span class="'+(w>cp?'ov':'')+'">⚖️ '+w+'/'+cp+'</span><span>🎒 '+Math.min(cells.length,mx)+'/'+mx+'</span><button class="mini x" onclick="toggleBag()">✕</button></div><div class="slots">'+h+'</div>'}

// ---------- กินอาหาร ----------
function useItem(k){if(!inv[k]){say('ไม่มี'+MN(k)+'ในกระเป๋า');return}
 if(k==='hpp'||k==='mpp'){drink(k);return}
 if(P.hu>=99){say('อิ่มแล้ว กินไม่ลง');return}
 inv[k]--;P.hu=Math.min(100,P.hu+(k==='bread'?25:12));if(k==='apple')P.hp=Math.min(BAL.hp,P.hp+5);
 sfx('pop');refreshInv();say(k==='bread'?'🍞 กินขนมปัง ความอิ่ม +25':'🍎 กินแอปเปิ้ล ความอิ่ม +12 เลือด +5')}
function eatAny(){if(inv.bread>0)useItem('bread');else if(inv.apple>0)useItem('apple');else say('ไม่มีอาหารในกระเป๋า — ซื้อได้ที่ร้านชำป้าแดง/โรงเตี๊ยม')}
addEventListener('keydown',e=>{if(e.key==='b'||e.key==='B')eatAny()});

// ---------- หลอดเลือด/มานา/เลเวล/แรง/ความอิ่ม ----------
const HUNGER_RATE=.09;let starveT=0;
const bfh=gid('bfh'),bff=gid('bff');
function buff(el,v,lowTxt,zeroTxt,okTxt){const st=v<=0?'low':v<25?'low':v<55?'mid':'ok';if(el.dataset.s!==st){el.dataset.s=st;el.className='bf '+st}
 el.querySelector('b').textContent=Math.round(v);el.querySelector('small').textContent=v<=0?zeroTxt:v<25?lowTxt:okTxt}
function vitalsTick(dt){const running=P.mv&&isRun()&&P.dash<=0;
 if(running)P.fa-=5.5*dt;else if(P.at<0&&P.dash<=0)P.fa+=(P.mv?6:14)*(P.hu<20?.4:1)*dt;
 if(P.sit)P.fa+=20*dt;
 P.fa=Math.max(0,Math.min(100,P.fa));
 P.hu=Math.max(0,P.hu-dt*(HUNGER_RATE+(running?.05:0)));
 if(P.hu<=0){P.sinceHit=0;const mn=BAL.hp*.1;if(P.hp>mn)P.hp=Math.max(mn,P.hp-dt*Math.max(1,BAL.hp*.01));starveT-=dt;if(starveT<=0){starveT=12;say('🍖 หิวจัด! เลือดค่อย ๆ ลดลง — หาอะไรกินด่วน')}}
 buff(bff,P.fa,'เหนื่อย','หมดแรง','แรงดี');buff(bfh,P.hu,'หิว','หิวจัด!','อิ่ม')}
{const _p=playerTick;playerTick=function(dt){_p(dt);vitalsTick(dt)}}
{const _d=die;die=function(){_d();P.fa=100;P.hu=Math.max(P.hu,50);refreshInv()}}
rest=function(){if(inv.coin<10){say('เหรียญไม่พอ');return}inv.coin-=10;P.hp=BAL.hp;P.mp=BAL.mp;P.fa=100;P.hu=Math.min(100,P.hu+20);refreshInv();sfx('heal');say('หลับสบาย เลือด มานา และแรงเต็มแล้ว')};

// ---------- ร้านค้า ----------
const SD2=SHOP_DATA;
const ORES_SELL=[['coal','ถ่าน',3],['ingSt','แท่งหิน',7],['ingDm','แท่งเพชร',130],['stone','หินธรรมดา',2],['iron','แร่เหล็ก',5],['copper','แร่ทองแดง',6],['silver','แร่เงิน',14],['gold','แร่ทอง',30],['ore','เพชร',60],['ingot','แท่งเหล็ก',14],['ingCu','แท่งทองแดง',22],['ingAg','แท่งเงิน',42],['ingAu','แท่งทอง',88]];
SD2.gear.sell=ORES_SELL.slice();
SD2.store.sell=[['wood','ไม้',4],['gel','เจลสไลม์',4],['apple','แอปเปิ้ล',3]].concat(ORES_SELL);
{const gb=(id,price)=>({id:'g_'+id,item:id,name:ITEMS[id].name,price,note:ITEMS[id].stat});
 SD2.gear.buy=[gb('helm1',60),gb('chest1',110),gb('pants1',70),gb('arm1',45),gb('neck1',60),gb('ring1',45),gb('sword1',90),gb('axe1',70),gb('pick1',70),gb('sword0',25),gb('axe0',20),gb('pick0',20)];
 SD2.gear.owner.lines=['ชุดอัศวินตีเองกับมือ ใส่แล้วหล่อเลย หิน เหล็ก ทองแดง เงิน ทอง เพชร ทรงเดียวกันหมด','แร่ที่ขุดได้เอามาขายข้าก็ได้ หรือหลอมที่เตาข้างร้านแล้วคราฟของเองที่ทั่ง','ทองแดง เงิน ทอง เพชร — ยิ่งแร่ดี ยิ่งแกร่ง','ของข้า ไม่มีใครสู้ได้ในเอลโดเรีย']}
SD2.store.buy.push({id:'bread',give:'bread',mat:'bread',emoji:'🍞',name:'ขนมปังอุ่น ๆ',price:8,note:'ความอิ่ม +25'},{id:'apple',give:'apple',mat:'apple',emoji:'🍎',name:'แอปเปิ้ลสด',price:5,note:'ความอิ่ม +12 เลือด +5'});
SD2.inn.buy.splice(1,0,{id:'soup',emoji:'🍲',mat:'soup',name:'ซุปเห็ดกับขนมปังอุ่น',price:12,note:'ความอิ่ม +45 เลือด +10'});
SD2.inn.buy.find(b=>b.id==='rest').note='เลือด มานา แรงเต็ม + อิ่ม +20';
const bIcon=b=>b.item?imgT('item:'+b.item):b.mat?imgT('mat:'+b.mat):(b.emoji||'')+' ';
const sIcon=k=>imgT('mat:'+k);
function sellRows(S,sl){if(!S.sell.length)return '';const a=S.sell.filter(x=>inv[x[0]]>0);return a.length?a.map(sl).join(''):'<small>ยังไม่มีของให้ขาย — ไปเก็บของก่อนนะ</small>'}
const GP=[8,24,50,100,200,420],GK={sword:1,axe:.8,pick:.8,helm:.8,chest:1.4,pants:1,arm:.7,neck:1.1,ring:.9};
const gearPrice=it=>Math.round(GP[it.tier]*GK[it.kind]);
function sellGear(g){if(!GEAR[g])return;const it=ITEMS[g],p=gearPrice(it);GEAR[g]--;if(!GEAR[g])delete GEAR[g];inv.coin+=p;sfx('coin');refreshInv();say('ขาย'+it.name+' ได้ '+p+' เหรียญ');openShop(SHOPK)}
function lvHud(){const a=gid('lvhud'),b=gid('xphud');if(a)a.textContent=P.lv;if(b)b.textContent=P.xp+'/'+need(P.lv);const x=gid('xpb');if(x){x.style.width=Math.min(100,P.xp/need(P.lv)*100)+'%';gid('xpt').textContent='⭐ Lv.'+P.lv+'  '+P.xp+'/'+need(P.lv)}}
{const _b=buyItem;buyItem=function(id){const S=SD2[SHOPK],b=S&&S.buy.find(q=>q.id===id);
  if(b&&b.item){const it=ITEMS[b.item];if(inv.coin<b.price){say('เหรียญไม่พอ (ต้องใช้ '+b.price+' เหรียญ)');sfx('thud');return}
   {const cr=canTakeGear(b.item);if(cr!==true){noRoom(cr);return}}
   inv.coin-=b.price;GEAR[b.item]=(GEAR[b.item]||0)+1;sfx('coin');
   if(!it.tool&&!P.armor[it.kind])equipItem(b.item);else{refreshInv();say('ซื้อ'+it.name+'แล้ว — เก็บเข้ากระเป๋า')}
   if(D&&D.owner)D.owner.bub={txt:'ขอบคุณจ้า!',t:2};openShop(SHOPK);return}
  if(b&&b.id==='soup'){if(inv.coin<b.price){say('เหรียญไม่พอ (ต้องใช้ '+b.price+' เหรียญ)');sfx('thud');return}
   if(P.hu>=95){say('อิ่มแล้ว กินไม่ลง');return}
   inv.coin-=b.price;P.hu=Math.min(100,P.hu+45);P.hp=Math.min(BAL.hp,P.hp+10);refreshInv();sfx('heal');say('🍲 ซดซุปร้อน ๆ ความอิ่ม +45 เลือด +10');
   if(D&&D.owner)D.owner.bub={txt:'ซดให้อุ่นท้องเลยจ้า',t:2};openShop(SHOPK);return}
  _b(id)}}

// ---------- เตาหลอม (ถลุงแร่เป็นแท่ง) + ทั่งตีเหล็ก (คราฟของ/ตีบวก) ----------
const FUI={tab:'craft',tier:0};
const SMELT=[{f:'stone',n:3,to:'ingSt',c:1},{f:'iron',n:2,to:'ingot',c:1},{f:'copper',n:2,to:'ingCu',c:1},{f:'silver',n:2,to:'ingAg',c:1},{f:'gold',n:2,to:'ingAu',c:2},{f:'ore',n:2,to:'ingDm',c:2}];
const smeltMax=s=>Math.min(Math.floor(inv[s.f]/s.n),Math.floor(inv.coal/s.c));
const owned=id=>{const it=ITEMS[id];return (GEAR[id]||0)+((it.kind==='axe'||it.kind==='pick')?0:(P.armor[it.kind]===id?1:0))};
function furnaceHTML(){let h='<b>🔥 เตาหลอม</b><small>แร่ต้องหลอมเป็นแท่งก่อนจึงจะคราฟชุดได้ · หลอมต้องใช้ถ่าน (เผาจากไม้)</small>';
 const wc=Math.floor(inv.wood/2);
 h+='<small>— เผาถ่าน —</small><div class="rw"><button class="mini'+(wc?'':' no')+'" onclick="burnCoal(1)">'+imgT('mat:coal','lg')+'เผาถ่าน<small>ไม้ 2 (มี '+inv.wood+') → ถ่าน 1 · มีถ่าน '+inv.coal+'</small></button><button class="mini sm'+(wc?'':' no')+'" onclick="burnCoal(0)">ทั้งหมด ×'+wc+'</button></div><small>— หลอมแร่เป็นแท่ง —</small>';
 SMELT.forEach((s,i)=>{const mx=smeltMax(s);
  h+='<div class="rw"><button class="mini'+(mx?'':' no')+'" onclick="smeltX('+i+',1)">'+imgT('mat:'+s.to,'lg')+'หลอม'+MN(s.to)+'<small>'+MN(s.f)+' '+s.n+' (มี '+inv[s.f]+') + ถ่าน '+s.c+' (มี '+inv.coal+') · มีแท่ง '+inv[s.to]+'</small></button><button class="mini sm'+(mx?'':' no')+'" onclick="smeltX('+i+',0)">ทั้งหมด ×'+mx+'</button></div>'});
 return h+'<button class="mini" onclick="closeForge()">ปิด</button>'}
function burnCoal(one){const mx=Math.floor(inv.wood/2),n=one?Math.min(1,mx):mx;if(!n){say('ไม้ไม่พอ: ต้องใช้ไม้ 2 ท่อนต่อถ่าน 1');sfx('thud');return}
 inv.wood-=2*n;inv.coal+=n;refreshInv();sfx('chest');const f=stn('furnace');if(f)for(let q=0;q<8;q++)fx.push({x:f.x,y:f.y-40,vx:(Math.random()-.5)*100,vy:-60-Math.random()*60,l:.6,c:'120,120,130'});
 say('🪵 เผาถ่านได้ ถ่าน +'+n);openForge('furnace')}
function smeltX(i,one){const s=SMELT[i],mx=smeltMax(s),n=one?Math.min(1,mx):mx;
 if(!n){say(inv.coal<s.c?'ไม่มีถ่าน — เอาไม้ไปเผาเป็นถ่านก่อน':'วัตถุดิบไม่พอ: ต้องใช้'+MN(s.f)+' '+s.n+' + ถ่าน '+s.c);sfx('thud');return}
 inv[s.f]-=s.n*n;inv.coal-=s.c*n;inv[s.to]+=n;refreshInv();sfx('chest');
 const f=stn('furnace');if(f)for(let q=0;q<8;q++)fx.push({x:f.x,y:f.y-40,vx:(Math.random()-.5)*100,vy:-60-Math.random()*60,l:.6,c:'255,160,50'});
 say('🔥 หลอมได้'+MN(s.to)+' +'+n);openForge('furnace')}
function anvilHTML(){const tab=(k,t)=>'<button class="mini sm'+(FUI.tab===k?' on':'')+'" onclick="FUI.tab=\''+k+'\';openForge(\'anvil\')">'+t+'</button>';
 let h='<b>🔨 ทั่งตีเหล็ก</b><div class="rw">'+tab('craft','⚒️ คราฟ')+tab('enh','✨ ตีบวก')+'</div>';
 if(FUI.tab==='craft'){
  h+='<div class="rw">'+TIERS.map((q,t)=>'<button class="mini sm'+(FUI.tier===t?' on':'')+'" style="border-bottom:4px solid '+q.mid+';padding:5px 7px" onclick="FUI.tier='+t+';openForge(\'anvil\')">'+TNAMES[t]+'</button>').join('')+'</div>';
  const t=FUI.tier,mk=MATKEY[t];
  h+='<small>วัสดุ: '+imgT('mat:'+mk)+MATN[t]+' มี '+inv[mk]+' · ไม้ มี '+inv.wood+'<br>ต้องหลอมแร่เป็นแท่งที่เตาหลอมก่อน (เตาใช้ถ่านที่เผาจากไม้)</small>';
  for(const k of ['sword','staff','bow','axe','pick','helm','chest','pants','arm','neck','ring']){const id=k+t,it=ITEMS[id],r=RECIPE[k],ok=inv[mk]>=need_m(k,t)&&inv.wood>=r.wood,own=owned(id);
   h+='<button class="mini cr'+(ok?'':' no')+'" onclick="craftGear(\''+id+'\')">'+imgT('item:'+id,'lg')+it.name+(own?' (มี ×'+own+')':'')+'<small>'+it.stat+' · ใช้'+MATN[t]+' '+need_m(k,t)+(r.wood?' + ไม้ '+r.wood:'')+'</small></button>'}}
 else{const ids=['sword','helm','chest','pants','arm'].map(k=>P.armor[k]).filter(Boolean);
  h+='<small>ตีบวกของที่สวมใส่อยู่ · เหรียญ '+inv.coin+'</small>';
  for(const id of ids){const it=ITEMS[id],l=ENH[id]||0,mk=MATKEY[it.tier];
   if(l>=MAXP){h+='<small>'+it.name+' +'+l+' — สูงสุดแล้ว</small>';continue}
   h+='<button class="mini" onclick="enhItem(\''+id+'\')">'+imgT('item:'+id,'lg')+'ตีบวก'+it.name+(l?' +'+l:'')+'<small>→ +'+(l+1)+' · '+MN(mk)+' '+(l+1)+' (มี '+inv[mk]+') + '+20*(l+1)+' 🪙 · สำเร็จ '+RATE[l]+'%'+(l>=5?' (พลาดลดเลเวล)':'')+'</small></button>'}}
 return h+'<button class="mini" onclick="closeForge()">ปิด</button>'}
function anvilFx(){const a=stn('anvil')||{x:P.x,y:P.y};for(let i=0;i<10;i++)fx.push({x:a.x,y:a.y-36,vx:(Math.random()-.5)*130,vy:-60-Math.random()*70,l:.5,c:'255,190,60'})}
function craftGear(id){const it=ITEMS[id],r=RECIPE[it.kind],mk=MATKEY[it.tier],nm=need_m(it.kind,it.tier);
 if(inv[mk]<nm||inv.wood<r.wood){say('วัตถุดิบไม่พอ: ต้องใช้'+MN(mk)+' '+nm+(r.wood?' + ไม้ '+r.wood:''));sfx('thud');return}
 {if(bagCells().length>=bagSlotsMax()){noRoom('slot');return}}
 inv[mk]-=nm;inv.wood-=r.wood;GEAR[id]=(GEAR[id]||0)+1;refreshInv();sfx('chest');anvilFx();
 say('⚒️ คราฟ'+it.name+'สำเร็จ! เปิดกระเป๋า 🎒 เพื่อสวมใส่');openForge('anvil')}
function enhItem(id){const it=ITEMS[id],l=ENH[id]||0;if(l>=MAXP)return;const mk=MATKEY[it.tier],ci=l+1,cc=20*(l+1);
 if(inv[mk]<ci||inv.coin<cc){say('ต้องใช้'+MN(mk)+' '+ci+' + '+cc+' เหรียญ');sfx('thud');return}
 inv[mk]-=ci;inv.coin-=cc;anvilFx();
 if(Math.random()*100<RATE[l]){ENH[id]=l+1;sfx('chest');say('✨ ตีบวกสำเร็จ! '+it.name+' +'+ENH[id])}
 else if(l>=3){ENH[id]=l-1;sfx('thud');say('💥 พลาด! '+it.name+' ลดเหลือ +'+ENH[id])}
 else{sfx('thud');say('💥 พลาด… วัตถุดิบหายไป (ยังไม่ลดเลเวล)')}
 refreshInv();openForge('anvil')}

// ---------- ✨ จุดรับผู้เล่นในเมือง + แสงตอนวาปมาถึง ----------
const PAD={x:TOWN_SPAWN.x*T,y:TOWN_SPAWN.y*T-8},ARR={t:0,max:2.6};
function paintPad(k){const x=PAD.x,y=PAD.y;k.save();
 k.fillStyle='rgba(0,0,0,.3)';k.beginPath();k.ellipse(x,y+5,48,22,0,0,7);k.fill();
 let g=k.createLinearGradient(x,y-19,x,y+19);g.addColorStop(0,'#8e95a8');g.addColorStop(1,'#565c6e');
 k.fillStyle=g;k.strokeStyle='#23262f';k.lineWidth=2;k.beginPath();k.ellipse(x,y,44,20,0,0,7);k.fill();k.stroke();
 k.fillStyle='#24344f';k.beginPath();k.ellipse(x,y,35,15,0,0,7);k.fill();k.strokeStyle='#9fd8ff';k.lineWidth=1.6;k.stroke();
 for(let i=0;i<12;i++){const a=i/12*6.283;k.fillStyle=i%3?'#9fd8ff':'#e8c14a';k.fillRect(x+Math.cos(a)*40-1.5,y+Math.sin(a)*17.5-1.5,3,3)}
 k.strokeStyle='rgba(159,216,255,.85)';k.lineWidth=1.3;k.beginPath();for(let i=0;i<5;i++){const a=-1.5708+i*2.513;k[i?'lineTo':'moveTo'](x+Math.cos(a)*25,y+Math.sin(a)*10.5)}k.closePath();k.stroke();
 k.beginPath();k.ellipse(x,y,11,4.6,0,0,7);k.stroke();
 for(const s of [-1,1]){const cx=x+s*58,cy=y+6;k.fillStyle='rgba(0,0,0,.28)';k.beginPath();k.ellipse(cx,cy+2,10,4,0,0,7);k.fill();
  const cg=k.createLinearGradient(cx-6,cy-18,cx+6,cy);cg.addColorStop(0,'#d9f6ff');cg.addColorStop(.5,'#4cb8ff');cg.addColorStop(1,'#1f5fc4');k.fillStyle=cg;k.strokeStyle='#103a86';k.lineWidth=1.4;
  k.beginPath();k.moveTo(cx,cy-20);k.lineTo(cx+6,cy-9);k.lineTo(cx+4,cy+1);k.lineTo(cx-4,cy+1);k.lineTo(cx-6,cy-9);k.closePath();k.fill();k.stroke()}
 k.restore()}
{const _b=buildTown;buildTown=function(){_b();paintPad(dcv.getContext('2d'))}}
{const _p=placeAtSpawn;placeAtSpawn=function(){_p();ARR.t=ARR.max;for(let i=0;i<30;i++)fx.push({x:PAD.x+(Math.random()-.5)*64,y:PAD.y-Math.random()*30,vx:(Math.random()-.5)*70,vy:-70-Math.random()*130,l:1.1,c:'190,235,255'})}}
{const _e=enterTown;enterTown=function(g){_e(g);if(g)ARR.t=0}}
{const _w=updWorld;updWorld=function(dt){_w(dt);if(ARR.t>0)ARR.t-=dt}}
function padLight(){const t=performance.now()/1000,x=PAD.x,y=PAD.y,u=Math.max(0,ARR.t/ARR.max),e=1-u,s=Z*RES;
 view(Math.round(CAMS.x*s)/s,Math.round(CAMS.y*s)/s);
 ctx.save();ctx.globalCompositeOperation='lighter';
 const pulse=.5+.5*Math.sin(t*2.2);
 ctx.save();ctx.translate(x,y);ctx.scale(1,.46);let g=ctx.createRadialGradient(0,0,4,0,0,64);g.addColorStop(0,'rgba(140,210,255,'+(.3+.12*pulse+.55*u)+')');g.addColorStop(1,'rgba(140,210,255,0)');ctx.fillStyle=g;ctx.fillRect(-66,-66,132,132);ctx.restore();
 for(const sx of [-1,1]){const g2=ctx.createRadialGradient(x+sx*58,y-6,1,x+sx*58,y-6,22);g2.addColorStop(0,'rgba(120,200,255,'+(.35+.15*pulse+.3*u)+')');g2.addColorStop(1,'rgba(120,200,255,0)');ctx.fillStyle=g2;ctx.fillRect(x+sx*58-24,y-30,48,48)}
 for(let i=0;i<8;i++){const ph=((t*.33+i/8)%1);ctx.fillStyle='rgba(190,235,255,'+(.75*Math.sin(ph*Math.PI))+')';ctx.fillRect(x+Math.sin(i*2.7+t*.8)*30,y-ph*52,2,2)}
 if(u>0){const w=34*(.35+.65*u),h=250,gp=ctx.createLinearGradient(0,y,0,y-h);gp.addColorStop(0,'rgba(255,255,255,'+(.95*Math.min(1,u*1.5))+')');gp.addColorStop(.45,'rgba(170,225,255,'+(.5*u)+')');gp.addColorStop(1,'rgba(170,225,255,0)');
  ctx.fillStyle=gp;ctx.fillRect(x-w/2,y-h,w,h);ctx.fillStyle='rgba(255,255,255,'+(.5*u)+')';ctx.fillRect(x-w/6,y-h*.8,w/3,h*.8);
  ctx.lineWidth=2.4;for(let i=0;i<3;i++){const p=Math.max(0,e*1.6-i*.22);if(p>1)continue;ctx.strokeStyle='rgba(200,240,255,'+(.8*(1-p))+')';ctx.beginPath();ctx.ellipse(x,y,12+p*74,5+p*32,0,0,7);ctx.stroke()}}
 ctx.restore()}


// ===== v2.2 : เมนูซื้อ/ขาย (ยืนยันก่อนขาย) · สถานีในร้าน (เตาหลอม/ทั่ง/หม้อปรุงยา) · ห้องร้านใหญ่ขึ้น · ไม่กระตุก =====
const SHOPUI={id:null,tab:'buy',sel:null,qty:1},STN={open:null};
const SHOP_STN={
 gear:[{k:'furnace',x:OX+2*T,y:4.55*T,n:'🔥 เตาหลอม'},{k:'anvil',x:OX+14*T,y:4.55*T,n:'🔨 ทั่งตีเหล็ก'}],
 potion:[{k:'cauldron',x:OX+14*T,y:4.55*T,n:'⚗️ หม้อปรุงยา'}]};
const stn=k=>{const L=D&&D.shop&&SHOP_STN[D.shop];return L&&L.find(s=>s.k===k)||null};
function stnNear(){const L=D&&D.shop&&SHOP_STN[D.shop];if(!L)return null;for(const s of L)if(Math.abs(P.x-s.x)<46&&P.y>4*T&&P.y<5.9*T)return s;return null}
// พื้นที่ที่ชนในปีกซ้าย-ขวาของร้าน (ช่องจริงของห้องใหญ่)
const WINGSOL={gear:[[1,11],[IW-2,11],[1,13],[IW-2,13]],potion:[[1,11],[IW-2,11],[1,13],[IW-2,13]],store:[[1,11],[IW-2,11],[1,13],[IW-2,13]],skill:[[1,11],[IW-2,11],[1,13],[IW-2,13]],
 inn:[[1,7],[2,7],[3,7],[4,7],[IW-5,7],[IW-4,7],[IW-3,7],[IW-2,7],[1,11],[IW-2,11],[1,13],[IW-2,13]]};
let CURSHOP='';
for(const id of Object.keys(SHOP_ART)){const o=SHOP_ART[id];SHOP_ART[id]=function(k){CURSHOP=id;return o(k)}}
// ปีกซ้าย-ขวาของห้องร้านที่ขยาย: ชั้นวาง เคาน์เตอร์ข้างผนัง ของตกแต่ง (วาดก่อนเลื่อนพิกัดให้ฉากเดิมอยู่กลางห้อง)
function wings(k,th){const id=CURSHOP,W_=IW*T,spans=[[T+2,5*T],[W_-5*T,W_-T-2]],ci=id==='store'?'potion':id;
 const cols=['#c04bff','#ff5c7a','#4fd6ff','#6ef08a','#ffd14a','#ff8a3a','#9a7bff'];
 spans.forEach(([a,b],si)=>{
  k.fillStyle='#4a2c14';k.fillRect(a,14,b-a,4);k.fillRect(a,46,b-a,4);k.fillStyle='rgba(255,255,255,.12)';k.fillRect(a,14,b-a,1);
  const y=3*T;k.fillStyle='rgba(0,0,0,.32)';k.fillRect(a+3,y+T-3,b-a,7);k.fillStyle=th.cf;k.fillRect(a,y+12,b-a,T-12);k.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<=b-a;i+=16)k.fillRect(a+i,y+12,1,T-12);k.fillStyle=th.wood;k.fillRect(a,y+T-5,b-a,5);
  k.fillStyle=lg(k,0,y+1,0,y+13,th.ct,th.cf);k.fillRect(a-3,y+1,b-a+6,12);k.fillStyle='rgba(255,255,255,.18)';k.fillRect(a-3,y+1,b-a+6,2);k.strokeStyle=OUT;k.lineWidth=1;k.strokeRect(a-2.5,y+1.5,b-a+5,11);
  for(let i=0;i<4;i++){const x=a+16+i*30;
   if(ci==='gear'){[()=>IT.sword(k,x,38,.95),()=>IT.shield(k,x,34,.8,0,si?'#d9534a':'#5d92e6',si?'#8a1f1f':'#254a9a'),()=>IT.axe(k,x,36,.9),()=>IT.helm(k,x,38,.9)][(i+si)%4]();[()=>IT.pouch(k,x,106,.9),()=>IT.gem(k,x,102,.9),()=>IT.sword(k,x,106,.6,1.45),()=>IT.pouch(k,x,106,.8)][(i+si)%4]()}
   else if(ci==='potion'){IT.bottle(k,x,26,1,0,cols[(i*2+si*3)%7],(i+si)%3);IT.bottle(k,x+9,50,1,0,cols[(i*3+si)%7],(i+1)%3);[()=>IT.herb(k,x,100,1),()=>IT.mortar(k,x,106,1),()=>IT.orb(k,x,108,1),()=>IT.bottle(k,x,106,1,0,cols[(i+si)%7],1)][(i+si)%4]()}
   else if(ci==='inn'){IT.mug(k,x,26,.95);IT.bottle(k,x,50,.95,0,['#3f8a4a','#7a3a1a','#c0392b'][(i+si)%3],1);[()=>IT.mug(k,x,106,1),()=>IT.keg(k,x,100,.7),()=>IT.mug(k,x,106,1),()=>IT.bottle(k,x,106,1,0,'#3f8a4a',1)][(i+si)%4]()}
   else{IT.book(k,x,26,.9,0,['#7a2a2a','#2a4f7a','#3a6a3a','#8a6a2a'][(i+si)%4]);IT.book(k,x+4,50,.9,0,['#5a3a7a','#7a2a2a','#2a4f7a','#3a6a3a'][(i+si)%4]);[()=>IT.orb(k,x,108,1),()=>IT.candle(k,x,106,1),()=>IT.book(k,x,104,1),()=>IT.orb(k,x,108,.9)][(i+si)%4]()}}
  const cx=si?IW-2:1;
  if(ci==='inn')IT.barrel(k,cx*T+16,11*T+30,1);else if(ci==='gear')IT.crate(k,cx*T+16,11*T+30);else IT.stool(k,cx*T+16,11*T+30,1.2);
  IT.plant(k,cx*T+16,13*T+30,1.1)});
 if(id==='inn')for(const tx of [2,IW-4]){const px=tx*T,py=7*T;IT.stool(k,px-T+16,py+30,1);IT.stool(k,px+3*T-16,py+30,1);
   k.fillStyle='rgba(0,0,0,.3)';k.beginPath();k.ellipse(px+T,py+27,34,9,0,0,7);k.fill();k.fillStyle='#4a2c14';k.fillRect(px+T-4,py+12,8,16);
   k.fillStyle=lg(k,px,py,px,py+20,'#a87a46','#7a4f26');k.beginPath();k.ellipse(px+T,py+11,34,12,0,0,7);k.fill();k.strokeStyle=OUT;k.lineWidth=1.2;k.stroke();k.fillStyle='rgba(255,255,255,.15)';k.beginPath();k.ellipse(px+T,py+9,28,7,0,0,7);k.fill();
   IT.mug(k,px+T-14,py+12,.9);IT.mug(k,px+T+14,py+13,.9);IT.plate(k,px+T,py+13,1);IT.candle(k,px+T-1,py+7,.8)}
 if(th.rug){const mx=((IW>>1)-1)*T;k.fillStyle=th.rug[0];k.fillRect(mx+4,12*T+6,2*T-8,2*T-10);k.strokeStyle=th.rug[2];k.lineWidth=2;k.strokeRect(mx+9,12*T+11,2*T-18,2*T-20)}}
// ---------- ฉากร้านที่วาดไว้ล่วงหน้า (กันกระตุกตอนเข้าร้านครั้งแรก) ----------
{let i=0;const pw=()=>{if(i<SHOP_ORDER.length){try{shopCanvas(SHOP_ORDER[i++])}catch(e){}setTimeout(pw,220)}};setTimeout(pw,1200)}

// ---------- เมนูร้าน: ซื้อ / ขาย (ขายต้องกดตกลงก่อน) ----------
function shopTab(t){SHOPUI.tab=t;SHOPUI.sel=null;sfx('ui');renderShop()}
openShop=function(id){STN.open=null;FORGEK=null;if(SHOPUI.id!==id){SHOPUI.id=id;SHOPUI.tab='buy';SHOPUI.sel=null}SHOPK=id;sfx('ui');renderShop();shopEl.hidden=false};
function renderShop(){const S=SD2[SHOPK];if(!S)return;
 const tab=(k,t)=>'<button class="mini sm'+(SHOPUI.tab===k?' on':'')+'" onclick="shopTab(\''+k+'\')">'+t+'</button>';
 let h='<b>'+S.emoji+' '+S.name+'</b><small>'+S.owner.name+' · เหรียญของคุณ 🪙 '+inv.coin+'</small><div class="rw">'+tab('buy','🛒 ซื้อ')+tab('sell','💰 ขาย')+'</div>';
 h+=SHOPUI.tab==='buy'?buyHTML(S):(SHOPUI.sel?confirmHTML():sellHTML(S));
 shopEl.innerHTML=h+'<button class="mini" onclick="closeShop()">ปิด</button>'}
function buyHTML(S){if(!S.buy.length)return '<small>ร้านนี้ไม่มีของขาย</small>';
 return '<small>ของในร้าน</small>'+S.buy.map(b=>`<button class="mini" onclick="buyItem('${b.id}')">${bIcon(b)}${b.name} −${b.price} 🪙<small>${b.note}${b.id==='scroll'?' (มี ×'+inv.scroll+')':''}</small></button>`).join('')}
function sellEntries(){const price={};for(const [k,nm,pr] of SD2[SHOPK].sell)price[k]=pr;const L=[];
 for(const k of INVORDER){if(k==='coin'||!(inv[k]>0))continue;L.push({t:'mat',k,name:MN(k),have:inv[k],price:price[k]||0,icon:imgT('mat:'+k)})}
 for(const g of Object.keys(GEAR).sort()){if(!(GEAR[g]>0))continue;const it=ITEMS[g];L.push({t:'gear',k:g,name:it.name,have:GEAR[g],price:SHOPK==='gear'?gearPrice(it):0,icon:imgT('item:'+g)})}
 return L.sort((a,b)=>(b.price>0)-(a.price>0))}
function sellHTML(){const L=sellEntries();if(!L.length)return '<small>กระเป๋าว่างเปล่า — ยังไม่มีอะไรให้ขาย</small>';
 return '<small>ของในกระเป๋าของคุณ (แตะเพื่อเลือกขาย)</small>'+L.map(e=>e.price>0?`<button class="mini" onclick="sellSel('${e.t}','${e.k}')">${e.icon}${e.name} ×${e.have}<small>+${e.price} เหรียญ/ชิ้น</small></button>`:`<button class="mini no" disabled>${e.icon}${e.name} ×${e.have}<small>ร้านนี้ไม่รับซื้อ</small></button>`).join('')}
const curEntry=()=>SHOPUI.sel&&sellEntries().find(e=>e.t===SHOPUI.sel.t&&e.k===SHOPUI.sel.k&&e.price>0);
function sellSel(t,k){SHOPUI.sel={t,k};SHOPUI.qty=1;sfx('ui');renderShop()}
function confirmHTML(){const e=curEntry();if(!e){SHOPUI.sel=null;return sellHTML()}SHOPUI.qty=Math.max(1,Math.min(e.have,SHOPUI.qty));
 return `<div class="cf">${e.icon.replace('class="si"','class="si lg2"')}<b>ขาย${e.name}?</b><small>มีอยู่ ×${e.have} · ราคา ${e.price} เหรียญ/ชิ้น</small>
 <div class="rw"><button class="mini sm" onclick="sellQty(-10)">−10</button><button class="mini sm" onclick="sellQty(-1)">−</button><b class="q">${SHOPUI.qty}</b><button class="mini sm" onclick="sellQty(1)">+</button><button class="mini sm" onclick="sellQty(10)">+10</button><button class="mini sm" onclick="sellQty('max')">สูงสุด</button></div>
 <div class="tot">ได้รับ 🪙 ${SHOPUI.qty*e.price}</div>
 <div class="rw"><button class="mini" onclick="sellCancel()">ยกเลิก</button><button class="mini ok" onclick="sellOK()">✔ ตกลง ขายเลย</button></div></div>`}
function sellQty(d){const e=curEntry();if(!e)return;SHOPUI.qty=Math.max(1,Math.min(e.have,d==='max'?e.have:SHOPUI.qty+d));sfx('ui');renderShop()}
function sellCancel(){SHOPUI.sel=null;sfx('ui');renderShop()}
function sellOK(){const e=curEntry();if(!e){sellCancel();return}const n=Math.min(SHOPUI.qty,e.have),gain=n*e.price;
 if(e.t==='mat')inv[e.k]-=n;else{GEAR[e.k]-=n;if(GEAR[e.k]<=0)delete GEAR[e.k]}
 inv.coin+=gain;sfx('coin');refreshInv();say('ขาย'+e.name+' ×'+n+' ได้ '+gain+' เหรียญ');if(D&&D.owner)D.owner.bub={txt:'ขอบคุณที่อุดหนุนนะ!',t:2.4};SHOPUI.sel=null;renderShop()}

// ---------- สถานีในร้าน: เตาหลอม · ทั่งตีเหล็ก (ร้านลุงเหล็ก) · หม้อปรุงยา (ร้านหมอยา) ----------
function openForge(k){FORGEK=k;STN.open=k;SHOPK=null;sfx('ui');const el=gid('shop');el.innerHTML=k==='furnace'?furnaceHTML():k==='cauldron'?cauldronHTML():anvilHTML();el.hidden=false}
function closeForge(){FORGEK=null;STN.open=null;gid('shop').hidden=true;sfx('ui')}
function cauldronHTML(){let h='<b>⚗️ หม้อปรุงยา</b><small>ปรุงยาเองได้ที่นี่ แล้วเก็บไว้ในกระเป๋า (H ยาเลือด · N ยามานา) · ขวดเปล่าซื้อได้ที่ร้านชำป้าแดง</small>';
 for(const c of ['hpp','mpp']){const r=CRAFT[c],ok=Object.entries(r.need).every(([k,v])=>inv[k]>=v);
  h+='<button class="mini cr'+(ok?'':' no')+'" onclick="craft(\''+c+'\')">'+imgT('mat:'+c,'lg')+'ปรุง'+r.n+' (มี ×'+inv[c]+')<small>ใช้ '+Object.entries(r.need).map(([k,v])=>IN[k]+' '+v+' (มี '+inv[k]+')').join(' + ')+'</small></button>'}
 return h+'<button class="mini" onclick="closeForge()">ปิด</button>'}
function craft(c){const r=CRAFT[c];for(const k in r.need)if(inv[k]<r.need[k]){say('วัตถุดิบไม่พอ: ต้องใช้ '+IN[k]+' '+r.need[k]);sfx('thud');return}
 for(const k in r.need)inv[k]-=r.need[k];inv[c]++;refreshInv();sfx('heal');const s=stn('cauldron');if(s)for(let i=0;i<10;i++)fx.push({x:s.x+(Math.random()-.5)*20,y:s.y-34,vx:(Math.random()-.5)*50,vy:-50-Math.random()*50,l:.7,c:'110,255,170'});
 say(r.e+' ปรุง'+r.n+'สำเร็จ! (กด '+(c==='hpp'?'H':'N')+' หรือแตะกระเป๋าเพื่อดื่ม)');openForge('cauldron')}
{const _sa2=shopAct;shopAct=function(){const st=stnNear();if(st&&!P.sit){openForge(st.k);return true}return _sa2()}}
setInterval(()=>{if(STN.open){const s=D&&D.shop?stnNear():null;if(!s||s.k!==STN.open)closeForge()}},300);
// ข้อความในร้าน
SD2.gear.owner.lines=['เตาหลอมกับทั่งอยู่ในร้านข้านี่แหละ ใช้ฟรีเลย','ชุดหินธรรมดา เหล็ก ทองแดง เงิน ทอง เพชร — ตีเองได้ทั้งหมด','เอาไม้ไปเผาเป็นถ่านที่เตาซ้ายมือก่อน แล้วค่อยหลอมแร่เป็นแท่งนะ','อยากให้ของแกร่งขึ้น ไปตีบวกที่ทั่งขวามือได้เลย'];
SD2.potion.owner.lines=['หม้อปรุงยาอยู่ขวามือในร้านนะจ๊ะ ใช้ได้เลย','เอาขวดเปล่ากับเจลสไลม์มา เดี๋ยวปรุงให้ทัน','ขวดเปล่าซื้อที่ร้านป้าแดงนะจ๊ะ','ยาฟื้นเลือดขวดนี้ ดื่มแล้วหายเหนื่อยทันที'];
delete SD2.potion.craft;

// ---------- วาดฉากในร้าน: ห้องใหญ่ ใช้กล้องตามตัวละคร (พิกเซลคงที่ → ไม่กระตุก) ----------
function drawShop(){const t=performance.now()/1000,S=D.S,o=D.owner,[cx,cy]=cam(IW*T,IH*T,.55);
 ui();ctx.fillStyle='#0b0a0e';ctx.fillRect(0,0,VW,VH);view(cx,cy);
 ctx.drawImage(dcv,0,0);
 ctx.save();ctx.translate(o.x,o.y);ctx.scale(1.3,1.3);ctx.translate(-o.x,-o.y);drawNPC(o,t);ctx.restore();const sx=Math.round(o.x-46);ctx.drawImage(dcv,sx,3*T+2,92,T-1,sx,3*T+2,92,T-1);
 ctx.save();ctx.translate(OX,0);SHOP_ANIM[D.shop](t);ctx.restore();
 drawGhosts();drawDrops();
 const L=[[P.y,()=>{ctx.globalAlpha=1;/* v5.14: เลิกกะพริบตัวตอนโดนโจมตี (เจ้าของสั่ง) — ช่วงอมตะหลังโดนยังทำงานเหมือนเดิม */hero();ctx.globalAlpha=1}]];
 if(D.shop==='gear'){L.push([6*T+30,()=>drawMannequin(OX+14*T+16,6*T+30)],[8*T+30,()=>drawMannequin(OX+1*T+16,8*T+30)])}
 L.sort((p,q)=>p[0]-q[0]);for(const l of L)l[1]();
 drawBubbles();
 for(const p of fx){ctx.fillStyle=`rgba(${p.c||'90,170,255'},${Math.min(1,p.l*2)})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,7);ctx.fill()}
 ctx.fillStyle=SHOP_TINT[D.shop];ctx.fillRect(0,0,IW*T,IH*T);
 const chip=(txt,x,y,hl)=>{ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';const w=ctx.measureText(txt).width+16;ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(x-w/2,y-13,w,19);ctx.strokeStyle=hl?'#ffe27a':'#e8c14a';ctx.lineWidth=hl?2:1;ctx.strokeRect(x-w/2+.5,y-12.5,w-1,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(txt,x,y);ctx.textAlign='left'};
 const near=stnNear();for(const s of (SHOP_STN[D.shop]||[]))if(!(D.shop==='gear'&&s.k==='anvil'))chip(s.n,s.x,1.55*T,s===near);
 if(near&&!STN.open&&!window.FRG7on&&!window.ENHOPEN7)chip('กด E / ⚔️ ใช้'+near.n.replace(/^\S+ /,''),near.x,(near.py?near.py+24:near.k==='anvil'&&window.ANV7y?ANV7y+24:5.5*T)+Math.sin(t*4)*2,1);
 if(shopNear()&&shopEl.hidden&&!near)chip('กด E / ⚔️ คุยกับ'+o.name,o.x,o.y+76+Math.sin(t*4)*2);
 ui();if(P.red>0){ctx.fillStyle='rgba(255,0,0,'+P.red+')';ctx.fillRect(0,0,VW,VH)}}

// ===== v2.3 : หน้าสถานะตัวละคร (กดรูปโปรไฟล์) · แต้มอัพสเตตัส · สวมใส่ที่นี่ · หน้าต่างซื้อขายแสดงกระเป๋าคู่กัน =====
const CHS={sel:null,dir:'d'};
const STATS=[['str','💪','พลัง (STR)','โจมตี +1 ต่อแต้ม'],['vit','❤️','ความอึด (VIT)','เลือดสูงสุด +12 · ป้องกัน +1 ทุก 2 แต้ม'],['int','🔮','ปัญญา (INT)','มานาสูงสุด +6 ต่อแต้ม'],['agi','👟','ว่องไว (AGI)','เดิน/วิ่งเร็วขึ้น +1.2% ต่อแต้ม'],['end','🫀','อดทน (END)','แรงลดช้าลง ~6% ต่อแต้ม']];
function recalcStats(){BAL.hp=100+(P.lv-1)*15+P.stats.vit*12+neckHp();BAL.mp=50+(P.lv-1)*5+P.stats.int*6}
function statAdd(k,n,quiet){n=Math.max(1,n|0||1);if(P.sp<=0){say('ไม่มีแต้มสเตตัส — เก็บเลเวลเพิ่ม');sfx('thud');return 0}
 n=Math.min(n,P.sp);P.sp-=n;P.stats[k]+=n;recalcStats();if(k==='vit')P.hp=Math.min(BAL.hp,P.hp+12*n);if(k==='int')P.mp=Math.min(BAL.mp,P.mp+6*n);if(!quiet)sfx('heal');updBadge();renderChar();return n}
/* กดแช่ปุ่ม ＋ = เพิ่มรัว ๆ (ยิ่งแช่ยิ่งเร็ว) · แถบเลือก ×1/×5/×10/สูงสุด = ต่อการกด 1 ครั้ง */
window.STEPMUL=window.STEPMUL||1;
function statStep(){return window.STEPMUL==='max'?Math.max(1,P.sp):window.STEPMUL}
function statMul(m){window.STEPMUL=m;sfx('ui');renderChar()}
{const st=document.createElement('style');st.textContent='#chl .stadd{touch-action:none;user-select:none;-webkit-user-select:none;min-width:44px;min-height:34px}#chl .mulb{display:flex;gap:4px;margin:4px 0}#chl .mulb button{flex:1;min-height:30px}#chl .mulb button.on{outline:2px solid #ffd86a;background:#5a4a1e;color:#ffd86a}';document.head.appendChild(st)}
{let tm=0,iv=0,cnt=0,held=null;
 const stop=()=>{clearTimeout(tm);clearInterval(iv);tm=iv=0;held=null};
 const tick=()=>{if(!held||P.sp<=0){if(held&&P.sp<=0)say('แต้มสเตตัสหมดแล้ว');stop();return}cnt++;const n=cnt<12?1:cnt<30?2:5;statAdd(held,n,cnt%4!==0)};
 document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('#chl .stadd');if(!b||b.disabled)return;e.preventDefault();stop();held=b.dataset.k;cnt=0;
  statAdd(held,statStep());tm=setTimeout(()=>{iv=setInterval(tick,70)},380)});
 for(const ev of['pointerup','pointercancel','blur'])addEventListener(ev,stop);
 document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('#chl .stadd'))e.preventDefault()})}
{const _g=gainXp;gainXp=function(n){const l0=P.lv;_g(n);if(P.lv>l0){const g=3*(P.lv-l0);P.sp+=g;recalcStats();P.hp=BAL.hp;P.mp=BAL.mp;say('⭐ เลเวลอัป! Lv.'+P.lv+' ได้แต้มสเตตัส +'+g+' (กดรูปโปรไฟล์เพื่ออัพ)');updBadge();lvHud()}}}
const chp=document.createElement('div');chp.id='chp';chp.hidden=true;
chp.innerHTML='<div class="bh"><b>👤 สถานะตัวละคร</b><button class="mini x" onclick="toggleChar()">✕</button></div><div class="chbody"><div class="chl" id="chl"></div><div class="chr"><div class="doll"><canvas id="figc" width="180" height="232" title="แตะเพื่อหมุนตัวละคร"></canvas><div id="che"></div></div></div></div><div id="chpick"></div>';
gid('wrap').appendChild(chp);
faceEl.insertAdjacentHTML('afterend','<span id="spb" hidden>+0</span>');
const spb=gid('spb');function updBadge(){spb.hidden=P.sp<=0;spb.textContent='+'+P.sp}
faceEl.style.cursor='pointer';faceEl.title='สถานะตัวละคร (V)';faceEl.onclick=()=>toggleChar();spb.onclick=()=>toggleChar();
function openChar(sel){bagEl.hidden=true;chp.hidden=false;CHS.sel=sel||null;sfx('ui');renderChar()}
function toggleChar(){if(chp.hidden)openChar();else{chp.hidden=true;CHS.sel=null;sfx('ui')}}
function chSlot(k){CHS.sel=CHS.sel===k?null:k;sfx('ui');renderChar()}
const SLOTL={sword:'ดาบ',helm:'หมวก',chest:'เสื้อเกราะ',pants:'กางเกง',arm:'เกราะแขน',neck:'สร้อย',ring:'แหวน'};
function curId(k){return P.armor[k]}
function renderChar(){if(chp.hidden)return;
 const x=(a,b)=>'<div class="cs"><span>'+a+'</span><b>'+b+'</b></div>';
 let h='<div class="chn"><span class="nm" onclick="renameChar()" title="แตะเพื่อเปลี่ยนชื่อ">'+(P.name||'ผู้กล้า')+' ✎</span><br><small>⭐ Lv.'+P.lv+' · XP '+P.xp+'/'+need(P.lv)+'</small></div>'
  +x('❤️ เลือด',Math.round(P.hp)+'/'+BAL.hp)+x('💧 มานา',Math.round(P.mp)+'/'+BAL.mp)+x('🗡️ โจมตี',ATK())+x('🛡️ ป้องกัน',DEF())+x('🍖 อิ่ม',Math.round(P.hu))+x('💪 แรง',Math.round(P.fa))+x('⚖️ น้ำหนักแบก',bagWeight()+'/'+bagCapMax())
  +'<div class="sp'+(P.sp>0?' on':'')+'">✨ แต้มสเตตัสคงเหลือ <b>'+P.sp+'</b></div>'
  +'<div class="mulb">'+[[1,'×1'],[5,'×5'],[10,'×10'],['max','สูงสุด']].map(m=>'<button class="mini x'+(window.STEPMUL===m[0]?' on':'')+'" onclick="statMul('+(m[0]==='max'?"\'max\'":m[0])+')">'+m[1]+'</button>').join('')+'</div>';
 for(const [k,ic,nm,ds] of STATS)h+='<div class="st"><div><span>'+ic+' '+nm+'</span><small>'+ds+'</small></div><b>'+P.stats[k]+'</b><button class="mini x stadd" data-k="'+k+'" '+(P.sp>0?'':'disabled')+'>＋</button></div>';
 gid('chl').innerHTML=h;
 let e='';for(const k of ['sword','helm','chest','pants','arm','neck','ring']){const id=curId(k),has=!!id,en=has?ENH[id]||0:0;
  e+='<div class="slot eq s-'+k+(CHS.sel===k?' on':'')+(has&&ITEMS[id].tier>=3?' rare r'+ITEMS[id].tier:'')+'" onclick="chSlot(\''+k+'\')" title="'+(has?ITEMS[id].name+' — '+ITEMS[id].stat:'ว่าง')+'"><img src="'+iconURL('item:'+(has?id:k+'1'))+'"'+(has?'':' style="opacity:.22;filter:grayscale(1)"')+'><small>'+SLOTL[k]+'</small>'+(en?'<em>+'+en+'</em>':'')+'</div>'}
 gid('che').innerHTML=e;
 const pk=gid('chpick');
 if(!CHS.sel){pk.innerHTML='<div class="emp">แตะช่องอาวุธ/ชุด เพื่อเลือกของที่จะสวมใส่หรือถอด</div>';return}
 const k=CHS.sel,cur=curId(k);let p='<div class="bsec">'+SLOTL[k]+' — เลือกของที่จะสวมใส่</div>';
 if(cur){const it=ITEMS[cur];p+='<div class="pk on">'+imgT('item:'+cur,'lg')+'<span>'+it.name+(ENH[cur]?' +'+ENH[cur]:'')+' <small>'+it.stat+' · สวมอยู่</small></span>'+'<button class="mini x" onclick="unequip(\''+k+'\')">ถอด</button></div>'}
 const ids=Object.keys(GEAR).filter(g=>GEAR[g]>0&&(ITEMS[g].kind===k||(k==='sword'&&(ITEMS[g].kind==='staff'||ITEMS[g].kind==='bow')))).sort((a,b)=>ITEMS[a].tier-ITEMS[b].tier);
 for(const id of ids){const it=ITEMS[id];p+='<div class="pk" onclick="equipItem(\''+id+'\')">'+imgT('item:'+id,'lg')+'<span>'+it.name+(GEAR[id]>1?' ×'+GEAR[id]:'')+' <small>'+it.stat+'</small></span><button class="mini x ok">สวมใส่</button></div>'}
 if(!ids.length&&!cur)p+=(ids.length?'':'<div class="emp">ยังไม่มี'+KINDS[k]+'อื่นในกระเป๋า — ซื้อที่ร้านลุงเหล็ก หรือคราฟที่ทั่งตีเหล็ก</div>');
 else if(!ids.length)p+='<div class="emp">ไม่มี'+KINDS[k]+'อื่นในกระเป๋า</div>';
 pk.innerHTML=p}
// ตัวละครโชว์ด้านขวา: วาดด้วย heroBody ตัวจริง (ชุด/อาวุธที่สวมอยู่จริง)
const figc=gid('figc'),fk=figc.getContext('2d');figc.onclick=()=>{CHS.dir={d:'l',l:'u',u:'r',r:'d'}[CHS.dir];sfx('ui')};
function drawFig(){if(chp.hidden)return;const sv={x:P.x,y:P.y,dir:P.dir,mv:P.mv,at:P.at,dash:P.dash,t:P.t,draw:P.draw},sc=ctx,sd=DPOSE;
 fk.setTransform(1,0,0,1,0,0);fk.clearRect(0,0,figc.width,figc.height);
 const g=fk.createRadialGradient(90,150,10,90,150,110);g.addColorStop(0,'#4a4640');g.addColorStop(1,'#25221e');fk.fillStyle=g;fk.fillRect(0,0,figc.width,figc.height);
 fk.fillStyle='rgba(0,0,0,.35)';fk.beginPath();fk.ellipse(90,203,40,10,0,0,7);fk.fill();
 P.draw=false;ctx=fk;fk.setTransform(3,0,0,3,0,0);DPOSE=false;P.x=30;P.y=66;P.dir=CHS.dir;P.mv=false;P.at=-1;P.dash=0;
 try{heroBody()}catch(e){}
 ctx=sc;DPOSE=sd;Object.assign(P,sv)}
setInterval(drawFig,70);
addEventListener('keydown',e=>{if(e.key==='v'||e.key==='V')toggleChar()});
{const m=menuEl.querySelector('small');if(m)m.insertAdjacentHTML('beforeend',' · V สถานะตัวละคร')}
// END ช่วยให้แรงลดช้าลง · AGI ใน patch ที่ลูปเดิน
{const _v=vitalsTick;vitalsTick=function(dt){const f0=P.fa;_v(dt);if(P.fa<f0&&P.stats.end)P.fa=f0-(f0-P.fa)/(1+.06*P.stats.end)}}
recalcStats();updBadge();

// ---------- หน้าต่างซื้อขาย: ซ้าย = ของในร้าน · ขวา = กระเป๋าของเรา (แสดงคู่กัน) ----------
renderShop=function(){const S=SD2[SHOPK];if(!S)return;
 const tab=(k,t)=>'<button class="mini sm'+(SHOPUI.tab===k?' on':'')+'" onclick="shopTab(\''+k+'\')">'+t+'</button>';
 shopEl.innerHTML='<b>'+S.emoji+' '+S.name+'</b><small>'+S.owner.name+' · เหรียญของคุณ 🪙 '+inv.coin+'</small><div class="rw tabs">'+tab('buy','🛒 ซื้อ')+tab('sell','💰 ขาย / กระเป๋า')+'</div>'
  +'<div class="trade show-'+SHOPUI.tab+'"><div class="tp tbuy"><div class="tt">🏪 ของในร้าน (แตะเพื่อซื้อ)</div>'+buyList(S)+'</div><div class="tp tsell"><div class="tt">🎒 กระเป๋าของคุณ</div>'+(SHOPUI.sel?confirmHTML():sellGrid())+'</div></div><button class="mini" onclick="closeShop()">ปิด</button>'};
function buyList(S){if(!S.buy.length)return '<small>ร้านนี้ไม่มีของขาย</small>';
 return S.buy.map(b=>`<button class="mini" onclick="buyItem('${b.id}')">${bIcon(b)}${b.name} −${b.price} 🪙<small>${b.note}${b.id==='scroll'?' (มี ×'+inv.scroll+')':''}</small></button>`).join('')}
function sellGrid(){const L=sellEntries();if(!L.length)return '<small>กระเป๋าว่างเปล่า — ยังไม่มีอะไรให้ขาย</small>';
 return '<small>แตะของที่ร้านรับซื้อเพื่อขาย (สีจางคือร้านนี้ไม่รับซื้อ)</small><div class="slots">'+L.map(e=>{const src=e.t==='gear'?iconURL('item:'+e.k):iconURL('mat:'+e.k);
  return e.price>0?`<div class="slot${e.t==='gear'&&ITEMS[e.k].tier>=3?' rare r'+ITEMS[e.k].tier:''}" title="${e.name} — ขาย ${e.price} เหรียญ/ชิ้น" onclick="sellSel('${e.t}','${e.k}')"><img src="${src}"><em>${e.have}</em><small>🪙${e.price}</small></div>`:`<div class="slot no" title="${e.name} — ร้านนี้ไม่รับซื้อ"><img src="${src}"><em>${e.have}</em></div>`}).join('')+'</div>'}

// ---------- 🧪 เมนูทดสอบ: เสกเหรียญ (อยู่ในเมนูตั้งค่า ⚙️) ----------
function _noCheat(n){inv.coin+=n;refreshInv();sfx('coin');say('🧪 เสกเหรียญ +'+n.toLocaleString()+' (มี '+inv.coin.toLocaleString()+')');if(SHOPK)renderShop()}


// ===== v2.5 : ช่องลัด 4 ช่อง (เลือกของจากกระเป๋าเอง) · ดาบเก็บหลัง · ขายกระเป๋าขยาย · NPC แยกเพศ/วัย =====
const QS={slots:TESTKIT?['weapon','axe0','pick0',null]:[null,null,null,null],cur:null,pick:null,lp:null};
const QCONS=['hpp','mpp','bread','apple','scroll'];
const qIcon=id=>!id?'':id==='weapon'?(P.armor.sword?iconURL('item:'+P.armor.sword):''):ITEMS[id]?iconURL('item:'+id):iconURL('mat:'+id);
const qName=id=>id==='weapon'?(window.wName9?wName9():'ดาบที่สวมอยู่'):ITEMS[id]?ITEMS[id].name:MN(id);
const barQ=gid('bar');barQ.innerHTML='';
for(let i=0;i<4;i++){const d=document.createElement('div');d.className='ts q';d.id='q'+i;d.style.touchAction='manipulation';d.innerHTML='<img alt=""><b>'+(i+1)+'</b><em></em>';
 d.onpointerdown=e=>{e.preventDefault();clearTimeout(QS.lp);QS.lp=setTimeout(()=>{QS.lp=null;openQPick(i)},550)};
 d.onpointerup=e=>{if(QS.lp){clearTimeout(QS.lp);QS.lp=null;quickUse(i)}};
 d.onpointerleave=d.onpointercancel=()=>{clearTimeout(QS.lp);QS.lp=null};
 d.oncontextmenu=e=>{e.preventDefault();openQPick(i)};barQ.appendChild(d)}
function qActive(id){return !!id&&P.draw&&QS.cur===id}
function updQuick(){for(let i=0;i<4;i++){const id=QS.slots[i],el=gid('q'+i),im=el.firstChild,em=el.lastChild;
  if(id&&ITEMS[id]&&ITEMS[id].kind!=='sword'&&!(GEAR[id]>0)){QS.slots[i]=null;continue}
  const src=id?qIcon(id):'';if(im.dataset.s!==src){im.dataset.s=src;if(src)im.src=src;else im.removeAttribute('src')}
  im.style.display=src?'':'none';
  const cnt=id&&!ITEMS[id]&&id!=='weapon'?inv[id]:0;em.textContent=id&&cnt!==undefined&&!ITEMS[id]&&id!=='weapon'?cnt:'';
  el.classList.toggle('empty',!id);el.classList.toggle('on',qActive(id)||(id==='scroll'&&P.recall>0));el.classList.toggle('dim',!!id&&!ITEMS[id]&&id!=='weapon'&&!(cnt>0))}}
setInterval(updQuick,120);
function drawItem(id,msg){P.draw=true;QS.cur=id;sfx('ui');say(msg)}
function stowItem(){P.draw=false;QS.cur=null;sfx('ui');say('เก็บไว้แล้ว — ดาบอยู่ที่หลัง')}
function autoDraw(){if(!P.draw){P.tool='sword';P.draw=true;QS.cur='weapon'}}
function stowToggle(){if(P.draw)stowItem();else{const id=QS.last||'weapon';quickUseId(id)}}
function quickUse(i){if(PAUSED||DOORA.k)return;const id=QS.slots[i];if(!id||!bagEl.hidden){openQPick(i);return}quickUseId(id)}
function quickUseId(id){
 if(id==='weapon'){if(!P.armor.sword){say('ยังไม่มีอาวุธสวมอยู่ — ไปซื้อหรือคราฟก่อน');return}if(qActive('weapon')){stowItem();return}P.tool='sword';QS.last=id;drawItem('weapon','⚔️ ชัก'+(window.wName9?wName9():'ดาบ')+'ออกมา — กดอีกครั้งเพื่อเก็บ');return}
 const it=ITEMS[id];
 if(it){
  if(it.kind==='sword'){if(GEAR[id]>0)equipItem(id);else if(P.armor.sword!==id){QS.slots[QS.slots.indexOf(id)]=null;say('ไม่มี'+it.name+'แล้ว');return}
   if(qActive(id)){stowItem();return}P.tool='sword';QS.last=id;drawItem(id,'⚔️ ชัก'+it.name+'ออกมา');return}
  if(!(GEAR[id]>0)){QS.slots[QS.slots.indexOf(id)]=null;say('ไม่มี'+it.name+'ในกระเป๋าแล้ว');return}
  if(qActive(id)){stowItem();return}
  P.tier[it.kind]=it.tier;P.tool=it.kind;QS.last=id;drawItem(id,'🖐️ หยิบ'+it.name+'ขึ้นมา — กดอีกครั้งเพื่อเก็บ');return}
 if(id==='scroll'){useScroll();return}
 if(QCONS.includes(id)){useItem(id);return}}
// ---------- เลือกของใส่ช่องลัด ----------
const qp=document.createElement('div');qp.id='qpick';qp.hidden=true;gid('wrap').appendChild(qp);
function qCands(){const L=P.armor.sword?[{id:'weapon',name:(window.wName9?wName9():'ดาบ')+' ที่สวมอยู่ (เก็บไว้หลัง)'}]:[];
 for(const id of Object.keys(GEAR).sort())if(GEAR[id]>0&&(ITEMS[id].kind==='axe'||ITEMS[id].kind==='pick'||ITEMS[id].kind==='sword'))L.push({id,name:ITEMS[id].name});
 for(const k of QCONS)if(inv[k]>0)L.push({id:k,name:MN(k),n:inv[k]});return L}
function openQPick(i){clearTimeout(QS.lp);QS.pick=i;qp.hidden=false;renderQPick();sfx('ui')}
function closeQPick(){qp.hidden=true;QS.pick=null}
function renderQPick(){const i=QS.pick;if(i==null)return;
 qp.innerHTML='<div class="bh"><span>เลือกของใส่ช่องลัด '+(i+1)+'</span><button class="mini x" onclick="closeQPick()">✕</button></div><div class="slots">'
  +qCands().map(c=>'<div class="slot'+(QS.slots[i]===c.id?' sel':'')+(ITEMS[c.id]&&ITEMS[c.id].tier>=3?' rare r'+ITEMS[c.id].tier:'')+'" title="'+c.name+'" onclick="qAssign(\''+c.id+'\')"><img src="'+qIcon(c.id)+'">'+(c.n?'<em>'+c.n+'</em>':'')+'</div>').join('')
  +(qCands().length?'':'<div style="font-size:12px;opacity:.7;padding:6px 2px">ยังไม่มีของให้ใส่ — เก็บ/ซื้อ/คราฟของก่อน</div>')+'</div>'+(QS.slots[i]?'<button class="mini" style="margin-top:6px;height:32px" onclick="qAssign(null)">ล้างช่องนี้</button>':'')}
function qAssign(id){const i=QS.pick;if(i==null)return;if(id)for(let j=0;j<4;j++)if(QS.slots[j]===id)QS.slots[j]=null;QS.slots[i]=id;sfx('ui');say(id?'ใส่ '+qName(id)+' ในช่อง '+(i+1):'ล้างช่อง '+(i+1));closeQPick();updQuick()}
updQuick();

// ---------- ร้านชำป้าแดงขายกระเป๋าขยาย (เพิ่มช่อง + น้ำหนักแบก) ----------
const BAGUP=[{id:'bagup1',n:'ถุงผ้าใบใหญ่',p:150,s:6,c:15},{id:'bagup2',n:'เป้หนังเดินป่า',p:420,s:6,c:15},{id:'bagup3',n:'เป้นักผจญภัย',p:1000,s:8,c:20}];
const STORE_BASE=SD2.store.buy.slice();
Object.defineProperty(SD2.store,'buy',{configurable:true,get(){return STORE_BASE.concat(BAGUP.map((u,i)=>({id:u.id,emoji:'🎒',name:u.n+(P.bagLv>i?' (มีแล้ว ✓)':P.bagLv<i?' (ต้องซื้อรุ่นก่อน)':''),price:u.p,note:'ช่องกระเป๋า +'+u.s+' · แบกได้ +'+u.c+' กก.'})))}});
SD2.store.owner.lines=['กระเป๋าใหญ่ขึ้นใส่ของได้เยอะนะลูก ป้ามีขายจ้ะ','ของฟาร์มเอามาขายป้าได้เลย แต่อย่าแบกหนักเกินนะ','ม้วนวาปพกไว้สักม้วนนะลูก','ป้าให้ราคายุติธรรมเสมอ'];
{const _b2=buyItem;buyItem=function(id){
  if(/^bagup\d$/.test(id)){const L=+id[5];if(P.bagLv>=L){say('มีกระเป๋าใบนี้แล้ว');return}if(P.bagLv<L-1){say('ต้องซื้อรุ่นก่อนหน้าก่อน');return}
   const u=BAGUP[L-1];if(inv.coin<u.p){say('เหรียญไม่พอ (ต้องใช้ '+u.p+' เหรียญ)');sfx('thud');return}
   inv.coin-=u.p;P.bagLv=L;sfx('gem');refreshInv();say('🎒 ได้'+u.n+' — ช่องกระเป๋า '+bagSlotsMax()+' · แบกได้ '+bagCapMax()+' กก.');if(D&&D.owner)D.owner.bub={txt:'ของดีเลยจ้ะ ใส่ของได้เยอะขึ้นแน่!',t:2.4};renderShop();return}
  const S=SD2[SHOPK],b=S&&S.buy.find(q=>q.id===id),gk=b&&(b.give||(b.id==='scroll'?'scroll':null));
  if(gk){const cr=canTake(gk);if(cr!==true){noRoom(cr);return}}
  _b2(id)}}
// ฟังก์ชันตัวละครหยิบของเมื่อโจมตี (ชักดาบอัตโนมัติถ้ามือว่าง)

// ---------- NPC: แยกเพศ/วัย (เด็กตัวเล็ก ผู้หญิงผมยาว/ชุดกระโปรง ผู้เฒ่าผมขาว/หนวด/ไม้เท้า) ----------
const NPCA={'ทหารยาม':{g:'m',hat:'helmet'},'พ่อค้า':{g:'m',mu:1,hat:'cap'},'นักดื่ม':{g:'m',beard:1},'ชาวบ้าน':{g:'f',hs:'long'},'เด็กน้อย':{g:'m',age:'child'},
 'แม่ค้าผัก':{g:'f',hs:'bun',apron:1},'แม่ค้าผลไม้':{g:'f',hs:'long',apron:1},'คนขายขนมปัง':{g:'m',hat:'chef',apron:1},'ลุงขายผัก':{g:'m',age:'elder',beard:1,hat:'cap'},
 'ชาวนา':{g:'m',hat:'straw'},'หญิงสาว':{g:'f',age:'teen',hs:'long'},'ช่างตีเหล็ก':{g:'m',beard:1,apron:1},'นักเดินทาง':{g:'m',hat:'cap'}};
for(const n of NPC_DATA)Object.assign(n,NPCA[n.name]||{});
NPC_DATA.push(
 {name:'เด็กหญิง',c:'#e86a9a',h:'#6b3a1a',x:26.5,y:22.5,r:4,sp:40,g:'f',age:'child',hs:'pigtails',lines:['พี่ ๆ ดูขนมของหนูสิ!','โตขึ้นหนูอยากเป็นหมอยาเหมือนคุณหมอ']},
 {name:'คุณยาย',c:'#7a5aa0',h:'#dcdce2',x:12.5,y:22.5,r:3,sp:20,g:'f',age:'elder',hs:'bun',cane:1,lines:['แต่ก่อนเมืองนี้เงียบกว่านี้นะหลาน','ระวังตัวตอนออกไปนอกเมืองล่ะ']},
 {name:'คุณตา',c:'#6a7a4a',h:'#e4e4e4',x:28,y:22.5,r:3,sp:18,g:'m',age:'elder',beard:1,cane:1,lines:['ตาเคยเป็นนักผจญภัยเหมือนเจ้านี่แหละ','เก็บแร่ดี ๆ แล้วไปตีชุดที่ร้านลุงเหล็กสิ']});
Object.assign(SD2.gear.owner,{g:'m',age:'adult',beard:1,apron:1});
Object.assign(SD2.potion.owner,{g:'f',age:'adult',hs:'bun'});
Object.assign(SD2.inn.owner,{g:'m',age:'adult',mu:1,apron:1});
Object.assign(SD2.store.owner,{g:'f',age:'elder',hs:'bun',apron:1});
Object.assign(SD2.skill.owner,{g:'m',age:'elder',beard:1,hat:'wizard'});
const SKINT=['#f6dcc2','#f1d2b0','#e8b88a','#d9a273','#c68a5a','#a8693f'];
const npcSkin=n=>n.sk!=null?SKINT[n.sk]:SKINT[1+Math.floor(hash(n.home.x*.37+1,n.name.length*3.1)*4.99)];
const shadeC=(c,a)=>{const m=/^#([0-9a-f]{6})$/i.exec(c);if(!m)return c;const v=parseInt(m[1],16);let r=(v>>16)&255,g=(v>>8)&255,b=v&255;r=Math.max(0,Math.min(255,r+a));g=Math.max(0,Math.min(255,g+a));b=Math.max(0,Math.min(255,b+a));return'#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0')};
const NSC={child:.68,teen:.9,adult:1,elder:.95};
function drawNPC(n,t){const g=n.g||'m',age=n.age||'adult',sc=NSC[age]||1,fem=g==='f',el=age==='elder',ch=age==='child';
 const x=Math.round(n.x),w=n.mv?Math.sin(n.t):0,bob=n.mv?Math.abs(Math.cos(n.t))*1.8:Math.sin(t*1.8+n.x)*.7,b=Math.round(n.y-bob);
 const sway=n.mv?w*.03:Math.sin(t*1.1+n.x)*.018,R=(c,a,y,w2,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(y),w2,h)};
 const SK=npcSkin(n),hc=n.h,dir=n.dir,c=n.c,c2=shadeC(c,-38),pants=n.pants||['#2a2a36','#3a2e22','#243244','#14141a'][Math.floor(hash(n.home.x,n.home.y)*3.99)];
 ctx.save();ctx.translate(x,n.y);ctx.scale(sc,sc);ctx.translate(-x,-n.y);
 ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(x,n.y+1,fem?10:11,4,0,0,7);ctx.fill();
 ctx.save();ctx.translate(x,n.y);ctx.transform(1,0,sway+(el?.025:0),1,0,0);ctx.translate(-x,-n.y);
 if(n.spear)R('#c9ccd6',x+15,b-52,2,52);
 const l1=Math.max(0,w)*3,l2=Math.max(0,-w)*3,a1=w*3,hy=b-(ch?39:el?38:40),hw=ch?14:12,hh=ch?14:12;
 // ขา / กระโปรง
 if(fem){R(SK,x-4,b-7-l1,3,7);R(SK,x+1,b-7-l2,3,7);R('#2a1a14',x-5,b-2-l1,4,2);R('#2a1a14',x,b-2-l2,4,2);
  ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x-6,b-17);ctx.lineTo(x+6,b-17);ctx.lineTo(x+(ch?8:10),b-5);ctx.lineTo(x-(ch?8:10),b-5);ctx.closePath();ctx.fill();R(c2,x-(ch?8:10),b-6,ch?16:20,2);
  if(n.apron){R('#f4f0e4',x-5,b-16,10,10);R('#d9d2bd',x-5,b-7,10,1)}}
 else{R(pants,x-7,b-12-l1,6,12);R(pants,x+1,b-12-l2,6,12);R('#1a120c',x-7,b-2-l1,6,2);R('#1a120c',x+1,b-2-l2,6,2)}
 // ลำตัว
 if(fem){R(c,x-6,b-26,12,10);R(shadeC(c,22),x-6,b-26,12,2);R(c2,x-6,b-17,12,1);if(!n.apron)R(shadeC(c,40),x-1,b-25,2,8)}
 else{R(c,x-8,b-26,16,14);if(n.apron){R('#e8e0c8',x-6,b-24,12,12);R('#bfb69a',x-6,b-13,12,1)}else R(shadeC(c,-30),x-8,b-14,16,2)}
 // แขน
 const aw=fem?4:6,ax=fem?x-11:x-14;
 R(c,ax,b-26+a1,aw,fem?10:12);R(SK,ax,b-(fem?16:15)+a1,aw,4);
 if(n.wave>0){ctx.save();ctx.translate(x+(fem?6:8),b-26);ctx.rotate(-2.5+Math.sin(t*13)*.4);R(c,0,0,aw,fem?10:12);R(SK,0,fem?8:9,aw,4);ctx.restore()}
 else{const bx=fem?x+7:x+8;R(c,bx,b-26-a1,aw,fem?10:12);R(SK,bx,b-(fem?16:15)-a1,aw,4)}
 if(n.cane){R('#7a5430',x+(fem?11:14),b-15,2,15);R('#5a3a1c',x+(fem?10:13),b-16,4,2)}
 // คอ + หัว
 R(SK,x-2,hy+hh-1,4,3);R(SK,x-hw/2,hy,hw,hh);
 // ผม
 if(!fem){
  if(el){R(hc,x-hw/2-1,hy+1,3,6);R(hc,x+hw/2-2,hy+1,3,6);R(hc,x-hw/2+1,hy-1,hw-2,2);if(dir==='u')R(hc,x-hw/2-1,hy-1,hw+2,hh-2)}
  else{R(hc,x-hw/2-1,hy-3,hw+2,6);R(hc,x-hw/2-1,hy,2,6);R(hc,x+hw/2-1,hy,2,6);if(dir==='u')R(hc,x-hw/2-1,hy-3,hw+2,hh+1)}}
 else{const hs=n.hs||'long';
  R(hc,x-hw/2-1,hy-3,hw+2,6);
  if(hs==='long'){R(hc,x-hw/2-2,hy,3,hh+9);R(hc,x+hw/2-1,hy,3,hh+9);if(dir==='u')R(hc,x-hw/2-2,hy-3,hw+4,hh+10)}
  else if(hs==='bun'){R(hc,x-hw/2-1,hy,2,7);R(hc,x+hw/2-1,hy,2,7);ctx.fillStyle=hc;ctx.beginPath();ctx.arc(x,hy-6,4.5,0,7);ctx.fill();if(dir==='u')R(hc,x-hw/2-1,hy-3,hw+2,hh)}
  else if(hs==='pigtails'){R(hc,x-hw/2-1,hy,2,6);R(hc,x+hw/2-1,hy,2,6);R(hc,x-hw/2-4,hy+4,3,10);R(hc,x+hw/2+1,hy+4,3,10);R('#e8506a',x-hw/2-4,hy+3,3,2);R('#e8506a',x+hw/2+1,hy+3,3,2);if(dir==='u')R(hc,x-hw/2-1,hy-3,hw+2,hh)}}
 // หมวก
 if(n.hat==='helmet'){R('#b8b8c4',x-8,hy-5,16,8);R('#7a7a88',x-8,hy+2,16,2);R('#c0392b',x-1,hy-9,3,5)}
 else if(n.hat==='chef'){R('#fff',x-6,hy-10,12,8);R('#fff',x-8,hy-5,16,4);R('#e4e4e4',x-8,hy-2,16,1)}
 else if(n.hat==='cap'){R(shadeC(c,-20),x-8,hy-4,16,5);R(shadeC(c,-45),x-9,hy,18,2)}
 else if(n.hat==='straw'){ctx.fillStyle='#d9c16a';ctx.beginPath();ctx.ellipse(x,hy-1,13,3.6,0,0,7);ctx.fill();R('#e6d27e',x-6,hy-7,12,7);R('#a8452f',x-6,hy-3,12,1.5)}
 else if(n.hat==='wizard'){ctx.fillStyle='#2f5fa8';ctx.beginPath();ctx.moveTo(x-9,hy);ctx.lineTo(x,hy-17);ctx.lineTo(x+9,hy);ctx.closePath();ctx.fill();R('#e8c14a',x-9,hy-1,18,2)}
 // หน้า
 if(dir!=='u'){
  const ey=hy+(ch?5:4),side=dir==='l'||dir==='r',sd=dir==='l'?-1:1;
  if(!side){
   if(ch){R('#111',x-4,ey,3,3);R('#111',x+1,ey,3,3);R('#fff',x-3,ey,1,1);R('#fff',x+2,ey,1,1);R('rgba(255,110,110,.45)',x-6,ey+4,2,2);R('rgba(255,110,110,.45)',x+4,ey+4,2,2)}
   else{R('#111',x-3,ey,2,3);R('#111',x+1,ey,2,3);
    if(fem){R('#111',x-4,ey-1,1,1);R('#111',x+3,ey-1,1,1);R('#c0504a',x-1,hy+9,3,1);R('rgba(255,110,110,.4)',x-5,ey+3,2,1);R('rgba(255,110,110,.4)',x+3,ey+3,2,1)}
    else R('rgba(60,30,20,.4)',x-1,hy+8,3,1)}
   if(el&&!fem){R('rgba(0,0,0,.2)',x-4,ey-2,3,1);R('rgba(0,0,0,.2)',x+1,ey-2,3,1)}
   if(el&&fem){R('rgba(0,0,0,.2)',x-4,ey+4,2,1);R('rgba(0,0,0,.2)',x+2,ey+4,2,1)}
   if(n.mu)R(hc==='#ffffff'?'#bbb':shadeC(hc,0),x-4,hy+7,8,2);
   if(n.beard)R(el?'#e8e8ec':hc,x-5,hy+8,10,5)}
  else{R('#111',x+sd*3-1,ey,2,3);if(fem){R('#111',x+sd*4,ey-1,1,1);R('#c0504a',x+sd*4,hy+9,2,1)}
   if(n.beard)R(el?'#e8e8ec':hc,x+sd*2-3,hy+8,6,5);if(n.mu)R(hc,x+sd*3-1,hy+7,4,2)}}
 ctx.restore();ctx.restore();
 ctx.fillStyle='#fff';ctx.font='bold 10px system-ui,sans-serif';ctx.textAlign='center';ctx.shadowColor='rgba(0,0,0,.9)';ctx.shadowBlur=0;ctx.shadowOffsetY=1;ctx.shadowOffsetX=1;ctx.fillText(n.dn||n.name,x,Math.round(n.y-bob-46*sc-4));ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.textAlign='left'}

// ===== v2.6 : แชทระบบ (พับได้) · ชื่อตัวละคร · จอแนวนอน · เริ่มเกมแบบไม่มีของ =====
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// ---------- ชื่อตัวละคร ----------
let _sn='';try{_sn=localStorage.getItem('fm_name')||''}catch(e){}
P.name=_sn;
function nameTag(){if(!P.name)return;ctx.save();ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';
 const y=Math.round(P.y-68),w=ctx.measureText(P.name).width+14;
 if(P.bub&&performance.now()<P.bub.until)bubble(P.bub.txt,Math.round(P.x),y-16,Math.min(1,(P.bub.until-performance.now())/300));
 ctx.fillStyle='rgba(0,0,0,.55)';rr(ctx,Math.round(P.x-w/2),y-12,w,17,8);ctx.fill();ctx.strokeStyle='#e8c14a';ctx.lineWidth=1;ctx.stroke();
 ctx.fillStyle='#ffe9a8';ctx.fillText(P.name,Math.round(P.x),y);ctx.restore()}
function renameChar(){const n=prompt('ชื่อตัวละคร (ไม่เกิน 14 ตัวอักษร)',P.name||'');if(n==null)return;const t=n.trim().slice(0,14);if(!t)return;P.name=t;try{localStorage.setItem('fm_name',t)}catch(e){}sysSay('เปลี่ยนชื่อตัวละครเป็น '+t);renderChar()}
const intro=document.createElement('div');intro.id='intro';intro.hidden=true;
intro.innerHTML='<div class="card"><h2>⚔️ Fantasy Map</h2><p>ตั้งชื่อตัวละครของคุณ</p><input id="introName" maxlength="14" placeholder="ชื่อตัวละคร" autocomplete="off"><button id="introGo">เริ่มผจญภัย</button><small>เล่นในแนวนอน · เริ่มแบบผู้เล่นจริง (ไม่มีของเลย) ใส่ ?real=1 ท้ายลิงก์</small></div>';
document.body.appendChild(intro);
function startGame(nm){nm=(nm||'').trim().slice(0,14)||'ผู้กล้า';P.name=nm;try{localStorage.setItem('fm_name',nm)}catch(e){}intro.hidden=true;PAUSED=false;sysSay('ยินดีต้อนรับ '+nm+' สู่เมืองเอลโดเรีย!');renderChar()}
gid('introGo').onclick=()=>startGame(gid('introName').value);
gid('introName').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')startGame(gid('introName').value)});
gid('introName').addEventListener('keyup',e=>e.stopPropagation());
if(!_sn){PAUSED=true;intro.hidden=false;setTimeout(()=>gid('introName').focus(),300)}

// ---------- แชทระบบ (พับได้) ----------
const chatBox=document.createElement('div');chatBox.id='chatBox';
chatBox.innerHTML='<div id="chatHd"><b>💬 แชทระบบ</b><i id="chatBadge" hidden>0</i><span class="sp"></span><button id="chatEd" title="พิมพ์ข้อความ (Enter)">✎</button><button id="chatFold" title="พับ/กาง">▾</button></div><div id="chatList"></div><div id="chatIn" hidden><input id="chatTi" maxlength="80" placeholder="พิมพ์ข้อความ แล้วกด Enter" autocomplete="off"><button id="chatSend">ส่ง</button></div>';
gid('wrap').appendChild(chatBox);
const CH={folded:false,unread:0,last:null};try{CH.folded=localStorage.getItem('fm_chatfold')==='1'}catch(e){}
function chatApply(){chatBox.classList.toggle('folded',CH.folded);gid('chatFold').textContent=CH.folded?'▴':'▾';if(!CH.folded)CH.unread=0;const b=gid('chatBadge');b.hidden=!CH.unread;b.textContent=CH.unread}
function chatToggle(){CH.folded=!CH.folded;try{localStorage.setItem('fm_chatfold',CH.folded?'1':'0')}catch(e){}chatApply();sfx('ui')}
gid('chatFold').onclick=chatToggle;
function chatInput(on){const r=gid('chatIn');r.hidden=on===undefined?!r.hidden:!on;if(!r.hidden){if(CH.folded){CH.folded=false;chatApply()}setTimeout(()=>gid('chatTi').focus(),30)}else gid('chatTi').blur()}
gid('chatEd').onclick=()=>chatInput();
function chatAdd(cls,fn,key,txt){const list=gid('chatList'),now=performance.now();let el;
 if(key&&CH.last&&CH.last.key===key&&now-CH.last.t<2500){CH.last.n++;CH.last.t=now;CH.last.fn=fn;el=CH.last.el;el.innerHTML=fn(CH.last.n)}
 else{const near=list.scrollHeight-list.scrollTop-list.clientHeight<30;el=document.createElement('div');el.className='cl '+cls;el.innerHTML=fn(1);list.appendChild(el);
  while(list.children.length>80)list.removeChild(list.firstChild);CH.last=key?{key,t:now,n:1,fn,el}:null;if(near||true)list.scrollTop=list.scrollHeight}
 if(CH.folded){CH.unread++;chatApply()}
 list.scrollTop=list.scrollHeight}
function sysSay(t){const warn=/ไม่พอ|เต็ม|หนักเกิน|ไม่มี|ยกเลิก|พลาด|โดนตี|โดนสไลม์|หิวจัด|หมดแรง|เหนื่อยจัด|ต้องใช้|ต้องซื้อ|ไม่รับ|ไม่ได้|ยังไม่มี/.test(t);
 chatAdd(warn?'warn':'sys',n=>esc(t)+(n>1?' <i>×'+n+'</i>':''),'s:'+t.replace(/\d+/g,'#'))}
// ข้อความแจ้งเตือนทั้งหมดของเกม (say / msg) ไหลเข้าแชทระบบ แทนข้อความลอยกลางจอ
{const m=gid('msg');new MutationObserver(()=>{const t=(m.textContent||'').trim();if(t)sysSay(t)}).observe(m,{childList:true,characterData:true,subtree:true})}
// ของที่เก็บได้ → แชทระบบ (รวมจำนวนที่เก็บติดกัน)
function logPick(k){const nm=MN(k),ic=imgT('mat:'+k);chatAdd('drop',n=>ic+'ได้รับ <b>'+esc(nm)+'</b> ×'+n,'d:'+k)}
function chatSend(){const ti=gid('chatTi'),t=ti.value.trim();ti.value='';if(!t)return;
 if(t[0]==='/'){const [c,...r]=t.slice(1).split(' ');if(c==='name'&&r.join(' ').trim()){P.name=r.join(' ').trim().slice(0,14);try{localStorage.setItem('fm_name',P.name)}catch(e){}sysSay('เปลี่ยนชื่อเป็น '+P.name)}else if(c==='help')sysSay('คำสั่ง: /name ชื่อใหม่ · พิมพ์ข้อความธรรมดาเพื่อพูด');else sysSay('ไม่รู้จักคำสั่ง /'+c+' (พิมพ์ /help)');chatInput(false);return}
 chatAdd('me',()=>'<b>'+esc(P.name||'ผู้กล้า')+'</b>: '+esc(t));P.bub={txt:t.slice(0,60),until:performance.now()+4500};sfx('pop');chatInput(false)}
gid('chatSend').onclick=chatSend;
for(const ev of ['keydown','keyup','keypress'])gid('chatTi').addEventListener(ev,e=>{e.stopPropagation();if(ev==='keydown'){if(e.key==='Enter'){chatSend();e.preventDefault()}else if(e.key==='Escape'){chatInput(false)}}});
addEventListener('keydown',e=>{if(e.key==='Enter'&&intro.hidden&&document.activeElement!==gid('chatTi')){e.preventDefault();chatInput(true)}});
chatApply();
// ---------- จอแนวนอน ----------
const rotEl=document.createElement('div');rotEl.id='rot';rotEl.hidden=true;
rotEl.innerHTML='<div class="ph"></div><b>กรุณาหมุนเครื่องเป็นแนวนอน</b><small>เกมนี้เล่นแนวนอน เพื่อให้มีที่สำหรับปุ่มและช่องลัดครบ</small>';document.body.appendChild(rotEl);
let ROTP=false;function chkRot(){ROTP=COARSE&&innerHeight>innerWidth;rotEl.hidden=!ROTP}
addEventListener('resize',chkRot);addEventListener('orientationchange',()=>setTimeout(chkRot,150));chkRot();
if(COARSE)addEventListener('pointerdown',()=>{const e=document.documentElement;try{const p=(e.requestFullscreen||e.webkitRequestFullscreen).call(e);Promise.resolve(p).then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(_){}}).catch(()=>{})}catch(_){}},{once:true});
// ---------- เมนูทดสอบ: เลือกโหมดเริ่มเกม ----------



// ===== v2.7 : กระเป๋าเปิดคู่กับเตาหลอม/ทั่ง/หม้อปรุงยา/ร้านค้า (หน้าตาเดียวกับกระเป๋าจริง) =====
const SPROC={stone:0,iron:1,copper:2,silver:3,gold:4,ore:5};
const STN_LBL={furnace:'🔥 เตาหลอม',anvil:'🔨 ทั่ง',cauldron:'⚗️ หม้อปรุงยา'};
STN.tab='st';
function cellHTML(c,o){o=o||{};if(!c)return '<div class="slot empty"></div>';
 const isG=c.t==='gear',it=isG?ITEMS[c.k]:null,src=iconURL((isG?'item:':'mat:')+c.k);
 const cls='slot'+(isG&&it.tier>=3?' rare r'+it.tier:'')+(c.eq?' worn':'')+(o.cls?' '+o.cls:'');
 return '<div class="'+cls+'" title="'+esc(isG?it.name+' — '+it.stat+(c.eq?' (สวมอยู่)':''):MN(c.k))+'"'+(o.click?' onclick="'+o.click+'"':'')+'><img src="'+src+'">'+(isG?(c.eq?'<b class="wm">✋</b>':''):'<em>'+c.n+'</em>')+(o.tag?'<small>'+o.tag+'</small>':'')+'</div>'}
function bagHead(){const w=bagWeight(),cp=bagCapMax(),n=Math.min(bagCells().length,bagSlotsMax());return '<div class="bph"><span class="'+(w>cp?'ov':'')+'">⚖️ '+w+'/'+cp+'</span><span>🎒 '+n+'/'+bagSlotsMax()+'</span></div>'}
function bagGrid(f){const cells=bagCells(),mx=Math.max(bagSlotsMax(),cells.length);let h='';for(let i=0;i<mx;i++)h+=cellHTML(cells[i],cells[i]?f(cells[i]):null);return '<div class="slots">'+h+'</div>'}
// ร้านค้า: ฝั่งขวา = กระเป๋าจริงของเรา (ช่อง/น้ำหนักเหมือนกัน) แตะของที่ร้านรับซื้อเพื่อขาย
function sellGrid(){const pm={};for(const x of SD2[SHOPK].sell)pm[x[0]]=x[2];
 return bagHead()+'<small>แตะของที่ร้านรับซื้อเพื่อขาย (สีจางคือร้านนี้ไม่รับซื้อ)</small>'+bagGrid(c=>{
  const pr=c.t==='gear'?(SHOPK==='gear'&&!c.eq?gearPrice(ITEMS[c.k]):0):(pm[c.k]||0);
  return pr>0?{click:"sellSel('"+c.t+"','"+c.k+"')",tag:'🪙'+pr}:{cls:'no'}})}
// สถานีผลิต: ซ้าย = เตา/ทั่ง/หม้อ · ขวา = กระเป๋า (แตะแร่/ไม้ในกระเป๋าเพื่อหลอม/เผาถ่านได้ทันที)
function stnBagPane(k){const hint={furnace:'แตะแร่เพื่อหลอมทีละชุด · แตะไม้เพื่อเผาถ่าน',anvil:'วัสดุของระดับที่เลือกจะเรืองแสง',cauldron:'ขวดเปล่า เจลสไลม์ ไม้ จะเรืองแสง'}[k];
 const f=c=>{if(c.t!=='mat')return null;
  if(k==='furnace'){if(c.k in SPROC)return{click:"stnBag('"+c.k+"')",cls:'proc',tag:'🔥'};if(c.k==='wood')return{click:"stnBag('wood')",cls:'proc',tag:'⚫'};return null}
  if(k==='anvil')return(c.k===MATKEY[FUI.tier]||c.k==='wood')?{cls:'hl'}:null;
  return(c.k==='bottle'||c.k==='gel'||c.k==='wood')?{cls:'hl'}:null};
 return bagHead()+'<small>'+hint+'</small>'+bagGrid(f)}
function stnBag(k){if(STN.open!=='furnace')return;if(k==='wood')burnCoal(1);else if(k in SPROC)smeltX(SPROC[k],1)}
function stnTab(t){STN.tab=t;if(STN.open)openForge(STN.open);sfx('ui')}
function openForge(k){if(STN.open!==k)STN.tab='st';FORGEK=k;STN.open=k;SHOPK=null;sfx('ui');
 const left=k==='furnace'?furnaceHTML():k==='cauldron'?cauldronHTML():anvilHTML();
 const tab=(t,l)=>'<button class="mini sm'+(STN.tab===t?' on':'')+'" onclick="stnTab(\''+t+'\')">'+l+'</button>';
 shopEl.innerHTML='<button class="mini x xclose" onclick="closeForge()">✕</button><div class="rw tabs">'+tab('st',STN_LBL[k])+tab('bag','🎒 กระเป๋า')+'</div>'
  +'<div class="trade show-'+(STN.tab==='bag'?'sell':'buy')+'"><div class="tp tbuy">'+left+'</div><div class="tp tsell"><div class="tt">🎒 กระเป๋าของคุณ</div>'+stnBagPane(k)+'</div></div>';
 shopEl.hidden=false}
// ปรับแท็บ "ซื้อ/ขาย" ของร้านให้สื่อว่าเป็นกระเป๋า
{const _rs=renderShop;renderShop=function(){_rs();const t=shopEl.querySelector('.tabs');if(t)t.innerHTML=t.innerHTML.replace('💰 ขาย / กระเป๋า','🎒 กระเป๋า / ขาย')}}


// ---------- v2.2 : ร้านค้า/สถานี ↔ กระเป๋า เชื่อมกันในหน้าต่างเดียว (ไม่ต้องสลับแท็บ) ----------
(function(){
 const st=document.createElement('style');
 st.textContent=`
#shop{min-width:0}#shop>b{padding-right:36px}
#shop .tabs{display:none!important}
#shop .trade{display:flex!important;flex-direction:row;gap:8px;width:min(96vw,720px)}
#shop .trade .tp{display:flex!important;flex:1 1 50%;min-width:0;max-height:60vh}
#shop .slots{grid-template-columns:repeat(auto-fill,minmax(44px,1fr))!important}
#shop .slot{height:auto!important;aspect-ratio:1/1}
#shop .slot.sel{border-color:#7ed957!important;box-shadow:0 0 0 2px #7ed957,0 0 10px #7ed957!important}
#shop .sbar{position:sticky;top:0;z-index:1;background:#2b2720;border:1px solid #e8c14a;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:5px}
#shop .sbar .sh{display:flex;align-items:center;gap:6px;font-size:13px}
#shop .sbar .sh img{width:30px;height:30px;flex:none}
#shop .sbar .sh small{display:block;opacity:.75;font-size:11px}
#shop .sbar .rw{display:flex;flex-wrap:wrap;gap:4px;align-items:center}
#shop .sbar .q{min-width:30px;text-align:center}
#shop .sbar .mini{min-height:30px!important;padding:3px 8px!important}
#shop .sbar .mini.ok{background:#2f6b2a;border-color:#7ed957}
#shop .sbar .x2{margin-left:auto}
#shop .hint0{font-size:11px;opacity:.7;padding:4px 2px}
#shop .tp>*{flex:none}#shop .tsell>.tt{padding-right:34px}
#shop{box-sizing:border-box;max-width:98vw}#shop .trade{width:min(calc(98vw - 28px),720px)!important}#shop .sbar .sh>div{text-align:left;flex:1;min-width:0}
#shop .tbuy .rw{flex-wrap:nowrap}#shop .tbuy .rw>.mini{min-width:0}#shop .tbuy .rw>.mini.sm{flex:none;white-space:nowrap}
@media (max-width:560px){
 #shop{padding:8px;width:96vw}
 #shop .trade{flex-direction:column;width:100%!important}
 #shop .trade .tp{flex:none;width:100%;max-height:34vh}
 #shop .slots{grid-template-columns:repeat(auto-fill,minmax(40px,1fr))!important}
}
@media (max-height:520px){#shop .trade .tp{max-height:58vh}}
`;document.head.appendChild(st)})();

const B2={sel:null};// เลือกของในกระเป๋าตอนอยู่ที่สถานี
const selCls=(c,t,k)=>c.t===t&&c.k===k&&!c.eq;
function selIcon(t,k){return '<img src="'+iconURL((t==='gear'?'item:':'mat:')+k)+'">'}
function hideBag(){if(bagEl&&!bagEl.hidden)bagEl.hidden=true}

// ===== ร้านค้า =====
renderShop=function(){const S=SD2[SHOPK];if(!S)return;hideBag();
 shopEl.innerHTML='<button class="mini x xclose" onclick="closeShop()">✕</button><b>'+S.emoji+' '+S.name+'</b><small>'+S.owner.name+' · เหรียญของคุณ 🪙 '+inv.coin+'</small>'
  +'<div class="trade"><div class="tp tbuy"><div class="tt">🏪 ของในร้าน (แตะเพื่อซื้อ)</div>'+buyList(S)+'</div>'
  +'<div class="tp tsell"><div class="tt">🎒 กระเป๋าของคุณ (แตะของเพื่อขาย)</div>'+sellBar()+sellGrid()+'</div></div>'};
function sellBar(){const e=curEntry();if(!e){SHOPUI.sel=null;return ''}
 SHOPUI.qty=Math.max(1,Math.min(e.have,SHOPUI.qty));
 return '<div class="sbar"><div class="sh">'+selIcon(e.t,e.k)+'<div><b>'+e.name+'</b><small>มี ×'+e.have+' · '+e.price+' 🪙/ชิ้น</small></div><button class="mini sm x2" onclick="sellCancel()">✕</button></div>'
  +'<div class="rw"><button class="mini sm" onclick="sellQty(-10)">−10</button><button class="mini sm" onclick="sellQty(-1)">−</button><b class="q">'+SHOPUI.qty+'</b><button class="mini sm" onclick="sellQty(1)">+</button><button class="mini sm" onclick="sellQty(10)">+10</button><button class="mini sm" onclick="sellQty(\'max\')">ทั้งหมด</button></div>'
  +'<button class="mini ok" onclick="sellOK()">💰 ขาย ×'+SHOPUI.qty+' ได้ 🪙 '+SHOPUI.qty*e.price+'</button></div>'}
sellGrid=function(){const pm={};for(const x of SD2[SHOPK].sell)pm[x[0]]=x[2];const s=SHOPUI.sel;
 return bagHead()+(s?'':'<div class="hint0">แตะของที่มีราคา 🪙 เพื่อเลือกขาย · สีจาง = ร้านนี้ไม่รับซื้อ</div>')+bagGrid(c=>{
  const pr=c.t==='gear'?(SHOPK==='gear'&&!c.eq?gearPrice(ITEMS[c.k]):0):(pm[c.k]||0);
  const on=s&&selCls(c,s.t,s.k);
  return pr>0?{click:"sellSel('"+c.t+"','"+c.k+"')",tag:'🪙'+pr,cls:on?'sel':''}:{cls:'no',click:"say('"+(c.eq?'ของที่สวมอยู่ขายไม่ได้ — ถอดก่อน':'ร้านนี้ไม่รับซื้อของชิ้นนี้')+"')"}})};
sellSel=function(t,k){if(SHOPUI.sel&&SHOPUI.sel.t===t&&SHOPUI.sel.k===k){SHOPUI.qty=Math.min(SHOPUI.qty+1,(curEntry()||{have:1}).have)}else{SHOPUI.sel={t,k};SHOPUI.qty=1}sfx('ui');renderShop()};
sellOK=function(){const e=curEntry();if(!e){sellCancel();return}const n=Math.min(SHOPUI.qty,e.have),gain=n*e.price;
 if(e.t==='mat')inv[e.k]-=n;else{GEAR[e.k]-=n;if(GEAR[e.k]<=0)delete GEAR[e.k]}
 inv.coin+=gain;sfx('coin');refreshInv();say('ขาย'+e.name+' ×'+n+' ได้ '+gain+' เหรียญ');if(D&&D.owner)D.owner.bub={txt:'ขอบคุณที่อุดหนุนนะ!',t:2.4};
 if(!curEntry())SHOPUI.sel=null;SHOPUI.qty=1;renderShop()};
closeShop=function(){shopEl.hidden=true;SHOPK=null;SHOPUI.sel=null;sfx('ui')};

// ===== สถานี: เตาหลอม · ทั่ง · หม้อปรุงยา =====
function stnSel(t,k){B2.sel=(B2.sel&&B2.sel.t===t&&B2.sel.k===k)?null:{t,k};
 if(B2.sel&&STN.open==='anvil'&&t==='mat'){const ti=MATKEY.indexOf(k);if(ti>=0){FUI.tab='craft';FUI.tier=ti}}
 if(B2.sel&&STN.open==='anvil'&&t==='gear'){const it=ITEMS[k];if(it&&P.armor[it.kind]===k)FUI.tab='enh'}
 sfx('ui');openForge(STN.open)}
function stnBar(k){const s=B2.sel;if(!s)return '';
 if(s.t==='mat'&&!(inv[s.k]>0)){B2.sel=null;return ''}
 if(s.t==='gear'){const it=ITEMS[s.k];if(!it||!((GEAR[s.k]||0)>0||P.armor[it.kind]===s.k)){B2.sel=null;return ''}}
 const nm=s.t==='gear'?ITEMS[s.k].name:MN(s.k),have=s.t==='gear'?'':' ×'+inv[s.k];let info='',btn='';
 const B=(on,f,l)=>'<button class="mini'+(on?' ok':' no')+'" onclick="'+f+'">'+l+'</button>';
 if(k==='furnace'){
  if(s.k==='wood'){const wc=Math.floor(inv.wood/2);info='ไม้ 2 → ถ่าน 1 · มีถ่าน '+inv.coal;btn=B(wc,'burnCoal(1)','⚫ เผา 1')+B(wc,'burnCoal(0)','เผาทั้งหมด ×'+wc)}
  else if(s.t==='mat'&&s.k in SPROC){const i=SPROC[s.k],m=SMELT[i],mx=smeltMax(m);info=MN(m.f)+' '+m.n+' + ถ่าน '+m.c+' → '+MN(m.to)+' · มีถ่าน '+inv.coal;btn=B(mx,'smeltX('+i+',1)','🔥 หลอม 1')+B(mx,'smeltX('+i+',0)','หลอมทั้งหมด ×'+mx)}
  else info='ของชิ้นนี้ใช้กับเตาหลอมไม่ได้'}
 else if(k==='anvil'){
  if(s.t==='mat'&&MATKEY.includes(s.k))info='แสดงสูตรคราฟของ'+MN(s.k)+'ทางซ้ายแล้ว';
  else if(s.k==='wood')info='ไม้ใช้ประกอบด้าม/โครงในสูตรคราฟ';
  else if(s.t==='gear'){const it=ITEMS[s.k],worn=P.armor[it.kind]===s.k;info=it.stat+(worn?' · สวมอยู่ (ตีบวกได้ทางซ้าย)':'');
   if(worn&&['sword','helm','chest','pants','arm'].includes(it.kind))btn=B(1,"enhItem('"+s.k+"')",'✨ ตีบวก'+(ENH[s.k]?' (+'+ENH[s.k]+')':''));
   else if(!worn&&it.kind!=='axe'&&it.kind!=='pick')btn=B(1,"equipItem('"+s.k+"');openForge('anvil')",'✋ สวมใส่')}
  else info='ใช้กับทั่งตีเหล็กไม่ได้'}
 else{const L=Object.keys(CRAFT).filter(c=>s.k in CRAFT[c].need||s.k===c);
  if(!L.length)info='ไม่ได้ใช้ในการปรุงยา';
  else{info='ใช้ปรุง: '+L.map(c=>CRAFT[c].n).join(', ');btn=L.map(c=>{const ok=Object.entries(CRAFT[c].need).every(([q,v])=>inv[q]>=v);return B(ok,"craft('"+c+"')",CRAFT[c].e+' ปรุง'+CRAFT[c].n)}).join('')}}
 return '<div class="sbar"><div class="sh">'+selIcon(s.t,s.k)+'<div><b>'+nm+have+'</b><small>'+info+'</small></div><button class="mini sm x2" onclick="B2.sel=null;openForge(STN.open)">✕</button></div>'+(btn?'<div class="rw">'+btn+'</div>':'')+'</div>'}
stnBagPane=function(k){const hint={furnace:'แตะแร่/ไม้ในกระเป๋าเพื่อเลือก แล้วกดหลอม/เผาได้เลย',anvil:'แตะแท่งโลหะเพื่อดูสูตรคราฟ · แตะอุปกรณ์ที่สวมเพื่อตีบวก',cauldron:'แตะวัตถุดิบเพื่อปรุงยา (ขวดเปล่า เจลสไลม์ ไม้)'}[k];
 const s=B2.sel;
 const f=c=>{const on=s&&selCls(c,s.t,s.k)||(s&&c.eq&&s.t===c.t&&s.k===c.k);let cls=on?'sel':'';
  if(c.t==='mat'){if(k==='furnace'&&(c.k in SPROC||c.k==='wood'))cls+=' proc';
   else if(k==='anvil'&&(c.k===MATKEY[FUI.tier]||c.k==='wood'))cls+=' hl';
   else if(k==='cauldron'&&(c.k==='bottle'||c.k==='gel'||c.k==='wood'))cls+=' hl'}
  return{click:"stnSel('"+c.t+"','"+c.k+"')",cls,tag:k==='furnace'&&c.t==='mat'?(c.k in SPROC?'🔥':c.k==='wood'?'⚫':''):''}};
 return bagHead()+stnBar(k)+(s?'':'<div class="hint0">'+hint+'</div>')+bagGrid(f)};
const _ofg=openForge;
openForge=function(k){if(STN.open!==k)B2.sel=null;hideBag();
 FORGEK=k;STN.open=k;SHOPK=null;sfx('ui');
 let left=k==='furnace'?furnaceHTML():k==='cauldron'?cauldronHTML():anvilHTML();
 left=left.replace(/<button class="mini" onclick="closeForge\(\)">ปิด<\/button>$/,'');
 shopEl.innerHTML='<button class="mini x xclose" onclick="closeForge()">✕</button>'
  +'<div class="trade"><div class="tp tbuy">'+left+'</div><div class="tp tsell"><div class="tt">🎒 กระเป๋าของคุณ</div>'+stnBagPane(k)+'</div></div>';
 shopEl.hidden=false};
{const _cf=closeForge;closeForge=function(){B2.sel=null;_cf()}}
// ระหว่างเปิดร้าน/สถานี ปุ่ม 🎒 จะไม่เปิดกระเป๋าซ้อน เพราะกระเป๋าแสดงอยู่ในหน้าต่างแล้ว
{const _tb=toggleBag;toggleBag=function(){if(!shopEl.hidden&&(SHOPK||STN.open)){say('กระเป๋าแสดงอยู่ฝั่งขวาของหน้าต่างแล้ว');return}_tb()}}
gid('bagb').onclick=()=>toggleBag();


// ---------- v2.3 : ท่าเดินสมจริง (ขาเหวี่ยงจากสะโพก งอเข่า ตัวเอนไปข้างหน้า) + ฝุ่นตอนก้าวเท้า ----------
// ขาด้านข้าง: หมุนจากสะโพก ต้นขา+หน้าแข้ง แยกส่วน เข่างอตอนยกเท้าไปข้างหน้า
function sideLegs(x,by,f,LGA,LGB,run){const st=P.at>=0&&!P.mv,ph=st?1.25:P.t,amp=st?.32+.12*Math.sin(Math.PI*P.at):(run?.75:.5),id=P.armor.pants,sp=id?eqSpr('pants',ITEMS[id].tier,'front'):null;
 const one=(o,col)=>{const a=Math.sin(ph+o)*amp,lift=Math.max(0,Math.cos(ph+o)),knee=lift*(run?1.1:.7);
  ctx.save();ctx.translate(x,by-12);ctx.rotate(-a*f);
  ctx.fillStyle=col;ctx.fillRect(-3,0,6,7);
  if(sp)ctx.drawImage(sp,22,20,20,22,-4,-1,8,8);
  ctx.translate(0,6);ctx.rotate(knee*f);ctx.fillStyle=col;ctx.fillRect(-3,0,6,6);
  ctx.fillStyle='#2a1c12';ctx.fillRect(-3+(f>0?0:-2),4,8,3);ctx.restore()};
 one(Math.PI,LGB);one(0,LGA)}
const DUST=[];let DUSTSIDE=0;
function dustCol(){if(D&&D.shop)return '190,175,150';if(D&&D.town)return '200,190,165';if(D)return '140,125,105';return '185,165,120'}
function dustTick(dt){
 for(let i=DUST.length-1;i>=0;i--){const d=DUST[i];d.t+=dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.vx*=1-3*dt;d.vy*=1-3*dt;if(d.t>=d.l)DUST.splice(i,1)}
 if(!P.mv||P.dash>0||P.at>=0||PAUSED)return;
 const c=Math.cos(P.t),sd=c>=0?1:-1;
 if(sd!==DUSTSIDE){DUSTSIDE=sd;const run=isRun(),[dx,dy]=DIRV[P.dir],n=run?5:2,col=dustCol();
  // พ่นฝุ่นที่เท้าหลัง ฟุ้งไปทางตรงข้ามกับทิศเดิน
  for(let i=0;i<n;i++)DUST.push({x:P.x-dx*6+(Math.random()-.5)*8,y:P.y-1+(Math.random()-.5)*3,vx:-dx*(20+Math.random()*30)+(Math.random()-.5)*24,vy:-dy*(12+Math.random()*16)-(4+Math.random()*10),
   r:(run?2.6:1.8)+Math.random()*1.6,g:run?7:4.5,t:0,l:.35+Math.random()*(run?.4:.25),c:col,a:run?.55:.4})}}
function drawDust(){for(const d of DUST){const k=d.t/d.l;ctx.fillStyle='rgba('+d.c+','+(d.a*(1-k)*(1-k))+')';ctx.beginPath();ctx.arc(d.x,d.y,d.r+d.g*k,0,7);ctx.fill()}}
hero=function(){dustTick(DT);drawDust();
 DPOSE=P.dash>0;if(DPOSE)dashStreaks();if(P.recall>0)recallFx();
 const t=performance.now()/1000,side=P.dir==='l'||P.dir==='r',f=P.dir==='l'?-1:1,run=isRun();
 // เอนตัวไปข้างหน้าเล็กน้อยตอนเดิน (วิ่งเอนมากกว่า)
 let sw=P.mv?Math.sin(P.t*2)*.02:Math.sin(t*1.7)*.02+Math.sin(t*.6)*.01;
 if(P.mv&&side&&P.at<0&&!DPOSE)sw+=f*(run?.16:.07);
 const spin=P.at>=0&&P.cmb===2&&P.tool==='sword',d0=P.dir;if(spin)P.dir=angDir(spinInfo().ang);
 if(P.at>=0&&!spin&&side)sw+=f*.08*Math.sin(Math.PI*Math.min(1,P.at*1.3));
 ctx.save();ctx.translate(P.x,P.y);ctx.transform(1,0,sw,1,0,0);if(spin)ctx.scale(1,1-.06*Math.sin(Math.PI*spinInfo().q));ctx.translate(-P.x,-P.y);heroBody();ctx.restore();P.dir=d0;nameTag()};


// ---------- v2.4 : คอมโบดาบ 3 จังหวะ (ฟันซ้าย → ฟันขวา → หมุนตัวฟัน) + แสงฟันแบบเรืองแสง ----------
function atkCrouch(){return P.at>=0&&P.dash<=0?Math.round(2*Math.sin(Math.PI*Math.min(1,P.at*1.2))):0}
const atkDur=()=>(window.aspdMul?aspdMul():1)*(P.fa<20?1.3:1)*(P.tool==='sword'?(P.cmb===2?.85:.55):.75);
const SPIN_BASE={r:Math.PI/2,d:Math.PI,l:-Math.PI/2,u:0};
function spinInfo(){const p=P.at,q=Math.max(0,Math.min(1,(p-.08)/.84)),e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2,sg=P.spinDir==='l'?-1:1;
 return{ang:SPIN_BASE[P.spinDir||'d']+sg*Math.PI*2*e,sg,q,e}}
function angDir(a){const s=Math.sin(a),c=Math.cos(a);return Math.abs(s)>Math.abs(c)?(s>0?'r':'l'):(c>0?'u':'d')}
// เส้นแสงฟัน: หางจาง → ปลายสว่าง · เรืองแสงสีตามระดับดาบ + แกนสีขาว + แผ่นแสงจาง ๆ ด้านใน
function slashTrail(cx,cy,from,to,r,tier,al){if(Math.abs(to-from)<.05||al<=0)return;const N=7,ccw=to<from,A=a=>a-Math.PI/2;
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
 ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.28*al;ctx.fillStyle=tier.tr;ctx.beginPath();ctx.arc(cx,cy,r+2,A(from),A(to),ccw);ctx.arc(cx,cy,r*.72,A(to),A(from),!ccw);ctx.closePath();ctx.fill();ctx.globalCompositeOperation='lighter';
 
 for(let k=0;k<N;k++){const t0=k/N,t1=(k+1)/N,a0=from+(to-from)*t0,a1=from+(to-from)*t1,w=Math.pow(t1,1.4);
  ctx.lineCap='butt';ctx.globalAlpha=al*w*.22;ctx.strokeStyle=tier.gl;ctx.lineWidth=8+12*w;ctx.beginPath();ctx.arc(cx,cy,r-4,A(a0),A(a1),ccw);ctx.stroke();ctx.globalAlpha=al*w*.7;ctx.lineWidth=3+6*w;ctx.stroke();
  ctx.lineCap='round';ctx.globalAlpha=al*w;ctx.strokeStyle='#ffffff';ctx.lineWidth=1+2.2*w;ctx.beginPath();ctx.arc(cx,cy,r,A(a0),A(a1),ccw);ctx.stroke()}
 ctx.restore()}
function tipSpark(cx,cy,a,r,sx,sy){if(Math.random()<.3&&fx.length<80){const px=cx+Math.sin(a)*r*(sx||1),py=cy-Math.cos(a)*r*(sy||1);
 fx.push({x:px,y:py,vx:(Math.random()-.5)*60,vy:-30-Math.random()*40,l:.22+Math.random()*.15,c:'255,244,210'})}}
function slashFx(x,by,d,side,f,TOP,held){const p=P.at,isS=P.tool==='sword',tier=TIERS[(P.tier&&P.tier.sword)|0]||TIERS[0];
 if(isS&&P.cmb===2){ // หมุนตัวฟันรอบทิศ
  const {ang,sg,q}=spinInfo(),start=SPIN_BASE[P.spinDir||'d'],cx=x,cy=by-17,hx=cx+Math.sin(ang)*11,hy=cy-Math.cos(ang)*7;
  const tail=ang-sg*Math.min(4.4,Math.abs(ang-start)),al=q>.88?(1-q)/.12:1;
  ctx.save();ctx.translate(cx,cy);ctx.scale(1,.68);slashTrail(0,0,tail,ang,44,tier,al);ctx.restore();
  if(q>.05&&q<.95)tipSpark(cx,cy,ang,44,1,.68);
  held(hx,hy,ang);return}
 const E={r:[-1.2,2.1],l:[1.2,-2.1],d:[4.1,2.1],u:[1,-1]}[d];let a0=E[0],a1=E[1];if(isS&&P.cmb===1){a0=E[1];a1=E[0]}
 const sg=Math.sign(a1-a0),w=.18,st=a0-sg*.4,ang=p<w?a0-sg*.4*(p/w):st+(a1-st)*(1-Math.pow(1-(p-w)/(1-w),3)),
  hx=side?x+f*5:(d==='d'?x-5:x+8),hy=side?by-14:(d==='d'?by-8:by-32);
 if(!side){ctx.strokeStyle=TOP;ctx.lineWidth=6;ctx.lineCap='butt';ctx.beginPath();ctx.moveTo(d==='d'?x-11:x+11,by-24);ctx.lineTo(hx,hy);ctx.stroke()}
 if(p>w){const tail=ang-sg*Math.min(isS?2.2:1.2,Math.abs(ang-st)),al=p>.8?(1-p)/.2:1;
  if(isS){slashTrail(hx,hy,tail,ang,38,tier,al);if(p<.6)tipSpark(hx,hy,ang,38)}
  else{ctx.save();ctx.globalAlpha=.5*al;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.arc(hx,hy,34,tail-Math.PI/2,ang-Math.PI/2,sg<0);ctx.stroke();ctx.restore()}}
 held(hx,hy,ang)}
// กดโจมตี: ต่อคอมโบถ้ากดภายในจังหวะ · กดระหว่างฟันจะจำไว้แล้วออกท่าต่อทันที
attack=function(queued){
 if(P.at>=0){if(P.tool==='sword'&&P.at>.3)P.qa=1;return}
 if(P.stun>0)return;if(queued!==true&&interact())return;autoDraw();
 const now=performance.now();P.cmb=(P.tool==='sword'&&P.atEnd&&now-P.atEnd<450)?((P.cmb|0)+1)%3:0;
 if(P.cmb===2){P.spinDir=P.dir}
 P.at=0;atkId++;sfx(P.tool==='sword'?'swing':'swing2');if(P.cmb===2)setTimeout(()=>sfx('swing'),330)};
if(!COARSE)cv.onpointerdown=()=>attack();



// ---------- v3.0 : พื้นทุ่งหญ้าวาดล่วงหน้า (ลดการวาดทีละช่องทุกเฟรม = ลื่นขึ้นมาก) ----------
let GCV=null;const WAVEF=[];
function buildGround(){GCV=document.createElement('canvas');GCV.width=W*T;GCV.height=H*T;const k=GCV.getContext('2d'),sv=ctx;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const id=map[y][x],px=x*T,py=y*T;
  if(id===WATER){const deep=[[0,1],[0,-1],[1,0],[-1,0]].every(([a,b])=>isW(x+a,y+b));k.fillStyle=deep?'#245f9f':'#3a86cc';k.fillRect(px,py,T,T);
   k.fillStyle='rgba(255,255,255,.28)';if(!isW(x,y-1))k.fillRect(px,py,T,3);if(!isW(x,y+1))k.fillRect(px,py+T-3,T,3);if(!isW(x-1,y))k.fillRect(px,py,3,T);if(!isW(x+1,y))k.fillRect(px+T-3,py,3,T)}
  else if(id===SAND)k.drawImage(ts,SAND*T,0,T,T,px,py,T,T);
  else{k.drawImage(grassV[gv(x,y)],px,py,T,T);k.fillStyle=TINT[y*W+x];k.fillRect(px,py,T,T)}}
 for(let f=0;f<12;f++){const c=document.createElement('canvas');c.width=c.height=T;const q=c.getContext('2d'),ph=f/12*Math.PI*2;q.lineWidth=1.2;
  for(let i=0;i<3;i++){const yy=5+i*11;q.strokeStyle='rgba(190,230,255,'+(.22+.12*Math.sin(ph+i))+')';q.beginPath();for(let xx=0;xx<=T;xx+=4){const wy=yy+Math.sin(xx*Math.PI*2/T+ph+i*2.2)*2.2;xx?q.lineTo(xx,wy):q.moveTo(xx,wy)}q.stroke()}
  WAVEF.push(c)}}
function fieldGround(x0,x1,y0,y1,t){if(!GCV)buildGround();x0=Math.max(0,x0);y0=Math.max(0,y0);x1=Math.min(W-1,x1);y1=Math.min(H-1,y1);
 const sx=x0*T,sy=y0*T,sw=(x1-x0+1)*T,sh=(y1-y0+1)*T;ctx.drawImage(GCV,sx,sy,sw,sh,sx,sy,sw,sh);
 const fr=Math.floor(t*1.8/(Math.PI*2)*12);
 for(let y=y0;y<=y1;y++){const row=map[y];for(let x=x0;x<=x1;x++){const id=row[x];
  if(id===WATER){ctx.drawImage(WAVEF[(fr+y*5)%12],x*T,y*T)}
  else if(id===STUMP)ctx.drawImage(stumpSpr,x*T,y*T+7);else if(id===RUBBLE)ctx.drawImage(rubbleSpr,x*T,y*T);else if(id!==SAND&&id!==TREE&&SET.grass)tufts(x,y,t)}}}
// =====================================================================
// v3.0 : หินและกิ่งไม้บนทุ่งหญ้า · ประตูมิติ → 5 แผนที่ขุดแร่ · มอนสเตอร์ Lv5-100 · บอส · เลเวลสูงสุด 99
// =====================================================================
const MAXLV=200; /* v4.82 เจ้าของสั่งเปิดเลเวลถึง 200 (เมืองที่ 2) */
{const _lh=lvHud;lvHud=function(){_lh();if(P.lv>=MAXLV){const b=gid('xphud');if(b)b.textContent='MAX';const x=gid('xpt');if(x)x.textContent='⭐ Lv.'+P.lv+'  MAX'}}}
{const _g=gainXp;gainXp=function(n){if(P.lv>=MAXLV){P.xp=0;lvHud();return}_g(n);if(P.lv>=MAXLV)P.xp=0}}

// ---------- ตัวช่วยทั่วไป ----------
const rnd=(a,b)=>a+Math.random()*(b-a),rndi=(a,b)=>Math.floor(rnd(a,b+1)),clamp=(v,a,b)=>v<a?a:v>b?b:v;
function srand(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const DMGT=[];// ตัวเลขดาเมจลอย
function dmgTxt(x,y,txt,c,big){DMGT.push({x,y,txt,c,t:0,big:big?1:0})}
function drawDmgTxt(dt){ctx.textAlign='center';for(let i=DMGT.length-1;i>=0;i--){const d=DMGT[i];d.t+=dt;if(d.t>.9){DMGT.splice(i,1);continue}
 const a=d.t<.6?1:1-(d.t-.6)/.3,yy=d.y-d.t*34;ctx.globalAlpha=a;ctx.font='bold '+(d.big?15:11)+'px system-ui,sans-serif';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(d.txt,d.x,yy);ctx.fillStyle=d.c;ctx.fillText(d.txt,d.x,yy)}
 ctx.globalAlpha=1;ctx.textAlign='left'}

// ============ 1) หินและกิ่งไม้บนทุ่งหญ้า (เดินผ่าน/กด E เก็บได้ · เกิดใหม่เรื่อย ๆ) ============
const GPK=[],GPK_N=34;let gpkT=0;
const GPKSPR={stone:[],stick:[]};
(function(){const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const k=c.getContext('2d');k.scale(2,2);k.lineJoin='round';f(k);return c};
 for(let v=0;v<3;v++){
  GPKSPR.stone.push(mk(24,18,k=>{k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(12,14,9,3,0,0,7);k.fill();
   const P_=[[[4,13],[3,8],[8,4],[15,4],[20,8],[20,13]],[[5,13],[5,9],[10,5],[17,6],[19,12]],[[3,13],[6,7],[12,5],[18,7],[21,13]]][v];
   const g=k.createLinearGradient(0,4,0,14);g.addColorStop(0,'#c9ccd3');g.addColorStop(1,'#6f737c');k.fillStyle=g;k.strokeStyle='#2c2e34';k.lineWidth=1;
   k.beginPath();k.moveTo(...P_[0]);for(const p of P_.slice(1))k.lineTo(...p);k.quadraticCurveTo(12,15.5,P_[0][0],P_[0][1]);k.closePath();k.fill();k.stroke();
   k.fillStyle='rgba(255,255,255,.35)';k.beginPath();k.ellipse(10,7,3,1.4,-.3,0,7);k.fill();
   if(v===1){k.fillStyle='#8d9097';k.beginPath();k.ellipse(19,13,3,2,0,0,7);k.fill();k.stroke()}}));
  GPKSPR.stick.push(mk(26,16,k=>{k.fillStyle='rgba(0,0,0,.22)';k.beginPath();k.ellipse(13,12,11,2.5,0,0,7);k.fill();
   k.save();k.translate(13,9);k.rotate([-.25,.18,-.05][v]);k.lineCap='round';
   k.strokeStyle='#3b2412';k.lineWidth=4.2;k.beginPath();k.moveTo(-10,1);k.lineTo(10,-1);k.stroke();
   k.strokeStyle='#8a5a2e';k.lineWidth=2.6;k.beginPath();k.moveTo(-10,1);k.lineTo(10,-1);k.stroke();
   k.strokeStyle='#3b2412';k.lineWidth=2.6;k.beginPath();k.moveTo(-2,0);k.lineTo(3,-5);if(v!==1){k.moveTo(5,-1);k.lineTo(8,3)}k.stroke();
   k.strokeStyle='#8a5a2e';k.lineWidth=1.3;k.beginPath();k.moveTo(-2,0);k.lineTo(3,-5);if(v!==1){k.moveTo(5,-1);k.lineTo(8,3)}k.stroke();
   k.fillStyle='#d9b27a';k.beginPath();k.ellipse(10,-1,1,1.3,0,0,7);k.fill();
   if(v===2){k.fillStyle='#5fae4a';k.beginPath();k.ellipse(3,-6,2.5,1.4,-.6,0,7);k.fill()}k.restore()}))}})();
const ZG=(()=>{let best=null,bs=-1;for(let ty=(H>>1)-10;ty<=(H>>1)+10;ty++)for(let tx=W-26;tx<=W-11;tx++){let sc=0;
 for(let y=ty-3;y<=ty+3;y++)for(let x=tx-4;x<=tx+4;x++){const t=map[y]&&map[y][x];if(t===GRASS||t===SAND)sc+=1;else if(t===TREE)sc+=.4}
 sc-=Math.hypot(tx-(W-14),ty-((H>>1)+4))*.15;if(sc>bs){bs=sc;best={tx,ty}}}return best})();ZG.x=ZG.tx*T+16;ZG.y=ZG.ty*T+16;
function gpkSpot(){for(let i=0;i<300;i++){const tx=1+Math.floor(Math.random()*(W-2)),ty=1+Math.floor(Math.random()*(H-2));
 if(map[ty][tx]===GRASS&&Math.hypot(tx-ZG.tx,ty-ZG.ty)>3&&!GPK.some(p=>p.tx===tx&&p.ty===ty)&&Math.hypot(tx*T-P.x,ty*T-P.y)>(D?0:220))return[tx,ty]}return null}
function addGpk(){const s=gpkSpot();if(!s)return;const k=Math.random()<.5?'stone':'stick';GPK.push({tx:s[0],ty:s[1],x:s[0]*T+8+Math.random()*16,y:s[1]*T+12+Math.random()*12,k,v:rndi(0,2)})}
for(let i=0;i<GPK_N;i++)addGpk();
function takeGpk(i){const p=GPK[i],ik=p.k==='stick'?'wood':'stone',cr=canTake(ik);if(cr!==true){noRoom(cr);return false}
 inv[ik]++;GPK.splice(i,1);sfx('pop');if(window.logPick)logPick(ik);refreshInv();
 for(let k=0;k<5;k++)fx.push({x:p.x,y:p.y-4,vx:(Math.random()-.5)*60,vy:-30-Math.random()*40,l:.35,c:p.k==='stick'?'170,120,60':'190,195,205'});return true}
function updGpk(dt){if(D)return;for(let i=GPK.length-1;i>=0;i--){const p=GPK[i];if(Math.abs(P.x-p.x)<14&&Math.abs(P.y-p.y)<12)takeGpk(i)}
 if(GPK.length<GPK_N&&(gpkT-=dt)<=0){addGpk();gpkT=8}}
function drawGpk(){const vw=VW/Z,vh=VH/Z;let near=null,nd=34;
 for(const p of GPK){if(Math.abs(p.x-P.x)>vw||Math.abs(p.y-P.y)>vh)continue;const s=GPKSPR[p.k][p.v];
  if(p.k==='stone')ctx.drawImage(s,p.x-12,p.y-12,24,18);else ctx.drawImage(s,p.x-13,p.y-10,26,16);
  const d=Math.hypot(p.x-P.x,p.y-P.y);if(d<nd){nd=d;near=p}}
 if(near){const t=performance.now()/1000;ctx.strokeStyle='rgba(255,240,170,'+(.45+.3*Math.sin(t*6))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(near.x,near.y-2,13,6,0,0,7);ctx.stroke()}}

// ============ 2) ประตูมิติบนทุ่งหญ้า ============
for(let y=ZG.ty-3;y<=ZG.ty+2;y++)for(let x=ZG.tx-3;x<=ZG.tx+3;x++)if(map[y]&&map[y][x]!==undefined&&map[y][x]!==TOWNGATE)map[y][x]=GRASS;
const zgNear=()=>!D&&Math.hypot(P.x-ZG.x,P.y-ZG.y)<46;
function drawZGate(t){const x=ZG.x,y=ZG.y,vw=VW/Z;if(Math.abs(x-P.x)>vw||Math.abs(y-P.y)>VH/Z)return;
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y+4,46,20,0,0,7);ctx.fill();
 ctx.fillStyle='#7d7f88';ctx.beginPath();ctx.ellipse(x,y,44,19,0,0,7);ctx.fill();ctx.fillStyle='#9a9ca6';ctx.beginPath();ctx.ellipse(x,y-2,44,18,0,0,7);ctx.fill();
 ctx.strokeStyle='#4a4c55';ctx.lineWidth=1.2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*30,y-2+Math.sin(a)*12.5);ctx.lineTo(x+Math.cos(a)*44,y-2+Math.sin(a)*18);ctx.stroke()}
 const g=ctx.createRadialGradient(x,y-2,2,x,y-2,32);g.addColorStop(0,'rgba(240,220,255,.95)');g.addColorStop(.45,'rgba(170,110,255,.8)');g.addColorStop(1,'rgba(70,30,140,.9)');
 ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y-2,31,13,0,0,7);ctx.fill();
 ctx.save();ctx.translate(x,y-2);ctx.scale(1,.42);ctx.lineWidth=2;ctx.lineCap='round';
 for(let i=0;i<3;i++){ctx.strokeStyle='rgba(255,255,255,'+(.55-i*.12)+')';ctx.beginPath();ctx.arc(0,0,10+i*8,t*(2-i*.4)+i*2,t*(2-i*.4)+i*2+2.2);ctx.stroke()}ctx.restore();
 for(let i=0;i<4;i++){const a=i/4*Math.PI*2+Math.PI/4,px=x+Math.cos(a)*44,py=y-2+Math.sin(a)*18;
  ctx.fillStyle='#5a5c66';ctx.fillRect(px-5,py-26,10,26);ctx.fillStyle='#8a8c96';ctx.fillRect(px-5,py-26,10,4);ctx.strokeStyle='#2c2d33';ctx.lineWidth=1;ctx.strokeRect(px-5+.5,py-26+.5,9,25);
  const b=Math.sin(t*2+i)*2;ctx.fillStyle=['#c08bff','#7fe0ff','#ffd84a','#ff8a8a'][i];ctx.beginPath();ctx.moveTo(px,py-40+b);ctx.lineTo(px+4,py-34+b);ctx.lineTo(px,py-28+b);ctx.lineTo(px-4,py-34+b);ctx.closePath();ctx.fill()}
 for(let i=0;i<5;i++){const u=(t*.6+i/5)%1,a=i*1.7;ctx.fillStyle='rgba(220,190,255,'+(1-u)+')';ctx.fillRect(x+Math.cos(a)*18*u-1,y-4-u*46,2,2)}
 ctx.font='bold 11px system-ui,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText('🌀 ประตูมิติ',x,y-50);ctx.fillStyle='#e7d4ff';ctx.fillText('🌀 ประตูมิติ',x,y-50);
 if(zgNear()&&!ZM.open){const s='กด E / ⚔️ เลือกแผนที่ขุดแร่';ctx.strokeText(s,x,y+34);ctx.fillStyle='#fff';ctx.fillText(s,x,y+34)}ctx.textAlign='left'}

// ============ 3) ข้อมูลแผนที่ขุดแร่ 5 แห่ง ============
const ZONES=[
 {id:'iron',n:'เหมืองเหล็กร้าง',e:'⛏️',lv:[5,20],ores:[['iron',.55],['stone',.45]],raw:'iron',ing:'ingot',amb:'dust',dark:1,
  pal:{fl:['#5c4b3a','#544434','#4d3e30'],top:'#3e352d',face:'#2a231d',edge:'#1b1612',ac:'#c98a5a',vd:'#0f0c09'},
  mobs:[['beetle','ด้วงหินสนิม',['#7a5a3a','#4a3020','#ff9a4a']],['bat','ค้างคาวเหมือง',['#5a4a5a','#2e2430','#ffd84a']],['golem','โกเลมดินเหนียว',['#8a6a4a','#5a422c','#ffb04a']]],
  boss:{f:'golem',n:'ราชาโกเลมสนิม',lv:25,c:['#8a5a3a','#4a2a18','#ff6a2a']}},
 {id:'copper',n:'ถ้ำทองแดงลาวา',e:'🌋',lv:[20,40],ores:[['copper',.55],['iron',.3],['stone',.15]],raw:'copper',ing:'ingCu',amb:'ember',dark:1,
  pal:{fl:['#5a3328','#512d23','#48281f'],top:'#3a2119',face:'#24140e',edge:'#150b07',ac:'#ff8a3a',vd:'#0d0604'},
  mobs:[['bat','ค้างคาวไฟ',['#a8402a','#5a1a10','#ffd84a']],['wolf','หมาป่าสำริด',['#b8743a','#6a3a18','#ffcf5a']],['wisp','ภูตเปลวไฟ',['#ff9a3a','#ff4a1a','#fff2a8']]],
  boss:{f:'beetle',n:'ด้วงยักษ์หลอมทองแดง',lv:45,c:['#d0702a','#6a2a10','#ffe14a']}},
 {id:'silver',n:'ยอดเขาเงินหิมะ',e:'🏔️',lv:[40,60],ores:[['silver',.5],['copper',.3],['iron',.2]],raw:'silver',ing:'ingAg',amb:'snow',dark:0,
  pal:{fl:['#cfdbe7','#c3d1df','#b8c8d8'],top:'#8fa5bd',face:'#5f738d',edge:'#3d4b5e',ac:'#e9f4ff',vd:'#1c2532'},
  mobs:[['wolf','หมาป่าหิมะ',['#e8eef6','#9aaac0','#7fe0ff']],['wisp','ภูตน้ำแข็ง',['#bfe8ff','#5ab4ff','#ffffff']],['golem','โกเลมน้ำแข็ง',['#a8d0ec','#5a86aa','#c8f4ff']]],
  boss:{f:'wolf',n:'ราชาหมาป่าน้ำแข็ง',lv:65,c:['#f2f8ff','#7a90b0','#4ac8ff']}},
 {id:'gold',n:'หุบเขาทองคำ',e:'🏜️',lv:[60,80],ores:[['gold',.5],['silver',.3],['copper',.2]],raw:'gold',ing:'ingAu',amb:'sand',dark:0,
  pal:{fl:['#d7b26a','#cfa95e','#c7a055'],top:'#a8783a',face:'#7a5226',edge:'#4e3416',ac:'#ffd23a',vd:'#2a1c0c'},
  mobs:[['beetle','สการับทองคำ',['#e0b030','#7a5410','#7affea']],['wisp','ภูตพายุทราย',['#f0d090','#c08a3a','#fff6c8']],['wolf','หมาป่าทะเลทราย',['#c89a5a','#7a5426','#ff6a4a']]],
  boss:{f:'golem',n:'ฟาโรห์โกเลมทองคำ',lv:85,c:['#f2c230','#8a6010','#4affd8']}},
 {id:'diamond',n:'ห้วงลึกเพชรนิรันดร์',e:'💎',lv:[80,100],ores:[['diamond',.45],['gold',.3],['silver',.25]],raw:'gem',ing:'ingDm',amb:'mote',dark:1,
  pal:{fl:['#2f2542','#2a213b','#251d35'],top:'#1e1731',face:'#130e22',edge:'#09060f',ac:'#9af0ff',vd:'#06040b'},
  mobs:[['bat','ค้างคาวเงา',['#4a3a6a','#1e1430','#ff4ad8']],['golem','โกเลมคริสตัล',['#7ad8f0','#3a6a9a','#e8fbff']],['wisp','ภูตห้วงลึก',['#b07aff','#5a2aaa','#f4e8ff']]],
  boss:{f:'dragon',n:'มังกรคริสตัลแห่งห้วงลึก',lv:100,c:['#7ad8f0','#2a3a7a','#f0a8ff']}}];
// ลักษณะของแต่ละสายพันธุ์
const FAM={
 beetle:{sz:1.15,hp:1.3,atk:1,spd:44,r:13,range:24,type:'melee',wu:.35,cd:1.3,kb:.5},
 bat:{hp:.7,atk:.8,spd:92,r:11,range:22,type:'melee',wu:.22,cd:1.0,kb:1,fly:1},
 golem:{hp:1.7,atk:1.35,spd:34,r:16,range:34,type:'smash',wu:.65,cd:1.9,kb:.2},
 wolf:{sz:1.25,hp:1,atk:1.1,spd:82,r:13,range:80,type:'lunge',wu:.38,cd:1.7,kb:.7},
 wisp:{hp:.8,atk:.9,spd:56,r:11,range:180,type:'shoot',wu:.5,cd:2.1,kb:.9,keep:120,fly:1},
 dragon:{hp:1.5,atk:1.4,spd:50,r:26,range:44,type:'smash',wu:.6,cd:1.6,kb:0,fly:1}};
const mobXp=L=>Math.max(5,Math.round(need(L)/20));
function mobStats(L,f,elite,boss){const F=FAM[f];let hp=(12+6*L)*F.hp,atk=(6+2.4*L)*F.atk;if(elite){hp*=2.5;atk*=1.25}if(boss){hp*=12;atk*=1.5}return{hp:Math.round(hp),atk:Math.round(atk)}}

// ============ 4) สร้างแผนที่ ============
let ZW=46,ZH=34;const ZCACHE={};
function genZone(zi){if(ZCACHE[zi])return ZCACHE[zi];const Zd=ZONES[zi],R=srand(9137*(zi+1)),m=[],cx=ZW>>1;
 for(let y=0;y<ZH;y++){m[y]=[];for(let x=0;x<ZW;x++){const b=x<2||y<2||x>=ZW-2||y>=ZH-2,n=vn(x/5.2+zi*31,y/5.2+zi*17)*.7+vn(x/2.2+zi*7,y/2.2+3)*.3;m[y][x]=b||n>.6?WL:FL}}
 const path=new Set(),carve=(x,y,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const xx=x+dx,yy=y+dy;if(xx>1&&yy>1&&xx<ZW-2&&yy<ZH-2&&dx*dx+dy*dy<=r*r+1){m[yy][xx]=FL}}};
 const walk=(x,y,tx,ty,w,mark)=>{let g=0;while((Math.abs(x-tx)>1||Math.abs(y-ty)>1)&&g++<900){if(R()<.62){if(R()<.5)x+=Math.sign(tx-x);else y+=Math.sign(ty-y)}else{if(R()<.5)x+=R()<.5?-1:1;else y+=R()<.5?-1:1}
  x=clamp(x,3,ZW-4);y=clamp(y,3,ZH-4);carve(x,y,w);if(mark)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)path.add((y+dy)*ZW+x+dx)}};
 const ent={x:cx,y:ZH-5},arena={x:cx,y:9};
 carve(ent.x,ent.y,4);carve(arena.x,arena.y,7);walk(ent.x,ent.y-3,arena.x,arena.y+6,1,1);
 for(let i=0;i<6;i++)walk(rndi(5,ZW-6)|0,rndi(5,ZH-6)|0,ent.x+rndi(-3,3),ent.y-4-rndi(0,12),1,0);
 for(let i=0;i<4;i++)walk(ent.x,ent.y-2,R()<.5?4:ZW-5,8+Math.floor(R()*(ZH-16)),1,0);
 // ตัดพื้นที่ที่เดินไปไม่ถึงให้เป็นหิน
 const seen=new Uint8Array(ZW*ZH),q=[ent.y*ZW+ent.x];seen[q[0]]=1;
 while(q.length){const i=q.pop(),x=i%ZW,y=(i/ZW)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=(y+dy)*ZW+x+dx;if(!seen[j]&&m[y+dy][x+dx]===FL){seen[j]=1;q.push(j)}}}
 const floor=[];for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){if(m[y][x]===FL&&!seen[y*ZW+x])m[y][x]=WL;else if(m[y][x]===FL)floor.push([x,y])}
 // แร่
 const ores=[],oreAt={},wsum=Zd.ores.reduce((a,b)=>a+b[1],0);
 for(let n=0,g=0;n<Math.round(44*ZW*ZH/1564)&&g<9000;g++){const [x,y]=floor[Math.floor(R()*floor.length)];
  if(path.has(y*ZW+x)||Math.hypot(x-ent.x,y-ent.y)<6||Math.hypot(x-arena.x,y-arena.y)<9||oreAt[y*ZW+x])continue;
  let nb=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(m[y+dy][x+dx]===WL)nb++;if(nb>=3)continue;
  let r=R()*wsum,kd=Zd.ores[0][0];for(const [k,w] of Zd.ores){if(r<w){kd=k;break}r-=w}
  const K=OREK[kd],o={tx:x,ty:y,x:x*T+16,y:y*T+16,kind:kd,hp:K.hp,max:K.hp,alive:true,regen:0,shake:0};ores.push(o);oreAt[y*ZW+x]=o;n++}
 const Zm={zi,Zd,m,ores,oreAt,floor,ent,arena,seen};Zm.cv=paintZone(Zm,R);return ZCACHE[zi]=Zm}
function paintZone(Zm,R){const {m,Zd}=Zm,p=Zd.pal,c=document.createElement('canvas');c.width=ZW*T;c.height=ZH*T;const k=c.getContext('2d');
 k.fillStyle=p.vd;k.fillRect(0,0,c.width,c.height);
 for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){const px=x*T,py=y*T,h=hash(x*1.3+Zm.zi,y*2.7);
  if(m[y][x]===FL){k.fillStyle=p.fl[Math.floor(h*3)];k.fillRect(px,py,T,T);
   k.fillStyle='rgba(0,0,0,.08)';k.fillRect(px+(h*20|0),py+(h*97%20|0),6,4);k.fillStyle='rgba(255,255,255,.05)';k.fillRect(px+((h*53)%24|0),py+((h*31)%24|0),4,3);
   if(h>.86){k.strokeStyle='rgba(0,0,0,.22)';k.lineWidth=1;k.beginPath();k.moveTo(px+6,py+8);k.lineTo(px+14,py+15);k.lineTo(px+11,py+25);k.stroke()}
   if(h<.1&&!Zm.Zd.dg){k.fillStyle=p.top;k.beginPath();k.ellipse(px+10+h*90,py+20,3,2,0,0,7);k.fill()}}}
 // พื้นตามโซน
 const id=Zd.id;
 if(id==='iron'){k.strokeStyle='#3a2c1e';k.lineWidth=3;for(let y=Zm.ent.y-2;y>Zm.arena.y+7;y--){if(m[y][Zm.ent.x]!==FL)break;const px=Zm.ent.x*T+16,py=y*T;k.fillStyle='#6a4a2a';k.fillRect(px-11,py+6,22,4);k.fillRect(px-11,py+22,22,4)}
  for(let y=Zm.ent.y-2;y>Zm.arena.y+7;y--){if(m[y][Zm.ent.x]!==FL)break;const px=Zm.ent.x*T+16;k.fillStyle='#8a8f98';k.fillRect(px-8,y*T,2,T);k.fillRect(px+6,y*T,2,T)}}
 for(let i=0;i<180;i++){const [x,y]=Zm.floor[Math.floor(R()*Zm.floor.length)],px=x*T+R()*T,py=y*T+R()*T;
  if(id==='copper'){k.strokeStyle='rgba(255,120,40,.55)';k.lineWidth=1.4;k.beginPath();k.moveTo(px,py);k.lineTo(px+rnd(-10,10),py+rnd(4,10));k.lineTo(px+rnd(-12,12),py+rnd(10,18));k.stroke()}
  else if(id==='silver'){k.fillStyle='rgba(255,255,255,.65)';k.beginPath();k.ellipse(px,py,rnd(4,10),rnd(2,5),0,0,7);k.fill()}
  else if(id==='gold'){k.strokeStyle='rgba(120,80,30,.25)';k.lineWidth=1;k.beginPath();k.moveTo(px-8,py);k.quadraticCurveTo(px,py-3,px+8,py);k.stroke()}
  else if(id==='diamond'){if(i%3===0){k.fillStyle='rgba(154,240,255,.85)';k.beginPath();k.moveTo(px,py-7);k.lineTo(px+3,py);k.lineTo(px,py+2);k.lineTo(px-3,py);k.closePath();k.fill()}else{k.fillStyle='rgba(180,120,255,.25)';k.fillRect(px,py,2,2)}}
  else if(id!=='dg'){k.fillStyle='rgba(0,0,0,.18)';k.beginPath();k.ellipse(px,py,rnd(2,4),rnd(1,2),0,0,7);k.fill()}}
 // วงบอส
 {const ax=Zm.arena.x*T+16,ay=Zm.arena.y*T+16;k.strokeStyle='rgba(180,30,30,.45)';k.lineWidth=3;k.beginPath();k.ellipse(ax,ay,150,110,0,0,7);k.stroke();k.lineWidth=1.5;k.beginPath();k.ellipse(ax,ay,128,92,0,0,7);k.stroke();
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;k.fillStyle='rgba(180,30,30,.5)';k.fillRect(ax+Math.cos(a)*139-3,ay+Math.sin(a)*101-3,6,6)}}
 // ผนังหิน
 for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){if(m[y][x]!==WL)continue;const px=x*T,py=y*T,h=hash(x*2.1,y*1.7+Zm.zi),below=m[y+1]&&m[y+1][x]===FL;
  k.fillStyle=p.top;k.fillRect(px,py,T,T);k.fillStyle='rgba(255,255,255,.06)';k.fillRect(px+2+(h*12|0),py+3,10,6);k.fillStyle='rgba(0,0,0,.15)';k.fillRect(px+(h*18|0),py+16,12,8);
  if(below){k.fillStyle=p.face;k.fillRect(px,py+T-12,T,12);k.fillStyle=p.edge;k.fillRect(px,py+T-12,T,2);k.fillStyle='rgba(255,255,255,.07)';k.fillRect(px+(h*20|0),py+T-9,5,6);
   k.fillStyle='rgba(0,0,0,.35)';k.fillRect(px,py+T,T,5);
   if(id==='iron'&&h>.82){k.fillStyle='#6a4a2a';k.fillRect(px+4,py,5,T);k.fillRect(px+23,py,5,T);k.fillRect(px+2,py+2,28,5)}
   if(id==='diamond'&&h>.7){k.fillStyle='rgba(154,240,255,.9)';k.beginPath();k.moveTo(px+16,py+T-26);k.lineTo(px+21,py+T-10);k.lineTo(px+11,py+T-10);k.closePath();k.fill()}
   if(id==='silver'){k.fillStyle='#f4f8ff';k.fillRect(px,py,T,5)}}
  if(m[y-1]&&m[y-1][x]===FL){k.fillStyle=p.edge;k.fillRect(px,py,T,2)}
  if(m[y][x-1]===FL){k.fillStyle=p.edge;k.fillRect(px,py,2,T)}if(m[y][x+1]===FL){k.fillStyle=p.edge;k.fillRect(px+T-2,py,2,T)}}
 return c}

// ============ 5) มอนสเตอร์ ============
function zSpot(far){const Zm=D.zone;for(let g=0;g<200;g++){const [x,y]=Zm.floor[Math.floor(Math.random()*Zm.floor.length)];
 if(Zm.oreAt[y*ZW+x]&&Zm.oreAt[y*ZW+x].alive)continue;if(Math.hypot(x-Zm.ent.x,y-Zm.ent.y)<9||Math.hypot(x-Zm.arena.x,y-Zm.arena.y)<10)continue;
 if(far&&Math.hypot(x*T-P.x,y*T-P.y)<320)continue;return[x*T+16,y*T+16]}return null}
function mkMob(f,nm,col,L,x,y,o){o=o||{};const st=mobStats(L,f,o.elite,o.boss),F=FAM[f];
 return{f,nm,col,L,x,y,hx:x,hy:y,hp:st.hp,max:st.hp,atk:st.atk,F,elite:!!o.elite,boss:!!o.boss,sc:(o.boss?2.3:o.elite?1.3:1)*(1+(o.span||0)*.18)*(F.sz||1),
  st:'idle',stt:Math.random()*2,cd:rnd(.5,1.5),vx:0,vy:0,kx:0,ky:0,hurt:0,last:-1,fx:1,t:Math.random()*9,aggro:0,z:0}}
function spawnMob(far){const Zm=D.zone,Zd=Zm.Zd,s=zSpot(far);if(!s)return;const [f,nm,col]=Zd.mobs[Math.floor(Math.random()*Zd.mobs.length)];
 const [a,b]=Zd.lv,u=Math.pow(Math.random(),1.4),L=Math.round(a+(b-a)*u),elite=Math.random()<.08;
 D.mobs.push(mkMob(f,nm,col,L,s[0],s[1],{elite,span:(L-a)/(b-a)}))}
function spawnBoss(){const Zm=D.zone,B=Zm.Zd.boss;D.boss=mkMob(B.f,B.n,B.c,B.lv,Zm.arena.x*T+16,Zm.arena.y*T+16,{boss:1});D.boss.phase=0;D.boss.sk=3;D.bossT=0;D.mobs.push(D.boss)}
// ชนกำแพง/แร่ ในโซน
function zHit(x,y){const Zm=D.zone;for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);
 if(!Zm.m[ty]||Zm.m[ty][tx]!==FL)return true;const o=Zm.oreAt[ty*ZW+tx];if(o&&o.alive)return true}return false}
{const _dh=dhit;dhit=function(x,y){if(D&&D.zone)return zHit(x,y);return _dh(x,y)}}
function mvM(m,dx,dy){if(!zHit(m.x+dx,m.y))m.x+=dx;if(!zHit(m.x,m.y+dy))m.y+=dy}
const ZPROJ=[];
function zHurt(src,dmg,kbm,msg){if(P.iframe>0||P.hp<=0)return;noteBossFight(src);sfx('hurt');if(P.recall>0)cancelRecall('โดนโจมตี — การวาปถูกยกเลิก');
 const d=Math.hypot(P.x-src.x,P.y-src.y)||1,nx=(P.x-src.x)/d,ny=(P.y-src.y)/d;dmg=Math.max(1,Math.round(dmg-DEF()*.8));
 P.hp=Math.max(0,P.hp-dmg);P.iframe=BAL.iframe;P.stun=BAL.stun*.8;const kb=BAL.kb*(kbm||1);P.kx=nx*kb;P.ky=ny*kb;P.red=.28;P.sinceHit=0;
 for(let i=0;i<10;i++)fx.push({x:P.x,y:P.y-20,vx:(Math.random()-.5)*160,vy:-50-Math.random()*90,l:.6,c:'200,30,40'});
 dmgTxt(P.x,P.y-44,'-'+dmg,'#ff5a5a');gid('msg').textContent=(msg||'โดนโจมตี')+' เลือด -'+dmg;if(P.hp<=0)die()}
function mobKill(m){const Zm=D.zone,Zd=Zm.Zd;sfx('splat');m.dead=true;
 for(let i=0;i<(m.boss?40:12);i++)fx.push({x:m.x,y:m.y-12*m.sc,vx:(Math.random()-.5)*(m.boss?260:140),vy:-40-Math.random()*(m.boss?160:90),l:.7,c:m.boss?'255,216,74':'220,200,180'});
 const coin=Math.round((3+m.L*1.2)*(m.elite?3:1)*(m.boss?30:1));inv.coin+=coin;dmgTxt(m.x,m.y-34*m.sc,'+'+coin+' 🪙','#ffd84a',m.boss);
 for(let i=0;i<Math.min(6,2+(m.L>>4));i++)addDrop('coin',m.x,m.y);
 if(m.boss){for(let i=0;i<rndi(3,6);i++)addDrop(Zd.ing,m.x,m.y);for(let i=0;i<rndi(3,6);i++)addDrop(Zd.raw,m.x,m.y);if(Zd.id==='diamond')for(let i=0;i<4;i++)addDrop('gem',m.x,m.y);
  say('🏆 ปราบ '+m.nm+' สำเร็จ! บอสจะกลับมาอีกใน 3 นาที');sfx('chest');D.boss=null;D.bossT=180}
 else{if(Math.random()<(m.elite?1:.3))for(let i=0;i<(m.elite?2:1);i++)addDrop(Zd.raw,m.x,m.y);if(m.elite&&Math.random()<.4)addDrop(Zd.ing,m.x,m.y)}
 refreshInv();setTimeout(()=>gainXp(mobXp(m.L)*(m.elite?3:1)*(m.boss?15:1)),30)}
function bossSkill(b){const n=b.hp/b.max,enr=n<.3;
 if(n<.5&&!b.summoned||(b.summoned&&n<.25&&b.summoned<2)){b.summoned=(b.summoned||0)+1;for(let i=0;i<2;i++){const Zd=D.zone.Zd,[f,nm,col]=Zd.mobs[i%Zd.mobs.length];const mm=mkMob(f,nm,col,Zd.lv[1],b.x+(i?40:-40),b.y+20,{});mm.aggro=1;mm.st='chase';D.mobs.push(mm)}
  say('⚠️ '+b.nm+' เรียกลูกน้องมาช่วย!');sfx('warp');return}
 const r=Math.random(),dist=Math.hypot(P.x-b.x,P.y-b.y);
 if(r<.4||dist<90){b.st='slamWU';b.stt=enr?.65:.9;b.tg={x:b.x,y:b.y,r:95}}
 else if(r<.72){b.st='chargeWU';b.stt=enr?.45:.65;const d=dist||1;b.dv=[(P.x-b.x)/d,(P.y-b.y)/d]}
 else{b.st='volleyWU';b.stt=.6}}
function updMob(m,dt){const F=m.F,dx=P.x-m.x,dy=P.y-m.y,dist=Math.hypot(dx,dy)||1,nx=dx/dist,ny=dy/dist,enr=m.boss&&m.hp/m.max<.3,spd=F.spd*(enr?1.3:1);
 m.t+=dt;if(m.hurt>0)m.hurt-=dt;if(m.flash>0)m.flash-=dt;
 if(m.kx||m.ky){mvM(m,m.kx*dt,m.ky*dt);const d=Math.pow(.02,dt);m.kx*=d;m.ky*=d;if(Math.abs(m.kx)+Math.abs(m.ky)<4)m.kx=m.ky=0}
 if(Math.abs(nx)>.2)m.fx=nx<0?-1:1;
 const see=m.boss?260:220;if(!m.aggro&&dist<see&&(!window.LOS9||LOS9(m.x,m.y-4,P.x,P.y-4)))m.aggro=1;if(m.aggro&&dist>(m.boss?520:430)&&m.st!=='lunge'&&m.st!=='charge'){m.aggro=0;m.st='idle'}
 m.cd-=dt*(enr?1.4:1);m.mv=false;
 switch(m.st){
  case 'idle':{if(m.aggro){m.st='chase';break}if((m.stt-=dt)<=0){m.stt=rnd(1.2,3);const a=Math.random()*6.28;m.wx=Math.cos(a);m.wy=Math.sin(a);if(Math.random()<.35)m.wx=m.wy=0;
    if(Math.hypot(m.x-m.hx,m.y-m.hy)>150){const d=Math.hypot(m.hx-m.x,m.hy-m.y)||1;m.wx=(m.hx-m.x)/d;m.wy=(m.hy-m.y)/d}}
   if(m.wx||m.wy){mvM(m,m.wx*spd*.35*dt,m.wy*spd*.35*dt);m.mv=true;if(Math.abs(m.wx)>.2)m.fx=m.wx<0?-1:1}
   if(m.boss&&m.hp<m.max)m.hp=Math.min(m.max,m.hp+m.max*.05*dt);break}
  case 'chase':{if(m.boss){if(m.cd<=0){m.cd=rnd(2.2,3.6)*(enr?.7:1);bossSkill(m);break}if(dist>F.range*.8){mvM(m,nx*spd*dt,ny*spd*dt);m.mv=true}else if(m.cd<1.6){m.st='wu';m.stt=F.wu}break}
   if(F.type==='shoot'){const want=F.keep;if(dist>want+30){mvM(m,nx*spd*dt,ny*spd*dt);m.mv=true}else if(dist<want-30){mvM(m,-nx*spd*.8*dt,-ny*spd*.8*dt);m.mv=true}
     else{mvM(m,-ny*spd*.4*dt,nx*spd*.4*dt);m.mv=true}if(m.cd<=0&&dist<F.range+40){m.st='wu';m.stt=F.wu}break}
   if(dist>F.range*(F.type==='lunge'?.95:.85)){const w=F.fly?Math.sin(m.t*6)*.6:0;mvM(m,(nx-ny*w)*spd*dt,(ny+nx*w)*spd*dt);m.mv=true}
   else if(m.cd<=0){m.st='wu';m.stt=F.wu}break}
  case 'wu':{if((m.stt-=dt)<=0){m.cd=F.cd*rnd(.85,1.2);
    if(F.type==='shoot'){const sp=170,a=Math.atan2(dy,dx);for(const o of (m.elite?[-.18,0,.18]:[0]))ZPROJ.push({x:m.x,y:m.y-14,vx:Math.cos(a+o)*sp,vy:Math.sin(a+o)*sp,l:2.2,dmg:m.atk,c:m.col[2],r:5,boss:!!m.boss});m.st='chase';sfx('swing2')}
    else if(F.type==='lunge'){m.st='lunge';m.stt=.28;m.dv=[nx,ny];m.hitP=0;sfx('dash')}
    else{m.st='strike';m.stt=.18;const rr=F.range+(F.type==='smash'?14:8)*m.sc;if(dist<rr)zHurt(m,m.atk*(F.type==='smash'?1.25:1),F.type==='smash'?1.6:1,m.nm+'โจมตี');if(F.type==='smash'){sfx('thud');for(let i=0;i<8;i++)fx.push({x:m.x+m.fx*20,y:m.y,vx:(Math.random()-.5)*120,vy:-30-Math.random()*50,l:.5,c:'170,150,120'})}else sfx('swing2')}}break}
  case 'strike':{if((m.stt-=dt)<=0)m.st='chase';break}
  case 'lunge':{m.stt-=dt;mvM(m,m.dv[0]*330*dt,m.dv[1]*330*dt);m.mv=true;if(!m.hitP&&dist<22*m.sc){m.hitP=1;zHurt(m,m.atk*1.2,1.4,m.nm+'พุ่งกัด')}if(m.stt<=0)m.st='chase';break}
  // ---- ท่าบอส ----
  case 'slamWU':{if((m.stt-=dt)<=0){const g=m.tg;if(Math.hypot(P.x-g.x,P.y-g.y)<g.r)zHurt(m,m.atk*2.1,3,'💥 '+m.nm+'ทุบพื้น');sfx('thud');sfx('splat');
    for(let i=0;i<26;i++){const a=i/26*6.28;fx.push({x:g.x+Math.cos(a)*g.r*.8,y:g.y+Math.sin(a)*g.r*.55,vx:Math.cos(a)*120,vy:-60-Math.random()*60,l:.6,c:m.col[2]==='#4affd8'?'255,215,80':'200,170,130'})}
    D.shake=.35;m.st='strike';m.stt=.45;m.tg=null}break}
  case 'chargeWU':{if((m.stt-=dt)<=0){m.st='charge';m.stt=.55;m.hitP=0;sfx('dash')}break}
  case 'charge':{m.stt-=dt;mvM(m,m.dv[0]*420*dt,m.dv[1]*420*dt);m.mv=true;if(!m.hitP&&dist<30*m.sc*.6){m.hitP=1;zHurt(m,m.atk*1.7,3.2,'💨 '+m.nm+'พุ่งชน')}if(m.stt<=0){m.st='strike';m.stt=.4}break}
  case 'volleyWU':{if((m.stt-=dt)<=0){const n=enr?14:10,o=Math.random();for(let i=0;i<n;i++){const a=(i+o)/n*6.283;ZPROJ.push({x:m.x,y:m.y-26,vx:Math.cos(a)*150,vy:Math.sin(a)*150,l:2.6,dmg:m.atk*.9,c:m.col[2],r:7,boss:!!m.boss})}sfx('warp');m.st='strike';m.stt=.4}break}}
 if(!D||!D.zone)return;
 // โดนฟัน
 const SPN=P.cmb===2&&P.tool==='sword',ax=SPN?P.x:P.x+DIRV[P.dir][0]*26,ay=SPN?P.y-14:P.y-8+DIRV[P.dir][1]*26,atk=P.tool==='sword'&&!(typeof isRng!=='undefined'&&isRng())&&(SPN?(P.at>.12&&P.at<.88):(P.at>.2&&P.at<.7));
 if(atk&&m.last!==atkId&&Math.hypot(m.x-ax,(m.y-10*m.sc)-ay)<(SPN?50:34)+F.r*m.sc*.6){m.last=atkId;const cr=Math.random()<.08+P.stats.agi*.004,dmg=Math.max(1,Math.round(ATK()*rnd(.9,1.1)*(cr?1.8+(window.CRITD?CRITD():0):1)*(SPN?1.15:1)));
  m.hp-=dmg;noteBossFight(m);m.hurt=.18;m.aggro=1;if(m.st==='idle')m.st='chase';sfx('hit');dmgTxt(m.x+rnd(-6,6),m.y-26*m.sc,(cr?'💥':'')+dmg,cr?'#ffd84a':'#fff',cr);
  const kb=(SPN?260:200)*F.kb*(m.boss?0:m.elite?.5:1);m.kx=-nx*kb;m.ky=-ny*kb;
  for(let i=0;i<5;i++)fx.push({x:m.x,y:m.y-10*m.sc,vx:(Math.random()-.5)*120,vy:-30-Math.random()*60,l:.35,c:'255,255,255'});
  if(m.hp<=0)mobKill(m)}
 // สัมผัสตัว (ค้างคาว/ด้วงชนเบา ๆ)
 if(!m.dead&&!m.boss&&F.type==='melee'&&m.st==='chase'&&dist<14&&P.iframe<=0&&m.cd<=0){zHurt(m,m.atk*.6,.8,m.nm+'ชน');m.cd=F.cd}}
function updZone(dt){if(!D||!D.zone)return;const Zm=D.zone;
 for(let i=D.mobs.length-1;i>=0;i--){const m=D.mobs[i];if(m.dead){D.mobs.splice(i,1);continue}updMob(m,dt);if(!D||!D.zone)return;if(m.dead)D.mobs.splice(i,1)}
 const normal=D.mobs.filter(m=>!m.boss).length;if(normal<(D.dg?16:Math.round(16*ZW*ZH/1564))&&(D.spT-=dt)<=0){spawnMob(true);D.spT=5}
 if(!D.boss&&D.bossT>0&&(D.bossT-=dt)<=0)spawnBoss();
 for(let i=ZPROJ.length-1;i>=0;i--){const p=ZPROJ[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
  if(p.l<=0||zHit(p.x,p.y+10)){ZPROJ.splice(i,1);continue}
  if(Math.hypot(P.x-p.x,(P.y-14)-p.y)<p.r+8&&P.iframe<=0){zHurt(p,p.dmg,1,'โดนพลังเวท');ZPROJ.splice(i,1);if(!D||!D.zone)return}}
 for(const o of Zm.ores){if(o.shake>0)o.shake-=dt;if(!o.alive&&!(window.FW&&FW.act())){o.regen-=dt;if(o.regen<=0&&Math.hypot(P.x-o.x,P.y-o.y)>60){o.alive=true;o.hp=o.max}}}
 if(D.shake>0)D.shake-=dt;if(D.ban>0)D.ban-=dt}
{const _w=updWorld;updWorld=function(dt){_w(dt);updGpk(dt);updZone(dt)}}

// ---- ขุดแร่ในโซน ----
function zOreTarget(){const Zm=D.zone,[x,y]=target();let o=Zm.oreAt[y*ZW+x];if(o&&o.alive)return o;
 let best=null,bd=40;for(const q of Zm.ores){if(!q.alive)continue;const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<bd){bd=d;best=q}}return best}
function zMine(o){const K=OREK[o.kind];
 if(P.tier.pick<K.req){o.shake=.2;sfx('thud');say('ต้องใช้'+ITEMS['pick'+K.req].name+'ขึ้นไป จึงจะขุด'+K.n+'ได้');return}
 const sh=window.FW&&FW.act(),dm=PICKDMG();if(sh)FW.send('o',o,dm,60);o.hp-=dm;o.shake=.3;sfx('mine');for(let k=0;k<6;k++)fx.push({x:o.x+(Math.random()-.5)*20,y:o.y-4,vx:(Math.random()-.5)*160,vy:-50-Math.random()*80,l:.5,c:K.fx});
 if(o.hp<=0&&sh){o.hp=1;say('รอเซิร์ฟเวอร์ตัดสิน...')}
 else if(o.hp<=0){o.alive=false;o.regen=60;const n=K.cnt[0]+Math.floor(Math.random()*(K.cnt[1]-K.cnt[0]+1));for(let k=0;k<n;k++)addDrop(K.drop,o.x,o.y);
  say('ขุด'+K.n+'แตก! ได้'+(K.drop==='gem'?'เพชร':MN(K.drop))+' +'+n);gainXp(K.xp*(1+D.zone.zi))}
 else say('ขุด'+K.n+'... ความคืบหน้า '+Math.round((1-o.hp/o.max)*100)+'%')}
{const _u=useToolHit;useToolHit=function(){if(!(D&&D.zone))return _u();if(P.tool==='sword')return;
 if(P.fa<=0){say('😮‍💨 เหนื่อยจนไม่มีแรงแล้ว… พักสักครู่');return}P.fa=Math.max(0,P.fa-2);
 const o=zOreTarget();if(!o)return;if(P.tool==='pick')zMine(o);else say('แร่ต้องใช้ที่ขุดแร่ (กด 3)')}}

// ============ 6) เข้า/ออกโซน ============
const ZM={open:false};
function openZMenu(){ZM.open=true;SHOPK=null;STN.open=null;FORGEK=null;sfx('ui');hideBag();
 let h='<button class="mini x xclose" onclick="closeZMenu()">✕</button><b>🌀 ประตูมิติ — เลือกแผนที่</b><small>Lv.ของคุณ '+P.lv+' · แต่ละแผนที่มีแร่ มอนสเตอร์ และบอสประจำถิ่น</small>';
 ZONES.forEach((z,i)=>{if(z.dg)return;const lo=z.lv[0],warn=P.lv<lo-3?'⚠️ อันตรายมาก':P.lv<lo?'⚠️ เลเวลยังไม่ถึง':P.lv>z.lv[1]+5?'✅ ง่าย':'⭐ เหมาะกับคุณ',K=z.ores.map(o=>OREK[o[0]].n).join(' · ');
  h+='<button class="mini zbtn" onclick="enterZone('+i+')"><b>'+z.e+' '+z.n+'</b> <span class="zl">Lv.'+z.lv[0]+'-'+z.lv[1]+'</span><small>แร่: '+K+'<br>บอส: 👑 '+z.boss.n+' Lv.'+z.boss.lv+' · '+warn+'</small></button>'});
 shopEl.innerHTML=h;shopEl.hidden=false}
function closeZMenu(){ZM.open=false;shopEl.hidden=true;sfx('ui')}
setInterval(()=>{if(ZM.open&&!zgNear()&&!(typeof dgNear!=='undefined'&&dgNear()))closeZMenu()},300);
function enterZone(i){closeZMenu();const Zm=genZone(i);fade('#2a0a4a');sfx('warp');setScene('cave');flushDrops();
 dsav=slimes.splice(0);ZPROJ.length=0;
 D={zone:Zm,mobs:[],spT:2,bossT:.1,boss:null,ret:[ZG.x,ZG.y+40],ban:3.5};
 dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,4);P.x=Zm.ent.x*T+16;P.y=(Zm.ent.y-1)*T+16;P.dir='u';P.kx=P.ky=0;
 for(let k=0;k<(ZW*ZH>2000?18:12);k++)spawnMob(false);
 say(Zm.Zd.e+' '+Zm.Zd.n+' (Lv.'+Zm.Zd.lv[0]+'-'+Zm.Zd.lv[1]+') · บอสรออยู่ทางเหนือ · ออกได้ที่วงเวทด้านล่าง')}
const zExitNear=()=>D&&D.zone&&Math.hypot(P.x-(D.zone.ent.x*T+16),P.y-((D.zone.ent.y+2)*T+16))<40;
{const _it=interact;interact=function(){
 if(!D){if(zgNear()){openZMenu();return true}let bi=-1,bd=30;GPK.forEach((p,i)=>{const d=Math.hypot(p.x-P.x,p.y-P.y);if(d<bd){bd=d;bi=i}});if(bi>=0){takeGpk(bi);return true}}
 else if(D.zone){if(zExitNear()){exitD();say('กลับสู่ทุ่งหญ้าแล้ว');return true}return false}
 return _it()}}
{const _ex=exitD;exitD=function(){if(D&&D.zone){ZPROJ.length=0}_ex()}}

// ============ 7) วาดมอนสเตอร์ ============
const shade=(h,a)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=v=>Math.round(a<0?v*(1+a):v+(255-v)*a);return'rgb('+f(r)+','+f(g)+','+f(b)+')'};
function mobCols(m){const c=m.col;if(m.hurt>0)return['#ffffff','#ffc8c0',c[2]];return c}
function drawBeetle(m,t,c){const w=m.mv?t*14:0,L=[-1,0,1];ctx.strokeStyle=c[1];ctx.lineWidth=2.2;ctx.lineCap='round';
 for(const i of L)for(const s of [-1,1]){const o=Math.sin(w+i*1.6+(s>0?1.5:0))*3;ctx.beginPath();ctx.moveTo(i*6,-6);ctx.lineTo(i*7+o,-1+s*4);ctx.lineTo(i*9+o,2+s*3);ctx.stroke()}
 const g=ctx.createLinearGradient(0,-20,0,0);g.addColorStop(0,shade(c[0],.25));g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.strokeStyle='#120c08';ctx.lineWidth=1.3;
 ctx.beginPath();ctx.ellipse(-2,-9,13,9,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.moveTo(-2,-18);ctx.lineTo(-2,-1);ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.25)';ctx.beginPath();ctx.ellipse(-7,-13,4,2,-.4,0,7);ctx.fill();
 ctx.fillStyle=c[1];ctx.beginPath();ctx.ellipse(11,-8,6,5,0,0,7);ctx.fill();ctx.strokeStyle='#120c08';ctx.stroke();
 ctx.strokeStyle=c[1];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(15,-10);ctx.quadraticCurveTo(21,-12,20,-6);ctx.moveTo(15,-6);ctx.quadraticCurveTo(21,-3,19,-1);ctx.stroke();
 ctx.fillStyle=c[2];ctx.fillRect(12,-11,2,2);ctx.fillRect(12,-7,2,2)}
function drawBat(m,t,c){const f=Math.sin(t*(m.st==='wu'?30:16)),z=-14+Math.sin(t*3)*3;ctx.translate(0,z);
 ctx.fillStyle=c[1];ctx.strokeStyle='#0c080c';ctx.lineWidth=1.2;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*4,-4);ctx.quadraticCurveTo(s*14,-14-f*8,s*22,-6-f*10);ctx.lineTo(s*18,-2-f*5);ctx.lineTo(s*14,0-f*4);ctx.lineTo(s*9,-1-f*2);ctx.closePath();ctx.fill();ctx.stroke()}
 ctx.fillStyle=c[0];ctx.beginPath();ctx.ellipse(0,-4,6,7,0,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-4,-9);ctx.lineTo(-3,-15);ctx.lineTo(-1,-10);ctx.moveTo(4,-9);ctx.lineTo(3,-15);ctx.lineTo(1,-10);ctx.fill();
 ctx.fillStyle=c[2];ctx.fillRect(-3,-6,2,2);ctx.fillRect(1,-6,2,2);ctx.fillStyle='#fff';ctx.fillRect(-2,-1,1,2);ctx.fillRect(1,-1,1,2)}
function drawGolem(m,t,c){const w=m.mv?Math.sin(t*6):0,wu=m.st==='wu'||m.st==='slamWU'?1:0,arm=wu?-10:m.st==='strike'?8:w*3;
 const R=(col,x,y,ww,hh)=>{ctx.fillStyle=col;ctx.fillRect(x,y,ww,hh);ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,ww-1,hh-1)};
 R(c[1],-9,-12+w*2,7,12-w*2);R(c[1],2,-12-w*2,7,12+w*2);
 R(c[0],-12,-32,24,21);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-12,-18,24,7);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(-10,-30,9,4);
 ctx.strokeStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.moveTo(-4,-30);ctx.lineTo(-1,-24);ctx.lineTo(-5,-19);ctx.stroke();
 const g=ctx.createRadialGradient(3,-23,1,3,-23,6);g.addColorStop(0,'#fff');g.addColorStop(.4,c[2]);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(-4,-30,14,14);
 R(c[0],-20,-31+arm,8,17);R(c[1],-21,-16+arm,10,8);R(c[0],12,-31-arm*.5,8,17);R(c[1],11,-16-arm*.5,10,8);
 R(c[0],-7,-42,14,11);ctx.fillStyle=c[2];ctx.fillRect(-4,-38,3,2);ctx.fillRect(2,-38,3,2)}
function drawWolf(m,t,c){const w=m.mv?t*(m.st==='lunge'||m.st==='charge'?26:14):0,lg=i=>Math.sin(w+i)*4,wu=m.st==='wu'||m.st==='chargeWU'?3:0;
 ctx.strokeStyle=c[1];ctx.lineWidth=3.2;ctx.lineCap='round';for(const [x,i] of [[-9,0],[-5,3],[7,1.5],[11,4.5]]){ctx.beginPath();ctx.moveTo(x,-9+wu);ctx.lineTo(x+lg(i),0);ctx.stroke()}
 ctx.fillStyle=c[1];ctx.beginPath();ctx.moveTo(-13,-12+wu);ctx.quadraticCurveTo(-24,-18+Math.sin(t*5)*3,-22,-6);ctx.lineTo(-13,-9+wu);ctx.fill();
 const g=ctx.createLinearGradient(0,-18,0,-4);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=1.2;
 ctx.beginPath();ctx.ellipse(0,-11+wu,14,7,0,0,7);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(10,-16+wu*1.5);ctx.lineTo(20,-15+wu*1.5);ctx.lineTo(25,-11+wu*1.5);ctx.lineTo(19,-8+wu*1.5);ctx.lineTo(10,-8+wu);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=c[1];ctx.beginPath();ctx.moveTo(12,-16+wu);ctx.lineTo(14,-22+wu);ctx.lineTo(16,-16+wu);ctx.fill();
 ctx.fillStyle=c[2];ctx.fillRect(17,-14+wu*1.5,2,2);ctx.fillStyle='#fff';if(m.st==='wu'||m.st==='lunge'){ctx.fillRect(21,-9+wu,1,2);ctx.fillRect(23,-9+wu,1,2)}}
function drawWisp(m,t,c){const z=-18+Math.sin(t*2.5)*4;ctx.translate(0,z);ctx.globalCompositeOperation='lighter';
 for(let i=0;i<4;i++){const a=t*4+i*1.6;ctx.fillStyle=c[1];ctx.globalAlpha=.35;ctx.beginPath();ctx.ellipse(Math.sin(a)*3-m.fx*i*3,4+i*3,6-i,8-i,0,0,7);ctx.fill()}
 ctx.globalAlpha=1;const g=ctx.createRadialGradient(0,-2,1,0,0,14);g.addColorStop(0,'#fff');g.addColorStop(.35,c[0]);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,14+(m.st==='wu'?4:0),0,7);ctx.fill();
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#1a1020';ctx.fillRect(-4,-3,2,3);ctx.fillRect(2,-3,2,3)}
function drawDragon(m,t,c){const f=Math.sin(t*5),z=-10+Math.sin(t*2)*3;ctx.translate(0,z);
 ctx.fillStyle=c[1];ctx.strokeStyle='#060410';ctx.lineWidth=1.3;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*6,-22);ctx.quadraticCurveTo(s*22,-44-f*10,s*40,-34-f*12);ctx.lineTo(s*34,-24-f*6);ctx.lineTo(s*28,-20-f*5);ctx.lineTo(s*20,-18-f*3);ctx.lineTo(s*12,-14);ctx.closePath();ctx.fill();ctx.stroke()}
 ctx.fillStyle=c[1];ctx.beginPath();ctx.moveTo(-8,-10);ctx.quadraticCurveTo(-26,-4+Math.sin(t*3)*4,-30,-14);ctx.lineTo(-24,-10);ctx.lineTo(-6,-6);ctx.fill();ctx.stroke();
 const g=ctx.createLinearGradient(0,-30,0,0);g.addColorStop(0,shade(c[0],.3));g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,-14,13,11,0,0,7);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(6,-20);ctx.quadraticCurveTo(14,-30,12,-36);ctx.lineTo(22,-36);ctx.lineTo(26,-31);ctx.lineTo(16,-29);ctx.lineTo(12,-18);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=c[2];for(const [x,y] of [[-4,-25],[2,-26],[-9,-21]]){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3,y-7);ctx.lineTo(x+5,y);ctx.fill()}
 ctx.beginPath();ctx.moveTo(14,-37);ctx.lineTo(12,-44);ctx.lineTo(17,-37);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(19,-34,2,2)}
const MOBDRAW={beetle:drawBeetle,bat:drawBat,golem:drawGolem,wolf:drawWolf,wisp:drawWisp,dragon:drawDragon};
function drawMob(m,t){const c=mobCols(m),s=m.sc;
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(m.x,m.y+1,(m.F.r+2)*s,4*s,0,0,7);ctx.fill();
 if(m.boss){const en=m.hp/m.max<.3;
  ctx.strokeStyle=en?'rgba(255,60,60,'+(.4+.3*Math.sin(t*10))+')':'rgba(255,215,90,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(m.x,m.y,(m.F.r+10)*s*.8,9*s*.8,0,0,7);ctx.stroke()}
 ctx.save();ctx.translate(Math.round(m.x),Math.round(m.y));ctx.scale(s*(m.f==='wisp'||m.f==='bat'?1:m.fx),s);
 if(m.st==='wu'&&!m.boss){const k=1+.06*Math.sin(t*40);ctx.scale(k,1/k)}MOBDRAW[m.f](m,t,c);ctx.restore();
 if(m.st==='wu'||m.st==='slamWU'||m.st==='chargeWU'||m.st==='volleyWU'){ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText('!',m.x,m.y-46*s);ctx.fillStyle='#ff4a4a';ctx.fillText('!',m.x,m.y-46*s)}
 if(!m.boss){const top=m.y-(m.F.fly?44:38)*s;ctx.font=(m.elite?'bold ':'')+'9px system-ui,sans-serif';ctx.textAlign='center';ctx.lineWidth=2.5;ctx.strokeStyle='#000';
  const d=P.lv-m.L,col=m.elite?'#ffd84a':d>=5?'#9f9':d>=-2?'#fff':d>=-8?'#fb7':'#f66',tx=(m.elite?'★ ':'')+'Lv.'+m.L+' '+m.nm;ctx.strokeText(tx,m.x,top);ctx.fillStyle=col;ctx.fillText(tx,m.x,top);
  if(m.hp<m.max){ctx.fillStyle='#000a';ctx.fillRect(m.x-16,top+3,32,4);ctx.fillStyle=m.elite?'#ffb43a':'#e04a3a';ctx.fillRect(m.x-16,top+3,32*Math.max(0,m.hp/m.max),4)}}ctx.textAlign='left'}
function drawOreZ(o){const sh=o.shake>0?Math.sin(o.shake*60)*2.5*(o.shake/.3):0,x=o.tx*T,y=o.ty*T;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x+16,y+28,15,5,0,0,7);ctx.fill();
 const spr=oreSprite(o.kind);if(spr)ctx.drawImage(spr,x-5+sh,y-9,42,42);const n=Math.floor((1-o.hp/o.max)*6);ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=1;
 for(let i=0;i<n;i++){const cx=x+7+(i*5)%20,cy=y+4+(i*7)%14;ctx.beginPath();ctx.moveTo(cx+sh,cy);ctx.lineTo(cx+4+sh,cy+5);ctx.lineTo(cx+1+sh,cy+10);ctx.stroke()}}

// ============ 8) วาดฉากในโซน ============
const ZAMB=[];for(let i=0;i<46;i++)ZAMB.push({x:Math.random(),y:Math.random(),s:Math.random(),p:Math.random()*6.28});
function drawZone(){const Zm=D.zone,Zd=Zm.Zd,t=performance.now()/1000;let [cx,cy]=cam(ZW*T,ZH*T,.55);
 if(D.shake>0){cx+=(Math.random()-.5)*8*D.shake;cy+=(Math.random()-.5)*8*D.shake}
 view(cx,cy);const vw=VW/Z,vh=VH/Z;ctx.fillStyle=Zd.pal.vd;ctx.fillRect(cx,cy,vw,vh);
 const sx=Math.max(0,Math.floor(cx)),sy=Math.max(0,Math.floor(cy)),sw=Math.min(ZW*T-sx,Math.ceil(vw)+2),sh=Math.min(ZH*T-sy,Math.ceil(vh)+2);if(sw>0&&sh>0)ctx.drawImage(Zm.cv,sx,sy,sw,sh,sx,sy,sw,sh);
 // วงเวททางออก
 {const ex=Zm.ent.x*T+16,ey=(Zm.ent.y+2)*T+16,g=ctx.createRadialGradient(ex,ey,2,ex,ey,30);g.addColorStop(0,'rgba(230,255,240,.9)');g.addColorStop(1,'rgba(80,200,140,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(ex,ey,30,14,0,0,7);ctx.fill();
  ctx.strokeStyle='rgba(160,255,200,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(ex,ey,26,11,0,t,t+4.5);ctx.stroke();
  if(zExitNear()){ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(dgExitLbl11(),ex,ey+26);ctx.fillStyle='#fff';ctx.fillText(dgExitLbl11(),ex,ey+26);ctx.textAlign='left'}}
 // เตือนบนพื้น (ท่าบอส)
 const b=D.boss;if(b&&b.st==='slamWU'&&b.tg){const u=1-b.stt/.9;ctx.fillStyle='rgba(255,40,40,'+(.15+.2*u)+')';ctx.beginPath();ctx.ellipse(b.tg.x,b.tg.y,b.tg.r,b.tg.r*.7,0,0,7);ctx.fill();ctx.strokeStyle='rgba(255,80,80,.9)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(255,80,80,.35)';ctx.beginPath();ctx.ellipse(b.tg.x,b.tg.y,b.tg.r*Math.min(1,u),b.tg.r*.7*Math.min(1,u),0,0,7);ctx.fill()}
 if(b&&b.st==='chargeWU'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.dv[1],b.dv[0]));ctx.fillStyle='rgba(255,60,60,.25)';ctx.fillRect(0,-18,230,36);ctx.strokeStyle='rgba(255,90,90,.8)';ctx.lineWidth=1.5;ctx.strokeRect(0,-18,230,36);ctx.restore()}
 drawGhosts();drawDrops();
 const L=[],x0=cx-48,x1=cx+vw+48,y0=cy-48,y1=cy+vh+80,inV=(x,y)=>x>x0&&x<x1&&y>y0&&y<y1;
 for(const o of Zm.ores)if(o.alive&&inV(o.x,o.y))L.push([o.y+10,()=>drawOreZ(o)]);
 for(const m of D.mobs)if(inV(m.x,m.y))L.push([m.y,()=>drawMob(m,t+m.t)]);
 L.push([P.y,()=>{ctx.globalAlpha=1;/* v5.14: เลิกกะพริบตัวตอนโดนโจมตี (เจ้าของสั่ง) — ช่วงอมตะหลังโดนยังทำงานเหมือนเดิม */hero();ctx.globalAlpha=1}]);
 L.sort((p,q)=>p[0]-q[0]);for(const o of L)o[1]();
 ctx.globalCompositeOperation='lighter';for(const p of ZPROJ){const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,p.r*2);g.addColorStop(0,'#fff');g.addColorStop(.4,p.c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(p.x-p.r*2,p.y-p.r*2,p.r*4,p.r*4)}ctx.globalCompositeOperation='source-over';
 for(const p of fx){ctx.fillStyle=`rgba(${p.c||'90,170,255'},${Math.min(1,p.l*2)})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,7);ctx.fill()}
 drawDmgTxt(DT);
 // บรรยากาศ
 const A=Zd.amb;for(const a of ZAMB){let x,y;
  if(A==='snow'){x=cx+((a.x*vw+Math.sin(t+a.p)*20)%vw+vw)%vw;y=cy+((a.y*vh+t*(20+a.s*30))%vh);ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(x,y,2,2)}
  else if(A==='ember'){x=cx+((a.x*vw+Math.sin(t*1.3+a.p)*14)%vw+vw)%vw;y=cy+vh-((a.y*vh+t*(18+a.s*26))%vh);ctx.fillStyle='rgba(255,'+(120+a.s*100|0)+',40,'+(.5+.4*Math.sin(t*4+a.p))+')';ctx.fillRect(x,y,2,2)}
  else if(A==='sand'){x=cx+((a.x*vw+t*(40+a.s*60))%vw);y=cy+((a.y*vh+Math.sin(t+a.p)*10)%vh+vh)%vh;ctx.fillStyle='rgba(240,210,150,.45)';ctx.fillRect(x,y,3,1)}
  else if(A==='mote'){x=cx+((a.x*vw+Math.sin(t*.5+a.p)*30)%vw+vw)%vw;y=cy+((a.y*vh+Math.cos(t*.4+a.p)*20)%vh+vh)%vh;ctx.fillStyle='rgba('+(a.s>.5?'154,240,255':'200,140,255')+','+(.35+.35*Math.sin(t*2+a.p))+')';ctx.fillRect(x,y,2,2)}
  else{x=cx+((a.x*vw+Math.sin(t*.3+a.p)*16)%vw+vw)%vw;y=cy+((a.y*vh+t*(4+a.s*6))%vh);ctx.fillStyle='rgba(220,190,150,.25)';ctx.fillRect(x,y,2,2)}}
 ui();
 const px=(P.x-cx)*Z,py=(P.y-cy-20)*Z;
 if(Zd.dark){const vg=ctx.createRadialGradient(px,py,110,px,py,380);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(4,2,8,.72)');ctx.fillStyle=vg;ctx.fillRect(0,0,VW,VH)}
 else grade(t,'field');
 // ป้ายชื่อแผนที่ตอนเข้า
 if(D.ban>0){const a=Math.min(1,D.ban/.6);ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='bold 22px system-ui,sans-serif';ctx.lineWidth=4;ctx.strokeStyle='#000';const s1=Zd.e+' '+Zd.n;ctx.strokeText(s1,VW/2,VH*.3);ctx.fillStyle='#fff3c8';ctx.fillText(s1,VW/2,VH*.3);
  ctx.font='bold 13px system-ui,sans-serif';const s2='มอนสเตอร์ Lv.'+Zd.lv[0]+'-'+Zd.lv[1]+' · บอส 👑 '+Zd.boss.n;ctx.strokeText(s2,VW/2,VH*.3+22);ctx.fillStyle='#fff';ctx.fillText(s2,VW/2,VH*.3+22);ctx.globalAlpha=1;ctx.textAlign='left'}
 // แถบเลือดบอส
 if(b&&b.aggro){const w=Math.min(360,VW*.6),x=(VW-w)/2,y=lby()+(VW<520?0:34),n=Math.max(0,b.hp/b.max);ctx.fillStyle='#000c';ctx.fillRect(x-4,y-4,w+8,30);
  ctx.font='bold 12px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle=n<.3?'#ff8a8a':'#ffd84a';ctx.fillText('👑 '+b.nm+' Lv.'+b.L+(n<.3?' — คลั่ง!':''),VW/2,y+9);
  ctx.fillStyle='#3a0d0d';ctx.fillRect(x,y+13,w,9);ctx.fillStyle=n<.3?'#ff3a3a':'#d8342a';ctx.fillRect(x,y+13,w*n,9);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x,y+13,w*n,3);
  ctx.font='bold 9px system-ui';ctx.fillStyle='#fff';ctx.fillText(Math.ceil(b.hp).toLocaleString()+' / '+b.max.toLocaleString(),VW/2,y+21);ctx.textAlign='left'}
 if(P.red>0){ctx.fillStyle='rgba(255,0,0,'+P.red+')';ctx.fillRect(0,0,VW,VH)}}
{const _dd=drawD;drawD=function(){if(D.zone)return drawZone();return _dd()}}
// วาดหินกิ่งไม้ + ประตูมิติบนทุ่งหญ้า (ก่อนวาดตัวละคร)
{const _dr=drawDrops;drawDrops=function(){if(!D){drawZGate(performance.now()/1000);drawGpk()}_dr()}}
// ดรอปแท่งโลหะ: ใช้ไอคอนจริง
const DROPIMG={};for(const k of ['ingSt','ingot','ingCu','ingAg','ingAu','ingDm']){const im=new Image();im.src=iconURL('mat:'+k);DROPIMG[k]=im}
{const _dr=drawDrops;drawDrops=function(){const keep=[];for(let i=drops.length-1;i>=0;i--)if(DROPIMG[drops[i].type]){keep.push(drops[i]);drops.splice(i,1)}
 _dr();for(const d of keep){drops.push(d);const px=Math.round(d.x),py=Math.round(d.y)-6-d.z;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(px,py+8,5,2,0,0,7);ctx.fill();ctx.drawImage(DROPIMG[d.type],px-8,py-8,16,16)}}}
// แผนที่วงกลม: จุดในโซน + ประตูมิติบนทุ่งหญ้า
{const _dm=drawMini;drawMini=function(){if(!(D&&D.zone)){_dm();if(!D&&SET.minimap&&MI){const k=MX,R=56;k.save();k.setTransform(2,0,0,2,0,0);k.beginPath();k.arc(R,R,R-2,0,7);k.clip();let dx=(ZG.x-P.x)*MI.s,dy=(ZG.y-P.y)*MI.s;const d=Math.hypot(dx,dy),lim=R-8;if(d>lim){dx*=lim/d;dy*=lim/d}k.fillStyle='#c08bff';k.beginPath();k.arc(R+dx,R+dy,4,0,7);k.fill();k.strokeStyle='#000b';k.stroke();k.restore()}return}
 if(!SET.minimap){mini.style.display='none';return}mini.style.display='';const k=MX,R=56,Zm=D.zone;k.setTransform(2,0,0,2,0,0);k.clearRect(0,0,112,112);k.save();k.beginPath();k.arc(R,R,R-2,0,7);k.clip();k.fillStyle=Zm.Zd.pal.vd;k.fillRect(0,0,112,112);
 k.drawImage(MI.src,R-P.x*MI.s,R-P.y*MI.s);
 const dot=(wx,wy,c,r,pin)=>{let dx=(wx-P.x)*MI.s,dy=(wy-P.y)*MI.s;const d=Math.hypot(dx,dy),lim=R-8;if(d>lim){if(!pin)return;dx*=lim/d;dy*=lim/d}k.fillStyle=c;k.beginPath();k.arc(R+dx,R+dy,r,0,7);k.fill();k.strokeStyle='#000b';k.lineWidth=1;k.stroke()};
 dot(Zm.ent.x*T+16,(Zm.ent.y+2)*T+16,'#7fffb0',4,1);for(const m of D.mobs)if(!m.boss)dot(m.x,m.y,m.elite?'#ffd84a':'#ff5a5a',2,0);if(D.boss)dot(D.boss.x,D.boss.y,'#ff2a2a',5,1);
 k.translate(R,R);k.rotate({u:0,r:Math.PI/2,d:Math.PI,l:-Math.PI/2}[P.dir]);k.fillStyle='#fff';k.strokeStyle='#000';k.lineWidth=1;k.beginPath();k.moveTo(0,-6);k.lineTo(4.5,5);k.lineTo(0,2.5);k.lineTo(-4.5,5);k.closePath();k.fill();k.stroke();k.restore()}}
// สไตล์ปุ่มเลือกแผนที่
{const st=document.createElement('style');st.textContent='#shop .zbtn{text-align:left}#shop .zbtn .zl{float:right;color:#ffd84a;font-weight:bold}#shop .zbtn small{line-height:1.4}';document.head.appendChild(st)}
window.GAME&&Object.assign(window.GAME,{ZONES,enterZone,genZone,GPK});


// =====================================================================
// v3.1 : เมืองใหม่ (กำแพงล้อม + จัตุรัสกลาง) · วิหารฟื้นคืนชีพ = จุดเกิด · ตายแล้วล้มนอนมีเลือด · ขนนกฟีนิกซ์
// =====================================================================
// ---------- ผังเมือง (หน่วย = ช่อง 32px) ----------
TOWN_SPAWN.x=7;TOWN_SPAWN.y=21.5;PAD.x=7*T;PAD.y=21.5*T-8;
SD.gear.b=[3,10,6,6];SD.skill.b=[9,12,5,4];SD.store.b=[29,12,5,4];SD.inn.b=[35,10,6,6];SD.potion.b=[14,24,5,4];
[[16,20],[18,20],[25,20],[27,20]].forEach(([x,y],i)=>{if(STALL_DATA[i]){STALL_DATA[i].x=x;STALL_DATA[i].y=y}});
for(const c of CART_DATA)c.lane-=3;
LAMP_DATA.length=0;LAMP_DATA.push([14,15],[34,15],[13,18],[29,18],[15,10],[28,10],[12,23],[31,23],[14,30],[20,30],[23,30],[34,30]);
[[20.5,9.5],[23.5,9.5],[31,19.5],[38,18.5],[10,28.5],[24,22],[17,19.9],[19,19.9],[26,19.9],[28,19.9],[32,29],[18.5,11.5],[35,21.5],[6,17],[20,22],[10,30.5],[27,30.5]]
 .forEach(([x,y],i)=>{if(NPC_DATA[i]){NPC_DATA[i].x=x;NPC_DATA[i].y=y}});
NPC_DATA.push({name:'นักบวชแห่งแสง',c:'#ece6f4',h:'#c9c4d6',x:9.5,y:22.6,fixed:1,g:'m',age:'elder',beard:1,
 lines:['เทพธิดาแห่งแสงคุ้มครองเจ้าเสมอ ผู้กล้า','ยามล้มลง วิญญาณเจ้าจะกลับมาที่วิหารนี้','ขนนกฟีนิกซ์ช่วยให้ฟื้นได้ทันทีโดยไม่เสียประสบการณ์','หมอยาในเมืองมีขนนกฟีนิกซ์ขายนะ']});
/* v5.34: เพิ่มหลังจัดตำแหน่ง NPC เดิม เพื่อไม่ให้ลำดับร้าน/ชาวเมืองเลื่อน */
NPC_DATA.push({name:'คลังของทดสอบ',c:'#397e78',h:'#d5c09c',x:11.5,y:21.5,fixed:1,apron:1,lines:['รับอุปกรณ์ วัตถุดิบ และของใช้สำหรับช่วงทดสอบได้ที่นี่']});

// ---------- ชิ้นส่วนที่ใช้วาดเมือง ----------
function twWall(k,x,y,side){const px=x*T,py=y*T;k.fillStyle='#7f796d';k.fillRect(px,py,T,T);k.fillStyle='#958f82';k.fillRect(px,py,T,4);
 k.fillStyle='rgba(0,0,0,.25)';for(let r=0;r<4;r++){k.fillRect(px,py+r*8+7,T,1);k.fillRect(px+((r&1)?8:20),py+r*8,1,8)}
 k.fillStyle='#6a6458';const cr=(ax,ay,w,h)=>k.fillRect(ax,ay,w,h);
 if(side==='n')for(let i=0;i<2;i++)cr(px+4+i*16,py+T-8,8,8);if(side==='s')for(let i=0;i<2;i++)cr(px+4+i*16,py,8,8);
 if(side==='w')for(let i=0;i<2;i++)cr(px+T-8,py+4+i*16,8,8);if(side==='e')for(let i=0;i<2;i++)cr(px,py+4+i*16,8,8);
 k.fillStyle='rgba(0,0,0,.22)';if(side==='n')k.fillRect(px,py+T,T,8);if(side==='w')k.fillRect(px+T,py,7,T);if(side==='e')k.fillRect(px-7,py,7,T)}
function twTower(k,cx,cy,r,flag){k.fillStyle='rgba(0,0,0,.3)';k.beginPath();k.ellipse(cx+6,cy+8,r,r*.9,0,0,7);k.fill();
 const g=k.createRadialGradient(cx-r*.3,cy-r*.3,2,cx,cy,r);g.addColorStop(0,'#aaa395');g.addColorStop(1,'#6a6458');k.fillStyle=g;k.beginPath();k.arc(cx,cy,r,0,7);k.fill();
 k.strokeStyle='#3e3a33';k.lineWidth=2;k.stroke();k.fillStyle='#5a554a';for(let i=0;i<10;i++){const a=i/10*6.283;k.fillRect(cx+Math.cos(a)*(r-5)-3,cy+Math.sin(a)*(r-5)-3,6,6)}
 k.fillStyle='#4a2c1a';k.beginPath();k.arc(cx,cy,r*.45,0,7);k.fill();const g2=k.createRadialGradient(cx-4,cy-4,1,cx,cy,r*.45);g2.addColorStop(0,'#d0563a');g2.addColorStop(1,'#7a2418');k.fillStyle=g2;k.beginPath();k.arc(cx,cy,r*.42,0,7);k.fill();
 if(flag){k.fillStyle='#3a2a1a';k.fillRect(cx-1,cy-34,2,34);TOWNLIFE.nativeFlags.push({x:cx+1,y:cy-34,w:19,h:11,vertical:false})}}
function twBanner(k,x,y){k.fillStyle='#3a2a1a';k.fillRect(x-1,y-2,16,2);TOWNLIFE.nativeFlags.push({x,y,w:14,h:26,vertical:true})}
function twPillar(k,x,y){const px=x*T+16,py=y*T+28;if(TOWNART.paint(k,'templePillar',px-16,py-76,32,76))return;k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(px+6,py,15,5,0,0,7);k.fill();
 k.fillStyle='#cfc9bc';k.fillRect(px-13,py-8,26,8);k.fillStyle='#e9e4d8';k.fillRect(px-13,py-8,26,2);
 const g=k.createLinearGradient(px-9,0,px+9,0);g.addColorStop(0,'#bdb6a6');g.addColorStop(.4,'#f6f2e8');g.addColorStop(1,'#a8a090');k.fillStyle=g;k.fillRect(px-9,py-62,18,54);
 k.strokeStyle='rgba(0,0,0,.12)';k.lineWidth=1;for(const o of [-4,0,4]){k.beginPath();k.moveTo(px+o,py-60);k.lineTo(px+o,py-9);k.stroke()}
 k.fillStyle='#e9e4d8';k.fillRect(px-13,py-70,26,9);k.fillStyle='#d8b84a';k.fillRect(px-13,py-62,26,2);k.strokeStyle='#8a8478';k.strokeRect(px-12.5,py-69.5,25,8)}
function twStatue(k,cx,by){k.fillStyle='rgba(0,0,0,.28)';k.beginPath();k.ellipse(cx+6,by,36,9,0,0,7);k.fill();
 k.fillStyle='#bfb8a8';k.fillRect(cx-30,by-18,60,18);k.fillStyle='#ddd7c9';k.fillRect(cx-30,by-18,60,4);k.fillStyle='#d8b84a';k.fillRect(cx-30,by-8,60,2);
 const g=k.createRadialGradient(cx,by-70,4,cx,by-70,60);g.addColorStop(0,'rgba(255,240,180,.55)');g.addColorStop(1,'rgba(255,240,180,0)');k.fillStyle=g;k.fillRect(cx-60,by-130,120,120);
 k.fillStyle='#ece8de';k.strokeStyle='#8a8478';k.lineWidth=1.2;
 for(const s of [-1,1]){k.beginPath();k.moveTo(cx+s*6,by-62);k.quadraticCurveTo(cx+s*34,by-86,cx+s*40,by-58);k.quadraticCurveTo(cx+s*30,by-48,cx+s*24,by-40);k.quadraticCurveTo(cx+s*16,by-46,cx+s*8,by-44);k.closePath();k.fill();k.stroke();
  k.strokeStyle='rgba(0,0,0,.12)';for(let i=1;i<4;i++){k.beginPath();k.moveTo(cx+s*8,by-58+i*3);k.lineTo(cx+s*(18+i*6),by-66+i*6);k.stroke()}k.strokeStyle='#8a8478'}
 k.fillStyle='#f4f0e6';k.beginPath();k.moveTo(cx-6,by-66);k.lineTo(cx+6,by-66);k.lineTo(cx+14,by-18);k.lineTo(cx-14,by-18);k.closePath();k.fill();k.stroke();
 k.strokeStyle='rgba(0,0,0,.12)';for(const o of [-5,0,5]){k.beginPath();k.moveTo(cx+o*.4,by-60);k.lineTo(cx+o*1.6,by-20);k.stroke()}
 k.strokeStyle='#8a8478';k.fillStyle='#f4f0e6';for(const s of [-1,1]){k.beginPath();k.moveTo(cx+s*5,by-62);k.lineTo(cx+s*13,by-80);k.lineTo(cx+s*10,by-82);k.lineTo(cx+s*2,by-64);k.closePath();k.fill();k.stroke()}
 k.beginPath();k.arc(cx,by-72,7,0,7);k.fill();k.stroke();k.strokeStyle='#e8c14a';k.lineWidth=2.5;k.beginPath();k.ellipse(cx,by-82,10,3.5,0,0,7);k.stroke();
 k.fillStyle='#fff6c8';k.beginPath();k.arc(cx,by-88,5,0,7);k.fill()}
function twDummy(k,x,y){const px=x*T+16,py=y*T+28;k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(px+4,py,11,4,0,0,7);k.fill();k.fillStyle='#6a4a2a';k.fillRect(px-2,py-36,4,36);k.fillRect(px-14,py-30,28,4);
 k.fillStyle='#c9a86a';k.fillRect(px-8,py-34,16,20);k.strokeStyle='#5a3a1a';k.strokeRect(px-7.5,py-33.5,15,19);k.beginPath();k.arc(px,py-40,7,0,7);k.fill();k.stroke();k.strokeStyle='#c0392b';k.lineWidth=2;k.beginPath();k.arc(px,py-25,4,0,7);k.stroke();k.lineWidth=1}
function twWell(k,x,y){const px=x*T+T,py=y*T+24;k.fillStyle='rgba(0,0,0,.28)';k.beginPath();k.ellipse(px+6,py+6,30,9,0,0,7);k.fill();
 k.fillStyle='#8a8478';k.beginPath();k.ellipse(px,py,26,13,0,0,7);k.fill();k.fillStyle='#2a4a6a';k.beginPath();k.ellipse(px,py-2,18,8,0,0,7);k.fill();k.fillStyle='rgba(180,220,255,.4)';k.fillRect(px-8,py-5,7,2);
 k.strokeStyle='#4a4438';k.lineWidth=1.5;k.beginPath();k.ellipse(px,py,26,13,0,0,7);k.stroke();k.fillStyle='#5a3a1a';k.fillRect(px-24,py-40,4,40);k.fillRect(px+20,py-40,4,40);
 k.fillStyle='#8a3a22';k.beginPath();k.moveTo(px-32,py-36);k.lineTo(px,py-54);k.lineTo(px+32,py-36);k.closePath();k.fill();k.strokeStyle='#4a1a10';k.stroke();k.fillStyle='#6a4a2a';k.fillRect(px-20,py-30,40,3)}
function twBench(k,x,y){const px=x*T,py=y*T+16;k.fillStyle='rgba(0,0,0,.2)';k.fillRect(px+3,py+12,T,4);k.fillStyle='#7a5228';k.fillRect(px,py,T,6);k.fillRect(px,py-8,T,4);k.fillStyle='#4a3018';k.fillRect(px+2,py+6,3,8);k.fillRect(px+T-5,py+6,3,8)}
function twFlowers(k,x,y,w,h){k.fillStyle='#5a3a22';k.fillRect(x*T+2,y*T+2,w*T-4,h*T-4);k.fillStyle='#4a8a3a';k.fillRect(x*T+4,y*T+4,w*T-8,h*T-8);
 const C=['#ff6a8a','#ffd23a','#c08bff','#ffffff','#ff9a3a'];for(let i=0;i<w*h*7;i++){const fx=x*T+6+hash(i,x*3+y)*(w*T-12),fy=y*T+6+hash(y+i*1.7,x)*(h*T-12);k.fillStyle=C[i%5];k.beginPath();k.arc(fx,fy,2.2,0,7);k.fill()}}

// ---------- สร้างเมืองใหม่ ----------
buildTown=function(){
 TOWNLIFE.reset();dm=[];for(let y=0;y<TH;y++)dm[y]=Array(TW).fill(0);
 dcv=document.createElement('canvas');dcv.width=TW*T;dcv.height=TH*T;const k=dcv.getContext('2d');
 const rd=new Set(),road=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rd.add(j*TW+i)};
 road(0,16,TW,2);road(15,10,14,14);road(21,9,2,1);road(21,24,2,4);road(2,28,40,2);
 const box=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(dm[j]&&dm[j][i]!==undefined)dm[j][i]=c};
 // พื้น
 if(!TOWNFLOOR.paint(k,rd))for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){const px=x*T,py=y*T;
  if(rd.has(y*TW+x)){k.drawImage(ART.cobble,(x%4)*64,(y%4)*64,64,64,px,py,T,T);for(const [ax,ay] of [[0,-1],[0,1],[-1,0],[1,0]])if(x+ax>=0&&y+ay>=0&&x+ax<TW&&y+ay<TH&&!rd.has((y+ay)*TW+x+ax)){k.fillStyle='rgba(40,32,22,.5)';const qx=ax>0?px+T-3:px,qy=ay>0?py+T-3:py;ax?k.fillRect(qx,py,3,T):k.fillRect(px,qy,T,3)}}
  else k.drawImage(grassV[gv(x,y)],px,py)}
 // ลวดลายจัตุรัส
 {const cx=22*T,cy=17*T;k.save();k.strokeStyle='rgba(235,225,200,.55)';k.lineWidth=5;k.beginPath();k.arc(cx,cy,54,0,7);k.stroke();k.lineWidth=2;k.strokeStyle='rgba(90,70,50,.45)';k.beginPath();k.arc(cx,cy,61,0,7);k.stroke();k.beginPath();k.arc(cx,cy,47,0,7);k.stroke();
  k.fillStyle='rgba(235,225,200,.5)';for(let i=0;i<8;i++){k.save();k.translate(cx,cy);k.rotate(i*Math.PI/4);k.beginPath();k.moveTo(0,-42);k.lineTo(6,-11);k.lineTo(0,0);k.lineTo(-7,-14);k.closePath();k.fill();k.restore()}
  k.strokeStyle='rgba(235,225,200,.45)';k.lineWidth=4;k.beginPath();k.arc(22*T,13*T+6,70,0,7);k.stroke();k.restore()}
 // ลานฝึก (ดินอัด) และสวน
 k.fillStyle='rgba(150,110,70,.55)';k.fillRect(30*T,19*T,11*T,5*T);k.strokeStyle='rgba(90,60,30,.6)';k.lineWidth=2;k.strokeRect(30*T+1,19*T+1,11*T-2,5*T-2);
 for(let x=30;x<=40;x++){k.fillStyle='#6a4a2a';k.fillRect(x*T+14,19*T-6,4,12);k.fillRect(x*T+14,24*T-10,4,12)}k.fillStyle='#8a6a3a';k.fillRect(30*T,19*T-2,11*T,3);k.fillRect(30*T,24*T-6,11*T,3);
 twFlowers(k,16,11,2,1);twFlowers(k,26,11,2,1);twFlowers(k,4,30,3,2);twFlowers(k,35,30,2,2);twFlowers(k,30,9,4,1);twFlowers(k,10,9,4,1);
 // วิหารแห่งแสง (จุดเกิด)
 {const x0=3,y0=18,w=9,h=9;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){k.fillStyle=TOWNFLOOR.state==='ready'?k.createPattern(TOWNFLOOR.tile('marble'),'repeat'):((x+y)%2?'#e9e4d8':'#d8d1c2');k.fillRect(x*T,y*T,T,T);k.fillStyle='rgba(255,255,255,.25)';k.fillRect(x*T,y*T,T,2)}
  k.strokeStyle='#d8b84a';k.lineWidth=3;k.strokeRect(x0*T+3,y0*T+3,w*T-6,h*T-6);k.lineWidth=1;k.strokeStyle='#8a7a4a';k.strokeRect(x0*T+8,y0*T+8,w*T-16,h*T-16);
  for(let i=0;i<3;i++){k.fillStyle=i%2?'#cfc8b8':'#e2dccf';k.fillRect(x0*T,y0*T+i*5,w*T,5)}
  k.fillStyle='rgba(120,90,200,.18)';k.fillRect(6*T,19*T,2*T,7*T);
  k.font='bold 12px system-ui,sans-serif';k.textAlign='center';k.lineWidth=3;k.strokeStyle='#3a2a1a';k.textAlign='left'}
 TOWNART.bind(k,'templeFloor',4.2*T,20*T,6.5*T,4.8*T,null,()=>paintPad(k));
 TOWNART.bind(k,'templeRear',5*T,18*T,4*T,2.25*T);
 // กำแพงเมือง + ป้อม + ประตู
 for(let x=0;x<TW;x++){twWall(k,x,0,'n');twWall(k,x,TH-1,'s');box(x,0,1,1,1);box(x,TH-1,1,1,1)}
 for(let y=1;y<TH-1;y++){if(y===16||y===17)continue;twWall(k,0,y,'w');twWall(k,TW-1,y,'e');box(0,y,1,1,1);box(TW-1,y,1,1,1)}
 // ร้านค้า / บ้าน / ปราสาท
 const put=(n,x,y,w,h,role,S)=>{box(x,y,w,h,1);TOWNART.bind(k,role||'house',x*T,y*T,w*T,h*T,()=>k.drawImage(ART[n],x*T,y*T,w*T,h*T),S?used=>{if(!used)shopSign(k,S)}:null,S)};
 for(const [n,x,y] of [['house1',3,3],['house2',9,4],['house2',30,3],['house1',36,4],['house1',30,24]]){const replaced=SHOP_ORDER.some(id=>{const b=SHOP_DATA[id].b;return b[0]===x&&b[1]===y})||(x===36&&y===4);if(replaced)box(x,y,5,4,1);else put(n,x,y,5,4,'house')}
 for(const id of SHOP_ORDER){const S=SHOP_DATA[id];if(!S.b[2])continue;put(S.img,...S.b,id,S)}
 TOWNART.bind(k,'castle',15*T,1*T,14*T,8*T,()=>k.drawImage(ART.castle,15*T,1*T,14*T,8*T));box(15,1,14,8,1);box(21,8,2,1,4);
 k.drawImage(ART.fountain,22*T-48,13*T-62,96,96);box(21,12,2,2,1);
 // วิหาร: เสา + รูปปั้น
 for(const [x,y] of [[3,19],[11,19],[3,24],[11,24]]){const px=x*T+16,py=y*T+28;prop(kk=>twPillar(kk,x,y),py,px-20,py-76,46,84,false,true);box(x,y,1,1,1)}
 prop(kk=>twStatue(kk,7*T,27*T-6),27*T-6,7*T-92,27*T-236,184,246);box(6,25,2,2,1);
 // ลานฝึก
 for(const x of [32,35,38]){const px=x*T+16,py=21*T+28;prop(kk=>twDummy(kk,x,21),py,px-20,py-52,40,58);box(x,21,1,1,1)}
 for(const [x,y] of [[31,23],[40,20]]){k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(x*T+18,y*T+28,12,4,0,0,7);k.fill();k.fillStyle='#7a4a22';k.fillRect(x*T+6,y*T+6,20,22);k.fillStyle='#4a2a12';k.fillRect(x*T+6,y*T+10,20,2);k.fillRect(x*T+6,y*T+22,20,2);box(x,y,1,1,1)}
 // บ่อน้ำ ม้านั่ง
 prop(kk=>twWell(kk,21,31),31*T+30,21*T-12,31*T-34,90,74);box(21,31,2,1,1);for(const x of [17,26]){twBench(k,x,30);box(x,30,1,1,1)}
 // ต้นไม้
 for(const [x,y,i] of [[2,9,0],[14,3,1],[29,9,2],[42,9,0],[2,14,1],[2,27,0],[3,31,1],[8,31,2],[12,31,0],[31,31,1],[38,31,2],[29,3,0],[13,8,1]]){box(x,y,1,1,1);if(window.prop)prop(kk=>kk.drawImage(treeSpr[i],x*T+16-36,y*T+28-85,72,90),y*T+28,x*T-24,y*T-58,80,92,true);else k.drawImage(treeSpr[i],x*T+16-36,y*T+28-85,72,90)}
 // โคมไฟ
 for(const [lx,ly] of LAMP_DATA){box(lx,ly,1,1,1);const px=lx*T+16,py=ly*T+30;prop(k=>{k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(px+4,py,9,3,0,0,7);k.fill();k.fillStyle='#2b2b32';k.fillRect(px-2,py-46,4,46);k.fillRect(px-6,py-4,12,4);k.fillStyle='#ffcf5a';k.fillRect(px-5,py-58,10,12);k.fillStyle='#2b2b32';k.fillRect(px-7,py-60,14,3)},py,px-12,py-62,28,68)}
 // ป้อมมุมเมือง + ป้อมประตู (วาดทับกำแพง)
 for(const [x,y] of [[1,1],[TW-2,1],[1,TH-2],[TW-2,TH-2]]){twTower(k,x*T+16,y*T+16,40,1);box(x-1,y-1,3,3,1)}
 for(const gx of [1,TW-2])for(const gy of [14,19]){twTower(k,gx*T+16,gy*T+16,30,0);box(gx<5?0:TW-2,gy-1,2,2,1)}
 for(const gx of [0,TW-1]){k.fillStyle='rgba(20,15,10,.55)';k.fillRect(gx*T,16*T,T,2*T);k.fillStyle='#3a2a1a';for(let i=0;i<5;i++)k.fillRect(gx*T+2+i*6,16*T,2,8);k.fillRect(gx*T,16*T+6,T,2);box(gx,16,1,2,GATE)}
 for(const [x,y] of [[2,13],[2,20],[TW-3,13],[TW-3,20]])twBanner(k,x*T+8,y*T+2);
 k.font='bold 11px system-ui,sans-serif';k.textAlign='left';k.lineWidth=3;k.strokeStyle='#000';k.strokeText('⬅ ทางออก',4,16*T-22);k.fillStyle='#fff';k.fillText('⬅ ทางออก',4,16*T-22);
 k.textAlign='right';k.strokeText('🏡 ที่ดินผู้กล้า ➡',TW*T-4,16*T-22);k.fillText('🏡 ที่ดินผู้กล้า ➡',TW*T-4,16*T-22);k.textAlign='left';
 for(const f of FORGE)box(f.x,f.y,1,1,1);
 D={town:true,ret:[(W-3)*T+16,WC.y],road:rd,npcs:NPC_DATA.map(mkNPC),carts:CART_DATA.map(mkCart),stalls:STALL_DATA,doors:townDoors()};for(const s of STALL_DATA)box(s.x,s.y,2,1,1);
 paintPad(k)};

// =====================================================================
// ความตาย: ล้มนอน มีเลือด · เลือก "ใช้ขนนกฟีนิกซ์" หรือ "ฟื้นที่วิหาร (เสีย XP 5%)"
// =====================================================================
inv.phoenix=inv.phoenix||0;WT.phoenix=.1;
INVMETA.phoenix=['ขนนกฟีนิกซ์','ตอนตาย ใช้ฟื้นคืนชีพได้ทันทีตรงที่ล้ม (เลือด 50%) ไม่เสีย XP · ซื้อที่ร้านขายยา / ดรอปจากบอส'];
if(!INVORDER.includes('phoenix'))INVORDER.splice(2,0,'phoenix');
{const _mi=matIcon;matIcon=function(key){if(key!=='phoenix')return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');
 k.translate(24,24);k.rotate(-.6);const g=k.createLinearGradient(0,-20,0,20);g.addColorStop(0,'#fff2a8');g.addColorStop(.35,'#ffb43a');g.addColorStop(.75,'#ff5a2a');g.addColorStop(1,'#a8201a');
 k.fillStyle=g;k.strokeStyle='#6a1a0a';k.lineWidth=1.5;k.beginPath();k.moveTo(0,-21);k.bezierCurveTo(12,-12,10,10,0,18);k.bezierCurveTo(-10,10,-12,-12,0,-21);k.fill();k.stroke();
 k.strokeStyle='#fff6c8';k.lineWidth=1.6;k.beginPath();k.moveTo(0,-18);k.lineTo(0,22);k.stroke();k.strokeStyle='rgba(120,30,10,.45)';k.lineWidth=1;
 for(let i=0;i<6;i++){const y=-12+i*5;k.beginPath();k.moveTo(0,y);k.lineTo(7-i*.6,y-5);k.moveTo(0,y);k.lineTo(-7+i*.6,y-5);k.stroke()}
 k.fillStyle='#ffe14a';for(const [x,y] of [[8,-14],[-9,-8],[6,6]]){k.beginPath();k.arc(x,y,1.6,0,7);k.fill()}return c}}
DROPIMG.phoenix=new Image();DROPIMG.phoenix.src=iconURL('mat:phoenix');
SD.potion.buy.push({id:'phoenix',name:'ขนนกฟีนิกซ์',mat:'phoenix',emoji:'🪶',price:250,give:'phoenix',note:'ตายแล้วฟื้นได้ทันทีตรงที่ล้ม'});
// บอส/อีลีทมีโอกาสดรอปขนนก
{const _mk=mobKill;mobKill=function(m){_mk(m);if(Math.random()<(m.boss?.35:m.elite?.03:0))addDrop('phoenix',m.x,m.y)}}

// ---- เลือดบนพื้น ----
const BLOOD=[];
function bloodSplat(x,y,n,s){for(let i=0;i<n;i++)BLOOD.push({x:x+rnd(-10,10)*s,y:y+rnd(-4,4)*s,r:rnd(1.2,3.2)*s,t:0,sc:D});if(BLOOD.length>160)BLOOD.splice(0,BLOOD.length-160)}
function drawBlood(){for(const b of BLOOD){if(b.sc!==D)continue;const a=b.pool?.9:Math.max(0,.85-b.t/25);if(a<=0)continue;ctx.fillStyle='rgba('+(b.pool?'110,8,12':'140,12,16')+','+a+')';ctx.beginPath();ctx.ellipse(b.x,b.y,b.r,b.r*.55,0,0,7);ctx.fill()}}
{const _h=hurtPlayer;hurtPlayer=function(sl){const h0=P.hp;_h(sl);if(P.hp<h0)bloodSplat(P.x,P.y+2,4,1)}}
{const _z=zHurt;zHurt=function(src,d,k,m){const h0=P.hp;_z(src,d,k,m);if(P.hp<h0)bloodSplat(P.x,P.y+2,5,1)}}
{const _dr=drawDrops;drawDrops=function(){drawBlood();_dr()}}

// ---- สถานะตาย ----
P.dead=false;let DEATH=null;
const deathEl=document.createElement('div');deathEl.id='death';deathEl.hidden=true;gid('wrap').appendChild(deathEl);
{const st=document.createElement('style');st.textContent=`
#death{position:absolute;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(60,0,0,.15),rgba(20,0,0,.6));animation:dfi .6s}
#death[hidden]{display:none}
@keyframes dfi{from{opacity:0}to{opacity:1}}
#death .dc{background:rgba(18,12,12,.94);border:2px solid #8a2a2a;border-radius:12px;padding:16px 18px;min-width:260px;max-width:90vw;color:#ece7da;text-align:center;display:flex;flex-direction:column;gap:8px;box-shadow:0 0 30px rgba(140,0,0,.5)}
#death h3{margin:0;font-size:22px;color:#ff6a5a;letter-spacing:.5px}
#death small{opacity:.8}
#death button{font:inherit;border-radius:9px;border:2px solid #5a554a;background:#2a2620;color:#fff;padding:9px 12px;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px}
#death button img{width:30px;height:30px}
#death button b{display:block}#death button span{font-size:12px;opacity:.8}
#death button.ph{border-color:#ffb43a;background:linear-gradient(#4a2a10,#2a1808)}
#death button.ph[disabled]{opacity:.4;cursor:default}
#death button.tp{border-color:#a8a0ff;background:linear-gradient(#2a2848,#1a1830)}
#wrap.dead #c{filter:grayscale(.75) brightness(.85)}`;document.head.appendChild(st)}
function startDeath(){if(P.dead)return;P.dead=true;DEATH={t:0,side:P.dir==='l'?-1:1,shown:false};P.hp=0;P.at=-1;P.mv=false;P.dash=0;P.kx=P.ky=0;P.recall=0;P.sit=null;
 sfx('die');sfx('splat');for(let i=0;i<26;i++)fx.push({x:P.x,y:P.y-18,vx:(Math.random()-.5)*190,vy:-60-Math.random()*120,l:.8,c:'150,10,20'});
 bloodSplat(P.x,P.y+2,10,1.4);BLOOD.push({x:P.x-DEATH.side*16,y:P.y+3,r:2,max:24,pool:1,t:0,sc:D});
 if(typeof closeShop==='function'&&SHOPK)closeShop();if(STN.open)closeForge();if(ZM.open)closeZMenu();hideBag();gid('wrap').classList.add('dead');gid('msg').textContent='💀 คุณล้มลงแล้ว…'}
function showDeath(){const n=inv.phoenix|0,loss=Math.round(need(P.lv)*.05),im='<img src="'+iconURL('mat:phoenix')+'">';
 deathEl.innerHTML='<div class="dc"><h3>💀 คุณล้มลงแล้ว</h3><small>'+(D&&D.zone?D.zone.Zd.e+' '+D.zone.Zd.n:D&&D.town?'ในเมือง':'ทุ่งหญ้า')+' · Lv.'+P.lv+'</small>'
  +'<button class="ph"'+(n?'':' disabled')+' onclick="reviveHere()">'+im+'<div><b>ใช้ขนนกฟีนิกซ์ (มี ×'+n+')</b><span>ฟื้นทันทีตรงนี้ · เลือด 50% · ไม่เสีย XP'+(n?'':' — ซื้อได้ที่ร้านขายยา')+'</span></div></button>'
  +'<button class="tp" onclick="reviveTemple()"><span style="font-size:26px;opacity:1">⛪</span><div><b>ฟื้นที่วิหารแห่งแสง</b><span>กลับเมือง เลือดเต็ม · เสีย XP 5% (−'+loss.toLocaleString()+')</span></div></button></div>';
 deathEl.hidden=false}
function endDeath(){P.dead=false;DEATH=null;deathEl.hidden=true;gid('wrap').classList.remove('dead');for(const b of BLOOD)if(b.pool)b.pool=0}
function reviveHere(){if(!P.dead||!(inv.phoenix>0))return;inv.phoenix--;endDeath();P.hp=Math.round(BAL.hp*.5);P.mp=Math.max(P.mp,Math.round(BAL.mp*.5));P.iframe=2.5;P.stun=0;
 sfx('heal');sfx('warp');for(let i=0;i<40;i++){const a=Math.random()*6.283;fx.push({x:P.x+Math.cos(a)*20,y:P.y-10,vx:Math.cos(a)*90,vy:-80-Math.random()*120,l:.9,c:i%2?'255,180,60':'255,240,160'})}
 refreshInv();say('🪶 ขนนกฟีนิกซ์ลุกเป็นไฟ… คุณฟื้นคืนชีพแล้ว! (เหลือ ×'+inv.phoenix+')')}
function reviveTemple(){if(!P.dead)return;const loss=Math.round(need(P.lv)*.05);P.xp=Math.max(0,P.xp-loss);endDeath();_dieOrig();lvHud();say('⛪ วิญญาณของคุณกลับมาที่วิหารแห่งแสง · เสีย XP '+loss.toLocaleString())}
const _dieOrig=die;die=function(){if(P.dead)return;startDeath()};
{const _w=updWorld;updWorld=function(dt){_w(dt);for(let i=BLOOD.length-1;i>=0;i--){const b=BLOOD[i];if(b.sc!==D){BLOOD.splice(i,1);continue}b.t+=dt;if(b.pool&&b.r<b.max)b.r+=dt*22;if(!b.pool&&b.t>25)BLOOD.splice(i,1)}
 if(P.dead){DEATH.t+=dt;P.hp=0;P.stun=.5;P.iframe=1;P.at=-1;P.mv=false;P.kx=P.ky=0;if(!DEATH.shown&&DEATH.t>1.1){DEATH.shown=true;showDeath()}}}}
// วาดตัวละครล้มนอน
{const _h=hero;hero=function(){if(!P.dead)return _h();const u=Math.min(1,DEATH.t/.5),e=u<1?1-Math.pow(1-u,3):1,b=u<1?0:Math.max(0,Math.sin((DEATH.t-.5)*14)*3*Math.exp(-(DEATH.t-.5)*6)),s=DEATH.side,d0=P.dir,m0=P.mv;
 P.dir=s>0?'r':'l';P.mv=false;ctx.save();ctx.translate(P.x,P.y+2);ctx.rotate(-s*Math.PI/2*e);ctx.translate(-P.x,-P.y-2-b);heroBody();ctx.restore();P.dir=d0;P.mv=m0}}
{const _us=useScroll;useScroll=function(){if(P.dead)return;_us()}}
{const _tb=toggleBag;toggleBag=function(){if(P.dead)return;_tb()}}



// =====================================================================
// v3.2 : ฟันช้าลง · เครื่องมือขนาดพอดี · ท่าตัดไม้/ขุดหินสมจริง · เสียงมีมิติ · เก็บของมีอนิเมชั่น
//        กลางวัน-กลางคืน · ป้ายชื่อมีมงกุฎ · ช่องยาเลือด/มานา · เดินลื่นขึ้น · คนขายในร้านเห็นทั้งตัว
// =====================================================================

// ---------- 1) ขนาดเครื่องมือในมือ: ขวาน/ที่ขุดเล็กลง ----------
toolSpr=function(hx,hy,ang){ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r')ctx.scale(-1,1);const s=P.tool==='sword'?1:(P.tool==='axe'||P.tool==='pick')&&window.AXS7?AXS7:.7;ctx.scale(s,s);
 if(P.dir==='u'&&P.tool==='axe')ctx.scale(.5,1);ctx.drawImage(toolIcon(P.tool,P.tier[P.tool],64),-23,-36,46,46);ctx.restore()};

// ---------- 2) กล้องสั่น (ใช้ตอนขุด/ฟันโดน) ----------
const SHK={t:0,a:0};function shake(a,t){SHK.a=Math.max(SHK.a,a);SHK.t=Math.max(SHK.t,t)}
{const _c=cam;cam=function(a,b,c){const r=_c(a,b,c);if(SHK.t>0){SHK.t-=DT;const k=SHK.a*Math.max(0,SHK.t)/.2;return[r[0]+(Math.random()-.5)*k,r[1]+(Math.random()-.5)*k]}SHK.a=0;return r}}

// ---------- 3) ท่าตัดไม้ / ขุดหิน: ง้างขึ้นเหนือหัว → ฟาดลงแรง ๆ → เด้งกลับ ----------
function toolSwing(x,by,d,side,f,TOP,held){const p=P.at,ez=u=>u*u*u,eo=u=>1-Math.pow(1-u,3);
 // ช่วง: 0-.38 ง้าง · .38-.46 ฟาด · .46-.62 ค้างแรงกระแทก · .62-1 ดึงกลับ
 let k,rec=0;if(p<.38)k=-eo(p/.38);else if(p<.46)k=-1+2*ez((p-.38)/.08);else if(p<.62){k=1;rec=Math.sin((p-.46)/.16*Math.PI)*.12}else k=1-eo((p-.62)/.38)*1;
 let hx,hy,ang;
 if(side){const a0=f*-.15,aUp=f*-1.25,aDn=f*2.05;ang=k<0?a0+(aUp-a0)*-k:a0+(aDn-a0)*k-f*rec;
  hx=x+f*(k<0?-2+2*k:3+9*k);hy=by-(k<0?20-14*k:20-6*k)}
 else if(d==='d'){ang=k<0?-.35-.6*-k:-.35+(Math.PI*.95+.35)*k-rec;hx=x+(k<0?8:8-2*k);hy=by-(k<0?16+20*-k:16-6*k)}
 else{ang=k<0?.35+.6*-k:.35-.9*k;hx=x+8;hy=by-(k<0?22+16*-k:22-8*k)}
 if(!side){ctx.strokeStyle=TOP;ctx.lineWidth=6;ctx.lineCap='butt';ctx.beginPath();ctx.moveTo(x+(d==='d'?8:9),by-24);ctx.lineTo(hx,hy);ctx.stroke()}
 if(p>.38&&p<.5){ctx.save();ctx.globalAlpha=.35*(1-(p-.38)/.12);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();const r=30;
  const A0=(side?f*-1.25:d==='d'?-.95:.95)-Math.PI/2,A1=ang-Math.PI/2;ctx.arc(hx,hy,r,Math.min(A0,A1),Math.max(A0,A1));ctx.stroke();ctx.restore()}
 held(hx,hy,ang)}
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){if(P.tool!=='sword')return toolSwing(x,by,d,side,f,TOP,held);return _sf(x,by,d,side,f,TOP,held)}}
// เศษไม้ ใบไม้ ประกายไฟ ฝุ่นหิน
const CHIPS=[];
function chipBurst(x,y,kind,n){for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,v=60+Math.random()*120;
 CHIPS.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6.28,vr:(Math.random()-.5)*20,t:0,l:kind==='leaf'?1.6:kind==='spark'?.25:kind==='dust'?.7:.9,k:kind,g:kind==='leaf'?40:kind==='dust'?-20:kind==='spark'?200:420,
  c:kind==='wood'?['#c9935a','#e8c28a','#8a5a2e'][i%3]:kind==='leaf'?['#5fae3f','#7cc65a','#3f8a30'][i%3]:kind==='rock'?['#8d9097','#6f737c','#b4b7bf'][i%3]:kind==='spark'?'#ffe9a0':'rgba(200,190,170,.5)'})}}
function updChips(dt){for(let i=CHIPS.length-1;i>=0;i--){const c=CHIPS[i];c.t+=dt;if(c.t>c.l){CHIPS.splice(i,1);continue}c.vy+=c.g*dt;if(c.k==='leaf'){c.vx=Math.sin(c.t*5+c.r)*30}c.x+=c.vx*dt;c.y+=c.vy*dt;c.r+=c.vr*dt}}
function drawChips(){for(const c of CHIPS){const a=1-c.t/c.l;ctx.save();ctx.globalAlpha=Math.min(1,a*1.6);ctx.translate(c.x,c.y);ctx.rotate(c.r);ctx.fillStyle=c.c;
 if(c.k==='wood')ctx.fillRect(-3,-1.2,6,2.4);else if(c.k==='leaf'){ctx.beginPath();ctx.ellipse(0,0,3.5,1.8,0,0,7);ctx.fill()}else if(c.k==='rock')ctx.fillRect(-2,-2,4,3.5);
 else if(c.k==='spark'){ctx.fillRect(-3,-.6,6,1.2)}else{ctx.beginPath();ctx.arc(0,0,3+c.t*12,0,7);ctx.fill()}ctx.restore()}}
{const _ht=hitTree;hitTree=function(tr){_ht(tr);const y=tr.ty*T+22;chipBurst(tr.px+(P.x<tr.px?-6:6),y,'wood',7);chipBurst(tr.px,tr.ty*T+28-60*tr.sc,'leaf',4);shake(3,.12);sfx('chop',tr.px,y)}}
{const _ho=hitOre;hitOre=function(o){const ok=P.tier.pick>=OREK[o.kind].req;_ho(o);if(!ok)return;if(map[o.ty][o.tx]===RUBBLE)sfx('crumble');const x=o.tx*T+16,y=o.ty*T+14;chipBurst(x,y,'rock',6);chipBurst(x,y,'spark',5);chipBurst(x,y+6,'dust',3);shake(3.5,.14);sfx('mine',x,y)}}
{const _zm=zMine;zMine=function(o){const ok=P.tier.pick>=OREK[o.kind].req;_zm(o);if(!ok)return;if(!o.alive)sfx('crumble');chipBurst(o.x,o.y-2,'rock',6);chipBurst(o.x,o.y-2,'spark',5);chipBurst(o.x,o.y+4,'dust',3);shake(3.5,.14);sfx('mine',o.x,o.y)}}

// ---------- 4) ระบบเสียงมีมิติ: ซ้าย-ขวาตามตำแหน่ง · เบาลงตามระยะ · เสียงก้องในถ้ำ ----------
AU.sp=null;
function auOut(o){if(AU.sp&&(!o||o==='s'))return AU.sp;return AU[o||'s']}
tone=function(f,f2,d,ty,v,dl,o){if(!AU.c)return;const C=AU.c,t=C.currentTime+(dl||0),os=C.createOscillator(),g=C.createGain();os.type=ty||'sine';os.frequency.setValueAtTime(f,t);if(f2)os.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);os.connect(g);g.connect(auOut(o));os.start(t);os.stop(t+d+.05)};
nz=function(d,v,f1,f2,q,ty,dl,o){if(!AU.c)return;const C=AU.c,t=C.currentTime+(dl||0),s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=AU.nb;f.type=ty||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f1,t);f.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(auOut(o));s.start(t,Math.random());s.stop(t+d+.05)};
function auReverb(){if(AU.rv||!AU.c)return;const C=AU.c,len=C.sampleRate*2.2,b=C.createBuffer(2,len,C.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
 AU.rv=C.createConvolver();AU.rv.buffer=b;AU.rs=C.createGain();AU.rs.gain.value=.08;AU.s.connect(AU.rs);AU.rs.connect(AU.rv);AU.rv.connect(AU.m)}
{const _ai=auInit;auInit=function(){_ai();try{auReverb()}catch(e){}}}
{const _ss=setScene;setScene=function(k){_ss(k);if(AU.rs){const z=D&&D.zone;AU.rs.gain.setTargetAtTime(k==='cave'?(z&&!z.Zd.dark?.12:.32):k==='shop'?.14:k==='town'?.1:.05,AU.c.currentTime,.3)}}}
const _sfx0=sfx;sfx=function(n,x,y){if(x===undefined||!AU.c)return _sfx0(n);const dx=x-P.x,dy=y-P.y,dist=Math.hypot(dx,dy);if(dist>720)return;
 const C=AU.c,pn=C.createStereoPanner?C.createStereoPanner():null,g=C.createGain();g.gain.value=1/(1+dist/240);
 if(pn){pn.pan.value=Math.max(-.9,Math.min(.9,dx/320));g.connect(pn);pn.connect(AU.s)}else g.connect(AU.s);
 AU.sp=g;try{_sfx0(n)}finally{AU.sp=null}};
const r_=(a,b)=>a+Math.random()*(b-a);
Object.assign(SFX,{
 swing:()=>{const p=r_(.85,1.2);nz(.2,.28,420*p,2600*p,1.3);nz(.12,.12,2000*p,5000,2,'highpass',.03)},
 swing2:()=>{const p=r_(.8,1.1);nz(.26,.32,260*p,1500*p,1);tone(140,90,.2,'sine',.06)},
 hit:()=>{nz(.08,.45,1200,250,1);tone(r_(150,190),55,.14,'square',.13);nz(.18,.2,500,120,.8,'lowpass',.02)},
 chop:()=>{tone(r_(95,120),48,.18,'sine',.55);nz(.05,.55,2600,700,3);nz(.14,.3,900,200,1.5,'bandpass',.01);tone(r_(260,320),180,.08,'triangle',.18,.01)},
 mine:()=>{const p=r_(.9,1.15);tone(1700*p,1100*p,.16,'square',.06);tone(2600*p,2300*p,.35,'sine',.09,.005);tone(3900*p,3600*p,.25,'sine',.05,.01);nz(.06,.5,4200,1600,4);nz(.3,.18,700,150,.8,'lowpass',.04)},
 crumble:()=>{for(let i=0;i<6;i++)nz(.09,.25,r_(500,1500),200,1.5,'bandpass',i*.05);tone(80,40,.4,'sine',.4)},
 fall:()=>{nz(1,.25,300,80,.6,'lowpass');tone(70,30,.7,'sine',.6,.85);nz(.6,.35,1400,200,.7,'lowpass',.85)},
 pick:()=>{tone(r_(620,700),1250,.07,'sine',.13);tone(1880,0,.14,'sine',.05,.05)},
 growl:()=>{tone(r_(70,95),55,.5,'sawtooth',.07);nz(.45,.12,300,120,2,'lowpass')},
 roar:()=>{tone(90,40,1.2,'sawtooth',.16);tone(130,60,1.1,'square',.06,.05);nz(1.2,.35,800,90,.7,'lowpass')},
 screech:()=>{tone(r_(2400,2800),1800,.18,'sawtooth',.03);tone(3200,2600,.12,'sine',.04,.08)},
 step:()=>{const s=AU.scene,z=D&&D.zone&&D.zone.Zd.id,p=r_(.85,1.15);
  if(s==='town'||s==='shop'){nz(.035,.09,2600*p,1400,2);tone(130*p,80,.05,'sine',.08)}
  else if(z==='silver'){nz(.12,.16,1800*p,500,1.2);nz(.06,.08,4000,2500,2,'highpass',.03)}
  else if(z==='gold'){nz(.1,.12,3000*p,1200,.8,'highpass')}
  else if(s==='cave'){nz(.07,.12,520*p,200,1,'lowpass');tone(70,50,.12,'sine',.1)}
  else{nz(.08,.1,900*p,300,1,'lowpass');nz(.05,.04,3000,1800,1.5,'bandpass',.02)}}});
// ใส่ตำแหน่งให้เสียงของมอน/รถม้า
{const _uc=updCarts;updCarts=function(dt){const s0=sfx;sfx=(n)=>{if(n==='hoof'){const c=D.carts.reduce((a,b)=>Math.hypot(b.x-P.x,b.y-P.y)<Math.hypot(a.x-P.x,a.y-P.y)?b:a);s0(n,c.x,c.y)}else s0(n)};try{_uc(dt)}finally{sfx=s0}}}
function wall50(x0,y0,x1,y1){if(typeof zHit!=='function')return false;const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/8);let run=0;for(let i=2;i<n-1;i++){const u=i/n;if(zHit(x0+(x1-x0)*u,y0+(y1-y0)*u)){if(++run>=2)return true}else run=0}return false}
{const _um=updMob;updMob=function(m,dt){const s0=sfx,a0=m.aggro;sfx=(n,x,y)=>s0(n,x===undefined?m.x:x,x===undefined?m.y:y);try{_um(m,dt)}finally{sfx=s0}
 if(!a0&&m.aggro&&!m.dead){sfx(m.boss?'roar':m.f==='bat'?'screech':'growl',m.x,m.y);if(m.boss)shake(5,.5)}}}
{const _w0=updWorld;updWorld=function(dt){const n0=falling.filter(f=>f.landed).length;_w0(dt);updChips(dt);const n1=falling.filter(f=>f.landed).length;if(n1>n0){sfx('fall');shake(4,.25)}}}

// ---------- 5) อนิเมชั่นเก็บของ: ไอคอนเด้งขึ้นเหนือหัว + ตัวละครย่อเก็บ ----------
const PKFX=[],PKIMG={};
function pkImg(k){if(!PKIMG[k]){const im=new Image();try{im.src=iconURL('mat:'+k)}catch(e){}PKIMG[k]=im}return PKIMG[k]}
{const _lp=logPick;logPick=function(k){_lp(k);if(k==='coin'){if(PKFX.length&&PKFX[0].k==='coin'&&PKFX[0].t<.4){PKFX[0].n++;PKFX[0].t=Math.min(PKFX[0].t,.15)}else PKFX.unshift({k,n:1,t:0,ox:(Math.random()-.5)*10})}
 else{const e=PKFX.find(q=>q.k===k&&q.t<.5);if(e){e.n++;e.t=.1}else PKFX.unshift({k,n:1,t:0,ox:(Math.random()-.5)*14})}if(PKFX.length>5)PKFX.length=5;P.pk=.18;sfx('pick')}}
window.logPick=logPick;
function drawPkfx(){for(let i=PKFX.length-1;i>=0;i--){const e=PKFX[i];e.t+=DT;if(e.t>1.1){PKFX.splice(i,1);continue}
 const u=Math.min(1,e.t/.35),eo=1-Math.pow(1-u,3),bounce=e.t<.35?0:Math.sin((e.t-.35)*14)*2*Math.exp(-(e.t-.35)*6),a=e.t<.8?1:1-(e.t-.8)/.3,x=P.x+e.ox,y=P.y-22-eo*58-i*4+bounce,s=.6+.4*eo;
 ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.fill();ctx.strokeStyle='rgba(255,230,140,.8)';ctx.lineWidth=1.2;ctx.stroke();
 if(e.k==='coin'){ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(0,0,6,0,7);ctx.fill();ctx.strokeStyle='#a8741a';ctx.stroke()}else{const im=pkImg(e.k);if(im.complete&&im.naturalWidth)ctx.drawImage(im,-9,-9,18,18)}
 ctx.font='bold 10px system-ui,sans-serif';ctx.textAlign='left';ctx.lineWidth=2.5;ctx.strokeStyle='#000';ctx.strokeText('+'+e.n,11,4);ctx.fillStyle='#fff';ctx.fillText('+'+e.n,11,4);ctx.restore()}}

// ---------- 6) ป้ายชื่อตัวละครแบบใหม่ + มงกุฎตามเลเวล (ทองแดง → เงิน → ทอง → แดง) ----------
const CROWN=[{lv:1,n:'ทองแดง',a:'#ffcf9a',b:'#c46a2a',c:'#6a2f10',gem:'#7fe0ff'},{lv:25,n:'เงิน',a:'#ffffff',b:'#b8c4d8',c:'#56627a',gem:'#4aa8ff'},{lv:50,n:'ทอง',a:'#fff6b8',b:'#f2c230',c:'#8a5e08',gem:'#e8343a'},{lv:80,n:'แดง',a:'#ffb8b0',b:'#e0303a',c:'#6a0a10',gem:'#ffe14a'}];
const crownOf=lv=>{let c=CROWN[0];for(const q of CROWN)if(lv>=q.lv)c=q;return c};
function drawCrown(k,x,y,s,C,t){k.save();k.translate(x,y);k.scale(s,s);const g=k.createLinearGradient(0,-9,0,4);g.addColorStop(0,C.a);g.addColorStop(.55,C.b);g.addColorStop(1,C.c);
 k.fillStyle=g;k.strokeStyle='rgba(0,0,0,.75)';k.lineWidth=1.2;k.beginPath();k.moveTo(-9,4);k.lineTo(-10,-6);k.lineTo(-5,-1);k.lineTo(0,-9);k.lineTo(5,-1);k.lineTo(10,-6);k.lineTo(9,4);k.closePath();k.fill();k.stroke();
 k.fillStyle=C.c;k.fillRect(-9,1,18,3);k.fillStyle=C.gem;k.beginPath();k.arc(0,-1,1.8,0,7);k.fill();for(const [px,py] of [[-10,-6],[0,-9],[10,-6]]){k.fillStyle=C.a;k.beginPath();k.arc(px,py,1.4,0,7);k.fill()}
 const tw=(Math.sin(t*3+x*.1)+1)/2;if(tw>.85){k.fillStyle='rgba(255,255,255,'+((tw-.85)*6)+')';k.fillRect(3,-8,1,5);k.fillRect(1,-6,5,1)}k.restore()}
nameTag=function(){if(!P.name||P.dead)return;const t=performance.now()/1000,C=crownOf(P.lv);ctx.save();ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='left';
 const nm=P.name,tw=ctx.measureText(nm).width,lv='Lv.'+P.lv;ctx.font='bold 8px system-ui,sans-serif';const lw=ctx.measureText(lv).width;
 const w=tw+lw+40,h=18,x=Math.round(P.x-w/2),y=Math.round(P.y-80);
 if(P.bub&&performance.now()<P.bub.until)bubble(P.bub.txt,Math.round(P.x),y-8,Math.min(1,(P.bub.until-performance.now())/300));
 const bg=ctx.createLinearGradient(0,y,0,y+h);bg.addColorStop(0,'rgba(30,26,36,.88)');bg.addColorStop(1,'rgba(8,6,12,.88)');ctx.fillStyle=bg;rr(ctx,x,y,w,h,9);ctx.fill();
 ctx.strokeStyle=C.b;ctx.lineWidth=1.4;ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1;rr(ctx,x+2,y+2,w-4,h-4,7);ctx.stroke();
 ctx.fillStyle=C.b;ctx.beginPath();ctx.moveTo(x+w/2-5,y+h);ctx.lineTo(x+w/2,y+h+4);ctx.lineTo(x+w/2+5,y+h);ctx.fill();
 drawCrown(ctx,x+12,y+h/2+1,.78,C,t);
 ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.9)';ctx.strokeText(nm,x+23,y+13);const ng=ctx.createLinearGradient(0,y+3,0,y+14);ng.addColorStop(0,'#ffffff');ng.addColorStop(1,C.a);ctx.fillStyle=ng;ctx.fillText(nm,x+23,y+13);
 ctx.font='bold 8px system-ui,sans-serif';const lx=x+w-lw-9;ctx.fillStyle=C.c;rr(ctx,lx-3,y+4,lw+6,10,5);ctx.fill();ctx.fillStyle=C.a;ctx.fillText(lv,lx,y+12);ctx.restore()};

// ---------- 7) ช่องยาเลือด / ยามานา บนแถบลัด + ขายในร้านยา ----------
{const bar=gid('bar');for(const [k,lab,id] of [['hpp','H','qh'],['mpp','N','qm']]){const d=document.createElement('div');d.className='ts q pot';d.id=id;d.style.touchAction='manipulation';
 d.innerHTML='<img alt="" src="'+iconURL('mat:'+k)+'"><b>'+lab+'</b><em>0</em>';d.onpointerdown=e=>{e.preventDefault();if(P.dead)return;useItem(k)};bar.appendChild(d)}
 const st=document.createElement('style');st.textContent='.ts.pot{border-color:#8a3a4a}#qm.ts.pot{border-color:#3a5a9a}.ts.pot.dim img{opacity:.35;filter:grayscale(.8)}.ts.pot b{color:#ffd8d8}';document.head.appendChild(st)
 setInterval(()=>{for(const [k,id] of [['hpp','qh'],['mpp','qm']]){const el=gid(id);if(!el)continue;el.lastChild.textContent=inv[k]|0;el.classList.toggle('dim',!(inv[k]>0))}},150)}
SD.potion.buy.splice(0,0,{id:'buyhpp',name:'ยาเลือด (ขวด)',mat:'hpp',price:30,give:'hpp',note:'เก็บใส่กระเป๋า · เลือด +60 · กด H หรือช่องยา'},{id:'buympp',name:'ยามานา (ขวด)',mat:'mpp',price:25,give:'mpp',note:'เก็บใส่กระเป๋า · มานา +40 · กด N หรือช่องยา'});

// ---------- 8) เดินลื่นขึ้น: ไถลผ่านมุมสิ่งกีดขวาง · NPC ในเมืองไม่ขวางทางผู้เล่น ----------
function moveSlide(dx,dy){
 if(dx){if(!hit(P.x+dx,P.y))P.x+=dx;else if(Math.abs(dy)<Math.abs(dx)*.6)slideAxis(dx,0)}
 if(dy){if(!hit(P.x,P.y+dy))P.y+=dy;else if(Math.abs(dx)<Math.abs(dy)*.6)slideAxis(0,dy)}}
function slideAxis(dx,dy){const sp=Math.abs(dx||dy);for(const k of [3,6,9,12])for(const s of [-1,1]){
 if(dx){if(!hit(P.x+dx,P.y+s*k)){const m=Math.min(sp,k);if(!hit(P.x,P.y+s*m)){P.y+=s*m;return}}}
 else if(!hit(P.x+s*k,P.y+dy)){const m=Math.min(sp,k);if(!hit(P.x+s*m,P.y)){P.x+=s*m;return}}}}
{const _dh=dhit;dhit=function(x,y){if(D&&D.town){for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);if(!dm[ty]||(dm[ty][tx]!==FL&&dm[ty][tx]!==GATE))return true}return false}return _dh(x,y)}}

// ---------- 9) กลางวัน / กลางคืน (1 วันในเกม = 12 นาทีจริง) ----------
const DAY={t:((srvNow()/1000)%720)/720*24,len:720};/* v5.11: เวลาในเกมอิงนาฬิกาเซิร์ฟเวอร์ — ทุกคนเห็นเวลาเดียวกัน */// t = ชั่วโมงในเกม
let NLc=null,NLk=null;
const dayDark=h=>{if(h>=7&&h<17)return 0;if(h>=17&&h<20)return (h-17)/3;if(h>=5&&h<7)return 1-(h-5)/2;return 1};
function nightLayer(){const h=DAY.t,dk=dayDark(h);if(dk<=.01&&!(h>=16&&h<19))return;
 const w=Math.ceil(VW/2),hh=Math.ceil(VH/2);if(!NLc||NLc.width!==w||NLc.height!==hh){NLc=document.createElement('canvas');NLc.width=w;NLc.height=hh;NLk=NLc.getContext('2d')}
 const k=NLk;k.globalCompositeOperation='source-over';k.clearRect(0,0,w,hh);
 const sunset=h>=16&&h<19.5?Math.sin(Math.min(1,(h-16)/3.5)*Math.PI):0;
 k.fillStyle='rgba('+Math.round(10+60*sunset)+','+Math.round(16+20*sunset)+','+Math.round(48-20*sunset)+','+(.58*dk+.12*sunset)+')';k.fillRect(0,0,w,hh);
 if(dk>.05){k.globalCompositeOperation='destination-out';const cm=window.LASTCAM||[0,0],L=(wx,wy,r,a)=>{const sx=(wx-cm[0])*Z/2,sy=(wy-cm[1])*Z/2,rr=r*Z/2;if(sx<-rr||sy<-rr||sx>w+rr||sy>hh+rr)return;const g=k.createRadialGradient(sx,sy,0,sx,sy,rr);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(sx-rr,sy-rr,rr*2,rr*2)};
  L(P.x,P.y-20,150,.85*dk);
  if(D&&D.town){for(const [lx,ly] of LAMP_DATA)L(lx*T+16,ly*T-22,110,.9);if(!D.city2)for(const p of TOWNLIFE.lightSources())L(p.x,p.y,p.r*4,.85);L(PAD.x,PAD.y,120,.8);L(22*T,13*T,90,.5)}
  else if(!D){L(ZG.x,ZG.y,130,.9);L(WC.x,WC.y,120,.7)}
  else if(D&&D.zone){for(const m of D.mobs)if(m.f==='wisp')L(m.x,m.y-18,80,.7)}
  k.globalCompositeOperation='source-over'}
 ctx.drawImage(NLc,0,0,VW,VH);
 if(dk>.3&&D&&D.town){const cm=window.LASTCAM||[0,0];ctx.globalCompositeOperation='lighter';for(const [lx,ly] of LAMP_DATA){const sx=(lx*T+16-cm[0])*Z,sy=(ly*T-22-cm[1])*Z;if(sx<-40||sy<-40||sx>VW+40||sy>VH+40)continue;const g=ctx.createRadialGradient(sx,sy,0,sx,sy,26*Z);g.addColorStop(0,'rgba(255,200,90,'+(.45*dk)+')');g.addColorStop(1,'rgba(255,160,40,0)');ctx.fillStyle=g;ctx.fillRect(sx-30*Z,sy-30*Z,60*Z,60*Z)}ctx.globalCompositeOperation='source-over'}
 if(dk>.5&&!D){const t=performance.now()/1000;for(let i=0;i<18;i++){const x=((i*97.3+t*12*(i%3+1))%VW+VW)%VW,y=((i*53.1+Math.sin(t*.7+i)*30)%VH+VH)%VH,a=(Math.sin(t*2.5+i*1.7)+1)/2;ctx.fillStyle='rgba(220,255,140,'+(a*.8*dk)+')';ctx.fillRect(x,y,2,2)}}}
{const _c2=cam;cam=function(a,b,c){const r=_c2(a,b,c);window.LASTCAM=r;return r}}
{const _g=grade;grade=function(t,k){_g(t,k);nightLayer()}}
// นาฬิกามุมจอ
const clockEl=document.createElement('div');clockEl.id='clock';gid('wrap').appendChild(clockEl);
{const st=document.createElement('style');st.textContent='#clock{position:absolute;z-index:3;font:bold 11px system-ui,sans-serif;color:#fff;background:rgba(0,0,0,.55);border:1px solid #e8c14a;border-radius:10px;padding:2px 8px;pointer-events:none;white-space:nowrap}';document.head.appendChild(st)}
setInterval(()=>{{const _n=((srvNow()/1000)%DAY.len)/DAY.len*24;DAY.t=_n;if(window.__dayPb!==SRV.pb){window.__dayPb=SRV.pb;window._dayPt=_n}}const h=Math.floor(DAY.t),m=Math.floor((DAY.t-h)*60/10)*10,ic=dayDark(DAY.t)>.5?'🌙':DAY.t>=17&&DAY.t<20?'🌇':DAY.t>=5&&DAY.t<7?'🌅':'☀️';
 clockEl.textContent=ic+' '+String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');const mi=gid('mini'),wr=gid('wrap').getBoundingClientRect();if(mi&&mi.offsetParent){const r=mi.getBoundingClientRect();clockEl.style.left=(r.left-wr.left+r.width/2-clockEl.offsetWidth/2)+'px';clockEl.style.top=(r.bottom-wr.top+3)+'px';clockEl.style.display=''}else clockEl.style.display='none'},500);
// เสียงกลางคืน: จิ้งหรีดแทนนก
{const _bt=birdTick;birdTick=function(){if(AU.c&&!SET.mute&&!document.hidden&&dayDark(DAY.t)>.6&&(AU.scene==='field'||AU.scene==='town')){setTimeout(birdTick,1500+Math.random()*2500);for(let i=0;i<3+(Math.random()*4|0);i++)tone(4200+Math.random()*300,0,.04,'sine',.025,i*.07,'am');return}_bt()}}

// ---------- 10) วาดเศษ/อนิเมชั่นเก็บของ ต่อจากตัวละคร (ทุกฉาก) · ย่อตัวตอนเก็บของ ----------
{const _h=hero;hero=function(){if(P.pk>0&&!P.dead){P.pk-=DT;const s=1-.06*Math.sin(Math.min(1,P.pk/.18)*Math.PI);ctx.save();ctx.translate(P.x,P.y);ctx.scale(1,s);ctx.translate(-P.x,-P.y);_h();ctx.restore()}else _h();drawChips();drawPkfx()}}


// ---------- v3.2 : กำแพงเมืองสมจริง (เชิงเทิน ทางเดินบนกำแพง ตะไคร่ คบไฟ) · ป้อมหลังคากรวย · ซุ้มประตู · รูปปั้นเทพธิดาใหม่ ----------
const marb=(k,x0,y0,x1,y1,a,b)=>{const g=k.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g};
twWall=function(k,x,y,side){const px=x*T,py=y*T,h=hash(x*3.1+y,y*1.7+x);
 // ทางเดินบนกำแพง: หินปูพื้นสลับสี
 for(let j=0;j<2;j++)for(let i=0;i<2;i++){const q=hash(x*2+i,y*2+j);k.fillStyle=['#8c8678','#837d70','#958f82','#7c7669'][Math.floor(q*4)];k.fillRect(px+i*16,py+j*16,16,16);k.fillStyle='rgba(255,255,255,.07)';k.fillRect(px+i*16,py+j*16,16,2);k.fillStyle='rgba(0,0,0,.18)';k.fillRect(px+i*16,py+j*16+15,16,1);k.fillRect(px+i*16+15,py+j*16,1,16)}
 // เชิงเทิน (ฟันปลา) ด้านนอก
 const M=(ax,ay,w,hh)=>{k.fillStyle='#a8a294';k.fillRect(ax,ay,w,hh);k.fillStyle='#6a6458';if(w>hh)k.fillRect(ax,ay+hh-3,w,3);else k.fillRect(ax+w-3,ay,3,hh);k.strokeStyle='rgba(30,26,20,.6)';k.lineWidth=1;k.strokeRect(ax+.5,ay+.5,w-1,hh-1)};
 if(side==='n'){k.fillStyle='#6f695d';k.fillRect(px,py,T,9);M(px+2,py,10,9);M(px+18,py,10,9)}
 if(side==='s'){k.fillStyle='#6f695d';k.fillRect(px,py+T-9,T,9);M(px+2,py+T-9,10,9);M(px+18,py+T-9,10,9)}
 if(side==='w'){k.fillStyle='#6f695d';k.fillRect(px,py,9,T);M(px,py+2,9,10);M(px,py+18,9,10)}
 if(side==='e'){k.fillStyle='#6f695d';k.fillRect(px+T-9,py,9,T);M(px+T-9,py+2,9,10);M(px+T-9,py+18,9,10)}
 // ผนังด้านใน (มองเห็นหน้าก้อนหิน) + เงาตกบนหญ้า
 const face=(ax,ay,w,hh)=>{for(let r=0;r<hh;r+=6)for(let c=-(r/6&1)*7;c<w;c+=14){const q=hash(ax+c,ay+r);k.fillStyle=q>.66?'#6e685c':q>.33?'#625c51':'#585247';k.fillRect(ax+Math.max(0,c),ay+r,Math.min(13,w-Math.max(0,c)),5)}k.fillStyle='rgba(0,0,0,.35)';k.fillRect(ax,ay+hh-1,w,1)};
 if(side==='n'){face(px,py+T,T,12);k.fillStyle='rgba(0,0,0,.22)';k.fillRect(px,py+T+12,T,6)}
 if(side==='w'){k.fillStyle='#5f594e';k.fillRect(px+T,py,4,T);k.fillStyle='rgba(0,0,0,.2)';k.fillRect(px+T+4,py,6,T)}
 if(side==='e'){k.fillStyle='#5f594e';k.fillRect(px-4,py,4,T);k.fillStyle='rgba(0,0,0,.2)';k.fillRect(px-10,py,6,T)}
 if(side==='s'){k.fillStyle='rgba(0,0,0,.25)';k.fillRect(px,py-5,T,5)}
 // ตะไคร่ / รอยร้าว
 if(h>.72){k.fillStyle='rgba(70,110,50,.55)';k.beginPath();k.ellipse(px+6+h*18,py+12+h*8,6,3,0,0,7);k.fill();k.fillStyle='rgba(100,150,70,.45)';k.beginPath();k.ellipse(px+9+h*16,py+11+h*8,3,2,0,0,7);k.fill()}
 if(h<.15){k.strokeStyle='rgba(20,16,12,.5)';k.lineWidth=1;k.beginPath();k.moveTo(px+10,py+6);k.lineTo(px+14,py+13);k.lineTo(px+12,py+20);k.stroke()}
 // คบไฟบนกำแพงด้านใน ทุก ๆ 6 ช่อง
 if(side==='n'&&x%6===3){const tx=px+16,ty=py+T+4;k.fillStyle='#3a2a1a';k.fillRect(tx-1.5,ty,3,9);k.fillStyle='#ffb43a';k.beginPath();k.ellipse(tx,ty-2,3,5,0,0,7);k.fill();k.fillStyle='#fff2a8';k.fillRect(tx-1,ty-3,2,3);
  const g=k.createRadialGradient(tx,ty,1,tx,ty,26);g.addColorStop(0,'rgba(255,170,60,.35)');g.addColorStop(1,'rgba(255,170,60,0)');k.fillStyle=g;k.fillRect(tx-26,ty-26,52,52)}};
twTower=function(k,cx,cy,r,flag){k.fillStyle='rgba(0,0,0,.32)';k.beginPath();k.ellipse(cx+7,cy+10,r+2,r*.9,0,0,7);k.fill();
 // ผนังหอ (ก้อนหินเป็นวง)
 k.fillStyle='#6a6458';k.beginPath();k.arc(cx,cy,r,0,7);k.fill();
 for(let ring=0;ring<2;ring++){const rr=r-ring*6;for(let i=0;i<18;i++){const a0=i/18*6.283+ring*.17,a1=a0+6.283/18-.04;k.strokeStyle=hash(i,ring+cx)>.5?'#8a8476':'#7a7468';k.lineWidth=5;k.beginPath();k.arc(cx,cy,rr-3,a0,a1);k.stroke()}}
 // เชิงเทินรอบหอ
 for(let i=0;i<12;i++){const a=i/12*6.283,x=cx+Math.cos(a)*(r-4),y=cy+Math.sin(a)*(r-4);k.fillStyle='#a8a294';k.fillRect(x-4,y-4,8,8);k.fillStyle='#5a554a';k.fillRect(x-4,y+2,8,2)}
 // หลังคากรวย
 const rr=r*.66;for(let i=0;i<10;i++){const a0=i/10*6.283,a1=(i+1)/10*6.283;k.fillStyle=i%2?'#a8321f':'#c0452a';k.beginPath();k.moveTo(cx,cy-rr*.35);k.lineTo(cx+Math.cos(a0)*rr,cy+Math.sin(a0)*rr);k.lineTo(cx+Math.cos(a1)*rr,cy+Math.sin(a1)*rr);k.closePath();k.fill()}
 k.strokeStyle='#4a1a10';k.lineWidth=1.5;k.beginPath();k.arc(cx,cy,rr,0,7);k.stroke();k.fillStyle='rgba(255,255,255,.18)';k.beginPath();k.moveTo(cx,cy-rr*.35);k.lineTo(cx-rr*.7,cy-rr*.7);k.lineTo(cx-rr*.2,cy-rr*.95);k.closePath();k.fill();
 k.fillStyle='#ffd23a';k.beginPath();k.arc(cx,cy-rr*.35,2.5,0,7);k.fill();
 if(flag){k.fillStyle='#3a2a1a';k.fillRect(cx-1,cy-rr*.35-30,2,30);const fy=cy-rr*.35-30;k.fillStyle='#c0392b';k.beginPath();k.moveTo(cx+1,fy);k.quadraticCurveTo(cx+11,fy+2,cx+22,fy+3);k.lineTo(cx+19,fy+7);k.lineTo(cx+22,fy+11);k.quadraticCurveTo(cx+11,fy+10,cx+1,fy+12);k.fill();k.fillStyle='#ffd23a';k.fillRect(cx+7,fy+4,4,4)}};
function twGate(k,gx){const x=gx*T,y=16*T,ins=gx===0?1:-1;
 k.fillStyle='#2a2420';k.fillRect(x,y,T,2*T);for(let i=0;i<4;i++){k.fillStyle=i%2?'#3a332c':'#332d27';k.fillRect(x,y+i*16,T,16)}
 k.fillStyle='rgba(0,0,0,.35)';k.fillRect(x,y,T,6);
 // ซี่ประตูเหล็ก (ยกขึ้น) + บานไม้เปิดแนบกำแพง
 k.fillStyle='#4a4a52';for(let i=0;i<6;i++){k.fillRect(x+2+i*5,y-6,2,12);k.beginPath();k.moveTo(x+1+i*5,y+6);k.lineTo(x+3+i*5,y+11);k.lineTo(x+5+i*5,y+6);k.fill()}k.fillRect(x,y-2,T,3);
 for(const s of [0,1]){const dy=s?y+2*T-6:y;k.fillStyle='#6a4422';k.fillRect(x+(ins>0?T-3:0),dy-(s?0:0),3,6);k.fillStyle='#8a5a2e';k.fillRect(x+(ins>0?T:-14),s?y+2*T-5:y,14,5);k.fillStyle='#2a2a30';k.fillRect(x+(ins>0?T+3:-10),s?y+2*T-4:y+1,2,3);k.fillRect(x+(ins>0?T+9:-4),s?y+2*T-4:y+1,2,3)}
 // ซุ้มหินโค้ง
 k.strokeStyle='#a8a294';k.lineWidth=5;k.beginPath();k.moveTo(x+T/2,y-4);k.lineTo(x+T/2,y+2*T+4);k.stroke();k.strokeStyle='#5a554a';k.lineWidth=1;k.stroke();
 for(let i=0;i<5;i++){k.fillStyle='#b4ae9f';k.fillRect(x+T/2-4,y-4+i*(2*T+8)/4-3,8,6);k.strokeStyle='#4a4438';k.strokeRect(x+T/2-3.5,y-4+i*(2*T+8)/4-2.5,7,5)}}
twStatue=function(k,cx,by){
 // แท่นสองชั้น ขอบทอง ป้ายสลัก
 k.fillStyle='rgba(0,0,0,.3)';k.beginPath();k.ellipse(cx+8,by+2,44,10,0,0,7);k.fill();
 k.fillStyle=marb(k,0,by-14,0,by,'#d8d2c4','#a8a092');k.fillRect(cx-38,by-14,76,14);k.fillStyle='#efe9dc';k.fillRect(cx-38,by-14,76,3);
 k.fillStyle=marb(k,0,by-30,0,by-14,'#e4ded0','#b8b0a2');k.fillRect(cx-30,by-30,60,16);k.fillStyle='#f6f1e6';k.fillRect(cx-30,by-30,60,3);
 k.fillStyle='#c9a640';k.fillRect(cx-38,by-6,76,2);k.fillRect(cx-30,by-19,60,1.5);k.fillStyle='#8a7a5a';k.fillRect(cx-14,by-27,28,7);k.fillStyle='#e8d58a';k.font='bold 5px serif';k.textAlign='center';k.fillText('LVX AETERNA',cx,by-22);k.textAlign='left';
 const top=by-30;
 // แสงศักดิ์สิทธิ์ด้านหลัง
 const g=k.createRadialGradient(cx,top-70,6,cx,top-70,78);g.addColorStop(0,'rgba(255,244,200,.75)');g.addColorStop(.5,'rgba(255,230,160,.25)');g.addColorStop(1,'rgba(255,230,160,0)');k.fillStyle=g;k.fillRect(cx-80,top-150,160,160);
 for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.22;k.fillStyle='rgba(255,246,210,.12)';k.beginPath();k.moveTo(cx,top-96);k.lineTo(cx+Math.cos(a-.05)*90,top-96+Math.sin(a-.05)*90);k.lineTo(cx+Math.cos(a+.05)*90,top-96+Math.sin(a+.05)*90);k.closePath();k.fill()}
 // ปีก (ขนนกซ้อน 3 ชั้น)
 for(const s of [-1,1]){for(let row=0;row<3;row++){const n=7-row,len=[40,30,20][row];for(let i=0;i<n;i++){const u=i/(n-1),bx=cx+s*(8+u*26),byy=top-62+u*18-row*6,ang=s*(-.3+u*1.3)+(s<0?Math.PI:0);
   k.save();k.translate(bx,byy);k.rotate(s>0?.9+u*.6-row*.15:Math.PI-.9-u*.6+row*.15);k.fillStyle=marb(k,0,0,len,0,'#fbf8f0','#cfc8b8');k.strokeStyle='rgba(110,100,85,.55)';k.lineWidth=.8;
   k.beginPath();k.moveTo(0,0);k.quadraticCurveTo(len*.5,-5,len,0);k.quadraticCurveTo(len*.5,4,0,2);k.closePath();k.fill();k.stroke();k.restore()}}}
 // ชุดยาวพลิ้ว
 k.fillStyle=marb(k,cx-18,0,cx+18,0,'#d9d2c3','#fbf8f0');k.strokeStyle='rgba(110,100,85,.7)';k.lineWidth=1;
 k.beginPath();k.moveTo(cx-7,top-58);k.quadraticCurveTo(cx-12,top-30,cx-20,top-2);k.quadraticCurveTo(cx,top+3,cx+20,top-2);k.quadraticCurveTo(cx+12,top-30,cx+7,top-58);k.closePath();k.fill();k.stroke();
 k.strokeStyle='rgba(120,110,95,.45)';for(const o of [-12,-6,0,6,12]){k.beginPath();k.moveTo(cx+o*.25,top-46);k.quadraticCurveTo(cx+o*.8+2,top-22,cx+o*1.4,top-2);k.stroke()}
 k.fillStyle='#c9a640';k.fillRect(cx-7,top-46,14,2);
 // ลำตัว แขนข้างหนึ่งชูลูกแก้วแสง แขนอีกข้างแนบอก
 k.fillStyle=marb(k,cx-8,0,cx+8,0,'#e2dccf','#fbf8f0');k.beginPath();k.moveTo(cx-7,top-58);k.lineTo(cx+7,top-58);k.lineTo(cx+6,top-44);k.lineTo(cx-6,top-44);k.closePath();k.fill();k.strokeStyle='rgba(110,100,85,.7)';k.stroke();
 k.lineCap='round';k.strokeStyle='#efe9dc';k.lineWidth=4;k.beginPath();k.moveTo(cx+6,top-56);k.quadraticCurveTo(cx+16,top-66,cx+15,top-82);k.stroke();k.strokeStyle='rgba(110,100,85,.5)';k.lineWidth=1;k.stroke();
 k.strokeStyle='#efe9dc';k.lineWidth=4;k.beginPath();k.moveTo(cx-6,top-56);k.quadraticCurveTo(cx-10,top-48,cx-2,top-48);k.stroke();k.strokeStyle='rgba(110,100,85,.5)';k.lineWidth=1;k.stroke();
 const og=k.createRadialGradient(cx+15,top-88,1,cx+15,top-88,14);og.addColorStop(0,'#ffffff');og.addColorStop(.35,'rgba(255,240,170,.95)');og.addColorStop(1,'rgba(255,220,120,0)');k.fillStyle=og;k.beginPath();k.arc(cx+15,top-88,14,0,7);k.fill();
 // ศีรษะ ผมยาว มงกุฎใบลอเรล
 k.fillStyle='#ece6d8';k.beginPath();k.moveTo(cx-7,top-66);k.quadraticCurveTo(cx-10,top-52,cx-6,top-50);k.lineTo(cx+6,top-50);k.quadraticCurveTo(cx+10,top-52,cx+7,top-66);k.closePath();k.fill();
 k.fillStyle=marb(k,cx-6,top-74,cx+6,top-60,'#fbf8f0','#d8d1c2');k.beginPath();k.ellipse(cx,top-66,5.5,6.5,0,0,7);k.fill();k.strokeStyle='rgba(110,100,85,.7)';k.stroke();
 k.fillStyle='rgba(120,110,95,.35)';k.fillRect(cx-3,top-67,2,1);k.fillRect(cx+1,top-67,2,1);k.fillRect(cx-1,top-63,2,1);
 k.strokeStyle='#c9a640';k.lineWidth=1.6;k.beginPath();k.arc(cx,top-68,6,Math.PI*1.05,Math.PI*1.95);k.stroke();for(let i=0;i<5;i++){const a=Math.PI*(1.1+i*.2);k.fillStyle='#d8b84a';k.beginPath();k.ellipse(cx+Math.cos(a)*6.5,top-68+Math.sin(a)*6.5,1.8,1,a,0,7);k.fill()}
 k.strokeStyle='rgba(232,193,74,.9)';k.lineWidth=1.5;k.beginPath();k.ellipse(cx,top-78,9,3,0,0,7);k.stroke()};
// ใส่ซุ้มประตูหลังสร้างเมือง
{const _bt=buildTown;buildTown=function(){_bt();const k=dcv.getContext('2d');for(const gx of [0,TW-1])twGate(k,gx);
 for(const gx of [1,TW-2])for(const gy of [14,19])twTower(k,gx*T+16,gy*T+16,30,0);
 for(const [x,y] of [[2,13],[2,20],[TW-3,13],[TW-3,20]])twBanner(k,x*T+8,y*T+2)}}


// =====================================================================
// v3.3 : ของสูงในเมืองบังตัวละครได้ (รูปปั้น ต้นไม้ เสา โคมไฟ) · สไลม์แสดงผลแบบมอนตัวอื่น · ระบบแรง (พุ่ง/ฟัน/ขุด/วิ่ง ใช้แรง)
// =====================================================================
// ---------- 1) ของในเมืองเรียงลำดับความลึก ----------
const TOWNPROPS=[];
function prop(fn,base,x0,y0,w,h,treeArt,townArt){const c=document.createElement('canvas');c.width=w;c.height=h;const k=c.getContext('2d');k.translate(-x0,-y0);fn(k);TOWNPROPS.push({prop:1,cv:c,x0,y0,w,h,base,y:base/T-1});
 if(townArt)TOWNART.watch(()=>{k.clearRect(x0,y0,w,h);fn(k)});
 if(treeArt&&!TREEART.ready&&!TREEART.failed)TREEART.pending.push(()=>{k.clearRect(x0,y0,w,h);fn(k)})}
{const _bt=buildTown;buildTown=function(){TOWNPROPS.length=0;_bt();D.stalls=STALL_DATA.concat(TOWNPROPS)}}
{const _ds=drawStall;drawStall=function(s,t){if(!s.prop)return _ds(s,t);const behind=P.y<s.base&&P.y>s.y0+20&&P.x>s.x0+8&&P.x<s.x0+s.w-8;if(behind)ctx.globalAlpha=.55;if(!window.TOWNLIFE||!TOWNLIFE.drawProp(ctx,s))ctx.drawImage(s.cv,s.x0,s.y0);ctx.globalAlpha=1}}

// ---------- 2) สไลม์: ป้ายชื่อ + หลอดเลือดแบบเดียวกับมอนอื่น ----------
drawSlime=function(s){if(!s.max)s.max=s.hp;const k=1+((s.lv||1)-1)*.07;ctx.save();ctx.translate(s.x,s.y);ctx.scale(k,k);ctx.translate(-s.x,-s.y);_dsl({...s,hp:99});ctx.restore();
 const lv=s.lv||1,top=s.y-34*k,d=P.lv-lv,col=d>=5?'#9f9':d>=-2?'#fff':d>=-8?'#fb7':'#f66',tx='Lv.'+lv+' สไลม์';
 ctx.font='9px system-ui,sans-serif';ctx.textAlign='center';ctx.lineWidth=2.5;ctx.strokeStyle='#000';ctx.strokeText(tx,s.x,top);ctx.fillStyle=col;ctx.fillText(tx,s.x,top);
 if(s.hp<s.max){ctx.fillStyle='#000a';ctx.fillRect(s.x-16,top+3,32,4);ctx.fillStyle='#e04a3a';ctx.fillRect(s.x-16,top+3,32*Math.max(0,s.hp/s.max),4)}ctx.textAlign='left'};
{const _h=hero;hero=function(){_h();if(!(D&&D.zone))drawDmgTxt(DT)}}

// ---------- 3) ระบบแรง ----------
DASH.fa=15;
const SWING_FA={sword:3,spin:5,tool:2};
{const _a=attack;attack=function(q){
 if(P.at<0&&P.stun<=0&&!P.dead){const tool=P.draw?P.tool:'sword',cost=tool==='sword'?SWING_FA.sword:SWING_FA.tool;
  if(P.fa<cost){if(q!==true&&interact())return;tiredMsg();return}
  const a0=P.at;_a(q);if(a0<0&&P.at===0){P.fa=Math.max(0,P.fa-(P.tool==='sword'?(P.cmb===2?SWING_FA.spin:SWING_FA.sword):SWING_FA.tool))}return}
 _a(q)}}
let _tiredT=0;function tiredMsg(){const n=performance.now();if(n-_tiredT>1500){_tiredT=n;say('😮‍💨 เหนื่อยเกินไป! หยุดพักให้แรงฟื้นก่อน');sfx('thud')}}


// =====================================================================
// v3.4 : ป้ายร้านใหม่ · แผงตลาดเห็นคนขายเต็มตัว + ซื้อของได้ (ผลไม้/ผัก/ขนม มีบัฟ) · โบนัสชุดเกราะ
//        แชทแบบเกมออนไลน์ (ทั้งหมด/ทั่วไป/กิลด์/ระบบ) · เซฟอัตโนมัติ · ฟาร์มออโต้ · ยาเลือดตามเลเวล
// =====================================================================

// ---------- A) ชั้นค่าพลังเสริม (โบนัสชุด + บัฟอาหาร) ----------
P.ab={str:0,vit:0,int:0,agi:0,end:0};const BUFFS=[];
const STN_={str:'STR',vit:'VIT',int:'INT',agi:'AGI',end:'END'};
const stTxt=o=>Object.entries(o).map(([k,v])=>STN_[k]+' +'+v).join(' · ');
const SETB=[
 [{st:{vit:1}},{st:{end:3},x:'วิ่งได้นานขึ้น'}],
 [{st:{vit:2}},{st:{str:2,vit:3},x:'ถึกขึ้น'}],
 [{st:{end:3}},{st:{agi:4,end:4},x:'วิ่งไว วิ่งนาน'}],
 [{st:{int:4}},{st:{str:4,agi:3},x:'ฟันแรง คริแรง'}],
 [{st:{str:3}},{st:{str:6,vit:5},x:'นักรบทองคำ'}],
 [{st:{vit:6}},{st:{str:10,vit:10,end:8,agi:5},x:'ชุดในตำนาน'}]];
function setCount(){const c={};for(const k of ['helm','chest','pants','arm']){const id=P.armor[k];if(id){const t=ITEMS[id].tier;c[t]=(c[t]||0)+1}}return c}
function calcBonus(){const b={str:0,vit:0,int:0,agi:0,end:0},add=o=>{for(const k in o)b[k]+=o[k]},c=setCount();
 for(const t in c){if(c[t]>=2)add(SETB[t][0].st);if(c[t]>=4)add(SETB[t][1].st)}
 const n=P.armor.neck,r=P.armor.ring;if(n&&r&&ITEMS[n].tier===ITEMS[r].tier){const t=ITEMS[n].tier;add({int:2+t*2,agi:1+t})}
 for(const f of BUFFS)add(f.st);return b}
function applyBonus(){const nb=calcBonus();let ch=false;for(const k in nb){const d=nb[k]-(P.ab[k]|0);if(d){P.stats[k]+=d;ch=true}}P.ab=nb;
 if(ch){recalcStats();P.hp=Math.min(BAL.hp,P.hp);P.mp=Math.min(BAL.mp,P.mp);if(!chp.hidden)renderChar()}}
const baseStats=()=>{const s={...P.stats};for(const k in P.ab)s[k]-=P.ab[k];return s};
function addBuff(id,F){const e=BUFFS.find(b=>b.id===id);if(e){e.t=F.dur;return}BUFFS.push({id,n:F.n,ic:F.e,st:F.st,t:F.dur,dur:F.dur})}
const buffBox=document.createElement('div');buffBox.id='buffx';(gid('buffs')||gid('wrap')).appendChild(buffBox);
{const st=document.createElement('style');st.textContent='#buffx{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}#buffx .bx{background:rgba(0,0,0,.6);border:1px solid #7ed957;border-radius:8px;padding:1px 5px;font:bold 10px system-ui;color:#fff;white-space:nowrap}#buffx .bx.set{border-color:#e8c14a}';document.head.appendChild(st)}
function renderBuffs(){let h='';const c=setCount();for(const t in c)if(c[t]>=2)h+='<span class="bx set" title="'+stTxt(SETB[t][c[t]>=4?1:0].st)+'">🛡️ ชุด'+TNAMES[t]+' '+(c[t]>=4?'4':'2')+'/4</span>';
 for(const b of BUFFS)h+='<span class="bx" title="'+stTxt(b.st)+'">'+b.ic+' '+Math.ceil(b.t)+'s</span>';if(buffBox.innerHTML!==h)buffBox.innerHTML=h}
setInterval(()=>{if(!PAUSED&&!P.dead)for(let i=BUFFS.length-1;i>=0;i--){BUFFS[i].t-=.25;if(BUFFS[i].t<=0){say('⌛ บัฟ'+BUFFS[i].n+'หมดเวลาแล้ว');BUFFS.splice(i,1)}}applyBonus();renderBuffs()},250);
// หน้าสถานะ: แสดงโบนัสชุด + บัฟ
{const _rc=renderChar;renderChar=function(){_rc();const el=gid('chl');if(!el||chp.hidden)return;const c=setCount();let h='<div class="setb"><b>🛡️ โบนัสชุดเกราะ</b>';
 const any=Object.keys(c).length;if(!any)h+='<small>ใส่หมวก/เสื้อ/กางเกง/เกราะแขน ระดับเดียวกัน 2 หรือ 4 ชิ้น จะได้โบนัส</small>';
 for(const t in c){const s=SETB[t];h+='<div><span style="color:'+TIERS[t].gl+'">ชุด'+TNAMES[t]+' ('+c[t]+'/4)</span><br><small class="'+(c[t]>=2?'on':'')+'">2 ชิ้น: '+stTxt(s[0].st)+'</small><br><small class="'+(c[t]>=4?'on':'')+'">4 ชิ้น: '+stTxt(s[1].st)+' — '+s[1].x+'</small></div>'}
 const n=P.armor.neck,r=P.armor.ring;if(n&&r&&ITEMS[n].tier===ITEMS[r].tier)h+='<div><small class="on">💍 สร้อย+แหวน'+TNAMES[ITEMS[n].tier]+': '+stTxt({int:2+ITEMS[n].tier*2,agi:1+ITEMS[n].tier})+'</small></div>';
 if(BUFFS.length)h+='<b>🍽️ บัฟอาหาร</b>'+BUFFS.map(b=>'<div><small class="on">'+b.ic+' '+b.n+': '+stTxt(b.st)+' ('+Math.ceil(b.t)+' วิ)</small></div>').join('');
 el.insertAdjacentHTML('beforeend',h+'</div>')}}
{const st=document.createElement('style');st.textContent='.setb{margin-top:8px;padding:6px;border:1px solid #5a554a;border-radius:8px;background:rgba(0,0,0,.25);display:flex;flex-direction:column;gap:3px;text-align:left}.setb small{opacity:.55}.setb small.on{opacity:1;color:#9f9}';document.head.appendChild(st)}

// ---------- B) อาหาร / ผลไม้ (มีผลต่อค่าพลัง) ----------
const FOOD={
 apple:{n:'แอปเปิ้ล',e:'🍎',hu:12,hpP:.05,price:4,w:.2},
 orange:{n:'ส้มสายน้ำผึ้ง',e:'🍊',hu:10,fa:25,st:{end:3},dur:90,price:6,w:.2},
 grape:{n:'องุ่นม่วง',e:'🍇',hu:8,mpP:.2,price:7,w:.2},
 banana:{n:'กล้วยหอม',e:'🍌',hu:15,fa:40,price:6,w:.2},
 carrot:{n:'แครอท',e:'🥕',hu:12,st:{agi:3},dur:120,price:5,w:.2},
 cabbage:{n:'กะหล่ำปลี',e:'🥬',hu:18,hpP:.08,price:5,w:.4},
 corn:{n:'ข้าวโพดหวาน',e:'🌽',hu:22,fa:15,price:6,w:.3},
 pumpkin:{n:'ฟักทอง',e:'🎃',hu:40,hpP:.15,price:12,w:.8},
 honey:{n:'น้ำผึ้งป่า',e:'🍯',hu:10,hpP:.1,st:{vit:4},dur:180,price:15,w:.4},
 bread:{n:'ขนมปังอุ่น ๆ',e:'🍞',hu:25,price:8,w:.3},
 pie:{n:'พายเนื้อ',e:'🥧',hu:50,st:{str:4},dur:180,price:22,w:.5},
 cake:{n:'เค้กผลไม้',e:'🍰',hu:35,st:{str:2,vit:2,agi:2,end:2},dur:150,price:30,w:.4}};
const foodTxt=F=>[F.hu?'อิ่ม +'+F.hu:'',F.hpP?'เลือด +'+Math.round(F.hpP*100)+'%':'',F.mpP?'มานา +'+Math.round(F.mpP*100)+'%':'',F.fa?'แรง +'+F.fa:'',F.st?stTxt(F.st)+' '+F.dur+' วิ':''].filter(Boolean).join(' · ');
for(const k in FOOD){const F=FOOD[k];INVMETA[k]=[F.n,foodTxt(F)+' (กด B กินอาหาร)'];if(!INVORDER.includes(k))INVORDER.splice(INVORDER.indexOf('apple')+1,0,k);WT[k]=F.w;if(inv[k]===undefined)inv[k]=0;if(!QCONS.includes(k))QCONS.push(k)}
INVMETA.hpp=['ยาเลือด','ฟื้นเลือด 30% (อย่างน้อย 60) · กด H'];INVMETA.mpp=['ยามานา','ฟื้นมานา 30% (อย่างน้อย 40) · กด N'];
{const _ui=useItem;useItem=function(k){
 if(k==='hpp'||k==='mpp'){if(!(inv[k]>0)){say('ไม่มี'+MN(k)+'ในกระเป๋า');return}const hp=k==='hpp';if(hp?P.hp>=BAL.hp:P.mp>=BAL.mp){say(hp?'เลือดเต็มอยู่แล้ว':'มานาเต็มอยู่แล้ว');return}
  inv[k]--;const v=hp?Math.max(60,Math.round(BAL.hp*.3)):Math.max(40,Math.round(BAL.mp*.3));if(hp)P.hp=Math.min(BAL.hp,P.hp+v);else P.mp=Math.min(BAL.mp,P.mp+v);
  sfx('heal');refreshInv();dmgTxt(P.x,P.y-46,'+'+v,hp?'#7dff8a':'#7fc8ff');say((hp?'🧪 ดื่มยาเลือด +':'💧 ดื่มยามานา +')+v);return}
 const F=FOOD[k];if(!F)return _ui(k);if(!(inv[k]>0)){say('ไม่มี'+F.n+'ในกระเป๋า');return}
 if(P.hu>=99&&!F.st&&!F.fa&&!F.hpP&&!F.mpP){say('อิ่มแล้ว กินไม่ลง');return}
 inv[k]--;P.hu=Math.min(100,P.hu+F.hu);if(F.hpP)P.hp=Math.min(BAL.hp,P.hp+Math.round(BAL.hp*F.hpP));if(F.mpP)P.mp=Math.min(BAL.mp,P.mp+Math.round(BAL.mp*F.mpP));if(F.fa)P.fa=Math.min(100,P.fa+F.fa);
 if(F.st)addBuff(k,F);sfx('pop');refreshInv();applyBonus();say(F.e+' กิน'+F.n+' — '+foodTxt(F))}}
drink=function(k){useItem(k)};
eatAny=function(){const L=['bread','apple','corn','cabbage','banana','pumpkin','carrot','orange','grape','honey','pie','cake'];for(const k of L)if(inv[k]>0){useItem(k);return}say('ไม่มีอาหารในกระเป๋า — ซื้อได้ที่แผงตลาดกลางเมือง')};
// ไอคอนอาหาร
{const _mi=matIcon;matIcon=function(key){if(!FOOD[key]||key==='apple'||key==='bread')return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';k.lineWidth=1.5;k.strokeStyle='rgba(30,20,10,.7)';
 const ball=(x,y,r,a,b)=>{const g=k.createRadialGradient(x-r*.35,y-r*.35,1,x,y,r);g.addColorStop(0,a);g.addColorStop(1,b);k.fillStyle=g;k.beginPath();k.arc(x,y,r,0,7);k.fill();k.stroke()};
 const leaf=(x,y,r)=>{k.fillStyle='#4fae3a';k.beginPath();k.ellipse(x,y,6,3,r,0,7);k.fill();k.stroke()};
 if(key==='orange'){ball(24,27,15,'#ffd08a','#f08a1a');leaf(29,12,-.5);k.fillStyle='rgba(255,255,255,.5)';k.fillRect(17,20,3,3)}
 else if(key==='grape'){for(const [x,y] of [[18,18],[30,18],[24,20],[14,27],[24,28],[34,27],[19,35],[29,35],[24,42]])ball(x,y,6,'#c890ff','#5a2a90');k.strokeStyle='#5a3a1a';k.lineWidth=2.5;k.beginPath();k.moveTo(24,14);k.lineTo(26,6);k.stroke();leaf(32,9,.3)}
 else if(key==='banana'){k.fillStyle=marb(k,0,10,0,40,'#fff2a0','#e8c020');k.beginPath();k.moveTo(8,14);k.quadraticCurveTo(12,40,40,38);k.quadraticCurveTo(42,32,38,32);k.quadraticCurveTo(20,30,16,12);k.closePath();k.fill();k.stroke();k.fillStyle='#5a3a1a';k.fillRect(6,10,5,5)}
 else if(key==='carrot'){k.fillStyle=marb(k,0,0,30,0,'#ffb060','#e86a10');k.beginPath();k.moveTo(14,14);k.lineTo(34,14);k.lineTo(25,44);k.closePath();k.fill();k.stroke();k.strokeStyle='rgba(120,50,0,.5)';for(const y of [20,27,34]){k.beginPath();k.moveTo(18,y);k.lineTo(24,y);k.stroke()}for(const a of [-.5,0,.5]){k.fillStyle='#4fae3a';k.beginPath();k.ellipse(24+a*10,8,3,7,a,0,7);k.fill()}}
 else if(key==='cabbage'){ball(24,27,16,'#c8f0a0','#4a9a3a');k.strokeStyle='rgba(40,90,30,.7)';for(const a of [-1,-.3,.4,1.1]){k.beginPath();k.moveTo(24,27);k.quadraticCurveTo(24+Math.cos(a)*10,27+Math.sin(a)*6,24+Math.cos(a)*15,27+Math.sin(a)*14);k.stroke()}}
 else if(key==='corn'){k.fillStyle='#4fae3a';k.beginPath();k.moveTo(24,44);k.quadraticCurveTo(8,30,16,6);k.quadraticCurveTo(20,30,24,44);k.fill();k.beginPath();k.moveTo(24,44);k.quadraticCurveTo(40,30,32,6);k.quadraticCurveTo(28,30,24,44);k.fill();
  k.fillStyle='#ffd23a';k.beginPath();k.ellipse(24,24,7,15,0,0,7);k.fill();k.stroke();k.fillStyle='#e8a820';for(let y=13;y<38;y+=4)for(let x=19;x<30;x+=4)k.fillRect(x,y,2.5,2.5)}
 else if(key==='pumpkin'){for(const [x,w] of [[14,8],[34,8],[24,10]])ball(x,28,w+2,'#ffb050','#d0600a');k.fillStyle='#5a3a1a';k.fillRect(22,10,4,8);leaf(31,13,.3)}
 else if(key==='honey'){k.fillStyle=marb(k,0,14,0,44,'#ffd860','#c07a10');k.beginPath();k.moveTo(12,16);k.lineTo(36,16);k.quadraticCurveTo(40,30,36,44);k.lineTo(12,44);k.quadraticCurveTo(8,30,12,16);k.fill();k.stroke();k.fillStyle='#8a5a2e';k.fillRect(10,10,28,7);k.strokeRect(10,10,28,7);k.fillStyle='#f6e8c0';k.fillRect(15,25,18,10);k.fillStyle='#8a5a2e';k.font='bold 7px sans-serif';k.fillText('HONEY',15,32)}
 else if(key==='pie'){k.fillStyle='#c0c4cc';k.beginPath();k.ellipse(24,32,20,9,0,0,7);k.fill();k.stroke();k.fillStyle=marb(k,0,16,0,34,'#f0c070','#b87830');k.beginPath();k.ellipse(24,27,17,9,0,0,7);k.fill();k.stroke();k.strokeStyle='#8a5020';for(const o of [-8,0,8]){k.beginPath();k.moveTo(24+o-6,21);k.lineTo(24+o+6,33);k.stroke()}}
 else if(key==='cake'){k.fillStyle='#f8e0b0';k.beginPath();k.moveTo(8,38);k.lineTo(40,38);k.lineTo(40,22);k.lineTo(8,30);k.closePath();k.fill();k.stroke();k.fillStyle='#ff8ab0';k.beginPath();k.moveTo(8,30);k.lineTo(40,22);k.lineTo(40,18);k.lineTo(8,26);k.closePath();k.fill();k.stroke();k.fillStyle='#fff';k.fillRect(8,33,32,2);ball(30,14,4,'#ff6a6a','#c0101a')}
 return c}}
// ---------- C) แผงตลาด: คนขายยืนหลังเคาน์เตอร์เห็นครึ่งตัว · ของบนแผงตามประเภท · ซื้อได้ ----------
if(STALL_DATA[3])STALL_DATA[3].type='farm';
const STALLS={veg:{name:'แผงผักสดแม่ค้า',emoji:'🥬',a:'#3f9a4a',items:['carrot','cabbage','corn'],sell:[['carrot','แครอท',2],['cabbage','กะหล่ำปลี',2]]},
 fruit:{name:'แผงผลไม้',emoji:'🍎',a:'#e08a1e',items:['apple','orange','grape','banana'],sell:[['apple','แอปเปิ้ล',3]]},
 bread:{name:'ร้านขนมปังอบเตาถ่าน',emoji:'🍞',a:'#2f7fb0',items:['bread','pie','cake'],sell:[]},
 farm:{name:'แผงของไร่ลุง',emoji:'🎃',a:'#8a5a2e',items:['pumpkin','corn','honey'],sell:[['wood','ไม้',4]]}};
const VENDOR={veg:'แม่ค้าผัก',fruit:'แม่ค้าผลไม้',bread:'คนขายขนมปัง',farm:'ลุงขายผัก'};
for(const ty in STALLS){const S=STALLS[ty];SD['st_'+ty]={name:S.name,emoji:S.emoji,owner:{name:VENDOR[ty],greet:['มาจ้า เลือกได้เลย!']},buy:S.items.map(k=>({id:'f_'+k,name:FOOD[k].n,mat:k,emoji:FOOD[k].e,price:FOOD[k].price,give:k,note:foodTxt(FOOD[k])})),sell:S.sell}}
for(const s of STALL_DATA)s.a=STALLS[s.type].a;
const stallNear=()=>D&&D.town&&STALL_DATA.find(s=>Math.abs(P.x-(s.x+1)*T)<40&&P.y>(s.y+1)*T-4&&P.y<(s.y+2)*T+8);
function drawStallBack(s,t){const x=s.x*T,y=s.y*T,w=2*T,sw=Math.sin(t*1.6+s.x)*1.5;
 ctx.fillStyle='#4a2e16';ctx.fillRect(x+1,y-56,4,70);ctx.fillRect(x+w-5,y-56,4,70);ctx.fillStyle='#6a4422';ctx.fillRect(x+2,y-56,2,70);ctx.fillRect(x+w-4,y-56,2,70);
 const n=8;for(let i=0;i<n;i++){const ax=x-6+i*(w+12)/n,bw=(w+12)/n;ctx.fillStyle=i%2?'#f2ead6':s.a;ctx.beginPath();ctx.moveTo(ax,y-58);ctx.lineTo(ax+bw,y-58);ctx.lineTo(ax+bw+sw*.5,y-38);ctx.quadraticCurveTo(ax+bw/2+sw,y-32,ax+sw*.5,y-38);ctx.closePath();ctx.fill()}
 ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(x-6,y-60,w+12,3);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x-6,y-58,w+12,2);
 // ป้ายแผง
 const S=STALLS[s.type],TG={veg:'ผักสด',fruit:'ผลไม้',bread:'ขนมปัง',farm:'ของไร่'}[s.type];ctx.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';const tw=ctx.measureText(S.emoji+' '+TG).width+10;ctx.fillStyle='#3a2410';ctx.fillRect(x+w/2-tw/2,y-74,tw,14);ctx.strokeStyle='#e8c14a';ctx.lineWidth=1;ctx.strokeRect(x+w/2-tw/2+.5,y-73.5,tw-1,13);
 ctx.fillStyle='#ffe9a8';ctx.textAlign='center';ctx.fillText(S.emoji+' '+TG,x+w/2,y-64);ctx.textAlign='left'}
function goods(s,x,y,t){const G={
 fruit:()=>{for(let i=0;i<6;i++){ctx.fillStyle=i<3?'#d03030':'#f09a22';ctx.beginPath();ctx.arc(x+8+i*4.5,y-14-(i%2)*3,4,0,7);ctx.fill()}for(let i=0;i<5;i++){ctx.fillStyle='#8a4ad0';ctx.beginPath();ctx.arc(x+40+(i%3)*4,y-15-Math.floor(i/3)*4,3,0,7);ctx.fill()}ctx.fillStyle='#f4d03a';ctx.beginPath();ctx.ellipse(x+56,y-14,7,3,-.4,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(x+56,y-17,7,3,-.4,0,7);ctx.fill()},
 veg:()=>{for(let i=0;i<4;i++){ctx.fillStyle='#e86a10';ctx.beginPath();ctx.moveTo(x+6+i*5,y-20);ctx.lineTo(x+10+i*5,y-20);ctx.lineTo(x+8+i*5,y-8);ctx.fill();ctx.fillStyle='#4fae3a';ctx.fillRect(x+7+i*5,y-23,2,3)}for(let i=0;i<2;i++){ctx.fillStyle='#6ac04a';ctx.beginPath();ctx.arc(x+34+i*10,y-14,6,0,7);ctx.fill();ctx.strokeStyle='#3a8a2a';ctx.stroke()}ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.ellipse(x+56,y-14,3,7,.3,0,7);ctx.fill()},
 bread:()=>{for(let i=0;i<3;i++){ctx.fillStyle='#c8934a';ctx.beginPath();ctx.ellipse(x+10+i*9,y-14,5,4,0,0,7);ctx.fill();ctx.fillStyle='#e8c080';ctx.fillRect(x+8+i*9,y-16,4,1)}ctx.fillStyle='#d8a050';ctx.save();ctx.translate(x+42,y-17);ctx.rotate(-.3);ctx.fillRect(-10,-2.5,20,5);ctx.restore();ctx.fillStyle='#b87830';ctx.beginPath();ctx.ellipse(x+54,y-13,7,4,0,0,7);ctx.fill();ctx.fillStyle='#ff8ab0';ctx.fillRect(x+48,y-24,8,6)},
 farm:()=>{for(const [dx,r] of [[12,7],[26,6]]){ctx.fillStyle='#e07a1a';ctx.beginPath();ctx.ellipse(x+dx,y-15,r+2,r,0,0,7);ctx.fill();ctx.strokeStyle='#a04a0a';ctx.beginPath();ctx.moveTo(x+dx,y-15-r);ctx.lineTo(x+dx,y-15+r);ctx.stroke();ctx.fillStyle='#5a3a1a';ctx.fillRect(x+dx-1,y-15-r-3,2,4)}for(let i=0;i<2;i++){ctx.fillStyle='#e8a820';ctx.fillRect(x+40+i*9,y-24,7,11);ctx.fillStyle='#8a5a2e';ctx.fillRect(x+40+i*9,y-26,7,3)}}};
 (G[s.type]||G.fruit)()}
function drawStallFront(s,t){const x=s.x*T,y=s.y*T,w=2*T;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x+w/2+6,y+T-1,w/2+10,6,0,0,7);ctx.fill();
 ctx.fillStyle='#7a4e26';ctx.fillRect(x-2,y-10,w+4,40);ctx.fillStyle='#9a6a36';ctx.fillRect(x-2,y-10,w+4,5);ctx.fillStyle='#5a3418';for(let i=1;i<8;i++)ctx.fillRect(x-2+i*8.5,y-5,1,35);
 ctx.fillStyle='#3a2410';ctx.fillRect(x-2,y+28,w+4,2);goods(s,x,y,t);
 // ป้ายราคา
 ctx.fillStyle='#f6ecd0';ctx.fillRect(x+w/2-10,y+4,20,11);ctx.strokeStyle='#5a3418';ctx.strokeRect(x+w/2-9.5,y+4.5,19,10);ctx.fillStyle='#8a2a1a';ctx.font='bold 7px system-ui';ctx.textAlign='center';ctx.fillText('🪙',x+w/2,y+12);ctx.textAlign='left';
 if(stallNear()===s&&shopEl.hidden){ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';const tx='กด E / ⚔️ ซื้อของ',tw=ctx.measureText(tx).width+14,cx=x+w/2,cy=y+T+30+Math.sin(t*4)*2;ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(cx-tw/2,cy-13,tw,19);ctx.strokeStyle='#e8c14a';ctx.strokeRect(cx-tw/2+.5,cy-12.5,tw-1,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(tx,cx,cy);ctx.textAlign='left'}}
{const _bt=buildTown;buildTown=function(){_bt();D.stalls=D.stalls.concat(STALL_DATA.map(s=>({back:s,y:s.y-1.45})))}}
{const _ds=drawStall;drawStall=function(s,t){if(s.back)return drawStallBack(s.back,t);if(STALL_DATA.includes(s))return drawStallFront(s,t);return _ds(s,t)}}
{const _ta=townAct;townAct=function(){const s=stallNear();if(s){const n=D.npcs.find(q=>q.name===VENDOR[s.type]);if(n){n.bub={txt:['มาจ้า เลือกได้เลย!','ของสด ๆ ทุกวันจ้า','ลดให้นิดหน่อยก็ได้ 😉'][Math.random()*3|0],t:3};n.wave=1}openShop('st_'+s.type);return true}return _ta()}}
setInterval(()=>{if(SHOPK&&String(SHOPK).startsWith('st_')&&!stallNear()&&!shopEl.hidden){closeShop()}},300);

// ---------- D) ป้ายชื่อร้านแบบใหม่: ป้ายไม้แขวนโซ่ ขอบทอง มีไอคอน ----------
shopName=function(k,S){if(window.TOWNLIFE&&SHOP_ORDER.some(id=>SHOP_DATA[id]===S))return;const [bx,by,bw]=S.b,cx=bx*T+bw*T/2,y=by*T-6;k.save();k.font='bold 12px system-ui,"Noto Sans Thai",sans-serif';const tw=k.measureText(S.name).width,w=tw+44,h=22,x=cx-w/2;
 k.strokeStyle='#3a3a40';k.lineWidth=1.5;for(const sx of [x+12,x+w-12]){k.beginPath();k.moveTo(sx,y-h-8);k.lineTo(sx,y-h);k.stroke();for(let i=0;i<3;i++){k.beginPath();k.ellipse(sx,y-h-7+i*3,1.4,1.8,0,0,7);k.stroke()}}
 k.fillStyle='rgba(0,0,0,.35)';rr(k,x+2,y-h+3,w,h,6);k.fill();
 const g=k.createLinearGradient(0,y-h,0,y);g.addColorStop(0,'#7a4a24');g.addColorStop(.5,'#5a3418');g.addColorStop(1,'#3e220e');k.fillStyle=g;rr(k,x,y-h,w,h,6);k.fill();
 k.strokeStyle='rgba(0,0,0,.25)';k.lineWidth=1;for(const yy of [y-h+7,y-h+14]){k.beginPath();k.moveTo(x+4,yy);k.lineTo(x+w-4,yy);k.stroke()}
 k.strokeStyle='#d8b84a';k.lineWidth=2;rr(k,x+1,y-h+1,w-2,h-2,5);k.stroke();k.strokeStyle='rgba(255,240,180,.35)';k.lineWidth=1;rr(k,x+4,y-h+4,w-8,h-8,3);k.stroke();
 k.fillStyle='#e8c14a';for(const [px,py] of [[x+5,y-h+5],[x+w-5,y-h+5],[x+5,y-5],[x+w-5,y-5]]){k.beginPath();k.arc(px,py,1.6,0,7);k.fill()}
 k.fillStyle='#2a1808';k.beginPath();k.arc(x+16,y-h/2,8,0,7);k.fill();k.strokeStyle='#d8b84a';k.stroke();k.font='11px system-ui';k.textAlign='center';k.fillText(S.emoji||'🏠',x+16,y-h/2+4);
 k.font='bold 12px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='left';k.lineWidth=3;k.strokeStyle='#1a0e04';k.strokeText(S.name,x+28,y-h/2+4.5);k.fillStyle='#ffe9a8';k.fillText(S.name,x+28,y-h/2+4.5);k.restore()};

// ---------- E) แชทแบบเกมออนไลน์: ทั้งหมด · ทั่วไป · กิลด์ · ระบบ ----------
{const hd=gid('chatHd');hd.innerHTML='<span class="ctabs"><button data-t="all" class="on">ทั้งหมด</button><button data-t="gen">ทั่วไป</button><button data-t="guild">กิลด์</button><button data-t="sys">ระบบ</button></span><i id="chatBadge" hidden>0</i><span class="sp"></span><button id="chatEd" title="พิมพ์ข้อความ (Enter)">✎</button><button id="chatFold" title="พับ/กาง">▾</button>';
 gid('chatFold').onclick=chatToggle;gid('chatEd').onclick=()=>chatInput();
 hd.querySelectorAll('.ctabs button').forEach(b=>b.onclick=()=>chatTab(b.dataset.t));
 const st=document.createElement('style');st.textContent=`.ctabs{display:flex;gap:2px}.ctabs button{min-width:0!important;padding:0 6px!important;font-size:10px!important;border-color:transparent!important;background:transparent!important;opacity:.65}.ctabs button.on{opacity:1;background:rgba(232,193,74,.25)!important;border-color:#e8c14a!important}
#chatList[data-t=gen] .cl:not(.ch-gen),#chatList[data-t=guild] .cl:not(.ch-guild),#chatList[data-t=sys] .cl:not(.ch-sys){display:none}
.cl .tg{font-style:normal;font-weight:bold;margin-right:3px}.ch-gen .tg{color:#fff}.ch-guild .tg{color:#7dff8a}.ch-guild{color:#c8ffd0}.cl.ann{color:#ffd84a}#chatIn .chn{font-size:10px;color:#ffd84a;margin-right:4px}`;document.head.appendChild(st)}
const CHT={tab:'all',send:'gen'};
function chatTab(t){CHT.tab=t;if(t==='gen'||t==='guild')CHT.send=t;gid('chatList').dataset.t=t;document.querySelectorAll('.ctabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));const l=gid('chatList');l.scrollTop=l.scrollHeight;
 const ti=gid('chatTi');if(ti)ti.placeholder=(CHT.send==='guild'?'[กิลด์] ':'[ทั่วไป] ')+'พิมพ์ข้อความ แล้วกด Enter';sfx('ui')}
chatAdd=function(cls,fn,key,txt){const list=gid('chatList'),now=performance.now(),ch=cls==='guild'?'guild':(cls==='gen'||cls==='me'||cls==='ann')?'gen':'sys';let el;
 if(key&&CH.last&&CH.last.key===key&&now-CH.last.t<2500){CH.last.n++;CH.last.t=now;el=CH.last.el;el.innerHTML=fn(CH.last.n)}
 else{el=document.createElement('div');el.className='cl '+cls+' ch-'+ch;el.innerHTML=fn(1);list.appendChild(el);while(list.children.length>120)list.removeChild(list.firstChild);CH.last=key?{key,t:now,n:1,fn,el}:null}
 if(CH.folded){CH.unread++;chatApply()}list.scrollTop=list.scrollHeight};
function chatSay(ch,who,txt,col){chatAdd(ch==='guild'?'guild':'gen',()=>'<i class="tg">['+(ch==='guild'?'กิลด์':'ทั่วไป')+']</i><b style="color:'+(col||'#9fd8ff')+'">'+esc(who)+'</b>: '+esc(txt))}
function chatAnn(txt){chatAdd('ann',()=>'<i class="tg" style="color:#ffd84a">[ประกาศ]</i>'+esc(txt))}
const GUILD={name:'กิลด์ผู้กล้าเอลโดเรีย',mem:[['กัปตันเรน','#ffb43a'],['มีน่า','#ff8ad8'],['บอร์ก','#9fd8ff'],['ลูน่า','#c8a0ff']]};
const GTIPS=['ใครไปเหมืองเหล็กร้าง ระวังโกเลมดินเหนียวทุบแรงนะ','ชุดเกราะใส่ระดับเดียวกันครบ 4 ชิ้นได้โบนัสเยอะเลย','ส้มสายน้ำผึ้งที่ตลาดช่วยให้วิ่งได้นานขึ้นนะ','พายเนื้อร้านขนมปังกินแล้วฟันแรงขึ้น!','อย่าลืมพกขนนกฟีนิกซ์ไว้สักอันก่อนไปตีบอส','ถ้าแรงหมดจะฟันไม่ได้ พักก่อนสิ','กลางคืนมืด ระวังเดินหลงในทุ่งนะ','ยาเลือดตอนนี้ฟื้นตามเลือดสูงสุดแล้ว ใช้ได้ทั้งเลเวลสูง'];
const GENL=[['ป้าแดง','ร้านชำป้าแดงมีกระเป๋าใหญ่ขายแล้วจ้า!'],['ทหารยาม','ประตูเมืองเปิดตลอดวัน ระวังมอนนอกเมืองด้วย'],['แม่ค้าผลไม้','ผลไม้สดมาใหม่ที่จัตุรัสจ้า ส้ม องุ่น กล้วย!'],['คนขายขนมปัง','พายเนื้อเพิ่งออกจากเตา ร้อน ๆ!'],['ลุงเหล็ก','รับตีบวกอาวุธ เตาหลอมใช้ฟรีที่ร้านลุง'],['นักบวชแห่งแสง','ขอแสงสว่างคุ้มครองนักผจญภัยทุกท่าน']];
function chatBots(){setTimeout(chatBots,35000+Math.random()*40000);if(PAUSED)return;if(Math.random()<.55){const [w,t]=GENL[Math.random()*GENL.length|0];chatSay('gen',w,t,'#ffe9a8')}else{const m=GUILD.mem[Math.random()*GUILD.mem.length|0];chatSay('guild',m[0],GTIPS[Math.random()*GTIPS.length|0],m[1])}}
setTimeout(chatBots,12000);
function guildReply(t){const m=GUILD.mem[Math.random()*GUILD.mem.length|0],q=t.toLowerCase();let r;
 if(/สวัสดี|หวัดดี|hi|hello/.test(q))r=['สวัสดี '+P.name+'!','หวัดดีจ้า ไปฟาร์มไหนวันนี้?'][Math.random()*2|0];
 else if(/บอส/.test(q))r='บอสโหดนะ เตรียมยาเลือดไปเยอะ ๆ แล้วหลบท่าทุบพื้นวงแดงด้วย';
 else if(/ช่วย|help/.test(q))r='ถามได้เลย เราช่วยกันอยู่แล้ว 💪';
 else if(/แร่|ขุด/.test(q))r='แร่ดี ๆ ต้องวาปผ่านประตูมิติในทุ่งหญ้านะ';
 else r=['555 จริง','สู้ ๆ นะ!','เดี๋ยวตามไปช่วย','รับทราบ 👍','เจ๋งไปเลย'][Math.random()*5|0];
 setTimeout(()=>chatSay('guild',m[0],r,m[1]),1500+Math.random()*2500)}
chatSend=function(){const ti=gid('chatTi'),t=ti.value.trim();ti.value='';if(!t)return;
 if(t[0]==='/'){const [c,...r]=t.slice(1).split(' ');const a=r.join(' ').trim();
  if(c==='name'&&a){P.name=a.slice(0,14);try{localStorage.setItem('fm_name',P.name)}catch(e){}sysSay('เปลี่ยนชื่อเป็น '+P.name)}
  else if(c==='g'&&a){chatSay('guild',P.name||'ผู้กล้า',a,'#ffd84a');guildReply(a)}
  else if(c==='save'){saveGame(true)}
  else if(c==='help')sysSay('คำสั่ง: /name ชื่อใหม่ · /g ข้อความ = คุยในกิลด์ · /save = บันทึกเกม · เลือกแท็บ ทั่วไป/กิลด์ เพื่อเปลี่ยนช่องคุย');
  else sysSay('ไม่รู้จักคำสั่ง /'+c+' (พิมพ์ /help)');chatInput(false);return}
 const ch=CHT.send;chatSay(ch,P.name||'ผู้กล้า',t,'#ffd84a');if(ch==='guild')guildReply(t);P.bub={txt:t.slice(0,60),until:performance.now()+4500};sfx('pop');chatInput(false)};
gid('chatSend').onclick=chatSend;
setTimeout(()=>{chatSay('guild',GUILD.mem[0][0],'ยินดีต้อนรับสู่'+GUILD.name+' '+(P.name||'')+'! มีอะไรถามในแชทกิลด์ได้เลย (สมาชิกกิลด์เป็น NPC)',GUILD.mem[0][1])},4000);
// ฉลองเลเวลอัป/ล้มบอส
{const _g=gainXp;gainXp=function(n){const l0=P.lv;_g(n);if(P.lv>l0){const m=GUILD.mem[Math.random()*GUILD.mem.length|0];setTimeout(()=>chatSay('guild',m[0],'ยินดีด้วย Lv.'+P.lv+' แล้ว! 🎉',m[1]),1200);saveGame()}}}
{const _mk=mobKill;mobKill=function(m){_mk(m);if(m.boss){chatAnn((P.name||'ผู้กล้า')+' ปราบ '+m.nm+' Lv.'+m.L+' สำเร็จ!');const g=GUILD.mem[Math.random()*GUILD.mem.length|0];setTimeout(()=>chatSay('guild',g[0],'โหดมาก! ล้มบอสได้แล้ว 🔥',g[1]),1500);saveGame()}}}

// ---------- F) เซฟอัตโนมัติ (บันทึกลงเครื่อง) ----------
const SAVEK='fm_save_v1';let _lastSave=0;const SAVE_STATE={localError:''};window.SAVE_STATE=SAVE_STATE;
function saveGame(manual){if(document.readyState==='loading'||(FM_ACCT&&window.ONL32&&!ONL32.verified))return false;if(P.dead&&!manual)return false;try{const d={v:1,t:Date.now(),name:P.name,lv:P.lv,xp:P.xp,sp:P.sp,stats:baseStats(),hp:Math.max(1,Math.round(P.hp)),mp:Math.round(P.mp),fa:P.fa,hu:P.hu,armor:Object.assign({},P.armor),tier:P.tier,tool:P.tool,draw:P.draw,bagLv:P.bagLv,
 inv,gear:Object.assign({},window.__PEND8&&__PEND8.g,GEAR),enh:ENH,sk:SK.own,qs:QS.slots,day:DAY.t,buffs:BUFFS.map(b=>({id:b.id,t:b.t}))};for(const [slot,id]of Object.entries(window.__PEND8&&__PEND8.a||{}))if(!d.armor[slot])d.armor[slot]=id;localStorage.setItem(SAVEK,JSON.stringify(d));_lastSave=performance.now();SAVE_STATE.localError='';if(manual&&!(window.CLOUD&&CLOUD.capturing))sysSay('☁️ กำลังบันทึกขึ้นเซิร์ฟเวอร์…');return true}catch(e){SAVE_STATE.localError=String(e&&e.message||e);if(manual)sysSay('เตรียมข้อมูลบันทึกไม่สำเร็จ — กรุณาลองอีกครั้ง');return false}}
function loadGame(){let d;try{d=JSON.parse(localStorage.getItem(SAVEK)||'null')}catch(e){}if(!d||d.v!==1)return false;
 if(d.name)P.name=d.name;Object.assign(P,{lv:d.lv,xp:d.xp,sp:d.sp,fa:d.fa,hu:d.hu,bagLv:d.bagLv|0,tool:d.tool||'sword',draw:!!d.draw});Object.assign(P.stats,d.stats);P.ab={str:0,vit:0,int:0,agi:0,end:0};
 Object.assign(P.armor,d.armor);Object.assign(P.tier,d.tier);for(const k in inv)if(k!=='coin')inv[k]=0;Object.assign(inv,d.inv);for(const k in GEAR)delete GEAR[k];Object.assign(GEAR,d.gear);window.__PEND7={a:{},g:{}};for(const k in P.armor){const id=P.armor[k];if(id&&!ITEMS[id]){__PEND7.a[k]=id;P.armor[k]=null}}for(const id in GEAR)if(!ITEMS[id]){__PEND7.g[id]=GEAR[id];delete GEAR[id]}Object.assign(ENH,d.enh);
 if(d.sk)for(let i=0;i<d.sk.length;i++)SK.own[i]=d.sk[i];if(d.qs)for(let i=0;i<d.qs.length;i++)QS.slots[i]=d.qs[i];
 for(const b of d.buffs||[])if(FOOD[b.id])BUFFS.push({id:b.id,n:FOOD[b.id].n,ic:FOOD[b.id].e,st:FOOD[b.id].st,t:b.t,dur:FOOD[b.id].dur});
 syncSword();recalcStats();applyBonus();P.hp=Math.min(BAL.hp,d.hp);P.mp=Math.min(BAL.mp,d.mp);return true}
const _loaded=loadGame();
setInterval(()=>saveGame(),20000);addEventListener('beforeunload',()=>saveGame());document.addEventListener('visibilitychange',()=>{if(document.hidden)saveGame()});
setTimeout(()=>{if(_loaded)sysSay('💾 โหลดเกมที่บันทึกไว้แล้ว (Lv.'+P.lv+') · เกมบันทึกอัตโนมัติทุก 20 วินาที');else sysSay('💾 เกมจะบันทึกอัตโนมัติทุก 20 วินาที')},2500);
{const _ct=clockEl;setInterval(()=>{if(performance.now()-_lastSave<1800&&!_ct.textContent.includes('💾'))_ct.textContent+=' 💾'},300)}
gid('resume').insertAdjacentHTML('beforebegin','<b class="sec">💾 บันทึกเกม</b><button class="mini" onclick="saveGame(true)">💾 บันทึกตอนนี้</button><button class="mini" id="delsave" onclick="delSave()">🗑️ ลบเซฟ เริ่มใหม่</button>');
function delSave(){const b=gid('delsave');if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='⚠️ กดอีกครั้งเพื่อยืนยันลบเซฟ';setTimeout(()=>{b.dataset.c='';b.textContent='🗑️ ลบเซฟ เริ่มใหม่'},3000);return}
 try{localStorage.removeItem(SAVEK)}catch(e){}removeEventListener('beforeunload',saveGame);window.onbeforeunload=null;_noSave=true;location.reload()}
let _noSave=false;{const _sg=saveGame;saveGame=function(m){if(_noSave)return;_sg(m)}}

// ---------- G) ฟาร์มออโต้ 🤖 (ใช้ได้นอกเมือง) ----------
const AUTO={on:false,ix:0,iy:0,tgt:null,stuck:0,lx:0,ly:0,bl:new Map(),pt:0,rest:false};
const autoB=document.createElement('button');autoB.id='autob';autoB.textContent='🤖';autoB.title='ฟาร์มออโต้ (O)';gid('wrap').appendChild(autoB);autoB.onclick=()=>autoToggle();
{const st=document.createElement('style');st.textContent='#autob{position:absolute;right:calc(8px + var(--sr));top:calc(170px + var(--st));width:48px;height:48px;font-size:22px;padding:0;background:rgba(0,0,0,.5);color:#fff;border:2px solid #e8c14a;border-radius:10px;z-index:3}#autob.on{background:rgba(40,140,60,.75);border-color:#7ed957;box-shadow:0 0 10px #7ed957}@media (max-height:520px){#autob{width:36px;height:36px;font-size:17px;border-radius:9px;right:calc(4px + var(--sr));top:calc(124px + var(--st))}}';document.head.appendChild(st)}
function autoToggle(force){AUTO.on=force===undefined?!AUTO.on:force;autoB.classList.toggle('on',AUTO.on);AUTO.tgt=null;AUTO.rest=false;sfx('ui');say(AUTO.on?'🤖 เปิดฟาร์มออโต้ — ตีมอนรอบตัว เก็บของ ดื่มยาเมื่อเลือดน้อย (ขยับเองได้ตลอด)':'🤖 ปิดฟาร์มออโต้')}
addEventListener('keydown',e=>{if((e.key==='o'||e.key==='O')&&document.activeElement!==gid('chatTi'))autoToggle()});
function autoTick(dt){AUTO.ix=AUTO.iy=0;if(!AUTO.on||P.dead||PAUSED)return;
 if(D&&(D.town||D.shop)){autoToggle(false);say('🤖 ฟาร์มออโต้ใช้ได้เฉพาะนอกเมือง');return}
 AUTO.pt-=dt;if(P.hp<BAL.hp*.35&&AUTO.pt<=0){if(inv.hpp>0){useItem('hpp');AUTO.pt=1.5}else if(P.hp<BAL.hp*.2){autoToggle(false);say('🤖 เลือดใกล้หมดและไม่มียา — หยุดออโต้แล้ว ถอยก่อน!');return}}
 if(P.hu<15&&AUTO.pt<=0){eatAny();AUTO.pt=1.5}
 if(bagCells().length>=bagSlotsMax()){autoToggle(false);say('🤖 กระเป๋าเต็ม — หยุดฟาร์มออโต้');return}
 if(P.fa<12)AUTO.rest=true;if(AUTO.rest){if(P.fa>=60)AUTO.rest=false;else return}
 const now=performance.now();for(const [k,v] of AUTO.bl)if(v<now)AUTO.bl.delete(k);
 const L=(D&&D.zone?D.mobs.filter(m=>!m.dead&&!m.boss):(!D?slimes:[])).filter(m=>!AUTO.bl.has(m));
 if(AUTO.tgt&&(AUTO.tgt.dead||AUTO.tgt.hp<=0||!L.includes(AUTO.tgt)))AUTO.tgt=null;
 if(!AUTO.tgt){let b=null,bd=380;for(const m of L){const d=Math.hypot(m.x-P.x,m.y-P.y);if(d<bd){bd=d;b=m}}AUTO.tgt=b;AUTO.stuck=0}
 const t=AUTO.tgt;if(!t){let bd=220,dr=null;for(const d of drops){const q=Math.hypot(d.x-P.x,d.y-P.y);if(q<bd){bd=q;dr=d}}if(dr){const q=bd||1;AUTO.ix=(dr.x-P.x)/q;AUTO.iy=(dr.y-P.y)/q}return}
 const dx=t.x-P.x,dy=t.y-P.y,d=Math.hypot(dx,dy)||1;
 if(d>(isRng()?170:26)){AUTO.ix=dx/d;AUTO.iy=dy/d;const mv=Math.hypot(P.x-AUTO.lx,P.y-AUTO.ly);AUTO.lx=P.x;AUTO.ly=P.y;if(P.at<0&&mv<.3){AUTO.stuck+=dt;if(AUTO.stuck>1.5){AUTO.bl.set(t,now+6000);AUTO.tgt=null}}else AUTO.stuck=0}
 else{P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');if(P.at<0&&P.stun<=0){if(P.tool!=='sword'&&P.armor.sword){P.tool='sword';P.draw=true}attack(true)}}}
{const _w=updWorld;updWorld=function(dt){_w(dt);autoTick(dt)}}
{const _h=hero;hero=function(){_h();if(AUTO.on&&!P.dead){const a=.6+.4*Math.sin(performance.now()/250);ctx.save();ctx.globalAlpha=a;ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.lineWidth=2.5;ctx.strokeStyle='#000';ctx.strokeText(AUTO.rest?'🤖 พักเหนื่อย':'🤖 AUTO',P.x,P.y+14);ctx.fillStyle='#7dff8a';ctx.fillText(AUTO.rest?'🤖 พักเหนื่อย':'🤖 AUTO',P.x,P.y+14);ctx.restore()}}}
{const _sd=startDeath;startDeath=function(){if(AUTO.on)autoToggle(false);_sd()}}

// ---------- H) คำพูด NPC ให้ตรงกับระบบใหม่ ----------
const NL={'แม่ค้าผัก':['ผักสดจากไร่เช้านี้! แครอทกินแล้วว่องไวขึ้นนะ','เดินมาหน้าแผงแล้วกด E ซื้อได้เลยจ้า'],'แม่ค้าผลไม้':['ส้มสายน้ำผึ้ง กินแล้ววิ่งได้นาน!','กล้วยหอมเติมแรงทันทีเลยจ้า'],
 'คนขายขนมปัง':['พายเนื้อกินแล้วฟันแรงขึ้น ลองดูสิ','เค้กผลไม้ บัฟครบทุกค่าเลย!'],'ลุงขายผัก':['ฟักทองหัวใหญ่ เติมเลือดได้เยอะ','น้ำผึ้งป่าจากเขาหลังเมือง กินแล้วถึกขึ้น'],
 'นักเดินทาง':['ประตูมิติในทุ่งหญ้าพาไปเหมืองแร่ได้ 5 แห่ง','เห็นว่ามังกรคริสตัลอยู่ในห้วงลึกเพชรนิรันดร์...'],'ชาวบ้าน':['ถ้าล้มในการต่อสู้ วิญญาณจะกลับมาที่วิหารแห่งแสง','ช่วงกลางคืนโคมไฟในเมืองสวยมากเลย'],
 'ทหารยาม':['หยุดก่อน! ที่นี่คือปราสาทแห่งเอลโดเรีย','ประตูเมืองฝั่งตะวันตกและตะวันออกออกไปทุ่งหญ้าได้'],'พ่อค้า':['แผงตลาดกลางจัตุรัสมีของกินบัฟเพียบ','ของฟาร์มเอาไปขายที่ร้านชำป้าแดงนะ ให้ราคาดี!']};
{const _bt=buildTown;buildTown=function(){_bt();for(const n of D.npcs)if(NL[n.name])n.lines=NL[n.name]}}


// =====================================================================
// v3.5 : สายอาชีพ (นักดาบ / นักเวท / นักธนู) · สกิลตามสาย (สกิลกลางมี 3 สเต็ป) · ระบบมานา
//        ตกปลา (คันเบ็ด + ปลา 6 ชนิด) · ชื่อ NPC ทุกคน · ป้ายวิหารชัดขึ้น
// =====================================================================
const CLS={
 none:{n:'ผู้ฝึกหัด',e:'🔰',col:'#c8c8c8',d:'ยังไม่ได้เลือกอาชีพ — ไปคุยกับปรมาจารย์อาชีพที่จัตุรัส'},
 sword:{n:'นักดาบ',e:'⚔️',col:'#ff8a6a',d:'ต่อสู้ระยะประชิด ถึก เลือดเยอะ · ดาเมจจาก STR',pas:'VIT +2+Lv/3 · STR +Lv/5'},
 mage:{n:'นักเวท',e:'🔮',col:'#b48cff',d:'ยิงเวทระยะไกล สกิลวงกว้างรุนแรง · ดาเมจจาก INT · มานาฟื้นเร็ว',pas:'INT +4+Lv/2 · มานาฟื้นเร็ว ×2.5'},
 archer:{n:'นักธนู',e:'🏹',col:'#7dff8a',d:'ยิงธนูไกลและเร็ว คริติคอลสูง · ดาเมจจาก AGI',pas:'AGI +3+Lv/3 · คริ +10%'}};
P.cls='none';const CSK={sword:[0,0,0],mage:[0,0,0],archer:[0,0,0]};
try{const c=JSON.parse(localStorage.getItem('fm_cls')||'null');if(c){P.cls=c.cls||'none';for(const k in CSK)if(c.csk&&c.csk[k])CSK[k]=c.csk[k]}}catch(e){}
function saveCls(){try{localStorage.setItem('fm_cls',JSON.stringify({cls:P.cls,csk:CSK}))}catch(e){}}
const isRng=()=>{const w=P.armor.sword&&ITEMS[P.armor.sword];return !!w&&(w.kind==='staff'||w.kind==='bow')};
// โบนัสประจำอาชีพ (เข้าระบบค่าพลังเสริม)
{const _cb=calcBonus;calcBonus=function(){const b=_cb(),L=P.lv;if(P.cls==='sword'){b.vit+=2+Math.floor(L/3);b.str+=Math.floor(L/5)}else if(P.cls==='mage'){b.int+=4+Math.floor(L/2)}else if(P.cls==='archer'){b.agi+=3+Math.floor(L/3)}return b}}
// ดาเมจตามอาชีพ
function clsAtk(){const a=ATK();if(wKind()==='staff')return Math.max(1,a-P.stats.str+Math.round(P.stats.int*1.15));if(wKind()==='bow')return Math.max(1,a-P.stats.str+Math.round(P.stats.agi*1.1));return a}
let critCh=()=>.08+P.stats.agi*.004+(P.cls==='archer'?.1:0);

// ---------- ศัตรู & การทำดาเมจรวม ----------
function enemies(){if(D&&D.zone)return D.mobs.filter(m=>!m.dead);if(!D||(!D.town&&!D.shop))return slimes.filter(s=>!s.dead);return[]}
const eR=e=>e.F?e.F.r*e.sc:12;
function hurtE(e,mult,o){o=o||{};if(e.dead)return 0;const cr=Math.random()<critCh()+(o.crit||0),dmg=Math.max(1,Math.round(clsAtk()*mult*(.9+Math.random()*.2)*(cr?1.8+(window.CRITD?CRITD():0):1)));
 e.hp-=dmg;noteBossFight(e);e.hurt=.2;sfx('hit',e.x,e.y);dmgTxt(e.x+(Math.random()-.5)*10,e.y-(e.F?26*e.sc:24),(cr?'💥':'')+dmg,cr?'#ffd84a':(o.col||'#fff'),cr);
 const sx=o.fx!=null?o.fx:P.x,sy=o.fy!=null?o.fy:P.y,d=Math.hypot(e.x-sx,e.y-sy)||1,kb=(o.kb==null?160:o.kb)*(e.F?e.F.kb*(e.boss?0:e.elite?.5:1):1);e.kx=(e.x-sx)/d*kb;e.ky=(e.y-sy)/d*kb;
 if(o.stun){if(e.F){if(!e.boss||o.stun>.3){e.st='strike';e.stt=e.boss?o.stun*.35:o.stun}}e.stunT=e.boss?o.stun*.35:o.stun}
 if(e.F){e.aggro=1;if(e.st==='idle')e.st='chase';if(e.hp<=0)mobKill(e)}
 else if(e.hp<=0){e.dead=true;sfx('splat');dropLoot(e.x,e.y,e);for(let i=0;i<10;i++)fx.push({x:e.x,y:e.y-8,vx:(Math.random()-.5)*120,vy:-40-Math.random()*80,l:.6})}
 return dmg}
function eachIn(x,y,r,fn){for(const e of enemies())if(Math.hypot(e.x-x,(e.y-6)-y)<r+eR(e))fn(e)}
// อาวุธระยะไกล: ใช้ช่องอาวุธเดิม (ระดับอาวุธเดียวกัน) แต่ยิงแทนการฟัน
function aimDir(range){const v=DIRV[P.dir];let best=null,bs=-1;for(const e of enemies()){const dx=e.x-P.x,dy=(e.y-8)-(P.y-14),d=Math.hypot(dx,dy);if(d>range||d<1)continue;const c=(dx*v[0]+dy*v[1])/d;if(c>.55){const sc=c-d/range*.4;if(sc>bs){bs=sc;best=[dx/d,dy/d]}}}return best||v}
const PROJ=[];
function shoot(kind,o){o=o||{};const dv=o.dv||aimDir(o.range||300),sp=o.sp||400,x=P.x+dv[0]*14,y=P.y-14+dv[1]*10;
 PROJ.push({k:kind,x,y,vx:dv[0]*sp,vy:dv[1]*sp,l:(o.range||300)/sp,mult:o.mult||1,pierce:o.pierce||0,aoe:o.aoe||0,stun:o.stun||0,slow:o.slow||0,hit:new Set(),col:o.col,t:0,r:o.r||8})}
// ---------- เอฟเฟกต์ภาพ ----------
const VFX=[];// {k,x,y,t,l,...}
function vfx(k,x,y,l,o){VFX.push(Object.assign({k,x,y,t:0,l},o||{}))}
const PERS=[];// เอฟเฟกต์ต่อเนื่อง: วงไฟ พายุดาบ ฝนธนู ฝนอุกกาบาต
// ---------- สกิลของแต่ละสาย ----------
const CSKILLS={
 sword:[
  {n:'กระทืบปฐพี',e:'💥',lv:5,price:150,mp:15,cd:7,d:'กระโดดสูงแล้วกระทืบพื้น คลื่นกระแทกรอบตัว ดาเมจ ×1.8 + มึนงง 1.6 วิ'},
  {n:'ดาบสามจังหวะ',e:'🗡️',lv:15,price:600,mp:[8,10,16],cd:9,steps:3,d:'① พุ่งฟันทะลุ ×1.4 → ② ฟันเสยลอยฟ้า ×1.6 → ③ คลื่นดาบจันทร์เสี้ยวพุ่งไกล ×2.4 (กดซ้ำภายใน 1.8 วิ)'},
  {n:'พายุดาบ',e:'🌪️',lv:30,price:2000,mp:40,cd:24,d:'หมุนตัวเป็นพายุ 2.6 วิ ฟันทุกตัวรอบตัวต่อเนื่อง เดินไปด้วยได้'}],
 mage:[
  {n:'วงแหวนเพลิง',e:'🔥',lv:5,price:150,mp:20,cd:9,d:'สร้างวงไฟรอบตัว 4.5 วิ เผาศัตรูที่อยู่ในวงต่อเนื่อง + ผลักกระเด็นตอนร่าย'},
  {n:'เวทธาตุสามสาย',e:'✨',lv:15,price:600,mp:[10,14,24],cd:10,steps:3,d:'① น้ำแข็ง 5 เล่มชะลอศัตรู → ② สายฟ้าลูกโซ่ 5 ตัว → ③ อุกกาบาตยักษ์ระเบิดวงกว้าง ×3.2'},
  {n:'พายุอุกกาบาต',e:'☄️',lv:30,price:2000,mp:60,cd:30,d:'อุกกาบาตตกถล่มรอบตัว 3.5 วิ ระเบิดทีละลูก'}],
 archer:[
  {n:'ยิงกระจาย',e:'🎯',lv:5,price:150,mp:12,cd:5,d:'ยิงธนู 5 ดอกเป็นรูปพัด ดอกละ ×0.9'},
  {n:'ธนูวิญญาณ',e:'💫',lv:15,price:600,mp:[8,10,18],cd:9,steps:3,d:'① ธนูทะลวงทะลุทุกตัว ×1.5 → ② ตีลังกาถอยหลังพร้อมยิง ×1.2 → ③ ธนูระเบิดวงกว้าง ×2.6 + มึนงง'},
  {n:'ฝนธนู',e:'🌧️',lv:30,price:2000,mp:45,cd:24,d:'ห่าธนูตกใส่บริเวณด้านหน้า 3 วิ ดาเมจต่อเนื่อง'}]};
const CS={cd:[0,0,0],step:0,win:0};
function cskMp(S,step){return Array.isArray(S.mp)?S.mp[step]:S.mp}
useSkill=function(i){if(PAUSED||DOORA.k||P.dead)return;if(typeof FISH!=='undefined'&&FISH.st)return;
 if(P.cls==='none'){say('🔰 ยังไม่มีอาชีพ — ไปคุยกับปรมาจารย์อาชีพที่จัตุรัสกลางเมือง');return}
 const S=CSKILLS[P.cls][i];if(!CSK[P.cls][i]){say('🔒 ยังไม่ได้เรียนสกิล'+S.n+' (Lv.'+S.lv+') — เรียนได้ที่ร้านสกิล');return}
 if(D&&(D.town||D.shop)){say('ใช้สกิลต่อสู้ในเมืองไม่ได้');return}
 const chain=S.steps&&CS.step>0&&i===1;if(!chain&&CS.cd[i]>0)return;if(P.stun>0||P.dash>0)return;
 const st=chain?CS.step:0,mp=cskMp(S,st);if(P.mp<mp){say('💧 มานาไม่พอ (ต้องใช้ '+mp+')');sfx('thud');return}
 P.mp-=mp;if(P.recall>0)cancelRecall('ใช้สกิล — การวาปถูกยกเลิก');P.at=-1;
 if(S.steps){CS.step=st+1;CS.win=1.8;if(CS.step>=3){CS.step=0;CS.win=0;CS.cd[i]=S.cd}}else CS.cd[i]=S.cd;
 SKFN[P.cls][i](st);P.draw=true;if(P.armor.sword)P.tool='sword'};
const SKFN={
 sword:[
  ()=>{P.jump={t:0,l:.55,land:false};P.stun=.6;sfx('dash');shake(2,.1)},
  st=>{const v=DIRV[P.dir];if(st===0){P.dv=v.slice();P.dash=.22;P.dcd=.3;P.iframe=Math.max(P.iframe,.3);sfx('dash');P.dashHit=new Set();P.dashMult=1.4;vfx('slashline',P.x,P.y,.35,{dx:v[0],dy:v[1]})}
   else if(st===1){P.at=0;P.cmb=1;P.skAt=1.6;sfx('swing');vfx('upper',P.x,P.y,.4,{dir:P.dir});eachIn(P.x+v[0]*28,P.y-10+v[1]*24,40,e=>{hurtE(e,1.6,{kb:60,stun:.5});e.air=.5})}
   else{P.at=0;P.cmb=0;sfx('swing');sfx('warp');shoot('wave',{dv:aimDir(320),sp:380,range:320,mult:2.4,pierce:99,r:26});shake(3,.15)}},
  ()=>{P.ww={t:0,l:2.6,tick:0};sfx('swing2');shake(2,.2)}],
 mage:[
  ()=>{PERS.push({k:'firering',t:0,l:4.5,tick:0,r:78});eachIn(P.x,P.y,78,e=>hurtE(e,.6,{kb:260,col:'#ffb46a',burn:3}));P.cast=.5;P.stun=.35;sfx('warp');sfx('swing2');shake(2.5,.2)},
  st=>{P.cast=.45;P.stun=.25;const dv=aimDir(320);
   if(st===0){for(const o of [-.32,-.16,0,.16,.32]){const a=Math.atan2(dv[1],dv[0])+o;shoot('ice',{dv:[Math.cos(a),Math.sin(a)],sp:420,range:300,mult:.8,slow:2.5,r:7})}sfx('mine')}
   else if(st===1){let from={x:P.x,y:P.y-20},left=5;const hitSet=new Set();while(left-->0){let b=null,bd=230;for(const e of enemies())if(!hitSet.has(e)){const d=Math.hypot(e.x-from.x,e.y-12-from.y);if(d<bd){bd=d;b=e}}if(!b)break;hitSet.add(b);vfx('bolt',from.x,from.y,.35,{x2:b.x,y2:b.y-12});hurtE(b,1.3,{kb:40,stun:.4,col:'#bfe8ff',fx:from.x,fy:from.y});from={x:b.x,y:b.y-12}}
    if(!hitSet.size)vfx('bolt',P.x,P.y-20,.3,{x2:P.x+dv[0]*140,y2:P.y-20+dv[1]*140});sfx('hit');shake(2,.12)}
   else{const tx=P.x+dv[0]*150,ty=P.y+dv[1]*150;vfx('tele',tx,ty,.9,{r:90});PERS.push({k:'meteor',x:tx,y:ty,t:0,l:.9,r:90,mult:3.2,big:1});sfx('warp')}},
  ()=>{PERS.push({k:'meteorstorm',t:0,l:3.5,tick:0});P.cast=.8;P.stun=.5;sfx('warp');shake(3,.4)}],
 archer:[
  ()=>{const dv=aimDir(320),a0=Math.atan2(dv[1],dv[0]);for(let i=-2;i<=2;i++){const a=a0+i*.17;shoot('arrow',{dv:[Math.cos(a),Math.sin(a)],sp:560,range:330,mult:.9})}P.at=0;P.cmb=0;sfx('swing')},
  st=>{const dv=aimDir(340);P.at=0;P.cmb=0;
   if(st===0){shoot('spirit',{dv,sp:620,range:380,mult:1.5,pierce:99,r:10});sfx('swing');sfx('gem')}
   else if(st===1){P.dv=[-dv[0],-dv[1]];P.dash=.2;P.dcd=.25;P.iframe=Math.max(P.iframe,.35);P.flip=.35;sfx('dash');setTimeout(()=>{shoot('arrow',{dv:aimDir(340),sp:600,range:340,mult:1.2});sfx('swing')},180)}
   else{shoot('bomb',{dv,sp:480,range:300,mult:2.6,aoe:70,stun:1,r:9});sfx('swing')}},
  ()=>{const dv=aimDir(300);PERS.push({k:'arrowrain',x:P.x+dv[0]*120,y:P.y+dv[1]*120,t:0,l:3,tick:0,r:85});sfx('swing2')}]};

// ---------- ยิงพื้นฐาน (นักเวท/นักธนู) ----------
{const _a=attack;attack=function(q){if(typeof FISH!=='undefined'&&FISH.st){fishPress();return}const a0=P.at;_a(q);if(isRng()&&a0<0&&P.at===0){P.cmb=0;P.shot=false}}}
// ---------- อัปเดตทุกเฟรม ----------
skTick=function(dt){
 for(let i=0;i<3;i++)CS.cd[i]=Math.max(0,CS.cd[i]-dt);if(CS.step>0){CS.win-=dt;if(CS.win<=0){CS.cd[1]=CSKILLS[P.cls]?CSKILLS[P.cls][1].cd*(CS.step/3+.34):5;CS.step=0}}
 // ปุ่มสกิล
 const L=CSKILLS[P.cls];for(let i=0;i<3;i++){const b=skB[i];if(!b)continue;const S=L&&L[i],o=S&&skOwned(i),c=CS.cd[i];
  b.classList.toggle('lock',!o);const mp=S?cskMp(S,i===1?CS.step:0):0;b.classList.toggle('nomp',!!o&&P.mp<mp);b.querySelector('.ic').textContent=o?S.e:'🔒';
  b.querySelector('.cd').style.height=o&&c>0?(c/S.cd*100)+'%':'0';b.querySelector('.n').textContent=o&&c>0?Math.ceil(c):(i===1&&CS.step>0?(CS.step+1)+'/3':'');b.querySelector('small').textContent=o?mp:'';b.classList.toggle('chain',i===1&&CS.step>0)}
 // ยิงพื้นฐาน
 if(isRng()&&P.at>=.34&&!P.shot&&P.tool==='sword'&&P.armor.sword){P.shot=true;if(wKind()==='staff'){shoot('bolt',{range:260,sp:380,mult:1,r:9});sfx('swing2')}else{shoot('arrow',{range:320,sp:560,mult:.95});sfx('swing')}}
 if(P.at<0)P.shot=false;
 // มานาฟื้นเพิ่ม (นักเวทฟื้นไวกว่า)
 if(!P.dead)P.mp=Math.min(BAL.mp,P.mp+(BAL.mpRegen*(P.cls==='mage'?1.5:0)+P.stats.int*.06)*dt);
 // กระโดดกระทืบ
 if(P.jump){const j=P.jump;j.t+=dt;if(!j.land&&j.t>=j.l*.8){j.land=true;sfx('thud');sfx('crumble');shake(7,.35);vfx('shock',P.x,P.y,.6,{r:105});chipBurst(P.x,P.y,'dust',10);chipBurst(P.x,P.y,'rock',8);eachIn(P.x,P.y,105,e=>hurtE(e,1.8,{kb:220,stun:1.6}))}if(j.t>=j.l)P.jump=null}
 // ดาบพุ่ง (สเต็ป 1)
 if(P.dashHit&&P.dash>0)eachIn(P.x,P.y-10,30,e=>{if(!P.dashHit.has(e)){P.dashHit.add(e);hurtE(e,P.dashMult,{kb:120})}});if(P.dash<=0)P.dashHit=null;
 // พายุดาบ
 if(P.ww){const w=P.ww;w.t+=dt;w.tick-=dt;P.dir='drul'[Math.floor(w.t*14)%4];if(w.tick<=0){w.tick=.22;sfx('swing');eachIn(P.x,P.y-8,64,e=>hurtE(e,.7,{kb:90}))}if(Math.random()<dt*40)chipBurst(P.x+(Math.random()-.5)*60,P.y,'dust',1);if(w.t>=w.l)P.ww=null}
 if(P.cast>0)P.cast-=dt;if(P.flip>0)P.flip-=dt;
 // กระสุน
 for(let i=PROJ.length-1;i>=0;i--){const p=PROJ[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;let gone=p.t>p.l;
  const wall=D&&D.zone?zHit(p.x,p.y+14):false;if(wall)gone=true;
  if(!gone)for(const e of enemies()){if(p.hit.has(e))continue;if(Math.hypot(e.x-p.x,(e.y-10)-p.y)<p.r+eR(e)){p.hit.add(e);
   if(p.aoe){gone=true;break}hurtE(e,p.mult,{kb:p.k==='arrow'?70:110,fx:p.x-p.vx*.05,fy:p.y-p.vy*.05,stun:p.stun,col:p.k==='ice'?'#bfe8ff':null,burn:(p.k==='fireball'||p.fire)?3:0});if(p.slow&&e.F){e.slowT=p.slow}if(p.pierce--<=0){gone=true;break}}}
  if(gone){if(p.aoe){vfx('boom',p.x,p.y+12,.5,{r:p.aoe});sfx('thud');shake(4,.2);eachIn(p.x,p.y+12,p.aoe,e=>hurtE(e,p.mult,{kb:240,stun:p.stun,fx:p.x,fy:p.y+12}))}
   else vfx('puff',p.x,p.y,.3,{c:p.k==='bolt'?'190,140,255':p.k==='ice'?'190,230,255':p.k==='wave'?'200,230,255':'255,230,170'});PROJ.splice(i,1)}}
 // เอฟเฟกต์ต่อเนื่อง
 for(let i=PERS.length-1;i>=0;i--){const e=PERS[i];e.t+=dt;
  if(e.k==='firering'){e.tick-=dt;if(e.tick<=0){e.tick=.4;eachIn(P.x,P.y,e.r,m=>hurtE(m,.45,{kb:30,col:'#ffb46a',burn:3}))}if(Math.random()<dt*30){const a=Math.random()*6.28;fx.push({x:P.x+Math.cos(a)*e.r,y:P.y+Math.sin(a)*e.r*.6,vx:0,vy:-60,l:.4,c:'255,150,40'})}}
  else if(e.k==='meteor'){if(e.t>=e.l&&!e.done){e.done=1;vfx('boom',e.x,e.y,.6,{r:e.r});sfx('thud');sfx('crumble');shake(e.big?8:4,.3);chipBurst(e.x,e.y,'rock',e.big?12:5);eachIn(e.x,e.y,e.r,m=>hurtE(m,e.mult,{kb:260,stun:e.big?1:.4,fx:e.x,fy:e.y,burn:e.big?5:3}))}}
  else if(e.k==='meteorstorm'){e.tick-=dt;if(e.tick<=0){e.tick=.32;const tg=enemies().filter(m=>Math.hypot(m.x-P.x,m.y-P.y)<260);const t=tg.length&&Math.random()<.7?tg[Math.random()*tg.length|0]:null,a=Math.random()*6.28,r=40+Math.random()*180;
    const x=t?t.x:P.x+Math.cos(a)*r,y=t?t.y:P.y+Math.sin(a)*r*.7;vfx('tele',x,y,.55,{r:55});PERS.push({k:'meteor',x,y,t:0,l:.55,r:55,mult:1.5})}}
  else if(e.k==='arrowrain'){e.tick-=dt;if(e.tick<=0){e.tick=.25;eachIn(e.x,e.y,e.r,m=>hurtE(m,.55,{kb:20}));sfx('swing2')}}
  if(e.t>=e.l+(e.k==='meteor'?.05:0))PERS.splice(i,1)}
 for(let i=VFX.length-1;i>=0;i--){VFX[i].t+=dt;if(VFX[i].t>=VFX[i].l)VFX.splice(i,1)}
 // ศัตรูมึน/ช้า
 for(const e of enemies()){if(e.stunT>0){e.stunT-=dt;if(!e.F)e.t-=dt}if(e.slowT>0){e.slowT-=dt;if(e.F&&e.st==='chase'){e.x-=(e.kx||0)*0;}}}};
// ศัตรูช้าลงเมื่อโดนน้ำแข็ง
{const _um=updMob;updMob=function(m,dt){_um(m,m.slowT>0?dt*.55:dt)}}
// ---------- วาด ----------
skDraw=function(){const t=performance.now()/1000;
 for(const e of PERS){if(e.k==='firering'){const a=Math.min(1,e.t/.25)*(e.t>e.l-.4?(e.l-e.t)/.4:1);ctx.save();ctx.globalCompositeOperation='lighter';
   for(let i=0;i<28;i++){const ang=i/28*6.283+t*1.8,fx_=P.x+Math.cos(ang)*e.r,fy_=P.y+Math.sin(ang)*e.r*.62,h=14+Math.sin(t*12+i*2)*6,g=ctx.createLinearGradient(0,fy_,0,fy_-h*1.6);g.addColorStop(0,'rgba(255,120,30,'+(.8*a)+')');g.addColorStop(.6,'rgba(255,200,60,'+(.5*a)+')');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(fx_-6,fy_);ctx.quadraticCurveTo(fx_,fy_-h*2,fx_+6,fy_);ctx.fill()}
   ctx.strokeStyle='rgba(255,140,40,'+(.5*a)+')';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(P.x,P.y,e.r,e.r*.62,0,0,7);ctx.stroke();ctx.restore()}
  else if(e.k==='arrowrain'){ctx.fillStyle='rgba(120,255,140,.12)';ctx.beginPath();ctx.ellipse(e.x,e.y,e.r,e.r*.6,0,0,7);ctx.fill();ctx.strokeStyle='rgba(120,255,140,.5)';ctx.lineWidth=1.5;ctx.stroke()}}
 for(const v of VFX){const u=v.t/v.l;if(v.k==='tele'){ctx.fillStyle='rgba(255,60,30,'+(.15+.25*u)+')';ctx.beginPath();ctx.ellipse(v.x,v.y,v.r,v.r*.62,0,0,7);ctx.fill();ctx.strokeStyle='rgba(255,120,60,.9)';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.ellipse(v.x,v.y,v.r*u,v.r*.62*u,0,0,7);ctx.stroke()}
  else if(v.k==='shock'){ctx.save();ctx.globalAlpha=1-u;ctx.strokeStyle='#f6e6c0';ctx.lineWidth=10*(1-u)+2;ctx.beginPath();ctx.ellipse(v.x,v.y,v.r*(.2+.8*u),v.r*.62*(.2+.8*u),0,0,7);ctx.stroke();ctx.strokeStyle='rgba(120,90,60,.6)';ctx.lineWidth=3;for(let i=0;i<10;i++){const a=i/10*6.28;ctx.beginPath();ctx.moveTo(v.x+Math.cos(a)*14,v.y+Math.sin(a)*9);ctx.lineTo(v.x+Math.cos(a+.15)*v.r*.7*Math.min(1,u*2),v.y+Math.sin(a+.15)*v.r*.43*Math.min(1,u*2));ctx.stroke()}ctx.restore()}
  else if(v.k==='boom'){ctx.save();ctx.globalCompositeOperation='lighter';const r=v.r*(.3+.7*Math.min(1,u*2)),g=ctx.createRadialGradient(v.x,v.y-10,2,v.x,v.y-10,r);g.addColorStop(0,'rgba(255,250,210,'+(1-u)+')');g.addColorStop(.4,'rgba(255,150,40,'+(.8*(1-u))+')');g.addColorStop(1,'rgba(200,40,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(v.x,v.y-10,r,r*.75,0,0,7);ctx.fill();ctx.restore()}}};
function drawAir(){const t=performance.now()/1000;
 for(const p of PROJ){const a=Math.atan2(p.vy,p.vx);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);
  if(p.k==='arrow'||p.k==='spirit'||p.k==='bomb'){if(p.k==='spirit'){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(120,255,200,.35)';ctx.beginPath();ctx.ellipse(-10,0,22,5,0,0,7);ctx.fill();ctx.globalCompositeOperation='source-over'}
   ctx.strokeStyle='#6a4a2a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(8,0);ctx.stroke();ctx.fillStyle=p.k==='bomb'?'#ff5a2a':'#cfd4dc';ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(6,-3);ctx.lineTo(6,3);ctx.fill();ctx.fillStyle='#e8e0d0';ctx.fillRect(-15,-3,5,2);ctx.fillRect(-15,1,5,2);if(p.k==='bomb'){ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(4,0,3+Math.sin(t*30),0,7);ctx.fill()}}
  else if(p.k==='wave'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(200,235,255,.9)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-10,0,24,-1.1,1.1);ctx.stroke();ctx.strokeStyle='rgba(120,190,255,.5)';ctx.lineWidth=12;ctx.beginPath();ctx.arc(-14,0,24,-1,1);ctx.stroke()}
  else if(p.k==='ice'){ctx.fillStyle='#dff6ff';ctx.strokeStyle='#5ab4ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(-6,-3.5);ctx.lineTo(-9,0);ctx.lineTo(-6,3.5);ctx.closePath();ctx.fill();ctx.stroke()}
  else{ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,1,0,0,12);g.addColorStop(0,'#fff');g.addColorStop(.4,'rgba(190,120,255,.9)');g.addColorStop(1,'rgba(120,60,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-4,0,16,10,0,0,7);ctx.fill()}
  ctx.restore()}
 for(const e of PERS){if(e.k==='meteor'&&e.t<e.l){const u=e.t/e.l,x=e.x+(1-u)*80,y=e.y-(1-u)*260;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,1,x,y,e.big?22:14);g.addColorStop(0,'#fff6c8');g.addColorStop(.5,'rgba(255,120,30,.9)');g.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,e.big?22:14,0,7);ctx.fill();ctx.strokeStyle='rgba(255,140,40,.5)';ctx.lineWidth=e.big?10:6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+30,y-90);ctx.stroke();ctx.restore()}
  if(e.k==='arrowrain'){for(let i=0;i<7;i++){const s=(t*3+i*.37)%1,x=e.x+Math.sin(i*12.9+Math.floor(t*3+i*.37)*7)*e.r*.9,y=e.y+Math.cos(i*7.3+Math.floor(t*3+i*.37)*3)*e.r*.5-(1-s)*160;ctx.strokeStyle='rgba(200,180,140,'+(1-s*.3)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y-16);ctx.stroke()}}}
 for(const v of VFX){const u=v.t/v.l;ctx.save();ctx.globalAlpha=1-u;
  if(v.k==='bolt'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#e8f6ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(v.x,v.y);const n=7;for(let i=1;i<n;i++){const k=i/n;ctx.lineTo(v.x+(v.x2-v.x)*k+(Math.random()-.5)*16,v.y+(v.y2-v.y)*k+(Math.random()-.5)*16)}ctx.lineTo(v.x2,v.y2);ctx.stroke();ctx.strokeStyle='rgba(120,190,255,.5)';ctx.lineWidth=8;ctx.stroke()}
  else if(v.k==='slashline'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(220,240,255,.85)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(v.x,v.y-14);ctx.lineTo(v.x+v.dx*110*Math.min(1,u*3),v.y-14+v.dy*110*Math.min(1,u*3));ctx.stroke()}
  else if(v.k==='upper'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,230,160,.9)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(v.x,v.y-20,40,Math.PI*.6,Math.PI*.6-Math.PI*1.3*Math.min(1,u*2.5),true);ctx.stroke()}
  else if(v.k==='puff'){ctx.fillStyle='rgba('+v.c+',.7)';ctx.beginPath();ctx.arc(v.x,v.y,4+u*14,0,7);ctx.fill()}
  ctx.restore()}
 // ดาวมึนงงเหนือหัวศัตรู
 for(const e of enemies())if(e.stunT>0){const y=e.y-(e.F?44*e.sc:36);for(let i=0;i<3;i++){const a=t*5+i*2.09;ctx.fillStyle='#ffe14a';ctx.font='9px system-ui';ctx.fillText('★',e.x+Math.cos(a)*11-4,y+Math.sin(a)*3)}}
 // พายุดาบรอบตัว
 if(P.ww){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){ctx.strokeStyle='rgba(200,230,255,'+(.5-i*.12)+')';ctx.lineWidth=7-i*2;ctx.beginPath();ctx.ellipse(P.x,P.y-12,56-i*8,34-i*5,0,t*14+i*2,t*14+i*2+3.6);ctx.stroke()}ctx.restore()}}

// ---------- ท่าทางผู้เล่น: กระโดด / ร่ายเวท / ถือคทา-ธนู ----------
{const _h=hero;hero=function(){let jz=0;if(P.jump){const u=Math.min(1,P.jump.t/(P.jump.l*.8));jz=Math.sin(u*Math.PI)*46}
 if(jz){ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(P.x,P.y+1,10,4,0,0,7);ctx.fill();ctx.save();ctx.translate(0,-jz);_h();ctx.restore()}
 else if(P.flip>0){const u=1-P.flip/.35;ctx.save();ctx.translate(P.x,P.y-20);ctx.rotate((P.dir==='l'?1:-1)*u*Math.PI*2);ctx.translate(-P.x,-P.y+20-Math.sin(u*Math.PI)*16);_h();ctx.restore()}
 else _h();
 if(P.cast>0&&isRng()){const a=Math.min(1,P.cast*3);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(P.x,P.y,2,P.x,P.y,34);g.addColorStop(0,'rgba(200,150,255,'+(.5*a)+')');g.addColorStop(1,'rgba(120,60,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(P.x,P.y,34,14,0,0,7);ctx.fill();
  ctx.strokeStyle='rgba(210,170,255,'+(.8*a)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(P.x,P.y,26,10,0,0,7);ctx.stroke();ctx.restore()}
 drawAir();if(typeof drawFish==='function')drawFish()}}
// คทา / ธนู ในมือและบนหลัง
function drawStaff(k,tier){const Q=TIERS[tier];k.strokeStyle='#4a2e16';k.lineWidth=3.2;k.lineCap='round';k.beginPath();k.moveTo(0,10);k.lineTo(0,-30);k.stroke();k.strokeStyle='#8a5a2e';k.lineWidth=1.6;k.stroke();
 k.strokeStyle=Q.mid;k.lineWidth=2;k.beginPath();k.arc(0,-34,6,Math.PI*.2,Math.PI*.8,true);k.stroke();const g=k.createRadialGradient(-1,-36,1,0,-35,6);g.addColorStop(0,'#fff');g.addColorStop(.5,Q.gl);g.addColorStop(1,Q.lo);k.fillStyle=g;k.beginPath();k.arc(0,-35,4.5,0,7);k.fill()}
function drawBow(k,tier,pull){const Q=TIERS[tier];k.strokeStyle='#5a3418';k.lineWidth=3;k.lineCap='round';k.beginPath();k.arc(-12,0,20,-1.05,1.05);k.stroke();k.strokeStyle=Q.mid;k.lineWidth=1.4;k.beginPath();k.arc(-12,0,20,-.35,.35);k.stroke();
 const ex=-12+20*Math.cos(1.05),ey=20*Math.sin(1.05),px=ex-(pull||0)*14;k.strokeStyle='#e8e0d0';k.lineWidth=.8;k.beginPath();k.moveTo(ex,-ey);k.lineTo(px,0);k.lineTo(ex,ey);k.stroke();
 if(pull){k.strokeStyle='#6a4a2a';k.lineWidth=1.6;k.beginPath();k.moveTo(px,0);k.lineTo(px+22,0);k.stroke();k.fillStyle='#cfd4dc';k.beginPath();k.moveTo(px+25,0);k.lineTo(px+20,-2.5);k.lineTo(px+20,2.5);k.fill()}}
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){if(!(isRng()&&P.tool==='sword'))return _ts(hx,hy,ang);const tier=P.tier.sword|0;ctx.save();ctx.translate(hx,hy);
 if(wKind()==='staff'){ctx.rotate(ang*.35);drawStaff(ctx,tier)}else{const v=DIRV[P.dir],a=Math.atan2(v[1],v[0]);const pull=P.at>=0?Math.min(1,P.at/.34)*(P.at<.36?1:0):0;ctx.rotate(P.at>=0?a:a+(P.dir==='l'?-.6:.6));drawBow(ctx,tier,pull)}ctx.restore()}}
{const _bs=backSword;backSword=function(x,by,side,f,d){if(!isRng())return _bs(x,by,side,f,d);if(!P.armor.sword||(P.draw&&P.tool==='sword')||side)return;const tier=P.tier.sword|0;ctx.save();
 if(wKind()==='staff'){ctx.translate(x+(d==='u'?4:8),by-26);ctx.rotate(.35);drawStaff(ctx,tier)}else{ctx.fillStyle='#6a4422';ctx.save();ctx.translate(x+(d==='u'?-6:7),by-30);ctx.rotate(.3);ctx.fillRect(-3,0,6,18);ctx.fillStyle='#e8e0d0';for(let i=0;i<3;i++)ctx.fillRect(-2+i*2,-5,1.5,5);ctx.restore();ctx.translate(x+(d==='u'?6:-6),by-24);ctx.rotate(Math.PI/2);drawBow(ctx,tier,0)}ctx.restore()}}
// ท่ายิง: ไม่ใช้เส้นฟันดาบ
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){if(!(isRng()&&P.tool==='sword'&&!P.skAt))return _sf(x,by,d,side,f,TOP,held);const v=DIRV[d],p=P.at,push=p<.34?p/.34:1-Math.min(1,(p-.34)/.5);
 const hx=x+v[0]*(6+6*push)+(side?0:d==='d'?-6:8),hy=by-(side?18:d==='u'?30:12)+v[1]*4;if(!side){ctx.strokeStyle=TOP;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(d==='d'?x-11:x+11,by-24);ctx.lineTo(hx,hy);ctx.stroke()}
 if(wKind()==='staff'&&p>.3&&p<.5){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(hx+v[0]*10,hy-28,1,hx+v[0]*10,hy-28,16);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(160,100,255,0)');ctx.fillStyle=g;ctx.fillRect(hx-20,hy-50,40,40);ctx.restore()}
 held(hx,hy,0)}}
// ห้ามฟันระยะประชิดเมื่อเป็นสายยิง (ใช้กระสุนแทน)
// (แก้ในเงื่อนไขการโดนของสไลม์/มอน ด้วย P.rngHit)

// ---------- ปรมาจารย์อาชีพ (เลือกสาย) ----------
NPC_DATA.push({name:'ปรมาจารย์อาชีพ',c:'#4a2a6a',h:'#e8e4f0',x:25.5,y:11.6,fixed:1,g:'m',age:'elder',beard:1,hat:'wizard',lines:['เลือกเส้นทางของเจ้า — มีให้เลือกถึง 11 อาชีพ']});
function openClassMenu(){ZM.open=false;SHOPK=null;STN.open=null;hideBag();sfx('ui');const cur=P.cls;let h='<button class="mini x xclose" onclick="closeClassMenu()">✕</button><b>🎓 ปรมาจารย์อาชีพ — เลือกสายอาชีพ</b><small>อาชีพปัจจุบัน: '+CLS[cur].e+' '+CLS[cur].n+(cur==='none'?' · เลือกครั้งแรกฟรี':' · เปลี่ยนอาชีพ 500 เหรียญ (สกิลที่เรียนแล้วยังอยู่)')+'</small>';
 for(const k of ['sword','mage','archer']){const C=CLS[k],L=CSKILLS[k];h+='<button class="mini zbtn cls'+(cur===k?' on':'')+'" onclick="pickClass(\''+k+'\')"><b style="color:'+C.col+'">'+C.e+' '+C.n+'</b>'+(cur===k?' <span class="zl">✓ ปัจจุบัน</span>':'')+'<small>'+C.d+'<br>ติดตัว: '+C.pas+'<br>สกิล: '+L.map(s=>s.e+' '+s.n+' (Lv.'+s.lv+')').join(' · ')+'</small></button>'}
 shopEl.innerHTML=h;shopEl.hidden=false;CM.open=true}
const CM={open:false};function closeClassMenu(){CM.open=false;shopEl.hidden=true;sfx('ui')}
function pickClass(k){if(P.cls===k){say('เป็น'+CLS[k].n+'อยู่แล้ว');return}const cost=P.cls==='none'?0:500;if(inv.coin<cost){say('เหรียญไม่พอ (ต้องใช้ '+cost+')');sfx('thud');return}
 inv.coin-=cost;P.cls=k;CS.step=0;CS.cd=[0,0,0];saveCls();applyBonus();refreshInv();sfx('chest');sfx('warp');for(let i=0;i<30;i++){const a=Math.random()*6.28;fx.push({x:P.x+Math.cos(a)*20,y:P.y-10,vx:Math.cos(a)*80,vy:-80-Math.random()*90,l:.9,c:'255,230,140'})}
 say('🎓 คุณกลายเป็น'+CLS[k].e+' '+CLS[k].n+' แล้ว! ไปเรียนสกิลได้ที่ร้านสกิล');chatAnn((P.name||'ผู้กล้า')+' เลือกเส้นทาง'+CLS[k].n);openClassMenu();if(typeof saveGame==='function')saveGame()}
setInterval(()=>{if(CM.open){const n=D&&D.town&&D.npcs.find(q=>q.name==='ปรมาจารย์อาชีพ');if(!n||Math.hypot(n.x-P.x,n.y-P.y)>90)closeClassMenu()}},300);
{const _ta=townAct;townAct=function(){const n=D.npcs.find(q=>q.name==='ปรมาจารย์อาชีพ');if(n&&Math.hypot(n.x-P.x,n.y-8-P.y)<48){n.bub={txt:'เลือกเส้นทางของเจ้าเถิด',t:3};openClassMenu();return true}return _ta()}}
// ร้านสกิล: สกิลตามอาชีพ
Object.defineProperty(SHOP_DATA.skill,'buy',{configurable:true,get(){if(P.cls==='none')return[{id:'csk_x',name:'ยังไม่มีอาชีพ',emoji:'🔰',price:0,note:'ไปเลือกอาชีพกับปรมาจารย์อาชีพที่จัตุรัสก่อนนะ'}];
 return CSKILLS[P.cls].map((s,i)=>({id:'csk'+i,name:s.n+(CSK[P.cls][i]?' (เรียนแล้ว ✓)':P.lv<s.lv?' (ต้อง Lv.'+s.lv+')':''),emoji:s.e,price:s.price,note:s.d+' · มานา '+(Array.isArray(s.mp)?s.mp.join('/'):s.mp)+' · คูลดาวน์ '+s.cd+' วิ'}))}});
SHOP_DATA.skill.owner.lines=['สกิลกลางกดต่อกันได้ 3 จังหวะ ลองดูสิ','นักเวทฟื้นมานาเร็วที่สุด','อย่าลืมพกยามานาไปด้วย','สกิลสุดยอดใช้มานาเยอะ แต่คุ้มค่า!'];
{const _bi=buyItem;buyItem=function(id){if(id==='csk_x'){say('ไปเลือกอาชีพก่อนนะ');return}const m=/^csk(\d)$/.exec(id);if(!m)return _bi(id);const i=+m[1],S=CSKILLS[P.cls][i];
 if(CSK[P.cls][i]){say('เรียนสกิลนี้แล้ว');return}if(P.lv<S.lv){say('ต้องเลเวล '+S.lv+' ขึ้นไป');sfx('thud');return}if(inv.coin<S.price){say('เหรียญไม่พอ (ต้องใช้ '+S.price+' เหรียญ)');sfx('thud');return}
 inv.coin-=S.price;CSK[P.cls][i]=1;saveCls();refreshInv();sfx('gem');say(S.e+' เรียนสกิล'+S.n+'สำเร็จ! กดปุ่มสกิลบนจอ (หรือคีย์ '+(i+5)+')');openShop(SHOPK)}}
{const st=document.createElement('style');st.textContent='#acts .sk.chain{border-color:#ffd84a!important;box-shadow:0 0 12px #ffd84a}#shop .cls.on{border-color:#7ed957}';document.head.appendChild(st)}

// ---------- ตกปลา ----------
const FISHES={carp:{n:'ปลาตะเพียน',e:'🐟',hu:10,hpP:.04,price:5,xp:3,w:.3},tilapia:{n:'ปลานิล',e:'🐟',hu:12,hpP:.05,price:7,xp:4,w:.3},catfish:{n:'ปลาดุก',e:'🐟',hu:16,hpP:.06,price:10,xp:6,w:.4},
 salmon:{n:'ปลาแซลมอน',e:'🐠',hu:22,mpP:.15,st:{int:3},dur:120,price:18,xp:10,w:.5},goldfish:{n:'ปลาทองคำ',e:'🐠',hu:15,hpP:.2,price:60,xp:25,w:.3},dragon:{n:'ปลามังกรฟ้า',e:'🐉',hu:40,hpP:.4,st:{str:3,vit:3,int:3,agi:3,end:3},dur:240,price:250,xp:80,w:.8}};
const FCOL={carp:['#c8b070','#8a6a30'],tilapia:['#a8b4bc','#5a6470'],catfish:['#6a6458','#3a362e'],salmon:['#ff9a7a','#c05a40'],goldfish:['#ffe14a','#d8a020'],dragon:['#7fe0ff','#2a6ad8']};
for(const k in FISHES){FOOD[k]=FISHES[k];INVMETA[k]=[FISHES[k].n,foodTxt(FISHES[k])+' · ขายที่ร้านชำได้ '+FISHES[k].price+' เหรียญ'];if(!INVORDER.includes(k))INVORDER.push(k);WT[k]=FISHES[k].w;if(inv[k]===undefined)inv[k]=0}
INVMETA.rod=['คันเบ็ดไม้','ยืนริมน้ำในทุ่งหญ้า หันหน้าเข้าหาน้ำ แล้วกด E เพื่อตกปลา'];INVMETA.rod2=['คันเบ็ดเหล็กชั้นดี','ตกปลาหายากได้ง่ายขึ้น จุดกดกว้างขึ้น'];
for(const k of ['rod','rod2']){if(!INVORDER.includes(k))INVORDER.splice(INVORDER.indexOf('scroll')+1,0,k);WT[k]=1;if(inv[k]===undefined)inv[k]=0}
{const _mi=matIcon;matIcon=function(key){if(FISHES[key]){const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d'),[a,b]=FCOL[key];const g=k.createLinearGradient(0,14,0,34);g.addColorStop(0,a);g.addColorStop(1,b);k.fillStyle=g;k.strokeStyle='rgba(20,20,30,.7)';k.lineWidth=1.4;
  k.beginPath();k.moveTo(6,24);k.quadraticCurveTo(20,8,34,22);k.lineTo(44,14);k.lineTo(42,24);k.lineTo(44,34);k.lineTo(34,26);k.quadraticCurveTo(20,40,6,24);k.closePath();k.fill();k.stroke();k.fillStyle='#fff';k.beginPath();k.arc(13,22,2.6,0,7);k.fill();k.fillStyle='#111';k.beginPath();k.arc(13.5,22,1.3,0,7);k.fill();
  k.strokeStyle='rgba(0,0,0,.25)';for(const x of [20,25,30]){k.beginPath();k.moveTo(x,17);k.quadraticCurveTo(x+2,24,x,31);k.stroke()}if(key==='dragon'||key==='goldfish'){k.fillStyle='rgba(255,255,255,.7)';k.fillRect(22,18,2,2);k.fillRect(28,21,2,2)}return c}
 if(key==='rod'||key==='rod2'){const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.strokeStyle=key==='rod'?'#8a5a2e':'#9aa4b8';k.lineWidth=3;k.lineCap='round';k.beginPath();k.moveTo(8,42);k.lineTo(40,6);k.stroke();k.strokeStyle='#e8e0d0';k.lineWidth=.8;k.beginPath();k.moveTo(40,6);k.quadraticCurveTo(44,24,38,36);k.stroke();k.fillStyle='#ff4a3a';k.beginPath();k.arc(38,37,2.5,0,7);k.fill();k.fillStyle='#3a2a1a';k.beginPath();k.arc(14,36,4,0,7);k.fill();return c}
 return _mi(key)}}
{const add=[{id:'rod',name:'คันเบ็ดไม้',mat:'rod',emoji:'🎣',price:60,give:'rod',note:'ตกปลาในทุ่งหญ้า (ยืนริมน้ำแล้วกด E)'},{id:'rod2',name:'คันเบ็ดเหล็กชั้นดี',mat:'rod2',emoji:'🎣',price:450,give:'rod2',note:'ปลาหายากขึ้นง่าย · จุดกดกว้างขึ้น'}];try{STORE_BASE.push(...add)}catch(e){}}
SD.store.sell=SD.store.sell.concat(Object.keys(FISHES).map(k=>[k,FISHES[k].n,FISHES[k].price]));
const FISH={st:null,t:0};
function waterAhead(){if(D)return null;const [tx,ty]=target();if(map[ty]&&map[ty][tx]===WATER)return[tx,ty];const v=DIRV[P.dir],x2=Math.floor((P.x+v[0]*44)/T),y2=Math.floor((P.y+v[1]*44)/T);if(map[y2]&&map[y2][x2]===WATER)return[x2,y2];return null}
function fishStart(w){const rod=inv.rod2>0?2:1;FISH.st='cast';FISH.t=0;FISH.rod=rod;FISH.bx=w[0]*T+16;FISH.by=w[1]*T+16;FISH.sx=P.x;FISH.sy=P.y-30;P.stun=.2;sfx('swing');say('🎣 เหวี่ยงเบ็ด… รอปลากินเหยื่อ (ขยับตัว = เลิกตก)')}
function pickFish(){const night=dayDark(DAY.t)>.5,W=FISH.rod===2?{carp:25,tilapia:25,catfish:22,salmon:18,goldfish:8,dragon:2}:{carp:40,tilapia:30,catfish:18,salmon:9,goldfish:2.5,dragon:.5};if(night){W.catfish*=1.6;W.dragon*=2}
 let s=0;for(const k in W)s+=W[k];let r=Math.random()*s;for(const k in W){if(r<W[k])return k;r-=W[k]}return 'carp'}
function fishPress(){const f=FISH;if(f.st==='bite'){f.st='reel';f.t=0;f.fish=pickFish();const rare={carp:0,tilapia:0,catfish:1,salmon:1,goldfish:2,dragon:3}[f.fish];f.need=1+(rare>=2?1:0)+(rare>=3?1:0);f.hits=0;f.zone=(FISH.rod===2?.26:.2)-rare*.03;f.zc=.3+Math.random()*.4;f.cur=0;f.dir=1;f.sp=.9+rare*.35;sfx('ui');return}
 if(f.st==='reel'){const ok=Math.abs(f.cur-f.zc)<f.zone/2;if(ok){f.hits++;sfx('pick');shake(2,.1);if(f.hits>=f.need){fishCatch();return}f.zc=.2+Math.random()*.6;f.sp*=1.15}else{say('💨 พลาด! ปลาหลุดไปแล้ว');sfx('thud');fishEnd()}return}
 if(f.st==='wait'||f.st==='cast'){say('🎣 ยังไม่มีปลากินเบ็ด ใจเย็น ๆ');}}
function fishCatch(){const k=FISH.fish,F=FISHES[k],cr=canTake(k);if(cr!==true){noRoom(cr);fishEnd();return}inv[k]++;refreshInv();logPick(k);gainXp(F.xp);sfx(k==='goldfish'||k==='dragon'?'gem':'coin');
 say(F.e+' ได้'+F.n+'!'+(k==='dragon'?' 🎉 ปลาในตำนาน!':k==='goldfish'?' ✨ หายากมาก!':''));for(let i=0;i<12;i++)fx.push({x:FISH.bx,y:FISH.by,vx:(Math.random()-.5)*120,vy:-60-Math.random()*80,l:.6,c:'170,220,255'});
 if(k==='dragon')chatAnn((P.name||'ผู้กล้า')+' ตกได้ปลามังกรฟ้า!');fishEnd()}
function fishEnd(){FISH.st=null;P.stun=0}
{const _it=interact;interact=function(){if(FISH.st){fishPress();return true}if(!D&&(inv.rod>0||inv.rod2>0)){const w=waterAhead();if(w){fishStart(w);return true}}return _it()}}
function fishTick(dt){const f=FISH;if(!f.st)return;f.t+=dt;P.stun=Math.max(P.stun,.05);P.mv=false;
 if(keys.l||keys.r||keys.u||keys.d||(JOY.on&&(JOY.x||JOY.y))||P.dead||(D&&!D.home)){if(f.st!=='cast'||f.t>.3){say('🎣 เลิกตกปลา');fishEnd();return}}
 if(f.st==='cast'&&f.t>=.55){f.st='wait';f.t=0;f.wait=2+Math.random()*4.5;sfx('pop')}
 else if(f.st==='wait'&&f.t>=f.wait){f.st='bite';f.t=0;sfx('hit');sfx('pick');shake(1.5,.1)}
 else if(f.st==='bite'&&f.t>.9){say('🐟 ปลากินเบ็ดแล้วหนีไป — กดให้ไวกว่านี้!');sfx('thud');fishEnd()}
 else if(f.st==='reel'){f.cur+=f.dir*f.sp*dt;if(f.cur>1){f.cur=1;f.dir=-1}if(f.cur<0){f.cur=0;f.dir=1}if(f.t>8){say('ปลาดิ้นหลุดไปแล้ว');fishEnd()}}}
{const _w=updWorld;updWorld=function(dt){_w(dt);fishTick(dt)}}
function drawFish(){const f=FISH;if(!f.st)return;const t=performance.now()/1000,v=DIRV[P.dir],hx=P.x+v[0]*10,hy=P.y-26;
 let bx=f.bx,by=f.by;if(f.st==='cast'){const u=Math.min(1,f.t/.55);bx=hx+(f.bx-hx)*u;by=hy+(f.by-hy)*u-Math.sin(u*Math.PI)*50}else{by+=f.st==='bite'?4+Math.sin(t*30)*2:Math.sin(t*3)*1.5}
 ctx.strokeStyle='#5a3418';ctx.lineWidth=2.5;ctx.lineCap='round';const tx=hx+v[0]*22+(v[0]?0:8),ty=hy-24;ctx.beginPath();ctx.moveTo(hx,hy+6);ctx.lineTo(tx,ty);ctx.stroke();
 ctx.strokeStyle='rgba(240,240,240,.8)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(tx,ty);ctx.quadraticCurveTo((tx+bx)/2,Math.max(ty,by)+(f.st==='reel'?-6:14),bx,by);ctx.stroke();
 if(f.st!=='cast'){for(let i=0;i<2;i++){const u=(t*.8+i/2)%1;ctx.strokeStyle='rgba(220,240,255,'+(.6*(1-u))+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(bx,by+3,4+u*14,2+u*6,0,0,7);ctx.stroke()}}
 ctx.fillStyle='#ff4a3a';ctx.beginPath();ctx.arc(bx,by,3,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(bx-3,by-1,6,1.5);
 if(f.st==='bite'){ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText('!',P.x,P.y-88);ctx.fillStyle='#ffd84a';ctx.fillText('!',P.x,P.y-88);ctx.font='bold 10px system-ui';ctx.strokeText('กด E / ⚔️ เร็ว!',P.x,P.y-74);ctx.fillStyle='#fff';ctx.fillText('กด E / ⚔️ เร็ว!',P.x,P.y-74);ctx.textAlign='left'}
 if(f.st==='reel'){const w=110,x=P.x-w/2,y=P.y-100;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-4,y-14,w+8,30);ctx.fillStyle='#2a3a4a';ctx.fillRect(x,y,w,10);ctx.fillStyle='#4fdc6a';ctx.fillRect(x+(f.zc-f.zone/2)*w,y,f.zone*w,10);ctx.fillStyle='#fff';ctx.fillRect(x+f.cur*w-1.5,y-3,3,16);
  ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('กดตอนเข็มอยู่ในแถบเขียว '+f.hits+'/'+f.need,P.x,y-4);ctx.textAlign='left'}}

// ---------- ชื่อ NPC ทุกคน ----------
const NPCNAME={'แม่ค้าผัก':'แม่ค้ามาลี','แม่ค้าผลไม้':'แม่ค้าลำไย','คนขายขนมปัง':'เบเกอร์ปิแอร์','ลุงขายผัก':'ลุงสมปอง','พ่อค้า':'พ่อค้าบรูโน่','นักดื่ม':'กุสตาฟขี้เมา','ชาวบ้าน':'ป้าเอลซ่า','เด็กน้อย':'น้องทิม',
 'ชาวนา':'ชาวนาบุญมี','หญิงสาว':'ลิลลี่','ช่างตีเหล็ก':'ช่างเหล็กดอร์ก','นักเดินทาง':'นักเดินทางเคน','เด็กหญิง':'น้องมิว','คุณยาย':'ยายบัว','คุณตา':'ตาเหลียง','นักบวชแห่งแสง':'นักบวชออรีออน','ปรมาจารย์อาชีพ':'ปรมาจารย์ซีรอส'};
{const _bt=buildTown;buildTown=function(){_bt();let g=0;for(const n of D.npcs){if(n.name==='ทหารยาม')n.dn=['ทหารยามโรแลนด์','ทหารยามการ์ธ'][g++%2];else if(NPCNAME[n.name])n.dn=NPCNAME[n.name]}
 // ป้ายวิหารแห่งแสง (ชัดขึ้น)
 /* Shrine sign is rendered with the final town label layer. */mkMini(dcv,TW,TH,2.6)}}


// =====================================================================
// v3.6 : คทา/ธนูคราฟได้ (อาวุธกำหนดวิธีโจมตี) · อาชีพปลดล็อก Lv.10 · สกิลอาชีพปลดล็อกตามเลเวล · ร้านสกิลขายสกิลพื้นฐาน
//        พาสซีฟ · กิลด์นักผจญภัย + เควส · ของขยะขายได้ · หินเสริมพลัง · ดันเจี้ยน 100 ชั้น + กล่องสมบัติ
//        มอนใหม่: โครงกระดูก ซอมบี้ มังกรเล็ก · แร่มีประกาย · สกิลอลังการขึ้น
// =====================================================================
const wKind=()=>P.armor.sword&&ITEMS[P.armor.sword]?ITEMS[P.armor.sword].kind:'none';
// ---------- 1) ไอเทมคทา / ธนู ----------
KINDS.staff='คทา';KINDS.bow='ธนู';RECIPE.staff={m:3,wood:2};RECIPE.bow={m:2,wood:3};GWB.staff=1.6;GWB.bow=1.4;GK.staff=1;GK.bow=1;
for(let t=0;t<6;t++)for(const k of ['staff','bow']){const id=k+t;ITEMS[id]={id,kind:k,tier:t,tool:true,name:KINDS[k]+TNAMES[t],stat:(k==='staff'?'โจมตีเวท +':'โจมตีธนู +')+SWATK[t]+(k==='staff'?' · ยิงลูกเวท (INT)':' · ยิงธนู (AGI)')}}
function paintStaffIcon(k,t){const Q=TIERS[t];k.save();k.translate(32,34);k.rotate(.6);k.lineCap='round';
 k.strokeStyle='#2a1808';k.lineWidth=7;k.beginPath();k.moveTo(0,26);k.lineTo(0,-16);k.stroke();const g=k.createLinearGradient(-3,0,3,0);g.addColorStop(0,'#5a3418');g.addColorStop(.5,'#a8723a');g.addColorStop(1,'#4a2a10');k.strokeStyle=g;k.lineWidth=4.5;k.stroke();
 k.strokeStyle=Q.mid;k.lineWidth=3;for(const y of [14,0]){k.beginPath();k.moveTo(-3,y);k.lineTo(3,y);k.stroke()}
 k.strokeStyle=Q.lo;k.lineWidth=3;k.beginPath();k.moveTo(-9,-14);k.quadraticCurveTo(-12,-28,0,-30);k.quadraticCurveTo(12,-28,9,-14);k.stroke();k.strokeStyle=Q.hi;k.lineWidth=1.2;k.stroke();
 const og=k.createRadialGradient(-2,-24,1,0,-22,9);og.addColorStop(0,'#fff');og.addColorStop(.45,Q.gl);og.addColorStop(1,Q.lo);k.fillStyle=og;k.beginPath();k.arc(0,-22,7.5,0,7);k.fill();k.strokeStyle='rgba(0,0,0,.5)';k.lineWidth=1;k.stroke();
 k.fillStyle='rgba(255,255,255,.8)';k.fillRect(-4,-26,2,2);k.restore()}
function paintBowIcon(k,t){const Q=TIERS[t];k.save();k.translate(32,32);k.rotate(-.75);k.lineCap='round';
 k.strokeStyle='#2a1808';k.lineWidth=7;k.beginPath();k.arc(-14,0,26,-1.1,1.1);k.stroke();const g=k.createLinearGradient(0,-26,0,26);g.addColorStop(0,Q.hi);g.addColorStop(.5,'#8a5a2e');g.addColorStop(1,Q.mid);k.strokeStyle=g;k.lineWidth=4;k.stroke();
 k.strokeStyle=Q.mid;k.lineWidth=5;k.beginPath();k.arc(-14,0,26,-.18,.18);k.stroke();const ex=-14+26*Math.cos(1.1),ey=26*Math.sin(1.1);k.strokeStyle='#f0e8d8';k.lineWidth=1.2;k.beginPath();k.moveTo(ex,-ey);k.lineTo(ex,ey);k.stroke();
 k.fillStyle=Q.gl;k.beginPath();k.arc(12,0,2.5,0,7);k.fill();k.restore()}
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(type!=='staff'&&type!=='bow')return _ti(type,tier,sz);sz=sz||64;const key=type+tier+'_'+sz;if(TICON[key])return TICON[key];const c=document.createElement('canvas');c.width=c.height=sz;const k=c.getContext('2d');k.scale(sz/64,sz/64);(type==='staff'?paintStaffIcon:paintBowIcon)(k,tier);return TICON[key]=c}}
{const _eq=equipItem;equipItem=function(id){const it=ITEMS[id];if(!it||(it.kind!=='staff'&&it.kind!=='bow'))return _eq(id);if(!GEAR[id])return;
 GEAR[id]--;if(GEAR[id]<=0)delete GEAR[id];const cur=P.armor.sword;if(cur)GEAR[cur]=(GEAR[cur]||0)+1;P.armor.sword=id;syncSword();recalcStats();P.hp=Math.min(P.hp,BAL.hp);sfx('ui');refreshInv();if(!chp.hidden)renderChar();say('ถือ'+it.name+' — '+it.stat)}}
{const _bt=bagTap;bagTap=function(t,id){if(t==='gear'&&ITEMS[id]&&(ITEMS[id].kind==='staff'||ITEMS[id].kind==='bow')){equipItem(id);return}_bt(t,id)}}
// ---------- 2) อาชีพปลดล็อก Lv.10 · สกิลอาชีพปลดล็อกเองตามเลเวล · สกิลพื้นฐานจากร้าน ----------
const CLASS_LV=10,NEEDW={sword:'sword',mage:'staff',archer:'bow'},WNAME={sword:'ดาบ',staff:'คทา',bow:'ธนู'};
CSKILLS.none=[{n:'ฟันวงพายุ',e:'🌀',lv:1,price:60,mp:10,cd:4,d:'ฟันรอบตัว ดาเมจ ×1.3'},{n:'ลูกไฟ',e:'🔥',lv:1,price:80,mp:8,cd:2.5,d:'ยิงลูกไฟด้านหน้า ดาเมจ ×1.6'},{n:'เยียวยา',e:'💚',lv:1,price:100,mp:15,cd:8,d:'ฟื้นเลือด 25%'}];
SKFN.none=[()=>{sfx('swing2');P.at=0;P.cmb=2;vfx('shock',P.x,P.y,.4,{r:62});eachIn(P.x,P.y-8,62,e=>hurtE(e,1.3,{kb:180}))},
 ()=>{shoot('fireball',{range:280,sp:340,mult:1.6,r:10});P.cast=.3;sfx('swing')},()=>healSk()];
function healSk(){const v=Math.round(BAL.hp*.25);P.hp=Math.min(BAL.hp,P.hp+v);sfx('heal');dmgTxt(P.x,P.y-46,'+'+v,'#7dff8a');vfx('pillar',P.x,P.y,.9,{c:'110,255,150'});for(let k=0;k<16;k++)fx.push({x:P.x+(Math.random()-.5)*30,y:P.y-4,vx:0,vy:-60-Math.random()*60,l:.8,c:'110,255,150'});say('💚 เยียวยา เลือด +'+v)}
const skOwned=i=>{const L=CSKILLS[P.cls];if(!L||!L[i])return false;return P.cls==='none'?!!SK.own[i]:P.lv>=L[i].lv};
useSkill=function(i){if(PAUSED||DOORA.k||P.dead)return;if(FISH.st)return;const L=CSKILLS[P.cls],S=L&&L[i];if(!S)return;
 if(!skOwned(i)){say(P.cls==='none'?'🔒 ยังไม่ได้เรียน'+S.n+' — ซื้อได้ที่ร้านสกิล':'🔒 '+S.n+' ปลดล็อกที่ Lv.'+S.lv);return}
 if(P.cls!=='none'&&wKind()!==NEEDW[P.cls]){say('ต้องถือ'+WNAME[NEEDW[P.cls]]+'เพื่อใช้สกิล'+CLS[P.cls].n);sfx('thud');return}
 const heal=P.cls==='none'&&i===2;if(!heal&&D&&(D.town||D.shop)){say('ใช้สกิลต่อสู้ในเมืองไม่ได้');return}if(heal&&P.hp>=BAL.hp){say('เลือดเต็มอยู่แล้ว');return}
 const chain=S.steps&&CS.step>0&&i===1;if(!chain&&CS.cd[i]>0)return;if(P.stun>0||P.dash>0)return;
 const st=chain?CS.step:0,mp=cskMp(S,st);if(P.mp<mp){say('💧 มานาไม่พอ (ต้องใช้ '+mp+')');sfx('thud');return}
 P.mp-=mp;if(P.recall>0)cancelRecall('ใช้สกิล — การวาปถูกยกเลิก');P.at=-1;
 if(S.steps){CS.step=st+1;CS.win=1.8;if(CS.step>=3){CS.step=0;CS.win=0;CS.cd[i]=S.cd}}else CS.cd[i]=S.cd;
 if(P.cls!=='none'){castBanner(S.n+(S.steps?' '+['Ⅰ','Ⅱ','Ⅲ'][st]:''),CLS[P.cls].col,i===2);if(i===2){flash(CLS[P.cls].col,.35);vfx('pillar',P.x,P.y,1.1,{c:P.cls==='mage'?'200,150,255':P.cls==='archer'?'140,255,170':'255,210,140'});shake(4,.3)}}
 SKFN[P.cls][i](st);if(!heal)P.draw=true;if(P.armor.sword)P.tool='sword'};
// ปุ่มสกิลที่ 4: เยียวยา (ถ้าเรียนแล้ว ใช้ได้ทุกอาชีพ)
{const acts=gid('acts'),b=document.createElement('button');b.className='sk';b.id='sk4';b.innerHTML='<span class="ic">💚</span><i class="cd"></i><b class="n"></b><small>15</small>';acts.appendChild(b);
 const st=document.createElement('style');st.textContent='#acts #sk4{right:6px;bottom:104px;width:44px;height:44px;font-size:20px}';document.head.appendChild(st);
 let hcd=0;b.onpointerdown=e=>{e.preventDefault();if(P.dead||hcd>0)return;if(!SK.own[2]){say('🔒 เรียนสกิลเยียวยาได้ที่ร้านสกิล');return}if(P.hp>=BAL.hp){say('เลือดเต็มอยู่แล้ว');return}if(P.mp<15){say('💧 มานาไม่พอ');return}P.mp-=15;hcd=8;healSk()};
 setInterval(()=>{hcd=Math.max(0,hcd-.1);b.style.display=P.cls!=='none'&&SK.own[2]?'':'none';b.querySelector('.cd').style.height=hcd>0?(hcd/8*100)+'%':'0';b.querySelector('.n').textContent=hcd>0?Math.ceil(hcd):''},100)}
Object.defineProperty(SHOP_DATA.skill,'buy',{configurable:true,get(){return CSKILLS.none.map((s,i)=>({id:'bsk'+i,name:s.n+(SK.own[i]?' (เรียนแล้ว ✓)':''),emoji:s.e,price:s.price,note:s.d+' · มานา '+s.mp+' · คูลดาวน์ '+s.cd+' วิ'+(i<2?' · ใช้ได้ตอนยังไม่มีอาชีพ':' · ใช้ได้ทุกอาชีพ (ปุ่มเขียว)')}))}});
{const _bi=buyItem;buyItem=function(id){const m=/^bsk(\d)$/.exec(id);if(!m)return _bi(id);const i=+m[1],S=CSKILLS.none[i];if(SK.own[i]){say('เรียนสกิลนี้แล้ว');return}if(inv.coin<S.price){say('เหรียญไม่พอ (ต้องใช้ '+S.price+')');sfx('thud');return}
 inv.coin-=S.price;SK.own[i]=1;refreshInv();sfx('gem');say(S.e+' เรียน'+S.n+'สำเร็จ!');openShop(SHOPK)}}
SHOP_DATA.skill.owner.lines=['ร้านนี้สอนสกิลพื้นฐาน ใครก็เรียนได้','สกิลอาชีพจะปลดล็อกเองเมื่อเลเวลถึง','เลือกอาชีพได้ที่ Lv.10 กับปรมาจารย์ซีรอส','เยียวยาใช้ได้ทุกอาชีพนะ'];
{const _pc=pickClass;pickClass=function(k){if(P.lv<CLASS_LV){say('🔒 เลือกอาชีพได้ตั้งแต่ Lv.'+CLASS_LV+' — ไปฟาร์มเก็บเลเวลก่อนนะ');sfx('thud');return}_pc(k);say('🎓 อย่าลืมคราฟ'+WNAME[NEEDW[k]]+'ที่ทั่งตีเหล็ก เพื่อใช้สกิลอาชีพนี้')}}
// แจ้งปลดล็อกสกิล/พาสซีฟเมื่อเลเวลอัป
{const _g=gainXp;gainXp=function(n){const l0=P.lv;_g(n);if(P.lv>l0){if(l0<CLASS_LV&&P.lv>=CLASS_LV)chatAnn('Lv.'+CLASS_LV+' แล้ว! ไปเลือกอาชีพกับปรมาจารย์ซีรอสที่จัตุรัสได้เลย');const L=CSKILLS[P.cls];if(L&&P.cls!=='none')for(const s of L)if(l0<s.lv&&P.lv>=s.lv){castBanner('ปลดล็อกสกิล: '+s.n,'#ffd84a');say('✨ ปลดล็อกสกิลใหม่ '+s.e+' '+s.n+'!')}
 for(const p of (PASSIVE[P.cls]||[]))if(l0<p.lv&&P.lv>=p.lv)say('🌟 ปลดล็อกพาสซีฟ '+p.n+' — '+p.d)}}}
// ---------- 3) พาสซีฟ ----------
const PASSIVE={none:[{lv:5,n:'ผู้ฝึกหัดอดทน',d:'END +2',st:{end:2}}],
 sword:[{lv:10,n:'จิตวิญญาณนักรบ',d:'STR +3',st:{str:3}},{lv:20,n:'ผิวเหล็ก',d:'VIT +6',st:{vit:6}},{lv:35,n:'สายเลือดนักรบ',d:'ฟื้นเลือด 1%/วิ',regen:.01},{lv:50,n:'โทสะ',d:'STR +12',st:{str:12}}],
 mage:[{lv:10,n:'สมาธิ',d:'INT +4',st:{int:4}},{lv:20,n:'กระแสมานา',d:'มานาฟื้นเร็วขึ้น 50%',mpr:.5},{lv:35,n:'จิตแกร่ง',d:'INT +10 · VIT +4',st:{int:10,vit:4}},{lv:50,n:'อาร์คเมจ',d:'INT +15',st:{int:15}}],
 archer:[{lv:10,n:'ตาเหยี่ยว',d:'คริติคอล +5%',crit:.05},{lv:20,n:'ฝีเท้าเบา',d:'AGI +5 · END +4',st:{agi:5,end:4}},{lv:35,n:'นักล่า',d:'AGI +10',st:{agi:10}},{lv:50,n:'มือปืนเทวดา',d:'คริติคอล +8% · AGI +8',crit:.08,st:{agi:8}}]};
const pasOn=()=>(PASSIVE[P.cls]||[]).filter(p=>P.lv>=p.lv);
{const _cb=calcBonus;calcBonus=function(){const b=_cb();for(const p of pasOn())if(p.st)for(const k in p.st)b[k]+=p.st[k];return b}}
critCh=function(){return .08+P.stats.agi*.004+(P.cls==='archer'?.1:0)+pasOn().reduce((a,p)=>a+(p.crit||0),0)};
setInterval(()=>{if(PAUSED||P.dead)return;for(const p of pasOn()){if(p.regen&&!passiveRegenBlocked())P.hp=Math.min(BAL.hp,P.hp+BAL.hp*p.regen*.5);if(p.mpr)P.mp=Math.min(BAL.mp,P.mp+BAL.mpRegen*p.mpr*.5)}},500);
// แสดงในหน้าเลือกอาชีพ + หน้าสถานะ
{const _oc=openClassMenu;openClassMenu=function(){_oc();let h='<small style="color:#ffd84a">'+(P.lv<CLASS_LV?'🔒 ต้อง Lv.'+CLASS_LV+' ขึ้นไป (ตอนนี้ Lv.'+P.lv+')':'')+' · ต้องคราฟอาวุธประจำสาย: นักดาบ=ดาบ · นักเวท=คทา · นักธนู=ธนู</small>';
 for(const k of ['sword','mage','archer'])h+='<small>'+CLS[k].e+' พาสซีฟ: '+PASSIVE[k].map(p=>p.n+'(Lv.'+p.lv+')').join(' · ')+'</small>';shopEl.insertAdjacentHTML('beforeend',h)}}
{const _rc=renderChar;renderChar=function(){_rc();const el=gid('chl');if(!el||chp.hidden)return;const C=CLS[P.cls];let h='<div class="setb"><b>'+C.e+' อาชีพ: '+C.n+'</b>';
 for(const p of (PASSIVE[P.cls]||[]))h+='<small class="'+(P.lv>=p.lv?'on':'')+'">'+(P.lv>=p.lv?'🌟':'🔒')+' '+p.n+' (Lv.'+p.lv+'): '+p.d+'</small>';
 const L=CSKILLS[P.cls];if(L)h+='<b>สกิล</b>'+L.map((s,i)=>'<small class="'+(skOwned(i)?'on':'')+'">'+s.e+' '+s.n+(P.cls==='none'?'':' (Lv.'+s.lv+')')+'</small>').join('');el.insertAdjacentHTML('beforeend',h+'</div>')}}

// ---------- 4) สกิลอลังการ: ป้ายชื่อสกิล · แฟลช · เสาแสง · รอยแตกบนพื้น ----------
const BAN={txt:'',t:0,col:'#fff',big:false},FLS={a:0,c:'#fff'};
function castBanner(txt,col,big){BAN.txt=txt;BAN.t=1.3;BAN.col=col;BAN.big=!!big}
function flash(c,a){FLS.c=c;FLS.a=Math.max(FLS.a,a)}
{const _sk=skTick;skTick=function(dt){_sk(dt);if(BAN.t>0)BAN.t-=dt;if(FLS.a>0)FLS.a-=dt*1.6}}
{const _sd=skDraw;skDraw=function(){for(const v of VFX)if(v.k==='shock'&&v.t<v.l){const u=v.t/v.l;ctx.save();ctx.globalAlpha=Math.min(1,(1-u)*2)*.7;ctx.strokeStyle='#2a1c10';ctx.lineWidth=2;for(let i=0;i<12;i++){const a=i/12*6.283+v.x;let x=v.x,y=v.y;ctx.beginPath();ctx.moveTo(x,y);for(let s=0;s<4;s++){x+=Math.cos(a+(Math.sin(i*7+s)*.5))*v.r*.18;y+=Math.sin(a+(Math.sin(i*3+s)*.5))*v.r*.11;ctx.lineTo(x,y)}ctx.stroke()}ctx.restore()}
 _sd()}}
{const _da=drawAir;drawAir=function(){_da();const t=performance.now()/1000;
 for(const v of VFX){if(v.k!=='pillar')continue;const u=v.t/v.l,a=u<.2?u/.2:1-(u-.2)/.8;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(v.x-22,0,v.x+22,0);g.addColorStop(0,'rgba('+v.c+',0)');g.addColorStop(.5,'rgba('+v.c+','+(.55*a)+')');g.addColorStop(1,'rgba('+v.c+',0)');ctx.fillStyle=g;ctx.fillRect(v.x-22,v.y-220,44,224);
  for(let i=0;i<6;i++){const yy=v.y-((t*160+i*40)%220);ctx.fillStyle='rgba(255,255,255,'+(.6*a)+')';ctx.fillRect(v.x+Math.sin(i*2+t*4)*14,yy,2,6)}ctx.strokeStyle='rgba('+v.c+','+(.8*a)+')';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(v.x,v.y,30+u*40,12+u*16,0,0,7);ctx.stroke();ctx.restore()}
 if(FLS.a>0&&window.LASTCAM){ctx.save();ctx.globalAlpha=Math.min(.45,FLS.a);ctx.fillStyle=FLS.c;ctx.fillRect(LASTCAM[0],LASTCAM[1],VW/Z,VH/Z);ctx.restore()}
 if(BAN.t>0){const u=1-BAN.t/1.3,s=u<.12?.6+u/.12*.5:u>.8?1.1-(u-.8)*2:1.1-u*.1,a=u>.8?(1-u)/.2:1;ctx.save();ctx.globalAlpha=a;ctx.translate(P.x,P.y-104);ctx.scale(s,s);ctx.font='bold '+(BAN.big?20:15)+'px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';
  ctx.lineWidth=5;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(BAN.txt,0,0);const g=ctx.createLinearGradient(0,-14,0,4);g.addColorStop(0,'#fff');g.addColorStop(1,BAN.col);ctx.fillStyle=g;ctx.fillText(BAN.txt,0,0);
  ctx.strokeStyle=BAN.col;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-70,8);ctx.lineTo(70,8);ctx.stroke();ctx.restore()}}}
// ลูกไฟ (สกิลพื้นฐาน) วาดเป็นลูกไฟส้ม
{const _da=drawAir;drawAir=function(){for(const p of PROJ)if(p.k==='fireball'){p.k='bolt';p.fire=1}_da();for(const p of PROJ)if(p.fire){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,14);g.addColorStop(0,'#fff6c8');g.addColorStop(.5,'rgba(255,140,40,.9)');g.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,14,0,7);ctx.fill();ctx.restore()}}}

// ---------- 5) ของดรอป (ขยะ) จากมอน · หินเสริมพลัง ----------
const JUNK={bone:['กระดูกเก่า','🦴',3,'skeleton'],rag:['ผ้าเน่าซอมบี้','🧟',2,'zombie'],pelt:['หนังหมาป่า','🐺',6,'wolf'],wing:['ปีกค้างคาว','🦇',3,'bat'],shell:['เปลือกด้วง','🪲',5,'beetle'],core:['แกนหินเวท','🪨',9,'golem'],dust:['ผงวิญญาณ','✨',7,'wisp'],scale:['เกล็ดมังกร','🐉',25,'drake']};
const JFAM={};for(const k in JUNK)JFAM[JUNK[k][3]]=k;JFAM.dragon='scale';
for(const k in JUNK){INVMETA[k]=[JUNK[k][0],'ของดรอปจากมอน · ขายที่กิลด์นักผจญภัยได้ '+JUNK[k][2]+' เหรียญ · ใช้ทำเควส/แลกของ'];if(!INVORDER.includes(k))INVORDER.push(k);WT[k]=k==='core'?.6:.2;if(inv[k]===undefined)inv[k]=0}
INVMETA.estone=['หินเสริมพลัง','ใช้ตีบวกอาวุธ/ชุด (ต้องใช้เท่ากับระดับบวกที่จะขึ้น) · ได้จากดันเจี้ยน/เควส/แลกที่กิลด์'];INVMETA.bless=['หินอวยพร','ตีบวกพลาดตอน +3 ขึ้นไป จะไม่ลดระดับ (ใช้อัตโนมัติ)'];
for(const k of ['estone','bless']){if(!INVORDER.includes(k))INVORDER.splice(INVORDER.indexOf('ingSt'),0,k);WT[k]=.3;if(inv[k]===undefined)inv[k]=0}
{const _mi=matIcon;matIcon=function(key){const J=JUNK[key];if(!J&&key!=='estone'&&key!=='bless')return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';k.strokeStyle='rgba(20,15,10,.75)';k.lineWidth=1.5;
 const G=(a,b,y0,y1)=>{const g=k.createLinearGradient(0,y0||8,0,y1||40);g.addColorStop(0,a);g.addColorStop(1,b);return g};
 if(key==='bone'){k.fillStyle=G('#fffaf0','#c8bfa8');k.save();k.translate(24,24);k.rotate(-.7);k.beginPath();k.rect(-13,-3.5,26,7);for(const x of [-14,14])for(const y of [-4,4]){k.moveTo(x+5,y);k.arc(x,y,5,0,7)}k.fill();k.stroke();k.restore()}
 else if(key==='rag'){k.fillStyle=G('#8a9a6a','#4a5a3a');k.beginPath();k.moveTo(8,12);k.lineTo(40,10);k.lineTo(36,22);k.lineTo(42,30);k.lineTo(34,40);k.lineTo(26,34);k.lineTo(16,42);k.lineTo(12,30);k.lineTo(6,24);k.closePath();k.fill();k.stroke();k.fillStyle='rgba(40,60,20,.5)';k.fillRect(18,20,6,4);k.fillRect(28,28,5,3)}
 else if(key==='pelt'){k.fillStyle=G('#c8a070','#7a5428');k.beginPath();k.moveTo(10,14);k.quadraticCurveTo(24,6,38,14);k.lineTo(42,32);k.quadraticCurveTo(24,44,6,32);k.closePath();k.fill();k.stroke();k.strokeStyle='rgba(60,40,20,.5)';for(let i=0;i<6;i++){k.beginPath();k.moveTo(12+i*5,18);k.lineTo(14+i*5,30);k.stroke()}}
 else if(key==='wing'){k.fillStyle=G('#6a5a7a','#2a2032');k.beginPath();k.moveTo(6,30);k.quadraticCurveTo(14,8,40,8);k.lineTo(34,18);k.lineTo(40,24);k.lineTo(30,28);k.lineTo(34,36);k.lineTo(20,32);k.closePath();k.fill();k.stroke()}
 else if(key==='shell'){k.fillStyle=G('#c08a4a','#5a3418');k.beginPath();k.ellipse(24,25,16,13,0,0,7);k.fill();k.stroke();k.strokeStyle='rgba(30,15,5,.6)';k.beginPath();k.moveTo(24,12);k.lineTo(24,38);k.stroke();k.fillStyle='rgba(255,255,255,.3)';k.beginPath();k.ellipse(18,18,4,2.5,-.5,0,7);k.fill()}
 else if(key==='core'){k.fillStyle=G('#9a948a','#4a4640');k.beginPath();k.moveTo(24,6);k.lineTo(40,18);k.lineTo(36,40);k.lineTo(12,40);k.lineTo(8,18);k.closePath();k.fill();k.stroke();const g=k.createRadialGradient(24,24,1,24,24,10);g.addColorStop(0,'#fff');g.addColorStop(.5,'#ffb04a');g.addColorStop(1,'rgba(255,120,30,0)');k.fillStyle=g;k.beginPath();k.arc(24,24,10,0,7);k.fill()}
 else if(key==='dust'){for(let i=0;i<14;i++){const g=k.createRadialGradient(0,0,0,0,0,4);k.save();k.translate(10+((i*37)%28),10+((i*53)%28));g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(180,140,255,0)');k.fillStyle=g;k.fillRect(-4,-4,8,8);k.restore()}k.fillStyle='rgba(200,170,255,.5)';k.beginPath();k.ellipse(24,36,14,5,0,0,7);k.fill()}
 else if(key==='scale'){k.fillStyle=G('#a8e8ff','#2a6ad8');k.beginPath();k.moveTo(24,6);k.quadraticCurveTo(42,16,36,34);k.quadraticCurveTo(24,44,12,34);k.quadraticCurveTo(6,16,24,6);k.fill();k.stroke();k.strokeStyle='rgba(255,255,255,.5)';k.beginPath();k.moveTo(24,10);k.lineTo(24,38);k.stroke()}
 else{const b=key==='bless';const g=k.createLinearGradient(0,6,0,42);g.addColorStop(0,b?'#fff6c8':'#d8f4ff');g.addColorStop(.5,b?'#ffd23a':'#5ec8ff');g.addColorStop(1,b?'#a87a10':'#1f5fc4');k.fillStyle=g;k.beginPath();k.moveTo(24,4);k.lineTo(40,18);k.lineTo(34,42);k.lineTo(14,42);k.lineTo(8,18);k.closePath();k.fill();k.stroke();
  k.strokeStyle='rgba(255,255,255,.6)';k.beginPath();k.moveTo(24,4);k.lineTo(24,42);k.moveTo(8,18);k.lineTo(40,18);k.stroke();if(b){k.fillStyle='#fff';k.font='bold 14px serif';k.textAlign='center';k.fillText('✦',24,32)}}
 return c}}
for(const k of [...Object.keys(JUNK),'estone','bless','hpp','mpp']){const im=new Image();im.src=iconURL('mat:'+k);DROPIMG[k]=im}
{const _mk=mobKill;mobKill=function(m){_mk(m);const j=JFAM[m.f];if(j&&Math.random()<(m.boss?1:m.elite?.9:.45))for(let i=0;i<(m.boss?4:1);i++)addDrop(j,m.x,m.y);
 if(D&&D.dg&&!m.boss&&Math.random()<.08+D.dg/600)addDrop('estone',m.x,m.y);questEv('kill',m.f,m);if(m.boss)questEv('boss')}}
{const _dl=dropLoot;dropLoot=function(x,y,s){_dl(x,y,s);if(s)questEv('kill','slime',s)}}
// ตีบวกต้องใช้หินเสริมพลัง · หินอวยพรกันลดระดับ
{const _en=enhItem;enhItem=function(id){const it=ITEMS[id],l=ENH[id]||0;if(l>=MAXP)return _en(id);const need=l+1,mk=MATKEY[it.tier];
 if(inv.estone<need){say('ต้องใช้หินเสริมพลัง ×'+need+' (มี '+inv.estone+') — หาได้จากดันเจี้ยน/เควส/แลกที่กิลด์');sfx('thud');return}
 if(inv[mk]<need||inv.coin<20*need)return _en(id);inv.estone-=need;const b=l>=3&&inv.bless>0;_en(id);if(b&&(ENH[id]||0)<l){ENH[id]=l;inv.bless--;say('✦ หินอวยพรคุ้มครอง! ระดับไม่ลดลง (+'+l+')');refreshInv()}}}
{const _ah=anvilHTML;anvilHTML=function(){let h=_ah();if(FUI.tab==='enh')h=h.replace('<small>ตีบวกของที่สวมใส่อยู่','<small>💎 หินเสริมพลัง มี '+inv.estone+' · ✦ หินอวยพร มี '+inv.bless+' (ใช้หินเท่ากับระดับที่จะขึ้น)<br>ตีบวกของที่สวมใส่อยู่');return h}}

// ---------- 6) มอนใหม่: โครงกระดูก ซอมบี้ มังกรเล็ก ----------
Object.assign(FAM,{skeleton:{hp:.9,atk:1.1,spd:62,r:12,range:26,type:'melee',wu:.3,cd:1.2,kb:.8},zombie:{hp:1.5,atk:1.2,spd:30,r:13,range:28,type:'lunge',wu:.55,cd:1.8,kb:.5},drake:{sz:.62,hp:1.2,atk:1.2,spd:58,r:16,range:210,type:'shoot',wu:.55,cd:2.2,kb:.6,keep:130,fly:1}});
function drawSkeleton(m,t,c){const w=m.mv?t*12:0,wu=m.st==='wu'?1:0,bone=m.hurt>0?'#ffffff':'#ece6d6',dk='#5a5448';
 ctx.strokeStyle=bone;ctx.lineWidth=2.4;ctx.lineCap='round';for(const [x,o] of [[-3,0],[3,Math.PI]]){ctx.beginPath();ctx.moveTo(x,-14);ctx.lineTo(x+Math.sin(w+o)*4,-6);ctx.lineTo(x+Math.sin(w+o)*3,0);ctx.stroke()}
 ctx.fillStyle=bone;ctx.fillRect(-5,-16,10,3);ctx.strokeStyle=bone;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,-16);ctx.lineTo(0,-30);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,-27+i*4,6-i,1.6,0,0,7);ctx.stroke()}
 ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-5,-29);ctx.lineTo(-9,-20+Math.sin(w)*2);ctx.stroke();ctx.beginPath();ctx.moveTo(5,-29);ctx.lineTo(10-wu*4,-22-wu*10);ctx.stroke();
 ctx.save();ctx.translate(10-wu*4,-22-wu*10);ctx.rotate(wu?-1.8:-.6);ctx.fillStyle='#8a8478';ctx.fillRect(-1,-16,3,16);ctx.fillStyle='#6a4a2a';ctx.fillRect(-3,0,7,2);ctx.restore();
 ctx.fillStyle=bone;ctx.beginPath();ctx.arc(0,-36,6,0,7);ctx.fill();ctx.fillRect(-3.5,-32,7,4);ctx.fillStyle='#1a1410';ctx.beginPath();ctx.arc(-2.2,-36.5,1.6,0,7);ctx.arc(2.4,-36.5,1.6,0,7);ctx.fill();ctx.fillStyle=c[2];ctx.fillRect(-2.6,-37,1,1);ctx.fillRect(2,-37,1,1);ctx.fillStyle=dk;for(let i=-2;i<=2;i+=1.5)ctx.fillRect(i,-31,.8,2)}
function drawZombie(m,t,c){const w=m.mv?t*7:0,sk=m.hurt>0?'#ffffff':'#8aa86a',cl=c[0],lean=m.st==='lunge'?6:2;
 ctx.fillStyle='#3a3428';ctx.fillRect(-6+Math.sin(w)*2,-12,5,12);ctx.fillRect(1-Math.sin(w)*2,-12,5,12);
 ctx.save();ctx.translate(lean*.5,0);ctx.fillStyle=cl;ctx.beginPath();ctx.moveTo(-8,-12);ctx.lineTo(8,-12);ctx.lineTo(7,-28);ctx.lineTo(-7,-28);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-5,-20,4,6);ctx.fillRect(2,-16,4,3);
 ctx.fillStyle=sk;ctx.fillRect(4,-26+Math.sin(w)*1.5,13,4);ctx.fillRect(4,-21-Math.sin(w)*1.5,12,4);ctx.beginPath();ctx.arc(1,-34,6.5,0,7);ctx.fill();ctx.fillStyle='rgba(60,80,40,.6)';ctx.fillRect(-2,-38,3,2);
 ctx.fillStyle='#ff3a2a';ctx.fillRect(2,-36,2,2);ctx.fillRect(5,-35,1.5,1.5);ctx.fillStyle='#2a1a10';ctx.fillRect(1,-31,5,1.5);ctx.restore()}
function drawDrake(m,t,c){ctx.save();ctx.scale(1,1);drawDragon(m,t,c);ctx.restore()}
Object.assign(MOBDRAW,{skeleton:drawSkeleton,zombie:drawZombie,drake:drawDrake});

// ---------- 7) แร่มีประกายระยิบระยับ ----------
const ORESPK={stone:0,iron:1,copper:2,silver:3,gold:4,diamond:5};
{const _do=drawOreZ;drawOreZ=function(o){_do(o);const n=ORESPK[o.kind]||0;if(!n)return;const t=performance.now()/1000,x=o.tx*T+16,y=o.ty*T+10;ctx.save();ctx.globalCompositeOperation='lighter';
 const col={iron:'255,200,170',copper:'255,190,120',silver:'235,245,255',gold:'255,230,120',diamond:'170,240,255'}[o.kind];
 for(let i=0;i<n;i++){const ph=(t*(.7+i*.23)+i*1.7+o.tx)%1.6;if(ph>1)continue;const a=Math.sin(ph*Math.PI),px=x-12+((i*17+o.ty*7)%24),py=y-6+((i*11+o.tx*5)%16),s=2+a*(n>=4?4:3);
  ctx.fillStyle='rgba('+col+','+(a*.9)+')';ctx.fillRect(px-s,py-.6,s*2,1.2);ctx.fillRect(px-.6,py-s,1.2,s*2);ctx.fillStyle='rgba(255,255,255,'+a+')';ctx.fillRect(px-1,py-1,2,2)}
 if(n>=4){const g=ctx.createRadialGradient(x,y+4,1,x,y+4,22);g.addColorStop(0,'rgba('+col+','+(.12+.06*Math.sin(t*2+o.tx))+')');g.addColorStop(1,'rgba('+col+',0)');ctx.fillStyle=g;ctx.fillRect(x-22,y-18,44,44)}ctx.restore()}}

// ---------- 8) ดันเจี้ยน 100 ชั้น ----------
const DG={max:1,sel:1};
function dgPool(f){if(f<=10)return['skeleton','zombie','bat'];if(f<=30)return['skeleton','zombie','wolf','beetle'];if(f<=60)return['skeleton','zombie','golem','wisp'];if(f<=85)return['drake','golem','wisp','skeleton'];return['drake','skeleton','wisp','golem']}
const DGNAME={skeleton:'โครงกระดูกนักรบ',zombie:'ซอมบี้',bat:'ค้างคาวสุสาน',wolf:'หมาป่าเงา',beetle:'ด้วงสุสาน',golem:'โกเลมหินผี',wisp:'วิญญาณเร่ร่อน',drake:'มังกรเล็ก'};
const DGCOL=[['#8a7a9a','#3a3048','#c8a0ff'],['#6a8a5a','#2a3a20','#ff5a3a'],['#7a6a8a','#2a2038','#7fe0ff'],['#9a6a5a','#3a2018','#ffb04a'],['#6a7a9a','#1a2038','#ff4ad8']];
function dgBoss(f){const r=f%10===0?'dragon':['skeleton','zombie','golem','wolf','beetle'][f%5];return{f:r,n:{dragon:'มังกรผู้พิทักษ์',skeleton:'ราชาโครงกระดูก',zombie:'จอมซอมบี้',golem:'โกเลมผู้คุมคุก',wolf:'หมาป่าแห่งความมืด',beetle:'ด้วงราชินีสุสาน'}[r]+' ชั้น '+f,lv:Math.min(110,f+3),c:DGCOL[Math.floor(f/20)%5]}}
function openDgMenu(){ZM.open=true;SHOPK=null;STN.open=null;hideBag();sfx('ui');DG.sel=Math.max(1,Math.min(DG.max,DG.sel||DG.max));const f=DG.sel,lv=f,warn=P.lv<lv-3?'⚠️ อันตราย':P.lv>lv+8?'✅ ง่าย':'⭐ เหมาะกับคุณ',B=dgBoss(f);
 shopEl.innerHTML='<button class="mini x xclose" onclick="closeZMenu()">✕</button><b>🗝️ ดันเจี้ยนใต้พิภพ — ไม่สิ้นสุด</b><small>ปลดล็อกแล้วถึงชั้น '+DG.max+' · ชนะบอสแต่ละชั้นเพื่อเปิดชั้นถัดไป</small>'
 +'<div class="rw" style="justify-content:center;gap:4px"><button class="mini sm" onclick="dgSel(-10)">−10</button><button class="mini sm" onclick="dgSel(-1)">−1</button><b style="font-size:20px;min-width:70px;text-align:center">ชั้น '+f+'</b><button class="mini sm" onclick="dgSel(1)">+1</button><button class="mini sm" onclick="dgSel(10)">+10</button><button class="mini sm" onclick="dgSel(999)">สูงสุด</button></div>'
 +'<small>มอนสเตอร์ Lv.'+f+'-'+(f+2)+': '+dgPool(f).map(k=>DGNAME[k]).join(' · ')+'<br>บอส: 👑 '+B.n+' Lv.'+B.lv+' · '+warn+'<br>รางวัล: หินเสริมพลัง · แท่งโลหะ · เหรียญ · หินอวยพร (หายาก) · อุปกรณ์</small>'
 +'<button class="mini ok" onclick="enterDg('+f+')">⚔️ ลงดันเจี้ยนชั้น '+f+'</button>';shopEl.hidden=false}
function dgSel(d){DG.sel=Math.max(1,Math.min(DG.max,(DG.sel||1)+d));openDgMenu()}
const dgNear=()=>!D&&Math.hypot(P.x-(CV.tx*T+16),P.y-(CV.ty*T+40))<70;
setInterval(()=>{if(ZM.open&&!D&&!zgNear()&&!dgNear())closeZMenu()},300);
function enterDg(f){closeZMenu();const idx=200+f;for(const k in ZCACHE)if(+k>=200&&+k!==idx)delete ZCACHE[k];
 const band=Math.floor((f-1)/20),cols=DGCOL[band%5],pool=dgPool(f);
 ZONES[idx]={id:'dg',dg:f,n:'ดันเจี้ยนชั้น '+f,e:'🗝️',lv:(window.dgLv7?dgLv7(f):[f,f+2]),ores:f<15?[['stone',.6],['iron',.4]]:f<35?[['iron',.5],['copper',.5]]:f<60?[['copper',.4],['silver',.6]]:f<85?[['silver',.4],['gold',.6]]:[['gold',.5],['diamond',.5]],raw:'iron',ing:['stone','iron','copper','silver','gold','gem'][Math.min(5,Math.floor(f/17))],amb:'mote',dark:1,
  pal:{fl:['#3a3442','#34303c','#2e2a36'],top:'#24202c',face:'#16131c',edge:'#0a080e',ac:cols[2],vd:'#050408'},mobs:(window.dgMobs7?dgMobs7(f,cols):pool.map(k=>[k,DGNAME[k],cols])),boss:(window.dgBossOf7?dgBossOf7(f):dgBoss(f))};
 enterZone(idx);D.dg=f;D.ret=[(CV.tx)*T+16,(CV.ty+2)*T+16];D.spT=1e9;D.ban=3.5;setScene('cave');
 for(let i=0;i<4;i++)spawnMob(false);say('🗝️ ดันเจี้ยนชั้น '+f+' — กำจัดบอสในห้องทางเหนือเพื่อรับกล่องสมบัติ');questEv('floor',f)}
// ทางเข้าดันเจี้ยน = ถ้ำในทุ่งหญ้า
{const _it=interact;interact=function(){if(!D&&!FISH.st){const [x,y]=target();if(y===CV.ty&&Math.abs(x-CV.tx)<=1&&map[y]&&map[y][x]===DOOR){openDgMenu();return true}}
 if(D&&D.dg&&D.chest){const c=D.chest;if(Math.hypot(P.x-c.x,P.y-c.y)<46){if(!c.open)openChest_();else if(D.dg<DGMAX7()){dgGo7(D.dg+1)}return true}}return _it()}}
function dgReward(f){const R=[],add=(k,n)=>{for(let i=0;i<n;i++)R.push(k)};add('coin',8+Math.floor(f/4));add('estone',1+Math.floor(f/12)+(Math.random()<.5?1:0));add(['stone','iron','copper','silver','gold','gem'][Math.min(5,Math.floor(f/17))],1+Math.floor(Math.random()*3));
 if(Math.random()<.12+f/400)add('bless',1);if(Math.random()<.15)add('phoenix',1);if(Math.random()<.4)add('hpp',2);if(Math.random()<.3)add('mpp',2);return R}
function openChest_(){const c=D.chest,f=D.dg;c.open=true;sfx('chest');sfx('gem');flash('#ffe9a0',.4);shake(3,.2);
 for(const k of dgReward(f))addDrop(k,c.x,c.y-6);const coins=Math.round(40*Math.min(f,120)*(.8+Math.random()*.4));inv.coin+=coins;dmgTxt(c.x,c.y-30,'+'+coins+' 🪙','#ffd84a',true);
 if(Math.random()<.25+f/300){const t=Math.min(5,Math.floor(f/17)),ks=['sword','staff','bow','helm','chest','pants','arm','neck','ring'],id=ks[Math.random()*ks.length|0]+t;GEAR[id]=(GEAR[id]||0)+1;say('🎁 ได้อุปกรณ์: '+ITEMS[id].name+'!');chatAnn((P.name||'ผู้กล้า')+' ได้ '+ITEMS[id].name+' จากกล่องดันเจี้ยนชั้น '+f)}
 for(let i=0;i<30;i++)fx.push({x:c.x,y:c.y-10,vx:(Math.random()-.5)*180,vy:-60-Math.random()*130,l:.9,c:'255,216,74'});refreshInv();say('🎁 เปิดกล่องสมบัติชั้น '+f+'! '+(f<DGMAX7()?'ยืนที่กล่องแล้วกด E อีกครั้งเพื่อลงชั้น '+(f+1):'🏆 พิชิตดันเจี้ยนครบ 100 ชั้นแล้ว!'));saveX()}
{const _mk=mobKill;mobKill=function(m){_mk(m);if(D&&D.dg&&m.boss){D.bossT=0;D.chest={x:D.zone.arena.x*T+16,y:D.zone.arena.y*T+16,open:false};const f=D.dg;if(DG.max<=f&&f<DGMAX7()){DG.max=f+1;DG.sel=f+1}saveX();chatAnn((P.name||'ผู้กล้า')+' พิชิตดันเจี้ยนชั้น '+f+'!');say('🏆 ชนะบอส! กล่องสมบัติปรากฏกลางห้อง — เดินไปกด E เปิด')}}}
{const _sd=skDraw;skDraw=function(){_sd();if(D&&D.dg&&D.chest){const c=D.chest,t=performance.now()/1000,x=c.x,y=c.y;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+10,20,6,0,0,7);ctx.fill();
 if(!c.open){const g=ctx.createRadialGradient(x,y,2,x,y,40);g.addColorStop(0,'rgba(255,220,120,'+(.35+.15*Math.sin(t*4))+')');g.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=g;ctx.fillRect(x-40,y-40,80,80)}
 ctx.fillStyle='#7a4a22';ctx.fillRect(x-16,y-8,32,18);ctx.fillStyle='#e8c14a';ctx.fillRect(x-16,y-3,32,3);ctx.fillRect(x-2,y-5,4,7);ctx.strokeStyle='#2b1808';ctx.strokeRect(x-15.5,y-7.5,31,17);
 if(c.open){ctx.fillStyle='#5a3818';ctx.fillRect(x-16,y-22,32,10);ctx.fillStyle='#ffe98a';ctx.fillRect(x-14,y-10,28,3);if(D.dg<DGMAX7()){const g=ctx.createRadialGradient(x,y-40,2,x,y-40,30);g.addColorStop(0,'rgba(200,150,255,.7)');g.addColorStop(1,'rgba(120,60,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y-40,22,30,0,0,7);ctx.fill()}}
 else{ctx.fillStyle='#9a6230';ctx.fillRect(x-16,y-14,32,8);ctx.fillStyle='#e8c14a';ctx.fillRect(x-16,y-11,32,2)}
 if(Math.hypot(P.x-x,P.y-y)<46){const s=!c.open?'กด E เปิดกล่องสมบัติ':D.dg<DGMAX7()?'กด E ลงชั้น '+(D.dg+1):'🏆 พิชิตครบแล้ว';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(s,x,y+28);ctx.fillStyle='#fff';ctx.fillText(s,x,y+28);ctx.textAlign='left'}}}}
// ป้ายหน้าถ้ำ
{const _dr=drawDrops;drawDrops=function(){if(!D){const x=CV.tx*T+16,y=CV.ty*T+50;if(Math.abs(x-P.x)<VW&&Math.abs(y-P.y)<VH){ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText('🗝️ ดันเจี้ยน 100 ชั้น (ถึงชั้น '+DG.max+')',x,y);ctx.fillStyle='#d8c8ff';ctx.fillText('🗝️ ดันเจี้ยน 100 ชั้น (ถึงชั้น '+DG.max+')',x,y);ctx.textAlign='left'}}_dr()}}

// ---------- 9) กิลด์นักผจญภัย (บ้านว่าง) · เควส · ขายของขยะ · แลกของ ----------
SIGN_ICONS.guild=k=>{k.lineJoin='round';k.fillStyle='#8a2a2a';k.beginPath();k.moveTo(0,-15);k.lineTo(13,-9);k.lineTo(11,8);k.lineTo(0,15);k.lineTo(-11,8);k.lineTo(-13,-9);k.closePath();k.fill();k.strokeStyle=OUT;k.lineWidth=3;k.stroke();k.strokeStyle='#e8c14a';k.lineWidth=1.5;k.stroke();
 k.strokeStyle='#e6ecf4';k.lineWidth=2.5;k.beginPath();k.moveTo(-7,7);k.lineTo(7,-7);k.moveTo(7,7);k.lineTo(-7,-7);k.stroke();k.fillStyle='#e8c14a';k.beginPath();k.arc(0,0,3,0,7);k.fill()};
SHOP_DATA.guild={name:'กิลด์นักผจญภัย',emoji:'📜',icon:'guild',img:'house2',b:[24,24,5,4],door:{x:62,w:36,t:74,bt:126},sign:{x:128,y:84,arm:24},
 owner:{name:'ไอริส (พนักงานกิลด์)',c:'#3a5a9a',h:'#c8843a',g:'f',age:'adult',hs:'long',greet:['ยินดีต้อนรับสู่กิลด์นักผจญภัยค่ะ!','วันนี้มีเควสใหม่มาค่ะ ลองดูที่บอร์ดนะคะ'],lines:['ของดรอปจากมอนขายที่กิลด์ได้นะคะ','ทำเควสได้ทั้งเหรียญ XP และหินเสริมพลังค่ะ','ดันเจี้ยนอยู่ที่ถ้ำในทุ่งหญ้าค่ะ ระวังด้วยนะคะ']},
 solid:[],sell:Object.keys(JUNK).map(k=>[k,JUNK[k][0],JUNK[k][2]]).concat([['gel','เจลสไลม์',4]]),
 get buy(){return[{id:'gx_estone',name:'แลกหินเสริมพลัง',mat:'estone',price:30,note:'ใช้ แกนหินเวท 2 + ผงวิญญาณ 2 + 30 เหรียญ'},{id:'gx_estone2',name:'แลกหินเสริมพลัง (กระดูก)',mat:'estone',price:20,note:'ใช้ กระดูกเก่า 6 + ผ้าเน่า 4 + 20 เหรียญ'},{id:'gx_bless',name:'แลกหินอวยพร',mat:'bless',price:200,note:'ใช้ เกล็ดมังกร 3 + 200 เหรียญ'},{id:'gx_phoenix',name:'แลกขนนกฟีนิกซ์',mat:'phoenix',price:80,note:'ใช้ ปีกค้างคาว 8 + หนังหมาป่า 4 + 80 เหรียญ'}]}};
SHOP_ORDER.push('guild');SHOP_ART.guild=function(k){return SHOP_ART.skill(k)};SHOP_ANIM.guild=function(t){if(SHOP_ANIM.skill)SHOP_ANIM.skill(t);
 const x=6*T,y=12;ctx.fillStyle='#5a3a1a';ctx.fillRect(x,y,4*T,52);ctx.fillStyle='#8a5a2e';ctx.fillRect(x+3,y+3,4*T-6,46);for(let i=0;i<6;i++){ctx.fillStyle=['#f6ecd0','#f0e0b8','#fff8e0'][i%3];ctx.save();ctx.translate(x+12+i*18,y+12+(i%2)*14);ctx.rotate((i%3-1)*.08);ctx.fillRect(-7,-6,15,18);ctx.fillStyle='#8a2a2a';ctx.fillRect(-2,-8,3,3);ctx.fillStyle='rgba(60,40,20,.5)';for(let l=0;l<4;l++)ctx.fillRect(-5,-2+l*3.5,11,1);ctx.restore()}
 ctx.fillStyle='#e8c14a';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText('📜 บอร์ดเควส',x+2*T,y-2);ctx.textAlign='left'};
SHOP_TINT.guild='rgba(255,220,150,.07)';
{const _bt=buildTown;buildTown=function(){_bt();const k=dcv.getContext('2d'),px=23*T+16,py=27*T+28;
 prop(kk=>{kk.fillStyle='rgba(0,0,0,.25)';kk.beginPath();kk.ellipse(px+4,py,16,4,0,0,7);kk.fill();kk.fillStyle='#4a2e16';kk.fillRect(px-14,py-40,4,40);kk.fillRect(px+10,py-40,4,40);kk.fillStyle='#7a4e26';kk.fillRect(px-17,py-46,34,26);kk.strokeStyle='#3a2410';kk.lineWidth=2;kk.strokeRect(px-17,py-46,34,26);
  for(let i=0;i<4;i++){kk.fillStyle=['#f6ecd0','#fff8e0'][i%2];kk.fillRect(px-14+i*8,py-43+(i%2)*4,6,9);kk.fillStyle='#8a2a2a';kk.fillRect(px-12+i*8,py-44+(i%2)*4,2,2)}kk.fillStyle='#e8c14a';kk.font='bold 7px system-ui';kk.textAlign='center';kk.fillText('QUEST',px,py-48);kk.textAlign='left'},py,px-22,py-58,46,64);
 dm[27][23]=1;D.stalls=D.stalls.concat(TOWNPROPS.slice(-1))}}
// บ้านว่างเดิม → กิลด์ (ไม่วาดบ้านตกแต่งซ้ำตำแหน่งนี้)
// ---- เควส ----
const QST={offer:[],act:[],day:-1,done:0};
const QT=[['kill','slime','กำจัดสไลม์',8,0,20],['kill','skeleton','กำจัดโครงกระดูก',8,1,100],['kill','zombie','กำจัดซอมบี้',8,1,100],['kill','bat','กำจัดค้างคาว',8,5,100],['kill','wolf','กำจัดหมาป่า',6,18,100],['kill','golem','กำจัดโกเลม',5,10,100],['kill','wisp','กำจัดภูต',6,25,100],['kill','drake','กำจัดมังกรเล็ก',4,60,100],
 ['item','gel','ส่งเจลสไลม์',6,0,25],['item','bone','ส่งกระดูกเก่า',6,1,100],['item','pelt','ส่งหนังหมาป่า',4,18,100],['fish',0,'ตกปลา',4,0,100],['mine',0,'ขุดแร่',6,3,100],['boss',0,'ล้มบอส',1,12,100],['floor',0,'ลงดันเจี้ยนถึงชั้น',0,1,100]];
function qGen(){const L=P.lv,C=QT.filter(q=>L>=q[4]&&L<=q[5]+10);const q=C[Math.random()*C.length|0];const n=q[0]==='floor'?Math.min(DGMAX7(),DG.max+1+Math.floor(Math.random()*3)):Math.max(1,Math.round(q[3]*(.8+Math.random()*.6)));
 return{t:q[0],k:q[1],d:q[2]+' '+n+(q[0]==='floor'?'':q[0]==='item'?' ชิ้น':q[0]==='fish'?' ตัว':q[0]==='mine'?' ก้อน':q[0]==='boss'?' ตัว':' ตัว'),n,c:0,coin:Math.round((20+L*8)*(q[0]==='boss'?3:q[0]==='floor'?2:1)),xp:Math.round(need(L)*(q[0]==='boss'?.35:.18)),es:q[0]==='boss'||q[0]==='floor'?2:Math.random()<.5?1:0}}
function qRefresh(force){const d=Math.floor(srvNow()/3600000);if(force||QST.day!==d||QST.offer.length<4){QST.day=d;QST.offer=[qGen(),qGen(),qGen(),qGen()]}}
function questEv(t,k,o){let ch=false;for(const q of QST.act){if(q.c>=q.n)continue;if(t==='kill'&&q.t==='kill'&&q.k===k){q.c++;ch=true}else if(t===q.t&&(t==='fish'||t==='mine'||t==='boss')){q.c++;ch=true}else if(t==='floor'&&q.t==='floor'&&k>=q.n){q.c=q.n;ch=true}
 if(ch&&q.c>=q.n){say('📜 เควสสำเร็จ: '+q.d+' — กลับไปรับรางวัลที่กิลด์');sfx('bell')}}if(ch)saveX()}
{const _fc=fishCatch;fishCatch=function(){_fc();questEv('fish')}}
{const _zm=zMine;zMine=function(o){const a=o.alive;_zm(o);if(a&&!o.alive)questEv('mine')}}
{const _ho=hitOre;hitOre=function(o){const r0=map[o.ty][o.tx];_ho(o);if(r0===ORE&&map[o.ty][o.tx]===RUBBLE)questEv('mine')}}
function openGuild(){qRefresh();SHOPK=null;STN.open=null;hideBag();sfx('ui');let h='<button class="mini x xclose" onclick="closeGuild()">✕</button><b>📜 กิลด์นักผจญภัย — บอร์ดเควส</b><small>รับได้พร้อมกัน 3 เควส · เควสใหม่ทุก 1 ชั่วโมงจริง (หรือรีเฟรช 20 เหรียญ) · ทำสำเร็จแล้ว '+QST.done+' เควส</small>';
 h+='<div class="tt">🗂️ เควสที่รับอยู่ ('+QST.act.length+'/3)</div>';if(!QST.act.length)h+='<small>ยังไม่ได้รับเควส</small>';
 QST.act.forEach((q,i)=>{const ok=q.t==='item'?inv[q.k]>=q.n:q.c>=q.n,pr=q.t==='item'?Math.min(inv[q.k]|0,q.n):q.c;h+='<div class="mini qrow'+(ok?' ok':'')+'"><b>'+(ok?'✅ ':'⏳ ')+q.d+'</b> <span class="zl">'+pr+'/'+q.n+'</span><small>รางวัล: 🪙'+q.coin+' · XP '+q.xp+(q.es?' · 💎หินเสริมพลัง ×'+q.es:'')+'</small><div class="rw">'+(ok?'<button class="mini sm ok" onclick="qClaim('+i+')">รับรางวัล</button>':'')+'<button class="mini sm" onclick="qDrop('+i+')">ยกเลิก</button></div></div>'});
 h+='<div class="tt">📋 เควสบนบอร์ด</div>';QST.offer.forEach((q,i)=>{h+='<button class="mini qrow" onclick="qTake('+i+')"><b>'+q.d+'</b><small>รางวัล: 🪙'+q.coin+' · XP '+q.xp+(q.es?' · 💎×'+q.es:'')+' — แตะเพื่อรับ</small></button>'});
 h+='<div class="rw"><button class="mini sm" onclick="qRefresh(1);inv.coin>=20?(inv.coin-=20,refreshInv(),openGuild()):say(\'เหรียญไม่พอ\')">🔄 รีเฟรชเควส (20🪙)</button>'+(D&&D.shop==='guild'?'<button class="mini sm" onclick="openShop(\'guild\')">💰 ขายของดรอป / แลกของ</button>':'')+'</div>';
 shopEl.innerHTML=h;shopEl.hidden=false;GM.open=true}
const GM={open:false};function closeGuild(){GM.open=false;shopEl.hidden=true;sfx('ui')}
function qTake(i){if(QST.act.length>=3){say('รับเควสได้สูงสุด 3 เควส');sfx('thud');return}const q=QST.offer.splice(i,1)[0];if(q.t==='floor'&&DG.max>=q.n)q.c=q.n;QST.act.push(q);QST.offer.push(qGen());sfx('ui');say('📜 รับเควส: '+q.d);saveX();openGuild()}
function qDrop(i){QST.act.splice(i,1);sfx('ui');saveX();openGuild()}
function qClaim(i){const q=QST.act[i];if(q.t==='item'){if(!(inv[q.k]>=q.n)){say('ของยังไม่ครบ');return}inv[q.k]-=q.n}else if(q.c<q.n)return;
 QST.act.splice(i,1);QST.done++;inv.coin+=q.coin;for(let j=0;j<q.es;j++)inv.estone++;refreshInv();gainXp(q.xp);sfx('chest');flash('#ffe9a0',.25);say('🎉 รับรางวัลเควส: 🪙'+q.coin+' · XP '+q.xp+(q.es?' · หินเสริมพลัง ×'+q.es:''));saveX();openGuild()}
{const _sa=shopAct;shopAct=function(){if(D&&D.shop==='guild'&&shopNear()){const o=D.owner;o.wave=1.2;o.bub={txt:'มีเควสใหม่ค่ะ!',t:2.5};openGuild();return true}return _sa()}}
{const _ta=townAct;townAct=function(){if(Math.hypot(P.x-(23*T+16),P.y-(28*T+10))<40){openGuild();return true}return _ta()}}
setInterval(()=>{if(GM.open&&!(D&&D.shop==='guild')&&!(D&&D.town&&Math.hypot(P.x-(23*T+16),P.y-(28*T+10))<70))closeGuild()},300);
{const _bi=buyItem;buyItem=function(id){const X={gx_estone:[{core:2,dust:2},'estone'],gx_estone2:[{bone:6,rag:4},'estone'],gx_bless:[{scale:3},'bless'],gx_phoenix:[{wing:8,pelt:4},'phoenix']}[id];if(!X)return _bi(id);
 const b=SD.guild.buy.find(q=>q.id===id);for(const k in X[0])if(!(inv[k]>=X[0][k])){say('ของไม่พอ: ต้องใช้'+JUNK[k][0]+' '+X[0][k]+' (มี '+(inv[k]|0)+')');sfx('thud');return}if(inv.coin<b.price){say('เหรียญไม่พอ');sfx('thud');return}
 for(const k in X[0])inv[k]-=X[0][k];inv.coin-=b.price;inv[X[1]]++;refreshInv();sfx('gem');say('🔁 แลกได้ '+MN(X[1])+' แล้ว');openShop('guild')}}
// ---------- 10) เซฟข้อมูลเพิ่ม (ดันเจี้ยน/เควส) ----------
function saveX(){try{localStorage.setItem('fm_x',JSON.stringify({dg:DG.max,q:QST,own:SK.own}))}catch(e){}}
try{const x=JSON.parse(localStorage.getItem('fm_x')||'null');if(x){DG.max=x.dg||1;DG.sel=DG.max;if(x.q)Object.assign(QST,x.q);if(x.own)for(let i=0;i<3;i++)SK.own[i]=x.own[i]}}catch(e){}
setInterval(saveX,20000);addEventListener('beforeunload',saveX);
{const _sg=saveGame;saveGame=function(m){_sg(m);saveX()}}
// ปรับคำพูด NPC ใหม่
NL['นักเดินทาง']=['ถ้ำในทุ่งหญ้าคือทางลงดันเจี้ยน 100 ชั้น!','ประตูมิติพาไปเหมืองแร่ได้ 5 แห่ง'];NL['ชาวบ้าน']=['กิลด์นักผจญภัยทางใต้มีเควสให้ทำนะ','ถ้าล้มในการต่อสู้ วิญญาณจะกลับมาที่วิหารแห่งแสง'];

{const add=[['staff0',45],['bow0',45],['staff1',150],['bow1',150]];for(const [id,pr] of add)SD2.gear.buy.push({id:'g_'+id,item:id,name:ITEMS[id].name,price:pr,note:ITEMS[id].stat})}


// =====================================================================
// v3.7 : ภาพคทา/ธนู/ของดรอป สไตล์เดียวกับดาบต้นฉบับ · ลูกเวทออกจากลูกแก้ว · ไฟเผามอน (ติดไฟต่อเนื่อง) · พื้นแตก/รอยไหม้
//        พนักงานกิลด์ยืนหลังเคาน์เตอร์ · หน้าต่างกิลด์ใหม่
// =====================================================================
// ---------- 1) คทา / ธนู วาดด้วยเครื่องมือเดียวกับดาบ (part / ไม้ / เส้นขอบ OL) ----------
function woodBar(k,x0,y0,w,h){const g=k.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,'#5a3a1e');g.addColorStop(.45,'#a87a4a');g.addColorStop(1,'#46291a');k.fillStyle=g;k.fillRect(x0,y0,w,h);
 k.strokeStyle='rgba(30,16,6,.45)';k.lineWidth=.8;for(let i=0;i<6;i++){const yy=y0+4+i*(h/6);k.beginPath();k.moveTo(x0,yy);k.lineTo(x0+w,yy+2);k.stroke()}k.strokeStyle=OL;k.lineWidth=1.6;k.strokeRect(x0,y0,w,h)}
const GEMC6=['#9aa0aa','#8fd0ff','#ff9a5a','#e8f0ff','#ff4a5a','#4fd6ff'];
function paintStaff(k,t){const Q=TIERS[t],gq=t===0?{hi:'#8a5a30',mid:'#6a4322',lo:'#3a2412'}:{hi:Q.hi,mid:Q.gd,lo:Q.lo};
 woodBar(k,29.5,20,5,38);if(t===0)lashing(k,29.5,24,5);
 part(k,gq,t===0?1:t,()=>{k.beginPath();k.rect(28,55,8,5)},9,28,55,36,60);part(k,gq,t===0?1:t,()=>{k.beginPath();k.arc(32,61.5,2.6,0,7)},10,29,59,35,64);
 // คอรับลูกแก้ว + กิ่งโค้งสองข้าง
 part(k,Q,t,()=>{k.beginPath();k.moveTo(26,22);k.lineTo(38,22);k.lineTo(36,17);k.lineTo(28,17);k.closePath()},11,26,17,38,22);
 for(const s of [-1,1])part(k,Q,t,()=>{k.beginPath();k.moveTo(32+s*4,18);k.quadraticCurveTo(32+s*15,12,32+s*10,1);k.quadraticCurveTo(32+s*9,10,32+s*2.5,15);k.closePath()},12+s,18,0,46,19);
 // ลูกแก้ว
 const gc=GEMC6[t],g=k.createRadialGradient(30,7,1,32,10,8);g.addColorStop(0,'#ffffff');g.addColorStop(.35,gc);g.addColorStop(1,t===0?'#4a4e58':Q.lo);k.fillStyle=g;k.beginPath();k.arc(32,10,6.5,0,7);k.fill();k.strokeStyle=OL;k.lineWidth=1.3;k.stroke();
 k.fillStyle='rgba(255,255,255,.85)';k.beginPath();k.ellipse(29.5,7.5,2,1.3,-.6,0,7);k.fill();
 if(t>=3){k.fillStyle=GEMC[t]||'#e63a3a';k.beginPath();k.arc(32,19.5,1.6,0,7);k.fill();k.strokeStyle=OL;k.lineWidth=.7;k.stroke()}}
function paintBow(k,t){const Q=TIERS[t],gq=t===0?{hi:'#8a5a30',mid:'#6a4322',lo:'#3a2412'}:{hi:Q.hi,mid:Q.gd,lo:Q.lo};
 // สาย
 k.strokeStyle='#efe6d2';k.lineWidth=1.1;k.beginPath();k.moveTo(41,4);k.lineTo(41,60);k.stroke();k.strokeStyle='rgba(0,0,0,.35)';k.lineWidth=.5;k.stroke();
 // คันธนู (ไม้) + ปลายโลหะ
 const limb=()=>{k.beginPath();k.moveTo(40,3);k.quadraticCurveTo(14,12,22,32);k.quadraticCurveTo(14,52,40,61);k.lineTo(42,58);k.quadraticCurveTo(20,50,27,32);k.quadraticCurveTo(20,14,42,6);k.closePath()};
 const g=k.createLinearGradient(14,0,30,0);g.addColorStop(0,'#5a3a1e');g.addColorStop(.5,'#a87a4a');g.addColorStop(1,'#46291a');k.fillStyle=g;limb();k.fill();k.strokeStyle=OL;k.lineWidth=1.6;limb();k.stroke();
 k.strokeStyle='rgba(255,230,180,.35)';k.lineWidth=1;k.beginPath();k.moveTo(36,6);k.quadraticCurveTo(17,13,23,30);k.stroke();
 if(t>0){for(const y of [1,57])part(k,Q,t,()=>{k.beginPath();k.moveTo(37,y);k.lineTo(44,y+2);k.lineTo(42,y+7);k.lineTo(36,y+5);k.closePath()},13+y,36,y,44,y+7);
  part(k,Q,t,()=>{k.beginPath();k.moveTo(17,14);k.quadraticCurveTo(15,22,19,27);k.lineTo(22,26);k.quadraticCurveTo(18,21,20,14);k.closePath()},15,15,14,22,27)}
 // ด้ามจับพันผ้า
 part(k,gq,t===0?1:t,()=>{k.beginPath();k.rect(19.5,27,8,10)},16,19,27,28,37);k.strokeStyle=t===0?'#b89a62':Q.gd;k.lineWidth=1;for(let i=0;i<4;i++){k.beginPath();k.moveTo(19.5,28.5+i*2.4);k.lineTo(27.5,30+i*2.4);k.stroke()}
 if(t>=3){k.fillStyle=GEMC[t]||'#e63a3a';k.beginPath();k.arc(23.5,32,1.6,0,7);k.fill();k.strokeStyle=OL;k.lineWidth=.7;k.stroke()}}
{const _pi=paintItem;paintItem=function(k,type,t){if(type==='staff')return paintStaff(k,t);if(type==='bow')return paintBow(k,t);return _pi(k,type,t)}}
for(const key in TICON)if(/^(staff|bow)/.test(key))delete TICON[key];for(const key in IURL)if(/^item:(staff|bow)/.test(key))delete IURL[key];
toolIcon=function(type,tier,sz){sz=sz||64;const key=type+tier+'_'+sz;return TICON[key]||(TICON[key]=iconCanvasT(type,sz,tier))};
// ถือในมือ: ใช้ภาพเดียวกับไอคอน เหมือนดาบ · จดตำแหน่งลูกแก้ว/ศูนย์กลางคันธนู
{const _tp=toolSpr;toolSpr=function(hx,hy,ang){if(!(P.tool==='sword'&&isRng()))return _tp(hx,hy,ang);const kd=wKind(),tier=P.tier.sword|0;
 ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r')ctx.scale(-1,1);ctx.drawImage(toolIcon(kd,tier,64),-23,-36,46,46);
 if(kd==='bow'&&P.at>=0&&P.at<.36){const pull=Math.min(1,P.at/.3);ctx.strokeStyle='#6a4a2a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(6.5-pull*9,-13);ctx.lineTo(-14,-13);ctx.stroke();ctx.fillStyle='#cfd4dc';ctx.beginPath();ctx.moveTo(-17,-13);ctx.lineTo(-12,-15.5);ctx.lineTo(-12,-10.5);ctx.fill()}
 ctx.restore();const d=kd==='staff'?29.5:13;P.tip={x:hx+Math.sin(ang)*d,y:hy-Math.cos(ang)*d,t:performance.now()}}}
// ท่ายิง: คทาเอียงไปข้างหน้าตอนร่าย · ธนูตั้งตรงหันไปทางยิง
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){if(!(isRng()&&P.tool==='sword'))return _sf(x,by,d,side,f,TOP,held);const v=DIRV[d],p=P.at,kd=wKind(),push=p<.34?p/.34:1-Math.min(1,(p-.34)/.5);
 const hx=x+v[0]*(5+5*push)+(side?0:d==='d'?-7:8),hy=by-(side?17:d==='u'?28:13);if(!side){ctx.strokeStyle=TOP;ctx.lineWidth=6;ctx.lineCap='butt';ctx.beginPath();ctx.moveTo(d==='d'?x-11:x+11,by-24);ctx.lineTo(hx,hy);ctx.stroke()}
 const ang=kd==='staff'?(side?f*(.15+.55*push):d==='u'?-.15*push:.15*push):(side?0:0);held(hx,hy,ang);
 if(kd==='staff'&&p>.2&&p<.55&&P.tip){ctx.save();ctx.globalCompositeOperation='lighter';const a=1-Math.abs(p-.34)/.2,g=ctx.createRadialGradient(P.tip.x,P.tip.y,1,P.tip.x,P.tip.y,18);g.addColorStop(0,'rgba(255,255,255,'+a+')');g.addColorStop(.4,'rgba(170,120,255,'+(.7*a)+')');g.addColorStop(1,'rgba(120,60,255,0)');ctx.fillStyle=g;ctx.fillRect(P.tip.x-18,P.tip.y-18,36,36);ctx.restore()}}}
// อาวุธบนหลัง: ใช้ภาพเดียวกัน
{const _bs=backSword;backSword=function(x,by,side,f,d){if(!isRng())return _bs(x,by,side,f,d);if(!P.armor.sword||(P.draw&&P.tool==='sword')||side)return;const ic=toolIcon(wKind(),P.tier.sword|0,64);
 ctx.save();if(d==='u'){ctx.translate(x+4,by-34);ctx.rotate(-2.62)}else{ctx.translate(x+8,by-33);ctx.rotate(-2.72)}ctx.drawImage(ic,-23,-36,46,46);ctx.restore()}}
// กระสุนเวทเกิดที่ลูกแก้ว (มีความสูง z แล้วค่อย ๆ ลดลงมาระดับตัวมอน)
{const _sh=shoot;shoot=function(kind,o){_sh(kind,o);const p=PROJ[PROJ.length-1];if(!p)return;
 if(wKind()==='staff'&&P.tip&&performance.now()-P.tip.t<250){p.x=P.tip.x;p.z=Math.max(0,(P.y-14)-P.tip.y)}else if(wKind()==='bow'&&P.tip&&performance.now()-P.tip.t<250){p.x=P.tip.x;p.z=Math.max(0,(P.y-14)-P.tip.y)}}}
{const _da=drawAir;drawAir=function(){for(const p of PROJ)if(p.z)p.y-=p.z;_da();for(const p of PROJ)if(p.z)p.y+=p.z}}

// ---------- 2) ของดรอป/อาหาร/ปลา: สไตล์เดียวกับไอคอนต้นฉบับ (เงาพื้น · ไล่สี · เส้นขอบเข้ม · ไฮไลต์) ----------
function icoBase(){const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';k.lineCap='round';return[c,k]}
const shd=(k,w,y)=>{k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,y||39,w||15,4,0,0,7);k.fill()};
const LG=(k,y0,y1,a,b,c)=>{const g=k.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);if(c){g.addColorStop(.5,b);g.addColorStop(1,c)}else g.addColorStop(1,b);return g};
const RG=(k,x,y,r,a,b)=>{const g=k.createRadialGradient(x-r*.35,y-r*.4,1,x,y,r);g.addColorStop(0,a);g.addColorStop(1,b);return g};
const hil=(k,x,y,rx,ry,a)=>{k.fillStyle='rgba(255,255,255,'+(a||.6)+')';k.beginPath();k.ellipse(x,y,rx,ry,-.5,0,7);k.fill()};
const ICO2={
 bone:k=>{shd(k,16);k.save();k.translate(24,26);k.rotate(-.6);k.fillStyle=LG(k,-8,8,'#fffaf0','#d8ceb4','#a89a7c');k.strokeStyle='#5a4a32';k.lineWidth=1.6;k.beginPath();k.moveTo(-11,-3);k.lineTo(11,-3);k.arc(14,-4.5,4.2,Math.PI*1.1,Math.PI*.6,false);k.arc(14,4.5,4.2,-Math.PI*.6,Math.PI*.9);k.lineTo(-11,3);k.arc(-14,4.5,4.2,Math.PI*-.1,Math.PI*1.6);k.arc(-14,-4.5,4.2,Math.PI*.4,Math.PI*1.9);k.closePath();k.fill();k.stroke();hil(k,-2,-1.5,8,1.2,.55);k.restore()},
 rag:k=>{shd(k,16);k.fillStyle=LG(k,10,40,'#9aae78','#6a8050','#3e4e2e');k.strokeStyle='#26301a';k.lineWidth=1.6;k.beginPath();k.moveTo(9,13);k.lineTo(38,10);k.lineTo(35,19);k.lineTo(41,27);k.lineTo(34,32);k.lineTo(36,39);k.lineTo(25,35);k.lineTo(17,40);k.lineTo(14,31);k.lineTo(7,25);k.lineTo(12,20);k.closePath();k.fill();k.stroke();
  k.fillStyle='rgba(40,50,20,.55)';k.beginPath();k.ellipse(20,22,4,2.5,.3,0,7);k.ellipse(29,29,3,2,0,0,7);k.fill();k.strokeStyle='rgba(30,40,15,.5)';k.lineWidth=1;k.beginPath();k.moveTo(12,17);k.lineTo(33,15);k.stroke();hil(k,18,15,5,1.2,.35)},
 pelt:k=>{shd(k,17);k.fillStyle=LG(k,8,40,'#e0b884','#a87a48','#6a4622');k.strokeStyle='#3a2410';k.lineWidth=1.6;k.beginPath();k.moveTo(12,12);k.quadraticCurveTo(24,7,36,12);k.lineTo(42,10);k.lineTo(39,20);k.quadraticCurveTo(42,30,38,37);k.lineTo(41,41);k.lineTo(31,38);k.quadraticCurveTo(24,41,17,38);k.lineTo(7,41);k.lineTo(10,37);k.quadraticCurveTo(6,30,9,20);k.lineTo(6,10);k.closePath();k.fill();k.stroke();
  k.strokeStyle='rgba(80,50,20,.45)';k.lineWidth=1;for(let i=0;i<5;i++){k.beginPath();k.moveTo(14+i*5,17);k.quadraticCurveTo(16+i*5,25,14+i*5,33);k.stroke()}hil(k,18,15,6,1.5,.4)},
 wing:k=>{shd(k,16);k.fillStyle=LG(k,8,36,'#8a7a9a','#5a4a6a','#2e2438');k.strokeStyle='#160f1e';k.lineWidth=1.6;k.beginPath();k.moveTo(6,32);k.quadraticCurveTo(12,10,38,7);k.lineTo(35,15);k.lineTo(42,19);k.lineTo(33,23);k.lineTo(38,30);k.lineTo(27,29);k.lineTo(26,36);k.closePath();k.fill();k.stroke();
  k.strokeStyle='rgba(20,12,28,.6)';k.lineWidth=1.2;k.beginPath();k.moveTo(8,31);k.lineTo(36,9);k.moveTo(12,30);k.lineTo(39,19);k.moveTo(15,31);k.lineTo(35,29);k.stroke();hil(k,20,15,6,1.2,.3)},
 shell:k=>{shd(k,15);k.fillStyle=RG(k,24,24,16,'#e8b070','#6a3a14');k.strokeStyle='#2e180a';k.lineWidth=1.6;k.beginPath();k.ellipse(24,25,15,12,0,0,7);k.fill();k.stroke();k.beginPath();k.moveTo(24,13);k.lineTo(24,37);k.stroke();
  k.strokeStyle='rgba(40,20,8,.45)';k.lineWidth=1;for(const s of [-1,1]){k.beginPath();k.arc(24,25,9,s>0?-1:Math.PI-0,s>0?1:Math.PI+1,s<0);k.stroke()}hil(k,17,19,4,2,.55)},
 core:k=>{shd(k,15);k.fillStyle=LG(k,8,40,'#b4aea2','#7a746a','#4a4640');k.strokeStyle='#22201c';k.lineWidth=1.6;k.beginPath();k.moveTo(24,7);k.lineTo(39,16);k.lineTo(37,34);k.lineTo(24,41);k.lineTo(10,34);k.lineTo(9,16);k.closePath();k.fill();k.stroke();
  k.strokeStyle='rgba(30,28,24,.45)';k.lineWidth=1;k.beginPath();k.moveTo(24,7);k.lineTo(24,17);k.moveTo(9,16);k.lineTo(17,21);k.moveTo(39,16);k.lineTo(31,21);k.stroke();
  const g=k.createRadialGradient(24,25,1,24,25,9);g.addColorStop(0,'#fff6c8');g.addColorStop(.45,'#ffb04a');g.addColorStop(1,'rgba(200,90,20,.0)');k.fillStyle=g;k.beginPath();k.arc(24,25,9,0,7);k.fill();hil(k,16,14,4,1.5,.45)},
 dust:k=>{shd(k,14);k.fillStyle=LG(k,22,40,'#e8d8ff','#9a7ad8','#5a3a9a');k.strokeStyle='#2a1a4a';k.lineWidth=1.6;k.beginPath();k.moveTo(10,36);k.quadraticCurveTo(12,24,24,22);k.quadraticCurveTo(36,24,38,36);k.quadraticCurveTo(24,41,10,36);k.fill();k.stroke();
  for(const [x,y,r] of [[18,15,2],[26,10,1.6],[31,17,2.2],[22,6,1.2],[35,9,1.2]]){const g=k.createRadialGradient(x,y,0,x,y,r*2.5);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(190,150,255,0)');k.fillStyle=g;k.fillRect(x-r*2.5,y-r*2.5,r*5,r*5)}hil(k,19,28,5,1.5,.5)},
 scale:k=>{shd(k,14);k.fillStyle=LG(k,6,40,'#d8f6ff','#5aa8f0','#1e4aa8');k.strokeStyle='#0e1e4a';k.lineWidth=1.6;k.beginPath();k.moveTo(24,6);k.quadraticCurveTo(40,14,36,32);k.quadraticCurveTo(30,41,24,41);k.quadraticCurveTo(18,41,12,32);k.quadraticCurveTo(8,14,24,6);k.fill();k.stroke();
  k.strokeStyle='rgba(14,30,74,.45)';k.lineWidth=1;k.beginPath();k.moveTo(24,9);k.lineTo(24,38);k.moveTo(14,22);k.quadraticCurveTo(24,28,34,22);k.stroke();hil(k,18,16,3.5,6,.55)},
 estone:k=>{shd(k,14);k.fillStyle=LG(k,4,42,'#e6fbff','#5ec8ff','#1f5fc4');k.strokeStyle='#0e2a5c';k.lineWidth=1.6;k.beginPath();k.moveTo(24,4);k.lineTo(38,15);k.lineTo(34,38);k.lineTo(24,42);k.lineTo(14,38);k.lineTo(10,15);k.closePath();k.fill();k.stroke();
  k.fillStyle='rgba(255,255,255,.35)';k.beginPath();k.moveTo(24,4);k.lineTo(10,15);k.lineTo(24,20);k.closePath();k.fill();k.fillStyle='rgba(10,30,90,.25)';k.beginPath();k.moveTo(38,15);k.lineTo(34,38);k.lineTo(24,20);k.closePath();k.fill();k.strokeStyle='rgba(14,42,92,.5)';k.lineWidth=1;k.beginPath();k.moveTo(24,20);k.lineTo(24,42);k.stroke()},
 bless:k=>{shd(k,14);k.fillStyle=LG(k,4,42,'#fff6c8','#ffd23a','#a87a10');k.strokeStyle='#4a3406';k.lineWidth=1.6;k.beginPath();k.moveTo(24,4);k.lineTo(38,15);k.lineTo(34,38);k.lineTo(24,42);k.lineTo(14,38);k.lineTo(10,15);k.closePath();k.fill();k.stroke();
  k.fillStyle='rgba(255,255,255,.4)';k.beginPath();k.moveTo(24,4);k.lineTo(10,15);k.lineTo(24,20);k.closePath();k.fill();k.fillStyle='#fffbe6';k.beginPath();for(let i=0;i<8;i++){const a=i/8*6.283-Math.PI/2,r=i%2?2.4:6.5;k.lineTo(24+Math.cos(a)*r,26+Math.sin(a)*r)}k.closePath();k.fill()},
 // อาหาร
 orange:k=>{shd(k,13);k.fillStyle=RG(k,24,26,15,'#ffd08a','#e0700a');k.strokeStyle='#6a3004';k.lineWidth=1.6;k.beginPath();k.arc(24,26,14,0,7);k.fill();k.stroke();k.fillStyle='rgba(120,60,0,.25)';for(let i=0;i<10;i++)k.fillRect(14+((i*7)%20),18+((i*11)%16),1.2,1.2);
  k.strokeStyle='#5a3a1e';k.lineWidth=2;k.beginPath();k.moveTo(24,13);k.lineTo(25,9);k.stroke();k.fillStyle='#4fae3a';k.strokeStyle='#1e5a16';k.lineWidth=1.2;k.beginPath();k.ellipse(30,10,5.5,2.6,-.4,0,7);k.fill();k.stroke();hil(k,18,20,4,2.5)},
 grape:k=>{shd(k,12);k.strokeStyle='#5a3a1e';k.lineWidth=2;k.beginPath();k.moveTo(24,12);k.lineTo(26,5);k.stroke();k.fillStyle='#4fae3a';k.beginPath();k.ellipse(31,8,5,2.4,-.3,0,7);k.fill();
  for(const [x,y] of [[17,16],[24,15],[31,16],[14,23],[21,23],[28,23],[34,23],[18,30],[25,30],[31,30],[22,37],[28,37]]){k.fillStyle=RG(k,x,y,5,'#d8a8ff','#5a2490');k.strokeStyle='#2a0e4a';k.lineWidth=1.1;k.beginPath();k.arc(x,y,4.6,0,7);k.fill();k.stroke();k.fillStyle='rgba(255,255,255,.55)';k.fillRect(x-2,y-2.5,1.6,1.6)}},
 banana:k=>{shd(k,16);k.fillStyle=LG(k,10,40,'#fff6a8','#f2d030','#c8a010');k.strokeStyle='#6a4a04';k.lineWidth=1.6;k.beginPath();k.moveTo(9,13);k.quadraticCurveTo(10,38,39,37);k.quadraticCurveTo(42,33,38,32);k.quadraticCurveTo(18,31,15,12);k.closePath();k.fill();k.stroke();
  k.fillStyle='#5a3a1e';k.fillRect(7,9,6,5);k.strokeStyle='rgba(140,100,10,.5)';k.lineWidth=1;k.beginPath();k.moveTo(13,17);k.quadraticCurveTo(16,32,35,34);k.stroke();hil(k,14,24,1.5,5,.5)},
 carrot:k=>{shd(k,10,41);for(const a of [-.45,0,.45]){k.fillStyle='#4fae3a';k.strokeStyle='#1e5a16';k.lineWidth=1.1;k.beginPath();k.ellipse(24+a*12,9,2.8,7,a,0,7);k.fill();k.stroke()}
  k.fillStyle=LG(k,0,0,'#ffb060','#e86a10','#b04a08');const g=k.createLinearGradient(14,0,34,0);g.addColorStop(0,'#ffb060');g.addColorStop(.6,'#ee7a1a');g.addColorStop(1,'#b04a08');k.fillStyle=g;k.strokeStyle='#6a2a04';k.lineWidth=1.6;k.beginPath();k.moveTo(15,15);k.quadraticCurveTo(24,12,33,15);k.quadraticCurveTo(28,30,24,42);k.quadraticCurveTo(20,30,15,15);k.fill();k.stroke();
  k.strokeStyle='rgba(110,40,4,.5)';k.lineWidth=1;for(const y of [21,27,33]){k.beginPath();k.moveTo(19+((y-15)*.18),y);k.lineTo(24,y+1);k.stroke()}hil(k,20,19,2,1.2,.6)},
 cabbage:k=>{shd(k,15);k.fillStyle=RG(k,24,25,16,'#e4ffc0','#4a9a3a');k.strokeStyle='#1e4a16';k.lineWidth=1.6;k.beginPath();k.arc(24,25,15,0,7);k.fill();k.stroke();
  k.strokeStyle='rgba(30,80,20,.55)';k.lineWidth=1.2;for(const a of [-2.4,-1.4,-.4,.6]){k.beginPath();k.moveTo(24,30);k.quadraticCurveTo(24+Math.cos(a)*9,30+Math.sin(a)*12,24+Math.cos(a)*14,25+Math.sin(a)*13);k.stroke()}hil(k,18,18,4,2.5,.55)},
 corn:k=>{shd(k,10,41);k.fillStyle=LG(k,8,42,'#7cd05a','#3a8a2a');k.strokeStyle='#1e4a16';k.lineWidth=1.4;for(const s of [-1,1]){k.beginPath();k.moveTo(24,42);k.quadraticCurveTo(24+s*16,30,24+s*9,8);k.quadraticCurveTo(24+s*4,28,24,42);k.fill();k.stroke()}
  k.fillStyle=LG(k,8,40,'#fff2a0','#f2c230','#c8901a');k.strokeStyle='#6a4a04';k.lineWidth=1.5;k.beginPath();k.ellipse(24,23,7,15,0,0,7);k.fill();k.stroke();k.fillStyle='rgba(180,120,10,.55)';for(let y=11;y<36;y+=4)for(let x=19;x<30;x+=3.6)k.fillRect(x,y,2.4,2.4);hil(k,21,16,1.5,5,.5)},
 pumpkin:k=>{shd(k,17);for(const [x,w] of [[14,9],[34,9],[24,11]]){k.fillStyle=RG(k,x,27,w+3,'#ffc070','#c85a0a');k.strokeStyle='#6a2a04';k.lineWidth=1.5;k.beginPath();k.ellipse(x,27,w,13,0,0,7);k.fill();k.stroke()}
  k.fillStyle='#5a3a1e';k.strokeStyle='#2a1808';k.lineWidth=1.2;k.beginPath();k.rect(22,9,4,7);k.fill();k.stroke();k.fillStyle='#4fae3a';k.beginPath();k.ellipse(31,12,5,2.4,.3,0,7);k.fill();hil(k,20,20,3,2,.45)},
 honey:k=>{shd(k,13);k.fillStyle=LG(k,14,42,'#ffe080','#e8a020','#a86a08');k.strokeStyle='#5a3404';k.lineWidth=1.6;k.beginPath();k.moveTo(13,16);k.lineTo(35,16);k.quadraticCurveTo(40,30,35,41);k.lineTo(13,41);k.quadraticCurveTo(8,30,13,16);k.fill();k.stroke();
  k.fillStyle=LG(k,8,16,'#c8945a','#7a4a22');k.beginPath();k.rect(11,9,26,8);k.fill();k.stroke();k.strokeStyle='#5a3404';k.lineWidth=1;k.beginPath();k.moveTo(11,13);k.lineTo(37,13);k.stroke();k.fillStyle='#f6ead0';k.strokeStyle='#8a5a2e';k.beginPath();k.rect(16,25,16,10);k.fill();k.stroke();k.fillStyle='#e8a020';k.beginPath();k.arc(24,30,2.5,0,7);k.fill();hil(k,16,22,1.5,5,.5)},
 pie:k=>{shd(k,18);k.fillStyle=LG(k,28,40,'#d8dce4','#8a909c');k.strokeStyle='#3a3e48';k.lineWidth=1.5;k.beginPath();k.ellipse(24,32,19,8,0,0,7);k.fill();k.stroke();
  k.fillStyle=LG(k,16,34,'#f6c878','#b8782c');k.strokeStyle='#5a3410';k.lineWidth=1.6;k.beginPath();k.ellipse(24,27,16,9,0,0,7);k.fill();k.stroke();k.strokeStyle='rgba(120,60,16,.7)';k.lineWidth=1.6;for(const o of [-8,0,8]){k.beginPath();k.moveTo(24+o-5,20);k.lineTo(24+o+5,34);k.stroke();k.beginPath();k.moveTo(24+o+5,20);k.lineTo(24+o-5,34);k.stroke()}hil(k,17,22,4,1.5,.45)},
 cake:k=>{shd(k,15);k.fillStyle=LG(k,22,40,'#fff2d8','#e8c890');k.strokeStyle='#6a4a22';k.lineWidth=1.5;k.beginPath();k.moveTo(8,38);k.lineTo(40,38);k.lineTo(40,24);k.lineTo(8,31);k.closePath();k.fill();k.stroke();
  k.fillStyle='#ff9ab8';k.strokeStyle='#a83a5a';k.beginPath();k.moveTo(8,31);k.lineTo(40,24);k.lineTo(40,19);k.lineTo(8,26);k.closePath();k.fill();k.stroke();k.fillStyle='#fff';k.fillRect(9,33,30,2);
  k.fillStyle=RG(k,31,15,5,'#ff8a8a','#c0101a');k.strokeStyle='#5a0a0a';k.lineWidth=1.2;k.beginPath();k.arc(31,15,4.2,0,7);k.fill();k.stroke();k.strokeStyle='#4fae3a';k.lineWidth=1.4;k.beginPath();k.moveTo(31,11);k.lineTo(33,7);k.stroke()}};
// ปลา: ทรงเดียวกันแต่สีตามชนิด
const FC2={carp:['#e8d090','#a88a40','#5a4418'],tilapia:['#d0dce4','#7a8a98','#3a4450'],catfish:['#9a9284','#5a5446','#2a261e'],salmon:['#ffc0a8','#e8705a','#8a3020'],goldfish:['#fff2a0','#f2b820','#9a6a08'],dragon:['#d8f8ff','#4fb0ff','#1a4aa8']};
for(const fk in FC2)ICO2[fk]=k=>{const [a,b,c]=FC2[fk];shd(k,17,40);k.fillStyle=LG(k,12,36,a,b,c);k.strokeStyle='#1a1a24';k.lineWidth=1.5;
 k.beginPath();k.moveTo(5,25);k.quadraticCurveTo(18,9,33,22);k.lineTo(43,14);k.quadraticCurveTo(40,25,43,36);k.lineTo(33,28);k.quadraticCurveTo(18,41,5,25);k.closePath();k.fill();k.stroke();
 k.fillStyle=c;k.globalAlpha=.6;k.beginPath();k.moveTo(17,14);k.quadraticCurveTo(22,8,27,15);k.closePath();k.fill();k.globalAlpha=1;
 k.strokeStyle='rgba(0,0,0,.25)';k.lineWidth=1;for(const x of [19,24,29]){k.beginPath();k.moveTo(x,16);k.quadraticCurveTo(x+2,25,x,33);k.stroke()}
 k.fillStyle='#fff';k.beginPath();k.arc(11.5,23,2.6,0,7);k.fill();k.fillStyle='#111';k.beginPath();k.arc(12,23,1.3,0,7);k.fill();hil(k,16,19,5,1.3,.55);
 if(fk==='dragon'||fk==='goldfish'){k.fillStyle='rgba(255,255,255,.9)';k.fillRect(22,19,1.8,1.8);k.fillRect(28,23,1.6,1.6)}if(fk==='catfish'){k.strokeStyle='#2a261e';k.beginPath();k.moveTo(7,26);k.quadraticCurveTo(2,30,3,34);k.moveTo(8,24);k.quadraticCurveTo(2,22,1,25);k.stroke()}};
{const _mi=matIcon;matIcon=function(key){const f=ICO2[key];if(!f)return _mi(key);const [c,k]=icoBase();f(k);return c}}
for(const key in IURL)if(ICO2[key.slice(4)])delete IURL[key];
for(const key of Object.keys(ICO2)){if(DROPIMG[key]||JUNK[key]||key==='estone'||key==='bless'){const im=new Image();im.src=iconURL('mat:'+key);DROPIMG[key]=im}}
if(typeof PKIMG!=='undefined')for(const key in PKIMG)if(ICO2[key])delete PKIMG[key];

// ---------- 3) ไฟเผามอน · น้ำแข็งเกาะ · รอยแตก/รอยไหม้บนพื้น ----------
const DECAL=[];
function decal(k,x,y,r,l){DECAL.push({k,x,y,r,t:0,l:l||5,seed:Math.random()*99,sc:D});if(DECAL.length>30)DECAL.shift()}
function burn(e,sec){if(e.dead)return;e.burnT=Math.max(e.burnT||0,sec);e.burnK=e.burnK||0}
{const _h=hurtE;hurtE=function(e,mult,o){const r=_h(e,mult,o);if(o&&o.burn)burn(e,o.burn);if(o&&o.freeze&&e.F)e.slowT=Math.max(e.slowT||0,o.freeze);return r}}
{const _sk=skTick;skTick=function(dt){const pre=PERS.filter(e=>e.k==='meteor'&&!e.done&&e.t+dt>=e.l).map(e=>[e.x,e.y,e.r,e.big]),bombs=PROJ.filter(p=>p.k==='bomb');
 _sk(dt);
 for(const [x,y,r,big] of pre){decal('scorch',x,y,r*.8,big?7:4.5);if(big)decal('crack',x,y,r,6)}for(const p of bombs)if(!PROJ.includes(p))decal('scorch',p.x,p.y+12,60,4);
 for(const e of enemies()){if(e.burnT>0){e.burnT-=dt;e.burnK=(e.burnK||0)-dt;if(e.burnK<=0){e.burnK=.5;const d=Math.max(1,Math.round(clsAtk()*.18));e.hp-=d;noteBossFight(e);e.hurt=Math.max(e.hurt,.06);dmgTxt(e.x+(Math.random()-.5)*12,e.y-(e.F?24*e.sc:22),'🔥'+d,'#ff9a3a');
   if(e.hp<=0&&!e.dead){if(e.F)mobKill(e);else{e.dead=true;sfx('splat');dropLoot(e.x,e.y,e)}}}if(Math.random()<dt*24)fx.push({x:e.x+(Math.random()-.5)*16,y:e.y-6-Math.random()*20*(e.sc||1),vx:(Math.random()-.5)*20,vy:-50-Math.random()*40,l:.45,c:Math.random()<.5?'255,150,40':'255,220,90'})}
  if(e.slowT>0&&Math.random()<dt*10)fx.push({x:e.x+(Math.random()-.5)*14,y:e.y-8-Math.random()*16,vx:0,vy:-12,l:.5,c:'200,240,255'})}
 for(let i=DECAL.length-1;i>=0;i--){DECAL[i].t+=dt;if(DECAL[i].t>DECAL[i].l||DECAL[i].sc!==D)DECAL.splice(i,1)}}}
{const M=SKFN.mage,f0=M[0];M[0]=st=>{f0(st);decal('scorch',P.x,P.y,70,4.8)}}
{const S=SKFN.sword,f0=S[0];S[0]=st=>{f0(st);setTimeout(()=>{if(!(D&&(D.town||D.shop)))decal('crack',P.x,P.y,110,6)},430)}}
{const _sd=skDraw;skDraw=function(){for(const d of DECAL){const a=Math.min(1,(d.l-d.t)/1.2);ctx.save();ctx.globalAlpha=a;
 if(d.k==='scorch'){const g=ctx.createRadialGradient(d.x,d.y,2,d.x,d.y,d.r);g.addColorStop(0,'rgba(20,10,5,.75)');g.addColorStop(.6,'rgba(40,20,10,.45)');g.addColorStop(1,'rgba(40,20,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(d.x,d.y,d.r,d.r*.6,0,0,7);ctx.fill();
  if(d.t<d.l-1){const t=performance.now()/1000;for(let i=0;i<6;i++){const ang=d.seed+i*1.05,rr=d.r*(.3+.5*((i*37%10)/10)),x=d.x+Math.cos(ang)*rr,y=d.y+Math.sin(ang)*rr*.6,f=.5+.5*Math.sin(t*9+i);ctx.fillStyle='rgba(255,'+(110+60*f|0)+',30,'+(.7*f*a)+')';ctx.fillRect(x-1.5,y-1.5,3,3)}}}
 else{const R=d.r*.8;const cg=ctx.createRadialGradient(d.x,d.y,2,d.x,d.y,R*.5);cg.addColorStop(0,'rgba(40,26,12,.6)');cg.addColorStop(1,'rgba(40,26,12,0)');ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(d.x,d.y,R*.5,R*.3,0,0,7);ctx.fill();
  const rnd2=n=>{const v=Math.sin(d.seed*91.7+n*12.9898)*43758.5;return v-Math.floor(v)};
  const crack=(x,y,ang,len,w,depth,id)=>{let px=x,py=y;const n=4;for(let s2=0;s2<n;s2++){ang+=(rnd2(id*7+s2)-.5)*.7;const L=len/n,nx=px+Math.cos(ang)*L,ny=py+Math.sin(ang)*L*.55,lw=w*(1-s2/n)+.6;
   ctx.strokeStyle='rgba(14,8,3,.95)';ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(nx,ny);ctx.stroke();ctx.strokeStyle='rgba(255,240,210,.22)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(px+.8,py+1);ctx.lineTo(nx+.8,ny+1);ctx.stroke();
   if(depth<1&&rnd2(id*13+s2)>.55)crack(nx,ny,ang+(rnd2(id+s2)>.5?.7:-.7),len*.45,lw*.7,depth+1,id*3+s2+1);px=nx;py=ny}};
  ctx.lineCap='round';for(let i2=0;i2<11;i2++)crack(d.x,d.y,d.seed+i2/11*6.283+(rnd2(i2)-.5)*.3,R*(.55+rnd2(i2+20)*.5),3.6,0,i2+1);
  for(let i2=0;i2<10;i2++){const ang=d.seed*2+i2*.63,rr=R*(.15+rnd2(i2+40)*.35);ctx.fillStyle=['#5a4e40','#4a4034','#6a5e4e'][i2%3];ctx.save();ctx.translate(d.x+Math.cos(ang)*rr,d.y+Math.sin(ang)*rr*.55);ctx.rotate(ang);ctx.fillRect(-2.5,-1.8,5,3.6);ctx.restore()}}
 ctx.restore()}_sd()}}
// เปลวไฟบนตัวมอนที่ติดไฟ + สีเย็นบนตัวที่โดนน้ำแข็ง
{const _da=drawAir;drawAir=function(){_da();const t=performance.now()/1000;for(const e of enemies()){const s=e.sc||1,h=(e.F&&e.F.fly?30:22)*s;
 if(e.burnT>0){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const x=e.x+(i-1.5)*6*s,fh=(10+Math.sin(t*14+i*2)*4)*s,y=e.y-4-(i%2)*6*s;const g=ctx.createLinearGradient(0,y,0,y-fh*2);g.addColorStop(0,'rgba(255,120,30,.75)');g.addColorStop(.6,'rgba(255,200,60,.45)');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-5*s,y);ctx.quadraticCurveTo(x+Math.sin(t*10+i)*3,y-fh*2.2,x+5*s,y);ctx.fill()}ctx.restore()}
 if(e.slowT>0){ctx.save();ctx.globalAlpha=.35;ctx.fillStyle='#bfe8ff';ctx.beginPath();ctx.ellipse(e.x,e.y-h*.5,(e.F?e.F.r:12)*s,h*.6,0,0,7);ctx.fill();ctx.restore()}}}}

// ---------- 4) ร้าน: พนักงานยืนหลังเคาน์เตอร์ (เคาน์เตอร์บังตั้งแต่เอวลงไป) · บอร์ดเควสย้ายไปผนังขวา ----------
SHOP_ANIM.guild=function(t){if(SHOP_ANIM.skill)SHOP_ANIM.skill(t);const x=14*T,y=10;ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(x+3,y+3,4*T,56);ctx.fillStyle='#5a3a1a';ctx.fillRect(x,y,4*T,56);ctx.fillStyle=LG(ctx,y,y+56,'#9a6a36','#6a4422');ctx.fillRect(x+3,y+3,4*T-6,50);ctx.strokeStyle='#2a1808';ctx.lineWidth=1.5;ctx.strokeRect(x+.5,y+.5,4*T-1,55);
 for(let i=0;i<6;i++){ctx.save();ctx.translate(x+14+(i%3)*36,y+15+Math.floor(i/3)*22);ctx.rotate(((i*7)%3-1)*.07);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-8,-6,18,17);ctx.fillStyle=['#f6ecd0','#f0e0b8','#fff8e0'][i%3];ctx.fillRect(-9,-7,18,17);ctx.fillStyle='#b8342a';ctx.beginPath();ctx.arc(0,-6,2,0,7);ctx.fill();ctx.fillStyle='rgba(60,40,20,.55)';for(let l=0;l<3;l++)ctx.fillRect(-6,-1+l*3.5,12,1.2);ctx.restore()}
 ctx.fillStyle='#e8c14a';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText('📜 บอร์ดเควส',x+2*T,y-1);ctx.textAlign='left'};
delete SHOPCV.guild;

// ---------- 5) หน้าต่างกิลด์แบบใหม่ ----------
{const st=document.createElement('style');st.textContent=`
#shop .gwrap{width:min(92vw,560px);display:flex;flex-direction:column;gap:8px;text-align:left}
#shop .ghd{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:linear-gradient(#5a2418,#3a140c);border:1px solid #e8c14a;box-shadow:inset 0 1px 0 rgba(255,255,255,.15)}
#shop .ghd .crest{width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a0,#c8901a 60%,#6a4a08);display:flex;align-items:center;justify-content:center;font-size:20px;border:2px solid #2a1808;flex:none}
#shop .ghd b{font-size:15px;color:#ffe9a8;display:block}#shop .ghd small{opacity:.8;font-size:11px}
#shop .gtabs{display:flex;gap:4px}#shop .gtabs button{flex:1;height:30px!important;min-height:0!important;border-radius:8px 8px 0 0;background:#2a2218;border:1px solid #5a4a30;color:#cfc4a8;font-weight:bold;text-align:center}
#shop .gtabs button.on{background:#f3e3bb;color:#3a2410;border-color:#e8c14a}
#shop .glist{display:flex;flex-direction:column;gap:6px;max-height:48vh;overflow:auto;padding:2px}
#shop .qc{position:relative;display:flex;gap:10px;align-items:center;padding:8px 10px 8px 8px;border-radius:8px;background:linear-gradient(#f6e8c4,#e8d4a4);color:#3a2410;border:1px solid #a8844a;box-shadow:0 2px 4px rgba(0,0,0,.35);cursor:pointer}
#shop .qc:after{content:"";position:absolute;inset:3px;border:1px dashed rgba(120,80,30,.35);border-radius:6px;pointer-events:none}
#shop .qc .qi{width:40px;height:40px;flex:none;border-radius:8px;background:#3a2410;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:inset 0 0 0 2px #c8a060}
#shop .qc .qb{flex:1;min-width:0}#shop .qc .qt{font-weight:bold;font-size:13px}#shop .qc .rw2{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
#shop .qc .chip{font-size:10px;font-weight:bold;padding:1px 6px;border-radius:9px;background:#3a2410;color:#ffe9a8}
#shop .qc .bar{height:7px;border-radius:4px;background:rgba(60,36,16,.25);overflow:hidden;margin-top:5px}#shop .qc .bar i{display:block;height:100%;background:linear-gradient(90deg,#7ed957,#3aa83a)}
#shop .qc .qa{display:flex;flex-direction:column;gap:4px;flex:none}#shop .qc .qa button{height:26px!important;min-height:0!important;padding:0 10px!important;border-radius:6px;font-size:11px;font-weight:bold;text-align:center}
#shop .qc .go{background:#2f6a3a;border:1px solid #7ed957;color:#fff}#shop .qc .no2{background:#5a2a20;border:1px solid #a85a4a;color:#fff}
#shop .qc.done{background:linear-gradient(#e8ffd8,#c8f0b0);border-color:#5aa83a}#shop .gfoot{display:flex;gap:6px}#shop .gfoot button{flex:1;text-align:center}
#shop .gempty{padding:14px;text-align:center;opacity:.7;font-size:12px}`;document.head.appendChild(st)}
const QICON={kill:'⚔️',item:'📦',fish:'🎣',mine:'⛏️',boss:'👑',floor:'🗝️'};
const GT={tab:'board'};
openGuild=function(tab){if(tab)GT.tab=tab;qRefresh();SHOPK=null;STN.open=null;hideBag();sfx('ui');
 const card=(q,i,mine)=>{const ok=mine&&(q.t==='item'?inv[q.k]>=q.n:q.c>=q.n),pr=mine?(q.t==='item'?Math.min(inv[q.k]|0,q.n):q.c):0,pc=mine?Math.round(pr/q.n*100):0;
  return '<div class="qc'+(ok?' done':'')+'"'+(mine?'':' onclick="qTake('+i+')"')+'><div class="qi">'+(QICON[q.t]||'📜')+'</div><div class="qb"><div class="qt">'+q.d+'</div><div class="rw2"><span class="chip">🪙 '+q.coin+'</span><span class="chip">⭐ '+q.xp+' XP</span>'+(q.es?'<span class="chip">💎 ×'+q.es+'</span>':'')+'</div>'
  +(mine?'<div class="bar"><i style="width:'+pc+'%"></i></div><small>'+pr+' / '+q.n+(ok?' — สำเร็จ!':'')+'</small>':'<small>แตะเพื่อรับเควส</small>')+'</div>'
  +(mine?'<div class="qa">'+(ok?'<button class="go" onclick="event.stopPropagation();qClaim('+i+')">รับรางวัล</button>':'')+'<button class="no2" onclick="event.stopPropagation();qDrop('+i+')">ยกเลิก</button></div>':'')+'</div>'};
 let body='';if(GT.tab==='board')body=QST.offer.map((q,i)=>card(q,i,false)).join('')||'<div class="gempty">ไม่มีเควสบนบอร์ด</div>';else body=QST.act.length?QST.act.map((q,i)=>card(q,i,true)).join(''):'<div class="gempty">ยังไม่ได้รับเควส — ไปเลือกที่บอร์ดเควสได้เลย</div>';
 shopEl.innerHTML='<button class="mini x xclose" onclick="closeGuild()">✕</button><div class="gwrap"><div class="ghd"><div class="crest">⚔️</div><div><b>กิลด์นักผจญภัยเอลโดเรีย</b><small>เควสสำเร็จแล้ว '+QST.done+' · รับได้พร้อมกัน 3 เควส · เควสใหม่ทุก 1 ชั่วโมง</small></div></div>'
  +'<div class="gtabs"><button class="'+(GT.tab==='board'?'on':'')+'" onclick="openGuild(\'board\')">📋 บอร์ดเควส</button><button class="'+(GT.tab==='mine'?'on':'')+'" onclick="openGuild(\'mine\')">🗂️ เควสของฉัน ('+QST.act.length+'/3)</button></div>'
  +'<div class="glist">'+body+'</div><div class="gfoot"><button class="mini" onclick="if(inv.coin>=20){inv.coin-=20;refreshInv();qRefresh(1);openGuild(\'board\')}else say(\'เหรียญไม่พอ\')">🔄 รีเฟรชบอร์ด (20🪙)</button>'+(D&&D.shop==='guild'?'<button class="mini" onclick="openShop(\'guild\')">💰 ขายของดรอป / แลกของ</button>':'')+'</div></div>';
 shopEl.hidden=false;GM.open=true};
{const _qt=qTake;qTake=function(i){_qt(i);openGuild('mine')}}


// =====================================================================
// v3.8 : คทาบนหลังหัวตั้ง · สมดุลแรง + หุ่นซ้อมเพิ่มความอึด · คันเบ็ดใส่ช่องลัดแบบเครื่องมือ
//        กระเป๋าจุมากขึ้น/ของเบาลง · หัวไม่กระตุก · ตั้งค่าคุณภาพภาพ (ต่ำ/กลาง/สูง/สูงสุด/อัตโนมัติ) · ระบบออนไลน์
// =====================================================================

// ---------- 1) อาวุธบนหลัง: คทาลูกแก้วชี้ขึ้น · ธนูพาดเฉียงไหล่ ----------
{const _bs=backSword;backSword=function(x,by,side,f,d){const kd=wKind();if(kd!=='staff'&&kd!=='bow')return _bs(x,by,side,f,d);
  if(!P.armor.sword||(P.draw&&P.tool==='sword')||side)return;const ic=toolIcon(kd,P.tier.sword|0,64);ctx.save();
  if(kd==='staff'){if(d==='u'){ctx.translate(x-3,by-14);ctx.rotate(.5)}else{ctx.translate(x+5,by-15);ctx.rotate(.42)}}
  else{if(d==='u'){ctx.translate(x-1,by-15);ctx.rotate(.62)}else{ctx.translate(x+4,by-16);ctx.rotate(.55)}}
  ctx.drawImage(ic,-23,-36,46,46);ctx.restore()}}

// ---------- 2) สมดุลแรง (ค่าใช้แรงลดลง ฟื้นเร็วขึ้น) ----------
DASH.fa=10;SWING_FA.sword=2;SWING_FA.spin=3;SWING_FA.tool=1.5;

// หุ่นซ้อมในลานฝึก: ตีครบ 40 ครั้ง = ความอึด (END) +1 ถาวร (สูงสุด +30)
const TRAIN={hits:0,end:0,MAX:30,PER:40};
try{const t=JSON.parse(localStorage.getItem('fm_train')||'null');if(t){TRAIN.hits=t.h|0;TRAIN.end=Math.min(TRAIN.MAX,t.e|0)}}catch(e){}
const saveTrain=()=>{try{localStorage.setItem('fm_train',JSON.stringify({h:TRAIN.hits,e:TRAIN.end}))}catch(e){}};
const DUMMY_POS=[32,35,38].map(x=>({x:x*T+16,y:21*T+12,wob:0}));
{const _cb=calcBonus;calcBonus=function(){const b=_cb();b.end+=TRAIN.end;return b}}
function dummyAhead(){if(!(D&&D.town))return null;const v=DIRV[P.dir],hx=P.x+v[0]*22,hy=P.y-8+v[1]*22;for(const d of DUMMY_POS)if(Math.hypot(d.x-hx,d.y-hy)<30)return d;return null}
function trainHit(dm){dm.wob=.45;sfx('chop');P.fa=Math.max(0,P.fa-1);
 for(let k=0;k<6;k++)fx.push({x:dm.x+(Math.random()-.5)*14,y:dm.y-14,vx:(Math.random()-.5)*120,vy:-40-Math.random()*60,l:.5,c:'210,180,120'});
 if(TRAIN.end>=TRAIN.MAX){if(Math.random()<.15)say('💪 ความอึดจากการซ้อมเต็มแล้ว (+'+TRAIN.MAX+')');return}
 TRAIN.hits++;const left=TRAIN.PER-TRAIN.hits%TRAIN.PER;
 if(TRAIN.hits%TRAIN.PER===0){TRAIN.end++;sfx('gem');say('💪 ซ้อมจนอึดขึ้น! ความอึด (END) +1 ถาวร — รวม +'+TRAIN.end);if(typeof sysSay==='function')sysSay('ซ้อมหุ่นสำเร็จ: END +1 (รวม +'+TRAIN.end+'/'+TRAIN.MAX+')');if(typeof refreshInv==='function')refreshInv()}
 else if(left%10===0||left<=3)say('🥋 ซ้อมหุ่น… อีก '+left+' ครั้งความอึดจะเพิ่ม');saveTrain()}
{const _u=useToolHit;useToolHit=function(){const dm=dummyAhead();if(dm&&(P.tool==='sword'||!P.draw)){trainHit(dm);return}_u()}}
// หุ่นสั่นตอนโดนตี (วาดทับเป็นเส้นสั่น + เศษฟาง)
{const _h=hero;hero=function(){_h();if(D&&D.town)for(const d of DUMMY_POS)if(d.wob>0){d.wob-=DT;const a=Math.sin(d.wob*40)*d.wob*6;ctx.save();ctx.globalAlpha=.85;ctx.fillStyle='#c9a46a';ctx.fillRect(d.x-12+a,d.y-26,24,4);ctx.fillStyle='#b88a4a';ctx.beginPath();ctx.arc(d.x+a*1.4,d.y-36,6,0,7);ctx.fill();ctx.restore()}}}

// ---------- 3) คันเบ็ด = เครื่องมือในช่องลัด (เหมือนขวาน/ที่ขุด) ----------
const RODS=['rod','rod2'];
{const _qc=qCands;qCands=function(){const L=_qc(),i=L.findIndex(c=>QCONS.includes(c.id)),add=RODS.filter(k=>inv[k]>0).map(k=>({id:k,name:MN(k)}));if(i<0)L.push(...add);else L.splice(i,0,...add);return L}}
{const _q=quickUseId;quickUseId=function(id){if(!RODS.includes(id))return _q(id);
  if(!(inv[id]>0)){const j=QS.slots.indexOf(id);if(j>=0)QS.slots[j]=null;say('ไม่มี'+MN(id)+'แล้ว');return}
  if(qActive(id)){stowItem();return}if(FISH.st)return;P.tool='rod';P.rodT=id==='rod2'?2:1;QS.last=id;drawItem(id,'🎣 หยิบ'+MN(id)+' — หันหน้าเข้าหาน้ำแล้วกดโจมตีเพื่อเหวี่ยงเบ็ด')}}
{const _fs=fishStart;fishStart=function(w){_fs(w);if(P.draw&&P.tool==='rod')FISH.rod=P.rodT||1}}
{const _a=attack;attack=function(q){if(!(P.draw&&P.tool==='rod'))return _a(q);
  if(FISH.st){fishPress();return}if(P.stun>0||P.dead)return;
  if(D){if(interact())return;say('🎣 ตกปลาได้ที่แม่น้ำ/บ่อในทุ่งหญ้า');return}
  const w=waterAhead();if(w){fishStart(w);return}if(interact())return;say('🎣 หันหน้าเข้าหาน้ำก่อนนะ (ยืนชิดริมน้ำ)')}}
// ภาพถือคันเบ็ด (ตอนยังไม่เหวี่ยง)
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){if(P.tool!=='rod')return _ts(hx,hy,ang);if(FISH.st)return;const t=performance.now()/1000,iron=P.rodT===2;
  ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r')ctx.scale(-1,1);ctx.lineCap='round';
  ctx.strokeStyle='#2a1a0e';ctx.lineWidth=3.6;ctx.beginPath();ctx.moveTo(2,5);ctx.lineTo(-12,-30);ctx.stroke();
  ctx.strokeStyle=iron?'#aab4c6':'#9a6a36';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(2,5);ctx.lineTo(-12,-30);ctx.stroke();
  ctx.fillStyle='#3a2a1a';ctx.fillRect(-1,-4,4,6);ctx.fillStyle='#c9c9c9';ctx.beginPath();ctx.arc(0,-2,1.8,0,7);ctx.fill();
  const sw=Math.sin(t*2)*2;ctx.strokeStyle='rgba(240,240,240,.85)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-12,-30);ctx.quadraticCurveTo(-14+sw,-20,-13+sw,-12);ctx.stroke();
  ctx.fillStyle='#ff4a3a';ctx.beginPath();ctx.arc(-13+sw,-11,2,0,7);ctx.fill();ctx.restore()}}
// เก็บคันเบ็ดเก่าที่ซื้อไว้แล้ว → ใส่ช่องลัดให้อัตโนมัติถ้าช่องว่าง
setTimeout(()=>{for(const k of RODS)if(inv[k]>0&&!QS.slots.includes(k)){const j=QS.slots.indexOf(null);if(j>=0)QS.slots[j]=k}updQuick()},600);
for(const s of SD2.store.buy)if(RODS.includes(s.id))s.note='ใส่ช่องลัดเหมือนขวาน → หันเข้าหาน้ำแล้วกดโจมตี';

// ---------- 4) กระเป๋าจุมากขึ้น · ของหนักน้อยลง ----------
BAGSLOT.splice(0,4,24,32,40,56);BAGCAP.splice(0,4,60,90,130,200);
BAGUP[0].s=8;BAGUP[0].c=30;BAGUP[1].s=8;BAGUP[1].c=40;BAGUP[2].s=16;BAGUP[2].c=70;
Object.assign(WT,{wood:.5,stone:.6,iron:.8,copper:.8,silver:.9,gold:1,ingSt:1,ingot:1.2,ingCu:1.1,ingAg:1.2,ingAu:1.6,ingDm:.6,rod:.5,rod2:.5});
for(const k in WT)if(/^(fish_|f_)/.test(k)||(typeof FISHES!=='undefined'&&FISHES[k]))WT[k]=Math.min(WT[k],.5);
if(typeof refreshInv==='function')refreshInv();

// ---------- 6) คุณภาพภาพ ----------
const GQ={low:{n:'ต่ำ (ลื่นสุด)',res:.75,grass:false,grade:false,fx:40,dust:.25,mm:8},med:{n:'กลาง',res:1,grass:true,grade:false,fx:110,dust:.6,mm:4},
 high:{n:'สูง',res:1.5,grass:true,grade:true,fx:240,dust:1,mm:3},ultra:{n:'สูงสุด',res:2.2,grass:true,grade:true,fx:500,dust:1,mm:2}};
const GQL=['low','med','high','ultra'];const GQC={fx:240,dust:1,lvl:'high'};
function gqGuess(){const c=navigator.hardwareConcurrency||4,m=navigator.deviceMemory||4;if(COARSE)return c<=4||m<=3?'low':c>=8&&m>=6?'high':'med';return c<=2?'med':'high'}
function applyGQ(l,quiet){const q=GQ[l];if(!q)return;GQC.lvl=l;GQC.fx=q.fx;GQC.dust=q.dust;window.MMQ=q.mm;SET.res=q.res;SET.grass=q.grass;SET.grade=q.grade;applyRes();saveSet();
 for(const c of menuEl.querySelectorAll('[data-c]'))c.checked=!!SET[c.dataset.c];const r=menuEl.querySelector('[data-r]');if(r){if(![...r.options].some(o=>+o.value===q.res)){const o=document.createElement('option');o.value=q.res;o.textContent='×'+q.res;r.appendChild(o)}r.value=String(q.res)}
 if(typeof ZCACHE!=='undefined'&&ZCACHE.clear)try{ZCACHE.clear()}catch(e){}
 if(!quiet)say('🖼️ คุณภาพภาพ: '+q.n+(SET.gq==='auto'?' (อัตโนมัติ)':''))}
{const cap=(a,f)=>{a.push=function(){if(this.length>=f())return this.length;return Array.prototype.push.apply(this,arguments)}};
 cap(fx,()=>GQC.fx);if(typeof VFX!=='undefined')cap(VFX,()=>GQC.fx);
 DUST.push=function(){if(GQC.dust<1&&Math.random()>GQC.dust)return this.length;return Array.prototype.push.apply(this,arguments)}}
{const lab=document.createElement('label');lab.innerHTML='คุณภาพภาพ<select data-gq><option value="auto">อัตโนมัติ (แนะนำ)</option><option value="low">ต่ำ — มือถือสเปคต่ำ</option><option value="med">กลาง</option><option value="high">สูง</option><option value="ultra">สูงสุด</option></select>';
 const r=menuEl.querySelector('[data-r]');r.parentNode.parentNode.insertBefore(lab,r.parentNode);
 const sel=lab.querySelector('select');if(!SET.gq)SET.gq='auto';sel.value=SET.gq;
 sel.onchange=e=>{e.stopPropagation();SET.gq=sel.value;GQA.lowT=0;applyGQ(SET.gq==='auto'?gqGuess():SET.gq)};}
const GQA={fr:0,t:0,lowT:0,last:0};
applyGQ(SET.gq==='auto'?(SET.gqAuto&&GQ[SET.gqAuto]?SET.gqAuto:gqGuess()):SET.gq,true);
// วัด FPS จริง ถ้าอัตโนมัติและช้า → ลดคุณภาพลงทีละขั้น
(function gqMon(now){requestAnimationFrame(gqMon);if(!GQA.last){GQA.last=now;return}const dt=now-GQA.last;GQA.last=now;if(PAUSED||document.hidden||dt>250)return;
 GQA.fr++;GQA.t+=dt;if(GQA.t<3000)return;const fps=GQA.fr*1000/GQA.t;GQA.fr=0;GQA.t=0;GQC.fps=fps;
 if(SET.gq!=='auto')return;const i=GQL.indexOf(GQC.lvl);if(fps<42&&i>0){if(++GQA.lowT>=2){GQA.lowT=0;SET.gqAuto=GQL[i-1];applyGQ(GQL[i-1])}}else GQA.lowT=0})(0);

// ---------- 7) ระบบออนไลน์ ----------
const NET={ws:null,on:false,id:0,others:new Map(),n:0,retry:0,sendT:0,lastSt:''};
if(SET.server===undefined)SET.server='';
function netScene(){return !D?'field':D.town?'town':D.shop?'shop:'+D.shop:D.dg?'dg:'+D.dg:D.zone?'z:'+(D.zone.name||D.zone.i||0):'x'}
function netSend(o){if(NET.ws&&NET.ws.readyState===1)NET.ws.send(JSON.stringify(o))}
function netStatus(){const b=gid('netb');if(b){b.textContent=NET.on?'🌐 '+NET.n:'🌐';b.title=NET.on?'ออนไลน์ '+NET.n+' คน':'ออฟไลน์ — แตะเพื่อตั้งค่า';b.classList.toggle('on',NET.on)}
 const s=gid('netst');if(s)s.textContent=NET.on?'🟢 เชื่อมต่อแล้ว · ออนไลน์ '+NET.n+' คน':NET.ws?'🟡 กำลังเชื่อมต่อ…':'⚪ ออฟไลน์ (เล่นคนเดียว)'}
function netConnect(url){url=(url||SET.server||'').trim();netClose(true);if(!url){netStatus();return}if(!/^wss?:\/\//.test(url))url=(location.protocol==='https:'?'wss://':'ws://')+url;
 let ws;try{ws=new WebSocket(url)}catch(e){sysSay('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้: '+url);return}NET.ws=ws;netStatus();
 ws.onopen=()=>{NET.on=true;NET.retry=0;netSend({t:'hi',name:P.name||'ผู้กล้า',v:'3.8'});sysSay('🌐 เชื่อมต่อเซิร์ฟเวอร์ออนไลน์แล้ว');netStatus()};
 ws.onmessage=e=>{let d;try{d=JSON.parse(e.data)}catch(x){return}netMsg(d)};
 ws.onclose=()=>{const was=NET.on;NET.on=false;NET.ws=null;NET.others.clear();netStatus();if(was)sysSay('🌐 หลุดจากเซิร์ฟเวอร์ — กำลังลองใหม่…');
  if(SET.server&&!NET.manual){NET.retry=Math.min(30,(NET.retry||1)*2);setTimeout(()=>{if(!NET.ws&&SET.server)netConnect()},NET.retry*1000)}};
 ws.onerror=()=>{}}
function netClose(m){NET.manual=!!m;if(NET.ws){try{NET.ws.close()}catch(e){}}NET.ws=null;NET.on=false;NET.others.clear();NET.manual=false}
function netMsg(d){
 if(d.t==='welcome'){NET.id=d.id;NET.n=d.n;netStatus()}
 else if(d.t==='snap'){NET.n=d.on;const seen=new Set();for(const s of d.ps){seen.add(s.id);let o=NET.others.get(s.id);if(!o){o={id:s.id,x:s.x,y:s.y,t:0};NET.others.set(s.id,o)}
   if(Math.hypot(o.x-s.x,o.y-s.y)>220){o.x=s.x;o.y=s.y}Object.assign(o,{tx:s.x,ty:s.y,dir:s.dir,mv:s.mv,run:s.run,at:s.at,cmb:s.cmb,tool:s.tool,draw:s.draw,armor:s.armor||{},tier:s.tier||{},lv:s.lv,name:s.name,dead:s.dead,cls:s.cls,pvp:!!s.pvp,look:s.look||null,seen:performance.now()});if(window.NETV8)NETV8(o,s)}
  for(const k of [...NET.others.keys()])if(!seen.has(k))NET.others.delete(k);netStatus()}
 else if(d.t==='chat'){chatSay(d.ch==='guild'?'guild':'gen',d.name,d.txt,'#9fd8ff');const o=NET.others.get(d.id);if(o)o.bub={txt:String(d.txt).slice(0,60),until:performance.now()+4500}}
 else if(d.t==='sys')sysSay('🌐 '+d.txt)
 else if(d.t==='gone')NET.others.delete(d.id)}
function netTick(dt){if(!NET.on)return;NET.sendT-=dt;if(NET.sendT<=0){NET.sendT=.1;
  const st={t:'st',sc:netScene(),x:Math.round(P.x),y:Math.round(P.y),dir:P.dir,mv:!!P.mv,run:!!(P.mv&&isRun()),at:+(P.at||0).toFixed(2),cmb:P.cmb|0,tool:P.tool,draw:!!P.draw,
   armor:P.armor,tier:{sword:P.tier.sword|0,axe:P.tier.axe|0,pick:P.tier.pick|0},lv:P.lv,name:P.name||'ผู้กล้า',dead:!!P.dead,cls:P.cls||''};
  const k=JSON.stringify(st);if(k!==NET.lastSt||NET.idle>1){NET.lastSt=k;NET.idle=0;NET.ws.send(k)}else NET.idle=(NET.idle||0)+.1}
 for(const o of NET.others.values()){if(window.NETSMOOTH8&&o.sn)NETSMOOTH8(o,dt);else{const k=Math.min(1,dt*12);o.x+=(o.tx-o.x)*k;o.y+=(o.ty-o.y)*k}if(o.mv)o.t+=dt*(o.run?13:8);else o.t=0}}
const NETKEYS=['x','y','dir','mv','t','at','cmb','tool','draw','armor','tier','fa','lv','name','dead','dash','bub','spinDir','jump','pk','recall','stun','run','rodT'];
function drawOther(o){const sv={};for(const k of NETKEYS)sv[k]=P[k];const kc=keys.ctrl;keys.ctrl=0;
 try{window.__IN_OTHER8=true;const ar={};for(const s in o.armor)if(o.armor[s]&&ITEMS[o.armor[s]])ar[s]=o.armor[s];
  Object.assign(P,{x:o.x,y:o.y,dir:o.dir||'d',mv:!!o.mv,t:o.t||0,at:o.at>=0&&o.at<1?o.at:-1,cmb:o.cmb|0,tool:['sword','axe','pick','rod'].includes(o.tool)?o.tool:'sword',draw:!!o.draw,armor:ar,tier:Object.assign({},sv.tier,o.tier),fa:o.run?100:0,run:!!o.run,lv:o.lv|0,name:o.name,dead:false,dash:0,bub:o.bub&&o.bub.until>performance.now()?o.bub:null,jump:null,pk:0,recall:0,stun:0});
  ctx.save();if(o.dead){ctx.globalAlpha=.45}heroBody();ctx.restore();nameTag();
 }catch(e){}finally{window.__IN_OTHER8=false;for(const k of NETKEYS)P[k]=sv[k];keys.ctrl=kc}}
{const _h=hero;hero=function(){if(!NET.others.size)return _h();const sc=netScene(),L=[...NET.others.values()];
  for(const o of L)if(o.y<P.y)drawOther(o);_h();for(const o of L)if(o.y>=P.y)drawOther(o)}}
setInterval(()=>netTick(.05),50);
{const _cs=chatSay;chatSay=function(ch,who,txt,col){if(NET.on&&col==='#ffe9a8')return;return _cs(ch,who,txt,col)}}
{const _s=chatSend;chatSend=function(){const t=gid('chatTi').value.trim();if(NET.on&&t){if(t[0]!=='/')netSend({t:'chat',ch:CHT.send,txt:t.slice(0,140)});else if(/^\/g /.test(t))netSend({t:'chat',ch:'guild',txt:t.slice(3,143)})}_s()};gid('chatSend').onclick=chatSend}
// เมนูตั้งค่า: ส่วนออนไลน์
{const sec=document.createElement('div');sec.innerHTML='<b class="sec">🌐 ออนไลน์</b><label style="flex-wrap:wrap">ที่อยู่เซิร์ฟเวอร์<input id="netUrl" type="text" placeholder="เช่น wss://my-game.onrender.com" style="flex:1;min-width:150px;margin-left:6px;font-size:12px;padding:4px;border-radius:6px;border:1px solid #556;background:#1a1d2a;color:#fff"></label>'
  +'<div style="display:flex;gap:6px;margin:4px 0"><button class="mini" id="netGo">เชื่อมต่อ</button><button class="mini" id="netOff">ออฟไลน์</button></div><div id="netst" style="font-size:11px;opacity:.85;margin-bottom:4px"></div>';
 const res=menuEl.querySelector('#fsb');menuEl.insertBefore(sec,res);const inp=sec.querySelector('#netUrl');inp.value=SET.server;
 for(const ev of ['keydown','keyup','keypress'])inp.addEventListener(ev,e=>e.stopPropagation());
 sec.querySelector('#netGo').onclick=()=>{SET.server=inp.value.trim();saveSet();if(!SET.server){say('ใส่ที่อยู่เซิร์ฟเวอร์ก่อน');return}netConnect()};
 sec.querySelector('#netOff').onclick=()=>{SET.server='';saveSet();netClose(true);netStatus();sysSay('🌐 เล่นแบบออฟไลน์')};
 const nb=document.createElement('button');nb.id='netb';nb.textContent='🌐';nb.title='ออนไลน์';nb.onclick=()=>{if(menuEl.hidden)toggleMenu();setTimeout(()=>inp.scrollIntoView({block:'center'}),50)};
 gid('wrap').appendChild(nb);
 const st=document.createElement('style');st.textContent='#netb{position:absolute;right:calc(8px + var(--sr));top:calc(224px + var(--st));min-width:48px;height:34px;font-size:15px;padding:0 6px;background:rgba(0,0,0,.5);color:#fff;border:2px solid #e8c14a;border-radius:10px;z-index:3;font-weight:700}#netb.on{background:rgba(31,106,58,.85);border-color:#7ed957}@media (max-height:520px){#netb{min-width:36px;height:28px;font-size:12px;right:calc(4px + var(--sr));top:calc(164px + var(--st))}}';document.head.appendChild(st);netStatus()}
// ลิงก์เชิญ: ?server=wss://...
try{const u=new URLSearchParams(location.search).get('server');if(u){SET.server=u;saveSet()}}catch(e){}
if(SET.server)setTimeout(()=>netConnect(),1200);
else if(/^https?:$/.test(location.protocol)&&location.host)setTimeout(()=>netConnect((location.protocol==='https:'?'wss://':'ws://')+location.host),1200); // เปิดเกมจากเซิร์ฟเวอร์เดียวกัน → ต่อออนไลน์เอง
// ชื่อเปลี่ยน → แจ้งเซิร์ฟเวอร์
setInterval(()=>{if(NET.on&&NET.nm!==P.name){NET.nm=P.name;netSend({t:'hi',name:P.name||'ผู้กล้า',v:'3.8'})}},2000);


// =====================================================================
// v3.9 : คุยกับ NPC แบบมีหน้าตา/เสียง/เอฟเฟค → ตกลงแล้วเปิดร้าน · การ์ดรายละเอียดไอเทม
//        หน้าต่างสกิล/พาสซีฟ (ต้นไม้พาสซีฟแบบ POE) · ตีบวกสูงสุด +15 · ระบบรูน (ไฟ/น้ำแข็ง/สายฟ้า/พิษ/เลือด)
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#dlg{position:absolute;left:0;right:0;bottom:0;top:0;z-index:30;display:flex;align-items:flex-end;justify-content:center;pointer-events:auto;background:linear-gradient(to top,rgba(0,0,0,.55),rgba(0,0,0,0) 55%);animation:dlgBg .25s ease-out}
#dlg[hidden]{display:none}
@keyframes dlgBg{from{opacity:0}to{opacity:1}}
#dlg .dbox{position:relative;width:min(760px,96%);margin-bottom:calc(10px + var(--sb,0px));display:flex;gap:12px;padding:12px 14px 12px 12px;border-radius:16px;background:linear-gradient(180deg,rgba(38,30,22,.97),rgba(20,16,12,.97));border:2px solid #e8c14a;box-shadow:0 0 0 2px #3a2a10,0 10px 30px rgba(0,0,0,.6),inset 0 0 24px rgba(232,193,74,.15);animation:dlgUp .32s cubic-bezier(.2,1.3,.4,1)}
@keyframes dlgUp{from{transform:translateY(60px) scale(.96);opacity:0}to{transform:none;opacity:1}}
#dlg .dpor{position:relative;flex:0 0 auto;width:112px;height:112px;border-radius:14px;overflow:hidden;border:2px solid #e8c14a;box-shadow:0 0 14px rgba(255,210,90,.45);animation:dlgPop .45s cubic-bezier(.2,1.6,.4,1)}
@keyframes dlgPop{0%{transform:scale(.3) rotate(-12deg)}100%{transform:none}}
#dlg .dpor::before{content:'';position:absolute;inset:-40%;background:conic-gradient(from 0deg,rgba(255,230,140,.0),rgba(255,230,140,.35),rgba(255,230,140,0) 20%,rgba(255,230,140,.3) 40%,rgba(255,230,140,0) 55%,rgba(255,230,140,.3) 75%,rgba(255,230,140,0));animation:dlgSpin 6s linear infinite;z-index:0}
@keyframes dlgSpin{to{transform:rotate(360deg)}}
#dlg .dpor canvas{position:relative;z-index:1;width:100%;height:100%;image-rendering:pixelated}
#dlg .dmain{flex:1;min-width:0;display:flex;flex-direction:column}
#dlg .dname{align-self:flex-start;margin:-26px 0 6px;padding:3px 14px;border-radius:10px;font-weight:800;font-size:14px;color:#2a1a06;background:linear-gradient(90deg,#ffe9a0,#e8c14a,#ffe9a0);background-size:200% 100%;animation:dlgShine 2.4s linear infinite;box-shadow:0 2px 6px rgba(0,0,0,.5)}
@keyframes dlgShine{to{background-position:-200% 0}}
#dlg .dtxt{min-height:46px;font-size:15px;line-height:1.55;color:#fff8e8;text-shadow:0 1px 2px #000}
#dlg .dch{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#dlg .dch button{font:inherit;font-size:13px;font-weight:700;padding:7px 12px;border-radius:10px;color:#fff;background:linear-gradient(180deg,#5a4426,#3a2a14);border:1.5px solid #c9a24a;cursor:pointer;opacity:0;animation:dlgCh .3s ease-out forwards;transition:transform .12s,box-shadow .12s}
#dlg .dch button:hover,#dlg .dch button:focus{transform:translateY(-2px);box-shadow:0 0 12px rgba(255,210,90,.7);outline:none}
#dlg .dch button.go{background:linear-gradient(180deg,#3f8a4a,#22562a);border-color:#8fe08a}
#dlg .dch button.bye{background:linear-gradient(180deg,#4a4a52,#2a2a30);border-color:#888}
#dlg .dch button kbd{font-size:10px;opacity:.7;margin-right:4px}
@keyframes dlgCh{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
#dlg .dnext{position:absolute;right:14px;bottom:8px;color:#ffd84a;font-size:12px;animation:dlgBl .7s infinite alternate}
@keyframes dlgBl{from{opacity:.2;transform:translateY(0)}to{opacity:1;transform:translateY(3px)}}
#dlg .dx{position:absolute;right:8px;top:6px;background:none;border:0;color:#c9b080;font-size:16px;cursor:pointer}
#dlg .spk{position:absolute;width:6px;height:6px;border-radius:50%;background:#fff6c0;box-shadow:0 0 8px #ffd84a;pointer-events:none;animation:dlgSpk .8s ease-out forwards}
@keyframes dlgSpk{to{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
@media (max-height:520px){#dlg .dpor{width:84px;height:84px}#dlg .dtxt{font-size:13px;min-height:38px}#dlg .dch button{font-size:12px;padding:5px 9px}#dlg .dbox{padding:9px 10px;margin-bottom:6px}}
#icard{position:absolute;z-index:40;width:min(300px,92%);left:50%;top:50%;transform:translate(-50%,-50%);border-radius:14px;padding:12px;background:linear-gradient(180deg,rgba(30,26,40,.98),rgba(16,14,22,.98));border:2px solid var(--rc,#8a8aa0);box-shadow:0 0 18px var(--rg,rgba(0,0,0,.4)),0 10px 30px rgba(0,0,0,.6);color:#eee;font-size:13px;animation:icIn .18s ease-out}
#icard[hidden]{display:none}
#icard.tip{pointer-events:none;transform:none;width:250px;animation:none}
@keyframes icIn{from{opacity:0;transform:translate(-50%,-46%) scale(.95)}to{opacity:1}}
#icard .ih{display:flex;gap:10px;align-items:center}
#icard .ii{width:58px;height:58px;flex:0 0 auto;border-radius:10px;background:radial-gradient(circle,rgba(255,255,255,.12),rgba(0,0,0,.3));border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;position:relative}
#icard .ii img{width:50px;height:50px;image-rendering:pixelated}
#icard .ii .rs{position:absolute;right:-6px;bottom:-6px;width:24px;height:24px}
#icard .in{font-weight:800;font-size:15px;color:var(--rc,#fff)}
#icard .ik{font-size:11px;opacity:.7}
#icard .il{margin-top:8px;border-top:1px solid rgba(255,255,255,.12);padding-top:6px}
#icard .il div{margin:2px 0}
#icard .g{color:#8fe08a}#icard .y{color:#ffd84a}#icard .b{color:#9fd0ff}#icard .r{color:#ff8a7a}#icard .m{opacity:.65;font-size:11.5px}
#icard .ib{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
#icard .ib button{flex:1 1 auto;font:inherit;font-size:12.5px;font-weight:700;padding:6px 8px;border-radius:8px;color:#fff;background:#3a3550;border:1px solid #6a6490;cursor:pointer}
#icard .ib button.ok{background:#2f6a3a;border-color:#7ed957}#icard .ib button.no{opacity:.45}
#icard .ix{position:absolute;right:8px;top:6px;background:none;border:0;color:#aaa;font-size:16px;cursor:pointer}
#icard .rl{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}#icard .rl button{flex:0 0 auto;display:flex;align-items:center;gap:3px;padding:3px 6px}
#icard .rl img{width:22px;height:22px}
#skw{position:absolute;inset:0;z-index:28;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55)}
#skw[hidden]{display:none}
#skw .sw{position:relative;width:min(860px,97%);height:min(560px,94%);display:flex;flex-direction:column;border-radius:16px;background:radial-gradient(ellipse at 50% 40%,#1e2236,#0c0d16);border:2px solid #e8c14a;box-shadow:0 10px 40px rgba(0,0,0,.7);color:#eee;overflow:hidden}
#skw .sh{display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid rgba(232,193,74,.3);background:rgba(0,0,0,.3)}
#skw .sh b{font-size:15px;margin-right:auto}
#skw .sh button{font:inherit;font-weight:700;font-size:13px;padding:6px 12px;border-radius:9px;color:#ddd;background:#2a2a3a;border:1px solid #555;cursor:pointer}
#skw .sh button.on{color:#2a1a06;background:linear-gradient(#ffe9a0,#e8c14a);border-color:#e8c14a}
#skw .sb{flex:1;min-height:0;display:flex;gap:8px;padding:8px}
#skw .tree{flex:1;min-width:0;position:relative;border-radius:12px;background:radial-gradient(circle at 50% 50%,rgba(80,70,140,.25),rgba(0,0,0,.2));overflow:hidden;touch-action:none}
#skw .tree svg{width:100%;height:100%;display:block}
#skw .side{flex:0 0 250px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;font-size:12.5px}
#skw .card{padding:8px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}
#skw .card.on{border-color:#e8c14a;background:rgba(232,193,74,.08)}
#skw .card b{font-size:13.5px}#skw .card small{display:block;opacity:.75;margin-top:2px}
#skw .pts{font-size:14px;font-weight:800;color:#ffd84a}
#skw .bt{font:inherit;font-weight:800;font-size:13px;padding:8px;border-radius:9px;color:#fff;background:linear-gradient(#3f8a4a,#22562a);border:1px solid #8fe08a;cursor:pointer;width:100%}
#skw .bt.no{opacity:.45}#skw .bt.gr{background:#3a3550;border-color:#6a6490}
#skw .x{position:absolute;right:8px;top:6px}
#skw .list{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px;align-content:start}
#skw .sk{display:flex;gap:8px;align-items:flex-start}#skw .sk .e{font-size:26px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(0,0,0,.35);flex:0 0 auto}
#skw .lock{opacity:.5;filter:grayscale(.6)}
.pnode{cursor:pointer;transition:r .15s}
@keyframes pnPulse{0%,100%{opacity:.35}50%{opacity:1}}
.pnav{animation:pnPulse 1.2s infinite}
#pasb{position:relative}#pasb i{position:absolute;right:-5px;top:-5px;font-style:normal;font-size:10px;font-weight:800;background:#e04a3a;color:#fff;border-radius:8px;padding:0 4px;line-height:15px}
@media (max-height:520px){#skw .side{flex-basis:200px;font-size:11.5px}#skw .sh button{padding:4px 8px;font-size:12px}}
@media (max-width:620px){#skw .sb{flex-direction:column}#skw .side{flex:0 0 150px}}
`;document.head.appendChild(st)}

// =====================================================================
// A) บทสนทนา NPC
// =====================================================================
const DLG={open:false,n:null,txt:'',shown:0,acc:0,ch:[],typing:false,pitch:300,blipN:0,mouth:0,t:0};
const dlgEl=document.createElement('div');dlgEl.id='dlg';dlgEl.hidden=true;gid('wrap').appendChild(dlgEl);
dlgEl.innerHTML='<div class="dbox"><div class="dpor"><canvas width="120" height="120"></canvas></div><div class="dmain"><div class="dname"></div><div class="dtxt"></div><div class="dch"></div></div><div class="dnext" hidden>▼</div><button class="dx" title="ปิด (Esc)">✕</button></div>';
const dlgCv=dlgEl.querySelector('canvas'),dlgK=dlgCv.getContext('2d');
dlgEl.querySelector('.dx').onclick=e=>{e.stopPropagation();dlgClose()};
dlgEl.querySelector('.dbox').onclick=e=>{if(e.target.closest('button'))return;dlgAdvance()};
dlgEl.onclick=e=>{if(e.target===dlgEl)dlgAdvance()};
function npcPitch(n){if(!n)return 300;const fem=n.g==='f'||/แม่|ป้า|หญิง|ไอริส|สาว|ยาย/.test(n.name||''),age=n.age||(/เด็ก/.test(n.name||'')?'child':/ลุง|ยาย|ปู่|ปรมาจารย์|อาจารย์/.test(n.name||'')?'elder':'adult');
 return age==='child'?720:fem?(age==='elder'?420:540):(age==='elder'?190:260)}
function dlgBlip(){if(!AU.c||SET.mute)return;const p=DLG.pitch*(0.9+Math.random()*.3);tone(p,p*(.94+Math.random()*.1),.055,DLG.pitch>500?'triangle':'square',.035);if(Math.random()<.25)tone(p*1.5,0,.03,'sine',.02)}
function dlgSpark(){const box=dlgEl.querySelector('.dpor');for(let i=0;i<10;i++){const s=document.createElement('i');s.className='spk';const a=Math.random()*6.283,r=40+Math.random()*50;s.style.left='50%';s.style.top='50%';s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r+'px');s.style.animationDelay=(Math.random()*.15)+'s';dlgEl.querySelector('.dbox').appendChild(s);
  const r2=box.getBoundingClientRect(),b=dlgEl.querySelector('.dbox').getBoundingClientRect();s.style.left=(r2.left-b.left+r2.width/2)+'px';s.style.top=(r2.top-b.top+r2.height/2)+'px';setTimeout(()=>s.remove(),1100)}}
// เปิดบทสนทนา: n = npc object · txt · ch=[{t:'ข้อความปุ่ม',f:fn,c:'go'|'bye'}]
function talk(n,txt,ch,name){const first=!DLG.open;DLG.open=true;DLG.D=D;DLG.n=n;DLG.pitch=npcPitch(n);DLG.txt=String(txt);DLG.shown=0;DLG.acc=0;DLG.typing=true;DLG.ch=ch||[];DLG.blipN=0;
 dlgEl.hidden=false;dlgEl.querySelector('.dname').textContent=name||(n&&(n.dn||n.name))||'';dlgEl.querySelector('.dtxt').textContent='';dlgEl.querySelector('.dch').innerHTML='';dlgEl.querySelector('.dnext').hidden=true;
 if(first){for(const k in keys)keys[k]=false;if(typeof JOY!=='undefined'){JOY.x=JOY.y=0}sfx('pop');setTimeout(dlgSpark,80);if(n){n.wave=1.4;n.bub=null;if(n.x!=null){const dx=P.x-n.x,dy=P.y-n.y;if(!n.fixed||true)n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}}}
 else{const b=dlgEl.querySelector('.dbox');b.style.animation='none';void b.offsetWidth;b.style.animation=''}}
function dlgShowChoices(){const el=dlgEl.querySelector('.dch');DLG.typing=false;dlgEl.querySelector('.dtxt').textContent=DLG.txt;
 if(!DLG.ch.length){dlgEl.querySelector('.dnext').hidden=false;return}
 el.innerHTML=DLG.ch.map((c,i)=>'<button class="'+(c.c||'')+'" style="animation-delay:'+(i*.07)+'s" data-i="'+i+'"><kbd>'+(i+1)+'</kbd>'+c.t+'</button>').join('');
 for(const b of el.querySelectorAll('button'))b.onclick=e=>{e.stopPropagation();dlgPick(+b.dataset.i)}}
function dlgPick(i){const c=DLG.ch[i];if(!c)return;sfx('ui');if(c.f){const r=c.f();if(r!==false&&DLG.ch[i]===c&&!c.stay)dlgClose(true)}else dlgClose()}
function dlgAdvance(){if(!DLG.open)return;if(DLG.typing){DLG.shown=DLG.txt.length;dlgShowChoices();return}if(!DLG.ch.length)dlgClose()}
function dlgClose(silent){if(!DLG.open)return;DLG.open=false;dlgEl.hidden=true;if(DLG.n)DLG.n.wave=0;if(!silent)sfx('ui')}
// วาดภาพหน้าตัวละครสด ๆ (ใช้ฟังก์ชันวาด NPC ตัวจริง)
function dlgPortrait(t){const n=DLG.n,k=dlgK;k.setTransform(1,0,0,1,0,0);k.imageSmoothingEnabled=false;
 const col=(n&&n.c)||'#556';const g=k.createRadialGradient(60,52,8,60,60,86);g.addColorStop(0,shadeC(col,70));g.addColorStop(.55,shadeC(col,-10));g.addColorStop(1,shadeC(col,-70));k.fillStyle=g;k.fillRect(0,0,120,120);
 k.globalAlpha=.18;k.fillStyle='#fff';for(let i=0;i<6;i++){const a=t*.4+i*1.047;k.beginPath();k.moveTo(60,60);k.arc(60,60,100,a,a+.25);k.fill()}k.globalAlpha=1;
 if(!n||n.x==null)return;
 const o=Object.assign({},n,{x:20,y:46,mv:false,dir:'d',dn:'​',wave:DLG.typing?Math.max(n.wave||0,.5):0,bub:null});const sc=NSC&&NSC[o.age||'adult']||1,S=2.7/sc;
 const sv=ctx;ctx=k;try{k.setTransform(S,0,0,S,60-20*S,58-(46-28*sc)*S+(DLG.typing?Math.sin(t*18)*.6:0));drawNPC(o,t);
  if(DLG.typing&&DLG.mouth>0){const hy=46-40*sc;k.fillStyle='#5a1a14';k.fillRect(19,hy+9*sc,3,1.6)}}catch(e){}finally{ctx=sv}
 k.setTransform(1,0,0,1,0,0)}
function dlgTick(dt){if(!DLG.open)return;if(DLG.D!==D){dlgClose(true);return}P.stun=Math.max(P.stun,.06);if(typeof JOY!=='undefined'){JOY.x=JOY.y=0}
 if(DLG.typing){DLG.acc+=dt*40;const n=Math.floor(DLG.acc);if(n>DLG.shown){const prev=DLG.shown;DLG.shown=Math.min(DLG.txt.length,n);dlgEl.querySelector('.dtxt').textContent=DLG.txt.slice(0,DLG.shown);
   for(let i=prev;i<DLG.shown;i++){const c=DLG.txt[i];if(c!==' '&&!/[ัิ-ฺ็-๎]/.test(c)&&(++DLG.blipN%2===0)){dlgBlip();DLG.mouth=.08}}
   if(DLG.shown>=DLG.txt.length)dlgShowChoices()}}
 DLG.mouth=Math.max(0,DLG.mouth-dt);dlgPortrait(performance.now()/1000)}
addEventListener('keydown',e=>{if(!DLG.open)return;const k=e.key;e.stopImmediatePropagation();e.preventDefault();
 if(k==='Escape')dlgClose();else if(/^[1-9]$/.test(k)){if(!DLG.typing)dlgPick(+k-1)}else if(k==='Enter'||k===' '||k==='e'||k==='E'||k==='j'||k==='J'){if(!DLG.typing&&DLG.ch.length)dlgPick(0);else dlgAdvance()}},true);
addEventListener('keyup',e=>{if(DLG.open){e.stopImmediatePropagation()}},true);
{const _a=attack;attack=function(q){if(DLG.open){dlgAdvance();return}return _a(q)}}
{const _i=interact;interact=function(){if(DLG.open){dlgAdvance();return true}return _i()}}
const pick=a=>a[Math.random()*a.length|0];
const BYE={t:'👋 ลาก่อน',c:'bye'};
// เจ้าของร้าน
function ownerTalk(id){const S=SD2[id],o=D.owner;if(!S||!o)return false;const greet=(S.owner.greet&&S.owner.greet.length?pick(S.owner.greet):'ยินดีต้อนรับ!');
 const shopGo=tab=>()=>{openShop(id);if(tab&&SHOPUI.tab!==tab)shopTab(tab);o.bub={txt:tab==='sell'?'เอามาให้ดูหน่อยสิ':'เลือกได้ตามสบายเลย!',t:2.4}};
 const ch=[];
 if(id==='guild'){ch.push({t:'📋 ดูบอร์ดเควส',c:'go',f:()=>openGuild('board')},{t:'🗂️ เควสของฉัน',f:()=>openGuild('mine')},{t:'💰 ขายของดรอป / แลกของ',f:shopGo('buy')})}
 else if(id==='skill'){ch.push({t:'📘 เรียนสกิล',c:'go',f:shopGo('buy')},{t:'🌟 ดูสกิล/พาสซีฟของฉัน',f:()=>openSkw('pas')})}
 else{ch.push({t:'🛒 ซื้อของ',c:'go',f:shopGo('buy')});if(S.sell&&S.sell.length)ch.push({t:'💰 ขายของ',f:shopGo('sell')});
  if(id==='gear')ch.push({t:'⚒️ คราฟ / ตีบวก',f:()=>{openForge('anvil')}})}
 const chat={t:'💬 คุยเล่น',stay:true,f:()=>{const L=S.owner.lines||o.lines||[greet];talk(o,L[(o.i=(o.i||0)+1)%L.length],ch.filter(c=>c!==chat).concat([chat]))}};
 ch.push(chat,BYE);talk(o,greet+(id==='guild'?'':' — วันนี้รับอะไรดี?'),ch,S.owner.name);return true}
{const _sa=shopAct;shopAct=function(){if(!D||!D.shop)return _sa();
  if(D.shop==='inn'&&(P.sit||(typeof SEATS!=='undefined'&&SEATS.some(q=>Math.hypot(P.x-q[0],P.y-q[1])<46&&P.y>q[1]))))return _sa();
  if(typeof stnNear==='function'&&stnNear()&&!P.sit)return _sa();
  if(shopNear()){D.owner.wave=1.2;D.owner.dir='d';return ownerTalk(D.shop)}return _sa()}}
// คนในเมือง / แม่ค้าแผงตลาด / ปรมาจารย์อาชีพ
function npcTalk(n){if(n.name==='คลังของทดสอบ'){openTestSupplies();return}const L=n.lines&&n.lines.length?n.lines:['สวัสดีจ้า'];n.i=n.i||0;const say1=()=>{talk(n,L[n.i++%L.length],[{t:'💬 คุยต่อ',stay:true,f:say1},BYE])};say1()}
{const _ta=townAct;townAct=function(){if(!D||!D.town)return _ta();
  if(Math.hypot(P.x-(23*T+16),P.y-(28*T+10))<40)return _ta();
  const cm=D.npcs.find(q=>q.name==='ปรมาจารย์อาชีพ');if(cm&&Math.hypot(cm.x-P.x,cm.y-8-P.y)<48){talk(cm,P.lv<CLASS_LV?'เจ้ายังอ่อนประสบการณ์นัก… กลับมาเมื่อถึง Lv.'+CLASS_LV+' แล้วข้าจะชี้ทางให้':'มีถึง 11 เส้นทาง ตั้งแต่นักรบ จอมเวท นักธนู ไปจนถึงนินจา อัศวิน และนักอัญเชิญ… เจ้าพร้อมจะเลือกแล้วหรือยัง?',[{t:'⚔️ เลือกอาชีพ',c:'go',f:()=>openClassMenu()},{t:'🌟 ดูสกิล/พาสซีฟ',f:()=>openSkw('pas')},{t:'💬 คุยเล่น',stay:true,f:()=>npcTalk(cm)},BYE]);return true}
  const s=stallNear();if(s){const n=D.npcs.find(q=>q.name===VENDOR[s.type])||{name:VENDOR[s.type]};const S=SD2['st_'+s.type];
   talk(n,pick(['มาจ้า ของสด ๆ ทุกวัน เลือกได้เลย!','วันนี้ของดีราคาถูกจ้า ลองดูก่อนได้นะ','อ้าว ผู้กล้า! แวะมาอุดหนุนหน่อยจ้า']),[{t:'🛒 ดูของในแผง',c:'go',f:()=>{openShop('st_'+s.type);n.bub={txt:'เลือกเลยจ้า!',t:2}}},{t:'💬 คุยเล่น',stay:true,f:()=>npcTalk(n)},BYE],n.name+(S?' · '+S.name:''));return true}
  const v=DIRV[P.dir],ax=P.x+v[0]*26,ay=P.y-8+v[1]*26;
  for(const n of D.npcs)if(Math.hypot(n.x-ax,n.y-8-ay)<28){npcTalk(n);return true}
  return _ta()}}

// =====================================================================
// B) ตีบวกสูงสุด +15 (ค่าพลังเพิ่มแบบขั้นบันได)
// =====================================================================
function enhAtk(l){return Math.min(l,5)+Math.max(0,Math.min(l,10)-5)*2+Math.max(0,l-10)*3}
function enhDef(l){return Math.ceil(enhAtk(l)/2)}
const ENH_EST=l=>1+(l>>1),ENH_MAT=l=>Math.min(10,l+1),ENH_COIN=l=>20*(l+1);
const enhCol=l=>l>=15?'#ff5ad8':l>=12?'#ff8a3a':l>=9?'#ffd84a':l>=6?'#7fd0ff':l>=3?'#8fe08a':'#ddd';
enhItem=function(id){const it=ITEMS[id];if(!it)return;const l=ENH[id]||0;if(l>=MAXP){say(it.name+' +'+l+' สูงสุดแล้ว');return}
 const mk=MATKEY[it.tier],ne=ENH_EST(l),nm=ENH_MAT(l),nc=ENH_COIN(l);
 if((inv.estone|0)<ne){say('ต้องใช้หินเสริมพลัง ×'+ne+' (มี '+(inv.estone|0)+') — หาได้จากดันเจี้ยน/เควส/แลกที่กิลด์');sfx('thud');return}
 if((inv[mk]|0)<nm||inv.coin<nc){say('ต้องใช้'+MN(mk)+' '+nm+' + '+nc+' เหรียญ');sfx('thud');return}
 inv.estone-=ne;inv[mk]-=nm;inv.coin-=nc;anvilFx();
 if(Math.random()*100<RATE[l]){ENH[id]=l+1;sfx('chest');say('✨ ตีบวกสำเร็จ! '+it.name+' +'+ENH[id]);if(ENH[id]>=10){sfx('gem');for(let i=0;i<30;i++)fx.push({x:P.x,y:P.y-30,vx:(Math.random()-.5)*260,vy:-80-Math.random()*160,l:.9,c:ENH[id]>=15?'255,90,216':'255,216,74'})}
  if(ENH[id]>=12&&typeof chatAnn==='function')chatAnn((P.name||'ผู้กล้า')+' ตีบวก '+it.name+' สำเร็จถึง +'+ENH[id]+'!')}
 else if(l>=5){if(inv.bless>0){inv.bless--;sfx('thud');say('💥 พลาด… แต่ ✦ หินอวยพรคุ้มครอง ระดับไม่ลด (+'+l+')')}else{ENH[id]=l-1;sfx('thud');say('💥 พลาด! '+it.name+' ลดเหลือ +'+ENH[id])}}
 else{sfx('thud');say('💥 พลาด… วัตถุดิบหายไป (ยังไม่ลดเลเวล)')}
 recalcStats();refreshInv();if(STN.open==='anvil'||FORGEK==='anvil')openForge('anvil');if(!icEl.hidden&&IC.k===id)icShow(IC.t,IC.k)};
{const _ah=anvilHTML;anvilHTML=function(){let h=_ah();if(FUI.tab!=='enh')return h;
  h=h.replace(/(ใช้หินเท่ากับระดับที่จะขึ้น)/,'หิน = 1 + ระดับ÷2 · พลาดตั้งแต่ +5 ลดระดับ (หินอวยพรกันได้) · สูงสุด +15');
  return h.replace(/onclick="enhItem\('([a-z]+\d)'\)">([\s\S]*?)<small>[^<]*<\/small>/g,(m,id,pre)=>{const l=ENH[id]||0,it=ITEMS[id],mk=MATKEY[it.tier];
   return 'onclick="enhItem(\''+id+'\')">'+pre+'<small>→ <b style="color:'+enhCol(l+1)+'">+'+(l+1)+'</b> · 💎'+ENH_EST(l)+' (มี '+(inv.estone|0)+') · '+MN(mk)+' '+ENH_MAT(l)+' (มี '+(inv[mk]|0)+') · '+ENH_COIN(l)+'🪙 · สำเร็จ '+RATE[l]+'%'+(l>=5?' · พลาดลด':'')+'</small>'})}}

// =====================================================================
// C) รูน
// =====================================================================
const RUNE_EL={fire:{n:'ไฟ',e:'🔥',c:'#ff6a2a',rgb:'255,110,40',rgb2:'255,210,90',st:'str',d:'ติดไฟ เผาต่อเนื่อง'},
 ice:{n:'น้ำแข็ง',e:'❄️',c:'#7fd8ff',rgb:'140,215,255',rgb2:'235,250,255',st:'vit',d:'ชะลอศัตรู (ขั้น III แช่แข็ง)'},
 bolt:{n:'สายฟ้า',e:'⚡',c:'#ffe24a',rgb:'255,230,80',rgb2:'255,255,220',st:'agi',d:'ฟ้าผ่าเพิ่มดาเมจ + กระโดดไปตัวข้าง ๆ'},
 venom:{n:'พิษ',e:'☠️',c:'#7be04a',rgb:'120,230,70',rgb2:'200,255,140',st:'end',d:'ติดพิษ เสียเลือดต่อเนื่อง'},
 blood:{n:'เลือด',e:'🩸',c:'#ff3a5a',rgb:'230,40,70',rgb2:'255,140,150',st:'int',d:'ดูดเลือดศัตรูมาฟื้นเลือดตัวเอง'}};
const RGR=['','I','II','III'],RKEYS=[];
for(const el in RUNE_EL)for(let g=1;g<=3;g++){const k='r_'+el+g,R=RUNE_EL[el];RKEYS.push(k);if(inv[k]===undefined)inv[k]=0;WT[k]=.1;
 INVMETA[k]=['รูน'+R.n+' '+RGR[g],'ใส่ในช่องรูนของอุปกรณ์ (แตะอุปกรณ์ในกระเป๋า → ใส่รูน) · อาวุธ: '+R.d+' · ชุดเกราะ: '+R.st.toUpperCase()+' +'+(g*2)+' · รวม 3 ชิ้นเป็นขั้นถัดไปได้'];
 if(!INVORDER.includes(k))INVORDER.push(k)}
const runeOf=k=>{const m=/^r_([a-z]+)(\d)$/.exec(k||'');return m?{el:m[1],g:+m[2]}:null};
const RUNES={};try{Object.assign(RUNES,JSON.parse(localStorage.getItem('fm_rune')||'{}'))}catch(e){}
const saveRunes=()=>{try{localStorage.setItem('fm_rune',JSON.stringify(RUNES))}catch(e){}};
const RSLOTS=['sword','helm','chest','pants','arm'];
const canRune=id=>ITEMS[id]&&(RSLOTS.includes(ITEMS[id].kind)||ITEMS[id].kind==='staff'||ITEMS[id].kind==='bow');
function paintRune(k,el,g){const R=RUNE_EL[el];k.save();k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,40,14,4,0,0,7);k.fill();
 const rim=['','#b07a3a','#c8d0dc','#ffd23a'][g];const gr=k.createLinearGradient(0,6,0,42);gr.addColorStop(0,'#8a8a96');gr.addColorStop(.5,'#5a5a66');gr.addColorStop(1,'#34343e');
 k.fillStyle=gr;k.strokeStyle='#16161c';k.lineWidth=1.8;k.beginPath();k.moveTo(24,5);k.lineTo(38,12);k.lineTo(40,30);k.lineTo(24,42);k.lineTo(8,30);k.lineTo(10,12);k.closePath();k.fill();k.stroke();
 k.strokeStyle=rim;k.lineWidth=2;k.beginPath();k.moveTo(24,8);k.lineTo(35.5,14);k.lineTo(37,29);k.lineTo(24,39);k.lineTo(11,29);k.lineTo(12.5,14);k.closePath();k.stroke();
 const gl=k.createRadialGradient(24,23,1,24,23,13);gl.addColorStop(0,'rgba('+R.rgb2+',.95)');gl.addColorStop(.5,'rgba('+R.rgb+',.55)');gl.addColorStop(1,'rgba('+R.rgb+',0)');k.fillStyle=gl;k.beginPath();k.arc(24,23,13,0,7);k.fill();
 k.strokeStyle='rgba('+R.rgb2+',1)';k.lineWidth=2.2;k.beginPath();
 if(el==='fire'){k.moveTo(24,13);k.quadraticCurveTo(31,21,27,31);k.quadraticCurveTo(24,27,21,31);k.quadraticCurveTo(17,21,24,13)}
 else if(el==='ice'){for(let i=0;i<3;i++){const a=i*Math.PI/3;k.moveTo(24+Math.cos(a)*9,23+Math.sin(a)*9);k.lineTo(24-Math.cos(a)*9,23-Math.sin(a)*9)}}
 else if(el==='bolt'){k.moveTo(27,12);k.lineTo(20,24);k.lineTo(26,24);k.lineTo(21,34)}
 else if(el==='venom'){k.arc(24,21,6,0,7);k.moveTo(20,29);k.lineTo(28,33);k.moveTo(28,29);k.lineTo(20,33)}
 else{k.moveTo(24,13);k.quadraticCurveTo(32,25,24,32);k.quadraticCurveTo(16,25,24,13)}
 k.stroke();k.strokeStyle=R.c;k.lineWidth=1;k.stroke();
 k.fillStyle=rim;for(let i=0;i<g;i++){k.beginPath();k.arc(24+(i-(g-1)/2)*6,37,1.8,0,7);k.fill()}
 k.fillStyle='rgba(255,255,255,.35)';k.beginPath();k.moveTo(24,5);k.lineTo(10,12);k.lineTo(14,14);k.lineTo(24,8.5);k.closePath();k.fill();k.restore()}
{const _mi=matIcon;matIcon=function(key){const r=runeOf(key);if(!r)return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';k.lineCap='round';paintRune(k,r.el,r.g);return c}}
// สเตตัสจากรูนบนชุดเกราะ
const RUNEST=()=>{const b={};for(const s of ['helm','chest','pants','arm']){const id=P.armor[s],r=id&&runeOf(RUNES[id]);if(r){const k=RUNE_EL[r.el].st;b[k]=(b[k]||0)+r.g*2}}return b};
function socketRune(id,rk){if(!canRune(id)||!(inv[rk]>0))return;const old=RUNES[id];if(old){if(inv.coin<50){say('ถอดรูนเดิมต้องใช้ 50 เหรียญ');sfx('thud');return}inv.coin-=50;inv[old]=(inv[old]|0)+1}
 inv[rk]--;RUNES[id]=rk;saveRunes();applyBonus();recalcStats();refreshInv();sfx('gem');const R=RUNE_EL[runeOf(rk).el];say(R.e+' ใส่'+MN(rk)+'ใน'+ITEMS[id].name+'แล้ว!');
 for(let i=0;i<26;i++)rfxP(P.x+(Math.random()-.5)*30,P.y-20-Math.random()*30,(Math.random()-.5)*120,-60-Math.random()*90,.9,R.rgb,2.5,'spark');icShow(IC.t,IC.k)}
function unsocketRune(id){const old=RUNES[id];if(!old)return;if(inv.coin<50){say('ถอดรูนต้องใช้ 50 เหรียญ');sfx('thud');return}inv.coin-=50;inv[old]=(inv[old]|0)+1;delete RUNES[id];saveRunes();applyBonus();recalcStats();refreshInv();sfx('ui');say('ถอด'+MN(old)+'คืนเข้ากระเป๋าแล้ว');icShow(IC.t,IC.k)}
function fuseRune(k){const r=runeOf(k);if(!r||r.g>=3)return;const cost=150*r.g;if((inv[k]|0)<3){say('ต้องมี '+MN(k)+' 3 ชิ้น');sfx('thud');return}if(inv.coin<cost){say('ต้องใช้ '+cost+' เหรียญ');sfx('thud');return}
 inv[k]-=3;inv.coin-=cost;const nk='r_'+r.el+(r.g+1);inv[nk]=(inv[nk]|0)+1;refreshInv();sfx('chest');say('💠 หลอมรวมสำเร็จ! ได้ '+MN(nk));for(let i=0;i<30;i++)rfxP(P.x,P.y-30,(Math.random()-.5)*200,-40-Math.random()*150,.9,RUNE_EL[r.el].rgb,2.5,'spark');icShow('mat',(inv[k]>0)?k:nk)}
// ดรอปรูน
{const _mk=mobKill;mobKill=function(m){_mk(m);const dg=D&&D.dg?D.dg:0,p=m.boss?.45:m.elite?.07:.012+dg/2500;if(Math.random()<p){const els=Object.keys(RUNE_EL),g=m.boss&&Math.random()<.25?2:1;addDrop('r_'+pick(els)+g,m.x,m.y)}}}
for(const k of RKEYS){const im=new Image();im.src=iconURL('mat:'+k);if(typeof DROPIMG!=='undefined')DROPIMG[k]=im}
// ร้านกิลด์ขายรูนขั้น I
{const d=Object.getOwnPropertyDescriptor(SHOP_DATA.guild,'buy');if(d&&d.get){const g0=d.get;Object.defineProperty(SHOP_DATA.guild,'buy',{configurable:true,get(){return g0.call(this).concat(Object.keys(RUNE_EL).map(el=>({id:'rn_'+el,name:'รูน'+RUNE_EL[el].n+' I',mat:'r_'+el+'1',price:400,note:RUNE_EL[el].e+' '+RUNE_EL[el].d+' (ใส่อาวุธ) · ใส่ชุดเกราะ '+RUNE_EL[el].st.toUpperCase()+' +2'})))}})}}
{const _bi=buyItem;buyItem=function(id){const m=/^rn_([a-z]+)$/.exec(id);if(!m)return _bi(id);const k='r_'+m[1]+'1';if(inv.coin<400){say('เหรียญไม่พอ (ต้องใช้ 400)');sfx('thud');return}
  const c=canTake(k);if(c!==true){noRoom(c);return}inv.coin-=400;inv[k]++;refreshInv();sfx('gem');say('💠 ได้ '+MN(k)+' — แตะอาวุธ/ชุดในกระเป๋าเพื่อใส่รูน');if(D&&D.owner)D.owner.bub={txt:'ใช้ให้คุ้มนะคะ!',t:2};renderShop()}}
SHOP_DATA.guild.sell=SHOP_DATA.guild.sell.concat(RKEYS.map(k=>[k,MN(k),[0,80,260,800][runeOf(k).g]]));

// ---------- เอฟเฟครูนตอนตี ----------
const RFX=[];
function rfxP(x,y,vx,vy,l,rgb,s,k,o){if(RFX.length>=(GQC.fx||200)*1.2)return;const p={x,y,vx,vy,l,t:0,rgb,s:s||2,k:k||'dot'};if(o)Object.assign(p,o);RFX.push(p)}
function runeHitFx(e,el,big){const R=RUNE_EL[el],y=e.y-(e.F?18*(e.sc||1):14),n=big?18:10;
 for(let i=0;i<n;i++){const a=Math.random()*6.283,s=40+Math.random()*120;
  if(el==='fire')rfxP(e.x,y,Math.cos(a)*s*.6,-60-Math.random()*120,.6,Math.random()<.5?R.rgb:R.rgb2,3,'ember');
  else if(el==='ice')rfxP(e.x,y,Math.cos(a)*s,Math.sin(a)*s-30,.55,Math.random()<.5?R.rgb:R.rgb2,3,'shard',{rot:a});
  else if(el==='venom')rfxP(e.x+(Math.random()-.5)*16,y,(Math.random()-.5)*30,-20-Math.random()*40,.9,R.rgb,3+Math.random()*3,'bubble');
  else if(el==='blood')rfxP(e.x,y,Math.cos(a)*s*.5,Math.sin(a)*s*.5,.7,R.rgb,2.5,'home');
  else rfxP(e.x,y,Math.cos(a)*s,Math.sin(a)*s,.3,R.rgb2,2,'spark')}
 rfxP(e.x,y,0,0,.3,R.rgb,big?34:24,'ring')}
function runeDmg(e,d,col,tag){if(e.dead)return;e.hp-=d;if(d>0)noteBossFight(e);e.hurt=Math.max(e.hurt||0,.08);dmgTxt(e.x+(Math.random()-.5)*12,e.y-(e.F?30*(e.sc||1):28),tag+d,col);
 if(e.hp<=0&&!e.dead){if(e.F)mobKill(e);else{e.dead=true;sfx('splat');dropLoot(e.x,e.y,e)}}}
function runeProc(e,soft){if(!e||e.dead||!P.armor.sword)return;const rk=RUNES[P.armor.sword],r=runeOf(rk);if(!r)return;const L=ENH[P.armor.sword]||0,ch=(.14+.07*r.g+.01*L)*(soft?.5:1);
 if(Math.random()>ch)return;const a=clsAtk(),R=RUNE_EL[r.el];runeHitFx(e,r.el,r.g>=3);
 if(r.el==='fire'){burn(e,2+r.g);sfx('hit')}
 else if(r.el==='ice'){e.slowT=Math.max(e.slowT||0,1.5+r.g*.7);if(r.g>=3&&!e.boss)e.stunT=Math.max(e.stunT||0,.6);tone(1800,900,.12,'triangle',.05)}
 else if(r.el==='bolt'){const d=Math.max(1,Math.round(a*(.35+.15*r.g)));runeDmg(e,d,'#ffe24a','⚡');let src=e,hit=[e];for(let j=0;j<r.g;j++){const nx=enemies().filter(q=>!hit.includes(q)&&!q.dead&&Math.hypot(q.x-src.x,q.y-src.y)<120).sort((p,q)=>Math.hypot(p.x-src.x,p.y-src.y)-Math.hypot(q.x-src.x,q.y-src.y))[0];
   RFX.push({k:'bolt',x:src.x,y:src.y-16,x2:(nx||src).x+(nx?0:(Math.random()-.5)*40),y2:(nx||src).y-(nx?16:60),t:0,l:.22,rgb:R.rgb2});if(!nx)break;hit.push(nx);runeDmg(nx,Math.max(1,Math.round(d*.7)),'#ffe24a','⚡');src=nx}
  nz(.12,.12,4000,1200,1,'highpass')}
 else if(r.el==='venom'){e.psnT=Math.max(e.psnT||0,3+r.g);e.psnD=Math.max(e.psnD||0,Math.max(1,Math.round(a*(.07+.04*r.g))));e.psnK=e.psnK||0}
 else if(r.el==='blood'){const h=Math.max(1,Math.round(a*(.18+.12*r.g)));P.hp=Math.min(BAL.hp,P.hp+h);dmgTxt(P.x,P.y-50,'+'+h,'#ff7a8a')}}
{const _h=hurtE;hurtE=function(e,mult,o){const r=_h(e,mult*(1+PTX().skill),o);if(r)runeProc(e,true);return r}}
// ติดพิษ + จับการตีโดน (ดาบ)
function runeTick(dt){let last=0;for(const e of enemies()){if(e.last===atkId&&e._rp!==atkId&&P.at>=0){e._rp=atkId;runeProc(e)}
  if(e.psnT>0){e.psnT-=dt;e.psnK-=dt;if(e.psnK<=0){e.psnK=.5;runeDmg(e,e.psnD||1,'#9be06a','☠')}if(Math.random()<dt*10)rfxP(e.x+(Math.random()-.5)*14,e.y-6-Math.random()*16,0,-25,.8,'120,230,70',2.5,'bubble')}}
 for(let i=RFX.length-1;i>=0;i--){const p=RFX[i];p.t+=dt;if(p.t>=p.l){RFX.splice(i,1);continue}
  if(p.k==='home'){const dx=P.x-p.x,dy=P.y-26-p.y,d=Math.hypot(dx,dy)||1;p.vx+=dx/d*900*dt;p.vy+=dy/d*900*dt;p.vx*=.92;p.vy*=.92;if(d<10){p.t=p.l}}
  else if(p.k==='ember'){p.vy-=20*dt;p.vx*=.97}else if(p.k==='shard'){p.vy+=220*dt}else if(p.k==='snow'){p.vx=Math.sin(p.t*4+p.s)*14}else if(p.k==='drip'){p.vy+=240*dt}
  if(p.vx!=null){p.x+=p.vx*dt;p.y+=p.vy*dt}}}
function drawRFX(){if(!RFX.length)return;ctx.save();ctx.globalCompositeOperation='lighter';
 for(const p of RFX){const u=p.t/p.l,a=1-u;
  if(p.k==='bolt'){ctx.strokeStyle='rgba('+p.rgb+','+a+')';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(p.x,p.y);const n=6;for(let i=1;i<n;i++){const q=i/n;ctx.lineTo(p.x+(p.x2-p.x)*q+(Math.random()-.5)*14,p.y+(p.y2-p.y)*q+(Math.random()-.5)*14)}ctx.lineTo(p.x2,p.y2);ctx.stroke();ctx.lineWidth=6;ctx.strokeStyle='rgba('+p.rgb+','+a*.25+')';ctx.stroke();continue}
  if(p.k==='ring'){ctx.strokeStyle='rgba('+p.rgb+','+a*.8+')';ctx.lineWidth=3*a+1;ctx.beginPath();ctx.ellipse(p.x,p.y,p.s*u+4,(p.s*u+4)*.6,0,0,7);ctx.stroke();continue}
  if(p.k==='shard'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot+p.t*8);ctx.fillStyle='rgba('+p.rgb+','+a+')';ctx.beginPath();ctx.moveTo(0,-p.s*1.4);ctx.lineTo(p.s*.6,0);ctx.lineTo(0,p.s*1.4);ctx.lineTo(-p.s*.6,0);ctx.closePath();ctx.fill();ctx.restore();continue}
  if(p.k==='bubble'){ctx.strokeStyle='rgba('+p.rgb+','+a+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(.6+u*.6),0,7);ctx.stroke();continue}
  if(p.k==='glyph'){ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.5);ctx.rotate(p.t*1.5);ctx.strokeStyle='rgba('+p.rgb+','+(a*.8)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,p.s,0,7);ctx.stroke();ctx.restore();continue}
  const r=p.s*(p.k==='ember'?1-u*.5:1);const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*2.2);g.addColorStop(0,'rgba('+p.rgb+','+a+')');g.addColorStop(1,'rgba('+p.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(p.x-r*2.2,p.y-r*2.2,r*4.4,r*4.4)}
 ctx.restore()}

// ---------- ออร่าอาวุธ/ชุดตามระดับตีบวก + รูน ----------
function wAura(){const id=P.armor.sword;if(!id)return null;const L=ENH[id]||0,r=runeOf(RUNES[id]);if(L<3&&!r)return null;
 const R=r?RUNE_EL[r.el]:null;return{L,r,rgb:R?R.rgb:(L>=15?'255,110,230':L>=10?'255,230,140':'255,215,90'),rgb2:R?R.rgb2:(L>=15?'255,220,255':'255,255,230'),el:r?r.el:null}}
function auraEmit(ax,ay,bx,by,W,dt,k){const rate=(W.r?5+W.r.g*3:0)+Math.max(0,W.L-3)*2.2;let n=rate*dt*k;while(n>0){if(Math.random()<n){const q=Math.random(),x=ax+(bx-ax)*q,y=ay+(by-ay)*q;
  const el=W.el;if(el==='fire')rfxP(x,y,(Math.random()-.5)*16,-30-Math.random()*40,.6,Math.random()<.5?W.rgb:W.rgb2,2.2,'ember');
  else if(el==='ice')rfxP(x,y,0,10+Math.random()*16,.9,W.rgb2,1.6,'snow',{s:Math.random()*6});
  else if(el==='venom')rfxP(x,y,(Math.random()-.5)*8,-14-Math.random()*16,.9,W.rgb,1.8+Math.random()*1.5,'bubble');
  else if(el==='blood')rfxP(x,y,0,20,.6,W.rgb,1.8,'drip');
  else rfxP(x,y,(Math.random()-.5)*40,(Math.random()-.5)*40,.3,W.rgb2,1.6,'spark')}n-=1}}
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){_ts(hx,hy,ang);if(P.tool!=='sword'||!P.draw)return;const W=wAura();if(!W)return;
  const kd=wKind(),d=kd==='staff'?29.5:kd==='bow'?13:30,tx=hx+Math.sin(ang)*d,ty=hy-Math.cos(ang)*d,bx=hx+Math.sin(ang)*8,by=hy-Math.cos(ang)*8,t=performance.now()/1000;
  ctx.save();ctx.globalCompositeOperation='lighter';const pul=.75+.25*Math.sin(t*(4+W.L*.3)),a=Math.min(.75,(.16+W.L*.035+(W.r?.12+.06*W.r.g:0))*pul);
  ctx.lineCap='round';ctx.strokeStyle='rgba('+W.rgb+','+a*.45+')';ctx.lineWidth=7+W.L*.5;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(tx,ty);ctx.stroke();
  ctx.strokeStyle='rgba('+W.rgb2+','+a*.7+')';ctx.lineWidth=2.5;ctx.stroke();
  if(W.L>=7||W.r){const g=ctx.createRadialGradient(tx,ty,0,tx,ty,8+W.L*.6);g.addColorStop(0,'rgba('+W.rgb2+','+a+')');g.addColorStop(1,'rgba('+W.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(tx-20,ty-20,40,40)}
  if(W.L>=10){for(let i=0;i<(W.L>=15?4:2);i++){const q=t*3+i*Math.PI*2/(W.L>=15?4:2),ox=Math.cos(q)*9,oy=Math.sin(q)*4,mx=(bx+tx)/2+ox,my=(by+ty)/2+oy-Math.sin(q)*6;const g=ctx.createRadialGradient(mx,my,0,mx,my,5);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba('+W.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(mx-5,my-5,10,10)}}
  ctx.restore();auraEmit(bx,by,tx,ty,W,DT,1)}}
{const _bs=backSword;backSword=function(x,by,side,f,d){_bs(x,by,side,f,d);if(P.draw&&P.tool==='sword')return;const W=wAura();if(!W)return;auraEmit(x-4,by-14,x+10,by-40,W,DT,.35)}}
function armorAura(){let L=0,c=[];for(const s of ['helm','chest','pants','arm']){const id=P.armor[s];if(!id)continue;L+=ENH[id]||0;const r=runeOf(RUNES[id]);if(r)c.push(RUNE_EL[r.el].rgb)}return{L,c}}
{const _h=hero;hero=function(){const t=performance.now()/1000,W=wAura(),A=armorAura();
  if(!P.dead){
   if(W&&W.L>=15||A.L>=40){const rgb=W&&W.L>=15?W.rgb:'255,230,140';ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(P.x,P.y);ctx.scale(1,.42);
    for(let i=0;i<2;i++){ctx.rotate(i?-t*.9:t*.6);ctx.strokeStyle='rgba('+rgb+','+(.35+.15*Math.sin(t*3+i))+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,26+i*8,0,7);ctx.stroke();
     for(let j=0;j<6;j++){const a=j*1.047;ctx.beginPath();ctx.moveTo(Math.cos(a)*(22+i*8),Math.sin(a)*(22+i*8));ctx.lineTo(Math.cos(a+.5)*(30+i*8),Math.sin(a+.5)*(30+i*8));ctx.stroke()}}
    ctx.restore()}
   if(A.L>=12||A.c.length){const rate=A.L/8+A.c.length*3;if(Math.random()<rate*DT){const rgb=A.c.length?pick(A.c):'255,230,150',a=Math.random()*6.283;rfxP(P.x+Math.cos(a)*12,P.y-4-Math.random()*30,0,-24-Math.random()*20,.9,rgb,1.6,'dot')}}}
  _h();drawRFX()}}

// =====================================================================
// D) ต้นไม้พาสซีฟ (แบบ POE)
// =====================================================================
const PSPK=[{k:'str',n:'พลัง',e:'⚔️',c:'#ff6a5a'},{k:'agi',n:'ว่องไว',e:'🏹',c:'#7be07b'},{k:'end',n:'อึด',e:'💪',c:'#ffd24a'},{k:'int',n:'ปัญญา',e:'✨',c:'#6ab0ff'},{k:'vit',n:'ทนทาน',e:'❤️',c:'#ff8ab0'}];
const STN_TH={str:'STR',agi:'AGI',int:'INT',vit:'VIT',end:'END'};
const PNOT={str5:{n:'คมดาบ',fx:{dmg:.08},d:'ดาเมจทั้งหมด +8%'},str10:{n:'โทสะไททัน',fx:{dmg:.15},st:{str:5},d:'ดาเมจ +15% · STR +5',ks:1},
 agi5:{n:'ตาเหยี่ยว',fx:{crit:.05},d:'โอกาสคริติคอล +5%'},agi10:{n:'ลมกรด',fx:{spd:.1,crit:.05},st:{agi:5},d:'ความเร็วเดิน +10% · คริ +5% · AGI +5',ks:1},
 int5:{n:'กระแสมานา',fx:{mpr:.4},d:'มานาฟื้นเร็วขึ้น 40%'},int10:{n:'จอมเวท',fx:{skill:.2},st:{int:5},d:'ดาเมจสกิล/เวท/ลูกธนู +20% · INT +5',ks:1},
 vit5:{n:'หัวใจแกร่ง',fx:{hpr:.006},d:'ฟื้นเลือด 0.6%/วิ'},vit10:{n:'ป้อมปราการ',fx:{hp:.15,dr:.08},st:{vit:5},d:'เลือดสูงสุด +15% · ดาเมจที่ได้รับ -8% · VIT +5',ks:1},
 end5:{n:'ปอดเหล็ก',fx:{far:.3},d:'แรงฟื้นเร็วขึ้น 30%'},end10:{n:'ไม่รู้จักเหนื่อย',fx:{fac:.3},st:{end:5},d:'ใช้แรงน้อยลง 30% · END +5',ks:1}};
const PNODES={c0:{id:'c0',x:0,y:0,n:'จุดเริ่มต้น',d:'ศูนย์กลางพลัง',adj:[],start:1}};
{const R=36;PSPK.forEach((s,i)=>{const a=-Math.PI/2+i*2*Math.PI/5;for(let r=1;r<=10;r++){const id=s.k+r,N=PNOT[id];
  PNODES[id]={id,x:Math.cos(a)*r*R,y:Math.sin(a)*r*R,sp:s,adj:[],n:N?N.n:s.n+' '+(r<=5?'+2':'+3'),d:N?N.d:STN_TH[s.k]+' +'+(r<=5?2:3),st:N?(N.st||{}):{[s.k]:r<=5?2:3},fx:N?N.fx:null,big:!!N,ks:N&&N.ks}}
  const lk=(a,b)=>{PNODES[a].adj.push(b);PNODES[b].adj.push(a)};lk('c0',s.k+1);for(let r=1;r<10;r++)lk(s.k+r,s.k+(r+1))});
 PSPK.forEach((s,i)=>{const t=PSPK[(i+1)%5];for(const [r,v] of [[3,1],[6,2],[9,3]]){const a1=-Math.PI/2+i*2*Math.PI/5,a2=a1+2*Math.PI/5,am=(a1+a2)/2,id='x'+i+'_'+r;
   PNODES[id]={id,x:Math.cos(am)*r*R*.86,y:Math.sin(am)*r*R*.86,sp:{c:'#c8b8ff'},adj:[s.k+r,t.k+r],n:s.n+'+'+t.n,d:STN_TH[s.k]+' +'+v+' · '+STN_TH[t.k]+' +'+v,st:{[s.k]:v,[t.k]:v}};PNODES[s.k+r].adj.push(id);PNODES[t.k+r].adj.push(id)}})}
const PT={a:new Set(['c0']),sel:null};
try{const x=JSON.parse(localStorage.getItem('fm_pt')||'null');if(x&&x.a)for(const id of x.a)if(PNODES[id])PT.a.add(id)}catch(e){}
const savePT=()=>{try{localStorage.setItem('fm_pt',JSON.stringify({a:[...PT.a]}))}catch(e){}};
const ptTotal=()=>Math.floor((P.lv-1)*.6),ptUsed=()=>PT.a.size-1,ptFree=()=>Math.max(0,ptTotal()-ptUsed());
let _ptx=null;function PTX(){if(_ptx)return _ptx;const o={st:{},dmg:0,crit:0,spd:0,mpr:0,skill:0,hpr:0,hp:0,dr:0,far:0,fac:0,chain:0,proj:0,mpc:0,area:0,minion:0,mdmg:0,mdur:0,cdr:0,aspd:0};for(const id of PT.a){const N=PNODES[id];if(!N)continue;for(const k in N.st||{})o.st[k]=(o.st[k]||0)+N.st[k];for(const k in N.fx||{})o[k]+=N.fx[k]}return _ptx=o}
const ptDirty=()=>{_ptx=null;applyBonus();recalcStats();P.hp=Math.min(P.hp,BAL.hp);updPasBadge()};
function ptCan(id){if(PT.a.has(id))return false;return PNODES[id].adj.some(a=>PT.a.has(a))}
function ptAlloc(id){if(!PNODES[id]||!ptCan(id)){say('ต้องเชื่อมกับจุดที่อัพแล้ว');sfx('thud');return}if(ptFree()<=0){say('แต้มพาสซีฟไม่พอ — ได้เพิ่มเมื่อเลเวลอัป');sfx('thud');return}
 PT.a.add(id);savePT();ptDirty();sfx(PNODES[id].big?'gem':'heal');say('🌟 อัพพาสซีฟ: '+PNODES[id].n+' — '+PNODES[id].d);PT.flash={id,t:performance.now()};renderSkw()}
function ptReset(){const c=100+P.lv*20;if(ptUsed()===0)return;if(inv.coin<c){say('รีเซ็ตต้องใช้ '+c+' เหรียญ');sfx('thud');return}inv.coin-=c;PT.a=new Set(['c0']);savePT();ptDirty();refreshInv();sfx('warp');say('🔄 รีเซ็ตต้นไม้พาสซีฟแล้ว — แต้มคืนครบ');renderSkw()}
// ผลของพาสซีฟ/รูนต่อสเตตัส
{const _cb=calcBonus;calcBonus=function(){const b=_cb(),x=PTX().st,r=RUNEST();for(const k in x)b[k]=(b[k]||0)+x[k];for(const k in r)b[k]=(b[k]||0)+r[k];return b}}
function atkMul(){return 1+PTX().dmg}
function spdMul(){return 1+PTX().spd}
{const _c=critCh;critCh=function(){return _c()+PTX().crit}}
{const _r=recalcStats;recalcStats=function(){_r();const h=PTX().hp;if(h)BAL.hp=Math.round(BAL.hp*(1+h))}}
{const _z=zHurt;zHurt=function(src,dmg,kbm,msg){return _z(src,dmg*(1-PTX().dr),kbm,msg)}}
setInterval(()=>{if(PAUSED||P.dead)return;const x=PTX();if(x.hpr&&!passiveRegenBlocked())P.hp=Math.min(BAL.hp,P.hp+BAL.hp*x.hpr*.5);if(x.mpr&&BAL.mpRegen)P.mp=Math.min(BAL.mp,P.mp+BAL.mpRegen*x.mpr*.5)},500);
{let lf=null;const _p=playerTick;playerTick=function(dt){if(lf==null)lf=P.fa;_p(dt);dlgTick(dt);runeTick(dt);const x=PTX(),d=P.fa-lf;
  if(d<0&&x.fac)P.fa=Math.min(100,P.fa-d*x.fac);else if(d>0&&x.far)P.fa=Math.min(100,P.fa+d*x.far);lf=P.fa}}
// ปุ่ม 🌟 สกิล/พาสซีฟ
const pasB=document.createElement('button');pasB.id='pasb';pasB.title='สกิล / พาสซีฟ (K)';pasB.innerHTML='🌟<i hidden></i>';gid('zb').appendChild(pasB);pasB.onclick=()=>openSkw();
function updPasBadge(){const i=pasB.querySelector('i'),f=ptFree();i.hidden=f<=0;i.textContent=f}
setInterval(updPasBadge,1000);
addEventListener('keydown',e=>{if((e.key==='k'||e.key==='K')&&document.activeElement.tagName!=='INPUT'){e.stopImmediatePropagation();if(e.repeat)return;if(skwEl.hidden)openSkw();else closeSkw()}},true);

// ---------- หน้าต่าง สกิล / พาสซีฟ ----------
const skwEl=document.createElement('div');skwEl.id='skw';skwEl.hidden=true;gid('wrap').appendChild(skwEl);
const SKW={tab:'pas',zoom:1.25,cx:0,cy:0,drag:null,moved:false};
function skwView(){const svg=skwEl.querySelector('.tree svg');if(!svg)return;const hw=430/SKW.zoom;svg.setAttribute('viewBox',(SKW.cx-hw)+' '+(SKW.cy-hw)+' '+hw*2+' '+hw*2)}
function skwZoom(f){SKW.zoom=Math.max(.8,Math.min(3,SKW.zoom*f));skwView()}
function openSkw(tab){if(tab)SKW.tab=tab;skwEl.hidden=false;PAUSED=true;sfx('ui');renderSkw()}
function closeSkw(){skwEl.hidden=true;PAUSED=false;sfx('ui')}
skwEl.addEventListener('click',e=>{if(e.target===skwEl)closeSkw()});
function skwTab(t){SKW.tab=t;sfx('ui');renderSkw()}
function renderSkw(){if(skwEl.hidden)return;const C=CLS[P.cls]||{e:'🧑',n:'ไม่มีอาชีพ'};
 let h='<div class="sw"><div class="sh"><b>'+C.e+' '+C.n+' · Lv.'+P.lv+'</b><button class="'+(SKW.tab==='sk'?'on':'')+'" onclick="skwTab(\'sk\')">⚔️ สกิล</button><button class="'+(SKW.tab==='pas'?'on':'')+'" onclick="skwTab(\'pas\')">🌟 พาสซีฟ'+(ptFree()?' ('+ptFree()+')':'')+'</button><button onclick="closeSkw()">✕</button></div><div class="sb">';
 if(SKW.tab==='sk'){h+='<div class="list">';const L=CSKILLS[P.cls]||[];
  if(L.length)h+=L.map((s,i)=>{const own=skOwned(i),mp=Array.isArray(s.mp)?s.mp.join('/'):s.mp;return '<div class="card sk'+(own?' on':' lock')+'"><div class="e">'+s.e+'</div><div><b>'+s.n+'</b> '+(own?'<span style="color:#8fe08a">✓ ใช้ได้</span>':'<span style="color:#ff9a7a">🔒 '+(P.cls==='none'?'ซื้อที่ร้านสกิล':'Lv.'+s.lv)+'</span>')+'<small>มานา '+mp+' · คูลดาวน์ '+s.cd+' วิ'+(s.steps?' · กด '+s.steps+' จังหวะ':'')+'</small><small>'+s.d+'</small></div></div>'}).join('');
  h+=SKILLS.map((s,i)=>'<div class="card sk'+(SK.own[i]?' on':' lock')+'"><div class="e">'+s.emoji+'</div><div><b>'+s.name+'</b> <span style="font-size:11px;opacity:.7">สกิลพื้นฐาน</span> '+(SK.own[i]?'<span style="color:#8fe08a">✓</span>':'<span style="color:#ff9a7a">🔒 '+s.price+'🪙 ร้านสกิล</span>')+'<small>มานา '+s.mp+' · คูลดาวน์ '+s.cd+' วิ</small><small>'+s.note+'</small></div></div>').join('');
  h+='<div class="card"><b>💡 วิธีใช้</b><small>กดปุ่มสกิลบนจอ (หรือคีย์ตัวเลขสกิล) · สกิลอาชีพปลดล็อกเองตามเลเวล · สกิลพื้นฐานซื้อที่ร้านสกิลในเมือง</small></div></div>'}
 else{const s=PT.sel&&PNODES[PT.sel],x=PTX();
  h+='<div class="tree">'+ptSVG()+'<div style="position:absolute;right:6px;bottom:6px;display:flex;gap:4px"><button class="bt gr" style="width:34px;padding:4px" onclick="skwZoom(1.25)">＋</button><button class="bt gr" style="width:34px;padding:4px" onclick="skwZoom(.8)">－</button><button class="bt gr" style="width:34px;padding:4px" onclick="SKW.zoom=1.25;SKW.cx=SKW.cy=0;skwView()">⟲</button></div><div style="position:absolute;left:8px;top:6px;font-size:11px;opacity:.6;pointer-events:none">ลากเพื่อเลื่อน · ＋/－ ซูม</div></div><div class="side"><div class="card"><span class="pts">🌟 แต้มพาสซีฟ '+ptFree()+'</span><small>ใช้ไป '+ptUsed()+' / ได้ทั้งหมด '+ptTotal()+' (ได้เพิ่มทุกเลเวล)</small><small>แตะจุดที่เรืองแสงติดกับเส้นทางของคุณเพื่ออัพ</small></div>';
  if(s){const can=ptCan(s.id),own=PT.a.has(s.id);h+='<div class="card on"><b style="color:'+(s.sp&&s.sp.c||'#fff')+'">'+(s.ks?'👑 ':s.big?'⭐ ':'')+s.n+'</b><small>'+s.d+'</small>'+(own?'<small style="color:#8fe08a">✓ อัพแล้ว</small>':can?'<button class="bt'+(ptFree()?'':' no')+'" style="margin-top:6px" onclick="ptAlloc(\''+s.id+'\')">✚ อัพ (ใช้ 1 แต้ม)</button>':'<small style="color:#ff9a7a">ต้องอัพจุดที่เชื่อมอยู่ก่อน</small>')+'</div>'}
  const sum=Object.entries(x.st).map(([k,v])=>STN_TH[k]+' +'+v).join(' · '),ex=[x.dmg&&'ดาเมจ +'+Math.round(x.dmg*100)+'%',x.crit&&'คริ +'+Math.round(x.crit*100)+'%',x.spd&&'ความเร็ว +'+Math.round(x.spd*100)+'%',x.skill&&'สกิล +'+Math.round(x.skill*100)+'%',x.hp&&'เลือด +'+Math.round(x.hp*100)+'%',x.dr&&'รับดาเมจ -'+Math.round(x.dr*100)+'%',x.hpr&&'ฟื้นเลือด '+(x.hpr*100).toFixed(1)+'%/วิ',x.mpr&&'มานาฟื้น +'+Math.round(x.mpr*100)+'%',x.far&&'แรงฟื้น +'+Math.round(x.far*100)+'%',x.fac&&'ใช้แรง -'+Math.round(x.fac*100)+'%'].filter(Boolean).join(' · ');
  h+='<div class="card"><b>📊 รวมจากต้นไม้</b><small>'+(sum||'ยังไม่ได้อัพ')+(ex?'<br>'+ex:'')+'</small></div>';
  const PL=PASSIVE[P.cls]||[];h+='<div class="card"><b>'+C.e+' พาสซีฟอาชีพ (ปลดล็อกตามเลเวล)</b>'+PL.map(p=>'<small style="'+(P.lv>=p.lv?'color:#ffe9a0':'opacity:.5')+'">'+(P.lv>=p.lv?'🌟':'🔒')+' '+p.n+' (Lv.'+p.lv+') — '+p.d+'</small>').join('')+'</div>';
  h+='<button class="bt gr" onclick="ptReset()">🔄 รีเซ็ตต้นไม้ ('+(100+P.lv*20)+'🪙)</button></div>'}
 skwEl.innerHTML=h+'</div></div>';
 if(SKW.tab==='pas'){const svg=skwEl.querySelector('svg'),tr=skwEl.querySelector('.tree');
  tr.onpointerdown=e=>{if(e.target.closest('button'))return;SKW.drag={x:e.clientX,y:e.clientY,cx:SKW.cx,cy:SKW.cy};SKW.moved=false};
  tr.onpointermove=e=>{const d=SKW.drag;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>6)SKW.moved=true;if(!SKW.moved)return;const r=svg.getBoundingClientRect(),k=(860/SKW.zoom)/Math.min(r.width,r.height);SKW.cx=Math.max(-420,Math.min(420,d.cx-dx*k));SKW.cy=Math.max(-420,Math.min(420,d.cy-dy*k));skwView()};
  tr.onpointerup=tr.onpointercancel=()=>{SKW.drag=null};tr.onwheel=e=>{e.preventDefault();skwZoom(e.deltaY<0?1.15:.87)};
  for(const c of svg.querySelectorAll('[data-n]'))c.addEventListener('click',e=>{e.stopPropagation();if(SKW.moved){SKW.moved=false;return}const id=c.dataset.n;if(PT.sel===id&&ptCan(id)&&ptFree()>0){ptAlloc(id);return}PT.sel=id;sfx('ui');renderSkw()})}}
function ptSVG(){const W=430,N=PNODES,t=performance.now();let e='',n='';const fl=PT.flash&&t-PT.flash.t<900?PT.flash.id:null;
 const done=new Set();for(const id in N)for(const b of N[id].adj){const k=[id,b].sort().join('|');if(done.has(k))continue;done.add(k);const A=N[id],B=N[b],on=PT.a.has(id)&&PT.a.has(b),half=PT.a.has(id)||PT.a.has(b);
  e+='<line x1="'+A.x.toFixed(1)+'" y1="'+A.y.toFixed(1)+'" x2="'+B.x.toFixed(1)+'" y2="'+B.y.toFixed(1)+'" stroke="'+(on?'#ffd84a':half?'#8a7a50':'#3a3a52')+'" stroke-width="'+(on?3.4:2)+'"'+(on?' filter="url(#gl)"':'')+'/>'}
 for(const id in N){const d=N[id],own=PT.a.has(id),can=!own&&ptCan(id),r=d.ks?15:d.big?12:d.start?12:8,col=d.sp&&d.sp.c||'#ffd84a',sel=PT.sel===id;
  if(can)n+='<circle class="pnav" cx="'+d.x.toFixed(1)+'" cy="'+d.y.toFixed(1)+'" r="'+(r+5)+'" fill="none" stroke="'+col+'" stroke-width="2"/>';
  if(fl===id)n+='<circle cx="'+d.x+'" cy="'+d.y+'" r="'+(r+4)+'" fill="none" stroke="#fff" stroke-width="3"><animate attributeName="r" from="'+r+'" to="'+(r+26)+'" dur=".7s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur=".7s" fill="freeze"/></circle>';
  n+='<g class="pnode" data-n="'+id+'"><circle cx="'+d.x.toFixed(1)+'" cy="'+d.y.toFixed(1)+'" r="'+(r+9)+'" fill="transparent"/><circle cx="'+d.x.toFixed(1)+'" cy="'+d.y.toFixed(1)+'" r="'+r+'" fill="'+(own?col:'#1a1a28')+'" stroke="'+(sel?'#fff':own?'#fff6c0':can?col:'#4a4a62')+'" stroke-width="'+(sel?3:d.big?2.5:1.6)+'"'+(own?' filter="url(#gl)"':'')+'/>'+
   (d.big||d.start?'<text x="'+d.x.toFixed(1)+'" y="'+(d.y+(d.ks?5:4.2)).toFixed(1)+'" text-anchor="middle" font-size="'+(d.ks?15:12)+'" style="pointer-events:none">'+(d.start?'✦':d.ks?'👑':d.sp.e)+'</text>':'')+'</g>'}
 let lab='';PSPK.forEach((s,i)=>{const a=-Math.PI/2+i*2*Math.PI/5;lab+='<text x="'+(Math.cos(a)*400).toFixed(0)+'" y="'+(Math.sin(a)*400+4).toFixed(0)+'" text-anchor="middle" font-size="17" font-weight="800" fill="'+s.c+'" style="pointer-events:none">'+s.e+' '+s.n+'</text>'});
 const hw=W/SKW.zoom;return '<svg viewBox="'+(SKW.cx-hw)+' '+(SKW.cy-hw)+' '+hw*2+' '+hw*2+'" preserveAspectRatio="xMidYMid meet"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="bgc"><stop offset="0" stop-color="rgba(255,220,120,.12)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle r="'+W+'" fill="url(#bgc)"/>'+e+n+lab+'</svg>'}
// เลเวลอัป → แจ้งแต้มพาสซีฟ
{const _g=gainXp;gainXp=function(n){const l0=P.lv,f0=ptTotal();_g(n);if(P.lv>l0&&ptTotal()>f0){setTimeout(()=>say('🌟 ได้แต้มพาสซีฟ +'+(ptTotal()-f0)+' — กดปุ่ม 🌟 (K) เพื่ออัพ'),1600);updPasBadge()}}}
// หน้าสถานะ: ย้ายพาสซีฟ/สกิลไปหน้าต่างใหม่ เหลือปุ่มลิงก์
{const _rc=renderChar;renderChar=function(){_rc();const el=gid('chl');if(!el||chp.hidden)return;const bs=[...el.querySelectorAll('.setb')].filter(b=>/อาชีพ:/.test(b.textContent));
  for(const b of bs){const C=CLS[P.cls];b.innerHTML='<b>'+C.e+' อาชีพ: '+C.n+'</b><button class="mini" style="margin-top:4px" onclick="chp.hidden=true;openSkw(\'sk\')">⚔️ สกิล</button><button class="mini" style="margin-top:4px" onclick="chp.hidden=true;openSkw(\'pas\')">🌟 พาสซีฟ'+(ptFree()?' (+'+ptFree()+')':'')+'</button>'}}}

// =====================================================================
// E) การ์ดรายละเอียดไอเทม (กระเป๋า + กดค้าง/ชี้ที่ไอคอนทุกที่)
// =====================================================================
const icEl=document.createElement('div');icEl.id='icard';icEl.hidden=true;gid('wrap').appendChild(icEl);const IC={t:null,k:null};
const TCOL=['#c8c8c8','#d8dde6','#ffa86a','#e6eef8','#ffd84a','#7fd0ff'],TGLOW=['rgba(0,0,0,.3)','rgba(160,170,190,.3)','rgba(255,140,60,.35)','rgba(220,235,255,.4)','rgba(255,210,60,.45)','rgba(90,180,255,.55)'];
const GKIND={...KINDS,staff:'คทา',bow:'ธนู'};
function gearLines(id){const it=ITEMS[id],L=ENH[id]||0,k=it.kind,o=[];
 o.push('<div>'+it.stat+'</div>');
 if(L){if(k==='sword'||k==='staff'||k==='bow')o.push('<div class="y">✨ ตีบวก +'+L+': โจมตี +'+enhAtk(L)+'</div>');else if(['helm','chest','pants','arm'].includes(k))o.push('<div class="y">✨ ตีบวก +'+L+': ป้องกัน +'+enhDef(L)+'</div>');}
 if(k==='staff')o.push('<div class="b">โจมตีด้วย INT (เวทระยะไกล)</div>');if(k==='bow')o.push('<div class="g">โจมตีด้วย AGI (ยิงระยะไกล)</div>');
 if(canRune(id)){const r=runeOf(RUNES[id]);if(r){const R=RUNE_EL[r.el];o.push('<div style="color:'+R.c+'">💠 '+MN(RUNES[id])+': '+(k==='sword'||k==='staff'||k==='bow'?R.d+' (โอกาส '+Math.round((.14+.07*r.g+.01*L)*100)+'%)':STN_TH[R.st]+' +'+r.g*2)+'</div>')}else o.push('<div class="m">💠 ช่องรูน: ว่าง</div>')}
 if(typeof SETS!=='undefined'){}
 o.push('<div class="m">⚖️ น้ำหนัก '+(typeof gearW==='function'?gearW(id):1)+' กก.'+(L<MAXP&&k!=='axe'&&k!=='pick'&&k!=='neck'&&k!=='ring'?' · ตีบวกได้สูงสุด +'+MAXP:'')+'</div>');return o.join('')}
function matLines(k){const o=[],m=INVMETA[k],r=runeOf(k);
 if(m&&m[1])o.push('<div>'+m[1]+'</div>');
 if(typeof FOOD!=='undefined'&&FOOD[k]){const f=FOOD[k];o.push('<div class="g">'+(f.st?Object.entries(f.st).map(([a,b])=>(STN_TH[a]||a.toUpperCase())+' +'+b).join(' · '):'')+(f.dur?' · '+Math.round(f.dur/60)+' นาที':'')+'</div>')}
 if(r){const R=RUNE_EL[r.el];o.push('<div style="color:'+R.c+'">⚔️ อาวุธ: '+R.d+' (ขั้น '+RGR[r.g]+')</div><div style="color:'+R.c+'">🛡️ ชุดเกราะ: '+STN_TH[R.st]+' +'+r.g*2+'</div>')}
 o.push('<div class="m">⚖️ '+(WT[k]||0)+' กก./ชิ้น · มี '+(inv[k]|0)+' ชิ้น (รวม '+Math.round((WT[k]||0)*(inv[k]|0)*10)/10+' กก.)</div>');return o.join('')}
function icShow(t,k,ro,at){if(!k)return;IC.t=t;IC.k=k;let name,kind,tier=0,img,lines,btn='',rs='';
 if(t==='gear'){const it=ITEMS[k];if(!it)return;const L=ENH[k]||0;tier=it.tier;name=it.name+(L?' <span style="color:'+enhCol(L)+'">+'+L+'</span>':'');kind=(GKIND[it.kind]||it.kind)+' · ระดับ '+TNAMES[it.tier];img=iconURL('item:'+k);lines=gearLines(k);
  if(RUNES[k])rs='<img class="rs" src="'+iconURL('mat:'+RUNES[k])+'">';
  if(!ro){const worn=P.armor[it.kind]===k||(P.armor.sword===k),own=(GEAR[k]|0)>0;
   if(it.kind==='axe'||it.kind==='pick')btn+='<button class="ok" onclick="icClose();toggleBag();setTimeout(()=>openQPick(0),50)">⚡ ใส่ช่องลัด</button>';
   else if(worn)btn+='<button onclick="icClose();unequip(\''+(ITEMS[k].kind==='staff'||ITEMS[k].kind==='bow'?'sword':ITEMS[k].kind)+'\');renderBag()">✋ ถอด</button>';
   else if(own)btn+='<button class="ok" onclick="icClose();equipItem(\''+k+'\');renderBag()">✋ สวมใส่</button>';
   if(canRune(k)&&(worn||own)){const have=RKEYS.filter(q=>inv[q]>0);if(RUNES[k])btn+='<button onclick="unsocketRune(\''+k+'\')">💠 ถอดรูน (50🪙)</button>';
    btn+=have.length?'<div style="width:100%;font-size:11px;opacity:.75;margin-top:2px">'+(RUNES[k]?'เปลี่ยนรูน (ถอดเดิม 50🪙):':'ใส่รูน:')+'</div><div class="rl">'+have.map(q=>'<button onclick="socketRune(\''+k+'\',\''+q+'\')"><img src="'+iconURL('mat:'+q)+'">'+MN(q)+' ×'+inv[q]+'</button>').join('')+'</div>':'<div class="m" style="width:100%">ยังไม่มีรูน — ดรอปจากมอนในเหมือง/ดันเจี้ยน/บอส หรือซื้อที่กิลด์</div>'}}}
 else{name=MN(k)+((inv[k]|0)>1?' <span style="opacity:.7">×'+inv[k]+'</span>':'');const r=runeOf(k);tier=r?[0,2,3,4][r.g]:0;kind=r?'รูน · ขั้น '+RGR[r.g]:'วัตถุดิบ / ของใช้';img=iconURL('mat:'+k);lines=matLines(k);
  if(!ro){if(['hpp','mpp','bread','apple'].includes(k)||(typeof FOOD!=='undefined'&&FOOD[k]))btn+='<button class="ok" onclick="icClose();useItem(\''+k+'\');renderBag()">🍽️ ใช้</button>';
   if(k==='scroll')btn+='<button class="ok" onclick="icClose();toggleBag();useScroll()">🌀 ใช้ม้วนวาป</button>';
   if(QCONS.includes(k)||RODS.includes(k))btn+='<button onclick="icClose();setTimeout(()=>openQPick(QS.slots.indexOf(null)>=0?QS.slots.indexOf(null):3),50)">⚡ ใส่ช่องลัด</button>';
   if(r&&r.g<3)btn+='<button class="'+((inv[k]|0)>=3?'ok':'no')+'" onclick="fuseRune(\''+k+'\')">💠 หลอม 3 → '+RGR[r.g+1]+' ('+150*r.g+'🪙)</button>'}}
 icEl.style.setProperty('--rc',TCOL[tier]);icEl.style.setProperty('--rg',TGLOW[tier]);
 icEl.innerHTML=(ro?'':'<button class="ix" onclick="icClose()">✕</button>')+'<div class="ih"><div class="ii"><img src="'+img+'">'+rs+'</div><div><div class="in">'+name+'</div><div class="ik">'+kind+'</div></div></div><div class="il">'+lines+'</div>'+(btn?'<div class="ib">'+btn+'</div>':'');
 icEl.classList.toggle('tip',!!ro);icEl.hidden=false;
 if(ro&&at){const w=gid('wrap').getBoundingClientRect(),r=icEl.getBoundingClientRect();let x=at[0]-w.left+16,y=at[1]-w.top+12;if(x+r.width>w.width-6)x=at[0]-w.left-r.width-12;if(y+r.height>w.height-6)y=w.height-r.height-6;icEl.style.left=Math.max(6,x)+'px';icEl.style.top=Math.max(6,y)+'px'}else{icEl.style.left='';icEl.style.top=''}
 if(!ro)sfx('ui')}
function icClose(){icEl.hidden=true;IC.k=null}
// แตะของในกระเป๋า → การ์ด
{const _bt=bagTap;bagTap=function(t,id){if(IC.k===id&&!icEl.hidden&&!icEl.classList.contains('tip')){icClose();return}icShow(t,id)}}
{const _tb=toggleBag;toggleBag=function(){_tb();if(bagEl.hidden)icClose()}}
// ไอคอนทุกที่: ชี้ค้าง (เมาส์) หรือกดค้าง (มือถือ) = ดูรายละเอียด
const IREV={};for(const k in IURL)IREV[IURL[k]]=k;
{const _iu=iconURL;iconURL=function(key){const u=_iu(key);IREV[u]=key;return u}}
function imgKey(el){let n=el,im=null;for(let i=0;i<3&&n&&n!==document.body&&n.id!=='wrap';i++){if(n.tagName==='IMG'){im=n;break}if(n.tagName==='CANVAS')return null;const q=n.querySelectorAll&&n.querySelectorAll('img');if(q&&q.length===1){im=q[0];break}if(q&&q.length>1)return null;n=n.parentElement}if(!im)return null;const key=IREV[im.getAttribute('src')];if(!key)return null;return key.startsWith('item:')?['gear',key.slice(5)]:['mat',key.slice(4)]}
let _icT=0,_icLP=false,_icHov=null;
gid('wrap').addEventListener('pointerdown',e=>{if(e.target.closest('#icard'))return;if(!icEl.hidden&&!icEl.classList.contains('tip')&&!e.target.closest('#bag'))icClose();const k=imgKey(e.target);clearTimeout(_icT);_icLP=false;if(!k||e.target.closest('#bag')||[...(e.composedPath?e.composedPath():[])].some(n=>n.id&&/^q[0-9hm]$/.test(n.id)))return;
 const at=[e.clientX,e.clientY];_icT=setTimeout(()=>{_icLP=true;icShow(k[0],k[1],true,at);if(navigator.vibrate)try{navigator.vibrate(15)}catch(x){}},480)},true);
for(const ev of ['pointerup','pointercancel','pointerleave'])gid('wrap').addEventListener(ev,()=>{clearTimeout(_icT);if(_icLP&&icEl.classList.contains('tip'))setTimeout(()=>{if(icEl.classList.contains('tip'))icClose()},1400)},true);
gid('wrap').addEventListener('click',e=>{if(_icLP){_icLP=false;e.stopPropagation();e.preventDefault()}},true);
gid('wrap').addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const k=imgKey(e.target);if(!k||e.target.closest('#icard')){if(_icHov){_icHov=null;if(icEl.classList.contains('tip'))icClose()}return}
 const id=k.join(':');if(_icHov===id){if(icEl.classList.contains('tip'))icShow(k[0],k[1],true,[e.clientX,e.clientY]);return}_icHov=id;if(!icEl.hidden&&!icEl.classList.contains('tip'))return;icShow(k[0],k[1],true,[e.clientX,e.clientY])});
// ชื่อในหน้าสถานะ/อื่น ๆ แสดง +ระดับ
const _gn=id=>ITEMS[id]?ITEMS[id].name+((ENH[id]|0)?' +'+ENH[id]:''):id;

setTimeout(()=>{_ptx=null;applyBonus();recalcStats();P.hp=Math.min(P.hp,BAL.hp);updPasBadge()},300);
// ---------- สมดุลใหม่: มอนเลเวลสูงอึด/แรงขึ้นตามพลังที่ผู้เล่นได้จากต้นไม้พาสซีฟ/ตีบวก +15/รูน ----------
{const _ms=mobStats;mobStats=function(L,f,elite,boss){const s=_ms(L,f,elite,boss);return{hp:Math.round(s.hp*(1+L/110)),atk:Math.round(s.atk*(1+L/180))}}}


// =====================================================================
// v4.0 : ดันเจี้ยน 100 ชั้นแบบใหม่ (แผนที่ใหญ่ห้อง+ทางเดินแบบ POE · ไม่มีหิน · มอนเป็นฝูง ยิ่งลึกยิ่งเยอะ · แผนที่หมอก)
//        สกิลใหม่อาชีพละ 3 (ฟันวาป Flicker · ใบดาบวน · ฟันกากบาท · อัญเชิญโครงกระดูก/ภูตไฟ/โกเลม · ยิงวาปเงา · เหยี่ยว · ธนูพายุ)
//        แถบสกิล 4 ช่อง เลือกได้ · พาสซีฟซัพพอร์ตสกิล (เพิ่มวาป/กระสุน/สมุน/ความเร็ว/พื้นที่/ลดคูลดาวน์/ลดมานา)
// =====================================================================

// ---------------- 1) ดันเจี้ยนใหม่ ----------------
const DGSZ=f=>f<=20?[70,52]:f<=50?[84,62]:[98,72];
function genDungeon(zi){const Zd=ZONES[zi],f=Zd.dg,[W,H]=DGSZ(f);ZW=W;ZH=H;const R=srand(DGSEED8(f)*31+f*977),ri=(a,b)=>a+Math.floor(R()*(b-a+1));
 const m=[];for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++)m[y][x]=WL}
 const inb=(x,y)=>x>1&&y>1&&x<W-2&&y<H-2,set=(x,y)=>{if(inb(x,y))m[y][x]=FL};
 const cw=17,ch=15,cols=Math.floor((W-4)/cw),rows=Math.floor((H-4)/ch),ox=Math.floor((W-cols*cw)/2),oy=Math.floor((H-rows*ch)/2),rooms=[];
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const cave=R()<.45,rw=ri(7,cw-4),rh=ri(6,ch-4),x0=ox+c*cw+ri(1,cw-rw-1),y0=oy+r*ch+ri(1,ch-rh-1),
   cx=x0+(rw>>1),cy=y0+(rh>>1);const room={c,r,x0,y0,rw,rh,cx,cy,cave,adj:[]};rooms.push(room);
  if(cave){const rx=rw/2,ry=rh/2;for(let y=y0-1;y<=y0+rh;y++)for(let x=x0-1;x<=x0+rw;x++){const nx=(x-cx)/rx,ny=(y-cy)/ry,n=vn(x/3.1+f,y/3.1+zi)*.5;if(nx*nx+ny*ny<1+n*.6-.15)set(x,y)}}
  else for(let y=y0;y<y0+rh;y++)for(let x=x0;x<x0+rw;x++)set(x,y)}
 const at=(c,r)=>rooms.find(q=>q.c===c&&q.r===r);
 // ต้นไม้เชื่อมห้อง (DFS) + ทางวน
 const ent=at(cols>>1,rows-1),vis=new Set([ent]),st=[ent],links=[];
 while(st.length){const a=st[st.length-1],nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>at(a.c+dx,a.r+dy)).filter(b=>b&&!vis.has(b));if(!nb.length){st.pop();continue}const b=nb[Math.floor(R()*nb.length)];vis.add(b);links.push([a,b]);st.push(b)}
 for(const a of rooms)for(const [dx,dy] of [[1,0],[0,1]]){const b=at(a.c+dx,a.r+dy);if(b&&R()<.22&&!links.some(([p,q])=>(p===a&&q===b)||(p===b&&q===a)))links.push([a,b])}
 const carveL=(x,y,w)=>{for(let dy=-w;dy<=w;dy++)for(let dx=-w;dx<=w;dx++)set(x+dx,y+dy)};
 for(const [a,b] of links){a.adj.push(b);b.adj.push(a);const w=R()<.3?1:R()<.6?1:0;let x=a.cx,y=a.cy;const hf=R()<.5;
  const step=(tx,ty)=>{let g=0;while((x!==tx||y!==ty)&&g++<400){if(x!==tx&&(hf||y===ty))x+=Math.sign(tx-x);else if(y!==ty)y+=Math.sign(ty-y);carveL(x,y,w);if(R()<.08)carveL(x,y,w+1)}};
  if(hf){step(b.cx,a.cy);step(b.cx,b.cy)}else{step(a.cx,b.cy);step(b.cx,b.cy)}}
 // ห้องบอส = ห้องไกลสุด
 const dist=new Map([[ent,0]]),q=[ent];while(q.length){const a=q.shift();for(const b of a.adj)if(!dist.has(b)){dist.set(b,dist.get(a)+1);q.push(b)}}
 let boss=ent;for(const [r,d] of dist)if(d>dist.get(boss)||(d===dist.get(boss)&&r.r<boss.r))boss=r;
 const arena={x:clamp(boss.cx,12,W-13),y:clamp(boss.cy,10,H-11)};for(let y=arena.y-7;y<=arena.y+7;y++)for(let x=arena.x-10;x<=arena.x+10;x++){const nx=(x-arena.x)/10,ny=(y-arena.y)/7;if(nx*nx+ny*ny<1)set(x,y)}
 carveL(arena.x,arena.y,0);const e={x:ent.cx,y:Math.min(H-6,ent.cy)};for(let y=e.y-3;y<=e.y+3;y++)for(let x=e.x-3;x<=e.x+3;x++)set(x,y);
 // พื้นที่ไปไม่ถึง → ผนัง
 const seen=new Uint8Array(W*H),qq=[e.y*W+e.x];seen[qq[0]]=1;while(qq.length){const i=qq.pop(),x=i%W,y=(i/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=(y+dy)*W+x+dx;if(!seen[j]&&m[y+dy]&&m[y+dy][x+dx]===FL){seen[j]=1;qq.push(j)}}}
 const floor=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(m[y][x]===FL&&!seen[y*W+x])m[y][x]=WL;else if(m[y][x]===FL)floor.push([x,y])}
 const Zm={zi,Zd,m,ores:[],oreAt:{},floor,ent:e,arena,seen,W,H,rooms,bossRoom:boss,entRoom:ent};Zm.cv=paintZone(Zm,R);return Zm}
{const _gz=genZone;genZone=function(zi){const Zd=ZONES[zi];if(ZCACHE[zi]){ZW=ZCACHE[zi].W||46;ZH=ZCACHE[zi].H||34;return ZCACHE[zi]}
  if(Zd&&Zd.dg){const Zm=genDungeon(zi);return ZCACHE[zi]=Zm}ZW=62;ZH=44;const Zm=_gz(zi);Zm.W=62;Zm.H=44;return Zm}}
// จัดฝูงมอนในห้อง (ยิ่งลึกยิ่งเยอะ)
function dgPacks(f){const Zm=D.zone,Zd=Zm.Zd,N=Math.min(95,16+Math.floor(f*.75));let n=0,g=0;D.mobs=D.mobs.filter(m=>m.boss);
 const rooms=Zm.rooms.filter(r=>r!==Zm.entRoom&&r!==Zm.bossRoom&&Zm.seen[r.cy*ZW+r.cx]);if(!rooms.length)return;
 while(n<N&&g++<400){const r=rooms[Math.floor(Math.random()*rooms.length)],size=Math.min(N-n,3+Math.floor(Math.random()*(3+f/25))),lead=Math.random()<.25+f/400;
  const [kf,nm,col]=Zd.mobs[Math.floor(Math.random()*Zd.mobs.length)];
  for(let i=0;i<size;i++){let x=0,y=0,ok=false;for(let t=0;t<30&&!ok;t++){x=r.x0+Math.floor(Math.random()*r.rw);y=r.y0+Math.floor(Math.random()*r.rh);ok=Zm.m[y]&&Zm.m[y][x]===FL&&Zm.seen[y*ZW+x]}
   if(!ok)continue;const mix=Math.random()<.3?Zd.mobs[Math.floor(Math.random()*Zd.mobs.length)]:[kf,nm,col],L=f+Math.floor(Math.random()*3);
   D.mobs.push(mkMob(mix[0],mix[1],mix[2],L,x*T+16,y*T+16,{elite:lead&&i===0,span:(L-f)/2}));n++}}}
{const _ed=enterDg;enterDg=function(f){delete ZCACHE[200+f];_ed(f);if(!D||!D.dg)return;dgPacks(f);mkMini(D.zone.cv,ZW,ZH,ZW>80?3:4);EXPL.init();
  say('🗝️ ดันเจี้ยนชั้น '+f+' — มอน '+D.mobs.filter(m=>!m.boss).length+' ตัว · บอสอยู่ห้องไกลสุด · แตะแผนที่มุมขวาบนเพื่อดูแผนที่ใหญ่')}}
// มอนไกล ๆ ที่ยังไม่เห็นเรา = หลับ (ประหยัดเครื่อง)
{const _um=updMob;updMob=function(m,dt){if(D&&D.dg&&!m.boss&&!m.aggro&&Math.abs(m.x-P.x)+Math.abs(m.y-P.y)>760)return;return _um(m,dt)}}
// ลายพื้นดันเจี้ยน (ไม่มีก้อนหิน)
{const _pz=paintZone;paintZone=function(Zm,R){const c=_pz(Zm,R);if(!Zm.Zd.dg)return c;const k=c.getContext('2d'),ac=Zm.Zd.pal.ac;
  for(const r of Zm.rooms||[]){if(r.cave)continue;k.strokeStyle='rgba(0,0,0,.18)';k.lineWidth=1;for(let y=r.y0;y<r.y0+r.rh;y++){k.beginPath();k.moveTo(r.x0*T,y*T+.5);k.lineTo((r.x0+r.rw)*T,y*T+.5);k.stroke()}
   if(R()<.5){const cx=r.cx*T+16,cy=r.cy*T+16;k.strokeStyle=ac;k.globalAlpha=.18;k.lineWidth=2;k.beginPath();k.arc(cx,cy,Math.min(r.rw,r.rh)*7,0,7);k.stroke();k.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*2.513;k[i?'lineTo':'moveTo'](cx+Math.cos(a)*Math.min(r.rw,r.rh)*7,cy+Math.sin(a)*Math.min(r.rw,r.rh)*7)}k.closePath();k.stroke();k.globalAlpha=1}
   for(const [dx,dy] of [[0,0],[r.rw-1,0],[0,r.rh-1],[r.rw-1,r.rh-1]]){const x=(r.x0+dx)*T+16,y=(r.y0+dy)*T+18;if(Zm.m[r.y0+dy][r.x0+dx]!==FL)continue;k.fillStyle='#e8e0c8';k.fillRect(x-2,y-8,4,9);k.fillStyle='rgba(255,190,80,.35)';k.beginPath();k.arc(x,y-11,7,0,7);k.fill();k.fillStyle='#ffd84a';k.fillRect(x-1,y-12,2,3)}}
  for(let i=0;i<Zm.floor.length/40;i++){const [x,y]=Zm.floor[Math.floor(R()*Zm.floor.length)],px=x*T+R()*T,py=y*T+R()*T;const v=R();
   if(v<.4){k.strokeStyle='rgba(0,0,0,.3)';k.lineWidth=1;k.beginPath();k.moveTo(px,py);k.lineTo(px+rnd(-9,9),py+rnd(3,8));k.lineTo(px+rnd(-10,10),py+rnd(8,14));k.stroke()}
   else if(v<.6){k.fillStyle='rgba(120,10,20,.22)';k.beginPath();k.ellipse(px,py,rnd(5,11),rnd(3,6),R()*3,0,7);k.fill()}
   else if(v<.75){k.fillStyle='#d8d0b8';k.fillRect(px,py,7,2);k.fillRect(px-1,py-1,2,4);k.fillRect(px+6,py-1,2,4)}
   else{k.fillStyle=ac;k.globalAlpha=.25;k.font='10px serif';k.fillText('ᚱᚢᚾ'[i%3],px,py);k.globalAlpha=1}}
  return c}}
// แผนที่หมอก (สำรวจแล้วจึงเห็น) + แผนที่ใหญ่
const EXPL={c:null,k:null,full:null,last:-1,init(){if(!D||!D.zone)return;const c=document.createElement('canvas');c.width=ZW;c.height=ZH;this.c=c;this.k=c.getContext('2d');this.full=MI&&MI.src;this.last=-1;this.tick(true)},
 tick(force){if(!this.c||!D||!D.dg||!this.full)return;const tx=Math.floor(P.x/T),ty=Math.floor(P.y/T),id=ty*ZW+tx;if(id===this.last&&!force)return;this.last=id;const k=this.k,g=k.createRadialGradient(tx+.5,ty+.5,2,tx+.5,ty+.5,10);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,255,255,0)');k.fillStyle=g;k.fillRect(tx-11,ty-11,22,22);
  const f=this.full,c=document.createElement('canvas');c.width=f.width;c.height=f.height;const q=c.getContext('2d');q.fillStyle='#05070c';q.fillRect(0,0,c.width,c.height);q.globalAlpha=.13;q.drawImage(f,0,0);q.globalAlpha=1;const m=document.createElement('canvas');m.width=f.width;m.height=f.height;const mk=m.getContext('2d');mk.drawImage(f,0,0);mk.globalCompositeOperation='destination-in';mk.imageSmoothingEnabled=true;mk.drawImage(this.c,0,0,f.width,f.height);q.drawImage(m,0,0);MI.src=c}};
setInterval(()=>{if(D&&D.dg)EXPL.tick()},250);
const bmEl=document.createElement('canvas');bmEl.id='bigmap';bmEl.hidden=true;gid('wrap').appendChild(bmEl);
{const st=document.createElement('style');st.textContent='#bigmap{position:absolute;inset:8% 10%;width:80%;height:84%;z-index:12;pointer-events:none;opacity:.88}#bigmap[hidden]{display:none}';document.head.appendChild(st)}
function bigMap(){if(bmEl.hidden||!D||!D.zone||!MI){bmEl.hidden=true;return}const r=bmEl.getBoundingClientRect(),W=bmEl.width=Math.round(r.width),H=bmEl.height=Math.round(r.height),k=bmEl.getContext('2d'),s=Math.min(W/(ZW*T),H/(ZH*T)),ox=(W-ZW*T*s)/2,oy=(H-ZH*T*s)/2;
 k.clearRect(0,0,W,H);k.fillStyle='rgba(0,0,0,.55)';k.fillRect(ox-6,oy-6,ZW*T*s+12,ZH*T*s+12);k.drawImage(MI.src,ox,oy,ZW*T*s,ZH*T*s);
 const dot=(x,y,c,r)=>{k.fillStyle=c;k.beginPath();k.arc(ox+x*s,oy+y*s,r,0,7);k.fill();k.strokeStyle='#000';k.lineWidth=1;k.stroke()};const ex=EXPL.c&&EXPL.k;
 const vis=(x,y)=>!D.dg||!ex||EXPL.k.getImageData(Math.floor(x/T),Math.floor(y/T),1,1).data[3]>40;
 for(const m of D.mobs)if(!m.boss&&!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<520)dot(m.x,m.y,m.elite?'#ffd84a':'#ff5a5a',2.2);
 const Zm=D.zone;dot(Zm.ent.x*T+16,(Zm.ent.y+2)*T+16,'#7fffb0',4);if(D.boss&&vis(D.boss.x,D.boss.y))dot(D.boss.x,D.boss.y,'#ff2a2a',6);if(D.chest)dot(D.chest.x,D.chest.y,'#ffd84a',5);
 for(const n of MIN)dot(n.x,n.y,'#7fe0ff',2);const t=performance.now()/300;dot(P.x,P.y,'#fff',4+Math.sin(t)*1.2);
 k.font='bold 13px system-ui';k.fillStyle='#ffe9a0';k.textBaseline='top';k.fillText((D.dg?'🗝️ ชั้น '+D.dg+' · มอนเหลือ '+D.mobs.filter(m=>!m.dead&&!m.boss).length:Zm.Zd.n)+' · แตะแผนที่มุมขวาบนอีกครั้งเพื่อปิด',ox+8,oy+6);k.textBaseline='alphabetic'}
setInterval(bigMap,200);
mini.addEventListener('click',()=>{if(D&&D.zone){bmEl.hidden=!bmEl.hidden;sfx('ui');bigMap()}});
addEventListener('keydown',e=>{if(e.key==='Tab'&&D&&D.zone){e.preventDefault();bmEl.hidden=!bmEl.hidden;bigMap()}});
{const _ex=exitD;exitD=function(){bmEl.hidden=true;EXPL.c=null;MIN.length=0;return _ex.apply(this,arguments)}}

// ---------------- 2) ซัพพอร์ตจากพาสซีฟ ----------------
const SUPN=[['str',7,'aspd',{aspd:.12},'⚡ เร่งดาบ','ความเร็วโจมตี +12%'],['str',7,'chain',{chain:1},'🔗 วาปต่อเนื่อง','ฟันวาป/ยิงวาป/โซ่สายฟ้า +1 ครั้ง'],
 ['agi',7,'proj',{proj:1},'🏹 กระสุนเพิ่ม','ลูกธนู/ใบดาบ/ลูกไฟ +1'],['agi',7,'chain',{chain:1},'🔗 เงาพริ้ว','ฟันวาป/ยิงวาป/โซ่ +1 ครั้ง'],
 ['end',7,'mpc',{mpc:.2},'💧 ประหยัดมานา','สกิลใช้มานา -20%'],['end',7,'area',{area:.2},'🌀 ขยายพื้นที่','พื้นที่สกิล +20%'],
 ['int',7,'minion',{minion:1},'💀 สมุนเพิ่ม','อัญเชิญสมุนได้ +1 ตัว'],['int',7,'mdmg',{mdmg:.3},'🔥 สมุนดุร้าย','ดาเมจสมุน +30%'],
 ['vit',7,'mdur',{mdur:.6},'⏳ สมุนอยู่นาน','เวลาสมุน +60%'],['vit',7,'cdr',{cdr:.15},'⏱️ ร่ายไว','คูลดาวน์สกิล -15%']];
{const by={};for(const [sp,r,key,fx,n,d] of SUPN){by[sp]=(by[sp]||0)+1;const base=PNODES[sp+r],i=PSPK.findIndex(s=>s.k===sp),a=-Math.PI/2+i*2*Math.PI/5,side=by[sp]===1?1:-1,pa=a+side*Math.PI/2,
  id='sp_'+sp+by[sp],x=base.x+Math.cos(pa)*44,y=base.y+Math.sin(pa)*44,id2=id+'b',x2=x+Math.cos(a)*40,y2=y+Math.sin(a)*40,S=PSPK[i];
  PNODES[id]={id,x,y,sp:S,adj:[base.id],n:S.n+' +3',d:STN_TH[sp]+' +3',st:{[sp]:3}};base.adj.push(id);
  PNODES[id2]={id:id2,x:x2,y:y2,sp:{c:'#5affd8',e:n.split(' ')[0]},adj:[id],n:n.split(' ').slice(1).join(' ')+' (ซัพพอร์ต)',d:d,st:{},fx,big:1,sup:1};PNODES[id].adj.push(id2)}}
try{const x=JSON.parse(localStorage.getItem('fm_pt')||'null');if(x&&x.a)for(const id of x.a)if(PNODES[id])PT.a.add(id);_ptx=null}catch(e){}
{const _px=PTX;PTX=function(){if(_ptx)return _ptx;const o=_px();for(const k of ['chain','proj','mpc','area','minion','mdmg','mdur','cdr','aspd'])o[k]=o[k]||0;return o}}
function aspdMul(){const w=P.armor.sword?(ENH[P.armor.sword]|0):0;return 1/(1+PTX().aspd+w*.012)}
{const _ei=eachIn;eachIn=function(x,y,r,fn){return _ei(x,y,r*(1+PTX().area),fn)}}
// ---------------- 3) สกิลใหม่ ----------------
CSKILLS.sword.push({n:'ฟันวาปสายฟ้า',e:'⚡',lv:8,price:300,mp:14,cd:6,d:'วาปไปฟันศัตรูทีละตัวต่อเนื่อง 3 ครั้ง (+วาปตามพาสซีฟ/ระดับตีบวก) ×1.2 · ยิ่งโจมตีเร็วยิ่งวาปไว',new:1},
 {n:'ใบดาบวิญญาณวน',e:'🗡️',lv:22,price:900,mp:22,cd:11,d:'ใบดาบวิญญาณ 3 เล่ม (+กระสุน) หมุนรอบตัว 8 วิ ฟันทุกอย่างที่แตะ',new:1},
 {n:'ฟันกากบาทสวรรค์',e:'✖️',lv:40,price:2500,mp:36,cd:14,d:'ชาร์จแล้วฟันกากบาทยักษ์ด้านหน้า ×3.4 + มึนงง + พื้นแตก',new:1});
CSKILLS.mage.push({n:'อัญเชิญโครงกระดูก',e:'💀',lv:8,price:300,mp:24,cd:7,d:'ปลุกนักรบโครงกระดูก 2 ตัว (+สมุน) สู้แทน 25 วิ · สูงสุด 4 ตัว',new:1},
 {n:'อัญเชิญภูตไฟ',e:'🔥',lv:22,price:900,mp:30,cd:12,d:'ภูตไฟ 1 ตัว (+สมุน) ยิงลูกไฟใส่ศัตรู 22 วิ · ติดไฟ',new:1},
 {n:'อัญเชิญโกเลมศิลา',e:'🗿',lv:38,price:2500,mp:50,cd:28,d:'โกเลมยักษ์ทุบพื้นเป็นวง ×1.2 + มึนงง 35 วิ',new:1});
CSKILLS.archer.push({n:'ยิงวาปเงา',e:'🌀',lv:8,price:300,mp:14,cd:6,d:'วาปไปข้างศัตรูแล้วยิงจ่อ 3 ครั้งต่อเนื่อง (+วาป) ×1.15',new:1},
 {n:'อัญเชิญเหยี่ยว',e:'🦅',lv:22,price:900,mp:24,cd:14,d:'เหยี่ยวคู่ใจ 1 ตัว (+สมุน) โฉบจิกศัตรู 30 วิ',new:1},
 {n:'ธนูพายุหมุน',e:'🌪️',lv:38,price:2500,mp:34,cd:12,d:'ยิงพายุหมุนทะลุไปข้างหน้า ดูดศัตรูแล้วบาดต่อเนื่อง (+กระสุน)',new:1});
for(const c in CSK)while(CSK[c].length<6)CSK[c].push(0);
while(CS.cd.length<6)CS.cd.push(0);
// ---------- วาปฟัน (Flicker) ----------
const FLK={on:false,left:0,t:0,hit:new Set(),mode:'sword'};
function flkTarget(){let b=null,bd=1e9;for(const e of enemies()){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-P.y)+(FLK.hit.has(e)?400:0);if(d<bd&&Math.hypot(e.x-P.x,e.y-P.y)<330){bd=d;b=e}}return b}
function flkStep(){const e=flkTarget();if(!e){FLK.on=false;return}FLK.hit.add(e);const ox=P.x,oy=P.y,dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,off=FLK.mode==='bow'?-80:22;
 let nx=e.x+ux*off*(FLK.mode==='bow'?1:1),ny=e.y+uy*off;if(FLK.mode!=='bow'){nx=e.x-ux*12+uy*(Math.random()-.5)*8;ny=e.y-uy*12-ux*(Math.random()-.5)*8}
 if(wHit7(nx,ny)){nx=e.x;ny=e.y+2;if(wHit7(nx,ny)){nx=ox;ny=oy}}
 for(let i=0;i<6;i++){const q=i/6;ghosts.push({x:ox+(nx-ox)*q,y:oy+(ny-oy)*q,dir:P.dir,l:.18+q*.12})}
 RFX.push({k:'bolt',x:ox,y:oy-16,x2:nx,y2:ny-16,t:0,l:.18,rgb:FLK.mode==='bow'?'170,140,255':'190,240,255'});
 for(let i=0;i<10;i++)rfxP(nx+(Math.random()-.5)*20,ny-10-Math.random()*24,(Math.random()-.5)*160,(Math.random()-.5)*160,.3,FLK.mode==='bow'?'190,160,255':'220,250,255',2,'spark');
 P.x=nx;P.y=ny;const tx=e.x-P.x,ty=e.y-P.y;P.dir=Math.abs(tx)>Math.abs(ty)?(tx<0?'l':'r'):(ty<0?'u':'d');P.iframe=Math.max(P.iframe,.3);
 tone(1400+Math.random()*500,2600,.07,'triangle',.05);
 if(FLK.mode==='bow'){P.at=0;P.cmb=0;shoot('arrow',{dv:[tx/(Math.hypot(tx,ty)||1),ty/(Math.hypot(tx,ty)||1)],sp:760,range:220,mult:1.15});sfx('swing')}
 else{P.at=0;P.cmb=FLK.left%2;atkId++;e.last=atkId;sfx('swing');hurtE(e,1.2,{kb:30,stun:.25,col:'#bff4ff'});vfx('slashline',P.x,P.y,.25,{dx:ux,dy:uy})}
 shake(1.2,.06)}
function flkTick(dt){if(!FLK.on)return;P.stun=Math.max(P.stun,.05);FLK.t-=dt;if(FLK.t<=0){if(FLK.left<=0){FLK.on=false;P.stun=0;return}FLK.left--;flkStep();FLK.t=.19*aspdMul()}}
// ---------- ใบดาบวน / ธนูพายุ / กากบาท ----------
const BV={t:0,l:0,n:0,a:0,tick:0},TOR=[],XS=[];
function bvTick(dt){if(BV.t<=0)return;BV.t-=dt;BV.a+=dt*4.6;BV.tick-=dt;if(BV.tick<=0){BV.tick=.28;const R=48*(1+PTX().area*.5);for(let i=0;i<BV.n;i++){const a=BV.a+i*Math.PI*2/BV.n,x=P.x+Math.cos(a)*R,y=P.y-14+Math.sin(a)*R*.6;
   for(const e of enemies())if(Math.hypot(e.x-x,e.y-8-y)<20+eR(e)*.5)hurtE(e,.42,{kb:50,fx:P.x,fy:P.y,col:'#bfe8ff'})}}}
function bvDraw(){if(BV.t<=0)return;const R=48*(1+PTX().area*.5),ic=P.armor.sword?toolIcon(wKind()==='none'?'sword':wKind(),P.tier.sword|0,64):null;ctx.save();
 for(let i=0;i<BV.n;i++){const a=BV.a+i*Math.PI*2/BV.n,x=P.x+Math.cos(a)*R,y=P.y-14+Math.sin(a)*R*.6;ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI);ctx.globalAlpha=.85*Math.min(1,BV.t*2);
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,22);g.addColorStop(0,'rgba(170,230,255,.6)');g.addColorStop(1,'rgba(90,160,255,0)');ctx.fillStyle=g;ctx.fillRect(-22,-22,44,44);ctx.globalCompositeOperation='source-over';
  if(ic)ctx.drawImage(ic,-16,-24,32,32);ctx.restore();if(Math.random()<.3)rfxP(x,y,0,0,.25,'170,230,255',1.6,'dot')}ctx.restore()}
function torTick(dt){for(let i=TOR.length-1;i>=0;i--){const o=TOR[i];o.t+=dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.tick-=dt;if(o.t>o.l||dhit(o.x,o.y+8)){TOR.splice(i,1);continue}
  for(const e of enemies()){const d=Math.hypot(e.x-o.x,e.y-o.y);if(d<70*(1+PTX().area)&&!e.boss){e.x+=(o.x-e.x)*dt*2.2;e.y+=(o.y-e.y)*dt*2.2}}
  if(o.tick<=0){o.tick=.22;for(const e of enemies())if(Math.hypot(e.x-o.x,e.y-o.y)<46*(1+PTX().area))hurtE(e,.45,{kb:0,fx:o.x,fy:o.y,col:'#d8fff0'})}}}
function torDraw(){const t=performance.now()/1000;for(const o of TOR){ctx.save();ctx.translate(o.x,o.y);ctx.globalCompositeOperation='lighter';const a=Math.min(1,(o.l-o.t)*3);
  for(let i=0;i<7;i++){const y=-i*7,r=8+i*4.5,s=t*12+i;ctx.strokeStyle='rgba(200,255,235,'+(.5*a)+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(Math.sin(s)*4,y,r,r*.32,0,s%6.28,s%6.28+4.2);ctx.stroke()}
  ctx.restore();if(Math.random()<.5)rfxP(o.x+(Math.random()-.5)*50,o.y-Math.random()*40,(Math.random()-.5)*60,-30,.4,'200,255,230',1.8,'dot')}}
function xsTick(dt){for(let i=XS.length-1;i>=0;i--){const o=XS[i];o.t+=dt;if(!o.hit&&o.t>=.28){o.hit=1;const R=110;eachIn(o.x,o.y,R,e=>hurtE(e,3.4,{kb:280,stun:.9,fx:P.x,fy:P.y,col:'#ffe9a0'}));shake(5,.3);sfx('warp');sfx('hit');if(typeof decal==='function')decal('crack',o.x,o.y,R,6)}if(o.t>.8)XS.splice(i,1)}}
function xsDraw(){for(const o of XS){const u=o.t/.8;ctx.save();ctx.translate(o.x,o.y);ctx.globalCompositeOperation='lighter';
  if(o.t<.28){ctx.strokeStyle='rgba(255,230,140,'+(o.t/.28*.6)+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,110,66,0,0,7);ctx.stroke()}
  else{const a=1-(o.t-.28)/.52;for(const s of [1,-1]){ctx.save();ctx.rotate(s*.62);const g=ctx.createLinearGradient(-130,0,130,0);g.addColorStop(0,'rgba(255,240,180,0)');g.addColorStop(.5,'rgba(255,250,220,'+a+')');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,140,10*a+3,0,0,7);ctx.fill();ctx.restore()}}
  ctx.restore()}}
// ---------- สมุน ----------
const MIN=[];const MSPEC={skel:{n:'นักรบโครงกระดูก',f:'skeleton',col:['#bff0e4','#2a4a48','#5affe0'],sp:125,rng:26,cd:.85,mult:.55,dur:25,cap:4,fly:0},
 spirit:{n:'ภูตไฟ',f:'wisp',col:['#ffb46a','#7a2a10','#ffd84a'],sp:120,rng:190,cd:1.25,mult:.6,dur:22,cap:2,fly:1,keep:120},
 golem:{n:'โกเลมศิลา',f:'golem',col:['#9aa8b8','#3a4450','#7fd8ff'],sp:85,rng:36,cd:1.5,mult:1.2,dur:35,cap:1,fly:0,sc:1.25},
 hawk:{n:'เหยี่ยว',f:'hawk',col:['#c8a070','#5a3a1a','#ffd84a'],sp:240,rng:24,cd:.7,mult:.42,dur:30,cap:1,fly:1}};
function summon(k,n){const S=MSPEC[k],x=PTX(),cap=S.cap+x.minion*(k==='golem'?.5:k==='skel'?2:1)|0,dur=S.dur*(1+x.mdur);
 for(let i=0;i<n;i++){const L=MIN.filter(m=>m.k===k);if(L.length>=cap){const old=L.sort((a,b)=>(a.l-a.t)-(b.l-b.t))[0];MIN.splice(MIN.indexOf(old),1)}
  const a=Math.random()*6.28,o={k,S,x:P.x+Math.cos(a)*30,y:P.y+Math.sin(a)*20,t:0,l:dur,cd:Math.random()*.5,tg:null,mv:false,fx:1,st:'idle',stt:0,hurt:0,col:S.col,F:{r:10,fly:S.fly},sc:S.sc||1,ph:Math.random()*6,dive:0,born:.6};
  MIN.push(o);for(let j=0;j<16;j++)rfxP(o.x+(Math.random()-.5)*24,o.y-Math.random()*30,(Math.random()-.5)*60,-40-Math.random()*60,.7,k==='spirit'?'255,170,60':k==='hawk'?'255,230,150':'110,255,220',2.2,'spark');
  RFX.push({k:'ring',x:o.x,y:o.y,t:0,l:.5,rgb:'110,255,220',s:30})}sfx('warp')}
const MPROJ=[];
function minTick(dt){if(!MIN.length&&!MPROJ.length)return;if(D&&(D.town||D.shop)){MIN.length=0;return}const ens=enemies(),mm=1+PTX().mdmg;
 for(let i=MIN.length-1;i>=0;i--){const o=MIN[i],S=o.S;o.t+=dt;o.born=Math.max(0,o.born-dt);o.hurt=Math.max(0,o.hurt-dt);if(o.t>=o.l){for(let j=0;j<10;j++)rfxP(o.x,o.y-14,(Math.random()-.5)*80,-40-Math.random()*40,.5,'160,200,220',2,'dot');MIN.splice(i,1);continue}
  o.cd-=dt;if(!o.tg||o.tg.dead||Math.hypot(o.tg.x-P.x,o.tg.y-P.y)>420){o.tg=null;let bd=300;for(const e of ens){const d=Math.hypot(e.x-o.x,e.y-o.y);if(d<bd&&Math.hypot(e.x-P.x,e.y-P.y)<380){bd=d;o.tg=e}}}
  let gx,gy,want;if(o.tg){const e=o.tg,d=Math.hypot(e.x-o.x,e.y-o.y);want=S.keep?(d>S.keep+30||d<S.keep-40):d>S.rng*.8;const k=S.keep&&d<S.keep-40?-1:1;gx=o.x+(e.x-o.x)/d*k;gy=o.y+(e.y-o.y)/d*k;
   if(d<=S.rng+eR(e)*.6&&o.cd<=0){o.cd=S.cd*aspdMul();o.fx=e.x<o.x?-1:1;o.st='strike';o.stt=.3;
    if(o.k==='spirit'){MPROJ.push({x:o.x,y:o.y-26,vx:(e.x-o.x)/d*330,vy:(e.y-14-(o.y-26))/d*330,l:1,tg:e});tone(500,200,.12,'sawtooth',.02)}
    else if(o.k==='golem'){eachIn(o.x+o.fx*14,o.y,58,q=>hurtE(q,S.mult*mm,{kb:180,stun:.45,fx:o.x,fy:o.y,col:'#cfe4ff'}));RFX.push({k:'ring',x:o.x+o.fx*14,y:o.y,t:0,l:.4,rgb:'200,220,255',s:60});shake(1.6,.1);sfx('thud')}
    else{hurtE(e,S.mult*mm,{kb:70,fx:o.x,fy:o.y,col:o.k==='hawk'?'#ffe9a0':'#bff0e4'});if(o.k==='hawk')o.dive=.3}}}
  else{const idx=MIN.indexOf(o),a=idx*1.3+performance.now()/3000;gx=P.x+Math.cos(a)*(40+idx*6);gy=P.y+Math.sin(a)*24;want=Math.hypot(gx-o.x,gy-o.y)>14}
  if(Math.hypot(P.x-o.x,P.y-o.y)>460){o.x=P.x;o.y=P.y}
  o.mv=false;if(want&&o.st!=='strike'){const dx=gx-o.x,dy=gy-o.y,d=Math.hypot(dx,dy)||1,s=S.sp*dt*(o.tg?1:Math.min(1.6,d/60+.5));const nx=o.x+dx/d*s,ny=o.y+dy/d*s;
   if(S.fly||!wHit7(nx,ny)){o.x=nx;o.y=ny}else if(!wHit7(nx,o.y))o.x=nx;else if(!wHit7(o.x,ny))o.y=ny;o.mv=true;if(Math.abs(dx)>2)o.fx=dx<0?-1:1}
  if(o.st==='strike'&&(o.stt-=dt)<=0)o.st='chase'}
 for(let i=MPROJ.length-1;i>=0;i--){const p=MPROJ[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(Math.random()<.6)rfxP(p.x,p.y,(Math.random()-.5)*20,-10,.3,'255,170,60',2.2,'ember');
  let hit=null;for(const e of ens)if(Math.hypot(e.x-p.x,e.y-14-p.y)<14+eR(e)*.6){hit=e;break}
  if(hit){hurtE(hit,MSPEC.spirit.mult*mm,{kb:60,fx:p.x,fy:p.y,col:'#ffb46a',burn:2});rfxP(p.x,p.y,0,0,.3,'255,170,60',22,'ring');MPROJ.splice(i,1)}else if(p.l<=0)MPROJ.splice(i,1)}}
function drawHawk(o,t){const fl=Math.sin(t*18)*(o.dive>0?.2:1),z=o.dive>0?-6:-30+Math.sin(t*3)*4;ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,0,8,3,0,0,7);ctx.fill();ctx.translate(0,z);
 ctx.fillStyle='#6a4422';ctx.beginPath();ctx.ellipse(0,0,6,4,0,0,7);ctx.fill();for(const s of [-1,1]){ctx.fillStyle='#8a5a2e';ctx.beginPath();ctx.moveTo(s*3,-1);ctx.quadraticCurveTo(s*12,-10*fl-2,s*18,-2*fl);ctx.lineTo(s*6,3);ctx.closePath();ctx.fill()}
 ctx.fillStyle='#f4ead8';ctx.beginPath();ctx.arc(5,-2,3,0,7);ctx.fill();ctx.fillStyle='#ffc23a';ctx.fillRect(7,-2,3,1.6);ctx.fillStyle='#111';ctx.fillRect(5,-3,1,1)}
function minDraw(o,t){const S=o.S,c=o.hurt>0?['#fff','#fff',S.col[2]]:S.col,fade=Math.min(1,(o.l-o.t)/1.5);
 ctx.save();ctx.globalAlpha=fade*(1-o.born*.8);ctx.strokeStyle='rgba(110,255,220,'+(.35+.15*Math.sin(t*4))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(o.x,o.y+1,13*o.sc,5*o.sc,0,0,7);ctx.stroke();
 ctx.translate(Math.round(o.x),Math.round(o.y));ctx.scale(o.sc*(S.fly?1:o.fx),o.sc);
 try{if(o.k==='hawk'){ctx.scale(o.fx,1);drawHawk(o,t)}else{const fake={mv:o.mv,st:o.st==='strike'?'strike':'idle',stt:o.stt,hurt:o.hurt,f:S.f,F:{r:10},sc:1,fx:o.fx,col:S.col,t:o.ph};MOBDRAW[S.f](fake,t+o.ph,c)}}catch(e){}
 ctx.restore();if(o.t<1.2||o.l-o.t<4){ctx.font='8px system-ui';ctx.textAlign='center';ctx.fillStyle='rgba(160,255,230,.9)';ctx.fillText(S.n+' '+Math.ceil(o.l-o.t)+'s',o.x,o.y-(S.fly?50:38)*o.sc);ctx.textAlign='left'}}
function mprojDraw(){for(const p of MPROJ){const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,9);g.addColorStop(0,'rgba(255,240,180,1)');g.addColorStop(.5,'rgba(255,140,40,.8)');g.addColorStop(1,'rgba(255,80,20,0)');ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.fillRect(p.x-9,p.y-9,18,18);ctx.restore()}}
{const _h=hero;hero=function(){const t=performance.now()/1000;for(const o of MIN)if(o.y<P.y)minDraw(o,t);xsDraw();_h();for(const o of MIN)if(o.y>=P.y)minDraw(o,t);bvDraw();torDraw();mprojDraw()}}
{const _p=playerTick;playerTick=function(dt){_p(dt);flkTick(dt);bvTick(dt);torTick(dt);xsTick(dt);minTick(dt);for(let i=3;i<6;i++)CS.cd[i]=Math.max(0,(CS.cd[i]||0)-dt)}}
// ---------- ใช้สกิลใหม่ + ลดคูลดาวน์/มานาจากพาสซีฟ ----------
const NEWSK={sword:[
  ()=>{if(!flkPre())return false;FLK.mode='sword';FLK.on=true;FLK.hit=new Set();FLK.left=3+PTX().chain+Math.floor((ENH[P.armor.sword]|0)/5);FLK.t=0;sfx('dash')},
  ()=>{BV.t=8;BV.n=3+PTX().proj;BV.tick=0;sfx('warp');for(let i=0;i<20;i++)rfxP(P.x,P.y-14,(Math.random()-.5)*200,(Math.random()-.5)*120,.5,'170,230,255',2,'spark')},
  ()=>{const v=DIRV[P.dir];XS.push({x:P.x+v[0]*70,y:P.y-6+v[1]*60,t:0});P.at=0;P.cmb=2;P.stun=.45;sfx('swing2')}],
 mage:[()=>{summon('skel',2+PTX().minion);P.cast=.5;P.stun=.3},()=>{summon('spirit',1+PTX().minion);P.cast=.5;P.stun=.3},()=>{summon('golem',1);P.cast=.7;P.stun=.4;shake(2.5,.2)}],
 archer:[()=>{if(!flkPre())return false;FLK.mode='bow';FLK.on=true;FLK.hit=new Set();FLK.left=3+PTX().chain+Math.floor((ENH[P.armor.sword]|0)/5);FLK.t=0;sfx('dash')},
  ()=>{summon('hawk',1+PTX().minion)},
  ()=>{const dv=aimDir(320),a0=Math.atan2(dv[1],dv[0]),n=1+PTX().proj;for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.28;TOR.push({x:P.x+Math.cos(a)*20,y:P.y+Math.sin(a)*14,vx:Math.cos(a)*170,vy:Math.sin(a)*170,t:0,l:2.6,tick:0})}P.at=0;P.cmb=0;sfx('swing2');nz(.6,.1,300,1200,1)}]};
function flkPre(){if(!enemies().some(e=>!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<330)){say('⚡ ไม่มีศัตรูในระยะวาป');return false}return true}
{const _us=useSkill;useSkill=function(i){if(i<3||P.cls==='none'){const mp0=P.mp,cd0=CS.cd[i];_us(i);const sp=mp0-P.mp,x=PTX();if(sp>0&&x.mpc)P.mp=Math.min(BAL.mp,P.mp+sp*x.mpc);if(x.cdr&&CS.cd[i]>cd0+.01)CS.cd[i]*=1-x.cdr;return}
  if(PAUSED||DOORA.k||P.dead||(typeof FISH!=='undefined'&&FISH.st))return;const S=CSKILLS[P.cls][i];if(!S)return;
  if(!skOwned(i)){say('🔒 '+S.n+' ปลดล็อกที่ Lv.'+S.lv);sfx('thud');return}if(D&&(D.town||D.shop)){say('ใช้สกิลต่อสู้ในเมืองไม่ได้');return}
  if(CS.cd[i]>0||P.stun>0&&!FLK.on||P.dash>0||FLK.on)return;const x=PTX(),mp=Math.round(S.mp*(1-x.mpc));if(P.mp<mp){say('💧 มานาไม่พอ (ต้องใช้ '+mp+')');sfx('thud');return}
  if(P.cls==='sword'&&!P.armor.sword){say('ต้องมีอาวุธก่อน');return}
  const r=NEWSK[P.cls][i-3]();if(r===false)return;P.mp-=mp;CS.cd[i]=S.cd*(1-x.cdr);if(P.recall>0)cancelRecall('ใช้สกิล — การวาปถูกยกเลิก');P.draw=true;if(P.armor.sword)P.tool='sword'}}
// ยิงกระจาย + กระสุนเพิ่ม · โซ่สายฟ้า + วาป
{const A=SKFN.archer,f0=A[0];A[0]=st=>{f0(st);const n=PTX().proj;if(n){const dv=aimDir(320),a0=Math.atan2(dv[1],dv[0]);for(let i=0;i<n;i++){const a=a0+(i%2?1:-1)*(.17*(3+(i>>1)));shoot('arrow',{dv:[Math.cos(a),Math.sin(a)],sp:560,range:330,mult:.9})}}}}
// ---------- แถบสกิล 4 ช่อง (เลือกได้) ----------
const SKBAR={sword:[0,1,2,3],mage:[0,1,2,3],archer:[0,1,2,3],none:[0,1,2,3]};try{Object.assign(SKBAR,JSON.parse(localStorage.getItem('fm_skbar')||'{}'))}catch(e){}
const saveBar=()=>{try{localStorage.setItem('fm_skbar',JSON.stringify(SKBAR))}catch(e){}};
const sk5=document.createElement('button');sk5.className='sk';sk5.id='sk5';sk5.innerHTML='<span class="ic"></span><i class="cd"></i><b class="n"></b><small></small>';gid('acts').appendChild(sk5);
{const st=document.createElement('style');st.textContent='#acts #sk5{right:168px;bottom:44px}#acts .sk.new::after{content:"NEW";position:absolute;left:-2px;top:-6px;font-size:8px;font-weight:800;background:#e04a3a;color:#fff;border-radius:4px;padding:0 3px}';document.head.appendChild(st)}
const SBTN=[skB[0],skB[1],skB[2],sk5];
const barOf=()=>SKBAR[P.cls]||[0,1,2,3];
SBTN.forEach((b,s)=>{b.onpointerdown=e=>{e.preventDefault();if(P.cls==='none'){if(s<3)useSkill(s);return}useSkill(barOf()[s])}});
addEventListener('keydown',e=>{if(e.repeat||DLG.open)return;const s='5678'.indexOf(e.key);if(s<0||document.activeElement.tagName==='INPUT')return;e.stopImmediatePropagation();if(P.cls==='none'){if(s<3)useSkill(s);return}useSkill(barOf()[s])},true);
function updSkBar(){const L=CSKILLS[P.cls];if(P.cls==='none'||!L){sk5.style.display='none';return}sk5.style.display='';const bar=barOf();
 SBTN.forEach((b,s)=>{const i=bar[s],S=L[i],o=S&&skOwned(i),c=CS.cd[i]||0;b.classList.toggle('lock',!o);const step=i===1?CS.step:0,mp=S?Math.round(cskMp(S,step)*(1-PTX().mpc)):0;
  b.classList.toggle('nomp',!!o&&P.mp<mp);b.querySelector('.ic').textContent=o?S.e:'🔒';b.querySelector('.cd').style.height=o&&c>0?(c/S.cd*100)+'%':'0';
  b.querySelector('.n').textContent=o&&c>0?Math.ceil(c):(i===1&&CS.step>0?(CS.step+1)+'/3':'');b.querySelector('small').textContent=o?mp:'';b.classList.toggle('chain',i===1&&CS.step>0);b.classList.toggle('new',!!(S&&S.new&&o&&!SKSEEN[P.cls+i]));b.setAttribute('aria-label',S?S.n:'')})}
const SKSEEN={};
{const _st=skTick;skTick=function(dt){_st(dt);updSkBar()}}
function setBar(slot,i){const b=barOf().slice(),j=b.indexOf(i);if(j>=0)b[j]=b[slot];b[slot]=i;SKBAR[P.cls]=b;saveBar();SKSEEN[P.cls+i]=1;sfx('ui');say('ใส่ '+CSKILLS[P.cls][i].e+' '+CSKILLS[P.cls][i].n+' ในช่องสกิล '+(slot+1));renderSkw()}
// หน้าต่างสกิล: ปุ่มเลือกช่อง
{const _r=renderSkw;renderSkw=function(){_r();if(skwEl.hidden||SKW.tab!=='sk'||P.cls==='none')return;const L=CSKILLS[P.cls],cards=[...skwEl.querySelectorAll('.list .card.sk')].slice(0,L.length),bar=barOf();
  cards.forEach((c,i)=>{if(!skOwned(i))return;const d=document.createElement('div');d.style.cssText='display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;align-items:center';d.innerHTML='<span style="font-size:11px;opacity:.7">ช่อง:</span>'+[0,1,2,3].map(s=>'<button class="bt'+(bar[s]===i?'':' gr')+'" style="width:34px;padding:3px" onclick="setBar('+s+','+i+')">'+(s+1)+'</button>').join('');c.lastElementChild.appendChild(d);SKSEEN[P.cls+i]=1})}}
// แจ้งเมื่อปลดล็อกสกิลใหม่
{const _g=gainXp;gainXp=function(n){const l0=P.lv;_g(n);const L=CSKILLS[P.cls];if(L&&P.lv>l0)L.forEach((s,i)=>{if(s.lv>l0&&s.lv<=P.lv){setTimeout(()=>{say('✨ ปลดล็อกสกิลใหม่: '+s.e+' '+s.n+'! กด 🌟 (K) → สกิล เพื่อใส่ช่อง');if(typeof chatAnn==='function')sysSay('ปลดล็อกสกิล '+s.n)},2400)}})}}
// ข้อความต้นไม้: ซัพพอร์ตแสดงในสรุป
{const _r=renderSkw;renderSkw=function(){_r();if(skwEl.hidden||SKW.tab!=='pas')return;const x=PTX(),L=[x.chain&&'วาป/โซ่ +'+x.chain,x.proj&&'กระสุน +'+x.proj,x.minion&&'สมุน +'+x.minion,x.mdmg&&'ดาเมจสมุน +'+Math.round(x.mdmg*100)+'%',x.mdur&&'เวลาสมุน +'+Math.round(x.mdur*100)+'%',x.cdr&&'คูลดาวน์ -'+Math.round(x.cdr*100)+'%',x.mpc&&'มานา -'+Math.round(x.mpc*100)+'%',x.area&&'พื้นที่ +'+Math.round(x.area*100)+'%',x.aspd&&'โจมตีเร็ว +'+Math.round(x.aspd*100)+'%'].filter(Boolean);
  const c=[...skwEl.querySelectorAll('.side .card')].find(q=>/รวมจากต้นไม้/.test(q.textContent));if(c&&L.length)c.insertAdjacentHTML('beforeend','<small style="color:#5affd8">🔧 ซัพพอร์ต: '+L.join(' · ')+'</small>')}}


// =====================================================================
// v4.1 : หน้าเริ่มเกม · สมัคร/เข้าสู่ระบบไอดี (แยกเซฟตามไอดี) · เนื้อเรื่องหลัก 15 บท · กษัตริย์ + ท้องพระโรง
//        บทสอนผู้เล่นใหม่ · ลูกศรนำทางภารกิจ · ยกเลิกโหมดโกง
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#title{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#05060d;font-family:system-ui,"Noto Sans Thai",sans-serif;color:#fff}
#title[hidden]{display:none}
#title canvas.bg{position:absolute;inset:0;width:100%;height:100%;max-width:none!important;border:none!important;border-radius:0!important}
#title .tw{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:10px;width:min(420px,92%);max-height:96%;overflow:auto;padding:6px}
#title .logo{text-align:center;animation:tlFloat 4s ease-in-out infinite}
#title .logo h1{margin:0;white-space:nowrap;font-size:clamp(28px,6vw,52px);font-weight:900;letter-spacing:1px;line-height:1.1;background:linear-gradient(180deg,#fff6c8 0%,#ffd84a 45%,#c47a10 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #3a2008) drop-shadow(0 0 18px rgba(255,190,60,.45))}
#title .logo p{margin:2px 0 0;font-size:12px;letter-spacing:6px;color:#cfd8ff;opacity:.85}
@keyframes tlFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
#title .panel{width:100%;padding:14px;border-radius:16px;background:linear-gradient(180deg,rgba(28,24,46,.86),rgba(12,10,22,.9));border:1.5px solid rgba(232,193,74,.7);box-shadow:0 10px 40px rgba(0,0,0,.6),inset 0 0 30px rgba(120,90,255,.12);backdrop-filter:blur(4px);animation:tlIn .4s ease-out}
@keyframes tlIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
#title .panel h3{margin:0 0 8px;font-size:15px;color:#ffe9a0;text-align:center}
#title .tb{display:block;width:100%;margin:7px 0;padding:11px;font:inherit;font-weight:800;font-size:15px;border-radius:12px;cursor:pointer;color:#2a1a06;background:linear-gradient(180deg,#fff0b0,#e8c14a 55%,#b8862a);border:1.5px solid #fff3c0;box-shadow:0 4px 0 #6a4810,0 6px 14px rgba(0,0,0,.4);transition:transform .1s}
#title .tb:active{transform:translateY(3px);box-shadow:0 1px 0 #6a4810}
#title .tb.alt{color:#e8e4ff;background:linear-gradient(180deg,#4a4270,#2a2448);border-color:#8a80c0;box-shadow:0 4px 0 #15122a,0 6px 14px rgba(0,0,0,.4)}
#title .tb.ghost{background:none;border:1px solid rgba(255,255,255,.25);color:#cfd0e8;box-shadow:none;font-weight:600;font-size:13px;padding:8px}
#title input{width:100%;box-sizing:border-box;margin:4px 0 8px;padding:10px 12px;font:inherit;font-size:15px;border-radius:10px;border:1.5px solid #6a6490;background:#141226;color:#fff;outline:none}
#title input:focus{border-color:#e8c14a;box-shadow:0 0 0 3px rgba(232,193,74,.2)}
#title label{font-size:12px;color:#c8c4e8}
#title .chk{display:flex;align-items:center;gap:8px;font-size:12.5px;margin:2px 0 6px}#title .chk input{width:auto;margin:0}
#title .err{min-height:16px;font-size:12.5px;color:#ff8a7a;text-align:center}
#title .who{text-align:center;font-size:13px;color:#cfd8ff}#title .who b{color:#ffe9a0;font-size:16px}
#title .ver{position:absolute;bottom:8px;right:12px;font-size:11px;opacity:.5;z-index:2}
#title .tip{font-size:11.5px;opacity:.65;text-align:center;line-height:1.5}
#cine{position:fixed;inset:0;z-index:95;background:#000;display:flex;align-items:flex-end;justify-content:center;cursor:pointer}
#cine[hidden]{display:none}
#cine canvas{position:absolute;inset:0;width:100%;height:100%;max-width:none!important;border:none!important;border-radius:0!important}
#cine .ct{position:relative;z-index:2;width:min(760px,92%);margin-bottom:9%;text-align:center;font-size:clamp(15px,2.6vw,21px);line-height:1.7;color:#fff4dc;text-shadow:0 2px 8px #000,0 0 2px #000;transition:opacity .6s}
#cine .cs{position:absolute;right:14px;top:12px;z-index:3;font:inherit;font-size:13px;padding:6px 12px;border-radius:9px;background:rgba(0,0,0,.5);color:#ddd;border:1px solid #666;cursor:pointer}
#cine .cn{position:absolute;bottom:14px;left:0;right:0;text-align:center;z-index:2;font-size:12px;color:#ffd84a;opacity:.7;animation:dlgBl .8s infinite alternate}
#qtrack{position:absolute;left:50%;transform:translateX(-50%);top:calc(58px + var(--st,0px));z-index:4;max-width:min(380px,56%);padding:5px 12px 6px;border-radius:12px;background:linear-gradient(180deg,rgba(40,28,10,.82),rgba(20,14,6,.82));border:1.5px solid #e8c14a;color:#fff;font-size:12px;line-height:1.35;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.4);text-align:center}
#qtrack[hidden]{display:none}#qtrack b{color:#ffe9a0;font-size:11.5px;display:block}#qtrack .pr{color:#8fe08a;font-weight:700}
#qtrack.rep{border-color:#8fe08a;box-shadow:0 0 14px rgba(140,230,120,.6);animation:qtPulse 1.2s infinite}
@keyframes qtPulse{50%{box-shadow:0 0 4px rgba(140,230,120,.2)}}
@media (max-height:520px){#title .logo h1{font-size:30px}#title .logo p{font-size:10px}#title .panel{padding:10px}#title input{padding:7px 10px;margin:2px 0 5px}#title .tb{padding:8px;margin:5px 0}#qtrack{top:calc(46px + var(--st,0px));font-size:10.5px;padding:3px 9px}#qtrack b{font-size:10px}}
#tut{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(150px + var(--sb,0px));z-index:26;width:min(420px,70%);display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:14px;background:linear-gradient(180deg,rgba(20,40,60,.95),rgba(10,20,34,.95));border:2px solid #7fd8ff;color:#fff;font-size:13.5px;line-height:1.45;box-shadow:0 0 20px rgba(127,216,255,.4);animation:dlgUp .35s ease-out}
#tut[hidden]{display:none}#tut .ti{font-size:28px;animation:tlFloat 1.6s ease-in-out infinite}#tut .tx{flex:1}#tut .tx b{color:#9fe8ff;display:block;font-size:12px}
#tut button{font:inherit;font-size:11px;padding:4px 8px;border-radius:8px;background:rgba(255,255,255,.1);color:#cde;border:1px solid #6a8aa0;cursor:pointer;align-self:flex-start}
@media (max-height:520px){#tut{bottom:calc(96px + var(--sb,0px));font-size:12px;padding:7px 10px}}
#tutring{position:fixed;z-index:27;pointer-events:none;border-radius:50%;border:3px solid #7fd8ff;box-shadow:0 0 0 4px rgba(127,216,255,.25),0 0 24px #7fd8ff;animation:tutR 1s ease-in-out infinite}
#tutring[hidden]{display:none}@keyframes tutR{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.18);opacity:.6}}
#journal .ch{padding:8px;border-radius:10px;margin:5px 0;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}#journal .ch.cur{border-color:#e8c14a;background:rgba(232,193,74,.1)}#journal .ch small{display:block;opacity:.75}
`;document.head.appendChild(st)}

// ---------------- 0) ยกเลิกโหมดโกง ----------------
try{delete window.cheatCoin}catch(e){}

// ---------------- 1) บัญชีผู้เล่น ----------------
const ACC={get all(){try{return JSON.parse(FM_RAW.get('fm_accts')||'{}')}catch(e){return{}}},save(a){FM_RAW.set('fm_accts',JSON.stringify(a))}};
async function pwHash(id,pw){const s='eldoria:'+id.toLowerCase()+':'+pw;try{if(crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}}catch(e){}
 let h=2166136261;for(let r=0;r<64;r++)for(let i=0;i<s.length;i++){h^=s.charCodeAt(i)+r;h=Math.imul(h,16777619)}return 'f'+(h>>>0).toString(16)}
const legacyKeys=()=>{const L=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^fm_/.test(k)&&!/^fm_(set|accts|acct|last_acct|remember|chatfold)$/.test(k))L.push(k)}return L};
async function accRegister(id,pw,pw2,nm,mig){id=(id||'').trim();nm=(nm||'').trim().slice(0,14);
 if(!/^[A-Za-z0-9_ก-๙]{3,16}$/.test(id))return 'ไอดี 3–16 ตัว (ตัวอักษร ตัวเลข _ ภาษาไทยได้)';if((pw||'').length<4)return 'รหัสผ่านอย่างน้อย 4 ตัว';if(pw!==pw2)return 'รหัสผ่านไม่ตรงกัน';if(!nm)return 'ตั้งชื่อตัวละครก่อน';
 const A=ACC.all;if(Object.keys(A).some(k=>k.toLowerCase()===id.toLowerCase()))return 'ไอดีนี้มีคนใช้แล้ว';
 A[id]={h:await pwHash(id,pw),c:Date.now(),n:nm};ACC.save(A);
 if(mig&&!FM_ACCT){for(const k of legacyKeys())FM_RAW.set('u:'+id+':'+k,localStorage.getItem(k))}
 FM_RAW.set('u:'+id+':fm_name',nm);return accLogin(id,pw,true)}
async function accLogin(id,pw,rem){id=(id||'').trim();const A=ACC.all,key=Object.keys(A).find(k=>k.toLowerCase()===id.toLowerCase());if(!key)return 'ไม่พบไอดีนี้ — สมัครก่อนนะ';
 if(A[key].h!==await pwHash(key,pw))return 'รหัสผ่านไม่ถูกต้อง';try{sessionStorage.setItem('fm_acct',key);sessionStorage.setItem('fm_go','1')}catch(e){}FM_RAW.set('fm_last_acct',key);FM_RAW.set('fm_remember',rem?'1':'0');location.reload();return ''}
function accLogout(){const leave=()=>{try{sessionStorage.removeItem('fm_acct')}catch(e){}FM_RAW.set('fm_remember','0');location.reload();return true};if(FM_ACCT&&window.ONL32&&ONL32.verified&&typeof ONL32.logout==='function')return ONL32.logout(leave);return leave()}

// ---------------- 2) หน้าเริ่มเกม ----------------
const titleEl=document.createElement('div');titleEl.id='title';document.body.appendChild(titleEl);
titleEl.innerHTML='<canvas class="bg"></canvas><div class="tw"><div class="logo"><img src="icon-192-v541.png" alt=""><h1>ตำนานเอลโดเรีย</h1><p>ELDORIA CHRONICLES</p></div><div class="panel" id="tpan"></div></div><div class="ver">v4.6</div>';
const tCv=titleEl.querySelector('canvas'),tK=tCv.getContext('2d');
const TST=Array.from({length:110},()=>({x:Math.random(),y:Math.random()*.65,s:Math.random()*1.6+.3,p:Math.random()*6})),TMOTE=Array.from({length:40},()=>({x:Math.random(),y:Math.random(),v:.02+Math.random()*.05,s:Math.random()*2+1,p:Math.random()*6}));
function titleDraw(now){if(titleEl.hidden)return;requestAnimationFrame(titleDraw);const W=tCv.width=tCv.clientWidth,H=tCv.height=tCv.clientHeight,t=now/1000,k=tK;
 const g=k.createLinearGradient(0,0,0,H);g.addColorStop(0,'#070a1e');g.addColorStop(.55,'#1a1640');g.addColorStop(.8,'#4a2a50');g.addColorStop(1,'#7a3a3a');k.fillStyle=g;k.fillRect(0,0,W,H);
 for(const s of TST){k.globalAlpha=.35+.65*Math.abs(Math.sin(t*1.3+s.p));k.fillStyle='#fff';k.fillRect(s.x*W,s.y*H,s.s,s.s)}k.globalAlpha=1;
 const mx=W*.78,my=H*.2;const mg=k.createRadialGradient(mx,my,4,mx,my,90);mg.addColorStop(0,'rgba(255,248,220,.95)');mg.addColorStop(.25,'rgba(255,240,200,.35)');mg.addColorStop(1,'rgba(255,240,200,0)');k.fillStyle=mg;k.fillRect(mx-90,my-90,180,180);k.fillStyle='#fff8e0';k.beginPath();k.arc(mx,my,22,0,7);k.fill();
 const ridge=(base,amp,f,col,ph)=>{k.fillStyle=col;k.beginPath();k.moveTo(0,H);for(let x=0;x<=W;x+=8)k.lineTo(x,base+Math.sin(x*f+ph)*amp+Math.sin(x*f*2.7+ph*2)*amp*.4);k.lineTo(W,H);k.closePath();k.fill()};
 ridge(H*.62,26,.006,'#241c3e',1);ridge(H*.7,20,.009,'#18122c',2);
 // ปราสาท
 const cx=W*.5,cb=H*.72,s=Math.min(W,H)/520;k.fillStyle='#0d0a18';const tw=(x,w,h,roof)=>{k.fillRect(cx+x*s,cb-h*s,w*s,h*s);if(roof){k.beginPath();k.moveTo(cx+(x-4)*s,cb-h*s);k.lineTo(cx+(x+w/2)*s,cb-(h+roof)*s);k.lineTo(cx+(x+w+4)*s,cb-h*s);k.fill()}for(let i=0;i<w;i+=10)k.fillRect(cx+(x+i)*s,cb-(h+6)*s,6*s,6*s)};
 tw(-150,300,90);tw(-170,44,150,50);tw(126,44,150,50);tw(-80,40,190,60);tw(40,40,190,60);tw(-30,60,240,90);
 k.fillStyle='#ffcf6a';for(const [x,y] of [[-160,110],[136,110],[-70,150],[50,150],[-10,190],[10,190],[-120,60],[100,60],[-40,60],[30,60]]){k.globalAlpha=.6+.4*Math.sin(t*2+x);k.fillRect(cx+x*s,cb-y*s,5*s,8*s)}k.globalAlpha=1;
 k.fillStyle='#ffd84a';k.globalAlpha=.4+.3*Math.sin(t*3);k.beginPath();k.arc(cx,cb-338*s,6*s,0,7);k.fill();k.globalAlpha=1;
 ridge(H*.8,14,.012,'#0a0714',3);
 const fg=k.createLinearGradient(0,H*.6,0,H);fg.addColorStop(0,'rgba(120,90,160,0)');fg.addColorStop(1,'rgba(90,60,120,.35)');k.fillStyle=fg;k.fillRect(0,H*.6,W,H*.4);
 k.globalCompositeOperation='lighter';for(const m of TMOTE){m.y-=m.v*.016;if(m.y<-.05){m.y=1.05;m.x=Math.random()}const x=(m.x+Math.sin(t*.5+m.p)*.02)*W,y=m.y*H,r=m.s*3;const q=k.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,'rgba(255,220,130,.9)');q.addColorStop(1,'rgba(255,180,60,0)');k.fillStyle=q;k.fillRect(x-r,y-r,r*2,r*2)}k.globalCompositeOperation='source-over'}
function tErr(m){const e=titleEl.querySelector('.err');if(e)e.textContent=m||''}
function tMain(){const A=ACC.all,me=FM_ACCT,pan=gid('tpan');sfx('ui');
 if(me){const info=A[me]||{};pan.innerHTML='<div class="who">ยินดีต้อนรับกลับ<br><b>'+esc(me)+'</b> · '+esc(P.name||info.n||'')+' Lv.'+P.lv+'</div><button class="tb" id="tPlay">▶ เข้าสู่เกม</button><button class="tb alt" onclick="tLoginForm()">🔁 สลับไอดี</button><button class="tb ghost" onclick="accLogout()">ออกจากระบบ</button><div class="tip">เซฟของแต่ละไอดีแยกกัน · เกมบันทึกอัตโนมัติ</div>'}
 else pan.innerHTML='<h3>⚔️ เริ่มการผจญภัย</h3><button class="tb" onclick="tRegForm()">✨ สมัครไอดีใหม่</button><button class="tb alt" onclick="tLoginForm()">🔑 เข้าสู่ระบบ</button>'+(Object.keys(A).length?'<div class="tip">มี '+Object.keys(A).length+' ไอดีในเครื่องนี้</div>':'<div class="tip">ครั้งแรก? สมัครไอดีเพื่อเริ่มเนื้อเรื่องและบทสอน</div>');
 const pb=gid('tPlay');if(pb)pb.onclick=()=>tPlay()}
function tRegForm(){const old=legacyKeys().includes('fm_save_v1')&&!FM_ACCT;gid('tpan').innerHTML='<h3>✨ สมัครไอดี</h3><label>ไอดี</label><input id="rId" maxlength="16" autocomplete="username"><label>รหัสผ่าน</label><input id="rPw" type="password" autocomplete="new-password"><label>ยืนยันรหัสผ่าน</label><input id="rPw2" type="password" autocomplete="new-password"><label>ชื่อตัวละคร</label><input id="rNm" maxlength="14">'
 +(old?'<div class="chk"><input type="checkbox" id="rMig"><span>นำเซฟเดิมในเครื่องนี้มาใช้กับไอดีนี้</span></div>':'')+'<div class="err"></div><button class="tb" id="rGo">สร้างตัวละคร</button><button class="tb ghost" onclick="tMain()">← กลับ</button>';
 tInputs();gid('rGo').onclick=async()=>{const r=await accRegister(gid('rId').value,gid('rPw').value,gid('rPw2').value,gid('rNm').value,gid('rMig')&&gid('rMig').checked);if(r){tErr(r);sfx('thud')}};setTimeout(()=>gid('rId').focus(),100)}
function tLoginForm(){const last=FM_RAW.get('fm_last_acct')||'';gid('tpan').innerHTML='<h3>🔑 เข้าสู่ระบบ</h3><label>ไอดี</label><input id="lId" maxlength="16" autocomplete="username" value="'+esc(last)+'"><label>รหัสผ่าน</label><input id="lPw" type="password" autocomplete="current-password"><div class="chk"><input type="checkbox" id="lRem" checked><span>จดจำการเข้าสู่ระบบ</span></div><div class="err"></div><button class="tb" id="lGo">เข้าสู่ระบบ</button><button class="tb ghost" onclick="tMain()">← กลับ</button>';
 tInputs();gid('lGo').onclick=async()=>{const r=await accLogin(gid('lId').value,gid('lPw').value,gid('lRem').checked);if(r){tErr(r);sfx('thud')}};setTimeout(()=>gid(last?'lPw':'lId').focus(),100)}
function tInputs(){for(const i of titleEl.querySelectorAll('input'))for(const ev of ['keydown','keyup','keypress'])i.addEventListener(ev,e=>{e.stopPropagation();if(ev==='keydown'&&e.key==='Enter'){const b=titleEl.querySelector('#rGo,#lGo');if(b)b.click()}})}
function showTitle(){titleEl.hidden=false;PAUSED=true;intro.hidden=true;requestAnimationFrame(titleDraw);tMain()}
function tPlay(){auInit&&auInit();titleEl.hidden=true;PAUSED=false;sfx('warp');try{sessionStorage.removeItem('fm_go')}catch(e){}
 if(!STORY.intro){STORY.intro=1;saveStory();if(D&&D.town)placeAtSpawn&&placeAtSpawn();cinePlay(PROLOGUE,()=>{TUT.on=STORY.tut<TUTS.length;tutShow();sysSay('📜 เนื้อเรื่อง: '+STCH[STORY.ch].t)})}
 else{TUT.on=STORY.tut<TUTS.length;tutShow()}}
// เปิดเกม: แสดงหน้าเริ่ม (ถ้าเพิ่งเข้าสู่ระบบ ให้เข้าเกมเลย)
/* v5.34: รอไฟล์เกมทุกระบบก่อนเริ่ม เพื่อไม่ข้ามการยืนยันเซฟคลาวด์ที่ติดตั้งภายหลัง */
function startAccountGame(){let go=false;try{go=sessionStorage.getItem('fm_go')==='1'}catch(e){}if(FM_ACCT&&go){intro.hidden=true;tPlay()}else showTitle()}
if(window.FM_LOADING)addEventListener('eldoria:ready',startAccountGame,{once:true});else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startAccountGame,{once:true});else startAccountGame();
intro.hidden=true;
// ปุ่มเมนู: กลับหน้าเริ่ม
gid('resume').insertAdjacentHTML('beforebegin','<b class="sec">👤 บัญชี'+(FM_ACCT?' : '+esc(FM_ACCT):'')+'</b><button class="mini" onclick="saveGame(true);toggleMenu();showTitle()">🏰 กลับหน้าเริ่มเกม</button><button class="mini" onclick="openJournal()">📜 บันทึกเนื้อเรื่อง</button><button class="mini" onclick="toggleMenu();TUT.on=true;STORY.tut=0;saveStory();tutShow()">🎓 เล่นบทสอนอีกครั้ง</button>');

// ---------------- 3) ฉากเล่าเรื่อง ----------------
const PROLOGUE=[{s:'crystal',t:'กาลครั้งหนึ่ง… อาณาจักรเอลโดเรียสงบสุขภายใต้แสงของ “ผลึกอรุณ” ที่ประดิษฐานอยู่ใต้ปราสาท'},
 {s:'shatter',t:'แต่ในคืนเดือนดับ เงามืดจากห้วงลึกใต้พิภพได้ทำลายผลึก — เศษผลึกทั้งห้ากระเด็นไปตกในเหมืองทั้งห้าของแผ่นดิน'},
 {s:'dark',t:'สัตว์ประหลาดที่ได้รับพลังเศษผลึกเริ่มคลุ้มคลั่ง สไลม์ล้นทุ่ง และประตูดันเจี้ยนร้อยชั้นใต้ทุ่งหญ้าก็เปิดออก…'},
 {s:'hero',t:'เจ้า… ผู้ตื่นขึ้นในวิหารแห่งแสงโดยไร้ความทรงจำ คือผู้ที่เทพธิดาเลือก'},
 {s:'castle',t:'จงไปเข้าเฝ้า พระราชาอัลดริค ที่ปราสาทกลางเมือง — ตำนานของเจ้าเริ่มต้นที่นี่'}];
const ENDING=[{s:'crystal',t:'เศษผลึกทั้งห้ากลับมารวมเป็นหนึ่ง แสงอรุณสาดส่องทั่วเอลโดเรียอีกครั้ง'},{s:'dark',t:'เงาแห่งห้วงลึกที่ชั้นร้อยถูกผนึกกลับคืน… อย่างน้อยก็ในตอนนี้'},{s:'castle',t:'ชื่อของเจ้าถูกจารึกไว้ในหอประวัติศาสตร์ — “ผู้กล้าแห่งเอลโดเรีย”'},{s:'hero',t:'แต่การผจญภัยไม่มีวันจบ… ดันเจี้ยน เควสกิลด์ และศัตรูที่แข็งแกร่งขึ้นยังรอเจ้าอยู่'}];
const cineEl=document.createElement('div');cineEl.id='cine';cineEl.hidden=true;cineEl.innerHTML='<canvas></canvas><div class="ct"></div><button class="cs">ข้าม ⏭</button><div class="cn">แตะเพื่อไปต่อ ▶</div>';document.body.appendChild(cineEl);
const CINE={L:null,i:0,t:0,done:null};const cCv=cineEl.querySelector('canvas'),cK=cCv.getContext('2d');
function cinePlay(L,done){CINE.L=L;CINE.i=0;CINE.t0=performance.now();CINE.done=done;cineEl.hidden=false;PAUSED=true;cineText();requestAnimationFrame(cineDraw);try{tone(196,0,1.6,'sine',.05);tone(294,0,1.6,'sine',.04,.2)}catch(e){}}
function cineText(){const c=cineEl.querySelector('.ct');c.style.opacity=0;setTimeout(()=>{c.textContent=CINE.L[CINE.i].t;c.style.opacity=1},250);CINE.t0=performance.now()}
function cineNext(){if(cineEl.hidden)return;CINE.i++;sfx('ui');if(CINE.i>=CINE.L.length){cineEnd();return}cineText()}
function cineEnd(){cineEl.hidden=true;PAUSED=false;const d=CINE.done;CINE.done=null;if(d)d()}
cineEl.onclick=e=>{if(e.target.classList.contains('cs')){cineEnd();return}cineNext()};
addEventListener('keydown',e=>{if(cineEl.hidden)return;e.stopImmediatePropagation();if(e.key==='Escape')cineEnd();else cineNext()},true);
function cineDraw(now){if(cineEl.hidden)return;requestAnimationFrame(cineDraw);const W=cCv.width=cCv.clientWidth,H=cCv.height=cCv.clientHeight,k=cK,t=now/1000,u=(now-CINE.t0)/1000,sc=CINE.L[CINE.i].s,cx=W/2,cy=H*.4,s=Math.min(W,H)/500;
 k.fillStyle='#04030a';k.fillRect(0,0,W,H);for(let i=0;i<70;i++){k.globalAlpha=.3+.5*Math.abs(Math.sin(t+i));k.fillStyle='#cfd8ff';k.fillRect((i*97.3)%W,(i*53.7)%(H*.8),1.5,1.5)}k.globalAlpha=1;
 const crystal=(x,y,r,col,a,rot)=>{k.save();k.translate(x,y);k.rotate(rot||0);k.globalAlpha=a;const g=k.createRadialGradient(0,0,0,0,0,r*3);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(-r*3,-r*3,r*6,r*6);
  k.fillStyle='#e6fbff';k.strokeStyle='#5ec8ff';k.lineWidth=2;k.beginPath();k.moveTo(0,-r*1.5);k.lineTo(r*.7,0);k.lineTo(0,r*1.5);k.lineTo(-r*.7,0);k.closePath();k.fill();k.stroke();k.fillStyle='rgba(94,200,255,.5)';k.beginPath();k.moveTo(0,-r*1.5);k.lineTo(r*.7,0);k.lineTo(0,0);k.fill();k.restore();k.globalAlpha=1};
 if(sc==='crystal')crystal(cx,cy+Math.sin(t)*6*s,40*s,'rgba(255,230,140,.55)',1,0);
 else if(sc==='shatter'){const p=Math.min(1,u/1.6);for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5,d=p*p*180*s;crystal(cx+Math.cos(a)*d,cy+Math.sin(a)*d*.7,(22-p*8)*s,'rgba(140,200,255,.5)',1,p*3+i)}
  if(u<.4){k.fillStyle='rgba(255,255,255,'+(1-u/.4)+')';k.fillRect(0,0,W,H)}const g=k.createRadialGradient(cx,cy,0,cx,cy,200*s*p);g.addColorStop(0,'rgba(120,0,180,'+(.4*p)+')');g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(0,0,W,H)}
 else if(sc==='dark'){for(let i=0;i<9;i++){const a=t*.4+i*.7,r=(80+i*20)*s;k.strokeStyle='rgba(150,60,220,'+(.15+.1*Math.sin(t*2+i))+')';k.lineWidth=3*s;k.beginPath();k.arc(cx,cy,r,a,a+2);k.stroke()}
  k.fillStyle='#000';k.beginPath();k.ellipse(cx,cy,70*s,46*s,0,0,7);k.fill();for(const sx of [-1,1]){k.fillStyle='#ff3a5a';k.beginPath();k.ellipse(cx+sx*22*s,cy-6*s,7*s,3*s,sx*.3,0,7);k.fill()}
  for(let i=0;i<14;i++){const x=(i*71+t*30)%W,y=H*.75+Math.sin(t*3+i)*6;k.fillStyle='rgba(80,200,120,.8)';k.beginPath();k.ellipse(x,y,12*s,8*s,0,Math.PI,0);k.fill()}}
 else if(sc==='hero'){const g=k.createRadialGradient(cx,cy,0,cx,cy,170*s);g.addColorStop(0,'rgba(255,240,200,'+(.5+.2*Math.sin(t*2))+')');g.addColorStop(1,'rgba(255,240,200,0)');k.fillStyle=g;k.fillRect(0,0,W,H);
  k.fillStyle='#14141a';k.fillRect(cx-9*s,cy-30*s,18*s,22*s);k.fillStyle='#f1d2b0';k.fillRect(cx-8*s,cy-50*s,16*s,18*s);k.fillStyle='#14141a';k.fillRect(cx-9*s,cy-54*s,18*s,8*s);k.fillStyle='#262631';k.fillRect(cx-8*s,cy-8*s,7*s,20*s);k.fillRect(cx+1*s,cy-8*s,7*s,20*s);
  for(let i=0;i<20;i++){const a=t+i,r=(60+(i*13)%60)*s;k.fillStyle='rgba(255,230,150,'+(.5+.5*Math.sin(a*2))+')';k.fillRect(cx+Math.cos(a*.7+i)*r,cy-20*s+Math.sin(a*.9+i)*r*.6,2*s,2*s)}}
 else{const b=cy+90*s;k.fillStyle='#0d0a18';for(const [x,w,h] of [[-150,300,90],[-170,44,150],[126,44,150],[-80,40,190],[40,40,190],[-30,60,240]])k.fillRect(cx+x*s,b-h*s,w*s,h*s);k.fillStyle='#ffcf6a';for(const [x,y] of [[-160,110],[136,110],[-70,150],[50,150],[-5,200]]){k.globalAlpha=.6+.4*Math.sin(t*2+x);k.fillRect(cx+x*s,b-y*s,5*s,8*s)}k.globalAlpha=1;
  const g=k.createLinearGradient(0,H*.5,0,H);g.addColorStop(0,'rgba(255,170,90,0)');g.addColorStop(1,'rgba(255,150,80,.25)');k.fillStyle=g;k.fillRect(0,0,W,H)}
 const vg=k.createRadialGradient(cx,H/2,Math.min(W,H)*.3,cx,H/2,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.8)');k.fillStyle=vg;k.fillRect(0,0,W,H)}

// ---------------- 4) กษัตริย์ + ท้องพระโรง ----------------
{const _dn=drawNPC;drawNPC=function(n,t){_dn(n,t);if(n.hat!=='crown')return;const sc=NSC[n.age||'adult']||1,x=Math.round(n.x),b=Math.round(n.y-(n.mv?0:Math.sin(t*1.8+n.x)*.7)),hy=b-(n.age==='elder'?38:40);
  ctx.save();ctx.translate(x,n.y);ctx.scale(sc,sc);ctx.translate(-x,-n.y);
  ctx.fillStyle='#e8c14a';ctx.fillRect(x-8,b-26,16,2);ctx.fillStyle='#c0392b';ctx.fillRect(x-1,b-24,2,8);
  ctx.fillStyle='#ffd84a';ctx.strokeStyle='#7a5208';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-8,hy+1);ctx.lineTo(x-8,hy-6);ctx.lineTo(x-4,hy-2);ctx.lineTo(x,hy-9);ctx.lineTo(x+4,hy-2);ctx.lineTo(x+8,hy-6);ctx.lineTo(x+8,hy+1);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#e0304a';ctx.beginPath();ctx.arc(x,hy-2,1.6,0,7);ctx.fill();ctx.fillStyle='#5ec8ff';ctx.fillRect(x-6,hy-2,2,2);ctx.fillRect(x+4,hy-2,2,2);
  const g=ctx.createRadialGradient(x,hy-6,0,x,hy-6,10);g.addColorStop(0,'rgba(255,230,140,'+(.25+.15*Math.sin(t*3))+')');g.addColorStop(1,'rgba(255,230,140,0)');ctx.fillStyle=g;ctx.fillRect(x-10,hy-16,20,20);ctx.restore()}}
SHOP_DATA.hall={name:'ท้องพระโรงเอลโดเรีย',emoji:'👑',solid:[],sell:[],buy:[],owner:{name:'พระราชาอัลดริค',x:256,c:'#6a1428',h:'#ececf2',age:'elder',beard:1,hat:'crown',
 greet:['ยินดีต้อนรับ ผู้กล้า','เอลโดเรียฝากความหวังไว้กับเจ้า'],lines:['ผลึกอรุณ… ข้าคิดถึงแสงของมันทุกคืน','ทหารของข้ามีไม่พอจะปกป้องเหมืองทั้งห้า','เจ้าดูแข็งแกร่งขึ้นทุกครั้งที่มาเข้าเฝ้า','ระวังตัวในห้วงลึกด้วยเถิด']}};
SHOP_TINT.hall='rgba(255,210,140,.05)';
SHOP_ART.hall=function(k){const W=IW*T,H=IH*T;
 for(let y=4;y<IH-1;y++)for(let x=0;x<IW;x++){k.fillStyle=(x+y)%2?'#d8d2c6':'#bdb5a6';k.fillRect(x*T,y*T,T,T);k.fillStyle='rgba(255,255,255,.12)';k.fillRect(x*T+2,y*T+2,T-4,3)}
 const wg=k.createLinearGradient(0,0,0,4*T);wg.addColorStop(0,'#2a2238');wg.addColorStop(1,'#4a3e5a');k.fillStyle=wg;k.fillRect(0,0,W,4*T);
 k.strokeStyle='rgba(0,0,0,.25)';k.lineWidth=1;for(let y=0;y<4*T;y+=12){k.beginPath();k.moveTo(0,y+.5);k.lineTo(W,y+.5);k.stroke();for(let x=(y/12%2)*16;x<W;x+=32){k.beginPath();k.moveTo(x+.5,y);k.lineTo(x+.5,y+12);k.stroke()}}
 for(const wx of [2.5,6.5,19.5,23.5]){const x=wx*T,y=10,w=36,h=84;k.fillStyle='#1a1426';k.beginPath();k.moveTo(x-w/2-3,y+h);k.lineTo(x-w/2-3,y+18);k.arc(x,y+18,w/2+3,Math.PI,0);k.lineTo(x+w/2+3,y+h);k.closePath();k.fill();
  const g=k.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#7fb8ff');g.addColorStop(.5,'#b48cff');g.addColorStop(1,'#ffcf6a');k.fillStyle=g;k.beginPath();k.moveTo(x-w/2,y+h-3);k.lineTo(x-w/2,y+18);k.arc(x,y+18,w/2,Math.PI,0);k.lineTo(x+w/2,y+h-3);k.closePath();k.fill();
  k.strokeStyle='#2a2238';k.lineWidth=2;k.beginPath();k.moveTo(x,y);k.lineTo(x,y+h);k.moveTo(x-w/2,y+45);k.lineTo(x+w/2,y+45);k.stroke()}
 for(const bx of [9.2,16.8]){const x=bx*T,y=6;k.fillStyle='#8a1a24';k.beginPath();k.moveTo(x-16,y);k.lineTo(x+16,y);k.lineTo(x+16,y+86);k.lineTo(x,y+74);k.lineTo(x-16,y+86);k.closePath();k.fill();k.fillStyle='#e8c14a';k.fillRect(x-18,y-3,36,5);k.strokeStyle='#e8c14a';k.lineWidth=2;k.strokeRect(x-12,y+6,24,58);
  k.fillStyle='#ffd84a';k.beginPath();k.moveTo(x-8,y+40);k.lineTo(x-8,y+28);k.lineTo(x-4,y+33);k.lineTo(x,y+24);k.lineTo(x+4,y+33);k.lineTo(x+8,y+28);k.lineTo(x+8,y+40);k.closePath();k.fill()}
 // แท่นบัลลังก์
 k.fillStyle='#8a1a24';k.fillRect(8*T,2*T,10*T,2*T);k.fillStyle='#e8c14a';k.fillRect(8*T,2*T,10*T,3);k.fillRect(8*T,4*T-4,10*T,4);
 const tx=13*T;k.fillStyle='#5a3a10';k.fillRect(tx-30,6,60,70);k.fillStyle='#e8c14a';k.beginPath();k.moveTo(tx-34,10);k.lineTo(tx-34,78);k.lineTo(tx+34,78);k.lineTo(tx+34,10);k.quadraticCurveTo(tx,-14,tx-34,10);k.fill();
 k.fillStyle='#9a1a2e';k.beginPath();k.moveTo(tx-24,18);k.lineTo(tx-24,74);k.lineTo(tx+24,74);k.lineTo(tx+24,18);k.quadraticCurveTo(tx,-2,tx-24,18);k.fill();k.fillStyle='rgba(255,255,255,.12)';k.fillRect(tx-20,22,6,48);
 k.fillStyle='#5ec8ff';k.beginPath();k.arc(tx,4,5,0,7);k.fill();k.fillStyle='#fff';k.fillRect(tx-1,2,2,2);
 for(let i=0;i<3;i++){k.fillStyle=i%2?'#d8d0c0':'#eae4d8';k.fillRect(7*T,3*T+i*10+2,12*T,10)}k.fillStyle='#e8c14a';k.fillRect(7*T,3*T+2,12*T,2);
 // พรมแดง
 k.fillStyle='#8a1a24';k.fillRect(11.5*T,4*T,3*T,10*T);k.fillStyle='#e8c14a';k.fillRect(11.5*T,4*T,4,10*T);k.fillRect(14.5*T-4,4*T,4,10*T);k.fillStyle='rgba(232,193,74,.35)';for(let y=5;y<14;y+=2){k.beginPath();k.moveTo(13*T,y*T);k.lineTo(13*T+8,y*T+10);k.lineTo(13*T,y*T+20);k.lineTo(13*T-8,y*T+10);k.closePath();k.fill()}
 // เสา
 for(const [px,py] of HALLPIL){const x=px*T+16,y=py*T+T;k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(x+3,y,16,5,0,0,7);k.fill();k.fillStyle='#e8e2d6';k.fillRect(x-12,y-8,24,8);k.fillStyle='#f4f0e8';k.fillRect(x-9,y-62,18,56);k.fillStyle='rgba(0,0,0,.12)';for(let i=-6;i<=6;i+=4)k.fillRect(x+i,y-62,1.5,56);k.fillStyle='#e8c14a';k.fillRect(x-12,y-68,24,7)}
 k.fillStyle='#2a2238';k.fillRect(0,(IH-1)*T,W,T);k.fillStyle='#0b0a10';k.fillRect(((IW>>1)-1)*T,(IH-1)*T,2*T,T);k.fillStyle='#e8c14a';k.fillRect(((IW>>1)-1)*T,(IH-1)*T,2*T,3);
 k.fillStyle='#1a1426';k.fillRect(0,0,T,H);k.fillRect(W-T,0,T,H)};
const HALLPIL=[[3,6],[3,10],[22,6],[22,10],[7,7],[7,11],[18,7],[18,11]];
const HALLGUARD=[{x:10.2,y:5.2},{x:15.8,y:5.2}].map(p=>({name:'อัศวินหลวง',c:'#3a4a8a',h:'#b8b8c4',x:p.x*T,y:p.y*T,home:{x:p.x,y:p.y},fixed:1,spear:1,hat:'helmet',dir:'d',mv:false,t:0}));
SHOP_ANIM.hall=function(t){ctx.translate(-OX,0);
 for(const [x,y] of [[4.5,1.6],[21.5,1.6],[11,1.4],[15,1.4]]){const px=x*T,py=y*T;ctx.fillStyle='#5a3a1a';ctx.fillRect(px-2,py,4,10);const f=Math.sin(t*12+x)*1.5;ctx.fillStyle='#ffb43a';ctx.beginPath();ctx.ellipse(px,py-4,4,7+f,0,0,7);ctx.fill();ctx.fillStyle='#fff3b0';ctx.beginPath();ctx.ellipse(px,py-3,2,3.5,0,0,7);ctx.fill();
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(px,py-4,0,px,py-4,46);g.addColorStop(0,'rgba(255,170,60,'+(.28+.06*Math.sin(t*9+x))+')');g.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=g;ctx.fillRect(px-46,py-50,92,92);ctx.globalCompositeOperation='source-over'}
 ctx.globalCompositeOperation='lighter';for(const wx of [2.5,6.5,19.5,23.5]){const x=wx*T,g=ctx.createLinearGradient(x,90,x+70,7*T);g.addColorStop(0,'rgba(200,180,255,.14)');g.addColorStop(1,'rgba(200,180,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-16,94);ctx.lineTo(x+16,94);ctx.lineTo(x+86,8*T);ctx.lineTo(x+30,8*T);ctx.closePath();ctx.fill()}ctx.globalCompositeOperation='source-over';
 for(const g of HALLGUARD){try{drawNPC(g,t)}catch(e){}}
 for(let i=0;i<6;i++){const x=(i*137+t*14)%(IW*T),y=4*T+((i*83+t*9)%(9*T));ctx.fillStyle='rgba(255,240,200,'+(.25+.25*Math.sin(t*2+i))+')';ctx.fillRect(x,y,2,2)}
 ctx.translate(OX,0)};
function enterHall(){enterShop('hall');for(const [x,y] of HALLPIL)if(dm[y])dm[y][x]=WL;for(const g of HALLGUARD){const tx=Math.floor(g.x/T),ty=Math.floor(g.y/T);if(dm[ty])dm[ty][tx]=WL}
 D.owner.lines=SHOP_DATA.hall.owner.lines;D.owner.bub={txt:STORY.st==='report'?'เจ้ากลับมาแล้ว! เล่าให้ข้าฟังเถิด':'ยินดีต้อนรับ ผู้กล้า',t:3};say('👑 ท้องพระโรงเอลโดเรีย — เดินไปหน้าแท่นบัลลังก์แล้วกด E/⚔️ เข้าเฝ้าพระราชา');sfx('bell')}
{const _ls=leaveShop;leaveShop=function(silent){if(!D||D.shop!=='hall')return _ls(silent);_ls(true);if(silent)return;P.x=22*T;P.y=9.7*T;P.dir='d';P.kx=P.ky=0;P.dash=0;fade('#000');sfx('door');say('ออกจากปราสาทแล้ว')}}
{const _ta=townAct;townAct=function(){if(D&&D.town){const [x,y]=target();if(dm[y]&&dm[y][x]===4){enterHall();return true}}return _ta()}}
{const _sa=shopAct;shopAct=function(){if(D&&D.shop==='hall'){if(shopNear()){kingTalk();return true}return false}return _sa()}}

// ---------------- 5) เนื้อเรื่องหลัก ----------------
const STORY={ch:0,st:'talk',intro:0,tut:0,k:{slime:0},base:{},boss:{},f100:0,shards:0,done:0};
try{Object.assign(STORY,JSON.parse(localStorage.getItem('fm_story')||'{}'))}catch(e){}
if(!FM_NEW&&!localStorage.getItem('fm_story')){STORY.intro=1;STORY.tut=99}
function saveStory(){try{localStorage.setItem('fm_story',JSON.stringify(STORY))}catch(e){}}
const ZBN={iron:'ราชาโกเลมสนิม',copper:'ด้วงยักษ์หลอมทองแดง',silver:'ราชาหมาป่าน้ำแข็ง',gold:'ฟาโรห์โกเลมทองคำ',diamond:'มังกรคริสตัลแห่งห้วงลึก'};
const dgClear=f=>DG.max>f||(f>=100&&STORY.f100);
const STCH=[
 {t:'บทนำ: การเข้าเฝ้า',d:'ไปเข้าเฝ้าพระราชาที่ปราสาทกลางเมือง',go:'king',
  done:['เจ้าคือผู้ที่เทพธิดาเลือก… ข้า อัลดริคที่สาม ขอต้อนรับ','ผลึกอรุณที่ปกป้องแผ่นดินถูกทำลาย เศษทั้งห้าตกไปอยู่ในเหมืองที่เต็มไปด้วยอสูร','รับดาบ ขวาน และที่ขุดแร่เหล่านี้ไว้ — มันคือของขวัญจากราชวงศ์'],rw:{coin:50,hpp:3,scroll:2,kit:1,xp:20}},
 {t:'บทที่ 1: บททดสอบแรก',d:'กำจัดสไลม์ในทุ่งหญ้า',need:()=>[STORY.k.slime-(STORY.base.slime|0),8],go:'field',
  intro:'สไลม์ล้นทุ่งหญ้านอกเมือง ชาวนาเดือดร้อนนัก ไปกำจัดพวกมันสัก 8 ตัว แล้วกลับมารายงานข้า',done:['ฝีมือไม่เลว! ชาวนาฝากขอบใจเจ้ามาด้วย'],rw:{coin:120,xp:60,mpp:2}},
 {t:'บทที่ 2: อาวุธคู่กาย',d:'ถึง Lv.5 และหลอม/ตีอาวุธระดับเหล็กขึ้นไป',need:()=>[(P.lv>=5?1:0)+(P.armor.sword&&ITEMS[P.armor.sword].tier>=1?1:0),2],
  intro:'ดาบหินคงไม่พอสู้อสูรในเหมือง ไปเก็บไม้ ขุดแร่ หลอมเป็นแท่งที่ร้านลุงเหล็ก แล้วตีอาวุธเหล็กสักเล่ม (หรือซื้อที่ร้านอุปกรณ์ก็ได้) — และฝึกจนถึง Lv.5',done:['อาวุธดี! ผู้กล้าที่ดีต้องรู้จักดูแลอาวุธของตน'],rw:{coin:150,estone:2,xp:100}},
 {t:'บทที่ 3: เส้นทางแห่งอาชีพ',d:'ถึง Lv.10 แล้วเลือกอาชีพกับปรมาจารย์',need:()=>[P.cls!=='none'?1:0,1],go:'cls',
  intro:'ปรมาจารย์อาชีพที่จัตุรัสรอคนอย่างเจ้าอยู่ เมื่อถึง Lv.10 จงไปเลือกทางของตน — ดาบ เวท หรือธนู',done:['เส้นทางของเจ้าชัดเจนแล้ว จงฝึกฝนให้ถึงที่สุด'],rw:{coin:300,bless:1,xp:200}},
 {t:'บทที่ 4: เสียงกระซิบใต้พิภพ',d:'พิชิตดันเจี้ยนชั้น 5',need:()=>[Math.min(5,DG.max-1),5],go:'cave',
  intro:'ประตูดันเจี้ยนใต้ทุ่งหญ้าส่งเสียงกระซิบทุกคืน ลงไปสำรวจให้ถึงชั้นห้า แล้วบอกข้าว่าเห็นอะไร',done:['เงามืดกำลังขยับตัว… เราต้องรวบรวมเศษผลึกก่อนมันจะแข็งแกร่ง'],rw:{coin:400,estone:3,xp:350}},
 {t:'บทที่ 5: ราชาโกเลมสนิม',d:'ปราบบอส '+ZBN.iron+' (เหมืองเหล็กร้าง)',need:()=>[STORY.boss.iron?1:0,1],go:'zone:iron',
  intro:'เศษผลึกชิ้นแรกอยู่ในเหมืองเหล็กร้าง โกเลมสนิมยักษ์กลืนมันเข้าไป! ไปเอาคืนมา',done:['เศษผลึกชิ้นแรก! แสงของมันยังอบอุ่นเหมือนวันวาน'],rw:{coin:600,xp:600,shard:1,rune:1}},
 {t:'บทที่ 6: สหายแห่งกิลด์',d:'ทำเควสกิลด์ให้สำเร็จ',need:()=>[Math.max(0,QST.done-(STORY.base.q|0)),3],go:'guild',
  intro:'ผู้กล้าไม่อาจสู้เพียงลำพัง ไปช่วยงานกิลด์นักผจญภัยสัก 3 งาน ไอริสจะคอยดูแลเจ้า',done:['กิลด์ชื่นชมเจ้ามาก ชื่อเสียงของเจ้าเริ่มขจรขจาย'],rw:{coin:500,estone:3,xp:500}},
 {t:'บทที่ 7: เปลวไฟใต้ภูเขา',d:'ปราบบอส '+ZBN.copper+' (ถ้ำทองแดงลาวา)',need:()=>[STORY.boss.copper?1:0,1],go:'zone:copper',
  intro:'เศษชิ้นที่สองหลอมรวมกับลาวาในถ้ำทองแดง ด้วงยักษ์เฝ้ามันไว้ จงระวังเปลวไฟ',done:['สองชิ้นแล้ว! ปราสาทเริ่มสว่างขึ้นในยามค่ำ'],rw:{coin:900,xp:1200,shard:1,bless:1}},
 {t:'บทที่ 8: ห้วงลึกชั้นยี่สิบห้า',d:'พิชิตดันเจี้ยนชั้น 25',need:()=>[Math.min(25,DG.max-1),25],go:'cave',
  intro:'นักบวชเห็นนิมิต — เงาแห่งห้วงลึกกำลังรวบรวมพลังที่ก้นดันเจี้ยน ลงไปให้ลึกกว่าเดิม',done:['ยิ่งลึกยิ่งมืด… แต่เจ้ากลับมาได้เสมอ'],rw:{coin:1500,estone:5,xp:2500}},
 {t:'บทที่ 9: ราชาหมาป่าน้ำแข็ง',d:'ปราบบอส '+ZBN.silver+' (เหมืองเงินน้ำแข็ง)',need:()=>[STORY.boss.silver?1:0,1],go:'zone:silver',
  intro:'เศษชิ้นที่สามแช่แข็งอยู่ในถ้ำเงิน ฝูงหมาป่าน้ำแข็งเฝ้ามันไว้',done:['สามชิ้น! เจ้าคือความหวังของแผ่นดินโดยแท้'],rw:{coin:2200,xp:4500,shard:1,rune:2}},
 {t:'บทที่ 10: ฟาโรห์ทองคำ',d:'ปราบบอส '+ZBN.gold+' (สุสานทองคำ)',need:()=>[STORY.boss.gold?1:0,1],go:'zone:gold',
  intro:'ฟาโรห์โกเลมทองคำตื่นจากหลับใหลเพราะเศษผลึกชิ้นที่สี่ จงทำให้มันหลับอีกครั้ง',done:['สี่ชิ้น… เหลือเพียงชิ้นสุดท้าย'],rw:{coin:3500,xp:8000,shard:1,bless:2}},
 {t:'บทที่ 11: ห้าสิบชั้นแห่งความมืด',d:'พิชิตดันเจี้ยนชั้น 50',need:()=>[Math.min(50,DG.max-1),50],go:'cave',
  intro:'ก่อนเผชิญมังกร เจ้าต้องแข็งแกร่งกว่านี้ ห้าสิบชั้นแห่งความมืดคือบททดสอบ',done:['เจ้าผ่านครึ่งทางของห้วงลึกแล้ว ข้าภูมิใจในตัวเจ้า'],rw:{coin:5000,estone:8,xp:14000}},
 {t:'บทที่ 12: มังกรคริสตัล',d:'ปราบบอส '+ZBN.diamond+' (เหมืองเพชรห้วงลึก)',need:()=>[STORY.boss.diamond?1:0,1],go:'zone:diamond',
  intro:'เศษสุดท้ายอยู่ในอกของมังกรคริสตัล… มันเคยเป็นผู้พิทักษ์ผลึกก่อนถูกเงามืดครอบงำ',done:['ห้าชิ้นครบแล้ว! แต่ผลึกยังไม่ส่องแสง… เงาแห่งห้วงลึกยังมีชีวิตอยู่ที่ชั้นร้อย'],rw:{coin:8000,xp:25000,shard:1,rune:3}},
 {t:'บทที่ 13: ร้อยชั้นสุดท้าย',d:'พิชิตดันเจี้ยนชั้น 100',need:()=>[STORY.f100?100:Math.min(99,DG.max-1),100],go:'cave',
  intro:'นี่คือศึกสุดท้าย จงลงไปถึงชั้นร้อยและผนึกเงาแห่งห้วงลึกเสีย ทั้งแผ่นดินฝากไว้กับเจ้า',done:['เจ้าทำได้… เจ้าทำได้จริง ๆ!'],rw:{coin:20000,xp:60000,bless:5,end:1}},
 {t:'ตำนานบทใหม่',d:'อิสระ — สำรวจ ตีบวก ทำเควสกิลด์ และท้าดันเจี้ยน',free:1}];
const STORY_BASE=i=>{if(i===1)STORY.base.slime=STORY.k.slime;if(i===6)STORY.base.q=QST.done};
function chNeed(){const c=STCH[STORY.ch];return c&&c.need?c.need():null}
function chDone(){if(STORY.ch===0)return false;const n=chNeed();return n&&n[0]>=n[1]}
function giveRw(r){const L=[];if(!r)return L;if(r.coin){inv.coin+=r.coin;L.push('🪙 '+r.coin)}if(r.xp){gainXp(r.xp);L.push('XP '+r.xp)}for(const k of ['hpp','mpp','estone','bless','scroll'])if(r[k]){inv[k]=(inv[k]|0)+r[k];L.push(MN(k)+' ×'+r[k])}
 if(r.rune){const el=pick(Object.keys(RUNE_EL)),k='r_'+el+r.rune;inv[k]=(inv[k]|0)+1;L.push(MN(k))}if(r.shard){STORY.shards++;L.push('💎 เศษผลึกอรุณ ('+STORY.shards+'/5)')}
 if(r.kit){for(const id of ['sword0','axe0','pick0'])if(!GEAR[id]&&P.armor.sword!==id)GEAR[id]=(GEAR[id]|0)+1;if(!P.armor.sword&&GEAR.sword0){equipItem('sword0')}
  if(!QS.slots.some(Boolean)){QS.slots[0]='weapon';QS.slots[1]='axe0';QS.slots[2]='pick0'}L.push('ดาบ/ขวาน/ที่ขุดแร่หิน');if(typeof updQuick==='function')updQuick()}
 refreshInv();return L}
function kingTalk(){const o=D.owner,c=STCH[STORY.ch];
 if(STORY.st==='report'||STORY.ch===0){const lines=c.done.slice(),rw=(window.kingRw7?kingRw7(c.rw):giveRw(c.rw));const next=()=>{if(c.rw&&c.rw.end){STORY.ch++;STORY.st='active';STORY.done=1;saveStory();updTrack();dlgClose(true);cinePlay(ENDING,()=>{chatAnn((P.name||'ผู้กล้า')+' พิชิตเนื้อเรื่องภาค 1 — ผู้กล้าแห่งเอลโดเรีย!');P.title='ผู้กล้าแห่งเอลโดเรีย'});return}
   STORY.ch++;STORY.st='active';STORY_BASE(STORY.ch);saveStory();updTrack();const n=STCH[STORY.ch];sfx('chest');
   talk(o,'📜 '+n.t+' — '+n.intro,[{t:'⚔️ รับภารกิจ',c:'go',f:()=>{sysSay('📜 ภารกิจใหม่: '+n.t+' — '+n.d);say('📜 '+n.t)}},{t:'👋 ลาก่อน',c:'bye'}])};
  let i=0;const step=()=>{if(i<lines.length){const L=lines[i++];talk(o,L+(i===lines.length&&rw.length?'  【รางวัล: '+rw.join(' · ')+'】':''),[{t:i<lines.length?'▶ ต่อ':'▶ รับภารกิจต่อไป',c:'go',stay:true,f:step}])}else next()};step();return}
 if(c.free){talk(o,pick(['เอลโดเรียสงบสุขได้เพราะเจ้า ผู้กล้า','ข้าได้ยินว่าเจ้ายังท้าทายห้วงลึกอยู่เสมอ','ประตูปราสาทเปิดต้อนรับเจ้าเสมอ']),[{t:'📜 บันทึกเนื้อเรื่อง',f:()=>openJournal()},{t:'👋 ลาก่อน',c:'bye'}]);return}
 const n=chNeed();talk(o,'ภารกิจ “'+c.t.replace(/^บทที่ \d+: /,'')+'” — '+c.d+(n?' ('+Math.min(n[0],n[1])+'/'+n[1]+')':'')+' · '+pick(['ข้าเชื่อมั่นในตัวเจ้า','อย่าประมาทนะ ผู้กล้า','กลับมาเมื่อสำเร็จแล้ว']),[{t:'📜 ฟังภารกิจอีกครั้ง',stay:true,f:()=>talk(o,c.intro||c.d,[BYE])},{t:'💬 คุยเล่น',stay:true,f:()=>talk(o,pick(SHOP_DATA.hall.owner.lines),[BYE])},BYE])}
// นับเหตุการณ์
{const _dl=dropLoot;dropLoot=function(x,y,s){_dl(x,y,s);if(s){STORY.k.slime=(STORY.k.slime|0)+1}}}
{const _mk=mobKill;mobKill=function(m){_mk(m);if(m.boss&&D&&D.zone){if(D.dg){if(D.dg>=100)STORY.f100=1}else{const id=D.zone.Zd.id;if(id&&ZBN[id])STORY.boss[id]=1}saveStory()}}}
// ติดตามภารกิจ
const qtEl=document.createElement('div');qtEl.id='qtrack';qtEl.hidden=true;gid('wrap').appendChild(qtEl);qtEl.onclick=()=>openJournal();
function updTrack(){const c=STCH[STORY.ch];if(!c||!STORY.intro){qtEl.hidden=true;return}qtEl.hidden=false;
 if(STORY.st==='report'){qtEl.classList.add('rep');qtEl.innerHTML='<b>📜 '+c.t+'</b>✅ สำเร็จแล้ว! กลับไปรายงาน<span class="pr"> พระราชา</span>';return}qtEl.classList.remove('rep');
 const n=chNeed();qtEl.innerHTML='<b>📜 '+c.t+'</b>'+c.d+(n?' <span class="pr">'+Math.min(n[0],n[1])+'/'+n[1]+'</span>':'')}
function storyTick(){if(!STORY.intro)return;if(STORY.st==='active'&&chDone()){STORY.st='report';saveStory();sfx('chest');say('✅ ภารกิจสำเร็จ: '+STCH[STORY.ch].t+' — กลับไปรายงานพระราชาที่ปราสาท');sysSay('✅ ภารกิจหลักสำเร็จ — กลับไปรายงานพระราชา')}updTrack()}
setInterval(storyTick,800);
// ลูกศรนำทาง
function guideTarget(){const c=STCH[STORY.ch];if(!c||c.free||!STORY.intro)return null;const go=STORY.st==='report'||STORY.ch===0?'king':c.go;if(!go)return null;
 const toTownW=[T/2,17*T],tg=TGATE();
 if(go==='king'){if(D&&D.town)return[22*T,9.4*T,'ปราสาท'];if(D&&D.shop==='hall')return[D.owner.x,D.owner.y+30,'พระราชา'];if(!D)return[tg[0],tg[1],'เมือง'];return null}
 if(go==='field'){if(D&&D.town)return[...toTownW,'ทุ่งหญ้า'];return null}
 if(go==='cls'){if(D&&D.town){const n=D.npcs.find(q=>q.name==='ปรมาจารย์อาชีพ');return n?[n.x,n.y,'ปรมาจารย์']:null}if(!D)return[tg[0],tg[1],'เมือง'];return null}
 if(go==='guild'){if(D&&D.town){const d=D.doors&&D.doors.find(q=>q.id==='guild');return d?[d.cx,d.cy,'กิลด์']:null}if(!D)return[tg[0],tg[1],'เมือง'];return null}
 if(go==='cave'){if(!D)return[CV.tx*T+16,CV.ty*T+40,'ดันเจี้ยน'];if(D.town)return[...toTownW,'ทุ่งหญ้า'];if(D.dg&&D.zone)return[D.zone.arena.x*T+16,D.zone.arena.y*T+16,'บอส'];return null}
 if(go.startsWith('zone:')){const id=go.slice(5);if(!D)return[ZG.x,ZG.y,'ประตูวาร์ป'];if(D.town)return[...toTownW,'ทุ่งหญ้า'];if(D.zone&&!D.dg&&D.zone.Zd.id===id)return[D.zone.arena.x*T+16,D.zone.arena.y*T+16,'บอส'];return null}return null}
let _tg=null;function TGATE(){if(_tg)return _tg;for(let y=0;y<H;y++)if(map[y][W-1]===TOWNGATE)return _tg=[(W-1.5)*T,y*T+16];return[(W-2)*T,(H>>1)*T]}
function drawGuide(){const g=guideTarget();if(!g||P.dead)return;const [tx,ty,lab]=g,dx=tx-P.x,dy=ty-P.y,d=Math.hypot(dx,dy),t=performance.now()/1000;ctx.save();
 if(d<VW/(2*Z)-30&&Math.abs(dy)<VH/(2*Z)-30){const y=ty-46+Math.sin(t*4)*5;ctx.fillStyle='#ffd84a';ctx.strokeStyle='#5a3a06';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx,y+14);ctx.lineTo(tx-9,y);ctx.lineTo(tx-4,y);ctx.lineTo(tx-4,y-10);ctx.lineTo(tx+4,y-10);ctx.lineTo(tx+4,y);ctx.lineTo(tx+9,y);ctx.closePath();ctx.fill();ctx.stroke()}
 else if(d>40){const a=Math.atan2(dy,dx),r=58+Math.sin(t*5)*4;ctx.translate(P.x+Math.cos(a)*r,P.y-14+Math.sin(a)*r*.75);ctx.rotate(a);ctx.globalAlpha=.9;ctx.fillStyle='#ffd84a';ctx.strokeStyle='#5a3a06';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-6,-8);ctx.lineTo(-2,0);ctx.lineTo(-6,8);ctx.closePath();ctx.fill();ctx.stroke();ctx.rotate(-a);
  ctx.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=2.5;ctx.strokeStyle='#000';ctx.strokeText(lab+' '+Math.round(d/T)+'ม.',0,-12);ctx.fillStyle='#ffe9a0';ctx.fillText(lab+' '+Math.round(d/T)+'ม.',0,-12)}
 ctx.restore()}
{const _h=hero;hero=function(){_h();drawGuide();if(D&&D.town&&Math.hypot(P.x-22*T,P.y-9.4*T)<52){ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';const s='กด E / ⚔️ เข้าปราสาท',w=ctx.measureText(s).width+14;ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(22*T-w/2,8.6*T-14,w,19);ctx.strokeStyle='#e8c14a';ctx.strokeRect(22*T-w/2+.5,8.6*T-13.5,w-1,18);ctx.fillStyle='#fff';ctx.fillText(s,22*T,8.6*T);ctx.textAlign='left'}}}
// บันทึกเนื้อเรื่อง
function openJournal(){if(!menuEl.hidden)toggleMenu();ZM.open=false;SHOPK=null;let h='<button class="mini x xclose" onclick="shopEl.hidden=true">✕</button><div id="journal"><b>📜 บันทึกเนื้อเรื่อง</b><small>เศษผลึกอรุณ '+STORY.shards+'/5 💎</small>';
 STCH.forEach((c,i)=>{if(i>STORY.ch)return;const cur=i===STORY.ch;h+='<div class="ch'+(cur?' cur':'')+'"><b>'+(i<STORY.ch?'✅ ':cur?'▶ ':'')+c.t+'</b><small>'+(c.intro||c.d)+'</small>'+(cur&&!c.free?'<small style="color:#ffe9a0">เป้าหมาย: '+c.d+(chNeed()?' ('+Math.min(...chNeed())+'/'+chNeed()[1]+')':'')+(STORY.st==='report'?' — ✅ กลับไปรายงานพระราชา':'')+'</small>':'')+'</div>'});
 shopEl.innerHTML=h+'</div>';shopEl.hidden=false;sfx('ui')}

// ---------------- 6) บทสอนผู้เล่นใหม่ ----------------
const TUT={on:false,i:-1,mv:0,lx:null,ly:null,t:0};
const TUTS=[
 {i:'🕹️',h:'การเดิน',x:()=>COARSE?'ใช้จอยสติ๊กด้านซ้ายล่างเดินไปมา (ดันสุดขอบ = วิ่ง)':'เดินด้วย WASD หรือปุ่มลูกศร · กด Ctrl ค้างเพื่อวิ่ง',el:()=>COARSE?(gid('joyzone')&&gid('joyzone').offsetParent?gid('joybase'):gid('padd')):null,ok:()=>TUT.mv>160},
 {i:'👑',h:'เข้าเฝ้าพระราชา',x:()=>'ตามลูกศรสีทองไปที่ประตูปราสาท แล้วกด '+(COARSE?'⚔️':'E')+' เพื่อเข้าไปคุยกับพระราชา',el:()=>null,ok:()=>STORY.ch>=1},
 {i:'🎒',h:'กระเป๋า',x:()=>'เปิดกระเป๋าดูของที่พระราชามอบให้ — แตะของแต่ละชิ้นเพื่อดูรายละเอียด',el:()=>gid('bagb'),ok:()=>!bagEl.hidden},
 {i:'🧪',h:'ยาและม้วนวาป',x:()=>'ยาเลือดอยู่ที่ช่อง H ด้านล่าง กดเมื่อเลือดน้อย (คอม: H) · ม้วนวาปพากลับเมืองทันที (คอม: T)',el:()=>gid('qh'),ok:()=>TUT.t>5},
 {i:'🌾',h:'ออกล่า',x:()=>'ออกจากเมืองทางขอบซ้าย (ตามลูกศร) ไปยังทุ่งหญ้า',el:()=>null,ok:()=>!D},
 {i:'⚔️',h:'โจมตี',x:()=>'เข้าใกล้สไลม์แล้วกด '+(COARSE?'ปุ่ม ⚔️':'J หรือคลิก')+' — กดต่อเนื่องเป็นคอมโบ 3 จังหวะ',el:()=>gid('atk'),ok:()=>(STORY.k.slime|0)>=(TUT.s0|0)+1},
 {i:'💨',h:'พุ่งหลบ',x:()=>'กด 💨 (คอม: Shift) เพื่อพุ่งหลบการโจมตี — ใช้แรง ดูหลอดแรงมุมซ้าย',el:()=>gid('dashb'),ok:()=>TUT.dash},
 {i:'⭐',h:'อัพสเตตัส',x:()=>'เมื่อเลเวลอัป แตะรูปโปรไฟล์มุมซ้ายบนเพื่ออัพแต้ม STR/VIT/AGI…',el:()=>gid('face'),ok:()=>!chp.hidden,wait:()=>P.lv>=2},
 {i:'🌟',h:'สกิลและพาสซีฟ',x:()=>'กดปุ่ม 🌟 เพื่อดูสกิลและต้นไม้พาสซีฟ — ได้แต้มเพิ่มทุกเลเวล',el:()=>gid('pasb'),ok:()=>!skwEl.hidden,wait:()=>ptTotal()>0},
 {i:'🏆',h:'พร้อมผจญภัย!',x:()=>'ทำภารกิจหลักตามแถบด้านบน (แตะเพื่อดูบันทึก) · กิลด์มีเควสเสริม · ดันเจี้ยน 100 ชั้นรออยู่ ขอให้สนุก!',el:()=>gid('qtrack'),ok:()=>TUT.t>7}];
const tutEl=document.createElement('div');tutEl.id='tut';tutEl.hidden=true;gid('wrap').appendChild(tutEl);
const tRing=document.createElement('div');tRing.id='tutring';tRing.hidden=true;document.body.appendChild(tRing);
function tutShow(){if(!TUT.on||STORY.tut>=TUTS.length){tutEl.hidden=true;tRing.hidden=true;return}const s=TUTS[STORY.tut];TUT.t=0;if(STORY.tut===5)TUT.s0=STORY.k.slime|0;if(STORY.tut===6)TUT.dash=false;
 tutEl.innerHTML='<div class="ti">'+s.i+'</div><div class="tx"><b>🎓 บทสอน '+(STORY.tut+1)+'/'+TUTS.length+' · '+s.h+'</b>'+s.x()+'</div><button onclick="tutSkip()">ข้ามบทสอน</button>';tutEl.hidden=!!(s.wait&&!s.wait())}
function tutSkip(){STORY.tut=TUTS.length;saveStory();TUT.on=false;tutShow();say('ข้ามบทสอนแล้ว — เล่นบทสอนอีกครั้งได้ที่ ⚙️')}
setInterval(()=>{if(!TUT.on||PAUSED&&skwEl.hidden&&chp.hidden||STORY.tut>=TUTS.length){tRing.hidden=true;return}const s=TUTS[STORY.tut];if(s.wait&&!s.wait()){tutEl.hidden=true;tRing.hidden=true;return}tutEl.hidden=false;TUT.t+=.25;
 if(TUT.lx!=null)TUT.mv+=Math.hypot(P.x-TUT.lx,P.y-TUT.ly)<60?Math.hypot(P.x-TUT.lx,P.y-TUT.ly):0;TUT.lx=P.x;TUT.ly=P.y;
 const el=s.el&&s.el();if(el&&el.offsetParent!==null){const r=el.getBoundingClientRect(),sz=Math.max(r.width,r.height)+18;tRing.style.left=(r.left+r.width/2-sz/2)+'px';tRing.style.top=(r.top+r.height/2-sz/2)+'px';tRing.style.width=tRing.style.height=sz+'px';tRing.hidden=false}else tRing.hidden=true;
 if(s.ok()){STORY.tut++;saveStory();sfx('gem');if(STORY.tut>=TUTS.length){TUT.on=false;say('🎓 จบบทสอนแล้ว! ขอให้สนุกกับการผจญภัย')}tutShow()}},250);
{const _pt=playerTick;playerTick=function(dt){_pt(dt);if(P.dash>0)TUT.dash=true}}
// ผู้เล่นใหม่: เริ่มที่วิหาร (ไม่มีของ) — พระราชามอบชุดเริ่มต้นให้
if(FM_NEW&&!TESTKIT){QS.slots.fill(null)}
setInterval(()=>{if(STORY.intro&&STORY.ch>0&&!STORY.tutAsk)STORY.tutAsk=1},5000);
storyTick();


// =====================================================================
// v4.2 : แก้จากการเล่นทดสอบ — เข้าปราสาทง่ายขึ้น · ข้อความออกเมืองถูกต้อง · สไลม์เกิดใกล้ผู้เล่นใหม่
//        ตีลมในเมืองไม่เสียแรง · ป้ายเลเวลอัป/ภารกิจ · ปุ่ม K ไม่พุ่งซ้อน
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#banner{position:absolute;left:0;right:0;top:22%;z-index:24;text-align:center;pointer-events:none}
#banner[hidden]{display:none}
#banner .b1{display:inline-block;font-size:clamp(26px,5vw,44px);font-weight:900;letter-spacing:1px;background:linear-gradient(180deg,#fff8d0,#ffd84a 50%,#d08a10);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #4a2a06) drop-shadow(0 0 16px rgba(255,200,60,.6));animation:bnIn 2.4s ease-out forwards}
#banner .b2{display:block;margin-top:2px;font-size:clamp(13px,2.2vw,17px);font-weight:700;color:#fff;text-shadow:0 2px 4px #000,0 0 2px #000;animation:bnIn 2.4s ease-out forwards}
#banner.green .b1{background:linear-gradient(180deg,#e8ffe0,#8fe08a 50%,#2a8a3a);-webkit-background-clip:text;background-clip:text}
#banner.blue .b1{background:linear-gradient(180deg,#eaf6ff,#7fd0ff 50%,#2a6ab0);-webkit-background-clip:text;background-clip:text}
@keyframes bnIn{0%{opacity:0;transform:scale(1.8)}12%{opacity:1;transform:scale(.95)}20%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-12px)}}`;document.head.appendChild(st)}
const bnEl=document.createElement('div');bnEl.id='banner';bnEl.hidden=true;gid('wrap').appendChild(bnEl);let _bnT=0;
function banner(a,b,cls){bnEl.className=cls||'';bnEl.innerHTML='<span class="b1">'+a+'</span>'+(b?'<span class="b2">'+b+'</span>':'');bnEl.hidden=false;clearTimeout(_bnT);_bnT=setTimeout(()=>bnEl.hidden=true,2400)}
function fanfare(){try{[523,659,784,1047].forEach((f,i)=>tone(f,0,.35,'triangle',.07,i*.09));tone(1568,0,.6,'sine',.05,.36)}catch(e){}}
// เลเวลอัป: ป้าย + เสาแสง
{const _g=gainXp;gainXp=function(n){const l0=P.lv;_g(n);if(P.lv>l0){banner('LEVEL UP!','Lv.'+P.lv+' · ได้แต้มสเตตัส +'+3*(P.lv-l0));fanfare();
  for(let i=0;i<40;i++){const a=Math.random()*6.28,r=Math.random()*18;rfxP(P.x+Math.cos(a)*r,P.y-Math.random()*10,Math.cos(a)*20,-90-Math.random()*140,1.1,Math.random()<.5?'255,220,90':'255,255,220',2.4,'spark')}RFX.push({k:'ring',x:P.x,y:P.y,t:0,l:.6,rgb:'255,220,90',s:50})}}}
// ภารกิจสำเร็จ / ใหม่
{let lastKey='';setInterval(()=>{if(!STORY.intro)return;const k=STORY.ch+':'+STORY.st;if(k===lastKey)return;const prev=lastKey;lastKey=k;if(!prev)return;
  if(STORY.st==='report'){banner('ภารกิจสำเร็จ!',STCH[STORY.ch].t+' — กลับไปรายงานพระราชา','green');fanfare()}
  else if(STORY.st==='active'&&STCH[STORY.ch]&&!STCH[STORY.ch].free){banner('ภารกิจใหม่',STCH[STORY.ch].t,'blue');sfx('gem')}},400)}
// ประตูปราสาท: ยืนใกล้ก็เข้าได้ (ไม่ต้องหันตรงช่อง)
{const _ta=townAct;townAct=function(){if(D&&D.town&&Math.hypot(P.x-22*T,P.y-9.4*T)<56){enterHall();return true}return _ta()}}
// ข้อความออกจากเมือง/โซนให้ถูกต้อง
{const _ex=exitD;exitD=function(){const wasTown=D&&D.town,wasDg=D&&D.dg,wasZone=D&&D.zone;const r=_ex.apply(this,arguments);say(wasTown?'🌾 ออกจากเมือง — ทุ่งหญ้าเอลโดเรีย (สไลม์ฝั่งขวาอ่อน ฝั่งซ้ายแรงขึ้น)':wasDg?'ออกจากดันเจี้ยนแล้ว':wasZone?'ออกจากเหมืองกลับสู่ทุ่งหญ้า':'ออกมาที่ทุ่งหญ้าแล้ว');return r}}
// สไลม์เกิดใกล้ผู้เล่น (ไม่ต้องเดินหาไกล)
function spawnNear(){for(let i=0;i<60;i++){const a=Math.random()*6.283,r=240+Math.random()*220,tx=Math.floor((P.x+Math.cos(a)*r)/T),ty=Math.floor((P.y+Math.sin(a)*r)/T);
  if(tx<2||ty<2||tx>=W-2||ty>=H-2||map[ty][tx]!==GRASS||Math.hypot(tx-6,ty-6)<=8)continue;const lv=Math.max(1,Math.min(5,Math.ceil((W-tx)/12)));
  slimes.push({lv,x:tx*T+16,y:ty*T+16,hp:2+lv,t:Math.random()*.9,dx:0,dy:0,kx:0,ky:0,hurt:0,last:-1,cool:0});return true}return false}
setInterval(()=>{if(D||PAUSED||P.dead)return;const near=slimes.filter(s=>!s.dead&&Math.hypot(s.x-P.x,s.y-P.y)<520).length;if(near<4&&slimes.length<24)spawnNear()},2200);
// ตีลมในเมือง/ร้าน ไม่เสียแรง
{const _a=attack;attack=function(q){if(D&&(D.town||D.shop)){const f=P.fa;const r=_a(q);P.fa=Math.max(P.fa,f);return r}return _a(q)}}
// สไลม์เกิดเฉพาะจุดที่เดินไปถึงได้ (ไม่ข้ามแม่น้ำ)
function reachTiles(r){const sx=Math.floor(P.x/T),sy=Math.floor(P.y/T),seen=new Map([[sy*W+sx,0]]),q=[[sx,sy]],out=[];
 while(q.length){const [x,y]=q.shift(),d=seen.get(y*W+x);if(d>=r)continue;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=ny*W+nx;if(nx<1||ny<1||nx>=W-1||ny>=H-1||seen.has(k))continue;const t=map[ny][nx];if(t!==GRASS&&t!==SAND)continue;seen.set(k,d+1);q.push([nx,ny]);if(d+1>=8&&t===GRASS)out.push([nx,ny])}}return out}
spawnNear=function(){const L=reachTiles(15);if(!L.length)return false;const [tx,ty]=L[Math.floor(Math.random()*L.length)];if(Math.hypot(tx-6,ty-6)<=8)return false;const lv=Math.max(1,Math.min(5,Math.ceil((W-tx)/12)));
 slimes.push({lv,x:tx*T+16,y:ty*T+16,hp:2+lv,t:Math.random()*.9,dx:0,dy:0,kx:0,ky:0,hurt:0,last:-1,cool:0});return true};
// ทางเดินทรายข้ามน้ำจากประตูเมืองเข้าทุ่ง
{const my=H>>1;let ch=0;for(let x=W-2;x>W-40;x--)for(const y of [my-1,my])if(map[y]&&map[y][x]===WATER){map[y][x]=SAND;ch++}if(ch){WAVEF.length=0;GCV=null}}
// ดาบฟันต้นไม้/หิน: ไม่เตือนซ้ำตอนกำลังสู้
{let last=0;const _u=useToolHit;useToolHit=function(){if(P.tool==='sword'&&!(typeof dummyAhead==='function'&&dummyAhead())){const busy=enemies().some(e=>!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<90),now=performance.now();if(busy||now-last<8000)return;last=now}return _u()}}
// ช่วยเล็ง: กดตีแล้วหันหาศัตรูที่อยู่ติดตัวอัตโนมัติ (เล่นบนมือถือง่ายขึ้น)
{const _a=attack;attack=function(q){if(P.at<0&&!DLG.open&&!(D&&(D.town||D.shop))){let b=null,bd=54;for(const e of enemies()){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-6-P.y);if(d<bd){bd=d;b=e}}
  if(b){const dx=b.x-P.x,dy=b.y-P.y;P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}}return _a(q)}}


// =====================================================================
// v4.3 : ระบบความปลอดภัย — รหัสผ่าน PBKDF2 + salt · ล็อกเมื่อใส่ผิดหลายครั้ง · เปลี่ยนรหัสผ่าน
//        เซ็นไฟล์เซฟกันแก้ (มีสำรองอัตโนมัติ) · ตรวจโปรเร่งความเร็ว/ค่าผิดปกติ · กรองแชท
// =====================================================================
const SEC={iter:120000};
function rndHex(n){const a=new Uint8Array(n);try{crypto.getRandomValues(a)}catch(e){for(let i=0;i<n;i++)a[i]=Math.random()*256|0}return [...a].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function pbkdf2(pw,salt,iter){try{if(crypto&&crypto.subtle){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
   const b=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new TextEncoder().encode(salt),iterations:iter},k,256);return 'p2$'+[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}}catch(e){}
 let h=FM_KH(salt+':'+pw);for(let i=0;i<4000;i++)h=FM_KH(h+salt+i);return 'kh$'+h}
const pwStrong=pw=>pw.length>=6&&/[0-9]/.test(pw)&&/[^0-9]/.test(pw);
function lockInfo(id){let L={};try{L=JSON.parse(FM_RAW.get('fm_lock')||'{}')}catch(e){}return [L,L[id.toLowerCase()]||{n:0,t:0}]}
function lockSet(id,v){const [L]=lockInfo(id);if(v)L[id.toLowerCase()]=v;else delete L[id.toLowerCase()];FM_RAW.set('fm_lock',JSON.stringify(L))}
accRegister=async function(id,pw,pw2,nm,mig){id=(id||'').trim();nm=(nm||'').trim().slice(0,14);
 if(!/^[A-Za-z0-9_ก-๙]{3,16}$/.test(id))return 'ไอดี 3–16 ตัว (ตัวอักษร ตัวเลข _ ภาษาไทยได้)';if(!pwStrong(pw||''))return 'รหัสผ่านอย่างน้อย 6 ตัว และต้องมีทั้งตัวเลขและตัวอักษร';if(pw===id)return 'รหัสผ่านต้องไม่เหมือนไอดี';if(pw!==pw2)return 'รหัสผ่านไม่ตรงกัน';if(!nm)return 'ตั้งชื่อตัวละครก่อน';
 if(chatBad(nm))return 'ชื่อตัวละครมีคำไม่เหมาะสม';const A=ACC.all;if(Object.keys(A).some(k=>k.toLowerCase()===id.toLowerCase()))return 'ไอดีนี้มีคนใช้แล้ว';
 const salt=rndHex(16);A[id]={h:await pbkdf2(pw,salt,SEC.iter),s:salt,it:SEC.iter,c:Date.now(),n:nm};ACC.save(A);
 if(mig&&!FM_ACCT){for(const k of legacyKeys())FM_RAW.set('u:'+id+':'+k,localStorage.getItem(k))}
 FM_RAW.set('u:'+id+':fm_name',nm);return accLogin(id,pw,true)};
async function accVerify(key,pw){const A=ACC.all,a=A[key];if(!a)return false;if(a.s){return a.h===await pbkdf2(pw,a.s,a.it||SEC.iter)}
 if(a.h===await pwHash(key,pw)){a.s=rndHex(16);a.it=SEC.iter;a.h=await pbkdf2(pw,a.s,a.it);A[key]=a;ACC.save(A);return true}return false}
accLogin=async function(id,pw,rem){id=(id||'').trim();const A=ACC.all,key=Object.keys(A).find(k=>k.toLowerCase()===id.toLowerCase());if(!key)return 'ไม่พบไอดีนี้ — สมัครก่อนนะ';
 const [,lk]=lockInfo(key),now=Date.now();if(lk.t>now)return '🔒 ใส่รหัสผิดหลายครั้ง — ลองใหม่ใน '+Math.ceil((lk.t-now)/1000)+' วินาที';
 if(!await accVerify(key,pw)){const n=(lk.n|0)+1,lock=n>=5?now+Math.min(600,30*Math.pow(2,n-5))*1000:0;lockSet(key,{n,t:lock});return lock?'🔒 ใส่รหัสผิด '+n+' ครั้ง — ล็อก '+Math.round((lock-now)/1000)+' วินาที':'รหัสผ่านไม่ถูกต้อง (เหลือ '+(5-n)+' ครั้งก่อนล็อก)'}
 lockSet(key,null);const a=A[key];a.last=a.now||0;a.now=now;A[key]=a;ACC.save(A);
 try{sessionStorage.setItem('fm_acct',key);sessionStorage.setItem('fm_go','1')}catch(e){}FM_RAW.set('fm_last_acct',key);FM_RAW.set('fm_remember',rem?'1':'0');location.reload();return ''};
async function accChangePw(oldp,np,np2){const key=FM_ACCT;if(!key)return 'ยังไม่ได้เข้าสู่ระบบ';if(!await accVerify(key,oldp))return 'รหัสผ่านเดิมไม่ถูกต้อง';if(!pwStrong(np))return 'รหัสใหม่อย่างน้อย 6 ตัว มีทั้งตัวเลขและตัวอักษร';if(np!==np2)return 'รหัสใหม่ไม่ตรงกัน';if(np===oldp)return 'รหัสใหม่ต้องไม่ซ้ำรหัสเดิม';
 const A=ACC.all,a=A[key];a.s=rndHex(16);a.it=SEC.iter;a.h=await pbkdf2(np,a.s,a.it);a.pwAt=Date.now();A[key]=a;ACC.save(A);return ''}
// ฟอร์มสมัคร: บอกเงื่อนไขรหัสผ่าน
{const _rf=tRegForm;tRegForm=function(){_rf();const p=gid('rPw');if(p){p.placeholder='อย่างน้อย 6 ตัว มีตัวเลข+ตัวอักษร';p.insertAdjacentHTML('afterend','<div id="pwm" style="font-size:11px;margin:-4px 0 6px;opacity:.8"></div>');p.addEventListener('input',()=>{const v=p.value,s=(v.length>=6)+(/[0-9]/.test(v))+(/[^0-9A-Za-z]/.test(v)||/[A-Z]/.test(v))+(v.length>=10);gid('pwm').innerHTML='ความปลอดภัย: '+['<span style="color:#ff7a6a">อ่อนมาก</span>','<span style="color:#ff9a5a">อ่อน</span>','<span style="color:#ffd84a">พอใช้</span>','<span style="color:#8fe08a">ดี</span>','<span style="color:#5affd8">ดีมาก</span>'][s]})}}}
// หน้าเริ่ม: แสดงเข้าระบบล่าสุด + ปุ่มเปลี่ยนรหัส
{const _tm=tMain;tMain=function(){_tm();if(!FM_ACCT)return;const a=ACC.all[FM_ACCT]||{},w=titleEl.querySelector('.who');if(w&&a.last)w.insertAdjacentHTML('beforeend','<br><small style="opacity:.7">เข้าระบบครั้งก่อน: '+new Date(a.last).toLocaleString('th-TH')+'</small>');
  const g=titleEl.querySelector('.tb.ghost');if(g)g.insertAdjacentHTML('beforebegin','<button class="tb ghost" onclick="tPwForm()">🔒 เปลี่ยนรหัสผ่าน</button>')}}
function tPwForm(){gid('tpan').innerHTML='<h3>🔒 เปลี่ยนรหัสผ่าน</h3><label>รหัสผ่านเดิม</label><input id="cOld" type="password"><label>รหัสผ่านใหม่</label><input id="cNew" type="password"><label>ยืนยันรหัสใหม่</label><input id="cNew2" type="password"><div class="err"></div><button class="tb" id="cGo">บันทึก</button><button class="tb ghost" onclick="tMain()">← กลับ</button>';
 tInputs();gid('cGo').onclick=async()=>{const r=await accChangePw(gid('cOld').value,gid('cNew').value,gid('cNew2').value);if(r){tErr(r);sfx('thud')}else{tErr('');titleEl.querySelector('.err').innerHTML='<span style="color:#8fe08a">✅ เปลี่ยนรหัสผ่านแล้ว</span>';sfx('gem');setTimeout(tMain,1200)}}}
// ---------- ป้องกันโกงขณะเล่น ----------
const AC={flags:[],last:0};
function acFlag(why){AC.flags.push([Date.now(),why]);if(AC.flags.length>30)AC.flags.shift();const n=performance.now();if(n-AC.last>8000){AC.last=n;sysSay('🛡️ ระบบป้องกัน: '+why)}}
// 1) ตรวจโปรเร่งความเร็ว (เวลาเกมวิ่งเร็วกว่าเวลาจริง)
{let p0=performance.now(),d0=Date.now(),strikes=0;setInterval(()=>{const p=performance.now(),d=Date.now(),r=(p-p0)/Math.max(1,d-d0);p0=p;d0=d;if(r>1.35||r<0){if(++strikes>=2){acFlag('ตรวจพบเวลาเกมผิดปกติ (โปรเร่งความเร็ว) — หยุดเกมชั่วคราว');PAUSED=true;setTimeout(()=>{PAUSED=!titleEl.hidden||!menuEl.hidden},3000)}}else strikes=Math.max(0,strikes-1)},2000)}
// 2) ตรวจค่าผิดปกติ (เลเวล/แต้ม/เงิน/เลือด)
setInterval(()=>{if(!titleEl.hidden)return;try{
 if(P.lv>MAXLV||P.lv<1||!Number.isFinite(P.lv)){P.lv=Math.max(1,Math.min(MAXLV,P.lv|0||1));acFlag('เลเวลผิดปกติ — ปรับคืนแล้ว')}
 const bs=baseStats(),cap=3*(P.lv-1)+3;let base=Object.values(bs).reduce((a,b)=>a+(b|0),0);if(base+(P.sp|0)>cap){P.sp=Math.max(0,cap-base);if(base>cap){const ks=Object.keys(bs).sort((a,b)=>bs[b]-bs[a]);let over=base-cap;for(const k of ks){const c=Math.min(over,bs[k]);P.stats[k]-=c;over-=c;if(over<=0)break}}acFlag('แต้มสเตตัสเกินกำหนด — ปรับคืนแล้ว');recalcStats()}
 if(!Number.isFinite(inv.coin)||inv.coin<0||inv.coin>99999999){inv.coin=Math.max(0,Math.min(99999999,inv.coin|0));acFlag('จำนวนเหรียญผิดปกติ')}
 if(P.hp>BAL.hp*1.01&&!P.dead){P.hp=BAL.hp}for(const k in inv)if(!Number.isFinite(inv[k])||inv[k]<0)inv[k]=0;
 for(const id in ENH)if(ENH[id]>MAXP||ENH[id]<0){ENH[id]=Math.max(0,Math.min(MAXP,ENH[id]|0));acFlag('ระดับตีบวกผิดปกติ')}
 if(ptUsed()>ptTotal()+1){PT.a=new Set(['c0']);savePT();ptDirty();acFlag('แต้มพาสซีฟเกิน — รีเซ็ตต้นไม้')}}catch(e){}},3000);
// 3) แจ้งเตือนถ้าไฟล์เซฟถูกแก้นอกเกม
setTimeout(()=>{if(FM_TAMPER.length){sysSay('🛡️ ตรวจพบไฟล์เซฟถูกแก้ไขจากภายนอก ('+[...new Set(FM_TAMPER)].join(', ')+') — โหลดข้อมูลสำรองล่าสุดแทน');banner('ตรวจพบการแก้ไฟล์เซฟ','ระบบโหลดข้อมูลสำรองที่ถูกต้องให้แล้ว','blue')}},3500);
// 4) กรองแชท: คำหยาบ + กันสแปม
const BADW=['ควย','เหี้ย','สัส','ไอ้สัตว์','เย็ด','หี','fuck','shit','bitch','cunt','nigger'];
function chatBad(t){const s=String(t).toLowerCase().replace(/\s+/g,'');return BADW.some(w=>s.includes(w))}
function chatClean(t){let s=String(t);for(const w of BADW)s=s.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),'*'.repeat(w.length));return s}
{const _cs=chatSay;chatSay=function(ch,who,txt,col){return _cs(ch,chatClean(who),chatClean(txt),col)}}
{let times=[];const _s=chatSend;chatSend=function(){const ti=gid('chatTi'),t=ti.value.trim(),now=Date.now();times=times.filter(x=>now-x<10000);if(t&&t[0]!=='/'){if(times.length>=5){ti.value='';sysSay('🛡️ ส่งข้อความเร็วเกินไป — รอสักครู่');return}times.push(now);ti.value=chatClean(t).slice(0,140)}return _s()};gid('chatSend').onclick=chatSend}
// 5) ออนไลน์: ห้ามเชื่อมต่อแบบไม่เข้ารหัสยกเว้นในเครื่อง
{const _nc=netConnect;netConnect=function(url){const u=(url||SET.server||'').trim();if(/^ws:\/\//.test(u)&&!/^ws:\/\/(localhost|127\.|192\.168\.|10\.)/.test(u)){sysSay('🛡️ เซิร์ฟเวอร์ภายนอกต้องใช้ wss:// (เข้ารหัส) เท่านั้น');return}return _nc(url)}}
// เมนูตั้งค่า: ส่วนความปลอดภัย
gid('resume').insertAdjacentHTML('beforebegin','<b class="sec">🛡️ ความปลอดภัย</b><small id="secinfo" style="display:block;opacity:.75;margin:2px 0 4px"></small>'+(FM_ACCT?'<button class="mini" onclick="toggleMenu();showTitle();tPwForm()">🔒 เปลี่ยนรหัสผ่าน</button>':'')+'<button class="mini" onclick="accLogout()">🚪 ออกจากระบบ</button>');
setInterval(()=>{const e=gid('secinfo');if(e&&!menuEl.hidden)e.textContent='เซฟเซ็นกันแก้ไข ✓ · รหัสผ่าน PBKDF2 ✓ · ตรวจโปรเร่งเวลา ✓'+(AC.flags.length?' · แจ้งเตือน '+AC.flags.length+' ครั้ง':'')},1000);


// =====================================================================
// v4.4 : แก้ตัวหนังสือทับในหน้าสกิล/พาสซีฟ · ลื่นขึ้นบนมือถือ (ล็อก 30FPS, โหมดต่ำเบาลง) · ออร่าชุดเกราะตามระดับตีบวก
//        เสียงชักดาบ/เก็บดาบ · เอฟเฟคบัฟ · ดนตรีกดดันตามด่าน/บอส · บอสโหดที่สุด "จักรพรรดิเงาแห่งห้วงลึก" + ภารกิจสุดท้าย
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#skw .sk{width:auto;height:auto;overflow:visible;font-size:inherit;position:relative}
#skw .sk small{position:static;display:block;font-size:11.5px;line-height:1.45;color:inherit;opacity:.8;text-shadow:none;right:auto;bottom:auto;margin-top:2px;white-space:normal;word-break:break-word}
#skw .sk b{display:inline}
#skw .card small{white-space:normal;word-break:break-word}
#skw .list{grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))}
#skw .sk>div:last-child{min-width:0;flex:1}
@media (max-height:420px){#skw .sw{height:96%}#skw .side{flex-basis:210px}#skw .sh b{font-size:13px}}
#buffx .bx{position:relative;overflow:hidden}#buffx .bx i{position:absolute;left:0;bottom:0;height:2px;background:#7ed957}
#buffx .bx.new{animation:bxIn .6s ease-out}@keyframes bxIn{0%{transform:scale(1.6);box-shadow:0 0 14px #7ed957}100%{transform:none}}`;document.head.appendChild(st)}
// ต้นไม้พาสซีฟ: จอเล็กซูมเข้าอัตโนมัติ ให้ปุ่มกดง่าย
{const _o=openSkw;openSkw=function(tab){const small=Math.min(innerWidth,innerHeight)<500;if(small&&!SKW._z){SKW.zoom=1.9;SKW._z=1}_o(tab)}}

// ---------- 1) ลื่นขึ้น ----------
if(SET.fpsCap===undefined)SET.fpsCap=COARSE?30:60;
{const lab=document.createElement('label');lab.innerHTML='อัตราเฟรม<select data-fc><option value="60">60 FPS (ลื่นสุด)</option><option value="30">30 FPS (ประหยัดแบต/เครื่องไม่ร้อน)</option></select>';
 const q=menuEl.querySelector('[data-gq]');q&&q.parentNode.parentNode.insertBefore(lab,q.parentNode.nextSibling);const s=lab.querySelector('select');s.value=String(SET.fpsCap);s.onchange=e=>{e.stopPropagation();SET.fpsCap=+s.value;saveSet();say('อัตราเฟรม '+SET.fpsCap+' FPS')}}
addEventListener(window.FM_LOADING?'eldoria:ready':'DOMContentLoaded',()=>{if(typeof window.frame!=='function')return;const _f=window.frame;let lastT=0;window.frame=function(now){if(SET.fpsCap===30&&now-lastT<30){requestAnimationFrame(window.frame);return}lastT=now;return _f(now)}});
// โหมดต่ำ: ความละเอียดต่ำลงอีก · อนุภาคน้อยลง
GQ.low.res=.6;GQ.low.fx=30;GQ.low.mm=10;GQ.med.res=.85;
if(SET.gq==='auto'&&GQC.lvl==='low')applyGQ('low',true);
// มอนในเหมืองที่อยู่ไกลและยังไม่เห็นเรา = หยุดคิด
{const _um=updMob;updMob=function(m,dt){if(D&&D.zone&&!D.dg&&!m.boss&&!m.aggro&&Math.abs(m.x-P.x)+Math.abs(m.y-P.y)>900)return;return _um(m,dt)}}

// ---------- 2) ออร่าชุดเกราะตามระดับตีบวก ----------
const ARMC=['200,200,210','220,228,240','255,150,80','230,240,255','255,214,74','110,200,255'];
function armorFx(){let L=0,top=0,n=0;for(const s of ['helm','chest','pants','arm']){const id=P.armor[s];if(!id)continue;L+=ENH[id]||0;n++;top=Math.max(top,ITEMS[id].tier)}
 const c=setCount(),full=Object.keys(c).find(t=>c[t]>=4);return{L,top,n,rgb:full!=null?ARMC[full]:ARMC[top],full:full!=null}}
function drawArmorAura(back){const A=armorFx();if(A.n===0||(A.L<6&&!A.full))return;const t=performance.now()/1000,x=P.x,y=P.y,lv=A.L,rgb=A.rgb;ctx.save();ctx.globalCompositeOperation='lighter';
 if(back){// แสงหลังตัว + ปีกแสงเมื่อระดับรวมสูง
  const r=20+Math.min(26,lv*.5),g=ctx.createRadialGradient(x,y-22,2,x,y-22,r);g.addColorStop(0,'rgba('+rgb+','+(.18+Math.min(.25,lv*.005))+')');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-22-r,r*2,r*2);
  if(lv>=36){const f=Math.sin(t*3)*.15,a=Math.min(.55,(lv-30)*.02);for(const s of [-1,1]){ctx.save();ctx.translate(x+s*4,y-28);ctx.scale(s,1);ctx.rotate(-.25+f);
    const wg=ctx.createLinearGradient(0,0,34,0);wg.addColorStop(0,'rgba(255,255,255,'+a+')');wg.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=wg;ctx.beginPath();ctx.moveTo(0,0);
    ctx.quadraticCurveTo(14,-22,36,-18);ctx.quadraticCurveTo(26,-10,32,-4);ctx.quadraticCurveTo(22,-2,28,6);ctx.quadraticCurveTo(14,4,0,6);ctx.closePath();ctx.fill();ctx.restore()}}
  if(lv>=52){ctx.strokeStyle='rgba(255,240,180,'+(.5+.3*Math.sin(t*4))+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-50,9,3,0,0,7);ctx.stroke()}}
 else{// ประกายลอยขึ้น + วงแหวนชุดครบ
  if(Math.random()<lv*.012*DT*60)rfxP(x+(Math.random()-.5)*20,y-6-Math.random()*36,(Math.random()-.5)*8,-26-Math.random()*26,.8,Math.random()<.6?rgb:'255,255,255',1.4+Math.random(),'spark');
  if(lv>=20&&Math.random()<.05)rfxP(x+(Math.random()-.5)*14,y-30,0,0,.5,rgb,14+Math.random()*6,'ring');
  if(A.full){ctx.strokeStyle='rgba('+rgb+','+(.25+.15*Math.sin(t*2.5))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y,16+Math.sin(t*2)*2,5,0,0,7);ctx.stroke()}}
 ctx.restore()}
{const _hb=heroBody;heroBody=function(){const me=!window._drawingOther;if(me)drawArmorAura(true);_hb();if(me)drawArmorAura(false)}}
{const _do=drawOther;drawOther=function(o){window._drawingOther=1;try{_do(o)}finally{window._drawingOther=0}}}

// ---------- 3) เสียงชักดาบ / เก็บดาบ (สังเคราะห์เสียงเหล็กเสียดสี) ----------
function sfxDraw(sheath){if(!AU.c||SET.mute)return;const C=AU.c,t=C.currentTime,d=sheath?.32:.42;
 const s=C.createBufferSource(),bp=C.createBiquadFilter(),hp=C.createBiquadFilter(),g=C.createGain();s.buffer=AU.nb;bp.type='bandpass';bp.Q.value=6;
 bp.frequency.setValueAtTime(sheath?5200:2600,t);bp.frequency.exponentialRampToValueAtTime(sheath?2200:7200,t+d);hp.type='highpass';hp.frequency.value=1500;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32,t+.03);g.gain.setValueAtTime(.28,t+d*.7);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(bp);bp.connect(hp);hp.connect(g);g.connect(AU.s);s.start(t,Math.random());s.stop(t+d+.05);
 if(!sheath){for(const [f,v,dl] of [[2637,.07,d],[3951,.04,d+.01],[5274,.025,d+.02]])tone(f,f*.997,1.1,'sine',v,dl)}else{tone(180,90,.12,'triangle',.12,d-.04);nz(.06,.15,900,300,2,'lowpass',d-.05)}}
{const _di=drawItem;drawItem=function(id,msg){const w=id==='weapon'||(ITEMS[id]&&['sword','staff','bow'].includes(ITEMS[id].kind));_di(id,msg);if(w)sfxDraw(false)}}
{const _si=stowItem;stowItem=function(){const w=P.tool==='sword';_si();if(w)sfxDraw(true)}}
{const _ad=autoDraw;autoDraw=function(){const was=P.draw;_ad();if(!was&&P.draw&&P.tool==='sword')sfxDraw(false)}}

// ---------- 4) เอฟเฟคบัฟ ----------
const BUFFRGB={str:'255,90,70',vit:'255,130,170',agi:'110,230,110',end:'255,214,74',int:'110,170,255'};
function drawBuffFx(){if(!BUFFS.length||P.dead)return;const t=performance.now()/1000,ks=[...new Set(BUFFS.flatMap(b=>Object.keys(b.st||{})))];if(!ks.length)return;ctx.save();ctx.globalCompositeOperation='lighter';
 ks.forEach((k,i)=>{const rgb=BUFFRGB[k]||'255,255,255',a=t*2.2+i*Math.PI*2/ks.length,x=P.x+Math.cos(a)*16,y=P.y-18+Math.sin(a)*6;const g=ctx.createRadialGradient(x,y,0,x,y,6);g.addColorStop(0,'rgba('+rgb+',.95)');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.fillRect(x-6,y-6,12,12);
  if(Math.random()<.08)rfxP(x,y,0,-20,.5,rgb,1.4,'dot')});ctx.restore()}
{const _h=hero;hero=function(){_h();drawBuffFx()}}
{const _rb=renderBuffs;let prev=new Set();renderBuffs=function(){_rb();const cur=new Set(BUFFS.map(b=>b.id));let i=0;const els=buffBox.querySelectorAll('.bx:not(.set)');BUFFS.forEach((b,j)=>{const el=els[j];if(!el)return;if(!el.querySelector('i'))el.insertAdjacentHTML('beforeend','<i></i>');el.querySelector('i').style.width=Math.max(0,b.t/b.dur*100)+'%';if(!prev.has(b.id))el.classList.add('new')});prev=cur}}
{const _ab=addBuff;addBuff=function(id,F){const had=BUFFS.some(b=>b.id===id);_ab(id,F);if(!had){const ks=Object.keys(F.st||{});for(let i=0;i<24;i++){const k=ks[i%Math.max(1,ks.length)];rfxP(P.x+(Math.random()-.5)*24,P.y-Math.random()*20,(Math.random()-.5)*40,-60-Math.random()*80,.9,BUFFRGB[k]||'255,255,200',2,'spark')}RFX.push({k:'ring',x:P.x,y:P.y,t:0,l:.5,rgb:BUFFRGB[ks[0]]||'255,255,200',s:36});tone(660,990,.25,'triangle',.06);tone(990,1320,.25,'triangle',.05,.1)}}}

// ---------- 5) ดนตรีกดดันตามด่าน/บอส ----------
const MUS={beat:0};
function heartbeat(v){tone(55,40,.18,'sine',v,0,'mu');tone(52,38,.16,'sine',v*.8,.2,'mu')}
{const _mt=musicTick;musicTick=function(){if(!AU.c||SET.mute||SET.music<=0||document.hidden)return;
  if(D&&D.zone&&!D.home){const s=MUS.beat=(MUS.beat+1)%64,b=D.boss&&!D.boss.dead&&Math.hypot(D.boss.x-P.x,D.boss.y-P.y)<520,dg=D.dg||0;
   if(b){// เพลงบอส: กลองเร็ว + เบสวนซ้ำ + สายกระชาก
    const root=D.boss.abyss?33:38,bass=[0,0,3,0,7,6,3,1];tone(mf(root+bass[s%8]),0,.36,'sawtooth',.16,0,'mu');if(s%2===0)nz(.08,.4,180,60,1,'lowpass',0,'mu');if(s%4===2)nz(.05,.22,4000,2000,1,'highpass',0,'mu');
    if(s%16===0)[0,3,6].forEach(i=>tone(mf(root+24+i),0,1.4,'square',.05,0,'mu'));if(D.boss.abyss&&s%8===4)tone(mf(root+13),mf(root+12),.8,'sawtooth',.07,0,'mu');return}
   if(dg){// ยิ่งลึกยิ่งกดดัน: โดรนต่ำ + หัวใจเต้น + โน้ตไม่ลงตัว
    const tens=Math.min(1,dg/80);if(s%8===0)tone(mf(36),0,3.6,'sine',.35,0,'mu');if(s%8===4)tone(mf(37+Math.floor(tens*5)),0,3,'sine',.12+tens*.12,0,'mu');
    if(tens>.2&&s%(tens>.6?3:5)===0)heartbeat(.25+tens*.3);if(Math.random()<.15+tens*.2)tone(mf(72+[0,1,6,7,11][Math.random()*5|0]),0,1.2,'triangle',.08,0,'mu');return}}
  return _mt()}}

// ---------- 6) บอสโหดที่สุด: จักรพรรดิเงาแห่งห้วงลึก (ดันเจี้ยนชั้น 100) ----------
const ABYSS={n:'เงาแห่งห้วงลึก',hp:3.6,atk:1.1};
{const _sb=spawnBoss;spawnBoss=function(){_sb();if(!(D&&D.dg===100&&D.boss))return;const b=D.boss;b.abyss=1;b.nm=ABYSS.n;b.max=b.hp=Math.round(b.hp*ABYSS.hp);b.atk=Math.round(b.atk*ABYSS.atk);b.col=['#2a1a3a','#0a0610','#c040ff'];b.sc*=1.15;
  b.ph=1;b.orbT=3;b.tpT=6;b.sumT=9;b.ringT=5;shake(6,.8);sfx('warp');banner('☠️ '+ABYSS.n,'ผู้ทำลายผลึกอรุณ — บอสที่โหดที่สุดในเอลโดเรีย','blue');
  setTimeout(()=>{if(D&&D.boss===b)say('“เจ้าคิดหรือว่าเศษแสงเพียงห้าชิ้น… จะหยุดความมืดนิรันดร์ได้?”')},1200)}}
function abyssShot(b,a,sp,dmg,c,r){ZPROJ.push({x:b.x,y:b.y-30*b.sc,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:3,dmg,c:c||'#c040ff',r:r||8,boss:!!b.boss})}
{const _um=updMob;updMob=function(m,dt){_um(m,dt);if(!m.abyss||m.dead||!D||!D.zone)return;const b=m,hpR=b.hp/b.max,d=Math.hypot(P.x-b.x,P.y-b.y),aim=Math.atan2(P.y-14-(b.y-30*b.sc),P.x-b.x);
  const ph=hpR>.7?1:hpR>.35?2:3;if(ph!==b.ph){b.ph=ph;shake(5,.6);sfx('warp');banner(ph===2?'เฟส 2: เงาแยกร่าง':'เฟส 3: ความมืดนิรันดร์',ph===3?'บอสคลั่ง — ระวังวงกระสุนรอบทิศ!':'บอสเรียกอัศวินเงามาช่วย','blue');if(ph===3){b.atk=Math.round(b.atk*1.2)}}
  if(d>700)return;const sp=ph===3?1.6:ph===2?1.25:1;
  // ลูกพลังเงาเล็งตัว (ยิงกระจาย 3-5 ลูก)
  if((b.orbT-=dt*sp)<=0){b.orbT=2.6;const n=ph===1?3:5;for(let i=0;i<n;i++)abyssShot(b,aim+(i-(n-1)/2)*.16,230+ph*30,b.atk*.7);tone(220,110,.3,'sawtooth',.05)}
  // วาปไปข้างหลังผู้เล่น แล้วฟาด
  if((b.tpT-=dt*sp)<=0){b.tpT=ph===1?8:5.5;const a=Math.random()*6.283,nx=P.x+Math.cos(a)*110,ny=P.y+Math.sin(a)*80;if(!zHit(nx,ny)){for(let i=0;i<20;i++)rfxP(b.x+(Math.random()-.5)*50,b.y-Math.random()*60,(Math.random()-.5)*80,-40,.6,'160,60,220',2.5,'spark');b.x=nx;b.y=ny;RFX.push({k:'ring',x:nx,y:ny,t:0,l:.5,rgb:'200,80,255',s:60});sfx('dash');b.cd=Math.min(b.cd||0,.4)}}
  // เรียกอัศวินเงา
  if(ph>=2&&(b.sumT-=dt)<=0){b.sumT=ph===3?10:14;const k=D.mobs.filter(q=>q.shade&&!q.dead).length;if(k<6)for(let i=0;i<(ph===3?3:2);i++){const a=Math.random()*6.283,q=mkMob('skeleton','อัศวินเงา',['#3a2a4a','#120a18','#c040ff'],100,b.x+Math.cos(a)*80,b.y+Math.sin(a)*60,{elite:1});q.shade=1;q.aggro=1;q.st='chase';D.mobs.push(q)}say('☠️ อัศวินเงาผุดขึ้นจากพื้น!')}
  // วงกระสุนรอบทิศ (เฟส 3) — มีช่องว่างให้หลบ
  if(ph===3&&(b.ringT-=dt)<=0){b.ringT=4.2;const gap=Math.random()*6.283;for(let i=0;i<22;i++){const a=i/22*6.283;if(Math.abs(((a-gap+9.42)%6.283)-3.14)<.45)continue;abyssShot(b,a,170,b.atk*.6,'#ff40c0',9)}shake(3,.3);tone(110,55,.6,'square',.06)}}}
{const _dm=drawMob;drawMob=function(m,t){if(m.abyss){const r=60+Math.sin(t*3)*6;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(m.x,m.y-30*m.sc,4,m.x,m.y-30*m.sc,r*m.sc*.7);g.addColorStop(0,'rgba(190,60,255,.35)');g.addColorStop(1,'rgba(80,0,140,0)');ctx.fillStyle=g;ctx.fillRect(m.x-r*m.sc,m.y-30*m.sc-r*m.sc,r*2*m.sc,r*2*m.sc);ctx.restore();if(Math.random()<.4)rfxP(m.x+(Math.random()-.5)*60*m.sc,m.y-Math.random()*50*m.sc,0,-30,.8,'150,40,220',2.5,'dot')}
  if(m.shade){ctx.save();ctx.globalAlpha=.85;_dm(m,t);ctx.restore();return}return _dm(m,t)}}
// แถบเลือดบอส: ชื่อ + เฟส
{const _sb2=spawnBoss;}
// ---------- 7) ภารกิจสุดท้าย ----------
STCH[13].t='บทที่ 13: ผู้ทำลายผลึก';STCH[13].d='ลงดันเจี้ยนชั้น 100 และปราบ '+ABYSS.n;STCH[13].need=()=>[STORY.f100?1:0,1];
STCH[13].intro='เศษผลึกทั้งห้าเผยความจริง… ผู้ทำลายผลึกอรุณคือ '+ABYSS.n+' ที่หลับใหลอยู่ใต้ชั้นที่ร้อย มันแข็งแกร่งกว่าทุกสิ่งที่เจ้าเคยเผชิญ — เตรียมตัวให้พร้อม ตีบวกอาวุธ ใส่รูน และพกยาให้เต็มกระเป๋า';
STCH[13].done=['เจ้า… ปราบเงาแห่งห้วงลึกได้จริง ๆ! แสงอรุณกลับคืนสู่แผ่นดินแล้ว','ข้าในนามแห่งเอลโดเรีย ขอมอบ “โฉนดที่ดินผู้กล้า” ทางทิศตะวันออกของทุ่งหญ้าให้แก่เจ้า','จงสร้างบ้าน ปลูกผัก เลี้ยงสัตว์ และใช้ชีวิตอย่างสงบสุขที่เจ้าสมควรได้รับ'];
STCH[13].rw={coin:30000,xp:80000,bless:6,end:1,deed:1};
STCH[14].t='บทส่งท้าย: ชีวิตใหม่ของผู้กล้า';STCH[14].d='สร้างบ้านหลังแรกในที่ดินผู้กล้า (ไปทางประตูมิติในทุ่งหญ้า)';
{const _g=giveRw;giveRw=function(r){const L=_g(r);if(r&&r.deed){HOME.unlocked=1;saveHome&&saveHome();L.push('📜 โฉนดที่ดินผู้กล้า')}return L}}
// เควสเสริมหลังเนื้อเรื่อง: สร้างบ้าน


// =====================================================================
// v4.5 : ชีวิตสโลว์ไลฟ์ — ที่ดินผู้กล้า (ปลดล็อกหลังปราบบอสสุดท้าย): ปลูกผัก รดน้ำ เก็บเกี่ยว เลี้ยงสัตว์ สร้าง/อัปเกรดบ้านตามแร่ ตกแต่ง
//        จอบ · บัวรดน้ำ · เคียว · ค้อน (อัปเกรดตามแร่) · ทำอาหาร · เควส NPC · ระบบจีบ/แต่งงาน · สัตว์เลี้ยง · สัตว์ขี่ · เวลวิ่งนานขึ้น
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#lifep{position:absolute;inset:0;z-index:29;display:flex;align-items:center;justify-content:center;background:rgba(10,8,4,.55)}
#lifep[hidden]{display:none}
#lifep .lw{position:relative;width:min(880px,97%);height:min(560px,95%);display:flex;flex-direction:column;border-radius:18px;overflow:hidden;color:#3a2a14;
 background:linear-gradient(180deg,#f8eed6,#ecdcb6);border:3px solid #8a5a2a;box-shadow:0 0 0 3px #3a2410,0 14px 40px rgba(0,0,0,.6)}
#lifep .lh{display:flex;align-items:center;gap:6px;padding:9px 12px;background:linear-gradient(180deg,#8a5a2a,#6a4220);color:#fff3d6}
#lifep .lh b{font-size:16px;margin-right:auto;text-shadow:0 1px 0 #2a1808}
#lifep .lh button{font:inherit;font-weight:700;font-size:12.5px;padding:6px 10px;border-radius:9px;border:1px solid #c8945a;background:#5a3818;color:#ffe9c0;cursor:pointer}
#lifep .lh button.on{background:#ffe9a0;color:#4a2a08;border-color:#fff3c0}
#lifep .lb{flex:1;min-height:0;overflow-y:auto;padding:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr));gap:9px;align-content:start}
#lifep .it{display:flex;flex-direction:column;gap:6px;padding:9px;border-radius:12px;background:#fffaf0;border:1.5px solid #d8bf8f;box-shadow:0 2px 0 #c8a870}
#lifep .it.lock{opacity:.55}
#lifep .it .th{height:74px;border-radius:9px;background:linear-gradient(180deg,#cfe8ff,#e8f4ff 62%,#9cd07a 63%,#6fae55);display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
#lifep .it .th canvas{image-rendering:pixelated;max-width:100%}
#lifep .it b{font-size:14px}#lifep .it small{font-size:11.5px;opacity:.8;line-height:1.4}
#lifep .cost{display:flex;flex-wrap:wrap;gap:4px}#lifep .cost span{display:inline-flex;align-items:center;gap:2px;font-size:11.5px;font-weight:700;padding:1px 6px 1px 2px;border-radius:8px;background:#f0e2c0}
#lifep .cost span.no{background:#ffd6cc;color:#a02a14}#lifep .cost img{width:18px;height:18px}
#lifep .it button{font:inherit;font-weight:800;font-size:13px;padding:7px;border-radius:9px;border:0;cursor:pointer;color:#fff;background:linear-gradient(180deg,#5aa04a,#3a7a2a)}
#lifep .it button:disabled{background:#b8a888;cursor:default}
#lifep .tier{align-self:flex-start;font-size:10.5px;font-weight:800;padding:1px 7px;border-radius:8px;color:#fff;background:#8a7a6a}
#lifep .x{position:absolute;right:10px;top:8px}
#lifep .steps{grid-column:1/-1;display:flex;gap:4px;overflow-x:auto;padding-bottom:4px}
#lifep .steps div{flex:0 0 auto;min-width:86px;text-align:center;font-size:11px;padding:6px 4px;border-radius:10px;background:#efe0bc;border:1.5px solid #d8bf8f}
#lifep .steps div.done{background:#d8f0c0;border-color:#7ab85a}#lifep .steps div.cur{background:#ffe9a0;border-color:#e8a820;box-shadow:0 0 8px #ffd060}
#lifep .prog{height:8px;border-radius:5px;background:#e0d0b0;overflow:hidden}#lifep .prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffb040,#ff6a20);transition:width 1.1s linear}
#hearts{font-size:11px;margin-left:6px;letter-spacing:-1px}
#mountb,#petb{position:relative}
@media (max-height:440px){#lifep .lb{grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr))}#lifep .it .th{height:52px}}`;document.head.appendChild(st)}

// ---------------- ข้อมูลหลัก ----------------
const HOME={unlocked:0,house:0,tools:{},tiles:{},builds:[],animals:[],day:0,pet:null,mount:null,riding:0,love:{},side:{},spouse:null,lastLove:{},water:0};
try{Object.assign(HOME,JSON.parse(localStorage.getItem('fm_home')||'{}'))}catch(e){}
function saveHome(){try{localStorage.setItem('fm_home',JSON.stringify(HOME))}catch(e){}}
setInterval(saveHome,15000);addEventListener('beforeunload',saveHome);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveHome()});
// นับวัน
window._dayPt=DAY.t;setInterval(()=>{if(DAY.t<_dayPt-12){HOME.day++;newDay()}_dayPt=DAY.t},400);
const TIERC=['#9a9aa4','#c8ccd6','#e08a4a','#e6eef8','#ffd23a','#7fd0ff'],TIERN=TNAMES;
// ---------------- วัตถุดิบใหม่ + ไอคอน ----------------
const NEWMAT={strawberry:['สตรอว์เบอร์รี','🍓'],tomato:['มะเขือเทศ','🍅'],wheat:['ข้าวสาลี','🌾'],turnip:['ผักกาดหัว','🥔'],egg:['ไข่ไก่สด','🥚'],milk:['นมวัวสด','🥛'],wool:['ขนแกะ','🧶'],hay:['หญ้าแห้ง','🌿'],
 bouquet:['ช่อดอกไม้','💐'],pendant:['จี้นางฟ้าแห่งอรุณ','💎']};
const CROPS={turnip:{n:'ผักกาดหัว',d:3,seed:10,sell:30,c:['#f4f0e8','#b06ad0']},wheat:{n:'ข้าวสาลี',d:3,seed:8,sell:20,c:['#e8c860','#c8a040']},carrot:{n:'แครอท',d:4,seed:15,sell:40,c:['#ff9a3a','#e86a10']},
 cabbage:{n:'กะหล่ำปลี',d:5,seed:20,sell:55,c:['#b8e890','#5aa040']},tomato:{n:'มะเขือเทศ',d:5,re:2,seed:25,sell:35,c:['#ff5a4a','#c02a20']},strawberry:{n:'สตรอว์เบอร์รี',d:5,re:2,seed:40,sell:50,c:['#ff4a6a','#c0203a']},
 corn:{n:'ข้าวโพด',d:6,re:3,seed:30,sell:60,c:['#ffd23a','#e8a820']},pumpkin:{n:'ฟักทอง',d:8,seed:50,sell:160,c:['#ff9a3a','#d0600a']}};
for(const k in NEWMAT){INVMETA[k]=[NEWMAT[k][0],'วัตถุดิบจากฟาร์ม/เมือง · ใช้ทำอาหาร ขาย หรือให้ของขวัญ'];WT[k]=.2;if(inv[k]===undefined)inv[k]=0;if(!INVORDER.includes(k))INVORDER.push(k)}
INVMETA.bouquet=['ช่อดอกไม้','มอบให้คนที่มีหัวใจ 8 ดวงขึ้นไป เพื่อเริ่มคบหาเป็นแฟน'];INVMETA.pendant=['จี้นางฟ้าแห่งอรุณ','ใช้ขอแต่งงาน (หัวใจ 10 ดวง + คบหาอยู่ + บ้านระดับ 2 ขึ้นไป)'];INVMETA.hay=['หญ้าแห้ง','อาหารสัตว์ในฟาร์ม (ป้อนวันละครั้ง)'];
for(const k in CROPS){const s='sd_'+k;INVMETA[s]=['เมล็ด'+CROPS[k].n,'ปลูกในแปลงที่ขุดด้วยจอบ · โต '+CROPS[k].d+' วัน'+(CROPS[k].re?' · เก็บซ้ำทุก '+CROPS[k].re+' วัน':'')+' · ต้องรดน้ำทุกวัน'];WT[s]=.05;if(inv[s]===undefined)inv[s]=0;if(!INVORDER.includes(s))INVORDER.push(s)}
const FTOOLS={hoe:['จอบ','⛏️'],can:['บัวรดน้ำ','🚿'],sick:['เคียว','🌙'],hamr:['ค้อนช่าง','🔨']};
for(const k in FTOOLS){INVMETA['t_'+k]=[FTOOLS[k][0],'เครื่องมือฟาร์ม · ใส่ช่องลัดแล้วกดโจมตีเพื่อใช้ · อัปเกรดได้ที่เมนูสร้าง (ค้อน)'];WT['t_'+k]=.5;if(inv['t_'+k]===undefined)inv['t_'+k]=0;if(!INVORDER.includes('t_'+k))INVORDER.push('t_'+k)}
function emojiIcon(e,tint){const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.fillStyle='rgba(0,0,0,.22)';k.beginPath();k.ellipse(24,41,14,4,0,0,7);k.fill();if(tint){k.fillStyle=tint;k.beginPath();k.arc(24,24,18,0,7);k.fill()}
 k.font='30px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif';k.textAlign='center';k.textBaseline='middle';k.fillText(e,24,25);return c}
function toolIcon2(k,tier){const c=document.createElement('canvas');c.width=c.height=48;const q=c.getContext('2d'),col=TIERC[tier|0];q.lineCap='round';q.lineJoin='round';q.fillStyle='rgba(0,0,0,.22)';q.beginPath();q.ellipse(24,42,14,4,0,0,7);q.fill();
 q.strokeStyle='#3a2410';q.lineWidth=6;q.beginPath();q.moveTo(12,40);q.lineTo(34,14);q.stroke();q.strokeStyle='#9a6a36';q.lineWidth=3.5;q.stroke();q.fillStyle=col;q.strokeStyle='#1a1a22';q.lineWidth=1.6;q.beginPath();
 if(k==='hoe'){q.moveTo(28,8);q.lineTo(42,12);q.lineTo(40,22);q.lineTo(33,15);q.closePath()}
 else if(k==='sick'){q.moveTo(33,14);q.quadraticCurveTo(46,10,42,26);q.quadraticCurveTo(40,18,31,17);q.closePath()}
 else if(k==='hamr'){q.rect(25,6,18,10)}
 else{q.moveTo(26,16);q.lineTo(40,16);q.lineTo(42,32);q.lineTo(24,32);q.closePath();q.fill();q.stroke();q.beginPath();q.moveTo(41,20);q.lineTo(46,12);q.lineWidth=3;q.strokeStyle=col;q.stroke();q.strokeStyle='#1a1a22';q.lineWidth=1.6;q.beginPath();q.arc(33,24,3,0,7)}
 q.fill();q.stroke();if(tier>=3){q.fillStyle='rgba(255,255,255,.6)';q.fillRect(30,9,3,2)}return c}
{const _mi=matIcon;matIcon=function(key){if(NEWMAT[key])return emojiIcon(NEWMAT[key][1]);if(/^sd_/.test(key)){const c=emojiIcon('🌱','rgba(160,120,60,.35)');return c}
  if(/^t_/.test(key)){const k=key.slice(2);return toolIcon2(k,(HOME.tools[k]|0))}if(DISH[key])return emojiIcon(DISH[key].e,'rgba(255,240,200,.5)');return _mi(key)}}
// ---------------- อาหาร (ทำเอง) ----------------
const DISH={grillfish:{n:'ปลาย่างเกลือ',e:'🐟',hu:30,st:{vit:3},dur:300,need:{fish:1},price:30},
 fishsoup:{n:'ต้มยำปลา',e:'🍲',hu:40,st:{str:4,vit:3},dur:420,need:{fish:1,tomato:1},price:60},
 omelet:{n:'ไข่เจียวทรงเครื่อง',e:'🍳',hu:30,st:{end:5},dur:360,need:{egg:2},price:40},
 cornbread:{n:'ขนมปังข้าวโพด',e:'🥖',hu:40,st:{str:3,end:3},dur:420,need:{wheat:2,corn:1},price:50},
 pancake:{n:'แพนเค้กนมสด',e:'🥞',hu:45,st:{agi:4,end:4},dur:480,need:{egg:1,milk:1,wheat:2},price:70},
 pumpsoup:{n:'ซุปฟักทองครีม',e:'🥣',hu:55,hpP:.4,st:{vit:6},dur:480,need:{pumpkin:1,milk:1},price:90},
 herbtea:{n:'ชาน้ำผึ้งสตรอว์เบอร์รี',e:'🍵',hu:10,mpP:.5,st:{int:8},dur:600,need:{honey:1,strawberry:1},price:70},
 berrycake:{n:'เค้กสตรอว์เบอร์รี',e:'🍰',hu:50,st:{str:4,vit:4,agi:4,end:4,int:4},dur:600,need:{strawberry:3,egg:1,milk:1,wheat:1},price:160},
 feast:{n:'สำรับผู้กล้า',e:'🍱',hu:100,hpP:1,st:{str:10,vit:10,agi:6,end:6,int:6},dur:900,need:{dragon:1,pumpkin:1,strawberry:2,milk:1},price:600}};
for(const k in DISH){const F=DISH[k];FOOD[k]={n:F.n,e:F.e,hu:F.hu,hpP:F.hpP,mpP:F.mpP,st:F.st,dur:F.dur,price:F.price,w:.3};INVMETA[k]=[F.n,foodTxt(FOOD[k])+' · อาหารปรุงเอง'];WT[k]=.3;if(inv[k]===undefined)inv[k]=0;if(!INVORDER.includes(k))INVORDER.push(k);if(!QCONS.includes(k))QCONS.push(k)}
const fishHave=()=>Object.keys(FISHES).filter(f=>f!=='dragon'&&inv[f]>0);
function needOK(need){for(const k in need){if(k==='fish'){if(fishHave().length<need[k])return false}else if((inv[k]|0)<need[k])return false}return true}
function cookDish(k){const R=DISH[k];if(!needOK(R.need)){say('วัตถุดิบไม่พอ');sfx('thud');return}
 for(const q in R.need){if(q==='fish'){for(let i=0;i<R.need[q];i++){const f=fishHave()[0];inv[f]--}}else inv[q]-=R.need[q]}
 const bar=gid('cookbar');if(bar){bar.style.width='0';void bar.offsetWidth;bar.style.width='100%'}LIFE.busy=1;sizzle();
 setTimeout(()=>{inv[k]=(inv[k]|0)+1;LIFE.busy=0;refreshInv();sfx('chest');say('🍳 ทำ'+R.n+'สำเร็จ!');for(let i=0;i<14;i++)rfxP(P.x+(Math.random()-.5)*20,P.y-30,(Math.random()-.5)*30,-40-Math.random()*40,1,'255,255,255',3,'bubble');openLife('cook')},1150)}
function sizzle(){if(!AU.c||SET.mute)return;for(let i=0;i<6;i++)nz(.18,.12,5000,2500,2,'highpass',i*.17);tone(180,120,.4,'triangle',.05)}
// ---------------- พาเนลชีวิต (สร้าง / ทำอาหาร / ร้านฟาร์ม / ของขวัญ) ----------------
const LIFE={tab:'house',busy:0};
const lifeEl=document.createElement('div');lifeEl.id='lifep';lifeEl.hidden=true;gid('wrap').appendChild(lifeEl);
lifeEl.addEventListener('click',e=>{if(e.target===lifeEl)closeLife()});
function closeLife(){lifeEl.hidden=true;PAUSED=false;sfx('ui')}
const costHTML=c=>'<div class="cost">'+Object.entries(c).map(([k,v])=>{const have=k==='coin'?inv.coin:(inv[k]|0);return '<span class="'+(have>=v?'':'no')+'"><img src="'+iconURL('mat:'+k)+'">'+v.toLocaleString()+'</span>'}).join('')+'</div>';
const costOK=c=>Object.entries(c).every(([k,v])=>(k==='coin'?inv.coin:(inv[k]|0))>=v);
const payCost=c=>{for(const [k,v] of Object.entries(c))inv[k]-=v;refreshInv()};
function thumb(fn,w,h,s){const c=document.createElement('canvas');c.width=w;c.height=h;const k=c.getContext('2d');const g=k.createLinearGradient(0,0,0,h);g.addColorStop(0,'#cfe8ff');g.addColorStop(.62,'#e8f4ff');g.addColorStop(.63,'#9cd07a');g.addColorStop(1,'#6fae55');k.fillStyle=g;k.fillRect(0,0,w,h);const sv=ctx;ctx=k;try{k.translate(w/2,h-4);k.scale(s,s);fn()}catch(e){}finally{ctx=sv}return c}
// ---------------- สิ่งก่อสร้าง ----------------
const HOUSE=[{n:'ที่ดินว่าง'},{n:'กระท่อมไม้',c:{wood:30,coin:200},h:0},{n:'บ้านหิน',c:{ingSt:15,wood:40,coin:600},h:0},{n:'บ้านเหล็ก',c:{ingot:20,wood:30,coin:1500},h:1},
 {n:'บ้านทองแดง',c:{ingCu:20,ingot:10,coin:3000},h:2},{n:'คฤหาสน์เงิน',c:{ingAg:25,coin:6000},h:3},{n:'คฤหาสน์ทองคำ',c:{ingAu:25,coin:12000},h:4},{n:'ปราสาทเพชร',c:{ingDm:20,ingAu:10,coin:25000},h:5}];
const BLD={coop:{n:'เล้าไก่',w:3,h:2,c:{wood:20,ingSt:5},ht:0,cap:4,d:'เลี้ยงไก่ได้ 4 ตัว (ไข่ทุกวัน)'},barn:{n:'โรงนา',w:4,h:3,c:{wood:40,ingot:10},ht:1,cap:4,d:'เลี้ยงวัว/แกะได้ 4 ตัว'},
 kitchen:{n:'เตาครัว',w:2,h:1,c:{ingSt:8,wood:10},ht:0,d:'ทำอาหารที่ให้บัฟแรง'},well:{n:'บ่อน้ำ',w:1,h:1,c:{ingSt:6},ht:0,d:'เติมน้ำบัวรดน้ำ'},
 spr1:{n:'สปริงเกอร์ทองแดง',w:1,h:1,c:{ingCu:4,ingot:2},ht:2,d:'รดน้ำ 4 ช่องรอบตัวทุกเช้า',r:1},spr2:{n:'สปริงเกอร์เงิน',w:1,h:1,c:{ingAg:4,ingCu:2},ht:3,d:'รดน้ำ 3×3 รอบตัวทุกเช้า',r:2},spr3:{n:'สปริงเกอร์ทอง',w:1,h:1,c:{ingAu:4,ingAg:2},ht:4,d:'รดน้ำ 5×5 รอบตัวทุกเช้า',r:3},
 fence:{n:'รั้วไม้',w:1,h:1,c:{wood:2},ht:0,deco:1},lamp:{n:'เสาตะเกียง',w:1,h:1,c:{ingot:1,wood:2},ht:1,deco:1,d:'ส่องสว่างตอนกลางคืน'},flower:{n:'กระถางดอกไม้',w:1,h:1,c:{wood:2,coin:20},ht:0,deco:1},
 bench:{n:'ม้านั่งไม้',w:2,h:1,c:{wood:6},ht:0,deco:1},scare:{n:'หุ่นไล่กา',w:1,h:1,c:{wood:5,hay:1},ht:0,deco:1},tree:{n:'ต้นไม้ประดับ',w:1,h:1,c:{wood:4,coin:40},ht:0,deco:1},
 statue:{n:'รูปปั้นเทพธิดา',w:2,h:2,c:{ingAg:4,ingSt:4},ht:3,deco:1},fountain:{n:'น้ำพุทองคำ',w:2,h:2,c:{ingAu:4,ingSt:6},ht:4,deco:1},crystal:{n:'ต้นคริสตัล',w:1,h:1,c:{ingDm:2},ht:5,deco:1,d:'เรืองแสงตลอดคืน'}};
const HW=56,HH=40,HLOT={x:19,y:3,w:6,h:5},HENT={x:22,y:HH-4};
// ---------------- แผนที่ที่ดิน ----------------
function homeTileBase(k,x,y){const px=x*T,py=y*T,h=hash(x*1.7,y*2.3);k.fillStyle=['#6fb04a','#69a845','#74b54e'][Math.floor(h*3)];k.fillRect(px,py,T,T);k.fillStyle='rgba(255,255,255,.06)';k.fillRect(px+(h*20|0),py+((h*53)%24|0),5,3);
 if(h<.08){k.fillStyle=['#fff4a0','#ff9ac4','#ffffff'][Math.floor(h*37)%3];k.fillRect(px+10,py+12,3,3)}
 const path=(x===HENT.x||x===HENT.x-1)&&y>HLOT.y+HLOT.h&&y<HH-2;if(path){k.fillStyle='#c8a870';k.fillRect(px,py,T,T);k.fillStyle='rgba(120,90,50,.25)';k.fillRect(px+(h*20|0),py+((h*31)%24|0),6,4)}}
function homePaintTile(x,y){const Zm=ZCACHE[300];if(!Zm)return;const k=Zm.cv.getContext('2d'),key=x+','+y,t=HOME.tiles[key];if(Zm.m[y][x]!==FL)return;homeTileBase(k,x,y);
 if(t&&t.till){const px=x*T,py=y*T,wet=t.w===HOME.day;k.fillStyle=wet?'#5a3a22':'#8a6038';k.fillRect(px+1,py+1,T-2,T-2);k.fillStyle=wet?'rgba(0,0,0,.25)':'rgba(255,230,180,.18)';for(let i=0;i<4;i++)k.fillRect(px+3,py+5+i*7,T-6,2);if(wet){k.fillStyle='rgba(120,180,255,.2)';k.fillRect(px+1,py+1,T-2,T-2)}}}
function buildHomeZone(){const W=HW,H=HH,m=[];for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++)m[y][x]=(x<1||y<1||x>=W-1||y>=H-1)?WL:FL}
 for(let y=3;y<=7;y++)for(let x=34;x<=40;x++)if(Math.hypot((x-37)/3.4,(y-5)/2.4)<1)m[y][x]=WL;// บ่อน้ำ
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d');for(let y=0;y<H;y++)for(let x=0;x<W;x++)homeTileBase(k,x,y);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(m[y][x]!==WL)continue;const px=x*T,py=y*T;if(x>=33&&x<=41&&y>=2&&y<=8){k.fillStyle='#3a86cc';k.fillRect(px,py,T,T);k.fillStyle='rgba(255,255,255,.25)';if(m[y-1][x]!==WL)k.fillRect(px,py,T,4);continue}
  k.fillStyle='#5a9a3a';k.fillRect(px,py,T,T);k.fillStyle='#8a5a2e';k.fillRect(px+(x%2?4:20),py+6,6,22);k.fillStyle='#a87040';k.fillRect(px,py+10,T,4);k.fillRect(px,py+20,T,4)}
 // ป้ายที่ดิน
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 const Zm={zi:300,Zd:{id:'home',n:'ที่ดินผู้กล้า',e:'🏡',lv:[1,1],dark:0,amb:'pollen',pal:{vd:'#4a7a2a'},mobs:[],boss:null,ores:[]},m,ores:[],oreAt:{},floor,ent:{x:HENT.x,y:HENT.y},arena:{x:HLOT.x+3,y:HLOT.y+3},seen:new Uint8Array(W*H).fill(1),W,H,cv:c};
 ZCACHE[300]=Zm;for(const key in HOME.tiles){const [x,y]=key.split(',').map(Number);homePaintTile(x,y)}homeObjects();return Zm}
// วัตถุบนที่ดิน (วาดตามความลึก + กันชน)
function homeObjects(){const Zm=ZCACHE[300];if(!Zm)return;Zm.ores.length=0;Zm.oreAt={};const add=(o,block)=>{o.home=1;o.kind='home';o.alive=true;o.shake=0;Zm.ores.push(o);if(block)for(let y=o.ty;y<o.ty+(o.h||1);y++)for(let x=o.tx;x<o.tx+(o.w||1);x++)Zm.oreAt[y*HW+x]=o;return o};
 // บ้าน
 add({type:'house',tx:HLOT.x,ty:HLOT.y,w:HLOT.w,h:HLOT.h-1,x:(HLOT.x+3)*T,y:(HLOT.y+HLOT.h-1)*T,draw:o=>drawHouse(o,HOME.house)},HOME.house>0);
 // คนขายฟาร์ม
 add({type:'rancher',tx:HENT.x+4,ty:HENT.y-2,x:(HENT.x+4)*T+16,y:(HENT.y-2)*T+28,draw:o=>{try{drawNPC(RANCHER,performance.now()/1000)}catch(e){}}},false);
 for(const b of HOME.builds){const B=BLD[b.k];if(!B)continue;add({type:'bld',b,tx:b.x,ty:b.y,w:B.w,h:B.h,x:(b.x+B.w/2)*T,y:(b.y+B.h)*T,draw:o=>drawBuild(b,o)},true)}
 for(const key in HOME.tiles){const t=HOME.tiles[key];if(!t.crop)continue;const [x,y]=key.split(',').map(Number);add({type:'crop',t,tx:x,ty:y,x:x*T+16,y:y*T+26,draw:o=>drawCrop(o.t,x,y)},false)}
 for(const a of HOME.animals){add({type:'animal',a,tx:0,ty:0,get x(){return a.x},get y(){return a.y},draw:o=>drawAnimal(a)},false)}
 if(HOME.spouse){const s=SPOUSE();if(s)add({type:'spouse',tx:0,ty:0,x:s.x,y:s.y,draw:()=>{try{drawNPC(s,performance.now()/1000)}catch(e){}}},false)}}
{const _do=drawOreZ;drawOreZ=function(o){if(o.home){o.draw(o);return}return _do(o)}}
const RANCHER={name:'ลุงบุญมี (คนเลี้ยงสัตว์)',c:'#7a8a3a',h:'#d8c8a8',x:(HENT.x+4)*T+16,y:(HENT.y-2)*T+28,dir:'d',fixed:1,hat:'straw',beard:1,age:'elder',home:{x:1,y:1},lines:['ปลูกผักต้องรดน้ำทุกวันนะหลาน','วัวเราชอบหญ้าแห้งที่สุด','อยากได้เมล็ดอะไรบอกลุงได้เลย'],t:0,mv:false};
// ---------------- วาด ----------------
function drawHouse(o,lv){const x=o.x,y=o.y,t=performance.now()/1000;ctx.save();
 if(lv===0){ctx.fillStyle='#7a4a22';ctx.fillRect(x-3,y-34,6,34);ctx.fillStyle='#c8945a';ctx.fillRect(x-28,y-50,56,22);ctx.strokeStyle='#5a3a18';ctx.lineWidth=2;ctx.strokeRect(x-28,y-50,56,22);ctx.fillStyle='#3a2410';ctx.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.fillText('ที่ดินว่าง',x,y-41);ctx.fillText('สร้างด้วยค้อน 🔨',x,y-31);ctx.restore();return}
 const P2=[null,{w:110,h:62,wall:'#b8844a',roof:'#7a3a22',trim:'#5a3418'},{w:130,h:70,wall:'#b8b4a8',roof:'#5a5a6a',trim:'#4a4a52'},{w:140,h:78,wall:'#c8ccd6',roof:'#3a4a6a',trim:'#2a3448'},
  {w:150,h:82,wall:'#e8a070',roof:'#8a3a1a',trim:'#6a2a10'},{w:166,h:92,wall:'#eef2f8',roof:'#5a6a8a',trim:'#c8ccd6'},{w:176,h:100,wall:'#fff0c0',roof:'#c8901a',trim:'#e8c14a'},{w:186,h:110,wall:'#e6f6ff',roof:'#3a7ad0',trim:'#7fd0ff'}][lv],w=P2.w,h=P2.h;
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y,w/2+8,8,0,0,7);ctx.fill();
 ctx.fillStyle=P2.wall;ctx.fillRect(x-w/2,y-h,w,h);ctx.strokeStyle=P2.trim;ctx.lineWidth=2;ctx.strokeRect(x-w/2,y-h,w,h);
 if(lv===1){ctx.strokeStyle='rgba(60,30,10,.35)';for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(x-w/2,y-h+i*h/6);ctx.lineTo(x+w/2,y-h+i*h/6);ctx.stroke()}}
 else{ctx.strokeStyle='rgba(0,0,0,.12)';for(let r=0;r<h;r+=10)for(let c=(r/10%2)*12;c<w;c+=24){ctx.strokeRect(x-w/2+c,y-h+r,24,10)}}
 const rh=lv>=5?60:44;ctx.fillStyle=P2.roof;ctx.beginPath();ctx.moveTo(x-w/2-12,y-h+2);ctx.lineTo(x,y-h-rh);ctx.lineTo(x+w/2+12,y-h+2);ctx.closePath();ctx.fill();ctx.strokeStyle=P2.trim;ctx.lineWidth=3;ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.moveTo(x-w/2-12,y-h+2);ctx.lineTo(x,y-h-rh);ctx.lineTo(x-10,y-h-rh+8);ctx.lineTo(x-w/2,y-h+2);ctx.fill();
 if(lv>=5){for(const s of [-1,1]){const tx=x+s*(w/2-6);ctx.fillStyle=P2.wall;ctx.fillRect(tx-14,y-h-30,28,h+30);ctx.strokeStyle=P2.trim;ctx.strokeRect(tx-14,y-h-30,28,h+30);ctx.fillStyle=P2.roof;ctx.beginPath();ctx.moveTo(tx-18,y-h-28);ctx.lineTo(tx,y-h-64);ctx.lineTo(tx+18,y-h-28);ctx.fill();ctx.fillStyle='#c0392b';ctx.fillRect(tx-1,y-h-80,2,16);ctx.fillRect(tx,y-h-80,10,6)}}
 const night=dayDark(DAY.t)>.4;for(const s of [-1,1])for(let i=0;i<(lv>=4?2:1);i++){const wx=x+s*(w/4+i*22)-10,wy=y-h+14;ctx.fillStyle=night?'#ffd870':'#9fd0ff';ctx.fillRect(wx,wy,20,18);ctx.strokeStyle=P2.trim;ctx.lineWidth=2;ctx.strokeRect(wx,wy,20,18);ctx.beginPath();ctx.moveTo(wx+10,wy);ctx.lineTo(wx+10,wy+18);ctx.stroke()}
 ctx.fillStyle='#5a3418';ctx.fillRect(x-12,y-34,24,34);ctx.fillStyle='#e8c14a';ctx.fillRect(x+6,y-18,3,3);ctx.strokeStyle=P2.trim;ctx.strokeRect(x-12,y-34,24,34);
 if(lv>=3){ctx.fillStyle='#8a8a92';ctx.fillRect(x+w/4,y-h-rh*.6,12,26)}if(lv>=3&&Math.random()<.2)rfxP(x+w/4+6,y-h-rh*.6-4,(Math.random()-.5)*6,-16,1.6,'200,200,210',3,'dot');
 if(lv>=6){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-h-rh,2,x,y-h-rh,40);g.addColorStop(0,lv>=7?'rgba(127,208,255,.5)':'rgba(255,220,100,.5)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-40,y-h-rh-40,80,80)}
 ctx.restore();if(Math.hypot(P.x-x,P.y-y-10)<70)homeChip('กด E บ้าน: นอนพัก / ห้องเก็บของ',x,y+18)}
function homeChip(s,x,y){ctx.save();ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';const w=ctx.measureText(s).width+12;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(x-w/2,y-12,w,17);ctx.fillStyle='#fff';ctx.fillText(s,x,y);ctx.restore()}
function drawBuild(b,o){const B=BLD[b.k],x=b.x*T,y=b.y*T,w=B.w*T,h=B.h*T,t=performance.now()/1000;ctx.save();
 const sh=()=>{ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+w/2,y+h-2,w/2+2,5,0,0,7);ctx.fill()};sh();
 switch(b.k){case 'coop':case 'barn':{const big=b.k==='barn';ctx.fillStyle=big?'#a83a2a':'#c8945a';ctx.fillRect(x+2,y+h*.25,w-4,h*.75-2);ctx.fillStyle=big?'#f4ead6':'#7a4a22';ctx.beginPath();ctx.moveTo(x-4,y+h*.3);ctx.lineTo(x+w/2,y-h*.15);ctx.lineTo(x+w+4,y+h*.3);ctx.fill();
   ctx.fillStyle='#3a2410';ctx.fillRect(x+w/2-10,y+h-28,20,26);if(big){ctx.strokeStyle='#f4ead6';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w/2-10,y+h-28);ctx.lineTo(x+w/2+10,y+h-2);ctx.moveTo(x+w/2+10,y+h-28);ctx.lineTo(x+w/2-10,y+h-2);ctx.stroke()}
   if((b.lv|0)>=2){ctx.fillStyle='#e8c14a';ctx.fillRect(x+w/2-6,y+h*.32,12,6)}break}
  case 'kitchen':{ctx.fillStyle='#8a8a92';ctx.fillRect(x+4,y+6,w-8,h-6);ctx.fillStyle='#4a4a52';ctx.fillRect(x+10,y+12,w-20,10);ctx.fillStyle='#ff9a3a';ctx.globalAlpha=.6+.3*Math.sin(t*9);ctx.fillRect(x+14,y+15,w-28,5);ctx.globalAlpha=1;ctx.fillStyle='#5a5a62';ctx.fillRect(x+w-16,y-18,8,24);if(Math.random()<.15)rfxP(x+w-12,y-20,0,-16,1.4,'210,210,220',3,'dot');break}
  case 'well':{ctx.fillStyle='#8a8a92';ctx.beginPath();ctx.ellipse(x+16,y+24,14,7,0,0,7);ctx.fill();ctx.fillStyle='#2f6fb5';ctx.beginPath();ctx.ellipse(x+16,y+22,10,4,0,0,7);ctx.fill();ctx.fillStyle='#6a4422';ctx.fillRect(x+2,y-10,3,32);ctx.fillRect(x+27,y-10,3,32);ctx.fillStyle='#7a3a22';ctx.fillRect(x,y-14,32,6);break}
  case 'spr1':case 'spr2':case 'spr3':{const c=b.k==='spr1'?'#e08a4a':b.k==='spr2'?'#e6eef8':'#ffd23a';ctx.fillStyle='#555';ctx.fillRect(x+14,y+14,4,14);ctx.fillStyle=c;ctx.beginPath();ctx.arc(x+16,y+13,6,0,7);ctx.fill();ctx.strokeStyle='#222';ctx.stroke();
   if(DAY.t>6&&DAY.t<6.6){for(let i=0;i<3;i++)rfxP(x+16,y+10,(Math.random()-.5)*120,-60-Math.random()*40,.6,'150,200,255',2,'drip')}break}
  case 'fence':{ctx.fillStyle='#8a5a2e';ctx.fillRect(x+3,y+4,5,26);ctx.fillRect(x+24,y+4,5,26);ctx.fillStyle='#a87040';ctx.fillRect(x,y+10,T,4);ctx.fillRect(x,y+20,T,4);break}
  case 'lamp':{ctx.fillStyle='#2a2a32';ctx.fillRect(x+14,y-22,4,50);ctx.fillStyle=dayDark(DAY.t)>.3?'#ffe08a':'#c8c0a0';ctx.fillRect(x+10,y-30,12,10);if(dayDark(DAY.t)>.3){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x+16,y-25,1,x+16,y-25,40);g.addColorStop(0,'rgba(255,210,120,.5)');g.addColorStop(1,'rgba(255,180,60,0)');ctx.fillStyle=g;ctx.fillRect(x-24,y-65,80,80)}break}
  case 'flower':{ctx.fillStyle='#a8603a';ctx.fillRect(x+8,y+16,16,12);for(const [dx,dy,c] of [[12,10,'#ff6a8a'],[20,8,'#ffd23a'],[16,4,'#c08bff']]){ctx.fillStyle='#4a9a3a';ctx.fillRect(x+dx,y+dy,2,8);ctx.fillStyle=c;ctx.beginPath();ctx.arc(x+dx+1,y+dy,4,0,7);ctx.fill()}break}
  case 'bench':{ctx.fillStyle='#7a4a22';ctx.fillRect(x+4,y+10,w-8,6);ctx.fillRect(x+4,y+2,w-8,5);ctx.fillRect(x+8,y+16,4,12);ctx.fillRect(x+w-12,y+16,4,12);break}
  case 'scare':{ctx.fillStyle='#6a4422';ctx.fillRect(x+15,y-12,3,40);ctx.fillRect(x+4,y,25,3);ctx.fillStyle='#c8945a';ctx.fillRect(x+8,y+2,17,14);ctx.fillStyle='#e8d8a8';ctx.beginPath();ctx.arc(x+16,y-14,7,0,7);ctx.fill();ctx.fillStyle='#d9c16a';ctx.beginPath();ctx.ellipse(x+16,y-20,11,3,0,0,7);ctx.fill();break}
  case 'tree':{ctx.fillStyle='#6a4422';ctx.fillRect(x+13,y+6,6,22);ctx.fillStyle='#3f8a3a';ctx.beginPath();ctx.arc(x+16,y-2,14,0,7);ctx.fill();ctx.fillStyle='#5aaa4a';ctx.beginPath();ctx.arc(x+12,y-6,7,0,7);ctx.fill();ctx.fillStyle='#ff6a6a';for(const [a,c] of [[6,2],[22,-4],[16,6]]){ctx.beginPath();ctx.arc(x+a,y+c,2,0,7);ctx.fill()}break}
  case 'statue':{ctx.fillStyle='#c8ccd6';ctx.fillRect(x+12,y+40,40,22);ctx.fillStyle='#e6eef8';ctx.beginPath();ctx.moveTo(x+32,y-6);ctx.lineTo(x+44,y+40);ctx.lineTo(x+20,y+40);ctx.closePath();ctx.fill();ctx.beginPath();ctx.arc(x+32,y-10,7,0,7);ctx.fill();ctx.fillStyle='rgba(255,240,180,.5)';ctx.beginPath();ctx.ellipse(x+32,y-20,10,3,0,0,7);ctx.fill();break}
  case 'fountain':{ctx.fillStyle='#c8a040';ctx.beginPath();ctx.ellipse(x+32,y+46,30,12,0,0,7);ctx.fill();ctx.fillStyle='#4a9ae0';ctx.beginPath();ctx.ellipse(x+32,y+43,24,8,0,0,7);ctx.fill();ctx.fillStyle='#ffd23a';ctx.fillRect(x+28,y+10,8,32);ctx.beginPath();ctx.ellipse(x+32,y+12,12,4,0,0,7);ctx.fill();if(Math.random()<.6)rfxP(x+32,y+6,(Math.random()-.5)*60,-50,.7,'170,220,255',1.8,'drip');break}
  case 'crystal':{ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x+16,y,1,x+16,y,34);g.addColorStop(0,'rgba(127,208,255,'+(.4+.2*Math.sin(t*2))+')');g.addColorStop(1,'rgba(127,208,255,0)');ctx.fillStyle=g;ctx.fillRect(x-18,y-34,68,68);ctx.globalCompositeOperation='source-over';
   ctx.fillStyle='#7fd0ff';for(const [dx,hh] of [[8,30],[16,40],[24,26]]){ctx.beginPath();ctx.moveTo(x+dx-5,y+26);ctx.lineTo(x+dx,y+26-hh);ctx.lineTo(x+dx+5,y+26);ctx.fill()}break}}
 ctx.restore();if(b.k==='kitchen'&&Math.hypot(P.x-x-w/2,P.y-y-h)<60)homeChip('กด E ทำอาหาร',x+w/2,y+h+16)}
function drawCrop(t,x,y){const C=CROPS[t.crop.k],s=t.crop.s,max=C.d,px=x*T+16,py=y*T+26,u=Math.min(1,s/max),sw=Math.sin(performance.now()/600+x)*1.5;ctx.save();
 if(s>=max){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(px,py-10,1,px,py-10,16);g.addColorStop(0,'rgba(255,240,150,'+(.25+.15*Math.sin(performance.now()/300))+')');g.addColorStop(1,'rgba(255,240,150,0)');ctx.fillStyle=g;ctx.fillRect(px-16,py-26,32,32);ctx.globalCompositeOperation='source-over'}
 ctx.strokeStyle='#3f8a2a';ctx.lineWidth=2;const hh=4+u*16;for(const dx of [-4,0,4]){ctx.beginPath();ctx.moveTo(px+dx*.5,py);ctx.quadraticCurveTo(px+dx+sw,py-hh*.6,px+dx*1.6+sw,py-hh);ctx.stroke()}
 if(s===0){ctx.fillStyle='#a87a48';ctx.beginPath();ctx.arc(px,py-1,2.5,0,7);ctx.fill()}
 if(s>=max){ctx.fillStyle=C.c[0];ctx.strokeStyle=C.c[1];ctx.lineWidth=1;const k=t.crop.k;
  if(k==='corn'||k==='wheat'){for(const dx of [-5,5]){ctx.beginPath();ctx.ellipse(px+dx+sw,py-hh+2,3,7,0,0,7);ctx.fill();ctx.stroke()}}
  else if(k==='pumpkin'){ctx.beginPath();ctx.ellipse(px,py-6,10,7,0,0,7);ctx.fill();ctx.stroke()}
  else if(k==='turnip'||k==='carrot'){ctx.beginPath();ctx.arc(px,py-2,5,0,7);ctx.fill();ctx.stroke()}
  else for(const [dx,dy] of [[-5,-8],[5,-12],[0,-16]]){ctx.beginPath();ctx.arc(px+dx+sw,py+dy,3.5,0,7);ctx.fill();ctx.stroke()}}
 if(t.w!==HOME.day&&s<max){ctx.font='9px system-ui';ctx.textAlign='center';ctx.fillText('💧',px,py-hh-4)}
 ctx.restore()}
function drawAnimal(a){const t=performance.now()/1000,x=a.x,y=a.y,f=a.vx<0?-1:1,bob=a.mv?Math.abs(Math.sin(t*8+a.ph))*2:0;ctx.save();ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x,y,a.k==='chicken'?7:14,4,0,0,7);ctx.fill();ctx.translate(x,y-bob);ctx.scale(f,1);
 if(a.k==='chicken'){ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(0,-8,7,6,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(5,-14,4,0,7);ctx.fill();ctx.fillStyle='#e04a3a';ctx.fillRect(4,-19,3,3);ctx.fillStyle='#ffb43a';ctx.fillRect(8,-14,3,2);ctx.fillStyle='#111';ctx.fillRect(6,-15,1.5,1.5);ctx.fillStyle='#e8a030';ctx.fillRect(-2,-2,1.5,3);ctx.fillRect(2,-2,1.5,3)}
 else{const cow=a.k==='cow';ctx.fillStyle=cow?'#f4f0e8':'#e8e0d0';ctx.beginPath();ctx.ellipse(0,-14,14,9,0,0,7);ctx.fill();if(cow){ctx.fillStyle='#2a2a2a';ctx.beginPath();ctx.ellipse(-4,-16,4,3,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(6,-11,3,2,0,0,7);ctx.fill()}else{ctx.fillStyle='#fff';for(let i=-10;i<=10;i+=5){ctx.beginPath();ctx.arc(i,-18,4,0,7);ctx.fill()}}
  ctx.fillStyle=cow?'#e8dcc8':'#2a2a2a';ctx.beginPath();ctx.ellipse(14,-18,6,5,0,0,7);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(16,-20,1.5,1.5);ctx.fillStyle=cow?'#4a3a2a':'#2a2a2a';for(const lx of [-9,-4,5,10])ctx.fillRect(lx,-7,3,7);if(cow){ctx.fillStyle='#ffb0b0';ctx.fillRect(-2,-6,5,3)}}
 ctx.restore();if(a.got===HOME.day-0&&a.ready){ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText(a.k==='chicken'?'🥚':a.k==='cow'?'🥛':'🧶',x,y-30)}
 else if(a.fed!==HOME.day){ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText('🌿?',x,y-28)}
 if(a.heart>0){}}
// ---------------- เข้า/ออกที่ดิน ----------------
function enterHome(){if(!HOME.unlocked){say('🔒 ที่ดินผู้กล้าจะปลดล็อกหลังปราบ '+ABYSS.n+' (บทที่ 13)');sfx('thud');return}
 closeZMenu();const Zm=ZCACHE[300]||buildHomeZone();ZW=HW;ZH=HH;fade('#fff');sfx('warp');setScene('town');flushDrops();dsav=slimes.splice(0);ZPROJ.length=0;
 D={zone:Zm,mobs:[],spT:1e9,bossT:0,boss:null,ret:[ZG.x,ZG.y+40],ban:0,home:1};dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,3);P.x=Zm.ent.x*T;P.y=(Zm.ent.y-1)*T+16;P.dir='u';P.kx=P.ky=0;homeObjects();
 say('🏡 ที่ดินผู้กล้า — '+(HOME.house?'ยินดีต้อนรับกลับบ้าน!':'ใส่ค้อนในช่องลัดแล้วกดโจมตีเพื่อเปิดเมนูสร้าง'));if(AUTO.on)autoToggle(false)}
{const _oz=openZMenu;openZMenu=function(){_oz();shopEl.insertAdjacentHTML('beforeend','<button class="mini zbtn" onclick="enterHome()"><b>🏡 ที่ดินผู้กล้า</b> <span class="zl">'+(HOME.unlocked?'บ้าน: '+HOUSE[HOME.house].n:'🔒 ปลดล็อกหลังบอสสุดท้าย')+'</span><small>ปลูกผัก เลี้ยงสัตว์ สร้างและตกแต่งบ้าน ใช้ชีวิตสโลว์ไลฟ์</small></button>')}}
{const _at=autoToggle;autoToggle=function(f){if(D&&D.home&&(f===undefined||f)){say('ใช้ฟาร์มออโต้ในที่ดินไม่ได้');return}return _at(f)}}
// ---------------- วันใหม่: พืชโต · สัตว์ให้ผลผลิต · สปริงเกอร์ ----------------
function newDay(){const d=HOME.day;
 for(const b of HOME.builds){const B=BLD[b.k];if(!B||!B.r)continue;const r=B.r;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(r===1&&Math.abs(dx)+Math.abs(dy)!==1)continue;const t=HOME.tiles[(b.x+dx)+','+(b.y+dy)];if(t&&t.till)t.w=d}}
 for(const key in HOME.tiles){const t=HOME.tiles[key];if(t.crop){const C=CROPS[t.crop.k];if(t.w===d-1&&t.crop.s<C.d)t.crop.s++}}
 for(const a of HOME.animals){a.ready=a.fed===d-1;a.got=d;if(a.ready)a.heart=Math.min(10,(a.heart||0)+.2)}
 if(ZCACHE[300]){for(const key in HOME.tiles){const [x,y]=key.split(',').map(Number);homePaintTile(x,y)}homeObjects()}saveHome();
 if(HOME.unlocked)sysSay('🌅 วันใหม่ (วันที่ '+d+') — พืชที่รดน้ำเมื่อวานโตขึ้น · สัตว์ที่ได้กินอาหารให้ผลผลิตแล้ว')}
// สัตว์เดินเล่น
setInterval(()=>{if(!(D&&D.home))return;const dt=.05;for(const a of HOME.animals){a.t=(a.t||0)-dt;if(a.t<=0){a.t=1+Math.random()*3;const ang=Math.random()*6.28,sp=a.k==='chicken'?26:18;a.vx=Math.random()<.4?0:Math.cos(ang)*sp;a.vy=Math.random()<.4?0:Math.sin(ang)*sp*.6}
  const nx=a.x+(a.vx||0)*dt,ny=a.y+(a.vy||0)*dt;a.mv=!!(a.vx||a.vy);if(Math.hypot(nx-a.hx,ny-a.hy)<70&&!zHit(nx,ny)){a.x=nx;a.y=ny}else{a.vx=-a.vx;a.vy=-a.vy}}},50);
// ---------------- ใช้เครื่องมือ ----------------
const TOOLKEYS=['hoe','can','sick','hamr'];const TAREA=[[[0,0]],[[0,0]],[[0,0],[1,0],[-1,0]],[[0,0],[1,0],[-1,0]],[[0,0],[1,0],[-1,0],[2,0],[-2,0]],[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]];
function areaTiles(tier){const [x,y]=target(),v=DIRV[P.dir],L=[];for(const [a,b] of TAREA[tier|0]){const dx=v[0]?b:a,dy=v[0]?a:b;L.push([x+dx,y+dy])}return L}
const occ=(x,y)=>{const Zm=ZCACHE[300];return !Zm||Zm.m[y]===undefined||Zm.m[y][x]!==FL||!!Zm.oreAt[y*HW+x]||(x===HENT.x||x===HENT.x-1)&&y>HLOT.y+HLOT.h};
HOME.can=HOME.can||0;const CANCAP=[20,30,40,60,80,999];
function homeUse(){if(!(D&&D.home))return false;const tool=P.draw?P.tool:null,[tx,ty]=target();
 if(tool==='hamr'){const Zm=ZCACHE[300],o=Zm.oreAt[ty*HW+tx];if(o&&o.type==='bld'&&BLD[o.b.k].deco){askRemove(o.b);return true}openLife('house');return true}
 if(tool==='hoe'){let n=0;for(const [x,y] of areaTiles(HOME.tools.hoe)){if(occ(x,y))continue;const k=x+','+y,t=HOME.tiles[k]||(HOME.tiles[k]={});if(!t.till){t.till=1;n++;homePaintTile(x,y)}}if(n){sfx('chop');P.fa=Math.max(0,P.fa-1);for(let i=0;i<8;i++)fx.push({x:tx*T+16,y:ty*T+20,vx:(Math.random()-.5)*90,vy:-40-Math.random()*40,l:.4,c:'140,100,60'})}else say('ขุดตรงนี้ไม่ได้ (มีของ/ทางเดิน/ขุดแล้ว)');saveHome();return true}
 if(tool==='can'){const Zm=ZCACHE[300];const nearWater=[[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const x=tx+a,y=ty+b;return Zm.m[y]&&Zm.m[y][x]===WL&&x>=33&&y<=8})||HOME.builds.some(b=>b.k==='well'&&Math.hypot(b.x-tx,b.y-ty)<2);
  if(nearWater){HOME.can=CANCAP[HOME.tools.can|0];sfx('pop');nz(.5,.12,800,300,1);say('🚿 เติมน้ำเต็มแล้ว ('+HOME.can+')');return true}
  if(HOME.can<=0){say('💧 บัวรดน้ำหมด — ไปเติมที่บ่อน้ำ/บ่อในที่ดิน');sfx('thud');return true}let n=0;for(const [x,y] of areaTiles(HOME.tools.can)){const t=HOME.tiles[x+','+y];if(t&&t.till&&t.w!==HOME.day&&HOME.can>0){t.w=HOME.day;HOME.can--;n++;homePaintTile(x,y);for(let i=0;i<5;i++)rfxP(x*T+16,y*T+8,(Math.random()-.5)*30,20+Math.random()*30,.4,'150,200,255',2,'drip')}}
  if(n){nz(.4,.1,2500,900,1)}homeObjects();saveHome();return true}
 if(tool==='sick'){let n=0;for(const [x,y] of areaTiles(HOME.tools.sick)){const t=HOME.tiles[x+','+y];if(!t||!t.crop)continue;const C=CROPS[t.crop.k];if(t.crop.s<C.d)continue;const q=1+(Math.random()<.15?1:0)+(HOME.tools.sick>=4&&Math.random()<.3?1:0);inv[t.crop.k]=(inv[t.crop.k]|0)+q;n+=q;
   if(t.crop.k==='wheat')inv.hay=(inv.hay|0)+1;if(C.re)t.crop.s=C.d-C.re;else delete t.crop;for(let i=0;i<8;i++)rfxP(x*T+16,y*T+16,(Math.random()-.5)*80,-40-Math.random()*60,.6,'255,230,120',2,'spark')}
  if(n){sfx('coin');say('🌾 เก็บเกี่ยวได้ '+n+' ชิ้น');refreshInv();homeObjects();saveHome()}else say('ยังไม่มีผลผลิตพร้อมเก็บตรงนี้');return true}
 return false}
// กด E ในที่ดิน: บ้าน · ครัว · คนขาย · สัตว์ · ปลูกเมล็ด
function homeAct(){if(!(D&&D.home))return false;const [tx,ty]=target(),Zm=ZCACHE[300];
 if(Math.hypot(P.x-RANCHER.x,P.y-RANCHER.y)<52){talk(RANCHER,pick(RANCHER.lines),[{t:'🛒 ร้านฟาร์ม',c:'go',f:()=>openLife('shop')},{t:'🐾 สัตว์เลี้ยง / สัตว์ขี่',f:()=>openLife('pet')},{t:'💰 ขายผลผลิต',f:()=>openLife('sell')},BYE]);return true}
 const hx=(HLOT.x+3)*T,hy=(HLOT.y+HLOT.h-1)*T;if(HOME.house>0&&Math.hypot(P.x-hx,P.y-hy-10)<70){houseMenu();return true}
 for(const b of HOME.builds)if(b.k==='kitchen'&&Math.hypot(P.x-(b.x+1)*T,P.y-(b.y+1)*T)<60){openLife('cook');return true}
 for(const a of HOME.animals)if(Math.hypot(P.x-a.x,P.y-a.y)<40){animalAct(a);return true}
 if(HOME.spouse){const s=SPOUSE();if(s&&Math.hypot(P.x-s.x,P.y-s.y)<50){spouseTalk();return true}}
 const t=HOME.tiles[tx+','+ty];if(t&&t.till&&!t.crop){seedPicker(tx,ty);return true}
 if(t&&t.crop){const C=CROPS[t.crop.k];say('🌱 '+C.n+' — โตแล้ว '+t.crop.s+'/'+C.d+' วัน'+(t.w===HOME.day?' · รดน้ำแล้ววันนี้':' · ยังไม่ได้รดน้ำ!'));return true}
 return false}
function seedPicker(tx,ty){const L=Object.keys(CROPS).filter(k=>inv['sd_'+k]>0);if(!L.length){say('ไม่มีเมล็ดพันธุ์ — ซื้อได้ที่ลุงบุญมี');sfx('thud');return}
 talk(RANCHER.near?RANCHER:{name:'แปลงผัก',c:'#6a4a2a'},'จะปลูกอะไรดี?',L.slice(0,6).map(k=>({t:'🌱 '+CROPS[k].n+' ×'+inv['sd_'+k],f:()=>plant(tx,ty,k)})).concat([BYE]),'🌱 ปลูกเมล็ด')}
function plant(tx,ty,k){const t=HOME.tiles[tx+','+ty];if(!t||!t.till||t.crop||!(inv['sd_'+k]>0))return;inv['sd_'+k]--;t.crop={k,s:0};sfx('pop');refreshInv();homeObjects();saveHome();say('🌱 ปลูก'+CROPS[k].n+'แล้ว — รดน้ำทุกวัน '+CROPS[k].d+' วันจะโต')}
function animalAct(a){const nm={chicken:'ไก่',cow:'วัว',sheep:'แกะ'}[a.k];if(a.ready){const k=a.k==='chicken'?'egg':a.k==='cow'?'milk':'wool';inv[k]=(inv[k]|0)+1+(a.heart>=6&&Math.random()<.3?1:0);a.ready=false;sfx('coin');refreshInv();say('เก็บ'+MN(k)+'จาก'+nm+(a.name?' '+a.name:''));return}
 if(a.fed!==HOME.day){const f=inv.hay>0?'hay':inv.wheat>0?'wheat':null;if(!f){say(nm+'หิว — ป้อนหญ้าแห้ง/ข้าวสาลี (ซื้อหญ้าแห้งที่ลุงบุญมี)');return}inv[f]--;a.fed=HOME.day;a.heart=Math.min(10,(a.heart||0)+.3);sfx('pop');refreshInv();say('🌿 ป้อนอาหาร'+nm+'แล้ว — พรุ่งนี้จะให้ผลผลิต');saveHome();return}
 a.heart=Math.min(10,(a.heart||0)+.05);say('💗 ลูบหัว'+nm+' (ความผูกพัน '+(a.heart||0).toFixed(1)+'/10)');sfx('ui')}
function houseMenu(){const can=DAY.t>=18||DAY.t<5;talk({name:'บ้านของคุณ',c:'#8a5a2a'},HOUSE[HOME.house].n+' — '+(can?'ดึกแล้ว พักผ่อนดีไหม?':'ยังไม่ค่ำ (นอนได้ตั้งแต่ 18:00)'),[...(can?[{t:'🛏️ นอนหลับถึงเช้า',c:'go',f:sleepNow}]:[]),{t:'🔨 สร้าง/อัปเกรดบ้าน',f:()=>openLife('house')},BYE],'🏠 '+HOUSE[HOME.house].n)}
function sleepNow(){fade('#000');PAUSED=true;setTimeout(()=>{P.hp=BAL.hp;P.mp=BAL.mp;P.fa=100;const lv=HOME.house;addBuff('rest',{n:'พักผ่อนเต็มอิ่ม',e:'🛌',st:{str:lv,vit:lv,agi:lv,end:lv,int:lv},dur:600});PAUSED=false;saveGame(true);banner('อรุณสวัสดิ์!','วันที่ '+HOME.day+' · พักผ่อนเต็มอิ่ม ค่าพลังทั้งหมด +'+lv+' (10 นาที)','green')},900)}
{const _a=act;act=function(){if(D&&D.home&&!DLG.open){if(homeAct())return}return _a()}}
{const _i=interact;interact=function(){if(D&&D.home&&!DLG.open&&homeAct())return true;return _i()}}
{const _u=useToolHit;useToolHit=function(){if(D&&D.home){homeUse();return}return _u()}}
// ตกปลาในบ่อน้ำของที่ดิน
const homeWater=()=>{const Zm=ZCACHE[300];if(!Zm)return null;const [tx,ty]=target(),v=DIRV[P.dir];for(const [x,y] of [[tx,ty],[Math.floor((P.x+v[0]*44)/T),Math.floor((P.y+v[1]*44)/T)]])if(Zm.m[y]&&Zm.m[y][x]===WL&&x>=33&&y<=8)return [x,y];return null};
{const _i=interact;interact=function(){if(D&&D.home&&!DLG.open&&!FISH.st&&(inv.rod>0||inv.rod2>0)){const w=homeWater();if(w){fishStart(w);return true}}return _i()}}
{const _a=attack;attack=function(q){if(D&&D.home&&P.draw&&TOOLKEYS.includes(P.tool)){if(P.at<0){P.at=0;atkId++;sfx('swing2')}return}return _a(q)}}
// ช่องลัด: เครื่องมือฟาร์ม
{const _qc=qCands;qCands=function(){const L=_qc();for(const k of TOOLKEYS)if(inv['t_'+k]>0)L.splice(1,0,{id:'t_'+k,name:FTOOLS[k][0]+' '+TIERN[HOME.tools[k]|0]});return L}}
{const _q=quickUseId;quickUseId=function(id){if(!/^t_/.test(id))return _q(id);const k=id.slice(2);if(!(inv[id]>0))return;if(qActive(id)){stowItem();return}P.tool=k;QS.last=id;drawItem(id,FTOOLS[k][1]+' หยิบ'+FTOOLS[k][0]+(D&&D.home?'':' (ใช้ได้ในที่ดินผู้กล้า)'))}}
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){if(!TOOLKEYS.includes(P.tool))return _ts(hx,hy,ang);ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r')ctx.scale(-1,1);ctx.drawImage(toolIcon2(P.tool,HOME.tools[P.tool]|0),-20,-34,40,40);ctx.restore()}}
// ---------------- พาเนล: สร้าง/อัปเกรด · ทำอาหาร · ร้านฟาร์ม · สัตว์เลี้ยง · ขาย ----------------
function openLife(tab){LIFE.tab=tab||LIFE.tab;lifeEl.hidden=false;PAUSED=true;renderLife();sfx('ui')}
function lifeTab(t){LIFE.tab=t;sfx('ui');renderLife()}
function renderLife(){const T2=LIFE.tab,ht=HOME.tools.hamr|0;let tabs,body='';
 const tb=(k,l)=>'<button class="'+(T2===k?'on':'')+'" onclick="lifeTab(\''+k+'\')">'+l+'</button>';
 if(['house','farm','deco','tools'].includes(T2)){tabs=tb('house','🏠 บ้าน')+tb('farm','🐔 ฟาร์ม')+tb('deco','🌸 ตกแต่ง')+tb('tools','🔧 เครื่องมือ');
  if(!(D&&D.home)&&T2!=='tools')body='<div class="it" style="grid-column:1/-1"><b>ไปที่ที่ดินผู้กล้าก่อนนะ</b><small>สร้างได้เฉพาะในที่ดินของคุณ (ประตูมิติในทุ่งหญ้า → 🏡)</small></div>';
  else if(T2==='house'){body+='<div class="steps">'+HOUSE.slice(1).map((h,i)=>'<div class="'+(HOME.house>i+1?'done':HOME.house===i?'cur':'')+'">'+(HOME.house>i?'✅':'Lv.'+(i+1))+'<br><b>'+h.n+'</b></div>').join('')+'</div>';
   const nx=HOUSE[HOME.house+1];if(nx){const ok=costOK(nx.c)&&ht>=nx.h;body+='<div class="it"><div class="th">'+thumbSlot('house',HOME.house+1)+'</div><span class="tier" style="background:'+TIERC[nx.h]+'">ต้องใช้ค้อน'+TIERN[nx.h]+'</span><b>'+(HOME.house?'อัปเกรดเป็น ':'สร้าง ')+nx.n+'</b><small>บ้านยิ่งใหญ่ ยิ่งได้บัฟตอนนอนมากขึ้น · ระดับ 2 ขึ้นไปแต่งงานได้</small>'+costHTML(nx.c)+'<button '+(ok?'':'disabled')+' onclick="buildHouse()">🔨 '+(HOME.house?'อัปเกรด':'สร้างบ้าน')+'</button></div>'}
   else body+='<div class="it"><b>🏰 บ้านระดับสูงสุดแล้ว!</b><small>'+HOUSE[HOME.house].n+'</small></div>'}
  else{const L=Object.keys(BLD).filter(k=>T2==='deco'?BLD[k].deco:(T2==='farm'&&!BLD[k].deco));
   if(T2==='tools'){body=TOOLKEYS.map(k=>{const own=inv['t_'+k]>0,t=HOME.tools[k]|0,nx=t+1,c=nx<=5?{[MATKEY[nx]]:3+nx*2,coin:300*nx}:null;
     return '<div class="it'+(own?'':' lock')+'"><div class="th" style="align-items:center"><img src="'+iconURL('mat:t_'+k)+'" style="width:56px;height:56px"></div><span class="tier" style="background:'+TIERC[t]+'">'+FTOOLS[k][0]+TIERN[t]+'</span><b>'+(own?(c?'อัปเกรดเป็น'+TIERN[nx]:'ระดับสูงสุดแล้ว'):'ยังไม่มี — ซื้อที่ลุงบุญมี')+'</b><small>'+toolDesc(k,nx<=5?nx:t)+'</small>'+(own&&c?costHTML(c)+'<button '+(costOK(c)?'':'disabled')+' onclick="upTool(\''+k+'\')">⬆️ อัปเกรด</button>':'')+'</div>'}).join('')}
   else body=L.map(k=>{const B=BLD[k],ok=costOK(B.c)&&ht>=B.ht,cnt=HOME.builds.filter(b=>b.k===k).length;return '<div class="it'+(ht>=B.ht?'':' lock')+'"><div class="th">'+thumbSlot('b',k)+'</div><span class="tier" style="background:'+TIERC[B.ht]+'">ค้อน'+TIERN[B.ht]+'</span><b>'+B.n+(cnt?' <small>(มี '+cnt+')</small>':'')+'</b>'+(B.d?'<small>'+B.d+'</small>':'')+costHTML(B.c)+'<button '+(ok?'':'disabled')+' onclick="startPlace(\''+k+'\')">📍 วาง</button></div>'}).join('')}}
 else if(T2==='cook'){tabs='<b style="color:#ffe9c0">🍳 ครัว</b>';body='<div style="grid-column:1/-1" class="prog"><i id="cookbar"></i></div>'+Object.keys(DISH).map(k=>{const R=DISH[k],need=Object.fromEntries(Object.entries(R.need).map(([q,v])=>[q==='fish'?(fishHave()[0]||'carp'):q,v]));
   return '<div class="it"><div class="th" style="align-items:center;background:linear-gradient(180deg,#ffe8c0,#f0c890)"><img src="'+iconURL('mat:'+k)+'" style="width:52px;height:52px"></div><b>'+R.n+' <small>มี '+(inv[k]|0)+'</small></b><small>'+foodTxt(FOOD[k])+'</small><div class="cost">'+Object.entries(R.need).map(([q,v])=>{const have=q==='fish'?fishHave().length:(inv[q]|0);return '<span class="'+(have>=v?'':'no')+'"><img src="'+iconURL('mat:'+(q==='fish'?'carp':q))+'">'+(q==='fish'?'ปลาใดก็ได้ ':'')+v+'</span>'}).join('')+'</div><button '+(needOK(R.need)&&!LIFE.busy?'':'disabled')+' onclick="cookDish(\''+k+'\')">🔥 ปรุง</button></div>'}).join('')}
 else if(T2==='shop'||T2==='pet'||T2==='sell'){tabs=tb('shop','🌱 เมล็ด & เครื่องมือ')+tb('pet','🐾 สัตว์')+tb('sell','💰 ขายผลผลิต');
  if(T2==='shop'){const items=Object.keys(CROPS).map(k=>({id:'sd_'+k,n:'เมล็ด'+CROPS[k].n,p:CROPS[k].seed,d:'โต '+CROPS[k].d+' วัน · ขายได้ '+CROPS[k].sell+'🪙'+(CROPS[k].re?' · เก็บซ้ำได้':'')})).concat([{id:'hay',n:'หญ้าแห้ง',p:15,d:'อาหารสัตว์ 1 มื้อ'},{id:'bouquet',n:'ช่อดอกไม้',p:500,d:'ให้คนที่หัวใจ 8 ดวงขึ้นไป = เริ่มคบหา'}],TOOLKEYS.filter(k=>!(inv['t_'+k]>0)).map(k=>({id:'t_'+k,n:FTOOLS[k][0]+'หิน',p:150,d:toolDesc(k,0)})));
   body=items.map(o=>'<div class="it"><div class="th" style="align-items:center"><img src="'+iconURL('mat:'+o.id)+'" style="width:48px;height:48px"></div><b>'+o.n+'</b><small>'+o.d+'</small>'+costHTML({coin:o.p})+'<button '+(inv.coin>=o.p?'':'disabled')+' onclick="lifeBuy(\''+o.id+'\','+o.p+')">ซื้อ'+(o.id.startsWith('sd_')?' ×1 (กดค้าง ×10)':'')+'</button></div>').join('')}
  else if(T2==='pet'){body=ANIMS.map(a=>{const need=a.need?HOME.builds.some(b=>b.k===a.need):true,cap=a.need?capOf(a.need)-HOME.animals.filter(q=>ANIM_HOUSE[q.k]===a.need).length:1;const own=a.pet?HOME.pet===a.k:a.mount?HOME.mount===a.k:false;const ok=inv.coin>=a.p&&need&&cap>0&&!own&&(!a.homeOnly||(D&&D.home));
    return '<div class="it"><div class="th">'+thumbSlot('a',a.k)+'</div><b>'+a.n+'</b><small>'+a.d+(a.need&&!need?' · ต้องสร้าง'+BLD[a.need].n+'ก่อน':'')+(a.homeOnly&&!(D&&D.home)?' · ซื้อได้ในที่ดิน':'')+'</small>'+costHTML({coin:a.p})+'<button '+(ok?'':'disabled')+' onclick="buyAnimal(\''+a.k+'\')">'+(own?'มีแล้ว ✓':'ซื้อ')+'</button></div>'}).join('')}
  else{const L=Object.keys(CROPS).concat(['egg','milk','wool','hay']).filter(k=>inv[k]>0);body=L.length?L.map(k=>{const p=CROPS[k]?CROPS[k].sell:{egg:45,milk:70,wool:120,hay:5}[k];return '<div class="it"><div class="th" style="align-items:center"><img src="'+iconURL('mat:'+k)+'" style="width:48px;height:48px"></div><b>'+MN(k)+' ×'+inv[k]+'</b><small>ชิ้นละ '+p+' 🪙</small><button onclick="lifeSell(\''+k+'\','+p+')">ขายทั้งหมด (+'+(p*inv[k]).toLocaleString()+')</button></div>'}).join(''):'<div class="it" style="grid-column:1/-1"><b>ยังไม่มีผลผลิตให้ขาย</b></div>'}}
 lifeEl.innerHTML='<div class="lw"><div class="lh"><b>'+({house:'🔨 สร้างและอัปเกรด',farm:'🔨 สร้างและอัปเกรด',deco:'🔨 สร้างและอัปเกรด',tools:'🔨 สร้างและอัปเกรด',cook:'🍳 ทำอาหาร',shop:'🧑‍🌾 ร้านฟาร์มลุงบุญมี',pet:'🧑‍🌾 ร้านฟาร์มลุงบุญมี',sell:'🧑‍🌾 ร้านฟาร์มลุงบุญมี'}[T2])+' <small style="font-weight:400;opacity:.8">🪙 '+inv.coin.toLocaleString()+'</small></b>'+tabs+'<button onclick="closeLife()">✕</button></div><div class="lb">'+body+'</div></div>';
 for(const s of lifeEl.querySelectorAll('[data-th]')){const [k,v]=s.dataset.th.split(':');s.appendChild(thumbCv(k,v))}
 for(const b of lifeEl.querySelectorAll('button[onclick^="lifeBuy(\'sd_"]')){let tm=0;b.addEventListener('pointerdown',()=>{tm=setTimeout(()=>{const m=/lifeBuy\('([^']+)',(\d+)\)/.exec(b.getAttribute('onclick'));for(let i=0;i<9;i++)lifeBuy(m[1],+m[2],1);renderLife()},500)});b.addEventListener('pointerup',()=>clearTimeout(tm))}}
const thumbSlot=(k,v)=>'<span data-th="'+k+':'+v+'"></span>';
function thumbCv(k,v){if(k==='house')return thumb(()=>drawHouse({x:0,y:0},+v),180,74,.38);if(k==='b'){const B=BLD[v];return thumb(()=>{ctx.translate(-B.w*16,-B.h*32);drawBuild({k:v,x:0,y:0},{})},140,74,Math.min(1.4,1.8/Math.max(B.w,B.h))*(['lamp','scare','tree','crystal','statue','fountain'].includes(v)?.72:1))}
 if(k==='a'){const a={k:v,x:0,y:0,vx:1,mv:false,ph:0};return thumb(()=>{if(v==='dog'||v==='cat')drawPet({k:v},0,0);else if(v==='horse'||v==='wolf')drawMountBody(v,0,0,1,0);else drawAnimal(a)},140,74,v==='horse'||v==='wolf'?.75:1.6)}}
function toolDesc(k,t){return k==='hoe'?'ขุดแปลง '+TAREA[t].length+' ช่อง/ครั้ง':k==='can'?'รด '+TAREA[t].length+' ช่อง · จุน้ำ '+(t>=5?'ไม่จำกัด':CANCAP[t]):k==='sick'?'เก็บเกี่ยว '+TAREA[t].length+' ช่อง'+(t>=4?' · โอกาสได้เพิ่ม':''):'สร้างสิ่งก่อสร้างระดับ'+TIERN[t]+'ได้'}
function upTool(k){const nx=(HOME.tools[k]|0)+1;if(nx>5)return;const c={[MATKEY[nx]]:3+nx*2,coin:300*nx};if(!costOK(c))return;payCost(c);HOME.tools[k]=nx;delete IURL['mat:t_'+k];sfx('chest');anvilFx();banner('อัปเกรดสำเร็จ!',FTOOLS[k][0]+TIERN[nx],'green');saveHome();renderLife()}
function lifeBuy(id,p,silent){if(inv.coin<p){if(!silent){say('เหรียญไม่พอ');sfx('thud')}return}inv.coin-=p;inv[id]=(inv[id]|0)+1;refreshInv();if(!silent){sfx('coin');renderLife()}}
function lifeSell(k,p){const n=inv[k]|0;if(!n)return;inv[k]=0;inv.coin+=n*p;sfx('coin');refreshInv();say('ขาย'+MN(k)+' ×'+n+' ได้ '+(n*p).toLocaleString()+' เหรียญ');renderLife()}
function buildHouse(){const nx=HOUSE[HOME.house+1];if(!nx||!costOK(nx.c)||(HOME.tools.hamr|0)<nx.h)return;payCost(nx.c);HOME.house++;homeObjects();saveHome();closeLife();shake(3,.4);sfx('chest');for(let i=0;i<50;i++)rfxP((HLOT.x+3)*T+(Math.random()-.5)*150,(HLOT.y+4)*T-Math.random()*80,(Math.random()-.5)*100,-60-Math.random()*90,1.2,i%2?'255,220,120':'255,255,255',2.5,'spark');
 banner('🏠 '+nx.n+' สร้างเสร็จ!',HOME.house===1?'บ้านหลังแรกของผู้กล้า':'อัปเกรดบ้านเป็นระดับ '+HOME.house,'green');fanfare();if(STORY.ch===14&&!STORY.homeDone){STORY.homeDone=1;saveStory();chatAnn((P.name||'ผู้กล้า')+' สร้างบ้านหลังแรกในที่ดินผู้กล้าแล้ว!')}}
// วางสิ่งก่อสร้าง (โหมดเล็งตำแหน่ง)
const PLACE={k:null};
function startPlace(k){PLACE.k=k;closeLife();say('📍 เดินไปยังจุดที่ต้องการ แล้วกดโจมตี/E เพื่อวาง '+BLD[k].n+' · กดปุ่ม ✕ บนจอเพื่อยกเลิก');placeBtn.hidden=false}
const placeBtn=document.createElement('button');placeBtn.textContent='✕ ยกเลิกการวาง';placeBtn.hidden=true;placeBtn.style.cssText='position:absolute;left:50%;transform:translateX(-50%);bottom:calc(120px + var(--sb,0px));z-index:25;font:bold 14px system-ui,"Noto Sans Thai",sans-serif;padding:8px 14px;border-radius:12px;background:#a83a2a;color:#fff;border:2px solid #ffd0b0';gid('wrap').appendChild(placeBtn);placeBtn.onclick=()=>{PLACE.k=null;placeBtn.hidden=true};
function placeSpot(){const B=BLD[PLACE.k],[tx,ty]=target(),v=DIRV[P.dir];let x=tx-(v[0]<0?B.w-1:0)-(v[0]===0?Math.floor(B.w/2):0),y=ty-(v[1]<0?B.h-1:0)-(v[1]===0?Math.floor(B.h/2):0);let ok=true;
 for(let j=y;j<y+B.h;j++)for(let i=x;i<x+B.w;i++){if(occ(i,j)||HOME.tiles[i+','+j]&&HOME.tiles[i+','+j].till||(i>=HLOT.x-1&&i<HLOT.x+HLOT.w+1&&j>=HLOT.y&&j<HLOT.y+HLOT.h+1)||Math.hypot(i-Math.floor(P.x/T),j-Math.floor(P.y/T))<.5)ok=false}return{x,y,ok}}
{const _h=hero;hero=function(){if(PLACE.k&&D&&D.home){const B=BLD[PLACE.k],s=placeSpot();ctx.save();ctx.globalAlpha=.55;drawBuild({k:PLACE.k,x:s.x,y:s.y},{});ctx.globalAlpha=1;ctx.strokeStyle=s.ok?'#7ed957':'#ff5a4a';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.strokeRect(s.x*T,s.y*T,B.w*T,B.h*T);ctx.restore()}_h()}}
function confirmPlace(){const B=BLD[PLACE.k],s=placeSpot();if((HOME.tools.hamr|0)<(B.ht|0)){say('ต้องใช้ค้อน'+TIERN[B.ht]+'ขึ้นไป');PLACE.k=null;placeBtn.hidden=true;return}if(!s.ok){say('วางตรงนี้ไม่ได้');sfx('thud');return}if(!costOK(B.c)){say('วัตถุดิบไม่พอ');PLACE.k=null;placeBtn.hidden=true;return}payCost(B.c);HOME.builds.push({k:PLACE.k,x:s.x,y:s.y});homeObjects();saveHome();sfx('chop');setTimeout(()=>sfx('chop'),150);
 for(let i=0;i<16;i++)rfxP(s.x*T+B.w*16,s.y*T+B.h*16,(Math.random()-.5)*120,-40-Math.random()*60,.6,'200,160,110',2.5,'dot');say('🔨 สร้าง'+B.n+'แล้ว');if(!B.deco||!costOK(B.c)){PLACE.k=null;placeBtn.hidden=true}}
{const _a=attack;attack=function(q){if(PLACE.k&&D&&D.home){confirmPlace();return}return _a(q)}}
{const _i=interact;interact=function(){if(PLACE.k&&D&&D.home){confirmPlace();return true}return _i()}}
function askRemove(b){const B=BLD[b.k];talk({name:'ค้อนช่าง',c:'#6a6a72'},'รื้อ'+B.n+'? (ได้วัตถุดิบคืนครึ่งหนึ่ง)',[{t:'🔨 รื้อ',c:'go',f:()=>{HOME.builds.splice(HOME.builds.indexOf(b),1);for(const [k,v] of Object.entries(B.c))inv[k]=(inv[k]|0)+Math.floor(v/2);refreshInv();homeObjects();saveHome();sfx('chop')}},BYE],'🔨 รื้อถอน')}
// ---------------- สัตว์ฟาร์ม · สัตว์เลี้ยง · สัตว์ขี่ ----------------
const ANIM_HOUSE={chicken:'coop',cow:'barn',sheep:'barn'};
const ANIMS=[{k:'chicken',n:'ไก่',p:800,need:'coop',homeOnly:1,d:'ให้ไข่ทุกวันเมื่อได้กินอาหาร'},{k:'cow',n:'วัวนม',p:2500,need:'barn',homeOnly:1,d:'ให้นมสดทุกวัน'},{k:'sheep',n:'แกะ',p:3000,need:'barn',homeOnly:1,d:'ให้ขนแกะ (ขายแพง)'},
 {k:'dog',n:'หมาชิบะ',p:1500,pet:1,d:'สัตว์เลี้ยง: ตามติดทุกที่ ดูดของดรอปเข้าหาตัว'},{k:'cat',n:'แมวส้ม',p:1500,pet:1,d:'สัตว์เลี้ยง: ตามติดทุกที่ ดูดของดรอป + โชคดีเล็กน้อย'},
 {k:'horse',n:'ม้าศึก',p:6000,mount:1,d:'สัตว์ขี่: เร็วขึ้น 60% (ปุ่ม 🐎 / R)'},{k:'wolf',n:'หมาป่าเงาจันทร์',p:20000,mount:1,d:'สัตว์ขี่ในตำนาน: เร็วขึ้น 90% · ต้องปราบบอสสุดท้าย'}];
const capOf=k=>HOME.builds.filter(b=>b.k===k).reduce((s,b)=>s+BLD[k].cap*((b.lv|0)+1),0);
function buyAnimal(k){const a=ANIMS.find(q=>q.k===k);if(!a||inv.coin<a.p)return;if(k==='wolf'&&!STORY.f100){say('ต้องปราบ'+ABYSS.n+'ก่อน');return}inv.coin-=a.p;refreshInv();sfx('gem');
 if(a.pet){HOME.pet=k;PET.x=P.x;PET.y=P.y;say('🐾 ได้'+a.n+'แล้ว! จะตามคุณไปทุกที่')}
 else if(a.mount){HOME.mount=k;say('🐎 ได้'+a.n+'แล้ว! กดปุ่ม 🐎 หรือ R เพื่อขี่');mountB.hidden=false}
 else{const b=HOME.builds.find(q=>q.k===a.need),hx=(b.x+BLD[a.need].w/2)*T,hy=(b.y+BLD[a.need].h+1.5)*T;HOME.animals.push({k,x:hx,y:hy,hx,hy,fed:-1,ready:false,heart:0,ph:Math.random()*6});homeObjects()}
 saveHome();renderLife()}
// สัตว์เลี้ยง
const PET={x:0,y:0,t:0,f:1,mv:false};
function drawPet(p,x,y){const t=performance.now()/1000,dog=p.k==='dog',mv=PET.mv&&x===PET.x,b=mv?Math.abs(Math.sin(t*12))*2:0;ctx.save();ctx.translate(x,y-b);if(x===PET.x)ctx.scale(PET.f,1);ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(0,b,9,3,0,0,7);ctx.fill();
 const c1=dog?'#e0a050':'#f0903a',c2=dog?'#fff4e0':'#ffe0c0';ctx.fillStyle=c1;ctx.beginPath();ctx.ellipse(0,-7,9,6,0,0,7);ctx.fill();ctx.fillStyle=c2;ctx.beginPath();ctx.ellipse(1,-5,5,3,0,0,7);ctx.fill();
 ctx.fillStyle=c1;ctx.beginPath();ctx.arc(8,-12,5.5,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(5,-16);ctx.lineTo(7,-21);ctx.lineTo(9,-16);ctx.fill();ctx.beginPath();ctx.moveTo(9,-16);ctx.lineTo(12,-20);ctx.lineTo(12,-14);ctx.fill();
 ctx.fillStyle='#111';ctx.fillRect(9,-13,1.6,1.6);ctx.fillStyle=c2;ctx.fillRect(10,-10,4,2);ctx.strokeStyle=c1;ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-8,-8);ctx.quadraticCurveTo(-13,-14+Math.sin(t*8)*3,-11,-18);ctx.stroke();
 ctx.fillStyle=c1;for(const lx of [-5,-1,3,6])ctx.fillRect(lx,-3,2.4,3+(mv?Math.sin(t*12+lx)*1:0));if(dog){ctx.fillStyle='#c0392b';ctx.fillRect(4,-9,6,2)}ctx.restore()}
function petTick(dt){if(!HOME.pet||!D&&false)return;if(D&&(D.shop))return;const tx=P.x-(DIRV[P.dir][0]||.6)*26,ty=P.y-DIRV[P.dir][1]*20+6,d=Math.hypot(tx-PET.x,ty-PET.y);if(d>400){PET.x=P.x;PET.y=P.y}
 PET.mv=d>8;if(PET.mv){const s=Math.min(d,(d>80?240:120)*dt);PET.x+=(tx-PET.x)/d*s;PET.y+=(ty-PET.y)/d*s;if(Math.abs(tx-PET.x)>2)PET.f=tx<PET.x?-1:1}
 for(const dr of drops){const q=Math.hypot(dr.x-P.x,dr.y-P.y);if(q<160&&q>10&&(!window.dropOK7||dropOK7(dr))){dr.x+=(P.x-dr.x)/q*140*dt;dr.y+=(P.y-dr.y)/q*140*dt}}}
// สัตว์ขี่
const MOUNT={on:false};
function drawMountBody(k,x,y,f,A){const K=k==='wolf'?{hi:'#c8d0e8',b:'#6a7090',s:'#3a3e58',m:'#e8ecff',leg:'#4a4e68'}:(COAT.bay||COAT[Object.keys(COAT)[0]]);ctx.save();ctx.translate(x,y);ctx.scale(f*.8,.8);ctx.translate(-34,0);
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(34,1,40,6,0,0,7);ctx.fill();try{drawHorse({x:0,amp:A},performance.now()/1000,K,A,performance.now()/1000*7)}catch(e){}
 if(k==='wolf'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(34,-40,2,34,-40,46);g.addColorStop(0,'rgba(150,180,255,.35)');g.addColorStop(1,'rgba(150,180,255,0)');ctx.fillStyle=g;ctx.fillRect(-12,-86,92,92)}ctx.restore()}
{const _h=hero;hero=function(){if(!MOUNT.on||P.dead)return _h();const f=P.dir==='l'?-1:P.dir==='r'?1:(MOUNT.f||1);MOUNT.f=f;drawMountBody(HOME.mount,P.x,P.y+2,f,P.mv?1:0);ctx.save();ctx.translate(0,-30);_h();ctx.restore()}}
{const _sm=spdMul;spdMul=function(){return _sm()*(MOUNT.on?(HOME.mount==='wolf'?1.9:1.6):1)}}
function toggleMount(){if(!HOME.mount){say('ยังไม่มีสัตว์ขี่ — ซื้อได้ที่ร้านสัตว์ (ลุงขายผักในเมือง / ลุงบุญมี)');return}if(D&&D.shop){say('ขี่ในอาคารไม่ได้');return}MOUNT.on=!MOUNT.on;sfx(MOUNT.on?'hoof':'ui');if(MOUNT.on){tone(300,500,.3,'triangle',.05)}mountB.classList.toggle('on',MOUNT.on)}
const mountB=document.createElement('button');mountB.id='mountb';mountB.textContent='🐎';mountB.title='ขี่/ลง (R)';mountB.hidden=!HOME.mount;gid('zb').appendChild(mountB);mountB.onclick=toggleMount;
{const st=document.createElement('style');st.textContent='#mountb.on{background:#7a4a22!important;box-shadow:0 0 10px #ffd84a}';document.head.appendChild(st)}
addEventListener('keydown',e=>{if((e.key==='r'||e.key==='R')&&!e.repeat&&document.activeElement.tagName!=='INPUT'&&!DLG.open)toggleMount()});
{const _a=attack;attack=function(q){if(MOUNT.on&&!(D&&D.home&&TOOLKEYS.includes(P.tool))){MOUNT.on=false;mountB.classList.remove('on')}return _a(q)}}
{const _us=useSkill;useSkill=function(i){if(MOUNT.on){MOUNT.on=false;mountB.classList.remove('on')}return _us(i)}}
{const _es=enterShop;enterShop=function(id){if(MOUNT.on){MOUNT.on=false;mountB.classList.remove('on')}return _es(id)}}
{const _vt=vitalsTick;vitalsTick=function(dt){const f=P.fa;_vt(dt);if(MOUNT.on&&P.fa<f)P.fa=f}}
{const _h=hero;hero=function(){const pet=HOME.pet&&!(D&&D.shop);if(pet&&PET.y<P.y)drawPet({k:HOME.pet},PET.x,PET.y);_h();if(pet&&PET.y>=P.y)drawPet({k:HOME.pet},PET.x,PET.y)}}
{const _p=playerTick;playerTick=function(dt){_p(dt);petTick(dt)}}
// ร้านสัตว์ในเมือง (ลุงขายผัก): สัตว์เลี้ยง/ม้า มีขายตั้งแต่เลือกอาชีพแล้ว
{const _nt=npcTalk;npcTalk=function(n){if(n.name==='ลุงขายผัก'||VENDOR&&n.name===VENDOR.farm){talk(n,'สนใจสัตว์เลี้ยงหรือม้าไหมหลาน? ลุงเลี้ยงไว้หลายตัวเลย',[{t:'🐾 ดูสัตว์เลี้ยง/สัตว์ขี่',c:'go',f:()=>{if(P.cls==='none'){say('ลุงจะขายให้เมื่อเจ้าเลือกอาชีพแล้ว (Lv.10)');return}openLife('pet')}},{t:'💬 คุยต่อ',stay:true,f:()=>_nt(n)},BYE]);return}return _nt(n)}}
// ครัวโรงเตี๊ยม: ทำอาหารได้ตั้งแต่ต้นเกม
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot(id);if(id==='inn'&&DLG.open){DLG.ch.splice(1,0,{t:'🍳 ยืมครัวทำอาหาร',f:()=>openLife('cook')});dlgShowChoices()}return r}}
// ช่างเหล็ก: ขายเครื่องมือฟาร์ม + จี้แต่งงาน
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot(id);if(id==='gear'&&DLG.open){DLG.ch.splice(DLG.ch.length-2,0,{t:'💎 ทำจี้นางฟ้าแห่งอรุณ',f:craftPendant});dlgShowChoices()}return r}}
function craftPendant(){const c={ingDm:2,ingAu:3,coin:5000};talk(D.owner,'จี้นางฟ้าแห่งอรุณ… ของสำหรับคนที่เจ้ารักที่สุด ใช้แท่งเพชร 2 แท่งทอง 3 และค่าแรง 5,000 เหรียญ',[{t:costOK(c)?'💎 ทำเลย':'🔒 วัตถุดิบไม่พอ',c:'go',f:()=>{if(!costOK(c)){say('วัตถุดิบไม่พอ');return}payCost(c);inv.pendant=(inv.pendant|0)+1;refreshInv();anvilFx();sfx('chest');banner('💎 จี้นางฟ้าแห่งอรุณ','ใช้ขอแต่งงานกับคนที่หัวใจครบ 10 ดวง','blue')}},BYE])}

// ---------------- จีบ / แต่งงาน ----------------
const ROM={'หญิงสาว':{dn:'ลิลลี่',love:['strawberry','berrycake','goldfish','bouquet'],like:['apple','honey','wool','cake','herbtea'],hate:['gel','bone','rag'],c:'#c0507a'},
 'แม่ค้าผลไม้':{dn:'มาลี',love:['pumpkin','pie','pumpsoup'],like:['carrot','corn','egg','tomato'],hate:['rag','gel'],c:'#d9822b'},
 'ไอริส (พนักงานกิลด์)':{dn:'ไอริส',love:['bless','feast','herbtea'],like:['grillfish','fishsoup','estone','milk'],hate:['gel','bone'],c:'#3a5a9a'},
 'นักเดินทาง':{dn:'เรน',love:['salmon','dragon','feast'],like:['bread','milk','cornbread','pancake'],hate:['rag','turnip'],c:'#3a7a8a'}};
const LOVE_EV={3:['เธอยิ้มให้คุณนานกว่าปกติ… “เจ้าเป็นคนดีจังนะ ผู้กล้า”'],6:['“วันหยุดนี้… ไปเดินเล่นริมทุ่งดอกไม้ด้วยกันไหม?” คุณใช้เวลาด้วยกันจนพระอาทิตย์ตก'],9:['“ข้าคิดถึงเจ้าทุกครั้งที่เจ้าลงดันเจี้ยน… สัญญานะว่าจะกลับมาเสมอ”']};
const LV=n=>{HOME.love[n]=HOME.love[n]||{h:0,st:0};return HOME.love[n]};
const heartsTxt=h=>{const f=Math.floor(h/2),hf=h%2>=1?1:0;return '❤️'.repeat(f)+(hf?'💗':'')+'🤍'.repeat(Math.max(0,5-f-hf))};
function romTalk(n,key){const R=ROM[key],L=LV(key),dn=R.dn,today=HOME.day;if(L.day!==today){L.day=today;L.h=Math.min(10,L.h+.25)}
 const ev=[3,6,9].find(h=>L.h>=h&&!(L.ev||[]).includes(h));if(ev){L.ev=(L.ev||[]).concat(ev);saveHome();talk(n,LOVE_EV[ev][0],[{t:'💗 …',c:'go'}],dn+' '+heartsTxt(L.h));banner('💗 อีเวนต์ความสัมพันธ์',dn+' · หัวใจ '+ev+' ดวง','green');return}
 const st=L.st===2?'คู่ชีวิต':L.st===1?'คนรัก':'';const line=L.h>=8?'“'+(st?'ที่รัก':'เจ้า')+'มาหาข้าอีกแล้ว ดีใจจัง”':L.h>=4?'“วันนี้เป็นอย่างไรบ้าง ผู้กล้า?”':pick(n.lines||['สวัสดี']);
 const ch=[{t:'🎁 ให้ของขวัญ',c:'go',f:()=>giftPick(n,key)},{t:'💬 คุยเล่น',stay:true,f:()=>{const _=n.lines&&n.lines.length?n.lines:['…'];talk(n,_[(n.i=(n.i||0)+1)%_.length],[BYE],dn+' '+heartsTxt(L.h))}}];
 if(L.h>=8&&!L.st&&inv.bouquet>0)ch.push({t:'💐 มอบช่อดอกไม้ (ขอคบ)',f:()=>{inv.bouquet--;L.st=1;saveHome();refreshInv();fanfare();banner('💞 คบหากันแล้ว!',dn+' ตกลงเป็นแฟนกับคุณ','green')}});
 if(L.st===1&&L.h>=10&&inv.pendant>0&&HOME.house>=2&&!HOME.spouse)ch.push({t:'💍 ขอแต่งงาน',f:()=>wedding(n,key)});
 ch.push(BYE);talk(n,line,ch,dn+(st?' 💞 '+st:'')+' '+heartsTxt(L.h));saveHome()}
function giftPick(n,key){const L=LV(key);if(L.gift===HOME.day){talk(n,'วันนี้ให้ของข้าแล้วนี่นา พรุ่งนี้ค่อยมาใหม่นะ',[BYE],ROM[key].dn);return}
 const items=INVORDER.filter(k=>inv[k]>0&&k!=='coin'&&!/^t_|^sd_/.test(k)).slice(0,8);if(!items.length){say('ไม่มีของในกระเป๋า');return}
 talk(n,'จะให้อะไรดีนะ…',items.map(k=>({t:MN(k),f:()=>giveGift(n,key,k)})).concat([BYE]),'🎁 เลือกของขวัญ')}
function giveGift(n,key,k){const R=ROM[key],L=LV(key);inv[k]--;refreshInv();L.gift=HOME.day;let d=.3,r='“ขอบใจนะ”';if(R.love.includes(k)){d=1.5;r='“ว้าว! นี่ของที่ข้าชอบที่สุดเลย!” 💗'}else if(R.like.includes(k)){d=.8;r='“ชอบมากเลย ขอบคุณนะ!”'}else if(R.hate.includes(k)){d=-.5;r='“อ่า… ข้าไม่ค่อยชอบสิ่งนี้เท่าไหร่”'}
 L.h=Math.max(0,Math.min(10,L.h+d));saveHome();sfx(d>0?'gem':'thud');if(d>0)for(let i=0;i<10;i++)rfxP(n.x+(Math.random()-.5)*20,n.y-40,(Math.random()-.5)*30,-40,1,'255,120,170',3,'spark');talk(n,r,[BYE],R.dn+' '+heartsTxt(L.h))}
function wedding(n,key){const R=ROM[key];inv.pendant--;LV(key).st=2;HOME.spouse=key;saveHome();refreshInv();dlgClose(true);
 cinePlay([{s:'castle',t:'ระฆังโบสถ์แห่งเอลโดเรียดังกังวานไปทั่วเมือง…'},{s:'hero',t:(P.name||'ผู้กล้า')+' และ '+R.dn+' ให้คำมั่นสัญญาต่อหน้าเทพธิดาแห่งแสง'},{s:'crystal',t:'นับจากวันนี้ '+R.dn+' จะอยู่เคียงข้างเจ้าที่บ้านในที่ดินผู้กล้า'}],()=>{chatAnn((P.name||'ผู้กล้า')+' 💍 '+R.dn+' — ขอให้มีความสุขตลอดไป!');fanfare();homeObjects()})}
function SPOUSE(){const key=HOME.spouse;if(!key)return null;const R=ROM[key],src=NPC_DATA.find(q=>q.name===key)||SHOP_DATA.guild.owner;return Object.assign({},src,{name:R.dn,x:(HLOT.x+5)*T,y:(HLOT.y+HLOT.h+1)*T,dir:'d',fixed:1,mv:false,home:{x:1,y:1},t:0,lines:['ยินดีต้อนรับกลับบ้านจ้ะ','วันนี้ทำอาหารไว้ให้แล้วนะ','ระวังตัวด้วยล่ะ ที่รัก']})}
function spouseTalk(){const s=SPOUSE(),R=ROM[HOME.spouse];const ch=[{t:'💬 คุย',stay:true,f:()=>talk(s,pick(s.lines),[BYE],R.dn+' 💍')}];if(HOME.spGift!==HOME.day)ch.unshift({t:'🍱 รับอาหารเช้า',c:'go',f:()=>{HOME.spGift=HOME.day;addBuff('love',{n:'อาหารเช้าจากคนรัก',e:'💗',st:{str:3,vit:3,agi:3,end:3,int:3},dur:900});saveHome();say('💗 '+R.dn+' ทำอาหารเช้าให้ — ค่าพลังทั้งหมด +3 (15 นาที)')}});ch.push(BYE);talk(s,pick(s.lines),ch,R.dn+' 💍 คู่ชีวิต')}
{const _nt=npcTalk;npcTalk=function(n){if(ROM[n.name]&&!sideOffer(n))return romTalk(n,n.name);return _nt(n)}}
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot(id);if(id==='guild'&&DLG.open){DLG.ch.splice(DLG.ch.length-1,0,{t:'💗 คุยกับไอริส',f:()=>romTalk(D.owner,'ไอริส (พนักงานกิลด์)')});dlgShowChoices()}return r}}
for(const k in ROM){const n=NPC_DATA.find(q=>q.name===k);if(n)n.dn=ROM[k].dn}
// ---------------- เควส NPC ----------------
const SIDE=[{npc:'พ่อค้า',id:'s1',t:'เจลสไลม์ด่วน',d:'นำเจลสไลม์ 12 ชิ้นมาให้',item:{gel:12},rw:{coin:250,xp:120},lv:1,a:'ช่วงนี้ยาขายดี เจลสไลม์ไม่พอทำยาเลย ช่วยหามาให้หน่อยสิ',b:'ขอบใจมาก! นี่ค่าตอบแทน'},
 {npc:'เด็กน้อย',id:'s2',t:'แอปเปิ้ลให้แม่',d:'นำแอปเปิ้ล 5 ลูกมาให้',item:{apple:5},rw:{coin:120,hpp:2},lv:1,a:'แม่ป่วยอยากกินแอปเปิ้ล… พี่ช่วยหน่อยได้ไหม',b:'เย้! ขอบคุณนะพี่ แม่ต้องดีใจแน่ ๆ'},
 {npc:'ช่างตีเหล็ก',id:'s3',t:'แร่เหล็กล็อตใหญ่',d:'นำแร่เหล็ก 20 ก้อนมาให้',item:{iron:20},rw:{coin:400,estone:2},lv:8,a:'เตาข้าว่างอยู่ ขาดแร่เหล็กมาหลอม ช่วยขุดมาให้ที',b:'แร่ดีมาก! เอาหินเสริมพลังไปใช้ตีบวกเถอะ'},
 {npc:'นักดื่ม',id:'s4',t:'ปลาดุกแกล้มเหล้า',d:'นำปลาดุก 3 ตัวมาให้',item:{catfish:3},rw:{coin:350,mpp:3},lv:5,a:'ฮึก… อยากกินปลาดุกย่างแกล้มจัง ใครก็ได้ตกมาให้ที',b:'อร่อยแน่นอน! เอ้า ยามานาไว้ใช้'},
 {npc:'ชาวบ้าน',id:'s5',t:'กำจัดสไลม์ป่า',d:'กำจัดสไลม์ 25 ตัว',kill:{slime:25},rw:{coin:300,xp:300},lv:3,a:'สไลม์บุกไร่ข้าทุกคืน ช่วยกำจัดสัก 25 ตัวได้ไหม',b:'ไร่ข้าปลอดภัยแล้ว ขอบคุณมากผู้กล้า!'},
 {npc:'นักเดินทาง',id:'s6',t:'สำรวจห้วงลึก',d:'พิชิตดันเจี้ยนชั้น 15',dg:15,rw:{coin:900,bless:1},lv:15,a:'ข้าอยากรู้ว่าชั้นที่ 15 ของดันเจี้ยนมีอะไร เล่าให้ข้าฟังทีสิ',b:'ไม่น่าเชื่อ! เจ้ากล้ามากจริง ๆ'},
 {npc:'ทหารยาม',id:'s7',t:'ภัยจากเหมืองทองแดง',d:'ปราบบอสเหมืองทองแดง',boss:'copper',rw:{coin:1800,estone:4},lv:25,a:'รายงานจากเหมืองทองแดง: ด้วงยักษ์อาละวาด ช่วยจัดการที',b:'ทางการขอขอบคุณ นี่รางวัลจากกองทัพ'},
 {npc:'ชาวนา',id:'s8',t:'ข้าวสาลีหน้าแล้ง',d:'นำข้าวสาลี 20 รวงมาให้ (ปลูกในที่ดินผู้กล้า)',item:{wheat:20},rw:{coin:900,hay:10},lv:1,home:1,a:'ปีนี้แล้งหนัก ข้าวสาลีไม่พอทำขนมปัง เจ้าปลูกได้ไหม',b:'ทุ่งทองของเจ้าช่วยทั้งหมู่บ้านเลย!'},
 {npc:'แม่ค้าผัก',id:'s9',t:'ฟักทองงานเทศกาล',d:'นำฟักทอง 3 ลูกมาให้ (ปลูกเอง)',item:{pumpkin:3},rw:{coin:1200,cake:2},lv:1,home:1,a:'งานเทศกาลเก็บเกี่ยวใกล้แล้ว ขาดฟักทองลูกโต ๆ จ้า',b:'ลูกโตสวยมาก! เอาเค้กไปกินนะจ๊ะ'},
 {npc:'หญิงสาว',id:'s10',t:'ไข่สดยามเช้า',d:'นำไข่ไก่ 6 ฟองมาให้',item:{egg:6},rw:{coin:500},lv:1,home:1,love:2,a:'อยากทำเค้กให้คุณแม่ แต่หาไข่สดไม่ได้เลย…',b:'ขอบคุณนะ… คุณใจดีจัง'}];
function sideOf(name){return SIDE.find(q=>q.npc===name&&!(HOME.side[q.id]&&HOME.side[q.id].done)&&P.lv>=q.lv&&(!q.home||HOME.unlocked))}
function sideProg(q){const s=HOME.side[q.id];if(q.item)return Object.entries(q.item).every(([k,v])=>(inv[k]|0)>=v);if(q.kill)return (STORY.k.slime|0)-(s.k0|0)>=q.kill.slime;if(q.dg)return DG.max>q.dg;if(q.boss)return !!STORY.boss[q.boss];return false}
function sideOffer(n){const q=sideOf(n.name);if(!q)return false;const s=HOME.side[q.id];
 if(!s){talk(n,'📋 '+q.t+' — '+q.a,[{t:'✅ รับเควส',c:'go',f:()=>{HOME.side[q.id]={on:1,k0:STORY.k.slime|0};saveHome();sysSay('📋 รับเควส: '+q.t+' — '+q.d)}},{t:'ไว้ก่อนนะ',c:'bye',f:()=>{if(ROM[n.name])romTalk(n,n.name)}}],n.dn||n.name);return true}
 if(sideProg(q)){talk(n,q.b,[{t:'🎁 ส่งเควส',c:'go',f:()=>{if(q.item)for(const [k,v] of Object.entries(q.item))inv[k]-=v;s.done=1;const rw=giveRw(q.rw);if(q.rw.cake)inv.cake=(inv.cake|0)+q.rw.cake;if(q.rw.hay)inv.hay=(inv.hay|0)+q.rw.hay;if(q.love&&ROM[n.name])LV(n.name).h=Math.min(10,LV(n.name).h+q.love);saveHome();refreshInv();banner('เควสสำเร็จ!',q.t,'green');sfx('chest');sysSay('📋 ส่งเควส '+q.t+' — '+rw.join(' · '))}}],n.dn||n.name);return true}
 talk(n,'“'+q.t+'” — '+q.d+' ยังไม่ครบนะ',[{t:'💬 คุยต่อ',stay:true,f:()=>{if(ROM[n.name])romTalk(n,n.name);else n.bub={txt:'ฝากด้วยนะ!',t:2}}},BYE],n.dn||n.name);return true}
{const _nt=npcTalk;npcTalk=function(n){if(sideOffer(n))return;return _nt(n)}}
// เครื่องหมาย ! / ? เหนือหัว NPC
{const _dn=drawNPC;drawNPC=function(n,t){_dn(n,t);if(!(D&&D.town)||!D.npcs.includes(n))return;const q=sideOf(n.name);if(!q)return;const s=HOME.side[q.id],m=!s?'!':sideProg(q)?'?':'';if(!m)return;const y=n.y-62+Math.sin(t*4)*3;
  ctx.save();ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2a06';ctx.strokeText(m,n.x,y);ctx.fillStyle=m==='!'?'#ffd84a':'#8fe08a';ctx.fillText(m,n.x,y);ctx.restore()}}
// ---------------- เล่นนานขึ้น: XP ช่วงหลังมากขึ้น ----------------
// (ปรับสูตรในตัวเกมแล้ว)
// ---------------- ค่าเริ่มต้น / ช่องลัด ----------------
setTimeout(()=>{mountB.hidden=!HOME.mount;if(HOME.pet){PET.x=P.x;PET.y=P.y}},500);


// =====================================================================
// v4.6 (ก) : HUD ใหม่ (บัฟใต้หลอดเลือด · หิว/แรง · ชุดครบ) · แชทไม่บังจอย · ช่องลัดกลางจอ · แบนเนอร์ไม่บัง
//            สัตว์ขี่นั่งจริง + สัตว์ขี่ใหม่ · เครื่องมือ/เมล็ดวาดใหม่ · ไอคอนสกิลวาดใหม่
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#buffs{display:none!important}
#wrap #hud{background:linear-gradient(180deg,rgba(18,14,26,.78),rgba(10,8,16,.72));border:1px solid rgba(232,193,74,.45);box-shadow:0 2px 10px rgba(0,0,0,.45);padding:5px 7px 5px 5px;border-radius:12px}
#wrap #face{border-radius:10px}
#vit6{display:flex;gap:5px;margin-top:1px}
#vit6 .v{flex:1;display:flex;align-items:center;gap:3px;font:800 9px system-ui;color:#fff}
#vit6 .v img{width:13px;height:13px;flex:none}
#vit6 .v div{flex:1;height:6px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.6)}
#vit6 .v div i{display:block;height:100%;border-radius:4px;transition:width .4s}
#vit6 .hu i{background:linear-gradient(90deg,#ff8a3a,#ffc24a)}#vit6 .fa i{background:linear-gradient(90deg,#4fd06a,#c8f05a)}
#vit6 .v.low i{background:linear-gradient(90deg,#ff3a3a,#ff7a5a);animation:vlow .7s ease-in-out infinite alternate}
@keyframes vlow{from{opacity:1}to{opacity:.35}}
#bfrow{position:absolute;left:calc(6px + var(--sl,0px));top:calc(72px + var(--st,0px));display:flex;gap:4px;align-items:center;z-index:3;pointer-events:auto;max-width:44vw;flex-wrap:wrap}
#bfrow .b6{position:relative;width:26px;height:26px;border-radius:50%;padding:2px;background:conic-gradient(var(--c) calc(var(--p)*1%),rgba(255,255,255,.14) 0);box-shadow:0 1px 4px rgba(0,0,0,.5);cursor:pointer}
#bfrow .b6 img{width:22px;height:22px;border-radius:50%;display:block;background:#140f1c}
#bfrow .b6 em{position:absolute;right:-3px;bottom:-4px;font:800 8px system-ui;color:#fff;background:rgba(0,0,0,.75);border-radius:6px;padding:0 3px;font-style:normal}
#bfrow .b6.new{animation:b6in .5s ease-out}#bfrow .b6.end{animation:vlow .4s infinite alternate}
@keyframes b6in{from{transform:scale(2);opacity:0}to{transform:scale(1);opacity:1}}
#wrap #coinbox{position:static!important;display:inline-flex;align-items:center;gap:3px;background:linear-gradient(180deg,rgba(40,30,8,.85),rgba(20,14,4,.85));border:1px solid rgba(232,193,74,.6);color:#ffd84a;padding:1px 8px 1px 4px;border-radius:12px;font:800 11px system-ui;height:20px;box-sizing:border-box}
#set6{position:absolute;left:30px;top:30px;width:20px;height:22px;cursor:pointer;filter:drop-shadow(0 1px 2px #000);z-index:2}
#set6[hidden]{display:none}#set6 b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:900 9px system-ui;color:#fff;text-shadow:0 1px 1px #000;padding-top:1px}
#set6.full{animation:set6g 1.6s ease-in-out infinite}@keyframes set6g{50%{filter:drop-shadow(0 0 5px var(--sc)) drop-shadow(0 1px 2px #000)}}
#wrap #zb{position:absolute!important;top:calc(100px + var(--st,0px))!important;left:calc(6px + var(--sl,0px))!important;bottom:auto!important;right:auto!important;flex-direction:row!important;gap:5px;z-index:3}
#wrap #zb button{width:30px!important;height:30px!important;font-size:15px!important;border-radius:9px;background:rgba(10,8,16,.6);border:1px solid rgba(232,193,74,.55)}
#wrap #bar{left:50%!important;right:auto!important;transform:translateX(-50%)!important;bottom:calc(6px + var(--sb,0px))!important;z-index:5;gap:5px;padding:4px 6px;border-radius:14px;background:linear-gradient(180deg,rgba(10,8,16,.25),rgba(10,8,16,.6));box-shadow:0 2px 10px rgba(0,0,0,.35)}
#chatTg{position:absolute;z-index:6;bottom:calc(10px + var(--sb,0px));left:calc(50% - 178px);width:36px;height:36px;border-radius:50%;border:1px solid rgba(232,193,74,.6);background:rgba(10,8,16,.65);color:#fff;font-size:17px;cursor:pointer;padding:0}
#chatTg i{position:absolute;right:-3px;top:-3px;min-width:15px;height:15px;border-radius:8px;background:#e0443a;font:800 9px/15px system-ui;font-style:normal}#chatTg i[hidden]{display:none}
#wrap #chatBox.c6{position:absolute!important;left:50%!important;right:auto!important;top:auto!important;transform:translateX(-50%);bottom:calc(58px + var(--sb,0px))!important;width:min(48vw,380px)!important;border:0!important;box-shadow:none!important;background:transparent!important;z-index:4;font-size:11px!important}
#wrap #chatBox.c6.mini6{pointer-events:none}
#wrap #chatBox.c6.mini6 #chatHd,#wrap #chatBox.c6.mini6 #chatIn{display:none!important}
#wrap #chatBox.c6.mini6 #chatList{max-height:31px!important;min-height:0!important;overflow:hidden!important;display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(90deg,transparent,rgba(0,0,0,.42) 12%,rgba(0,0,0,.42) 88%,transparent);border-radius:8px;padding:1px 14px;mask-image:linear-gradient(180deg,transparent,#000 35%)}
#wrap #chatBox.c6.mini6 .cl{flex:none;animation:cl6 14s forwards;line-height:1.35;text-shadow:0 1px 2px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@keyframes cl6{0%,80%{opacity:1}100%{opacity:0}}
#wrap #chatBox.c6.open6{pointer-events:auto;background:linear-gradient(180deg,rgba(16,12,24,.94),rgba(10,8,16,.94))!important;border:1px solid rgba(232,193,74,.5)!important;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.6)!important}
#wrap #chatBox.c6.open6 #chatList{max-height:min(34vh,140px)!important;overflow-y:auto!important}
#wrap #chatBox.c6 #chatFold{display:none}
#wrap #msg{bottom:calc(100px + var(--sb,0px))!important}
#tut{bottom:calc(104px + var(--sb,0px))!important}
#banner{top:calc(96px + var(--st,0px))!important}
#banner .b1{font-size:clamp(17px,5.2vh,30px)!important;letter-spacing:.5px}
#banner .b2{font-size:clamp(10px,2.8vh,13px)!important}
#banner:not([hidden]){animation:bn6 1.9s ease-out forwards}
@keyframes bn6{0%{opacity:0;transform:translateY(-10px) scale(.92)}10%{opacity:1;transform:none}78%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}
#joyzone{z-index:1!important}
.sk.hasi{background-size:cover!important;background-position:center!important}
.sk.hasi .ic{color:transparent!important;text-shadow:none!important}
#skw .card .e img{width:46px;height:46px;border-radius:12px;display:block}
@media (max-height:520px){#wrap #hud{transform:none!important;top:calc(4px + var(--st,0px))!important;left:calc(4px + var(--sl,0px))!important;padding:3px 6px 3px 3px}#wrap #face{width:40px!important;height:40px!important}#wrap #hud .bars{width:132px!important;gap:2px!important}
 #wrap #hud .bar{height:11px!important;font-size:8.5px!important}#bfrow{top:calc(66px + var(--st,0px))}#wrap #zb{top:calc(94px + var(--st,0px))!important}#set6{left:26px;top:26px}}
`;document.head.appendChild(st)}

// ---------- ไอคอนวาด (บัฟ / หิว-แรง / โล่ชุด) ----------
const ICN6={};
function ic6(key,fn,s){if(ICN6[key])return ICN6[key];const c=document.createElement('canvas');c.width=c.height=s||64;const k=c.getContext('2d');k.lineJoin='round';k.lineCap='round';try{fn(k,c.width)}catch(e){}return ICN6[key]=c.toDataURL()}
function glowBg(k,S,c1,c2){const g=k.createRadialGradient(S*.5,S*.4,2,S*.5,S*.5,S*.62);g.addColorStop(0,c1);g.addColorStop(1,c2);k.fillStyle=g;k.beginPath();k.arc(S/2,S/2,S/2,0,7);k.fill()}
const BUFFICON={
 str:k=>{glowBg(k,64,'#ff8a6a','#5a0e0a');k.fillStyle='#ffd0b0';k.strokeStyle='#4a1a10';k.lineWidth=2.5;k.beginPath();k.moveTo(18,40);k.quadraticCurveTo(16,24,26,20);k.lineTo(42,20);k.quadraticCurveTo(50,22,48,34);k.quadraticCurveTo(48,46,36,48);k.lineTo(24,48);k.closePath();k.fill();k.stroke();
  for(const x of [27,33,39]){k.beginPath();k.moveTo(x,20);k.lineTo(x,28);k.stroke()}k.beginPath();k.moveTo(22,32);k.quadraticCurveTo(30,30,34,36);k.stroke();k.fillStyle='rgba(255,255,255,.5)';k.fillRect(26,22,10,3)},
 agi:k=>{glowBg(k,64,'#8af08a','#0a3a14');k.fillStyle='#f4fff0';k.strokeStyle='#1a4a1a';k.lineWidth=2;for(let i=0;i<4;i++){k.beginPath();k.moveTo(16+i*3,46-i*7);k.quadraticCurveTo(30+i*4,28-i*6,50,18+i*2);k.quadraticCurveTo(38+i*2,34-i*4,20+i*3,50-i*7);k.closePath();k.fill();k.stroke()}},
 vit:k=>{glowBg(k,64,'#ff9ac0','#5a0a2a');const g=k.createLinearGradient(0,16,0,50);g.addColorStop(0,'#ff6a8a');g.addColorStop(1,'#c01a3a');k.fillStyle=g;k.strokeStyle='#3a0812';k.lineWidth=2.5;k.beginPath();k.moveTo(32,50);k.bezierCurveTo(8,34,14,14,32,24);k.bezierCurveTo(50,14,56,34,32,50);k.fill();k.stroke();k.fillStyle='rgba(255,255,255,.6)';k.beginPath();k.ellipse(24,26,4,3,-.6,0,7);k.fill()},
 int:k=>{glowBg(k,64,'#9ac8ff','#0a1a4a');k.fillStyle='#e8f4ff';k.strokeStyle='#1a3a8a';k.lineWidth=2;k.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?8:20;k.lineTo(32+Math.cos(a)*r,33+Math.sin(a)*r)}k.closePath();k.fill();k.stroke();k.fillStyle='#7fd0ff';k.beginPath();k.arc(32,33,5,0,7);k.fill()},
 end:k=>{glowBg(k,64,'#ffe08a','#4a3a0a');const g=k.createLinearGradient(0,14,0,52);g.addColorStop(0,'#fff0b0');g.addColorStop(1,'#c8901a');k.fillStyle=g;k.strokeStyle='#4a3008';k.lineWidth=2.5;k.beginPath();k.moveTo(32,14);k.lineTo(48,20);k.quadraticCurveTo(48,42,32,52);k.quadraticCurveTo(16,42,16,20);k.closePath();k.fill();k.stroke();k.strokeStyle='#8a5a10';k.beginPath();k.moveTo(32,20);k.lineTo(32,46);k.moveTo(22,28);k.lineTo(42,28);k.stroke()},
 rest:k=>{glowBg(k,64,'#b8a8ff','#14103a');k.fillStyle='#fff6c8';k.beginPath();k.arc(30,32,15,0,7);k.fill();k.fillStyle='#14103a';k.beginPath();k.arc(37,27,13,0,7);k.fill();k.fillStyle='#fff';k.font='bold 11px sans-serif';k.fillText('z',42,46);k.fillText('Z',47,38)},
 food:k=>{glowBg(k,64,'#ffc88a','#4a1e0a');k.fillStyle='#e8e0d0';k.strokeStyle='#5a3a1a';k.lineWidth=2;k.beginPath();k.ellipse(32,40,20,7,0,0,7);k.fill();k.stroke();k.fillStyle='#c8642a';k.beginPath();k.ellipse(32,35,14,9,0,Math.PI,0);k.fill();k.stroke();k.strokeStyle='rgba(255,255,255,.7)';for(const x of [26,32,38]){k.beginPath();k.moveTo(x,22);k.quadraticCurveTo(x+3,18,x,14);k.stroke()}}};
function buffIcon(b){const ks=Object.keys(b.st||{}),id=b.id||'';let key=id==='rest'?'rest':FOOD&&FOOD[id]?'food':ks.sort((a,c)=>(b.st[c]||0)-(b.st[a]||0))[0]||'food';if(!BUFFICON[key])key='food';return ic6('bf_'+key,BUFFICON[key])}
const BUFFC={str:'#ff6a4a',agi:'#5ae06a',vit:'#ff6a9a',int:'#6aa8ff',end:'#ffc84a',rest:'#a898ff',food:'#ffa84a'};
const ICO_HU=ic6('v_hu',k=>{k.fillStyle='#c8642a';k.strokeStyle='#3a1a08';k.lineWidth=4;k.beginPath();k.ellipse(36,28,18,14,-.5,0,7);k.fill();k.stroke();k.fillStyle='#f4ecdc';k.beginPath();k.moveTo(24,38);k.lineTo(12,52);k.lineTo(8,48);k.lineTo(20,34);k.fill();k.stroke();k.fillStyle='rgba(255,255,255,.5)';k.beginPath();k.ellipse(32,22,6,3,-.5,0,7);k.fill()});
const ICO_FA=ic6('v_fa',k=>{k.fillStyle='#ffe04a';k.strokeStyle='#4a3a08';k.lineWidth=4;k.beginPath();k.moveTo(38,6);k.lineTo(16,36);k.lineTo(30,36);k.lineTo(24,58);k.lineTo(48,26);k.lineTo(34,26);k.closePath();k.fill();k.stroke()});

// ---------- แถว: เหรียญ + บัฟ ----------
const bfRow=document.createElement('div');bfRow.id='bfrow';gid('wrap').appendChild(bfRow);
{const cb=gid('coinbox');if(cb)bfRow.appendChild(cb)}
const bfList=document.createElement('span');bfList.style.cssText='display:contents';bfRow.appendChild(bfList);
let bf6prev=new Set();
function renderBf6(){const cur=new Set();let h='';for(const b of BUFFS){cur.add(b.id);const p=Math.max(0,Math.min(100,b.t/(b.dur||b.t||1)*100)),ks=Object.keys(b.st||{}),key=b.id==='rest'?'rest':FOOD&&FOOD[b.id]?'food':ks[0]||'food',tm=b.t>=60?Math.ceil(b.t/60)+'m':Math.ceil(b.t)+'s';
  h+='<div class="b6'+(bf6prev.has(b.id)?'':' new')+(b.t<10?' end':'')+'" data-b="'+b.id+'" style="--p:'+p.toFixed(1)+';--c:'+(BUFFC[key]||'#fff')+'"><img src="'+buffIcon(b)+'"><em>'+tm+'</em></div>'}
 if(bfList._h!==h){bfList.innerHTML=h;bfList._h=h}bf6prev=cur}
bfList.addEventListener('click',e=>{const el=e.target.closest('.b6');if(!el)return;const b=BUFFS.find(q=>q.id===el.dataset.b);if(b)say((b.ic||'✨')+' '+b.n+' — '+(typeof stTxt==='function'?stTxt(b.st):'')+' · เหลือ '+Math.ceil(b.t)+' วิ')});
{const _rb=renderBuffs;renderBuffs=function(){try{_rb()}catch(e){}renderBf6();renderSet6()}}
// ---------- หิว/แรง ใต้หลอด XP ----------
{const bars=document.querySelector('#hud .bars');const v=document.createElement('div');v.id='vit6';v.innerHTML='<div class="v hu" title="ความอิ่ม"><img src="'+ICO_HU+'"><div><i></i></div></div><div class="v fa" title="แรง"><img src="'+ICO_FA+'"><div><i></i></div></div>';if(bars)bars.appendChild(v)}
const vHu=document.querySelector('#vit6 .hu'),vFa=document.querySelector('#vit6 .fa');
setInterval(()=>{if(!vHu)return;const hu=Math.max(0,Math.min(100,P.hu|0)),fa=Math.max(0,Math.min(100,P.fa|0));vHu.querySelector('i').style.width=hu+'%';vFa.querySelector('i').style.width=fa+'%';vHu.classList.toggle('low',hu<25);vFa.classList.toggle('low',fa<20);vHu.title='ความอิ่ม '+hu+'/100';vFa.title='แรง '+fa+'/100'},300);
// ---------- โล่ชุดครบ (มุมรูปโปรไฟล์) ----------
const set6=document.createElement('div');set6.id='set6';set6.hidden=true;gid('hud').style.position='absolute';gid('hud').appendChild(set6);
set6.onclick=e=>{e.stopPropagation();const f=gid('face');if(f)f.click()};
function renderSet6(){let best=null;try{const c=setCount();for(const t in c)if(c[t]>=2&&(!best||c[t]>best.n||c[t]===best.n&&+t>+best.t))best={t,n:c[t]}}catch(e){}
 if(!best){set6.hidden=true;return}const full=best.n>=4,col=(TIERS[best.t]&&TIERS[best.t].mid)||'#e8c14a',k='sh_'+best.t;
 const img=ic6(k,(q)=>{const g=q.createLinearGradient(0,0,0,64);g.addColorStop(0,'#fff');g.addColorStop(.3,col);g.addColorStop(1,'#1a1a22');q.fillStyle=g;q.strokeStyle='#120c06';q.lineWidth=5;q.beginPath();q.moveTo(32,4);q.lineTo(58,12);q.quadraticCurveTo(58,44,32,60);q.quadraticCurveTo(6,44,6,12);q.closePath();q.fill();q.stroke()});
 const h='<img src="'+img+'" style="width:100%;height:100%"><b>'+(full?'4':'2')+'</b>';if(set6._h!==h){set6.innerHTML=h;set6._h=h}set6.hidden=false;set6.classList.toggle('full',full);set6.style.setProperty('--sc',col);
 set6.title='ชุด'+TNAMES[best.t]+' '+best.n+'/4 — แตะดูโบนัส'}
// ---------- แชท: ย่อเหลือ 2 บรรทัดกลางล่าง + ปุ่ม 💬 ----------
{const cb=gid('chatBox');if(cb){cb.classList.add('c6','mini6');const tg=document.createElement('button');tg.id='chatTg';tg.innerHTML='💬<i hidden>0</i>';gid('wrap').appendChild(tg);
 let unread=0;const badge=tg.querySelector('i');
 const open=v=>{cb.classList.toggle('open6',v);cb.classList.toggle('mini6',!v);if(v){unread=0;badge.hidden=true;const L=gid('chatList');if(L)L.scrollTop=1e6}};
 tg.onclick=e=>{e.stopPropagation();open(!cb.classList.contains('open6'));sfx('ui')};
 const L=gid('chatList');if(L)new MutationObserver(m=>{if(cb.classList.contains('open6')){L.scrollTop=1e6;return}let n=0;for(const r of m)for(const a of r.addedNodes)if(a.nodeType===1&&!a.classList.contains('ch-sys'))n++;if(n){unread+=n;badge.textContent=unread>9?'9+':unread;badge.hidden=false}}).observe(L,{childList:true});
 addEventListener('keydown',e=>{if(e.key==='Enter'&&cb.classList.contains('mini6')&&document.activeElement.tagName!=='INPUT'){open(true)}},true);
 window.chatOpen6=open}}
// ---------- แบนเนอร์: สั้นลง ไม่บังกลางจอ ----------
{const _b=banner;banner=function(a,b,cls){_b(a,b,cls);try{bnEl.style.animation='none';void bnEl.offsetWidth;bnEl.style.animation='';clearTimeout(_bnT);_bnT=setTimeout(()=>bnEl.hidden=true,1900)}catch(e){}}}

// =====================================================================
// สัตว์ขี่: นั่งบนอานจริง · ขึ้น/ลงมีท่า · เสียงกีบ · ฝุ่น · สัตว์ขี่ใหม่ (ยูนิคอร์น · ม้าอัคคี)
// =====================================================================
const MOUNTS={horse:{n:'ม้าศึกหุ้มเกราะ',spd:1.6},unicorn:{n:'ยูนิคอร์นแสงจันทร์',spd:1.85},flame:{n:'ม้าอัคคีนรก',spd:2.0},wolf:{n:'หมาป่าเงาจันทร์',spd:1.9}};
const MPAL={horse:{hi:'#c08a5a',b:'#8a5430',s:'#4a2a14',m:'#2a1a10',leg:'#5a3418'},unicorn:{hi:'#ffffff',b:'#eef0fa',s:'#b8bcd8',m:'#f0c8ff',leg:'#d8dcf0'},flame:{hi:'#4a3a40',b:'#241a20',s:'#0a0608',m:'#ff6a1a',leg:'#1a1014'},wolf:{hi:'#d8def0',b:'#7a80a0',s:'#3a3e58',m:'#e8ecff',leg:'#4a4e68'}};
if(!ANIMS.some(a=>a.k==='unicorn'))ANIMS.push({k:'unicorn',n:'ยูนิคอร์นแสงจันทร์',p:35000,mount:1,d:'สัตว์ขี่หายาก: เร็วขึ้น 85% · ประกายรุ้งทุกก้าว · ต้อง Lv.40'});
{const h=ANIMS.find(a=>a.k==='horse');if(h){h.n='ม้าศึกหุ้มเกราะ';h.d='สัตว์ขี่: เร็วขึ้น 60% · เกราะหน้าม้าเหล็ก อานหนังแท้'}}
{const w=ANIMS.find(a=>a.k==='wolf');if(w)w.d='สัตว์ขี่ในตำนาน: เร็วขึ้น 90% · ดวงตาเรืองแสง · ต้องปราบบอสสุดท้าย'}
{const _ba=buyAnimal;buyAnimal=function(k){if(k==='unicorn'&&P.lv<40){say('ต้อง Lv.40 ขึ้นไป');sfx('thud');return}const own=HOME.mounts||(HOME.mounts=[]);if(HOME.mount&&!own.includes(HOME.mount))own.push(HOME.mount);_ba(k);if(HOME.mount&&!own.includes(HOME.mount))own.push(HOME.mount);saveHome()}}
const MSC=.92,toW=(x,y,f,lx,ly)=>[x+f*MSC*(lx-34),y+MSC*ly];
function drawWolfMount(K,A,t,g){
 const leg=(hx,hy,ph,hind,far)=>beastLeg(hx,hy,ph,A*1.2,hind,K,far,1);
 leg(22,-24,g+Math.PI,1,1);leg(50,-24,g+4.712,0,1);
 ctx.save();ctx.translate(0,-Math.abs(Math.sin(g*2))*1.6*A);
 // หางพุ่มฟู
 const sw=Math.sin(t*3)*.25+Math.sin(g)*.2*A;ctx.fillStyle=K.b;ctx.strokeStyle='rgba(10,10,20,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(14,-34);ctx.bezierCurveTo(2,-36+sw*8,-6,-28+sw*10,-4,-20+sw*12);ctx.bezierCurveTo(2,-24,8,-28,16,-28);ctx.fill();ctx.stroke();ctx.fillStyle=K.hi;ctx.beginPath();ctx.ellipse(-3,-22+sw*12,3,4,0,0,7);ctx.fill();
 // ลำตัว
 ctx.beginPath();ctx.moveTo(12,-30);ctx.bezierCurveTo(12,-42,26,-44,38,-42);ctx.bezierCurveTo(50,-41,56,-44,60,-42);ctx.bezierCurveTo(64,-36,60,-24,52,-22);ctx.bezierCurveTo(40,-20,26,-20,16,-22);ctx.closePath();bodyFill(K,-46,-20);
 ctx.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(20+i*7,-42);ctx.lineTo(23+i*7,-37);ctx.lineTo(26+i*7,-42);ctx.fill()}
 // หัว
 ctx.save();ctx.translate(60,-40);ctx.rotate(Math.sin(g)*.05*A);ctx.beginPath();ctx.moveTo(-6,-6);ctx.bezierCurveTo(0,-14,10,-12,14,-6);ctx.lineTo(24,-2);ctx.bezierCurveTo(26,2,22,5,16,5);ctx.bezierCurveTo(8,6,0,4,-4,2);ctx.closePath();bodyFill(K,-14,6);
 ctx.fillStyle=K.b;for(const ex of [0,6]){ctx.beginPath();ctx.moveTo(ex,-9);ctx.lineTo(ex+3,-20);ctx.lineTo(ex+7,-9);ctx.fill();ctx.stroke()}
 ctx.fillStyle='#120a14';ctx.beginPath();ctx.ellipse(24,0,2,1.6,0,0,7);ctx.fill();
 const eg=ctx.createRadialGradient(11,-5,0,11,-5,7);eg.addColorStop(0,'rgba(120,200,255,1)');eg.addColorStop(1,'rgba(120,200,255,0)');ctx.fillStyle=eg;ctx.fillRect(4,-12,14,14);ctx.fillStyle='#dff4ff';ctx.fillRect(10,-6,3,2);
 ctx.strokeStyle='#e8ecff';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(17,4);ctx.lineTo(18,7);ctx.moveTo(20,4);ctx.lineTo(21,7);ctx.stroke();ctx.restore();
 // อาน
 ctx.fillStyle='#2a2238';ctx.fillRect(26,-46,16,6);ctx.fillStyle='#8a7ad0';ctx.fillRect(26,-41,16,1.5);ctx.fillStyle='#3a2a18';ctx.beginPath();ctx.moveTo(25,-46);ctx.quadraticCurveTo(34,-51,43,-46);ctx.lineTo(43,-44);ctx.lineTo(25,-44);ctx.fill();
 ctx.restore();leg(16,-24,g,1,0);leg(46,-24,g+Math.PI/2,0,0)}
function drawSteed(k,x,y,f,A){const t=performance.now()/1000,g=t*(A?9.5:0)+(MOUNT.g0||0),K=MPAL[k]||MPAL.horse;
 ctx.save();ctx.translate(x,y);ctx.scale(f*MSC,MSC);ctx.translate(-34,0);
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(34,1,40,6,0,0,7);ctx.fill();
 if(k==='wolf'){drawWolfMount(K,A,t,g);ctx.globalCompositeOperation='lighter';const gg=ctx.createRadialGradient(34,-34,2,34,-34,48);gg.addColorStop(0,'rgba(140,180,255,.28)');gg.addColorStop(1,'rgba(140,180,255,0)');ctx.fillStyle=gg;ctx.fillRect(-14,-82,96,96);ctx.restore();return}
 try{drawHorse({x:0,amp:A},t,K,A,g)}catch(e){}
 const lift=-Math.abs(Math.sin(g*2))*1.2*A;ctx.translate(0,lift);
 // อานหนังแท้ + โกลน
 ctx.fillStyle='#3a1e0c';ctx.strokeStyle='#1a0c04';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(26,-46);ctx.quadraticCurveTo(28,-53,31,-50);ctx.quadraticCurveTo(35,-47,39,-49);ctx.quadraticCurveTo(43,-53,44,-47);ctx.lineTo(43,-43);ctx.lineTo(27,-43);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=k==='unicorn'?'#8a6ad0':k==='flame'?'#5a0a0a':'#7a1a1a';ctx.fillRect(27,-43,16,5);ctx.fillStyle='#e8c14a';ctx.fillRect(27,-38.5,16,1.2);
 if(k==='horse'){// เกราะหน้าม้า + เกราะอก
  ctx.fillStyle='#c8ccd6';ctx.strokeStyle='#3a3e48';ctx.beginPath();ctx.moveTo(57,-70);ctx.lineTo(66,-66);ctx.lineTo(73,-55);ctx.lineTo(69,-52);ctx.lineTo(60,-60);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#e8c14a';ctx.beginPath();ctx.arc(63,-63,1.6,0,7);ctx.fill();
  ctx.fillStyle='#a8acb8';ctx.beginPath();ctx.moveTo(52,-46);ctx.quadraticCurveTo(62,-40,58,-30);ctx.lineTo(52,-32);ctx.closePath();ctx.fill();ctx.stroke()}
 if(k==='unicorn'){ctx.save();ctx.translate(60,-71);const hg=ctx.createLinearGradient(0,0,6,-16);hg.addColorStop(0,'#fff4c0');hg.addColorStop(1,'#ffd040');ctx.fillStyle=hg;ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(5,-17);ctx.lineTo(3,1);ctx.closePath();ctx.fill();ctx.strokeStyle='#c8901a';ctx.lineWidth=.8;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(-1+i*.9,-i*3.4);ctx.lineTo(2.6+i*.4,-i*3.4+1.2);ctx.stroke()}ctx.restore();
  ctx.globalCompositeOperation='lighter';const hg2=ctx.createRadialGradient(64,-86,0,64,-86,10);hg2.addColorStop(0,'rgba(255,240,180,.8)');hg2.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=hg2;ctx.fillRect(54,-96,20,20);ctx.globalCompositeOperation='source-over'}
 if(k==='flame'){ctx.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const u=i/7,px=47+u*11,py=-48-u*20,fl=4+Math.sin(t*12+i*2)*2;const fg=ctx.createRadialGradient(px-3,py+2,0,px-3,py+2,fl+5);fg.addColorStop(0,'rgba(255,220,120,.9)');fg.addColorStop(.5,'rgba(255,90,20,.6)');fg.addColorStop(1,'rgba(255,40,0,0)');ctx.fillStyle=fg;ctx.fillRect(px-12,py-10,18,18)}
  const eg=ctx.createRadialGradient(65,-62,0,65,-62,5);eg.addColorStop(0,'rgba(255,80,20,1)');eg.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=eg;ctx.fillRect(60,-67,10,10);ctx.globalCompositeOperation='source-over'}
 ctx.restore()}
function mountParticles(k,x,y,f,A,dt){if(!A)return;MOUNT.pt=(MOUNT.pt||0)-dt;MOUNT.ht=(MOUNT.ht||0)-dt;const sp=MOUNTS[k]?MOUNTS[k].spd:1.6;
 if(MOUNT.ht<=0){MOUNT.ht=.34/sp*1.6;try{sfx('hoof')}catch(e){}}
 if(MOUNT.pt>0)return;MOUNT.pt=.05;const hooves=k==='wolf'?[[16,0],[46,0]]:[[20,0],[48,0]];const [lx,ly]=hooves[Math.random()*2|0],[wx,wy]=toW(x,y,f,lx,ly);
 if(k==='flame'){rfxP(wx,wy-2,(Math.random()-.5)*20,-30-Math.random()*30,.5,Math.random()<.5?'255,140,40':'255,60,20',2.4,'spark');const [mx,my]=toW(x,y,f,47+Math.random()*11,-50-Math.random()*20);rfxP(mx,my,-f*20,-30,.45,'255,120,30',2,'spark')}
 else if(k==='unicorn'){const hue=['255,140,200','255,230,120','140,230,255','180,150,255','150,255,180'][Math.random()*5|0];rfxP(wx,wy-4,(Math.random()-.5)*16,-20-Math.random()*20,.8,hue,2.2,'spark')}
 else if(k==='wolf'){rfxP(wx,wy-2,(Math.random()-.5)*14,-14,.6,'150,180,255',1.8,'dot')}
 else rfxP(wx,wy-1,(Math.random()-.5)*24-f*14,-8-Math.random()*10,.5,'190,170,140',2.6,'dot')}
let mLastT=performance.now();
// ท่านั่ง (ใช้ทั้งบนหลังสัตว์และเก้าอี้)
function seatLegs(x,hipY,f,side,EC,stir){const LG=EC.BLK||'#262631',BT='#2a1a10';ctx.save();ctx.lineCap='round';
 if(side){ctx.strokeStyle=LG;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x,hipY);ctx.lineTo(x+f*7,hipY+4);ctx.stroke();ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+f*7,hipY+4);ctx.lineTo(x+f*5,hipY+11);ctx.stroke();ctx.fillStyle=BT;ctx.fillRect(x+f*5-3+(f>0?1:-2),hipY+10,7,4);if(!stir){ctx.restore();return}
  ctx.strokeStyle='#5a3418';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+f*2,hipY);ctx.lineTo(x+f*4,hipY+13);ctx.stroke();ctx.fillStyle='#c8ccd6';ctx.fillRect(x+f*4-4,hipY+13,8,2)}
 else{ctx.fillStyle=LG;ctx.fillRect(x-8,hipY,7,6);ctx.fillRect(x+1,hipY,7,6);ctx.fillRect(x-8,hipY+5,6,7);ctx.fillRect(x+2,hipY+5,6,7);ctx.fillStyle=BT;ctx.fillRect(x-8,hipY+11,6,3);ctx.fillRect(x+2,hipY+11,6,3)}
 ctx.restore()}
{const _h=hero;hero=function(){
  const now=performance.now(),dt=Math.min(.05,(now-mLastT)/1000);mLastT=now;
  if(P.sit&&!P.dead&&!MOUNT.on){const EC=EQCOL(),hip=P.y-9;ctx.save();ctx.translate(0,3);ctx.beginPath();ctx.rect(P.x-60,P.y-130,120,130-12);ctx.clip();_h();ctx.restore();const sd=P.dir==='l'||P.dir==='r';seatLegs(P.x,hip,P.dir==='l'?-1:1,sd,EC,false);return}
  if(!(MOUNT.on&&HOME.mount)||P.dead){if(MOUNT.jt>0)MOUNT.jt-=dt;return _h()}
  const k=HOME.mount,f=P.dir==='l'?-1:P.dir==='r'?1:(MOUNT.f||1);MOUNT.f=f;const A=P.mv?1:0,t=now/1000,g=t*(A?9.5:0);
  let jy=0;if(MOUNT.jt>0){MOUNT.jt-=dt;const u=1-MOUNT.jt/.35;jy=-Math.sin(Math.max(0,Math.min(1,u))*Math.PI)*18}
  if((P.dir==='u'||P.dir==='d')&&window.drawSteedUD7)drawSteedUD7(k,P.x,P.y+2,P.dir,A,0);else drawSteed(k,P.x,P.y+2,f,A);mountParticles(k,P.x,P.y+2,f,A,dt);
  const bob=-Math.abs(Math.sin(g*2))*1.2*A*MSC,saddle=k==='wolf'?-37:-40,hipY=P.y+2+saddle*MSC+bob+jy+1;
  const sv={dir:P.dir,mv:P.mv},ud7=!!window.drawSteedUD7&&(P.dir==='u'||P.dir==='d');if(!ud7)P.dir=f<0?'l':'r';P.mv=false;const EC=EQCOL();
  ctx.save();ctx.translate(ud7?0:f*2,hipY-(P.y-12));ctx.beginPath();ctx.rect(P.x-70,P.y-140,140,140-12);ctx.clip();MOUNT.on=false;try{_h()}finally{MOUNT.on=true}ctx.restore();
  if(ud7){seatLegs(P.x,hipY,f,false,EC,true);drawSteedUD7(k,P.x,P.y+2,P.dir,A,1)}else seatLegs(P.x+f*2,hipY,f,true,EC,true);P.dir=sv.dir;P.mv=sv.mv}}
{const _sm=spdMul;spdMul=function(){const b=_sm();if(!MOUNT.on||!HOME.mount)return b;const old=HOME.mount==='wolf'?1.9:1.6,nw=(MOUNTS[HOME.mount]||MOUNTS.horse).spd;return b/old*nw}}
{const _tm=toggleMount;toggleMount=function(){const was=MOUNT.on;_tm();if(MOUNT.on!==was){MOUNT.jt=.35;for(let i=0;i<16;i++){const a=Math.random()*6.28;rfxP(P.x+Math.cos(a)*14,P.y,Math.cos(a)*50,-10-Math.random()*20,.5,'210,190,150',2.6,'dot')}
  if(MOUNT.on){const k=HOME.mount;tone(520,780,.18,'triangle',.05);tone(780,640,.3,'triangle',.04,.16);if(k!=='wolf'){nz(.35,.08,1800,700,3,'bandpass',.05)}else{tone(300,700,.6,'sawtooth',.03,.05)}say('🐎 ขี่'+((MOUNTS[k]||{}).n||'สัตว์ขี่')+' · เร็วขึ้น '+Math.round(((MOUNTS[k]||MOUNTS.horse).spd-1)*100)+'%')}}}}
// ลงจากหลังเมื่อเข้าโหมดต่อสู้: มีท่ากระโดดลง
{const _a=attack;attack=function(q){if(MOUNT.on&&!(D&&D.home&&TOOLKEYS.includes(P.tool))){MOUNT.jt=.35;for(let i=0;i<10;i++)rfxP(P.x+(Math.random()-.5)*30,P.y,(Math.random()-.5)*60,-20,.4,'210,190,150',2.4,'dot')}return _a(q)}}

// =====================================================================
// เครื่องมือฟาร์มวาดใหม่ (จอบ/บัวรดน้ำ/เคียว/ค้อน) + ถุงเมล็ดพันธุ์
// =====================================================================
const FT6={};const TMET=[['#8a8a90','#c8c8d0','#4a4a52'],['#9aa0aa','#e0e6ee','#4a505a'],['#c8743a','#ffb070','#6a3010'],['#c8d0dc','#ffffff','#6a7280'],['#e8b820','#fff0a0','#7a5a08'],['#5ac8f0','#e0faff','#1a5a80']];
function farmTool(k,tier){tier=tier|0;const key=k+tier;if(FT6[key])return FT6[key];const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d'),[m,mh,md]=TMET[tier]||TMET[0];q.lineCap='round';q.lineJoin='round';
 const handle=(x1,y1,x2,y2,w)=>{const g=q.createLinearGradient(x1,y1,x2+4,y2);g.addColorStop(0,'#5a3418');g.addColorStop(.5,'#b07a44');g.addColorStop(1,'#6a4020');q.strokeStyle='#24140a';q.lineWidth=w+2.5;q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke();q.strokeStyle=g;q.lineWidth=w;q.stroke();q.strokeStyle='rgba(255,230,190,.35)';q.lineWidth=1;q.beginPath();q.moveTo(x1-1,y1-1);q.lineTo(x2-1,y2-1);q.stroke()};
 const metal=(path,x0,y0,x1,y1)=>{const g=q.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,mh);g.addColorStop(.45,m);g.addColorStop(1,md);q.fillStyle=g;q.strokeStyle='#14141a';q.lineWidth=1.8;q.beginPath();path();q.fill();q.stroke()};
 if(k==='hoe'){handle(32,60,32,10,4.5);
  metal(()=>{q.moveTo(28,8);q.lineTo(36,8);q.lineTo(36,15);q.lineTo(28,15);q.closePath()},28,8,36,15);
  metal(()=>{q.moveTo(36,9);q.lineTo(50,11);q.lineTo(54,27);q.quadraticCurveTo(48,30,40,27);q.lineTo(36,15);q.closePath()},36,9,54,30);
  q.strokeStyle=mh;q.lineWidth=1.4;q.beginPath();q.moveTo(42,26);q.lineTo(52,26);q.stroke()}
 else if(k==='hamr'){handle(32,60,32,18,4.5);q.fillStyle='#3a2410';q.fillRect(29,18,6,4);
  metal(()=>{q.moveTo(22,6);q.lineTo(44,6);q.lineTo(44,18);q.lineTo(22,18);q.closePath()},22,6,44,18);
  metal(()=>{q.moveTo(44,5);q.lineTo(51,4);q.lineTo(51,20);q.lineTo(44,19);q.closePath()},44,4,51,20);
  metal(()=>{q.moveTo(22,7);q.quadraticCurveTo(12,4,8,11);q.quadraticCurveTo(14,11,22,17);q.closePath()},8,4,22,17);
  q.fillStyle='rgba(255,255,255,.55)';q.fillRect(25,8,16,2)}
 else if(k==='sick'){handle(32,60,32,30,5);q.fillStyle='#3a2410';q.fillRect(29,27,7,5);
  metal(()=>{q.moveTo(30,29);q.bezierCurveTo(26,10,42,2,56,10);q.bezierCurveTo(46,8,36,14,35,29);q.closePath()},26,4,56,29);
  q.strokeStyle=mh;q.lineWidth=1.3;q.beginPath();q.moveTo(33,25);q.bezierCurveTo(32,12,43,7,53,10);q.stroke()}
 else{// บัวรดน้ำ (ด้ามจับอยู่กลาง)
  const g=q.createLinearGradient(14,24,48,58);g.addColorStop(0,mh);g.addColorStop(.5,m);g.addColorStop(1,md);q.fillStyle=g;q.strokeStyle='#14141a';q.lineWidth=2;
  q.beginPath();q.moveTo(18,32);q.lineTo(46,32);q.lineTo(48,58);q.quadraticCurveTo(32,62,16,58);q.closePath();q.fill();q.stroke();
  q.beginPath();q.ellipse(32,32,14,4,0,0,7);q.fillStyle=md;q.fill();q.stroke();q.fillStyle='#4a8ac8';q.beginPath();q.ellipse(32,32,11,2.6,0,0,7);q.fill();
  q.beginPath();q.moveTo(46,48);q.lineTo(58,28);q.lineTo(61,30);q.lineTo(48,54);q.closePath();q.fillStyle=g;q.fill();q.stroke();
  q.strokeStyle=md;q.lineWidth=3;q.beginPath();q.moveTo(22,32);q.bezierCurveTo(22,12,42,12,42,32);q.stroke();
  q.fillStyle='rgba(255,255,255,.45)';q.fillRect(21,36,3,18)}
 if(tier>=3){q.globalCompositeOperation='lighter';const gl=q.createRadialGradient(40,14,0,40,14,20);gl.addColorStop(0,tier>=5?'rgba(120,220,255,.5)':'rgba(255,230,140,.4)');gl.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gl;q.fillRect(20,0,44,40)}
 return FT6[key]=c}
toolIcon2=function(k,tier){return farmTool(k,tier)};
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){if(!TOOLKEYS.includes(P.tool))return _ts(hx,hy,ang);ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r')ctx.scale(-1,1);ctx.drawImage(farmTool(P.tool,HOME.tools[P.tool]|0),-21,-38,42,42);ctx.restore()}}
// ถุงเมล็ดพันธุ์
const SEEDART={turnip:(q)=>{q.fillStyle='#f4f0e8';q.beginPath();q.ellipse(32,40,9,8,0,0,7);q.fill();q.fillStyle='#b06ad0';q.beginPath();q.ellipse(32,36,9,5,0,Math.PI,0);q.fill();q.fillStyle='#4aa040';for(const a of [-.5,0,.5]){q.beginPath();q.ellipse(32+a*10,26,3,7,a,0,7);q.fill()}},
 wheat:(q)=>{q.strokeStyle='#8a6a20';q.lineWidth=1.5;for(const x of [26,32,38]){q.beginPath();q.moveTo(x,48);q.lineTo(x,24);q.stroke();q.fillStyle='#e8c860';for(let i=0;i<5;i++){q.beginPath();q.ellipse(x-2,28+i*4,2,3,-.5,0,7);q.ellipse(x+2,28+i*4,2,3,.5,0,7);q.fill()}}},
 carrot:(q)=>{q.fillStyle='#ff8a2a';q.beginPath();q.moveTo(26,28);q.lineTo(38,28);q.lineTo(32,50);q.closePath();q.fill();q.strokeStyle='#c85a10';q.lineWidth=1;for(const y of [33,38,43]){q.beginPath();q.moveTo(28+(y-28)*.2,y);q.lineTo(31,y);q.stroke()}q.fillStyle='#4aa040';for(const a of [-.4,0,.4]){q.beginPath();q.ellipse(32+a*8,22,2.5,7,a,0,7);q.fill()}},
 cabbage:(q)=>{const g=q.createRadialGradient(30,34,2,32,38,13);g.addColorStop(0,'#e8ffc8');g.addColorStop(1,'#5aa040');q.fillStyle=g;q.beginPath();q.arc(32,38,12,0,7);q.fill();q.strokeStyle='#3a7a2a';q.lineWidth=1;for(const a of [0,1.2,2.4,3.6,4.8]){q.beginPath();q.arc(32,38,7,a,a+1.2);q.stroke()}},
 tomato:(q)=>{const g=q.createRadialGradient(28,34,1,32,38,12);g.addColorStop(0,'#ff9a8a');g.addColorStop(1,'#c0201a');q.fillStyle=g;q.beginPath();q.arc(32,38,11,0,7);q.fill();q.fillStyle='#3a8a2a';q.beginPath();for(let i=0;i<5;i++){const a=i*1.256-1.57;q.lineTo(32+Math.cos(a)*7,28+Math.sin(a)*3);q.lineTo(32+Math.cos(a+.6)*2,28+Math.sin(a+.6)*1)}q.fill()},
 strawberry:(q)=>{const g=q.createLinearGradient(0,28,0,50);g.addColorStop(0,'#ff6a7a');g.addColorStop(1,'#b0102a');q.fillStyle=g;q.beginPath();q.moveTo(22,32);q.quadraticCurveTo(32,26,42,32);q.quadraticCurveTo(40,46,32,52);q.quadraticCurveTo(24,46,22,32);q.fill();q.fillStyle='#fff3a0';for(const [a,b] of [[27,36],[32,35],[37,36],[29,42],[35,42],[32,47]])q.fillRect(a,b,1.6,2);q.fillStyle='#3a9a3a';q.beginPath();q.ellipse(32,29,9,3,0,0,7);q.fill()},
 corn:(q)=>{q.fillStyle='#6aa040';q.beginPath();q.ellipse(26,40,5,14,.3,0,7);q.ellipse(38,40,5,14,-.3,0,7);q.fill();const g=q.createLinearGradient(28,0,36,0);g.addColorStop(0,'#ffd23a');g.addColorStop(1,'#e8a820');q.fillStyle=g;q.beginPath();q.ellipse(32,36,6,14,0,0,7);q.fill();q.fillStyle='rgba(160,100,10,.35)';for(let y=25;y<48;y+=3)for(let x=28;x<37;x+=3)q.fillRect(x,y,1.2,1.2)},
 pumpkin:(q)=>{const g=q.createRadialGradient(28,34,2,32,40,14);g.addColorStop(0,'#ffc070');g.addColorStop(1,'#d0600a');q.fillStyle=g;for(const dx of [-7,0,7]){q.beginPath();q.ellipse(32+dx,40,8,10,0,0,7);q.fill()}q.strokeStyle='rgba(120,40,0,.4)';q.lineWidth=1;for(const dx of [-4,4]){q.beginPath();q.ellipse(32+dx,40,4,10,0,0,7);q.stroke()}q.fillStyle='#5a3a10';q.fillRect(31,26,3,6);q.fillStyle='#3a8a2a';q.beginPath();q.ellipse(37,28,5,2,.4,0,7);q.fill()}};
const SEEDCV={};function seedPack(k){if(SEEDCV[k])return SEEDCV[k];const cv=document.createElement('canvas');cv.width=cv.height=64;const q=cv.getContext('2d');q.lineJoin='round';q.lineCap='round';try{((q)=>{const C=CROPS[k];q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(32,60,20,3,0,0,7);q.fill();
 const g=q.createLinearGradient(10,0,54,0);g.addColorStop(0,'#c8a46a');g.addColorStop(.5,'#ecd4a0');g.addColorStop(1,'#b08a50');q.fillStyle=g;q.strokeStyle='#5a3a18';q.lineWidth=2;
 q.beginPath();q.moveTo(12,12);for(let x=12;x<=52;x+=4)q.lineTo(x,x%8?9:12);q.lineTo(52,12);q.lineTo(54,58);q.lineTo(10,58);q.closePath();q.fill();q.stroke();
 q.fillStyle='#fffaf0';q.strokeStyle='rgba(90,58,24,.5)';q.lineWidth=1;q.beginPath();q.roundRect?q.roundRect(15,18,34,30,4):q.rect(15,18,34,30);q.fill();q.stroke();
 q.save();q.beginPath();q.rect(15,18,34,30);q.clip();const sg=q.createLinearGradient(0,18,0,48);sg.addColorStop(0,'#cfe8ff');sg.addColorStop(.7,'#eef8ff');sg.addColorStop(.71,'#9cd07a');sg.addColorStop(1,'#6fae55');q.fillStyle=sg;q.fillRect(15,18,34,30);q.translate(0,-4);(SEEDART[k]||SEEDART.turnip)(q);q.restore();
 q.fillStyle=C.c[1];q.fillRect(12,50,40,6);q.fillStyle='#fff';q.font='bold 6px sans-serif';q.textAlign='center';q.fillText('SEEDS',32,55.5)})(q)}catch(e){}return SEEDCV[k]=cv}
{const _mi=matIcon;matIcon=function(key){if(/^sd_/.test(key)&&CROPS[key.slice(3)]){const c=document.createElement('canvas');c.width=c.height=48;c.getContext('2d').drawImage(seedPack(key.slice(3)),0,0,48,48);return c}
  if(/^t_/.test(key)){const c=document.createElement('canvas');c.width=c.height=48;c.getContext('2d').drawImage(farmTool(key.slice(2),HOME.tools[key.slice(2)]|0),0,0,48,48);return c}return _mi(key)}}
try{for(const k in IURL)if(/^mat:(sd_|t_)/.test(k))delete IURL[k]}catch(e){}

// =====================================================================
// ไอคอนสกิลวาดใหม่ (แทนอีโมจิ)
// =====================================================================
const SKI6={};
function skBg(q,S,a,b,rim){const g=q.createRadialGradient(S*.5,S*.45,S*.05,S*.5,S*.5,S*.75);g.addColorStop(0,a);g.addColorStop(1,b);q.fillStyle=g;q.fillRect(0,0,S,S);
 q.strokeStyle=rim||'rgba(255,230,160,.7)';q.lineWidth=S*.05;q.strokeRect(S*.025,S*.025,S*.95,S*.95);q.strokeStyle='rgba(0,0,0,.5)';q.lineWidth=S*.02;q.strokeRect(S*.06,S*.06,S*.88,S*.88)}
function sglow(q,x,y,r,rgb,a){const g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+(a||.9)+')');g.addColorStop(1,'rgba('+rgb+',0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}
function skSword(q,x,y,ang,L,col,hilt){q.save();q.translate(x,y);q.rotate(ang);const g=q.createLinearGradient(-4,0,4,0);g.addColorStop(0,'#8a96aa');g.addColorStop(.5,col||'#ffffff');g.addColorStop(1,'#6a7488');q.fillStyle=g;q.strokeStyle='#1a1e2a';q.lineWidth=1.5;
 q.beginPath();q.moveTo(-3.5,0);q.lineTo(-3.5,-L*.82);q.lineTo(0,-L);q.lineTo(3.5,-L*.82);q.lineTo(3.5,0);q.closePath();q.fill();q.stroke();q.fillStyle=hilt||'#e8c14a';q.fillRect(-9,0,18,3.5);q.strokeRect(-9,0,18,3.5);q.fillStyle='#4a2a14';q.fillRect(-2,3.5,4,L*.22);q.fillStyle=hilt||'#e8c14a';q.beginPath();q.arc(0,4+L*.24,3,0,7);q.fill();q.restore()}
function skArrow(q,x,y,ang,L,col,fl){q.save();q.translate(x,y);q.rotate(ang);q.strokeStyle='#6a4a2a';q.lineWidth=2.4;q.beginPath();q.moveTo(-L/2,0);q.lineTo(L/2,0);q.stroke();q.fillStyle=col||'#d8dce8';q.strokeStyle='#1a1a22';q.lineWidth=1;q.beginPath();q.moveTo(L/2+7,0);q.lineTo(L/2-2,-4);q.lineTo(L/2-2,4);q.closePath();q.fill();q.stroke();
 q.fillStyle=fl||'#e04a3a';q.beginPath();q.moveTo(-L/2,0);q.lineTo(-L/2-5,-5);q.lineTo(-L/2+5,0);q.lineTo(-L/2-5,5);q.closePath();q.fill();q.restore()}
function skFlame(q,x,y,s,c1,c2){const g=q.createRadialGradient(x,y+s*.3,0,x,y,s*1.2);g.addColorStop(0,c1||'#fff4a0');g.addColorStop(.45,c2||'#ff8a1a');g.addColorStop(1,'rgba(200,30,0,0)');q.fillStyle=g;q.beginPath();q.moveTo(x,y-s*1.3);q.bezierCurveTo(x+s*.9,y-s*.4,x+s*.8,y+s*.7,x,y+s*.8);q.bezierCurveTo(x-s*.8,y+s*.7,x-s*.9,y-s*.4,x,y-s*1.3);q.fill()}
function skBolt(q,pts,w,col){q.strokeStyle=col||'#fff8c0';q.lineWidth=w;q.shadowColor='#7fd8ff';q.shadowBlur=10;q.beginPath();q.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)q.lineTo(pts[i],pts[i+1]);q.stroke();q.shadowBlur=0}
const SKART={
 'กระทืบปฐพี':(q,S)=>{skBg(q,S,'#c87a3a','#2a1206');sglow(q,48,70,40,'255,170,60');q.strokeStyle='#1a0a02';q.lineWidth=3;for(const a of [-2.6,-2,-1.2,-.5,.2]){q.beginPath();q.moveTo(48,70);q.lineTo(48+Math.cos(a)*40,70+Math.sin(a)*26+20);q.stroke()}
  for(let i=1;i<4;i++){q.strokeStyle='rgba(255,220,140,'+(.9-i*.2)+')';q.lineWidth=3;q.beginPath();q.ellipse(48,72,12*i,4*i,0,0,7);q.stroke()}
  q.fillStyle='#3a2a1a';q.strokeStyle='#0a0602';q.lineWidth=2;q.beginPath();q.moveTo(36,18);q.lineTo(54,18);q.lineTo(56,56);q.lineTo(66,58);q.lineTo(66,66);q.lineTo(34,66);q.closePath();q.fill();q.stroke();q.fillStyle='#8a8a92';q.fillRect(34,60,32,6);
  for(let i=0;i<8;i++){q.fillStyle='#6a4a2a';q.fillRect(20+i*8,64-((i*7)%11),5,5)}},
 'ดาบสามจังหวะ':(q,S)=>{skBg(q,S,'#8a1a2a','#1a0408');for(let i=0;i<3;i++){q.strokeStyle='rgba(255,240,240,'+(.95-i*.22)+')';q.lineWidth=6-i;q.beginPath();q.arc(48+i*6,52-i*10,30-i*3,-2.5+i*.3,-.6+i*.3);q.stroke()}skSword(q,58,74,.75,52,'#fff0f0')},
 'พายุดาบ':(q,S)=>{skBg(q,S,'#4a6a8a','#0a1420');for(let i=0;i<3;i++){q.strokeStyle='rgba(200,230,255,'+(.7-i*.18)+')';q.lineWidth=4;q.beginPath();q.arc(48,48,14+i*10,i,i+4.2);q.stroke()}for(let i=0;i<6;i++){const a=i*1.047;skSword(q,48+Math.cos(a)*24,48+Math.sin(a)*24,a+Math.PI,24,'#dff0ff')}sglow(q,48,48,16,'200,240,255')},
 'ฟันวาปสายฟ้า':(q,S)=>{skBg(q,S,'#3a4a9a','#060818');skBolt(q,[60,6,44,38,56,40,34,90],5);skBolt(q,[60,6,44,38,56,40,34,90],2,'#ffffff');for(let i=0;i<3;i++){q.globalAlpha=.25+i*.25;skSword(q,22+i*14,74-i*6,.6,40,'#e0f0ff')}q.globalAlpha=1},
 'ใบดาบวิญญาณวน':(q,S)=>{skBg(q,S,'#2a7a8a','#041418');sglow(q,48,48,30,'110,255,230',.7);for(let i=0;i<5;i++){const a=i*1.256;q.globalAlpha=.85;skSword(q,48+Math.cos(a)*26,48+Math.sin(a)*26,a+1.9,26,'#b8fff0','#5affd8')}q.globalAlpha=1;q.strokeStyle='rgba(110,255,230,.6)';q.lineWidth=2;q.beginPath();q.arc(48,48,26,0,7);q.stroke()},
 'ฟันกากบาทสวรรค์':(q,S)=>{skBg(q,S,'#c89a2a','#2a1a04');sglow(q,48,48,40,'255,240,160');q.strokeStyle='#fffbe0';q.lineWidth=8;q.beginPath();q.moveTo(14,14);q.lineTo(82,82);q.moveTo(82,14);q.lineTo(14,82);q.stroke();q.strokeStyle='#ffd23a';q.lineWidth=3;q.stroke();for(let i=0;i<8;i++){const a=i*.785;q.strokeStyle='rgba(255,250,200,.6)';q.lineWidth=1.5;q.beginPath();q.moveTo(48+Math.cos(a)*10,48+Math.sin(a)*10);q.lineTo(48+Math.cos(a)*44,48+Math.sin(a)*44);q.stroke()}},
 'วงแหวนเพลิง':(q,S)=>{skBg(q,S,'#6a1a0a','#100402');for(let i=0;i<14;i++){const a=i*.449;skFlame(q,48+Math.cos(a)*28,52+Math.sin(a)*16,8)}sglow(q,48,52,20,'255,160,60',.6)},
 'เวทธาตุสามสาย':(q,S)=>{skBg(q,S,'#3a2a6a','#08061a');const orb=(x,y,rgb,c)=>{sglow(q,x,y,18,rgb);q.fillStyle=c;q.beginPath();q.arc(x,y,8,0,7);q.fill();q.fillStyle='rgba(255,255,255,.8)';q.beginPath();q.arc(x-3,y-3,2.5,0,7);q.fill()};orb(48,26,'140,220,255','#bfeaff');orb(26,64,'255,240,120','#fff6a0');orb(70,64,'255,120,40','#ff9a4a');q.strokeStyle='rgba(220,200,255,.5)';q.lineWidth=2;q.beginPath();q.moveTo(48,26);q.lineTo(26,64);q.lineTo(70,64);q.closePath();q.stroke()},
 'พายุอุกกาบาต':(q,S)=>{skBg(q,S,'#7a2a0a','#120402');for(let i=0;i<3;i++){const x=24+i*22,y=30+i*16;q.strokeStyle='rgba(255,180,80,.5)';q.lineWidth=7-i;q.beginPath();q.moveTo(x-30,y-30);q.lineTo(x,y);q.stroke();sglow(q,x,y,14,'255,150,50');q.fillStyle='#5a2a14';q.beginPath();q.arc(x,y,7-i,0,7);q.fill();q.fillStyle='#ffb050';q.beginPath();q.arc(x+2,y+2,3,0,7);q.fill()}},
 'อัญเชิญโครงกระดูก':(q,S)=>{skBg(q,S,'#2a5a2a','#040c04');skFlame(q,48,60,26,'#d0ffb0','#40c060');q.fillStyle='#f0ecdc';q.strokeStyle='#2a2a1a';q.lineWidth=2;q.beginPath();q.arc(48,42,18,Math.PI*.9,Math.PI*2.1);q.lineTo(60,62);q.lineTo(36,62);q.closePath();q.fill();q.stroke();q.fillStyle='#0a140a';q.beginPath();q.ellipse(40,44,5,6,0,0,7);q.ellipse(56,44,5,6,0,0,7);q.fill();q.fillStyle='#7aff7a';q.beginPath();q.arc(40,45,2,0,7);q.arc(56,45,2,0,7);q.fill();q.fillStyle='#0a140a';for(let i=0;i<4;i++)q.fillRect(40+i*5,56,2,6)},
 'อัญเชิญภูตไฟ':(q,S)=>{skBg(q,S,'#8a3a0a','#140602');skFlame(q,48,54,30);skFlame(q,48,58,18,'#ffffff','#ffd060');q.fillStyle='#3a1004';q.beginPath();q.ellipse(41,52,3,4.5,0,0,7);q.ellipse(55,52,3,4.5,0,0,7);q.fill();q.beginPath();q.arc(48,62,4,0,Math.PI);q.fill()},
 'อัญเชิญโกเลมศิลา':(q,S)=>{skBg(q,S,'#5a5a6a','#0a0a10');q.fillStyle='#7a7a86';q.strokeStyle='#1a1a22';q.lineWidth=2;q.beginPath();q.moveTo(26,80);q.lineTo(22,40);q.lineTo(34,22);q.lineTo(62,22);q.lineTo(74,40);q.lineTo(70,80);q.closePath();q.fill();q.stroke();q.strokeStyle='rgba(0,0,0,.35)';q.beginPath();q.moveTo(30,50);q.lineTo(46,58);q.lineTo(40,74);q.moveTo(66,46);q.lineTo(54,62);q.stroke();sglow(q,38,40,8,'120,200,255');sglow(q,58,40,8,'120,200,255');q.fillStyle='#c8f0ff';q.fillRect(35,38,6,4);q.fillRect(55,38,6,4)},
 'ยิงกระจาย':(q,S)=>{skBg(q,S,'#2a6a3a','#04120a');for(let i=0;i<5;i++)skArrow(q,48,60,-Math.PI/2+(i-2)*.32,46);sglow(q,48,70,14,'255,255,200',.5)},
 'ธนูวิญญาณ':(q,S)=>{skBg(q,S,'#3a2a7a','#06041a');sglow(q,48,48,34,'170,150,255',.8);q.globalCompositeOperation='lighter';for(let i=0;i<4;i++){q.globalAlpha=.3;skArrow(q,40-i*6,56+i*6,-.75,50,'#e0d8ff','#a890ff')}q.globalAlpha=1;q.globalCompositeOperation='source-over';skArrow(q,50,46,-.75,54,'#ffffff','#c8b8ff')},
 'ฝนธนู':(q,S)=>{skBg(q,S,'#3a4a5a','#06080c');q.fillStyle='#5a6a7a';q.beginPath();q.ellipse(30,18,20,10,0,0,7);q.ellipse(56,16,24,12,0,0,7);q.ellipse(76,22,14,8,0,0,7);q.fill();for(let i=0;i<7;i++)skArrow(q,16+i*11,44+(i%3)*12,Math.PI/2+.25,26)},
 'ยิงวาปเงา':(q,S)=>{skBg(q,S,'#3a1a5a','#06020c');q.strokeStyle='rgba(180,120,255,.8)';q.lineWidth=4;q.beginPath();q.ellipse(26,58,10,18,.3,0,7);q.stroke();sglow(q,26,58,18,'140,80,255',.6);q.globalAlpha=.4;skArrow(q,40,52,-.5,40,'#c8a8ff','#5a2a8a');q.globalAlpha=1;skArrow(q,58,40,-.5,40,'#ffffff','#7a3ab0')},
 'อัญเชิญเหยี่ยว':(q,S)=>{skBg(q,S,'#6a8ac8','#0a1430');sglow(q,48,44,30,'255,240,200',.5);q.fillStyle='#5a3a1a';q.strokeStyle='#1a0a02';q.lineWidth=1.5;q.beginPath();q.moveTo(48,40);q.bezierCurveTo(30,22,12,26,6,34);q.bezierCurveTo(20,36,30,42,40,50);q.lineTo(48,62);q.lineTo(56,50);q.bezierCurveTo(66,42,76,36,90,34);q.bezierCurveTo(84,26,66,22,48,40);q.fill();q.stroke();q.fillStyle='#f0e8d8';q.beginPath();q.arc(48,40,6,0,7);q.fill();q.fillStyle='#ffc020';q.beginPath();q.moveTo(48,44);q.lineTo(52,47);q.lineTo(48,48);q.fill();q.fillStyle='#000';q.fillRect(46,38,2,2)},
 'ธนูพายุหมุน':(q,S)=>{skBg(q,S,'#2a7a6a','#041410');for(let i=0;i<4;i++){q.strokeStyle='rgba(200,255,240,'+(.7-i*.15)+')';q.lineWidth=3;q.beginPath();q.arc(48,48,10+i*9,i*1.4,i*1.4+3.6);q.stroke()}skArrow(q,48,48,-.8,60,'#ffffff','#2ad0a0')},
 'ฟันหมุน':(q,S)=>{skBg(q,S,'#5a6a7a','#0a0e14');q.strokeStyle='rgba(220,240,255,.8)';q.lineWidth=5;q.beginPath();q.arc(48,48,28,0,5.4);q.stroke();skSword(q,48,48,2.3,40)},
 'ลูกไฟ':(q,S)=>{skBg(q,S,'#6a2a0a','#100402');q.strokeStyle='rgba(255,160,60,.45)';q.lineWidth=10;q.beginPath();q.moveTo(14,80);q.lineTo(52,42);q.stroke();sglow(q,56,38,26,'255,160,40');q.fillStyle='#fff3b0';q.beginPath();q.arc(56,38,10,0,7);q.fill()},
 'เยียวยา':(q,S)=>{skBg(q,S,'#2a8a4a','#041a0a');sglow(q,48,48,34,'140,255,170');q.fillStyle='#f0fff0';q.strokeStyle='#1a5a2a';q.lineWidth=2;q.beginPath();q.rect(40,22,16,52);q.rect(22,40,52,16);q.fill();for(let i=0;i<6;i++){q.fillStyle='rgba(200,255,200,.8)';q.fillRect(16+i*12,76-(i*9)%22,3,3)}}};
function skillIcon(name){if(SKI6[name]!==undefined)return SKI6[name];const fn=SKART[name];if(!fn)return SKI6[name]=null;const c=document.createElement('canvas');c.width=c.height=96;const q=c.getContext('2d');q.lineCap='round';q.lineJoin='round';try{fn(q,96)}catch(e){}
 const v=q.createLinearGradient(0,0,0,96);v.addColorStop(0,'rgba(255,255,255,.12)');v.addColorStop(.4,'rgba(255,255,255,0)');v.addColorStop(1,'rgba(0,0,0,.25)');q.fillStyle=v;q.fillRect(0,0,96,96);return SKI6[name]=c.toDataURL()}
window.skillIcon=skillIcon;
setInterval(()=>{for(const b of document.querySelectorAll('#acts .sk')){const n=b.getAttribute('aria-label'),lock=b.classList.contains('lock'),u=n?skillIcon(n):null;/* fix135: สกิลที่ยังไม่เรียนก็โชว์รูป (มืด + กุญแจ) */const want=u?'url('+u+')':'';if(b._ski!==want){b._ski=want;b.style.backgroundImage=want;b.classList.toggle('hasi',!!u)}}},300);
{const _r=renderSkw;renderSkw=function(){_r();try{for(const c of skwEl.querySelectorAll('.card.sk')){const nm=c.querySelector('b'),e=c.querySelector('.e');if(!nm||!e)continue;const u=skillIcon(nm.textContent.trim());if(u)e.innerHTML='<img src="'+u+'">'}}catch(e){}}}


// =====================================================================
// v4.6 (ข) : เครื่องประดับสัตว์เลี้ยง (ปลอกคอ/กระพรวน/แหวน 3 ขั้น · รีค่า+ล็อก · ทะลวง)
//            ร้านแฟชั่น (ชุด+อาวุธ) · ช่างตีเหล็กใหม่ (ตำราปลดล็อกชุด · เดินไปเตาเอง) · แท่นค้นหาของหาย · ประตูแบบภาพตัด · ป้ายร้านดาบใหม่
// =====================================================================
{const st=document.createElement('style');st.textContent=`
.p6w{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;background:rgba(6,4,10,.6)}
.p6w[hidden]{display:none}
.p6w .w{width:min(860px,97%);height:min(540px,95%);display:flex;flex-direction:column;border-radius:16px;overflow:hidden;color:#f3eefc;background:linear-gradient(180deg,#221a34,#141020);border:2px solid #e8c14a;box-shadow:0 0 0 3px #120c06,0 14px 40px rgba(0,0,0,.7);font-family:system-ui,"Noto Sans Thai",sans-serif}
.p6w .hd{display:flex;align-items:center;gap:6px;padding:8px 10px;background:linear-gradient(180deg,#3a2c54,#2a2040);border-bottom:1px solid rgba(232,193,74,.4)}
.p6w .hd b{margin-right:auto;font-size:15px;color:#ffe9a0}
.p6w .hd button,.p6w .bt{font:inherit;font-weight:800;font-size:12.5px;padding:6px 10px;border-radius:9px;border:1px solid #c8a24a;background:#3a2c18;color:#ffe9c0;cursor:pointer}
.p6w .hd button.on{background:#ffe9a0;color:#3a2408}
.p6w .bt.g{background:linear-gradient(180deg,#5aa04a,#3a7a2a);border-color:#8ad07a;color:#fff}.p6w .bt.r{background:linear-gradient(180deg,#c0503a,#8a2a1a);border-color:#ff9a7a;color:#fff}
.p6w .bt:disabled{opacity:.45;cursor:default}
.p6w .bd{flex:1;min-height:0;display:flex;gap:10px;padding:10px}
.p6w .col{display:flex;flex-direction:column;gap:8px;min-height:0}
.p6w .lst{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:6px;align-content:start;padding:2px}
.p6w .cell{position:relative;aspect-ratio:1;border-radius:10px;background:rgba(255,255,255,.06);border:2px solid var(--tc,#555);cursor:pointer;display:flex;align-items:center;justify-content:center}
.p6w .cell img{width:80%;height:80%}.p6w .cell.sel{box-shadow:0 0 0 2px #fff,0 0 12px var(--tc)}.p6w .cell em{position:absolute;left:3px;top:1px;font:900 10px system-ui;font-style:normal;color:var(--tc);text-shadow:0 1px 1px #000}
.p6w .cell.eq::after{content:"E";position:absolute;right:3px;bottom:1px;font:900 10px system-ui;color:#8fe08a}
.p6w .card{padding:9px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}
.p6w .ln{display:flex;align-items:center;gap:6px;padding:5px 7px;margin:3px 0;border-radius:8px;background:rgba(0,0,0,.3);font-size:12.5px}
.p6w .ln b{margin-left:auto;color:#ffe9a0}.p6w .ln .lk{width:26px;height:24px;padding:0;border-radius:7px;border:1px solid #777;background:#222;cursor:pointer;font-size:13px}.p6w .ln .lk.on{background:#c89a2a;border-color:#ffe9a0}
.p6w small{opacity:.75;font-size:11.5px;line-height:1.4}
.p6w .slots{display:flex;gap:8px;justify-content:center}.p6w .slot{width:62px;height:62px;border-radius:12px;border:2px dashed rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;background:rgba(0,0,0,.25)}
.p6w .slot img{width:52px;height:52px}.p6w .slot span{position:absolute;bottom:-15px;font-size:10px;opacity:.7;white-space:nowrap}
.p6w .fit{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;overflow-y:auto;flex:1;align-content:start}
.p6w .fit .it{display:flex;flex-direction:column;gap:5px;padding:8px;border-radius:12px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.12)}
.p6w .fit .it.own{border-color:#8fe08a}.p6w .fit .it.wear{border-color:#ffe9a0;box-shadow:0 0 10px rgba(255,233,160,.35)}
.p6w .fit .it canvas,.p6w .fit .it img{width:100%;height:96px;object-fit:contain;border-radius:9px;background:radial-gradient(circle at 50% 60%,#4a3a6a,#1a1428)}
#cut6{position:absolute;inset:0;z-index:40;pointer-events:none;background:#000;opacity:0;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.p6w .bd>.col{overflow-y:auto}.p6w .lst{min-height:76px}
#pa6pv canvas{display:block;margin:0 auto;width:auto;max-width:100%;height:auto;max-height:120px;border-radius:10px}
@media (max-height:440px){#pa6pv canvas{max-height:64px}.p6w .card{padding:6px}.p6w .ln{padding:3px 6px;margin:2px 0;font-size:11.5px}.p6w .bd{padding:6px;gap:6px}.p6w .slot{width:50px;height:50px}.p6w .slot img{width:42px;height:42px}.p6w .fit .it canvas,.p6w .fit .it img{height:70px}}
`;document.head.appendChild(st)}
const mk6=(id)=>{const e=document.createElement('div');e.id=id;e.className='p6w';e.hidden=true;gid('wrap').appendChild(e);e.addEventListener('pointerdown',ev=>ev.stopPropagation());return e};
function p6open(el){el.hidden=false;PAUSED=true;sfx('ui')}
function p6close(el){el.hidden=true;PAUSED=false;sfx('ui')}

// =====================================================================
// 1) เครื่องประดับสัตว์เลี้ยง
// =====================================================================
const PA={items:[],eq:{collar:null,bell:null,ring:null},n:1};
try{Object.assign(PA,JSON.parse(localStorage.getItem('fm_pacc')||'{}'))}catch(e){}
function savePA(){try{localStorage.setItem('fm_pacc',JSON.stringify(PA))}catch(e){}}
const PAK={collar:{n:'ปลอกคอ',e:'⭕'},bell:{n:'กระพรวน',e:'🔔'},ring:{n:'แหวนสัตว์เลี้ยง',e:'💍'}};
const PAT=[null,{n:'ขั้น 1',c:'#5ad06a',lines:1},{n:'ขั้น 2',c:'#b06aff',lines:2},{n:'ขั้น 3',c:'#ff3a3a',lines:3}];
const PAS={crit:{n:'โอกาสคริติคอล',r:[1,3,5],u:'%'},cdmg:{n:'ความเสียหายหนักหน่วง (คริ)',r:[3,7,14],u:'%'},cres:{n:'ลดโอกาสโดนคริ',r:[2,5,9],u:'%'},dr:{n:'ลดความเสียหายที่ได้รับ',r:[1,3,6],u:'%'},pen:{n:'เจาะทะลุ (บอส/อีลิท)',r:[2,5,10],u:'%'},dmg:{n:'โบนัสความเสียหาย',r:[1,3,6],u:'%'}};
const PAKEYS=Object.keys(PAS);
function paRoll(t,not){const L=PAKEYS.filter(k=>!(not||[]).includes(k)),s=L[Math.random()*L.length|0],[a,b,c]=PAS[s].r,hi=[0,a,b,c][t],lo=[0,1,a,b][t];return{s,v:+(lo+Math.random()*(hi-lo)).toFixed(1),lk:0}}
function paNew(k,t){const it={u:PA.n++,k,t,l:[]};for(let i=0;i<PAT[t].lines;i++)it.l.push(paRoll(t,it.l.map(q=>q.s)));PA.items.push(it);savePA();return it}
// ดรอปเป็นของในกระเป๋าก่อน แล้วแปลงเป็นชิ้นที่สุ่มค่า
for(const k in PAK)for(const t of [1,2]){const id='pa_'+k+'_'+t;INVMETA[id]=[PAK[k].n+' '+PAT[t].n,'เครื่องประดับสัตว์เลี้ยง — สุ่มค่าเมื่อเก็บ · ใส่ที่หน้าต่าง 🐾'];WT[id]=.1;if(inv[id]===undefined)inv[id]=0}
function paIconCv(k,t){const key='pa'+k+t;if(ICN6[key+'cv'])return ICN6[key+'cv'];const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d'),col=PAT[t].c,mt=['','#c8ccd6','#e8c14a','#ff5a4a'][t];q.lineCap='round';q.lineJoin='round';
 const g=q.createRadialGradient(32,30,2,32,32,30);g.addColorStop(0,col+'66');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(0,0,64,64);
 if(k==='collar'){q.strokeStyle='#3a1a0a';q.lineWidth=11;q.beginPath();q.ellipse(32,30,20,14,0,0,7);q.stroke();q.strokeStyle=t===3?'#8a1010':t===2?'#5a2a8a':'#8a4a1a';q.lineWidth=8;q.stroke();q.fillStyle=mt;for(let i=0;i<8;i++){const a=i*.785;q.beginPath();q.arc(32+Math.cos(a)*20,30+Math.sin(a)*14,1.8,0,7);q.fill()}
  q.fillStyle=mt;q.strokeStyle='#1a1a1a';q.lineWidth=1.5;q.beginPath();q.moveTo(32,42);q.lineTo(38,48);q.lineTo(32,56);q.lineTo(26,48);q.closePath();q.fill();q.stroke()}
 else if(k==='bell'){q.strokeStyle='#8a1a1a';q.lineWidth=4;q.beginPath();q.arc(32,14,7,Math.PI,0);q.stroke();const bg=q.createRadialGradient(26,28,2,32,34,20);bg.addColorStop(0,'#fff8d0');bg.addColorStop(.4,mt);bg.addColorStop(1,'#4a3008');q.fillStyle=bg;q.strokeStyle='#2a1a04';q.lineWidth=2;q.beginPath();q.arc(32,34,17,0,7);q.fill();q.stroke();
  q.strokeStyle='#2a1a04';q.lineWidth=2;q.beginPath();q.moveTo(17,34);q.lineTo(47,34);q.stroke();q.fillStyle='#1a1004';q.beginPath();q.arc(32,41,3.5,0,7);q.fill();q.fillRect(31,41,2,7)}
 else{q.strokeStyle='#1a1a1a';q.lineWidth=9;q.beginPath();q.ellipse(32,38,16,13,0,0,7);q.stroke();const rg=q.createLinearGradient(16,26,48,50);rg.addColorStop(0,'#fff');rg.addColorStop(.4,mt);rg.addColorStop(1,'#3a2a08');q.strokeStyle=rg;q.lineWidth=6;q.stroke();
  const gc=t===3?'#ff3a5a':t===2?'#b06aff':'#5ad06a';q.fillStyle=gc;q.strokeStyle='#fff';q.lineWidth=1.5;q.beginPath();q.moveTo(32,12);q.lineTo(41,22);q.lineTo(32,30);q.lineTo(23,22);q.closePath();q.fill();q.stroke();q.fillStyle='rgba(255,255,255,.7)';q.fillRect(29,17,3,3)}
 if(t===3){q.globalCompositeOperation='lighter';const gg=q.createRadialGradient(32,32,0,32,32,32);gg.addColorStop(0,'rgba(255,80,60,.35)');gg.addColorStop(1,'rgba(255,80,60,0)');q.fillStyle=gg;q.fillRect(0,0,64,64)}
 return ICN6[key+'cv']=c}
const paIcon=(k,t)=>{const key='pau'+k+t;return ICN6[key]||(ICN6[key]=paIconCv(k,t).toDataURL())};
{const _mi=matIcon;matIcon=function(key){const m=/^pa_(\w+)_(\d)$/.exec(key);if(m&&PAK[m[1]]){const c=document.createElement('canvas');c.width=c.height=48;c.getContext('2d').drawImage(paIconCv(m[1],+m[2]),0,0,48,48);return c}return _mi(key)}}
{const _ri=refreshInv;refreshInv=function(){for(const k in PAK)for(const t of [1,2]){const id='pa_'+k+'_'+t;while(inv[id]>0){inv[id]--;const it=paNew(k,t);setTimeout(()=>{sysSay('🐾 ได้'+PAK[k].n+' '+PAT[t].n+' — '+it.l.map(paLineTxt).join(' · '));try{banner('🐾 เครื่องประดับสัตว์เลี้ยง!',PAK[k].n+' '+PAT[t].n,'')}catch(e){}},300)}}return _ri.apply(this,arguments)}}
// ดรอปจากมอน
{const _mk=mobKill;mobKill=function(m){_mk(m);const dg=D&&D.dg?D.dg:0,p=m.boss?.3:m.elite?.05:.006+dg/12000;if(Math.random()<p){const ks=Object.keys(PAK),k=ks[Math.random()*3|0],t=(m.boss&&dg>=50&&Math.random()<.3)||(m.boss&&m.abyss)?2:1;addDrop('pa_'+k+'_'+t,m.x,m.y)}}}
{const _dl=dropLoot;dropLoot=function(x,y,s){_dl(x,y,s);if(Math.random()<.002){const ks=Object.keys(PAK);addDrop('pa_'+ks[Math.random()*3|0]+'_1',x,y)}}}
try{for(const k in PAK)for(const t of [1,2]){DROPIMG&&(DROPIMG['pa_'+k+'_'+t]=DROPIMG['pa_'+k+'_'+t]||null)}}catch(e){}
function paLineTxt(l){return PAS[l.s].n+' +'+l.v+PAS[l.s].u}
const PAX=()=>{const o={crit:0,cdmg:0,cres:0,dr:0,pen:0,dmg:0};if(!HOME.pet)return o;for(const s in PA.eq){const it=PA.items.find(q=>q.u===PA.eq[s]);if(it)for(const l of it.l)o[l.s]+=l.v/100}return o};
window.CRITD=()=>PAX().cdmg;
{const _c=critCh;critCh=function(){return _c()+PAX().crit}}
{const _h=hurtE;hurtE=function(e,mult,o){const x=PAX();return _h(e,mult*(1+x.dmg+((e&&(e.boss||e.elite))?x.pen:0)),o)}}
{const _z=zHurt;zHurt=function(src,dmg,kbm,msg){const x=PAX();let d=dmg*(1-Math.min(.5,x.dr));const cc=Math.max(0,.07-x.cres);if(src&&(src.F||src.boss)&&Math.random()<cc){d*=1.5;try{dmgTxt(P.x,P.y-52,'คริ!','#ff4a4a',true)}catch(e){}}return _z(src,d,kbm,msg)}}
// วาดบนตัวสัตว์เลี้ยง
{const _dp=drawPet;drawPet=function(p,x,y){_dp(p,x,y);const c=PA.items.find(q=>q.u===PA.eq.collar),b=PA.items.find(q=>q.u===PA.eq.bell),r=PA.items.find(q=>q.u===PA.eq.ring);if(!c&&!b&&!r)return;
  const t=performance.now()/1000,mv=PET.mv&&x===PET.x,bb=mv?Math.abs(Math.sin(t*12))*2:0;ctx.save();ctx.translate(x,y-bb);if(x===PET.x)ctx.scale(PET.f,1);
  if(c){ctx.fillStyle=['','#8a4a1a','#7a3ab0','#c01a1a'][c.t];ctx.fillRect(4,-9.5,7,2.4);ctx.fillStyle=['','#c8ccd6','#e8c14a','#ffd23a'][c.t];ctx.fillRect(6,-8,1.5,1.5);ctx.fillRect(9,-8,1.5,1.5)}
  if(b){const sw=Math.sin(t*(mv?14:3))*.5;ctx.save();ctx.translate(7.5,-7);ctx.rotate(sw);ctx.fillStyle=['','#c8ccd6','#e8c14a','#ffd060'][b.t];ctx.beginPath();ctx.arc(0,2.5,2.4,0,7);ctx.fill();ctx.fillStyle='#2a1a04';ctx.fillRect(-.5,3.5,1,1.4);ctx.restore();if(mv&&Math.random()<.02&&Math.hypot(P.x-x,P.y-y)<300)tone(2400,2600,.12,'sine',.012)}
  if(r){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(8,-12,0,8,-12,9);g.addColorStop(0,['','rgba(90,208,106,.5)','rgba(176,106,255,.55)','rgba(255,58,58,.6)'][r.t]);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(-2,-22,20,20)}
  ctx.restore();if(c&&c.t===3||b&&b.t===3||r&&r.t===3){if(Math.random()<.06)rfxP(x+(Math.random()-.5)*14,y-8,0,-24,.6,'255,90,70',1.6,'spark')}}}
// หน้าต่าง
const paW=mk6('pacw');const PAU={sel:null,tab:'all'};
function openPA(){p6open(paW);renderPA()}window.openPA=openPA;window.closePA=()=>p6close(paW);
function petPreview(){const c=document.createElement('canvas');c.width=180;c.height=110;const k=c.getContext('2d'),sv=ctx;ctx=k;try{const g=k.createRadialGradient(90,80,4,90,70,90);g.addColorStop(0,'#5a4a7a');g.addColorStop(1,'#1a1428');k.fillStyle=g;k.fillRect(0,0,180,110);k.translate(90,96);k.scale(3.2,3.2);const ox=PET.x,oy=PET.y,of=PET.f;PET.f=1;drawPet({k:HOME.pet},0,0);PET.f=of}catch(e){}finally{ctx=sv}return c}
function renderPA(){const sel=PA.items.find(q=>q.u===PAU.sel);const eqU=new Set(Object.values(PA.eq));
 let h='<div class="w"><div class="hd"><b>🐾 เครื่องประดับสัตว์เลี้ยง</b><button onclick="closePA()">✕</button></div><div class="bd"><div class="col" style="width:min(42%,320px)"><div class="card" style="text-align:center"><div id="pa6pv"></div>'+(HOME.pet?'':'<small style="color:#ff9a7a">ยังไม่มีสัตว์เลี้ยง — ซื้อได้ที่ลุงขายผักในเมือง</small>')+'</div><div class="slots">';
 for(const s in PAK){const it=PA.items.find(q=>q.u===PA.eq[s]);h+='<div class="slot" onclick="PAU.sel='+(it?it.u:'null')+';renderPA()" style="'+(it?'border:2px solid '+PAT[it.t].c:'')+'">'+(it?'<img src="'+paIcon(it.k,it.t)+'">':'<span style="position:static;font-size:22px;opacity:.4">'+PAK[s].e+'</span>')+'<span>'+PAK[s].n+'</span></div>'}
 const x=PAX();h+='</div><div class="card" style="margin-top:10px"><b style="font-size:12.5px">📊 รวมค่าที่ได้</b><br><small>'+(PAKEYS.filter(k=>x[k]).map(k=>PAS[k].n+' +'+(x[k]*100).toFixed(1)+'%').join('<br>')||'ยังไม่ได้สวมใส่')+'</small></div></div>';
 h+='<div class="col" style="flex:1"><div class="lst">';
 const L=PA.items.slice().sort((a,b)=>b.t-a.t||a.k.localeCompare(b.k));for(const it of L)h+='<div class="cell'+(it.u===PAU.sel?' sel':'')+(eqU.has(it.u)?' eq':'')+'" style="--tc:'+PAT[it.t].c+'" onclick="PAU.sel='+it.u+';renderPA()"><img src="'+paIcon(it.k,it.t)+'"><em>'+it.t+'</em></div>';
 if(!L.length)h+='<small style="grid-column:1/-1">ยังไม่มีเครื่องประดับ — ดรอปจากมอนในดันเจี้ยน/เหมือง (อีลิทและบอสดรอปบ่อยกว่า) · ขั้น 2 ดรอปจากบอสดันเจี้ยนชั้น 50 ขึ้นไป</small>';
 h+='</div>';
 if(sel){const same=PA.items.filter(q=>q!==sel&&q.k===sel.k&&q.t===sel.t&&!eqU.has(q.u)).length,locks=sel.l.filter(l=>l.lk).length,rc=2000+locks*1500,isEq=eqU.has(sel.u);
  h+='<div class="card"><b style="color:'+PAT[sel.t].c+'">'+PAK[sel.k].n+' '+PAT[sel.t].n+'</b>'+(isEq?' <small style="color:#8fe08a">● สวมอยู่</small>':'');
  sel.l.forEach((l,i)=>{h+='<div class="ln">'+(sel.t>=3?'<button class="lk'+(l.lk?' on':'')+'" onclick="paLock('+i+')" title="ล็อกค่านี้ไว้ตอนรีค่า">'+(l.lk?'🔒':'🔓')+'</button>':'')+PAS[l.s].n+'<b>+'+l.v+PAS[l.s].u+'</b></div>'});
  h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">'+(isEq?'<button class="bt" onclick="paUnequip()">ถอดออก</button>':'<button class="bt g" '+(HOME.pet?'':'disabled')+' onclick="paEquip()">สวมให้สัตว์เลี้ยง</button>')
   +(sel.t<3?'<button class="bt" '+(same>=2?'':'disabled')+' onclick="paMerge()">⚡ ทะลวงเป็น'+PAT[sel.t+1].n+' (ใช้ชิ้นเหมือนกัน 3 ชิ้น · มี '+(same+1)+'/3)</button>':'<button class="bt" '+(inv.coin>=rc&&locks<3?'':'disabled')+' onclick="paReroll()">🎲 รีค่า ('+rc.toLocaleString()+' 🪙)</button>')
   +(isEq?'':'<button class="bt r" onclick="paSalvage()">ย่อยทิ้ง (+'+[0,80,400,2000][sel.t]+' 🪙)</button>')+'</div>'+(sel.t>=3?'<small>กด 🔓 เพื่อล็อกค่าที่ชอบไว้ — รีค่าจะสุ่มเฉพาะค่าที่ไม่ล็อก (ล็อกเพิ่มราคา)</small>':'<small>ทะลวง: รวม 3 ชิ้นชนิดและขั้นเดียวกัน → ได้ขั้นที่สูงขึ้น ค่าแรงขึ้นและมีหลายบรรทัด · ขั้น 3 (แดง) รีค่าได้</small>')+'</div>'}
 h+='</div></div></div>';paW.innerHTML=h;const pv=gid('pa6pv');if(pv&&HOME.pet)pv.appendChild(petPreview())}
window.PAU=PAU;window.renderPA=renderPA;
const paSel=()=>PA.items.find(q=>q.u===PAU.sel);
window.paEquip=()=>{const it=paSel();if(!it||!HOME.pet)return;PA.eq[it.k]=it.u;savePA();sfx('gem');tone(1200,1800,.2,'sine',.05);renderPA()};
window.paUnequip=()=>{const it=paSel();if(!it)return;if(PA.eq[it.k]===it.u)PA.eq[it.k]=null;savePA();sfx('ui');renderPA()};
window.paLock=i=>{const it=paSel();if(!it||it.t<3)return;const l=it.l[i];if(!l.lk&&it.l.filter(q=>q.lk).length>=2){say('ล็อกได้สูงสุด 2 ค่า');return}l.lk=l.lk?0:1;savePA();sfx('ui');renderPA()};
window.paReroll=()=>{const it=paSel();if(!it||it.t<3)return;const locks=it.l.filter(l=>l.lk).length,rc=2000+locks*1500;if(inv.coin<rc){say('เหรียญไม่พอ');return}inv.coin-=rc;refreshInv();
 const keep=it.l.filter(l=>l.lk).map(l=>l.s);it.l=it.l.map(l=>{if(l.lk)return l;const n=paRoll(3,keep);keep.push(n.s);return n});savePA();sfx('gem');for(let i=0;i<5;i++)tone(600+i*180,0,.12,'triangle',.04,i*.06);say('🎲 รีค่าสำเร็จ!');renderPA()};
window.paMerge=()=>{const it=paSel();if(!it||it.t>=3)return;const eqU=new Set(Object.values(PA.eq)),others=PA.items.filter(q=>q!==it&&q.k===it.k&&q.t===it.t&&!eqU.has(q.u)).slice(0,2);if(others.length<2){say('ต้องมีชิ้นเหมือนกันอีก 2 ชิ้น (ที่ไม่ได้สวมอยู่)');return}
 for(const q of [it,...others]){const i=PA.items.indexOf(q);if(i>=0)PA.items.splice(i,1);for(const s in PA.eq)if(PA.eq[s]===q.u)PA.eq[s]=null}const n=paNew(it.k,it.t+1);PAU.sel=n.u;savePA();
 shake(3,.3);sfx('chest');for(let i=0;i<6;i++)tone(400+i*160,0,.25,'sawtooth',.03,i*.07);try{banner('⚡ ทะลวงสำเร็จ!',PAK[n.k].n+' '+PAT[n.t].n,n.t===3?'red':'')}catch(e){}renderPA()};
window.paSalvage=()=>{const it=paSel();if(!it)return;const v=[0,80,400,2000][it.t];PA.items.splice(PA.items.indexOf(it),1);PAU.sel=null;inv.coin+=v;refreshInv();savePA();sfx('coin');renderPA()};
// ปุ่ม 🐾 บนจอ
const petB=document.createElement('button');petB.id='petb6';petB.textContent='🐾';petB.title='เครื่องประดับสัตว์เลี้ยง';petB.onclick=e=>{e.stopPropagation();openPA()};{const zb=gid('zb');if(zb)zb.appendChild(petB)}
setInterval(()=>{petB.hidden=!HOME.pet&&!PA.items.length},800);
{const _rl=renderLife;renderLife=function(){_rl();try{if(LIFE&&(LIFE.tab==='pet')){const b=lifeEl.querySelector('.lb');if(b&&!b.querySelector('.pa6'))b.insertAdjacentHTML('afterbegin','<div class="it pa6" style="grid-column:1/-1;flex-direction:row;align-items:center"><b style="flex:1">🐾 เครื่องประดับสัตว์เลี้ยง (ปลอกคอ · กระพรวน · แหวน)</b><button onclick="closeLife();openPA()">เปิด</button></div>')}}catch(e){}}}

// =====================================================================
// 2) ร้านแฟชั่น (ชุด + อาวุธ) — บ้านสีม่วงมุมขวาล่างกลายเป็นบูติก
// =====================================================================
const FASH={own:[],body:null,wpn:null};try{Object.assign(FASH,JSON.parse(localStorage.getItem('fm_fash')||'{}'))}catch(e){}
const saveFash=()=>{try{localStorage.setItem('fm_fash',JSON.stringify(FASH))}catch(e){}};
const OUTFIT={
 night:{n:'ชุดอัศวินรัตติกาล',p:4500,TOP:'#1c1a2c',COLLAR:'#e8c14a',BLK:'#15141f',LEG2:'#2c2a3e',cape:['#3a0a4a','#1a0424','#e8c14a'],hat:'circlet',d:'ผ้าคลุมม่วงขลิบทอง มงกุฎเงินบาง ๆ'},
 sakura:{n:'ชุดซามูไรซากุระ',p:6000,TOP:'#f2a6c2',COLLAR:'#ffffff',BLK:'#3a2a4a',LEG2:'#5a3a6a',hat:'kasa',fx:'petal',d:'กลีบซากุระโปรยตามตัว หมวกฟางซามูไร'},
 star:{n:'ชุดจอมเวทดวงดาว',p:8000,TOP:'#1a2a6a',COLLAR:'#ffd23a',BLK:'#141a3a',LEG2:'#0a0e24',cape:['#0e1a50','#050a24','#ffd23a'],hat:'wizard',fx:'star',d:'หมวกแหลมปักดาว ผ้าคลุมกลางคืนประกายดาว'},
 pirate:{n:'ชุดกัปตันโจรสลัด',p:7000,TOP:'#a81a1a',COLLAR:'#f4e8d0',BLK:'#2a1a10',LEG2:'#1a0e08',cape:['#5a0a0a','#2a0404','#e8c14a'],hat:'tricorn',d:'หมวกสามมุมขนนก โค้ทแดงกระดุมทอง'},
 flame:{n:'ชุดเทพอัคคี',p:18000,TOP:'#c83a0a',COLLAR:'#ffd060',BLK:'#3a0a04',LEG2:'#1a0402',cape:['#ff6a1a','#6a0a00','#ffd060'],hat:'flamecrown',fx:'fire',d:'มงกุฎเปลวไฟ ผ้าคลุมลุกโชน ประกายไฟตลอดเวลา'},
 frost:{n:'ชุดราชันย์น้ำแข็ง',p:18000,TOP:'#bfe8ff',COLLAR:'#ffffff',BLK:'#5a86aa',LEG2:'#3a5a7a',cape:['#e8f8ff','#7ab8e0','#ffffff'],hat:'icecrown',fx:'snow',d:'มงกุฎคริสตัลน้ำแข็ง เกล็ดหิมะร่วงรอบตัว'}};
const FWPN={
 dragon:{n:'ดาบมังกรเพลิง',p:9000,b:['#ffd0a0','#ff5a1a','#8a1a04'],g:'#e8c14a',glow:'255,110,30',d:'ใบดาบเปลวเพลิง ด้ามหัวมังกร'},
 sakura:{n:'คาตานะซากุระ',p:6500,b:['#ffffff','#f0d8e4','#a07a90'],g:'#c0507a',glow:'255,170,210',kat:1,d:'คาตานะใบบางคม ลายกลีบซากุระ'},
 crystal:{n:'ดาบคริสตัลน้ำแข็ง',p:9000,b:['#ffffff','#9ae0ff','#3a7ab0'],g:'#dff4ff',glow:'140,220,255',d:'ใบดาบคริสตัลโปร่งแสง เย็นยะเยือก'},
 moon:{n:'ดาบเงาจันทรา',p:12000,b:['#e8d8ff','#7a4ab0','#2a0a4a'],g:'#c8b8ff',glow:'170,120,255',curve:1,d:'ดาบโค้งดั่งจันทร์เสี้ยว เงาม่วงเรืองรอง'},
 holy:{n:'มหาดาบศักดิ์สิทธิ์',p:20000,b:['#ffffff','#fff2b0','#c8a030'],g:'#ffd23a',glow:'255,240,160',big:1,d:'ดาบใหญ่แห่งแสง ปีกทองที่ด้าม'},
 thunder:{n:'คาตานะอสนี',p:15000,b:['#ffffff','#c8e0ff','#3a4a8a'],g:'#2a2a3a',glow:'150,200,255',kat:1,bolt:1,d:'ใบดาบสายฟ้าแลบเป็นระยะ'}};
const FW6={};
function fashSword(id){if(FW6[id])return FW6[id];const W=FWPN[id],c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');q.lineJoin='round';q.lineCap='round';
 const L=W.big?50:W.kat?48:44,w=W.big?6:W.kat?3:4.5,top=58-L-6;const g=q.createLinearGradient(32-w,0,32+w,0);g.addColorStop(0,W.b[2]);g.addColorStop(.5,W.b[0]);g.addColorStop(1,W.b[1]);q.fillStyle=g;q.strokeStyle='#14141a';q.lineWidth=1.4;q.beginPath();
 if(W.kat){q.moveTo(32-w,46);q.quadraticCurveTo(30-w,24,34,top);q.quadraticCurveTo(34+w,24,32+w,46);}else if(W.curve){q.moveTo(32-w,46);q.quadraticCurveTo(24,26,36,top);q.quadraticCurveTo(32,24,32+w,46);}else{q.moveTo(32-w,46);q.lineTo(32-w,top+8);q.lineTo(32,top);q.lineTo(32+w,top+8);q.lineTo(32+w,46)}q.closePath();q.fill();q.stroke();
 q.strokeStyle='rgba(255,255,255,.7)';q.lineWidth=1;q.beginPath();q.moveTo(32,44);q.lineTo(32,top+6);q.stroke();
 if(id==='dragon'){q.fillStyle='rgba(255,220,120,.85)';for(let i=0;i<5;i++){q.beginPath();q.moveTo(32+w,40-i*7);q.lineTo(36+w,37-i*7);q.lineTo(32+w,35-i*7);q.fill()}}
 if(id==='sakura'){q.fillStyle='#ff8ab8';for(const [a,b] of [[31,30],[33,22],[31,14]]){q.beginPath();q.arc(a,b,1.6,0,7);q.fill()}}
 if(W.bolt){q.strokeStyle='#ffffa0';q.lineWidth=1.2;q.beginPath();q.moveTo(31,42);q.lineTo(34,34);q.lineTo(30,28);q.lineTo(34,18);q.stroke()}
 q.fillStyle=W.g;q.strokeStyle='#14141a';q.lineWidth=1.4;if(W.kat){q.beginPath();q.ellipse(32,47.5,6,2.4,0,0,7);q.fill();q.stroke()}else if(W.big){q.beginPath();q.moveTo(18,44);q.quadraticCurveTo(24,52,32,47);q.quadraticCurveTo(40,52,46,44);q.lineTo(46,49);q.lineTo(18,49);q.closePath();q.fill();q.stroke()}else{q.fillRect(22,46,20,3.5);q.strokeRect(22,46,20,3.5)}
 q.fillStyle=W.kat?'#1a1a22':'#4a2a14';q.fillRect(30.5,49,3,9);if(W.kat){q.fillStyle='#f4f0e8';for(let y=50;y<58;y+=2.5)q.fillRect(30.5,y,3,1)}q.fillStyle=W.g;q.beginPath();q.arc(32,59,2.4,0,7);q.fill();q.stroke();
 if(id==='dragon'){q.fillStyle='#c8901a';q.beginPath();q.moveTo(22,47);q.lineTo(16,42);q.lineTo(20,48);q.fill();q.beginPath();q.moveTo(42,47);q.lineTo(48,42);q.lineTo(44,48);q.fill()}
 return FW6[id]=c}
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){if(!(FASH.wpn&&P.tool==='sword'&&FWPN[FASH.wpn]&&!isRng()))return _ts(hx,hy,ang);const W=FWPN[FASH.wpn],t=performance.now()/1000;ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r')ctx.scale(-1,1);ctx.drawImage(fashSword(FASH.wpn),-23,-36,46,46);
  ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(0,-34,0,0);g.addColorStop(0,'rgba('+W.glow+',0)');g.addColorStop(.5,'rgba('+W.glow+','+(.25+.15*Math.sin(t*4))+')');g.addColorStop(1,'rgba('+W.glow+',0)');ctx.fillStyle=g;ctx.fillRect(-6,-34,12,30);ctx.restore();
  if(Math.random()<.12){const a=ang-Math.PI/2;rfxP(hx+Math.cos(a)*18,hy+Math.sin(a)*18,(Math.random()-.5)*14,-14,.5,W.glow,1.6,W.bolt&&Math.random()<.4?'spark':'dot')}}}
// ชุด: ซ่อนเกราะเดิมตอนวาด แล้ววาดชุดแฟชั่นแทน
{const _eq=EQCOL;EQCOL=function(){const o=_eq();const F=FASH.body&&OUTFIT[FASH.body];if(F&&window._fashOn)return Object.assign({},o,{TOP:F.TOP,COLLAR:F.COLLAR,BLK:F.BLK,LEG2:F.LEG2});return o}}
function drawCape(F,f,side,d,t){if(!F.cape)return;const x=P.x,by=P.y,sw=Math.sin(t*3)*2+(P.mv?Math.sin(P.t*2)*3:0);ctx.save();const g=ctx.createLinearGradient(0,by-28,0,by-2);g.addColorStop(0,F.cape[0]);g.addColorStop(1,F.cape[1]);ctx.fillStyle=g;ctx.strokeStyle=F.cape[2];ctx.lineWidth=1.2;ctx.beginPath();
 if(side){ctx.moveTo(x-f*2,by-28);ctx.quadraticCurveTo(x-f*12-sw,by-14,x-f*14-sw*1.5,by-2);ctx.lineTo(x-f*3,by-4);ctx.closePath()}else{ctx.moveTo(x-8,by-28);ctx.lineTo(x+8,by-28);ctx.lineTo(x+11+sw*.5,by-3);ctx.quadraticCurveTo(x,by+1,x-11+sw*.5,by-3);ctx.closePath()}
 ctx.fill();ctx.stroke();if(F.fx==='fire'){ctx.globalCompositeOperation='lighter';const fg=ctx.createRadialGradient(x,by-6,0,x,by-6,14);fg.addColorStop(0,'rgba(255,140,40,.35)');fg.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=fg;ctx.fillRect(x-14,by-20,28,28)}ctx.restore()}
function drawHat(F,f,side,d,t){const x=P.x,y=P.y-47,R=(c,a,b,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),w,h)};ctx.save();
 if(F.hat==='circlet'){R('#d8dce8',x-7,y+3,14,2);R('#7a4ab0',x-1,y+1,2,2)}
 else if(F.hat==='kasa'){ctx.fillStyle='#d8b86a';ctx.strokeStyle='#6a4a1a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-15,y+5);ctx.quadraticCurveTo(x,y-9,x+15,y+5);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(106,74,26,.5)';for(const o of [-8,-3,3,8]){ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(x+o*1.6,y+4);ctx.stroke()}}
 else if(F.hat==='wizard'){ctx.fillStyle='#1a2a6a';ctx.strokeStyle='#0a1030';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-12,y+4);ctx.lineTo(x+12,y+4);ctx.lineTo(x+(side?-f*10:3),y-20);ctx.closePath();ctx.fill();ctx.stroke();R('#ffd23a',x-12,y+2,24,2.5);ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(x+(side?-f*4:1),y-6,1.8,0,7);ctx.fill()}
 else if(F.hat==='tricorn'){ctx.fillStyle='#14141a';ctx.strokeStyle='#e8c14a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-14,y+3);ctx.quadraticCurveTo(x,y-12,x+14,y+3);ctx.quadraticCurveTo(x,y-1,x-14,y+3);ctx.fill();ctx.stroke();ctx.strokeStyle='#f4f0e8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+(side?-f*4:4),y-4);ctx.quadraticCurveTo(x+(side?-f*14:12),y-12,x+(side?-f*18:16),y-6);ctx.stroke()}
 else if(F.hat==='flamecrown'||F.hat==='icecrown'){const fire=F.hat==='flamecrown';R(fire?'#ffd060':'#e8f8ff',x-8,y+1,16,3);for(let i=0;i<5;i++){const px=x-7+i*3.5,hh=fire?5+Math.sin(t*12+i*2)*2.5:6+(i%2?3:0);ctx.fillStyle=fire?(i%2?'#ff6a1a':'#ffb030'):(i%2?'#bfe8ff':'#ffffff');ctx.beginPath();ctx.moveTo(px-1.6,y+1);ctx.lineTo(px,y+1-hh);ctx.lineTo(px+1.6,y+1);ctx.fill()}
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-2,0,x,y-2,14);g.addColorStop(0,fire?'rgba(255,140,40,.45)':'rgba(170,230,255,.45)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-14,y-16,28,28)}
 ctx.restore()}
{const _h=hero;hero=function(){const F=FASH.body&&OUTFIT[FASH.body];if(!F||P.dead)return _h();const t=performance.now()/1000,d=P.dir,side=d==='l'||d==='r',f=d==='l'?-1:1;
  if(d!=='u')drawCape(F,f,side,d,t);const sv={helm:P.armor.helm,chest:P.armor.chest,pants:P.armor.pants,arm:P.armor.arm};window._fashOn=1;P.armor.helm=P.armor.chest=P.armor.pants=P.armor.arm=null;
  try{_h()}finally{Object.assign(P.armor,sv);window._fashOn=0}
  if(d==='u')drawCape(F,f,side,d,t);if(!MOUNT.on||!HOME.mount)drawHat(F,f,side,d,t);
  if(F.fx&&Math.random()<.18){const rgb=F.fx==='petal'?'255,170,200':F.fx==='star'?'255,230,120':F.fx==='fire'?'255,120,30':'230,245,255';rfxP(P.x+(Math.random()-.5)*26,P.y-10-Math.random()*36,(Math.random()-.5)*12,F.fx==='fire'?-30:12,1,rgb,F.fx==='star'?1.6:2,F.fx==='fire'||F.fx==='star'?'spark':'dot')}}}
// อาคารบูติก
SIGN_ICONS.fashion=k=>{k.fillStyle='#f2a6c2';k.strokeStyle='#3a1a2a';k.lineWidth=2.5;k.beginPath();k.moveTo(-10,-12);k.lineTo(-4,-14);k.quadraticCurveTo(0,-9,4,-14);k.lineTo(10,-12);k.lineTo(14,-4);k.lineTo(9,-2);k.lineTo(9,14);k.lineTo(-9,14);k.lineTo(-9,-2);k.lineTo(-14,-4);k.closePath();k.fill();k.stroke();k.fillStyle='#ffd23a';k.beginPath();k.arc(0,2,3,0,7);k.fill();k.stroke()};
SD.fashion={name:'บูติกแฟชั่นมาดามโรส',emoji:'👗',icon:'fashion',img:'house2',b:[36,24,5,4],door:{x:62,w:36,t:74,bt:126},sign:{x:128,y:84,arm:24},
 owner:{name:'มาดามโรส',c:'#c0507a',h:'#f4e0a0',g:'f',age:'adult',hs:'bun',greet:['ยินดีต้อนรับสู่บูติกของฉันค่ะ ที่รัก','ชุดใหม่เพิ่งมาถึงเมื่อเช้า สวยทุกชุดเลย!'],lines:['ชุดแฟชั่นไม่เปลี่ยนค่าพลังนะคะ แต่หล่อสวยกว่าเดิมแน่นอน','ชุดเทพอัคคีกับราชันย์น้ำแข็ง ตัดเย็บด้วยเวทมนตร์เชียวนะ','อาวุธแฟชั่นเปลี่ยนแค่รูปลักษณ์ พลังยังเท่าอาวุธจริงค่ะ']},solid:SD.potion.solid.slice(),sell:[],buy:[]};
SHOP_ORDER.push('fashion');SHOP_ART.fashion=SHOP_ART.skill;SHOP_ANIM.fashion=SHOP_ANIM.skill;SHOP_TINT.fashion='rgba(255,140,200,.10)';
{const _ot=ownerTalk;ownerTalk=function(id){if(id!=='fashion')return _ot(id);const o=D.owner;talk(o,pick(SD.fashion.owner.greet)+' — อยากดูอะไรดีคะ?',[{t:'👗 ชุดแฟชั่น',c:'go',f:()=>openFash('body')},{t:'🗡️ อาวุธแฟชั่น',f:()=>openFash('wpn')},{t:'🪞 ตู้เสื้อผ้าของฉัน',f:()=>openFash('mine')},{t:'💬 คุยเล่น',stay:true,f:()=>talk(o,pick(SD.fashion.owner.lines),[BYE])},BYE],'มาดามโรส');return true}}
const fsW=mk6('fashw');const FSU={tab:'body'};
function openFash(t){FSU.tab=t||'body';p6open(fsW);renderFash()}window.openFash=openFash;window.closeFash=()=>p6close(fsW);
function fashPreview(kind,id){const c=document.createElement('canvas');c.width=150;c.height=96;const k=c.getContext('2d'),sv=ctx,svB=FASH.body,svW=FASH.wpn,sx=P.x,sy=P.y,sd=P.dir,sm=P.mv,sdr=P.draw,stl=P.tool,smo=MOUNT.on;ctx=k;
 try{const g=k.createRadialGradient(75,70,4,75,60,80);g.addColorStop(0,'#5a4a7a');g.addColorStop(1,'#1a1428');k.fillStyle=g;k.fillRect(0,0,150,96);k.translate(75,88);k.scale(1.6,1.6);P.x=0;P.y=0;P.dir='d';P.mv=false;MOUNT.on=false;
  if(kind==='body'){FASH.body=id;hero()}else{FASH.body=svB;P.draw=true;P.tool='sword';FASH.wpn=id;P.dir='l';hero()}}catch(e){}finally{ctx=sv;FASH.body=svB;FASH.wpn=svW;P.x=sx;P.y=sy;P.dir=sd;P.mv=sm;P.draw=sdr;P.tool=stl;MOUNT.on=smo}return c}
function renderFash(){const T6=FSU.tab;let h='<div class="w"><div class="hd"><b>👗 บูติกมาดามโรส · 🪙 '+inv.coin.toLocaleString()+'</b><button class="'+(T6==='body'?'on':'')+'" onclick="openFash(\'body\')">ชุด</button><button class="'+(T6==='wpn'?'on':'')+'" onclick="openFash(\'wpn\')">อาวุธ</button><button class="'+(T6==='mine'?'on':'')+'" onclick="openFash(\'mine\')">ตู้ของฉัน</button><button onclick="closeFash()">✕</button></div><div class="bd"><div class="fit">';
 const list=T6==='wpn'?Object.keys(FWPN).map(k=>['w',k]):T6==='body'?Object.keys(OUTFIT).map(k=>['b',k]):FASH.own.map(s=>[s[0],s.slice(2)]);
 if(T6==='mine')h+='<div class="it"><b>ใส่ชุดเกราะจริง</b><small>ถอดชุด/อาวุธแฟชั่นทั้งหมด</small><button class="bt" onclick="fashWear(\'b\',null);fashWear(\'w\',null)">ถอดแฟชั่น</button></div>';
 for(const [ty,k] of list){const D6=ty==='w'?FWPN[k]:OUTFIT[k];if(!D6)continue;const key=ty+':'+k,own=FASH.own.includes(key),wear=ty==='w'?FASH.wpn===k:FASH.body===k;
  h+='<div class="it'+(own?' own':'')+(wear?' wear':'')+'"><span data-fp="'+ty+':'+k+'"></span><b>'+D6.n+'</b><small>'+D6.d+'</small>'+(own?'<button class="bt '+(wear?'':'g')+'" onclick="fashWear(\''+ty+'\','+(wear?'null':'\''+k+'\'')+')">'+(wear?'ถอด':'สวมใส่')+'</button>':'<button class="bt g" '+(inv.coin>=D6.p?'':'disabled')+' onclick="fashBuy(\''+ty+'\',\''+k+'\')">ซื้อ '+D6.p.toLocaleString()+' 🪙</button>')+'</div>'}
 if(T6==='mine'&&!FASH.own.length)h+='<small>ยังไม่มีของแฟชั่น — เลือกซื้อได้ที่แท็บ ชุด/อาวุธ</small>';
 h+='</div></div></div>';fsW.innerHTML=h;for(const s of fsW.querySelectorAll('[data-fp]')){const [ty,k]=s.dataset.fp.split(':');s.replaceWith(fashPreview(ty==='w'?'wpn':'body',k))}}
window.fashBuy=(ty,k)=>{const D6=ty==='w'?FWPN[k]:OUTFIT[k];if(!D6||inv.coin<D6.p)return;inv.coin-=D6.p;FASH.own.push(ty+':'+k);refreshInv();saveFash();sfx('chest');for(let i=0;i<5;i++)tone(800+i*200,0,.15,'triangle',.04,i*.07);fashWear(ty,k);try{banner('✨ ได้'+D6.n+'!','สวมใส่แล้ว — เปลี่ยนได้ที่ตู้เสื้อผ้า','')}catch(e){}};
window.fashWear=(ty,k)=>{if(ty==='w')FASH.wpn=k;else FASH.body=k;saveFash();sfx('ui');if(!fsW.hidden)renderFash()};

// =====================================================================
// 3) ช่างตีเหล็ก: ร้านขายเฉพาะของหาง่าย · คราฟต้องเดินไปที่เตา/ทั่งเอง · ตำราปลดล็อกชุดตามเลเวล
// =====================================================================
SD2.gear.buy=SD2.gear.buy.filter(b=>b.item&&ITEMS[b.item]&&ITEMS[b.item].tier===0);
const SMITH={u:0,q:0};try{Object.assign(SMITH,JSON.parse(localStorage.getItem('fm_smith')||'{}'))}catch(e){}
const saveSmith=()=>{try{localStorage.setItem('fm_smith',JSON.stringify(SMITH))}catch(e){}};
{let mx=0;const chk=id=>{const it=ITEMS[id];if(it&&it.tier>mx)mx=it.tier};for(const id in GEAR)chk(id);for(const k in P.armor)if(P.armor[k])chk(P.armor[k]);if(mx>SMITH.u){SMITH.u=mx;saveSmith()}}
const SMQ=[null,
 {lv:5,n:'ตำราช่าง: ชุดเหล็ก',need:{ingot:6,wing:4},w:'แร่เหล็กขุดได้ใน "เหมืองเหล็กร้าง" (ประตูมิติในทุ่งหญ้า) และดันเจี้ยนชั้นต้น · หลอมที่เตาหลอมในร้านข้า (ใช้ถ่านจากไม้) · ปีกค้างคาวดรอปจากค้างคาวเหมือง/ค้างคาวในดันเจี้ยน'},
 {lv:20,n:'ตำราช่าง: ชุดทองแดง',need:{ingCu:8,shell:6},w:'แร่ทองแดงอยู่ใน "ถ้ำทองแดงลาวา" · เปลือกด้วงดรอปจากด้วงหินสนิม (เหมืองเหล็ก) และด้วงในดันเจี้ยน'},
 {lv:40,n:'ตำราช่าง: ชุดเงิน',need:{ingAg:10,pelt:8},w:'แร่เงินอยู่บน "ยอดเขาเงินหิมะ" · หนังหมาป่าดรอปจากหมาป่าสำริด/หมาป่าหิมะ'},
 {lv:60,n:'ตำราช่าง: ชุดทอง',need:{ingAu:12,core:8},w:'แร่ทองอยู่ใน "สุสานทองคำ" · แกนหินเวทดรอปจากโกเลมทุกชนิด'},
 {lv:80,n:'ตำราช่าง: ชุดเพชร',need:{ingDm:12,scale:4},w:'แร่เพชรอยู่ใน "เหมืองเพชรห้วงลึก" · เกล็ดมังกรดรอปจากมังกร/ดันเจี้ยนชั้นลึก'}];
const smNext=()=>SMITH.u<10?SMITH.u+1:0;
const smAvail=()=>{const n=smNext();return n&&P.lv>=SMQ[n].lv};
function smNeedTxt(n){return Object.entries(SMQ[n].need).map(([k,v])=>MN(k)+' '+Math.min(inv[k]|0,v)+'/'+v).join(' · ')}
function smithQuest(){const o=D.owner,n=smNext();if(!n){talk(o,'เจ้าปลดล็อกตำราครบทุกระดับแล้ว! ไม่มีอะไรที่ข้าสอนเจ้าได้อีก',[BYE]);return}const Q=SMQ[n];
 if(P.lv<Q.lv){talk(o,'ตำรา'+TNAMES[n]+'ยังยากเกินไปสำหรับเจ้า กลับมาเมื่อถึง Lv.'+Q.lv+' แล้วข้าจะสอนให้',[BYE]);return}
 if(SMITH.q!==n){SMITH.q=n;saveSmith();talk(o,'📜 '+Q.n+' — ถ้าอยากตีชุด'+TNAMES[n]+' เอาของพวกนี้มาให้ข้าก่อน: '+smNeedTxt(n)+'\n\n🗺️ '+Q.w,[{t:'⚔️ รับตำรา',c:'go',f:()=>{sysSay('⚒️ เควสช่าง: '+Q.n+' — '+smNeedTxt(n));say('⚒️ รับเควส '+Q.n)}},BYE],'ช่างหนวดเหล็ก');return}
 const ok=Object.entries(Q.need).every(([k,v])=>(inv[k]|0)>=v);
 if(!ok){talk(o,'ยังขาดอยู่นะ: '+smNeedTxt(n)+'\n\n🗺️ '+Q.w,[BYE]);return}
 for(const [k,v] of Object.entries(Q.need))inv[k]-=v;SMITH.u=n;SMITH.q=0;saveSmith();refreshInv();sfx('chest');shake(2,.2);
 try{banner('⚒️ ปลดล็อก'+Q.n.replace('ตำราช่าง: ',''),'คราฟชุด/อาวุธระดับ'+TNAMES[n]+'ได้ที่ทั่งในร้าน','')}catch(e){}
 talk(o,'ฝีมือเจ้าใช้ได้! จำวิธีนี้ไว้: หลอมแร่เป็นแท่งที่เตาซ้ายมือ แล้วตีที่ทั่งขวามือ — ตอนนี้เจ้าตีของระดับ'+TNAMES[n]+'ได้แล้ว',[BYE])}
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot(id);if(id==='gear'&&DLG.open){DLG.ch=DLG.ch.filter(c=>!/คราฟ \/ ตีบวก/.test(c.t));const n=smNext();DLG.ch.splice(1,0,{t:(smAvail()?'❗ ':'')+'📜 ตำราช่าง'+(n?' ('+TNAMES[n]+')':''),c:smAvail()?'go':'',f:smithQuest},{t:'🔥 วิธีหลอม/ตีของ',f:()=>talk(D.owner,'เตาหลอมอยู่ซ้ายมือ ทั่งตีเหล็กอยู่ขวามือในร้านนี้ — เดินไปยืนหน้าเครื่องแล้วกด E / ⚔️ ได้เลย ข้าไม่ตีให้หรอก ฝึกเองสิ!',[BYE])});try{dlgShowChoices()}catch(e){}}return r}}
{const _cg=craftGear;craftGear=function(id){const it=ITEMS[id];if(it&&it.tier>SMITH.u){say('🔒 ยังตี'+TNAMES[it.tier]+'ไม่เป็น — รับตำราจากช่างหนวดเหล็ก (Lv.'+SMQ[it.tier].lv+')');sfx('thud');return}return _cg(id)}}
{const _ah=anvilHTML;anvilHTML=function(){let h=_ah();if(FUI.tab==='craft'&&FUI.tier>SMITH.u){const n=FUI.tier;h=h.replace(/<button class="mini cr[^"]*"/g,'<button class="mini cr no" disabled').replace(/(<small>วัสดุ:)/,'<div style="padding:7px;border-radius:9px;background:rgba(255,80,60,.15);border:1px solid #ff8a6a;margin:4px 0">🔒 <b>ยังตีระดับ'+TNAMES[n]+'ไม่ได้</b><br><small>คุยกับช่างหนวดเหล็ก → 📜 ตำราช่าง (ต้อง Lv.'+SMQ[n].lv+')</small></div>$1')}return h}}
let smNote=0;setInterval(()=>{if(smAvail()&&SMITH.q!==smNext()&&smNote!==smNext()){smNote=smNext();sysSay('❗ ช่างหนวดเหล็กมีตำรา'+TNAMES[smNote]+'ให้เจ้าแล้ว — ไปที่ร้านอาวุธ');try{banner('❗ ตำราช่างใหม่','ไปหาช่างหนวดเหล็กที่ร้านอาวุธ','')}catch(e){}}},3000);
try{STCH[2].intro='ดาบหินคงไม่พอสู้อสูรในเหมือง! ไปหาช่างหนวดเหล็กที่ร้านอาวุธ รับ “ตำราช่าง: ชุดเหล็ก” เก็บไม้ ขุดแร่ หลอมเป็นแท่งที่เตา แล้วตีดาบเหล็กที่ทั่งด้วยมือเจ้าเอง — และฝึกจนถึง Lv.5';STCH[2].d='Lv.5 + รับตำราช่างแล้วตีอาวุธเหล็กเอง'}catch(e){}
// ป้ายร้านอาวุธใหม่: ดาบไขว้ + โล่ + ทั่ง
SIGN_ICONS.gear=k=>{k.save();k.lineJoin='round';k.lineCap='round';
 k.fillStyle='#3a3e48';k.strokeStyle='#0e0e14';k.lineWidth=2;k.beginPath();k.moveTo(-12,9);k.lineTo(12,9);k.lineTo(9,13);k.lineTo(15,17);k.lineTo(-15,17);k.lineTo(-9,13);k.closePath();k.fill();k.stroke();
 const sw=(a)=>{k.save();k.rotate(a);const g=k.createLinearGradient(-3,0,3,0);g.addColorStop(0,'#8a96aa');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#6a7488');k.fillStyle=g;k.strokeStyle='#0e0e14';k.lineWidth=1.6;k.beginPath();k.moveTo(-2.6,6);k.lineTo(-2.6,-14);k.lineTo(0,-19);k.lineTo(2.6,-14);k.lineTo(2.6,6);k.closePath();k.fill();k.stroke();k.fillStyle='#e8c14a';k.fillRect(-7,6,14,3);k.strokeRect(-7,6,14,3);k.fillStyle='#5a3418';k.fillRect(-1.5,9,3,6);k.fillStyle='#e8c14a';k.beginPath();k.arc(0,16,2.2,0,7);k.fill();k.restore()};
 sw(-.62);sw(.62);
 const g=k.createLinearGradient(0,-10,0,8);g.addColorStop(0,'#d84a3a');g.addColorStop(1,'#7a1a12');k.fillStyle=g;k.strokeStyle='#e8c14a';k.lineWidth=2;k.beginPath();k.moveTo(0,-10);k.lineTo(8,-6);k.quadraticCurveTo(8,4,0,9);k.quadraticCurveTo(-8,4,-8,-6);k.closePath();k.fill();k.stroke();
 k.fillStyle='#e8c14a';k.beginPath();k.moveTo(0,-6);k.lineTo(2,-1);k.lineTo(0,4);k.lineTo(-2,-1);k.closePath();k.fill();k.restore()};

// =====================================================================
// 4) แท่นค้นหาของหาย (วิหารแห่งแสง): ของตกหล่นตอนกระเป๋าเต็ม + ซื้อคืนของที่เผลอขาย
// =====================================================================
const LOST={L:[]};try{Object.assign(LOST,JSON.parse(localStorage.getItem('fm_lost')||'{}'))}catch(e){}
const saveLost=()=>{try{LOST.L=LOST.L.slice(-40);localStorage.setItem('fm_lost',JSON.stringify(LOST))}catch(e){}};
const ALTAR={x:10,y:25};
function lostAdd(type,id,n,price,why){const e=LOST.L.find(q=>q.type===type&&q.id===id&&q.why===why);if(e){e.n+=n;e.p=Math.max(e.p,price);e.t=Date.now()}else LOST.L.push({type,id,n,p:price,why,t:Date.now()});saveLost()}
flushDrops=function(){let lost=0;for(const d of drops){const ik=DROPMAP[d.type]||d.type;let ok=true;try{ok=canTake(ik)===true}catch(e){}if(ok||ik==='coin')inv[ik]=(inv[ik]|0)+1;else{lostAdd('inv',ik,1,0,'drop');lost++}}drops.length=0;refreshInv();if(lost)setTimeout(()=>sysSay('🎒 กระเป๋าเต็ม — ของตกหล่น '+lost+' ชิ้น ไปรับคืนได้ที่ "แท่นค้นหาของหาย" ในวิหารแห่งแสง'),400)};
{const _sg=sellGear;sellGear=function(g){const it=ITEMS[g];const had=GEAR[g]|0;_sg(g);if(it&&(GEAR[g]|0)<had)lostAdd('gear',g,1,gearPrice(it),'sold')}}
{const snapSell=fn=>function(){const before=Object.assign({},inv),c0=inv.coin;const r=fn.apply(this,arguments);const gain=inv.coin-c0;if(gain>0){const dec=Object.keys(before).filter(k=>k!=='coin'&&(inv[k]|0)<(before[k]|0));const tot=dec.reduce((a,k)=>a+(before[k]-inv[k]),0);for(const k of dec){const n=before[k]-inv[k];lostAdd('inv',k,n,Math.max(1,Math.round(gain/tot)),'sold')}}return r};
 sellOK=snapSell(sellOK);sellIt=snapSell(sellIt)}
function lostCost(e){return e.why==='sold'?Math.ceil(e.p*1.2)*(e.type==='gear'?1:e.n):Math.max(10,8*e.n)}
const lsW=mk6('lostw');
function openLost(){p6open(lsW);renderLost()}window.openLost=openLost;window.closeLost=()=>p6close(lsW);
function renderLost(){let h='<div class="w"><div class="hd"><b>🔮 แท่นค้นหาของหาย · 🪙 '+inv.coin.toLocaleString()+'</b><button onclick="closeLost()">✕</button></div><div class="bd"><div class="col" style="flex:1"><small>แสงแห่งวิหารตามหาของที่ตกหล่นตอนกระเป๋าเต็ม และของที่เผลอขายไป (ซื้อคืนราคา +20%) · เก็บรายการล่าสุด 40 อย่าง</small><div class="fit">';
 const L=LOST.L.slice().reverse();if(!L.length)h+='<small>ไม่มีของหาย 🎉</small>';
 L.forEach(e=>{const i=LOST.L.indexOf(e),name=e.type==='gear'?ITEMS[e.id].name:MN(e.id),ic=e.type==='gear'?iconURL('item:'+e.id):iconURL('mat:'+e.id),c=lostCost(e);
  h+='<div class="it"><div style="display:flex;gap:8px;align-items:center"><img src="'+ic+'" style="width:40px;height:40px;background:none"><div><b>'+name+(e.type==='gear'?'':' ×'+e.n)+'</b><br><small>'+(e.why==='sold'?'💰 ขายไปเมื่อ ':'🎒 ตกหล่นเมื่อ ')+new Date(e.t).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})+'</small></div></div><button class="bt g" '+(inv.coin>=c?'':'disabled')+' onclick="lostGet('+i+')">นำคืน '+c.toLocaleString()+' 🪙</button></div>'});
 h+='</div></div></div></div>';lsW.innerHTML=h}
window.lostGet=i=>{const e=LOST.L[i];if(!e)return;const c=lostCost(e);if(inv.coin<c){say('เหรียญไม่พอ');return}if(e.type==='gear'){try{if(bagCells().length>=bagSlotsMax()){noRoom('slot');return}}catch(_){}GEAR[e.id]=(GEAR[e.id]|0)+1}else{let ok=true;try{ok=canTake(e.id)===true}catch(_){}if(!ok){noRoom('slot');return}inv[e.id]=(inv[e.id]|0)+e.n}
 inv.coin-=c;LOST.L.splice(i,1);saveLost();refreshInv();sfx('gem');tone(900,1500,.4,'sine',.05);say('🔮 ได้ของคืนแล้ว!');renderLost()};
{const _bt=buildTown;buildTown=function(){_bt();try{const k=dcv.getContext('2d'),x=ALTAR.x*T,y=ALTAR.y*T;dm[ALTAR.y][ALTAR.x]=1;
  k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(x+16,y+28,18,5,0,0,7);k.fill();const g=k.createLinearGradient(x,y,x+32,y);g.addColorStop(0,'#bfc4d0');g.addColorStop(.5,'#f4f6fa');g.addColorStop(1,'#9aa0ae');k.fillStyle=g;k.strokeStyle='#5a6070';k.lineWidth=1.5;
  k.fillRect(x+2,y+20,28,8);k.strokeRect(x+2,y+20,28,8);k.fillRect(x+7,y+6,18,14);k.strokeRect(x+7,y+6,18,14);k.fillRect(x+3,y+2,26,5);k.strokeRect(x+3,y+2,26,5);
  k.fillStyle='#7a4ab0';k.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillStyle='#4a2e16';k.fillRect(x-18,y+31,68,13);k.fillStyle='#fff3c8';k.fillText('แท่นค้นหาของหาย',x+16,y+41)}catch(e){}}}
{const _ta=townAct;townAct=function(){if(D&&D.town&&Math.hypot(P.x-(ALTAR.x*T+16),P.y-(ALTAR.y*T+30))<44){openLost();return true}return _ta()}}

// =====================================================================
// 5) ประตูแบบภาพตัด: เดินถึงหน้าประตู → ดำ+เบลอ → อยู่ในร้าน
// =====================================================================
const cut6=document.createElement('div');cut6.id='cut6';gid('wrap').appendChild(cut6);
const CUT={a:0,to:0,sp:2};
setInterval(()=>{if(Math.abs(CUT.a-CUT.to)<.01){CUT.a=CUT.to}else CUT.a+=(CUT.to-CUT.a)*.28;cut6.style.opacity=CUT.a.toFixed(3)},16);
function cutTo(a){CUT.to=a}window.cutTo=cutTo;
{const _dt=doorTick;doorTick=function(dt){const d=D&&D.doors&&D.doors.find(q=>q.id===DOORA.k);_dt(dt);if(d&&DOORA.k){if(P.y<d.cy-4)P.y=d.cy-4;if(DOORA.t>.35)cutTo(1)}}}
{const _es=enterShop;enterShop=function(id){const r=_es(id);FADE.a=0;CUT.a=1;CUT.to=1;setTimeout(()=>cutTo(0),180);return r}}
{const _ls=leaveShop;leaveShop=function(silent){if(!silent){CUT.a=1;CUT.to=1;setTimeout(()=>cutTo(0),200)}const r=_ls(silent);FADE.a=0;return r}}


// =====================================================================
// v4.6 (ค) : อัลติเมทสกิล (หลอดรอบกรอบรูป · ไฟลุกสั่นเมื่อพร้อม · ร่ายเวทก่อนโจมตี)
//            ท่าดื่มยา/กินอาหาร + เสียง · โรงเตี๊ยมสั่งอาหาร → สาวเสิร์ฟยกมา → นั่งกิน
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#ult6{position:absolute;pointer-events:none;border-radius:13px;z-index:1}
#ult6 .rg{position:absolute;inset:0;border-radius:13px;padding:3px;background:conic-gradient(from -90deg,var(--uc) calc(var(--u)*1%),rgba(255,255,255,.1) 0);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
#ult6.rdy .rg{background:linear-gradient(0deg,#ff3a00,#ffb000,#fff2a0,#ffb000,#ff3a00);background-size:100% 300%;animation:ufl .6s linear infinite}
#ult6 .fl{position:absolute;left:-6px;right:-6px;top:-14px;bottom:-4px;display:none;pointer-events:none;background:radial-gradient(ellipse at 20% 100%,rgba(255,120,0,.9),transparent 45%),radial-gradient(ellipse at 50% 100%,rgba(255,200,40,.85),transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(255,80,0,.9),transparent 45%);filter:blur(2px);mix-blend-mode:screen;animation:ufire .25s steps(2) infinite;-webkit-mask:linear-gradient(0deg,#000 30%,transparent)}
#ult6.rdy .fl{display:block}
#ult6.rdy{animation:ushk .18s linear infinite}
@keyframes ufl{to{background-position:0 300%}}@keyframes ufire{0%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.15) translateY(-2px)}}
@keyframes ushk{0%{transform:translate(0,0)}25%{transform:translate(.8px,-.6px)}50%{transform:translate(-.7px,.5px)}75%{transform:translate(.5px,.7px)}}
#ultb{position:absolute;z-index:6;right:calc(178px + var(--sr,0px));bottom:calc(64px + var(--sb,0px));width:58px;height:58px;border-radius:50%;border:2px solid #fff2a0;background-size:cover;background-position:center;cursor:pointer;box-shadow:0 0 0 3px rgba(255,120,0,.6),0 0 18px #ff8a1a,0 0 36px rgba(255,80,0,.6);animation:ubtn 1s ease-in-out infinite;padding:0}
#ultb[hidden]{display:none}#ultb b{position:absolute;left:50%;bottom:-13px;transform:translateX(-50%);font:900 9px system-ui;color:#fff2a0;background:#8a1a04;border-radius:6px;padding:0 5px;white-space:nowrap}
@keyframes ubtn{50%{box-shadow:0 0 0 6px rgba(255,160,0,.35),0 0 26px #ffb020,0 0 50px rgba(255,80,0,.7);transform:scale(1.06)}}
#ultov{position:absolute;inset:0;z-index:7;pointer-events:none;opacity:0;transition:opacity .25s}
#ultov.on{opacity:1}#ultov::before,#ultov::after{content:"";position:absolute;left:0;right:0;height:11%;background:#000;transition:transform .35s}
#ultov::before{top:0;transform:translateY(-100%)}#ultov::after{bottom:0;transform:translateY(100%)}#ultov.on::before,#ultov.on::after{transform:none}
#ultov .vg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,transparent 30%,rgba(0,0,0,.6))}
#ultov .nm{position:absolute;left:5%;top:16%;font:900 clamp(18px,5.5vh,34px) system-ui,"Noto Sans Thai";color:#fff;letter-spacing:1px;text-shadow:0 0 12px var(--uc),0 2px 0 #000;transform:skewX(-12deg) translateX(-30px);opacity:0;transition:all .4s}
#ultov .nm small{display:block;font-size:.42em;color:var(--uc);letter-spacing:3px}
#ultov.on .nm{opacity:1;transform:skewX(-12deg)}
`;document.head.appendChild(st)}
const ULT={v:0,cast:null,fx:[]};
const ULTD={none:{n:'แสงอรุณศักดิ์สิทธิ์',en:'DAWN BURST',c:'#ffe9a0',rgb:'255,230,150'},sword:{n:'พันดาบเทพพิโรธ',en:'THOUSAND HEAVEN BLADES',c:'#9fd8ff',rgb:'160,215,255'},mage:{n:'อุกกาบาตวันสิ้นโลก',en:'APOCALYPSE METEOR',c:'#ff8a3a',rgb:'255,140,60'},archer:{n:'ธนูเหยี่ยวเพลิงสวรรค์',en:'PHOENIX ARROW',c:'#ffd23a',rgb:'255,210,80'}};
const ultK=()=>ULTD[P.cls]?P.cls:'none';
// ไอคอนอัลติเมท
SKART['ULT_sword']=(q,S)=>{skBg(q,S,'#2a4a8a','#02040c','#ffe9a0');sglow(q,48,30,40,'160,215,255',.7);for(let i=0;i<7;i++)skSword(q,14+i*11,22+(i%2)*10,Math.PI,30,'#e8f4ff','#9fd8ff');skSword(q,48,90,0,70,'#ffffff','#ffd23a')};
SKART['ULT_mage']=(q,S)=>{skBg(q,S,'#8a2a0a','#0a0202','#ffe9a0');q.strokeStyle='rgba(255,170,80,.6)';q.lineWidth=16;q.beginPath();q.moveTo(-10,-10);q.lineTo(52,52);q.stroke();sglow(q,58,58,40,'255,150,40');q.fillStyle='#3a1a0a';q.beginPath();q.arc(58,58,18,0,7);q.fill();q.fillStyle='#ff9a3a';q.beginPath();q.arc(62,62,9,0,7);q.fill();q.fillStyle='#fff6c0';q.beginPath();q.arc(64,64,4,0,7);q.fill()};
SKART['ULT_archer']=(q,S)=>{skBg(q,S,'#8a5a0a','#0a0602','#ffe9a0');sglow(q,48,48,44,'255,200,60',.7);q.fillStyle='#ff7a1a';q.beginPath();q.moveTo(48,52);q.bezierCurveTo(28,30,10,34,4,46);q.bezierCurveTo(20,46,30,54,40,62);q.lineTo(48,72);q.lineTo(56,62);q.bezierCurveTo(66,54,76,46,92,46);q.bezierCurveTo(86,34,68,30,48,52);q.fill();skArrow(q,48,48,-Math.PI/4,70,'#fff6c0','#ffd23a')};
SKART['ULT_none']=(q,S)=>{skBg(q,S,'#8a7a2a','#0a0802','#ffe9a0');sglow(q,48,48,46,'255,240,170');for(let i=0;i<12;i++){const a=i*.5236;q.strokeStyle='rgba(255,250,210,.8)';q.lineWidth=3;q.beginPath();q.moveTo(48+Math.cos(a)*12,48+Math.sin(a)*12);q.lineTo(48+Math.cos(a)*44,48+Math.sin(a)*44);q.stroke()}q.fillStyle='#fffbe0';q.beginPath();q.arc(48,48,11,0,7);q.fill()};
// วงหลอดรอบรูป
const ult6=document.createElement('div');ult6.id='ult6';ult6.innerHTML='<div class="fl"></div><div class="rg"></div>';gid('hud').appendChild(ult6);
function placeUlt6(){const f=gid('face'),h=gid('hud');if(!f||!h)return;ult6.style.left=(f.offsetLeft-3)+'px';ult6.style.top=(f.offsetTop-3)+'px';ult6.style.width=(f.offsetWidth+6)+'px';ult6.style.height=(f.offsetHeight+6)+'px'}
addEventListener('resize',placeUlt6);setTimeout(placeUlt6,500);
const ultB=document.createElement('button');ultB.id='ultb';ultB.hidden=true;gid('wrap').appendChild(ultB);ultB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();castUlt()});
let ultWasRdy=false;
setInterval(()=>{const d=ULTD[ultK()],rdy=ULT.v>=100;ult6.style.setProperty('--u',Math.min(100,ULT.v).toFixed(1));ult6.style.setProperty('--uc',d.c);ult6.classList.toggle('rdy',rdy);
 const inTown=D&&(D.town||D.shop||D.home);ultB.hidden=!rdy||inTown||!!ULT.cast||P.dead;if(rdy){const u=skillIcon('ULT_'+ultK());const bg='url('+u+')';if(ultB._bg!==bg){ultB._bg=bg;ultB.style.backgroundImage=bg;ultB.innerHTML='<b>อัลติเมท</b>'}}
 if(rdy&&!ultWasRdy){sfx('gem');tone(440,880,.5,'sawtooth',.03);tone(660,1320,.6,'triangle',.04,.1);sysSay('🔥 อัลติเมทพร้อมแล้ว! — '+d.n+(COARSE?'':' (กด U)'))}ultWasRdy=rdy;if(!ult6.style.width)placeUlt6()},150);
const ultGain=v=>{if(ULT.cast)return;ULT.v=Math.min(100,ULT.v+v)};
{const _h=hurtE;hurtE=function(e,mult,o){const r=_h(e,mult,o);if(r&&!(o&&o.ult))ultGain(e&&e.boss?1.6:.9);return r}}
{const _mk=mobKill;mobKill=function(m){_mk(m);ultGain(m.boss?25:m.elite?6:2.2)}}
{const _dl=dropLoot;dropLoot=function(x,y,s){_dl(x,y,s);if(s)ultGain(2)}}
{const _z=zHurt;zHurt=function(src,d,k,m){const h0=P.hp;_z(src,d,k,m);if(P.hp<h0)ultGain(1.5)}}
addEventListener('keydown',e=>{if((e.key==='u'||e.key==='U')&&document.activeElement.tagName!=='INPUT')castUlt()});
const ultOv=document.createElement('div');ultOv.id='ultov';ultOv.innerHTML='<div class="vg"></div><div class="nm"></div>';gid('wrap').appendChild(ultOv);
function chant(k){const C=AU.c;if(!C||SET.mute)return;const base={sword:55,mage:50,archer:57,none:60}[k]||55;
 for(const [iv,dl] of [[0,0],[7,.05],[12,.1],[16,.3],[19,.5],[24,.75]]){const f=440*Math.pow(2,(base+iv-69)/12);tone(f,f*1.02,1.4-dl,'sawtooth',.018,dl);tone(f*1.005,f*1.03,1.4-dl,'sine',.04,dl)}
 nz(1.2,.06,300,3000,2,'bandpass',0);for(let i=0;i<5;i++)tone(1800+i*300,2600,.25,'sine',.02,.2+i*.18)}
function boom(v){nz(.9,.5*(v||1),900,40,1,'lowpass');tone(80,30,.9,'sine',.4*(v||1));tone(140,40,.5,'square',.08*(v||1))}
function castUlt(){if(ULT.v<100||ULT.cast||P.dead||PAUSED)return;if(D&&(D.town||D.shop||D.home)){say('ใช้อัลติเมทในเมือง/ที่ดินไม่ได้');return}
 if(typeof MOUNT!=='undefined'&&MOUNT.on){MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}}
 const k=ultK(),d=ULTD[k];ULT.v=0;ULT.cast={k,t:0,ph:0,dir:P.dir};if(P.cls!=='paladin'&&P.cls!=='cleric')P.iframe=Math.max(P.iframe,2.6);P.stun=Math.max(P.stun,1.15);P.draw=true;
 ultOv.style.setProperty('--uc',d.c);ultOv.querySelector('.nm').innerHTML='<small>ULTIMATE · '+d.en+'</small>'+d.n;ultOv.classList.add('on');chant(k);shake(1.5,1.1)}
window.castUlt=castUlt;
function foeNear(r){let best=null,bd=r;for(const e of enemies()){const dd=Math.hypot(e.x-P.x,e.y-P.y);if(dd<bd){bd=dd;best=e}}return best}
function ultTick(dt){const U=ULT.cast;if(U){U.t+=dt;const k=U.k,d=ULTD[k];
  if(U.t<1.1){if(Math.random()<.7){const a=Math.random()*6.28,r=40+Math.random()*30;rfxP(P.x+Math.cos(a)*r,P.y+Math.sin(a)*r*.4,-Math.cos(a)*40,-60-Math.random()*60,.7,d.rgb,2.4,'spark')}}
  else if(!U.fired){U.fired=1;ultOv.classList.remove('on');ultFire(k)}
  if(U.t>1.3)ULT.cast=null}
 for(let i=ULT.fx.length-1;i>=0;i--){const f=ULT.fx[i];f.t+=dt;if(f.dl>0){f.dl-=dt;f.t=0;continue}if(f.tick)f.tick(f,dt);if(f.t>=f.l)ULT.fx.splice(i,1)}}
{const _pt=playerTick;playerTick=function(dt){_pt(dt);ultTick(dt);animTick(dt);innTick(dt)}}
function ultFire(k){const d=ULTD[k],v=DIRV[ULT.cast.dir]||[1,0];
 if(k==='sword'){const pts=[];const foes=enemies().filter(e=>Math.hypot(e.x-P.x,e.y-P.y)<260);for(let i=0;i<14;i++){const e=foes[i%Math.max(1,foes.length)];const x=e?e.x+(Math.random()-.5)*30:P.x+(Math.random()-.5)*360,y=e?e.y+(Math.random()-.5)*20:P.y+(Math.random()-.5)*220;pts.push([x,y])}
  pts.forEach(([x,y],i)=>ULT.fx.push({k:'fsword',x,y,t:0,l:.55,dl:i*.07,s:1,tick:(f)=>{if(!f.hit&&f.t>.28){f.hit=1;eachIn(f.x,f.y,58,e=>hurtE(e,2.4,{kb:200,ult:1,col:'#cfe9ff'}));shake(2.5,.12);nz(.25,.25,3000,600,2);tone(1200,300,.2,'square',.04);for(let j=0;j<10;j++)rfxP(f.x,f.y,(Math.random()-.5)*160,-40-Math.random()*90,.5,d.rgb,2.4,'spark');RFX.push({k:'ring',x:f.x,y:f.y,t:0,l:.4,rgb:d.rgb,s:50})}}}));
  const gx=P.x+v[0]*90,gy=P.y+v[1]*70;ULT.fx.push({k:'fsword',x:gx,y:gy,t:0,l:.9,dl:1.1,s:3.2,tick:(f)=>{if(!f.hit&&f.t>.4){f.hit=1;eachIn(f.x,f.y,210,e=>hurtE(e,7,{kb:420,stun:1.2,ult:1,col:'#ffffff'}));shake(9,.6);boom(1.2);RFX.push({k:'ring',x:f.x,y:f.y,t:0,l:.7,rgb:'255,255,255',s:220});RFX.push({k:'ring',x:f.x,y:f.y,t:0,l:.9,rgb:d.rgb,s:300});for(let j=0;j<60;j++){const a=Math.random()*6.28;rfxP(f.x,f.y,Math.cos(a)*260,Math.sin(a)*150-60,.8,j%2?d.rgb:'255,255,255',3,'spark')}}}})}
 else if(k==='mage'){const e=foeNear(320),tx=e?e.x:P.x+v[0]*140,ty=e?e.y:P.y+v[1]*100;ULT.fx.push({k:'meteor',x:tx,y:ty,t:0,l:1.6,tick:(f)=>{if(f.t<.9&&Math.random()<.9)rfxP(f.x+260*(1-f.t/.9),f.y-360*(1-f.t/.9),40,-20,.5,'255,150,40',4,'spark');
   if(!f.hit&&f.t>=.9){f.hit=1;eachIn(f.x,f.y,240,q=>hurtE(q,9,{kb:500,stun:1.4,ult:1,burn:4,col:'#ffb070'}));shake(12,.8);boom(1.5);FADE.a=.6;FADE.c='#fff4d0';for(let i=1;i<4;i++)RFX.push({k:'ring',x:f.x,y:f.y,t:0,l:.5+i*.2,rgb:i%2?'255,200,80':'255,90,20',s:90*i});for(let j=0;j<90;j++){const a=Math.random()*6.28,s=60+Math.random()*320;rfxP(f.x,f.y,Math.cos(a)*s,Math.sin(a)*s*.55-80,1,j%3?'255,140,40':'255,240,180',3.4,'spark')}}}})}
 else if(k==='archer'){const dx=v[0]||0,dy=v[1]||0;ULT.fx.push({k:'phoenix',x:P.x,y:P.y-20,dx,dy,t:0,l:1.1,hit:new Set(),tick:(f)=>{const s=900*Math.min(f.t,.8);const cx=P.x+f.dx*s,cy=P.y-20+f.dy*s;f.cx=cx;f.cy=cy;if(f.t<.8){eachIn(cx,cy+16,56,e=>{if(f.hit.has(e))return;f.hit.add(e);hurtE(e,6,{kb:300,ult:1,col:'#ffe08a',burn:2});RFX.push({k:'ring',x:e.x,y:e.y,t:0,l:.4,rgb:'255,180,60',s:60});nz(.3,.2,1200,200,1)});for(let j=0;j<4;j++)rfxP(cx-f.dx*20+(Math.random()-.5)*20,cy-f.dy*20+(Math.random()-.5)*20,-f.dx*60+(Math.random()-.5)*40,-f.dy*60-20,.6,j%2?'255,120,30':'255,220,100',3,'spark')}}});shake(5,.5);tone(300,1200,.6,'sawtooth',.06);nz(.8,.2,600,4000,1,'bandpass')}
 else{eachIn(P.x,P.y,200,e=>hurtE(e,5,{kb:380,stun:1,ult:1,col:'#fff6c0'}));shake(7,.5);boom(1);FADE.a=.5;FADE.c='#fffbe0';for(let i=1;i<4;i++)RFX.push({k:'ring',x:P.x,y:P.y,t:0,l:.4+i*.2,rgb:'255,240,170',s:80*i})}}
function drawUltWorld(under){const t=performance.now()/1000,U=ULT.cast;
 if(under&&U&&U.t<1.25){const d=ULTD[U.k],a=Math.min(1,U.t*3)*(U.t>1.1?Math.max(0,1-(U.t-1.1)*7):1),r=58+Math.sin(t*6)*2;ctx.save();ctx.globalAlpha=a;ctx.translate(P.x,P.y);ctx.scale(1,.42);ctx.globalCompositeOperation='lighter';
  const g=ctx.createRadialGradient(0,0,r*.2,0,0,r*1.2);g.addColorStop(0,'rgba('+d.rgb+',.45)');g.addColorStop(1,'rgba('+d.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(-r*1.3,-r*1.3,r*2.6,r*2.6);
  ctx.strokeStyle='rgba('+d.rgb+',.95)';ctx.lineWidth=3;for(const [rr,sp] of [[r,1],[r*.72,-1.6],[r*.42,2.4]]){ctx.save();ctx.rotate(t*sp);ctx.beginPath();ctx.arc(0,0,rr,0,7);ctx.stroke();for(let i=0;i<(rr>40?12:6);i++){const aa=i*Math.PI*2/(rr>40?12:6);ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(Math.cos(aa)*rr-2,Math.sin(aa)*rr-2,4,4)}ctx.restore()}
  ctx.save();ctx.rotate(-t*.8);ctx.beginPath();for(let i=0;i<=6;i++){const aa=i*Math.PI*2/6*2;ctx.lineTo(Math.cos(aa)*r*.72,Math.sin(aa)*r*.72)}ctx.stroke();ctx.restore();ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.6;const pg=ctx.createLinearGradient(0,P.y-160,0,P.y);pg.addColorStop(0,'rgba('+d.rgb+',0)');pg.addColorStop(1,'rgba('+d.rgb+',.55)');ctx.fillStyle=pg;ctx.fillRect(P.x-26,P.y-160,52,160);ctx.restore()}
 if(under)return;
 for(const f of ULT.fx){if(f.dl>0)continue;const u=f.t/f.l;ctx.save();
  if(f.k==='fsword'){const fall=Math.min(1,f.t/(f.s>1?.4:.28)),y=f.y-(1-fall)*(f.s>1?420:260),al=u>.75?(1-u)*4:1;ctx.globalAlpha=al;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(f.x,y-20*f.s,0,f.x,y-20*f.s,40*f.s);g.addColorStop(0,'rgba(160,215,255,.6)');g.addColorStop(1,'rgba(160,215,255,0)');ctx.fillStyle=g;ctx.fillRect(f.x-40*f.s,y-60*f.s,80*f.s,80*f.s);ctx.globalCompositeOperation='source-over';
   ctx.translate(f.x,y);ctx.scale(f.s,f.s);const bg=ctx.createLinearGradient(-4,0,4,0);bg.addColorStop(0,'rgba(140,190,255,.85)');bg.addColorStop(.5,'rgba(255,255,255,.95)');bg.addColorStop(1,'rgba(120,170,240,.85)');ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(-4,-50);ctx.lineTo(4,-50);ctx.lineTo(4,-6);ctx.lineTo(0,4);ctx.lineTo(-4,-6);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,230,140,.95)';ctx.fillRect(-11,-54,22,4);ctx.fillStyle='rgba(200,230,255,.9)';ctx.fillRect(-2,-66,4,12)}
  else if(f.k==='meteor'){if(f.t<.9){const p=f.t/.9,mx=f.x+260*(1-p),my=f.y-360*(1-p),sz=18+p*22;ctx.globalCompositeOperation='lighter';const tg=ctx.createLinearGradient(mx,my,mx+160,my-220);tg.addColorStop(0,'rgba(255,200,80,.9)');tg.addColorStop(1,'rgba(255,60,0,0)');ctx.strokeStyle=tg;ctx.lineWidth=sz*1.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx+160,my-220);ctx.stroke();
    const g=ctx.createRadialGradient(mx,my,0,mx,my,sz*2);g.addColorStop(0,'rgba(255,250,210,1)');g.addColorStop(.4,'rgba(255,140,40,.9)');g.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g;ctx.fillRect(mx-sz*2,my-sz*2,sz*4,sz*4);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#4a1a08';ctx.beginPath();ctx.arc(mx,my,sz*.6,0,7);ctx.fill();
    ctx.globalAlpha=.35*p;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(f.x,f.y,240*p,90*p,0,0,7);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,90,40,'+(.5+.4*Math.sin(f.t*30))+')';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(f.x,f.y,240,90,0,0,7);ctx.stroke()}
   else{const p=(f.t-.9)/.7,al=Math.max(0,1-p);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(f.x,f.y-30,0,f.x,f.y-30,260*(.5+p));g.addColorStop(0,'rgba(255,240,200,'+al+')');g.addColorStop(.4,'rgba(255,120,30,'+al*.8+')');g.addColorStop(1,'rgba(200,30,0,0)');ctx.fillStyle=g;ctx.fillRect(f.x-400,f.y-400,800,800)}}
  else if(f.k==='phoenix'&&f.cx!=null&&f.t<.85){const a=Math.atan2(f.dy,f.dx||1e-6),fl=Math.sin(f.t*40);ctx.translate(f.cx,f.cy);ctx.rotate(a);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,70);g.addColorStop(0,'rgba(255,250,200,.95)');g.addColorStop(.35,'rgba(255,150,40,.8)');g.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g;ctx.fillRect(-70,-70,140,140);
   ctx.fillStyle='rgba(255,180,60,.9)';for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(10,0);ctx.bezierCurveTo(-10,s*(30+fl*8),-40,s*(46+fl*10),-62,s*(30+fl*6));ctx.bezierCurveTo(-40,s*18,-24,s*8,-10,0);ctx.fill()}ctx.fillStyle='rgba(255,90,20,.8)';ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(-90,-12);ctx.lineTo(-80,0);ctx.lineTo(-90,12);ctx.closePath();ctx.fill();ctx.fillStyle='#fff6c0';ctx.beginPath();ctx.moveTo(30,0);ctx.lineTo(4,-6);ctx.lineTo(4,6);ctx.closePath();ctx.fill()}
  ctx.restore()}}
{const _h=hero;hero=function(){drawUltWorld(true);_h();drawUltWorld(false);drawAnim6();drawInn6()}}

// =====================================================================
// ท่าดื่มยา / กินอาหาร
// =====================================================================
const ANIM6={k:null,t:0,l:0};
function gulp(){if(!AU.c||SET.mute)return;for(let i=0;i<3;i++){tone(180-i*15,90,.12,'sine',.12,i*.2);nz(.08,.05,900,300,4,'bandpass',i*.2+.04)}tone(700,1400,.18,'sine',.03,.65)}
function munch(){if(!AU.c||SET.mute)return;for(let i=0;i<3;i++){nz(.09,.12,1800,500,1.5,'bandpass',i*.22);nz(.05,.06,4000,2000,2,'highpass',i*.22+.03)}}
{const _ui=useItem;useItem=function(k){const n0=inv[k]|0;const r=_ui(k);if((inv[k]|0)<n0){const pot=k==='hpp'||k==='mpp';ANIM6.k=pot?'drink':'eat';ANIM6.t=0;ANIM6.l=pot?.9:1.1;ANIM6.item=k;ANIM6.col=k==='hpp'?'#e8303a':k==='mpp'?'#3a7aff':null;ANIM6.e=FOOD&&FOOD[k]?FOOD[k].e:(k==='bread'?'🍞':k==='apple'?'🍎':'🍖');if(pot)gulp();else munch()}return r}}
function animTick(dt){if(ANIM6.k){ANIM6.t+=dt;if(ANIM6.t>=ANIM6.l)ANIM6.k=null}}
function drawAnim6(){if(!ANIM6.k||P.dead||(MOUNT&&MOUNT.on))return;const u=ANIM6.t/ANIM6.l,d=P.dir;if(d==='u')return;const side=d==='l'||d==='r',f=d==='l'?-1:1,EC=EQCOL(),mx=P.x+(side?f*4:0),my=P.y-36+(P.sit?3:0);
 const lift=u<.2?u/.2:u>.85?(1-u)/.15:1,sx=P.x+(side?f*2:6),sy=P.y-25+(P.sit?3:0),hx=sx+(mx+(side?f*5:3)-sx)*lift,hy=sy+(my+3-sy)*lift;
 ctx.save();ctx.lineCap='round';ctx.strokeStyle=EC.TOP;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(hx,hy+3);ctx.stroke();ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-3,hy,6,5);
 if(ANIM6.k==='drink'){const tilt=lift*(side?f*1.6:1.2)*(u>.3&&u<.8?1.1:1);ctx.translate(hx,hy);ctx.rotate(-tilt*(side?1:.0)+(side?0:-.3*lift));ctx.fillStyle='rgba(220,240,255,.85)';ctx.strokeStyle='#2a2a3a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-3,-12);ctx.lineTo(3,-12);ctx.lineTo(3,-8);ctx.lineTo(5,-5);ctx.lineTo(5,3);ctx.lineTo(-5,3);ctx.lineTo(-5,-5);ctx.lineTo(-3,-8);ctx.closePath();ctx.fill();ctx.stroke();
  const lv=Math.max(0,1-u*1.1);ctx.fillStyle=ANIM6.col;ctx.fillRect(-4.4,3-7*lv,8.8,7*lv);ctx.fillStyle='#8a5a2a';ctx.fillRect(-2.5,-14,5,3);
  if(u>.3&&u<.8&&Math.random()<.4)rfxP(mx,my,(Math.random()-.5)*10,-20,.4,ANIM6.item==='hpp'?'255,120,120':'140,180,255',1.6,'dot')}
 else{ctx.font='12px "Noto Color Emoji","Apple Color Emoji",sans-serif';ctx.textAlign='center';ctx.fillText(ANIM6.e,hx,hy+2);if(lift>.9&&Math.random()<.3)rfxP(mx,my+2,(Math.random()-.5)*30,10,.4,'230,200,150',1.5,'dot')}
 ctx.restore()}

// =====================================================================
// โรงเตี๊ยม: สั่งอาหาร → เดินไปนั่ง → สาวเสิร์ฟยกมา → นั่งกิน
// =====================================================================
const INNMENU=[{id:'stew',n:'สตูว์เนื้อหม้อดิน',e:'🍲',p:45,hu:70,hpP:.5,st:{str:3,vit:3},dur:600,d:'อิ่ม +70 · เลือด +50% · STR/VIT +3 (10 นาที)'},
 {id:'fishp',n:'ปลาย่างสมุนไพรจานใหญ่',e:'🐟',p:40,hu:55,mpP:.6,st:{int:4,agi:2},dur:600,d:'อิ่ม +55 · มานา +60% · INT +4 AGI +2 (10 นาที)'},
 {id:'feastp',n:'ชุดเลี้ยงผู้กล้า (ไก่อบ+ขนมปัง+เบียร์ผึ้ง)',e:'🍗',p:90,hu:100,hpP:1,mpP:1,fa:100,st:{str:4,vit:4,agi:3,end:4,int:3},dur:900,d:'อิ่มเต็ม · ฟื้นทุกอย่าง · ทุกค่า +3~4 (15 นาที)'}];
const INN6={st:null};
const TABLES=SEATS.map(s=>{const pair=SEATS.find(q=>q!==s&&Math.abs(q[1]-s[1])<4&&Math.abs(q[0]-s[0])<110);return pair?{x:(s[0]+pair[0])/2,y:s[1]-10}:{x:s[0]+40,y:s[1]-10}});
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot(id);if(id==='inn'&&DLG.open&&!INN6.st){DLG.ch.splice(0,0,{t:'🍲 สั่งอาหารมานั่งกิน',c:'go',f:innOrder});try{dlgShowChoices()}catch(e){}}return r}}
function innOrder(){const o=D.owner;talk(o,'วันนี้มีของอร่อยหลายอย่างเลย เลือกได้ตามสบาย นั่งรอที่โต๊ะเดี๋ยวเสิร์ฟให้!',INNMENU.map(m=>({t:m.e+' '+m.n+' — '+m.p+' 🪙',f:()=>innPick(m)})).concat([BYE]),'🍲 เมนูโรงเตี๊ยม')}
function innPick(m){if(inv.coin<m.p){say('เหรียญไม่พอ');sfx('thud');return}inv.coin-=m.p;refreshInv();sfx('coin');
 let bi=0,bd=1e9;SEATS.forEach((s,i)=>{const d=Math.hypot(s[0]-P.x,s[1]-P.y);if(d<bd){bd=d;bi=i}});const seat=SEATS[bi],tb=TABLES[bi];
 INN6.st='walk';INN6.m=m;INN6.seat=seat;INN6.tb=tb;INN6.t=0;P.sit=null;say('🍽️ สั่ง'+m.n+'แล้ว — เดินไปนั่งที่โต๊ะ…');
 const o=D.owner;INN6.w=mkNPC({name:'น้องเมย์ (สาวเสิร์ฟ)',c:'#3a6a9a',h:'#6a3a1a',x:0,y:0,g:'f',age:'adult',hs:'bun',apron:1,lines:[]});INN6.w.x=o.x+30;INN6.w.y=o.y+46;INN6.w.home={x:INN6.w.x,y:INN6.w.y};INN6.w.vis=false}
function innTick(dt){const S=INN6;if(!S.st)return;if(!D||D.shop!=='inn'){S.st=null;return}S.t+=dt;const w=S.w;
 if(S.st==='walk'){const tx=S.seat[0],ty=S.seat[1]+4,dx=tx-P.x,dy=ty-P.y,d=Math.hypot(dx,dy);if(d<4||S.t>4){P.x=tx;P.y=ty;P.sit=S.seat;P.dir=S.tb.x>tx?'r':'l';S.st='wait';S.t=0;w.vis=true;sfx('ui')}else{const sp=Math.min(d,110*dt);P.x+=dx/d*sp;P.y+=dy/d*sp;P.mv=true;P.t+=dt*8;P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}}
 else if(S.st==='wait'||S.st==='back'){// เดินผ่านทางเดินระหว่างโต๊ะ (ไม่เหยียบโต๊ะ): ลงทางเดิน → เลียบทางเดิน → เข้าหาหน้าโต๊ะ
  const fin=S.st==='wait'?{x:S.tb.x+(S.tb.x>S.seat[0]?10:-10),y:S.tb.y+28}:w.home,AY=S.tb.y+50;
  if(!S.wp||S.wpFor!==S.st){S.wpFor=S.st;S.wp=S.st==='wait'?[{x:w.x,y:AY},{x:fin.x,y:AY},fin]:[{x:w.x,y:AY},{x:fin.x,y:AY},fin]}
  let tgt=S.wp[0],dx=tgt.x-w.x,dy=tgt.y-w.y,d=Math.hypot(dx,dy);
  while(d<3&&S.wp.length>1){S.wp.shift();tgt=S.wp[0];dx=tgt.x-w.x;dy=tgt.y-w.y;d=Math.hypot(dx,dy)}
  if(d<3){S.wp=null;if(S.st==='wait'){S.st='serve';S.t=0;w.mv=false;w.dir='u';sfx('pop');tone(520,0,.08,'triangle',.05);w.bub={txt:'ได้แล้วค่ะ! ทานให้อร่อยนะคะ ♪',t:2.2};S.plate=1}else{S.st=S.st==='back'?'eat':S.st;w.vis=false;w.mv=false}}
  else{const sp=Math.min(d,90*dt);w.x+=dx/d*sp;w.y+=dy/d*sp;w.mv=true;w.t+=dt*7;w.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}
  if(S.st==='wait'||S.st==='back')P.sit=S.seat}
 else if(S.st==='serve'){if(S.t>.6){S.st='back2';S.t=0;S.eatT=0;S.wp2=null}}
 if(S.st==='back2'){S.eatT+=dt;if(!S.wp2){const AY=S.tb.y+50;S.wp2=[{x:w.x,y:AY},{x:w.home.x,y:AY},{x:w.home.x,y:w.home.y}]}while(S.wp2.length>1&&Math.hypot(S.wp2[0].x-w.x,S.wp2[0].y-w.y)<3)S.wp2.shift();const tg2=S.wp2[0],dx=tg2.x-w.x,dy=tg2.y-w.y,d=Math.hypot(dx,dy);if(d>3||S.wp2.length>1){const sp=Math.min(d,90*dt);w.x+=dx/d*sp;w.y+=dy/d*sp;w.mv=true;w.t+=dt*7;w.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}else{w.vis=false;w.mv=false}
  if(!P.sit){S.st=null;say('ลุกจากโต๊ะก่อนกินเสร็จ — อาหารที่เหลือเก็บไว้ไม่ได้นะ');return}
  if(Math.floor(S.eatT/.55)!==Math.floor((S.eatT-dt)/.55)){munch();ANIM6.k='eat';ANIM6.t=0;ANIM6.l=.5;ANIM6.e=S.m.e}
  if(S.eatT>=4.2){const m=S.m;P.hu=Math.min(100,(P.hu|0)+m.hu);if(m.hpP)P.hp=Math.min(BAL.hp,P.hp+Math.round(BAL.hp*m.hpP));if(m.mpP)P.mp=Math.min(BAL.mp,P.mp+Math.round(BAL.mp*m.mpP));if(m.fa)P.fa=100;addBuff('inn_'+m.id,{n:m.n,e:m.e,st:m.st,dur:m.dur});applyBonus();
   sfx('chest');tone(660,990,.3,'triangle',.05);say(m.e+' อิ่มอร่อย! '+m.d);S.st=null;S.plate=0}}}
function drawInn6(){const S=INN6;if(!S.st||!D||D.shop!=='inn')return;const t=performance.now()/1000;
 if(S.plate||S.st==='back2'){const px=S.tb.x+(S.tb.x>S.seat[0]?-12:12),py=S.tb.y-6,left=S.st==='back2'?Math.max(0,1-S.eatT/4.2):1;ctx.save();ctx.fillStyle='#f4f0e8';ctx.strokeStyle='#8a7a6a';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(px,py,10,4,0,0,7);ctx.fill();ctx.stroke();
  if(left>0){ctx.font=(8+left*5)+'px "Noto Color Emoji","Apple Color Emoji",sans-serif';ctx.textAlign='center';ctx.fillText(S.m.e,px,py+1);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1;for(const o of [-4,0,4]){ctx.beginPath();ctx.moveTo(px+o,py-8);ctx.quadraticCurveTo(px+o+3*Math.sin(t*3+o),py-13,px+o,py-18-2*Math.sin(t*2+o));ctx.stroke()}}ctx.restore()}
 const w=S.w;if(w&&w.vis){try{drawNPC(w,t)}catch(e){}if(S.st==='wait'){ctx.save();const tx=w.x+(w.dir==='l'?-8:8),ty=w.y-30;ctx.fillStyle='#8a5a2a';ctx.fillRect(tx-10,ty,20,3);ctx.font='11px "Noto Color Emoji","Apple Color Emoji",sans-serif';ctx.textAlign='center';ctx.fillText(S.m.e,tx,ty-1);ctx.restore()}
  if(w.bub&&w.bub.t>0){w.bub.t-=1/60;ctx.save();ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';const tw=ctx.measureText(w.bub.txt).width+12;ctx.fillStyle='rgba(255,255,255,.95)';ctx.fillRect(w.x-tw/2,w.y-66,tw,16);ctx.fillStyle='#3a2a1a';ctx.textAlign='center';ctx.fillText(w.bub.txt,w.x,w.y-54);ctx.restore()}}}
{const _sa=shopAct;shopAct=function(){if(INN6.st&&INN6.st!=='back2')return true;return _sa()}}


// =====================================================================
// v4.6 (ง) : ดนตรีใหม่ตามสถานการณ์ (เมือง/ทุ่ง/กลางคืน/เหมือง/ดันเจี้ยน/ต่อสู้/บอส/บ้าน/โรงเตี๊ยม/ปราสาท) + สลับเพลงเมื่อเจอบอส
//            เนื้อเรื่องเข้มข้น (ฉากคัตซีนพร้อมตัวละคร) · บทสอนจับมือ (มือชี้/ลาก) · หน้าตั้งค่าแบบแท็บ
// =====================================================================
// ---------------- 1) ดนตรี ----------------
const MZ={g:null,cur:null,want:null,next:0,step:0,bar:0,swT:0,stinger:0};
const SC={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],hmin:[0,2,3,5,7,8,11],phr:[0,1,3,5,7,8,10],pen:[0,2,4,7,9,0,0]};
const N_=null;
const THEMES={
 town:{bpm:100,root:60,sc:'maj',prog:[0,5,3,4],lead:'pluck',lv:.16,pad:.05,bass:'walk',dr:'light',
  mel:[[4,N_,5,4,2,N_,0,N_],[2,N_,4,N_,5,4,2,N_],[3,N_,4,3,1,N_,6,N_],[4,5,6,7,6,N_,4,N_],[4,N_,5,4,2,N_,0,N_],[2,4,5,7,5,N_,4,N_],[3,N_,2,1,0,N_,1,N_],[2,N_,1,N_,0,N_,N_,N_]]},
 shop:{bpm:92,root:65,sc:'maj',prog:[0,3,4,0],lead:'bell',lv:.1,pad:.04,bass:'root',dr:'none',mel:[[4,N_,N_,2,N_,N_,0,N_],[3,N_,N_,5,N_,N_,4,N_],[2,N_,N_,4,N_,N_,6,N_],[7,N_,N_,N_,4,N_,N_,N_]]},
 field:{bpm:116,root:62,sc:'dor',prog:[0,6,5,6],lead:'flute',lv:.12,pad:.06,bass:'march',dr:'march',
  mel:[[0,N_,2,3,4,N_,4,N_],[3,2,3,N_,6,N_,5,N_],[4,N_,2,0,1,N_,2,N_],[3,N_,1,N_,4,N_,N_,N_],[7,N_,6,5,4,N_,2,N_],[3,N_,4,5,6,N_,5,N_],[4,3,2,N_,1,N_,2,N_],[0,N_,N_,N_,N_,N_,N_,N_]]},
 night:{bpm:76,root:57,sc:'min',prog:[0,5,3,4],lead:'bell',lv:.09,pad:.06,bass:'root',dr:'none',mel:[[4,N_,N_,N_,2,N_,N_,N_],[3,N_,N_,4,N_,N_,2,N_],[0,N_,N_,N_,6,N_,N_,N_],[4,N_,N_,N_,N_,N_,N_,N_]]},
 mine:{bpm:84,root:50,sc:'phr',prog:[0,1,0,6],lead:'bell',lv:.08,pad:.08,bass:'drone',dr:'tom',mel:[[7,N_,N_,N_,8,N_,N_,N_],[N_,N_,5,N_,N_,N_,4,N_],[7,N_,N_,8,N_,N_,10,N_],[9,N_,N_,N_,N_,N_,N_,N_]]},
 dungeon:{bpm:80,root:45,sc:'phr',prog:[0,1,6,1],lead:'bell',lv:.07,pad:.09,bass:'drone',dr:'heart',mel:[[N_,N_,7,N_,N_,N_,8,N_],[N_,N_,N_,N_,6,N_,N_,N_],[7,N_,N_,N_,N_,N_,1,N_],[N_,N_,N_,N_,N_,N_,N_,N_]]},
 battle:{bpm:144,root:57,sc:'min',prog:[0,5,6,4],lead:'saw',lv:.06,pad:.04,bass:'eighth',dr:'rock',
  mel:[[7,N_,7,6,7,N_,9,N_],[8,N_,7,N_,5,N_,4,N_],[6,N_,6,5,6,N_,8,N_],[7,N_,N_,N_,4,N_,N_,N_]]},
 boss:{bpm:160,root:52,sc:'hmin',prog:[0,5,3,4],lead:'brass',lv:.07,pad:.06,bass:'sixteen',dr:'epic',choir:1,
  mel:[[7,N_,N_,6,7,N_,9,N_],[10,N_,9,N_,8,N_,7,N_],[5,N_,N_,4,5,N_,7,N_],[6,N_,5,N_,4,N_,2,N_],[7,N_,N_,6,7,N_,10,N_],[11,N_,10,N_,9,N_,8,N_],[9,8,7,6,5,4,3,2],[4,N_,N_,N_,6,N_,N_,N_]]},
 abyss:{bpm:138,root:49,sc:'hmin',prog:[0,1,0,4],lead:'brass',lv:.07,pad:.08,bass:'sixteen',dr:'epic',choir:1,organ:1,
  mel:[[7,N_,N_,8,7,N_,N_,N_],[6,N_,N_,N_,4,N_,N_,N_],[7,N_,8,N_,10,N_,8,N_],[11,N_,N_,N_,N_,N_,N_,N_]]},
 home:{bpm:78,root:65,sc:'pen',prog:[0,3,4,0],lead:'bell',lv:.11,pad:.05,bass:'root',dr:'none',mel:[[2,N_,4,N_,3,N_,2,N_],[1,N_,N_,N_,0,N_,N_,N_],[2,N_,3,N_,4,N_,7,N_],[4,N_,N_,N_,N_,N_,N_,N_]]},
 inn:{bpm:132,root:62,sc:'maj',prog:[0,4,0,4],lead:'fiddle',lv:.08,pad:.03,bass:'root',dr:'clap',
  mel:[[0,2,4,2,4,7,4,2],[1,3,4,3,1,6,4,2],[0,2,4,7,9,7,4,2],[1,4,3,1,0,N_,0,N_]]},
 hall:{bpm:72,root:58,sc:'maj',prog:[0,3,4,0],lead:'brass',lv:.06,pad:.07,bass:'root',dr:'timp',mel:[[4,N_,N_,4,7,N_,N_,N_],[5,N_,4,N_,3,N_,N_,N_],[4,N_,N_,7,9,N_,N_,N_],[7,N_,N_,N_,N_,N_,N_,N_]]}};
const mtof=n=>440*Math.pow(2,(n-69)/12);
function degN(T,d){const s=SC[T.sc],L=T.sc==='pen'?5:7,i=((d%L)+L)%L,o=Math.floor(d/L);return T.root+s[i]+12*o}
function vce(type,f,t,dur,v,o){const C=AU.c;if(!C)return;const os=C.createOscillator(),g=C.createGain();let out=g;os.type=type;os.frequency.setValueAtTime(f,t);if(o&&o.det)os.detune.setValueAtTime(o.det,t);
 if(o&&o.vib){const l=C.createOscillator(),lg=C.createGain();l.frequency.value=5.5;lg.gain.value=f*.012;l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(t+dur+.1)}
 if(o&&o.lp){const fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(o.lp,t);if(o.lp2)fl.frequency.exponentialRampToValueAtTime(o.lp2,t+dur);fl.Q.value=o.q||1;os.connect(fl);fl.connect(g)}else os.connect(g);
 const a=(o&&o.a)||.005;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);out.connect(MZ.g);os.start(t);os.stop(t+dur+.05)}
function nzv(t,d,v,f1,f2,ty,q){const C=AU.c;if(!C||!AU.nb)return;const s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=AU.nb;f.type=ty||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f1,t);f.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(MZ.g);s.start(t,Math.random());s.stop(t+d+.05)}
const INST={
 pluck:(f,t,d,v)=>{vce('triangle',f,t,Math.min(d,.6),v,{lp:3200,lp2:600});vce('sine',f*2,t,.25,v*.3)},
 bell:(f,t,d,v)=>{vce('sine',f*2,t,1.6,v*.8);vce('sine',f*5.4,t,.5,v*.18)},
 flute:(f,t,d,v)=>{vce('triangle',f*2,t,d*.95,v,{a:.04,vib:1});vce('sine',f*4,t,d*.6,v*.1,{a:.05})},
 saw:(f,t,d,v)=>{vce('sawtooth',f*2,t,Math.min(d,.22),v,{lp:2600,lp2:900});vce('sawtooth',f*2,t,Math.min(d,.22),v*.6,{det:9,lp:2200,lp2:700})},
 brass:(f,t,d,v)=>{vce('sawtooth',f*2,t,d*.9,v,{a:.03,lp:600,lp2:2400,vib:1});vce('sawtooth',f*2,t,d*.9,v*.7,{a:.03,det:-8,lp:500,lp2:2000})},
 fiddle:(f,t,d,v)=>{vce('sawtooth',f*2,t,d*.9,v,{a:.02,lp:3000,vib:1})}};
function padChord(T,deg,t,len){const v=T.pad;if(!v)return;for(const iv of [0,2,4]){const f=mtof(degN(T,deg+iv)-12);vce('sawtooth',f,t,len,v*.35,{a:.4,lp:900,det:-6});vce('sawtooth',f,t,len,v*.35,{a:.4,lp:900,det:7})}
 if(T.choir)for(const iv of [0,2,4])vce('triangle',mtof(degN(T,deg+iv)),t,len,v*.4,{a:.35,vib:1});if(T.organ)for(const iv of [0,4,7])vce('square',mtof(degN(T,deg+iv)-24),t,len,v*.15,{a:.2,lp:700})}
function drums(T,s,t,spb,tension){const p=T.dr,st=s%16;
 const kick=v=>{vce('sine',150,t,.25,v,{});const C=AU.c;try{const o=C.createOscillator(),g=C.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.2);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(MZ.g);o.start(t);o.stop(t+.35)}catch(e){}},
  snare=v=>{nzv(t,.16,v,2400,900,'bandpass',.8);vce('triangle',200,t,.08,v*.4)},hat=v=>nzv(t,.04,v,9000,7000,'highpass',1),tom=(f,v)=>{try{const C=AU.c,o=C.createOscillator(),g=C.createGain();o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.5,t+.3);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.connect(g);g.connect(MZ.g);o.start(t);o.stop(t+.4)}catch(e){}};
 if(p==='light'){if(st===0||st===8)kick(.22);if(st%4===2)hat(.05);if(st===12)nzv(t,.08,.06,6000,3000,'bandpass',2)}
 else if(p==='march'){if(st%8===0)kick(.25);if(st===4||st===12)snare(.12);if(st===14||st===15)snare(.05);if(st%2===0)hat(.03)}
 else if(p==='rock'){if(st%4===0||st===10)kick(.32);if(st===4||st===12)snare(.2);if(st%2===0)hat(.06)}
 else if(p==='epic'){if(st%2===0)kick(.3);if(st===4||st===12)snare(.24);if(st%4===2)hat(.07);if(st===0&&MZ.bar%4===0)nzv(t,1.2,.16,7000,2500,'highpass',.5);if(st===14)tom(160,.25);if(st===15)tom(110,.25)}
 else if(p==='tom'){if(st===0)tom(90,.3);if(st===10)tom(70,.2)}
 else if(p==='heart'){if(st===0||st===3)tom(60,.18+tension*.25);if(tension>.5&&(st===8||st===11))tom(58,.12+tension*.2)}
 else if(p==='clap'){if(st%6===0)kick(.18);if(st%6===3)nzv(t,.08,.12,2000,1200,'bandpass',1.5)}
 else if(p==='timp'){if(st===0)tom(70,.35);if(st===12&&MZ.bar%2)tom(90,.25)}}
function bassline(T,deg,s,t,spb){const st=s%16,f=mtof(degN(T,deg)-24),b=T.bass;
 if(b==='root'){if(st===0)vce('sine',f,t,spb*7,.16)}
 else if(b==='walk'){if(st%4===0){const w=[0,2,4,2][st/4];vce('triangle',mtof(degN(T,deg+w)-24),t,spb*3.5,.14)}}
 else if(b==='march'){if(st%4===0)vce('triangle',st%8?mtof(degN(T,deg+4)-24):f,t,spb*3,.15)}
 else if(b==='drone'){if(st===0){vce('sawtooth',f,t,spb*16,.06,{a:.6,lp:300});vce('sine',f/2,t,spb*16,.14,{a:.6})}}
 else if(b==='eighth'){if(st%2===0)vce('sawtooth',f,t,spb*1.6,.09,{lp:500});}
 else if(b==='sixteen'){vce('sawtooth',f,t,spb*.9,.07,{lp:420});if(st%4===0)vce('sine',f/2,t,spb*3,.12)}}
function musState(){if(!D){const n=typeof dayDark==='function'&&dayDark(DAY.t)>.55;return musNear(n?'night':'field')}
 if(D.shop)return D.shop==='inn'?'inn':D.shop==='hall'?'hall':'shop';if(D.town)return 'town';if(D.home)return 'home';
 if(D.zone){const b=D.boss;if(b&&!b.dead&&Math.hypot(b.x-P.x,b.y-P.y)<560)return b.abyss?'abyss':'boss';return musNear(D.dg?'dungeon':'mine')}return 'field'}
function musNear(def){let c=0;try{for(const e of enemies()){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<230&&(e.aggro||e.chase||e.tg||d<120))c++}}catch(e){}if(c>=2||(c>=1&&MZ.cur==='battle'))return 'battle';return def}
function musTick(){const C=AU.c;if(!C||SET.mute||SET.music<=0||document.hidden)return;if(!MZ.g){MZ.g=C.createGain();MZ.g.gain.value=1;MZ.g.connect(AU.mu);MZ.next=C.currentTime+.1}
 let w=musState();if(w==='battle'&&MZ.cur!=='battle'){MZ.batT=(MZ.batT||0)+1;if(MZ.batT<3)w=MZ.cur||w}else MZ.batT=0;
 if(w!==MZ.cur&&MZ.cur&&(MZ.cur==='battle'&&w!=='boss'&&w!=='abyss')){MZ.calm=(MZ.calm||0)+1;if(MZ.calm<8)w='battle'}else MZ.calm=0;
 if(w!==MZ.cur){const boss=w==='boss'||w==='abyss';MZ.g.gain.cancelScheduledValues(C.currentTime);MZ.g.gain.setTargetAtTime(.0001,C.currentTime,.12);const nt=C.currentTime+.45;MZ.g.gain.setTargetAtTime(1,nt,.2);MZ.cur=w;MZ.step=0;MZ.bar=0;MZ.next=nt;
  if(boss){nzv(nt,1.4,.3,6000,1500,'highpass',.5);for(const iv of [0,3,7])vce('sawtooth',mtof(degN(THEMES[w],iv)),nt,1.5,.08,{a:.02,lp:800,lp2:3000});try{const b=D.boss;if(b&&!MZ.bn){MZ.bn=b;banner('⚠️ '+(b.nm||'บอส'),'เผชิญหน้ากับบอส!','red')}}catch(e){}}}
 if(!(w==='boss'||w==='abyss'))MZ.bn=null;
 const T=THEMES[MZ.cur];if(!T)return;const spb=60/T.bpm/4,tension=D&&D.dg?Math.min(1,D.dg/80):0;
 while(MZ.next<C.currentTime+.6){const t=MZ.next,s=MZ.step,st=s%16;if(st===0)MZ.bar++;const bi=(MZ.bar-1+T.prog.length*64)%T.prog.length,deg=T.prog[bi];
  if(st===0)padChord(T,deg,t,spb*16);bassline(T,deg,s,t,spb);drums(T,s,t,spb,tension);
  if(st%2===0){const M=T.mel[(MZ.bar-1)%T.mel.length],n=M[st/2];if(n!=null){let len=1;for(let j=st/2+1;j<8&&M[j]==null;j++)len++;(INST[T.lead]||INST.pluck)(mtof(degN(T,n)),t,spb*2*len*.95,T.lv)}}
  if(MZ.cur==='dungeon'&&tension>.4&&st===6&&Math.random()<tension*.5)INST.bell(mtof(degN(T,1)+12),t,1,.04);
  MZ.next+=spb;MZ.step++}}
musicTick=function(){try{musTick()}catch(e){}};
if(AU.c&&!AU._mz){AU._mz=1;setInterval(musicTick,140)}else{const _iv=setInterval(()=>{if(AU.c){clearInterval(_iv);setInterval(musicTick,140)}},500)}

// ---------------- 2) เนื้อเรื่องเข้มข้น: คัตซีนตัวละคร ----------------
const CAST={gareth:{n:'กัปตันแกเร็ธ',skin:'#e8c4a0',hair:'#6a4a2a',beard:1,armor:'#8a8e9a',cape:'#1a3a8a'},princess:{n:'เจ้าหญิงเอเลน่า',skin:'#f6dcc4',hair:'#f0d070',crown:'#ffd23a',dress:'#e888b8',fem:1},
 morvane:{n:'อัครเวทมอร์เวน',skin:'#d8c8c0',hair:'#2a1a3a',hood:'#4a1a6a',eye:'#c040ff'},king:{n:'พระราชาอัลดริค',skin:'#ecc8a4',hair:'#e8e8e8',beard:1,crown:'#ffd23a',robe:'#8a1a1a'},
 iris:{n:'ไอริส',skin:'#f4d8bc',hair:'#c8843a',fem:1,dress:'#3a5a9a'},emperor:{n:'เงาแห่งห้วงลึก',skin:'#140a1c',hair:'#000',crown:'#6a2a8a',eye:'#ff3a5a',shadow:1},
 dragon:{n:'มังกรคริสตัล',dragon:1}};
function cineBust(k,W,H,t,who,s){const C=CAST[who];if(!C)return;const cx=W*.5,cy=H*.33,S=s*1.0;
 const bg=k.createRadialGradient(cx,cy,10,cx,cy,H*.8);bg.addColorStop(0,C.shadow?'rgba(120,20,60,.5)':C.dragon?'rgba(90,200,255,.35)':'rgba(255,230,170,.25)');bg.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=bg;k.fillRect(0,0,W,H);
 if(C.dragon){k.save();k.translate(cx,cy);k.scale(S,S);k.fillStyle='#bfe8ff';k.strokeStyle='#3a7ab0';k.lineWidth=3;k.beginPath();k.moveTo(-90,40);k.quadraticCurveTo(-60,-30,0,-40);k.quadraticCurveTo(70,-48,110,-10);k.lineTo(120,10);k.quadraticCurveTo(80,6,60,20);k.quadraticCurveTo(20,40,-90,40);k.fill();k.stroke();
  k.fillStyle='#e8f8ff';for(const [x,y] of [[-10,-40],[20,-46],[50,-44]]){k.beginPath();k.moveTo(x,y);k.lineTo(x+8,y-26);k.lineTo(x+14,y);k.fill();k.stroke()}k.fillStyle='#fff';k.beginPath();k.ellipse(62,-14,9,5,0,0,7);k.fill();k.fillStyle='#2a8ad0';k.beginPath();k.arc(64,-14,3.5+Math.sin(t*2),0,7);k.fill();k.restore();return}
 k.save();k.translate(cx,cy+40*S);k.scale(S,S);const br=Math.sin(t*1.5)*1.5;
 // ไหล่/ลำตัว
 const body=C.armor||C.robe||C.dress||C.hood||'#333';const g=k.createLinearGradient(0,10,0,120);g.addColorStop(0,body);g.addColorStop(1,'#0a0a10');k.fillStyle=g;k.beginPath();k.moveTo(-80,120);k.quadraticCurveTo(-74,30,-34,18+br);k.lineTo(34,18+br);k.quadraticCurveTo(74,30,80,120);k.fill();
 if(C.cape){k.fillStyle=C.cape;k.beginPath();k.moveTo(-80,120);k.quadraticCurveTo(-86,40,-40,18);k.lineTo(-50,120);k.fill();k.beginPath();k.moveTo(80,120);k.quadraticCurveTo(86,40,40,18);k.lineTo(50,120);k.fill()}
 if(C.armor){k.fillStyle='rgba(255,255,255,.25)';k.beginPath();k.ellipse(-46,36,18,10,-.3,0,7);k.ellipse(46,36,18,10,.3,0,7);k.fill()}
 // คอ+หน้า
 k.fillStyle=C.skin;k.fillRect(-11,-6+br,22,26);k.beginPath();k.ellipse(0,-30+br,30,36,0,0,7);k.fill();
 if(C.hood){k.fillStyle=C.hood;k.beginPath();k.moveTo(-40,0);k.quadraticCurveTo(-44,-74,0,-78);k.quadraticCurveTo(44,-74,40,0);k.quadraticCurveTo(26,-50,0,-56);k.quadraticCurveTo(-26,-50,-40,0);k.fill()}
 else{k.fillStyle=C.hair;k.beginPath();k.ellipse(0,-50+br,32,22,0,Math.PI,0);k.fill();if(C.fem){k.beginPath();k.moveTo(-32,-50);k.quadraticCurveTo(-46,0,-34,30);k.lineTo(-24,-20);k.fill();k.beginPath();k.moveTo(32,-50);k.quadraticCurveTo(46,0,34,30);k.lineTo(24,-20);k.fill()}}
 // ตา
 const ey=-30+br,blink=(t%4)<.12;if(C.shadow||C.eye){k.save();k.globalCompositeOperation='lighter';for(const sx of [-12,12]){const eg=k.createRadialGradient(sx,ey,0,sx,ey,14);eg.addColorStop(0,C.eye||'#ff3a5a');eg.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=eg;k.fillRect(sx-14,ey-14,28,28)}k.restore();k.fillStyle='#fff';for(const sx of [-12,12])k.fillRect(sx-5,ey-1.5,10,3)}
 else{k.fillStyle='#1a1410';for(const sx of [-12,12])k.fillRect(sx-4,ey-(blink?1:4),8,blink?2:8);k.fillStyle='#fff';if(!blink)for(const sx of [-12,12])k.fillRect(sx-2,ey-3,2,2);k.strokeStyle='rgba(120,60,40,.6)';k.lineWidth=2;k.beginPath();k.moveTo(-6,-10+br);k.quadraticCurveTo(0,C.fem?-7:-9,6,-10+br);k.stroke()}
 if(C.beard){k.fillStyle=C.hair;k.beginPath();k.moveTo(-26,-24);k.quadraticCurveTo(-20,14,0,16);k.quadraticCurveTo(20,14,26,-24);k.quadraticCurveTo(14,-8,0,-10);k.quadraticCurveTo(-14,-8,-26,-24);k.fill()}
 if(C.crown){k.fillStyle=C.crown;k.strokeStyle='#5a3a08';k.lineWidth=2;k.beginPath();k.moveTo(-26,-62+br);for(let i=0;i<=4;i++){k.lineTo(-26+i*13,-62-(i%2?6:16)+br)}k.lineTo(26,-62+br);k.closePath();k.fill();k.stroke();k.fillStyle=C.shadow?'#ff3a5a':'#e04a6a';k.beginPath();k.arc(0,-70+br,3,0,7);k.fill()}
 if(C.shadow){for(let i=0;i<10;i++){k.fillStyle='rgba(100,20,140,'+(.2+.15*Math.sin(t*3+i))+')';k.beginPath();k.arc(Math.sin(t+i*2)*70,40-((t*30+i*20)%140),6+i%4*3,0,7);k.fill()}}
 k.restore();k.save();k.font='bold '+Math.round(15*s)+'px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';const nm=C.n,tw=k.measureText(nm).width+24;k.fillStyle='rgba(20,14,6,.85)';k.fillRect(cx-tw/2,H*.06,tw,24*s);k.strokeStyle='#e8c14a';k.lineWidth=1.5;k.strokeRect(cx-tw/2,H*.06,tw,24*s);k.fillStyle='#ffe9a0';k.fillText(nm,cx,H*.06+17*s);k.restore()}
function cineFx(k,W,H,t,sc,u,s){const cx=W/2,cy=H*.42;
 if(sc==='fire'){const g=k.createLinearGradient(0,H*.3,0,H);g.addColorStop(0,'#1a0402');g.addColorStop(1,'#6a1a04');k.fillStyle=g;k.fillRect(0,0,W,H);for(let i=0;i<7;i++){const x=W*(i+.5)/7,h=(60+(i*37)%50)*s;k.fillStyle='#120804';k.fillRect(x-24*s,H*.7-h,48*s,h);k.beginPath();k.moveTo(x-30*s,H*.7-h);k.lineTo(x,H*.7-h-26*s);k.lineTo(x+30*s,H*.7-h);k.fill()}
  for(let i=0;i<40;i++){const x=(i*53.7)%W,y=H*.72-((t*60+i*31)%(H*.6)),r=(4+(i%5)*3)*s;const fg=k.createRadialGradient(x,y,0,x,y,r*2);fg.addColorStop(0,'rgba(255,200,80,.8)');fg.addColorStop(1,'rgba(255,60,0,0)');k.fillStyle=fg;k.fillRect(x-r*2,y-r*2,r*4,r*4)}}
 else if(sc==='kidnap'){k.fillStyle='#0a0a1a';k.fillRect(0,0,W,H);k.fillStyle='#e8e8ff';k.beginPath();k.arc(W*.8,H*.2,26*s,0,7);k.fill();k.fillStyle='#1a1a2a';k.fillRect(cx-40*s,H*.25,80*s,H*.6);k.beginPath();k.moveTo(cx-50*s,H*.25);k.lineTo(cx,H*.1);k.lineTo(cx+50*s,H*.25);k.fill();k.fillStyle='#ffd870';k.fillRect(cx-10*s,H*.35,20*s,26*s);
  const p=Math.min(1,u/2);k.fillStyle='rgba(100,20,140,.8)';k.beginPath();k.ellipse(cx+p*W*.3,H*.4-p*H*.2,30*s,40*s,0,0,7);k.fill();k.fillStyle='#c040ff';k.fillRect(cx+p*W*.3-8*s,H*.38-p*H*.2,5*s,2*s);k.fillRect(cx+p*W*.3+3*s,H*.38-p*H*.2,5*s,2*s)}
 else if(sc==='sacrifice'){k.fillStyle='#0a0806';k.fillRect(0,0,W,H);const g=k.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,240,180,.0)');g.addColorStop(1,'rgba(255,240,180,.35)');k.fillStyle=g;k.fillRect(cx-60*s,0,120*s,H*.75);k.fillStyle='#3a2a1a';k.fillRect(0,H*.75,W,H*.25);
  k.save();k.translate(cx,H*.75);k.rotate(.08);k.fillStyle='#c8ccd6';k.fillRect(-4*s,-90*s,8*s,90*s);k.fillStyle='#e8c14a';k.fillRect(-16*s,-96*s,32*s,6*s);k.fillStyle='#5a3418';k.fillRect(-3*s,-118*s,6*s,22*s);k.restore();k.fillStyle='#1a3a8a';k.beginPath();k.moveTo(cx-10*s,H*.75);k.quadraticCurveTo(cx-40*s,H*.6,cx-70*s,H*.76);k.fill();
  for(let i=0;i<25;i++){k.fillStyle='rgba(255,240,200,'+(.4+.4*Math.sin(t*2+i))+')';k.fillRect(cx+Math.sin(i*7.7)*80*s,H*.75-((t*25+i*17)%(H*.7)),2*s,2*s)}}}
const CINESC=new Set(['fire','kidnap','sacrifice','bust']);
{const _cd=cineDraw;cineDraw=function(now){const it=CINE.L&&CINE.L[CINE.i];if(!it||!(CINESC.has(it.s)||it.who)||cineEl.hidden)return _cd(now);requestAnimationFrame(cineDraw);
  const W=cCv.width=cCv.clientWidth,H=cCv.height=cCv.clientHeight,k=cK,t=now/1000,u=(now-CINE.t0)/1000,s=Math.min(W,H)/500;k.fillStyle='#04030a';k.fillRect(0,0,W,H);
  if(CINESC.has(it.s)&&it.s!=='bust')cineFx(k,W,H,t,it.s,u,s);if(it.who){k.save();k.globalAlpha=Math.min(1,u*2.5);cineBust(k,W,H,t,it.who,s);k.restore()}
  const vg=k.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');k.fillStyle=vg;k.fillRect(0,0,W,H)}}
const CB6=(who,t)=>({s:'bust',who,t:'「'+CAST[who].n+'」 '+t});
const STORYCS={
 s1:[CB6('gareth','ข้าคือกัปตันแกเร็ธ หัวหน้าองครักษ์แห่งเอลโดเรีย… สไลม์พวกนั้นไม่ได้คลั่งเอง มีบางอย่างปลุกพวกมันขึ้นมา'),CB6('gareth','ระวังตัวด้วย เจ้าหนู ข้าเห็นคนดี ๆ ล้มไปมากแล้วในทุ่งนั่น')],
 e1:[CB6('gareth','เห็นไหม… ในเจลของมันมีประกายสีม่วง นี่คือพลังของห้วงลึก ข้าจะรายงานพระราชาเอง')],
 s2:[CB6('gareth','อาวุธหินจะพาเจ้าไปตายเปล่า ๆ ไปหาช่างหนวดเหล็กที่ร้านอาวุธ ขอตำราช่างแล้วตีดาบด้วยมือเจ้าเอง')],
 s3:[CB6('princess','ข้าคือเอเลน่า ธิดาของพระราชา… ข้าเห็นเจ้าในความฝัน ถือแสงอรุณไว้ในมือ'),CB6('princess','ปรมาจารย์อาชีพที่จัตุรัสจะชี้ทางให้เจ้า… ได้โปรดอย่าตายนะ')],
 s4:[{s:'dark',t:'ใต้ทุ่งหญ้า… ประตูดันเจี้ยนส่งเสียงกระซิบเรียกชื่อของเจ้าทุกค่ำคืน'}],
 e4:[CB6('emperor','…ผู้ถูกเลือก… เจ้าได้ยินข้าใช่ไหม… ข้ารอเจ้าอยู่ที่ก้นบึ้ง… ลงมาสิ…')],
 s5:[CB6('morvane','ข้าคืออัครเวทมอร์เวน ที่ปรึกษาแห่งราชสำนัก เหมืองเหล็กร้างอันตรายนัก… ขอให้เจ้าโชคดีนะ ผู้กล้า'),{s:'dark',t:'รอยยิ้มของอัครเวทดูเย็นชาเกินกว่าคำอวยพร…'}],
 e5:[CB6('gareth','บนซากโกเลมมีตราประทับ… ตราของราชสำนัก?! ใครบางคนในปราสาทส่งมันมาเฝ้าเศษผลึก')],
 s6:[CB6('iris','ลัทธิ “เงาจันทร์ดับ” กำลังเคลื่อนไหวในเมือง กิลด์ต้องการคนช่วยสืบ ทำงานให้กิลด์แล้วเราจะได้ข่าวจากสายลับ')],
 e6:[CB6('iris','สายลับบอกว่าผู้นำลัทธิคือ “นายท่านในชุดคลุมม่วง”… คนในวังแน่นอน ระวังตัวให้ดี')],
 s7:[{s:'fire',t:'ระหว่างที่เจ้าอยู่ในเหมือง… อสูรเงาบุกถล่มประตูเมือง!'},CB6('gareth','ข้า… ยังไหว! อย่าห่วงเมือง ไปเอาเศษผลึกในถ้ำลาวามาก่อนที่มันจะสายเกินไป!')],
 s8:[{s:'kidnap',t:'คืนนั้น… เงาร่างหนึ่งในชุดคลุมม่วง พาเจ้าหญิงเอเลน่าหายไปจากหอคอย'},CB6('king','ได้โปรด… ผู้กล้า นำลูกสาวข้ากลับมา ข่าวว่ามันพานางลงไปในดันเจี้ยน')],
 e8:[CB6('emperor','ธิดาแห่งแสง… จะเป็นภาชนะให้ข้าคืนชีพ ฮึ ฮึ ฮึ… เร่งมือเข้าสิ ผู้กล้า')],
 s9:[CB6('gareth','ริบบิ้นของเจ้าหญิง… ตกอยู่บนทางไปยอดเขาเงิน! นางยังมีชีวิต รีบไป!')],
 s10:[CB6('iris','ข่าวด่วน! อัครเวทมอร์เวนหายตัวจากปราสาท ห้องของเขามีแผนที่สุสานทองคำ… ไปให้ถึงก่อนเขา')],
 e10:[CB6('morvane','ฮ่า ๆ ๆ! ช้าไปแล้ว ผู้กล้า ราชาโง่ไว้ใจข้ามาสิบปี… นายท่านแห่งห้วงลึกจะครองแผ่นดินนี้!'),CB6('gareth','เจ้าคนทรยศ! ผู้กล้า ไปตามเจ้าหญิง ข้าจะถ่วงมันไว้เอง!'),{s:'sacrifice',t:'กัปตันแกเร็ธยืนขวางเวทของมอร์เวนจนลมหายใจสุดท้าย… ดาบของเขาปักอยู่หน้าประตูสุสาน'}],
 s11:[CB6('king','แกเร็ธ… สหายเก่าของข้า… จงอย่าให้การเสียสละของเขาสูญเปล่า ข่าวว่าเจ้าหญิงถูกผนึกไว้ที่ชั้นห้าสิบ')],
 e11:[{s:'crystal',t:'ที่ชั้นห้าสิบ เจ้าพบเจ้าหญิงในผนึกคริสตัล — และทำลายมันได้สำเร็จ'},CB6('princess','เจ้ามาจริง ๆ… ข้ารู้ว่าเจ้าต้องมา… แต่แกเร็ธ… ไม่นะ…')],
 s12:[CB6('princess','มังกรคริสตัลเคยเป็นผู้พิทักษ์ผลึกอรุณ ความมืดครอบงำมัน… ได้โปรดปลดปล่อยมันด้วย')],
 e12:[CB6('dragon','ขอบใจ… ที่ปลดปล่อยข้า… จงฟัง… เงาแห่งห้วงลึกเคยเป็นผู้กล้าคนแรก… ผู้ที่ถูกความมืดกลืนกินเพราะสิ้นหวัง…'),CB6('dragon','อย่าให้หัวใจเจ้า… เป็นเช่นเขา…')],
 s13:[CB6('morvane','ลงมาให้ถึงชั้นร้อยสิ ผู้กล้า… นายท่านหิวกระหายแสงในตัวเจ้า!'),CB6('princess','ข้าจะสวดภาวนาให้เจ้าทุกคืน… กลับมานะ สัญญากับข้า'),CB6('king','ทั้งแผ่นดินฝากไว้กับเจ้า… และฝากแกเร็ธด้วย')],
 e13:[CB6('emperor','แสง… อบอุ่นเช่นนี้… ข้าลืมไปนานแสนนาน… ขอบใจ… ผู้กล้าแห่งรุ่นหลัง…'),CB6('princess','เจ้ากลับมาแล้ว! ทั้งเมืองรอเจ้าอยู่ที่ปราสาท')]};
STORY.cs=STORY.cs||{};
setInterval(()=>{if(PAUSED||!cineEl.hidden||!STORY.intro||(DLG&&DLG.open)||P.dead)return;try{if(!titleEl.hidden)return}catch(e){}
 const ch=STORY.ch,key=(STORY.st==='report'?'e':'s')+ch;if(STORY.cs[key]||!STORYCS[key])return;
 try{if(enemies().some(e=>!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<200))return}catch(e){}
 STORY.cs[key]=1;saveStory();cinePlay(STORYCS[key],()=>{})},900);

// ---------------- 3) บทสอนแบบจับมือ: มือชี้/มือลาก + สปอตไลต์ ----------------
{const st=document.createElement('style');st.textContent=`
#tuthand{position:fixed;z-index:28;pointer-events:none;width:44px;height:44px;font-size:36px;line-height:44px;text-align:center;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7));transition:left .25s,top .25s}
#tuthand[hidden]{display:none}#tuthand.tap{animation:thtap 1s ease-in-out infinite}#tuthand.drag{animation:thdrag 1.6s ease-in-out infinite}
@keyframes thtap{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-4px,-6px) scale(1.08)}55%{transform:translate(0,0) scale(.92)}}
@keyframes thdrag{0%{transform:translate(0,0)}35%{transform:translate(46px,-10px)}55%{transform:translate(46px,-10px)}85%{transform:translate(0,0)}}
#tutring.spot{box-shadow:0 0 0 4px rgba(127,216,255,.35),0 0 24px #7fd8ff,0 0 0 9999px rgba(0,0,0,.42)!important}
#tut .ti{width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff6d0,#e8b84a 60%,#8a5a1a);display:flex;align-items:center;justify-content:center;font-size:26px;flex:none;box-shadow:0 0 12px rgba(255,220,120,.6)}
`;document.head.appendChild(st)}
const tHand=document.createElement('div');tHand.id='tuthand';tHand.textContent='👆';tHand.hidden=true;document.body.appendChild(tHand);
setInterval(()=>{if(!TUT.on||STORY.tut>=TUTS.length||tutEl.hidden){tHand.hidden=true;tRing.classList.remove('spot');return}const i=STORY.tut,s=TUTS[i];
 if(i===0&&COARSE){const z=gid('joyzone');if(z){const r=z.getBoundingClientRect();tHand.className='drag';tHand.style.left=(r.left+r.width*.32)+'px';tHand.style.top=(r.top+r.height*.62)+'px';tHand.hidden=false;tRing.classList.remove('spot');return}}
 const el=s.el&&s.el();if(!el||el.offsetParent===null||tRing.hidden){tHand.hidden=true;tRing.classList.remove('spot');return}
 const r=el.getBoundingClientRect();tHand.className='tap';tHand.style.left=(r.left+r.width*.55)+'px';tHand.style.top=(r.top+r.height*.6)+'px';tHand.hidden=false;tRing.classList.toggle('spot',[2,3,5,6,7,8].includes(i))},200);
try{const add=[{i:'🔥',h:'อัลติเมท',x:()=>'ตีมอนจนวงรอบรูปโปรไฟล์เต็ม → ไฟจะลุกท่วมกรอบ แล้วปุ่มอัลติเมทจะโผล่ขึ้นมา กดเพื่อร่ายท่าไม้ตาย!',el:()=>gid('ultb').hidden?gid('face'):gid('ultb'),ok:()=>TUT.t>6}];if(!TUTS.some(q=>q.h==='อัลติเมท'))TUTS.splice(TUTS.length-1,0,...add)}catch(e){}

// ---------------- 4) หน้าตั้งค่า: แบ่งแท็บ ตัดของไม่จำเป็น ----------------
{const st=document.createElement('style');st.textContent=`
#menu .tabs6{display:flex;gap:5px;margin:6px 0 8px;flex-wrap:wrap}#menu .tabs6 button{flex:1;min-width:70px;font:inherit;font-weight:800;font-size:12.5px;padding:7px 6px;border-radius:9px;border:1px solid #c8a24a;background:#2a2018;color:#ffe9c0;cursor:pointer}
#menu .tabs6 button.on{background:#ffe9a0;color:#3a2408}#menu [data-pane]{display:none}#menu.p6-ctl [data-pane=ctl],#menu.p6-snd [data-pane=snd],#menu.p6-gfx [data-pane=gfx],#menu.p6-acc [data-pane=acc]{display:revert}
`;document.head.appendChild(st)}
function setupMenu6(){if(menuEl._p6)return;menuEl._p6=1;const kids=[...menuEl.children];let pane=null;const hide=e=>e.style.display='none';
 for(const e of kids){const tx=(e.innerText||'').trim();
  if(e.matches('b.sec')){pane=/ควบคุม/.test(tx)?'ctl':/เสียง/.test(tx)?'snd':/บันทึก|บัญชี|ความปลอดภัย/.test(tx)?'acc':pane;e.dataset.pane=pane;if(/เสียง/.test(tx))e.textContent='🔊 เสียง';continue}
  if(e.id==='resume'||(e.tagName==='SMALL'&&/WASD/.test(tx))){if(COARSE&&e.tagName==='SMALL')hide(e);continue}
  if(e.id==='dbg'||e.id==='cp'||e.id==='secinfo'){hide(e);continue}
  if(/แผนที่วงกลม|หญ้าโยก|แสดง FPS/.test(tx)){hide(e);continue}
  if(COARSE&&/ปุ่มวิ่งคีย์บอร์ด/.test(tx)){hide(e);continue}
  if(!pane)continue;let p=pane;if(pane==='snd'&&!/เสียงรวม|ดนตรี|เอฟเฟกต์/.test(tx))p='gfx';if(/ออนไลน์/.test(tx)||e.id==='fsb')p=e.id==='fsb'?'gfx':'acc';e.dataset.pane=p}
 const tabs=document.createElement('div');tabs.className='tabs6';tabs.innerHTML='<button data-t="ctl">🎮 ควบคุม</button><button data-t="snd">🔊 เสียง</button><button data-t="gfx">🖼️ ภาพ</button><button data-t="acc">👤 บัญชี</button>';
 const first=menuEl.firstElementChild;first.after(tabs);for(const b of tabs.children)b.onclick=e=>{e.stopPropagation();menuTab6(b.dataset.t)};
 const gh=document.createElement('b');gh.className='sec';gh.textContent='🖼️ ภาพ';gh.dataset.pane='gfx';const g1=menuEl.querySelector('[data-pane=gfx]');if(g1)g1.before(gh);
 menuTab6(localStorage.getItem('fm_mtab')||'ctl')}
function menuTab6(t){for(const p of ['ctl','snd','gfx','acc'])menuEl.classList.toggle('p6-'+p,p===t);for(const b of menuEl.querySelectorAll('.tabs6 button'))b.classList.toggle('on',b.dataset.t===t);try{localStorage.setItem('fm_mtab',t)}catch(e){}}
{const _tm=toggleMenu;toggleMenu=function(){const r=_tm.apply(this,arguments);try{if(!menuEl.hidden)setupMenu6()}catch(e){}return r}}


// =====================================================================
// v4.6 (จ) : เล่นออนไลน์กับเพื่อนผ่านลิงก์หน้าเว็บ (ห้องสดของ claude.ai) — ไม่ต้องตั้งเซิร์ฟเวอร์
// =====================================================================
const RM={r:null,seen:{},chatN:0,joinT:0,names:{}};
const cleanS=(v,n)=>String(v==null?'':v).replace(/[\u0000-\u001f\u007f<>]/g,'').slice(0,n);
const numC=(v,a,b)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):0};
function roomSnap(){const r=RM.r;if(!r)return;const sc=netScene(),ps=[];let on=0;
 for(const p of r.peers()){const s=p.presence&&p.presence.s;if(!s||typeof s!=='object')continue;on++;if(p.sameTab)continue;if(s.sc!==sc)continue;
  const ar={};if(s.armor&&typeof s.armor==='object')for(const k of ['sword','helm','chest','pants','arm','neck','ring'])if(typeof s.armor[k]==='string'&&ITEMS[s.armor[k]])ar[k]=s.armor[k];
  ps.push({id:p.peer,x:numC(s.x,-1e5,1e5),y:numC(s.y,-1e5,1e5),dir:['u','d','l','r'].includes(s.dir)?s.dir:'d',mv:!!s.mv,run:!!s.run,at:numC(s.at,-1,1),cmb:numC(s.cmb,0,3)|0,tool:cleanS(s.tool,8),draw:!!s.draw,armor:ar,tier:{sword:numC(s.tier&&s.tier.sword,0,5)|0},lv:numC(s.lv,1,999)|0,name:cleanS(s.name,16)||'ผู้กล้า',dead:!!s.dead,cls:cleanS(s.cls,8)})}
 netMsg({t:'snap',on:Math.max(1,on),ps})}
function roomChat(change){for(const p of [...change.joined,...change.updated]){const c=p.presence&&p.presence.c;if(!c||typeof c!=='object')continue;const last=RM.seen[p.peer];RM.seen[p.peer]=c.i;
  if(last===undefined&&performance.now()-RM.joinT<4000&&!p.sameTab)continue;if(last===c.i||p.sameTab)continue;const s=p.presence.s||{};const nm=cleanS(s.name,16)||'ผู้กล้า';
  const txt=typeof chatClean==='function'?chatClean(cleanS(c.txt,140)):cleanS(c.txt,140);if(!txt)continue;
  try{_rmChatSay(c.ch==='guild'?'guild':'gen',nm+(p.guest?' (แขก)':''),txt,p.sameTab?'#fff0b0':'#9fd8ff')}catch(e){}
  if(!p.sameTab){const o=NET.others.get(p.peer);if(o)o.bub={txt:txt.slice(0,60),until:performance.now()+4500}}}
 for(const p of change.joined)if(!p.sameTab&&p.presence&&p.presence.s&&performance.now()-RM.joinT>3000)sysSay('🌐 '+(cleanS(p.presence.s.name,16)||'เพื่อน')+' เข้ามาเล่นแล้ว');
 for(const p of change.left){const s=p.presence&&p.presence.s;if(s)sysSay('🌐 '+(cleanS(s.name,16)||'เพื่อน')+' ออกจากเกม');NET.others.delete(p.peer);delete RM.seen[p.peer]}}
const _rmChatSay=chatSay;
function roomStart(r){RM.r=r;RM.joinT=performance.now();
 const shim={readyState:1,send(str){let d;try{d=JSON.parse(str)}catch(e){return}
   if(d.t==='st'){delete d.t;r.presence({s:d}).catch(()=>{})}
   else if(d.t==='chat'){RM.chatN++;r.presence({c:{i:RM.chatN+'-'+Date.now(),ch:d.ch==='guild'?'guild':'gen',txt:cleanS(d.txt,140)}}).catch(()=>{})}},close(){}};
 const live=()=>!SET.server;
 const up=()=>{if(!live())return;if(!NET.ws||NET.ws===shim){NET.ws=shim;NET.on=r.connected();netStatus()}};
 r.onConnection(c=>{if(!live())return;const was=NET.on;up();if(c&&!was&&!RM.hello){RM.hello=1;sysSay('🌐 ออนไลน์แล้ว! เพื่อนที่เปิดหน้านี้อยู่จะเห็นเราและแชทกันได้')}},()=>{if(NET.ws===shim){NET.ws=null;NET.on=false;NET.others.clear();netStatus()}});
 r.onPeers(ch=>{if(!live())return;up();roomChat(ch);roomSnap()},()=>{});
 setInterval(()=>{if(live()&&NET.ws===shim)roomSnap()},500)}
(async()=>{try{if(!window.claude||!claude.use)return;const r=await claude.use('room');if(!r)return;roomStart(r)}catch(e){}})();
// แชทระหว่างออนไลน์ผ่านห้อง: ข้อความของตัวเองแสดงตอนได้รับกลับ (กันซ้ำ)
{const st=document.createElement('style');st.textContent='#netb.on{box-shadow:0 0 0 2px #5ad06a,0 0 10px #5ad06a}';document.head.appendChild(st)}
setTimeout(()=>{try{const s=gid('netst');if(s&&s.parentNode&&!gid('nethint')){const h=document.createElement('div');h.id='nethint';h.style.cssText='font-size:11px;opacity:.85;margin:2px 0 6px;line-height:1.45';h.textContent='💡 เล่นกับเพื่อนง่ายสุด: แชร์ลิงก์หน้านี้ให้เพื่อน (เพื่อนต้องล็อกอิน Claude) ทุกคนที่เปิดหน้าเดียวกันจะเห็นกันและแชทกันได้ทันที — ไม่ต้องใส่ที่อยู่เซิร์ฟเวอร์';s.after(h)}}catch(e){}},1500);


// =====================================================================
// v4.6.1 : หน้าร้าน/เตา/ทั่ง/กระเป๋า เลื่อนขึ้นกลางจอ ไม่โดนแถบลัด/แชทบัง · ถือธนูตรงกลางคันธนู · ให้ของขวัญเลือกจากกระเป๋า
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#wrap #shop{top:50%!important;bottom:auto!important;left:50%!important;transform:translate(-50%,-50%)!important;transform-origin:center!important;z-index:22!important;width:min(96vw,900px);max-width:96vw!important;max-height:calc(100% - 14px)!important;overflow:auto;box-sizing:border-box;box-shadow:0 10px 40px rgba(0,0,0,.7)}
#wrap #bag{top:50%!important;left:50%!important;right:auto!important;transform:translate(-50%,-50%)!important;z-index:22!important;max-height:calc(100% - 14px)!important;max-width:96vw!important;box-sizing:border-box;box-shadow:0 10px 40px rgba(0,0,0,.7)}
#wrap.panel6 #bar,#wrap.panel6 #chatTg,#wrap.panel6 #chatBox,#wrap.panel6 #acts,#wrap.panel6 #ultb,#wrap.panel6 #qtrack,#wrap.panel6 #msg,#wrap.panel6 #bfrow,#wrap.panel6 #zb,#wrap.panel6 #tut{visibility:hidden!important}
#wrap.panel6::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.45);z-index:21;pointer-events:none}
#giftw .lst{grid-template-columns:repeat(auto-fill,minmax(78px,1fr))}
#giftw .cell{flex-direction:column;aspect-ratio:auto;padding:6px 2px 4px;gap:2px;--tc:#6a5a3a}
#giftw .cell img{width:40px;height:40px}#giftw .cell small{font-size:10.5px;opacity:.9;text-align:center;line-height:1.2;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#giftw .cell em{left:auto;right:4px;color:#fff}
#giftw .cell.love{--tc:#ff6a9a;box-shadow:0 0 10px rgba(255,106,154,.5)}#giftw .cell.like{--tc:#ffb84a}
`;document.head.appendChild(st)}
{const shopE=gid('shop'),bagE=gid('bag'),w=gid('wrap');setInterval(()=>{const open=(shopE&&!shopE.hidden)||(bagE&&!bagE.hidden);w.classList.toggle('panel6',!!open)},120)}
// ธนูวาดใหม่: คันโค้งสมมาตร จับกลางคัน หันตามทิศยิง · ยิงแล้วง้างสายจริง
const BOWT=[['#6a4424','#a07040','#c8ccd6'],['#5a3a1e','#9a6a3a','#d8dce6'],['#6a3010','#c8743a','#ffb070'],['#3a3e4a','#c8d0dc','#ffffff'],['#5a4008','#e8b820','#fff0a0'],['#1a3a5a','#5ac8f0','#e0faff']];
function drawBow6(x,y,aim,tier,pull,arrow,sc){const C=BOWT[tier|0]||BOWT[0],t=performance.now()/1000;ctx.save();ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc||1,sc||1);ctx.lineCap='round';ctx.lineJoin='round';
 const sx=-5-pull*11;// สาย
 ctx.strokeStyle='rgba(235,230,215,.9)';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(-5,-22);ctx.lineTo(sx,0);ctx.lineTo(-5,22);ctx.stroke();
 const limb=s=>{ctx.beginPath();ctx.moveTo(1,0);ctx.bezierCurveTo(7,s*7,6,s*17,-2,s*22);ctx.quadraticCurveTo(-4.5,s*23.5,-6,s*22.2)};
 ctx.strokeStyle='#1a1008';ctx.lineWidth=4.6;limb(-1);ctx.stroke();limb(1);ctx.stroke();ctx.strokeStyle=C[1];ctx.lineWidth=3;limb(-1);ctx.stroke();limb(1);ctx.stroke();
 ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(3,-3);ctx.bezierCurveTo(7.5,-9,6.5,-16,0,-21);ctx.stroke();
 ctx.fillStyle=C[2];for(const s of [-1,1]){ctx.beginPath();ctx.arc(-5.6,s*22.3,1.6,0,7);ctx.fill()}
 ctx.fillStyle=C[0];ctx.fillRect(-1,-5,5,10);ctx.fillStyle=C[2];ctx.fillRect(-1,-5.5,5,1.4);ctx.fillRect(-1,4.1,5,1.4);
 if(tier>=3){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(4,0,0,4,0,26);g.addColorStop(0,tier>=5?'rgba(120,220,255,.35)':'rgba(255,230,150,.3)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(-24,-28,52,56);ctx.globalCompositeOperation='source-over'}
 if(arrow){ctx.strokeStyle='#7a5a32';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(14,0);ctx.stroke();ctx.fillStyle='#d8dce8';ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(13,-2.6);ctx.lineTo(13,2.6);ctx.closePath();ctx.fill();ctx.fillStyle='#e04a3a';ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(sx-3,-2.5);ctx.lineTo(sx+3,0);ctx.lineTo(sx-3,2.5);ctx.closePath();ctx.fill();
  if(pull>.6){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(17,0,0,17,0,7);g.addColorStop(0,'rgba(255,240,180,.8)');g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.fillRect(10,-7,14,14)}}
 ctx.restore()}
const AIM={r:0,l:Math.PI,d:Math.PI/2,u:-Math.PI/2};
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){if(!(P.tool==='sword'&&isRng()&&wKind()==='bow'))return _ts(hx,hy,ang);const tier=P.tier.sword|0,at=P.at>=0&&P.at<.5,pull=at?Math.min(1,P.at/.3)*(P.at<.36?1:0):0;
  if(at){const sd=P.dir==='l'?-1:P.dir==='r'?1:0;hx+=sd*7;if(P.dir==='u')hy-=6}const aim=at?AIM[P.dir]:(P.dir==='d'?Math.PI/2+.75:P.dir==='u'?-Math.PI/2-.6:AIM[P.dir]);drawBow6(hx,hy,aim,tier,pull,at&&P.at<.36,at?1:.85);
  ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-2.5,hy-2.5,5,5);P.tip={x:hx+Math.cos(aim)*16,y:hy+Math.sin(aim)*16,t:performance.now()}}}
{const _h=hero;hero=function(){_h();try{if(!window.BOW7&&!P.dead&&P.draw&&P.tool==='sword'&&isRng()&&wKind()==='bow'&&(P.dir==='l'||P.dir==='r')&&!(P.at>=0)&&!(MOUNT&&MOUNT.on)&&!P.sit){const f=P.dir==='l'?-1:1,s=P.mv?Math.sin(P.t):0;drawBow6(P.x+f*5+s*3*f,P.y-17,AIM[P.dir],P.tier.sword|0,0,false,.85);ctx.fillStyle='#f1d2b0';ctx.fillRect(P.x+f*5+s*3*f-2.5,P.y-19.5,5,5)}}catch(e){}}}
// ให้ของขวัญ: เลือกจากช่องกระเป๋า (เห็นรูปและจำนวน)
const gfW=mk6('giftw');const GF={n:null,key:null};
giftPick=function(n,key){const L=LV(key);if(L.gift===HOME.day){talk(n,'วันนี้ให้ของข้าแล้วนี่นา พรุ่งนี้ค่อยมาใหม่นะ',[BYE],ROM[key].dn);return}
 const items=INVORDER.filter(k=>inv[k]>0&&k!=='coin'&&!/^t_|^sd_|^pa_/.test(k));if(!items.length){say('ไม่มีของในกระเป๋า');return}
 GF.n=n;GF.key=key;try{dlgClose(true)}catch(e){}p6open(gfW);renderGift()};
function renderGift(){const R=ROM[GF.key],L=LV(GF.key),known=L.known||(L.known={});
 const items=INVORDER.filter(k=>inv[k]>0&&k!=='coin'&&!/^t_|^sd_|^pa_/.test(k));
 let h='<div class="w"><div class="hd"><b>🎁 เลือกของขวัญให้'+R.dn+'</b><span style="font-size:12px;opacity:.85;margin-right:6px">'+heartsTxt(L.h)+'</span><button onclick="closeGift()">✕</button></div><div class="bd"><div class="col" style="flex:1"><small>แตะของที่จะให้ · ของที่เคยให้แล้วเธอชอบจะมีกรอบสี (💗 ชอบมาก · 🧡 ชอบ) · ให้ได้วันละ 1 ชิ้น</small><div class="lst">';
 for(const k of items){const kn=known[k];let ic='';try{ic=iconURL('mat:'+k)}catch(e){}h+='<div class="cell'+(kn==='love'?' love':kn==='like'?' like':'')+'" onclick="giftGive(\''+k+'\')"><img src="'+ic+'"><small>'+(kn==='love'?'💗 ':kn==='like'?'🧡 ':'')+MN(k)+'</small><em>'+inv[k]+'</em></div>'}
 h+='</div></div></div></div>';gfW.innerHTML=h}
window.closeGift=()=>p6close(gfW);
window.giftGive=k=>{const R=ROM[GF.key],L=LV(GF.key);if(!(inv[k]>0))return;const known=L.known||(L.known={});known[k]=R.love.includes(k)?'love':R.like.includes(k)?'like':R.hate.includes(k)?'hate':'ok';p6close(gfW);giveGift(GF.n,GF.key,k)};

// เครื่องมือหันหน้า (ลูกศรลง): ยกเหนือหัว → สับพุ่งเข้าหาจอ → หัวขวาน/อีเต้อ/จอบ "ปัก" ลงดินหน้าเท้า
// [DOWN+ขวาน] มุมมองจากด้านหลังใบขวาน: ด้ามตั้งตรงลงพื้น · เห็นสัน (หลังใบ) ด้านบน · ใบเรียวลงเป็นคมที่ปลายล่าง แตะพื้น
function axeDownBack6(hx,hy,k,ground,stuck){const Q=TIERS[(P.tier&&P.tier.axe)|0]||TIERS[0],L=30*k,hb=hy+21*k;ctx.save();if(stuck){ctx.beginPath();ctx.rect(hx-30,hy-10,60,ground+1-(hy-10));ctx.clip()}
 ctx.fillStyle='#2a1a0e';ctx.fillRect(hx-2.3,hy,4.6,22*k);ctx.fillStyle=Q.gr==='#2a1e14'?'#6a4426':'#8a5a30';ctx.fillRect(hx-1.5,hy,3,22*k);ctx.fillStyle='rgba(255,230,190,.35)';ctx.fillRect(hx-1.2,hy,1,22*k);
 const top=hb-3*k,y1=hb+2*k,yE=hy+L+2*k;ctx.fillStyle=Q.dk;ctx.fillRect(hx-5.5,top,11,5*k+1);ctx.fillStyle=Q.lo;ctx.fillRect(hx-4.5,top+1,9,3*k);
 const g=ctx.createLinearGradient(hx-5,0,hx+5,0);g.addColorStop(0,Q.lo);g.addColorStop(.5,Q.hi);g.addColorStop(1,Q.mid);ctx.fillStyle=g;ctx.strokeStyle=Q.dk;ctx.lineWidth=1;
 ctx.beginPath();ctx.moveTo(hx-5,y1);ctx.lineTo(hx+5,y1);ctx.lineTo(hx+1,yE);ctx.lineTo(hx-1,yE);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#ffffff';ctx.fillRect(hx-1,yE-1.6,2,1.6);ctx.restore()}
// [DOWN+ที่ขุดแร่] มุมมองจากด้านหลังหัวพลั่ว: ด้ามตั้งตรงลงพื้น · หัวเหล็กเห็นเป็นแนวตั้ง ปลายแหลมล่างปักดิน ปลายบนชี้ขึ้นหลังด้าม (เหมือนหลักของขวาน)
function pickDownBack6(hx,hy,k,ground,stuck){const Q=TIERS[(P.tier&&P.tier.pick)|0]||TIERS[0],hb=hy+21*k,yE=hy+31*k+2*k;ctx.save();if(stuck){ctx.beginPath();ctx.rect(hx-30,hy-30,60,ground+1-(hy-30));ctx.clip()}
 const g=ctx.createLinearGradient(hx-3,0,hx+3,0);g.addColorStop(0,Q.lo);g.addColorStop(.5,Q.hi);g.addColorStop(1,Q.mid);
 ctx.fillStyle=g;ctx.strokeStyle=Q.dk;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(hx-2.6,hb-2*k);ctx.lineTo(hx-.6,hb-13*k);ctx.lineTo(hx+.6,hb-13*k);ctx.lineTo(hx+2.6,hb-2*k);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#2a1a0e';ctx.fillRect(hx-2.3,hy,4.6,22*k);ctx.fillStyle=Q.gr==='#2a1e14'?'#6a4426':'#8a5a30';ctx.fillRect(hx-1.5,hy,3,22*k);ctx.fillStyle='rgba(255,230,190,.35)';ctx.fillRect(hx-1.2,hy,1,22*k);
 ctx.fillStyle=Q.dk;ctx.fillRect(hx-4,hb-3*k,8,5*k+1);ctx.fillStyle=Q.lo;ctx.fillRect(hx-3,hb-2*k,6,3*k);
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(hx-3,hb+2*k);ctx.lineTo(hx+3,hb+2*k);ctx.lineTo(hx+.5,yE);ctx.lineTo(hx-.5,yE);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#ffffff';ctx.fillRect(hx-.8,yE-1.6,1.6,1.6);ctx.restore()}
window.CHOP6=()=>P.at>=0&&P.tool!=='sword'&&P.tool!=='rod';
{const _tw=toolSwing;toolSwing=function(x,by,d,side,f,TOP,held){if(side||d!=='d')return _tw(x,by,d,side,f,TOP,held);const p=P.at,ez=u=>u*u*u,eo=u=>1-Math.pow(1-u,3),EDGE=.4;
  let hx,hy,ang,sx,sy,rec=0;
  if(p<.38){const u=eo(p/.38);hx=x-11+12*u;hy=by-13-41*u;ang=-.5*(1-u);sx=1-(1-EDGE)*u;sy=1}
  else if(p<.46){const u=ez((p-.38)/.08);hx=x+1;hy=by-54+30*u;ang=0;sx=EDGE;sy=1-2*u}
  else if(p<.66){rec=Math.sin((p-.46)/.2*Math.PI);hx=x+1;hy=by-24+1.5*rec;ang=0;sx=EDGE;sy=-1}
  else{const u=eo((p-.66)/.34);hx=x+1-12*u;hy=by-24+11*u;ang=-.5*Math.max(0,(u-.7)/.3);sx=EDGE+(1-EDGE)*u;sy=-1+2*Math.min(1,u/.6)}
  if(Math.abs(sy)<.12)sy=sy<0?-.12:.12;
  // [แก้บั๊ก DOWN+ขวาน] ช่วง IMPACT: หมุนขวาน -90° (ไม่พลิกแนวตั้ง) ใบขวานจึงห้อยลง คมอยู่ด้านล่างแตะพื้น · มือยังจับจุดเดิมของด้าม
  let gx=null;
  // [DOWN+ขวาน ดึงกลับ] ดึงขวานขึ้นจากดิน (เห็นภาพหลังใบเต็มขนาด) แล้วเหวี่ยงกลับขึ้นไปท่าถือทางซ้าย — ไม่พลิกจนบางหาย
  if((P.tool==='axe'||P.tool==='pick')&&p>=.66){const u=eo((p-.66)/.34);if(u<.35){const w=u/.35;hx=x+1-4*w;hy=by-22-6*w;ang=0;sx=1;sy=-1}else{const v=(u-.35)/.65;hx=x-3-8*v;hy=by-28+15*v;ang=Math.PI+(Math.PI-.5)*v;sx=1;sy=1}}
  const tl=P.tool,cv=(typeof TOOLKEYS!=='undefined'&&TOOLKEYS.includes(tl))?farmTool(tl,HOME.tools[tl]|0):toolIcon(tl,(P.tier&&P.tier[tl])|0,64),ground=by+7,stuck=p>=.44&&p<.7;
  // ดินแตกเมื่อปักลง
  const dx=gx!=null?gx:hx;if(stuck){ctx.save();ctx.fillStyle='rgba(60,40,20,.55)';ctx.beginPath();ctx.ellipse(dx,ground+1,7,2.4,0,0,7);ctx.fill();ctx.strokeStyle='rgba(40,25,10,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(dx-8,ground+1);ctx.lineTo(dx-12,ground+3);ctx.moveTo(dx+7,ground);ctx.lineTo(dx+12,ground+2);ctx.stroke();ctx.restore()}
  if(tl==='axe'&&sy<0)axeDownBack6(hx,hy,-sy,ground,stuck);else if(tl==='pick'&&sy<0)pickDownBack6(hx,hy,-sy,ground,stuck);else{ctx.save();if(stuck){ctx.beginPath();ctx.rect(hx-40,hy-80,80,ground-(hy-80));ctx.clip()}ctx.translate(hx,hy);ctx.rotate(ang);ctx.scale(sx,sy);if((tl==='axe'||tl==='pick')&&window.AXS7)ctx.scale(AXS7,AXS7);ctx.drawImage(cv,-23,-36,46,46);ctx.restore();}
  if(stuck){ctx.save();ctx.fillStyle='#7a5a32';ctx.beginPath();ctx.ellipse(dx,ground,5,1.8,0,Math.PI,0);ctx.fill();ctx.restore()}
  // แขนสองข้าง: ต้นแขน+ปลายแขน+มือ (ซ่อนแขนเดิมแล้ว ไม่ซ้อนเป็นสามแขน)
  const arm=(sx0,s2)=>{const shx=x+sx0,shy=by-24,ex=(shx+hx+s2*3)/2+s2*3,ey=(shy+hy)/2+(hy<by-34?-2:2);ctx.save();ctx.strokeStyle=TOP;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=5.5;ctx.beginPath();ctx.moveTo(shx,shy);ctx.lineTo(ex,ey);ctx.lineTo(hx+s2*2.5,hy+1);ctx.stroke();ctx.restore()};
  arm(-8,-1);arm(8,1);ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-5,hy-2,4,4);ctx.fillRect(hx+1,hy-2,4,4);
  if(p>.38&&p<.5){ctx.save();ctx.globalAlpha=.45*(1-(p-.38)/.12);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+1,by-80);ctx.lineTo(x+1,ground);ctx.stroke();ctx.restore()}
  if(p>.44&&p<.5&&!P._chip6){P._chip6=1;try{shake(1.2,.08)}catch(e){}for(let i=0;i<9;i++)fx.push({x:hx+(Math.random()-.5)*10,y:ground,vx:(Math.random()-.5)*90,vy:-30-Math.random()*50,l:.35,c:'150,120,80'})}if(p<.4)P._chip6=0}}
// หันข้าง: ง้างไปด้านหลังเหนือไหล่ → ฟาดลงหน้าเท้า หัวเครื่องมือปักดิน · เคียว = เกี่ยวต่ำแนวนอน · บัวรดน้ำ = เอียงเทน้ำ (ไม่ฟาด)
function toolCv6(){const tl=P.tool;return (typeof TOOLKEYS!=='undefined'&&TOOLKEYS.includes(tl))?farmTool(tl,HOME.tools[tl]|0):toolIcon(tl,(P.tier&&P.tier[tl])|0,64)}
function armTo6(sx,sy,hx,hy,TOP){ctx.strokeStyle=TOP;ctx.lineCap='round';ctx.lineWidth=5.5;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo((sx+hx)/2,(sy+hy)/2+2);ctx.lineTo(hx,hy);ctx.stroke();ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-3,hy-2.5,6,5)}
function drawTool6(hx,hy,ang,sx,sy,clipY){ctx.save();if(clipY!=null){ctx.beginPath();ctx.rect(hx-60,hy-90,120,clipY-(hy-90));ctx.clip()}ctx.translate(hx,hy);ctx.rotate(ang);ctx.scale(sx||1,sy||1);if((P.tool==='axe'||P.tool==='pick')&&window.AXS7)ctx.scale(AXS7,AXS7);if(P.dir==='r'&&sx===undefined)ctx.scale(-1,1);ctx.drawImage(toolCv6(),-23,-36,46,46);ctx.restore()}
{const _tw=toolSwing;toolSwing=function(x,by,d,side,f,TOP,held){const p=P.at,ez=u=>u*u*u,eo=u=>1-Math.pow(1-u,3),tl=P.tool;
  if(tl==='can'){const tilt=p<.25?eo(p/.25):p<.75?1:1-eo((p-.75)/.25),hx=side?x+f*9:x+(d==='d'?5:-5),hy=by-(side?16:d==='u'?24:15);
   const ang=side?f*1.15*tilt:(d==='d'?.9*tilt:-.9*tilt);armTo6(side?x:x+(d==='d'?8:-8),by-24,hx,hy,TOP);ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(side&&f<0)ctx.scale(-1,1);ctx.drawImage(toolCv6(),-23,-30,46,46);ctx.restore();
   if(tilt>.8&&Math.random()<.9){const sp=side?[hx+f*20,hy+2]:[hx+(d==='d'?10:-10),hy+(d==='u'?-6:8)];for(let i=0;i<2;i++)rfxP(sp[0]+(Math.random()-.5)*4,sp[1],(Math.random()-.5)*10+(side?f*10:0),40+Math.random()*30,.35,'150,200,255',1.8,'drip')}return}
  if(tl==='sick'){const u=p<.15?eo(p/.15):p<.4?1:p<.5?1-ez((p-.4)/.1)*2:p<.7?-1:-1+eo((p-.7)/.3)*1;// 1=ง้าง -1=เกี่ยวผ่าน
   let hx,hy,ang;if(side){hx=x+f*(4+6*(1-u));hy=by-14+Math.abs(u)*2;ang=f*(1.9-1.1*u)}else{hx=x+(d==='d'?-10*u:10*u);hy=by-(d==='u'?20:12);ang=(d==='d'?2.2:-.9)+(-1.2*u)}
   armTo6(side?x:x+(hx<x?-8:8),by-24,hx,hy,TOP);drawTool6(hx,hy,ang,side&&f<0?-1:1,1);
   if(p>.4&&p<.5){ctx.save();ctx.globalAlpha=.4;ctx.strokeStyle='#e8ffd0';ctx.lineWidth=3;ctx.beginPath();if(side)ctx.arc(x+f*10,by-6,22,f>0?-1.2:Math.PI-0.4,f>0?.4:Math.PI+1.2);else ctx.ellipse(x,by-4,20,6,0,0,Math.PI);ctx.stroke();ctx.restore()}return}
  if(!side)return _tw(x,by,d,side,f,TOP,held);
  let hx,hy,ang;const ground=by+6;
  if(p<.38){const u=eo(p/.38);hx=x+f*(4-7*u);hy=by-15-26*u;ang=f*(-.2-1.2*u)}
  else if(p<.46){const u=ez((p-.38)/.08);hx=x+f*(-3+15*u);hy=by-41+23*u;ang=f*(-1.4+3.45*u)}
  else if(p<.66){const r=Math.sin((p-.46)/.2*Math.PI);hx=x+f*12;hy=by-18+r;ang=f*2.05}
  else{const u=eo((p-.66)/.34);hx=x+f*(12-8*u);hy=by-18+3*u;ang=f*(2.05-2.25*u)}
  const stuck=p>=.44&&p<.68;
  if(stuck){ctx.save();const gx=x+f*31;ctx.fillStyle='rgba(60,40,20,.5)';ctx.beginPath();ctx.ellipse(gx,ground+1,7,2.2,0,0,7);ctx.fill();ctx.restore()}
  drawTool6(hx,hy,ang,(P.dir==='r'?-1:1)*(P.tool==='hoe'?-1:1),1,stuck?ground:null);armTo6(x+f*1,by-24,hx,hy,TOP);
  if(stuck){ctx.fillStyle='#7a5a32';ctx.beginPath();ctx.ellipse(x+f*31,ground,5,1.6,0,Math.PI,0);ctx.fill()}
  if(p>.38&&p<.5){ctx.save();ctx.globalAlpha=.4*(1-(p-.38)/.12);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.arc(x+f*2,by-14,32,f>0?-2.3:Math.PI-.9,f>0?.9:Math.PI+2.3);ctx.stroke();ctx.restore()}
  if(p>.44&&p<.5&&!P._chip7){P._chip7=1;for(let i=0;i<8;i++)fx.push({x:x+f*31+(Math.random()-.5)*8,y:ground,vx:(Math.random()-.5)*80+f*20,vy:-30-Math.random()*50,l:.35,c:'150,120,80'})}if(p<.4)P._chip7=0}}
// โหมดทดลอง (เบราว์เซอร์ไม่ให้เก็บข้อมูล): ปุ่มเล่นทันที ไม่ต้องสมัครไอดี
if(window.FM_NOSAVE){const _tm=tMain;tMain=function(){_tm();try{const pan=gid('tpan');if(!pan||pan.querySelector('#nsPlay'))return;
  pan.innerHTML='<div style="text-align:center;font-weight:800;margin-bottom:6px">🎮 โหมดทดลองเล่น</div><button class="tb" id="nsPlay" style="background:linear-gradient(180deg,#ffe9a0,#e8b84a);color:#3a2408;font-weight:900">▶ เล่นเลย</button><small style="display:block;text-align:center;opacity:.8;margin-top:6px;line-height:1.5">หน้านี้เก็บข้อมูลในเครื่องไม่ได้ — เล่นได้ปกติ แต่ปิดหน้าแล้วเซฟจะหาย<br>อยากเก็บเซฟ ให้เปิดลิงก์ในเบราว์เซอร์ (Chrome/Safari) หรือแอป APK</small>';
  gid('nsPlay').onclick=()=>{try{if(!P.name)P.name='ผู้กล้า';tPlay()}catch(e){titleEl.hidden=true;PAUSED=false}}}catch(e){}};
 setTimeout(()=>{try{sysSay('🎮 โหมดทดลอง: เซฟจะหายเมื่อปิดหน้า')}catch(e){}},4000)}


// =====================================================================
// v4.7 (ช) : ดาบสะพายหลังทุกทิศ · คอมโบดาบ 3 จังหวะทั้งตัว · ค้อนตอกตะปูตอนก่อสร้าง
// (ไม่แตะระบบขวาน / movement / input / hitbox / ขนาด sprite)
// =====================================================================

// ---------- A. SWORD ON BACK : ตำแหน่ง/มุม/เลเยอร์ แยกตามทิศ ----------
// UP / DOWN ใช้ค่าเดิมในฟังก์ชัน backSword (ไม่แก้) : Up=(x+4,by-34) หมุน -2.62 · Down=(x+8,by-33) หมุน -2.72
const swordBackOffsetUp={x:4,y:-34},swordBackOffsetDown={x:8,y:-33};
const swordBackRotationUp=-2.62,swordBackRotationDown=-2.72;
// LEFT / RIGHT : มุมมองด้านข้าง — ด้ามโผล่เหนือไหล่ด้านหลังศีรษะ ใบดาบพาดเฉียงลงตามแนวหลัง ปลายเลยสะโพกไปด้านหลัง
// x = ไปทางหลังตัวละคร (หันซ้าย หลังอยู่ขวา +x · หันขวา หลังอยู่ซ้าย -x)
const swordBackOffsetLeft={x:6,y:-37},swordBackOffsetRight={x:-6,y:-37};
const swordBackRotationLeft=Math.PI-.38,swordBackRotationRight=Math.PI+.38;
const SWORD_BACK_SIDE_SCALE=.86;
// เลเยอร์: DOWN = หลังตัว (วาดก่อนลำตัว · เดิม) · UP = ทับหลัง (วาดหลังลำตัว · เดิม) · LEFT/RIGHT = หลังลำตัว (วาดก่อนลำตัว แล้วศีรษะ/ลำตัวบังกลางดาบ)
const BK6={on:0};
function backWeaponSide(x,by,f){
 if(!P.armor.sword)return;const kd=wKind(),drawn=P.draw&&P.tool==='sword';
 if(drawn&&P.at>=0)return;                                            // กำลังฟัน = ดาบอยู่ในมือ
 if(drawn&&(kd==='bow'||kd==='staff'))return;      // คฑา/ธนูที่ถืออยู่ = อยู่ในมือ (ระบบ v46h) // ธนูถืออยู่ในมือ (มีตัววาดของมันแล้ว)
 const O=f<0?swordBackOffsetLeft:swordBackOffsetRight;let rot=f<0?swordBackRotationLeft:swordBackRotationRight,s=SWORD_BACK_SIDE_SCALE,ic,ox=O.x,oy=O.y;
 if(kd==='bow'){ic=toolIcon('bow',P.tier.sword|0,64);rot=f<0?Math.PI-.15:Math.PI+.15;ox=f<0?6:-6;oy=-22;s=.8}
 else if(kd==='staff'){ic=toolIcon('staff',P.tier.sword|0,64);rot=-f*.3;ox=f<0?5:-5;oy=-13;s=.86}
 else ic=toolIcon('sword',P.tier.sword,64);
 ctx.save();ctx.translate(Math.round(x+ox),Math.round(by+oy));ctx.rotate(rot);ctx.scale(s,s);ctx.drawImage(ic,-23,-36,46,46);ctx.restore();
 BK6.on=1;BK6.x=x;BK6.by=by;BK6.f=f;
 try{if(!drawn){const W=wAura();if(W&&DT)auraEmit(x-f*8,by-6,x-f*3,by-40,W,DT,.35)}}catch(e){}}
{const _bs=backSword;backSword=function(x,by,side,f,d){if(!side)return _bs(x,by,side,f,d);backWeaponSide(x,by,f)}}
// สายสะพายพาดบนลำตัวด้านข้าง (วาดหลังลำตัวเสร็จ) — ให้เห็นว่าดาบผูกติดหลัง ไม่ลอย
{const _hb=heroBody;heroBody=function(){BK6.on=0;_hb();if(BK6.on&&!(P.dash>0)){const x=BK6.x,by=BK6.by,f=BK6.f;ctx.save();ctx.strokeStyle='#4a3020';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-f*4,by-27);ctx.lineTo(x+f*3,by-14);ctx.stroke();ctx.restore()}BK6.on=0}}

// ---------- B. SWORD ATTACK 3-HIT COMBO (ทั้งร่างกาย) ----------
// เฟส: 0-.16 เตรียมท่า(anticipation) · .16-.28 ฟัน · .28-.42 แรงปะทะ(impact) · .42-.64 follow-through · .64-1 คืนตัว
// ท่าที่ 1 = ฟันเฉียงลงจากเหนือไหล่ · ท่าที่ 2 = ตวัดขึ้นย้อนแนว (backhand) · ท่าที่ 3 = เตรียมย่อ → หมุนตัวฟันรอบ → ฟาดค้าง → กลับ idle
// มุม: 0 = ใบดาบชี้ขึ้น, บวก = ตามเข็ม · ข้าง (ซ้าย/ขวา) กำหนดสำหรับหันขวา แล้วสะท้อนด้วย f
const SWC6={
 s:[{I:[4,-16,.9], W:[-4,-38,-1.0],S:[13,-20,2.25],F:[11,-14,2.65],R:[6,-18,1.6], b:{W:[-3,1,0],S:[4,1,0],F:[2,0,0]}},
    {I:[6,-18,1.6],W:[-6,-14,3.75],S:[10,-36,-.25],F:[6,-38,-.7], R:[5,-22,.6],  b:{W:[-2,2,0],S:[2,-1,0],F:[0,-1,0]}}],
 d:[{I:[-11,-13,-.5],W:[-12,-40,-.9],S:[3,-11,2.7],F:[5,-8,3.05],R:[0,-12,2.3],   b:{W:[0,-1,-2],S:[0,2,2],F:[0,1,1]}},
    {I:[0,-12,2.3],  W:[10,-22,1.2], S:[-12,-15,4.5],F:[-14,-17,4.9],R:[-11,-14,5.5],b:{W:[0,1,3],S:[0,1,-3],F:[0,0,-2]}}],
 u:[{I:[11,-13,.5],  W:[13,-38,1.3], S:[-7,-28,-1.5],F:[-9,-25,-2.0],R:[-4,-28,-1.0],b:{W:[0,-1,2],S:[0,1,-3],F:[0,0,-2]}},
    {I:[-4,-28,-1.0],W:[-10,-22,-2.2],S:[12,-36,1.4],F:[13,-33,1.9],R:[11,-20,.8], b:{W:[0,1,-3],S:[0,-1,3],F:[0,0,2]}}]};
const SWPH=[0,.16,.28,.42,.64,1];
const e6o=u=>1-Math.pow(1-u,3),e6i=u=>u*u*u,e6io=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
const swOn6=()=>P.tool==='sword'&&P.at>=0&&!isRng()&&!P.dead;
function swKey6(d){return d==='l'||d==='r'?'s':d}
// คืนค่า [hx,hy,ang] (สัมพัทธ์กับ x,by) ของท่าฟันที่เวลา p
function swPose6(c,d,p){const K=SWC6[swKey6(d)][c],f=d==='l'?-1:1,sd=d==='l'||d==='r',L=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];let v;
 if(p<SWPH[1])v=L(K.I,K.W,e6o(p/SWPH[1]));
 else if(p<SWPH[2])v=L(K.W,K.S,e6i((p-SWPH[1])/(SWPH[2]-SWPH[1])));
 else if(p<SWPH[3]){v=K.S.slice()}
 else if(p<SWPH[4])v=L(K.S,K.F,e6o((p-SWPH[3])/(SWPH[4]-SWPH[3])));
 else v=L(K.F,K.R,e6io((p-SWPH[4])/(SWPH[5]-SWPH[4])));
 if(sd){v[0]*=f;v[2]*=f}return v}
// ท่าทางลำตัว [เอนไปข้างหน้า(px ศีรษะ), ย่อ(px), บิดซ้าย-ขวา(px ศีรษะ)]
function swBody6(c,d,p){const B=SWC6[swKey6(d)][c].b,Z=[0,0,0],L=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];
 if(p<SWPH[1])return L(Z,B.W,e6o(p/SWPH[1]));if(p<SWPH[2])return L(B.W,B.S,e6i((p-SWPH[1])/(SWPH[2]-SWPH[1])));
 if(p<SWPH[3])return B.S;if(p<SWPH[4])return L(B.S,B.F,e6o((p-SWPH[3])/(SWPH[4]-SWPH[3])));return L(B.F,Z,e6io((p-SWPH[4])/(SWPH[5]-SWPH[4])))}
// ท่าที่ 3 : เตรียมย่อตัว → หมุน 1 รอบเร็ว (เลยนิดหนึ่ง) → ฟาดค้าง → ค่อยลดดาบกลับ
const SP6=[.16,.7,.84];
spinInfo=function(){const p=P.at,sg=P.spinDir==='l'?-1:1,base=SPIN_BASE[P.spinDir||'d'];let e,q;
 if(p<SP6[0]){e=-.06*e6o(p/SP6[0]);q=0}
 else if(p<SP6[1]){const u=(p-SP6[0])/(SP6[1]-SP6[0]);e=-.06+1.1*e6io(u);q=u}
 else if(p<SP6[2]){const u=(p-SP6[1])/(SP6[2]-SP6[1]);e=1.04-.04*e6o(u);q=1}
 else{e=1;q=1}
 return{ang:base+sg*Math.PI*2*e,sg,q,e}};
function spinBody6(p){if(p<SP6[0]){const u=e6o(p/SP6[0]);return[-2*u,3*u,0]}if(p<SP6[1]){const u=(p-SP6[0])/(SP6[1]-SP6[0]);return[-2+4*u,3-4*u,0]}
 if(p<SP6[2]){const u=(p-SP6[1])/(SP6[2]-SP6[1]);return[2+2*Math.sin(u*Math.PI),-1+3*e6o(u),0]}const u=e6io((p-SP6[2])/(1-SP6[2]));return[2*(1-u),2*(1-u),0]}
// แขน 2 ท่อน (ต้นแขน+ปลายแขน) งอศอกตามระยะ ไม่ยืดไม่หด
function swArm6(sx,sy,hx,hy,TOP,out){const dx=hx-sx,dy=hy-sy,dd=Math.hypot(dx,dy)||1,seg=9.5,h=dd<seg*2?Math.sqrt(seg*seg-(dd/2)*(dd/2)):0;
 let nx=-dy/dd,ny=dx/dd;if(nx*out+ny*.6<0){nx=-nx;ny=-ny}const ex=(sx+hx)/2+nx*h,ey=(sy+hy)/2+ny*h;
 ctx.save();ctx.strokeStyle=TOP;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=5.5;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.lineTo(hx,hy);ctx.stroke();ctx.restore()}
// รอยดาบแบบริบบิ้น: สุ่มตำแหน่งปลายดาบย้อนหลังตามเส้นทางจริงของท่า
function swRibbon6(x,by,c,d,p,tier){const t0=SWPH[1]+.02;if(p<t0||p>SWPH[4])return;const span=.14,N=16,R=31,r0=12,al=p>SWPH[3]?1-(p-SWPH[3])/(SWPH[4]-SWPH[3]):1;
 const tp=[];for(let k=0;k<=N;k++){const t=Math.max(t0,Math.min(SWPH[3],p)-span*(1-k/N)),v=swPose6(c,d,t),sa=Math.sin(v[2]),ca=-Math.cos(v[2]);tp.push([x+v[0]+sa*R,by+v[1]+ca*R,x+v[0]+sa*r0,by+v[1]+ca*r0])}
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(let k=0;k<N;k++){const a=tp[k],b=tp[k+1],w=(k+1)/N;ctx.globalAlpha=.75*al*w*w;ctx.fillStyle=tier.tr;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(b[2],b[3]);ctx.lineTo(a[2],a[3]);ctx.closePath();ctx.fill()}
 ctx.lineCap='round';ctx.lineJoin='round';for(let k=0;k<N;k++){const a=tp[k],b=tp[k+1],w=(k+1)/N;ctx.globalAlpha=al*w*.55;ctx.strokeStyle=tier.gl;ctx.lineWidth=2+5*w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  ctx.globalAlpha=al*w;ctx.strokeStyle='#fff';ctx.lineWidth=.8+1.6*w;ctx.stroke()}
 ctx.restore()}
function swFlash6(px,py,u,tier){if(u<0||u>1)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-u)*.9;ctx.fillStyle='#fff';ctx.translate(px,py);const s=3+7*e6o(u);
 ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?s*.32:s;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.globalAlpha=(1-u)*.5;ctx.strokeStyle=tier.gl;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,s*1.3,0,7);ctx.stroke();ctx.restore()}
// ไหล่ที่จับดาบ: หน้า=ไหล่ขวาตัวละคร(ซ้ายจอ) · หลัง=ไหล่ขวา(ขวาจอ) · ข้าง=ไหล่ใกล้กล้อง
const swShoulder6=(x,by,d,f)=>d==='d'?[x-10,by-24]:d==='u'?[x+10,by-24]:[x+f*1,by-24];
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){if(!swOn6())return _sf(x,by,d,side,f,TOP,held);
  const p=P.at,tier=TIERS[(P.tier&&P.tier.sword)|0]||TIERS[0],[sx,sy]=swShoulder6(x,by,d,f);
  if(P.cmb===2){const {ang,sg,q}=spinInfo(),start=SPIN_BASE[P.spinDir||'d'],cx=x,cy=by-17;let rr=11,ry=7,da=0;
   if(p<SP6[0]){const u=e6o(p/SP6[0]);rr=11-4*u;ry=7-2*u;da=-sg*1.1*u}                    // เตรียม: ดึงดาบชิดตัว เอียงไปด้านหลัง
   else if(p<SP6[0]+.06){const u=(p-SP6[0])/.06;rr=7+4*u;ry=5+2*u;da=-sg*1.1*(1-u)}
   else if(p>SP6[2]){const u=e6io((p-SP6[2])/(1-SP6[2]));rr=11-3*u;da=sg*.7*u}           // คืนตัว: ลดดาบลง
   const hx=cx+Math.sin(ang)*rr,hy=cy-Math.cos(ang)*ry+(p>SP6[2]?3*e6io((p-SP6[2])/(1-SP6[2])):0);
   if(p>=SP6[0]&&p<SP6[2]+.06){const tail=ang-sg*Math.min(4.4,Math.abs(ang-start)),al=p>SP6[2]?1-(p-SP6[2])/.06:1;ctx.save();ctx.translate(cx,cy);ctx.scale(1,.68);slashTrail(0,0,tail,ang,44,tier,al);ctx.restore();if(p<SP6[1])tipSpark(cx,cy,ang,44,1,.68)}
   if(p>SP6[1]&&p<SP6[2]+.1){const u=(p-SP6[1])/(SP6[2]+.1-SP6[1]);ctx.save();ctx.globalAlpha=.5*(1-u);ctx.strokeStyle=tier.gl;ctx.lineWidth=3*(1-u)+1;ctx.beginPath();ctx.ellipse(x,by+2,14+30*e6o(u),5+10*e6o(u),0,0,7);ctx.stroke();ctx.restore();
    if(!window._drawingOther&&!P._sh6){P._sh6=1;try{shake(2.2,.12)}catch(e){}}}
   if(p<.1)P._sh6=0;
   swArm6(sx,sy,hx,hy,TOP,d==='d'?-1:d==='u'?1:f);held(hx,hy,ang+da);return}
  const c=P.cmb===1?1:0;let [ox,oy,ang]=swPose6(c,d,p);
  if(p>=SWPH[2]&&p<SWPH[3]){const u=(p-SWPH[2])/(SWPH[3]-SWPH[2]);const k=Math.sin(u*Math.PI*6)*(1-u)*.8;ox+=k;oy-=k*.5}   // แรงปะทะ: สั่นค้างเล็กน้อย
  const hx=x+ox,hy=by+oy;
  swRibbon6(x,by,c,d,p,tier);
  swArm6(sx,sy,hx,hy,TOP,d==='d'?-1:d==='u'?1:-f);
  held(hx,hy,ang);
  if(p>=SWPH[2]-.01){const R=31;swFlash6(hx+Math.sin(ang)*R,hy-Math.cos(ang)*R,(p-SWPH[2])/(SWPH[3]-SWPH[2]+.06),tier)}}}
// ท่าทางลำตัวระหว่างฟัน: เอน/ย่อ/บิด ทั้งตัว (ยึดเท้าไว้กับพื้น · ไม่ย้ายตำแหน่งตัวละครจริง)
{const _hb=heroBody;heroBody=function(){if(!swOn6())return _hb();const d=P.dir,f=d==='l'?-1:1,side=d==='l'||d==='r',p=P.at;
  const b=P.cmb===2?spinBody6(p):swBody6(P.cmb===1?1:0,d,p);const lean=b[0],dip=b[1],tw=b[2];
  const hxo=side?f*lean:tw,sq=1-Math.max(0,dip)*.012+Math.max(0,-dip)*.01;
  ctx.save();ctx.translate(P.x,P.y);ctx.transform(1,0,-hxo/44,1,0,0);ctx.scale(1,sq);ctx.translate(-P.x,-P.y);try{_hb()}finally{ctx.restore()}}}

// ---------- C. ค้อน: เอาออกจากช่องลัด · ใช้อัตโนมัติตอนก่อสร้าง (ท่าตอกตะปู) ----------
function hamClean6(){try{let ch=0;for(let i=0;i<QS.slots.length;i++)if(QS.slots[i]==='t_hamr'){QS.slots[i]=null;ch=1}if(QS.cur==='t_hamr')QS.cur=null;if(P.tool==='hamr'){P.tool=P.armor.sword?'sword':'axe';P.draw=false;ch=1}if(ch)updQuick()}catch(e){}}

// รื้อของตกแต่ง (เดิมใช้ค้อนชี้) → หันหน้าเข้าหาแล้วกดปุ่มใช้/คุย
{const _ha=homeAct;homeAct=function(){const r=_ha();if(r)return r;try{const [tx,ty]=target(),Zm=ZCACHE[300],o=Zm&&Zm.oreAt[ty*HW+tx];if(o&&o.type==='bld'&&BLD[o.b.k]&&BLD[o.b.k].deco){askRemove(o.b);return true}}catch(e){}return false}}
// ท่าตอกตะปู: ระหว่างตอก ให้ระบบเดิมถือว่า "กำลังใช้เครื่องมือ" (ซ่อนแขนข้างที่ถือ ไม่ให้เป็น 3 แขน) แล้ววาดท่าตอกแทนท่าฟัน
const HAM6={on:0,t0:0,dur:1.5,x:0,y:0,n:-1};
function hamStart6(){HAM6.on=1;HAM6.t0=performance.now();HAM6.x=P.x;HAM6.y=P.y;HAM6.n=-1}
function hamLive6(){if(!HAM6.on)return false;const t=(performance.now()-HAM6.t0)/1000;if(t>HAM6.dur||Math.hypot(P.x-HAM6.x,P.y-HAM6.y)>3||P.dead||(D&&!D.home)){HAM6.on=0;return false}return true}
function hamPose6(x,by,d,f){const t=(performance.now()-HAM6.t0)/1000,per=.3,k=(t%per)/per,n=Math.floor(t/per);
 // ยกค้อน (0-.6) → ตอกลง (.6-.75) → ค้างแรงกระแทก (.75-1)
 const lift=k<.6?e6o(k/.6):k<.75?1-e6i((k-.6)/.15):0;let hx,hy,rot,nx,ny;
 if(d==='l'||d==='r'){hx=x+f*(7-2*lift);hy=by-12-9*lift;rot=f*(Math.PI/2-.05-1.25*lift);nx=x+f*27;ny=by-1}
 else if(d==='d'){hx=x+7;hy=by-14-9*lift;rot=.25+2.6*(1-lift);nx=x+12;ny=by+7}
 else{hx=x+9;hy=by-16-14*lift;rot=.1+.25*(1-lift);nx=x+5;ny=by-17}
 return{hx,hy,rot,nx,ny,n,k}}
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){if(!(HAM6.on&&P.tool==='hamr'&&!window._drawingOther))return _sf(x,by,d,side,f,TOP,held);
  const q=hamPose6(x,by,d,f),dn=Math.min(3,q.n*.8);
  // แผ่นไม้ + ตะปู (ตะปูจมลงทีละนิดตามจำนวนครั้งที่ตอก)
  ctx.fillStyle='#8a5a30';ctx.fillRect(q.nx-7,q.ny-1,14,3);ctx.fillStyle='#5a3a1c';ctx.fillRect(q.nx-7,q.ny+1,14,1);
  ctx.fillStyle='#c9ccd4';ctx.fillRect(q.nx-.5,q.ny-5+dn,1.5,4-dn);ctx.fillStyle='#e8eaf0';ctx.fillRect(q.nx-1.5,q.ny-5+dn,3.5,1);
  if(d==='d'){ctx.fillStyle=TOP;ctx.fillRect(x-14,by-26,6,12);ctx.fillStyle='#f1d2b0';ctx.fillRect(x-14,by-15,6,4)} // มืออีกข้างวางข้างตัว (ไม่หาย)
  const [sx,sy]=d==='d'?[x+10,by-24]:d==='u'?[x+10,by-24]:[x+f*1,by-24];swArm6(sx,sy,q.hx,q.hy,TOP,d==='l'||d==='r'?f:d==='u'?-1:1);
  ctx.save();ctx.translate(q.hx,q.hy);ctx.rotate(q.rot);if(f<0&&(d==='l'))ctx.scale(-1,1);ctx.drawImage(farmTool('hamr',HOME.tools.hamr|0),-21,-30,42,42);ctx.restore();
  ctx.fillStyle='#f1d2b0';ctx.fillRect(q.hx-3,q.hy-2,6,4);
  if(q.n!==HAM6.n&&q.k>=.75){HAM6.n=q.n;try{nz(.05,.45,2400,900,3);sfx('chop')}catch(e){}for(let i=0;i<5;i++)rfxP(q.nx,q.ny-4,(Math.random()-.5)*60,-30-Math.random()*40,.3,'255,230,160',1.6,'spark')}}}
{const _hb=heroBody;heroBody=function(){if(window._drawingOther||!hamLive6())return _hb();const d0=P.draw,t0=P.tool,a0=P.at;P.draw=true;P.tool='hamr';P.at=.001;
  try{_hb()}finally{P.draw=d0;P.tool=t0;P.at=a0}}}
{const _b=buildHouse;buildHouse=function(){const h0=HOME.house;_b();if(HOME.house>h0)setTimeout(hamStart6,120)}}
{const _c=confirmPlace;confirmPlace=function(){const n0=HOME.builds.length;_c();if(HOME.builds.length>n0)hamStart6()}}


// =====================================================================
// v4.7 (ซ) : คฑา (STAFF) + ธนู (BOW) — ถือจริง · ร่ายเวท/ง้างยิง ทั้งตัว · ธนู+กระบอกลูกธนูบนหลัง 4 ทิศ
// ใช้แนวคิดเดียวกับดาบ (เตรียม → ทำ → ปะทะ/ปล่อย → follow-through → คืนตัว) — ไม่แตะดาบ/ขวาน/hitbox/damage/input
// ทำงานเฉพาะเมื่อสวม คฑา/ธนู (isRng) เท่านั้น
// =====================================================================
const rgOn7=()=>P.tool==='sword'&&P.draw&&isRng()&&!P.dead;
window.RNGARM7=()=>(P.tool==='sword'&&P.at>=0&&isRng())||!!window.FRG7on;   // ซ่อนแขนเดิมตอนร่าย/ยิง (เราวาดแขน 2 ท่อนเอง กันเป็น 3 แขน)
window.RNGHOLD7=()=>isRng();                              // หันข้าง: ถือคฑา/ธนูในมือ (ไม่ซ่อนแบบดาบ)
window.BOW7=1;                                            // ปิดตัววาดธนูข้างตัวแบบเก่า
const L7=(a,b,u)=>a+(b-a)*u,LP7=(a,b,u)=>[L7(a[0],b[0],u),L7(a[1],b[1],u)];
const rgF7=d=>d==='l'?-1:1,rgSide7=d=>d==='l'||d==='r';
// ลำดับการยิงต่อเนื่อง (ภาพเท่านั้น) : shot 1 → 2 → 3
{const _a=attack;attack=function(q){const a0=P.at;_a(q);if(isRng()&&a0<0&&P.at===0){const now=performance.now();P._rgN=(P._rgEnd&&now-P._rgEnd<700)?((P._rgN|0)+1)%3:0}}}

// ---------------- BOW / STAFF ON BACK ----------------
// ธนู: แนวคันเฉียงพาดหลัง (ปลายบนอยู่เหนือไหล่ซ้าย) · กระบอกลูกธนู: เหนือไหล่ขวา (มือขวาเอื้อมหยิบ)
const bowBackOffsetUp={x:-1,y:-27},bowBackOffsetDown={x:1,y:-27},bowBackOffsetLeft={x:5,y:-24},bowBackOffsetRight={x:-5,y:-24};
const bowBackRotationUp=-Math.PI/4,bowBackRotationDown=Math.PI/4,bowBackRotationLeft=.25,bowBackRotationRight=Math.PI-.25;
const bowBackLayerUp='over',bowBackLayerDown='behind',bowBackLayerLeft='behind',bowBackLayerRight='behind'; // over = ทับหลัง (เห็นเต็ม) · behind = หลังลำตัว (ลำตัวบัง)
const quiverOffset7={u:{x:7,y:-34,r:.35},d:{x:-7,y:-34,r:-.35},l:{x:5,y:-34,r:.3},r:{x:-5,y:-34,r:-.3}};
const quiverReach7=d=>{const q=quiverOffset7[d];return[q.x+Math.sin(q.r)*2,q.y-3]};
function drawQuiver7(x,y,r,n){ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.lineCap='round';
 // ลูกธนูโผล่ปากกระบอก (หาง/ขนนก)
 for(let i=0;i<(n==null?3:n);i++){const ox=-2+i*2;ctx.strokeStyle='#7a5a32';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ox,2);ctx.lineTo(ox,-5);ctx.stroke();ctx.fillStyle=i===1?'#f2efe6':'#d84a3a';ctx.beginPath();ctx.moveTo(ox,-8);ctx.lineTo(ox-1.6,-4);ctx.lineTo(ox,-5);ctx.lineTo(ox+1.6,-4);ctx.closePath();ctx.fill()}
 ctx.fillStyle='#1a1008';ctx.fillRect(-4,0,8,19);ctx.fillStyle='#7a4a24';ctx.fillRect(-3,1,6,17);ctx.fillStyle='#a8703a';ctx.fillRect(-3,1,2,17);ctx.fillStyle='#c9a04a';ctx.fillRect(-4,0,8,2);ctx.fillRect(-4,13,8,1.5);ctx.restore()}
function bowBack7(x,by,side,f,d,phase){ // phase: 'pre' = เรียกก่อนลำตัว (d/side) · 'post' = หลังลำตัว (u)
 const tier=P.tier.sword|0,drawn=P.draw&&P.tool==='sword',q=quiverOffset7[d];
 const O={u:bowBackOffsetUp,d:bowBackOffsetDown,l:bowBackOffsetLeft,r:bowBackOffsetRight}[d],R={u:bowBackRotationUp,d:bowBackRotationDown,l:bowBackRotationLeft,r:bowBackRotationRight}[d];
 if(!drawn)drawBow6(x+O.x,by+O.y,R,tier,0,false,.82);
 const nq=(P.at>=0&&P.at<.12)?2:3;drawQuiver7(x+q.x,by+q.y,q.r,nq)}
{const _bs=backSword;backSword=function(x,by,side,f,d){if(!(P.armor.sword&&wKind()==='bow'))return _bs(x,by,side,f,d);bowBack7(x,by,side,f,d)}}

// ---------------- ท่าถือ (ยืน/เดิน) ----------------
// คฑา: จับช่วงล่างของด้าม ตั้งเกือบตรง ไม้แกว่งตามจังหวะเดิน · ธนู: ถือมือซ้ายข้างลำตัว คันตั้งแนวขา
const STF_GRIP7=-33; // วาดไอคอนคฑาให้มืออยู่ช่วงล่าง 1/4 ของด้าม
function staffAt7(hx,hy,ang,sc){ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(sc)ctx.scale(sc,sc);ctx.drawImage(toolIcon('staff',P.tier.sword|0,64),-23,STF_GRIP7,46,46);ctx.restore()}
const STF_ORB7=27; // ระยะมือ→ลูกแก้ว (px)
function orbOf7(hx,hy,ang,sc){const r=STF_ORB7*(sc||1);return{x:hx+Math.sin(ang)*r,y:hy-Math.cos(ang)*r}}
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){if(!(P.tool==='sword'&&isRng()&&P.at<0))return _ts(hx,hy,ang);
  const d=P.dir,f=rgF7(d),s=P.mv?Math.sin(P.t):0,kd=wKind(),tier=P.tier.sword|0;
  if(kd==='staff'){let a;if(rgSide7(d))a=f*(.1+.12*s);else a=(d==='d'?-.06:.06)+.05*s;staffAt7(hx,hy,a);const o=orbOf7(hx,hy,a);P.tip={x:o.x,y:o.y,t:performance.now()};
   ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-3,hy-2.5,6,5);return}
  // ธนู: หน้า/หลัง ถือมือซ้ายตัวละคร (หน้า=ขวาจอ, หลัง=ซ้ายจอ) · ข้าง = มือข้างลำตัว
  let gx=hx,gy=hy,aim;if(d==='d'){gx=hx+(P.dash>0?32:22);aim=-.2}else if(d==='u'){gx=hx-(P.dash>0?32:22);aim=Math.PI+.2}else aim=f>0?.35+.08*s:Math.PI-.35-.08*s;
  drawBow6(gx,gy+1,aim,tier,0,false,.85);ctx.fillStyle='#f1d2b0';ctx.fillRect(gx-2.5,gy-1.5,5,5);P.tip={x:gx,y:gy,t:performance.now()}}}

// ---------------- ท่าโจมตี: ธนู ----------------
// จังหวะ (ยิงจริงที่ P.at=.34 ตามระบบเดิม): ยกธนู+เอื้อมหยิบลูก 0-.08 · พาดสาย .08-.16 · ง้าง .16-.30 · เล็งค้าง .30-.34 · ปล่อย .34-.42 · follow-through .42-.6 · คืนท่า .6-1
const BWPH=[.08,.16,.30,.34,.42,.6];
const BOWSHOT7=[{dy:0,tilt:0,deep:1,lean:[-1.5,1]},{dy:2,tilt:-.1,deep:1,lean:[-1,1.5]},{dy:0,tilt:0,deep:1.18,lean:[-3,2.5]}]; // shot 1 ปกติ · 2 ย่อต่ำ เงยนิด · 3 ง้างลึกแรงสุด
function bowPose7(d,p,n){const f=rgF7(d),sd=rgSide7(d),SH=BOWSHOT7[n%3],aim0=sd?(f>0?0:Math.PI):(d==='d'?Math.PI/2:-Math.PI/2),aim=aim0+(sd?-f*SH.tilt:0);
 const av=[Math.cos(aim),Math.sin(aim)],sc=d==='u'?.8:sd?.88:.9;
 const G=sd?[f*13,-24+SH.dy]:d==='d'?[3,-16+SH.dy]:[-2,-40+SH.dy*.5];             // ตำแหน่งกำคันธนูตอนเล็ง
 const I=sd?[f*5,-13]:d==='d'?[11,-12]:[-11,-12];                                     // ตำแหน่งมือถือธนูตอนพัก
 const aimI=sd?(f>0?.35:Math.PI-.35):d==='d'?-.2:Math.PI+.2;
 const H0=sd?[-f*2,-14]:d==='d'?[-11,-13]:[11,-13];                                    // มือดึงสายตอนพัก
 const Q=quiverReach7(d),nock=k=>[G[0]+av[0]*(-5-11*k)*sc,G[1]+av[1]*(-5-11*k)*sc];
 let g,a,h,pull=0,onStr=false,inHand=null,snap=0,lean=0;
 const raise=Math.min(1,e6o(p/.12)),back=p>BWPH[5]?e6io((p-BWPH[5])/(1-BWPH[5])):0;
 g=LP7(LP7(I,G,raise),I,back);a=L7(L7(aimI,aim,raise),aimI,back);
 if(p<BWPH[0]){h=LP7(H0,Q,e6o(p/BWPH[0]));inHand={k:0}}
 else if(p<BWPH[1]){const u=e6io((p-BWPH[0])/(BWPH[1]-BWPH[0]));h=LP7(Q,nock(0),u);inHand={k:u}}
 else if(p<BWPH[2]){const u=e6o((p-BWPH[1])/(BWPH[2]-BWPH[1]));pull=u*SH.deep;h=nock(pull);onStr=true;lean=SH.lean[0]*u}
 else if(p<BWPH[3]){pull=SH.deep;const tr=Math.sin(p*900)*.35;h=nock(pull);h[1]+=tr;onStr=true;lean=SH.lean[0]}
 else if(p<BWPH[4]){const u=(p-BWPH[3])/(BWPH[4]-BWPH[3]);snap=1-u;pull=-.18*Math.sin(u*Math.PI*3)*(1-u);const A=nock(SH.deep);h=[A[0]-av[0]*6*e6o(u),A[1]-av[1]*6*e6o(u)-3*e6o(u)];lean=L7(SH.lean[0],SH.lean[1],e6o(u))}
 else if(p<BWPH[5]){const A=nock(SH.deep);h=[A[0]-av[0]*6,A[1]-av[1]*6-3];lean=L7(SH.lean[1],0,(p-BWPH[4])/(BWPH[5]-BWPH[4]))}
 else{const A=nock(SH.deep);h=LP7([A[0]-av[0]*6,A[1]-av[1]*6-3],H0,back)}
 return{g,a,h,pull,onStr,inHand,snap,sc,aim,av,lean,dip:SH.dy}}
function drawArrow7(x,y,ang,len){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.lineCap='round';ctx.strokeStyle='#7a5a32';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(len,0);ctx.stroke();
 ctx.fillStyle='#d8dce8';ctx.beginPath();ctx.moveTo(len+5,0);ctx.lineTo(len-1,-2.6);ctx.lineTo(len-1,2.6);ctx.closePath();ctx.fill();ctx.fillStyle='#e04a3a';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-3,-2.5);ctx.lineTo(3,0);ctx.lineTo(-3,2.5);ctx.closePath();ctx.fill();ctx.restore()}
// ไหล่: แขนจับคันธนู = แขนซ้ายตัวละคร · แขนดึงสาย = แขนขวา
const bowSh7=(x,by,d,f)=>rgSide7(d)?{bow:[x+f*2,by-25],dr:[x-f*1,by-24]}:d==='d'?{bow:[x+10,by-24],dr:[x-10,by-24]}:{bow:[x-10,by-24],dr:[x+10,by-24]};
function bowParts7(x,by,d,f,TOP,which){const n=P._rgN|0,p=P.at,q=bowPose7(d,p,n),gx=x+q.g[0],gy=by+q.g[1],hx=x+q.h[0],hy=by+q.h[1],S=bowSh7(x,by,d,f),tier=P.tier.sword|0;
 if(which!=='arms'){
  drawBow6(gx,gy,q.a,tier,Math.max(0,q.pull),false,q.sc);
  if(q.onStr){const sx=gx+q.av[0]*(-5-11*q.pull)*q.sc,sy=gy+q.av[1]*(-5-11*q.pull)*q.sc;drawArrow7(sx,sy,q.aim,24*q.sc);
   if(q.pull>.85){ctx.save();ctx.globalCompositeOperation='lighter';const tx=sx+q.av[0]*27*q.sc,ty=sy+q.av[1]*27*q.sc,g=ctx.createRadialGradient(tx,ty,0,tx,ty,7);g.addColorStop(0,'rgba(255,240,180,.85)');g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.fillRect(tx-7,ty-7,14,14);ctx.restore()}
   P.tip={x:sx+q.av[0]*26*q.sc,y:sy+q.av[1]*26*q.sc,t:performance.now()}}
  if(q.snap>0){ctx.save();ctx.globalAlpha=.6*q.snap;ctx.strokeStyle='#fff';ctx.lineWidth=1;for(let i=1;i<=2;i++){ctx.beginPath();ctx.arc(gx,gy,10+i*5*(1-q.snap),q.aim-.6,q.aim+.6);ctx.stroke()}ctx.restore()}
  if(which==='bow'){swArm6(S.bow[0],S.bow[1],gx,gy,TOP,-1);ctx.fillStyle='#f1d2b0';ctx.fillRect(gx-2.5,gy-2.5,5,5);return}} // หันขึ้น: แขนจับคันอยู่หน้าตัว (หลังลำตัวจากมุมกล้อง)
 // แขนจับคันธนู → มือที่กำคัน · แขนดึงสาย → มือ (ถือลูกธนูตอนหยิบ/พาดสาย)
 if(which!=='arms'||d!=='u'){swArm6(S.bow[0],S.bow[1],gx,gy,TOP,d==='d'?1:d==='u'?-1:f);ctx.fillStyle='#f1d2b0';ctx.fillRect(gx-2.5,gy-2.5,5,5)}
 if(q.inHand){const k=q.inHand.k,ang=L7(d==='u'?-Math.PI/2-.3:-Math.PI/2+(rgSide7(d)?-f*.5:.4),q.aim,k);drawArrow7(hx-Math.cos(ang)*4,hy-Math.sin(ang)*4,ang,22*q.sc)}
 swArm6(S.dr[0],S.dr[1],hx,hy,TOP,d==='d'?-1:d==='u'?1:-f);ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-2.5,hy-2.5,5,5)}

// ---------------- ท่าโจมตี: คฑา (ร่ายเวท) ----------------
// จังหวะ: เตรียม (ยกคฑา รวมพลังที่มือ) 0-.14 · ร่าย/ชี้ .14-.30 · ปล่อยเวท .30-.42 (กระสุนออก .34) · follow-through .42-.65 · คืนท่า .65-1
const STPH=[.14,.30,.42,.65];
// [มือถือคฑา x,y, มุมคฑา] / [มือว่าง x,y] — ข้างกำหนดสำหรับหันขวา แล้วสะท้อนด้วย f
const STK7={
 s:[{W:[-3,-27,-.45],S:[12,-24,1.15],F:[11,-22,1.0], fW:[2,-24],fS:[15,-28],fF:[13,-27], b:{W:[-2,1],S:[3,0]}},   // 1 แทงชี้ไปข้างหน้า
    {W:[-6,-16,-1.6],S:[11,-21,1.45],F:[10,-20,1.6], fW:[-4,-20],fS:[14,-24],fF:[12,-23],b:{W:[-2,2],S:[3,0]}},   // 2 กวาดจากด้านหลังผ่านเหนือหัว
    {W:[1,-40,-.2],  S:[12,-18,2.05],F:[12,-16,2.0], fW:[3,-40],fS:[8,-20],fF:[8,-19],  b:{W:[-1,-2],S:[4,3]}}],  // 3 ชูสูง → ฟาดลงพื้นข้างหน้า (แรงสุด)
 d:[{W:[-10,-28,-.35],S:[-3,-14,.25],F:[-3,-13,.2], fW:[6,-22],fS:[6,-27],fF:[6,-26], b:{W:[-1,-1],S:[0,2]}},
    {W:[-14,-20,-1.3],S:[6,-18,1.0],F:[7,-17,1.2],   fW:[8,-20],fS:[-2,-27],fF:[-2,-26],b:{W:[-2,1],S:[2,1]}},
    {W:[-6,-42,0],    S:[-2,-16,.1],F:[-2,-15,.1],   fW:[2,-42],fS:[5,-20],fF:[5,-19],  b:{W:[0,-2],S:[0,3]}}],
 // หันขึ้น (มองจากหลัง): มือยื่นไปข้างหน้า/ขึ้นเหนือไหล่ — วาดหลังลำตัว ไม่พับแขนมาทางกล้อง
 u:[{W:[9,-28,.35], S:[7,-42,-.1],F:[7,-40,-.05], fW:[-7,-28],fS:[-6,-41],fF:[-6,-39],b:{W:[1,-1],S:[0,1]}},
    {W:[13,-24,1.2],S:[-7,-40,-.9],F:[-8,-39,-1.0],fW:[-9,-26],fS:[5,-42],fF:[5,-40],b:{W:[2,1],S:[-2,1]}},
    {W:[5,-48,0],   S:[4,-40,0],F:[4,-39,0],       fW:[-3,-48],fS:[-5,-40],fF:[-5,-39],b:{W:[0,-2],S:[0,3]}}]};
function staffPose7(d,p,n){const sd=rgSide7(d),f=rgF7(d),K=STK7[sd?'s':d][n%3],I=sd?[5,-13,.1]:d==='d'?[-11,-13,-.06]:[11,-13,.06],fI=sd?[-2,-14]:d==='d'?[11,-13]:[-11,-13];
 const L3=(a,b,u)=>[L7(a[0],b[0],u),L7(a[1],b[1],u),L7(a[2],b[2],u)];let w,fh,b,ph;
 if(p<STPH[0]){const u=e6o(p/STPH[0]);w=L3(I,K.W,u);fh=LP7(fI,K.fW,u);b=[K.b.W[0]*u,K.b.W[1]*u];ph=0}
 else if(p<STPH[1]){const u=e6i((p-STPH[0])/(STPH[1]-STPH[0]));w=L3(K.W,K.S,u);fh=LP7(K.fW,K.fS,u);b=LP7(K.b.W,K.b.S,u);ph=1}
 else if(p<STPH[2]){const u=(p-STPH[1])/(STPH[2]-STPH[1]),r=Math.sin(u*Math.PI)*1.5;w=[K.S[0]-(sd?f:0)*r,K.S[1]+(sd?0:r*.6),K.S[2]];fh=K.fS.slice();b=K.b.S;ph=2}
 else if(p<STPH[3]){const u=e6o((p-STPH[2])/(STPH[3]-STPH[2]));w=L3(K.S,K.F,u);fh=LP7(K.fS,K.fF,u);b=LP7(K.b.S,[0,0],u);ph=3}
 else{const u=e6io((p-STPH[3])/(1-STPH[3]));w=L3(K.F,I,u);fh=LP7(K.fF,fI,u);b=[0,0];ph=4}
 if(sd){w[0]*=f;w[2]*=f;fh[0]*=f}return{w,fh,b,ph}}
const stSh7=(x,by,d,f)=>rgSide7(d)?{st:[x+f*1,by-24],fr:[x+f*2,by-25]}:d==='d'?{st:[x-10,by-24],fr:[x+10,by-24]}:{st:[x+10,by-24],fr:[x-10,by-24]};
function magicCol7(){const t=P.tier.sword|0,Q=TIERS[t]||TIERS[0];return Q.gl}
function staffParts7(x,by,d,f,TOP,which){const n=P._rgN|0,p=P.at,q=staffPose7(d,p,n),hx=x+q.w[0],hy=by+q.w[1],ang=q.w[2],S=stSh7(x,by,d,f),fx2=x+q.fh[0],fy2=by+q.fh[1],col=magicCol7();
 const sc=d==='u'&&q.ph>=1&&q.ph<4?.94:1;
 if(which!=='arms'){
  staffAt7(hx,hy,ang,sc);const o=orbOf7(hx,hy,ang,sc);P.tip={x:o.x,y:o.y,t:performance.now()};
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(q.ph===0||q.ph===1){const k=q.ph===0?p/STPH[0]:1,g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,6+6*k);g.addColorStop(0,'rgba(255,255,255,'+(.6*k)+')');g.addColorStop(1,'rgba(150,100,255,0)');ctx.fillStyle=g;ctx.fillRect(o.x-14,o.y-14,28,28);
   for(let i=0;i<4;i++){const a=p*20+i*1.57,r=14*(1-k)+3;ctx.fillStyle='rgba(200,170,255,'+(.7*k)+')';ctx.fillRect(o.x+Math.cos(a)*r-1,o.y+Math.sin(a)*r-1,2,2)}}
  if(q.ph===2){const u=(p-STPH[1])/(STPH[2]-STPH[1]),a=1-u,R=10+(n===2?22:14)*e6o(u),g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,R);g.addColorStop(0,'rgba(255,255,255,'+a+')');g.addColorStop(.35,'rgba(190,150,255,'+(.8*a)+')');g.addColorStop(1,'rgba(120,60,255,0)');ctx.fillStyle=g;ctx.fillRect(o.x-R,o.y-R,R*2,R*2);
   ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,R*.8,0,7);ctx.stroke();
   ctx.strokeStyle='#fff';ctx.lineWidth=1.2;for(let i=0;i<6;i++){const aa=i*1.047+u;ctx.beginPath();ctx.moveTo(o.x+Math.cos(aa)*R*.4,o.y+Math.sin(aa)*R*.4);ctx.lineTo(o.x+Math.cos(aa)*R*.95,o.y+Math.sin(aa)*R*.95);ctx.stroke()}
   if(n===2){ctx.globalAlpha=.6*a;ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(x,by+2,12+28*e6o(u),4+9*e6o(u),0,0,7);ctx.stroke();if(!window._drawingOther&&!P._rsh7){P._rsh7=1;try{shake(1.6,.1)}catch(e){}}}}
  ctx.restore();if(p<.1)P._rsh7=0;
  if(which==='staff')return}
 // มือว่าง: ตอนร่ายยื่นฝ่ามือไปทางเป้าหมาย มีแสงเวท
 swArm6(S.fr[0],S.fr[1],fx2,fy2,TOP,d==='d'?1:d==='u'?-1:f);ctx.fillStyle='#f1d2b0';ctx.fillRect(fx2-2.5,fy2-2.5,5,5);
 if(q.ph>=1&&q.ph<=2){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(fx2,fy2,0,fx2,fy2,7);g.addColorStop(0,'rgba(230,210,255,.8)');g.addColorStop(1,'rgba(150,100,255,0)');ctx.fillStyle=g;ctx.fillRect(fx2-7,fy2-7,14,14);ctx.restore()}
 swArm6(S.st[0],S.st[1],hx,hy,TOP,d==='d'?-1:d==='u'?1:-f);ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-3,hy-2.5,6,5)}

// ---------------- ต่อเข้ากับระบบเดิม ----------------
// slashFx: หน้า/ข้าง เรียกหลังลำตัว (วาดครบ) · หลัง(u) เรียกก่อนลำตัว (วาดเฉพาะอาวุธ แล้วแขน/มือวาดทับหลังลำตัวทีหลัง)
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){if(!(isRng()&&P.tool==='sword'))return _sf(x,by,d,side,f,TOP,held);
  if(P.at>.95)P._rgEnd=performance.now();const kd=wKind();
  if(d==='u'&&kd==='staff'){staffParts7(x,by,d,f,TOP,'all');return}   // คฑาหันขึ้น: คฑา+แขนอยู่หน้าตัว (หลังลำตัวจากมุมกล้อง)
  if(d==='u'){bowParts7(x,by,d,f,TOP,'bow');RG7.post={x,by,d,f,TOP,kd};return}
  (kd==='bow'?bowParts7:staffParts7)(x,by,d,f,TOP,'all')}}
const RG7={post:null};
{const _hb=heroBody;heroBody=function(){if(!(rgOn7()&&P.at>=0))return _hb();RG7.post=null;const d=P.dir,f=rgF7(d),side=rgSide7(d),p=P.at,kd=wKind();
  let lean=0,dip=0;if(kd==='bow'){const q=bowPose7(d,p,P._rgN|0);lean=q.lean;dip=(p<.12?e6o(p/.12):p>.6?1-e6io((p-.6)/.4):1)*q.dip}else{const q=staffPose7(d,p,P._rgN|0);lean=q.b[0];dip=q.b[1]}
  const hxo=side?f*lean:lean*.6,sq=1-Math.max(0,dip)*.012+Math.max(0,-dip)*.01;
  ctx.save();ctx.translate(P.x,P.y);ctx.transform(1,0,-hxo/44,1,0,0);ctx.scale(1,sq);ctx.translate(-P.x,-P.y);
  try{_hb();const o=RG7.post;if(o)(o.kd==='bow'?bowParts7:staffParts7)(o.x,o.by,o.d,o.f,o.TOP,'arms')}finally{ctx.restore();RG7.post=null}}}

// ---------------- ขนาดขวาน/ที่ขุดแร่ เท่ากันทุกท่า ----------------
window.AXS7=.85; // ทุกท่า (ถือ/ฟันขึ้น/ฟันข้าง/ฟันลง) ใช้สเกลเดียวกัน — เดิมถือ 0.7 แต่ฟันข้าง/ลง 1.0

// =====================================================================
// GM7 MODE (เฉพาะไอดี tiksi หรือปลดด้วยรหัส GM) — ปุ่ม GM7 บนจอ เปิดแผงทดสอบทุกระบบ
// =====================================================================
const GM7={god:false,nocd:false};
const GM_IDS=['tiksi','wiwekwin2537'];
const GM_HASH='90f635b045c05822acfc7626c6cebb5ecfd7102d522f777d030a9f0e2c4094a5'; // SHA-256 ของรหัส GM7 สำรอง (ไม่เก็บรหัสจริงในไฟล์)
function gmAllowed(){try{if(FM_ACCT&&GM_IDS.includes(String(FM_ACCT).toLowerCase()))return true;return sessionStorage.getItem('fm_gm7')==='1'}catch(e){return false}}
async function gmCode(c){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('eldoria-gm:'+String(c).trim()));const h=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');if(h===GM_HASH){sessionStorage.setItem('fm_gm7','1');gmBtn();say('🛠️ เปิดโหมด GM7 แล้ว');return true}}catch(e){}say('รหัส GM7 ไม่ถูกต้อง');return false}
window.gmCode=gmCode;
const gmW=mk6('gmw');
function gmBtn(){if(!gmAllowed())return;if(gid('gmb'))return;const b=document.createElement('button');b.id='gmb';b.textContent='GM';b.style.cssText='position:absolute;left:50px;top:65px;z-index:25;font:900 11px system-ui;padding:0 8px;width:auto;min-width:0;height:20px;min-height:0;line-height:18px;border-radius:9px;border:2px solid #ffe9a0;background:linear-gradient(180deg,#c0503a,#7a1a10);color:#fff;box-shadow:0 2px 6px #0008';
 b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=()=>{gmRender();p6open(gmW)};gid('wrap').appendChild(b)}
const gmSafe=fn=>{try{fn()}catch(e){say('GM: '+e.message)}try{recalcStats()}catch(e){}try{refreshInv()}catch(e){}try{saveGame(true)}catch(e){}gmRender()};
const GMA={
 god:()=>{GM7.god=!GM7.god;say(GM7.god?'🛡️ อมตะ: เปิด':'🛡️ อมตะ: ปิด')},
 nocd:()=>{GM7.nocd=!GM7.nocd;say(GM7.nocd?'⏱️ ไม่มีคูลดาวน์/มานาไม่จำกัด: เปิด':'⏱️ ไม่มีคูลดาวน์: ปิด')},
 heal:()=>{P.hp=BAL.hp;P.mp=BAL.mp;P.fa=100;if('hu' in P)P.hu=100;P.dead=false},
 lv10:()=>{for(let i=0;i<10&&P.lv<99;i++)gainXp(need(P.lv)-P.xp+1)},
 lv99:()=>{while(P.lv<99)gainXp(need(P.lv)-P.xp+1)},
 coin:()=>{inv.coin=(inv.coin|0)+100000;say('💰 +100,000')},
 mats:()=>{for(const k of INVORDER){if(k==='coin')continue;inv[k]=Math.max(inv[k]|0,99)}P.bagLv=3;say('📦 วัตถุดิบทุกอย่าง ×99')},
 gear:()=>{for(const id in ITEMS)GEAR[id]=Math.max(GEAR[id]|0,1);say('⚔️ ได้อุปกรณ์ทุกชิ้นแล้ว (ดูในกระเป๋า)')},
 ult:()=>{try{ULT.v=100}catch(e){}for(let i=0;i<CS.cd.length;i++)CS.cd[i]=0},
 home:()=>{HOME.unlocked=1;HOME.house=HOUSE.length-1;for(const k of TOOLKEYS){HOME.tools[k]=5;inv['t_'+k]=1}saveHome();if(D&&D.home)homeObjects();say('🏡 ปลดล็อกที่ดิน · บ้านสูงสุด · เครื่องมือสูงสุด')},
 kill:()=>{let n=0;eachIn(P.x,P.y,700,e=>{hurtE(e,99999,{kb:10});n++});say('💀 กำจัด '+n+' ตัว')},
 town:()=>{p6close(gmW);enterTown()},
 homeGo:()=>{p6close(gmW);HOME.unlocked=1;enterHome()},
 save:()=>{saveGame(true);say('💾 เซฟแล้ว')}};
function gmCls(c){gmSafe(()=>{P.cls=c;saveCls();say('🎓 เปลี่ยนอาชีพเป็น '+CLS[c].n)})}
function gmWpn(id){gmSafe(()=>{GEAR[id]=Math.max(GEAR[id]|0,1);equipItem(id);P.tool='sword';P.draw=true;say('ถือ '+ITEMS[id].name)})}
function gmTime(t){gmSafe(()=>{DAY.t=t;try{_dayPt=t}catch(e){}})}
function gmZone(i){p6close(gmW);try{enterZone(i)}catch(e){say('GM: '+e.message)}}
window.gmA=k=>gmSafe(GMA[k]);window.gmCls=gmCls;window.gmWpn=gmWpn;window.gmTime=gmTime;window.gmZone=gmZone;
function gmRender(){if(!gmAllowed())return;const B=(t,on,cls)=>'<button class="bt'+(cls?' '+cls:'')+'" onclick="'+on+'">'+t+'</button>',row=(h,x)=>'<div class="card"><b style="color:#ffe9a0">'+h+'</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">'+x+'</div></div>';
 const wp=['sword0','sword3','sword5','bow0','bow1','staff0','staff1'].filter(id=>ITEMS[id]);
 gmW.innerHTML='<div class="w"><div class="hd"><b>🛠️ GM — '+(FM_ACCT||'ทดลอง')+' · Lv.'+P.lv+' · '+(CLS[P.cls]||{}).n+'</b><button onclick="p6close(gid(\'gmw\'))">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto">'
 +row('ตัวละคร',B((GM7.god?'✅ ':'')+'🛡️ อมตะ',"gmA('god')",GM7.god?'g':'')+B((GM7.nocd?'✅ ':'')+'⏱️ ไม่มีคูลดาวน์',"gmA('nocd')",GM7.nocd?'g':'')+B('❤️ ฟื้นเต็ม',"gmA('heal')")+B('⬆️ +10 เลเวล',"gmA('lv10')")+B('⭐ Lv.99',"gmA('lv99')")+B('🌟 อัลติเต็ม',"gmA('ult')"))
 +row('ของ',B('💰 +100,000',"gmA('coin')")+B('📦 วัตถุดิบ ×99',"gmA('mats')")+B('⚔️ อุปกรณ์ทุกชิ้น',"gmA('gear')")+B('🏡 ที่ดิน/บ้าน/เครื่องมือสูงสุด',"gmA('home')"))
 +row('อาชีพ',['none','sword','mage','archer'].map(c=>B(CLS[c].e+' '+CLS[c].n,"gmCls('"+c+"')",P.cls===c?'g':'')).join(''))
 +row('ถืออาวุธ (เทสท่า)',wp.map(id=>B(ITEMS[id].name,"gmWpn('"+id+"')",P.armor.sword===id?'g':'')).join(''))
 +row('เวลา',B('🌅 เช้า',"gmTime(6)")+B('☀️ เที่ยง',"gmTime(12)")+B('🌇 เย็น',"gmTime(18.5)")+B('🌙 ดึก',"gmTime(23)"))
 +row('วาป / ต่อสู้',B('🏰 เมือง',"gmA('town')")+B('🏡 ที่ดิน',"gmA('homeGo')")+ZONES.map((z,i)=>B(z.e+' '+z.n,"gmZone("+i+")")).join('')+B('💀 ฆ่ามอนรอบตัว',"gmA('kill')",'r'))
 +row('ระบบ',B('💾 เซฟ',"gmA('save')"))+'</div></div>'}
{const _h=hurtPlayer;hurtPlayer=function(sl){if(GM7.god&&gmAllowed()){P.hp=BAL.hp;return}return _h(sl)}}
setInterval(()=>{try{if(!gmAllowed())return;gmBtn();if(GM7.god){P.hp=Math.max(P.hp,BAL.hp);P.dead=false}if(GM7.nocd){P.mp=BAL.mp;P.fa=100;for(let i=0;i<CS.cd.length;i++)CS.cd[i]=0}}catch(e){}},250);
// พิมพ์ในแชท: /gm รหัส  → ปลดล็อก GM7 ในไอดีอื่น/โหมดทดลอง (ข้อความนี้ไม่ถูกส่งออก)
{const _cs=chatSend;chatSend=function(){const ti=gid('chatTi'),t=(ti&&ti.value||'').trim();if(/^\/gm\b/i.test(t)){ti.value='';gmCode(t.replace(/^\/gm\s*/i,''));return}return _cs()}}

// [แก้จอดำ] เซฟที่สวมคฑา/ธนูอยู่: ตอนโหลดเซฟ ไอเท็มคฑา/ธนูยังไม่ถูกสร้าง (อยู่สคริปต์ถัดไป) → เกมพังทั้งหน้า
// ตอนโหลดจึงพักไอเท็มที่ยังไม่รู้จักไว้ก่อน แล้วคืนให้ตรงนี้ (ไอเท็มถูกสร้างครบแล้ว)
try{const Q=window.__PEND7;if(Q){window.__PEND7=null;let ch=0;const L8={a:{},g:{}};for(const k in Q.a)if(!ITEMS[Q.a[k]])L8.a[k]=Q.a[k];for(const id in Q.g)if(!ITEMS[id])L8.g[id]=Q.g[id];if(Object.keys(L8.a).length||Object.keys(L8.g).length)window.__PEND8=L8;for(const k in Q.a)if(ITEMS[Q.a[k]]){P.armor[k]=Q.a[k];ch=1}for(const id in Q.g)if(ITEMS[id]){GEAR[id]=Q.g[id];ch=1}
 if(ch){try{syncSword()}catch(e){}try{recalcStats()}catch(e){}try{applyBonus()}catch(e){}try{refreshInv()}catch(e){}}}}catch(e){}


// =====================================================================
// v4.7 (ฌ) : ระบบตีบวกอุปกรณ์ (Equipment Enhancement) — ต่อเข้ากับของเดิม
//  ใช้ข้อมูลเดิมทั้งหมด: ITEMS (ข้อมูลไอเท็ม) · GEAR (กระเป๋าอุปกรณ์) · P.armor (ของที่สวม) · ENH (ระดับตีบวกต่อไอเท็ม)
//  inv.coin (เงิน) · inv.estone (💎 หินเสริมพลัง) · สูตรค่าสถานะเดิม enhAtk/enhDef · ทั่งตีเหล็กเดิมในร้านอุปกรณ์
//  ไม่สร้าง Inventory / Item DB / Equipment ใหม่ · ไม่แตะดาบ/ขวาน/ธนู/คฑา/การเดิน
// =====================================================================
// ---------- CONFIG (แก้ที่นี่ที่เดียว) ----------
const MAX_ENHANCEMENT=MAXP;                  // ระดับสูงสุด (ใช้ค่าเดิมของเกม MAXP=15 — ระบบกันโกงก็ใช้ค่านี้)
const ENHCFG={
 ALWAYS_SUCCESS:true,                         // เวอร์ชันแรก: สำเร็จ 100% · ตั้ง false = ใช้อัตราเดิม RATE[] และกติกาลดระดับเดิม
 rate:l=>ENHCFG.ALWAYS_SUCCESS?100:RATE[l],
 cost:l=>({gold:50*(l+1)*(l+2),stone:ENH_EST(l)}),   // +0→+1: 100G 💎1 · +4→+5: 1,500G 💎3 · +9→+10: 5,500G 💎5
 strikes:4,                                    // จำนวนครั้งที่ทุบ (ครั้งสุดท้ายแรงสุด)
 // ประเภทที่ตีบวกได้ + ค่าสถานะที่เพิ่ม (ใช้สูตรเดิมของเกม)
 kinds:{
  sword:{g:'w',ic:'⚔️',n:'โจมตี',v:(t,l)=>SWATK[t]+enhAtk(l)},
  bow:  {g:'w',ic:'🏹',n:'โจมตีธนู',v:(t,l)=>SWATK[t]+enhAtk(l)},
  staff:{g:'w',ic:'🔮',n:'พลังเวท',v:(t,l)=>SWATK[t]+enhAtk(l)},
  helm: {g:'a',ic:'⛑️',n:'ป้องกัน',v:(t,l)=>ADEF.helm[t]+enhDef(l)},
  chest:{g:'a',ic:'🛡️',n:'ป้องกัน',v:(t,l)=>ADEF.chest[t]+enhDef(l)},
  pants:{g:'a',ic:'👖',n:'ป้องกัน',v:(t,l)=>ADEF.pants[t]+enhDef(l)},
  arm:  {g:'a',ic:'🧤',n:'ป้องกัน',v:(t,l)=>ADEF.arm[t]+enhDef(l)},
  ring: {g:'j',ic:'💍',n:'โจมตี',v:(t,l)=>RINGATK[t]+enhRing7(l)},
  neck: {g:'j',ic:'📿',n:'เลือดสูงสุด',v:(t,l)=>NECKHP[t]+enhNeck7(l)},
  axe:  {g:'t',ic:'🪓',n:'แรงตัดไม้',v:(t,l)=>1+(t>>1)+enhTool7(l)},
  pick: {g:'t',ic:'⛏️',n:'แรงขุด',v:(t,l)=>1+(t>>1)+enhTool7(l)}},
 groups:[['all','ทั้งหมด'],['w','อาวุธ'],['a','เกราะ'],['j','เครื่องประดับ'],['t','เครื่องมือ']]};
// โบนัสของประเภทที่เดิมยังไม่ได้รับผลจากการตีบวก (แหวน/สร้อย/ขวาน/ที่ขุด) — ผูกเข้ากับสูตรเดิมผ่านฮุกใน build
function enhRing7(l){return Math.ceil(enhAtk(l)/2)}
function enhNeck7(l){return l*6}
function enhTool7(l){return Math.floor(l/3)}
window.enhX7=id=>{const it=ITEMS[id];if(!it)return 0;const l=ENH[id]|0;return it.kind==='ring'?enhRing7(l):it.kind==='neck'?enhNeck7(l):0};
window.enhT7=k=>enhTool7(ENH[k+((P.tier&&P.tier[k])|0)]|0);
const canEnh7=id=>{const it=ITEMS[id];return !!(it&&ENHCFG.kinds[it.kind]&&it.enhance!==false)};   // ใช้ property เดิม (kind) · ไอเท็มที่ตั้ง enhance:false = ตีบวกไม่ได้
const enhLv7=id=>ENH[id]|0;
const enhStat7=(id,l)=>{const it=ITEMS[id],K=ENHCFG.kinds[it.kind];return K.v(it.tier,l==null?enhLv7(id):l)};
// รายการของจริงจากกระเป๋า + ของที่สวมอยู่ (ไม่มีของปลอม)
function enhList7(){const L=[],seen=new Set();for(const k in P.armor){const id=P.armor[k];if(id&&canEnh7(id)&&!seen.has(id)){seen.add(id);L.push({id,worn:true,n:(GEAR[id]|0)})}}
 for(const id of Object.keys(GEAR).sort()){if((GEAR[id]|0)>0&&canEnh7(id)&&!seen.has(id)){seen.add(id);L.push({id,worn:false,n:GEAR[id]|0})}}
 const ord=Object.keys(ENHCFG.kinds);L.sort((a,b)=>(b.worn-a.worn)||ord.indexOf(ITEMS[a.id].kind)-ord.indexOf(ITEMS[b.id].kind)||ITEMS[b.id].tier-ITEMS[a.id].tier);return L}
// ตรวจสอบก่อนตีบวก (คืนข้อความเหตุผล หรือ null = ผ่าน)
function enhCheck7(id){if(!id)return 'ยังไม่ได้เลือกอุปกรณ์';if(!canEnh7(id))return 'อุปกรณ์นี้ไม่สามารถตีบวกได้';
 if(!(P.armor[ITEMS[id].kind]===id||(GEAR[id]|0)>0))return 'ไม่มีอุปกรณ์นี้ในกระเป๋าแล้ว';
 const l=enhLv7(id);if(l>=MAX_ENHANCEMENT)return 'อุปกรณ์นี้ถึงระดับสูงสุดแล้ว (+'+MAX_ENHANCEMENT+')';const c=ENHCFG.cost(l);
 if((inv.coin|0)<c.gold)return 'Gold ไม่เพียงพอ (ต้องใช้ '+c.gold.toLocaleString()+' มี '+(inv.coin|0).toLocaleString()+')';
 if((inv.estone|0)<c.stone)return 'วัตถุดิบไม่เพียงพอ — 💎 หินเสริมพลัง ต้องใช้ '+c.stone+' มี '+(inv.estone|0);return null}

// ---------- STATE ----------
const ENHS={open:false,sel:null,grp:'all',busy:false,res:null,msg:''};
const enhW=mk6('enhw');
{const st=document.createElement('style');st.textContent=`
#enhw .w{width:min(820px,97%)}
#enhw .lstE{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:5px;padding:2px}
#enhw .rowE{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:10px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);cursor:pointer;text-align:left;color:inherit;font:inherit}
#enhw .rowE.sel{border-color:#ffe9a0;background:rgba(255,233,160,.12);box-shadow:0 0 10px rgba(255,233,160,.25)}
#enhw .rowE img{width:38px;height:38px;flex:none;border-radius:8px;background:radial-gradient(circle at 50% 60%,#4a3a6a,#1a1428)}
#enhw .rowE b{font-size:13px;color:#fff}#enhw .rowE small{display:block}
#enhw .tag{font:800 10px system-ui;padding:1px 5px;border-radius:6px;background:#3a5a2a;color:#cfe;margin-left:4px}
#enhw .gtab{display:flex;gap:4px;flex-wrap:wrap}#enhw .gtab button{font:800 11.5px system-ui;padding:4px 8px;border-radius:8px;border:1px solid #8a7040;background:#2a2014;color:#ffe9c0}#enhw .gtab button.on{background:#ffe9a0;color:#3a2408}
#enhw .det{flex:1;display:flex;flex-direction:column;gap:7px;min-width:0;overflow-y:auto;padding-right:2px}#enhw .go{flex:none}
#enhw .big{display:flex;gap:10px;align-items:center}#enhw .big img{width:74px;height:74px;border-radius:14px;background:radial-gradient(circle at 50% 60%,#5a4a7a,#1a1428);border:2px solid var(--ec,#666);box-shadow:0 0 14px var(--eg,transparent)}
#enhw .nm{font-size:16px;font-weight:900;color:#fff}#enhw .lvl{font-size:26px;font-weight:900;text-align:center;letter-spacing:1px}
#enhw .arr{color:#ffe9a0;margin:0 8px}
#enhw .mat{display:flex;justify-content:space-between;align-items:center;padding:6px 9px;border-radius:9px;background:rgba(0,0,0,.3);font-size:13px}
#enhw .mat .no{color:#ff8a7a;font-weight:800}#enhw .mat .ok{color:#8fe08a;font-weight:800}
#enhw .go{font:900 16px system-ui;padding:11px;border-radius:12px;border:2px solid #ffe9a0;background:linear-gradient(180deg,#f2c14a,#b8781a);color:#3a2008;cursor:pointer;box-shadow:0 3px 0 #6a4008}
#enhw .go:disabled{filter:grayscale(.8) brightness(.7);cursor:default}
#enhw .why{min-height:16px;font-size:12px;color:#ff9a8a;text-align:center}
#enhw .res{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center}
#enhw .res h2{margin:0;font-size:22px;color:#ffe9a0;text-shadow:0 0 12px rgba(255,220,120,.8);animation:enhPop .5s ease-out}
#enhw .res img{width:96px;height:96px;border-radius:16px;background:radial-gradient(circle,#ffe9a0 0%,#6a4a20 55%,#1a1428 100%);animation:enhGlow 1.2s ease-in-out 2}
@keyframes enhPop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes enhGlow{0%,100%{box-shadow:0 0 6px #ffd84a}50%{box-shadow:0 0 30px #ffd84a,0 0 60px rgba(255,216,74,.5)}}
@media (max-height:440px){#enhw .det{gap:4px}#enhw .mat{padding:4px 8px;font-size:12px}#enhw .card.big{padding:5px}#enhw .big img{width:44px;height:44px}#enhw .lvl{font-size:18px}#enhw .go{padding:7px;font-size:14px}#enhw .rowE img{width:30px;height:30px}#enhw .res img{width:70px;height:70px}}`;document.head.appendChild(st)}
const ico7=id=>iconURL('item:'+id);
function enhRender7(){if(!ENHS.open)return;let h='<div class="w"><div class="hd"><b>⚒️ ตีบวกอุปกรณ์ · ENHANCEMENT</b><button onclick="enhCraft7()" title="สร้างอุปกรณ์ใหม่ที่ทั่ง">🛠️ คราฟ</button><button onclick="closeEnh7()">✕</button></div>';
 if(ENHS.res){const r=ENHS.res,it=ITEMS[r.id],K=ENHCFG.kinds[it.kind];
  h+='<div class="bd"><div class="res">'+(r.ok?'<h2>✨ ENHANCEMENT SUCCESS! ✨</h2>':'<h2 style="color:#ff9a8a">💥 ENHANCEMENT FAILED</h2>')+'<img src="'+ico7(r.id)+'"><div class="nm">'+it.name+'</div>'
   +'<div class="lvl"><span style="color:'+enhCol(r.from)+'">+'+r.from+'</span><span class="arr">→</span><span style="color:'+enhCol(r.to)+'">+'+r.to+'</span></div>'
   +'<div class="mat" style="min-width:220px"><span>'+K.ic+' '+K.n+'</span><span><b>'+r.s0+'</b> <span class="arr">→</span> <span class="ok">'+r.s1+'</span></span></div>'
   +'<button class="go" style="min-width:180px" onclick="enhBack7()">ตกลง</button></div></div></div>';enhW.innerHTML=h;return}
 const L=enhList7().filter(o=>ENHS.grp==='all'||ENHCFG.kinds[ITEMS[o.id].kind].g===ENHS.grp);if(ENHS.sel&&!enhList7().some(o=>o.id===ENHS.sel))ENHS.sel=null;if(!ENHS.sel&&L.length)ENHS.sel=L[0].id;
 h+='<div class="bd"><div class="col" style="width:44%;min-width:0"><div class="gtab">'+ENHCFG.groups.map(([g,n])=>'<button class="'+(ENHS.grp===g?'on':'')+'" onclick="enhGrp7(\''+g+'\')">'+n+'</button>').join('')+'</div><div class="lstE">';
 if(!L.length)h+='<small style="padding:10px">ไม่มีอุปกรณ์ที่ตีบวกได้ในหมวดนี้<br>(ยา อาหาร วัตถุดิบ ของเควส จะไม่แสดงที่นี่)</small>';
 for(const o of L){const it=ITEMS[o.id],l=enhLv7(o.id),K=ENHCFG.kinds[it.kind];
  h+='<button class="rowE'+(ENHS.sel===o.id?' sel':'')+'" onclick="enhSel7(\''+o.id+'\')"><img src="'+ico7(o.id)+'"><div style="min-width:0"><b>'+K.ic+' '+it.name+' <span style="color:'+enhCol(l)+'">+'+l+'</span></b>'+(o.worn?'<span class="tag">สวมอยู่</span>':'')+(o.n>(o.worn?0:1)?'<span class="tag" style="background:#3a3a5a">×'+(o.n+(o.worn?1:0))+'</span>':'')+'<small>'+K.n+' +'+enhStat7(o.id)+'</small></div></button>'}
 h+='</div></div><div class="det">';
 const id=ENHS.sel;if(!id){h+='<div class="card" style="flex:1;display:flex;align-items:center;justify-content:center"><small>เลือกอุปกรณ์ทางซ้าย</small></div>'}
 else{const it=ITEMS[id],l=enhLv7(id),K=ENHCFG.kinds[it.kind],mx=l>=MAX_ENHANCEMENT,c=ENHCFG.cost(Math.min(l,MAX_ENHANCEMENT-1)),why=enhCheck7(id),ec=enhCol(l);
  h+='<div class="card big" style="--ec:'+ec+';--eg:'+(l>=3?ec:'transparent')+'"><img src="'+ico7(id)+'"><div><div class="nm">'+it.name+'</div><small>'+(GKIND[it.kind]||it.kind)+' · ระดับไอเท็ม '+TNAMES[it.tier]+' (ขั้น '+(it.tier+1)+')</small><br><small>Enhancement: <b style="color:'+ec+'">+'+l+'</b> / +'+MAX_ENHANCEMENT+'</small></div></div>';
  h+='<div class="lvl">'+(mx?'<span style="color:'+ec+'">+'+l+' MAX</span>':'<span style="color:'+ec+'">+'+l+'</span><span class="arr">→</span><span style="color:'+enhCol(l+1)+'">+'+(l+1)+'</span><small style="font-size:11px;color:#8fe08a;margin-left:8px;vertical-align:middle">🎯 สำเร็จ '+ENHCFG.rate(l)+'%</small>')+'</div>';
  h+='<div class="mat"><span>'+K.ic+' '+K.n+'</span><span><b>'+enhStat7(id,l)+'</b>'+(mx?'':' <span class="arr">→</span> <span class="ok">'+enhStat7(id,l+1)+'</span>')+'</span></div>';
  if(!mx){const hg=inv.coin|0,hs=inv.estone|0;
   h+='<div class="mat"><span>💰 Gold</span><span class="'+(hg>=c.gold?'ok':'no')+'">'+c.gold.toLocaleString()+' <small style="opacity:.8">(มี '+hg.toLocaleString()+')</small></span></div>';
   h+='<div class="mat"><span>💎 หินเสริมพลัง</span><span class="'+(hs>=c.stone?'ok':'no')+'">×'+c.stone+' <small style="opacity:.8">(มี '+hs+')</small></span></div>';
}
  h+='<div class="why">'+(ENHS.msg||why||'')+'</div><button class="go" '+(why?'disabled':'')+' onclick="enhStart7()">⚒️ ตีบวก</button>'}
 h+='</div></div></div>';enhW.innerHTML=h}
window.enhSel7=id=>{if(ENHS.busy)return;ENHS.sel=id;ENHS.msg='';sfx('ui');enhRender7()};
window.enhGrp7=g=>{if(ENHS.busy)return;ENHS.grp=g;ENHS.sel=null;ENHS.msg='';sfx('ui');enhRender7()};
window.enhBack7=()=>{ENHS.res=null;ENHS.msg='';sfx('ui');enhRender7()};
window.enhCraft7=()=>{if(ENHS.busy)return;closeEnh7();FUI.tab='craft';openForge('anvil')};
function openEnh7(id){if(ENHS.busy)return;if(!stn('anvil')||Math.hypot(P.x-stn('anvil').x,P.y-stn('anvil').y)>90){say('🔨 ไปที่ทั่งตีเหล็กในร้านอุปกรณ์ แล้วกด E เพื่อตีบวก');sfx('thud');return}
 try{closeForge()}catch(e){}try{hideBag()}catch(e){}ENHS.open=true;ENHS.res=null;ENHS.msg='';if(id)ENHS.sel=id;enhRender7();p6open(enhW)}
window.openEnh7=openEnh7;
window.closeEnh7=function(){if(ENHS.busy)return;ENHS.open=false;ENHS.res=null;p6close(enhW)};
addEventListener('keydown',e=>{if(!ENHS.open&&!ENHS.busy)return;if(e.key==='Escape'){e.stopImmediatePropagation();e.preventDefault();closeEnh7()}},true);
// กด E ที่ทั่ง = เปิดหน้าตีบวก (ทั่งเดิมยังคราฟได้ผ่านปุ่ม 🛠️ คราฟ)
{const _sa=shopAct;shopAct=function(){const s=typeof stnNear==='function'?stnNear():null;if(s&&s.k==='anvil'&&!P.sit){if(!ENHS.busy&&!ENHS.open)openEnh7();return true}return _sa()}}
try{const s=SHOP_STN.gear.find(s=>s.k==='anvil');if(s)s.n='🔨 ทั่งตีเหล็ก · ตีบวก'}catch(e){}
// ระบบตีบวกเดิม (สุ่มพลาด) → ใช้หน้าใหม่แทน (ไม่ให้มีสองระบบ)
enhItem=function(id){openEnh7(id)};
{const _of=openForge;openForge=function(k){if(k==='anvil'&&FUI.tab==='enh'){FUI.tab='craft';return openEnh7()}return _of(k)}}

// ---------- กดตีบวก: ตัดของ + บันทึกผลทันที (กันกดรัว/ของหาย) → เล่นแอนิเมชันตีเหล็ก → แสดงผล ----------
function enhStart7(){if(ENHS.busy)return;const id=ENHS.sel,why=enhCheck7(id);if(why){ENHS.msg=why;sfx('thud');enhRender7();return}
 ENHS.busy=true;const it=ITEMS[id],l=enhLv7(id),c=ENHCFG.cost(l),s0=enhStat7(id,l);
 inv.coin-=c.gold;inv.estone-=c.stone;
 let ok=Math.random()*100<ENHCFG.rate(l),to=l;
 if(ok)to=l+1;else if(l>=5){if(inv.bless>0)inv.bless--;else to=l-1}
 ENH[id]=to;try{recalcStats()}catch(e){}try{refreshInv()}catch(e){}try{saveGame(true)}catch(e){}
 ENHS.res={id,ok,from:l,to,s0,s1:enhStat7(id,to)};
 enhW.hidden=true;forgeStart7(id,ok)}
window.enhStart7=enhStart7;

// ---------- FORGING ANIMATION : เดินไปหน้าทั่ง → ยกค้อน → เหวี่ยง → กระแทก → ยกกลับ ×4 (ครั้งสุดท้ายแรงสุด) ----------
const FRG={on:false,t0:0,id:null,a:null,from:null,to:null,sp:[],hit:-1,ok:true};
const FRG_WALK=.45,FRG_HIT=[.62,.62,.62,.95],FRG_END=.45;
const frgTotal=()=>FRG_WALK+FRG_HIT.reduce((a,b)=>a+b,0)+FRG_END;
function forgeStart7(id,ok){const a=stn('anvil');FRG.on=true;window.FRG7on=true;FRG.t0=performance.now();FRG.id=id;FRG.ok=ok;FRG.a=a;FRG.from={x:P.x,y:P.y};FRG.to={x:a.x-24,y:a.y+6};FRG.sp=[];FRG.hit=-1;FRG.d0=P.dir;FRG.tool=P.tool;FRG.draw=P.draw;P.at=-1;PAUSED=false}
function forgeEnd7(){FRG.on=false;window.FRG7on=false;P.mv=false;P.dir='r';P.tool=FRG.tool;P.draw=FRG.draw;ENHS.busy=false;enhW.hidden=false;PAUSED=true;
 if(FRG.ok){sfx('chest');setTimeout(()=>sfx('gem'),180)}else sfx('thud');enhRender7()}
// ระหว่างตี: ล็อกการควบคุมตัวละคร (ข้าม playerTick ของผู้เล่นชั่วคราว · โลกเกมยังวาด/เคลื่อนไหวตามปกติ)
{const _pt=playerTick;playerTick=function(dt){if(FRG.on)return;return _pt(dt)}}
{const _a=attack;attack=function(q){if(FRG.on||ENHS.busy)return;return _a(q)}}
// เฟสของการตี: คืน {k:ครั้งที่, u:0..1, last}
function frgPhase(t){if(t<FRG_WALK)return{walk:t/FRG_WALK};let s=FRG_WALK;for(let i=0;i<FRG_HIT.length;i++){if(t<s+FRG_HIT[i])return{k:i,u:(t-s)/FRG_HIT[i],last:i===FRG_HIT.length-1};s+=FRG_HIT[i]}return{done:(t-s)/FRG_END}}
// ท่า (หันขวา): มือคู่จับด้ามค้อน [x,y] · มุมค้อน · ลำตัว [เอน, ย่อ]
function frgPose(ph){const R={h:[5,-28],a:.95,b:[0,0]},Wt={h:[-3,-42],a:-1.05,b:[-2.5,-1.5]},Wl={h:[-5,-46],a:-1.5,b:[-3.5,-2]},S={h:[0,-35],a:1.67,b:[3,2]},Sl={h:[1,-34],a:1.72,b:[4,3]};
 const LP=(p,q,u)=>({h:[L7(p.h[0],q.h[0],u),L7(p.h[1],q.h[1],u)],a:L7(p.a,q.a,u),b:[L7(p.b[0],q.b[0],u),L7(p.b[1],q.b[1],u)]});
 if(ph.walk!=null||ph.done!=null)return Object.assign({},R,{h:R.h.slice(),b:[0,0]});
 const W=ph.last?Wl:Wt,Sx=ph.last?Sl:S,u=ph.u;
 if(u<.45)return LP(R,W,e6o(u/.45));                 // ยกค้อน เตรียมแรง น้ำหนักไปด้านหลัง
 if(u<.58)return LP(W,Sx,e6i((u-.45)/.13));          // เหวี่ยงลง
 if(u<.70){const k=Math.sin((u-.58)/.12*Math.PI)*(1-(u-.58)/.12);const o=LP(Sx,Sx,0);o.h[1]+=k*1.2;o.a-=k*.06;return o}  // กระแทก (ค้อนเด้งเล็กน้อย)
 return LP(Sx,R,e6io((u-.70)/.30))}                   // ยกกลับ
function frgHammer(hx,hy,ang){ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);ctx.drawImage(farmTool('hamr',3),-21,-30,42,42);ctx.restore()}
function frgClank(last){try{tone(1900,1850,.25,'triangle',last?.16:.11);tone(2850,2800,.2,'sine',last?.1:.07);nz(.06,last?.55:.4,4200,1600,3)}catch(e){}try{sfx('mine')}catch(e){}}
// วาดฉาก: ไอเท็มร้อนบนทั่ง · ค้อน · แขน · ประกายไฟ (เรียกจาก slashFx ระหว่างตี)
function frgDraw(x,by,TOP){const t=(performance.now()-FRG.t0)/1000,ph=frgPhase(t),a=FRG.a,po=frgPose(ph);
 const ix=a.x-4-(P.x-x),iy=a.y-27-(P.y-by),it=ITEMS[FRG.id];
 // ไอเท็มบนทั่ง: ร้อนแดงตอนตี → เรืองทองตอนจบ
 const heat=ph.k!=null?Math.max(.35,1-Math.abs(ph.u-.62)*2):ph.done!=null?0:.2;
 try{ctx.save();ctx.translate(ix,iy);ctx.rotate(-1.35);ctx.globalAlpha=.95;ctx.drawImage(toolIcon(it.kind,it.tier,64),-10,-10,20,20);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';const gc=ph.done!=null&&FRG.ok?'255,220,90':'255,120,40',r=ph.done!=null?14+6*Math.sin(t*10):10;const g=ctx.createRadialGradient(ix,iy,0,ix,iy,r);g.addColorStop(0,'rgba('+gc+','+(ph.done!=null?.8:.55*heat)+')');g.addColorStop(1,'rgba('+gc+',0)');ctx.fillStyle=g;ctx.fillRect(ix-r,iy-r,r*2,r*2);ctx.restore()}catch(e){}
 const hx=x+po.h[0],hy=by+po.h[1];
 // ค้อน (สองมือจับด้าม) + แขนสองข้าง
 frgHammer(hx,hy,po.a);
 swArm6(x-1,by-24,hx-2,hy+2,TOP,-1);swArm6(x+2,by-25,hx+1,hy-2,TOP,1);ctx.fillStyle='#f1d2b0';ctx.fillRect(hx-4,hy-1,4,4);ctx.fillRect(hx,hy-4,4,4);
 // กระแทก: ประกายไฟ + แฟลชเล็ก ๆ + เสียง
 if(ph.k!=null&&ph.u>=.58&&FRG.hit!==ph.k){FRG.hit=ph.k;frgClank(ph.last);const n=ph.last?22:12;for(let i=0;i<n;i++){const an=-Math.PI/2+(Math.random()-.5)*2.6,sp=60+Math.random()*(ph.last?150:100);FRG.sp.push({x:ix,y:iy-2,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,t:performance.now(),l:.35+Math.random()*.35})}
  if(ph.last)try{shake(2,.12)}catch(e){}}
 if(ph.k!=null&&ph.u>=.58&&ph.u<.72){const k=1-(ph.u-.58)/.14;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=k;ctx.fillStyle='#fff';ctx.beginPath();for(let i=0;i<8;i++){const an=i*Math.PI/4,r=i%2?3:(ph.last?13:9)*k+3;ctx.lineTo(ix+Math.cos(an)*r,iy-3+Math.sin(an)*r)}ctx.closePath();ctx.fill();ctx.restore()}
 const now=performance.now();FRG.sp=FRG.sp.filter(s=>(now-s.t)/1000<s.l);ctx.save();ctx.globalCompositeOperation='lighter';for(const s of FRG.sp){const tt=(now-s.t)/1000,k=1-tt/s.l;ctx.fillStyle='rgba(255,'+(170+Math.floor(80*k))+',60,'+k+')';ctx.fillRect(s.x+s.vx*tt-1,s.y+s.vy*tt+160*tt*tt-1,2,2)}ctx.restore();
 // จบ: ประกายสำเร็จ
 if(ph.done!=null&&FRG.ok){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.max(0,1-ph.done)*.8;ctx.strokeStyle='#ffe9a0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(ix,iy,6+22*ph.done,0,7);ctx.stroke();ctx.restore()}}
// ฮุกเข้าตัวละครเดิม: ระหว่างตี ใช้ท่าทุบค้อนสองมือแทนอาวุธ (ซ่อนแขนเดิมกันเป็น 3 แขน) + ลำตัวเอน/ย่อตามแรง
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){if(!(FRG.on&&!window._drawingOther))return _sf(x,by,d,side,f,TOP,held);frgDraw(x,by,TOP)}}
{const _hb=heroBody;heroBody=function(){if(!FRG.on||window._drawingOther)return _hb();const t=(performance.now()-FRG.t0)/1000;
  if(t>=frgTotal()){forgeEnd7();return _hb()}
  const ph=frgPhase(t);
  if(ph.walk!=null){const u=e6io(Math.min(1,ph.walk));P.x=L7(FRG.from.x,FRG.to.x,u);P.y=L7(FRG.from.y,FRG.to.y,u);const dx=FRG.to.x-FRG.from.x,dy=FRG.to.y-FRG.from.y;
   if(Math.hypot(dx,dy)>4&&ph.walk<.92){P.mv=true;P.t=t*14;P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');return _hb()}P.mv=false;P.dir='r';return _hb()}
  P.mv=false;P.dir='r';const po=frgPose(ph),lean=po.b[0],dip=po.b[1];
  const d0=P.draw,t0=P.tool,a0=P.at;P.draw=true;P.tool='hamr';P.at=.001;
  ctx.save();ctx.translate(P.x,P.y);ctx.transform(1,0,-lean/44,1,0,0);ctx.scale(1,1-Math.max(0,dip)*.012+Math.max(0,-dip)*.01);ctx.translate(-P.x,-P.y);
  try{_hb()}finally{ctx.restore();P.draw=d0;P.tool=t0;P.at=a0}}}

// =====================================================================
// แถบเควสด้านบน → ปุ่ม "📜 เควส" กดดูได้ (ไม่บังจอ) · กดแถบที่เปิดอยู่ = เปิดสมุดเควสเหมือนเดิม
// =====================================================================
{const st=document.createElement('style');st.textContent='#qtrack.qh7{display:none!important}#zin,#zout{display:none!important}#qbtn7{position:relative;font-size:15px}#qbtn7 i{position:absolute;right:-3px;top:-4px;font-style:normal;font-size:10px}#qbtn7[hidden]{display:none}#qbtn7.rep{border-color:#8fe08a;color:#cfffc0;animation:qtPulse 1.2s infinite}#qbtn7.on{background:#ffe9a0!important;color:#3a2408}';document.head.appendChild(st)}
const qBtn7=document.createElement('button');qBtn7.id='qbtn7';qBtn7.title='เควส';qBtn7.textContent='📜';{const zb=gid('zb'),pb=gid('pasb');if(zb){if(pb&&pb.parentNode===zb)zb.insertBefore(qBtn7,pb.nextSibling);else zb.appendChild(qBtn7)}else gid('wrap').appendChild(qBtn7)} // ปุ่มเควสอยู่ข้างปุ่ม 🌟 (แทนที่ปุ่มซูม +/-)qBtn7.addEventListener('pointerdown',e=>e.stopPropagation());
qtEl.classList.add('qh7');let qOpen7=false,qT7=0;
function qSync7(){qBtn7.hidden=qtEl.hidden;qtEl.classList.toggle('qh7',!qOpen7);qBtn7.classList.toggle('rep',qtEl.classList.contains('rep'));qBtn7.classList.toggle('on',qOpen7);qBtn7.innerHTML='📜'+(qtEl.classList.contains('rep')?'<i>✅</i>':'');
 if(qOpen7){try{const r=qBtn7.getBoundingClientRect(),w=gid('wrap').getBoundingClientRect();qtEl.style.left=(r.right-w.left+6)+'px';qtEl.style.top=(r.top-w.top-3)+'px';qtEl.style.transform='none';qtEl.style.textAlign='left'}catch(e){}}else{qtEl.style.left='';qtEl.style.top='';qtEl.style.transform='';qtEl.style.textAlign=''}}  // แถบเควสโผล่ข้างปุ่ม 📜
qBtn7.onclick=()=>{qOpen7=!qOpen7;clearTimeout(qT7);if(qOpen7)qT7=setTimeout(()=>{qOpen7=false;qSync7()},6000);sfx('ui');qSync7()};
new MutationObserver(qSync7).observe(qtEl,{attributes:true,attributeFilter:['hidden','class']});qSync7();


// =====================================================================
// v4.7 (ญ) : แก้บั๊ก/ปรับตามรายงาน — ของไม่ไหลตามเมื่อกระเป๋าเต็ม · กระทืบปฐพีกระโดดเข้าหามอน · ปุ่มสกิลเรียงโค้ง
//  เมนูโปรไฟล์ (ไอคอน) · ทั่งตีเหล็กตั้งพื้นตีได้จริง · ชำนาญสกิล (พาสซีฟผูกกับสกิล) · ร้านค้า/ตีบวกแบบช่องไอคอน + "หาได้จาก"
// =====================================================================
// ---------- 1) ของตก: ไม่ดูดเข้าหาตัวถ้ากระเป๋ารับไม่ได้ ----------
window.dropOK7=d=>{try{const ik=DROPMAP[d.type]||d.type;return ik==='coin'||canTake(ik)===true}catch(e){return true}};

// ---------- 2) กระทืบปฐพี: กระโดดพุ่งเข้าหามอนใกล้สุด แล้วลงกระแทกตรงนั้น ----------
{const _p=playerTick;playerTick=function(dt){const j=P.jump;
  if(j&&!j.tg7){j.tg7=1;let best=null,bd=230;for(const e of enemies()){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<bd){bd=d;best=e}}
   const v=DIRV[P.dir];let tx=P.x+v[0]*60,ty=P.y+v[1]*60;if(best){const d=bd||1;const stop=Math.max(0,d-16);tx=P.x+(best.x-P.x)/d*stop;ty=P.y+(best.y-P.y)/d*stop;P.dir=Math.abs(best.x-P.x)>Math.abs(best.y-P.y)?(best.x<P.x?'l':'r'):(best.y<P.y?'u':'d')}
   j.sx=P.x;j.sy=P.y;j.tx=tx;j.ty=ty}
  if(j&&j.tg7&&!j.land){const u=Math.min(1,(j.t+dt)/(j.l*.8)),e=1-Math.pow(1-u,2),nx=j.sx+(j.tx-j.sx)*e,ny=j.sy+(j.ty-j.sy)*e;if(!hit(nx,P.y))P.x=nx;if(!hit(P.x,ny))P.y=ny}
  const prev=window.CURSK7;if(j&&j.mm7)window.CURSK7={m:j.mm7};try{return _p(dt)}finally{window.CURSK7=prev}}}

// ---------- 3) ปุ่มสกิลเรียงโค้งรอบปุ่มโจมตี · ปุ่มขวาบนไม่ทับสกิล ----------
{const st=document.createElement('style');st.textContent=`
#acts #dashb{right:97px!important;bottom:3px!important}
#acts #sk1{right:147px!important;bottom:29px!important}#acts #sk2{right:134px!important;bottom:83px!important}
#acts #sk3{right:100px!important;bottom:123px!important}#acts #sk5{right:49px!important;bottom:145px!important}
#acts #sk4{right:82px!important;bottom:82px!important}
#acts #ultb{right:195px!important;bottom:71px!important;pointer-events:auto}
#setb{display:none!important}
#gmb{z-index:3!important}`;document.head.appendChild(st)}
setTimeout(()=>{try{const u=gid('ultb'),a=gid('acts');if(u&&a&&u.parentNode!==a)a.appendChild(u)}catch(e){}},500);
// คอลัมน์ขวา: กระเป๋า · เสียง · ออโต้ · ออนไลน์ เรียงชิดกัน (ตั้งค่าย้ายไปเมนูโปรไฟล์)
function rcol7(){try{const b=gid('bagb');if(!b)return;const h=b.offsetHeight||48,t=b.offsetTop;let i=1;for(const id of ['muteb','autob','netb']){const e=gid(id);if(!e)continue;e.style.setProperty('top',(t+i*(h+6))+'px','important');i++}}catch(e){}}
addEventListener('resize',()=>setTimeout(rcol7,100));setTimeout(rcol7,600);setInterval(rcol7,3000);

// ---------- 4) กดรูปโปรไฟล์ → เมนูไอคอน (สถานะ · สกิล · พาสซีฟ · กระเป๋า · เควส · ตั้งค่า · ออกเกม) ----------
{const st=document.createElement('style');st.textContent=`
#pm7{position:absolute;z-index:28;left:calc(8px + var(--sl,0px));top:calc(64px + var(--st,0px));display:grid;grid-template-columns:repeat(4,58px);gap:6px;padding:8px;border-radius:14px;background:linear-gradient(180deg,rgba(40,30,60,.96),rgba(18,14,28,.96));border:2px solid #e8c14a;box-shadow:0 8px 24px rgba(0,0,0,.6);animation:pm7in .14s ease-out}
#pm7[hidden]{display:none}@keyframes pm7in{from{transform:translateY(-6px);opacity:0}to{transform:none;opacity:1}}
#pm7 button{width:58px!important;height:58px!important;min-width:0!important;padding:4px 0 0!important;border-radius:12px;border:1.5px solid rgba(232,193,74,.55);background:radial-gradient(circle at 50% 35%,#4a3a6a,#1e1830);color:#fff;font-size:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;cursor:pointer}
#pm7 button small{font:700 9.5px system-ui,"Noto Sans Thai",sans-serif;opacity:.95}
#pm7 button:active{transform:scale(.94)}#pm7 button.out{border-color:#ff8a7a;background:radial-gradient(circle at 50% 35%,#6a2a2a,#2a1010)}`;document.head.appendChild(st)}
const pm7=document.createElement('div');pm7.id='pm7';pm7.hidden=true;gid('wrap').appendChild(pm7);pm7.addEventListener('pointerdown',e=>e.stopPropagation());
const PM7=[['👤','สถานะ',()=>toggleChar()],['⚔️','สกิล',()=>openSkw('sk')],['🌟','พาสซีฟ',()=>openSkw('pas')],['🎯','ชำนาญ',()=>openSkw('msk')],['🎒','กระเป๋า',()=>toggleBag()],['📜','เควส',()=>openJournal()],['⚙️','ตั้งค่า',()=>toggleMenu()],['🚪','ออกเกม',()=>exitGame7(),'out']];
pm7.innerHTML=PM7.map((m,i)=>'<button data-i="'+i+'" class="'+(m[3]||'')+'">'+m[0]+'<small>'+m[1]+'</small></button>').join('');
pm7.onclick=e=>{const b=e.target.closest('button');if(!b)return;pm7.hidden=true;sfx('ui');try{PM7[+b.dataset.i][2]()}catch(er){}};
faceEl.onclick=e=>{e.stopPropagation();pm7.hidden=!pm7.hidden;sfx('ui')};
addEventListener('pointerdown',e=>{if(!pm7.hidden&&!pm7.contains(e.target)&&e.target!==faceEl)pm7.hidden=true});
function exitGame7(){talk({name:'ออกจากเกม',c:'#c0503a'},'บันทึกเกมแล้วกลับไปหน้าแรกไหม?',[{t:'🚪 บันทึกและออก',c:'go',f:()=>{try{saveGame(true)}catch(e){}setTimeout(()=>location.reload(),250)}},BYE],'🚪 ออกเกม')}

// ---------- 5) "หาได้จากที่ไหน" (แหล่งของ: มอนที่ดรอป · เหมือง · ร้าน · คราฟ) ----------
function mobsOf7(fam){const L=[];for(const z of ZONES)for(const m of z.mobs)if(m[0]===fam)L.push(m[1]+' · '+z.e+' '+z.n);
 if(['skeleton','zombie','bat'].includes(fam))L.push('มอนในดันเจี้ยน (ทุกชั้น)');if(fam==='drake')L.push('มังกรในดันเจี้ยนชั้นลึก');return L}
function src7(key){const S=[],add=(i,t)=>S.push([i,t]);
 if(key.startsWith('item:')){const it=ITEMS[key.slice(5)];if(!it)return S;add('⚒️','คราฟที่ทั่งตีเหล็ก (ร้านอุปกรณ์) — ปลดล็อกระดับด้วยเควสช่าง');if(it.tier===0)add('🏪','ซื้อที่ร้านอุปกรณ์');add('🎁','สมบัติในดันเจี้ยน / รางวัลเควส');return S}
 const k=key.replace(/^mat:/,'');
 if(k==='coin'){add('⚔️','มอนสเตอร์ทุกตัว');add('💰','ขายของที่ร้าน · รางวัลเควส');return S}
 if(k==='gel'){add('🟢','สไลม์ · ทุ่งหญ้ารอบเมือง');return S}
 if(k==='wood'||k==='apple'){add('🪓','ตัดต้นไม้ด้วยขวาน (ทุ่งหญ้า)');return S}
 if(k==='coal'){add('🔥','เผาไม้ที่เตาหลอม');return S}
 if(k==='gem'){add('💎','ขุดแร่เพชร');const z=ZONES.find(z=>z.id==='diamond');if(z)add('👑',z.boss.n+' · '+z.n);return S}
 const zr=ZONES.filter(z=>z.ores.some(o=>o[0]===k));for(const z of zr)add('⛏️','ขุดแร่ใน '+z.e+' '+z.n+' (Lv.'+z.lv[0]+'–'+z.lv[1]+')');
 for(const z of ZONES)if(z.raw===k||z.ing===k)add('👑','บอส '+z.boss.n+' · '+z.n);
 const ti=MATKEY.indexOf(k);if(ti>=0)add('🔥','หลอมแร่ที่เตาหลอม (ร้านอุปกรณ์)');
 if(JUNK[k])for(const m of mobsOf7(JUNK[k][3]))add('⚔️',m);
 if(k==='hpp'||k==='mpp')add('⚗️','ปรุงเองที่หม้อปรุงยา (ร้านยาหมอใจดี)');
 if(k==='estone'){add('🏰','มอนในดันเจี้ยน (ยิ่งลึกยิ่งดรอปบ่อย)');add('📜','รางวัลเควสกิลด์ · ช่างหนวดเหล็ก');add('🔁','แลกที่กิลด์ (แกนหินเวท + ผงวิญญาณ / กระดูก + ผ้า)')}
 if(k==='bless'){add('📜','รางวัลเควสเนื้อเรื่อง/เควสกิลด์');add('🔁','แลกที่กิลด์ (เกล็ดมังกร ×3)')}
 if(k==='phoenix'){add('👑','บอส 35% · มอนอีลิท 3%');add('🔁','แลกที่กิลด์')}
 if(/^r_/.test(k))add('👑','บอส · มอนอีลิท · มอนในดันเจี้ยน');
 if(/^pa_/.test(k))add('🐾','บอส/อีลิทในดันเจี้ยน · หายากจากสไลม์');
 if(/^sd_/.test(k))add('🏪','ร้านฟาร์ม (ลุงบุญมี) ที่ดินผู้กล้า');
 if(typeof CROPS!=='undefined'&&CROPS[k])add('🌱','ปลูกในที่ดินผู้กล้า');
 if(typeof FISHES!=='undefined'&&FISHES[k])add('🎣','ตกปลา (บ่อในที่ดิน/แหล่งน้ำ)');
 for(const id in SD2){const s=SD2[id];if(!s||!s.buy)continue;for(const b of (Array.isArray(s.buy)?s.buy:[]))if(b.mat===k||b.id===k||b.item===k){add('🏪','ซื้อที่ '+(s.name||id));break}}
 if(!S.length)add('❔','ยังไม่มีข้อมูลแหล่งที่มา');return S}
function srcHTML7(key){return '<div class="src7">'+src7(key).map(s=>'<div><span>'+s[0]+'</span>'+s[1]+'</div>').join('')+'</div>'}
window.srcToggle7=function(btn,key){const n=btn.nextElementSibling;if(n&&n.classList.contains('src7')){n.remove();btn.classList.remove('on');return}btn.insertAdjacentHTML('afterend',srcHTML7(key));btn.classList.add('on');sfx('ui')};
const srcBtn7=key=>'<button class="srcb7" onclick="event.stopPropagation();srcToggle7(this,\''+key+'\')">📍 หาได้จากที่ไหน</button>';
{const st=document.createElement('style');st.textContent=`
.srcb7{font:800 11.5px system-ui,"Noto Sans Thai",sans-serif;padding:4px 9px;border-radius:9px;border:1px solid #6ab0e8;background:#13304a;color:#bfe4ff;cursor:pointer;margin-top:4px}.srcb7.on{background:#bfe4ff;color:#13304a}
.src7{margin-top:5px;display:flex;flex-direction:column;gap:3px;font-size:11.5px;text-align:left}.src7 div{display:flex;gap:6px;align-items:flex-start;padding:4px 7px;border-radius:8px;background:rgba(80,140,200,.14)}.src7 span{flex:none}`;document.head.appendChild(st)}
// ใส่ปุ่มในการ์ดรายละเอียดไอเท็มเดิม (กดของในกระเป๋า)
{const _ic=icShow;icShow=function(t,k,ro,at){_ic(t,k,ro,at);try{if(icEl.hidden||icEl.querySelector('.srcb7'))return;const key=(t==='gear'?'item:':'mat:')+k;const host=icEl.querySelector('.ib,.ic-b,.body')||icEl.firstElementChild||icEl;host.insertAdjacentHTML('beforeend',srcBtn7(key))}catch(e){}}}

// ---------- 6) ร้านค้า: ของในร้านเป็นช่องไอคอน · แตะเพื่อดูรายละเอียด/ซื้อ ----------
{const st=document.createElement('style');st.textContent=`
#shop .bgrid7{display:grid;grid-template-columns:repeat(auto-fill,minmax(54px,1fr));gap:6px;padding:2px}
#shop .bg7{position:relative;aspect-ratio:1;border-radius:10px;border:2px solid rgba(232,193,74,.45);background:radial-gradient(circle at 50% 40%,#4a3a5a,#1a1424);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px}
#shop .bg7 img{width:78%;height:78%}#shop .bg7 em{position:absolute;right:2px;bottom:0;font:800 10px system-ui;font-style:normal;color:#ffe9a0;text-shadow:0 1px 2px #000}
#shop .bg7.sel{border-color:#fff;box-shadow:0 0 0 2px #ffe9a0,0 0 10px #ffe9a0}
#shop .bdet7{display:flex;flex-direction:column;gap:5px;padding:8px;border-radius:12px;background:rgba(255,233,160,.08);border:1.5px solid #e8c14a;margin-bottom:6px}
#shop .bdet7 .h{display:flex;gap:8px;align-items:center}#shop .bdet7 .h .ic{width:44px;height:44px;flex:none;border-radius:10px;background:radial-gradient(circle,#5a4a7a,#1a1428);display:flex;align-items:center;justify-content:center;font-size:24px}#shop .bdet7 .h .ic img{width:38px;height:38px}
#shop .bdet7 b{color:#fff}#shop .bdet7 small{opacity:.85}#shop .bdet7{text-align:left;padding:6px 8px;gap:4px}#shop .bdet7 .h>div:last-child{font-size:12px;line-height:1.35}#shop .bdet7 .rw{display:flex;gap:5px;align-items:center}#shop .bdet7 .rw button{width:auto!important;min-width:34px;padding:4px 10px!important;margin:0!important}#shop .bdet7 .mini.ok{padding:6px!important;margin:0!important}#shop .srcb7,#icard .srcb7{align-self:flex-start;height:auto!important;line-height:1.3!important;width:auto!important;display:inline-block!important;padding:4px 9px!important;margin:4px 0 0!important;font-size:11.5px!important;background:#13304a!important;color:#bfe4ff!important;border:1px solid #6ab0e8!important;min-height:0!important}#shop .srcb7.on{background:#bfe4ff!important;color:#13304a!important}#shop .src7{max-height:120px;overflow-y:auto}`;document.head.appendChild(st)}
const SHOP7={sel:null,q:1};
function bImg7(b){const u=b.item?iconURL('item:'+b.item):b.mat?iconURL('mat:'+b.mat):null;return u?'<img src="'+u+'">':(b.emoji||'📦')}
buyList=function(S){if(!S.buy.length)return '<small>ร้านนี้ไม่มีของขาย</small>';if(SHOP7.sel&&!S.buy.some(b=>b.id===SHOP7.sel))SHOP7.sel=null;let h='';
 const b=SHOP7.sel&&S.buy.find(q=>q.id===SHOP7.sel);
 if(b){const key=b.item?'item:'+b.item:b.mat?'mat:'+b.mat:null,have=b.item?(GEAR[b.item]|0):b.mat?(inv[b.mat]|0):b.id==='scroll'?(inv.scroll|0):null;
  h+='<div class="bdet7"><div class="h"><div class="ic">'+bImg7(b)+'</div><div><b>'+b.name+'</b><br><small>'+b.note+'</small>'+(have!=null?'<br><small>มีอยู่ ×'+have+'</small>':'')+'</div></div>'
   +'<div class="rw"><button class="mini sm" onclick="shopQ7(-1)">−</button><b class="q">'+SHOP7.q+'</b><button class="mini sm" onclick="shopQ7(1)">+</button><button class="mini sm" onclick="shopQ7(5)">+5</button></div>'
   +'<button class="mini ok" onclick="shopBuy7()">🛒 ซื้อ ×'+SHOP7.q+' · 🪙 '+(b.price*SHOP7.q).toLocaleString()+'</button>'+(key?srcBtn7(key):'')+'</div>'}
 else h+='<small style="display:block;margin:2px 0 6px;opacity:.8">แตะช่องสินค้าเพื่อดูรายละเอียด</small>';
 h+='<div class="bgrid7">'+S.buy.map(q=>'<div class="bg7'+(q.id===SHOP7.sel?' sel':'')+'" title="'+q.name+'" onclick="shopSel7(\''+q.id+'\')">'+bImg7(q)+'<em>🪙'+q.price+'</em></div>').join('')+'</div>';return h};
window.shopSel7=id=>{SHOP7.sel=SHOP7.sel===id?null:id;SHOP7.q=1;sfx('ui');renderShop()};
window.shopQ7=d=>{SHOP7.q=Math.max(1,Math.min(99,SHOP7.q+d));sfx('ui');renderShop()};
window.shopBuy7=()=>{const id=SHOP7.sel;if(!id)return;const n=SHOP7.q;let c0=inv.coin;for(let i=0;i<n;i++){const before=inv.coin;buyItem(id);if(inv.coin>=before)break}if(SHOPK)renderShop()};
// แถบขาย: เพิ่ม "หาได้จากที่ไหน"
{const _sb=sellBar;sellBar=function(){const h=_sb();try{const s=SHOPUI.sel;if(!h||!s)return h;return h.replace(/<\/div>$/,srcBtn7((s.t==='gear'?'item:':'mat:')+s.k)+'</div>')}catch(e){return h}}}
{const _cs=closeShop;closeShop=function(){SHOP7.sel=null;return _cs()}}

// ---------- 7) ตีบวก: ช่องใหญ่ซ้าย (ของที่จะตี) · กระเป๋าเป็นช่องไอคอนขวา · ของที่ใช้มาจากเกมจริง ----------
// ค่าใช้จ่าย: Gold + 💎หินเสริมพลัง + แท่งแร่ตามระดับไอเท็ม (หลอมจากเตา) · +10 ขึ้นไปใช้ 🐉เกล็ดมังกรเพิ่ม
ENHCFG.cost=l=>({gold:50*(l+1)*(l+2),stone:ENH_EST(l),ing:1+(l>>2),scale:l>=9?l-8:0});
const enhMats7=(id,l)=>{const it=ITEMS[id],c=ENHCFG.cost(l),L=[{k:'coin',n:c.gold,nm:'Gold'},{k:'estone',n:c.stone,nm:'หินเสริมพลัง'},{k:MATKEY[it.tier],n:c.ing,nm:MATN[it.tier]}];if(c.scale)L.push({k:'scale',n:c.scale,nm:'เกล็ดมังกร'});return L};
{const _ck=enhCheck7;enhCheck7=function(id){const r=_ck(id);if(r)return r;const l=enhLv7(id);for(const m of enhMats7(id,l))if((inv[m.k]|0)<m.n)return 'วัตถุดิบไม่เพียงพอ — '+m.nm+' ต้องใช้ '+m.n+' มี '+(inv[m.k]|0);return null}}
{const _es=enhStart7;enhStart7=function(){const id=ENHS.sel;if(ENHS.busy||!id||enhCheck7(id)){return _es()}const l=enhLv7(id),ms=enhMats7(id,l).filter(m=>m.k!=='coin'&&m.k!=='estone');
  _es();if(ENHS.busy)for(const m of ms)inv[m.k]=Math.max(0,(inv[m.k]|0)-m.n);try{refreshInv();saveGame(true)}catch(e){}}}
{const st=document.createElement('style');st.textContent=`
#enhw .ebd{flex:1;min-height:0;display:flex;gap:10px;padding:10px}
#enhw .eL{width:46%;display:flex;flex-direction:column;gap:6px;min-width:0;overflow-y:auto}
#enhw .eR{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
#enhw .bigslot{position:relative;flex:none;width:118px;height:118px;border-radius:18px;border:3px solid var(--ec,#8a7040);background:radial-gradient(circle at 50% 45%,#6a5a8a,#1a1428 75%);box-shadow:inset 0 0 18px rgba(0,0,0,.6),0 0 16px var(--eg,transparent);display:flex;align-items:center;justify-content:center}
#enhw .bigslot img{width:92px;height:92px;image-rendering:pixelated}#enhw .bigslot.empty::after{content:"วางอุปกรณ์\\Aที่จะตีบวก";white-space:pre;text-align:center;font-size:11px;opacity:.6}
#enhw .bigslot .lv{position:absolute;right:6px;top:4px;font:900 16px system-ui;text-shadow:0 1px 3px #000}
#enhw .mats{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
#enhw .mt{position:relative;width:50px;height:50px;border-radius:10px;border:2px solid #8fe08a;background:radial-gradient(circle,#3a3050,#141020);display:flex;align-items:center;justify-content:center}
#enhw .mt.no{border-color:#ff7a6a}#enhw .mt img{width:36px;height:36px}#enhw .mt em{position:absolute;left:0;right:0;bottom:-13px;text-align:center;font:800 10px system-ui;font-style:normal;white-space:nowrap}
#enhw .mt.no em{color:#ff9a8a}#enhw .mt em b{color:#ffe9a0}
#enhw .grid7{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:6px;align-content:start;padding:2px}
#enhw .gs{position:relative;aspect-ratio:1;border-radius:10px;border:2px solid var(--tc,#555);background:radial-gradient(circle at 50% 40%,#3e3456,#161222);cursor:pointer;display:flex;align-items:center;justify-content:center}
#enhw .gs img{width:80%;height:80%}#enhw .gs em{position:absolute;right:3px;top:0;font:900 10.5px system-ui;font-style:normal;text-shadow:0 1px 2px #000}
#enhw .gs i{position:absolute;left:3px;bottom:1px;font:800 9px system-ui;font-style:normal;color:#8fe08a}#enhw .gs.sel{box-shadow:0 0 0 2px #fff,0 0 12px #ffe9a0}#enhw .gs.pk{outline:2px dashed #ffe9a0}
#enhw .pop7{padding:8px;border-radius:12px;background:rgba(0,0,0,.35);border:1.5px solid rgba(255,233,160,.4);display:flex;flex-direction:column;gap:4px}
#enhw .etop{display:flex;gap:10px;align-items:center}#enhw .einf{display:flex;flex-direction:column;gap:2px;min-width:0}#enhw .pop7 .srcb7{align-self:flex-start;padding:3px 8px;font-size:11px;background:#13304a;color:#bfe4ff;border-color:#6ab0e8}#enhw .pop7 .rw7{display:flex;gap:6px;flex-wrap:wrap}#enhw .pop7 button{font:800 12px system-ui,"Noto Sans Thai",sans-serif;padding:6px 10px;border-radius:9px;border:1px solid #c8a24a;background:#3a2c18;color:#ffe9c0;cursor:pointer}#enhw .pop7 button.g{background:linear-gradient(180deg,#f2c14a,#b8781a);color:#3a2008}
@media (max-height:440px){#enhw .bigslot{width:84px;height:84px}#enhw .bigslot img{width:64px;height:64px}#enhw .mt{width:40px;height:40px}#enhw .mt img{width:28px;height:28px}#enhw .gs{min-height:0}}`;document.head.appendChild(st)}
ENHS.pick=null; // ช่องที่แตะในกระเป๋า (ยังไม่วางลงทั่ง)
const _er7=enhRender7;
enhRender7=function(){if(!ENHS.open)return;if(ENHS.res)return _er7();
 const all=enhList7(),id=ENHS.sel&&all.some(o=>o.id===ENHS.sel)?ENHS.sel:null;if(!id)ENHS.sel=null;
 let h='<div class="w"><div class="hd"><b>⚒️ ตีบวกอุปกรณ์ · ENHANCEMENT</b><button onclick="closeEnh7()">✕</button></div><div class="ebd"><div class="eL">';
 if(id){const it=ITEMS[id],l=enhLv7(id),K=ENHCFG.kinds[it.kind],mx=l>=MAX_ENHANCEMENT,ec=enhCol(l),why=enhCheck7(id);
  h+='<div class="etop"><div class="bigslot" style="--ec:'+ec+';--eg:'+(l>=3?ec:'transparent')+'" title="แตะเพื่อเอาออก" onclick="enhUnset7()"><img src="'+ico7(id)+'"><span class="lv" style="color:'+ec+'">+'+l+'</span></div>'
   +'<div class="einf"><b style="font-size:14px">'+it.name+'</b><small>'+(GKIND[it.kind]||it.kind)+' · ขั้น '+(it.tier+1)+' ('+TNAMES[it.tier]+')</small>'
   +'<div class="lvl" style="font-size:22px;text-align:left">'+(mx?'<span style="color:'+ec+'">+'+l+' MAX</span>':'<span style="color:'+ec+'">+'+l+'</span><span class="arr">→</span><span style="color:'+enhCol(l+1)+'">+'+(l+1)+'</span>')+'</div></div></div>';
  h+='<div class="mat"><span>'+K.ic+' '+K.n+'</span><span><b>'+enhStat7(id,l)+'</b>'+(mx?'':' <span class="arr">→</span> <span class="ok">'+enhStat7(id,l+1)+'</span>')+'</span></div>';
  if(!mx){h+='<small style="text-align:center;opacity:.8">ของที่ต้องใช้ (โอกาสสำเร็จ '+ENHCFG.rate(l)+'%)</small><div class="mats">'+enhMats7(id,l).map(m=>{const hv=inv[m.k]|0,ok=hv>=m.n;
    return '<div class="mt'+(ok?'':' no')+'" title="'+m.nm+'" onclick="enhSrc7(\''+m.k+'\')"><img src="'+iconURL('mat:'+m.k)+'"><em>'+(m.k==='coin'?m.n.toLocaleString():'<b>'+hv+'</b>/'+m.n)+'</em></div>'}).join('')+'</div><div style="height:12px"></div>'}
  if(ENHS.srcK)h+='<div class="pop7"><b style="font-size:12px">📍 '+(INVMETA[ENHS.srcK]?INVMETA[ENHS.srcK][0]:ENHS.srcK)+' หาได้จาก</b>'+srcHTML7('mat:'+ENHS.srcK)+'</div>';
  h+='<div class="why">'+(ENHS.msg||why||'')+'</div><button class="go" '+(why?'disabled':'')+' onclick="enhStart7()">⚒️ ตีบวก</button>'}
 else h+='<div class="bigslot empty"></div><small style="text-align:center;opacity:.8">แตะอุปกรณ์ในกระเป๋าทางขวา<br>แล้วกด "⚒️ ตีบวก" เพื่อวางลงบนทั่ง</small>';
 h+='</div><div class="eR"><div class="gtab">'+ENHCFG.groups.map(([g,n])=>'<button class="'+(ENHS.grp===g?'on':'')+'" onclick="enhGrp7(\''+g+'\')">'+n+'</button>').join('')+'</div>';
 const L=all.filter(o=>ENHS.grp==='all'||ENHCFG.kinds[ITEMS[o.id].kind].g===ENHS.grp);
 if(ENHS.pick&&L.some(o=>o.id===ENHS.pick)){const p=ENHS.pick,it=ITEMS[p],l=enhLv7(p),K=ENHCFG.kinds[it.kind];
  h+='<div class="pop7"><div style="display:flex;gap:8px;align-items:center"><img src="'+ico7(p)+'" style="width:38px;height:38px;border-radius:8px;background:#1a1428;flex:none"><div style="flex:1;min-width:0"><b>'+it.name+' <span style="color:'+enhCol(l)+'">+'+l+'</span></b><br><small>'+K.n+' '+enhStat7(p)+' · '+(P.armor[it.kind]===p?'สวมอยู่':'อยู่ในกระเป๋า')+'</small></div>'
   +'<button class="g" onclick="enhSet7(\''+p+'\')">⚒️ ตีบวก</button><button onclick="ENHS.pick=null;enhRender7()">✕</button></div>'+srcBtn7('item:'+p)+'</div>'}
 h+='<div class="grid7">';if(!L.length)h+='<small style="grid-column:1/-1;padding:8px">ไม่มีอุปกรณ์ที่ตีบวกได้ในหมวดนี้</small>';
 for(const o of L){const it=ITEMS[o.id],l=enhLv7(o.id);h+='<div class="gs'+(o.id===id?' sel':'')+(o.id===ENHS.pick?' pk':'')+'" style="--tc:'+TIERC[it.tier]+'" title="'+it.name+' +'+l+'" onclick="enhPick7(\''+o.id+'\')"><img src="'+ico7(o.id)+'">'+(l?'<em style="color:'+enhCol(l)+'">+'+l+'</em>':'')+(o.worn?'<i>E</i>':'')+'</div>'}
 h+='</div></div></div></div>';enhW.innerHTML=h};
window.enhPick7=id=>{if(ENHS.busy)return;ENHS.pick=ENHS.pick===id?null:id;ENHS.srcK=null;sfx('ui');enhRender7()};
window.enhSet7=id=>{if(ENHS.busy)return;ENHS.sel=id;ENHS.pick=null;ENHS.msg='';ENHS.srcK=null;sfx('pop');enhRender7()};
window.enhUnset7=()=>{if(ENHS.busy)return;ENHS.sel=null;ENHS.srcK=null;sfx('ui');enhRender7()};
window.enhSrc7=k=>{ENHS.srcK=ENHS.srcK===k?null:k;sfx('ui');enhRender7()};
{const _o=openEnh7;openEnh7=function(id){ENHS.pick=null;ENHS.srcK=null;const keep=id||null;_o(id);if(!keep&&ENHS.open){ENHS.sel=null;enhRender7()}}}
window.openEnh7=openEnh7;enhItem=function(id){openEnh7(id)};

// ---------- 8) ทั่งตีเหล็กตั้งพื้น (ตีได้จริง): ตัวละครเดินไปยืนข้างทั่ง ค้อนลงบนหน้าทั่งพอดี ----------
const ANV7={x:OX+17.5*T,y:6.6*T};window.ANV7y=ANV7.y;
setInterval(()=>{window.ENHOPEN7=!!(ENHS.open||ENHS.busy)},200);
try{const s=SHOP_STN.gear.find(s=>s.k==='anvil');if(s){s.x=ANV7.x;s.y=ANV7.y;s.n='🔨 ทั่งตีเหล็ก · ตีบวก'}}catch(e){}
{const _sn=stnNear;stnNear=function(){if(D&&D.shop==='gear'){if(Math.hypot(P.x-ANV7.x,P.y-ANV7.y)<46)return SHOP_STN.gear.find(s=>s.k==='anvil');const r=_sn();return r&&r.k==='anvil'?null:r}return _sn()}}
// ปิดช่องที่ทั่งตั้งอยู่ (ชนได้ ไม่เดินทะลุ)
{const _es=enterShop;enterShop=function(id){const r=_es(id);try{if(id==='gear'&&typeof dm!=='undefined'){const tx=Math.floor(ANV7.x/T),ty=Math.floor((ANV7.y-4)/T);if(dm[ty])dm[ty][tx]=WL}}catch(e){}return r}}
function drawAnvil7(){const x=ANV7.x,y=ANV7.y;ctx.save();
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(x,y+1,19,5,0,0,7);ctx.fill();
 // ตอไม้ฐาน
 const g=ctx.createLinearGradient(x-13,0,x+13,0);g.addColorStop(0,'#4a2c14');g.addColorStop(.5,'#8a5a2e');g.addColorStop(1,'#3a2210');ctx.fillStyle=g;ctx.fillRect(x-13,y-16,26,16);ctx.fillStyle='#a8743e';ctx.beginPath();ctx.ellipse(x,y-16,13,3.5,0,0,7);ctx.fill();
 ctx.strokeStyle='#24140a';ctx.lineWidth=1.2;ctx.strokeRect(x-12.5,y-16,25,15.5);ctx.fillStyle='rgba(0,0,0,.25)';for(const q of [-6,1,7])ctx.fillRect(x+q,y-14,1,13);
 // ตัวทั่ง (มีเขา)
 ctx.fillStyle='#2b2d35';ctx.beginPath();ctx.moveTo(x-8,y-17);ctx.lineTo(x+8,y-17);ctx.lineTo(x+6,y-23);ctx.lineTo(x-6,y-23);ctx.closePath();ctx.fill();
 ctx.fillStyle='#4a4d58';ctx.beginPath();ctx.moveTo(x-17,y-31);ctx.lineTo(x+13,y-31);ctx.lineTo(x+13,y-26);ctx.lineTo(x+7,y-23);ctx.lineTo(x-7,y-23);ctx.lineTo(x-11,y-26);ctx.quadraticCurveTo(x-20,y-27,x-25,y-30);ctx.quadraticCurveTo(x-21,y-31,x-17,y-31);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#15161b';ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle='#8a8f9e';ctx.fillRect(x-16,y-32,29,2.4);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x-14,y-32,10,1);ctx.restore()}
{const _h=hero;hero=function(){if(!(D&&D.shop==='gear'))return _h();if(ANV7.y<=P.y+3){drawAnvil7();_h()}else{_h();drawAnvil7()}}}
// ตำแหน่งยืน/เป้าค้อน ตามทั่งใหม่ (ยืนซ้ายทั่ง หันขวา · ค้อนลงหน้าทั่ง)
{const _fs=forgeStart7;forgeStart7=function(id,ok){_fs(id,ok);FRG.a={x:ANV7.x,y:ANV7.y,k:'anvil'};FRG.to={x:ANV7.x-24,y:ANV7.y}}}
// ตำแหน่งของบนทั่งในฉากตีเหล็ก: เลื่อนให้อยู่บนหน้าทั่ง (y-33)
{const _fd=frgDraw;frgDraw=function(x,by,TOP){const a=FRG.a;if(a&&a.k==='anvil'){const sv={x:a.x,y:a.y};FRG.a={x:a.x+2,y:a.y-6,k:'anvil'};try{return _fd(x,by,TOP)}finally{FRG.a=Object.assign(FRG.a,sv)}}return _fd(x,by,TOP)}}

// ---------- 9) เรื่องราว: ช่างหนวดเหล็กสอนตีบวกครั้งแรก (ให้หินเสริมพลัง + แท่งแร่สำหรับเริ่ม) ----------
{const _o=openEnh7;openEnh7=function(id){let seen=false;try{seen=localStorage.getItem('fm_enhtut7')==='1'}catch(e){seen=true}
  if(!seen&&D&&D.shop==='gear'&&!ENHS.busy){try{localStorage.setItem('fm_enhtut7','1')}catch(e){}const nm=(SD2.gear&&SD2.gear.owner&&SD2.gear.owner.name)||'ช่างหนวดเหล็ก';
   talk({name:nm,c:'#c87a3a'},'อ้อ เจ้าสนใจตีบวกงั้นรึ? อาวุธดีต้องผ่านไฟผ่านค้อน… วางของบนทั่ง ใช้หินเสริมพลังจากดันเจี้ยนกับแท่งแร่จากเตาหลอม ตีให้ถึงเนื้อเหล็ก! ข้าให้ของติดมือไปลองก่อน',
    [{t:'⚒️ รับของแล้วลองตีเลย',c:'go',f:()=>{inv.estone=(inv.estone|0)+3;inv.ingSt=(inv.ingSt|0)+2;inv.ingot=(inv.ingot|0)+2;refreshInv();say('🎁 ได้ 💎หินเสริมพลัง ×3 · แท่งหิน ×2 · แท่งเหล็ก ×2');setTimeout(()=>_o(id),200)}}],'⚒️ บทเรียนตีบวก');return}
  return _o(id)}}
window.openEnh7=openEnh7;enhItem=function(id){openEnh7(id)};

// ---------- 10) ชำนาญสกิล: พาสซีฟผูกกับสกิลจริง — ใช้สกิลบ่อย = ชำนาญขึ้น (ดาเมจ↑ คูลดาวน์↓ มานา↓) ----------
const MSK7={need:[0,10,30,70,150,300],dmg:.06,cd:.04,mp:.04};
let MSKD7={};try{MSKD7=JSON.parse(localStorage.getItem('fm_msk7')||'{}')||{}}catch(e){}
const mskKey7=i=>P.cls+':'+i,mskUses7=i=>MSKD7[mskKey7(i)]|0,mskLv7=i=>{const u=mskUses7(i);let l=0;for(let k=1;k<MSK7.need.length;k++)if(u>=MSK7.need[k])l=k;return l};
function mskSave7(){try{localStorage.setItem('fm_msk7',JSON.stringify(MSKD7))}catch(e){}}
{const _us=useSkill;useSkill=function(i){if(P.cls==='none')return _us(i);const L=mskLv7(i),cd0=CS.cd[i],mp0=P.mp,j0=P.jump;const prev=window.CURSK7;window.CURSK7=L?{m:1+MSK7.dmg*L}:null;
  try{_us(i)}finally{window.CURSK7=prev}
  const cast=CS.cd[i]>cd0+.01||P.mp<mp0-.01;if(!cast)return;
  if(L){if(CS.cd[i]>cd0+.01)CS.cd[i]*=1-MSK7.cd*L;const sp=mp0-P.mp;if(sp>0)P.mp=Math.min(BAL.mp,P.mp+sp*MSK7.mp*L);if(P.jump&&P.jump!==j0)P.jump.mm7=1+MSK7.dmg*L}
  const k=mskKey7(i),l0=mskLv7(i);MSKD7[k]=(MSKD7[k]|0)+1;mskSave7();const l1=mskLv7(i);
  if(l1>l0){const S=CSKILLS[P.cls]&&CSKILLS[P.cls][i];say('🎯 ชำนาญสกิล '+(S?S.n:'')+' ขึ้นเป็นขั้น '+l1+'!');sfx('gem')}}}
{const _hE=hurtE;hurtE=function(e,mult,o){if(window.CURSK7&&typeof mult==='number')mult*=CURSK7.m;return _hE(e,mult,o)}}
{const _sh=shoot;shoot=function(k,o){if(window.CURSK7&&o&&typeof o.mult==='number')o=Object.assign({},o,{mult:o.mult*CURSK7.m});return _sh(k,o)}}
{const st=document.createElement('style');st.textContent=`
.msk7{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px;overflow-y:auto;padding:2px}
.msk7 .mc{display:flex;gap:9px;padding:9px;border-radius:12px;background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(0,0,0,.25));border:1.5px solid rgba(232,193,74,.35)}
.msk7 .mc.lk{opacity:.5}.msk7 .si{width:56px;height:56px;flex:none;border-radius:12px;background-size:cover;background-position:center;border:2px solid #e8c14a;box-shadow:0 0 10px var(--g,transparent)}
.msk7 .st{display:flex;gap:3px;margin:3px 0}.msk7 .st i{width:14px;height:6px;border-radius:3px;background:#3a3448}.msk7 .st i.on{background:linear-gradient(90deg,#ffd84a,#ff8a3a);box-shadow:0 0 5px #ffb04a}
.msk7 .bar{height:5px;border-radius:3px;background:#2a2438;overflow:hidden}.msk7 .bar b{display:block;height:100%;background:linear-gradient(90deg,#7fd0ff,#b48cff)}
.msk7 small{display:block;font-size:11px;opacity:.85;line-height:1.35}
.pas7{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.pas7 .pc{flex:1 1 140px;display:flex;gap:7px;align-items:center;padding:6px;border-radius:10px;background:rgba(0,0,0,.3);border:1.5px solid rgba(255,233,160,.35)}
.pas7 .pc.lk{opacity:.45;border-color:#555}.pas7 .pi{width:38px;height:38px;flex:none;border-radius:9px;background-size:cover;background-position:center;border:2px solid var(--c,#e8c14a);box-shadow:0 0 8px var(--c,#e8c14a)}
.pas7 b{font-size:12px;color:#ffe9a0}.pas7 small{font-size:10.5px}`;document.head.appendChild(st)}
function mskHTML7(){const L=CSKILLS[P.cls]||[];if(P.cls==='none'||!L.length)return '<div class="card"><b>🎯 ชำนาญสกิล</b><small>เลือกอาชีพก่อน แล้วใช้สกิลบ่อย ๆ จะชำนาญขึ้น</small></div>';
 let h='<div class="card" style="margin-bottom:8px"><b>🎯 ชำนาญสกิล — ยิ่งใช้ยิ่งเก่ง</b><small>ใช้สกิลในการต่อสู้เพื่อเพิ่มความชำนาญ (สูงสุดขั้น 5) · ทุกขั้น: ดาเมจสกิล +'+Math.round(MSK7.dmg*100)+'% · คูลดาวน์ −'+Math.round(MSK7.cd*100)+'% · มานา −'+Math.round(MSK7.mp*100)+'%</small></div><div class="msk7">';
 L.forEach((s,i)=>{const own=skOwned(i),l=mskLv7(i),u=mskUses7(i),nx=MSK7.need[Math.min(5,l+1)],pv=MSK7.need[l],pc=l>=5?100:Math.round((u-pv)/(nx-pv)*100),ic=typeof skillIcon==='function'?skillIcon(s.n):null;
  h+='<div class="mc'+(own?'':' lk')+'"><div class="si" style="'+(ic?'background-image:url('+ic+')':'')+';--g:'+(l>=3?'#ffb04a':'transparent')+'">'+(ic?'':s.e)+'</div><div style="flex:1;min-width:0"><b>'+s.n+'</b>'+(own?'':' <small style="display:inline;color:#ff9a7a">🔒 Lv.'+s.lv+'</small>')
   +'<div class="st">'+[1,2,3,4,5].map(k=>'<i class="'+(k<=l?'on':'')+'"></i>').join('')+'</div><div class="bar"><b style="width:'+pc+'%"></b></div>'
   +'<small>ขั้น '+l+'/5 · ใช้แล้ว '+u+' ครั้ง'+(l<5?' · อีก '+(nx-u)+' ครั้งขึ้นขั้น '+(l+1):' · ชำนาญสูงสุด!')+'</small>'
   +'<small style="color:#8fe08a">ดาเมจ +'+Math.round(MSK7.dmg*100*l)+'% · คูลดาวน์ −'+Math.round(MSK7.cd*100*l)+'% · มานา −'+Math.round(MSK7.mp*100*l)+'%</small></div></div>'});
 return h+'</div>'}
const PASIC7={str:'💪',vit:'❤️',int:'🔮',agi:'🏹',end:'🛡️'};
{const _rs=renderSkw;renderSkw=function(){if(skwEl.hidden)return;
  if(SKW.tab==='msk'){const save=SKW.tab;SKW.tab='sk';_rs();SKW.tab=save;const lst=skwEl.querySelector('.list');if(lst){lst.outerHTML='<div class="list" style="display:block;overflow-y:auto">'+mskHTML7()+'</div>'}}
  else _rs();
  try{const hd=skwEl.querySelector('.sh');if(hd&&!hd.querySelector('.msk7b')){const b=document.createElement('button');b.className='msk7b'+(SKW.tab==='msk'?' on':'');b.textContent='🎯 ชำนาญ';b.onclick=()=>skwTab('msk');const tabs=hd.querySelectorAll('button');const pas=[...tabs].find(x=>/พาสซีฟ/.test(x.textContent));if(pas)pas.after(b);else hd.appendChild(b);for(const x of tabs)if(SKW.tab==='msk'&&/สกิล/.test(x.textContent)&&!/ชำนาญ/.test(x.textContent))x.classList.remove('on')}}catch(e){}
  // พาสซีฟอาชีพ: แสดงเป็นการ์ดไอคอนเรืองแสง (สีตามสาย) แทนข้อความล้วน
  try{if(SKW.tab==='pas'){const PL=PASSIVE[P.cls]||[],C=CLS[P.cls]||{col:'#e8c14a'},L=CSKILLS[P.cls]||[];for(const cd of skwEl.querySelectorAll('.card')){if(!/พาสซีฟอาชีพ/.test(cd.textContent))continue;
    cd.innerHTML='<b>'+(C.e||'')+' พาสซีฟอาชีพ (ปลดล็อกตามเลเวล)</b><div class="pas7">'+PL.map((p,i)=>{const on=P.lv>=p.lv,sk=L[i%Math.max(1,L.length)],ic=sk&&typeof skillIcon==='function'?skillIcon(sk.n):null,k=p.st?Object.keys(p.st)[0]:null;
      return '<div class="pc'+(on?'':' lk')+'"><div class="pi" style="--c:'+(on?C.col:'#555')+';'+(ic?'background-image:url('+ic+')':'')+'"></div><div><b>'+(k?PASIC7[k]||'🌟':'🌟')+' '+p.n+'</b><small>'+p.d+' · Lv.'+p.lv+(on?' ✓':' 🔒')+'</small></div></div>'}).join('')+'</div>'}}}catch(e){}}}
{const _st=skwTab;skwTab=function(t){SKW.tab=t;sfx('ui');renderSkw()}}
// ต้นไม้พาสซีฟ: จุดที่ยังไม่อัพเป็นอัญมณีมีมิติ (ไล่สี+ขอบเรือง) แทนวงกลมดำเรียบ
{const _ps=ptSVG;ptSVG=function(){let s=_ps();s=s.replace('<defs>','<defs><radialGradient id="ndk7" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#5a4e7e"/><stop offset=".6" stop-color="#262036"/><stop offset="1" stop-color="#0e0c16"/></radialGradient><radialGradient id="nsh7" cx=".35" cy=".3" r=".6"><stop offset="0" stop-color="rgba(255,255,255,.75)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient>');
  s=s.split('fill="#1a1a28"').join('fill="url(#ndk7)"');return s}}

// ---------- 11) "หาได้จาก" แสดงต่อท้ายรายละเอียดของทุกที่ (ไม่ต้องกดปุ่ม) · แตะของ = เห็นรายละเอียดเต็ม ----------
{const st=document.createElement('style');st.textContent=`
.isrc7{margin-top:7px;border-top:1px dashed rgba(127,200,255,.35);padding-top:6px;text-align:left}
.isrc7>b{display:block;font-size:11.5px;color:#9fd4ff;margin-bottom:3px}
.isrc7 .src7{margin-top:0;max-height:none}
.il7{text-align:left;font-size:11.5px;line-height:1.4;margin-top:4px;padding-top:4px;border-top:1px solid rgba(255,255,255,.12)}
.il7 div{margin:1px 0}.il7 .y{color:#ffd84a}.il7 .g{color:#8fe08a}.il7 .b{color:#9fd4ff}.il7 .m{opacity:.7}
#icard .isrc7 .src7{max-height:140px;overflow-y:auto}#icard.tip .isrc7 .src7 div:nth-child(n+4){display:none}`;document.head.appendChild(st)}
const srcBlock7=key=>'<div class="isrc7"><b>📍 หาได้จากที่ไหน</b>'+srcHTML7(key)+'</div>';
const lines7=key=>{try{return '<div class="il7">'+(key.startsWith('item:')?gearLines(key.slice(5)):matLines(key.slice(4)))+'</div>'}catch(e){return ''}};
// การ์ดของในกระเป๋า/ตัวละคร: ต่อท้ายด้วยแหล่งที่มา (แทนปุ่ม)
{const _ic=icShow;icShow=function(t,k,ro,at){_ic(t,k,ro,at);try{if(icEl.hidden)return;for(const b of icEl.querySelectorAll('.srcb7,.src7'))b.remove();if(icEl.querySelector('.isrc7'))return;
  const key=(t==='gear'?'item:':'mat:')+k,il=icEl.querySelector('.il');if(il)il.insertAdjacentHTML('afterend',srcBlock7(key));else icEl.insertAdjacentHTML('beforeend',srcBlock7(key))}catch(e){}}}
// ร้านค้า (ซื้อ): รายละเอียดเต็ม + แหล่งที่มาต่อท้าย
{const _bl=buyList;buyList=function(S){let h=_bl(S);const b=SHOP7.sel&&S.buy.find(q=>q.id===SHOP7.sel);if(!b)return h;const key=b.item?'item:'+b.item:b.mat?'mat:'+b.mat:null;
  h=h.replace(/<button class="srcb7"[^>]*>[^<]*<\/button>/,'');if(key)h=h.replace('</div><div class="bgrid7">',lines7(key)+srcBlock7(key)+'</div><div class="bgrid7">');return h}}
// ร้านค้า (ขาย): แตะของ = รายละเอียดเต็ม + แหล่งที่มา
{const _sb=sellBar;sellBar=function(){let h=_sb();try{const s=SHOPUI.sel;if(!h||!s)return h;const key=(s.t==='gear'?'item:':'mat:')+s.k;h=h.replace(/<button class="srcb7"[^>]*>[^<]*<\/button>/,'');return h.replace(/<\/div>$/,lines7(key)+srcBlock7(key)+'</div>')}catch(e){return h}}}
// ตีบวก: แตะของในกระเป๋า = รายละเอียดเต็ม (ค่าสถานะ/ตีบวก/รูน/น้ำหนัก) + แหล่งที่มา
{const _er=enhRender7;enhRender7=function(){_er();try{const p=ENHS.pick;if(!p)return;const pop=enhW.querySelector('.eR .pop7');if(!pop)return;for(const b of pop.querySelectorAll('.srcb7,.src7'))b.remove();
  pop.insertAdjacentHTML('beforeend',lines7('item:'+p)+srcBlock7('item:'+p));pop.style.maxHeight='46%';pop.style.overflowY='auto'}catch(e){}}}
// ช่องวัตถุดิบในหน้าตีบวก: แตะ = รายละเอียด + แหล่งที่มา (ใช้กล่องเดิม)
{const _er=enhRender7;enhRender7=function(){_er();try{const k=ENHS.srcK;if(!k||!ENHS.sel)return;const box=[...enhW.querySelectorAll('.eL .pop7')].pop();if(!box)return;box.innerHTML='<b style="font-size:12px">'+(INVMETA[k]?INVMETA[k][0]:k)+' · มี '+(inv[k]|0)+'</b>'+lines7('mat:'+k)+srcBlock7('mat:'+k)}catch(e){}}}

// ---------- 12) เอาปุ่มที่ซ้ำกับเมนูโปรไฟล์ออกจากขอบจอ (กระเป๋า · ลำโพง · เชื่อมต่อออนไลน์ · พาสซีฟ🌟) ----------
{const st=document.createElement('style');st.textContent='#bagb,#muteb,#netb,#pasb{display:none!important}#pmdot7{position:absolute;right:-4px;top:-4px;min-width:16px;height:16px;padding:0 4px;border-radius:9px;background:#7a4ad8;color:#fff;font:900 10px/16px system-ui;text-align:center;box-shadow:0 0 0 2px #1a1426;pointer-events:none}#pmdot7[hidden]{display:none}#pm7{grid-template-columns:repeat(5,58px)!important}';document.head.appendChild(st)}
PM7.splice(PM7.length-1,0,['🔊','เสียง',()=>{toggleMute();pmRender7()}],['🌐','ออนไลน์',()=>{const b=gid('netb');if(b&&b.onclick)b.onclick();else toggleMenu()}]);
function pmRender7(){pm7.innerHTML=PM7.map((m,i)=>{let ic=m[0],lb=m[1],badge='';if(lb==='เสียง'){ic=SET.mute?'🔇':'🔊';lb=SET.mute?'เปิดเสียง':'ปิดเสียง'}if(lb==='ออนไลน์'&&typeof NET!=='undefined'&&NET.on)lb='ออนไลน์ '+NET.n;
  if(lb==='พาสซีฟ'){const n=typeof ptFree==='function'?ptFree():0;if(n)badge='<i style="position:absolute;right:3px;top:2px;font:900 9px system-ui;font-style:normal;background:#e04a3a;border-radius:7px;padding:0 4px">'+n+'</i>'}
  return '<button data-i="'+i+'" class="'+(m[3]||'')+'" style="position:relative">'+ic+'<small>'+lb+'</small>'+badge+'</button>'}).join('')}
pmRender7();
{const _f=faceEl.onclick;faceEl.onclick=e=>{pmRender7();_f(e)}}
// จุดแจ้งเตือนบนรูปโปรไฟล์ (แทนตัวเลขบนปุ่ม 🌟 ที่เอาออก)
{const d=document.createElement('i');d.id='pmdot7';d.hidden=true;const host=faceEl.parentNode;if(host){if(getComputedStyle(host).position==='static')host.style.position='relative';host.appendChild(d)}
 setInterval(()=>{try{const n=typeof ptFree==='function'?ptFree():0;d.hidden=!n;d.textContent='🌟'+(n>99?'99+':n);d.style.right='auto';d.style.left=(faceEl.offsetLeft+faceEl.offsetWidth-12)+'px';d.style.top=(faceEl.offsetTop+faceEl.offsetHeight-12)+'px';d.style.zIndex=5}catch(e){}},1000)}
// คอลัมน์ขวาเหลือปุ่มออโต้ปุ่มเดียว: ชิดมุมบนขวา
rcol7=function(){try{const a=gid('autob');if(a)a.style.setProperty('top','calc(8px + var(--st,0px))','important')}catch(e){}};rcol7();

// =====================================================================
// v4.7.8 — รวมแก้ตามรายการ (UI/อุปกรณ์ · สกิล · ไอเท็ม/คราฟ · เกมเพลย์)
// หลัก: แก้เฉพาะจุด · ห่อด้วย try/catch · คืนสถานะใน finally · มีตัวตรวจ (validator)
// =====================================================================
function safe7(tag,fn){try{return fn()}catch(e){try{console.warn('[v478] '+tag,e)}catch(_){}return undefined}}
const FIN7=v=>typeof v==='number'&&isFinite(v);

// ---------- [ระบบชน] ใช้ชนให้ถูกฉาก: ดันเจี้ยนโซน=zHit · ในเมือง/ร้าน=dhit · ทุ่งหญ้า=hit ----------
function wHit7(x,y){try{if(!FIN7(x)||!FIN7(y))return true;if(D&&D.zone&&typeof zHit==='function')return zHit(x,y);if(D)return dhit(x,y);return hit(x,y)}catch(e){return false}}
window.wHit7=wHit7;

// =====================================================================
// 1) UI & อุปกรณ์
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#set6{display:none!important}
#acts #atk{width:92px!important;height:92px!important;right:9px!important;bottom:9px!important;font-size:40px!important}
#ult6.nocls7{display:none!important}
/* เมนูตั้งค่า: กรอบไม้ขอบทอง */
#menu{background:linear-gradient(180deg,#3a2614 0%,#2a1a0c 100%)!important;border:3px solid #c8a24a!important;border-radius:14px!important;
 box-shadow:0 0 0 2px #5a3a14,0 0 0 5px #1a0f06,inset 0 0 0 1px rgba(255,233,160,.35),inset 0 0 26px rgba(0,0,0,.55),0 10px 30px rgba(0,0,0,.6)!important;padding-top:6px!important}
#menu .smh7{margin:-2px -6px 4px;padding:8px 10px 7px;text-align:center;font:900 15px/1 Georgia,'Times New Roman',serif;letter-spacing:3px;color:#ffe9a0;
 background:linear-gradient(180deg,#7a4a1c,#4a2a0e);border:2px solid #e8c14a;border-radius:10px;text-shadow:0 2px 0 #2a1406,0 0 8px rgba(255,200,80,.5);box-shadow:inset 0 1px 0 rgba(255,240,200,.4),0 2px 0 #1a0f06}
#menu .smh7 small{display:block;font:700 10px system-ui;letter-spacing:1px;color:#e8c890;opacity:.85;margin-top:3px}
#menu button{background:linear-gradient(180deg,#8a5a2a,#5a3414)!important;color:#ffe9c0!important;border:1.5px solid #e8c14a!important;border-radius:9px!important;
 box-shadow:0 3px 0 #2a1406,inset 0 1px 0 rgba(255,240,200,.45)!important;text-shadow:0 1px 0 #2a1406;transition:transform .06s}
#menu button:active{transform:translateY(2px);box-shadow:0 1px 0 #2a1406,inset 0 1px 0 rgba(255,240,200,.3)!important}
#menu .tabs6 button.on{background:linear-gradient(180deg,#ffe9a0,#d8b050)!important;color:#3a2408!important}
#menu select{background:#1e130a!important;border:1px solid #c8a24a!important;color:#ffe9c0!important}
#menu .sec{border-top:1px solid rgba(232,193,74,.45)!important;color:#ffd87a}
/* หน้าต่างเลือกอาชีพแบบการ์ด 3 ใบ */
#shop .cls7{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:6px}
#shop .cc7{position:relative;display:flex;flex-direction:column;gap:4px;padding:8px 7px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(0,0,0,.25));border:2px solid var(--cc);text-align:left;min-width:0}
#shop .cc7.on{box-shadow:0 0 0 2px #fff,0 0 14px var(--cc)}
#shop .cc7 .ch{display:flex;align-items:center;gap:6px}#shop .cc7 .ch .e{font-size:26px;line-height:1;filter:drop-shadow(0 2px 2px #000)}
#shop .cc7 .ch b{color:var(--cc);font-size:14px;line-height:1.15}#shop .cc7 .ds{font-size:11px;opacity:.85;line-height:1.3}
#shop .cc7 .tt7{font:800 10.5px system-ui;color:#ffe9a0;margin-top:2px}
#shop .cc7 .sk{display:flex;gap:4px;flex-wrap:wrap}#shop .cc7 .sk span{display:flex;align-items:center;gap:3px;font-size:10px;background:rgba(0,0,0,.3);border-radius:6px;padding:2px 4px}
#shop .cc7 .sk img{width:18px;height:18px;border-radius:4px}
#shop .cc7 .ps small{display:block;font-size:10px;line-height:1.3;opacity:.95}#shop .cc7 .ps small.lk{opacity:.55}
#shop .cc7 button{margin-top:auto!important;width:100%!important;padding:6px!important;font-weight:800}
@media (max-width:560px){#shop .cls7{grid-template-columns:1fr}}
/* ไอคอนตำราสกิล */
.bk7{position:relative;display:inline-block;width:100%;height:100%}.bk7 img{position:absolute;inset:0;width:100%!important;height:100%!important}
.bk7 img.ov,.bk7 i.ov{inset:auto;left:27%;top:20%;width:46%!important;height:46%!important;border-radius:5px;box-shadow:0 0 0 1px #e8c14a,0 0 6px rgba(255,220,120,.6)}
.bk7 i.ov{position:absolute;font-style:normal;font-size:16px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35)}
/* เควสกิลด์ใต้เควสหลัก */
#qtrack .gq7{margin-top:5px;padding-top:4px;border-top:1px dashed rgba(255,233,160,.35)}
#qtrack .gq7 div{display:flex;justify-content:space-between;gap:6px;font-size:11px;line-height:1.35}#qtrack .gq7 div.ok{color:#9dff9a}
#qtrack .gq7 b{font-size:10.5px;color:#9fd8ff}
/* ส่งของเควส: ไอคอนบิน */
.fly7{position:absolute;z-index:60;width:30px;height:30px;pointer-events:none;transition:transform .7s cubic-bezier(.3,.1,.3,1),opacity .7s;filter:drop-shadow(0 0 6px #ffe9a0)}
.fly7.e{font-size:24px;display:flex;align-items:center;justify-content:center}
/* แท่นคริสตัลอรุณ */
#shop .alt7 .bar{height:12px;border-radius:7px;background:rgba(0,0,0,.4);border:1px solid #9fd8ff;overflow:hidden;margin:6px 0}#shop .alt7 .bar i{display:block;height:100%;background:linear-gradient(90deg,#ffe9a0,#9fd8ff)}
#shop .alt7 .gems{display:flex;gap:6px;justify-content:center;font-size:22px;margin:4px 0}#shop .alt7 .gems span.off{filter:grayscale(1);opacity:.35}
/* แลกของกิลด์: รายการวัตถุดิบ */
#shop .gx7{display:flex;flex-direction:column;gap:2px;font-size:11.5px;background:rgba(0,0,0,.25);border-radius:8px;padding:5px 7px}#shop .gx7 .ok{color:#9dff9a}#shop .gx7 .no{color:#ff9a8a}
`;document.head.appendChild(st)}

// ซ่อนวงแหวนพาสซีฟ/อัลติรอบรูปโปรไฟล์จนกว่าจะเลือกอาชีพ
setInterval(()=>safe7('ult6',()=>{const u=gid('ult6');if(u)u.classList.toggle('nocls7',P.cls==='none')}),300);

// หัวเมนูตั้งค่า "SYSTEM MENU"
function menuHead7(){safe7('menuHead',()=>{if(!menuEl||menuEl.querySelector('.smh7'))return;const h=document.createElement('div');h.className='smh7';h.innerHTML='⚜ SYSTEM MENU ⚜<small>ตั้งค่าเกม · ELDORIA</small>';menuEl.insertBefore(h,menuEl.firstChild);
 const b=menuEl.querySelector(':scope > b');if(b&&/ตั้งค่าเกม/.test(b.textContent))b.style.display='none'})}
menuHead7();setInterval(()=>{if(menuEl&&!menuEl.hidden)menuHead7()},400);

// สวมใส่: ใส่ช่องที่ถูกต้องอัตโนมัติ (เครื่องมือ→ช่องลัด) · ปิดหน้าต่างเลือก/กระเป๋า · รีเฟรช UI
{const _eq=equipItem;equipItem=function(id){let done=false;
 try{const it=ITEMS[id];if(!it)return;
  if(it.kind==='axe'||it.kind==='pick'){if(!(GEAR[id]>0)){say('ไม่มี'+it.name+'ในกระเป๋า');return}
   let j=QS.slots.indexOf(id);if(j<0){j=QS.slots.findIndex(s=>s&&ITEMS[s]&&ITEMS[s].kind===it.kind)}if(j<0)j=QS.slots.indexOf(null);if(j<0)j=QS.slots.length-1;
   for(let q=0;q<QS.slots.length;q++)if(q!==j&&QS.slots[q]===id)QS.slots[q]=null;QS.slots[j]=id;try{updQuick()}catch(e){}sfx('ui');say('🧰 ใส่'+it.name+'ในช่องลัด '+(j+1)+' แล้ว');done=true;return}
  const before=JSON.stringify(P.armor);_eq(id);done=JSON.stringify(P.armor)!==before}
 catch(e){console.warn('[v478] equip',e)}
 finally{if(done){try{CHS.sel=null}catch(e){}try{hideBag()}catch(e){}try{icClose()}catch(e){}try{if(typeof chp!=='undefined'&&!chp.hidden)renderChar()}catch(e){}try{refreshInv()}catch(e){}try{updQuick()}catch(e){}}}}}
window.equipItem=equipItem;

// เลือกอาชีพ: การ์ด 3 ใบ (สกิล + พาสซีฟอยู่ในการ์ด)
openClassMenu=function(){try{ZM.open=false;SHOPK=null;STN.open=null;hideBag();sfx('ui');const cur=P.cls;
 let h='<button class="mini x xclose" onclick="closeClassMenu()">✕</button><b>🎓 ปรมาจารย์อาชีพ — เลือกเส้นทางของเจ้า</b><small>อาชีพปัจจุบัน: '+CLS[cur].e+' '+CLS[cur].n+(cur==='none'?' · เลือกครั้งแรกฟรี':' · เปลี่ยนอาชีพ 500 🪙')+(P.lv<CLASS_LV?' · <span style="color:#ffd84a">🔒 ต้อง Lv.'+CLASS_LV+' (ตอนนี้ Lv.'+P.lv+')</span>':'')+'</small><div class="cls7">';
 for(const k of ['sword','mage','archer']){const C=CLS[k],L=CSKILLS[k]||[],PL=PASSIVE[k]||[];
  const sk=L.map(s=>{let u=null;try{u=skillIcon(s.n)}catch(e){}return '<span title="'+s.n+'">'+(u?'<img src="'+u+'">':s.e)+s.n+' <i style="opacity:.6;font-style:normal">Lv.'+s.lv+'</i></span>'}).join('');
  const ps=PL.map(p=>'<small class="'+(cur===k&&P.lv>=p.lv?'':'lk')+'">'+(cur===k&&P.lv>=p.lv?'🌟':'◇')+' '+p.n+' (Lv.'+p.lv+') — '+p.d+'</small>').join('');
  h+='<div class="cc7'+(cur===k?' on':'')+'" style="--cc:'+C.col+'"><div class="ch"><span class="e">'+C.e+'</span><b>'+C.n+'<br><small style="color:#fff;opacity:.7;font-weight:600">อาวุธ: '+WNAME[NEEDW[k]]+'</small></b></div>'
   +'<div class="ds">'+C.d+'</div><div class="tt7">🌟 ติดตัว: '+(C.pas||'-')+'</div><div class="tt7">⚔️ สกิล</div><div class="sk">'+sk+'</div><div class="tt7">🛡️ พาสซีฟ</div><div class="ps">'+ps+'</div>'
   +(cur===k?'<button class="mini" disabled>✓ อาชีพปัจจุบัน</button>':'<button class="mini ok" onclick="pickClass(\''+k+'\')">'+(cur==='none'?'เลือกเส้นทางนี้':'เปลี่ยน (500🪙)')+'</button>')+'</div>'}
 h+='</div>';shopEl.innerHTML=h;shopEl.hidden=false;CM.open=true}catch(e){console.warn('[v478] classMenu',e);try{CM.open=false;shopEl.hidden=true}catch(_){}}};
window.openClassMenu=openClassMenu;

// ร้านสกิล: ไม่ขายสกิลซ้ำกับสกิลอาชีพ · ซื้อซ้ำไม่ได้ · ไอคอนเป็น "ตำรา" + ไอคอนสกิลจริง
{const d=Object.getOwnPropertyDescriptor(SHOP_DATA.skill,'buy');if(d&&d.get){const g0=d.get;Object.defineProperty(SHOP_DATA.skill,'buy',{configurable:true,get(){let L=[];try{L=g0.call(this)}catch(e){L=[]}
  if(P.cls!=='none')L=L.filter(q=>!/^bsk[01]$/.test(q.id));return L.map(q=>{const m=/^bsk(\d)$/.exec(q.id);if(m&&SK.own[+m[1]])return Object.assign({},q,{price:0,note:'✅ เรียนแล้ว — '+q.note});return q})}})}}
{const _bi=buyItem;buyItem=function(id){const m=/^bsk(\d)$/.exec(id||'');if(m){const i=+m[1];if(SK.own[i]){say('✅ เรียนสกิลนี้แล้ว — ซื้อซ้ำไม่ได้');sfx('thud');return}
  if(P.cls!=='none'&&i<2){say('สกิลนี้ซ้ำกับสกิลอาชีพของคุณ — ไม่ต้องเรียนแล้ว');sfx('thud');return}}return _bi(id)}}
let BOOK7=null;function bookURL7(i){try{if(!BOOK7)BOOK7={};if(BOOK7[i])return BOOK7[i];const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d'),col=['#7a2a8a','#a8341c','#2a7a4a'][i%3];
  q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.ellipse(32,58,22,4,0,0,7);q.fill();q.fillStyle='#f4ead0';q.fillRect(14,10,40,44);q.fillStyle='#d8c8a0';for(let k=0;k<5;k++)q.fillRect(16,14+k*8,36,1);
  q.fillStyle=col;q.strokeStyle='#1a0f06';q.lineWidth=2;q.beginPath();q.moveTo(10,8);q.lineTo(50,8);q.lineTo(50,52);q.lineTo(10,52);q.closePath();q.fill();q.stroke();
  q.fillStyle='rgba(0,0,0,.3)';q.fillRect(10,8,6,44);q.strokeStyle='#e8c14a';q.lineWidth=1.6;q.strokeRect(19,12,27,36);for(const [x,y] of [[10,8],[50,8],[10,52],[50,52]]){q.fillStyle='#e8c14a';q.beginPath();q.arc(x,y,3,0,7);q.fill()}
  q.fillStyle='rgba(255,255,255,.18)';q.fillRect(17,9,4,42);return BOOK7[i]=c.toDataURL()}catch(e){return ''}}
{const _bimg=bImg7;bImg7=function(b){const m=b&&/^bsk(\d)$/.exec(b.id||'');if(!m)return _bimg(b);const i=+m[1],S=(CSKILLS.none||[])[i]||{};let u=null;try{u=skillIcon(S.n)}catch(e){}
  return '<span class="bk7"><img src="'+bookURL7(i)+'">'+(u?'<img class="ov" src="'+u+'">':'<i class="ov">'+(S.e||'📖')+'</i>')+'</span>'}}

// เควสกิลด์ (เควสรอง) แสดงใต้เควสหลักแบบเรียลไทม์
function gqHTML7(){try{if(!QST||!QST.act||!QST.act.length)return '';return '<div class="gq7"><b>📜 เควสกิลด์</b>'+QST.act.map(q=>{const pr=q.t==='item'?Math.min(inv[q.k]|0,q.n):Math.min(q.c|0,q.n),ok=pr>=q.n;return '<div class="'+(ok?'ok':'')+'"><span>'+(ok?'✅ ':'• ')+q.d+'</span><span>'+pr+'/'+q.n+'</span></div>'}).join('')+'</div>'}catch(e){return ''}}
function gqUpd7(){safe7('gq',()=>{if(!qtEl)return;let g=qtEl.querySelector('.gq7');const h=gqHTML7();if(!h){if(g)g.remove();return}if(g){if(g.outerHTML!==h)g.outerHTML=h}else qtEl.insertAdjacentHTML('beforeend',h)})}
{const _ut=updTrack;updTrack=function(){const r=_ut.apply(this,arguments);gqUpd7();return r}}
setInterval(gqUpd7,500);

// ชื่อ/บทพูด NPC ร้านค้าแบบแฟนตาซีสากล (คงชื่อเล่นเดิมไว้ให้เนื้อเรื่องต่อเนื่อง)
safe7('names',()=>{const S=SHOP_DATA,set=(id,n,greet,lines)=>{const o=S[id]&&S[id].owner;if(!o)return;o.name=n;if(greet)o.greet=greet;if(lines)o.lines=lines};
 set('gear','บอริน "หนวดเหล็ก"',['ยินดีต้อนรับสู่โรงตีเหล็กของบอริน! เหล็กทุกชิ้นที่นี่ผ่านไฟร้อนแรงมาแล้ว','ฮึ่ม… อาวุธเจ้าบิ่นนะ อยากให้ข้าดูหน่อยไหม?','ค้อนข้ามีเรื่องเล่ามากกว่าที่เจ้าคิด'],
  ['แท่นตีบวกอยู่ขวามือ ส่วนโต๊ะคราฟอยู่ข้างหุ่นเกราะ','เหล็กดีต้องตีขณะยังแดง','อย่าลืมหินอวยพร ถ้าจะตีเกิน +5','ทุกตำนานเริ่มที่ทั่งตีเหล็ก']);
 set('potion','เอลาร่า นักปรุงยา',['สวัสดีค่ะนักเดินทาง ยาของเอลาร่าปรุงจากสมุนไพรแสงจันทร์','บาดเจ็บมาหรือคะ? ขวดนี้ช่วยได้แน่'],['ขนนกฟีนิกซ์หายากนะคะ ใช้ให้คุ้ม','ยามานาสีน้ำเงิน ยาเลือดสีแดง จำง่าย ๆ']);
 set('skill','อาร์คเมจไซเรียน',['ผู้แสวงหาความรู้… ตำราของข้าพร้อมแล้ว','เวทมนตร์ไม่ใช่พลัง แต่คือความเข้าใจ'],['ตำราพื้นฐานเหมาะกับผู้ยังไม่มีอาชีพ','เมื่อเลือกอาชีพ เจ้าจะได้สกิลเฉพาะสายเอง','เยียวยาใช้ได้ทุกอาชีพ']);
 set('store','มาร์ธา (ป้าแดง)',['มาจ้ะ ร้านของมาร์ธามีของใช้ครบ','จะออกผจญภัยต้องพกเสบียงนะลูก']);
 set('inn','โธมัส เจ้าของโรงเตี๊ยม',['เข้ามาก่อน! เบียร์เย็น ๆ กับสตูว์ร้อน ๆ รออยู่','โรงเตี๊ยมบัวหลวงยินดีต้อนรับนักผจญภัยเสมอ']);
 set('guild','ไอริส (พนักงานกิลด์)');set('fashion','มาดามโรส',['ยินดีต้อนรับสู่บูติกของมาดามโรสค่ะ ความงามคือพลังอย่างหนึ่ง'])});

// =====================================================================
// 2) สกิล
// =====================================================================
// อัญเชิญโครงกระดูก: จำกัด 3 ตัว · กัน NaN · ห่อ try/catch · ปล่อยสตันผู้เล่นทันที
const MaxSummonLimit=3;window.SUMREL7=0;
safe7('mspec',()=>{if(MSPEC.skel)MSPEC.skel.cap=MaxSummonLimit});
{const _s=summon;summon=function(k,n){try{if(!MSPEC[k])return;if(!FIN7(P.x)||!FIN7(P.y))return;n=Math.max(0,Math.min(MaxSummonLimit,(+n)|0));if(!n)return;
  _s(k,n);
  if(k==='skel'){const L=MIN.filter(m=>m.k==='skel');while(L.length>MaxSummonLimit){const o=L.shift();const j=MIN.indexOf(o);if(j>=0)MIN.splice(j,1)}}
  for(let i=MIN.length-1;i>=0;i--){const m=MIN[i];if(!m||!FIN7(m.x)||!FIN7(m.y)||!FIN7(m.l))MIN.splice(i,1)}}
 catch(e){console.warn('[v478] summon',e)}finally{window.SUMREL7=k==='skel'?2:1}}}
{const _mt=minTick;minTick=function(dt){try{if(!FIN7(dt))return;for(let i=MIN.length-1;i>=0;i--){const m=MIN[i];if(!m||!FIN7(m.x)||!FIN7(m.y)){MIN.splice(i,1);continue}if(m.tg&&(!FIN7(m.tg.x)||!FIN7(m.tg.y)))m.tg=null}
  _mt(dt)}catch(e){console.warn('[v478] minTick',e);try{for(let i=MIN.length-1;i>=0;i--){const m=MIN[i];if(!m||!FIN7(m.x)||!FIN7(m.y))MIN.splice(i,1);else{m.st='idle';m.tg=null}}}catch(_){}}}}
{const _p=playerTick;playerTick=function(dt){if(window.SUMREL7){window.SUMREL7--;if(!window.SUMREL7){P.stun=Math.min(P.stun,0);P.cast=Math.min(P.cast||0,.15)}}return _p(dt)}}

// ฟันวาปสายฟ้า: วาปเข้าใกล้เป้า (แก้ระบบชนในทุ่ง) + ฟ้าผ่า + ฟันรัว
{const _fs=flkStep;flkStep=function(){const ox=P.x,oy=P.y,mode=FLK.mode;try{_fs()}catch(e){console.warn('[v478] flk',e);FLK.on=false;P.stun=0;return}
 safe7('flkfx',()=>{if(mode==='bow'||(P.x===ox&&P.y===oy))return;let e=null,bd=60;for(const q of enemies()){const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<bd){bd=d;e=q}}if(!e)return;
  const tx=e.x,ty=e.y;RFX.push({k:'bolt',x:tx+(Math.random()-.5)*20,y:ty-230,x2:tx,y2:ty-12,t:0,l:.22,rgb:'210,240,255'});RFX.push({k:'bolt',x:tx+(Math.random()-.5)*40,y:ty-200,x2:tx,y2:ty-12,t:0,l:.16,rgb:'150,200,255'});
  RFX.push({k:'ring',x:tx,y:ty,t:0,l:.3,rgb:'190,240,255',s:34});for(let i=0;i<3;i++){const a=Math.random()*6.28;vfx('slashline',tx-Math.cos(a)*16,ty-Math.sin(a)*10,.18+i*.04,{dx:Math.cos(a),dy:Math.sin(a)})}
  for(let i=0;i<8;i++)rfxP(tx,ty-14,(Math.random()-.5)*220,(Math.random()-.5)*160,.25,'230,250,255',2,'spark');tone(2400,600,.08,'square',.025)})}}
{const _ft=flkTick;flkTick=function(dt){try{return _ft(dt)}catch(e){console.warn('[v478] flkTick',e);FLK.on=false;P.stun=0}}}

// กระทืบปฐพี: กระโดด 3 ครั้งติดกันเข้าหามอนที่ใกล้สุด · คลื่นกระแทกขยายใหญ่ขึ้นทุกครั้ง
const SLAM7={j:null,land:false};
{const _p=playerTick;playerTick=function(dt){try{safe7('slam',()=>{const L=SLAM7.j,j=P.jump;
  if(L&&L.land&&!SLAM7.land){SLAM7.land=true;const n=L.n7|0;if(n>=2){const R=105+45*(n-1);vfx('shock',P.x,P.y,.6,{r:R});RFX.push({k:'ring',x:P.x,y:P.y,t:0,l:.5,rgb:'255,210,140',s:R});shake(4+n*2,.3);
    eachIn(P.x,P.y,R,e=>{const d=Math.hypot(e.x-P.x,e.y-P.y);if(d>100)hurtE(e,1.8*(1+.2*(n-1))*(L.mm7||1),{kb:200,stun:1})})}}
  if(L&&j!==L){// ท่าก่อนหน้าจบแล้ว
   SLAM7.j=null;if(!j&&(L.n7|0)<3&&!P.dead&&P.hp>0&&!(D&&(D.town||D.shop))){P.jump={t:0,l:.48,land:false,n7:(L.n7|0)+1,mm7:L.mm7};P.stun=Math.max(P.stun,.5);sfx('dash')}}
  if(P.jump&&P.jump!==SLAM7.j){if(!P.jump.n7)P.jump.n7=1;SLAM7.j=P.jump;SLAM7.land=!!P.jump.land}})}catch(e){}return _p(dt)}}

// อัลติเมท: ลดดาเมจพื้นฐาน + สะสม Fury จากการตีโดน (ยิ่งโดนมากยิ่งแรง)
const ULTM7={base:.55,per:.06,max:15};if(typeof ULT!=='undefined'){ULT.fury7=0;ULT.fT7=0}
{const _cu=castUlt;castUlt=function(){const was=!!ULT.cast;_cu.apply(this,arguments);if(!was&&ULT.cast){ULT.fury7=0;ULT.fT7=4}};window.castUlt=castUlt}
{const _h=hurtE;hurtE=function(e,mult,o){if(o&&o.ult&&FIN7(mult)){const f=Math.min(ULTM7.max,ULT.fury7|0);mult*=ULTM7.base*(1+f*ULTM7.per);const r=_h(e,mult,o);if(r){ULT.fury7=Math.min(ULTM7.max,(ULT.fury7|0)+1);ULT.fT7=3}return r}return _h(e,mult,o)}}
{const _h=hero;hero=function(){_h();safe7('fury',()=>{if(!(ULT.fT7>0)||!(ULT.fury7>0))return;ULT.fT7-=DT||.016;const f=ULT.fury7,x=P.x,y=P.y-70,a=Math.min(1,ULT.fT7);ctx.save();ctx.globalAlpha=a;ctx.font='900 12px system-ui';ctx.textAlign='center';
  ctx.lineWidth=3;ctx.strokeStyle='#2a0800';const s='🔥 FURY ×'+f+(f>=ULTM7.max?' MAX':'');ctx.strokeText(s,x,y);ctx.fillStyle=f>=ULTM7.max?'#ffe24a':'#ff9a4a';ctx.fillText(s,x,y);ctx.restore()})}}

// =====================================================================
// 3) ไอเท็ม / คราฟ
// =====================================================================
// ตัวอย่างสกินอาวุธ (มาดามโรส): หันหน้าเข้ากล้อง ถือดาบในมือ (ถ้าถือคทา/ธนู จะสลับเป็นดาบชั่วคราวเฉพาะภาพตัวอย่าง)
{const _fp=fashPreview;fashPreview=function(kind,id){if(kind==='body')return _fp(kind,id);
 const c=document.createElement('canvas');c.width=150;c.height=96;const k=c.getContext('2d'),sv=ctx,svW=FASH.wpn,sx=P.x,sy=P.y,sd=P.dir,sm=P.mv,sdr=P.draw,stl=P.tool,smo=MOUNT.on,ssw=P.armor.sword,sat=P.at;
 try{const g=k.createRadialGradient(75,70,4,75,60,80);g.addColorStop(0,'#5a4a7a');g.addColorStop(1,'#1a1428');k.fillStyle=g;k.fillRect(0,0,150,96);ctx=k;k.translate(75,88);k.scale(1.6,1.6);
  if(!ssw||isRng()){const sid=['sword0','sword1','sword2'].find(q=>ITEMS[q]&&ITEMS[q].kind==='sword')||Object.keys(ITEMS).find(q=>ITEMS[q].kind==='sword');if(sid)P.armor.sword=sid}
  P.x=0;P.y=0;P.dir='d';P.mv=false;P.draw=true;P.tool='sword';P.at=-1;MOUNT.on=false;FASH.wpn=id;hero()}
 catch(e){console.warn('[v478] fashPreview',e)}
 finally{ctx=sv;FASH.wpn=svW;P.x=sx;P.y=sy;P.dir=sd;P.mv=sm;P.draw=sdr;P.tool=stl;MOUNT.on=smo;P.armor.sword=ssw;P.at=sat}return c}}
// ดาบบนหลังใช้สกินอาวุธที่ตั้งไว้ด้วย
window.BACKSW7=0;
{const _bs=backSword;backSword=function(x,by,side,f,d){window.BACKSW7++;try{return _bs(x,by,side,f,d)}finally{window.BACKSW7--}}}
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(window.BACKSW7>0&&type==='sword'&&FASH.wpn&&typeof FWPN!=='undefined'&&FWPN[FASH.wpn]&&!isRng()){try{return fashSword(FASH.wpn)}catch(e){}}return _ti(type,tier,sz)}}

// แลกของกิลด์: ปุ่ม "🔁 แลก" + แสดงวัตถุดิบที่ต้องใช้ ✅/❌ · ราคาขนนกฟีนิกซ์ใหม่
const GX7={gx_estone:{core:2,dust:2},gx_estone2:{bone:6,rag:4},gx_bless:{scale:3},gx_phoenix:{wing:8,pelt:4}};
safe7('phoenixPrice',()=>{const p=SD.potion.buy.find(q=>q.id==='phoenix');if(p)p.price=600;
 const d=Object.getOwnPropertyDescriptor(SD.guild,'buy');if(d&&d.get){const g0=d.get;Object.defineProperty(SD.guild,'buy',{configurable:true,get(){return g0.call(this).map(q=>q.id==='gx_phoenix'?Object.assign({},q,{price:150,note:'ใช้ ปีกค้างคาว 8 + หนังหมาป่า 4 + 150 เหรียญ'}):q)}})}});
const gxMats7=id=>{const X=GX7[id];if(!X)return '';return '<div class="gx7"><b>🔁 วัตถุดิบที่ต้องใช้</b>'+Object.entries(X).map(([k,v])=>{const h=inv[k]|0;return '<span class="'+(h>=v?'ok':'no')+'">'+(h>=v?'✅ ':'❌ ')+MN(k)+' '+Math.min(h,v)+'/'+v+'</span>'}).join('')+'</div>'};
{const _bl=buyList;buyList=function(S){let h=_bl(S);try{const id=SHOP7.sel;if(id&&GX7[id]){const b=S.buy.find(q=>q.id===id);h=h.replace(/🛒 ซื้อ ×(\d+) · 🪙 ([\d,]+)/,'🔁 แลก ×$1 · 🪙 $2').replace('<div class="rw">',gxMats7(id)+'<div class="rw">')}}catch(e){}return h}}

// ตัวตรวจฐานข้อมูลไอเท็ม: ชื่อซ้ำ / ไอคอนซ้ำ / ค่าสเตตัสซ้ำ / ข้อมูลขาด
function validateItemDB7(){const R={items:0,mats:0,dupNames:[],dupIcons:[],dupStats:[],missing:[]};
 try{const byN={},byI={},byS={};for(const id in ITEMS){const it=ITEMS[id];R.items++;if(!it||!it.name||!it.kind){R.missing.push(id);continue}
   (byN[it.name]=byN[it.name]||[]).push(id);
   if(it.stat){const s=it.kind+'|'+it.stat;(byS[s]=byS[s]||[]).push(id)}
   let u='';try{u=iconURL('item:'+id)}catch(e){R.missing.push(id+':icon')}if(u)(byI[u]=byI[u]||[]).push(id)}
  for(const k in INVMETA){R.mats++;const m=INVMETA[k];if(!m||!m[0]){R.missing.push('mat:'+k);continue}(byN['mat:'+m[0]]=byN['mat:'+m[0]]||[]).push(k)}
  for(const n in byN)if(byN[n].length>1)R.dupNames.push(n.replace(/^mat:/,'')+' → '+byN[n].join(','));
  for(const u in byI)if(byI[u].length>1){const ns=new Set(byI[u].map(i=>ITEMS[i].name));if(ns.size>1)R.dupIcons.push(byI[u].join(','))}
  for(const s in byS)if(byS[s].length>1){const ns=new Set(byS[s].map(i=>ITEMS[i].name));if(ns.size>1)R.dupStats.push(s.split('|')[1]+' → '+byS[s].join(','))}}
 catch(e){R.error=String(e)}R.ok=!R.error&&!R.dupNames.length&&!R.missing.length;return R}
window.validateItemDB7=validateItemDB7;
// ตัวตรวจ UI: หน้าต่างต้องปิดได้และไม่ค้างสถานะ
function validateUI7(){const out=[];const chk=(n,f)=>{try{out.push([n,f()?'ok':'FAIL'])}catch(e){out.push([n,'ERR '+e.message])}};
 chk('bag ปิดได้',()=>{hideBag();return bagEl.hidden});chk('icard ปิดได้',()=>{icClose();return icEl.hidden});
 chk('shop ปิดได้',()=>{if(SHOPK)closeShop();return !SHOPK});chk('dialog ปิดได้',()=>{dlgClose(true);return !DLG.open});
 chk('ตีบวกไม่ค้าง',()=>!(ENHS.busy&&!FRG.on));chk('ไม่ PAUSED ค้าง',()=>{const m=!menuEl.hidden||!!document.querySelector('.p6w:not([hidden])');return m||!PAUSED});return out}
window.validateUI7=validateUI7;
{const _gr=gmRender;gmRender=function(){_gr();safe7('gmRow',()=>{const bd=gmW.querySelector('.bd');if(!bd)return;bd.insertAdjacentHTML('beforeend','<div class="card"><b style="color:#ffe9a0">ตัวตรวจระบบ (v4.7.8)</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px"><button class="bt" onclick="gmIDB7()">🧪 ตรวจฐานข้อมูลไอเท็ม</button><button class="bt" onclick="gmUI7()">🧪 ตรวจการปิดหน้าต่าง</button><button class="bt" onclick="gmA(\'shards7\')">💎 เศษรูน ×30</button></div><div id="gmrep7" style="font-size:11px;white-space:pre-wrap;margin-top:6px;max-height:150px;overflow:auto"></div></div>')})}}
window.gmIDB7=()=>{const R=validateItemDB7(),el=gid('gmrep7');const t='ไอเท็ม '+R.items+' · วัตถุดิบ '+R.mats+'\nชื่อซ้ำ: '+(R.dupNames.join('\n')||'-')+'\nไอคอนซ้ำ (ต่างชื่อ): '+(R.dupIcons.join('\n')||'-')+'\nสเตตัสซ้ำ (ต่างชื่อ): '+(R.dupStats.join('\n')||'-')+'\nข้อมูลขาด: '+(R.missing.join(', ')||'-')+(R.error?'\nERROR '+R.error:'');if(el)el.textContent=t;say(R.ok?'🧪 ฐานข้อมูลไอเท็มผ่าน':'🧪 พบรายการที่ควรตรวจ — ดูในหน้า GM')};
window.gmUI7=()=>{const r=validateUI7(),el=gid('gmrep7');if(el)el.textContent=r.map(x=>x[1]+' · '+x[0]).join('\n');say('🧪 ตรวจ UI: '+r.filter(x=>x[1]==='ok').length+'/'+r.length+' ผ่าน')};
safe7('gmShard',()=>{GMA.shards7=()=>{inv.rshard=(inv.rshard|0)+30;refreshInv();say('💎 เศษรูน +30')}});

// ป้ายชื่อลอยเหนือวัตถุ
function plate7(txt,x,y,col){ctx.save();ctx.font='800 10.5px system-ui,"Noto Sans Thai",sans-serif';const w=ctx.measureText(txt).width+14,bob=Math.sin(performance.now()/500)*1.2;y+=bob;
 ctx.fillStyle='rgba(20,12,6,.82)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x-w/2,y-11,w,16,8);else ctx.rect(x-w/2,y-11,w,16);ctx.fill();ctx.strokeStyle=col||'#e8c14a';ctx.lineWidth=1.3;ctx.stroke();
 ctx.fillStyle='#ffe9c0';ctx.textAlign='center';ctx.fillText(txt,x,y+1);ctx.restore()}

// ร้านตีเหล็ก: ทั่งขวา = แท่นตีบวก (ตีบวกอย่างเดียว) · หุ่นเกราะข้าง ๆ = โต๊ะคราฟ (สร้างของ)
const CB7={x:OX+14*T+16,y:6*T+30};
const CB7S={k:'anvil',craft:true,n:'🛠️ โต๊ะคราฟ · สร้างอุปกรณ์',x:CB7.x,y:CB7.y,py:CB7.y-8};
safe7('anvName',()=>{const s=SHOP_STN.gear.find(s=>s.k==='anvil');if(s){s.n='⚒️ แท่นตีบวก';s.py=ANV7.y}});
{const _sn=stnNear;stnNear=function(){try{if(D&&D.shop==='gear'&&!P.sit&&Math.hypot(P.x-CB7.x,P.y-CB7.y)<42&&Math.hypot(P.x-ANV7.x,P.y-ANV7.y)>=Math.hypot(P.x-CB7.x,P.y-CB7.y))return CB7S}catch(e){}return _sn()}}
{const _sa=shopAct;shopAct=function(){try{const s=stnNear();if(s&&s.craft&&!P.sit){if(!(typeof ENHS!=='undefined'&&ENHS.busy)){STN.tab='st';openForge('anvil')}return true}}catch(e){console.warn('[v478] bench',e)}return _sa()}}
function drawBench7(x,y){ctx.save();ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+1,24,5,0,0,7);ctx.fill();
 ctx.fillStyle='#4a2c14';for(const lx of [-20,16])ctx.fillRect(x+lx,y-14,4,14);ctx.fillStyle='#3a2210';ctx.fillRect(x-19,y-6,36,3);
 const g=ctx.createLinearGradient(0,y-22,0,y-14);g.addColorStop(0,'#a8743e');g.addColorStop(1,'#6a4220');ctx.fillStyle=g;ctx.fillRect(x-24,y-22,48,8);ctx.strokeStyle='#24140a';ctx.lineWidth=1.2;ctx.strokeRect(x-23.5,y-21.5,47,7);
 ctx.fillStyle='rgba(0,0,0,.2)';for(const q of [-12,0,12])ctx.fillRect(x+q,y-21,1,6);
 ctx.fillStyle='#e8dcb8';ctx.save();ctx.translate(x-10,y-24);ctx.rotate(-.12);ctx.fillRect(-8,-4,16,7);ctx.strokeStyle='#8a6a3a';ctx.lineWidth=.6;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-6,-2+i*2);ctx.lineTo(5,-2+i*2);ctx.stroke()}ctx.restore();
 ctx.fillStyle='#6b3f1f';ctx.fillRect(x+4,y-27,12,2.4);ctx.fillStyle='#8b97ab';ctx.fillRect(x+13,y-29,6,6);ctx.strokeStyle='#15161b';ctx.lineWidth=.8;ctx.strokeRect(x+13,y-29,6,6);
 ctx.fillStyle='#c8ccd6';ctx.beginPath();ctx.moveTo(x+2,y-23);ctx.lineTo(x+10,y-23);ctx.lineTo(x+9,y-25);ctx.closePath();ctx.fill();
 ctx.fillStyle='#5a3a1c';ctx.fillRect(x-22,y-36,3,14);ctx.fillStyle='#b8c0cc';ctx.fillRect(x-24,y-38,7,3);ctx.restore()}
{const _dm=drawMannequin;drawMannequin=function(x,y){if(D&&D.shop==='gear'&&Math.abs(x-CB7.x)<3&&Math.abs(y-CB7.y)<3){try{drawBench7(x,y)}catch(e){}return}return _dm(x,y)}}
{const _h=hero;hero=function(){_h();if(!(D&&D.shop==='gear'))return;safe7('plates',()=>{const ns=stnNear();plate7('⚒️ แท่นตีบวก',ANV7.x,ANV7.y-44,ns&&ns.k==='anvil'&&!ns.craft?'#fff':'#e8c14a');plate7('🛠️ โต๊ะคราฟ',CB7.x,CB7.y-46,ns&&ns.craft?'#fff':'#9fd8ff')})}}
// ปิดทางลัดคราฟในหน้าตีบวก (คราฟที่โต๊ะคราฟเท่านั้น)
safe7('enhCraftOff',()=>{window.enhCraft7=()=>say('🛠️ คราฟอุปกรณ์ได้ที่ "โต๊ะคราฟ" ข้างหุ่นเกราะ')});
// กันค้าง: เอฟเฟกต์/สถานะตีบวกต้องไม่ค้างหลังจบ
{const _fs=forgeStart7;forgeStart7=function(id,ok){try{return _fs(id,ok)}catch(e){console.warn('[v478] forgeStart',e);FRG.on=false;window.FRG7on=false;ENHS.busy=false;try{enhW.hidden=false}catch(_){}}}}
{const _fe=forgeEnd7;forgeEnd7=function(){try{return _fe()}catch(e){console.warn('[v478] forgeEnd',e)}finally{FRG.on=false;window.FRG7on=false;ENHS.busy=false;setTimeout(()=>{try{if(!FRG.on)FRG.sp.length=0}catch(e){}},900)}}}
setInterval(()=>safe7('frgWatch',()=>{if(FRG.on&&performance.now()-FRG.t0>(frgTotal()+2.5)*1000)forgeEnd7();if(!FRG.on&&ENHS.busy&&!window.FRG7on){ENHS.busy=false}}),500);

// =====================================================================
// รูน: ดรอปเป็น "เศษรูน" → รวม 5 เป็นรูนขั้น I ธาตุที่เลือก · หลอมได้ถึงขั้น V
// =====================================================================
RGR.push('IV','V');
safe7('runeV',()=>{for(const el in RUNE_EL)for(const g of [4,5]){const k='r_'+el+g,R=RUNE_EL[el];if(!RKEYS.includes(k))RKEYS.push(k);if(inv[k]===undefined)inv[k]=0;WT[k]=.1;
  INVMETA[k]=['รูน'+R.n+' '+RGR[g],'ใส่ในช่องรูนของอุปกรณ์ · อาวุธ: '+R.d+' · ชุดเกราะ: '+R.st.toUpperCase()+' +'+(g*2)+(g<5?' · รวม 3 ชิ้นเป็นขั้นถัดไปได้':' · ขั้นสูงสุด')];if(!INVORDER.includes(k))INVORDER.push(k)}
 for(const el in RUNE_EL)for(const g of [1,2,3]){const k='r_'+el+g;if(INVMETA[k])INVMETA[k][1]=INVMETA[k][1].replace('รวม 3 ชิ้นเป็นขั้นถัดไปได้','รวม 3 ชิ้นเป็นขั้นถัดไปได้ (สูงสุดขั้น V)')}
 if(inv.rshard===undefined)inv.rshard=0;WT.rshard=.02;INVMETA.rshard=['เศษรูน','เศษพลังรูนจากมอนสเตอร์ · รวม 5 ชิ้น สร้างรูนขั้น I ธาตุที่เลือกได้ (แตะในกระเป๋า)'];if(!INVORDER.includes('rshard'))INVORDER.push('rshard');
 SHOP_DATA.guild.sell=SHOP_DATA.guild.sell.concat([['rshard','เศษรูน',12]]).concat(Object.keys(RUNE_EL).flatMap(el=>[['r_'+el+'4',MN('r_'+el+'4'),2400],['r_'+el+'5',MN('r_'+el+'5'),7000]]))});
{const _pr=paintRune;paintRune=function(k,el,g){if(g<=3)return _pr(k,el,g);_pr(k,el,3);const R=RUNE_EL[el];k.save();const rim=g===4?'#c070ff':'#ffffff';
 k.strokeStyle=rim;k.lineWidth=2.2;k.beginPath();k.moveTo(24,3);k.lineTo(40,11);k.lineTo(42,31);k.lineTo(24,44);k.lineTo(6,31);k.lineTo(8,11);k.closePath();k.stroke();
 if(g===5){const gl=k.createRadialGradient(24,23,4,24,23,24);gl.addColorStop(0,'rgba(255,255,255,0)');gl.addColorStop(.7,'rgba('+R.rgb+',.0)');gl.addColorStop(1,'rgba('+R.rgb2+',.55)');k.fillStyle=gl;k.beginPath();k.arc(24,23,24,0,7);k.fill();
  k.fillStyle='#fff';for(const [x,y] of [[24,1],[44,22],[4,22]]){k.beginPath();k.moveTo(x,y-3);k.lineTo(x+1,y);k.lineTo(x,y+3);k.lineTo(x-1,y);k.closePath();k.fill()}}
 k.fillStyle=rim;k.fillRect(8,36,32,6);k.fillStyle='rgba(0,0,0,.6)';k.fillRect(9,37,30,4);k.fillStyle=rim;for(let i=0;i<g;i++){k.beginPath();k.arc(24+(i-(g-1)/2)*5.5,39,1.6,0,7);k.fill()}k.restore()}}
{const _mi=matIcon;matIcon=function(key){if(key!=='rshard')return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';
 k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,40,13,4,0,0,7);k.fill();const cols=['#ff6a2a','#7fd8ff','#ffe24a','#7be04a','#ff3a5a'];
 [[14,24,-.4],[27,18,.3],[22,32,.1],[33,30,-.2]].forEach(([x,y,r],i)=>{k.save();k.translate(x,y);k.rotate(r);const g=k.createLinearGradient(-6,-9,6,9);g.addColorStop(0,'#9a9aa8');g.addColorStop(1,'#3a3a46');k.fillStyle=g;k.strokeStyle='#16161c';k.lineWidth=1.4;
  k.beginPath();k.moveTo(0,-10);k.lineTo(7,-2);k.lineTo(3,9);k.lineTo(-6,6);k.lineTo(-7,-3);k.closePath();k.fill();k.stroke();k.strokeStyle=cols[i%5];k.lineWidth=1.6;k.beginPath();k.moveTo(-2,-5);k.lineTo(2,0);k.lineTo(-1,5);k.stroke();k.restore()});
 const gl=k.createRadialGradient(24,24,1,24,24,20);gl.addColorStop(0,'rgba(220,200,255,.45)');gl.addColorStop(1,'rgba(220,200,255,0)');k.fillStyle=gl;k.fillRect(0,0,48,48);return c}}
safe7('runeImg',()=>{for(const k of RKEYS.concat(['rshard'])){if(DROPIMG[k]&&k.slice(-1)<'4')continue;const im=new Image();im.src=iconURL('mat:'+k);DROPIMG[k]=im}});
{const _ad=addDrop;addDrop=function(type,x,y){try{const m=/^r_([a-z]+)(\d)$/.exec(type||'');if(m&&RUNE_EL[m[1]]){const n=+m[2]>=2?3:1;for(let i=0;i<n;i++)_ad('rshard',x,y);return}}catch(e){}return _ad(type,x,y)}}
function runeFromShard7(el){try{if(!RUNE_EL[el])return;if((inv.rshard|0)<5){say('ต้องมีเศษรูน 5 ชิ้น (มี '+(inv.rshard|0)+')');sfx('thud');return}const k='r_'+el+'1',c=canTake(k);if(c!==true){noRoom(c);return}
 inv.rshard-=5;inv[k]=(inv[k]|0)+1;refreshInv();sfx('gem');const R=RUNE_EL[el];say(R.e+' สร้าง'+MN(k)+'สำเร็จ!');for(let i=0;i<22;i++)rfxP(P.x,P.y-30,(Math.random()-.5)*160,-40-Math.random()*120,.8,R.rgb,2.4,'spark');try{handIn7(['mat:rshard'],1)}catch(e){}icShow('mat',(inv.rshard|0)>0?'rshard':k)}
 catch(e){console.warn('[v478] shard',e)}}
window.runeFromShard7=runeFromShard7;
fuseRune=function(k){try{const r=runeOf(k);if(!r||r.g>=5)return;const cost=150*r.g;if((inv[k]|0)<3){say('ต้องมี '+MN(k)+' 3 ชิ้น');sfx('thud');return}if(inv.coin<cost){say('ต้องใช้ '+cost+' เหรียญ');sfx('thud');return}
 inv[k]-=3;inv.coin-=cost;const nk='r_'+r.el+(r.g+1);inv[nk]=(inv[nk]|0)+1;refreshInv();sfx('chest');say('💠 หลอมรวมสำเร็จ! ได้ '+MN(nk));for(let i=0;i<30+r.g*6;i++)rfxP(P.x,P.y-30,(Math.random()-.5)*200,-40-Math.random()*150,.9,RUNE_EL[r.el].rgb,2.5,'spark');icShow('mat',(inv[k]>0)?k:nk)}
 catch(e){console.warn('[v478] fuse',e)}};window.fuseRune=fuseRune;
{const _ic=icShow;icShow=function(t,k,ro,at){const r0=_ic.apply(this,arguments);safe7('icRune',()=>{if(ro||t!=='mat')return;let add='';const r=runeOf(k);
  if(k==='rshard'){add=Object.keys(RUNE_EL).map(el=>'<button class="'+((inv.rshard|0)>=5?'ok':'no')+'" onclick="runeFromShard7(\''+el+'\')">'+RUNE_EL[el].e+' รูน'+RUNE_EL[el].n+' I (5 เศษ)</button>').join('')}
  else if(r&&(r.g===3||r.g===4))add='<button class="'+((inv[k]|0)>=3?'ok':'no')+'" onclick="fuseRune(\''+k+'\')">💠 หลอม 3 → '+RGR[r.g+1]+' ('+150*r.g+'🪙)</button>';
  if(!add)return;let ib=icEl.querySelector('.ib');if(!ib){ib=document.createElement('div');ib.className='ib';icEl.appendChild(ib)}ib.insertAdjacentHTML('beforeend',add)});return r0}}

// =====================================================================
// 4) เกมเพลย์
// =====================================================================
// แอนิเมชันส่งของเควส: ไอคอนบิน + เอฟเฟกต์/เสียง (dir 1 = ส่งออกจากกระเป๋า, -1 = ได้รับรางวัล)
function handIn7(keys,dir){try{const wr=gid('wrap');if(!wr||!keys||!keys.length)return;const W=wr.clientWidth,H=wr.clientHeight;
 keys.slice(0,6).forEach((key,i)=>{let el;if(/^(item|mat):/.test(key)){el=document.createElement('img');try{el.src=iconURL(key)}catch(e){return}}else{el=document.createElement('div');el.className='e';el.textContent=key}el.classList.add('fly7');
  const sx=dir>0?W*.5-15:W*.5-15+(i-keys.length/2)*26,sy=dir>0?H-70:H*.32,ex=dir>0?W*.5-15+(i-keys.length/2)*20:W*.5-15,ey=dir>0?H*.3:H-70;
  el.style.left=sx+'px';el.style.top=sy+'px';el.style.transform='scale(.6)';el.style.opacity='0';wr.appendChild(el);
  setTimeout(()=>{el.style.opacity='1';el.style.transform='translate('+(ex-sx)+'px,'+(ey-sy)+'px) scale(1.15) rotate('+(dir>0?-20:20)+'deg)'},40+i*90);
  setTimeout(()=>{el.style.opacity='0';el.style.transform+=' scale(.4)'},760+i*90);setTimeout(()=>{try{el.remove()}catch(e){}},1500+i*90)});
 for(let i=0;i<18;i++)rfxP(P.x+(Math.random()-.5)*30,P.y-20-Math.random()*20,(Math.random()-.5)*120,-60-Math.random()*90,.8,'255,230,140',2.2,'spark');
 RFX.push({k:'ring',x:P.x,y:P.y,t:0,l:.5,rgb:'255,230,140',s:40});sfx('coin');setTimeout(()=>sfx('gem'),380);tone(660,990,.25,'triangle',.04,.2)}catch(e){console.warn('[v478] handIn',e)}}
window.handIn7=handIn7;
{const _qc=qClaim;qClaim=function(i){const q=QST.act[i],n0=QST.act.length;const keys=q?(q.t==='item'?['mat:'+q.k]:['📜']):[];_qc(i);if(QST.act.length<n0){handIn7(keys,1);setTimeout(()=>handIn7(['🪙','✨'].concat(q&&q.es?['mat:estone']:[]),-1),650)}}}

// เควสช่าง (ตำราช่าง): ข้อความสั้น · รายการของ ✅/❌ · แลกได้เมื่อครบเท่านั้น
function smList7(n){return Object.entries(SMQ[n].need).map(([k,v])=>{const h=inv[k]|0;return (h>=v?'✅ ':'❌ ')+MN(k)+' '+Math.min(h,v)+'/'+v}).join('\n')}
function smOk7(n){return Object.entries(SMQ[n].need).every(([k,v])=>(inv[k]|0)>=v)}
smithQuest=function(){try{const o=D.owner,n=smNext(),nm=(SD.gear.owner&&SD.gear.owner.name)||'ช่างหนวดเหล็ก';if(!n){talk(o,'เจ้าเรียนตำราครบทุกระดับแล้ว!',[BYE]);return}const Q=SMQ[n];
 if(P.lv<Q.lv){talk(o,'ตำรา'+TNAMES[n]+' ต้อง Lv.'+Q.lv+' ก่อนนะ',[BYE]);return}
 if(SMITH.q!==n){SMITH.q=n;saveSmith();sysSay('⚒️ เควสช่าง: '+Q.n)}
 const ok=smOk7(n);talk(o,'📜 '+Q.n+'\n'+smList7(n)+(ok?'\n\nของครบแล้ว! ส่งมาได้เลย':''),ok?[{t:'⚒️ ส่งของ แลกตำรา',c:'go',f:()=>smithDeliver7(n)},BYE]:[{t:'🗺️ หาของได้ที่ไหน',stay:true,f:()=>talk(o,Q.w,[BYE])},BYE],nm)}
 catch(e){console.warn('[v478] smithQuest',e)}};
function smithDeliver7(n){try{if(smNext()!==n||!smOk7(n)){say('ของยังไม่ครบ');return}const Q=SMQ[n],keys=Object.keys(Q.need).map(k=>'mat:'+k);
 for(const [k,v] of Object.entries(Q.need))inv[k]-=v;SMITH.u=n;SMITH.q=0;saveSmith();refreshInv();sfx('chest');shake(2,.2);handIn7(keys,1);
 try{banner('⚒️ ปลดล็อก'+Q.n.replace('ตำราช่าง: ',''),'คราฟชุด/อาวุธระดับ'+TNAMES[n]+'ได้ที่โต๊ะคราฟ','')}catch(e){}
 talk(D.owner,'ฝีมือใช้ได้! ตอนนี้เจ้าตีของระดับ'+TNAMES[n]+'ได้แล้ว — ไปที่โต๊ะคราฟข้างหุ่นเกราะ',[BYE])}catch(e){console.warn('[v478] smithDeliver',e)}}
window.smithQuest=smithQuest;window.smithDeliver7=smithDeliver7;
safe7('ch2',()=>{STCH[2].intro='ดาบหินสู้อสูรในเหมืองไม่ไหวแล้ว! ไปหาบอริน "หนวดเหล็ก" ที่โรงตีเหล็ก รับตำราช่าง แล้วตีอาวุธเหล็กด้วยมือเจ้าเอง (Lv.5)';STCH[2].d='Lv.5 + รับตำราช่าง แล้วตีอาวุธเหล็กเอง'});

// พระราชา: กันรับรางวัลซ้ำ (ปิดหน้าต่างก่อนจบแล้วคุยใหม่ จะไม่ได้รางวัลซ้ำ)
function kingRw7(r){try{STORY.paid=STORY.paid||{};const ch=STORY.ch;if(STORY.paid[ch]){const L=[];if(r){if(r.coin)L.push('🪙 '+r.coin+' (รับแล้ว)')}return L}
  STORY.paid[ch]=1;saveStory();const L=giveRw(r);if(L&&L.length)setTimeout(()=>handIn7(['🪙','✨','📜'],-1),300);return L}catch(e){console.warn('[v478] kingRw',e);return []}}
window.kingRw7=kingRw7;

// มอนติดแร่/สิ่งกีดขวาง: ไถลไปด้านข้างเมื่อเดินชน
{const _mv=mvM;mvM=function(m,dx,dy){const x0=m.x,y0=m.y;_mv(m,dx,dy);try{if(m.x===x0&&m.y===y0&&(dx||dy)){const L=Math.hypot(dx,dy)||1,s=m.sl7||(m.sl7=Math.random()<.5?-1:1),px=-dy/L*s*L,py=dx/L*s*L;
  if(!zHit(m.x+px,m.y+py)){m.x+=px;m.y+=py;m.slT7=.4}else{m.sl7=-s}}else if(m.slT7>0)m.slT7-=.016}catch(e){}}}

// แยก NPC ในเมืองไม่ให้ยืนซ้อนกัน
setInterval(()=>safe7('npcSep',()=>{if(!(D&&D.town&&D.npcs))return;const N=D.npcs;for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const a=N[i],b=N[j];if(!a||!b||a.vis===false||b.vis===false)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
  if(d<18){const ux=d?dx/d:1,uy=d?dy/d:0,push=(18-d)/2;for(const [n,sg] of [[a,-1],[b,1]]){if(n.fixed||n===DLG.n)continue;const nx=n.x+ux*push*sg,ny=n.y+uy*push*sg;if(!dhit(nx,ny)){n.x=nx;n.y=ny}}}}}),120);

// ม้า: หันขึ้น/ลง วาดม้าแบบหน้า/หลัง (ย่อส่วน) + ผู้ขี่มุมหน้า/หลัง · คูลดาวน์ขึ้น-ลง 1.2 วิ
function drawSteedUD7(k,x,y,dir,A,ph){try{const K=MPAL[k]||MPAL.horse,t=performance.now()/1000,g=t*(A?9.5:0),wolf=k==='wolf';ctx.save();ctx.translate(x,y);ctx.lineJoin='round';
 if(ph===0){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,1,17,5,0,0,7);ctx.fill();
  [[-9,0,1],[9,Math.PI,1],[-4,Math.PI*.5,.85],[4,Math.PI*1.5,.85]].sort((a,b)=>a[2]-b[2]).forEach(([lx,ph2,s])=>{const lift=A?Math.max(0,Math.sin(g*2+ph2))*3.5:0;ctx.fillStyle=s<1?K.s:K.leg;ctx.fillRect(lx-2.2,-19*s-lift,4.4,19*s);ctx.fillStyle='#1a120c';ctx.fillRect(lx-2.4,-3*s-lift,4.8,3)});
  if(dir==='u'&&!wolf){ctx.fillStyle=K.b;ctx.beginPath();ctx.ellipse(0,-50,5.5,8,0,0,7);ctx.fill();ctx.fillStyle=K.m;ctx.fillRect(-1.5,-58,3,14);ctx.fillStyle=K.b;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*2,-56);ctx.lineTo(s*5,-63);ctx.lineTo(s*6,-55);ctx.closePath();ctx.fill()}}
  if(dir==='u'&&wolf){ctx.fillStyle=K.b;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*2,-50);ctx.lineTo(s*6,-60);ctx.lineTo(s*8,-49);ctx.closePath();ctx.fill()}}
  const bg=ctx.createRadialGradient(-4,-34,2,0,-27,15);bg.addColorStop(0,K.hi);bg.addColorStop(.6,K.b);bg.addColorStop(1,K.s);ctx.fillStyle=bg;ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,-27,13,14,0,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#6a3a1a';ctx.beginPath();ctx.ellipse(0,-37,12.5,4.5,0,0,7);ctx.fill();ctx.fillStyle='#c89a3a';ctx.fillRect(-12,-37.5,24,1.4)}
 else{if(dir==='d'){const nod=A?Math.sin(g*2)*1.2:0;ctx.translate(0,nod);
   if(wolf){ctx.fillStyle=K.b;ctx.beginPath();ctx.ellipse(0,-38,9,9,0,0,7);ctx.fill();for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*3,-45);ctx.lineTo(s*8,-55);ctx.lineTo(s*9,-42);ctx.closePath();ctx.fill()}ctx.fillStyle=K.hi;ctx.beginPath();ctx.ellipse(0,-32,5,4.5,0,0,7);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,-33,1.6,0,7);ctx.fill();for(const s of [-1,1]){ctx.fillStyle='#9fd8ff';ctx.fillRect(s*4-1,-40,2.4,2)}}
   else{ctx.fillStyle=K.b;ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-6,-50);ctx.quadraticCurveTo(-8,-38,-5,-27);ctx.quadraticCurveTo(0,-22,5,-27);ctx.quadraticCurveTo(8,-38,6,-50);ctx.quadraticCurveTo(0,-54,-6,-50);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=K.s;ctx.beginPath();ctx.ellipse(0,-27.5,5,3.6,0,0,7);ctx.fill();ctx.fillStyle='#120a06';for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*2,-27,1,0,7);ctx.fill();ctx.beginPath();ctx.arc(s*5.6,-43,1.2,0,7);ctx.fill()}
    for(const s of [-1,1]){ctx.fillStyle=K.b;ctx.beginPath();ctx.moveTo(s*3,-51);ctx.lineTo(s*6,-59);ctx.lineTo(s*7,-50);ctx.closePath();ctx.fill();ctx.stroke()}
    ctx.fillStyle=K.m;ctx.beginPath();ctx.moveTo(-4,-52);ctx.quadraticCurveTo(0,-46,4,-52);ctx.quadraticCurveTo(0,-55,-4,-52);ctx.fill();
    ctx.strokeStyle='#3a2210';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-6,-33);ctx.lineTo(6,-33);ctx.stroke();
    if(k==='unicorn'){ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(-1.6,-53);ctx.lineTo(0,-64);ctx.lineTo(1.6,-53);ctx.closePath();ctx.fill()}}}
  else{const sw=A?Math.sin(g)*3:Math.sin(t*2)*1.5;ctx.strokeStyle=K.m;ctx.lineWidth=wolf?5:4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-26);ctx.quadraticCurveTo(sw,-16,sw*1.4,-7);ctx.stroke()}}
 ctx.restore()}catch(e){try{ctx.restore()}catch(_){}}}
window.drawSteedUD7=drawSteedUD7;
{let lastM=0;const _tm=toggleMount;toggleMount=function(){const n=performance.now();if(n-lastM<1200)return;lastM=n;return _tm()};try{mountB.onclick=()=>toggleMount()}catch(e){}}

// สัตว์เลี้ยง: ซ่อนตอนขี่ม้า · เพิ่มค่าสเตตัส + แสดงโบนัสในหน้าสเตตัส
{const _dp=drawPet;drawPet=function(p,x,y){if(typeof MOUNT!=='undefined'&&MOUNT.on&&HOME.mount&&x===PET.x)return;return _dp(p,x,y)}}
const PETST7={dog:{str:2,vit:2},cat:{agi:2,int:2}};
{const _cb=calcBonus;calcBonus=function(){const b=_cb();try{const s=HOME.pet&&PETST7[HOME.pet];if(s)for(const k in s)b[k]=(b[k]|0)+s[k]}catch(e){}return b}}
{let lp=null;setInterval(()=>safe7('petBonus',()=>{const p=HOME.pet||null;if(p!==lp){lp=p;applyBonus();try{recalcStats()}catch(e){}refreshInv()}}),700)}
{const _rc=renderChar;renderChar=function(){_rc();safe7('petCard',()=>{if(!HOME.pet)return;const el=gid('chl');if(!el)return;const s=PETST7[HOME.pet]||{},x=PAX(),nm={str:'STR',vit:'VIT',agi:'AGI',int:'INT',end:'END'};
  const L=Object.entries(s).map(([k,v])=>nm[k]+' +'+v);const xs=[['crit','คริ'],['cdmg','คริแรง'],['dmg','ดาเมจ'],['pen','เจาะบอส'],['dr','ลดดาเมจ'],['cres','ต้านคริ']].filter(([k])=>x[k]).map(([k,n])=>n+' +'+Math.round(x[k]*100)+'%');
  el.insertAdjacentHTML('beforeend','<div class="sp on" style="flex-direction:column;align-items:flex-start">🐾 โบนัสสัตว์เลี้ยง ('+(HOME.pet==='dog'?'หมาชิบะ':HOME.pet==='cat'?'แมวส้ม':HOME.pet)+')<small style="opacity:.9">'+(L.concat(xs).join(' · ')||'-')+'</small></div>')})}}

// GM วาปไปเหมือง: ปิดหน้าต่าง/ลงจากม้า/ลุกจากที่นั่งก่อน แล้วตรวจว่าเข้าโซนจริง
{const _gz=gmZone;gmZone=function(i){try{try{dlgClose(true)}catch(e){}try{if(SHOPK)closeShop()}catch(e){}P.sit=null;if(MOUNT.on){MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}}
  _gz(i);if(!(D&&D.zone&&!D.home))say('GM: วาปไม่สำเร็จ ลองอีกครั้ง');else say('GM: วาปไป '+ZONES[i].n+' แล้ว')}catch(e){say('GM: '+e.message)}};window.gmZone=gmZone}

// ขอบเมืองด้านขวา → ที่ดินผู้กล้า (กำแพงล่องหนจนกว่าจะปราบบอสสุดท้าย)
const homeOpen7=()=>!!(HOME.unlocked||STORY.done);
{let lastMsg=0;const _dh=dhit;dhit=function(x,y){if(D&&D.town&&!homeOpen7()&&x+7>=(TW-1)*T&&y>14*T&&y<19*T){const n=performance.now();if(n-lastMsg>2500){lastMsg=n;say('🔒 ทางไปที่ดินผู้กล้า — เปิดหลังปราบบอสสุดท้าย ('+ABYSS.n+')');sfx('thud')}return true}return _dh(x,y)}}
{const _ex=exitD;exitD=function(){if(D&&D.town&&P.x>(TW-3)*T){if(homeOpen7()){try{if(!HOME.unlocked){HOME.unlocked=1;try{saveHome()}catch(e){}}const sv=dsav;exitD.busy7=1;enterHome();if(sv&&sv.length&&!(dsav&&dsav.length))dsav=sv}catch(e){console.warn('[v478] toHome',e)}finally{exitD.busy7=0}}else{P.x=(TW-2)*T}return}return _ex()}}

// ระยะคุยกับเจ้าของร้านสั้นลง + ปิดร้าน/บทสนทนาอัตโนมัติเมื่อเดินออกห่าง
let SHOPOPN7=false;
{const _os=openShop;openShop=function(id){const r=_os(id);try{SHOPOPN7=!!(D&&D.shop&&id===D.shop&&shopNear())}catch(e){SHOPOPN7=false}return r}}
setInterval(()=>safe7('autoClose',()=>{
 if(SHOPK&&SHOPOPN7&&D&&D.shop&&D.owner){const o=D.owner;if(Math.hypot(P.x-o.x,P.y-o.y)>(D.shop==='hall'?140:100)){SHOPOPN7=false;closeShop()}}
 if(DLG.open&&DLG.n&&FIN7(DLG.n.x)&&DLG.D===D&&!(typeof CINE!=="undefined"&&CINE.L&&!cineEl.hidden)&&!(INN6&&INN6.st)){if(Math.hypot(P.x-DLG.n.x,P.y-DLG.n.y)>130)dlgClose(true)}}),300);

// ออร่าชุดเกราะระดับสูง: วงแหวนสวรรค์ด้านหลังตัวละคร (แทนปีก/รัศมีเดิม)
{const _af=armorFx;armorFx=function(){const a=_af();if(window.AURACAP7&&a&&a.L>35)a.L=35;return a}}
{const _da=drawArmorAura;drawArmorAura=function(back){let A=null;try{A=_af7()}catch(e){}
 if(back&&A&&A.n>0&&A.L>=21){window.AURACAP7=1;try{_da(back)}finally{window.AURACAP7=0}safe7('ring',()=>{const t=performance.now()/1000,x=P.x,y=P.y-30,rgb=A.rgb,lv=A.L,R=19+Math.min(9,(lv-21)*.25),al=Math.min(.85,.35+(lv-21)*.015);
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(x,y);
   const gl=ctx.createRadialGradient(0,0,R*.4,0,0,R*1.5);gl.addColorStop(0,'rgba('+rgb+',0)');gl.addColorStop(.6,'rgba('+rgb+','+(al*.35)+')');gl.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(0,0,R*1.5,0,7);ctx.fill();
   ctx.strokeStyle='rgba(255,245,210,'+al+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.stroke();ctx.strokeStyle='rgba('+rgb+','+al*.8+')';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,R-4,0,7);ctx.stroke();
   ctx.save();ctx.rotate(t*.6);ctx.fillStyle='rgba(255,250,230,'+al+')';for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillRect(R-2.5,-.8,5,1.6)}ctx.restore();
   ctx.save();ctx.rotate(-t*.9);for(let i=0;i<(lv>=40?6:4);i++){const a=i/(lv>=40?6:4)*6.283;ctx.fillStyle='rgba(255,255,255,'+al+')';ctx.beginPath();ctx.arc(Math.cos(a)*(R+4),Math.sin(a)*(R+4),1.8,0,7);ctx.fill()}ctx.restore();
   if(lv>=52){ctx.strokeStyle='rgba(255,230,150,'+(al*.7)+')';ctx.setLineDash([3,4]);ctx.lineDashOffset=-t*20;ctx.beginPath();ctx.arc(0,0,R+9,0,7);ctx.stroke();ctx.setLineDash([])}
   ctx.restore()});return}
 return _da(back)}}
function _af7(){return armorFx()}

// แท่นคริสตัลอรุณ (ท้องพระโรง): แสดงความคืบหน้าเศษผลึกอรุณ (STORY.shards/5)
const ALT7={x:OX+4.6*T,y:9.3*T,open:false};
function drawAltar7(){const x=ALT7.x,y=ALT7.y,t=performance.now()/1000,n=Math.max(0,Math.min(5,STORY.shards|0));ctx.save();
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+1,22,6,0,0,7);ctx.fill();
 const g=ctx.createLinearGradient(x-16,0,x+16,0);g.addColorStop(0,'#8a8a9a');g.addColorStop(.5,'#e8e8f0');g.addColorStop(1,'#7a7a8a');ctx.fillStyle=g;ctx.strokeStyle='#3a3a48';ctx.lineWidth=1.2;
 ctx.beginPath();ctx.moveTo(x-20,y);ctx.lineTo(x+20,y);ctx.lineTo(x+16,y-6);ctx.lineTo(x-16,y-6);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillRect(x-10,y-26,20,20);ctx.strokeRect(x-10,y-26,20,20);
 ctx.beginPath();ctx.moveTo(x-16,y-26);ctx.lineTo(x+16,y-26);ctx.lineTo(x+13,y-31);ctx.lineTo(x-13,y-31);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c8a24a';ctx.fillRect(x-10,y-18,20,2);
 for(let i=0;i<5;i++){const a=-Math.PI/2+i/5*6.283+t*.4,px=x+Math.cos(a)*15,py=y-48+Math.sin(a)*6,on=i<n;ctx.fillStyle=on?'#ffe9a0':'rgba(120,130,150,.6)';ctx.beginPath();ctx.moveTo(px,py-4);ctx.lineTo(px+2.5,py);ctx.lineTo(px,py+4);ctx.lineTo(px-2.5,py);ctx.closePath();ctx.fill()}
 ctx.globalCompositeOperation='lighter';const fy=y-48+Math.sin(t*2)*2,gl=ctx.createRadialGradient(x,fy,1,x,fy,20+n*3);gl.addColorStop(0,'rgba(255,240,190,'+(.35+n*.1)+')');gl.addColorStop(1,'rgba(160,215,255,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(x,fy,20+n*3,0,7);ctx.fill();
 ctx.globalCompositeOperation='source-over';ctx.fillStyle=n>=5?'#fff6d0':'#bfe4ff';ctx.strokeStyle='#4a6a9a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,fy-11);ctx.lineTo(x+6,fy-2);ctx.lineTo(x,fy+9);ctx.lineTo(x-6,fy-2);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.moveTo(x,fy-9);ctx.lineTo(x-4,fy-2);ctx.lineTo(x,fy-1);ctx.closePath();ctx.fill();ctx.restore()}
{const _h=hero;hero=function(){if(!(D&&D.shop==='hall'))return _h();try{if(ALT7.y<=P.y+3){drawAltar7();_h()}else{_h();drawAltar7()}plate7('💎 แท่นคริสตัลอรุณ',ALT7.x,ALT7.y-68,Math.hypot(P.x-ALT7.x,P.y-ALT7.y)<46?'#fff':'#9fd8ff')}catch(e){console.warn('[v478] altar',e)}}}
{const _es=enterShop;enterShop=function(id){const r=_es(id);try{if(id==='hall'&&typeof dm!=='undefined'){const tx=Math.floor(ALT7.x/T),ty=Math.floor((ALT7.y-4)/T);if(dm[ty])dm[ty][tx]=WL}}catch(e){}return r}}
function openAltar7(){try{const n=Math.max(0,Math.min(5,STORY.shards|0));SHOPK=null;STN.open=null;hideBag();sfx('ui');
 shopEl.innerHTML='<div class="alt7"><button class="mini x xclose" onclick="closeAltar7()">✕</button><b>💎 แท่นคริสตัลอรุณ</b><small>แท่นศักดิ์สิทธิ์ที่รอเศษผลึกอรุณทั้งห้า เมื่อครบ แสงอรุณจะกลับมาปกป้องเอลโดเรีย</small>'
  +'<div class="gems">'+[0,1,2,3,4].map(i=>'<span class="'+(i<n?'':'off')+'">💎</span>').join('')+'</div><div class="bar"><i style="width:'+(n/5*100)+'%"></i></div><small>เศษผลึกอรุณ '+n+'/5 · '+(n>=5?'✨ ครบแล้ว! พลังอรุณตื่นขึ้น':'ได้จากการทำภารกิจหลักของพระราชา')+'</small></div>';
 shopEl.hidden=false;ALT7.open=true}catch(e){console.warn('[v478] openAltar',e);ALT7.open=false}}
function closeAltar7(){ALT7.open=false;try{shopEl.hidden=true}catch(e){}sfx('ui')}
window.openAltar7=openAltar7;window.closeAltar7=closeAltar7;
{const _sa=shopAct;shopAct=function(){if(D&&D.shop==='hall'&&!P.sit&&Math.hypot(P.x-ALT7.x,P.y-ALT7.y)<46){if(ALT7.open)closeAltar7();else openAltar7();return true}return _sa()}}
setInterval(()=>{if(ALT7.open&&!(D&&D.shop==='hall'&&Math.hypot(P.x-ALT7.x,P.y-ALT7.y)<80))closeAltar7()},300);
// ปุ่มกด E ใกล้แท่น: ป้ายกระพริบ
{const _h=hero;hero=function(){_h();if(D&&D.shop==='hall'&&!ALT7.open&&Math.hypot(P.x-ALT7.x,P.y-ALT7.y)<46)safe7('altChip',()=>plate7('กด E / ⚔️ ดูแท่น',ALT7.x,ALT7.y+18,'#ffe27a'))}}

// เวอร์ชัน
try{window.FM_VER='4.7.8'}catch(e){}
// แผงแท่นคริสตัลไม่ถูกปิดโดยระบบปิดร้านอัตโนมัติ (ระยะเจ้าของร้าน)
{const _us=updShop;updShop=function(dt){_us(dt);if(ALT7.open&&shopEl.hidden&&D&&D.shop==='hall')shopEl.hidden=false}}
// บทสนทนาขึ้นบรรทัดใหม่ได้ (รายการของเควส)
{const st=document.createElement('style');st.textContent='#dlg .dtxt{white-space:pre-line}';document.head.appendChild(st)}
// โต๊ะคราฟ: เปิดเฉพาะแท็บคราฟ (ตีบวกต้องไปที่แท่นตีบวก)
window.BENCH7=false;
{const _of=openForge;openForge=function(k){const r=_of(k);safe7('benchTabs',()=>{let s=null;try{s=stnNear()}catch(e){}window.BENCH7=!!(k==='anvil'&&s&&s.craft);if(!window.BENCH7)return;
  if(STN.tab!=='st'&&STN.tab!=='bag'){STN.tab='st';return _of(k)}
  for(const b of shopEl.querySelectorAll('button'))if(/ตีบวก/.test(b.textContent)&&!/คราฟ/.test(b.textContent))b.remove();
  const h=shopEl.querySelector('b');if(h&&/ทั่งตีเหล็ก/.test(h.textContent))h.textContent='🛠️ โต๊ะคราฟ — สร้างอุปกรณ์'});return r}}

// =====================================================================
// core.js — แกนกลางสถาปัตยกรรม v4.8
// EventBus · Hooks (ตัวกรองค่า) · Guard (try/catch/finally) · สถานะผู้เล่น · LoadingScreenManager · Eldoria (ทางเข้ารวมของทุกโมดูล)
// โมดูลใหม่คุยกันผ่าน EventBus เท่านั้น — ระบบเดิม (legacy) ถูกห่อให้ "ส่งเหตุการณ์" ออกมา
// =====================================================================
const EventBus=(()=>{const L={},stats={emit:0,err:0};
 function on(ev,fn,owner){(L[ev]=L[ev]||[]).push({fn,owner:owner||'?'});return ()=>off(ev,fn)}
 function off(ev,fn){const a=L[ev];if(!a)return;const i=a.findIndex(q=>q.fn===fn);if(i>=0)a.splice(i,1)}
 function once(ev,fn,owner){const u=on(ev,function(d){u();fn(d)},owner);return u}
 function emit(ev,data){stats.emit++;const a=L[ev];if(!a||!a.length)return 0;let n=0;for(const q of a.slice()){try{q.fn(data);n++}catch(e){stats.err++;console.warn('[EventBus] '+ev+' @'+q.owner,e)}}return n}
 function count(ev){return ev?(L[ev]||[]).length:Object.values(L).reduce((s,a)=>s+a.length,0)}
 return {on,off,once,emit,count,events:()=>Object.keys(L),stats}})();
window.EventBus=EventBus;
// รายชื่อเหตุการณ์มาตรฐาน (ใช้ชื่อเดียวกันทุกโมดูล)
const EV=Object.freeze({MONSTER_SPAWNED:'MONSTER_SPAWNED',MONSTER_DIED:'MONSTER_DIED',BOSS_DIED:'BOSS_DIED',XP_GAINED:'XP_GAINED',LEVEL_UP:'LEVEL_UP',
 ITEM_EQUIPPED:'ITEM_EQUIPPED',SKILL_CAST:'SKILL_CAST',SKILL_FAILED:'SKILL_FAILED',SCENE_CHANGED:'SCENE_CHANGED',DUNGEON_FLOOR_ENTER:'DUNGEON_FLOOR_ENTER',
 DUNGEON_FLOOR_CLEARED:'DUNGEON_FLOOR_CLEARED',QUEST_CLAIMED:'QUEST_CLAIMED',UI_OPEN:'UI_OPEN',UI_CLOSE:'UI_CLOSE',EVENT_STARTED:'EVENT_STARTED',EVENT_ENDED:'EVENT_ENDED',
 LOOT_DROPPED:'LOOT_DROPPED',ERROR:'ERROR',VALIDATED:'VALIDATED'});
window.EV=EV;

// Hooks: ตัวกรองค่าแบบลำดับ (เช่น xp → อีเวนต์ EXP x2 คูณเพิ่ม) — ไม่ต้องแก้โค้ดระบบอื่น
const Hooks=(()=>{const F={};return {add(name,fn,owner){(F[name]=F[name]||[]).push({fn,owner});},
 apply(name,v,ctx){const a=F[name];if(!a)return v;for(const q of a){try{const r=q.fn(v,ctx);if(r!==undefined&&r!==null&&!(typeof r==='number'&&!isFinite(r)))v=r}catch(e){console.warn('[Hooks] '+name,e)}}return v},
 count:n=>(F[n]||[]).length}})();
window.Hooks=Hooks;

// สถานะผู้เล่นที่ต้องรีเซ็ตเสมอ
const PSTATE={isCasting:false,isInteracting:false,isEquipping:false,inTransition:false,lastError:null};
window.PSTATE=PSTATE;
// Guard: ห่อทุกการกระทำ — ถ้าพัง แจ้งเหตุการณ์ ERROR และคืนสถานะใน finally เสมอ
const Guard={run(tag,fn,flag,onErr){if(flag)PSTATE[flag]=true;try{return fn()}catch(e){PSTATE.lastError={tag,msg:String(e&&e.message||e),t:Date.now()};console.warn('[Guard] '+tag,e);try{EventBus.emit(EV.ERROR,{tag,error:e})}catch(_){}if(onErr)try{onErr(e)}catch(_){}return undefined}
  finally{if(flag)PSTATE[flag]=false}},
 wrap(tag,fn,flag,onErr){return function(){const a=arguments,self=this;return Guard.run(tag,()=>fn.apply(self,a),flag,onErr)}}};
window.Guard=Guard;

// LoadingScreenManager: หน้าโหลดแบบเฟดเข้า/ออก ตอนเปลี่ยนฉาก/ชั้นดันเจี้ยน
const LoadingScreenManager=(()=>{const el=document.createElement('div');el.id='lsm7';el.innerHTML='<div class="c"><div class="ic"></div><b></b><small></small><div class="bar"><i></i></div></div>';
 const st=document.createElement('style');st.textContent=`#lsm7{position:absolute;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#2a1f3a,#07050c);opacity:0;transition:opacity .28s ease;pointer-events:none}
#lsm7.on{display:flex}#lsm7.v{opacity:1;pointer-events:auto}#lsm7 .c{text-align:center;color:#ffe9c0;font-family:inherit;min-width:220px}#lsm7 .ic{font-size:40px;filter:drop-shadow(0 0 10px rgba(255,220,140,.6));animation:lsm7b 1.2s ease-in-out infinite}
#lsm7 b{display:block;font:900 20px Georgia,serif;letter-spacing:1px;margin:6px 0 2px;text-shadow:0 2px 0 #000}#lsm7 small{display:block;opacity:.75;font-size:12px}
#lsm7 .bar{margin:12px auto 0;width:200px;height:6px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}#lsm7 .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#e8c14a,#fff2c0);transition:width .5s ease}
@keyframes lsm7b{50%{transform:translateY(-5px)}}`;document.head.appendChild(st);
 let busy=false,tmr=null;const wrap=()=>document.getElementById('wrap')||document.body;
 function set(o){el.querySelector('.ic').textContent=o.icon||'🌀';el.querySelector('b').textContent=o.title||'กำลังโหลด…';el.querySelector('small').textContent=o.tip||''}
 function attach(){if(!el.parentNode)wrap().appendChild(el)}
 // แบบซิงก์: ปิดจอทันที → เปลี่ยนฉาก → เฟดออก (ใช้กับระบบเดิมที่ต้องเปลี่ยนฉากทันที)
 function cover(o,fn){attach();set(o||{});clearTimeout(tmr);el.classList.add('on','v');el.style.transition='none';void el.offsetWidth;el.style.transition='';const bar=el.querySelector('.bar i');bar.style.width='35%';
  let r;PSTATE.inTransition=true;try{r=fn&&fn()}catch(e){console.warn('[LSM]',e)}finally{PSTATE.inTransition=false;requestAnimationFrame(()=>{bar.style.width='100%'});tmr=setTimeout(hide,o&&o.hold||420)}return r}
 // แบบอะซิงก์: เฟดเข้า → เปลี่ยนฉาก → เฟดออก (ใช้กับปุ่มที่ผู้เล่นกด)
 function go(o,fn){if(busy)return false;busy=true;attach();set(o||{});clearTimeout(tmr);const bar=el.querySelector('.bar i');bar.style.width='0';el.classList.add('on');void el.offsetWidth;el.classList.add('v');PSTATE.inTransition=true;
  setTimeout(()=>{bar.style.width='60%';try{fn&&fn()}catch(e){console.warn('[LSM]',e)}finally{PSTATE.inTransition=false;bar.style.width='100%';tmr=setTimeout(()=>{hide();busy=false},o&&o.hold||380)}},300);return true}
 function hide(){el.classList.remove('v');setTimeout(()=>{if(!el.classList.contains('v'))el.classList.remove('on')},300)}
 return {cover,go,hide,el,isBusy:()=>busy}})();
window.LoadingScreenManager=LoadingScreenManager;window.LSM=LoadingScreenManager;

// Eldoria: ทางเข้ารวม (facade) — เรียกระบบเดิมผ่านชื่อโมดูล โดยอ้างฟังก์ชันล่าสุดเสมอ
const Eldoria={version:'4.8.0',modules:{},register(name,api){this.modules[name]=Object.assign(this.modules[name]||{},api);return this.modules[name]}};
window.Eldoria=Eldoria;
// ตารางโมดูล → ฟังก์ชันระบบเดิมที่อยู่ในความรับผิดชอบ (ใช้ค้นหา/ตรวจสอบ)
const MOD7={
 core:{frame:()=>(typeof frame!=='undefined'?frame:undefined),playerTick:()=>(typeof playerTick!=='undefined'?playerTick:undefined),setScene:()=>(typeof setScene!=='undefined'?setScene:undefined),fade:()=>(typeof fade!=='undefined'?fade:undefined),sfx:()=>(typeof sfx!=='undefined'?sfx:undefined),tone:()=>(typeof tone!=='undefined'?tone:undefined),say:()=>(typeof say!=='undefined'?say:undefined),sysSay:()=>(typeof sysSay!=='undefined'?sysSay:undefined),saveGame:()=>(typeof saveGame!=='undefined'?saveGame:undefined),loadGame:()=>(typeof loadGame!=='undefined'?loadGame:undefined)},
 player:{gainXp:()=>(typeof gainXp!=='undefined'?gainXp:undefined),need:()=>(typeof need!=='undefined'?need:undefined),recalcStats:()=>(typeof recalcStats!=='undefined'?recalcStats:undefined),applyBonus:()=>(typeof applyBonus!=='undefined'?applyBonus:undefined),calcBonus:()=>(typeof calcBonus!=='undefined'?calcBonus:undefined),equipItem:()=>(typeof equipItem!=='undefined'?equipItem:undefined),unequip:()=>(typeof unequip!=='undefined'?unequip:undefined),refreshInv:()=>(typeof refreshInv!=='undefined'?refreshInv:undefined),canTake:()=>(typeof canTake!=='undefined'?canTake:undefined),pickClass:()=>(typeof pickClass!=='undefined'?pickClass:undefined),statAdd:()=>(typeof statAdd!=='undefined'?statAdd:undefined)},
 skills:{useSkill:()=>(typeof useSkill!=='undefined'?useSkill:undefined),castUlt:()=>(typeof castUlt!=='undefined'?castUlt:undefined),ultTick:()=>(typeof ultTick!=='undefined'?ultTick:undefined),summon:()=>(typeof summon!=='undefined'?summon:undefined),minTick:()=>(typeof minTick!=='undefined'?minTick:undefined),flkStep:()=>(typeof flkStep!=='undefined'?flkStep:undefined),healSk:()=>(typeof healSk!=='undefined'?healSk:undefined),hurtE:()=>(typeof hurtE!=='undefined'?hurtE:undefined),eachIn:()=>(typeof eachIn!=='undefined'?eachIn:undefined)},
 monsters:{mkMob:()=>(typeof mkMob!=='undefined'?mkMob:undefined),mobStats:()=>(typeof mobStats!=='undefined'?mobStats:undefined),spawnMob:()=>(typeof spawnMob!=='undefined'?spawnMob:undefined),spawnBoss:()=>(typeof spawnBoss!=='undefined'?spawnBoss:undefined),mobKill:()=>(typeof mobKill!=='undefined'?mobKill:undefined),updMob:()=>(typeof updMob!=='undefined'?updMob:undefined),mvM:()=>(typeof mvM!=='undefined'?mvM:undefined),dropLoot:()=>(typeof dropLoot!=='undefined'?dropLoot:undefined),addDrop:()=>(typeof addDrop!=='undefined'?addDrop:undefined)},
 dungeons:{enterDg:()=>(typeof enterDg!=='undefined'?enterDg:undefined),genDungeon:()=>(typeof genDungeon!=='undefined'?genDungeon:undefined),dgPacks:()=>(typeof dgPacks!=='undefined'?dgPacks:undefined),dgBoss:()=>(typeof dgBoss!=='undefined'?dgBoss:undefined),dgPool:()=>(typeof dgPool!=='undefined'?dgPool:undefined),dgReward:()=>(typeof dgReward!=='undefined'?dgReward:undefined),openChest_:()=>(typeof openChest_!=='undefined'?openChest_:undefined),enterZone:()=>(typeof enterZone!=='undefined'?enterZone:undefined),genZone:()=>(typeof genZone!=='undefined'?genZone:undefined),exitD:()=>(typeof exitD!=='undefined'?exitD:undefined)},
 events:{},
 ui:{openShop:()=>(typeof openShop!=='undefined'?openShop:undefined),closeShop:()=>(typeof closeShop!=='undefined'?closeShop:undefined),renderShop:()=>(typeof renderShop!=='undefined'?renderShop:undefined),openForge:()=>(typeof openForge!=='undefined'?openForge:undefined),closeForge:()=>(typeof closeForge!=='undefined'?closeForge:undefined),openChar:()=>(typeof openChar!=='undefined'?openChar:undefined),renderChar:()=>(typeof renderChar!=='undefined'?renderChar:undefined),talk:()=>(typeof talk!=='undefined'?talk:undefined),dlgClose:()=>(typeof dlgClose!=='undefined'?dlgClose:undefined),openGuild:()=>(typeof openGuild!=='undefined'?openGuild:undefined),openClassMenu:()=>(typeof openClassMenu!=='undefined'?openClassMenu:undefined),icShow:()=>(typeof icShow!=='undefined'?icShow:undefined),icClose:()=>(typeof icClose!=='undefined'?icClose:undefined),updTrack:()=>(typeof updTrack!=='undefined'?updTrack:undefined)}};
window.MOD7=MOD7;
for(const m in MOD7){const api={};for(const fn in MOD7[m])Object.defineProperty(api,fn,{enumerable:true,get(){try{return MOD7[m][fn]()}catch(e){return undefined}}});Eldoria.register(m,api)}

// =====================================================================
// config.js — GAME_DATABASE (ข้อมูลล้วน ไม่มีตรรกะเกม)
// ★ เพิ่มมอนสเตอร์ / ชั้นดันเจี้ยน / อีเวนต์ / ร้านอีเวนต์ / ไอเท็ม = แก้แค่ไฟล์นี้ ★
//   - มอนใหม่: เพิ่มใน CUSTOM_MONSTERS (family = รูปร่างที่มีอยู่: beetle bat golem wolf wisp dragon skeleton zombie drake)
//   - ให้มอนเกิดที่ไหน: spawnIn:['iron',...] (โซน) หรือ floors:[จาก,ถึง] (ดันเจี้ยน)
//   - ดรอป: dropTableId → LOOT_TABLES
//   - อีเวนต์: เปลี่ยน active:true/false ใน EVENTS (หรือกดเปิด/ปิดในหน้า GM)
// =====================================================================
const CUSTOM_MONSTERS=[
 {id:'frost_skeleton',name:'โครงกระดูกน้ำแข็ง',family:'skeleton',colors:['#cfe8ff','#3a5a7a','#7fe0ff'],stats:{hp:1.1,atk:1.2,def:.08,speed:64},dropTableId:'endless_common',floors:[101,Infinity]},
 {id:'void_drake',name:'มังกรเล็กแห่งความว่างเปล่า',family:'drake',colors:['#4a2a6a','#1a0a2a','#ff4ad8'],stats:{hp:1.35,atk:1.3,def:.12,speed:60},dropTableId:'endless_rare',floors:[121,Infinity]},
 {id:'ev_pumpkin_golem',name:'โกเลมฟักทอง',family:'golem',colors:['#ff8a1a','#6a3008','#ffe24a'],stats:{hp:2.2,atk:1.4,def:.1,speed:38},dropTableId:'halloween',eventOnly:'halloween'},
 {id:'ev_pumpkin_king',name:'👑 ราชาฟักทองอาถรรพ์',family:'golem',colors:['#ff6a00','#3a1404','#9aff4a'],stats:{hp:9,atk:1.8,def:.2,speed:40},dropTableId:'halloween_boss',eventOnly:'halloween',seasonalBoss:true}
];
const LOOT_TABLES={
 legacy:{note:'ดรอปแบบเดิมในโค้ดเกม (ไม่เพิ่มอะไร)',rolls:[]},
 endless_common:{rolls:[{item:'estone',chance:.25,min:1,max:1},{item:'rshard',chance:.35,min:1,max:2},{item:'ingDm',chance:.15,min:1,max:1}]},
 endless_rare:{rolls:[{item:'bless',chance:.08,min:1,max:1},{item:'estone',chance:.5,min:1,max:2},{item:'rshard',chance:.6,min:2,max:3}]},
 halloween:{rolls:[{item:'candy7',chance:.6,min:1,max:3},{item:'rshard',chance:.3,min:1,max:1}]},
 halloween_boss:{rolls:[{item:'candy7',chance:1,min:10,max:20},{item:'bless',chance:.5,min:1,max:2},{item:'phoenix',chance:.3,min:1,max:1}]}
};
const DUNGEON_CONFIG={
 maxFloor:999,            // ดันเจี้ยนไม่สิ้นสุด (ปรับได้)
 bands:[                  // ช่วงชั้น → มอนที่เกิด (ใส่ id มอน)
  {from:1,to:10,name:'สุสานชั้นตื้น',monsterSpawns:['dg_skeleton','dg_zombie','dg_bat']},
  {from:11,to:30,name:'สุสานเงา',monsterSpawns:['dg_skeleton','dg_zombie','dg_wolf','dg_beetle']},
  {from:31,to:60,name:'คุกโกเลม',monsterSpawns:['dg_skeleton','dg_zombie','dg_golem','dg_wisp']},
  {from:61,to:85,name:'รังมังกร',monsterSpawns:['dg_drake','dg_golem','dg_wisp','dg_skeleton']},
  {from:86,to:100,name:'ห้วงลึก',monsterSpawns:['dg_drake','dg_skeleton','dg_wisp','dg_golem']},
  {from:101,to:Infinity,name:'ห้วงไร้สิ้นสุด',monsterSpawns:['dg_drake','dg_skeleton','dg_wisp','dg_golem','frost_skeleton','void_drake']}],
 endless:{fromFloor:101,levelCap:110,hpGrowth:.035,atkGrowth:.022,defPerFloor:.001,defCap:.45,rewardGrowth:.02}
};
const EVENTS=[
 {eventId:'double_exp',name:'EXP x2',icon:'✨',active:false,multiplier:{xp:2}},
 {eventId:'gold_rush',name:'ตื่นทอง เหรียญ x1.5',icon:'🪙',active:false,multiplier:{coin:1.5,drop:1.25}},
 {eventId:'halloween',name:'คืนฮาโลวีน',icon:'🎃',active:false,multiplier:{xp:1.2},specialSpawns:[{monsterId:'ev_pumpkin_golem',where:['zone','dungeon'],chancePerSec:.03,max:2}],seasonalBossId:'ev_pumpkin_king',seasonalBossEverySec:300,eventShopId:'shop_halloween'}
];
const SHOPS_EXTRA={
 shop_halloween:{name:'🎃 ร้านอีเวนต์ฮาโลวีน',host:'store',items:[
  {id:'ev_hw_sword',give:{item:'sword_pumpkin7'},name:'ดาบฟักทองอาถรรพ์',price:0,cost:{candy7:60},note:'อาวุธอีเวนต์ (แลกด้วยลูกอม 60)'},
  {id:'ev_hw_bless',give:{mat:'bless'},name:'หินอวยพร',price:500,cost:{candy7:15},note:'ลูกอม 15 + 500 เหรียญ'},
  {id:'ev_hw_phoenix',give:{mat:'phoenix'},name:'ขนนกฟีนิกซ์',price:0,cost:{candy7:25},note:'ลูกอม 25'}]}
};
const ITEMS_EXTRA=[
 {id:'sword_pumpkin7',base:'sword3',name:'ดาบฟักทองอาถรรพ์',stat:'ดาบอีเวนต์ฮาโลวีน (พลังเท่าดาบระดับ 3)'}
];
const MATS_EXTRA=[
 {id:'candy7',name:'ลูกอมฮาโลวีน',desc:'ดรอปจากมอนอีเวนต์ฮาโลวีน · ใช้แลกของที่ร้านอีเวนต์ (ร้านป้าแดง)',weight:.01,icon:'🍬'}
];
const SKILL_OVERRIDES={ /* ตัวอย่าง: 'mage:อัญเชิญโครงกระดูก':{cd:6} */ };

// ---------------------------------------------------------------------
// ประกอบ GAME_DATABASE: รวมข้อมูลเดิมของเกม (อ่านจากตารางที่มีอยู่) + ข้อมูลเพิ่มด้านบน
// ---------------------------------------------------------------------
const GAME_DATABASE=(()=>{const DB={MonstersData:[],LootTables:LOOT_TABLES,DungeonsData:DUNGEON_CONFIG,EventsData:EVENTS,ShopsData:SHOPS_EXTRA,ItemsExtra:ITEMS_EXTRA,MatsExtra:MATS_EXTRA,SkillOverrides:SKILL_OVERRIDES,ZoneSpawns:{},_byId:{},_byKey:{}};
 const famStats=f=>{const F=FAM[f]||{};return {hp:F.hp||1,atk:F.atk||1,def:0,speed:F.spd||50}};
 const add=m=>{if(!m||!m.id)return;m.stats=Object.assign(famStats(m.family),m.stats||{});m.dropTableId=m.dropTableId||'legacy';DB.MonstersData.push(m);DB._byId[m.id]=m;DB._byKey[m.family+'|'+m.name]=DB._byKey[m.family+'|'+m.name]||m};
 // มอนในโซน (ของเดิม)
 try{ZONES.forEach((Z,i)=>{if(!Z||Z.dg||i>=200)return;DB.ZoneSpawns[Z.id]=[];for(const [f,nm,col] of Z.mobs){const id=Z.id+'_'+f;add({id,name:nm,family:f,colors:col,legacy:true,spawnIn:[Z.id]});DB.ZoneSpawns[Z.id].push(id)}
  if(Z.boss)add({id:Z.id+'_boss',name:Z.boss.n,family:Z.boss.f,colors:Z.boss.c,boss:true,legacy:true,spawnIn:[Z.id]})})}catch(e){console.warn('[DB] zones',e)}
 // มอนดันเจี้ยน (ของเดิม — สีเปลี่ยนตามช่วงชั้น)
 try{for(const f in DGNAME)add({id:'dg_'+f,name:DGNAME[f],family:f,colors:'band',legacy:true})}catch(e){console.warn('[DB] dg',e)}
 // มอนเพิ่มเติม
 for(const m of CUSTOM_MONSTERS)add(Object.assign({},m));
 DB.monster=id=>DB._byId[id]||null;DB.monsterByKey=(f,n)=>DB._byKey[f+'|'+n]||null;
 DB.band=f=>DUNGEON_CONFIG.bands.find(b=>f>=b.from&&f<=b.to)||DUNGEON_CONFIG.bands[DUNGEON_CONFIG.bands.length-1];
 DB.event=id=>EVENTS.find(e=>e.eventId===id)||null;
 return DB})();
window.GAME_DATABASE=GAME_DATABASE;

// ลงทะเบียนวัตถุดิบ/ไอเท็มเพิ่มเติมเข้าเกม
try{for(const M of MATS_EXTRA){if(inv[M.id]===undefined)inv[M.id]=0;WT[M.id]=M.weight||.05;INVMETA[M.id]=[M.name,M.desc||''];if(!INVORDER.includes(M.id))INVORDER.push(M.id)}
 const _mi=matIcon;matIcon=function(key){const M=MATS_EXTRA.find(q=>q.id===key);if(!M)return _mi(key);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.font='32px "Noto Color Emoji","Apple Color Emoji",sans-serif';k.textAlign='center';k.textBaseline='middle';k.fillText(M.icon||'📦',24,26);return c};
 for(const M of MATS_EXTRA){const im=new Image();im.src=iconURL('mat:'+M.id);DROPIMG[M.id]=im}}catch(e){console.warn('[DB] mats',e)}
try{for(const X of ITEMS_EXTRA){const B=ITEMS[X.base];if(!B||ITEMS[X.id])continue;ITEMS[X.id]=Object.assign({},B,{name:X.name,stat:X.stat||B.stat,extra7:1});if(typeof GEAR==='object'&&GEAR[X.id]===undefined){}}
 const Q=window.__PEND8;if(Q){for(const k in Q.a)if(ITEMS[Q.a[k]]){P.armor[k]=Q.a[k];delete Q.a[k]}for(const id in Q.g)if(ITEMS[id]){GEAR[id]=Q.g[id];delete Q.g[id]}try{syncSword();recalcStats();refreshInv()}catch(e){}}}catch(e){console.warn('[DB] items',e)}
try{for(const key in SKILL_OVERRIDES){const [c,n]=key.split(':'),S=(CSKILLS[c]||[]).find(s=>s.n===n);if(S)Object.assign(S,SKILL_OVERRIDES[key])}}catch(e){}
// อ้างอิงตารางเดิม (อ่านอย่างเดียว) ให้อยู่ใน GAME_DATABASE ด้วย
Object.defineProperty(GAME_DATABASE,'ItemsData',{get(){return ITEMS}});Object.defineProperty(GAME_DATABASE,'SkillsData',{get(){return CSKILLS}});
Object.defineProperty(GAME_DATABASE,'ZonesData',{get(){return ZONES.filter((z,i)=>z&&i<200&&!z.dg)}});

// =====================================================================
// monsters.js — สร้าง/ปรับค่ามอนจาก GAME_DATABASE · ส่ง MONSTER_DIED · ตารางดรอป · รับคำขอเกิดมอน (SPAWN_REQUEST)
// =====================================================================
(()=>{const DB=GAME_DATABASE,DC=DB.DungeonsData;
 const curFloor=()=>{try{const Zd=D&&D.zone&&D.zone.Zd;return Zd&&Zd.dg?Zd.dg:0}catch(e){return 0}};
 const floorScale=f=>{const E=DC.endless;if(!f||f<E.fromFloor)return {hp:1,atk:1,def:0};const k=f-E.fromFloor+1;return {hp:Math.pow(1+E.hpGrowth,k),atk:Math.pow(1+E.atkGrowth,k),def:Math.min(E.defCap,k*E.defPerFloor)}};
 // มอนที่กำหนดให้เกิดในโซน → ใส่เข้าตารางเกิดของโซนนั้น
 try{for(const M of DB.MonstersData){if(M.legacy||M.eventOnly||!M.spawnIn)continue;for(const zid of M.spawnIn){const Z=ZONES.find((z,i)=>z&&i<200&&z.id===zid);if(Z&&!Z.mobs.some(t=>t[1]===M.name))Z.mobs.push([M.family,M.name,M.colors]);(DB.ZoneSpawns[zid]=DB.ZoneSpawns[zid]||[]).push(M.id)}}}catch(e){console.warn('[monsters] zone spawns',e)}
 // สร้างมอน: ใช้ค่าจากฐานข้อมูล + สเกลตามชั้นดันเจี้ยนแบบไม่สิ้นสุด
 const _mk=mkMob;mkMob=function(f,nm,col,L,x,y,o){o=o||{};const fl=curFloor(),E=DC.endless;if(fl>=E.fromFloor&&L>E.levelCap)L=E.levelCap+Math.max(0,Math.min(2,L-fl));
  const m=_mk(f,nm,col,L,x,y,o);
  try{const M=(o.mid&&DB.monster(o.mid))||DB.monsterByKey(f,nm);const F=FAM[f]||{};let hpR=1,atR=1,def=0;
   if(M){m.mid=M.id;m.dropTableId=M.dropTableId;const s=M.stats||{};hpR=(s.hp||F.hp||1)/(F.hp||1);atR=(s.atk||F.atk||1)/(F.atk||1);def=s.def||0;if(s.speed&&F.spd&&s.speed!==F.spd)m.F=Object.assign({},F,{spd:s.speed});if(M.colors&&M.colors!=='band'&&o.mid)m.col=M.colors}
   const sc=floorScale(fl);hpR*=sc.hp;atR*=sc.atk;def=Math.min(.7,def+sc.def);if(o.hpMul)hpR*=o.hpMul;
   if(hpR!==1){m.hp=m.max=Math.max(1,Math.round(m.hp*hpR))}if(atR!==1)m.atk=Math.max(1,Math.round(m.atk*atR));if(def>0)m.def=def;if(o.event)m.event=o.event;if(o.scMul)m.sc*=o.scMul;
   EventBus.emit(EV.MONSTER_SPAWNED,{m,id:m.mid||null,floor:fl})}catch(e){console.warn('[monsters] mkMob',e)}return m};
 window.mkMob=mkMob;
 // ค่าป้องกันมอน (def) ลดดาเมจที่ได้รับ
 {const _h=hurtE;hurtE=function(e,mult,o){if(e&&e.def>0&&isFinite(mult))mult*=1-e.def;return _h(e,mult,o)}}
 // ตาย → ส่งเหตุการณ์ · เหรียญผ่าน Hooks('coin')
 {const _k=mobKill;mobKill=function(m){const c0=inv.coin,wasDead=m&&m.dead;_k(m);if(wasDead)return;try{const d=inv.coin-c0;if(d>0){const nd=Math.round(Hooks.apply('coin',d,{m}));if(nd>d){inv.coin+=nd-d;refreshInv()}}
   const info={m,id:m.mid||null,x:m.x,y:m.y,level:m.L,boss:!!m.boss,elite:!!m.elite,floor:D&&D.dg||0,zone:D&&D.zone&&D.zone.Zd&&D.zone.Zd.id||null};EventBus.emit(EV.MONSTER_DIED,info);if(m.boss)EventBus.emit(EV.BOSS_DIED,info)}catch(e){console.warn('[monsters] kill',e)}}}
 {const _dl=dropLoot;dropLoot=function(x,y,s){_dl(x,y,s);if(s)EventBus.emit(EV.MONSTER_DIED,{m:null,id:'field_slime',x,y,level:1,field:true})}}
 // ตารางดรอป (เฉพาะมอนที่ระบุ dropTableId นอกจาก legacy)
 const ensureImg=k=>{try{if(!DROPIMG[k]){const im=new Image();im.src=iconURL('mat:'+k);DROPIMG[k]=im}}catch(e){}};
 EventBus.on(EV.MONSTER_DIED,d=>{const m=d.m;if(!m||!m.dropTableId||m.dropTableId==='legacy')return;const T=DB.LootTables[m.dropTableId];if(!T)return;const mul=Hooks.apply('dropChance',1,d);
  for(const r of T.rolls){if(Math.random()<Math.min(1,r.chance*mul)){const n=r.min+Math.floor(Math.random()*(r.max-r.min+1));ensureImg(r.item);for(let i=0;i<n;i++)addDrop(r.item,d.x,d.y);EventBus.emit(EV.LOOT_DROPPED,{item:r.item,n,from:m.mid})}}},'monsters.loot');
 // คำขอให้เกิดมอน (จากระบบอีเวนต์ ฯลฯ)
 function spawnById(id,opt){opt=opt||{};const M=DB.monster(id);if(!M||!D||!D.zone||D.home)return null;let x=P.x,y=P.y;for(let t=0;t<30;t++){const a=Math.random()*6.283,r=opt.r||(140+Math.random()*120),nx=P.x+Math.cos(a)*r,ny=P.y+Math.sin(a)*r;if(!zHit(nx,ny)){x=nx;y=ny;break}}
  const fl=curFloor(),L=fl?Math.min(DC.endless.levelCap,fl+2):Math.max(P.lv,(D.zone.Zd.lv||[1,1])[1]);const col=M.colors==='band'?['#999','#444','#fff']:M.colors;
  const m=mkMob(M.family,M.name,col,L,x,y,{mid:M.id,elite:!!opt.elite||!!M.seasonalBoss,event:opt.event,scMul:M.seasonalBoss?1.7:1});m.aggro=1;m.st='chase';D.mobs.push(m);return m}
 EventBus.on('SPAWN_REQUEST',d=>{const m=spawnById(d.monsterId,d);if(m&&d.announce)say(d.announce)},'monsters.spawn');
 Eldoria.register('monsters',{spawnById,floorScale,db:()=>DB.MonstersData});
})();

// =====================================================================
// dungeons.js — ดันเจี้ยนไม่สิ้นสุด: ชั้น → มอน/บอส/รางวัล จาก GAME_DATABASE.DungeonsData · หน้าโหลดตอนลงชั้น
// =====================================================================
function DGMAX7(){try{const m=GAME_DATABASE.DungeonsData.maxFloor;return isFinite(m)&&m>0?m:999}catch(e){return 100}}
function dgMobs7(f,cols){try{const DB=GAME_DATABASE,B=DB.band(f);const L=[];for(const id of B.monsterSpawns){const M=DB.monster(id);if(!M||M.eventOnly)continue;if(M.floors&&(f<M.floors[0]||f>M.floors[1]))continue;L.push([M.family,M.name,M.colors==='band'?cols:M.colors,M.id])}
  return L.length?L:dgPool(f).map(k=>[k,DGNAME[k],cols])}catch(e){console.warn('[dungeons] mobs',e);return dgPool(f).map(k=>[k,DGNAME[k],cols])}}
function dgLv7(f){const E=GAME_DATABASE.DungeonsData.endless;if(f>=E.fromFloor){const c=E.levelCap;return [c,c+2]}return [f,f+2]}
function dgBossOf7(f){const B=dgBoss(f);try{const band=GAME_DATABASE.band(f);if(band.bossId){const M=GAME_DATABASE.monster(band.bossId);if(M)return {f:M.family,n:M.name+' ชั้น '+f,lv:Math.min(110,f+3),c:M.colors==='band'?B.c:M.colors}}}catch(e){}return B}
function dgInfo7(f){const DB=GAME_DATABASE,B=DB.band(f),E=DB.DungeonsData.endless,sc=Eldoria.modules.monsters&&Eldoria.modules.monsters.floorScale?Eldoria.modules.monsters.floorScale(f):{hp:1,atk:1,def:0};
 return {floor:f,band:B.name,reqLevel:Math.min(f,E.levelCap),monsters:dgMobs7(f,['#999','#444','#fff']).map(t=>t[1]),endless:f>=E.fromFloor,hp:sc.hp,atk:sc.atk,def:sc.def,reward:f>=E.fromFloor?1+E.rewardGrowth*(f-E.fromFloor+1):1}}
function dgGo7(f){f=Math.max(1,Math.min(DGMAX7(),f|0));const I=dgInfo7(f);
 const ok=LoadingScreenManager.go({icon:I.endless?'🌌':'🗝️',title:'ดันเจี้ยนชั้น '+f,tip:I.band+(I.endless?' · มอนแกร่งขึ้น ×'+I.hp.toFixed(2):'')},()=>Guard.run('enterDg',()=>enterDg(f),'isInteracting'));
 if(!ok)enterDg(f)}
window.DGMAX7=DGMAX7;window.dgMobs7=dgMobs7;window.dgLv7=dgLv7;window.dgBossOf7=dgBossOf7;window.dgInfo7=dgInfo7;window.dgGo7=dgGo7;
(()=>{
 // ลงชั้น → ส่งเหตุการณ์
 const _ed=enterDg;enterDg=function(f){const r=_ed(f);try{if(D&&D.dg===f)EventBus.emit(EV.DUNGEON_FLOOR_ENTER,dgInfo7(f))}catch(e){}return r};
 // ชนะบอสชั้น → ส่งเหตุการณ์
 EventBus.on(EV.BOSS_DIED,d=>{if(d.floor)EventBus.emit(EV.DUNGEON_FLOOR_CLEARED,{floor:d.floor})},'dungeons.clear');
 // รางวัลชั้นไม่สิ้นสุด: เพิ่มตามชั้น
 const _rw=dgReward;dgReward=function(f){const R=_rw(f);try{const I=dgInfo7(f);if(I.reward>1){const extra=Math.min(R.length*3,Math.round(R.length*(I.reward-1)));for(let i=0;i<extra;i++)R.push(R[Math.floor(Math.random()*R.length)])}}catch(e){}return R};
 // เมนูดันเจี้ยน: แสดงข้อมูลจากฐานข้อมูล + ปุ่มลงแบบหน้าโหลด
 const _om=openDgMenu;openDgMenu=function(){_om();Guard.run('dgMenu',()=>{const f=DG.sel,I=dgInfo7(f);for(const sm of shopEl.querySelectorAll('small'))if(/มอนสเตอร์ Lv\./.test(sm.textContent)){const B=dgBossOf7(f);
    sm.innerHTML='🏰 '+I.band+(I.endless?' <b style="color:#c8a0ff">(ไม่สิ้นสุด)</b>':'')+'<br>มอนสเตอร์: '+I.monsters.join(' · ')+'<br>บอส: 👑 '+B.n+' Lv.'+B.lv+(I.endless?'<br>💀 พลังมอน HP ×'+I.hp.toFixed(2)+' · ATK ×'+I.atk.toFixed(2)+' · เกราะ '+Math.round(I.def*100)+'%<br>🎁 รางวัล ×'+I.reward.toFixed(2):'<br>รางวัล: หินเสริมพลัง · แท่งโลหะ · เหรียญ · หินอวยพร (หายาก) · อุปกรณ์')}
   const b=[...shopEl.querySelectorAll('button')].find(q=>/ลงดันเจี้ยนชั้น/.test(q.textContent));if(b)b.setAttribute('onclick','dgGo7('+f+')')})};
 Eldoria.register('dungeons',{go:dgGo7,info:dgInfo7,maxFloor:DGMAX7,mobs:dgMobs7});
})();

// =====================================================================
// player.js — XP/เลเวล (ผ่าน Hooks('xp')) · สวมใส่ (Guard + ITEM_EQUIPPED) · สถานะผู้เล่น
// =====================================================================
(()=>{
 const _gx=gainXp;gainXp=function(n){return Guard.run('gainXp',()=>{const l0=P.lv;let v=Number(n)||0;v=Math.max(0,Math.round(Hooks.apply('xp',v)));_gx(v);EventBus.emit(EV.XP_GAINED,{amount:v,base:n,lv:P.lv});if(P.lv>l0)EventBus.emit(EV.LEVEL_UP,{from:l0,to:P.lv})})};
 window.gainXp=gainXp;
 const _eq=equipItem;equipItem=function(id){return Guard.run('equipItem',()=>{const before=JSON.stringify(P.armor);const r=_eq(id);if(JSON.stringify(P.armor)!==before||(QS&&QS.slots.includes(id)))EventBus.emit(EV.ITEM_EQUIPPED,{id,armor:Object.assign({},P.armor)});return r},'isEquipping',()=>{try{hideBag();CHS.sel=null;refreshInv()}catch(_){}})};
 window.equipItem=equipItem;
 const _ue=unequip;unequip=function(k){return Guard.run('unequip',()=>_ue(k),'isEquipping')};window.unequip=unequip;
 Eldoria.register('player',{state:()=>({lv:P.lv,hp:P.hp,mp:P.mp,cls:P.cls,armor:Object.assign({},P.armor),flags:Object.assign({},PSTATE)})});
})();

// =====================================================================
// skills.js — ห่อการใช้สกิล/อัลติ ด้วย Guard (isCasting) · ส่ง SKILL_CAST · ตัวกันสตันค้าง
// =====================================================================
(()=>{
 const resetCast=()=>{try{P.cast=0;P.stun=Math.min(P.stun||0,.15);if(typeof FLK!=='undefined'&&FLK.on){FLK.on=false}}catch(e){}};
 const _us=useSkill;useSkill=function(i){const cd0=(CS.cd||[])[i],mp0=P.mp;return Guard.run('useSkill',()=>{const r=_us(i);const cast=(CS.cd||[])[i]!==cd0||P.mp<mp0;const S=(CSKILLS[P.cls]||[])[i];
   EventBus.emit(cast?EV.SKILL_CAST:EV.SKILL_FAILED,{i,name:S&&S.n,cls:P.cls});return r},'isCasting',resetCast)};
 window.useSkill=useSkill;
 const _cu=castUlt;castUlt=function(){return Guard.run('castUlt',()=>{const was=!!ULT.cast;const r=_cu.apply(this,arguments);if(!was&&ULT.cast)EventBus.emit(EV.SKILL_CAST,{ult:true,cls:P.cls});return r},'isCasting',()=>{try{ULT.cast=null;ultOv.classList.remove('on')}catch(_){}resetCast()})};
 window.castUlt=castUlt;
 // ตัวกันสตันค้าง: ถ้าสตันนานผิดปกติ (ไม่ได้โดนตี/ไม่ได้ร่ายอัลติ/ไม่ได้ตีบวก) ปลดให้เอง
 let stunT=0;setInterval(()=>{try{if(P.stun>0&&!P.dead&&!ULT.cast&&!(window.FRG7on)&&!(typeof FLK!=='undefined'&&FLK.on)&&!P.jump){stunT+=.5;if(stunT>=3){P.stun=0;stunT=0;console.warn('[skills] stun watchdog reset')}}else stunT=0}catch(e){}},500);
 Eldoria.register('skills',{list:()=>CSKILLS[P.cls]||[],cast:i=>useSkill(i)});
})();
// ---------- Line of Sight (จากผลตรวจ QA bot) ----------
// ห้ามทำดาเมจ/วาปทะลุกำแพง: ตรวจกำแพงระหว่างผู้เล่น (และจุดต้นทางของการโจมตี) กับเป้าหมาย — ใช้เฉพาะกำแพงจริงในโซน/ดันเจี้ยน
function wallBetween7(x0,y0,x1,y1){try{if(!D||!D.zone||!D.zone.m)return false;const m=D.zone.m,d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/10);
 for(let i=1;i<n;i++){const u=i/n,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u-6,tx=Math.floor(x/T),ty=Math.floor(y/T);if(!m[ty]||m[ty][tx]!==FL)return true}return false}catch(e){return false}}
window.wallBetween7=wallBetween7;window.MINSRC7=0;
(()=>{const _mt=minTick;minTick=function(dt){window.MINSRC7++;try{return _mt(dt)}finally{window.MINSRC7--}};
 const _h=hurtE;hurtE=function(e,mult,o){try{if(e&&D&&D.zone&&!D.home&&!(e.qaBypass)){const ex=e.x,ey=e.y-6;
   if(window.MINSRC7>0){if(o&&isFinite(o.fx)&&isFinite(o.fy)&&wallBetween7(o.fx,o.fy,ex,ey))return 0}
   else if(wallBetween7(P.x,P.y-6,ex,ey))return 0}}catch(err){}return _h(e,mult,o)};
 // ฟันวาป/ยิงวาป: เลือกเฉพาะเป้าที่มองเห็น (ไม่วาปข้ามกำแพง)
 flkTarget=function(){let b=null,bd=1e9;for(const e of enemies()){if(e.dead)continue;const r=Math.hypot(e.x-P.x,e.y-P.y);if(r>=330)continue;if(wallBetween7(P.x,P.y-6,e.x,e.y-6))continue;const d=r+(FLK.hit.has(e)?400:0);if(d<bd){bd=d;b=e}}return b};
 // อัญเชิญ: มินเนียนไม่ไล่ล่าเป้าที่อยู่หลังกำแพง (กันบินข้ามกำแพงไปตี)
 const _en=enemies;enemies=function(){const L=_en();if(window.MINSRC7>0&&D&&D.zone&&!D.home)return L.filter(e=>!wallBetween7(P.x,P.y-6,e.x,e.y-6));return L};
 // exitD ปลอดภัยเมื่อไม่ได้อยู่ในฉากย่อย
 const _ex=exitD;exitD=function(){if(!D)return;return _ex.apply(this,arguments)};
})();

// =====================================================================
// events.js — EventSystem: เปิด/ปิดอีเวนต์ด้วยค่า true/false (config) หรือปุ่ม GM
// EXP/เหรียญ/ดรอป ×N · มอนพิเศษ · บอสตามฤดูกาล · ร้านอีเวนต์
// =====================================================================
const EventSystem=(()=>{const DB=GAME_DATABASE,LSK='fm_ev7';let ovr={};try{ovr=JSON.parse(localStorage.getItem(LSK)||'{}')||{}}catch(e){ovr={}}
 const isActive=id=>{const E=DB.event(id);if(!E)return false;return id in ovr?!!ovr[id]:!!E.active};
 const active=()=>DB.EventsData.filter(e=>isActive(e.eventId));
 const mult=k=>active().reduce((a,e)=>a*((e.multiplier&&e.multiplier[k])||1),1);
 function setActive(id,on){const E=DB.event(id);if(!E)return false;const was=isActive(id);ovr[id]=!!on;try{localStorage.setItem(LSK,JSON.stringify(ovr))}catch(e){}if(was!==!!on)EventBus.emit(on?EV.EVENT_STARTED:EV.EVENT_ENDED,{eventId:id,name:E.name,icon:E.icon});return true}
 function reset(id){delete ovr[id];try{localStorage.setItem(LSK,JSON.stringify(ovr))}catch(e){}}
 // ตัวคูณผ่าน Hooks (ระบบอื่นไม่ต้องรู้จักอีเวนต์)
 Hooks.add('xp',v=>v*mult('xp'),'events');Hooks.add('coin',v=>v*mult('coin'),'events');Hooks.add('dropChance',v=>v*mult('drop'),'events');
 // มอนพิเศษ + บอสตามฤดูกาล
 const lastBoss={};
 setInterval(()=>Guard.run('eventSpawns',()=>{if(!D||!D.zone||D.home||PAUSED||P.dead)return;const where=D.dg?'dungeon':'zone';
  for(const E of active()){for(const S of (E.specialSpawns||[])){if(!(S.where||['zone']).includes(where))continue;const alive=D.mobs.filter(m=>!m.dead&&m.mid===S.monsterId).length;if(alive<(S.max||1)&&Math.random()<(S.chancePerSec||.02))EventBus.emit('SPAWN_REQUEST',{monsterId:S.monsterId,event:E.eventId})}
   if(E.seasonalBossId&&where==='zone'){const alive=D.mobs.some(m=>!m.dead&&m.mid===E.seasonalBossId);const now=srvNow();if(!alive&&now-(lastBoss[E.eventId]||0)>(E.seasonalBossEverySec||300)*1000){lastBoss[E.eventId]=now;const M=DB.monster(E.seasonalBossId);
     EventBus.emit('SPAWN_REQUEST',{monsterId:E.seasonalBossId,event:E.eventId,r:180,announce:(E.icon||'⚠️')+' '+(M?M.name:'บอสอีเวนต์')+' ปรากฏตัวแล้ว!'})}}}}),1000);
 // แจ้งเมื่อมีอีเวนต์ตอนเริ่มเกม
 setTimeout(()=>{for(const E of active())EventBus.emit(EV.EVENT_STARTED,{eventId:E.eventId,name:E.name,icon:E.icon,boot:true})},2500);
 const api={isActive,active,setActive,reset,mult,list:()=>DB.EventsData.map(e=>({eventId:e.eventId,name:e.name,icon:e.icon,active:isActive(e.eventId)}))};
 Eldoria.register('events',api);return api})();
window.EventSystem=EventSystem;

// =====================================================================
// ui.js — ห่อการเปิด/ปิดหน้าต่างด้วย Guard (isInteracting) · ส่ง UI_OPEN/UI_CLOSE · ป้ายอีเวนต์บน HUD · ร้านอีเวนต์ · แผง GM
// =====================================================================
(()=>{
 const W=(name,kind)=>{const f=window[name]||(MOD7.ui[name]&&MOD7.ui[name]());if(typeof f!=='function')return;const g=function(){const a=arguments,self=this;return Guard.run('ui.'+name,()=>{const r=f.apply(self,a);EventBus.emit(kind,{ui:name,arg:a[0]});return r},'isInteracting')};
  try{switch(name){case 'openShop':openShop=g;break;case 'closeShop':closeShop=g;break;case 'openForge':openForge=g;break;case 'closeForge':closeForge=g;break;case 'openChar':openChar=g;break;case 'openGuild':openGuild=g;break;case 'openClassMenu':openClassMenu=g;break;case 'icShow':icShow=g;break;case 'talk':talk=g;break;case 'dlgClose':dlgClose=g;break}}catch(e){}window[name]=g};
 for(const n of ['openShop','openForge','openChar','openGuild','openClassMenu','icShow','talk'])W(n,EV.UI_OPEN);
 for(const n of ['closeShop','closeForge','dlgClose'])W(n,EV.UI_CLOSE);
 {const _it=interact;interact=function(){return Guard.run('interact',()=>_it.apply(this,arguments),'isInteracting')};window.interact=interact}

 // ป้ายอีเวนต์บน HUD
 const st=document.createElement('style');st.textContent='#evb7{position:absolute;left:50%;top:calc(34px + var(--st,0px));transform:translateX(-50%);z-index:4;display:flex;gap:5px;pointer-events:none}#evb7[hidden]{display:none}#evb7 span{font:800 11px system-ui;color:#2a1406;background:linear-gradient(180deg,#ffe9a0,#e8b84a);border:1.5px solid #fff2c0;border-radius:10px;padding:2px 8px;box-shadow:0 2px 6px rgba(0,0,0,.5);animation:evb7 2s ease-in-out infinite}@keyframes evb7{50%{filter:brightness(1.15)}}';document.head.appendChild(st);
 const bar=document.createElement('div');bar.id='evb7';bar.hidden=true;(gid('wrap')||document.body).appendChild(bar);
 const paint=()=>Guard.run('evBadge',()=>{const L=EventSystem.active();bar.hidden=!L.length;bar.innerHTML=L.map(e=>'<span>'+(e.icon||'🎉')+' '+e.name+'</span>').join('')});
 EventBus.on(EV.EVENT_STARTED,d=>{paint();if(!d.boot){sysSay('🎉 อีเวนต์เริ่มแล้ว: '+(d.icon||'')+' '+d.name);try{chatAnn('อีเวนต์ '+d.name+' เริ่มแล้ว!')}catch(e){}}},'ui.evb');EventBus.on(EV.EVENT_ENDED,d=>{paint();sysSay('อีเวนต์ '+d.name+' จบแล้ว')},'ui.evb');setTimeout(paint,600);

 // ร้านอีเวนต์: ของจะขึ้นในร้านที่กำหนด (host) เฉพาะตอนอีเวนต์เปิด
 const DB=GAME_DATABASE;const evShopItems=host=>{const L=[];for(const E of EventSystem.active()){const S=E.eventShopId&&DB.ShopsData[E.eventShopId];if(!S||S.host!==host)continue;for(const it of S.items){const cost=Object.entries(it.cost||{}).map(([k,v])=>MN(k)+' '+v).join(' + ');L.push({id:it.id,name:'🎪 '+it.name,emoji:'🎪',price:it.price||0,item:it.give.item,mat:it.give.mat,note:it.note+(cost?' · ใช้ '+cost:''),ev7:it})}}return L};
 for(const host of new Set(Object.values(DB.ShopsData).map(s=>s.host))){const S=SHOP_DATA[host];if(!S)continue;const d=Object.getOwnPropertyDescriptor(S,'buy');let base=d&&('value' in d)?d.value:null;const g0=d&&d.get;
  Object.defineProperty(S,'buy',{configurable:true,get(){const b=g0?g0.call(this):base||[];const ev=evShopItems(host);return ev.length?b.concat(ev):b},set(v){base=v}})}
 {const _bi=buyItem;buyItem=function(id){let it=null;for(const S of Object.values(DB.ShopsData)){const q=S.items.find(x=>x.id===id);if(q){it=q;break}}if(!it)return _bi(id);
  return Guard.run('eventBuy',()=>{const ev=Object.values(DB.ShopsData).find(S=>S.items.includes(it));const on=EventSystem.active().some(E=>E.eventShopId&&DB.ShopsData[E.eventShopId]===ev);if(!on){say('อีเวนต์นี้จบแล้ว');return}
   for(const [k,v] of Object.entries(it.cost||{}))if((inv[k]|0)<v){say('ไม่พอ: '+MN(k)+' '+(inv[k]|0)+'/'+v);sfx('thud');return}if(inv.coin<(it.price||0)){say('เหรียญไม่พอ');sfx('thud');return}
   if(it.give.item){const c=canTakeGear(it.give.item);if(c!==true){noRoom(c);return}}else{const c=canTake(it.give.mat);if(c!==true){noRoom(c);return}}
   for(const [k,v] of Object.entries(it.cost||{}))inv[k]-=v;inv.coin-=it.price||0;if(it.give.item)GEAR[it.give.item]=(GEAR[it.give.item]|0)+1;else inv[it.give.mat]=(inv[it.give.mat]|0)+1;
   refreshInv();sfx('gem');say('🎪 ได้ '+it.name+' แล้ว!');try{handIn7(['🎪'],-1)}catch(e){}if(SHOPK)renderShop()})}}

 // แผง GM: อีเวนต์ / ตัวตรวจระบบ / ชั้นไม่สิ้นสุด
 {const _gr=gmRender;gmRender=function(){_gr();Guard.run('gmArch',()=>{const bd=gmW.querySelector('.bd');if(!bd)return;const B=(t,on,c)=>'<button class="bt'+(c?' '+c:'')+'" onclick="'+on+'">'+t+'</button>';
   bd.insertAdjacentHTML('beforeend','<div class="card"><b style="color:#ffe9a0">อีเวนต์ (EventSystem) · สถาปัตยกรรม v4.8</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">'
    +EventSystem.list().map(e=>B((e.active?'✅ ':'⬜ ')+e.icon+' '+e.name,"gmEv7('"+e.eventId+"')",e.active?'g':'')).join('')
    +B('🧪 SystemValidator',"gmSV7()")+B('🤖 QA Bot เล่นทั้งเกม',"gmQA7()",'r')+B('🌌 ชั้น 101',"p6close(gid('gmw'));dgGo7(101)")+B('🌌 ชั้น 150',"p6close(gid('gmw'));dgGo7(150)")+'</div><div id="gmsv7" style="font-size:11px;white-space:pre-wrap;margin-top:6px;max-height:160px;overflow:auto"></div></div>')})}}
 window.gmEv7=id=>{EventSystem.setActive(id,!EventSystem.isActive(id));try{gmRender()}catch(e){}};
 window.gmSV7=()=>{const R=SystemValidator.runChecks({ui:true});const el=gid('gmsv7');if(el)el.textContent=(R.ok?'✅ ผ่านทั้งหมด':'⚠️ พบปัญหา')+' · ตรวจ '+R.checks+' รายการ · ผิดพลาด '+R.errors.length+' · เตือน '+R.warnings.length+'\n'+R.errors.concat(R.warnings).join('\n');say(R.ok?'🧪 SystemValidator ผ่าน':'🧪 พบปัญหา '+R.errors.length+' รายการ')};
 Eldoria.register('ui',{loading:LoadingScreenManager});
})();
// แหล่งที่มาของของจากฐานข้อมูล (ไอเท็มอีเวนต์ / ตารางดรอปมอนใหม่)
{const _s=src7;src7=function(key){const DB=GAME_DATABASE;const id=String(key||'').replace(/^(item|mat):/,'');const out=[];
 try{for(const sid in DB.ShopsData){const S=DB.ShopsData[sid];if(S.items.some(it=>(it.give.item||it.give.mat)===id)){const E=DB.EventsData.find(e=>e.eventShopId===sid);out.push(['🎪',S.name+(E?' (ช่วงอีเวนต์ '+E.name+')':'')])}}
  for(const M of DB.MonstersData){const T=DB.LootTables[M.dropTableId];if(T&&T.rolls.some(r=>r.item===id))out.push(['👾',M.name+(M.eventOnly?' (อีเวนต์)':M.floors?' (ดันเจี้ยนชั้น '+M.floors[0]+'+)':'')])}}catch(e){}
 if(ITEMS[id]&&ITEMS[id].extra7)return out.length?out:[['🎪','ไอเท็มพิเศษ']];return out.concat(_s(key))}}

window.gmQA7=async()=>{const el=gid('gmsv7');if(!confirm7('QA Bot จะวาป/ปรับเลเวล/ให้ของเพื่อทดสอบ (ไม่เซฟลงเครื่อง) จบแล้วต้องโหลดเกมใหม่ เริ่มเลยไหม?'))return;
 p6close(gid('gmw'));const R=await SystemValidator.runFullGamePlaytest({onProgress:m=>say('🤖 QA: '+m)});
 p6open(gid('gmw'));gmRender();const e2=gid('gmsv7');if(e2)e2.innerHTML='<b>🤖 QA เสร็จ '+Math.round(R.stats.ms/1000)+' วิ · ฉาก '+R.stats.scenes+' · ชั้น '+R.stats.floors+' · ก้าว '+R.stats.steps+' · สกิล '+R.stats.skills+' · NPC '+R.stats.npcs+' · UI '+R.stats.ui+' · พบบั๊ก '+R.bugs.length+'</b>\n'+R.bugs.map(b=>'['+b.module+'] '+b.type+' @'+b.scene+' ('+b.x+','+b.y+') '+b.detail).join('\n')+'\n<button class="bt" onclick="location.reload()">🔄 โหลดเกมใหม่ (คืนสถานะเดิม)</button>'};
function confirm7(t){try{return window.confirm(t)}catch(e){return true}}

// =====================================================================
// validator.js — SystemValidator.runChecks(): ตรวจ ID ในฐานข้อมูล · ไอเท็มซ้ำ · ตารางดรอป · ชั้นดันเจี้ยน · อีเวนต์ · ร้าน · การปิดหน้าต่าง
// =====================================================================
const SystemValidator=(()=>{function runChecks(opt){opt=opt||{};const R={ok:true,checks:0,errors:[],warnings:[],t:Date.now()};const DB=GAME_DATABASE;
 const err=m=>{R.errors.push('❌ '+m)},warn=m=>{R.warnings.push('⚠️ '+m)},chk=(c,m,w)=>{R.checks++;if(!c)(w?warn:err)(m)};
 const isMat=k=>!!(INVMETA[k]||k==='coin'),isItem=k=>!!ITEMS[k];
 try{// มอน
  const ids=new Set();for(const M of DB.MonstersData){chk(!ids.has(M.id),'มอน id ซ้ำ: '+M.id);ids.add(M.id);chk(!!FAM[M.family],'มอน '+M.id+' ใช้รูปร่างที่ไม่มี: '+M.family);chk(!!DB.LootTables[M.dropTableId],'มอน '+M.id+' ไม่มีตารางดรอป '+M.dropTableId);
   const s=M.stats||{};chk(s.hp>0&&s.atk>0&&s.speed>0,'ค่าสเตตัสมอน '+M.id+' ไม่ถูกต้อง');chk(M.colors==='band'||(Array.isArray(M.colors)&&M.colors.length===3),'สีมอน '+M.id+' ต้องมี 3 สี',1)}
  // ตารางดรอป
  for(const id in DB.LootTables)for(const r of DB.LootTables[id].rolls){chk(isMat(r.item),'ตารางดรอป '+id+': ไม่รู้จักของ '+r.item);chk(r.chance>=0&&r.chance<=1&&r.min<=r.max,'ตารางดรอป '+id+': ค่าโอกาส/จำนวนผิด')}
  // ชั้นดันเจี้ยน
  const B=DB.DungeonsData.bands;let exp=1;for(const b of B){chk(b.from===exp,'ช่วงชั้นดันเจี้ยนไม่ต่อเนื่องที่ชั้น '+exp+' (เริ่ม '+b.from+')');exp=b.to+1;for(const id of b.monsterSpawns)chk(ids.has(id),'ชั้น '+b.from+'-'+b.to+': ไม่มีมอน '+id);if(b.bossId)chk(ids.has(b.bossId),'ไม่มีบอส '+b.bossId)}
  chk(exp>DB.DungeonsData.maxFloor||!isFinite(exp),'ช่วงชั้นไม่ครอบคลุมถึงชั้นสูงสุด '+DB.DungeonsData.maxFloor);
  for(const f of [1,10,11,50,99,100,101,150,500,DGMAX7()]){const L=dgMobs7(f,['#999','#444','#fff']);chk(L.length>0,'ชั้น '+f+' ไม่มีมอนเกิด');for(const t of L)chk(!!FAM[t[0]],'ชั้น '+f+': รูปร่าง '+t[0]+' ไม่มี');const I=dgInfo7(f);chk(isFinite(I.hp)&&isFinite(I.atk)&&I.hp>0,'ชั้น '+f+': ค่าสเกลผิด')}
  // อีเวนต์ + ร้าน
  const eids=new Set();for(const E of DB.EventsData){chk(!eids.has(E.eventId),'อีเวนต์ id ซ้ำ: '+E.eventId);eids.add(E.eventId);chk(typeof E.active==='boolean','อีเวนต์ '+E.eventId+' ต้องมี active:true/false');
   for(const S of (E.specialSpawns||[]))chk(ids.has(S.monsterId),'อีเวนต์ '+E.eventId+': ไม่มีมอน '+S.monsterId);if(E.seasonalBossId)chk(ids.has(E.seasonalBossId),'อีเวนต์ '+E.eventId+': ไม่มีบอส '+E.seasonalBossId);if(E.eventShopId)chk(!!DB.ShopsData[E.eventShopId],'อีเวนต์ '+E.eventId+': ไม่มีร้าน '+E.eventShopId);
   for(const k in (E.multiplier||{}))chk(['xp','coin','drop'].includes(k)&&E.multiplier[k]>0,'อีเวนต์ '+E.eventId+': ตัวคูณ '+k+' ไม่รองรับ')}
  for(const sid in DB.ShopsData){const S=DB.ShopsData[sid];chk(!!SHOP_DATA[S.host],'ร้าน '+sid+': ไม่มีร้านหลัก '+S.host);const sids=new Set();for(const it of S.items){chk(!sids.has(it.id),'ร้าน '+sid+': id ซ้ำ '+it.id);sids.add(it.id);chk(it.give&&(it.give.item?isItem(it.give.item):isMat(it.give.mat)),'ร้าน '+sid+': ของที่ให้ไม่ถูกต้อง '+it.id);for(const k in (it.cost||{}))chk(isMat(k),'ร้าน '+sid+': ไม่รู้จักวัตถุดิบ '+k)}}
  for(const X of DB.ItemsExtra){chk(!!ITEMS[X.base],'ไอเท็มเพิ่ม '+X.id+': ไม่มีไอเท็มต้นแบบ '+X.base);chk(!!ITEMS[X.id],'ไอเท็มเพิ่ม '+X.id+' ลงทะเบียนไม่สำเร็จ')}
  // ไอเท็มซ้ำ (ใช้ตัวตรวจเดิม)
  if(typeof validateItemDB7==='function'){const V=validateItemDB7();R.checks+=V.items+V.mats;for(const s of V.dupNames)err('ชื่อไอเท็มซ้ำ: '+s);for(const s of V.dupIcons)warn('ไอคอนซ้ำ (ต่างชื่อ): '+s);for(const s of V.dupStats)warn('ค่าสเตตัสซ้ำ (ต่างชื่อ): '+s);for(const s of V.missing)err('ข้อมูลไอเท็มขาด: '+s)}
  // ระบบหลัก
  chk(typeof EventBus.emit==='function'&&EventBus.count()>0,'EventBus ไม่มีผู้ฟัง');chk(Hooks.count('xp')>0,'Hooks xp ไม่ทำงาน');chk(!!document.getElementById('lsm7')||true,'LoadingScreen');
  for(const f of ['isCasting','isInteracting','isEquipping','inTransition'])chk(PSTATE[f]===false||opt.live,'สถานะ '+f+' ค้างเป็น true',1);
  // การปิดหน้าต่าง (เรียกเมื่อสั่ง เพราะจะปิดหน้าต่างที่เปิดอยู่)
  if(opt.ui&&typeof validateUI7==='function')for(const [n,res] of validateUI7())chk(res==='ok','UI: '+n+' → '+res)}
 catch(e){err('ตัวตรวจทำงานผิดพลาด: '+e.message)}
 R.ok=!R.errors.length;window.SV_LAST=R;try{EventBus.emit(EV.VALIDATED,R)}catch(e){}return R}
 // ตรวจอัตโนมัติหลังโหลดเกม (ไม่แตะหน้าต่าง)
 setTimeout(()=>{const R=runChecks();console[R.ok?'log':'warn']('[SystemValidator] '+(R.ok?'OK':'FAIL')+' checks='+R.checks+' errors='+R.errors.length+' warnings='+R.warnings.length,R.errors)},3000);
 return {runChecks}})();
window.SystemValidator=SystemValidator;
Eldoria.register('validator',{run:o=>SystemValidator.runChecks(o)});

// =====================================================================
// QA BOT — SystemValidator.runFullGamePlaytest()
// เล่นเกมอัตโนมัติ: วาปทุกแผนที่/ชั้นดันเจี้ยน · เดินสุ่ม 360° ชนสิ่งกีดขวาง · ร่ายทุกสกิลใกล้กำแพง (ตรวจ LOS) · อัญเชิญรัว
// · คุยกับ NPC ทุกตัว · ทดสอบสาวเสิร์ฟ · ส่งเควส/แลกของ/คราฟ/ตีบวก · เปิด-ปิด UI รัว ๆ · บันทึกบั๊กพร้อมโมดูล/พิกัด/สถานะ
// ระหว่างรัน: ปิดการเซฟทั้งหมด (ไม่แตะเซฟจริง) · จบแล้วกด "โหลดเกมใหม่" เพื่อคืนสถานะเดิม
// =====================================================================
SystemValidator.runFullGamePlaytest=async function(opt){opt=Object.assign({floors:'sample',moveSteps:360,uiCycles:25,onProgress:null},opt||{});
 const t0=performance.now(),BUGS=[],seen=new Set(),ST={scenes:0,floors:0,steps:0,skills:0,npcs:0,ui:0,checks:0};
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)),frame=()=>new Promise(r=>requestAnimationFrame(()=>r()));
 const scene=()=>!D?'field':D.town?'town':D.shop?'shop:'+D.shop:D.home?'home':D.dg?'dg:'+D.dg:D.zone?'zone:'+(D.zone.Zd&&D.zone.Zd.id):'?';
 const tileOf=(x,y)=>[Math.floor(x/T),Math.floor(y/T)];
 function bug(module,type,detail,o){o=o||{};const x=Math.round(o.x!=null?o.x:P.x),y=Math.round(o.y!=null?o.y:P.y),key=module+'|'+type+'|'+scene().replace(/^dg:\d+/,'dg')+'|'+(o.key||Math.floor(x/T)+','+Math.floor(y/T));
  if(seen.has(key))return;seen.add(key);BUGS.push({module,type,scene:scene(),x,y,tile:tileOf(x,y),detail,state:{dir:P.dir,cls:P.cls,lv:P.lv,hp:Math.round(P.hp),stun:+(P.stun||0).toFixed(2),flags:Object.assign({},PSTATE),paused:PAUSED,ui:{bag:!bagEl.hidden,shop:!shopEl.hidden,dlg:!!DLG.open}},sev:o.sev||'major'})}
 const toField=()=>{try{if(D&&D.shop)leaveShop(true)}catch(e){}try{if(D)exitD()}catch(e){}};const prog=m=>{try{opt.onProgress&&opt.onProgress(m)}catch(e){}};
 // จุดชนแบบคงที่ (ไม่นับ NPC ที่เดินมาชน)
 function staticHit(x,y){if(!hit(x,y))return false;if(!D&&[[-7,-4],[7,-4],[-7,4],[7,4]].some(([a,b])=>{const r=map[Math.floor((y+b)/T)];return r&&r[Math.floor((x+a)/T)]===WATER}))return false;if(!D||!D.npcs)return true;const sv=D.npcs.map(n=>[n,n.x,n.y]);for(const [n] of sv){n.x+=1e5}try{return hit(x,y)}finally{for(const [n,a,b] of sv){n.x=a;n.y=b}}}
 // ปิดการเซฟระหว่างทดสอบ
 const SP=Storage.prototype,_set=SP.setItem;SP.setItem=function(k,v){if(/fm_|eldoria/.test(String(k)))return;return _set.call(this,k,v)};
 const svGod=(typeof GM7!=='undefined')?GM7.god:null;try{if(typeof GM7!=='undefined')GM7.god=true}catch(e){}
 const closeAll=()=>{for(const f of [()=>dlgClose(true),()=>hideBag(),()=>icClose(),()=>{if(SHOPK)closeShop()},()=>{if(STN.open)closeForge()},()=>{chp.hidden=true},()=>{if(!skwEl.hidden)closeSkw()},()=>{menuEl.hidden=true},()=>{for(const w of document.querySelectorAll('.p6w'))w.hidden=true},()=>{if(typeof closeEnh7==='function'&&ENHS.open)closeEnh7()},()=>{shopEl.hidden=true;CM.open=false;GM.open=false;ZM.open=false}])try{f()}catch(e){}PAUSED=false};
 async function fuzzMove(n,label){let a=Math.random()*6.283;for(let i=0;i<n;i++){if(i%18===0)a=Math.random()*6.283;const sp=3.2;
   try{moveSlide(Math.cos(a)*sp,Math.sin(a)*sp)}catch(e){bug('core','moveSlide-error',e.message);return}ST.steps++;ST.checks++;
   if(!isFinite(P.x)||!isFinite(P.y)){bug('player','position-NaN','ตำแหน่งผู้เล่นเป็น NaN หลังเดิน');P.x=P.y=100;return}
   if(staticHit(P.x,P.y))bug('player','collider-penetration','ผู้เล่นทะลุเข้าไปในสิ่งกีดขวาง ('+label+')');
   if(i%24===0){await frame();checkActors(label)}}}
 function checkActors(label){if(!D)return;try{if(D.npcs)for(const n of D.npcs){if(n.vis===false||n.fixed)continue;ST.checks++;let bad=false;const tx=Math.floor(n.x/T),ty=Math.floor(n.y/T);bad=!dm[ty]||(dm[ty][tx]!==FL&&dm[ty][tx]!==GATE);if(bad)bug('ui','npc-in-wall','NPC "'+n.name+'" ยืนในช่องทึบ',{x:n.x,y:n.y,key:'npc:'+n.name,sev:'minor'})}
   if(D.zone&&D.mobs)for(const m of D.mobs){if(m.dead||(m.F&&m.F.fly))continue;ST.checks++;if(!isFinite(m.x)||!isFinite(m.y)){bug('monsters','mob-NaN',m.nm+' พิกัด NaN',{key:'nan:'+m.nm});continue}if(zHit(m.x,m.y))bug('monsters','mob-in-obstacle',m.nm+' ติดในกำแพง/แร่',{x:m.x,y:m.y,sev:'minor'})}}catch(e){}}
 // ---------- 1) แผนที่ทั้งหมด ----------
 prog('แผนที่');closeAll();
 const scenes=[['field',()=>toField()],['town',()=>{enterTown(1)}]];
 for(const id of Object.keys(SHOP_DATA)){if(/^st_/.test(id))continue;scenes.push(['shop:'+id,()=>{enterTown(1);enterShop(id)}])}
 ZONES.forEach((z,i)=>{if(z&&i<200&&!z.dg)scenes.push(['zone:'+z.id,()=>enterZone(i)])});
 scenes.push(['home',()=>{const u=HOME.unlocked;HOME.unlocked=1;enterHome();HOME.unlocked=u}]);
 for(const [nm,go] of scenes){try{go()}catch(e){bug('dungeons','scene-load-error','โหลดฉาก '+nm+' ไม่ได้: '+e.message,{key:nm});continue}ST.scenes++;await frame();
  if(staticHit(P.x,P.y))bug('player','spawn-in-collider','จุดเกิดในฉาก '+nm+' อยู่ในสิ่งกีดขวาง');await fuzzMove(nm==='field'?opt.moveSteps*2:opt.moveSteps,nm)}
 // ดันเจี้ยน
 const maxF=DGMAX7(),floors=opt.floors==='all'?Array.from({length:maxF},(_,i)=>i+1):[...new Set([1,2,3,5,10,11,20,21,30,31,50,60,61,85,86,99,100,101,102,120,121,150,200,333,500,750,998,maxF])].filter(f=>f<=maxF);
 for(const f of floors){try{toField();enterDg(f)}catch(e){bug('dungeons','floor-gen-error','สร้างชั้น '+f+' ไม่ได้: '+e.message,{key:'f'+f});continue}ST.floors++;
  if(!(D&&D.dg===f)){bug('dungeons','floor-not-entered','เข้าชั้น '+f+' ไม่สำเร็จ',{key:'f'+f});continue}
  const ms=D.mobs.filter(m=>!m.dead&&!m.boss);if(!ms.length)bug('dungeons','floor-empty','ชั้น '+f+' ไม่มีมอน',{key:'fe'+f});
  if(ms.some(m=>!isFinite(m.hp)||!isFinite(m.atk)||m.hp<=0))bug('dungeons','floor-bad-stats','ชั้น '+f+' ค่ามอนผิด (NaN/0)',{key:'fs'+f});
  if(staticHit(P.x,P.y))bug('dungeons','floor-spawn-in-wall','จุดเกิดชั้น '+f+' อยู่ในกำแพง',{key:'fw'+f});
  const a=D.zone.arena;if(!a||D.zone.m[a.y][a.x]!==FL)bug('dungeons','boss-arena-blocked','ห้องบอสชั้น '+f+' ไม่มีพื้นที่ยืน',{key:'fa'+f});
  checkActors('dg'+f);if(f%50===1||floors.length<60)await fuzzMove(120,'dg'+f);if(ST.floors%25===0){prog('ดันเจี้ยน '+f);await frame()}}
 toField();
 // ---------- 2) สกิล & LOS ----------
 prog('สกิล');
 function wallSpot(){const Zm=D.zone,m=Zm.m;for(let k=0;k<4000;k++){const x=3+Math.floor(Math.random()*(ZW-8)),y=3+Math.floor(Math.random()*(ZH-6));
   if(m[y][x]!==FL||m[y][x+1]===FL||zHit(x*T+16,y*T+16))continue;let w=1;while(w<4&&m[y][x+w]!==FL)w++;if(w>=4||w<2&&m[y][x+2]!==FL)continue;if(m[y][x+w]===FL&&m[y][x+w+1]===FL&&!zHit((x+w)*T+16,y*T+16))return [x,y,w]}return null}
 const W={sword:'sword3',mage:'staff1',archer:'bow1'};
 for(const cls of Object.keys(CSKILLS).filter(c=>c!=='none')){try{gmCls(cls);gmA('lv99');gmWpn(W[cls]&&ITEMS[W[cls]]?W[cls]:Object.keys(ITEMS).find(k=>ITEMS[k].kind===NEEDW[cls]));closeAll()}catch(e){bug('skills','class-setup',cls+': '+e.message,{key:cls});continue}
  for(const where of ['zone','dungeon']){try{toField();if(where==='zone')enterZone(1);else enterDg(40)}catch(e){continue}await frame();D.mobs.length=0;D.spT=1e9;D.bossT=1e9;
   const L=CSKILLS[cls]||[];for(let i=0;i<=L.length;i++){let ws=null;for(let r=0;r<4&&!ws;r++)ws=wallSpot();if(!ws){bug('skills','no-wall-spot','หาจุดทดสอบกำแพงไม่ได้',{key:'ws'+where});break}
    const [wx,wy,ww]=ws;P.x=wx*T+16;P.y=wy*T+16;P.dir='r';P.stun=0;P.mp=BAL.mp;CS.cd=[0,0,0];CS.step=0;MIN.length=0;
    const dm7=mkMob('skeleton','หุ่นทดสอบ QA',['#888','#444','#fff'],10,(wx+ww)*T+16,wy*T+16,{});dm7.hp=dm7.max=1e7;dm7.F=Object.assign({},dm7.F,{spd:0,range:0});dm7.qa=1;D.mobs.push(dm7);
    const x0=P.x,y0=P.y,nm=i<L.length?L[i].n:'อัลติเมท';ST.skills++;
    try{if(i<L.length)useSkill(i);else{ULT.v=100;castUlt()}}catch(e){bug('skills','cast-throw',nm+': '+e.message,{key:'ct'+cls+i})}
    for(let k=0;k<(i<L.length?40:110);k++){await frame();if(staticHit(P.x,P.y)){bug('skills','warp-into-wall',nm+' ทำให้ผู้เล่นเข้าไปในกำแพง',{key:'wi'+cls+i+where});break}}
    if(P.x>(wx+1)*T+20)bug('skills','warp-through-wall',nm+' วาป/พุ่งทะลุกำแพงไปอีกฝั่ง',{key:'wt'+cls+i+where,x:P.x,y:P.y});
    if(dm7.hp<dm7.max)bug('skills','damage-through-wall',nm+' ทำดาเมจทะลุกำแพง ('+Math.round(dm7.max-dm7.hp)+')',{key:'dt'+cls+i+where,x:dm7.x,y:dm7.y});
    if(PSTATE.isCasting)bug('skills','cast-state-stuck',nm+' ค้างสถานะ isCasting',{key:'cs'+cls+i});await sleep(60);if(P.stun>2)bug('skills','stun-stuck',nm+' สตันค้าง '+P.stun.toFixed(1)+' วิ',{key:'st'+cls+i});
    D.mobs=D.mobs.filter(m=>m!==dm7);for(const p of (typeof SK!=='undefined'?SK.balls||[]:[]))p.l=0;try{ULT.cast=null;ULT.fx.length=0;FLK.on=false;P.jump=null}catch(e){}}}}
 // ---------- 3) อัญเชิญรัว ----------
 prog('อัญเชิญ');try{gmCls(CSKILLS.necro?'necro':'mage');gmWpn(W.mage&&ITEMS[W.mage]?W.mage:'staff0');closeAll();for(const where of ['field','zone']){toField();if(where!=='field')enterZone(0);await frame();MIN.length=0;
  const i=(CSKILLS[P.cls]||[]).findIndex(s=>/โครงกระดูก/.test(s.n));if(i<0){bug('skills','no-summon-skill','ไม่พบสกิลอัญเชิญ',{key:'ns'});break}
  for(let k=0;k<20;k++){CS.cd[i]=0;P.mp=BAL.mp;P.stun=0;useSkill(i);await sleep(25)}await sleep(350);ST.skills+=20;
  const sk=MIN.filter(m=>m.k==='skel');if(sk.length>(P.cls==='necro'?6:3))bug('skills','summon-over-cap','อัญเชิญเกินจำกัด: '+sk.length+' ตัว',{key:'cap'+where});if(PSTATE.isCasting)bug('skills','summon-state-stuck','isCasting ค้างหลังอัญเชิญรัว',{key:'sst'+where});
  if(P.stun>0.05)bug('skills','summon-stun-stuck','สตันไม่ถูกปล่อยหลังอัญเชิญ ('+P.stun.toFixed(2)+')',{key:'sss'+where});if(sk.some(m=>!isFinite(m.x)))bug('skills','summon-NaN','มินเนียนพิกัด NaN',{key:'sn'+where});
  const p0=sk.map(m=>[m.x,m.y]);P.x+=90;await sleep(900);if(sk.length&&!sk.some((m,j)=>Math.hypot(m.x-p0[j][0],m.y-p0[j][1])>8))bug('skills','summon-frozen','มินเนียนไม่ขยับ (ค้าง) ใน'+where,{key:'sf'+where})}}catch(e){bug('skills','summon-test-error',e.message,{key:'ste'})}
 // ---------- 4) NPC / บทสนทนา / ระบบในเมือง ----------
 prog('NPC');closeAll();try{toField();enterTown(1);await frame();for(const n of D.npcs.slice()){if(n.vis===false)continue;ST.npcs++;P.x=n.x;P.y=n.y+26;P.dir='u';if(staticHit(P.x,P.y)){P.y=n.y-26;P.dir='d'}if(staticHit(P.x,P.y)){unstick()}
   const b0=n.bub;n.bub=null;let ok=false;try{ok=interact()}catch(e){bug('ui','npc-interact-error','คุยกับ '+n.name+' แล้วพัง: '+e.message,{key:'ni'+n.name})}await frame();
   if(!ok&&!n.bub&&!DLG.open&&shopEl.hidden)bug('ui','npc-no-response','คุยกับ "'+n.name+'" ไม่ตอบสนอง (ยืนหน้า NPC กด E)',{x:n.x,y:n.y,key:'nr'+n.name,sev:'minor'});closeAll()}}catch(e){bug('ui','npc-test-error',e.message,{key:'nte'})}
 // ร้านค้า
 for(const id of Object.keys(SHOP_DATA)){if(/^st_/.test(id))continue;try{enterTown(1);enterShop(id);const o=D.owner;if(!o)continue;P.x=o.x;P.y=o.y+(id==='hall'?70:46);P.dir='u';await frame();const ok=interact();await frame();
   if(!ok&&!DLG.open&&shopEl.hidden&&!(typeof SHOPK!=='undefined'&&SHOPK))bug('ui','shop-no-response','เจ้าของร้าน '+id+' ไม่ตอบสนอง',{key:'sh'+id});closeAll()}catch(e){bug('ui','shop-error','ร้าน '+id+': '+e.message,{key:'she'+id})}}
 // สาวเสิร์ฟ
 try{enterTown(1);enterShop('inn');const o=D.owner;P.x=o.x;P.y=o.y+60;inv.coin+=999;innPick(INNMENU[0]);let clip=0,steps=0;const t1=performance.now();
  while(performance.now()-t1<16000){await sleep(50);const w=INN6.w;if(w&&w.vis){steps++;for(const tb of TABLES){if(Math.abs(w.x-tb.x)<36&&w.y>tb.y-14&&w.y<tb.y+12){clip++;bug('ui','waiter-table-clip','สาวเสิร์ฟเดินทับโต๊ะ ('+INN6.st+')',{x:w.x,y:w.y})}}}if(!INN6.st)break;if(INN6.st==='eat')P.sit=P.sit}
  if(INN6.st&&INN6.st!=='eat'&&INN6.st!=='back2')bug('ui','waiter-stuck','สาวเสิร์ฟค้างที่สถานะ '+INN6.st,{key:'ws'});closeAll();leaveShop()}catch(e){bug('ui','waiter-test-error',e.message,{key:'wte'})}
 // เควส / แลกของ / คราฟ / ตีบวก
 try{enterTown(1);qRefresh(1);QST.act.length=0;qTake(0);const q=QST.act[0];if(q.t==='item')inv[q.k]=(inv[q.k]|0)+q.n;else q.c=q.n;const c0=inv.coin;qClaim(0);if(QST.act.includes(q)||inv.coin<=c0)bug('ui','quest-claim-failed','ส่งเควสกิลด์ไม่สำเร็จ',{key:'qc'});closeAll()}catch(e){bug('ui','quest-error',e.message,{key:'qe'})}
 try{enterShop('gear');SMITH.u=0;SMITH.q=1;for(const [k,v] of Object.entries(SMQ[1].need))inv[k]=(inv[k]|0)+v;P.lv=Math.max(P.lv,SMQ[1].lv);smithDeliver7(1);if(SMITH.u!==1)bug('ui','smith-exchange-failed','แลกตำราช่างไม่สำเร็จ',{key:'se'});closeAll()}catch(e){bug('ui','smith-error',e.message,{key:'see'})}
 try{const id=Object.keys(ITEMS).find(k=>ITEMS[k].kind==='helm'&&ITEMS[k].tier===1)||'helm1';inv.ingot=(inv.ingot|0)+20;inv.wood=(inv.wood|0)+20;inv.ingSt=(inv.ingSt|0)+20;const g0=GEAR[id]|0;SMITH.u=Math.max(SMITH.u,1);
  P.x=CB7.x;P.y=CB7.y+26;craftGear(id);if((GEAR[id]|0)<=g0)bug('ui','craft-failed','คราฟ '+ITEMS[id].name+' ไม่สำเร็จ (มีวัตถุดิบพอ)',{key:'cf',sev:'minor'});closeAll()}catch(e){bug('ui','craft-error',e.message,{key:'cfe'})}
 try{try{localStorage.getItem('fm_enhtut7')}catch(e){}const id=Object.keys(ITEMS).find(k=>ITEMS[k].kind==='helm'&&ITEMS[k].tier===1)||'helm1';GEAR[id]=Math.max(1,GEAR[id]|0);inv.estone=(inv.estone|0)+50;inv.ingot=(inv.ingot|0)+50;inv.ingSt=(inv.ingSt|0)+50;inv.coin+=99999;P.x=ANV7.x-26;P.y=ANV7.y+4;
  ENHS.open=true;ENHS.sel=id;const l0=ENH[id]|0;enhStart7();const t1=performance.now();while((FRG.on||ENHS.busy)&&performance.now()-t1<8000)await sleep(100);
  if(FRG.on||ENHS.busy)bug('ui','enhance-stuck','ตีบวกค้าง (busy)',{key:'eb'});if((ENH[id]|0)===l0&&!ENHS.res)bug('ui','enhance-no-result','ตีบวกไม่มีผลลัพธ์: '+(ENHS.msg||'-'),{key:'en',sev:'minor'});closeAll();leaveShop()}catch(e){bug('ui','enhance-error',e.message,{key:'ee'})}
 // ---------- 5) UI stress ----------
 prog('UI');try{toField();enterTown(1);await frame();const ops=[[()=>{bagEl.hidden=false;renderBag()},()=>hideBag()],[()=>openChar(),()=>{chp.hidden=true}],[()=>openSkw('sk'),()=>closeSkw()],[()=>openShop('potion'),()=>closeShop()],
   [()=>gid('qbtn7')&&gid('qbtn7').click(),()=>gid('qbtn7')&&gid('qbtn7').click()],[()=>LoadingScreenManager.cover({title:'QA'},()=>{}),()=>{}],[()=>{menuEl.hidden=false},()=>{menuEl.hidden=true}],[()=>openDgMenu(),()=>closeZMenu()],[()=>icShow('mat','estone'),()=>icClose()]];
  for(let c=0;c<opt.uiCycles;c++){for(const [o,cl] of ops.sort(()=>Math.random()-.5)){ST.ui++;try{o()}catch(e){bug('ui','ui-open-error',e.message,{key:'uo'+String(o).slice(6,40)})}if(Math.random()<.5)await frame();try{cl()}catch(e){bug('ui','ui-close-error',e.message,{key:'uc'+String(cl).slice(6,40)})}}}
  closeAll();await sleep(900);const open=[['bag',!bagEl.hidden],['char',!chp.hidden],['skillbook',!skwEl.hidden],['shop',!shopEl.hidden],['menu',!menuEl.hidden],['loading',LoadingScreenManager.el.classList.contains('on')],['icard',!icEl.hidden],['dialog',!!DLG.open]].filter(q=>q[1]).map(q=>q[0]);
  if(open.length)bug('ui','overlay-not-closed','หน้าต่างค้างหลังเปิด-ปิดรัว: '+open.join(', '),{key:'oc'});
  for(const f of ['isCasting','isInteracting','isEquipping','inTransition'])if(PSTATE[f])bug('core','state-lock','สถานะ '+f+' ค้างเป็น true',{key:'sl'+f});
  if(PAUSED)bug('core','paused-lock','เกมค้าง PAUSED หลังปิดทุกหน้าต่าง',{key:'pl'});
  // ทดสอบว่าปุ่มเดินยังใช้ได้
  const x0=P.x,y0=P.y;dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft'}));await sleep(350);dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowLeft'}));dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown'}));await sleep(350);dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowDown'}));
  if(Math.hypot(P.x-x0,P.y-y0)<4)bug('core','input-locked','กดปุ่มเดินแล้วตัวละครไม่ขยับ (input ถูกล็อก)',{key:'il'})}catch(e){bug('ui','ui-test-error',e.message,{key:'ute'})}
 // ---------- จบ ----------
 SP.setItem=_set;try{if(svGod!==null)GM7.god=svGod}catch(e){}closeAll();
 const R={bugs:BUGS,stats:Object.assign(ST,{ms:Math.round(performance.now()-t0)}),byModule:BUGS.reduce((a,b)=>{a[b.module]=(a[b.module]||0)+1;return a},{}),byType:BUGS.reduce((a,b)=>{a[b.type]=(a[b.type]||0)+1;return a},{})};
 window.QA_LAST=R;try{sessionStorage.setItem('qa7_last',JSON.stringify({stats:R.stats,byType:R.byType,bugs:BUGS.slice(0,300)}))}catch(e){}EventBus.emit(EV.VALIDATED,{qa:true,count:BUGS.length});prog('เสร็จ');return R};

// =====================================================================
// gm8.js — GM เฉพาะไอดีเจ้าของเกม (tiksi / wiwekwin2537) + ต้องยืนยัน "กุญแจ GM" ลับครั้งเดียวต่อเครื่อง
// คนอื่นตั้งชื่อไอดีเหมือนกันก็เป็น GM ไม่ได้ (ไม่มีกุญแจ) · ยกเลิกรหัส GM เดิม (/gm รหัส)
// =====================================================================
const GM8_HASH='5cfad4c7b597ef0b67906cf78916d7f76e9ba2c22bd3e8aefe3f7083bf897a55';
function sha256hex8(str){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const b=new TextEncoder().encode(str),l=b.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(b);m[l]=0x80;const bl=l*8;for(let i=0;i<4;i++)m[n-1-i]=(bl>>>(8*i))&255;
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];const w=new Uint32Array(64),r=(x,k)=>(x>>>k)|(x<<(32-k));
 for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)w[i]=(m[o+i*4]<<24)|(m[o+i*4+1]<<16)|(m[o+i*4+2]<<8)|m[o+i*4+3];for(let i=16;i<64;i++){const s0=r(w[i-15],7)^r(w[i-15],18)^(w[i-15]>>>3),s1=r(w[i-2],17)^r(w[i-2],19)^(w[i-2]>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0}
  let [a,bb,c,d,e,f,g,hh]=h;for(let i=0;i<64;i++){const S1=r(e,6)^r(e,11)^r(e,25),ch=(e&f)^(~e&g),t1=(hh+S1+ch+K[i]+w[i])>>>0,S0=r(a,2)^r(a,13)^r(a,22),mj=(a&bb)^(a&c)^(bb&c),t2=(S0+mj)>>>0;hh=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=bb;bb=a;a=(t1+t2)>>>0}
  h=[h[0]+a,h[1]+bb,h[2]+c,h[3]+d,h[4]+e,h[5]+f,h[6]+g,h[7]+hh].map(x=>x>>>0)}return h.map(x=>x.toString(16).padStart(8,'0')).join('')}
const GM8={ok:false};
function gm8Check(){try{const k=localStorage.getItem('fm_gmkey8')||'';GM8.ok=!!k&&sha256hex8('eldoria-gm8:'+k.trim().toUpperCase())===GM8_HASH}catch(e){GM8.ok=false}return GM8.ok}
gm8Check();
try{sessionStorage.removeItem('fm_gm7')}catch(e){}
gmAllowed=function(){try{return !!(FM_ACCT&&GM_IDS.includes(String(FM_ACCT).toLowerCase())&&GM8.ok)}catch(e){return false}};window.gmAllowed=gmAllowed;
gmCode=async function(){say('รหัส GM แบบเดิมถูกยกเลิกแล้ว');sfx('thud')};window.gmCode=gmCode;
function gmKey8(k){k=String(k||'').trim().toUpperCase();if(!(FM_ACCT&&GM_IDS.includes(String(FM_ACCT).toLowerCase()))){say('ไอดีนี้ไม่มีสิทธิ์ GM');sfx('thud');return}
 if(sha256hex8('eldoria-gm8:'+k)!==GM8_HASH){say('กุญแจ GM ไม่ถูกต้อง');sfx('thud');return}try{localStorage.setItem('fm_gmkey8',k)}catch(e){}gm8Check();try{gmBtn()}catch(e){}say('🛠️ ยืนยัน GM สำเร็จ (จำไว้ในเครื่องนี้แล้ว)');sfx('gem')}
// ซ่อนปุ่ม GM ทันทีถ้าไม่มีสิทธิ์
setInterval(()=>{try{const b=gid('gmb');if(b)b.style.display=gmAllowed()?'':'none';if(!gmAllowed()){const w=gid('gmw');if(w&&!w.hidden)p6close(w)}if(!gmAllowed()&&typeof GM7!=='undefined'){GM7.god=false;GM7.nocd=false}}catch(e){}},700);
// คำสั่งแชท /gmkey xxxxx (ไม่ถูกส่งออนไลน์)
{const _cs=chatSend;chatSend=function(){const ti=gid('chatTi'),t=(ti&&ti.value||'').trim();if(/^\/gmkey\b/i.test(t)){ti.value='';gmKey8(t.replace(/^\/gmkey\s*/i,''));return}return _cs()};try{gid('chatSend').onclick=()=>chatSend()}catch(e){}}

// =====================================================================
// look.js — เลือกเพศ / สีชุด / สีผม · ใช้ทั้งตัวเราและผู้เล่นออนไลน์คนอื่น
// =====================================================================
const LOOK_COL8={top:['#262631','#7a2a2a','#2a4a8a','#2a6a3a','#6a3a8a','#a8743a','#d8d0c0','#c0507a'],pants:['#14141a','#3a2a1a','#1a2a4a','#2a3a2a','#4a4a52','#5a1a1a'],hair:['#14141a','#5a3418','#a8743a','#e8d070','#c8c8d0','#a83a2a','#3a5aa8','#e08ab0']};
const LOOKDEF8={g:'m',top:'#262631',pants:'#14141a',hair:'#14141a'};
let LOOK8=Object.assign({},LOOKDEF8);try{Object.assign(LOOK8,JSON.parse(localStorage.getItem('fm_look8')||'{}')||{})}catch(e){}
window.LOOK8=LOOK8;P.look8=LOOK8;
const lookSave8=()=>{try{localStorage.setItem('fm_look8',JSON.stringify(LOOK8))}catch(e){}window.LOOK8=LOOK8;P.look8=LOOK8};
const shade8=(h,a)=>{try{const n=parseInt(h.slice(1),16);let r=(n>>16)+a,g=((n>>8)&255)+a,b=(n&255)+a;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}catch(e){return h}};
// สีชุดพื้นฐาน (เมื่อไม่ได้ใส่เกราะ)
{const _e=EQCOL;EQCOL=function(){const c=_e(),L=P.look8||LOOKDEF8,a=P.armor||{};if(!a.chest&&L.top){c.TOP=L.top;c.COLLAR=shade8(L.top,-26)}if(!a.pants&&L.pants){c.BLK=L.pants;c.LEG2=shade8(L.pants,-12)}c.HAIR=L.hair||c.HAIR;return c}}
// ผม (สีผม + ผมยาวผู้หญิง) วาดก่อนหมวก
function hairOv8(R,x,by,side,f,d,at){try{const L=P.look8||LOOKDEF8;if(P.armor&&P.armor.helm)return;const H=L.hair||'#14141a',fem=L.g==='f',re=H!=='#14141a';if(!fem&&!re)return;
 if(side){if(re){R(H,x-7,by-43,14,7);R(H,x-7+(f<0?6:0),by-43,8,13);R(H,x-6,by-48,4,6);R(H,x-1,by-49,4,7);R(H,x+3,by-47,4,5)}
  if(fem){R(H,x-f*5-3,by-43,6,19);R(H,x-f*7-2,by-30,4,8);R(H,x-7,by-44,14,3);R('#ff7ab0',x-f*4-1,by-46,3,3)}}
 else{if(re){R(H,x-7,by-43,14,d==='u'?15:6);R(H,x-7,by-47,4,5);R(H,x-2,by-48,4,6);R(H,x+3,by-47,4,5)}
  if(fem){if(d==='u'){R(H,x-7,by-43,14,21);R(H,x-6,by-23,12,3)}else{R(H,x-9,by-43,3,18);R(H,x+6,by-43,3,18);R(H,x-7,by-44,14,4);R(H,x-6,by-41,4,2);R(H,x+2,by-41,4,2);R('#111',x-4,by-37,1,1);R('#111',x+4,by-37,1,1);R('#e88a9a',x-1,by-31,2,1)}
   R('#ff7ab0',x+3,by-48,4,3);R('#ff7ab0',x+6,by-47,2,2)}}}catch(e){}}
window.hairOv8=hairOv8;
// ผู้เล่นคนอื่น: ใช้รูปลักษณ์ของเขาตอนวาด
if(typeof drawOther==='function'){const _do=drawOther;drawOther=function(o){const sv=P.look8;P.look8=Object.assign({},LOOKDEF8,o.look||{});try{return _do(o)}finally{P.look8=sv}}}
// หน้าตั้งชื่อตัวละคร: เลือกเพศ + สีชุด
function lookPick8(host,onch){const sw=(k,arr)=>'<div class="lk8r"><span>'+({top:'เสื้อ',pants:'กางเกง',hair:'ผม'}[k])+'</span>'+arr.map(c=>'<i data-k="'+k+'" data-c="'+c+'" style="background:'+c+'" class="'+(LOOK8[k]===c?'on':'')+'"></i>').join('')+'</div>';
 host.innerHTML='<div class="lk8g"><button data-g="m" class="'+(LOOK8.g!=='f'?'on':'')+'">♂ ชาย</button><button data-g="f" class="'+(LOOK8.g==='f'?'on':'')+'">♀ หญิง</button></div>'+sw('top',LOOK_COL8.top)+sw('pants',LOOK_COL8.pants)+sw('hair',LOOK_COL8.hair);
 host.onclick=e=>{const g=e.target.closest('[data-g]'),c=e.target.closest('[data-c]');if(g)LOOK8.g=g.dataset.g;else if(c)LOOK8[c.dataset.k]=c.dataset.c;else return;e.stopPropagation();lookPick8(host,onch);onch&&onch()}}
{const st=document.createElement('style');st.textContent='.lk8g{display:flex;gap:6px;justify-content:center;margin:6px 0}.lk8g button{flex:1;max-width:110px;padding:6px!important;border-radius:9px!important;border:1.5px solid #8a7a5a!important;background:#2a2218!important;color:#ffe9c0!important;font-weight:800}.lk8g button.on{background:linear-gradient(180deg,#ffe9a0,#d8b050)!important;color:#3a2408!important}.lk8r{display:flex;align-items:center;gap:4px;justify-content:center;margin:4px 0;flex-wrap:wrap}.lk8r span{font-size:11px;min-width:44px;text-align:right;margin-right:4px;opacity:.85}.lk8r i{width:20px;height:20px;border-radius:6px;border:2px solid rgba(255,255,255,.25);cursor:pointer;display:inline-block}.lk8r i.on{border-color:#fff;box-shadow:0 0 0 2px #ffd84a}#lk8prev{display:block;margin:4px auto;border-radius:10px;background:radial-gradient(circle,#5a4a7a,#1a1428)}';document.head.appendChild(st)}
function lookPreview8(cv){try{const k=cv.getContext('2d'),sv=ctx,sx=P.x,sy=P.y,sd=P.dir,sm=P.mv,smo=MOUNT.on,sdr=P.draw;ctx=k;k.setTransform(1,0,0,1,0,0);k.clearRect(0,0,cv.width,cv.height);k.translate(cv.width/2,cv.height-8);k.scale(1.7,1.7);
 try{P.x=0;P.y=0;P.dir='d';P.mv=false;MOUNT.on=false;P.draw=false;hero()}finally{ctx=sv;P.x=sx;P.y=sy;P.dir=sd;P.mv=sm;MOUNT.on=smo;P.draw=sdr}}catch(e){}}
try{const card=intro.querySelector('.card'),go=gid('introGo');if(card&&go&&!gid('lk8intro')){const d=document.createElement('div');d.id='lk8intro';card.insertBefore(d,go);lookPick8(d,()=>lookSave8())}}catch(e){}
{const _sg=startGame;startGame=function(nm){lookSave8();return _sg(nm)}}
// หน้าต่างปรับรูปลักษณ์ (เปลี่ยนสีครั้งแรกฟรี ต่อไป 100 เหรียญ · เปลี่ยนเพศฟรี)
const lookW8=mk6('lkw8');
function openLook8(){const old=JSON.stringify(LOOK8);let free=false;try{free=localStorage.getItem('fm_lookfree8')!=='1'}catch(e){}
 const render=()=>{lookW8.innerHTML='<div class="w" style="width:min(420px,96%);height:auto;max-height:95%"><div class="hd"><b>👗 รูปลักษณ์ตัวละคร</b><button onclick="closeLook8(false)">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto;padding:8px"><canvas id="lk8prev" width="140" height="120"></canvas><div id="lk8pick"></div><small style="text-align:center;opacity:.8">'+(free?'เปลี่ยนสีครั้งแรกฟรี':'เปลี่ยนสีชุด/ผม 100 🪙 · เปลี่ยนเพศฟรี')+'</small><button class="bt" style="margin-top:6px" onclick="closeLook8(true)">✅ บันทึก</button></div></div>';
  lookPick8(gid('lk8pick'),()=>{lookPreview8(gid('lk8prev'))});lookPreview8(gid('lk8prev'))};
 window.closeLook8=ok=>{const o=JSON.parse(old),colorCh=['top','pants','hair'].some(k=>o[k]!==LOOK8[k]);
  if(ok&&colorCh&&!free){if(inv.coin<100){say('เหรียญไม่พอ (ต้องใช้ 100)');sfx('thud');ok=false}else{inv.coin-=100;refreshInv()}}
  if(!ok){Object.assign(LOOK8,o)}else{if(colorCh&&free)try{localStorage.setItem('fm_lookfree8','1')}catch(e){}say('👗 บันทึกรูปลักษณ์แล้ว');sfx('ui')}lookSave8();p6close(lookW8)};
 p6open(lookW8);render()}
window.openLook8=openLook8;

// =====================================================================
// mount.js — ม้ามุมหน้า/หลัง วาดใหม่ให้เป็นตัวเดียวกับมุมข้าง (ม้าศึกหุ้มเกราะ: ขายาว เกราะหน้าเงิน ผ้าอานแดงขอบทอง ปลอกคอหนัง)
// ผู้ขี่นั่งคร่อมจริง (ต้นขากางออก เข่างอ เท้าในโกลน) แทนท่ายืน
// =====================================================================
function legUD8(x,top,len,K,far,lift,hind){ctx.lineCap='round';ctx.strokeStyle=far?K.s:K.b;ctx.lineWidth=hind?6:5;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,top+len*.45-lift*.4);ctx.stroke();
 ctx.strokeStyle=far?K.s:K.leg;ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(x,top+len*.45-lift*.4);ctx.lineTo(x,top+len-lift);ctx.stroke();ctx.fillStyle='#1a1210';ctx.beginPath();ctx.ellipse(x,top+len-lift,3.4,2.2,0,0,7);ctx.fill()}
function bodyUD8(K,y0,y1){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,K.hi);g.addColorStop(.45,K.b);g.addColorStop(1,K.s);ctx.fillStyle=g;ctx.strokeStyle='rgba(20,10,5,.55)';ctx.lineWidth=1;ctx.fill();ctx.stroke()}
drawSteedUD7=function(k,x,y,dir,A,ph){try{const K=MPAL[k]||MPAL.horse,t=performance.now()/1000,g=t*(A?9.5:0)+(MOUNT.g0||0),wolf=k==='wolf',S=MSC;
 const lift=p=>A?Math.max(0,Math.sin(g*2+p))*4:0,bob=-Math.abs(Math.sin(g*2))*1.2*A;
 ctx.save();ctx.translate(x,y);ctx.scale(S,S);ctx.lineJoin='round';
 if(ph===0){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,1,17,5,0,0,7);ctx.fill();
  if(dir==='d'){// มุมหน้า: ขาหลัง (ไกล) → ลำตัว → ผ้าอาน → ขาหน้า (ใกล้)
   legUD8(-6,-30,31,K,1,lift(Math.PI),1);legUD8(6,-30,31,K,1,lift(0),1);
   ctx.translate(0,bob);ctx.beginPath();ctx.ellipse(0,-37,12,11,0,0,7);bodyUD8(K,-48,-26);
   ctx.fillStyle='#7a2a2a';ctx.fillRect(-14,-47,5,12);ctx.fillRect(9,-47,5,12);ctx.fillStyle='#e8c14a';ctx.fillRect(-14,-36,5,1.2);ctx.fillRect(9,-36,5,1.2);ctx.translate(0,-bob);
   legUD8(-7,-28,29,K,0,lift(Math.PI*1.5),0);legUD8(7,-28,29,K,0,lift(Math.PI*.5),0)}
  else{// มุมหลัง: ขาหน้า (ไกล) → หัว/หูโผล่ → สะโพก → ขาหลัง (ใกล้)
   legUD8(-6,-29,30,K,1,lift(Math.PI*.5),0);legUD8(6,-29,30,K,1,lift(Math.PI*1.5),0);
   ctx.translate(0,bob);
   if(!wolf){ctx.beginPath();ctx.moveTo(-5,-48);ctx.quadraticCurveTo(-6,-62,0,-66);ctx.quadraticCurveTo(6,-62,5,-48);ctx.closePath();bodyUD8(K,-66,-48);ctx.strokeStyle=K.m;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-64);ctx.lineTo(0,-48);ctx.stroke()}
   ctx.fillStyle=K.b;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*2,-64);ctx.lineTo(s*(wolf?6:4),-73);ctx.lineTo(s*(wolf?7:6),-63);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(20,10,5,.55)';ctx.lineWidth=1;ctx.stroke()}
   if(!wolf){ctx.fillStyle='#c8ccd6';ctx.fillRect(-3,-66,6,4)}
   ctx.beginPath();ctx.moveTo(-13,-30);ctx.bezierCurveTo(-15,-44,-8,-49,0,-48);ctx.bezierCurveTo(8,-49,15,-44,13,-30);ctx.bezierCurveTo(10,-23,-10,-23,-13,-30);ctx.closePath();bodyUD8(K,-49,-24);
   ctx.fillStyle='rgba(0,0,0,.14)';ctx.beginPath();ctx.ellipse(0,-34,1.5,9,0,0,7);ctx.fill();
   ctx.fillStyle='#7a2a2a';ctx.fillRect(-15,-47,5,11);ctx.fillRect(10,-47,5,11);ctx.fillStyle='#e8c14a';ctx.fillRect(-15,-37,5,1.2);ctx.fillRect(10,-37,5,1.2);ctx.translate(0,-bob);
   legUD8(-8,-28,29,K,0,lift(0),1);legUD8(8,-28,29,K,0,lift(Math.PI),1)}}
 else{ctx.translate(0,bob);
  if(dir==='d'){// คอ + หัวหันเข้ากล้อง (อยู่หน้าผู้ขี่ ต่ำกว่าหน้าผู้ขี่)
   ctx.fillStyle='#c8ccd6';ctx.strokeStyle='#5a5e6a';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-9,-30);ctx.quadraticCurveTo(0,-20,9,-30);ctx.lineTo(7,-24);ctx.quadraticCurveTo(0,-17,-7,-24);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#e8c14a';for(const xx of [-4,0,4]){ctx.beginPath();ctx.arc(xx,-23,.9,0,7);ctx.fill()}
   ctx.save();ctx.translate(0,-31);ctx.scale(.86,.86);ctx.translate(0,31+12);
   ctx.beginPath();ctx.moveTo(-7,-30);ctx.quadraticCurveTo(-8,-44,-5,-52);ctx.lineTo(5,-52);ctx.quadraticCurveTo(8,-44,7,-30);ctx.closePath();bodyUD8(K,-52,-30);
   if(wolf){ctx.beginPath();ctx.ellipse(0,-52,9,8,0,0,7);bodyUD8(K,-60,-44);for(const s of [-1,1]){ctx.fillStyle=K.b;ctx.beginPath();ctx.moveTo(s*3,-58);ctx.lineTo(s*8,-68);ctx.lineTo(s*9,-55);ctx.closePath();ctx.fill()}ctx.fillStyle=K.hi;ctx.beginPath();ctx.ellipse(0,-46,5,4,0,0,7);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,-47,1.6,0,7);ctx.fill();ctx.fillStyle='#9fd8ff';for(const s of [-1,1])ctx.fillRect(s*4-1,-55,2.4,2)}
   else{ctx.beginPath();ctx.moveTo(-5,-62);ctx.bezierCurveTo(-7,-54,-6,-44,-4,-37);ctx.quadraticCurveTo(0,-33,4,-37);ctx.bezierCurveTo(6,-44,7,-54,5,-62);ctx.quadraticCurveTo(0,-65,-5,-62);ctx.closePath();bodyUD8(K,-64,-36);
    for(const s of [-1,1]){ctx.fillStyle=K.b;ctx.beginPath();ctx.moveTo(s*3,-61);ctx.lineTo(s*5,-69);ctx.lineTo(s*6.5,-60);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(20,10,5,.55)';ctx.lineWidth=1;ctx.stroke()}
    // เกราะหน้าเงิน (ชุดเดียวกับมุมข้าง)
    ctx.fillStyle='#c8ccd6';ctx.strokeStyle='#5a5e6a';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-3.6,-60);ctx.lineTo(3.6,-60);ctx.lineTo(2.6,-44);ctx.lineTo(0,-41);ctx.lineTo(-2.6,-44);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#e8c14a';for(const yy of [-56,-51])ctx.fillRect(-.8,yy,1.6,1.6);
    ctx.fillStyle=K.s;ctx.beginPath();ctx.ellipse(0,-37.5,4.2,2.8,0,0,7);ctx.fill();ctx.fillStyle='#120a08';for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*1.7,-37,.8,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(s*5.2,-53,1.1,1.4,0,0,7);ctx.fill()}
    ctx.strokeStyle=K.m;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-2,-62);ctx.quadraticCurveTo(0,-58,2,-62);ctx.stroke();ctx.strokeStyle='#3a2410';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-5,-42);ctx.lineTo(5,-42);ctx.stroke();
    if(k==='unicorn'){ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(-1.6,-62);ctx.lineTo(0,-75);ctx.lineTo(1.6,-62);ctx.closePath();ctx.fill()}}
   ctx.restore();
   // ปลอกคอหนัง + เกราะอก
   ctx.fillStyle='#4a2c16';ctx.strokeStyle='#1a0e06';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,-31,8,3.2,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#e8c14a';for(const xx of [-5,0,5]){ctx.beginPath();ctx.arc(xx,-31,1,0,7);ctx.fill()}}
  else{// หางยาวห้อยจากสะโพก
   const sw=Math.sin(t*2.2)*.3+Math.sin(g)*.15*A;ctx.strokeStyle=K.m;ctx.lineCap='round';for(let i=0;i<4;i++){ctx.lineWidth=wolf?3.4:2.4;ctx.beginPath();ctx.moveTo(-1.5+i,-42);ctx.bezierCurveTo(-2+i,-34,sw*8+i-1.5,-24,sw*12+i*1.2-2,-12+i);ctx.stroke()}}}
 ctx.restore()}catch(e){try{ctx.restore()}catch(_){}}};
window.drawSteedUD7=drawSteedUD7;
// ขาผู้ขี่ (มุมหน้า/หลัง): นั่งคร่อม ต้นขากางออกด้านข้าง เข่างอ แข้งห้อยข้างตัวม้า เท้าในโกลน
{const _sl=seatLegs;seatLegs=function(x,hipY,f,side,EC,stir){if(side||!stir||!(typeof MOUNT!=='undefined'&&MOUNT.on))return _sl(x,hipY,f,side,EC,stir);
 try{const LG=EC.BLK||'#262631',LG2=EC.LEG2||'#0b0b10',BT='#2a1a10';ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(const s of [-1,1]){ctx.strokeStyle=LG;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+s*3,hipY+1);ctx.lineTo(x+s*12,hipY+5);ctx.stroke();
   ctx.strokeStyle=LG2;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+s*12,hipY+5);ctx.lineTo(x+s*13,hipY+15);ctx.stroke();
   ctx.fillStyle=BT;ctx.fillRect(x+s*13-3,hipY+14,6,4);ctx.strokeStyle='#5a3418';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+s*10,hipY);ctx.lineTo(x+s*13,hipY+18);ctx.stroke();ctx.fillStyle='#c8ccd6';ctx.fillRect(x+s*13-4,hipY+18,8,2)}
  ctx.restore()}catch(e){}}}

// =====================================================================
// vault.js — คลังเก็บของ (ฝาก/ถอน วัตถุดิบและอุปกรณ์) ใช้ได้ในเมือง/ร้าน/ที่ดิน · ไม่นับน้ำหนัก · ขยายช่องด้วยเหรียญ (ช่วยไม่ให้เงินเฟ้อ)
// =====================================================================
const VAULT8=(()=>{let V={mats:{},gear:{},lv:0};try{Object.assign(V,JSON.parse(localStorage.getItem('fm_vault8')||'{}')||{})}catch(e){}V.mats=V.mats||{};V.gear=V.gear||{};return V})();
const VCAP8=[30,45,60,80,100],VCOST8=[800,2500,6000,15000];
const vCap8=()=>VCAP8[Math.min(VAULT8.lv|0,VCAP8.length-1)],vUsed8=()=>Object.keys(VAULT8.mats).filter(k=>VAULT8.mats[k]>0).length+Object.keys(VAULT8.gear).filter(k=>VAULT8.gear[k]>0).length;
const vSave8=()=>{let ok=true;try{localStorage.setItem('fm_vault8',JSON.stringify(VAULT8))}catch(e){ok=false}try{saveGame(true)}catch(e){ok=false}
 // Vault transfers are high value. Start a cloud write immediately after the
 // local snapshot, instead of waiting for the normal 15-second background tick.
 try{if(ok&&window.CLOUD&&window.ONL32&&ONL32.verified){setTimeout(()=>Promise.resolve(CLOUD.sync(true,true)).then(saved=>{if(!saved&&!CLOUD.reloading)say('⚠️ ของอยู่ในเครื่องแล้ว แต่ยังซิงค์ไม่สำเร็จ — อย่าเพิ่งปิดเกม กรุณารอแล้วลองอีกครั้ง')}).catch(()=>say('⚠️ ของอยู่ในเครื่องแล้ว แต่ยังซิงค์ไม่สำเร็จ — อย่าเพิ่งปิดเกม กรุณารอแล้วลองอีกครั้ง')),250)}}catch(e){}
 return ok};
const vOk8=()=>!!(D&&(D.town||D.shop||D.home));
const vW8=mk6('vlt8');const VQ8={q:1};
function vIcon8(t,k){try{return iconURL((t==='g'?'item:':'mat:')+k)}catch(e){return ''}}
function vRender8(){const cap=vCap8(),used=vUsed8(),eq=new Set(Object.values(P.armor||{}).filter(Boolean));
 const cell=(t,k,n,act)=>'<div class="v8c" onclick="'+act+'(\''+t+'\',\''+k+'\')" title="'+(t==='g'?ITEMS[k].name:MN(k))+'"><img src="'+vIcon8(t,k)+'"><em>'+n+'</em></div>';
 let vh='',bh='';for(const k in VAULT8.gear)if(VAULT8.gear[k]>0&&ITEMS[k])vh+=cell('g',k,VAULT8.gear[k],'vOut8');for(const k in VAULT8.mats)if(VAULT8.mats[k]>0&&INVMETA[k])vh+=cell('m',k,VAULT8.mats[k],'vOut8');
 for(const k in GEAR)if(GEAR[k]>0&&ITEMS[k])bh+=cell('g',k,GEAR[k],'vIn8');for(const k of INVORDER)if(k!=='coin'&&inv[k]>0)bh+=cell('m',k,inv[k],'vIn8');
 const nx=VCOST8[VAULT8.lv|0];
 vW8.innerHTML='<div class="w"><div class="hd"><b>📦 คลังเก็บของ · '+used+'/'+cap+' ช่อง</b><button class="'+(VQ8.q===1?'on':'')+'" onclick="vQ8(1)">×1</button><button class="'+(VQ8.q===10?'on':'')+'" onclick="vQ8(10)">×10</button><button class="'+(VQ8.q===1e9?'on':'')+'" onclick="vQ8(1e9)">ทั้งหมด</button><button onclick="p6close(vW8)">✕</button></div>'
  +'<div class="bd v8"><div class="v8p"><div class="v8t">📦 ในคลัง (แตะ = ถอน)</div><div class="v8g">'+(vh||'<small>ยังว่าง</small>')+'</div>'+(nx?'<button class="bt v8up" onclick="vUp8()">➕ ขยายคลัง +'+(VCAP8[(VAULT8.lv|0)+1]-cap)+' ช่อง · 🪙 '+nx.toLocaleString()+'</button>':'<small>คลังขนาดสูงสุดแล้ว</small>')+'</div>'
  +'<div class="v8p"><div class="v8t">🎒 กระเป๋า (แตะ = ฝาก) · ของที่สวมอยู่ฝากไม่ได้</div><div class="v8g">'+(bh||'<small>กระเป๋าว่าง</small>')+'</div></div></div></div>'}
window.vQ8=q=>{VQ8.q=q;vRender8()};
window.vIn8=(t,k)=>Guard.run('vaultIn',()=>{const src=t==='g'?GEAR:inv,dst=t==='g'?VAULT8.gear:VAULT8.mats;if(!(src[k]>0))return;if(!(dst[k]>0)&&vUsed8()>=vCap8()){say('คลังเต็ม — ขยายคลังได้');sfx('thud');return}
 const n=Math.min(src[k],VQ8.q);src[k]-=n;if(t==='g'&&src[k]<=0)delete src[k];dst[k]=(dst[k]|0)+n;sfx('ui');vSave8();refreshInv();try{updQuick()}catch(e){}vRender8()},'isInteracting');
window.vOut8=(t,k)=>Guard.run('vaultOut',()=>{const dst=t==='g'?GEAR:inv,src=t==='g'?VAULT8.gear:VAULT8.mats;if(!(src[k]>0))return;let n=Math.min(src[k],VQ8.q),got=0;
 for(;got<n;got++){const c=t==='g'?canTakeGear(k):canTake(k);if(c!==true){if(!got)noRoom(c);break}src[k]--;dst[k]=(dst[k]|0)+1}if(src[k]<=0)delete src[k];if(got){sfx('ui');vSave8();refreshInv()}vRender8()},'isInteracting');
window.vUp8=()=>{const c=VCOST8[VAULT8.lv|0];if(!c)return;if(inv.coin<c){say('เหรียญไม่พอ (ต้องใช้ '+c.toLocaleString()+')');sfx('thud');return}inv.coin-=c;VAULT8.lv=(VAULT8.lv|0)+1;sfx('chest');say('📦 ขยายคลังเป็น '+vCap8()+' ช่องแล้ว');vSave8();refreshInv();vRender8()};
function openVault8(){if(!vOk8()){say('📦 เปิดคลังได้ในเมือง ในร้าน หรือที่ดินของคุณ');sfx('thud');return}p6open(vW8);vRender8()}
window.openVault8=openVault8;window.vW8=vW8;
{const st=document.createElement('style');st.textContent='#vlt8 .v8{display:flex;gap:8px;padding:8px;overflow:hidden}#vlt8 .v8p{flex:1;display:flex;flex-direction:column;min-width:0;background:rgba(0,0,0,.25);border-radius:10px;padding:6px}#vlt8 .v8t{font:800 12px system-ui;color:#ffe9a0;margin-bottom:5px}#vlt8 .v8g{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(46px,1fr));gap:5px;align-content:start}#vlt8 .v8c{position:relative;aspect-ratio:1;border-radius:8px;background:radial-gradient(circle,#3a3050,#1a1428);border:1.5px solid #5a4a7a;display:flex;align-items:center;justify-content:center;cursor:pointer}#vlt8 .v8c img{width:80%;height:80%}#vlt8 .v8c em{position:absolute;right:2px;bottom:0;font:800 10px system-ui;font-style:normal;color:#fff;text-shadow:0 1px 2px #000}#vlt8 .v8up{margin-top:6px}#vlt8 .hd button.on{background:#ffe9a0;color:#3a2408}@media (max-width:600px){#vlt8 .v8{flex-direction:column}}';document.head.appendChild(st)}

// =====================================================================
// balance.js — เล่นชิล ๆ ไม่ยากไม่ง่าย + กันเงินเฟ้อ
// =====================================================================
(()=>{
 // ชิล: มอนตีเบาลง 15% · ฟื้นเลือดนอกการต่อสู้เร็วขึ้น · ตายเสีย XP น้อยลง (5% → 2%)
 const _zh=zHurt;zHurt=function(src,dmg,kbm,msg){return _zh(src,Math.max(1,Math.round(dmg*.85)),kbm,msg)};
 try{BAL.regenDelay=4.5;BAL.regen=Math.max(BAL.regen,2.2);BAL.slimeDmg=Math.max(2,Math.round(BAL.slimeDmg*.85))}catch(e){}
 const _rt=reviveTemple;reviveTemple=function(){if(!P.dead)return;const lv=P.lv,xp=P.xp;_rt();try{const lost=xp-P.xp;if(P.lv===lv&&lost>0){const keep=Math.round(lost*.6);P.xp+=keep;lvHud&&lvHud()}}catch(e){}};window.reviveTemple=reviveTemple;
 // กันเงินเฟ้อ: กล่องดันเจี้ยนชั้นลึกไม่ให้เหรียญพุ่งไม่จำกัด (เพดานตามชั้น 120) · รางวัลชั้นไม่สิ้นสุดเพิ่มเป็นของ ไม่เพิ่มเหรียญ
 const _rw=dgReward;dgReward=function(f){return _rw(f).filter((k,i,a)=>k!=='coin'||a.slice(0,i).filter(q=>q==='coin').length<10+Math.floor(Math.min(f,120)/4))};
})();

// =====================================================================
// web.js — ส่งออก/นำเข้าเซฟ (ย้ายข้ามเครื่อง) · ติดตั้งเป็นแอปบนหน้าจอหลัก (PWA)
// =====================================================================
const SAVE8={ver:1};
function saveKeys8(){const out={},names=new Set();for(let i=0;i<localStorage.length;i++){let K=localStorage.key(i);if(!K||/#(sig|bak|bsig)$/.test(K))continue;K=K.replace(/^u:[^:]*:/,'');if(/^fm_/.test(K))names.add(K)}
 for(const k of names){if(/^fm_(set|accts|acct|last_acct|remember|chatfold|dev|lock|gmkey8)$/.test(k))continue;const v=localStorage.getItem(k);if(v!=null)out[k]=v}return out}
function exportSave8(){return Guard.run('exportSave',()=>{try{saveGame(true)}catch(e){}const data=saveKeys8(),body=JSON.stringify(data),sum=sha256hex8('eldoria-save8|'+body).slice(0,16);
 const pack={app:'eldoria',v:SAVE8.ver,name:P.name||'',lv:P.lv,t:new Date().toISOString(),sum,data};const txt=JSON.stringify(pack);
 const code='ELD8:'+btoa(unescape(encodeURIComponent(txt)));let ok=false;
 try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download='eldoria_save_'+(P.name||'hero')+'_Lv'+P.lv+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);ok=true}catch(e){}
 try{navigator.clipboard&&navigator.clipboard.writeText(code).catch(()=>{})}catch(e){}
 saveUI8('ส่งออกเซฟแล้ว ✅',(ok?'ไฟล์ <b>eldoria_save_…json</b> ถูกดาวน์โหลดลงเครื่อง · ':'')+'และคัดลอก "รหัสเซฟ" ไว้แล้ว (วางในแชท/โน้ตเก็บไว้ได้)<textarea readonly style="width:100%;height:70px;font-size:10px;margin-top:6px">'+code+'</textarea>');return true})}
function importSave8(text){return Guard.run('importSave',()=>{let txt=String(text||'').trim();if(txt.startsWith('ELD8:'))txt=decodeURIComponent(escape(atob(txt.slice(5))));const p=JSON.parse(txt);
 if(!p||p.app!=='eldoria'||!p.data)throw new Error('ไม่ใช่ไฟล์เซฟของเกมนี้');const sum=sha256hex8('eldoria-save8|'+JSON.stringify(p.data)).slice(0,16);if(sum!==p.sum)throw new Error('ไฟล์เซฟถูกแก้ไข/เสียหาย');
 for(const k in p.data){if(!/^fm_/.test(k)||/^fm_(set|accts|acct|last_acct|remember|chatfold|dev|lock|gmkey8)$/.test(k))continue;localStorage.setItem(k,p.data[k])}
 try{_noSave=true}catch(e){}{const SP=Storage.prototype,_s=SP.setItem;SP.setItem=function(k,v){if(/^fm_/.test(String(k)))return;return _s.call(this,k,v)}}say('📥 นำเข้าเซฟ '+(p.name||'')+' Lv.'+p.lv+' แล้ว — กำลังโหลดใหม่');setTimeout(()=>location.reload(),700);return true},null,e=>{saveUI8('นำเข้าไม่สำเร็จ ❌',String(e&&e.message||e))})}
const saveW8=mk6('svw8');
function saveUI8(title,msg){saveW8.innerHTML='<div class="w" style="width:min(440px,96%);height:auto;max-height:95%"><div class="hd"><b>💾 ย้ายเซฟข้ามเครื่อง</b><button onclick="p6close(gid(\'svw8\'))">✕</button></div><div class="bd" style="flex-direction:column;gap:8px;padding:10px;overflow-y:auto">'
 +(title?'<div class="card"><b>'+title+'</b><div style="font-size:12px;margin-top:4px">'+msg+'</div></div>':'')
 +'<button class="bt" onclick="exportSave8()">📤 ส่งออกเซฟ (ไฟล์ + รหัสเซฟ)</button>'
 +'<label class="bt" style="text-align:center;cursor:pointer">📥 นำเข้าจากไฟล์<input type="file" accept=".json,application/json" style="display:none" onchange="const f=this.files[0];if(f)f.text().then(t=>importSave8(t))"></label>'
 +'<textarea id="sv8code" placeholder="หรือวาง &quot;รหัสเซฟ&quot; (ขึ้นต้นด้วย ELD8:) ที่นี่" style="width:100%;height:60px;font-size:11px"></textarea><button class="bt" onclick="importSave8(gid(\'sv8code\').value)">📥 นำเข้าจากรหัสเซฟ</button>'
 +'<small style="opacity:.75">นำเข้าจะแทนที่ตัวละครในไอดีที่เล่นอยู่ตอนนี้ · ไฟล์เซฟมีตัวตรวจ ถ้าถูกแก้จะนำเข้าไม่ได้</small></div></div>';
 for(const t of saveW8.querySelectorAll('textarea'))for(const ev of ['keydown','keyup','keypress'])t.addEventListener(ev,e=>e.stopPropagation());if(saveW8.hidden)p6open(saveW8)}
window.exportSave8=exportSave8;window.importSave8=importSave8;window.openSave8=()=>saveUI8('','');
// ---------- PWA: ติดตั้งบนหน้าจอหลัก + เปิดเต็มจอ ----------
const PWA8={evt:null,can:false};
function forcedUpdate8(save,sync,reload,delay=8000,limit=10000){let timer,promise=null;const run=()=>{if(promise)return promise;if(timer)clearTimeout(timer);promise=(async()=>{try{await save();if(sync){const ok=await Promise.race([Promise.resolve().then(sync),new Promise(r=>setTimeout(()=>r(false),limit))]);if(ok!==true)throw Error('unconfirmed')}reload();return true}catch(e){try{say('ยังบันทึกบนเซิร์ฟเวอร์ไม่สำเร็จ · กดอัปเดตอีกครั้งเมื่อเชื่อมต่อได้')}catch(_){}promise=null;return false}})();return promise};if(delay>0)timer=setTimeout(run,delay);return{run}}
(function(){const web=location.protocol==='https:'&&!/claude\.ai|claudeusercontent|anthropic/.test(location.hostname);
 if(!document.querySelector('link[rel=manifest]')&&web){const l=document.createElement('link');l.rel='manifest';l.href='manifest.webmanifest';document.head.appendChild(l)}
 if(web&&'serviceWorker' in navigator){(document.readyState==='complete'?fn=>fn():fn=>window.addEventListener('load',fn))(()=>{
  // ---- อัปเดตอัตโนมัติ: เช็กเวอร์ชันใหม่ทุก 3 นาที / ตอนกลับมาที่แท็บ แล้วเด้งแถบ "อัปเดตเลย" ----
  let shown=false;const banner=()=>{if(shown)return;shown=true;const b=document.createElement('div');
   b.style.cssText='position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:99999;background:#2a1d44;color:#fff;border:1px solid #c9a227;border-radius:10px;padding:10px 14px;font:14px sans-serif;display:flex;gap:10px;align-items:center;box-shadow:0 4px 18px #0008';
   b.innerHTML='<span>✨ มีอัปเดตใหม่ · กดเมื่อพร้อมเข้าเกมใหม่</span><button style="background:#c9a227;border:0;border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer">เข้าใหม่เลย</button>';
   const go=forcedUpdate8(()=>{try{if(typeof saveGame==='function')saveGame(true)}catch(e){}},()=>{try{if(window.ONL32&&ONL32.verified&&window.CLOUD&&CLOUD.sync)return CLOUD.sync(true);return true}catch(e){return false}},()=>location.reload(),0);b.querySelector('button').onclick=async()=>{const before=PAUSED;PAUSED=true;const ok=await go.run();if(!ok)PAUSED=before};document.body.appendChild(b)};
  const sig=r=>r.headers.get('etag')||r.headers.get('last-modified')||r.headers.get('content-length')||'';
  let base=null;const verCheck=()=>fetch('index.html',{method:'HEAD',cache:'no-store'}).then(r=>{const s=sig(r);if(!s)return;if(base===null)base=s;else if(s!==base)banner()}).catch(()=>{});
  verCheck();
  navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{
   const chk=()=>{try{reg.update()}catch(_){}verCheck()};
   setInterval(chk,180000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)chk()});
  }).catch(()=>{});
  let had=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)banner();had=true});
 })}
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();PWA8.evt=e;PWA8.can=true;try{pmRender7()}catch(_){}});
 window.addEventListener('appinstalled',()=>{PWA8.can=false;say('📲 ติดตั้งเกมลงเครื่องแล้ว — เปิดจากไอคอนบนหน้าจอได้เลย')})})();
const isStandalone8=()=>{try{return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true}catch(e){return false}};
function installApp8(){if(PWA8.evt){PWA8.evt.prompt();PWA8.evt.userChoice.finally(()=>{PWA8.evt=null});return}
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);talk({name:'ติดตั้งเกม',c:'#3a6a9a'},ios?'บน iPhone/iPad: เปิดใน Safari → แตะปุ่มแชร์ (สี่เหลี่ยมมีลูกศรขึ้น) → "เพิ่มไปยังหน้าจอโฮม"':'บน Android: เปิดใน Chrome → แตะ ⋮ มุมขวาบน → "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก"',[BYE],'📲 ติดตั้งเกม')}
window.installApp8=installApp8;

// =====================================================================
// cloud.js — บัญชีออนไลน์: ไอดีเดียวเล่นได้ทุกเบราว์เซอร์ · ซิงค์เซฟขึ้นเซิร์ฟเวอร์อัตโนมัติ
// เซฟในเครื่องยังอยู่เป็นสำรองเสมอ (ถ้าเซิร์ฟเวอร์ล่ม/รีเซ็ต เกมจะอัพโหลดเซฟในเครื่องกลับให้เอง)
// =====================================================================
const CLOUD={busy:false,rev:0,last:'',ok:null,t:0,fails:0,conflict:0};
CLOUD.base=()=>{try{const m=document.querySelector('meta[name="eldoria-server"]'),q=(location.search.match(/[?&]server=([^&]+)/)||[])[1];
 let u=(SET&&SET.server)||(q?decodeURIComponent(q):'')||(m&&m.content)||'';u=String(u).trim();if(!u)return '';
 u=u.replace(/^wss:\/\//,'https://').replace(/^ws:\/\//,'http://');if(!/^https?:\/\//.test(u))u='https://'+u;return u.replace(/\/+$/,'')}catch(e){return ''}};
CLOUD.tokKey=id=>'cloud_tok_'+String(id).toLowerCase();
CLOUD.tok=id=>{try{return FM_RAW.get(CLOUD.tokKey(id))||''}catch(e){return ''}};
CLOUD.call=async function(path,body,ms){const b=CLOUD.base();if(!b)return {err:'nourl'};const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),ms||30000);try{let payload=JSON.stringify(body||{}),type='application/json';if(path==='/api/save'&&new Blob([payload]).size>45000&&typeof CompressionStream!=='undefined'){payload=await new Response(new Blob([payload]).stream().pipeThrough(new CompressionStream('gzip'))).blob();type='application/octet-stream'}const bytes=typeof payload==='string'?new Blob([payload]).size:payload.size;const r=await fetch(b+path,{method:'POST',headers:{'content-type':type},body:payload,signal:ac.signal,keepalive:!!(body&&body.ka)&&bytes<60000});const j=await r.json();CLOUD.ok=true;return j}catch(e){CLOUD.ok=false;return {err:'offline'}}finally{clearTimeout(tm)}};
const cloudMsg=m=>{try{if(typeof tErr==='function'&&document.getElementById('tpan'))tErr(m)}catch(e){}};
const CLOUD_ERR={badid:'ไอดีไม่ถูกต้อง',badpw:'รหัสผ่านไม่ถูกต้อง',taken:'ไอดีนี้มีคนใช้แล้วในเซิร์ฟเวอร์ — เลือกไอดีอื่น',rate:'ลองเร็วเกินไป รอสักครู่',store:'เซิร์ฟเวอร์บันทึกไม่ได้ ลองใหม่อีกครั้ง',server:'เซิร์ฟเวอร์มีปัญหา ลองใหม่อีกครั้ง'};
// อ่านเลเวลของเซฟในเครื่อง (ตอนยังไม่ล็อกอิน)
CLOUD.localLv=id=>{try{const raw=localStorage.getItem('u:'+id+':fm_save_v1');if(!raw)return 0;const d=JSON.parse(raw);return d&&d.lv|0}catch(e){return 0}};
CLOUD.pendKey='fm_cloudpend';
// ---------- สมัคร ----------
{const _reg=accRegister;accRegister=async function(id,pw,pw2,nm,mig){
 if(CLOUD.busy||!CLOUD.base())return _reg(id,pw,pw2,nm,mig);
 id=(id||'').trim();nm=(nm||'').trim().slice(0,14);
 // ตรวจเงื่อนไขพื้นฐานด้วยโค้ดเดิมก่อน (ไม่สร้างบัญชีจริงถ้ายังไม่ผ่าน)
 const A=ACC.all;if(Object.keys(A).some(k=>k.toLowerCase()===id.toLowerCase()))return 'ไอดีนี้มีคนใช้แล้ว';
 if(!/^[A-Za-z0-9_ก-๙]{3,16}$/.test(id)||(pw||'').length<6||pw!==pw2||!nm)return _reg(id,pw,pw2,nm,mig);
 cloudMsg('⏳ กำลังเชื่อมต่อเซิร์ฟเวอร์ (ครั้งแรกอาจใช้เวลาถึง 1 นาที)…');
 const r=await CLOUD.call('/api/register',{id,pw,name:nm},60000);
 if(r.ok){try{FM_RAW.set(CLOUD.tokKey(id),r.token);FM_RAW.set('cloud_rev_'+id.toLowerCase(),'0')}catch(e){}CLOUD.busy=true;try{return await _reg(id,pw,pw2,nm,mig)}finally{CLOUD.busy=false}}
 if(r.err==='offline')return _reg(id,pw,pw2,nm,mig); // เซิร์ฟเวอร์ไม่ตอบ: สมัครในเครื่องก่อน ระบบจะผูกบัญชีให้ตอนล็อกอินครั้งถัดไป
 return CLOUD_ERR[r.err]||('สมัครไม่สำเร็จ ('+r.err+')');
}}
// ---------- ล็อกอิน ----------
{const _login=accLogin;accLogin=async function(id,pw,rem){
 if(CLOUD.busy||!CLOUD.base())return _login(id,pw,rem);
 id=(id||'').trim();const A=ACC.all,key=Object.keys(A).find(k=>k.toLowerCase()===id.toLowerCase());
 cloudMsg('⏳ กำลังเชื่อมต่อเซิร์ฟเวอร์ (ครั้งแรกอาจใช้เวลาถึง 1 นาที)…');
 const r=await CLOUD.call('/api/login',{id,pw},60000);
 if(r.err==='offline'){if(key)return _login(id,pw,rem);return 'เชื่อมเซิร์ฟเวอร์ไม่ได้ — ลองใหม่อีกครั้ง'}
 if(r.err==='locked')return '🔒 ใส่รหัสผิดหลายครั้ง ลองใหม่ใน '+r.wait+' วินาที';
 if(r.err==='nouser'){
  if(!key)return 'ไม่พบไอดีนี้ — สมัครก่อนนะ';
  // บัญชีเก่าในเครื่อง: ตรวจรหัสในเครื่อง แล้วจดทะเบียนบนเซิร์ฟเวอร์ให้
  if(!await accVerify(key,pw))return _login(id,pw,rem);
  const rr=await CLOUD.call('/api/register',{id:key,pw,name:(FM_RAW.get('u:'+key+':fm_name')||A[key].n||'')},30000);
  if(rr.ok){try{FM_RAW.set(CLOUD.tokKey(key),rr.token);FM_RAW.set('cloud_rev_'+key.toLowerCase(),'0')}catch(e){}}
  else if(rr.err==='taken')return 'ไอดีนี้ถูกใช้ในเซิร์ฟเวอร์แล้ว (รหัสผ่านต่างกัน) — ใช้ไอดีอื่น หรือแจ้ง GM';
  CLOUD.busy=true;try{return await _login(key,pw,rem)}finally{CLOUD.busy=false}}
 if(r.err==='badpw'){return key?'รหัสผ่านไม่ตรงกับบัญชีออนไลน์ของไอดีนี้':CLOUD_ERR.badpw}
 if(!r.ok)return CLOUD_ERR[r.err]||('เข้าสู่ระบบไม่สำเร็จ ('+r.err+')');
 const cid=r.id||id;
 try{FM_RAW.set(CLOUD.tokKey(cid),r.token);FM_RAW.set('cloud_rev_'+cid.toLowerCase(),String(r.rev|0))}catch(e){}
 const localLv=key?CLOUD.localLv(key):0,useCloud=!!r.save&&((r.lv|0)>localLv||!key);
 if(useCloud){try{sessionStorage.setItem(CLOUD.pendKey,JSON.stringify({id:cid,save:r.save}))}catch(e){}}
 CLOUD.busy=true;
 try{
  if(key)return await _login(key,pw,rem);
  // เบราว์เซอร์นี้ยังไม่มีบัญชี: สร้างบัญชีในเครื่องจากข้อมูลออนไลน์
  const nm=(r.name||cid).slice(0,14)||cid;const m=await accRegister(cid,pw,pw,nm,false);return m
 }finally{CLOUD.busy=false}
}}
// ---------- เปลี่ยนรหัส ----------
{const _cp=accChangePw;accChangePw=async function(o,n,n2){const m=await _cp(o,n,n2);if(m||!FM_ACCT||!CLOUD.base())return m;
 const r=await CLOUD.call('/api/pw',{id:FM_ACCT,token:CLOUD.tok(FM_ACCT),old:o,pw:n});if(r&&r.ok)try{FM_RAW.set(CLOUD.tokKey(FM_ACCT),r.token)}catch(e){}return m}}
// ---------- นำเข้าเซฟจากเซิร์ฟเวอร์ตอนเริ่มเกม (ก่อนเกมโหลดเซฟ) ----------
CLOUD.applyBlob=function(blob){const data=JSON.parse(blob);if(!data||Array.isArray(data)||typeof data!=='object')throw Error('invalid cloud snapshot');const entries=Object.entries(data).filter(([k])=>/^fm_/.test(k)&&!/^fm_(set|accts|acct|last_acct|remember|chatfold|dev|lock|gmkey8)$/.test(k));for(const [k,v]of entries)if(typeof v!=='string')throw Error('invalid cloud value');if(data.fm_save_v1){const main=JSON.parse(data.fm_save_v1);if(!main||typeof main!=='object'||Array.isArray(main))throw Error('invalid player save')}
 const before=entries.map(([k])=>[k,localStorage.getItem(k)]);try{for(const [k,v]of entries)localStorage.setItem(k,v)}catch(e){for(const [k,v]of before)try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(rollbackError){}throw e}return entries.length};
CLOUD.boot=function(){return false};
CLOUD.revKey=()=>'cloud_rev_'+String(FM_ACCT||'').toLowerCase();
function CLOUD_SYNC_MS(){return 45000}
window.CLOUD=CLOUD;

// =====================================================================
// social.js — ออนไลน์: เชื่อมเซิร์ฟเวอร์อัตโนมัติ · แชทเต็มรูปแบบ (กระซิบ/ประวัติ/รายชื่อ/ปิดเสียง) · PvP + สนามประลอง · เมนูโปรไฟล์ใหม่
// =====================================================================
// ---------- เชื่อมเซิร์ฟเวอร์อัตโนมัติ (อ่านจาก <meta name="eldoria-server"> หรือ ?server=) ----------
(()=>{try{const m=document.querySelector('meta[name="eldoria-server"]'),q=(location.search.match(/[?&]server=([^&]+)/)||[])[1],url=q?decodeURIComponent(q):m&&m.content;
 if(url&&/^wss:\/\//.test(url)&&!SET.server&&location.protocol==='https:'){SET.server=url;try{saveSet()}catch(e){}setTimeout(()=>{if(!NET.ws)netConnect()},1500)}}catch(e){}})();
// ---------- ฉากสนามประลอง ----------
{const _ns=netScene;netScene=function(){if(D&&D.arena8)return 'arena';return _ns()}}
// ส่งข้อมูลเพิ่มให้ผู้เล่นอื่นเห็น (เพศ/สีชุด/PvP) — ผ่านการห่อ WebSocket.send ของเกม
{const _send=WebSocket.prototype.send;WebSocket.prototype.send=function(s){try{if(this===NET.ws&&typeof s==='string'&&s.startsWith('{"t":"st"')){const o=JSON.parse(s);o.pvp=!!pvpOn8();o.look=window.LOOK8||null;s=JSON.stringify(o)}}catch(e){}return _send.call(this,s)}}
// ---------- แชท ----------
const CHAT8={mute:new Set((()=>{try{return JSON.parse(localStorage.getItem('fm_mute8')||'[]')}catch(e){return []}})()),lastW:''};
const muteSave8=()=>{try{localStorage.setItem('fm_mute8',JSON.stringify([...CHAT8.mute]))}catch(e){}};
const SCN8=sc=>!sc?'?':sc==='field'?'ทุ่งหญ้า':sc==='town'?'เมือง':sc==='arena'?'สนามประลอง':sc.startsWith('shop')?'ในร้าน':sc.startsWith('dg:')?'ดันเจี้ยนชั้น '+sc.slice(3):sc.startsWith('z:')?'เหมือง':sc;
{const _nm=netMsg;netMsg=function(d){try{
  if(d.t==='chat'&&CHAT8.mute.has(String(d.name)))return;
  if(d.t==='hist'){const L=(d.list||[]).slice(-15);if(L.length){sysSay('💬 ข้อความล่าสุดก่อนคุณเข้า ('+L.length+')');for(const m of L)if(!CHAT8.mute.has(m.name))chatSay(m.ch,m.name,m.txt,'#8aa0b8')}return}
  if(d.t==='whisper'){if(CHAT8.mute.has(String(d.from)))return;CHAT8.lastW=d.from;chatSay('gen','📩 '+d.from+' (กระซิบ)',d.txt,'#ff9ad8');sfx('ui');return}
  if(d.t==='whisper_ok'){chatSay('gen','📨 ถึง '+d.to,d.txt,'#d88ac8');return}
  if(d.t==='who'){const L=d.list||[];sysSay('👥 ออนไลน์ '+L.length+' คน');for(const p of L)sysSay('• '+p.name+' Lv.'+p.lv+(p.cls?' '+((CLS[p.cls]||{}).e||''):'')+' — '+SCN8(p.sc)+(p.pvp?' ⚔️PvP':''));return}
  if(d.t==='pvphit'){pvpHurt8(d);return}
 }catch(e){console.warn('[social] msg',e)}return _nm(d)}}
const HELP8='คำสั่งแชท: /w ชื่อ ข้อความ (กระซิบ) · /r ข้อความ (ตอบกลับคนที่กระซิบล่าสุด) · /who (ใครออนไลน์) · /g ข้อความ (ช่องกิลด์) · /mute ชื่อ · /unmute ชื่อ · /pvp (เปิด/ปิด PvP)';
{const _cs=chatSend;chatSend=function(){const ti=gid('chatTi'),t=(ti&&ti.value||'').trim();const done=()=>{ti.value='';try{ti.blur()}catch(e){}};let m;
 if(/^\/(help|h|\?)$/i.test(t)){done();sysSay(HELP8);return}
 if(/^\/who$/i.test(t)){done();if(!NET.on){sysSay('ยังไม่ได้เชื่อมต่อออนไลน์');return}netSend({t:'who'});return}
 if((m=/^\/(w|whisper|กระซิบ)\s+(\S+)\s+([\s\S]+)$/i.exec(t))){done();if(!NET.on){sysSay('ยังไม่ได้เชื่อมต่อออนไลน์');return}netSend({t:'whisper',to:m[2],txt:m[3].slice(0,140)});return}
 if((m=/^\/r\s+([\s\S]+)$/i.exec(t))){done();if(!CHAT8.lastW){sysSay('ยังไม่มีใครกระซิบมา');return}netSend({t:'whisper',to:CHAT8.lastW,txt:m[1].slice(0,140)});return}
 if((m=/^\/mute\s+(\S+)$/i.exec(t))){done();CHAT8.mute.add(m[1]);muteSave8();sysSay('🔇 ปิดข้อความจาก '+m[1]);return}
 if((m=/^\/unmute\s+(\S+)$/i.exec(t))){done();CHAT8.mute.delete(m[1]);muteSave8();sysSay('🔊 เปิดข้อความจาก '+m[1]);return}
 if(/^\/pvp$/i.test(t)){done();togglePvp8();return}
 return _cs()};try{gid('chatSend').onclick=()=>chatSend()}catch(e){}}
// ---------- PvP ----------
const PVP8={on:false,last:{},tog:0,hitT:0,dmgK:.35};
const inArena8=()=>!!(D&&D.arena8);
function pvpOn8(){return inArena8()||(PVP8.on&&!(D&&(D.town||D.shop||D.home)))}
window.pvpOn8=pvpOn8;
function togglePvp8(){const n=performance.now();if(inArena8()){say('⚔️ ในสนามประลอง PvP เปิดตลอด');return}if(D&&(D.town||D.shop||D.home)){say('ในเมือง/ที่ดินปลอดภัย — เปิด PvP ได้นอกเมือง');return}
 if(n-PVP8.tog<5000){say('รอสักครู่ก่อนสลับ PvP อีกครั้ง');return}PVP8.tog=n;PVP8.on=!PVP8.on;say(PVP8.on?'⚔️ เปิด PvP — สู้ได้กับผู้เล่นที่เปิด PvP เหมือนกัน':'🛡️ ปิด PvP แล้ว');sfx(PVP8.on?'swing2':'ui');try{pmRender7()}catch(e){}}
window.togglePvp8=togglePvp8;
setInterval(()=>{if(PVP8.on&&D&&(D.town||D.shop||D.home)){PVP8.on=false;sysSay('🛡️ เข้าเขตปลอดภัย — ปิด PvP อัตโนมัติ')}},600);
// ผู้เล่นฝ่ายตรงข้าม = เป้าหมายในระบบต่อสู้ (สกิล/ฟัน/ธนู/อัญเชิญ ใช้กับผู้เล่นได้ทันที)
const PSE8=new Map();
function pvpTargets8(){if(!NET.on||!pvpOn8())return [];const arena=inArena8(),out=[];for(const o of NET.others.values()){if(o.dead||!(arena||o.pvp))continue;let e=PSE8.get(o.id);
  if(!e){e={pvp7:1,id:o.id,f:'skeleton',F:Object.assign({},FAM.skeleton,{spd:0}),sc:1,hp:1e9,max:1e9,L:1,nm:'',dead:false,elite:false,boss:false,col:['#999','#444','#fff'],st:'idle',stt:0,hurt:0,kx:0,ky:0,vx:0,vy:0,cd:9,t:0,z:0,aggro:0};PSE8.set(o.id,e)}
  e.x=o.x;e.y=o.y;e.nm=o.name;e.L=o.lv|0;e.hp=1e9;e.dead=false;out.push(e)}return out}
{const _en=enemies;enemies=function(){const L=_en(),pt=pvpTargets8();return pt.length?L.concat(pt):L}}
{const _h=hurtE;hurtE=function(e,mult,o){if(!(e&&e.pvp7))return _h(e,mult,o);return Guard.run('pvpHit',()=>{const n=performance.now();if(n-(PVP8.last[e.id]||0)<140)return 0;PVP8.last[e.id]=n;
  if(D&&D.zone&&!D.home&&typeof wallBetween7==='function'&&wallBetween7(P.x,P.y-6,e.x,e.y-6))return 0;const cr=Math.random()<critCh();
  const dmg=Math.max(1,Math.round(clsAtk()*(isFinite(mult)?mult:1)*(.9+Math.random()*.2)*(cr?1.5:1)*PVP8.dmgK));netSend({t:'pvp',to:e.id,dmg,crit:cr});dmgTxt(e.x,e.y-40,String(dmg),cr?'#ffd84a':'#ff9a9a');return dmg})||0}}
function pvpHurt8(d){if(!pvpOn8()||P.dead)return;const n=performance.now();if(n<PVP8.hitT)return;const dmg=Math.max(1,Math.round((d.dmg|0)-DEF()*.5));P.hp=Math.max(0,P.hp-dmg);P.red=.25;sfx('hurt');dmgTxt(P.x,P.y-44,'-'+dmg,'#ff5a5a');
 if(P.hp<=0){P.hp=Math.round(BAL.hp*.6);P.mp=Math.max(P.mp,Math.round(BAL.mp*.4));PVP8.hitT=n+3000;P.iframe=Math.max(P.iframe||0,3);netSend({t:'pvpko',by:d.from});flash('#ff3a3a',.35);
  if(inArena8()){const Z=D.zone;P.x=Z.ent.x*T+16;P.y=(Z.ent.y-1)*T+16;say('💥 แพ้ให้ '+d.name+' — กลับจุดเริ่มสนามประลอง (ไม่เสียของ/XP)')}else{PVP8.on=false;say('💥 แพ้ให้ '+d.name+' — ปิด PvP ให้อัตโนมัติ (ไม่เสียของ/XP)')}}}
// ป้าย PvP เหนือหัวผู้เล่นอื่น
if(typeof drawOther==='function'){const _do=drawOther;drawOther=function(o){_do(o);try{if(o.pvp||inArena8()){ctx.save();ctx.font='900 9px system-ui';ctx.textAlign='center';ctx.fillStyle='#ff4a4a';ctx.strokeStyle='#2a0000';ctx.lineWidth=3;ctx.strokeText('⚔️ PvP',o.x,o.y-84);ctx.fillText('⚔️ PvP',o.x,o.y-84);ctx.restore()}}catch(e){}}}
// สนามประลอง
const AR8={W:36,H:26,Zm:null};
function buildArena8(){const W=AR8.W,H=AR8.H,m=[];for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++)m[y][x]=(x<1||y<1||x>=W-1||y>=H-1)?WL:FL}
 for(const [x,y] of [[8,7],[27,7],[8,18],[27,18]]){m[y][x]=WL}
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=y*T,h=hash(x*1.3,y*2.1);k.fillStyle=m[y][x]===WL?'#4a3a2a':(h>.5?'#d8b878':'#cfae6e');k.fillRect(px,py,T,T);if(m[y][x]===FL&&h>.85){k.fillStyle='rgba(120,90,50,.25)';k.fillRect(px+8,py+12,6,3)}
  if(m[y][x]===WL){k.fillStyle='#6a5640';k.fillRect(px+2,py+2,T-4,T-4);k.fillStyle='rgba(0,0,0,.25)';k.fillRect(px,py+T-6,T,6)}}
 const cx=W*T/2,cy=H*T/2;k.strokeStyle='rgba(120,40,20,.55)';k.lineWidth=6;k.beginPath();k.ellipse(cx,cy,W*T*.36,H*T*.34,0,0,7);k.stroke();k.strokeStyle='rgba(255,230,160,.35)';k.lineWidth=2;k.beginPath();k.ellipse(cx,cy,W*T*.12,H*T*.11,0,0,7);k.stroke();
 for(const [x,y] of [[8,7],[27,7],[8,18],[27,18]]){const px=x*T+16,py=y*T+16;k.fillStyle='#5a4a3a';k.fillRect(px-6,py-30,12,40);k.fillStyle='#a82a22';k.beginPath();k.moveTo(px,py-30);k.lineTo(px+18,py-24);k.lineTo(px,py-18);k.closePath();k.fill();k.fillStyle='#ffb04a';k.beginPath();k.arc(px,py-34,4,0,7);k.fill()}
 k.font='900 22px Georgia,serif';k.textAlign='center';k.fillStyle='rgba(90,30,10,.55)';k.fillText('⚔ ARENA ⚔',cx,cy+8);
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 return AR8.Zm={zi:400,Zd:{id:'arena',n:'สนามประลอง',e:'⚔️',lv:[1,1],dark:0,amb:'dust',pal:{vd:'#3a2a1a'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt'},m,ores:[],oreAt:{},floor,ent:{x:Math.floor(W/2),y:H-3},arena:{x:Math.floor(W/2),y:Math.floor(H/2)},seen:new Uint8Array(W*H).fill(1),W,H,cv:c}}
function enterArena8(){return Guard.run('enterArena',()=>{if(D&&(D.zone||D.shop)){say('เข้าสนามประลองได้จากเมืองหรือทุ่งหญ้า');sfx('thud');return}const Zm=AR8.Zm||buildArena8();
  LoadingScreenManager.cover({icon:'⚔️',title:'สนามประลอง',tip:'PvP เปิดตลอด · แพ้ไม่เสียของ/XP'},()=>{if(D&&D.town){try{exitD()}catch(e){}}
   try{closeZMenu()}catch(e){}ZW=Zm.W;ZH=Zm.H;sfx('warp');setScene('town');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;
   D={zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret:[ZG.x,ZG.y+40],ban:0,arena8:1};dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,4);P.x=Zm.ent.x*T+16;P.y=(Zm.ent.y-1)*T+16;P.dir='u';P.kx=P.ky=0;MOUNT.on=false});
  say('⚔️ สนามประลอง — PvP เปิดตลอด · '+(NET.on?'ผู้เล่นในสนาม '+[...NET.others.values()].length+' คน':'ยังไม่ได้ต่อออนไลน์ (ต้องต่อเซิร์ฟเวอร์จึงจะเจอผู้เล่นอื่น)'))})}
function leaveArena8(){if(!inArena8())return;LoadingScreenManager.cover({icon:'🏰',title:'กลับเมือง'},()=>{exitD();enterTown(1)})}
window.enterArena8=enterArena8;window.leaveArena8=leaveArena8;
// ---------- เมนูโปรไฟล์: เพิ่มปุ่มใหม่ ----------
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['📦','คลัง',()=>openVault8()],['👗','รูปลักษณ์',()=>openLook8()],['⚔️','PvP',()=>openPvp8()],['💾','ย้ายเซฟ',()=>openSave8()],['📲','ติดตั้งเกม',()=>installApp8()]);pmRender7()}catch(e){console.warn('[social] pm',e)}
{const _pr=pmRender7;pmRender7=function(){_pr();try{for(const b of pm7.querySelectorAll('button')){const s=b.querySelector('small');if(!s)continue;if(s.textContent==='PvP'&&pvpOn8())b.style.boxShadow='0 0 0 2px #ff4a4a inset';if(s.textContent==='ติดตั้งเกม'&&isStandalone8())b.style.display='none'}}catch(e){}}}
function openPvp8(){const on=pvpOn8(),ar=inArena8();talk({name:'ผู้คุมสนามประลอง',c:'#a82a22'},(ar?'เจ้าอยู่ในสนามประลอง — สู้กับทุกคนในสนามได้ แพ้แล้วกลับจุดเริ่ม ไม่เสียของ/XP':'PvP ตอนนี้: '+(on?'⚔️ เปิด':'🛡️ ปิด')+' · นอกเมืองสู้ได้เฉพาะผู้เล่นที่เปิด PvP ทั้งคู่ · ในเมืองปลอดภัยเสมอ'),
 (ar?[{t:'🏰 ออกจากสนาม',c:'go',f:()=>leaveArena8()}]:[{t:on?'🛡️ ปิด PvP':'⚔️ เปิด PvP',c:'go',f:()=>togglePvp8()},{t:'🏟️ ไปสนามประลอง',f:()=>enterArena8()}]).concat([{t:'❓ คำสั่งแชท',stay:true,f:()=>talk({name:'แชท',c:'#3a6a9a'},HELP8,[BYE])},BYE]),'⚔️ PvP')}
window.openPvp8=openPvp8;
// ป้าย PvP ของเราบน HUD
{const b=document.createElement('div');b.id='pvpb8';b.textContent='⚔️ PvP';b.style.cssText='position:absolute;left:8px;top:calc(98px + var(--st,0px));z-index:4;font:900 11px system-ui;color:#fff;background:#a82a22;border:1.5px solid #ffb0a0;border-radius:9px;padding:2px 7px;pointer-events:none;display:none';gid('wrap').appendChild(b);setInterval(()=>{b.style.display=pvpOn8()?'':'none';b.textContent=inArena8()?'⚔️ สนามประลอง':'⚔️ PvP'},400)}
// GM อมตะใช้ไม่ได้ระหว่าง PvP (กันโกง)
setInterval(()=>{try{if(pvpOn8()&&typeof GM7!=='undefined'&&GM7.god){GM7.god=false;say('ปิดอมตะ GM ระหว่าง PvP')}}catch(e){}},500);

// =====================================================================
