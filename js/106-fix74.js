// fix74 (v4.66) — รอบ 4ก หน้าตาเกม (HANDOFF ข้อ 3, 4, 12, 17)
//  A) 🏅 หน้าต่างฉายาดีไซน์ใหม่: การ์ดโปรไฟล์ + ป้ายชื่อตัวอย่าง · สถิติเป็นช่อง · หลอดความคืบหน้า · แท็บ ทั้งหมด/ได้แล้ว/ยังไม่ได้ · การ์ดฉายา 2 คอลัมน์ขอบเรืองแสงตามสี
//  B) เมนูหลัก: เอา "ย้ายเซฟ" "รูปลักษณ์" "ตลาด" ออก · ตั้งค่า: ซ่อนหมวด "บันทึกเกม" (ออนไลน์เซฟอัตโนมัติทุก 20 วิ + ซิงก์คลาวด์แล้ว)
//     รูปลักษณ์ย้ายไปบูติกมาดามโรส (✂️ เปลี่ยนรูปลักษณ์) · ตลาด = ซุ้มประตู "ตลาดนัด" ในเมือง (ช่อง 20.5,31 ใต้ถนนล่าง) เดินไปเข้าเอง
//  C) บูติก: รูปตัวอย่างใช้นายแบบมาตรฐานคนเดียวกันทุกชุด (ไม่ใช่ตัวละครของผู้เล่น) · อาวุธอาชีพใช้นายแบบอาชีพนั้น
//  D) กลางคืนชาวเมืองเข้าบ้านไปนอน (ไม่นอนกลางแจ้ง): ที่จุดประจำเหลือป้าย "พักผ่อนอยู่ในบ้าน 💤" · แตะ/โต้ตอบเหมือนเดิม = เคาะประตูปลุกออกมาคุย
try{
// ---------- A) ฉายา ----------
{const st=document.createElement('style');st.textContent=`
#ttl20 .bd.tt74{display:block!important;overflow-y:auto;padding:10px 12px;font-family:system-ui,"Noto Sans Thai",sans-serif;color:#eee}
.tt74 .pro{display:flex;gap:12px;align-items:center;padding:12px;border-radius:14px;background:radial-gradient(ellipse at 20% 0%,rgba(255,216,106,.18),transparent 60%),linear-gradient(135deg,#2a2140,#151022);border:1px solid rgba(255,216,106,.35);margin-bottom:10px}
.tt74 .plate{flex:1;text-align:center}.tt74 .plate i{display:block;font:900 15px system-ui,"Noto Sans Thai";font-style:normal;text-shadow:0 0 10px currentColor}.tt74 .plate b{display:inline-block;margin-top:3px;padding:2px 12px;border-radius:9px;background:rgba(0,0,0,.45);font:800 13px system-ui,"Noto Sans Thai";color:#fff}
.tt74 .bar{height:8px;border-radius:5px;background:#2a2238;overflow:hidden;margin-top:6px}.tt74 .bar i{display:block;height:100%;background:linear-gradient(90deg,#ffd86a,#ff8ad8)}
.tt74 .st{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px}.tt74 .st div{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:6px 4px;text-align:center;font:600 10.5px system-ui,"Noto Sans Thai";color:#bcb4a0}.tt74 .st b{display:block;font:900 14px system-ui;color:#fff}
.tt74 .tb{display:flex;gap:6px;margin-bottom:8px}.tt74 .tb button{flex:1;border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:6px;background:rgba(255,255,255,.05);color:#ddd;font:800 12.5px system-ui,"Noto Sans Thai"}.tt74 .tb button.on{background:linear-gradient(180deg,#ffd86a,#e0a020);color:#3a2400}
.tt74 .gr{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.tt74 .c{position:relative;padding:9px 10px;border-radius:12px;background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(0,0,0,.25));border:1.5px solid var(--c);box-shadow:0 0 12px -4px var(--c);text-align:left}
.tt74 .c.lk{filter:grayscale(.85);opacity:.5;box-shadow:none;border-color:rgba(255,255,255,.12)}.tt74 .c.on{background:linear-gradient(160deg,rgba(255,216,106,.2),rgba(0,0,0,.2))}
.tt74 .c b{display:block;font:900 13px system-ui,"Noto Sans Thai";color:var(--c)}.tt74 .c small{display:block;font:600 11px/1.35 system-ui,"Noto Sans Thai";color:#bcb4a0;margin:3px 0 6px}
.tt74 .c button{border:0;border-radius:8px;padding:4px 10px;font:800 11.5px system-ui,"Noto Sans Thai";background:linear-gradient(180deg,#5ad17a,#2a8a4a);color:#fff;cursor:pointer}.tt74 .c.on button{background:#5a3a3a}
.tt74 .rb{position:absolute;top:-1px;right:-1px;padding:2px 8px;border-radius:0 11px 0 9px;background:#ffd86a;color:#3a2400;font:900 10px system-ui,"Noto Sans Thai"}`;document.head.appendChild(st)}
window.TT74={f:'all'};
ttRender20=function(){const cur=myTtl20(),all=TTL20.filter(t=>t[0]!=='gm'||ttlHas20('gm')),got=all.filter(t=>ttlHas20(t[0])).length,T=cur?TTLMAP20[cur]:null,F=TT74.f;
 let h='<div class="w"><div class="hd"><b>🏅 ฉายา</b><button onclick="p6close(ttW20)">✕</button></div><div class="bd tt74">';
 h+='<div class="pro"><div class="plate"><i style="color:'+(T?T[2]:'#888')+'">'+(T?'「'+T[1]+'」':'ยังไม่ได้ใช้ฉายา')+'</i><b>'+esc(P.name||'ผู้กล้า')+'</b><div style="font:600 11px system-ui,\'Noto Sans Thai\';color:#cfc6b0;margin-top:6px">ปลดล็อกแล้ว '+got+' / '+all.length+' ฉายา</div><div class="bar"><i style="width:'+Math.round(got/Math.max(1,all.length)*100)+'%"></i></div></div></div>';
 const S=[['⚔️','ล้มมอน',ST20.kills],['👑','ล้มบอส',ST20.boss],['⛏️','ขุดแร่',ST20.ore],['🪓','ตัดไม้',ST20.tree],['🎣','ตกปลา',ST20.fish],['🗝️','ดันเจี้ยน',DG.max|0],['🪙','ทรัพย์สิน',(()=>{try{return wealth20()}catch(e){return 0}})()],['⭐','เลเวล',P.lv]];
 h+='<div class="st">'+S.map(([e,n,v])=>'<div>'+e+' '+n+'<b>'+Number(v||0).toLocaleString()+'</b></div>').join('')+'</div>';
 h+='<div class="tb"><button class="'+(F==='all'?'on':'')+'" onclick="TT74.f=\'all\';ttRender20()">ทั้งหมด</button><button class="'+(F==='got'?'on':'')+'" onclick="TT74.f=\'got\';ttRender20()">✅ ได้แล้ว ('+got+')</button><button class="'+(F==='no'?'on':'')+'" onclick="TT74.f=\'no\';ttRender20()">🔒 ยังไม่ได้</button><button onclick="p6close(ttW20);openLb20()">🏆 อันดับ</button></div><div class="gr">';
 for(const [id,n,c,d] of all){const ok=ttlHas20(id),on=cur===id;if(F==='got'&&!ok||F==='no'&&ok)continue;
  h+='<div class="c'+(ok?'':' lk')+(on?' on':'')+'" style="--c:'+c+'">'+(on?'<span class="rb">กำลังใช้</span>':'')+'<b>「'+n+'」</b><small>'+(ok?'✅ ':'🔒 ')+d+'</small>'+(ok?'<button onclick="ttSet20(\''+(on?'':id)+'\')">'+(on?'ถอด':'ใช้ฉายานี้')+'</button>':'')+'</div>'}
 ttW20.innerHTML=h+'</div></div></div>'};window.ttRender20=ttRender20;
// ---------- B) เมนู ----------
try{for(const nm of ['ย้ายเซฟ','รูปลักษณ์','ตลาด']){const i=PM7.findIndex(m=>m[1]===nm);if(i>=0)PM7.splice(i,1)}pmRender7()}catch(e){}
const hideSave74=()=>{try{for(const b of menuEl.querySelectorAll('b.sec')){if(/บันทึกเกม/.test(b.textContent)){b.style.display='none';let n=b.nextElementSibling;for(let k=0;k<4&&n&&!(n.matches&&n.matches('b.sec'));k++){if(/บันทึกตอนนี้|ลบเซฟ/.test(n.textContent))n.style.display='none';n=n.nextElementSibling}}}
 for(const b of menuEl.querySelectorAll('button'))if(/บันทึกตอนนี้|ลบเซฟ เริ่มใหม่/.test(b.textContent))b.style.display='none'}catch(e){}};hideSave74();setTimeout(hideSave74,3000);
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot.apply(this,arguments);try{if(id==='fashion'&&DLG.open&&Array.isArray(DLG.ch)){DLG.ch.splice(Math.max(0,DLG.ch.length-1),0,{t:'✂️ เปลี่ยนรูปลักษณ์ (ผม/ผิว/สีเสื้อ)',f:()=>{try{openLook8()}catch(e){}}});if(!DLG.typing)dlgShowChoices()}}catch(e){}return r};window.ownerTalk=ownerTalk}
// ตลาดนัด: ซุ้มประตูในเมือง
const MKG74={x:20*T+16,y:31*T+12};window.MKG74=MKG74;
function mkGate74(){const x=MKG74.x,y=MKG74.y,t=performance.now()/1000;ctx.save();ctx.translate(x,y);ctx.scale(1.4,1.4);ctx.translate(-x,-y);
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(x,y+6,46,10,0,0,7);ctx.fill();
 for(const s of [-1,1]){ctx.fillStyle='#6a4426';ctx.fillRect(x+s*38-4,y-64,8,70);ctx.fillStyle='#3a2414';ctx.fillRect(x+s*38-6,y+2,12,5)}
 ctx.fillStyle='#8a2a2a';ctx.beginPath();ctx.moveTo(x-50,y-62);ctx.quadraticCurveTo(x,y-90,x+50,y-62);ctx.lineTo(x+50,y-52);ctx.quadraticCurveTo(x,y-80,x-50,y-52);ctx.closePath();ctx.fill();
 for(let i=0;i<8;i++){const px=x-42+i*12;ctx.fillStyle=i%2?'#f4e0b0':'#c84a3a';ctx.beginPath();ctx.moveTo(px,y-56+Math.abs(i-3.5)*-1.6);ctx.lineTo(px+12,y-56+Math.abs(i-2.5)*-1.6);ctx.lineTo(px+6,y-44);ctx.closePath();ctx.fill()}
 for(let i=0;i<6;i++){const px=x-36+i*14.4,py=y-50+Math.sin(i*.9)*3;ctx.fillStyle='hsl('+(i*60+t*20%360)+',80%,'+(55+10*Math.sin(t*3+i))+'%)';ctx.beginPath();ctx.arc(px,py,3.2,0,7);ctx.fill()}
 ctx.fillStyle='#f4e0b0';ctx.strokeStyle='#5a3a1a';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-40,y-82,80,16,5):ctx.rect(x-40,y-82,80,16);ctx.fill();ctx.stroke();
 ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.fillStyle='#5a2a10';ctx.fillText('🏪 ตลาดนัดเอลโดเรีย',x,y-70);
 if(Math.hypot(P.x-x,P.y-y)<52){ctx.lineWidth=3;ctx.strokeStyle='#2a1406';const s='กดโต้ตอบเพื่อเข้าตลาด';ctx.strokeText(s,x,y+22);ctx.fillStyle='#fff';ctx.fillText(s,x,y+22)}ctx.restore()}
{const _h=hero;hero=function(){let ok=false;try{ok=!!(D&&D.town&&!D.shop&&!window.__IN_OTHER8&&ctx.canvas.isConnected&&Math.abs(P.x-MKG74.x)<900&&Math.abs(P.y-MKG74.y)<600)}catch(e){}if(ok)try{mkGate74()}catch(e){}return _h.apply(this,arguments)};window.hero=hero}
{const _it=interact;interact=function(){try{if(D&&D.town&&!D.shop&&Math.hypot(P.x-MKG74.x,P.y-MKG74.y)<52&&!(D.npcs||[]).some(n=>n.vis!==false&&Math.hypot(n.x-P.x,n.y-P.y)<56)){window.__mk74=1;enterMk10();return true}}catch(e){}return _it.apply(this,arguments)};window.interact=interact}
setInterval(()=>{try{if(window.__mk74&&D&&D.town&&!D.shop&&!(typeof inMk10==='function'&&inMk10())){window.__mk74=0;P.x=MKG74.x;P.y=MKG74.y-40;P.dir='u'}}catch(e){}},300);
// ---------- C) บูติก: นายแบบมาตรฐาน ----------
{const _fp=fashPreview;fashPreview=function(kind,id){const sv={armor:Object.assign({},P.armor),cls:P.cls,look:P.look8,tier:P.tier.sword,name:P.name};
  try{for(const s in P.armor)P.armor[s]=null;P.look8=Object.assign({},window.LOOKDEF8||{g:'m'},{top:'#3a3a4a',pants:'#22222c',hair:'#2a1a10'});P.name='';
   let c='sword';const m=/^[cw]_(\w+)$/.exec(String(id));if(m&&CLS[m[1]])c=m[1];P.cls=c;const w=(NEEDW[c]||'sword')+'3';if(ITEMS[w])P.armor.sword=w;P.tier.sword=3;
   return _fp.apply(this,arguments)}finally{Object.assign(P.armor,sv.armor);for(const s in P.armor)if(!(s in sv.armor))P.armor[s]=null;P.cls=sv.cls;P.look8=sv.look;P.tier.sword=sv.tier;P.name=sv.name}};window.fashPreview=fashPreview}
