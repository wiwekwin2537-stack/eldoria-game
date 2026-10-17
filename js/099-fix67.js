// fix67 (v4.60) — กันโกงฝั่งเครื่องผู้เล่น: ปิดโหมด GM (อมตะ/ไม่มีคูลดาวน์) ถ้าไม่ใช่ GM จริง · ค่าในกระเป๋าติดลบ/NaN/เกินจริง → แก้ · ตีบวกเกิน +20 → +20 · เลเวลเกิน 150 → 150
//   (เซิร์ฟเวอร์ accounts.js v4.60: เลเวลกระโดดผิดปกติ = ติดธง ไม่ขึ้นตารางอันดับ)
try{
const dev67=location.protocol==='file:'&&/devtest=1/.test(location.search);
setInterval(()=>{try{if(dev67)return;const gm=typeof gmAllowed==='function'&&gmAllowed();
 if(!gm&&typeof GM7!=='undefined'&&(GM7.god||GM7.nocd)){GM7.god=false;GM7.nocd=false}
 for(const k in inv){const v=inv[k];if(typeof v==='number'&&(!Number.isFinite(v)||v<0))inv[k]=0;if(k==='coin'&&v>5e9)inv.coin=5e9}
 for(const id in ENH){if(!(ENH[id]>=0))ENH[id]=0;else if(ENH[id]>20)ENH[id]=20}
 const mx=typeof MAXLV!=='undefined'?MAXLV:150;if(P.lv>mx)P.lv=mx;if(!(P.lv>=1))P.lv=1;
 for(const id in GEAR){const n=GEAR[id];if(!Number.isFinite(n)||n<0)delete GEAR[id];else if(n>999)GEAR[id]=999}}catch(e){}},3000);
}catch(e){console.warn('fix67',e)}
