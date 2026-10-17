// =====================================================================
// fix148 (v5.05) — ⚔️ อาวุธประจำอาชีพหน้าตาไม่ซ้ำกันทุกระดับ (ผู้เล่นแจ้ง: "อาวุธเหมือนกันเกินไป · สไนแค่เปลี่ยนสีกล้องซูม")
//  ต้นเหตุ: fix25/fix27 วาดอาวุธ 8 อาชีพ (นินจา/สไนเปอร์/พาลาดิน/นักบวช/เนโคร/มังค์/ดรากูน/ซัมมอนเนอร์) ด้วยรูปทรงเดียว
//   ทุก 11 ระดับ ต่างกันแค่สีจุดเล็ก ๆ · ส่วนดาบ/คทา/ธนูอาชีพ (FLT27) ย้อมสีเดียวทับทุกระดับจนดูเหมือนกันหมด
//  แก้: วาดใหม่ตามธีมเซ็ตทั้ง 11 ระดับ (นักล่าเงา → ทวยเทพนิรันดร์) รูปทรงต่างกันจริง (ใบ/โกร่ง/หัวคทา/ลำกล้อง/กล้อง ฯลฯ)
//   · ใช้ฟังก์ชันเดียวกันทั้ง ไอคอนในกระเป๋า/ร้าน · ตอนถือ · ตอนเก็บหลัง · ตอนโจมตี · ผู้เล่นคนอื่นเห็น (ห่อ wpn25/rifle27/knuckle27/drawBow6 เดิม)
//   · ดาบ/คทา/ธนูอาชีพ: เลิกย้อมสีเดียว → ใช้สีจริงของระดับ (ทรงต่างกันอยู่แล้ว) + เรืองแสงสีอาชีพ
//   · ไม่แตะค่าพลัง สูตรหลอม หรือระบบเดิม เปลี่ยนแค่หน้าตา
// =====================================================================
try{
const PAL148=[
 {m:'#b4b8cc',d:'#3a3a4e',h:'#1e1a2a',a:'#a070ff',g:'160,110,255'},
 {m:'#d8f0b0',d:'#4a7a32',h:'#5a3a1e',a:'#8aff6a',g:'140,240,110'},
 {m:'#ffd2a0',d:'#b8301a',h:'#3a0a06',a:'#ff7a2a',g:'255,110,40'},
 {m:'#f4fcff',d:'#6aa8d0',h:'#24405a',a:'#8ae8ff',g:'160,230,255'},
 {m:'#eee8ff',d:'#6a5aa8',h:'#221a40',a:'#d8c8ff',g:'200,180,255'},
 {m:'#fff4c8',d:'#d6a52a',h:'#5a3a08',a:'#fff2a0',g:'255,230,140'},
 {m:'#d0f6e4',d:'#2a8a6a',h:'#3a2a14',a:'#4affc0',g:'80,255,190'},
 {m:'#ffb070',d:'#4a3a34',h:'#1a1210',a:'#ff5a1a',g:'255,90,20'},
 {m:'#cfc6e0',d:'#3a2e4e',h:'#120c1a',a:'#7affd0',g:'120,255,200'},
 {m:'#ffffff',d:'#e0c050',h:'#f0e0b0',a:'#fff6a0',g:'255,246,170'},
 {m:'#ffe6f6',d:'#c83a9a',h:'#3a0a2a',a:'#ff7ad8',g:'255,120,216'}];
const T148=t=>Math.max(0,Math.min(10,(t|0)%11));
const pal148=t=>PAL148[T148(t)];
const tNow148=()=>performance.now()/1000;
/* วาดเรืองแสง */
function gl148(k,x,y,r,rgb,a){k.save();k.globalCompositeOperation='lighter';const g=k.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+(a==null?.55:a)+')');g.addColorStop(1,'rgba('+rgb+',0)');k.fillStyle=g;k.fillRect(x-r,y-r,r*2,r*2);k.restore()}
function lg148(k,x0,y0,x1,y1,cs){const g=k.createLinearGradient(x0,y0,x1,y1);cs.forEach((c,i)=>g.addColorStop(i/(cs.length-1),c));return g}
function gem148(k,x,y,r,c){k.save();k.fillStyle=c;k.strokeStyle='rgba(0,0,0,.6)';k.lineWidth=.8;k.beginPath();k.moveTo(x,y-r);k.lineTo(x+r*.8,y);k.lineTo(x,y+r);k.lineTo(x-r*.8,y);k.closePath();k.fill();k.stroke();k.fillStyle='rgba(255,255,255,.75)';k.beginPath();k.moveTo(x,y-r*.7);k.lineTo(x-r*.4,y-r*.05);k.lineTo(x,y-r*.15);k.closePath();k.fill();k.restore()}
function poly148(k,pts,fill,stroke,lw){k.beginPath();pts.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.closePath();if(fill){k.fillStyle=fill;k.fill()}if(stroke){k.strokeStyle=stroke;k.lineWidth=lw||1;k.stroke()}}
function star148(k,x,y,r,n,c,inner){k.fillStyle=c;k.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,rr=i%2?r*(inner||.42):r;k.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}k.closePath();k.fill()}
function wrap148(k,x,y0,y1,w,base,band){k.fillStyle=base;k.fillRect(x-w/2,y0,w,y1-y0);k.strokeStyle=band;k.lineWidth=.9;for(let y=y0+1.5;y<y1;y+=2.6){k.beginPath();k.moveTo(x-w/2,y);k.lineTo(x+w/2,y+1.3);k.stroke()}}

