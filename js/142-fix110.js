// fix110 (v4.94) — 🤖 ฟาร์มออโต้รุ่นใหม่ (เจ้าของขอ 2026-10-14 20:56: "โจมตีเดินไม่ติด ตีมอนเอง ใช้สกิลเอง ฟาร์มไม้หินเอง")
//  ต่อยอดระบบเดิม AUTO/autoTick (ปุ่ม 🤖 · ปุ่ม O) ไม่ได้สร้างระบบใหม่คู่ขนาน — ห่อ autoTick ทับ
//  - เดินไม่ติด: หาเส้นทางแบบ BFS บนช่องที่เดินได้ (ใช้ hit() ตัวเดียวกับการเดินจริง) รอบตัว 26 ช่อง · เลือกเป้าที่ "เดินไปถึงได้" และใกล้สุดตามระยะเดินจริง
//  - ตีมอนเอง (+เลือกได้ว่าตีบอสด้วย) · ใช้สกิลเอง (เช็กปลดล็อก/คูลดาวน์/มานา/อาวุธก่อนกด ไม่สแปมข้อความ)
//  - ตัดไม้/ขุดแร่เอง: ในแมพ (D.zone.ores) และทุ่งหญ้า (map TREE/ORE) · สลับขวาน/ที่ขุดเอง · ข้ามต้นไม้/แร่ที่เครื่องมือยังไม่ถึงขั้น
//  - ไม่มีอะไรใกล้ ๆ → เดินสำรวจหาเอง · ดื่มยาเลือด/มานาเอง · เหนื่อยแล้วพัก (ของเดิม) · กระเป๋าเต็มหยุด (ของเดิม)
//  - (ปรับ v4.97) แตะ 🤖 = เปิด/ปิดทันทีตามค่าที่ตั้งไว้ · ปุ่ม ⚙️ ใต้ 🤖 = หน้าตั้งค่า (เกมไม่หยุด) · ใช้สกิลครบ 6 ช่อง + อัลติเมท
try{
const CF={mob:1,boss:0,skill:1,wood:1,ore:1,pot:1};try{Object.assign(CF,JSON.parse(localStorage.getItem('fm_auto110')||'{}')||{})}catch(e){}
const svCF=()=>{try{localStorage.setItem('fm_auto110',JSON.stringify(CF))}catch(e){}};window.AUTO110=CF;
const A2={path:null,pt:0,goal:null,gk:'',wand:null,wandT:0,skT:0,stk:0,lx:0,ly:0,ban:new Map(),dbg:''};window.A2_110=A2;
const R110=26;// รัศมีค้นหา (ช่อง)
const gate110=(tx,ty)=>{if(D||typeof TOWNGATE==='undefined')return false;for(let y=ty-1;y<=ty+1;y++)for(let x=tx-1;x<=tx+1;x++)if(map[y]&&map[y][x]===TOWNGATE)return true;return false};// ทุ่งหญ้า: ห้ามเดินเข้าใกล้ประตูเมือง (เหยียบแล้ววาร์ปเข้าเมือง)
const walk110=(tx,ty)=>{try{return !hit(tx*T+16,ty*T+18)&&!gate110(tx,ty)}catch(e){return false}};
// BFS รอบตัวผู้เล่น → แผนที่ระยะ + พ่อของแต่ละช่อง
function bfs110(){const sx=Math.floor(P.x/T),sy=Math.floor(P.y/T),N=R110*2+1,dist=new Int16Array(N*N).fill(-1),par=new Int32Array(N*N).fill(-1);
 const id=(x,y)=>(y-sy+R110)*N+(x-sx+R110),inR=(x,y)=>Math.abs(x-sx)<=R110&&Math.abs(y-sy)<=R110;
 const q=[sx,sy];dist[id(sx,sy)]=0;let h=0;const wk=new Map();const W=(x,y)=>{const k=x+','+y;let v=wk.get(k);if(v===undefined){v=walk110(x,y);wk.set(k,v)}return v};
 while(h<q.length){const x=q[h++],y=q[h++],d=dist[id(x,y)];for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ax,ny=y+ay;if(!inR(nx,ny))continue;const j=id(nx,ny);if(dist[j]>=0)continue;if(!W(nx,ny))continue;dist[j]=d+1;par[j]=id(x,y);q.push(nx,ny)}}
 return {sx,sy,N,dist,par,id,inR,W,last:q.length?[q[q.length-2],q[q.length-1]]:[sx,sy]}}
