// fix111 (v4.95) — 🎲 ระบบออป + 🛡️ โบนัสชุด 7 ชิ้น (3/5/7) + 📊 หน้าคุณสมบัติรวม (เจ้าของขอ 2026-10-14 21:55 · เลือก "สุ่มออป + หินรีออป" และ "ขั้น 3/5/7 ชิ้น")
//  ออป: อุปกรณ์ทุกชิ้น (อาวุธ หมวก เสื้อ กางเกง แขน สร้อย แหวน) มีค่าสุ่ม 1–4 บรรทัด ตามระดับไอเท็ม · เก็บต่อชนิดไอเท็ม (เกมเก็บของเป็นจำนวนต่อชนิด) ใน fm_opt111
//   - ได้ชิ้นซ้ำ (คราฟ/ดรอป/ซื้อ) = ได้ "ออปใหม่รอเลือก" → แตะไอเท็มเลือกเก็บออปเดิมหรือใช้ออปใหม่ (= คราฟวนลูปหาออปสวย)
//   - "หินสุ่มออป" (opt111) สุ่มออปใหม่ให้ชิ้นที่มีอยู่ได้ · ดรอปมอน 1.2% · บอส 30% · หีบรายวัน
//   - ค่าออปเข้าระบบโบนัสกลาง PTX() (ตัวเดียวกับต้นไม้พาสซีฟ) ทั้ง % และค่าพลัง STR/VIT/AGI/INT/END
//  (ปรับ v4.96: เพิ่มออป cdmg ความเสียหายคริ — ค่าเข้า CRITD ผ่าน PTX().cdmg ใน fix115)
//  ชุด 7 ชิ้น: นับอาวุธ+หมวก+เสื้อ+กางเกง+แขน+สร้อย+แหวน ระดับเดียวกัน · 3 ชิ้น = โบนัสขั้น 1 (SETB[t][0]) · 5 ชิ้น = ขั้น 2 (SETB[t][1]) · 7 ชิ้น = พลังพิเศษเต็มเซ็ต (เซ็ตนครวารีใช้ B101 · เซ็ตอื่นดาเมจ/เลือดตามระดับ)
//   (แทนของเดิมที่นับแค่ชุดเกราะ 4 ชิ้น 2/4 — หักของเดิมออกแล้วใส่ของใหม่ ไม่ได้แก้โค้ดเดิม)
try{
const SL111=['sword','helm','chest','pants','arm','neck','ring'];
const ST111={o:{},p:{},v:0};try{Object.assign(ST111,JSON.parse(localStorage.getItem('fm_opt111')||'{}')||{})}catch(e){}ST111.o=ST111.o||{};ST111.p=ST111.p||{};
const sv111=()=>{ST111.v=(ST111.v|0)+1;try{localStorage.setItem('fm_opt111',JSON.stringify({o:ST111.o,p:ST111.p,v:ST111.v}))}catch(e){}try{ptDirty()}catch(e){}try{applyBonus();recalcStats()}catch(e){}};
window.OPT111=ST111;
// ---------- ตารางออป ----------  [ชื่อ, ช่วงค่าระดับ 0, ช่วงเพิ่มต่อระดับ, ชนิด(st=ค่าพลังบวกตรง, %=สัดส่วน)]
const OP111={
 str:['STR',[1,2],.55,'st'],vit:['VIT',[1,2],.55,'st'],agi:['AGI',[1,2],.55,'st'],int:['INT',[1,2],.55,'st'],end:['END',[1,2],.4,'st'],
 dmg:['ดาเมจ',[.01,.02],.0018,'%'],skill:['ดาเมจสกิล',[.02,.03],.0025,'%'],crit:['คริติคอล',[.01,.015],.0012,'%'],cdmg:['ความเสียหายคริ',[.03,.05],.004,'%'],hp:['เลือดสูงสุด',[.02,.03],.0022,'%'],
 dr:['ดาเมจที่ได้รับ -',[.01,.015],.001,'%'],cdr:['คูลดาวน์ -',[.01,.015],.001,'%'],aspd:['ตีเร็ว',[.01,.02],.0015,'%'],spd:['ความเร็วเดิน',[.01,.02],.0008,'%'],mpc:['สกิลใช้มานา -',[.02,.03],.0015,'%']};
const OPK111=Object.keys(OP111);
const W111={sword:['dmg','skill','crit','cdmg','aspd','str','int','agi'],helm:['hp','int','vit','cdr','dr'],chest:['hp','dr','vit','str','end'],pants:['spd','end','agi','hp','dr'],arm:['aspd','crit','cdmg','agi','str','dmg'],neck:['skill','int','mpc','cdr','crit'],ring:['dmg','crit','cdmg','str','agi','int']};
const slotOf111=id=>{const it=ITEMS[id];if(!it)return null;const k=it.kind;if(k==='sword'||k==='staff'||k==='bow'||it.cls)return 'sword';return SL111.includes(k)?k:null};
const tierOf111=id=>(ITEMS[id]&&ITEMS[id].tier)|0;
const val111=(k,t)=>{const D=OP111[k],lo=D[1][0]+D[2]*t*.6,hi=D[1][1]+D[2]*t;let v=lo+Math.random()*(hi-lo);return D[3]==='st'?Math.max(1,Math.round(v)):Math.round(v*1000)/1000};
const max111=(k,t)=>{const D=OP111[k];return D[1][1]+D[2]*t};
function roll111(id){const s=slotOf111(id);if(!s)return null;const t=tierOf111(id),r=Math.random(),n=r<.4?1:r<.75?2:r<.93?3:4;const pref=W111[s]||OPK111,L=[],used={};
 for(let i=0;i<n;i++){let k=null;for(let g=0;g<20&&!k;g++){const c=Math.random()<.7?pref[Math.random()*pref.length|0]:OPK111[Math.random()*OPK111.length|0];if(!used[c])k=c}if(!k)break;used[k]=1;L.push([k,val111(k,t)])}return L}
const score111=(L,id)=>{const t=tierOf111(id);let s=0;for(const [k,v] of L||[])s+=v/max111(k,t);return s};
const line111=([k,v])=>{const D=OP111[k];if(!D)return '';return D[3]==='st'?D[0]+' +'+v:(D[0].endsWith('-')?D[0]+' '+(v*100).toFixed(1)+'%':D[0]+' +'+(v*100).toFixed(1)+'%')};
window.line111=line111;
// ---------- ติดตามของที่ได้ใหม่ ----------
const own111=()=>{const c={};for(const id in GEAR)if(slotOf111(id))c[id]=(c[id]|0)+(GEAR[id]|0);for(const s of SL111){const id=P.armor&&P.armor[s];if(id&&slotOf111(id))c[id]=(c[id]|0)+1}return c};
let snap111=null;
function watch111(){if(typeof P==='undefined'||!P||!titleEl.hidden)return;const c=own111();if(!snap111){snap111=c;let ch=0;for(const id in c)if(!ST111.o[id]){ST111.o[id]=roll111(id)||[];ch=1}if(ch)sv111();return}
 let ch=0;for(const id in c){const d=(c[id]|0)-(snap111[id]|0);if(d<=0)continue;if(!ST111.o[id]||!ST111.o[id].length){ST111.o[id]=roll111(id)||[];ch=1;continue}
  for(let i=0;i<d;i++){const R=roll111(id);if(!R)continue;const P0=ST111.p[id];if(!P0||score111(R,id)>score111(P0,id))ST111.p[id]=R;ch=1}
  try{say('🎲 ได้ออปใหม่ของ'+ITEMS[id].name+' — แตะไอเท็มในกระเป๋าเพื่อเลือก')}catch(e){}}
 snap111=c;if(ch)sv111()}
setInterval(()=>{try{watch111()}catch(e){}},700);
// ---------- เซ็ต 7 ชิ้น ----------
function setCount7(){const c={};for(const s of SL111){const id=P.armor&&P.armor[s];if(id&&ITEMS[id]){const t=ITEMS[id].tier|0;c[t]=(c[t]|0)+1}}return c}
window.setCount7=setCount7;
const full7fx=t=>{try{if(typeof T0_101!=='undefined'&&t>=T0_101&&t<T0_101+5&&window.B101)return B101[t-T0_101].fx}catch(e){}return {dmg:Math.round((.03+t*.0025)*1000)/1000,hp:Math.round((.03+t*.0025)*1000)/1000}};
window.full7fx111=full7fx;
{const _cb=calcBonus;calcBonus=function(){const b=_cb.apply(this,arguments);try{const add=(o,m)=>{for(const k in o||{})b[k]=(b[k]||0)+m*o[k]};
  const c4=setCount();for(const t in c4){if(!SETB[t])continue;if(c4[t]>=2)add(SETB[t][0].st,-1);if(c4[t]>=4)add(SETB[t][1].st,-1)}
  const c7=setCount7();for(const t in c7){if(!SETB[t])continue;if(c7[t]>=3)add(SETB[t][0].st,1);if(c7[t]>=5)add(SETB[t][1].st,1)}}catch(e){}return b};window.calcBonus=calcBonus}
// ---------- ส่งค่าเข้าตัวรวม PTX ----------
function want111(o){const W={st:{}};const ad=(k,v)=>{if(OP111[k]&&OP111[k][3]==='st')W.st[k]=(W.st[k]||0)+v;else W[k]=(W[k]||0)+v};
 for(const s of SL111){const id=P.armor&&P.armor[s];if(!id)continue;for(const [k,v] of ST111.o[id]||[])ad(k,v)}
 const c7=setCount7();for(const t in c7)if(c7[t]>=7){const f=full7fx(+t);for(const k in f)ad(k,f[k])}
 const A=o.__a101||{};for(const k in A)ad(k,-A[k]);// ยกเลิกโบนัส 4 ชิ้นแบบเดิมของ fix101 (ตอนนี้ต้องครบ 7)
 return W}
{const _p=PTX;PTX=function(){const o=_p.apply(this,arguments);try{if(!o)return o;const key=SL111.map(s=>P.armor&&P.armor[s]||'').join('|')+'#'+(ST111.v|0)+'#'+(o.__k101||'');
  if(o.__k111!==key){const old=o.__a111||{st:{}};for(const k in old){if(k==='st')continue;o[k]=(o[k]||0)-old[k]}o.st=o.st||{};for(const k in old.st||{})o.st[k]=(o.st[k]||0)-old.st[k];
   const W=want111(o);for(const k in W){if(k==='st')continue;o[k]=(o[k]||0)+W[k]}for(const k in W.st)o.st[k]=(o.st[k]||0)+W.st[k];o.__a111=W;o.__k111=key}}catch(e){}return o};window.PTX=PTX}
// ป้ายโบนัสชุดบนจอ (เดิมนับ 4 ชิ้น 2/4) → 7 ชิ้น 3/5/7
{const _rb=renderBuffs;renderBuffs=function(){try{let h='';const c=setCount7();for(const t in c)if(c[t]>=3){const lv=c[t]>=7?'7':c[t]>=5?'5':'3';h+='<span class="bx set" title="'+(c[t]>=5&&SETB[t]?stTxt(SETB[t][1].st):SETB[t]?stTxt(SETB[t][0].st):'')+'">🛡️ ชุด'+(SETN12[t]||TNAMES[t])+' '+c[t]+'/7</span>'}
  for(const b of BUFFS)h+='<span class="bx" title="'+stTxt(b.st)+'">'+b.ic+' '+Math.ceil(b.t)+'s</span>';if(buffBox.innerHTML!==h)buffBox.innerHTML=h}catch(e){return _rb.apply(this,arguments)}};window.renderBuffs=renderBuffs}
const setTxt111=t=>{const c=setCount7()[t]|0,S=SETB[t];const f=full7fx(+t);let fx='';try{const d=desc26(f);fx=Array.isArray(d)?d.join(' · '):String(d)}catch(e){}
 return '<div class="st111"><b>🛡️ เซ็ต'+(SETN12[t]||TNAMES[t])+' '+c+'/7</b>'+[[3,S?stTxt(S[0].st):''],[5,S?stTxt(S[1].st):''],[7,fx]].map(([n,x])=>'<small class="'+(c>=n?'on':'')+'">'+(c>=n?'✅':'⬜')+' '+n+' ชิ้น: '+x+'</small>').join('')+'</div>'};
window.setTxt111=setTxt111;
{const _rc=renderChar;renderChar=function(){_rc.apply(this,arguments);try{const el=gid('chl');if(!el)return;const sb=el.querySelector('.setb');if(!sb)return;const c=setCount7();const ts=Object.keys(c).filter(t=>c[t]>=1).sort((a,b)=>c[b]-c[a]).slice(0,2);
  sb.innerHTML='<b>🛡️ โบนัสชุด (7 ชิ้น)</b><small>อาวุธ หมวก เสื้อ กางเกง แขน สร้อย แหวน ระดับเดียวกัน · ครบ 3 / 5 / 7 ชิ้น ได้โบนัสเพิ่มขึ้น</small>'+ts.map(setTxt111).join('')}catch(e){}};window.renderChar=renderChar}
// ---------- หน้ารายละเอียดไอเท็ม: ออป + เลือกออปใหม่ + หินสุ่มออป ----------
const css=document.createElement('style');css.textContent='.op111{margin:6px 0;padding:6px 8px;border-radius:9px;background:#120e1e;border:1px solid #e8c14a44;font-size:12px}.op111 b{color:#ffd86a}.op111 .ln{color:#9fe8ff;display:block}.op111 .nw{color:#c8ff8a;display:block}.op111 .rw{display:flex;gap:6px;margin-top:5px;flex-wrap:wrap}.op111 button{flex:1;min-width:90px;height:auto;min-height:40px;font-size:13px;line-height:1.4;padding:8px;border-radius:8px;border:0;font-weight:800;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}.op111 button.g{background:#3a3450;color:#ddd}.st111{margin:4px 0;padding:5px 8px;border-radius:8px;background:#1a1426}.st111 small{display:block;color:#888}.st111 small.on{color:#7ed957}';document.head.appendChild(css);
function opHTML111(id){if(!slotOf111(id))return '';const L=ST111.o[id]||[],N=ST111.p[id],t=tierOf111(id);let h='<div class="op111"><b>🎲 ออป</b>'+(L.length?L.map(x=>'<span class="ln">• '+line111(x)+'</span>').join(''):'<span class="ln">— (ได้ออปเมื่อมีไอเท็มนี้)</span>');
 if(N)h+='<b style="color:#c8ff8a">✨ ออปใหม่รอเลือก</b>'+N.map(x=>'<span class="nw">• '+line111(x)+'</span>').join('')+'<div class="rw"><button onclick="opTake111(\''+id+'\')">✅ ใช้ออปใหม่</button><button class="g" onclick="opDrop111(\''+id+'\')">ทิ้งออปใหม่</button></div>';
 const have=(GEAR[id]|0)>0||SL111.some(s=>P.armor[s]===id);if(have&&!N)h+='<div class="rw"><button onclick="opRoll111(\''+id+'\')">🎲 สุ่มออปใหม่ (หินสุ่มออป ×1 · มี '+(inv.opt111|0)+')</button></div>';
 const st=setTxt111(t);return h+'</div>'+st}
window.opTake111=id=>{if(!ST111.p[id])return;ST111.o[id]=ST111.p[id];delete ST111.p[id];sv111();sfx('chest');say('🎲 ใช้ออปใหม่แล้ว');icShow('gear',id)};
window.opDrop111=id=>{delete ST111.p[id];sv111();sfx('ui');icShow('gear',id)};
window.opRoll111=id=>{if(!(inv.opt111>0)){say('ไม่มีหินสุ่มออป — ดรอปจากมอน/บอส');sfx('thud');return}inv.opt111--;try{refreshInv()}catch(e){}ST111.p[id]=roll111(id);sv111();sfx('magic');icShow('gear',id)};
{const _ic=icShow;icShow=function(t,k){const r=_ic.apply(this,arguments);try{if(t==='gear'&&slotOf111(k)&&!icEl.hidden&&!icEl.querySelector('.op111')){const host=icEl.querySelector('.ib')||icEl;host.insertAdjacentHTML(host===icEl?'beforeend':'afterend',opHTML111(k))}}catch(e){}return r};window.icShow=icShow}
// ---------- หินสุ่มออป ----------
INVMETA.opt111=['หินสุ่มออป','สุ่มออป (ค่าพิเศษ) ของอุปกรณ์ใหม่ 1 ครั้ง · แตะอุปกรณ์ในกระเป๋า → 🎲 สุ่มออปใหม่'];
try{const _mi=matIcon;matIcon=function(key){if(key!=='opt111')return _mi.apply(this,arguments);const c=document.createElement('canvas');c.width=c.height=48;const k=c.getContext('2d');
 const g=k.createLinearGradient(8,6,40,42);g.addColorStop(0,'#fff2c8');g.addColorStop(.45,'#c88aff');g.addColorStop(1,'#4a2a8a');k.fillStyle=g;k.strokeStyle='#1a0a2a';k.lineWidth=2;k.beginPath();k.moveTo(24,4);k.lineTo(42,16);k.lineTo(38,38);k.lineTo(24,45);k.lineTo(10,38);k.lineTo(6,16);k.closePath();k.fill();k.stroke();
 k.strokeStyle='rgba(255,255,255,.55)';k.lineWidth=1.2;k.beginPath();k.moveTo(24,4);k.lineTo(24,45);k.moveTo(6,16);k.lineTo(42,16);k.stroke();k.fillStyle='#fff';for(const [x,y] of [[17,24],[31,24],[24,32]]){k.beginPath();k.arc(x,y,2.6,0,7);k.fill()}return c};window.matIcon=matIcon}catch(e){}
{const _s=src7;src7=function(key){let S=[];try{S=_s(key)||[]}catch(e){}if(String(key).replace(/^mat:/,'')==='opt111')S=[['⚔️','ดรอปจากมอนทุกแมพ 1.2% · บอส 30%'],['📅','หีบโบนัสเควสรายวัน']];return S};window.src7=src7}
{const _mk=mobKill;mobKill=function(m){const was=!!(m&&m.dead);const r=_mk.apply(this,arguments);try{if(m&&!was&&m.dead&&!m.o111&&(typeof W33==='undefined'||W33.mode==='solo'||m.my33>0)){m.o111=1;if(Math.random()<(m.boss?.3:.012))addDrop('opt111',m.x,m.y)}}catch(e){}return r};window.mobKill=mobKill}
// ---------- 📊 หน้าคุณสมบัติรวม ----------
const W2=mk6('cs111');
const css2=document.createElement('style');css2.textContent='#cs111 .w{width:min(620px,97%);height:auto;max-height:95%}#cs111 .bd{display:block!important;overflow:auto;padding:10px 12px}#cs111 .g111{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin-bottom:8px}#cs111 .c111{background:#1a1426;border:1px solid #e8c14a33;border-radius:10px;padding:7px 9px}#cs111 .c111 small{display:block;color:#aaa;font-size:11px}#cs111 .c111 b{font-size:16px;color:#ffd86a}#cs111 h4{margin:10px 0 5px;color:#ffd86a;font-size:13px}#cs111 .src111{font-size:12px;color:#ccc;line-height:1.6}';document.head.appendChild(css2);
window.EXTRA111=window.EXTRA111||[];// แหล่งเพิ่มเติม (สัตว์เลี้ยง/สัตว์ขี่ ฯลฯ) ใส่ฟังก์ชันคืน {n, txt}
window.open111=()=>{try{ptDirty();applyBonus();recalcStats()}catch(e){}const x=PTX();const cell=(n,v,s)=>'<div class="c111"><small>'+n+'</small><b>'+v+'</b>'+(s?'<small>'+s+'</small>':'')+'</div>';
 let atk=0,def=0;try{atk=clsAtk()}catch(e){try{atk=ATK()}catch(e2){}}try{def=armorDef()}catch(e){}
 let h='<div class="w"><div class="hd"><b>📊 คุณสมบัติตัวละคร</b><button onclick="p6close(gid(\'cs111\'))">✕</button></div><div class="bd"><small style="color:#aaa">รวมค่าจากทุกระบบในเกม — ใช้เทียบบิลด์ (ต้นไม้พาสซีฟ · ออปอุปกรณ์ · โบนัสชุด · ตีบวก · ดาวสัตว์เลี้ยง/สัตว์ขี่ · บัฟ)</small><h4>⚔️ พลังหลัก</h4><div class="g111">'
  +cell('พลังโจมตี',atk)+cell('ป้องกัน',def)+cell('เลือดสูงสุด',BAL.hp)+cell('มานาสูงสุด',BAL.mp)+cell('เลเวล','Lv.'+P.lv)+'</div><h4>💪 ค่าพลัง</h4><div class="g111">'
  +['str','vit','agi','int','end'].map(k=>cell(STN_TH[k],P.stats[k],k==='str'?'พลังโจมตีกายภาพ':k==='vit'?'เลือด':k==='agi'?'ธนู/คริ':k==='int'?'เวท/มานา':'แรง/วิ่ง')).join('')+'</div><h4>✨ โบนัส %</h4><div class="g111">';
 const fx=['dmg','skill','crit','aspd','cdr','dr','hp','spd','mpc','mpr','hpr','area','mdmg'];h+=fx.filter(k=>x[k]).map(k=>{const L=FXL26[k];return cell(L[0].replace(/[ +\-]+$/,''),(L[0].trim().endsWith('-')?'-':'+')+(L[1]===2?(x[k]*100).toFixed(1)+'%/วิ':(x[k]*100).toFixed(1)+'%'))}).join('')||'<small>ยังไม่มี</small>';
 h+='</div><h4>📦 มาจากไหน</h4><div class="src111">';
 const ol=[];for(const s of SL111){const id=P.armor[s];if(!id||!ITEMS[id])continue;const L=ST111.o[id]||[];ol.push('• '+ITEMS[id].name+(ENH[id]?' +'+ENH[id]:'')+(L.length?' — '+L.map(line111).join(', '):''))}
 h+='<b>🎲 ออปอุปกรณ์ที่ใส่</b><br>'+(ol.join('<br>')||'— ยังไม่ได้ใส่อุปกรณ์');
 const c7=setCount7();const ts=Object.keys(c7).filter(t=>c7[t]>=1).sort((a,b)=>c7[b]-c7[a]).slice(0,2);h+='<br><b>🛡️ โบนัสชุด</b>'+ts.map(setTxt111).join('');
 for(const f of window.EXTRA111){try{const r=f();if(r)h+='<br><b>'+r.n+'</b><br>'+r.txt}catch(e){}}
 h+='</div></div></div>';W2.innerHTML=h;p6open(W2)};
try{if(!PM7.some(m=>m[1]==='คุณสมบัติ')){const at=PM7.findIndex(m=>m[1]==='สกิล');PM7.splice(at<0?1:at,0,['📊','คุณสมบัติ',()=>open111()]);pmRender7()}}catch(e){}
{const _q=window.qb108;if(_q)window.qb108=function(){const b=window.DY108&&DY108.bonus;_q.apply(this,arguments);try{if(!b&&DY108.bonus){inv.opt111=(inv.opt111|0)+1;refreshInv();say('🎲 ได้หินสุ่มออป ×1 จากหีบรายวัน')}}catch(e){}}}
window.roll111=roll111;window.ST111=ST111;
}catch(e){console.warn('fix111',e)}
