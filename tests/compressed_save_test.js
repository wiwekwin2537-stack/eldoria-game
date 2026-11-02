/* Large Thai snapshots must survive the compressed lifecycle HTTP transport. */
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),zlib=require('node:zlib');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'eld-compressed-'));
process.env.DATA_DIR=directory;process.env.UPSTASH_REDIS_REST_URL='';process.env.UPSTASH_REDIS_REST_TOKEN='';
const accounts=require('../accounts'),port=8806;
const server=http.createServer((request,response)=>{if(!accounts.middleware(request,response,()=>true)){response.writeHead(404);response.end()}});
async function request(endpoint,body,compressed=false){const response=await fetch('http://127.0.0.1:'+port+endpoint,{method:'POST',headers:{'content-type':compressed?'application/octet-stream':'application/json'},body:Buffer.isBuffer(body)?body:JSON.stringify(body)});return {status:response.status,data:await response.json()}}
(async()=>{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve)});
 const registered=await request('/api/register',{id:'gzipthai',pw:'Test1234',name:'นักผจญภัย',protocol:2});assert.equal(registered.data.ok,true);
 const auth={id:'gzipthai',token:registered.data.token,protocol:2},document='cccccccccccccccc';
 const activated=await request('/api/load',{...auth,activate:true,document});assert.equal(activated.data.ok,true);
 const main={v:1,lv:8,name:'นักผจญภัย',armor:{},inv:{coin:1234},gear:{chest21:1},enh:{chest21:14}};
 const save=JSON.stringify({fm_save_v1:JSON.stringify(main),fm_notes:('ภาษาไทย เก็บอุปกรณ์และเพชรให้ครบถ้วน 🌟\n').repeat(5000)});
 const payload=Buffer.from(JSON.stringify({...auth,document,base:0,seq:1,lv:8,save,name:'นักผจญภัย'}),'utf8'),compressed=zlib.gzipSync(payload);
 assert.ok(payload.length>65536,'the UTF-8 JSON request exceeds the browser keepalive body limit');
 assert.ok(compressed.length<60000,'compression fits the lifecycle transport budget');
 assert.ok(save.length<1200*1024,'the snapshot remains within the decoded save size limit');
 const saved=await request('/api/save',compressed,true);assert.equal(saved.status,200);assert.equal(saved.data.ok,true);
 const loaded=await request('/api/load',auth);assert.equal(loaded.data.rev,1);assert.equal(loaded.data.save,save,'Thai and emoji bytes round-trip without corruption');
 const duplicate=await request('/api/save',compressed,true);assert.equal(duplicate.data.ok,true);assert.equal(duplicate.data.rev,1,'compressed retries remain idempotent');
 const malformed=await request('/api/save',compressed.subarray(0,Math.floor(compressed.length/2)),true);
 assert.equal(malformed.status,400);assert.equal(malformed.data.err,'json','truncated gzip gets an explicit parse failure');
 const invalidJson=await request('/api/save',zlib.gzipSync(Buffer.from('{broken-json','utf8')),true);
 assert.equal(invalidJson.status,400);assert.equal(invalidJson.data.err,'json');
 const expansion=await request('/api/save',zlib.gzipSync(Buffer.alloc(1200*1024*8+8193,32)),true);
 assert.equal(expansion.status,400,'gzip expansion cannot bypass the decoded request limit');
 const preserved=await request('/api/load',auth);assert.equal(preserved.data.rev,1);assert.equal(preserved.data.save,save,'malformed or oversized compressed uploads never replace the confirmed save');
 console.log('COMPRESSED SAVE PASS: '+payload.length+' UTF-8 bytes -> '+compressed.length+' gzip bytes; Thai round-trip, retry, malformed gzip and expansion limit');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(server.listening)await new Promise(resolve=>server.close(resolve));fs.rmSync(directory,{recursive:true,force:true})});
