// fix56 (v4.57) — (1) สกิลช่อง 4–6 ต้อง "ซื้อ" ที่ร้านสกิล (5,000 / 12,000 / 30,000 🪙) เมื่อถึงเลเวล — เจ้าของสั่ง
//   (2) หอคอยไม่ลอย: ลานหินรองฐาน + เงาใต้บันได · (3) ลังไม้ที่ (31,23) ทับป้ายธนาคาร → เอาออกแล้ววาดป้ายใหม่
try{
// ---------- 1) ซื้อสกิล 4–6 ----------
const bought56=i=>!!(P.cls!=='none'&&CSK[P.cls]&&CSK[P.cls][i]);window.bought56=bought56;
{const _us=useSkill;useSkill=function(i){try{if(i>=3&&P.cls!=='none'&&!P.dead){const S=(CSKILLS[P.cls]||[])[i];if(S&&P.lv>=S.lv&&!bought56(i)){say('📘 '+S.n+' — ต้องเรียนที่ร้านสกิลก่อน ('+S.price.toLocaleString()+' 🪙)');sfx('thud');return}}}catch(e){}return _us.apply(this,arguments)};window.useSkill=useSkill}
try{const D0=Object.getOwnPropertyDescriptor(SHOP_DATA.skill,'buy'),g0=D0&&D0.get;Object.defineProperty(SHOP_DATA.skill,'buy',{configurable:true,get(){let L=[];try{L=g0?g0.call(SHOP_DATA.skill):(D0&&D0.value)||[]}catch(e){}
  if(P.cls!=='none'&&CSKILLS[P.cls]){const C=CSKILLS[P.cls];for(let i=3;i<C.length;i++){const s=C[i];L=L.concat([{id:'csk'+i,name:s.n+(bought56(i)?' (เรียนแล้ว ✓)':P.lv<s.lv?' (ต้อง Lv.'+s.lv+')':''),emoji:s.e,price:bought56(i)?0:s.price,note:'สกิลอาชีพช่อง '+(i+1)+' · '+s.d+' · มานา '+(Array.isArray(s.mp)?s.mp.join('/'):s.mp)+' · คูลดาวน์ '+s.cd+' วิ'}])}}return L}})}catch(e){console.warn('fix56 shop',e)}
// ปุ่มสกิลบนจอ: ยังไม่ซื้อ = ล็อก
{const _u=updSkBar;updSkBar=function(){_u.apply(this,arguments);try{if(P.cls==='none')return;const bar=barOf();SBTN.forEach((b,s)=>{const i=bar[s];if(i>=3&&!bought56(i))b.classList.add('lock')})}catch(e){}};window.updSkBar=updSkBar}
// หน้าต่างสกิล: บอกว่าต้องซื้อ
{const _r=renderSkw;renderSkw=function(){_r.apply(this,arguments);try{if(skwEl.hidden||P.cls==='none')return;const L=CSKILLS[P.cls];[...skwEl.querySelectorAll('.list .card.sk')].slice(0,L.length).forEach((c,i)=>{if(i<3||bought56(i)||c.querySelector('.buy56'))return;
  c.classList.remove('on');c.classList.add('lock');const b=c.querySelector('b');if(b)b.insertAdjacentHTML('afterend',' <span class="buy56" style="font-size:11px;color:#ffd86a;font-weight:800">📘 เรียนที่ร้านสกิล '+L[i].price.toLocaleString()+' 🪙'+(P.lv<L[i].lv?' (Lv.'+L[i].lv+')':'')+'</span>')})}catch(e){}};window.renderSkw=renderSkw}
// ---------- 2–3) เมือง ----------
function town56(){if(!(D&&D.town&&dcv)||D.t56)return;D.t56=1;try{const k=dcv.getContext('2d');
 // ลังไม้ทับป้ายธนาคาร
 {const x=31,y=23,g=grassV[gv(x,y)];if(g)k.drawImage(g,4,4,26,22,x*T+4,y*T+4,26,22);if(dm[y])dm[y][x]=0;try{shopName(k,SHOP_DATA.bank)}catch(e){}}
 // ลานหินรองหอคอย
 const cx=38.5*T,by=8*T,x0=cx-112,x1=cx+112,y0=by-30,y1=by+30;
 k.save();k.fillStyle='rgba(0,0,0,.28)';k.beginPath();k.ellipse(cx,by+4,118,22,0,0,7);k.fill();
 for(let y=y0;y<y1;y+=12){const off=((y-y0)/12)%2?9:0;for(let x=x0-off;x<x1;x+=18){const xa=Math.max(x0,x),xb=Math.min(x1,x+17);if(xb<=xa)continue;const h=hash(x*.13,y*.29);
  k.fillStyle=h>.66?'#9a94a6':h>.33?'#8a8496':'#7a7488';k.fillRect(xa,y,xb-xa,11);k.fillStyle='rgba(255,255,255,.12)';k.fillRect(xa,y,xb-xa,2);if(h>.85){k.fillStyle='rgba(80,120,60,.35)';k.fillRect(xa+2,y+7,6,3)}}}
 k.strokeStyle='#3a3644';k.lineWidth=2;k.strokeRect(x0+.5,y0+.5,x1-x0-1,y1-y0-1);
 k.restore();try{mkMini(dcv,TW,TH,2.6)}catch(e){}}catch(e){console.warn('fix56 town',e)}}
{const _bt=buildTown;buildTown=function(){const r=_bt.apply(this,arguments);town56();return r};window.buildTown=buildTown}
setTimeout(town56,0);setInterval(()=>{try{town56()}catch(e){}},1500);
}catch(e){console.warn('fix56',e)}
