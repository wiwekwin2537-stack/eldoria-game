/* Existing remote characters and retired login attempts must not become new-character/cache repair flows. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const cc=fs.readFileSync('js/069-fix38.js','utf8').match(/const ccDone41=\(\)=>\{[^\n]+/)[0];
function character(ready,isNew,flag){const b={SERVER_BOOT:{ready},FM_NEW:isNew,localStorage:{getItem:()=>flag}};b.window=b;vm.createContext(b);vm.runInContext(cc+';globalThis.done=ccDone41()',b);return b.done}
assert.equal(character(true,false,null),true,'an existing server character does not require the legacy device-era flag');
assert.equal(character(true,true,null),false,'a genuinely new account still creates a character');
assert.equal(character(false,false,null),false,'failed bootstrap cannot infer an existing character');
assert.equal(character(true,true,'1'),true,'new registration with server appearance seed remains complete');
const source=fs.readFileSync('js/113-fix81.js','utf8'),start=source.indexOf('const E81='),end=source.indexOf('// ลิงก์ "ซ่อมเกม"',start),part=source.slice(start,end);
async function watchdog(mode){const timers=[],listeners={},boxes=new Map();let resolve,reject,calls=0;const pending=new Promise((a,b)=>{resolve=a;reject=b});const ctx={Date:mode==="cancel-resume"?{now:()=>100}:Date,Promise,titleEl:{hidden:false},SERVER_BOOT:{ready:true},ONL32:{verified:true},document:{getElementById:k=>k==='tpan'?{textContent:'เข้าสู่เกม'}:boxes.get(k),querySelector:()=>null,createElement:()=>({remove(){boxes.delete('fix81e')}}),body:{appendChild:b=>boxes.set(b.id,b)}},esc81:s=>s,setTimeout:f=>timers.push(f),tPlay:()=>{calls++;if(mode==='hidden-throw'){ctx.titleEl.hidden=true;throw Error('genuine hidden throw')}if(mode==='hidden-reject')ctx.titleEl.hidden=true;return mode==='rejection'||mode==='hidden-reject'||['superseded','cancel-resume'].includes(mode)&&calls===1?pending:undefined}};ctx.window=ctx;ctx.W81=ctx;ctx.addEventListener=(k,f)=>listeners[k]=f;vm.createContext(ctx);vm.runInContext(part,ctx);if(mode==='hidden-throw')assert.throws(()=>ctx.tPlay(),/genuine hidden throw/);else ctx.tPlay();
if(mode==='login'){ctx.document.querySelector=s=>/#lId|#lGo/.test(s)?{}:null;ctx.ONL32.verified=false;ctx.ONL32.lastError='session-replaced'}
if(mode==='cancel'||mode==='rejection'){assert.equal(typeof ctx.cancelPlay81,'function');ctx.cancelPlay81();ctx.ONL32.verified=false}
if(mode==='cancel-resume')ctx.cancelPlay81();
if(['superseded','cancel-resume'].includes(mode)){ctx.tPlay();ctx.titleEl.hidden=true}
if(['rejection','hidden-reject','superseded','cancel-resume'].includes(mode)){reject(Error('startup rejection'));await new Promise(r=>setImmediate(r))}
timers.forEach(f=>f());assert.equal(boxes.has('fix81e'),['genuine','hidden-throw','hidden-reject'].includes(mode),'only an active genuine startup failure offers cache repair: '+mode);
if(mode==='genuine'){ctx.cancelPlay81();assert.equal(boxes.has('fix81e'),false)}else if(mode!=='rejection')resolve();
}
(async()=>{for(const m of ['genuine','login','cancel','rejection','hidden-throw','hidden-reject','superseded','cancel-resume'])await watchdog(m);console.log('LOGIN RESUME PASS: legacy server character, registration, failed bootstrap, cancellation, superseded promise, genuine hidden-title errors')})().catch(e=>{console.error(e);process.exitCode=1});
