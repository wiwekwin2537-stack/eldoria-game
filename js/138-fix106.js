// fix106 (v4.91) — ⏳ หน้าโหลด (เจ้าของขอ 2026-10-14 19:51: "เปิดเกมแล้วให้ทำภาพขึ้นมา แล้วมี ui ขีดกำลังวิ่ง รอให้เสร็จก่อน" · "เข้าแมพตัดต้นไม้บนมือถือแล้วค้าง")
//  A) หน้าโหลดตอนเปิดเกม: บล็อก boot106 อยู่ต้น <body> (ซอร์ส patches/boot106.html) ขึ้นทันทีพร้อมรูป assets/loading.jpg + ขีดโหลด
//     ขีดเดินตามจำนวนสคริปต์ที่โหลดแล้ว · ตรงนี้ (ท้ายไฟล์) รอหน้าเว็บโหลดครบ แล้วเติม 100% และค่อย ๆ หายไป
//  B) เข้าแมพป่า/แมพธรรมชาติครั้งแรก: การวาดแผนที่ใหญ่ใช้เวลาหลายวินาที (มือถือนานกว่า) จอเลยดูค้าง
//     → ขึ้นหน้า "กำลังโหลดแมพ" (ชื่อแมพ + ขีดวิ่ง) ก่อน แล้วค่อยสร้างแมพ · ขีดเป็นแอนิเมชันที่วิ่งต่อได้แม้เครื่องกำลังคำนวณ
//     แมพที่เคยเข้าแล้ว (อยู่ใน ZCACHE) เข้าทันทีเหมือนเดิม
try{
/* Entry readiness extends this loader directly; it does not add another tPlay wrapper. */
const SCENEREADY={state:'idle',busy:false,failed:false,task:null,timeout:20000,generation:0};
SCENEREADY.cancel=function(){this.generation++;if(this.cancelPending)this.cancelPending();if(this.ui)this.ui.cancel();this.cancelPending=null;this.ui=null;this.task=null;this.busy=false;this.failed=false;this.state='idle'};
SCENEREADY.keep=async function(image){const src=image.currentSrc||image.src;if(!src||!/^https?:/.test(src)||!window.caches)return;const url=new URL(src,location.href);if(url.origin!==location.origin||! /\.(png|webp|jpe?g|gif|svg)$/i.test(url.pathname))return;const ac=new AbortController();let timer;try{await Promise.race([(async()=>{const cache=await caches.open('eldoria-images-v1');if(await cache.match(url.href))return;const response=await fetch(url.href,{cache:'force-cache',signal:ac.signal});if(response.ok&&/^image\//i.test(response.headers.get('content-type')||''))await cache.put(url.href,response)})(),new Promise(r=>{timer=setTimeout(()=>{this.cacheLimited=true;ac.abort();r()},4000)})])}catch(e){/* Storage quotas do not discard a decoded scene. */this.cacheLimited=true}finally{clearTimeout(timer)}};
SCENEREADY.image=function(image){return new Promise((resolve,reject)=>{
 let ended=false;const clean=()=>{clearTimeout(timer);image.removeEventListener('load',loaded);image.removeEventListener('error',failed)},finish=(ok)=>{if(ended)return;ended=true;clean();image.entryFailed=!ok;ok?resolve():reject(Error('image'))},loaded=()=>{if(!image.naturalWidth)return finish(false);Promise.resolve().then(()=>typeof image.decode==='function'?image.decode():null).then(()=>this.keep(image)).then(()=>finish(true),()=>finish(false))},failed=()=>finish(false),timer=setTimeout(failed,this.timeout);
 image.addEventListener('load',loaded);image.addEventListener('error',failed);
 if(image.entryFailed||image.complete&&!image.naturalWidth){const src=image.currentSrc||image.src;if(!src)return failed();image.src=src}else if(image.complete)loaded();
})};
SCENEREADY.cover=function(){
 const B=window.BOOT106;let root=B&&!B.done&&B.el.isConnected?B.el:null,reuse=!!root;if(!root)root=document.getElementById('entry106');
 if(!root){root=document.createElement('div');root.id='entry106';root.style.cssText='position:fixed;inset:0;z-index:100001;background:#08121e;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:18px;font:600 18px system-ui;text-align:center;padding:24px';root.innerHTML='<div class="st106">กำลังเตรียมฉาก…</div><div style="width:min(450px,80vw);height:12px;background:#283448;border-radius:8px;overflow:hidden"><div class="fill106" style="height:100%;width:0;background:#ffd36b"></div></div><div class="pc106">0%</div>';document.body.appendChild(root);SCENEART.present(root,{id:'town'})}
 if(reuse){B.waitScene=true;clearInterval(B.tick)}
 let retry=root.querySelector('[data-entry-retry]');if(!retry){retry=document.createElement('button');retry.dataset.entryRetry='1';retry.textContent='ลองเตรียมฉากอีกครั้ง';retry.style.cssText='border:0;border-radius:10px;background:#ffd36b;color:#1b2230;padding:12px 22px;font:600 16px system-ui';retry.onclick=()=>tPlay();root.appendChild(retry)}retry.hidden=true;
 const start=reuse?B.p||0:parseInt(root.querySelector('.pc106').textContent)||0;let percent=start;
 return {set:(done,total,text)=>{percent=Math.max(percent,Math.min(99,Math.floor(start+(99-start)*done/total)));if(reuse)B.set(percent,text);else{root.querySelector('.fill106').style.width=percent+'%';root.querySelector('.pc106').textContent=percent+'%';root.querySelector('.st106').textContent=text}},fail:()=>{root.querySelector('.st106').textContent='ยังเตรียมภาพฉากไม่สำเร็จ กรุณาตรวจการเชื่อมต่อแล้วกดลองใหม่';retry.hidden=false},cancel:()=>{if(reuse){B.done=1;clearInterval(B.tick)}root.remove()},close:async()=>{if(reuse){B.allowComplete=true;B.set(100,'ฉากพร้อมแล้ว · กำลังเข้าสู่จุดวาร์ป');B.done=1}else{root.querySelector('.fill106').style.width='100%';root.querySelector('.pc106').textContent='100%';root.querySelector('.st106').textContent='ฉากพร้อมแล้ว · กำลังเข้าสู่จุดวาร์ป'}await new Promise(r=>setTimeout(r,250));root.remove()}};
};
SCENEREADY.jobs=function(){
 const jobs=[];for(const key of Object.keys(DECOR560.sheets))jobs.push(()=>DECOR560.load(key));C2ART.start();for(const im of Object.values(C2ART.img))jobs.push(()=>this.image(im).catch(()=>null));for(const s of Object.values(TOWNART.sheets))jobs.push(async()=>{clearTimeout(s.timer);if(s.state!=='ready'){s.state='loading';TOWNART.settled=false}try{await this.image(s.image);s.state='ready';TOWNART.finish()}catch(e){s.state='failed';TOWNART.finish();throw e}});
 jobs.push(async()=>{await this.image(TOWNFLOOR.image);TOWNFLOOR.state='ready'});
 for(const art of [TREEART])jobs.push(async()=>{await this.image(art.image);art.ready=true;art.failed=false});
 const native=new Set(Object.values(ART).filter(i=>i&&typeof i.addEventListener==='function'&&'naturalWidth'in i));for(const im of native)jobs.push(()=>this.image(im));
 const sheets=new Set(ITEMART.sheets.slice(0,2)),keys=[...Object.keys(inv).filter(k=>inv[k]>0),...(QS.slots||[]),...Object.values(P.armor||{}),'item:'+P.tool+(P.tier[P.tool]||0)];
 for(const key of keys){if(typeof key!=='string')continue;const p=ITEMART.positions.get(ITEMART.key(key))||ITEMART.positions.get('item:'+key);if(p)sheets.add(p.sheet)}
 for(const s of sheets)jobs.push(async()=>{if(s.state==='failed'){s.promise=null;s.state='idle'}if(await ITEMART.load(s)!=='ready')throw Error('item');await this.image(s.image)});
 return jobs;
};
SCENEREADY.enter=function(){
 if(this.task)return this.task;if(this.state==='ready')return Promise.resolve(true);const generation=++this.generation;this.busy=true;this.failed=false;this.state='loading';PAUSED=true;const ui=this.ui=this.cover(),canceled=new Promise(r=>{this.cancelPending=()=>r(null)});
 this.task=(async()=>{try{const jobs=this.jobs();let done=0;ui.set(0,jobs.length+1,'กำลังเตรียมภาพเมืองและไอเท็ม…');const out=await Promise.race([Promise.allSettled(jobs.map(async job=>{await job();if(generation===this.generation)ui.set(++done,jobs.length+1,'กำลังเตรียมภาพเมืองและไอเท็ม… '+done+'/'+jobs.length)})),canceled]);if(!out||generation!==this.generation)return false;if(out.some(r=>r.status==='rejected'))throw Error('assets');
 const pos={x:P.x,y:P.y,dir:P.dir};treeSpr.forEach((c,i)=>{paintTreeArt(c,i+1,[105,98,112][i]);if(c.treeWatch)for(const fn of c.treeWatch)fn()});if(D&&D.town&&!D.shop){buildTown();mkMini(dcv,TW,TH,2.6);Object.assign(P,pos)}ITEMART.refresh();ui.set(++done,jobs.length+1,'กำลังเตรียมจุดวาร์ป…');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));if(generation!==this.generation)return false;this.state='ready';await ui.close();return generation===this.generation;
 }catch(e){if(generation!==this.generation)return false;this.state='failed';this.failed=true;PAUSED=true;ui.fail();return false}})().finally(()=>{if(generation===this.generation){this.busy=false;this.task=null;if(!this.failed)this.ui=null;this.cancelPending=null}});return this.task;
};
window.SCENEREADY=SCENEREADY;
// ---------- A) ปิดหน้าโหลดตอนเปิดเกม ----------
{const B=window.BOOT106;if(B&&B.el){const fin=()=>{if(B.done||B.waitScene)return;B.done=1;clearInterval(B.tick);B.set(99,'พร้อมเข้าสู่หน้าเริ่มเกม');setTimeout(()=>{B.el.style.opacity='0';B.el.style.pointerEvents='none';setTimeout(()=>{try{B.el.remove()}catch(e){}},200)},200)};
  if(window.FM_LOADING)addEventListener('eldoria:ready',()=>setTimeout(fin,250),{once:true});else if(document.readyState==='complete')setTimeout(fin,250);else{addEventListener('load',()=>setTimeout(fin,250),{once:true});setTimeout(fin,8000)}}}
// ---------- B) หน้าโหลดตอนเข้าแมพ ----------
const ZL106=document.createElement('div');ZL106.id='zl106';ZL106.hidden=true;
ZL106.innerHTML='<style>#zl106{position:fixed;inset:0;z-index:9990;background:radial-gradient(ellipse at center,rgba(30,22,60,.92),rgba(6,4,16,.97));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-family:system-ui,"Noto Sans Thai",sans-serif;color:#fff}#zl106[hidden]{display:none}'
 +'#zl106 .nm106{font-size:clamp(20px,4vw,34px);color:#ffe08a;text-shadow:0 0 14px rgba(255,190,90,.5),0 3px 6px #000}#zl106 .bar106{width:min(520px,80vw);height:14px;border-radius:9px;background:rgba(10,8,26,.8);border:2px solid #e8c14a;overflow:hidden;position:relative}'
 +'#zl106 .fill106{position:absolute;inset:0;transform-origin:left;background:linear-gradient(90deg,#c8862a,#ffd86a,#fff2c8);transform:scaleX(.04);will-change:transform}#zl106.run .fill106{animation:zf106 7s cubic-bezier(.15,.8,.3,1) forwards}#zl106.ok .fill106{transform:scaleX(1);animation:none}'
 +'#zl106 .shine106{position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);animation:sh106 1.1s linear infinite;will-change:transform}@keyframes zf106{from{transform:scaleX(.04)}to{transform:scaleX(.92)}}@keyframes sh106{from{transform:translateX(-100%)}to{transform:translateX(100%)}}'
 +'#zl106{background-position:center;background-size:cover;background-repeat:no-repeat;justify-content:flex-end;padding:0 5vw 9vh;box-sizing:border-box}#zl106 .nm106{text-shadow:0 2px 8px #000}#zl106 small{opacity:.85;text-shadow:0 2px 5px #000}</style><div class="nm106"></div><div class="bar106"><div class="fill106"></div><div class="shine106"></div></div><small>กำลังเตรียมฉาก…</small>';
document.body.appendChild(ZL106);
let busy106=false;
const heavy106=i=>{const Zd=ZONES[i];return !!(Zd&&!ZCACHE[i]&&(Zd.big42||(typeof NAT16!=='undefined'&&NAT16[Zd.id])))};
{const _ez=enterZone;enterZone=function(i){if(window.__noDefer106||busy106||!heavy106(i))return _ez.apply(this,arguments);
  const Zd=ZONES[i],self=this,args=arguments;busy106=true;SCENEART.present(ZL106,Zd);ZL106.querySelector('.nm106').textContent=(Zd.e||'🗺️')+' '+(Zd.n||'');ZL106.className='';ZL106.hidden=false;void ZL106.offsetWidth;ZL106.className='run';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{setTimeout(()=>{try{_ez.apply(self,args)}catch(e){console.warn('enterZone',e)}finally{busy106=false;ZL106.className='ok';setTimeout(()=>{ZL106.hidden=true;ZL106.className=''},280)}},30)}))};window.enterZone=enterZone}
}catch(e){console.warn('fix106',e)}
