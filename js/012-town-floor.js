/* v5.38: town-only ground material; asynchronous loading keeps the original floor until the next town render. */
const TOWNFLOOR={state:'loading',image:new Image(),pending:[],tiles:{}};
TOWNFLOOR.image.onload=()=>{TOWNFLOOR.state='ready';const callbacks=TOWNFLOOR.pending.splice(0);for(const fn of callbacks)fn()};
TOWNFLOOR.image.onerror=()=>{TOWNFLOOR.state='failed';TOWNFLOOR.pending.length=0};
TOWNFLOOR.image.src='assets/town/ground-v538.png';
TOWNFLOOR.tile=function(kind){if(this.tiles[kind])return this.tiles[kind];const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d'),i=this.image,w=i.naturalWidth/2,h=i.naturalHeight/2;const p={stone:[0,0],grass:[1,0],earth:[0,1],marble:[1,1]}[kind];q.drawImage(i,p[0]*w,p[1]*h,w,h,0,0,128,128);return this.tiles[kind]=c};
TOWNFLOOR.paint=function(k,rd){
 if(this.state!=='ready')return false;const make=()=>{const floor=document.createElement('canvas');floor.width=TW*T;floor.height=TH*T;const q=floor.getContext('2d'),patterns={};for(const kind of ['stone','grass','earth','marble'])patterns[kind]=q.createPattern(this.tile(kind),'repeat');
  for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){q.fillStyle=patterns[rd.has(y*TW+x)?'stone':'grass'];q.fillRect(x*T,y*T,T,T)}
  q.fillStyle=patterns.earth;q.fillRect(30*T,19*T,11*T,5*T);q.fillStyle=patterns.marble;q.fillRect(3*T,18*T,9*T,9*T);
  /* Thin stone edging follows the existing road footprint. */
  q.fillStyle='rgba(240,223,179,.6)';for(let y=0;y<TH;y++)for(let x=0;x<TW;x++)if(rd.has(y*TW+x))for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){if(x+dx<0||y+dy<0||x+dx>=TW||y+dy>=TH||rd.has((y+dy)*TW+x+dx))continue;dx?q.fillRect(x*T+(dx>0?T-2:0),y*T,2,T):q.fillRect(x*T,y*T+(dy>0?T-2:0),T,2)}
  k.save();k.drawImage(floor,0,0);k.restore();
 };
 make();return true;
};
window.TOWNFLOOR=TOWNFLOOR;
