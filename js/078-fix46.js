const SNZ54=.7;window.SNZ54=SNZ54;
// fix46 (v4.52) — สกิลใหม่ช่อง 4–6 + พาสซีฟเสริมสกิล 3 ขั้น ของอีก 10 อาชีพ (ตามแผน design/skills-plan.json) + ตารางพาสซีฟในหน้าต่างสกิล
// ทุกอย่างเป็นของใหม่ห่อทับ ไม่แก้โค้ดเดิม · มังค์ทำไว้แล้วใน fix41
try{
const PLAN46={"sword": {"newSkills": [{"e": "⚡", "n": "ทะยานดาบ", "lv": 50, "mp": 20, "cd": 8, "d": "พุ่งไปข้างหน้า 220px ฟันทุกตัวตามทาง ×2.0 อมตะระหว่างพุ่ง", "role": "เคลื่อนที่", "aoe": "แนวยาว 220×60"}, {"e": "🛡️", "n": "ปราการเหล็ก", "lv": 75, "mp": 35, "cd": 22, "d": "ตอนเปิดใช้ ปล่อยคลื่นกระแทกรอบตัว ×1.2 + ผลัก แล้ว 6 วิ: ลดดาเมจที่รับ 40% · ยั่วยุมอนรอบตัว · สะท้อนดาเมจ 20%", "role": "ตั้งรับ", "aoe": "วงรอบตัว 140"}, {"e": "🌩️", "n": "ดาบผ่าฟ้า", "lv": 100, "mp": 70, "cd": 30, "d": "ชาร์จ 0.6 วิ แล้วฟันคลื่นดาบยักษ์รูปพัดด้านหน้า ×4.5 + มึน 1.5 วิ", "role": "ท่าหนัก", "aoe": "พัดหน้า 260"}], "passives": [{"e": "🔥", "n": "โทสะนักรบ", "lv": 40, "d": "สกิลโดนศัตรู ได้แต้มโทสะ 1 (สูงสุด 5) แต่ละแต้มดาเมจสกิล +4% นาน 6 วิ"}, {"e": "🔗", "n": "ต่อดาบ", "lv": 70, "d": "ใช้ดาบสามจังหวะครบ 3 จังหวะ ลดคูลดาวน์สกิลอื่นทั้งหมด 2 วิ"}, {"e": "🩸", "n": "ไม่มีวันล้ม", "lv": 110, "d": "ขณะเลือดต่ำกว่า 30% สกิลดูดเลือด 8% ของดาเมจ"}]}, "mage": {"newSkills": [{"e": "🌀", "n": "วาร์ปเวท", "lv": 50, "mp": 18, "cd": 7, "d": "วาร์ปไปทางที่เล็ง 180px ทิ้งระเบิดน้ำแข็งที่จุดเดิม ×1.5 + ช้า 50% 3 วิ", "role": "เคลื่อนที่", "aoe": "วงที่จุดเดิม 120"}, {"e": "❄️", "n": "คุกน้ำแข็ง", "lv": 75, "mp": 40, "cd": 20, "d": "ระเบิดน้ำแข็งด้านหน้า ×1.5 แช่แข็งทุกตัวในวง 2.5 วิ (บอส 1 วิ) ศัตรูที่ถูกแช่รับดาเมจ +25%", "role": "ควบคุม", "aoe": "วงหน้า 160"}, {"e": "🔆", "n": "ลำแสงอาร์เคน", "lv": 100, "mp": 80, "cd": 32, "d": "ยิงลำแสงต่อเนื่อง 2.5 วิ ทะลุทุกตัว ×0.8 ทุก 0.2 วิ (รวมราว ×10) เดินช้าลงระหว่างยิง", "role": "ท่าหนัก", "aoe": "แนวยาว 420×50"}], "passives": [{"e": "♨️", "n": "ธาตุประสาน", "lv": 40, "d": "สกิลน้ำแข็งตามด้วยสกิลไฟภายใน 3 วิ เกิดระเบิดธาตุ ×1.5 ที่เป้า"}, {"e": "🧘", "n": "สมาธิเวท", "lv": 70, "d": "ใช้สกิลแต่ละครั้งได้ 1 สแตก (สูงสุด 5) สกิลถัดไปใช้มานาน้อยลง 6% ต่อสแตก"}, {"e": "🌟", "n": "จอมขมังเวท", "lv": 110, "d": "สกิลที่คริติคอล ชาร์จเกจอัลติเมท +3%"}]}, "archer": {"newSkills": [{"e": "🪤", "n": "กับดักหนาม", "lv": 50, "mp": 16, "cd": 10, "d": "วางกับดัก 3 อันใต้เท้า มอนเหยียบระเบิด ×1.8 + ตรึงอยู่กับที่ 1.5 วิ", "role": "ควบคุม", "aoe": "3 วง × 90"}, {"e": "🐍", "n": "ธนูพิษงูเห่า", "lv": 75, "mp": 22, "cd": 12, "d": "ยิงธนูพิษทะลุ ×1.4 จุดตกแตกเป็นหมอกพิษ 5 วิ: ทุกตัวในหมอกโดนพิษ ×0.3/วิ + ลดเกราะ 20%", "role": "ดีบัฟ", "aoe": "แนวยาว + วงหมอก 120"}, {"e": "🌬️", "n": "ธนูวายุคลั่ง", "lv": 100, "mp": 65, "cd": 30, "d": "ยิงธนูยักษ์พุ่งช้า ดูดศัตรูรอบทางเข้ามารวม แล้วระเบิด ×4.0", "role": "ท่าหนัก", "aoe": "ดูด 180 · ระเบิด 160"}], "passives": [{"e": "🪶", "n": "ลมใต้ปีก", "lv": 40, "d": "ใช้สกิลแล้ววิ่งเร็วขึ้น 20% นาน 2 วิ"}, {"e": "🎯", "n": "เป้านิ่ง", "lv": 70, "d": "ศัตรูที่ติดกับดัก/ช้า/ตรึง รับโอกาสคริติคอลจากเรา +15%"}, {"e": "➶", "n": "ลูกธนูไม่สิ้นสุด", "lv": 110, "d": "สกิลที่ยิงหลายดอก ยิงเพิ่มอีก 1 ดอก"}]}, "ninja": {"newSkills": [{"e": "🎴", "n": "ประทับเงา", "lv": 50, "mp": 20, "cd": 10, "d": "ขว้างคุไนติดเป้า ×1.2 กดซ้ำภายใน 4 วิ วาร์ปไปหาเป้าแล้วหมุนฟันรอบตัว ×2.5 ทุกตัวในวง", "role": "เคลื่อนที่", "aoe": "วงรอบเป้า 120"}, {"e": "👥", "n": "ร่างแยกเงา", "lv": 75, "mp": 25, "cd": 18, "d": "สร้างร่างแยก 2 ร่าง 10 วิ เดินตามและโจมตีตามเรา ดาเมจ 40%", "role": "อัญเชิญ", "aoe": "—"}, {"e": "🩸", "n": "ดาบจันทร์โลหิต", "lv": 100, "mp": 60, "cd": 28, "d": "ฟันจันทร์เสี้ยวสีเลือดวงกว้าง ×3.0 ศัตรูเลือดต่ำกว่า 30% รับ ×2 (ท่าประหาร)", "role": "ท่าหนัก", "aoe": "วงรอบตัว 200"}], "passives": [{"e": "🗡️", "n": "ลอบสังหาร", "lv": 40, "d": "การโจมตีแรกหลังออกจากล่องหน คริติคอลแน่นอน + คริดาเมจ +50%"}, {"e": "💧", "n": "ไหลลื่น", "lv": 70, "d": "ฆ่าศัตรูด้วยสกิลใด สกิลนั้นคูลดาวน์ลดลงครึ่งหนึ่งทันที"}, {"e": "🌘", "n": "เงาซ้อนเงา", "lv": 110, "d": "ร่างแยกใช้สกิลตามเราด้วย ดาเมจ 30%"}]}, "sniper": {"newSkills": [{"e": "🧨", "n": "ระเบิดมือแสง", "lv": 50, "mp": 15, "cd": 8, "d": "ปาระเบิดไปจุดที่เล็ง ×1.6 + มึน 1.2 วิ + ผลักศัตรูออกจากตัว", "role": "ควบคุม", "aoe": "วงที่จุดเล็ง 130"}, {"e": "🔭", "n": "โหมดซุ่มยิง", "lv": 75, "mp": 30, "cd": 20, "d": "6 วิ: ยืนนิ่งแล้วระยะยิง +50% ดาเมจ +40% คริ +20% และกระสุนทุกนัดระเบิดเล็ก ๆ ที่เป้า ×0.5 (ขยับตัว = ยกเลิก)", "role": "บัฟ", "aoe": "วงที่เป้า 60"}, {"e": "⚡", "n": "กระสุนเรลกัน", "lv": 100, "mp": 70, "cd": 30, "d": "ชาร์จ 1 วิ ยิงลำแสงทะลุสุดจอ ×6.0 ถ้ายิงระหว่างโหมดซุ่มยิง ×1.3 เพิ่ม", "role": "ท่าหนัก", "aoe": "แนวยาวสุดจอ×60"}], "passives": [{"e": "📏", "n": "ระยะสังหาร", "lv": 40, "d": "ศัตรูที่อยู่ไกลกว่า 250px รับดาเมจสกิล +20%"}, {"e": "🔄", "n": "บรรจุเร็ว", "lv": 70, "d": "สกิลที่คริติคอล ลดคูลดาวน์สกิลทั้งหมด 0.5 วิ"}, {"e": "☠️", "n": "นัดเดียวจบ", "lv": 110, "d": "ศัตรูเลือดต่ำกว่า 20% สกิลคริดาเมจ ×1.5 เพิ่ม"}]}, "paladin": {"newSkills": [{"e": "🐎", "n": "พุ่งโล่ศรัทธา", "lv": 50, "mp": 18, "cd": 9, "d": "พุ่งไปข้างหน้า 200px ดันศัตรูตามทางไปด้วย ×1.6 + มึน 1 วิ", "role": "เคลื่อนที่", "aoe": "แนวยาว 200×70"}, {"e": "🔆", "n": "ออร่าศักดิ์สิทธิ์", "lv": 75, "mp": 40, "cd": 25, "d": "10 วิ: ตัวเราและปาร์ตี้ใกล้ ๆ ลดดาเมจ 15% · ศัตรูในออร่าโดนเผา ×0.3/วิ · ไม่ฟื้นเลือด", "role": "ปาร์ตี้", "aoe": "วงรอบตัว 160"}, {"e": "⚖️", "n": "ดาบตัดสินโลกันตร์", "lv": 100, "mp": 70, "cd": 30, "d": "ฟาดดาบแสงลงพื้นเป็นแนวยาว 2 ครั้ง ×2.0 แล้วครั้งที่ 3 ระเบิดแสงเป็นวงใหญ่ ×3.5 + ฮีลตัวเอง 15%", "role": "ท่าหนัก", "aoe": "แนวยาว + วงสุดท้าย 180"}], "passives": [{"e": "🪞", "n": "ศรัทธาสะท้อน", "lv": 40, "d": "ขณะมีปราการเทพหรือออร่าศักดิ์สิทธิ์ สะท้อนดาเมจ 25% กลับไปที่ผู้โจมตี"}, {"e": "✨", "n": "แสงบริสุทธิ์", "lv": 70, "d": "สกิลที่ทำให้ศัตรูมึน ฮีลตัวเอง 3% ต่อศัตรู 1 ตัว (สูงสุด 15%)"}, {"e": "👼", "n": "ผู้ไม่ยอมตาย", "lv": 110, "d": "เมื่อเลือดหมด ฟื้นทันทีพร้อมเลือด 30% (ใช้ได้ทุก 5 นาที · ปิดใน PvP)"}]}, "cleric": {"newSkills": [{"e": "🕊️", "n": "ชำระล้าง", "lv": 50, "mp": 25, "cd": 14, "d": "ระเบิดแสงรอบตัว ×1.2 ผลักศัตรู · ล้างมึน/ช้า/ไหม้/พิษ ให้ตัวเองและปาร์ตี้ในวง + ฮีล 15% · ไม่ให้โล่หรืออมตะ", "role": "ปาร์ตี้", "aoe": "วงรอบตัว 150"}, {"e": "🔔", "n": "ระฆังสวรรค์", "lv": 75, "mp": 35, "cd": 20, "d": "วางระฆังแสงที่จุดเล็ง 6 วิ ตีทุก 1 วิ: ศัตรูในวงโดน ×1.0 · พวกเดียวกันในวงฮีล 3%", "role": "พื้นที่", "aoe": "วงที่จุดเล็ง 150"}, {"e": "🪽", "n": "ปีกเทวทูต", "lv": 100, "mp": 70, "cd": 32, "d": "6 วิ: ลอยตัว เดินเร็ว +30% ยิงขนนกแสงใส่ศัตรูใกล้สุดทุก 0.5 วิ ระเบิดเป็นวงเล็ก ×1.2 ฮีลตัวเอง 1% ต่อนัด", "role": "ท่าหนัก", "aoe": "วงเล็กต่อนัด 70"}], "passives": [{"e": "🫧", "n": "พรสะสม", "lv": 40, "d": "ใช้พิพากษาสวรรค์ขณะเลือดอย่างน้อย 98% ได้โล่ 10% สะสมสูงสุด 20% ของเลือดเต็ม นาน 10 วิ · สกิลฮีลไม่สร้างโล่"}, {"e": "⚡", "n": "แสงตอบแทน", "lv": 70, "d": "ทุกครั้งที่ฮีล สกิลโจมตีถัดไปแรงขึ้น 20%"}, {"e": "🌈", "n": "ปาฏิหาริย์", "lv": 110, "d": "สกิลฮีลมีโอกาส 20% ไม่ติดคูลดาวน์"}]}, "necro": {"newSkills": [{"e": "🩻", "n": "ระเบิดกระดูก", "lv": 50, "mp": 20, "cd": 8, "d": "สั่งโครงกระดูกทุกตัวระเบิด ×2.0 รอบตัวมัน (ถ้าไม่มีโครงกระดูก ระเบิดรอบตัวเรา ×1.2)", "role": "พื้นที่", "aoe": "วง 110 ต่อโครงกระดูก"}, {"e": "🦇", "n": "ฝูงค้างคาวโลหิต", "lv": 75, "mp": 30, "cd": 14, "d": "ปล่อยค้างคาว 6 ตัวบินวนรอบตัว 3 วิ กัดทุกตัวที่อยู่ใกล้ ×0.9 ต่อครั้ง ดูดเลือดกลับ 50% ของดาเมจ", "role": "ดูดเลือด", "aoe": "วงรอบตัว 170"}, {"e": "🧟", "n": "อัศวินมรณะ", "lv": 100, "mp": 75, "cd": 40, "d": "อัญเชิญอัศวินมรณะยักษ์ 20 วิ ฟาดดาบใหญ่โดนทุกตัวด้านหน้ามัน ×2.0 และยั่วยุมอนให้หันไปตีมัน", "role": "อัญเชิญ", "aoe": "พัดหน้าอัศวิน 120"}], "passives": [{"e": "⚰️", "n": "กองทัพไม่ตาย", "lv": 40, "d": "โครงกระดูกที่ตาย ฟื้นคืนอีก 1 ครั้งพร้อมเลือด 50%"}, {"e": "🕸️", "n": "สายสัมพันธ์มรณะ", "lv": 70, "d": "มีโครงกระดูกอยู่กี่ตัว ดาเมจสกิลเรา +4% ต่อตัว"}, {"e": "👑", "n": "จ้าวแห่งความตาย", "lv": 110, "d": "ศัตรูที่ตายในทุ่งคำสาป กลายเป็นโครงกระดูกของเราฟรี 1 ตัว"}]}, "monk": {"newSkills": [{"e": "☁️", "n": "ก้าวเมฆา", "lv": 50, "mp": 14, "cd": 6, "d": "พุ่งไปหาศัตรูใกล้สุดในระยะ 220px เตะลงพื้นเกิดคลื่นกระแทก ×1.8 ทุกตัวรอบจุดตก ถ้าฆ่าได้ คูลดาวน์รีเซ็ตทันที", "role": "เคลื่อนที่", "aoe": "วงที่จุดตก 110"}, {"e": "🔶", "n": "กายวัชระ", "lv": 75, "mp": 30, "cd": 20, "d": "6 วิ: ลดดาเมจที่รับ 35% · ทุกครั้งที่โดนตี สวนกลับรอบตัว ×0.8", "role": "ตั้งรับ", "aoe": "วงรอบตัว 110"}, {"e": "✊", "n": "หมัดเทพสังหาร", "lv": 100, "mp": 65, "cd": 28, "d": "ชาร์จ 0.5 วิ ปล่อยหมัดพลังรูปมังกรพุ่งเป็นแนวตรง ทะลุทุกตัว ×5.0 ปลายทางระเบิดเป็นวง ×2.0", "role": "ท่าหนัก", "aoe": "แนวยาว 360×70 + วงปลาย 140"}], "passives": [{"e": "🔥", "n": "คอมโบลมปราณ", "lv": 40, "d": "ตีโดนทุกครั้ง +1 คอมโบ (สูงสุด 30) แต่ละคอมโบดาเมจ +1% · ไม่ตี 3 วิคอมโบหาย"}, {"e": "🌊", "n": "จังหวะไหลเวียน", "lv": 70, "d": "ใช้สกิลต่างกัน 3 ท่าติดกันภายใน 5 วิ ฟื้นมานา 15%"}, {"e": "☸️", "n": "ใจอรหันต์", "lv": 110, "d": "คอมโบครบ 30 สกิลถัดไปแรง ×2 แล้วคอมโบเริ่มใหม่"}]}, "dragoon": {"newSkills": [{"e": "🌠", "n": "ทวนบูมเมอแรง", "lv": 50, "mp": 16, "cd": 7, "d": "ขว้างทวนพุ่งไกล 400px ทะลุ ×1.8 แล้วทวนบินกลับมาที่มือ ตีขากลับอีก ×1.0", "role": "ระยะไกล", "aoe": "แนวยาว 400×50 ไป-กลับ"}, {"e": "🦎", "n": "ผิวเกล็ดมังกร", "lv": 75, "mp": 35, "cd": 22, "d": "8 วิ: เกราะ +40% · กันมึนและไหม้ · มีไอเพลิงรอบตัวเผาทุกตัวใกล้ ๆ ×0.3/วิ · ทุกการโจมตีทำให้ศัตรูติดไฟ", "role": "บัฟ", "aoe": "วงรอบตัว 120"}, {"e": "🌋", "n": "ร่วงจากนภา", "lv": 100, "mp": 70, "cd": 30, "d": "กระโดดหายขึ้นฟ้า 1.2 วิ (อมตะ) ใช้จอยเลือกจุดตก แล้วกระแทก ×5.0 วงกว้าง + ทุ่งไฟ 3 วิ", "role": "ท่าหนัก", "aoe": "วงที่จุดตก 220"}], "passives": [{"e": "🪂", "n": "แรงส่งจากฟ้า", "lv": 40, "d": "สกิลกระโดดและร่วงลงแรงขึ้น 25% และอมตะตอนลอยอยู่"}, {"e": "🔥", "n": "เพลิงไม่ดับ", "lv": 70, "d": "ศัตรูที่กำลังไหม้ รับดาเมจจากทวน +15%"}, {"e": "👑", "n": "สายเลือดราชันมังกร", "lv": 110, "d": "ขณะเลือดมากกว่า 80% ดาเมจสกิล +20%"}]}, "summoner": {"newSkills": [{"e": "📯", "n": "แตรสั่งโจมตี", "lv": 50, "mp": 15, "cd": 10, "d": "เป่าแตรเกิดคลื่นเสียงที่จุดเล็ง ×1.0 + ช้า 2 วิ สัตว์ทุกตัวพุ่งเข้าหาจุดนั้น ดาเมจสัตว์ +50% นาน 5 วิ", "role": "สั่งการ", "aoe": "วงที่จุดเล็ง 140"}, {"e": "🐢", "n": "เต่าผู้พิทักษ์", "lv": 75, "mp": 35, "cd": 25, "d": "อัญเชิญเต่ายักษ์ 20 วิ ยั่วยุมอน รับดาเมจแทนเรา 30% และกระแทกกระดองลงพื้นทุก 3 วิ ×1.2 รอบตัวมัน", "role": "อัญเชิญ", "aoe": "วงรอบเต่า 130"}, {"e": "🐍", "n": "พญานาคราช", "lv": 100, "mp": 75, "cd": 40, "d": "อัญเชิญพญานาค 15 วิ พ่นน้ำเป็นพัดกว้างทุก 1.5 วิ ×1.5 + ช้า", "role": "อัญเชิญ", "aoe": "พัดหน้า 220"}], "passives": [{"e": "🤝", "n": "ผูกพัน", "lv": 40, "d": "มีสัตว์อยู่กี่ตัว ลดดาเมจที่เรารับ 3% ต่อตัว"}, {"e": "🍃", "n": "สัญชาตญาณฝูง", "lv": 70, "d": "สัตว์ฆ่าศัตรูได้ ฟื้นมานาเรา 2%"}, {"e": "🌳", "n": "จ้าวพงไพร", "lv": 110, "d": "จำนวนสัตว์สูงสุด +1 ทุกชนิด และอยู่ได้นานขึ้น 30%"}]}};
const CLS46=Object.keys(PLAN46).filter(k=>k!=='monk');
const B46={buf:{},st:{},lastHp:null,skT:0,cast:null};window.B46=B46;
const on46=(k,lv)=>P.cls===k&&P.lv>=lv;
const buf=k=>B46.buf[k]&&B46.buf[k].t>0?B46.buf[k]:null;
const setBuf=(k,t,o)=>{B46.buf[k]=Object.assign({t},o||{});return B46.buf[k]};
const sc46=()=>{try{return netScene()}catch(e){return ''}};
const later=(ms,fn)=>{const s=sc46();setTimeout(()=>{try{if(P.dead||sc46()!==s)return;fn()}catch(e){console.warn('[fix46]',e)}},ms)};
/* v5.63 ซุ่มยิงล็อคเป้า (เจ้าของสั่ง 2026-10-21: "ซูมแล้วล็อคเป้า ปล่อยแล้วตูมตัวนั้น") · เลือกมอนที่ตรงทิศลากที่สุดในระยะ 900 · ยิง ×8 (v5.68 เจ้าของ: เดิม ×3 เบาสุดในอาชีพ · วัดเฉลี่ย 10 นัด ≈ 1.5 เท่าของห่ากระสุน · ซ้อนบัฟซุ่มยิง ×1.4) · ติดกำแพง = ไม่โดน · มอนเท่านั้น ไม่โดนผู้เล่น */
const LOCKX62=8;window.LOCKX62=LOCKX62;window.lock62=(a)=>lock62(a);
function lock62(a){let best=null,bs=-1;try{for(const e of enemies()){if(!e||e.dead)continue;const dx=e.x-P.x,dy=(e.y-14)-(P.y-14),d=Math.hypot(dx,dy);if(d<1||d>a.range)continue;const c=(dx*a.dv[0]+dy*a.dv[1])/d;if(c<.93)continue;const sc=c-d/a.range*.05;if(sc>bs){bs=sc;best=e}}}catch(e){}return best}
function draw62(a){const t=a.target&&!a.target.dead?a.target:null;ctx.save();try{if(!t){ctx.strokeStyle='rgba(255,85,85,.55)';ctx.lineWidth=1.5;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(P.x,P.y-14);ctx.lineTo(P.x+a.dv[0]*a.range,P.y-14+a.dv[1]*a.range);ctx.stroke();return}
 const x=t.x,y=t.y-16,r=22+3*Math.sin(performance.now()/120);ctx.strokeStyle='#ff3b3b';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();ctx.beginPath();for(const [u,v] of [[1,0],[-1,0],[0,1],[0,-1]]){ctx.moveTo(x+u*(r-8),y+v*(r-8));ctx.lineTo(x+u*(r+8),y+v*(r+8))}ctx.stroke();ctx.fillStyle='#ff3b3b';ctx.fillRect(x-2,y-2,4,4);
 ctx.strokeStyle='rgba(255,60,60,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(P.x,P.y-14);ctx.lineTo(x,y);ctx.stroke()}finally{ctx.restore()}}
function fire62(a){const t=a.target&&!a.target.dead?a.target:null;if(t)P.dir=Math.abs(t.x-P.x)>Math.abs(t.y-P.y)?(t.x>P.x?'r':'l'):(t.y>P.y?'d':'u');const cd0=CS.cd[4];useSkill(4);if(!(CS.cd[4]>cd0)||!t)return; /* สกิลไม่ทำงาน (มานา/คูลดาวน์) = ไม่ยิง */
 const dx=t.x-P.x,dy=t.y-P.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;let reach=d;try{if(typeof reach61==='function')reach=reach61(P.x,P.y,ux,uy,d)}catch(e){}
 try{ef({k:'rail',x:P.x,y:P.y-12,dx:ux,dy:uy,len:Math.min(d,reach),l:.4})}catch(e){}try{shake(5,.2);sfx('thud')}catch(e){}
 if(reach<d-12)return;try{hurtE(t,LOCKX62,{kb:140,fx:P.x,fy:P.y,col:'#ffd27a'})}catch(e){console.warn('[v563]',e)}}
/* Manual sniper aim belongs to the skill-button lifecycle, not automatic target lock. */
const SKILLAIM46={active:null,cast:null,ui:null,
 config(i){if(P.cls!=='sniper'||![0,1,2,3,4,5].includes(i))return null;if(i===4)return{lock:true,spread:0,range:900,width:0,area:false}; /* v5.63 ซุ่มยิง: กดค้าง=ซูม · ลาก=ล็อคมอน · ปล่อย=ยิงตูมตัวที่ล็อค */const step=CS.step||0,range=i===0?560:i===1?[540,480,420][step%3]:i===2?140:i===3?300:800;return{spread:i===1&&step===1?.06:0,range:range*(buf('snipe')&&i<2?1.5:1),width:i===5?30:i===2?95:i===3?130:7,area:i===2||i===3}},
 valid(a){return a&&P.cls==='sniper'&&!PAUSED&&!P.dead&&!DOORA.k&&P.stun<=0&&P.dash<=0&&!FISH.st&&sc46()===a.scene},
 begin(button,i,e){if(this.active)return true;const cfg=this.config(i);if(!cfg||PAUSED||P.dead||DOORA.k||P.stun>0||P.dash>0||CS.cd[i]>0&&!(i===1&&CS.step>0)||!skOwned(i)||i>=3&&!bought56(i)||D&&(D.town||D.shop)||FISH.st)return false;
 const S=CSKILLS[P.cls][i],cost=i<3?cskMp(S,i===1?CS.step||0:0):Math.round(cskMp(S,0)*(1-PTX().mpc));if(P.mp<cost)return false;const dv=aimDir(cfg.range).slice();this.active={...cfg,i,id:e.pointerId,button,x:e.clientX,y:e.clientY,dv,distance:cfg.range,scene:sc46(),cancel:false,moved:false};try{button.setPointerCapture(e.pointerId)}catch(error){}
 const ui=document.createElement('div');ui.id='skillAim46';ui.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:35;color:white;font:600 13px system-ui';ui.innerHTML='<span style="position:absolute;right:calc(12px + env(safe-area-inset-right,0px));top:calc(12px + env(safe-area-inset-top,0px));width:68px;height:68px;border:2px solid #ff6262;border-radius:50%;display:grid;place-items:center;background:#451825cc">✕ ยกเลิก</span><span style="position:absolute;bottom:calc(12px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);padding:6px 12px;border-radius:12px;background:#25131ccc;white-space:nowrap">ลากเล็ง • ปล่อยเพื่อยิง</span>';document.body.appendChild(ui);this.ui=ui;return true},
 move(e){const a=this.active;if(!a||a.id!==e.pointerId)return;if(!this.valid(a)){this.cancel();return}this.sync(a);const dx=e.clientX-a.x,dy=e.clientY-a.y,d=Math.hypot(dx,dy);const box=this.ui?.firstElementChild.getBoundingClientRect();a.cancel=!!box&&e.clientX>=box.left-12&&e.clientY<=box.bottom+12;if(d>=6){a.dv=[dx/d,dy/d];a.moved=true;if(a.area)a.distance=Math.min(1,d/90)*a.range}if(a.lock)a.target=lock62(a);if(this.ui)this.ui.lastElementChild.textContent=a.cancel?'ปล่อยเพื่อยกเลิก':'ลากเล็ง • ปล่อยเพื่อยิง'},
 end(e){const a=this.active;if(!a||a.id!==e.pointerId)return;this.move(e);const valid=this.valid(a)&&!a.cancel;this.cancel();if(!valid)return;if(!a.moved){useSkill(a.i);return}if(a.lock){fire62(a);return}const old=this.cast;this.cast={...a,dv:a.dv.slice()};try{P.dir=Math.abs(a.dv[0])>Math.abs(a.dv[1])?(a.dv[0]>0?'r':'l'):(a.dv[1]>0?'d':'u');useSkill(a.i)}finally{this.cast=old}},
 cancel(id){const a=this.active;if(!a||id!=null&&id!==a.id)return;this.active=null;this.ui?.remove();this.ui=null;try{if(a.button.hasPointerCapture(a.id))a.button.releasePointerCapture(a.id)}catch(error){}},
 sync(a){const cfg=this.config(a.i);if(cfg)a.spread=cfg.spread;if(cfg&&cfg.range!==a.range){a.distance*=cfg.range/a.range;a.range=cfg.range}},
 effective(a){const max=a.area?a.distance:a.range;return (a.i===3||a.i===5)&&typeof reach61==='function'?Math.min(max,Math.max(a.i===5?40:0,reach61(P.x,P.y,a.dv[0],a.dv[1],max))):max},
 point(i){const a=this.cast,d=a?this.effective(a):0;return a&&a.i===i?[P.x+a.dv[0]*d,P.y+a.dv[1]*d]:null},
 draw(){if(window.__IN_OTHER8||window.__lbav65||window.GHOST143)return;const a=this.active;if(!a)return;this.sync(a);if(!this.valid(a)){this.cancel();return}if(a.lock){draw62(a);return}const distance=this.effective(a),x=P.x,y=P.y-(a.area?0:a.i===5?12:14),angle=Math.atan2(a.dv[1],a.dv[0]);ctx.save();try{ctx.translate(x,y);ctx.rotate(angle);ctx.strokeStyle=a.cancel?'#999':'#ff5555';ctx.fillStyle=a.cancel?'rgba(150,150,150,.12)':'rgba(255,45,70,.17)';ctx.lineWidth=1.5;if(a.area){ctx.beginPath();ctx.arc(distance,0,a.width,0,Math.PI*2);ctx.fill();ctx.stroke()}else{for(const offset of a.spread?[-a.spread,a.spread]:[0]){ctx.save();ctx.rotate(offset);ctx.fillRect(0,-a.width,distance,a.width*2);ctx.strokeRect(0,-a.width,distance,a.width*2);ctx.restore()}}ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(distance,0);ctx.stroke();ctx.strokeStyle='#ffe5e5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(distance-7,0);ctx.lineTo(distance+7,0);ctx.moveTo(distance,-7);ctx.lineTo(distance,7);ctx.stroke()}finally{ctx.restore()}}
};window.SKILLAIM46=SKILLAIM46;
window.addEventListener('pointermove',e=>{const a=SKILLAIM46.active;if(a&&(e.target===window||!a.button.contains(e.target)))SKILLAIM46.move(e)});window.addEventListener('pointerup',e=>SKILLAIM46.end(e));window.addEventListener('pointercancel',e=>SKILLAIM46.cancel(e.pointerId));
for(const type of ['blur','resize'])window.addEventListener(type,()=>SKILLAIM46.cancel());document.addEventListener('visibilitychange',()=>{if(document.hidden)SKILLAIM46.cancel()});window.addEventListener('keydown',e=>{if(e.key==='Escape')SKILLAIM46.cancel()});

const dirv=r=>aimDir(r||300);
const hitAt=(x,y,r,mult,o)=>{let n=0,k=0;eachIn(x,y-6,r,e=>{if(e.dead)return;const d=hurtE(e,mult,Object.assign({},o));if(d>0){n++;if(e.hp<=0||e.dead)k++}});return {n,k}};
const lineHit=(dv,len,w,mult,o)=>{let n=0;line25(dv,len,w,e=>{if(!e.dead&&hurtE(e,mult,Object.assign({},o))>0)n++});return n};
function dash46(dv,len){let moved=0;for(let d=8;d<=len;d+=8){const nx=P.x+dv[0]*8,ny=P.y+dv[1]*8;if(typeof hit==='function'&&hit(nx,ny))break;P.x=nx;P.y=ny;moved+=8}P.dir=Math.abs(dv[0])>Math.abs(dv[1])?(dv[0]>0?'r':'l'):(dv[1]>0?'d':'u');return moved}
// ---------- เอฟเฟกต์ภาพ + โซนต่อเนื่อง ----------
const E46=[];const ef=o=>{o.t=0;E46.push(o);return o};window.E46=E46;
function zone46(o){return ef(Object.assign({k:'zone',tick:0,every:.5,mult:.3,col:'255,255,255'},o))}
// ---------- ข้อมูลสกิล + พาสซีฟ ----------
for(const k of CLS46){const C=PLAN46[k];if(!CSKILLS[k])continue;CSKILLS[k].length=3;
 for(const s of C.newSkills)CSKILLS[k].push({n:s.n,e:s.e,lv:s.lv,price:s.lv>=100?30000:s.lv>=75?12000:5000,mp:s.mp,cd:s.cd,new:1,d:s.d+(s.aoe&&s.aoe!=='—'?' · 💥 AOE '+s.aoe:'')});
 if(PASSIVE[k])PASSIVE[k]=PASSIVE[k].filter(p=>!p.sk41).concat(C.passives.map(p=>({lv:p.lv,n:'⚡ '+p.n,d:p.d,sk41:1}))).sort((a,b)=>a.lv-b.lv);
 const b=SKBAR[k]||[];SKBAR[k]=[0,1,2,3,4,5].map((v,s)=>b.length===6&&b[s]!=null?b[s]:v)}
try{saveBar()}catch(e){}
for(let i=0;i<6;i++)CS.cd[i]=CS.cd[i]||0;
// สมุนใหม่
MSPEC.shade46={n:'ร่างแยกเงา',f:'skeleton',col:['#3a3a6a','#0a0a1a','#9a9aff'],sp:170,rng:28,cd:.7,mult:.4,dur:10,cap:2,fly:0};
MSPEC.dk46={n:'อัศวินมรณะ',f:'skeleton',col:['#2a3a30','#0a140c','#5aff9a'],sp:115,rng:46,cd:1.15,mult:2.0,dur:20,cap:1,fly:0,sc:1.7};
MSPEC.turtle46={n:'เต่าผู้พิทักษ์',f:'beetle',col:['#5a8a3a','#24401a','#c8f08a'],sp:70,rng:40,cd:1.6,mult:.8,dur:20,cap:1,fly:0,sc:1.7};
MSPEC.naga46={n:'พญานาคราช',f:'drake',col:['#2aa0a0','#0a4a48','#e8ffff'],sp:95,rng:150,cd:1.5,mult:1.5,dur:15,cap:1,fly:0,sc:1.5};
const HP46={shade46:.25,dk46:1.1,turtle46:1.6,naga46:1.0};
const mins=k=>MIN.filter(o=>o.k===k);
// ---------- สกิลรายอาชีพ (ดัชนี 3,4,5) ----------
NEWSK.sword=[
 ()=>{const dv=dirv(260);const sx46=P.x,sy46=P.y,m=dash46(dv,220),ex46=P.x,ey46=P.y;P.x=sx46;P.y=sy46;if(m>0)lineHit(dv,m+20,30,2.0,{kb:120,col:'#cfe4ff'});P.x=ex46;P.y=ey46;P.iframe=Math.max(P.iframe||0,.35);ef({k:'streak',x:P.x-dv[0]*m,y:P.y-dv[1]*m,x2:P.x,y2:P.y,l:.35,c:'180,220,255'});P.at=0;P.cmb=1;sfx('dash');sfx('swing2')},
 ()=>{hitAt(P.x,P.y,140,1.2,{kb:200,col:'#ffd8a0'});ring25(P.x,P.y,'255,210,140',140,.5);shake(4,.2);setBuf('guard',6,{dr:.4,refl:1});sfx('thud')},
 ()=>{P.cast=.65;ef({k:'charge',l:.6,c:'200,230,255'});sfx('warp');later(600,()=>{const dv=dirv(280);cone25(dv,260,.6,e=>hurtE(e,4.5,{kb:240,stun:1.5,col:'#e8f4ff'}));ef({k:'fan',x:P.x,y:P.y-12,dx:dv[0],dy:dv[1],r:260,l:.45,c:'200,230,255'});shake(7,.3);try{flash('#cfe4ff',.2)}catch(e){}sfx('swing2');sfx('thud')})}];
NEWSK.mage=[
 ()=>{const ox=P.x,oy=P.y,dv=dirv(220);dash46(dv,180);hitAt(ox,oy,120,1.5,{kb:80,col:'#bff0ff'});eachIn(ox,oy-6,120,e=>{e.slowT=3});ring25(ox,oy,'160,220,255',120,.5);pt25(ox,oy-10,18,'190,235,255',100,2.4,'spark');B46.st.ice=performance.now();sfx('warp')},
 ()=>{const dv=dirv(220),x=P.x+dv[0]*100,y=P.y+dv[1]*90;hitAt(x,y,160,1.5,{kb:0,stun:2.5,col:'#bff0ff'});eachIn(x,y-6,160,e=>{e.frz46=performance.now()+2500;e.slowT=3});ef({k:'ice',x,y,r:160,l:.9});B46.st.ice=performance.now();sfx('crumble')},
 ()=>{setBuf('beam',2.5,{tick:0});P.cast=2.5;sfx('warp')}];
NEWSK.archer=[
 ()=>{const dv=DIRV[P.dir];for(const o of [-1,0,1]){const a=Math.atan2(dv[1],dv[0])+o*.7,x=P.x+Math.cos(a)*34,y=P.y+Math.sin(a)*26;ef({k:'trap',x,y,l:15,armed:.4})}sfx('ui')},
 ()=>{const dv=dirv(360);shoot('arrow',{dv,sp:620,range:360,mult:1.4,pierce:99});const x=P.x+dv[0]*300,y=P.y+dv[1]*240;later(450,()=>{zone46({x,y,r:120,l:5,every:.5,mult:.15,col:'140,255,90',burn:1,vuln:1})});sfx('swing2')},
 ()=>{const dv=dirv(320);ef({k:'vortex',x:P.x,y:P.y-12,dx:dv[0],dy:dv[1],l:1.1,sp:300});sfx('warp')}];
NEWSK.ninja=[
 ()=>{const M=B46.st.mark;if(M&&M.e&&!M.e.dead&&performance.now()<M.until){blink25(M.e);hitAt(M.e.x,M.e.y,120,2.5,{kb:120,col:'#c8c8ff'});ef({k:'slash',x:M.e.x,y:M.e.y-14,l:.35});B46.st.mark=null;return}
  const e=near25(300);if(!e){say('🎴 ไม่มีศัตรูในระยะ');return false}hurtE(e,1.2,{kb:40,col:'#c8c8ff'});B46.st.mark={e,until:performance.now()+4000};B46.st.markReset=1;ef({k:'streak',x:P.x,y:P.y-14,x2:e.x,y2:e.y-14,l:.25,c:'200,200,255'});sfx('swing')},
 ()=>{summon('shade46',2);P.cast=.3},
 ()=>{const R=200;let n=0;eachIn(P.x,P.y-6,R,e=>{if(e.dead)return;const low=e.hp<(e.mhp||e.hp)*.3;if(hurtE(e,low?6:3,{kb:160,col:low?'#ff4a5a':'#ffb0b8'})>0)n++});ef({k:'moon',x:P.x,y:P.y,r:R,l:.5});shake(5,.25);sfx('swing2')}];
NEWSK.sniper=[
 ()=>{const e=near25(300),dv=dirv(300),point=SKILLAIM46.point(3),x=point?point[0]:e?e.x:P.x+dv[0]*200,y=point?point[1]:e?e.y:P.y+dv[1]*160;ef({k:'nade',x0:P.x,y0:P.y-14,x,y,l:.4});later(400,()=>{hitAt(x,y,130,1.6,{kb:240,stun:1.2,col:'#fff6c0'});ring25(x,y,'255,250,210',130,.4);try{flash('#ffffff',.12)}catch(e){}sfx('thud')});sfx('swing')},
 ()=>{setBuf('snipe',6,{x:P.x,y:P.y});ring25(P.x,P.y,'255,210,80',50,.4);sfx('ui')},
 ()=>{const dv=dirv(800).slice();P.cast=1.05;ef({k:'charge',l:1,c:'140,220,255'});sfx('warp');later(1000,()=>{const m=buf('snipe')?1.3:1;lineHit(dv,800,30,6.0*m,{kb:200,col:'#bff0ff'});ef({k:'rail',x:P.x,y:P.y-12,dx:dv[0],dy:dv[1],len:800,l:.45});shake(6,.25);sfx('thud')})}];
NEWSK.paladin=[
 ()=>{const dv=dirv(240);const sx46=P.x,sy46=P.y,m=dash46(dv,200),ex46=P.x,ey46=P.y;P.x=sx46;P.y=sy46;if(m>0)lineHit(dv,m+20,34,1.6,{kb:260,stun:1,col:'#ffe9a0'});P.x=ex46;P.y=ey46;P.iframe=Math.max(P.iframe||0,.3);ef({k:'streak',x:P.x-dv[0]*m,y:P.y-dv[1]*m,x2:P.x,y2:P.y,l:.35,c:'255,235,160'});sfx('dash')},
 ()=>{setBuf('aura',10,{tick:0});ring25(P.x,P.y,'255,240,170',160,.6);sfx('warp')},
 ()=>{const dv=dirv(260),go=(i)=>{if(i<2){lineHit(dv,220,30,2.0,{kb:120,col:'#fff6c0'});ef({k:'rail',x:P.x,y:P.y-8,dx:dv[0],dy:dv[1],len:220,l:.3,c:'255,240,170'});sfx('swing2')}else{const x=P.x+dv[0]*150,y=P.y+dv[1]*120;hitAt(x,y,180,3.5,{kb:240,stun:.8,col:'#fff6c0'});ef({k:'pillar46',x,y,r:180,l:.6});try{heal25(.15)}catch(e){}shake(6,.3);sfx('thud')}};go(0);later(350,()=>go(1));later(700,()=>go(2))}];
NEWSK.cleric=[
 ()=>{hitAt(P.x,P.y,150,1.2,{kb:200,col:'#e8ffff'});P.stun=0;P.slowT=0;P.burnT=0;try{heal25(.15)}catch(e){}ring25(P.x,P.y,'220,255,255',150,.5);B46.st.healed=performance.now();sfx('warp')},
 ()=>{const dv=dirv(220),x=P.x+dv[0]*140,y=P.y+dv[1]*110;zone46({x,y,r:150,l:6,every:1,mult:1.0,col:'255,235,160',heal:.03,bell:1});B46.st.healed=performance.now();sfx('ui')},
 ()=>{setBuf('wings',6,{tick:0});sfx('warp')}];
NEWSK.necro=[
 ()=>{const S=mins('skel');if(S.length){for(const o of S){hitAt(o.x,o.y,110,2.0,{kb:180,col:'#9affc0'});ring25(o.x,o.y,'120,255,170',110,.4);MIN.splice(MIN.indexOf(o),1)}}else{hitAt(P.x,P.y,110,1.2,{kb:160,col:'#9affc0'});ring25(P.x,P.y,'120,255,170',110,.4)}shake(4,.2);sfx('crumble')},
 ()=>{setBuf('bats',3,{tick:0});sfx('warp')},
 ()=>{summon('dk46',1);P.cast=.5;shake(3,.2);sfx('thud')}];
NEWSK.dragoon=[
 ()=>{const dv=dirv(400);lineHit(dv,400,26,1.8,{kb:120,col:'#ffb0a0'});ef({k:'spear',x:P.x,y:P.y-12,dx:dv[0],dy:dv[1],len:400,l:1.0});later(550,()=>lineHit(dv,400,26,1.0,{kb:60,col:'#ffb0a0'}));sfx('swing2')},
 ()=>{setBuf('scale',8,{tick:0});ring25(P.x,P.y,'255,120,60',90,.5);sfx('warp')},
 ()=>{const dv=dirv(220),x=P.x+dv[0]*160,y=P.y+dv[1]*130;P.iframe=Math.max(P.iframe||0,1.3);B46.st.jump=performance.now()+1500;ef25({k:'dragondive',x,y,l:1.2,r:220,mult:5.0});later(660,()=>{if(!hit(x,y)){P.x=x;P.y=y}zone46({x,y,r:160,l:3,every:.5,mult:.3,col:'255,120,40',burn:3})});sfx('dash')}];
NEWSK.summoner=[
 ()=>{const dv=dirv(260),x=P.x+dv[0]*150,y=P.y+dv[1]*120;hitAt(x,y,140,1.0,{kb:100,col:'#d8ffb0'});eachIn(x,y-6,140,e=>{e.slowT=2});let tg=null,bd=1e9;for(const e of enemies()){const d=Math.hypot(e.x-x,e.y-y);if(d<bd&&d<220){bd=d;tg=e}}if(tg)for(const o of MIN)o.tg=tg;setBuf('horn',5);ring25(x,y,'200,255,140',140,.5);sfx('warp')},
 ()=>{summon('turtle46',1);P.cast=.4;sfx('thud')},
 ()=>{summon('naga46',1);P.cast=.5;sfx('warp')}];
// เลือดสมุนใหม่ (ระบบเลือดสมุนของ fix44 ตั้งค่าตอนเห็นครั้งแรก → ตั้งให้ก่อน)
{const _sm=summon;summon=function(k,n){let o0=MIN.length;
  // จ้าวพงไพร: จำนวนสูงสุด +1 และอยู่นานขึ้น 30%
  const S=MSPEC[k],boost=on46('summoner',110)&&S&&!S.boost46;if(boost){S.cap+=1;S.dur*=1.3;S.boost46=1}
  try{return _sm.apply(this,arguments)}finally{if(boost){S.cap-=1;S.dur/=1.3;S.boost46=0}for(let i=o0;i<MIN.length;i++){const o=MIN[i];if(HP46[o.k]&&o.mhp==null)o.mhp=o.hp=Math.max(50,Math.round(BAL.hp*HP46[o.k]))}}};window.summon=summon}
// ---------- ทุกเฟรม ----------
{const _st=skTick;skTick=function(dt){_st(dt);try{const now=performance.now();
 for(const k in B46.buf){const b=B46.buf[k];if(b.t>0)b.t-=dt}
 if(B46.skT>0)B46.skT-=dt;
 // ลดดาเมจ/สะท้อน จากบัฟ (เทียบเลือดเฟรมก่อน)
 let dr=0;if(buf('guard'))dr+=.4;if(buf('aura'))dr+=.15;if(buf('scale'))dr+=.4;
 if(P.cls==='summoner'&&P.lv>=40)dr+=Math.min(.3,.03*MIN.length);if(mins('turtle46').length)dr+=.3;
 if(buf('shield46'))dr=1;
 if(B46.lastHp!=null&&P.hp<B46.lastHp&&!P.dead){const loss=B46.lastHp-P.hp;
  if(buf('shield46')){const s=buf('shield46'),a=Math.min(s.v,loss);s.v-=a;P.hp+=a;if(s.v<=0)s.t=0}
  else if(dr>0)P.hp=Math.min(BAL.hp,P.hp+loss*Math.min(.75,dr));
  const tt=mins('turtle46')[0];if(tt&&tt.hp)tt.hp-=loss*.3;
  const refl=(buf('guard')||((buf('aura')||B25.shieldT>0)&&on46('paladin',40)));if(refl&&(B46.st.reflT||0)<now){B46.st.reflT=now+500;hitAt(P.x,P.y,70,.5,{kb:120,col:'#ffe9a0'})}}
 if(buf('scale'))P.stun=0;
 // ออร่าศักดิ์สิทธิ์
 const A=buf('aura');if(A){A.tick-=dt;if(A.tick<=0){A.tick=.5;hitAt(P.x,P.y,160,.15,{kb:0,col:'#ffe9a0'})}}
 // ผิวเกล็ดมังกร: ไอเพลิงรอบตัว
 const SC=buf('scale');if(SC){SC.tick-=dt;if(SC.tick<=0){SC.tick=.5;hitAt(P.x,P.y,120,.15,{kb:0,burn:2,col:'#ff9a5a'})}}
 // ลำแสงอาร์เคน
 const BM=buf('beam');if(BM){BM.tick-=dt;if(BM.tick<=0){BM.tick=.2;const dv=dirv(420);lineHit(dv,420,32,.8,{kb:20,col:'#e8b0ff'});BM.dv=dv}}
 // ปีกเทวทูต
 const W=buf('wings');if(W){W.tick-=dt;if(W.tick<=0){W.tick=.5;const e=near25(300);if(e){hitAt(e.x,e.y,70,1.2,{kb:60,col:'#fffbe0'});ef({k:'streak',x:P.x,y:P.y-30,x2:e.x,y2:e.y-14,l:.25,c:'255,250,220'});P.hp=Math.min(BAL.hp,P.hp+BAL.hp*.01)}}}
 // ค้างคาวโลหิต
 const BT=buf('bats');if(BT){BT.tick-=dt;if(BT.tick<=0){BT.tick=.3;eachIn(P.x,P.y-6,170,e=>{if(e.dead)return;const d=hurtE(e,.45,{kb:20,col:'#ff6a7a'});if(d>0)P.hp=Math.min(BAL.hp,P.hp+d*.5)})}}
 // โหมดซุ่มยิง: ขยับ = ยกเลิก
 const SN=buf('snipe');if(SN&&Math.hypot(P.x-SN.x,P.y-SN.y)>10){SN.t=0;say('🔭 ขยับตัว — โหมดซุ่มยิงถูกยกเลิก')}
 /* v5.54 โหมดซุ่มยิง: ซูมจอออก 70% (มองไกลขึ้นตามระยะยิง +50%) แบบนุ่ม · หมดเวลา/ขยับ/ตาย/ย้ายฉาก = ซูมกลับเท่าที่ผู้เล่นตั้งไว้ */
 try{const zb=ZS[zi],zt=(SN&&SN.t>0||window.SKILLAIM46&&SKILLAIM46.active&&SKILLAIM46.active.lock)&&!P.dead?zb*SNZ54:zb;if(Z!==zt){Z+=(zt-Z)*Math.min(1,dt*6);if(Math.abs(Z-zt)<.003)Z=zt}}catch(e){}
 // สมุนพิเศษ: เต่ากระแทกกระดอง · พญานาคพ่นน้ำ · อัศวินมรณะฟาดกว้าง
 const B44w=window.B44||{};B44w.inMin=true;try{for(const o of MIN){if(o.k==='turtle46'){o.sl46=(o.sl46||3)-dt;if(o.sl46<=0){o.sl46=3;hitAt(o.x,o.y,130,.8,{kb:160,fx:o.x,fy:o.y,col:'#c8f08a'});ring25(o.x,o.y,'200,240,140',130,.4)}}
  else if(o.k==='naga46'){o.sp46=(o.sp46||1.5)-dt;if(o.sp46<=0){o.sp46=1.5;const e=o.tg&&!o.tg.dead?o.tg:null;if(e){const dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy)||1;if(d<240){for(const q of enemies()){const ax=q.x-o.x,ay=q.y-o.y,dd=Math.hypot(ax,ay);if(dd<220&&(ax*dx+ay*dy)/(dd*d||1)>.75){hurtE(q,1.0,{kb:80,fx:o.x,fy:o.y,col:'#bff0ff'});q.slowT=2}}ef({k:'water',x:o.x,y:o.y-20,dx:dx/d,dy:dy/d,l:.5})}}}}
  else if(o.k==='dk46'){o.cl46=(o.cl46||1.15)-dt;if(o.cl46<=0&&o.tg&&!o.tg.dead&&Math.hypot(o.tg.x-o.x,o.tg.y-o.y)<70){o.cl46=1.15;eachIn(o.x+(o.tg.x>o.x?30:-30),o.y-6,70,q=>{if(q!==o.tg)hurtE(q,1.0,{kb:120,fx:o.x,fy:o.y,col:'#9affc0'})})}}}}finally{B44w.inMin=false}
 // กองทัพไม่ตาย (เนโคร Lv.40): โครงกระดูกที่ตายฟื้น 1 ครั้ง
 if(P.cls==='necro'){const cur=new Set(MIN);for(const o of (B46.st.skels||[]))if(!cur.has(o)&&o.hp<=0&&!o.rev46&&on46('necro',40)&&o.t<o.l){const c=Object.assign({},o,{hp:Math.round(o.mhp*.5),rev46:1,born:.6});MIN.push(c);ring25(c.x,c.y,'120,255,170',40,.4)}B46.st.skels=MIN.filter(o=>o.k==='skel')}
 // สถานะ/เอฟเฟกต์
 for(let i=E46.length-1;i>=0;i--){const e=E46[i];e.t+=dt;
  if(e.k==='zone'){e.tick-=dt;if(e.tick<=0){e.tick=e.every;eachIn(e.x,e.y-6,e.r,m=>{if(m.dead)return;hurtE(m,e.mult,{kb:0,burn:e.burn||0,col:'rgb('+e.col+')'});if(e.vuln)m.vuln46=now+1200});if(e.heal&&Math.hypot(P.x-e.x,P.y-e.y)<e.r)P.hp=Math.min(BAL.hp,P.hp+BAL.hp*e.heal)}}
  else if(e.k==='trap'){if(e.t>e.armed&&!e.boom){for(const m of enemies()){if(!m.dead&&Math.hypot(m.x-e.x,m.y-e.y)<30){e.boom=1;e.l=e.t+.4;hitAt(e.x,e.y,90,1.8,{kb:60,stun:1.5,col:'#ffd27a'});eachIn(e.x,e.y-6,90,q=>{q.slowT=1.5});ring25(e.x,e.y,'255,210,120',90,.4);sfx('crumble');break}}}}
  else if(e.k==='vortex'){const u=Math.min(1,e.t/e.l),cx=e.x+e.dx*e.sp*e.t,cy=e.y+e.dy*e.sp*e.t;e.cx=cx;e.cy=cy;
   if(e.t<e.l)for(const m of enemies()){if(m.dead||m.boss)continue;const dx=cx-m.x,dy=cy-m.y,d=Math.hypot(dx,dy);if(d<180&&d>12){m.x+=dx/d*Math.min(d,220*dt);m.y+=dy/d*Math.min(d,220*dt)}}
   else if(!e.boom){e.boom=1;e.l=e.t+.4;hitAt(cx,cy+12,160,4.0,{kb:220,col:'#c8fff0'});ring25(cx,cy+12,'190,255,240',160,.5);shake(5,.25);sfx('thud')}}
  if(e.t>=e.l)E46.splice(i,1)}
 B46.lastHp=P.hp}catch(e){}}}
// ---------- ดาเมจ: บัฟ/พาสซีฟ ----------
{const _he=hurtE;hurtE=function(e,mult,o){let m=mult;o=o||{};try{const now=performance.now(),inMin=window.B44&&window.B44.inMin,c=P.cls;
  if(e.frz46>now)m*=1.25;if(e.vuln46>now)m*=1.2;
  if(inMin){if(buf('horn'))m*=1.5}
  else{
   if(c==='sword'){const r=B46.st.rage;if(r&&r.until>now)m*=1+.04*r.n;if(on46('sword',110)&&P.hp<BAL.hp*.3)o=Object.assign({},o,{leech46:.08})}
   if(c==='archer'&&on46('archer',70)&&(e.slowT>0||e.stunT>0))m*=1.15;
   if(c==='ninja'&&B46.st.ambush){m*=2;B46.st.ambush=0}
   if(c==='sniper'){if(buf('snipe'))m*=1.4;if(on46('sniper',40)&&Math.hypot(e.x-P.x,e.y-P.y)>250)m*=1.2;if(on46('sniper',110)&&e.hp<(e.mhp||e.hp)*.2)m*=1.5}
   if(c==='cleric'&&B46.st.retri>0&&B46.skT>0)m*=1.2;
   if(c==='necro'&&on46('necro',70))m*=1+.04*mins('skel').length;
   if(c==='dragoon'){if(on46('dragoon',40)&&B46.st.jump>now)m*=1.25;if(on46('dragoon',70)&&e.burnT>0)m*=1.15;if(on46('dragoon',110)&&P.hp>BAL.hp*.8&&B46.skT>0)m*=1.2;if(buf('scale'))o=Object.assign({},o,{burn:Math.max(o.burn||0,2)})}
  }}catch(_){}
 const hp0=e.hp,d=_he.call(this,e,m,o);
 try{if(d>0&&!(window.B44&&window.B44.inMin)){const c=P.cls,now=performance.now();
   if(o.leech46)P.hp=Math.min(BAL.hp,P.hp+d*o.leech46);
   if(B46.skT>0){
    if(c==='sword'&&on46('sword',40)){const r=B46.st.rage&&B46.st.rage.until>now?B46.st.rage:(B46.st.rage={n:0,until:0});r.n=Math.min(5,r.n+1);r.until=now+6000}
    if(c==='paladin'&&on46('paladin',70)&&o.stun>0&&(B46.st.pheal||0)<.15){B46.st.pheal=(B46.st.pheal||0)+.03;P.hp=Math.min(BAL.hp,P.hp+BAL.hp*.03)}
    if((c==='mage'&&on46('mage',110)||c==='sniper'&&on46('sniper',70))&&(B46.st.critT||0)<now&&Math.random()<critCh()){B46.st.critT=now+400;if(c==='mage'){try{ULT.v=Math.min(100,(ULT.v||0)+3)}catch(_){}}else for(let i=0;i<CS.cd.length;i++)CS.cd[i]=Math.max(0,CS.cd[i]-.5)}
    if(c==='ninja'&&on46('ninja',70)&&(e.hp<=0||e.dead)&&B46.cast!=null&&!B46.st.flowDone){B46.st.flowDone=1;later(30,()=>{CS.cd[B46.cast]*=.5})}}
   if(c==='necro'&&on46('necro',110)&&(e.hp<=0||e.dead)&&hp0>0&&typeof E25!=='undefined'&&E25.some(z=>z.k==='curse'&&Math.hypot(e.x-z.x,e.y-z.y)<z.r))later(50,()=>summon('skel',1))}
  if(d>0&&window.B44&&window.B44.inMin&&on46('summoner',70)&&(e.hp<=0||e.dead))P.mp=Math.min(BAL.mp,P.mp+BAL.mp*.02)}catch(_){}
 return d}}
// ---------- หลังร่ายสกิล: พาสซีฟที่ผูกกับการร่าย ----------
const ICE46=['วาร์ปเวท','คุกน้ำแข็ง'],FIRE46=['วงแหวนเพลิง','พายุอุกกาบาต'],HEAL46=['แสงรักษา','ชำระล้าง','ระฆังสวรรค์'];
{const _us=useSkill;useSkill=function(i){const cd0=CS.cd.slice(),mp0=P.mp,step0=CS.step;B46.st.markReset=0;const r=_us(i);try{
 const cast=P.mp<mp0-.01||CS.cd.some((v,k)=>v>(cd0[k]||0)+.05);if(!cast)return r;
 const c=P.cls,S=(CSKILLS[c]||[])[i]||{},now=performance.now(),spent=mp0-P.mp;B46.skT=1.4;B46.cast=i;B46.st.flowDone=0;B46.st.pheal=0;
 if(c==='ninja'&&i===3&&B46.st.markReset){CS.cd[3]=0}
 // นักดาบ Lv.70 ต่อดาบ: จบดาบสามจังหวะ → สกิลอื่น -2 วิ
 if(c==='sword'&&i===1&&step0===2&&on46('sword',70))for(let k=0;k<CS.cd.length;k++)if(k!==1)CS.cd[k]=Math.max(0,CS.cd[k]-2);
 // นักเวท: ธาตุประสาน / สมาธิเวท
 if(c==='mage'){if(i===1&&step0===0)B46.st.ice=now;
  if(on46('mage',40)&&(FIRE46.includes(S.n)||(i===1&&step0===2))&&now-(B46.st.ice||0)<3000){B46.st.ice=0;const e=near25(320);if(e){later(250,()=>{hitAt(e.x,e.y,90,1.5,{kb:120,col:'#ffb0ff'});ring25(e.x,e.y,'255,170,255',90,.4)})}}
  if(on46('mage',70)){const s=B46.st.focus&&now-B46.st.focus.t<5000?B46.st.focus:{n:0};if(s.n>0&&spent>0)P.mp=Math.min(BAL.mp,P.mp+spent*.06*s.n);B46.st.focus={n:Math.min(5,s.n+1),t:now}}}
 // นักธนู: ลมใต้ปีก · ลูกธนูไม่สิ้นสุด
 if(c==='archer'){if(on46('archer',40))setBuf('wind',2);if(on46('archer',110)&&i===0){const dv=dirv(330);shoot('arrow',{dv,sp:560,range:360,mult:.9})}}
 // นินจา: ลอบสังหารหลังล่องหน (เงาพริบตา จังหวะ 3)
 if(c==='ninja'&&on46('ninja',40)&&i===1&&step0===2)B46.st.ambush=1;
 // นินจา Lv.110 เงาซ้อนเงา: ร่างแยกตีตามสกิล
 if(c==='ninja'&&on46('ninja',110))for(const o of mins('shade46'))later(150,()=>hitAt(o.x,o.y,80,.3,{kb:40,fx:o.x,fy:o.y,col:'#b0b0ff'}));
 /* v5.33: พรสะสมผูกกับท่าโจมตีช่อง 2 แยกจากฮีล; คงเงื่อนไขเลือด/ขนาดโล่/ระยะเวลาเดิม */
 if(c==='cleric'&&i===1&&on46('cleric',40)&&P.hp>=BAL.hp*.98){const s=buf('shield46');setBuf('shield46',10,{v:Math.min(BAL.hp*.2,(s?s.v:0)+BAL.hp*.1)})}
 if(c==='cleric'&&HEAL46.includes(S.n)){
  if(on46('cleric',70))B46.st.retri=1;if(on46('cleric',110)&&Math.random()<.2){later(20,()=>{CS.cd[i]=0;say('🌈 ปาฏิหาริย์! ไม่ติดคูลดาวน์')})}}
 else if(c==='cleric')later(1500,()=>{B46.st.retri=0});
 // อัศวินมังกร: กระโดด/ร่วง = แรงส่งจากฟ้า
 if(c==='dragoon'&&((i===1&&step0===0)||i===2||i===5))B46.st.jump=now+1500;
 }catch(_){}return r}}
// ความเร็ว: ลมใต้ปีก / ปีกเทวทูต / ลำแสง (ช้าลง) / ซุ่มยิง (ยืนนิ่ง)
{const _sm=spdMul;spdMul=function(){let m=_sm();try{if(buf('wind'))m*=1.2;if(buf('wings'))m*=1.3;if(buf('beam'))m*=.5}catch(e){}return m}}
// ซุ่มยิง: ระยะยิง +50%
{const _sh=shoot;shoot=function(kind,o){try{if(buf('snipe')&&o&&o.range)o=Object.assign({},o,{range:o.range*1.5})}catch(e){}return _sh.call(this,kind,o)};window.shoot=shoot}
// พาลาดิน Lv.110 ผู้ไม่ยอมตาย: ฟื้นทันที 30% (ทุก 5 นาที · ไม่ทำงานใน PvP/ดวล/สนาม)
{const _sd=startDeath;startDeath=function(){try{const sc=sc46();if(on46('paladin',110)&&!P.dead&&!/^(arena|duel)/.test(sc)&&(B46.st.undying||0)<Date.now()&&!(typeof PV29!=='undefined'&&PV29.duel)){B46.st.undying=Date.now()+300000;P.hp=Math.round(BAL.hp*.3);P.iframe=2;ring25(P.x,P.y,'255,240,170',120,.6);try{flash('#ffe9a0',.35)}catch(e){}say('👼 ผู้ไม่ยอมตาย! ฟื้นคืนชีพ (ใช้ได้อีกใน 5 นาที)');sfx('warp');return}}catch(e){}return _sd.apply(this,arguments)}}
// ---------- วาด ----------
function draw46(){SKILLAIM46.draw();const t=performance.now()/1000;ctx.save();
 for(const e of E46){const u=Math.min(1,e.t/e.l),a=Math.max(0,1-u);ctx.save();ctx.globalCompositeOperation='lighter';
  if(e.k==='streak'){ctx.strokeStyle='rgba('+e.c+','+a+')';ctx.lineWidth=10*a+2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(e.x,e.y-12);ctx.lineTo(e.x2,e.y2-12);ctx.stroke()}
  else if(e.k==='fan'){const ang=Math.atan2(e.dy,e.dx);ctx.fillStyle='rgba('+e.c+','+(.35*a)+')';ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.arc(e.x,e.y,e.r*(.4+.6*u),ang-.6,ang+.6);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(e.x,e.y,e.r*(.4+.6*u),ang-.6,ang+.6);ctx.stroke()}
  else if(e.k==='charge'){const R=12+u*24,g=ctx.createRadialGradient(P.x,P.y-18,0,P.x,P.y-18,R);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba('+e.c+',0)');ctx.fillStyle=g;ctx.fillRect(P.x-R,P.y-18-R,R*2,R*2)}
  else if(e.k==='ice'){ctx.fillStyle='rgba(170,230,255,'+(.3*a)+')';ctx.beginPath();el25(e.x,e.y,e.r,e.r*.6,0,0,7);ctx.fill();for(let i=0;i<9;i++){const an=i*.7,rr=e.r*.25+((i*37)%60);const x=e.x+Math.cos(an)*rr,y=e.y+Math.sin(an)*rr*.6;ctx.fillStyle='rgba(230,250,255,'+a+')';ctx.beginPath();ctx.moveTo(x,y-26*a);ctx.lineTo(x+6,y);ctx.lineTo(x-6,y);ctx.closePath();ctx.fill()}}
  else if(e.k==='trap'){ctx.globalCompositeOperation='source-over';ctx.strokeStyle=e.boom?'rgba(255,210,120,'+a+')':'#8a8a92';ctx.lineWidth=2;ctx.beginPath();el25(e.x,e.y,11,4,0,0,7);ctx.stroke();ctx.fillStyle='#c8ccd4';for(let i=0;i<6;i++){const an=i*1.05;ctx.beginPath();ctx.moveTo(e.x+Math.cos(an)*10-1.5,e.y+Math.sin(an)*4);ctx.lineTo(e.x+Math.cos(an)*9,e.y+Math.sin(an)*4-7);ctx.lineTo(e.x+Math.cos(an)*10+1.5,e.y+Math.sin(an)*4);ctx.fill()}}
  else if(e.k==='zone'){const p=.5+.2*Math.sin(t*4);ctx.fillStyle='rgba('+e.col+','+(.16*p)+')';ctx.beginPath();el25(e.x,e.y,e.r,e.r*.6,0,0,7);ctx.fill();ctx.strokeStyle='rgba('+e.col+','+(.6*Math.min(1,(e.l-e.t)*2))+')';ctx.lineWidth=2;ctx.stroke();
   if(e.bell){ctx.globalCompositeOperation='source-over';ctx.fillStyle='#d8a83a';ctx.strokeStyle='#4a300a';ctx.beginPath();ctx.moveTo(e.x-12,e.y-30);ctx.quadraticCurveTo(e.x-12,e.y-56,e.x,e.y-58);ctx.quadraticCurveTo(e.x+12,e.y-56,e.x+12,e.y-30);ctx.closePath();ctx.fill();ctx.stroke()}}
  else if(e.k==='vortex'&&e.cx!=null){for(let j=0;j<4;j++){ctx.strokeStyle='rgba(190,255,240,'+(.6-j*.12)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.cx,e.cy,10+j*14,t*6+j,t*6+j+4);ctx.stroke()}}
  else if(e.k==='slash'){ctx.strokeStyle='rgba(200,200,255,'+a+')';ctx.lineWidth=4;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(e.x-20,e.y-20*s);ctx.lineTo(e.x+20,e.y+20*s);ctx.stroke()}}
  else if(e.k==='moon'){ctx.strokeStyle='rgba(255,60,80,'+a+')';ctx.lineWidth=8*a+2;ctx.beginPath();el25(e.x,e.y-8,e.r*(.5+.5*u),e.r*.6*(.5+.5*u),0,0,7);ctx.stroke()}
  else if(e.k==='nade'){const x=e.x0+(e.x-e.x0)*u,y=e.y0+(e.y-e.y0)*u-Math.sin(u*Math.PI)*60;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#3a4a2a';ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.fill()}
  else if(e.k==='rail'){ctx.strokeStyle='rgba('+(e.c||'140,220,255')+','+a+')';ctx.lineWidth=14*a+2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+e.dx*e.len,e.y+e.dy*e.len);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.lineWidth=3;ctx.stroke()}
  else if(e.k==='pillar46'){const w=30*a;ctx.fillStyle='rgba(255,245,200,'+(.6*a)+')';ctx.fillRect(e.x-w,e.y-300,w*2,300);ctx.strokeStyle='rgba(255,240,170,'+a+')';ctx.lineWidth=5;ctx.beginPath();el25(e.x,e.y,e.r*u,e.r*.6*u,0,0,7);ctx.stroke()}
  else if(e.k==='spear'){const back=u>.5,p=back?(1-u)*2:u*2,x=e.x+e.dx*e.len*p,y=e.y+e.dy*e.len*p;ctx.globalCompositeOperation='source-over';ctx.strokeStyle='#6a3a1a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-e.dx*26,y-e.dy*26);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#e8eef8';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill()}
  else if(e.k==='water'){const ang=Math.atan2(e.dy,e.dx);ctx.fillStyle='rgba(150,230,255,'+(.4*a)+')';ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.arc(e.x,e.y,220*(.3+.7*u),ang-.7,ang+.7);ctx.closePath();ctx.fill()}
  ctx.restore()}
 // ออร่า/บัฟรอบตัว
 ctx.globalCompositeOperation='lighter';
 const ring=(r,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w||2.5;ctx.beginPath();el25(P.x,P.y-4,r,r*.6,0,0,7);ctx.stroke()};
 if(buf('guard'))ring(30,'rgba(200,210,230,'+(.5+.2*Math.sin(t*6))+')',3);
 if(buf('aura'))ring(160,'rgba(255,240,170,'+(.35+.15*Math.sin(t*3))+')',2);
 if(buf('scale'))ring(40,'rgba(255,120,50,'+(.5+.2*Math.sin(t*8))+')',3);
 if(buf('snipe'))ring(22,'rgba(255,210,80,.7)',2);
 if(buf('shield46'))ring(26,'rgba(190,240,255,.7)',3);
 if(buf('wings')){for(const s of [-1,1]){ctx.fillStyle='rgba(255,250,235,.55)';ctx.beginPath();ctx.ellipse(P.x+s*16,P.y-30,16,7,s*.5,0,7);ctx.fill()}}
 if(buf('bats')){for(let i=0;i<6;i++){const an=t*5+i*1.05;ctx.fillStyle='rgba(120,10,30,.9)';ctx.beginPath();ctx.ellipse(P.x+Math.cos(an)*60,P.y-20+Math.sin(an)*30,7,3,0,0,7);ctx.fill()}}
 const BM=buf('beam');if(BM&&BM.dv){ctx.strokeStyle='rgba(220,140,255,.6)';ctx.lineWidth=16;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(P.x,P.y-14);ctx.lineTo(P.x+BM.dv[0]*420,P.y-14+BM.dv[1]*420);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=4;ctx.stroke()}
 ctx.restore()}
{const _h=hero;hero=function(){_h();try{draw46()}catch(e){}}}
// ---------- ตารางพาสซีฟเสริมสกิล (หน้าต่างสกิล แท็บ ⚔️ สกิล) ----------
{const _r=renderSkw;renderSkw=function(){_r();try{if(skwEl.hidden||SKW.tab!=='sk')return;const L=(PASSIVE[P.cls]||[]).filter(p=>p.sk41);if(!L.length)return;const list=skwEl.querySelector('.list');if(!list||list.querySelector('.pas46'))return;
  const rows=L.map(p=>{const ok=P.lv>=p.lv;return '<tr style="'+(ok?'':'opacity:.6')+'"><td style="padding:3px 6px;color:#ffd23a;white-space:nowrap">Lv.'+p.lv+'</td><td style="padding:3px 6px;white-space:nowrap"><b>'+p.n.replace('⚡ ','')+'</b></td><td style="padding:3px 6px">'+p.d+'</td><td style="padding:3px 6px;white-space:nowrap">'+(ok?'<span style="color:#8fe08a">✓ ทำงาน</span>':'🔒')+'</td></tr>'}).join('');
  list.insertAdjacentHTML('afterbegin','<div class="card pas46" style="grid-column:1/-1;border:1px dashed rgba(255,210,80,.55)"><b>⚡ พาสซีฟเสริมสกิล — ได้ฟรีเมื่อถึงเลเวล</b><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:4px">'+rows+'</table></div></div>')}catch(e){}}}
}catch(e){console.warn('fix46',e)}
