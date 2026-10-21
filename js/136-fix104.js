// fix104 (v4.89) — 🪽 คอสตูมปีก 5 ชุด + อาวุธคอสตูมชุดใหม่ 11 อาชีพ (เจ้าของสั่ง 2026-10-14 16:04: "คอสตูมมีปีกด้วยก็ดี · คอสตูมอาวุธทุกคลาสทุกอาชีพไม่ซ้ำกัน")
//  - ชุดปีก (OUTFIT wg_*): ปีกเทวดา · ปีกปีศาจ · ปีกผีเสื้อจันทรา · ปีกมังกรเพลิง · ปีกดาราจักร — ปีกขยับตามจังหวะเดิน/ยืน วาดหลังตัว (หันหลัง = วาดหน้าตัว) · ผู้เล่นอื่นเห็น
//  - อาวุธคอสตูมชุดนครวารี (FWPN w2_*): ทรงใหม่ทุกอาชีพ ไม่ซ้ำกันและไม่ใช่เปลี่ยนสี — ธนูและปืนวาดเองทั้งกระบอก (ไม่ใช้ธนู/ปืนเดิมเปลี่ยนสี)
//  - ซื้อที่บูติก/ห้องเสื้อด้วย 💠 (ราคาอยู่ทั้ง GEMP69 ฝั่งเกม และ accounts.js GEMP ฝั่งเซิร์ฟเวอร์)
try{
// ---------- ชุดปีก ----------
const WG104={
 wg_angel:{n:'🪽 ชุดเทวดารุ่งอรุณ',TOP:'#f4f0e6',COLLAR:'#e8c14a',BLK:'#d8d0c0',LEG2:'#b8b0a0',wing:'angel',fx58:'holy',gem:320,d:'ปีกขนนกสีขาวสามชั้น ขอบทองเรืองแสง'},
 wg_demon:{n:'🦇 ชุดจอมปีศาจราตรี',TOP:'#2a0a14',COLLAR:'#c81a3a',BLK:'#14060a',LEG2:'#0a0306',wing:'demon',fx58:'shadow',gem:320,d:'ปีกค้างคาวสีเลือด กระดูกปีกมีกรงเล็บ'},
 wg_fairy:{n:'🦋 ชุดราชินีผีเสื้อจันทรา',TOP:'#c8e8ff',COLLAR:'#ff9ad8',BLK:'#8ab8e8',LEG2:'#6a98c8',wing:'fairy',fx58:'spark',gem:300,d:'ปีกผีเสื้อใสสี่กลีบ ลายจุดเรืองแสง'},
 wg_dragon:{n:'🐉 ชุดอัศวินมังกรเพลิง',TOP:'#6a1a0a',COLLAR:'#ffb03a',BLK:'#3a0a04',LEG2:'#2a0602',wing:'dragon',fx58:'ember',gem:340,d:'ปีกมังกรเยื่อสีเพลิง หนามตามกระดูกปีก'},
 wg_galaxy:{n:'🌌 ชุดผู้พิทักษ์ดาราจักร',TOP:'#1a1a4a',COLLAR:'#9ad8ff',BLK:'#10102a',LEG2:'#0a0a1e',wing:'galaxy',fx58:'rune',gem:380,d:'ปีกผลึกดาราจักร มีดาวกะพริบในปีก'}};
for(const k in WG104){const W=WG104[k];OUTFIT[k]=Object.assign({},OUTFIT[k]||{},{n:W.n,p:30000,TOP:W.TOP,COLLAR:W.COLLAR,BLK:W.BLK,LEG2:W.LEG2,wing:W.wing,fx58:W.fx58,d:W.d+' (ทุกอาชีพ)'});GEMP69['b:'+k]=W.gem}
function wing104(type,dir,t,front){const x=P.x,y=P.y-27,mv=P.mv?1:0,fl=Math.sin(t*(mv?9:3))*(mv?.22:.1),side=dir==='l'||dir==='r',f=dir==='l'?-1:1;
 ctx.save();ctx.translate(x,y);if(side){ctx.translate(-f*4,0);ctx.scale(.62,1)}
 const one=s=>{ctx.save();ctx.scale(s,1);ctx.rotate(-fl*s*0);ctx.rotate(fl);
  if(type==='angel'){for(let r=0;r<3;r++)for(let i=0;i<6;i++){const a=-.35-i*.17+r*.05,L=14+i*3.4-r*4,x0=3+r*3,yy=r*5;ctx.save();ctx.translate(x0,yy-2);ctx.rotate(a);ctx.fillStyle=r===2?'#ffffff':r===1?'#f4f0e6':'#e8e2d4';ctx.strokeStyle='rgba(150,130,80,.7)';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(L/2,0,L/2,3.4-r*.4,0,0,7);ctx.fill();ctx.stroke();ctx.restore()}
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,220,120,.6)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(3,-2);ctx.quadraticCurveTo(18,-22,30,-12);ctx.stroke();ctx.restore()}
  else if(type==='demon'){ctx.fillStyle='rgba(120,10,30,.92)';ctx.strokeStyle='#14060a';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(2,-2);ctx.lineTo(12,-22);ctx.lineTo(30,-24);ctx.quadraticCurveTo(26,-14,30,-6);ctx.quadraticCurveTo(22,-8,22,2);ctx.quadraticCurveTo(14,-2,12,8);ctx.quadraticCurveTo(8,2,2,4);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.strokeStyle='#2a0a10';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(2,-2);ctx.lineTo(12,-22);ctx.lineTo(30,-24);ctx.moveTo(12,-22);ctx.lineTo(30,-6);ctx.moveTo(12,-22);ctx.lineTo(22,2);ctx.moveTo(12,-22);ctx.lineTo(12,8);ctx.stroke();ctx.fillStyle='#e8d8c0';ctx.beginPath();ctx.moveTo(12,-22);ctx.lineTo(10,-28);ctx.lineTo(14,-23);ctx.fill();ctx.beginPath();ctx.moveTo(30,-24);ctx.lineTo(34,-27);ctx.lineTo(31,-21);ctx.fill()}
  else if(type==='fairy'){for(const [ry,rx,h,a,c1,c2] of [[-10,16,13,-.35,'rgba(170,220,255,.75)','rgba(255,150,220,.55)'],[6,12,9,.4,'rgba(255,170,230,.7)','rgba(150,210,255,.5)']]){ctx.save();ctx.translate(2,ry*.4);ctx.rotate(a);const g=ctx.createRadialGradient(rx*.6,0,1,rx,0,rx);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.strokeStyle='rgba(60,60,120,.75)';ctx.lineWidth=.9;ctx.beginPath();ctx.ellipse(rx,0,rx,h,0,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.85)';for(const [dx,dy,r] of [[rx*.9,-h*.3,2.2],[rx*1.4,h*.1,1.6],[rx*.6,h*.35,1.4]]){ctx.beginPath();ctx.arc(dx,dy,r,0,7);ctx.fill()}ctx.restore()}
   ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(14,-4,0,14,-4,22);g.addColorStop(0,'rgba(200,230,255,'+(.25+.1*Math.sin(t*4))+')');g.addColorStop(1,'rgba(200,230,255,0)');ctx.fillStyle=g;ctx.fillRect(-8,-26,44,44);ctx.restore()}
  else if(type==='dragon'){const g=ctx.createLinearGradient(0,-24,0,8);g.addColorStop(0,'rgba(255,170,60,.95)');g.addColorStop(1,'rgba(160,30,10,.95)');ctx.fillStyle=g;ctx.strokeStyle='#2a0602';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(2,-2);ctx.lineTo(10,-20);ctx.lineTo(34,-20);ctx.lineTo(28,-10);ctx.lineTo(32,-2);ctx.lineTo(24,0);ctx.lineTo(26,8);ctx.lineTo(16,4);ctx.lineTo(14,10);ctx.lineTo(4,4);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.strokeStyle='#4a1006';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(2,-2);ctx.lineTo(10,-20);ctx.lineTo(34,-20);ctx.stroke();ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(10,-20);ctx.lineTo(28,-10);ctx.moveTo(10,-20);ctx.lineTo(24,0);ctx.moveTo(10,-20);ctx.lineTo(16,4);ctx.stroke();
   ctx.fillStyle='#ffd27a';for(const [px,py] of [[10,-20],[18,-20],[26,-20],[34,-20]]){ctx.beginPath();ctx.moveTo(px-1.6,py);ctx.lineTo(px,py-4.5);ctx.lineTo(px+1.6,py);ctx.fill()}}
  else if(type==='galaxy'){for(let i=0;i<5;i++){const a=-.6+i*.28,L=16+(i%3)*5;ctx.save();ctx.translate(3,-2+i*2);ctx.rotate(a);const g=ctx.createLinearGradient(0,0,L,0);g.addColorStop(0,'rgba(80,60,200,.9)');g.addColorStop(.6,'rgba(120,170,255,.85)');g.addColorStop(1,'rgba(230,240,255,.95)');ctx.fillStyle=g;ctx.strokeStyle='rgba(20,20,70,.85)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(L*.8,-3.2);ctx.lineTo(L,0);ctx.lineTo(L*.8,3.2);ctx.lineTo(0,2);ctx.closePath();ctx.fill();ctx.stroke();const tw=.5+.5*Math.sin(t*5+i*1.7);ctx.fillStyle='rgba(255,255,255,'+tw+')';ctx.beginPath();ctx.arc(L*.55,0,1.1,0,7);ctx.fill();ctx.restore()}
   ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(16,-2,0,16,-2,24);g.addColorStop(0,'rgba(150,180,255,.3)');g.addColorStop(1,'rgba(150,180,255,0)');ctx.fillStyle=g;ctx.fillRect(-8,-26,48,48);ctx.restore()}
  ctx.restore()};
 if(side)one(-f);else{one(-1);one(1)}
 ctx.restore()}
{const _h=hero;hero=function(){let F=null;try{F=FASH.body&&OUTFIT[FASH.body];if(!(F&&F.wing)||P.dead||window.__lbav65)F=null}catch(e){F=null}
  if(!F)return _h.apply(this,arguments);const t=performance.now()/1000,d=P.dir;
  if(d!=='u'){try{wing104(F.wing,d,t,false)}catch(e){}const r=_h.apply(this,arguments);return r}
  const r=_h.apply(this,arguments);try{wing104(F.wing,d,t,true)}catch(e){}return r};window.hero=hero}
// ---------- อาวุธคอสตูมชุดนครวารี ----------
const W104={
 w2_sword:{cls:'sword',n:'ดาบปีกวายุสวรรค์',glow:'150,220,255',gem:280,d:'ใบดาบกว้างสีฟ้าเงิน การ์ดปีกขนนก ลมหมุนรอบใบ'},
 w2_mage:{cls:'mage',n:'คทาจันทราไร้นิรันดร์',glow:'200,150,255',staff:1,gem:280,d:'หัวคทาจันทร์เสี้ยวคู่ ลูกแก้วสามลูกโคจร'},
 w2_archer:{cls:'archer',n:'ธนูปีกหงส์ทองคำ',glow:'255,220,120',bow:1,gem:280,d:'แขนธนูเป็นปีกหงส์ทอง สายธนูแสง'},
 w2_ninja:{cls:'ninja',n:'คุไนสายฟ้าเงา',glow:'170,140,255',gem:260,d:'คุไนใหญ่ดำม่วง โซ่สายฟ้าพันด้าม'},
 w2_sniper:{cls:'sniper',n:'ปืนใหญ่ดาวหาง',glow:'255,170,90',rifle:1,gem:300,d:'ลำกล้องยาวทองแดง แกนพลังดาวหางเรือง'},
 w2_paladin:{cls:'paladin',n:'ดาบกางเขนปีกสวรรค์',glow:'255,240,170',gem:300,d:'ดาบใหญ่ทรงกางเขน รัศมีหลังใบดาบ'},
 w2_cleric:{cls:'cleric',n:'คทาบัวสวรรค์',glow:'255,200,230',staff:1,gem:260,d:'หัวคทาดอกบัวบานแสงชมพู'},
 w2_necro:{cls:'necro',n:'ไม้เท้ากะโหลกมังกร',glow:'120,255,150',staff:1,gem:300,d:'กะโหลกมังกรดวงตาไฟวิญญาณเขียว'},
 w2_monk:{cls:'monk',n:'สนับมือมังกรฟ้า',glow:'120,200,255',fist:1,gem:260,d:'สนับมือเงินมีมังกรฟ้าพัน'},
 w2_dragoon:{cls:'dragoon',n:'ทวนสามง่ามนาคา',glow:'90,255,220',gem:300,d:'ตรีศูลนาคาพันด้าม หัวทวนเรืองเขียวน้ำทะเล'},
 w2_summoner:{cls:'summoner',n:'ไม้เท้าพฤกษาวิญญาณ',glow:'170,255,140',staff:1,gem:280,d:'กิ่งไม้วิญญาณมีใบไม้เรือง ภูตน้อยบินวน'}};
for(const k in W104){const s=W104[k];FWPN[k]={n:'🌟 '+s.n,p:30000,b:['#ffffff','#cccccc','#888888'],g:'#e8c14a',glow:s.glow,cls:s.cls,d:s.d+' (เฉพาะ'+((CLS[s.cls]||{}).n||'')+')'};GEMP69['w:'+k]=s.gem}
const CV104={};
function cv104(id){if(CV104[id])return CV104[id];const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');q.lineCap='round';q.lineJoin='round';
 const gr=(x0,y0,x1,y1,cs)=>{const g=q.createLinearGradient(x0,y0,x1,y1);cs.forEach((v,i)=>g.addColorStop(i/(cs.length-1),v));return g};
 const glow=(x,y,r,rgb,a)=>{q.save();q.globalCompositeOperation='lighter';const g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+(a||.8)+')');g.addColorStop(1,'rgba('+rgb+',0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2);q.restore()};
 const P_=(pts,f,s,w)=>{q.beginPath();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();if(f){q.fillStyle=f;q.fill()}if(s){q.strokeStyle=s;q.lineWidth=w||1.2;q.stroke()}};
 const feather=(x,y,a,L,col)=>{q.save();q.translate(x,y);q.rotate(a);q.fillStyle=col||'#ffffff';q.strokeStyle='rgba(80,90,130,.8)';q.lineWidth=.8;q.beginPath();q.ellipse(L/2,0,L/2,2.6,0,0,7);q.fill();q.stroke();q.restore()};
 const S=W104[id];
 if(id==='w2_sword'){P_([[24,46],[22,14],[32,2],[42,14],[40,46]],gr(22,0,42,0,['#7aa8d8','#ffffff','#5a88b8']),'#14203a',1.3);q.strokeStyle='rgba(150,220,255,.9)';q.lineWidth=1.2;q.beginPath();q.moveTo(32,42);q.lineTo(32,8);q.stroke();
  for(let i=0;i<4;i++){feather(30,47,Math.PI+.35+i*.22,12-i,'#f4f8ff');feather(34,47,-.35-i*.22,12-i,'#f4f8ff')}q.fillStyle='#e8c14a';q.beginPath();q.arc(32,48,3.4,0,7);q.fill();q.fillStyle='#2a3a5a';q.fillRect(30.5,50,3,10);glow(32,22,16,S.glow,.6)}
 else if(id==='w2_mage'){q.strokeStyle='#2a1a4a';q.lineWidth=3;q.beginPath();q.moveTo(32,62);q.lineTo(32,22);q.stroke();q.strokeStyle='#d8c0ff';q.lineWidth=1;q.stroke();
  for(const s of [-1,1]){q.fillStyle=gr(20,4,44,24,['#ffffff','#c8a0ff','#6a3aa8']);q.strokeStyle='#2a1a4a';q.lineWidth=1.1;q.beginPath();q.arc(32+s*3,14,11,s<0?Math.PI*.55:-Math.PI*.45,s<0?Math.PI*1.45:Math.PI*.45);q.arc(32+s*7,14,8,s<0?Math.PI*1.4:Math.PI*.4,s<0?Math.PI*.6:-Math.PI*.4,true);q.closePath();q.fill();q.stroke()}
  for(const [x,y,r] of [[32,13,3.6],[22,4,2.2],[42,4,2.2]]){q.fillStyle='#ffffff';q.beginPath();q.arc(x,y,r,0,7);q.fill();glow(x,y,r*3,S.glow,.8)}}
 else if(id==='w2_ninja'){P_([[29,46],[35,46],[38,22],[32,2],[26,22]],gr(26,0,38,0,['#2a1a3a','#8a6aff','#14081e']),'#06020c',1.2);q.strokeStyle='rgba(220,200,255,.9)';q.lineWidth=.9;q.beginPath();q.moveTo(32,42);q.lineTo(32,8);q.stroke();
  q.fillStyle='#14081e';q.fillRect(29,46,6,12);q.beginPath();q.arc(32,61,4,0,7);q.strokeStyle='#c8b0ff';q.lineWidth=1.6;q.stroke();q.strokeStyle='rgba(190,170,255,.95)';q.lineWidth=1.3;q.beginPath();q.moveTo(36,48);q.lineTo(42,44);q.lineTo(39,40);q.lineTo(46,35);q.stroke();glow(32,24,15,S.glow,.6)}
 else if(id==='w2_paladin'){P_([[28,52],[26,16],[32,4],[38,16],[36,52]],gr(26,0,38,0,['#e8d8a0','#ffffff','#c8a860']),'#3a2a08',1.3);P_([[16,40],[48,40],[48,45],[16,45]],gr(0,40,0,45,['#ffe08a','#a07a20']),'#3a2a08',1.1);
  q.strokeStyle='rgba(255,240,170,.85)';q.lineWidth=2;q.beginPath();q.arc(32,20,13,0,7);q.stroke();for(let i=0;i<4;i++){feather(16,42,Math.PI+.3+i*.2,9-i);feather(48,42,-.3-i*.2,9-i)}q.fillStyle='#5a3a10';q.fillRect(30.5,52,3,9);glow(32,20,18,S.glow,.6)}
 else if(id==='w2_cleric'){q.strokeStyle='#d8b060';q.lineWidth=3;q.beginPath();q.moveTo(32,62);q.lineTo(32,24);q.stroke();q.strokeStyle='#fff6d8';q.lineWidth=1;q.stroke();
  for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*.42;q.save();q.translate(32,22);q.rotate(a+Math.PI/2);q.fillStyle=gr(0,-16,0,0,['#ffffff','#ffb0d8','#e05a98']);q.strokeStyle='#8a2a5a';q.lineWidth=.9;q.beginPath();q.ellipse(0,-9,4.4,10,0,0,7);q.fill();q.stroke();q.restore()}
  q.fillStyle='#ffe08a';q.beginPath();q.arc(32,21,4,0,7);q.fill();glow(32,18,18,S.glow,.7)}
 else if(id==='w2_necro'){q.strokeStyle='#14100c';q.lineWidth=3.4;q.beginPath();q.moveTo(32,62);q.lineTo(32,22);q.stroke();
  P_([[18,20],[22,10],[32,6],[42,10],[46,20],[44,26],[38,24],[34,30],[30,30],[26,24],[20,26]],gr(18,6,46,30,['#f0ead8','#c8c0a8','#7a7260']),'#14100c',1.2);
  for(const s of [-1,1]){q.fillStyle='#d8d0b8';q.beginPath();q.moveTo(32+s*9,10);q.quadraticCurveTo(32+s*18,2,32+s*16,-2);q.quadraticCurveTo(32+s*14,4,32+s*6,8);q.fill();q.stroke()}
  q.fillStyle='#0a0a06';q.beginPath();q.ellipse(27,17,3.4,2.6,0,0,7);q.ellipse(37,17,3.4,2.6,0,0,7);q.fill();glow(27,17,7,S.glow,.95);glow(37,17,7,S.glow,.95);q.fillStyle='#e8e0c8';for(let i=0;i<4;i++){q.beginPath();q.moveTo(28+i*2.6,26);q.lineTo(29+i*2.6,31);q.lineTo(30+i*2.6,26);q.fill()}}
 else if(id==='w2_monk'){q.fillStyle=gr(20,0,44,0,['#8a9ab8','#f0f4ff','#7a8aa8']);q.strokeStyle='#1a2238';q.lineWidth=1.3;q.beginPath();q.roundRect?q.roundRect(20,34,24,15,4):q.rect(20,34,24,15);q.fill();q.stroke();
  for(let i=0;i<4;i++){q.fillStyle='#e8f0ff';q.beginPath();q.arc(23+i*6,33,3,0,7);q.fill();q.stroke()}q.strokeStyle='#3a8ad8';q.lineWidth=3;q.beginPath();q.moveTo(18,46);q.bezierCurveTo(10,30,30,24,26,14);q.bezierCurveTo(24,8,34,6,36,12);q.stroke();q.fillStyle='#3a8ad8';q.beginPath();q.moveTo(34,8);q.lineTo(42,10);q.lineTo(36,15);q.fill();q.fillStyle='#ffffff';q.fillRect(37,10,1.5,1.5);glow(30,24,18,S.glow,.6)}
 else if(id==='w2_dragoon'){q.strokeStyle='#0a3a3a';q.lineWidth=3;q.beginPath();q.moveTo(32,62);q.lineTo(32,20);q.stroke();q.strokeStyle='#3ad8c8';q.lineWidth=1.2;q.beginPath();for(let y=58;y>24;y-=6){q.moveTo(29,y);q.quadraticCurveTo(35,y-3,29,y-6)}q.stroke();
  q.strokeStyle='#c8fff4';q.lineWidth=2.6;q.beginPath();q.moveTo(32,22);q.lineTo(32,2);q.moveTo(22,22);q.quadraticCurveTo(21,12,22,6);q.moveTo(42,22);q.quadraticCurveTo(43,12,42,6);q.moveTo(21,22);q.lineTo(43,22);q.stroke();
  for(const x of [22,32,42])P_([[x-2.6,8],[x,-1],[x+2.6,8]],'#ffffff','#0a3a3a',.8);q.fillStyle='#ffd86a';q.beginPath();q.arc(32,24,3,0,7);q.fill();glow(32,12,16,S.glow,.6)}
 else if(id==='w2_summoner'){q.strokeStyle='#4a3018';q.lineWidth=3.6;q.beginPath();q.moveTo(32,62);q.bezierCurveTo(28,44,36,32,32,18);q.stroke();q.lineWidth=2;q.beginPath();q.moveTo(32,24);q.quadraticCurveTo(22,18,20,8);q.moveTo(32,20);q.quadraticCurveTo(42,14,44,4);q.stroke();
  for(const [x,y,a] of [[20,8,-.6],[44,4,.5],[27,14,-.2],[38,10,.3],[32,16,0]]){q.save();q.translate(x,y);q.rotate(a);q.fillStyle=gr(0,-6,0,6,['#d8ffb0','#5ac83a']);q.beginPath();q.ellipse(0,0,3.4,6,0,0,7);q.fill();q.restore()}
  for(const [x,y] of [[16,18],[48,14],[32,4]])glow(x,y,6,S.glow,.9)}
 else{q.fillStyle='#888';q.fillRect(30,10,4,48)}
 return CV104[id]=c}
window.cv104=cv104;
const w104=()=>{const k=FASH.wpn;return k&&W104[k]?W104[k]:null};
{const _fs=fashSword;fashSword=function(id){if(W104[id])return cv104(id);return _fs.apply(this,arguments)};window.fashSword=fashSword}
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){const S=w104();if(!S||S.cls!==P.cls||P.tool!=='sword'||S.bow||S.rifle){if(S&&S.cls!==P.cls){const sv=FASH.wpn;FASH.wpn=null;try{return _ts.apply(this,arguments)}finally{FASH.wpn=sv}}return _ts.apply(this,arguments)}
  if(S.staff){staffAt7(hx,hy,ang);return}const t=performance.now()/1000;ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r'&&!S.staff)ctx.scale(-1,1);
  if(S.fist)ctx.drawImage(cv104(FASH.wpn),-12,-12,24,24);else ctx.drawImage(cv104(FASH.wpn),-23,-36,46,46);
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,-24,0,0,-24,20);g.addColorStop(0,'rgba('+S.glow+','+(.18+.12*Math.sin(t*4))+')');g.addColorStop(1,'rgba('+S.glow+',0)');ctx.fillStyle=g;ctx.fillRect(-20,-44,40,40);ctx.restore();
  if(Math.random()<.14){const a=ang-Math.PI/2;try{rfxP(hx+Math.cos(a)*16,hy+Math.sin(a)*16,(Math.random()-.5)*12,-14,.6,S.glow,1.6,'spark')}catch(e){}}};window.toolSpr=toolSpr}
