// fix75 (v4.67) — รอบ 4ข (HANDOFF ข้อ 23, 24): 🐉 สัตว์ขี่ใหม่ 5 ตัว มีออร่า 3 มิติ (วงแหวนเอียงโคจร+ลูกแสง หน้า/หลังตัว) · 🐾 สัตว์เลี้ยงใหม่ 5 ชนิด
//  สัตว์ขี่: dgold มังกรทองจักรพรรดิ (บิน) · dfrost มังกรน้ำแข็งนิรันดร์ (บิน) · tiger พยัคฆ์ขาวสายฟ้า · kirin กิเลนอัคคีมงคล · phoenix อาชาฟีนิกซ์ (บิน)
//   มังกร = วาดตัวมังกรใหม่ (ด้านข้าง) · มุมหน้า/หลังยืมท่าเดิม (drake/wolf/horse/pegasus) แต่ใช้สีของตัวเอง · ซื้อที่ร้านสัตว์เดิม (ANIMS) มีเลเวลขั้นต่ำ
//  สัตว์เลี้ยง: fox จิ้งจอกเก้าหาง · drago ลูกมังกรน้อย (บิน) · owl นกฮูกเวทมนตร์ (บิน) · slimeq สไลม์เจ้าหญิง · panda แพนด้าน้อย — โบนัสสเตตัสเล็กน้อย (PETST7)
try{
// ---------- สัตว์ขี่ ----------
const NM75={dgold:{n:'มังกรทองจักรพรรดิ',spd:1.6,fly:1,wing:'#ffe08a',wing2:'#e0a020',lv:90,p:450000,aur:'255,215,90',base:'drake',dragon:1,d:'สัตว์ขี่บินระดับตำนาน: ออร่าทองหมุนรอบตัว · ลอยข้ามน้ำ · ต้อง Lv.90'},
 dfrost:{n:'มังกรน้ำแข็งนิรันดร์',spd:1.55,fly:1,wing:'#e8f8ff',wing2:'#8ad0ff',lv:80,p:320000,aur:'150,220,255',base:'drake',dragon:1,d:'สัตว์ขี่บิน: ออร่าเกล็ดน้ำแข็ง 3 มิติ · ลอยข้ามน้ำ · ต้อง Lv.80'},
 tiger:{n:'พยัคฆ์ขาวสายฟ้า',spd:1.5,lv:60,p:120000,aur:'190,210,255',base:'wolf',d:'สัตว์ขี่: ประกายสายฟ้าวิ่งรอบตัว · เร็ว · ต้อง Lv.60'},
 kirin:{n:'กิเลนอัคคีมงคล',spd:1.55,lv:70,p:200000,aur:'255,120,60',base:'horse',d:'สัตว์ขี่: เขาทองคำ ไฟมงคลโคจร · ต้อง Lv.70'},
 phoenix:{n:'อาชาฟีนิกซ์เพลิง',spd:1.55,fly:1,wing:'#ffb04a',wing2:'#ff4a1a',lv:75,p:260000,aur:'255,150,50',base:'pegasus',d:'สัตว์ขี่บิน: ปีกเพลิง ออร่าไฟ 3 มิติ · ลอยข้ามน้ำ · ต้อง Lv.75'}};
const MP75={dgold:{hi:'#fff2b0',b:'#e0b030',s:'#8a5a10',m:'#ff6a3a',leg:'#b08020'},dfrost:{hi:'#ffffff',b:'#bfe8ff',s:'#4a8ab8',m:'#e8fbff',leg:'#8ac0e0'},
 tiger:{hi:'#ffffff',b:'#e8ecf4',s:'#2a2a38',m:'#9ab8ff',leg:'#c8ccd8'},kirin:{hi:'#ffd06a',b:'#c83a1a',s:'#6a1408',m:'#ffd23a',leg:'#8a2a10'},phoenix:{hi:'#ffe0a0',b:'#ff8a2a',s:'#a02a08',m:'#ffd23a',leg:'#c0501a'}};
window.NM75=NM75;
for(const k in NM75){const M=NM75[k];MOUNTS[k]={n:M.n,spd:M.spd,fly:M.fly||0,wing:M.wing,wing2:M.wing2};MPAL[k]=MP75[k];if(!ANIMS.some(a=>a.k===k))ANIMS.push({k,n:M.n,p:M.p,mount:1,d:M.d})}
{const _ba=buyAnimal;buyAnimal=function(k){const M=NM75[k]||NP75[k];if(M&&P.lv<(M.lv|0)){say('ต้อง Lv.'+M.lv+' ขึ้นไป');sfx('thud');return}return _ba.apply(this,arguments)};window.buyAnimal=buyAnimal}
function ring75(cx,cy,R,r,rot,rgb,w,front,al){ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);const N=26;for(let i=0;i<N;i++){const a0=i/N*6.2832,a1=(i+1)/N*6.2832,d=Math.sin((a0+a1)/2);if((d>0)!==front)continue;
 ctx.strokeStyle='rgba('+rgb+','+(al*(front?.6+.4*d:.2+.2*(1+d)))+')';ctx.lineWidth=w*(front?1+.3*d:.7);ctx.beginPath();ctx.moveTo(Math.cos(a0)*R,Math.sin(a0)*r);ctx.lineTo(Math.cos(a1)*R,Math.sin(a1)*r);ctx.stroke()}ctx.restore()}
