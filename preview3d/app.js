import {createModels} from './models.js';
import {createWorld} from './world.mjs';
import {createWalker} from './walk.js';
const status=document.getElementById('status'),error=document.getElementById('error');
function fail(message){error.hidden=false;error.textContent=message;status.textContent='ยังเปิดฉากไม่ได้';}
async function start(){
 const T=window.THREE;if(!T)throw Error('โหลดเครื่องมือ 3D ไม่สำเร็จ กรุณาลองใหม่');
 const response=await fetch('/scene.json');if(!response.ok)throw Error('โหลดข้อมูลฉากไม่สำเร็จ');const data=await response.json();
 const renderer=new T.WebGLRenderer({canvas:document.getElementById('scene'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene();scene.background=new T.Color('#c4d4cd');scene.fog=new T.Fog('#c4d4cd',65,155);
 const camera=new T.OrthographicCamera(-20,20,15,-15,.1,260),M=createModels(T),world=new T.Group();scene.add(world);
 const sky=new T.HemisphereLight('#fff3d5','#556d4e',1.9);scene.add(sky);const sun=new T.DirectionalLight('#ffe5b8',2.5);sun.position.set(-20,42,25);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-50;sun.shadow.camera.right=50;sun.shadow.camera.top=50;sun.shadow.camera.bottom=-50;sun.shadow.camera.far=120;sun.shadow.normalBias=.07;scene.add(sun);
 const worldData=createWorld(data.base),walker=await createWalker(T,worldData);
 const {createLegacyTargeting}=await import('./legacy-motion.js'),targeting=createLegacyTargeting(walker.P,worldData);
 const W=data.base.width,H=data.base.height,EW=worldData.width,EH=worldData.height,ox=W/2,oz=H/2;
 const add=(model,x,z)=>{model.position.set(x,0,z);world.add(model);return model};
 M.box(world,'#778c57',0,-.3,0,EW,.55,EH);
 /* Old district keeps its dimensions; the added ring has real world coordinates. */
 M.box(world,'#91a269',0,.015,0,W,.045,H);
 const baseBox=new T.Box3(new T.Vector3(-ox,.03,-oz),new T.Vector3(ox,.03,oz));const boundary=new T.Box3Helper(baseBox,'#e4c36e');boundary.visible=false;scene.add(boundary);
 const expansionBox=new T.Box3Helper(new T.Box3(new T.Vector3(-EW/2,.03,-EH/2),new T.Vector3(EW/2,.03,EH/2)),'#d8e6ce');expansionBox.visible=false;scene.add(expansionBox);
 const stoneMat=new T.MeshStandardMaterial({color:'#b9b49b',roughness:1});
 const tileGeo=new T.BoxGeometry(.9,.07,.9),tiles=[];
 /* Read the existing baseline collision fixture, rather than duplicate shop coordinates. */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(data.base.walk[y][x]===0&&((y>=16&&y<=18)||(x>=20&&x<=24)||(y>=28&&y<=29)))tiles.push([x-ox+.5,y-oz+.5]);
 for(let y=-EH/2;y<EH/2;y++)if(y<-oz||y>oz)for(let dx=-1;dx<=1;dx++)tiles.push([dx+.5,y+.5]);
 for(let x=-EW/2;x<EW/2;x++)if(x<-ox||x>ox)for(let dy=-1;dy<=1;dy++)tiles.push([x+.5,dy+.5]);
 const pavement=new T.InstancedMesh(tileGeo,stoneMat,tiles.length);const matrix=new T.Matrix4();tiles.forEach(([x,z],i)=>{matrix.makeTranslation(x,.06,z);pavement.setMatrixAt(i,matrix)});pavement.receiveShadow=true;scene.add(pavement);
 const roofs={gear:'#677781',potion:'#65784a',inn:'#904c4b',skill:'#4d6c83',store:'#547c60',guild:'#486f79',fashion:'#a36877',bank:'#577d83',seal113:'#656c87',ware:'#9c6d47'};
 for(const [id,shop]of Object.entries(data.base.shops)){const [x,y,w,d]=shop.b;const b=add(M.building(w*.85,d*.7,roofs[id]),x+w/2-ox,y+d/2-oz);b.userData={role:id,owner:shop.owner};b.name='shop-'+id;}
 const castle=add(M.building(8,5,'#547789',true),0,-11);castle.name='castle';
 add(M.fountain(),0,3);
 /* New land: woodlands, crystal outcrop, a river and a quiet roadside camp. */
 const river=M.box(world,'#639da1',worldData.river.x,.02,worldData.river.z,worldData.river.w,.08,worldData.river.d);river.name='river';const bridge=worldData.bridge;M.box(world,'#b7a27c',bridge.x,.15,bridge.z,bridge.w,.3,bridge.d);
 for(const t of worldData.trees){const g=add(M.tree(t.seed),t.x,t.z);g.rotation.y=t.rotation;g.scale.setScalar(t.scale)}
 for(const b of worldData.legacySolids)M.box(world,'#aaa58d',b.x,.33,b.z,.98,.66,.98);
 const rigs=[];for(const n of data.base.npcs){if(!Number.isFinite(n.x)||!Number.isFinite(n.y))continue;const g=add(M.humanoid({top:n.name.includes('ทหาร')?'#3a5a9a':'#786c57'}),n.x-ox,n.y-oz);g.scale.setScalar(.8);g.rotation.y=.35;g.name='npc-'+n.name;rigs.push(g)}
 const modelRoot=new T.Group();modelRoot.name='model-display';modelRoot.position.set(-29,0,23);world.add(modelRoot);
 M.box(modelRoot,'#b0ac8c',0,.08,0,16,.16,8);
 const hero=M.humanoid();hero.position.set(-4,.2,1);hero.scale.setScalar(1.6);modelRoot.add(hero);rigs.push(hero);
 const tree=M.tree(4);tree.position.set(3,.16,-1);modelRoot.add(tree);for(const [i,k]of ['iron','gold','diamond'].entries()){const o=M.ore(k);o.position.set(i*2-1,.16,2);modelRoot.add(o)}
 const slime=M.slime();slime.position.set(-.7,.16,-1.8);modelRoot.add(slime);
 add(M.building(4,3,'#855a46'),-27,18);for(const o of worldData.ores)add(M.ore(o.kind),o.x,o.z);
 const traveler=add(M.humanoid(),0,0);traveler.name='controlled-player';const spawnWorld=worldData.toRender(walker.P);traveler.position.set(spawnWorld.x,0,spawnWorld.z);
 /* Batch static geometry by geometry/material; keep rigs and slime live for animation. */
 world.updateMatrixWorld(true);
 const batches=new Map(),dynamic=new Set([hero,slime,traveler]);
 world.traverse(node=>{if(!node.isMesh)return;for(let p=node;p;p=p.parent)if(dynamic.has(p))return;
  const key=node.geometry.uuid+'|'+node.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(node);
 });
 for(const nodes of batches.values()){const first=nodes[0],batch=new T.InstancedMesh(first.geometry,first.material,nodes.length);batch.name='static-batch';nodes.forEach((n,i)=>{batch.setMatrixAt(i,n.matrixWorld);n.removeFromParent()});batch.castShadow=true;batch.receiveShadow=true;scene.add(batch)}
 const targetMarker=new T.Mesh(new T.RingGeometry(.75,.88,32),new T.MeshBasicMaterial({color:'#ffe391',side:T.DoubleSide,depthWrite:false}));targetMarker.rotation.x=-Math.PI/2;targetMarker.visible=false;scene.add(targetMarker);
 const targetInfo=document.getElementById('target-info');
 const view={name:'town',angle:.38,span:36,target:new T.Vector3(0,0,1),min:5,max:115};
 const views={town:{x:0,z:1,span:36,angle:.38},forest:{x:-27,z:-22,span:27,angle:.45},models:{x:-29,z:23,span:11,angle:.3},walk:{x:spawnWorld.x,z:spawnWorld.z,span:14,angle:0}};
 function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);const aspect=w/h;camera.left=-view.span*aspect/2;camera.right=view.span*aspect/2;camera.top=view.span/2;camera.bottom=-view.span/2;camera.updateProjectionMatrix()}
 function setView(name){const v=views[name];if(!v)return;view.name=name;view.target.set(v.x,0,v.z);view.span=v.span;view.angle=v.angle;walker.setEnabled(name==='walk');targetInfo.hidden=name!=='walk';targetMarker.visible=false;document.body.classList.toggle('walking',name==='walk');document.getElementById('hint').textContent=name==='walk'?'จอยหรือ WASD เพื่อเดิน · Ctrl/ปุ่มวิ่งเพื่อวิ่ง · ลากฉากเพื่อหมุนกล้อง':'ลากเพื่อหมุนมุมมอง · เลื่อนล้อเพื่อซูม';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));resize()}
 function zoom(factor){view.span=T.MathUtils.clamp(view.span*factor,view.min,view.max);resize()}
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
 document.getElementById('plus').onclick=()=>zoom(.8);document.getElementById('minus').onclick=()=>zoom(1.25);document.getElementById('reset').onclick=()=>setView(view.name);
 document.getElementById('bounds').onclick=e=>{boundary.visible=expansionBox.visible=!boundary.visible;e.currentTarget.setAttribute('aria-pressed',String(boundary.visible));document.getElementById('hint').innerHTML=boundary.visible?`เส้นทอง: เมืองเดิม ${W} × ${H}<br>เส้นอ่อน: พื้นที่ทดลอง ${EW} × ${EH} (4 เท่า)`:'ลากเพื่อหมุนมุมมอง · เลื่อนล้อเพื่อซูม<br>ใช้ปุ่มด้านล่างสำรวจเมือง ป่า และโมเดล'};
 const canvas=renderer.domElement;let drag=null;
 canvas.addEventListener('pointerdown',e=>{if(drag)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;view.angle+=(e.clientX-drag.x)*.007;drag.x=e.clientX;drag.y=e.clientY});
 const end=e=>{if(drag?.id===e.pointerId)drag=null};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(T.MathUtils.clamp(e.deltaY*.001,-.3,.3)))},{passive:false});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('อุปกรณ์หยุดแสดงภาพ 3D กรุณาโหลดหน้านี้ใหม่ เกมและเซฟเดิมไม่ได้รับผลกระทบ')});
 let frames=0,last=performance.now(),timer=last;
 function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;hero.userData.pose(now*.004,view.name==='models');if(walker.enabled){walker.tick(dt,view.angle);const pos=worldData.toRender(walker.P);traveler.position.set(pos.x,0,pos.z);if(walker.P.mv)traveler.rotation.y={u:Math.PI,d:0,l:-Math.PI/2,r:Math.PI/2}[walker.P.dir];traveler.userData.pose(walker.P.t,walker.P.mv);view.target.set(pos.x,0,pos.z)}const selected=walker.enabled?targeting.pickTarget():null;targetMarker.visible=!!selected?.o;if(selected?.o){targetMarker.position.set(selected.o.x,.12,selected.o.z);targetInfo.textContent=(selected.kind==='tree'?'ต้นไม้ · ใช้ขวาน':'แร่'+({iron:'เหล็ก',gold:'ทอง',diamond:'เพชร'}[selected.o.kind]||'')+' · ใช้ที่ขุดแร่')+' · ตรวจเป้าเท่านั้น ยังเก็บของไม่ได้'}else if(walker.enabled)targetInfo.textContent='เดินเข้าใกล้และหันหาต้นไม้หรือแร่เพื่อตรวจเป้า';slime.scale.y=1+Math.sin(now*.002)*.07;
 camera.position.set(view.target.x+Math.sin(view.angle)*45,36,view.target.z+Math.cos(view.angle)*45);camera.lookAt(view.target);renderer.render(scene,camera);frames++;if(now-timer>1500){status.textContent=`พื้นที่ ${EW} × ${EH} · ต้นแบบภาพ · ${Math.round(frames*1000/(now-timer))} FPS บนอุปกรณ์นี้`;timer=now;frames=0}requestAnimationFrame(frame)}
 window.ELDORIA3D={ready:true,scene,camera,renderer,view,setView,base:data.base,dimensions:{width:EW,height:EH,areaRatio:4},source:data.source,mode:'movement-prototype',gameplayConnected:false,movementConnected:true,targeting,targetMarker,walker,worldData,traveler};
 addEventListener('resize',resize);resize();status.textContent=`พร้อมแสดงภาพ · เมืองเดิม ${W} × ${H} → พื้นที่ทดลอง ${EW} × ${EH}`;requestAnimationFrame(frame);
}
start().catch(e=>{console.error(e);fail(e.message||'เปิดฉาก 3D ไม่สำเร็จ')});
