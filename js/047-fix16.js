// fix16.js (v4.24) — แยกโซนแบบเดินต่อกัน: เมือง → ทุ่งหญ้า(ป่าแมพแรก) → ซ้าย: ป่าหมอกโบราณ · บนสุด: หุบเขาภูเขาไฟ → ถ้ำเงามืด
// แมพป่าใหม่มีเฉพาะต้นไม้ + มอนประจำแมพ · เหมืองแร่มีแค่แร่ (ไม่มีประตูมิติในเหมืองแล้ว)
// =====================================================================
// ---------- 1) เนื้อหาแมพ: ต้นไม้ล้วน ----------
{const S=id=>NZ15.find(q=>q.id===id);
 S('mist').ores=[['treeE',1]];
 S('volcano').ores=[['treeF',.75],['treeE',.25]];
 S('shadow').ores=[['treeS',.75],['treeF',.25]];
 // ประตูมิติในเหมืองถูกยกเลิก · ถ้ำเงามืดไปต่อจากหุบเขาภูเขาไฟ (ทางเหนือสุด)
 S('mist').gateIn=-1;S('volcano').gateIn=-1;S('shadow').gateIn=NZI15.volcano;
 for(const id of ['mist','volcano','shadow'])delete ZCACHE[NZI15[id]];}
// ประตูไปถ้ำเงามืด: ตั้งไว้ทางเหนือของหุบเขา (ห่างวงบอส)
gateOf15=function(Zm){if(Zm.gate15!==undefined)return Zm.gate15;const nz=NZ15.find(q=>ZONES[q.gateIn]&&ZONES[q.gateIn].id===Zm.Zd.id);if(!nz)return Zm.gate15=null;
 let best=null,bd=1e9;const tx=Math.round(ZW*.16),ty=4;for(const [x,y] of Zm.floor){if(Zm.oreAt[y*ZW+x])continue;if(Math.hypot(x-Zm.arena.x,y-Zm.arena.y)<10)continue;let ok=true;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(!Zm.m[y+b]||Zm.m[y+b][x+a]!==FL)ok=false;if(!ok)continue;const d=Math.hypot(x-tx,y-ty);if(d<bd){bd=d;best=[x,y]}}
 return Zm.gate15=best?{x:best[0]*T+16,y:best[1]*T+16,nz}:null};
// ---------- 2) เมนูประตูมิติในทุ่ง = เฉพาะเหมืองแร่ ----------
{const _oz=openZMenu;openZMenu=function(){_oz();try{for(const b of [...shopEl.querySelectorAll('button.zbtn')]){const m=/enterZone\((\d+)\)/.exec(b.getAttribute('onclick')||'')||/ผ่านประตูมิติ/.exec(b.getAttribute('onclick')||'');
   const txt=b.textContent||'';if(NZ15.some(q=>txt.indexOf(q.n)>=0))b.remove()}
  const h=shopEl.querySelector('b');if(h)h.textContent='⛏️ ประตูมิติ — เลือกเหมืองแร่';
  shopEl.insertAdjacentHTML('beforeend','<small style="opacity:.85">🌲 แมพป่าใหม่ไม่อยู่ในประตูมิติ — เดินออกขอบซ้ายของทุ่งหญ้า (ป่าหมอกโบราณ) หรือขอบบนสุด (หุบเขาภูเขาไฟ)</small>')}catch(e){}}}
// ---------- 3) ทางออกขอบทุ่งหญ้า ----------
const EX16=(()=>{const ok=(tx,ty)=>tx>=0&&ty>=0&&tx<W&&ty<H&&!hit(tx*T+16,ty*T+16);
 const seen=new Uint8Array(W*H),q=[[ZG.tx,ZG.ty]];seen[ZG.ty*W+ZG.tx]=1;const R=[];
 while(q.length){const [x,y]=q.pop();R.push([x,y]);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(a<0||b<0||a>=W||b>=H||seen[b*W+a])continue;seen[b*W+a]=1;if(ok(a,b))q.push([a,b])}}
 const pick=(key,tgt)=>{let best=null,bs=1e9;for(const [x,y] of R){const s=key(x,y)*6+Math.abs(tgt(x,y));if(s<bs){bs=s;best=[x,y]}}return best};
 const has=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&seen[y*W+x]&&ok(x,y);
 const mk=(dir,id,c)=>{const s=dir==='w'?pick((x,y)=>x,(x,y)=>y-(H>>1)):pick((x,y)=>y,(x,y)=>x-(W>>1));if(!s)return null;
  const ix=dir==='w'?1:0,iy=dir==='n'?1:0;let r=[s[0],s[1]];for(let k=3;k>0;k--)if(has(s[0]+ix*k,s[1]+iy*k)){r=[s[0]+ix*k,s[1]+iy*k];break}
  return {dir,id,c,tx:s[0],ty:s[1],x:s[0]*T+16,y:s[1]*T+16,ret:[r[0]*T+16,r[1]*T+16]}};
 return {L:[mk('w','mist',['rgba(150,255,210,','#9af0c8']),mk('n','volcano',['rgba(255,120,40,','#ff9a5a'])].filter(Boolean),cd:0,msgT:0,busy:false}})();
