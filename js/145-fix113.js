// fix113 (v4.95) — 🐲 แท่นผนึกอสูรย้ายมาอยู่ในเมือง + ผู้เฝ้าแท่นผนึก + หน้าต่างบอสใหม่ (เจ้าของขอ 2026-10-14 21:55)
//  เดิม: เข้าแท่นผนึกจากเมนูหอคอย (fix62 openAltar62 เป็นบทสนทนาตัวหนังสือยาว) → v4.96: "หอผนึกอสูร" บ้านหลังคาม่วงแถวบนของเมือง เดินเข้าประตูได้ ข้างในมีแท่นผนึก+ผู้เฝ้า
//  มี NPC "ผู้เฝ้าแท่นผนึก" คุยแล้วเปิดหน้าต่างใหม่: การ์ดบอสทีละตัว มีรูปบอส ชื่อ เลเวล ค่าท้า ตราที่มี คูลดาวน์ วิธีสู้ ชุดที่ดรอป · ปุ่มท้าสู้ / แลกตรา
//  ระบบสู้/รางวัลยังเป็นของ fix62 เดิม (enter62, pickPiece62) — แค่เปลี่ยนทางเข้าและหน้าตา
try{
// ---------- หอผนึกอสูร = บ้านว่างหลังคาม่วง (9,4) — มีห้องข้างใน (ปรับ v4.96 ตามเจ้าของ: "ย้ายแท่นเข้าบ้านที่ว่าง / ทำเป็นสถานที่ผนึกจริงๆ") ----------
// เดิม v4.95 วางแท่นบนลานดินตะวันออกเฉียงใต้ (ทับลานฝึก) → เลิกใช้ ย้ายเข้าบ้านว่างที่เป็นของตกแต่ง (DECO 'house2',9,4) ทำเป็นร้านแบบมีห้อง 'seal113'
SHOP_DATA.seal113={name:'หอผนึกอสูร',emoji:'🔮',icon:'book',img:'house2',b:[9,4,5,4],door:{x:62,w:36,t:74,bt:126},sign:{x:128,y:84,arm:24},
 owner:{name:'ผู้เฝ้าแท่นผนึก',c:'#3a2a5a',h:'#1a1020',g:'m',age:'old',beard:1,greet:['อสูรทั้งหกหลับใหลในคริสตัลนี้…','เจ้ามาเพื่อท้าอสูรหรือ?'],lines:['แตะ E ที่ข้าหรือที่แท่นผนึก เพื่อเลือกบอส','ตราอสูร 10 อัน แลกชิ้นชุดบอสได้']},
 solid:[[7,6],[8,6],[7,7],[8,7]],sell:[],buy:[]};
if(!SHOP_ORDER.includes('seal113'))SHOP_ORDER.push('seal113');
SHOP_ART.seal113=function(k){SHOP_ART.skill(k);const W_=IW*T,H_=IH*T;k.fillStyle='rgba(30,6,50,.42)';k.fillRect(0,0,W_,H_)};
try{SHOP_TINT.seal113='rgba(60,20,90,.10)'}catch(e){}
SHOP_ANIM.seal113=function(t){const x=8*T,y=7*T+10,pu=.5+.5*Math.sin(t*2);ctx.save();
 ctx.strokeStyle='rgba(180,120,255,'+(.45+.2*pu)+')';ctx.lineWidth=2;for(const r of [70,56]){ctx.beginPath();ctx.ellipse(x,y+16,r,r*.42,0,0,7);ctx.stroke()}ctx.fillStyle='rgba(200,160,255,.8)';ctx.font='bold 12px system-ui';ctx.textAlign='center';for(let i=0;i<8;i++){const a=i*Math.PI/4+t*.3;ctx.fillText('ᛟᚱᛉᚦᛗᛞᚹᛜ'[i],x+Math.cos(a)*63,y+20+Math.sin(a)*26)}
 for(const sx of [-1,1]){const px=x+sx*120,py=5*T;ctx.fillStyle='#3a3448';ctx.fillRect(px-10,py,20,3*T);ctx.fillStyle='#4a4458';ctx.fillRect(px-13,py-6,26,8);ctx.fillRect(px-13,py+3*T-4,26,8);ctx.strokeStyle='#14101e';ctx.lineWidth=1;ctx.strokeRect(px-10,py,20,3*T);ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(180,120,255,'+(.25+.2*pu)+')';ctx.beginPath();ctx.arc(px,py-8,7,0,7);ctx.fill();ctx.globalCompositeOperation='source-over'}
 ctx.globalCompositeOperation='lighter';const g0=ctx.createRadialGradient(x,y,0,x,y,110);g0.addColorStop(0,'rgba(150,80,255,'+(.22+.1*pu)+')');g0.addColorStop(1,'rgba(150,80,255,0)');ctx.fillStyle=g0;ctx.fillRect(x-110,y-110,220,220);ctx.globalCompositeOperation='source-over';
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y+22,40,11,0,0,7);ctx.fill();
 const g=ctx.createLinearGradient(0,y-20,0,y+20);g.addColorStop(0,'#6a6478');g.addColorStop(1,'#2e2a3a');ctx.fillStyle=g;ctx.strokeStyle='#14101e';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(x-36,y+20);ctx.lineTo(x-28,y-8);ctx.lineTo(x+28,y-8);ctx.lineTo(x+36,y+20);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#4a4458';ctx.fillRect(x-32,y-16,64,9);ctx.strokeRect(x-32,y-16,64,9);
 ctx.fillStyle='rgba(200,150,255,'+(.5+.4*pu)+')';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('ᚱ ᛉ ᛟ ᚦ ᛗ',x,y+8);
 const fy=y-52+Math.sin(t*1.6)*4;ctx.globalCompositeOperation='lighter';const gl=ctx.createRadialGradient(x,fy,0,x,fy,44);gl.addColorStop(0,'rgba(190,120,255,.6)');gl.addColorStop(1,'rgba(190,120,255,0)');ctx.fillStyle=gl;ctx.fillRect(x-44,fy-44,88,88);ctx.globalCompositeOperation='source-over';
 const cg=ctx.createLinearGradient(x-12,fy-22,x+12,fy+22);cg.addColorStop(0,'#f4e8ff');cg.addColorStop(.5,'#a46aff');cg.addColorStop(1,'#3a1a7a');ctx.fillStyle=cg;ctx.strokeStyle='#1a0a3a';
 ctx.beginPath();ctx.moveTo(x,fy-24);ctx.lineTo(x+13,fy-3);ctx.lineTo(x,fy+22);ctx.lineTo(x-13,fy-3);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle='rgba(220,200,255,.75)';ctx.lineWidth=1.4;for(const s2 of [-1,1])for(const yy of [0,10]){ctx.beginPath();for(let i=0;i<=9;i++){const px=x+s2*(6+i*12),py=fy+yy-4+i*(5.5-yy*.2)+Math.sin(t*3+i)*1;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke()}
 for(let i=0;i<6;i++){const a=t*.8+i*Math.PI/3,px=x+Math.cos(a)*34,py=fy+Math.sin(a)*12;ctx.fillStyle='rgba(230,200,255,'+(.4+.4*Math.sin(t*3+i))+')';ctx.beginPath();ctx.arc(px,py,2,0,7);ctx.fill()}
 ctx.restore()};
{const _sa=shopAct;shopAct=function(){if(D&&D.shop==='seal113'){const o=D.owner;const nearAlt=Math.hypot(P.x-(OX+8*T),P.y-(7*T+30))<90;if(shopNear()||nearAlt){if(o){o.wave=1.2;o.bub={txt:'เลือกอสูรที่จะท้าเถิด',t:2.4}}open113();return true}}return _sa.apply(this,arguments)};window.shopAct=shopAct}
// เอาออกจากเมนูหอคอย
{const _ot=openTower10;openTower10=function(){const r=_ot.apply(this,arguments);try{if(DLG.open){const i=DLG.ch.findIndex(c=>/แท่นผนึกอสูร/.test(c.t||''));if(i>=0){DLG.ch.splice(i,1);dlgShowChoices()}}}catch(e){}return r};window.openTower10=openTower10}
// เมืองที่สร้างไปแล้วตอนโหลด → เพิ่มประตูหอผนึกเข้าไป (ครั้งหน้าสร้างเมืองจะมีเองจาก SHOP_ORDER)
setInterval(()=>{try{if(D&&D.town&&!D.shop&&D.doors&&!D.doors.some(d=>d.id==='seal113')){const S=SHOP_DATA.seal113,[bx,by,bw,bh]=S.b;D.doors.push({id:'seal113',cx:bx*T+S.door.x+S.door.w/2,cy:(by+bh)*T})}}catch(e){}},500);
// ---------- หน้าต่างบอส ----------
const W113=mk6('al113');
const css=document.createElement('style');css.textContent='#al113 .w{width:min(760px,98%);height:auto;max-height:96%}#al113 .bd{display:block!important;overflow:auto;padding:10px 12px}#al113 .in113{font-size:13px;color:#ddd;margin-bottom:8px;line-height:1.6}#al113 .in113 b{color:#ffd86a}'
+'#al113 .gr113{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}#al113 .bc113{background:linear-gradient(180deg,#241a38,#15101f);border:1px solid #a46aff66;border-radius:12px;padding:8px;display:flex;flex-direction:column;gap:5px}#al113 .bc113.lk{opacity:.6}'
+'#al113 .tp113{display:flex;gap:8px;align-items:center}#al113 canvas{width:84px;height:84px;background:radial-gradient(circle,#3a2a5a,#120c1c);border-radius:10px;flex:none}#al113 .tp113>div{text-align:left}#al113 .nm113{font-size:16px;font-weight:900;color:#fff;line-height:1.25}#al113 .lv113{font-size:13px;color:#ffd86a;font-weight:800}'
+'#al113 .tx113{text-align:left;font-size:13px;color:#e8e0f4;line-height:1.55}#al113 .tx113 span{display:block}#al113 .bt113{display:flex;gap:6px}#al113 .bt113 button{flex:1;padding:10px 6px;border-radius:10px;border:0;font-weight:900;font-size:14px;background:linear-gradient(180deg,#ffd86a,#d9a42a);color:#2a1a06}#al113 .bt113 button.g{background:#3a2a5a;color:#e8d8ff;border:1px solid #a46aff}#al113 .bt113 button:disabled{background:#2a2438;color:#777;border:0}';
document.head.appendChild(css);
function pic113(B){const c=document.createElement('canvas');c.width=c.height=168;const k=c.getContext('2d');const sv=ctx;ctx=k;try{k.save();k.translate(84,150);const z=({golem:2.6,wolf:4.4,drake:2.4})[B.f]||3;k.scale(z,z);const f=B.f;MOBDRAW[f]({f,st:'idle',mv:false,fx:1,col:B.c,F:FAM[f],boss:1,sc:1},1.4,B.c);k.restore()}catch(e){k.fillStyle='#fff';k.font='64px system-ui';k.textAlign='center';k.fillText(B.e||'🐲',84,110)}finally{ctx=sv}return c}
function open113(){if(typeof in62==='function'&&in62()){openAltar62();return}
 const cd=(typeof LBCD64!=='undefined')?LBCD64.get():{};let h='<div class="w"><div class="hd"><b>🐲 แท่นผนึกอสูร — บอสตำนาน</b><button onclick="p6close(gid(\'al113\'))">✕</button></div><div class="bd">'
 +'<div class="in113">🧙 <b>ผู้เฝ้าแท่นผนึก:</b> "อสูรทั้งหกถูกผนึกไว้ในคริสตัลนี้ จะปลดผนึกตัวไหนออกมาสู้ จ่ายค่าท้าแล้วเข้าไปได้เลย ชนะได้ <b>ตราอสูร</b> 1–2 อัน · สะสม <b>10 อัน</b> แลกชิ้นชุดบอสที่ต้องการ · มีเวลา 8 นาที หลบ <b>วงแดง</b> ให้ดี"</div><div class="gr113">';
 LB62.forEach((B,i)=>{const seal=inv['lbm'+i]|0,rem=cd[i]?cd[i]+LBCD64.ms-srvNow():0,lv=P.lv>=B.lv,setN=(window.B59&&B59[i])?B59[i].n:'';
  h+='<div class="bc113'+(lv?'':' lk')+'"><div class="tp113"><canvas data-b="'+i+'"></canvas><div><div class="nm113">'+B.e+' '+B.n+'</div><div class="lv113">Lv.'+B.lv+(lv?'':' 🔒')+'</div></div></div>'
  +'<div class="tx113"><span>💰 ค่าท้า: 🪙 '+B.cost.toLocaleString('en-US')+'</span><span>🔱 ตราอสูร: '+seal+'/10</span>'+(setN?'<span>🎁 ดรอป: ชุด'+setN+'</span>':'')+'<span>⚠️ '+(B.tip||'')+'</span>'+(rem>0?'<span style="color:#ff9a6a">🕒 พักฟื้นอีก '+Math.ceil(rem/60000)+' นาที</span>':'')+'</div>'
  +'<div class="bt113"><button '+(lv&&rem<=0&&inv.coin>=B.cost?'':'disabled')+' onclick="go113('+i+')">⚔️ ท้าสู้</button><button class="g" '+(seal>=10?'':'disabled')+' onclick="seal113('+i+')">🔱 แลกตรา</button></div></div>'});
 h+='</div></div></div>';W113.innerHTML=h;W113.querySelectorAll('canvas[data-b]').forEach(cv=>{const im=pic113(LB62[+cv.dataset.b]);cv.width=168;cv.height=168;cv.getContext('2d').drawImage(im,0,0)});p6open(W113)}
window.open113=open113;
window.go113=i=>{p6close(W113);setTimeout(()=>{try{enter62(i)}catch(e){console.warn(e)}},60)};
window.seal113=i=>{p6close(W113);setTimeout(()=>{try{pickPiece62(i)}catch(e){}},60)};
// เมนูเดิมที่เรียกแท่น (เช่นปุ่มจากที่อื่น) → ใช้หน้าต่างใหม่ เว้นตอนอยู่ในลานบอส
{const _oa=openAltar62;openAltar62=function(){if(typeof in62==='function'&&in62())return _oa.apply(this,arguments);open113()};window.openAltar62=openAltar62}
}catch(e){console.warn('fix113',e)}