// ธนู/ปืนวาดเองทั้งกระบอก
function bow104(x,y,aim,pull,arrow,sc){const t=performance.now()/1000;ctx.save();ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc||1,sc||1);const p=Math.min(1,pull||0),sx=-8-p*9; /* v5.61 คันโค้งกลับด้าน: เดิมปลายคันโค้งไปทางเป้า (เหมือนยิงใส่ตัวเอง) → ปลายคันโค้งมาทางคนยิงแบบธนูทุกแบบในเกม · กำ (x=0) อยู่หน้าสุด */
 for(const s of [-1,1]){ctx.save();ctx.scale(1,s);ctx.fillStyle='#ffd86a';ctx.strokeStyle='#6a4a08';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(2,0);ctx.quadraticCurveTo(3,-12,-8,-19);ctx.quadraticCurveTo(-3,-10,-2,-1);ctx.closePath();ctx.fill();ctx.stroke();
  for(let i=0;i<4;i++){ctx.save();ctx.translate(1.5-i*1.4,-5-i*3.6);ctx.rotate(-.9+i*.12);ctx.fillStyle=i%2?'#ffffff':'#fff2c8';ctx.beginPath();ctx.ellipse(4,0,5,1.8,0,0,7);ctx.fill();ctx.restore()}ctx.restore()}
 ctx.strokeStyle='rgba(255,240,180,.95)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-8,-19);ctx.lineTo(sx,0);ctx.lineTo(-8,19);ctx.stroke();
 if(arrow){ctx.strokeStyle='#fff6d8';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(16,0);ctx.stroke();ctx.fillStyle='#ffd86a';ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(14,-2.6);ctx.lineTo(14,2.6);ctx.fill()}
 ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(4,0,0,4,0,20);g.addColorStop(0,'rgba(255,220,120,'+(.25+.1*Math.sin(t*5))+')');g.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=g;ctx.fillRect(-16,-20,40,40);ctx.restore()}
