// =====================================================================
// fix137 (v5.03) — ที่ดินผู้กล้าถูกเลิกใช้แล้ว แต่ยังมีของค้าง (เจ้าของแจ้ง 2026-10-16)
//  A) "บ้านของคุณ" ในเมือง: กด 🔨 สร้าง/อัปเกรด → เดิมขึ้น "ไปที่ที่ดินผู้กล้าก่อนนะ" (ทางตัน · บทส่งท้ายทำไม่ได้) + ต้องใช้ค้อน (ถูกลบแล้ว)
//     → สร้าง/อัปเกรดได้ที่หน้าบ้านเลย ใช้วัตถุดิบ+เหรียญเท่าเดิม ไม่ต้องใช้ค้อน · คู่ครอง (แต่งงานแล้ว) อยู่ที่บ้านนี้ คุย/รับอาหารเช้าได้
//  B) ข้อความทุกจุดที่ยังพูดถึงที่ดิน/ฟาร์ม/ค้อน → แก้ให้ตรง (คู่มือ · ที่มาของไอเท็ม · ฉากแต่งงาน · ข้อความระบบ)
//  C) โรงเตี๊ยมแน่น: ครอบครัวบุญมี+บรูโน่ (fix115 ให้ไปนอนโรงเตี๊ยม) → "บ้านพักชาวเมือง" (เดิมคลังสมบัติ หัวเมืองข้างหอคอย ซ้ำกับธนาคาร)
//     กลางคืนเดินเข้าบ้านพัก · โรงเตี๊ยมเหลือแค่นักดื่ม/นักเดินทาง · ฝากของย้ายไปที่ธนาคาร (มีปุ่ม 📦 อยู่แล้ว)
// =====================================================================
try{
// ---------- C) บ้านพักชาวเมือง ----------
try{const W=(window.SD||SHOP_DATA).ware||SHOP_DATA.ware;if(W){W.name='บ้านพักชาวเมือง';W.emoji='🏘️';if(W.owner)W.owner.name='ป้าจันทร์ แม่บ้านประจำบ้านพัก'}}catch(e){}
try{SIGN_ICONS.ware=k=>{k.lineJoin='round';k.fillStyle='#c86a3a';k.strokeStyle='#3a1a08';k.lineWidth=2.5;k.beginPath();k.moveTo(-14,-2);k.lineTo(0,-14);k.lineTo(14,-2);k.closePath();k.fill();k.stroke();
  k.fillStyle='#f0dcb0';k.fillRect(-10,-2,20,14);k.strokeRect(-10,-2,20,14);k.fillStyle='#6a4020';k.fillRect(-3,4,6,8);k.fillStyle='#ffe08a';k.fillRect(-8,1,4,4);k.fillRect(4,1,4,4)}}catch(e){}
try{const H=window.HOMES81||(window.W81&&W81.HOMES81);if(H){H.A.door='ware';H.B.door='ware';H.A.n='บ้านพักชาวเมือง';H.B.n='บ้านพักชาวเมือง'}}catch(e){}
const sleepers=()=>{try{return (D&&D.npcs||[]).filter(n=>n.l81&&n.l81.hid==='home'&&(n.l81.h==='A'||n.l81.h==='B'))}catch(e){return []}};
{const _es=enterShop;enterShop=function(id){if(id==='ware'){const z=sleepers(),night=(typeof night48==='function'&&night48());
  talk({name:'ป้าจันทร์ แม่บ้านประจำบ้านพัก',c:'#a86a3a'},'🏘️ บ้านพักชาวเมือง — ครอบครัวบุญมีกับครอบครัวบรูโน่พักอยู่ที่นี่\n'+(night&&z.length?'💤 ตอนนี้ดึกแล้ว ทุกคนหลับกันอยู่ '+z.length+' คน — เบา ๆ หน่อยนะจ๊ะ':'กลางวันพวกเขาออกไปทำงานกันหมด ตกค่ำถึงจะกลับมา')+'\n📦 ถ้าจะฝากของ ไปที่ธนาคารเอลโดเรีย (ฝั่งล่างของเมือง) ได้เลยจ้ะ',[BYE],'🏘️ บ้านพักชาวเมือง');return}
  return _es.apply(this,arguments)};window.enterShop=enterShop}
// ---------- A) บ้านของคุณ: สร้าง/อัปเกรดในเมือง ----------
const benefit=lv=>'นอนพัก (18:00–05:00) ได้บัฟค่าพลังทุกอย่าง +'+lv+' นาน 10 นาที';
function houseBuild137(){const h=HOME.house|0,nx=HOUSE[h+1];
 if(!nx){talk({name:'บ้านของคุณ',c:'#8a5a2a'},'🏰 '+HOUSE[h].n+' — บ้านของเจ้าดีที่สุดในแผ่นดินแล้ว!\n'+benefit(h),[BYE],'🏠 บ้านของคุณ');return}
 const ok=costOK(nx.c),cost=Object.entries(nx.c).map(([k,v])=>(k==='coin'?'🪙':MN(k)+' ')+v.toLocaleString()+' (มี '+((inv[k]|0).toLocaleString())+')').join(' · ');
 talk({name:'บ้านของคุณ',c:'#8a5a2a'},(h?'ตอนนี้: '+HOUSE[h].n+'\n':'')+'🔨 '+(h?'อัปเกรดเป็น ':'ซ่อมแซมเป็น ')+nx.n+' (ขั้น '+(h+1)+'/'+(HOUSE.length-1)+')\nใช้: '+cost+'\nได้: '+benefit(h+1)+(ok?'':'\n⚠️ วัตถุดิบยังไม่พอ'),
  [...(ok?[{t:'🔨 สร้าง '+nx.n,c:'go',f:()=>{if(!costOK(nx.c))return;payCost(nx.c);HOME.house=h+1;saveHome();try{refreshInv();saveGame(true)}catch(e){}shake(3,.4);sfx('chest');
     try{banner('🏠 '+nx.n+' สร้างเสร็จ!',h===0?'บ้านหลังแรกของผู้กล้า':'อัปเกรดบ้านเรียบร้อย','green')}catch(e){}try{for(let i=0;i<40;i++)rfxP(5.5*T+(Math.random()-.5)*120,6*T-Math.random()*60,(Math.random()-.5)*90,-60-Math.random()*80,1.1,i%2?'255,220,120':'255,255,255',2.4,'spark')}catch(e){}}}]:[]),BYE],'🏠 บ้านของคุณ')}
window.houseBuild137=houseBuild137;
{const _ol=openLife;openLife=function(tab){if(!(D&&D.home)&&(tab==='house'||tab==='farm'||tab==='deco')){houseBuild137();return}return _ol.apply(this,arguments)};window.openLife=openLife}
/* คู่ครองอยู่ที่บ้านของคุณ (เดิมยืนอยู่ในที่ดิน ซึ่งไม่มีแล้ว) */
{const _hm=houseMenu;houseMenu=function(){const r=_hm.apply(this,arguments);try{if(HOME.spouse&&DLG.open&&typeof spouseTalk==='function'&&!DLG.ch.some(c=>c.sp137)){const R=ROM[HOME.spouse];DLG.ch.unshift({t:'💍 คุยกับ'+((R&&R.dn)||'คู่ครอง'),c:'go',sp137:1,f:()=>{spouseTalk();return false}});try{dlgShowChoices()}catch(e){}}}catch(e){}return r};window.houseMenu=houseMenu}
// ---------- B) ข้อความ ----------
const FIX=[[/ที่บ้านในที่ดินผู้กล้า/g,'ที่บ้านของคุณในเมือง'],[/สร้างบ้านหลังแรกในที่ดินผู้กล้าแล้ว!/g,'สร้างบ้านหลังแรกแล้ว!'],[/ฝากของได้ที่ "คลังสมบัติ" \(หัวเมืองฝั่งขวา\) · ธนาคาร · หรือที่ดินของคุณ/g,'ฝากของได้ที่ธนาคารเอลโดเรีย (คุยกับคุณธนา → 📦 ฝากของ)'],
 [/ใส่ค้อนในช่องลัดแล้วกดโจมตีเพื่อเปิดเมนูสร้าง/g,'กด E ที่ป้ายหน้าบ้านเพื่อสร้าง/อัปเกรด'],[/\(ปลูกในที่ดินผู้กล้า\)/g,''],[/ลุงบุญมี \(ที่ดินผู้กล้า\) หรือ/g,''],[/<b>คลังสมบัติ<\/b> ฝากของ/g,'<b>ธนาคาร</b> ฝากของด้วย'],[/<b>ที่ดินผู้กล้า<\/b> ปลูกผัก\/เลี้ยงสัตว์ \(ประตูมิติในทุ่งหญ้า\) · /g,'<b>บ้านของคุณ</b> (หลังคาเขียว มุมซ้ายบน) สร้าง/อัปเกรด นอนรับบัฟ · ']];
const fx=s=>{if(typeof s!=='string')return s;for(const [a,b] of FIX)s=s.replace(a,b);return s};window.fixTxt137=fx;
/* say เป็น const แก้ทับไม่ได้ → แก้ข้อความที่แถบข้อความ (#msg) แทน */
try{const me=gid('msg');if(me)new MutationObserver(()=>{try{const t=me.textContent,f=fx(t);if(f!==t)me.textContent=f}catch(e){}}).observe(me,{childList:true,characterData:true,subtree:true})}catch(e){}
try{const _t=talk;talk=function(n,txt,ch,name){if(Array.isArray(ch))for(const c of ch)if(c&&typeof c.t==='string')c.t=fx(c.t);return _t.call(this,n,fx(txt),ch,name)};window.talk=talk}catch(e){console.warn('137 talk',e)}
try{const _c=cinePlay;cinePlay=function(L,done){try{if(Array.isArray(L))L=L.map(x=>x&&typeof x.t==='string'?Object.assign({},x,{t:fx(x.t)}):x)}catch(e){}return _c.call(this,L,done)};window.cinePlay=cinePlay}catch(e){console.warn('137 cine',e)}
try{const _b=banner;banner=function(a,b,c){return _b.call(this,fx(a),fx(b),c)};window.banner=banner}catch(e){console.warn('137 banner',e)}
try{for(const k in INVMETA)if(Array.isArray(INVMETA[k])&&typeof INVMETA[k][1]==='string')INVMETA[k][1]=INVMETA[k][1].replace(/ · ใส่ช่องลัดแล้วกดโจมตีเพื่อใช้ · อัปเกรดได้ที่เมนูส.*$/,'').replace(/\s*\(ใช้ได้ในที่ดินผู้กล้า\)/,'')}catch(e){}
try{const _s7=src7;src7=function(k){let S=[];try{S=_s7.apply(this,arguments)||[]}catch(e){}return S.filter(x=>!/ที่ดินผู้กล้า|ร้านฟาร์ม/.test(String(x&&x[1]))).map(x=>[x[0],String(x[1]).replace('ตกปลา (บ่อในที่ดิน/แหล่งน้ำ)','ตกปลาที่ริมน้ำ')])};window.src7=src7}catch(e){console.warn('137 src',e)}
/* คู่มือ 📖: หัวข้อที่ดินผู้กล้า (ฟาร์ม) เลิกใช้ → แทนด้วยบ้านของคุณ */
try{const gw=gid('gb66');if(gw)new MutationObserver(()=>{try{for(const d of gw.querySelectorAll('details')){const sm=d.querySelector('summary');if(!sm||d.f137)continue;d.f137=1;
  if(/ที่ดินผู้กล้า \(ฟาร์ม\)/.test(sm.textContent)){sm.textContent='🏠 บ้านของคุณ';const b=d.querySelector('div,p,small')||d;if(b!==d)b.innerHTML='บ้านหลังคาเขียว <b>มุมซ้ายบนของเมืองเอลโดเรีย</b> (ได้หลังจบบท 13) · กด E ที่ป้ายหน้าบ้าน → <b>🔨 สร้าง/อัปเกรด</b> ใช้วัตถุดิบ+เหรียญ (7 ขั้น กระท่อม → ปราสาทเพชร) · นอนพัก 18:00–05:00 ได้บัฟค่าพลังทุกอย่างตามขั้นบ้าน · แต่งงานแล้วคู่ครองอยู่บ้านนี้'}
  else d.innerHTML=fx(d.innerHTML)}}catch(e){}}).observe(gw,{childList:true,subtree:true})}catch(e){}
/* ป้ายชื่อบ้านพักวาดลงแผนที่เมืองตอนสร้างเมือง (สร้างไปก่อนสคริปต์นี้โหลด) → สร้างใหม่ 1 ครั้งเมื่ออยู่ในเมือง */
try{const _bt=buildTown;buildTown=function(){const r=_bt.apply(this,arguments);try{dcv._v137=1}catch(e){}return r};window.buildTown=buildTown}catch(e){console.warn('137 bt',e)}
{const rb=()=>{try{if(!D||!D.town||D.shop||D.city2||!dcv||dcv._v137)return;const x=P.x,y=P.y,dr=P.dir;buildTown();mkMini(dcv,TW,TH,2.6);P.x=x;P.y=y;P.dir=dr}catch(e){console.warn('fix137 rebuild',e)}};setInterval(rb,700)}
}catch(e){console.warn('fix137',e)}
