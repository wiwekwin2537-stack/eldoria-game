// =====================================================================
// fix144 (v5.03) — 🛤️ ถนนตะวันออก + ⚓ ท่าเรือ (เจ้าของ: "เดินออกขวาแล้วถึงเมือง 2 เลย มันต้องเดินทางไกล · มีท่าเรือก็ต้องมี NPC ท่าเรือให้คุยเพื่อข้าม")
//  เมืองเอลโดเรีย ประตูขวา → แมพ "ถนนตะวันออก" (ยาว 124 ช่อง: ทุ่ง ป่า ลำธาร+สะพาน ศาลาพักทาง ป้ายบอกทาง)
//   → สุดทางคือ "ท่าเรือตะวันออก" (สะพานไม้ยื่นลงทะเล เรือข้ามฟาก ที่ทำการท่า ลังสินค้า)
//   → คุยกับ "ลุงบรอม คนเรือ" เพื่อล่องเรือไปนครวารีอัสตรา (Lv.150) · ขากลับจากนครวารี ลงเรือ → ขึ้นฝั่งที่ท่าเรือนี้
//  ถนนเดินได้ทุกเลเวล (ไม่มีมอน ปลอดภัย) — ที่ล็อก Lv.150 คือเรือข้ามทะเล · ผู้นำทางพามาที่ท่าเรือได้เมื่อเคยมาแล้ว
// =====================================================================
try{
const R144={Zm:null};window.R144=R144;
const RW=124,RH=24;
const sm=v=>Math.max(0,Math.min(1,v));
const roadY=x=>Math.round(12+2.4*sm((x-6)/10)*sm((86-x)/10)*Math.sin(x/11));
window.roadY144=roadY;
const SEA=103;
const isPier=(x,y)=>(x>=SEA&&x<=116&&y>=11&&y<=13)||(x>=SEA&&x<=108&&y>=18&&y<=19);
const OFFICE={x0:92,x1:97,y0:3,y1:6},HUT={x0:60,x1:63,y0:4,y1:6};
const CRATES=[[99,8],[100,8],[99,16],[90,17],[91,17],[101,16]];
function buildRoad144(){if(R144.Zm)return R144.Zm;const W=RW,H=RH,m=[];
 for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++)m[y][x]=(y<2||y>=H-2)?WL:FL}
 for(let y=0;y<H;y++)m[y][0]=Math.abs(y-roadY(0))<=1?GATE:WL;
 const trees=[];
 for(let x=2;x<89;x++)for(let y=2;y<H-2;y++){const ry=roadY(x);if(Math.abs(y-ry)<=2)continue;if(x>=39&&x<=44)continue;if(x>=56&&x<=70&&y<ry)continue;if(x<6&&Math.abs(y-ry)<5)continue;
  const h=hash(x*3.1,y*1.7);if(h>.86&&!trees.some(([a,b])=>Math.abs(a-x)<2&&Math.abs(b-y)<2)){m[y][x]=WL;trees.push([x,y])}}
 for(let y=2;y<H-2;y++)for(const x of [41,42])if(Math.abs(y-roadY(x))>1)m[y][x]=WL;
 for(let y=HUT.y0;y<=HUT.y1;y++)for(let x=HUT.x0;x<=HUT.x1;x++)m[y][x]=WL;
 for(let y=OFFICE.y0;y<=OFFICE.y1;y++)for(let x=OFFICE.x0;x<=OFFICE.x1;x++)m[y][x]=WL;
 for(const [x,y] of CRATES)m[y][x]=WL;
 for(let y=0;y<H;y++)for(let x=SEA;x<W;x++)m[y][x]=isPier(x,y)?FL:WL;
 /* ---- วาดพื้นหลัง ---- */
 const c=document.createElement('canvas');c.width=W*T;c.height=H*T;const k=c.getContext('2d');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=y*T,h=hash(x*1.3,y*2.7),ry=roadY(x),dr=Math.abs(y-ry);
  if(x>=SEA){const d=x-SEA;k.fillStyle=d<1?'#3f9fc8':d<4?'#2f86b8':'#246fa4';k.fillRect(px,py,T,T);if(h>.6){k.fillStyle='rgba(255,255,255,.12)';k.fillRect(px+4+h*10,py+8+h*12,10,2)}continue}
  const sand=x>=88,shore=x>=SEA-2;
  if(sand){k.fillStyle=shore?(h>.5?'#e6d6a6':'#dccb98'):(h>.5?'#d8c894':'#cfbd88');k.fillRect(px,py,T,T);if(h>.85){k.fillStyle='rgba(120,90,50,.25)';k.fillRect(px+h*20,py+h*18,3,2)}}
  else{k.fillStyle=h>.5?'#78a85a':'#70a052';k.fillRect(px,py,T,T);if(h>.7){k.fillStyle='#5f9046';for(let i=0;i<3;i++)k.fillRect(px+((h*97+i*11)%28),py+((h*53+i*7)%26),2,5)}
   if(h>.93&&dr>2){k.fillStyle=['#ff8ab0','#ffe06a','#ffffff','#b08aff'][Math.floor(h*97)%4];k.beginPath();k.arc(px+8+h*14,py+10+h*10,2.2,0,7);k.fill()}}
  if(dr<=1&&x<SEA-1){k.fillStyle=sand?(h>.5?'#c8a878':'#bf9e70'):(h>.5?'#b8955f':'#ad8a56');k.fillRect(px,py,T,T);
   if(dr===1){k.fillStyle=sand?'rgba(216,200,148,.6)':'rgba(112,160,82,.55)';const e=y<ry?py:py+T-6;for(let i=0;i<T;i+=4)k.fillRect(px+i,e+((i*7+x)%3),4,6-((i+x)%3))}
   else{k.fillStyle='rgba(80,55,30,.35)';k.fillRect(px,py+9,T,2);k.fillRect(px,py+21,T,2)}if(h>.75){k.fillStyle='#8a7a6a';k.beginPath();k.arc(px+h*28,py+5+h*20,1.8,0,7);k.fill()}}}
 /* แนวป่าทึบขอบบน/ล่าง */
 for(let x=0;x<88;x++)for(const yy of [0,1,H-2,H-1]){const px=x*T+16,py=yy*T+18,h=hash(x,yy*9);k.fillStyle='#2f5a2a';k.beginPath();k.arc(px+(h-.5)*10,py,20,0,7);k.fill();k.fillStyle='#3d7034';k.beginPath();k.arc(px-6+(h-.5)*8,py-6,12,0,7);k.fill()}
 for(let x=88;x<SEA;x++)for(const yy of [0,1,H-2,H-1]){const px=x*T,py=yy*T;k.fillStyle='#8a8478';k.fillRect(px,py,T,T);k.fillStyle='#a29c8e';k.fillRect(px+2,py+2,T-6,T-10);k.fillStyle='#6e695f';k.fillRect(px,py+T-6,T,6)}
 /* ลำธาร + สะพานไม้ */
 for(let y=2;y<H-2;y++)for(const x of [41,42]){const px=x*T,py=y*T;if(Math.abs(y-roadY(x))<=1)continue;k.fillStyle='#4a9ed0';k.fillRect(px,py,T,T);k.fillStyle='rgba(255,255,255,.18)';k.fillRect(px+6+((y*7)%14),py+10,12,2)}
 for(const x of [41,42]){k.fillStyle='#6a8a5a';k.fillRect(x*T,2*T,T,3)}
 {const by=roadY(41);k.fillStyle='#7a5432';k.fillRect(40.6*T,(by-1)*T-4,2.8*T,3*T+8);for(let i=0;i<11;i++){k.fillStyle=i%2?'#a8794a':'#9a6c40';k.fillRect(40.6*T+i*8.1,(by-1)*T-2,7,3*T+4)}
  k.fillStyle='#5a3a1e';k.fillRect(40.6*T,(by-1)*T-8,2.8*T,5);k.fillRect(40.6*T,(by+2)*T+2,2.8*T,5);for(const xx of [40.6,41.95,43.3]){k.fillRect(xx*T,(by-1)*T-14,5,10);k.fillRect(xx*T,(by+2)*T-2,5,10)}}
 /* ต้นไม้ */
 for(const [x,y] of trees){const px=x*T+16,py=y*T+16,h=hash(x,y),pine=h>.55;k.fillStyle='rgba(0,0,0,.2)';k.beginPath();k.ellipse(px,py+10,14,5,0,0,7);k.fill();k.fillStyle='#5a3a1a';k.fillRect(px-4,py-4,8,15);
  if(pine){k.fillStyle='#2e6a3a';for(let i=0;i<3;i++){k.beginPath();k.moveTo(px,py-34+i*9);k.lineTo(px-15+i*1,py-8+i*6);k.lineTo(px+15-i*1,py-8+i*6);k.closePath();k.fill()}k.fillStyle='#3e8a4a';k.beginPath();k.moveTo(px,py-34);k.lineTo(px-6,py-22);k.lineTo(px+4,py-24);k.fill()}
  else{k.fillStyle='#3a7a34';k.beginPath();k.arc(px,py-14,16,0,7);k.fill();k.fillStyle='#4f9a42';k.beginPath();k.arc(px-5,py-19,9,0,7);k.fill();k.fillStyle='#62ae52';k.beginPath();k.arc(px-7,py-22,4,0,7);k.fill()}}
 /* รั้วไม้ช่วงต้นทาง */
 for(let x=3;x<18;x++){const ry=roadY(x);for(const yy of [ry-2.3,ry+2.1]){k.fillStyle='#7a5432';k.fillRect(x*T,yy*T+6,T,3);k.fillRect(x*T,yy*T+14,T,3);k.fillStyle='#5a3a1e';k.fillRect(x*T+2,yy*T,4,20)}}
 /* ศาลาพักทาง */
 {const x0=HUT.x0*T,y0=HUT.y0*T,w=(HUT.x1-HUT.x0+1)*T,h=(HUT.y1-HUT.y0+1)*T;k.fillStyle='#8a5e3a';k.fillRect(x0+4,y0+16,w-8,h-16);k.fillStyle='#6a4428';for(let i=0;i<w-8;i+=10)k.fillRect(x0+4+i,y0+16,2,h-16);
  k.fillStyle='#a8452f';k.beginPath();k.moveTo(x0-10,y0+22);k.lineTo(x0+w/2,y0-14);k.lineTo(x0+w+10,y0+22);k.closePath();k.fill();k.fillStyle='#c85a3a';k.fillRect(x0-10,y0+18,w+20,6);
  k.fillStyle='#3a2414';k.fillRect(x0+w/2-12,y0+h-26,24,26);k.fillStyle='#ffd88a';k.fillRect(x0+14,y0+38,14,12);k.fillRect(x0+w-28,y0+38,14,12);
  k.fillStyle='#4a2e16';k.fillRect(x0+w/2-46,y0+h+2,30,6);k.fillRect(x0+w/2+16,y0+h+2,30,6);k.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillStyle='#fff';k.strokeStyle='rgba(0,0,0,.7)';k.lineWidth=3;k.strokeText('🍵 ศาลาพักทาง',x0+w/2,y0-18);k.fillText('🍵 ศาลาพักทาง',x0+w/2,y0-18)}
 /* ป้ายบอกทาง */
 const sign=(x,a,b)=>{const ry=roadY(x),px=x*T+16,py=(ry-2)*T+8;k.fillStyle='#4a2e16';k.fillRect(px-2,py-4,4,30);k.fillStyle='#7a4e26';k.strokeStyle='#3a2410';k.lineWidth=1.5;
  k.beginPath();k.moveTo(px-44,py-18);k.lineTo(px+40,py-18);k.lineTo(px+48,py-10);k.lineTo(px+40,py-2);k.lineTo(px-44,py-2);k.closePath();k.fill();k.stroke();
  k.beginPath();k.moveTo(px+44,py);k.lineTo(px-40,py);k.lineTo(px-48,py+8);k.lineTo(px-40,py+16);k.lineTo(px+44,py+16);k.closePath();k.fill();k.stroke();
  k.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillStyle='#ffe8b0';k.fillText(a,px,py-7);k.fillText(b,px,py+11)};
 sign(7,'⚓ ท่าเรือตะวันออก →','← 🏰 เมืองเอลโดเรีย');sign(36,'⚓ ท่าเรือ  อีก 2 ช่วงทาง →','← 🏰 เอลโดเรีย');sign(72,'⚓ ท่าเรือ ใกล้แล้ว →','← 🍵 ศาลาพักทาง');sign(87,'⛵ ท่าเรือตะวันออก','← 🏰 เอลโดเรีย');
 /* ท่าเรือ: พื้นไม้หน้าท่า + สะพานไม้ยื่นลงทะเล */
 const plank=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const px=x*T,py=y*T;k.fillStyle=(x+y)%2?'#9a6c40':'#a8794a';k.fillRect(px,py,T,T);k.fillStyle='rgba(60,35,15,.45)';for(let i=0;i<T;i+=8)k.fillRect(px+i,py,1.5,T);k.fillStyle='rgba(255,230,180,.08)';k.fillRect(px,py,T,3)}};
 plank(SEA-3,10,SEA-1,14);plank(SEA,11,116,13);plank(SEA,18,108,19);plank(SEA-2,17,SEA-1,20);
 for(const [x0,x1,y0,y1] of [[SEA,116,11,13],[SEA,108,18,19]]){k.fillStyle='#4a2e16';for(let x=x0;x<=x1+1;x+=2){k.fillRect(x*T-3,y0*T-6,6,8);k.fillRect(x*T-3,(y1+1)*T-2,6,10)}k.fillStyle='rgba(20,40,60,.35)';k.fillRect(x0*T,(y1+1)*T+6,(x1-x0+1)*T,5)}
 /* ที่ทำการท่าเรือ */
 {const x0=OFFICE.x0*T,y0=OFFICE.y0*T,w=(OFFICE.x1-OFFICE.x0+1)*T,h=(OFFICE.y1-OFFICE.y0+1)*T;k.fillStyle='#d8d0c0';k.fillRect(x0,y0+10,w,h-10);k.fillStyle='#bfb6a4';for(let i=0;i<h-10;i+=8)k.fillRect(x0,y0+10+i,w,1);
  k.fillStyle='#2a5a8a';k.beginPath();k.moveTo(x0-12,y0+18);k.lineTo(x0+w/2,y0-22);k.lineTo(x0+w+12,y0+18);k.closePath();k.fill();k.fillStyle='#3a7ab0';k.fillRect(x0-12,y0+14,w+24,6);
  k.fillStyle='#4a2e16';k.fillRect(x0+w/2-14,y0+h-34,28,34);k.fillStyle='#9ad0ff';for(const xx of [16,w-36])k.fillRect(x0+xx,y0+34,20,16);
  k.fillStyle='#4a2e16';k.fillRect(x0+w/2-60,y0-2,120,20);k.strokeStyle='#e8c14a';k.lineWidth=1.5;k.strokeRect(x0+w/2-60,y0-2,120,20);k.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillStyle='#ffe8b0';k.fillText('⚓ ที่ทำการท่าเรือ',x0+w/2,y0+12)}
 /* ลัง/ถัง */
 for(const [x,y] of CRATES){const px=x*T,py=y*T;if((x+y)%2){k.fillStyle='#8a5a2a';k.fillRect(px+3,py+2,T-6,T-4);k.strokeStyle='#5a3a1a';k.lineWidth=2;k.strokeRect(px+3,py+2,T-6,T-4);k.beginPath();k.moveTo(px+3,py+2);k.lineTo(px+T-3,py+T-2);k.moveTo(px+T-3,py+2);k.lineTo(px+3,py+T-2);k.stroke()}
  else{k.fillStyle='#7a4a22';k.beginPath();k.ellipse(px+16,py+16,11,14,0,0,7);k.fill();k.fillStyle='#4a4a4a';k.fillRect(px+5,py+8,22,3);k.fillRect(px+5,py+21,22,3)}}
 /* ตาข่ายจับปลา/เสาไฟ */
 for(const [x,y] of [[SEA-3,9.3],[SEA-3,15.2],[96,9.3]]){const px=x*T+16,py=y*T;k.fillStyle='#3a3a3a';k.fillRect(px-2,py-30,4,34);k.fillStyle='#ffd86a';k.fillRect(px-5,py-38,10,9)}
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 return R144.Zm={zi:744,name:'road144',Zd:{id:'road144',n:'ถนนตะวันออก',e:'🛤️',lv:[1,1],dark:0,amb:'dust',pal:{vd:'#2f5a2a'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt'},
  m,ores:[],oreAt:{},floor,ent:{x:2,y:roadY(2)+1},arena:{x:60,y:12},seen:new Uint8Array(W*H).fill(1),W,H,cv:c}}
window.buildRoad144=buildRoad144;
const inRoad=()=>!!(D&&D.road144);window.inRoad144=inRoad;
const NPCD=[
 {name:'ทหารยามด่านตะวันออก',c:'#4a5a8a',h:'#c8c8d4',x:4,y:9.9,fixed:1,spear:1,lines:['ถนนเส้นนี้ทอดยาวไปถึงท่าเรือตะวันออก','เดินตามถนนไปเรื่อย ๆ ถึงท่าเรือแล้วคุยกับลุงบรอมคนเรือ','ทางนี้ปลอดภัย ไม่มีอสูร — ขี่สัตว์ไปจะถึงไวขึ้น']},
 {name:'นักเดินทางพเนจร',c:'#3a8a5a',h:'#6b4a2a',hat:1,x:28,y:15.4,fixed:1,lines:['เดินมาครึ่งวันแล้ว ยังไม่ถึงท่าเรือเลย','ได้ยินว่านครวารีอัสตราใหญ่กว่าเอลโดเรียหลายเท่า']},
 {name:'ป้าน้ำชา',c:'#c05a7a',h:'#6b4a2a',g:'f',apron:1,x:61.5,y:8.2,fixed:1,lines:['แวะพักดื่มน้ำชาก่อนสิ ทางยังอีกไกล','ศาลานี้เปิดให้คนเดินทางพักฟรี','ข้าเห็นผู้กล้าเดินผ่านไปท่าเรือทุกวัน']},
 {name:'พ่อค้าเร่',c:'#a8452f',h:'#3a2a1a',beard:1,x:66,y:8.6,fixed:1,lines:['ข้าขนผ้าไหมจากนครวารีมาขายเอลโดเรีย','เรือของลุงบรอมไม่เคยล่มสักครั้ง']},
 {name:'เจ้าท่าเรือ',c:'#2a4a7a',h:'#e8e0d0',beard:1,hat:1,x:94.5,y:7.9,fixed:1,lines:['ยินดีต้อนรับสู่ท่าเรือตะวันออก','เรือข้ามฟากไปนครวารีอัสตราจอดอยู่ปลายสะพาน — คุยกับลุงบรอมได้เลย','ทะเลช่วงนี้มีอสูรทะเล ผู้กล้าต่ำกว่า Lv.'+((window.C2&&C2.LV)||150)+' ห้ามข้ามเด็ดขาด']},
 {name:'ชาวประมง',c:'#4a6a8a',h:'#3a2a1a',hat:1,x:106,y:18.7,fixed:1,lines:['วันนี้ปลาทูเต็มลำเลย!','ปลายสะพานนี้ตกปลาดีที่สุดในแถบนี้']},
 {name:'ลุงบรอม คนเรือ',c:'#3a5a7a',h:'#d8d0c0',beard:1,hat:1,x:113,y:11.5,fixed:1,ferry:1,lines:['เรือข้าพาข้ามไปนครวารีอัสตรา','ทะเลวันนี้สงบ ลมดี เหมาะแก่การล่องเรือ']}];
const mkN=()=>NPCD.map(d=>{const n=mkNPC(d);n.ferry=d.ferry;n.home={x:n.x,y:n.y};n.dir=d.ferry?'l':'d';return n});
/* ---- เข้า/ออก ---- */
const LV=()=>(window.C2&&C2.LV)||150;
function setup(at){const Zm=buildRoad144();try{if(D&&D.shop)leaveShop(true)}catch(e){}for(let i=0;i<3&&D;i++){try{exitD()}catch(e){break}}
 try{if(window.RT134)RT134.c2t=0}catch(e){}try{closeZMenu()}catch(e){}
 ZW=Zm.W;ZH=Zm.H;setScene('field');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;
 D={zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret:[ZG.x,ZG.y+40],ban:0,road144:1,npcs:mkN()};dm=Zm.m;dcv=Zm.cv;mkMini(Zm.cv,ZW,ZH,2);
 if(at==='port'){P.x=110.5*T;P.y=12.5*T;P.dir='l'}else{P.x=2.2*T;P.y=roadY(2)*T+16;P.dir='r'}P.kx=P.ky=0;
 try{visit134('road144');if(at==='port')visit134('port144')}catch(e){}
 try{if(at==='port')banner('⚓ ท่าเรือตะวันออก','ขึ้นฝั่งแล้ว · เดินตามถนนไปทางตะวันตกจะถึงเมืองเอลโดเรีย','green');else banner('🛤️ ถนนตะวันออก','เดินตามถนนไปทางขวา สุดทางคือท่าเรือ · คุยกับลุงบรอมเพื่อข้ามไปนครวารี','green')}catch(e){}}
function enterRoad144(at,nocover){if(D&&(D.tower10||D.wb10||D.dg||D.arena8||D.duel29||D.mk10||D.home)){say('ออกจากที่นี่ก่อน แล้วค่อยเดินทาง');sfx('thud');return false}
 if(nocover){setup(at);return true}
 LoadingScreenManager.cover(at==='port'?{icon:'⛵',title:'ท่าเรือตะวันออก',tip:'ล่องเรือกลับจากนครวารี · ขึ้นฝั่งแล้วเดินถนนตะวันออกกลับเมืองเอลโดเรีย'}:{icon:'🛤️',title:'ถนนตะวันออก',tip:'เส้นทางจากเมืองเอลโดเรียสู่ท่าเรือตะวันออก · ไม่มีอสูร ขี่สัตว์ไปได้'},()=>setup(at));return true}
window.enterRoad144=enterRoad144;
let busy=0;
function toTown144(){if(busy)return;busy=1;setTimeout(()=>{busy=0},2500);LoadingScreenManager.cover({icon:'🏰',title:'เมืองเอลโดเรีย',tip:'กลับเข้าประตูตะวันออก'},()=>{try{exitD()}catch(e){}try{enterTown()}catch(e){}try{P.x=(TW-4)*T;P.y=16.6*T;P.dir='l';P.kx=P.ky=0}catch(e){}})}
window.toTown144=toTown144;
/* ประตูขวาของเมือง → ถนนตะวันออก (ทุกเลเวล) */
{const _h=dhit;dhit=function(x,y){if(D&&D.town&&!D.shop&&x+7>=(TW-1)*T&&y>14*T&&y<19*T){for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);if(!dm[ty]||(dm[ty][tx]!==FL&&dm[ty][tx]!==GATE))return true}return false}return _h.apply(this,arguments)};window.dhit=dhit}
{const _ex=exitD;exitD=function(){if(D&&D.town&&!D.shop&&P.x>(TW-3)*T){if(busy)return;busy=1;setTimeout(()=>{busy=0},2500);P.x=(TW-4)*T;try{enterRoad144('west')}catch(e){console.warn(e)}return}return _ex.apply(this,arguments)};window.exitD=exitD}
/* เมือง 2 ท่าเรือ → กลับมาขึ้นฝั่งที่ท่าเรือตะวันออก */
backToCity1=function(){enterRoad144('port')};window.backToCity1=backToCity1;
/* เดินถึงขอบซ้าย → กลับเมือง */
{const _uz=updZone;updZone=function(dt){const r=_uz.apply(this,arguments);try{if(inRoad()){D.bossT=1e9;const tx=Math.floor(P.x/T),ty=Math.floor(P.y/T);if(dm[ty]&&dm[ty][tx]===GATE)toTown144();
   for(const n of D.npcs){if(n.bub&&(n.bub.t-=dt)<=0)n.bub=null;const d=Math.hypot(P.x-n.x,P.y-n.y);if(d<70&&!n.ferry)n.dir=Math.abs(P.x-n.x)>Math.abs(P.y-n.y)?(P.x<n.x?'l':'r'):(P.y<n.y?'u':'d')}}}catch(e){}return r};window.updZone=updZone}
{const _sm=spawnMob;spawnMob=function(){if(inRoad())return;return _sm.apply(this,arguments)};window.spawnMob=spawnMob}
{const _sb=spawnBoss;spawnBoss=function(){if(inRoad()){D.bossT=1e9;return}return _sb.apply(this,arguments)};window.spawnBoss=spawnBoss}
/* ---- คุย ---- */
const nearN=()=>{if(!inRoad())return null;let b=null,bd=44;for(const n of D.npcs){const q=Math.hypot(P.x-n.x,P.y-n.y);if(q<bd){bd=q;b=n}}return b};
function ferry(n){const lv=LV();
 if(P.lv<lv){talk(n,'ฮ่า ๆ ผู้กล้าตัวน้อย ใจกล้าดีนี่! แต่ทะเลช่วงนี้มีอสูรทะเลชุม ข้าพาข้ามได้เฉพาะผู้กล้า Lv.'+lv+' ขึ้นไป\n(ตอนนี้ Lv.'+P.lv+') — ไปฝึกให้แกร่งก่อนแล้วค่อยกลับมานะ',[BYE],'⛵ ลุงบรอม คนเรือ');return}
 talk(n,'เรือข้าพร้อมออกแล้ว! ข้ามทะเลไปนครวารีอัสตรา ใช้เวลาไม่นาน\nค่าเรือ? ไม่ต้อง — เล่าเรื่องผจญภัยให้ข้าฟังระหว่างทางก็พอ',[{t:'⛵ ลงเรือไปนครวารีอัสตรา',c:'go',f:()=>{try{sfx('warp')}catch(e){}try{enterCity2('boat')}catch(e){console.warn(e)}}},BYE],'⛵ ลุงบรอม คนเรือ')}
