// fix118 (v4.98) — 🎟️ จำกัดการลงแท่นผนึกอสูร (เจ้าของแจ้ง 2026-10-15 01:11 "มีเงินลงได้เรื่อย ๆ")
//  บอสตำนานแต่ละตัว ลงได้วันละ 2 ครั้ง (รีเซ็ตเที่ยงคืนเวลาไทย) + คูลดาวน์เดิม (LBCD64)
//  กันทุกทางเข้า: ห่อ enter62 (ปุ่มท้าในหน้าต่าง/เมนู) + ตรวจตอนเข้าลานจริง (ปุ่ม "ท้าอีกครั้ง" ในบทสนทนาเดิมเรียก enter62 ตัวในของ fix62) → เกินโควตา = ถูกส่งกลับ + คืนค่าท้า
//  หน้าต่างหอผนึก (open113) แสดง "🎟️ วันนี้ลงได้อีก x/2" ทุกการ์ด
try{
const LIM=2;const day=()=>new Date(srvNow()+7*3600e3).toISOString().slice(0,10);
// fix123: เก็บแยกตามวัน {d:{'2026-10-15':{0:2}}} — เปลี่ยนเวลาเครื่องไป-กลับ ไม่ทำให้ตัวนับของวันจริงหาย
const QS=(()=>{let d={};try{d=JSON.parse(localStorage.getItem('fm_seal118')||'{}')||{}}catch(e){}const o={d:d.d||{}};if(d.day&&d.n)o.d[d.day]=Object.assign({},o.d[d.day]||{},d.n);return o})();
const Q={get n(){const k=day();return QS.d[k]||(QS.d[k]={})},set n(v){QS.d[day()]=v||{}}};
const sv=()=>{try{const ks=Object.keys(QS.d).sort();while(ks.length>10)delete QS.d[ks.shift()];localStorage.setItem('fm_seal118',JSON.stringify(QS))}catch(e){}};
const chk=()=>{};
const left=i=>{chk();return Math.max(0,LIM-(Q.n[i]|0))};window.seal118left=left;
// fix122: เดิมยกเว้นตอนอยู่ในห้องบอส (in62) + นับเฉพาะตอน "ข้างนอก → เข้าห้อง" → กดท้าซ้ำจากในห้องบอสได้ไม่จำกัด (ไม่ถูกนับ)
//  → ตรวจโควตาทุกครั้งไม่ว่าอยู่ที่ไหน · นับทันทีตอนจ่ายค่าท้าสำเร็จ · ตัวตรวจสำรองดูจาก "ห้องบอสใหม่" (D ใหม่) ไม่ใช่แค่ null→เข้า
let pend=null;
{const _e=enter62;enter62=function(i){if(!SRV.ok){say('⏳ กำลังเทียบเวลากับเซิร์ฟเวอร์ ลองใหม่อีกครั้ง');sfx('thud');return}if(left(i)<=0){say('🎟️ วันนี้ลง'+(LB62[i]?LB62[i].n:'บอสตัวนี้')+'ครบ '+LIM+' ครั้งแล้ว — พรุ่งนี้มาใหม่ (รีเซ็ตเที่ยงคืน)');sfx('thud');return}
 const c0=inv.coin|0;const r=_e.apply(this,arguments);if((inv.coin|0)<c0){chk();Q.n[i]=(Q.n[i]|0)+1;sv();pend=i}return r};window.enter62=enter62}
let wasD=null;
setInterval(()=>{try{const now=(typeof in62==='function'&&in62())?D.lb62:null;if(now!=null&&D!==wasD){try{const B=LB62[now];if(B)say(B.e+' ลานผนึก'+B.n+' — ปราบให้ได้ภายใน 8 นาที หลบวงแดง!')}catch(e){}if(pend===now){pend=null}else{chk();const n=(Q.n[now]|0)+1;if(n>LIM){const B=LB62[now];inv.coin=(inv.coin|0)+((B&&B.cost)|0);try{refreshInv()}catch(e){}say('🎟️ วันนี้ลง'+(B?B.n:'')+'ครบ '+LIM+' ครั้งแล้ว — คืนค่าท้าให้แล้ว');try{leave62()}catch(e){}}else{Q.n[now]=n;sv()}}}wasD=now!=null?D:null}catch(e){}},300);
// แสดงในหน้าต่างหอผนึก
setInterval(()=>{try{const W=document.getElementById('al113');if(!W||W.hidden)return;W.querySelectorAll('.bc113').forEach(card=>{const cv=card.querySelector('canvas[data-b]');if(!cv)return;const i=+cv.dataset.b,l=left(i);let s=card.querySelector('.q118');if(!s){s=document.createElement('span');s.className='q118';const tx=card.querySelector('.tx113');if(tx)tx.appendChild(s)}const t='🎟️ วันนี้ลงได้อีก '+l+'/'+LIM+' ครั้ง';if(s.textContent!==t){s.textContent=t;s.style.color=l>0?'#7ed957':'#ff8a6a';s.style.display='block'}const b=card.querySelector('.bt113 button');if(b&&l<=0)b.disabled=true})}catch(e){}},300);
}catch(e){console.warn('fix118',e)}
