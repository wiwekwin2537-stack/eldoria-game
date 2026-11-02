// fix26.js (v4.34) — ข้อ 68 ส่วนที่ 3: ต้นไม้พาสซีฟแบบ POE
// 11 จุดเริ่มต้นตามอาชีพ (ผู้ฝึกหัดเริ่มกลางวง) · วงล้อ/โหนดเด่นมีภาพสกิลของแต่ละคลาส · คีย์สโตนประจำคลาส
// วงโคจรเชื่อมทุกสาย เดินข้ามไปสายอื่นได้ · ~250 จุด (แต้มสูงสุด ~89 ที่ Lv.150 = ต้องเลือกเส้นทาง)
// =====================================================================
const ORD26=['sword','paladin','dragoon','monk','ninja','archer','sniper','summoner','necro','mage','cleric'].filter(k=>CLS[k]);
const ATT26={sword:['str','vit'],paladin:['vit','str'],dragoon:['str','end'],monk:['str','agi'],ninja:['agi','str'],archer:['agi','end'],sniper:['agi','int'],summoner:['int','vit'],necro:['int','end'],mage:['int','agi'],cleric:['int','vit']};
// [โหนดเด่นวงล้อ, โหนดเด่นซ้าย, โหนดเด่นขวา, คีย์สโตน{n,fx,st}]
const NOT26={
 sword:[{dmg:.08,hp:.05},{aspd:.1,dmg:.05},{area:.2,skill:.08},{n:'ราชันย์แห่งดาบ',fx:{dmg:.18,dr:.06},st:{str:8}}],
 paladin:[{dr:.06,hp:.08},{hpr:.006,skill:.08},{dr:.05,cdr:.08},{n:'โล่สวรรค์',fx:{hp:.2,dr:.1},st:{vit:8}}],
 dragoon:[{dmg:.1},{area:.2,skill:.08},{spd:.06,crit:.04},{n:'วิญญาณมังกร',fx:{skill:.2,dmg:.08},st:{str:8}}],
 monk:[{aspd:.12},{crit:.05,dmg:.06},{hpr:.005,spd:.06},{n:'อรหันต์หมัดเหล็ก',fx:{aspd:.15,dmg:.1},st:{agi:8}}],
 ninja:[{crit:.06},{spd:.05,crit:.03},{dmg:.08},{n:'เงามรณะ',fx:{crit:.1,spd:.08},st:{agi:8}}],
 archer:[{proj:1},{crit:.05,skill:.06},{spd:.08,far:.2},{n:'เนตรเหยี่ยวเทพ',fx:{skill:.18,proj:1},st:{agi:8}}],
 sniper:[{crit:.06,dmg:.05},{skill:.12},{cdr:.1},{n:'นัดเดียวจอด',fx:{crit:.08,skill:.15},st:{agi:8}}],
 summoner:[{minion:1},{mdmg:.3},{mdur:.5,hp:.05},{n:'เจ้าป่าสรรพสัตว์',fx:{mdmg:.4,minion:1},st:{int:8}}],
 necro:[{minion:1},{mdmg:.25,mpc:.1},{hpr:.005,mdur:.4},{n:'ราชาแห่งความตาย',fx:{mdmg:.35,skill:.1},st:{int:8}}],
 mage:[{skill:.1},{area:.2},{mpr:.4,mpc:.1},{n:'ปราชญ์อาคม',fx:{skill:.22,cdr:.05},st:{int:8}}],
 cleric:[{hpr:.008},{skill:.1,mpr:.3},{cdr:.1,hp:.06},{n:'พรแห่งทวยเทพ',fx:{hp:.15,skill:.12,cdr:.08},st:{int:8}}]};
const GEN26=[['⚡','เร่งเร้า',{aspd:.1}],['⚔️','ใจนักสู้',{dmg:.06}],['🎯','สมาธิพราน',{skill:.06,aspd:.04}],['💧','ธารมานา',{mpc:.15,mpr:.2}],['🌀','วังวนพลัง',{area:.18}],
 ['💀','กองทัพเงา',{minion:1}],['🔥','สัญชาตญาณดิบ',{mdmg:.25}],['⏳','กาลเวลา',{mdur:.5,cdr:.05}],['⏱️','ร่ายไว',{cdr:.12}],['🎯','จุดตาย',{crit:.05,dmg:.04}],['❤️','หัวใจยักษ์',{hp:.1,hpr:.003}]];
