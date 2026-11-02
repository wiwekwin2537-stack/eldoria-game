/* Server autosave; no gameplay snapshot is written to browser disk. */
try{
{const st=document.createElement('style');st.textContent='button[onclick="saveGame(true)"]{display:none!important}';document.head.appendChild(st)}
try{const i=PM7.findIndex(m=>m[1]==='ย้ายเซฟ');if(i>=0){PM7.splice(i,1);pmRender7()}}catch(e){}
const _save107=saveGame;let saveTimer107=0;saveGame=function(){const r=_save107.apply(this,arguments);if(ONL32.verified&&!CLOUD.capturing&&!window.__qa154){clearTimeout(saveTimer107);saveTimer107=setTimeout(()=>CLOUD.sync(false),150)}return r};
const flush107=()=>{if(ONL32.verified&&!window.__qa154)CLOUD.sync(true,true)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)flush107()});addEventListener('pagehide',flush107);
}catch(e){console.warn('autosave',e)}
