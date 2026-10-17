// fix44 (v4.49) — สมุนอัญเชิญ (เนโคร/ผู้อัญเชิญ/สมุนทุกชนิดใน MIN) มีเลือด ตายได้ · ดาเมจลดตามจำนวนสมุน · ตีบอสเบาลง
// เดิม: สมุนไม่มีเลือด (อมตะ) และดาเมจไม่ลดตามจำนวน → ผู้อัญเชิญยืนเฉย ๆ ทำดาเมจ ~2.5 เท่าของนักเวทที่ยิงเต็มที่
try{
const HPF44={skel:.30,spirit:.25,golem:.90,hawk:.22,wolf:.35,bear:.85,lion:1.0};
const B44={inMin:false};window.B44=B44;
const minF44=()=>{const n=MIN.length;return n<=1?1:Math.min(1,Math.pow(1.8/n,.8))};
// ดาเมจของสมุน: ×f(จำนวน) · บอส ×0.6
{const _he=hurtE;hurtE=function(e,mult,o){if(B44.inMin){try{mult*=minF44()*(e&&(e.boss||e.wb10)?.6:1)}catch(_){}}return _he.call(this,e,mult,o)}}
// เลือดสมุน + โดนมอนตี/กระสุนมอน → ตายได้
{const _mt=minTick;minTick=function(dt){B44.inMin=true;try{_mt(dt)}finally{B44.inMin=false}
 try{if(!MIN.length||P.dead)return;const ens=enemies();
  // มอนแต่ละตัวตีสมุนได้ทีละตัว (ตัวที่ใกล้สุดที่ประชิดอยู่) · สมุนมีเกราะ (รับ 40%) · บอสแรง ×1.6
  const take=new Map();for(const o of MIN){if(o.mhp==null)o.mhp=o.hp=Math.max(30,Math.round(BAL.hp*(HPF44[o.k]||.3)))}
  for(const e of ens){if(e.dead||e.hp<=0)continue;const r=26+eR(e)*.8;let best=null,bd=r;for(const o of MIN){if(o.born>0||(o.S&&o.S.fly&&!o.dive))continue;const d=Math.hypot(e.x-o.x,e.y-o.y);if(d<bd){bd=d;best=o}}
   if(best){const a=e.atk||((e.lv||e.L||10)*4);take.set(best,(take.get(best)||0)+a*.35*.4*dt*(e.boss?1.6:e.elite?1.25:1))}}
  for(let i=MIN.length-1;i>=0;i--){const o=MIN[i];if(o.born>0)continue;let dmg=take.get(o)||0;
   if(typeof ZPROJ!=='undefined')for(let j=ZPROJ.length-1;j>=0;j--){const p=ZPROJ[j];if(Math.hypot(p.x-o.x,p.y-(o.y-14))<(p.r||6)+11){dmg+=(p.dmg||0)*.4;ZPROJ.splice(j,1)}}
   if(dmg>0){o.hp-=dmg;o.hurt=.15;if((o.dmgAcc=(o.dmgAcc||0)+dmg)>=Math.max(4,o.mhp*.06)){try{dmgTxt(o.x,o.y-34,'-'+Math.round(o.dmgAcc),'#ff8a8a')}catch(_){}o.dmgAcc=0}}
   if(o.hp<=0){for(let j=0;j<14;j++)rfxP(o.x,o.y-14,(Math.random()-.5)*90,-40-Math.random()*50,.6,'200,200,210',2.2,'dot');MIN.splice(i,1);try{sfx('crumble')}catch(_){}}}}catch(e){}}}
// แถบเลือดเหนือสมุน
{const _md=minDraw;minDraw=function(o,t){_md(o,t);try{if(o.mhp&&o.hp<o.mhp){const w=26,x=o.x-w/2,y=o.y-(o.S&&o.S.fly?58:44)*(o.sc||1);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x-1,y-1,w+2,5);const f=Math.max(0,o.hp/o.mhp);ctx.fillStyle=f>.5?'#6ae07a':f>.25?'#ffd23a':'#ff5a4a';ctx.fillRect(x,y,w*f,3)}}catch(e){}}}
// คำอธิบายในหน้าต่างสกิล/อาชีพ
try{CLS.necro.pas=(CLS.necro.pas||'')+' · โครงกระดูกมีเลือด ตายได้';CLS.summoner.pas=(CLS.summoner.pas||'').replace('สัตว์อัญเชิญแรงขึ้น 30%','สัตว์อัญเชิญแรงขึ้น 30% · สัตว์มีเลือด ตายได้ · ยิ่งเรียกมาก ดาเมจต่อตัวยิ่งลด')}catch(e){}
}catch(e){console.warn('fix44',e)}
