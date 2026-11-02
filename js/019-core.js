// แลนด์มาร์ก: ทางเข้าถ้ำ + ประตูวาปหิน (ตำแหน่งตายตัวจาก data/world.js)
const caveSpr=(()=>{const c=document.createElement('canvas');c.width=160;c.height=132;const k=c.getContext('2d');
 k.fillStyle='rgba(0,0,0,.3)';k.beginPath();k.ellipse(80,126,78,8,0,0,7);k.fill();
 const mass=()=>{k.beginPath();k.moveTo(2,128);k.bezierCurveTo(-4,80,14,40,40,26);k.bezierCurveTo(58,2,104,0,122,22);k.bezierCurveTo(148,38,166,84,158,128);k.closePath()};
 mass();let g=k.createLinearGradient(0,0,0,130);g.addColorStop(0,'#9a9d92');g.addColorStop(.5,'#62655f');g.addColorStop(1,'#34363a');k.fillStyle=g;k.fill();
 k.save();mass();k.clip();
 for(let i=0;i<60;i++){const x=hash(i,3)*160,y=hash(i,9)*128,r=7+hash(i,5)*20;k.fillStyle=hash(i,7)>.5?'rgba(255,255,235,.11)':'rgba(0,0,12,.17)';k.beginPath();for(let j=0;j<5;j++){const an=j*1.2566+hash(i,j),rr=r*(.6+hash(j,i)*.6);k[j?'lineTo':'moveTo'](x+Math.cos(an)*rr,y+Math.sin(an)*rr*.8)}k.closePath();k.fill()}
 k.strokeStyle='rgba(10,10,14,.5)';k.lineWidth=1;for(let i=0;i<9;i++){let x=hash(i,1)*160,y=hash(i,2)*70;k.beginPath();k.moveTo(x,y);for(let j=0;j<4;j++){x+=(hash(i,j+4)-.5)*14;y+=6+hash(j,i)*8;k.lineTo(x,y)}k.stroke()}
 for(let i=0;i<26;i++){k.fillStyle=`rgba(${70+hash(i,4)*40|0},${130+hash(i,6)*50|0},60,.55)`;k.beginPath();k.arc(20+hash(i,8)*120,16+hash(i,3)*26+Math.abs(80-(20+hash(i,8)*120))*.28,5+hash(i,2)*8,0,7);k.fill()}
 k.restore();k.strokeStyle='#1c1d20';k.lineWidth=2;mass();k.stroke();
 const mouth=()=>{k.beginPath();k.moveTo(54,130);k.lineTo(54,92);k.bezierCurveTo(54,56,106,56,106,92);k.lineTo(106,130);k.closePath()};
 mouth();g=k.createRadialGradient(80,128,4,80,110,50);g.addColorStop(0,'#3a2a2e');g.addColorStop(.5,'#120c16');g.addColorStop(1,'#030206');k.fillStyle=g;k.fill();
 k.lineWidth=6;k.strokeStyle='#3c3b3e';mouth();k.stroke();k.lineWidth=1.5;k.strokeStyle='rgba(255,255,240,.35)';k.beginPath();k.moveTo(51,92);k.bezierCurveTo(51,52,109,52,109,92);k.stroke();
 k.fillStyle='#1b1620';for(let i=0;i<7;i++){const x=58+i*7.4,h=6+hash(i,11)*10;k.beginPath();k.moveTo(x-3,66+Math.abs(i-3)*3);k.lineTo(x+3,66+Math.abs(i-3)*3);k.lineTo(x,76+h+Math.abs(i-3)*3);k.fill()}
 k.fillStyle='#5a3a1e';k.fillRect(48,70,7,60);k.fillRect(105,70,7,60);k.fillRect(44,68,72,7);k.fillStyle='#7d5632';k.fillRect(48,70,3,60);k.fillRect(105,70,3,60);k.fillRect(44,68,72,3);
 k.strokeStyle='#4f8a3a';k.lineWidth=1.5;for(let i=0;i<8;i++){const x=46+i*9;k.beginPath();k.moveTo(x,75);k.quadraticCurveTo(x+3,85+hash(i,2)*8,x,92+hash(i,3)*12);k.stroke()}
 return c})();
function drawCave(t){const x=(W-7)*T;ctx.drawImage(caveSpr,x,0);
 for(const [lx,ly] of [[40,102],[120,102]]){const fl=.8+.2*Math.sin(t*9+lx),px=x+lx+(lx<80?10:-10),py=ly;const g=ctx.createRadialGradient(px,py,1,px,py,34*fl);g.addColorStop(0,'rgba(255,180,70,.55)');g.addColorStop(1,'rgba(255,150,40,0)');ctx.fillStyle=g;ctx.fillRect(px-36,py-36,72,72);
  ctx.fillStyle='#3a2a1a';ctx.fillRect(px-2,py,4,9);ctx.fillStyle='#ffb43a';ctx.beginPath();ctx.ellipse(px,py-2,3*fl,6*fl,0,0,7);ctx.fill();ctx.fillStyle='#fff2a8';ctx.fillRect(px-1,py-3,2,4)}
 const g=ctx.createRadialGradient(x+80,4*T-4,2,x+80,4*T-4,34);g.addColorStop(0,'rgba(255,170,60,'+(.22+.05*Math.sin(t*3))+')');g.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g;ctx.fillRect(x+40,4*T-40,80,50)}