const FXL26={dmg:['ดาเมจ +',1],crit:['คริติคอล +',1],spd:['ความเร็วเดิน +',1],mpr:['มานาฟื้น +',1],skill:['ดาเมจสกิล +',1],hpr:['ฟื้นเลือด ',2],hp:['เลือดสูงสุด +',1],dr:['ดาเมจที่ได้รับ -',1],far:['แรงฟื้น +',1],fac:['ใช้แรง -',1],chain:['วาป/โซ่ +',0],proj:['กระสุน +',0],mpc:['สกิลใช้มานา -',1],area:['พื้นที่สกิล +',1],minion:['สมุน +',0],mdmg:['ดาเมจสมุน +',1],mdur:['เวลาสมุน +',1],cdr:['คูลดาวน์ -',1],aspd:['ตีเร็ว +',1]};
function desc26(fx,st){const a=[];for(const k in st||{})a.push(STN_TH[k]+' +'+st[k]);for(const k in fx||{}){const L=FXL26[k];if(!L)continue;const v=fx[k];a.push(L[0]+(L[1]===1?Math.round(v*100)+'%':L[1]===2?(v*100).toFixed(1)+'%/วิ':v+(k==='minion'?' ตัว':k==='chain'?' ครั้ง':' ลูก')))}return a.join(' · ')}
const SPC26={};for(const s of PSPK)SPC26[s.k]=s;
// ---------- สร้างต้นไม้ใหม่ ----------
for(const k in PNODES)delete PNODES[k];
const ORB26={};
{const N=PNODES,TAU=Math.PI*2,K=ORD26.length,G=TAU/K,P2=(r,a)=>[Math.cos(a)*r,Math.sin(a)*r];
 const add=(id,x,y,o)=>{N[id]=Object.assign({id,x,y,adj:[]},o);return N[id]};
 const lk=(a,b)=>{if(!N[a]||!N[b]||a===b||N[a].adj.includes(b))return;N[a].adj.push(b);N[b].adj.push(a)};
 const orb=(id,key,cx,cy,r)=>{N[id].orb=key;ORB26[key]={cx,cy,r}};
 const st1=(k,v)=>({sp:SPC26[k],n:SPC26[k].n+' +'+v,d:STN_TH[k]+' +'+v,st:{[k]:v}});
 const st2=(a,b,v)=>({sp:{c:'#c8b8ff',e:''},n:SPC26[a].n+'+'+SPC26[b].n,d:STN_TH[a]+' +'+v+' · '+STN_TH[b]+' +'+v,st:{[a]:v,[b]:v},mix:[SPC26[a].c,SPC26[b].c]});
 add('c0',0,0,{n:'จุดเริ่มต้นผู้ฝึกหัด',d:'ศูนย์กลางของทุกเส้นทาง (ผู้ฝึกหัดเริ่มที่นี่)',start:1,cls:'none',sp:{c:'#ffd84a',e:'🔰'}});
 ORD26.forEach((k,i)=>{const a=-Math.PI/2+i*G,C=CLS[k],[A,B]=ATT26[k],L=CSKILLS[k]||[],T=NOT26[k],col=C.col||'#ffd84a';
  // วงใน
  const [ix,iy]=P2(58,a);add('in'+i,ix,iy,st1(A,2));orb('in'+i,'inner',0,0,58);lk('c0','in'+i);
  // จุดเริ่มต้นคลาส
  const [sx,sy]=P2(110,a);add('S_'+k,sx,sy,{start:1,cls:k,sp:{c:col,e:C.e},n:'ประตู'+C.n,d:'จุดเริ่มต้นของ'+C.n+' · ถ้าเดินผ่านจากสายอื่น ได้ '+STN_TH[A]+' +4',st:{[A]:4},big:1});lk('in'+i,'S_'+k);
  const [p1x,p1y]=P2(148,a);add('p1_'+k,p1x,p1y,st1(A,3));lk('S_'+k,'p1_'+k);
  const [p2x,p2y]=P2(185,a);add('p2_'+k,p2x,p2y,st1(B,3));orb('p2_'+k,'mid',0,0,185);lk('p1_'+k,'p2_'+k);
  // วงล้อ + โหนดเด่น (สกิล 1)
  const [wx,wy]=P2(245,a),wk='w_'+k;for(let j=0;j<6;j++){const aa=a+Math.PI+j*Math.PI/3,o=j%2?st2(A,B,2):st1(j===0||j===3?A:B,3);add('w'+j+'_'+k,wx+Math.cos(aa)*30,wy+Math.sin(aa)*30,o);orb('w'+j+'_'+k,wk,wx,wy,30)}
  for(let j=0;j<6;j++)lk('w'+j+'_'+k,'w'+((j+1)%6)+'_'+k);lk('p2_'+k,'w0_'+k);
  const sk0=L[0];add('N0_'+k,wx,wy,{sp:{c:col},n:'แก่นแห่ง '+(sk0?sk0.n:C.n),d:desc26(T[0]),fx:T[0],st:{},big:1,ic:sk0&&sk0.n,cls:k});lk('N0_'+k,'w2_'+k);lk('N0_'+k,'w4_'+k);
  // ทางออกด้านนอก → ส้อม 3 ทาง
  const [p3x,p3y]=P2(305,a);add('p3_'+k,p3x,p3y,st1(A,4));orb('p3_'+k,'outer',0,0,305);lk('w3_'+k,'p3_'+k);
  [[-1,'L',1],[1,'R',2]].forEach(([s,t,ix2])=>{const [bx,by]=P2(345,a+s*.15);add('b'+t+'_'+k,bx,by,st1(s<0?A:B,3));lk('p3_'+k,'b'+t+'_'+k);
    const sk=L[ix2],[nx,ny]=P2(390,a+s*.17);add('N'+ix2+'_'+k,nx,ny,{sp:{c:col},n:'แก่นแห่ง '+(sk?sk.n:C.n),d:desc26(T[ix2]),fx:T[ix2],st:{},big:1,ic:sk&&sk.n,cls:k});lk('b'+t+'_'+k,'N'+ix2+'_'+k)});
  const [p4x,p4y]=P2(345,a);add('p4_'+k,p4x,p4y,st2(A,B,3));lk('p3_'+k,'p4_'+k);
  const Kd=T[3],ksk=L.length>3?L[L.length-1]:null,[kx,ky]=P2(396,a);add('K_'+k,kx,ky,{sp:{c:col,e:C.e},n:Kd.n,d:desc26(Kd.fx,Kd.st)+' (คีย์สโตนประจำ'+C.n+')',fx:Kd.fx,st:Kd.st,ks:1,big:1,ic:ksk&&ksk.n,cls:k});lk('p4_'+k,'K_'+k)});
 // วงโคจรเชื่อมระหว่างสาย
 ORD26.forEach((k,i)=>{const k2=ORD26[(i+1)%K],a=-Math.PI/2+i*G,A1=ATT26[k][0],A2=ATT26[k2][0],B1=ATT26[k][1],B2=ATT26[k2][1];
  lk('in'+i,'in'+((i+1)%K));
  let prev='p2_'+k;for(const f of [1/3,2/3]){const id='m'+i+'_'+Math.round(f*3),[x,y]=P2(185,a+G*f);add(id,x,y,f<.5?st2(A1,B1===A2?B2:A2,2):st2(A2,B2===A1?B1:B1,2));orb(id,'mid',0,0,185);lk(prev,id);prev=id}lk(prev,'p2_'+k2);
  prev='p3_'+k;[.25,.5,.75].forEach((f,j)=>{const id='o'+i+'_'+j,[x,y]=P2(305,a+G*f);
   if(j===1){const g=GEN26[i%GEN26.length];add(id,x,y,{sp:{c:'#5affd8',e:g[0]},n:g[1],d:desc26(g[2]),fx:g[2],st:{},big:1,gen:1})}
   else add(id,x,y,st1(j===0?A1:A2,4));orb(id,'outer',0,0,305);lk(prev,id);prev=id});lk(prev,'p3_'+k2)})}
