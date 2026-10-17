// fix52 (v4.55) — ออนไลน์: (1) เอฟเฟกต์สกิลช่อง 4–6 / สกิลใหม่ (E46, E25) ส่งให้ผู้เล่นอื่นเห็น (ภาพอย่างเดียว ไม่ทำดาเมจซ้ำ)
//   (2) สกิลช่วยเพื่อนมีผลกับเพื่อนในปาร์ตี้ที่อยู่ใกล้: ออร่าศักดิ์สิทธิ์ (ลดดาเมจ 15% + ฟื้นเลือด) · แสงรักษา/ชำระล้าง (ฮีล+ล้างสถานะ) · อวยพรเทวา/ระฆังสวรรค์/ปีกเทวทูต (ฟื้นเลือดต่อเนื่อง)
//   ใช้ข้อความ sx k:'fx' เดิม (เซิร์ฟเวอร์ส่งต่อทั้งก้อนให้คนในฉากระยะ 1400px อยู่แล้ว) → ไม่ต้องแก้เซิร์ฟเวอร์
try{
const Q52={n:[]};const RX52={on:false};
const okSend52=()=>typeof NET!=='undefined'&&NET.on&&NET.others&&NET.others.size>0&&!RX52.on&&!(window.FX34&&FX34.rx);
const SKIP52=new Set(['charge','vortex']);
const pack52=(o,src)=>{if(!o||typeof o.x!=='number'||typeof o.y!=='number'||SKIP52.has(o.k))return null;const r={};let n=0;
 for(const k in o){const v=o[k];if(n>=16)break;if(typeof v==='number'&&isFinite(v)){r[k]=Math.round(v*100)/100;n++}else if(typeof v==='string'&&v.length<40){r[k]=v;n++}else if(typeof v==='boolean'){r[k]=v;n++}}
 r.t=0;return [src,r]};
const hook52=(arr,src)=>{const _p=arr.push;arr.push=function(...a){if(okSend52())for(const o of a){if(o&&!o.rx52&&Q52.n.length<24&&Math.abs(o.x-P.x)<900&&Math.abs(o.y-P.y)<700){const p=pack52(o,src);if(p)Q52.n.push(p)}}return _p.apply(this,a)}};
if(window.E46)hook52(window.E46,46);if(window.E25)hook52(window.E25,25);const E46=window.E46||[],E25=window.E25||[];
// ---- สกิลช่วยเพื่อน: [อาชีพ,ช่อง] → ผล ----
const SUP52={'paladin:4':{r:170,dr:.15,reg:.015,dur:10,lab:'✨ ออร่าศักดิ์สิทธิ์'},'cleric:0':{r:160,heal:.2,cl:1,lab:'💚 แสงรักษา'},'cleric:2':{r:170,reg:.04,dur:8,lab:'👼 อวยพรเทวา'},
 'cleric:3':{r:160,heal:.15,cl:1,lab:'🕊️ ชำระล้าง'},'cleric:4':{r:170,reg:.03,dur:6,lab:'🔔 ระฆังสวรรค์'},'cleric:5':{r:180,reg:.03,dur:6,lab:'🪽 ปีกเทวทูต'}};
const out52=[];
// สกิลช่อง 4–6 ต้องถืออาวุธอาชีพเหมือนช่อง 1–3 (เดิมช่อง 4–6 ร่ายได้แม้ไม่ถืออาวุธ — ไม่เป็นระบบเดียวกัน)
{const _us=useSkill;useSkill=function(i){try{if(i>=3&&P.cls!=='none'&&!P.dead&&typeof wKind==='function'&&NEEDW[P.cls]&&wKind()!==NEEDW[P.cls]){say('ต้องถือ'+WNAME[NEEDW[P.cls]]+'เพื่อใช้สกิล'+CLS[P.cls].n);sfx('thud');return}}catch(e){}return _us.apply(this,arguments)};window.useSkill=useSkill}
{const _us=useSkill;useSkill=function(i){const cd0=CS.cd.slice(),mp0=P.mp;const r=_us.apply(this,arguments);try{const cast=P.mp<mp0-.01||CS.cd.some((v,k)=>v>(cd0[k]||0)+.05);
  const s=SUP52[P.cls+':'+i];if(cast&&s&&typeof PTY35!=='undefined'&&PTY35.mem&&PTY35.mem.length>1)out52.push({c:P.cls+':'+i,x:Math.round(P.x),y:Math.round(P.y),nm:P.name||''})}catch(e){}return r};window.useSkill=useSkill}
setInterval(()=>{try{if(!(Q52.n.length||out52.length))return;if(!okSend52()){Q52.n.length=0;out52.length=0;return}
 netSend({t:'sx',k:'fx',v:[],p:[],e:[],n:Q52.n.splice(0),sup:out52.splice(0)})}catch(e){}},100);
// ---- รับ ----
const PB52={dr:0,drU:0,reg:0,regU:0,last:null};window.PB52=PB52;
const inParty52=id=>typeof PTY35!=='undefined'&&(PTY35.mem||[]).some(m=>m&&m.id===id);
function applySup52(s,from){const d=SUP52[s.c];if(!d||P.dead)return;if(Math.hypot(P.x-s.x,P.y-s.y)>d.r)return;const now=performance.now();
 if(d.heal){const h=Math.round(BAL.hp*d.heal);P.hp=Math.min(BAL.hp,P.hp+h);try{dmgTxt(P.x,P.y-50,'+'+h,'#7aff9a')}catch(e){}}
 if(d.cl){P.stun=0;P.slowT=0;P.burnT=0}
 if(d.dr){PB52.dr=Math.max(d.dr,PB52.drU>now?PB52.dr:0);PB52.drU=now+d.dur*1000}
 if(d.reg){PB52.reg=Math.max(d.reg,PB52.regU>now?PB52.reg:0);PB52.regU=now+d.dur*1000}
 try{say(d.lab+' จาก '+(s.nm||from))}catch(e){}}
{const _o=onSx33;onSx33=function(d){try{if(d&&d.k==='fx'&&d.sc===netScene()){
  if(Array.isArray(d.n)&&d.n.length){RX52.on=true;try{for(const it of d.n.slice(0,30)){const src=it&&it[0],o=it&&it[1];if(!o||typeof o!=='object')continue;const e=Object.assign({},o,{rx52:1,t:0});
    if(src===46&&typeof E46!=='undefined'){if(e.k==='zone'){e.tick=1e9;e.every=1e9;e.heal=0;e.mult=0}if(e.k==='trap')e.armed=1e9;e.boom=e.boom||0;Array.prototype.push.call(E46,e)}
    else if(src===25&&typeof E25!=='undefined'){e.tick=1e9;e.hitd=1;Array.prototype.push.call(E25,e)}}}catch(e){}finally{RX52.on=false}}
  if(Array.isArray(d.sup)&&inParty52(d.from))for(const s of d.sup.slice(0,6))applySup52(s,d.from)}}catch(e){}return _o(d)};window.onSx33=onSx33}
// ผลบัฟจากเพื่อน: ลดดาเมจ (คืนเลือดส่วนที่ลด) + ฟื้นเลือดต่อเนื่อง
setInterval(()=>{try{const now=performance.now();if(P.dead){PB52.last=null;return}
 if(PB52.last!=null&&P.hp<PB52.last&&PB52.drU>now)P.hp=Math.min(BAL.hp,P.hp+(PB52.last-P.hp)*PB52.dr);
 if(PB52.regU>now)P.hp=Math.min(BAL.hp,P.hp+BAL.hp*PB52.reg*.1);PB52.last=P.hp}catch(e){}},100);
}catch(e){console.warn('fix52',e)}
