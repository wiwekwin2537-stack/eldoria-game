// fix98 (v4.83) — วาดนครวารีอัสตราใหม่ทั้งเมือง (เจ้าของสั่ง 2026-10-14 14:54: "อย่ายกของเมือง 1 มา เอาแค่สไตล์ · ต้องเป็นเมืองเศรษฐกิจดี แบบรูปตัวอย่าง")
//  - อาคารวาดใหม่ทั้งหมด (ไม่ใช้รูปอาคารเมือง 1): บ้าน 2–3 ชั้นโครงไม้ หลังคากระเบื้องส้ม/หินชนวนฟ้า/เขียว ระเบียง หน้าต่างบานเกล็ด กระบะดอกไม้ ปล่องไฟ
//    ร้านค้าผ้าใบลาย+ตู้โชว์ · โรงเตี๊ยมป้ายแก้วเบียร์ · คฤหาสน์หน้าจั่วตราทอง · ธนาคารหินเสา · หอคอยกลมโดมแดง
//  - ผังแน่นแบบเมืองค้าขาย: ถนนหินอุ่น ขอบทางหินอ่อน · ถนนใหญ่ 4 สายเข้าลานวงกลมกลางเมือง น้ำพุ 2 ชั้น · แผงตลาดรอบลาน · ธงราวข้ามถนน · เกวียนสินค้า ลังไม้ กระสอบ
//  - เกาะเหนือ (ประตูดันเจี้ยน) · เกาะตะวันตก (ท่าเรือ+โกดัง) · เกาะตะวันออก (สวนศาลา) · เกาะใต้ (ท่าเข้าเมือง) ยังอยู่ที่เดิม
//  - ต่อกับ fix95 ผ่าน C2.alt (สร้างผัง) และ C2.npcAlt (ชาวเมือง) · ประตูร้านยังพาเข้าร้านเดิมทั้งหมด
try{
const T98=T;
/* v5.58 ภาพเมือง 2 จาก ChatGPT (ตรวจ/จัดขอบ/ทำพื้นต่อไร้รอยแล้ว) · โหลดไม่ขึ้น → ใช้ภาพวาดด้วยโค้ดเดิม · ตำแหน่งอาคาร/ประตู/ทางเดินเหมือนเดิมทุกจุด */
const C2ART={src:{b:'assets/incoming/city-buildings-v585.png',g:'assets/incoming/city-ground-v585.png'},img:{},ok:{},started:0,
 BOX:{weapon:[37,168,309,328],armor:[415,140,322,356],forge:[801,139,317,357],potion:[1192,142,304,354],bank:[31,634,321,374],guild:[405,616,342,392],inn:[791,641,338,367],clock:[1182,611,324,397]},
 SHOP:{gear:'forge',potion:'potion',bank:'bank',guild:'guild',inn:'inn'},
 start(){if(this.started)return;this.started=1;for(const k in this.src){const im=new Image();im.decoding='async';im.onload=()=>{this.ok[k]=1;try{if(this.ok.b&&this.ok.g&&C2.Zm&&!C2.Zm.art558&&!(window.inC2&&inC2()))C2.Zm=null}catch(e){}};im.onerror=()=>{this.ok[k]=0};im.src=this.src[k];this.img[k]=im}},
 ready(k){const im=this.img[k];return this.ok[k]===1&&!!im&&im.naturalWidth>0}};
window.C2ART=C2ART;setTimeout(()=>{try{if((P.lv|0)>=140)C2ART.start()}catch(e){}},8000);
function rng98(s){let a=s>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
const sh98=(h,a)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return 'rgb('+f(r)+','+f(g)+','+f(b)+')'};
// ---------- พื้นผิว ----------
function stoneTex98(pal,mort,cell,seed){const c=document.createElement('canvas');c.width=c.height=128;const k=c.getContext('2d'),R=rng98(seed);k.fillStyle=mort;k.fillRect(0,0,128,128);
 for(let gy=0;gy<128/cell;gy++)for(let gx=0;gx<128/cell;gx++){const off=(gy%2)*cell*.5,x=gx*cell+off+R()*1.6-.8,y=gy*cell+R()*1.6-.8,w=cell-1.5-R()*1.8,h=cell-1.5-R()*1.8,col=pal[Math.floor(R()*pal.length)];
  for(const dx of [0,-128]){const xx=x+dx;k.fillStyle=col;k.beginPath();k.roundRect?k.roundRect(xx+1,y+1,w,h,cell*.3):k.rect(xx+1,y+1,w,h);k.fill();
   k.fillStyle='rgba(255,255,255,.18)';k.fillRect(xx+2,y+1.5,w-3,1);k.fillStyle='rgba(0,0,0,.2)';k.fillRect(xx+1.5,y+h,w-1,1)}}
 return c}
// ---------- อาคาร ----------
function roof98(q,X,Y,Wp,top,eave,col,kind,R){const xl0=X+Wp*.14,xr0=X+Wp*.86,xl1=X-7,xr1=X+Wp+7;
 q.fillStyle=sh98(col,-.45);q.beginPath();q.moveTo(xl0,top);q.lineTo(xr0,top);q.lineTo(xr1,eave+5);q.lineTo(xl1,eave+5);q.closePath();q.fill();
 const rows=Math.max(3,Math.round((eave-top)/7));for(let i=0;i<rows;i++){const t0=i/rows,t1=(i+1)/rows,y0=top+(eave-top)*t0,y1=top+(eave-top)*t1,xl=xl0+(xl1-xl0)*t1,xr=xr0+(xr1-xr0)*t1,xla=xl0+(xl1-xl0)*t0,xra=xr0+(xr1-xr0)*t0;
  q.fillStyle=sh98(col,.12-.28*t1);q.beginPath();q.moveTo(xla,y0);q.lineTo(xra,y0);q.lineTo(xr,y1+1);q.lineTo(xl,y1+1);q.closePath();q.fill();
  if(kind==='slate'){q.strokeStyle='rgba(20,24,40,.45)';q.lineWidth=1;q.beginPath();q.moveTo(xl,y1);q.lineTo(xr,y1);q.stroke();const st=9;for(let x=xl+((i%2)*st/2);x<xr;x+=st){q.beginPath();q.moveTo(x,y0+1);q.lineTo(x,y1);q.stroke()}}
  else{q.strokeStyle='rgba(60,20,10,.5)';q.lineWidth=1;const st=7;for(let x=xl+((i%2)*3.5);x<xr-2;x+=st){q.beginPath();q.arc(x+3.5,y1-1,3.4,0,Math.PI);q.stroke();if(R()<.12){q.fillStyle=sh98(col,.25);q.fillRect(x+1,y0+1.5,5,2)}}}}
 // แสงข้าง
 const g=q.createLinearGradient(xl1,0,xr1,0);g.addColorStop(0,'rgba(255,255,255,.10)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,30,.22)');q.fillStyle=g;q.beginPath();q.moveTo(xl0,top);q.lineTo(xr0,top);q.lineTo(xr1,eave+5);q.lineTo(xl1,eave+5);q.closePath();q.fill();
 q.strokeStyle='rgba(30,12,6,.85)';q.lineWidth=1.6;q.stroke();q.fillStyle=sh98(col,.3);q.fillRect(xl0,top-2,xr0-xl0,3);
 q.fillStyle='rgba(0,0,0,.35)';q.fillRect(xl1+4,eave+5,xr1-xl1-8,3)}
function window98(q,x,y,w,h,shut,trim,R,flower){q.fillStyle=trim;q.fillRect(x-2,y-2,w+4,h+4);const g=q.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#bfe6ff');g.addColorStop(.5,'#5a8ab8');g.addColorStop(1,'#2a4a6a');q.fillStyle=g;q.fillRect(x,y,w,h);
 q.fillStyle='rgba(255,255,255,.45)';q.beginPath();q.moveTo(x+2,y+h-3);q.lineTo(x+w*.55,y+2);q.lineTo(x+w*.75,y+2);q.lineTo(x+4,y+h-1);q.fill();q.fillStyle=trim;q.fillRect(x+w/2-1,y,2,h);q.fillRect(x,y+h*.45,w,2);
 if(shut){for(const sx of [x-2-6,x+w+2]){q.fillStyle=shut;q.fillRect(sx,y-2,6,h+4);q.fillStyle='rgba(0,0,0,.25)';for(let i=1;i<5;i++)q.fillRect(sx,y-2+i*(h+4)/5,6,1)}}
 if(flower){q.fillStyle='#6a3e1c';q.fillRect(x-3,y+h+2,w+6,4);const C=['#ff5a7a','#ffd84a','#ffffff','#c07aff','#ff8a3a'];for(let i=0;i<5;i++){q.fillStyle='#3a7a2a';q.fillRect(x-1+i*(w+2)/5,y+h,2,3);q.fillStyle=C[Math.floor(R()*C.length)];q.beginPath();q.arc(x+i*(w+2)/5,y+h-1,2.2,0,7);q.fill()}}}
function door98(q,cx,base,w,h,col,trim){q.fillStyle='#8a8478';q.fillRect(cx-w/2-5,base-4,w+10,4);q.fillStyle=trim;q.beginPath();q.moveTo(cx-w/2-3,base-4);q.lineTo(cx-w/2-3,base-h+w/2);q.arc(cx,base-h+w/2,w/2+3,Math.PI,0);q.lineTo(cx+w/2+3,base-4);q.fill();
 q.fillStyle=col;q.beginPath();q.moveTo(cx-w/2,base-4);q.lineTo(cx-w/2,base-h+w/2);q.arc(cx,base-h+w/2,w/2,Math.PI,0);q.lineTo(cx+w/2,base-4);q.fill();
 q.fillStyle='rgba(0,0,0,.25)';for(let i=1;i<4;i++)q.fillRect(cx-w/2+i*w/4,base-h+4,1,h-8);q.fillStyle='#2a2a30';q.fillRect(cx-w/2,base-h+10,w,2);q.fillRect(cx-w/2,base-12,w,2);q.fillStyle='#e8c14a';q.beginPath();q.arc(cx+w/2-4,base-h/2,1.6,0,7);q.fill()}
function awning98(q,x,y,w,col){const n=Math.max(4,Math.round(w/9));for(let i=0;i<n;i++){q.fillStyle=i%2?col:'#f6f0e2';q.beginPath();q.moveTo(x+i*w/n,y);q.lineTo(x+(i+1)*w/n,y);q.lineTo(x+(i+1)*w/n+2,y+10);q.lineTo(x+i*w/n+2,y+10);q.fill();q.beginPath();q.arc(x+(i+.5)*w/n+2,y+10,w/n/2,0,Math.PI);q.fill()}
 q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x,y+14,w,3);q.strokeStyle='rgba(40,20,10,.5)';q.lineWidth=1;q.strokeRect(x,y,w,10)}
