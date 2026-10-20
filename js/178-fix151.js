// =====================================================================
// fix151 (v5.07) — ⚔️ อาวุธตีบวกไม่มีเอฟเฟค (ผู้เล่นแจ้ง 2026-10-16: "เอฟเฟคเดิมของอาวุธ +15 ไม่ติด · ไม่ใส่แฟชั่นก็ไม่มีเอฟเฟค เหมือนอาวุธไม่ได้บวก")
//  ต้นเหตุ (มีมาตั้งแต่ fix25 ไม่ได้เกิดจาก v5.05–5.06 — วัดแล้วเวอร์ชัน 5.04 บนเว็บก็เป็นเหมือนกัน):
//   ออร่าตีบวกอาวุธ (แสงตามใบ + ลูกแสงหมุน + ประกาย) ผูกไว้กับตัววาดอาวุธ "ปกติ" (toolSpr)
//   1) อาวุธอาชีพ 7 สาย (นินจา/พาลาดิน/มังค์/ดรากูน/นักบวช/เนโคร/ซัมมอนเนอร์) วาดด้วยตัววาดของอาชีพเอง (fix25) แล้วจบเลย → ไม่มีออร่า
//   2) อาวุธแฟชั่นของดาบ/คทา (และอาชีพอื่น) ก็ข้ามตัววาดปกติเหมือนกัน → ใส่แฟชั่นแล้วออร่าตีบวกหาย
//  แก้ (เฉพาะจุด ห่อ toolSpr ชั้นนอกสุด): ถ้าถืออาวุธที่ตีบวก/มีรูน แล้วรอบนั้นยังไม่มีออร่าถูกวาด → วาดออร่าแบบเดียวกับดาบปกติ (fix เดิมบรรทัด wAura)
//   ตามความยาวอาวุธแต่ละแบบ · สี/ความแรงตามระดับตีบวกและรูนเหมือนเดิม · ค่าพลังไม่เปลี่ยน
// =====================================================================
try{
let EMIT151=0;
{const _e=auraEmit;auraEmit=function(){EMIT151++;return _e.apply(this,arguments)};window.auraEmit=auraEmit}
const LEN151={ninja:32,paladin:34,dragoon:50,cleric:40,necro:40,summoner:40,monk:9};
function aura151(hx,hy,ang,d,W){const t=performance.now()/1000,tx=hx+Math.sin(ang)*d,ty=hy-Math.cos(ang)*d,bx=hx+Math.sin(ang)*Math.min(8,d*.3),by=hy-Math.cos(ang)*Math.min(8,d*.3);
 ctx.save();ctx.globalCompositeOperation='lighter';const pul=.75+.25*Math.sin(t*(4+W.L*.3)),a=Math.min(.75,(.16+W.L*.035+(W.r?.12+.06*W.r.g:0))*pul);
 ctx.lineCap='round';ctx.strokeStyle='rgba('+W.rgb+','+a*.45+')';ctx.lineWidth=7+W.L*.5;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(tx,ty);ctx.stroke();
 ctx.strokeStyle='rgba('+W.rgb2+','+a*.7+')';ctx.lineWidth=2.5;ctx.stroke();
 if(W.L>=7||W.r){const g=ctx.createRadialGradient(tx,ty,0,tx,ty,8+W.L*.6);g.addColorStop(0,'rgba('+W.rgb2+','+a+')');g.addColorStop(1,'rgba('+W.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(tx-20,ty-20,40,40)}
 if(W.L>=10){const n=W.L>=15?4:2;for(let i=0;i<n;i++){const q=t*3+i*Math.PI*2/n,ox=Math.cos(q)*9,oy=Math.sin(q)*4,mx=(bx+tx)/2+ox,my=(by+ty)/2+oy-Math.sin(q)*6;const g=ctx.createRadialGradient(mx,my,0,mx,my,5);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba('+W.rgb+',0)');ctx.fillStyle=g;ctx.fillRect(mx-5,my-5,10,10)}}
 ctx.restore();auraEmit(bx,by,tx,ty,W,DT||0,1)}
window.aura151=aura151;
{const _ts=toolSpr;toolSpr=function(hx,hy,ang){const n0=EMIT151;const r=_ts.apply(this,arguments);
  try{if(EMIT151===n0&&P.tool==='sword'&&P.draw&&P.armor&&P.armor.sword){const W=wAura();if(W){const c=P.cls,kd=wKind();
    const own=window.cwOk25&&cwOk25()&&((STAFF25.has(c)&&kd==='staff')||(MELEE25.has(c)&&kd==='sword'));
    let d=own?(LEN151[c]||30):kd==='staff'?29.5:kd==='bow'?13:30,a=ang;
    aura151(hx,hy,a,d,W)}}}catch(e){}
  return r};window.toolSpr=toolSpr}
/* REG136 */
try{if(window.REG136)REG136.push(
 ['อาวุธตีบวกมีออร่าทุกอาชีพ ทั้งปกติและแฟชั่น (fix151)',async()=>{const sv={cls:P.cls,w:P.armor.sword,tool:P.tool,draw:P.draw,at:P.at,fw:FASH.wpn,tier:P.tier.sword},s0=ctx,c=document.createElement('canvas');c.width=c.height=200;const bad=[];
   try{ctx=c.getContext('2d');for(const cl of Object.keys(CW27)){const id='cw_'+cl+'5';if(!ITEMS[id])continue;const e0=ENH[id];P.cls=cl;P.armor.sword=id;ENH[id]=15;P.tier.sword=5;P.tool='sword';P.draw=1;P.at=-1;
     for(const fw of [null,Object.keys(FWPN||{}).find(f=>FWPN[f].cls===cl)||null]){FASH.wpn=fw;const n0=EMIT151;try{toolSpr(100,120,.3)}catch(e){}if(EMIT151===n0)bad.push(cl+(fw?'+แฟชั่น':''))}
     if(e0==null)delete ENH[id];else ENH[id]=e0}}
   catch(e){bad.push('error '+e.message)}finally{ctx=s0;P.cls=sv.cls;P.armor.sword=sv.w;P.tool=sv.tool;P.draw=sv.draw;P.at=sv.at;FASH.wpn=sv.fw;P.tier.sword=sv.tier}
   return bad.length?'ไม่มีออร่า: '+bad.join(', '):null}]);}catch(e){}
}catch(e){console.warn('fix151',e)}
