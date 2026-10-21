// fix95 (v4.82) — 🏙️ เมืองที่ 2 "นครวารีอัสตรา" (เจ้าของสั่ง 2026-10-14 14:23 + รูปตัวอย่าง: เมืองเกาะมีคลอง สะพาน ลานหินขาวรูปกากบาท น้ำพุ แผงตลาด)
//  - ฉากแบบโซน (ขนาด 84×64 ช่อง ใหญ่กว่าเมือง 1 ราว 3.5 เท่า) · ผู้เล่นทุกคนอยู่ฉากเดียวกัน (netScene 'z:700')
//  - สไตล์เดียวกับเมือง 1: ใช้รูปอาคาร ART เดิม (ร้าน/บ้าน/โรงเตี๊ยม/ปราสาท/น้ำพุ) + หญ้า/ถนนหินชุดเดิม · เพิ่มน้ำทะเลมีคลื่น ฝั่งหน้าผา สะพานไม้ ท่าเรือ เรือ ศาลาโดม แผงตลาด
//  - ระบบเดิมทั้งหมด: ประตูร้าน → เข้าร้านเดิม (enterShop: ร้านอาวุธ+โต๊ะคราฟ ร้านยา ร้านสกิล ร้านชำ กิลด์ ธนาคาร คลัง แฟชั่น โรงเตี๊ยม) ออกมาแล้วกลับเมือง 2
//  - เกาะเหนือ "ลานประตูมิติ": ประตูดันเจี้ยน (ข้อมูลจาก C2.portals — fix96 เติมดันเจี้ยนจริง) · เกาะใต้: วงเวทกลับเมือง 1
//  - ไปได้จาก: กัปตันเรือในเมือง 1 · เมนู 🏙️ เมือง 2 (ต้อง Lv.150)
try{
const C2={W:84,H:64,ZI:700,LV:150,portals:[],npcs:[],doors:[],occ:[],Zm:null};window.C2=C2;
const inC2=()=>!!(D&&D.city2);window.inC2=inC2;
function rng95(s){let a=s>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
// ---------- ผังเมือง ----------
const G95=[];// 'sea','land','plaza','road','bridge','dock'
function buildC2(){if(C2.Zm)return C2.Zm;if(C2.alt)return C2.Zm=C2.alt(G95); /* v4.83: fix98 วาดเมืองใหม่ */const W=C2.W,H=C2.H,R=rng95(95001);
 for(let y=0;y<H;y++){G95[y]=[];for(let x=0;x<W;x++)G95[y][x]='sea'}
 const rr=(x0,y0,x1,y1,r,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const dx=Math.max(x0+r-x,0,x-(x1-r)),dy=Math.max(y0+r-y,0,y-(y1-r));if(dx*dx+dy*dy<=r*r+1)G95[y][x]=v}};
 const fill=(x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(G95[y]&&G95[y][x]!=null)G95[y][x]=v};
 rr(14,12,69,51,6,'land');                       // เกาะหลัก
 rr(30,2,53,8,3,'land');rr(34,55,49,61,3,'land'); // เกาะประตูมิติ (เหนือ) · เกาะท่าเข้าเมือง (ใต้)
 rr(2,24,10,39,3,'land');rr(73,24,81,39,3,'land');// เกาะท่าเรือ (ตะวันตก) · เกาะสวนศาลา (ตะวันออก)
 rr(3,5,9,11,3,'land');rr(74,5,80,11,3,'land');rr(4,50,10,57,3,'land');rr(73,50,80,57,3,'land'); // เกาะต้นไม้เล็ก (ตกแต่ง)
 fill(20,28,63,35,'plaza');fill(37,14,46,49,'plaza');
 for(let y=24;y<=39;y++)for(let x=33;x<=50;x++){const dx=x-41.5,dy=y-31.5;if(dx*dx+dy*dy<=60)G95[y][x]='plaza'}
 fill(32,3,51,7,'plaza');fill(36,56,47,60,'plaza');
 fill(40,8,43,13,'bridge');fill(40,52,43,55,'bridge');fill(10,30,14,33,'bridge');fill(69,30,73,33,'bridge');
 fill(4,40,6,44,'dock');fill(3,24,4,26,'land');
 // ถนนหินจากประตูอาคาร
 const roads=[[19,20,21,27],[27,19,29,27],[31,25,33,27],[50,18,52,27],[57,18,59,27],[50,25,52,27],[19,36,21,38],[26,36,28,38],[31,36,33,43],[55,36,58,38],[15,30,19,33],[64,30,68,33],[4,30,9,33],[74,30,79,33]];
 for(const [a,b,c,d] of roads)for(let y=b;y<=d;y++)for(let x=a;x<=c;x++)if(G95[y][x]==='land')G95[y][x]='road';
 // ตารางชน
 const m=[];for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++)m[y][x]=G95[y][x]==='sea'?WL:FL}
 const cv=document.createElement('canvas');cv.width=W*T;cv.height=H*T;const k=cv.getContext('2d');
 // ----- พื้น -----
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=G95[y][x],px=x*T,py=y*T,h=hash(x*2.1,y*1.3);
  if(g==='sea'){const gr=k.createLinearGradient(px,py,px,py+T);gr.addColorStop(0,h>.5?'#2d7fb8':'#2a78b0');gr.addColorStop(1,'#22689c');k.fillStyle=gr;k.fillRect(px,py,T,T);
   k.strokeStyle='rgba(255,255,255,'+(.08+h*.1)+')';k.lineWidth=1.2;k.beginPath();const ox=px+4+h*10,oy=py+8+((h*97)%1)*14;k.moveTo(ox,oy);k.quadraticCurveTo(ox+5,oy-3,ox+10,oy);k.quadraticCurveTo(ox+15,oy+3,ox+20,oy);k.stroke()}
  else if(g==='land')k.drawImage(grassV[gv(x,y)],px,py);
  else if(g==='road'){k.drawImage(ART.cobble,(x%4)*64,(y%4)*64,64,64,px,py,T,T)}
  else if(g==='plaza'){const c0=['#e9e2d2','#e2dac8','#ece6d8','#ddd4c0'][(x*3+y*5)%4];k.fillStyle=c0;k.fillRect(px,py,T,T);k.strokeStyle='rgba(120,105,80,.28)';k.lineWidth=1;
   if((x+y)%2){k.strokeRect(px+.5,py+.5,T-1,T-1)}else{k.beginPath();k.moveTo(px,py+T/2);k.lineTo(px+T,py+T/2);k.moveTo(px+T/2,py);k.lineTo(px+T/2,py+T/2);k.stroke()}
   if(h>.9){k.fillStyle='rgba(90,120,60,.25)';k.fillRect(px+4+h*10,py+T-6,6,2)}}
  else if(g==='bridge'||g==='dock'){const vert=g==='bridge'&&(x>=40&&x<=43);k.fillStyle='#22689c';k.fillRect(px,py,T,T);
   for(let i=0;i<4;i++){k.fillStyle=['#9a6a3a','#8a5c30','#a47444','#93643a'][(i+x+y)%4];if(vert)k.fillRect(px,py+i*8,T,7);else k.fillRect(px+i*8,py,7,T)}
   k.fillStyle='rgba(40,20,8,.35)';for(let i=0;i<4;i++){if(vert)k.fillRect(px,py+i*8+7,T,1);else k.fillRect(px+i*8+7,py,1,T)}
   k.fillStyle='rgba(30,16,6,.55)';k.fillRect(px+(vert?6:3),py+(vert?3:6),2,2);k.fillRect(px+(vert?24:3),py+(vert?3:24),2,2)}}
 // ฝั่ง: หน้าผาใต้แผ่นดิน + ฟองคลื่นรอบเกาะ
 for(let y=1;y<H;y++)for(let x=0;x<W;x++){const g=G95[y][x],up=G95[y-1][x];
  if(g==='sea'&&up!=='sea'&&up!=='bridge'&&up!=='dock'){const px=x*T,py=y*T,gr=k.createLinearGradient(0,py,0,py+14);gr.addColorStop(0,'#7a6a52');gr.addColorStop(1,'#4a3e30');k.fillStyle=gr;k.fillRect(px,py,T,14);
   k.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<4;i++)k.fillRect(px+i*8+hash(x,i)*4,py+2,1,10);k.fillStyle='rgba(255,255,255,.7)';k.fillRect(px,py+14,T,2);k.fillStyle='rgba(255,255,255,.25)';k.fillRect(px,py+17,T,2)}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(G95[y][x]!=='sea')continue;const px=x*T,py=y*T,L=x>0&&G95[y][x-1]!=='sea'&&G95[y][x-1]!=='bridge'&&G95[y][x-1]!=='dock',Rr=x<W-1&&G95[y][x+1]!=='sea'&&G95[y][x+1]!=='bridge'&&G95[y][x+1]!=='dock',U=y<H-1&&G95[y+1][x]!=='sea'&&G95[y+1][x]!=='bridge'&&G95[y+1][x]!=='dock';
  k.fillStyle='rgba(255,255,255,.55)';if(L)k.fillRect(px,py,3,T);if(Rr)k.fillRect(px+T-3,py,3,T);if(U)k.fillRect(px,py+T-3,T,3);
  k.fillStyle='rgba(90,70,50,.6)';if(L)k.fillRect(px,py,2,T);if(Rr)k.fillRect(px+T-2,py,2,T)}
 // ราวสะพาน
 const rail=(x0,y0,x1,y1)=>{k.strokeStyle='#5a3a1a';k.lineWidth=3;k.beginPath();k.moveTo(x0,y0);k.lineTo(x1,y1);k.stroke();k.fillStyle='#6a4422';const n=Math.max(1,Math.round(Math.hypot(x1-x0,y1-y0)/24));for(let i=0;i<=n;i++){const px=x0+(x1-x0)*i/n,py=y0+(y1-y0)*i/n;k.fillRect(px-3,py-6,6,10)}};
 rail(40*T+2,8*T,40*T+2,14*T);rail(44*T-2,8*T,44*T-2,14*T);rail(40*T+2,52*T,40*T+2,56*T);rail(44*T-2,52*T,44*T-2,56*T);
 rail(10*T,30*T+3,15*T,30*T+3);rail(10*T,34*T-3,15*T,34*T-3);rail(69*T,30*T+3,74*T,30*T+3);rail(69*T,34*T-3,74*T,34*T-3);
 // ลวดลายทองกลางลาน
 k.save();k.translate(41.5*T+16,31.5*T+16);k.strokeStyle='rgba(190,150,60,.55)';k.lineWidth=4;k.beginPath();k.arc(0,0,6.6*T,0,7);k.stroke();k.lineWidth=2;k.beginPath();k.arc(0,0,5.9*T,0,7);k.stroke();
 k.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4;k.moveTo(Math.cos(a)*3.2*T,Math.sin(a)*3.2*T);k.lineTo(Math.cos(a)*5.9*T,Math.sin(a)*5.9*T)}k.stroke();k.restore();
 // ----- วัตถุ -----
 const occ=C2.occ;occ.length=0;const block=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(m[j])m[j][i]=WL};
 const sprite=(fn,x0,y0,w,h,base,occl)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');q.translate(-x0,-y0);fn(q);k.drawImage(c,x0,y0);if(occl)occ.push({cv:c,x0,y0,w,h,base})};
 const hue=(img,deg)=>{if(!deg)return img;const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const q=c.getContext('2d');q.filter='hue-rotate('+deg+'deg) saturate(1.1)';q.drawImage(img,0,0);return c};
 // อาคาร: ประตูเข้าร้านเดิม
 const BL=[['gear','market',17,14,6,6,0],['skill','house2',26,14,5,4,0],['potion','house1',30,20,5,4,30],
  ['guild','house2',48,14,5,4,200],['bank','house1',55,14,5,4,0],['ware','house2',49,20,5,4,120],['store','house1',60,20,5,4,280],
  ['inn','inn',17,38,6,6,0],['fashion','house2',25,39,5,4,300],['_house','house1',30,44,5,4,160],['_house','house2',23,45,5,4,60]];
 C2.doors.length=0;
 for(const [id,img,x,y,w,h,hd] of BL){block(x,y,w,h);k.drawImage(hue(ART[img],hd),x*T,y*T,w*T,h*T);
  const S=SHOP_DATA[id];if(S&&S.b){const S2=Object.assign({},S,{b:[x,y,w,h]});try{if(S.sign)shopSign(k,S2)}catch(e){}try{shopName(k,S2)}catch(e){}
   C2.doors.push({id,x:(x+w/2)*T,y:(y+h)*T+8,n:S.name,e:S.emoji||'🚪'})}}
 // ปราสาทอัสตรา (ตกแต่ง) + ทหารยาม
 k.drawImage(hue(ART.castle,240),50*T,38*T,14*T,8*T);block(50,38,14,8);
 k.font='bold 13px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.lineWidth=4;k.strokeStyle='rgba(0,0,0,.7)';k.strokeText('🏰 ปราสาทอัสตรา',57*T,38*T-6);k.fillStyle='#ffe6a8';k.fillText('🏰 ปราสาทอัสตรา',57*T,38*T-6);k.textAlign='left';
 // น้ำพุ 2 จุด + ศาลาโดมกลางลาน
 for(const [fx,fy] of [[29,31],[54,31]]){k.drawImage(ART.fountain,fx*T+16-56,fy*T+16-70,112,112);block(fx-1,fy-1,3,3)}
 sprite(q=>gazebo95(q,41.5*T+16,31.5*T+40,1.25),41.5*T+16-110,31.5*T+40-230,220,260,31.5*T+40,1);block(39,29,6,5);
 sprite(q=>gazebo95(q,77*T+16,31*T+40,.9,'#b44a6a'),77*T+16-80,31*T+40-170,160,190,31*T+40,1);block(75,29,5,4);
 // แผงตลาด (ลายผ้าใบ)
 const ST=[[35,18,'#c0392b'],[35,21,'#2f7fb0'],[47,18,'#e08a1e'],[47,21,'#3f9a4a'],[35,43,'#8e44ad'],[47,43,'#c0392b'],[22,25,'#c0392b'],[24,25,'#2f7fb0'],[33,25,'#e08a1e'],[56,25,'#3f9a4a'],[59,25,'#8e44ad'],[62,25,'#c0392b'],[22,37,'#2f7fb0'],[56,37,'#e08a1e'],[60,37,'#3f9a4a']];
 for(const [x,y,a] of ST){if(G95[y][x]==='sea')continue;sprite(q=>stall95(q,x*T,y*T,a,R),x*T-6,y*T-40,2*T+12,T+44,y*T+T,1);block(x,y,2,1)}
 // ดอกไม้ + ม้านั่ง + โคม + ถังไม้
 for(const [x,y,w,h] of [[22,27,6,1],[47,27,6,1],[22,36,6,1],[56,36,6,1],[34,14,2,6],[48,14,0,0],[47,40,2,6]]){if(!w)continue;flower95(k,x,y,w,h);block(x,y,w,h)}
 for(let x=21;x<=62;x+=6){for(const y of [28,35]){if(Math.abs(x+.5-41.5)<6)continue;if(G95[y][x]!=='plaza')continue;sprite(q=>lamp95(q,x*T+16,y*T+28),x*T-4,y*T-46,40,80,y*T+28,1);block(x,y,1,1)}}
 for(let y=16;y<=48;y+=6){for(const x of [37,46]){if(Math.abs(y-31.5)<8)continue;sprite(q=>lamp95(q,x*T+16,y*T+28),x*T-4,y*T-46,40,80,y*T+28,1);block(x,y,1,1)}}
 for(const [x,y] of [[31,33],[51,30],[45,22],[38,42],[24,32],[59,32]]){bench95(k,x*T,y*T)}
 for(const [x,y] of [[23,18],[24,19],[29,18],[47,25],[62,35],[34,48],[8,36],[7,37],[5,27]]){if(G95[y][x]==='sea')continue;barrel95(k,x*T+16,y*T+24,R()>.5);block(x,y,1,1)}
 // ท่าเรือ + เรือ
 k.fillStyle='#5a3a1a';for(const [x,y] of [[4,44],[6,44],[4,42],[6,42]])k.fillRect(x*T+12,y*T+20,8,16);
 for(const [bx,by,s,sc] of [[1.2,46,1,'#f4efe2'],[8.5,45.5,.85,'#e8d8b8'],[12,48,.7,'#f0e0d0'],[66,57,.8,'#f4efe2'],[20,56,.75,'#e8e0ff']])sprite(q=>boat95(q,bx*T,by*T,s,sc),bx*T-70*s,by*T-130*s,150*s,160*s,by*T+20,0);
 // ต้นไม้ตามขอบเกาะ
 // บ้านชาวเมืองเติมเต็มย่าน (วางอัตโนมัติ)
 const HS=[['house1',5,4],['house2',5,4],['house1',5,4],['house2',5,4],['market',6,6],['house1',5,4],['house2',5,4],['inn',6,6]],HUE=[0,40,90,150,200,250,310];let hn=0;
 const okRect=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){if(!G95[j]||G95[j][i]!=='land'||m[j][i]!==FL)return false}for(let i=x;i<x+w;i++){const g=G95[y+h]&&G95[y+h][i];if(!g||g==='sea'||m[y+h][i]!==FL)return false}for(let i=x-1;i<=x+w;i++){const g=G95[y-1]&&G95[y-1][i];if(g==='sea')return false}return true};
 for(let pass=0;pass<2;pass++)for(let y=13;y<=50;y++)for(let x=15;x<=66;x++){if(hn>=22)break;const [img,w,h]=HS[(hn+pass)%HS.length];if(R()<.3)continue;if(!okRect(x,y,w,h))continue;
  block(x,y,w,h);k.drawImage(hue(ART[img],HUE[Math.floor(R()*HUE.length)]),x*T,y*T,w*T,h*T);hn++;C2.houses=(C2.houses||0)+1;
  for(let i=x+Math.floor(w/2)-1;i<=x+Math.floor(w/2);i++)if(G95[y+h]&&G95[y+h][i]==='land'){k.drawImage(ART.cobble,(i%4)*64,((y+h)%4)*64,64,64,i*T,(y+h)*T,T,T)}}
 // รายละเอียดพื้นหญ้า: ดอกไม้ ก้อนหิน พุ่มไม้
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(G95[y][x]!=='land'||m[y][x]!==FL)continue;const h=hash(x*5.1,y*3.7),px=x*T,py=y*T;
  if(h<.12){const C=['#ff6a8a','#ffd84a','#ffffff','#b07aff','#ff9a3a'];for(let i=0;i<4;i++){k.fillStyle=C[(i+x)%C.length];k.beginPath();k.arc(px+6+hash(i,x)*20,py+6+hash(y,i)*20,2,0,7);k.fill()}}
  else if(h<.16){k.fillStyle='#8a8a92';k.beginPath();k.ellipse(px+16,py+20,6,4,0,0,7);k.fill();k.fillStyle='#aaaab2';k.beginPath();k.ellipse(px+15,py+18,4,2.5,0,0,7);k.fill()}
  else if(h<.2){k.fillStyle='#2e6a2a';k.beginPath();k.arc(px+12,py+20,7,0,7);k.arc(px+20,py+18,8,0,7);k.fill();k.fillStyle='#4a8a3a';k.beginPath();k.arc(px+15,py+15,5,0,7);k.fill()}}
 // ขอบลาน + รูปปั้นปลายลาน + กระถางดอกไม้
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(G95[y][x]!=='plaza')continue;let e=false;for(const [a2,b2] of [[1,0],[-1,0],[0,1],[0,-1]])if(G95[y+b2][x+a2]!=='plaza'&&G95[y+b2][x+a2]!=='bridge')e=true;if(e){k.fillStyle='rgba(150,130,100,.35)';k.fillRect(x*T,y*T,T,T);k.strokeStyle='rgba(110,90,60,.45)';k.strokeRect(x*T+2.5,y*T+2.5,T-5,T-5)}}
 for(const [x,y] of [[21,31],[62,31],[41,15],[41,48]]){sprite(q=>statue95(q,x*T+16,y*T+30),x*T-24,y*T-90,80,124,y*T+30,1);block(x,y,1,1)}
 for(const [x,y] of [[38,24],[45,24],[38,39],[45,39],[36,29],[47,29],[36,34],[47,34]]){if(G95[y][x]!=='plaza'||m[y][x]!==FL)continue;sprite(q=>pot95(q,x*T+16,y*T+26),x*T-6,y*T-20,44,50,y*T+26,0);block(x,y,1,1)}
 const TR=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(G95[y][x]!=='land'||m[y][x]!==FL)continue;if(y<10||Math.hypot(x-41.5,y-58)<6||Math.hypot(x-41.5,y-31.5)<9)continue;let edge=false;for(const [a,b] of [[2,0],[-2,0],[0,2],[0,-2]])if(G95[y+b]&&G95[y+b][x+a]==='sea')edge=true;
  const near=C2.doors.some(d=>Math.abs(d.x/T-x)<3&&Math.abs(d.y/T-y)<3);if(near)continue;if((edge&&R()<.28)||R()<.02)TR.push([x,y])}
 TR.sort((a,b)=>a[1]-b[1]);for(const [x,y] of TR){if(m[y][x]!==FL)continue;const i=Math.floor(R()*treeSpr.length),s=.85+R()*.35;sprite(q=>q.drawImage(treeSpr[i],x*T+16-36*s,y*T+28-85*s,72*s,90*s),x*T+16-36*s,y*T+28-85*s,Math.ceil(72*s),Math.ceil(90*s),y*T+28,1);block(x,y,1,1)}
 // ป้ายลานประตูมิติ / ท่าเข้าเมือง
 k.font='bold 14px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.lineWidth=4;k.strokeStyle='rgba(0,0,0,.65)';
 k.strokeText('🌀 ลานประตูมิติ — ทางลงดันเจี้ยน',41.5*T+16,2*T+4);k.fillStyle='#e8d8ff';k.fillText('🌀 ลานประตูมิติ — ทางลงดันเจี้ยน',41.5*T+16,2*T+4);k.textAlign='left';
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);
 const Zd={id:'city2',n:'นครวารีอัสตรา',e:'🏙️',lv:[1,1],dark:0,amb:'',pal:{vd:'#22689c'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt',safe:1};
 return C2.Zm={zi:C2.ZI,name:'city2',Zd,m,ores:[],oreAt:{},floor,ent:{x:41,y:57},arena:{x:41,y:31},seen:new Uint8Array(W*H).fill(1),W,H,cv}}
// ---------- ตัววาดของตกแต่ง ----------
function gazebo95(q,cx,by,s,roofC){if(DECOR560.draw(q,'extra2',6,cx-72*(s||1),by-160*(s||1),144*(s||1),160*(s||1)))return;s=s||1;const rc=roofC||'#3a7ab8';q.save();q.translate(cx,by);q.scale(s,s);
 q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(4,4,86,26,0,0,7);q.fill();
 q.fillStyle='#e8e2d4';q.beginPath();q.ellipse(0,0,80,24,0,0,7);q.fill();q.fillStyle='#cfc6b2';q.fillRect(-80,0,160,10);q.beginPath();q.ellipse(0,10,80,24,0,0,Math.PI);q.fill();
 q.fillStyle='#e8e2d4';q.beginPath();q.ellipse(0,0,80,24,0,0,7);q.fill();q.strokeStyle='#b8a888';q.lineWidth=2;q.stroke();
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.cos(a)*62,y=Math.sin(a)*18;const g=q.createLinearGradient(x-5,0,x+5,0);g.addColorStop(0,'#fff');g.addColorStop(1,'#bdb6a6');q.fillStyle=g;q.fillRect(x-5,y-110,10,110);q.fillStyle='#d8c890';q.fillRect(x-7,y-112,14,6)}
 // หลังคาโดมลายทาง
 q.save();q.translate(0,-112);q.beginPath();q.ellipse(0,0,84,26,0,0,7);q.fillStyle='#e8d8a0';q.fill();
 for(let i=0;i<16;i++){const a0=i*Math.PI/8,a1=(i+1)*Math.PI/8;q.beginPath();q.moveTo(0,-78);q.lineTo(Math.cos(a0)*84,Math.sin(a0)*26);q.lineTo(Math.cos(a1)*84,Math.sin(a1)*26);q.closePath();q.fillStyle=i%2?rc:'#f4f0e6';q.fill()}
 q.strokeStyle='rgba(0,0,0,.25)';q.lineWidth=1.5;q.beginPath();q.ellipse(0,0,84,26,0,0,Math.PI);q.stroke();
 q.fillStyle='#e8c14a';q.beginPath();q.arc(0,-80,7,0,7);q.fill();q.fillRect(-1.5,-102,3,22);q.beginPath();q.moveTo(0,-104);q.lineTo(9,-98);q.lineTo(0,-94);q.fill();q.restore();q.restore()}
