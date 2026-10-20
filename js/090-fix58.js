// fix58 (v4.58) — แฟชั่นใหม่ประจำอาชีพ 11 ชุด (หมวก/ผ้าคลุม/ประกายใหม่) + อาวุธแฟชั่นประจำอาชีพ 11 ชิ้น (บูติกมาดามโรส)
//   อาวุธแฟชั่นของอาชีพไหน ใช้ได้กับอาชีพนั้น (ใส่ผิดอาชีพ = แสดงอาวุธจริงตามปกติ) · ผู้เล่นอื่นเห็นด้วย (ใช้ระบบ FASH เดิม)
try{
// ---------- ชุด ----------
const OUT58={
 c_sword:{n:'⚔️ ชุดแม่ทัพเหล็กไหล',p:14000,TOP:'#3a4a6a',COLLAR:'#d8dce8',BLK:'#20283a',LEG2:'#141a28',cape:['#a81a1a','#4a0606','#d8dce8'],hat:'warhelm',fx58:'ember',cls:'sword',d:'หมวกศึกขนนกแดง ผ้าคลุมแม่ทัพ ถ่านไฟลอยรอบตัว'},
 c_mage:{n:'🔮 ชุดอัครมหาเวทอาร์คานา',p:16000,TOP:'#3a1a6a',COLLAR:'#c8a0ff',BLK:'#1a0e30',LEG2:'#0e0820',cape:['#5a2a9a','#1a0a3a','#ffd23a'],hat:'arcane',fx58:'rune',cls:'mage',d:'หมวกแหลมมีอักขระเวทหมุนรอบ ผ้าคลุมม่วงทอง'},
 c_archer:{n:'🏹 ชุดพรานพงไพรมรกต',p:14000,TOP:'#2a6a3a',COLLAR:'#d8c070',BLK:'#2a2a14',LEG2:'#1a1a0a',cape:['#3a8a4a','#14401e','#d8c070'],hat:'ranger',fx58:'leaf',cls:'archer',d:'หมวกพรานขนนกยาว ผ้าคลุมใบไม้ ใบไม้ปลิวตามตัว'},
 c_ninja:{n:'🥷 ชุดนินจาเงาจันทร์',p:15000,TOP:'#14141e',COLLAR:'#c8283a',BLK:'#0a0a12',LEG2:'#1a1a26',hat:'ninjahood',fx58:'shadow',cls:'ninja',d:'ผ้าคลุมหัวพร้อมผ้าปิดหน้า ผ้าคาดหัวแดงปลิว ควันเงา'},
 c_sniper:{n:'🎯 ชุดหน่วยซุ่มยิงพายุ',p:14000,TOP:'#4a5a3a',COLLAR:'#2a2a1a',BLK:'#3a3a2a',LEG2:'#22220f',cape:['#5a6a40','#2a3018','#c8b060'],hat:'beret',fx58:'spark',cls:'sniper',d:'หมวกเบเร่ต์+แว่นกล้อง ผ้าคลุมลายพราง'},
 c_paladin:{n:'🛡️ ชุดอัศวินสุริยะศักดิ์สิทธิ์',p:18000,TOP:'#e8e0c8',COLLAR:'#ffd23a',BLK:'#8a7a50',LEG2:'#5a4a2a',cape:['#ffffff','#c8b880','#ffd23a'],hat:'wingedhelm',fx58:'holy',cls:'paladin',d:'หมวกปีกทองคำ ผ้าคลุมขาวขลิบทอง แสงศักดิ์สิทธิ์'},
 c_cleric:{n:'👼 ชุดนักบวชเทวาลัย',p:16000,TOP:'#f4f0ff',COLLAR:'#7ad8ff',BLK:'#c8c8e0',LEG2:'#9a9ab8',cape:['#cfe8ff','#7a9ac8','#ffffff'],hat:'halo',fx58:'feather',cls:'cleric',d:'ผ้าคลุมหัวสีขาวกับวงแหวนรัศมี ขนนกสีขาวโปรยปราย'},
 c_necro:{n:'💀 ชุดจอมเวทวิญญาณมรณะ',p:16000,TOP:'#1a1a14',COLLAR:'#7affb0',BLK:'#10100a',LEG2:'#22221a',cape:['#1e3a24','#0a140c','#7affb0'],hat:'skullhood',fx58:'soul',cls:'necro',d:'ฮู้ดหัวกะโหลก ผ้าคลุมเขียวมรณะ วิญญาณสีเขียวลอยวน'},
 c_monk:{n:'👊 ชุดปรมาจารย์วัดเขา',p:14000,TOP:'#e8902a',COLLAR:'#8a1a1a',BLK:'#4a2a10',LEG2:'#2a1806',cape:['#c86a1a','#6a2a06','#ffd23a'],hat:'headband',fx58:'ki',cls:'monk',d:'ผ้าคาดหัวแดงปลิว จีวรส้ม พลังลมปราณสีทอง'},
 c_dragoon:{n:'🐉 ชุดอัศวินมังกรนิล',p:18000,TOP:'#2a3a5a',COLLAR:'#7ad8ff',BLK:'#1a2238',LEG2:'#0e1424',cape:['#1a2a6a','#0a1030','#7ad8ff'],hat:'dragonhelm',fx58:'frost',cls:'dragoon',d:'หมวกมังกรเขาโค้ง ผ้าคลุมเกล็ดน้ำเงิน ไอเย็นเรืองแสง'},
 c_summoner:{n:'🐺 ชุดผู้นำวิญญาณพงไพร',p:15000,TOP:'#5a3a1e',COLLAR:'#e8dcc0',BLK:'#3a2a14',LEG2:'#22180a',cape:['#7a5a32','#3a2a14','#e8dcc0'],hat:'antler',fx58:'spirit',cls:'summoner',d:'ฮู้ดขนสัตว์กับเขากวาง หิ่งห้อยวิญญาณลอยรอบ'}};
for(const k in OUT58){const o=OUT58[k];o.d=o.d+' (แฟชั่นประจำ'+((CLS[o.cls]||{}).n||'')+')';OUTFIT[k]=o}
const R58=(c,a,b,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),w,h)};
const NEWHAT58=new Set(['warhelm','arcane','ranger','ninjahood','beret','wingedhelm','halo','skullhood','headband','dragonhelm','antler']);
function hat58(F,x,by,side,f,d){const t=performance.now()/1000,h=F.hat,back=d==='u',sx=side?-f:1;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 if(h==='warhelm'){hatCap11(x,by,'#a8b0c0','#3a4050');R58('#6a7488',x-8,by-41,16,3);R58('#d8dce8',x-1,by-53,2,9);ctx.strokeStyle='#c8283a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,by-53);ctx.quadraticCurveTo(x-sx*10,by-62,x-sx*16,by-50);ctx.stroke();ctx.strokeStyle='#ff6a5a';ctx.lineWidth=1.2;ctx.stroke()}
 else if(h==='arcane'){hatCap11(x,by,'#3a1a6a','#1a0a3a');ctx.fillStyle='#3a1a6a';ctx.strokeStyle='#1a0a3a';ctx.beginPath();ctx.moveTo(x-9,by-46);ctx.lineTo(x+9,by-46);ctx.lineTo(x+(side?-f*10:3),by-73);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(x,by-45,15,3.5,0,0,7);ctx.fill();ctx.stroke();R58('#ffd23a',x-9,by-49,18,2.5);
  ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const a=t*2+i*2.094,px=x+Math.cos(a)*15,py=by-60+Math.sin(a)*4;ctx.fillStyle='rgba(200,160,255,'+(.6+.3*Math.sin(a))+')';ctx.font='bold 7px serif';ctx.fillText('ᚱᛟᛞ'[i],px-2,py)}}
 else if(h==='ranger'){hatCap11(x,by,'#2a6a3a','#123018');ctx.fillStyle='#2a6a3a';ctx.strokeStyle='#123018';ctx.beginPath();ctx.moveTo(x-13,by-44);ctx.quadraticCurveTo(x,by-58,x+13,by-44);ctx.quadraticCurveTo(x,by-47,x-13,by-44);ctx.fill();ctx.stroke();R58('#d8c070',x-9,by-47,18,2);
  ctx.strokeStyle='#c8283a';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x+sx*6,by-48);ctx.quadraticCurveTo(x+sx*16,by-62,x+sx*22,by-66);ctx.stroke();ctx.strokeStyle='#ffd0a0';ctx.lineWidth=.8;ctx.stroke()}
 else if(h==='ninjahood'){hatCap11(x,by,'#14141e','#000');R58('#c8283a',x-8,by-46,16,2.5);if(!back){R58('#14141e',x-7,by-35,14,5)}const w=Math.sin(t*8)*2;ctx.strokeStyle='#c8283a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-sx*7,by-45);ctx.quadraticCurveTo(x-sx*15,by-44+w,x-sx*22,by-40-w);ctx.moveTo(x-sx*7,by-44);ctx.quadraticCurveTo(x-sx*14,by-40-w,x-sx*19,by-35+w);ctx.stroke()}
 else if(h==='beret'){hatCap11(x,by,'#3a4a2a','#1a200f');ctx.fillStyle='#4a5a32';ctx.strokeStyle='#1a200f';ctx.beginPath();ctx.ellipse(x+sx*2,by-49,11,4.5,sx*-.15,0,7);ctx.fill();ctx.stroke();R58('#c8b060',x+sx*6-1,by-51,2,2);if(!back){R58('#2a2a2a',x-8,by-44,16,3);ctx.fillStyle='#7ad8ff';for(const s of [-1,1])if(!side||s===-f){ctx.beginPath();ctx.arc(x+(side?-f*4:s*4),by-42.5,2.2,0,7);ctx.fill()}}}
 else if(h==='wingedhelm'){hatCap11(x,by,'#e8c860','#7a5a10');R58('#fff6c0',x-8,by-45,16,2);R58('#7ad8ff',x-1,by-47,2,2);for(const s of side?[-f]:[-1,1]){ctx.fillStyle='#ffffff';ctx.strokeStyle='rgba(120,130,160,.8)';ctx.lineWidth=.8;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x+s*(10+i*2.5),by-48-i*3,5-i,1.8,s*(-.6-i*.25),0,7);ctx.fill();ctx.stroke()}}}
 else if(h==='halo'){hatCap11(x,by,'#f4f0ff','#a8a8c8');R58('#7ad8ff',x-8,by-45,16,1.5);ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,236,150,'+(.8+.2*Math.sin(t*3))+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,by-58+Math.sin(t*2)*1,9,2.6,0,0,7);ctx.stroke()}
 else if(h==='skullhood'){hatCap11(x,by,'#1e3a24','#0a140c');ctx.fillStyle='#1e3a24';ctx.beginPath();ctx.moveTo(x-9,by-37);ctx.lineTo(x,by-58);ctx.lineTo(x+9,by-37);ctx.fill();if(!back){ctx.fillStyle='#e8e0d0';ctx.beginPath();ctx.arc(x,by-50,3.6,0,7);ctx.fill();R58('#14102a',x-2,by-51,1.5,1.5);R58('#14102a',x+.6,by-51,1.5,1.5);ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(120,255,170,.5)';ctx.beginPath();ctx.arc(x,by-50,6,0,7);ctx.fill()}}
 else if(h==='headband'){hatCap11(x,by,'#1a1410','#000');R58('#c8283a',x-8,by-45,16,3);const w=Math.sin(t*9)*2;ctx.strokeStyle='#c8283a';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x-sx*7,by-44);ctx.quadraticCurveTo(x-sx*14,by-43+w,x-sx*20,by-38-w);ctx.stroke()}
 else if(h==='dragonhelm'){hatCap11(x,by,'#2a3a5a','#0e1424');R58('#7ad8ff',x-8,by-45,16,2);for(const s of side?[-f]:[-1,1]){ctx.strokeStyle='#e8e0d0';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+s*6,by-49);ctx.quadraticCurveTo(x+s*14,by-56,x+s*10,by-64);ctx.stroke();ctx.strokeStyle='#8a8070';ctx.lineWidth=.8;ctx.stroke()}ctx.fillStyle='#7ad8ff';ctx.beginPath();ctx.moveTo(x-1.5,by-53);ctx.lineTo(x,by-58);ctx.lineTo(x+1.5,by-53);ctx.fill()}
 else if(h==='antler'){hatCap11(x,by,'#7a5a32','#3a2a14');R58('#e8dcc0',x-8,by-40,16,2);for(const s of side?[-f,f]:[-1,1]){ctx.strokeStyle='#d8c8a0';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x+s*5,by-50);ctx.lineTo(x+s*11,by-60);ctx.lineTo(x+s*10,by-66);ctx.moveTo(x+s*8.5,by-56);ctx.lineTo(x+s*14,by-58);ctx.moveTo(x+s*10.5,by-61);ctx.lineTo(x+s*6,by-65);ctx.stroke()}}
 ctx.restore()}
{const _dh=drawHat11;drawHat11=function(F,x,by,side,f,d){if(F&&NEWHAT58.has(F.hat)){try{hat58(F,x,by,side,f,d)}catch(e){}return}return _dh.apply(this,arguments)};window.drawHat11=drawHat11}
// ประกายรอบตัวของชุดใหม่
const FX58={ember:['255,140,40','spark',-28],rune:['190,150,255','spark',-14],leaf:['120,210,90','dot',14],shadow:['40,30,60','dot',-10],spark:['255,220,120','spark',-18],holy:['255,240,170','spark',-26],feather:['255,255,255','dot',10],soul:['120,255,170','spark',-20],ki:['255,200,90','spark',-30],frost:['170,230,255','dot',-12],spirit:['200,255,150','spark',-8]};
{const _h=hero;hero=function(){_h();try{const F=FASH.body&&OUTFIT[FASH.body];if(!F||!F.fx58||P.dead)return;const q=FX58[F.fx58];if(q&&Math.random()<.2)rfxP(P.x+(Math.random()-.5)*26,P.y-8-Math.random()*36,(Math.random()-.5)*14,q[2],1,q[0],q[1]==='dot'?2.2:1.6,q[1])}catch(e){}};window.hero=hero}
// ---------- อาวุธแฟชั่นประจำอาชีพ ----------
const SK58={
 w_sword:{cls:'sword',n:'ดาบราชันย์เหล็กไหล',p:16000,glow:'255,90,60',d:'ดาบใหญ่ใบเงินอักขระแดงเรือง'},
 w_mage:{cls:'mage',n:'คทาดวงดาราอาร์คานา',p:16000,glow:'190,150,255',d:'คทาคริสตัลดาวลอย หมุนรอบหัวคทา'},
 w_archer:{cls:'archer',n:'ธนูพฤกษาวิญญาณ',p:16000,glow:'120,240,150',bow:1,d:'คันธนูเถาวัลย์เรืองเขียว สายแสง'},
 w_ninja:{cls:'ninja',n:'คาตานะจันทร์สีเลือด',p:16000,glow:'255,60,90',d:'ใบดาบดำคมแดง ด้ามพันแดง'},
 w_sniper:{cls:'sniper',n:'ไรเฟิลพายุอสนี',p:16000,glow:'150,210,255',rifle:1,d:'ปืนไรเฟิลสีน้ำเงินมีสายฟ้าแลบ'},
 w_paladin:{cls:'paladin',n:'ดาบสุริยะเทวา',p:18000,glow:'255,230,140',d:'ดาบทองตราสุริยะ แสงเรืองรอง'},
 w_cleric:{cls:'cleric',n:'คทาแสงอรุณ',p:16000,glow:'255,250,200',staff:1,d:'คทาจันทร์เสี้ยวกับลูกแก้วลอย'},
 w_necro:{cls:'necro',n:'เคียวยมทูตวิญญาณ',p:18000,glow:'120,255,170',staff:1,d:'เคียวใหญ่ไฟวิญญาณสีเขียว'},
 w_monk:{cls:'monk',n:'สนับมือพยัคฆ์ทองคำ',p:15000,glow:'255,190,80',fist:1,d:'สนับมือทองกรงเล็บเสือ ลมปราณเรือง'},
 w_dragoon:{cls:'dragoon',n:'ทวนมังกรวายุ',p:18000,glow:'140,210,255',d:'ทวนยาวหัวมังกร ใบทวนเรืองฟ้า'},
 w_summoner:{cls:'summoner',n:'ไม้เท้าพญาหงส์',p:16000,glow:'255,160,80',staff:1,d:'ไม้เท้าขนหงส์เพลิง วิญญาณนกบินวน'}};