function sign98(q,x,y,txt,col){q.fillStyle='#3a2414';q.fillRect(x-1,y-6,16,2);q.fillRect(x+13,y-6,2,6);q.fillStyle=col||'#7a4a22';q.fillRect(x-2,y,20,16);q.strokeStyle='#e8c14a';q.lineWidth=1.2;q.strokeRect(x-2,y,20,16);q.font='11px system-ui';q.textAlign='center';q.fillText(txt,x+8,y+12);q.textAlign='left'}
// อาคารทั่วไป: X,Y = มุมซ้ายบนของฐาน (px) Wp,Hp = ขนาดฐาน · หลังคายื่นขึ้นไปเหนือฐาน 1.4 ช่อง
function house98(q,X,Y,Wp,Hp,o,R){const ext=Math.round(T98*1.5),base=Y+Hp,top=Y-ext,fl=o.floors||2,fh=Math.min(Hp+ext-22,22+fl*28),eave=base-fh;
 {const sg=q.createLinearGradient(0,base-2,0,base+12);sg.addColorStop(0,'rgba(20,12,6,.45)');sg.addColorStop(1,'rgba(20,12,6,0)');q.fillStyle=sg;q.fillRect(X-4,base-2,Wp+14,14);const sr=q.createLinearGradient(X+Wp,0,X+Wp+12,0);sr.addColorStop(0,'rgba(20,12,6,.3)');sr.addColorStop(1,'rgba(20,12,6,0)');q.fillStyle=sr;q.fillRect(X+Wp,base-fh+6,12,fh+4)}
 // ผนัง
 const wall=o.wall||'#e8dcc0',trim=o.trim||'#5a3a22';const g=q.createLinearGradient(X,0,X+Wp,0);g.addColorStop(0,sh98(wall,.06));g.addColorStop(1,sh98(wall,-.12));q.fillStyle=g;q.fillRect(X,eave,Wp,fh);
 if(o.style==='bank'||o.style==='stone'){q.strokeStyle='rgba(60,50,40,.28)';q.lineWidth=1;for(let y=eave+6;y<base;y+=8){q.beginPath();q.moveTo(X,y);q.lineTo(X+Wp,y);q.stroke();for(let x=X+((Math.floor((y-eave)/8))%2)*8;x<X+Wp;x+=16){q.beginPath();q.moveTo(x,y-8);q.lineTo(x,y);q.stroke()}}}
 else{q.fillStyle=trim;q.fillRect(X,eave,4,fh);q.fillRect(X+Wp-4,eave,4,fh);const fhF=(fh-10)/fl;for(let f=1;f<fl;f++)q.fillRect(X,base-10-f*fhF-2,Wp,4);
  for(let x=X+T98*1.25;x<X+Wp-T98*.6;x+=T98*1.25)q.fillRect(x-2,eave,4,fh-10);
  if(o.brace){q.strokeStyle=trim;q.lineWidth=3;for(let x=X+4;x+T98*1.25<=X+Wp;x+=T98*2.5){q.beginPath();q.moveTo(x+2,eave+2);q.lineTo(x+T98*1.2,eave+fhF-2);q.stroke()}}}
 // ฐานหิน
 q.fillStyle='#8a8478';q.fillRect(X,base-10,Wp,10);q.fillStyle='#6e695e';for(let x=X;x<X+Wp;x+=10)q.fillRect(x+(R()*3|0),base-10,1.5,10);q.fillStyle='rgba(255,255,255,.18)';q.fillRect(X,base-10,Wp,1.5);
 // หน้าต่าง/ประตู
 const fhF=(fh-10)/fl,cx=X+Wp/2,doorW=o.style==='manor'||o.style==='bank'?22:16,doorH=o.style==='manor'||o.style==='bank'?30:26;
 for(let f=0;f<fl;f++){const yb=base-10-f*fhF,wy=yb-fhF+8,wh=Math.min(18,fhF-14);const n=Math.max(1,Math.floor(Wp/(T98*1.25)));
  for(let i=0;i<n;i++){const wx=X+(i+.5)*Wp/n-7;if(f===0&&Math.abs(wx+7-cx)<doorW)continue;if(f===0&&o.style==='shop'){continue}window98(q,wx,wy,14,wh,o.shut,trim,R,f>0||R()<.5)}}
 if(o.style==='shop'){const dw=Math.max(20,(Wp-doorW-24)/2);for(const sx of [X+6,X+Wp-6-dw]){q.fillStyle=trim;q.fillRect(sx-2,base-10-fhF+8,dw+4,fhF-12);q.fillStyle='#d8eef8';q.fillRect(sx,base-10-fhF+10,dw,fhF-16);
   const C=['#e74c3c','#f1c40f','#2ecc71','#e67e22','#9b59b6','#3498db','#ecf0f1'];for(let i=0;i<Math.floor(dw/6);i++){q.fillStyle=C[Math.floor(R()*C.length)];q.fillRect(sx+2+i*6,base-18-(i%2)*6,4,5)}}
  awning98(q,X+2,base-10-fhF+2,Wp-4,o.awn||'#c0392b')}
 if(o.balcony&&fl>=2){const by=base-10-fhF,bw=Math.min(Wp-16,T98*2.2),bx=cx-bw/2;q.fillStyle='#6a4422';q.fillRect(bx-3,by-3,bw+6,5);q.strokeStyle='#4a2e14';q.lineWidth=1.5;for(let x=bx;x<=bx+bw;x+=5){q.beginPath();q.moveTo(x,by-3);q.lineTo(x,by-14);q.stroke()}q.fillRect(bx-3,by-16,bw+6,3);
  q.fillStyle='#3a7a2a';q.beginPath();q.arc(bx+4,by-17,4,0,7);q.arc(bx+bw-4,by-17,4,0,7);q.fill();q.fillStyle='#ff6a8a';q.beginPath();q.arc(bx+4,by-19,1.6,0,7);q.arc(bx+bw-4,by-19,1.6,0,7);q.fill()}
 if(o.style==='manor'||o.style==='bank'){for(const sx of [cx-doorW/2-10,cx+doorW/2+5]){const cg=q.createLinearGradient(sx,0,sx+5,0);cg.addColorStop(0,'#fff');cg.addColorStop(1,'#bdb6a6');q.fillStyle=cg;q.fillRect(sx,base-10-fhF+4,5,fhF-6)}}
 door98(q,cx,base,doorW,doorH,o.door||'#7a4a22',trim);
 if(o.style==='tavern'){sign98(q,cx+doorW/2+6,base-doorH-8,'🍺','#7a4a22');q.fillStyle='#ffd88a';q.beginPath();q.arc(cx-doorW/2-8,base-doorH+4,3,0,7);q.fill()}
 if(o.banner){for(const bx of [X+8,X+Wp-18]){q.fillStyle=o.banner;q.fillRect(bx,eave+4,10,22);q.beginPath();q.moveTo(bx,eave+26);q.lineTo(bx+5,eave+21);q.lineTo(bx+10,eave+26);q.fill();q.fillStyle='#e8c14a';q.fillRect(bx,eave+4,10,2);q.beginPath();q.arc(bx+5,eave+14,2.5,0,7);q.fill()}}
 // หลังคา
 roof98(q,X,Y,Wp,top,eave,o.roof||'#c0603a',o.roofKind,R);
 if(o.style==='manor'){const pw=Math.min(Wp*.45,90),py=eave;q.fillStyle=sh98(wall,.08);q.beginPath();q.moveTo(cx-pw/2,py+6);q.lineTo(cx,py-34);q.lineTo(cx+pw/2,py+6);q.closePath();q.fill();q.strokeStyle=trim;q.lineWidth=2;q.stroke();
  q.fillStyle='#e8c14a';q.beginPath();q.arc(cx,py-10,7,0,7);q.fill();q.fillStyle='#8a5a10';q.beginPath();q.arc(cx,py-10,3,0,7);q.fill()}
 if(o.dormer){const n=Math.max(1,Math.floor(Wp/(T98*2)));for(let i=0;i<n;i++){const dx=X+(i+.5)*Wp/n-8,dy=top+(eave-top)*.45;q.fillStyle=sh98(wall,-.05);q.fillRect(dx,dy,16,14);window98(q,dx+3,dy+3,10,9,null,trim,R,false);
   q.fillStyle=sh98(o.roof||'#c0603a',-.1);q.beginPath();q.moveTo(dx-3,dy+1);q.lineTo(dx+8,dy-9);q.lineTo(dx+19,dy+1);q.closePath();q.fill();q.strokeStyle='rgba(30,12,6,.8)';q.lineWidth=1;q.stroke()}}
 if(o.chimney!==false){const chx=X+Wp*(.62+R()*.15),chy=top-6;q.fillStyle='#8a4a3a';q.fillRect(chx,chy,10,20);q.fillStyle='#5a2a1a';q.fillRect(chx-2,chy-3,14,4);q.strokeStyle='rgba(0,0,0,.3)';q.lineWidth=1;for(let y=chy+4;y<chy+20;y+=5){q.beginPath();q.moveTo(chx,y);q.lineTo(chx+10,y);q.stroke()}}}
