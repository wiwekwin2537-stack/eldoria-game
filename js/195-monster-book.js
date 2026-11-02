/* v5.71 📖 สมุดมอนสเตอร์ (เจ้าของสั่ง 2026-10-22 · เลือกรางวัลระดับ "กลาง")
   - ตีมอนชนิดใดครั้งแรก = ปลดรูปในสมุด · มอนธรรมดาครบ 300 ตัว / บอสครบ 10 ครั้ง = +1 สเตตัสตามชนิดมอน
   - เก็บครบ 25 / 50 / 75 ชนิด = ดาเมจ +1% / +2% / +3% และเลือดสูงสุด +1% / +2% / +3%
   - รายชื่อ = มอนประจำแมพทุกแมพ (ZONES) 75 ชนิด · นับเมื่อมอนตายใกล้ผู้เล่น (≤900px) ในฉากเดียวกัน
   - นับตอนตาย: เรียก BOOK65.onKill(m) ในฟังก์ชันฐาน mobKill (js/031-core.js · ไม่เพิ่มชั้นห่อ) + ตรวจ m.dead ทุก 0.15 วิ สำรองทางตายอื่น · m._b65 กันนับซ้ำ
   - ข้อมูลเก็บที่ localStorage 'fm_book65' (ขึ้นคลาวด์อัตโนมัติพร้อมเซฟ เพราะเป็นคีย์ fm_)
   - ค่าสเตตัสบวกเข้า PTX ฐาน (js/031-core.js) ผ่าน BOOK65.addTo(o) */
