/* STORY-E3b1: รางวัลบท0–2จริงจากตารางเกมเดิม ไม่ใช้ grant fixture
   callback นี้ทำงานบนสำเนาธุรกรรมของ story.cjs และไม่เขียน storage/ส่งจดหมายแยกเอง
   ยังต้องมีหลักฐาน authoritative และ single-writer ตามข้อกำหนด service ก่อนเปิดใช้จริง */
const { COIN_MAX } = require('./saves.cjs');
const { createInventory } = require('./inventory.cjs');
const { createStoryService } = require('./story.cjs');
const plain = o => !!o && typeof o === 'object' && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;
const uint = n => Number.isSafeInteger(n) && n >= 0;
function fail(code) { const e = new Error(code); e.code = code; throw e; }

async function createStoryRewardAdapter(options = {}) {
  const [{ ECONOMY: E }, inventory] = await Promise.all([import('../src/data/economy.js'), createInventory(options)]);
  const need = level => Math.round((E.xpNeed.base + E.xpNeed.square * level * level) * (level < E.xpNeed.threshold ? 1 : 1 + (level - E.xpNeed.threshold) / E.xpNeed.slope));
  function character(saved) {
    if (saved === undefined) return { version:1, level:1, xp:0, unspentStats:0, legendXpPending:0, stats:{str:0,vit:0,agi:0,int:0,end:0} };
    if (!plain(saved) || saved.version !== 1 || !Number.isInteger(saved.level) || saved.level < 1 || saved.level > E.maxLevel || !uint(saved.xp) || !uint(saved.unspentStats) || !uint(saved.legendXpPending) || !plain(saved.stats)) fail('character-data');
    for (const key of ['str','vit','agi','int','end']) if (!uint(saved.stats[key])) fail('character-stats');
    if ((saved.level < E.maxLevel && saved.xp >= need(saved.level)) || (saved.level === E.maxLevel && saved.xp !== 0)) fail('character-xp');
    return structuredClone(saved);
  }
  function gain(saved, amount) {
    const c = character(saved); if (!uint(amount) || !uint(c.xp + amount)) fail('reward-xp');
    c.xp += amount;
    while (c.level < E.maxLevel && c.xp >= need(c.level)) { c.xp -= need(c.level); c.level++; c.unspentStats += E.statPointsPerLevel; }
    if (c.level === E.maxLevel) { if (!uint(c.legendXpPending+c.xp)) fail('reward-xp'); c.legendXpPending += c.xp; c.xp=0; } /* เก็บ XP รอดาวตำนาน ห้ามลบทิ้ง */
    if (!uint(c.unspentStats)) fail('reward-xp'); return c;
  }
  function grant(profile, reward) {
    if (!plain(profile) || !uint(profile.coin) || profile.coin > COIN_MAX || !plain(reward) || !uint(reward.coin) || !uint(reward.xp)) fail('reward-data');
    if (reward.stacks !== undefined && !plain(reward.stacks)) fail('reward-data');
    if (Object.keys(reward).some(k => !['coin','xp','stacks','starterKit'].includes(k)) || (reward.starterKit !== undefined && typeof reward.starterKit !== 'boolean')) fail('reward-data');
    const coin = profile.coin + reward.coin; if (!uint(coin) || coin > COIN_MAX) fail('coin-full'); /* ไม่ตัดส่วนเกินแล้วถือว่ารับครบ */
    const c = gain(profile.character,reward.xp), bag = inventory.read(profile.inventory), gear = [];
    if (reward.starterKit) for (const itemId of E.starterKit) if (!Object.values(bag.gear).some(g=>g.itemId===itemId)) gear.push(itemId);
    let nextBag = inventory.add(bag,{stacks:reward.stacks || {},gear},c.stats);
    if (reward.starterKit && !nextBag.equipped.sword) {
      const sword = Object.values(nextBag.gear).find(g=>g.itemId==='sword0'&&!g.broken);
      if (sword) nextBag = inventory.equip(nextBag,sword.uid,c.level,c.stats);
    }
    /* มอบทั้งแพ็กหลังตรวจครบเท่านั้น ไม่มีการแก้ profile บางส่วนก่อนกระเป๋าผ่าน */
    profile.coin=coin; profile.character=c; profile.inventory=nextBag; return true;
  }
  return { rewards:structuredClone(E.storyRewards), grant, inventory, character, gain, need };
}
async function createEldoriaStoryService({ saves, storageMode, verifyEvidence, verifyReport, grantEvidence } = {}) {
  const { rewards, grant } = await createStoryRewardAdapter();
  return createStoryService({saves,storageMode,verifyEvidence,verifyReport,rewards,grant,grantEvidence});
}
module.exports = { createStoryRewardAdapter, createEldoriaStoryService };
