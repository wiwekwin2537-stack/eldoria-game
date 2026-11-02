// ระบบเสียงทั้งหมดสังเคราะห์ด้วย WebAudio (ไม่ต้องมีไฟล์เสียง): เอฟเฟกต์ · บรรยากาศ · ดนตรี
const AU={c:null,scene:'field',last:{}};
function auInit(){if(AU.c)return;try{const C=AU.c=new(window.AudioContext||window.webkitAudioContext)();AU.m=C.createGain();AU.m.connect(C.destination);
 for(const k of['s','mu','am']){AU[k]=C.createGain();AU[k].connect(AU.m)}
 const b=C.createBuffer(1,C.sampleRate*2,C.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.nb=b;
 auVol();ambStart();setInterval(musicTick,420);setTimeout(birdTick,2500)}catch(e){AU.c=null}}
function auVol(){if(!AU.c)return;AU.m.gain.value=SET.mute?0:SET.master;AU.s.gain.value=SET.sfx;AU.mu.gain.value=SET.music*.5;AU.am.gain.value=.6}
function tone(f,f2,d,ty,v,dl,o){if(!AU.c)return;const C=AU.c,t=C.currentTime+(dl||0),os=C.createOscillator(),g=C.createGain();os.type=ty||'sine';os.frequency.setValueAtTime(f,t);if(f2)os.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);os.connect(g);g.connect(AU[o||'s']);os.start(t);os.stop(t+d+.05)}
function nz(d,v,f1,f2,q,ty,dl,o){if(!AU.c)return;const C=AU.c,t=C.currentTime+(dl||0),s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=AU.nb;f.type=ty||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f1,t);f.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(AU[o||'s']);s.start(t,Math.random());s.stop(t+d+.05)}
const SFX={
swing:()=>nz(.18,.25,500,2400,1.2),swing2:()=>nz(.22,.3,300,1500,1),
hit:()=>{nz(.1,.4,900,200,1);tone(180,60,.12,'square',.15)},
chop:()=>{nz(.09,.5,1800,300,2);tone(140,70,.12,'triangle',.3)},
mine:()=>{tone(1400,900,.12,'square',.07);nz(.08,.4,3500,1500,3);tone(2100,1800,.2,'sine',.08,.02)},
thud:()=>{tone(90,35,.35,'sine',.5);nz(.3,.3,400,80,1,'lowpass')},creak:()=>tone(220,150,.6,'sawtooth',.05),
coin:()=>{tone(1318,0,.08,'square',.06);tone(1760,0,.18,'square',.06,.07)},
gem:()=>{tone(1568,0,.3,'sine',.12);tone(2093,0,.4,'sine',.1,.06);tone(2637,0,.5,'sine',.08,.12)},
pop:()=>tone(500,900,.08,'sine',.12),hurt:()=>{tone(300,100,.25,'sawtooth',.2);nz(.15,.3,1000,200)},
die:()=>tone(400,60,.8,'sawtooth',.2),hop:()=>tone(150,260,.12,'sine',.1),splat:()=>{nz(.25,.4,1200,200,.8,'lowpass');tone(300,80,.2,'sine',.2)},
dash:()=>{nz(.22,.35,3000,300,.7);tone(300,900,.15,'triangle',.1)},
warp:()=>{tone(200,1600,1.1,'sine',.18);tone(300,2400,1.1,'triangle',.08);nz(1,.2,300,4000,.6)},
cave:()=>{tone(110,55,.9,'sine',.3);nz(.8,.25,600,120,.7,'lowpass')},
chest:()=>[523,659,784,1047].forEach((f,i)=>tone(f,0,.4,'triangle',.15,i*.09)),
ui:()=>tone(880,0,.05,'square',.05),heal:()=>[392,523,659,784].forEach((f,i)=>tone(f,0,.5,'sine',.12,i*.12)),
hoof:()=>{nz(.05,.12,900,500,2);nz(.05,.1,800,400,2,'bandpass',.12)},
door:()=>{tone(180,120,.5,'sawtooth',.06);nz(.45,.12,700,200,1.2,'bandpass');tone(90,70,.12,'square',.08,.38)},
bell:()=>{tone(1568,0,.5,'sine',.1);tone(2093,0,.7,'sine',.08,.1)},
step:()=>{const s=AU.scene;if(s==='town'||s==='shop'){nz(.04,.09,2600,1400,2);tone(120,80,.05,'sine',.08)}else if(s==='cave'){nz(.07,.12,500,200,1,'lowpass');tone(70,50,.12,'sine',.1)}else nz(.07,.1,800,300,1,'lowpass')}};
function sfx(n){if(!AU.c||SET.mute||!SFX[n])return;const t=performance.now();if(AU.last[n]&&t-AU.last[n]<45)return;AU.last[n]=t;SFX[n]()}
function ambStart(){const C=AU.c,s=C.createBufferSource(),f=C.createBiquadFilter(),g=AU.wg=C.createGain(),l=C.createOscillator(),lg=C.createGain();s.buffer=AU.nb;s.loop=true;f.type='bandpass';f.frequency.value=500;f.Q.value=.6;g.gain.value=.05;l.frequency.value=.15;lg.gain.value=.03;l.connect(lg);lg.connect(g.gain);l.start();s.connect(f);f.connect(g);g.connect(AU.am);s.start()}
function setScene(k){AU.scene=k;if(AU.wg)AU.wg.gain.setTargetAtTime(k==='cave'?.012:k==='town'?.025:k==='shop'?.008:.06,AU.c.currentTime,.5)}
function birdTick(){setTimeout(birdTick,2500+Math.random()*5500);if(!AU.c||SET.mute||document.hidden)return;const s=AU.scene;
 if(s==='cave')tone(1900,900,.14,'sine',.12,0,'am');
 else if(s==='town')nz(.7,.05,500,800,.5,'bandpass',0,'am');
 else if(s==='shop')return;
 else{const f=2400+Math.random()*1400;for(let i=0;i<2+(Math.random()*3|0);i++)tone(f+i*120,f*1.25,.08,'sine',.05,i*.11,'am')}}
const mf=n=>440*Math.pow(2,(n-69)/12),P5=[0,2,4,7,9];
function musicTick(){if(!AU.c||SET.mute||SET.music<=0||document.hidden)return;const s=AU.step=(AU.step||0)+1,sc=AU.scene,r=[0,-3,-7,-5][(s>>3)&3];
 if(sc==='cave'){if(s%6===0)tone(mf(36+r),0,2.6,'sine',.5,0,'mu');if(Math.random()<.25)tone(mf(69+P5[Math.random()*5|0]),0,1.6,'sine',.15,0,'mu');return}
 if(s%8===0)[0,4,7].forEach(i=>tone(mf(48+r+i),0,3.4,'sine',.22,0,'mu'));
 const pk=()=>mf(66+r+P5[Math.random()*5|0]+(Math.random()<.3?12:0));
 if(Math.random()<(sc==='town'||sc==='shop'?.95:.55))tone(pk(),0,.9,'triangle',.3,0,'mu');
 if((sc==='town'||sc==='shop')&&Math.random()<.6)tone(pk(),0,.7,'triangle',.25,.21,'mu')}
function toggleMute(){SET.mute=!SET.mute;auVol();saveSet();const b=document.getElementById('muteb');if(b)b.textContent=SET.mute?'🔇':'🔊';say(SET.mute?'ปิดเสียง':'เปิดเสียง')}
