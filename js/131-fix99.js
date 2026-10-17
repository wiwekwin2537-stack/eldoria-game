// fix99 (v4.84) — นครวารี: ชื่อร้าน/เจ้าของร้านใหม่ทั้งหมด + ชุดพื้นผิวแบบวาดมือ (tileset) + แสงตะเกียงอบอุ่น
//  เจ้าของสั่ง 2026-10-14 15:09: "เมืองใหม่ ชื่อต้องเปลี่ยน (npc/ร้าน)" + โจทย์ tileset: ถนนหินเก่า หญ้ามีพื้นผิว ขอบทางเนียน เงาสัมผัสพื้น แสงตะเกียงอุ่น มุมมองบนลงล่างเท่ากันทุกชิ้น
//  - ร้านในนครวารีมีชื่อ/เจ้าของ/คำพูดของตัวเอง (สลับข้อมูลตอนเดินเข้าร้านจากนครวารี แล้วคืนค่าเดิมตอนออก — ร้านในเมือง 1 ไม่เปลี่ยน)
//  - TEX99: พื้นผิว 128×128 ต่อกันไร้รอยต่อ (หญ้า/หินกรวด/หินปูลาน/ทางหินอ่อน) สร้างด้วยโค้ด · ขอบถนน-หญ้ามีขอบหินและกอหญ้ายื่น
//  - กลางคืนในนครวารีมืดลงตามเวลาในเกม + ตะเกียง/หน้าต่างเรืองแสงส้ม
//  - export99(): วาดแผ่นรวม tileset + props พื้นหลังโปร่งใส (ใช้ใน tools/export-tileset99.js → assets/city2/)
try{
// ---------- ชื่อร้านในนครวารี ----------
const N99={
 gear:{n:'โรงตีเหล็กทะเลคราม',o:'ช่างตีเหล็กบรูโน่',g:['ดาบดีต้องตีด้วยไฟทะเลคราม!','ของจากดันเจี้ยน เอามาให้ข้าดูสิ'],l:['เหล็กในนครวารีผสมเกลือทะเล แกร่งกว่าที่ไหน','โต๊ะคราฟข้างหลังใช้ได้ตามสบาย']},
 potion:{n:'ร้านยาวารีสมุนไพร',o:'หมอยาเซลีน',g:['สมุนไพรทะเลสด ๆ เพิ่งเก็บเช้านี้','บาดเจ็บมาจากดันเจี้ยนหรือ?'],l:['ยาเลือดของข้าผสมสาหร่ายแดง ฟื้นไวมาก']},
 skill:{n:'หอตำราเวทอัสตรา',o:'ปราชญ์ออร์เวน',g:['ตำราทุกเล่มที่นี่มาจากเมืองเก่าใต้ทะเล','ผู้กล้า อยากเรียนท่าใหม่หรือ?'],l:['ความรู้คือดาบที่คมที่สุด']},
 store:{n:'ร้านค้าท่าเรือมั่งมี',o:'เถ้าแก่ทองคำ',g:['ของครบ ราคาเป็นมิตร มาเลย ๆ!','เรือสินค้าเพิ่งเข้าท่า ของใหม่เพียบ'],l:['ค้าขายดีทุกวัน เพราะผู้กล้าแวะมาไม่ขาด']},
 inn:{n:'โรงเตี๊ยมสมอทองคำ',o:'นายหญิงมาริน่า',g:['ยินดีต้อนรับสู่สมอทองคำ!','เหนื่อยจากดันเจี้ยนมาพักก่อนสิ'],l:['ห้องชั้นบนมองเห็นทะเลทั้งอ่าว']},
 guild:{n:'สมาคมนักผจญภัยนครวารี',o:'หัวหน้าสมาคมกาเลน',g:['สมาคมยินดีต้อนรับผู้กล้าระดับสูง','ดันเจี้ยนทางเหนือรอเจ้าอยู่'],l:['ล้มบอสดันเจี้ยนได้ แจ้งข้าด้วย']},
 bank:{n:'ธนาคารพาณิชย์วารี',o:'นายธนาคารเพอร์ซิวาล',g:['ทองของท่านปลอดภัยที่สุดที่นี่','ฝากถอนรวดเร็วทันใจ'],l:['พ่อค้าทั้งอ่าวไว้ใจธนาคารเรา']},
 ware:{n:'คลังสินค้าท่าเรืออัสตรา',o:'ผู้ดูแลคลังดอร์แกน',g:['ของเยอะแค่ไหน คลังเราก็รับไหว','ฝากของไว้ได้เลย ล็อกแน่นหนา'],l:['คลังนี้เก็บสินค้ามาร้อยปีแล้ว']},
 fashion:{n:'ห้องเสื้อมาดามเซเรน่า',o:'มาดามเซเรน่า',g:['แฟชั่นล่าสุดจากเมืองท่า!','ผู้กล้าต้องดูดีด้วยนะ'],l:['ชุดของข้าใส่ลงดันเจี้ยนก็ยังสวย']}};
C2.shopNames={};for(const k in N99)C2.shopNames[k]=N99[k].n;window.N99=N99;
let SW99=null;
{const _es=enterShop;enterShop=function(id){try{if(inC2()&&N99[id]&&SHOP_DATA[id]&&!SW99){const S=SHOP_DATA[id],N=N99[id];SW99={id,name:S.name,owner:S.owner};S.name=N.n;S.owner=Object.assign({},S.owner,{name:N.o,greet:N.g,lines:N.l})}}catch(e){}return _es.apply(this,arguments)};window.enterShop=enterShop}
{const _ls=leaveShop;leaveShop=function(){const r=_ls.apply(this,arguments);try{if(SW99&&!(D&&D.shop)){const S=SHOP_DATA[SW99.id];S.name=SW99.name;S.owner=SW99.owner;SW99=null}}catch(e){}return r};window.leaveShop=leaveShop}
setInterval(()=>{try{if(SW99&&!(D&&D.shop)){const S=SHOP_DATA[SW99.id];S.name=SW99.name;S.owner=SW99.owner;SW99=null}}catch(e){}},1000);
// ---------- พื้นผิววาดมือ ----------
function rng99(s){let a=s>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function pn99(seed,P,terms){const R=rng99(seed),L=[];for(let i=0;i<terms;i++){const f1=1+Math.floor(R()*6),f2=Math.floor(R()*7)-3,a=1/(f1+Math.abs(f2)),ph=R()*6.283;L.push([f1,f2,a,ph]);L.push([f2,f1,a*.8,ph+1])}
 let tot=0;for(const q of L)tot+=q[2];return (x,y)=>{let v=0;for(const [f1,f2,a,ph] of L)v+=a*Math.sin(6.283*(f1*x+f2*y)/P+ph);return .5+.5*v/tot}}
const hx99=h=>{const n=parseInt(h.slice(1),16);return [n>>16,n>>8&255,n&255]};
function grass99(seed){const S=128,c=document.createElement('canvas');c.width=c.height=S;const k=c.getContext('2d'),R=rng99(seed),n1=pn99(seed,S,8),n2=pn99(seed+7,S,10);
 const im=k.createImageData(S,S),d=im.data,A=hx99('#3c6a28'),B=hx99('#79a444'),Cc=hx99('#8a9a3a');
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){const t=n1(x,y),u=n2(x,y),g=(R()-.5)*.08,i=(y*S+x)*4;for(let j=0;j<3;j++){let v=A[j]+(B[j]-A[j])*Math.min(1,Math.max(0,t*1.15-.05+g));v=v+(Cc[j]-v)*Math.max(0,u-.72)*1.4;d[i+j]=v}d[i+3]=255}
 k.putImageData(im,0,0);
 const blade=(x,y,l,a,col)=>{for(const ox of [0,-S,S])for(const oy of [0,-S,S]){k.strokeStyle=col;k.lineWidth=1;k.beginPath();k.moveTo(x+ox,y+oy);k.lineTo(x+ox+Math.cos(a)*l,y+oy+Math.sin(a)*l);k.stroke()}};
 const CL=['rgba(40,80,25,.55)','rgba(120,170,70,.5)','rgba(160,190,90,.45)','rgba(30,60,20,.5)','rgba(100,150,55,.55)'];for(let i=0;i<1300;i++)blade(R()*S,R()*S,2+R()*4,-Math.PI/2+(R()-.5)*.9,CL[Math.floor(R()*CL.length)]);
 const FL=['#fff6c8','#ffd84a','#ff9ab0','#c8b0ff'];for(let i=0;i<10;i++){const x=R()*S,y=R()*S;k.fillStyle=FL[Math.floor(R()*FL.length)];for(const [a,b] of [[0,-1.4],[1.4,0],[0,1.4],[-1.4,0]]){k.beginPath();k.arc(x+a,y+b,1,0,7);k.fill()}k.fillStyle='#e8a02a';k.beginPath();k.arc(x,y,.8,0,7);k.fill()}
 return c}
function stones99(seed,cell,pal,mort,opt){opt=opt||{};const S=128,c=document.createElement('canvas');c.width=c.height=S;const N=Math.max(2,Math.round(S/cell));cell=S/N;const k=c.getContext('2d'),R=rng99(seed),n1=pn99(seed+3,S,8),moss=pn99(seed+11,S,6);
 const pts=[],cols=[];for(let j=0;j<N;j++)for(let i=0;i<N;i++){const ox=(opt.brick?((j%2)*.5):0);pts.push([(i+ox+.5+(R()-.5)*(opt.jit||.55))*cell,(j+.5+(R()-.5)*(opt.jit||.55))*cell]);const pc=hx99(pal[Math.floor(R()*pal.length)]),sh=(R()-.5)*.14;cols.push(pc.map(v=>v*(1+sh)))}
 const im=k.createImageData(S,S),d=im.data,M=hx99(mort),MO=hx99('#5a6a32');
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){const gx=Math.floor(x/cell),gy=Math.floor(y/cell);let d1=1e9,d2=1e9,bi=0,bx=0,by=0;
  for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){let ii=gx+di,jj=gy+dj,wx=0,wy=0;if(ii<0){ii+=N;wx=-S}if(ii>=N){ii-=N;wx=S}if(jj<0){jj+=N;wy=-S}if(jj>=N){jj-=N;wy=S}const p=pts[jj*N+ii],px=p[0]+wx,py=p[1]+wy;
   const dd=opt.square?Math.max(Math.abs(x-px),Math.abs(y-py)*1.1):Math.hypot(x-px,(y-py)*1.12);if(dd<d1){d2=d1;d1=dd;bi=jj*N+ii;bx=px;by=py}else if(dd<d2)d2=dd}
  const e=(d2-d1)/cell,i=(y*S+x)*4,gr=(R()-.5)*.07,nn=n1(x,y);
  if(e<(opt.mw||.07)){const mo=moss(x,y)>.68?.55:0;for(let j=0;j<3;j++)d[i+j]=(M[j]*(1-mo)+MO[j]*mo)*(.85+nn*.3)}
  else{const bul=Math.min(1,e*4),lx=(x-bx)/cell,ly=(y-by)/cell,lt=.78+.22*bul-(lx+ly)*.22*bul+gr+(nn-.5)*.12;const C=cols[bi];for(let j=0;j<3;j++)d[i+j]=Math.max(0,Math.min(255,C[j]*lt))}
  d[i+3]=255}
 k.putImageData(im,0,0);
 // รอยร้าว/สึก
 k.strokeStyle='rgba(30,20,12,.35)';k.lineWidth=.8;for(let i=0;i<(opt.cracks||10);i++){let x=R()*S,y=R()*S;k.beginPath();k.moveTo(x,y);for(let j=0;j<3;j++){x+=(R()-.5)*7;y+=(R()-.5)*7;k.lineTo(x,y)}k.stroke()}
 return c}