// ---------- D) ชาวเมืองเข้าบ้านนอน ----------
{const _dn=drawNPC;drawNPC=function(n,t){if(!(n&&n.slp&&D&&D.town))return _dn.apply(this,arguments);const x=Math.round(n.x),y=Math.round(n.y);ctx.save();
  ctx.fillStyle='#5a3a1a';ctx.fillRect(x-2,y-24,4,26);ctx.fillStyle='#e8d4a8';ctx.strokeStyle='#5a3a1a';ctx.lineWidth=1.5;ctx.fillRect(x-24,y-40,48,18);ctx.strokeRect(x-24,y-40,48,18);
  ctx.font='bold 8px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.fillStyle='#4a2a10';ctx.fillText('🏠 พักผ่อนในบ้าน',x,y-28);
  if(Math.hypot(P.x-x,P.y-y)<110){ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const s=(n.dn||n.name)+' 💤';ctx.strokeText(s,x,y-46);ctx.fillStyle='#cfe3ff';ctx.fillText(s,x,y-46);
   ctx.font='600 9px system-ui,"Noto Sans Thai",sans-serif';ctx.strokeText('แตะเพื่อเคาะประตู',x,y+14);ctx.fillStyle='#fff';ctx.fillText('แตะเพื่อเคาะประตู',x,y+14)}
  const k=(t*.6+x*.01)%1;ctx.globalAlpha=1-k;ctx.font='bold '+(9+k*5|0)+'px system-ui';ctx.fillStyle='#cfe3ff';ctx.fillText('z',x+20+k*8,y-44-k*14);ctx.restore()};window.drawNPC=drawNPC}
}catch(e){console.warn('fix74',e)}
