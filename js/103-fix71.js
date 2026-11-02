// fix71 (v4.63) — รอบ 1 งานชุดใหม่ (HANDOFF ข้อ 5, 6, 8, 11, 17-น้ำ, 21)
//  A) สมุนของผู้เล่นอื่นเห็นบนจอแล้ว (ส่ง st.mn = สมุนสูงสุด 8 ตัว ตำแหน่งเทียบตัวผู้เล่น · server.js sanitize 'mn') · วาดด้วย minDraw เดิม
//  B) ไอริส (กิลด์นักผจญภัย) ไม่มีตัวเลือก "กิลด์ของผู้เล่น" แล้ว — กิลด์ผู้เล่นเปิดจากเมนูหลัก 🛡️ กิลด์ เท่านั้น
//  C) ตารางอันดับ: แถว/โพเดียมของตัวเองใช้รูปปัจจุบัน (เหมือนการ์ดโปรไฟล์) · เปลี่ยนชุดแฟชั่น → ซิงก์คลาวด์ทันที อันดับอัปเดตรูปเร็วขึ้น
//  D) กุญแจ GM ชุดใหม่ (เจ้าของทำหาย) — ในโค้ดมีแค่ค่าแฮช · กุญแจเดิมยังใช้ได้
//  E) ว่ายน้ำได้ในแมพธรรมชาติ (ลำธาร/บ่อน้ำ K=2 ของ NAT16 ที่ไม่ใช่ลาวา) · ช้าลงเหมือนว่ายในทุ่งหญ้า · มอนยังข้ามน้ำไม่ได้
//  F) ข้อความลิขสิทธิ์หน้าเข้าเกม
try{
// ---------- A) สมุนออนไลน์ ----------
{const _send=WebSocket.prototype.send;WebSocket.prototype.send=function(s){try{if(typeof NET!=='undefined'&&this===NET.ws&&typeof s==='string'&&s.startsWith('{"t":"st"')&&MIN.length&&!(D&&(D.town||D.shop))){const o=JSON.parse(s);
  o.mn=MIN.filter(m=>m&&!m.dead&&MSPEC[m.k]).slice(0,8).map(m=>({k:m.k,x:Math.round(m.x-P.x),y:Math.round(m.y-P.y),f:m.fx<0?-1:1,m:m.mv?1:0,s:m.st==='strike'?1:0,c:+(m.sc||1).toFixed(2)}));s=JSON.stringify(o)}}catch(e){}return _send.call(this,s)}}
{const _nv=window.NETV8;window.NETV8=function(o,s){try{o.mn=Array.isArray(s.mn)?s.mn:null}catch(e){}return _nv?_nv.apply(this,arguments):undefined}}
{const _do=drawOther;drawOther=function(o){const r=_do.apply(this,arguments);try{if(o&&Array.isArray(o.mn)&&o.mn.length&&!o.dead){const t=performance.now()/1000;o.mn.forEach((q,i)=>{const S=MSPEC[q.k];if(!S)return;
  minDraw({k:q.k,S,x:o.x+q.x,y:o.y+q.y,t:3,l:999,born:0,sc:q.c||1,fx:q.f||1,mv:!!q.m,st:q.s?'strike':'idle',stt:0,hurt:0,ph:i*1.7,mhp:0,hp:0},t)})}}catch(e){}return r};window.drawOther=drawOther}
// ---------- B) ไอริส ----------
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot.apply(this,arguments);try{if(id==='guild'&&DLG.open&&Array.isArray(DLG.ch)){const n=DLG.ch.length;DLG.ch=DLG.ch.filter(c=>!/กิลด์ของผู้เล่น/.test(c&&c.t||''));if(DLG.ch.length!==n&&!DLG.typing)try{dlgShowChoices()}catch(e){}}}catch(e){}return r};window.ownerTalk=ownerTalk}
// ---------- C) อันดับ: รูปของตัวเองเป็นปัจจุบัน ----------
{const _r=lbRender20;lbRender20=function(){const tab=LB20.tab,L=LB20.data&&LB20.data[tab],me=String(P.name||''),sv=[];
  try{if(Array.isArray(L)&&me)L.forEach((x,i)=>{if(x&&x.n===me){sv.push([i,x.av]);x.av=myAv65()}})}catch(e){}
  try{return _r.apply(this,arguments)}finally{for(const [i,a] of sv)L[i].av=a}};window.lbRender20=lbRender20}
{const _fw=window.fashWear;if(_fw)window.fashWear=function(){const r=_fw.apply(this,arguments);try{clearTimeout(window.__fwSync71);window.__fwSync71=setTimeout(()=>{try{saveGame(true);CLOUD.sync&&CLOUD.sync()}catch(e){}},2500)}catch(e){}return r}}
// ---------- D) กุญแจ GM ใหม่ (เก็บเฉพาะแฮช) ----------
const GM71_HASH='33011594c1caecd8e9e43637704680d84a9977b751207f4ad6d7d48f240a6f4f';
{const okH=k=>{const h=sha256hex8('eldoria-gm8:'+String(k||'').trim().toUpperCase());return h===GM8_HASH||h===GM71_HASH};
 gm8Check=function(){try{const k=localStorage.getItem('fm_gmkey8')||'';GM8.ok=!!k&&okH(k)}catch(e){GM8.ok=false}return GM8.ok};window.gm8Check=gm8Check;
 gmKey8=function(k){k=String(k||'').trim().toUpperCase();if(!(FM_ACCT&&GM_IDS.includes(String(FM_ACCT).toLowerCase()))){say('ไอดีนี้ไม่มีสิทธิ์ GM');sfx('thud');return}
  if(!okH(k)){say('กุญแจ GM ไม่ถูกต้อง');sfx('thud');return}try{localStorage.setItem('fm_gmkey8',k)}catch(e){}gm8Check();try{gmBtn()}catch(e){}say('🛠️ ยืนยัน GM สำเร็จ (จำไว้ในเครื่องนี้แล้ว)');sfx('gem')};window.gmKey8=gmKey8;
 try{gm8Check()}catch(e){}}
