// fix21.js (v4.29) — กิลด์ผู้เล่นจริง: สร้าง/ค้นหา/ขอเข้าร่วม/อนุมัติ · ยศ หัวหน้า-รองหัวหน้า-สมาชิก · ประกาศกิลด์
// แชทกิลด์ส่งถึงเฉพาะสมาชิก · ป้าย [TAG] เหนือชื่อ · บอทกิลด์ปิดเมื่อเล่นออนไลน์
// =====================================================================
const G21={g:null,pend:[],list:null,q:'',busy:false,err:'',cf:'',loaded:false,tag:''};
const G21COST=5000;
const gOnline21=()=>{try{return !!(window.FM_ACCT&&window.CLOUD&&CLOUD.base()&&CLOUD.tok(FM_ACCT))}catch(e){return false}};
async function gApi21(op,x){if(!gOnline21())return {err:'off'};try{return await CLOUD.call('/api/guild',Object.assign({id:FM_ACCT,token:CLOUD.tok(FM_ACCT),op},x||{}),20000)||{err:'fail'}}catch(e){return {err:'fail'}}}
const GERR21={off:'ต้องล็อกอินบัญชีออนไลน์ก่อน',fail:'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง',unknown:'เซิร์ฟเวอร์ยังไม่อัปเดต',inguild:'คุณอยู่ในกิลด์แล้ว',badname:'ชื่อกิลด์ 3–16 ตัว · ป้าย (TAG) 2–4 ตัว (ไทย/อังกฤษ/ตัวเลข)',taken:'ชื่อหรือป้ายนี้มีคนใช้แล้ว',nog:'ไม่พบกิลด์นี้',full:'กิลด์เต็มแล้ว (30 คน)',perm:'คุณไม่มีสิทธิ์ทำสิ่งนี้',nouser:'ไม่พบสมาชิก',noguild:'คุณยังไม่มีกิลด์',auth:'เซสชันหมดอายุ — ล็อกอินใหม่'};
async function gLoad21(){const r=await gApi21('my');if(r.ok){G21.g=r.g;G21.pend=r.pend||[];G21.err='';G21.tag=r.g?r.g.tag:''}else G21.err=r.err;G21.loaded=true;return r}
async function gList21(){const r=await gApi21('list',{q:G21.q});if(r.ok)G21.list=r.list;else G21.err=r.err}
const gwW21=mk6('guild21');
async function openGuild21(){p6open(gwW21);gRender21();if(!gOnline21()){G21.err='off';gRender21();return}await gLoad21();if(!G21.g)await gList21();gRender21()}
window.openGuild21=openGuild21;
async function gDo21(op,x,msg){if(G21.busy)return;G21.busy=true;gRender21();const r=await gApi21(op,x);G21.busy=false;G21.cf='';
 if(!r.ok){say('🛡️ '+(GERR21[r.err]||'ทำรายการไม่สำเร็จ'));sfx('thud')}else{if('g' in r){G21.g=r.g;G21.tag=r.g?r.g.tag:''}if(msg)say(msg);sfx('ui');if(!G21.g){await gLoad21();await gList21()}else await gLoad21()}
 gRender21();return r}
