// fix38.js (v4.41) — หน้าสร้างตัวละครก่อนเข้าเกม
//  สมัครไอดี: ขั้น 1 ไอดี+รหัสผ่าน → ขั้น 2 สร้างตัวละคร (เพศ · ชุด · สีผม · ชื่อ) → เข้าเกม
//  ไอดีเก่าที่ยังไม่เคยสร้างตัวละคร: เข้าหน้านี้ 1 ครั้งตอนกด "เข้าสู่เกม" (ฟรี)
// =====================================================================
const OUTFIT41=[
 {n:'นักผจญภัย',top:'#262631',pants:'#14141a'},{n:'อัศวิน',top:'#2a4a8a',pants:'#4a4a52'},
 {n:'พรานป่า',top:'#2a6a3a',pants:'#3a2a1a'},{n:'นักเวท',top:'#6a3a8a',pants:'#1a2a4a'},
 {n:'นักรบเพลิง',top:'#7a2a2a',pants:'#14141a'},{n:'พ่อค้า',top:'#a8743a',pants:'#3a2a1a'},
 {n:'นักบวช',top:'#d8d0c0',pants:'#4a4a52'},{n:'ซากุระ',top:'#c0507a',pants:'#5a1a1a'}];
const CC41={el:null,mode:'',L:null,dir:'d',hold:0,raf:0,busy:false,done:null};
let REG41=null;
const ccDone41=()=>{try{return !!(window.SERVER_BOOT&&SERVER_BOOT.ready&&window.FM_NEW===false)||localStorage.getItem('fm_cc41')==='1'}catch(e){return false}};
{const st=document.createElement('style');st.textContent=`
#cc41{position:fixed;inset:0;z-index:101;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 40%,#2a2448,#0a0814 75%);font-family:system-ui,"Noto Sans Thai",sans-serif;color:#fff;padding:max(8px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));box-sizing:border-box}
#cc41[hidden]{display:none}
#cc41 .box{display:flex;gap:12px;width:min(820px,100%);height:min(560px,100%);border-radius:18px;background:linear-gradient(180deg,rgba(28,24,46,.92),rgba(12,10,22,.94));border:1.5px solid rgba(232,193,74,.75);box-shadow:0 10px 40px rgba(0,0,0,.6);padding:12px;box-sizing:border-box;animation:tlIn .35s ease-out}
#cc41 .pv{flex:0 0 38%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-width:0}
#cc41 .pv h2{margin:0;font-size:17px;color:#ffe9a0;text-align:center}
#cc41 .stage{position:relative;width:100%;flex:1;min-height:120px;max-height:300px;border-radius:14px;background:radial-gradient(ellipse at 50% 85%,#4a3a6a,#1a1428 70%);border:1px solid rgba(255,255,255,.12);overflow:hidden}
#cc41 .stage canvas{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;border:none!important;border-radius:0!important;background:none!important;image-rendering:pixelated}
#cc41 .rot{display:flex;gap:6px}
#cc41 .rot button,#cc41 .sm{font:inherit;font-size:13px;font-weight:700;padding:6px 12px;border-radius:10px;border:1.5px solid #8a80c0;background:linear-gradient(180deg,#4a4270,#2a2448);color:#e8e4ff;cursor:pointer}
#cc41 .fm{flex:1;min-width:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-right:4px}
#cc41 .st{font-size:11px;color:#c8c4e8;text-align:center;margin-bottom:2px}
#cc41 label{display:block;font-size:12px;color:#ffe9a0;font-weight:700;margin:8px 0 4px}
#cc41 input{width:100%;box-sizing:border-box;padding:9px 12px;font:inherit;font-size:16px;border-radius:10px;border:1.5px solid #6a6490;background:#141226;color:#fff;outline:none;-webkit-user-select:text;user-select:text}
#cc41 input:focus{border-color:#e8c14a;box-shadow:0 0 0 3px rgba(232,193,74,.2)}
#cc41 .gd{display:flex;gap:8px}
#cc41 .gd button{flex:1;font:inherit;font-size:15px;font-weight:800;padding:9px;border-radius:11px;border:1.5px solid #8a7a5a;background:#2a2218;color:#ffe9c0;cursor:pointer}
#cc41 .gd button.on{background:linear-gradient(180deg,#ffe9a0,#d8b050);color:#3a2408;border-color:#fff3c0}
#cc41 .of{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
#cc41 .of button{font:inherit;font-size:11px;font-weight:700;padding:5px 2px 4px;border-radius:10px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:#e8e4ff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px}
#cc41 .of button.on{border-color:#ffd84a;background:rgba(232,193,74,.18);box-shadow:0 0 0 2px rgba(255,216,74,.35)}
#cc41 .of i{display:block;width:26px;height:22px;border-radius:5px;border:1px solid rgba(255,255,255,.3)}
#cc41 .sw{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin:4px 0}
#cc41 .sw span{font-size:11.5px;min-width:46px;color:#c8c4e8}
#cc41 .sw i{width:24px;height:24px;border-radius:7px;border:2px solid rgba(255,255,255,.25);cursor:pointer;display:inline-block}
#cc41 .sw i.on{border-color:#fff;box-shadow:0 0 0 2px #ffd84a}
#cc41 .err{min-height:16px;font-size:12.5px;color:#ff8a7a;text-align:center;margin-top:6px}
#cc41 .go{display:block;width:100%;margin:6px 0 4px;padding:11px;font:inherit;font-weight:800;font-size:16px;border-radius:12px;cursor:pointer;color:#2a1a06;background:linear-gradient(180deg,#fff0b0,#e8c14a 55%,#b8862a);border:1.5px solid #fff3c0;box-shadow:0 4px 0 #6a4810}
#cc41 .go:disabled{opacity:.6}
#cc41 .bk{display:block;width:100%;padding:7px;font:inherit;font-size:13px;border-radius:10px;background:none;border:1px solid rgba(255,255,255,.25);color:#cfd0e8;cursor:pointer}
#cc41 small.nt{display:block;font-size:11px;opacity:.65;text-align:center;line-height:1.4}
@media (orientation:portrait){#cc41 .box{flex-direction:column;height:100%}#cc41 .pv{flex:0 0 auto}#cc41 .stage{height:30vh;flex:none}}
@media (max-height:430px){#cc41 .box{padding:8px;gap:8px}#cc41 .pv h2{font-size:14px}#cc41 label{margin:5px 0 3px}#cc41 input{padding:6px 10px;font-size:15px}#cc41 .gd button{padding:6px}#cc41 .go{padding:8px;font-size:15px}#cc41 .sw i{width:22px;height:22px}}
`;document.head.appendChild(st)}
function ccDraw41(cv){try{const r=cv.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}
 const k=cv.getContext('2d'),now=performance.now()/1000;k.setTransform(1,0,0,1,0,0);k.clearRect(0,0,w,h);k.imageSmoothingEnabled=false;
 if(!CC41.hold||now>CC41.hold){CC41.hold=0;CC41.dir=['d','l','u','r'][Math.floor(now/2.4)%4]}
 const walk=Math.floor(now/2.4)%2===0,sc=Math.max(1.4,Math.min(w/70,h/86));
 const sv={ctx,x:P.x,y:P.y,dir:P.dir,mv:P.mv,t:P.t,draw:P.draw,at:P.at,name:P.name,look:P.look8,mo:MOUNT.on};
 ctx=k;k.translate(w/2,h*.86);k.scale(sc,sc);
 try{P.x=0;P.y=0;P.dir=CC41.dir;P.mv=walk;P.t=now*9;P.draw=false;P.at=-1;MOUNT.on=false;P.look8=CC41.L;window.LOOK8=CC41.L;
  P.name='';heroBody()}
 finally{ctx=sv.ctx;P.x=sv.x;P.y=sv.y;P.dir=sv.dir;P.mv=sv.mv;P.t=sv.t;P.draw=sv.draw;P.at=sv.at;P.name=sv.name;P.look8=sv.look;window.LOOK8=sv.look;MOUNT.on=sv.mo}
 const nm=gid('cc41n'),t=(nm&&nm.value.trim())||'';if(t){k.setTransform(1,0,0,1,0,0);const fs=Math.round(14*dpr);k.font='bold '+fs+'px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.lineWidth=4*dpr;k.strokeStyle='#000';k.strokeText(t,w/2,h*.86-56*sc-6*dpr);k.fillStyle='#ffe9a0';k.fillText(t,w/2,h*.86-56*sc-6*dpr)}}catch(e){}}
function ccLoop41(){if(!CC41.el||CC41.el.hidden){CC41.raf=0;return}const cv=gid('cc41cv');if(cv)ccDraw41(cv);CC41.raf=requestAnimationFrame(ccLoop41)}
function ccErr41(m){const e=gid('cc41e');if(e)e.textContent=m||''}
function ccRender41(){const L=CC41.L,el=CC41.el,first=CC41.mode==='first';
 const sw=(k,t)=>'<div class="sw"><span>'+t+'</span>'+LOOK_COL8[k].map(c=>'<i data-k="'+k+'" data-c="'+c+'" style="background:'+c+'" class="'+(L[k]===c?'on':'')+'"></i>').join('')+'</div>';
 const of=OUTFIT41.map((o,i)=>'<button data-o="'+i+'" class="'+(L.top===o.top&&L.pants===o.pants?'on':'')+'"><i style="background:linear-gradient(180deg,'+o.top+' 55%,'+o.pants+' 55%)"></i>'+o.n+'</button>').join('');
 const nmv=gid('cc41n')?gid('cc41n').value:(first?(P.name||''):'');
 el.innerHTML='<div class="box"><div class="pv"><h2>✨ สร้างตัวละคร</h2><div class="stage"><canvas id="cc41cv"></canvas></div><div class="rot"><button data-r="-1">◀ หมุน</button><button data-rnd="1">🎲 สุ่ม</button><button data-r="1">หมุน ▶</button></div></div>'
  +'<div class="fm">'+(first?'<div class="st">ไอดี '+esc(FM_ACCT||'')+' · เลือกรูปลักษณ์ก่อนเข้าเกม (ครั้งแรกฟรี)</div>':'<div class="st">ขั้นที่ 2/2 · ไอดี '+esc(REG41?REG41.id:'')+'</div>')
  +'<label>📝 ชื่อตัวละคร</label><input id="cc41n" maxlength="14" placeholder="ตั้งชื่อตัวละคร (ไม่เกิน 14 ตัว)" autocomplete="off" value="'+esc(nmv)+'">'
  +'<label>👤 เพศ</label><div class="gd"><button data-g="m" class="'+(L.g!=='f'?'on':'')+'">♂ ชาย</button><button data-g="f" class="'+(L.g==='f'?'on':'')+'">♀ หญิง</button></div>'
  +'<label>👕 ชุด</label><div class="of">'+of+'</div>'
  +'<label>🎨 ปรับสีเอง</label>'+sw('top','เสื้อ')+sw('pants','กางเกง')+sw('hair','ผม')
  +'<div class="err" id="cc41e"></div><button class="go" id="cc41go">⚔️ '+(first?'บันทึกแล้วเข้าเกม':'สร้างตัวละครและเริ่มผจญภัย')+'</button>'
  +(first?'':'<button class="bk" id="cc41bk">← กลับไปแก้ไอดี/รหัสผ่าน</button>')
  +'<small class="nt">'+(first?'':'ภายหลังเปลี่ยนสีชุดได้ในเกม (เมนู 👗 รูปลักษณ์) · ')+'ถ้าสวมเกราะ สีชุดจะถูกเกราะทับ</small></div></div>';
 const n=gid('cc41n');for(const ev of ['keydown','keyup','keypress'])n.addEventListener(ev,e=>{e.stopPropagation();if(ev==='keydown'&&e.key==='Enter'){e.preventDefault();n.blur();ccGo41()}});
 gid('cc41go').onclick=ccGo41;const bk=gid('cc41bk');if(bk)bk.onclick=()=>{ccClose41();tRegForm()};
 if(!CC41.raf)CC41.raf=requestAnimationFrame(ccLoop41)}
function ccClick41(e){const t=e.target.closest('[data-g],[data-o],[data-c],[data-r],[data-rnd]');if(!t||CC41.busy)return;const L=CC41.L;
 if(t.dataset.g)L.g=t.dataset.g;
 else if(t.dataset.o!=null){const o=OUTFIT41[+t.dataset.o];L.top=o.top;L.pants=o.pants}
 else if(t.dataset.c)L[t.dataset.k]=t.dataset.c;
 else if(t.dataset.r){const D4=['d','l','u','r'],i=D4.indexOf(CC41.dir);CC41.dir=D4[(i+(+t.dataset.r)+4)%4];CC41.hold=performance.now()/1000+5;try{sfx('ui')}catch(_){}return}
 else if(t.dataset.rnd){const r=a=>a[Math.floor(Math.random()*a.length)],o=r(OUTFIT41);L.g=r(['m','f']);L.top=o.top;L.pants=o.pants;L.hair=r(LOOK_COL8.hair)}
 try{sfx('ui')}catch(_){}ccRender41()}
function openCC41(mode,done){CC41.mode=mode;CC41.done=done||null;CC41.busy=false;CC41.dir='d';CC41.hold=0;
 CC41.L=Object.assign({},LOOKDEF8,mode==='first'?(P.look8||{}):{});
 if(!CC41.el){const el=document.createElement('div');el.id='cc41';el.hidden=true;el.addEventListener('click',ccClick41);document.body.appendChild(el);CC41.el=el}
 PAUSED=true;CC41.el.hidden=false;ccRender41();if(mode!=='first')setTimeout(()=>{const n=gid('cc41n');if(n&&!n.value)n.focus()},250)}
function ccClose41(){if(CC41.el)CC41.el.hidden=true;if(CC41.raf){cancelAnimationFrame(CC41.raf);CC41.raf=0}}
function ccName41(){const nm=(gid('cc41n').value||'').trim().slice(0,14);if(!nm)return [null,'ตั้งชื่อตัวละครก่อน'];if(/[<>]/.test(nm))return [null,'ชื่อห้ามมีเครื่องหมาย < >'];
 if(typeof chatBad==='function'&&chatBad(nm))return [null,'ชื่อตัวละครมีคำไม่เหมาะสม'];return [nm,'']}
async function ccGo41(){if(CC41.busy)return;const [nm,er]=ccName41();if(!nm){ccErr41(er);try{sfx('thud')}catch(e){}return}
 const L={g:CC41.L.g==='f'?'f':'m',top:CC41.L.top,pants:CC41.L.pants,hair:CC41.L.hair},go=gid('cc41go');
 if(CC41.mode==='first'){
  Object.assign(LOOK8,L);lookSave8();P.name=nm;try{localStorage.setItem('fm_name',nm);localStorage.setItem('fm_cc41','1');sessionStorage.setItem('cc41_pend',JSON.stringify({id:String(FM_ACCT||'').toLowerCase(),L,nm}))}catch(e){}
  try{renderChar()}catch(e){}try{sfx('warp')}catch(e){}ccClose41();const d=CC41.done;CC41.done=null;if(d)d();return}
 // สมัครใหม่: เก็บรูปลักษณ์ไว้ในช่องของไอดีนั้นก่อน แล้วค่อยสมัคร (สำเร็จแล้วเกมจะโหลดใหม่เข้าไอดีเอง)
 const R=REG41;if(!R){ccClose41();tRegForm();return}
 CC41.busy=true;go.disabled=true;go.textContent='⏳ กำลังสร้างตัวละคร…';ccErr41('');
 try{FM_RAW.set('u:'+R.id+':fm_look8',JSON.stringify(L));FM_RAW.set('u:'+R.id+':fm_cc41','1')}catch(e){}
 const _cm=window.cloudMsg;window.cloudMsg=m=>ccErr41(m);
 let r;try{r=await accRegister(R.id,R.pw,R.pw,nm,R.mig)}catch(e){r='สร้างไม่สำเร็จ ลองใหม่อีกครั้ง'}finally{window.cloudMsg=_cm}
 if(r){CC41.busy=false;go.disabled=false;go.textContent='⚔️ สร้างตัวละครและเริ่มผจญภัย';ccErr41(r);try{sfx('thud')}catch(e){}
  if(/ไอดี/.test(r)){try{FM_RAW.del('u:'+R.id+':fm_look8');FM_RAW.del('u:'+R.id+':fm_cc41')}catch(e){}}}}
window.openCC41=openCC41;
// ---------- สมัครไอดี ขั้นที่ 1: ไอดี + รหัสผ่าน ----------
tRegForm=function(){const old=(typeof legacyKeys==='function')&&legacyKeys().includes('fm_save_v1')&&!FM_ACCT,R=REG41||{};
 gid('tpan').innerHTML='<h3>✨ สมัครไอดี · ขั้นที่ 1/2</h3><label>ไอดี</label><input id="rId" maxlength="16" autocomplete="username" value="'+esc(R.id||'')+'"><label>รหัสผ่าน (6 ตัวขึ้นไป มีตัวเลขและตัวอักษร)</label><input id="rPw" type="password" autocomplete="new-password"><label>ยืนยันรหัสผ่าน</label><input id="rPw2" type="password" autocomplete="new-password">'
  +(old?'<div class="chk"><input type="checkbox" id="rMig"'+(R.mig?' checked':'')+'><span>นำเซฟเดิมในเครื่องนี้มาใช้กับไอดีนี้</span></div>':'')+'<div class="err"></div><button class="tb" id="rGo">ถัดไป: สร้างตัวละคร ➜</button><button class="tb ghost" onclick="tMain()">← กลับ</button>';
 tInputs();gid('rGo').onclick=()=>{const id=gid('rId').value.trim(),pw=gid('rPw').value,pw2=gid('rPw2').value,mig=!!(gid('rMig')&&gid('rMig').checked);
  let m='';if(!/^[A-Za-z0-9_ก-๙]{3,16}$/.test(id))m='ไอดี 3–16 ตัว (ตัวอักษร ตัวเลข _ ภาษาไทยได้)';
  else if(typeof pwStrong==='function'?!pwStrong(pw):pw.length<6)m='รหัสผ่านอย่างน้อย 6 ตัว มีทั้งตัวเลขและตัวอักษร';
  else if(pw===id)m='รหัสผ่านต้องไม่เหมือนไอดี';else if(pw!==pw2)m='รหัสผ่านไม่ตรงกัน';
  else if(Object.keys(ACC.all).some(k=>k.toLowerCase()===id.toLowerCase()))m='ไอดีนี้เคยใช้ในเครื่องนี้ — กด "เข้าสู่ระบบ" แทน';
  if(m){tErr(m);try{sfx('thud')}catch(e){}return}
  REG41={id,pw,mig};try{sfx('ui')}catch(e){}openCC41('reg')};
 setTimeout(()=>gid(R.id?'rPw':'rId').focus(),100)};
// ---------- ไอดีเก่าที่ยังไม่เคยสร้างตัวละคร: สร้างก่อนเข้าเกม 1 ครั้ง ----------
{const _tp=tPlay;tPlay=function(){if(FM_ACCT&&SERVER_BOOT.ready&&!ccDone41()&&!(CC41.el&&!CC41.el.hidden)){titleEl.hidden=false;requestAnimationFrame(titleDraw);openCC41('first',()=>_tp());return}return _tp.apply(this,arguments)}}
// ถ้าเกมโหลดเซฟจากเซิร์ฟเวอร์ทับหลังเพิ่งสร้างตัวละคร → ใส่รูปลักษณ์/ชื่อที่เลือกกลับคืน
try{const p=JSON.parse(sessionStorage.getItem('cc41_pend')||'null');if(p&&FM_ACCT&&window.FM_NEW&&p.id===String(FM_ACCT).toLowerCase()){Object.assign(LOOK8,p.L);lookSave8();P.name=p.nm;localStorage.setItem('fm_name',p.nm);localStorage.setItem('fm_cc41','1')}
 setInterval(()=>{try{if(window.ONL32&&ONL32.verified&&sessionStorage.getItem('cc41_pend')){sessionStorage.removeItem('cc41_pend');CLOUD.sync(true)}}catch(e){}},3000)}catch(e){}
try{const v=titleEl.querySelector('.ver');if(v)v.textContent='v4.42 · ออนไลน์'}catch(e){}

// fixz.js — ท้ายสุด: คืนไอเท็มที่ถูกพักไว้ตอนโหลด (ไอเท็มที่สร้างในสคริปต์ท้าย ๆ เช่น Lv.105+ / อาวุธประจำอาชีพ)
function restorePendingItems38(){try{const Q=window.__PEND8;if(!Q)return;let ch=0;
 for(const k in Q.a)if(ITEMS[Q.a[k]]){P.armor[k]=Q.a[k];delete Q.a[k];ch=1}
 for(const id in Q.g)if(ITEMS[id]){GEAR[id]=Q.g[id];delete Q.g[id];ch=1}
 if(ch){try{syncSword();recalcStats();applyBonus();ptDirty();refreshInv()}catch(e){}}
}catch(e){console.warn('[pending items]',e)}}
restorePendingItems38();
if(window.FM_LOADING)addEventListener('eldoria:ready',restorePendingItems38,{once:true});else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restorePendingItems38,{once:true});

// ---------- สรุป ----------
{const sm=menuEl.querySelector('small');if(sm)sm.insertAdjacentHTML('beforeend',' · H/N ดื่มยา · B กินอาหาร')}
window.GAME&&Object.assign(window.GAME,{equipItem,unequip,craftGear,smeltX,renderBag,PAD,ARR,vitalsTick,hitOre,logPick,useItem});
lvBox.innerHTML='🪙 <b id="coinhud">'+inv.coin+'</b>';
redrawHotbar();refreshInv();lvHud();