for(const k in SK58){const s=SK58[k];FWPN[k]={n:'⭐ '+s.n,p:s.p,b:['#ffffff','#cccccc','#888888'],g:'#e8c14a',glow:s.glow,cls:s.cls,d:s.d+' (เฉพาะ'+((CLS[s.cls]||{}).n||'')+')'}}
const SKC58={};
function skCanvas58(id){if(SKC58[id])return SKC58[id];const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');q.lineCap='round';q.lineJoin='round';
 const grad=(x0,y0,x1,y1,cs)=>{const g=q.createLinearGradient(x0,y0,x1,y1);cs.forEach((v,i)=>g.addColorStop(i/(cs.length-1),v));return g};
 const glow=(x,y,r,rgb,a)=>{q.save();q.globalCompositeOperation='lighter';const g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+(a||.8)+')');g.addColorStop(1,'rgba('+rgb+',0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2);q.restore()};
 const blade=(pts,cs,st)=>{q.fillStyle=grad(26,0,38,0,cs);q.strokeStyle=st||'#14141a';q.lineWidth=1.3;q.beginPath();q.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))q.lineTo(p[0],p[1]);q.closePath();q.fill();q.stroke()};
 const S=SK58[id];
 if(id==='w_sword'){blade([[27,47],[26,12],[32,3],[38,12],[37,47]],['#8a96aa','#ffffff','#6a7488']);q.strokeStyle='rgba(255,70,50,.95)';q.lineWidth=1.2;q.beginPath();for(let y=40;y>14;y-=7){q.moveTo(31,y);q.lineTo(33,y-3);q.lineTo(31,y-5)}q.stroke();glow(32,26,14,S.glow,.35);
  q.fillStyle='#c8283a';q.strokeStyle='#14141a';q.beginPath();q.moveTo(18,46);q.quadraticCurveTo(32,52,46,46);q.lineTo(46,50);q.lineTo(18,50);q.closePath();q.fill();q.stroke();q.fillStyle='#3a2414';q.fillRect(30.5,50,3,9);q.fillStyle='#ffd23a';q.beginPath();q.arc(32,60,2.4,0,7);q.fill()}
 else if(id==='w_ninja'){q.fillStyle='#14141a';q.strokeStyle='#000';q.lineWidth=1.2;q.beginPath();q.moveTo(29,47);q.quadraticCurveTo(27,24,34,4);q.quadraticCurveTo(35,26,34,47);q.closePath();q.fill();q.stroke();q.strokeStyle='#ff3a5a';q.lineWidth=1.2;q.beginPath();q.moveTo(33.6,46);q.quadraticCurveTo(34.6,26,34,6);q.stroke();glow(33,24,12,S.glow,.35);
  q.fillStyle='#ffd23a';q.beginPath();q.ellipse(32,48,6,2.4,0,0,7);q.fill();q.stroke();q.fillStyle='#14141a';q.fillRect(30.5,50,3,10);q.fillStyle='#c8283a';for(let y=51;y<60;y+=2.5)q.fillRect(30.5,y,3,1.2)}
 else if(id==='w_paladin'){blade([[26,47],[25,14],[32,4],[39,14],[38,47]],['#c8a040','#fff6d8','#a07a20'],'#3a2a08');q.fillStyle='#ffe08a';q.beginPath();q.arc(32,30,5,0,7);q.fill();q.strokeStyle='#a07a20';q.stroke();for(let i=0;i<8;i++){const a=i*.785;q.beginPath();q.moveTo(32+Math.cos(a)*6,30+Math.sin(a)*6);q.lineTo(32+Math.cos(a)*9,30+Math.sin(a)*9);q.stroke()}glow(32,28,16,S.glow,.45);
  q.fillStyle='#ffe08a';q.strokeStyle='#3a2a08';q.fillRect(17,46,30,4);q.strokeRect(17,46,30,4);q.fillStyle='#ffffff';for(const s of [-1,1]){q.beginPath();q.ellipse(32+s*17,47,5,2,s*.4,0,7);q.fill()}q.fillStyle='#5a3a10';q.fillRect(30.5,50,3,9);q.fillStyle='#7ad8ff';q.beginPath();q.arc(32,60,2.4,0,7);q.fill()}
 else if(id==='w_dragoon'){q.strokeStyle='#1a2238';q.lineWidth=3;q.beginPath();q.moveTo(32,62);q.lineTo(32,16);q.stroke();q.strokeStyle='#7ad8ff';q.lineWidth=1.2;q.stroke();blade([[32,0],[37,12],[34,17],[30,17],[27,12]],['#bfe8ff','#ffffff','#5a86aa'],'#1a2238');
  q.fillStyle='#2a3a5a';q.strokeStyle='#0e1424';q.beginPath();q.moveTo(26,18);q.lineTo(38,18);q.lineTo(36,23);q.lineTo(28,23);q.closePath();q.fill();q.stroke();q.fillStyle='#e8e0d0';for(const s of [-1,1]){q.beginPath();q.moveTo(32+s*5,18);q.lineTo(32+s*11,12);q.lineTo(32+s*7,20);q.fill()}glow(32,10,13,S.glow,.5)}
 else if(id==='w_monk'){q.fillStyle=grad(22,0,42,0,['#a07a20','#ffe08a','#c8901a']);q.strokeStyle='#3a2408';q.lineWidth=1.3;q.beginPath();q.roundRect?q.roundRect(22,36,20,14,4):q.rect(22,36,20,14);q.fill();q.stroke();for(let i=0;i<4;i++){q.fillStyle='#fff6d0';q.beginPath();q.moveTo(23.5+i*5,36);q.lineTo(25.5+i*5,28);q.lineTo(27.5+i*5,36);q.closePath();q.fill();q.stroke()}glow(32,40,16,S.glow,.6)}
 else if(id==='w_cleric'){q.strokeStyle='#c8a040';q.lineWidth=3;q.beginPath();q.moveTo(32,62);q.lineTo(32,20);q.stroke();q.strokeStyle='#fff6d8';q.lineWidth=1;q.stroke();q.strokeStyle='#ffe08a';q.lineWidth=2.6;q.beginPath();q.arc(32,14,9,.5,Math.PI*2-.5,false);q.stroke();q.fillStyle='#ffffff';q.beginPath();q.arc(32,12,4,0,7);q.fill();glow(32,12,16,S.glow,.7)}
 else if(id==='w_necro'){q.strokeStyle='#1a1414';q.lineWidth=3.2;q.beginPath();q.moveTo(32,62);q.lineTo(32,8);q.stroke();q.fillStyle=grad(6,0,32,0,['#5a6a60','#e8f0e8','#8a9a90']);q.strokeStyle='#0a140c';q.lineWidth=1.2;q.beginPath();q.moveTo(32,8);q.quadraticCurveTo(10,2,4,22);q.quadraticCurveTo(14,10,31,14);q.closePath();q.fill();q.stroke();
  q.fillStyle='#e8e0d0';q.beginPath();q.arc(32,8,4,0,7);q.fill();q.fillStyle='#14102a';q.fillRect(30,7,1.5,1.5);q.fillRect(33,7,1.5,1.5);glow(18,12,16,S.glow,.6);glow(32,8,8,S.glow,.6)}
 else if(id==='w_summoner'){q.strokeStyle='#5a3a1e';q.lineWidth=3.4;q.beginPath();q.moveTo(32,62);q.quadraticCurveTo(34,36,32,16);q.stroke();for(const s of [-1,1])for(let i=0;i<3;i++){q.fillStyle=['#ff6a1a','#ffb030','#ffe08a'][i];q.beginPath();q.ellipse(32+s*(6+i*3),14-i*4,2.4,8,s*(.5+i*.25),0,7);q.fill()}q.fillStyle='#ffd23a';q.beginPath();q.arc(32,16,3.6,0,7);q.fill();glow(32,12,16,S.glow,.6)}
 else if(id==='w_mage'){q.strokeStyle='#2a1a4a';q.lineWidth=3;q.beginPath();q.moveTo(32,62);q.lineTo(32,18);q.stroke();q.strokeStyle='#c8a0ff';q.lineWidth=1;q.stroke();q.fillStyle='#ffd23a';q.strokeStyle='#5a3a10';q.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?4:9;q.lineTo(32+Math.cos(a)*r,11+Math.sin(a)*r)}q.closePath();q.fill();q.stroke();glow(32,11,17,S.glow,.7)}
 else{q.fillStyle='#888';q.fillRect(30,10,4,48)}
 return SKC58[id]=c}
