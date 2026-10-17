// fix61 (v4.59) — แก้สกิลสไนเปอร์ (ผู้เล่นแจ้งบัค): ระเบิดมือแสงลอยข้ามกำแพงไประเบิดอีกฝั่ง/โดนมอนหลังกำแพง · เรลกันลำแสงยาวทะลุกำแพง (ภาพ)
//   ตอนนี้: ระเบิดตกก่อนถึงกำแพง และไม่โดนมอนที่มีกำแพงคั่น · เรลกันหยุดที่กำแพงทั้งดาเมจและภาพ
try{
const free61=(x,y)=>!(typeof zHit==='function'&&D&&D.zone&&zHit(x,y));
function reach61(x0,y0,dx,dy,max){let d=0;for(;d<max;d+=8){if(!free61(x0+dx*(d+8),y0+dy*(d+8)))break}return d}
const sc61=()=>D;
function later61(ms,fn){const s=sc61();setTimeout(()=>{try{if(P.dead||sc61()!==s)return;fn()}catch(e){console.warn('fix61',e)}},ms)}
const snipe61=()=>{try{const b=B46.buf.snipe;return b&&b.t>0}catch(e){return false}};
const ef61=o=>{o.t=0;if(window.E46)E46.push(o);return o};
if(typeof NEWSK!=='undefined'&&NEWSK.sniper){
 NEWSK.sniper[0]=()=>{const e=near25(300),dv=aimDir(300);let tx=e?e.x:P.x+dv[0]*200,ty=e?e.y:P.y+dv[1]*160;const ddx=tx-P.x,ddy=ty-P.y,dd=Math.hypot(ddx,ddy)||1,r=reach61(P.x,P.y,ddx/dd,ddy/dd,dd);if(r<dd){tx=P.x+ddx/dd*r;ty=P.y+ddy/dd*r}
  const x=tx,y=ty;ef61({k:'nade',x0:P.x,y0:P.y-14,x,y,l:.4});
  later61(400,()=>{eachIn(x,y-6,130,m=>{if(m.dead)return;if(typeof wallBetween7==='function'&&wallBetween7(x,y-6,m.x,m.y-6))return;hurtE(m,1.6,{kb:240,stun:1.2,col:'#fff6c0',fx:x,fy:y})});try{ring25(x,y,'255,250,210',130,.4)}catch(e){}try{flash('#ffffff',.12)}catch(e){}sfx('thud')});sfx('swing')};
 NEWSK.sniper[2]=()=>{P.cast=1.05;ef61({k:'charge',l:1,c:'140,220,255'});sfx('warp');
  later61(1000,()=>{const dv=aimDir(800),m=snipe61()?1.3:1,len=Math.max(40,reach61(P.x,P.y,dv[0],dv[1],800));line25(dv,len,30,e=>{if(!e.dead)hurtE(e,6.0*m,{kb:200,col:'#bff0ff'})});ef61({k:'rail',x:P.x,y:P.y-14,dx:dv[0],dy:dv[1],len,l:.45});try{shake(6,.25)}catch(e){}sfx('thud')})};
}
}catch(e){console.warn('fix61',e)}