function aura75(k,x,y,front){const M=NM75[k];if(!M)return;const t=performance.now()/1000,rgb=M.aur,cy=y-34;ctx.save();ctx.globalCompositeOperation='lighter';
 if(!front){const g=ctx.createRadialGradient(x,cy,4,x,cy,62);g.addColorStop(0,'rgba('+rgb+',.22)');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.fillRect(x-64,cy-64,128,128);
  ctx.save();ctx.translate(x,y+2);ctx.scale(1,.3);ctx.strokeStyle='rgba('+rgb+',.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,40,0,7);ctx.stroke();ctx.rotate(t*1.2);for(let i=0;i<10;i++){ctx.rotate(.628);ctx.fillStyle='rgba('+rgb+',.7)';ctx.fillRect(34,-1.5,8,3)}ctx.restore()}
 ring75(x,cy,46,12,-.3,rgb,2.2,front,1);ring75(x,cy-6,38,9,.45,'255,255,255',1.2,front,.7);
 for(let i=0;i<3;i++){const a=t*2.2+i*2.094,d=Math.sin(a);if((d>0)!==front)continue;const ox=Math.cos(a)*46,oy=Math.sin(a)*12,px=x+ox*Math.cos(-.3)-oy*Math.sin(-.3),py=cy+ox*Math.sin(-.3)+oy*Math.cos(-.3);
  const g=ctx.createRadialGradient(px,py,0,px,py,7);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.4,'rgba('+rgb+',.85)');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.fillRect(px-7,py-7,14,14)}
 if(front&&k==='tiger'&&Math.random()<.2){ctx.strokeStyle='rgba(200,220,255,.9)';ctx.lineWidth=1.5;ctx.beginPath();let px=x+(Math.random()-.5)*70,py=cy-20;ctx.moveTo(px,py);for(let j=0;j<4;j++){px+=(Math.random()-.5)*14;py+=10;ctx.lineTo(px,py)}ctx.stroke()}
 if(front&&Math.random()<.35)try{rfxP(x+(Math.random()-.5)*60,cy+(Math.random()-.5)*40,(Math.random()-.5)*10,-20-Math.random()*20,.8,rgb,1.6,'spark')}catch(e){}
 ctx.restore()}