// ---------- จุดเริ่ม / เปิดใช้งาน ----------
const ptStart26=()=>{const k=P.cls;return k&&k!=='none'&&PNODES['S_'+k]?'S_'+k:'c0'};
function ptLoad26(){let had=0,raw=null;try{raw=JSON.parse(localStorage.getItem('fm_pt')||'null')}catch(e){}
 const s=ptStart26();PT.a=new Set([s]);PT.sel=null;if(raw&&raw.a){had=raw.a.length;if(raw.v26&&raw.a.includes(s))for(const id of raw.a)if(PNODES[id]&&!(PNODES[id].start&&id!==s&&PNODES[id].cls===P.cls))PT.a.add(id)}
 _ptx=null;try{localStorage.setItem('fm_pt',JSON.stringify({a:[...PT.a],v26:1}))}catch(e){}
 if(had>1&&!(raw&&raw.v26))setTimeout(()=>{try{chatAnn('🌳 ต้นไม้พาสซีฟโฉมใหม่แบบ POE! คืนแต้มทั้งหมดให้แล้ว — เปิดเมนูสกิล > พาสซีฟ เพื่อวางเส้นทางใหม่')}catch(e){}},4000)}
ptLoad26();
// savePT เดิมไม่มีเวอร์ชัน → เขียนทับให้มี v26 เสมอ
setInterval(()=>{try{const s=ptStart26();
  if(!PT.a.has(s)){const used=PT.a.size>1&&![...PT.a].every(id=>id==='c0'||PNODES[id]&&PNODES[id].start);PT.a=new Set([s]);PT.sel=null;ptDirty();if(used)say('🌳 เปลี่ยนจุดเริ่มต้นต้นไม้พาสซีฟตามอาชีพใหม่ — คืนแต้มให้ทั้งหมดแล้ว');try{renderSkw()}catch(e){}}
  for(const id of PT.a)if(!PNODES[id]){PT.a.delete(id);_ptx=null}
  const raw=localStorage.getItem('fm_pt')||'';if(raw.indexOf('"v26"')<0||!raw)localStorage.setItem('fm_pt',JSON.stringify({a:[...PT.a],v26:1}))}catch(e){}},800);
{const _sv=()=>{try{localStorage.setItem('fm_pt',JSON.stringify({a:[...PT.a],v26:1}))}catch(e){}};
 const _al=ptAlloc;ptAlloc=function(id){_al(id);_sv()};
 ptReset=function(){const c=100+P.lv*20;if(ptUsed()===0)return;if(inv.coin<c){say('รีเซ็ตต้องใช้ '+c+' เหรียญ');sfx('thud');return}inv.coin-=c;PT.a=new Set([ptStart26()]);PT.sel=null;_sv();ptDirty();say('🔄 รีเซ็ตต้นไม้พาสซีฟแล้ว');sfx('ui');renderSkw()};
 window.ptReset=ptReset;window.ptAlloc=ptAlloc}
