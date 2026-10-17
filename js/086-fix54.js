// fix54 (v4.56) — เมือง: (1) หอคอยไม่จาง/วาบเหมือนต้นไม้ตอนเดินไปหน้าประตู (จางเฉพาะตอนเดินอ้อมไปหลังหอจริง ๆ และค่อย ๆ จาง)
//   (2) ต้นไม้บังป้ายร้าน: ต้นที่ (2,9) บังป้ายร้านอาวุธ → ย้ายไป (1,9) · ต้นที่ (29,3) บังป้ายคลัง → เอาออก
//   (3) เปลี่ยนชื่อ "โกดังรับฝากของลุงคลัง" → "คลังสมบัติเอลโดเรีย" · เจ้าของ "ลุงคลัง" → "ฮาโรลด์ ผู้ดูแลคลัง"
try{
try{const W=(window.SD||SHOP_DATA).ware||SHOP_DATA.ware;if(W){W.name='คลังสมบัติเอลโดเรีย';if(W.owner)W.owner.name='ฮาโรลด์ ผู้ดูแลคลัง'}}catch(e){}
const isTwr54=p=>p&&p.prop&&p.w===200&&p.h===300;
const isTree54=(p,x,y)=>p&&p.prop&&p.w===80&&p.h===92&&Math.abs(p.x0-(x*T-24))<1&&Math.abs(p.y0-(y*T-58))<1;
function town54(){if(!(D&&D.town))return;try{const L=TOWNPROPS;
 for(let i=L.length-1;i>=0;i--){const p=L[i];
  if(isTree54(p,29,3)){L.splice(i,1);if(dm[3])dm[3][29]=0;if(D.stalls){const j=D.stalls.indexOf(p);if(j>=0)D.stalls.splice(j,1)}}
  else if(isTree54(p,2,9)){p.x0-=T;if(dm[9]){dm[9][2]=0;dm[9][1]=1}}}}catch(e){console.warn('fix54 town',e)}}
{const _bt=buildTown;buildTown=function(){const r=_bt.apply(this,arguments);town54();return r};window.buildTown=buildTown}
// หอคอย: จางนุ่ม ๆ เฉพาะตอนผู้เล่นอยู่หลังตัวหอจริง
{const _ds=drawStall;drawStall=function(s,t){if(!isTwr54(s))return _ds(s,t);
 const behind=P.y<s.base-3*T&&P.y>s.y0+20&&P.x>s.x0+30&&P.x<s.x0+s.w-30,tg=behind?.55:1;s.al54=s.al54==null?1:s.al54+(tg-s.al54)*.15;
 ctx.globalAlpha=s.al54;ctx.drawImage(s.cv,s.x0,s.y0);ctx.globalAlpha=1};window.drawStall=drawStall}
// เมืองที่สร้างไปแล้วก่อนแพตช์นี้ (เข้าเกมครั้งแรก) → สร้างใหม่ให้ชื่อป้าย/ต้นไม้ถูกต้อง
try{if(D&&D.town&&!D.shop){buildTown();mkMini(dcv,TW,TH,2.6)}}catch(e){console.warn('fix54 rebuild',e)}
}catch(e){console.warn('fix54',e)}
