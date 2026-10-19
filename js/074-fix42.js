// fix42 (v4.47) — อาวุธอาชีพย้ายไปคราฟที่โต๊ะคราฟ · อาคารหอคอยบอสพร้อมประตูในเมือง · แมพป่าใหม่ 3 แมพ (ใหญ่ 88×60) คั่นระหว่างทุ่งหญ้า→ป่าหมอก
try{
// =================== A) อาวุธประจำอาชีพ: คราฟเองที่โต๊ะคราฟ ===================
const cwExtra42=t=>({coin:400*(t+1),ess:2+t});
window.craftCw42=function(t){t|=0;if(P.cls==='none'||!CW27[P.cls]){say('ต้องมีอาชีพก่อนจึงจะคราฟอาวุธประจำอาชีพได้');sfx('thud');return}
 const base=NEEDW[P.cls]+t,id=cwId27(P.cls,t);if(!ITEMS[base]||!ITEMS[id])return;
 const R=recipe12(base),X=cwExtra42(t);
 if((inv.coin|0)<(R.coin||0)+X.coin||(inv.ess|0)<(R.ess||0)+X.ess){say('วัตถุดิบไม่พอ: ต้องใช้ 🪙 '+((R.coin||0)+X.coin)+' · แก่นเวทมนตร์ '+((R.ess||0)+X.ess)+' (มี 🪙 '+(inv.coin|0)+' · แก่นเวท '+(inv.ess|0)+')');sfx('thud');return}
 const g0=GEAR[base]|0;craftSet12(base);
 if((GEAR[base]|0)!==g0+1)return; // คราฟไม่ผ่าน (ล็อกตำรา/ของไม่พอ/กระเป๋าเต็ม) — craftSet12 แจ้งเหตุผลแล้ว
 GEAR[base]--;if(GEAR[base]<=0)delete GEAR[base];GEAR[id]=(GEAR[id]|0)+1;inv.coin-=X.coin;inv.ess-=X.ess;
 try{refreshInv();saveGame(true)}catch(e){}sfx('warp');try{flash(CW27[P.cls][2],.25)}catch(e){}
 say('⚒️ คราฟ '+ITEMS[id].name+' สำเร็จ! — '+desc26(CW27[P.cls][1])+' · เปิดกระเป๋า 🎒 เพื่อสวมใส่');try{chatAnn((P.name||'ผู้กล้า')+' คราฟ '+ITEMS[id].name+' สำเร็จ!')}catch(e){}
 try{openForge('anvil')}catch(e){}};
{const _ah=anvilHTML;anvilHTML=function(){let h=_ah();try{
 if(FUI.tab!=='craft'||(FUI.cat||'weapon')!=='weapon')return h;
 const close='<button class="mini" onclick="closeForge()">ปิด</button>',at=h.lastIndexOf(close);if(at<0)return h;
 let x='<div class="cw42h">⚒️ อาวุธประจำอาชีพ</div>';
 if(P.cls==='none'||!CW27[P.cls])x+='<small style="opacity:.8">เลือกอาชีพที่ปรมาจารย์อาชีพก่อน (Lv.'+CLASS_LV+') แล้วกลับมาคราฟอาวุธประจำอาชีพได้ที่นี่</small>';
 else{const t=FUI.tier|0,base=NEEDW[P.cls]+t,id=cwId27(P.cls,t),W=CW27[P.cls];
  if(ITEMS[base]&&ITEMS[id]){const R=recipe12(base),X=cwExtra42(t),A=Object.assign({},R);A.coin=(A.coin||0)+X.coin;A.ess=(A.ess||0)+X.ess;
   const ok=t<=SMITH.u&&hasAll12(A),own=owned(id);
   x+='<button class="mini cr cw42'+(ok?'':' no')+'" onclick="craftCw42('+t+')">'+imgT('item:'+id,'lg')+'<span style="color:'+W[2]+'">'+ITEMS[id].name+'</span>'+(own?' (มี ×'+own+')':'')+'<small>เฉพาะ'+CLS[P.cls].n+' · ✨ '+desc26(W[1])+'<br>'+(ITEMS[id].stat||'').split(' · ✨')[0]+'<br>'+Object.entries(A).map(([q,v])=>'<span style="color:'+((inv[q]|0)>=v?'#9fe89a':'#ff9a8a')+'">'+(q==='coin'?'🪙':MN(q))+' '+v+'</span>').join(' · ')+'</small></button>'}}
 return h.slice(0,at)+x+h.slice(at)}catch(e){console.warn('[cw42]',e);return h}}}
{const st=document.createElement('style');st.textContent='.cw42h{margin:8px 0 2px;font-weight:700;font-size:12px;color:#ffd23a;border-top:1px solid rgba(255,210,80,.35);padding-top:6px}.mini.cw42{border-color:rgba(255,210,80,.6)!important;background:linear-gradient(90deg,rgba(255,210,80,.12),rgba(255,255,255,.03))!important}';document.head.appendChild(st)}
// ปรมาจารย์อาชีพ: เลิกหลอม — บอกทางไปโต๊ะคราฟแทน
window.cwForge27=function(){say('⚒️ อาวุธประจำอาชีพย้ายไปคราฟที่โต๊ะคราฟแล้ว (แท็บ ⚔️ อาวุธ)');sfx('ui')};
{const _oc=openClassMenu;openClassMenu=function(){_oc();try{for(const el of shopEl.querySelectorAll('.cw27'))el.remove();if(P.cls==='none'||shopEl.hidden||!CW27[P.cls])return;
  const b=shopEl.querySelector('small');if(b)b.insertAdjacentHTML('afterend','<div class="cw27"><div><b style="color:'+CW27[P.cls][2]+'">⚒️ อาวุธประจำอาชีพ: '+CW27[P.cls][0]+'</b><small>ย้ายไปคราฟเองที่ <b>โต๊ะคราฟ → แท็บ ⚔️ อาวุธ</b> แล้ว (ใช้วัตถุดิบของอาวุธเซ็ตนั้น + เหรียญ + แก่นเวทมนตร์เพิ่ม)</small></div></div>')}catch(e){}};window.openClassMenu=openClassMenu}

// =================== B) อาคารหอคอยบอสในเมือง (แทนบ้านชาวบ้านมุมขวาบน) ===================
const TWR42={bx:36,by:4,bw:5,bh:4,dx:38.5*T,dy:8*T};
function twrArt42(){const W=200,H=300,c=document.createElement('canvas');c.width=W;c.height=H;const k=c.getContext('2d'),cx=W/2,base=H-8,R=(a,b)=>a+Math.random()*(b-a);
 const paint=()=>{k.clearRect(0,0,W,H);TOWNART.paint(k,'tower',0,0,W,H);k.font='bold 11px system-ui';k.textAlign='center';k.fillStyle='#21152de8';k.fillRect(45,H-26,110,18);k.fillStyle='#ffe9a0';k.fillText('หอคอยบอส',W/2,H-13)};if(TOWNART.ready('tower')){paint();return c}TOWNART.watch(()=>{if(TOWNART.ready('tower'))paint()});
 // เงาพื้น
 k.fillStyle='rgba(0,0,0,.32)';k.beginPath();k.ellipse(cx+6,base,92,14,0,0,7);k.fill();
 // ฐานขั้นบันไดหิน
 for(let i=0;i<3;i++){const w=168-i*14,y=base-10-i*9,g=k.createLinearGradient(0,y,0,y+11);g.addColorStop(0,'#9a96a6');g.addColorStop(1,'#5a5666');k.fillStyle=g;k.fillRect(cx-w/2,y,w,11);k.strokeStyle='#2a2832';k.lineWidth=1;k.strokeRect(cx-w/2+.5,y+.5,w-1,10)}
 const bodyTop=56,bodyBot=base-36,wTop=104,wBot=128;
 // ตัวหอทรงกระบอก (ไล่แสงซ้ายสว่าง ขวามืด)
 k.save();k.beginPath();k.moveTo(cx-wBot/2,bodyBot);k.lineTo(cx-wTop/2,bodyTop);k.lineTo(cx+wTop/2,bodyTop);k.lineTo(cx+wBot/2,bodyBot);k.closePath();k.clip();
 const g=k.createLinearGradient(cx-wBot/2,0,cx+wBot/2,0);g.addColorStop(0,'#5a5468');g.addColorStop(.3,'#a8a2b8');g.addColorStop(.55,'#7a7488');g.addColorStop(1,'#2e2a3a');k.fillStyle=g;k.fillRect(0,0,W,H);
 for(let y=bodyTop,r=0;y<bodyBot;y+=11,r++){k.strokeStyle='rgba(20,16,30,.45)';k.lineWidth=1;k.beginPath();k.moveTo(0,y);k.lineTo(W,y);k.stroke();
  for(let x=cx-wBot/2+(r%2?9:0);x<cx+wBot/2;x+=18){k.beginPath();k.moveTo(x,y);k.lineTo(x,y+11);k.stroke();if(Math.random()<.12){k.fillStyle='rgba(0,0,0,.12)';k.fillRect(x+1,y+1,16,9)}}}
 // มอส/รอยแตก
 for(let i=0;i<14;i++){k.fillStyle='rgba(70,110,60,'+R(.15,.35)+')';k.beginPath();k.ellipse(R(cx-60,cx+60),R(bodyBot-60,bodyBot),R(3,8),R(2,4),0,0,7);k.fill()}
 k.restore();k.strokeStyle='#1a1624';k.lineWidth=2;k.beginPath();k.moveTo(cx-wBot/2,bodyBot);k.lineTo(cx-wTop/2,bodyTop);k.moveTo(cx+wBot/2,bodyBot);k.lineTo(cx+wTop/2,bodyTop);k.stroke();
 // แถบหินคาดกลาง
 for(const y of [bodyTop+60,bodyTop+120]){const w=wTop+(wBot-wTop)*((y-bodyTop)/(bodyBot-bodyTop))+8,gg=k.createLinearGradient(cx-w/2,0,cx+w/2,0);gg.addColorStop(0,'#6a6478');gg.addColorStop(.3,'#c8c2d8');gg.addColorStop(1,'#3a3648');k.fillStyle=gg;k.fillRect(cx-w/2,y,w,7);k.strokeStyle='#1a1624';k.strokeRect(cx-w/2+.5,y+.5,w-1,6)}
 // หน้าต่างเรืองม่วง
 const win=(x,y,w,h)=>{k.fillStyle='#120c1e';k.beginPath();k.moveTo(x-w/2,y+h);k.lineTo(x-w/2,y+w/2);k.arc(x,y+w/2,w/2,Math.PI,0);k.lineTo(x+w/2,y+h);k.closePath();k.fill();
  const wg=k.createLinearGradient(0,y,0,y+h);wg.addColorStop(0,'#e8c8ff');wg.addColorStop(1,'#8a4ad8');k.fillStyle=wg;k.globalAlpha=.85;k.beginPath();k.moveTo(x-w/2+2,y+h-1);k.lineTo(x-w/2+2,y+w/2);k.arc(x,y+w/2,w/2-2,Math.PI,0);k.lineTo(x+w/2-2,y+h-1);k.closePath();k.fill();k.globalAlpha=1;
  k.strokeStyle='#2a1a3a';k.lineWidth=1.2;k.beginPath();k.moveTo(x,y+2);k.lineTo(x,y+h);k.moveTo(x-w/2,y+h*.55);k.lineTo(x+w/2,y+h*.55);k.stroke()};
 win(cx-26,bodyTop+20,13,24);win(cx+26,bodyTop+20,13,24);win(cx,bodyTop+78,15,28);
 // ธงม่วง
 for(const s of [-1,1]){const x=cx+s*44;k.fillStyle='#4a1a6a';k.beginPath();k.moveTo(x-9,bodyTop+72);k.lineTo(x+9,bodyTop+72);k.lineTo(x+9,bodyTop+118);k.lineTo(x,bodyTop+110);k.lineTo(x-9,bodyTop+118);k.closePath();k.fill();k.strokeStyle='#d8a83a';k.lineWidth=1.4;k.stroke();
  k.fillStyle='#ffd23a';k.font='bold 12px sans-serif';k.textAlign='center';k.fillText('✦',x,bodyTop+96)}
 // เชิงเทิน
 const cw=wTop+16;k.fillStyle='#8a8498';k.fillRect(cx-cw/2,bodyTop-10,cw,12);k.strokeStyle='#1a1624';k.strokeRect(cx-cw/2+.5,bodyTop-9.5,cw-1,11);
 for(let i=0;i<7;i++){const x=cx-cw/2+i*(cw/7)+2;const mg=k.createLinearGradient(x,0,x+11,0);mg.addColorStop(0,'#b8b2c8');mg.addColorStop(1,'#5a5468');k.fillStyle=mg;k.fillRect(x,bodyTop-22,11,13);k.strokeRect(x+.5,bodyTop-21.5,10,12)}
 // หลังคากรวย + ยอดลูกแก้ว
 const rg=k.createLinearGradient(cx-50,0,cx+50,0);rg.addColorStop(0,'#3a1a5a');rg.addColorStop(.35,'#7a4ab8');rg.addColorStop(1,'#1e0e30');k.fillStyle=rg;k.beginPath();k.moveTo(cx-46,bodyTop-22);k.lineTo(cx,6+14);k.lineTo(cx+46,bodyTop-22);k.closePath();k.fill();k.strokeStyle='#120820';k.lineWidth=1.6;k.stroke();
 k.strokeStyle='rgba(255,255,255,.18)';for(let i=1;i<5;i++){k.beginPath();k.moveTo(cx-46+i*18,bodyTop-22);k.lineTo(cx,20);k.stroke()}
 const og=k.createRadialGradient(cx,14,0,cx,14,16);og.addColorStop(0,'#ffffff');og.addColorStop(.35,'#d8a8ff');og.addColorStop(1,'rgba(150,80,255,0)');k.fillStyle=og;k.fillRect(cx-16,-2,32,32);k.fillStyle='#e8d0ff';k.beginPath();k.arc(cx,14,5,0,7);k.fill();
 // ประตูโค้ง + กรอบหิน + ไฟคบเพลิง
 const dw=44,dh=58,dy0=bodyBot-dh;k.fillStyle='#4a4458';k.beginPath();k.moveTo(cx-dw/2-7,bodyBot+2);k.lineTo(cx-dw/2-7,dy0+dw/2);k.arc(cx,dy0+dw/2,dw/2+7,Math.PI,0);k.lineTo(cx+dw/2+7,bodyBot+2);k.closePath();k.fill();
 for(let i=0;i<9;i++){const a=Math.PI+i*Math.PI/8,x=cx+Math.cos(a)*(dw/2+3.5),y=dy0+dw/2+Math.sin(a)*(dw/2+3.5);k.fillStyle=i===4?'#ffd23a':'#9a94aa';k.beginPath();k.arc(x,y,3.4,0,7);k.fill()}
 const dg=k.createLinearGradient(cx-dw/2,0,cx+dw/2,0);dg.addColorStop(0,'#3a2010');dg.addColorStop(.5,'#6a3e1e');dg.addColorStop(1,'#2a1608');k.fillStyle=dg;k.beginPath();k.moveTo(cx-dw/2,bodyBot);k.lineTo(cx-dw/2,dy0+dw/2);k.arc(cx,dy0+dw/2,dw/2,Math.PI,0);k.lineTo(cx+dw/2,bodyBot);k.closePath();k.fill();
 k.strokeStyle='rgba(20,10,4,.7)';k.lineWidth=1;for(let x=cx-dw/2+7;x<cx+dw/2;x+=7){k.beginPath();k.moveTo(x,dy0+6);k.lineTo(x,bodyBot);k.stroke()}
 k.fillStyle='#2a2a32';for(const y of [dy0+20,dy0+44]){k.fillRect(cx-dw/2,y,dw,4)}k.fillStyle='#c8a050';k.beginPath();k.arc(cx+12,dy0+34,2.6,0,7);k.fill();
 k.globalCompositeOperation='lighter';const rgw=k.createRadialGradient(cx,dy0+20,0,cx,dy0+20,40);rgw.addColorStop(0,'rgba(190,120,255,.35)');rgw.addColorStop(1,'rgba(150,80,255,0)');k.fillStyle=rgw;k.fillRect(cx-40,dy0-20,80,80);k.globalCompositeOperation='source-over';
 for(const s of [-1,1]){const x=cx+s*(dw/2+16),y=bodyBot-40;k.fillStyle='#2a2a32';k.fillRect(x-2,y,4,16);const fg=k.createRadialGradient(x,y-4,0,x,y-4,12);fg.addColorStop(0,'#fff4b0');fg.addColorStop(.4,'#ff9a2a');fg.addColorStop(1,'rgba(255,80,0,0)');k.fillStyle=fg;k.fillRect(x-12,y-16,24,24)}
 // ป้ายชื่อ
 k.fillStyle='#2a1a3a';k.strokeStyle='#d8a83a';k.lineWidth=2;const pw=96;k.fillRect(cx-pw/2,dy0-26,pw,17);k.strokeRect(cx-pw/2,dy0-26,pw,17);k.fillStyle='#ffe9a0';k.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillText('🗼 หอคอยบอส',cx,dy0-13);
 return c}
function twrPlace42(){if(!(D&&D.town&&dcv)||D.twr42)return;D.twr42=1;try{const k=dcv.getContext('2d'),{bx,by,bw,bh}=TWR42;
  for(let y=by-1;y<by+bh+1;y++)for(let x=bx-1;x<bx+bw+1;x++){if(D.road&&D.road.has(y*TW+x))continue;if(x<0||y<0||x>=TW||y>=TH)continue;k.drawImage(grassV[gv(x,y)],x*T,y*T)}
  for(let y=by;y<by+bh;y++)for(let x=bx;x<bx+bw;x++)if(dm[y])dm[y][x]=1;
  if(!TWR42.art)TWR42.art=twrArt42();const A=TWR42.art,x0=TWR42.dx-A.width/2,y0=TWR42.dy+8-A.height;
  if(window.prop){prop(kk=>kk.drawImage(A,x0,y0),TWR42.dy+6,x0,y0,A.width,A.height,false,true);const pr=TOWNPROPS[TOWNPROPS.length-1];if(D.stalls&&pr&&!D.stalls.includes(pr))D.stalls.push(pr)}else k.drawImage(A,x0,y0);
  try{mkMini(dcv,TW,TH,2.6)}catch(e){}}catch(e){console.warn('[twr42]',e)}}
// v4.51: เมืองที่สร้างก่อนแพตช์นี้โหลด (เข้าเกมครั้งแรก) ไม่มีหอคอย → วางซ้ำได้ทุกเมื่อแบบไม่ซ้อน (D.twr42)
{const _bt=buildTown;buildTown=function(){_bt();twrPlace42()}}setInterval(()=>{try{twrPlace42()}catch(e){}},1000);
const twrNear42=()=>D&&D.town&&Math.abs(P.x-TWR42.dx)<30&&P.y>TWR42.dy-6&&P.y<TWR42.dy+34;
{const _it=interact;interact=function(){if(twrNear42()){try{openTower10()}catch(e){}return true}return _it.apply(this,arguments)}}

// =================== C) แมพป่าคั่น 3 แมพ (ใหญ่ 88×60) ===================
OREK.treeN={n:'ต้นไม้ป่า',req:0,hp:7,drop:'wood',cnt:[1,3],xp:6,fx:'140,200,110',tree:1};
try{CUTSPR16.treeN=makeTree(70,104)}catch(e){}
const BIG42={W:88,H:60};
const NZ42=[
 {id:'grove',n:'ป่าละเมาะ',e:'🌳',lv:[12,20],gateIn:-1,ulv:10,big42:1,ores:[['treeN',.8],['treeE',.2]],raw:'wood',ing:'essf',amb:'mote',dark:0,
  pal:{fl:['#4a7a3a','#46743a','#427036'],top:'#305a2a',face:'#22401e',edge:'#122a10',ac:'#c8f08a',vd:'#0c1a08'},
  mobs:[['beetle','ด้วงเขาไม้',['#8a6a3a','#4a3418','#e8c86a']],['wolf','หมาป่าละเมาะ',['#a89a7a','#5a4a32','#ffe8b0']],['wisp','ภูตใบไม้',['#d8ffb0','#6ab84a','#ffffff']]],
  boss:{f:'golem',n:'ตอไม้ยักษ์คำราม',lv:24,c:['#7a5a32','#3a2a14','#c8ff7a']}},
 {id:'creek',n:'ลำธารใบไม้',e:'🍃',lv:[17,26],gateIn:-1,ulv:15,big42:1,ores:[['treeN',.5],['treeE',.5]],raw:'wood',ing:'essf',amb:'mote',dark:0,
  pal:{fl:['#3a6a4a','#366646','#326242'],top:'#284a34',face:'#1a3424',edge:'#0e1e14',ac:'#9ae8d0',vd:'#08140c'},
  mobs:[['bat','ค้างคาวลำธาร',['#6a8a9a','#2a3a4a','#bff0ff']],['beetle','ปูหินลำธาร',['#7a8a9a','#3a4a5a','#d8f0ff']],['wolf','จิ้งจอกพงไม้',['#d88a4a','#7a3a1a','#fff0d0']]],
  boss:{f:'drake',n:'มังกรน้ำลำธาร',lv:30,c:['#4ab8c8','#1a5a6a','#e8ffff']}},
 {id:'pine',n:'ป่าสนสูง',e:'🌲',lv:[22,32],gateIn:-1,ulv:22,big42:1,ores:[['treeE',.65],['treeN',.35]],raw:'wood',ing:'mistc',amb:'mote',dark:0,
  pal:{fl:['#2e4e3a','#2a4a36','#264632'],top:'#1e3a28',face:'#14281c',edge:'#0a160e',ac:'#b8f0c8',vd:'#060e08'},
  mobs:[['wolf','หมาป่าสนเงิน',['#c8d0d8','#5a6470','#e8f4ff']],['golem','พฤกษาสนเฝ้าทาง',['#4a6a3a','#1e3414','#aaff8a']],['skeleton','พรานป่าวิญญาณ',['#d8e8d0','#4a5a40','#9aff9a']]],
  boss:{f:'wolf',n:'จ้าวหมาป่าสน',lv:38,c:['#e8f0f8','#4a5a6a','#7affd8']}}];
for(const z of NZ42){if(!ZONES.some(q=>q.id===z.id))ZONES.push(z);NZI15[z.id]=ZONES.findIndex(q=>q.id===z.id);if(!NZ15.some(q=>q.id===z.id))NZ15.push(z)}
const mt42=(a,b,c,d)=>()=>[makeTree(a,b),makeTree(a+1,b-8),makeTree(a+2,b+10),makeTree(a+3,b-14)];
NAT16.grove={g:[[78,124,62],[90,138,70],[66,110,54],[104,146,78]],path:'#8a7450',pathD:'#66543a',liq:['#4a9ab0','#2a6a80','#c8f0ff'],shore:'#6a7a4a',forest:.6,rockMix:.06,river:0,ponds:3,lava:0,spr:mt42(61,106),dec:'mist'};
NAT16.creek={g:[[62,112,72],[74,126,82],[52,98,62],[86,134,90]],path:'#7a6a4c',pathD:'#5a4a34',liq:['#3a8aa0','#256a80','#bff0ff'],shore:'#5a6a4a',forest:.58,rockMix:.1,river:1,ponds:3,lava:0,spr:mt42(71,118),dec:'mist'};
NAT16.pine={g:[[46,82,58],[56,94,66],[38,70,48],[66,104,72]],path:'#6a5a44',pathD:'#4a3e2e',liq:['#2a6a7a','#1a4a5a','#9ad8e0'],shore:'#4a5a42',forest:.55,rockMix:.14,river:1,ponds:2,lava:0,spr:mt42(81,140),dec:'mist'};
const CH42=['grove','creek','pine','mist'],chIdx42=id=>CH42.indexOf(id);
function natGen42(zi){const Zd=ZONES[zi],S=NAT16[Zd.id];ZW=BIG42.W;ZH=BIG42.H;const R=srand(7331*(zi+3)),sd=zi*13.7,K=[],m=[];
 for(let y=0;y<ZH;y++){K[y]=[];for(let x=0;x<ZW;x++){const e=Math.min(x,y,ZW-1-x,ZH-1-y),n=vn(x/3+sd,y/3+5);let k=0;
  if(e<2+n*3.2)k=(S.rockMix>.3&&vn(x/4+90,y/4+sd)>.6)?3:1;
  else{const f=vn(x/7+sd+50,y/7+20)*.6+vn(x/2.6+sd,y/2.6+90)*.4;if(f>S.forest)k=R()<S.rockMix?3:1;else if(f>S.forest-.07&&R()<.18)k=R()<S.rockMix?3:1;else if(R()<.012)k=R()<.5?3:1}
  K[y][x]=k}}
 const blob=(x0,y0,r,k)=>{x0=Math.round(x0);y0=Math.round(y0);const ri=Math.ceil(r);for(let y=Math.max(2,y0-ri-2);y<Math.min(ZH-2,y0+ri+3);y++)for(let x=Math.max(2,x0-ri-2);x<Math.min(ZW-2,x0+ri+3);x++){const d=Math.hypot((x-x0)*.85,y-y0)+(vn(x/2+sd,y/2)-.5)*2.2;if(d<r)K[y][x]=k}};
 if(S.river){const x0=Math.round(ZW*(.4+R()*.2)),ph=R()*6;for(let y=0;y<ZH;y++){const xx=Math.round(x0+Math.sin(y*.17+ph)*2.6+Math.sin(y*.06+ph*2)*3.5),w=vn(sd,y/4)>.55?1:0;for(let dx=-1-w;dx<=w;dx++){const x=xx+dx;if(x>1&&x<ZW-2)K[y][x]=2}}}
 for(let i=0;i<S.ponds+2;i++)blob(8+Math.floor(R()*(ZW-16)),8+Math.floor(R()*(ZH-16)),2+R()*2.6,2);
 const mid=ZH>>1,ent={x:ZW-7,y:mid},gate={x:5,y:mid+Math.floor(R()*9)-4},arena={x:ZW>>1,y:8};
 const clr=(x0,y0,r)=>{for(let y=y0-r-1;y<=y0+r+1;y++)for(let x=x0-r-1;x<=x0+r+1;x++)if(K[y]&&K[y][x]!==undefined&&x>1&&y>1&&x<ZW-2&&y<ZH-2&&Math.hypot(x-x0,y-y0)<=r+.3)K[y][x]=0};
 const path=new Set(),bridge=new Set(),dig=(x,y,w,mark,al)=>{for(let dy=-w;dy<=w;dy++)for(let dx=-w;dx<=w;dx++){const xx=x+dx,yy=y+dy;if(xx>1&&yy>1&&xx<ZW-2&&yy<ZH-2&&dx*dx+dy*dy<=w*w+1){if(K[yy][xx]===2){if(!al)continue;bridge.add(yy*ZW+xx)}K[yy][xx]=0;if(mark)path.add(yy*ZW+xx)}}};
 const walk=(x,y,tx,ty,w,mark,al)=>{let g=0;while((Math.abs(x-tx)>1||Math.abs(y-ty)>1)&&g++<1600){if(R()<.7){if(Math.abs(tx-x)>Math.abs(ty-y)?R()<.75:R()<.25)x+=Math.sign(tx-x);else y+=Math.sign(ty-y)}else{if(R()<.5)x+=R()<.5?-1:1;else y+=R()<.5?-1:1}x=clamp(x,3,ZW-4);y=clamp(y,3,ZH-4);dig(x,y,w,mark,al)}};
 clr(ent.x,ent.y,4);clr(ent.x,ent.y+2,2);clr(gate.x+1,gate.y,4);clr(arena.x,arena.y,7);
 // ทางหลักคดเคี้ยว ตะวันออก → ตะวันตก ผ่านจุดกลางทาง 2 จุด
 const w1={x:Math.round(ZW*.68),y:mid+Math.floor(R()*16)-8},w2={x:Math.round(ZW*.33),y:mid+Math.floor(R()*16)-8};
 walk(ent.x-3,ent.y,w1.x,w1.y,1,1,1);walk(w1.x,w1.y,w2.x,w2.y,1,1,1);walk(w2.x,w2.y,gate.x+2,gate.y,1,1,1);
 walk(w1.x,w1.y,arena.x+3,arena.y+6,1,1,1);
 for(let i=0;i<6;i++){const tx=6+Math.floor(R()*(ZW-12)),ty=6+Math.floor(R()*(ZH-12));walk(i%2?w1.x:w2.x,i%2?w1.y:w2.y,tx,ty,0,1)}
 for(let i=0;i<9;i++)walk(6+Math.floor(R()*(ZW-12)),6+Math.floor(R()*(ZH-12)),(i%2?w1:w2).x+Math.floor(R()*7)-3,(i%2?w1:w2).y+Math.floor(R()*7)-3,0,0);
 for(let y=0;y<ZH;y++){m[y]=[];for(let x=0;x<ZW;x++)m[y][x]=K[y][x]?WL:FL}
 const seen=new Uint8Array(ZW*ZH),q=[ent.y*ZW+ent.x];seen[q[0]]=1;
 while(q.length){const i=q.pop(),x=i%ZW,y=(i/ZW)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=(y+dy)*ZW+x+dx;if(!seen[j]&&m[y+dy]&&m[y+dy][x+dx]===FL){seen[j]=1;q.push(j)}}}
 const floor=[];for(let y=0;y<ZH;y++)for(let x=0;x<ZW;x++){if(m[y][x]===FL&&!seen[y*ZW+x]){m[y][x]=WL;K[y][x]=1}else if(m[y][x]===FL)floor.push([x,y])}
 const ores=[],oreAt={},wsum=Zd.ores.reduce((a,b)=>a+b[1],0);
 for(let n=0,g=0;n<120&&g<20000;g++){const [x,y]=floor[Math.floor(R()*floor.length)];
  if(path.has(y*ZW+x)||bridge.has(y*ZW+x)||Math.hypot(x-ent.x,y-ent.y)<6||Math.hypot(x-gate.x,y-gate.y)<6||Math.hypot(x-arena.x,y-arena.y)<9||oreAt[y*ZW+x])continue;
  let nb=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(m[y+dy][x+dx]===WL)nb++;if(nb>=2)continue;
  let r=R()*wsum,kd=Zd.ores[0][0];for(const [k2,w] of Zd.ores){if(r<w){kd=k2;break}r-=w}
  const KK=OREK[kd],o={tx:x,ty:y,x:x*T+16,y:y*T+16,kind:kd,hp:KK.hp,max:KK.hp,alive:true,regen:0,shake:0};ores.push(o);oreAt[y*ZW+x]=o;n++}
 {const done=new Set();for(const s0 of [...bridge]){if(done.has(s0))continue;const comp=[],q2=[s0];done.add(s0);while(q2.length){const i=q2.pop();comp.push(i);for(const d of [1,-1,ZW,-ZW]){const j=i+d;if(bridge.has(j)&&!done.has(j)){done.add(j);q2.push(j)}}}if(comp.length<4)for(const i of comp)bridge.delete(i)}}
 const Zm={zi,Zd,m,ores,oreAt,floor,ent,arena,seen,W:ZW,H:ZH,K,path,bridge,nat16:1,gate42:{x:gate.x*T+16,y:gate.y*T+16}};natPaint16(Zm,R,S);return Zm}
{const _gz=genZone;genZone=function(zi){const Zd=ZONES[zi];if(Zd&&Zd.big42){if(ZCACHE[zi]){ZW=ZCACHE[zi].W;ZH=ZCACHE[zi].H;return ZCACHE[zi]}return ZCACHE[zi]=natGen42(zi)}return _gz(zi)}}
// ทางออกขอบซ้ายทุ่งหญ้า → ป่าละเมาะ (เดิมไปป่าหมอกตรง ๆ)
try{const e=EX16.L.find(q=>q.dir==='w');if(e)e.id='grove'}catch(e){}
const EX42={busy:false,cd:0,msgT:0};
function go42(id,at){const zi=NZI15[id],Zd=ZONES[zi];if(!Zd)return;
 if(P.lv<(Zd.ulv||0)){if(performance.now()-EX42.msgT>2200){EX42.msgT=performance.now();say('🔒 '+Zd.e+' '+Zd.n+' — ต้อง Lv.'+Zd.ulv+' ก่อนจึงเดินผ่านได้');sfx('thud')}return}
 if(EX42.busy)return;EX42.busy=true;
 LoadingScreenManager.cover({icon:Zd.e,title:Zd.n,tip:'แมพป่า Lv.'+Zd.lv[0]+'-'+Zd.lv[1]+' · ตัดต้นไม้ด้วยขวาน · เดินต่อไปทางตะวันตกเพื่อเข้าลึกขึ้น'},()=>{
  try{if(D)exitD()}catch(_){}
  try{enterZone(zi);const w=EX16.L.find(q=>q.dir==='w');if(D&&D.zone){if(w)D.ret=w.ret.slice();
    if(at==='gate'&&D.zone.gate42){P.x=D.zone.gate42.x+52;P.y=D.zone.gate42.y;P.dir='r'}else if(D.zone.Zd.big42)P.dir='l';
        say(Zd.e+' '+Zd.n+' (Lv.'+Zd.lv[0]+'-'+Zd.lv[1]+') · ตัดต้นไม้ด้วยขวาน'+(D.zone.gate42?' · ⬅ ทางไปต่ออยู่ฝั่งตะวันตก':'')+' · วงเวทข้างทางเข้า = ย้อนกลับ')}}catch(_){console.warn('[go42]',_)}
  EX42.busy=false;EX42.cd=performance.now()+2500})}