function tower98(q,X,Y,Wp,Hp,o){const base=Y+Hp,cx=X+Wp/2,r=Wp/2,top=Y-T98*2.2,bodyTop=Y-T98*.4;
 q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.ellipse(cx+6,base,r+6,8,0,0,7);q.fill();
 const g=q.createLinearGradient(X,0,X+Wp,0);g.addColorStop(0,'#cfc6b2');g.addColorStop(.35,'#f0e8d6');g.addColorStop(1,'#8a8270');q.fillStyle=g;q.fillRect(X,bodyTop,Wp,base-bodyTop);q.beginPath();q.ellipse(cx,base,r,7,0,0,Math.PI);q.fill();
 q.strokeStyle='rgba(80,70,50,.3)';q.lineWidth=1;for(let y=bodyTop+8;y<base;y+=9){q.beginPath();q.ellipse(cx,y,r,5,0,0,Math.PI);q.stroke()}
 q.fillStyle='#8a2a2a';q.fillRect(X-3,bodyTop+(base-bodyTop)*.42,Wp+6,6);q.fillStyle='#e8c14a';q.fillRect(X-3,bodyTop+(base-bodyTop)*.42,Wp+6,1.5);
 for(const [wy,ws] of [[bodyTop+14,1],[bodyTop+(base-bodyTop)*.55,1]])for(const dx of [-r*.45,0,r*.45]){const wx=cx+dx-5;q.fillStyle='#4a2a14';q.fillRect(wx-1,wy-1,12,20);q.fillStyle='#5a8ab8';q.fillRect(wx+1,wy+4,8,13);q.beginPath();q.arc(wx+5,wy+4,4,Math.PI,0);q.fill();q.fillStyle='rgba(255,255,255,.4)';q.fillRect(wx+2,wy+5,2,8)}
 door98(q,cx,base+3,18,28,'#6a3a1a','#4a2e14');
 // โดม
 const dg=q.createRadialGradient(cx-r*.35,bodyTop-r*.6,4,cx,bodyTop,r*1.3);dg.addColorStop(0,'#ff9a8a');dg.addColorStop(.5,o.roof||'#c03a3a');dg.addColorStop(1,'#5a1414');q.fillStyle=dg;
 q.beginPath();q.moveTo(X-6,bodyTop+4);q.quadraticCurveTo(X-4,top+10,cx,top);q.quadraticCurveTo(X+Wp+4,top+10,X+Wp+6,bodyTop+4);q.closePath();q.fill();q.strokeStyle='#3a0a0a';q.lineWidth=1.6;q.stroke();
 q.strokeStyle='rgba(255,220,180,.35)';q.lineWidth=1.2;for(const f of [-.6,-.25,.1,.45]){q.beginPath();q.moveTo(cx+f*r*1.2,bodyTop+4);q.quadraticCurveTo(cx+f*r*.6,top+20,cx,top+2);q.stroke()}
 q.fillStyle='#e8c14a';q.fillRect(X-6,bodyTop+2,Wp+12,4);q.fillRect(cx-1.5,top-24,3,26);q.beginPath();q.arc(cx,top-2,4,0,7);q.fill();q.fillStyle='#8f6bff';q.beginPath();q.moveTo(cx+1.5,top-24);q.lineTo(cx+16,top-19);q.lineTo(cx+1.5,top-14);q.fill()}
