/* Shared helpers for player-path browser tests (Phase 2): start a private server, drive the game with
   real input (clicks on visible buttons, held arrow keys, E/J/Shift/I keys) and read what the player sees. */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
const ROOT=path.join(__dirname,'..');
const PORT=String(process.env.PORT||8843);
const BASE='http://127.0.0.1:'+PORT,GAME_URL=BASE+'/?server=ws://127.0.0.1:'+PORT;
const NODE_PATH=[process.env.NODE_PATH,'/opt/npm-tools/node_modules'].filter(Boolean).join(':');

async function startServer(tag,extraEnv={}){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-'+tag+'-'));
 const server=spawn(process.execPath,['server.js'],{cwd:ROOT,env:{...process.env,NODE_PATH,PORT,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:'',...extraEnv},stdio:['ignore','pipe','inherit']});
 await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j);server.once('exit',c=>j(new Error('server exited '+c+' (port '+PORT+' busy or ws missing)')))});
 const stop=async()=>{server.kill();await new Promise(r=>server.exitCode!==null||server.signalCode?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})};
 return {server,dir,stop}}
async function launch(){return chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox','--enable-unsafe-swiftshader']})}
/* a fresh desktop "device": only our server is reachable; page errors are collected */
async function device(browser,errors){const c=await browser.newContext({viewport:{width:1000,height:640}});await c.route('**/*',r=>new URL(r.request().url()).origin===BASE?r.continue():r.abort());
 const p=await c.newPage();p.setDefaultTimeout(120000);p.on('pageerror',e=>errors.push(e.message));return {c,p}}
async function ready(p){await p.waitForFunction(()=>!window.FM_LOADING&&window.REG136);await p.waitForFunction(()=>!document.getElementById('boot106'))}
const pos=p=>p.evaluate(()=>[P.x,P.y]);
/* hold arrow keys toward a world point; side-step when blocked (like a player steering around a wall) */
async function walkTo(p,tx,ty,{tol=20,max=40000}={}){const K={l:'ArrowLeft',r:'ArrowRight',u:'ArrowUp',d:'ArrowDown'},down=new Set();
 const set=async want=>{for(const k of [...down])if(!want.has(k)){await p.keyboard.up(k);down.delete(k)}for(const k of want)if(!down.has(k)){await p.keyboard.down(k);down.add(k)}};
 const t0=Date.now();let last=null,stuck=0,detour=null,dt=0;
 try{while(Date.now()-t0<max){const [x,y]=await pos(p),dx=tx-x,dy=ty-y;if(Math.hypot(dx,dy)<tol)return true;
   if(last&&Math.hypot(x-last[0],y-last[1])<2)stuck++;else stuck=0;last=[x,y];
   if(stuck>4&&await p.locator('#dy108').isVisible().catch(()=>false)){await set(new Set());await closePopups(p);stuck=0;continue}
   if(stuck>4&&!detour){detour=Math.abs(dx)>Math.abs(dy)?(Math.random()<.5?'u':'d'):(Math.random()<.5?'l':'r');dt=6+Math.random()*8|0;stuck=0}
   const want=new Set();if(detour){want.add(K[detour]);if(--dt<=0)detour=null}else{if(Math.abs(dx)>6)want.add(dx<0?K.l:K.r);if(Math.abs(dy)>6)want.add(dy<0?K.u:K.d)}
   await set(want);await p.waitForTimeout(90)}return false}finally{await set(new Set())}}
/* tap through any story cutscene the way a player does (click "แตะเพื่อไปต่อ") */
async function tapCutscenes(p,settle=1200){await p.waitForTimeout(settle);const lines=[];
 for(let n=0;n<25&&await p.evaluate(()=>!cineEl.hidden);n++){lines.push(await p.locator('#cine .ct').innerText());await p.locator('#cine').click({position:{x:500,y:300}});await p.waitForTimeout(450)}return lines}
/* new-day check-in popup: claim then close with its ✕ */
async function closePopups(p){if(await p.locator('#dy108 .go108:not([disabled])').isVisible().catch(()=>false)){await p.locator('#dy108 .go108').click();await p.waitForTimeout(400)}
 if(await p.locator('#dy108').isVisible().catch(()=>false)){await p.locator('#dy108 .hd button').click();await p.waitForTimeout(300)}}
/* NPC dialog: click the box to finish typing, read text + choices, click the first choice; until closed */
async function readDialog(p,max=12){const seen=[];for(let i=0;i<max&&await p.evaluate(()=>DLG.open);i++){await p.locator('#dlg .dbox').click({position:{x:400,y:40}});await p.waitForTimeout(300);
  const text=await p.locator('#dlg .dtxt').innerText(),choices=await p.locator('#dlg .dch button').allInnerTexts();seen.push({text,choices});if(choices.length){await p.locator('#dlg .dch button').first().click();await p.waitForTimeout(300)}}return seen}
/* open a profile-menu entry (the HUD face → menu grid), the only visible route to bag/stats/skills */
async function profileMenu(p,label){await p.locator('#face').click();await p.locator('#pm7 button',{hasText:label}).first().click()}
/* hunt: walk up to the nearest live enemy and press J until it dies; returns kills */
async function hunt(p,n,{max=240000,until}={}){const t0=Date.now();let kills=0;
 while(kills<n&&Date.now()-t0<max){if(until&&await p.evaluate(until))break;await closePopups(p);
  const tg=await p.evaluate(()=>{let b=null,bd=1e9;for(const e of enemies()){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<bd){bd=d;b=e}}window.__tg=b;return b&&[b.x,b.y,bd]});
  if(!tg){await p.waitForTimeout(500);continue}
  if(tg[2]>40)await walkTo(p,tg[0],tg[1],{tol:34,max:5000});
  const gone=()=>p.evaluate(()=>!window.__tg||window.__tg.dead||!enemies().includes(window.__tg));
  for(let i=0;i<12&&!await gone();i++){await p.keyboard.press('j');await p.waitForTimeout(140)}
  if(await gone())kills++;if(await p.evaluate(()=>P.dead))throw new Error('player died while hunting')}
 return kills}
