// fix102 (v4.87) — 👑 บอสใหม่ 5 ตัวของดันเจี้ยนนครวารี (เจ้าของสั่ง 2026-10-14 16:04: "สร้างบอสใหม่เพื่อรองรับ ให้ฟาร์มถึงเลเวล 200")
//  หน้าตาใหม่ทั้งหมด (เดิมใช้รูปมังกร/โกเลมเปลี่ยนสี): ❄️ ราชินีหิมะนิรันดร์ · 🍄 ราชาเห็ดยักษ์ · 🔥 แม่ทัพเพลิงอสูร · 🌊 อสรพิษแห่งสมุทร · 🌠 เทพดาราร่วง
//  - ตระกูลมอนใหม่ใน FAM/MOBDRAW (ท่าโจมตี/ท่าบอสใช้ระบบเดิม: ทุบพื้น พุ่งชน ยิงกระจาย) · ผู้เล่นอื่นเห็นเหมือนกัน (W33 ส่ง m.f)
//  - บอสแข็งขึ้นตามดันเจี้ยน (เลือด ×1.6–2.4) · ตายแล้วเกิดใหม่ทุก 3 นาที (ระบบเดิม)
try{
const NF102={iceq:Object.assign({},FAM.dragon,{r:22,sz:1.05}),mushk:Object.assign({},FAM.golem,{r:24,sz:1.15,spd:30}),fgen:Object.assign({},FAM.golem,{r:20,sz:1.1,spd:40,atk:1.5}),
 serp:Object.assign({},FAM.wolf,{r:24,sz:1.15,range:90,hp:1.4,atk:1.4,kb:.1}),starg:Object.assign({},FAM.dragon,{r:22,sz:1.1})};
for(const k in NF102)if(!FAM[k])FAM[k]=NF102[k];
const g102=(x0,y0,x1,y1,a,b,c)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,a);if(c){g.addColorStop(.5,b);g.addColorStop(1,c)}else g.addColorStop(1,b);return g};
const gl102=(x,y,r,rgb,a)=>{ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+(a||.6)+')');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore()};
const pth=(pts,fill,stroke,w)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w||1;ctx.stroke()}};
const atk102=m=>m.st==='wu'||m.st==='slamWU'||m.st==='chargeWU'||m.st==='volleyWU';
// ❄️ ราชินีหิมะนิรันดร์
function drawIceQ(m,t,c){const z=-6+Math.sin(t*2)*3,a=atk102(m);ctx.translate(0,z);gl102(0,-22,40,'170,235,255',.35);
 // ปีกผลึก
 for(const s of [-1,1])for(let i=0;i<4;i++){const ang=(-.9+i*.32)*s,L=22+i*4+(a?6:0);ctx.save();ctx.translate(s*4,-26);ctx.rotate(ang+Math.sin(t*2+i)*.05*s);pth([[0,0],[s*L*.25,-5],[s*L,-1],[s*L*.25,4]],'rgba(200,240,255,.55)','rgba(120,190,230,.9)',1);ctx.restore()}
 // ชุดราตรี
 pth([[-7,-26],[7,-26],[16,-2],[10,0],[0,-3],[-10,0],[-16,-2]],g102(0,-26,0,0,'#ffffff','#9ad8f0','#3a6a90'),'#10203a',1.2);
 for(let i=-14;i<=14;i+=4){ctx.fillStyle='#e8f8ff';ctx.beginPath();ctx.moveTo(i,-1);ctx.lineTo(i+2,-7);ctx.lineTo(i+4,-1);ctx.fill()}
 pth([[-6,-38],[6,-38],[7,-26],[-7,-26]],g102(0,-38,0,-26,'#e8f8ff','#7ab8e0'),'#10203a',1);
 ctx.fillStyle='#e8f4ff';ctx.beginPath();ctx.arc(0,-43,5.5,0,7);ctx.fill();ctx.strokeStyle='#10203a';ctx.stroke();
 ctx.fillStyle='#d8e8f8';ctx.beginPath();ctx.moveTo(-6,-46);ctx.quadraticCurveTo(-11,-30,-8,-20);ctx.lineTo(-5,-30);ctx.quadraticCurveTo(-4,-40,0,-48);ctx.quadraticCurveTo(4,-40,5,-30);ctx.lineTo(8,-20);ctx.quadraticCurveTo(11,-30,6,-46);ctx.fill();
 ctx.fillStyle='#4ab8ff';ctx.fillRect(1,-44,2.4,1.6);ctx.fillRect(-3.4,-44,2.4,1.6);gl102(0,-44,6,'120,220,255',.7);
 for(const [x,h] of [[-5,6],[-2.5,9],[0,12],[2.5,9],[5,6]])pth([[x-1.4,-48],[x,-48-h],[x+1.4,-48]],'#e8f8ff','#5ab8f0',.6);
 // คทา
 ctx.save();ctx.translate(10,-30);ctx.rotate(a?-.9:-.2);ctx.strokeStyle='#bfe0f8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(0,-20);ctx.stroke();pth([[0,-30],[4,-22],[0,-16],[-4,-22]],'#ffffff','#5ab8f0',1);gl102(0,-23,10,'190,240,255',.7);ctx.restore()}
// 🍄 ราชาเห็ดยักษ์
function drawMushK(m,t,c){const b=Math.sin(t*3)*1.5,a=atk102(m);
 for(let i=0;i<5;i++){const ph=t*1.2+i*1.3,x=Math.sin(ph)*24,y=-20-((t*12+i*9)%30);gl102(x,y,4,'176,255,106',.7)}
 ctx.fillStyle='#e8dcc0';ctx.strokeStyle='#2a1a10';ctx.lineWidth=1.3;for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*7,-3,5,4,0,0,7);ctx.fill();ctx.stroke()}
 pth([[-12,-4],[12,-4],[14,-24+b],[-14,-24+b]],g102(-14,0,14,0,'#f4ead0','#d8c8a0','#a89870'),'#2a1a10',1.3);
 for(const s of [-1,1]){ctx.save();ctx.translate(s*13,-18+b);ctx.rotate(s*(a?-1.2:.4));ctx.fillStyle='#e8dcc0';ctx.fillRect(-3,0,6,12);ctx.strokeRect(-3,0,6,12);ctx.beginPath();ctx.arc(0,14,4.4,0,7);ctx.fill();ctx.stroke();ctx.restore()}
 ctx.fillStyle='#14061a';ctx.beginPath();ctx.ellipse(-5,-16+b,2.6,3,0,0,7);ctx.ellipse(5,-16+b,2.6,3,0,0,7);ctx.fill();gl102(-5,-16+b,5,'176,255,106',.9);gl102(5,-16+b,5,'176,255,106',.9);
 ctx.strokeStyle='#2a1a10';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,-10+b,4,.2,Math.PI-.2);ctx.stroke();
 // หมวกเห็ด
 const cy=-26+b;ctx.fillStyle=g102(0,cy-26,0,cy+2,'#d88aff','#8a3ab8','#4a1a6a');ctx.beginPath();ctx.ellipse(0,cy,30,22,0,Math.PI,0);ctx.quadraticCurveTo(31,cy+6,0,cy+5);ctx.quadraticCurveTo(-31,cy+6,-30,cy);ctx.fill();ctx.strokeStyle='#1a0624';ctx.lineWidth=1.5;ctx.stroke();
 ctx.fillStyle='#f4ead0';for(const [x,y,r] of [[-16,-8,4.5],[-3,-16,5.5],[13,-10,4],[22,-3,2.8],[-24,-2,2.6],[5,-4,3]]){ctx.beginPath();ctx.arc(x,cy+y,r,0,7);ctx.fill()}
 pth([[-9,cy-20],[-9,cy-28],[-5,cy-24],[0,cy-31],[5,cy-24],[9,cy-28],[9,cy-20]],'#ffd84a','#6a4a10',1);for(const x of [-9,0,9]){ctx.fillStyle='#b0ff6a';ctx.beginPath();ctx.arc(x,cy-27-(x?0:3),1.6,0,7);ctx.fill()}}
