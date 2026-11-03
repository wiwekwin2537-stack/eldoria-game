// ===== v1.9 : เลเวล · อุปกรณ์ · ร้านชำ · เตาหลอม/ตีบวก · คราฟยา · ที่นั่งโรงเตี๊ยม · ลดกระตุก =====
const TINT=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const n=vn(x/6+9,y/6+3);TINT[y*W+x]=n>.5?`rgba(255,235,120,${(n-.5)*.28})`:`rgba(10,60,40,${(.5-n)*.3})`}
if(!SET.v19){SET.v19=1;SET.res=Math.min(SET.res||1,COARSE?1:1.5);SET.grade=false;if(COARSE)SET.grass=false;saveSet();RES=SET.res;applyRes()}
// ระบบเลเวลผู้เล่น
Object.assign(P,{lv:1,xp:0,w:0,a:0,wp:0,ap:0});
const EQ={w:[{n:'ดาบไม้ฝึกหัด',a:0},{n:'ดาบเหล็กกล้า',a:2},{n:'ดาบเงินยวง',a:4},{n:'ดาบมังกรไทย',a:7}],a:[{n:'ชุดผ้าฝ้าย',d:0},{n:'เสื้อเกราะหนัง',d:1},{n:'เกราะโซ่เหล็ก',d:2},{n:'เกราะเกล็ดนาค',d:4}]};
const ATK=()=>Math.round((window.atkMul?atkMul():1)*(1+(P.armor.sword?SWATK[P.tier.sword]+(window.enhAtk?enhAtk(ENH[P.armor.sword]||0):(ENH[P.armor.sword]||0)):0)+(window.PRIM10?PRIM10():P.stats.str)+ringAtk()+((P.lv-1)>>1))),DEF=()=>armorDef()+(P.stats.vit>>1)+((P.lv-1)>>2),need=l=>Math.round((20+l*l*12)*(l<20?1:1+(l-20)/40));
const lvBox=document.getElementById('coinbox');lvBox.style.whiteSpace='nowrap';lvBox.insertAdjacentHTML('beforeend',' · ⭐Lv.<b id="lvhud">1</b> <small id="xphud"></small>');
function lvHud(){document.getElementById('lvhud').textContent=P.lv;document.getElementById('xphud').textContent=P.xp+'/'+need(P.lv)}
/* Sole XP owner. Stages become ready at their original module initialization points. */
const XP_PIPELINE=Object.create(null);
function gainXp(n){
 const stages=XP_PIPELINE;
 const quota=stages.quota;
 if(quota)try{if(typeof n==='number'&&n>0&&quota.active()){
  const state=quota.state;
  if(state.share>0)n=Math.max(1,Math.round(n*quota.multiplier*state.ema));
  else{const now=performance.now();while(state.q.length&&now-state.q[0].t>1500)state.q.shift();const i=state.q.findIndex(q=>q.n===n);if(i>=0){const q=state.q.splice(i,1)[0];n=Math.max(1,Math.round(n*quota.multiplier*q.f))}}
 }}catch(e){}
 const rage=stages.rage;
 if(rage)try{if(rage.active()&&typeof n==='number'&&n>0)n=Math.round(n*.4*rage.combo()*rage.party())}catch(e){}
 if(stages.legend&&typeof MAXLV!=='undefined'&&P.lv>=MAXLV&&typeof n==='number'&&n>0){const m=window.__noXpm64?n:Math.round(n*(window.XPM64||1));stages.legend.add(m);return}
 if(stages.high&&typeof n==='number'&&n>0&&!window.__noXpm64){const k=P.lv>=100?.6:P.lv>=80?.75:1;if(k<1)n=Math.max(1,Math.round(n*k))}
 if(stages.testing&&typeof n==='number'&&n>0&&!window.__noXpm64)n=Math.max(1,Math.round(n*stages.testing.multiplier));
 if(stages.nerf)n=Math.max(1,Math.round((+n||0)*.8));
 if(stages.event)n=EV11.cur&&EV11.cur.k==='xp'&&n>0?n*2:n;
 if(stages.guard)return Guard.run('gainXp',()=>{
  const l0=P.lv;let v=Number(n)||0;
  v=Math.max(0,Math.round(Hooks.apply('xp',v)));
  applyPlayerXp(v);
  EventBus.emit(EV.XP_GAINED,{amount:v,base:n,lv:P.lv});
  if(P.lv>l0)EventBus.emit(EV.LEVEL_UP,{from:l0,to:P.lv});
 });
 return applyPlayerXp(n);
}
window.gainXp=gainXp;
function applyPlayerXp(n){
 const stages=XP_PIPELINE,levels=[];
 /* Capture in the same order as the former outer-to-inner calls. */
 if(stages.fx)levels[6]=P.lv;
 if(stages.skills)levels[5]=P.lv;
 let f0;if(stages.passive){levels[4]=P.lv;f0=ptTotal()}
 if(stages.classes)levels[3]=P.lv;
 if(stages.guild)levels[2]=P.lv;
 if(stages.cap&&P.lv>=MAXLV){P.xp=0;lvHud()}
 else{
  if(stages.stats)levels[0]=P.lv;
  P.xp+=n;let up=0;while(P.xp>=need(P.lv)&&P.lv<(typeof MAXLV!=='undefined'?MAXLV:150)){P.xp-=need(P.lv);P.lv++;up=1}
 if(up){BAL.hp=100+(P.lv-1)*15;BAL.mp=50+(P.lv-1)*5;P.hp=BAL.hp;P.mp=BAL.mp;sfx('heal');say('⭐ เลเวลอัป! Lv.'+P.lv+' เลือดสูงสุด '+BAL.hp+' โจมตี '+ATK())}else say('+'+n+' XP');lvHud();refreshInv()
  if(stages.stats){if(P.lv>levels[0]){const g=3*(P.lv-levels[0]);P.sp+=g;recalcStats();P.hp=BAL.hp;P.mp=BAL.mp;say('⭐ เลเวลอัป! Lv.'+P.lv+' ได้แต้มสเตตัส +'+g+' (กดรูปโปรไฟล์เพื่ออัพ)');updBadge();lvHud()}}
  if(stages.cap&&P.lv>=MAXLV)P.xp=0;
 }
 if(stages.guild){if(P.lv>levels[2]){const m=GUILD.mem[Math.random()*GUILD.mem.length|0];setTimeout(()=>chatSay('guild',m[0],'ยินดีด้วย Lv.'+P.lv+' แล้ว! 🎉',m[1]),1200);saveGame()}}
 if(stages.classes){if(P.lv>levels[3]){if(levels[3]<CLASS_LV&&P.lv>=CLASS_LV)chatAnn('Lv.'+CLASS_LV+' แล้ว! ไปเลือกอาชีพกับปรมาจารย์ซีรอสที่จัตุรัสได้เลย');const L=CSKILLS[P.cls];if(L&&P.cls!=='none')for(const s of L)if(levels[3]<s.lv&&P.lv>=s.lv){castBanner('ปลดล็อกสกิล: '+s.n,'#ffd84a');say('✨ ปลดล็อกสกิลใหม่ '+s.e+' '+s.n+'!')}
 for(const p of (PASSIVE[P.cls]||[]))if(levels[3]<p.lv&&P.lv>=p.lv)say('🌟 ปลดล็อกพาสซีฟ '+p.n+' — '+p.d)}}
 if(stages.passive){if(P.lv>levels[4]&&ptTotal()>f0){setTimeout(()=>say('🌟 ได้แต้มพาสซีฟ +'+(ptTotal()-f0)+' — กดปุ่ม 🌟 (K) เพื่ออัพ'),1600);updPasBadge()}}
 if(stages.skills){const L=CSKILLS[P.cls];if(L&&P.lv>levels[5])L.forEach((s,i)=>{if(s.lv>levels[5]&&s.lv<=P.lv){setTimeout(()=>{say('✨ ปลดล็อกสกิลใหม่: '+s.e+' '+s.n+'! กด 🌟 (K) → สกิล เพื่อใส่ช่อง');if(typeof chatAnn==='function')sysSay('ปลดล็อกสกิล '+s.n)},2400)}})}
 if(stages.fx){if(P.lv>levels[6]){banner('LEVEL UP!','Lv.'+P.lv+' · ได้แต้มสเตตัส +'+3*(P.lv-levels[6]));fanfare();
  for(let i=0;i<40;i++){const a=Math.random()*6.28,r=Math.random()*18;rfxP(P.x+Math.cos(a)*r,P.y-Math.random()*10,Math.cos(a)*20,-90-Math.random()*140,1.1,Math.random()<.5?'255,220,90':'255,255,220',2.4,'spark')}RFX.push({k:'ring',x:P.x,y:P.y,t:0,l:.6,rgb:'255,220,90',s:50})}}
}

