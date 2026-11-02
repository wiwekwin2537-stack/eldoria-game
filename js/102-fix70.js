// fix70 (v4.62) — 1) รูปตัวอย่าง (บูติก/ตู้เสื้อผ้า/ตารางอันดับ) แสดงแค่ชุด ไม่วาดออร่าตีบวกของตัวเราทับ
//   (ตรวจจาก canvas ที่ไม่ได้อยู่บนหน้าจอ = รูปตัวอย่าง → ปิด fix60 ชั่วคราวด้วย ENH ชุด=0 + setCount ว่าง)
//   2) หน้าเหรียญแฟชั่น: เติมเงิน → 💝 โดเนท (สนับสนุนเกม · ไม่บังคับ) · ไม่มีช่องทางส่งสลิป = ให้ใส่รหัสอ้างอิงในบันทึกช่วยจำตอนโอน
try{
{const _hb=heroBody;heroBody=function(){let pv=false;try{pv=!!(ctx&&ctx.canvas&&!ctx.canvas.isConnected)}catch(e){}if(!pv)return _hb.apply(this,arguments);
  const sv={},sc=setCount;try{for(const s of ['helm','chest','pants','arm']){const id=P.armor&&P.armor[s];if(id&&ENH[id]){sv[id]=ENH[id];ENH[id]=0}}setCount=()=>({});return _hb.apply(this,arguments)}
  finally{setCount=sc;for(const id in sv)ENH[id]=sv[id]}};window.heroBody=heroBody}
// รูปตัวอย่าง: ไม่วาดอนุภาค/ประกาย/ลูกศรนำทาง/ป้ายโลก (เหมือนตอนวาดผู้เล่นอื่น __IN_OTHER8)
{const _h=hero;hero=function(){let pv=false;try{pv=!!(ctx&&ctx.canvas&&!ctx.canvas.isConnected)}catch(e){}if(!pv)return _h.apply(this,arguments);
  const o=window.__IN_OTHER8,r0=RFX.splice(0),dg=window.drawGuide;window.__IN_OTHER8=true;try{drawGuide=function(){}}catch(e){}
  try{return _h.apply(this,arguments)}finally{window.__IN_OTHER8=o;RFX.length=0;RFX.push(...r0);try{drawGuide=dg}catch(e){}}};window.hero=hero}
const fixTxt70=root=>{if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const L=[];while(n=w.nextNode())L.push(n);
 for(const t of L){let v=t.nodeValue,o=v;v=v.replace('💳 เติมเหรียญ','💝 โดเนท').replace('💳 เติม','💝 โดเนท').replace('ยังไม่เปิดระบบเติมเงิน','ยังไม่เปิดรับโดเนท');if(v!==o)t.nodeValue=v}};
const don70=()=>{try{const W=gid('gem69w');if(!W||W.hidden)return;fixTxt70(W);
  const box=[...W.querySelectorAll('.box')].find(b=>/^1\) สแกน/.test(b.textContent.trim()));if(box&&!box.dataset.d70){box.dataset.d70=1;const ref=(W.querySelector('.ref')||{}).textContent||'',ct=(G69.top&&G69.top.ct)||'';
   box.innerHTML='💝 <b>ขอบคุณที่สนับสนุนเกม!</b> (โดเนทตามความสมัครใจ ไม่บังคับ)<br>1) สแกน QR หรือโอนเข้าพร้อมเพย์ด้านบน ตามยอดที่แสดง<br>2) ใส่รหัส <b>'+ref+'</b> ใน<b>บันทึกช่วยจำ</b>ตอนโอน'+(ct?' หรือส่งสลิปไปที่ <b>'+ct+'</b>':'')+'<br>3) แอดมินตรวจยอดแล้วกดอนุมัติ เหรียญเข้าอัตโนมัติ (ไม่ต้องออกเกม)<br><small style="opacity:.75">⚠️ ผู้เยาว์ควรขออนุญาตผู้ปกครองก่อนโอนทุกครั้ง</small>'}
  const pk=[...W.querySelectorAll('.box')].find(b=>/^เลือกแพ็กเกจ/.test(b.textContent.trim()));if(pk&&!pk.dataset.d70){pk.dataset.d70=1;pk.innerHTML='💝 <b>โดเนทสนับสนุนเกม</b> (ไม่บังคับ — เล่นฟรีก็ได้เหรียญทุกวัน) · เลือกยอด แล้วได้ 💠 เป็นของขวัญขอบคุณ'}}catch(e){}};
{const W=gid('gem69w');if(W)new MutationObserver(don70).observe(W,{childList:true,subtree:true})}
{const F=gid('fashw');if(F)new MutationObserver(()=>{try{fixTxt70(F)}catch(e){}}).observe(F,{childList:true,subtree:true})}
try{const m=PM7.find(x=>x[1]==='เหรียญแฟชั่น');if(m){m[1]='เหรียญ/โดเนท';pmRender7()}}catch(e){}
}catch(e){console.warn('fix70',e)}
