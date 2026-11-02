// fix72 (v4.64) — รอบ 2 ระบบเล่นด้วยกัน (HANDOFF ข้อ 9, 10, 1, 2, 18)
//  A) 👥 หน้าต่างปาร์ตี้: ดูสมาชิก (อาชีพ/เลเวล/เลือด/อยู่แมพไหน) · เชิญ (พิมพ์ชื่อหรือเลือกจากคนออนไลน์) · เตะ · โอนหัวหน้า · ออก — ใช้ party.js เดิม (pinv/pkick/plead/pleave)
//  B) 🌐 หน้าต่างผู้คน: รายชื่อคนออนไลน์ทั้งโลก + ค้นชื่อ · แท็บเพื่อน (ออนไลน์/ออฟไลน์) · เพิ่ม/ลบเพื่อน (FR9 + FRSYNC10) · ชวนปาร์ตี้ · กระซิบ · ท้าดวล (pvDuel29)
//  C) 🐉 ประตูมิติบอสโลกแบบ 3D (แทนประตูไม้ fix64 ที่ WBG64) · เปิดเฉพาะตอนบอสเกิด (ปิด = ซุ้มหินดับ เข้าไม่ได้)
//     ชนะบอสโลก: มีโอกาสได้ชิ้นชุดบอส (fix59 ไม่ต้องคราฟ) · 💠 แจกจากเซิร์ฟเวอร์ (world.js: รวม 100/รอบ คนละ 10–30 ตามดาเมจ)
//  D) 👹 ฟาร์มปาร์ตี้: แมพธรรมชาติ (NAT16) มีอสูรปาร์ตี้ 3 ระดับ เลือดสูงตามรางวัล + คูณตามจำนวนคนในแมพ · ตายแล้วเกิดใหม่ 20 นาที · รับรางวัลได้ 1 ครั้ง/ตัว/20 นาที
try{
const esc72=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsq72=s=>String(s==null?'':s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
const clsN72=c=>{try{return CLS[c]?(CLS[c].e||'')+' '+CLS[c].n:'ไม่มีอาชีพ'}catch(e){return c||''}};
const scN72=sc=>{try{return SCN8(sc)}catch(e){return sc||'?'}};
const css72=document.createElement('style');css72.textContent=`
#pty72 .bd,#ppl72 .bd{display:block!important;overflow-y:auto;padding:8px 10px;font:600 12.5px/1.45 system-ui,"Noto Sans Thai",sans-serif;color:#eee}
.r72{display:flex;align-items:center;gap:8px;padding:7px 9px;margin-bottom:5px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09)}
.r72.me{border-color:rgba(255,216,74,.6);background:rgba(255,216,74,.08)}.r72.off{opacity:.55}
.r72 .ic{font-size:20px;width:28px;text-align:center}.r72 .nm{flex:1;min-width:0;text-align:left}.r72 .nm b{display:block;font-size:13.5px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.r72 .nm small{display:block;color:#bcb4a0;font-size:11px}
.r72 .hb{height:5px;border-radius:3px;background:#3a1414;margin-top:3px;overflow:hidden}.r72 .hb i{display:block;height:100%;background:linear-gradient(90deg,#3ad16a,#9dff7a)}
.b72{border:0;border-radius:9px;padding:6px 9px;margin:1px;font:800 12px system-ui,"Noto Sans Thai";cursor:pointer;background:#2a3a5a;color:#fff;white-space:nowrap}
.b72.g{background:linear-gradient(180deg,#5ad17a,#2a8a4a)}.b72.r{background:#7a2a2a}.b72.y{background:linear-gradient(180deg,#ffd86a,#d89a20);color:#3a2400}
.box72{background:rgba(255,255,255,.06);border-radius:11px;padding:8px 10px;margin-bottom:8px}
.box72 input{background:#141826;border:1px solid #556;border-radius:8px;color:#fff;padding:6px 8px;font-size:13px;width:150px}
.tab72{display:flex;gap:6px;margin-bottom:8px}.tab72 button{flex:1;border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:7px;background:rgba(255,255,255,.05);color:#ddd;font:800 13px system-ui,"Noto Sans Thai"}.tab72 button.on{background:linear-gradient(180deg,#ffd86a,#e0a020);color:#3a2400}
#pty35 .hd{cursor:pointer}`;document.head.appendChild(css72);
const W72={tab:'on',q:'',who:null,whoT:0,want:0};window.W72=W72;
const ptW72=mk6('pty72'),ppW72=mk6('ppl72');window.ptW72=ptW72;window.ppW72=ppW72;
const netOn72=()=>{try{return !!(NET&&NET.on)}catch(e){return false}};
function askWho72(){if(!netOn72())return;W72.want=performance.now();try{netSend({t:'who'})}catch(e){}}
{const _nm=netMsg;netMsg=function(d){try{if(d&&d.t==='who'&&W72.want&&performance.now()-W72.want<5000){W72.want=0;W72.who=Array.isArray(d.list)?d.list:[];W72.whoT=Date.now();if(!ptW72.hidden)renderPty72();if(!ppW72.hidden)renderPpl72();return}
  if(d&&d.t==='pty'){const r=_nm(d);try{if(!ptW72.hidden)renderPty72()}catch(e){}return r}}catch(e){}return _nm(d)}}
// ---------- A) ปาร์ตี้ ----------
function openParty72(){p6open(ptW72);renderPty72();askWho72()}window.openParty72=openParty72;
function renderPty72(){const inP=PTY35.id&&PTY35.mem.length>1,lead=PTY35.lead===NET.id,my=NET.id,sc=(()=>{try{return netScene()}catch(e){return''}})();
 let h='<div class="w"><div class="hd"><b>👥 ปาร์ตี้'+(inP?' '+PTY35.mem.length+'/5':'')+'</b><button onclick="p6close(ptW72)">✕</button></div><div class="bd">';
 if(!netOn72())h+='<div class="box72">⚠️ ต้องเชื่อมต่อออนไลน์ก่อน จึงจะตั้งปาร์ตี้ได้</div>';
 else{if(!inP)h+='<div class="box72">ยังไม่มีปาร์ตี้ — <b>ชวนเพื่อนคนแรก</b> แล้วคุณจะเป็นหัวหน้าปาร์ตี้ (สูงสุด 5 คน)<br><small style="opacity:.75">ปาร์ตี้: แบ่ง XP · เห็นเลือดกัน · ไปฟาร์มอสูรปาร์ตี้/บอสโลกด้วยกัน</small></div>';
  else for(const m of PTY35.mem){const me=m.id===my,o=me?null:NET.others.get(m.id),hp=me?Math.round(P.hp/Math.max(1,BAL.hp)*100):(o&&o.hpP!=null?o.hpP:m.hpP),far=!me&&m.sc!==sc;
   h+='<div class="r72'+(me?' me':'')+(far?' off':'')+'"><div class="ic">'+(m.id===PTY35.lead?'👑':(CLS[m.cls]&&CLS[m.cls].e)||'🙂')+'</div><div class="nm"><b>'+esc72(m.name)+(me?' (คุณ)':'')+'</b><small>'+clsN72(m.cls)+' · Lv.'+(m.lv|0)+' · '+(far?'📍 '+esc72(scN72(m.sc)):'อยู่แมพเดียวกัน')+(m.dead?' · 💀':'')+'</small><div class="hb"><i style="width:'+Math.max(0,Math.min(100,hp|0))+'%"></i></div></div>'
    +(lead&&!me?'<button class="b72 y" onclick="ptyLead72('+m.id+')" title="โอนหัวหน้า">👑 โอน</button><button class="b72 r" onclick="ptyKick35('+m.id+')">✕ เตะ</button>':'')+'</div>'}
  if(!inP||lead){h+='<div class="box72">➕ <b>เชิญเข้าปาร์ตี้</b><br><input id="pin72" maxlength="14" placeholder="ชื่อผู้เล่น"> <button class="b72 g" onclick="ptyInv72()">ส่งคำเชิญ</button></div>';
   const inSet=new Set(PTY35.mem.map(m=>m.name)),L=(W72.who||[]).filter(p=>p.name!==P.name&&!inSet.has(p.name)).slice(0,30);
   h+='<div class="box72"><b>🌐 คนที่ออนไลน์</b> <button class="b72" onclick="askWho72()">🔄</button><br>'+(W72.who==null?'<small>กำลังโหลด…</small>':!L.length?'<small>ยังไม่มีคนอื่นออนไลน์</small>':'')+'</div>';
   for(const p of L)h+='<div class="r72"><div class="ic">'+((CLS[p.cls]&&CLS[p.cls].e)||'🙂')+'</div><div class="nm"><b>'+esc72(p.name)+'</b><small>'+clsN72(p.cls)+' · Lv.'+(p.lv|0)+' · 📍 '+esc72(scN72(p.sc))+'</small></div><button class="b72 g" onclick="ptyInvite35(\''+jsq72(p.name)+'\')">👥 ชวน</button></div>'}
  else h+='<div class="box72"><small>หัวหน้าปาร์ตี้ (👑) เท่านั้นที่เชิญ/เตะ/โอนหัวหน้าได้</small></div>';
  if(inP)h+='<div style="text-align:center;margin-top:6px"><button class="b72 r" onclick="ptyLeave35();setTimeout(renderPty72,600)">🚪 ออกจากปาร์ตี้</button></div>'}
 ptW72.innerHTML=h+'</div></div>'}
window.renderPty72=renderPty72;window.askWho72=askWho72;
window.ptyInv72=()=>{const v=((gid('pin72')||{}).value||'').trim();if(!v){say('พิมพ์ชื่อผู้เล่นก่อน');return}ptyInvite35(v);gid('pin72').value=''};
window.ptyLead72=id=>{try{netSend({t:'plead',id});sfx('ui');const m=PTY35.mem.find(x=>x.id===id);say('👑 โอนหัวหน้าปาร์ตี้ให้ '+(m?m.name:'')+' แล้ว')}catch(e){}};
setInterval(()=>{try{if(!ptW72.hidden)renderPty72()}catch(e){}},2000);
try{gid('pty35').addEventListener('click',e=>{if(e.target.closest('button,a'))return;openParty72()})}catch(e){}
// ---------- B) ผู้คน / เพื่อน ----------
function openPeople72(t){if(t)W72.tab=t;p6open(ppW72);renderPpl72();askWho72()}window.openPeople72=openPeople72;
const isFr72=n=>{try{return FR9.list.includes(n)}catch(e){return false}};
window.frTog72=n=>{try{if(isFr72(n)){FR9.list=FR9.list.filter(x=>x!==n);say('💔 ลบ '+n+' ออกจากเพื่อนแล้ว')}else{if(FR9.list.length>=200){say('เพื่อนเต็มแล้ว (200)');return}FR9.list.push(n);say('🤝 เพิ่ม '+n+' เป็นเพื่อนแล้ว')}
 localStorage.setItem('fm_friends9',JSON.stringify(FR9.list));localStorage.setItem('fm_friends9_dirty','1');window.FRSYNC10&&FRSYNC10(true).then(ok=>{if(ok)try{localStorage.removeItem('fm_friends9_dirty')}catch(e){}});sfx('ui')}catch(e){}renderPpl72()};
window.whisper72=n=>{try{p6close(ppW72);const ti=gid('chatTi');try{gid('chatIn').hidden=false}catch(e){}ti.value='/w '+n+' ';ti.focus();say('💬 พิมพ์ข้อความแล้วกดส่ง เพื่อกระซิบถึง '+n)}catch(e){}};
window.duel72=n=>{try{if(typeof pvDuel29==='function')pvDuel29(n);else netSend({t:'duel',to:n})}catch(e){}};
window.pplTab72=t=>{W72.tab=t;renderPpl72()};window.pplQ72=v=>{W72.q=v;renderPpl72(true)};
function rowP72(p,on){const fr=isFr72(p.name);return '<div class="r72'+(on?'':' off')+'"><div class="ic">'+(on?((CLS[p.cls]&&CLS[p.cls].e)||'🙂'):'💤')+'</div><div class="nm"><b>'+esc72(p.name)+(p.pvp?' <small style="display:inline;color:#ff8a8a">⚔️PvP</small>':'')+'</b><small>'+(on?clsN72(p.cls)+' · Lv.'+(p.lv|0)+' · 📍 '+esc72(scN72(p.sc)):'ออฟไลน์')+'</small></div>'
 +'<button class="b72 '+(fr?'r':'g')+'" onclick="frTog72(\''+jsq72(p.name)+'\')">'+(fr?'💔':'🤝 เพื่อน')+'</button>'+(on?'<button class="b72" onclick="ptyInvite35(\''+jsq72(p.name)+'\')">👥</button><button class="b72" onclick="whisper72(\''+jsq72(p.name)+'\')">💬</button><button class="b72 r" onclick="duel72(\''+jsq72(p.name)+'\')">⚔️</button>':'')+'</div>'}
function renderPpl72(keepFocus){const T=W72.tab,q=W72.q.trim().toLowerCase(),who=(W72.who||[]).filter(p=>p.name!==P.name),onSet=new Map(who.map(p=>[p.name,p]));
 let h='<div class="w"><div class="hd"><b>🌐 ผู้คนในโลกเอลโดเรีย</b><button onclick="askWho72()">🔄</button><button onclick="p6close(ppW72)">✕</button></div><div class="bd"><div class="tab72"><button class="'+(T==='on'?'on':'')+'" onclick="pplTab72(\'on\')">🌐 ออนไลน์ ('+who.length+')</button><button class="'+(T==='fr'?'on':'')+'" onclick="pplTab72(\'fr\')">🤝 เพื่อน ('+(FR9.list||[]).length+')</button></div>';
 h+='<div class="box72">🔎 <input id="pq72" value="'+esc72(W72.q)+'" placeholder="ค้นหาชื่อ…" oninput="pplQ72(this.value)"> <small style="opacity:.75">กด 🤝 เพิ่มเพื่อน · 👥 ชวนปาร์ตี้ · 💬 กระซิบ · ⚔️ ท้าดวล</small></div>';
 if(!netOn72())h+='<div class="box72">⚠️ ต้องเชื่อมต่อออนไลน์ก่อน</div>';
 else if(T==='on'){if(W72.who==null)h+='<small>กำลังโหลด…</small>';const L=who.filter(p=>!q||p.name.toLowerCase().includes(q));if(W72.who&&!L.length)h+='<small>'+(q?'ไม่พบชื่อนี้ที่ออนไลน์อยู่':'ยังไม่มีคนอื่นออนไลน์')+'</small>';for(const p of L.slice(0,80))h+=rowP72(p,true)}
 else{const F=(FR9.list||[]).filter(n=>!q||n.toLowerCase().includes(q));if(!F.length)h+='<small>'+(q?'ไม่พบ':'ยังไม่มีเพื่อน — ไปที่แท็บออนไลน์แล้วกด 🤝')+'</small>';
  F.sort((a,b)=>(onSet.has(b)?1:0)-(onSet.has(a)?1:0));for(const n of F)h+=rowP72(onSet.get(n)||{name:n},onSet.has(n))}
 ppW72.innerHTML=h+'</div></div>';if(keepFocus){const i=gid('pq72');if(i){i.focus();try{i.setSelectionRange(i.value.length,i.value.length)}catch(e){}}}
 try{for(const i of ppW72.querySelectorAll('input'))for(const ev of ['keydown','keyup','keypress'])i.addEventListener(ev,e=>e.stopPropagation())}catch(e){}}
window.renderPpl72=renderPpl72;
setInterval(()=>{try{if(!ppW72.hidden&&Date.now()-W72.whoT>10000)askWho72()}catch(e){}},3000);
try{const at=PM7.findIndex(m=>m[1]==='กิลด์');PM7.splice(at<0?PM7.length-2:at+1,0,['👥','ปาร์ตี้',()=>openParty72()],['🌐','ผู้คน',()=>openPeople72('on')]);pmRender7()}catch(e){}
// ---------- C) ประตูมิติบอสโลก 3D ----------
function ring72(cx,cy,R,r,rot,rgb,w,front,al){ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);const N=30;for(let i=0;i<N;i++){const a0=i/N*6.2832,a1=(i+1)/N*6.2832,d=Math.sin((a0+a1)/2);if((d>0)!==front)continue;
 ctx.strokeStyle='rgba('+rgb+','+(al*(front?.6+.4*d:.22+.2*(1+d)))+')';ctx.lineWidth=w*(front?1+.35*d:.75);ctx.beginPath();ctx.moveTo(Math.cos(a0)*R,Math.sin(a0)*r);ctx.lineTo(Math.cos(a1)*R,Math.sin(a1)*r);ctx.stroke()}ctx.restore()}
function shards72(x,y,t,front,on){for(let i=0;i<7;i++){const a=t*(on?.9:.15)+i*.8976,d=Math.sin(a);if((d>0)!==front)continue;const px=x+Math.cos(a)*40,py=y-34+Math.sin(a)*9+Math.sin(t*2+i)*3,s=4+(i%3)*1.6+(front?d*1.5:0);
 ctx.fillStyle=front?'#6a5a6a':'#3e3442';ctx.beginPath();ctx.moveTo(px,py-s);ctx.lineTo(px+s*.8,py);ctx.lineTo(px,py+s*.9);ctx.lineTo(px-s*.7,py);ctx.closePath();ctx.fill();
 if(on){ctx.fillStyle='rgba(255,170,90,'+(.5+.4*d)+')';ctx.fillRect(px-1,py-1,2,2)}}}
function portal72(front){const x=WBG64.x,y=WBG64.y,t=performance.now()/1000,on=!!(WB10&&WB10.on);ctx.save();ctx.globalAlpha=1;/* fix130: ไม่กระพริบตามตัวละครตอนโดนตี */ctx.translate(x,y);ctx.scale(1.35,1.35);ctx.translate(-x,-y);
 if(!front){// ฐาน + วงเวทบนพื้น
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y+4,44,13,0,0,7);ctx.fill();
  ctx.save();ctx.translate(x,y+2);ctx.scale(1,.32);ctx.globalCompositeOperation='lighter';const R=40;
  ctx.strokeStyle=on?'rgba(255,150,70,.75)':'rgba(140,110,150,.35)';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.stroke();ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(0,0,R*.74,0,7);ctx.stroke();
  for(let i=0;i<16;i++){const a=(on?t*.7:0)+i*.3927;ctx.save();ctx.rotate(a);ctx.fillStyle=on?'rgba(255,210,120,.8)':'rgba(150,120,160,.35)';ctx.fillRect(R*.78,-1.4,R*.16,2.8);ctx.restore()}
  if(on){ctx.strokeStyle='rgba(255,90,40,.55)';ctx.beginPath();for(let i=0;i<=5;i++){const a=-t*1.1+i*2.513;const px=Math.cos(a)*R*.7,py=Math.sin(a)*R*.7;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke()}
  ctx.restore();
  // เสาหิน + ซุ้ม
  for(const s of [-1,1]){const g=ctx.createLinearGradient(x+s*30-6,0,x+s*30+6,0);g.addColorStop(0,'#2a2230');g.addColorStop(.5,'#5a4e60');g.addColorStop(1,'#241c2a');ctx.fillStyle=g;ctx.fillRect(x+s*30-6,y-70,12,74);
   ctx.fillStyle='#1a141e';ctx.fillRect(x+s*30-8,y-2,16,6);for(let k=0;k<3;k++){ctx.fillStyle=on?'rgba(255,'+(140+k*30)+',70,'+(.55+.35*Math.sin(t*3+k+s))+')':'rgba(120,100,130,.4)';ctx.fillRect(x+s*30-2,y-58+k*18,4,8)}}
  ctx.strokeStyle='#4a3e52';ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(x,y-38,32,40,0,Math.PI,0);ctx.stroke();ctx.strokeStyle='#6a5e72';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-38,32,40,0,Math.PI,0);ctx.stroke();
  shards72(x,y,t,false,on);
  if(on){// น้ำวนมิติ
   ctx.save();ctx.beginPath();ctx.ellipse(x,y-34,24,34,0,0,7);ctx.clip();const g=ctx.createRadialGradient(x,y-34,2,x,y-34,36);g.addColorStop(0,'rgba(255,245,220,1)');g.addColorStop(.25,'rgba(255,140,60,.95)');g.addColorStop(.6,'rgba(150,30,120,.95)');g.addColorStop(1,'rgba(30,6,40,.98)');ctx.fillStyle=g;ctx.fillRect(x-26,y-70,52,72);
   ctx.globalCompositeOperation='lighter';for(let k=0;k<5;k++){ctx.strokeStyle='rgba(255,'+(120+k*25)+','+(80+k*30)+','+(.35+.1*k)+')';ctx.lineWidth=2.4;ctx.beginPath();for(let a=0;a<9;a+=.25){const rr=2+a*2.7,an=a-t*(2.2+k*.3)+k*1.25;const px=x+Math.cos(an)*rr*.72,py=y-34+Math.sin(an)*rr;a?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke()}
   ctx.restore();
   const pg=ctx.createLinearGradient(0,y-150,0,y);pg.addColorStop(0,'rgba(255,120,40,0)');pg.addColorStop(.7,'rgba(255,150,60,'+(.12+.05*Math.sin(t*3))+')');pg.addColorStop(1,'rgba(255,230,180,.22)');ctx.globalCompositeOperation='lighter';ctx.fillStyle=pg;ctx.fillRect(x-22,y-150,44,150);ctx.globalCompositeOperation='source-over'}
  else{ctx.fillStyle='rgba(20,14,26,.85)';ctx.beginPath();ctx.ellipse(x,y-34,24,34,0,0,7);ctx.fill();ctx.strokeStyle='rgba(120,100,140,.35)';ctx.lineWidth=1;for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(x,y-34,8+k*6,12+k*8,0,0,7);ctx.stroke()}}
  ring72(x,y-36,40,10,-.35,on?'255,170,80':'140,120,160',on?2.4:1.4,false,on?1:.5);ring72(x,y-40,34,8,.5,on?'255,90,170':'120,100,140',on?1.8:1,false,on?1:.4)}
 else{ring72(x,y-36,40,10,-.35,on?'255,170,80':'140,120,160',on?2.4:1.4,true,on?1:.5);ring72(x,y-40,34,8,.5,on?'255,90,170':'120,100,140',on?1.8:1,true,on?1:.4);shards72(x,y,t,true,on);
  if(on){ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const a=t*2.6+i*2.094,px=x+Math.cos(a)*40,py=y-36+Math.sin(a)*10;if(Math.sin(a)<0)continue;const g=ctx.createRadialGradient(px,py,0,px,py,7);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(255,140,60,0)');ctx.fillStyle=g;ctx.fillRect(px-7,py-7,14,14)}ctx.globalCompositeOperation='source-over';
   if(Math.random()<.5)try{const a=Math.random()*6.28,r=60;rfxP(x+Math.cos(a)*r,y-34+Math.sin(a)*r*.6,-Math.cos(a)*55,-Math.sin(a)*35,.9,Math.random()<.5?'255,170,80':'255,90,170',1.6,'spark')}catch(e){}}
  ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#1a0a14';
  let s='🐉 ประตูมิติบอสโลก',s2=on?'เปิดแล้ว! เหลือ '+Math.max(0,Math.ceil(((WB10.end||0)-srvNow())/60000))+' นาที':'ปิด · เปิดเมื่อบอสเกิด 12:00 / 20:00';
  ctx.strokeText(s,x,y-96);ctx.fillStyle=on?'#ffe08a':'#c8b8d8';ctx.fillText(s,x,y-96);ctx.font='600 10px system-ui,"Noto Sans Thai",sans-serif';ctx.strokeText(s2,x,y-84);ctx.fillStyle=on?'#ffb07a':'#9a8aaa';ctx.fillText(s2,x,y-84);
  if(Math.hypot(P.x-x,P.y-y)<48){const s3=on?'กดโต้ตอบเพื่อเข้าลานบอสโลก':'ประตูยังปิดอยู่';ctx.strokeText(s3,x,y+24);ctx.fillStyle='#fff';ctx.fillText(s3,x,y+24)}}
 ctx.restore()}
{const _h=hero;hero=function(){let near=false;try{near=!D&&!window.__IN_OTHER8&&typeof WBG64!=='undefined'&&Math.abs(P.x-WBG64.x)<900&&Math.abs(P.y-WBG64.y)<700}catch(e){}
  if(!near)return _h.apply(this,arguments);let pv=false;try{pv=!!(ctx&&ctx.canvas&&!ctx.canvas.isConnected)}catch(e){}if(pv)return _h.apply(this,arguments);
  try{portal72(false)}catch(e){}const ox=WBG64.x;WBG64.x=ox+1e7;let r;try{r=_h.apply(this,arguments)}finally{WBG64.x=ox}try{portal72(true)}catch(e){}return r};window.hero=hero}
{const _it=interact;interact=function(){try{if(!D&&typeof WBG64!=='undefined'&&Math.hypot(P.x-WBG64.x,P.y-WBG64.y)<48&&!(WB10&&WB10.on)){say('🐉 ประตูมิติยังปิดอยู่ — จะเปิดเมื่อบอสโลกเกิด (12:00 / 20:00 น.)');sfx('thud');try{openWb10()}catch(e){}return true}}catch(e){}return _it.apply(this,arguments)};window.interact=interact}
// รางวัลบอสโลกเพิ่ม: ชิ้นชุดบอส (โอกาสต่ำ) + แสดง 💠 ที่เซิร์ฟเวอร์แจก
const setIdx72=()=>{let k=0;try{for(let i=0;i<B59.length;i++)if(P.lv>=B59[i].lv)k=i}catch(e){}return k};
function setPiece72(i){const piece=['sword','staff','bow','helm','chest','pants','arm','neck','ring'][Math.random()*9|0],id=piece+B59[i].t;if(!ITEMS[id])return null;GEAR[id]=(GEAR[id]|0)+1;return ITEMS[id].name}
window.setPiece72=setPiece72;window.setIdx72=setIdx72;
{const _w=wbWin10;wbWin10=function(d){const r=_w.apply(this,arguments);try{const rk=d.rank|0,ch=rk===1?.08:rk<=3?.05:.025;
  if(Math.random()<ch){const nm=setPiece72(setIdx72());if(nm){sysSay('👑 บอสโลกดรอปชุดบอส: '+nm+'!');banner('👑 ได้ชุดบอส!',nm,'');try{refreshInv();saveGame(true)}catch(e){}}}
  if(d.gem>0){sysSay('💠 ได้เหรียญแฟชั่น +'+d.gem+' จากบอสโลก (แจกตามดาเมจ)');try{gemRefresh69&&gemRefresh69()}catch(e){}}}catch(e){}return r};window.wbWin10=wbWin10}