dropLoot=function(x,y,sl){const lv=(sl&&sl.lv)||1,n=1+(Math.random()<.4?1:0),c=1+Math.floor(Math.random()*3)+(lv>>1);for(let i=0;i<n;i++)addDrop('gel',x,y);for(let i=0;i<c;i++)addDrop('coin',x,y);if(sl)setTimeout(()=>gainXp(5*lv),30)};
const _dsl=drawSlime;drawSlime=function(s){const k=1+((s.lv||1)-1)*.07;if(k>1){ctx.save();ctx.translate(s.x,s.y);ctx.scale(k,k);ctx.translate(-s.x,-s.y);_dsl(s);ctx.restore()}else _dsl(s);
 ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.lineWidth=2.5;ctx.strokeStyle='#000';const t='Lv.'+(s.lv||1);ctx.strokeText(t,s.x,s.y-26*k);ctx.fillStyle=['#9f9','#cf9','#ff9','#fb7','#f77'][(s.lv||1)-1];ctx.fillText(t,s.x,s.y-26*k);ctx.textAlign='left'};
// กระเป๋า: ช่องใหม่


function drink(k){if(!inv[k]){say('ไม่มียาในกระเป๋า');return}if(k==='hpp'){if(P.hp>=BAL.hp){say('เลือดเต็มอยู่แล้ว');return}P.hp=Math.min(BAL.hp,P.hp+60)}else{if(P.mp>=BAL.mp){say('มานาเต็มอยู่แล้ว');return}P.mp=Math.min(BAL.mp,P.mp+40)}inv[k]--;sfx('heal');refreshInv();say(k==='hpp'?'🧪 ดื่มยาเลือด +60':'💧 ดื่มยามานา +40')}
addEventListener('keydown',e=>{if(e.key==='h'||e.key==='H')drink('hpp');else if(e.key==='n'||e.key==='N')drink('mpp')});
// ร้านค้า: ปรับให้ตรงหน้าที่ + ชื่อร้านแบบไทย ๆ
const SD=SHOP_DATA;
Object.assign(SD.gear,{name:'ร้านอาวุธเกราะลุงเหล็ก',sell:[],buy:[
 {id:'w1',eq:'w',tier:1,name:'ดาบเหล็กกล้า',emoji:'🗡️',price:80,note:'โจมตี +2'},{id:'w2',eq:'w',tier:2,name:'ดาบเงินยวง',emoji:'🗡️',price:220,note:'โจมตี +4'},{id:'w3',eq:'w',tier:3,name:'ดาบมังกรไทย',emoji:'🐉',price:520,note:'โจมตี +7'},
 {id:'a1',eq:'a',tier:1,name:'เสื้อเกราะหนัง',emoji:'🥋',price:70,note:'ป้องกัน +1'},{id:'a2',eq:'a',tier:2,name:'เกราะโซ่เหล็ก',emoji:'🛡️',price:200,note:'ป้องกัน +2'},{id:'a3',eq:'a',tier:3,name:'เกราะเกล็ดนาค',emoji:'🐍',price:480,note:'ป้องกัน +4'}]});