// ตัวมังกร (มุมข้าง) ในพิกัดเดียวกับม้า (อานอยู่ราว x26–44, y−46)
function dragon75(K,A,t,g){const sw=Math.sin(t*3),wv=Math.sin(g)*A;ctx.lineJoin='round';
 // หาง
 ctx.strokeStyle=K.s;ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(14,-34);ctx.bezierCurveTo(-4,-30+sw*4,-14,-20+sw*8,-26,-28+sw*10);ctx.stroke();ctx.strokeStyle=K.b;ctx.lineWidth=6;ctx.stroke();
 ctx.fillStyle=K.m;ctx.beginPath();ctx.moveTo(-26,-28+sw*10);ctx.lineTo(-36,-34+sw*10);ctx.lineTo(-30,-22+sw*10);ctx.closePath();ctx.fill();
 // ขา
 const leg=(lx,ph,far)=>{const a=Math.sin(g+ph)*A*.6;ctx.save();ctx.translate(lx,-26);ctx.rotate(a);ctx.fillStyle=far?K.s:K.leg;ctx.fillRect(-3,0,7,16);ctx.fillStyle=K.hi;ctx.fillRect(-4,14,9,4);ctx.restore()};
 leg(22,Math.PI,1);leg(50,0,1);
 // ลำตัว
 const bg=ctx.createLinearGradient(0,-52,0,-22);bg.addColorStop(0,K.hi);bg.addColorStop(.45,K.b);bg.addColorStop(1,K.s);ctx.fillStyle=bg;ctx.strokeStyle='rgba(20,10,0,.55)';ctx.lineWidth=1.2;
 ctx.beginPath();ctx.moveTo(10,-32);ctx.bezierCurveTo(12,-48,30,-52,46,-50);ctx.bezierCurveTo(56,-50,62,-46,64,-40);ctx.bezierCurveTo(64,-30,54,-24,40,-24);ctx.bezierCurveTo(26,-23,14,-24,10,-32);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=K.hi;ctx.globalAlpha=.55;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(20+i*7,-30,3,2.2,0,0,7);ctx.fill()}ctx.globalAlpha=1;
 ctx.fillStyle=K.m;for(let i=0;i<7;i++){const sx=14+i*7;ctx.beginPath();ctx.moveTo(sx,-49+Math.abs(i-3)*.6);ctx.lineTo(sx+3,-56+Math.abs(i-3)*.8);ctx.lineTo(sx+6,-49+Math.abs(i-3)*.6);ctx.fill()}
 leg(30,Math.PI*.5,0);leg(56,Math.PI*1.5,0);
 // คอ + หัว
 const hb=Math.sin(t*2)*1.5;ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(56,-46);ctx.bezierCurveTo(62,-58,66,-66+hb,72,-70+hb);ctx.lineTo(78,-64+hb);ctx.bezierCurveTo(72,-56,68,-46,62,-38);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.save();ctx.translate(76,-70+hb);ctx.fillStyle=K.b;ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(10,-4);ctx.lineTo(16,0);ctx.lineTo(10,5);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=K.hi;ctx.beginPath();ctx.moveTo(-4,-6);ctx.lineTo(-12,-14);ctx.lineTo(-2,-8);ctx.fill();ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(-6,-16);ctx.lineTo(3,-7);ctx.fill();
 ctx.fillStyle=K.m;ctx.beginPath();ctx.arc(4,-1,1.8,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(3.4,-1.8,.9,.9);ctx.strokeStyle=K.s;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(6,3);ctx.lineTo(15,1);ctx.stroke();
 ctx.strokeStyle=K.m;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(12,2);ctx.quadraticCurveTo(20,6+sw*3,24,2+sw*4);ctx.stroke();ctx.restore();
 // อาน
 ctx.fillStyle='#3a1e0c';ctx.beginPath();ctx.moveTo(26,-49);ctx.quadraticCurveTo(28,-56,31,-53);ctx.quadraticCurveTo(35,-50,39,-52);ctx.quadraticCurveTo(43,-56,44,-50);ctx.lineTo(43,-46);ctx.lineTo(27,-46);ctx.closePath();ctx.fill();ctx.fillStyle=K.m;ctx.fillRect(27,-46,16,4)}
