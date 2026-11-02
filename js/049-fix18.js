// fix18.js (v4.26) — ข้อ 44: ชุดแฟชั่นไทยโบราณ 9 ชุด (สไบ · ผ้าซิ่น · โจงกระเบน · ชฎา · มงกุฎโขน · ลอมพอก · งอบ ฯลฯ)
// =====================================================================
const SK18='#f1d2b0';
const THAI18={
 chakkri:{n:'ชุดไทยจักรี',p:12000,TOP:SK18,COLLAR:SK18,BLK:'#7a1a2a',LEG2:'#6a1424',hat:'krabangpin',fx:'star',
  th:{up:'sabai',s1:'#e8d08a',s2:'#c8a040',low:'sin',lc:'#7a1a2a',lb:'#e8c14a',belt:1,gold:1},d:'สไบไหมทองพาดบ่า ผ้าซิ่นแดงเชิงทอง กระบังหน้าและปิ่นปักผม'},
 boromphiman:{n:'ชุดไทยบรมพิมาน',p:10000,TOP:'#d8b060',COLLAR:'#e8c14a',BLK:'#4a1a5a',LEG2:'#3e1450',hat:'pin',
  th:{up:'top',btn:'#fff2b0',low:'sin',lc:'#4a1a5a',lb:'#e8c14a',belt:1,collar:1,gold:1},d:'เสื้อไหมทองแขนยาว ผ้าซิ่นม่วงเชิงทอง คาดเข็มขัดทอง'},
 chitlada:{n:'ชุดไทยจิตรลดา',p:6000,TOP:'#f0e6d0',COLLAR:'#e2d4b4',BLK:'#2a6a4a',LEG2:'#22583e',hat:'pin',
  th:{up:'top',btn:'#c8a040',low:'sin',lc:'#2a6a4a',lb:'#d8b860'},d:'เสื้อแขนยาวสีงาช้าง ผ้าซิ่นเขียวไหมไทย เรียบง่ายสง่างาม'},
 nangram:{n:'ชุดนางรำ',p:16000,TOP:SK18,COLLAR:SK18,BLK:'#1a6a3a',LEG2:'#155a30',hat:'chada',fx:'star',
  th:{up:'sabai',s1:'#c8283a',s2:'#e8c14a',low:'sin',lc:'#1a6a3a',lb:'#e8c14a',belt:1,gold:1,collar:1},d:'ชฎาทองยอดแหลม สไบแดงปักทอง กรองศอทอง ผ้าซิ่นเขียว'},
 khon:{n:'ชุดโขนพระราม',p:22000,TOP:'#2a8a5a',COLLAR:'#e8c14a',BLK:'#b8862a',LEG2:'#a07422',hat:'mongkut',fx:'star',
  th:{up:'khon',base:'#2a8a5a',low:'jong',lc:'#c83a2a',belt:1,gold:1,collar:1,sangwan:1},d:'มงกุฎยอดชัยสีทอง เสื้อปักลายเขียวทอง ตาบทิศสังวาล โจงกระเบนแดง'},
 nakrop:{n:'ชุดนักรบอโยธยา',p:9000,TOP:'#a82a1a',COLLAR:'#7a1a10',BLK:'#1a1a22',LEG2:'#14141a',hat:'pakama',
  th:{up:'warrior',low:'jong',lc:'#1a1a22',belt:1,sash:'#f4f0e8'},d:'เสื้อแดงนักรบ ผ้าประเจียดคาดอก โจงกระเบนดำ ผ้าโพกหัวแดง'},
 khunnang:{n:'ชุดขุนนางสยาม',p:12000,TOP:'#f4f0e8',COLLAR:'#ffffff',BLK:'#1a2a5a',LEG2:'#14224a',hat:'lompok',
  th:{up:'raj',btn:'#e8c14a',low:'jong',lc:'#1a2a5a',belt:1},d:'เสื้อราชปะแตนขาวกระดุมทอง โจงกระเบนสีกรมท่า หมวกลอมพอก'},
 chaona:{n:'ชุดม่อฮ่อมชาวนา',p:3500,TOP:'#2a3a6a',COLLAR:'#22305a',BLK:'#2a3a6a',LEG2:'#24325c',hat:'ngop',
  th:{up:'farmer',low:'none'},d:'เสื้อม่อฮ่อมคราม ผ้าขาวม้าคาดเอว งอบสานใบลาน'},
 thep:{n:'ชุดเทพเทวดา',p:30000,TOP:'#f4ead0',COLLAR:'#ffd23a',BLK:'#e8d8a8',LEG2:'#dccc98',hat:'chadaglow',fx:'star',cape:['#fff6d8','#e8c88a','#ffd23a'],
  th:{up:'khon',base:'#f4ead0',low:'jong',lc:'#e8d8a8',belt:1,gold:1,collar:1,sangwan:1,halo:1},d:'ชฎาเรืองแสง ทับทรวงทอง สังวาลไขว้ ผ้าทิพย์ปลิวไสว'}};
