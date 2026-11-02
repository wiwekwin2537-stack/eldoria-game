// fix68 (v4.61) — ⚒️ ตีบวกมีโอกาสแหกจริง (เดิม ENHCFG.ALWAYS_SUCCESS=true ตั้งแต่ v4.7 → สำเร็จ 100% ทำให้ผู้เล่น +15 ทั้งตัว)
//   · แจ้งผลชัดเจน: ✨ ตีบวกสำเร็จ / 💥 แหก! · แหกสะสม 3 ครั้ง = 💔 อุปกรณ์พัง (โบนัสตีบวกหายจนกว่าจะซ่อม ตีบวกต่อไม่ได้)
//   · ซ่อมที่ช่างหนวดเหล็ก (บอริน) → ได้ระดับเดิมคืน + ล้างตัวนับแหก · เก็บใน ENH['c68_<id>'] (นับแหก) / ENH['b68_<id>'] (ระดับก่อนพัง) → เซฟไปกับ ENH เดิม
try{
ENHCFG.ALWAYS_SUCCESS=false;
try{if(!window.gbW66)window.gbW66=document.getElementById('gb66')}catch(e){} // แก้ปุ่ม ✕ คู่มือ (fix66) ที่อ้างตัวแปรไม่ global
const BRK68=3,ck68=id=>'c68_'+id,bk68=id=>'b68_'+id;
const cracks68=id=>ENH[ck68(id)]|0,broken68=id=>cracks68(id)>=BRK68;
const repCost68=l=>({coin:300*(l+1)*(l+1),stone:1+Math.ceil(l/3)});
window.broken68=broken68;window.cracks68=cracks68;
const brokenList68=()=>Object.keys(ENH).filter(k=>k.startsWith('c68_')&&(ENH[k]|0)>=BRK68).map(k=>k.slice(4)).filter(id=>ITEMS[id]);
window.brokenList68=brokenList68;
// ตีบวกไม่ได้ถ้าพัง
{const _c=enhCheck7;enhCheck7=function(id){if(id&&broken68(id))return '💔 อุปกรณ์นี้พัง (แหกครบ '+BRK68+' ครั้ง) — นำไปซ่อมกับช่างหนวดเหล็กก่อน';return _c.apply(this,arguments)};window.enhCheck7=enhCheck7}
// หลังตี: นับแหก / พัง
{const _s=enhStart7;enhStart7=function(){const id=ENHS.sel,was=ENHS.busy;_s.apply(this,arguments);const r=ENHS.res;if(was||!r||r.id!==id||r.c68!=null)return;
  if(r.ok){r.c68=cracks68(id)}else{const c=cracks68(id)+1;ENH[ck68(id)]=c;r.c68=c;
   if(c>=BRK68){ENH[bk68(id)]=ENH[id]|0;ENH[id]=0;r.brk=1;r.to=0;try{r.s1=enhStat7(id,0)}catch(e){}try{recalcStats();refreshInv()}catch(e){}}
   try{saveGame(true)}catch(e){}}};window.enhStart7=enhStart7}
// แจ้งผลหลังตีเสร็จ (แบนเนอร์ใหญ่ + ข้อความแชต)
{const _e=forgeEnd7;forgeEnd7=function(){const r=_e.apply(this,arguments);try{const R=ENHS.res;if(R){const nm=ITEMS[R.id].name;
  if(R.ok){banner('✨ ตีบวกสำเร็จ!',nm+' +'+R.to,'');sysSay('✨ ตีบวกสำเร็จ! '+nm+' +'+R.from+' → +'+R.to)}
  else if(R.brk){banner('💔 อุปกรณ์พัง!',nm+' แหกครบ '+BRK68+' ครั้ง — ไปซ่อมที่ช่างหนวดเหล็ก','');sysSay('💔 '+nm+' พัง! โบนัสตีบวกหายจนกว่าจะซ่อมกับช่างหนวดเหล็ก (ระดับเดิม +'+(ENH[bk68(R.id)]|0)+' จะกลับมาหลังซ่อม)')}
  else{banner('💥 แหก! ตีบวกล้มเหลว',nm+(R.to<R.from?' ลดเหลือ +'+R.to:' ระดับคงเดิม +'+R.to)+' · แหกสะสม '+R.c68+'/'+BRK68,'');sysSay('💥 แหก! '+nm+' +'+R.from+' → +'+R.to+' · แหกสะสม '+R.c68+'/'+BRK68+(R.c68===BRK68-1?' ⚠️ อีกครั้งเดียวจะพัง!':''))}}}catch(e){}return r};window.forgeEnd7=forgeEnd7}
// หน้าตีบวก: หัวข้อผลเป็นภาษาไทย + ตัวนับแหก + ป้ายพัง
{const _r=enhRender7;enhRender7=function(){const r=_r.apply(this,arguments);try{const W=enhW;if(!W||W.hidden&&!ENHS.open)return r;
  const R=ENHS.res;const h2=W.querySelector('.res h2');
  if(R&&h2){h2.textContent=R.ok?'✨ ตีบวกสำเร็จ! ✨':R.brk?'💔 แหก! อุปกรณ์พัง':'💥 แหก! ตีบวกล้มเหลว';if(!R.ok)h2.style.color=R.brk?'#ff5a6a':'#ff9a8a';
   const lv=W.querySelector('.res .lvl');if(lv)lv.insertAdjacentHTML('afterend','<div style="font:700 13px system-ui,\'Noto Sans Thai\';margin:6px 0;color:'+(R.brk?'#ff8a8a':(R.c68>=2?'#ffb35a':'#d8d0b8'))+'">'+(R.brk?'💔 พังแล้ว — ซ่อมได้ที่ช่างหนวดเหล็ก (ร้านอาวุธ) ระดับ +'+(ENH[bk68(R.id)]|0)+' จะกลับคืน':'🔨 แหกสะสม '+(R.c68|0)+'/'+BRK68+(R.c68===BRK68-1?' — ⚠️ แหกอีกครั้งจะพัง!':''))+'</div>')}
  for(const b of W.querySelectorAll('.rowE')){const m=/enhSel7\('([^']+)'\)/.exec(b.getAttribute('onclick')||'');if(!m)continue;const id=m[1],c=cracks68(id);
   const t=b.querySelector('b');if(t&&broken68(id))t.insertAdjacentHTML('beforeend',' <span style="color:#ff6a7a">💔พัง</span>');else if(t&&c>0)t.insertAdjacentHTML('beforeend',' <span style="color:#ffb35a;font-size:11px">🔨'+c+'/'+BRK68+'</span>')}
 }catch(e){}return r};window.enhRender7=enhRender7}
