/* ตัวเชื่อมบทนำกับ route จริง ไม่มีปุ่มเพิ่มเงิน/เลื่อนบทเอง · ไม่เซฟ profile ฝั่ง client */
import { PROLOGUE as P } from '../data/prologue.js';
import { T } from '../config.js';
export function createPrologueClient(G,{request,ready,enter,stop=()=>{}}) {
  const S={mode:false,dialog:false,done:false,busy:false,error:'',story:null,profile:null,trace:[],pose:null};
  let bookmark=null,generation=0,last=null,flight=null;
  const restore=()=>{if(bookmark){enter(bookmark.id,bookmark.at,G);G.player.sp=bookmark.sp;bookmark=null;}stop();G.ui.prologueActive=false;delete G.ui.prologueBookmark;};
  function closeLocal(){generation++;S.mode=false;S.dialog=false;S.done=false;S.busy=false;S.trace=[];flight=null;last=null;restore();}
  function accept(r){if(r.story)S.story=r.story;if(r.profile){S.profile=r.profile;G.player.coin=r.profile.coin;if(r.profile.character){G.player.lv=r.profile.character.level;G.player.xp=r.profile.character.xp;}}if(r.actor)S.pose=r.actor;}
  const send=async command=>{if(!ready())throw new Error('offline');const r=await request({t:'prologue',command});if(r.t!=='prologue')throw new Error(r.why||'server');return r;};
  function sample(){if(!S.mode||G.scene?.id!==P.scene)return;const point={x:G.player.x,y:G.player.y,dir:G.player.dir};if(!last||Math.hypot(point.x-last.x,point.y-last.y)>.01||point.dir!==last.dir){S.trace.push(point);last=point;}if(S.trace.length>P.traceMax*10){S.error='lag';S.trace=[];last=null;if(S.pose){G.player.x=S.pose.x;G.player.y=S.pose.y;stop();}}}
  async function sync(){
    if(!S.mode||!S.trace.length)return true;if(flight)return flight;
    const gen=generation,trace=S.trace.splice(0,P.traceMax),dash=G.player.dash?.t>0;
    const run=(async()=>{try{const r=await send({op:'move',trace,dash});if(gen!==generation)return false;accept(r);if(!r.ok){S.error=r.error;S.trace=[];last=null;if(r.actor){G.player.x=r.actor.x;G.player.y=r.actor.y;stop();}return false;}return true;}catch(e){if(gen===generation)S.error=e.message;return false;}})();
    flight=run;try{return await run;}finally{if(flight===run)flight=null;}
  }
  async function action(op){
    if(S.busy)return false;S.busy=true;S.error='';const gen=generation;
    try{sample();if(flight&&!await flight)return false;while(S.trace.length)if(!await sync())return false;
      const r=await send({op});if(gen!==generation)return false;accept(r);if(!r.ok){S.error=r.error;return false;}
      S.dialog=true;S.done=r.story?.state.chapterId!=='awakening';return true;
    }catch(e){if(gen===generation)S.error=e.message;return false;}finally{if(gen===generation)S.busy=false;}
  }
  async function start(){
    if(S.busy||S.mode)return false;const gen=++generation;S.busy=true;S.error='';
    if(!bookmark&&G.scene){bookmark={id:G.scene.id,at:[G.player.x/T,G.player.y/T,G.player.dir],sp:G.player.sp};G.ui.prologueBookmark={scene:G.scene.id,x:G.player.x,y:G.player.y,dir:G.player.dir,sp:G.player.sp};}
    try{const r=await send({op:'start'});if(gen!==generation)return false;if(!r.ok){S.error=r.error;bookmark=null;delete G.ui.prologueBookmark;return false;}accept(r);S.done=r.story?.state.chapterId!=='awakening';S.dialog=S.done;
      S.mode=!S.done;G.ui.prologueActive=S.mode;S.trace=[];last=null;stop();if(S.mode)enter(P.scene,[r.actor.x/T,r.actor.y/T,r.actor.dir],G);return true;
    }catch(e){if(gen===generation){S.error=e.message;bookmark=null;delete G.ui.prologueBookmark;}return false;}finally{if(gen===generation)S.busy=false;}
  }
  function end(){if(ready())send({op:'end'}).catch(()=>{});closeLocal();}
  return {state:S,start,sample,sync,talk:()=>action('talk'),claim:()=>action('claim'),end,disconnect:closeLocal};
}