// ---------- D) อสูรปาร์ตี้ (ฟาร์มปาร์ตี้) ----------
const PBT72=[{n:'จ่าฝูงอสูร',dl:3,hm:15,am:1.3,sc:1.45,rw:{coin:3000,est:3,gem:1,bl:0,set:.02,xp:.12}},
 {n:'แม่ทัพอสูร',dl:6,hm:30,am:1.5,sc:1.7,rw:{coin:6000,est:5,gem:2,bl:.35,set:.04,xp:.2}},
 {n:'จอมอสูรทมิฬ',dl:10,hm:50,am:1.75,sc:2.0,rw:{coin:12000,est:8,gem:3,bl:1,set:.07,xp:.35}}];window.PBT72=PBT72;
const PB72={ms:20*60e3,get(){try{return JSON.parse(localStorage.getItem('fm_pb72')||'{"k":{},"c":{}}')}catch(e){return{k:{},c:{}}}},set(o){try{localStorage.setItem('fm_pb72',JSON.stringify(o))}catch(e){}}};window.PB72=PB72;
const pbZone72=()=>{try{const Z=D&&D.zone;if(!Z||D.dg||!Z.Zd||!NAT16[Z.Zd.id])return null;return Z}catch(e){return null}};
function pbSpots72(Z){if(Z.pbSp72)return Z.pbSp72;const R=srand(9173*((Z.zi|0)+5)),F=[];for(let y=3;y<Z.m.length-3;y++)for(let x=3;x<Z.m[0].length-3;x++){if(Z.m[y][x]!==FL)continue;let ok=1;for(let b=-2;b<=2&&ok;b++)for(let a=-2;a<=2;a++){if(!Z.m[y+b]||Z.m[y+b][x+a]!==FL){ok=0;break}const o=Z.oreAt&&Z.oreAt[(y+b)*ZW+x+a];if(o){ok=0;break}}
  if(ok&&Math.hypot(x-Z.ent.x,y-Z.ent.y)>18&&Math.hypot(x-Z.arena.x,y-Z.arena.y)>9)F.push([x,y])}
 const out=[];for(let i=0;i<3&&F.length;i++){let best=null;for(let k=0;k<60;k++){const c=F[Math.floor(R()*F.length)];if(out.every(o=>Math.hypot(o[0]-c[0],o[1]-c[1])>14)){best=c;break}}if(!best)best=F[Math.floor(R()*F.length)];out.push(best)}return Z.pbSp72=out}
