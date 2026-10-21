/* Code checks for updates; artwork is reused locally without delaying display. */
const C='eldoria-v156';
const IMAGES='eldoria-images-v1';
const CORE=['./','index.html','manifest.webmanifest'];
const IMAGE_LIMIT=128;
const isImage=url=>/\.(?:png|jpe?g|webp|gif|svg|ico)$/i.test(url.pathname);
const immutableImage=url=>/-v\d+[.-]/.test(url.pathname);
async function storeImage(request,response){
 if(!response||!response.ok||!/^image\//i.test(response.headers.get('content-type')||''))return;
 try{const cache=await caches.open(IMAGES);await cache.put(request,response);const keys=await cache.keys();await Promise.all(keys.slice(0,Math.max(0,keys.length-IMAGE_LIMIT)).map(key=>cache.delete(key)))}catch(_){} /* Quota failure must never block the game. */
}
self.addEventListener('install',event=>{event.waitUntil((async()=>{
 const cache=await caches.open(C);
 await Promise.all(CORE.map(url=>cache.add(new Request(url,{cache:'reload'})).catch(()=>{})));
 await self.skipWaiting();
})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('eldoria-v')&&key!==C).map(key=>caches.delete(key)));
 if(keys.includes(IMAGES)){const images=await caches.open(IMAGES);const old=await images.keys();await Promise.all(old.filter(request=>{const url=typeof request==='string'?request:request.url;return url&&new URL(url,location.origin).pathname==='/assets/monsters/creatures-v549.webp'}).map(request=>images.delete(request)))}
 await self.clients.claim();
})())});
self.addEventListener('message',event=>{if(event.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api/'))return;
 if(isImage(url)){
  /* Register lifetime work synchronously, so background revalidation can finish. */
  const result=(async()=>{
   const cache=await caches.open(IMAGES).catch(()=>null),hit=cache&&await cache.match(request).catch(()=>null);
   const download=async()=>{const response=await fetch(request);await storeImage(request,response.clone());return response};
   if(hit){return {response:hit,update:immutableImage(url)?Promise.resolve():download().catch(()=>{})}}
   try{return {response:await download(),update:Promise.resolve()}}catch(_){return {response:new Response('',{status:503,statusText:'Asset unavailable'}),update:Promise.resolve()}}
  })();
  event.respondWith(result.then(value=>value.response));
  event.waitUntil(result.then(value=>value.update));
  return;
 }
 const response=fetch(request,{cache:'no-cache'});
 event.waitUntil(response.then(value=>value&&value.ok?caches.open(C).then(cache=>cache.put(request,value.clone())):null).catch(()=>{}));
 event.respondWith(response.catch(()=>caches.match(request).then(hit=>hit||(request.mode==='navigate'?caches.match('index.html'):new Response('',{status:503,statusText:'Asset unavailable'})))));
});