function statue95(q,x,y){q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(x+3,y,20,6,0,0,7);q.fill();q.fillStyle='#b8b0a0';q.fillRect(x-16,y-22,32,22);q.fillStyle='#d8d0c0';q.fillRect(x-18,y-26,36,6);q.fillRect(x-18,y-2,36,4);
 const g=q.createLinearGradient(x-10,0,x+10,0);g.addColorStop(0,'#e8e4dc');g.addColorStop(1,'#a8a090');q.fillStyle=g;q.fillRect(x-6,y-58,12,32);q.beginPath();q.arc(x,y-64,7,0,7);q.fill();
 q.fillRect(x-14,y-56,8,4);q.save();q.translate(x+8,y-56);q.rotate(-.5);q.fillRect(-2,-34,4,34);q.fillStyle='#e8c14a';q.fillRect(-6,-2,12,3);q.restore();q.fillStyle='#8a8070';q.beginPath();q.moveTo(x-8,y-50);q.lineTo(x-14,y-28);q.lineTo(x-6,y-28);q.fill()}
function pot95(q,x,y){q.fillStyle='rgba(0,0,0,.2)';q.beginPath();q.ellipse(x+2,y,11,3.5,0,0,7);q.fill();q.fillStyle='#b8643a';q.beginPath();q.moveTo(x-10,y-14);q.lineTo(x+10,y-14);q.lineTo(x+7,y);q.lineTo(x-7,y);q.fill();q.fillStyle='#8a4a2a';q.fillRect(x-11,y-16,22,4);
 q.fillStyle='#3a7a2a';q.beginPath();q.arc(x,y-20,9,0,7);q.fill();const C=['#ff6a8a','#ffd84a','#ffffff','#b07aff'];for(let i=0;i<6;i++){q.fillStyle=C[i%4];q.beginPath();q.arc(x-6+i*2.5,y-22-(i%2)*4,2.2,0,7);q.fill()}}
