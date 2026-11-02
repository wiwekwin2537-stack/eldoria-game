// fix63 (v4.60) — สมดุลดาเมจทุกอาชีพ (วัดด้วย tools/scenarios/classdps.js ที่ Lv.100 ของระดับเดียวกัน ร่ายสกิลวน 12 วิ)
//   เดิม: ธนู 1771 · สไนเปอร์ 1637 · นักบวช 1534 · เวท 1375 ... นินจา/พาลาดิน 572 → ห่างกัน 3 เท่า (สไนเปอร์/ธนูจบเนื้อหาไวเกิน)
//   ปรับตัวคูณ CB28.o (สกิล/ยิง) และ MEL51 (ฟันธรรมดาสายประชิด) ให้ทุกอาชีพอยู่ราว 900–1100 เป้าเดี่ยว
try{
const F63={archer:.62,sniper:.6,cleric:.6,mage:.78,necro:1,dragoon:.9,sword:1.1,monk:1.3,summoner:1.4,ninja:1.7,paladin:1.5};window.F63=F63;
for(const c in F63){if(CB28[c])CB28[c].o=Math.round(CB28[c].o*F63[c]*100)/100;if(window.MEL51&&MEL51[c])MEL51[c]=Math.round(MEL51[c]*F63[c]*100)/100}
// PvP: คงความแรงเดิมของแต่ละอาชีพ (หารตัวคูณใหม่ออก) แต่ลดสไนเปอร์/ธนูที่ไล่ฆ่าผู้เล่นง่ายเกิน
try{const PN63={sniper:.75,archer:.85};for(const c in F63)if(PVPCB29[c]!=null)PVPCB29[c]=Math.round(PVPCB29[c]/F63[c]*(PN63[c]||1)*100)/100}catch(e){}
}catch(e){console.warn('fix63',e)}