function rifle104(x,y,aim,sc){const t=performance.now()/1000;ctx.save();ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc||1,sc||1);
 ctx.fillStyle='#5a3418';ctx.strokeStyle='#1a0e06';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-14,-2);ctx.lineTo(-2,-3);ctx.lineTo(-2,4);ctx.lineTo(-12,6);ctx.closePath();ctx.fill();ctx.stroke();
 const g=ctx.createLinearGradient(0,-4,0,4);g.addColorStop(0,'#ffd8a0');g.addColorStop(.5,'#c87a3a');g.addColorStop(1,'#6a3a14');ctx.fillStyle=g;ctx.fillRect(-2,-3.4,26,6.8);ctx.strokeRect(-2,-3.4,26,6.8);
 ctx.fillStyle='#8a5a2a';ctx.fillRect(24,-2.4,10,4.8);ctx.strokeRect(24,-2.4,10,4.8);ctx.fillStyle='#3a2410';for(const xx of [6,14,22])ctx.fillRect(xx,-3.4,1.6,6.8);
 ctx.fillStyle='#2a1a0a';ctx.fillRect(4,-7,8,3.6);ctx.globalCompositeOperation='lighter';const c=ctx.createRadialGradient(10,0,0,10,0,9);c.addColorStop(0,'rgba(255,240,200,.95)');c.addColorStop(1,'rgba(255,140,60,0)');ctx.fillStyle=c;ctx.beginPath();ctx.arc(10,0,6+Math.sin(t*8),0,7);ctx.fill();
 const tail=ctx.createLinearGradient(10,0,-12,0);tail.addColorStop(0,'rgba(255,170,90,.6)');tail.addColorStop(1,'rgba(255,170,90,0)');ctx.fillStyle=tail;ctx.beginPath();ctx.moveTo(10,-2);ctx.lineTo(-12,-5+Math.sin(t*6)*2);ctx.lineTo(-12,5);ctx.lineTo(10,2);ctx.fill();ctx.restore()}
{const _db=drawBow6;drawBow6=function(x,y,aim,tier,pull,arrow,sc){const S=w104();if(!S||S.cls!==P.cls||!(S.bow||S.rifle))return _db.apply(this,arguments);
  try{if(S.bow)bow104(x,y,aim,pull,arrow,sc);else rifle104(x,y,aim,sc)}catch(e){return _db.apply(this,arguments)}
  if(Math.random()<.12){try{rfxP(x+(Math.random()-.5)*16,y+(Math.random()-.5)*20,0,-12,.6,S.glow,1.5,'spark')}catch(e){}}};window.drawBow6=drawBow6}
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(window.BACKSW7>0&&type==='sword'){const S=w104();if(S&&S.cls===P.cls&&!S.bow&&!S.rifle&&!S.fist)return cv104(FASH.wpn)}return _ti.apply(this,arguments)};window.toolIcon=toolIcon}
{const _fp=fashPreview;fashPreview=function(kind,id){if(kind!=='body'&&W104[id]){const S=W104[id],c=document.createElement('canvas');c.width=150;c.height=96;const k=c.getContext('2d');const g=k.createRadialGradient(75,50,4,75,50,80);g.addColorStop(0,'rgba('+S.glow+',.55)');g.addColorStop(1,'#1a1428');k.fillStyle=g;k.fillRect(0,0,150,96);
   const sv=ctx;ctx=k;try{if(S.bow)bow104(75,48,0,.3,true,2.1);else if(S.rifle)rifle104(62,48,0,2.4);else{k.save();k.translate(75,48);k.rotate(.7);k.drawImage(cv104(id),-40,-40,80,80);k.restore()}}catch(e){}finally{ctx=sv}return c}return _fp.apply(this,arguments)};window.fashPreview=fashPreview}
}catch(e){console.warn('fix104',e)}
