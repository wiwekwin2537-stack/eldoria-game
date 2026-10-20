/* All item factories are now registered. Request only artwork used by the visible UI. */
ITEMART.active=true;ITEMART.refresh();

if(window.REG136)REG136.push(
 ['ชุดและอาวุธกลับเป็นภาพสคริปต์ ไม่โหลดatlasชุด (v542)',async()=>Object.keys(ITEMS).filter(id=>!['axe','pick'].includes(ITEMS[id].kind)).every(id=>!ITEMART.has('item:'+id))?null:'ยังผูกภาพชุดใหม่'],
 ['ภาพขวานและที่ขุดใช้ภาพเล็ก12ไฟล์ (v542)',async()=>ITEMART.gearKeys.length===12&&ITEMART.gearKeys.every(k=>/^item:(axe|pick)[0-5]$/.test(k))?null:'ภาพเครื่องมือไม่ตรงขอบเขต']);

if(window.REG136)REG136.push(['ภาพหน้าโหลดรุ่นเบาและไม่บล็อกการเข้าแมพ (v543)',async()=>Object.values(SCENEART.sources).every(src=>/-v543\.webp$/.test(src))&&!!document.querySelector('link[rel="preload"][as="image"][fetchpriority="high"]')&&getComputedStyle(document.documentElement).getPropertyValue('--loading-preview').includes('data:image/webp')?null:'ภาพหน้าโหลดหรือภาพสำรองไม่พร้อม']);

if(window.REG136)REG136.push(['ภาพไอเท็มทุกชุดใช้ไฟล์WebPรุ่นเบา (v543)',async()=>ITEMART.sheets.length===25&&ITEMART.sheets.every(sheet=>/-v543(?:-\d+)?\.webp$/.test(sheet.src))&&new Set(ITEMART.sheets.map(sheet=>sheet.src)).size===25?null:'ไอเท็มยังใช้ภาพใหญ่หรือเส้นทางซ้ำ']);
