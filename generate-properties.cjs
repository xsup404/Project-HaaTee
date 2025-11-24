const fs = require('fs');

// BTS Lines with stations
const btsData = {
  'สายสุขุมวิท': {
    color: 'green',
    stations: ['พระโขนง', 'ทองหลอ', 'เอกมัย', 'พร้อมพงษ์', 'ศรีนครินทร์', 'บ้านจันทร์', 'สะพานควาย', 'เพชรบุรี', 'ห้วยขวาง', 'อโศก', 'จตุจักร', 'สามเสน', 'อ่อนนุช', 'ประดิพัฒน์', 'ราษฎร์บูรณะ']
  },
  'สายสีลม': {
    color: 'red',
    stations: ['สยาม', 'ชิดลม', 'สาธารณสุข', 'ฟ้าแผ่นดิน', 'เซนสิบหมวด', 'หัวลำโพง', 'ป้อมปราณ', 'ชั้นสิบ', 'สีลม']
  },
  'สายสีชมพู': {
    color: 'pink',
    stations: ['ขอนแก่น', 'คูคต', 'หลักสี่', 'บางซื่อ', 'จตุจักร', 'ป้อมปราณ', 'ลำสาลี', 'รัฐภูมิ', 'ศรีบูญยา']
  },
  'สายสีส้ม': {
    color: 'orange',
    stations: ['บ้านทับ', 'สามยอด', 'มีนบุรี', 'ศาสตร์', 'สุทัศน์', 'ตลาดบางกะปิ', 'ราชเทวะ', 'พหลโยธิน', 'สะพานแควน้อย']
  },
  'สายสีม่วง': {
    color: 'purple',
    stations: ['ตลิ่งชัน', 'วงศ์สวรรค์', 'ตัวเมืองทุ่งสองห้อง', 'บางจาก', 'บ้านท่อม', 'บ้านกล้วย', 'บ้านสวรรค์', 'อุตรดิตถ์', 'อินทรพาลวัลย์']
  }
};

const types = ['บ้านเดี่ยว', 'คอนโด', 'ทาวน์เฮาส์', 'วิลล่า', 'อพาร์ตเมนท์'];
const locations = ['กรุงเทพฯ', 'สุขุมวิท', 'สาทร', 'ลาดพร้าว', 'เอกมัย', 'อนุสาวรีย์', 'ปทุมวัน', 'สยาม', 'ชิดลม', 'นนทบุรี', 'เชียงใหม่', 'ภูเก็ต', 'ระยอง', 'สระแก้ว'];

const amenities = [
  ['สระว่ายน้ำ', 'จอดรถ', 'ใกล้ห้าง', 'ใกล้โรงเรียน'],
  ['โครงการปิด', 'ห้องยิม', 'สนามเทนนิส', 'ฟิตเนส'],
  ['สวนสาธารณะ', 'ห้องน้ำ 2', 'เครื่องปรับอากาศ', 'ทีวี'],
  ['ครัวบิลต์อิน', 'ระเบียง', 'ที่จอดรถ 2 คัน', 'เตาไฟฟ้า'],
  ['โอเวนไมโครเวฟ', 'ตู้เย็น', 'เครื่องซักผ้า', 'พื้นปูกระเบื้อง']
];

const descriptions = [
  'ทรัพย์สินที่ดี ตกแต่งสวยงาม เหมาะสำหรับการอยู่อาศัย',
  'ที่ตั้งดี ใกล้สถานีรถไฟฟ้า สิ่งอำนวยความสะดวกครบครัน',
  'บ้านหลังสวย สภาพดีมาก พร้อมอยู่เลย',
  'ทำเลเยี่ยม ปลอดภัย สงบสุข อยู่อาศัยได้นาน',
  'ตึกใหม่ สมัยใหม่ ทรัพย์สินคุณภาพดี',
  'สวยสะอาด โปร่งโล่ง แสงสว่าง เหมาะทั้งครอบครัว',
  'ราคายุติธรรม โอกาสดีที่จะได้เป็นเจ้าของ',
  'บ้านเดี่ยวตามใจ ดีไซน์ร่วมสมัย กับห้องนอนสด',
  'ตกแต่งอย่างดี ตัวบ้านมีเสน่ห์ เหมาะสำหรับครอบครัว',
  'ทำเลใจกลางเมือง ใกล้สถาบันการศึกษา และอำเภอ'
];

const properties = [];
const btsLines = Object.keys(btsData);

for (let i = 1; i <= 1000; i++) {
  const typeIdx = Math.floor(Math.random() * types.length);
  const locIdx = Math.floor(Math.random() * locations.length);
  const descIdx = Math.floor(Math.random() * descriptions.length);
  const sellerIdx = (i % 16) + 1;
  const price = Math.floor(Math.random() * 50000000) + 1000000;
  const beds = Math.floor(Math.random() * 5) + 1;
  const baths = Math.floor(Math.random() * 4) + 1;
  const size = Math.floor(Math.random() * 500) + 50;
  
  // Random BTS line and station
  const btsLine = btsLines[Math.floor(Math.random() * btsLines.length)];
  const lineData = btsData[btsLine];
  const station = lineData.stations[Math.floor(Math.random() * lineData.stations.length)];
  const distanceToBTS = Math.floor(Math.random() * 1000) + 100;
  const walkTime = Math.ceil(distanceToBTS / 84);
  
  properties.push({
    id: i,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    title: `${types[typeIdx]} ${beds} ห้องนอน ใกล้ BTS ${station}`,
    price: `฿${price.toLocaleString('th-TH')}`,
    location: locations[locIdx],
    beds: beds,
    baths: baths,
    size: `${size} ตร.ม.`,
    type: types[typeIdx],
    priceValue: price,
    verified: Math.random() > 0.3,
    rating: (Math.random() * 1 + 4).toFixed(1),
    views: Math.floor(Math.random() * 5000),
    description: descriptions[descIdx],
    amenities: amenities[Math.floor(Math.random() * amenities.length)],
    bts: {
      line: btsLine,
      color: lineData.color,
      station: station,
      distanceMeters: distanceToBTS,
      walkTimeMinutes: walkTime
    },
    seller: {
      id: sellerIdx,
      name: `Seller ${sellerIdx}`,
      email: `seller${sellerIdx}@haatee.com`,
      phone: `08${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      verified: Math.random() > 0.2,
      rating: (Math.random() * 1 + 4).toFixed(1)
    },
    sellerId: sellerIdx,
    expiryDate: `2025-12-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  });
}

fs.writeFileSync('src/data/properties.json', JSON.stringify(properties, null, 2));
console.log('✅ สร้าง 1000 โพสพร้อมข้อมูล BTS สำเร็จ!');