SD.gear.owner.name='ลุงเหล็ก';SD.gear.owner.lines=['ดาบเล่มนี้ตีเองกับมือ คมกริบเลยล่ะ','ร้านข้าขายแต่อาวุธกับเกราะนะ ของฟาร์มไปขายร้านชำโน่น','อยากให้ของแกร่งขึ้น ไปตีบวกที่ทั่งข้างร้านได้เลย','ของข้า ไม่มีใครสู้ได้ในเอลโดเรีย'];
Object.assign(SD.potion,{name:'ร้านยาหมอใจดี',sell:[]});SD.potion.buy=SD.potion.buy.filter(b=>b.id!=='scroll');SD.potion.craft=['mpp','hpp'];
SD.potion.owner.lines=['เอาขวดเปล่ากับเจลสไลม์มา เดี๋ยวสอนปรุงยาเอง','ขวดเปล่าซื้อที่ร้านป้าแดงนะจ๊ะ','ยาฟื้นเลือดขวดนี้ ดื่มแล้วหายเหนื่อยทันที','สมุนไพรกลิ่นหอมดีไหมจ๊ะ'];
SD.inn.name='โรงเตี๊ยมบัวหลวง';
SIGN_ICONS.store=k=>{k.fillStyle='#c79a52';k.beginPath();k.ellipse(0,6,15,14,0,0,7);k.fill();k.strokeStyle=OUT;k.lineWidth=3;k.stroke();k.fillStyle='#e8c14a';k.fillRect(-7,-12,14,5);k.strokeRect(-7,-12,14,5);dot_(k,0,7,5,'#ffd84a')};
SD.store={name:'ร้านชำป้าแดง',emoji:'🧺',icon:'store',img:'house1',b:[17,23,5,4],door:{x:62,w:36,t:74,bt:126},sign:{x:128,y:84,arm:24},
 owner:{name:'ป้าแดง',c:'#c0392b',h:'#d8d4c8',greet:['มาจ้ะลูก ร้านชำป้ามีของใช้ครบ','เอาอะไรดีจ๊ะ ม้วนวาป ขวดเปล่า มีหมด'],lines:['ของฟาร์มเอามาขายป้าได้เลย ไม้ แร่ เจล ป้ารับหมด','ม้วนวาปพกไว้สักม้วนนะลูก','ขวดเปล่าเอาไปให้หมอยาปรุงยานะจ๊ะ','ป้าให้ราคายุติธรรมเสมอ']},
 solid:SD.potion.solid.slice(),sell:[['wood','ไม้',4],['ore','เพชร',30],['gel','เจลสไลม์',4],['ingot','แท่งเหล็ก',45]],
 buy:[{id:'scroll',name:'ม้วนวาปกลับเมือง',emoji:'📜',price:25,note:'ใช้ตอนอยู่นอกเมือง'},{id:'bottle',give:'bottle',name:'ขวดเปล่า',emoji:'🍶',price:3,note:'ไว้ปรุงยาที่ร้านหมอยา'}]};