let TX99=null;
function tex99(){if(TX99)return TX99;TX99={grass:grass99(9901),
 cobble:stones99(9902,13,['#9a8a74','#a8977e','#8c7c68','#b1a088','#837462','#a29280'],'#4e4234',{jit:.6,cracks:14}),
 path:stones99(9903,16,['#d8cbaf','#cdbf9f','#e2d6ba','#c6b694','#dccfb2'],'#9a8a6a',{brick:1,square:1,jit:.25,mw:.06,cracks:6}),
 plaza:stones99(9904,32,['#e6dcc4','#dcd0b4','#eee6d0','#d2c6a8'],'#a8987a',{brick:1,square:1,jit:.15,mw:.035,cracks:5})};return TX99}
C2.tex=tex99;window.tex99=tex99;
// ขอบถนน–หญ้า: หินขอบ + กอหญ้ายื่นทับ (วาดก่อนวางอาคาร)
C2.groundPost=(k,G,W,H)=>{const R=rng99(9905),isG=v=>v==='land'||v==='garden',isS=v=>v==='street'||v==='path'||v==='plaza';
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const g=G[y][x];if(!isS(g))continue;for(const [a,b] of [[0,-1],[0,1],[-1,0],[1,0]]){if(!isG(G[y+b][x+a]))continue;const px=x*T,py=y*T;
   // หินขอบ
   for(let i=0;i<5;i++){const t=(i+.5)/5,sx=b?px+t*T:(a<0?px+3:px+T-3),sy=a?py+t*T:(b<0?py+3:py+T-3);k.fillStyle=['#b8ad98','#a89c86','#c4b8a2'][i%3];k.beginPath();k.ellipse(sx,sy,b?3.6:2.6,a?3.6:2.6,0,0,7);k.fill();k.fillStyle='rgba(255,255,255,.25)';k.fillRect(sx-1.5,sy-2,2.5,1)}
   // กอหญ้ายื่น
   k.strokeStyle='rgba(70,120,40,.85)';k.lineWidth=1;for(let i=0;i<9;i++){const t=R(),bx=b?px+t*T:(a<0?px:px+T),by=a?py+t*T:(b<0?py:py+T),l=2+R()*4;k.beginPath();k.moveTo(bx,by);k.lineTo(bx-a*l+(b?(R()-.5)*3:0),by-b*l+(a?(R()-.5)*3:0));k.stroke()}}}
 // คราบดิน/รอยล้อเกวียนบนถนน
 for(let i=0;i<180;i++){const x=Math.floor(R()*W),y=Math.floor(R()*H);if(G[y]&&G[y][x]==='street'){const g=k.createRadialGradient(x*T+16,y*T+16,1,x*T+16,y*T+16,14+R()*10);g.addColorStop(0,'rgba(70,52,32,.16)');g.addColorStop(1,'rgba(70,52,32,0)');k.fillStyle=g;k.fillRect(x*T-12,y*T-12,56,56)}}};