// ---------- นินจา: คาตานะ 11 แบบ ----------
function ninja148(k,t){const p=pal148(t),tt=T148(t),now=tNow148();k.lineCap='round';k.lineJoin='round';
 const L=[30,31,32,30,33,34,31,33,32,35,36][tt],cv=[3,4,4,1,8,3,4,3,5,2,6][tt],w=[2.2,3.4,2.6,2.6,2.4,3.2,2.2,3,2.4,3,3.4][tt];
 const bladeG=tt===3?lg148(k,-w,0,w,0,['rgba(170,230,255,.75)','rgba(255,255,255,.95)','rgba(120,190,240,.7)']):tt===8?lg148(k,-w,0,w,0,['rgba(140,120,170,.35)','rgba(230,220,255,.75)','rgba(90,80,120,.3)']):lg148(k,-w,0,w,0,[p.d,p.m,p.d]);
 if(tt===6){k.save();k.translate(4.5,1);k.rotate(.18);k.fillStyle=lg148(k,-2,0,2,0,[p.d,p.m,p.d]);k.strokeStyle='#0e1a14';k.lineWidth=.8;k.beginPath();k.moveTo(-1.4,-2);k.quadraticCurveTo(-2.4,-12,1,-21);k.quadraticCurveTo(1.6,-12,1.4,-2);k.closePath();k.fill();k.stroke();k.fillStyle=p.h;k.fillRect(-1,-2,2,7);k.restore()}
 /* ใบดาบ */
 k.fillStyle=bladeG;k.strokeStyle=tt===9?'#c8a040':'#141824';k.lineWidth=1;k.beginPath();k.moveTo(-w*.6,-2);
 if(tt===1){k.quadraticCurveTo(-w*1.6,-L*.5,cv*.3,-L);k.quadraticCurveTo(w*1.4,-L*.5,w*.6,-2)}
 else if(tt===4){k.quadraticCurveTo(-w-cv*.4,-L*.55,cv,-L);k.quadraticCurveTo(cv+3,-L+2,cv+1.5,-L+4);k.quadraticCurveTo(w-cv*.2,-L*.5,w*.6,-2)}
 else if(tt===10){k.quadraticCurveTo(-w-2,-L*.35,-1,-L*.6);k.quadraticCurveTo(1,-L*.8,cv*.5,-L);k.quadraticCurveTo(w+1.5,-L*.75,w*.4,-L*.55);k.quadraticCurveTo(w+2,-L*.3,w*.6,-2)}
 else{k.quadraticCurveTo(-w-cv*.2,-L*.55,cv*.35,-L);k.quadraticCurveTo(w+cv*.05,-L*.5,w*.6,-2)}
 k.closePath();k.fill();k.stroke();
 /* ลายเฉพาะ */
 if(tt===0){k.strokeStyle='rgba(170,120,255,.9)';k.lineWidth=.8;k.beginPath();k.moveTo(w*.4,-4);k.quadraticCurveTo(w*.6,-L*.5,cv*.3,-L+2);k.stroke()}
 if(tt===1){k.strokeStyle='#2e5a1e';k.lineWidth=.7;k.beginPath();k.moveTo(0,-3);k.lineTo(cv*.25,-L+3);k.stroke();for(let i=1;i<5;i++){const y=-i*L/5.5;k.beginPath();k.moveTo(i*.08,y);k.lineTo(-2,y+2);k.moveTo(i*.08,y);k.lineTo(2,y+2);k.stroke()}
  k.strokeStyle='#6ab83a';k.lineWidth=1;k.beginPath();k.moveTo(-2,3);k.quadraticCurveTo(3,6,-2,9);k.stroke();k.fillStyle='#8aff6a';k.beginPath();k.ellipse(2.4,5,1.6,.8,.6,0,7);k.fill()}
 if(tt===2){k.fillStyle='#ffb030';for(let i=0;i<5;i++){const y=-6-i*L/6.5,h=3+(i%2)*1.5+Math.sin(now*9+i)*.8;k.beginPath();k.moveTo(-w*.7-.4,y);k.lineTo(-w-h,y-2.2);k.lineTo(-w*.7,y-3.4);k.fill()}gl148(k,0,-L*.5,14,p.g,.35)}
 if(tt===3){k.strokeStyle='rgba(255,255,255,.9)';k.lineWidth=.6;for(let i=1;i<6;i++){k.beginPath();k.moveTo(-w*.6,-i*L/6.2);k.lineTo(w*.6,-i*L/6.2-2.4);k.stroke()}gl148(k,0,-L*.6,12,p.g,.4)}
 if(tt===4){k.strokeStyle='#fff';k.lineWidth=.6;k.beginPath();k.moveTo(w*.2,-5);k.quadraticCurveTo(w*.2-cv*.3,-L*.55,cv-.5,-L+1.5);k.stroke()}
 if(tt===5){k.fillStyle='#d6a52a';k.beginPath();k.moveTo(-w*.6,-2);k.quadraticCurveTo(-w-.6,-L*.55,cv*.35,-L);k.lineTo(-w*.2,-L*.5);k.closePath();k.fill();k.fillStyle='#8a5a10';for(let i=1;i<4;i++)k.fillRect(-.4,-i*L/4.2,.9,2.2)}
 if(tt===7){k.fillStyle='#2a1e1a';for(let i=0;i<6;i++){const y=-5-i*L/7;k.beginPath();k.moveTo(-w*.6,y);k.lineTo(-w-2.4,y-1.2);k.lineTo(-w*.6,y-3);k.fill()}k.strokeStyle='#ff6a1a';k.lineWidth=.8;k.beginPath();k.moveTo(0,-4);k.lineTo(1,-10);k.lineTo(-.5,-15);k.lineTo(.8,-22);k.lineTo(0,-28);k.stroke();gl148(k,0,-L*.4,10,p.g,.3)}
 if(tt===8){k.save();k.globalCompositeOperation='lighter';k.strokeStyle='rgba(120,255,200,.55)';k.lineWidth=1.2;for(let i=0;i<3;i++){const ph=now*3+i*2;k.beginPath();k.moveTo(0,-8-i*7);k.quadraticCurveTo(-6+Math.sin(ph)*2,-12-i*7,-9,-6-i*7+Math.cos(ph)*2);k.stroke()}k.restore();gl148(k,0,-L*.5,14,p.g,.3)}
 if(tt===9){k.save();k.globalCompositeOperation='lighter';k.strokeStyle='rgba(255,246,170,.6)';k.lineWidth=.8;for(let i=0;i<6;i++){const a=i*Math.PI/3+now;k.beginPath();k.moveTo(0,-L*.6);k.lineTo(Math.cos(a)*10,-L*.6+Math.sin(a)*10);k.stroke()}k.restore();gl148(k,0,-L*.6,15,p.g,.5)}
 if(tt===10){gem148(k,0,-L*.45,2,'#ff7ad8');gl148(k,0,-L*.55,16,p.g,.45)}
 /* โกร่ง */
 k.fillStyle=tt===9?'#ffe08a':p.a;k.strokeStyle='#0e0e16';k.lineWidth=.8;
 if(tt===0){k.fillRect(-3.4,-3.4,6.8,2.2);k.strokeRect(-3.4,-3.4,6.8,2.2)}
 else if(tt===1){k.fillStyle='#4a7a32';k.beginPath();k.ellipse(-3,-2.6,3,1.4,-.3,0,7);k.ellipse(3,-2.6,3,1.4,.3,0,7);k.fill()}
 else if(tt===2){for(const s of [-1,1]){k.beginPath();k.moveTo(0,-2);k.quadraticCurveTo(s*5,-1,s*6,-6);k.quadraticCurveTo(s*3,-3,0,-3.6);k.fill()}}
 else if(tt===3){star148(k,0,-2.4,4.4,6,'#bff0ff',.5)}
 else if(tt===4){k.beginPath();k.arc(0,-2.4,4,0,7);k.fill();k.fillStyle=p.h;k.beginPath();k.arc(1.4,-3,3.2,0,7);k.fill()}
 else if(tt===5){star148(k,0,-2.4,5,12,'#ffd23a',.6);k.fillStyle='#fff6c8';k.beginPath();k.arc(0,-2.4,2,0,7);k.fill()}
 else if(tt===6){for(let i=0;i<4;i++){k.beginPath();k.ellipse(Math.cos(i*1.57)*2.6,-2.4+Math.sin(i*1.57)*1.2,2,1.1,i*1.57,0,7);k.fill()}}
 else if(tt===7){poly148(k,[[-5,-2],[-3,-4.6],[0,-3.4],[3,-5],[5,-2],[2,-1],[-2,-1]],'#3a2e2a','#0e0e16')}
 else if(tt===8){k.strokeStyle=p.a;k.lineWidth=1.4;k.beginPath();k.arc(0,-2.4,3.6,0,7);k.stroke();k.fillStyle='#e8e0d0';k.beginPath();k.arc(0,-2.4,1.6,0,7);k.fill()}
 else if(tt===9){for(const s of [-1,1]){k.beginPath();k.moveTo(0,-2.6);k.quadraticCurveTo(s*6,-6,s*9,-2);k.quadraticCurveTo(s*5,-1,0,-1.6);k.fill()}}
 else{for(let i=0;i<5;i++){k.save();k.translate(0,-2.4);k.rotate(i*1.2566);k.fillStyle=i%2?'#ffb0e8':'#ff7ad8';k.beginPath();k.ellipse(0,-2.6,1.5,2.8,0,0,7);k.fill();k.restore()}gem148(k,0,-2.4,1.4,'#fff')}
 /* ด้าม + พู่ */
 wrap148(k,0,-1,10,3.2,p.h,tt===9?'#c8a040':p.a);k.fillStyle=tt>=5?'#ffd23a':'#c8c8d0';k.fillRect(-1.8,9.6,3.6,1.6);
 if(tt>=4){k.strokeStyle=['#d8c8ff','#ffd23a','#4affc0','#ff5a1a','#7affd0','#fff6a0','#ff7ad8'][tt-4];k.lineWidth=1;k.beginPath();k.moveTo(0,11);k.quadraticCurveTo(2+Math.sin(now*3),15,1,18);k.stroke()}}

