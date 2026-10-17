// fix105 (v4.90) — 🔥 แก้บั๊กที่เจ้าของเจอ 2026-10-14 19:07
//  A) ชุดหายหลังรีเฟรช: ตอนเปิดเกม loadGame ทำงานก่อนสคริปต์ท้าย ๆ สร้างไอเท็ม (ชุดบอส fix59 ระดับ 12–16 และชุดเมือง 2 fix101 ระดับ 17–21)
//     → ไอเท็มถูกพักไว้ แล้วตัวคืนของ (fixz) ก็ยังหาไม่เจอ → ทิ้ง → เซฟทับ = ชุดหาย
//     แก้: ท้ายสุดของไฟล์ อ่านเซฟดิบจาก localStorage อีกรอบ แล้วคืนชุดที่สวม/ของในกระเป๋าที่ตอนนี้มีใน ITEMS แล้วแต่หายไป
//  B) แตะ "ไม้" (หรือวัตถุดิบจากต้นไม้) ในกระเป๋าแล้วเกมค้าง ~1 นาที: ปุ่ม "📍 หาได้จากที่ไหน" (src7 → zonesWith90 ของ fix90)
//     สร้างแมพทุกแมพใหม่ทั้งหมดเพื่อหาว่ามีต้นไม้ชนิดไหน (ป่าหมอก/ภูเขาไฟช้ามาก) แถมเปลี่ยน ZW/ZH ของแมพที่ยืนอยู่
//     แก้: ใช้ตารางชนิดต้นไม้/แร่ของแต่ละแมพที่คำนวณไว้แล้ว (TK105) ไม่สร้างแมพจริง · เก็บ/คืน ZW ZH ทุกครั้ง
try{
// ---------- A) คืนชุดที่หายตอนโหลด ----------
try{const d=JSON.parse(localStorage.getItem(SAVEK)||'null');if(d&&d.v===1){let ch=0;const back=[];
  if(d.armor)for(const k in d.armor){const id=d.armor[k];if(id&&ITEMS[id]&&!P.armor[k]){P.armor[k]=id;ch=1;back.push(id)}}
  if(d.gear)for(const id in d.gear){if(ITEMS[id]&&!(id in GEAR)&&!Object.values(P.armor).includes(id)){GEAR[id]=d.gear[id];ch=1;back.push(id)}}
  if(ch){window.BACK105=back;try{syncSword()}catch(e){}try{recalcStats()}catch(e){}try{applyBonus()}catch(e){}try{ptDirty()}catch(e){}try{refreshInv()}catch(e){}try{renderBag()}catch(e){}}}}catch(e){console.warn('fix105 back',e)}
// ---------- B) "หาได้จากที่ไหน" ไม่สร้างแมพใหม่ ----------
const TK105={iron:['stone','iron'],copper:['copper','iron','stone'],silver:['silver','copper','iron'],gold:['gold','silver','copper'],diamond:['diamond','silver','gold'],mist:['treeE'],volcano:['treeF','treeE'],shadow:['treeS','treeF'],heaven:['treeS','treeH'],throne:['treeG','treeH'],grove:['treeN','treeE'],creek:['treeE','treeN'],pine:['treeE','treeN'],rage:['treeG']};
let SRC105=0;
{const _g=genZone;genZone=function(zi){if(SRC105){const Zd=ZONES[zi];if(ZCACHE[zi])return ZCACHE[zi];const L=Zd&&TK105[Zd.id];return {ores:(L||[]).map(kind=>({kind}))}}return _g.apply(this,arguments)};window.genZone=genZone}
{const _s=src7;src7=function(){const w=ZW,h=ZH;SRC105=1;try{return _s.apply(this,arguments)}finally{SRC105=0;ZW=w;ZH=h}};window.src7=src7}
// ---------- C) มือถือ: หมุนจอเป็นแนวนอนเอง (เจ้าของขอ 19:07) ----------
//  เดิม: ล็อกแนวนอนแค่ครั้งแรกที่แตะ (once) ถ้าออกจากเต็มจอ/ล็อกไม่ติด ก็ค้างที่หน้า "กรุณาหมุนเครื่อง"
//  ใหม่: ทุกครั้งที่แตะจอขณะยังไม่เต็มจอหรือยังเป็นแนวตั้ง → ขอเต็มจอ + ล็อกแนวนอนอีกครั้ง (Android Chrome/PWA หมุนให้เอง)
//        หน้า "กรุณาหมุนเครื่อง" มีปุ่มแตะเพื่อหมุน · กลับเข้าแอปก็ล็อกใหม่ · iPhone (Safari) ระบบไม่อนุญาตให้เว็บล็อกจอ จึงยังขึ้นหน้าบอกให้หมุน
if(COARSE){
 const fsOn=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
 const lock=()=>{try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(_){}};
 const go105=()=>{const e=document.documentElement;try{if(!fsOn()&&(e.requestFullscreen||e.webkitRequestFullscreen)){const p=(e.requestFullscreen||e.webkitRequestFullscreen).call(e,{navigationUI:'hide'});Promise.resolve(p).then(lock,lock)}else lock()}catch(_){lock()}};
 window.go105=go105;
 let off105=false;const fch=()=>{if(!fsOn()&&innerWidth>=innerHeight)off105=true;else if(fsOn())off105=false};document.addEventListener('fullscreenchange',fch);document.addEventListener('webkitfullscreenchange',fch);
 addEventListener('pointerdown',()=>{if(innerHeight>innerWidth||(!fsOn()&&!off105))go105()},true);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&fsOn())lock()});
 try{const r=document.getElementById('rot');if(r&&!r.querySelector('.go105')){r.insertAdjacentHTML('beforeend','<button class="go105" style="font:bold 17px system-ui,\'Noto Sans Thai\',sans-serif;padding:12px 22px;border-radius:12px;border:2px solid #e8c14a;background:#2a1f3d;color:#ffe08a">📱 แตะเพื่อหมุนจอเป็นแนวนอน</button><small class="ios105" style="opacity:.6">iPhone: ปิดล็อกการหมุนจอในศูนย์ควบคุม แล้วหมุนเครื่อง</small>');r.querySelector('.go105').addEventListener('click',go105)}}catch(_){}
}
}catch(e){console.warn('fix105',e)}