// ---------- กลางคืน + แสงตะเกียง ----------
{const _dt=drawDmgTxt;drawDmgTxt=function(dt){const r0=_dt.apply(this,arguments);try{if(inC2()){const dk=Math.min(.5,(typeof dayDark==='function'?dayDark(DAY.t):0)*.5),t=performance.now()/1000,tr=ctx.getTransform(),z=tr.a||1,x0=-tr.e/z,y0=-tr.f/z,w=VW/z,h=VH/z;
   if(dk>.02){ctx.fillStyle='rgba(12,16,44,'+dk+')';ctx.fillRect(x0,y0,w,h)}
   ctx.save();ctx.globalCompositeOperation='lighter';const L=C2.lamps||[],a0=.1+dk*.55;
   for(const [lx,ly] of L){if(lx<x0-120||lx>x0+w+120||ly<y0-120||ly>y0+h+160)continue;const f=1+.06*Math.sin(t*7+lx);
    let g=ctx.createRadialGradient(lx,ly,1,lx,ly,60*f);g.addColorStop(0,'rgba(255,200,120,'+(a0*1.6)+')');g.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=g;ctx.fillRect(lx-62,ly-62,124,124);
    g=ctx.createRadialGradient(lx,ly+52,1,lx,ly+52,70*f);g.addColorStop(0,'rgba(255,180,90,'+a0+')');g.addColorStop(1,'rgba(255,160,70,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(lx,ly+52,70*f,30*f,0,0,7);ctx.fill()}
   if(dk>.15)for(const d of C2.doors){if(d.x<x0-80||d.x>x0+w+80||d.y<y0-80||d.y>y0+h+80)continue;const g=ctx.createRadialGradient(d.x,d.y-20,1,d.x,d.y-20,46);g.addColorStop(0,'rgba(255,190,110,'+(dk*.5)+')');g.addColorStop(1,'rgba(255,190,110,0)');ctx.fillStyle=g;ctx.fillRect(d.x-46,d.y-66,92,92)}
   ctx.restore()}}catch(e){}return r0};window.drawDmgTxt=drawDmgTxt}
// ---------- แผ่นรวม tileset / props (สำหรับ export) ----------
window.export99=function(){const X=tex99(),out={};
 const sheet=document.createElement('canvas');sheet.width=4*128+5*8;sheet.height=128+8*2;const s=sheet.getContext('2d');s.fillStyle='#1a1426';s.fillRect(0,0,sheet.width,sheet.height);let i=0;for(const k of ['grass','cobble','path','plaza']){s.drawImage(X[k],8+i*(128+8),8);i++}out.terrain=sheet.toDataURL();
 const tiles=document.createElement('canvas');tiles.width=4*32*4;tiles.height=4*32;const tk=tiles.getContext('2d');i=0;for(const k of ['grass','cobble','path','plaza']){tk.drawImage(X[k],0,0,128,128,i*128,0,128,128);i++}out.tiles32=tiles.toDataURL();
 // props พื้นโปร่งใส
 const pr=document.createElement('canvas');pr.width=1024;pr.height=360;const q=pr.getContext('2d');const R=rng99(5);
 try{lamp95(q,40,120);barrel95(q,100,110,false);barrel95(q,140,110,true);planter98(q,200,112,true);planter98(q,250,112,false);bench95(q,280,90);cart98(q,350,100,R);crates98(q,450,112,R);stall95(q,520,90,'#c0392b',R);
  fount98(q,700,150);statue95(q,840,130);gazebo95(q,940,300,.7,'#3a7ab8');
  house98(q,40,240,4*T,3*T,{style:'shop',awn:'#2f8a5a',roof:'#3a6a5a',roofKind:'slate',floors:2},R);house98(q,220,240,5*T,3*T,{style:'tavern',roof:'#8a4a2a',wall:'#d8b890',balcony:true,floors:2},R);
  house98(q,420,240,5*T,3*T,{style:'town',roof:'#c0603a',floors:2,brace:true,dormer:true,shut:'#3a6a8a'},R);tower98(q,630,250,3*T,3*T,{roof:'#c03a3a'})}catch(e){console.warn(e)}
 out.props=pr.toDataURL();return out};
}catch(e){console.warn('fix99',e)}