const sk58=()=>{const k=FASH.wpn;return k&&SK58[k]?SK58[k]:null};
{const _fs=fashSword;fashSword=function(id){if(SK58[id])return skCanvas58(id);return _fs(id)};window.fashSword=fashSword}
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){const S=sk58();if(!S)return _ts(hx,hy,ang);
 if(S.cls!==P.cls||P.tool!=='sword'||S.bow||S.rifle){const sv=FASH.wpn;if(S.cls!==P.cls)FASH.wpn=null;try{return _ts(hx,hy,ang)}finally{FASH.wpn=sv}}
 if(S.staff||FASH.wpn==='w_mage'){staffAt7(hx,hy,ang);return}const t=performance.now()/1000;ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(P.dir==='r'&&!S.staff)ctx.scale(-1,1);
 if(S.fist){ctx.drawImage(skCanvas58(FASH.wpn),-12,-12,24,24)}else ctx.drawImage(skCanvas58(FASH.wpn),-23,-36,46,46);
 ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,-24,0,0,-24,20);g.addColorStop(0,'rgba('+S.glow+','+(.18+.12*Math.sin(t*4))+')');g.addColorStop(1,'rgba('+S.glow+',0)');ctx.fillStyle=g;ctx.fillRect(-20,-44,40,40);ctx.restore();
 if(Math.random()<.14){const a=ang-Math.PI/2;rfxP(hx+Math.cos(a)*16,hy+Math.sin(a)*16,(Math.random()-.5)*12,-14,.6,S.glow,1.6,'spark')}};window.toolSpr=toolSpr}
