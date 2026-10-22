// fix25.js (v4.33) — ข้อ 68 ส่วนที่ 2: 8 คลาสใหม่ (นินจา สไนเปอร์ พาลาดิน นักบวช เนโครแมนเซอร์ มังค์ อัศวินมังกร ผู้อัญเชิญสัตว์)
// แต่ละคลาส: อาวุธประจำสาย (หน้าตาเฉพาะคลาส) · สกิล 3 ท่าพร้อมเอฟเฟกต์ · พาสซีฟ 6 ขั้น (ถึง Lv.120) · ไอคอนสกิล
// =====================================================================
const el25=(x,y,a,b,r,s0,e)=>ctx.ellipse(x,y,Math.max(.1,a),Math.max(.1,b),r,s0,e);
const NC25={
 ninja:{n:'นินจา',e:'🥷',col:'#8a9aff',w:'sword',d:'เร็ว ลอบสังหาร คริติคอลสูง วาร์ปไปหลังศัตรู · ดาเมจจาก AGI+STR',pas:'AGI +3+Lv/3 · คริ +12% · เดินเร็ว +15%'},
 sniper:{n:'สไนเปอร์',e:'🎯',col:'#ffd23a',w:'bow',d:'ยิงไกลที่สุดในเกม นัดเดียวแรงมาก คริแรง · ดาเมจจาก AGI',pas:'AGI +4+Lv/3 · คริ +8% · ดาเมจคริ +60%'},
 paladin:{n:'พาลาดิน',e:'🛡️',col:'#ffe9a0',w:'sword',d:'อัศวินศักดิ์สิทธิ์ ถึกที่สุด ฮีลตัวเองได้ · ดาเมจจาก STR',pas:'VIT +4+Lv/3 · ลดดาเมจที่ได้รับ 15% · ฟื้นเลือด 0.5%/วิ'},
 cleric:{n:'นักบวช',e:'✨',col:'#bff0ff',w:'staff',d:'แสงศักดิ์สิทธิ์ ฮีลแรง บัฟพลัง ยิงแสงพิพากษา · ดาเมจจาก INT',pas:'INT +3+Lv/3 · VIT +Lv/5 · มานาฟื้นเร็ว ×2'},
 necro:{n:'เนโครแมนเซอร์',e:'💀',col:'#7affb0',w:'staff',d:'ปลุกโครงกระดูกเป็นกองทัพ สาปศัตรู ดูดเลือด · ดาเมจจาก INT',pas:'INT +4+Lv/3 · ดูดเลือด 4% ของดาเมจ'},
 monk:{n:'มังค์',e:'👊',col:'#ffb46a',w:'sword',d:'หมัดมวยวัดตีเร็วต่อเนื่อง คอมโบรัว · ดาเมจจาก STR+AGI',pas:'STR +2+Lv/4 · AGI +2+Lv/4 · ตีเร็วขึ้น 25%'},
 dragoon:{n:'อัศวินมังกร',e:'🐉',col:'#ff6a5a',w:'sword',d:'ทวนยาวระยะไกล กระโดดแทงจากฟ้า ลมหายใจมังกร · ดาเมจจาก STR',pas:'STR +3+Lv/3 · VIT +Lv/6 · ระยะฟันยาวขึ้น'},
 summoner:{n:'ผู้อัญเชิญสัตว์',e:'🐺',col:'#9adf6a',w:'staff',d:'เรียกหมาป่า หมี อินทรี มาสู้แทน สัตว์ยิ่งเยอะยิ่งแกร่ง · ดาเมจจาก INT',pas:'INT +3+Lv/3 · สัตว์อัญเชิญแรงขึ้น 30%'}};
const NSK25={
 ninja:[{n:'ดาวกระจายพายุ',e:'✴️',lv:5,price:150,mp:14,cd:6,d:'ปาดาวกระจาย 8 ทิศรอบตัว ดอกละ ×0.9'},
  {n:'เงาพริบตา',e:'🌑',lv:15,price:600,mp:[10,12,18],cd:9,steps:3,d:'① วาร์ปไปหลังศัตรูแล้วแทง ×1.8 → ② เงาแยกร่างฟันรอบตัว ×1.4 → ③ ระเบิดควัน ×2.0 มึน + ล่องหน 1.5 วิ'},
  {n:'พันเงาสังหาร',e:'⚔️',lv:30,price:2000,mp:45,cd:24,d:'กลายเป็นเงา 2.5 วิ วาร์ปฟันศัตรูรอบตัวต่อเนื่อง ครั้งละ ×1.3 (อมตะระหว่างใช้)'}],
 sniper:[{n:'กระสุนเจาะเกราะ',e:'🔫',lv:5,price:150,mp:12,cd:5,d:'ยิงนัดเดียวไกลมาก ทะลุทุกตัว ×3.0'},
  {n:'ยิงสามจังหวะ',e:'🎯',lv:15,price:600,mp:[8,10,18],cd:9,steps:3,d:'① เล็งหัวคริแน่นอน ×2.4 → ② ตีลังกาถอยยิงคู่ ×1.4 → ③ กระสุนระเบิด ×2.8 วงกว้าง'},
  {n:'ห่ากระสุนพิฆาต',e:'💥',lv:30,price:2000,mp:45,cd:24,d:'ยิงกระหน่ำพื้นที่ด้านหน้า 3 วิ ครั้งละ ×0.9 ถี่มาก'}],
 paladin:[{n:'ค้อนศักดิ์สิทธิ์',e:'🔨',lv:5,price:150,mp:16,cd:7,d:'ฟาดค้อนแสงรอบตัว ×1.7 มึนงง + ฮีลตัวเอง 10%'},
  {n:'ดาบแห่งแสง',e:'⚜️',lv:15,price:600,mp:[10,12,20],cd:9,steps:3,d:'① พุ่งชาร์จ ×1.5 → ② โล่กระแทกมึน 1.2 วิ ×1.6 → ③ เสาแสงถล่ม ×2.8'},
  {n:'ปราการเทพ',e:'🛡️',lv:30,price:2000,mp:40,cd:28,d:'โล่แสง 6 วิ: ลดดาเมจ 60% · แสงเผาศัตรูรอบตัว · ไม่ฟื้นเลือด'}],
 cleric:[{n:'แสงรักษา',e:'💚',lv:5,price:150,mp:20,cd:9,d:'ฮีลตัวเอง 30% + ระเบิดแสง ×1.2 รอบตัว'},
  {n:'พิพากษาสวรรค์',e:'☀️',lv:15,price:600,mp:[10,14,22],cd:10,steps:3,d:'① ลูกแสงติดตาม 3 ลูก ×1.4 → ② วงแหวนแสง ×1.5 ผลัก → ③ ลำแสงสวรรค์ ×3.2'},
  {n:'อวยพรเทวา',e:'👼',lv:30,price:2000,mp:50,cd:30,d:'8 วิ: โจมตี +35% · ฮีล 4%/วิ · มานาฟื้นเร็ว'}],
 necro:[{n:'ปลุกโครงกระดูก',e:'🦴',lv:5,price:150,mp:18,cd:8,d:'เรียกนักรบโครงกระดูก 2 ตัวมาสู้ (สูงสุด 6)'},
  {n:'คำสาปวิญญาณ',e:'👻',lv:15,price:600,mp:[10,14,20],cd:10,steps:3,d:'① ลูกวิญญาณดูดเลือด ×1.6 → ② ทุ่งคำสาปช้า+ไหม้ 4 วิ → ③ หอกกระดูกทะลุ ×3.0'},
  {n:'กองทัพมรณะ',e:'☠️',lv:30,price:2000,mp:55,cd:30,d:'ระเบิดพลังมรณะ ×2.2 + เรียกโครงกระดูก 5 ตัว'}],
 monk:[{n:'หมัดพันครั้ง',e:'👊',lv:5,price:150,mp:12,cd:5,d:'ต่อยรัวด้านหน้า 8 ครั้ง ครั้งละ ×0.55'},
  {n:'ฝ่ามือมังกร',e:'🖐️',lv:15,price:600,mp:[8,10,18],cd:8,steps:3,d:'① ฝ่ามือคลื่นพลัง ×1.6 ผลัก → ② เตะเสยลอยฟ้า ×1.8 → ③ หมัดมังกรคลื่นใหญ่ ×3.0'},
  {n:'จิตอรหันต์',e:'🪷',lv:30,price:2000,mp:40,cd:26,d:'4 วิ: อมตะ · ออร่าทองตีรอบตัวรัว ๆ · เดินเร็ว'}],
 dragoon:[{n:'แทงทะลวง',e:'🔱',lv:5,price:150,mp:12,cd:5,d:'แทงทวนพุ่งไปข้างหน้าทะลุทุกตัว ×1.9'},
  {n:'กระโดดมังกร',e:'🐲',lv:15,price:600,mp:[10,12,20],cd:9,steps:3,d:'① กระโดดลงจากฟ้า ×1.8 → ② กวาดทวนรอบตัว ×1.5 → ③ ลมหายใจมังกร ×2.6 ไหม้'},
  {n:'มังกรเทพลงมา',e:'🔥',lv:30,price:2000,mp:50,cd:28,d:'มังกรเพลิงพุ่งลงจากฟ้า ระเบิด ×4.2 วงกว้าง + ไหม้'}],
 summoner:[{n:'เรียกหมาป่า',e:'🐺',lv:5,price:150,mp:16,cd:8,d:'เรียกหมาป่า 2 ตัวมาสู้ (สูงสุด 4)'},
  {n:'สัญชาตญาณป่า',e:'🦅',lv:15,price:600,mp:[10,12,20],cd:10,steps:3,d:'① เรียกเหยี่ยวจู่โจม → ② เรียกหมีฟาดพื้น ×1.8 → ③ คำรามป่า: ศัตรูมึน 2 วิ + สัตว์ทุกตัวต่ออายุ'},
  {n:'ราชสีห์วิญญาณ',e:'🦁',lv:30,price:2000,mp:50,cd:30,d:'อัญเชิญราชสีห์วิญญาณทองยักษ์ 25 วิ + คลื่นคำราม ×2.0'}]};
