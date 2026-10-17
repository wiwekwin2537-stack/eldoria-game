// fix114 (v4.95) — 🛤️ ทางขวาของเมืองเอลโดเรีย = ถนนสู่นครวารี (เจ้าของขอ 2026-10-14 21:55 · เลือก "ย้ายบ้านเข้าเมือง 1")
//  - เอาปุ่ม 🏙️ เมือง 2 ออกจากเมนูตัวละคร · ประตูขวาของเมือง (เดิมไปที่ดินผู้กล้า) → เดินออกไปนครวารีอัสตราเมื่อถึง Lv.150 (C2.LV) · ยังไม่ถึง = ขึ้นบอกว่าปลดล็อกเมื่อไร
//  - ที่ดินผู้กล้าเลิกใช้ (ไม่มีฉากที่ดินแล้ว) → บ้านย้ายมาเป็น "บ้านของคุณ" หลังคาเขียว มุมซ้ายบนของเมือง: นอนรับบัฟ/สร้าง-อัปเกรดบ้านได้เหมือนเดิม (ข้อมูล HOME เดิมไม่หาย)
//  - แก้เนื้อเรื่อง: บทที่ 13 (มอบบ้านแทนโฉนดที่ดิน) · บทที่ 27 (เดินถนนตะวันออกแทนล่องเรือ) · บทส่งท้าย (สร้างบ้านในเมือง) · บทที่พูดถึงแท่นผนึก → ผู้เฝ้าแท่นผนึกในเมือง
//  - กลับจากนครวารี → ถึงเมืองเอลโดเรียที่ประตูขวา
try{
const LV114=()=>(window.C2&&C2.LV)||150;
// 1) เมนู
try{const i=PM7.findIndex(m=>m[1]==='เมือง 2');if(i>=0){PM7.splice(i,1);pmRender7()}}catch(e){}
// 2) ประตูขวา
let msgT114=0;
{const _h=dhit;dhit=function(x,y){if(D&&D.town&&!D.shop&&x+7>=(TW-1)*T&&y>14*T&&y<19*T){if(P.lv>=LV114()){for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);if(!dm[ty]||(dm[ty][tx]!==FL&&dm[ty][tx]!==GATE))return true}return false}const n=performance.now();if(n-msgT114>2500){msgT114=n;say('🔒 ถนนสู่นครวารีอัสตรา — เปิดเมื่อถึง Lv.'+LV114()+' (ตอนนี้ Lv.'+P.lv+')');sfx('thud')}return true}return _h.apply(this,arguments)};window.dhit=dhit}
{const _ex=exitD;exitD=function(){if(D&&D.town&&!D.shop&&P.x>(TW-3)*T){if(P.lv<LV114()){P.x=(TW-3.5)*T;return}if(exitD.busy114)return;exitD.busy114=1;setTimeout(()=>{exitD.busy114=0},2500);P.x=(TW-4)*T;try{enterCity2()}catch(e){console.warn(e)}return}return _ex.apply(this,arguments)};window.exitD=exitD}
// ป้ายบอกทาง (วาดที่ประตูขวาในเมือง)
const SIGN={x:TW-3,y:14.6,sign114:1},HSN={x:7.1,y:6.4,house114:1};
{const _ds=drawStall;drawStall=function(s,t){if(s&&s.sign114){const x=(TW-2.6)*T,y=14.3*T,open=P.lv>=LV114();ctx.save();ctx.fillStyle='#4a2e16';ctx.fillRect(x-2,y,4,26);ctx.fillStyle=open?'#2a5a8a':'#4a3a2a';ctx.strokeStyle='#e8c14a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-34,y-14);ctx.lineTo(x+26,y-14);ctx.lineTo(x+34,y-5);ctx.lineTo(x+26,y+4);ctx.lineTo(x-34,y+4);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.fillText((open?'🌊 ':'🔒 ')+'นครวารี →',x-2,y-2);ctx.restore();return}
 if(s&&s.house114){const x=HSN.x*T,y=HSN.y*T;ctx.save();ctx.fillStyle='#4a2e16';ctx.fillRect(x-2,y,4,22);ctx.fillStyle='#7a4e26';ctx.strokeStyle='#3a2410';ctx.lineWidth=1.5;ctx.fillRect(x-30,y-14,60,16);ctx.strokeRect(x-30,y-14,60,16);ctx.fillStyle='#ffe8b0';ctx.font='bold 9px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.fillText('🏠 บ้านของคุณ',x,y-3);ctx.restore();return}
 return _ds.apply(this,arguments)};window.drawStall=drawStall}
setInterval(()=>{try{if(D&&D.town&&!D.shop&&D.stalls){if(!D.stalls.includes(SIGN))D.stalls.push(SIGN);if(!D.stalls.includes(HSN))D.stalls.push(HSN)}}catch(e){}},500);
// กลับจากนครวารี → ประตูขวา
try{const _b=backToCity1;backToCity1=function(){LoadingScreenManager.cover({icon:'🛤️',title:'เมืองเอลโดเรีย',tip:'เดินทางกลับทางถนนตะวันออก'},()=>{try{exitD()}catch(e){}try{enterTown()}catch(e){}try{P.x=(TW-4)*T;P.y=16.6*T;P.dir='l'}catch(e){}})};window.backToCity1=backToCity1}catch(e){}
// 3) ที่ดิน → บ้านในเมือง
const HX=5.5*T,HY=7*T+14;
function house114(){if(HOME.house>0){houseMenu();return}talk({name:'บ้านของคุณ',c:'#8a5a2a'},'บ้านหลังนี้ยกให้ผู้กล้าแล้ว แต่ยังต้องซ่อมแซมก่อนเข้าอยู่ — สร้างบ้านแล้วจะนอนพักรับบัฟค่าพลังได้ทุกคืน',[{t:'🔨 สร้าง/อัปเกรดบ้าน',c:'go',f:()=>openLife('house')},BYE],'🏠 บ้านของคุณ')}
window.house114=house114;
{const _ta=townAct;townAct=function(){try{if(D&&D.town&&!D.shop&&Math.hypot(P.x-HX,P.y-HY)<44){house114();return true}}catch(e){}return _ta.apply(this,arguments)};window.townAct=townAct}
{const _eh=enterHome;enterHome=function(){say('🏠 ที่ดินผู้กล้าย้ายมาเป็น "บ้านของคุณ" ในเมืองเอลโดเรียแล้ว (หลังคาเขียว มุมซ้ายบน)');sfx('ui');try{if(!(D&&D.town))toTown()}catch(e){}};window.enterHome=enterHome}
{const _oz=openZMenu;openZMenu=function(){const r=_oz.apply(this,arguments);try{shopEl.querySelectorAll('button').forEach(b=>{if(/enterHome/.test(b.getAttribute('onclick')||''))b.remove()})}catch(e){}return r};window.openZMenu=openZMenu}
// ถ้าเปิดเกมมาค้างอยู่ในฉากที่ดิน → กลับเมือง
setTimeout(()=>{try{if(D&&D.home){exitD();toTown()}}catch(e){}},3000);
// 4) เนื้อเรื่อง
try{const S=STCH;const f=t=>S.find(c=>c&&c.t&&c.t.indexOf(t)===0);
 const c13=f('บทที่ 13:');if(c13&&c13.done)c13.done=c13.done.map(x=>x.replace(/ข้าในนามแห่งเอลโดเรีย ขอมอบ “โฉนดที่ดินผู้กล้า”[^\n]*/,'ข้าในนามแห่งเอลโดเรีย ขอมอบ “บ้านของผู้กล้า” หลังคาเขียว มุมซ้ายบนของเมือง ให้แก่เจ้า').replace(/จงสร้างบ้านของเจ้าที่นั่น[^\n]*/,'จงซ่อมแซมบ้านหลังนั้นแล้วพักผ่อนอย่างสงบสุข — และเมื่อเจ้าแข็งแกร่งพอ ถนนทางตะวันออกของเมืองจะพาเจ้าไปสู่ดินแดนใหม่'));
 const c27=S.find(c=>c&&c.id==='c2go');if(c27){c27.t='บทที่ 27: ถนนสู่นครวารี';c27.d='ถึง Lv.'+LV114()+' แล้วเดินออกประตูขวา (ตะวันออก) ของเมืองเอลโดเรีย ไปนครวารีอัสตรา แล้วคุยกับผู้บัญชาการไลอ้อสกลางลาน';
  c27.intro='จักรพรรดิเงาถูกผนึกแล้ว… แต่เงาของมันแตกเป็นห้าเสี่ยง หนีไปซ่อนในดันเจี้ยนใต้ "นครวารีอัสตรา" เมืองแห่งดันเจี้ยนทางตะวันออก — ประตูขวาของเมืองที่เคยพาไปที่ดินผู้กล้า บัดนี้คือถนนสู่นครวารี จงเดินทางไปพบผู้บัญชาการไลอ้อส'}
 const ce=f('บทส่งท้าย');if(ce){ce.d='สร้างบ้านหลังแรก — "บ้านของคุณ" หลังคาเขียว มุมซ้ายบนของเมืองเอลโดเรีย'}
 for(const c of S){if(c&&typeof c.d==='string'&&/แท่นผนึกอสูร/.test(c.d))c.d=c.d.replace(/แท่นผนึกอสูร(\s*\(เมนูหอคอย[^)]*\))?/,'แท่นผนึกอสูร (คุยกับผู้เฝ้าแท่นผนึกในเมือง)')}}catch(e){console.warn('story114',e)}
}catch(e){console.warn('fix114',e)}