window.g21=async(op,a,b)=>{
 if(op==='create'){const n=(document.getElementById('g21n')||{}).value||'',t=(document.getElementById('g21t')||{}).value||'';if(inv.coin<G21COST){say('ต้องใช้ '+G21COST.toLocaleString()+' เหรียญในการตั้งกิลด์');sfx('thud');return}
  const r=await gDo21('create',{name:n.trim(),tag:t.trim()});if(r&&r.ok){inv.coin-=G21COST;refreshInv();try{saveGame(true)}catch(e){}try{banner('🛡️ ก่อตั้งกิลด์สำเร็จ!','['+r.g.tag+'] '+r.g.name)}catch(e){}}return}
 if(op==='search'){G21.q=((document.getElementById('g21q')||{}).value||'').trim();await gList21();gRender21();return}
 if(op==='join'){const r=await gDo21('join',{gid:a});if(r&&r.ok&&r.applied)say('📨 ส่งคำขอเข้าร่วมแล้ว รอหัวหน้ากิลด์อนุมัติ');if(r&&r.joined)try{banner('🛡️ เข้าร่วมกิลด์แล้ว!','['+r.g.tag+'] '+r.g.name)}catch(e){}return}
 if(op==='cancel')return gDo21('cancel',{gid:a},'ยกเลิกคำขอแล้ว');
 if(op==='accept'||op==='reject')return gDo21(op,{mid:a},op==='accept'?'✅ รับเข้ากิลด์แล้ว':'ปฏิเสธคำขอแล้ว');
 if(op==='notice'){const v=(document.getElementById('g21no')||{}).value||'';return gDo21('set',{notice:v},'📌 บันทึกประกาศกิลด์แล้ว')}
 if(op==='open')return gDo21('set',{open:!G21.g.open},G21.g.open?'🔒 ตั้งเป็น "ต้องขออนุมัติ" แล้ว':'🔓 เปิดให้เข้าร่วมได้ทันทีแล้ว');
 // ปุ่มที่ต้องยืนยัน 2 ครั้ง
 const key=op+':'+(a||'')+':'+(b||'');if(G21.cf!==key){G21.cf=key;gRender21();return}
 if(op==='kick')return gDo21('kick',{mid:a},'เชิญออกจากกิลด์แล้ว');
 if(op==='role')return gDo21('role',{mid:a,role:b},b==='leader'?'👑 โอนตำแหน่งหัวหน้าแล้ว':'ปรับยศแล้ว');
 if(op==='leave')return gDo21('leave',{},'ออกจากกิลด์แล้ว');
 if(op==='disband')return gDo21('disband',{},'ยุบกิลด์แล้ว')};
