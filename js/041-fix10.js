// fix10.js (v4.19) — 🌿 ฟาร์มธรรมชาติ · 🎉 อีเวนต์ประจำวัน · 📜 เนื้อเรื่องภาคใหม่ (หอคอย/ตลาด/บอสโลก)
// =====================================================================
// ---------- 🌿 ที่ดิน/ฟาร์ม: ป่าล้อมรอบ ทุ่งดอกไม้ พุ่มไม้ ก้อนหิน ทางเดินหิน + ผีเสื้อ/หิ่งห้อย ----------
function homeDecor11(Zm){try{const k=Zm.cv.getContext('2d'),m=Zm.m,W=Zm.W||HW,H=Zm.H||HH,used=new Set(Object.keys(HOME.tiles||{}));
  for(const b of HOME.builds||[]){const B=BLD[b.k];if(!B)continue;for(let y=b.y-1;y<=b.y+B.h;y++)for(let x=b.x-1;x<=b.x+B.w;x++)used.add(x+','+y)}
  const free=(x,y)=>m[y]&&m[y][x]===FL&&!used.has(x+','+y)&&Math.abs(x-HENT.x+.5)>2&&!(x>=HLOT.x-1&&x<=HLOT.x+HLOT.w&&y>=HLOT.y-1&&y<=HLOT.y+HLOT.h);
  const tree=(px,py,s,h)=>{k.fillStyle='rgba(0,0,0,.22)';k.beginPath();k.ellipse(px,py+10*s,14*s,5*s,0,0,7);k.fill();k.fillStyle='#6a4426';k.fillRect(px-3*s,py-4*s,6*s,15*s);
   const g=['#2f7a34','#3a8a3a','#4a9a44','#2a6a30'];for(const [dx,dy,r,c] of [[0,-16,14,0],[-9,-8,10,1],[9,-9,10,3],[0,-24,9,2]]){k.fillStyle=g[(c+(h*7|0))%4];k.beginPath();k.arc(px+dx*s,py+dy*s,r*s,0,7);k.fill()}
   k.fillStyle='rgba(255,255,255,.12)';k.beginPath();k.arc(px-4*s,py-22*s,5*s,0,7);k.fill()};
  // แนวป่ารอบที่ดิน (กว้าง 2 ช่อง) — ทึบเดินไม่ได้
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const edge=x<=2||x>=W-3||y<=1||y>=H-3;if(!edge||!free(x,y))continue;m[y][x]=WL;const h=hash(x*3.1,y*1.7);tree(x*T+16,y*T+22,.85+h*.35,h)}
  // ทุ่งดอกไม้ พุ่มไม้ ก้อนหิน
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!free(x,y))continue;const h=hash(x*1.9+7,y*2.9+3),px=x*T,py=y*T;
   const fl=typeof vn==='function'?vn(x/4.5,y/4.5):h;
   if(fl>.62){for(let i=0;i<5;i++){const a=hash(x+i*1.3,y-i*.7);k.fillStyle=['#ff7ab0','#ffe06a','#ffffff','#b08aff','#ff9a5a'][Math.floor(a*5)];k.beginPath();k.arc(px+4+a*24,py+4+hash(y+i,x)*24,2.2,0,7);k.fill();k.fillStyle='#3a8a3a';k.fillRect(px+4+a*24-.5,py+6+hash(y+i,x)*24,1,4)}}
   else if(h>.965){k.fillStyle='#3e8a3a';k.beginPath();k.arc(px+16,py+18,9,0,7);k.arc(px+9,py+21,7,0,7);k.arc(px+23,py+21,7,0,7);k.fill();k.fillStyle='#e84a5a';for(let i=0;i<3;i++){k.beginPath();k.arc(px+9+i*7,py+16+(i%2)*4,1.8,0,7);k.fill()}}
   else if(h<.025){k.fillStyle='#8a8a92';k.beginPath();k.ellipse(px+16,py+22,8,5,0,0,7);k.fill();k.fillStyle='#a8a8b2';k.beginPath();k.ellipse(px+14,py+20,4,2.5,0,0,7);k.fill()}
   else if(h>.9){k.strokeStyle='#4a9a3a';k.lineWidth=1.4;for(let i=0;i<4;i++){k.beginPath();k.moveTo(px+10+i*4,py+26);k.lineTo(px+8+i*4+(i%2?3:-2),py+16);k.stroke()}}}
  // ทางเดินหินจากทางเข้า
  for(let y=HLOT.y+HLOT.h+1;y<H-1;y++)for(const x of [HENT.x-1,HENT.x]){if(!m[y]||m[y][x]!==FL)continue;const px=x*T,py=y*T;for(let i=0;i<2;i++){const h=hash(x*2+i,y*3);k.fillStyle=h>.5?'#b8a888':'#c8b898';k.beginPath();k.ellipse(px+8+i*14,py+10+h*12,7,5,h,0,7);k.fill();k.strokeStyle='rgba(80,60,40,.35)';k.stroke()}}
  // รั้วไม้รอบแปลงบ้าน
  k.fillStyle='#8a5a2e';const fx0=(HLOT.x-1)*T,fx1=(HLOT.x+HLOT.w+1)*T,fy=(HLOT.y+HLOT.h+.85)*T;for(let x=fx0;x<fx1;x+=10){if(Math.abs(x-HENT.x*T)<36)continue;k.fillRect(x,fy-10,3,14)}k.fillRect(fx0,fy-6,HENT.x*T-36-fx0,2.5);k.fillRect(HENT.x*T+36,fy-6,fx1-HENT.x*T-36,2.5);
 }catch(e){console.warn('[decor11]',e)}}
{const _b=buildHomeZone;buildHomeZone=function(){const Zm=_b();Zm.W=Zm.W||HW;Zm.H=Zm.H||HH;homeDecor11(Zm);try{if(D&&D.home&&D.zone===Zm)mkMini(Zm.cv,ZW,ZH,4)}catch(e){}return Zm}}
// ผีเสื้อกลางวัน / หิ่งห้อยกลางคืน ในที่ดิน
const BUG11=[];
{const _h=hero;hero=function(){_h();try{if(!(D&&D.home)||window.__IN_OTHER8)return;const t=performance.now()/1000,night=typeof isNight==='function'?isNight():false;
  if(BUG11.length<14)BUG11.push({x:P.x+(Math.random()-.5)*600,y:P.y+(Math.random()-.5)*400,a:Math.random()*6,s:.5+Math.random(),c:['#ffd84a','#ff8ab0','#8ad8ff','#ffffff'][Math.random()*4|0]});
  ctx.save();for(const b of BUG11){b.a+=.03*b.s;b.x+=Math.cos(b.a*1.3)*.6*b.s;b.y+=Math.sin(b.a)*.4*b.s;if(Math.hypot(b.x-P.x,b.y-P.y)>520){b.x=P.x+(Math.random()-.5)*500;b.y=P.y+(Math.random()-.5)*360}
   if(night){const al=.45+.45*Math.sin(t*3+b.a*5);const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,7);g.addColorStop(0,'rgba(220,255,140,'+al+')');g.addColorStop(1,'rgba(220,255,140,0)');ctx.fillStyle=g;ctx.fillRect(b.x-7,b.y-7,14,14)}
   else{const w=Math.abs(Math.sin(t*14+b.a*3))*4+1;ctx.fillStyle=b.c;ctx.beginPath();ctx.ellipse(b.x-w/2,b.y,w/2+.5,2.5,0,0,7);ctx.ellipse(b.x+w/2,b.y,w/2+.5,2.5,0,0,7);ctx.fill();ctx.fillStyle='#2a1a10';ctx.fillRect(b.x-.5,b.y-2,1,4)}}ctx.restore()}catch(e){}}}

