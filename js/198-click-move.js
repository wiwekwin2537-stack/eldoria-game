/* v5.95 🖱️ คลิกเดิน · คลิกมอนตีมอน — เฉพาะเล่นบนคอม (เจ้าของสั่ง 2026-10-25)
   - คลิกซ้ายที่พื้น → เดินไปจุดนั้นเอง (หาทางเลี่ยงสิ่งกีดขวางแบบ BFS ด้วย hit() ตัวเดียวกับการเดินจริง)
   - คลิกซ้ายที่มอน → เดินเข้าไปใกล้แล้วตีปกติเอง จนมอนตาย (ยิงไกล = อยู่ในระยะยิง 280 และมองเห็น → ยิงทันทีไม่ต้องเดิน · ประชิด 28)
   - v5.96 คลิกประตู/ร้าน/แผง/NPC/ทางออกแมพ → เดินไปถึงแล้วกด "ใช้" ให้เอง (interact() ตัวเดียวกับปุ่ม E) · คลิก NPC = เดินตาม NPC ที่เดินอยู่
   - v5.96 ยิง/สกิล ล็อกเป้ามอนที่คลิกเอง และตอนฟาร์มออโต้ล็อกเป้ามอนของออโต้ — ไม่วิ่งตามเมาส์ (เดิม fix5 เล็งตามเมาส์ 4 วิหลังขยับเมาส์)
   - กดปุ่มเดิน (WASD/ลูกศร) หรือคลิกจุดใหม่ = ยกเลิกทันที · เปิดฟาร์มออโต้อยู่แล้วคลิก = ปิดออโต้ ให้ผู้เล่นคุมเอง
   - มือถือ/จอสัมผัส (COARSE) ไม่เปลี่ยนอะไร · เดิมบนคอม "คลิกจอ = ฟันอยู่กับที่" (026-core/031-core) → แทนด้วยคลิกเดิน/คลิกตี
   - ไม่แตะดาเมจ ความเร็ว คูลดาวน์ ดรอป XP: ตีผ่าน attack() เดิม · เดินผ่าน ix/iy ในลูปหลัก (070-core frame) เหมือนกดปุ่มเดิน */
