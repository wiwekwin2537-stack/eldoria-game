/* ตัวจำลองserverเฉพาะสไลม์ทุ่ง/ตัวละครเริ่มต้นในลานฝึก
   loot/XPอยู่ในfield-combat ไม่spawnใหม่หรือบันทึกHPนี้เป็นprofileจริง */
async function createSlimeSimulation({blocked,random=Math.random}={}){
 const [{SLIME_AI:S,TRAINING_VITALS:V},{MOVE}]=await Promise.all([import('../src/data/combat.js'),import('../src/data/movement.js')]);
 const rng=()=>{const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw Object.assign(Error('combat-random'),{code:'combat-random'});return r;};
 function move(p,dx,dy,b){const n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/MOVE.step));for(let i=0;i<n;i++){const x=p.x+dx/n,y=p.y+dy/n;if(Math.abs(x-b.x)<=b.radius&&!blocked(x,p.y))p.x=x;if(Math.abs(y-b.y)<=b.radius&&!blocked(p.x,y))p.y=y;}}
 function impulse(p,dt,b){if(!p.kx&&!p.ky)return;move(p,(p.kx||0)*dt,(p.ky||0)*dt,b);const d=Math.pow(S.decay,dt);p.kx*=d;p.ky*=d;if(Math.abs(p.kx)+Math.abs(p.ky)<S.stopImpulse)p.kx=p.ky=0;}
 function initial(){return {level:1,hp:V.hp,maxHp:V.hp,alive:true,stunned:false,stunT:0,iframe:0,combo:0,comboT:0,sinceHit:99,kx:0,ky:0,hitCount:0,lastHit:null};}
 function vitals(p,dt,b){if(!p.alive)return;p.stunT=Math.max(0,p.stunT-dt);p.stunned=p.stunT>0;impulse(p,dt,b);p.iframe=Math.max(0,p.iframe-dt);p.comboT=Math.max(0,p.comboT-dt);p.sinceHit+=dt;if(p.sinceHit>V.regenDelay)p.hp=Math.min(p.maxHp,p.hp+V.regen*dt);}
 function hurt(p,m){if(!p.alive||p.iframe>0||m.dead||m.pending||m.hp<=0)return false;
  const d=Math.hypot(p.x-m.x,p.y-m.y)||1,nx=(p.x-m.x)/d,ny=(p.y-m.y)/d;p.combo=p.comboT>0?p.combo+1:1;p.comboT=V.comboWindow;
  let damage=Math.max(1,V.damage+(m.level-1)*V.levelDamage-(((p.level||1)-1)>>2)),kb=V.knockback;if(p.combo>=2){damage+=V.comboDamage;kb=V.heavyKnockback;p.combo=0;p.comboT=0;}
  p.hp=Math.max(0,p.hp-damage);p.iframe=V.iframe;p.stunT=V.stun;p.stunned=true;p.kx=nx*kb;p.ky=ny*kb;p.sinceHit=0;p.hitCount++;p.lastHit={id:m.id,damage,heavy:kb===V.heavyKnockback};m.cool=S.cooldown;m.kx=-nx*S.recoil;m.ky=-ny*S.recoil;
  if(p.hp===0){p.alive=false;p.moving=false;p.running=false;p.kx=p.ky=0;}return true;
 }
 function slash(m,p){m.hurt=S.hurtTime;const d=Math.hypot(m.x-p.x,m.y-p.y)||1;m.kx=(m.x-p.x)/d*S.slashKnockback;m.ky=(m.y-p.y)/d*S.slashKnockback;}
 function step(mobs,p,dt,b){if(!Number.isFinite(dt)||dt<0||dt>.120001||!b||![b.x,b.y,b.radius].every(Number.isFinite)||b.radius<=0)throw Object.assign(Error('combat-simulation'),{code:'combat-simulation'});
  if(!p.alive||dt===0)return;
  for(const m of mobs){if(m.dead||m.pending||m.hp<=0)continue;const old=m.phase===undefined?rng()*S.cycle:m.phase,phase=(old+dt)%S.cycle;m.phase=phase;
   if(phase<old){const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy)||1;if(d<S.chaseRange){m.dx=dx/d;m.dy=dy/d;}else if(rng()<S.wanderChance){const a=rng()*Math.PI*2;m.dx=Math.cos(a);m.dy=Math.sin(a);}else m.dx=m.dy=0;}
   if(phase>=S.hopFrom&&phase<S.hopTo)move(m,(m.dx||0)*S.speed*dt,(m.dy||0)*S.speed*dt,b);
   impulse(m,dt,b);m.hurt=Math.max(0,(m.hurt||0)-dt);m.cool=Math.max(0,(m.cool||0)-dt);
   if(p.alive&&p.iframe<=0&&phase>=S.hopFrom&&m.cool<=0&&m.hurt<=0&&Math.hypot(m.x-p.x,m.y-p.y)<S.contactRange)hurt(p,m);
  }
 }
 function level(p,n){if(!Number.isInteger(n)||n<1||n>200)throw Object.assign(Error('character-data'),{code:'character-data'});if(n===(p.level||1))return;const up=n>(p.level||1);p.level=n;p.maxHp=V.hp+(n-1)*V.hpPerLevel;if(up&&p.alive)p.hp=p.maxHp;else p.hp=Math.min(p.hp,p.maxHp);}
 return {initial,level,vitals,hurt,slash,step,move};
}
module.exports={createSlimeSimulation};