// ธนู/ไรเฟิลแฟชั่น
const BOWSK58=['#2a1a08','#3aa85a','#ffe08a'];let RIFSK58=null;try{RIFSK58=Object.assign({},TIERS[5]||TIERS[0],{k:'storm',hi:'#e8f4ff',mid:'#3a6ab8',lo:'#1a2a5a',dk:'#0a1028',gl:'#9ad8ff',gd:'#ffe08a'})}catch(e){}
{const _db=drawBow6;drawBow6=function(x,y,aim,tier,pull,arrow,sc){const S=sk58();if(!S||S.cls!==P.cls||!(S.bow||S.rifle))return _db.apply(this,arguments);
 {const sb=BOWT[0],st=TIERS[0];if(S.bow)BOWT[0]=BOWSK58;else if(RIFSK58)TIERS[0]=RIFSK58;try{_db.call(this,x,y,aim,0,pull,arrow,sc)}finally{BOWT[0]=sb;TIERS[0]=st}}const t=performance.now()/1000;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,22);g.addColorStop(0,'rgba('+S.glow+','+(.22+.1*Math.sin(t*5))+')');g.addColorStop(1,'rgba('+S.glow+',0)');ctx.fillStyle=g;ctx.fillRect(x-22,y-22,44,44);ctx.restore();
 if(Math.random()<.12)rfxP(x+(Math.random()-.5)*16,y+(Math.random()-.5)*20,0,-12,.6,S.glow,1.5,S.rifle&&Math.random()<.5?'spark':'dot')};window.drawBow6=drawBow6}