// ระยะเดินไปยังช่อง (ถ้าช่องตัน เช่น ต้นไม้/แร่ → ใช้ช่องข้าง ๆ ที่ไปถึงได้)
function reach110(B,tx,ty,solid){if(!B.inR(tx,ty))return null;if(!solid){const d=B.dist[B.id(tx,ty)];return d>=0?{d,x:tx,y:ty}:null}
 let best=null;for(const [ax,ay] of [[0,1],[1,0],[-1,0],[0,-1]]){const x=tx+ax,y=ty+ay;if(!B.inR(x,y))continue;const d=B.dist[B.id(x,y)];if(d>=0&&(!best||d<best.d))best={d,x,y}}return best}
function pathTo110(B,x,y){const L=[];let j=B.id(x,y);const st=B.id(B.sx,B.sy);let g=0;while(j>=0&&j!==st&&g++<2000){L.push(j);j=B.par[j]}L.reverse();return L.map(k=>[B.sx-R110+k%B.N,B.sy-R110+Math.floor(k/B.N)])}
// ---------- เป้าหมาย ----------
function mobs110(){if(D&&D.zone)return D.mobs||[];if(!D&&typeof slimes!=='undefined')return slimes;if(D&&D.mobs&&!D.town&&!D.shop&&!D.home)return D.mobs;return []}
function gathers110(){const L=[];const okT=k=>{const K=OREK[k];if(!K)return false;return K.tree?(P.tier.axe!=null&&P.tier.axe>=(K.req|0)):(P.tier.pick!=null&&P.tier.pick>=(K.req|0))};
 if(D&&D.zone){for(const o of D.zone.ores){if(!o.alive)continue;const K=OREK[o.kind];if(!K)continue;const tree=!!K.tree;if(tree?!CF.wood:!CF.ore)continue;if(!okT(o.kind))continue;L.push({o,x:o.x,y:o.y,tx:o.tx!=null?o.tx:Math.floor(o.x/T),ty:o.ty!=null?o.ty:Math.floor(o.y/T),tree,z:1})}}
 else if(!D&&typeof map!=='undefined'){const sx=Math.floor(P.x/T),sy=Math.floor(P.y/T);for(let y=sy-R110;y<=sy+R110;y++){const row=map[y];if(!row)continue;for(let x=sx-R110;x<=sx+R110;x++){const t=row[x];if(t===TREE&&CF.wood&&P.tier.axe!=null)L.push({x:x*T+16,y:y*T+16,tx:x,ty:y,tree:true,ow:1});else if(t===ORE&&CF.ore&&P.tier.pick!=null)L.push({x:x*T+16,y:y*T+16,tx:x,ty:y,tree:false,ow:1})}}}
 return L}
function pick110(B){const now=performance.now();let best=null,bs=1e9;
 if(CF.mob){for(const m of mobs110()){if(m.dead||m.hp<=0||(m.boss&&!CF.boss)||A2.ban.get(m)>now)continue;const r=reach110(B,Math.floor(m.x/T),Math.floor(m.y/T),false)||reach110(B,Math.floor(m.x/T),Math.floor(m.y/T),true);if(!r)continue;const s=r.d;if(s<bs){bs=s;best={k:'mob',m,x:m.x,y:m.y,to:r}}}}
 if(best&&bs<=14)return best;// มีมอนใกล้ ๆ ตีมอนก่อน
 for(const g of gathers110()){const key=g.tx+','+g.ty;if(A2.ban.get(key)>now)continue;const r=reach110(B,g.tx,g.ty,true);if(!r)continue;const s=r.d+4;if(s<bs){bs=s;best={k:g.tree?'tree':'ore',g,x:g.x,y:g.y,to:r,key}}}
 return best}