SHOP_ORDER.push('store');SHOP_ART.store=SHOP_ART.potion;SHOP_ANIM.store=SHOP_ANIM.potion;SHOP_TINT.store='rgba(255,210,120,.08)';
function shopName(k,S){const [bx,by,bw]=S.b;k.save();k.font='bold 12px system-ui,"Noto Sans Thai",sans-serif';const w=k.measureText(S.name).width+20,cx=bx*T+bw*T/2,y=by*T-4;
 rr(k,cx-w/2,y,w,21,5);k.fillStyle='#4a2e16';k.fill();k.strokeStyle='#e8c14a';k.lineWidth=2;k.stroke();k.fillStyle='#fff3c8';k.textAlign='center';k.fillText(S.name,cx,y+15);k.restore()}
const _bi=buyItem;buyItem=function(id){const S=SD[SHOPK],b=S&&S.buy.find(q=>q.id===id);
 if(b&&(b.eq||b.give)){if(b.eq&&P[b.eq]>=b.tier){say('มีของระดับนี้หรือดีกว่าแล้ว');return}if(inv.coin<b.price){say('เหรียญไม่พอ (ต้องใช้ '+b.price+' เหรียญ)');sfx('thud');return}
  inv.coin-=b.price;if(b.eq){P[b.eq]=b.tier;P[b.eq==='w'?'wp':'ap']=0}else inv[b.give]++;refreshInv();sfx('coin');say(b.emoji+' ซื้อ'+b.name+' แล้ว'+(b.eq?' (สวมใส่ให้เลย)':''));if(D&&D.owner)D.owner.bub={txt:'ขอบคุณจ้า!',t:2};openShop(SHOPK);return}
 _bi(id)};
