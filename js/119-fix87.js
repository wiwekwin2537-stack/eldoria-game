// fix87 (v4.77) — HANDOFF ข้อ 34 (เจ้าของแจ้ง): อาวุธประจำอาชีพซ้ำ 2 ระบบ — มังค์ถือดาบ / ต่อยแล้วเป็นท่าดาบ
//  ต้นเหตุ: หน้าตาอาวุธอาชีพ (สนับมือ/ทวน/คาตานะ/ไรเฟิล/เคียว/ไม้เท้า ฯลฯ ของ fix25) ขึ้นเฉพาะตอนถือไอเท็ม cw_<อาชีพ><ระดับ> (fix27/fix42)
//   แต่อาวุธจากโต๊ะคราฟเซ็ต (fix12/fix53) และของดรอปบอส (fix59) เป็นดาบ/คทา/ธนูธรรมดา → ถือแล้วเป็นดาบธรรมดา + พลังพิเศษอาชีพไม่ทำงาน
//  แก้ให้เหลือระบบเดียว: "อาวุธทุกชิ้นที่ชนิดตรงกับอาชีพ = อาวุธประจำอาชีพ" — ถือแล้วหน้าตาเป็นของอาชีพ (ทุกระดับ/ทุกแหล่ง) + ได้พลังพิเศษอาชีพ (CW27)
//   ไอเท็ม cw_ ที่ผู้เล่นมีอยู่ยังใช้ได้เหมือนเดิม (ไม่ได้พลังซ้ำ) · โต๊ะคราฟเลิกโชว์การ์ดอาวุธอาชีพแยก (ซ้ำกับการ์ดอาวุธของเซ็ต) แล้วติดป้ายบอกที่การ์ดอาวุธเซ็ตแทน
//  + มังค์ตีธรรมดา: แสงวงดาบ (slashTrail) → แสงหมัด
try{
const cwMine87=()=>{try{const c=P.cls;return !!(c&&c!=='none'&&typeof CW27!=='undefined'&&CW27[c]&&NEEDW[c]&&P.armor.sword&&ITEMS[P.armor.sword]&&wKind()===NEEDW[c])}catch(e){return false}};
window.cwMine87=cwMine87;
// หน้าตา: ใช้ทั้งตอนวาดตัวเราและผู้เล่นอื่น (drawOther สลับ P.cls/P.armor ให้แล้ว)
window.cwOk25=cwMine87;
// พลังพิเศษอาชีพ: อาวุธธรรมดาที่ตรงอาชีพก็ได้ (ไอเท็ม cw_ ได้จาก fix27 อยู่แล้ว ไม่บวกซ้ำ)
{const _px=PTX;PTX=function(){if(_ptx)return _ptx;const o=_px();try{if(!window.__IN_OTHER8){const it=ITEMS[P.armor.sword];if(it&&!it.cls&&cwMine87()){const f=CW27[P.cls][1];for(const k in f)o[k]=(o[k]||0)+f[k]}}}catch(e){}return o};window.PTX=PTX}
// เปลี่ยนอาชีพ/เปลี่ยนอาวุธทางไหนก็ตาม → คำนวณพลังใหม่
{let key='';setInterval(()=>{try{const k=P.cls+'|'+(P.armor.sword||'');if(k!==key){const first=!key;key=k;if(!first)ptDirty()}}catch(e){}},700)}
// มังค์ตีธรรมดา: แสงหมัดแทนวงดาบ
function punch87(cx,cy,to,r,al){const a=to-Math.PI/2,px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r,A=Math.max(0,Math.min(1,al));ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
 for(let i=-1;i<=1;i++){const b=a+i*.16;ctx.strokeStyle='rgba(255,205,120,'+(.55*A)+')';ctx.lineWidth=i?1.6:2.6;ctx.beginPath();ctx.moveTo(cx+Math.cos(b)*r*.35,cy+Math.sin(b)*r*.35);ctx.lineTo(cx+Math.cos(b)*r*.95,cy+Math.sin(b)*r*.95);ctx.stroke()}
 const R=7+(1-A)*9,g=ctx.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,'rgba(255,240,190,'+A+')');g.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g;ctx.fillRect(px-R,py-R,R*2,R*2);
 ctx.strokeStyle='rgba(255,215,140,'+(.7*A)+')';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(px,py,R*.8,0,7);ctx.stroke();ctx.restore()}
{const _st=slashTrail;slashTrail=function(cx,cy,from,to,r,tier,al){try{if(P.cls==='monk'&&!(typeof isRng==='function'&&isRng())){punch87(cx,cy,to,r,al);return}}catch(e){}return _st.apply(this,arguments)};window.slashTrail=slashTrail}
// มังค์ตีธรรมดา: ท่าต่อยหมัดตรง (แทนท่าฟันดาบ + ริบบิ้นดาบของ slashFx) — สลับมือซ้าย/ขวาตามคอมโบ
function burst87(px,py,u,big){if(u<0||u>1)return;ctx.save();ctx.globalCompositeOperation='lighter';const A=1-u,R=(big?9:6)+12*u,g=ctx.createRadialGradient(px,py,0,px,py,R);
 g.addColorStop(0,'rgba(255,245,200,'+A+')');g.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g;ctx.fillRect(px-R,py-R,R*2,R*2);ctx.strokeStyle='rgba(255,215,140,'+(.8*A)+')';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(px,py,R*.75,0,7);ctx.stroke();ctx.restore()}
{const _sf=slashFx;slashFx=function(x,by,d,side,f,TOP,held){try{if(P.cls==='monk'&&typeof swOn6==='function'&&swOn6()&&P.cmb!==2&&!P.skAt){
  const p=P.at,sh=swShoulder6(x,by,d,f),v=DIRV[d]||[f,0],side2=P.cmb===1?1:-1;
  const e=p<.16?-.3*(p/.16):p<.28?-.3+1.3*((p-.16)/.12):p<.42?1:p<.64?1-(p-.42)/.22:0,reach=5+16*Math.max(0,e);
  const sx=sh[0]+(v[1]?side2*3:0),sy=sh[1]+2,hx=sx+v[0]*reach,hy=sy+4+v[1]*reach*.8;
  if(p>.2&&p<.5){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,220,150,'+(.5*(1-(p-.2)/.3))+')';ctx.lineWidth=1.4;ctx.lineCap='round';
   for(const o of [-3,0,3]){const ox=-v[1]*o,oy=v[0]*o;ctx.beginPath();ctx.moveTo(hx-v[0]*14+ox,hy-v[1]*12+oy);ctx.lineTo(hx-v[0]*3+ox,hy-v[1]*3+oy);ctx.stroke()}ctx.restore()}
  swArm6(sx,sy,hx,hy,TOP,d==='d'?-1:d==='u'?1:-f);held(hx,hy,Math.atan2(v[0],-v[1]));
  if(p>=.26&&p<.62)burst87(hx+v[0]*7,hy+v[1]*6,(p-.26)/.36,P.cmb===1);return}}catch(e){}
  return _sf.apply(this,arguments)};window.slashFx=slashFx}
