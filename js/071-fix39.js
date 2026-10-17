// fix39 (v4.44) — ในดันเจี้ยนไม่บอกตำแหน่งบอสบนแผนที่เล็ก/แผนที่ใหญ่/ลูกศรนำทาง (ต้องสำรวจหาเอง)
try{const dgHide39=()=>!!(D&&D.dg);
{const _dm=drawMini;drawMini=function(){if(!dgHide39())return _dm.apply(this,arguments);const b=D.boss;D.boss=null;try{return _dm.apply(this,arguments)}finally{if(D&&D.boss==null)D.boss=b}}}
{const _bm=bigMap;bigMap=function(){if(!dgHide39())return _bm.apply(this,arguments);const b=D.boss;D.boss=null;try{return _bm.apply(this,arguments)}finally{if(D&&D.boss==null)D.boss=b}}}
{const _gt=guideTarget;guideTarget=function(){const g=_gt.apply(this,arguments);if(g&&dgHide39()&&/บอส/.test(String(g[2]||'')))return null;return g}}
}catch(e){console.warn('fix39',e)}