// ---------- สไนเปอร์: ไรเฟิล 11 แบบ (แนวนอน ปากกระบอกชี้ +x) ----------
function sniper148(k,t,pull){const p=pal148(t),tt=T148(t),now=tNow148();k.lineJoin='round';k.lineCap='round';
 const bl=[24,26,28,25,30,27,26,28,29,31,30][tt];
 /* พานท้าย */
 const wood=['#3a2414','#5a3a1e','#4a1a10','#5a7a94','#2e2648','#7a5418','#2e4a2e','#2a201c','#1e1a26','#e8e0c8','#4a1a3a'][tt];
 k.strokeStyle='#100a06';k.lineWidth=1;
 if(tt===0)poly148(k,[[-14,-3],[0,-3],[0,3],[-10,6],[-16,4]],wood,'#100a06');
 else if(tt===1){poly148(k,[[-15,-3],[0,-3],[0,3],[-8,4],[-12,7],[-17,5]],wood,'#100a06');k.strokeStyle='#6ab83a';k.lineWidth=1.2;k.beginPath();k.moveTo(-14,0);k.quadraticCurveTo(-8,-5,-3,0);k.quadraticCurveTo(-8,4,-13,3);k.stroke();k.fillStyle='#8aff6a';k.beginPath();k.ellipse(-6,-3.6,2,1,-.5,0,7);k.fill()}
 else if(tt===2){poly148(k,[[-15,-4],[0,-3],[0,3],[-9,5],[-13,9],[-17,6],[-16,1]],wood,'#100a06');k.fillStyle='#ffb030';for(let i=0;i<3;i++){k.beginPath();k.moveTo(-15+i*4,-3.6);k.lineTo(-13+i*4,-7-Math.sin(now*8+i)*1.2);k.lineTo(-11+i*4,-3.4);k.fill()}}
 else if(tt===3){poly148(k,[[-16,-2],[0,-3],[0,3],[-5,3],[-9,6],[-13,6],[-16,3]],'rgba(170,220,255,.8)','#24405a');k.strokeStyle='rgba(255,255,255,.8)';k.lineWidth=.6;k.beginPath();k.moveTo(-14,-1);k.lineTo(-9,4);k.moveTo(-9,-2);k.lineTo(-5,2);k.stroke()}
 else if(tt===4){k.strokeStyle=wood;k.lineWidth=2.4;k.beginPath();k.moveTo(0,-2);k.lineTo(-16,-2);k.moveTo(0,2);k.lineTo(-14,6);k.moveTo(-16,-2);k.quadraticCurveTo(-19,2,-14,6);k.stroke();k.fillStyle='#d8c8ff';k.beginPath();k.arc(-11,2,2,0,7);k.fill()}
 else if(tt===5){poly148(k,[[-15,-3],[0,-3],[0,3],[-9,5],[-17,5],[-17,-1]],wood,'#3a2408');k.fillStyle='#ffd23a';k.fillRect(-15,-1,12,1.2);k.fillRect(-15,2,10,1);star148(k,-12,.6,1.8,5,'#fff2a0')}
 else if(tt===6){poly148(k,[[-15,-3],[0,-3],[0,3],[-6,6],[-14,6],[-17,2]],wood,'#0e1a0e');k.fillStyle='#4affc0';for(let i=0;i<3;i++){k.beginPath();k.ellipse(-13+i*4,4,1.6,.8,.4,0,7);k.fill()}}
 else if(tt===7){poly148(k,[[-16,-4],[-6,-4],[0,-3],[0,3],[-7,6],[-12,5],[-17,7],[-15,1]],wood,'#0a0606');k.strokeStyle='#ff5a1a';k.lineWidth=.8;k.beginPath();k.moveTo(-14,-2);k.lineTo(-10,1);k.lineTo(-12,4);k.moveTo(-7,-2);k.lineTo(-5,2);k.stroke()}
 else if(tt===8){k.globalAlpha=.85;poly148(k,[[-14,-3],[0,-3],[0,3],[-8,5],[-16,4]],wood,'#000');k.globalAlpha=1;k.fillStyle='#e8e0d0';k.beginPath();k.arc(-9,.6,2.2,0,7);k.fill();k.fillStyle='#0a0612';k.fillRect(-10,0,.9,.9);k.fillRect(-8.6,0,.9,.9)}
 else if(tt===9){poly148(k,[[-15,-3],[0,-3],[0,3],[-8,5],[-16,4]],wood,'#a08040');for(const s of [-1,1]){k.fillStyle='#ffffff';k.beginPath();k.moveTo(-10,s*2);k.quadraticCurveTo(-18,s*8,-22,s*3);k.quadraticCurveTo(-16,s*3,-10,s*.5);k.fill()}}
 else{poly148(k,[[-15,-4],[0,-3],[0,3],[-8,6],[-14,5],[-18,1]],wood,'#1a0412');k.strokeStyle='#ff7ad8';k.lineWidth=.9;k.beginPath();k.arc(-10,1,2.6,0,7);k.stroke();gem148(k,-10,1,1.4,'#ffe6f6')}
 /* ตัวปืน + ลำกล้อง */
 const recv=tt===3?lg148(k,0,-3,0,3,['#e8f8ff','#8ac8ee','#3a6a8a']):lg148(k,0,-3,0,3,['#2a2a34',p.m,'#1a1a22']);
 k.fillStyle=recv;k.strokeStyle='#0e0e14';k.lineWidth=1;k.fillRect(0,-3,10,6);k.strokeRect(0,-3,10,6);
 const bh=tt===4?2.2:tt===7?3.6:2.8;k.fillStyle=lg148(k,0,-bh/2,0,bh/2,['#3a3a46',tt===9?'#fff6d8':p.m,'#22222a']);k.fillRect(10,-bh/2-.4,bl-10,bh);k.strokeRect(10,-bh/2-.4,bl-10,bh);
 if(tt===6){k.fillStyle='#2a8a6a';for(let x=12;x<bl-2;x+=4)k.fillRect(x,-1.6,1.4,2.8)}
 if(tt===10){k.fillStyle='#c83a9a';k.fillRect(11,-2.2,bl-12,.9)}
 /* ปากกระบอก */
 if(tt===0){k.fillStyle='#1a1a22';k.fillRect(bl,-1.2,3,2)}
 else if(tt===1){k.fillStyle='#4a7a32';k.beginPath();k.moveTo(bl,-2);k.quadraticCurveTo(bl+5,-4,bl+6,0);k.quadraticCurveTo(bl+5,4,bl,2);k.fill()}
 else if(tt===2){k.fillStyle='#3a0a06';k.fillRect(bl,-2.6,5,4.4);k.fillStyle='#ff7a2a';for(let i=0;i<3;i++)k.fillRect(bl+.8+i*1.5,-2.6,.8,4.4);gl148(k,bl+6,-.4,6,p.g,.5)}
 else if(tt===3){poly148(k,[[bl,-2],[bl+7,-.4],[bl,1.6]],'rgba(200,240,255,.9)','#24405a',.7)}
 else if(tt===4){k.fillStyle='#14102a';k.fillRect(bl,-2.4,8,4.2);k.strokeStyle='#d8c8ff';k.lineWidth=.6;k.strokeRect(bl,-2.4,8,4.2)}
 else if(tt===5){k.fillStyle='#d6a52a';k.fillRect(bl,-2.4,4,4.4);k.fillStyle='#fff2a0';k.fillRect(bl+1,-3,1.2,5.6)}
 else if(tt===6){k.fillStyle='#2a8a6a';k.beginPath();k.arc(bl+2,-.4,2.6,0,7);k.fill();k.fillStyle='#4affc0';k.beginPath();k.arc(bl+2,-.4,1.1,0,7);k.fill()}
 else if(tt===7){k.fillStyle='#2a1e1a';k.fillRect(bl,-2.8,4,4.8);poly148(k,[[bl+4,-2.8],[bl+9,-.4],[bl+4,2]],'#3a2e2a','#000',.6);k.fillStyle='#ff5a1a';k.fillRect(bl+1,-.9,2,1.2)}
 else if(tt===8){k.save();k.globalCompositeOperation='lighter';k.strokeStyle='rgba(120,255,200,.6)';k.lineWidth=1;for(let i=0;i<3;i++){k.beginPath();k.moveTo(bl,-.4);k.quadraticCurveTo(bl+4,-4+i*3+Math.sin(now*4+i),bl+9,-2+i*2);k.stroke()}k.restore()}
 else if(tt===9){k.fillStyle='#fff';k.fillRect(bl,-1.6,2,2.4);star148(k,bl+4,-.4,3.4,4,'#fff6a0')}
 else{k.fillStyle='#ffe6f6';k.beginPath();k.moveTo(bl,-2.6);k.lineTo(bl+6,-.4);k.lineTo(bl,1.8);k.closePath();k.fill();gl148(k,bl+4,-.4,7,p.g,.55)}
 /* กล้อง/ศูนย์เล็ง */
 if(tt===0){k.fillStyle='#1a1a22';k.fillRect(3,-5,1.6,2);k.fillRect(bl-3,-4.6,1.4,1.8)}
 else if(tt===1){k.fillStyle='#3a2a14';k.fillRect(4,-6.4,8,2.6);k.fillStyle='#8aff6a';k.beginPath();k.arc(12,-5.1,1.4,0,7);k.fill();k.strokeStyle='#6ab83a';k.lineWidth=.7;k.beginPath();k.moveTo(5,-6.4);k.quadraticCurveTo(8,-9,11,-6.4);k.stroke()}
 else if(tt===2){k.fillStyle='#2a0a06';k.fillRect(2,-7.4,14,3.6);k.fillStyle='#ff7a2a';k.beginPath();k.arc(16,-5.6,2,0,7);k.fill();k.fillStyle='#ffb030';k.beginPath();k.moveTo(6,-7.4);k.lineTo(8,-10.6);k.lineTo(10,-7.4);k.fill()}
 else if(tt===3){poly148(k,[[3,-4],[6,-9],[13,-9],[16,-4]],'rgba(200,240,255,.85)','#24405a',.7);k.fillStyle='#fff';k.fillRect(7,-8,1,3)}
 else if(tt===4){k.fillStyle='#221a40';k.fillRect(1,-7.2,18,3.4);k.fillStyle='#d8c8ff';k.beginPath();k.arc(19,-5.5,2.2,0,7);k.fill();k.fillStyle='#221a40';k.beginPath();k.arc(19.8,-6,1.8,0,7);k.fill()}
 else if(tt===5){k.fillStyle='#d6a52a';k.fillRect(3,-7.6,12,3.8);k.fillStyle='#8a5a10';k.fillRect(5,-4,1.6,1.4);k.fillRect(11,-4,1.6,1.4);k.fillStyle='#fff6c8';k.beginPath();k.arc(15,-5.7,2,0,7);k.fill()}
 else if(tt===6){k.fillStyle='#1a3a2a';k.fillRect(2,-6.8,6,2.8);k.fillRect(10,-6.8,6,2.8);k.fillStyle='#4affc0';k.beginPath();k.arc(8,-5.4,1.2,0,7);k.arc(16,-5.4,1.2,0,7);k.fill()}
 else if(tt===7){poly148(k,[[2,-4],[3,-8],[8,-9],[14,-8],[16,-4]],'#3a2e2a','#000',.7);k.fillStyle='#ff5a1a';k.beginPath();k.arc(15,-6,1.6,0,7);k.fill()}
 else if(tt===8){k.strokeStyle='#7affd0';k.lineWidth=1;k.beginPath();k.arc(9,-7.4,3.4,0,7);k.stroke();k.beginPath();k.moveTo(9,-11);k.lineTo(9,-3.8);k.moveTo(5.4,-7.4);k.lineTo(12.6,-7.4);k.stroke();k.fillStyle='#120c1a';k.fillRect(8,-4.4,2,1.4)}
 else if(tt===9){k.fillStyle='#f0e0b0';k.fillRect(2,-7.6,16,3.6);k.fillStyle='#fff';k.beginPath();k.arc(18,-5.8,2.4,0,7);k.fill();gl148(k,18,-5.8,7,p.g,.6)}
 else{k.fillStyle='#3a0a2a';k.fillRect(2,-7.4,15,3.4);for(let i=0;i<2;i++){k.fillStyle='#ff7ad8';k.beginPath();k.arc(6+i*8,-5.7,1.4,0,7);k.fill()}k.strokeStyle='#ffb0e8';k.lineWidth=.8;k.beginPath();k.arc(17,-5.7,2.6,0,7);k.stroke()}
 /* ไกปืน + ซองกระสุน + ขาตั้ง/ดาบปลายปืน */
 k.fillStyle='#14141a';k.fillRect(5,2.8,1.6,3.4);
 if(tt===3){poly148(k,[[7,3],[11,3],[10,8],[7,7]],'rgba(170,230,255,.9)','#24405a',.6)}
 else if(tt===5||tt===10){k.fillStyle=tt===5?'#d6a52a':'#c83a9a';k.beginPath();k.arc(9,5.6,2.8,0,7);k.fill()}
 else if(tt>=2){k.fillStyle='#22222a';k.fillRect(7,3,3,tt>=6?5:4)}
 if(tt===4||tt===6||tt===9){k.strokeStyle='#22222a';k.lineWidth=1;k.beginPath();k.moveTo(bl-6,1.4);k.lineTo(bl-9,8);k.moveTo(bl-6,1.4);k.lineTo(bl-3,8);k.stroke()}
 if(tt===7||tt===10){poly148(k,[[bl-4,1.2],[bl+8,2.2],[bl-4,3.4]],tt===7?'#c8c0b8':'#ffe6f6','#1a1a22',.6)}
 if(tt===9||tt===10){gl148(k,8,0,16,p.g,.25)}
 if(pull>.6)gl148(k,bl+6,-.4,8,p.g,.7)}