function stall95(q,x,y,a,R){if(DECOR560.draw(q,'props',0,x-4,y-36,72,68)){for(let i=0;i<9;i++)R();return;}const w=2*T;q.fillStyle='rgba(0,0,0,.22)';q.beginPath();q.ellipse(x+w/2+4,y+T,w/2+8,5,0,0,7);q.fill();
 q.fillStyle='#7a5228';q.fillRect(x+2,y+6,w-4,T-8);q.fillStyle='#9a6a34';q.fillRect(x+2,y+6,w-4,5);
 const goods=['#e74c3c','#f1c40f','#2ecc71','#e67e22','#9b59b6','#ecf0f1','#d35400'];for(let i=0;i<9;i++){q.fillStyle=goods[Math.floor(R()*goods.length)];q.beginPath();q.arc(x+8+i*6,y+9+(i%2)*3,3.2,0,7);q.fill()}
 q.fillStyle='#5a3a1a';q.fillRect(x+3,y-30,3,38);q.fillRect(x+w-6,y-30,3,38);
 for(let i=0;i<8;i++){q.fillStyle=i%2?a:'#f6f0e2';q.beginPath();q.moveTo(x-4+i*(w+8)/8,y-34);q.lineTo(x-4+(i+1)*(w+8)/8,y-34);q.lineTo(x-4+(i+1)*(w+8)/8,y-20);q.lineTo(x-4+i*(w+8)/8,y-20);q.fill()}
 q.fillStyle='rgba(0,0,0,.15)';q.fillRect(x-4,y-22,w+8,2);for(let i=0;i<8;i++){q.fillStyle=i%2?a:'#f6f0e2';q.beginPath();q.arc(x-4+(i+.5)*(w+8)/8,y-20,(w+8)/16,0,Math.PI);q.fill()}}