// ---------- ไอคอนสกิลขนาดเล็ก (แคช) ----------
const IC26={};
function ic26(name){if(IC26[name]!==undefined)return IC26[name];const fn=SKART[name];if(!fn)return IC26[name]=null;try{const c=document.createElement('canvas');c.width=c.height=96;const q=c.getContext('2d');q.lineCap='round';q.lineJoin='round';fn(q,96);
  const d=document.createElement('canvas');d.width=d.height=60;const k=d.getContext('2d');k.drawImage(c,0,0,60,60);return IC26[name]=d.toDataURL('image/jpeg',.82)}catch(e){return IC26[name]=null}}
// ---------- วาดต้นไม้ ----------
const STAR26=(()=>{let s='',r=7;const rnd=()=>(r=(r*16807)%2147483647)/2147483647;for(let i=0;i<140;i++){const a=rnd()*Math.PI*2,d=Math.sqrt(rnd())*425;s+='<circle cx="'+(Math.cos(a)*d).toFixed(0)+'" cy="'+(Math.sin(a)*d).toFixed(0)+'" r="'+(rnd()*1.2+.3).toFixed(1)+'" fill="#fff" opacity="'+(rnd()*.35+.08).toFixed(2)+'"/>'}return s})();
function ptSVG(){const N=PNODES,t=performance.now(),own=id=>PT.a.has(id),me=ptStart26(),fl=PT.flash&&t-PT.flash.t<900?PT.flash.id:null,hw=430/SKW.zoom;
 let bg='',e1='',e2='',nd='',lb='';
 // พื้นหลัง: วงโคจร + แสงประจำสาย
 for(const r of [58,110,148,185,305,345,396])bg+='<circle r="'+r+'" fill="none" stroke="rgba(170,150,255,.07)" stroke-width="'+(r===185||r===305?10:1)+'"/>';
 for(const k of ORD26){const S=N['S_'+k];if(!S)continue;const c=CLS[k].col;bg+='<circle cx="'+S.x.toFixed(1)+'" cy="'+S.y.toFixed(1)+'" r="'+(k===P.cls?150:110)+'" fill="url(#cg_'+k+')"/>'}
 // เส้นเชื่อม (โค้งตามวงโคจร)
 const done=new Set();
 for(const id in N){const A=N[id];for(const bid of A.adj){const key=id<bid?id+'|'+bid:bid+'|'+id;if(done.has(key))continue;done.add(key);const B=N[bid],oa=own(id),ob=own(bid),on=oa&&ob,half=(oa&&ptCan(bid))||(ob&&ptCan(id));
  let d;if(A.orb&&A.orb===B.orb){const O=ORB26[A.orb],cr=(A.x-O.cx)*(B.y-O.cy)-(A.y-O.cy)*(B.x-O.cx);d='M'+A.x.toFixed(1)+' '+A.y.toFixed(1)+'A'+O.r+' '+O.r+' 0 0 '+(cr>0?1:0)+' '+B.x.toFixed(1)+' '+B.y.toFixed(1)}
  else d='M'+A.x.toFixed(1)+' '+A.y.toFixed(1)+'L'+B.x.toFixed(1)+' '+B.y.toFixed(1);
  if(on)e2+='<path d="'+d+'" stroke="#ffd36a" stroke-width="4" fill="none" filter="url(#gl26)"/><path d="'+d+'" stroke="#fff6c8" stroke-width="1.4" fill="none"/>';
  else e1+='<path d="'+d+'" stroke="'+(half?'#a08a50':'#3a3452')+'" stroke-width="'+(half?3:2.4)+'" fill="none"'+(half?' class="pl26"':'')+'/><path d="'+d+'" stroke="'+(half?'#e8d7a0':'#5a5276')+'" stroke-width=".8" fill="none" opacity=".6"/>'}}
 // โหนด
 for(const id in N){const d=N[id],o=own(id),can=!o&&ptCan(id),sel=PT.sel===id,x=d.x.toFixed(1),y=d.y.toFixed(1),col=d.sp&&d.sp.c||'#ffd84a';let g='';
  if(d.start){const mine=id===me,R=id==='c0'?16:mine?20:16;
   g+='<circle r="'+(R+7)+'" fill="none" stroke="'+col+'" stroke-width="1.5" opacity="'+(mine?.9:.4)+'" stroke-dasharray="3 3"/>';
   g+='<circle r="'+R+'" fill="url(#ndk26)" stroke="'+(o?'#ffd36a':col)+'" stroke-width="'+(mine?3.5:2.2)+'"'+(o?' filter="url(#gl26)"':'')+'/>';
   for(let j=0;j<8;j++){const aa=j*Math.PI/4;g+='<circle cx="'+(Math.cos(aa)*(R+3.5)).toFixed(1)+'" cy="'+(Math.sin(aa)*(R+3.5)).toFixed(1)+'" r="1.6" fill="'+(o?'#ffe9a0':col)+'"/>'}
   g+='<text y="'+(R*.36).toFixed(1)+'" text-anchor="middle" font-size="'+(R*1.05).toFixed(0)+'"'+(o||mine||can?'':' opacity=".55"')+'>'+(d.sp.e||'')+'</text>';
   if(d.cls&&d.cls!=='none')lb+='<text x="'+x+'" y="'+(d.y+R+17).toFixed(1)+'" text-anchor="middle" font-size="'+(id===me?11:9)+'" font-weight="800" fill="'+col+'" stroke="#0a0812" stroke-width="3" paint-order="stroke" opacity="'+(id===me?1:.75)+'">'+CLS[d.cls].n+'</text>'}
  else if(d.ks){const R=19,im=d.ic&&ic26(d.ic);
   g+='<g transform="rotate(45)"><rect x="-'+(R+6)+'" y="-'+(R+6)+'" width="'+(R+6)*2+'" height="'+(R+6)*2+'" rx="5" fill="#120e1c" stroke="'+(o?'#ffd36a':can?'#e8d7a0':'#6a5a3a')+'" stroke-width="3"'+(o?' filter="url(#gl26)"':'')+'/></g>';
   g+='<circle r="'+R+'" fill="#1a1426" stroke="'+col+'" stroke-width="2"/>';
   g+=im?'<image href="'+im+'" x="-'+R+'" y="-'+R+'" width="'+R*2+'" height="'+R*2+'" clip-path="url(#cpK26)"'+(o?'':' filter="url(#gs26)" opacity="'+(can?.9:.55)+'"')+'/>':'<text y="7" text-anchor="middle" font-size="20"'+(o?'':' opacity=".6"')+'>'+(d.sp.e||'👑')+'</text>';
   g+='<text y="-'+(R+12)+'" text-anchor="middle" font-size="12">👑</text>'}
  else if(d.big){const R=d.gen?11:14,im=d.ic&&ic26(d.ic);
   g+='<circle r="'+(R+3.5)+'" fill="#120e1c" stroke="'+(o?'#ffd36a':can?'#e8d7a0':'#7a6a4a')+'" stroke-width="2.6"'+(o?' filter="url(#gl26)"':'')+'/>';
   if(im)g+='<image href="'+im+'" x="-'+R+'" y="-'+R+'" width="'+R*2+'" height="'+R*2+'" clip-path="url(#cpN26)"'+(o?'':' filter="url(#gs26)" opacity="'+(can?.9:.55)+'"')+'/>';
   else g+='<circle r="'+R+'" fill="'+(o?'#2a2440':'#1a1626')+'"/><text y="'+(R*.38).toFixed(1)+'" text-anchor="middle" font-size="'+(R*1.1).toFixed(0)+'"'+(o?'':' opacity="'+(can?.9:.5)+'"')+'>'+(d.sp.e||'⭐')+'</text>';
   g+='<circle r="'+(R+3.5)+'" fill="none" stroke="'+col+'" stroke-width=".9" opacity=".8"/>'}
  else{const R=6.5,cc=d.mix?d.mix[0]:col;
   g+='<circle r="'+R+'" fill="'+(o?cc:'url(#ndk26)')+'" stroke="'+(o?'#ffe9a0':can?'#e8d7a0':cc)+'" stroke-width="'+(o?2:1.6)+'"'+(o?' filter="url(#gl26)"':'')+' opacity="'+(o||can?1:.75)+'"/>';
   if(d.mix)g+='<path d="M0 -'+(R-1.5)+'A'+(R-1.5)+' '+(R-1.5)+' 0 0 1 0 '+(R-1.5)+'Z" fill="'+(o?d.mix[1]:'none')+'" stroke="'+d.mix[1]+'" stroke-width="1" opacity="'+(o?1:.7)+'"/>'}
  if(can)g+='<circle r="'+(d.ks?28:d.big||d.start?20:11)+'" fill="none" stroke="#fff3b0" stroke-width="1.6" class="pl26"/>';
  if(sel)g+='<circle r="'+(d.ks?31:d.big||d.start?23:13)+'" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 3" class="rt26"/>';
  if(fl===id)g+='<circle r="'+(10+(t-PT.flash.t)/900*30).toFixed(0)+'" fill="none" stroke="#ffd36a" stroke-width="3" opacity="'+(1-(t-PT.flash.t)/900).toFixed(2)+'"/>';
  nd+='<g data-n="'+id+'" transform="translate('+x+' '+y+')" style="cursor:pointer"><circle r="'+(d.ks?28:d.big||d.start?21:13)+'" fill="transparent"/>'+g+'</g>'}
 let defs='<style>.pl26{animation:pl26 1.3s ease-in-out infinite}.rt26{animation:rt26 6s linear infinite}@keyframes pl26{50%{opacity:.3}}@keyframes rt26{to{transform:rotate(360deg)}}</style>'
  +'<filter id="gl26" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
  +'<filter id="gs26"><feColorMatrix type="saturate" values="0.12"/></filter>'
  +'<clipPath id="cpN26"><circle r="14"/></clipPath><clipPath id="cpK26"><circle r="19"/></clipPath>'
  +'<radialGradient id="ndk26" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#4a4068"/><stop offset=".6" stop-color="#221c32"/><stop offset="1" stop-color="#0e0c16"/></radialGradient>'
  +'<radialGradient id="bg26"><stop offset="0" stop-color="#2a2140"/><stop offset=".55" stop-color="#16121f"/><stop offset="1" stop-color="#0a0810"/></radialGradient>';
 for(const k of ORD26)defs+='<radialGradient id="cg_'+k+'"><stop offset="0" stop-color="'+CLS[k].col+'" stop-opacity="'+(k===P.cls?.28:.13)+'"/><stop offset="1" stop-color="'+CLS[k].col+'" stop-opacity="0"/></radialGradient>';
 return '<svg viewBox="'+(SKW.cx-hw)+' '+(SKW.cy-hw)+' '+hw*2+' '+hw*2+'" preserveAspectRatio="xMidYMid meet"><defs>'+defs+'</defs><circle r="440" fill="url(#bg26)"/>'+STAR26+bg+e1+e2+nd+lb+'</svg>'}
