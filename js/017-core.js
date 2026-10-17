let spN=0;
// ---- สไลม์กระโดดดึ๋ง ----
let atkId=0,respT=5;const slimes=[],fx=[];
function spawn(){for(let i=0;i<200;i++){const tx=2+Math.floor(hash(spN*3.1+i,7.7)*(W-4)),ty=2+Math.floor(hash(spN*5.3+i,2.2)*(H-4));
 if(map[ty][tx]===GRASS&&Math.hypot(tx-6,ty-6)>8&&Math.hypot(tx*T-P.x,ty*T-P.y)>200){
  slimes.push({lv:Math.max(1,Math.min(5,Math.ceil((W-tx)/12))),x:tx*T+16,y:ty*T+16,hp:2+Math.max(1,Math.min(5,Math.ceil((W-tx)/12))),t:Math.random()*.9,dx:0,dy:0,kx:0,ky:0,hurt:0,last:-1,cool:0});spN++;return}}}
for(let i=0;i<16;i++)spawn();
function mvS(s,dx,dy){if(!hit(s.x+dx,s.y))s.x+=dx;if(!hit(s.x,s.y+dy))s.y+=dy}
function updSlimes(dt){
 const v=DIRV[P.dir],SPN=P.cmb===2&&P.tool==='sword',ax=SPN?P.x:P.x+v[0]*26,ay=SPN?P.y-14:P.y-8+v[1]*26,atk=P.tool==='sword'&&!(typeof isRng!=='undefined'&&isRng())&&(SPN?(P.at>.12&&P.at<.88):(P.at>.2&&P.at<.7));
 for(const s of slimes){
  if(!s.lv){s.lv=4;s.hp=Math.max(s.hp,6)}
  const prev=s.t%.9;s.t+=dt;const cyc=s.t%.9;if(prev<.7&&cyc>=.7&&Math.hypot(s.x-P.x,s.y-P.y)<240)sfx('hop');
  if(cyc<prev){const ddx=P.x-s.x,ddy=P.y-s.y,dist=Math.hypot(ddx,ddy)||1;
   if(dist<170){s.dx=ddx/dist;s.dy=ddy/dist}else if(Math.random()<.7){const a=Math.random()*6.283;s.dx=Math.cos(a);s.dy=Math.sin(a)}else s.dx=s.dy=0}
  if(cyc>=.3&&cyc<.7)mvS(s,s.dx*70*dt,s.dy*70*dt);
  if(s.kx||s.ky){mvS(s,s.kx*dt,s.ky*dt);const d=Math.pow(.02,dt);s.kx*=d;s.ky*=d;if(Math.abs(s.kx)+Math.abs(s.ky)<4)s.kx=s.ky=0}
  s.hurt=Math.max(0,s.hurt-dt);s.cool=Math.max(0,(s.cool||0)-dt);
  if(P.iframe<=0&&cyc>=.3&&s.cool<=0&&s.hurt<=0&&Math.hypot(s.x-P.x,s.y-P.y)<20)hurtPlayer(s);
  if(atk&&s.last!==atkId&&Math.hypot(s.x-ax,s.y-ay)<(SPN?50:34)){s.last=atkId;{const cr=Math.random()<.08+P.stats.agi*.004,dm=Math.max(1,Math.round(ATK()*(.9+Math.random()*.2)*(cr?1.8+(window.CRITD?CRITD():0):1)));if(!s.max)s.max=s.hp;s.hp-=dm;if(window.dmgTxt)dmgTxt(s.x,s.y-26,(cr?'💥':'')+dm,cr?'#ffd84a':'#fff',cr)}s.hurt=.25;sfx('hit');
   const d=Math.hypot(s.x-P.x,s.y-P.y)||1;s.kx=(s.x-P.x)/d*240;s.ky=(s.y-P.y)/d*240;
   if(s.hp<=0){s.dead=true;sfx('splat');dropLoot(s.x,s.y,s);document.getElementById('msg').textContent='สไลม์แตก!';
    for(let i=0;i<10;i++)fx.push({x:s.x,y:s.y-8,vx:(Math.random()-.5)*120,vy:-40-Math.random()*80,l:.6})}}
 }
 for(let i=slimes.length-1;i>=0;i--)if(slimes[i].dead)slimes.splice(i,1);
 if(!D&&slimes.length<16&&(respT-=dt)<=0){spawn();respT=6}
 for(let i=fx.length-1;i>=0;i--){const p=fx[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;if(p.l<=0)fx.splice(i,1)}
}
function drawSlime(s){const cyc=s.t%.9;let sy=1,z=0;
 if(cyc<.3)sy=1-.22*(cyc/.3);else if(cyc<.7){const u=(cyc-.3)/.4;z=Math.sin(u*Math.PI)*16;sy=1+.16*Math.sin(u*Math.PI)}
 else{const u=Math.min(1,(cyc-.7)/.2);sy=.78+.22*u}
 const sx=1+(1-sy)*.9,px=Math.round(s.x),py=Math.round(s.y),k=1-z/50;
 ctx.fillStyle='rgba(0,0,0,'+(.28*k)+')';ctx.beginPath();ctx.ellipse(px,py+1,13*k,4*k,0,0,7);ctx.fill();
 ctx.save();ctx.translate(px,py-z);ctx.scale(sx,sy);const h=s.hurt>0;
 const gr=ctx.createRadialGradient(-4,-15,2,0,-9,16);
 gr.addColorStop(0,h?'#fff':'#c9e8ff');gr.addColorStop(.5,h?'#ffd0d0':'#4aa8ff');gr.addColorStop(1,h?'#ff8080':'#2a5fc4');
 ctx.fillStyle=gr;ctx.strokeStyle='rgba(15,45,110,.85)';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(-13,0);ctx.bezierCurveTo(-15,-14,-8,-21,0,-21);ctx.bezierCurveTo(8,-21,15,-14,13,0);ctx.quadraticCurveTo(0,3,-13,0);ctx.fill();ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.ellipse(-5,-15,3.5,2,-.5,0,7);ctx.fill();
 ctx.fillStyle='#0b1e4a';ctx.fillRect(-6,-10,3,4);ctx.fillRect(3,-10,3,4);ctx.fillStyle='#fff';ctx.fillRect(-5,-10,1,1);ctx.fillRect(4,-10,1,1);
 ctx.restore();
 if(s.hp<3){ctx.fillStyle='#000a';ctx.fillRect(px-10,py-34,20,3);ctx.fillStyle='#e44';ctx.fillRect(px-10,py-34,20*s.hp/3,3)}}
