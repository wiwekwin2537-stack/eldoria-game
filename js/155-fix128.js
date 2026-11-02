// =====================================================================
// fix128 (v5.03)
//  A) อัลติเมท: 8 อาชีพใหม่ (นินจา/สไนเปอร์/พาลาดิน/นักบวช/เนโคร/นักพรต/ดรากูน/ซัมมอนเนอร์) ไม่เคยได้ท่าของตัวเองเลย
//     เพราะ fix28 สลับรหัสอาชีพเป็น "อาชีพแม่แบบ" (ดาบ/เวท/ธนู) ก่อนยิง → ทุกคนได้ท่าดาบ/อุกกาบาต/ธนู ซ้ำกัน
//     → ให้ยิงท่าประจำอาชีพจริง (NEWU73) · และจำกัดดาเมจอัลติต่อเป้า 1 ครั้งที่ใช้ (ท่าหลายจังหวะเดิมทะลุ ×30 ของพลังโจมตี)
//  B) หน้าสถานะ: รวม "คุณสมบัติตัวละคร" มาไว้ใต้ตัวละคร · ช่องสวม/ถอดชุดย้ายมาไว้ใต้ตัวละครทันที · เอาเมนูแยกออก
// =====================================================================
try{
// ---------- A) อัลติเมทประจำอาชีพ ----------
{const _uf=ultFire;ultFire=function(k){try{const c=P.cls;if(window.NEWU73&&NEWU73[c]&&typeof BASEU28!=='undefined'&&BASEU28[c]&&(k===BASEU28[c]||k===c)){NEWU73[c]();return}}catch(e){console.warn('ult128',e)}return _uf.apply(this,arguments)};window.ultFire=ultFire}
/* เพดานดาเมจอัลติต่อเป้า (หน่วย = เท่าของพลังโจมตี หลังคูณ FURY แล้ว) · สายตีเป้าเดี่ยวสูงกว่า · สายฮีล/ถึกต่ำกว่าเพราะได้ฮีล */
const UCAP128={sword:6,mage:6,archer:6,ninja:7,sniper:7,monk:7,paladin:5,cleric:4.5,necro:6,dragoon:6,summoner:6,none:5};window.UCAP128=UCAP128;
const UC128={id:0};
{const _cu=castUlt;castUlt=function(){const was=!!ULT.cast;const r=_cu.apply(this,arguments);try{if(!was&&ULT.cast)UC128.id++}catch(e){}return r};window.castUlt=castUlt}
{const _h=hurtE;hurtE=function(e,mult,o){try{if(o&&o.ult&&e&&isFinite(mult)&&mult>0){const M=window.ULTM7||{base:.55,per:.06,max:15},f=Math.min(M.max,ULT.fury7|0),eff=mult*M.base*(1+f*M.per),cap=UCAP128[P.cls]||6;
  let u=e._u128;if(!u||u.id!==UC128.id)u=e._u128={id:UC128.id,used:0};const left=cap-u.used;if(left<=.02)return 0;if(eff>left)mult*=left/eff;u.used+=Math.min(eff,left)}}catch(er){}return _h.apply(this,arguments)};window.hurtE=hurtE}

// ---------- B) หน้าสถานะ + คุณสมบัติ ----------
const css=document.createElement('style');css.textContent=
 '#chp{width:min(96vw,640px)}#chp .chr{width:calc(var(--fw) + 2*(var(--ss) + var(--g)) + 24px);max-width:100%}'
+'#chp .chr #chpick{width:100%;margin:0}#chpick .emp{font-size:11px;opacity:.7;text-align:center;padding:4px 6px;border:1px dashed #5a554a;border-radius:8px}'
+'#chp .chr #chpick{max-height:230px;overflow:auto;border-radius:10px}'
+'#chpick .bsec{font-size:12px}#chpick .pk{font-size:12px;padding:4px 6px;gap:6px}#chpick .pk img{width:30px!important;height:30px!important}#chpick .pk small{display:block;font-size:10px;opacity:.75}'
+'#chst128{width:100%;display:flex;flex-direction:column;gap:7px}'
+'#chst128 .sc{background:linear-gradient(180deg,rgba(46,38,24,.9),rgba(26,22,16,.9));border:1px solid #e8c14a40;border-radius:10px;padding:6px 8px 7px}'
+'#chst128 .sc>b{display:block;font-size:12px;color:#ffd86a;margin-bottom:4px;letter-spacing:.2px}'
+'#chst128 .gr{display:grid;grid-template-columns:1fr 1fr;gap:3px 10px}'
+'#chst128 .r{display:flex;justify-content:space-between;align-items:baseline;gap:4px;font-size:11.5px;border-bottom:1px dotted #ffffff14;padding:1px 0}'
+'#chst128 .r span{opacity:.78;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#chst128 .r b{color:#fff;font-size:12px;white-space:nowrap}#chst128 .r b.z{opacity:.35;font-weight:normal}'
+'#chst128 .src{font-size:11px;line-height:1.5;opacity:.9}#chst128 .src i{font-style:normal;color:#9fd8ff}'
+'#chst128 .crit{display:flex;gap:6px;margin-bottom:5px}#chst128 .crit div{flex:1;text-align:center;background:#0006;border-radius:8px;padding:3px 2px}#chst128 .crit small{display:block;font-size:10px;opacity:.7}#chst128 .crit b{font-size:15px;color:#ffb46a}'
+'@media (max-width:560px){#chp .chr{width:100%}#chst128 .gr{grid-template-columns:1fr 1fr}}';
document.head.appendChild(css);
const pct=v=>(v*100).toFixed(1).replace(/\.0$/,'')+'%';
function stats128(){let x={},pa={};try{x=PTX()||{}}catch(e){}try{pa=PAX()||{}}catch(e){}
 let cc=0,cd=1.8;try{cc=critCh()}catch(e){}try{cd=1.8+(window.CRITD?CRITD():0)}catch(e){}
 const r=(n,v,z)=>'<div class="r"><span>'+n+'</span><b'+(z?' class="z"':'')+'>'+v+'</b></div>';
 const rp=(n,v,sg)=>r(n,(sg||'+')+pct(v||0),!v);
 let h='<div class="sc"><b>🎯 การโจมตี</b><div class="crit"><div><small>โอกาสคริ</small><b>'+pct(cc)+'</b></div><div><small>ดาเมจคริ</small><b>×'+cd.toFixed(2)+'</b></div></div><div class="gr">'
  +rp('ดาเมจเพิ่ม',x.dmg)+rp('ดาเมจสกิล',x.skill)+rp('ตีเร็ว',x.aspd)+rp('คูลดาวน์',x.cdr,'-')+rp('ใช้มานา',x.mpc,'-')+rp('พื้นที่สกิล',x.area)
  +r('กระสุนเพิ่ม','+'+(x.proj|0),!x.proj)+r('โซ่/วาป','+'+(x.chain|0),!x.chain)+rp('เจาะเกราะ',pa.pen)+'</div></div>';
 h+='<div class="sc"><b>🛡️ เอาตัวรอด</b><div class="gr">'+rp('ลดดาเมจรับ',(x.dr||0)+(pa.dr||0),'-')+rp('เลือดสูงสุด',x.hp)+r('ฟื้นเลือด',((x.hpr||0)*100).toFixed(1)+'%/วิ',!x.hpr)+rp('มานาฟื้น',x.mpr)
  +rp('ต้านคริ',pa.cres)+rp('เดินเร็ว',x.spd)+rp('แรงฟื้น',x.far)+rp('ใช้แรง',x.fac,'-')+'</div></div>';
 if(x.minion||x.mdmg||x.mdur)h+='<div class="sc"><b>🐾 สมุน</b><div class="gr">'+r('สมุนเพิ่ม','+'+(x.minion|0)+' ตัว',!x.minion)+rp('ดาเมจสมุน',x.mdmg)+rp('เวลาสมุน',x.mdur)+'</div></div>';
 if(pa.crit||pa.cdmg||pa.dmg)h+='<div class="sc"><b>🐶 ของสวมสัตว์เลี้ยง</b><div class="gr">'+rp('คริ',pa.crit)+rp('ดาเมจคริ',pa.cdmg)+rp('ดาเมจ',pa.dmg)+'</div></div>';
 const ol=[];for(const sl of ['sword','helm','chest','pants','arm','neck','ring']){const id=P.armor&&P.armor[sl];if(!id||!ITEMS[id])continue;let L=[];try{L=(window.ST111&&ST111.o[id])||[]}catch(e){}
  if(L.length&&window.line111)ol.push('<i>'+ITEMS[id].name+(ENH[id]?' +'+ENH[id]:'')+'</i> — '+L.map(line111).join(', '))}
 if(ol.length)h+='<div class="sc"><b>🎲 ออปชันอุปกรณ์</b><div class="src">'+ol.join('<br>')+'</div></div>';
 const ex=[];for(const f of (window.EXTRA111||[])){try{const q=f();if(q)ex.push('<b style="color:#ffd86a">'+q.n+'</b><br>'+q.txt)}catch(e){}}
 if(ex.length)h+='<div class="sc"><b>✨ โบนัสอื่น ๆ</b><div class="src">'+ex.join('<br>')+'</div></div>';
 return h}
window.stats128=stats128;
{const _rc=renderChar;renderChar=function(){const r=_rc.apply(this,arguments);try{if(chp.hidden)return r;const chr=chp.querySelector('.chr'),pk=gid('chpick');if(!chr)return r;
  if(pk&&pk.parentNode!==chr)chr.appendChild(pk);
  let st=gid('chst128');if(!st){st=document.createElement('div');st.id='chst128';chr.appendChild(st)}else if(st.previousElementSibling!==pk&&pk)chr.appendChild(st);
  st.innerHTML=stats128()}catch(e){console.warn('chst128',e)}return r};window.renderChar=renderChar}
/* เปิด "คุณสมบัติ" จากที่อื่น → ไปหน้าสถานะแทน · เอาปุ่มเมนูแยกออก */
window.open111=()=>{try{const w=gid('cs111');if(w&&window.p6close)p6close(w)}catch(e){}openChar()};
try{const i=PM7.findIndex(m=>m[1]==='คุณสมบัติ');if(i>=0){PM7.splice(i,1);pmRender7()}}catch(e){}
}catch(e){console.warn('fix128',e)}
