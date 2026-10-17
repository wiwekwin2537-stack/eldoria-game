// fix30.js (v4.36) — ปุ่มควบคุมบนจอใหม่: ใหญ่ขึ้น กดง่าย จัดเป็นวงรอบปุ่มโจมตี (แบบเกมมือถือ)
// =====================================================================
{const st=document.createElement('style');st.textContent=`
#acts{transform:none!important;width:250px!important;height:220px!important;right:calc(6px + var(--sr))!important;bottom:calc(6px + var(--sb))!important}
#acts button{box-shadow:0 3px 10px rgba(0,0,0,.55),inset 0 0 0 2px rgba(0,0,0,.25)!important}
#acts #atk{width:96px!important;height:96px!important;right:6px!important;bottom:6px!important;font-size:42px!important;border-width:3px!important;background:radial-gradient(circle at 40% 35%,rgba(220,90,60,.85),rgba(120,25,15,.85))!important}
#acts #atk:active{transform:scale(.93)}
#acts #dashb{width:60px!important;height:60px!important;right:110px!important;bottom:4px!important;font-size:28px!important}
#acts .sk{width:64px!important;height:64px!important;font-size:28px!important;border-width:3px!important}
#acts #sk1{right:112px!important;bottom:72px!important}
#acts #sk2{right:70px!important;bottom:138px!important}
#acts #sk3{right:4px!important;bottom:110px!important}
#acts #sk5{display:none!important}
#acts #sk4{width:50px!important;height:50px!important;right:184px!important;bottom:78px!important;font-size:22px!important}
#acts #ultb{width:56px!important;height:56px!important;right:178px!important;bottom:6px!important}
#acts .sk .n{font-size:20px!important;text-shadow:0 2px 3px #000}
#acts .sk small{font-size:11px!important}
#acts .sk:active,#acts #dashb:active{transform:scale(.92)}
#joybase{border-width:4px!important}
#joyhint30{position:absolute;left:calc(26px + var(--sl,0px));bottom:calc(26px + var(--sb,0px));width:120px;height:120px;border-radius:50%;border:3px dashed rgba(255,255,255,.35);pointer-events:none;z-index:1;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);font:700 11px system-ui,"Noto Sans Thai",sans-serif;text-align:center}
#joyhint30.r{left:auto;right:calc(26px + var(--sr,0px))}
@media (max-height:360px){#acts{transform:scale(.86)!important;transform-origin:right bottom}}
@media (min-height:700px) and (pointer:coarse){#acts{transform:scale(1.12)!important;transform-origin:right bottom}}
`;document.head.appendChild(st)}
// จอยสติ๊กใหญ่ขึ้น (ไม่หดบนจอเตี้ยแล้ว) + วงบอกตำแหน่งตอนยังไม่แตะ
try{if(!SET.ctl30){SET.ctl30=1;SET.joySize=Math.max(SET.joySize||110,140);try{saveSet()}catch(e){}}}catch(e){}
joyStyle=function(){const s=Math.round(SET.joySize);joyBase.style.width=joyBase.style.height=s+'px';joyKnob.style.width=joyKnob.style.height=s*.44+'px';joyBase.style.opacity=SET.joyOp;joyZone.classList.toggle('r',SET.joySide==='right');joyBase.classList.toggle('run',!!SET.joyRun)};
try{joyStyle();joyRest()}catch(e){}
{const h=document.createElement('div');h.id='joyhint30';h.textContent='ลากเพื่อเดิน';gid('wrap').appendChild(h);
 setInterval(()=>{try{const show=SET.ctl==='joy'&&SET.joyMode!=='fixed'&&!JOY.on&&COARSE&&!PAUSED;h.hidden=!show;h.classList.toggle('r',SET.joySide==='right')}catch(e){}},300)}

// =====================================================================
