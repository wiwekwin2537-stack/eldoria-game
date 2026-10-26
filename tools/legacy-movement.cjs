/* Expose vetted legacy movement without copying formulas or loading game globals. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const EXPECTED={motion:'402ec43789ad15a549a80d9f7aeb6a96eae94b85bbd002d2418c1cc3a4d5486d',collision:'b59bd5b4c56a075dcb7d6bc9014cae1a318273120a9778ff4ff52f0868f2acc4',target:'328077cc3ecbf9d58d0dac714ce94c3621607a973c2ba0f6417e76dbb65de7c9',selection:'e48aec191fb3eaeba14ad823ec26c570628264cc734ccc00d24b20f8dd733626',speed:'bd41bd7cf349a290e5a758222879e0466266c33dcc1a3a27641287b397f8f5ee'};
function legacySources(){const s=fs.readFileSync(path.join(ROOT,'js/031-core.js'),'utf8'),frame=fs.readFileSync(path.join(ROOT,'js/070-core.js'),'utf8');
 const at=s.indexOf('function moveSlide(dx,dy){'),end=s.indexOf('{const _dh=dhit;',at),marker='if(D&&D.town){for(const [a,b] of [[-7,-4],[7,-4],[-7,4],[7,4]])',c=s.indexOf(marker,at),ce=s.indexOf('return false}',c),speed=frame.match(/const sp=\(P\.at>=0\?\.4:1\)[^;]+;/);
 if(at<0||end<0||c<0||ce<0||!speed)throw Error('Legacy movement source not found; re-audit before enabling 3D movement');
 const core=fs.readFileSync(path.join(ROOT,'js/014-core.js'),'utf8'),resource=fs.readFileSync(path.join(ROOT,'js/016-core.js'),'utf8');
 const ta=core.indexOf('const DIRV='),tb=core.indexOf('\n',core.indexOf('const target=',ta)),sa=resource.indexOf('const isBorder='),sb=resource.indexOf('function useToolHit',sa);
 if([ta,tb,sa,sb].some(n=>n<0))throw Error('Legacy targeting source missing; re-audit');
 const source={target:core.slice(ta,tb),selection:resource.slice(sa,sb),motion:s.slice(at,end),collision:s.slice(c+marker.indexOf('for'),ce+'return false'.length),speed:speed[0]};
 for(const [key,value]of Object.entries(source))if(crypto.createHash('sha256').update(value).digest('hex')!==EXPECTED[key])throw Error('Legacy '+key+' changed; re-audit movement and parity tests');return source;
}
function movementModule(){const s=legacySources();return `/* Generated at request time from vetted legacy sources; not a second gameplay implementation. */
export function createLegacyTargeting(P,world){
 const T=32,W=world.width,TREE=1,ORE=2,map=Array.from({length:world.height},()=>Array(W).fill(0)),treeAt={},oreAt={};
 /* Project visible resource footprints into the legacy tile lookup; no rewards or inventory. */
 const candidates=world.obstacles.filter(o=>/^(tree|ore)-/.test(o.id)),entities=new Map();
 for(const o of candidates){const kind=o.id.startsWith('tree-')?'tree':'ore',index=Number(o.id.split('-')[1]);entities.set(o.id,{...(kind==='tree'?world.trees:world.ores)[index],id:o.id})}
 for(let y=0;y<world.height;y++)for(let x=0;x<W;x++){
  const xx=x+.5-W/2,zz=y+.5-world.height/2;
  const matches=candidates.filter(o=>Math.abs(xx-o.x)<o.w/2+.5&&Math.abs(zz-o.z)<o.d/2+.5);
  matches.sort((a,b)=>Math.hypot(xx-a.x,zz-a.z)-Math.hypot(xx-b.x,zz-b.z));
  const o=matches[0];if(!o)continue;const kind=o.id.startsWith('tree-')?'tree':'ore';
  map[y][x]=kind==='tree'?TREE:ORE;(kind==='tree'?treeAt:oreAt)[y*W+x]=entities.get(o.id);
 }
 ${s.target}
 ${s.selection}
 return {target,pickTarget};
}
export function createLegacyMotion(P,dm){
 const T=32,FL=0,GATE=5,CARRY_SPD=1;let running=false;
 const window={},isRun=()=>running;
 const hit=(x,y)=>{${s.collision}};
 ${s.motion}
 return {hit,moveSlide,step(ix,iy,dt,run=false){
  if(![ix,iy,dt].every(Number.isFinite)||dt<=0)return;
  dt=Math.min(.05,dt);const n=Math.hypot(ix,iy);P.mv=n>0;if(!P.mv)return;
  const am=Math.min(1,n);ix/=n;iy/=n;running=run&&P.fa>3;
  ${s.speed}
  moveSlide(ix*sp,iy*sp);P.dir=Math.abs(ix)>Math.abs(iy)?(ix<0?'l':'r'):(iy<0?'u':'d');P.t+=dt*(running?13:8);
 }};
}
`}
module.exports={legacySources,movementModule};
