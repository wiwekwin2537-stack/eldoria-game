/* Standalone read-only preview host. Does not import the game server or accounts. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const {movementModule}=require('./legacy-movement.cjs');
const ROUTES={'/':['preview3d/index.html','text/html; charset=utf-8'],'/index.html':['preview3d/index.html','text/html; charset=utf-8'],'/app.js':['preview3d/app.js','text/javascript; charset=utf-8'],'/models.js':['preview3d/models.js','text/javascript; charset=utf-8'],'/world.mjs':['preview3d/world.mjs','text/javascript; charset=utf-8'],'/walk.js':['preview3d/walk.js','text/javascript; charset=utf-8'],'/vendor/three.min.js':['three.min.js','text/javascript; charset=utf-8']};
function createPreviewServer(){return http.createServer((req,res)=>{
 const headers={'cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; img-src data:; worker-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"};
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{...headers,allow:'GET, HEAD'});res.end();return;}
 let u;try{u=new URL(req.url,'http://preview.invalid').pathname}catch(e){res.writeHead(400,headers);res.end();return;}
 if(u==='/legacy-motion.js'){try{const body=movementModule();res.writeHead(200,{...headers,'content-type':'text/javascript; charset=utf-8'});res.end(req.method==='HEAD'?undefined:body)}catch(e){res.writeHead(503,{...headers,'content-type':'text/plain; charset=utf-8'});res.end('Movement source requires review')}return;}
 if(u==='/scene.json'){
  /* Existing regression fixture is the layout source, not a new gameplay definition. */
  const f=JSON.parse(fs.readFileSync(path.join(ROOT,'tests/fixtures/town_layout_v536.json'),'utf8'));
  const body=JSON.stringify({source:{baseCommit:'da313af7cd51956b63a01d94dd5a5efbf799480a',layout:'tests/fixtures/town_layout_v536.json',kind:'baseline-regression-fixture'},base:{width:f.dm[0].length,height:f.dm.length,walk:f.dm,shops:f.shops,npcs:f.npcs,spawn:f.spawn}});
  res.writeHead(200,{...headers,'content-type':'application/json; charset=utf-8'});res.end(req.method==='HEAD'?undefined:body);return;
 }
 const file=ROUTES[u];if(!file){res.writeHead(404,headers);res.end('Not found');return;}
 fs.readFile(path.join(ROOT,file[0]),(err,bytes)=>{if(err){res.writeHead(500,headers);res.end('Preview asset unavailable');return;}res.writeHead(200,{...headers,'content-type':file[1]});res.end(req.method==='HEAD'?undefined:bytes)});
})}
if(require.main===module){const host=process.env.PREVIEW_HOST||'127.0.0.1',port=Number(process.env.PREVIEW_PORT||8790);const server=createPreviewServer();server.on('error',e=>{console.error(e.message);process.exitCode=1});server.listen(port,host,()=>console.log(`Eldoria 3D visual preview: http://${host}:${server.address().port}`));}
module.exports={createPreviewServer};