function lamp95(q,x,y){if(DECOR560.draw(q,'props',7,x-10,y-78,20,78))return;q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(x+3,y,8,3,0,0,7);q.fill();q.fillStyle='#2e2a36';q.fillRect(x-2,y-58,4,58);q.fillRect(x-5,y-4,10,4);
 q.fillStyle='#3a3446';q.fillRect(x-7,y-70,14,12);q.fillStyle='#ffd88a';q.fillRect(x-5,y-68,10,8);q.fillStyle='#2e2a36';q.beginPath();q.moveTo(x-9,y-70);q.lineTo(x,y-78);q.lineTo(x+9,y-70);q.fill();
 const g=q.createRadialGradient(x,y-64,1,x,y-64,22);g.addColorStop(0,'rgba(255,220,140,.45)');g.addColorStop(1,'rgba(255,220,140,0)');q.fillStyle=g;q.fillRect(x-22,y-86,44,44)}
function flower95(k,x,y,w,h){if(DECOR560.draw(k,'props',5,x*T,y*T,w*T,h*T))return;const px=x*T,py=y*T;k.fillStyle='#6a4a2a';k.fillRect(px,py,w*T,h*T);k.fillStyle='#4a7a2a';k.fillRect(px+3,py+3,w*T-6,h*T-6);
 const C=['#ff6a8a','#ffd84a','#ffffff','#b07aff','#ff9a3a','#6ad0ff'];for(let i=0;i<w*h*7;i++){const fx=px+5+hash(i,x*7+y)*(w*T-10),fy=py+5+hash(y*3+x,i)*(h*T-10);k.fillStyle='#2e5a1a';k.fillRect(fx,fy+2,1.5,3);k.fillStyle=C[i%C.length];k.beginPath();k.arc(fx,fy,2.4,0,7);k.fill()}}
