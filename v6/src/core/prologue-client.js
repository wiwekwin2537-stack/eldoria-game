/* ตัวเชื่อมบทนำกับ route จริง ไม่มีปุ่มเพิ่มเงิน/เลื่อนบทเอง · ไม่เซฟ profile ฝั่ง client */
import { PROLOGUE as P } from '../data/prologue.js';
import { T } from '../config.js';
export function createPrologueClient(G,{request,ready,enter,stop=()=>{}}) {
  const S={mode:false,dialog:false,done:false,busy:false,error:'',story:null,profile:null,battle:null,field:false,trace:[],pose:null};
  let bookmark=null,generation=0,last=null,flight=null;
  const restore=()=>{if(bookmark){enter(bookmark.id,bookmark.at,G);G.player.sp=bookmark.sp;G.player.hp=bookmark.hp;G.player.maxHp=bookmark.maxHp;bookmark=null;}stop();G.ui.prologueActive=false;G.ui.prologueField=false;G.player.moving=false;delete G.ui.prologueBookmark;};
  function closeLocal(){generation++;S.mode=false;S.field=false;S.battle=null;S.dialog=false;S.done=false;S.busy=false;S.trace=[];flight=null;last=null;restore();}
  function accept(r){if(r.story)S.story=r.story;if(r.profile){S.profile=r.profile;G.player.coin=r.profile.coin;if(r.profile.character){G.player.lv=r.profile.character.level;G.player.xp=r.profile.character.xp;}}if(r.battle)S.battle=r.battle;if(r.actor){S.pose=r.actor;const field=r.actor.scene==='field';if(S.mode&&(field||S.field)){if(G.scene.id!==r.actor.scene)enter(r.actor.scene,[r.actor.x/T,r.actor.y/T,r.actor.dir],G);G.player.x=r.actor.x;G.player.y=r.actor.y;G.player.dir=r.actor.dir;if(Number.isFinite(r.actor.sp))G.player.sp=r.actor.sp;G.player.moving=!!r.actor.moving;if(field&&Number.isFinite(r.actor.hp)){G.player.hp=r.actor.hp;G.player.maxHp=r.actor.maxHp;}else if(!field&&S.field&&bookmark){G.player.hp=bookmark.hp;G.player.maxHp=bookmark.maxHp;}}S.field=field;G.ui.prologueField=field;}}
  const send=async command=>{if(!ready())throw new Error('offline');const r=await request({t:'prologue',command});if(r.t!=='prologue')throw new Error(r.why||'server');return r;};
  function sample(){if(!S.mode||G.scene?.id!==P.scene)return;const point={x:G.player.x,y:G.player.y,dir:G.player.dir};if(!last||Math.hypot(point.x-last.x,point.y-last.y)>.01||point.dir!==last.dir){S.trace.push(point);last=point;}if(S.trace.length>P.traceMax*10){S.error='lag';S.trace=[];last=null;if(S.pose){G.player.x=S.pose.x;G.player.y=S.pose.y;stop();}}}
  async function sync(){
    if(!S.mode)return true;if(flight)return flight;if(S.field)return fieldSync();if(!S.trace.length)return true;
    const gen=generation,trace=S.trace.splice(0,P.traceMax),dash=G.player.dash?.t>0;
    const run=(async()=>{try{const r=await send({op:'move',trace,dash});if(gen!==generation)return false;accept(r);if(!r.ok){S.error=r.error;S.trace=[];last=null;if(r.actor){G.player.x=r.actor.x;G.player.y=r.actor.y;stop();}return false;}return true;}catch(e){if(gen===generation)S.error=e.message;return false;}})();
    flight=run;try{return await run;}finally{if(flight===run)flight=null;}
  }
  async function fieldSync(){const gen=generation;const run=(async()=>{try{const r=await send({op:'input',mx:G.paused||G.cam?.portrait?0:G.input?.mx||0,my:G.paused||G.cam?.portrait?0:G.input?.my||0,run:!!G.input?.run});if(gen!==generation)return false;accept(r);if(!r.ok){S.error=r.error;return false;}return true;}catch(e){if(gen===generation)S.error=e.message;return false;}})();flight=run;try{return await run;}finally{if(flight===run)flight=null;}}
  async function action(op,extra={}){
    if(S.busy)return false;S.busy=true;S.error='';const gen=generation;
    try{sample();if(flight&&!await flight)return false;while(S.trace.length)if(!await sync())return false;
      const r=await send({op,...extra});if(gen!==generation)return false;accept(r);if(!r.ok){S.error=r.error;return false;}
      S.dialog=!['field','hall','attack','potion'].includes(op);S.done=r.story?.state.chapterId!=='awakening';S.trace=[];last=null;return true;
    }catch(e){if(gen===generation)S.error=e.message;return false;}finally{if(gen===generation)S.busy=false;}
  }
  async function start(){
    if(S.busy||S.mode)return false;const gen=++generation;S.busy=true;S.error='';
    if(!bookmark&&G.scene){bookmark={id:G.scene.id,at:[G.player.x/T,G.player.y/T,G.player.dir],sp:G.player.sp,hp:G.player.hp,maxHp:G.player.maxHp};G.ui.prologueBookmark={scene:G.scene.id,x:G.player.x,y:G.player.y,dir:G.player.dir,sp:G.player.sp};}
    try{const r=await send({op:'start'});if(gen!==generation)return false;if(!r.ok){S.error=r.error;bookmark=null;delete G.ui.prologueBookmark;return false;}accept(r);S.done=r.story?.state.chapterId!=='awakening';S.dialog=S.done;
      S.mode=['awakening','first-light'].includes(r.story?.state.chapterId);S.dialog=!S.mode;G.ui.prologueActive=S.mode;S.trace=[];last=null;stop();if(S.mode){enter(r.actor.scene,[r.actor.x/T,r.actor.y/T,r.actor.dir],G);accept(r);}return true;
    }catch(e){if(gen===generation){S.error=e.message;bookmark=null;delete G.ui.prologueBookmark;}return false;}finally{if(gen===generation)S.busy=false;}
  }
  function end(){if(ready())send({op:'end'}).catch(()=>{});closeLocal();}
  return {state:S,start,sample,sync,talk:()=>action('talk'),claim:()=>action(S.story?.state.chapterId==='first-light'?'claim-first-light':'claim'),field:()=>action('field'),hall:()=>action('hall'),potion:()=>action('potion',{encounterId:S.pose?.encounterId,sequence:(S.pose?.potionSequence||0)+1}),attack:()=>action('attack',{sequence:(S.battle?.sequence||0)+1}),end,disconnect:closeLocal};
}
