// Service worker — เปิดเร็ว/เล่นออฟไลน์ได้ · อัปเดตเกมอัตโนมัติ (เช็กเวอร์ชันใหม่จากเว็บก่อนเสมอ)
// ทุกครั้งที่อัปเดตเกมแล้วอยากให้ SW ตัวใหม่เข้ามาแทนที่ทันที ให้เปลี่ยนเลขเวอร์ชันบรรทัดล่างนี้ (v51 → v52 ...)
const C='eldoria-v138';const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','loading.jpg','assets/trees/oak.png','assets/trees/ancient.png','assets/trees/fire.png','assets/trees/spirit.png','assets/diamond-ore.png','assets/ores/stone.png','assets/ores/iron.png','assets/ores/copper.png','assets/ores/silver.png','assets/ores/gold.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys(),upgrading=ks.some(k=>k.startsWith('eldoria-v')&&k!==C);await Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)));await self.clients.claim();if(upgrading){await new Promise(r=>setTimeout(r,20000));const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});await Promise.all(cs.map(c=>c.navigate(c.url).catch(()=>null)))}})())});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
