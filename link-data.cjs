const fs = require('fs');

const users = JSON.parse(fs.readFileSync('src/data/users.json', 'utf8'));
const properties = JSON.parse(fs.readFileSync('src/data/properties.json', 'utf8'));

console.log(`Users: ${users.length}, Properties: ${properties.length}`);

// Update each property to link with actual seller from users.json
properties.forEach((prop, index) => {
  // Randomly assign to different sellers
  const randomSellerId = Math.floor(Math.random() * users.length);
  const seller = users[randomSellerId];
  
  prop.sellerId = seller.id;
  prop.seller = {
    id: seller.id,
    name: seller.name,
    email: seller.email,
    phone: seller.phone,
    verified: seller.verified,
    rating: seller.rating
  };
  
  // Update title to mention seller type
  const sellerType = seller.sellerType === 'agent' ? 'Agent' : 'Owner';
  prop.title = `${prop.type} ${prop.beds}ห้องนอน - ${seller.name} (${sellerType})`;
  
  if ((index + 1) % 2000 === 0) {
    console.log(`✓ Updated ${index + 1} properties...`);
  }
});

fs.writeFileSync('src/data/properties.json', JSON.stringify(properties, null, 2));
console.log(`✅ เสร็จ! ลิ้งค์ ${properties.length} properties เข้ากับ users แล้ว!`);