// ---------- พาลาดิน: ดาบศักดิ์สิทธิ์ 11 แบบ ----------
function paladin148(k,t){const p=pal148(t),tt=T148(t);k.lineJoin='round';k.lineCap='round';
 const L=[28,30,32,31,32,34,30,32,31,35,36][tt],W=[3.6,4.6,4.2,3.4,4,5,4.4,5.2,3.6,4.4,4.8][tt];
 const bg=tt===3?lg148(k,-W,0,W,0,['rgba(160,220,255,.8)','#ffffff','rgba(110,180,230,.8)']):tt===8?lg148(k,-W,0,W,0,['rgba(120,100,150,.5)','rgba(240,230,255,.85)','rgba(80,70,110,.5)']):lg148(k,-W,0,W,0,[p.d,p.m,p.d]);
 k.fillStyle=bg;k.strokeStyle=tt===5||tt===9?'#6a4a10':'#14141e';k.lineWidth=1;k.beginPath();k.moveTo(-W,-2);
 if(tt===1){k.quadraticCurveTo(-W-2.4,-L*.55,0,-L-2);k.quadraticCurveTo(W+2.4,-L*.55,W,-2)}
 else if(tt===2){for(let i=0;i<=6;i++){const y=-2-i*(L-6)/6;k.lineTo(-W+(i%2?-1.4:0),y)}k.lineTo(0,-L-2);for(let i=6;i>=0;i--){const y=-2-i*(L-6)/6;k.lineTo(W+(i%2?1.4:0),y)}}
 else if(tt===3){k.lineTo(-W,-L+8);k.lineTo(-W*.4,-L+2);k.lineTo(0,-L-3);k.lineTo(W*.4,-L+2);k.lineTo(W,-L+8);k.lineTo(W,-2)}
 else if(tt===4){k.quadraticCurveTo(-W-4,-L*.6,-W*.2,-L);k.quadraticCurveTo(W*.8,-L+1,W*.9,-L+5);k.quadraticCurveTo(W-1,-L*.5,W,-2)}
 else if(tt===7){k.lineTo(-W-1,-L*.3);k.lineTo(-W+1,-L*.32);k.lineTo(-W-1.4,-L*.6);k.lineTo(-W+.6,-L*.62);k.lineTo(0,-L-1);k.lineTo(W-.6,-L*.62);k.lineTo(W+1.4,-L*.6);k.lineTo(W-1,-L*.32);k.lineTo(W+1,-L*.3);k.lineTo(W,-2)}
 else if(tt===10){k.lineTo(-W,-L*.55);k.quadraticCurveTo(-W-3,-L*.7,-1.4,-L*.8);k.lineTo(0,-L-3);k.lineTo(1.4,-L*.8);k.quadraticCurveTo(W+3,-L*.7,W,-L*.55);k.lineTo(W,-2)}
 else{k.lineTo(-W,-L+5);k.lineTo(0,-L);k.lineTo(W,-L+5);k.lineTo(W,-2)}
 k.closePath();k.fill();k.stroke();
 /* เส้นกลางใบ / ลวดลาย */
 k.strokeStyle=tt===0?'rgba(170,120,255,.8)':'rgba(255,255,255,.55)';k.lineWidth=.8;k.beginPath();k.moveTo(0,-4);k.lineTo(0,-L+6);k.stroke();
 if(tt===1){k.fillStyle='#4a7a32';for(let i=1;i<4;i++){k.beginPath();k.ellipse(-1.6,-i*L/4.2,1.4,.7,-.6,0,7);k.ellipse(1.6,-i*L/4.2-1.4,1.4,.7,.6,0,7);k.fill()}}
 if(tt===2)gl148(k,0,-L*.5,16,p.g,.4);
 if(tt===5){k.fillStyle='#fff6c8';k.fillRect(-.8,-L*.75,1.6,7);k.fillRect(-3,-L*.75+2,6,1.6)}
 if(tt===6){k.strokeStyle='#4affc0';k.lineWidth=.8;k.beginPath();k.moveTo(0,-5);k.bezierCurveTo(-3,-10,3,-14,0,-19);k.bezierCurveTo(-3,-23,2,-26,0,-28);k.stroke()}
 if(tt===7){k.strokeStyle='#ff5a1a';k.lineWidth=.8;k.beginPath();k.moveTo(-1,-5);k.lineTo(1.4,-11);k.lineTo(-1,-17);k.lineTo(1,-24);k.stroke();gl148(k,0,-L*.45,12,p.g,.35)}
 if(tt===8){gl148(k,0,-L*.5,16,p.g,.35);k.fillStyle='#120c1a';k.beginPath();k.arc(0,-L*.55,1.6,0,7);k.fill()}
 if(tt===9){gl148(k,0,-L*.55,20,p.g,.6)}
 if(tt===10){gem148(k,0,-L*.5,2.4,'#ff7ad8');gl148(k,0,-L*.55,18,p.g,.5)}
 /* โกร่ง */
 const gc=tt===9?'#ffe08a':p.a,gd='#2a1a08';k.lineWidth=.9;
 if(tt===0)poly148(k,[[-8,-3.4],[8,-3.4],[7,-.4],[-7,-.4]],'#4a4a5e',gd);
 else if(tt===1){k.fillStyle='#5a3a1e';k.fillRect(-8,-3.4,16,2.6);k.fillStyle='#8aff6a';k.beginPath();k.arc(-8,-2,1.6,0,7);k.arc(8,-2,1.6,0,7);k.fill()}
 else if(tt===2){for(const s of [-1,1])poly148(k,[[0,-3.6],[s*9,-6],[s*7,-2],[s*10,0],[0,-.6]],'#d84a2a',gd)}
 else if(tt===3){poly148(k,[[-10,-2],[-4,-4],[0,-3.4],[4,-4],[10,-2],[4,-.6],[-4,-.6]],'#bff0ff','#24405a')}
 else if(tt===4){k.fillStyle=gc;k.beginPath();k.arc(0,-2,6,Math.PI,0);k.lineTo(4,-1);k.arc(0,-1,4,0,Math.PI,true);k.closePath();k.fill();k.strokeStyle=gd;k.stroke()}
 else if(tt===5){for(const s of [-1,1]){k.fillStyle='#ffd23a';k.beginPath();k.moveTo(0,-3);k.quadraticCurveTo(s*8,-9,s*12,-4);k.quadraticCurveTo(s*7,-2,0,-1);k.fill();k.strokeStyle=gd;k.stroke()}}
 else if(tt===6)poly148(k,[[-9,-1],[-6,-5],[-2,-3],[0,-6],[2,-3],[6,-5],[9,-1],[0,-1.6]],'#2a8a6a',gd);
 else if(tt===7)poly148(k,[[-10,-1],[-8,-5],[-3,-3.6],[3,-3.6],[8,-5],[10,-1],[0,-.2]],'#3a2e2a','#000');
 else if(tt===8){k.strokeStyle=gc;k.lineWidth=1.6;k.beginPath();k.moveTo(-8,-1);k.quadraticCurveTo(0,-7,8,-1);k.stroke();k.fillStyle='#e8e0d0';k.beginPath();k.arc(0,-2.4,2.2,0,7);k.fill()}
 else if(tt===9){for(const s of [-1,1])for(let i=0;i<3;i++){k.fillStyle=i%2?'#fff6d8':'#ffffff';k.beginPath();k.ellipse(s*(4+i*3.2),-3-i*1.2,2.4,1.1,s*(.3+i*.25),0,7);k.fill()}k.strokeStyle='#ffe08a';k.lineWidth=.9;k.beginPath();k.ellipse(0,-L-4,5,1.6,0,0,7);k.stroke()}
 else{for(const s of [-1,1]){k.fillStyle='#ff7ad8';k.beginPath();k.moveTo(0,-3);k.quadraticCurveTo(s*7,-10,s*12,-6);k.quadraticCurveTo(s*8,-3,s*10,0);k.quadraticCurveTo(s*4,-1,0,-1);k.fill()}gem148(k,0,-2.2,2,'#ffffff')}
 /* ด้าม + หัวด้าม */
 wrap148(k,0,-.6,8,3,tt===9?'#f0e0b0':'#5a3a10',tt>=5?'#ffd23a':'#8a6a3a');
 const pc=['#a070ff','#8aff6a','#ff7a2a','#8ae8ff','#d8c8ff','#7ad8ff','#4affc0','#ff5a1a','#7affd0','#fff6a0','#ff7ad8'][tt];
 if(tt===3||tt===5||tt>=9)gem148(k,0,9.6,2.2,pc);else{k.fillStyle=pc;k.beginPath();k.arc(0,9.4,1.9,0,7);k.fill();k.strokeStyle='#14141e';k.lineWidth=.7;k.stroke()}
 if(tt<9)gl148(k,0,-L*.5,12,'255,240,170',.18)}

