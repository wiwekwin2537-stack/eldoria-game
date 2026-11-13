/* Check hand contacts throughout the existing rifle raise, aim and recovery. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync(require.resolve('../js/031-core.js'),'utf8');
const box=vm.createContext({P:{cls:'sniper'},BOWSHOT7:[{tilt:0}],rgF7:d=>d==='l'?-1:1,
  rgSide7:d=>d==='l'||d==='r',e6o:x=>x,e6io:x=>x,LP7:(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t)});
box.window=box;
vm.runInContext(src.slice(src.indexOf('function rifleGrip7('),src.indexOf('function drawArrow7(')),box);
let cases=0;
for(const d of ['l','r','u','d'])for(let i=0;i<24;i++){
  const a=i*Math.PI/12,axis=[Math.cos(a),Math.sin(a)];
  box.SKPOSE57={aim:axis};
  for(const phase of [0,.1,.22,.34,.45,.62,.8,1]){
    const pose=box.bowPose7(d,phase,0);
    const [dx,dy]=pose.av;
    const flip=dx<-.001?-1:1;
    for(const [point,x,y] of [[pose.trigger,5.8,4.5],[pose.h,13,2]]){
      const ox=(point[0]-pose.g[0])/pose.sc,oy=(point[1]-pose.g[1])/pose.sc;
      assert.ok(Math.abs(ox*dx+oy*dy-x)<1e-8);
      assert.ok(Math.abs((-ox*dy+oy*dx)*flip-y)<1e-8);
    }
    if(phase>=.22&&phase<=.62)assert.ok(Math.hypot(dx-axis[0],dy-axis[1])<1e-8);
    cases++;
  }
}
console.log('Rifle grip pose checks passed:',cases);
