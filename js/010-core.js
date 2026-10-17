// ค่าคงที่ + การตั้งค่าผู้เล่น (บันทึกใน localStorage)
let D=null,dm=null,dcv=null,dsav=null;
let VW=640,VH=448;const T=32,W=WORLD_W,H=WORLD_H,GRASS=0,WATER=1,SAND=2,TREE=3,ORE=4,DOOR=5,STUMP=6,RUBBLE=7,WARP=8,TOWNGATE=9;
const TW=44,TH=34,GATE=5,DW=21,DH=15,FL=0,WL=1,EXIT=2,CHEST=3;
const WC={x:WARP_TILE.tx*T+16,y:WARP_TILE.ty*T+16},CV={tx:CAVE_TILE.tx,ty:CAVE_TILE.ty};
const COARSE=typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches; // true = มือถือ/แท็บเล็ต (จอสัมผัส)
// ctl = ปุ่มเดินบนจอ: joy จอยสติ๊ก · dpad ปุ่มลูกศร · kbd ซ่อนทั้งหมด(ใช้คีย์บอร์ด) · joyMode float ลอยตามนิ้ว/fixed ตายตัว
const SET=Object.assign({master:.8,music:.5,sfx:.9,res:2,minimap:true,grass:true,grade:true,fps:false,mute:false,ctl:COARSE?'joy':'dpad',joyMode:'float',joySide:'left',joySize:110,joyOp:.75,joyRun:true,runKey:'ctrl'},(()=>{try{return JSON.parse(localStorage.getItem('fm_set')||'{}')}catch(e){return{}}})());
const saveSet=()=>{try{localStorage.setItem('fm_set',JSON.stringify(SET))}catch(e){}};
let RES=SET.res,PAUSED=false,DT=.016;
