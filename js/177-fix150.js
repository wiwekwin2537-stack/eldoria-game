// =====================================================================
// fix150 (v5.07) — ✨ ใส่ชุดแฟชั่นแล้วเอฟเฟคตีบวกของชุดหลักหาย (เจ้าของแจ้ง 2026-10-16: "แฟชั่นไม่แสดงเอฟเฟคตีบวก")
//  ต้นเหตุ: ตัวห่อ hero ของแฟชั่น (fix6) ล้าง P.armor (หมวก/เสื้อ/กางเกง/แขน) ชั่วคราวตอนวาดคอสตูม
//   fix100 แก้ไว้แค่ออร่า 3D (info60) · ยังเหลืออีก 2 เอฟเฟคที่อ่านชุดจาก P.armor ตรง ๆ แล้วเห็นช่องว่าง:
//   1) eqGlitter — ประกายวิบวับบนชุด (ชิ้นที่ตีบวก +3 ขึ้นไป)
//   2) armorAura — ลูกแสงลอยรอบตัว (ตีบวกรวม +12) + วงแหวนหมุนใต้เท้า (ตีบวกรวม +40) + สีรูนบนชุด
//  แก้ (เฉพาะชุด): ตอนวาดคอสตูม ให้ 2 เอฟเฟคนี้อ่านจากชุดหลักจริง (แบบเดียวกับ fix100) · ค่าพลัง/หน้าตาคอสตูมไม่เปลี่ยน
//   ผู้เล่นคนอื่นเห็นด้วย (drawOther ใช้ hero เส้นทางเดียวกัน)
// =====================================================================
try{
const SL150=['helm','chest','pants','arm'];
let ARM150=null;
window.LAST150={g:0,a:-1};
{const _h=hero;hero=function(){const sv=ARM150;try{ARM150=P.armor?{helm:P.armor.helm,chest:P.armor.chest,pants:P.armor.pants,arm:P.armor.arm}:null}catch(e){ARM150=null}
  try{return _h.apply(this,arguments)}finally{ARM150=sv}};window.hero=hero}
function main150(fn,self,args){if(!(window._fashOn&&ARM150&&P.armor))return fn.apply(self,args);
 const sv={};for(const s of SL150)sv[s]=P.armor[s];Object.assign(P.armor,ARM150);
 try{return fn.apply(self,args)}finally{Object.assign(P.armor,sv)}}
{const _g=eqGlitter;eqGlitter=function(){return main150(function(){LAST150.g=SL150.filter(s=>P.armor[s]).length;return _g.apply(this,arguments)},this,arguments)};window.eqGlitter=eqGlitter}
{const _a=armorAura;armorAura=function(){return main150(function(){const r=_a.apply(this,arguments);try{LAST150.a=r?r.L:-1}catch(e){}return r},this,arguments)};window.armorAura=armorAura}
/* REG136 */
try{if(window.REG136)REG136.push(
 ['ใส่ชุดแฟชั่นยังเห็นเอฟเฟคตีบวกของชุดหลัก (fix150)',async()=>{const body=Object.keys(OUTFIT||{})[0];if(!body)return null;
   const ids={helm:'helm5',chest:'chest5',pants:'pants5',arm:'arm5'};for(const s in ids)if(!ITEMS[ids[s]])return null;
   const sv={a:Object.assign({},P.armor),fb:FASH.body,e:{},dead:P.dead},s0=ctx,c=document.createElement('canvas');c.width=c.height=160;let bad=null;
   try{for(const s in ids){sv.e[ids[s]]=ENH[ids[s]];ENH[ids[s]]=12;P.armor[s]=ids[s]}FASH.body=body;P.dead=false;ctx=c.getContext('2d');LAST150.g=0;LAST150.a=-1;
    try{hero()}catch(e){}
    if(LAST150.g<4)bad='ประกายบนชุดไม่เห็นชุดหลักตอนใส่แฟชั่น';else if(LAST150.a<48)bad='ลูกแสง/วงแหวนตีบวกไม่เห็นชุดหลักตอนใส่แฟชั่น';
    if(!bad&&SL150.some(s=>P.armor[s]!==ids[s]))bad='ชุดหลักหายหลังวาดแฟชั่น'}
   catch(e){bad='error '+e.message}finally{ctx=s0;Object.assign(P.armor,sv.a);FASH.body=sv.fb;P.dead=sv.dead;for(const k in sv.e){if(sv.e[k]==null)delete ENH[k];else ENH[k]=sv.e[k]}}
   return bad}]);}catch(e){}
}catch(e){console.warn('fix150',e)}