// ---------- ใช้สกิล ----------
function skill110(dist){if(!CF.skill||P.cls==='none'||performance.now()<A2.skT)return;A2.skT=performance.now()+250;
 /* fix142: เดิมไล่ช่อง 6→1 (ท่าแรงก่อน) แต่ช่อง 4–6 คูลดาวน์ยาว/มีเงื่อนไข ออโต้เลยรอนานไม่ลื่น + ไม่เคยกดฮีล
    → ตอนนี้: เลือดต่ำกว่า 55% กดฮีลก่อน (💚 เยียวยา / สกิลฮีลอาชีพ) · ไล่ช่อง 1-2-3 ก่อน (ลื่นเหมือนเดิม) แล้วค่อย 4-5-6 ตอน 1-3 ติดคูลดาวน์ */
 const L=CSKILLS[P.cls]||[],bar=(typeof barOf==='function'?barOf():[0,1,2,3]).slice(0,6);
 try{if(P.hp<BAL.hp*.55){const hb=gid('sk4');if(hb&&hb.style.display!=='none'&&SK.own[2]&&P.mp>=15){const n0=P.mp;hb.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));if(P.mp<n0)return}
   for(const i of bar){const S=L[i];if(!S||!/รักษา|ฟื้นฟู|เยียวยา|ฮีล/.test(S.n+' '+(S.d||'')))continue;if(skOwned(i)&&!((CS.cd[i]||0)>0)&&P.mp>=cskMp(S,0)){try{useSkill(i)}catch(e){}if((CS.cd[i]||0)>0)return}}}}catch(e){}
 try{if(dist<=(isRng()?220:110)&&typeof ULT!=='undefined'&&ULT.v>=100&&!ULT.cast){castUlt();return}}catch(e){}// อัลติเมทเต็ม = ใช้เลย
 for(const i of bar){const S=L[i];if(!S)continue;if(/วาร์ป/.test(S.n))continue;/* สกิลวาร์ปล้วน ๆ ไม่ใช้ตอนออโต้ (เดิมวาร์ปมั่วทั้งแมพ) */try{if(!skOwned(i))continue;if((CS.cd[i]||0)>0)continue;if(P.cls!=='none'&&wKind()!==NEEDW[P.cls])return;const mp=cskMp(S,0);if(P.mp<mp)continue;}catch(e){continue}
  if(dist>(isRng()?220:90))continue;const nw=performance.now();A2.fl=A2.fl||{};if(A2.fl[i]>nw)continue;const mp0=P.mp;try{useSkill(i)}catch(e){}if((CS.cd[i]||0)<=0&&P.mp>=mp0){A2.fl[i]=nw+3000;continue}return}}
