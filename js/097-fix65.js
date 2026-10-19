// fix65 (v4.60) — 🏆 ตารางอันดับดีไซน์ใหม่: แท่นโพเดียม 3 อันดับแรก + รูปตัวละครใส่ชุดจริง (เกราะ/แฟชั่น/อาวุธ) · การ์ดโปรไฟล์ของเรา
//   ส่งรูปลักษณ์ (av) ไปกับสถิติตอนเซฟคลาวด์ · เซิร์ฟเวอร์ (accounts.js v4.60) เก็บ av และซ่อนบัญชีที่เลเวลขึ้นผิดปกติ
try{
function myAv65(){const a={};for(const k of ['helm','chest','pants','arm','sword'])if(P.armor[k])a[k]=P.armor[k];return {c:P.cls,ts:P.tier.sword|0,a,fb:FASH.body||'',fw:FASH.wpn||'',lk:Object.assign({},P.look8||{})}}
window.myAv65=myAv65;
{const _c=CLOUD.call;CLOUD.call=function(p,body,to){try{if(p==='/api/save'&&body){body.stat=Object.assign({},body.stat||{},{av:myAv65()})}}catch(e){}return _c.call(this,p,body,to)}}
const AVC65={};
function avCanvas65(av,w,h,sc,dir){const key=JSON.stringify(av||{})+w+h+sc+(dir||'');if(AVC65[key])return AVC65[key];const c=document.createElement('canvas');c.width=w;c.height=h;const k=c.getContext('2d');
 const sv={ctx,armor:Object.assign({},P.armor),tier:Object.assign({},P.tier),cls:P.cls,fb:FASH.body,fw:FASH.wpn,look:P.look8,x:P.x,y:P.y,dir:P.dir,mv:P.mv,draw:P.draw,tool:P.tool,name:P.name,at:P.at,mount:MOUNT.on,dash:P.dash};
 try{ctx=k;k.translate(w/2,h-6);k.scale(sc,sc);av=av||{};const A=av.a||{};for(const s of ['helm','chest','pants','arm','neck','ring','sword'])P.armor[s]=A[s]&&ITEMS[A[s]]?A[s]:null;P.tier.sword=av.ts|0;
  P.cls=CLS[av.c]?av.c:'none';FASH.body=av.fb&&OUTFIT[av.fb]?av.fb:null;FASH.wpn=av.fw&&FWPN[av.fw]?av.fw:null;P.look8=Object.assign({},window.LOOKDEF8||{},av.lk||{});
  P.x=0;P.y=0;P.dir=dir||'d';P.mv=false;P.draw=true;P.tool='sword';P.name='';P.at=-1;MOUNT.on=false;P.dash=0;window.__lbav65=1;hero()}catch(e){}
 finally{window.__lbav65=0;ctx=sv.ctx;Object.assign(P.armor,sv.armor);Object.assign(P.tier,sv.tier);P.cls=sv.cls;FASH.body=sv.fb;FASH.wpn=sv.fw;P.look8=sv.look;P.x=sv.x;P.y=sv.y;P.dir=sv.dir;P.mv=sv.mv;P.draw=sv.draw;P.tool=sv.tool;P.name=sv.name;P.at=sv.at;MOUNT.on=sv.mount;P.dash=sv.dash}
 return AVC65[key]=c}
window.avCanvas65=avCanvas65;
{const st=document.createElement('style');st.textContent=`
#lb20 .w{background:linear-gradient(180deg,#1c1530,#0e0a18)!important}
#lb20 .lb65{display:block!important;flex:1 1 auto;min-height:0;padding:8px 10px;overflow-y:auto;font-family:system-ui,"Noto Sans Thai",sans-serif;color:#f3e9d2}
#lb20 .lb65 .tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;background:rgba(0,0,0,.35);padding:3px;border-radius:12px;border:1px solid rgba(232,193,74,.25);margin-bottom:8px}
#lb20 .lb65 .tabs button{all:unset;cursor:pointer;text-align:center;padding:6px 2px;border-radius:9px;font:700 11.5px system-ui,"Noto Sans Thai";color:#d8ccb0;white-space:nowrap}
#lb20 .lb65 .tabs button.on{background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}
#lb20 .me65{display:flex;gap:10px;align-items:center;padding:8px;border-radius:14px;background:linear-gradient(90deg,rgba(122,255,154,.12),rgba(255,255,255,.03));border:1px solid rgba(122,255,154,.5);margin-bottom:10px}
#lb20 .me65 canvas,#lb20 .pod canvas,#lb20 .row65 canvas{image-rendering:pixelated;flex:none;border:none!important;background:none!important;border-radius:0!important;max-width:none!important;margin:0!important;box-shadow:none!important}
#lb20 .lb65 .podium,#lb20 .lb65 .tabs{width:100%;box-sizing:border-box}
#lb20 .me65 div{text-align:left}#lb20 .me65 b{font:800 14px system-ui,"Noto Sans Thai";color:#fff}#lb20 .me65 small{display:block;font:600 11px system-ui,"Noto Sans Thai";color:#c8bca2}
#lb20 .podium{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:6px;align-items:end;margin-bottom:10px}
#lb20 .pod{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 4px 8px;border-radius:14px 14px 8px 8px;text-align:center;position:relative;min-width:0}
#lb20 .pod.p1{background:linear-gradient(180deg,rgba(255,210,80,.28),rgba(255,210,80,.06));border:1px solid rgba(255,210,80,.8);padding-top:10px}
#lb20 .pod.p2{background:linear-gradient(180deg,rgba(210,220,235,.22),rgba(210,220,235,.05));border:1px solid rgba(210,220,235,.7)}
#lb20 .pod.p3{background:linear-gradient(180deg,rgba(220,140,80,.22),rgba(220,140,80,.05));border:1px solid rgba(220,140,80,.7)}
#lb20 .pod .md{font-size:22px;line-height:1}#lb20 .pod b{font:800 12.5px system-ui,"Noto Sans Thai";color:#fff;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#lb20 .pod small{font:700 10.5px system-ui,"Noto Sans Thai";color:#ffd86a}#lb20 .pod em{font:600 10px system-ui,"Noto Sans Thai";color:#c8bca2;font-style:normal}
#lb20 .row65{display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);margin-bottom:4px}
#lb20 .row65.me{border-color:rgba(122,255,154,.7);background:rgba(122,255,154,.08)}
#lb20 .row65 i{font-style:normal;width:26px;text-align:center;font:900 13px system-ui;color:#d8ccb0}
#lb20 .row65 .nm{flex:1;min-width:0}#lb20 .row65 .nm b{display:block;font:800 12.5px system-ui,"Noto Sans Thai";color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#lb20 .row65 .nm small{font:600 10.5px system-ui,"Noto Sans Thai";color:#c8bca2}#lb20 .row65 .v{font:800 12px system-ui;color:#ffd86a;white-space:nowrap}
#lb20 .ft65{font:600 10.5px system-ui,"Noto Sans Thai";color:#8a8070;text-align:center;margin-top:6px}`;document.head.appendChild(st)}
const esc65=s=>String(s==null?'':s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const clsN65=c=>CLS[c]?CLS[c].e+' '+CLS[c].n:'🔰 ไม่มีอาชีพ';
const syncMsg65={store:'ฐานข้อมูลปฏิเสธการบันทึก',offline:'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',network:'การเชื่อมต่อขัดข้อง',size:'ข้อมูลเซฟเกินขนาดที่เซิร์ฟเวอร์รับได้',conflict:'ข้อมูลเปลี่ยนจากอีกเครื่อง กรุณาเข้าเกมใหม่',auth:'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',timeout:'รอเซิร์ฟเวอร์นานเกินไป',busy:'ระบบกำลังทำรายการอื่นอยู่',inflight:'มีการซิงค์อีกครั้งกำลังทำงาน',unverified:'ยังตรวจสอบบัญชีออนไลน์ไม่เสร็จ','no-server':'ไม่พบที่อยู่เซิร์ฟเวอร์','no-account':'ไม่พบบัญชีที่เข้าสู่ระบบ',sync:'เซิร์ฟเวอร์ยังไม่ยืนยันการบันทึก'};
lbRender20=function(){const tab=LB20.tab,u=(LBT20.find(x=>x[0]===tab)||[])[2]||'';let h='<div class="w"><div class="hd"><b>🏆 ตารางอันดับผู้กล้า</b><button data-lb-refresh onclick="lbRefresh20()" title="รีเฟรช">⟳</button><button onclick="p6close(lbW20)">✕</button></div><div class="bd lb65"><div class="tabs">'+LBT20.map(([k,n])=>'<button class="'+(tab===k?'on':'')+'" onclick="lbTab20(\''+k+'\')">'+n+'</button>').join('')+'</div>';
 h+='<div class="me65"><span data-av="me"></span><div><b>'+esc65(P.name||'ผู้กล้า')+'</b><small>'+clsN65(P.cls)+' · Lv.'+P.lv+'</small><small>ล้มมอน '+(ST20.kills||0).toLocaleString()+' · ล้มบอส '+(ST20.boss||0)+' · ดันเจี้ยนชั้น '+(DG.max|0)+'</small></div></div>';
 const L=LB20.data&&LB20.data[tab]||[],me=String(P.name||'');
 if(LB20.err==='off')h+='<div class="ft65">ต้องเล่นแบบออนไลน์ (ล็อกอินบัญชี) จึงจะดูอันดับได้</div>';else if(LB20.err==='old')h+='<div class="ft65">เซิร์ฟเวอร์ยังเป็นเวอร์ชันเก่า</div>';else if(LB20.err==='rate')h+='<div class="ft65">เรียกอันดับถี่เกินไป รอสักครู่แล้วกดรีเฟรช</div>';else if(LB20.err)h+='<div class="ft65">โหลดอันดับจากเซิร์ฟเวอร์ไม่สำเร็จ ลองกดรีเฟรชอีกครั้ง</div>';else if(!LB20.data)h+='<div class="ft65">กำลังโหลด…</div>';
 else if(!L.length)h+='<div class="ft65">'+(LB20.data.pending?'เซิร์ฟเวอร์กำลังลองบันทึกอันดับล่าสุดอีกครั้ง':'ยังไม่มีข้อมูล')+'</div>';
 else{const val=x=>tab==='lv'?'Lv.'+x.lv:Number(x.v).toLocaleString()+' '+u;const pod=(x,i)=>x?'<div class="pod p'+(i+1)+'"><span class="md">'+['🥇','🥈','🥉'][i]+'</span><span data-av="'+i+'" data-big="'+(i===0?2:1)+'"></span><b>'+esc65(x.n)+'</b><em>'+clsN65(x.cls)+'</em><small>'+val(x)+'</small></div>':'<div></div>';
  h+='<div class="podium">'+pod(L[1],1)+pod(L[0],0)+pod(L[2],2)+'</div>';
  L.slice(3).forEach((x,j)=>{const i=j+3,t=TTLMAP20[x.t];h+='<div class="row65'+(x.n===me?' me':'')+'"><i>'+(i+1)+'</i><span data-av="'+i+'" data-big="0"></span><div class="nm"><b>'+esc65(x.n)+(t?' <small style="color:'+t[2]+'">「'+t[1]+'」</small>':'')+'</b><small>'+clsN65(x.cls)+' · Lv.'+x.lv+'</small></div><span class="v">'+(tab==='lv'?'':val(x))+'</span></div>'});
 }
 if(LB20.data)h+='<div class="ft65">'+(LB20.syncPending?'แสดงอันดับบนเซิร์ฟเวอร์แล้ว · กำลังรอผลซิงค์สถิติของเครื่อง…':LB20.syncErr?'แสดงอันดับบนเซิร์ฟเวอร์แล้ว · เซฟเครื่องนี้ไม่ขึ้นคลาวด์: '+(syncMsg65[LB20.syncErr]||'ข้อผิดพลาด '+esc65(LB20.syncErr))+' · ลองกด ⟳ อีกครั้ง':LB20.data.pending?'แสดงอันดับที่มีอยู่แล้ว · เซิร์ฟเวอร์กำลังลองบันทึกอันดับล่าสุดอีกครั้ง':'ผู้เล่นทั้งหมด '+(LB20.data.n|0)+' คน · อัปเดตเมื่อบันทึกเกมขึ้นคลาวด์ · บัญชีที่ผิดปกติจะไม่แสดง')+'</div>';
 lbW20.innerHTML=h+'</div></div>';
 try{for(const el of lbW20.querySelectorAll('[data-av]')){const id=el.dataset.av,big=+el.dataset.big;let av=null;if(id==='me')av=myAv65();else{const x=L[+id];av=x&&x.av?x.av:{c:x&&x.cls}}const cv=id==='me'?avCanvas65(av,64,74,1.35):big===2?avCanvas65(av,86,98,1.8):big===1?avCanvas65(av,72,84,1.5):avCanvas65(av,40,46,.85);const cl=cv.cloneNode(false);cl.getContext('2d').drawImage(cv,0,0);cl.style.setProperty('width',cv.width+'px','important');cl.style.setProperty('height',cv.height+'px','important');el.replaceWith(cl)}}catch(e){console.warn('lb65',e)}};
window.lbRender20=lbRender20;
}catch(e){console.warn('fix65',e)}
