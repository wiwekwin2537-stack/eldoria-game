/* หน้าจอบทนำเฉพาะโหมดทดสอบ opt-in · หน้าเกมปกติไม่เปลี่ยนจุดเกิด/การเดิน */
import * as net from '../core/net.js';
import { on } from '../core/bus.js';
import { zpush } from '../core/zsort.js';
import { enter } from './world.js';
import { stopClick } from './movement.js';
import { createPrologueClient } from '../core/prologue-client.js';
import { PROLOGUE as P } from '../data/prologue.js';
import { ANIM } from '../data/movement.js';
import { ITEMS } from '../data/items.js';
import { CHAPTERS } from '../data/story.js';
const ERR={'field-loot-pending':'มีของค้างที่ยังเก็บไม่ได้ กรุณาจัดกระเป๋าก่อนเข้าลานใหม่','inventory-gear':'ไม่พบดาบชิ้นนี้ในกระเป๋า','inventory-level':'เลเวลยังไม่ถึงเกณฑ์ของดาบนี้','inventory-equipped':'ดาบชำรุดหรือใส่ช่องนี้ไม่ได้','training-active':'กลับท้องพระโรงก่อนเปลี่ยนดาบ','potion-full':'เลือดเต็มอยู่แล้ว ยังไม่ได้ใช้ยา','potion-empty':'ไม่มียาเลือดในกระเป๋า','potion-dead':'ล้มแล้ว ใช้ยาไม่ได้','potion-cooldown':'ยาเลือดยังอยู่ระหว่างคูลดาวน์','potion-encounter':'ลานทดสอบเปลี่ยนแล้ว กรุณาลองใหม่','potion-sequence':'กำลังตรวจการใช้ยาครั้งก่อน กรุณาลองใหม่',near:'เดินเข้าไปใกล้พระราชาก่อนครับ',offline:'การเชื่อมต่อขาด กรุณาลองใหม่',speed:'ตำแหน่งกำลังปรับให้ตรงกับเซิร์ฟเวอร์ ลองอีกครั้ง',wall:'ทางนี้มีสิ่งกีดขวาง',lag:'กำลังปรับตำแหน่งหลังการเชื่อมต่อช้า','bag-full':'กระเป๋าเต็ม ของที่ยังเก็บไม่ได้ยังรออยู่','bag-weight':'น้ำหนักเกิน ของที่ยังเก็บไม่ได้ยังรออยู่','coin-full':'เงินเต็ม ยังไม่ได้รับรางวัล','combat-actor':'ตัวละครยังไม่พร้อมโจมตี รอให้หายชะงักหรือกลับท้องพระโรง','combat-cooldown':'รอผ่านช่วงเริ่มท่า แล้วกดต่อจังหวะได้ครับ','combat-chapter':'ภารกิจพร้อมส่งแล้ว กลับไปรายงานราชาได้ครับ','combat-stamina':'แรงไม่พอ รอสักครู่','combat-loadout-unsupported':'ลานนี้ใช้ดาบเริ่มต้น ไม่มีอาชีพและยังไม่ลงสเตตัสเท่านั้น','training-input':'ข้อมูลควบคุมไม่ถูกต้อง',session:'กรุณาโหลดตัวละครใหม่',start:'กรุณาเริ่มบทนำใหม่'};
let C=null,U=null,loaded=false,elapsed=0,im=null,cleanup=[];
function el(tag,text,id){const e=document.createElement(tag);if(text)e.textContent=text;if(id)e.id=id;return e;}
function renderItems(profile){
 U.items.hidden=!profile;if(!profile)return;const bag=profile.inventory,key=JSON.stringify(bag||null);if(U.itemsKey===key)return;U.itemsKey=key;
 const rows=[],name=id=>Object.prototype.hasOwnProperty.call(ITEMS,id)?ITEMS[id].name:'ไอเท็มที่ยังไม่ระบุชื่อ';
 for(const [id,n] of Object.entries(bag?.stacks||{}))if(Number.isSafeInteger(n)&&n>0)rows.push(name(id)+' × '+n);
 for(const g of Object.values(bag?.gear||{})){const worn=Object.values(bag?.equipped||{}).includes(g.uid);rows.push(name(g.itemId)+(g.enhance>0?' +'+g.enhance:'')+(worn?' · สวมอยู่':'')+(g.broken?' · ชำรุด':''));}
 U.sword.replaceChildren(el('option','ไม่สวมดาบ'));U.sword.firstChild.value='';
 for(const g of Object.values(bag?.gear||{})){const d=Object.prototype.hasOwnProperty.call(ITEMS,g.itemId)?ITEMS[g.itemId]:null;if(d?.slot!=='sword')continue;const option=el('option',d.name+(g.enhance>0?' +'+g.enhance:'')+' · Lv.'+d.level+(g.broken?' · ชำรุด':''));option.value=g.uid;option.disabled=g.broken;U.sword.append(option);}
 U.sword.value=bag?.equipped?.sword||'';
 U.itemList.replaceChildren();if(!rows.length){const li=el('li','ยังไม่มีของในกระเป๋า');U.itemList.append(li);}else for(const text of rows)U.itemList.append(el('li',text));
}
function render(){if(!U||!C)return;const s=C.state,available=loaded&&net.hasFeature('prologue');U.root.hidden=!available;U.start.disabled=!net.isReady()||s.busy;U.start.hidden=s.mode||s.dialog;
 U.bar.hidden=!s.mode||s.dialog;U.dialog.hidden=!s.dialog;const error=s.error||s.battle?.queuedError||s.battle?.lootError;U.error.textContent=error?(ERR[error]||'ทำรายการไม่สำเร็จ กรุณาลองใหม่'):'';
 const chapter=s.story?.state.chapterId,first=chapter==='first-light',finished=!['awakening','first-light'].includes(chapter),canReport=first&&s.story?.view.ready;
 U.potion.hidden=!s.field;const left=Math.ceil((s.pose?.potionCooldownMs||0)/1000),hpp=s.profile?.inventory?.stacks.hpp||0;U.potion.textContent='🧪 ยาเลือด '+hpp+(left?' · '+left+' วิ':'');U.potion.disabled=s.busy||!net.isReady()||s.pose?.alive===false||!!s.pose?.potionPending||left>0||hpp<1||s.pose?.hp>=s.pose?.maxHp;
 U.talk.hidden=s.field;U.fight.hidden=!s.field;U.hall.hidden=!s.field;U.fight.textContent=s.battle?.queuedSequence?'⚔️ เตรียมจังหวะถัดไป':s.battle?.swing?'⚔️ '+(s.battle.swing.spin?'หมุนฟัน':'ฟัน')+' '+(s.battle.swing.combo+1)+'/3':'⚔️ ฟัน';U.fight.disabled=s.busy||!net.isReady()||s.pose?.alive===false||s.pose?.stunned===true;U.hall.disabled=s.busy;
 U.hint.textContent=s.field?(s.pose?.alive===false?'ล้มในลานฝึกแล้ว — กลับท้องพระโรงเพื่อเริ่มใหม่ · ล่า ':'HP '+Math.ceil(s.pose?.hp||0)+'/'+(s.pose?.maxHp||100)+' · สไลม์ไล่และสวนกลับ · ล่า ')+(s.story?.view.progress?.[0]||0)+'/8':first?'เดินคุยกับราชาเพื่อ'+(canReport?'ส่งภารกิจ':'เริ่มทดสอบล่าสไลม์'):'เดินไปหาพระราชา แล้วกด E หรือแตะคุย';
 const title=finished?'ภารกิจแรกจบแล้ว':'พระราชาอัลดริค';if(U.title.textContent!==title)U.title.textContent=title;
 const body=finished?CHAPTERS[1].outro:first?CHAPTERS[1].intro:CHAPTERS[0].intro;if(U.body.textContent!==body)U.body.textContent=body;
 U.claim.hidden=finished||(first&&!canReport);U.claim.textContent=canReport?'ส่งภารกิจและรับรางวัล':'รับชุดเริ่มต้น';U.claim.disabled=s.busy||!net.isReady();U.close.disabled=s.busy;
 U.field.hidden=!first||canReport;U.field.disabled=s.busy||!net.isReady();
 if(s.field)U.hint.textContent+=' · Lv.'+(s.profile?.character?.level||1)+' · XP '+(s.profile?.character?.xp||0)+' · เหรียญ '+(s.profile?.coin||0)+' · ของบนพื้น '+(s.battle?.loot?.length||0);
 U.done.textContent=finished?'รางวัลภารกิจแรกบันทึกแล้ว บทอาวุธที่เลือกเองยังไม่พร้อมเล่น':first?'ลานทดสอบแยก ได้ XP จากสไลม์ เก็บของเมื่อเข้าใกล้ และรวบของที่เหลือเมื่อกลับท้องพระโรง':'';
 renderItems(s.profile);
 U.sword.disabled=U.equip.disabled=s.busy||!net.isReady()||s.field||!s.profile?.inventory;
 U.field.disabled=U.field.disabled||!s.profile?.inventory?.equipped?.sword;
 if(s.profile){const p=s.profile;const text='🪙 '+p.coin+' · Lv.'+(p.character?.level||1)+' · อุปกรณ์ '+Object.keys(p.inventory?.gear||{}).length+' ชิ้น'+(p.pendingLoot?' · ของรอเก็บ '+p.pendingLoot+' ชิ้น':'');if(U.reward.textContent!==text)U.reward.textContent=text;}
}
export default {
 id:'prologue',always:true,
 init(G){if(typeof document==='undefined')return;const ui=document.getElementById('ui');if(!ui)return;
  const style=el('style');style.textContent='#p0{position:absolute;inset:0;pointer-events:none!important;font-size:14px}#p0 button,#p0 section{pointer-events:auto}#p0 [hidden]{display:none!important}#p0 button{font:inherit;min-height:44px;border:1px solid #d9b16c;border-radius:10px;background:#392a20;color:#ffe5af;padding:8px 14px}#p0-start{position:absolute;top:calc(12px + env(safe-area-inset-top));right:calc(12px + env(safe-area-inset-right))}#p0-bar{position:absolute;top:calc(10px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);background:#221b16e8;border:1px solid #bc9659;border-radius:12px;padding:8px;max-width:70vw;text-align:center}#p0-dialog{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(420px,78vw);max-height:76vh;overflow:auto;background:#211b16f7;border:1px solid #bc9659;border-radius:14px;padding:16px;box-shadow:0 12px 40px #0009}#p0 h3{margin:0 0 8px;color:#ffd689}#p0 p{line-height:1.6;margin:8px 0}#p0-error{position:absolute;top:72px;left:50%;transform:translateX(-50%);color:#ffbfaa;text-shadow:0 2px 2px #000;max-width:70vw;text-align:center}#p0 button:disabled{opacity:.5}#p0-bar p{margin:0 0 4px;font-size:12px}#p0-bar button{padding:5px 9px}#p0-dialog button{margin:3px}#p0-items summary{min-height:44px;box-sizing:border-box;padding:10px 0;cursor:pointer;color:#ffd689}#p0-items select{font:inherit;min-height:44px;max-width:100%;background:#392a20;color:#ffe5af;border:1px solid #d9b16c;border-radius:8px}#p0-items label{display:block;margin:8px 0}#p0-items ul{padding-left:22px;margin:0 0 8px;line-height:1.6}';
  const root=el('div',null,'p0'),start=el('button','📜 เริ่มบทนำ','p0-start'),bar=el('section',null,'p0-bar'),dialog=el('section',null,'p0-dialog');root.hidden=true;
  const potion=el('button','🧪 ยาเลือด','p0-potion');
  const fight=el('button','⚔️ ฟัน','p0-attack'),hall=el('button','กลับท้องพระโรง','p0-hall'),field=el('button','ไปลานทดสอบสไลม์','p0-field');
  const hint=el('p','เดินไปหาพระราชา แล้วกด E หรือแตะคุย'),talk=el('button','คุยกับพระราชา','p0-talk'),back=el('button','กลับไปเล่น','p0-back');bar.append(hint,talk,fight,potion,hall,back);
  const title=el('h3'),body=el('p'),done=el('p'),reward=el('p'),claim=el('button','รับชุดเริ่มต้น','p0-claim'),close=el('button','กลับไปเล่น','p0-close'),error=el('p',null,'p0-error');const items=el('details',null,'p0-items'),summary=el('summary','ดูของที่บันทึกแล้ว'),itemList=el('ul');const sword=el('select',null,'p0-sword'),swordLabel=el('label','ดาบที่ต้องการสวม'),equip=el('button','บันทึกการสวมดาบ','p0-equip'),equipmentHint=el('p','เลือกดาบแล้วกดบันทึก · ลานฝึกนี้ใช้ดาบเริ่มต้นเท่านั้น');swordLabel.htmlFor='p0-sword';items.append(summary,itemList,swordLabel,sword,equip,equipmentHint);items.hidden=true;dialog.append(title,body,reward,items,done,claim,field,close);root.append(start,bar,dialog,error);ui.append(style,root);
  U={root,style,start,bar,dialog,potion,items,itemList,sword,equip,itemsKey:null,hint,fight,hall,field,talk,title,body,done,reward,claim,close,error};C=createPrologueClient(G,{request:net.request,ready:net.isReady,enter,stop:stopClick});
  equip.onclick=async()=>{await C.equip(sword.value||null);render();};
  potion.onclick=async()=>{await C.potion();render();};
  field.onclick=async()=>{await C.field();render();};hall.onclick=async()=>{await C.hall();render();};fight.onclick=async()=>{await C.attack();render();};
  start.onclick=async()=>{await C.start();render();};talk.onclick=async()=>{await C.talk();render();};claim.onclick=async()=>{await C.claim();render();};back.onclick=close.onclick=()=>{C.end();render();};
  cleanup.push(on('save:loaded',()=>{loaded=true;render();}),on('net:status',d=>{if(!d.online&&C)C.disconnect();}),on('net:kicked',()=>{C.disconnect();}));render();
 },
 update(G,dt){if(!C)return;const s=C.state;if(s.mode){if(s.field&&G.player.anim){G.player.anim.run=!!s.pose?.running;G.player.anim.t=G.player.moving?G.player.anim.t+dt*(G.player.anim.run?ANIM.run:ANIM.walk):0;}C.sample();elapsed+=dt;if(elapsed>=P.syncMs/1000&&!s.busy){elapsed=0;C.sync();}if(!s.dialog&&!s.field&&G.input?.pressed.has('interact'))C.talk();if(s.field&&s.pose?.alive!==false&&!s.pose?.stunned&&G.input?.pressed.has('attack'))C.attack();if(s.field&&G.input?.pressed.has('potionHp'))C.potion();}render();},
 draw(G,ctx,layer){if(layer!=='world'||!C?.state.mode)return;if(C.state.field){drawTraining(G,ctx);return;}if(G.scene?.id!==P.scene)return;
  if(!im&&typeof Image!=='undefined'){im=new Image();im.src='/'+P.king.src;}
  zpush(P.king.y,k=>{if(im?.naturalWidth){const [w,h]=P.king.size;k.drawImage(im,C.state.dialog?P.king.cell[0]*2:0,C.state.dialog?P.king.cell[1]*3:0,...P.king.cell,P.king.x-w/2,P.king.y-h,w,h);}k.font='11px sans-serif';k.fillStyle='#ffdf90';k.textAlign='center';k.fillText('พระราชาอัลดริค',P.king.x,P.king.y-52);k.textAlign='left';});
 },
 _reset(){for(const fn of cleanup)fn();cleanup=[];C?.disconnect();U?.style.remove();U?.root.remove();C=U=im=null;loaded=false;elapsed=0;},
};

