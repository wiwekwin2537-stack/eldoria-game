// fix50 (v4.54) — ดันเจี้ยนต้องลงได้ทุกชั้นไม่ติด: กุญแจจากบอสเข้ากระเป๋าทันที (เดิมตกพื้น → ถ้าไม่ได้เก็บ/ตาย/ออกก่อน = ลงต่อไม่ได้)
try{
{const _ad=addDrop;addDrop=function(type,x,y){if(type==='dgkey'&&D&&D.dg){inv.dgkey=(inv.dgkey|0)+1;try{refreshInv();saveGame(true)}catch(e){}
  try{dmgTxt(x,y-40,'🗝️ +1 กุญแจ','#ffd84a',true)}catch(e){}return}return _ad.apply(this,arguments)};window.addDrop=addDrop}
// ฟันธรรมดา (รวมท่าฟันต่อท้ายสกิลพุ่ง) ห้ามทะลุกำแพงบาง 1 ช่อง — ถ้ามีกำแพงคั่น ให้ข้ามมอนตัวนั้นในจังหวะฟันนี้
{const _um=updMob;updMob=function(m,dt){try{if(m&&P.tool==='sword'&&P.at>=0&&P.at<1&&m.last!==atkId&&D&&D.zone&&Math.abs(m.x-P.x)<110&&Math.abs(m.y-P.y)<110&&wall50(P.x,P.y-6,m.x,m.y-6))m.last=atkId}catch(e){}return _um.apply(this,arguments)};window.updMob=updMob}
}catch(e){console.warn('fix50',e)}
