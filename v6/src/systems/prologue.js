/* หน้าจอบทนำเฉพาะโหมดทดสอบ opt-in · หน้าเกมปกติไม่เปลี่ยนจุดเกิด/การเดิน */
import * as net from '../core/net.js';
import { on } from '../core/bus.js';
import { zpush } from '../core/zsort.js';
import { enter } from './world.js';
import { stopClick } from './movement.js';
import { createPrologueClient } from '../core/prologue-client.js';
import { PROLOGUE as P } from '../data/prologue.js';
import { CHAPTERS } from '../data/story.js';
const ERR={near:'เดินเข้าไปใกล้พระราชาก่อนครับ',offline:'การเชื่อมต่อขาด กรุณาลองใหม่',speed:'ตำแหน่งกำลังปรับให้ตรงกับเซิร์ฟเวอร์ ลองอีกครั้ง',wall:'ทางนี้มีสิ่งกีดขวาง',lag:'กำลังปรับตำแหน่งหลังการเชื่อมต่อช้า','bag-full':'กระเป๋าเต็ม กรุณาจัดของก่อนรับรางวัล','bag-weight':'น้ำหนักเกิน กรุณาจัดของก่อนรับรางวัล','coin-full':'เงินเต็ม ยังไม่ได้รับรางวัล',session:'กรุณาโหลดตัวละครใหม่',start:'กรุณาเริ่มบทนำใหม่'};
let C=null,U=null,loaded=false,elapsed=0,im=null,cleanup=[];
function el(tag,text,id){const e=document.createElement(tag);if(text)e.textContent=text;if(id)e.id=id;return e;}
function render(){if(!U||!C)return;const s=C.state,available=loaded&&net.hasFeature('prologue');U.root.hidden=!available;U.start.disabled=!net.isReady()||s.busy;U.start.hidden=s.mode||s.dialog;
 U.bar.hidden=!s.mode||s.dialog;U.dialog.hidden=!s.dialog;U.error.textContent=s.error?(ERR[s.error]||'ทำรายการไม่สำเร็จ กรุณาลองใหม่'):'';
 const title=s.done?'บทนำจบแล้ว':'พระราชาอัลดริค';if(U.title.textContent!==title)U.title.textContent=title;
 const body=s.done?CHAPTERS[0].outro:CHAPTERS[0].intro;if(U.body.textContent!==body)U.body.textContent=body;
 U.claim.hidden=s.done;U.claim.disabled=s.busy||!net.isReady();U.close.disabled=s.busy;
 U.done.textContent=s.done?'รางวัลบทนำบันทึกแล้ว ภารกิจต่อไปยังไม่พร้อมเล่นในรุ่นนี้':'';
 if(s.profile){const p=s.profile;const text='🪙 '+p.coin+' · Lv.'+(p.character?.level||1)+' · อุปกรณ์ '+Object.keys(p.inventory?.gear||{}).length+' ชิ้น';if(U.reward.textContent!==text)U.reward.textContent=text;}
}
export default {
 id:'prologue',always:true,
 init(G){if(typeof document==='undefined')return;const ui=document.getElementById('ui');if(!ui)return;
  const style=el('style');style.textContent='#p0{position:absolute;inset:0;pointer-events:none!important;font-size:14px}#p0 button,#p0 section{pointer-events:auto}#p0 [hidden]{display:none!important}#p0 button{font:inherit;min-height:44px;border:1px solid #d9b16c;border-radius:10px;background:#392a20;color:#ffe5af;padding:8px 14px}#p0-start{position:absolute;top:calc(12px + env(safe-area-inset-top));right:calc(12px + env(safe-area-inset-right))}#p0-bar{position:absolute;top:calc(10px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);background:#221b16e8;border:1px solid #bc9659;border-radius:12px;padding:8px;max-width:70vw;text-align:center}#p0-dialog{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(420px,78vw);max-height:76vh;overflow:auto;background:#211b16f7;border:1px solid #bc9659;border-radius:14px;padding:16px;box-shadow:0 12px 40px #0009}#p0 h3{margin:0 0 8px;color:#ffd689}#p0 p{line-height:1.6;margin:8px 0}#p0-error{position:absolute;top:72px;left:50%;transform:translateX(-50%);color:#ffbfaa;text-shadow:0 2px 2px #000;max-width:70vw;text-align:center}#p0 button:disabled{opacity:.5}';
  const root=el('div',null,'p0'),start=el('button','📜 เริ่มบทนำ','p0-start'),bar=el('section',null,'p0-bar'),dialog=el('section',null,'p0-dialog');root.hidden=true;
  const hint=el('p','เดินไปหาพระราชา แล้วกด E หรือแตะคุย'),talk=el('button','คุยกับพระราชา','p0-talk'),back=el('button','กลับไปเล่น','p0-back');bar.append(hint,talk,back);
  const title=el('h3'),body=el('p'),done=el('p'),reward=el('p'),claim=el('button','รับชุดเริ่มต้น','p0-claim'),close=el('button','กลับไปเล่น','p0-close'),error=el('p',null,'p0-error');dialog.append(title,body,reward,done,claim,close);root.append(start,bar,dialog,error);ui.append(style,root);
  U={root,start,bar,dialog,title,body,done,reward,claim,close,error};C=createPrologueClient(G,{request:net.request,ready:net.isReady,enter,stop:stopClick});
  start.onclick=async()=>{await C.start();render();};talk.onclick=async()=>{await C.talk();render();};claim.onclick=async()=>{await C.claim();render();};back.onclick=close.onclick=()=>{C.end();render();};
  cleanup.push(on('save:loaded',()=>{loaded=true;render();}),on('net:status',d=>{if(!d.online&&C)C.disconnect();}),on('net:kicked',()=>{C.disconnect();}));render();
 },
 update(G,dt){if(!C)return;const s=C.state;if(s.mode){C.sample();elapsed+=dt;if(elapsed>=P.syncMs/1000&&!s.busy){elapsed=0;C.sync();}if(!s.dialog&&G.input?.pressed.has('interact'))C.talk();}render();},
 draw(G,ctx,layer){if(layer!=='world'||!C?.state.mode||G.scene?.id!==P.scene)return;
  if(!im&&typeof Image!=='undefined'){im=new Image();im.src='/'+P.king.src;}
  zpush(P.king.y,k=>{if(im?.naturalWidth){const [w,h]=P.king.size;k.drawImage(im,C.state.dialog?P.king.cell[0]*2:0,C.state.dialog?P.king.cell[1]*3:0,...P.king.cell,P.king.x-w/2,P.king.y-h,w,h);}k.font='11px sans-serif';k.fillStyle='#ffdf90';k.textAlign='center';k.fillText('พระราชาอัลดริค',P.king.x,P.king.y-52);k.textAlign='left';});
 },
 _reset(){for(const fn of cleanup)fn();cleanup=[];C?.disconnect();U?.root.remove();C=U=im=null;loaded=false;elapsed=0;},
};
