// fix47 (v4.53) — ด่วน: น้ำหนักกระเป๋าเป็น NaN (ของเซ็ตระดับ 6–11 ไม่มีค่าใน GWT) → เกมคิดว่าแบกเกิน เดิน/เก็บของไม่ได้
// + (แก้ในที่ fix40) กุญแจดันเจี้ยนไม่โดนสุ่มทิ้ง 50% อีกแล้ว
try{
const GWT47=[1.1,1.05,1,.95,.9,.85];for(let t=GWT.length;t<12;t++)GWT[t]=GWT47[(t-6)%6];
for(const id in ITEMS){const it=ITEMS[id];if(it&&it.kind&&!(it.kind in GWB))GWB[it.kind]=1}
// กันพลาดซ้ำ: ถ้ายังมีของที่คิดน้ำหนักไม่ได้ ให้นับเป็น 1 แทน NaN
{const _bw=bagWeight;bagWeight=function(){let w=NaN;try{w=_bw()}catch(e){}if(Number.isFinite(w))return w;let s=0;const g=id=>{let v=NaN;try{v=ITEMS[id]?gearW(id):NaN}catch(e){}return Number.isFinite(v)?v:1};
 for(const k in WT){const v=(inv[k]||0)*WT[k];if(Number.isFinite(v))s+=v}for(const id in GEAR){const n=+GEAR[id]||0;s+=n*g(id)}for(const k in P.armor)if(P.armor[k])s+=g(P.armor[k]);return Math.round(s*10)/10};window.bagWeight=bagWeight}
}catch(e){console.warn('fix47',e)}
