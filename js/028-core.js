// ---- ม้วนวาปกลับเมือง: กด 4 / T / ปุ่ม 📜 แล้วยืนนิ่งจนร่ายเสร็จ (ขยับหรือโดนตีจะยกเลิก) ----
inv.scroll=RECALL.start;P.recall=0;P.recallMax=RECALL.cast;
function scrollIcon(sz){const c=document.createElement('canvas');c.width=c.height=sz||48;const k=c.getContext('2d');k.scale(c.width/48,c.width/48);k.lineJoin='round';
 k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(24,42,16,4,0,0,7);k.fill();
 const g=k.createLinearGradient(8,0,40,0);g.addColorStop(0,'#cdb88a');g.addColorStop(.5,'#f5e8c4');g.addColorStop(1,'#cdb88a');k.fillStyle=g;k.strokeStyle='#5a4426';k.lineWidth=1.5;
 k.fillRect(9,9,30,28);k.strokeRect(9,9,30,28);
 for(const y of [9,37]){const rg=k.createLinearGradient(0,y-4,0,y+4);rg.addColorStop(0,'#e8d8a8');rg.addColorStop(1,'#a8905a');k.fillStyle=rg;k.beginPath();k.roundRect?k.roundRect(6,y-4,36,8,4):k.rect(6,y-4,36,8);k.fill();k.stroke()}
 k.strokeStyle='#7a4cd8';k.lineWidth=1.6;k.shadowColor='#b48cff';k.shadowBlur=5;k.beginPath();k.arc(24,23,7,0,7);k.stroke();k.beginPath();for(let i=0;i<3;i++){const a=i*2.094-1.57;k[i?'lineTo':'moveTo'](24+Math.cos(a)*7,23+Math.sin(a)*7)}k.closePath();k.stroke();k.shadowBlur=0;
 k.fillStyle='#c0392b';k.fillRect(22,34,4,10);k.beginPath();k.moveTo(22,44);k.lineTo(24,41);k.lineTo(26,44);k.fill();return k.canvas}
function cancelRecall(msg){if(P.recall>0&&msg)say(msg);P.recall=0;const e=document.getElementById('tsr');if(e)e.classList.remove('on')}
function useScroll(){if(PAUSED)return;
 if(P.recall>0){cancelRecall('ยกเลิกการวาปแล้ว');return}
 if(D&&(D.town||D.shop)){say('คุณอยู่ในเมืองเอลโดเรียอยู่แล้ว');return}
 if(inv.scroll<1){say('ไม่มีม้วนวาป — ซื้อได้ที่ร้านขายยาในเมือง ('+RECALL.price+' เหรียญ)');return}
 if(P.stun>0||P.dash>0||P.at>=0)return;
 P.recall=P.recallMax=RECALL.cast;sfx('heal');(document.getElementById('tsr')||{classList:{add(){},remove(){}}}).classList.add('on');say('กำลังร่ายม้วนวาปกลับเมือง… ยืนนิ่ง ๆ '+RECALL.cast+' วินาที (ขยับหรือโดนตีจะยกเลิก)')}
function recallTick(dt){if(P.recall<=0)return;
 if(P.mv||P.dash>0||P.at>=0||P.stun>0){cancelRecall('ขยับตัว — การวาปถูกยกเลิก');return}
 P.recall-=dt;if(Math.random()<dt*45)fx.push({x:P.x+(Math.random()-.5)*44,y:P.y-2,vx:0,vy:-90-Math.random()*60,l:.6,c:'235,245,255'});
 if(P.recall<=0){P.recall=0;inv.scroll--;refreshInv();for(let i=0;i<24;i++)fx.push({x:P.x,y:P.y-20,vx:(Math.random()-.5)*180,vy:-40-Math.random()*120,l:.8,c:'240,248,255'});
  (document.getElementById('tsr')||{classList:{add(){},remove(){}}}).classList.remove('on');say('วาปกลับเมืองสำเร็จ! เหลือม้วนวาป ×'+inv.scroll);toTown()}}
// วงเวทใต้เท้า + แสงพุ่งขึ้น + แถบเวลาร่าย (เรียกจาก hero())
function recallFx(){const u=1-P.recall/P.recallMax,t=performance.now()/1000,x=P.x,y=P.y;ctx.save();ctx.translate(x,y);
 ctx.save();ctx.scale(1,.5);ctx.shadowColor='#bfe0ff';ctx.shadowBlur=12;ctx.strokeStyle='rgba(235,245,255,.95)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,26,0,6.283);ctx.stroke();
 ctx.rotate(t*1.6);ctx.beginPath();for(let i=0;i<3;i++){const a=i*2.094;ctx.moveTo(Math.cos(a)*16,Math.sin(a)*16);ctx.lineTo(Math.cos(a+2.094)*16,Math.sin(a+2.094)*16)}ctx.stroke();
 ctx.rotate(-t*3.2);ctx.beginPath();ctx.arc(0,0,10+u*6,0,6.283);ctx.stroke();ctx.restore();
 const g=ctx.createLinearGradient(0,0,0,-96);g.addColorStop(0,'rgba(225,240,255,'+(.25+.45*u)+')');g.addColorStop(1,'rgba(200,225,255,0)');ctx.fillStyle=g;ctx.fillRect(-16,-96,32,96);ctx.restore();
 ctx.fillStyle='#000b';ctx.fillRect(x-17,y-70,34,6);ctx.fillStyle='#e8f4ff';ctx.fillRect(x-16,y-69,32*u,4)}
function buyScroll(){if(inv.coin<RECALL.price){say('เหรียญไม่พอ (ต้องใช้ '+RECALL.price+' เหรียญ)');return}inv.coin-=RECALL.price;inv.scroll++;sfx('coin');refreshInv();say('ซื้อม้วนวาปแล้ว มี ×'+inv.scroll+' (กด 4 หรือ T เพื่อใช้)');if(SHOPK)openShop(SHOPK)}
// ช่องไอเท็มในแถบด้านล่าง + ช่องในกระเป๋า
{const d=document.createElement('div');d.className='ts';d.id='tsr';d.title='ม้วนวาปกลับเมือง (4 / T)';d.appendChild(scrollIcon(48));
 const b=document.createElement('b');b.textContent='4';d.appendChild(b);const e=document.createElement('em');e.id='scrollbadge';e.textContent=inv.scroll;d.appendChild(e);d.onclick=useScroll;document.getElementById('bar').appendChild(d);
 refreshInv()}