const esc21=s=>String(s==null?'':s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'})[c]);
const ago21=t=>{if(!t)return 'ยังไม่เคยเข้า';const m=(Date.now()-t)/6e4;return m<10?'🟢 เพิ่งเห็น':m<60?Math.round(m)+' นาทีที่แล้ว':m<1440?Math.round(m/60)+' ชม.ที่แล้ว':Math.round(m/1440)+' วันที่แล้ว'};
const RN21={leader:'👑 หัวหน้า',officer:'⭐ รองหัวหน้า',member:'สมาชิก'};
function gRender21(){const g=G21.g,cf=k=>G21.cf===k,B=(lbl,on,cls)=>'<button class="bt '+(cls||'')+'" '+(G21.busy?'disabled':'')+' onclick="'+on+'">'+lbl+'</button>';
 let h='<div class="w"><div class="hd"><b>🛡️ '+(g?'['+esc21(g.tag)+'] '+esc21(g.name):'กิลด์ของผู้เล่น')+'</b><button onclick="p6close(gwW21)">✕</button></div><div class="bd g21">';
 if(G21.err==='off'||!gOnline21())h+='<div class="it"><b>ต้องเล่นแบบออนไลน์</b><small>ล็อกอินบัญชีออนไลน์ก่อน จึงจะสร้างหรือเข้าร่วมกิลด์กับผู้เล่นคนอื่นได้</small></div>';
 else if(!G21.loaded)h+='<small>กำลังโหลด…</small>';
 else if(G21.err&&!g&&!G21.list)h+='<div class="it"><b>โหลดไม่สำเร็จ</b><small>'+(GERR21[G21.err]||G21.err)+'</small>'+B('ลองใหม่','openGuild21()')+'</div>';
 else if(!g){
  h+='<div class="it g21c"><b>🏰 ก่อตั้งกิลด์ใหม่</b><small>ค่าก่อตั้ง 🪙 '+G21COST.toLocaleString()+' · สมาชิกสูงสุด 30 คน</small><div class="g21r"><input id="g21n" maxlength="16" placeholder="ชื่อกิลด์ (3–16 ตัว)"><input id="g21t" maxlength="4" placeholder="TAG" style="max-width:80px;text-transform:uppercase"></div>'+B('🛡️ ก่อตั้งกิลด์','g21(\'create\')','g')+'</div>';
  h+='<div class="it g21c"><b>🔎 ค้นหากิลด์</b><div class="g21r"><input id="g21q" value="'+esc21(G21.q)+'" placeholder="ชื่อหรือ TAG">'+B('ค้นหา','g21(\'search\')')+'</div></div>';
  const L=G21.list||[];if(!L.length)h+='<small>ยังไม่มีกิลด์ — มาเป็นคนแรกที่ก่อตั้งกิลด์กัน!</small>';
  for(const x of L)h+='<div class="it"><b>['+esc21(x.tag)+'] '+esc21(x.name)+'</b><small>👥 '+x.n+'/30 · เลเวลเฉลี่ย '+x.lv+' · หัวหน้า '+esc21(x.lead)+' · '+(x.open?'🔓 เข้าได้ทันที':'🔒 ต้องขออนุมัติ')+(x.notice?'<br>📌 '+esc21(x.notice):'')+'</small>'+(x.app?B('ยกเลิกคำขอ','g21(\'cancel\',\''+x.id+'\')'):B(x.open?'เข้าร่วม':'ขอเข้าร่วม','g21(\'join\',\''+x.id+'\')','g'))+'</div>'}
 else{const R=g.role,isL=R==='leader',isO=R==='leader'||R==='officer';
  h+='<div class="it g21c"><b>📌 ประกาศกิลด์</b>'+(isO?'<textarea id="g21no" maxlength="200" rows="2">'+esc21(g.notice)+'</textarea><div class="g21r">'+B('บันทึกประกาศ','g21(\'notice\')')+B(g.open?'🔓 เข้าได้ทันที':'🔒 ต้องขออนุมัติ','g21(\'open\')')+'</div>':'<small>'+esc21(g.notice||'—')+'</small>')
   +'<small>👥 สมาชิก '+g.members.length+'/'+g.max+' · ยศของคุณ: '+RN21[R]+' · คุยกันได้ในแชทช่อง "กิลด์" (เห็นเฉพาะสมาชิก)</small></div>';
  if(isO&&g.apps.length){h+='<div class="it g21c"><b>📨 คำขอเข้าร่วม ('+g.apps.length+')</b>';for(const a of g.apps)h+='<div class="g21m"><span>'+esc21(a.n)+' <small>Lv.'+a.lv+'</small></span>'+B('✅ รับ','g21(\'accept\',\''+a.id+'\')','g')+B('✖','g21(\'reject\',\''+a.id+'\')')+'</div>';h+='</div>'}
  h+='<div class="it g21c"><b>👥 สมาชิก</b>';
  for(const m of g.members){let act='';const k=(o,b)=>o+':'+m.id+':'+(b||'');
   if(!m.me&&isL){act+=m.role==='member'?B(cf(k('role','officer'))?'ยืนยัน?':'⭐ ตั้งรอง','g21(\'role\',\''+m.id+'\',\'officer\')'):B(cf(k('role','member'))?'ยืนยัน?':'ลดยศ','g21(\'role\',\''+m.id+'\',\'member\')');act+=B(cf(k('role','leader'))?'ยืนยันโอน?':'👑 โอนหัวหน้า','g21(\'role\',\''+m.id+'\',\'leader\')')}
   if(!m.me&&isO&&(isL||m.role==='member'))act+=B(cf(k('kick'))?'ยืนยันเชิญออก?':'เชิญออก','g21(\'kick\',\''+m.id+'\')','r');
   h+='<div class="g21m'+(m.me?' me':'')+'"><span>'+RN21[m.role]+' · <b>'+esc21(m.n)+'</b> <small>Lv.'+m.lv+' · '+(m.me?'คุณ':ago21(m.s))+'</small></span>'+act+'</div>'}
  h+='</div><div class="g21r">'+B(cf('leave::')?'กดอีกครั้งเพื่อออก':'🚪 ออกจากกิลด์','g21(\'leave\')','r')+(isL?B(cf('disband::')?'กดอีกครั้งเพื่อยุบ':'💥 ยุบกิลด์','g21(\'disband\')','r'):'')+'</div>'}
 gwW21.innerHTML=h+'</div></div>'}
{const st=document.createElement('style');st.textContent='#guild21 .g21{display:flex;flex-direction:column;gap:6px;padding:8px;overflow-y:auto}#guild21 .g21c{display:flex;flex-direction:column;gap:5px}#guild21 .g21r{display:flex;gap:6px;flex-wrap:wrap}#guild21 .g21r input{flex:1;min-width:90px}#guild21 input,#guild21 textarea{padding:7px;border-radius:8px;border:1px solid #5a4a7a;background:#120e1c;color:#fff;font:700 13px system-ui}#guild21 .g21m{display:flex;align-items:center;gap:5px;padding:5px;border-radius:8px;background:rgba(0,0,0,.22);flex-wrap:wrap}#guild21 .g21m span{flex:1;min-width:150px}#guild21 .g21m.me{outline:1.5px solid #7aff9a}#guild21 .bt.r{background:#7a2a2a}#guild21 .bt{padding:5px 9px}';document.head.appendChild(st)}
// เมนู + NPC กิลด์
try{const at=PM7.findIndex(m=>m[1]==='ตั้งค่า');PM7.splice(at<0?PM7.length-1:at,0,['🛡️','กิลด์',()=>openGuild21()])}catch(e){}
{const _ot=ownerTalk;ownerTalk=function(id){const r=_ot(id);try{if(id==='guild'&&DLG.open)DLG.ch.unshift({t:'🛡️ กิลด์ของผู้เล่น (สร้าง/เข้าร่วม)',c:'go',f:()=>openGuild21()})}catch(e){}return r}}
// ออนไลน์: ข้อมูลกิลด์จากเซิร์ฟเวอร์ · ป้าย TAG ของผู้เล่นอื่น
{const _nm=netMsg;netMsg=function(d){const r=_nm(d);try{
  if(d.t==='auth_ok'){G21.tag=d.g?d.g.tag:'';if(d.g&&!G21.g)gLoad21()}
  else if(d.t==='gupd'){G21.tag=d.g?d.g.tag:'';gLoad21().then(()=>{if(!gwW21.hidden)gRender21()});if(d.g)sysSay('🛡️ คุณเป็นสมาชิกกิลด์ ['+d.g.tag+'] '+d.g.name+' แล้ว');else sysSay('🛡️ คุณไม่ได้อยู่ในกิลด์แล้ว')}
  else if(d.t==='snap')for(const s of d.ps){const o=NET.others.get(s.id);if(o)o.gtag=s.gtag||''}}catch(e){}return r}}
setTimeout(()=>{if(gOnline21())gLoad21()},6000);
// ป้าย [TAG] เหนือชื่อ (เหนือฉายาถ้ามี)
{const _do=drawOther;drawOther=function(o){window.__OGTAG21=o.gtag||'';try{return _do(o)}finally{window.__OGTAG21=''}}}
{const _nt=nameTag;nameTag=function(){_nt();try{if(!P.name||P.dead)return;const tag=window.__IN_OTHER8?window.__OGTAG21:G21.tag;if(!tag)return;const hasT=window.__IN_OTHER8?!!window.__OTTL20:!!myTtl20();
  ctx.save();ctx.font='900 9px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';const s='⟦'+tag+'⟧',y=Math.round(P.y-(hasT?95:84));ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(s,Math.round(P.x),y);ctx.fillStyle='#7aff9a';ctx.fillText(s,Math.round(P.x),y);ctx.restore()}catch(e){}}}
// บอทกิลด์: ปิดเมื่อเล่นออนไลน์ (แชทกิลด์เป็นของผู้เล่นจริง)
{const _cs=chatSay;chatSay=function(ch,who,txt,col){try{if(ch==='guild'&&NET.on&&GUILD.mem.some(m=>m[0]===who))return}catch(e){}return _cs(ch,who,txt,col)}}
{const _gr=guildReply;guildReply=function(t){try{if(NET.on)return}catch(e){}return _gr(t)}}

// =====================================================================
