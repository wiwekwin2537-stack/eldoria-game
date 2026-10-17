// =====================================================================
// fix129 (v5.03)
//  A) 💨 ค่าหลบหลีก (MISS): เลเวลสูงกว่ามอนมาก = หลบได้บ่อย + ไม่กระเด็น (เดิม Lv.150 โดนสไลม์ Lv.1 ตีเข้าทุกที + กระเด็น)
//     โอกาสหลบ = ส่วนต่างเลเวล ×1.5% (สูงสุด 75%) + AGI ×0.04% (สูงสุด 10%) · บอส/อีลิทได้ครึ่งเดียว (สูงสุด 35%) · PvP ไม่มีหลบ
//     มอนต่ำกว่า 20 เลเวลขึ้นไป ตีเข้าก็ไม่กระเด็น/ไม่ชะงัก · ต่ำกว่า 10 เลเวล กระเด็นครึ่งเดียว
//  B) 🐉 ประตูมิติบอสโลก: กดตีมอนตอนยืนใกล้ประตู → เดิมกลายเป็น "กดเข้าประตู" วาปเข้าลานบอส/เปิดเมนูเอง → ตอนนี้ถ้ามีมอนใกล้ ปุ่มตี = ตี
//  C) 👑 ราชาประกาศกลางจอเมื่อบอสโลกจุติ + เตือนล่วงหน้า 5 นาที · แถบบนจอเปลี่ยนคำจาก "แตะเพื่อไป" เป็นบอกทาง
// =====================================================================
try{
// ---------- A) หลบหลีก ----------
const mobLv129=src=>{const v=src&&(src.L!=null?src.L:src.lv!=null?src.lv:src.lvl);return v!=null&&isFinite(v)?+v:null};
function dodge129(src){try{if(!src||src.pvp7||(typeof W33!=='undefined'&&W33.swap))return 0;const L=mobLv129(src);const gap=L==null?0:Math.max(0,(P.lv|0)-L);
 const big=!!(src.boss||src.elite||src.wb10||src.lb62);let g=Math.min(.75,gap*.015);if(big)g*=.5;const a=Math.min(.10,((P.stats&&P.stats.agi)|0)*.0004);
 return Math.min(big?.35:.85,g+a)}catch(e){return 0}}
window.dodge129=dodge129;
const kbGap129=src=>{const L=mobLv129(src);if(L==null||src.pvp7||src.boss)return 1;const gap=(P.lv|0)-L;return gap>=20?0:gap>=10?.5:1};
function miss129(){P.iframe=Math.max(P.iframe,BAL.iframe||.8);try{dmgTxt(P.x,P.y-46,'MISS','#9fd8ff')}catch(e){}try{for(let i=0;i<5;i++)rfxP(P.x+(Math.random()-.5)*18,P.y-20-Math.random()*16,(Math.random()-.5)*60,-30-Math.random()*30,.4,'190,230,255',1.6,'dot')}catch(e){}}
{const _z=zHurt;zHurt=function(src,dmg,kbm,msg){try{if(P.iframe>0||P.hp<=0||P.dead)return _z.apply(this,arguments);
  if(Math.random()<dodge129(src)){miss129();return}const k=kbGap129(src);if(k<1){const st=P.stun;const r=_z.call(this,src,dmg,(kbm||1)*k,msg);if(k===0){P.kx=P.ky=0;P.stun=Math.min(P.stun,Math.max(0,st))}return r}}catch(e){}return _z.apply(this,arguments)};window.zHurt=zHurt}
{const _hp=hurtPlayer;hurtPlayer=function(sl){try{if(!(P.iframe>0)&&P.hp>0&&!P.dead){if(Math.random()<dodge129(sl)){sl.cool=BAL.slimeCd;miss129();return}const k=kbGap129(sl);if(k<1){const st=P.stun;const r=_hp.apply(this,arguments);P.kx*=k;P.ky*=k;if(k===0){P.stun=Math.min(P.stun,Math.max(0,st));P.combo=0}return r}}}catch(e){}return _hp.apply(this,arguments)};window.hurtPlayer=hurtPlayer}
/* แสดงในหน้าสถานะ (การ์ดเอาตัวรอด) */
{const _s=window.stats128;if(_s)window.stats128=function(){let h=_s.apply(this,arguments);try{const a=Math.min(.10,((P.stats&&P.stats.agi)|0)*.0004);
  h=h.replace('<b>🛡️ เอาตัวรอด</b><div class="gr">','<b>🛡️ เอาตัวรอด</b><div class="gr"><div class="r"><span>💨 หลบหลีก (AGI)</span><b>'+(a*100).toFixed(1)+'%</b></div><div class="r"><span>หลบมอนเลเวลต่ำกว่า</span><b>+1.5%/เลเวล</b></div>')}catch(e){}return h}}

// ---------- B) ปุ่มตีไม่ไปกดเข้าประตูบอสโลก ----------
let ATK129=false;
{const _a=attack;attack=function(){ATK129=true;try{return _a.apply(this,arguments)}finally{ATK129=false}};window.attack=attack}
{const _it=interact;interact=function(){try{if(ATK129&&!D&&typeof WBG64!=='undefined'&&Math.hypot(P.x-WBG64.x,P.y-WBG64.y)<60&&enemies().some(e=>!e.dead&&!e.pvp7&&Math.hypot(e.x-P.x,e.y-P.y)<120))return false}catch(e){}return _it.apply(this,arguments)};window.interact=interact}

// ---------- C) ราชาประกาศ ----------
const css=document.createElement('style');css.textContent=
 '#kann129{position:absolute;left:50%;top:18%;transform:translateX(-50%);z-index:30;width:min(92vw,520px);text-align:center;pointer-events:auto;cursor:pointer;'
+'background:linear-gradient(180deg,rgba(60,14,6,.94),rgba(24,6,4,.94));border:2px solid #ffb04a;border-radius:14px;padding:12px 16px 12px;box-shadow:0 0 36px rgba(255,120,40,.55),inset 0 0 22px rgba(255,140,60,.25);'
+'font-family:system-ui,"Noto Sans Thai",sans-serif;color:#fff;animation:kin129 .55s cubic-bezier(.2,1.4,.4,1)}'
+'#kann129 .kc{font-size:30px;line-height:1;filter:drop-shadow(0 0 6px #ffd84a)}#kann129 .kn{font:800 12px system-ui,"Noto Sans Thai";color:#ffd86a;letter-spacing:.5px;margin-top:2px}'
+'#kann129 .kt{font:900 19px system-ui,"Noto Sans Thai";color:#ffe9a0;text-shadow:0 0 10px #ff6a1a,0 2px 0 #3a0a00;margin:6px 0 4px}#kann129 .ks{font:600 12.5px/1.5 system-ui,"Noto Sans Thai";color:#ffd8c0}'
+'#kann129 .kx{font-size:10px;opacity:.6;margin-top:6px}#kann129.out{animation:kout129 .5s forwards}'
+'@keyframes kin129{from{opacity:0;transform:translateX(-50%) scale(.6)}to{opacity:1;transform:translateX(-50%) scale(1)}}@keyframes kout129{to{opacity:0;transform:translateX(-50%) translateY(-20px)}}';
document.head.appendChild(css);
function kingAnn129(title,sub,big){try{let el=gid('kann129');if(el)el.remove();el=document.createElement('div');el.id='kann129';
 el.innerHTML='<div class="kc">👑</div><div class="kn">ราชาแห่งเอลโดเรีย ประกาศ</div><div class="kt">'+title+'</div><div class="ks">'+sub+'</div><div class="kx">แตะเพื่อปิด</div>';
 const close=()=>{if(!el.isConnected)return;el.classList.add('out');setTimeout(()=>el.remove(),500)};el.onclick=close;gid('wrap').appendChild(el);setTimeout(close,big?8000:5500);
 try{tone(392,392,.25,'triangle',.05);tone(523,523,.25,'triangle',.05,.22);tone(659,659,.3,'triangle',.05,.44);tone(784,784,.7,'triangle',.06,.7);if(big){shake(3,.6);boom(.6)}}catch(e){}}catch(e){console.warn('kann129',e)}}
window.kingAnn129=kingAnn129;
const WBA129={end:0,warn:0};
const ingame129=()=>{try{return titleEl.hidden&&!(typeof inWb10==='function'&&inWb10())}catch(e){return false}};
{const _wm=wbMsg10;wbMsg10=function(d){const was=WB10.on;const r=_wm.apply(this,arguments);try{if(d&&d.on&&WBA129.end!==d.end){if(typeof inWb10==='function'&&inWb10())WBA129.end=d.end;
  const left=Math.max(0,Math.ceil(((d.end||0)-srvNow())/60000));if(ingame129()&&left>0){WBA129.end=d.end;kingAnn129('🐉 มหาอสูรอัคคีได้จุติลงมาแล้ว!','ผู้กล้าทั้งหลาย จงไปที่ <b>ประตูมิติบอสโลก</b> ในทุ่งหญ้า (เหนือประตูมิติเหมือง)<br>ร่วมกันปราบภายใน '+left+' นาที — ดาเมจยิ่งมาก รางวัลยิ่งดี',true);try{sysSay('👑 ราชาประกาศ: บอสโลกจุติแล้ว! ไปที่ประตูมิติบอสโลกในทุ่งหญ้า')}catch(e){}}}}catch(e){}return r};window.wbMsg10=wbMsg10}
setInterval(()=>{try{if(!WB10||WB10.on||!WB10.next||!ingame129())return;const ms=WB10.next-srvNow();if(ms>0&&ms<=5*60e3&&WBA129.warn!==WB10.next){WBA129.warn=WB10.next;
  kingAnn129('⏳ อีก '+Math.ceil(ms/60000)+' นาที บอสโลกจะจุติ!','เตรียมยาเลือดให้พร้อม แล้วไปรอที่ประตูมิติบอสโลกในทุ่งหญ้า',false);try{sysSay('👑 อีก '+Math.ceil(ms/60000)+' นาที บอสโลกจะจุติ — ไปรอที่ประตูมิติในทุ่งหญ้า')}catch(e){}}}catch(e){}},5000);
/* แถบบอสโลกด้านบน: ไม่มีวาปแล้ว → บอกทางแทนคำว่า "แตะเพื่อไป" */
setInterval(()=>{try{if(wbHud10.style.display==='none')return;const h=wbHud10.innerHTML;if(h.indexOf('(แตะเพื่อไป)')>=0)wbHud10.innerHTML=h.replace('(แตะเพื่อไป)','→ ประตูมิติในทุ่งหญ้า')}catch(e){}},300);
}catch(e){console.warn('fix129',e)}