// 🔥 แม่ทัพเพลิงอสูร
function drawFGen(m,t,c){const a=atk102(m),w=m.mv?Math.sin(t*9):0;gl102(0,-20,38,'255,90,30',.3);
 // ผ้าคลุม
 pth([[-9,-34],[9,-34],[15+Math.sin(t*3)*2,-2],[0,-6],[-15+Math.sin(t*3+1)*2,-2]],'#6a0a08','#1a0202',1.2);
 for(const s of [-1,1]){ctx.save();ctx.translate(s*5,-12);ctx.rotate(w*.4*s);pth([[-3,0],[3,0],[4,12],[-4,12]],'#2a1410','#0a0202',1);ctx.restore()}
 pth([[-10,-34],[10,-34],[12,-20],[8,-11],[-8,-11],[-12,-20]],g102(-12,0,12,0,'#4a2420','#2a1410','#140808'),'#0a0202',1.3);
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,110,30,.95)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-6,-30);ctx.lineTo(-2,-24);ctx.lineTo(-5,-18);ctx.moveTo(6,-30);ctx.lineTo(3,-22);ctx.lineTo(6,-15);ctx.stroke();ctx.restore();
 for(const s of [-1,1]){pth([[s*8,-36],[s*15,-37],[s*17,-30],[s*10,-29]],'#3a1a14','#0a0202',1);for(let i=0;i<2;i++)pth([[s*(10+i*4),-37],[s*(12+i*4),-44],[s*(13+i*4),-37]],'#d8c8b0','#2a1a10',.6)}
 // หัว+เขา
 pth([[-6,-46],[6,-46],[7,-36],[-7,-36]],'#2a1410','#0a0202',1.2);ctx.fillStyle='#ff5a1a';ctx.fillRect(-4.6,-42,3,1.8);ctx.fillRect(1.6,-42,3,1.8);gl102(0,-41,7,'255,90,20',.9);
 for(const s of [-1,1]){ctx.fillStyle=g102(s*6,-46,s*16,-58,'#e8d8c0','#3a1a10');ctx.beginPath();ctx.moveTo(s*5,-46);ctx.quadraticCurveTo(s*16,-48,s*14,-60);ctx.quadraticCurveTo(s*11,-50,s*3,-44);ctx.fill()}
 // ดาบเพลิง
 ctx.save();ctx.translate(12,-26);ctx.rotate(a?-2.4:-.5+Math.sin(t*2)*.05);ctx.fillStyle='#2a1410';ctx.fillRect(-1.5,0,3,8);ctx.fillStyle='#ffcc40';ctx.fillRect(-6,-1,12,3);
 pth([[-3,-1],[3,-1],[4,-30],[0,-40],[-4,-30]],g102(-4,0,4,0,'#3a1a14','#ff5a1a','#140606'),'#0a0202',1);ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const y=-8-i*8,f=Math.sin(t*14+i)*2;ctx.fillStyle='rgba(255,'+(140+i*25)+',40,.6)';ctx.beginPath();ctx.ellipse(f,y,4,6,0,0,7);ctx.fill()}ctx.restore();ctx.restore()}
