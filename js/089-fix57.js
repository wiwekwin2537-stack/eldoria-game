// fix57 (v4.58) — ท่าสกิล (fix55) ย้ายไปวาดที่ตัวละคร (heroBody) → ผู้เล่นอื่นเห็นท่าสกิลของเราด้วย (ส่งผ่าน sx k:'fx' ฟิลด์ ps)
//   และแก้: ท่าของเราไม่ไปขยับตัวผู้เล่นอื่นอีก (เดิม fix55 ห่อ hero ทั้งก้อน)
try{
const DUR57={jabs:.62,palm:.5,bigpunch:.85,slash:.32,slash3:.42,overhead:.55,spin:.6,thrust:.55,stomp:.55,dive:.8,cast:.5,castup:.6,shoot:.32,throw:.35,guard:.5,dash:.3};
const ME57={k:null,t0:0,l:0,dir:'r',seed:0,cls:''};
const Q57=[];
function start57(k){if(!DUR57[k])return;Object.assign(ME57,{k,t0:performance.now(),l:DUR57[k],dir:P.dir,seed:Math.random()*9,cls:P.cls});if(Q57.length<4)Q57.push([k,P.dir])}
// ให้ fix55 ส่งท่ามาที่นี่ แทนการวาดเอง (POSE55.k อ่านได้เป็น null เสมอ → hero ของ fix55 ไม่ทำอะไร)
try{if(window.POSE55)Object.defineProperty(POSE55,'k',{configurable:true,get(){return null},set(v){if(v)start57(v)}})}catch(e){}
setInterval(()=>{try{if(!Q57.length)return;if(!(NET&&NET.on&&NET.others&&NET.others.size)){Q57.length=0;return}const q=Q57.splice(0);netSend({t:'sx',k:'fx',v:[],p:[],e:[],ps:q[q.length-1]})}catch(e){}},60);
{const _o=onSx33;onSx33=function(d){try{if(d&&d.k==='fx'&&Array.isArray(d.ps)&&d.sc===netScene()){const o=NET.others.get(d.from),k=String(d.ps[0]);if(o&&DUR57[k])o.ps57={k,t0:performance.now(),l:DUR57[k],dir:['l','r','u','d'].includes(d.ps[1])?d.ps[1]:'d',seed:Math.random()*9,cls:o.cls||''}}}catch(e){}return _o(d)};window.onSx33=onSx33}
const DV57={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]};
const ease57=u=>u<0?0:u>1?1:u*u*(3-2*u);
function bodyOff57(st){const k=st.k;if(!k)return[0,0];const u=st.t/st.l,[dx,dy]=DV57[st.dir]||[1,0],s=st.seed;
 switch(k){case'jabs':{const j=Math.sin(st.t*44)*1.4;return[dx*(2+j),dy*(2+j)-Math.abs(dx)*1]}
  case'palm':{const f=u<.35?-4*ease57(u/.35):-4+14*ease57((u-.35)/.25)-6*Math.max(0,(u-.6)/.4);return[dx*f,dy*f+(u<.35?2*ease57(u/.35):0)]}
  case'bigpunch':{const f=u<.5?-5*ease57(u/.5):-5+16*ease57((u-.5)/.12)-11*Math.max(0,(u-.62)/.38);return[dx*f+(u<.5?Math.sin(st.t*60)*.8:0),dy*f+(u<.5?2:0)]}
  case'thrust':{const ph=(u*3)%1,f=Math.sin(ph*Math.PI)*7;return[dx*f,dy*f]}
  case'stomp':{const h=Math.sin(Math.min(1,u/.75)*Math.PI)*20;return[0,-h]}
  case'dive':{const h=u<.55?Math.sin(u/.55*Math.PI/2)*38:38*(1-ease57((u-.55)/.2));return[dx*u*10,-Math.max(0,h)]}
  case'overhead':{const h=u<.4?-ease57(u/.4)*8:-8+8*ease57((u-.4)/.2);return[dx*(u>.4?5:0),h]}
  case'slash':case'slash3':return[dx*Math.sin(u*Math.PI)*6,dy*Math.sin(u*Math.PI)*6];
  case'cast':return[0,-Math.sin(u*Math.PI)*3];case'castup':return[0,-Math.sin(u*Math.PI)*5];
  case'shoot':return[-dx*Math.max(0,Math.sin((u-.3)*Math.PI*1.4))*4,-dy*Math.max(0,Math.sin((u-.3)*Math.PI*1.4))*4];
  case'throw':return[dx*Math.sin(u*Math.PI)*5,dy*Math.sin(u*Math.PI)*5];
  case'guard':return[0,Math.sin(Math.min(1,u*3)*Math.PI/2)*3];case'dash':return[dx*Math.sin(u*Math.PI)*6,0]}return[0,0]}