// ---------- นักบวช: คทาแสง 11 แบบ ----------
function staffShaft148(k,t,y0,y1,c1,c2,curve){k.strokeStyle=c1;k.lineWidth=3;k.beginPath();k.moveTo(0,y0);if(curve)k.quadraticCurveTo(curve,(y0+y1)/2,0,y1);else k.lineTo(0,y1);k.stroke();k.strokeStyle=c2;k.lineWidth=1.1;k.stroke()}
function cleric148(k,t){const p=pal148(t),tt=T148(t),now=tNow148();k.lineCap='round';k.lineJoin='round';
 const sc=[['#6a6a80','#b4b8cc'],['#5a3a1e','#8a6a3a'],['#7a1a10','#ffb030'],['#8ac8ee','#ffffff'],['#4a3a7a','#d8c8ff'],['#c8a040','#fff6d8'],['#2a5a3a','#4affc0'],['#2a1e1a','#ff7a3a'],['#3a2e4e','#c8c0d8'],['#f0e0b0','#ffffff'],['#c83a9a','#ffe6f6']][tt];
 staffShaft148(k,tt,10,-28,sc[0],sc[1],tt===1||tt===6?2:0);
 const hy=-34;
 if(tt===0){k.strokeStyle='#9aa0b8';k.lineWidth=2;k.beginPath();k.arc(0,hy,6,0,7);k.stroke();k.fillStyle='#b4b8cc';k.fillRect(-1,hy-9,2,15);k.fillRect(-5,hy-2,10,2);gl148(k,0,hy,10,p.g,.35)}
 else if(tt===1){k.fillStyle='#4a7a32';for(let i=0;i<5;i++){k.save();k.translate(0,hy);k.rotate(i*1.2566);k.beginPath();k.ellipse(0,-6,2.4,5,0,0,7);k.fill();k.restore()}k.fillStyle='#d8f0b0';k.beginPath();k.arc(0,hy,3,0,7);k.fill();gl148(k,0,hy,11,p.g,.4)}
 else if(tt===2){k.fillStyle='#ffb030';for(let i=0;i<8;i++){k.save();k.translate(0,hy);k.rotate(i*.785+now*.6);k.beginPath();k.moveTo(-2,-5);k.lineTo(0,-11-Math.sin(now*7+i)*1.5);k.lineTo(2,-5);k.fill();k.restore()}k.fillStyle='#ff7a2a';k.beginPath();k.arc(0,hy,5,0,7);k.fill();k.fillStyle='#fff6c8';k.beginPath();k.arc(0,hy,2.4,0,7);k.fill();gl148(k,0,hy,14,p.g,.5)}
 else if(tt===3){for(let i=0;i<6;i++){k.save();k.translate(0,hy);k.rotate(i*1.047);poly148(k,[[0,0],[1.6,-5],[0,-10],[-1.6,-5]],'rgba(200,240,255,.95)','#3a6a8a',.6);k.restore()}gl148(k,0,hy,12,p.g,.5)}
 else if(tt===4){k.fillStyle='#eee8ff';k.beginPath();k.arc(0,hy,7,0,7);k.fill();k.fillStyle='#221a40';k.beginPath();k.arc(2.6,hy-1.6,6,0,7);k.fill();k.fillStyle='#d8c8ff';star148(k,-2,hy-8,2,4,'#ffffff');gl148(k,0,hy,12,p.g,.45)}
 else if(tt===5){k.strokeStyle='#ffe08a';k.lineWidth=1.4;k.beginPath();k.ellipse(0,hy-8,6,1.8,0,0,7);k.stroke();for(const s of [-1,1]){k.fillStyle='#fff6d8';k.beginPath();k.moveTo(0,hy);k.quadraticCurveTo(s*10,hy-8,s*13,hy-2);k.quadraticCurveTo(s*8,hy+1,0,hy+3);k.fill()}gem148(k,0,hy,3,'#ffd23a');gl148(k,0,hy,14,p.g,.45)}
 else if(tt===6){for(let i=0;i<8;i++){k.save();k.translate(0,hy);k.rotate(i*.785);k.fillStyle=i%2?'#4affc0':'#2a8a6a';k.beginPath();k.ellipse(0,-5,2,4.6,0,0,7);k.fill();k.restore()}k.fillStyle='#ffe08a';k.beginPath();k.arc(0,hy,2.4,0,7);k.fill();gl148(k,0,hy,11,p.g,.4)}
 else if(tt===7){k.strokeStyle='#3a2e2a';k.lineWidth=3;k.beginPath();k.arc(0,hy-4,5,Math.PI*.9,Math.PI*2.1);k.stroke();k.strokeStyle='#ff7a3a';k.lineWidth=1;k.stroke();k.fillStyle='#3a2e2a';k.fillRect(-1.6,hy-1,3.2,10);k.fillRect(-6,hy+2,12,2.6);gl148(k,0,hy-4,10,p.g,.45)}
 else if(tt===8){k.fillStyle='#2a2238';k.strokeStyle='#7affd0';k.lineWidth=.8;k.fillRect(-4.4,hy-5,8.8,10);k.strokeRect(-4.4,hy-5,8.8,10);k.fillRect(-2,hy-8,4,3);k.save();k.globalCompositeOperation='lighter';k.fillStyle='rgba(120,255,200,'+(.55+.25*Math.sin(now*4))+')';k.beginPath();k.ellipse(0,hy,2.4,3.4,0,0,7);k.fill();k.restore();gl148(k,0,hy,12,p.g,.45)}
 else if(tt===9){star148(k,0,hy,12,8,'rgba(255,246,170,.85)',.35);star148(k,0,hy,6,4,'#ffffff',.4);gl148(k,0,hy,18,p.g,.65)}
 else{for(const s of [-1,1])for(let i=0;i<3;i++){k.fillStyle=i%2?'#ffb0e8':'#ffe6f6';k.beginPath();k.ellipse(s*(5+i*3),hy-2-i*2,2.8,1.3,s*(.4+i*.3),0,7);k.fill()}k.strokeStyle='#ff7ad8';k.lineWidth=1.4;k.beginPath();k.ellipse(0,hy-10,6,1.8,0,0,7);k.stroke();gem148(k,0,hy,3.4,'#ff7ad8');gl148(k,0,hy,18,p.g,.55)}}

// ---------- เนโคร: เคียว 11 แบบ ----------
function necro148(k,t){const p=pal148(t),tt=T148(t),now=tNow148();k.lineCap='round';k.lineJoin='round';
 const sh=[['#1a1414','#3a3440'],['#3a2412','#5a3a1e'],['#2a0806','#7a1a10'],['#24405a','#8ac8ee'],['#14102a','#4a3a7a'],['#3a2408','#c8a040'],['#14281a','#2a8a6a'],['#100a08','#4a3a34'],['#0a0612','#3a2e4e'],['#c8b88a','#fff6d8'],['#2a0a20','#c83a9a']][tt];
 if(tt===5||tt===9){k.strokeStyle=sh[0];k.lineWidth=3;k.beginPath();k.moveTo(0,12);k.lineTo(0,-36);k.stroke();k.fillStyle=sh[1];for(let y=8;y>-34;y-=6){k.beginPath();k.arc(0,y,1.9,0,7);k.fill()}}
 else{k.strokeStyle=sh[0];k.lineWidth=3;k.beginPath();k.moveTo(0,12);k.lineTo(0,-36);k.stroke();k.strokeStyle=sh[1];k.lineWidth=1;k.stroke()}
 /* ใบเคียว */
 const bf=tt===3?'rgba(200,240,255,.9)':tt===8?'rgba(200,190,220,.55)':tt===2?lg148(k,-26,-30,0,-30,['#ffb030','#d84a2a']):tt===9?'#ffffff':p.m;
 const blade=(dir,len,lift,curv)=>{k.fillStyle=bf;k.strokeStyle='#14141e';k.lineWidth=1;k.beginPath();k.moveTo(0,-36);k.quadraticCurveTo(dir*len*.75,-42-lift-curv,dir*len,-26-lift);k.quadraticCurveTo(dir*len*.6,-34-lift,dir*1,-31);k.closePath();k.fill();k.stroke()};
 if(tt===0)blade(-1,26,0,0);
 else if(tt===1){blade(-1,24,2,2);k.fillStyle='#4a7a32';k.beginPath();k.ellipse(-12,-37,2.4,1,-.6,0,7);k.ellipse(-19,-33,2,.9,-1,0,7);k.fill()}
 else if(tt===2){blade(-1,27,0,2);k.fillStyle='#ffb030';for(let i=0;i<4;i++){const x=-6-i*5;k.beginPath();k.moveTo(x,-39+i*.6);k.lineTo(x-1,-44-Math.sin(now*8+i)*1.6+i);k.lineTo(x-3,-38.6+i*.8);k.fill()}gl148(k,-14,-36,14,p.g,.4)}
 else if(tt===3){k.fillStyle=bf;k.strokeStyle='#24405a';k.lineWidth=.8;k.beginPath();k.moveTo(0,-36);k.lineTo(-8,-41);k.lineTo(-18,-40);k.lineTo(-26,-30);k.lineTo(-17,-35);k.lineTo(-8,-35);k.lineTo(-1,-31);k.closePath();k.fill();k.stroke();k.strokeStyle='#fff';k.lineWidth=.6;k.beginPath();k.moveTo(-8,-40);k.lineTo(-8,-36);k.moveTo(-17,-39.6);k.lineTo(-17,-35.4);k.stroke();gl148(k,-12,-36,12,p.g,.4)}
 else if(tt===4){k.fillStyle=bf;k.strokeStyle='#14141e';k.beginPath();k.arc(-12,-34,13,Math.PI*1.05,Math.PI*1.95);k.arc(-12,-31,10,Math.PI*1.9,Math.PI*1.1,true);k.closePath();k.fill();k.stroke();star148(k,-4,-46,1.8,4,'#ffffff')}
 else if(tt===5){blade(-1,26,0,2);k.fillStyle='#ffd23a';k.fillRect(-4,-38,8,3);gem148(k,0,-40,2.4,'#fff2a0')}
 else if(tt===6){blade(-1,22,0,0);blade(1,16,-2,0);k.strokeStyle='#4affc0';k.lineWidth=.7;k.beginPath();k.moveTo(-3,-35);k.quadraticCurveTo(-10,-38,-16,-32);k.stroke()}
 else if(tt===7){k.fillStyle='#3a2e2a';k.strokeStyle='#000';k.lineWidth=.8;k.beginPath();k.moveTo(0,-36);k.lineTo(-6,-42);k.lineTo(-10,-39);k.lineTo(-15,-43);k.lineTo(-19,-37);k.lineTo(-25,-38);k.lineTo(-27,-28);k.lineTo(-18,-33);k.lineTo(-8,-33);k.lineTo(-1,-31);k.closePath();k.fill();k.stroke();k.strokeStyle='#ff5a1a';k.lineWidth=.8;k.beginPath();k.moveTo(-4,-35);k.lineTo(-12,-37);k.lineTo(-20,-34);k.stroke();gl148(k,-14,-36,12,p.g,.4)}
 else if(tt===8){k.save();k.globalAlpha=.9;blade(-1,27,0,3);k.restore();k.save();k.globalCompositeOperation='lighter';k.strokeStyle='rgba(120,255,200,.6)';k.lineWidth=1;for(let i=0;i<3;i++){k.beginPath();k.moveTo(-8-i*6,-36+i);k.quadraticCurveTo(-10-i*6+Math.sin(now*3+i)*2,-30,-7-i*6,-24);k.stroke()}k.restore();gl148(k,-12,-34,14,p.g,.45)}
 else if(tt===9){blade(-1,26,0,1);blade(1,26,0,1);gl148(k,0,-38,16,p.g,.55)}
 else{k.fillStyle=lg148(k,-28,-34,0,-34,['#ffe6f6','#c83a9a']);k.strokeStyle='#2a0a20';k.lineWidth=1;k.beginPath();k.moveTo(0,-36);k.bezierCurveTo(-10,-48,-26,-44,-30,-30);k.quadraticCurveTo(-24,-36,-16,-34);k.quadraticCurveTo(-20,-30,-22,-24);k.quadraticCurveTo(-12,-34,-1,-31);k.closePath();k.fill();k.stroke();gl148(k,-14,-36,16,p.g,.5)}
 /* หัวคทา: กะโหลก/โคมวิญญาณ/อัญมณี */
 if(tt===8){k.fillStyle='#2a2238';k.fillRect(-3,-46,6,7);k.save();k.globalCompositeOperation='lighter';k.fillStyle='rgba(120,255,200,'+(.6+.25*Math.sin(now*5))+')';k.beginPath();k.ellipse(0,-42.6,1.8,2.6,0,0,7);k.fill();k.restore()}
 else if(tt===3||tt===10||tt===9)gem148(k,0,-39,tt===10?3.2:2.6,tt===3?'#bff0ff':tt===9?'#fff6a0':'#ff7ad8');
 else{k.fillStyle=tt===7?'#c8b8a8':'#e8e0d0';k.beginPath();k.arc(0,-38.4,tt===4?3.2:4,0,7);k.fill();k.fillStyle='#14102a';k.fillRect(-2,-39.4,1.4,1.4);k.fillRect(.8,-39.4,1.4,1.4);gl148(k,0,-38.4,9,p.g,.5)}
 if(tt===1){k.strokeStyle='#6ab83a';k.lineWidth=1;k.beginPath();k.moveTo(0,6);k.bezierCurveTo(4,0,-4,-6,1,-14);k.bezierCurveTo(4,-20,-3,-24,0,-30);k.stroke()}
 if(tt===5){k.fillStyle='#ffd23a';k.fillRect(-2.2,4,4.4,2.4)}
 if(tt===7){k.fillStyle='#3a2e2a';k.beginPath();k.moveTo(-2.4,12);k.lineTo(0,18);k.lineTo(2.4,12);k.fill()}}

