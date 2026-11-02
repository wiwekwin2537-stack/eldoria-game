// fix37.js (v4.40) — เอาทางเข้าถ้ำดันเจี้ยนเก่าในทุ่งหญ้าออก (ดันเจี้ยนย้ายไปอยู่ในปราสาทแล้ว)
// =====================================================================
try{for(let y=0;y<=3;y++)for(let x=W-7;x<=W-3;x++)if(map[y][x]===DOOR)map[y][x]=GRASS}catch(e){}
drawCave=function(){};
// ป้าย "ดันเจี้ยน 100 ชั้น" + จุดบนแผนที่เล็ก: ซ่อน (ยืมตำแหน่ง CV ไว้ให้ระบบเดิมที่ยังอ้างถึงเท่านั้น)
{const _dd=drawDrops;drawDrops=function(){if(D)return _dd.apply(this,arguments);const sx=CV.tx;CV.tx=NaN;try{return _dd.apply(this,arguments)}finally{CV.tx=sx}}}
{const _dm=drawMini;drawMini=function(){const sx=CV.tx;CV.tx=NaN;try{return _dm.apply(this,arguments)}finally{CV.tx=sx}}}
// แผนที่ใหญ่/แผนที่เล็กที่วาดไว้แล้ว: ทาสีมุมถ้ำเป็นหญ้า
try{const k=MINIW.src.getContext('2d'),pp=MINIW.s*T;k.fillStyle='#5a9a45';k.fillRect((W-7)*pp,0,5*pp,4*pp)}catch(e){}

// =====================================================================