for(const k in THAI18){const o=THAI18[k];o.n='🇹🇭 '+o.n;OUTFIT['th_'+k]=o}
const thF18=()=>{if(!window._fashOn)return null;const F=FASH.body&&OUTFIT[FASH.body];return F&&F.th?F:null};
const G18='#e8c14a',GD18='#9a7020';
// ---------- ลำตัว / ผ้านุ่ง ----------
function thBody18(F,x,by,side,f,d){const S=F.th,t=performance.now()/1000,R=(c,a,b,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),w,h)};
 const L=side?x-4.5:x-8,W=side?9:16;ctx.save();
 // ผ้านุ่ง
 if(S.low==='sin'){const sw=side?11:18,sx=x-sw/2,hm=P.mv?Math.sin(P.t*2)*1:0;ctx.fillStyle=S.lc;ctx.beginPath();ctx.moveTo(sx+1,by-14);ctx.lineTo(sx+sw-1,by-14);ctx.lineTo(sx+sw+hm,by-1);ctx.lineTo(sx-hm,by-1);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;ctx.beginPath();for(const o of side?[.4]:[.3,.65]){ctx.moveTo(sx+sw*o,by-13);ctx.lineTo(sx+sw*o+(o-.5)*3,by-2)}ctx.stroke();
  R(S.lb,sx-hm,by-4,sw+hm*2,3);R('rgba(0,0,0,.25)',sx-hm,by-2,sw+hm*2,1);if(!side){R(S.lb,sx+2,by-10,sw-4,1);ctx.fillStyle=S.lb;for(let i=0;i<4;i++)ctx.fillRect(sx+3+i*4,by-8,1.5,1.5)}}
 else if(S.low==='jong'){const sw=side?12:19,sx=x-sw/2;ctx.fillStyle=S.lc;ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+1,by-14);ctx.lineTo(sx+sw-1,by-14);ctx.quadraticCurveTo(sx+sw+2,by-9,sx+sw-1,by-5);ctx.lineTo(sx+1,by-5);ctx.quadraticCurveTo(sx-2,by-9,sx+1,by-14);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.beginPath();if(!side){ctx.moveTo(x,by-13);ctx.lineTo(x,by-5)}ctx.moveTo(sx+3,by-11);ctx.quadraticCurveTo(x,by-8,sx+sw-3,by-11);ctx.stroke();
  if(S.gold){R(G18,sx+1,by-6,sw-2,1.5)}}
 // ส่วนบน
 if(S.up==='sabai'){R(S.s1,L,by-24,W,9);R(G18,L,by-24,W,1);R(G18,L,by-16,W,1);
  ctx.fillStyle=S.s2;ctx.strokeStyle=GD18;ctx.lineWidth=.8;ctx.beginPath();if(side){ctx.moveTo(x-4.5,by-28);ctx.lineTo(x+1,by-28);ctx.lineTo(x+4.5,by-15);ctx.lineTo(x-1,by-15)}else{ctx.moveTo(x-8,by-29);ctx.lineTo(x-3,by-29);ctx.lineTo(x+8,by-17);ctx.lineTo(x+8,by-13);ctx.lineTo(x+4,by-13)}ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff6c0';for(let i=0;i<4;i++){const u=i/3;ctx.fillRect(side?x-3+u*6:x-6+u*12,side?by-26+u*9:by-27+u*11,1.2,1.2)}
  if(!side&&d!=='u'){ctx.fillStyle=S.s2;ctx.beginPath();ctx.moveTo(x-8,by-29);ctx.quadraticCurveTo(x-13,by-22,x-11,by-12);ctx.lineTo(x-8,by-13);ctx.closePath();ctx.fill()}}
 else if(S.up==='top'){if(!side&&d!=='u'){R('rgba(0,0,0,.12)',x-.5,by-27,1,14);ctx.fillStyle=S.btn;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x+2,by-24+i*4,1,0,7);ctx.fill()}}R('rgba(255,255,255,.18)',L+1,by-27,2,12)}
 else if(S.up==='raj'){R('#ffffff',L,by-29,W,3);R('rgba(0,0,0,.12)',L,by-26,W,1);if(!side&&d!=='u'){R('rgba(0,0,0,.15)',x-.5,by-26,1,13);ctx.fillStyle=S.btn;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(x+1.5,by-25+i*3.3,1,0,7);ctx.fill()}}}
 else if(S.up==='khon'){ctx.fillStyle=S.base;ctx.fillRect(L,by-28,W,15);ctx.fillStyle=G18;for(let yy=0;yy<4;yy++)for(let xx=0;xx<(side?2:4);xx++){const px=L+2+xx*4+(yy%2)*2,py=by-26+yy*3.5;ctx.beginPath();ctx.moveTo(px,py-1.4);ctx.lineTo(px+1.4,py);ctx.lineTo(px,py+1.4);ctx.lineTo(px-1.4,py);ctx.closePath();ctx.fill()}
  R(G18,L,by-17,W,2)}
 else if(S.up==='warrior'){ctx.fillStyle=S.sash;ctx.beginPath();if(side){ctx.rect(x-4.5,by-22,9,3)}else{ctx.moveTo(x-8,by-27);ctx.lineTo(x-5,by-27);ctx.lineTo(x+8,by-16);ctx.lineTo(x+8,by-13)}ctx.closePath();ctx.fill();ctx.fillStyle='#c8283a';ctx.fillRect(side?x-1:x-1,by-21,3,3)}
 else if(S.up==='farmer'){const cols=['#c8283a','#f4f0e8','#2a8a4a'];for(let i=0;i<(side?3:5);i++){R(cols[i%3],L+i*(side?3:3.2),by-16,side?3:3.2,4)}R('rgba(0,0,0,.25)',L,by-12,W,1);if(!side&&d!=='u'){ctx.fillStyle=cols[0];ctx.beginPath();ctx.moveTo(x+5,by-13);ctx.lineTo(x+8,by-6);ctx.lineTo(x+4,by-7);ctx.closePath();ctx.fill()}
  if(!side&&d!=='u'){R('rgba(0,0,0,.2)',x-.5,by-27,1,10);ctx.fillStyle='#14141a';for(let i=0;i<2;i++){ctx.beginPath();ctx.arc(x+1.5,by-25+i*4,.9,0,7);ctx.fill()}}}
 // เข็มขัดทอง + ปั้นเหน่ง
 if(S.belt){R(S.up==='warrior'?'#3a2a1a':G18,L,by-15,W,2);if(!side&&d!=='u'){ctx.fillStyle=S.up==='warrior'?'#8a6a3a':'#ffe48a';ctx.strokeStyle=GD18;ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,by-14,3,2,0,0,7);ctx.fill();ctx.stroke();if(S.gold){ctx.fillStyle='#c8283a';ctx.fillRect(x-.6,by-14.6,1.2,1.2)}}}
 // สังวาลไขว้
 if(S.sangwan&&!side){ctx.strokeStyle=G18;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-8,by-27);ctx.lineTo(x+7,by-15);ctx.moveTo(x+8,by-27);ctx.lineTo(x-7,by-15);ctx.stroke();ctx.fillStyle='#ffe48a';ctx.strokeStyle=GD18;ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,by-21,2.4,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#c8283a';ctx.beginPath();ctx.arc(x,by-21,1,0,7);ctx.fill()}
 // กรองศอ
 if(S.collar&&d!=='u'){ctx.fillStyle=G18;ctx.strokeStyle=GD18;ctx.lineWidth=.8;ctx.beginPath();if(side){ctx.ellipse(x+f*1,by-28,5,2.6,0,0,Math.PI)}else{ctx.ellipse(x,by-28.5,8.5,4,0,0,Math.PI)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c8283a';if(!side)for(const o of [-5,0,5]){ctx.beginPath();ctx.arc(x+o,by-27+(o?0:1),.9,0,7);ctx.fill()}}
 // วงแสงเทวดา
 if(S.halo){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,by-22,0,x,by-22,30);g.addColorStop(0,'rgba(255,230,150,'+(.18+.06*Math.sin(t*2))+')');g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.fillRect(x-30,by-52,60,60)}
 ctx.restore()}
{const _dc=drawChest;drawChest=function(R,x,by,side,f,d){_dc(R,x,by,side,f,d);try{const F=thF18();if(F)thBody18(F,x,by,side,f,d)}catch(_){}}}
// กำไลต้นแขน + กำไลข้อมือ
{const _da=drawArm;drawArm=function(px,py){_da(px,py);try{const F=thF18();if(F&&F.th.gold){ctx.fillStyle=G18;ctx.fillRect(Math.round(px),Math.round(py-2),6,1.6);ctx.fillRect(Math.round(px),Math.round(py+4.5),6,1.4);ctx.fillStyle='#c8283a';ctx.fillRect(Math.round(px+2.4),Math.round(py-2),1.2,1.4)}}catch(_){}}}
// ---------- เครื่องประดับศีรษะ ----------
function thSpire18(x,by,h,c1,c2,gem){let w=16,y=by-46;const n=Math.round(h/4);for(let i=0;i<n;i++){const w2=Math.max(2,w-16/(n+1));ctx.fillStyle=i%2?c2:c1;ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w2/2,y-4);ctx.lineTo(x-w2/2,y-4);ctx.closePath();ctx.fill();
  if(i%2===0&&w>5){ctx.fillStyle=gem;ctx.fillRect(x-.7,y-3,1.4,1.6)}y-=4;w=w2}
 ctx.strokeStyle=c1;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-7);ctx.stroke();return y}
{const _dh=drawHat11;drawHat11=function(F,x,by,side,f,d){const H=F.hat;if(!['krabangpin','pin','chada','chadaglow','mongkut','pakama','lompok','ngop'].includes(H))return _dh(F,x,by,side,f,d);
 const t=performance.now()/1000,R=(c,a,b,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),w,h)};ctx.save();ctx.lineJoin='round';
 if(H==='krabangpin'||H==='pin'){const bx=x+(side?-f*3:0),bun=side||d==='u'?1:.8;ctx.fillStyle='#14141a';ctx.beginPath();ctx.arc(bx,by-50,4.2*bun,0,7);ctx.fill();
  ctx.strokeStyle=G18;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(bx-6,by-52);ctx.lineTo(bx+6,by-48);ctx.stroke();ctx.fillStyle='#ffe48a';ctx.beginPath();ctx.arc(bx+6,by-48,1.4,0,7);ctx.fill();
  ctx.fillStyle='#ffffff';for(let i=0;i<4;i++){const a=i/4*6.28+t*.2;ctx.beginPath();ctx.arc(bx+Math.cos(a)*4.6,by-50+Math.sin(a)*3,1.1,0,7);ctx.fill()}
  if(H==='krabangpin'&&d!=='u'){R(G18,x-7,by-46,14,2);ctx.fillStyle=G18;ctx.strokeStyle=GD18;ctx.lineWidth=.7;if(!side){ctx.beginPath();ctx.moveTo(x-3,by-46);ctx.lineTo(x,by-51);ctx.lineTo(x+3,by-46);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c8283a';ctx.fillRect(x-.7,by-48.5,1.4,1.4)}}}
 else if(H==='chada'||H==='chadaglow'||H==='mongkut'){const mk=H==='mongkut';hatCap11(x,by,G18,GD18);R(GD18,x-8,by-46,16,1);
  if(d!=='u'){ctx.fillStyle='#c8283a';for(const o of side?[0]:[-5,0,5]){ctx.beginPath();ctx.arc(x+o,by-43,1,0,7);ctx.fill()}}
  // กรรเจียกจร (ใบหูทอง)
  for(const s of side?[-f]:[-1,1]){ctx.fillStyle=G18;ctx.strokeStyle=GD18;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x+s*7,by-44);ctx.quadraticCurveTo(x+s*13,by-42,x+s*11,by-33);ctx.quadraticCurveTo(x+s*9,by-37,x+s*7,by-37);ctx.closePath();ctx.fill();ctx.stroke()}
  const top=thSpire18(x,by,mk?30:24,G18,mk?'#2a8a5a':'#c89a30',mk?'#3affb0':'#c8283a');
  if(H==='chadaglow'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,top+4,0,x,top+4,18);g.addColorStop(0,'rgba(255,240,170,'+(.55+.2*Math.sin(t*3))+')');g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.fillRect(x-18,top-14,36,36);
   ctx.strokeStyle='rgba(255,230,140,'+(.35+.15*Math.sin(t*2))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,by-44,15,4,0,0,7);ctx.stroke()}}
 else if(H==='pakama'){R('#b8281a',x-8,by-47,16,5);R('rgba(0,0,0,.25)',x-8,by-43,16,1);ctx.fillStyle='#d8382a';ctx.beginPath();ctx.ellipse(x,by-47,8,3,0,Math.PI,0);ctx.fill();
  const bk=side?-f:1;if(side||d==='u'){ctx.fillStyle='#b8281a';ctx.beginPath();ctx.moveTo(x+bk*7,by-46);ctx.quadraticCurveTo(x+bk*13+Math.sin(t*4)*1.5,by-42,x+bk*12+Math.sin(t*4)*2,by-36);ctx.lineTo(x+bk*9,by-40);ctx.closePath();ctx.fill()}}
 else if(H==='lompok'){hatCap11(x,by,'#f4f0e8','#a8a08a');ctx.fillStyle='#f4f0e8';ctx.strokeStyle='#a8a08a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-8,by-46);ctx.lineTo(x+8,by-46);ctx.lineTo(x+2.5,by-72);ctx.quadraticCurveTo(x,by-75,x-2.5,by-72);ctx.closePath();ctx.fill();ctx.stroke();
  R(G18,x-8,by-48,16,2.5);R(G18,x-5,by-60,10,1.5);ctx.strokeStyle='rgba(0,0,0,.12)';ctx.beginPath();ctx.moveTo(x-3,by-48);ctx.lineTo(x-1,by-70);ctx.stroke()}
 else if(H==='ngop'){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x-7,by-37,14,3);ctx.fillStyle='#c8a868';ctx.strokeStyle='#6a5028';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-18,by-39);ctx.lineTo(x-6,by-50);ctx.quadraticCurveTo(x,by-60,x+6,by-50);ctx.lineTo(x+18,by-39);ctx.quadraticCurveTo(x,by-35,x-18,by-39);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.save();ctx.clip();ctx.strokeStyle='rgba(106,80,40,.45)';ctx.lineWidth=.8;for(let i=-24;i<24;i+=4){ctx.beginPath();ctx.moveTo(x+i,by-62);ctx.lineTo(x+i+14,by-34);ctx.moveTo(x+i+14,by-62);ctx.lineTo(x+i,by-34);ctx.stroke()}ctx.restore();
  ctx.fillStyle='#8a6a3a';ctx.beginPath();ctx.ellipse(x,by-50,6,2,0,0,7);ctx.fill()}
 ctx.restore()}}
// ชุดที่มีมงกุฎ/งอบ ซ่อนผมด้านบน (ใช้กลไกเดิมของ fix11 ที่เช็ค F.hat) · ชุดผมมวยให้เห็นผม
// สีชุดแฟชั่นต้องชนะสีเสื้อผ้าเริ่มต้น (look8) — เดิมชุดแฟชั่นทุกชุดโดนทับสี
{const _e=EQCOL;EQCOL=function(){const c=_e();try{const F=window._fashOn&&FASH.body&&OUTFIT[FASH.body];if(F)return Object.assign({},c,{TOP:F.TOP,COLLAR:F.COLLAR,BLK:F.BLK,LEG2:F.LEG2})}catch(_){}return c}}
// รูปตัวอย่างในร้านแฟชั่น: เดิมวาดที่พิกัด (0,0) ซึ่งเป็นน้ำ → ตัวละครจมน้ำครึ่งตัว
{const _s=window.swim10;window.swim10=function(){if(window.__PREV18)return false;return _s()}}
{const _fp=fashPreview;fashPreview=function(k,id){window.__PREV18=1;try{return _fp(k,id)}finally{window.__PREV18=0}}}

// =====================================================================