// ไอคอนดาบหลัง (ตอนเก็บอาวุธ)
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(window.BACKSW7>0&&type==='sword'){const S=sk58();if(S&&S.cls===P.cls&&!S.bow&&!S.rifle&&!S.fist)return skCanvas58(FASH.wpn)}return _ti.apply(this,arguments)};window.toolIcon=toolIcon}
// ภาพตัวอย่างในบูติก: อาวุธแฟชั่นประจำอาชีพ = รูปอาวุธใหญ่บนพื้นเรืองแสง
{const _fp=fashPreview;fashPreview=function(kind,id){if(kind!=='body'&&SK58[id]){const S=SK58[id],c=document.createElement('canvas');c.width=150;c.height=96;const k=c.getContext('2d');const g=k.createRadialGradient(75,50,4,75,50,80);g.addColorStop(0,'rgba('+S.glow+',.55)');g.addColorStop(1,'#1a1428');k.fillStyle=g;k.fillRect(0,0,150,96);
  if(S.bow||S.rifle){const sv=ctx,svw=FASH.wpn,svc=P.cls,svo=window.cwOk25;ctx=k;FASH.wpn=id;P.cls=S.cls;window.cwOk25=()=>true;try{drawBow6(75,48,0,0,0,false,1.8)}catch(e){}finally{ctx=sv;FASH.wpn=svw;P.cls=svc;window.cwOk25=svo}}else{k.save();k.translate(75,48);k.rotate(.7);k.drawImage(skCanvas58(id),-40,-40,80,80);k.restore()}return c}return _fp.apply(this,arguments)};window.fashPreview=fashPreview}
// ชุดประจำอาชีพ: กรองในบูติกให้เห็นของอาชีพตัวเองก่อน (ของอาชีพอื่นยังซื้อ/ดูได้)
}catch(e){console.warn('fix58',e)}
