// =====================================================================
// fix145 (v5.03) — ⚔️ อาวุธในมือไม่ตรงกับตอนโจมตี (ผู้เล่นแจ้ง: "ถืออาวุธอันหนึ่ง พอยิงเวทเป็นอีกอัน" — เคยแก้ fix87 แล้วแต่ยังไม่หาย)
//  ต้นเหตุ (ทำซ้ำได้ทั้ง 11 อาชีพ × มี/ไม่มีอาวุธแฟชั่น):
//   1) ท่ายิงเวทของคทา (staffAt7 จาก v46h) วาด "คทาธรรมดาตามระดับ" เสมอ — ไม่ใช้หน้าตาอาวุธอาชีพ (fix25/fix87) ไม่ย้อมสี (fix27) ไม่ใช้อาวุธแฟชั่น (fix58/fix104)
//      → นักเวท/นักบวช/เนโคร/ซัมมอนเนอร์ ยืนถือคทาอาชีพ แต่ตอนยิงกลายเป็นคทาสีทองอันเดิมทุกคน
//   2) สีย้อมอาวุธอาชีพสายเดิม (FLT27 ดาบ/คทา/ธนู) ไปย้อมทับอาวุธแฟชั่นด้วย → ดาบแฟชั่นตอนเก็บหลัง/ถือ = สีเหลือง แต่ตอนฟัน = สีจริง
//   3) คทาแฟชั่นตอนเก็บไว้หลัง (ในเมือง) โชว์คทาธรรมดา
//  แก้: ทุกท่าใช้ลำดับเดียวกับตอนยืนถือ → อาวุธแฟชั่นของอาชีพ ▸ หน้าตาอาวุธอาชีพ ▸ สีย้อมอาชีพ ▸ อาวุธปกติ (ห่อฟังก์ชันเดิม ไม่รื้อระบบ)
// =====================================================================
try{
const fwMine145=()=>{try{const k=FASH&&FASH.wpn,W=k&&typeof FWPN!=='undefined'&&FWPN[k];return W&&W.cls===P.cls?k:null}catch(e){return null}};
window.fwMine145=fwMine145;
/* 2) สีย้อมอาชีพไม่ทับอาวุธแฟชั่น */
{const _wf=withFlt27;withFlt27=function(fn,self,args){if(fwMine145())return fn.apply(self,args);return _wf(fn,self,args)};window.withFlt27=withFlt27}
/* 1) ท่ายิงเวท: คทาเดียวกับที่ถือ */
{const _sa=staffAt7;staffAt7=function(hx,hy,ang,sc){try{if(wKind()==='staff'){const fw=fwMine145();
   if(fw){const W=FWPN[fw],t=performance.now()/1000;ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(sc)ctx.scale(sc,sc);ctx.drawImage(fashSword(fw),-23,STF_GRIP7,46,46);
    if(W&&W.glow){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,STF_GRIP7+8,0,0,STF_GRIP7+8,18);g.addColorStop(0,'rgba('+W.glow+','+(.22+.12*Math.sin(t*4))+')');g.addColorStop(1,'rgba('+W.glow+',0)');ctx.fillStyle=g;ctx.fillRect(-18,STF_GRIP7-10,36,36)}ctx.restore();return}
   if(STAFF25.has(P.cls)&&window.cwOk25&&cwOk25()){ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);if(sc)ctx.scale(sc,sc);try{wpn25(P.cls,ctx)}catch(e){}ctx.restore();return}
   if(typeof cwOld27==='function'&&cwOld27()){ctx.save();ctx.filter=FLT27[P.cls]||'none';try{return _sa.apply(this,arguments)}finally{ctx.restore()}}}}catch(e){}
  return _sa.apply(this,arguments)};window.staffAt7=staffAt7}