// ---------- 🎉 อีเวนต์ประจำวัน (เวลาไทย ทุกชั่วโมงคู่ นาที 00–40 ยกเว้นช่วงบอสโลก 12:00/20:00) ----------
const EV11={K:[
  {k:'xp',n:'⭐ ชั่วโมงทอง: XP ×2',d:'ล่ามอนได้ค่าประสบการณ์สองเท่า'},
  {k:'gold',n:'🪙 ฝนเหรียญ: เหรียญ ×2',d:'ล่ามอนได้เหรียญสองเท่า'},
  {k:'meteor',n:'☄️ ฝนดาวตก',d:'ดาวตกลงทุ่งหญ้าและเหมือง — วิ่งไปเก็บหินตีบวกและอัญมณี'},
  {k:'drop',n:'🎁 เทศกาลดรอป: วัตถุดิบ ×2',d:'มอนดรอปวัตถุดิบเพิ่มเป็นสองเท่า'}],cur:null,said:''};
function evNow11(){const d=new Date(srvNow()+7*3600e3),h=d.getUTCHours(),mi=d.getUTCMinutes();if(h%2||h===12||h===20||mi>=40)return null;
 const day=Math.floor((srvNow()+7*3600e3)/864e5);return Object.assign({end:srvNow()+(40-mi)*60e3-d.getUTCSeconds()*1e3},EV11.K[(day*3+h/2)%EV11.K.length])}