function bench95(k,x,y){if(DECOR560.draw(k,'props',6,x,y,46,28))return;k.fillStyle='rgba(0,0,0,.22)';k.fillRect(x+2,y+24,44,4);k.fillStyle='#7a5228';k.fillRect(x,y+12,46,6);k.fillRect(x,y+4,46,4);k.fillStyle='#3a3a42';k.fillRect(x+2,y+18,3,8);k.fillRect(x+41,y+18,3,8)}
function barrel95(k,x,y,crate){if(DECOR560.draw(k,'props',crate?3:4,x-12,y-22,24,24))return;if(crate){k.fillStyle='rgba(0,0,0,.25)';k.fillRect(x-11,y+1,24,4);k.fillStyle='#a8763a';k.fillRect(x-11,y-18,22,20);k.strokeStyle='#5a3a1a';k.lineWidth=2;k.strokeRect(x-11,y-18,22,20);k.beginPath();k.moveTo(x-11,y-18);k.lineTo(x+11,y+2);k.stroke();return}
 k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(x+2,y+1,11,4,0,0,7);k.fill();const g=k.createLinearGradient(x-10,0,x+10,0);g.addColorStop(0,'#5a3a1a');g.addColorStop(.5,'#9a6a34');g.addColorStop(1,'#4a2e14');k.fillStyle=g;k.fillRect(x-10,y-20,20,21);
 k.fillStyle='#3a3a42';k.fillRect(x-10,y-16,20,2);k.fillRect(x-10,y-5,20,2);k.fillStyle='#b8864a';k.beginPath();k.ellipse(x,y-20,10,3,0,0,7);k.fill()}
function boat95(q,x,y,s,sail){if(DECOR560.draw(q,'props',9,x-62*s,y-126*s,124*s,142*s))return;q.save();q.translate(x,y);q.scale(s,s);q.fillStyle='rgba(0,40,70,.35)';q.beginPath();q.ellipse(4,14,64,12,0,0,7);q.fill();
 q.fillStyle='#6a3e1c';q.beginPath();q.moveTo(-62,-6);q.lineTo(62,-6);q.lineTo(46,14);q.lineTo(-46,14);q.closePath();q.fill();q.fillStyle='#8a5428';q.fillRect(-58,-8,116,6);q.fillStyle='#4a2810';for(let i=-50;i<50;i+=14)q.fillRect(i,-2,2,12);
 q.fillStyle='#5a3418';q.fillRect(-3,-120,6,116);q.fillStyle=sail;q.beginPath();q.moveTo(3,-114);q.quadraticCurveTo(52,-70,6,-20);q.closePath();q.fill();q.beginPath();q.moveTo(-3,-100);q.quadraticCurveTo(-40,-66,-4,-30);q.closePath();q.fill();
 q.fillStyle='#c0392b';q.beginPath();q.moveTo(3,-120);q.lineTo(22,-114);q.lineTo(3,-108);q.fill();q.restore()}
