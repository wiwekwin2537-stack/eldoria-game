/* Presentation-only mesh factories. No inventory, rewards, combat or saves. */
export function createModels(T){
 const mats=new Map(),geos=new Map();
 const mat=(c)=>{if(!mats.has(c))mats.set(c,new T.MeshStandardMaterial({color:c,roughness:.94,flatShading:true}));return mats.get(c)};
 function mesh(parent,geometry,color,x,y,z,sx=1,sy=1,sz=1){const m=new T.Mesh(geometry,mat(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 const geometry=(k,f)=>{if(!geos.has(k))geos.set(k,f());return geos.get(k)};
 const cube=geometry('box',()=>new T.BoxGeometry(1,1,1));
 const ico=geometry('ico',()=>new T.IcosahedronGeometry(1,1));
 function box(p,c,x,y,z,w,h,d){return mesh(p,cube,c,x,y,z,w,h,d)}
 function cyl(p,c,x,y,z,r,h,top=r,n=8){return mesh(p,geometry(`c${top/r}:${n}`,()=>new T.CylinderGeometry(top/r,1,1,n)),c,x,y,z,r,h,r)}
 function tree(seed=0){const g=new T.Group();g.name='tree';const brown='#6b482b';cyl(g,brown,0,1.6,0,.29,3.2,.19);
 for(let i=0;i<5;i++){const a=i*1.256;const branch=box(g,brown,Math.cos(a)*.42,2.5+(i%2)*.45,Math.sin(a)*.42,.18,1.5,.18);branch.rotation.z=Math.cos(a)*.7;branch.rotation.x=Math.sin(a)*.7}
 for(let i=0;i<9;i++){const a=i*2.399+seed*.3,r=i===0?0:1.03;mesh(g,ico,['#486b37','#618744','#78974a','#8aa653'][i%4],Math.cos(a)*r,3.2+(i%3)*.46,Math.sin(a)*r,1.3,1.13,1.22)}
 for(let i=0;i<4;i++){const a=i*Math.PI/2;cyl(g,brown,Math.cos(a)*.3,.18,Math.sin(a)*.3,.28,.35,.16)}return g}
 function ore(kind='iron'){const g=new T.Group();g.name='ore-'+kind;const colors={iron:'#a8b7c6',gold:'#e4bb53',diamond:'#6bcbe5'};for(let i=0;i<4;i++){const a=i*2.4;const m=mesh(g,ico,i%2?'#555d66':'#788087',Math.cos(a)*.4,.35+(i%2)*.18,Math.sin(a)*.4,.65,.55,.6);m.rotation.set(i*.3,i,0)}for(let i=0;i<5;i++){const a=i*2.399;const m=cyl(g,colors[kind]||colors.iron,Math.cos(a)*.47,.8+(i%2)*.15,Math.sin(a)*.47,.12,.75+(i%3)*.15,0,5);m.rotation.z=Math.sin(a)*.35}return g}
 function humanoid(colors={}){const g=new T.Group();g.name='hero-rig';const skin=colors.skin||'#f1d2b0',top=colors.top||'#3a465b',hair=colors.hair||'#241e25';
 box(g,top,0,1.02,0,.54,.62,.31);box(g,'#b79955',0,.83,.01,.57,.09,.34);box(g,skin,0,1.59,0,.48,.48,.42);box(g,hair,0,1.84,-.01,.51,.16,.45);box(g,hair,0,1.62,-.2,.5,.35,.11);
 for(let i=-1;i<=1;i++){const h=box(g,hair,i*.15,1.94,0,.16,.22,.34);h.rotation.z=-i*.13}for(const x of [-.11,.11])box(g,'#151824',x,1.6,.218,.055,.07,.025);
 const limbs=[];for(const s of [-1,1]){const leg=new T.Group();leg.position.set(s*.16,.76,0);g.add(leg);box(leg,'#242733',0,-.29,0,.23,.56,.25);box(leg,'#4c3a2d',0,-.64,.06,.25,.2,.36);limbs.push(leg);const arm=new T.Group();arm.position.set(s*.39,1.29,0);g.add(arm);box(arm,top,0,-.18,0,.2,.37,.23);box(arm,skin,0,-.45,.025,.19,.24,.21);limbs.push(arm)}
 const sword=new T.Group();sword.position.set(-.46,1,-.24);sword.rotation.z=-.35;g.add(sword);box(sword,'#b7d9df',0,.1,0,.12,.9,.05);box(sword,'#b79955',0,-.35,0,.32,.08,.08);box(sword,'#47362a',0,-.51,0,.09,.26,.09);
 g.userData.pose=(phase,walk)=>{const a=walk?Math.sin(phase)*.55:0;limbs[0].rotation.x=a;limbs[2].rotation.x=-a;limbs[1].rotation.x=-a*.65;limbs[3].rotation.x=a*.65};return g}
 function slime(){const g=new T.Group();g.name='slime';mesh(g,ico,'#79b55e',0,.48,0,.85,.65,.78);for(const x of [-.23,.23])box(g,'#183727',x,.63,.68,.08,.15,.04);return g}
 function building(w=5,d=4,roof='#667e6b',castle=false){const g=new T.Group();g.name=castle?'castle':'timber-house';const h=castle?4.5:2.5,cream='#d9cba7',timber='#6b4b32',stone='#a6a390';
 box(g,stone,0,.25,0,w+.35,.5,d+.35);box(g,cream,0,h/2+.5,0,w,h,d);
 for(const x of [-w/2+.09,w/2-.09])for(const z of [-d/2-.02,d/2+.02])box(g,timber,x,h/2+.5,z,.17,h,.15);
 for(const y of [.7,h*.55+.5,h+.5]){box(g,timber,0,y,d/2+.025,w+.05,.14,.15);box(g,timber,0,y,-d/2-.025,w+.05,.14,.15)}
 const shape=new T.Shape();shape.moveTo(-w*.6,0);shape.lineTo(0,w*.38);shape.lineTo(w*.6,0);shape.closePath();const rg=new T.ExtrudeGeometry(shape,{depth:d+.65,bevelEnabled:false});rg.translate(0,0,-(d+.65)/2);mesh(g,rg,roof,0,h+.5,0);
 for(const s of [-1,1]){const m=box(g,'#725637',s*w*.29,h+.5+w*.19,d/2+.36,w*.68,.12,.12);m.rotation.z=-s*Math.atan(.38/.6)}
 box(g,'#3b3028',0,1.1,d/2+.09,.9,1.5,.16);box(g,'#8b643a',0,1.05,d/2+.19,.71,1.32,.07);box(g,'#e6bd69',.23,1.03,d/2+.25,.07,.07,.07);
 for(const s of [-1,1]){const x=s*w*.32;box(g,timber,x,1.75,d/2+.12,.89,.92,.18);box(g,'#e7c57a',x,1.75,d/2+.23,.69,.72,.05);box(g,timber,x,1.75,d/2+.27,.06,.8,.05);box(g,timber,x,1.75,d/2+.27,.78,.06,.05);box(g,timber,x,1.19,d/2+.22,1.02,.2,.35);for(let j=0;j<4;j++)mesh(g,ico,j%2?'#bd758d':'#63894e',x+(j-1.5)*.19,1.38,d/2+.3,.14,.14,.14)}
 box(g,stone,w*.27,h+1,-d*.17,.66,1.7,.64);box(g,'#777d73',w*.27,h+1.9,-d*.17,.8,.2,.77);
 for(let row=0;row<3;row++)for(let col=0;col<4;col++)box(g,row%2?'#b6b19c':'#999c8e',(col-1.5)*w/4,.16+row*.14,d/2+.2,w/4-.05,.1,.16);
 if(castle)for(const s of [-1,1]){const x=s*(w/2+.35);cyl(g,stone,x,2.7,0,.85,5.4,.85,10);cyl(g,'#5c7f86',x,6,0,1.1,2.3,0,10);box(g,'#bfa35b',x,7.3,0,.1,.5,.1)}return g}
 function fountain(){const g=new T.Group();g.name='fountain';cyl(g,'#aaa995',0,.15,0,1.7,.3);cyl(g,'#799ea0',0,.34,0,1.42,.12);cyl(g,'#c2bba1',0,.85,0,.21,1.5,.17);cyl(g,'#c2bba1',0,1.48,0,.8,.18,.65);cyl(g,'#76b8c5',0,1.61,0,.57,.08);cyl(g,'#a8cfd2',0,1.9,0,.07,.6,.035);return g}
 return{box,cyl,tree,ore,humanoid,slime,building,fountain,dispose(){for(const m of mats.values())m.dispose();for(const g of geos.values())g.dispose()}};
}
