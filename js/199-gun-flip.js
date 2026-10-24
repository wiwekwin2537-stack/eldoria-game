/* v5.98 เจ้าของแจ้ง 2026-10-25: สไนหันซ้าย/หันหลัง ปืนคว่ำ (ด้ามชี้ขึ้น) · หันขวา/หันหน้าถูกแล้ว (ให้คงท่าเดิม)
   ต้นเหตุ: ปืนวาดแนวชี้ขวาแล้วหมุนไปทางซ้าย ~180° → ภาพคว่ำ · แก้: ปืนชี้ไปทางซ้าย (cos<0) = กลับด้านตามแนวลำกล้อง มุมเดิม ด้ามลง
   ต้องห่อ drawBow6 ชั้นนอกสุด (fix148/fix101 วาดปืนสไนเองโดยไม่เรียกชั้นใน) → ไฟล์นี้โหลดท้ายสุด · เฉพาะสไน · ธนูนักธนูไม่เปลี่ยน */
(function(){const _db=drawBow6;
 drawBow6=function(x,y,aim){if(P.cls!=='sniper'||!(Math.cos(aim)<-1e-3))return _db.apply(this,arguments);ctx.save();try{ctx.translate(x,y);ctx.rotate(aim);ctx.scale(1,-1);ctx.rotate(-aim);ctx.translate(-x,-y);return _db.apply(this,arguments)}finally{ctx.restore()}};
 window.drawBow6=drawBow6;window.GUNFLIP598=drawBow6;
 if(window.REG136)REG136.push(['สไนหันซ้าย/หันหลัง ปืนไม่คว่ำ · หันขวา/หน้าท่าเดิม (v598)',()=>{if(drawBow6!==window.GUNFLIP598)return'มีชั้นอื่นห่อ drawBow6 ทับตัวกลับด้านปืน';
  const c=document.createElement('canvas');c.width=c.height=20;const k=c.getContext('2d'),sv=ctx,cls=P.cls,seen=[];const inner=_db;try{ctx=k;P.cls='sniper';const st=k.getTransform();drawBow6(10,10,Math.PI+.2,0,0,false,.85);const en=k.getTransform();if(st.a!==en.a||st.d!==en.d)return'ทรานส์ฟอร์มค้างหลังวาดปืน'}catch(e){return'วาดปืนพัง '+e.message}finally{ctx=sv;P.cls=cls}return null}]);
})();
