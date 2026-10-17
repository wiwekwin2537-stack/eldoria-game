// เมนูตั้งค่า · แผนที่วงกลม · ขนาดภาพ
function fitView(){const w=innerWidth||640,h=innerHeight||448;if(w>=h){VH=Math.max(448,Math.min(640,Math.round(h/1.6)));VW=Math.round(VH*w/h)}else{VW=Math.max(360,Math.min(560,Math.round(w/1.6)));VH=Math.round(VW*h/w)}}
function applyRes(){fitView();RES=+SET.res;cv.width=Math.round(VW*RES);cv.height=Math.round(VH*RES)}
addEventListener('resize',()=>applyRes());addEventListener('orientationchange',()=>setTimeout(applyRes,200));
applyRes();
const menuEl=document.createElement('div');menuEl.id='menu';menuEl.hidden=true;
menuEl.innerHTML='<b>⚙️ ตั้งค่าเกม</b>'
 +`<b class="sec">🎮 ปุ่มควบคุม</b>`
 +`<label>ปุ่มบนจอ<select data-s="ctl"><option value="joy">จอยสติ๊ก</option><option value="dpad">ปุ่มลูกศร</option><option value="kbd">ซ่อน (ใช้คีย์บอร์ด)</option></select></label>`
 +`<div id="joyopts"><label>แบบจอย<select data-s="joyMode"><option value="float">ลอยตามนิ้ว</option><option value="fixed">ตายตัวมุมจอ</option></select></label>`
 +`<label>ฝั่งจอย<select data-s="joySide"><option value="left">ซ้าย</option><option value="right">ขวา</option></select></label>`
 +`<label>ขนาดจอย<input type="range" min="80" max="170" step="5" value="${SET.joySize}" data-n="joySize"></label>`
 +`<label>ความโปร่งใส<input type="range" min="0.2" max="1" step=".05" value="${SET.joyOp}" data-n="joyOp"></label>`
 +`<label>ดันสุดขอบ = วิ่ง<input type="checkbox" data-c="joyRun" ${SET.joyRun?'checked':''}></label></div>`
 +`<label>ปุ่มวิ่งคีย์บอร์ด<select data-s="runKey"><option value="ctrl">Ctrl</option><option value="c">C</option></select></label>`
 +'<b class="sec">🔊 เสียง / ภาพ</b>'+[['master','เสียงรวม'],['music','ดนตรี'],['sfx','เอฟเฟกต์']].map(([k,n])=>`<label>${n}<input type="range" min="0" max="1" step=".05" value="${SET[k]}" data-k="${k}"></label>`).join('')
 +[['minimap','แผนที่วงกลม'],['grass','หญ้าโยกตามลม'],['grade','แสงเงา/โทนภาพ'],['fps','แสดง FPS']].map(([k,n])=>`<label>${n}<input type="checkbox" data-c="${k}" ${SET[k]?'checked':''}></label>`).join('')
 +`<label>ความละเอียด<select data-r><option value="1">ปกติ</option><option value="1.5">สูง</option><option value="2">สูงมาก</option></select></label>`
 +`<button class="mini" id="fsb">⛶ เต็มจอ</button><button class="mini" id="dbg">📍 โชว์พิกัดต้นไม้</button><button class="mini" id="cp">📋 คัดลอกพิกัด</button><button class="mini" id="resume">▶ เล่นต่อ</button><small>เดิน WASD/ลูกศร · <b>Shift</b> พุ่ง (ใช้มานา) · <b>Ctrl</b> วิ่ง · J โจมตี/ใช้ของ · E คุย/เปิดประตู · 4/T ม้วนวาปกลับเมือง · 1/2/3/Q เปลี่ยนของ · I กระเป๋า · M เสียง · Esc เมนู</small>`;
