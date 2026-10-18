// =====================================================================
// fix149 (v5.06) — 🌳 ต้นไม้ในทุ่งหญ้าตัดแล้วไม่งอกใหม่ (เจ้าของแจ้ง: "ต้นไม้ไม่เกิด ผู้เล่นเยอะตัดจนหมด" — ทั้งทุ่งเหลือแต่ตอ)
//  ต้นเหตุ: hitTree (ต้นไม้ทุ่งหญ้า) ตั้ง alive=false + เปลี่ยนช่องเป็นตอ (STUMP) แล้วไม่มีโค้ดคืนต้นไม้เลย
//   (แร่ในทุ่ง/ต้นไม้ในแมพอื่น chop15 มีเวลางอกใหม่อยู่แล้ว · เฉพาะต้นไม้ทุ่งหญ้าที่ตกหล่น)
//  แก้ (เฉพาะจุด ห่อ updWorld เดิม): ตอแต่ละต้นงอกกลับเป็นต้นไม้เต็มต้นใน ~2 นาที (สุ่ม 100–140 วิ)
//   · ไม่งอกทับตัวผู้เล่น (ยืนห่าง 48px ขึ้นไปก่อน) · มีใบไม้ฟุ้งตอนงอก · ไม้/แอปเปิลที่ได้เท่าเดิม
// =====================================================================
try{
const RG149=[100,140];
const rgT149=()=>RG149[0]+Math.random()*(RG149[1]-RG149[0]);
function regrow149(dt){
  if(window.FW&&FW.act())return; /* v5.12: เชื่อมเซิร์ฟเวอร์ → เซิร์ฟเวอร์คุมการงอกใหม่ */
  for(const tr of trees){if(tr.alive||tr.border)continue;
   if(tr.rg149==null){tr.rg149=rgT149();continue}
   tr.rg149-=dt;if(tr.rg149>0)continue;
   if(map[tr.ty][tr.tx]!==STUMP){tr.rg149=null;continue}
   if(Math.hypot(P.x-tr.px,P.y-(tr.ty*T+16))<48){tr.rg149=3;continue}
   if(falling.some(f=>f.tr===tr)){tr.rg149=2;continue}
   map[tr.ty][tr.tx]=TREE;tr.alive=true;tr.hp=tr.max;tr.shake=0;tr.bar=0;tr.fade=0;tr.rg149=null;
   for(let k=0;k<8;k++)fx.push({x:tr.px+(Math.random()-.5)*36*tr.sc,y:tr.ty*T+20-Math.random()*40*tr.sc,vx:(Math.random()-.5)*40,vy:-20-Math.random()*30,l:.7,c:'90,190,80'})}
 }
window.regrow149=regrow149;
{const _u=updWorld;updWorld=function(dt){_u(dt);try{regrow149(dt)}catch(e){}};window.updWorld=updWorld}
/* REG136 */
try{if(window.REG136)REG136.push(
 ['ต้นไม้ทุ่งหญ้าที่ตัดแล้วงอกใหม่ (fix149)',async()=>{const tr=trees.find(t=>t.alive&&!t.border&&map[t.ty][t.tx]===TREE);if(!tr)return null;
   const sv={x:P.x,y:P.y,hp:tr.hp,fl:falling.length};let bad=null;
   try{P.x=tr.px+400;P.y=tr.ty*T+400;tr.alive=false;tr.hp=0;map[tr.ty][tr.tx]=STUMP;tr.rg149=null;
    for(let i=0;i<200&&!tr.alive;i++)regrow149(1);
    if(!tr.alive||map[tr.ty][tr.tx]!==TREE||tr.hp!==tr.max)bad='ตอไม่กลับเป็นต้นไม้ภายใน 200 วิ'}
   catch(e){bad='error '+e.message}finally{map[tr.ty][tr.tx]=TREE;tr.alive=true;tr.hp=sv.hp;tr.rg149=null;P.x=sv.x;P.y=sv.y;falling.length=Math.min(falling.length,sv.fl)}
   return bad}]);}catch(e){}
}catch(e){console.warn('fix149',e)}
