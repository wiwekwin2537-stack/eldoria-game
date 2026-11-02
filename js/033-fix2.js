// fix2.js — ชุดแก้ #2 (v4.11)
//  ข้อ 24 โคมไฟไม่บังป้ายร้าน (แก้ที่ LAMP_DATA ใน b46) · ข้อ 21 กระเป๋าร้านชำต่างสี/ขนาดตามระดับ · ข้อ 6,7 ดันเจี้ยนรอบเดียวกัน = แผนที่เดียวกัน
// =====================================================================
// ---------- ดันเจี้ยน: แผนที่ขึ้นกับ "รอบเวลา" 15 นาที ไม่ใช่วินาทีที่กดเข้า — เพื่อนเข้าในรอบเดียวกันได้แผนที่เดียวกัน ----------
window.DGROUND8=()=>Math.floor(srvNow()/900000);
window.DGSEED8=f=>DGROUND8()*7919+(f|0)*131;
{const _ed2=enterDg;enterDg=function(f){_ed2(f);if(!D||!D.dg)return;const left=Math.max(1,Math.ceil((900000-srvNow()%900000)/60000)),rid=(DGROUND8()%9000+1000);
  setTimeout(()=>{try{if(D&&D.dg===f)say('🗺️ แผนที่รอบ #'+rid+' — เพื่อนที่เข้าชั้นนี้ในรอบเดียวกันจะได้แผนที่เหมือนกัน (เปลี่ยนรอบในอีก ~'+left+' นาที)')}catch(e){}},2500)}}
// ---------- เหมือง: ผังตายตัวต่อเหมืองอยู่แล้ว (seed คงที่) — ล้างแคชตอนเข้าใหม่ให้ได้ผังเดิมแน่นอนเสมอ ----------
// ---------- ไอคอนกระเป๋าร้านชำ: ใบเล็ก=ผ้าใบน้ำตาล · กลาง=หนังเขียว · ใหญ่=ม่วงขอบทองและใหญ่กว่า ----------
const BAGSTY8=[{id:'bagup1',body:'#c9a66b',dk:'#8a6a3a',flap:'#b08a4d',trim:'#6a4a22',s:.62},{id:'bagup2',body:'#4f8a4a',dk:'#2c5a2c',flap:'#3f7340',trim:'#d6c27a',s:.8},{id:'bagup3',body:'#6c3fb8',dk:'#43237a',flap:'#5a30a0',trim:'#ffd34a',s:1}];
function bagIcon8(st){const c=document.createElement('canvas');c.width=c.height=64;const k=c.getContext('2d'),s=st.s,cx=32,by=58,w=40*s,h=44*s;
 k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(cx,by,w*.6,4,0,0,7);k.fill();
 const rr=(x,y,ww,hh,r)=>{k.beginPath();k.moveTo(x+r,y);k.arcTo(x+ww,y,x+ww,y+hh,r);k.arcTo(x+ww,y+hh,x,y+hh,r);k.arcTo(x,y+hh,x,y,r);k.arcTo(x,y,x+ww,y,r);k.closePath()};
 k.strokeStyle=st.dk;k.lineWidth=3;k.beginPath();k.arc(cx,by-h-1,w*.22,Math.PI,0);k.stroke();           // หูหิ้ว
 k.fillStyle=st.body;rr(cx-w/2,by-h,w,h,8*s);k.fill();k.strokeStyle=st.dk;k.lineWidth=2;k.stroke();     // ตัวกระเป๋า
 k.fillStyle=st.flap;rr(cx-w/2,by-h,w,h*.42,8*s);k.fill();k.stroke();                                    // ฝา
 k.fillStyle=st.trim;k.fillRect(cx-3,by-h*.62,6,8*s+2);                                                   // หัวเข็มขัด
 k.fillStyle=st.dk;rr(cx-w*.3,by-h*.3,w*.6,h*.22,3);k.fill();k.strokeStyle=st.trim;k.lineWidth=1.5;k.stroke(); // กระเป๋าหน้า
 if(st.s>=1){k.fillStyle=st.trim;for(const dx of[-1,1]){k.beginPath();k.arc(cx+dx*w*.36,by-h*.82,2.4,0,7);k.fill()}}
 return c}
{const _mi2=matIcon;matIcon=function(key){const st=BAGSTY8.find(b=>b.id===key);if(st)return bagIcon8(st);return _mi2(key)}}
{const d=Object.getOwnPropertyDescriptor(SD2.store,'buy'),g=d&&d.get;if(g)Object.defineProperty(SD2.store,'buy',{configurable:true,get(){return g.call(this).map(b=>/^bagup\d$/.test(b.id)?Object.assign({},b,{mat:b.id}):b)}})}

// =====================================================================