// ---------- มังค์: สนับมือ (ไอคอน) + ผ้าพัน/สนับในมือ ----------
function monkIcon148(k,t){const p=pal148(t),tt=T148(t),now=tNow148();k.lineJoin='round';k.lineCap='round';
 gl148(k,0,0,26,p.g,.35);
 const body=tt===3?'rgba(190,235,255,.92)':tt===8?'rgba(170,160,200,.75)':lg148(k,0,-14,0,16,[p.m,p.d]);
 k.fillStyle=body;k.strokeStyle='#14100a';k.lineWidth=2;
 if(tt===1){k.beginPath();k.moveTo(-20,-2);k.quadraticCurveTo(-2,-18,20,-2);k.lineTo(16,12);k.quadraticCurveTo(0,20,-16,12);k.closePath();k.fill();k.stroke();k.fillStyle='#4a7a32';for(let i=0;i<3;i++){k.beginPath();k.ellipse(-10+i*10,10,4,2,i-1,0,7);k.fill()}}
 else if(tt===4){k.beginPath();k.arc(0,4,20,Math.PI*1.08,Math.PI*1.92);k.arc(0,10,13,Math.PI*1.85,Math.PI*1.15,true);k.closePath();k.fill();k.stroke()}
 else if(tt===7){poly148(k,[[-22,-2],[-16,-12],[-6,-14],[6,-15],[16,-11],[22,-2],[18,12],[6,16],[-8,16],[-18,12]],body,'#000',2)}
 else if(tt===10){k.beginPath();k.moveTo(-20,-4);k.bezierCurveTo(-14,-20,14,-20,20,-4);k.lineTo(18,10);k.bezierCurveTo(8,22,-8,22,-18,10);k.closePath();k.fill();k.stroke()}
 else{k.beginPath();k.moveTo(-20,-4);k.quadraticCurveTo(0,-16,20,-4);k.lineTo(18,12);k.quadraticCurveTo(0,22,-18,12);k.closePath();k.fill();k.stroke()}
 /* ช่องนิ้ว */
 const hy=tt===4?-6:-3;
 for(let i=0;i<4;i++){const x=-13.5+i*9;k.fillStyle='#16121f';k.beginPath();k.arc(x,hy,3.4,0,7);k.fill();k.strokeStyle=tt===9?'#ffe08a':p.a;k.lineWidth=1.6;k.stroke()}
 /* หนาม/กรงเล็บ/ของประดับตามระดับ */
 if(tt===0){k.fillStyle='#4a4a5e';for(let i=0;i<4;i++){const x=-13.5+i*9;k.fillRect(x-1.2,-10,2.4,3)}}
 else if(tt===2){k.fillStyle='#ffb030';for(let i=0;i<4;i++){const x=-13.5+i*9;k.beginPath();k.moveTo(x-3,-6);k.lineTo(x,-15-Math.sin(now*8+i)*2);k.lineTo(x+3,-6);k.fill()}}
 else if(tt===3){for(let i=0;i<4;i++){const x=-13.5+i*9;poly148(k,[[x-2.4,-6],[x,-17],[x+2.4,-6]],'#e8f8ff','#3a6a8a',.8)}}
 else if(tt===5){k.fillStyle='#ffd23a';k.beginPath();k.arc(0,10,6,0,7);k.fill();k.fillStyle='#8a5a10';k.beginPath();k.arc(-2,9,1,0,7);k.arc(2,9,1,0,7);k.fill();k.fillRect(-2,11,4,1)}
 else if(tt===6){for(let i=0;i<7;i++){k.fillStyle=i%2?'#4affc0':'#c8a060';k.beginPath();k.arc(-18+i*6,15+Math.sin(i)*1.4,2.4,0,7);k.fill()}}
 else if(tt===7){k.fillStyle='#3a2e2a';for(let i=0;i<4;i++){const x=-13.5+i*9;poly148(k,[[x-3,-7],[x-1,-16],[x+3,-7]],'#3a2e2a','#000',.8)}k.strokeStyle='#ff5a1a';k.lineWidth=1;k.beginPath();k.moveTo(-14,6);k.lineTo(-4,10);k.lineTo(4,5);k.lineTo(14,9);k.stroke()}
 else if(tt===8){k.save();k.globalCompositeOperation='lighter';k.strokeStyle='rgba(120,255,200,.75)';k.lineWidth=2;for(let i=0;i<3;i++){const x=-9+i*9;k.beginPath();k.moveTo(x,-6);k.quadraticCurveTo(x+4,-16,x+1,-24);k.stroke()}k.restore()}
 else if(tt===9){star148(k,0,10,7,8,'#ffffff',.4);gl148(k,0,0,30,p.g,.45)}
 else if(tt===10){for(const s of [-1,1]){k.fillStyle='#ffb0e8';k.beginPath();k.moveTo(s*18,-4);k.quadraticCurveTo(s*28,-14,s*26,4);k.quadraticCurveTo(s*22,0,s*18,6);k.fill()}gem148(k,0,10,4,'#ff7ad8')}
 else if(tt===1){k.strokeStyle='#6ab83a';k.lineWidth=1.4;k.beginPath();k.moveTo(-18,-8);k.quadraticCurveTo(0,-20,18,-8);k.stroke()}
 else if(tt===4){star148(k,0,10,4,4,'#ffffff');k.fillStyle='#d8c8ff';k.beginPath();k.arc(-12,9,1.4,0,7);k.arc(12,9,1.4,0,7);k.fill()}
 k.fillStyle='rgba(255,255,255,.5)';k.fillRect(-14,4,28,2)}
function monkHand148(k,t){const p=pal148(t),tt=T148(t),now=tNow148();gl148(k,0,0,10,p.g,.6);
 k.strokeStyle=['#c8c8d0','#8ad86a','#ff7a3a','#bff0ff','#d8c8ff','#ffd23a','#4affc0','#ff5a1a','#7affd0','#ffffff','#ff7ad8'][tt];k.lineWidth=1.4;for(let i=0;i<3;i++){k.beginPath();k.moveTo(-4,-3+i*2.5);k.lineTo(4,-2+i*2.5);k.stroke()}
 k.fillStyle=p.d;k.fillRect(-4.4,-6,8.8,2.2);
 const n=[2,2,3,3,2,3,3,4,3,4,4][tt];k.fillStyle=tt===3?'#e8f8ff':tt===2?'#ffb030':p.m;for(let i=0;i<n;i++){const x=-3.4+i*(6.8/Math.max(1,n-1));k.beginPath();k.moveTo(x-1,-6);k.lineTo(x,-6-[2,1.6,3.4,3.6,2,2.4,2.2,3.2,2.6,3,3.4][tt]-(tt===2?Math.sin(now*9+i):0));k.lineTo(x+1,-6);k.fill()}
 if(tt>=9)gl148(k,0,-3,14,p.g,.5)}