function pbSpawn72(){const Z=pbZone72();if(!Z||P.dead)return 0;try{if(W33.mode==='mirror')return 0}catch(e){}const st=PB72.get(),now=srvNow(),sp=pbSpots72(Z),Zd=Z.Zd;let n=0;
 const ppl=Math.min(5,1+(()=>{try{return NET.others.size}catch(e){return 0}})());
 PBT72.forEach((T,i)=>{const key=Zd.id+':'+i;if(D.mobs.some(m=>!m.dead&&m.pb72&&m.pbi===i))return;if(now-(st.k[key]||0)<PB72.ms)return;const s=sp[i];if(!s)return;
  const mb=i===2?[Zd.boss.f,Zd.boss.n,Zd.boss.c]:Zd.mobs[i%Zd.mobs.length],L=(Zd.lv?Zd.lv[1]:20)+T.dl;
  const m=mkMob(mb[0],'👹 '+T.n,mb[2],L,s[0]*T_72+16,s[1]*T_72+16,{elite:1});m.hp=m.max=Math.round(m.max*T.hm*(1+.5*(ppl-1)));m.atk=Math.round(m.atk*T.am);m.sc*=T.sc;m.pb72=1;m.pbi=i;m.pbz=Zd.id;m.aggro=0;D.mobs.push(m);n++});
 if(n)setTimeout(()=>{try{sysSay('👹 อสูรปาร์ตี้ '+n+' ตัวปรากฏในแมพนี้! เลือดเยอะ รางวัลดี — แนะนำไปเป็นปาร์ตี้ 3–5 คน (เลือดเพิ่มตามจำนวนคนในแมพ)')}catch(e){}},400);return n}
