// fix35.js (v4.38) — 👥 ระบบปาร์ตี้ (สูงสุด 5 คน) · 📲 ปุ่มติดตั้งเกมลงเครื่อง
// =====================================================================
const PTY35={id:0,lead:0,mem:[],inv:null};window.PTY35=PTY35;
{const st=document.createElement('style');st.textContent=`
#pty35{position:absolute;left:calc(8px + var(--sl,0px));top:calc(118px + var(--st,0px));z-index:4;display:flex;flex-direction:column;gap:3px;pointer-events:auto;max-width:150px}
#pty35[hidden]{display:none}
#pty35 .m{background:rgba(10,12,24,.72);border:1px solid rgba(125,255,160,.45);border-radius:8px;padding:3px 6px;font:700 10px system-ui,"Noto Sans Thai",sans-serif;color:#e8ffe9;text-align:left}
#pty35 .m.me{border-color:#ffd84a}#pty35 .m.far{opacity:.6}
#pty35 .hb{height:4px;background:#2a1010;border-radius:3px;margin-top:2px;overflow:hidden}#pty35 .hb i{display:block;height:100%;background:linear-gradient(90deg,#3ad16a,#9dff7a)}
#pty35 .hd{display:flex;gap:4px;align-items:center;font:800 10px system-ui,"Noto Sans Thai",sans-serif;color:#9dffb0}
#pty35 .hd button{height:18px;font-size:10px;padding:0 6px;border-radius:6px;border:1px solid #7dffa0;background:#1a2a1e;color:#cfffd8}
#pinv35{position:absolute;left:50%;top:22%;transform:translateX(-50%);z-index:60;background:linear-gradient(#1d2a22,#0f1712);border:2px solid #7dffa0;border-radius:14px;padding:12px 16px;color:#eaffef;font:700 14px system-ui,"Noto Sans Thai",sans-serif;text-align:center;box-shadow:0 8px 30px #000b;min-width:230px}
#pinv35[hidden]{display:none}#pinv35 button{height:40px;min-width:90px;margin:8px 4px 0;border-radius:10px;font-size:15px;font-weight:800}
#pinv35 .y{background:#2f8a4a;color:#fff;border:2px solid #9dffb0}#pinv35 .n{background:#3a2a2a;color:#ffd0d0;border:2px solid #a86}
#inst35{display:block;width:100%;margin-top:8px}`;document.head.appendChild(st)}
const pbox=document.createElement('div');pbox.id='pty35';pbox.hidden=true;gid('wrap').appendChild(pbox);
const pinv=document.createElement('div');pinv.id='pinv35';pinv.hidden=true;gid('wrap').appendChild(pinv);
function ptyRender35(){if(!PTY35.id||PTY35.mem.length<2){pbox.hidden=true;return}pbox.hidden=false;const sc=netScene(),lead=PTY35.lead===NET.id;
 let h='<div class="hd">👥 ปาร์ตี้ '+PTY35.mem.length+'/5 <button onclick="ptyLeave35()">ออก</button></div>';
 for(const m of PTY35.mem){const me=m.id===NET.id,o=NET.others.get(m.id),hp=me?Math.round(P.hp/Math.max(1,BAL.hp)*100):(o&&o.hpP!=null?o.hpP:m.hpP);const far=!me&&m.sc!==sc;
  h+='<div class="m'+(me?' me':'')+(far?' far':'')+'">'+(m.id===PTY35.lead?'👑 ':'')+esc(m.name)+' <small>Lv.'+m.lv+'</small>'+(far?' <small>· '+esc(typeof SCN8==='function'?SCN8(m.sc):m.sc)+'</small>':'')+(m.dead?' 💀':'')
   +(lead&&!me?' <a style="color:#ff9a9a;cursor:pointer" onclick="ptyKick35('+m.id+')">✕</a>':'')+'<div class="hb"><i style="width:'+Math.max(0,Math.min(100,hp|0))+'%"></i></div></div>'}
 pbox.innerHTML=h}
window.ptyLeave35=()=>{netSend({t:'pleave'})};window.ptyKick35=id=>{netSend({t:'pkick',id})};
window.ptyInvite35=name=>{if(!NET.on){say('ต้องเชื่อมต่อเซิร์ฟเวอร์ก่อน');return}name=String(name||'').trim();if(!name){say('พิมพ์ /party ชื่อผู้เล่น');return}netSend({t:'pinv',name})};
function invShow35(d){PTY35.inv=d;pinv.innerHTML='👥 <b>'+esc(d.name)+'</b> (Lv.'+(d.lv|0)+')<br>ชวนคุณเข้าปาร์ตี้<br><small style="opacity:.8">ตีมอนด้วยกัน · แบ่ง XP · เห็นเลือดเพื่อน</small><br><button class="y" id="pinvY">✔ เข้าร่วม</button><button class="n" id="pinvN">✕ ปฏิเสธ</button>';pinv.hidden=false;sfx('ui');
 gid('pinvY').onclick=()=>{netSend({t:'pans',from:d.from,ok:true});pinv.hidden=true};gid('pinvN').onclick=()=>{netSend({t:'pans',from:d.from,ok:false});pinv.hidden=true};
 clearTimeout(PTY35.invT);PTY35.invT=setTimeout(()=>{pinv.hidden=true},30000)}
{const _nm=netMsg;netMsg=function(d){
  if(d&&d.t==='pty'){PTY35.id=d.id|0;PTY35.lead=d.lead|0;PTY35.mem=Array.isArray(d.mem)?d.mem:[];ptyRender35();return}
  if(d&&d.t==='pinv'){invShow35(d);return}
  if(d&&d.t==='chat'&&d.ch==='party'){try{chatSay('gen','👥 '+d.name,d.txt,'#7dffa0');const o=NET.others.get(d.id);if(o)o.bub={txt:String(d.txt).slice(0,60),until:performance.now()+4500}}catch(e){}return}
  return _nm(d)}}
