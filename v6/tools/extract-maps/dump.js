async () => { HOOK
 const sl=ms=>new Promise(r=>setTimeout(r,ms));
 const J=o=>JSON.parse(JSON.stringify(o,(k,v)=>v&&v.getContext?undefined:v instanceof HTMLImageElement?undefined:typeof v==='function'?undefined:v));
 const G=m=>m.map(r=>Array.from({length:r.length},(_,i)=>{const v=r[i];return v===undefined?'?':typeof v==='number'?(v<10?String(v):'#'):String(v)[0]}).join(''));
 const ops=(cvId)=>{const c=window.__cap||[];window.__cap=[];return c};
 const out={};
 /* ---- ทุ่ง ---- */
 window.__cap=[]; buildGround(); const fo=window.__cap; window.__cap=null;
 const fhit=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=hit(x*T+16,y*T+16)?'1':'0';fhit.push(s)}
 out.field={W,H,grid:G(map),hit:fhit,EX16:J(EX16.L),ZG:J(ZG),WBG64:J(WBG64),WC:J(WC),ops:fo.filter(o=>o.cw===W*T).map(o=>[o.src,o.s,o.d,o.t])};
 /* ---- เมือง ---- */
 exitD&&D&&D.zone&&exitD();
 window.__cap=[];buildTown();await sl(800);const to=window.__cap;window.__cap=null;
 out.town={W:dm[0].length,H:dm.length,grid:G(dm),doors:J(D.doors),twr42:J(D.twr42),D:Object.keys(D),stalls:J((D.stalls||[]).map(s=>({x:s.x,y:s.y,w:s.w,h:s.h,k:s.k||s.kind||s.type,n:s.n}))).slice(0,80),dcvId:dcv.__id,
   ops:to.filter(o=>o.c===dcv.__id).map(o=>[o.src,o.s,o.d,o.t,o.al,o.op])};
 /* ---- ร้าน ---- */
 out.shops={};
 for(const id of Object.keys(SHOP_DATA)){try{enterTown();await sl(50);window.__cap=[];enterShop(id);await sl(300);const so=window.__cap;window.__cap=null;
   out.shops[id]={W:dm[0].length,H:dm.length,grid:G(dm),P:[P.x,P.y,P.dir],D:Object.keys(D),door:J(SHOP_DATA[id].door),b:J(SHOP_DATA[id].b),solid:J(SHOP_DATA[id].solid),ops:so.filter(o=>o.c===dcv.__id&&o.src.startsWith('assets')).map(o=>[o.src,o.s,o.d,o.t])};
   leaveShop(true);await sl(50)}catch(e){out.shops[id]='ERR '+e.message}}
 /* ---- โซน ---- */
 out.zones={};
 for(let zi=0;zi<19;zi++){try{delete ZCACHE[zi];window.__cap=[];const Zm=genZone(zi);const zo=window.__cap;window.__cap=null;
   out.zones[zi]={id:Zm.Zd.id,n:Zm.Zd.n,lv:Zm.Zd.lv,ulv:Zm.Zd.ulv,pal:J(Zm.Zd.pal),dark:Zm.Zd.dark,W:ZW,H:ZH,grid:G(Zm.m),K:Zm.K?G(Zm.K):null,ent:J(Zm.ent),arena:J(Zm.arena),
    gate15:(()=>{const g=gateOf15(Zm);return g?{x:g.x,y:g.y,to:g.nz.id,ulv:g.nz.ulv}:null})(),gate42:J(Zm.gate42||null),
    path:Zm.path?Object.keys(Zm.path).length:0,bridge:Zm.bridge?Object.keys(Zm.bridge):[],
    trees:(Zm.trees16||[]).map(t=>[Math.round(t.x),Math.round(t.y||0),+(t.sc||1).toFixed(2),t.f?1:0,Object.keys(t).join('|')]),
    ores:Zm.ores.map(o=>[o.tx,o.ty,o.kind]),
    ops:zo.filter(o=>o.cw===ZW*T&&o.src.startsWith('assets')).map(o=>[o.src,o.s,o.d,o.t])}}catch(e){out.zones[zi]='ERR '+e.message+e.stack.slice(0,300)}}
 /* ---- แมพพิเศษ ---- */
 out.special={};
 for(const [n,f] of [['tower',()=>buildTower10(1)],['tower12',()=>buildTower10(12)],['mk',()=>buildMk10()],['wb',()=>buildWb10()],['arena',()=>buildArena8()],['duel',()=>buildDuel29()],
   ['lb0',()=>build62(0)],['lb1',()=>build62(1)],['lb2',()=>build62(2)],['lb3',()=>build62(3)],['lb4',()=>build62(4)],['lb5',()=>build62(5)],['c2',()=>{C2.Zm=null;return buildC2()}],['road',()=>buildRoad144()]]){
  try{window.__cap=[];const Zm=f();const zo=window.__cap;window.__cap=null;const w=Zm.W||Zm.m[0].length,h=Zm.H||Zm.m.length;
   out.special[n]={id:Zm.Zd&&Zm.Zd.id,n:Zm.Zd&&Zm.Zd.n,pal:J(Zm.Zd&&Zm.Zd.pal),W:w,H:h,grid:G(Zm.m),ent:J(Zm.ent),arena:J(Zm.arena),keys:Object.keys(Zm),
    extra:J(Object.fromEntries(Object.entries(Zm).filter(([k,v])=>!['m','floor','seen','ores','oreAt','Zd','cv','zi','ent','arena','W','H'].includes(k)).map(([k,v])=>[k,Array.isArray(v)?v.slice(0,60):v]))),
    ops:zo.filter(o=>o.cw===w*T&&o.src.startsWith('assets')).map(o=>[o.src,o.s,o.d,o.t])}}catch(e){out.special[n]='ERR '+e.message}}
 out.C2={portals:J(C2.portals),doors:J(C2.doors),occ:J(C2.occ).slice(0,80),npcs:J(C2.npcs).slice(0,60),keys:Object.keys(C2)};
 out.LB62=J(LB62.map(l=>({id:l.id,n:l.n,map:l.map,lv:l.lv})));
 out.TW10PAL=J(TW10.PAL);
 return out}