const T_72=typeof T==='number'?T:32;
window.pbSpawn72=pbSpawn72;
// ว่ายน้ำในแมพธรรมชาติ (fix71): ตรวจชนที่ตำแหน่งผู้เล่นเอง (เช่นตัวตรวจระบบ) ให้ถือว่าน้ำไม่ใช่สิ่งกีดขวางเหมือนตอนเดิน
{const _zh=zHit;zHit=function(x,y){try{if(D&&D.zone&&D.zone.K&&!D.dg&&!P.dead&&!window.INPT10&&Math.abs(x-P.x)<.5&&Math.abs(y-P.y)<.5){const N=NAT16[D.zone.Zd&&D.zone.Zd.id];if(N&&!N.lava){window.INPT10=1;try{return _zh.apply(this,arguments)}finally{window.INPT10=0}}}}catch(e){}return _zh.apply(this,arguments)};window.zHit=zHit}
{const _ez=enterZone;enterZone=function(i){const r=_ez.apply(this,arguments);setTimeout(()=>{try{pbSpawn72()}catch(e){}},2600);return r};window.enterZone=enterZone}
setInterval(()=>{try{if(pbZone72()&&!PAUSED)pbSpawn72()}catch(e){}},15000);
{const _mk=mobKill;mobKill=function(m){const r=_mk.apply(this,arguments);try{if(m&&m.pb72&&!m.pbRew72){m.pbRew72=1;const T=PBT72[m.pbi|0],key=(m.pbz||'')+':'+(m.pbi|0),st=PB72.get(),now=srvNow();st.k[key]=now;
   if(now-(st.c[key]||0)<PB72.ms){PB72.set(st);sysSay('👹 รับรางวัล '+T.n+' ไปแล้ว — รออีก '+Math.ceil((PB72.ms-(now-st.c[key]))/60000)+' นาที');return r}
   st.c[key]=now;PB72.set(st);const W=T.rw,R=[];const add=(k,n,lab)=>{n=Math.round(n);if(n>0){inv[k]=(inv[k]|0)+n;R.push(lab+' ×'+n.toLocaleString())}};
   add('coin',W.coin*(1+(m.L|0)/40),'🪙');add('estone',W.est,'💎 หินเสริมพลัง');add('gem',W.gem,'💎 อัญมณี');if(Math.random()<W.bl)add('bless',1,'✨ หินพร');
   try{/* fix125: เดิมคิด % จากเลเวลผู้เล่น → Lv.150 ฟาร์มอสูรปาร์ตี้ป่าลำธาร (Lv.29) ได้ 1.8 เลเวลทุก 20 นาที · คิดจากเลเวลที่ต่ำกว่าระหว่างผู้เล่นกับอสูร */const x=Math.round(need(Math.min(P.lv,(m.L|0)||P.lv))*W.xp);gainXp(x);R.push('⭐ XP +'+x.toLocaleString())}catch(e){}
   if(Math.random()<W.set){const nm=setPiece72(setIdx72());if(nm){R.push('👑 '+nm);try{chatAnn((P.name||'ผู้กล้า')+' ได้ชุดบอส '+nm+' จาก'+T.n+'!')}catch(e){}}}
   try{refreshInv();saveGame(true)}catch(e){}banner('👹 ปราบ'+T.n+'!',R.slice(0,3).join(' · '),'');sysSay('👹 รางวัล'+T.n+': '+R.join(' · '))}}catch(e){console.warn('pb72',e)}return r};window.mobKill=mobKill}
}catch(e){console.warn('fix72',e)}