const NPAS25={
 ninja:[{lv:10,n:'ฝีเท้าเงา',d:'AGI +5',st:{agi:5}},{lv:20,n:'สัญชาตญาณนักฆ่า',d:'คริติคอล +5%',crit:.05},{lv:35,n:'เงาไร้ตัวตน',d:'AGI +10 · STR +5',st:{agi:10,str:5}},{lv:50,n:'จุดตาย',d:'คริติคอล +8%',crit:.08},{lv:80,n:'ราชันเงา',d:'AGI +18 · STR +10',st:{agi:18,str:10}},{lv:120,n:'นินจาตำนาน',d:'คริ +10% · AGI +25',crit:.1,st:{agi:25}}],
 sniper:[{lv:10,n:'สายตาอินทรี',d:'คริติคอล +5%',crit:.05},{lv:20,n:'มือนิ่ง',d:'AGI +6',st:{agi:6}},{lv:35,n:'นักแม่นปืน',d:'AGI +12',st:{agi:12}},{lv:50,n:'เล็งจุดอ่อน',d:'คริติคอล +8%',crit:.08},{lv:80,n:'ราชาซุ่มยิง',d:'AGI +22',st:{agi:22}},{lv:120,n:'กระสุนเทพ',d:'คริ +10% · AGI +25',crit:.1,st:{agi:25}}],
 paladin:[{lv:10,n:'ศรัทธามั่น',d:'VIT +6',st:{vit:6}},{lv:20,n:'พรแห่งแสง',d:'ฟื้นเลือด 1%/วิ',regen:.01},{lv:35,n:'เกราะศรัทธา',d:'VIT +12 · STR +6',st:{vit:12,str:6}},{lv:50,n:'อัศวินแสง',d:'STR +12',st:{str:12}},{lv:80,n:'ผู้พิทักษ์',d:'VIT +25',st:{vit:25}},{lv:120,n:'อัครเทวทูต',d:'VIT +30 · STR +20 · ฟื้นเลือด 1%/วิ',st:{vit:30,str:20},regen:.01}],
 cleric:[{lv:10,n:'จิตสงบ',d:'INT +5',st:{int:5}},{lv:20,n:'พรกระแสมานา',d:'มานาฟื้นเร็ว +60%',mpr:.6},{lv:35,n:'ผู้รักษา',d:'INT +10 · VIT +6 · ฟื้นเลือด 0.5%/วิ',st:{int:10,vit:6},regen:.005},{lv:50,n:'แสงพิพากษา',d:'INT +14',st:{int:14}},{lv:80,n:'นักบุญ',d:'INT +22 · VIT +10',st:{int:22,vit:10}},{lv:120,n:'ผู้แทนสวรรค์',d:'INT +30 · VIT +16',st:{int:30,vit:16}}],
 necro:[{lv:10,n:'กลิ่นอายความตาย',d:'INT +5',st:{int:5}},{lv:20,n:'กระดูกแกร่ง',d:'VIT +6',st:{vit:6}},{lv:35,n:'ดูดวิญญาณ',d:'INT +12',st:{int:12}},{lv:50,n:'จ้าวกระดูก',d:'INT +14 · VIT +6',st:{int:14,vit:6}},{lv:80,n:'ราชันมรณะ',d:'INT +24',st:{int:24}},{lv:120,n:'อมตะ',d:'INT +30 · VIT +16',st:{int:30,vit:16}}],
 monk:[{lv:10,n:'หมัดเหล็ก',d:'STR +4 · AGI +2',st:{str:4,agi:2}},{lv:20,n:'ลมปราณ',d:'ฟื้นเลือด 0.8%/วิ',regen:.008},{lv:35,n:'มวยวัด',d:'STR +8 · AGI +8',st:{str:8,agi:8}},{lv:50,n:'จิตไร้ขอบเขต',d:'คริติคอล +6%',crit:.06},{lv:80,n:'ปรมาจารย์',d:'STR +16 · AGI +14',st:{str:16,agi:14}},{lv:120,n:'อรหันต์',d:'STR +24 · AGI +20 · VIT +10',st:{str:24,agi:20,vit:10}}],
 dragoon:[{lv:10,n:'เลือดมังกร',d:'STR +5',st:{str:5}},{lv:20,n:'เกล็ดมังกร',d:'VIT +6',st:{vit:6}},{lv:35,n:'ทวนเพลิง',d:'STR +12',st:{str:12}},{lv:50,n:'วิญญาณมังกร',d:'STR +12 · VIT +8',st:{str:12,vit:8}},{lv:80,n:'จ้าวนภา',d:'STR +24',st:{str:24}},{lv:120,n:'ราชันมังกร',d:'STR +30 · VIT +18',st:{str:30,vit:18}}],
 summoner:[{lv:10,n:'สหายป่า',d:'INT +5',st:{int:5}},{lv:20,n:'ภาษาสัตว์',d:'VIT +6',st:{vit:6}},{lv:35,n:'จ้าวฝูง',d:'INT +10 · AGI +6',st:{int:10,agi:6}},{lv:50,n:'วิญญาณป่า',d:'INT +14',st:{int:14}},{lv:80,n:'ผู้นำเผ่า',d:'INT +22 · VIT +10',st:{int:22,vit:10}},{lv:120,n:'จ้าวสรรพสัตว์',d:'INT +30 · VIT +16',st:{int:30,vit:16}}]};
for(const k in NC25){CLS[k]={n:NC25[k].n,e:NC25[k].e,col:NC25[k].col,d:NC25[k].d,pas:NC25[k].pas};NEEDW[k]=NC25[k].w;CSKILLS[k]=NSK25[k];if(!CSK[k])CSK[k]=[0,0,0];PASSIVE[k]=NPAS25[k]}
try{const c=JSON.parse(localStorage.getItem('fm_cls')||'null');if(c){if(c.cls&&CLS[c.cls])P.cls=c.cls;for(const k in NC25)if(c.csk&&c.csk[k])CSK[k]=c.csk[k]}}catch(e){}
// โบนัสประจำคลาส
{const _cb=calcBonus;calcBonus=function(){const b=_cb(),L=P.lv,f=Math.floor;switch(P.cls){
 case 'ninja':b.agi+=3+f(L/3);break;case 'sniper':b.agi+=4+f(L/3);break;case 'paladin':b.vit+=4+f(L/3);break;case 'cleric':b.int+=3+f(L/3);b.vit+=f(L/5);break;
 case 'necro':b.int+=4+f(L/3);break;case 'monk':b.str+=2+f(L/4);b.agi+=2+f(L/4);break;case 'dragoon':b.str+=3+f(L/3);b.vit+=f(L/6);break;case 'summoner':b.int+=3+f(L/3);break}return b}}
{const _cc=critCh;critCh=function(){return _cc()+(P.cls==='ninja'?.12:P.cls==='sniper'?.08:0)}}
{const _cd=window.CRITD;window.CRITD=()=>(_cd?_cd():0)+(P.cls==='sniper'?.6:0)}
{const _ca=clsAtk;clsAtk=function(){return Math.round(_ca()*(1+(B25.atk||0)))}}
{const _sm=spdMul;spdMul=function(){return _sm()*(P.cls==='ninja'?1.15:1)*(B25.spd>0?1.3:1)}}
{const _as=aspdMul;aspdMul=function(){return _as()*(P.cls==='monk'?.8:1)}}
// ---------- ระบบเอฟเฟกต์ของคลาสใหม่ ----------
const B25={atk:0,shield:0,shieldT:0,blessT:0,spd:0,lastHp:null,shadow:null,zen:null};
const E25=[];const ef25=o=>{o.t=0;E25.push(o);return o};window.E25=E25;
const pt25=(x,y,n,rgb,sp,sz,k)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=(sp||80)*(.4+Math.random()*.6);rfxP(x,y,Math.cos(a)*s,Math.sin(a)*s-30,.5+Math.random()*.4,rgb,sz||2.2,k||'spark')}};
const ring25=(x,y,rgb,s,l)=>RFX.push({k:'ring',x,y,t:0,l:l||.45,rgb,s:s||60});
const heal25=f=>{const h=Math.round(BAL.hp*f);P.hp=Math.min(BAL.hp,P.hp+h);try{dmgTxt(P.x,P.y-50,'+'+h,'#7aff9a')}catch(e){}pt25(P.x,P.y-20,10,'120,255,160',60,2.2,'spark')};
const near25=(r)=>{let b=null,bd=r||260;for(const e of enemies()){const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<bd&&!(typeof wallBetween7==='function'&&wallBetween7(P.x,P.y-6,e.x,e.y-6))){bd=d;b=e}}return b};
function blink25(e){const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1,nx=e.x+dx/d*26,ny=e.y+dy/d*16;pt25(P.x,P.y-14,12,'90,90,140',70,2.4,'dot');
 if(!hit(nx,ny)){P.x=nx;P.y=ny}else if(!hit(e.x,e.y+18)){P.x=e.x;P.y=e.y+18}P.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'l':'r'):(dy>0?'u':'d');pt25(P.x,P.y-14,12,'140,140,220',70,2.4,'dot');sfx('dash')}
