// ---- ตัวละคร (สไตล์บล็อกแบบในรูปอ้างอิง) ----
function sword(hx,hy,ang){ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);ctx.translate(0,-4);
 ctx.shadowColor='#2f8bff';ctx.shadowBlur=10;
 ctx.fillStyle='#1b1d29';ctx.fillRect(-2.5,-30,5,28);
 ctx.beginPath();ctx.moveTo(-2.5,-30);ctx.lineTo(0,-37);ctx.lineTo(2.5,-30);ctx.fill();
 ctx.fillStyle='#8fc6ff';ctx.fillRect(-.8,-30,1.6,27);
 ctx.fillStyle='#6d7280';ctx.fillRect(-7,-3,14,3);
 ctx.fillStyle='#0e0e14';ctx.fillRect(-1.5,0,3,8);
 ctx.fillStyle='#5db0ff';ctx.fillRect(-2,8,4,4);ctx.restore()}
let DPOSE=false; // true = วาดท่าพุ่ง (ใช้กับตัวจริงและภาพเงา)
function heroBody(){
 const run=isRun(),s=P.mv?Math.sin(P.t):0,bob=P.mv?Math.abs(Math.cos(P.t))*(run?2.5:1.5):(Math.sin(performance.now()/420)*.5+.5)*1.2;
 const at=P.at>=0,lg=at?Math.sin(Math.PI*P.at)*4:0,x=Math.round(P.x+DIRV[P.dir][0]*lg),y=Math.round(P.y+DIRV[P.dir][1]*lg),d=P.dir,side=d==='l'||d==='r',f=d==='l'?-1:1,by=Math.round(y-bob+atkCrouch());
 const R=(c,a,b,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),w,h)};
 const EC=EQCOL(),BLK='#14141a',LGA=EC.BLK,LGB=EC.LEG2,TOP=EC.TOP,COL=EC.COLLAR,SK='#f1d2b0',tilt=run?.35:0;
 const DP=DPOSE&&!at,leg=(hx,hy,ang,col,h)=>{ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);R(col,0,0,6,h);ctx.restore()};
 const held=(hx,hy,ang)=>{if(P.draw&&(P.tool!=='sword'||P.armor.sword)&&!(side&&!at&&P.tool==='sword'&&!(window.RNGHOLD7&&RNGHOLD7())))toolSpr(hx,hy,ang);R(SK,hx-3,hy-2,6,4)};
 const slash=()=>slashFx(x,by,d,side,f,TOP,held);
 ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(x,y+1,11,4,0,0,7);ctx.fill();
 if(DP){ctx.save();ctx.translate(x,y);if(side)ctx.rotate(f*.42);else ctx.scale(1,.9);ctx.translate(-x,-y)}
 if(at&&d==='u')slash();
 if(d==='d'||side)backSword(x,by,side,f,d);
 
 if(side){ // มองข้าง: ขาและแขนแกว่งหน้า-หลัง
  if(DP){leg(x-3,by-12,f*.95,LGB,13);leg(x-3,by-12,-f*.7,LGA,12)}else{sideLegs(x,by,f,LGA,LGB,run)}
  R(TOP,x-4.5,by-26,9,14);R(COL,x-5,by-28,10,4);drawChest(R,x,by,side,f,d);drawNeck(x,by,side,d);
  R(SK,x-6,by-40,12,12);R(BLK,x-7,by-43,14,7);R(BLK,x-7+(f<0?6:0),by-43,8,13);
  R(BLK,x-6,by-48,4,6);R(BLK,x-1,by-49,4,7);R(BLK,x+3,by-47,4,5);
  R('#111',x+3*f-1,by-36,2,3);
  if(DP){ctx.save();ctx.translate(x-3,by-25);ctx.rotate(f*1.15);R(TOP,0,0,6,12);R(SK,0,9,6,4);ctx.restore()}else if(!(at&&window.RNGARM7&&RNGARM7())){R(TOP,x-3+s*5*f,by-26,6,12);R(SK,x-3+s*5*f,by-15,6,4);drawArm(x-3+s*5*f,by-21);drawRing(x-3+s*5*f,by-15)}
  if(!at){if(DP)held(x-f*10,by-19,-f*1.35);else held(x+s*5*f,by-13,f*(.9-tilt))}
 }else{ // มองหน้า/หลัง
  const l1=DP?7:Math.max(0,s)*(run?5:3.5),l2=DP?0:Math.max(0,-s)*(run?5:3.5);
  R(LGA,x-7,by-12-l1,6,12);R(LGA,x+1,by-12-l2,6,12);kneeFront(R,x,by,l1,l2);
  R(TOP,x-8,by-26,16,14);R(COL,x-8,by-28,16,4);drawChest(R,x,by,side,f,d);drawNeck(x,by,side,d);
  if(!(at&&(d==='d'||(window.RNGARM7&&RNGARM7())))){if(DP){ctx.save();ctx.translate(x-8,by-25);ctx.rotate(.95);R(TOP,-6,0,6,12);R(SK,-6,9,6,4);ctx.restore()}else{R(TOP,x-14,by-26+s*3,6,12);R(SK,x-14,by-15+s*3,6,4);drawArm(x-14,by-21+s*3)}}
  if(!(at&&(d==='u'||(d==='d'&&window.CHOP6&&CHOP6())||(window.RNGARM7&&RNGARM7())))){if(DP){ctx.save();ctx.translate(x+8,by-25);ctx.rotate(-.95);R(TOP,0,0,6,12);R(SK,0,9,6,4);ctx.restore()}else{R(TOP,x+8,by-26-s*3,6,12);R(SK,x+8,by-15-s*3,6,4);drawArm(x+8,by-21-s*3);drawRing(x+8,by-15-s*3)}}
  R(SK,x-6,by-40,12,12);R(BLK,x-7,by-43,14,d==='u'?15:6);
  R(BLK,x-7,by-47,4,5);R(BLK,x-2,by-48,4,6);R(BLK,x+3,by-47,4,5);
  if(d==='d'){R('#111',x-3,by-36,2,3);R('#111',x+1,by-36,2,3)}
  if(d==='d'&&!at)DP?held(x-16,by-15,-1.25):held(x-11,by-13+s*3,-.5-tilt);
 }
 if(window.hairOv8)hairOv8(R,x,by,side,f,d,at);if(d!=='d'&&!side)backSword(x,by,side,f,d);drawHelm(R,x,by,side,f,d);eqGlitter(x,by,d,f);
 if(at&&d!=='u')slash();
 if(!at&&d==='u')DP?held(x+16,by-15,1.25):held(x+11,by-13-s*3,.5+tilt);
 if(DP)ctx.restore();
}
function dashStreaks(){const [vx,vy]=P.dv,px=-vy,py=vx,a=Math.min(1,P.dash/DASH.time*1.6);ctx.save();ctx.lineCap='round';ctx.lineWidth=1.6;
 for(let i=0;i<5;i++){const o=(i-2)*6,len=24+((i*37)%5)*7,sx=P.x-vx*8+px*o,sy=P.y-24+py*o*.6;ctx.strokeStyle='rgba(235,245,255,'+(.55*a)+')';ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-vx*len,sy-vy*len*.7);ctx.stroke()}ctx.restore()}
function hero(){DPOSE=P.dash>0;if(DPOSE)dashStreaks();if(P.recall>0)recallFx();const t=performance.now()/1000,sw=P.mv?Math.sin(P.t)*.035:Math.sin(t*1.7)*.02+Math.sin(t*.6)*.01;ctx.save();ctx.translate(P.x,P.y);ctx.transform(1,0,sw,1,0,0);ctx.translate(-P.x,-P.y);heroBody();ctx.restore();nameTag()}
function drawGhosts(){if(!ghosts.length)return;const q=[P.x,P.y,P.dir,P.mv];for(const g of ghosts){P.x=g.x;P.y=g.y;P.dir=g.dir;P.mv=true;DPOSE=true;ctx.globalAlpha=Math.min(.26,g.l*1.4);heroBody()}DPOSE=false;ctx.globalAlpha=1;[P.x,P.y,P.dir,P.mv]=q}