/* 3) คทาแฟชั่นตอนเก็บหลัง */
{const _ti=toolIcon;toolIcon=function(type,tier,sz){if(type==='axe'||type==='pick'){const art=TOOLART.icon(type,tier);if(art)return art}try{if(window.BACKSW7>0&&type==='staff'&&wKind()==='staff'){const fw=fwMine145();if(fw)return fashSword(fw)}}catch(e){}return _ti.apply(this,arguments)};window.toolIcon=toolIcon}
/* The back uses the same live weapon renderer as the hand, without thumbnail cropping. */
function glow145(hx,hy,ang,sc=1){try{const W=wAura(),len={dragoon:50,ninja:32,paladin:34,monk:9,cleric:40,necro:40,summoner:40}[P.cls]||30;if(W&&typeof aura151==='function')aura151(hx,hy,ang,len*sc,W)}catch(e){}}
function bowGlow145(x,y,aim,sc=1){try{const W=wAura();if(!W)return;if(P.cls==='sniper'){aura151(x,y,aim+Math.PI/2,29*sc,W);return}ctx.save();try{ctx.translate(x,y);ctx.rotate(aim);ctx.scale(sc,sc);ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba('+W.rgb+',.26)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(1,-18);ctx.quadraticCurveTo(16,0,1,18);ctx.stroke();ctx.strokeStyle='rgba('+W.rgb2+',.55)';ctx.lineWidth=1.4;ctx.stroke()}finally{ctx.restore()}const px=-Math.sin(aim)*18*sc,py=Math.cos(aim)*18*sc;auraEmit(x+px,y+py,x-px,y-py,W,DT||0,1)}catch(e){}}
function back145(x,by,side,f,d){if(!P.armor.sword)return false;const kd=wKind(),drawn=!!window.SKPOSE57||(P.draw&&P.tool==='sword');
 if(kd==='bow'&&P.cls!=='sniper'){const q=quiverOffset7[d];drawQuiver7(x+q.x,by+q.y,q.r,3)}
 if(drawn||P.cls==='monk')return true;
 const saved={tool:P.tool,draw:P.draw,at:P.at};ctx.save();try{P.tool='sword';P.draw=false;P.at=-1;const ox=side?-f*4:d==='u'?3:-3;
  if(kd==='bow'){const aim=P.cls==='sniper'?-Math.PI/2+(d==='l'?.3:d==='r'?-.3:.4):d==='l'?.35:d==='r'?Math.PI-.35:-.7;drawBow6(x+ox,by-23,aim,P.tier.sword|0,0,false,.78);bowGlow145(x+ox,by-23,aim,.78)}
  else if(kd==='staff'){staffAt7(x+ox,by-10,d==='l'?-.22:d==='r'?.22:.3,.86);glow145(x+ox,by-10,d==='l'?-.22:d==='r'?.22:.3,.86)}
  else{ctx.translate(x+ox,by-32);ctx.scale(P.cls==='dragoon'?.72:.82,P.cls==='dragoon'?.72:.82);const ang=Math.PI+(d==='l'?-.42:.42);toolSpr(0,0,ang);glow145(0,0,ang)}
 }finally{Object.assign(P,saved);ctx.restore()}return true}
window.Grip145={back:back145,glow:glow145,bowGlow:bowGlow145};
/* REG136 */
try{if(window.REG136)REG136.push(
 ['อาวุธตอนยิงเวท = อาวุธที่ถือ (แฟชั่น/อาชีพ/สีย้อม)',async()=>{const sv={cls:P.cls,w:P.armor.sword,fw:FASH.wpn},s0=ctx,c=document.createElement('canvas');c.width=c.height=64;document.body.appendChild(c);const k=c.getContext('2d');let bad=null;
   try{ctx=k;const id=['cw_mage5','cw_mage3','cw_mage1','cw_mage0'].find(i=>ITEMS[i]);if(!id)return null;P.cls='mage';P.armor.sword=id;
    FASH.wpn=FWPN.w_mage?'w_mage':null;if(FASH.wpn){let got=null;const di=k.drawImage;k.drawImage=function(img){if(got==null)got=img;return di.apply(this,arguments)};staffAt7(32,40,0,1);k.drawImage=di;if(got!==fashSword('w_mage'))bad='ยิงเวทไม่ใช้คทาแฟชั่น'}
    if(!bad){FASH.wpn=null;let f=null;const di=k.drawImage;k.drawImage=function(img){if(f==null)f=k.filter;return di.apply(this,arguments)};staffAt7(32,40,0,1);k.drawImage=di;if(cwOld27()&&(!f||f==='none'))bad='ยิงเวทไม่ย้อมสีคทาอาชีพ'}
    if(!bad&&FWPN.w_sword){P.cls='sword';P.armor.sword=['cw_sword5','cw_sword1'].find(i=>ITEMS[i])||P.armor.sword;FASH.wpn='w_sword';let f='x';withFlt27(()=>{f=k.filter},null,[]);if(f!=='none')bad='สีย้อมอาชีพทับดาบแฟชั่น'}}
   catch(e){bad='error '+e.message}finally{ctx=s0;P.cls=sv.cls;P.armor.sword=sv.w;FASH.wpn=sv.fw;c.remove()}return bad}]);}catch(e){}
}catch(e){console.warn('fix145',e)}
