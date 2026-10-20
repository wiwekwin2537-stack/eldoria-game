/* All item factories are now registered. Request only artwork used by the visible UI. */
ITEMART.active=true;ITEMART.refresh();

if(window.REG136)REG136.push(
 ['ชุดและอาวุธกลับเป็นภาพสคริปต์ ไม่โหลดatlasชุด (v542)',async()=>Object.keys(ITEMS).filter(id=>!['axe','pick'].includes(ITEMS[id].kind)).every(id=>!ITEMART.has('item:'+id))?null:'ยังผูกภาพชุดใหม่'],
 ['ภาพขวานและที่ขุดใช้PNGเล็ก12ไฟล์ (v542)',async()=>ITEMART.gearKeys.length===12&&ITEMART.gearKeys.every(k=>/^item:(axe|pick)[0-5]$/.test(k))?null:'ภาพเครื่องมือไม่ตรงขอบเขต']);