function cone25(dv,r,ang,fn){for(const e of enemies()){const dx=e.x-P.x,dy=e.y-10-(P.y-12),d=Math.hypot(dx,dy);if(d>r+eR(e)||d<1)continue;if((dx*dv[0]+dy*dv[1])/d>Math.cos(ang))fn(e)}}
function line25(dv,len,w,fn){for(const e of enemies()){const dx=e.x-P.x,dy=e.y-10-(P.y-12),along=dx*dv[0]+dy*dv[1],perp=Math.abs(dx*dv[1]-dy*dv[0]);if(along>-10&&along<len&&perp<w+eR(e))fn(e)}}
// สัตว์/โครงกระดูกอัญเชิญเพิ่ม
MSPEC.wolf={n:'หมาป่าวิญญาณ',f:'wolf',col:['#c8e8b0','#3a5a2a','#d8ff7a'],sp:150,rng:28,cd:.8,mult:.6,dur:30,cap:4,fly:0};
MSPEC.bear={n:'หมีป่า',f:'golem',col:['#8a5a32','#3a2414','#ffcf7a'],sp:90,rng:38,cd:1.4,mult:1.3,dur:25,cap:1,fly:0,sc:1.2};
MSPEC.lion={n:'ราชสีห์วิญญาณ',f:'wolf',col:['#ffe9a0','#b8862a','#ffffff'],sp:140,rng:36,cd:.9,mult:1.8,dur:25,cap:1,fly:0,sc:1.7};
MSPEC.skel.cap=6;
{const _sm=summon;summon=function(k,n){_sm(k,n);try{if(P.cls==='summoner')for(const o of MIN)if(o.S===MSPEC[k]&&!o.boost){o.boost=1;o.S=Object.assign({},o.S,{mult:o.S.mult*1.3})}}catch(e){}}}
// สกิล
const SKN25={
 ninja:[()=>{for(let i=0;i<8;i++){const a=i*.785;shoot('shuri25',{dv:[Math.cos(a),Math.sin(a)],sp:460,range:240,mult:.9,pierce:1,r:9})}P.draw=true;sfx('swing2')},
  st=>{const e=near25(280);if(st===0){if(e){blink25(e);hurtE(e,1.8,{kb:120,crit:.3});ef25({k:'slashX',x:e.x,y:e.y-14,l:.35})}else{const v=DIRV[P.dir];P.dv=v.slice();P.dash=.2;P.dcd=.25;P.dashHit=new Set();P.dashMult=1.4}}
   else if(st===1){ef25({k:'clones',x:P.x,y:P.y,l:.5});eachIn(P.x,P.y-8,82,m=>hurtE(m,1.4,{kb:140}));sfx('swing');sfx('swing2')}
   else{ef25({k:'smoke',x:P.x,y:P.y,l:1.6});eachIn(P.x,P.y-8,90,m=>hurtE(m,2.0,{kb:200,stun:1.2}));P.iframe=Math.max(P.iframe,1.5);sfx('thud')}},
  ()=>{B25.shadow={t:0,l:2.5,tick:0};P.iframe=Math.max(P.iframe,2.6);sfx('warp')}],
 sniper:[()=>{const dv=aimDir(520);shoot('bullet25',{dv,sp:900,range:560,mult:3.0,pierce:99,r:7,gun:'ap'});P.at=0;P.cmb=0;P.shot=true;/* v5.70: ท่ายิงของสกิลไม่ปล่อยกระสุนปกติแถม */shake(2,.1);sfx('thud');ef25({k:'muzzle',x:P.x+dv[0]*20,y:P.y-14+dv[1]*12,l:.15})},
  st=>{const dv=aimDir(520);P.at=0;P.cmb=0;P.shot=true;/* v5.70 */
   if(st===0){shoot('bullet25',{dv,sp:950,range:540,mult:2.4,r:7,crit25:1,gun:'head'});sfx('thud');ef25({k:'muzzle',x:P.x+dv[0]*20,y:P.y-14+dv[1]*12,l:.15})}
   else if(st===1){P.dv=[-dv[0],-dv[1]];P.dash=.2;P.dcd=.25;P.iframe=Math.max(P.iframe,.35);P.flip=.35;sfx('dash');setTimeout(()=>{const dv2=(()=>{try{return aimDir(480)}catch(e){return dv}})();/* v5.68 ยิงตามทิศตอนยิงจริง (หลังตีลังกาตัวละครหันตามเป้าแล้ว) ไม่ใช้ทิศเก่าก่อนตีลังกา */P.at=0;P.shot=true;for(const o of [-5,5]){/* v5.70: ยิงคู่ขนาน ทิศเดียวกัน (เดิมกาง ±0.06 เรเดียน เจ้าของแจ้ง 'ออกทีละ 2 ลูกคนละทิศ') */const n=PROJ.length;shoot('bullet25',{dv:dv2,sp:900,range:480,mult:1.4,r:7,gun:'twin'});const p=PROJ[n];if(p){p.x+=-dv2[1]*o;p.y+=dv2[0]*o}}sfx('thud')},180)}
   else{shoot('bomb',{dv,sp:620,range:420,mult:2.8,aoe:90,stun:.8,r:9,gun:'he'});sfx('thud');shake(2,.1)}},
  ()=>{const dv=aimDir(320),point=window.SKILLAIM46&&SKILLAIM46.point(2);ef25({k:'barrage',x:point?point[0]:P.x+dv[0]*140,y:point?point[1]:P.y+dv[1]*140,r:95,l:3,tick:0});sfx('swing2')}],
 paladin:[()=>{ef25({k:'hammer',x:P.x,y:P.y,l:.6});eachIn(P.x,P.y-8,95,e=>hurtE(e,1.7,{kb:180,stun:1,col:'#ffe9a0'}));heal25(.1);shake(4,.25);sfx('thud');sfx('crumble')},
  st=>{const v=DIRV[P.dir];if(st===0){P.dv=v.slice();P.dash=.26;P.dcd=.3;P.iframe=Math.max(P.iframe,.3);P.dashHit=new Set();P.dashMult=1.5;vfx('slashline',P.x,P.y,.35,{dx:v[0],dy:v[1]});sfx('dash')}
   else if(st===1){ef25({k:'bash',x:P.x+v[0]*26,y:P.y+v[1]*20,l:.35});eachIn(P.x+v[0]*26,P.y-8+v[1]*20,48,e=>hurtE(e,1.6,{kb:200,stun:1.2}));sfx('thud');shake(3,.15)}
   else{const dv=aimDir(220),x=P.x+dv[0]*110,y=P.y+dv[1]*110;ef25({k:'pillar',x,y,l:.9,r:80,mult:2.8})}},
  ()=>{B25.shieldT=6;sfx('warp');ring25(P.x,P.y,'255,240,170',90,.6)}],
 cleric:[()=>{heal25(.3);ef25({k:'holyburst',x:P.x,y:P.y,l:.6});eachIn(P.x,P.y-8,85,e=>hurtE(e,1.2,{kb:160,col:'#fff6c0'}));sfx('gem');P.cast=.4},
  st=>{P.cast=.45;P.stun=.2;const dv=aimDir(320);
   if(st===0){for(const o of [-.25,0,.25]){const a=Math.atan2(dv[1],dv[0])+o;shoot('holy25',{dv:[Math.cos(a),Math.sin(a)],sp:380,range:340,mult:1.4,r:9,home:1})}sfx('gem')}
   else if(st===1){ef25({k:'halo',x:P.x,y:P.y,l:.6});eachIn(P.x,P.y-8,110,e=>hurtE(e,1.5,{kb:260,col:'#fff6c0'}));sfx('warp')}
   else{const x=P.x+dv[0]*120,y=P.y+dv[1]*120;ef25({k:'beam',x,y,l:1,r:70,mult:3.2});sfx('warp')}},
  ()=>{B25.blessT=8;B25.atk=.35;flash('#fff6c0',.3);ring25(P.x,P.y,'255,250,200',100,.7);sfx('chest')}],
 necro:[()=>{summon('skel',2);P.cast=.5;P.stun=.3;ef25({k:'grave',x:P.x,y:P.y,l:.8})},
  st=>{P.cast=.45;P.stun=.2;const dv=aimDir(320);
   if(st===0){shoot('soul25',{dv,sp:420,range:340,mult:1.6,r:10,leech:.25});sfx('warp')}
   else if(st===1){const x=P.x+dv[0]*110,y=P.y+dv[1]*110;ef25({k:'curse',x,y,r:85,l:4,tick:0});sfx('warp')}
   else{shoot('bone25',{dv,sp:700,range:420,mult:3.0,pierce:99,r:10});sfx('crumble');shake(2,.1)}},
  ()=>{ef25({k:'deathnova',x:P.x,y:P.y,l:.8});eachIn(P.x,P.y-8,140,e=>hurtE(e,2.2,{kb:240,col:'#7affb0'}));summon('skel',5);shake(5,.3);flash('#3aff9a',.25);sfx('thud')}],
 monk:[()=>{const v=DIRV[P.dir];let n=0;const go=()=>{if(n++>=8||P.dead)return;eachIn(P.x+v[0]*30,P.y-10+v[1]*24,40,e=>{if(!(typeof wallBetween7==='function'&&wallBetween7(P.x,P.y-6,e.x,e.y-6)))hurtE(e,.55,{kb:30})});ef25({k:'fist',x:P.x+v[0]*(24+Math.random()*16)+(Math.random()-.5)*14,y:P.y-14+v[1]*18+(Math.random()-.5)*14,l:.18});sfx('swing');setTimeout(go,70)};go();P.draw=true},
  st=>{const v=DIRV[P.dir],dv=aimDir(260);
   if(st===0){shoot('palm25',{dv,sp:460,range:200,mult:1.6,pierce:99,r:20});sfx('swing2')}
   else if(st===1){P.at=0;P.cmb=1;P.skAt=1.6;vfx('upper',P.x,P.y,.4,{dir:P.dir});eachIn(P.x+v[0]*26,P.y-10+v[1]*22,44,e=>{hurtE(e,1.8,{kb:60,stun:.6});e.air=.6});sfx('swing')}
   else{shoot('dragonfist25',{dv,sp:520,range:340,mult:3.0,pierce:99,r:30});shake(4,.2);sfx('warp')}},
  ()=>{B25.zen={t:0,l:4,tick:0};B25.spd=4;P.iframe=Math.max(P.iframe,4);sfx('warp');ring25(P.x,P.y,'255,200,100',80,.6)}],
 dragoon:[()=>{const dv=aimDir(200);ef25({k:'thrust',x:P.x,y:P.y-12,dx:dv[0],dy:dv[1],l:.3});line25(dv,150,18,e=>hurtE(e,1.9,{kb:160}));P.dv=dv.slice();P.dash=.12;P.dcd=.2;sfx('swing2')},
  st=>{const dv=aimDir(260);
   if(st===0){const e=near25(200);if(e){P.x=e.x;P.y=e.y+6}P.jump={t:0,l:.55,land:false,mult25:1};sfx('dash')}
   else if(st===1){ef25({k:'sweep',x:P.x,y:P.y,l:.4});eachIn(P.x,P.y-8,88,e=>hurtE(e,1.5,{kb:180}));sfx('swing2')}
   else{ef25({k:'breath',x:P.x,y:P.y-14,dx:dv[0],dy:dv[1],l:1});cone25(dv,170,.5,e=>hurtE(e,2.6,{kb:120,burn:4,col:'#ff9a4a'}));sfx('warp');shake(3,.3)}},
  ()=>{const dv=aimDir(220),x=P.x+dv[0]*120,y=P.y+dv[1]*120;ef25({k:'dragondive',x,y,l:1.1,r:120,mult:4.2});sfx('warp')}],
 summoner:[()=>{summon('wolf',2);P.cast=.5;P.stun=.3;ring25(P.x,P.y,'180,255,120',60)},
  st=>{P.cast=.4;P.stun=.2;
   if(st===0){summon('hawk',1);sfx('swing')}
   else if(st===1){summon('bear',1);const dv=aimDir(160);eachIn(P.x+dv[0]*60,P.y+dv[1]*50,70,e=>hurtE(e,1.8,{kb:200,stun:.5}));ef25({k:'roar',x:P.x+dv[0]*60,y:P.y+dv[1]*50,l:.5,c:'200,160,100'});shake(3,.2)}
   else{ef25({k:'roar',x:P.x,y:P.y,l:.8,c:'180,255,120',big:1});eachIn(P.x,P.y-8,150,e=>hurtE(e,.8,{kb:80,stun:2}));for(const o of MIN)o.l=Math.max(o.l,o.t+15);sfx('thud')}},
  ()=>{summon('lion',1);ef25({k:'roar',x:P.x,y:P.y,l:1,c:'255,230,140',big:1});eachIn(P.x,P.y-8,160,e=>hurtE(e,2.0,{kb:220,stun:1}));shake(5,.4);flash('#ffe9a0',.25);sfx('thud')}]};
