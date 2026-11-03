/* Actual game, authenticated isolated accounts, old vs new XP path and saved reload. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn,execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const fixture=require('./fixtures/xp_chain_before.json');
(async()=>{const root=path.resolve(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-xp-')),port='8878',base='http://127.0.0.1:'+port;let browser;
const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:port,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
try{await new Promise(r=>server.stdout.once('data',r));const post=async(p,d)=>(await fetch(base+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d)})).json();
browser=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader']});const errors=[],results=[];
for(const before of [true,false]){
 const id=before?'xp_before':'xp_after',reg=await post('/api/register',{id,pw:'Test1234',protocol:2,name:'ทดสอบXP'});assert(reg.ok);
 const main={v:1,t:0,name:'ทดสอบXP',lv:10,xp:0,sp:0,stats:{str:1,vit:1,int:1,agi:1,end:1},hp:100,mp:50,fa:100,hu:100,armor:{sword:null,helm:null,chest:null,pants:null,arm:null,neck:null,ring:null},tier:{sword:0,axe:0,pick:0},tool:'sword',draw:false,bagLv:0,inv:{coin:123},gear:{},enh:{},sk:[],qs:[],day:0,buffs:[]};
 assert((await post('/api/save',{id,token:reg.token,protocol:2,base:0,seq:1,lv:10,save:JSON.stringify({fm_save_v1:JSON.stringify(main),fm_name:main.name,fm_cc41:'1',fm_story:JSON.stringify({intro:1,tut:99,ch:0})})})).ok);
 const ctx=await browser.newContext({viewport:{width:1000,height:700}});
 await ctx.addInitScript(({id,token})=>{localStorage.setItem('cloud_tok_'+id,token);localStorage.setItem('fm_last_acct',id);localStorage.setItem('fm_remember','1');sessionStorage.setItem('fm_acct',id);sessionStorage.setItem('fm_go','1')},{id,token:reg.token});
 const originals=new Map();if(before)for(const f of ['js/030-core.js',...new Set(fixture.stages.map(s=>s.file))])originals.set('/'+f,execFileSync('git',['show',fixture.commit+':'+f],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}));
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==base)return r.abort();if(originals.has(u.pathname))return r.fulfill({contentType:'application/javascript',body:originals.get(u.pathname)});return r.continue()});
 const page=await ctx.newPage();page.setDefaultTimeout(120000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/?server=ws://127.0.0.1:'+port,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!window.FM_LOADING&&window.REG136&&ONL32.verified&&ON10.auth&&!document.getElementById('boot106'));
 const out=await page.evaluate(async()=>{
  window.__qa154=true;titleEl.hidden=true;intro.hidden=true;CINE.L=null;cineEl.hidden=true;TUT.on=false;gid('tut').hidden=true;PAUSED=true;
  const ev=[];EventBus.on(EV.XP_GAINED,d=>ev.push(['xp',d]));EventBus.on(EV.LEVEL_UP,d=>ev.push(['lv',d]));
  const out=[],snap=k=>out.push({k,lv:P.lv,xp:P.xp,sp:P.sp,hp:P.hp,mp:P.mp,pg:JSON.parse(JSON.stringify(E92.pg)),events:ev.splice(0),err:PSTATE.lastError?.msg||null});
  E92.pg={lv:0,xp:0,a:{dmg:0,hp:0,dr:0,crit:0}};EV11.cur=null;window.__noXpm64=true;
  P.lv=10;P.xp=0;P.sp=0;P.hp=BAL.hp;P.mp=BAL.mp;gainXp(100);snap('normal');
  P.lv=9;P.xp=need(9)-1;gainXp(100);snap('class unlock');
  P.lv=99;P.xp=need(99)-1;window.__noXpm64=false;EV11.cur={k:'xp'};gainXp(100);snap('high level event');
  EV11.cur=null;P.lv=199;P.xp=need(199)-1;gainXp(100);snap('reach cap');gainXp(100);snap('legend');
  window.__noXpm64=true;gainXp(100);snap('legend no test multiplier');
  P.lv=160;P.xp=0;enterZone(RZI93);await new Promise(r=>setTimeout(r,300));PAUSED=true;D.mobs.length=0;RG93.combo=0;RG93.partyN=0;RN153.q.length=0;RN153.share=1;RN153.ema=.1;gainXp(1000);RN153.share=0;snap('party quota');
  RN153.q.push({t:performance.now(),n:1000,f:.1});gainXp(1000);snap('kill quota matching');
  RN153.q.length=0;RN153.tok=60;RN153.ema=1;const Zd=D.zone.Zd,q=Zd.mobs[0],m=mkMob(q[0],q[1],q[2],155,P.x+20,P.y+20,{});m.my33=1;D.mobs.push(m);const oldCoin=inv.coin;mobKill(m);await new Promise(r=>setTimeout(r,180));snap('actual mob kill');out.push({k:'kill',dead:!!m.dead,coinGained:inv.coin>oldCoin});
  exitD();P.lv=10;P.xp=0;P.sp=0;EV11.cur=null;window.__noXpm64=true;gainXp(100);window.__qa154=false;saveGame();return out;
 });
 assert.equal(out.find(x=>x.k==='normal').xp,80);assert.equal(out.find(x=>x.k==='class unlock').lv,10);assert.equal(out.find(x=>x.k==='class unlock').sp,3);assert.equal(out.find(x=>x.k==='reach cap').lv,200);assert.equal(out.find(x=>x.k==='reach cap').xp,0);assert.equal(out.find(x=>x.k==='legend').pg.xp,500);assert.equal(out.find(x=>x.k==='legend').events.length,0);assert.equal(out.find(x=>x.k==='legend no test multiplier').pg.xp,600);assert(out.find(x=>x.k==='kill').dead);assert(out.find(x=>x.k==='kill').coinGained);assert.equal(out.find(x=>x.k==='actual mob kill').events.filter(e=>e[0]==='xp').length,1,'one kill must grant XP once');
 assert.equal(await page.evaluate(()=>CLOUD.sync(true)),true);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!window.FM_LOADING&&window.REG136&&ONL32.verified&&ON10.auth&&!document.getElementById('boot106'));
 assert.deepEqual(await page.evaluate(()=>({lv:P.lv,xp:P.xp,sp:P.sp})),{lv:10,xp:80,sp:0},'XP survives server save and reload');results.push(out);await ctx.close();
}
assert.deepEqual(results[1],results[0],'actual game behavior must match pinned main');assert.deepEqual(errors,[]);console.log('PASS XP browser: old/new normal, level/stat/class, high-level/event, cap/legend, party/kill quota, actual kill grants once, authenticated save/reload');
}finally{await browser?.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}})().catch(e=>{console.error(e);process.exitCode=1});
