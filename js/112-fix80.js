// fix80 (v4.70) — 🎥 ฟาร์ม 3 มิติ (เจ้าของขอ "แบบ 3D สวย ๆ" เหมือนโมเดลฟาร์มจิ๋ว)
//  · ปุ่ม 🎥 ฟาร์ม 3D (มุมขวาในที่ดินผู้กล้า) → เปิดฉาก WebGL (three.js r160 โหลดเมื่อกดครั้งแรก: vendor/three.min.js → สำรอง CDN)
//  · สร้างจากข้อมูลจริงของผู้เล่น (HOME.tiles/builds/animals/house) — วางบนฐานไม้เหมือนโมเดล มีแสงเงา น้ำ ใบพัดหมุน สัตว์เดิน
//  · นิ้วเดียวลาก = หมุน · สองนิ้ว = ซูม/เลื่อน · ล้อเมาส์ = ซูม · แตะของ = ดูสถานะ · ☀️/🌙 กลางวัน/กลางคืน · 📸 บันทึกภาพ
//  · ดูอย่างเดียว ไม่เปลี่ยนเซฟ (ปลูก/รดน้ำ/เก็บเกี่ยวยังทำในโหมดปกติ)
try{
const F3={on:0,lib:null,loading:0};window.F3D79=F3;
function loadThree79(cb){if(window.THREE)return cb(window.THREE);if(F3.loading){F3.q.push(cb);return}F3.loading=1;F3.q=[cb];
 const srcs=['vendor/three.min.js','https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js','https://unpkg.com/three@0.160.0/build/three.min.js'];
 const nx=i=>{if(i>=srcs.length){F3.loading=0;say('โหลดโหมด 3D ไม่สำเร็จ — ตรวจอินเทอร์เน็ตแล้วลองใหม่');F3.q=[];return}const s=document.createElement('script');s.src=srcs[i];s.onload=()=>{if(window.THREE){F3.loading=0;const q=F3.q;F3.q=[];q.forEach(f=>f(window.THREE))}else nx(i+1)};s.onerror=()=>{s.remove();nx(i+1)};document.head.appendChild(s)};nx(0)}
// ---------- UI ----------
const ov=document.createElement('div');ov.id='f3d79';ov.hidden=true;gid('wrap').appendChild(ov);
{const st=document.createElement('style');st.textContent='#f3d79{position:absolute;inset:0;z-index:60;background:radial-gradient(ellipse at 50% 35%,#ffffff 0%,#e9edf2 55%,#c9d1db 100%);touch-action:none;user-select:none}#f3d79.night{background:radial-gradient(ellipse at 50% 30%,#2a3a5e 0%,#121a30 60%,#070b16 100%)}#f3d79 canvas{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;border:none!important;border-radius:0!important;background:transparent!important;display:block}'+
 '#f3d79 .f3b{position:absolute;left:0;right:0;top:calc(8px + var(--st,0px));display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:0 8px;z-index:2}#f3d79 .f3b button{font:700 13px system-ui,"Noto Sans Thai",sans-serif;padding:7px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.6);background:rgba(30,40,30,.72);color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.25)}#f3d79 .f3b button.x{background:#a83a2a}'+
 '#f3d79 .f3t{position:absolute;left:12px;bottom:calc(12px + var(--sb,0px));font:800 15px system-ui,"Noto Sans Thai",sans-serif;color:#3a4a2a;text-shadow:0 1px 0 #fff;z-index:2}#f3d79.night .f3t{color:#e8f0ff;text-shadow:0 1px 3px #000}#f3d79 .f3p{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(14px + var(--sb,0px));background:rgba(20,30,15,.82);color:#fff;font:600 13px system-ui,"Noto Sans Thai",sans-serif;padding:7px 14px;border-radius:12px;max-width:80%;text-align:center;z-index:2}#f3d79 .f3l{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:800 16px system-ui,"Noto Sans Thai",sans-serif;color:#3a4a2a}';document.head.appendChild(st)}
const btn=document.createElement('button');btn.id='f3db79';btn.textContent='🎥 ฟาร์ม 3D';btn.hidden=true;btn.style.cssText='position:absolute;right:10px;top:calc(150px + var(--st,0px));z-index:15;font:800 13px system-ui,"Noto Sans Thai",sans-serif;padding:8px 12px;border-radius:14px;border:2px solid #fff;background:linear-gradient(180deg,#6ac84a,#2e7a22);color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.35)';gid('wrap').appendChild(btn);btn.onclick=()=>open3D();
setInterval(()=>{try{btn.hidden=!(D&&D.home&&titleEl.hidden&&!F3.on)}catch(e){}},500);
// ---------- เปิด/ปิด ----------
function open3D(){if(F3.on)return;F3.on=1;F3.wasP=PAUSED;PAUSED=true;ov.hidden=false;ov.innerHTML='<div class="f3l">🌾 กำลังสร้างฟาร์ม 3 มิติ…</div>';sfx('ui');loadThree79(T3=>{if(!F3.on)return;try{build3D(T3)}catch(e){console.warn('f3d',e);say('สร้างฉาก 3D ไม่สำเร็จ');close3D()}})}
function close3D(){if(!F3.on)return;F3.on=0;try{cancelAnimationFrame(F3.raf)}catch(e){}try{F3.dispose&&F3.dispose()}catch(e){}ov.hidden=true;ov.innerHTML='';ov.classList.remove('night');PAUSED=false;sfx('ui')}
window.open3D79=open3D;window.close3D79=close3D;
addEventListener('keydown',e=>{if(F3.on&&(e.key==='Escape'||e.key==='Esc')){close3D();e.stopPropagation()}},true);
// ---------- ฉาก ----------
function build3D(THREE){
 const W=HW,H=HH,Zm=ZCACHE[300]||buildHomeZone();
 ov.innerHTML='<canvas></canvas><div class="f3b"><button data-a="rot">🔄 หมุนเอง</button><button data-a="night">🌙 กลางคืน</button><button data-a="shot">📸 บันทึกภาพ</button><button class="x" data-a="x">✕ ปิด</button></div><div class="f3t">🏡 ที่ดินของ '+(P.name||'ผู้กล้า')+' · ฟาร์ม Lv.'+(window.flv77?flv77():1)+'</div><div class="f3p" hidden></div>';
 const cv=ov.querySelector('canvas'),tip=ov.querySelector('.f3p');
 const mob=('ontouchstart' in window)||innerWidth<900;
 const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});R.setPixelRatio(Math.min(devicePixelRatio||1,mob?1.5:2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.outputColorSpace=THREE.SRGBColorSpace;R.setClearColor(0x000000,0);
 const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.3,400);
 const hemi=new THREE.HemisphereLight('#f4fbff','#7a8a5a',1.25);S.add(hemi);
 const sun=new THREE.DirectionalLight('#fff4dc',2.4);sun.position.set(-26,34,22);sun.castShadow=true;sun.shadow.mapSize.set(mob?1024:2048,mob?1024:2048);const sc=sun.shadow.camera;sc.left=-38;sc.right=38;sc.top=30;sc.bottom=-30;sc.near=1;sc.far=120;sun.shadow.bias=-.0008;sun.shadow.normalBias=.03;S.add(sun);
 const amb=new THREE.AmbientLight('#ffffff',.15);S.add(amb);
 // ----- ตัวช่วย -----
 const MC={},mat=(c,o)=>{const k=c+JSON.stringify(o||{});return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75,metalness:0},o||{})))};
 const GC={},geo=(k,f)=>GC[k]||(GC[k]=f());
 const PICK=[],DYN=[],GLOW=[];
 const X=tx=>tx-W/2,Zc=ty=>ty-H/2;
 function mesh(g,m,x,y,z,o){const s=new THREE.Mesh(g,m);s.position.set(x,y,z);s.castShadow=o&&o.ns?false:true;s.receiveShadow=true;if(o){if(o.ry)s.rotation.y=o.ry;if(o.rx)s.rotation.x=o.rx;if(o.rz)s.rotation.z=o.rz;if(o.s)s.scale.set(o.s[0],o.s[1],o.s[2])}return s}
 const box=(w,h,d,c,x,y,z,o)=>mesh(geo('b'+w+','+h+','+d,()=>new THREE.BoxGeometry(w,h,d)),typeof c==='string'?mat(c):c,x,y+h/2,z,o);
 const cyl=(rt,rb,h,c,x,y,z,o,seg)=>mesh(geo('c'+rt+','+rb+','+h+','+(seg||14),()=>new THREE.CylinderGeometry(rt,rb,h,seg||14)),typeof c==='string'?mat(c):c,x,y+h/2,z,o);
 const sph=(r,c,x,y,z,o)=>mesh(geo('s'+r,()=>new THREE.SphereGeometry(r,16,12)),typeof c==='string'?mat(c):c,x,y,z,o);
 const cone=(r,h,c,x,y,z,o,seg)=>mesh(geo('k'+r+','+h+','+(seg||12),()=>new THREE.ConeGeometry(r,h,seg||12)),typeof c==='string'?mat(c):c,x,y+h/2,z,o);
 function prism(w,h,d,c,x,y,z,o){const g=geo('p'+w+','+h+','+d,()=>{const sh=new THREE.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(0,h);sh.lineTo(-w/2,0);const e=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false});e.translate(0,0,-d/2);return e});return mesh(g,typeof c==='string'?mat(c):c,x,y,z,o)}
 function tex(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
 const grp=(x,z,info)=>{const g=new THREE.Group();g.position.set(x,0,z);S.add(g);if(info){g.userData.info=info;PICK.push(g)}return g};
 // ----- ฐานไม้ + พื้นหญ้า -----
 const woodT=tex(512,64,(k,w,h)=>{k.fillStyle='#b07a44';k.fillRect(0,0,w,h);for(let i=0;i<90;i++){k.strokeStyle='rgba('+(90+Math.random()*40|0)+',50,20,'+(.12+Math.random()*.2)+')';k.lineWidth=1+Math.random()*2;k.beginPath();const y=Math.random()*h;k.moveTo(0,y);k.bezierCurveTo(w*.3,y+Math.random()*8-4,w*.6,y+Math.random()*8-4,w,y+Math.random()*6-3);k.stroke()}});woodT.wrapS=woodT.wrapT=THREE.RepeatWrapping;woodT.repeat.set(3,1);
 const woodM=new THREE.MeshStandardMaterial({map:woodT,roughness:.55,color:'#ffffff'});
 const base=new THREE.Mesh(new THREE.BoxGeometry(W+2.4,1.6,H+2.4),woodM);base.position.y=-.8-.02;base.receiveShadow=true;base.castShadow=true;S.add(base);
 const lip=new THREE.Mesh(new THREE.BoxGeometry(W+3.2,.5,H+3.2),woodM);lip.position.y=-1.85;lip.receiveShadow=true;S.add(lip);
 // พื้น: ใช้ภาพแผนที่ที่ดินจริง (ทาง/หญ้า/บ่อ) แต่ไม่เอาแปลงดินเพราะมีแปลง 3 มิติทับ
 const gT=new THREE.CanvasTexture(Zm.cv);gT.colorSpace=THREE.SRGBColorSpace;gT.anisotropy=8;
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshStandardMaterial({map:gT,roughness:.95}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;S.add(ground);
 // ----- น้ำ (บ่อธรรมชาติ) -----
 const waterM=new THREE.MeshStandardMaterial({color:'#3a8ad0',roughness:.08,metalness:.15,transparent:true,opacity:.86});
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(Zm.m[y][x]===WL&&x>=33&&x<=41&&y>=2&&y<=8){const p=mesh(geo('wt',()=>new THREE.PlaneGeometry(1.02,1.02)),waterM,X(x)+.5,.06,Zc(y)+.5,{rx:-Math.PI/2,ns:1});p.castShadow=false;S.add(p)}}
 // รั้วไม้รอบขอบ (ขอบที่ดิน)
 {const fm=mat('#8a5a2e');for(const [x0,z0,x1,z1] of [[-W/2+.5,-H/2+.5,W/2-.5,-H/2+.5],[-W/2+.5,H/2-.5,W/2-.5,H/2-.5],[-W/2+.5,-H/2+.5,-W/2+.5,H/2-.5],[W/2-.5,-H/2+.5,W/2-.5,H/2-.5]]){const L=Math.hypot(x1-x0,z1-z0),hz=x0===x1;
   for(const yy of [.32,.6])S.add(box(hz?.08:L,.08,hz?L:.08,fm,(x0+x1)/2,yy,(z0+z1)/2));for(let i=0;i<=L;i+=2)S.add(box(.14,.75,.14,fm,hz?x0:x0+i,0,hz?z0+i:z0))}}
 // ----- บ้าน -----
 {const lv=HOME.house|0,cx=X(HLOT.x+3),cz=Zc(HLOT.y+HLOT.h-1)-1.2,g=grp(cx,cz,'🏠 '+HOUSE[lv].n);
  if(!lv){g.add(box(.12,1,.12,'#7a4a22',0,0,0));g.add(box(1.4,.6,.08,'#c8945a',0,.9,0))}
  else{const PAL=[null,['#c89a62','#7a3a22'],['#c8c4b8','#5a5a6a'],['#d8dce4','#3a4a6a'],['#e8a878','#8a3a1a'],['#f4f6fa','#5a6a8a'],['#fff2c8','#c8901a'],['#eef8ff','#3a7ad0']][lv],w=3.4+lv*.32,d=2.6+lv*.16,hh=1.7+lv*.12;
   g.add(box(w,hh,d,PAL[0],0,0,0));g.add(box(w+.1,.12,d+.1,'#f4f0e6',0,hh,0));g.add(prism(w+.6,1.1+lv*.08,d+.5,PAL[1],0,hh+.1,0,{ry:0}));
   g.add(box(.6,1.05,.06,'#5a3418',0,0,d/2+.01));const wm=mat('#9fd0ff',{emissive:'#ffc860',emissiveIntensity:0,roughness:.2});GLOW.push(wm);for(const s of [-1,1]){g.add(box(.62,.55,.05,wm,s*w/3.2,hh*.45,d/2+.02));g.add(box(.7,.07,.08,'#f4f0e6',s*w/3.2,hh*.45+.55,d/2+.03))}
   if(lv>=3)g.add(box(.35,.9,.35,'#8a8a92',w/3,hh+.5,-d/5));if(lv>=5)for(const s of [-1,1]){g.add(cyl(.45,.45,hh+.9,PAL[0],s*(w/2+.2),0,0));g.add(cone(.6,1.1,PAL[1],s*(w/2+.2),hh+.9,0))}}}
 // ----- แปลงผัก + พืช -----
 const CG={turnip:'root',carrot:'root',wheat:'grain',corn:'grain',cabbage:'head',tomato:'bush',strawberry:'bush',pumpkin:'ground',chili:'bush',eggplant:'bush',watermelon:'ground',sunflower:'tall',melon:'ground'};
 const soilD=mat('#5a3a22',{roughness:1}),soilW=mat('#3e2716',{roughness:.7}),rimM=mat('#eeeee8',{roughness:.6}),leafM=mat('#5aaa3a'),leafD=mat('#3d8a2a'),stemM=mat('#4a8a2a');
 const tl=(x,y)=>{const t=HOME.tiles[x+','+y];return !!(t&&t.till)};
 for(const key in HOME.tiles){const t=HOME.tiles[key];if(!t.till)continue;const [tx,ty]=key.split(',').map(Number),x=X(tx)+.5,z=Zc(ty)+.5,wet=t.w===HOME.day;
  S.add(box(1,.26,1,wet?soilW:soilD,x,0,z,{ns:1}));
  // ขอบปูนขาวเฉพาะด้านที่ไม่ต่อแปลงอื่น
  if(!tl(tx,ty-1))S.add(box(1.04,.34,.1,rimM,x,0,z-.47));if(!tl(tx,ty+1))S.add(box(1.04,.34,.1,rimM,x,0,z+.47));if(!tl(tx-1,ty))S.add(box(.1,.34,1.04,rimM,x-.47,0,z));if(!tl(tx+1,ty))S.add(box(.1,.34,1.04,rimM,x+.47,0,z));
  for(let i=-1;i<=1;i++)S.add(box(.8,.03,.08,mat('#2e1c10'),x,.26,z+i*.28,{ns:1}));
  if(!t.crop||!CROPS[t.crop.k])continue;const C=CROPS[t.crop.k],k=t.crop.k,s=t.crop.s,u=Math.min(1,s/C.d),st=s===0?0:s>=C.d?4:u<.34?1:u<.67?2:3,G=CG[k]||'bush',y0=.26,c0=C.c[0],c1=C.c[1];
  const g=grp(x,z,'🌱 '+C.n+' — '+(st===4?'✨ พร้อมเก็บเกี่ยว!':'โตแล้ว '+s+'/'+C.d+' วัน')+(st<4?(wet?' · 💧 รดน้ำแล้ว':' · ⚠️ ยังไม่รดน้ำ'):''));
  if(st===0){g.add(sph(.07,'#8a6a40',0,y0+.03,0,{s:[1.4,.6,1.4]}));continue}
  const sc=[0,.45,.7,.9,1][st],rnd=(tx*7+ty*13)%10/10;
  if(G==='root'){for(let i=0;i<3+st;i++){const a=i/(3+st)*6.28+rnd;g.add(cone(.06,.32*sc+.08,leafM,Math.cos(a)*.08,y0,Math.sin(a)*.08,{rz:Math.cos(a)*.35,rx:Math.sin(a)*.35},6))}if(st>=3)g.add(sph(.14*sc,c0,0,y0+.04,0,{s:[1,.7,1]}))}
  else if(G==='grain'){const corn=k==='corn',n=corn?3:6,hh=(corn?1.1:.7)*sc;for(let i=0;i<n;i++){const a=i/n*6.28+rnd,r=corn?.18:.2,px=Math.cos(a)*r,pz=Math.sin(a)*r;g.add(cyl(corn?.03:.015,corn?.035:.02,hh,st===4&&!corn?'#d8b850':stemM,px,y0,pz,0,6));
    if(corn&&st>=2)g.add(cone(.05,.5*sc,leafM,px+.08,y0+hh*.4,pz,{rz:-1.1},5));if(st===4)g.add(corn?sph(.06,'#ffd23a',px+.05,y0+hh*.6,pz,{s:[1,2.4,1]}):cyl(.03,.02,.14,'#e8c860',px,y0+hh,pz,0,6))}}
  else if(G==='head'){const r=.12+.2*sc;for(let i=0;i<6;i++){const a=i/6*6.28+rnd;g.add(sph(r*.75,leafD,Math.cos(a)*r*.6,y0+r*.35,Math.sin(a)*r*.6,{s:[1,.35,1]}))}g.add(sph(r*.8,st===4?'#c8f0a0':'#9ad870',0,y0+r*.6,0,{s:[1,.9,1]}))}
  else if(G==='ground'){for(let i=0;i<4;i++){const a=i/4*6.28+rnd;g.add(sph(.13*sc+.04,leafM,Math.cos(a)*.26*sc,y0+.04,Math.sin(a)*.26*sc,{s:[1,.25,1]}))}if(st>=3){const r=st===4?(k==='melon'?.24:.3):.13;const f=sph(r,c0,.04,y0+r*.75,.02,{s:[k==='watermelon'?1.3:1.1,.85,1]});g.add(f);if(k==='pumpkin')g.add(cyl(.02,.03,.1,'#5a7a2a',.04,y0+r*1.45,.02,0,6))}}
  else if(G==='tall'){const hh=1.2*sc;g.add(cyl(.03,.04,hh,stemM,0,y0,0,0,6));for(let i=1;i<=Math.min(3,st);i++)g.add(cone(.07,.28,leafM,(i%2?.1:-.1),y0+hh*i/4,0,{rz:i%2?-1.3:1.3},5));
   if(st>=3){const r=st===4?.22:.12;g.add(cyl(r,r,.04,'#ffc820',0,y0+hh,.04,{rx:1.25},16));g.add(cyl(r*.5,r*.5,.06,'#6a3a10',0,y0+hh,.07,{rx:1.25},12))}}
  else{const r=.12+.22*sc;g.add(sph(r,leafM,0,y0+r*.8,0,{s:[1,.9,1]}));g.add(sph(r*.7,leafD,r*.4,y0+r*.6,r*.2));g.add(sph(r*.7,leafM,-r*.4,y0+r*.7,-r*.2));
   if(st===3)for(let i=0;i<4;i++){const a=i*1.6+rnd;g.add(sph(.03,'#ffffff',Math.cos(a)*r*.8,y0+r*1.1,Math.sin(a)*r*.8))}
   if(st===4)for(let i=0;i<(k==='eggplant'?3:5);i++){const a=i*1.3+rnd,fx=Math.cos(a)*r*.85,fz=Math.sin(a)*r*.85,fy=y0+r*(.5+(i%3)*.3);g.add(k==='eggplant'?sph(.07,c0,fx,fy,fz,{s:[1,1.8,1]}):k==='chili'?sph(.03,c0,fx,fy,fz,{s:[1,3,1]}):sph(k==='strawberry'?.05:.07,c0,fx,fy,fz))}}}
 // ----- สิ่งก่อสร้าง -----
 const ripeFT=b=>(b.g|0)>=8&&(b.fd|0)>=((window.BLD&&BLD[b.k]&&/ทุก (\d+) วัน/.exec(BLD[b.k].d||''))?+/ทุก (\d+) วัน/.exec(BLD[b.k].d)[1]:3);
 const FTC={ft_apple:'#e83a3a',ft_orange:'#ff9a2a',ft_peach:'#ffb0a0',ft_mango:'#ffd040',ft_cherry:'#c8102a'};
 for(const b of HOME.builds){const B=BLD[b.k];if(!B)continue;const cx=X(b.x)+B.w/2,cz=Zc(b.y)+B.h/2,g=grp(cx,cz,'🔨 '+B.n);const w=B.w,d=B.h;
  switch(b.k){
   case 'coop':g.add(box(w-.4,1,d-.4,'#c8945a',0,0,0));g.add(prism(w,.8,d,'#7a4a22',0,1,0));g.add(box(.5,.6,.05,'#3a2410',0,0,d/2-.18));break;
   case 'barn':g.add(box(w-.3,1.6,d-.3,'#b83a2a',0,0,0));g.add(prism(w+.1,1.2,d,'#f2ead8',0,1.6,0));g.add(box(.9,1.1,.05,'#f2ead8',0,0,d/2-.13));g.add(box(.8,1,.06,'#5a1a10',0,0,d/2-.11));break;
   case 'sty':g.add(box(w-.3,.7,d-.3,'#9a7a52',0,0,0));g.add(prism(w,.6,d,'#c8784a',0,.7,0));g.add(cyl(.6,.6,.03,'#6a4a2a',w/4,0,d/2+.2,0,16));break;
   case 'kitchen':g.add(box(w-.2,.8,.8,'#9a9aa2',0,0,0));g.add(box(.3,1.3,.3,'#6a6a72',w/2-.35,.8,0));break;
   case 'well':g.add(cyl(.4,.42,.45,'#9a9aa2',0,0,0,0,16));g.add(cyl(.32,.32,.02,waterM,0,.4,0,0,16));for(const s of [-1,1])g.add(box(.07,1,.07,'#6a4422',s*.38,.4,0));g.add(prism(1,.3,.6,'#7a3a22',0,1.35,0));break;
   case 'spr1':case 'spr2':case 'spr3':g.add(cyl(.03,.03,.4,'#555',0,0,0,0,6));g.add(sph(.08,b.k==='spr1'?'#e08a4a':b.k==='spr2'?'#e6eef8':'#ffd23a',0,.42,0));break;
   case 'fence':for(const s of [-.35,.35])g.add(box(.1,.6,.1,'#8a5a2e',s,0,0));for(const y of [.2,.42])g.add(box(1,.07,.06,'#a87040',0,y,0));break;
   case 'pfence77':for(const s of [-.33,0,.33]){g.add(box(.09,.6,.05,'#ffffff',s,0,0));g.add(cone(.065,.1,'#ffffff',s,.6,0,{ry:Math.PI/4},4))}for(const y of [.18,.42])g.add(box(1,.06,.04,'#eceef4',0,y,.04));break;
   case 'lamp':{g.add(cyl(.04,.05,1.5,'#2a2a32',0,0,0,0,8));const lm=mat('#ffe8a0',{emissive:'#ffc860',emissiveIntensity:.2});GLOW.push(lm);g.add(box(.22,.25,.22,lm,0,1.5,0));g.add(cone(.2,.15,'#2a2a32',0,1.75,0,{ry:Math.PI/4},4));F3.lamps=(F3.lamps||[]).concat([[cx,1.65,cz]]);break}
   case 'flower':g.add(cyl(.22,.17,.3,'#a8603a',0,0,0,0,12));for(const [dx,dz,c] of [[-.08,0,'#ff6a8a'],[.08,.05,'#ffd23a'],[0,-.08,'#c08bff'],[.04,.1,'#ffffff']]){g.add(cyl(.01,.01,.2,stemM,dx,.3,dz,0,4));g.add(sph(.06,c,dx,.52,dz))}break;
   case 'bench':g.add(box(w-.3,.08,.35,'#8a5a2e',0,.35,0));g.add(box(w-.3,.3,.06,'#8a5a2e',0,.45,-.15));for(const s of [-1,1])g.add(box(.08,.35,.3,'#5a3418',s*(w/2-.3),0,0));break;
   case 'scare':g.add(cyl(.03,.03,1.3,'#6a4422',0,0,0,0,6));g.add(box(.9,.05,.05,'#6a4422',0,.95,0));g.add(box(.36,.42,.2,'#c8945a',0,.6,0));g.add(sph(.15,'#e8d8a8',0,1.2,0));g.add(cone(.3,.2,'#d9c16a',0,1.28,0));break;
   case 'tree':g.add(cyl(.08,.12,.9,'#6a4422',0,0,0,0,8));g.add(sph(.55,'#3f9a3a',0,1.2,0));for(let i=0;i<5;i++)g.add(sph(.06,'#ff4a4a',Math.cos(i*1.3)*.48,1.1+(i%2)*.25,Math.sin(i*1.3)*.48));break;
   case 'statue':g.add(box(1.2,.5,1.2,'#c8ccd6',0,0,0));g.add(cone(.35,1.2,'#eef2f8',0,.5,0));g.add(sph(.2,'#eef2f8',0,1.85,0));break;
   case 'fountain':g.add(cyl(.9,.95,.35,'#c8a040',0,0,0,0,20));g.add(cyl(.8,.8,.02,waterM,0,.32,0,0,20));g.add(cyl(.1,.12,1,'#ffd23a',0,.3,0,0,10));g.add(cyl(.35,.2,.12,'#ffd23a',0,1.3,0,0,14));break;
   case 'crystal':{const cm=mat('#7fd0ff',{emissive:'#4ab0ff',emissiveIntensity:.5,roughness:.15,metalness:.2});GLOW.push(cm);for(const [dx,h] of [[-.15,.8],[0,1.15],[.16,.7]])g.add(cone(.1,h,cm,dx,0,0,0,5));break}
   case 'hive77':for(let i=0;i<4;i++)g.add(sph(.28-i*.04,'#ffd050',0,.2+i*.16,0,{s:[1,.55,1]}));g.add(cyl(.04,.04,.2,'#6a4422',0,0,0,0,6));g.add(sph(.05,'#3a2408',0,.35,.24));break;
   case 'path77':for(const [dx,dz,r] of [[-.2,-.2,.22],[.2,-.15,.18],[-.05,.22,.24]])g.add(cyl(r,r,.05,'#b8b4a8',dx,0,dz,{ns:1},10));break;
   case 'cpath78':g.add(box(.98,.05,.98,'#cfcfc8',0,0,0,{ns:1}));break;
   case 'hay77':g.add(cyl(.32,.32,.7,'#e8c860',0,-.03,0,{rz:Math.PI/2},14));break;
   case 'arch77':for(const s of [-1,1])g.add(box(.1,1.6,.1,'#8a5a2e',s*.8,0,0));{const t=mesh(geo('tor',()=>new THREE.TorusGeometry(.8,.06,6,18,Math.PI)),mat('#8a5a2e'),0,1.6,0);g.add(t);for(let i=0;i<14;i++){const a=i/13*Math.PI;g.add(sph(.09,['#ff6a8a','#ffffff','#ffb0d0','#c08bff'][i%4],Math.cos(a)*.8,1.6+Math.sin(a)*.8,0))}}break;
   case 'wmill77':{g.add(cyl(.55,.85,2.6,'#f4ead6',0,0,0,0,10));g.add(cone(.75,.8,'#a83a22',0,2.6,0,0,10));g.add(box(.35,.6,.05,'#5a3418',0,0,.8));const bl=new THREE.Group();bl.position.set(0,2.5,.78);for(let i=0;i<4;i++){const a=new THREE.Group();a.rotation.z=i*Math.PI/2;a.add(box(.06,1.5,.04,'#6a4422',0,0,0));a.add(box(.38,1.1,.02,'#faf6ea',.22,.35,.03));bl.add(a)}g.add(bl);DYN.push(()=>{bl.rotation.z+=.012});break}
   case 'gazebo77':g.add(cyl(1.3,1.35,.2,'#d8c8a8',0,0,0,0,8));for(let i=0;i<6;i++){const a=i/6*6.28;g.add(box(.1,1.6,.1,'#f4ead6',Math.cos(a)*1.1,.2,Math.sin(a)*1.1))}g.add(cone(1.6,1,'#3a5ab8',0,1.8,0,0,6));g.add(sph(.1,'#ffd23a',0,2.85,0));break;
   case 'shed78':{for(const sx of [-1,1])for(const sz of [-1,1])g.add(box(.12,1.4,.12,'#d8c8a8',sx*(w/2-.3),0,sz*(d/2-.3)));g.add(box(w-.2,.1,d-.2,'#d4d4cc',0,0,0,{ns:1}));
    const rt=tex(256,64,(k,W2,H2)=>{for(let i=0;i<W2;i+=8){const gg=k.createLinearGradient(i,0,i+8,0);gg.addColorStop(0,'#2a4ab8');gg.addColorStop(.5,'#6a8ae8');gg.addColorStop(1,'#1a2a7a');k.fillStyle=gg;k.fillRect(i,0,8,H2)}});rt.wrapS=THREE.RepeatWrapping;rt.repeat.set(4,1);
    const rm=new THREE.MeshStandardMaterial({map:rt,roughness:.35,metalness:.3,side:THREE.DoubleSide});const roof=new THREE.Mesh(new THREE.CylinderGeometry(d/2+.15,d/2+.15,w+.3,24,1,true,-Math.PI/2,Math.PI),rm);roof.rotation.z=Math.PI/2;roof.position.y=1.35;roof.scale.set(1,1,.55);roof.castShadow=true;g.add(roof);
    for(let i=0;i<4;i++)g.add(sph(.18,leafM,-w/2+.8+i*.75,.25,.3));break}
   case 'ghouse78':{const gm=new THREE.MeshStandardMaterial({color:'#e6f4ff',roughness:.05,metalness:.1,transparent:true,opacity:.32});const fr=mat('#ffffff',{roughness:.4});
    const body=box(w-.3,1.4,d-.3,gm,0,0,0);body.castShadow=false;g.add(body);const rf=prism(w-.2,.9,d-.3,gm,0,1.4,0,{ry:Math.PI/2});rf.castShadow=false;g.add(rf);
    for(const sx of [-1,1])for(const sz of [-1,1])g.add(box(.06,1.4,.06,fr,sx*(w/2-.15),0,sz*(d/2-.15)));g.add(box(.06,.06,d-.3,fr,0,2.3,0));for(const sx of [-1,1])g.add(box(.06,.06,d-.3,fr,sx*(w/2-.15),1.4,0));
    for(let r=0;r<2;r++)for(let i=0;i<4;i++)g.add(sph(.14,i%2?leafM:leafD,-w/2+.7+i*.55,.15,-.4+r*.8,{s:[1,.8,1]}));break}
   case 'hut78':{for(const sx of [-1,1])for(const sz of [-1,1])g.add(cyl(.06,.06,.5,'#7a5a30',sx*(w/2-.3),0,sz*(d/2-.3),0,6));g.add(box(w-.4,.08,d-.4,'#a8885a',0,.5,0));g.add(box(w-.6,.8,d-.6,'#d8b878',0,.58,0));g.add(box(.4,.6,.03,'#4a3010',0,.6,d/2-.29));
    const tt=tex(128,128,(k,W2,H2)=>{k.fillStyle='#c8a058';k.fillRect(0,0,W2,H2);for(let i=0;i<400;i++){k.strokeStyle='rgba('+(140+Math.random()*80|0)+','+(100+Math.random()*60|0)+',40,.6)';k.beginPath();const x=Math.random()*W2;k.moveTo(x,0);k.lineTo(x+Math.random()*6-3,H2);k.stroke()}});
    const roof=new THREE.Mesh(new THREE.ConeGeometry(w*.85,1.1,4),new THREE.MeshStandardMaterial({map:tt,roughness:1}));roof.rotation.y=Math.PI/4;roof.position.y=1.38+.55;roof.scale.set(1,1,.85);roof.castShadow=true;g.add(roof);break}
   case 'palm78':{let px=0,py=0;const seg=7;for(let i=0;i<seg;i++){const s=cyl(.11-i*.008,.12-i*.008,.42,'#9a7a4a',px,py,0,{rz:-.06*i},8);g.add(s);px+=Math.sin(.06*i)*.42;py+=.4}
    const crown=new THREE.Group();crown.position.set(px,py,0);g.add(crown);for(let i=0;i<9;i++){const a=i/9*6.28,f=new THREE.Group();f.rotation.y=a;const lf=sph(.5,'#4aa83a',.55,-.1,0,{s:[1.4,.06,.32],rz:-.45});f.add(lf);crown.add(f)}for(let i=0;i<3;i++)crown.add(sph(.09,'#6a4a20',Math.cos(i*2)*.12,-.12,Math.sin(i*2)*.12));
    DYN.push((t)=>{crown.rotation.z=Math.sin(t*1.1+b.x)*.04});break}
   case 'bush78':g.add(cyl(.05,.06,.3,'#6a4422',0,0,0,0,6));g.add(sph(.42,'#2e8a2a',0,.62,0));g.add(sph(.25,'#4aa83a',-.12,.8,.12));break;
   case 'pond78':{const rk='#bdb8aa';g.add(box(w-.1,.22,.3,rk,0,0,-(d/2-.2)));g.add(box(w-.1,.22,.3,rk,0,0,d/2-.2));g.add(box(.3,.22,d-.1,rk,-(w/2-.2),0,0));g.add(box(.3,.22,d-.1,rk,w/2-.2,0,0));g.add(box(w-.6,.04,d-.6,'#1e3a26',0,0,0,{ns:1}));const wm2=new THREE.MeshStandardMaterial({color:'#2e6a4a',roughness:.06,metalness:.2,transparent:true,opacity:.92});const wp=mesh(new THREE.PlaneGeometry(w-.55,d-.55),wm2,0,.14,0,{rx:-Math.PI/2,ns:1});g.add(wp);
    for(const [u,v] of [[-.3,-.2],[.1,.25],[.35,-.25],[-.4,.3],[.6,.15],[-.1,-.3]]){g.add(cyl(.17,.17,.015,'#5ab040',u*(w-1.2),.15,v*(d-1.2),{ns:1},14))}
    for(const [u,v] of [[-.15,.1],[.45,-.1]]){const lx=u*(w-1),lz=v*(d-1);for(let i=0;i<6;i++){const a=i/6*6.28;g.add(sph(.05,i%2?'#ffb0d0':'#ff7ab0',lx+Math.cos(a)*.05,.2,lz+Math.sin(a)*.05,{s:[.6,1.3,.6]}))}g.add(sph(.03,'#ffe060',lx,.22,lz))}break}
   case 'wall78':g.add(box(1,.8,.3,'#dcdcd4',0,0,0));g.add(box(1.04,.06,.36,'#f2f2ec',0,.8,0));break;
   case 'brick78':g.add(box(1,.28,.3,'#b0503a',0,0,0));g.add(box(1.02,.04,.34,'#d8d0c0',0,.28,0));break;
   default:
    if(FTC[b.k]){const real=1,gg=b.g|0,st=Math.min(4,gg>>1),sc=[.25,.4,.6,.8,1][st],ripe=ripeFT(b);g.userData.info='🌳 '+B.n+' — '+(gg<8?'กำลังโต '+(st+1)+'/5':ripe?'🧺 ผลสุกพร้อมเก็บ!':'รอผลสุก');
     if(st===0){g.add(sph(.1,'#8a6a40',0,.04,0,{s:[1.5,.5,1.5]}));g.add(cyl(.02,.02,.35,'#6a4422',0,0,0,0,5));g.add(sph(.08,leafM,.05,.35,0,{s:[1,.4,1]}));break}
     g.add(cyl(.06*sc+.03,.09*sc+.04,1.1*sc,'#7a4a24',0,0,0,0,8));const top=1.1*sc;for(const [dx,dy,dz,r] of [[0,.35,0,.6],[-.3,.15,.1,.42],[.3,.18,-.1,.42],[0,.2,.3,.4]])g.add(sph(r*sc,st>=3?'#3f9a3a':'#5ab84a',dx*sc,top+dy*sc,dz*sc));
     if(b.k==='ft_cherry'&&st===4&&!ripe)for(let i=0;i<10;i++)g.add(sph(.05,'#ffc8dc',Math.cos(i*2.4)*.55,top+.3+Math.sin(i*1.7)*.25,Math.sin(i*2.4)*.55));
     if(st===4&&ripe)for(let i=0;i<9;i++){const a=i*.7;g.add(sph(b.k==='ft_cherry'?.05:.08,FTC[b.k],Math.cos(a)*.55,top+.15+(i%3)*.18,Math.sin(a)*.55))}}
    else g.add(box(Math.max(.4,w-.3),.5,Math.max(.4,d-.3),'#c8a878',0,0,0))}}
 // ----- คนเลี้ยงสัตว์ -----
 {const rx=RANCHER.x/T-W/2,rz=RANCHER.y/T-H/2-.2,g=grp(rx,rz,'🧑‍🌾 ลุงบุญมี — คุยได้ในโหมดปกติ');g.add(cyl(.17,.2,.55,'#7a8a3a',0,.3,0,0,10));for(const s of [-.08,.08])g.add(cyl(.05,.05,.3,'#4a3a2a',s,0,0,0,6));g.add(sph(.16,'#f0c8a0',0,1,0));g.add(cyl(.32,.32,.04,'#e8d070',0,1.12,0,0,16));g.add(cone(.16,.16,'#e8d070',0,1.14,0))}
 // ----- สัตว์ -----
 const AN=[];
 for(const a of HOME.animals){const nm={chicken:'ไก่',cow:'วัวนม',sheep:'แกะ',duck:'เป็ด',rabbit:'กระต่าย',goat:'แพะ',pig:'หมูแคระ'}[a.k]||a.k;const g=grp(0,0,'🐾 '+nm+(a.name?' '+a.name:'')+(a.fed===HOME.day?' · กินอิ่มแล้ว':' · 🌿 หิวอยู่'));const b=new THREE.Group();g.add(b);
  switch(a.k){
   case 'chicken':b.add(sph(.18,'#ffffff',0,.24,0,{s:[1.15,.9,.9]}));b.add(sph(.1,'#ffffff',.17,.42,0));b.add(box(.06,.07,.03,'#e04a3a',.18,.5,0));b.add(cone(.03,.07,'#ffb43a',.29,.42,0,{rz:-Math.PI/2},5));for(const s of [-.05,.05])b.add(cyl(.012,.012,.12,'#e8a030',0,0,s,0,4));break;
   case 'duck':b.add(sph(.19,'#ffffff',0,.2,0,{s:[1.3,.8,.9]}));b.add(sph(.1,'#ffffff',.2,.38,0));b.add(box(.12,.03,.07,'#ffa020',.32,.36,0));b.add(sph(.1,'#d8dce4',-.05,.24,0,{s:[1,.6,1.1]}));break;
   case 'rabbit':b.add(sph(.17,'#ffffff',0,.18,0,{s:[1.1,.9,.9]}));b.add(sph(.11,'#ffffff',.15,.32,0));for(const s of [-.04,.04])b.add(sph(.04,'#ffffff',.13,.5,s,{s:[.6,2.2,.6]}));b.add(sph(.05,'#ffffff',-.18,.2,0));break;
   case 'pig':b.add(sph(.3,'#ffc0cc',0,.3,0,{s:[1.25,.85,.9]}));b.add(sph(.17,'#ffc8d2',.33,.36,0));b.add(cyl(.07,.07,.06,'#f0909e',.48,.33,0,{rz:Math.PI/2},10));for(const sx of [-.15,.15])for(const sz of [-.12,.12])b.add(cyl(.05,.05,.14,'#e88a9a',sx,0,sz,0,6));break;
   case 'goat':b.add(box(.6,.32,.3,'#efe9dc',0,.32,0));b.add(box(.2,.22,.2,'#efe9dc',.36,.58,0));for(const s of [-.06,.06])b.add(cone(.03,.16,'#8a7a60',.32,.7,s,{rz:.5},5));for(const sx of [-.22,.22])for(const sz of [-.1,.1])b.add(cyl(.035,.035,.32,'#6a5a48',sx,0,sz,0,6));break;
   case 'cow':b.add(box(.85,.45,.42,'#f6f2ea',0,.4,0));for(const [dx,dz] of [[-.15,.21],[.2,-.21],[.05,.21]])b.add(box(.22,.2,.02,'#2a2a2a',dx,.5,dz));b.add(box(.26,.26,.28,'#f0e8d8',.52,.62,0));b.add(box(.12,.1,.2,'#ffb0b0',.66,.56,0));for(const s of [-.1,.1])b.add(cone(.03,.1,'#e8e0c0',.5,.8,s,0,5));for(const sx of [-.3,.3])for(const sz of [-.14,.14])b.add(cyl(.05,.05,.4,'#4a3a2a',sx,0,sz,0,6));break;
   case 'sheep':for(let i=0;i<7;i++)b.add(sph(.18,'#fbfaf6',Math.cos(i)*.18,.45+Math.sin(i*2)*.05,Math.sin(i)*.14));b.add(sph(.13,'#2a2a2a',.36,.5,0,{s:[1.2,1,1]}));for(const sx of [-.15,.15])for(const sz of [-.1,.1])b.add(cyl(.035,.035,.3,'#2a2a2a',sx,0,sz,0,6));break;
   default:b.add(sph(.25,'#c8a878',0,.25,0))}
  AN.push({a,g,b})}
 // ----- เตรียมเรนเดอร์ -----
 S.traverse(o=>{if(o.isMesh&&o.castShadow===undefined)o.castShadow=true});S.updateMatrixWorld(true);
 const statics=[];S.traverse(o=>{if(o!==S)statics.push(o)});for(const o of statics){o.matrixAutoUpdate=false}for(const x of AN){x.g.matrixAutoUpdate=true;x.b.matrixAutoUpdate=true}
 S.traverse(o=>{if(o.parent&&o.parent.type==='Group'&&o.type==='Group'&&(o.position.y>2||o.children.length>3))o.matrixAutoUpdate=true});// ใบพัด/มงกุฎมะพร้าว
 // ----- กล้อง -----
 const CAM={th:-.55,ph:.98,r:Math.max(W,H)*1.15,tx:0,ty:0,tz:2,auto:0,idle:0};{let x0=HLOT.x,x1=HLOT.x+HLOT.w,y0=HLOT.y,y1=HLOT.y+HLOT.h;const ex=(x,y)=>{x0=Math.min(x0,x);x1=Math.max(x1,x+1);y0=Math.min(y0,y);y1=Math.max(y1,y+1)};for(const b of HOME.builds){const B=BLD[b.k];if(B){ex(b.x,b.y);ex(b.x+B.w-1,b.y+B.h-1)}}for(const k in HOME.tiles){if(!HOME.tiles[k].till)continue;const [x,y]=k.split(',').map(Number);ex(x,y)}
  CAM.tx=X((x0+x1)/2);CAM.tz=Zc((y0+y1)/2)+1;CAM.span=Math.max(10,x1-x0+2,(y1-y0+2)*1.25);CAM.r=CAM.span*1.15}
 function placeCam(){const r=CAM.r;cam.position.set(CAM.tx+r*Math.sin(CAM.ph)*Math.sin(CAM.th),CAM.ty+r*Math.cos(CAM.ph),CAM.tz+r*Math.sin(CAM.ph)*Math.cos(CAM.th));cam.lookAt(CAM.tx,CAM.ty,CAM.tz)}
 function size(){const w=ov.clientWidth||innerWidth,h=ov.clientHeight||innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(w/h<1.1&&!CAM.fit){CAM.r=CAM.span*1.35*Math.min(2.2,1.25/(w/h));CAM.fit=1}}
 size();const ro=new ResizeObserver(size);ro.observe(ov);
 // ----- ควบคุม -----
 const pts=new Map();let pinch=null,moved=0,down0=null;
 cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId)}catch(_){}pts.set(e.pointerId,[e.clientX,e.clientY]);moved=0;down0=[e.clientX,e.clientY,performance.now()];CAM.idle=0;if(pts.size===2){const [p1,p2]=[...pts.values()];pinch={d:Math.hypot(p1[0]-p2[0],p1[1]-p2[1]),r:CAM.r,mx:(p1[0]+p2[0])/2,my:(p1[1]+p2[1])/2}}});
 cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId),dx=e.clientX-p[0],dy=e.clientY-p[1];pts.set(e.pointerId,[e.clientX,e.clientY]);if(Math.abs(dx)+Math.abs(dy)>1)moved+=Math.abs(dx)+Math.abs(dy);CAM.idle=0;
  if(pts.size===1){CAM.th-=dx*.006;CAM.ph=Math.max(.22,Math.min(1.38,CAM.ph-dy*.005))}
  else if(pts.size===2&&pinch){const [p1,p2]=[...pts.values()],dd=Math.hypot(p1[0]-p2[0],p1[1]-p2[1]);CAM.r=Math.max(6,Math.min(110,pinch.r*pinch.d/Math.max(20,dd)));const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2,k=CAM.r/700;
   const ddx=(mx-pinch.mx)*k,ddy=(my-pinch.my)*k;pinch.mx=mx;pinch.my=my;CAM.tx-=Math.cos(CAM.th)*ddx+Math.sin(CAM.th)*ddy;CAM.tz-=-Math.sin(CAM.th)*ddx+Math.cos(CAM.th)*ddy;CAM.tx=Math.max(-W/2,Math.min(W/2,CAM.tx));CAM.tz=Math.max(-H/2,Math.min(H/2,CAM.tz))}});
 const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(down0&&moved<8&&performance.now()-down0[2]<450&&pts.size===0)tap(e.clientX,e.clientY);down0=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{e.preventDefault();CAM.r=Math.max(6,Math.min(110,CAM.r*(1+Math.sign(e.deltaY)*.1)));CAM.idle=0},{passive:false});
 const rc=new THREE.Raycaster(),v2=new THREE.Vector2();let tipT=0;
 function tap(cx,cy){const rr=cv.getBoundingClientRect();v2.set((cx-rr.left)/rr.width*2-1,-(cy-rr.top)/rr.height*2+1);rc.setFromCamera(v2,cam);const hit=rc.intersectObjects(PICK,true)[0];
  if(hit){let o=hit.object;while(o&&!(o.userData&&o.userData.info))o=o.parent;if(o){tip.hidden=false;tip.textContent=o.userData.info;clearTimeout(tipT);tipT=setTimeout(()=>tip.hidden=true,3500);sfx('ui')}}else tip.hidden=true}
 // ----- ปุ่ม -----
 let night=0;function setNight(n){night=n;ov.classList.toggle('night',!!n);hemi.intensity=n?.35:1.25;hemi.color.set(n?'#8aa0ff':'#f4fbff');sun.intensity=n?.45:2.4;sun.color.set(n?'#9ab4ff':'#fff4dc');amb.intensity=n?.25:.15;for(const m of GLOW)m.emissiveIntensity=n?1.6:(m.color.getHexString()==='7fd0ff'?.5:.15);
  if(n&&!F3.pl){F3.pl=[];for(const [x,y,z] of (F3.lamps||[]).slice(0,8)){const l=new THREE.PointLight('#ffc070',6,7,1.6);l.position.set(x,y,z);S.add(l);F3.pl.push(l)}{const l=new THREE.PointLight('#ffd890',5,9,1.5);l.position.set(X(HLOT.x+3),1.4,Zc(HLOT.y+HLOT.h)+.5);S.add(l);F3.pl.push(l)}}
  if(F3.pl)for(const l of F3.pl)l.visible=!!n;const b=ov.querySelector('[data-a=night]');if(b)b.textContent=n?'☀️ กลางวัน':'🌙 กลางคืน'}
 setNight(dayDark(DAY.t)>.45?1:0);
 ov.querySelector('.f3b').addEventListener('click',e=>{const a=e.target.closest('button');if(!a)return;const k=a.dataset.a;sfx('ui');
  if(k==='x')close3D();else if(k==='rot'){CAM.auto=!CAM.auto;a.textContent=CAM.auto?'⏸ หยุดหมุน':'🔄 หมุนเอง'}else if(k==='night')setNight(night?0:1);
  else if(k==='shot'){try{R.render(S,cam);const u=cv.toDataURL('image/png'),l=document.createElement('a');l.href=u;l.download='eldoria-farm-3d.png';document.body.appendChild(l);l.click();l.remove();say('📸 บันทึกภาพฟาร์ม 3D แล้ว')}catch(err){say('บันทึกภาพไม่ได้บนอุปกรณ์นี้')}}});
 // ----- วนลูป -----
 let last=performance.now(),acc=0;const fpsCap=mob?1000/30:0;
 function loop(now){F3.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);if(fpsCap&&now-last<fpsCap-2)return;last=now;const t=now/1000;
  CAM.idle+=dt;if(CAM.auto||CAM.idle>12)CAM.th+=dt*.08;placeCam();
  for(const f of DYN)f(t);for(const x of AN){const a=x.a;x.g.position.set(a.x/T-W/2,0,a.y/T-H/2);if(a.vx)x.g.rotation.y=a.vx<0?Math.PI:0;if(a.vy&&!a.vx)x.g.rotation.y=a.vy<0?Math.PI/2:-Math.PI/2;x.b.position.y=a.mv?Math.abs(Math.sin(t*9+(a.ph||0)))*.05:0}
  waterM.opacity=.82+Math.sin(t*1.3)*.04;R.render(S,cam)}
 F3.raf=requestAnimationFrame(loop);
 F3.dispose=()=>{try{ro.disconnect()}catch(e){}S.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const m=Array.isArray(o.material)?o.material:[o.material];for(const q of m){if(q.map)q.map.dispose();q.dispose()}}});R.dispose();try{R.forceContextLoss()}catch(e){}F3.pl=null;F3.lamps=null};
 F3.CAM=CAM;F3.stats={meshes:(()=>{let n=0;S.traverse(o=>{if(o.isMesh)n++});return n})(),pick:PICK.length,animals:AN.length};
}
}catch(e){console.warn('fix80',e)}
