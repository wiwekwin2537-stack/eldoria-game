// fix117 (v4.98) — 💎 เจาะรูอุปกรณ์ + อัญมณี (เจ้าของตกลงตามแผน 2026-10-15 01:11)
//  ต่อยอดช่องรูนเดิม (RUNES[id] = รูที่ 1 ใส่รูน) → เจาะรูอัญมณีเพิ่มได้อีก 3 รู ด้วย "สว่านเจาะรู" (รูที่ 2 สำเร็จ 70% · รูที่ 3 40% · รูที่ 4 15% · พลาด = เสียสว่าน ไอเท็มไม่แตก)
//  อัญมณี 5 สี × 5 ขั้น: แดง ดาเมจ · น้ำเงิน คูลดาวน์+ประหยัดมานา · เขียว เลือด+ฟื้นเลือด · เหลือง คริ+ความเสียหายคริ · ม่วง ดาเมจสกิล
//   - รวม 3 เม็ดขั้นเดียวกัน → ขั้นถัดไป 1 เม็ด · ใส่สีเดียวกันครบทุกรู (≥2 รู) ได้โบนัสสีเพิ่ม · ถอดด้วย "คีมถอดอัญมณี" ได้คืน (ไม่มีคีม = อัญมณีแตก)
//  เก็บต่อชนิดไอเท็ม (เหมือนออป/ตีบวก) ใน fm_gem117 · ค่าเข้า PTX แบบ keyed delta · เมนู 💎 อัญมณี · แตะอุปกรณ์ในกระเป๋า → ส่วน "💎 รูอัญมณี"
try{
const SL=['sword','helm','chest','pants','arm','neck','ring'];
const GC={r:{n:'แดง',c:'#ff4a4a',g:['#ffd0d0','#ff3a3a','#7a0a0a'],fx:g=>({dmg:.012*g}),set:{dmg:.03},d:'ดาเมจ'},
 b:{n:'น้ำเงิน',c:'#4aa8ff',g:['#d8ecff','#3a8aff','#0a2a7a'],fx:g=>({cdr:.008*g,mpc:.01*g}),set:{cdr:.03},d:'คูลดาวน์ + ประหยัดมานา'},
 g:{n:'เขียว',c:'#4ae87a',g:['#e0ffe8','#2ad86a','#0a5a2a'],fx:g=>({hp:.015*g,hpr:.001*g}),set:{hp:.04},d:'เลือด + ฟื้นเลือด'},
 y:{n:'เหลือง',c:'#ffd84a',g:['#fff8d0','#ffc83a','#7a5a0a'],fx:g=>({crit:.008*g,cdmg:.03*g}),set:{cdmg:.1},d:'คริ + ความเสียหายคริ'},
 p:{n:'ม่วง',c:'#c86aff',g:['#f4e0ff','#a84aff','#3a0a6a'],fx:g=>({skill:.015*g}),set:{skill:.05},d:'ดาเมจสกิล'}};
const CK=Object.keys(GC),GK=(c,g)=>'gm117_'+c+g,PG=k=>{const m=/^gm117_([rbgyp])([1-5])$/.exec(k);return m?{c:m[1],g:+m[2]}:null};
const DR=[.7,.4,.15],MAXH=3;
const GS={h:{},s:{},v:0};try{Object.assign(GS,JSON.parse(localStorage.getItem('fm_gem117')||'{}')||{})}catch(e){}GS.h=GS.h||{};GS.s=GS.s||{};
const sv=()=>{GS.v=(GS.v|0)+1;try{localStorage.setItem('fm_gem117',JSON.stringify(GS))}catch(e){}try{ptDirty();applyBonus();recalcStats()}catch(e){}};
window.GEM117=GS;
const slotOf=id=>{const it=ITEMS[id];if(!it)return null;if(it.kind==='sword'||it.kind==='staff'||it.kind==='bow'||it.cls)return 'sword';return SL.includes(it.kind)?it.kind:null};
const fxTxt=o=>{try{const d=desc26(o);return Array.isArray(d)?d.join(' · '):String(d)}catch(e){return ''}};
// ---------- ไอเท็ม ----------
INVMETA.drill117=['สว่านเจาะรู','เจาะรูอัญมณีให้อุปกรณ์ 1 รู (รูที่ 2: 70% · 3: 40% · 4: 15% · พลาดไอเท็มไม่แตก)'];
INVMETA.plier117=['คีมถอดอัญมณี','ถอดอัญมณีออกจากรูโดยไม่แตก 1 ครั้ง'];
for(const c of CK)for(let g=1;g<=5;g++)INVMETA[GK(c,g)]=['อัญมณี'+GC[c].n+' ขั้น '+g,'ใส่รูอุปกรณ์: '+fxTxt(GC[c].fx(g))+' · รวม 3 เม็ด = ขั้นถัดไป'];
try{const L=['drill117','plier117'];for(const c of CK)for(let g=1;g<=5;g++)L.push(GK(c,g));for(const k of L)if(window.INVORDER&&!INVORDER.includes(k))INVORDER.push(k)}catch(e){}
try{const _mi=matIcon;matIcon=function(key){const P2=PG(key);if(!P2&&key!=='drill117'&&key!=='plier117')return _mi.apply(this,arguments);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');k.lineJoin='round';k.lineCap='round';
 if(P2){const G=GC[P2.c].g,gr=k.createLinearGradient(10,6,38,42);gr.addColorStop(0,G[0]);gr.addColorStop(.5,G[1]);gr.addColorStop(1,G[2]);k.fillStyle=gr;k.strokeStyle='#120810';k.lineWidth=2;
  k.beginPath();k.moveTo(14,12);k.lineTo(34,12);k.lineTo(42,22);k.lineTo(24,42);k.lineTo(6,22);k.closePath();k.fill();k.stroke();k.strokeStyle='rgba(255,255,255,.6)';k.lineWidth=1;k.beginPath();k.moveTo(6,22);k.lineTo(42,22);k.moveTo(14,12);k.lineTo(19,22);k.lineTo(24,42);k.lineTo(29,22);k.lineTo(34,12);k.stroke();
  k.fillStyle='rgba(255,255,255,.75)';k.beginPath();k.moveTo(16,14);k.lineTo(22,14);k.lineTo(18,19);k.closePath();k.fill();for(let i=0;i<P2.g;i++){k.fillStyle='#ffe08a';k.strokeStyle='#000';k.lineWidth=1;k.beginPath();k.arc(8+i*8,45,2.6,0,7);k.fill();k.stroke()}}
 else if(key==='drill117'){k.fillStyle='#8a5a2a';k.strokeStyle='#1a0a04';k.lineWidth=2;k.fillRect(6,18,18,12);k.strokeRect(6,18,18,12);const g2=k.createLinearGradient(0,16,0,32);g2.addColorStop(0,'#f0f4ff');g2.addColorStop(1,'#6a7488');k.fillStyle=g2;k.beginPath();k.moveTo(24,16);k.lineTo(44,24);k.lineTo(24,32);k.closePath();k.fill();k.stroke();k.strokeStyle='#4a5468';k.lineWidth=1.2;for(let i=0;i<4;i++){k.beginPath();k.moveTo(27+i*4,18+i);k.lineTo(29+i*4,30-i);k.stroke()}k.fillStyle='#e8c14a';k.fillRect(10,30,6,12);k.strokeRect(10,30,6,12)}
 else{k.strokeStyle='#1a1a1a';k.lineWidth=6;k.beginPath();k.moveTo(10,42);k.lineTo(24,22);k.moveTo(38,42);k.lineTo(24,22);k.stroke();k.strokeStyle='#c8ccd8';k.lineWidth=4;k.stroke();k.strokeStyle='#5a6070';k.lineWidth=5;k.beginPath();k.moveTo(24,22);k.lineTo(18,6);k.moveTo(24,22);k.lineTo(30,6);k.stroke();k.fillStyle='#ff4a4a';k.beginPath();k.arc(24,22,3.5,0,7);k.fill()}
 return c};window.matIcon=matIcon}catch(e){}
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)||[]}catch(e){}const k=String(key).replace(/^mat:/,'');const P2=PG(k);
 if(P2)S=[['⚔️','ขั้น 1: ดรอปจากมอนทุกแมพ 1.5% (สีสุ่ม)'],['👑','บอส 30% (ขั้นตามเลเวลบอส: ต่ำกว่า 60 = ขั้น 1 · 60–119 = ขั้น 2 · 120+ = ขั้น 3 · บอสนครวารีมีลุ้นขั้น 4)'],['💎','รวม 3 เม็ดขั้นเดียวกัน = ขั้นถัดไป (เมนู 💎 อัญมณี)']];
 else if(k==='drill117')S=[['👑','บอส 12%'],['🌀','มอนในดันเจี้ยนนครวารี 1.5%']];else if(k==='plier117')S=[['👑','บอส 10%'],['🌀','มอนในดันเจี้ยนนครวารี 1%']];return S};window.src7=src7}
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);const r=_mk.apply(this,arguments);try{if(m&&!was&&m.dead&&!m.g117&&(typeof W33==='undefined'||W33.mode==='solo'||m.my33>0)){m.g117=1;
 const dg=!!(window.dgOf96&&dgOf96()),lv=(m.lv|0)||P.lv,c=CK[Math.random()*5|0];
 if(m.boss){if(Math.random()<.3){let g=lv>=120?3:lv>=60?2:1;if(dg&&Math.random()<.25)g=4;addDrop(GK(c,g),m.x,m.y)}if(Math.random()<.12)addDrop('drill117',m.x+10,m.y);if(Math.random()<.1)addDrop('plier117',m.x-10,m.y)}
 else{if(Math.random()<.015)addDrop(GK(c,1),m.x,m.y);if(dg){if(Math.random()<.015)addDrop('drill117',m.x,m.y);if(Math.random()<.01)addDrop('plier117',m.x,m.y)}}}}catch(e){}return r};window.mobKill=mobKill}