const SKIN57='#f0c8a0';
function fist57(x,y,r,a,glove){ctx.save();ctx.globalAlpha=a;ctx.fillStyle=glove||SKIN57;ctx.strokeStyle='#3a2414';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(60,30,10,.6)';ctx.lineWidth=1;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(x-r*.55,y+i*r*.38);ctx.lineTo(x+r*.55,y+i*r*.38);ctx.stroke()}
 ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.arc(x-r*.35,y-r*.4,r*.32,0,7);ctx.fill();ctx.restore()}
function arm57(x0,y0,x1,y1,a,col){ctx.save();ctx.globalAlpha=a;ctx.lineCap='round';ctx.strokeStyle='#1a1a22';ctx.lineWidth=6.5;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=4.5;ctx.stroke();ctx.restore()}
function star57(x,y,r,a,c){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.strokeStyle=c||'#fff6d0';ctx.lineWidth=2;for(let i=0;i<8;i++){const an=i*Math.PI/4,r1=i%2?r*.45:r;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*.25,y+Math.sin(an)*r*.25);ctx.lineTo(x+Math.cos(an)*r1,y+Math.sin(an)*r1);ctx.stroke()}ctx.restore()}
function arc57(cx,cy,r,a0,a1,w,a,col){ctx.save();ctx.globalCompositeOperation='lighter';const n=10;for(let i=0;i<n;i++){const t0=a0+(a1-a0)*i/n,t1=a0+(a1-a0)*(i+1)/n;ctx.globalAlpha=a*(i+1)/n;ctx.strokeStyle=col;ctx.lineWidth=w*(i+1)/n;ctx.lineCap='round';ctx.beginPath();ctx.arc(cx,cy,r,t0,t1,a1<a0);ctx.stroke()}ctx.restore()}
function overlay57(st,ox,oy){const k=st.k,u=st.t/st.l,[dx,dy]=DV57[st.dir]||[1,0],px=-dy,py=dx,x=P.x+ox,y=P.y+oy,sh=y-25,t=st.t;let EC={TOP:'#262631'};try{EC=EQCOL()}catch(e){}
 const front=st.dir!=='u',ang=Math.atan2(dy,dx);
 if(k==='jabs'||k==='palm'||k==='bigpunch'){const glove=P.cls==='monk'?'#e8b44a':SKIN57;
  if(k==='jabs'){const rate=16,n=Math.floor(t*rate),ph=t*rate-n;
   for(let back=3;back>=0;back--){const m=n-back;if(m<0)continue;const p=back?1:ph,ext=Math.sin(Math.min(1,p)*Math.PI*.5+(back?0:0)),side=(m%2?1:-1)*5,jit=((m*37+st.seed*10)%7-3)*1.2;
    const sx=x+px*side,sy=sh+py*side*.4,fx=sx+dx*(8+20*ext)+px*jit*.3,fy=sy+dy*(8+16*ext)+jit*.5;const a=back?.22/back:1;
    if(!back)arm57(sx,sy,fx-dx*3,fy-dy*3,a,EC.TOP);fist57(fx,fy,back?4:4.8,a,glove);
    if(!back&&ph>.55&&ph<.85)star57(fx+dx*6,fy+dy*6,7,1-(ph-.55)/.3)}
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,240,200,.35)';ctx.lineWidth=1;for(let i=0;i<5;i++){const o=((i*13+n*7)%20)-10;ctx.beginPath();ctx.moveTo(x+dx*10+px*o,sh+dy*8+py*o*.5+o*.3);ctx.lineTo(x+dx*34+px*o,sh+dy*26+py*o*.5+o*.3);ctx.stroke()}ctx.restore()}
  else if(k==='palm'){const st=u<.35?0:Math.min(1,(u-.35)/.2),fx=x+dx*(6+26*ease57(st)),fy=sh+2+dy*(6+20*ease57(st));arm57(x,sh+2,fx-dx*3,fy-dy*3,1,EC.TOP);
   ctx.save();ctx.fillStyle=SKIN57;ctx.strokeStyle='#3a2414';ctx.lineWidth=1.4;ctx.translate(fx,fy);ctx.rotate(ang);ctx.beginPath();ctx.ellipse(0,0,5,7,0,0,7);ctx.fill();ctx.stroke();for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(3,i*2.6);ctx.lineTo(7.5,i*2.8);ctx.stroke()}ctx.restore();
   if(st>=1){const w=(u-.55)/.45;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(150,230,255,'+(1-w)+')';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(fx+dx*8,fy+dy*8,6+w*26,12+w*30,ang,-1.2,1.2);ctx.stroke();ctx.restore()}}
  else{const ch=u<.5,fx=ch?x-dx*8+px*4:x+dx*(10+30*ease57(Math.min(1,(u-.5)/.12))),fy=ch?sh+3-dy*6:sh+dy*(8+24*ease57(Math.min(1,(u-.5)/.12)));const r=ch?5+u*4:8;
   arm57(x+px*4,sh,fx-dx*4,fy-dy*4,1,EC.TOP);if(ch){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(fx,fy,0,fx,fy,10+u*28);g.addColorStop(0,'rgba(255,220,120,.9)');g.addColorStop(1,'rgba(255,120,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(fx,fy,10+u*28,0,7);ctx.fill();ctx.restore()}
   fist57(fx,fy,r,1,glove);if(!ch&&u<.8){star57(fx+dx*10,fy+dy*10,16+(u-.5)*40,1-(u-.5)/.3,'#ffe08a');ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5*(1-(u-.5)/.3);ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.ellipse(fx+dx*20,fy+dy*20,14,22,ang,0,7);ctx.fill();ctx.restore()}}}
 else if(k==='slash'||k==='slash3'||k==='overhead'||k==='spin'){const col=P.cls==='paladin'?'rgba(255,240,170,.95)':P.cls==='ninja'?'rgba(255,90,120,.95)':'rgba(200,225,255,.95)';
  if(k==='spin'){const a0=t*22;arc57(x,y-14,30,a0,a0+3.6,7,(1-u)*.9+.1,col)}
  else if(k==='overhead'){const s=u<.4?0:Math.min(1,(u-.4)/.18);if(s>0)arc57(x+dx*8,y-16,30,ang-Math.PI*.9,ang-Math.PI*.9+Math.PI*1.0*ease57(s),9,1-Math.max(0,(u-.6)/.4),col)}
  else{const ph=k==='slash3'?(u*3)%1:u,sgn=k==='slash3'&&Math.floor(u*3)%2?-1:1;arc57(x+dx*6,y-14+dy*4,26,ang-sgn*1.3,ang-sgn*1.3+sgn*2.6*ease57(ph),7,1-ph*.6,col)}}
 else if(k==='thrust'){const ph=(u*3)%1,e=Math.sin(ph*Math.PI),tx=x+dx*(10+34*e),ty=sh+4+dy*(8+26*e);ctx.save();ctx.lineCap='round';ctx.strokeStyle='#5a3418';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(tx-dx*40,ty-dy*40);ctx.lineTo(tx,ty);ctx.stroke();
   ctx.fillStyle='#e8eef8';ctx.strokeStyle='#3a4050';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tx+dx*9,ty+dy*9);ctx.lineTo(tx-py*3,ty+px*3);ctx.lineTo(tx+py*3,ty-px*3);ctx.closePath();ctx.fill();ctx.stroke();
   if(e>.7){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(200,230,255,'+(e-.7)*3+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx-dx*30,ty-dy*30);ctx.lineTo(tx+dx*14,ty+dy*14);ctx.stroke()}ctx.restore()}
 else if(k==='stomp'||k==='dive'){const land=k==='stomp'?.75:.75;if(u>land){const w=(u-land)/(1-land);ctx.save();ctx.globalAlpha=1-w;ctx.strokeStyle='rgba(200,170,120,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(P.x,P.y,10+w*44,4+w*16,0,0,7);ctx.stroke();
   for(let i=0;i<8;i++){const an=i*.785+st.seed;ctx.fillStyle='rgba(150,120,80,.8)';ctx.fillRect(P.x+Math.cos(an)*(12+w*34),P.y+Math.sin(an)*(4+w*12)-w*10,3,3)}ctx.restore()}
   else{ctx.save();ctx.globalAlpha=.35;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(P.x,P.y,12-Math.min(8,-oy/5),4,0,0,7);ctx.fill();ctx.restore()}}
 else if(k==='cast'||k==='castup'){const up=k==='castup',col=P.cls==='necro'?'130,255,170':P.cls==='cleric'?'255,240,180':P.cls==='summoner'?'150,255,200':P.cls==='archer'?'180,255,200':'190,160,255',e=Math.sin(Math.min(1,u*1.6)*Math.PI*.5);
   for(const s of [-1,1]){const hx=x+s*(7+3*e)+(up?0:dx*8*e),hy=sh-(up?14*e:4*e)+(up?0:dy*6*e);arm57(x+s*4,sh+2,hx,hy,1,EC.TOP);fist57(hx,hy,3.4,1,SKIN57);
    ctx.save();ctx.globalCompositeOperation='lighter';const R=6+4*Math.sin(t*20),g=ctx.createRadialGradient(hx,hy,0,hx,hy,R*1.8);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.4,'rgba('+col+',.8)');g.addColorStop(1,'rgba('+col+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(hx,hy,R*1.8,0,7);ctx.fill();ctx.restore()}
   ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const q=((t*1.6+i/6)%1),an=i*1.05+st.seed;ctx.fillStyle='rgba('+col+','+(1-q)+')';ctx.fillRect(x+Math.cos(an)*14*(1-q),y-4-q*40,2.2,2.2)}ctx.restore()}
 else if(k==='shoot'){const pull=u<.3?u/.3:1-Math.min(1,(u-.3)/.15);if(u>.3&&u<.6){star57(x+dx*24,sh+3+dy*18,8,1-(u-.3)/.3,'#fff3c0')}}
 else if(k==='throw'){const e=Math.sin(Math.min(1,u*1.6)*Math.PI*.5),a0=ang-2.2,a1=a0+2.6*e;arc57(x,sh+2,18,a0,a1,4,1-u*.7,'rgba(230,230,255,.8)');const hx=x+Math.cos(a1)*18,hy=sh+2+Math.sin(a1)*18;arm57(x,sh+1,hx,hy,1,EC.TOP);fist57(hx,hy,3.6,1,SKIN57)}
 else if(k==='guard'){const e=Math.min(1,u*4);for(const s of [-1,1]){const hx=x+s*5+dx*9*e,hy=sh+1+dy*6*e;arm57(x+s*5,sh+2,hx,hy,1,EC.TOP);fist57(hx,hy,3.8,1,P.cls==='monk'?'#e8b44a':SKIN57)}
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,230,160,'+(.6*(1-u))+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(x,y-18,18+u*12,26+u*12,0,0,7);ctx.stroke();ctx.restore()}
 else if(k==='dash'){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(220,235,255,'+(1-u)*.6+')';ctx.lineWidth=2;for(let i=0;i<4;i++){const o=(i-1.5)*6;ctx.beginPath();ctx.moveTo(x-dx*10+px*o,y-16+o*.4);ctx.lineTo(x-dx*40+px*o,y-16+o*.4);ctx.stroke()}ctx.restore()}}

{const _do=drawOther;drawOther=function(o){window.CUR57=o;try{return _do.apply(this,arguments)}finally{window.CUR57=null}};window.drawOther=drawOther}
function stNow57(src){if(!src||!src.k)return null;const t=(performance.now()-src.t0)/1000;if(t<0||t>=src.l)return null;return {k:src.k,t,l:src.l,dir:src.dir,seed:src.seed}}
{const _hb=heroBody;heroBody=function(){let st=null;try{if(window.__IN_OTHER8){const o=window.CUR57;st=o&&!o.dead?stNow57(o.ps57):null}else if(!P.dead&&!(window.MOUNT&&MOUNT.on))st=stNow57(ME57)}catch(e){}
 if(!st)return _hb.apply(this,arguments);
 let ox=0,oy=0;try{[ox,oy]=bodyOff57(st)}catch(e){}const back=st.dir==='u',d0=P.dir;
 try{if(back)overlay57(st,ox,oy)}catch(e){}
 if(st.k==='spin'){const seq=['d','r','u','l'];P.dir=seq[Math.floor(st.t*14)%4]}
 ctx.save();ctx.translate(ox,oy);try{_hb.apply(this,arguments)}finally{ctx.restore();P.dir=d0}
 try{if(!back)overlay57(st,ox,oy)}catch(e){}};window.heroBody=heroBody}
}catch(e){console.warn('fix57',e)}
