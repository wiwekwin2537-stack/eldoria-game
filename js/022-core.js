// ---- ร้านค้า: เปิดประตูเข้าไปข้างใน · เจ้าของร้านยืนขายหลังเคาน์เตอร์ · หน้าต่างซื้อ/ขาย ----
// ข้อมูลร้าน (ป้าย ประตู เจ้าของ ของขาย) อยู่ที่ data/shops.js · ภาพร้านอยู่ที่ js/shopart.js
let SHOPK=null;                 // ร้านที่หน้าต่างซื้อขายเปิดอยู่
let TOWNSAVE=null;              // เก็บฉากเมืองไว้ตอนอยู่ในร้าน (ออกมาแล้วทุกอย่างอยู่ที่เดิม)
const DOORA={k:null,t:0};       // แอนิเมชันเปิดประตู+เดินเข้า
const DF={id:null,open:0,target:0}; // สถานะบานประตูที่วาดอยู่ (open 0..1)
const SHOPCV={};                // ฉากในร้านที่วาดแล้ว (วาดครั้งเดียวต่อร้าน)

// ---------- ลูกโป่งคำพูด ----------
function bubble(txt,x,y,a){ctx.save();ctx.globalAlpha=a==null?1:a;ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';
 const MAXW=170,lines=[];let cur='';for(const ch of txt){const nx=cur+ch;if(ctx.measureText(nx).width>MAXW&&cur){lines.push(cur);cur=ch}else cur=nx}if(cur)lines.push(cur);
 const w=Math.max(...lines.map(l=>ctx.measureText(l).width))+14,h=lines.length*14+9,x0=Math.round(x-w/2),y0=Math.round(y-h);
 ctx.fillStyle='rgba(0,0,0,.28)';rr(ctx,x0+2,y0+3,w,h,7);ctx.fill();ctx.fillStyle='#fffbe9';rr(ctx,x0,y0,w,h,7);ctx.fill();ctx.strokeStyle='#5a4426';ctx.lineWidth=1.4;ctx.stroke();
 ctx.beginPath();ctx.moveTo(x-5,y0+h-.5);ctx.lineTo(x,y0+h+6);ctx.lineTo(x+5,y0+h-.5);ctx.closePath();ctx.fillStyle='#fffbe9';ctx.fill();ctx.stroke();
 ctx.fillStyle='#fffbe9';ctx.fillRect(x-4,y0+h-2,8,3);
 ctx.fillStyle='#2a1a0a';ctx.textAlign='center';lines.forEach((l,i)=>ctx.fillText(l,x,y0+14+i*14));ctx.textAlign='left';ctx.restore()}

// ---------- ประตูร้านในเมือง ----------
function doorGeom(id){const S=SHOP_DATA[id]||{b:LOCKED_HOUSE.b,door:LOCKED_HOUSE.door},[bx,by]=S.b,w=S.door.w;return{x:bx*T+S.door.x,w,top:by*T+S.door.t,bot:by*T+S.door.bt}}
function startDoor(id){if(DOORA.k)return;DOORA.k=id;DOORA.t=0;P.dir='u';P.kx=P.ky=0;if(shopEl)shopEl.hidden=true;DF.id=id;DF.open=0;DF.target=1;sfx('door');say(SHOP_DATA[id].emoji+' เปิดประตู'+SHOP_DATA[id].name+'…')}
function doorTick(dt){const d=D.doors.find(q=>q.id===DOORA.k);if(!d||!D.town){DOORA.k=null;DF.id=null;return}DOORA.t+=dt;
 if(DOORA.t>.38){P.mv=true;P.dir='u';P.t+=dt*8;P.x+=(d.cx-P.x)*Math.min(1,dt*9);P.y-=64*dt}
 if(DOORA.t>.95){const id=DOORA.k;DOORA.k=null;enterShop(id)}}
// บานประตู (วาดแทรกตามความลึก: ผู้เล่นเดินเข้าไปแล้วถูกประตูบังเอง)
function doorLayer(t){if(!DF.id)return[];DF.open+=(DF.target-DF.open)*Math.min(1,DT*7);if(DF.target===0&&DF.open<.03){DF.id=null;return[]}
 const g=doorGeom(DF.id);return[[g.bot-1,()=>drawDoor(g,DF.open)]]}
