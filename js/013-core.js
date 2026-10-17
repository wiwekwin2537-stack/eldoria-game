// ---- 1) สร้างชุดภาพ (tileset) ----
const ts=document.createElement('canvas');ts.width=T*6;ts.height=T;
const g=ts.getContext('2d');
function hash(x,y){let h=Math.sin(x*127.1+y*311.7)*43758.5453;return h-Math.floor(h)}
function base(i,c1,c2){g.fillStyle=c1;g.fillRect(i*T,0,T,T);g.fillStyle=c2;
 for(let k=0;k<14;k++){g.fillRect(i*T+Math.floor(hash(i,k)*30),Math.floor(hash(k,i+9)*30),2,2)}}
base(GRASS,'#5fae4a','#4a9238');
base(WATER,'#3a7bd5','#6aa5ee');
base(SAND,'#e3d28f','#cdb96e');
const oreImg=new Image();oreImg.onload=()=>{g.drawImage(oreImg,ORE*T-1,-1,T+2,T+2);if(typeof Z!=='undefined')try{draw()}catch(e){}};
oreImg.src=ASSETS.ore;
base(DOOR,'#44404a','#38343e');
g.fillStyle='#16131a';g.beginPath();g.arc(DOOR*T+16,22,10,Math.PI,0);g.fillRect(DOOR*T+6,22,20,8);g.fill();
g.strokeStyle='#8a8594';g.lineWidth=2;g.strokeRect(DOOR*T+3,5,26,25);

function makeGrass(v){const c=document.createElement('canvas');c.width=c.height=T;const k=c.getContext('2d');
 const r=i=>hash(v*7.3+i,v*2.9+i*.61);
 const gr=k.createLinearGradient(0,0,0,T);gr.addColorStop(0,'#69b44e');gr.addColorStop(1,'#5aa343');k.fillStyle=gr;k.fillRect(0,0,T,T);
 for(let i=0;i<7;i++){k.fillStyle=r(i)>.5?'rgba(130,200,90,.18)':'rgba(40,110,40,.16)';k.beginPath();k.arc(r(i+10)*T,r(i+20)*T,5+r(i+30)*7,0,7);k.fill()}
 const cols=['#3f8a30','#4c9a3a','#78c25a','#8ed168','#2f7428'];
 for(let i=0;i<70;i++){const bx=r(i+50)*T,by=4+r(i+150)*(T-4),len=3+r(i+250)*4,lean=(r(i+350)-.5)*4;
  k.strokeStyle=cols[Math.floor(r(i+450)*5)];k.lineWidth=1;k.beginPath();k.moveTo(bx,by);k.lineTo(bx+lean,by-len);k.stroke()}
 if(v===3)for(let i=0;i<3;i++){const fx=4+r(i+600)*24,fy=6+r(i+700)*22;k.fillStyle=['#fff','#ffd84a','#ff9ac4'][i];k.fillRect(fx-1,fy,3,1);k.fillRect(fx,fy-1,1,3);k.fillStyle='#f5a000';k.fillRect(fx,fy,1,1)}
 return c}
