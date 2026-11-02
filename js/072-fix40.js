// fix40 (v4.45) — ดันเจี้ยน: กล่องไม่ดรอปอาวุธ/ชุด/แร่/แท่งแร่แล้ว · ของดรอปลดลง · มอนในเหมือง/ดันเจี้ยนวิ่งไล่ทัน · AGI เพิ่มความเร็วแบบมีเพดาน
try{
const NOORE40=new Set(['stone','iron','copper','silver','gold','gem','diamond','ore','ingSt','ingot','ingCu','ingAg','ingAu','ingDm','wood','woodE','woodF','woodS','woodH','woodG']);
// รางวัลกล่อง: ตัดแร่/แท่งแร่ · เหลือราวครึ่งเดียว (หินตีบวก/ยา/หินพร ยังมีแต่น้อยลง)
{const _rw=dgReward;dgReward=function(f){const R=_rw(f).filter(k=>!NOORE40.has(k));return R.filter((k,i)=>i===0||Math.random()<.5)}}
// เปิดกล่อง: ไม่มีอุปกรณ์ (อาวุธ/ชุด) อีกต่อไป — ต้องคราฟเองจากแร่/ไม้
openChest_=function(){const c=D.chest,f=D.dg;if(!c||c.open)return;c.open=true;sfx('chest');sfx('gem');flash('#ffe9a0',.4);shake(3,.2);
 for(const k of dgReward(f))addDrop(k,c.x,c.y-6);const coins=Math.round(20*Math.min(f,120)*(.8+Math.random()*.4)*.5);inv.coin+=coins;dmgTxt(c.x,c.y-30,'+'+coins+' 🪙','#ffd84a',true);
 for(let i=0;i<30;i++)fx.push({x:c.x,y:c.y-10,vx:(Math.random()-.5)*180,vy:-60-Math.random()*130,l:.9,c:'255,216,74'});refreshInv();
 say('🎁 เปิดกล่องสมบัติชั้น '+f+'! '+(f<DGMAX7()?'ยืนที่กล่องแล้วกด E อีกครั้งเพื่อลงชั้น '+(f+1):'🏆 พิชิตดันเจี้ยนครบแล้ว!'));try{saveX()}catch(e){}};window.openChest_=openChest_;
// มอนในดันเจี้ยน: ของดรอปเหลือครึ่ง และไม่ดรอปแร่/ไม้
{const _ad=addDrop;addDrop=function(type,x,y){if(D&&D.dg&&typeof MK31!=='undefined'&&MK31>0&&type!=='coin'&&type!=='dgkey'){if(NOORE40.has(type)||Math.random()<.5)return}return _ad.apply(this,arguments)};window.addDrop=addDrop}
// มอนในเหมือง/ดันเจี้ยนวิ่งเร็วขึ้น (ไล่ผู้เล่นทัน)
{const _mm=mkMob;mkMob=function(){const m=_mm.apply(this,arguments);try{if(m&&m.F&&!m.F.fast40){m.F=Object.assign({},m.F,{fast40:1});m.F.spd=m.boss?m.F.spd*1.3+20:m.F.spd*1.6+40}}catch(e){}return m}}
}catch(e){console.warn('fix40',e)}