try{
const BOOK65={KEY:'fm_book65',NEED:300,NEED_BOSS:10,MILE:[[25,.01],[50,.02],[75,.03]],
 STAT:{beetle:'end',bat:'agi',golem:'vit',wolf:'agi',wisp:'int',dragon:'str',drake:'str',skeleton:'str',zombie:'vit'},
 d:null,list:null,
 load(){if(this.d)return this.d;let d=null;try{d=JSON.parse(localStorage.getItem(this.KEY)||'null')}catch(e){}this.d=d&&typeof d==='object'&&d.k?d:{k:{}};return this.d},
 save(){try{localStorage.setItem(this.KEY,JSON.stringify(this.d))}catch(e){}},
 species(){if(this.list)return this.list;const m=new Map();
  for(let i=0;i<ZONES.length;i++){const Z=ZONES[i];if(!Z||!Z.mobs)continue;for(const t of Z.mobs){if(!m.has(t[1]))m.set(t[1],{n:t[1],f:t[0],c:t[2],zone:Z.n,e:Z.e||'',lv:Z.lv,boss:false})}
   const b=Z.boss;const bn=b&&(b.n||b.name||b[1]);if(bn&&!m.has(bn))m.set(bn,{n:bn,f:b.f||b[0]||'golem',c:b.c||b[2]||null,zone:Z.n,e:Z.e||'',lv:Z.lv,boss:true})}
  return this.list=[...m.values()]},
 need(s){return s.boss?this.NEED_BOSS:this.NEED},
 statOf(s){return this.STAT[s.f]||'end'},
 done(){const k=this.load().k;return this.species().filter(s=>(k[s.n]|0)>=this.need(s))},
 addTo(o){try{const done=this.done();for(const s of done){const st=this.statOf(s);o.st[st]=(o.st[st]||0)+1}
  let p=0;for(const [n,v] of this.MILE)if(done.length>=n)p=v;o.dmg+=p;o.hp+=p}catch(e){}},
 dirty(){try{if(typeof ptDirty==='function')ptDirty()}catch(e){}},
 count(m){const s=this.species().find(x=>x.n===m.nm);if(!s)return;const k=this.load().k,before=k[s.n]|0;k[s.n]=before+1;this.save();
  if(before===0)try{say('📖 สมุดมอนสเตอร์: บันทึก '+s.n+' แล้ว!')}catch(e){}
  if(before<this.need(s)&&before+1>=this.need(s)){try{say('📖 สะสม '+s.n+' ครบ! '+this.statOf(s).toUpperCase()+' +1');sfx('gem')}catch(e){}this.dirty()}},
 onKill(m){if(!m||m._b65||window.__qa154)return;m._b65=1;if(P.dead)return;if(Math.hypot((m.x||0)-P.x,(m.y||0)-P.y)>900)return;this.count(m)},
 scan(){if(window.__qa154)return;const L=[];try{if(D&&D.mobs)L.push(...D.mobs);if(D&&D.boss)L.push(D.boss);if(!D&&typeof slimes!=='undefined')L.push(...slimes)}catch(e){}
  for(const m of L){if(!m)continue;if(!m.dead){m._b65=0;continue}this.onKill(m)}}};
window.BOOK65=BOOK65;
setInterval(()=>{try{if(!PAUSED&&titleEl.hidden)BOOK65.scan()}catch(e){}},150);

/* ---------- หน้าต่างสมุด ---------- */
const bookW=document.createElement('div');bookW.id='book65';bookW.className='p6w';bookW.hidden=true;
bookW.innerHTML='<div class="w"><div class="hd"><b>📖 สมุดมอนสเตอร์</b><button type="button" onclick="p6close(gid(\'book65\'))" aria-label="ปิด">✕</button></div><div class="bd"><div id="book65sum"></div><div id="book65grid"></div></div></div>';
gid('wrap').appendChild(bookW);
const bst=document.createElement('style');bst.textContent='#book65 .w{width:760px;max-width:calc(100% - 16px);max-height:calc(100% - 16px);display:flex;flex-direction:column}#book65 .bd{overflow:auto;padding:8px;display:block!important}#book65sum{font-size:13px;line-height:1.5;margin-bottom:8px;color:#f4e6c0;text-align:left}#book65sum b{color:#ffd84a}#book65grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}.bk65{background:#1c1a26;border:1px solid #4a4258;border-radius:8px;padding:6px;text-align:center;font-size:11px;color:#ddd}.bk65.ok{border-color:#ffd84a;box-shadow:0 0 0 1px #ffd84a55 inset}.bk65.boss{background:#2a1a22}.bk65 canvas{width:72px;height:72px;display:block;margin:0 auto 4px}.bk65 .nm{font-weight:700;color:#fff;min-height:28px}.bk65 .bar{height:5px;background:#333;border-radius:3px;overflow:hidden;margin:4px 0}.bk65 .bar i{display:block;height:100%;background:linear-gradient(90deg,#7ad8ff,#ffd84a)}.bk65.lock .nm{color:#777}';
document.head.appendChild(bst);
function pic65(s,lock){const c=document.createElement('canvas');c.width=c.height=144;const sv=ctx;try{ctx=c.getContext('2d');ctx.translate(72,112);const sc=s.boss?1.9:2.6;ctx.scale(sc,sc);
  const m={x:0,y:0,f:s.f,fx:1,sc:1,mv:false,st:'idle',hurt:0,F:{r:10},nm:s.n,boss:s.boss};const col=s.c||['#888','#444','#fff'];
  if(MOBDRAW[s.f])MOBDRAW[s.f](m,1,col);if(lock){ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-atop';ctx.fillStyle='#14121c';ctx.fillRect(0,0,144,144)}}catch(e){}finally{ctx=sv}return c}
function bookRender65(){const k=BOOK65.load().k,L=BOOK65.species(),done=BOOK65.done(),seen=L.filter(s=>(k[s.n]|0)>0).length;
 const st={};for(const s of done){const x=BOOK65.statOf(s);st[x]=(st[x]||0)+1}let p=0,next=null;for(const [n,v] of BOOK65.MILE){if(done.length>=n)p=v;else if(!next)next=[n,v]}
 gid('book65sum').innerHTML='พบแล้ว <b>'+seen+'</b>/'+L.length+' ชนิด · สะสมครบ <b>'+done.length+'</b> ชนิด<br>โบนัสตอนนี้: '+(Object.keys(st).map(x=>x.toUpperCase()+' +'+st[x]).join(' · ')||'ยังไม่มี')+(p?' · ดาเมจ/เลือด +'+Math.round(p*100)+'%':'')+(next?'<br><small>ครบ '+next[0]+' ชนิด → ดาเมจ/เลือด +'+Math.round(next[1]*100)+'% · มอนธรรมดา '+BOOK65.NEED+' ตัว / บอส '+BOOK65.NEED_BOSS+' ครั้ง = +1 สเตตัส</small>':'');
 const g=gid('book65grid');g.innerHTML='';
 for(const s of L){const n=k[s.n]|0,need=BOOK65.need(s),ok=n>=need,lock=n===0;const d=document.createElement('div');d.className='bk65'+(ok?' ok':'')+(s.boss?' boss':'')+(lock?' lock':'');
  d.appendChild(pic65(s,lock));const t=document.createElement('div');t.innerHTML='<div class="nm">'+(lock?'???':(s.boss?'👑 ':'')+s.n)+'</div><div>'+s.e+' '+s.zone+'</div><div class="bar"><i style="width:'+Math.min(100,n/need*100)+'%"></i></div><div>'+Math.min(n,need)+'/'+need+(ok?' ✓ ':' · ')+BOOK65.statOf(s).toUpperCase()+' +1</div>';d.appendChild(t);g.appendChild(d)}}
function openBook65(){bookRender65();p6open(gid('book65'))}window.openBook65=openBook65;window.bookRender65=bookRender65;
try{const at=PM7.findIndex(m=>m[1]==='เควส');PM7.splice(at<0?PM7.length:at+1,0,['📖','สมุดมอน',()=>openBook65()]);if(typeof pmRender7==='function')pmRender7()}catch(e){}
}catch(e){console.warn('[book65]',e)}
