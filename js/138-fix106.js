// fix106 (v4.91) — ⏳ หน้าโหลด (เจ้าของขอ 2026-10-14 19:51: "เปิดเกมแล้วให้ทำภาพขึ้นมา แล้วมี ui ขีดกำลังวิ่ง รอให้เสร็จก่อน" · "เข้าแมพตัดต้นไม้บนมือถือแล้วค้าง")
//  A) หน้าโหลดตอนเปิดเกม: บล็อก boot106 อยู่ต้น <body> (ซอร์ส patches/boot106.html) ขึ้นทันทีพร้อมรูป assets/loading.jpg + ขีดโหลด
//     ขีดเดินตามจำนวนสคริปต์ที่โหลดแล้ว · ตรงนี้ (ท้ายไฟล์) รอหน้าเว็บโหลดครบ แล้วเติม 100% และค่อย ๆ หายไป
//  B) เข้าแมพป่า/แมพธรรมชาติครั้งแรก: การวาดแผนที่ใหญ่ใช้เวลาหลายวินาที (มือถือนานกว่า) จอเลยดูค้าง
//     → ขึ้นหน้า "กำลังโหลดแมพ" (ชื่อแมพ + ขีดวิ่ง) ก่อน แล้วค่อยสร้างแมพ · ขีดเป็นแอนิเมชันที่วิ่งต่อได้แม้เครื่องกำลังคำนวณ
//     แมพที่เคยเข้าแล้ว (อยู่ใน ZCACHE) เข้าทันทีเหมือนเดิม
try{
// ---------- A) ปิดหน้าโหลดตอนเปิดเกม ----------
{const B=window.BOOT106;if(B&&B.el){const fin=()=>{if(B.done)return;B.done=1;clearInterval(B.tick);B.set(100,'พร้อมแล้ว!');setTimeout(()=>{B.el.style.opacity='0';B.el.style.pointerEvents='none';setTimeout(()=>{try{B.el.remove()}catch(e){}},600)},380)};
  B.set(95,'กำลังเตรียมโลก…');if(document.readyState==='complete')setTimeout(fin,250);else{addEventListener('load',()=>setTimeout(fin,250),{once:true});setTimeout(fin,8000)}}}
// ---------- B) หน้าโหลดตอนเข้าแมพ ----------
const ZL106=document.createElement('div');ZL106.id='zl106';ZL106.hidden=true;
ZL106.innerHTML='<style>#zl106{position:fixed;inset:0;z-index:9990;background:radial-gradient(ellipse at center,rgba(30,22,60,.92),rgba(6,4,16,.97));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-family:system-ui,"Noto Sans Thai",sans-serif;color:#fff}#zl106[hidden]{display:none}'
 +'#zl106 .nm106{font-size:clamp(20px,4vw,34px);color:#ffe08a;text-shadow:0 0 14px rgba(255,190,90,.5),0 3px 6px #000}#zl106 .bar106{width:min(520px,80vw);height:14px;border-radius:9px;background:rgba(10,8,26,.8);border:2px solid #e8c14a;overflow:hidden;position:relative}'
 +'#zl106 .fill106{position:absolute;inset:0;transform-origin:left;background:linear-gradient(90deg,#c8862a,#ffd86a,#fff2c8);transform:scaleX(.04);will-change:transform}#zl106.run .fill106{animation:zf106 7s cubic-bezier(.15,.8,.3,1) forwards}#zl106.ok .fill106{transform:scaleX(1);animation:none}'
 +'#zl106 .shine106{position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);animation:sh106 1.1s linear infinite;will-change:transform}@keyframes zf106{from{transform:scaleX(.04)}to{transform:scaleX(.92)}}@keyframes sh106{from{transform:translateX(-100%)}to{transform:translateX(100%)}}'
 +'#zl106 small{opacity:.75}</style><div class="nm106"></div><div class="bar106"><div class="fill106"></div><div class="shine106"></div></div><small>กำลังโหลดแมพ… (ครั้งแรกจะนานหน่อย)</small>';
document.body.appendChild(ZL106);
let busy106=false;
const heavy106=i=>{const Zd=ZONES[i];return !!(Zd&&!ZCACHE[i]&&(Zd.big42||(typeof NAT16!=='undefined'&&NAT16[Zd.id])))};
{const _ez=enterZone;enterZone=function(i){if(window.__noDefer106||busy106||!heavy106(i))return _ez.apply(this,arguments);
  const Zd=ZONES[i],self=this,args=arguments;busy106=true;ZL106.querySelector('.nm106').textContent=(Zd.e||'🗺️')+' '+(Zd.n||'');ZL106.className='';ZL106.hidden=false;void ZL106.offsetWidth;ZL106.className='run';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{setTimeout(()=>{try{_ez.apply(self,args)}catch(e){console.warn('enterZone',e)}finally{busy106=false;ZL106.className='ok';setTimeout(()=>{ZL106.hidden=true;ZL106.className=''},280)}},30)}))};window.enterZone=enterZone}
}catch(e){console.warn('fix106',e)}