// ---------- ค่าพลังเข้า PTX ----------
function want(){const W={};const ad=o=>{for(const k in o)W[k]=(W[k]||0)+o[k]};for(const s of SL){const id=P.armor&&P.armor[s];if(!id)continue;const L=(GS.s[id]||[]).filter(Boolean);for(const k of L){const q=PG(k);if(q)ad(GC[q.c].fx(q.g))}
 const n=GS.h[id]|0;if(n>=2&&L.length===n){const c0=PG(L[0]);if(c0&&L.every(k=>PG(k).c===c0.c))ad(GC[c0.c].set)}}return W}
{const _p=PTX;PTX=function(){const o=_p.apply(this,arguments);try{if(!o)return o;const key=SL.map(s=>P.armor&&P.armor[s]||'').join('|')+'#'+(GS.v|0);if(o.__k117!==key){const old=o.__a117||{};for(const k in old)o[k]=(o[k]||0)-old[k];const W=want();for(const k in W)o[k]=(o[k]||0)+W[k];o.__a117=W;o.__k117=key}}catch(e){}return o};window.PTX=PTX}
// ---------- ส่วนในการ์ดไอเท็ม ----------
const css=document.createElement('style');css.textContent='.gm117{margin:6px 0;padding:6px 8px;border-radius:9px;background:#0e1420;border:1px solid #4aa8ff55;font-size:12px}.gm117 b{color:#9fd4ff}.gm117 .hs{display:flex;gap:6px;margin:6px 0;flex-wrap:wrap}.gm117 .h{width:46px;height:46px;border-radius:50%;border:2px dashed #4a5a7a;display:flex;align-items:center;justify-content:center;background:#060a12;position:relative}.gm117 .h img{width:34px;height:34px}.gm117 .h.f{border-style:solid;border-color:#9fd4ff}.gm117 .h.lk{opacity:.35}.gm117 .h button{position:absolute;inset:0;opacity:0}.gm117 .ln{display:block;color:#bfe0ff}.gm117 .rw{display:flex;gap:6px;flex-wrap:wrap;margin-top:5px}.gm117 .rw button{flex:1;min-width:110px;height:auto;min-height:40px;font-size:13px;line-height:1.4;padding:8px;border-radius:8px;border:0;font-weight:800;background:linear-gradient(180deg,#9fd4ff,#3a8aff);color:#061428}.gm117 .rw button:disabled{background:#2a3040;color:#777}'
 +'#gm117w .w{width:min(620px,97%);height:auto;max-height:96%}#gm117w .bd{display:block!important;overflow:auto;padding:10px 12px}#gm117w h4{color:#ffd86a;margin:8px 0 4px}#gm117w .gr{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}#gm117w .gc{background:#141020;border:1px solid #ffffff22;border-radius:9px;min-width:0;padding:6px;text-align:center;font-size:13px;line-height:1.4;display:flex;flex-direction:column;align-items:center;gap:3px}#gm117w .gc img{width:30px;height:30px}#gm117w .gc button{width:100%;height:40px;min-height:40px;flex-shrink:0;margin-top:auto;padding:5px 0;border:0;border-radius:7px;font-weight:800;font-size:12px;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}#gm117w .gc button:disabled{background:#2a2438;color:#777}#gm117w .pk{display:flex;gap:6px;flex-wrap:wrap}#gm117w .pk button{padding:6px 8px;border-radius:9px;border:1px solid #9fd4ff;background:#0e1420;color:#e8f4ff;font-size:13px;height:auto;min-height:40px;display:flex;align-items:center;gap:4px}#gm117w .gc img{align-self:center}#gm117w .pk img{width:24px;height:24px}@media(max-width:500px){#gm117w .gr{grid-template-columns:repeat(3,minmax(0,1fr))}#gm117w .bd{padding:8px}}@media(max-width:350px){#gm117w .gr{grid-template-columns:repeat(2,minmax(0,1fr))}}';document.head.appendChild(css);