function fount98(q,cx,cy){if(DECOR560.draw(q,'extra2',7,cx-64,cy-102,128,128))return;q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(cx+4,cy+6,60,20,0,0,7);q.fill();
 const rim=(rx,ry,y,h)=>{q.fillStyle='#a8a090';q.beginPath();q.ellipse(cx,y+h,rx,ry,0,0,Math.PI);q.fill();q.fillRect(cx-rx,y,rx*2,h);q.fillStyle='#d8d0c0';q.beginPath();q.ellipse(cx,y,rx,ry,0,0,7);q.fill();
  const w=q.createRadialGradient(cx,y,2,cx,y,rx);w.addColorStop(0,'#bfefff');w.addColorStop(1,'#3a8ac8');q.fillStyle=w;q.beginPath();q.ellipse(cx,y,rx-6,ry-4,0,0,7);q.fill();q.strokeStyle='rgba(255,255,255,.5)';q.lineWidth=1;q.beginPath();q.ellipse(cx,y,rx*.6,ry*.6,0,0,7);q.stroke()};
 rim(56,18,cy-6,10);q.fillStyle='#bdb6a6';q.fillRect(cx-7,cy-44,14,36);rim(28,9,cy-46,7);q.fillStyle='#cfc6b2';q.fillRect(cx-4,cy-70,8,24);rim(12,4,cy-72,4);
 q.fillStyle='#e8c14a';q.beginPath();q.arc(cx,cy-80,5,0,7);q.fill();q.strokeStyle='rgba(200,240,255,.85)';q.lineWidth=2;for(const s of [-1,1]){q.beginPath();q.moveTo(cx,cy-80);q.quadraticCurveTo(cx+s*16,cy-96,cx+s*24,cy-52);q.stroke();q.beginPath();q.moveTo(cx+s*20,cy-48);q.quadraticCurveTo(cx+s*42,cy-58,cx+s*46,cy-12);q.stroke()}}
function cart98(q,x,y,R){if(DECOR560.draw(q,'props',2,x,y-12,70,42)){for(let i=0;i<10;i++)R();return;}q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(x+24,y+18,30,5,0,0,7);q.fill();q.fillStyle='#8a5a2a';q.fillRect(x,y-6,50,16);q.fillStyle='#6a4220';q.fillRect(x,y+6,50,4);q.fillRect(x+48,y+2,22,3);
 const C=['#e74c3c','#f1c40f','#2ecc71','#e67e22','#d35400','#ecf0f1'];for(let i=0;i<10;i++){q.fillStyle=C[Math.floor(R()*C.length)];q.beginPath();q.arc(x+5+i*4.4,y-8-(i%3)*2,3.2,0,7);q.fill()}
 for(const wx of [x+10,x+40]){q.fillStyle='#4a2e14';q.beginPath();q.arc(wx,y+12,7,0,7);q.fill();q.fillStyle='#8a5a2a';q.beginPath();q.arc(wx,y+12,4,0,7);q.fill()}}
function crates98(q,x,y,R){if(DECOR560.draw(q,'props',3,x,y-26,38,27))return;for(const [dx,dy] of [[0,0],[14,0],[7,-12]]){q.fillStyle='#a8763a';q.fillRect(x+dx,y+dy-12,13,12);q.strokeStyle='#5a3a1a';q.lineWidth=1.4;q.strokeRect(x+dx,y+dy-12,13,12);q.beginPath();q.moveTo(x+dx,y+dy-12);q.lineTo(x+dx+13,y+dy);q.stroke()}
 q.fillStyle='#d8c8a0';q.beginPath();q.ellipse(x+34,y-5,7,8,0,0,7);q.fill();q.strokeStyle='#8a7a5a';q.stroke();q.fillStyle='#8a6a3a';q.fillRect(x+31,y-14,6,3)}
function planter98(q,cx,cy,tree){if(DECOR560.draw(q,'props',tree?8:5,cx-16,cy-(tree?64:30),32,tree?64:30))return;q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(cx+3,cy+3,16,5,0,0,7);q.fill();q.fillStyle='#9a9286';q.beginPath();q.ellipse(cx,cy,15,6,0,0,7);q.fill();q.fillRect(cx-15,cy-8,30,8);q.fillStyle='#bdb6a6';q.beginPath();q.ellipse(cx,cy-8,15,6,0,0,7);q.fill();q.fillStyle='#4a3a22';q.beginPath();q.ellipse(cx,cy-8,12,4,0,0,7);q.fill();
 if(tree){q.fillStyle='#5a3a1a';q.fillRect(cx-3,cy-40,6,32);for(const [dx,dy,r,c] of [[0,-50,17,'#2f6a2f'],[-10,-42,12,'#2a5a2a'],[10,-43,12,'#3a7a3a'],[0,-60,11,'#4a8a40']]){const g=q.createRadialGradient(cx+dx-4,cy+dy-4,2,cx+dx,cy+dy,r);g.addColorStop(0,'#7ac070');g.addColorStop(1,c);q.fillStyle=g;q.beginPath();q.arc(cx+dx,cy+dy,r,0,7);q.fill()}}
 else{q.fillStyle='#3a7a2a';q.beginPath();q.arc(cx-5,cy-12,6,0,7);q.arc(cx+5,cy-12,6,0,7);q.arc(cx,cy-16,6,0,7);q.fill();const C=['#ff5a7a','#ffd84a','#fff','#c07aff'];for(let i=0;i<7;i++){q.fillStyle=C[i%4];q.beginPath();q.arc(cx-9+i*3,cy-14-(i%2)*5,2,0,7);q.fill()}}}
