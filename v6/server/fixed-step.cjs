/* นาฬิกา monotonic แบบfixed-step: รับเวลาจากserverเท่านั้น
   takeกินtickก่อนdispatch เพื่อไม่เล่นเวลาเดิมซ้ำหลังstorageล้มเหลว
   backlogเกินmaxStepsทิ้งช่วงเก่าและไม่ปล่อยcatch-upไม่สิ้นสุด */
function createFixedStep({start,stepMs,maxSteps}){
 if(!Number.isFinite(start)||!Number.isSafeInteger(stepMs)||stepMs<1||!Number.isSafeInteger(maxSteps)||maxSteps<1)throw Error('fixed-step-config');
 let through=start,lastWall=start,droppedMs=0;
 function take(target){if(!Number.isFinite(target))throw Error('fixed-step-time');if(target<lastWall)return null;lastWall=target;
  let count=Math.floor((target-through)/stepMs);if(count<1)return null;const skipped=Math.max(0,count-maxSteps)*stepMs;through+=skipped;droppedMs+=skipped;through+=stepMs;
  return {at:through,dt:stepMs/1000,skippedMs:skipped};
 }
 function skipBefore(target){if(!Number.isFinite(target))throw Error('fixed-step-time');const n=Math.max(0,Math.floor((target-through)/stepMs));through+=n*stepMs;droppedMs+=n*stepMs;lastWall=Math.max(lastWall,target);}
 return {take,skipBefore,view:()=>({through,lastWall,droppedMs})};
}
module.exports={createFixedStep};