const have=id=>(GEAR[id]|0)>0||SL.some(s=>P.armor[s]===id);
function html(id){if(!slotOf(id))return '';const n=GS.h[id]|0,L=GS.s[id]||[];let h='<div class="gm117"><b>💎 รูอัญมณี '+n+'/'+MAXH+'</b> <small style="color:#888">(รูที่ 1 = ช่องรูนเดิม)</small><div class="hs">';
 for(let i=0;i<MAXH;i++){const k=L[i];if(i>=n)h+='<div class="h lk">🔒</div>';else if(k)h+='<div class="h f" title="'+MN(k)+'"><img src="'+iconURL('mat:'+k)+'"><button onclick="gUn117(\''+id+'\','+i+')"></button></div>';else h+='<div class="h" title="แตะเพื่อใส่อัญมณี">➕<button onclick="gPick117(\''+id+'\','+i+')"></button></div>'}
 h+='</div>';const fl=L.filter(Boolean);if(fl.length)h+=fl.map(k=>{const q=PG(k);return '<span class="ln">• '+GC[q.c].n+' ขั้น '+q.g+': '+fxTxt(GC[q.c].fx(q.g))+'</span>'}).join('');
 if(n>=2&&fl.length===n){const c0=PG(fl[0]);if(fl.every(k=>PG(k).c===c0.c))h+='<span class="ln" style="color:#ffd86a">✨ ครบสี'+GC[c0.c].n+': '+fxTxt(GC[c0.c].set)+'</span>'}
 if(have(id)&&n<MAXH)h+='<div class="rw"><button '+((inv.drill117|0)>0?'':'disabled')+' onclick="gDrill117(\''+id+'\')">🔩 เจาะรูที่ '+(n+2)+' ('+Math.round(DR[n]*100)+'% · สว่าน '+(inv.drill117|0)+')</button></div>';
 h+='<small style="color:#888;display:block;margin-top:4px">แตะรูว่างเพื่อใส่ · แตะอัญมณีเพื่อถอด (มีคีม '+(inv.plier117|0)+')</small></div>';return h}