// ป้ายบอกทาง (จุดเดินทางไปเมือง): เสาไม้ + ป้ายลูกศรชี้ พร้อมชื่อปลายทาง — ยืนใกล้ ๆ แล้วกด E/⚔️ เพื่อเดินทาง
const SIGN_FONT='bold 11px system-ui,"Noto Sans Thai",sans-serif';
function signBoard(label,y,dirR,wood,near){ctx.font=SIGN_FONT;const w=Math.max(54,ctx.measureText(label).width+22),tip=11,x0=-w/2-(dirR?0:tip),x1=w/2+(dirR?tip:0),h=22;
 ctx.save();ctx.translate(0,y);ctx.rotate(dirR?-.035:.035);
 ctx.beginPath();if(dirR){ctx.moveTo(x0,-h/2);ctx.lineTo(x1-tip,-h/2);ctx.lineTo(x1,0);ctx.lineTo(x1-tip,h/2);ctx.lineTo(x0,h/2)}else{ctx.moveTo(x1,-h/2);ctx.lineTo(x0+tip,-h/2);ctx.lineTo(x0,0);ctx.lineTo(x0+tip,h/2);ctx.lineTo(x1,h/2)}ctx.closePath();
 const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,wood[0]);g.addColorStop(1,wood[1]);ctx.fillStyle=g;ctx.fill();ctx.lineJoin='round';ctx.strokeStyle=near&&dirR?'#ffe27a':'#2a1808';ctx.lineWidth=near&&dirR?2.4:1.6;ctx.stroke();
 ctx.strokeStyle='rgba(40,20,8,.28)';ctx.lineWidth=1;for(const o of [-4,3]){ctx.beginPath();ctx.moveTo(x0+4,o);ctx.lineTo(x1-4,o);ctx.stroke()}
 ctx.fillStyle='#3a3d44';for(const nx of [x0+6,x1-(dirR?tip+4:6)]){ctx.beginPath();ctx.arc(nx,-h/2+5,1.3,0,7);ctx.fill();ctx.beginPath();ctx.arc(nx,h/2-5,1.3,0,7);ctx.fill()}
 ctx.textAlign='center';ctx.textBaseline='middle';const tx=(x0+x1)/2+(dirR?-3:3);ctx.fillStyle='rgba(255,236,190,.35)';ctx.fillText(label,tx,.8);ctx.fillStyle='#2a1606';ctx.fillText(label,tx,0);ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.restore()}
const SP={x:(W-4)*T+16,y:((H>>1)-2)*T+16}; // เสาป้ายบอกทางข้างประตูเมือง (ตกแต่ง)
function drawSign(t){const x=SP.x,by=SP.y+14,near=Math.hypot(P.x-WC.x,P.y-WC.y)<170;ctx.save();ctx.translate(x,by);
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(5,2,30,7,0,0,7);ctx.fill();
 for(const [sx,sy,sr,col] of [[-12,1,6,'#7c7c86'],[11,2,5,'#6a6a74'],[0,3,8,'#8a8a94'],[-3,-1,5,'#6e6e78']]){ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(sx,sy,sr,sr*.55,0,0,7);ctx.fill()}
 const pg=ctx.createLinearGradient(-5,0,5,0);pg.addColorStop(0,'#4a2e18');pg.addColorStop(.5,'#8a5a30');pg.addColorStop(1,'#3a2410');ctx.fillStyle=pg;ctx.fillRect(-4,-92,8,94);ctx.strokeStyle='#241408';ctx.lineWidth=1.4;ctx.strokeRect(-4,-92,8,94);
 ctx.strokeStyle='rgba(30,16,6,.5)';ctx.lineWidth=1;for(const gy of [-80,-62,-44,-28,-12]){ctx.beginPath();ctx.moveTo(-3,gy);ctx.lineTo(1,gy+7);ctx.stroke()}
 ctx.fillStyle='#6a4220';ctx.beginPath();ctx.moveTo(-6,-91);ctx.lineTo(0,-98);ctx.lineTo(6,-91);ctx.closePath();ctx.fill();ctx.strokeStyle='#241408';ctx.stroke();
 signBoard('ทุ่งหญ้า',-50,false,['#a67a48','#74502a'],false);
 signBoard('เมืองเอลโดเรีย',-74,true,['#c0884a','#85572c'],near);
 ctx.restore()}
// ประตูเมือง = แถบเรืองแสงที่ขอบแมพด้านขวา เดินชนขอบเพื่อเข้าเมือง (เหมือนทางออกซ้ายสุดของเมือง)
function drawGate(t){const my=H>>1,x=(W-1)*T,y=(my-1)*T,h=3*T,u=.5+.5*Math.sin(t*2.4),near=Math.hypot(P.x-WC.x,P.y-WC.y)<150;
 const g=ctx.createLinearGradient(x-84,0,x+T,0);g.addColorStop(0,'rgba(120,200,255,0)');g.addColorStop(1,'rgba(150,220,255,'+(.3+.16*u+(near?.14:0))+')');ctx.fillStyle=g;ctx.fillRect(x-84,y,84+T,h);
 ctx.fillStyle='rgba(110,190,255,'+(.5+.14*u)+')';ctx.fillRect(x,y,T,h);
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=2.6;
 for(let i=0;i<3;i++){const ph=((t*.9+i/3)%1),cx=x-60+ph*52;ctx.strokeStyle='rgba(255,255,255,'+(Math.sin(ph*Math.PI)*.9)+')';ctx.beginPath();ctx.moveTo(cx,y+h/2-10);ctx.lineTo(cx+9,y+h/2);ctx.lineTo(cx,y+h/2+10);ctx.stroke()}ctx.restore();
 ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='right';ctx.shadowColor='rgba(0,0,0,.9)';ctx.shadowBlur=0;ctx.shadowOffsetY=1;ctx.shadowOffsetX=1;ctx.fillStyle='#fff';ctx.fillText('เมืองเอลโดเรีย ▶',x+T-2,y-6);ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.textAlign='left'}
