/* v5.95 🖱️ คลิกเดิน · คลิกมอนตีมอน — เฉพาะเล่นบนคอม (เจ้าของสั่ง 2026-10-25)
   - คลิกซ้ายที่พื้น → เดินไปจุดนั้นเอง (หาทางเลี่ยงสิ่งกีดขวางแบบ BFS ด้วย hit() ตัวเดียวกับการเดินจริง)
   - คลิกซ้ายที่มอน → เดินเข้าไปใกล้แล้วตีปกติเอง จนมอนตาย (ยิงไกล = ยืนยิงในระยะ 170 · ระยะประชิด 28 เหมือนฟาร์มออโต้)
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
function stop(){CM.goal=CM.tgt=CM.path=null;CM.ix=CM.iy=0;CM.stk=0}
CM.stop=stop;
function toWorld(e){const r=cv.getBoundingClientRect(),c=window.LASTCAM||[0,0];return [c[0]+(e.clientX-r.left)*(VW/r.width)/Z,c[1]+(e.clientY-r.top)*(VH/r.height)/Z]}
CM.toWorld=toWorld;
function mark(x,y,c){try{for(let i=0;i<10;i++){const a=i/10*Math.PI*2;fx.push({x:x+Math.cos(a)*6,y:y+Math.sin(a)*3,vx:Math.cos(a)*28,vy:Math.sin(a)*14,l:.35,c})}}catch(e){}}
function onClick(e){if(e.button!==0||!titleEl.hidden||PAUSED||P.dead)return;e.preventDefault();
 const [wx,wy]=toWorld(e);
 try{if(typeof AUTO!=='undefined'&&AUTO.on)autoToggle(false)}catch(err){}
 let m=null,bd=30;for(const o of mobs()){if(!alive(o))continue;const d=Math.hypot(o.x-wx,(o.y-12)-wy);if(d<bd){bd=d;m=o}}
 stop();
 if(m){CM.tgt=m;mark(m.x,m.y,'255,90,70')}
 else{CM.goal={x:wx,y:wy};mark(wx,wy,'255,230,140')}
 CM.repath=0}
CM.click=onClick;
const inRange=d=>d<=(isRng()?170:28);
function atk(){const si=interact;interact=function(){return false};try{attack(true)}finally{interact=si}}
CM.tick=function(dt){CM.ix=CM.iy=0;if(!CM.goal&&!CM.tgt)return;
 if(P.dead||!titleEl.hidden){stop();return}
 if(keys.l||keys.r||keys.u||keys.d||(JOY.on&&(JOY.x||JOY.y))||(typeof AUTO!=='undefined'&&AUTO.on)){stop();return}
 let tx,ty;
 if(CM.tgt){const m=CM.tgt;if(!alive(m)||mobs().indexOf(m)<0){stop();return}
  const dx=m.x-P.x,dy=m.y-P.y,d=Math.hypot(dx,dy)||1;
  if(inRange(d)){P.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d');if(P.at<0&&P.stun<=0){if(P.tool!=='sword'&&P.armor&&P.armor.sword){P.tool='sword';P.draw=true}atk()}CM.path=null;CM.stk=0;return}
  if(d<60&&!isRng()){CM.ix=dx/d;CM.iy=dy/d;return}
  tx=m.x;ty=m.y}
 else{tx=CM.goal.x;ty=CM.goal.y;if(Math.hypot(tx-P.x,ty-P.y)<6){stop();return}}
 CM.repath-=dt;if(!CM.path||CM.repath<=0){CM.path=pathTo(Math.floor(tx/T),Math.floor(ty/T));CM.repath=CM.tgt?.4:1.5}
 const p=CM.path;while(p.length&&Math.floor(P.x/T)===p[0][0]&&Math.floor(P.y/T)===p[0][1])p.shift();
 let nx,ny;if(p.length){nx=p[0][0]*T+16;ny=p[0][1]*T+18}else{nx=tx;ny=ty}
 const q=Math.hypot(nx-P.x,ny-P.y)||1;CM.ix=(nx-P.x)/q;CM.iy=(ny-P.y)/q;
 /* เดินชนอะไรอยู่นาน หรือไปไม่ถึง → หยุด */
 const mv=Math.hypot(P.x-CM.lx,P.y-CM.ly);CM.lx=P.x;CM.ly=P.y;if(P.at<0&&mv<.3){CM.stk+=dt;if(CM.stk>1.2){if(!p.length&&CM.goal)stop();else{CM.path=null;if(CM.stk>2.5)stop()}}}else CM.stk=0};
/* เดิม: คลิกจอ = ฟันอยู่กับที่ (cv.onpointerdown=attack) → คลิกเดิน/คลิกตี */
cv.onpointerdown=onClick;
})();
if(window.REG136)REG136.push(['คอม: คลิกพื้นเดินไปเอง · คลิกมอนเดินไปตี · มือถือไม่เปลี่ยน (v595)',()=>{const C=window.CLICK594;if(!C)return'ไม่มีระบบคลิกเดิน';if(!C.on)return null;
 if(cv.onpointerdown!==C.click)return'คลิกจอยังเป็นฟันอยู่กับที่';if(typeof C.tick!=='function')return'ไม่มีตัวเดินตามคลิก';return null}]);