// ---------- E) ว่ายน้ำในแมพธรรมชาติ ----------
const wz71=()=>{try{const Z=D&&D.zone;if(!Z||!Z.K||D.dg)return false;const N=NAT16[Z.Zd&&Z.Zd.id];return !!(N&&!N.lava)}catch(e){return false}};
const kAt71=(x,y)=>{const Z=D.zone,tx=Math.floor(x/T),ty=Math.floor(y/T);return Z.K[ty]&&Z.K[ty][tx]};
{const _zh=zHit;zHit=function(x,y){if(!(window.INPT10&&wz71()&&!P.dead&&!(MOUNT&&MOUNT.on)))return _zh.apply(this,arguments);const Zm=D.zone;
  for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]]){const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);if(!Zm.m[ty])return true;if(Zm.m[ty][tx]!==FL&&!(Zm.K[ty]&&Zm.K[ty][tx]===2))return true;const o=Zm.oreAt[ty*ZW+tx];if(o&&o.alive)return true}return false};window.zHit=zHit}
{const _sw=window.swim10;window.swim10=function(){try{if(_sw&&_sw())return true;if(P.dead||!wz71())return false;return kAt71(P.x,P.y)===2}catch(e){return false}}}
setInterval(()=>{try{if(MOUNT&&MOUNT.on&&wz71()&&kAt71(P.x,P.y)===2&&!(typeof isFly10==='function'&&isFly10())){MOUNT.on=false;try{mountB.classList.remove('on')}catch(e){}say('🌊 สัตว์ขี่ว่ายน้ำไม่ได้ — ลงจากหลังแล้ว')}}catch(e){}},400);
// ---------- F) ลิขสิทธิ์ ----------
try{const t=document.getElementById('title')||titleEl;if(t&&!t.querySelector('.cr71')){const d=document.createElement('div');d.className='cr71';d.textContent='© 2026 ตำนานเอลโดเรีย (Eldoria Chronicles) · สงวนลิขสิทธิ์ ห้ามคัดลอก ดัดแปลง หรือเผยแพร่ซ้ำโดยไม่ได้รับอนุญาต';d.style.cssText='position:absolute;left:0;right:0;bottom:4px;text-align:center;font:500 10px system-ui,"Noto Sans Thai",sans-serif;color:rgba(255,255,255,.45);pointer-events:none;z-index:5';t.appendChild(d)}}catch(e){}
}catch(e){console.warn('fix71',e)}
