// fix28.js (v4.35) — สมดุลอาชีพ: สเตตัสหลักชัดเจน + ตัวคูณดาเมจ/เลือดจากการจำลองต่อสู้ (ทุกอาชีพใกล้เคียงกัน)
// =====================================================================
// สเตตัสหลักที่ใช้คิดดาเมจของแต่ละอาชีพ
const DST28={sword:'str',paladin:'str',dragoon:'str',monk:'sa',ninja:'agi',archer:'agi',sniper:'agi',mage:'int',cleric:'int',necro:'int',summoner:'int'};
window.PRIM10=function(){const c=P.cls,S=P.stats;let m=DST28[c];
 if(!m){const w=(typeof wKind==='function')?wKind():'sword';m=w==='staff'?'int':w==='bow'?'agi':'str'}
 return m==='sa'?Math.round((S.str+S.agi)*.62):m==='int'?Math.round(S.int*1.15):m==='agi'?Math.round(S.agi*1.1):S.str};
// ตัวคูณดาเมจ (o) และเลือดสูงสุด (h) — ปรับจากผลจำลอง
// ผลจำลอง Lv.80 + Lv.130 (ดาเมจเป้าเดี่ยว+หมู่): ทุกอาชีพอยู่ในช่วง ±12% · สายถึก (พาลาดิน/นักบวช) ดาเมจต่ำกว่าเล็กน้อยแลกกับความอึด/ฮีล
const CB28={sword:{o:1.25,h:1},mage:{o:1.05,h:1},archer:{o:1.66,h:1},ninja:{o:0.53,h:1},sniper:{o:0.89,h:1},paladin:{o:1.39,h:1},cleric:{o:1.53,h:1},necro:{o:1.02,h:1},monk:{o:0.85,h:1},dragoon:{o:0.79,h:1},summoner:{o:0.67,h:1}};
window.CB28=CB28;
{const _ca=clsAtk;clsAtk=function(){const b=CB28[P.cls];return Math.max(1,Math.round(_ca()*(b?b.o:1)))}}
{const _rs=recalcStats;recalcStats=function(){_rs();const b=CB28[P.cls];if(b&&b.h!==1)BAL.hp=Math.round(BAL.hp*b.h)}}
// คริติคอลจาก AGI แบบลดหลั่น (เดิม AGI สูง ๆ คริ 100% ตลอด) · รวมแล้วไม่เกิน 75%
{const _cc=critCh;critCh=function(){const a=P.stats.agi|0,raw=_cc()-a*.004,dim=.32*(1-Math.exp(-a/220));return Math.max(0,Math.min(.75,raw+dim))}}

// ---------- อัลติเมทประจำอาชีพใหม่ (ใช้ท่าแม่แบบของสายอาวุธ แต่ชื่อ/สีของตัวเอง) ----------
const BASEU28={ninja:'sword',paladin:'sword',monk:'sword',dragoon:'sword',sniper:'archer',cleric:'mage',necro:'mage',summoner:'mage'};
Object.assign(ULTD,{ninja:{n:'พันเงาพิฆาต',en:'THOUSAND SHADOWS',c:'#8a9aff',rgb:'140,150,255'},paladin:{n:'คำพิพากษาสวรรค์',en:"HEAVEN'S JUDGMENT",c:'#ffe9a0',rgb:'255,235,160'},
 monk:{n:'หมัดพันพระหัตถ์',en:'THOUSAND PALMS',c:'#ffb46a',rgb:'255,180,100'},dragoon:{n:'มังกรเทพพิโรธ',en:'WRATH OF THE DRAGON',c:'#ff6a5a',rgb:'255,110,90'},
 sniper:{n:'กระสุนดาวตก',en:'METEOR SHOT',c:'#ffd23a',rgb:'255,210,80'},cleric:{n:'แสงสวรรค์ถล่มโลก',en:'HOLY NOVA',c:'#bff0ff',rgb:'190,240,255'},
 necro:{n:'ฝนวิญญาณมรณะ',en:'DEATH RAIN',c:'#7affb0',rgb:'120,255,170'},summoner:{n:'ฝูงสัตว์เทพ',en:'SPIRIT STAMPEDE',c:'#9adf6a',rgb:'160,225,110'}});
for(const k in BASEU28)if(SKART['ULT_'+BASEU28[k]]&&!SKART['ULT_'+k])SKART['ULT_'+k]=SKART['ULT_'+BASEU28[k]];
function withU28(cls,fn){const b=BASEU28[cls];if(!b)return fn(cls);const sv=ULTD[b];ULTD[b]=Object.assign({},sv,ULTD[cls]);try{return fn(b)}finally{ULTD[b]=sv}}
{const _uf=ultFire;ultFire=function(k){return withU28(k,b=>_uf(b))}}
{const _ut=ultTick;ultTick=function(dt){const U=ULT.cast;if(U&&BASEU28[U.k]){const cls=U.k;return withU28(cls,b=>{U.k=b;try{return _ut(dt)}finally{if(ULT.cast===U)U.k=cls}})}return _ut(dt)}}

// =====================================================================