// ---------- ผังเมือง ----------
function build98(G){C2ART.start();const ART558=C2ART.ready('b')&&C2ART.ready('g');const W=C2.W,H=C2.H,R=rng98(98001);for(let y=0;y<H;y++){G[y]=[];for(let x=0;x<W;x++)G[y][x]='sea'}
 const rr=(x0,y0,x1,y1,r,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const dx=Math.max(x0+r-x,0,x-(x1-r)),dy=Math.max(y0+r-y,0,y-(y1-r));if(dx*dx+dy*dy<=r*r+1)G[y][x]=v}};
 const fill=(x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(G[y]&&G[y][x]!=null)G[y][x]=v};
 rr(13,11,70,52,5,'street');rr(30,2,53,8,3,'plaza');rr(34,55,49,61,3,'plaza');rr(2,24,10,39,3,'street');rr(73,24,81,39,3,'land');
 rr(3,5,9,11,3,'land');rr(74,5,80,11,3,'land');rr(4,50,10,57,3,'land');rr(73,50,80,57,3,'land');
 fill(13,30,70,33,'path');fill(40,11,43,52,'path');for(let y=22;y<=41;y++)for(let x=32;x<=51;x++){const dx=x-41.5,dy=y-31.5;if(dx*dx+dy*dy<=64)G[y][x]='plaza'}
 fill(40,8,43,10,'bridge');fill(40,53,43,54,'bridge');fill(11,30,12,33,'bridge');fill(71,30,72,33,'bridge');fill(4,40,6,44,'dock');
 rr(75,26,79,37,2,'garden');
 const m=[];for(let y=0;y<H;y++){m[y]=[];for(let x=0;x<W;x++)m[y][x]=G[y][x]==='sea'?WL:FL}
 const cv=document.createElement('canvas');cv.width=W*T;cv.height=H*T;const k=cv.getContext('2d');
 const TX=C2.tex&&C2.tex();const COB=TX?TX.cobble:stoneTex98(['#9a8a76','#a4927c','#8e7e6c','#ab9a82','#857664','#b0a088'],'#5a4c3e',8,11),PATH=TX?TX.path:stoneTex98(['#d6c9ad','#cdbf9f','#e0d4b8','#c8b896','#dccfb2'],'#a8977a',8,12),
  PLZ=TX?TX.plaza:stoneTex98(['#e2d8c0','#d8ccb0','#ebe2cc','#cfc2a4'],'#a89878',16,13);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=G[y][x],px=x*T,py=y*T,h=hash(x*2.1,y*1.3);
  if(g==='sea'){const gr=k.createLinearGradient(px,py,px,py+T);gr.addColorStop(0,h>.5?'#2d7fb8':'#2a78b0');gr.addColorStop(1,'#22689c');k.fillStyle=gr;k.fillRect(px,py,T,T);
   k.strokeStyle='rgba(255,255,255,'+(.08+h*.1)+')';k.lineWidth=1.2;k.beginPath();const ox=px+4+h*10,oy=py+8+((h*97)%1)*14;k.moveTo(ox,oy);k.quadraticCurveTo(ox+5,oy-3,ox+10,oy);k.quadraticCurveTo(ox+15,oy+3,ox+20,oy);k.stroke()}
  else if(g==='street'){if(ART558)k.drawImage(C2ART.img.g,px%384,py%384,T,T,px,py,T,T);else k.drawImage(COB,(x%4)*32,(y%4)*32,32,32,px,py,T,T)}
  else if(g==='path')k.drawImage(PATH,(x%4)*32,(y%4)*32,32,32,px,py,T,T);
  else if(g==='plaza')k.drawImage(PLZ,(x%4)*32,(y%4)*32,32,32,px,py,T,T);
  else if(g==='land'||g==='garden'){if(TX)k.drawImage(TX.grass,(x%4)*32,(y%4)*32,32,32,px,py,T,T);else k.drawImage(grassV[gv(x,y)],px,py)}
  else if(g==='bridge'||g==='dock'){const vert=g==='bridge'&&(x>=40&&x<=43);k.fillStyle='#22689c';k.fillRect(px,py,T,T);
   for(let i=0;i<4;i++){k.fillStyle=['#9a6a3a','#8a5c30','#a47444','#93643a'][(i+x+y)%4];if(vert)k.fillRect(px,py+i*8,T,7);else k.fillRect(px+i*8,py,7,T)}
   k.fillStyle='rgba(40,20,8,.35)';for(let i=0;i<4;i++){if(vert)k.fillRect(px,py+i*8+7,T,1);else k.fillRect(px+i*8+7,py,1,T)}}}
 // ขอบทางหินอ่อน (จุดครีมตามขอบถนนใหญ่ แบบรูปตัวอย่าง)
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const g=G[y][x];if(g!=='path'&&g!=='plaza')continue;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=G[y+b][x+a];if(n!=='street'&&n!=='land'&&n!=='garden')continue;
   k.fillStyle='#efe4c4';for(let i=0;i<4;i++){const px=x*T+(a===1?T-4:a===-1?1:4+i*8),py=y*T+(b===1?T-4:b===-1?1:4+i*8);k.beginPath();k.arc(px+1.5,py+1.5,2,0,7);k.fill()}}}
 // ลานกลาง: วงกลมลวดลาย
 k.save();k.translate(41.5*T+16,31.5*T+16);for(const [r,c,w] of [[8*T-6,'rgba(150,120,70,.6)',5],[7*T,'rgba(239,228,196,.9)',3],[5.2*T,'rgba(150,120,70,.5)',3],[3.2*T,'rgba(239,228,196,.9)',3]]){k.strokeStyle=c;k.lineWidth=w;k.beginPath();k.arc(0,0,r,0,7);k.stroke()}
 k.strokeStyle='rgba(150,120,70,.45)';k.lineWidth=2;for(let i=0;i<16;i++){const a=i*Math.PI/8;k.beginPath();k.moveTo(Math.cos(a)*3.2*T,Math.sin(a)*3.2*T);k.lineTo(Math.cos(a)*5.2*T,Math.sin(a)*5.2*T);k.stroke()}k.restore();
 // ฝั่ง
 for(let y=1;y<H;y++)for(let x=0;x<W;x++){const g=G[y][x],up=G[y-1][x];if(g==='sea'&&up!=='sea'&&up!=='bridge'&&up!=='dock'){const px=x*T,py=y*T,gr=k.createLinearGradient(0,py,0,py+14);gr.addColorStop(0,'#8a7a62');gr.addColorStop(1,'#4a3e30');k.fillStyle=gr;k.fillRect(px,py,T,14);
   k.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<4;i++)k.fillRect(px+i*8+hash(x,i)*4,py+2,1,10);k.fillStyle='rgba(255,255,255,.7)';k.fillRect(px,py+14,T,2);k.fillStyle='rgba(255,255,255,.25)';k.fillRect(px,py+17,T,2)}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(G[y][x]!=='sea')continue;const px=x*T,py=y*T,lnd=v=>v&&v!=='sea'&&v!=='bridge'&&v!=='dock',L=x>0&&lnd(G[y][x-1]),Rr=x<W-1&&lnd(G[y][x+1]),U=y<H-1&&lnd(G[y+1][x]);
  k.fillStyle='rgba(255,255,255,.55)';if(L)k.fillRect(px,py,3,T);if(Rr)k.fillRect(px+T-3,py,3,T);if(U)k.fillRect(px,py+T-3,T,3);k.fillStyle='rgba(90,70,50,.6)';if(L)k.fillRect(px,py,2,T);if(Rr)k.fillRect(px+T-2,py,2,T)}
 const rail=(x0,y0,x1,y1)=>{k.strokeStyle='#5a3a1a';k.lineWidth=3;k.beginPath();k.moveTo(x0,y0);k.lineTo(x1,y1);k.stroke();k.fillStyle='#6a4422';const n=Math.max(1,Math.round(Math.hypot(x1-x0,y1-y0)/24));for(let i=0;i<=n;i++){const px=x0+(x1-x0)*i/n,py=y0+(y1-y0)*i/n;k.fillRect(px-3,py-6,6,10)}};
 rail(40*T+2,8*T,40*T+2,11*T);rail(44*T-2,8*T,44*T-2,11*T);rail(40*T+2,53*T,40*T+2,55*T);rail(44*T-2,53*T,44*T-2,55*T);rail(11*T,30*T+3,13*T,30*T+3);rail(11*T,34*T-3,13*T,34*T-3);rail(71*T,30*T+3,73*T,30*T+3);rail(71*T,34*T-3,73*T,34*T-3);
 try{if(C2.groundPost)C2.groundPost(k,G,W,H)}catch(e){console.warn('groundPost',e)}
 // ---------- วัตถุ ----------
 const occ=C2.occ;occ.length=0;C2.doors.length=0;const block=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(m[j])m[j][i]=WL};
 const DQ=[];const sprite=(fn,x0,y0,w,h,base,occl)=>{x0=Math.floor(x0);y0=Math.floor(y0);w=Math.ceil(w);h=Math.ceil(h);const c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');q.translate(-x0,-y0);fn(q);DQ.push({c,x0,y0,base:base||y0+h,i:DQ.length});if(occl)occ.push({cv:c,x0,y0,w,h,base})}; // v4.85: วาดตามลำดับความลึก (ของไม่ไปอยู่บนหลังคา)
 const free=(x,y,w,h)=>{for(let j=y-1;j<y+h;j++)for(let i=x;i<x+w;i++){if(!G[j]||G[j][i]!=='street'||m[j][i]!==FL)return false}for(let i=x;i<x+w;i++){const g=G[y+h]&&G[y+h][i];if(!g||g==='sea'||m[y+h][i]!==FL)return false}return true};
 const ROOFS=[['#c0603a','tile'],['#b0503a','tile'],['#4a5a7a','slate'],['#5a6a8a','slate'],['#3a6a5a','slate'],['#a8452f','tile'],['#7a4a8a','slate']],WALLS=['#ecdfc2','#e8d4b0','#f2e8d4','#e0cfb0','#d8c8a8','#efe0c8'],SHUT=['#3a6a8a','#4a7a3a','#8a3a3a','#6a4a2a','#3a4a7a'];
 const BLDS=[];
 const spec=(x,y,w,h,o)=>{block(x,y,w,h);const b={x,y,w,h,o};BLDS.push(b);return b};
 const drawB=b=>{const X=b.x*T,Y=b.y*T,Wp=b.w*T,Hp=b.h*T,o=b.o;
  {const extra=b.shop?({skill:0,store:1,fashion:2,ware:3}[b.shop.id]):o.style==='tower'&&!o.clock558?5:b.x===3&&b.y===25?4:null;
   const sheet=extra!=null?'extra2':!b.shop&&o.style!=='tower'?'homes2':null,index=extra!=null?extra:Math.abs(b.x*7+b.y*3)%6;
   if(sheet&&DECOR560.ready(sheet)){const r=DECOR560.sheets[sheet].boxes[index],dw=Wp,dh=Math.min(Hp+T*1.5+34,r[3]*dw/r[2]),dx=X+(Wp-dw)/2,dy=Y+Hp-dh;sprite(q=>DECOR560.draw(q,sheet,index,dx,dy,dw,dh),dx,dy,dw,dh,Y+Hp,1);return}}
  {const ak=ART558&&(b.shop?C2ART.SHOP[b.shop.id]:o.clock558?'clock':null);if(ak){const [sx,sy,sw,sh]=C2ART.BOX[ak],dw=Wp+(o.style==='tower'?60:0),dh=sh*dw/sw,dx=X+Wp/2-dw/2,dy=Y+Hp-dh;sprite(q=>q.drawImage(C2ART.img.b,sx,sy,sw,sh,dx,dy,dw,dh),dx,dy,dw,dh,Y+Hp,1);return}}
  if(o.style==='tower')sprite(q=>tower98(q,X,Y,Wp,Hp,o),X-10,Y-T*2.2-30,Wp+24,Hp+T*2.2+40,Y+Hp,1);
  else sprite(q=>house98(q,X,Y,Wp,Hp,o,rng98(b.x*131+b.y*17)),X-12,Y-T*1.5-34,Wp+28,Hp+T*1.5+44,Y+Hp,1)};
 // แถวอาคารต่อถนน (หันหน้าลงใต้)
 const rowsN=[[13,4],[19,3],[24,4]],rowsS=[[35,4],[41,3],[46,4]],cols=[[14,39],[44,69]];
 for(const [ry,rh] of rowsN.concat(rowsS))for(const [c0,c1] of cols){let x=c0;while(x<c1){const w=[4,5,5,6,4,5][Math.floor(R()*6)];if(x+w-1>c1)break;if(free(x,ry,w,rh)){const fl=rh>=4?(R()<.35?3:2):(R()<.5?2:1),rf=ROOFS[Math.floor(R()*ROOFS.length)];
    spec(x,ry,w,rh,{style:'town',floors:fl,roof:rf[0],roofKind:rf[1],wall:WALLS[Math.floor(R()*WALLS.length)],shut:SHUT[Math.floor(R()*SHUT.length)],trim:R()<.5?'#5a3a22':'#4a2e1a',brace:R()<.4,balcony:R()<.4,dormer:R()<.45});x+=w+(R()<.45?1:0)}else x++}}
 // ร้านค้า (ใช้ร้านเดิม) — อาคารใกล้ลานกลางที่สุด
 const SHOPS=[['gear',{style:'shop',awn:'#c0392b',roof:'#a8452f',roofKind:'tile'}],['potion',{style:'shop',awn:'#2f8a5a',roof:'#3a6a5a',roofKind:'slate'}],['skill',{style:'shop',awn:'#6a3aa8',roof:'#5a4a8a',roofKind:'slate'}],
  ['store',{style:'shop',awn:'#e08a1e',roof:'#c0603a',roofKind:'tile'}],['inn',{style:'tavern',roof:'#8a4a2a',roofKind:'tile',wall:'#d8b890',balcony:true}],['guild',{style:'manor',roof:'#4a5a7a',roofKind:'slate',banner:'#6a3aa8',floors:3}],
  ['bank',{style:'bank',roof:'#3a5a6a',roofKind:'slate',wall:'#d8d4c8',banner:'#1a5a8a',chimney:false}],['ware',{style:'stone',roof:'#5a6a8a',roofKind:'slate',wall:'#cfc8b8'}],['fashion',{style:'shop',awn:'#e05a8a',roof:'#b0506a',roofKind:'tile'}]];
 const cand=BLDS.slice().sort((a,b)=>Math.hypot(a.x+a.w/2-41.5,a.y+a.h-31.5)-Math.hypot(b.x+b.w/2-41.5,b.y+b.h-31.5));const used=new Set();
 for(const [id,oo] of SHOPS){const b=cand.find(q=>!used.has(q)&&q.w>=5&&q.h>=3);const S=SHOP_DATA[id];if(!b||!S)continue;used.add(b);
  b.o=Object.assign({},b.o,oo,{floors:oo.floors||Math.max(2,b.o.floors)});b.shop={id,S}}
 // หอคอยโดมแดง/ฟ้า (แลนด์มาร์ก): แทนบ้านที่อยู่มุม
 for(const [tx,ty,col] of [[30,47,'#c03a3a'],[56,13,'#3a6ac0']]){const b=BLDS.filter(q=>!q.shop&&q.h>=4).sort((a,c)=>Math.hypot(a.x-tx,a.y-ty)-Math.hypot(c.x-tx,c.y-ty))[0];if(b){for(let j=b.y;j<b.y+b.h;j++)for(let i=b.x;i<b.x+b.w;i++)m[j][i]=FL;b.o={style:'tower',roof:col,clock558:tx===56};b.x+=Math.floor((b.w-3)/2);b.w=3;block(b.x,b.y,b.w,b.h)}}
 BLDS.sort((a,b)=>(a.y+a.h)-(b.y+b.h));for(const b of BLDS)drawB(b);
 for(const b of BLDS)if(b.shop){const {id,S}=b.shop,nm=(C2.shopNames&&C2.shopNames[id])||S.name;C2.lbl=C2.lbl||[];C2.lbl.push([S,nm,b]);C2.doors.push({id,x:(b.x+b.w/2)*T,y:(b.y+b.h)*T+8,n:nm,e:S.emoji||'🚪'})}
 // น้ำพุ 2 ชั้นกลางลาน
 sprite(q=>fount98(q,41.5*T+16,32*T+8),41.5*T+16-70,32*T+8-110,140,140,32*T+20,1);block(40,30,4,3);
 // แผงตลาดรอบลาน + กระถาง + ม้านั่ง + โคม
 const ring=[];for(let i=0;i<16;i++){const a=i*Math.PI/8+Math.PI/16;ring.push([41.5+Math.cos(a)*5.6,31.5+Math.sin(a)*5.6,i])}
 const AW=['#c0392b','#2f7fb0','#e08a1e','#3f9a4a','#8e44ad','#d35400','#16a085','#c0392b'];
 for(const [fx,fy,i] of ring){const x=Math.floor(fx),y=Math.floor(fy);if(Math.abs(fx-41.5)<2.2||Math.abs(fy-31.5)<2.2)continue;if(m[y][x]!==FL||m[y][x+1]!==FL)continue;
  if(i%2===0){sprite(q=>stall95(q,x*T,y*T,AW[i%AW.length],R),x*T-6,y*T-40,2*T+12,T+44,y*T+T,1);block(x,y,2,1)}else{sprite(q=>planter98(q,x*T+16,y*T+26,true),x*T-12,y*T-44,56,76,y*T+26,1);block(x,y,1,1)}}
 for(const [x,y] of [[36,24],[47,24],[36,39],[47,39],[33,28],[50,28],[33,35],[50,35]])if(m[y]&&m[y][x]===FL){sprite(q=>planter98(q,x*T+16,y*T+26,false),x*T-4,y*T-6,40,40,y*T+26,0);block(x,y,1,1)}
 // โคมตามถนนใหญ่
 C2.lamps=[];const lampAt=(x,y)=>{if(!m[y]||m[y][x]!==FL)return;if(C2.doors.some(d=>Math.abs(d.x/T-x-.5)<1.6&&Math.abs(d.y/T-y)<2))return;sprite(q=>lamp95(q,x*T+16,y*T+28),x*T-6,y*T-50,44,84,y*T+28,1);block(x,y,1,1);C2.lamps.push([x*T+16,y*T-36])};
 for(let x=15;x<=68;x+=5){if(Math.abs(x-41.5)<9)continue;lampAt(x,30);lampAt(x,33)}for(let y=13;y<=50;y+=5){if(Math.abs(y-31.5)<10)continue;lampAt(40,y);lampAt(43,y)}
 // ธงราว (วาดทับตัวละครภายหลัง)
 C2.bunt=[];for(let x=16;x<=66;x+=10){if(Math.abs(x-41.5)<10)continue;C2.bunt.push([x*T+16,30*T-30,x*T+16,34*T-30])}for(let y=15;y<=49;y+=8){if(Math.abs(y-31.5)<10)continue;C2.bunt.push([40*T+8,y*T-20,44*T-8,y*T-20])}
 // เกวียน ลัง กระสอบ ตามถนนรอง
 let nd=0;for(let tries=0;tries<400&&nd<26;tries++){const x=14+Math.floor(R()*55),y=12+Math.floor(R()*40);if(G[y][x]!=='street'||m[y][x]!==FL||m[y][x+1]!==FL)continue;if(G[y-1]&&G[y-1][x]==='street'&&m[y-1][x]===WL&&m[y+1]&&m[y+1][x]===FL){}else continue;
  if(C2.doors.some(d=>Math.abs(d.x/T-x)<2.5&&Math.abs(d.y/T-y)<1.5))continue;let near=false;for(const b of BLDS)if(x>=b.x-1&&x<=b.x+b.w&&y===b.y+b.h&&Math.abs(x-(b.x+b.w/2))<1.5)near=true;if(near)continue;
  if(R()<.35){sprite(q=>cart98(q,x*T,y*T+12,R),x*T-4,y*T-12,80,40,y*T+30,1);block(x,y,2,1)}else if(R()<.6){sprite(q=>crates98(q,x*T+2,y*T+28,R),x*T,y*T,48,32,y*T+28,0);block(x,y,1,1)}else{barrel95(k,x*T+16,y*T+26,false);block(x,y,1,1)}nd++}
 // ท่าเรือตะวันตก: โกดัง + เรือ
 drawB(spec(3,25,6,3,{style:'stone',roof:'#4a5a7a',roofKind:'slate',wall:'#cfc8b8',floors:1,chimney:false}));
 k.fillStyle='#5a3a1a';for(const [x,y] of [[4,44],[6,44],[4,42],[6,42]])k.fillRect(x*T+12,y*T+20,8,16);
 for(const [bx,by,s,sc] of [[1.2,46,1,'#f4efe2'],[8.5,45.5,.85,'#e8d8b8'],[12,48,.7,'#f0e0d0'],[66,57,.8,'#f4efe2'],[20,56,.75,'#e8e0ff'],[60,4,.7,'#f4efe2']])sprite(q=>boat95(q,bx*T,by*T,s,sc),bx*T-70*s,by*T-130*s,150*s,160*s,by*T+20,0);
 for(const [x,y] of [[3,33],[4,34],[8,36],[9,35]])if(m[y][x]===FL){sprite(q=>crates98(q,x*T+2,y*T+28,R),x*T,y*T,48,32,y*T+28,0);block(x,y,1,1)}
 // สวนศาลาตะวันออก
 sprite(q=>gazebo95(q,77*T+16,31*T+40,.9,'#b44a6a'),77*T+16-80,31*T+40-170,160,190,31*T+40,1);block(75,29,5,4);
 for(const [x,y,w,h] of [[75,26,2,2],[79,26,1,2],[75,35,2,2],[79,35,1,2]]){flower95(k,x,y,w,h);block(x,y,w,h)}
 // ต้นไม้: เกาะเล็ก + สวน + ขอบเกาะหลักบางจุด
 const TR=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const g=G[y][x];if(m[y][x]!==FL)continue;if(g==='land'&&R()<.35)TR.push([x,y]);else if(g==='garden'&&R()<.08&&Math.hypot(x-77,y-31)>3.5)TR.push([x,y]);
  else if(g==='street'&&R()<.05){let edge=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(G[y+b][x+a]==='sea')edge=true;if(edge&&!C2.doors.some(d=>Math.abs(d.x/T-x)<2&&Math.abs(d.y/T-y)<2))TR.push([x,y])}}
 for(const [x,y] of TR){if(m[y][x]!==FL)continue;const i=Math.floor(R()*treeSpr.length),s=.85+R()*.35;sprite(q=>q.drawImage(treeSpr[i],x*T+16-36*s,y*T+28-85*s,72*s,90*s),x*T+16-36*s,y*T+28-85*s,72*s,90*s,y*T+28,1);block(x,y,1,1)}
 // ต้นไม้ในกระถางริมถนน (ความเขียวในเมือง)
 let np=0;for(let tries=0;tries<600&&np<34;tries++){const x=14+Math.floor(R()*56),y=12+Math.floor(R()*40);if(G[y][x]!=='street'||m[y][x]!==FL)continue;if(!(m[y-1]&&m[y-1][x]===WL))continue;if(C2.doors.some(d=>Math.abs(d.x/T-x-.5)<2.2&&Math.abs(d.y/T-y)<2))continue;let door=false;for(const b of BLDS)if(y===b.y+b.h&&Math.abs(x+.5-(b.x+b.w/2))<1.6)door=true;if(door)continue;
  sprite(q=>planter98(q,x*T+16,y*T+26,R()<.7),x*T-12,y*T-44,56,76,y*T+26,1);block(x,y,1,1);np++}
 DQ.sort((p,q)=>p.base-q.base||p.i-q.i);for(const d of DQ)k.drawImage(d.c,d.x0,d.y0);
 for(const [S,nm,b] of (C2.lbl||[])){try{shopName(k,Object.assign({},S,{name:nm,b:[b.x,b.y-1,b.w,b.h]}))}catch(e){}}C2.lbl=[];
 // ป้าย
 k.font='bold 14px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.lineWidth=4;k.strokeStyle='rgba(0,0,0,.65)';k.strokeText('🌀 ลานประตูมิติ — ทางลงดันเจี้ยน',41.5*T+16,2*T+4);k.fillStyle='#e8d8ff';k.fillText('🌀 ลานประตูมิติ — ทางลงดันเจี้ยน',41.5*T+16,2*T+4);k.textAlign='left';
 const floor=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(m[y][x]===FL)floor.push([x,y]);C2.houses=BLDS.length;
 const Zd={id:'city2',n:'นครวารีอัสตรา',e:'🏙️',lv:[1,1],dark:0,amb:'',pal:{vd:'#22689c'},mobs:[],boss:null,ores:[],raw:'stone',ing:'ingSt',safe:1};
 return {zi:C2.ZI,name:'city2',Zd,m,ores:[],oreAt:{},floor,ent:{x:41,y:57},arena:{x:41,y:31},seen:new Uint8Array(W*H).fill(1),W,H,cv,art558:ART558}}
