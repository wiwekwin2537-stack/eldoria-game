// fix53 (v4.56) — เจ้าของสั่ง: (1) เอากล่อง "อาวุธประจำอาชีพ ย้ายไปคราฟ…" ออกจากหน้าปรมาจารย์อาชีพ
//   (2) หน้าโต๊ะคราฟจัดใหม่ สวย ใช้ง่าย (เลือกหมวด 4 ปุ่ม · เลือกเซ็ตแบบ ◀ ▶ · วัสดุที่มี · การ์ดของ 2 คอลัมน์ บอกชัดว่าคราฟได้/ขาดอะไร/ล็อก)
//   (3) อาวุธประจำอาชีพไม่แยกหมวดแล้ว — อยู่ในรายการเดียวกับดาบ/คทา/ธนู ของแต่ละเซ็ต
try{
{const _oc=openClassMenu;openClassMenu=function(){const r=_oc.apply(this,arguments);try{for(const el of shopEl.querySelectorAll('.cw27'))el.remove()}catch(e){}return r};window.openClassMenu=openClassMenu}
{const st=document.createElement('style');st.textContent=`
.cf56{display:flex;flex-direction:column;gap:6px;width:100%;font-family:system-ui,"Noto Sans Thai",sans-serif;color:#f3e9d2}
.cf56 .hd{font:800 14px system-ui,"Noto Sans Thai";color:#ffd86a;text-align:center;letter-spacing:.2px}
.cf56 .seg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:rgba(0,0,0,.35);padding:3px;border-radius:12px;border:1px solid rgba(232,193,74,.25)}
.cf56 .seg button{all:unset;cursor:pointer;text-align:center;padding:6px 2px;border-radius:9px;font:700 12px system-ui,"Noto Sans Thai";color:#d8ccb0;white-space:nowrap}
.cf56 .seg button.on{background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.cf56 .step{display:flex;align-items:center;gap:6px}
.cf56 .step button{all:unset;cursor:pointer;flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font:900 15px system-ui;background:rgba(255,255,255,.07);border:1px solid rgba(232,193,74,.35);color:#ffd86a}
.cf56 .step button:disabled{opacity:.3;cursor:default}
.cf56 .step .nm{flex:1;min-width:0;text-align:center;padding:4px 6px;border-radius:10px;background:rgba(0,0,0,.35);border:1px solid var(--rc,#888);box-shadow:inset 0 0 12px color-mix(in srgb,var(--rc,#888) 25%,transparent)}
.cf56 .step .nm b{display:block;font:800 13px system-ui,"Noto Sans Thai";color:var(--rc,#fff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cf56 .step .nm small{display:block;font:600 10px system-ui,"Noto Sans Thai";color:#bfb39a}
.cf56 .mats{display:flex;flex-wrap:wrap;gap:4px}
.cf56 .mats span{display:inline-flex;align-items:center;gap:3px;padding:2px 7px 2px 3px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);font:700 10.5px system-ui,"Noto Sans Thai";color:#e8dcc0}
.cf56 .mats img{width:16px!important;height:16px!important;margin:0!important}
.cf56 .lock{padding:6px 9px;border-radius:10px;background:rgba(255,80,60,.14);border:1px solid rgba(255,138,106,.7);font:600 11px system-ui,"Noto Sans Thai";color:#ffd0c4}
.cf56 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px}
.cf56 .card{all:unset;text-align:left;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:4px;padding:7px 8px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(0,0,0,.25));border:1px solid rgba(255,255,255,.12);position:relative;min-width:0}
.cf56 .card.ok{border-color:rgba(122,230,110,.75);box-shadow:0 0 0 1px rgba(122,230,110,.25) inset}
.cf56 .card.cls{background:linear-gradient(180deg,rgba(255,210,80,.13),rgba(0,0,0,.25));border-color:rgba(255,210,80,.6)}
.cf56 .card.ok:active{transform:scale(.98)}
.cf56 .card .top{display:flex;align-items:center;gap:7px;min-width:0}
.cf56 .card .top img{width:34px!important;height:34px!important;flex:none;margin:0!important;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}
.cf56 .card .tt{min-width:0}
.cf56 .card .tt b{display:block;font:800 12px system-ui,"Noto Sans Thai";color:var(--rc,#fff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cf56 .card .tt small{display:block;font:600 10px system-ui,"Noto Sans Thai";color:#c8bca2;line-height:1.25}
.cf56 .card .rq{display:flex;flex-wrap:wrap;gap:3px}
.cf56 .card .rq span{font:700 10px system-ui,"Noto Sans Thai";padding:1px 5px;border-radius:6px;background:rgba(0,0,0,.35)}
.cf56 .card .rq .y{color:#9fe89a}.cf56 .card .rq .n{color:#ff9a8a}
.cf56 .card .ft{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-top:auto}
.cf56 .card .cl{display:block;font:800 10px system-ui,"Noto Sans Thai";font-style:normal;color:#ffd86a}
.cf56 .card .bd{font:800 9.5px system-ui,"Noto Sans Thai";padding:1px 6px;border-radius:999px}
.cf56 .card .bd.g{background:#3e9a3a;color:#fff}.cf56 .card .bd.r{background:rgba(255,120,100,.2);color:#ffb0a0}.cf56 .card .bd.c{background:#d9a42a;color:#2a1a06}.cf56 .card .bd.l{background:rgba(255,255,255,.12);color:#ddd}
.cf56 .card .own{font:700 10px system-ui;color:#ffd86a}
.cf56 .tip{font:600 10px system-ui,"Noto Sans Thai";color:#a99f88;text-align:center}
#shop .trade .tp.tbuy{background:rgba(14,10,8,.55);border-radius:12px;padding:6px}
`;document.head.appendChild(st)}
const esc53=s=>String(s==null?'':s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const go53=(k,v)=>'FUI.'+k+'='+v+';openForge(\'anvil\')';
const rq53=R=>'<div class="rq">'+Object.entries(R).map(([q,v])=>'<span class="'+((inv[q]|0)>=v?'y':'n')+'">'+(q==='coin'?'🪙':MN(q))+' '+v+'</span>').join('')+'</div>';
const miss53=R=>Object.entries(R).filter(([q,v])=>(inv[q]|0)<v).length;
function card53(o){const st=o.lock?'<span class="bd l">🔒 ล็อก</span>':o.ok?'<span class="bd g">✔ คราฟได้</span>':'<span class="bd r">ขาด '+o.miss+' อย่าง</span>';
 return '<button class="card'+(o.ok?' ok':'')+(o.cls?' cls':'')+'" style="--rc:'+(o.rc||'#fff')+'" onclick="'+o.on+'">'
  +'<div class="top">'+o.img+'<div class="tt"><b>'+esc53(o.name)+'</b>'+(o.cls?'<em class="cl">⭐ อาวุธเฉพาะ'+esc53(o.cls)+'</em>':'')+'<small>'+esc53(o.stat||'')+'</small></div></div>'+(o.R?rq53(o.R):'')
  +'<div class="ft">'+st+(o.own?'<span class="own">มีแล้ว ×'+o.own+'</span>':'')+'</div></button>'}
{const _ah=anvilHTML;anvilHTML=function(){if(FUI.tab!=='craft')return _ah();try{
 const cat=FUI.cat||'weapon',seg=(k,t)=>'<button class="'+(cat===k?'on':'')+'" onclick="'+go53('cat',"'"+k+"'")+'">'+t+'</button>';
 let h='<div class="cf56"><div class="hd">🛠️ โต๊ะคราฟ — สร้างอุปกรณ์</div><div class="seg">'+seg('weapon','⚔️ อาวุธ')+seg('armor','🛡️ ชุด')+seg('tool','⛏️ เครื่องมือ')+seg('misc','🔮 ของใช้')+'</div>';
 const stepper=(key,i,n,name,sub,col)=>'<div class="step"><button '+(i<=0?'disabled':'')+' onclick="'+go53(key,i-1)+'">◀</button><div class="nm" style="--rc:'+col+'"><b>'+name+'</b><small>'+sub+'</small></div><button '+(i>=n-1?'disabled':'')+' onclick="'+go53(key,i+1)+'">▶</button></div>';
 const mats=L=>'<div class="mats">'+L.filter(Boolean).map(k=>'<span>'+imgT(k==='coin'?'mat:coin':'mat:'+k)+(k==='coin'?'🪙':MN(k))+' '+(inv[k]|0)+'</span>').join('')+'</div>';
 if(cat==='misc'){const fe=Math.min(Math.floor((inv.essf|0)/5),inv.ingSt|0),wh=Math.floor((inv.ingSt|0)/3);
  h+=mats(['essf','ess','ingSt','whet'])+'<div class="grid">';
  h+=card53({name:'หลอมแก่นเวทมนตร์ ×1',stat:'เศษแก่นเวท 5 + แท่งหิน 1',img:imgT('mat:ess'),ok:fe>0,miss:1,on:'fuseEss12(1)'});
  if(fe>1)h+=card53({name:'หลอมทั้งหมด ×'+fe,stat:'ใช้เศษ '+fe*5+' + แท่งหิน '+fe,img:imgT('mat:ess'),ok:true,on:'fuseEss12('+fe+')'});
  h+=card53({name:'หินลับคม ×1',stat:'แท่งหิน 3 → โจมตี +12% 10 นาที',img:imgT('mat:whet'),ok:wh>0,miss:1,on:'makeWhet12(1)'});
  return h+'</div></div>'}
 if(cat==='tool'){const tt=Math.min(OREN12.length-1,FUI.ttier|0),mk=MATKEY[tt],lock=tt>SMITH.u,col=(ORIGT12[tt]&&ORIGT12[tt].mid)||'#ccc';
  h+=stepper('ttier',tt,OREN12.length,'เครื่องมือ'+OREN12[tt],(tt+1)+'/'+OREN12.length+(lock?' · 🔒 ต้องรับตำราช่าง':''),col)+mats([mk,'wood']);
  if(lock)h+='<div class="lock">🔒 ยังตีระดับ'+OREN12[tt]+'ไม่ได้ — คุยกับช่างหนวดเหล็ก → 📜 ตำราช่าง</div>';
  h+='<div class="grid">';for(const k of TOOL12){const id=k+tt,it=ITEMS[id];if(!it)continue;const r=RECIPE[k],R={};R[mk]=need_m(k,tt);if(r.wood)R.wood=r.wood;
   h+=card53({name:it.name,stat:it.stat,img:imgT('item:'+id,'lg'),R,ok:!lock&&miss53(R)===0,miss:miss53(R),lock,own:owned(id),rc:col,on:"craftGear('"+id+"')"})}
  return h+'</div></div>'}
 const NS=window.CRAFTN59||SETN12.length,t=Math.min(NS-1,FUI.tier|0),[rn,rc]=RARE12[t],lock=t>SMITH.u;
 h+=stepper('tier',t,NS,'เซ็ต'+SETN12[t],'ระดับ '+rn+' · '+(t+1)+'/'+NS+(lock?' · 🔒':''),rc);
 h+=mats(['ess',ING12[t],PARTS12[t][0],PARTS12[t][1],'wood']);
 if(lock)h+='<div class="lock">🔒 ยังตีเซ็ต'+SETN12[t]+'ไม่ได้ — คุยกับช่างหนวดเหล็ก → 📜 ตำราช่าง (ต้อง Lv.'+(SMQ[t]?SMQ[t].lv:'?')+')</div>';
 h+='<div class="grid">';
 if(cat==='weapon'&&P.cls!=='none'&&typeof CW27!=='undefined'&&CW27[P.cls]){const base=NEEDW[P.cls]+t,id=cwId27(P.cls,t),W=CW27[P.cls];
  if(ITEMS[base]&&ITEMS[id]){const A=Object.assign({},recipe12(base));A.coin=(A.coin||0)+400*(t+1);A.ess=(A.ess||0)+2+t;
   h+=card53({name:ITEMS[id].name,stat:'✨ '+desc26(W[1])+' · '+(ITEMS[id].stat||'').split(' · ✨')[0],img:imgT('item:'+id,'lg'),R:A,ok:!lock&&hasAll12(A),miss:miss53(A),lock,own:owned(id),rc:W[2],cls:CLS[P.cls].n,on:'craftCw42('+t+')'})}}
 for(const k of (cat==='weapon'?WEAP12:ARM12)){const id=k+t,it=ITEMS[id];if(!it)continue;const R=recipe12(id);
  h+=card53({name:it.name,stat:it.stat,img:imgT('item:'+id,'lg'),R,ok:!lock&&hasAll12(R),miss:miss53(R),lock,own:owned(id),rc,on:"craftSet12('"+id+"')"})}
 h+='</div><div class="tip">แตะการ์ดเพื่อคราฟ · ของที่คราฟแล้วเข้ากระเป๋า 🎒</div></div>';return h}catch(e){console.warn('fix53 craft',e);return _ah()}};window.anvilHTML=anvilHTML}
}catch(e){console.warn('fix53',e)}
