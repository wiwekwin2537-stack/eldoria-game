// ลูปหลักของเกม: พุ่ง · เดิน · เสียงฝีเท้า · อัปเดตฉาก
const FPSEL=document.getElementById('fpsb');let last=performance.now(),fpsA=60,fpsN=0;
function doDash(){if(PAUSED||DOORA.k||P.dash>0||P.dcd>0||P.at>=0||P.stun>0)return;if(P.fa<DASH.fa){if(window.tiredMsg)tiredMsg();return}let ix=(keys.r?1:0)-(keys.l?1:0),iy=(keys.d?1:0)-(keys.u?1:0);if(JOY.on&&(JOY.x||JOY.y)){ix=JOY.x;iy=JOY.y}if(!ix&&!iy){[ix,iy]=DIRV[P.dir]}const n=Math.hypot(ix,iy);P.dv=[ix/n,iy/n];
 if(Math.abs(ix)>Math.abs(iy))P.dir=ix<0?'l':'r';else if(iy)P.dir=iy<0?'u':'d';P.dash=DASH.time;P.dcd=DASH.cd;P.fa=Math.max(0,P.fa-DASH.fa);sfx('dash');
 for(let i=0;i<8;i++)fx.push({x:P.x,y:P.y-4,vx:-P.dv[0]*80+(Math.random()-.5)*60,vy:-10-Math.random()*30,l:.4,c:'220,210,180'})}
function dashStep(dt){const sp=DASH.speed*dt,[vx,vy]=P.dv;P.dash-=dt;if(!hit(P.x+vx*sp,P.y))P.x+=vx*sp;if(!hit(P.x,P.y+vy*sp))P.y+=vy*sp;P.iframe=Math.max(P.iframe,.12);P.t+=dt*22;if(Math.random()<dt*45)fx.push({x:P.x-vx*8,y:P.y,vx:-vx*45+(Math.random()-.5)*30,vy:-14-Math.random()*20,l:.35,c:'220,210,180'});
 P.gh=(P.gh||0)-dt;if(P.gh<=0){P.gh=.042;ghosts.push({x:P.x,y:P.y,dir:P.dir,l:.22})}}
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;DT=dt;if(PAUSED||ROTP)return;
 if(SET.fps){fpsA+=(1/Math.max(dt,.001)-fpsA)*.05;if(++fpsN%15===0){FPSEL.hidden=false;FPSEL.textContent=Math.round(fpsA)+' FPS'}}else FPSEL.hidden=true;
 let ix=(keys.r?1:0)-(keys.l?1:0),iy=(keys.d?1:0)-(keys.u?1:0),am=1;
 if(JOY.on&&(JOY.x||JOY.y)){ix=JOY.x;iy=JOY.y;am=Math.min(1,Math.hypot(ix,iy))}if(!ix&&!iy&&typeof AUTO!=="undefined"&&AUTO.on&&(AUTO.ix||AUTO.iy)){ix=AUTO.ix;iy=AUTO.iy}if(window.CLICK594&&CLICK594.on){try{CLICK594.tick(dt)}catch(e){}if(!ix&&!iy&&(CLICK594.ix||CLICK594.iy)){ix=CLICK594.ix;iy=CLICK594.iy}}/* v595 คอม: คลิกเดิน/คลิกมอนตี (198-click-move) */ // จอยสติ๊ก: ดันน้อยเดินช้า ดันมากเดินเต็มความเร็ว
 playerTick(dt);P.dcd=Math.max(0,P.dcd-dt);
 if(DOORA.k)doorTick(dt);
 if(P.sit){if(ix||iy){P.sit=null;P.y=8.55*T}else{P.hp=Math.min(BAL.hp,P.hp+4*dt);P.mp=Math.min(BAL.mp,P.mp+3*dt)}}if(P.stun>0||DOORA.k||P.sit){ix=iy=0}
 if(P.at>=0){if(P.tool!=='sword'){ix=iy=0}P.at+=dt/atkDur();if(P.at>=.42&&P.hitDone!==atkId){P.hitDone=atkId;useToolHit()}if(P.at>=1){P.at=-1;P.atEnd=performance.now();if(P.qa){P.qa=0;attack(true)}}}
 if(P.dash>0){dashStep(dt);P.mv=true}
 else{P.mv=!!(ix||iy);
  if(P.mv){const n=Math.hypot(ix,iy);ix/=n;iy/=n;const sp=(P.at>=0?.4:1)*(isRun()&&P.at<0?170:95)*dt*(.5+.5*am)*(P.fa<=0?.6:1)*(P.hu<=0?.8:1)*(1+.35*(1-Math.exp(-(P.stats.agi||0)/120)))*CARRY_SPD*(window.spdMul?spdMul():1);
   if(P.at<0){if(Math.abs(ix)>Math.abs(iy)||(Math.abs(ix)===Math.abs(iy)&&(P.dir==='l'||P.dir==='r')))P.dir=ix<0?'l':'r';else P.dir=iy<0?'u':'d'}
   moveSlide(ix*sp,iy*sp);
   P.t+=dt*(isRun()?13:8);P.st=(P.st||0)+dt*(isRun()?4.4:3);if(P.st>1){P.st=0;sfx('step');}}
  else P.t=0}
 recallTick(dt);
 {const qx=Math.floor(P.x/T),qy=Math.floor(P.y/T); // เดินชนขอบทางออก: ในเมือง→ทุ่งหญ้า · ในร้าน→เมือง · ทุ่งหญ้า→เมือง
  if(D){if(dm[qy]&&dm[qy][qx]===GATE){if(D.town)exitD();else if(D.shop)leaveShop()}}
  else if(map[qy]&&map[qy][qx]===TOWNGATE)enterTown(true)}
 for(let i=ghosts.length-1;i>=0;i--){ghosts[i].l-=dt;if(ghosts[i].l<=0)ghosts.splice(i,1)}
 updSlimes(dt);updWorld(dt);if(D&&D.town){updNPCs(dt);updCarts(dt)}else if(D&&D.shop)updShop(dt);
 draw();
 if(FADE.a>0){ui();ctx.fillStyle=FADE.c;ctx.globalAlpha=FADE.a;ctx.fillRect(0,0,VW,VH);ctx.globalAlpha=1;FADE.a-=dt*1.8}
 (window.MMF=(window.MMF|0)+1)%(window.MMQ||3)||drawMini()}
for(const ev of ['pointerdown','keydown'])addEventListener(ev,auInit,{once:true});
document.getElementById('muteb').onclick=toggleMute;document.getElementById('setb').onclick=toggleMenu;
document.getElementById('muteb').textContent=SET.mute?'🔇':'🔊';
requestAnimationFrame(frame);
startInTown(); // เริ่มเกมที่เมือง (จุดเกิด)