window.ferry144=ferry;
{const _it=interact;interact=function(){try{if(inRoad()&&!(DLG&&DLG.open)){const n=nearN();if(!n)return false;n.dir=Math.abs(P.x-n.x)>Math.abs(P.y-n.y)?(P.x<n.x?'l':'r'):(P.y<n.y?'u':'d');if(n.ferry)ferry(n);else npcTalk(n);return true}}catch(e){console.warn('road it',e)}return _it.apply(this,arguments)};window.interact=interact}
/* ---- วาด: ทะเล เรือ นกนางนวล NPC ป้ายกด E ---- */
const view=()=>{const t=ctx.getTransform(),z=t.a||1,x0=-t.e/z,y0=-t.f/z;return [x0,y0,x0+VW/z,y0+VH/z]};
function under(){const t=performance.now()/1000,[x0,y0,x1,y1]=view();ctx.save();ctx.globalAlpha=1;
 if(x1>SEA*T){ctx.lineWidth=1.4;const tx0=Math.max(SEA,Math.floor(x0/T)),tx1=Math.min(RW-1,Math.ceil(x1/T)),ty0=Math.max(0,Math.floor(y0/T)),ty1=Math.min(RH-1,Math.ceil(y1/T));
  for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){if(isPier(x,y)||(x*7+y*3)%3)continue;const ph=t*1.6+x*.9+y*1.3,a=.16+.14*Math.sin(ph),px=x*T+8+Math.sin(ph*.7)*5,py=y*T+16+Math.cos(ph*.5)*4;ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+6,py-3,px+12,py);ctx.stroke()}
  ctx.fillStyle='rgba(255,255,255,.35)';for(let y=2;y<RH-2;y++){if(isPier(SEA,y))continue;const w=3+2*Math.sin(t*2+y);ctx.fillRect(SEA*T-1,y*T,w,T)}
  /* เรือข้ามฟาก */
  {const bx=119.5*T,by=12.3*T+Math.sin(t*1.3)*2.5,rk=Math.sin(t*1.1)*.025;ctx.save();ctx.translate(bx,by);ctx.rotate(rk);
   ctx.fillStyle='rgba(0,30,60,.3)';ctx.beginPath();ctx.ellipse(0,26,92,14,0,0,7);ctx.fill();
   ctx.fillStyle='#6a3e1e';ctx.beginPath();ctx.moveTo(-96,-4);ctx.lineTo(96,-4);ctx.lineTo(74,28);ctx.lineTo(-80,28);ctx.closePath();ctx.fill();ctx.fillStyle='#8a5a2e';ctx.fillRect(-92,-6,184,10);ctx.fillStyle='#c8a050';ctx.fillRect(-92,6,184,3);
   ctx.fillStyle='#4a2a12';ctx.fillRect(-3,-120,6,118);ctx.fillRect(-46,-104,92,4);
   ctx.fillStyle='#f4ecd8';ctx.beginPath();ctx.moveTo(-44,-100);ctx.quadraticCurveTo(-4+Math.sin(t*2)*4,-60,-44,-14);ctx.lineTo(44,-14);ctx.quadraticCurveTo(4+Math.sin(t*2)*4,-60,44,-100);ctx.closePath();ctx.fill();
   ctx.fillStyle='#2a5a8a';ctx.fillRect(-44,-62,88,10);ctx.fillStyle='#e84a4a';ctx.beginPath();ctx.moveTo(3,-120);ctx.lineTo(24+Math.sin(t*4)*3,-114);ctx.lineTo(3,-108);ctx.fill();
   ctx.fillStyle='#ffd84a';ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.fillText('วารีมณี',0,20);ctx.restore()}
  /* เรือประมงเล็ก */
  for(const [x,y,s] of [[110.2,18.9,1],[111.6,20.6,.8]]){const bx=x*T,by=y*T+Math.sin(t*1.7+x)*2;ctx.fillStyle='#7a4a22';ctx.beginPath();ctx.moveTo(bx-26*s,by-6);ctx.lineTo(bx+26*s,by-6);ctx.lineTo(bx+18*s,by+8);ctx.lineTo(bx-18*s,by+8);ctx.closePath();ctx.fill();ctx.fillStyle='#d8c090';ctx.fillRect(bx-24*s,by-8,48*s,3)}}
 /* นกนางนวล */
 if(x1>86*T)for(let i=0;i<4;i++){const gx=(98+i*5)*T+Math.sin(t*.4+i)*90,gy=(4+i*3)*T+Math.cos(t*.6+i*2)*30,f=Math.sin(t*8+i)*5;ctx.strokeStyle='rgba(250,250,250,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx-8,gy-f);ctx.quadraticCurveTo(gx-3,gy-4,gx,gy);ctx.quadraticCurveTo(gx+3,gy-4,gx+8,gy-f);ctx.stroke()}
 /* ลำธารไหล */
 if(x0<43*T&&x1>41*T){ctx.fillStyle='rgba(255,255,255,.22)';for(let y=2;y<RH-2;y++){if(Math.abs(y-roadY(41))<=1)continue;const o=((t*40+y*13)%T);ctx.fillRect(41*T+8,y*T+o,10,2);ctx.fillRect(42*T+10,y*T+((o+15)%T),8,2)}}
 ctx.restore();for(const n of D.npcs)if(n.y<P.y)try{drawNPC(n,t)}catch(e){}}
