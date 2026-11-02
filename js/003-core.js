// ===== v4.6.5 กันจอดำ: เบราว์เซอร์/หน้าเว็บที่ห้ามใช้ที่เก็บข้อมูล → ใช้หน่วยความจำชั่วคราวแทน (เล่นได้ แต่ปิดหน้าแล้วเซฟหาย) =====
(function(){function test(n){try{var s=window[n];var k='__fm_t';s.setItem(k,'1');s.removeItem(k);return true}catch(e){return false}}
 function mem(){var m=Object.create(null);return{__mem:true,getItem:function(k){k=String(k);return k in m?m[k]:null},setItem:function(k,v){m[String(k)]=String(v)},removeItem:function(k){delete m[String(k)]},clear:function(){m=Object.create(null)},key:function(i){var a=Object.keys(m);return i<a.length?a[i]:null},get length(){return Object.keys(m).length}}}
 var bad=false;for(var n of ['localStorage','sessionStorage']){if(!test(n)){bad=true;var o=mem();try{Object.defineProperty(window,n,{value:o,configurable:true,enumerable:true,writable:false})}catch(e){}}}
 window.FM_NOSAVE=bad})();
