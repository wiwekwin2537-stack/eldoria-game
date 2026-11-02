// fix30.js (v4.36) — ปุ่มควบคุมบนจอใหม่: ใหญ่ขึ้น กดง่าย จัดเป็นวงรอบปุ่มโจมตี (แบบเกมมือถือ)
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#acts{transform:none!important;width:220px!important;height:236px!important;right:calc(6px + var(--sr))!important;bottom:calc(6px + var(--sb))!important}
#acts button{box-shadow:0 3px 10px rgba(0,0,0,.55),inset 0 0 0 2px rgba(0,0,0,.25)!important}
#acts #atk{width:68px!important;height:68px!important;right:6px!important;bottom:6px!important;font-size:32px!important;border-width:3px!important;background:radial-gradient(circle at 40% 35%,rgba(220,90,60,.85),rgba(120,25,15,.85))!important}
#acts #atk:active{transform:scale(.93)}
#acts #dashb{width:44px!important;height:44px!important;right:83px!important;bottom:4px!important;font-size:28px!important}
#acts .sk{width:48px!important;height:48px!important;font-size:23px!important;border-width:3px!important}
#acts #sk1{right:80px!important;bottom:61px!important}
#acts #sk2{right:54px!important;bottom:112px!important}
#acts #sk3{right:2px!important;bottom:78px!important}
#acts #sk5{display:none!important}
#acts #sk4{width:44px!important;height:44px!important;right:137px!important;bottom:6px!important;font-size:22px!important}
#acts #ultb{width:44px!important;height:44px!important;right:164px!important;bottom:116px!important}
#acts .sk .n{font-size:16px!important;text-shadow:0 2px 3px #000}
#acts .sk small{font-size:11px!important}
#acts .sk:active,#acts #dashb:active{transform:scale(.92)}
#joybase{border-width:4px!important}
#joyhint30{position:absolute;left:calc(26px + var(--sl,0px));bottom:calc(26px + var(--sb,0px));width:120px;height:120px;border-radius:50%;border:3px dashed rgba(255,255,255,.35);pointer-events:none;z-index:1;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);font:700 11px system-ui,"Noto Sans Thai",sans-serif;text-align:center}
#joyhint30.r{left:auto;right:calc(26px + var(--sr,0px))}


`;document.head.appendChild(st)}
// จอยสติ๊กใหญ่ขึ้น (ไม่หดบนจอเตี้ยแล้ว) + วงบอกตำแหน่งตอนยังไม่แตะ
try{if(!SET.ctl30){SET.ctl30=1;SET.joySize=Math.max(SET.joySize||110,140);try{saveSet()}catch(e){}}}catch(e){}
joyStyle=function(){const s=Math.round(SET.joySize);joyBase.style.width=joyBase.style.height=s+'px';joyKnob.style.width=joyKnob.style.height=s*.44+'px';joyBase.style.opacity=SET.joyOp;joyZone.classList.toggle('r',SET.joySide==='right');joyBase.classList.toggle('run',!!SET.joyRun)};
try{joyStyle();joyRest()}catch(e){}
{const h=document.createElement('div');h.id='joyhint30';h.textContent='ลากเพื่อเดิน';gid('wrap').appendChild(h);
 setInterval(()=>{try{const show=SET.ctl==='joy'&&SET.joyMode!=='fixed'&&!JOY.on&&COARSE&&!PAUSED;h.hidden=!show;h.classList.toggle('r',SET.joySide==='right')}catch(e){}},300)}

// =====================================================================