// ตีโดยไม่ไปกด "คุย/ใช้" ของที่อยู่ใกล้ (ป้ายประตูแมพ/NPC) — เดิม attack() เรียก interact() ก่อน ทำให้ออโต้ไปเปิดเมนูประตูแมพค้าง
function atk110(){const si=interact;interact=function(){return false};try{attack(true)}finally{interact=si}}
// ---------- ติ๊กหลัก ----------
const _old=autoTick;
autoTick=function(dt){AUTO.ix=AUTO.iy=0;if(!AUTO.on||P.dead||PAUSED)return;
 if(D&&(D.town||D.shop||D.city2)){autoToggle(false);say('🤖 ฟาร์มออโต้ใช้ได้เฉพาะนอกเมือง');return}
 AUTO.pt-=dt;
 if(CF.pot&&AUTO.pt<=0){if(P.hp<BAL.hp*.45&&inv.hpp>0){useItem('hpp');AUTO.pt=1.2}else if(P.mp<BAL.mp*.2&&inv.mpp>0){useItem('mpp');AUTO.pt=1.2}}
 if(P.hp<BAL.hp*.18&&!(inv.hpp>0)){autoToggle(false);say('🤖 เลือดใกล้หมดและไม่มียา — หยุดออโต้แล้ว ถอยก่อน!');return}
 if(P.hu<15&&AUTO.pt<=0){try{eatAny()}catch(e){}AUTO.pt=1.5}
 if(bagCells().length>=bagSlotsMax()){autoToggle(false);say('🤖 กระเป๋าเต็ม — หยุดฟาร์มออโต้');return}
 if(P.fa<12)AUTO.rest=true;if(AUTO.rest){if(P.fa>=60)AUTO.rest=false;else return}
 const now=performance.now();for(const [k,v] of A2.ban)if(v<now)A2.ban.delete(k);
 // คำนวณเส้นทางใหม่ทุก 0.35 วิ
 A2.pt-=dt;let G=A2.goal;
 if(A2.pt<=0||!G||(G.k==='mob'&&(G.m.dead||G.m.hp<=0))||(G.g&&G.g.o&&!G.g.o.alive)){A2.pt=.35;const B=bfs110();G=pick110(B);
  if(G){A2.path=pathTo110(B,G.to.x,G.to.y);A2.wand=null;if(A2.goal&&G.k!==A2.goal.k)A2.stk=0}
  else{// เดินสำรวจหาเป้าใหม่ — มีมอนเกิดใหม่หรือของอื่นนอกรัศมี
   if(!A2.wand||now>A2.wandT){const far=[];for(let k=0;k<60;k++){const x=B.sx+((Math.random()*2-1)*R110|0),y=B.sy+((Math.random()*2-1)*R110|0);if(B.inR(x,y)&&B.dist[B.id(x,y)]>=8)far.push([x,y])}A2.wand=far[0]||B.last;A2.wandT=now+9000}
   A2.path=pathTo110(B,A2.wand[0],A2.wand[1])}
  A2.goal=G}
 // ดูดของที่ตกใกล้ ๆ ก่อน (ไม่ตีอยู่)
 if(!G||G.k!=='mob'||Math.hypot(G.x-P.x,G.y-P.y)>110){let bd=G&&G.k==='mob'?70:150,dr=null;for(const d of drops){if(window.dropOK7&&!dropOK7(d))continue;const q=Math.hypot(d.x-P.x,d.y-P.y);if(q<bd){bd=q;dr=d}}if(dr&&bd>8){AUTO.ix=(dr.x-P.x)/bd;AUTO.iy=(dr.y-P.y)/bd;return}}
 // ถึงระยะทำงานหรือยัง
 if(G){const dx=G.x-P.x,dy=G.y-P.y,d=Math.hypot(dx,dy)||1;
  if(G.k==='mob'){const rng=isRng()?170:28;skill110(d);
   if(d<=rng){P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');if(P.at<0&&P.stun<=0){if(P.tool!=='sword'&&P.armor.sword){P.tool='sword';P.draw=true}atk110()}A2.stk=0;return}
   if(d<70&&isRng()===false){AUTO.ix=dx/d;AUTO.iy=dy/d;return}}
  else{// ตัดไม้ / ขุดแร่: ยืนช่องข้าง ๆ แล้วหันเข้าหา
   const g=G.g,atTile=Math.floor(P.x/T)===G.to.x&&Math.floor(P.y/T)===G.to.y,near=G.k==='tree'&&g.z&&Math.hypot(g.x-P.x,g.y-P.y)<40;
   if(atTile||near){const cx=G.to.x*T+16,cy=G.to.y*T+16;if(!near&&Math.hypot(cx-P.x,cy-P.y)>5){const q=Math.hypot(cx-P.x,cy-P.y);AUTO.ix=(cx-P.x)/q;AUTO.iy=(cy-P.y)/q;return}
    const ex=g.tx-G.to.x,ey=g.ty-G.to.y;P.dir=Math.abs(ex)>=Math.abs(ey)?(ex<0?'l':'r'):(ey<0?'u':'d');if(near&&!atTile)P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');
    const tool=G.k==='tree'?'axe':'pick';if(P.tool!==tool){P.tool=tool;P.draw=true;try{QS.cur=tool}catch(e){}}
    if(P.at<0&&P.stun<=0){P.at=0;atkId++;try{sfx('swing2')}catch(e){}}
    A2.stk+=dt;if(A2.stk>14){A2.ban.set(G.key,now+30000);A2.goal=null;A2.stk=0}return}}}
 // เดินตามเส้นทาง
 const p=A2.path;if(p&&p.length){while(p.length&&Math.floor(P.x/T)===p[0][0]&&Math.floor(P.y/T)===p[0][1])p.shift();
  const n=p[0]||(G?[Math.floor(G.x/T),Math.floor(G.y/T)]:null);if(n){const cx=n[0]*T+16,cy=n[1]*T+18,q=Math.hypot(cx-P.x,cy-P.y)||1;AUTO.ix=(cx-P.x)/q;AUTO.iy=(cy-P.y)/q}}
 else if(G){const q=Math.hypot(G.x-P.x,G.y-P.y)||1;AUTO.ix=(G.x-P.x)/q;AUTO.iy=(G.y-P.y)/q}
 // ติดอยู่กับที่นาน → แบนเป้านี้ชั่วคราว
 const mv=Math.hypot(P.x-A2.lx,P.y-A2.ly);A2.lx=P.x;A2.ly=P.y;if((AUTO.ix||AUTO.iy)&&P.at<0&&mv<.3){A2.stk+=dt;if(A2.stk>1.6){if(G)A2.ban.set(G.k==='mob'?G.m:G.key,now+8000);A2.goal=null;A2.wand=null;A2.stk=0;A2.pt=0}}else if(mv>=.3)A2.stk=0};
window.autoTick=autoTick;
// ---------- หน้าตั้งค่า ----------
const W110=mk6('au110');
const css=document.createElement('style');css.textContent='#au110 .w{width:min(440px,96%);height:auto;max-height:95%}#au110 .bd{display:block!important;padding:10px 14px;overflow:auto}#au110 label span{flex:1;text-align:left}#au110 label b{display:block}#au110 label{display:flex;align-items:center;gap:10px;padding:6px 12px;margin-bottom:5px;border-radius:10px;background:#1a1426;border:1px solid #e8c14a33;font-size:14px}#au110 input{width:22px;height:22px;accent-color:#e8c14a}#au110 small{display:block;color:#aaa;font-size:11px}#au110 .go110{display:block;width:100%;margin-top:8px;padding:13px;border:0;border-radius:12px;font-weight:900;font-size:16px;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}';document.head.appendChild(css);
const OPT110=[['mob','⚔️ ตีมอนเอง','เดินหามอนที่ไปถึงได้ใกล้สุด'],['boss','👑 ตีบอสด้วย','ปิดไว้ = เลี่ยงบอส'],['skill','✨ ใช้สกิลเอง','กดสกิลในแถบลัดเมื่อพร้อมและมานาพอ'],['wood','🪓 ตัดไม้เอง','ต้องมีขวานที่ถึงขั้นต้นไม้นั้น'],['ore','⛏️ ขุดแร่/หินเอง','ต้องมีที่ขุดแร่ที่ถึงขั้นแร่นั้น'],['pot','🧪 ดื่มยาเอง','เลือดต่ำกว่า 45% / มานาต่ำกว่า 20%']];
window.open110=()=>{W110.innerHTML='<div class="w"><div class="hd"><b>🤖 ฟาร์มออโต้</b><button onclick="p6close(gid(\'au110\'))">✕</button></div><div class="bd"><button class="go110" style="margin:0 0 8px" onclick="p6close(gid(\'au110\'));PAUSED=false;autoToggle(true)">▶️ เริ่มฟาร์มออโต้</button><small style="margin-bottom:8px">เลือกสิ่งที่จะให้ทำเอง แล้วกดเริ่ม · ใช้ได้นอกเมือง · แตะ 🤖 อีกครั้ง = หยุด · ขยับเองได้ตลอด</small>'
 +OPT110.map(([k,t,s])=>'<label><input type="checkbox" '+(CF[k]?'checked':'')+' onchange="AUTO110.'+k+'=this.checked?1:0;sv110()"><span><b>'+t+'</b><small>'+s+'</small></span></label>').join('')
 +'</div></div>';p6open(W110);PAUSED=false};
window.sv110=svCF;
// v4.97: แตะ 🤖 = เปิด/ปิดทันที (ไม่ต้องผ่านหน้าตั้งค่า) · ปุ่ม ⚙️ ใต้ 🤖 = หน้าตั้งค่า (ไม่หยุดเกม)
autoB.onclick=()=>autoToggle();
{const g=document.createElement('button');g.id='autog110';g.textContent='⚙️';g.title='ตั้งค่าฟาร์มออโต้';gid('wrap').appendChild(g);g.onclick=e=>{e.stopPropagation();open110()};
 const st=document.createElement('style');st.textContent='#autog110{position:absolute;right:calc(8px + var(--sr));top:calc(222px + var(--st));width:30px;height:26px;font-size:14px;padding:0;background:rgba(0,0,0,.5);color:#fff;border:1.5px solid #e8c14a;border-radius:8px;z-index:3}@media (max-height:520px){#autog110{right:calc(7px + var(--sr));top:calc(163px + var(--st));width:30px;height:22px;font-size:12px}}';document.head.appendChild(st)}
{const _t=autoToggle;autoToggle=function(f){const r=_t.apply(this,arguments);A2.goal=null;A2.path=null;A2.wand=null;A2.pt=0;if(!AUTO.on&&P.tool!=='sword'&&P.armor&&P.armor.sword){P.tool='sword';P.draw=true}return r};window.autoToggle=autoToggle}
}catch(e){console.warn('fix110',e)}