// ---------- ดรากูน: ทวน 11 แบบ ----------
function dragoon148(k,t){const p=pal148(t),tt=T148(t),now=tNow148();k.lineCap='round';k.lineJoin='round';
 const sc=[['#2a2a34','#6a6a80'],['#3a2412','#6a9a4a'],['#3a0a06','#d84a2a'],['#24405a','#bff0ff'],['#1a1430','#7a68b8'],['#5a3a08','#ffd23a'],['#1a3a2a','#4affc0'],['#1a1210','#ff7a3a'],['#120c1a','#7affd0'],['#c8b88a','#ffffff'],['#3a0a2a','#ff7ad8']][tt];
 k.strokeStyle=sc[0];k.lineWidth=3;k.beginPath();k.moveTo(0,16);k.lineTo(0,-34);k.stroke();k.strokeStyle=sc[1];k.lineWidth=1.2;k.beginPath();for(let y=14;y>-32;y-=5){k.moveTo(-1.4,y);k.lineTo(1.4,y-2.4)}k.stroke();
 const hf=tt===3?'rgba(210,245,255,.95)':tt===8?'rgba(210,200,230,.7)':lg148(k,-5,0,5,0,[p.d,p.m,p.d]),st='#14141e';k.lineWidth=1;
 if(tt===0)poly148(k,[[0,-50],[3.4,-38],[0,-33],[-3.4,-38]],hf,st);
 else if(tt===1){k.fillStyle=hf;k.strokeStyle=st;k.beginPath();k.moveTo(0,-52);k.quadraticCurveTo(6,-42,0,-33);k.quadraticCurveTo(-6,-42,0,-52);k.fill();k.stroke();k.strokeStyle='#2e5a1e';k.lineWidth=.6;k.beginPath();k.moveTo(0,-50);k.lineTo(0,-35);k.stroke()}
 else if(tt===2){poly148(k,[[0,-54],[4,-44],[2.4,-42],[5,-36],[0,-33],[-5,-36],[-2.4,-42],[-4,-44]],hf,st);k.fillStyle='#ffb030';k.beginPath();k.moveTo(-2,-46);k.lineTo(0,-58-Math.sin(now*9)*2);k.lineTo(2,-46);k.fill();gl148(k,0,-44,12,p.g,.45)}
 else if(tt===3){poly148(k,[[0,-56],[2.6,-44],[0,-33],[-2.6,-44]],hf,'#24405a');for(const s of [-1,1])poly148(k,[[s*1.6,-38],[s*7,-44],[s*3,-36]],hf,'#24405a');gl148(k,0,-44,12,p.g,.45)}
 else if(tt===4){poly148(k,[[0,-50],[3,-40],[0,-34],[-3,-40]],hf,st);k.fillStyle='#eee8ff';k.strokeStyle=st;k.beginPath();k.arc(-3,-38,8,Math.PI*.6,Math.PI*1.4);k.arc(-1,-38,6,Math.PI*1.35,Math.PI*.65,true);k.closePath();k.fill();k.stroke()}
 else if(tt===5){poly148(k,[[0,-54],[4,-42],[0,-34],[-4,-42]],hf,'#6a4a10');for(const s of [-1,1]){k.fillStyle='#fff6c8';k.beginPath();k.moveTo(0,-36);k.quadraticCurveTo(s*9,-42,s*11,-34);k.quadraticCurveTo(s*6,-34,0,-33);k.fill()}gl148(k,0,-44,12,p.g,.4)}
 else if(tt===6){for(const x of [-5,0,5])poly148(k,[[x,x?-46:-52],[x+1.8,-38],[x,-35],[x-1.8,-38]],hf,st);k.fillStyle=sc[0];k.fillRect(-6,-36,12,2.4)}
 else if(tt===7){poly148(k,[[0,-50],[3,-40],[0,-33],[-3,-40]],hf,st);poly148(k,[[-1,-40],[-10,-44],[-12,-36],[-9,-32],[-1,-35]],'#3a2e2a','#000');k.strokeStyle='#ff5a1a';k.lineWidth=.8;k.beginPath();k.moveTo(-9,-42);k.lineTo(-8,-35);k.stroke();gl148(k,-4,-40,10,p.g,.4)}
 else if(tt===8){k.save();k.globalAlpha=.9;poly148(k,[[0,-54],[3.4,-42],[0,-33],[-3.4,-42]],hf,st);k.restore();k.save();k.globalCompositeOperation='lighter';k.strokeStyle='rgba(120,255,200,.6)';k.lineWidth=1.1;for(let i=0;i<3;i++){k.beginPath();k.moveTo(0,-40+i*3);k.quadraticCurveTo(-6+Math.sin(now*3+i)*2,-44+i*3,-10,-38+i*3);k.stroke()}k.restore();gl148(k,0,-44,13,p.g,.45)}
 else if(tt===9){star148(k,0,-44,9,4,'#ffffff',.3);poly148(k,[[0,-58],[2.4,-44],[0,-34],[-2.4,-44]],'#fff6d8','#a08040');gl148(k,0,-46,16,p.g,.6)}
 else{k.fillStyle=lg148(k,-6,0,6,0,['#c83a9a','#ffe6f6','#c83a9a']);k.strokeStyle='#2a0a20';k.beginPath();k.moveTo(0,-34);k.quadraticCurveTo(-7,-38,-6,-44);k.quadraticCurveTo(-3,-50,0,-58);k.quadraticCurveTo(3,-50,6,-44);k.quadraticCurveTo(7,-38,0,-34);k.fill();k.stroke();k.fillStyle='#2a0a20';k.beginPath();k.arc(-2,-43,.9,0,7);k.arc(2,-43,.9,0,7);k.fill();gem148(k,0,-38,1.8,'#ffffff');gl148(k,0,-44,16,p.g,.5)}
 /* ปลอกคอหัวทวน + พู่ */
 k.fillStyle=tt===9?'#ffe08a':p.a;k.fillRect(-3.6,-34,7.2,2.2);
 const tc=['#a070ff','#8aff6a','#ff3a1a','#8ae8ff','#d8c8ff','#ffd23a','#4affc0','#ff5a1a','#7affd0','#ffffff','#ff7ad8'][tt];k.fillStyle=tc;k.beginPath();k.moveTo(-2,-32);k.quadraticCurveTo(-8+Math.sin(now*3)*1.2,-26,-5,-20);k.lineTo(-1,-30);k.closePath();k.fill();
 if(tt>=7){k.fillStyle=sc[0];k.beginPath();k.moveTo(-2.4,16);k.lineTo(0,22);k.lineTo(2.4,16);k.fill()}}

