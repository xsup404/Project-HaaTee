import React, { useState } from 'react';
import { Heart, MapPin, Bath, Bed, Search, ChevronDown, Star, CheckCircle, SlidersHorizontal, ArrowRight, TrendingUp, Building, Sparkles, FileCheck, Shield, Zap, Clock, Bell, Award, Home as HomeIcon, BarChart3, Menu } from 'lucide-react';

import '../styles/Properties.css';

const Properties = ({ onNavigate, onLoginRequired }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchType, setSearchType] = useState('buy'); // 'buy', 'rent', 'sell'
  const [selectedType, setSelectedType] = useState('ทั้งหมด');
  const [selectedPrice, setSelectedPrice] = useState('ทั้งหมด');
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด');

  const allProperties = [
    // บ้านเดี่ยว
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      title: 'บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น',
      price: '฿12,900,000',
      location: 'พระราม 9 กรุงเทพฯ',
      beds: 4,
      baths: 3,
      size: '320 ตร.ม.',
      type: 'บ้านเดี่ยว',
      priceValue: 12900000,
      verified: true,
      rating: 4.7,
      views: 756,
      description: 'บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น สภาพดีมาก ตกแต่งสวย พื้นที่กว้างขวาง เหมาะสำหรับการอยู่อาศัย มีอุปกรณ์ครบครัน',
      amenities: ['สระว่ายน้ำ', 'จอดรถ 2 คัน', 'ใกล้ห้าง', 'ใกล้โรงเรียน'],
      owner: { name: 'คุณดำรง', verified: true, rating: 4.7 },
      seller: { id: 1, name: 'คุณดำรง', email: 'damrong@haatee.com', phone: '089-123-4567', verified: true, rating: 4.8 },
      sellerId: 1,
      expiryDate: '2025-12-20'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      title: 'บ้านหรู 2 ชั้น สไตล์ Contemporary',
      price: '฿22,000,000',
      location: 'เอกมัย กรุงเทพฯ',
      beds: 5,
      baths: 4,
      size: '400 ตร.ม.',
      type: 'บ้านเดี่ยว',
      priceValue: 22000000,
      featured: true,
      verified: true,
      rating: 4.9,
      views: 1120,
      description: 'บ้านหรูระดับเอกมัย ดีไซน์สวยงาม พื้นที่ใหญ่ สิ่งอำนวยความสะดวกครบครัน ทำเลดีตรงใจ',
      amenities: ['สระว่ายน้ำ', 'โครงการปิด', 'ห้องยิม', 'ที่จอดรถ 2 คัน'],
      owner: { name: 'คุณดำรง', verified: true, rating: 4.9 },
      seller: { id: 1, name: 'คุณดำรง', email: 'damrong@haatee.com', phone: '089-123-4567', verified: true, rating: 4.8 },
      sellerId: 1,
      expiryDate: '2025-12-15'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
      title: 'บ้านสวน 1 ชั้น บรรยากาศสงบ',
      price: '฿5,200,000',
      location: 'รังสิต ปทุมธานี',
      beds: 3,
      baths: 2,
      size: '280 ตร.ม.',
      type: 'บ้านเดี่ยว',
      priceValue: 5200000,
      verified: false,
      rating: 4.4,
      views: 423,
      description: 'บ้านสวนแนวราบ บรรยากาศเงียบสงบ เหมาะสำหรับการอยู่อาศัยครอบครัว ที่ดินกว้างมีสวน',
      amenities: ['ที่จอดรถ', 'สนามสีเขียว', 'เบาบ้าน'],
      owner: { name: 'คุณสมศักดิ์', verified: false, rating: 4.4 },
      seller: { id: 2, name: 'คุณสมศักดิ์', email: 'somsak@haatee.com', phone: '086-987-6543', verified: false, rating: 4.4 },
      sellerId: 2,
      expiryDate: '2025-12-25'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      title: 'บ้านเดี่ยว 3 ชั้น บางแสน',
      price: '฿8,900,000',
      location: 'บางแสน ชลบุรี',
      beds: 4,
      baths: 3,
      size: '300 ตร.ม.',
      type: 'บ้านเดี่ยว',
      priceValue: 8900000,
      verified: true,
      rating: 4.6,
      views: 542,
      description: 'บ้านเดี่ยว 3 ชั้น ตั้งอยู่ในบางแสน สภาพใหม่ ใกล้ชายหาด เหมาะสำหรับสันทนาการ',
      amenities: ['สระว่ายน้ำ', 'จอดรถ', 'ใกล้ชายหาด', 'ห้องนั่งเล่นใหญ่'],
      owner: { name: 'คุณอนันต์', verified: true, rating: 4.6 },
      seller: { id: 3, name: 'คุณอนันต์', email: 'anant@haatee.com', phone: '081-456-7890', verified: true, rating: 4.6 },
      sellerId: 3,
      expiryDate: '2025-12-18'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      title: 'บ้านสไตล์ Minimalist สีขาว',
      price: '฿9,500,000',
      location: 'ลาดพร้าว กรุงเทพฯ',
      beds: 3,
      baths: 3,
      size: '250 ตร.ม.',
      type: 'บ้านเดี่ยว',
      priceValue: 9500000,
      verified: true,
      rating: 4.5,
      views: 678,
      description: 'บ้านสไตล์ Minimalist สีขาวดีไซน์โมเดิร์น สะอาด พื้นที่ใช้สอยได้เต็มที่',
      amenities: ['ที่จอดรถ 2 คัน', 'สวน', 'ใกล้ BTS'],
      owner: { name: 'คุณวิชัย', verified: true, rating: 4.5 },
      seller: { id: 4, name: 'คุณวิชัย', email: 'vichai@haatee.com', phone: '085-321-6789', verified: true, rating: 4.5 },
      sellerId: 4,
      expiryDate: '2025-12-22'
    },
    // คอนโด
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      title: 'คอนโดหรู ริมแม่น้ำเจ้าพระยา',
      price: '฿18,500,000',
      location: 'สาทร กรุงเทพฯ',
      beds: 3,
      baths: 2,
      size: '180 ตร.ม.',
      type: 'คอนโด',
      priceValue: 18500000,
      featured: true,
      verified: true,
      rating: 4.8,
      views: 980,
      description: 'คอนโดมิเนียมหรูริมแม่น้ำเจ้าพระยา วิวที่สวยงาม ติดต่อโครงการ ใกล้ BTS, MRT',
      amenities: ['สระว่ายน้ำ', 'ห้องฟิตเนส', 'ห้องประชุม', 'บาร์ลาว'],
      owner: { name: 'คุณวรรณี', verified: true, rating: 4.9 },
      seller: { id: 5, name: 'คุณวรรณี', email: 'waruni@haatee.com', phone: '088-765-4321', verified: true, rating: 4.9 },
      sellerId: 5,
      expiryDate: '2025-12-10'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop',
      title: 'คอนโดโมเดิร์น ใจกลางเมือง',
      price: '฿6,800,000',
      location: 'อารีย์ กรุงเทพฯ',
      beds: 2,
      baths: 2,
      size: '85 ตร.ม.',
      type: 'คอนโด',
      priceValue: 6800000,
      verified: true,
      rating: 4.5,
      views: 534,
      description: 'คอนโดโมเดิร์นในอารีย์ ใจกลางเมือง ใกล้สถานี BTS เหมาะสำหรับคนทำงาน',
      amenities: ['ยิม', 'ลิฟท์', 'ที่จอดรถ', 'WiFi'],
      owner: { name: 'บริษัท ดวลประมาณ', verified: true, rating: 4.5 },
      seller: { id: 6, name: 'บริษัท ดวลประมาณ', email: 'company@realestateasia.com', phone: '02-123-4567', verified: true, rating: 4.5 },
      sellerId: 6,
      expiryDate: '2025-12-28'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      title: 'คอนโด Luxury ทำเลดี',
      price: '฿15,500,000',
      location: 'ทองหล่อ กรุงเทพฯ',
      beds: 3,
      baths: 2,
      size: '150 ตร.ม.',
      type: 'คอนโด',
      priceValue: 15500000,
      verified: true,
      rating: 4.7,
      views: 890,
      description: 'คอนโด Luxury ในทองหล่อ ทำเลดี ใกล้ห้างสรรพสินค้า สิ่งอำนวยสมบูรณ์',
      amenities: ['สระว่ายน้ำ', 'สปา', 'สลอยด์', 'จอดรถครบ'],
      owner: { name: 'คุณเศรษฐ', verified: true, rating: 4.7 },
      seller: { id: 7, name: 'คุณเศรษฐ', email: 'setthapol@haatee.com', phone: '084-234-5678', verified: true, rating: 4.7 },
      sellerId: 7,
      expiryDate: '2025-12-12'
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800&h=600&fit=crop',
      title: 'คอนโด Hi-Rise วิวเมือง',
      price: '฿12,000,000',
      location: 'สีลม กรุงเทพฯ',
      beds: 2,
      baths: 2,
      size: '100 ตร.ม.',
      type: 'คอนโด',
      priceValue: 12000000,
      verified: true,
      rating: 4.6,
      views: 742,
      description: 'คอนโด Hi-Rise สีลม วิวเมือง 180 องศา ตำแหน่งมุม สิ่งอำนวยครบครัน',
      amenities: ['สระว่ายน้ำ 2 ชั้น', 'ยิมขนาดใหญ่', 'ร้านอาหาร', 'เคเบิล'],
      owner: { name: 'คุณสิรินธร', verified: true, rating: 4.6 },
      seller: { id: 8, name: 'คุณสิรินธร', email: 'sirindhon@haatee.com', phone: '089-876-5432', verified: true, rating: 4.6 },
      sellerId: 8,
      expiryDate: '2025-12-17'
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      title: 'คอนโด Pool Villa สุขุมวิท',
      price: '฿9,800,000',
      location: 'สุขุมวิท กรุงเทพฯ',
      beds: 3,
      baths: 2,
      size: '120 ตร.ม.',
      type: 'คอนโด',
      priceValue: 9800000,
      verified: true,
      rating: 4.7,
      views: 856,
      description: 'คอนโด Pool Villa สุขุมวิท ตำแหน่งดี ใกล้ห้างเปิดใหม่ วิวสวนฟรี',
      amenities: ['สระว่ายน้ำ', 'สวน', 'ยิม', 'บาร์ลาว'],
      owner: { name: 'คุณสมทรง', verified: true, rating: 4.7 },
      seller: { id: 9, name: 'คุณสมทรง', email: 'somthorn@haatee.com', phone: '081-567-8901', verified: true, rating: 4.7 },
      sellerId: 9,
      expiryDate: '2025-12-23'
    },
    // ทาวน์เฮาส์
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      title: 'ทาวน์โฮม 3 ชั้น ใกล้ BTS',
      price: '฿8,500,000',
      location: 'สุขุมวิท กรุงเทพฯ',
      beds: 3,
      baths: 3,
      size: '200 ตร.ม.',
      type: 'ทาวน์เฮาส์',
      priceValue: 8500000,
      verified: true,
      rating: 4.6,
      views: 645,
      description: 'ทาวน์โฮม 3 ชั้น ตั้งอยู่ใกล้สถานีรถไฟฟ้า BTS สะดวกในการสัญจรไปมา ตกแต่งอย่างดี',
      amenities: ['สระว่ายน้ำส่วนตัว', 'จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนหน้าบ้าน'],
      owner: { name: 'คุณอรษา', verified: true, rating: 4.6 },
      seller: { id: 10, name: 'คุณอรษา', email: 'arsa@haatee.com', phone: '087-654-3210', verified: true, rating: 4.6 },
      sellerId: 10,
      expiryDate: '2025-12-19'
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      title: 'ทาวน์เฮาส์โมเดิร์น บางนา',
      price: '฿7,200,000',
      location: 'บางนา กรุงเทพฯ',
      beds: 3,
      baths: 3,
      size: '180 ตร.ม.',
      type: 'ทาวน์เฮาส์',
      priceValue: 7200000,
      featured: true,
      verified: true,
      rating: 4.7,
      views: 521,
      description: 'ทาวน์เฮาส์โมเดิร์นในบางนา ติดต่อศูนย์การค้า สภาพใหม่ มีสำนัก Sport Club',
      amenities: ['สระว่ายน้ำ', 'ยิม', 'โครงการปิด', 'ที่จอดรถ 2 คัน'],
      owner: { name: 'คุณนิยม', verified: true, rating: 4.7 },
      seller: { id: 11, name: 'คุณนิยม', email: 'niyom@haatee.com', phone: '082-345-6789', verified: true, rating: 4.7 },
      sellerId: 11,
      expiryDate: '2025-12-14'
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      title: 'ทาวน์เฮาส์ 2 ชั้น ลาดพร้าว',
      price: '฿6,500,000',
      location: 'ลาดพร้าว กรุงเทพฯ',
      beds: 3,
      baths: 2,
      size: '150 ตร.ม.',
      type: 'ทาวน์เฮาส์',
      priceValue: 6500000,
      verified: true,
      rating: 4.5,
      views: 412,
      description: 'ทาวน์เฮาส์ 2 ชั้น ลาดพร้าว บรรยากาศสงบ ใกล้สถานีรถไฟฟ้า โครงการดี',
      amenities: ['ที่จอดรถ', 'โครงการปิด', 'ระบบรักษาความปลอดภัย'],
      owner: { name: 'คุณสมบูรณ์', verified: true, rating: 4.5 },
      seller: { id: 12, name: 'คุณสมบูรณ์', email: 'samboorn@haatee.com', phone: '086-456-7890', verified: true, rating: 4.5 },
      sellerId: 12,
      expiryDate: '2025-12-26'
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      title: 'ทาวน์เฮาส์ เอกมัย',
      price: '฿8,900,000',
      location: 'เอกมัย กรุงเทพฯ',
      beds: 4,
      baths: 3,
      size: '220 ตร.ม.',
      type: 'ทาวน์เฮาส์',
      priceValue: 8900000,
      verified: true,
      rating: 4.8,
      views: 634,
      description: 'ทาวน์เฮาส์ 3 ชั้น เอกมัย ใกล้ห้างสรรพสินค้า ทำเลดี โครงการปิด',
      amenities: ['สระว่ายน้ำ', 'ยิม', 'ที่จอดรถ 2 คัน', 'รักษาความปลอดภัย 24/7'],
      owner: { name: 'คุณปิยา', verified: true, rating: 4.8 },
      seller: { id: 13, name: 'คุณปิยา', email: 'piyo@haatee.com', phone: '085-567-8901', verified: true, rating: 4.8 },
      sellerId: 13,
      expiryDate: '2025-12-11'
    },
    // วิลล่า
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      title: 'วิลล่าสมัยใหม่ หาดกะตะ ภูเก็ต',
      price: '฿45,000,000',
      location: 'หาดกะตะ ภูเก็ต',
      beds: 5,
      baths: 4,
      size: '450 ตร.ม.',
      type: 'วิลล่า',
      priceValue: 45000000,
      featured: true,
      verified: true,
      rating: 4.9,
      views: 1250,
      description: 'วิลล่าหรูหาดกะตะ หาดชาด วิวทะเลมหัศจรรย์ ใกล้ชายหาด สิ่งอำนวยครบครัน',
      amenities: ['สระว่ายน้ำส่วนตัว', 'บาร์ลาว', 'ห้องยิม', 'จอดรถหลายคัน'],
      owner: { name: 'คุณสมศรณ์', verified: true, rating: 4.9 },
      seller: { id: 14, name: 'คุณสมศรณ์', email: 'somshorn@haatee.com', phone: '088-678-9012', verified: true, rating: 4.9 },
      sellerId: 14,
      expiryDate: '2025-12-09'
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      title: 'วิลล่าพูลวิว เชียงใหม่',
      price: '฿28,000,000',
      location: 'หางดง เชียงใหม่',
      beds: 4,
      baths: 3,
      size: '380 ตร.ม.',
      type: 'วิลล่า',
      priceValue: 28000000,
      featured: true,
      verified: true,
      rating: 4.8,
      views: 945,
      description: 'วิลล่าพูลวิว เชียงใหม่ วิวธรรมชาติสวยงาม บรรยากาศเงียบสงบ ใจกลางป่า',
      amenities: ['สระว่ายน้ำ', 'สวน', 'ห้องนั่งเล่นกลางแจ้ง', 'ที่จอดรถ'],
      owner: { name: 'คุณวัชรา', verified: true, rating: 4.8 },
      seller: { id: 15, name: 'คุณวัชรา', email: 'wachara@haatee.com', phone: '081-789-0123', verified: true, rating: 4.8 },
      sellerId: 15,
      expiryDate: '2025-12-21'
    },
    {
      id: 17,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      title: 'วิลล่าสตูดิโอ ประมาณ',
      price: '฿35,500,000',
      location: 'ประมาณ สมุทรปราการ',
      beds: 3,
      baths: 3,
      size: '320 ตร.ม.',
      type: 'วิลล่า',
      priceValue: 35500000,
      verified: true,
      rating: 4.7,
      views: 678,
      description: 'วิลล่าสตูดิโอสอเต้ ประมาณ สไตล์สมัยใหม่ ใกล้ทะเล สิ่งอำนวยครบ',
      amenities: ['สระว่ายน้ำ', 'บาร์ลาว', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย'],
      owner: { name: 'คุณวิมล', verified: true, rating: 4.7 },
      seller: { id: 16, name: 'คุณวิมล', email: 'vimon@haatee.com', phone: '087-890-1234', verified: true, rating: 4.7 },
      sellerId: 16,
      expiryDate: '2025-12-27'
    },
  ];

  const propertyTypes = [
    { name: 'ทั้งหมด', count: allProperties.length },
    { name: 'บ้านเดี่ยว', count: allProperties.filter(p => p.type === 'บ้านเดี่ยว').length },
    { name: 'คอนโด', count: allProperties.filter(p => p.type === 'คอนโด').length },
    { name: 'ทาวน์เฮาส์', count: allProperties.filter(p => p.type === 'ทาวน์เฮาส์').length },
    { name: 'วิลล่า', count: allProperties.filter(p => p.type === 'วิลล่า').length },
  ];

  const priceRanges = [
    { name: 'ทั้งหมด', min: 0, max: Infinity },
    { name: 'ต่ำกว่า 5 ล้าน', min: 0, max: 5000000 },
    { name: '5-10 ล้าน', min: 5000000, max: 10000000 },
    { name: '10-20 ล้าน', min: 10000000, max: 20000000 },
    { name: '20-30 ล้าน', min: 20000000, max: 30000000 },
    { name: 'มากกว่า 30 ล้าน', min: 30000000, max: Infinity },
  ];

  const locations = [
    { name: 'ทั้งหมด' },
    { name: 'กรุงเทพฯ' },
    { name: 'ภูเก็ต' },
    { name: 'ปทุมธานี' },
    { name: 'เชียงใหม่' },
    { name: 'พัทยา' },
  ];

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ทั้งหมด' || property.type === selectedType;
    const matchesLocation = selectedLocation === 'ทั้งหมด' || property.location.includes(selectedLocation);
    
    const priceRange = priceRanges.find(p => p.name === selectedPrice);
    const matchesPrice = !priceRange || (property.priceValue >= priceRange.min && property.priceValue <= priceRange.max);
    
    return matchesSearch && matchesType && matchesLocation && matchesPrice;
  });

  return (
    <div className="properties-page-future">
      <header className="header-future">
        <div className="header-container-future">
          <div className="logo-future" onClick={() => onNavigate('home')}>
            <Sparkles size={24} />
            <span>HaaTee</span>
          </div>

          <nav className="nav-menu-future">
            <button className="nav-link-future" onClick={() => onNavigate('properties')}>
              ค้นหาทรัพย์สิน
            </button>
            <button className="nav-link-future" onClick={() => onNavigate('about')}>
              เกี่ยวกับเรา
            </button>
            <button className="nav-link-future" onClick={() => onNavigate('contact')}>
              ติดต่อเรา
            </button>
            <button className="nav-cta-future" onClick={() => onNavigate('login')}>
              เข้าสู่ระบบ
            </button>
          </nav>

          <button className="menu-toggle-future">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="page-hero-future page-hero-tall-future">
        <div className="page-hero-bg-future" style={{ backgroundImage: 'url(/B.jpg)' }}>
          <div className="page-hero-overlay-future"></div>
          <div className="pixel-pattern-future"></div>
        </div>
        <div className="container-future">
          <div className="page-hero-content-future">
            <h1 className="page-hero-title-future">
              <span className="title-line-future">ค้นหาทรัพย์สิน</span>
              <span className="title-line-future gradient-text-future">ที่ใช่สำหรับคุณ</span>
            </h1>
            <p className="page-hero-subtitle-future">ค้นพบทรัพย์สินคุณภาพสูง พร้อมข้อมูลครบถ้วน สัญญาดิจิทัล และการยืนยันตัวตนที่ปลอดภัย</p>
          </div>
        </div>
      </section>

      {/* SEARCH BAR FLOATING OVERLAY */}
      <div className="search-bar-floating-future">
        <div className="search-bar-wrapper-future">
        <div className="search-type-tabs-future">
          <button 
            className={`search-tab-future ${searchType === 'buy' ? 'active' : ''}`}
            onClick={() => setSearchType('buy')}
          >
            ซื้อ
          </button>
          <button 
            className={`search-tab-future ${searchType === 'rent' ? 'active' : ''}`}
            onClick={() => setSearchType('rent')}
          >
            เช่า
          </button>
        </div>

        {/* Search Filters */}
        <div className="search-filters-grid-future">
          <div className="filter-dropdown-future">
            <button
              className="filter-btn-future"
              onClick={() => {
                setLocationOpen(!locationOpen);
                setPropertyTypeOpen(false);
                setPriceRangeOpen(false);
              }}
            >
              <MapPin size={20} />
              <div className="filter-btn-content-future">
                <span className="filter-label-future">ทำเล</span>
                <span className="filter-value-future">{selectedLocation}</span>
              </div>
              <ChevronDown size={18} style={{ transform: locationOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                </button>
                {locationOpen && (
                  <div className="dropdown-menu-future">
                    {locations.map((loc, idx) => (
                      <button
                        key={idx}
                        className={`dropdown-item-future ${selectedLocation === loc.name ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedLocation(loc.name);
                          setLocationOpen(false);
                        }}
                      >
                        <span>{loc.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-dropdown-future">
                <button
                  className="filter-btn-future"
                  onClick={() => {
                    setPropertyTypeOpen(!propertyTypeOpen);
                    setPriceRangeOpen(false);
                    setLocationOpen(false);
                  }}
                >
                  <Building size={20} />
                  <div className="filter-btn-content-future">
                    <span className="filter-label-future">ประเภททรัพย์สิน</span>
                    <span className="filter-value-future">{selectedType}</span>
                  </div>
                  <ChevronDown size={18} style={{ transform: propertyTypeOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                </button>
                {propertyTypeOpen && (
                  <div className="dropdown-menu-future">
                    {propertyTypes.map((type, idx) => (
                      <button
                        key={idx}
                        className={`dropdown-item-future ${selectedType === type.name ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedType(type.name);
                          setPropertyTypeOpen(false);
                        }}
                      >
                        <span>{type.name}</span>
                        <span className="count-badge-future">{type.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-dropdown-future">
                <button
                  className="filter-btn-future"
                  onClick={() => {
                    setPriceRangeOpen(!priceRangeOpen);
                    setPropertyTypeOpen(false);
                    setLocationOpen(false);
                  }}
                >
                  <span className="price-icon-future">฿</span>
                  <div className="filter-btn-content-future">
                    <span className="filter-label-future">ช่วงราคา</span>
                    <span className="filter-value-future">{selectedPrice}</span>
                  </div>
                  <ChevronDown size={18} style={{ transform: priceRangeOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                </button>
                {priceRangeOpen && (
                  <div className="dropdown-menu-future">
                    {priceRanges.map((range, idx) => (
                      <button
                        key={idx}
                        className={`dropdown-item-future ${selectedPrice === range.name ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedPrice(range.name);
                          setPriceRangeOpen(false);
                        }}
                      >
                        <span>{range.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="search-submit-btn-future" onClick={() => onNavigate('properties')}>
                <Search size={20} />
                <span>ค้นหาทรัพย์สิน</span>
              </button>
            </div>
        </div>
      </div>

      {/* ===== RESULTS INFO ===== */}
      <section className="properties-results-future">
        <div className="container-future">
          <div className="results-header-future">
            <p className="results-count-future">
              พบ <strong>{filteredProperties.length}</strong> รายการ
              {searchTerm && <> สำหรับ "<strong>{searchTerm}</strong>"</>}
            </p>
            <div className="sort-controls-future">
              <button className="sort-btn-future active">
                <TrendingUp size={16} />
                <span>ยอดนิยม</span>
              </button>
              <button className="sort-btn-future">
                <span>ราคา: ต่ำ-สูง</span>
              </button>
              <button className="sort-btn-future">
                <span>ราคา: สูง-ต่ำ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROPERTIES GRID ===== */}
      <section className="properties-listing-future">
        <div className="container-future">
          {filteredProperties.length > 0 ? (
            <div className="properties-grid-future">
              {filteredProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="property-card-future"
                  onClick={() => onNavigate('propertyDetail', { property })}
                >
                  <div className="property-image-future">
                    <img src={property.image} alt={property.title} />
                    <div className="property-overlay-future"></div>
                    
                    {property.verified && (
                      <div className="verified-badge-future">
                        <CheckCircle size={14} />
                        <span>ยืนยันแล้ว</span>
                      </div>
                    )}
                    
                    {property.featured && (
                      <div className="featured-badge-future">
                        <Star size={14} fill="currentColor" />
                        <span>แนะนำ</span>
                      </div>
                    )}
                    
                    <button
                      className="favorite-btn-future"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoginRequired('บันทึกรายการโปรด');
                      }}
                    >
                      <Heart size={18} />
                    </button>

                    <div className="property-stats-future">
                      <div className="stat-badge-future">
                        <span>👁️ {property.views}</span>
                      </div>
                      {property.rating && (
                        <div className="rating-badge-future">
                          <Star size={12} fill="currentColor" />
                          <span>{property.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="property-content-future">
                    <div className="property-header-future">
                      <h3 className="property-title-future">{property.title}</h3>
                      <div className="property-price-future">{property.price}</div>
                    </div>

                    <div className="property-location-future">
                      <MapPin size={16} />
                      <span>{property.location}</span>
                    </div>

                    <div className="property-meta-future">
                      <span>
                        <Bed size={14} />
                        {property.beds}
                      </span>
                      <span>
                        <Bath size={14} />
                        {property.baths}
                      </span>
                      <span>
                        <Building size={14} />
                        {property.size}
                      </span>
                    </div>

                    <button className="view-details-btn-future">
                      <span>ดูรายละเอียด</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results-future">
              <div className="no-results-icon-future">🔍</div>
              <h3>ไม่พบทรัพย์สินที่ค้นหา</h3>
              <p>ลองเปลี่ยนเงื่อนไขการค้นหา หรือดูทรัพย์สินทั้งหมดของเรา</p>
              <button
                className="btn-future btn-primary-future"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('ทั้งหมด');
                  setSelectedPrice('ทั้งหมด');
                  setSelectedLocation('ทั้งหมด');
                }}
              >
                <span>รีเซ็ตการค้นหา</span>
              </button>
            </div>
          )}

          {filteredProperties.length > 0 && (
            <div className="load-more-section-future">
              <button className="btn-future btn-outline-future">
                <span>โหลดทรัพย์สินเพิ่มเติม</span>
                <ChevronDown size={18} />
              </button>
              <p className="showing-text-future">แสดง {filteredProperties.length} จาก {allProperties.length} รายการ</p>
            </div>
          )}
        </div>
      </section>

      <footer className="footer-future">
        <div className="container-future">
          <div className="footer-grid-future">
            <div className="footer-col-future footer-about-future">
              <div className="footer-logo-future">
                <Sparkles size={24} />
                <span>HaaTee</span>
              </div>
              <p className="footer-desc-future">
                แพลตฟอร์มอสังหาริมทรัพย์ที่ทันสมัยและน่าเชื่อถือที่สุดในประเทศไทย
                พร้อมระบบสัญญาดิจิทัลและการยืนยันตัวตนที่ปลอดภัย
              </p>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">เมนูหลัก</h5>
              <ul className="footer-links-future">
                <li><button onClick={() => onNavigate('home')}>หน้าแรก</button></li>
                <li><button onClick={() => onNavigate('properties')}>ค้นหาทรัพย์สิน</button></li>
                <li><button onClick={() => onNavigate('about')}>เกี่ยวกับเรา</button></li>
                <li><button onClick={() => onNavigate('contact')}>ติดต่อเรา</button></li>
                <li><button onClick={() => onNavigate('login')}>เข้าสู่ระบบ</button></li>
              </ul>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">ประเภททรัพย์สิน</h5>
              <ul className="footer-links-future">
                <li><button onClick={() => onNavigate('properties')}>บ้านเดี่ยว</button></li>
                <li><button onClick={() => onNavigate('properties')}>คอนโดมิเนียม</button></li>
                <li><button onClick={() => onNavigate('properties')}>ทาวน์เฮาส์</button></li>
                <li><button onClick={() => onNavigate('properties')}>อาคารพาณิชย์</button></li>
              </ul>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">ติดต่อเรา</h5>
              <ul className="footer-links-future">
                <li><button>support@haatee.com</button></li>
                <li><button>02-xxx-xxxx</button></li>
                <li><button>Facebook</button></li>
                <li><button>Line @haatee</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-future">
            <p>&copy; 2025 HaaTee. All rights reserved.</p>
            <div className="footer-links-bottom-future">
              <button>Privacy Policy</button>
              <button>Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Properties;