const CRAFT={mpp:{n:'ยามานา',e:'💧',need:{bottle:1,gel:2}},hpp:{n:'ยาฟื้นเลือด',e:'🧪',need:{bottle:1,gel:1,wood:1}}},IN={bottle:'ขวดเปล่า',gel:'เจล',wood:'ไม้'};
const _os=openShop;openShop=function(id){_os(id);const S=SD[id];if(!S.craft)return;
 shopEl.lastElementChild.insertAdjacentHTML('beforebegin','<small>— คราฟยาเอง (ได้ไปใช้ในกระเป๋า) —</small>'+S.craft.map(c=>{const r=CRAFT[c];return `<button class="mini" onclick="craft('${c}')">${r.e} ปรุง${r.n}<small>ใช้ ${Object.entries(r.need).map(([k,v])=>IN[k]+v+'(มี'+inv[k]+')').join(' + ')}</small></button>`}).join(''))};
function craft(c){const r=CRAFT[c];for(const k in r.need)if(inv[k]<r.need[k]){say('วัตถุดิบไม่พอ: ต้องใช้ '+IN[k]+' '+r.need[k]);sfx('thud');return}for(const k in r.need)inv[k]-=r.need[k];inv[c]++;refreshInv();sfx('heal');say(r.e+' ปรุง'+r.n+'สำเร็จ! (กด '+(c==='hpp'?'H':'N')+' หรือแตะกระเป๋าเพื่อดื่ม)');openShop(SHOPK)}
// เตาหลอม + ทั่งตีบวก (ใช้ได้ทุกคน ในเมือง)
const FORGE=[],RATE=[100,95,90,80,70,60,50,45,40,35,30,25,20,15,10],MAXP=15;let FORGEK=null;
function drawForge(f,t){const px=f.x*T,py=f.y*T;ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(px+16,py+30,24,7,0,0,7);ctx.fill();
 if(f.k==='furnace'){ctx.fillStyle='#57524b';ctx.fillRect(px+22,py-36,10,24);ctx.fillStyle='#6f6a62';ctx.fillRect(px-4,py-14,40,44);ctx.fillStyle='#55504a';ctx.fillRect(px-4,py-14,40,6);ctx.fillStyle='#2a1a10';ctx.fillRect(px+6,py+6,20,16);
  const q=.7+.3*Math.sin(t*9);ctx.fillStyle='#ff8a1e';ctx.fillRect(px+8,py+22-12*q,16,12*q);ctx.fillStyle='#ffd23a';ctx.fillRect(px+12,py+22-7*q,8,7*q);ctx.fillStyle='rgba(255,140,40,.14)';ctx.beginPath();ctx.arc(px+16,py+14,34,0,7);ctx.fill();
  for(let i=0;i<3;i++){const u=(t*.5+i/3)%1;ctx.fillStyle='rgba(200,200,205,'+(.5*(1-u))+')';ctx.beginPath();ctx.arc(px+27+Math.sin(t+i)*4,py-38-u*30,3+u*5,0,7);ctx.fill()}}
 else{ctx.fillStyle='#6a4a2a';ctx.fillRect(px+8,py+12,16,16);ctx.fillStyle='#3b3d46';ctx.fillRect(px+2,py+4,28,9);ctx.fillRect(px+28,py+6,6,4);ctx.fillStyle='#5a5d6a';ctx.fillRect(px+2,py+4,28,3)}
 const tx=f.k==='furnace'?'เตาหลอม':'ที่ตีบวก',ty=py-(f.k==='furnace'?18:6);ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';const w=ctx.measureText(tx).width+12;ctx.fillStyle='#4a2e16';ctx.fillRect(px+16-w/2,ty-11,w,15);ctx.strokeStyle='#e8c14a';ctx.strokeRect(px+16-w/2+.5,ty-10.5,w-1,14);ctx.fillStyle='#fff3c8';ctx.fillText(tx,px+16,ty);
 if(Math.hypot(P.x-px-16,P.y-py-16)<60){ctx.fillStyle='#fff';ctx.fillText('กด E / ⚔️ ใช้งาน',px+16,py+46)}ctx.textAlign='left'}
