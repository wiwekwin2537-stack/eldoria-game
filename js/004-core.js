// ===== v4.3 บัญชีผู้เล่น + ป้องกันการแก้ไฟล์เซฟ (ต้องรันก่อนสคริปต์เกมทั้งหมด) =====
(function(){const LS=window.localStorage,SP=Storage.prototype,MEM=!!(LS&&LS.__mem),G=MEM?function(k){return LS.getItem(k)}:SP.getItem,S=MEM?function(k,v){return LS.setItem(k,v)}:SP.setItem,R=MEM?function(k){return LS.removeItem(k)}:SP.removeItem;let acct=null;
 try{acct=sessionStorage.getItem('fm_acct');if(!acct&&G.call(LS,'fm_remember')==='1')acct=G.call(LS,'fm_last_acct')}catch(e){}
 window.FM_ACCT=acct||null;
 const glob=k=>!/^fm_/.test(k)||/^fm_(set|accts|acct|last_acct|remember|chatfold|dev|lock)$/.test(k);
 const pre=acct?'u:'+acct+':':'',nk=k=>acct&&!glob(k)?pre+k:k;
 // กุญแจประจำเครื่อง (สุ่มครั้งแรก) ใช้เซ็นข้อมูลเซฟ
 let dev=G.call(LS,'fm_dev');if(!dev){const a=new Uint32Array(4);try{crypto.getRandomValues(a)}catch(e){for(let i=0;i<4;i++)a[i]=Math.random()*4294967296>>>0}dev=[...a].map(x=>x.toString(16).padStart(8,'0')).join('');try{S.call(LS,'fm_dev',dev)}catch(e){}}
 const KEY='eldoria|'+dev+'|'+(acct||'guest');
 function kh(str){let h1=0xdeadbeef^KEY.length,h2=0x41c6ce57;const s=KEY+'#'+str+'#'+KEY;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (h2>>>0).toString(16).padStart(8,'0')+(h1>>>0).toString(16).padStart(8,'0')}
 const PROT=/^fm_(save_v1|x|cls|pt|rune|story|train|skbar|home)$/;window.FM_TAMPER=[];
 SP.getItem=function(k){if(this!==LS)return G.call(this,k);const K=nk(k),v=G.call(this,K);if(v==null||!PROT.test(k))return v;const sig=G.call(this,K+'#sig');
  if(sig==null){return v}if(sig===kh(K+'='+v))return v;window.FM_TAMPER.push(k);const b=G.call(this,K+'#bak'),bs=G.call(this,K+'#bsig');if(b!=null&&bs===kh(K+'='+b))return b;return null};
 SP.setItem=function(k,v){if(this!==LS)return S.call(this,k,v);const K=nk(k);if(PROT.test(k)){v=String(v);const old=G.call(this,K),os=G.call(this,K+'#sig');if(old!=null&&os===kh(K+'='+old)){S.call(this,K+'#bak',old);S.call(this,K+'#bsig',os)}S.call(this,K,v);S.call(this,K+'#sig',kh(K+'='+v));return}return S.call(this,K,v)};
 SP.removeItem=function(k){if(this!==LS)return R.call(this,k);const K=nk(k);R.call(this,K);if(PROT.test(k)){R.call(this,K+'#sig');R.call(this,K+'#bak');R.call(this,K+'#bsig')}};
 window.FM_RAW={get:k=>G.call(LS,k),set:(k,v)=>S.call(LS,k,v),del:k=>R.call(LS,k)};window.FM_KH=kh})();
window.FM_NEW=(()=>{try{return !localStorage.getItem('fm_save_v1')}catch(e){return true}})();
window.FM_APK=window.FM_APK||/[?&]apk=1/.test(location.search)||/android_asset/.test(location.href);
