// fix97 (v4.82) — ไอคอนสกิลแบบวงกลมขอบทอง (เจ้าของแนบรูปตัวอย่าง 2026-10-14 14:23)
//  ห่อ skillIcon(ชื่อ): วาดรูปสกิลเดิม (SKART) ตัดเป็นวงกลม + แสงเงาโค้งมน + ขอบทองหนา 2 ชั้นนูน + ประกายเงา · ใช้ได้ทุกที่ที่ใช้ skillIcon (ปุ่มสกิล หน้าต่างสกิล ร้านสกิล)
try{
const SKI97={};
function frame97(src){const S=112,c=document.createElement('canvas');c.width=c.height=S;const q=c.getContext('2d'),cx=S/2,cy=S/2;
 q.fillStyle='rgba(0,0,0,.35)';q.beginPath();q.arc(cx+1.5,cy+3,S/2-3,0,7);q.fill();
 q.save();q.beginPath();q.arc(cx,cy,41,0,7);q.clip();q.drawImage(src,cx-48,cy-48,96,96);
 const v=q.createRadialGradient(cx,cy-8,10,cx,cy,44);v.addColorStop(0,'rgba(255,255,255,0)');v.addColorStop(.75,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.55)');q.fillStyle=v;q.fillRect(0,0,S,S);
 const gl=q.createLinearGradient(0,cy-42,0,cy);gl.addColorStop(0,'rgba(255,255,255,.35)');gl.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=gl;q.beginPath();q.ellipse(cx,cy-20,32,18,0,0,7);q.fill();q.restore();
 // ขอบทอง
 const ring=(r,w,stops)=>{const g=q.createLinearGradient(0,cy-r,0,cy+r);stops.forEach(([o,cc])=>g.addColorStop(o,cc));q.strokeStyle=g;q.lineWidth=w;q.beginPath();q.arc(cx,cy,r,0,7);q.stroke()};
 ring(50,6,[[0,'#5a3a08'],[1,'#2a1a04']]);
 ring(47,7,[[0,'#fff3b8'],[.25,'#f2c95c'],[.55,'#b8862a'],[.8,'#e8b84a'],[1,'#7a5210']]);
 ring(43,2.4,[[0,'#6a4410'],[1,'#3a2406']]);
 q.strokeStyle='rgba(255,255,230,.85)';q.lineWidth=1.6;q.beginPath();q.arc(cx,cy,49,Math.PI*1.15,Math.PI*1.55);q.stroke();
 q.strokeStyle='rgba(255,255,255,.45)';q.lineWidth=1;q.beginPath();q.arc(cx,cy,45.5,Math.PI*1.1,Math.PI*1.7);q.stroke();
 for(const a of [-.8,-.75*Math.PI,.25*Math.PI,.8*Math.PI]){const x=cx+Math.cos(a)*47,y=cy+Math.sin(a)*47;q.fillStyle='#fff6c8';q.beginPath();q.arc(x,y,1.6,0,7);q.fill()}
 return c.toDataURL()}
{const _si=skillIcon;skillIcon=function(name){if(SKI97[name]!==undefined)return SKI97[name];let u=null;try{const fn=SKART[name];if(fn){const c=document.createElement('canvas');c.width=c.height=96;const q=c.getContext('2d');q.lineCap='round';q.lineJoin='round';try{fn(q,96)}catch(e){}u=frame97(c)}}catch(e){u=null}
  if(!u)u=_si.apply(this,arguments);return SKI97[name]=u};window.skillIcon=skillIcon}
// ปุ่มสกิลให้รูปเต็มวงพอดี
{const st=document.createElement('style');st.textContent='#acts .sk.hasi{background-size:100% 100%!important;background-position:center!important;background-repeat:no-repeat!important}';document.head.appendChild(st)}
}catch(e){console.warn('fix97',e)}
