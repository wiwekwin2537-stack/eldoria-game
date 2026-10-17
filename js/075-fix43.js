// fix43 (v4.48) — จัดระยะโจมตีให้ลงตัวตามบทบาท: ประชิด ~67 · ทวน 105 · คทา 280–300 · ธนู 360 · ไรเฟิล 440
// (แก้ในที่ fix41: หมัดเทพสังหาร ยาว 360→280 · วงระเบิด 140→120 — มังค์เป็นสายประชิด ไม่ควรตีไกลกว่าสายยิง)
try{
const RNG43={mage:300,cleric:280,necro:280,summoner:280,none:280,archer:360,sniper:440};
// ยิงธรรมดา: ระยะตามอาชีพ (เดิม คทา 260 · ธนู/ไรเฟิล 320 ทุกอาชีพ)
{const _sh=shoot;shoot=function(kind,o){try{if(o&&!o.dv&&((kind==='bolt'&&o.range===260&&o.mult===1)||(kind==='arrow'&&o.range===320&&o.mult===.95))){const r=RNG43[P.cls]||(kind==='bolt'?280:360);o=Object.assign({},o,{range:r});if(P.cls==='sniper'&&kind==='arrow')o.sp=760}}catch(e){}return _sh.call(this,kind,o)};window.shoot=shoot}
// พายุดาบ (นักดาบ): รัศมี 64 → 90 ให้สมกับสกิล Lv.30
{const _ei=eachIn;eachIn=function(x,y,r,fn){if(P&&P.ww&&r===64&&P.cls==='sword')r=90;return _ei.call(this,x,y,r,fn)};window.eachIn=eachIn}
// อัศวินมังกร: ทวนยาว — ฟันธรรมดาโดนไกลถึง 105 (เดิมเท่าดาบ ~67 ทั้งที่คำอธิบายบอกว่ายาวกว่า)
{const _st=skTick;skTick=function(dt){_st(dt);try{
 if(P.cls!=='dragoon'||P.dead||P.tool!=='sword'||!P.armor.sword||isRng()||P.cmb===2||!(P.at>.2&&P.at<.7))return;
 const v=DIRV[P.dir];for(const e of enemies()){if(e.dead||e.last===atkId)continue;const dx=e.x-P.x,dy=(e.y-10)-(P.y-8),along=dx*v[0]+dy*v[1],perp=Math.abs(dx*v[1]-dy*v[0]);
  if(along>20&&along<105+eR(e)*.6&&perp<22+eR(e)*.6){e.last=atkId;hurtE(e,1,{kb:140})}}}catch(e){}}}
// คำอธิบายอาชีพให้ตรงระยะจริง
try{CLS.dragoon.pas=(CLS.dragoon.pas||'').replace('ระยะฟันยาวขึ้น','ทวนยาว ฟันธรรมดาโดนไกล 105')}catch(e){}
try{CLS.sniper.d=(CLS.sniper.d||'')+' · ยิงไกลที่สุดในเกม (440)'}catch(e){}
}catch(e){console.warn('fix43',e)}
