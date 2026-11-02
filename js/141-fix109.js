// fix109 (v4.93) — 🎮 เล่นด้วยจอย (เจ้าของขอ 2026-10-14 20:32 พร้อมรูปจอยบลูทูธแบบ X3/T3)
//  ใช้ Gamepad API ของเบราว์เซอร์ (Android Chrome/PC) · จอยต้องอยู่ "โหมดเกมแพด" (จอยรุ่นนี้ส่วนใหญ่กด HOME+X ค้างตอนจับคู่)
//  ปุ่ม (แบบมาตรฐาน): อนาล็อกซ้าย/ปุ่มทิศ = เดิน (ดันสุดคันโยก = วิ่ง) · A = โจมตี (กดค้างตีต่อเนื่อง) · B = พุ่ง / ปิดหน้าต่าง
//   X = คุย/เก็บของ/ใช้ · Y = ท่าไม้ตาย · L1 R1 L2 R2 = สกิล 1–4 · อนาล็อกขวา ↑ = สกิล 5 · → = สกิล 6 · ↓ = ยาเลือด · ← = ยามานา
//   START = เมนู · SELECT = กระเป๋า · กดอนาล็อกขวา (R3) = ขี่/ลงสัตว์ขี่ · ตอนมีบทสนทนา: A = ต่อ/เลือก · B = ปิด · ปุ่มทิศ ↑↓ = เลือกตัวเลือก
//  ส่งเป็นปุ่มคีย์บอร์ดเดิม (5 6 7 8 9 0 · U · H · N · R · E · Shift · I · Esc) จึงใช้ระบบปุ่มเดิมทั้งหมด ไม่ได้สร้างระบบควบคุมใหม่
try{
const key109=(k,up)=>{try{dispatchEvent(new KeyboardEvent(up?'keyup':'keydown',{key:k,bubbles:true,cancelable:true}))}catch(e){}};
const tap109=k=>{key109(k);key109(k,1)};
const GP={on:false,prev:[],axP:{},atkT:0,moved:false,sel:0,id:''};window.GP109=GP;
const vis109=el=>el&&!el.hidden&&el.offsetParent!==null;
function back109(){// ปิดหน้าต่างบนสุด
 try{if(typeof DLG!=='undefined'&&DLG.open){tap109('Escape');return true}}catch(e){}
 const ws=[...document.querySelectorAll('.p6w')].filter(vis109);if(ws.length){p6close(ws[ws.length-1]);return true}
 try{if(vis109(bagEl)){toggleBag();return true}}catch(e){}
 try{if(vis109(shopEl)){const x=shopEl.querySelector('.xclose,.x');if(x){x.click();return true}}}catch(e){}
 try{if(!menuEl.hidden){toggleMenu();return true}}catch(e){}
 try{const pm=document.getElementById('pm7');if(vis109(pm)){pm.hidden=true;return true}}catch(e){}
 return false}
const BTN={0:'A',1:'B',2:'X',3:'Y',4:'L1',5:'R1',6:'L2',7:'R2',8:'SEL',9:'START',10:'L3',11:'R3',12:'UP',13:'DOWN',14:'LEFT',15:'RIGHT'};
function press109(b){const dlg=typeof DLG!=='undefined'&&DLG.open;
 if(dlg){if(b==='A'||b==='X')tap109('Enter');else if(b==='B')tap109('Escape');else if(b==='UP'||b==='DOWN'){const n=(DLG.ch||[]).length;if(n){GP.sel=(GP.sel+(b==='UP'?n-1:1))%n;try{const bs=document.querySelectorAll('#dlg button, .dlg button');bs.forEach((x,i)=>x.style.outline=i===GP.sel?'3px solid #ffd86a':'')}catch(e){}}}else if(b==='Y'){const n=(DLG.ch||[]).length;if(n)tap109(String(GP.sel+1))}return}
 if(b==='B'){if(!back109())tap109('Shift');return}
 if(b==='START'){tap109('Escape');return}
 if(b==='SEL'){tap109('i');return}
 if(PAUSED)return;
 const M={A:'j',X:'e',Y:'u',L1:'5',R1:'6',L2:'7',R2:'8',R3:'r'};if(M[b])tap109(M[b]);
 if(b==='A')GP.atkT=performance.now()+260}
function poll109(){requestAnimationFrame(poll109);let gp=null;try{const L=navigator.getGamepads?navigator.getGamepads():[];for(const g of L)if(g&&g.connected){gp=g;break}}catch(e){}
 if(!gp){if(GP.on){GP.on=false;for(const k of ['u','d','l','r'])keys[k]=0;keys.ctrl=0}return}
 if(!GP.on){GP.on=true;GP.id=gp.id;try{say('🎮 เชื่อมต่อจอยแล้ว — กด START ดูเมนู · ดูวิธีกดในเมนู 🎮 จอย')}catch(e){}}
 const B=gp.buttons.map(x=>x&&(x.pressed||x.value>.5));
 for(const i in BTN){if(B[i]&&!GP.prev[i])press109(BTN[i])}
 // ทริกเกอร์บางรุ่นเป็นแกน
 // เดิน: อนาล็อกซ้าย + ปุ่มทิศ
 const ax=gp.axes[0]||0,ay=gp.axes[1]||0,dz=.35,dlg=typeof DLG!=='undefined'&&DLG.open;
 if(!PAUSED&&!dlg){const u=ay<-dz||B[12],d=ay>dz||B[13],l=ax<-dz||B[14],r=ax>dz||B[15];
  if(u||d||l||r||GP.moved){keys.u=u?1:0;keys.d=d?1:0;keys.l=l?1:0;keys.r=r?1:0;GP.moved=!!(u||d||l||r)}
  const mag=Math.hypot(ax,ay);if(mag>.93&&!GP.run){GP.run=1;keys.ctrl=1}else if(mag<.85&&GP.run){GP.run=0;keys.ctrl=0}
  // A ค้าง = ตีต่อเนื่อง
  if(B[0]&&performance.now()>GP.atkT){GP.atkT=performance.now()+260;tap109('j')}
  // อนาล็อกขวา 4 ทิศ
  const rx=gp.axes[2]||0,ry=gp.axes[3]||0,R=(rx>.6?'R':rx<-.6?'L':ry<-.6?'U':ry>.6?'D':'');
  if(R&&R!==GP.rs){({U:()=>tap109('9'),R:()=>tap109('0'),D:()=>tap109('h'),L:()=>tap109('n')})[R]()}GP.rs=R}
 else if(GP.moved){keys.u=keys.d=keys.l=keys.r=0;GP.moved=false}
 GP.prev=B}
addEventListener('gamepadconnected',()=>{});requestAnimationFrame(poll109);
// เมนู: วิธีกดจอย
const W109=mk6('gp109');
window.open109=()=>{W109.innerHTML='<div class="w" style="width:min(520px,96%);height:auto;max-height:95%"><div class="hd"><b>🎮 เล่นด้วยจอย</b><button onclick="p6close(gid(\'gp109\'))">✕</button></div><div class="bd" style="display:block;overflow:auto;padding:10px 14px;font-size:13px;line-height:1.7">'
 +'<div style="color:'+(GP.on?'#7ed957':'#e8a04a')+';font-weight:800">'+(GP.on?'✅ เชื่อมต่อแล้ว: '+String(GP.id).replace(/[<>&]/g,'').slice(0,40):'⚠️ ยังไม่เจอจอย — จับคู่บลูทูธแบบ "โหมดเกมแพด" (จอยรุ่น X3/T3 ส่วนใหญ่กด HOME + X ค้างไว้ตอนเปิด) แล้วกดปุ่มใดก็ได้บนจอย 1 ครั้ง')+'</div>'
 +'<table style="width:100%;border-collapse:collapse;margin-top:8px">'+[['อนาล็อกซ้าย / ปุ่มทิศ','เดิน (ดันสุด = วิ่ง)'],['A','โจมตี (กดค้างตีต่อเนื่อง) · ต่อบทสนทนา'],['B','พุ่งหลบ · ปิดหน้าต่าง'],['X','คุย / ใช้ / เก็บของ'],['Y','ท่าไม้ตาย'],['L1 · R1 · L2 · R2','สกิล 1 · 2 · 3 · 4'],['อนาล็อกขวา ↑ · →','สกิล 5 · 6'],['อนาล็อกขวา ↓ · ←','ยาเลือด · ยามานา'],['START','เมนูหลัก'],['SELECT','กระเป๋า'],['กดอนาล็อกขวา (R3)','ขี่ / ลงสัตว์ขี่']].map(r=>'<tr><td style="padding:4px 6px;border-bottom:1px solid #ffffff18;color:#ffd86a;font-weight:800;white-space:nowrap">'+r[0]+'</td><td style="padding:4px 6px;border-bottom:1px solid #ffffff18">'+r[1]+'</td></tr>').join('')+'</table>'
 +'<div style="font-size:11px;color:#aaa;margin-top:8px">หน้าต่างร้าน/กระเป๋ายังต้องแตะจอเลือกของ · iPhone ใช้ได้กับจอยที่ iOS รองรับเท่านั้น</div></div></div>';p6open(W109)};
try{if(!PM7.some(m=>m[1]==='จอย')){const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length:at,0,['🎮','จอย',()=>open109()]);pmRender7()}}catch(e){}
}catch(e){console.warn('fix109',e)}
