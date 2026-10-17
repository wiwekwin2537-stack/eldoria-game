// fix89 (v4.79) — HANDOFF ข้อ 35 (เจ้าของสั่ง): ต้นไม้ทุกที่ต้องเป็นระบบเดียวกัน — มีขีดเลือดตอนฟัน + อนิเมชันล้มตอนฟันเสร็จ
//  เดิม: ต้นไม้ทุ่งหญ้า (hitTree) มีขีดเลือด+ล้มแล้ว · ต้นไม้ในแมพ (ป่าละเมาะ/ลำธาร/ป่าสน/ป่าหมอก/ภูเขาไฟ/ถ้ำ/ทุ่งเมฆ/บัลลังก์ — chop15) ไม่มีทั้งสองอย่าง หายไปเฉย ๆ
//  แก้: ห่อ chop15 → ขีดเลือดแบบเดียวกับทุ่งหญ้า (drawBars) 2.2 วิหลังฟัน · ต้นล้มเอียงตามทิศที่ฟัน 1.1 วิ มีใบไม้ฟุ้ง+เสียงตอนกระแทกพื้น แล้วจางหายใน 1.2 วิ
try{
const FALL89=[];window.FALL89=FALL89;
{const _c=chop15;chop15=function(o){const was=o&&o.alive!==false;const r=_c.apply(this,arguments);try{if(!o)return r;o.bar89=performance.now()+2200;
  if(was&&o.alive===false){FALL89.push({kind:o.kind,x:o.tx*T+16,y:o.ty*T+28,dir:P.x<o.tx*T+16?1:-1,t0:performance.now(),landed:false,sc:D&&D.zone?D.zone:null});sfx('creak')}}catch(e){}return r};window.chop15=chop15}
function bar89(x,y,r){ctx.fillStyle='#000b';ctx.fillRect(x-13,y+3,26,4);ctx.fillStyle=r>.5?'#7ed957':r>.25?'#ffc247':'#e84b4b';ctx.fillRect(x-12,y+4,24*Math.max(0,r),2)}
{const _do=drawOreZ;drawOreZ=function(o){const r=_do.apply(this,arguments);try{if(o&&o.alive!==false&&OREK[o.kind]&&OREK[o.kind].tree&&o.bar89>performance.now()&&o.max)bar89(o.tx*T+16,o.ty*T+T,o.hp/o.max)}catch(e){}return r};window.drawOreZ=drawOreZ}
function drawFall89(){if(!FALL89.length)return;const now=performance.now();
 for(let i=FALL89.length-1;i>=0;i--){const f=FALL89[i];if(!D||D.zone!==f.sc){FALL89.splice(i,1);continue}const ft=(now-f.t0)/1000;if(ft>2.3){FALL89.splice(i,1);continue}
  const u=ft/1.1;let ang=Math.pow(Math.min(1,u),2.4)*1.5;if(u>1)ang+=Math.sin((u-1)*14)*.05*Math.exp(-(u-1)*5);
  if(!f.landed&&ft>=1.1){f.landed=true;const ex=f.x+f.dir*55,ey=f.y;const c=(typeof TREEPAL15!=='undefined'&&TREEPAL15[f.kind])?TREEPAL15[f.kind]:null;
   for(let k=0;k<14;k++)fx.push({x:ex+(Math.random()-.5)*50,y:ey-8,vx:(Math.random()-.5)*120,vy:-30-Math.random()*60,l:.8,c:(OREK[f.kind]&&OREK[f.kind].fx)||'70,150,60'});sfx('thud');try{shake(2,.12)}catch(e){}}
  ctx.save();ctx.globalAlpha=ft>1.7?Math.max(0,1-(ft-1.7)/.6):1;ctx.translate(f.x,f.y);ctx.rotate(f.dir*ang);ctx.drawImage(cutSpr16(f.kind),-34,-80,68,85);ctx.restore()}}
// วาดในพิกัดโลก (ใช้จุดเดียวกับที่ fix16 วาดต้นไม้บังตัวละคร)
{const _dd=drawDmgTxt;drawDmgTxt=function(dt){try{if(D&&D.zone)drawFall89()}catch(e){}return _dd.apply(this,arguments)};window.drawDmgTxt=drawDmgTxt}
}catch(e){console.warn('fix89',e)}
