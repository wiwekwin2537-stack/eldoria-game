// ---- v1.6 : สกิล 3 อัน · ร้านสกิล (บ้านป้ายสมุด) · ปุ่มเต็มจอ ----
const lby=()=>VW<520?100:8;
const SKILLS=[
 {id:'spin',name:'ฟันหมุน',emoji:'🌀',mp:10,cd:3,price:60,r:62,note:'ฟันรอบตัว ดาเมจ 2 ใส่ทุกตัวในระยะ'},
 {id:'fire',name:'ลูกไฟ',emoji:'🔥',mp:8,cd:2,price:80,note:'ยิงลูกไฟไปด้านหน้า ดาเมจ 3'},
 {id:'heal',name:'เยียวยา',emoji:'💚',mp:15,cd:8,price:100,note:'ฟื้นเลือด +50'}];
const SK={own:[0,0,0],cd:[0,0,0],fx:[],balls:[]};
function skHit(s,dmg,x0,y0){s.hp-=dmg;s.hurt=.25;sfx('hit');const d=Math.hypot(s.x-x0,s.y-y0)||1;s.kx=(s.x-x0)/d*240;s.ky=(s.y-y0)/d*240;
 if(s.hp<=0&&!s.dead){s.dead=true;sfx('splat');dropLoot(s.x,s.y,s);say('สไลม์แตก!');for(let i=0;i<10;i++)fx.push({x:s.x,y:s.y-8,vx:(Math.random()-.5)*120,vy:-40-Math.random()*80,l:.6})}}
function useSkill(i){if(PAUSED||DOORA.k)return;const S=SKILLS[i];
 if(!SK.own[i]){say('ยังไม่มีสกิล'+S.name+' — ซื้อได้ที่ร้านสกิล (บ้านป้ายสมุด) ในเมือง');return}
 if(SK.cd[i]>0||P.stun>0||P.dash>0||P.at>=0)return;
 if(P.mp<S.mp){say('มานาไม่พอ (ต้องใช้ '+S.mp+')');sfx('thud');return}
 if(S.id!=='heal'&&D&&(D.town||D.shop)){say('ใช้สกิลต่อสู้ในเมืองไม่ได้');return}
 if(S.id==='heal'&&P.hp>=BAL.hp){say('เลือดเต็มอยู่แล้ว');return}
 P.mp-=S.mp;SK.cd[i]=S.cd;if(P.recall>0)cancelRecall('ใช้สกิล — การวาปถูกยกเลิก');
 if(S.id==='spin'){sfx('swing2');SK.fx.push({k:'spin',x:P.x,y:P.y,t:0,l:.35});
  for(const s of slimes)if(!s.dead&&Math.hypot(s.x-P.x,s.y-P.y)<S.r)skHit(s,2,P.x,P.y);
  for(let k=0;k<12;k++)fx.push({x:P.x,y:P.y-12,vx:Math.cos(k*.52)*150,vy:Math.sin(k*.52)*90-20,l:.4,c:'150,210,255'})}
 else if(S.id==='fire'){sfx('swing');const v=DIRV[P.dir];SK.balls.push({x:P.x+v[0]*16,y:P.y+v[1]*16,vx:v[0]*330,vy:v[1]*330,t:0})}
 else{sfx('heal');P.hp=Math.min(BAL.hp,P.hp+50);SK.fx.push({k:'heal',t:0,l:.7});for(let k=0;k<14;k++)fx.push({x:P.x+(Math.random()-.5)*30,y:P.y-4,vx:0,vy:-60-Math.random()*60,l:.8,c:'110,255,150'});say('💚 เยียวยา เลือด +50')}}
const skB=[1,2,3].map(n=>document.getElementById('sk'+n));
skB.forEach((b,i)=>{b.innerHTML='<span class="ic"></span><i class="cd"></i><b class="n"></b><small>'+SKILLS[i].mp+'</small>';b.setAttribute('aria-label',SKILLS[i].name);b.onpointerdown=e=>{e.preventDefault();useSkill(i)}});
function skTick(dt){
 for(let i=0;i<3;i++){SK.cd[i]=Math.max(0,SK.cd[i]-dt);const b=skB[i],o=SK.own[i],c=SK.cd[i];
  b.classList.toggle('lock',!o);b.classList.toggle('nomp',!!o&&P.mp<SKILLS[i].mp);
  b.querySelector('.ic').textContent=o?SKILLS[i].emoji:'🔒';b.querySelector('.cd').style.height=o&&c>0?(c/SKILLS[i].cd*100)+'%':'0';b.querySelector('.n').textContent=o&&c>0?Math.ceil(c):''}
 for(let i=SK.fx.length-1;i>=0;i--){SK.fx[i].t+=dt;if(SK.fx[i].t>=SK.fx[i].l)SK.fx.splice(i,1)}
 for(let i=SK.balls.length-1;i>=0;i--){const b=SK.balls[i];b.t+=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;let gone=b.t>1.1||hit(b.x,b.y);
  if(!gone)for(const s of slimes)if(!s.dead&&Math.hypot(s.x-b.x,s.y-b.y)<22){skHit(s,3,b.x-b.vx*.05,b.y-b.vy*.05);gone=true;break}
  if(gone){for(let k=0;k<8;k++)fx.push({x:b.x,y:b.y-14,vx:(Math.random()-.5)*140,vy:-30-Math.random()*70,l:.4,c:'255,150,50'});SK.balls.splice(i,1)}
  else if(Math.random()<dt*50)fx.push({x:b.x,y:b.y-14,vx:(Math.random()-.5)*20,vy:-10,l:.3,c:'255,170,60'})}}
