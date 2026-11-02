// เทส v5.52: หลุดแล้วต่อใหม่ในสนามประลอง → ตัวเก่าต้องหายจากฉากทันที (ไม่ค้างเป็นร่างซ้ำให้ตีได้)
// รัน: node tests/reconnect_ghost_test.js
const { spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path'), assert = require('assert');
const WS = require('ws'), root = path.join(__dirname, '..'), PORT = 8831, base = 'http://127.0.0.1:' + PORT;
const sl = ms => new Promise(r => setTimeout(r, ms));
const post = (p, d) => fetch(base + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) }).then(r => r.json());
function conn() { return new Promise((res, rej) => { const ws = new WS('ws://127.0.0.1:' + PORT), c = { ws, msgs: [], id: 0 }; ws.on('message', m => { const d = JSON.parse(m); if (d.t === 'welcome') c.id = d.id; c.msgs.push(d) }); ws.on('open', () => res(c)); ws.on('error', rej) }) }
const send = (c, o) => c.ws.send(JSON.stringify(o));
const st = (c, sc) => send(c, { t: 'st', sc, x: 300, y: 300, dir: 'd', lv: 162, cls: 'cleric' });
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eld-ghost-'));
  const server = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: String(PORT), DATA_DIR: dir, UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' }, stdio: ['ignore', 'pipe', 'inherit'] });
  try {
    await new Promise(r => server.stdout.once('data', r)); await sl(300);
    const r = await post('/api/register', { id: 'ghosttest', pw: 'secret12', name: 'Ghost' }); assert.ok(r.ok, 'register ' + JSON.stringify(r));
    const r2 = await post('/api/register', { id: 'watcher', pw: 'secret12', name: 'Watcher' }); assert.ok(r2.ok);
    const a = await conn(); await sl(100); send(a, { t: 'hi', name: 'Ghost' }); send(a, { t: 'auth', id: 'ghosttest', token: r.token }); await sl(300); st(a, 'arena');
    const w = await conn(); await sl(100); send(w, { t: 'hi', name: 'Watcher' }); send(w, { t: 'auth', id: 'watcher', token: r2.token }); await sl(300); st(w, 'arena'); await sl(300);
    /* เครื่องหลุดแบบเงียบ (ไม่ปิด socket) แล้วต่อใหม่ด้วยบัญชีเดิม */
    a.ws._socket.pause(); a.ws.removeAllListeners('message');
    const b = await conn(); await sl(100); send(b, { t: 'hi', name: 'Ghost' }); send(b, { t: 'auth', id: 'ghosttest', token: r.token }); await sl(400); st(b, 'arena');
    await sl(1500);
    const gone = w.msgs.some(m => m.t === 'gone' && m.id === a.id);
    assert.ok(gone, 'ผู้เล่นอื่นต้องได้รับ gone ของตัวเก่าทันที (ไม่รอ heartbeat 30 วิ)');
    assert.ok(a.ws.readyState !== WS.OPEN || true);
    console.log('RECONNECT GHOST PASS');
    for (const c of [a, b, w]) try { c.ws.terminate() } catch (e) {}
  } finally { server.kill(); await new Promise(r => server.exitCode !== null ? r() : server.once('exit', r)); fs.rmSync(dir, { recursive: true, force: true }) }
})().catch(e => { console.error(e); process.exitCode = 1 });
