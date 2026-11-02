/* เปลี่ยนเฉพาะภาพ: โหลดช้า/พลาดใช้ของเดิม, วาดใหม่ไม่สร้างฉากหรือแก้สถานะเกม */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('js/012-core.js','utf8'),start=src.indexOf('const TOWNART=');assert.ok(start>=0,'town-specific art registry must exist');
function world(){const images=[],calls=[],timers=[];const canvas=()=>{const c={width:1408,height:1088};c.getContext=()=>({canvas:c,getTransform:()=>({e:0,f:0}),drawImage:(...v)=>calls.push(['draw',...v]),clearRect:(...v)=>calls.push(['clear',...v])});return c};
 const b={Image:class{constructor(){images.push(this)}},document:{createElement:()=>canvas()},setTimeout:(f)=>{timers.push(f);return timers.length},clearTimeout(){},console,D:{shop:'gear'},dcv:null,mkMini:()=>calls.push(['mini'])};b.window=b;vm.createContext(b);vm.runInContext(src.slice(start),b);return {b,images,calls,canvas,timers};}
{
 const {b,images,calls,canvas}=world(),state=b.D,k=canvas().getContext('2d');let old=0,labels=0;
 b.TOWNART.bind(k,'store',10,20,160,128,()=>old++,()=>labels++);assert.equal(old,1,'pending image draws old building immediately');
 images[0].naturalWidth=1774;images[0].naturalHeight=887;images[0].onload();assert.equal(b.TOWNART.settled,false,'wait for all sheets before repainting the pending scene');
 images[1].naturalWidth=1536;images[1].naturalHeight=1024;images[1].onload();assert.equal(b.TOWNART.settled,true);assert.equal(old,1,'ready image replaces fallback');assert.equal(labels,2);assert.equal(b.D,state,'image load never rebuilds or switches scene');assert.equal(calls.some(x=>x[0]==='mini'),false,'loading while inside shop never changes its minimap');
 for(const key of ['house','gear','store','inn','skill','potion','guild','fashion','castle','bank','ware','seal113','tower','templeFloor','templeRear','templePillar'])assert.equal(b.TOWNART.ready(key),true,key);
 const s={b:[29,12,5,4],door:{x:62,w:36,t:74,bt:126}};const geom=b.TOWNART.door('store',s,32);assert.ok(geom.w>0&&geom.bot>geom.top);assert.equal(geom.x+geom.w/2,29*32+80,'painted entrance aligns with original walking target');
 assert.equal(b.TOWNART.paint(k,'missing',0,0,10,10),false);
}
{
 const {b,images,canvas}=world();let fallback=0;b.TOWNART.bind(canvas().getContext('2d'),'gear',0,0,160,192,()=>fallback++);images[0].onerror();images[1].onerror();assert.equal(b.TOWNART.settled,true);assert.equal(b.TOWNART.ready('gear'),false);assert.equal(fallback,2,'failed images keep a visible original building');
}
{
 const {b,images,canvas}=world();b.TOWNSAVE={D:{town:true},dcv:canvas()};b.TOWNART.bind(canvas().getContext('2d'),'house',0,0,160,128,()=>{});images[0].onerror();images[1].onerror();assert.equal(b.TOWNART.dirtyMini,b.TOWNSAVE.dcv,'late load inside town shop marks saved town minimap');
}
{
 const {b,images,canvas}=world();b.TOWNSAVE={D:{city2:true},dcv:canvas()};b.TOWNART.bind(canvas().getContext('2d'),'house',0,0,160,128,()=>{});images[0].onerror();images[1].onerror();assert.equal(b.TOWNART.dirtyMini,undefined,'other city minimap is untouched');
}
console.log('TOWN BUILDING ART PASS');