window.gem117html=html;
const reopen=id=>{try{icShow('gear',id)}catch(e){}};
window.gDrill117=id=>{const n=GS.h[id]|0;if(n>=MAXH||!(inv.drill117>0))return;inv.drill117--;try{refreshInv()}catch(e){}if(Math.random()<DR[n]){GS.h[id]=n+1;GS.s[id]=GS.s[id]||[];sv();sfx('chest');try{flash('#9fd4ff',.3);banner('🔩 เจาะรูสำเร็จ!',ITEMS[id].name+' — รูอัญมณี '+(n+1)+'/'+MAXH,'green')}catch(e){say('🔩 เจาะรูสำเร็จ!')}}else{sv();sfx('thud');say('💥 เจาะพลาด… สว่านหัก (ไอเท็มไม่เป็นไร)')}reopen(id)};
window.gPick117=(id,i)=>{const L=[];for(const c of CK)for(let g=5;g>=1;g--){const k=GK(c,g);if(inv[k]>0)L.push(k)}if(!L.length){say('ไม่มีอัญมณีในกระเป๋า — ดรอปจากมอน/บอส');sfx('thud');return}
 talk({name:'ช่องอัญมณี',c:'#3a8aff'},'เลือกอัญมณีที่จะใส่ในรู '+(i+2)+' ของ '+ITEMS[id].name,L.slice(0,9).map(k=>({t:MN(k)+' ×'+inv[k]+' — '+fxTxt(GC[PG(k).c].fx(PG(k).g)),f:()=>{if(!(inv[k]>0))return;inv[k]--;GS.s[id]=GS.s[id]||[];GS.s[id][i]=k;sv();try{refreshInv()}catch(e){}sfx('gem');say('💎 ใส่'+MN(k)+'แล้ว');reopen(id)}})).concat([BYE]),'💎 ใส่อัญมณี')};
