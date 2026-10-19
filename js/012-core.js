// โหลดภาพอาคาร/ลายพื้นจากโฟลเดอร์ assets/
const ART={};for(const n of ['castle','market','inn','house1','house2','fountain','cobble']){ART[n]=new Image();ART[n].src=ASSETS[n]}

/* v5.37: ภาพเมืองเอลโดเรียแยกจาก ART ที่เมืองอื่นใช้ร่วมกัน; ไม่เปลี่ยนแผนที่ชนหรือประตู */
const TOWNART={settled:false,pending:[],sheets:{shops:{src:'assets/town/shops.png',state:'loading'},landmarks:{src:'assets/town/landmarks.png',state:'loading'}},frames:{
 house:{sheet:'shops',r:[25,47,396,383]},gear:{sheet:'shops',r:[463,20,408,410],d:[.405,.665,.135,.852]},
 store:{sheet:'shops',r:[905,45,404,385],d:[.66,.63,.15,.85]},inn:{sheet:'shops',r:[1343,40,416,386],d:[.506,.65,.16,.85]},
 skill:{sheet:'shops',r:[18,435,408,424],d:[.485,.656,.16,.85]},potion:{sheet:'shops',r:[464,488,404,371],d:[.46,.65,.15,.85]},
 guild:{sheet:'shops',r:[895,432,424,428],d:[.446,.675,.15,.88]},fashion:{sheet:'shops',r:[1346,467,417,392],d:[.472,.66,.15,.88]},
 castle:{sheet:'landmarks',r:[19,2,540,475]},bank:{sheet:'landmarks',r:[570,16,409,458],d:[.486,.69,.175,.91]},
 ware:{sheet:'landmarks',r:[1024,62,486,414],d:[.519,.655,.214,.90]},seal113:{sheet:'landmarks',r:[37,500,505,488],d:[.495,.715,.174,.925]},
 tower:{sheet:'landmarks',r:[600,478,331,514]},templeFloor:{sheet:'landmarks',r:[1140,726,260,210]},
 templeRear:{sheet:'landmarks',r:[1140,525,280,205]},templePillar:{sheet:'landmarks',r:[1034,788,112,190]}
}};
TOWNART.ready=function(role){const f=this.frames[role],s=f&&this.sheets[f.sheet];return !!(s&&s.state==='ready')};
TOWNART.paint=function(k,role,x,y,w,h,shop){const f=this.frames[role];if(!f||!this.ready(role))return false;const s=this.sheets[f.sheet],r=f.r;if(r[0]+r[2]>s.image.naturalWidth||r[1]+r[3]>s.image.naturalHeight)return false;const cut=window.TOWNLIFE&&TOWNLIFE.mask(k,role,x,y,w,h,shop);if(shop&&f.d){const cx=f.d[0],dw=f.d[2],a=cx-dw/2,b=cx+dw/2,center=shop.door.x+shop.door.w/2,middle=dw*w,left=center-middle/2,right=center+middle/2;k.drawImage(s.image,r[0],r[1],r[2]*a,r[3],x,y,left,h);k.drawImage(s.image,r[0]+r[2]*a,r[1],r[2]*dw,r[3],x+left,y,middle,h);k.drawImage(s.image,r[0]+r[2]*b,r[1],r[2]*(1-b),r[3],x+right,y,w-right,h)}else k.drawImage(s.image,...r,x,y,w,h);if(cut)k.restore();return true};
TOWNART.watch=function(fn){if(!this.settled)this.pending.push(fn)};
TOWNART.buildingScale=1.42;
TOWNART.bind=function(k,role,x,y,w,h,fallback,after,shop){let roof=0,roofBase=y;if(shop||role==='house'){roof=h*(this.buildingScale-1);y-=roof;h+=roof}if(window.TOWNLIFE)TOWNLIFE.register(role,x,y,w,h,shop);let base=null;if(!this.settled){const t=k.getTransform();base=document.createElement('canvas');base.width=Math.ceil(w);base.height=Math.ceil(h);base.getContext('2d').drawImage(k.canvas,x+t.e,y+t.f,w,h,0,0,w,h)}
 const paint=()=>{if(base){k.clearRect(x,y,w,h);k.drawImage(base,x,y,w,h)}const used=this.paint(k,role,x,y,w,h,shop);if(!used&&fallback)fallback();if(after)after(used)};paint();this.watch(paint);if(roof>0&&typeof prop==='function'){prop(kk=>{kk.save();kk.beginPath();kk.rect(x,y,w,roof);kk.clip();this.paint(kk,role,x,y,w,h,shop);kk.restore()},roofBase,x,y,w,Math.ceil(roof),false,true);TOWNPROPS[TOWNPROPS.length-1].townVisual={role,x,y,w,h,shop,roof}}};
TOWNART.door=function(id,S,tile){const f=this.frames[id];if(!f||!f.d||!this.ready(id))return null;const [bx,by,bw,bh]=S.b,[cx,top,w,bot]=f.d;const height=bh*tile*this.buildingScale,base=(by+bh)*tile-height;return {x:bx*tile+S.door.x+S.door.w/2-w*bw*tile/2,w:w*bw*tile,top:base+top*height,bot:base+bot*height}};
TOWNART.finish=function(){if(this.settled||Object.values(this.sheets).some(s=>s.state==='loading'))return;this.settled=true;const todo=this.pending.splice(0);for(const fn of todo)try{fn()}catch(e){console.warn('town art redraw',e)}
 if(todo.length)try{if(D&&D.town&&!D.shop&&dcv)mkMini(dcv,TW,TH,2.6);else if(D&&D.shop&&typeof TOWNSAVE!=='undefined'&&TOWNSAVE&&TOWNSAVE.D&&TOWNSAVE.D.town&&!TOWNSAVE.D.city2)this.dirtyMini=TOWNSAVE.dcv}catch(e){}};
for(const s of Object.values(TOWNART.sheets)){const im=s.image=new Image();const done=ok=>{if(s.state!=='loading')return;clearTimeout(s.timer);s.state=ok&&im.naturalWidth>0?'ready':'failed';TOWNART.finish()};im.onload=()=>done(true);im.onerror=()=>done(false);s.timer=setTimeout(()=>done(false),20000);im.src=s.src}
window.TOWNART=TOWNART;