function over(){const t=performance.now()/1000;for(const n of D.npcs)if(n.y>=P.y)try{drawNPC(n,t)}catch(e){}
 const n=nearN();if(n&&!(DLG&&DLG.open)){const txt=n.ferry?(P.lv>=LV()?'⛵ กด E คุยกับลุงบรอม (ข้ามไปนครวารี)':'⛵ กด E คุยกับลุงบรอม (🔒 Lv.'+LV()+')'):'💬 กด E คุยกับ'+n.name;
  ctx.save();ctx.globalAlpha=1;ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(txt,n.x,n.y-62);ctx.fillStyle='#fff';ctx.fillText(txt,n.x,n.y-62);ctx.restore()}
 if(P.x<4*T){ctx.save();ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';const s='← 🏰 เดินซ้ายเข้าเมืองเอลโดเรีย';ctx.strokeText(s,2*T,roadY(0)*T-34);ctx.fillStyle='#ffe8b0';ctx.fillText(s,2*T,roadY(0)*T-34);ctx.restore()}
 try{for(const q of D.npcs)if(q.bub)bubble(q.bub.txt,Math.round(q.x),Math.round(q.y)-50)}catch(e){}}
{const _dd=drawDrops;drawDrops=function(){try{if(inRoad())under()}catch(e){}return _dd.apply(this,arguments)};window.drawDrops=drawDrops}
{const _dt=drawDmgTxt;drawDmgTxt=function(dt){try{if(inRoad())over()}catch(e){}return _dt.apply(this,arguments)};window.drawDmgTxt=drawDmgTxt}
/* ป้ายที่ประตูขวาของเมือง */
{const _ds=drawStall;drawStall=function(s,t){if(s&&s.sign114){const x=(TW-2.6)*T,y=14.3*T;ctx.save();ctx.globalAlpha=1;ctx.fillStyle='#4a2e16';ctx.fillRect(x-2,y,4,26);ctx.fillStyle='#5a3a1e';ctx.strokeStyle='#e8c14a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-40,y-14);ctx.lineTo(x+32,y-14);ctx.lineTo(x+40,y-5);ctx.lineTo(x+32,y+4);ctx.lineTo(x-40,y+4);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.fillText('🛤️ ถนนตะวันออก · ⚓ ท่าเรือ →',x-2,y-2);ctx.restore();return}return _ds.apply(this,arguments)};window.drawStall=drawStall}
/* ---- เนื้อเรื่อง ---- */
try{const c27=STCH.find(c=>c&&c.id==='c2go');if(c27){c27.t='บทที่ 27: ถนนสู่นครวารี';c27.d='ถึง Lv.'+LV()+' แล้วเดินออกประตูขวา (ตะวันออก) ของเมืองเอลโดเรีย ตามถนนตะวันออกไปจนถึงท่าเรือ คุยกับลุงบรอมคนเรือเพื่อล่องเรือไปนครวารีอัสตรา แล้วคุยกับผู้บัญชาการไลอ้อสกลางลาน';
  c27.intro='จักรพรรดิเงาถูกผนึกแล้ว… แต่เงาของมันแตกเป็นห้าเสี่ยง หนีไปซ่อนในดันเจี้ยนใต้ "นครวารีอัสตรา" เมืองแห่งดันเจี้ยนโพ้นทะเลตะวันออก — ออกประตูขวาของเมือง เดินตามถนนตะวันออกไปถึงท่าเรือ แล้วให้ลุงบรอมคนเรือพาข้ามทะเลไปพบผู้บัญชาการไลอ้อส'}}catch(e){}
try{const m=PM7.find(x=>x[1]==='เมือง 2');if(m)m[2]=()=>{if(D&&D.city2){say('อยู่ในนครวารีอัสตราแล้ว — คุยกับเอเดนผู้นำทางที่ท่าเรือเพื่อเดินทาง');return}say('🧭 ไปนครวารี: ออกประตูขวาของเมือง เดินตามถนนตะวันออกถึงท่าเรือ แล้วคุยกับลุงบรอมคนเรือ (หรือจ้างอาร์เทนผู้นำทาง ถ้าเคยไปแล้ว)')}}catch(e){}
/* ---- REG136: กันถอยหลัง (fix141–144) ---- */
try{if(window.REG136)REG136.push(
 ['เทรดต้องเจอตัว: ไม่มีปุ่มเทรดในเมนู + ขอเทรดเช็กระยะ',async()=>{if(PM7.some(m=>m[1]==='เทรด'))return 'ปุ่มเทรดกลับมาในเมนู';return typeof window.trReq130==='function'&&/200/.test(String(window.trReq130))?null:'trReq130 ไม่เช็กระยะ'}],
 ['ออโต้ฟาร์มกดฮีลเมื่อเลือดน้อย + สกิลวาดเงานินจา',async()=>{if(!/shade46/.test(String(minDraw)))return 'ร่างแยกเงานินจากลับเป็นโครงกระดูก';const u=window.NEWU73&&NEWU73.ninja;if(u&&!/ns144/.test(String(u.f||u.fire||u)))return 'อัลตินินจาไม่ใช่พันเงาพิฆาต';return null}],
 ['ถนนตะวันออก: เดินจากประตูเมืองถึงท่าเรือได้ + มีลุงบรอมคนเรือ',async()=>{const Z=buildRoad144(),W=Z.W,H=Z.H,q=[[1,roadY(1)]],seen=new Uint8Array(W*H);seen[q[0][1]*W+1]=1;let ok=false;
   while(q.length){const [x,y]=q.shift();if(x===112&&y===12){ok=true;break}for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||seen[ny*W+nx])continue;const t=Z.m[ny][nx];if(t!==FL&&t!==GATE)continue;seen[ny*W+nx]=1;q.push([nx,ny])}}
   if(!ok)return 'เดินไม่ถึงท่าเรือ (ทางตัน)';if(Z.m[roadY(0)][0]!==GATE)return 'ขอบซ้ายไม่มีทางกลับเมือง';if(!NPCD.some(d=>d.ferry))return 'ไม่มีคนเรือ';
   if(!/enterRoad144/.test(String(backToCity1)))return 'เรือจากนครวารีไม่กลับมาท่าเรือตะวันออก';return null}]);}catch(e){}
}catch(e){console.warn('fix144',e)}
