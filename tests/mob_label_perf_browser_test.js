/* เกมหน่วง (v5.77): ทุ่งสังหารมอนเยอะ → ป้ายชื่อ/เลเวลมอน (strokeText+fillText) ต้องไม่วาดทุกตัวทุกเฟรม
   เช็ก: มอน 150 ตัวบนจอ → strokeText ต่อเฟรม ≤ 90 (โค้ดเดิม ~155) · มอน ≤ 40 ตัว → ป้ายครบทุกตัวเหมือนเดิม · หลอดเลือดยังวาดทุกตัว
   รัน: NODE_PATH=/opt/npm-tools/node_modules ELD_CHROMIUM=... node tests/mob_label_perf_browser_test.js   (พอร์ต ENV ELD_TEST_PORT ค่าเริ่ม 8846) */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
const PORT=process.env.ELD_TEST_PORT||'8846',base='http://127.0.0.1:'+PORT;
(async()=>{const root=path.join(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'eld-moblbl-')),errors=[];let browser;
const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT,DATA_DIR:dir,UPSTASH_REDIS_REST_URL:'',UPSTASH_REDIS_REST_TOKEN:''},stdio:['ignore','pipe','inherit']});
try{await new Promise(r=>server.stdout.once('data',r));
 const post=async(p,d)=>(await fetch(base+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d)})).json(),id='moblbl_test',pw='Test1234';
 const reg=await post('/api/register',{id,pw,protocol:2,name:'ทดสอบป้าย'});assert.equal(reg.ok,true);
 const main={v:1,t:0,name:'ทดสอบป้าย',lv:160,xp:0,sp:0,stats:{str:1,vit:1,int:1,agi:1,end:1},hp:100,mp:50,fa:100,hu:100,armor:{sword:null,helm:null,chest:null,pants:null,arm:null,neck:null,ring:null},tier:{sword:0,axe:0,pick:0},tool:'sword',draw:false,bagLv:0,inv:{coin:1},gear:{},enh:{},sk:[],qs:[],day:0,buffs:[]};
 assert.equal((await post('/api/save',{id,token:reg.token,protocol:2,base:0,seq:1,lv:160,save:JSON.stringify({fm_save_v1:JSON.stringify(main),fm_name:main.name,fm_cc41:'1',fm_story:JSON.stringify({intro:1,tut:99,ch:0})})})).ok,true);
 browser=await chromium.launch({executablePath:process.env.ELD_CHROMIUM,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const c=await browser.newContext({viewport:{width:915,height:412},isMobile:true,hasTouch:true});
 await c.addInitScript(({seed,id})=>{localStorage.setItem('cloud_tok_'+id,seed);localStorage.setItem('fm_last_acct',id);localStorage.setItem('fm_remember','1');sessionStorage.setItem('fm_acct',id);sessionStorage.setItem('fm_go','1')},{seed:reg.token,id});
 await c.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 const p=await c.newPage();p.setDefaultTimeout(180000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/?server=ws://127.0.0.1:'+PORT,{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>!window.FM_LOADING&&window.REG136);await p.waitForFunction(()=>!document.getElementById('boot106'));await p.waitForFunction(()=>ONL32.verified&&ON10.auth);
 await p.evaluate(()=>{titleEl.hidden=true;intro.hidden=true;CINE.L=null;cineEl.hidden=true;TUT.on=false;gid('tut').hidden=true;try{dlgClose(true)}catch(e){}PAUSED=false;P.lv=160;enterZone(RZI93)});
 await p.waitForFunction(()=>inRage93()&&D.zone);await p.waitForTimeout(800);
 /* วางมอน N ตัวในจอ (หยุดนิ่ง เลือดไม่เต็ม → มีหลอดเลือด) แล้วนับการวาด 1 เฟรม */
 const frame=N=>p.evaluate(N=>{PAUSED=true;const Zd=D.zone.Zd;D.mobs=[];const vw=VW/Z,vh=VH/Z;let k=0,g=0;
  while(k<N&&g<50000){g++;const x=P.x+(Math.random()-.5)*vw*.8,y=P.y+(Math.random()-.5)*vh*.7;if(zHit(x,y))continue;const [f,nm,col]=Zd.mobs[k%Zd.mobs.length];
   const m=mkMob(f,nm,col,150+k%9,x,y,{elite:false});m.r93=1;m.aggro=0;m.st='idle';m.hp=Math.round(m.max*.5);D.mobs.push(m);k++}
  const pr=CanvasRenderingContext2D.prototype,O={},C={};for(const f of ['strokeText','fillRect']){O[f]=pr[f];pr[f]=function(){if(this===ctx)C[f]=(C[f]||0)+1;return O[f].apply(this,arguments)}}
  try{draw()}finally{for(const f in O)pr[f]=O[f];PAUSED=false}
  return {mobs:D.mobs.length,strokeText:C.strokeText||0,fillRect:C.fillRect||0}},N);
 const few=await frame(30),many=await frame(150);console.log('30 mobs:',few,' 150 mobs:',many);
 assert.equal(few.mobs,30);assert.equal(many.mobs,150);
 assert.ok(few.strokeText>=30,'มอน ≤40 ตัว ต้องมีป้ายชื่อครบทุกตัวเหมือนเดิม (strokeText '+few.strokeText+')');
 assert.ok(many.strokeText<=90,'มอน 150 ตัว: strokeText ต่อเฟรมต้อง ≤ 90 (ได้ '+many.strokeText+') — ป้ายชื่อมอนวาดทุกตัวทุกเฟรม = เกมหน่วง');
 assert.ok(many.fillRect>=many.mobs*2,'หลอดเลือดต้องยังวาดครบทุกตัว (fillRect '+many.fillRect+')');
 assert.deepEqual(errors,[]);console.log('MOB LABEL PERF PASS: 150 mobs strokeText',many.strokeText,'/frame · 30 mobs labels complete');
}finally{try{await browser?.close()}catch(e){}server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));fs.rmSync(dir,{recursive:true,force:true})}})().catch(e=>{console.error(e);process.exitCode=1});
