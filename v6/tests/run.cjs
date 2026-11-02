/* ตัวรันเทส: node v6/tests/run.cjs [คำในชื่อไฟล์] — รันทุก *.test.js ในโฟลเดอร์นี้ (CONTRACT §7) */
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');

(async () => {
  const filter = process.argv[2] || '';
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js') && f.includes(filter)).sort();
  let pass = 0, fail = 0;
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(__dirname, f)).href);
    for (const [name, fn] of mod.default) {
      try { await fn(); pass++; console.log('  ✅', f, '·', name); }
      catch (e) { fail++; console.log('  ❌', f, '·', name, '→', e && e.message); }
    }
  }
  console.log(`\nผ่าน ${pass} · พัง ${fail}`);
  process.exit(fail ? 1 : 0);
})();