for(const k in SKN25)SKFN[k]=SKN25[k];
// กระโดดมังกร: ใช้ระบบกระโดดเดิม (ลงแล้วระเบิด 1.8) ✓
// ---------- อัปเดตทุกเฟรม ----------
{const _st=skTick;skTick=function(dt){_st(dt);try{
 if(B25.lastHp!==null&&P.hp<B25.lastHp&&!P.dead){const loss=B25.lastHp-P.hp,red=(B25.shieldT>0?.6:0)+(P.cls==='paladin'?.15:0);if(red>0)P.hp=Math.min(BAL.hp,P.hp+loss*Math.min(.75,red))}
 if(B25.shieldT>0){B25.shieldT-=dt;if((B25.st25=(B25.st25||0)-dt)<=0){B25.st25=.5;eachIn(P.x,P.y-8,70,e=>hurtE(e,.5,{kb:40,col:'#ffe9a0'}))}}
 if(B25.blessT>0){B25.blessT-=dt;P.hp=Math.min(BAL.hp,P.hp+BAL.hp*.04*dt);P.mp=Math.min(BAL.mp,P.mp+BAL.mp*.03*dt);if(B25.blessT<=0)B25.atk=0}
 if(P.cls==='paladin'&&!P.dead&&!passiveRegenBlocked())P.hp=Math.min(BAL.hp,P.hp+BAL.hp*.005*dt);
 if(P.cls==='cleric'&&!P.dead)P.mp=Math.min(BAL.mp,P.mp+BAL.mpRegen*dt);
 if(B25.spd>0)B25.spd-=dt;
 const S=B25.shadow;if(S){S.t+=dt;S.tick-=dt;if(S.tick<=0){S.tick=.22;const e=near25(220);if(e){blink25(e);hurtE(e,1.3,{kb:60});ef25({k:'slashX',x:e.x,y:e.y-14,l:.3})}}if(S.t>=S.l)B25.shadow=null}
 const Z=B25.zen;if(Z){Z.t+=dt;Z.tick-=dt;if(Z.tick<=0){Z.tick=.25;eachIn(P.x,P.y-8,75,e=>hurtE(e,.7,{kb:50,col:'#ffd27a'}))}if(Z.t>=Z.l)B25.zen=null}
 for(let i=E25.length-1;i>=0;i--){const e=E25[i];e.t+=dt;
  if(e.k==='barrage'){e.tick-=dt;if(e.tick<=0){e.tick=.12;eachIn(e.x,e.y,e.r,m=>hurtE(m,.9*.5,{kb:10}));if(Math.random()<.6)sfx('hit')}}
  else if(e.k==='curse'){e.tick-=dt;if(e.tick<=0){e.tick=.5;eachIn(e.x,e.y,e.r,m=>{hurtE(m,.45,{kb:0,col:'#7affb0',burn:1});if(m.F)m.slowT=1})}}
  else if((e.k==='pillar'||e.k==='beam'||e.k==='dragondive')&&!e.hitd&&e.t>=e.l*.55){e.hitd=1;eachIn(e.x,e.y,e.r,m=>hurtE(m,e.mult,{kb:260,stun:.8,burn:e.k==='dragondive'?5:0,col:e.k==='dragondive'?'#ff9a4a':'#fff6c0',fx:e.x,fy:e.y}));shake(e.k==='dragondive'?8:5,.3);sfx('thud');sfx('crumble');pt25(e.x,e.y-10,24,e.k==='dragondive'?'255,140,50':'255,245,190',160,3,'spark');ring25(e.x,e.y,e.k==='dragondive'?'255,120,40':'255,240,170',e.r,.6)}
  if(e.t>=e.l)E25.splice(i,1)}
 // กระสุนพิเศษ: นำวิถี / ดูดเลือด / คริแน่นอน
 for(const p of PROJ){if(p.home&&!p.dead){const e=near25(260);if(e){const dx=e.x-p.x,dy=e.y-14-p.y,d=Math.hypot(dx,dy)||1,s=Math.hypot(p.vx,p.vy);p.vx+=(dx/d*s-p.vx)*Math.min(1,dt*5);p.vy+=(dy/d*s-p.vy)*Math.min(1,dt*5)}}}
 B25.lastHp=P.hp}catch(e){}}}