// 🌊 อสรพิษแห่งสมุทร
function drawSerp(m,t,c){const a=atk102(m);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(106,255,224,.35)';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,18+i*7+Math.sin(t*2+i)*2,5+i*2,0,0,7);ctx.stroke()}ctx.restore();
 const seg=[];for(let i=0;i<9;i++){const u=i/8;seg.push([Math.sin(u*5+t*2)*(14-u*6)*(1-u*.3)-4+u*6,-u*44-(a?u*8:0),9-u*4])}
 for(let i=0;i<seg.length;i++){const [x,y,r]=seg[i];ctx.fillStyle=g102(x-r,y,x+r,y,'#3ad8c8','#1a8a8a','#0a3a4a');ctx.beginPath();ctx.ellipse(x,y,r,r*.8,0,0,7);ctx.fill();ctx.strokeStyle='#04161e';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='rgba(200,255,244,.35)';ctx.beginPath();ctx.arc(x-r*.3,y-r*.2,r*.35,0,7);ctx.fill();if(i%2&&i<7){pth([[x+r*.6,y],[x+r+6,y-4],[x+r*.8,y+3]],'#ffd86a','#5a3a08',.7)}}
 const [hx,hy]=seg[8];ctx.save();ctx.translate(hx+3,hy-4);pth([[-8,-2],[10,-5],[16,0],[10,5],[-6,5]],g102(0,-6,0,6,'#3ad8c8','#0e4a5a'),'#04161e',1.2);
 ctx.fillStyle='#e8fff8';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(8+i*2.6,3);ctx.lineTo(9+i*2.6,7);ctx.lineTo(10+i*2.6,3);ctx.fill()}ctx.fillStyle='#ffe060';ctx.beginPath();ctx.arc(6,-1,1.8,0,7);ctx.fill();gl102(6,-1,6,'106,255,224',.8);
 ctx.strokeStyle='#ffd86a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-2,-3);ctx.lineTo(-2,-14);ctx.moveTo(-7,-4);ctx.quadraticCurveTo(-8,-10,-7,-13);ctx.moveTo(3,-4);ctx.quadraticCurveTo(4,-10,3,-13);ctx.stroke();for(const x of [-7,-2,3])pth([[x-1.4,-12],[x,-17],[x+1.4,-12]],'#fff6c8',null);
 pth([[-6,-2],[-14,-8],[-10,0]],'#2ac8b8','#04161e',.8);ctx.restore()}