window.EV11=EV11;window.evNow11=evNow11;
const evHud11=document.createElement('div');evHud11.style.cssText='position:absolute;right:8px;top:calc(92px + var(--st,0px));z-index:5;font:800 10.5px system-ui,"Noto Sans Thai";color:#fff;background:linear-gradient(90deg,#7a3aa8,#c8508a);border:1.5px solid #ffd0f0;border-radius:9px;padding:3px 8px;display:none;pointer-events:none;max-width:46vw;text-align:right';
gid('wrap').appendChild(evHud11);
setInterval(()=>{try{const e=evNow11();EV11.cur=e;if(!e||!titleEl.hidden){evHud11.style.display='none';return}const left=Math.max(0,(e.end-srvNow())/1000);
  evHud11.style.display='';evHud11.innerHTML=e.n+' · ⌛ '+Math.floor(left/60)+':'+String(Math.floor(left%60)).padStart(2,'0');
  const key=e.k+'@'+Math.floor(e.end/60e3);if(EV11.said!==key){EV11.said=key;try{sysSay('🎉 อีเวนต์เริ่มแล้ว! '+e.n+' — '+e.d+' (40 นาที)');banner('🎉 '+e.n,e.d)}catch(_){}}}catch(_){}},1000);
{const _gx=gainXp;gainXp=function(n){return _gx(EV11.cur&&EV11.cur.k==='xp'&&n>0?n*2:n)}}
{const _mk=mobKill;mobKill=function(m){const c0=inv.coin;const r=_mk(m);try{const e=EV11.cur;if(e&&!(D&&(D.tower10||D.wb10))){if(e.k==='gold'&&inv.coin>c0)inv.coin+=inv.coin-c0;
   if(e.k==='drop'){const Zd=D&&D.zone&&D.zone.Zd;if(Zd&&Zd.raw){addDrop(Zd.raw,m.x,m.y);if(m.boss||m.elite)addDrop(Zd.ing,m.x,m.y)}}}}catch(_){}return r}}