const ex16Z=e=>NZ15.find(q=>q.id===e.id);
function ex16Go(e,fromZone){const nz=ex16Z(e);if(!nz)return;if(P.lv<nz.ulv){if(performance.now()-EX16.msgT>2200){EX16.msgT=performance.now();say('🔒 '+nz.e+' '+nz.n+' — ต้อง Lv.'+nz.ulv+' ก่อนจึงเดินผ่านได้');sfx('thud')}return}
 if(EX16.busy)return;EX16.busy=true;
 LoadingScreenManager.cover({icon:nz.e,title:nz.n,tip:'แมพป่า — มีต้นไม้ประจำแมพให้ตัดด้วยขวาน · มอนประจำแมพดรอปไม้และวัตถุดิบหายาก'},()=>{try{if(D)exitD()}catch(_){}try{enterZone(NZI15[nz.id]);if(D&&D.zone)D.ret=e.ret.slice();say(nz.e+' '+nz.n+' (Lv.'+nz.lv[0]+'-'+nz.lv[1]+') · ตัดต้นไม้ด้วยขวาน · ทางกลับอยู่ที่วงเวทด้านล่าง')}catch(_){}EX16.busy=false;EX16.cd=performance.now()+2500})}
const ex16Near=(r)=>{if(D)return null;for(const e of EX16.L)if(Math.hypot(P.x-e.x,P.y-e.y)<(r||40))return e;return null};
{const _it=interact;interact=function(){const e=ex16Near(46);if(e){ex16Go(e);return true}
  // ประตูสู่ถ้ำเงามืดในหุบเขาภูเขาไฟ
  try{const g=gateNear15();if(g){const nz=g.nz;if(P.lv<nz.ulv){say('🔒 ทางสู่ '+nz.n+' ยังปิดผนึก — ต้อง Lv.'+nz.ulv);sfx('thud');return true}
   const n=EX16.L.find(q=>q.id==='volcano');ex16Go({id:nz.id,ret:n?n.ret:[ZG.x,ZG.y+40]});return true}}catch(_){}
  return _it()}}
// เดินชนขอบ = ข้ามแมพอัตโนมัติ · วาดป้าย/ทางเดิน
{const _h=hero;hero=function(){try{if(!D&&!window.__IN_OTHER8){const t=performance.now()/1000;
   for(const e of EX16.L){const nz=ex16Z(e),open=P.lv>=nz.ulv,x=e.x,y=e.y;ctx.save();ctx.globalAlpha=1;
    // ทางเดินหมอก/แสงเรือง
    ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,44);g.addColorStop(0,e.c[0]+(open?.42:.16)+')');g.addColorStop(1,e.c[0]+'0)');ctx.fillStyle=g;ctx.fillRect(x-44,y-44,88,88);
    for(let i=0;i<5;i++){const a=t*.8+i*1.3,px=x+Math.cos(a)*18*(e.dir==='w'?.6:1),py=y+Math.sin(a*1.4)*14;ctx.fillStyle=e.c[0]+(open?.7:.25)+')';ctx.beginPath();ctx.arc(px,py,1.8,0,7);ctx.fill()}
    {const bw=e.dir==='w'?14:96,bh=e.dir==='w'?96:14,bx=e.dir==='w'?x-16:x-48,by=e.dir==='w'?y-48:y-16,gl=e.dir==='w'?ctx.createLinearGradient(bx,0,bx+bw*2.4,0):ctx.createLinearGradient(0,by,0,by+bh*2.4);gl.addColorStop(0,e.c[0]+(open?.55+Math.sin(t*3)*.12:.18)+')');gl.addColorStop(1,e.c[0]+'0)');ctx.fillStyle=gl;ctx.fillRect(bx,by,e.dir==='w'?bw*2.4:bw,e.dir==='w'?bh:bh*2.4)}
    ctx.globalCompositeOperation='source-over';
    // ป้ายไม้ + ลูกศร
    const sx=x+(e.dir==='w'?14:-16),sy=y+6;ctx.fillStyle='#5a3a1e';ctx.fillRect(sx-2,sy-26,4,26);ctx.fillStyle='#8a5a2e';ctx.strokeStyle='#2a1a0a';ctx.lineWidth=1.2;
    ctx.beginPath();if(e.dir==='w'){ctx.moveTo(sx-16,sy-22);ctx.lineTo(sx-10,sy-28);ctx.lineTo(sx+12,sy-28);ctx.lineTo(sx+12,sy-16);ctx.lineTo(sx-10,sy-16)}else{ctx.moveTo(sx-11,sy-20);ctx.lineTo(sx-11,sy-30);ctx.lineTo(sx-4,sy-38);ctx.lineTo(sx+3,sy-30);ctx.lineTo(sx+3,sy-20)}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.restore();
    const near=Math.hypot(P.x-x,P.y-y)<46,lx=e.dir==='w'?x+70:x,ly=e.dir==='w'?y-40:y+52;plate7((open?(e.dir==='w'?'⬅ ':'⬆ '):'🔒 ')+nz.e+' '+nz.n+' Lv.'+nz.lv[0]+'+',lx,ly,near?'#fff':e.c[1]);
    if(near)plate7(open?'เดินต่อ / กด E เพื่อไป':'ต้อง Lv.'+nz.ulv,lx,ly+18,'#ffe27a');
    // เดินดันขอบ = ข้ามแมพ
    if(performance.now()>EX16.cd&&P.mv&&Math.hypot(P.x-x,P.y-y)<26&&((e.dir==='w'&&P.dir==='l')||(e.dir==='n'&&P.dir==='u')))ex16Go(e)}}}catch(_){}_h()}}

// =====================================================================