function openForge(k){FORGEK=k;sfx('ui');const el=document.getElementById('shop'),eq=p=>(p==='w'?EQ.w[P.w].n+(P.wp?' +'+P.wp:''):EQ.a[P.a].n+(P.ap?' +'+P.ap:''));
 if(k==='furnace')el.innerHTML='<b>🔥 เตาหลอม</b><small>แร่เพชร 2 + ไม้ 1 (เชื้อเพลิง) → แท่งเหล็ก 1<br>มี: แร่ '+inv.ore+' · ไม้ '+inv.wood+' · แท่งเหล็ก '+inv.ingot+'</small><button class="mini" onclick="smelt(0)">หลอม 1 ครั้ง</button><button class="mini" onclick="smelt(1)">หลอมให้มากที่สุด</button><button class="mini" onclick="closeForge()">ปิด</button>';
 else{const row=(p,t)=>{const l=P[p==='w'?'wp':'ap'];return l>=MAXP?`<small>${t} ${eq(p)} — สูงสุดแล้ว</small>`:`<button class="mini" onclick="enh('${p}')">ตีบวก${t}: ${eq(p)}<small>→ +${l+1} · แท่งเหล็ก ${l+1} + ${20*(l+1)} 🪙 · สำเร็จ ${RATE[l]}%${l>=3?' (พลาดลดเลเวล)':''}</small></button>`};
  el.innerHTML='<b>🔨 ที่ตีบวก</b><small>มีแท่งเหล็ก '+inv.ingot+' · เหรียญ '+inv.coin+'</small>'+row('w','⚔️อาวุธ')+row('a','🛡️เกราะ')+'<button class="mini" onclick="closeForge()">ปิด</button>'}el.hidden=false}
function closeForge(){FORGEK=null;document.getElementById('shop').hidden=true;sfx('ui')}
function smelt(all){let n=all?Math.min(inv.ore>>1,inv.wood):(inv.ore>=2&&inv.wood>=1?1:0);if(!n){say('วัตถุดิบไม่พอ: ต้องใช้แร่ 2 + ไม้ 1');sfx('thud');return}inv.ore-=2*n;inv.wood-=n;inv.ingot+=n;refreshInv();sfx('chest');say('🔥 หลอมได้แท่งเหล็ก +'+n);openForge('furnace')}
function enh(p){const pk=p==='w'?'wp':'ap',l=P[pk];if(l>=MAXP)return;const ci=l+1,cc=20*(l+1);if(inv.ingot<ci||inv.coin<cc){say('ต้องใช้แท่งเหล็ก '+ci+' + '+cc+' เหรียญ');sfx('thud');return}inv.ingot-=ci;inv.coin-=cc;
 const a=FORGE[1];for(let i=0;i<8;i++)fx.push({x:a.x*T+16,y:a.y*T+4,vx:(Math.random()-.5)*130,vy:-60-Math.random()*70,l:.5,c:'255,190,60'});
 if(Math.random()*100<RATE[l]){P[pk]++;sfx('chest');say('✨ ตีบวกสำเร็จ! +'+P[pk])}else if(l>=3){P[pk]--;sfx('thud');say('💥 พลาด! ลดเหลือ +'+P[pk])}else{sfx('thud');say('💥 พลาด… วัตถุดิบหายไป (ยังไม่ลดเลเวล)')}refreshInv();openForge('anvil')}
setInterval(()=>{if(FORGEK&&D&&D.town){closeForge()}},400);
// โรงเตี๊ยม: นั่งดื่มที่เก้าอี้ข้างโต๊ะ
const SEATS=[[80,254],[176,254],[336,254],[432,254]].map(([a,b])=>[a+OX,b]).concat([[48,254],[112,254],[IW*T-112,254],[IW*T-48,254]]);
const _sa=shopAct;shopAct=function(){if(D.shop==='inn'){if(P.sit){P.sit=null;P.y=8.55*T;say('ลุกจากโต๊ะแล้ว');return true}
  const s=SEATS.find(q=>Math.hypot(P.x-q[0],P.y-q[1])<46&&P.y>q[1]);if(s){P.sit=s;P.x=s[0];P.y=s[1]+4;P.dir='d';sfx('ui');say('🍺 นั่งดื่มสบาย ๆ เลือด/มานาค่อย ๆ ฟื้น — กด E หรือเดินเพื่อลุก');return true}}return _sa()};
const _es=enterShop;enterShop=function(id){P.sit=null;_es(id);if(id==='inn')say('🍺 โรงเตี๊ยมบัวหลวง — ยืนข้างเก้าอี้ที่โต๊ะแล้วกด E เพื่อนั่งดื่ม · คุยกับเจ้าของที่เคาน์เตอร์เพื่อซื้อเบียร์/พักผ่อน')};
const _tt=toTown;toTown=function(){P.sit=null;_tt()};
refreshInv();lvHud();