// ซ่อมที่ช่างหนวดเหล็ก
function repair68(id){const l=ENH[bk68(id)]|0,c=repCost68(l),it=ITEMS[id];if(!it||!broken68(id))return;
 if((inv.coin|0)<c.coin||(inv.estone|0)<c.stone){say('ซ่อมต้องใช้ 🪙 '+c.coin.toLocaleString()+' + 💎 หินเสริมพลัง ×'+c.stone);sfx('thud');return false}
 inv.coin-=c.coin;inv.estone-=c.stone;ENH[id]=l;delete ENH[bk68(id)];delete ENH[ck68(id)];try{recalcStats();refreshInv();saveGame(true)}catch(e){}
 sfx('chest');try{anvilFx()}catch(e){}banner('🔧 ซ่อมเสร็จ!',it.name+' กลับมา +'+l,'');sysSay('🔧 บอรินซ่อม '+it.name+' เรียบร้อย — กลับมา +'+l+' (ตัวนับแหกเริ่มใหม่)');return true}
window.repair68=repair68;
function repairMenu68(){const o=D.owner,L=brokenList68();if(!L.length){talk(o,'ไม่มีอะไรพังนี่ ของเจ้ายังดีอยู่ ระวังตอนตีบวกด้วยล่ะ แหกครบ '+BRK68+' ครั้งเมื่อไหร่ ของพังแน่!',[BYE]);return}
 talk(o,'โอ้โห… พังยับเลย! ข้าซ่อมให้ได้ ระดับตีบวกเดิมจะกลับคืนมา แต่ไม่ฟรีนะ:',L.slice(0,6).map(id=>{const l=ENH[bk68(id)]|0,c=repCost68(l);return {t:'🔧 '+ITEMS[id].name+' (+'+l+') · 🪙'+c.coin.toLocaleString()+' 💎'+c.stone,c:'go',f:()=>{repair68(id)}}}).concat([BYE]),'ช่างหนวดเหล็ก')}
window.repairMenu68=repairMenu68;
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot.apply(this,arguments);try{if(id==='gear'&&DLG.open&&Array.isArray(DLG.ch)){const n=brokenList68().length;DLG.ch.splice(1,0,{t:(n?'❗ ':'')+'🔧 ซ่อมอุปกรณ์ที่พัง'+(n?' ('+n+')':''),c:n?'go':'',f:repairMenu68});if(!DLG.typing)try{dlgShowChoices()}catch(e){}}}catch(e){}return r};window.ownerTalk=ownerTalk}
}catch(e){console.warn('fix68',e)}