document.getElementById('wrap').appendChild(menuEl);menuEl.querySelector('[data-r]').value=String(SET.res);for(const s of menuEl.querySelectorAll('[data-s]'))s.value=SET[s.dataset.s];
const joyOptsEl=menuEl.querySelector('#joyopts'),syncJoyOpts=()=>{joyOptsEl.style.display=SET.ctl==='joy'?'':'none'};syncJoyOpts();
menuEl.oninput=e=>{const k=e.target.dataset.k,n=e.target.dataset.n;if(k){SET[k]=+e.target.value;auVol();saveSet()}if(n){SET[n]=+e.target.value;saveSet();applyCtl()}};
menuEl.onchange=e=>{const c=e.target.dataset.c,s=e.target.dataset.s;if(c){SET[c]=e.target.checked;saveSet();if(c==='joyRun')applyCtl()}if(s){SET[s]=e.target.value;saveSet();keys.ctrl=0;applyCtl();syncJoyOpts()}if('r' in e.target.dataset){SET.res=+e.target.value;applyRes();saveSet()}};
document.getElementById('resume').onclick=()=>toggleMenu();
function toggleMenu(){menuEl.hidden=!menuEl.hidden;PAUSED=!menuEl.hidden;sfx('ui')}
// แผนที่วงกลม
const mini=document.getElementById('mini'),MX=mini.getContext('2d');let MI=null,MINIW=null;
function mkMini(src,w,h,ppt){const c=document.createElement('canvas');c.width=w*ppt;c.height=h*ppt;c.getContext('2d').drawImage(src,0,0,c.width,c.height);MI={src:c,s:ppt/T}}
function setMini(m){MI=m}
{const c=document.createElement('canvas'),k=c.getContext('2d'),pp=3;c.width=W*pp;c.height=H*pp;const col={[GRASS]:'#5a9a45',[WATER]:'#2f6fb5',[SAND]:'#d8c880',[TREE]:'#2f6a2c',[ORE]:'#5ec8ff',[DOOR]:'#6a6a70',[WARP]:'#b48cff',[TOWNGATE]:'#7fe0ff'};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){k.fillStyle=col[map[y][x]]||'#5a9a45';k.fillRect(x*pp,y*pp,pp,pp)}MINIW=MI={src:c,s:pp/T}}
function drawMini(){if(!SET.minimap){mini.style.display='none';return}mini.style.display='';const k=MX,R=56;k.setTransform(2,0,0,2,0,0);k.clearRect(0,0,112,112);k.save();k.beginPath();k.arc(R,R,R-2,0,7);k.clip();k.fillStyle='#10202e';k.fillRect(0,0,112,112);
 if(MI)k.drawImage(MI.src,R-P.x*MI.s,R-P.y*MI.s);
 const dot=(wx,wy,c,r,pin)=>{let dx=(wx-P.x)*MI.s,dy=(wy-P.y)*MI.s;const d=Math.hypot(dx,dy),lim=R-8;if(d>lim){if(!pin)return;dx*=lim/d;dy*=lim/d}k.fillStyle=c;k.beginPath();k.arc(R+dx,R+dy,r,0,7);k.fill();k.strokeStyle='#000b';k.lineWidth=1;k.stroke()};
 if(!D){dot(CV.tx*T+16,3*T+20,'#ff9a3a',4,1);dot(WC.x,WC.y,'#7fe0ff',4,1);for(const s of slimes)dot(s.x,s.y,'#4aa8ff',2,0)}
 else if(D.shop){dot((IW>>1)*T,(IH-1)*T+16,'#7fe0ff',4,1);for(const n of D.npcs)dot(n.x,n.y,'#ffd84a',3,0)}
 else if(D.town){dot(T/2,17*T,'#7fe0ff',4,1);for(const n of D.npcs)dot(n.x,n.y,'#ffd84a',2,0);for(const c of D.carts)dot(c.x,c.y,'#c98b4a',3,0)}
 else{dot(10.5*T,14.5*T,'#7fe0ff',4,1);dot(10.5*T,2.5*T,'#ffd23a',4,1);for(const s of slimes)dot(s.x,s.y,'#4aa8ff',2,0)}
 k.translate(R,R);k.rotate({u:0,r:Math.PI/2,d:Math.PI,l:-Math.PI/2}[P.dir]);k.fillStyle='#fff';k.strokeStyle='#000';k.lineWidth=1;k.beginPath();k.moveTo(0,-6);k.lineTo(4.5,5);k.lineTo(0,2.5);k.lineTo(-4.5,5);k.closePath();k.fill();k.stroke();k.restore();
 k.setTransform(2,0,0,2,0,0);k.fillStyle='#fff';k.font='bold 9px system-ui';k.fillText('N',R-3,11)}