// ---------- ประตูดันเจี้ยน (fix96 เติม C2.portals) ----------
function portalPos95(i,n){const span=Math.min(16,(n-1)*4.5),x0=41.5-span/2;return {x:(x0+(n>1?span*i/(n-1):0))*T+16,y:4.6*T}}
// ---------- ชาวเมือง ----------
const NPC95=[
 {name:'กัปตันเมอร์ริน',c:'#2a4a7a',h:'#e8e0d0',x:6,y:32,fixed:1,hat:1,beard:1,c2warp:1,lines:['เรือของข้าพาเจ้ากลับเมืองเอลโดเรียได้ทุกเมื่อ','ทะเลรอบนครวารีสงบดี แต่ดันเจี้ยนทางเหนือไม่สงบเลย']},
 {name:'ผู้เฝ้าประตูมิติ',c:'#5a2a8a',h:'#d8d0ff',x:41.5,y:7,fixed:1,hat:1,lines:['ประตูมิติแต่ละบานพาไปดันเจี้ยนคนละที่ เลเวลต่างกัน','วัตถุดิบหายากในดันเจี้ยน ช่างในเมืองนี้เอาไปตีของให้ได้']},
 {name:'ทหารยามอัสตรา',c:'#4a3a8a',h:'#c8c8d4',x:39,y:11,fixed:1,spear:1,lines:['เกาะเหนือคือลานประตูมิติ ข้ามสะพานนี้ไป','ห้ามก่อเรื่องในนครวารี!']},
 {name:'ทหารยามอัสตรา',c:'#4a3a8a',h:'#c8c8d4',x:44.5,y:11,fixed:1,spear:1,lines:['ผู้กล้าระดับ 150 ขึ้นไปเท่านั้นที่ข้ามไปได้อย่างปลอดภัย']},
 {name:'ทหารยามปราสาท',c:'#4a3a8a',h:'#c8c8d4',x:55.5,y:47,fixed:1,spear:1,lines:['ท่านเจ้าเมืองอัสตรากำลังประชุมอยู่']},
 {name:'แม่ค้าผ้าไหม',c:'#c05a7a',h:'#3a2a1a',g:'f',x:23,y:26.6,fixed:1,lines:['ผ้าไหมจากเมืองท่า สวยที่สุดในแผ่นดิน!']},
 {name:'พ่อค้าเครื่องเทศ',c:'#a8452f',h:'#6b4a2a',x:57,y:26.6,fixed:1,lines:['เครื่องเทศจากเกาะไกล หอมไปสามบ้านแปดบ้าน']},
 {name:'นักเดินทาง',c:'#3a8a5a',h:'#6b4a2a',x:30,y:30,r:5,lines:['เมืองนี้ใหญ่กว่าเอลโดเรียเยอะเลย','ได้ยินว่าดันเจี้ยนดาราร่วงมีของระดับตำนาน']},
 {name:'สาวน้อยมิเรีย',c:'#e08ab0',h:'#f0d080',g:'f',age:'child',x:44,y:33,r:4,lines:['ศาลากลางลานสวยใช่ไหมล่ะ!','ข้าชอบนั่งดูเรือที่ท่าเรือตะวันตก']},
 {name:'ปราชญ์ชรา',c:'#6a6a8a',h:'#e8e8e8',age:'elder',cane:1,beard:1,x:51,y:33,r:3,lines:['ครั้งหนึ่งนครวารีเคยจมอยู่ใต้ทะเล','วิหารใต้สมุทรยังมีสมบัติของเมืองเก่าอยู่']},
 {name:'คู่รักริมน้ำ',c:'#8a4a6a',h:'#4a2a1a',g:'f',x:77,y:35,r:2,lines:['สวนศาลาฝั่งตะวันออกเหมาะกับการพักผ่อนที่สุด']},
 {name:'ชาวประมง',c:'#4a6a8a',h:'#3a2a1a',hat:1,x:5,y:28,r:2,lines:['วันนี้ปลาไม่ค่อยกินเบ็ดเลย']},
 {name:'เด็กชายโท',c:'#d0a040',h:'#3a2a1a',age:'child',x:38,y:40,r:5,lines:['โตขึ้นข้าจะเป็นนักผจญภัยลงดันเจี้ยนให้หมดทุกที่!']},
 {name:'นักดนตรีเร่',c:'#7a3a9a',h:'#2a1a0a',x:47,y:29,r:2,lines:['♪ ลา ลา ลา ♪ ฟังเพลงแห่งนครวารีไหมท่าน']},
 {name:'คนส่งของ',c:'#8a6a4a',h:'#4a2a1a',apron:1,x:26,y:33,r:6,lines:['ส่งของไม่ทันแล้ว! ร้านแถวนี้สั่งของเยอะมาก']},
 {name:'ชาวเมือง',c:'#5a7a3a',h:'#6b4a2a',g:'f',x:60,y:30,r:5,lines:['ยินดีต้อนรับสู่นครวารีอัสตรา!']}];