function drawDoor(g,o){const r=g.w/2,cx=g.x+r;ctx.save();ctx.beginPath();ctx.moveTo(g.x,g.bot);ctx.lineTo(g.x,g.top+r);ctx.arc(cx,g.top+r,r,Math.PI,0);ctx.lineTo(g.x+g.w,g.bot);ctx.closePath();ctx.clip();
 const gr=ctx.createLinearGradient(0,g.top,0,g.bot);gr.addColorStop(0,'#1a1208');gr.addColorStop(1,'#d9a85a');ctx.globalAlpha=Math.min(1,o*1.6);ctx.fillStyle=gr;ctx.fillRect(g.x,g.top,g.w,g.bot-g.top);ctx.globalAlpha=1;
 const lw=(g.w/2)*(1-o*.88);for(const left of [1,0]){const x0=left?g.x:g.x+g.w-lw;const gg=ctx.createLinearGradient(x0,0,x0+lw,0);gg.addColorStop(0,left?'#8a5a32':'#6a4322');gg.addColorStop(1,left?'#6a4322':'#8a5a32');ctx.fillStyle=gg;ctx.fillRect(x0,g.top,lw,g.bot-g.top);
  ctx.strokeStyle='rgba(30,16,6,.5)';ctx.lineWidth=1;for(let y=g.top+10;y<g.bot;y+=12){ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+lw,y);ctx.stroke()}ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(left?x0+lw-2:x0,g.top,2,g.bot-g.top);
  if(lw>6){ctx.fillStyle='#e0b84a';ctx.beginPath();ctx.arc(left?x0+lw-5:x0+5,(g.top+g.bot)/2+8,1.8,0,7);ctx.fill()}}
 ctx.restore()}
