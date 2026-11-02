/* shared: install drawImage hook */
const __hook=()=>{ if(window.__H)return; window.__H=1; const P=CanvasRenderingContext2D.prototype, o=P.drawImage;
 P.drawImage=function(img,...a){ try{ if(window.__cap){ const src=img&&img.src||null; const t=this.getTransform();
   let sx=0,sy=0,sw=img.naturalWidth||img.width,sh=img.naturalHeight||img.height,dx,dy,dw,dh;
   if(a.length===2){[dx,dy]=a;dw=sw;dh=sh}else if(a.length===4){[dx,dy,dw,dh]=a}else{[sx,sy,sw,sh,dx,dy,dw,dh]=a}
   const cv=this.canvas; if(!cv.__id)cv.__id=(window.__cid=(window.__cid||0)+1);
   if(!img.__id&&!src)img.__id=(window.__cid=(window.__cid||0)+1);
   window.__cap.push({c:cv.__id,cw:cv.width,ch:cv.height,src:src?src.replace(location.origin+'/',''):'#'+img.__id+':'+(img.width)+'x'+(img.height),s:[sx,sy,sw,sh].map(v=>Math.round(v*10)/10),d:[dx,dy,dw,dh].map(v=>Math.round(v*10)/10),t:[t.a,t.b,t.c,t.d,t.e,t.f].map(v=>Math.round(v*1000)/1000),al:this.globalAlpha,op:this.globalCompositeOperation}) } }catch(e){}
  return o.call(this,img,...a) } };
const __grid=m=>m.map(r=>r.map(v=>v===undefined?'?':String(v).length>1?'#':String(v)).join('')).join('\n');
__hook();