/* leave the throne hall: walk down the carpet to the door until the town scene loads (retry if a popup/cutscene interrupted) */
async function leaveHall(p){for(let i=0;i<5&&await p.evaluate(()=>!(D&&D.town));i++){await tapCutscenes(p,200);await closePopups(p);if(await p.evaluate(()=>DLG.open))await p.locator('#dlg .dx').click();
  await walkTo(p,416,760,{max:12000,tol:8});await p.waitForTimeout(1500)}await p.waitForFunction(()=>D&&D.town);await p.waitForTimeout(2000);await closePopups(p)}
/* wait for something the player sees; meanwhile clear what a player would clear (check-in popup, cutscene); dump state on timeout */
const state=p=>p.evaluate(()=>({tut:STORY.tut,tutText:gid('tut').hidden?'':gid('tut').innerText.split('\n')[1],paused:PAUSED,bag:!bagEl.hidden,cine:!cineEl.hidden,dlg:DLG.open,daily:!!(gid('dy108')&&gid('dy108').offsetParent),chp:!chp.hidden,skw:!skwEl.hidden,menu:typeof menuEl!=='undefined'&&!menuEl.hidden,shop:!shopEl.hidden,D:D?(D.town?'town':D.shop||'zone'):'field',lv:P.lv,toast:gid('msg').textContent}));
async function waitSee(p,fn,{timeout=60000,arg}={}){const t0=Date.now();while(Date.now()-t0<timeout){if(await p.evaluate(fn,arg))return true;await closePopups(p);if(await p.evaluate(()=>!cineEl.hidden))await tapCutscenes(p,0);await p.waitForTimeout(700)}
 throw new Error('waitSee timeout: '+fn.toString().slice(0,120)+' state='+JSON.stringify(await state(p)))}
/* what the player can see on the HUD */
const hud=p=>p.evaluate(()=>({lvText:gid('xpt').textContent,coinText:gid('coinhud').textContent,toast:gid('msg').textContent,tracker:qtEl.hidden?'':qtEl.innerText,tutorial:gid('tut').hidden?'':gid('tut').innerText}));
module.exports={ROOT,PORT,BASE,GAME_URL,startServer,launch,device,ready,pos,walkTo,tapCutscenes,closePopups,readDialog,profileMenu,hunt,hud,leaveHall,waitSee,state};
