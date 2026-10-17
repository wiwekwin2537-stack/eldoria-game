// fix88 (v4.78) — เจ้าของสั่ง 2026-10-14 09:24: "เอาอาวุธคลาสไปทำเป็นคราฟ · ไม่ต้องการแยก · เอาอาวุธทั้งหมดเข้าไปให้ผู้เล่นคราฟเอง"
//  โต๊ะคราฟ หมวด ⚔️ อาวุธ: ทุกเซ็ตมีอาวุธประจำอาชีพครบ 11 อาชีพ (cw_<อาชีพ><ระดับ>) เป็นการ์ดคราฟธรรมดา เลือกคราฟอันไหนก็ได้ (อาชีพของเราขึ้นก่อน)
//   สูตรเท่ากับอาวุธเซ็ตชนิดเดียวกัน (ไม่มีค่าหลอมเพิ่มแบบ craftCw42 เดิม) · สวมได้เฉพาะอาชีพนั้น (กฎเดิม fix27) · ป้าย "ถือแล้วเป็น…" ของ fix87 เอาออก
try{
const ORD88=()=>{const L=Object.keys(CW27).filter(c=>CLS[c]&&NEEDW[c]);if(P.cls&&CW27[P.cls])L.sort((a,b)=>(b===P.cls)-(a===P.cls));return L};
window.craftCls88=function(cls,t){t|=0;if(!CW27[cls]||!NEEDW[cls])return;const base=NEEDW[cls]+t,id=cwId27(cls,t);if(!ITEMS[base]||!ITEMS[id])return;
 const g0=GEAR[base]|0;craftSet12(base);if((GEAR[base]|0)!==g0+1)return; // ไม่ผ่าน (ล็อก/ของไม่พอ/กระเป๋าเต็ม) — craftSet12 แจ้งเหตุผลแล้ว
 GEAR[base]--;if(GEAR[base]<=0)delete GEAR[base];GEAR[id]=(GEAR[id]|0)+1;
 try{refreshInv();saveGame(true)}catch(e){}say('⚒️ คราฟ '+ITEMS[id].name+' สำเร็จ! (ใช้ได้เฉพาะ'+CLS[cls].n+') เปิดกระเป๋า 🎒 เพื่อสวมใส่');try{openForge('anvil')}catch(e){}};
{const _ah=anvilHTML;anvilHTML=function(){const h=_ah.apply(this,arguments);try{if(FUI.tab!=='craft'||(FUI.cat||'weapon')!=='weapon')return h;
  const T=document.createElement('template');T.innerHTML=h;const grid=T.content.querySelector('.grid');if(!grid)return h;
  for(const b of grid.querySelectorAll('button.card[onclick^="craftCw42"]'))b.remove();
  for(const em of grid.querySelectorAll('em.cl'))if(/ถือแล้วเป็น/.test(em.textContent)){em.closest('button').classList.remove('cls');em.remove()}
  const gen={};for(const b of grid.querySelectorAll('button.card[onclick^="craftSet12"]')){const m=/craftSet12\('([a-z]+)(\d+)'\)/.exec(b.getAttribute('onclick')||'');if(m)gen[m[1]]={b,t:+m[2]}}
  const first=grid.firstChild;
  for(const c of ORD88()){const g=gen[NEEDW[c]];if(!g)continue;const id=cwId27(c,g.t),it=ITEMS[id];if(!it)continue;
   const n=g.b.cloneNode(true);n.setAttribute('onclick',"craftCls88('"+c+"',"+g.t+")");n.classList.add('cls');
   const im=n.querySelector('img');if(im)im.src=iconURL('item:'+id);const bb=n.querySelector('.tt b');if(bb)bb.textContent=it.name;
   const sm=n.querySelector('.tt small');if(sm)sm.textContent='✨ '+desc26(CW27[c][1])+' · '+String(it.stat||'').split(' · ✨')[0];
   const em=document.createElement('em');em.className='cl';em.textContent=(c===P.cls?'⭐ อาชีพของคุณ · ':'')+'อาวุธเฉพาะ'+CLS[c].n;const tt=n.querySelector('.tt');if(tt)tt.insertBefore(em,sm||null);
   const own=owned(id),ft=n.querySelector('.ft');if(ft){const o=ft.querySelector('.own');if(o)o.remove();if(own){const s=document.createElement('span');s.className='own';s.textContent='มีแล้ว ×'+own;ft.appendChild(s)}}
   grid.insertBefore(n,first)}
  return T.innerHTML}catch(e){console.warn('fix88 forge',e);return h}};window.anvilHTML=anvilHTML}
}catch(e){console.warn('fix88',e)}
