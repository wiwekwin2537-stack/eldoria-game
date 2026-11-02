// fix49 (v4.54) — เควสต้องไม่ติด: บท 15 (ตลาด) และบท 16 (บอสโลก) เดิมต้องรอผู้เล่นอื่น/ต้องให้บอสตายก่อน → ผู้เล่นที่อยู่คนเดียวทำต่อไม่ได้
//   บท 15: เปิดแผงขายของในตลาดกลาง (มีของบนแผง) ก็นับว่าสำเร็จ · บท 16: ลงมือตีบอสโลก (ส่งดาเมจขึ้นเซิร์ฟเวอร์) ก็นับว่าร่วมปราบแล้ว
try{
{const i=STCH.findIndex(c=>c.ch11&&/ตลาด/.test(c.t));if(i>=0)STCH[i].d='ไปตลาดกลาง แล้วเปิดแผงขายของ หรือซื้อ/ขายกับผู้เล่นคนอื่น 1 ครั้ง'}
{const i=STCH.findIndex(c=>c.ch11&&/บอสโลก/.test(c.d));if(i>=0)STCH[i].d='ร่วมตีบอสโลก 1 ครั้ง (ปรากฏ 12:00 และ 20:00 น.)'}
setInterval(()=>{try{if(!(STORY.mk11)&&typeof STALL10!=='undefined'&&STALL10.open&&STALL10.items&&STALL10.items.length){STORY.mk11=1;saveStory()}}catch(e){}},1000);
{const _s=WebSocket.prototype.send;WebSocket.prototype.send=function(d){try{if(!STORY.wb11&&typeof d==='string'&&d.startsWith('{"t":"wbhit"')){STORY.wb11=1;saveStory()}}catch(e){}return _s.apply(this,arguments)}}
}catch(e){console.warn('fix49',e)}