function drawDoorPrompt(t){if(DOORA.k||D.shop)return;const d=doorNear();if(!d)return;const txt=d.id==='locked'?'🔒 บ้านชาวบ้าน (ล็อก)':'กด E / ⚔️ เปิดประตู · '+SHOP_DATA[d.id].emoji+' '+SHOP_DATA[d.id].name;
 ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';const w=ctx.measureText(txt).width+16,x=d.cx,y=d.cy+44+Math.sin(t*4)*2;
 ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(x-w/2,y-13,w,19);ctx.strokeStyle='#e8c14a';ctx.lineWidth=1;ctx.strokeRect(x-w/2+.5,y-12.5,w-1,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(txt,x,y);ctx.textAlign='left'}

// ---------- เข้า/ออกร้าน ----------
function shopCanvas(id){if(SHOPCV[id])return SHOPCV[id];const c=document.createElement('canvas');c.width=IW*T;c.height=IH*T;const k=c.getContext('2d');SHOP_ART[id](k);return SHOPCV[id]=c}
function enterShop(id){const S=SHOP_DATA[id];TOWNSAVE={D,dm,dcv,MI,id};
 fade('#000');sfx('bell');setScene('shop');DF.id=null;
 dm=[];for(let y=0;y<IH;y++){dm[y]=[];for(let x=0;x<IW;x++)dm[y][x]=(x===0||x===IW-1||y<2||y===IH-1)?WL:FL}
 for(let x=1;x<IW-1;x++){dm[2][x]=WL;dm[3][x]=WL}       // เคาน์เตอร์+ฐานตกแต่งปิดทั้งแถว: เดินอ้อมไปหลังร้านไม่ได้
 for(const [x,y] of S.solid)dm[y][x+OXT]=WL;for(const [x,y] of (WINGSOL[id]||[]))dm[y][x]=WL;
 dm[IH-1][(IW>>1)-1]=GATE;dm[IH-1][IW>>1]=GATE;
 dcv=shopCanvas(id);
 const ox=(S.owner.x||256)+OX,o=mkNPC({x:ox/T,y:3,name:S.owner.name,c:S.owner.c,h:S.owner.h,lines:S.owner.lines,fixed:1,g:S.owner.g,age:S.owner.age,hs:S.owner.hs,beard:S.owner.beard,mu:S.owner.mu,hat:S.owner.hat,apron:S.owner.apron,sk:S.owner.sk});o.y=3*T+18;o.dir='d';o.greet=S.owner.greet;o.idleT=3+Math.random()*3;
 D={shop:id,S,npcs:[o],owner:o,carts:[],stalls:[]};
 mkMini(dcv,IW,IH,5);P.x=(IW>>1)*T;P.y=(IH-1.6)*T;P.dir='u';P.kx=P.ky=0;P.dash=0;P.mv=false;
 o.wave=1.6;o.bub={txt:S.owner.greet[(Math.random()*S.owner.greet.length)|0],t:3.4};
 say(S.emoji+' '+S.name+' — เดินไปหน้าเคาน์เตอร์แล้วกด E/⚔️ คุยกับ'+S.owner.name+' · เดินชนทางออกด้านล่างเพื่อออก')}
function leaveShop(silent){if(!D||!D.shop||!TOWNSAVE)return;const id=D.shop,sv=TOWNSAVE;TOWNSAVE=null;
 D=sv.D;dm=sv.dm;dcv=sv.dcv;setMini(sv.MI);shopEl.hidden=true;SHOPK=null;setScene('town');document.getElementById('bar').style.visibility='';
 if(silent)return;
 const d=D.doors.find(q=>q.id===id);P.x=d.cx;P.y=d.cy+24;P.dir='d';P.kx=P.ky=0;P.dash=0;
 DF.id=id;DF.open=1;DF.target=0;fade('#000');sfx('door');say('ออกจาก'+SHOP_DATA[id].name+'แล้ว')}

// ---------- ในร้าน ----------
function shopNear(){const o=D.owner;return o&&Math.hypot(P.x-o.x,P.y-o.y)<(D.shop==='hall'?118:80)&&P.y>3*T+20}
function shopAct(){if(!shopNear())return false;const o=D.owner;o.wave=1.2;o.dir='d';o.bub={txt:o.lines[o.i++%o.lines.length],t:3.2};openShop(D.shop);return true}
function updShop(dt){const o=D.owner;if(!o)return;o.mv=false;if(o.wave>0)o.wave-=dt;if(o.bub&&(o.bub.t-=dt)<=0)o.bub=null;
 o.idleT-=dt;if(o.idleT<=0){o.idleT=6+Math.random()*5;if(!o.bub&&shopEl.hidden&&Math.hypot(P.x-o.x,P.y-o.y)<260)o.bub={txt:o.lines[o.i++%o.lines.length],t:3.2}}
 if(!shopEl.hidden&&!shopNear()&&!STN.open){shopEl.hidden=true;SHOPK=null}}
function drawShop(){const t=performance.now()/1000,S=D.S,o=D.owner,sc=Math.min(VW/(IW*T),VH/(IH*T));
 ui();ctx.fillStyle='#0b0a0e';ctx.fillRect(0,0,VW,VH);
 ctx.setTransform(RES*sc,0,0,RES*sc,RES*(VW-IW*T*sc)/2,RES*(VH-IH*T*sc)/2);
 ctx.drawImage(dcv,0,0);
 ctx.save();ctx.translate(o.x,o.y);ctx.scale(1.3,1.3);ctx.translate(-o.x,-o.y);drawNPC(o,t);ctx.restore();const sx=Math.round(o.x-46);ctx.drawImage(dcv,sx,3*T+2,92,T-1,sx,3*T+2,92,T-1);   // วาดเคาน์เตอร์ทับตัวเจ้าของ = ยืนอยู่หลังเคาน์เตอร์
 SHOP_ANIM[D.shop](t);
 drawGhosts();drawDrops();
 const L=[[P.y,()=>{ctx.globalAlpha=(P.iframe>0&&P.dash<=0&&Math.floor(P.iframe*14)%2)?.3:1;hero();ctx.globalAlpha=1}]];
 if(D.shop==='gear'){L.push([6*T+30,()=>drawMannequin(14*T+16,6*T+30)],[8*T+30,()=>drawMannequin(1*T+16,8*T+30)])}
 L.sort((p,q)=>p[0]-q[0]);for(const l of L)l[1]();
  drawBubbles();
  for(const p of fx){ctx.fillStyle=`rgba(${p.c||'90,170,255'},${Math.min(1,p.l*2)})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,7);ctx.fill()}
 ctx.fillStyle=SHOP_TINT[D.shop];ctx.fillRect(0,0,IW*T,IH*T);
 if(shopNear()&&shopEl.hidden){const txt='กด E / ⚔️ คุยกับ'+o.name,y=o.y+20+Math.sin(t*4)*2;ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';const w=ctx.measureText(txt).width+16;
  ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(o.x-w/2,y-13+56,w,19);ctx.strokeStyle='#e8c14a';ctx.lineWidth=1;ctx.strokeRect(o.x-w/2+.5,y-12.5+56,w-1,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(txt,o.x,y+56);ctx.textAlign='left'}
 ui();
 if(P.red>0){ctx.fillStyle='rgba(255,0,0,'+P.red+')';ctx.fillRect(0,0,VW,VH)}}

// ---------- หน้าต่างซื้อ/ขาย ----------
function openShop(id){SHOPK=id;sfx('ui');const S=SHOP_DATA[id];
 const sl=([it,nm,pr])=>`<button class="mini" onclick="sellIt('${it}',${pr})">ขาย${nm} ×${inv[it]} (+${pr}/ชิ้น)</button>`;
 const by=b=>`<button class="mini" onclick="buyItem('${b.id}')">${b.emoji} ${b.name} −${b.price} 🪙<small>${b.note}${b.id==='scroll'?' (มี ×'+inv.scroll+')':''}</small></button>`;
 shopEl.innerHTML='<b>'+S.emoji+' '+S.name+'</b><small>'+S.owner.name+' · เหรียญของคุณ 🪙 '+inv.coin+'</small>'+S.sell.map(sl).join('')+S.buy.map(by).join('')+'<button class="mini" onclick="closeShop()">ปิด</button>';shopEl.hidden=false}
function closeShop(){shopEl.hidden=true;SHOPK=null;sfx('ui')}
function sellIt(it,pr){const n=inv[it];if(!n){say('ไม่มีของให้ขาย');return}inv[it]=0;inv.coin+=n*pr;sfx('coin');refreshInv();say('ขายได้ '+n*pr+' เหรียญ');if(D&&D.owner)D.owner.bub={txt:'ขอบคุณที่อุดหนุนนะ!',t:2.4};openShop(SHOPK)}
function buyItem(id){const S=SHOP_DATA[SHOPK],b=S.buy.find(q=>q.id===id);if(!b)return;
 if(id==='scroll'){buyScroll();return}
 if(id==='rest'){rest();openShop(SHOPK);return}
 if(inv.coin<b.price){say('เหรียญไม่พอ (ต้องใช้ '+b.price+' เหรียญ)');sfx('thud');return}
 if((b.hp&&!b.mp&&P.hp>=BAL.hp)||(b.mp&&!b.hp&&P.mp>=BAL.mp)){say(b.hp?'เลือดเต็มอยู่แล้ว':'มานาเต็มอยู่แล้ว');return}
 inv.coin-=b.price;if(b.hp)P.hp=Math.min(BAL.hp,P.hp+b.hp);if(b.mp)P.mp=Math.min(BAL.mp,P.mp+b.mp);refreshInv();sfx(id==='beer'?'coin':'heal');
 say(b.emoji+' '+b.name+(b.hp?' เลือด +'+b.hp:'')+(b.mp?' มานา +'+b.mp:''));if(D&&D.owner)D.owner.bub={txt:'ขอบคุณจ้า!',t:2};openShop(SHOPK)}
function rest(){if(inv.coin<10){say('เหรียญไม่พอ');return}inv.coin-=10;P.hp=BAL.hp;P.mp=BAL.mp;refreshInv();sfx('heal');say('หลับสบาย เลือดและมานาเต็มแล้ว')}