C2.alt=build98;
// ธงราวข้ามถนน (ทับตัวละคร)
{const _dt=drawDmgTxt;drawDmgTxt=function(dt){try{if(inC2()&&C2.bunt){const t=performance.now()/1000,CL=['#e74c3c','#f1c40f','#2ecc71','#3498db','#9b59b6','#ffffff'];
   for(const [x0,y0,x1,y1] of C2.bunt){const sag=14;ctx.strokeStyle='rgba(60,40,20,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,(y0+y1)/2+sag,x1,y1);ctx.stroke();
    const n=10;for(let i=1;i<n;i++){const u=i/n,x=(1-u)*(1-u)*x0+2*(1-u)*u*(x0+x1)/2+u*u*x1,y=(1-u)*(1-u)*y0+2*(1-u)*u*((y0+y1)/2+sag)+u*u*y1,sw=Math.sin(t*3+i)*1.5;ctx.fillStyle=CL[i%CL.length];ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.lineTo(x+sw,y+9);ctx.closePath();ctx.fill()}}}}catch(e){}return _dt.apply(this,arguments)};window.drawDmgTxt=drawDmgTxt}
// ชาวเมืองชุดใหม่ (มากขึ้น · ตามผังใหม่)
C2.npcAlt=[
 {name:'กัปตันเมอร์ริน',c:'#2a4a7a',h:'#e8e0d0',x:6,y:32,fixed:1,hat:1,beard:1,c2warp:1,lines:['เรือของข้าพาเจ้ากลับเมืองเอลโดเรียได้ทุกเมื่อ','สินค้าจากนครวารีขายดีทั่วแผ่นดิน']},
 {name:'ผู้เฝ้าประตูมิติเซฟิรา',c:'#5a2a8a',h:'#d8d0ff',x:41.5,y:7,fixed:1,hat:1,lines:['ประตูมิติแต่ละบานพาไปดันเจี้ยนคนละที่ เลเวลต่างกัน','วัตถุดิบหายากในดันเจี้ยน ช่างในเมืองนี้แลกของให้ได้']},
 {name:'ทหารยามคาเอล',c:'#4a3a8a',h:'#c8c8d4',x:39.2,y:10.5,fixed:1,spear:1,lines:['เกาะเหนือคือลานประตูมิติ ข้ามสะพานนี้ไป']},
 {name:'ทหารยามโรวาน',c:'#4a3a8a',h:'#c8c8d4',x:44.8,y:10.5,fixed:1,spear:1,lines:['ผู้กล้าระดับ 150 ขึ้นไปเท่านั้นที่ข้ามไปได้อย่างปลอดภัย']},
 {name:'ทหารยามเบรนท์',c:'#4a3a8a',h:'#c8c8d4',x:13.5,y:29,fixed:1,spear:1,lines:['ท่าเรือตะวันตก เรือสินค้าเข้าออกทั้งวัน']},
 {name:'แม่ค้าผ้าไหมลิลาวดี',c:'#c05a7a',h:'#3a2a1a',g:'f',x:36,y:28,r:1,lines:['ผ้าไหมจากเมืองท่า สวยที่สุดในแผ่นดิน!']},
 {name:'พ่อค้าเครื่องเทศฮาซาน',c:'#a8452f',h:'#6b4a2a',x:47,y:28,r:1,lines:['เครื่องเทศจากเกาะไกล หอมไปสามบ้านแปดบ้าน']},
 {name:'พ่อค้าอัญมณีโอปอล',c:'#2a6a8a',h:'#e8e8e8',beard:1,x:36,y:35.5,r:1,lines:['อัญมณีจากวิหารใต้สมุทร หายากนะท่าน']},
 {name:'แม่ค้าขนมปังเบลล่า',c:'#e08ab0',h:'#5a3a1a',g:'f',apron:1,x:47,y:35.5,r:1,lines:['ขนมอบใหม่ ๆ หอมกรุ่นจ้า']},
 {name:'นักเดินทางเรย์',c:'#3a8a5a',h:'#6b4a2a',x:30,y:31.5,r:6,lines:['เมืองนี้ใหญ่และคึกคักกว่าเอลโดเรียเยอะเลย','ได้ยินว่าดันเจี้ยนดาราร่วงมีของระดับตำนาน']},
 {name:'สาวน้อยมิเรีย',c:'#e08ab0',h:'#f0d080',g:'f',age:'child',x:44,y:36,r:3,lines:['น้ำพุสองชั้นกลางลานสวยใช่ไหมล่ะ!']},
 {name:'ปราชญ์ชราเอลดริน',c:'#6a6a8a',h:'#e8e8e8',age:'elder',cane:1,beard:1,x:39,y:27,r:2,lines:['ครั้งหนึ่งนครวารีเคยจมอยู่ใต้ทะเล','วิหารใต้สมุทรยังมีสมบัติของเมืองเก่าอยู่']},
 {name:'โรซาลีริมน้ำ',c:'#8a4a6a',h:'#4a2a1a',g:'f',x:77,y:35,r:2,lines:['สวนศาลาฝั่งตะวันออกเหมาะกับการพักผ่อนที่สุด']},
 {name:'ชาวประมงทอมัส',c:'#4a6a8a',h:'#3a2a1a',hat:1,x:5,y:37,r:2,lines:['ปลาทูน่าวันนี้ตัวใหญ่มาก!']},
 {name:'เด็กชายโท',c:'#d0a040',h:'#3a2a1a',age:'child',x:41.5,y:44,r:5,lines:['โตขึ้นข้าจะลงดันเจี้ยนให้หมดทุกที่!']},
 {name:'นักดนตรีเร่ฟินน์',c:'#7a3a9a',h:'#2a1a0a',x:45,y:27,r:1,lines:['♪ ลา ลา ลา ♪ ฟังเพลงแห่งนครวารีไหมท่าน']},
 {name:'คนส่งของพิพ',c:'#8a6a4a',h:'#4a2a1a',apron:1,x:25,y:18,r:8,lines:['ส่งของไม่ทันแล้ว! ร้านแถวนี้สั่งของเยอะมาก']},
 {name:'คุณป้าเกรตา',c:'#5a7a3a',h:'#6b4a2a',g:'f',x:58,y:23,r:7,lines:['ยินดีต้อนรับสู่นครวารีอัสตรา!']},
 {name:'พ่อค้าผ้าแพรอีวาน',c:'#8a3a3a',h:'#3a2a1a',x:60,y:40,r:7,lines:['ผ้าแพรเนื้อดีจากตะวันออก ราคาพิเศษ!']},
 {name:'คุณนายวิกตอเรีย',c:'#c09a3a',h:'#5a3a1a',g:'f',x:26,y:45,r:6,lines:['คฤหาสน์ของข้าใหญ่ที่สุดในย่านนี้']},
 {name:'คนงานท่าเรือบรุก',c:'#6a5a4a',h:'#2a1a0a',x:7,y:29,r:3,lines:['ยกลังทั้งวัน หลังจะหักแล้ว']},
 {name:'นักผจญภัยไอริส',c:'#3a5aa8',h:'#e0b060',g:'f',x:41.5,y:20,r:4,lines:['เพิ่งกลับจากป้อมเพลิงอสูร ร้อนแทบตาย!']},
 {name:'ลุงฮอลลิส',c:'#4a6a9a',h:'#6b4a2a',x:20,y:39,r:7,lines:['ตลาดเช้าที่ลานกลางของดีราคาถูก']},
 {name:'น้าเมย์',c:'#9a5a3a',h:'#3a2a1a',g:'f',x:63,y:46,r:6,lines:['หอนาฬิกาตีบอกเวลาทุกชั่วโมงเลยนะ']}];
}catch(e){console.warn('fix98',e)}
