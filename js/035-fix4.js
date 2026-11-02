// fix4.js — ชุดแก้ #4 (v4.13)
//  55/92 เปลี่ยนอาชีพ → รีสเตตัส + พาสซีฟ + สกิลอาชีพ (ต้องเก็บ/เรียนใหม่) · 57/61 เลเวลไม่ลดตอนเลือกอาชีพ + เควสเลือกอาชีพ
//  62 ช่องลัด: ปุ่ม ✎ เลือกของใส่ได้ทันที · 63 ค้อน + เมล็ดพันธุ์ ใส่ช่องลัดได้
// =====================================================================
// ---------- เปลี่ยนอาชีพ: ยืนยัน 2 ครั้ง + รีค่าทั้งหมด ----------
window.CLSCONF9={k:null,t:0};
{const _pc=pickClass;pickClass=function(k){
  if(P.lv<CLASS_LV||P.cls===k||P.cls==='none'){const lv0=P.lv,xp0=P.xp;_pc(k);if(P.lv<lv0){P.lv=lv0;P.xp=xp0;try{recalcStats()}catch(e){}}return}
  const now=performance.now();
  if(CLSCONF9.k!==k||now-CLSCONF9.t>6000){CLSCONF9.k=k;CLSCONF9.t=now;sfx('thud');say('⚠️ เปลี่ยนอาชีพ: สเตตัส พาสซีฟ และสกิลอาชีพจะ "รีเซ็ตทั้งหมด" (ได้แต้มคืนให้แจกใหม่) — แตะอีกครั้งภายใน 6 วิเพื่อยืนยัน');return}
  CLSCONF9.k=null;const lv0=P.lv,xp0=P.xp,cost=500;if(inv.coin<cost){_pc(k);return}
  _pc(k);if(P.cls!==k)return;
  try{
   // สเตตัส: คืนแต้มทั้งหมด
   const bs=baseStats();let back=0;for(const s in bs){const v=bs[s]|0;if(v>0){P.stats[s]-=v;back+=v}}
   P.sp=(P.sp|0)+back;
   // พาสซีฟ: รีต้นไม้
   PT.a=new Set(['c0']);savePT();ptDirty();
   // สกิลอาชีพ: ต้องเรียนใหม่ทุกสาย (สกิลกลางยังอยู่)
   for(const c in CSK)for(let i=0;i<CSK[c].length;i++)CSK[c][i]=0;saveCls();
   P.lv=lv0;P.xp=xp0;recalcStats();P.hp=Math.min(P.hp,BAL.hp);P.mp=Math.min(P.mp,BAL.mp);
   try{refreshInv();if(!chp.hidden)renderChar();renderSkw&&!skwEl.hidden&&renderSkw()}catch(e){}
   say('🔄 รีเซ็ตแล้ว: คืนแต้มสเตตัส '+back+' แต้ม · ล้างพาสซีฟ · สกิลอาชีพต้องเรียนใหม่ที่ร้านสกิล (เลเวลคงเดิม Lv.'+P.lv+')');
   try{saveGame()}catch(e){}}catch(e){console.warn('[v413] cls reset',e)}}}
// ---------- เควสเลือกอาชีพ: ขึ้นที่แถบเควสเมื่อถึง Lv.10 แล้วยังไม่มีอาชีพ (ไม่ต้องผ่านบทสอน) ----------
function clsQ9(){return P.cls==='none'&&P.lv>=CLASS_LV}
{const _ut=updTrack;updTrack=function(){const r=_ut.apply(this,arguments);try{if(!qtEl)return r;let g=qtEl.querySelector('.cq9');
   if(!clsQ9()){if(g)g.remove();return r}
   const h='<div class="cq9" style="margin-top:6px;padding-top:5px;border-top:1px solid rgba(255,216,74,.4)"><b>🎓 เควส: เลือกอาชีพ</b>ไปหาปรมาจารย์ซีรอสที่จัตุรัสกลางเมือง (Lv.'+CLASS_LV+' ขึ้นไปแล้ว)</div>';
   if(!g)qtEl.insertAdjacentHTML('beforeend',h);qtEl.hidden=false}catch(e){}return r}}
let _cq9=0;setInterval(()=>{try{if(!titleEl.hidden||P.dead)return;const need=clsQ9();if(need!==!!_cq9){_cq9=need?1:0;updTrack()}
  if(need&&!window._cqSaid9){window._cqSaid9=1;sysSay('🎓 เควสใหม่: ถึง Lv.'+CLASS_LV+' แล้ว! ไปเลือกอาชีพกับปรมาจารย์ซีรอสที่จัตุรัสกลางเมือง');banner&&banner('🎓 เควส: เลือกอาชีพ')}}catch(e){}},1500);
// ---------- ช่องลัด: ค้อน + เมล็ดพันธุ์ + ปุ่ม ✎ ----------
window.SEEDSEL9=null;
{const _qc=qCands;qCands=function(){const L=_qc();try{if(inv.t_hamr>0&&!L.some(c=>c.id==='t_hamr'))L.splice(1,0,{id:'t_hamr',name:FTOOLS.hamr[0]+' '+TIERN[HOME.tools.hamr|0]});
   for(const k in CROPS)if(inv['sd_'+k]>0)L.push({id:'sd_'+k,name:'เมล็ด'+CROPS[k].n,n:inv['sd_'+k]})}catch(e){}return L}}
const qName0=null;
{const _q=quickUseId;quickUseId=function(id){if(typeof id==='string'&&/^sd_/.test(id)){const k=id.slice(3);if(!(inv[id]>0)){say('เมล็ดหมดแล้ว');return}
   SEEDSEL9=k;sfx('ui');
   if(D&&D.home){try{const [tx,ty]=target(),t=HOME.tiles[tx+','+ty];if(t&&t.till&&!t.crop){plant(tx,ty,k);return}}catch(e){}say('🌱 เลือก'+('เมล็ด'+CROPS[k].n)+' แล้ว — ยืนหน้าแปลงที่ขุดแล้ว กดใช้ (E) เพื่อปลูก')}
   else say('🌱 เลือกเมล็ด'+CROPS[k].n+' แล้ว — ใช้ในที่ดินผู้กล้า');return}
  return _q(id)}}
{const _sp=seedPicker;seedPicker=function(tx,ty){const k=SEEDSEL9;if(k&&CROPS[k]&&inv['sd_'+k]>0){plant(tx,ty,k);return}return _sp(tx,ty)}}
// ปุ่ม ✎ มุมช่อง → เปิดตัวเลือกของทันที (แตะที่ช่องยังใช้ของเหมือนเดิม)
for(let i=0;i<4;i++){const el=document.getElementById('q'+i);if(!el||el.querySelector('.qe9'))continue;const b=document.createElement('span');b.className='qe9';b.textContent='✎';
 b.style.cssText='position:absolute;right:-2px;top:-6px;width:20px;height:20px;border-radius:50%;background:#1A1A24;border:1.5px solid #D4AF37;color:#D4AF37;font-size:12px;line-height:17px;text-align:center;z-index:3;cursor:pointer;touch-action:manipulation';
 b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();clearTimeout(QS.lp);QS.lp=null;openQPick(i)};b.onpointerup=e=>{e.stopPropagation()};el.style.position=el.style.position||'relative';el.appendChild(b)}

// =====================================================================
