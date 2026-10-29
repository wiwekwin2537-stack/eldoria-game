/* hello — ระบบตัวอย่างชั่วคราว แสดงว่าโครงทำงาน · ลบออกเมื่อ world/movement พร้อม (ใบงาน 1A-1) */
export default {
  id: 'hello',
  draw(G, ctx, layer) {
    if (layer !== 'ui') return;
    ctx.fillStyle = '#1b2433';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#e2a548';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('ตำนานเอลโดเรีย v6 — โครงเกมพร้อม', 24, 48);
    ctx.fillStyle = '#9aa6b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('เฟรม ' + G.time.frame, 24, 78);
  },
};