// โต๊ะคราฟ: ซ่อนการ์ดอาวุธอาชีพแยก · ติดป้ายที่การ์ดอาวุธเซ็ตชนิดของอาชีพเรา
{const _ah=anvilHTML;anvilHTML=function(){const h=_ah.apply(this,arguments);try{if(P.cls==='none'||!CW27[P.cls]||!NEEDW[P.cls])return h;
  const t=document.createElement('template');t.innerHTML=h;const cw=t.content.querySelector('button.card[onclick^="craftCw42"]');if(cw)cw.remove();
  const kind=NEEDW[P.cls],W=CW27[P.cls];let n=0;
  for(const b of t.content.querySelectorAll('button.card[onclick^="craftSet12"]')){const m=/craftSet12\('([a-z]+)(\d+)'\)/.exec(b.getAttribute('onclick')||'');if(!m||m[1]!==kind)continue;
   const tt=b.querySelector('.tt');if(!tt)continue;const em=document.createElement('em');em.className='cl';em.textContent='⭐ '+CLS[P.cls].n+'ถือแล้วเป็น'+W[0]+' · '+desc26(W[1]);tt.insertBefore(em,tt.querySelector('small'));b.classList.add('cls');n++}
  return (cw||n)?t.innerHTML:h}catch(e){return h}};window.anvilHTML=anvilHTML}
}catch(e){console.warn('fix87',e)}