// ---------- ซัมมอนเนอร์: ไม้เท้าเขาสัตว์ 11 แบบ ----------
function summoner148(k,t){const p=pal148(t),tt=T148(t),now=tNow148();k.lineCap='round';k.lineJoin='round';
 const wd=[['#2a2234','#5a4a6a'],['#5a3a1e','#8ad86a'],['#3a0a06','#d84a2a'],['#24405a','#bff0ff'],['#221a40','#a898e0'],['#7a5418','#ffd23a'],['#3a2a14','#4affc0'],['#1a1210','#ff7a3a'],['#120c1a','#7affd0'],['#e8dcc0','#ffffff'],['#3a0a2a','#ff7ad8']][tt];
 k.strokeStyle=wd[0];k.lineWidth=3.4;k.beginPath();k.moveTo(0,10);k.quadraticCurveTo(tt%2?-2:2,-12,0,-30);k.stroke();k.strokeStyle=wd[1];k.lineWidth=.9;k.beginPath();k.moveTo(0,8);k.bezierCurveTo(3,0,-3,-10,0,-18);k.bezierCurveTo(3,-24,-2,-27,0,-30);k.stroke();
 const hy=-30,hc=tt===3?'rgba(210,245,255,.95)':tt===8?'#d8d0c8':tt===7?'#3a2e2a':tt===9?'#ffffff':tt===5?'#ffe08a':'#e8dcc0',hs='#2a1e14';k.lineWidth=1;
 const horn=(s,f)=>{k.fillStyle=hc;k.strokeStyle=hs;k.beginPath();f(s);k.closePath();k.fill();k.stroke()};
 if(tt===0){for(const s of [-1,1])horn(s,s=>{k.moveTo(0,hy);k.quadraticCurveTo(s*10,hy-8,s*12,hy-16);k.quadraticCurveTo(s*6,hy-8,0,hy-4)})}
 else if(tt===1){k.strokeStyle='#6a4a2a';k.lineWidth=1.8;for(const s of [-1,1]){k.beginPath();k.moveTo(0,hy);k.lineTo(s*6,hy-8);k.lineTo(s*8,hy-16);k.moveTo(s*6,hy-8);k.lineTo(s*12,hy-10);k.moveTo(s*7,hy-12);k.lineTo(s*3,hy-17);k.stroke()}k.fillStyle='#8aff6a';k.beginPath();k.ellipse(-8,hy-16,1.8,1,-.6,0,7);k.ellipse(12,hy-10,1.8,1,.6,0,7);k.fill()}
 else if(tt===2){for(const s of [-1,1]){k.fillStyle='#ff7a2a';k.beginPath();k.moveTo(0,hy);k.quadraticCurveTo(s*8,hy-6,s*9,hy-14-Math.sin(now*7+s)*2);k.quadraticCurveTo(s*4,hy-8,0,hy-4);k.fill();k.fillStyle='#ffd060';k.beginPath();k.moveTo(0,hy-1);k.quadraticCurveTo(s*5,hy-5,s*6,hy-10);k.quadraticCurveTo(s*3,hy-6,0,hy-3);k.fill()}gl148(k,0,hy-6,12,p.g,.5)}
 else if(tt===3){for(const s of [-1,1]){poly148(k,[[0,hy],[s*5,hy-6],[s*7,hy-17],[s*8,hy-6],[s*3,hy-2]],hc,'#3a6a8a',.7);poly148(k,[[s*4,hy-4],[s*12,hy-9],[s*6,hy-2]],hc,'#3a6a8a',.6)}gl148(k,0,hy-8,12,p.g,.45)}
 else if(tt===4){for(const s of [-1,1])horn(s,s=>{k.arc(s*4,hy-6,8,s>0?Math.PI*1.1:Math.PI*1.9,s>0?Math.PI*1.9:Math.PI*1.1,s<0);k.arc(s*4,hy-5,5.6,s>0?Math.PI*1.8:Math.PI*1.2,s>0?Math.PI*1.2:Math.PI*1.8,s>0)});star148(k,0,hy-12,2,4,'#fff')}
 else if(tt===5){for(const s of [-1,1]){k.fillStyle='#ffe08a';k.strokeStyle='#6a4a10';k.beginPath();k.moveTo(0,hy);k.quadraticCurveTo(s*14,hy-4,s*13,hy-14);k.quadraticCurveTo(s*10,hy-10,s*8,hy-13);k.quadraticCurveTo(s*6,hy-8,0,hy-4);k.closePath();k.fill();k.stroke()}gem148(k,0,hy-4,2.4,'#fff2a0')}
 else if(tt===6){k.strokeStyle='#2a8a6a';k.lineWidth=1.4;for(const s of [-1,1]){k.beginPath();k.moveTo(0,hy);k.bezierCurveTo(s*10,hy-2,s*2,hy-12,s*9,hy-16);k.stroke()}k.fillStyle='#4affc0';for(const [x,y] of [[-9,-16],[9,-16],[-5,-8],[5,-8]]){k.beginPath();k.ellipse(x,hy+y,2,1,x>0?.6:-.6,0,7);k.fill()}k.fillStyle='#ffd23a';k.beginPath();k.arc(0,hy-4,2,0,7);k.fill()}
 else if(tt===7){for(const s of [-1,1])poly148(k,[[0,hy],[s*7,hy-4],[s*9,hy-10],[s*7,hy-12],[s*11,hy-18],[s*5,hy-10],[0,hy-5]],hc,'#000',.8);k.strokeStyle='#ff5a1a';k.lineWidth=.8;k.beginPath();k.moveTo(-6,hy-5);k.lineTo(-8,hy-11);k.moveTo(6,hy-5);k.lineTo(8,hy-11);k.stroke();gl148(k,0,hy-6,10,p.g,.4)}
 else if(tt===8){k.fillStyle='#d8d0c8';k.beginPath();k.arc(0,hy-5,5.4,0,7);k.fill();k.fillRect(-3,hy-1,6,3.4);k.fillStyle='#120c1a';k.beginPath();k.arc(-2,hy-5.4,1.4,0,7);k.arc(2,hy-5.4,1.4,0,7);k.fill();for(const s of [-1,1])horn(s,s=>{k.moveTo(s*3,hy-9);k.quadraticCurveTo(s*9,hy-12,s*10,hy-18);k.quadraticCurveTo(s*6,hy-13,s*1,hy-10)});gl148(k,0,hy-5,12,p.g,.5)}
 else if(tt===9){k.strokeStyle='#ffe08a';k.lineWidth=1.6;k.beginPath();k.arc(0,hy-8,7,0,7);k.stroke();star148(k,0,hy-8,5,6,'#ffffff',.45);for(const s of [-1,1])horn(s,s=>{k.moveTo(s*5,hy-3);k.quadraticCurveTo(s*14,hy-6,s*14,hy-14);k.quadraticCurveTo(s*10,hy-8,s*4,hy-6)});gl148(k,0,hy-8,16,p.g,.6)}
 else{k.fillStyle='#3a0a2a';k.fillRect(-4,hy-12,8,12);k.fillStyle='#ff7ad8';k.fillRect(-4,hy-12,8,2);k.fillRect(-4,hy-6,8,1.4);k.fillStyle='#ffe6f6';k.beginPath();k.arc(-1.6,hy-8.4,1,0,7);k.arc(1.6,hy-8.4,1,0,7);k.fill();for(const s of [-1,1]){k.fillStyle=s<0?'#ffb0e8':'#ffe6f6';k.beginPath();k.moveTo(s*4,hy-6);k.quadraticCurveTo(s*14,hy-14,s*16,hy-4);k.quadraticCurveTo(s*10,hy-6,s*4,hy-2);k.fill()}gl148(k,0,hy-8,16,p.g,.55)}
 /* ขนนก/เครื่องรางห้อย (สี/จำนวนต่างกันตามระดับ) */
 const fc=[['#a070ff'],['#8aff6a','#ffd23a'],['#ff3a1a','#ffb030'],['#8ae8ff','#ffffff'],['#d8c8ff','#6a5aa8'],['#ffd23a','#ffffff','#c8283a'],['#4affc0','#2a8a6a'],['#ff5a1a','#3a2e2a'],['#7affd0','#3a2e4e'],['#ffffff','#fff6a0','#ffe08a'],['#ff7ad8','#ffe6f6','#c83a9a']][tt];
 fc.forEach((c,i)=>{k.fillStyle=c;k.beginPath();k.ellipse(3.6+i*1.4,-20+i*4,1.5,4.6,.4,0,7);k.fill()})}

// ---------- รวม: ใช้แทน wpn25 / rifle27 / knuckle27 เดิม ----------
const DRAW148={ninja:ninja148,paladin:paladin148,cleric:cleric148,necro:necro148,dragoon:dragoon148,summoner:summoner148,monk:monkHand148};
window.DRAW148=DRAW148;
{const _w=wpn25;wpn25=function(cls,k){const f=DRAW148[cls];if(!f)return _w(cls,k);try{k.save();f(k,P.tier.sword|0)}catch(e){console.warn('[fix148]',cls,e);k.restore();return _w(cls,k)}k.restore()};window.wpn25=wpn25}
{const _r=rifle27;rifle27=function(k,Q){try{k.save();sniper148(k,P.tier.sword|0,0)}catch(e){k.restore();return _r(k,Q)}k.restore()};window.rifle27=rifle27}
{const _kn=knuckle27;knuckle27=function(k,Q){try{k.save();monkIcon148(k,P.tier.sword|0)}catch(e){k.restore();return _kn(k,Q)}k.restore()};window.knuckle27=knuckle27}
/* ไอคอน (กระเป๋า/ร้าน/หน้าหลอม): จัดขนาด+ตำแหน่งให้เต็มกรอบไม่ล้นขอบ (หัวคทา/ใบเคียว/ลำกล้องยาวขึ้น) */
const FIT148={ninja:[.62,1.05,0,-11],paladin:[.62,1.1,0,-14],cleric:[.62,1.06,0,-18],necro:[.5,1.0,-8,-17],dragoon:[.62,.8,0,-18],summoner:[.55,1.04,0,-19],sniper:[-.72,.92,9,0]};
{const _ci=cwIcon27;cwIcon27=function(it){try{const F=FIT148[it.cls];if(!F||!CW27[it.cls])return _ci(it);const key=it.id;if(CWI27[key])return CWI27[key];
  const c=document.createElement('canvas');c.width=c.height=64;const k=c.getContext('2d'),W=CW27[it.cls];
  k.save();k.translate(32,32);k.rotate(F[0]);k.scale(F[1],F[1]);k.translate(-F[2],-F[3]);if(it.cls==='sniper')sniper148(k,it.tier|0,0);else DRAW148[it.cls](k,it.tier|0);k.restore();
  k.save();k.globalCompositeOperation='destination-over';const g=k.createRadialGradient(32,32,4,32,32,34);g.addColorStop(0,W[2]+'55');g.addColorStop(1,W[2]+'00');k.fillStyle=g;k.fillRect(0,0,64,64);k.restore();
  k.font='14px "Noto Color Emoji","Apple Color Emoji",sans-serif';k.textAlign='right';k.textBaseline='bottom';k.fillText(CLS[it.cls].e,63,64);return CWI27[key]=c}catch(e){console.warn('[fix148 icon]',e);return _ci(it)}};window.cwIcon27=cwIcon27}
/* ไรเฟิลในมือ (ท่ายืน/ท่ายิง) */
{const _db=drawBow6;drawBow6=function(x,y,aim,tier,pull,arrow,sc){try{if(P.cls==='sniper'&&window.cwOk25&&cwOk25()&&!(window.fwMine145&&fwMine145())){ctx.save();ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc||1,sc||1);try{sniper148(ctx,tier|0,pull||0)}finally{ctx.restore()}return}}catch(e){}return _db.apply(this,arguments)};window.drawBow6=drawBow6}
/* ดาบ/คทา/ธนูอาชีพ: ไม่ย้อมสีเดียวทับทุกระดับ — คงสีจริงของระดับ ให้แค่เงาวาวขึ้นเล็กน้อย */
try{FLT27.sword='saturate(1.25) brightness(1.08) contrast(1.05)';FLT27.mage='saturate(1.3) brightness(1.08)';FLT27.archer='saturate(1.3) brightness(1.06)'}catch(e){}
/* ล้างรูปที่แคชไว้ ให้วาดใหม่ทั้งหมด */
try{for(const k in CWI27)delete CWI27[k]}catch(e){}
try{for(const k in IURL)if(/^item:cw_/.test(k))delete IURL[k]}catch(e){}
try{if(typeof BKS27==='object')for(const k in BKS27)delete BKS27[k]}catch(e){}
/* REG136: อาวุธอาชีพ 11 ระดับต้องไม่ซ้ำกัน */
try{if(window.REG136)REG136.push(
 ['อาวุธอาชีพแต่ละระดับหน้าตาไม่ซ้ำกัน (fix148)',async()=>{const bad=[];for(const c of Object.keys(CW27)){const seen=new Set();for(let t=0;t<11;t++){const id='cw_'+c+t;if(!ITEMS[id])continue;let u='';try{delete IURL['item:'+id];delete CWI27[id];u=iconURL('item:'+id)}catch(e){bad.push(id+' error');continue}if(seen.has(u))bad.push(id+' ซ้ำ');seen.add(u)}}return bad.length?bad.slice(0,6).join(', '):null}],
 ['อาวุธอาชีพในมือวาดตามระดับ (fix148)',async()=>{const c=document.createElement('canvas');c.width=c.height=80;const k=c.getContext('2d'),sv=P.tier.sword,out=[];try{for(const cl of ['ninja','paladin','cleric','necro','dragoon','summoner','monk']){const urls=new Set();for(const t of [0,5,10]){k.clearRect(0,0,80,80);k.save();k.translate(40,60);P.tier.sword=t;wpn25(cl,k);k.restore();urls.add(c.toDataURL())}if(urls.size<3)out.push(cl)}}finally{P.tier.sword=sv}return out.length?'ในมือไม่เปลี่ยนตามระดับ: '+out.join(','):null}]);}catch(e){}
}catch(e){console.warn('fix148',e)}
