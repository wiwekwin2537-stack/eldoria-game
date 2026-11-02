// fix51 (v4.55) — สายประชิดตีธรรมดาแรงขึ้นให้สมกับการเข้าไปเสี่ยงใกล้มอน (เดิม DPS นักดาบ ~190 vs นักเวท ~320 ที่ Lv.80)
//   คูณดาเมจเฉพาะ "ฟันธรรมดา" ที่โดนมอน (ไม่แตะสกิล/PvP): นักดาบ ×2 · นักพรต ×2 · อัศวินมังกร ×3.2 · พาลาดิน ×2.6
try{
const MEL51={sword:2,monk:2,dragoon:3.2,paladin:2.6};window.MEL51=MEL51;
{const _um=updMob;updMob=function(m,dt){const k=P&&MEL51[P.cls];if(!k||!m||m.dead)return _um.apply(this,arguments);
 const l0=m.last,h0=m.hp;const r=_um.apply(this,arguments);
 try{if(l0!==atkId&&m.last===atkId&&m.hp<h0&&!m.dead){const extra=Math.round((h0-m.hp)*(k-1));m.hp-=extra;if(m.hp<=0&&!m.dead){m.hp=0;try{mobKill(m)}catch(e){}}}}catch(e){}return r};window.updMob=updMob}
}catch(e){console.warn('fix51',e)}