const grassV=[0,1,2,3].map(makeGrass);
const gv=(x,y)=>{const h=hash(x*1.3,y*.7);return h<.1?3:Math.floor(h*3.4)%3};
function makeTree(seed,hue){const c=document.createElement('canvas');c.width=80;c.height=100;const k=c.getContext('2d');
 const r=i=>hash(seed*3.1+i,seed*1.7+i*.37);
 k.fillStyle='rgba(0,0,0,.28)';k.beginPath();k.ellipse(40,92,24,6,0,0,7);k.fill();
 const gx=k.createLinearGradient(30,0,50,0);gx.addColorStop(0,'#2e2014');gx.addColorStop(.45,'#7a5634');gx.addColorStop(1,'#33241a');
 k.fillStyle=gx;k.beginPath();k.moveTo(29,92);k.quadraticCurveTo(35,86,35,76);k.lineTo(36,52);k.lineTo(45,52);k.lineTo(45,76);k.quadraticCurveTo(45,86,51,92);k.quadraticCurveTo(40,95,29,92);k.fill();
 k.strokeStyle='rgba(30,18,10,.55)';k.lineWidth=1;
 for(let i=0;i<6;i++){const bx=36+r(i)*8;k.beginPath();k.moveTo(bx,60+r(i+9)*10);k.lineTo(bx+(r(i+3)-.5)*3,88);k.stroke()}
 const bl=[];for(let i=0;i<16;i++){const a=r(i+20)*6.283,d=Math.sqrt(r(i+40))*26;bl.push([40+Math.cos(a)*d*1.15,38+Math.sin(a)*d*.95,13+r(i+60)*9])}
 bl.sort((p,q)=>p[1]-q[1]);
 for(const [bx,by,br] of bl){const lit=1-Math.max(0,Math.min(1,(by-18)/40));
  const g2=k.createRadialGradient(bx-br*.35,by-br*.45,br*.1,bx,by,br);
  g2.addColorStop(0,`hsl(${hue+8},55%,${44+lit*14}%)`);g2.addColorStop(.6,`hsl(${hue},50%,${28+lit*10}%)`);g2.addColorStop(1,`hsl(${hue-6},50%,16%)`);
  k.fillStyle=g2;k.beginPath();k.arc(bx,by,br,0,7);k.fill()}
 k.globalCompositeOperation='source-atop';
 for(let i=0;i<150;i++){k.fillStyle=r(i+500)>.5?`hsla(${hue+14},60%,58%,.55)`:`hsla(${hue-8},50%,14%,.5)`;k.fillRect(10+r(i+100)*60,8+r(i+300)*56,2,2)}
 return c}
const treeSpr=[makeTree(1,105),makeTree(2,98),makeTree(3,112)];
// ---- 2) สร้างแมพขนาดใหญ่ ----
function vn(x,y){const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
 const a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const map=[];
for(let y=0;y<H;y++){map[y]=[];for(let x=0;x<W;x++){
 const e=vn(x/7,y/7)*.65+vn(x/3.2,y/3.2)*.35;
 let t=GRASS;if(e<.36)t=WATER;else if(e<.41)t=SAND;
 else{const fo=vn(x/4+40,y/4+40),r=hash(x+5,y+3);if(r<(fo>.55?.34:.05))t=TREE;}
 map[y][x]=t}}
for(let y=3;y<=9;y++)for(let x=3;x<=9;x++)map[y][x]=GRASS;
for(let y=0;y<=3;y++)for(let x=W-7;x<=W-3;x++)map[y][x]=DOOR;
for(let i=0;i<=80;i++){const q=i/80,px=Math.round(6+q*(W-11)),py=Math.round(6+q*(4-6)+Math.sin(i/6)*2);
 for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const yy=py+dy,xx=px+dx;if(yy>3&&yy<H-1&&xx>0&&xx<W-1){const t=map[yy][xx];if(t===TREE||t===ORE)map[yy][xx]=GRASS;else if(t===WATER)map[yy][xx]=SAND}}}
for(let y=4;y<=6;y++)for(let x=W-7;x<=W-3;x++){const t=map[y][x];if(t===TREE||t===ORE||t===WATER)map[y][x]=GRASS}
{const my=H>>1;for(let y=4;y<=my+2;y++)for(let dx=0;dx<2;dx++){const x=W-7+dx,t=map[y][x];if(t===TREE||t===ORE)map[y][x]=GRASS;else if(t===WATER)map[y][x]=SAND}
 for(let y=my-3;y<=my+3;y++)for(let x=W-9;x<=W-2;x++)map[y][x]=GRASS;for(let y=my-1;y<=my+1;y++)map[y][W-1]=TOWNGATE;map[my-2][W-4]=WARP}
const trees=[],treeAt={};let dbg=false;
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(map[y][x]===TREE){
 const rr=hash(x*3.7+1,y*5.1),sz=rr<.2?0:rr<.45?1:rr<.78?2:3;
 const t={id:trees.length+1,tx:x,ty:y,px:x*T+16,py:y*T+16,size:['tiny','small','medium','large'][sz],sc:[.5,.7,.9,1.1][sz],hp:[2,3,5,8][sz],max:[2,3,5,8][sz],wood:[1,2,3,5][sz],fade:0,shake:0,bar:0,alive:true,border:x===0||y===0||x===W-1||y===H-1};
 trees.push(t);treeAt[y*W+x]=t}