window.ptSVG=ptSVG;
// เปิดหน้าพาสซีฟครั้งแรก: ซูมไปที่จุดเริ่มของอาชีพตัวเอง
{const _o=openSkw;openSkw=function(tab){_o(tab);try{if((tab==='pas'||SKW.tab==='pas')&&!SKW._c26){SKW._c26=1;const S=PNODES[ptStart26()];SKW.cx=S.x*.85;SKW.cy=S.y*.85;SKW.zoom=Math.max(SKW.zoom,1.6);skwView()}}catch(e){}};window.openSkw=openSkw}
// การ์ดรายละเอียด: ใส่ภาพสกิลของโหนดเด่น
{const _r=renderSkw;renderSkw=function(){_r();try{if(skwEl.hidden||SKW.tab!=='pas')return;const s=PT.sel&&PNODES[PT.sel];if(!s)return;const im=s.ic&&ic26(s.ic),cd=skwEl.querySelector('.side .card.on');if(!cd)return;
  const tag=s.ks?'👑 คีย์สโตน':s.start?'🚪 จุดเริ่มต้น':s.gen?'💠 โหนดเด่นทั่วไป':s.big?'⭐ โหนดเด่น'+(s.cls&&CLS[s.cls]?' · '+CLS[s.cls].n:''):'◆ โหนดเล็ก';
  cd.insertAdjacentHTML('afterbegin','<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">'+(im?'<img src="'+im+'" style="width:40px;height:40px;border-radius:'+(s.ks?'8px':'50%')+';border:2px solid '+(s.sp&&s.sp.c||'#ffd36a')+';box-shadow:0 0 8px '+(s.sp&&s.sp.c||'#ffd36a')+'">':'')+'<small style="opacity:.8">'+tag+'</small></div>')}catch(e){}}}

// =====================================================================