// เนโคร: ดูดเลือด · กระสุนคริแน่นอน
{const _he=hurtE;hurtE=function(e,mult,o){o=o||{};const d=_he(e,mult,o);try{if(d>0&&P.cls==='necro')P.hp=Math.min(BAL.hp,P.hp+d*.04)}catch(_){}return d}}
// ---------- วาด ----------
function draw25(){const t=performance.now()/1000;ctx.save();
 for(const e of E25){const u=e.t/e.l,a=1-u;ctx.save();
  if(e.k==='slashX'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(180,190,255,'+a+')';ctx.lineWidth=4;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(e.x-18,e.y-18*s);ctx.lineTo(e.x+18,e.y+18*s);ctx.stroke()}}
  else if(e.k==='clones'){ctx.globalAlpha=a*.6;for(let i=0;i<4;i++){const ang=i*1.57+u*3;ctx.fillStyle='#2a2a4a';ctx.beginPath();el25(e.x+Math.cos(ang)*40,e.y-16+Math.sin(ang)*20,7,14,0,0,7);ctx.fill()}ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(150,160,255,'+a+')';ctx.lineWidth=5;ctx.beginPath();el25(e.x,e.y-10,70*(.5+u),40*(.5+u),0,0,7);ctx.stroke()}
  else if(e.k==='smoke'){for(let i=0;i<10;i++){const ang=i*.63,r=20+u*60;ctx.fillStyle='rgba(120,120,140,'+(.45*a)+')';ctx.beginPath();ctx.arc(e.x+Math.cos(ang)*r,e.y-10+Math.sin(ang)*r*.5,16+u*10,0,7);ctx.fill()}}
  else if(e.k==='muzzle'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,16);g.addColorStop(0,'rgba(255,250,200,'+a+')');g.addColorStop(1,'rgba(255,150,40,0)');ctx.fillStyle=g;ctx.fillRect(e.x-16,e.y-16,32,32)}
  else if(e.k==='barrage'){ctx.fillStyle='rgba(255,210,80,.12)';ctx.beginPath();el25(e.x,e.y,e.r,e.r*.6,0,0,7);ctx.fill();ctx.strokeStyle='rgba(255,210,80,.6)';ctx.lineWidth=1.5;ctx.stroke();ctx.globalCompositeOperation='lighter';
   for(let i=0;i<6;i++){const px=e.x+(Math.random()-.5)*e.r*1.6,py=e.y+(Math.random()-.5)*e.r;ctx.fillStyle='rgba(255,230,140,.9)';ctx.fillRect(px-1,py-6,2,8);ctx.fillStyle='rgba(255,160,40,.5)';ctx.beginPath();ctx.arc(px,py,4,0,7);ctx.fill()}}
  else if(e.k==='hammer'||e.k==='holyburst'||e.k==='halo'||e.k==='deathnova'||e.k==='sweep'){const c=e.k==='deathnova'?'120,255,170':e.k==='sweep'?'255,140,100':'255,240,170',R=(e.k==='halo'?110:e.k==='deathnova'?140:e.k==='sweep'?88:95)*(.3+.7*Math.min(1,u*2));
   ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba('+c+','+a+')';ctx.lineWidth=8*a+2;ctx.beginPath();el25(e.x,e.y,R,R*.62,0,0,7);ctx.stroke();const g=ctx.createRadialGradient(e.x,e.y-10,0,e.x,e.y-10,R);g.addColorStop(0,'rgba('+c+','+(.4*a)+')');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.fillRect(e.x-R,e.y-R-10,R*2,R*2);
   if(e.k==='hammer'&&u<.5){ctx.fillStyle='rgba(255,240,170,'+a+')';ctx.fillRect(e.x-10,e.y-60+u*60,20,14);ctx.fillRect(e.x-2,e.y-46+u*60,4,22)}}
  else if(e.k==='bash'){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,240,170,'+(.7*a)+')';ctx.beginPath();ctx.arc(e.x,e.y-12,14+u*16,0,7);ctx.fill()}
  else if(e.k==='pillar'||e.k==='beam'){const on=u>.55?1-(u-.55)/.45:u/.55*.4,c=e.k==='beam'?'255,250,210':'255,230,140';ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+c+','+(.25*(u<.55?u/.55:on))+')';ctx.beginPath();el25(e.x,e.y,e.r,e.r*.6,0,0,7);ctx.fill();
   if(u>.5){const w=(e.k==='beam'?44:30)*on,g=ctx.createLinearGradient(e.x-w,0,e.x+w,0);g.addColorStop(0,'rgba('+c+',0)');g.addColorStop(.5,'rgba('+c+','+on+')');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.fillRect(e.x-w,e.y-400,w*2,400)}}
  else if(e.k==='grave'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(120,255,170,'+a+')';ctx.lineWidth=2;ctx.beginPath();el25(e.x,e.y,50,30,0,0,7);ctx.stroke();for(let i=0;i<6;i++){const ang=i*1.05+t;ctx.fillStyle='rgba(120,255,170,'+a+')';ctx.fillText('✦',e.x+Math.cos(ang)*46-3,e.y+Math.sin(ang)*28)}}
  else if(e.k==='curse'){ctx.fillStyle='rgba(60,200,120,.14)';ctx.beginPath();el25(e.x,e.y,e.r,e.r*.6,0,0,7);ctx.fill();ctx.strokeStyle='rgba(120,255,170,.6)';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.lineDashOffset=-t*20;ctx.stroke();ctx.setLineDash([]);
   ctx.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const ang=t*1.5+i*1.26;ctx.fillStyle='rgba(150,255,190,.5)';ctx.beginPath();ctx.arc(e.x+Math.cos(ang)*e.r*.6,e.y+Math.sin(ang)*e.r*.35-10-((t*30+i*12)%30),3,0,7);ctx.fill()}}
  else if(e.k==='fist'){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,200,120,'+a+')';ctx.beginPath();ctx.arc(e.x,e.y,7+u*8,0,7);ctx.fill()}
  else if(e.k==='thrust'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,180,140,'+a+')';ctx.lineWidth=7*a+2;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+e.dx*150*Math.min(1,u*3),e.y+e.dy*150*Math.min(1,u*3));ctx.stroke()}
  else if(e.k==='breath'){ctx.globalCompositeOperation='lighter';const ang=Math.atan2(e.dy,e.dx);for(let i=0;i<14;i++){const d=((t*260+i*14)%170),sp=(Math.sin(i*7.1)*.45)*d/170,x=e.x+Math.cos(ang+sp)*d,y=e.y+Math.sin(ang+sp)*d,g=ctx.createRadialGradient(x,y,0,x,y,8+d*.12);g.addColorStop(0,'rgba(255,240,170,'+a+')');g.addColorStop(.5,'rgba(255,120,30,'+(.7*a)+')');g.addColorStop(1,'rgba(255,40,0,0)');ctx.fillStyle=g;ctx.fillRect(x-30,y-30,60,60)}}
  else if(e.k==='dragondive'){const dv=Math.min(1,u/.55),x=e.x+(1-dv)*120,y=e.y-(1-dv)*300;ctx.fillStyle='rgba(255,60,20,'+(.2*dv)+')';ctx.beginPath();el25(e.x,e.y,e.r,e.r*.6,0,0,7);ctx.fill();
   if(u<.6){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,30);g.addColorStop(0,'#fff6c8');g.addColorStop(.4,'rgba(255,120,30,.9)');g.addColorStop(1,'rgba(255,40,0,0)');ctx.fillStyle=g;ctx.fillRect(x-30,y-30,60,60);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#8a1a0a';ctx.beginPath();ctx.moveTo(x-22,y-20);ctx.quadraticCurveTo(x,y-50,x+22,y-20);ctx.lineTo(x,y);ctx.closePath();ctx.fill()}}
  else if(e.k==='roar'){const R=(e.big?150:70)*u;ctx.globalCompositeOperation='lighter';for(let j=0;j<3;j++){ctx.strokeStyle='rgba('+e.c+','+(a*(1-j*.3))+')';ctx.lineWidth=4;ctx.beginPath();el25(e.x,e.y-6,R-j*14,(R-j*14)*.6,0,0,7);ctx.stroke()}}
  ctx.restore()}
 // ออร่า: โล่เทพ / อวยพร / เงา / อรหันต์
 if(B25.shieldT>0){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,240,170,'+(.5+.2*Math.sin(t*6))+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(P.x,P.y-20,30,0,7);ctx.stroke();ctx.fillStyle='rgba(255,240,170,.1)';ctx.fill()}
 if(B25.blessT>0){ctx.globalCompositeOperation='lighter';for(let i=0;i<2;i++){ctx.strokeStyle='rgba(255,250,210,.7)';ctx.lineWidth=1.5;ctx.beginPath();el25(P.x,P.y-52-i*3,10+i*3,3,0,0,7);ctx.stroke()}}
 if(B25.zen){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(P.x,P.y-20,4,P.x,P.y-20,60);g.addColorStop(0,'rgba(255,210,120,.35)');g.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g;ctx.fillRect(P.x-60,P.y-80,120,120)}
 ctx.restore()}
// กระสุนแบบใหม่ (วาดเองแทนลูกกลมม่วงตั้งต้น)
/* v5.70 กระสุนแสงปืนสไน — วาดในแกนทิศกระสุน (ctx ถูกหมุนแล้ว: +x = ทิศบิน) */
const GUN70={t:['255,236,170','255,190,80',26,2.2],ap:['170,230,255','90,170,255',46,3.4],head:['255,120,110','255,60,60',34,2.6],twin:['255,226,140','255,170,60',30,2.2]};
function gun70(p,t){ctx.globalCompositeOperation='lighter';
 if(p.gun==='he'){/* กระสุนระเบิด: หัวกระสุนส้มเรือง + ควันไฟท้าย */for(let i=0;i<6;i++){const a=.5-i*.08;ctx.fillStyle='rgba(255,'+(140-i*12)+',40,'+a+')';ctx.beginPath();el25(-6-i*5,(Math.sin(t*40+i)*1.5),5-i*.4,3.5-i*.3,0,0,7);ctx.fill()}
  ctx.globalCompositeOperation='source-over';ctx.fillStyle='#4a3a2a';ctx.beginPath();el25(2,0,6,3.6,0,0,7);ctx.fill();ctx.fillStyle='#ffb040';ctx.beginPath();el25(6,0,3,2.6,0,0,7);ctx.fill();return}
 const G=GUN70[p.gun]||GUN70.t,len=G[2],w=G[3];
 const g=ctx.createLinearGradient(-len,0,4,0);g.addColorStop(0,'rgba('+G[1]+',0)');g.addColorStop(.7,'rgba('+G[1]+',.55)');g.addColorStop(1,'rgba('+G[0]+',.95)');ctx.fillStyle=g;ctx.fillRect(-len,-w*1.6,len+4,w*3.2);
 ctx.fillStyle='rgba(255,255,255,.95)';ctx.fillRect(-len*.55,-w*.35,len*.55+5,w*.7);ctx.beginPath();el25(5,0,3.2,w*.6,0,0,7);ctx.fill();
 if(p.gun==='ap'){/* เจาะเกราะ: วงคลื่นกระแทกตามทาง */for(let i=0;i<3;i++){const x=-12-i*12,r=3+i*2.2;ctx.strokeStyle='rgba('+G[1]+','+(.55-i*.15)+')';ctx.lineWidth=1.4;ctx.beginPath();el25(x,0,1.6,r+Math.sin(t*30+i)*.6,0,0,7);ctx.stroke()}}
 if(p.gun==='head'){ctx.strokeStyle='rgba(255,90,80,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(5,0,5,0,7);ctx.stroke()}}
window.gun70=gun70;
const MYK25=new Set(['shuri25','bullet25','holy25','soul25','bone25','palm25','dragonfist25']);
{const _da=drawAir;drawAir=function(){const mine=[],keep=[];for(const p of PROJ)(MYK25.has(p.k)||p.gun?mine:keep).push(p);const all=PROJ.slice();PROJ.length=0;PROJ.push(...keep);try{_da()}finally{PROJ.length=0;PROJ.push(...all)}
 const t=performance.now()/1000;for(const p of mine){const a=Math.atan2(p.vy,p.vx);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);
  if(p.k==='shuri25'){ctx.rotate(t*20);ctx.fillStyle='#c8d0e0';ctx.strokeStyle='#2a2a3a';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<4;i++){const b=i*1.5708;ctx.lineTo(Math.cos(b)*8,Math.sin(b)*8);ctx.lineTo(Math.cos(b+.785)*2.5,Math.sin(b+.785)*2.5)}ctx.closePath();ctx.fill();ctx.stroke()}
  else if(p.gun){gun70(p,t)}
  else if(p.k==='bullet25'){ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(-30,0,6,0);g.addColorStop(0,'rgba(255,200,80,0)');g.addColorStop(1,'rgba(255,240,180,.95)');ctx.fillStyle=g;ctx.fillRect(-30,-1.6,36,3.2);ctx.fillStyle='#fff';ctx.beginPath();el25(4,0,4,2,0,0,7);ctx.fill()}
  else if(p.k==='holy25'||p.k==='soul25'){ctx.globalCompositeOperation='lighter';const c=p.k==='holy25'?'255,245,190':'120,255,170',g=ctx.createRadialGradient(0,0,0,0,0,12);g.addColorStop(0,'#fff');g.addColorStop(.4,'rgba('+c+',.9)');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.beginPath();el25(-4,0,16,10,0,0,7);ctx.fill();if(p.k==='soul25'){ctx.fillStyle='#14102a';ctx.fillRect(-1,-3,2,2);ctx.fillRect(3,-3,2,2)}}
  else if(p.k==='bone25'){ctx.fillStyle='#e8e0d0';ctx.strokeStyle='#4a4038';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-10,-3);ctx.lineTo(-14,0);ctx.lineTo(-10,3);ctx.closePath();ctx.fill();ctx.stroke();ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(120,255,170,.35)';ctx.fillRect(-26,-4,14,8)}
  else{const big=p.k==='dragonfist25',c=big?'255,170,60':'255,220,150';ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba('+c+',.9)';ctx.lineWidth=big?8:5;ctx.beginPath();ctx.arc(-10,0,p.r,-1.1,1.1);ctx.stroke();ctx.fillStyle='rgba('+c+',.35)';ctx.beginPath();ctx.arc(-6,0,p.r*.7,-1.3,1.3);ctx.fill();if(big){ctx.fillStyle='rgba(255,240,180,.9)';ctx.font='bold 18px system-ui';ctx.fillText('龍',-8,6)}}
  ctx.restore()}
 if(!window.__IN_OTHER8)draw25()}}
// กระสุนพิเศษตอนชน: ดูดเลือด / คริแน่นอน
{const _sh=shoot;shoot=function(kind,o){const n=PROJ.length;_sh(kind,o);try{const p=PROJ[PROJ.length-1];if(p&&o){if(o.crit25)p.crit25=1;if(o.leech)p.leech=o.leech}
  /* v5.70: สไนยิงกระสุนแสงปืน — p.gun บอกหน้าตา (t ปกติ · ap เจาะเกราะ · head เล็งหัว · twin ยิงคู่ · he กระสุนระเบิด) · ดาเมจ/ชนิดเดิมไม่เปลี่ยน */
  for(let i=n;i<PROJ.length;i++){const q=PROJ[i];if(o&&o.gun)q.gun=o.gun;else if(kind==='arrow'&&P.cls==='sniper'&&!window._drawingOther){q.gun='t';try{ef25({k:'muzzle',x:q.x,y:q.y,l:.1})}catch(e){}}}}catch(e){}}}
{const _he=hurtE;hurtE=function(e,mult,o){o=o||{};try{for(const p of PROJ){if(p.crit25&&p.hit.has(e)){p.__c=p.__c||new Set();if(!p.__c.has(e)){p.__c.add(e);o.crit=1;break}}}}catch(_){}return _he(e,mult,o)}}
{const _st=skTick;skTick=function(dt){_st(dt);
  try{for(const p of PROJ){if(p.leech&&p.hit&&p.hit.size>(p.__n||0)){P.hp=Math.min(BAL.hp,P.hp+Math.round(clsAtk()*p.mult*p.leech*(p.hit.size-(p.__n||0))));p.__n=p.hit.size}}}catch(e){}}}
// ---------- หน้าตาอาวุธตามคลาส ----------
const TQ25=()=>TIERS[P.tier.sword|0]||TIERS[0];
function wpn25(cls,k){const Q=TQ25();k.lineCap='round';k.lineJoin='round';
 if(cls==='ninja'){k.strokeStyle='#14141a';k.lineWidth=3;k.beginPath();k.moveTo(0,8);k.lineTo(0,-2);k.stroke();k.fillStyle='#c8283a';k.fillRect(-1,8,2,6);const g=k.createLinearGradient(-2,0,2,0);g.addColorStop(0,'#8a96aa');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#6a7488');k.fillStyle=g;k.strokeStyle='#1a1e2a';k.lineWidth=1;k.beginPath();k.moveTo(-1.5,-2);k.quadraticCurveTo(-3,-18,1,-32);k.quadraticCurveTo(2,-18,1.5,-2);k.closePath();k.fill();k.stroke();k.fillStyle=Q.gl;k.fillRect(-3,-3,6,1.6)}
 else if(cls==='dragoon'){k.strokeStyle='#3a2414';k.lineWidth=3;k.beginPath();k.moveTo(0,16);k.lineTo(0,-34);k.stroke();k.strokeStyle=Q.mid;k.lineWidth=1.4;k.stroke();k.fillStyle=Q.hi;k.strokeStyle='#1a1e2a';k.lineWidth=1;k.beginPath();k.moveTo(0,-50);k.lineTo(4,-36);k.lineTo(0,-32);k.lineTo(-4,-36);k.closePath();k.fill();k.stroke();k.fillStyle='#c8283a';k.beginPath();k.moveTo(-2,-32);k.lineTo(-7,-24);k.lineTo(2,-30);k.closePath();k.fill();k.fillStyle=Q.gl;k.fillRect(-4,-33,8,2)}
 else if(cls==='paladin'){const g=k.createLinearGradient(-4,0,4,0);g.addColorStop(0,'#c8a040');g.addColorStop(.5,'#fff6d8');g.addColorStop(1,'#a07a20');k.fillStyle=g;k.strokeStyle='#3a2a08';k.lineWidth=1;k.beginPath();k.moveTo(-4,-2);k.lineTo(-4,-28);k.lineTo(0,-34);k.lineTo(4,-28);k.lineTo(4,-2);k.closePath();k.fill();k.stroke();k.fillStyle='#ffe08a';k.fillRect(-9,-3,18,3);k.strokeRect(-9,-3,18,3);k.fillStyle='#5a3a10';k.fillRect(-1.5,0,3,8);k.fillStyle='#7ad8ff';k.beginPath();k.arc(0,-1.5,1.6,0,7);k.fill();k.save();k.globalCompositeOperation='lighter';G14(k,0,-18,14,'rgba(255,240,170,.35)');k.restore()}
 else if(cls==='monk'){k.save();k.globalCompositeOperation='lighter';G14(k,0,0,10,'rgba(255,200,100,.7)');k.restore();k.strokeStyle='#e8dcc0';k.lineWidth=1.4;for(let i=0;i<3;i++){k.beginPath();k.moveTo(-4,-3+i*2.5);k.lineTo(4,-2+i*2.5);k.stroke()}}
 else if(cls==='cleric'){k.strokeStyle='#c8a040';k.lineWidth=3;k.beginPath();k.moveTo(0,10);k.lineTo(0,-28);k.stroke();k.strokeStyle='#fff6d8';k.lineWidth=1.2;k.stroke();k.strokeStyle='#ffe08a';k.lineWidth=2;k.beginPath();k.arc(0,-34,7,0,7);k.stroke();k.fillStyle='#ffe08a';k.fillRect(-1.2,-44,2.4,20);k.fillRect(-6,-37,12,2.4);k.save();k.globalCompositeOperation='lighter';G14(k,0,-34,14,'rgba(255,250,200,.5)');k.restore()}
 else if(cls==='necro'){k.strokeStyle='#1a1414';k.lineWidth=3;k.beginPath();k.moveTo(0,12);k.lineTo(0,-36);k.stroke();k.fillStyle='#c8d0d0';k.strokeStyle='#1a1e2a';k.lineWidth=1;k.beginPath();k.moveTo(0,-36);k.quadraticCurveTo(-20,-42,-26,-26);k.quadraticCurveTo(-16,-34,-1,-31);k.closePath();k.fill();k.stroke();k.fillStyle='#e8e0d0';k.beginPath();k.arc(0,-38,4,0,7);k.fill();k.fillStyle='#14102a';k.fillRect(-2,-39,1.4,1.4);k.fillRect(1,-39,1.4,1.4);k.save();k.globalCompositeOperation='lighter';G14(k,0,-38,9,'rgba(120,255,170,.6)');k.restore()}
 else if(cls==='summoner'){k.strokeStyle='#5a3a1e';k.lineWidth=3.4;k.beginPath();k.moveTo(0,10);k.quadraticCurveTo(2,-12,0,-30);k.stroke();k.fillStyle='#e8dcc0';k.strokeStyle='#3a2a1a';k.lineWidth=1;for(const s of [-1,1]){k.beginPath();k.moveTo(0,-30);k.quadraticCurveTo(s*10,-38,s*12,-46);k.quadraticCurveTo(s*6,-38,0,-34);k.closePath();k.fill();k.stroke()}for(const [c,y] of [['#c8283a',-20],['#3aa8ff',-16],['#ffd23a',-12]]){k.fillStyle=c;k.beginPath();k.ellipse(4,y,1.6,5,.4,0,7);k.fill()}k.save();k.globalCompositeOperation='lighter';G14(k,0,-34,10,'rgba(180,255,120,.5)');k.restore()}}
const MELEE25=new Set(['ninja','paladin','monk','dragoon']),STAFF25=new Set(['cleric','necro','summoner']);
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){const c=P.cls;if(P.tool==='sword'&&P.armor.sword&&((MELEE25.has(c)&&wKind()==='sword')||(STAFF25.has(c)&&wKind()==='staff'))&&!(FASH.wpn&&FWPN[FASH.wpn])&&window.cwOk25&&cwOk25()){if(STAFF25.has(c)){staffAt7(hx,hy,ang);return}ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r'&&!STAFF25.has(c))ctx.scale(-1,1);try{wpn25(c,ctx)}catch(e){}ctx.restore();return}return _ts(hx,hy,ang)}}
// สไนเปอร์: ปืนไรเฟิลซุ่มยิงแทนธนู
{const _db=drawBow6;drawBow6=function(x,y,aim,tier,pull,arrow,sc){if(P.cls!=='sniper'||!(window.cwOk25&&cwOk25()))return _db(x,y,aim,tier,pull,arrow,sc);const Q=TIERS[tier|0]||TIERS[0];ctx.save();ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc||1,sc||1);
  ctx.fillStyle='#3a2414';ctx.strokeStyle='#100a06';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-14,-3);ctx.lineTo(0,-3);ctx.lineTo(0,3);ctx.lineTo(-10,6);ctx.lineTo(-16,4);ctx.closePath();ctx.fill();ctx.stroke();
  const g=ctx.createLinearGradient(0,-2,0,2);g.addColorStop(0,'#5a5a6a');g.addColorStop(.5,Q.hi);g.addColorStop(1,'#2a2a34');ctx.fillStyle=g;ctx.fillRect(0,-2.4,26,4.2);ctx.strokeRect(0,-2.4,26,4.2);ctx.fillStyle='#1a1a22';ctx.fillRect(26,-1.6,6,2.6);
  ctx.fillStyle='#22222a';ctx.fillRect(4,-7,12,3.4);ctx.fillStyle=Q.gl;ctx.beginPath();ctx.arc(16,-5.3,1.8,0,7);ctx.fill();ctx.fillStyle='#14141a';ctx.fillRect(6,2,2,5);
  if(pull>.6){ctx.globalCompositeOperation='lighter';G14(ctx,33,0,8,'rgba(255,230,150,.7)')}ctx.restore()}}
// ผู้เล่นคนอื่น: ใช้คลาสของเขาตอนวาด
{const _do=drawOther;drawOther=function(o){const sv=P.cls;P.cls=CLS[o.cls]?o.cls:'none';try{return _do(o)}finally{P.cls=sv}}}
// ---------- ไอคอนสกิล ----------
function ic25(q,S,c1,c2,fn){skBg(q,S,c1,c2,'#ffe9a0');try{fn(q,S)}catch(e){}}
const star25=(q,x,y,r,n,c)=>{q.fillStyle=c;q.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,rr=i%2?r*.4:r;q.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}q.closePath();q.fill()};
const ICONS25={
 'ดาวกระจายพายุ':(q,S)=>ic25(q,S,'#3a3a6a','#05050f',q=>{sglow(q,48,48,40,'150,160,255');for(let i=0;i<5;i++){const a=i*1.256;star25(q,48+Math.cos(a)*24,48+Math.sin(a)*24,10,4,'#dfe6f6')}star25(q,48,48,16,4,'#ffffff')}),
 'เงาพริบตา':(q,S)=>ic25(q,S,'#2a2a4a','#000005',q=>{sglow(q,60,40,34,'140,140,255');q.fillStyle='rgba(20,20,40,.9)';q.beginPath();q.ellipse(34,56,12,24,0,0,7);q.fill();q.fillStyle='rgba(120,120,220,.6)';q.beginPath();q.ellipse(60,50,12,24,0,0,7);q.fill();skSword(q,66,30,.6,40,'#ffffff')}),
 'พันเงาสังหาร':(q,S)=>ic25(q,S,'#4a1a3a','#050005',q=>{sglow(q,48,48,42,'200,120,255');for(let i=0;i<6;i++)skSword(q,48,48,i*1.047,44,'#e8e0ff')}),
 'กระสุนเจาะเกราะ':(q,S)=>ic25(q,S,'#5a4a10','#0a0602',q=>{sglow(q,70,30,30,'255,220,120');q.fillStyle='#ffe08a';q.save();q.translate(48,52);q.rotate(-.7);q.fillRect(-26,-5,40,10);q.beginPath();q.moveTo(14,-5);q.lineTo(26,0);q.lineTo(14,5);q.fill();q.restore();q.strokeStyle='rgba(255,240,180,.8)';q.lineWidth=2;for(let i=0;i<3;i++){q.beginPath();q.moveTo(10+i*6,80-i*2);q.lineTo(30+i*6,60-i*2);q.stroke()}}),
 'ยิงสามจังหวะ':(q,S)=>ic25(q,S,'#4a3a10','#050302',q=>{q.strokeStyle='#ffd23a';q.lineWidth=4;q.beginPath();q.arc(48,48,26,0,7);q.stroke();q.beginPath();q.moveTo(48,10);q.lineTo(48,86);q.moveTo(10,48);q.lineTo(86,48);q.stroke();q.fillStyle='#ff4a3a';q.beginPath();q.arc(48,48,6,0,7);q.fill()}),
 'ห่ากระสุนพิฆาต':(q,S)=>ic25(q,S,'#6a2a0a','#0a0200',q=>{sglow(q,48,60,40,'255,160,40');for(let i=0;i<9;i++){q.fillStyle='#ffe08a';q.fillRect(14+i*8,10+(i%3)*10,3,26)}q.fillStyle='rgba(255,120,30,.8)';q.beginPath();q.ellipse(48,72,34,12,0,0,7);q.fill()}),
 'ค้อนศักดิ์สิทธิ์':(q,S)=>ic25(q,S,'#6a5a20','#0a0802',q=>{sglow(q,48,40,40,'255,240,170');q.fillStyle='#ffe08a';q.save();q.translate(48,48);q.rotate(-.6);q.fillRect(-4,-6,8,44);q.fillStyle='#fff6d8';q.fillRect(-18,-24,36,20);q.restore()}),
 'ดาบแห่งแสง':(q,S)=>ic25(q,S,'#5a5a2a','#060602',q=>{sglow(q,48,40,42,'255,250,200');skSword(q,48,84,0,66,'#fff6d8','#ffd23a')}),
 'ปราการเทพ':(q,S)=>ic25(q,S,'#4a4a6a','#05050a',q=>{sglow(q,48,48,40,'255,240,170');q.fillStyle='#ffe08a';q.strokeStyle='#5a4010';q.lineWidth=3;q.beginPath();q.moveTo(48,12);q.lineTo(78,24);q.lineTo(74,58);q.lineTo(48,84);q.lineTo(22,58);q.lineTo(18,24);q.closePath();q.fill();q.stroke();q.fillStyle='#fff6d8';q.fillRect(44,28,8,40);q.fillRect(32,40,32,8)}),
 'แสงรักษา':(q,S)=>ic25(q,S,'#2a6a4a','#020a05',q=>{sglow(q,48,48,42,'150,255,180');q.fillStyle='#bfffd0';q.fillRect(40,20,16,56);q.fillRect(20,40,56,16)}),
 'พิพากษาสวรรค์':(q,S)=>ic25(q,S,'#6a6a3a','#0a0a05',q=>{sglow(q,48,30,40,'255,250,200');q.fillStyle='rgba(255,250,210,.85)';q.beginPath();q.moveTo(36,0);q.lineTo(60,0);q.lineTo(56,90);q.lineTo(40,90);q.closePath();q.fill();star25(q,48,26,12,8,'#ffffff')}),
 'อวยพรเทวา':(q,S)=>ic25(q,S,'#4a5a7a','#05060a',q=>{sglow(q,48,48,40,'255,250,220');q.strokeStyle='#ffe08a';q.lineWidth=3;q.beginPath();q.ellipse(48,24,16,5,0,0,7);q.stroke();for(const s of [-1,1]){q.fillStyle='#ffffff';q.beginPath();q.moveTo(48,50);q.quadraticCurveTo(48+s*30,26,48+s*40,40);q.quadraticCurveTo(48+s*30,60,48,64);q.fill()}}),
 'ปลุกโครงกระดูก':(q,S)=>ic25(q,S,'#2a4a3a','#000503',q=>{sglow(q,48,60,40,'120,255,170');q.fillStyle='#e8e0d0';q.beginPath();q.arc(48,40,18,0,7);q.fill();q.fillStyle='#14102a';q.beginPath();q.arc(41,38,5,0,7);q.arc(55,38,5,0,7);q.fill();q.fillStyle='#e8e0d0';q.fillRect(38,54,20,8);q.fillStyle='rgba(120,255,170,.9)';q.beginPath();q.arc(41,38,2,0,7);q.arc(55,38,2,0,7);q.fill()}),
 'คำสาปวิญญาณ':(q,S)=>ic25(q,S,'#1a4a3a','#000302',q=>{sglow(q,48,48,42,'120,255,170');q.fillStyle='rgba(200,255,220,.85)';q.beginPath();q.arc(48,40,18,Math.PI,0);q.lineTo(66,70);for(let i=0;i<4;i++)q.lineTo(60-i*6,64+(i%2)*6);q.lineTo(30,70);q.closePath();q.fill();q.fillStyle='#14102a';q.fillRect(40,36,4,6);q.fillRect(52,36,4,6)}),
 'กองทัพมรณะ':(q,S)=>ic25(q,S,'#2a3a2a','#000200',q=>{sglow(q,48,70,44,'120,255,170');for(let i=0;i<3;i++){const x=24+i*24;q.fillStyle='#e8e0d0';q.beginPath();q.arc(x,46,11,0,7);q.fill();q.fillStyle='#14102a';q.fillRect(x-6,43,4,4);q.fillRect(x+2,43,4,4)}}),
 'หมัดพันครั้ง':(q,S)=>ic25(q,S,'#6a3a10','#0a0502',q=>{sglow(q,60,48,36,'255,200,120');for(let i=0;i<5;i++){q.fillStyle='rgba(255,220,170,'+(.3+i*.15)+')';q.beginPath();q.arc(30+i*9,48+(i%2?6:-6),12,0,7);q.fill()}}),
 'ฝ่ามือมังกร':(q,S)=>ic25(q,S,'#7a4a10','#0a0502',q=>{sglow(q,48,48,42,'255,210,120');q.fillStyle='#ffe0b0';q.beginPath();q.ellipse(48,54,18,22,0,0,7);q.fill();for(let i=0;i<4;i++)q.fillRect(32+i*9,20,7,26)}),
 'จิตอรหันต์':(q,S)=>ic25(q,S,'#7a5a2a','#0a0802',q=>{sglow(q,48,48,44,'255,220,140');for(let i=0;i<8;i++){const a=i*.785;q.fillStyle=i%2?'#ffb0c8':'#ffd8e0';q.beginPath();q.ellipse(48+Math.cos(a)*18,56+Math.sin(a)*10,12,6,a,0,7);q.fill()}q.fillStyle='#ffe08a';q.beginPath();q.arc(48,40,10,0,7);q.fill()}),
 'แทงทะลวง':(q,S)=>ic25(q,S,'#6a1a10','#0a0201',q=>{sglow(q,70,26,30,'255,160,120');q.strokeStyle='#e8e0d0';q.lineWidth=5;q.beginPath();q.moveTo(14,82);q.lineTo(70,26);q.stroke();q.fillStyle='#ffffff';q.beginPath();q.moveTo(84,12);q.lineTo(66,24);q.lineTo(72,30);q.closePath();q.fill()}),
 'กระโดดมังกร':(q,S)=>ic25(q,S,'#5a1a2a','#0a0203',q=>{sglow(q,48,74,40,'255,140,100');q.fillStyle='#c83a2a';q.beginPath();q.moveTo(48,10);q.lineTo(64,40);q.lineTo(52,36);q.lineTo(52,70);q.lineTo(44,70);q.lineTo(44,36);q.lineTo(32,40);q.closePath();q.fill();q.strokeStyle='rgba(255,220,170,.8)';q.lineWidth=3;q.beginPath();q.ellipse(48,78,30,8,0,0,7);q.stroke()}),
 'มังกรเทพลงมา':(q,S)=>ic25(q,S,'#8a2a0a','#0a0200',q=>{sglow(q,48,60,44,'255,140,40');q.fillStyle='#8a1a0a';q.beginPath();q.moveTo(20,30);q.quadraticCurveTo(48,0,76,30);q.lineTo(48,74);q.closePath();q.fill();q.fillStyle='#ffd23a';q.beginPath();q.arc(40,34,3,0,7);q.arc(56,34,3,0,7);q.fill()}),
 'เรียกหมาป่า':(q,S)=>ic25(q,S,'#2a5a2a','#020502',q=>{sglow(q,48,48,40,'180,255,120');q.fillStyle='#c8d8b0';q.beginPath();q.moveTo(24,30);q.lineTo(34,14);q.lineTo(40,30);q.lineTo(56,30);q.lineTo(62,14);q.lineTo(72,30);q.lineTo(68,60);q.lineTo(48,78);q.lineTo(28,60);q.closePath();q.fill();q.fillStyle='#d8ff7a';q.fillRect(36,42,6,4);q.fillRect(54,42,6,4)}),
 'สัญชาตญาณป่า':(q,S)=>ic25(q,S,'#4a3a1a','#050302',q=>{sglow(q,48,48,40,'255,220,140');q.fillStyle='#8a5a2e';for(const s of [-1,1]){q.beginPath();q.moveTo(48,48);q.quadraticCurveTo(48+s*24,20,48+s*44,34);q.lineTo(48+s*14,56);q.closePath();q.fill()}q.fillStyle='#f4ead8';q.beginPath();q.arc(48,44,9,0,7);q.fill();q.fillStyle='#ffc23a';q.fillRect(55,44,7,3)}),
 'ราชสีห์วิญญาณ':(q,S)=>ic25(q,S,'#7a5a10','#0a0802',q=>{sglow(q,48,48,44,'255,230,140');for(let i=0;i<12;i++){const a=i*.5236;q.fillStyle='#e8a030';q.beginPath();q.ellipse(48+Math.cos(a)*22,48+Math.sin(a)*22,10,6,a,0,7);q.fill()}q.fillStyle='#ffe9a0';q.beginPath();q.arc(48,48,18,0,7);q.fill();q.fillStyle='#3a2a08';q.fillRect(40,44,4,4);q.fillRect(52,44,4,4)})};
for(const n in ICONS25)SKART[n]=ICONS25[n];
// ---------- หน้าเลือกอาชีพ: 11 คลาส เลื่อนดูได้ ----------
{const _oc=openClassMenu;openClassMenu=function(){try{ZM.open=false;SHOPK=null;STN.open=null;hideBag();sfx('ui');const cur=P.cls;
 let h='<button class="mini x xclose" onclick="closeClassMenu()">✕</button><b>🎓 ปรมาจารย์อาชีพ — เลือกเส้นทางของเจ้า (11 อาชีพ)</b><small>อาชีพปัจจุบัน: '+CLS[cur].e+' '+CLS[cur].n+(cur==='none'?' · เลือกครั้งแรกฟรี':' · เปลี่ยนอาชีพ 500 🪙')+(P.lv<CLASS_LV?' · <span style="color:#ffd84a">🔒 ต้อง Lv.'+CLASS_LV+' (ตอนนี้ Lv.'+P.lv+')</span>':'')+'</small><div class="cls7 cls25">';
 for(const k of Object.keys(CLS)){if(k==='none')continue;const C=CLS[k],L=CSKILLS[k]||[],PL=PASSIVE[k]||[],isNew=!!NC25[k];
  const sk=L.map(s=>{let u=null;try{u=skillIcon(s.n)}catch(e){}return '<span title="'+s.n+'">'+(u?'<img src="'+u+'">':s.e)+s.n+' <i style="opacity:.6;font-style:normal">Lv.'+s.lv+'</i></span>'}).join('');
  const ps=PL.map(p=>'<small class="'+(cur===k&&P.lv>=p.lv?'':'lk')+'">'+(cur===k&&P.lv>=p.lv?'🌟':'◇')+' '+p.n+' (Lv.'+p.lv+') — '+p.d+'</small>').join('');
  h+='<div class="cc7'+(cur===k?' on':'')+'" style="--cc:'+C.col+'"><div class="ch"><span class="e">'+C.e+'</span><b>'+C.n+(isNew?' <i class="nw25">ใหม่</i>':'')+'<br><small style="color:#fff;opacity:.7;font-weight:600">อาวุธ: '+WNAME[NEEDW[k]]+'</small></b></div>'
   +'<div class="ds">'+C.d+'</div><div class="tt7">🌟 ติดตัว: '+(C.pas||'-')+'</div><div class="tt7">⚔️ สกิล</div><div class="sk">'+sk+'</div><div class="tt7">🛡️ พาสซีฟ</div><div class="ps">'+ps+'</div>'
   +(cur===k?'<button class="mini" disabled>✓ อาชีพปัจจุบัน</button>':'<button class="mini ok" onclick="pickClass(\''+k+'\')">'+(cur==='none'?'เลือกเส้นทางนี้':'เปลี่ยน (500🪙)')+'</button>')+'</div>'}
 h+='</div>';shopEl.innerHTML=h;shopEl.hidden=false;CM.open=true}catch(e){console.warn('[cls25]',e);return _oc()}};window.openClassMenu=openClassMenu}
{const st=document.createElement('style');st.textContent='#shop .cls25{grid-template-columns:repeat(auto-fill,minmax(230px,1fr))!important;max-height:min(68vh,520px);overflow-y:auto;padding-right:4px}#shop .cls25 .nw25{font-style:normal;font-size:9px;background:#ff4a6a;color:#fff;border-radius:6px;padding:0 5px;vertical-align:middle}';document.head.appendChild(st)}
// ป้ายอาวุธที่ต้องใช้ (ชื่อ)
try{NPC_DATA.forEach(n=>{if(n.name==='ปรมาจารย์อาชีพ')n.lines=['เลือกเส้นทางของเจ้า — มีถึง 11 อาชีพ: ดาบ เวท ธนู นินจา สไนเปอร์ พาลาดิน นักบวช เนโครแมนเซอร์ มังค์ อัศวินมังกร ผู้อัญเชิญสัตว์']})}catch(e){}
// ดาบบนหลัง: ใช้รูปอาวุธประจำคลาส (นินจา/พาลาดิน/อัศวินมังกร) · มังค์ไม่มีอาวุธบนหลัง
const BKI25={};
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(window.BACKSW7>0&&type==='sword'&&MELEE25.has(P.cls)&&window.cwOk25&&cwOk25()&&!(FASH.wpn&&typeof FWPN!=='undefined'&&FWPN[FASH.wpn])){const key=P.cls+'|'+(P.tier.sword|0);let c=BKI25[key];if(!c){c=document.createElement('canvas');c.width=c.height=64;const k=c.getContext('2d');if(P.cls!=='monk'){const s={ninja:1.35,paladin:1.25,dragoon:.88}[P.cls]||1;k.translate(32,P.cls==='dragoon'?50:46);k.scale(s,s);try{wpn25(P.cls,k)}catch(e){}}BKI25[key]=c}return c}return _ti(type,tier,sz)}}

// =====================================================================