setInterval(()=>{if(!pbox.hidden)ptyRender35()},1000);
// คำสั่งแชท: /party ชื่อ · /p ข้อความ · /pleave
{const _cs=chatSend;chatSend=function(){const ti=gid('chatTi'),t=(ti.value||'').trim();let m;
  const done=()=>{ti.value='';try{gid('chatIn').hidden=true}catch(e){}};
  if((m=/^\/(party|pt|ปาร์ตี้)\s+(.+)$/i.exec(t))){done();ptyInvite35(m[2]);return}
  if((m=/^\/p\s+(.+)$/i.exec(t))){done();if(!PTY35.id){say('ยังไม่มีปาร์ตี้ — ชวนเพื่อนด้วย /party ชื่อ');return}netSend({t:'pchat',txt:m[1].slice(0,140)});chatSay('gen','👥 '+(P.name||'ฉัน'),m[1],'#7dffa0');return}
  if(/^\/(pleave|leaveparty)$/i.test(t)){done();ptyLeave35();return}
  return _cs()};try{gid('chatSend').onclick=()=>chatSend()}catch(e){}}
// เมนูเมื่อแตะผู้เล่นอื่น: เพิ่มปุ่มชวนเข้าปาร์ตี้
{const pm=gid('pm9');if(pm){new MutationObserver(()=>{try{if(pm.hidden||pm.querySelector('.pt35'))return;const b0=pm.querySelector('button[onclick^="PM9("]');if(!b0)return;const id=(/,'([^']*)'\)/.exec(b0.getAttribute('onclick'))||[])[1];if(!id)return;
   const b=document.createElement('button');b.className='mini pt35';b.style.cssText='display:block;width:100%;margin-top:4px;background:#1f3a28;color:#d8ffe0;border:1px solid #7dffa0';b.textContent='👥 ชวนเข้าปาร์ตี้';
   b.onclick=()=>{const o=NET.others.get(+id)||NET.others.get(id);ptyInvite35(o&&o.name);PM9CLOSE()};b0.parentNode.insertBefore(b,b0)}catch(e){}}).observe(pm,{childList:true,attributes:true,attributeFilter:['hidden']})}}
// ป้าย 👥 เหนือหัวเพื่อนร่วมปาร์ตี้
{const _do=drawOther;drawOther=function(o){_do(o);try{if(PTY35.id&&PTY35.mem.some(m=>m.id===o.id)){ctx.save();ctx.font='900 11px system-ui';ctx.textAlign='center';ctx.fillStyle='#7dffa0';ctx.strokeStyle='#0a2010';ctx.lineWidth=3;ctx.strokeText('👥',o.x,o.y-84);ctx.fillText('👥',o.x,o.y-84);ctx.restore()}}catch(e){}}}
// ---------- 📲 ติดตั้งเกมลงเครื่อง (PWA) ----------
const INST35={ev:null};
addEventListener('beforeinstallprompt',e=>{e.preventDefault();INST35.ev=e;try{instBtn35()}catch(_){}});
addEventListener('appinstalled',()=>{INST35.ev=null;try{say('📲 ติดตั้งเกมแล้ว — เปิดจากหน้าจอหลักได้เลย')}catch(e){}});
const standalone35=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
function instHelp35(){const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),and=/android/i.test(navigator.userAgent);
 const msg=ios?'📲 iPhone/iPad: เปิดเกมใน Safari → กดปุ่ม "แชร์" (สี่เหลี่ยมมีลูกศรขึ้น) → เลือก "เพิ่มไปยังหน้าจอโฮม"':and?'📲 Android: กดเมนู ⋮ มุมขวาบนของ Chrome → "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก"':'📲 คอมพิวเตอร์: กดไอคอนติดตั้ง (จอมีลูกศร) ที่ช่องที่อยู่เว็บของ Chrome/Edge';
 try{tErr(msg)}catch(e){}try{say(msg)}catch(e){}}
async function instGo35(){if(INST35.ev){const e=INST35.ev;INST35.ev=null;e.prompt();try{const r=await e.userChoice;if(r&&r.outcome==='accepted')say('📲 กำลังติดตั้ง…')}catch(_){}}else instHelp35()}
window.instGo35=instGo35;
function instBtn35(){if(standalone35())return;const pan=gid('tpan');if(!pan||pan.querySelector('#inst35')||!pan.querySelector('.tb'))return;
 const b=document.createElement('button');b.className='tb ghost';b.id='inst35';b.textContent='📲 ติดตั้งเกมลงเครื่อง';b.onclick=instGo35;const tip=pan.querySelector('.tip');pan.insertBefore(b,tip||null)}
{const _tm=tMain;tMain=function(){_tm();try{instBtn35()}catch(e){}}}
// เมนูในเกม
try{gid('resume').insertAdjacentHTML('beforebegin','<button class="mini" onclick="instGo35()">📲 ติดตั้งเกมลงเครื่อง</button>')}catch(e){}

// =====================================================================
