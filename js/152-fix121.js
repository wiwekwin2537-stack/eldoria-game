// fix121 (v4.99b) — 🔮 ลงแท่นผนึกจากในหอผนึกอสูรไม่ได้ (เจ้าของแจ้ง 2026-10-15: "มันบอกต้องอยู่ทุ่งหญ้า")
// สาเหตุ: fix113 ย้ายแท่นผนึกเข้าไปในอาคาร (D.shop='seal113') แต่ enter62 ห้ามเข้าลานบอสตอนอยู่ในร้าน
// แก้: ถ้าอยู่ในหอผนึก ให้ออกจากอาคาร (leaveShop) กลับเมืองก่อน แล้วค่อยเข้าลานบอสตามปกติ
try{
{const _e=enter62;enter62=function(i){try{if(D&&D.shop==='seal113'&&typeof leaveShop==='function'){leaveShop(true)}}catch(e){console.warn('fix121',e)}return _e.apply(this,arguments)};window.enter62=enter62}
}catch(e){console.warn('fix121',e)}
