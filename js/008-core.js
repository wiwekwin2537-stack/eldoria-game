// ข้อมูลเมือง: แผงตลาด · รถม้า/เกวียน · เสาไฟ
const STALL_DATA=[{x:11,y:15,type:'veg',a:'#c0392b'},{x:13,y:15,type:'fruit',a:'#e08a1e'},{x:26,y:15,type:'bread',a:'#2f7fb0'},{x:28,y:15,type:'veg',a:'#3f9a4a'}];
// lane = แถวถนน(ช่อง) dir=ทิศ(1 ขวา,-1 ซ้าย) v=ความเร็ว kind=horse|ox coat=สีขน(bay|chestnut|grey|black) load=cover|hay|barrels
const CART_DATA=[{kind:'horse',coat:'bay',load:'cover',lane:19.6,x:100,dir:1,v:46},{kind:'ox',load:'hay',lane:20.55,x:1100,dir:-1,v:30},{kind:'horse',coat:'grey',load:'barrels',lane:20.55,x:300,dir:-1,v:34},{kind:'horse',coat:'chestnut',load:'cover',lane:19.6,x:900,dir:1,v:46}];
// จุดเกิด/จุดฟื้นของผู้เล่น (ช่อง) = ลานหน้าปราสาท · ตายหรือวาปกลับเมืองแล้วมาโผล่ที่นี่
const TOWN_SPAWN={x:20,y:13.5};
const LAMP_DATA=[[8,21],[16,21],[23,21],[31,21],[14,13],[25,13]];
