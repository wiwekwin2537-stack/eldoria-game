/* v5.41: scene-specific loading artwork; presentation never changes map destinations. */
const SCENEART={sources:{town:'assets/ui/loading-v543.webp',forest:'assets/ui/scene-forest-v543.webp',cave:'assets/ui/scene-cave-v543.webp',fire:'assets/ui/scene-fire-v543.webp',ice:'assets/ui/scene-ice-v543.webp',sea:'assets/ui/scene-sea-v543.webp'},images:{}};
SCENEART.pick=function(zone){const text=[zone&&zone.id,zone&&zone.n,zone&&zone.name,zone&&zone.f,zone&&zone.theme].join(' ').toLowerCase();if(/ice|snow|frost|winter|หิมะ|น้ำแข็ง|เหมันต์/.test(text))return 'ice';if(/fire|lava|volcan|ember|flame|เพลิง|ภูเขาไฟ|อัคคี/.test(text))return 'fire';if(/sea|ocean|coast|harbor|port|tide|ทะเล|สมุทร|ท่าเรือ|วารี/.test(text))return 'sea';if(/cave|dungeon|crypt|shadow|void|tower|ถ้ำ|ดันเจี้ยน|หอคอย|ผนึก|สุสาน|อนธ/.test(text))return 'cave';if(/town|city|castle|เมือง|ปราสาท/.test(text))return 'town';return 'forest'};
/* A scene never waits for its artwork: show the embedded town preview underneath. */
SCENEART.load=function(key){
 if(this.images[key])return this.images[key].promise;
 const image=this.images[key]=new Image();image.fetchPriority='low';
 image.promise=new Promise(resolve=>{
  let timer;const done=ok=>{clearTimeout(timer);image.onload=image.onerror=null;if(!ok)delete this.images[key];resolve(ok)};
  image.onload=()=>done(!!image.naturalWidth);image.onerror=()=>done(false);
  timer=setTimeout(()=>done(false),10000);image.src=this.sources[key];
 });return image.promise;
};
SCENEART.present=function(el,zone){
 const key=this.pick(zone);el.dataset.scene=key;
 el.style.backgroundImage='linear-gradient(180deg,rgba(3,9,18,.15),rgba(3,9,18,.12) 40%,rgba(3,9,18,.92)),url("'+this.sources[key]+'"),url("'+this.sources.town+'"),var(--loading-preview)';
 this.load(key);
};
SCENEART.warm=async function(){
 const connection=navigator.connection;
 if(connection&&(connection.saveData||/^(slow-2g|2g)$/.test(connection.effectiveType)))return;
 for(const key of Object.keys(this.sources)){if(document.hidden)break;await this.load(key)}
};
(document.readyState==='complete'?fn=>fn():fn=>window.addEventListener('load',fn))(()=>{
 const start=()=>SCENEART.warm().catch(()=>{});
 if(window.requestIdleCallback)requestIdleCallback(start,{timeout:8000});else setTimeout(start,1500);
},{once:true});
window.SCENEART=SCENEART;
