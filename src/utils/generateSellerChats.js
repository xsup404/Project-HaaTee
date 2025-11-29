// Utility script to generate initial chat messages for all sellers
// This will be called when the app initializes to populate seller chats

import propertiesData from '../data/properties.json';
import usersData from '../data/users.json';

// Sample buyer names for generating messages
const buyerNames = [
  'สมชาย ใจดี', 'สมหญิง รักดี', 'ประเสริฐ สุขใจ', 'วิไล งามดี', 
  'วิทยา เก่งดี', 'มาลี สวยงาม', 'ประยุทธ์ กล้าหาญ', 'สุภาพ เรียบร้อย',
  'ชาญชัย ฉลาดดี', 'สุดา น่ารัก', 'วิชัย เก่งมาก', 'รัชนี สวยมาก',
  'ประจักษ์ ดีมาก', 'วิมล สวยงาม', 'สมเกียรติ เก่งดี', 'รัตน์ สวยดี'
];

// Sample messages for property inquiries
const inquiryMessages = [
  'สวัสดีครับ สนใจห้องนี้มากครับ ต้องการข้อมูลเพิ่มเติม',
  'สวัสดีค่ะ อยากทราบรายละเอียดเพิ่มเติมเกี่ยวกับห้องนี้ค่ะ',
  'สวัสดีครับ ราคายังใช้ได้อยู่ไหมครับ และสามารถดูห้องได้ไหม',
  'สวัสดีค่ะ สนใจมากค่ะ อยากทราบว่ายังว่างอยู่ไหม',
  'สวัสดีครับ ต้องการข้อมูลเพิ่มเติมเกี่ยวกับห้องนี้ครับ',
  'สวัสดีค่ะ ราคาและเงื่อนไขเป็นอย่างไรบ้างคะ',
  'สวัสดีครับ สนใจมากครับ สามารถนัดดูห้องได้ไหม',
  'สวัสดีค่ะ อยากทราบรายละเอียดเพิ่มเติมค่ะ'
];

// Generate random date within last 7 days
const getRandomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  
  return date;
};

// Generate buyer email from name
const generateBuyerEmail = (name) => {
  const nameParts = name.split(' ');
  const firstName = nameParts[0].toLowerCase();
  const lastName = nameParts[1] ? nameParts[1].toLowerCase() : '';
  const randomNum = Math.floor(Math.random() * 1000);
  return `${firstName}${lastName}${randomNum}@gmail.com`;
};

// Initialize seller chats for all sellers
export const initializeSellerChats = () => {
  if (!Array.isArray(propertiesData) || propertiesData.length === 0) {
    console.warn('No properties data available');
    return;
  }
  
  // Group properties by sellerId
  const propertiesBySeller = {};
  
  propertiesData.forEach(property => {
    const sellerId = property.sellerId || property.seller?.id;
    if (!sellerId) return;
    
    if (!propertiesBySeller[sellerId]) {
      propertiesBySeller[sellerId] = [];
    }
    propertiesBySeller[sellerId].push(property);
  });
  
  // Generate chats for each seller
  Object.keys(propertiesBySeller).forEach(sellerId => {
    const sellerChatKey = `seller_chats_${sellerId}`;
    
    // Check if chats already exist
    const existing = localStorage.getItem(sellerChatKey);
    if (existing) {
      try {
        const existingChats = JSON.parse(existing);
        // Only add new chats if seller has no existing chats
        if (Object.keys(existingChats).length > 0) {
          return; // Skip if seller already has chats
        }
      } catch (e) {
        // If parsing fails, continue to create new chats
      }
    }
    
    const sellerProperties = propertiesBySeller[sellerId];
    const sellerChats = {};
    
    // Create 1-3 chat messages per seller (random)
    const numChats = Math.min(Math.floor(Math.random() * 3) + 1, sellerProperties.length);
    const selectedProperties = sellerProperties
      .sort(() => Math.random() - 0.5)
      .slice(0, numChats);
    
    selectedProperties.forEach((property, index) => {
      const chatId = `property_${property.id}`;
      const buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
      const buyerEmail = generateBuyerEmail(buyerName);
      const messageText = inquiryMessages[Math.floor(Math.random() * inquiryMessages.length)];
      const timestamp = getRandomDate();
      
      const message = {
        id: Date.now() + index,
        sender: 'buyer',
        text: messageText,
        time: timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp.toISOString(),
        type: 'text',
        buyerEmail: buyerEmail,
        buyerName: buyerName,
        propertyId: property.id,
        propertyTitle: property.title || 'ทรัพย์สิน',
        sellerId: parseInt(sellerId)
      };
      
      sellerChats[chatId] = {
        propertyId: property.id,
        propertyTitle: property.title || 'ทรัพย์สิน',
        buyerEmail: buyerEmail,
        buyerName: buyerName,
        lastMessage: messageText,
        lastMessageTime: timestamp.toISOString(),
        unreadCount: 1,
        messages: [message]
      };
    });
    
    // Save to localStorage
    if (Object.keys(sellerChats).length > 0) {
      try {
        localStorage.setItem(sellerChatKey, JSON.stringify(sellerChats));
        console.log(`Initialized ${Object.keys(sellerChats).length} chats for seller ${sellerId}`);
      } catch (e) {
        console.error(`Error initializing chats for seller ${sellerId}:`, e);
      }
    }
  });
};

// Call this function when app initializes
export default initializeSellerChats;

