async () => { HOOK
 const sl=ms=>new Promise(r=>setTimeout(r,ms));
 try{if(D&&!D.town)exitD()}catch(e){} try{enterTown()}catch(e){} await sl(500);
 window.__cap=[]; buildTown(); await sl(800); const build=window.__cap; window.__cap=null;
 const frames=[];
 for(const [x,y] of [[8,6],[22,6],[36,6],[8,17],[22,17],[36,17],[8,28],[22,28],[36,28]]){
   P.x=x*T+16;P.y=y*T+16; for(let i=0;i<40;i++){try{cam&&0}catch(e){}} await sl(400);
   window.__cap=[]; draw(); const f=window.__cap; window.__cap=null;
   frames.push({cam:J0(window.LASTCAM),Z:typeof Z!=='undefined'?Z:1,RES:RES,main:ctx.canvas.__id,ops:f}) }
 return {dcv:dcv.__id,build,frames}
}
