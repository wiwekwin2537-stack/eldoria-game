// =====================================================================
// fix147 (v5.04) — 🚪 เข้า-ออกอีเวนต์ต้องกลับที่เดิม (เจ้าของ: "เข้าสู้ในแท่นผนึก ขาออกไปโผล่ในเมือง")
//  ต้นเหตุ 1: leave62 (fix62) ประกาศอยู่ในบล็อก try → ทางออกในลานผนึก (หมดเวลา · ชนะแล้วกดออก · ยอมแพ้) เรียกตัวเก่าตรง ๆ
//            ไม่ผ่านตัวที่แก้ทีหลัง (fix81 กลับหน้าประตู / fix134 กลับหอผนึก) → โผล่เมือง · แก้ในที่: ตัวเก่าส่งต่อให้ตัวล่าสุดก่อน
//  ต้นเหตุ 2: วงเวท "ทางออก" ตรงจุดเกิดของแมพพิเศษ (สนามประลอง · ลานบอสโลก · ตลาดกลาง · ลานผนึก · หอคอย) กด E แล้วใช้ทางออกของเหมือง
//            → โยนไปทุ่งหญ้าหน้าประตูมิติ (ไม่ใช่ที่ที่เดินเข้ามา) · แก้: วงเวทของแมพพิเศษเรียกปุ่มออกของแมพนั้น (ซึ่งพากลับจุดที่เข้ามา)
//  ⚠️ บทเรียน: ฟังก์ชันที่ประกาศใน try{…} ห่อจากข้างนอกไม่ได้ผลกับคนเรียกข้างในบล็อก — ต้องทดสอบ "ทางออกจริงที่ผู้เล่นกด" ไม่ใช่เรียก window.xxx ตรง
// =====================================================================
try{
const EXITS147=[['arena8','leaveArena8'],['wb10','leaveWb10'],['mk10','leaveMk10'],['tower10','leaveTower10'],['duel29','leaveDuel29']];
const exitOf147=()=>{if(!D||!D.zone)return null;if(D.lb62!=null)return 'leave62';for(const [k,f] of EXITS147)if(D[k])return f;return null};
window.exitOf147=exitOf147;
{const _it=interact;interact=function(){try{if(D&&D.zone&&!(DLG&&DLG.open)&&typeof zExitNear==='function'&&zExitNear()){const f=exitOf147();if(f&&typeof window[f]==='function'){window[f]();return true}}}catch(e){console.warn('exit147',e)}return _it.apply(this,arguments)};window.interact=interact}
try{if(window.REG136)REG136.push(
 ['ออกจากอีเวนต์: วงเวททางออกใช้ปุ่มออกของแมพนั้น (ไม่โยนไปทุ่งหญ้า)',async()=>{const sD=D,sx=P.x,sy=P.y;let bad=null;
   for(const [k,f] of [['arena8','leaveArena8'],['wb10','leaveWb10'],['mk10','leaveMk10'],['lb62','leave62']]){const sv=window[f];let hit=0;window[f]=function(){hit=1};
    try{D={zone:{ent:{x:5,y:5},Zd:{id:'t'}},mobs:[]};D[k]=k==='lb62'?0:1;P.x=5*T+16;P.y=7*T+16;try{interact()}catch(e){}}finally{window[f]=sv;D=sD;P.x=sx;P.y=sy}
    if(!hit){bad='วงเวทใน '+k+' ไม่เรียก '+f;break}}return bad}],
 ['ลานผนึก: ทางออกในลาน (ยอมแพ้) ผ่านตัวกลับหอผนึก',async()=>{const sD=D;const sv=window.leave62;let hit=0;window.leave62=function(){hit=1};
   try{D={lb62:0,zone:{},mobs:[]};try{dlgClose(true)}catch(e){}openAltar62();const c=(DLG.ch||[]).find(x=>/ออกจากลาน/.test(x.t||''));try{dlgClose(true)}catch(e){}if(c)c.f()}catch(e){}finally{window.leave62=sv;D=sD}
   return hit?null:'ยอมแพ้ในลานผนึกยังเรียกตัวเก่า (โผล่เมือง)'}]);}catch(e){}
}catch(e){console.warn('fix147',e)}
