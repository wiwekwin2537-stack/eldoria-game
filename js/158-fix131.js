// =====================================================================
// fix131 (v5.03) — 🔒 หินล็อกออป (ไอเท็มใหม่ คู่กับ 🎲 หินสุ่มออป fix111)
//  ตอนกด 🎲 สุ่มออปใหม่: เลือกล็อกบรรทัดที่ชอบได้ (ใช้หินล็อก 1 ก้อน/บรรทัด) → บรรทัดที่ล็อกไม่เปลี่ยน สุ่มเฉพาะที่เหลือ
//  ดรอป: มอน 0.4% · บอส 12% · ซื้อขายได้ในตลาดกลาง
// =====================================================================
try{
INVMETA.lock130=['หินล็อกออป','ล็อกบรรทัดออปที่ชอบไว้ตอนสุ่มออปใหม่ (1 ก้อน/บรรทัด) · แตะอุปกรณ์ในกระเป๋า → แตะ 🔓 ที่บรรทัดออป'];
try{if(window.INVORDER&&!INVORDER.includes('lock130'))INVORDER.push('lock130')}catch(e){}
try{const _mi=matIcon;matIcon=function(key){if(key!=='lock130')return _mi.apply(this,arguments);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');
 const g=k.createLinearGradient(8,6,40,42);g.addColorStop(0,'#fff6d0');g.addColorStop(.5,'#6ad8ff');g.addColorStop(1,'#1a4a8a');k.fillStyle=g;k.strokeStyle='#0a1a2a';k.lineWidth=2;
 k.beginPath();k.moveTo(24,4);k.lineTo(42,16);k.lineTo(38,38);k.lineTo(24,45);k.lineTo(10,38);k.lineTo(6,16);k.closePath();k.fill();k.stroke();
 k.fillStyle='#2a1a06';k.fillRect(16,22,16,13);k.strokeStyle='#2a1a06';k.lineWidth=3;k.beginPath();k.arc(24,22,6,Math.PI,0);k.stroke();k.fillStyle='#ffd86a';k.fillRect(22,26,4,5);return c};window.matIcon=matIcon}catch(e){}
try{if(window.IURL)delete IURL['mat:lock130']}catch(e){}
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)||[]}catch(e){}if(String(key).replace(/^mat:/,'')==='lock130')S=[['⚔️','ดรอปจากมอนทุกแมพ 0.4% · บอส 12%'],['🏪','ซื้อจากผู้เล่นในตลาดกลาง']];return S};window.src7=src7}
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);const r=_mk.apply(this,arguments);try{if(m&&!was&&m.dead&&!m.l131&&(typeof W33==='undefined'||W33.mode==='solo'||m.my33>0)){m.l131=1;if(Math.random()<(m.boss?.12:.004))addDrop('lock130',m.x,m.y)}}catch(e){}return r};window.mobKill=mobKill}
const LK={id:null,s:new Set()};window.LK131=LK;
{const _r=window.opRoll111;window.opRoll111=function(id){const S=window.OPT111,L=(S&&S.o[id])||[],keep=LK.id===id?[...LK.s].filter(i=>L[i]):[];
  if(keep.length&&(inv.lock130|0)<keep.length){say('🔒 หินล็อกออปไม่พอ (ต้องใช้ '+keep.length+' ก้อน)');sfx('thud');return}
  const has=inv.opt111|0;_r.apply(this,arguments);if((inv.opt111|0)>=has||!keep.length){LK.s.clear();return}
  try{inv.lock130-=keep.length;const N=S.p[id]||[],lk=keep.map(i=>L[i]),ks=new Set(lk.map(x=>x[0]));const nw=N.filter(x=>!ks.has(x[0]));
   S.p[id]=lk.concat(nw).slice(0,Math.max(N.length,lk.length+1));S.v=(S.v|0)+1;localStorage.setItem('fm_opt111',JSON.stringify({o:S.o,p:S.p,v:S.v}));refreshInv();say('🔒 ล็อก '+keep.length+' บรรทัด — สุ่มเฉพาะที่เหลือ');icShow('gear',id)}catch(e){console.warn('lock131',e)}LK.s.clear()}}
window.lkTog131=(id,i)=>{if(LK.id!==id){LK.id=id;LK.s.clear()}if(LK.s.has(i))LK.s.delete(i);else{if(LK.s.size+1>(inv.lock130|0)){say('🔒 หินล็อกออปไม่พอ — มี '+(inv.lock130|0)+' ก้อน');sfx('thud');return}LK.s.add(i)}sfx('ui');icShow('gear',id)};
{const _ic=icShow;icShow=function(t,k){if(LK.id!==k){LK.id=k;LK.s.clear()}const r=_ic.apply(this,arguments);try{const box=icEl.querySelector('.op111');const S=window.OPT111;if(t!=='gear'||!box||!S||S.p[k])return r;const L=S.o[k]||[];if(!L.length)return r;
  const lns=box.querySelectorAll('.ln');lns.forEach((el,i)=>{const on=LK.s.has(i);const b=document.createElement('button');b.textContent=on?'🔒':'🔓';b.title='ล็อกบรรทัดนี้ตอนสุ่ม (ใช้หินล็อก 1)';
   b.style.cssText='flex:none;min-width:0;width:auto;height:auto;padding:0 6px;margin-left:6px;font-size:12px;border-radius:6px;border:1px solid '+(on?'#6ad8ff':'#5a5070')+';background:'+(on?'#1a4a6a':'#241c34');b.onclick=e=>{e.stopPropagation();lkTog131(k,i)};el.appendChild(b)});
  const rb=box.querySelector('button[onclick^="opRoll111"]');if(rb){rb.insertAdjacentHTML('afterend','');const sm=document.createElement('small');sm.style.cssText='display:block;width:100%;color:#9fd8ff;margin-top:3px';sm.textContent='🔒 หินล็อกออป: มี '+(inv.lock130|0)+(LK.s.size?' · จะใช้ '+LK.s.size+' ก้อน':' · แตะ 🔓 ที่บรรทัดเพื่อล็อก');rb.parentNode.appendChild(sm)}}catch(e){}return r};window.icShow=icShow}
}catch(e){console.warn('fix131',e)}
