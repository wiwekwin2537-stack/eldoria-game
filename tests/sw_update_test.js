// ทดสอบการบันทึกและรีโหลดเมื่อมี Service Worker รุ่นใหม่: node tests/sw_update_test.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'js/031-core.js'), 'utf8');
const swSource = fs.readFileSync(process.env.ELD_TEST_SW || path.join(__dirname, '..', 'sw.js'), 'utf8');
const match = source.match(/^function forcedUpdate8.*$/m);
if (!match) throw new Error('ไม่พบ forcedUpdate8');
const box = { setTimeout, clearTimeout, Promise };
vm.createContext(box);
vm.runInContext(match[0], box);
let fail = 0;
const ok = (c, m) => { if (c) console.log('ok  ', m); else { console.log('FAIL', m); fail++; } };

(async () => {
  const order = [];
  const update = box.forcedUpdate8(() => order.push('save'), async () => { order.push('sync'); return true; }, () => order.push('reload'), 10, 50);
  await new Promise(r => setTimeout(r, 30));
  ok(order.join(',') === 'save,sync,reload', 'ครบเวลานับถอยหลัง → เซฟ → ซิงค์ → รีโหลด');

  const immediate = [], u = box.forcedUpdate8(() => immediate.push('save'), async () => { immediate.push('sync'); return true; }, () => immediate.push('reload'), 100, 50);
  const a = u.run(), b = u.run();
  await Promise.all([a, b]);
  ok(a === b && immediate.join(',') === 'save,sync,reload', 'แตะเข้าใหม่เลย → ทำงานครั้งเดียว ไม่รีโหลดซ้ำ');

  const timeout = [], t = box.forcedUpdate8(() => timeout.push('save'), () => new Promise(() => {}), () => timeout.push('reload'), 100, 10);
  await t.run();
  ok(timeout.join(',') === 'save', 'ซิงค์ค้าง → ไม่รีโหลดทิ้งข้อมูลในหน่วยความจำ');
  ok(source.includes("const go=forcedUpdate8(()=>{try{if(typeof saveGame==='function')saveGame(true)}catch(e){}},()=>{try{if(window.ONL32&&ONL32.verified&&window.CLOUD&&CLOUD.sync)return CLOUD.sync(true);return true}catch(e){return false}},()=>location.reload(),0)") && source.includes("addEventListener('controllerchange',()=>{if(had)banner();had=true})"), 'ตัวตรวจอัปเดตจริงเรียกบันทึก/ซิงค์/รีโหลดเมื่อ controller เปลี่ยน');

  const failed=[];let ack=false;const guarded=box.forcedUpdate8(()=>failed.push('save'),async()=>ack,()=>failed.push('reload'),0);ok(await guarded.run()===false&&!failed.includes('reload'),'เซฟไม่ยืนยันไม่โหลดใหม่');ack=true;ok(await guarded.run()===true&&failed.at(-1)==='reload','ยืนยันสำเร็จแล้วกดใหม่ได้');
  const binding=source.match(/b\.querySelector\('button'\)\.onclick=async\(\)=>\{[^\n]+?\};/)[0];let releaseUpdate;const button={},pausedBox={PAUSED:false,b:{querySelector:()=>button},go:{run:()=>new Promise(r=>releaseUpdate=r)}};vm.createContext(pausedBox);vm.runInContext(binding,pausedBox);const pendingUpdate=button.onclick();ok(pausedBox.PAUSED,'หยุดเกมก่อนส่งเซฟอัปเดต');releaseUpdate(false);await pendingUpdate;ok(pausedBox.PAUSED===false,'บันทึกอัปเดตไม่สำเร็จคืนสถานะหยุดเดิม');
  const activateTest = async cachesAtStart => {
    const events = {}, navigated = [], removed = []; let waited = Promise.resolve(), delay = 0;
    const client = { url: 'https://game.test/', navigate: async url => { navigated.push(url); } };
    const scope = { addEventListener: (name, fn) => { events[name] = fn; }, skipWaiting: async () => {}, clients: { claim: async () => {}, matchAll: async () => [client] } };
    const env = { self: scope, caches: { keys: async () => cachesAtStart, delete: async key => { removed.push(key); } }, Promise,
      setTimeout: (fn, ms) => { delay = ms; queueMicrotask(fn); return 1; }, clearTimeout() {} };
    vm.runInNewContext(swSource, env);
    events.activate({ waitUntil: promise => { waited = promise; } });
    await waited;
    return { navigated, removed, delay };
  };
  const manualOrder=[],manual=box.forcedUpdate8(()=>manualOrder.push('save'),null,()=>manualOrder.push('reload'),0);await new Promise(r=>setTimeout(r,25));ok(manualOrder.length===0,'โหมดปุ่มอัปเดตไม่สั่งโหลดเอง');await manual.run();ok(manualOrder.join(',')==='save,reload','กดปุ่มแล้วบันทึกก่อนโหลดใหม่');
  const currentCache = swSource.match(/const C='([^']+)'/)[1];
  const oldCache = 'eldoria-v' + (Number(currentCache.replace('eldoria-v', '')) - 1);
  const upgrade = await activateTest([oldCache, currentCache]);
  ok(upgrade.navigated.length === 0 && upgrade.delay === 0 && upgrade.removed.includes(oldCache) && !upgrade.removed.includes(currentCache), 'อัปเดตจากแคชรุ่นเก่า → Service Worker ไม่โหลดแท็บซ้ำเอง');
  const firstInstall = await activateTest([currentCache]);
  ok(firstInstall.navigated.length === 0, 'ติดตั้งครั้งแรก → ไม่รีโหลดหน้าทันที');
  console.log(fail ? `FAILED ${fail}` : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