function steed75(k,x,y,f,A){const M=NM75[k],K=MPAL[k],t=performance.now()/1000,g=t*(A?9.5:0)+(MOUNT.g0||0);
 ctx.save();ctx.translate(x,y);ctx.scale(f*MSC,MSC);ctx.translate(-34,0);ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(34,1,42,6,0,0,7);ctx.fill();dragon75(K,A,t,g);ctx.restore()}
// วาดด้วยท่าเดิมแต่สีของตัวเอง
function withBase75(k,fn){const M=NM75[k];if(!M)return fn(k);const b=M.base,sp=MPAL[b],sm=MOUNTS[b];MPAL[b]=MPAL[k];MOUNTS[b]=Object.assign({},sm,{wing:M.wing||sm&&sm.wing,wing2:M.wing2||sm&&sm.wing2});try{return fn(b)}finally{MPAL[b]=sp;MOUNTS[b]=sm}}
{const _ds=drawSteed;drawSteed=function(k,x,y,f,A){if(MOUNTART.paint(k,x,y,f<0?'l':'r',A,0))return;if(!NM75[k])return _ds.apply(this,arguments);try{aura75(k,x,y,false)}catch(e){}
  if(NM75[k].dragon){try{wings10(x,y,f,false,k)}catch(e){}steed75(k,x,y,f,A)}else withBase75(k,b=>_ds.call(this,b,x,y,f,A));
  if(k==='kirin')try{ctx.save();ctx.translate(x,y);ctx.scale(f*MSC,MSC);ctx.translate(-34,0);ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(64,-68);ctx.lineTo(70,-84);ctx.lineTo(67,-67);ctx.fill();ctx.restore()}catch(e){}
  try{aura75(k,x,y,true)}catch(e){}};window.drawSteed=drawSteed}
{const _du=drawSteedUD7;drawSteedUD7=function(k,x,y,dir,A,ph){if(!NM75[k])return _du.apply(this,arguments);if(ph===0)try{aura75(k,x,y,false)}catch(e){}const r=withBase75(k,b=>_du.call(this,b,x,y,dir,A,ph));if(ph!==0)try{aura75(k,x,y,true)}catch(e){}return r};window.drawSteedUD7=drawSteedUD7}
{const _mp=mountParticles;mountParticles=function(k,x,y,f,A,dt){if(NM75[k])return withBase75(k,b=>_mp.call(this,b,x,y,f,A,dt));return _mp.apply(this,arguments)};window.mountParticles=mountParticles}
// ---------- สัตว์เลี้ยง ----------
const NP75={fox:{n:'จิ้งจอกเก้าหาง',p:25000,lv:20,st:{agi:3,int:2},d:'สัตว์เลี้ยง: หางเปลวไฟ 9 หาง · AGI+3 INT+2 · ต้อง Lv.20'},
 drago:{n:'ลูกมังกรน้อย',p:60000,lv:40,fly:1,st:{str:3,vit:3},d:'สัตว์เลี้ยงบินได้: พ่นไฟเล็ก ๆ · STR+3 VIT+3 · ต้อง Lv.40'},
 owl:{n:'นกฮูกเวทมนตร์',p:30000,lv:25,fly:1,st:{int:4},d:'สัตว์เลี้ยงบินได้: ดวงตาเรืองแสง · INT+4 · ต้อง Lv.25'},
 slimeq:{n:'สไลม์เจ้าหญิง',p:12000,lv:10,st:{vit:3},d:'สัตว์เลี้ยง: สไลม์ใส่มงกุฎ เด้งดึ๋ง · VIT+3 · ต้อง Lv.10'},
 panda:{n:'แพนด้าน้อย',p:18000,lv:15,st:{vit:2,str:2},d:'สัตว์เลี้ยง: กลิ้งตามตัว กินไผ่ · STR+2 VIT+2 · ต้อง Lv.15'}};window.NP75=NP75;