// ☄️ ดาวตก: ตกใกล้ผู้เล่นในทุ่งหญ้า/เหมืองทุก ~18 วินาที
const MET11=[];
setInterval(()=>{try{const e=EV11.cur;if(!e||e.k!=='meteor'||P.dead||PAUSED||(D&&(D.town||D.shop||D.home||D.tower10||D.wb10||D.mk10||D.arena8)))return;if(Math.random()>.33)return;
  for(let g=0;g<20;g++){const a=Math.random()*6.28,r=90+Math.random()*200,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(typeof wHit7==='function'&&wHit7(x,y))continue;MET11.push({x,y,t:0});sfx('warp');break}}catch(_){}},6000);
{const _h=hero;hero=function(){_h();try{if(!MET11.length||window.__IN_OTHER8)return;const dt=Math.min(.05,DT||.016);ctx.save();
  for(const mt of MET11.slice()){mt.t+=dt;const u=Math.min(1,mt.t/1.1),sx=mt.x+160*(1-u),sy=mt.y-320*(1-u);
   if(u<1){ctx.strokeStyle='rgba(255,200,120,.8)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sx+40,sy-80);ctx.lineTo(sx,sy);ctx.stroke();const g=ctx.createRadialGradient(sx,sy,0,sx,sy,12);g.addColorStop(0,'#fff8d0');g.addColorStop(1,'rgba(255,120,30,0)');ctx.fillStyle=g;ctx.fillRect(sx-12,sy-12,24,24);
    ctx.strokeStyle='rgba(255,90,40,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(mt.x,mt.y,18*u,7*u,0,0,7);ctx.stroke()}
   else{MET11.splice(MET11.indexOf(mt),1);try{sfx('thud');for(let i=0;i<20;i++)rfxP(mt.x,mt.y,(Math.random()-.5)*160,-40-Math.random()*120,.8,'255,160,60',2.4,'spark');
     const n=1+(Math.random()<.5);for(let i=0;i<n;i++)addDrop('estone',mt.x,mt.y);if(Math.random()<.35)addDrop('gem',mt.x,mt.y);if(Math.random()<.12)addDrop('bless',mt.x,mt.y)}catch(_){}}}
  ctx.restore()}catch(_){}}}

// ---------- 📜 เนื้อเรื่องภาคใหม่: “เงาเหนือหอคอย” ----------
try{const free=STCH.findIndex(c=>c.free);if(free>0&&!STCH.some(c=>c.ch11)){
 const tw=()=>(typeof TW10!=='undefined'&&TW10.data.max)|0;
 STCH.splice(free,0,
  {ch11:1,t:'บทที่ 14: หอคอยที่ไม่ควรมีอยู่',d:'พิชิตหอคอยบอสชั้น 3 (เมนู 🗼 หอคอย)',need:()=>[Math.min(tw(),3),3],
   intro:'หลังเงาแห่งห้วงลึกถูกผนึก หอคอยดำทะมึนก็ผุดขึ้นกลางฟ้า… มีบางสิ่งเรียกพลังจากเศษเงาที่เหลืออยู่ ไปสำรวจสามชั้นแรกให้ข้าที',
   done:['หอคอยนั้นสร้างจากเงาที่เจ้าผนึกไว้… ผู้เฝ้าแต่ละชั้นคือเสี้ยววิญญาณของผู้กล้าที่เคยพ่ายแพ้','เจ้าต้องการพันธมิตร และเสบียงที่มากกว่านี้ ไปที่ตลาดกลางเถิด'],rw:{coin:8000,xp:6000,estone:10,bless:2}},
  {ch11:1,t:'บทที่ 15: ตลาดแห่งผู้กล้า',d:'ไปตลาดกลาง แล้วซื้อหรือขายของกับผู้เล่นคนอื่น 1 ครั้ง',need:()=>[STORY.mk11|0,1],
   intro:'พ่อค้าจากทุกสารทิศมารวมตัวที่ตลาดกลาง เพราะได้ข่าวว่าหอคอยจะปล่อยสมบัติออกมา จงไปแลกเปลี่ยนกับผู้กล้าคนอื่นให้ได้สักครั้ง',
   done:['ดี! การค้าทำให้เอลโดเรียแข็งแกร่ง','แต่ข่าวร้ายมาถึงแล้ว… บนยอดเขาไฟ มหาอสูรอัคคีตื่นขึ้นจากพลังหอคอย มันจะปรากฏตอนเที่ยงและสองทุ่ม'],rw:{coin:10000,xp:8000,estone:8,scroll:2}},
  {ch11:1,t:'บทที่ 16: เปลวไฟเที่ยงวัน',d:'ร่วมปราบบอสโลก 1 ครั้ง (12:00 หรือ 20:00)',need:()=>[STORY.wb11|0,1],
   intro:'มหาอสูรอัคคีเอลโดเรียแข็งแกร่งเกินกว่าใครคนเดียวจะรับไหว รวมพลผู้กล้าทุกคนที่ลานบอสโลก แล้วปราบมันให้ได้!',
   done:['พวกเจ้าทำได้! เปลวไฟของมันดับลง แต่เถ้าถ่านลอยกลับไปที่ยอดหอคอย…','ผู้บงการตัวจริงรออยู่บนชั้นสูงสุด จงเตรียมอาวุธที่ดีที่สุดของเจ้า'],rw:{coin:15000,xp:12000,estone:15,bless:3,rune:2}},
  {ch11:1,t:'บทที่ 17: ยอดหอคอย',d:'พิชิตหอคอยบอสชั้น 12',need:()=>[Math.min(tw(),12),12],
   intro:'สิบสองชั้นแห่งความสิ้นหวัง ผู้บงการเงาชื่อ “มหาทรราช” รออยู่ที่ยอด จงพิสูจน์ว่าแสงอรุณยังไม่ดับ',
   done:['มหาทรราชล่มสลาย หอคอยสั่นสะเทือนและกลายเป็นหอคอยแห่งการฝึกฝนของผู้กล้า','ชื่อของเจ้าจะถูกจารึกไว้ในประวัติศาสตร์เอลโดเรียตลอดไป ผู้พิชิตยอดหอคอย!'],rw:{coin:50000,xp:30000,estone:30,bless:8,rune:3}});
 try{updTrack()}catch(_){}}}catch(e){console.warn('[story11]',e)}
// นับเหตุการณ์ของเนื้อเรื่อง
{const _sg=stallGot10;stallGot10=function(d){_sg(d);try{if(d&&d.ok){STORY.mk11=1;saveStory()}}catch(_){}}}
{const _ss=stallSold10;stallSold10=function(d){_ss(d);try{STORY.mk11=1;saveStory()}catch(_){}}}
{const _ww=wbWin10;wbWin10=function(d){_ww(d);try{STORY.wb11=1;saveStory()}catch(_){}}}
{const _ml=mail10;mail10=function(list){_ml(list);try{if((list||[]).some(m=>m.k==='wbwin')){STORY.wb11=1;saveStory()}}catch(_){}}}

// =====================================================================