// 🌠 เทพดาราร่วง
function drawStarG(m,t,c){const z=-8+Math.sin(t*1.6)*3,a=atk102(m);ctx.translate(0,z);gl102(0,-26,46,'255,240,170',.35);
 for(const s of [-1,1])for(let j=0;j<2;j++){ctx.save();ctx.translate(s*4,-30+j*8);ctx.rotate(s*(-.5+j*.5+Math.sin(t*2+j)*.08));for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#ffffff':'#fff2c8';ctx.strokeStyle='rgba(160,140,80,.8)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(s*(10+i*3),-8-i*4,s*(20+i*4),-3-i*5);ctx.quadraticCurveTo(s*(12+i*2),-1-i,0,3);ctx.closePath();ctx.fill();ctx.stroke()}ctx.restore()}
 pth([[-8,-32],[8,-32],[13,-2],[0,-5],[-13,-2]],g102(0,-32,0,0,'#2a2a6a','#1a1a4a','#0a0a2a'),'#06061a',1.2);
 ctx.fillStyle='#ffffff';for(const [x,y] of [[-6,-22],[-2,-14],[4,-18],[7,-9],[-8,-7],[1,-26]]){ctx.beginPath();ctx.arc(x,y,.9,0,7);ctx.fill()}ctx.strokeStyle='rgba(200,220,255,.6)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(-6,-22);ctx.lineTo(-2,-14);ctx.lineTo(4,-18);ctx.lineTo(7,-9);ctx.stroke();
 ctx.strokeStyle='#ffd86a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-8,-32);ctx.lineTo(8,-32);ctx.stroke();
 ctx.fillStyle=g102(-5,-44,5,-34,'#fff8e0','#e8c870');ctx.beginPath();ctx.ellipse(0,-39,5.4,6.4,0,0,7);ctx.fill();ctx.strokeStyle='#5a4010';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#3a3a8a';ctx.fillRect(-3.6,-40,2.6,1.4);ctx.fillRect(1,-40,2.6,1.4);
 ctx.save();ctx.translate(0,-48);ctx.rotate(t*.6);ctx.strokeStyle='rgba(255,240,170,.95)';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(0,0,11,3.4,0,0,7);ctx.stroke();for(let i=0;i<5;i++){const an=i*Math.PI*2/5;const x=Math.cos(an)*11,y=Math.sin(an)*3.4;ctx.fillStyle='#ffffff';ctx.beginPath();for(let j=0;j<10;j++){const aa=j*Math.PI/5,r=j%2?1:2.6;ctx.lineTo(x+Math.cos(aa)*r,y+Math.sin(aa)*r)}ctx.fill()}ctx.restore();
 for(let i=0;i<4;i++){const an=t*1.4+i*Math.PI/2,x=Math.cos(an)*24,y=-22+Math.sin(an)*8;gl102(x,y,a?9:6,'255,240,170',.9)}
 if(a){gl102(0,-24,30,'255,250,210',.5)}}
Object.assign(MOBDRAW,{iceq:drawIceQ,mushk:drawMushK,fgen:drawFGen,serp:drawSerp,starg:drawStarG});window.MOBDRAW=MOBDRAW;
// ใช้กับบอสดันเจี้ยนนครวารี
const MAP102={dg96a:['iceq',1.6],dg96b:['mushk',1.8],dg96c:['fgen',2],dg96d:['serp',2.2],dg96e:['starg',2.4]};
try{for(const d of (window.DG96||[])){const q=MAP102[d.id];if(q){d.boss.f=q[0];const z=ZONES.find(z=>z.id===d.id);if(z&&z.boss)z.boss.f=q[0]}}}catch(e){}
{const _sb=spawnBoss;spawnBoss=function(){const r=_sb.apply(this,arguments);try{const Zd=D&&D.zone&&D.zone.Zd,q=Zd&&MAP102[Zd.id];if(q&&D.boss&&!D.boss.b102){D.boss.b102=1;D.boss.hp=D.boss.max=Math.round(D.boss.max*q[1])}}catch(e){}return r};window.spawnBoss=spawnBoss}
window.MAP102=MAP102;
}catch(e){console.warn('fix102',e)}
