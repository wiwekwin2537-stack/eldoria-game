/* v5.73 โหลดโค้ดเกม (js/) + ภาพ (assets/) ผ่าน jsDelivr ฟรี แทน Render (เจ้าของสั่ง 2026-10-22: Render ฟรี 5 GB/เดือน เต็มแล้วโดนปิด)
   - ที่อยู่ CDN อยู่ใน <meta name="eldoria-cdn"> ปักหมุดรหัสคอมมิต (bash tools/pin_cdn.sh ก่อน push · quick.sh เตือนถ้าลืม)
   - ไม่ใช้ CDN เมื่อเปิดในเครื่อง (localhost/127.x) หรือ ?cdn=0 · ทดสอบ CDN ปลอมได้ด้วย ?cdnbase=http://127.0.0.1:8788/
   - CDN โหลดไม่ได้ (เช่น ลืม push tag) → ภาพ/โค้ดกลับไปโหลดจากเซิร์ฟเวอร์เดิมเอง เกมไม่พัง (แค่กินเน็ต Render) */
(function(){
 const q=new URLSearchParams(location.search),m=document.querySelector('meta[name="eldoria-cdn"]');
 const local=location.protocol==='file:'||/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
 const ver=(/v(\d+\.\d+)/.exec(document.title)||[])[1];
 let base='';
 if(q.get('cdnbase'))base=q.get('cdnbase');
 else if(!local&&q.get('cdn')!=='0'&&m&&m.content&&!/@(\{v\})?\/$/.test(m.content))base=m.content;/* ที่อยู่ปักหมุดคอมมิตโดย tools/pin_cdn.sh */
 if(base&&!/\/$/.test(base))base+='/';
 const rel=u=>typeof u==='string'&&/^(\.\/|\/)?(assets|js)\//.test(u);
 const cdn=u=>E.base&&rel(u)?E.base+u.replace(/^\.?\//,''):u;
 const E=window.ELDCDN={base,ver,cdn,rel,fail:0,
  /* ลองโหลดไฟล์เล็ก 1 ไฟล์ก่อนเริ่มโหลดเกม · ไม่ได้ใน 5 วิ (ยังไม่มี tag / CDN ล่ม) → ปิด CDN ทั้งรอบนี้ */
  probe:async()=>{if(!E.base)return false;try{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),5000);const r=await fetch(E.base+'js/000-cdn.js',{mode:'cors',signal:ac.signal});clearTimeout(t);if(r.ok)return true}catch(e){}E.base='';E.fail++;return false}};
 if(!base)return;
 const d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
 const back=img=>{const o=img.__cdn0;if(!o)return;img.__cdn0=null;E.fail++;d.set.call(img,o)};
 Object.defineProperty(HTMLImageElement.prototype,'src',{configurable:true,enumerable:d.enumerable,get(){return d.get.call(this)},
  set(v){if(!rel(v)){this.__cdn0=null;d.set.call(this,v);return}
   if(!this.crossOrigin)this.crossOrigin='anonymous';/* ภาพต่างโดเมน: ต้องขอแบบ CORS ไม่งั้นวาดลง canvas แล้วอ่านพิกเซลไม่ได้ */
   if(!this.__cdnL){this.__cdnL=1;this.addEventListener('error',()=>back(this))}
   this.__cdn0=v;d.set.call(this,cdn(v))}});
})();