function npcs95(){const SRC=C2.npcAlt||NPC95;return SRC.map(d=>{const n=mkNPC(d);n.c2warp=d.c2warp;n.r=(d.r||3)*T;n.sp=24;try{npcRescue(n)}catch(e){}n.home={x:n.x,y:n.y};return n})}
function free95(x,y){return !zHit(x,y)}
function updNpc95(dt){const L=D.npcs||[];for(const n of L){n.mv=false;n.t=(n.t||0)+dt*9;if(n.bub&&(n.bub.t-=dt)<=0)n.bub=null;if(n.fixed)continue;
  const dp=Math.hypot(P.x-n.x,P.y-n.y);if(dp<46){const dx=P.x-n.x,dy=P.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');continue}
  if(n.wait>0){n.wait-=dt;continue}if(!n.tg){for(let i=0;i<10;i++){const x=n.home.x+(Math.random()-.5)*2*n.r,y=n.home.y+(Math.random()-.5)*2*n.r;if(free95(x,y)){n.tg={x,y};break}}if(!n.tg){n.wait=1.5;continue}}
  const dx=n.tg.x-n.x,dy=n.tg.y-n.y,d=Math.hypot(dx,dy);if(d<4){n.tg=null;n.wait=1+Math.random()*4;continue}
  const sx=dx/d*n.sp*dt,sy=dy/d*n.sp*dt;if(free95(n.x+sx,n.y+sy)){n.x+=sx;n.y+=sy;n.mv=true;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}else{n.tg=null;n.wait=.4}}}
// ---------- เข้า / ออก ----------
function enterCity2(from){return Guard.run('enterCity2',()=>{if(P.lv<C2.LV){say('🔒 นครวารีอัสตรา ต้อง Lv.'+C2.LV+' ขึ้นไป');sfx('thud');return}
  if(D&&(D.tower10||D.wb10||D.dg||D.arena8||D.duel29||D.mk10)){say('ออกจากที่นี่ก่อน แล้วค่อยเดินทางไปนครวารี');sfx('thud');return}
  if(D&&D.shop){say('ออกจากร้านก่อน');sfx('thud');return}
  const Zm=buildC2();
  LoadingScreenManager.cover({icon:'⛵',title:'นครวารีอัสตรา',tip:'เมืองที่ 2 · ลงดันเจี้ยนที่ลานประตูมิติทางเหนือ · ร้าน/โต๊ะคราฟ/ธนาคาร เหมือนเมืองแรก'},()=>{
   if(D){try{exitD()}catch(e){}}
   try{closeZMenu()}catch(e){}ZW=Zm.W;ZH=Zm.H;sfx('warp');setScene('cave');flushDrops();if(!(dsav&&dsav.length))dsav=slimes.splice(0);else slimes.length=0;ZPROJ.length=0;
   dm=Zm.m;dcv=Zm.cv;D={zone:Zm,mobs:[],spT:1e9,bossT:1e9,boss:null,ret:[ZG.x,ZG.y+40],ban:0,city2:1,npcs:npcs95()};mkMini(Zm.cv,ZW,ZH,3);
   const sp=from==='dg'?{x:41.5,y:9.5}:{x:41.5,y:55.5};P.x=sp.x*T+16;P.y=sp.y*T+16;P.dir=from==='dg'?'d':'u';P.kx=P.ky=0;MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}
   try{banner('🏙️ นครวารีอัสตรา','เมืองที่ 2 · ลานประตูมิติอยู่ทางเหนือ','green')}catch(e){}})})}
window.enterCity2=enterCity2;
function backToCity1(){LoadingScreenManager.cover({icon:'⛵',title:'เมืองเอลโดเรีย',tip:'ล่องเรือกลับเมืองแรก'},()=>{try{exitD()}catch(e){}try{enterTown()}catch(e){}})}
window.backToCity2_1=backToCity1;
// ออกจากร้าน → กลับมาหน้าประตูในเมือง 2
{const _ls=leaveShop;leaveShop=function(silent){try{if(D&&D.shop&&TOWNSAVE&&TOWNSAVE.D&&TOWNSAVE.D.city2){const id=D.shop,sv=TOWNSAVE;TOWNSAVE=null;
    D=sv.D;dm=sv.dm;dcv=sv.dcv;setMini(sv.MI);shopEl.hidden=true;SHOPK=null;setScene('cave');ZW=D.zone.W;ZH=D.zone.H;try{document.getElementById('bar').style.visibility=''}catch(e){}
    if(silent)return;const d=C2.doors.find(q=>q.id===id);if(d){P.x=d.x;P.y=d.y+18}P.dir='d';P.kx=P.ky=0;P.dash=0;fade('#000');sfx('door');say('ออกจาก'+SHOP_DATA[id].name+'แล้ว');return}}catch(e){console.warn('c2 leave',e)}
  return _ls.apply(this,arguments)};window.leaveShop=leaveShop}
// ไม่มีมอน/บอสในเมือง
{const _sm=spawnMob;spawnMob=function(){if(inC2())return;return _sm.apply(this,arguments)};window.spawnMob=spawnMob}
{const _sb=spawnBoss;spawnBoss=function(){if(inC2()){D.bossT=1e9;return}return _sb.apply(this,arguments)};window.spawnBoss=spawnBoss}
{const _uz=updZone;updZone=function(dt){const r=_uz.apply(this,arguments);try{if(inC2()){D.bossT=1e9;updNpc95(dt)}}catch(e){}return r};window.updZone=updZone}
// ---------- กด E / ⚔️ ----------
const near95=()=>{if(!inC2())return null;let best=null,bd=1e9;
 for(const d of C2.doors){const q=Math.hypot(P.x-d.x,P.y-d.y);if(q<40&&q<bd){bd=q;best={k:'door',d}}}
 C2.portals.forEach((p,i)=>{const pp=portalPos95(i,C2.portals.length),q=Math.hypot(P.x-pp.x,P.y-(pp.y+20));if(q<44&&q<bd){bd=q;best={k:'portal',p,i}}});
 for(const n of D.npcs||[]){const q=Math.hypot(P.x-n.x,P.y-n.y);if(q<40&&q<bd){bd=q;best={k:'npc',n}}}
 const Zm=D.zone,ex=Zm.ent.x*T+16,ey=(Zm.ent.y+2)*T+16;if(Math.hypot(P.x-ex,P.y-ey)<40)best={k:'exit'};return best};
{const _it=interact;interact=function(){try{if(inC2()){const b=near95();if(!b)return false;
    if(b.k==='door'){enterShop(b.d.id);return true}
    if(b.k==='portal'){try{b.p.go()}catch(e){console.warn(e)}return true}
    if(b.k==='exit'){backToCity1();return true}
    if(b.k==='npc'){const n=b.n;n.dir=Math.abs(P.x-n.x)>Math.abs(P.y-n.y)?(P.x<n.x?'l':'r'):(P.y<n.y?'u':'d');
     if(n.c2warp){talk(n,'จะล่องเรือกลับเมืองเอลโดเรียไหม?',[{t:'⛵ กลับเมืองเอลโดเรีย',c:'go',f:()=>backToCity1()},BYE],'⛵ ท่าเรือ');return true}
     npcTalk(n);return true}}}catch(e){console.warn('c2 it',e)}return _it.apply(this,arguments)};window.interact=interact}