for(const k in NP75){const Q=NP75[k];if(!ANIMS.some(a=>a.k===k))ANIMS.push({k,n:Q.n,p:Q.p,pet:1,d:Q.d});try{PETST7[k]=Q.st}catch(e){}}
function pet75(k,x,y,mine){const t=performance.now()/1000,mv=mine&&PET.mv,f=mine?PET.f:1,Q=NP75[k],fl=Q.fly?8+Math.sin(t*3)*3:0,b=mv&&!Q.fly?Math.abs(Math.sin(t*12))*2:0;
 ctx.save();ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x,y,9-(fl?2:0),3,0,0,7);ctx.fill();ctx.translate(x,y-b-fl);ctx.scale(f,1);
 if(k==='fox'){for(let i=0;i<9;i++){const a=-2.4+i*.12+Math.sin(t*3+i)*.06;ctx.save();ctx.translate(-6,-7);ctx.rotate(a);const g=ctx.createLinearGradient(0,0,14,0);g.addColorStop(0,'#ff9a3a');g.addColorStop(1,'rgba(255,240,180,.9)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(8,0,8,2.6,0,0,7);ctx.fill();ctx.restore()}
  ctx.fillStyle='#ff8a2a';ctx.beginPath();ctx.ellipse(0,-7,8,5.5,0,0,7);ctx.fill();ctx.fillStyle='#fff4e0';ctx.beginPath();ctx.ellipse(2,-5,4,2.6,0,0,7);ctx.fill();
  ctx.fillStyle='#ff8a2a';ctx.beginPath();ctx.arc(8,-12,5,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(5,-15);ctx.lineTo(6,-22);ctx.lineTo(9,-16);ctx.fill();ctx.beginPath();ctx.moveTo(9,-16);ctx.lineTo(12,-21);ctx.lineTo(12,-14);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(12,-11);ctx.lineTo(16,-10);ctx.lineTo(12,-8);ctx.fill();ctx.fillStyle='#2a1a10';ctx.fillRect(9,-13,1.6,1.6);
  ctx.fillStyle='#e07020';for(const lx of [-4,0,3,6])ctx.fillRect(lx,-3,2.2,3+(mv?Math.sin(t*12+lx):0))}
 else if(k==='drago'){const w=Math.sin(t*14)*.5;for(const s of [-1,1]){ctx.save();ctx.translate(-1,-12);ctx.scale(1,s*.4+.6);ctx.rotate(-.8+w*s);ctx.fillStyle='#ff9a5a';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-10,-10);ctx.lineTo(-3,-1);ctx.lineTo(-12,-3);ctx.closePath();ctx.fill();ctx.restore()}
  ctx.fillStyle='#e04a2a';ctx.beginPath();ctx.ellipse(0,-8,7,5.5,0,0,7);ctx.fill();ctx.fillStyle='#ffd88a';ctx.beginPath();ctx.ellipse(1,-6,4,3,0,0,7);ctx.fill();ctx.strokeStyle='#e04a2a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-6,-7);ctx.quadraticCurveTo(-12,-4,-12,-10);ctx.stroke();
  ctx.fillStyle='#e04a2a';ctx.beginPath();ctx.arc(7,-13,5,0,7);ctx.fill();ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(5,-17);ctx.lineTo(3,-22);ctx.lineTo(7,-17);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(8,-14,1.6,1.8);
  if(Math.sin(t*1.3)>.92){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,150,40,.8)';ctx.beginPath();ctx.ellipse(16,-12,5,2.5,0,0,7);ctx.fill()}}
 else if(k==='owl'){const w=Math.sin(t*10)*.4;ctx.fillStyle='#7a5a3a';ctx.beginPath();ctx.ellipse(0,-9,7,8,0,0,7);ctx.fill();ctx.fillStyle='#d8c0a0';ctx.beginPath();ctx.ellipse(0,-6,4.5,5,0,0,7);ctx.fill();
  for(const s of [-1,1]){ctx.save();ctx.translate(s*6,-10);ctx.rotate(s*(.4+w));ctx.fillStyle='#5a3e26';ctx.beginPath();ctx.ellipse(s*3,0,4,7,0,0,7);ctx.fill();ctx.restore()}
  ctx.fillStyle='#7a5a3a';ctx.beginPath();ctx.moveTo(-6,-16);ctx.lineTo(-4,-21);ctx.lineTo(-2,-16);ctx.fill();ctx.beginPath();ctx.moveTo(2,-16);ctx.lineTo(4,-21);ctx.lineTo(6,-16);ctx.fill();
  ctx.globalCompositeOperation='lighter';for(const s of [-2.6,2.6]){const g=ctx.createRadialGradient(s,-12,0,s,-12,4);g.addColorStop(0,'rgba(255,255,200,1)');g.addColorStop(1,'rgba(120,200,255,0)');ctx.fillStyle=g;ctx.fillRect(s-4,-16,8,8)}ctx.globalCompositeOperation='source-over';ctx.fillStyle='#ffb02a';ctx.beginPath();ctx.moveTo(-1,-9);ctx.lineTo(1,-9);ctx.lineTo(0,-6);ctx.fill()}
 else if(k==='slimeq'){const sq=1+Math.sin(t*(mv?12:4))*.08;ctx.save();ctx.scale(1/sq,sq);const g=ctx.createRadialGradient(-2,-10,1,0,-6,10);g.addColorStop(0,'#ffe8f4');g.addColorStop(.5,'#ff9ad0');g.addColorStop(1,'#d04a9a');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-9,0);ctx.quadraticCurveTo(-10,-14,0,-15);ctx.quadraticCurveTo(10,-14,9,0);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle='#2a1020';ctx.fillRect(-4,-8,2,2.4);ctx.fillRect(2,-8,2,2.4);ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.ellipse(-4,-12,2,1.2,0,0,7);ctx.fill();
  ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(-5,-15);ctx.lineTo(-5,-20);ctx.lineTo(-2,-17);ctx.lineTo(0,-21);ctx.lineTo(2,-17);ctx.lineTo(5,-20);ctx.lineTo(5,-15);ctx.closePath();ctx.fill();ctx.fillStyle='#ff4a8a';ctx.beginPath();ctx.arc(0,-18,1.2,0,7);ctx.fill()}
 else if(k==='panda'){ctx.fillStyle='#f4f4f0';ctx.beginPath();ctx.ellipse(0,-7,9,6.5,0,0,7);ctx.fill();ctx.fillStyle='#1a1a20';for(const lx of [-6,-2,3,6])ctx.fillRect(lx,-3,3,3+(mv?Math.sin(t*12+lx):0));ctx.beginPath();ctx.ellipse(-1,-9,6,3,0,0,7);ctx.fill();
  ctx.fillStyle='#f4f4f0';ctx.beginPath();ctx.arc(8,-12,5.5,0,7);ctx.fill();ctx.fillStyle='#1a1a20';ctx.beginPath();ctx.arc(5,-17,2,0,7);ctx.fill();ctx.beginPath();ctx.arc(11,-17,2,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(7,-12,1.6,2,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(10.5,-12,1.6,2,0,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(7,-12.6,.8,.8);ctx.fillRect(10.4,-12.6,.8,.8);
  ctx.strokeStyle='#5aa02a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(12,-9);ctx.lineTo(16,-15);ctx.stroke();ctx.fillStyle='#7ac83a';ctx.beginPath();ctx.ellipse(16,-15,2.5,1,-.6,0,7);ctx.fill()}
 ctx.restore()}
{const _dp=drawPet;drawPet=function(p,x,y){if(!(p&&NP75[p.k]))return _dp.apply(this,arguments);if(typeof MOUNT!=='undefined'&&MOUNT.on&&HOME.mount&&x===PET.x)return;try{pet75(p.k,x,y,x===PET.x)}catch(e){}};window.drawPet=drawPet}
}catch(e){console.warn('fix75',e)}
