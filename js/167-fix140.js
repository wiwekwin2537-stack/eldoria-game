// =====================================================================
// fix140 (v5.03) — 📈 แนะนำการพัฒนา: ระบบพัฒนาตัวละครมีเยอะ (ตีบวก/ออป/รูน/อัญมณี/พาสซีฟ/ชำนาญ/อัปดาว/ตำนาน…) ผู้เล่นใหม่ไม่รู้เริ่มตรงไหน
//  หน้าเดียวบอก "ตอนนี้ควรทำอะไร" ตามสถานะจริง + รายการทุกระบบเรียงตามเลเวลที่เปิด (✅ เปิดแล้ว / 🔒 ยังไม่ถึง) + ปุ่มพาไป
// =====================================================================
try{
const W=mk6('adv140');window.advW140=W;
const css=document.createElement('style');css.textContent='#adv140 .w{width:min(640px,97%);height:min(560px,96%)}#adv140 .bd{display:block!important;overflow-y:auto;padding:8px 10px;text-align:left;font:600 12.5px/1.45 system-ui,"Noto Sans Thai",sans-serif}'
+'#adv140 .nx{background:linear-gradient(180deg,#3a2c14,#24190c);border:1.5px solid #ffd86a;border-radius:12px;padding:8px 10px;margin-bottom:8px}#adv140 .nx b{color:#ffe9a0}#adv140 .nx div{display:flex;gap:8px;align-items:center;margin-top:5px}#adv140 .nx div span{flex:1}'
+'#adv140 .rw{display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);margin-bottom:5px}#adv140 .rw.lk{opacity:.55}#adv140 .rw .ic{font-size:20px;width:28px;text-align:center}#adv140 .rw .t{flex:1;min-width:0}#adv140 .rw .t b{color:#fff}#adv140 .rw .t small{display:block;color:#b8b0c8;font-size:11px}'
+'#adv140 button.go{border:0;border-radius:9px;padding:6px 10px;height:auto;font:800 12px system-ui,"Noto Sans Thai";background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06;white-space:nowrap;cursor:pointer}#adv140 .lv{font-size:10.5px;color:#9fd8ff;white-space:nowrap}';document.head.appendChild(css);
const call=f=>()=>{p6close(W);setTimeout(()=>{try{f()}catch(e){say('ยังเปิดหน้านี้ไม่ได้ตอนนี้')}},60)};
const SYS=[
 {lv:1,ic:'📜',n:'เควสหลัก (เนื้อเรื่อง)',d:'ทำตามแถบภารกิจด้านบน ได้เงิน/XP/ของดีที่สุดในช่วงแรก',go:()=>openJournal()},
 {lv:1,ic:'⭐',n:'อัปค่าพลัง',d:'เลเวลอัปได้แต้ม 3 แต้ม — STR ตีแรง · VIT เลือด · AGI คริ/ธนู · INT เวท',go:()=>openChar()},
 {lv:1,ic:'⚔️',n:'สกิลอาชีพ',d:'เรียนสกิลที่ร้านสกิลในเมือง ปลดล็อกตามเลเวล',go:()=>openSkw('sk')},
 {lv:3,ic:'🔨',n:'ตีบวกอาวุธ/ชุด',d:'ที่ทั่งร้านอาวุธ ใช้หินเสริมพลัง (ดรอปดันเจี้ยน) + แร่ + เหรียญ — ค่าพลังขึ้นมากที่สุด',go:()=>{if(D&&D.town)enterShop('gear');else say('ไปที่ร้านอาวุธในเมือง (บอริน หนวดเหล็ก)')}},
 {lv:5,ic:'🗝️',n:'ดันเจี้ยน 100 ชั้น',d:'ถ้ำในทุ่งหญ้า — แหล่งหินเสริมพลัง/อุปกรณ์ · ชั้นละบอส 1 ตัว',go:()=>{say('🗝️ ถ้ำดันเจี้ยนอยู่ในทุ่งหญ้า ทางเหนือของประตูมิติ')}},
 {lv:5,ic:'🌟',n:'ต้นไม้พาสซีฟ',d:'แต้มพาสซีฟได้ตามเลเวล — ดาเมจ/คริ/เลือด เพิ่มถาวร',go:()=>openSkw('pas')},
 {lv:10,ic:'🎯',n:'ชำนาญสกิล',d:'ใช้สกิลบ่อย ๆ จะเลื่อนขั้นชำนาญ สกิลแรงขึ้น',go:()=>openSkw('msk')},
 {lv:10,ic:'🎲',n:'ออปอุปกรณ์ · หินสุ่ม/ล็อกออป',d:'อุปกรณ์มีค่าพิเศษสุ่ม 1–4 บรรทัด แตะไอเท็มในกระเป๋า → สุ่มใหม่/ล็อกบรรทัดที่ชอบ',go:()=>toggleBag()},
 {lv:20,ic:'🐲',n:'บอสตำนาน (หอผนึกอสูร)',d:'บ้านหลังคาม่วงในเมือง — ชนะได้ตราอสูร แลกชิ้นชุดบอส',go:()=>{say('🔮 หอผนึกอสูร: บ้านหลังคาม่วงแถวบนของเมือง')}},
 {lv:20,ic:'💎',n:'รูน & อัญมณี',d:'ใส่รูนธาตุในช่องอุปกรณ์ / เจาะรูใส่อัญมณีเพิ่มค่าพลัง',go:()=>open117()},
 {lv:25,ic:'🗼',n:'หอคอยบอส',d:'มุมขวาบนของเมือง 12 ชั้น บอสเลือดสูง จับเวลา 5 นาที',go:()=>{say('🗼 ประตูหอคอยอยู่มุมขวาบนของเมือง')}},
 {lv:30,ic:'🐉',n:'บอสโลก 12:00 / 20:00',d:'ตีร่วมกันทั้งเซิร์ฟ อันดับดาเมจได้รางวัล · ของหายากเข้าประมูลบอส',go:()=>openWb10()},
 {lv:30,ic:'🐾',n:'อัปดาวสัตว์เลี้ยง/สัตว์ขี่',d:'ใช้ชิ้นส่วนสัตว์ (ดรอปมอน/บอส) อัปดาวเพิ่มค่าพลัง',go:()=>open112()},
 {lv:30,ic:'🏪',n:'ตลาดกลาง & เทรด',d:'ขายของเหลือใช้ ซื้อวัตถุดิบที่ขาด (ขายได้แม้ออฟไลน์)',go:()=>openMk130('buy')},
 {lv:150,ic:'🌠',n:'ตำนาน (หลังเลเวลตัน)',d:'Lv.150+ แต้มตำนานเพิ่มค่าพลังต่อไม่สิ้นสุด',go:()=>open92()},
 {lv:150,ic:'🏙️',n:'นครวารีอัสตรา (เมือง 2)',d:'ดันเจี้ยนใหม่ วัตถุดิบระดับสูง — คุยกับอาร์เทน ผู้นำทาง ข้างน้ำพุ',go:()=>{say('🧭 คุยกับอาร์เทน ผู้นำทาง ข้างน้ำพุกลางเมือง')}}];
function next(){const N=[];try{if(P.sp>0)N.push(['⭐','มีแต้มค่าพลังเหลือ '+P.sp+' แต้ม — อัปก่อนออกไปสู้',()=>openChar()])}catch(e){}
 try{const f=typeof ptFree==='function'?ptFree():0;if(f>0)N.push(['🌟','มีแต้มพาสซีฟเหลือ '+f+' แต้ม',()=>openSkw('pas')])}catch(e){}
 try{const c=STCH[STORY.ch];if(c&&STORY.st!=='done')N.push(['📜',(STORY.st==='report'?'กลับไปรายงานพระราชา — ':'')+c.t,()=>openJournal()])}catch(e){}
 try{const w=P.armor&&P.armor.sword,l=w?(ENH[w]|0):0,want=Math.min(15,Math.floor(P.lv/8));if(w&&l<want)N.push(['🔨','อาวุธ +'+l+' ยังต่ำไปสำหรับ Lv.'+P.lv+' (แนะนำ +'+want+')',()=>SYS[3].go()])}catch(e){}
 try{if((inv.opt111|0)>0)N.push(['🎲','มีหินสุ่มออป '+inv.opt111+' ก้อน — ลองสุ่มออปอาวุธ',()=>toggleBag()])}catch(e){}
 return N.slice(0,4)}
function render(){const lv=P.lv|0,N=next();let h='<div class="w"><div class="hd"><b>📈 แนะนำการพัฒนา</b><button onclick="p6close(advW140)">✕</button></div><div class="bd">';
 h+='<div class="nx"><b>👉 ตอนนี้ควรทำ</b>'+(N.length?N.map((x,i)=>'<div><span>'+x[0]+' '+x[1]+'</span><button class="go" data-n="'+i+'">ไป</button></div>').join(''):'<div><span>✨ ทุกอย่างพร้อมแล้ว — ลุยดันเจี้ยน/บอสเก็บของดีต่อได้เลย</span></div>')+'</div>';
 h+='<b style="color:#ffe9a0">🗺️ ระบบพัฒนาตัวละครทั้งหมด (เรียงตามเลเวลที่เปิด)</b>';
 SYS.forEach((S,i)=>{const on=lv>=S.lv;h+='<div class="rw'+(on?'':' lk')+'"><div class="ic">'+S.ic+'</div><div class="t"><b>'+S.n+'</b><small>'+S.d+'</small></div><span class="lv">'+(on?'✅':'🔒 Lv.'+S.lv)+'</span>'+(on?'<button class="go" data-s="'+i+'">เปิด</button>':'')+'</div>'});
 W.innerHTML=h+'</div></div>';W._n=N}
W.addEventListener('click',e=>{const b=e.target.closest('button.go');if(!b)return;if(b.dataset.s!=null)call(SYS[+b.dataset.s].go)();else if(b.dataset.n!=null&&W._n[+b.dataset.n])call(W._n[+b.dataset.n][2])()});
window.openAdv140=()=>{render();p6open(W)};
try{const at=PM7.findIndex(m=>m[1]==='อัปดาว');PM7.splice(at<0?2:at,0,['📈','แนะนำ',()=>openAdv140()]);pmRender7()}catch(e){}
}catch(e){console.warn('fix140',e)}