(function(){
const fine=!(typeof COARSE!=='undefined'&&COARSE)&&!(window.matchMedia&&matchMedia('(pointer: coarse)').matches&&!matchMedia('(any-pointer: fine)').matches);
const CM={on:fine,ix:0,iy:0,goal:null,tgt:null,path:null,lx:0,ly:0,stk:0,repath:0,mark:null};window.CLICK594=CM;
if(!fine)return;
const R=30;
const gate=(tx,ty)=>{if(D||typeof TOWNGATE==='undefined')return false;for(let y=ty-1;y<=ty+1;y++)for(let x=tx-1;x<=tx+1;x++)if(map[y]&&map[y][x]===TOWNGATE)return true;return false};
const walk=(tx,ty)=>{try{return !hit(tx*T+16,ty*T+18)&&!gate(tx,ty)}catch(e){return false}};
function mobs(){try{if(D&&D.zone)return D.mobs||[];if(!D&&typeof slimes!=='undefined')return slimes;if(D&&D.mobs&&!D.town&&!D.shop&&!D.home)return D.mobs}catch(e){}return []}
const alive=m=>m&&!m.dead&&m.hp>0;
/* BFS รอบตัว → เส้นทางไปช่องเป้า (หรือช่องเดินได้ที่ใกล้เป้าที่สุด) */
function pathTo(gx,gy){const sx=Math.floor(P.x/T),sy=Math.floor(P.y/T),N=R*2+1,id=(x,y)=>(y-sy+R)*N+(x-sx+R),inR=(x,y)=>Math.abs(x-sx)<=R&&Math.abs(y-sy)<=R;
 const par=new Int32Array(N*N).fill(-2),q=[sx,sy];par[id(sx,sy)]=-1;let h=0,best=[sx,sy],bd=Math.hypot(gx-sx,gy-sy);
 while(h<q.length){const x=q[h++],y=q[h++];const dd=Math.hypot(gx-x,gy-y);if(dd<bd){bd=dd;best=[x,y]}if(x===gx&&y===gy)break;
  for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ax,ny=y+ay;if(!inR(nx,ny))continue;const j=id(nx,ny);if(par[j]!==-2||!walk(nx,ny))continue;par[j]=id(x,y);q.push(nx,ny)}}
 const L=[];let j=id(best[0],best[1]);let g=0;while(j>=0&&par[j]!==-1&&g++<4000){L.push([sx-R+j%N,sy-R+Math.floor(j/N)]);j=par[j]}L.reverse();return L}
function stop(){CM.goal=CM.tgt=CM.npc=CM.path=null;CM.ix=CM.iy=0;CM.stk=0}
CM.stop=stop;
function toWorld(e){const r=cv.getBoundingClientRect(),c=window.LASTCAM||[0,0];return [c[0]+(e.clientX-r.left)*(VW/r.width)/Z,c[1]+(e.clientY-r.top)*(VH/r.height)/Z]}
CM.toWorld=toWorld;
function mark(x,y,c){try{for(let i=0;i<10;i++){const a=i/10*Math.PI*2;fx.push({x:x+Math.cos(a)*6,y:y+Math.sin(a)*3,vx:Math.cos(a)*28,vy:Math.sin(a)*14,l:.35,c})}}catch(e){}}
function onClick(e){if(e.button!==0||!titleEl.hidden||PAUSED||P.dead)return;e.preventDefault();
 const [wx,wy]=toWorld(e);
 try{if(typeof AUTO!=='undefined'&&AUTO.on)autoToggle(false)}catch(err){}
 let m=null,bd=30;for(const o of mobs()){if(!alive(o))continue;const d=Math.hypot(o.x-wx,(o.y-12)-wy);if(d<bd){bd=d;m=o}}
 let n=null;if(!m&&D&&D.npcs){let nd=24;for(const o of D.npcs){const d=Math.hypot(o.x-wx,(o.y-20)-wy);if(d<nd){nd=d;n=o}}}
 stop();
 if(m){CM.tgt=m;mark(m.x,m.y,'255,90,70')}
 else if(n){CM.npc=n;CM.goal={x:n.x,y:n.y,use:1};mark(n.x,n.y,'140,220,255')}
 else{CM.goal={x:wx,y:wy,use:1};mark(wx,wy,'255,230,140')}
 CM.repath=0}
CM.click=onClick;
const inRange=(d,m)=>isRng()?d<=280&&(typeof LOS9!=='function'||LOS9(P.x,P.y-4,m.x,m.y-4)):d<=28;
/* ถึงที่หมาย → หันหน้าเข้าจุดที่คลิก แล้วกด "ใช้" (เหมือนปุ่ม E แต่ไม่ฟันลม ถ้าไม่มีอะไรให้ใช้) */
function use(){const g=CM.goal;stop();if(!g)return;const dx=g.x-P.x,dy=g.y-P.y;if(Math.hypot(dx,dy)>3)P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');try{interact()}catch(e){}}
CM.use=use;
function atk(){const si=interact;interact=function(){return false};try{attack(true)}finally{interact=si}}
CM.tick=function(dt){CM.ix=CM.iy=0;if(!CM.goal&&!CM.tgt)return;
 if(P.dead||!titleEl.hidden){stop();return}
 if(keys.l||keys.r||keys.u||keys.d||(JOY.on&&(JOY.x||JOY.y))||(typeof AUTO!=='undefined'&&AUTO.on)){stop();return}
 let tx,ty;
 if(CM.tgt){const m=CM.tgt;if(!alive(m)||mobs().indexOf(m)<0){stop();return}
  const dx=m.x-P.x,dy=m.y-P.y,d=Math.hypot(dx,dy)||1;
  if(inRange(d,m)){P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');if(P.at<0&&P.stun<=0){if(P.tool!=='sword'&&P.armor&&P.armor.sword){P.tool='sword';P.draw=true}atk()}CM.path=null;CM.stk=0;return}
  if(d<60&&!isRng()){CM.ix=dx/d;CM.iy=dy/d;return}
  tx=m.x;ty=m.y}
 else{if(CM.npc){CM.goal.x=CM.npc.x;CM.goal.y=CM.npc.y}tx=CM.goal.x;ty=CM.goal.y;const gd=Math.hypot(tx-P.x,ty-P.y);
  if(gd<(CM.npc?30:6)){if(CM.goal.use)use();else stop();return}}
 CM.repath-=dt;if(!CM.path||CM.repath<=0){CM.path=pathTo(Math.floor(tx/T),Math.floor(ty/T));CM.repath=CM.tgt?.4:1.5}
 const p=CM.path;while(p.length&&Math.floor(P.x/T)===p[0][0]&&Math.floor(P.y/T)===p[0][1])p.shift();
 let nx,ny;if(p.length){nx=p[0][0]*T+16;ny=p[0][1]*T+18}else{nx=tx;ny=ty}
 const q=Math.hypot(nx-P.x,ny-P.y)||1;CM.ix=(nx-P.x)/q;CM.iy=(ny-P.y)/q;
 /* เดินชนอะไรอยู่นาน หรือไปไม่ถึง → หยุด */
 const mv=Math.hypot(P.x-CM.lx,P.y-CM.ly);CM.lx=P.x;CM.ly=P.y;if(P.stun>0||(window.DOORA&&DOORA.k)){CM.stk=0;return}if(P.at<0&&mv<.3){CM.stk+=dt;/* เดินต่อไม่ได้แต่ใกล้ของที่คลิกแล้ว (เช่น ประตูอาคาร) → ใช้ตรงนี้ */if(CM.stk>.5&&!p.length&&CM.goal&&CM.goal.use&&Math.hypot(tx-P.x,ty-P.y)<72){use();return}if(CM.stk>1.2){if(!p.length&&CM.goal)stop();else{CM.path=null;if(CM.stk>2.5)stop()}}}else CM.stk=0};
/* ยิง/สกิลล็อกเป้า: มอนที่คลิก > มอนของฟาร์มออโต้ · ออโต้ไม่เล็งตามเมาส์ · ลากเล็งสกิล (SKILLAIM46) ยังชนะทุกอย่าง */
{const _ad=aimDir;aimDir=function(range){if(window.SKILLAIM46&&SKILLAIM46.cast)return _ad(range);let m=null;const au=typeof AUTO!=='undefined'&&AUTO.on;
 if(alive(CM.tgt))m=CM.tgt;else if(au){const g=window.A2_110&&A2_110.goal;if(g&&g.k==='mob'&&alive(g.m))m=g.m}
 if(m){const dx=m.x-P.x,dy=(m.y-10)-(P.y-14),d=Math.hypot(dx,dy);if(d>1&&d<=(range||300)+60){P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');return[dx/d,dy/d]}}
 if(au&&window.MS9){const t=MS9.t;MS9.t=-9e9;try{return _ad(range)}finally{MS9.t=t}}return _ad(range)};window.aimDir=aimDir}
/* เดิม: คลิกจอ = ฟันอยู่กับที่ (cv.onpointerdown=attack) → คลิกเดิน/คลิกตี */
cv.onpointerdown=onClick;
})();
if(window.REG136)REG136.push(['คอม: คลิกพื้นเดินไปเอง · คลิกมอนเดินไปตี · คลิกประตู/NPC ใช้ให้ · ยิงล็อกเป้า · มือถือไม่เปลี่ยน (v595/v596)',()=>{const C=window.CLICK594;if(!C)return'ไม่มีระบบคลิกเดิน';if(!C.on)return null;
 if(cv.onpointerdown!==C.click)return'คลิกจอยังเป็นฟันอยู่กับที่';if(typeof C.tick!=='function')return'ไม่มีตัวเดินตามคลิก';if(typeof C.use!=='function')return'คลิกแล้วใช้ประตู/NPC ไม่ได้';return null}]);
