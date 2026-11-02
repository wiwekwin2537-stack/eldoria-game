async () => { const sl=ms=>new Promise(r=>setTimeout(r,ms)); try{if(D&&!D.town)exitD()}catch(e){} try{enterTown()}catch(e){} await sl(200);
 enterHall(); await sl(300); return {st:[DGST11.x/T,DGST11.y/T], owner:[D.owner.x/T,D.owner.y/T], alt:typeof ALT7!=='undefined'?[ALT7.x/T,ALT7.y/T]:null, grid:dm.map(r=>r.join('')), P:[P.x/T,P.y/T]} }