window.go42=go42;
{const _ez=enterZone;enterZone=function(i){const r=_ez.apply(this,arguments);try{if(ZONES[i]&&ZONES[i].big42&&D&&D.zone){P.dir='l';for(let k=0;k<12;k++)spawnMob(false)}}catch(e){}return r}}
const gateNear42=r=>{const Z=D&&D.zone;if(!Z||!Z.gate42)return false;return Math.hypot(P.x-Z.gate42.x,P.y-Z.gate42.y)<(r||46)};
const backNear42=()=>{const Z=D&&D.zone;if(!Z||D.dg)return false;const i=chIdx42(Z.Zd.id);if(i<1)return false;return Math.hypot(P.x-(Z.ent.x*T+16),P.y-((Z.ent.y+2)*T+16))<40};
{const _it=interact;interact=function(){try{const Z=D&&D.zone;if(Z&&!D.dg){const i=chIdx42(Z.Zd.id);
  if(i>=0&&gateNear42()&&CH42[i+1]){go42(CH42[i+1],'ent');return true}
  if(backNear42()){go42(CH42[i-1],'gate');return true}}}catch(e){}return _it.apply(this,arguments)}}
{const _l=window.dgExitLbl11;window.dgExitLbl11=function(){try{const Z=D&&D.zone;if(Z&&!D.dg){const i=chIdx42(Z.Zd.id);if(i>=1){const p=ZONES[NZI15[CH42[i-1]]];return 'กด E / ⚔️ กลับ '+p.e+' '+p.n}}}catch(e){}return _l.apply(this,arguments)}}
// วาดประตูไปแมพถัดไป + เดินชนประตู = ไปต่อ
{const _h=hero;hero=function(){try{const Z=D&&D.zone;
 if(D&&D.town&&TWR42){if(twrNear42())plate7('กด E / ⚔️ เข้าหอคอยบอส 🗼',TWR42.dx,TWR42.dy-74,'#ffe27a');
  const t=performance.now()/1000;ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(TWR42.dx,TWR42.dy-28,0,TWR42.dx,TWR42.dy-28,40);g.addColorStop(0,'rgba(190,120,255,'+(.22+.12*Math.sin(t*2.4))+')');g.addColorStop(1,'rgba(150,80,255,0)');ctx.fillStyle=g;ctx.fillRect(TWR42.dx-40,TWR42.dy-68,80,80);ctx.restore()}
 if(Z&&Z.gate42&&!D.dg){const i=chIdx42(Z.Zd.id),nx=CH42[i+1];if(nx){const nz=ZONES[NZI15[nx]],open=P.lv>=(nz.ulv||0),x=Z.gate42.x,y=Z.gate42.y,t=performance.now()/1000;ctx.save();ctx.globalAlpha=1;
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,56);g.addColorStop(0,'rgba(170,255,220,'+(open?.45:.15)+')');g.addColorStop(1,'rgba(120,220,180,0)');ctx.fillStyle=g;ctx.fillRect(x-56,y-56,112,112);
  for(let k=0;k<7;k++){const a=t*.8+k*.9,px=x+Math.cos(a)*16,py=y-10+Math.sin(a*1.3)*20;ctx.fillStyle='rgba(200,255,230,'+(open?.75:.3)+')';ctx.beginPath();ctx.arc(px,py,1.8,0,7);ctx.fill()}
  ctx.globalCompositeOperation='source-over';
  // ซุ้มหินโค้ง
  ctx.fillStyle='#5a5a52';ctx.strokeStyle='#22221c';ctx.lineWidth=1.5;for(const s of [-1,1]){ctx.fillRect(x+s*22-5,y-44,10,48);ctx.strokeRect(x+s*22-5,y-44,10,48)}
  ctx.lineWidth=8;ctx.strokeStyle='#5a5a52';ctx.beginPath();ctx.arc(x,y-44,22,Math.PI,0);ctx.stroke();ctx.lineWidth=1.5;ctx.strokeStyle='#22221c';ctx.beginPath();ctx.arc(x,y-44,26,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.arc(x,y-44,18,Math.PI,0);ctx.stroke();
  ctx.fillStyle='rgba(70,140,60,.7)';for(let k=0;k<6;k++){ctx.beginPath();ctx.ellipse(x-24+k*9,y-62+Math.abs(k-2.5)*3,4,2.5,0,0,7);ctx.fill()}
  ctx.restore();
  const near=gateNear42();plate7((open?'⬅ ':'🔒 ')+nz.e+' '+nz.n+' Lv.'+nz.lv[0]+'+',x,y-78,near?'#fff':'#9af0c8');if(near)plate7(open?'เดินต่อ / กด E เพื่อไป':'ต้อง Lv.'+nz.ulv,x,y+30,'#ffe27a');
  if(performance.now()>EX42.cd&&P.mv&&P.dir==='l'&&gateNear42(26))go42(nx,'ent')}}
 }catch(_){}_h()}}
}catch(e){console.warn('fix42',e)}