function skDraw(){
 for(const e of SK.fx){const u=e.t/e.l;ctx.save();ctx.globalAlpha=1-u;
  if(e.k==='spin'){const r=SKILLS[0].r*(.35+.65*u);ctx.strokeStyle='#cfe8ff';ctx.shadowColor='#3a9dff';ctx.shadowBlur=14;ctx.lineWidth=7*(1-u)+2;ctx.beginPath();ctx.ellipse(e.x,e.y-12,r,r*.7,0,0,7);ctx.stroke()}
  else{const r=22+u*12;ctx.strokeStyle='#8dffa8';ctx.shadowColor='#4fe08a';ctx.shadowBlur=12;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(P.x,P.y,r,r*.5,0,0,7);ctx.stroke()}
  ctx.restore()}
 for(const b of SK.balls){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(b.x,b.y-16,1,b.x,b.y-16,16);g.addColorStop(0,'rgba(255,240,170,1)');g.addColorStop(.4,'rgba(255,140,40,.8)');g.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=g;ctx.fillRect(b.x-18,b.y-34,36,36);ctx.restore()}}
{const _rt=recallTick;recallTick=function(dt){_rt(dt);skTick(dt)};const _dg=drawGhosts;drawGhosts=function(){skDraw();_dg()}}
addEventListener('keydown',e=>{if(e.repeat||e.key.length!==1)return;const i='567'.indexOf(e.key);if(i>=0)useSkill(i)});
// ซื้อสกิล
{const _bi=buyItem;buyItem=function(id){if(/^sk\d$/.test(id)){const i=+id[2],S=SKILLS[i];
  if(SK.own[i]){say('มีสกิลนี้แล้ว');return}
  if(inv.coin<S.price){say('เหรียญไม่พอ (ต้องใช้ '+S.price+' เหรียญ)');sfx('thud');return}
  inv.coin-=S.price;SK.own[i]=1;refreshInv();sfx('gem');say(S.emoji+' เรียนสกิล'+S.name+'สำเร็จ! กดปุ่มสกิลบนจอ (หรือคีย์ '+(i+5)+')');
  if(D&&D.owner)D.owner.bub={txt:'ขอให้โชคดีในการผจญภัย!',t:2.4};openShop(SHOPK);return}_bi(id)}}
// บ้านว่าง (ประตูล็อกเดิม) → ร้านสกิล ป้ายรูปสมุด
LOCKED_HOUSE.b=[0,0,0,0];LOCKED_HOUSE.door={x:-9999,w:0,t:0,bt:0};
SIGN_ICONS.book=function(k){k.lineJoin='round';k.fillStyle='#7a2a2a';rr(k,-17,-14,34,28,3);k.fill();k.strokeStyle=OUT;k.lineWidth=3;k.stroke();k.strokeStyle='#e8c14a';k.lineWidth=1.4;k.stroke();
 k.fillStyle='#f3ead0';k.beginPath();k.moveTo(0,-11);k.lineTo(-13,-8);k.lineTo(-13,11);k.lineTo(0,14);k.lineTo(13,11);k.lineTo(13,-8);k.closePath();k.fill();k.lineWidth=1.2;k.strokeStyle='#5a4426';k.stroke();
 k.beginPath();k.moveTo(0,-11);k.lineTo(0,14);k.stroke();k.fillStyle='#e8c14a';const st=(x,y,r)=>{k.beginPath();k.moveTo(x,y-r);k.lineTo(x+r*.3,y-r*.3);k.lineTo(x+r,y);k.lineTo(x+r*.3,y+r*.3);k.lineTo(x,y+r);k.lineTo(x-r*.3,y+r*.3);k.lineTo(x-r,y);k.lineTo(x-r*.3,y-r*.3);k.closePath();k.fill()};st(-6.5,1,4.5);
 k.strokeStyle='rgba(90,68,38,.6)';k.lineWidth=1;for(let i=0;i<4;i++){k.beginPath();k.moveTo(3,-4+i*4.5);k.lineTo(10,-3+i*4.5);k.stroke()}};
