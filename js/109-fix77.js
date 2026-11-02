// fix77 (v4.69) — เจ้าของแจ้ง: Lv.101 ล้ม "ราชันมังกรสวรรค์ Lv.130" (บอสแมพสุดท้าย เลือดแค่ 66,096) ได้แล้ว → เนื้อหาปลายเกมง่ายเกิน
//  1) ช่องว่างเลเวล: ตีมอน/บอสที่เลเวลสูงกว่าเรามากกว่า 3 → ดาเมจลด 3.5%/เลเวล (เหลือต่ำสุด 35%) · มอนเลเวลสูงกว่าตีเราแรงขึ้น 3%/เลเวล (สูงสุด ×2)
//  2) บอสโซน/ดันเจี้ยน (spawnBoss) เลเวล 60+ เลือดคูณ 1+(Lv−60)/25 สูงสุด ×4 (Lv.130 ≈ ×3.8) · โจมตี ×(1+(Lv−60)/80) สูงสุด ×1.9 · ไม่แตะบอสตำนาน/หอคอย/อสูรปาร์ตี้
//  3) XP ปลายเกม: Lv.80+ ×0.75 · Lv.100+ ×0.6 (ซ้อนกับ XPM64 เดิม)
try{
const GAP77=(L)=>{const g=(L|0)-(P.lv|0)-3;return g>0?g:0};window.GAP77=GAP77;
{const _h=hurtE;hurtE=function(e,mult,o){try{if(e&&!e.pvp7&&isFinite(mult)){const g=GAP77(e.L);if(g)mult*=Math.max(.35,1-.035*g)}}catch(er){}return _h.call(this,e,mult,o)};window.hurtE=hurtE}
{const _z=zHurt;zHurt=function(src,dmg,kbm,msg){try{if(src&&!src.pvp7&&!(typeof W33!=='undefined'&&W33.swap)&&isFinite(dmg)){const g=GAP77(src.L);if(g)dmg*=Math.min(2,1+.03*g)}}catch(er){}return _z.call(this,src,dmg,kbm,msg)};window.zHurt=zHurt}
{const _sb=spawnBoss;spawnBoss=function(){const r=_sb.apply(this,arguments);try{const m=D&&D.boss;if(m&&!m.e77&&m.L>=60){const k=Math.min(4,1+(m.L-60)/25);m.hp=m.max=Math.round(m.max*k);m.atk=Math.round(m.atk*Math.min(1.9,1+(m.L-60)/80));m.e77=1}}catch(er){}return r};window.spawnBoss=spawnBoss}
{const _g=gainXp;gainXp=function(n){if(typeof n==='number'&&n>0&&!window.__noXpm64){const k=P.lv>=100?.6:P.lv>=80?.75:1;if(k<1)n=Math.max(1,Math.round(n*k))}return _g.call(this,n)};window.gainXp=gainXp}
}catch(e){console.warn('fix77',e)}
