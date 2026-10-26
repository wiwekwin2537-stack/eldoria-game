/* World content adapter. Coordinates use one tile per world unit, 32 legacy pixels. */
export function createWorld(base){
 const W=base.width,H=base.height,width=W*2,height=H*2,ox=W/2,oz=H/2;
 const trees=[],ores=[],obstacles=[],river={x:width*.34,z:-height*.23,w:8,d:height*.48},bridge={x:width*.34,z:-height*.14,w:9,d:2.6};
 let seed=20261026;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<110;i++){const x=(random()-.5)*(width-5),z=(random()-.5)*(height-5);if((Math.abs(x)<ox+1&&Math.abs(z)<oz+1)||Math.abs(x)<3||Math.abs(z)<3||(x>width*.28&&z<0))continue;trees.push({x,z,seed:i,rotation:random()*6.28,scale:.7+random()*.5})}
 for(const [x,z]of [[-20,-14],[18,-13],[-20,11],[20,8],[-12,13],[11,13]])trees.push({x,z,seed:x,rotation:0,scale:.7});
 for(let i=0;i<12;i++)ores.push({x:-32+random()*12,z:-24+random()*7,kind:i%2?'gold':'iron'});
 const grid=Array.from({length:height},()=>Array(width).fill(0));
 /* Retain the old district's collision, open its perimeter into the new land. */
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)grid[y+H/2][x+W/2]=base.walk[y][x];
 function mark(box){obstacles.push(box);for(let y=0;y<height;y++)for(let x=0;x<width;x++){const xx=x+.5-width/2,zz=y+.5-height/2;if(Math.abs(xx-box.x)<box.w/2+.5&&Math.abs(zz-box.z)<box.d/2+.5)grid[y][x]=1}}
 for(const [id,s]of Object.entries(base.shops)){const [x,y,w,d]=s.b;mark({id:'shop-'+id,x:x+w/2-ox,z:y+d/2-oz,w:w*.85,d:d*.7})}
 mark({id:'castle',x:0,z:-11,w:10.1,d:5.4});mark({id:'fountain',x:0,z:3,w:3.4,d:3.4});mark({id:'camp',x:-27,z:18,w:4.35,d:3.35});
 for(let i=0;i<trees.length;i++){const t=trees[i];mark({id:'tree-'+i,x:t.x,z:t.z,w:1.1*t.scale,d:1.1*t.scale})}for(let i=0;i<ores.length;i++){const o=ores[i];mark({id:'ore-'+i,x:o.x,z:o.z,w:1.5,d:1.5})}
 mark({id:'river',...river});
 /* Bridge overrides water only, and is visibly wider than the river. */
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const xx=x+.5-width/2,zz=y+.5-height/2;if(Math.abs(xx-bridge.x)<bridge.w/2&&Math.abs(zz-bridge.z)<bridge.d/2)grid[y][x]=0;if(x===0||y===0||x===width-1||y===height-1)grid[y][x]=1}
 /* The display plinth is not a floor portal. Keep it out of the walking path. */
 mark({id:'model-plinth',x:-29,z:23,w:16,d:8});
 const legacySolids=[];
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(base.walk[y][x]===0||base.walk[y][x]===5)continue;const xx=x+.5-ox,zz=y+.5-oz;if(!obstacles.some(o=>Math.abs(xx-o.x)<o.w/2+.5&&Math.abs(zz-o.z)<o.d/2+.5))legacySolids.push({x:xx,z:zz})}
 const spawn={x:(base.spawn.x+W/2)*32,y:(base.spawn.y+H/2)*32};
 return{width,height,legacySolids,trees,ores,river,bridge,grid,spawn,obstacles,toRender(p){return{x:p.x/32-width/2,z:p.y/32-height/2}}};
}