window.gUn117=(id,i)=>{const k=(GS.s[id]||[])[i];if(!k)return;const pl=(inv.plier117|0)>0;
 talk({name:'ช่องอัญมณี',c:'#3a8aff'},pl?'ถอด'+MN(k)+'ด้วยคีม (ใช้คีม 1 อัน ได้อัญมณีคืน)':'ไม่มีคีมถอด — ถ้าถอดตอนนี้ '+MN(k)+' จะแตกหายไป',[{t:pl?'🔧 ถอดด้วยคีม':'💥 ถอด (อัญมณีแตก)',c:pl?'go':'',f:()=>{if(pl){inv.plier117--;inv[k]=(inv[k]|0)+1}GS.s[id][i]=null;sv();try{refreshInv()}catch(e){}sfx(pl?'ui':'thud');reopen(id)}},BYE],'💎 ถอดอัญมณี')};
{const _ic=icShow;icShow=function(t,k){const r=_ic.apply(this,arguments);try{if(t==='gear'&&slotOf(k)&&!icEl.hidden&&!icEl.querySelector('.gm117')){const host=icEl.querySelector('.op111');if(host)host.insertAdjacentHTML('afterend',html(k));else icEl.insertAdjacentHTML('beforeend',html(k))}}catch(e){}return r};window.icShow=icShow}
// ---------- หน้าต่าง 💎 อัญมณี (รวม 3 → 1) ----------
const W=mk6('gm117w');
function render(){let h='<div class="w"><div class="hd"><b>💎 อัญมณี</b><button onclick="p6close(gid(\'gm117w\'))">✕</button></div><div class="bd"><small style="color:#aaa">รวมอัญมณีขั้นเดียวกัน 3 เม็ด = ขั้นถัดไป 1 เม็ด · ใส่อัญมณี: แตะอุปกรณ์ในกระเป๋า → 💎 รูอัญมณี · มีสว่าน '+(inv.drill117|0)+' · คีม '+(inv.plier117|0)+'</small>';
 for(const c of CK){h+='<h4 style="color:'+GC[c].c+'">'+GC[c].n+' — '+GC[c].d+'</h4><div class="gr">';for(let g=1;g<=5;g++){const k=GK(c,g),n=inv[k]|0;h+='<div class="gc"><img src="'+iconURL('mat:'+k)+'"><div>ขั้น '+g+' ×'+n+'</div><small style="color:#c1c7d7;font-size:12px">'+fxTxt(GC[c].fx(g))+'</small>'+(g<5?'<button '+(n>=3?'':'disabled')+' onclick="gMix117(\''+c+'\','+g+')">รวม 3→1</button>':'')+'</div>'}h+='</div>'}
 h+='<h4>🛡️ อุปกรณ์ที่ใส่อยู่</h4><div class="pk">'+SL.map(s=>P.armor[s]).filter(id=>id&&ITEMS[id]).map(id=>'<button onclick="p6close(gid(\'gm117w\'));icShow(\'gear\',\''+id+'\')"><img src="'+iconURL('item:'+id)+'">'+ITEMS[id].name+' 💎'+((GS.s[id]||[]).filter(Boolean).length)+'/'+(GS.h[id]|0)+'</button>').join('')+'</div>';
 W.innerHTML=h+'</div></div>'}
window.gMix117=(c,g)=>{const k=GK(c,g);if((inv[k]|0)<3||g>=5)return;inv[k]-=3;const k2=GK(c,g+1);inv[k2]=(inv[k2]|0)+1;try{refreshInv();saveGame(false)}catch(e){}sfx('gem');say('💎 ได้ '+MN(k2));render()};
window.open117=()=>{render();p6open(W)};
try{if(!PM7.some(m=>m[1]==='อัญมณี')){const at=PM7.findIndex(m=>m[1]==='อัปดาว');PM7.splice(at<0?PM7.length:at+1,0,['💎','อัญมณี',()=>open117()]);pmRender7()}}catch(e){}
(window.EXTRA111=window.EXTRA111||[]).push(()=>{const W2=want();const t=fxTxt(W2);return {n:'💎 อัญมณีในรู',txt:t||'— ยังไม่มี'}});
}catch(e){console.warn('fix117',e)}
