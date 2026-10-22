// fix127 (v5.02) — ✨ ออร่าชุด (เจ้าของขอ 2026-10-16)
//  1) ชุดที่ยังไม่ตีบวก ไม่วิบวับ: ประกายบนชุดขึ้นเฉพาะชิ้นที่ตีบวก +3 ขึ้นไป · ออร่า 3D (fix60) ต้องตีบวกเฉลี่ย +4 ขึ้นไป (เดิมใส่ครบเซ็ต +0 ก็ขึ้น)
//  2) ประกายไม่บังตัว: ชุดบอสระดับสูง (เช่น มังกรโลหิต) เคยมีประกายใหญ่ 3–6 เท่า → ขนาดเท่าระดับเพชรสูงสุด
//  3) ออร่าแบบเดิมทุกอย่าง (วงเวท · วงแหวนโคจร · เสาแสง · มงกุฎ) — แต่ "ปีก" (+13 ขึ้นไป) เปลี่ยนทรงตามเซ็ต:
//     ชุดมังกร = ปีกมังกร (พังผืด+กระดูก) · ชุดน้ำแข็ง = ปีกผลึกน้ำแข็ง · ชุดเงา = ปีกเงาขาดวิ่น · ชุดพงไพร = ปีกใบไม้ · นอกนั้น = ปีกแสงแบบเดิม
//  4) ป้ายความหายากของชุด เรียงตามเลเวลที่ต้องใช้ ใช้ป้ายเดียวกันทุกแหล่ง (เดิมชุดบอส Lv.110 ป้าย "ตำนาน" ต่ำกว่าชุดคราฟ Lv.80 "เทพ")
try{
// เซ็ต (ระดับ) → ทรงปีก   2 มังกรเพลิง · 15 มังกรโลหิต · 19 แม่ทัพอสูรเพลิง = มังกร | 3 ผลึกน้ำแข็ง · 13 เขี้ยวเหมันต์ · 17 ราชินีหิมะ = น้ำแข็ง
//                          0 นักล่าเงา · 16 จักรพรรดิเงา · 8 วิญญาณอนธการ = เงา | 1 พฤกษาโบราณ · 6 พิทักษ์พงไพร · 11 หนามพงไพร = ใบไม้
const WSTYLE127={2:'dragon',15:'dragon',19:'dragon',3:'ice',13:'ice',17:'ice',0:'shadow',16:'shadow',8:'shadow',1:'leaf',6:'leaf',11:'leaf'};
window.WSTYLE127=WSTYLE127;
function wing127(x,y,t,rgb,I,po){const st=WSTYLE127[I&&I.tier];if(!st)return false;const flap=Math.sin(t*2.6)*.12;
 /* v5.68: po = ท่าตามทิศจาก pose60 (fix60) — ปีกติดด้านหลังตัว */const L=po&&po.list||[[-1,1,1],[1,1,1]],ox=po&&po.ox||0;
 for(const [s,k,wa] of L){ctx.save();ctx.globalAlpha=wa==null?1:wa;ctx.translate(x+ox+s*5,y-31);ctx.scale(s*(k||1),1);ctx.rotate(-.18+flap);
  if(st==='dragon'){// ปีกมังกร: กระดูกนิ้ว 4 ซี่ + พังผืดขอบหยัก
   const tips=[[40,-30],[46,-14],[42,0],[32,10]];ctx.globalCompositeOperation='source-over';
   const mg=ctx.createLinearGradient(0,0,46,0);mg.addColorStop(0,'rgba('+rgb+',.55)');mg.addColorStop(1,'rgba('+rgb+',.22)');ctx.fillStyle=mg;
   ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,-26);ctx.lineTo(tips[0][0],tips[0][1]);
   for(let k=1;k<tips.length;k++){const [px,py]=tips[k-1],[qx,qy]=tips[k];ctx.quadraticCurveTo((px+qx)/2-5,(py+qy)/2-1,qx,qy)}
   ctx.quadraticCurveTo(14,12,0,6);ctx.closePath();ctx.fill();
   ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,230,190,.75)';ctx.lineWidth=1.6;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,-26);ctx.lineTo(tips[0][0],tips[0][1]);ctx.stroke();
   ctx.lineWidth=1;for(let k=1;k<tips.length;k++){ctx.beginPath();ctx.moveTo(18,-26);ctx.lineTo(tips[k][0],tips[k][1]);ctx.stroke()}
   ctx.fillStyle='rgba(255,240,210,.9)';ctx.beginPath();ctx.moveTo(18,-26);ctx.lineTo(16,-31);ctx.lineTo(21,-27);ctx.closePath();ctx.fill()}
  else if(st==='ice'){// ปีกผลึกน้ำแข็ง: เกล็ดผลึกยาวกางเป็นพัด
   ctx.globalCompositeOperation='lighter';const sh=[[-.95,36],[-.6,40],[-.25,34],[.1,26],[.4,18]];
   for(const [a,l] of sh){ctx.save();ctx.rotate(a);const g=ctx.createLinearGradient(0,0,l,0);g.addColorStop(0,'rgba(255,255,255,.65)');g.addColorStop(1,'rgba('+rgb+',.12)');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(2,0);ctx.lineTo(l*.55,-4);ctx.lineTo(l,0);ctx.lineTo(l*.55,4);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(235,250,255,.6)';ctx.lineWidth=.8;ctx.stroke();ctx.restore()}
   const tw=.5+.5*Math.sin(t*5);ctx.fillStyle='rgba(255,255,255,'+tw+')';ctx.fillRect(30,-30,4,1);ctx.fillRect(31.5,-31.5,1,4)}
  else if(st==='shadow'){// ปีกเงา: ขาดวิ่น สีมืด ขอบเรือง
   ctx.globalCompositeOperation='source-over';const g=ctx.createLinearGradient(0,0,40,0);g.addColorStop(0,'rgba(20,8,36,.7)');g.addColorStop(1,'rgba(20,8,36,.15)');ctx.fillStyle=g;
   ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(16,-30,40,-24);const jag=[[34,-16],[39,-10],[30,-6],[35,2],[24,0],[26,8],[12,5]];for(const [px,py] of jag)ctx.lineTo(px+Math.sin(t*3+px)*1.2,py);ctx.lineTo(0,6);ctx.closePath();ctx.fill();
   ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba('+rgb+',.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(16,-30,40,-24);ctx.stroke()}
  else if(st==='leaf'){// ปีกใบไม้ 3 ใบ
   ctx.globalCompositeOperation='lighter';for(const [a,l] of [[-.75,34],[-.3,38],[.15,28]]){ctx.save();ctx.rotate(a);const g=ctx.createLinearGradient(0,0,l,0);g.addColorStop(0,'rgba('+rgb+',.55)');g.addColorStop(1,'rgba('+rgb+',.1)');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(l*.5,-9,l,0);ctx.quadraticCurveTo(l*.5,9,0,0);ctx.fill();ctx.strokeStyle='rgba(230,255,200,.5)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(l*.9,0);ctx.stroke();ctx.restore()}}
  ctx.restore()}
 return true}
window.wing127=wing127;
// ---------- ป้ายความหายากของชุด: เรียงตามเลเวลที่ต้องใช้ ----------
try{const RL=lv=>lv>=180?['อมตะ','#6affff']:lv>=150?['เทพนิยาย','#ff6ad8']:lv>=100?['ศักดิ์สิทธิ์','#fff6a0']:lv>=80?['เทพ','#ff5a8a']:lv>=60?['ตำนาน','#ffb03a']:lv>=40?['ฮีโร่','#c88aff']:lv>=20?['หายาก','#5ab4ff']:lv>=5?['ไม่ธรรมดา','#7ad86a']:['ทั่วไป','#c8c8d8'];
 window.RARELV127=RL;
 for(let t=0;t<=10;t++){const lv=t===0?1:t<=8?((SMQ[t]&&SMQ[t].lv)|0):t===9?105:128;if(RARE12[t])RARE12[t]=RL(lv)}
 if(window.B59)for(const S of B59)if(S&&S.lv!=null)S.r=RL(S.lv);
 if(window.B101)for(const S of B101)if(S&&S.lv!=null)S.r=RL(S.lv)}catch(e){console.warn('fix127 rare',e)}
}catch(e){console.warn('fix127',e)}