SHOP_DATA.skill={name:'ร้านสกิล',emoji:'📖',icon:'book',img:'house2',b:[31,23,5,4],
 door:{x:62,w:36,t:74,bt:126},sign:{x:128,y:84,arm:24},
 owner:{name:'อาจารย์เวท',c:'#2f5fa8',h:'#e8e0c8',greet:['ยินดีต้อนรับสู่ร้านสกิล! อยากเรียนวิชาไหนล่ะ','เวทมนตร์ต้องฝึก มาเรียนกันเถอะ'],
  lines:['ฟันหมุนช่วยได้มากเวลาโดนรุม','ลูกไฟยิงไกล ปลอดภัยกว่าเข้าไปตี','เยียวยาช่วยชีวิตได้ ตอนเลือดใกล้หมด','สกิลใช้มานา อย่าลืมซื้อยาติดตัวนะ']},
 solid:[],sell:[],
 get buy(){return SKILLS.map((x,i)=>({id:'sk'+i,name:x.name+(SK.own[i]?' (มีแล้ว ✓)':''),emoji:x.emoji,price:x.price,note:x.note+' · มานา '+x.mp+' · คูลดาวน์ '+x.cd+' วิ'}))}};
SHOP_ORDER.push('skill');
SHOP_ART.skill=function(k){const th={floor:'plank',f1:'#3a4a6a',f2:'#334260',w1:'#4a5a86',w2:'#34406a',brick:0,wood:'#33220f',beam:'#24160c',ct:'#6a7ab0',cf:'#2c3a66',rug:['#4a2a6a','#6a3f90','#e8d58a']};
 shell(k,th);
 for(let i=0;i<24;i++){const x=20+hash(i,1)*470,y=10+hash(i,2)*28;k.fillStyle='rgba(180,200,255,'+(.25+hash(i,3)*.35)+')';k.fillRect(x|0,y|0,2,2)}
 const bc=['#7a2a2a','#2a4f7a','#3a6a3a','#8a6a2a','#5a3a7a'];
 for(const [x0,x1] of [[52,226],[286,462]])for(const y of [26,50]){k.fillStyle='#2a1a0c';k.fillRect(x0,y,x1-x0,4);for(let x=x0+8,i=0;x<x1-8;x+=13+hash(x,y)*6,i++)IT.book(k,x,y,.7,0,bc[(i+y)%5])}
 station(k,1,th,(k,px,py)=>{k.fillStyle=lg(k,0,py,0,py+2*T,'#4a2c14','#33200f');k.fillRect(px+2,py+2,2*T-4,2*T-6);k.strokeStyle=OUT;k.lineWidth=1.2;k.strokeRect(px+2.5,py+2.5,2*T-5,2*T-7);
  for(const row of [0,1]){const y=py+6+row*28;k.fillStyle='#24160c';k.fillRect(px+6,y,2*T-12,24);for(let i=0;i<7;i++){k.fillStyle=bc[(i+row*2)%5];k.fillRect(px+8+i*7,y+3+(i%2)*2,5,19-(i%2)*2)}}});
 station(k,13,th,(k,px,py)=>{k.fillStyle='#2a2a38';k.fillRect(px+14,py+30,36,26);k.strokeStyle=OUT;k.lineWidth=1.2;k.strokeRect(px+14.5,py+30.5,35,25);IT.orb(k,px+32,py+34,1.3);IT.book(k,px+32,py+30,1.1,0,'#5a3a7a')});
 counter(k,th);IT.book(k,150,106,1);IT.orb(k,205,108,1);IT.candle(k,300,106,1);IT.book(k,350,104,1,0,'#2a4f7a')};
SHOP_TINT.skill='rgba(120,150,255,.08)';
SHOP_ANIM.skill=function(t){ctx.save();ctx.globalCompositeOperation='lighter';glow(205,100,40,'150,200,255',.3+.1*Math.sin(t*3));glow(112,34,40,'200,170,255',.18);glow(400,34,40,'200,170,255',.18);ctx.restore();
 for(let i=0;i<10;i++){const u=(t*.2+i/10)%1,x=40+hash(i,4)*430+Math.sin(t+i)*8,y=330-u*250;ctx.fillStyle='rgba(200,220,255,'+(Math.sin(u*Math.PI)*.6)+')';ctx.fillRect(x,y,2,2)}};
// เต็มจอ + ข้อความเด้งชั่วคราว
{const f=document.getElementById('fsb');if(f)f.onclick=()=>{const d=document,e=d.documentElement;try{if(d.fullscreenElement||d.webkitFullscreenElement)(d.exitFullscreen||d.webkitExitFullscreen).call(d);else(e.requestFullscreen||e.webkitRequestFullscreen).call(e)}catch(_){say('อุปกรณ์นี้ไม่รองรับโหมดเต็มจอ')}}}
{const m=document.getElementById('msg');let tm=0;new MutationObserver(()=>{m.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>m.classList.remove('on'),4500)}).observe(m,{childList:true,characterData:true,subtree:true})}
addEventListener('contextmenu',e=>e.preventDefault());
