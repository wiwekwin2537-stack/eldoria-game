/* Differential oracle: exact pre-consolidation source, pinned in the fixture. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const fixture=require('./fixtures/xp_chain_before.json');
assert.equal(fixture.commit,'76d9717e302cd95e62024484526fcefe784ca4e5');
const {execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
for(const [file,hash] of Object.entries(fixture.sourceSha256)){
 const original=execFileSync('git',['show',fixture.commit+':'+file],{encoding:'utf8',maxBuffer:16*1024*1024});
 assert.equal(createHash('sha256').update(original).digest('hex'),hash,'pinned source '+file);
 if(file==='js/030-core.js')assert(original.includes(fixture.base));
 for(const stage of fixture.stages.filter(s=>s.file===file))assert(original.includes(stage.before.slice(1,-1)),'exact old code '+file+':'+stage.line);
}
const source=fs.readFileSync('js/030-core.js','utf8');
const owner=source.slice(source.indexOf('const XP_PIPELINE='),source.indexOf('dropLoot=function'));
assert.equal((source.match(/function gainXp\(/g)||[]).length,1);
for(const file of new Set(fixture.stages.map(s=>s.file))){const s=fs.readFileSync(file,'utf8');assert(!/\bgainXp\s*=/.test(s),file+' must not replace gainXp');for(const stage of fixture.stages.filter(x=>x.file===file))assert(s.includes(stage.after),file+' registration');}
function world(seed,opts){
 let rng=seed>>>0,now=2000,entered=false;const trace=[],timers=[];
 const math=Object.create(Math);math.random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296};
 const log=(k,...args)=>trace.push([k,...args]);
 const c={window:null,Math:math,performance:{now:()=>now},P:{lv:opts.lv,xp:opts.xp||0,sp:0,cls:'mage',x:4,y:6,hp:10,mp:10},BAL:{hp:100,mp:50},MAXLV:200,XPM64:5,__noXpm64:opts.noXpm||false,
  need:l=>Math.round((20+l*l*12)*(l<20?1:1+(l-20)/40)),ATK:()=>12,
  GUILD:{mem:[['A','red'],['B','blue']]},CLASS_LV:10,CSKILLS:{mage:[{lv:2,n:'first',e:'1'},{lv:10,n:'ten',e:'2'},{lv:100,n:'hundred',e:'3'},{lv:200,n:'final',e:'4'}]},PASSIVE:{mage:[{lv:10,n:'p',d:'desc'}]},
  EV11:{cur:opts.event?{k:'xp'}:null},EV:{XP_GAINED:'xp',LEVEL_UP:'level'},RFX:[],RG93:{combo:opts.combo||0,partyN:opts.party||0},
  RN153:{share:opts.share||0,ema:opts.ema??1,q:structuredClone(opts.queue||[])},KXP153:.09,
  ptTotal(){log('ptTotal',c.P.lv);if(opts.effectError==='ptTotal')throw Error('ptTotal');return Math.floor((c.P.lv-1)*.6)},
  inRage93(){if(opts.rageError)throw Error('rage');return opts.rage||false},inR153(){return opts.rage||false},
  comboMul93:()=>1+Math.min(.6,Math.floor(c.RG93.combo/5)*.02),partyMul93:()=>1+Math.min(.8,c.RG93.partyN*.2),
  recalcStats(){log('recalc');c.BAL.hp+=7;c.BAL.mp+=3},setTimeout(fn,t){log('timer',t);timers.push([fn,t]);return timers.length},
  pgAdd92(n){log('legend',n);c.legend=(c.legend||0)+n},
  Guard:{run(k,fn){log('guard',k);try{return fn()}catch(e){log('caught',e.message)}finally{log('unguard')}}},
  Hooks:{apply(k,n){log('hook',k,n);if(opts.hookError)throw Error('hook');if(opts.hookLevel)c.P.lv=opts.hookLevel;if(opts.reenter&&!entered){entered=true;c.gainXp(7)};return opts.hookNeg?-1:n*(opts.hookMul??1)+ (opts.hookAdd||0)}},
  EventBus:{emit(k,v){log('event',k,v);if(opts.eventError)throw Error('event')}}};
 if(opts.maxMissing)delete c.MAXLV;if(opts.cls)c.P.cls=opts.cls;if(opts.emptyGuild)c.GUILD.mem=[];
 c.window=c;for(const k of ['sfx','say','lvHud','refreshInv','updBadge','chatSay','saveGame','chatAnn','castBanner','updPasBadge','sysSay','banner','fanfare','rfxP'])c[k]=(...a)=>{log(k,...a);if(opts.effectError===k)throw Error(k)};
 vm.createContext(c);
 return {c,trace,timers,snapshot(){return {P:c.P,BAL:c.BAL,RFX:c.RFX,RN153:c.RN153,legend:c.legend,trace,rng}},flush(){/* Real timers run by deadline, preserving insertion order on ties. */timers.sort((a,b)=>a[1]-b[1]);let i=0;for(const [fn,t] of timers){now+=t;if(++i>100)throw Error('timer loop');try{fn()}catch(e){log('timerError',e.message)}}}};
}
const norm=x=>JSON.stringify(x,(_,v)=>typeof v==='number'&&!Number.isFinite(v)?String(v):v);
let cases=0;
function compare(seed,opts,input,depth=15){
 const old=world(seed,opts),next=world(seed,opts);
 vm.runInContext(fixture.base,old.c);vm.runInContext(owner,next.c);
 for(let i=0;i<depth;i++){if(opts.omitStages?.includes(i))continue;vm.runInContext(fixture.stages[i].before,old.c);vm.runInContext(fixture.stages[i].after,next.c)}
 for(const w of [old,next]){try{w.result=w.c.gainXp(input)}catch(e){w.result='throws:'+e.message}}
 assert.equal(norm(next.result),norm(old.result),'return '+norm({opts,input,depth}));
 assert.equal(norm(next.snapshot()),norm(old.snapshot()),'immediate '+norm({opts,input,depth}));
 /* Delayed callbacks intentionally observe the later live player level. */
 old.c.P.lv++;next.c.P.lv++;old.flush();next.flush();
 assert.equal(norm(next.snapshot()),norm(old.snapshot()),'timers '+norm({opts,input,depth}));cases++;
}
for(let depth=0;depth<=15;depth++)for(const lv of [1,9,79,80,99,100,149,199,200])for(const n of [0,1,2,17,1234,1e8,-3,'12',undefined,NaN])compare(42,{lv,xp:3},n,depth);
for(let i=0;i<1200;i++){const lv=[1,9,10,79,80,99,100,149,150,199,200][i%11],n=[1,7,31,777,100000,1e8][i%6];compare(i+1,{lv,event:!!(i&1),noXpm:!!(i&2),rage:!!(i&4),share:!!(i&8),combo:i%200,party:i%7,ema:(i%10)/10,queue:[{t:0,n,f:.1},{t:1900,n:n+1,f:1},{t:1900,n,f:i%2?1:.1}],hookMul:[.5,1,1.4][i%3],hookAdd:i%3},n)}
for(const opts of [{hookError:true},{effectError:'say'},{effectError:'saveGame'},{effectError:'ptTotal'},{eventError:true},{rageError:true,rage:true},{reenter:true,rage:true,share:1},{hookLevel:200},{hookLevel:9},{hookNeg:true}])for(const lv of [1,9,199,200])compare(77,{lv,...opts},1e8);
for(const opts of [{maxMissing:true},{cls:'none'},{cls:'unknown'},{emptyGuild:true},{omitStages:[7]},{omitStages:[10,13,14]},{omitStages:[12],rage:true,share:1}])for(const lv of [1,9,149,199,200])compare(97,{lv,...opts},10000000);
console.log('PASS gainXp equivalence:',cases,'cases, all 16 initialization depths, state, side effects, events, timers, random draws, errors, reentrancy');