// ---------- วาด: น้ำไหว ประตูมิติ ชาวเมือง (ก่อนตัวละคร) ----------
{const _dd=drawDrops;drawDrops=function(){try{if(inC2())drawUnder95()}catch(e){}return _dd.apply(this,arguments)};window.drawDrops=drawDrops}
function view95(){const t=ctx.getTransform(),z=t.a||1,x0=-t.e/z,y0=-t.f/z;return [x0,y0,x0+VW/z,y0+VH/z]}
function drawUnder95(){const t=performance.now()/1000,[x0,y0,x1,y1]=view95();
 const tx0=Math.max(0,Math.floor(x0/T)),ty0=Math.max(0,Math.floor(y0/T)),tx1=Math.min(C2.W-1,Math.ceil(x1/T)),ty1=Math.min(C2.H-1,Math.ceil(y1/T));
 ctx.lineWidth=1.4;for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){if(G95[y][x]!=='sea'||(x*7+y*3)%4)continue;const ph=t*1.6+x*.9+y*1.3,a=.18+.16*Math.sin(ph),px=x*T+8+Math.sin(ph*.7)*5,py=y*T+16+Math.cos(ph*.5)*4;
  ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+6,py-3,px+12,py);ctx.stroke()}
 C2.portals.forEach((p,i)=>{const pp=portalPos95(i,C2.portals.length),x=pp.x,y=pp.y,col=p.col||'150,110,255',ok=P.lv>=p.lv;
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y+22,34,8,0,0,7);ctx.fill();
  ctx.fillStyle='#6a6478';ctx.fillRect(x-34,y-50,10,72);ctx.fillRect(x+24,y-50,10,72);ctx.fillStyle='#8a8498';ctx.fillRect(x-38,y-58,76,10);ctx.fillStyle='#e8c14a';ctx.fillRect(x-38,y-50,76,3);
  ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-12,2,x,y-12,30);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.5,'rgba('+col+','+(ok?.7:.25)+')');g.addColorStop(1,'rgba('+col+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y-12,24,32,0,0,7);ctx.fill();
  ctx.strokeStyle='rgba('+col+','+(ok?.9:.35)+')';ctx.lineWidth=2.5;for(let r=0;r<3;r++){ctx.beginPath();ctx.ellipse(x,y-12,8+r*6,12+r*8,0,t*(2+r)+r,t*(2+r)+r+4.2);ctx.stroke()}ctx.restore();
  const lab=(ok?'':'🔒 ')+p.n,sub='Lv.'+p.lv+'–'+p.lv2;ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';
  ctx.strokeText(lab,x,y-64);ctx.fillStyle=ok?'#fff':'#c8c0d8';ctx.fillText(lab,x,y-64);ctx.font='bold 10px system-ui';ctx.strokeText(sub,x,y+36);ctx.fillStyle=ok?'#9dffb0':'#ff9a9a';ctx.fillText(sub,x,y+36);ctx.textAlign='left'});
 // วงเวทกลับเมือง 1 (ป้าย)
 const Zm=D.zone,ex=Zm.ent.x*T+16,ey=(Zm.ent.y+2)*T+16;ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText('⛵ เรือไปท่าเรือตะวันออก',ex,ey+28);ctx.fillStyle='#fff';ctx.fillText('⛵ เรือไปท่าเรือตะวันออก',ex,ey+28);ctx.textAlign='left';
 for(const n of D.npcs||[])if(n.y<P.y)try{drawNPC(n,t)}catch(e){}}
// ---------- วาด: ชาวเมืองข้างหน้า + ของที่บังตัวละคร + ป้ายกด E (หลังตัวละคร) ----------
{const _dt=drawDmgTxt;drawDmgTxt=function(dt){try{if(inC2())drawOver95()}catch(e){}return _dt.apply(this,arguments)};window.drawDmgTxt=drawDmgTxt}
function drawOver95(){const t=performance.now()/1000;for(const n of D.npcs||[])if(n.y>=P.y)try{drawNPC(n,t)}catch(e){}
 const ents=[{x:P.x,y:P.y}];try{for(const o of NET.others.values())ents.push(o)}catch(e){}for(const n of D.npcs||[])ents.push(n);
 const [x0,y0,x1,y1]=view95();
 for(const o of C2.occ){if(o.x0>x1||o.x0+o.w<x0||o.y0>y1||o.y0+o.h<y0)continue;let hit=false;for(const e of ents){if(e.y<o.base&&e.y>o.y0-10&&e.x>o.x0-10&&e.x<o.x0+o.w+10){hit=true;break}}if(hit)ctx.drawImage(o.cv,o.x0,o.y0)}
 const b=near95();if(b){let x,y,txt;if(b.k==='door'){x=b.d.x;y=b.d.y-6;txt='🚪 กด E เข้า '+b.d.n}else if(b.k==='portal'){const pp=portalPos95(b.i,C2.portals.length);x=pp.x;y=pp.y-80;txt=P.lv>=b.p.lv?'🌀 กด E ลง '+b.p.n:'🔒 ต้อง Lv.'+b.p.lv}
  else if(b.k==='npc'){x=b.n.x;y=b.n.y-62;txt='💬 กด E คุยกับ'+b.n.name}else{const Zm=D.zone;x=Zm.ent.x*T+16;y=(Zm.ent.y+2)*T-10;txt='⛵ กด E ล่องเรือไปท่าเรือตะวันออก (ทางกลับเอลโดเรีย)'}
  ctx.font='bold 12px system-ui,"Noto Sans Thai",sans-serif';const w=ctx.measureText(txt).width+16;ctx.fillStyle='rgba(20,14,34,.85)';ctx.beginPath();ctx.roundRect?ctx.roundRect(x-w/2,y-18,w,22,8):ctx.rect(x-w/2,y-18,w,22);ctx.fill();ctx.strokeStyle='#e8c14a';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#ffe6a8';ctx.textAlign='center';ctx.fillText(txt,x,y-3);ctx.textAlign='left'}}
// ---------- ทางไปเมือง 2 ----------
// กัปตันเรือในเมือง 1 (ข้างน้ำพุ)
function capt95(){try{if(D&&D.town&&D.npcs&&!D.npcs.some(n=>n.c2warp)){const n=mkNPC({name:'กัปตันเรือวารี',c:'#2a4a7a',h:'#e8e0d0',x:24.5,y:18.5,fixed:1,hat:1,beard:1,lines:['เรือของข้าล่องไปนครวารีอัสตรา เมืองที่ 2']});n.c2warp=1;try{npcRescue(n)}catch(e){}D.npcs.push(n)}}catch(e){console.warn('c2 npc',e)}}
{const _et=enterTown;enterTown=function(){const r=_et.apply(this,arguments);capt95();setTimeout(capt95,50);setTimeout(capt95,600);return r};window.enterTown=enterTown}
setInterval(capt95,2000)
{const _nt=npcTalk;npcTalk=function(n){if(n&&n.c2warp&&!inC2()){talk(n,'⛵ นครวารีอัสตรา — เมืองที่ 2 ของผู้กล้า Lv.'+C2.LV+' ขึ้นไป\nเมืองท่าใหญ่กลางทะเล มีดันเจี้ยนหลายแห่งให้ลงหาวัตถุดิบ'+(P.lv<C2.LV?'\n🔒 เจ้ายังเลเวลไม่ถึง (Lv.'+P.lv+')':''),
   [{t:'⛵ ล่องเรือไปนครวารี',c:'go',f:()=>enterCity2()},BYE],'⛵ กัปตันเรือ');return}return _nt.apply(this,arguments)};window.npcTalk=npcTalk}
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['🏙️','เมือง 2',()=>{if(inC2()){say('อยู่ในนครวารีอัสตราแล้ว');return}enterCity2()}]);pmRender7()}catch(e){}
}catch(e){console.warn('fix95',e)}