/* อ้างอิงรูปทรง/สี drawSlime 017-core:31–43 ใช้วาดในโลกเดิม ไม่เพิ่มassetใหม่ */
function drawTraining(G,ctx){const s=C.state,b=s.pose?.bounds;if(b){ctx.strokeStyle='#e8cb7480';ctx.lineWidth=1;ctx.strokeRect(b.x-b.radius,b.y-b.radius,b.radius*2,b.radius*2);}
 for(const d of s.battle?.loot||[]){zpush(d.y,k=>{k.save();k.translate(d.x,d.y);k.fillStyle='#0004';k.beginPath();k.ellipse(0,2,5,2,0,0,Math.PI*2);k.fill();k.fillStyle=d.itemId==='coin'?'#ffd23a':d.itemId==='gel'?'#74c9ff':d.itemId==='essf'?'#b981ef':'#72d88b';k.strokeStyle='#46351d';k.lineWidth=1;k.beginPath();k.ellipse(0,-4,d.itemId==='coin'?3:5,5,0,0,Math.PI*2);k.fill();k.stroke();k.font='9px sans-serif';k.textAlign='center';k.fillStyle='#ffe5af';k.fillText(d.itemId==='coin'?'เหรียญ':ITEMS[d.itemId]?.name||'ของดรอป',0,-13);k.restore();});}
 for(const m of s.battle?.entities||[]){if(m.dead||m.pending||m.hp<=0)continue;zpush(m.y,k=>{k.save();k.translate(m.x,m.y);const cyc=m.phase||0,hop=cyc>=.3&&cyc<.7?Math.sin((cyc-.3)/.4*Math.PI)*16:0;k.translate(0,-hop);k.fillStyle='#0004';k.beginPath();k.ellipse(0,1,13,4,0,0,7);k.fill();const gr=k.createRadialGradient(-4,-15,2,0,-9,16);gr.addColorStop(0,m.hurt>0?'#fff':'#c9e8ff');gr.addColorStop(.5,m.hurt>0?'#ffd0d0':'#4aa8ff');gr.addColorStop(1,m.hurt>0?'#ff8080':'#2a5fc4');k.fillStyle=gr;k.strokeStyle='#0f2d6e';k.lineWidth=1.5;k.beginPath();k.moveTo(-13,0);k.bezierCurveTo(-15,-14,-8,-21,0,-21);k.bezierCurveTo(8,-21,15,-14,13,0);k.quadraticCurveTo(0,3,-13,0);k.fill();k.stroke();k.fillStyle='#0b1e4a';k.fillRect(-6,-10,3,4);k.fillRect(3,-10,3,4);k.fillStyle='#fff';k.fillRect(-5,-10,1,1);k.fillRect(4,-10,1,1);k.fillStyle='#000a';k.fillRect(-12,-34,24,3);k.fillStyle='#e44';k.fillRect(-12,-34,24*m.hp/m.maxHp,3);k.font='9px sans-serif';k.textAlign='center';k.fillStyle='#9f9';k.fillText('Lv.'+m.level,0,-39);k.restore();});}
 if(s.battle?.swing){const swing=s.battle.swing,p=G.player,a={r:0,d:Math.PI/2,l:Math.PI,u:-Math.PI/2}[p.dir];zpush(p.y+1,k=>{k.strokeStyle=swing.spin?'#ffd06a':'#ffe6a6';k.lineWidth=swing.spin?4:3;k.beginPath();if(swing.spin){const angle=a+(swing.phase||0)*Math.PI*2;k.arc(p.x,p.y-8,swing.radius,angle-1.4,angle+1.4);}else {const phase=swing.phase||0;if(swing.combo===1){const angle=a+1-phase*2;k.arc(p.x,p.y-8,swing.radius,angle,angle+.8);}else {const angle=a-1+phase*2;k.arc(p.x,p.y-8,swing.radius,angle-.8,angle);}}k.stroke();});}
}
