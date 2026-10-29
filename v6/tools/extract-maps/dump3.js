async () => { HOOK
 const sl=ms=>new Promise(r=>setTimeout(r,ms));
 const J=o=>JSON.parse(JSON.stringify(o===undefined?null:o,(k,v)=>v&&v.getContext?undefined:v instanceof HTMLImageElement?undefined:typeof v==='function'?undefined:v instanceof Set?[...v]:v));
 const G=m=>m.map(r=>Array.from({length:r.length},(_,i)=>{const v=r[i];return v===undefined?'?':typeof v==='number'?(v<10?String(v):'#'):String(v)[0]}).join(''));
 const out={OX:typeof OX!=='undefined'?OX:null};
 /* ร้านที่ขาด */
 out.shops={};
 for(const id of ['hall','ware','seal113','gear']){try{try{if(D&&D.shop)leaveShop(true)}catch(e){} try{if(D&&!D.town)exitD()}catch(e){} try{enterTown()}catch(e){}await sl(50);
   if(id==='hall'){enterHall?enterHall():enterShop('hall')}else enterShop(id);await sl(300);
   out.shops[id]={W:dm[0].length,H:dm.length,grid:G(dm),P:[P.x,P.y,P.dir],D:Object.keys(D),shop:D.shop,OX:typeof OX!=='undefined'?OX:null}}catch(e){out.shops[id]='ERR '+e.message}}
 try{if(D&&D.shop)leaveShop(true)}catch(e){}
 out.enterHall=typeof enterHall==='function'?String(enterHall).slice(0,600):null;
 /* ป่า: path/bridge/ores + NAT16 */
 out.nat={};
 for(let zi=5;zi<13;zi++){const Zm=genZone(zi);out.nat[zi]={path:J(Zm.path),bridge:J(Zm.bridge),ores:Zm.ores.map(o=>[o.tx,o.ty,o.kind]),K:G(Zm.K),grid:G(Zm.m)}}
 out.NAT16=J(NAT16);
 /* ถนน */
 out.roadY=[];for(let x=0;x<124;x++){try{out.roadY.push(roadY(x))}catch(e){out.roadY.push(null)}}
 /* เมือง 2 */
 try{C2ART.start();for(let i=0;i<60&&!(C2ART.ready('b')&&C2ART.ready('g'));i++)await sl(250);out.c2ready=C2ART.ready('b')&&C2ART.ready('g');
  C2.Zm=null;window.__cap=[];const g=[];const Zm=C2.alt(g);C2.Zm=Zm;await sl(500);const build=window.__cap;window.__cap=null;
  out.c2={terrain:G(g),grid:G(Zm.m),W:Zm.W,H:Zm.H,cv:Zm.cv.__id,build,occ:J(C2.occ),doors:J(C2.doors)};
  /* เข้าเมือง 2 จริงแล้วแคปเฟรม */
  P.lv=Math.max(P.lv,160);enterCity2('boat');await sl(2500);out.c2.inC2=!!(D&&D.city2);out.c2.P=[P.x,P.y,P.dir];
  out.c2.frames=[];
  if(D&&D.city2){for(let y=6;y<64;y+=12)for(let x=10;x<84;x+=22){P.x=x*T+16;P.y=y*T+16;await sl(350);window.__cap=[];draw();const f=window.__cap;window.__cap=null;out.c2.frames.push({main:ctx.canvas.__id,ops:f.filter(o=>o.c===ctx.canvas.__id)})}}
  out.c2.npcs=J((D.npcs||[]).map(n=>({n:n.name,x:n.x,y:n.y})));
 }catch(e){out.c2err=e.message+' '+e.stack.slice(0,300)}
 return out}
