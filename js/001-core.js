(function(){var B=document.getElementById('boot106'),F=B.querySelector('.fill106'),P=B.querySelector('.pc106'),T=B.querySelector('.tip106'),N=110;
var tips=['💡 แตะไอเท็มในกระเป๋าแล้วกด 📍 เพื่อดูว่าหาได้จากที่ไหน','💡 นครวารีคือเมืองแห่งดันเจี้ยน — ชุดใหม่ดรอปจากบอส','💡 ใส่ชุดครบเซ็ต 4 ชิ้นได้โบนัสพิเศษ','💡 ตีบวกชุดหลักแล้วออร่ายังขึ้นแม้ใส่คอสตูม','💡 เล่นแนวนอนจะเห็นปุ่มครบ'];T.textContent=tips[Math.floor(Math.random()*tips.length)];
window.BOOT106={set:function(p,s){p=Math.max(0,Math.min(100,p|0));F.style.width=p+'%';P.textContent=p+'%';if(s)B.querySelector('.st106').textContent=s},el:B,
 tick:setInterval(function(){var n=document.scripts.length;if(!window.BOOT106.done)window.BOOT106.set(Math.min(92,5+n/N*87))},120)};})();
