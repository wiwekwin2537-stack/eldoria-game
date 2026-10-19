/* v5.38: painted mount atlases; shared by local/remote rendering, lazy-loaded per species. */
const MOUNTART={keys:['horse','unicorn','flame','wolf','pegasus','drake','dgold','dfrost','tiger','kirin','phoenix'],sheets:{},version:'5.38'};
MOUNTART.load=function(key){
 if(!this.keys.includes(key))return null;if(this.sheets[key])return this.sheets[key];
 const s=this.sheets[key]={state:'loading',image:new Image(),rows:[],frames:[]};
 s.ready=new Promise(resolve=>{s.image.onload=async()=>{try{await this.prepare(key,s);s.state='ready'}catch(e){s.state='failed';console.warn('mount atlas',key,e)}resolve(s)};s.image.onerror=()=>{s.state='failed';resolve(s)}});
 s.image.src='assets/mounts/'+key+'.png?v='+this.version;return s;
};
MOUNTART.prepare=async function(key,s){
 const cw=Math.floor(s.image.naturalWidth/4),ch=Math.floor(s.image.naturalHeight/3);
 for(let row=0;row<3;row++){let minx=cw,miny=ch,maxx=0,maxy=0;const frames=[];
  for(let f=0;f<4;f++){const c=document.createElement('canvas');c.width=cw;c.height=ch;const q=c.getContext('2d',{willReadFrequently:true});q.drawImage(s.image,f*cw,Math.round(row*s.image.naturalHeight/3),cw,ch,0,0,cw,ch);const data=q.getImageData(0,0,cw,ch),p=data.data,seen=new Uint8Array(cw*ch);let largest=[];
   /* Retain the connected animal, excluding stray wing/hoof tips crossing atlas cell edges. */
   for(let i=0;i<seen.length;i++){if(seen[i]||p[i*4+3]<48)continue;const group=[i];seen[i]=1;for(let at=0;at<group.length;at++){const n=group[at],x=n%cw,y=(n/cw)|0;for(const m of [x>0?n-1:-1,x<cw-1?n+1:-1,y>0?n-cw:-1,y<ch-1?n+cw:-1])if(m>=0&&!seen[m]&&p[m*4+3]>=48){seen[m]=1;group.push(m)}}if(group.length>largest.length)largest=group}
   if(!largest.length)throw Error('empty frame');const keep=new Uint8Array(cw*ch);for(const i of largest){keep[i]=1;const x=i%cw,y=(i/cw)|0;minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y)}for(let i=0;i<keep.length;i++)if(!keep[i])p[i*4+3]=0;q.putImageData(data,0,0);frames.push(c);await new Promise(resolve=>setTimeout(resolve,0));
  }
  s.frames.push(frames);s.rows.push({x:minx,y:miny,w:maxx-minx+1,h:maxy-miny+1,cw});
 }
};
MOUNTART.geometry=function(key,dir){
 const s=this.load(key);if(!s||s.state!=='ready')return null;const row=dir==='u'?1:dir==='d'?2:0,r=s.rows[row],fly=['pegasus','drake','dgold','dfrost','phoenix'].includes(key);
 /* Stable union bounds per row prevent changing sprite size between frames. Saddle anchored near y=-38. */
 const height=row===0?(fly?92:78):96,width=height*r.w/r.h;
 const seatY=row===0?(fly?.54:.36):row===1?.40:.33;
 return {s,r,row,w:width,h:height,dx:-width*.5,dy:-38-height*seatY};
};
MOUNTART.paint=function(key,x,y,dir,moving,phase=0){
 const g=this.geometry(key,dir);if(!g)return false;const {s,r,w,h,dx,dy}=g;
 const f=moving?Math.floor(performance.now()/1000*10)%4:1,breathe=moving?0:Math.sin(performance.now()/650)*.55;
 ctx.save();ctx.translate(x,y+breathe);if(dir==='l')ctx.scale(-1,1);
 if(phase!==0){if(dir!=='d'){ctx.restore();return true}ctx.beginPath();ctx.rect(-w*.14,dy+h*.25,w*.28,h*.65);ctx.clip()}
 else{ctx.fillStyle='rgba(10,20,24,.22)';ctx.beginPath();ctx.ellipse(0,dy+h-2,g.row===0?34:18,5,0,0,Math.PI*2);ctx.fill()}
 ctx.drawImage(s.frames[g.row][f],r.x,r.y,r.w,r.h,dx,dy,w,h);ctx.restore();return true;
};
window.MOUNTART=MOUNTART;
