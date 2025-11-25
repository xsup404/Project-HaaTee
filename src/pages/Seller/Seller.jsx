import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Bath,
  Bed,
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  FileText,
  Filter,
  Heart,
  ImageIcon,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  RotateCw,
  Search,
  Send,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  Upload,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './Seller.css';

const Seller = ({ onNavigate, onLoginRequired }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Modal states
  const [showCreateListingPage, setShowCreateListingPage] = useState(false);
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showAnalyticsCharts, setShowAnalyticsCharts] = useState(true);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeGuideSection, setActiveGuideSection] = useState('listing');
  
  // Filter states
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    beds: '',
    sizeMin: '',
    sizeMax: '',
    allowPets: '',
    nearExpiry: false
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Profile data - Use default profile first, then load from localStorage if user has saved
  const [profileData, setProfileData] = useState(() => {
    const defaultProfile = {
      name: 'นางสาวหนูดี รวยมาก',
      email: 'seller@haatee.com',
      phone: '081-2345-6789',
      bio: '',
      profileImage: null,
      coverPhoto: null,
      userType: 'owner', // 'agent' or 'owner'
      rating: 4.8,
      reviewCount: 24,
      verified: true // ยืนยันตัวตนแล้ว
    };

    try {
      // Try to load complete profile with images first
      const savedProfile = localStorage.getItem('sellerProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        // Only use saved profile if it has valid name and user has explicitly saved it
        // Check if name is valid and not the old default
        if (parsed.name && 
            parsed.name.toLowerCase() !== 'admin' && 
            parsed.name.trim() !== '' &&
            parsed.name !== 'Admin Seller') {
          // Ensure verified field exists, default to true if not present
          if (parsed.verified === undefined) {
            parsed.verified = true;
          }
          // Merge with default to ensure all fields exist
          return { ...defaultProfile, ...parsed };
        } else {
          // Invalid or old default name, clear localStorage and use default
          localStorage.removeItem('sellerProfile');
        }
      }
      // If no complete profile, try to load basic profile
      const savedBasicProfile = localStorage.getItem('sellerProfileBasic');
      if (savedBasicProfile) {
        const parsed = JSON.parse(savedBasicProfile);
        // Only use saved profile if it has valid name and user has explicitly saved it
        if (parsed.name && 
            parsed.name.toLowerCase() !== 'admin' && 
            parsed.name.trim() !== '' &&
            parsed.name !== 'Admin Seller') {
          // Ensure verified field exists, default to true if not present
          if (parsed.verified === undefined) {
            parsed.verified = true;
          }
          // Merge with default to ensure all fields exist
          return { ...defaultProfile, ...parsed };
        } else {
          // Invalid or old default name, clear localStorage and use default
          localStorage.removeItem('sellerProfileBasic');
        }
      }
    } catch (e) {
      console.error('Error loading profile from localStorage:', e);
      // Clear corrupted data
      localStorage.removeItem('sellerProfile');
      localStorage.removeItem('sellerProfileBasic');
    }
    // Return default profile
    return defaultProfile;
  });

  // Listing Form States
  const [listingStep, setListingStep] = useState(1);
  const [newListing, setNewListing] = useState({
    // Step 1: ข้อมูลทรัพย์
    listingType: '', // 'sell' or 'rent'
    title: '',
    price: '',
    propertyType: '', // คอนโด, บ้านเดี่ยว, etc.
    beds: '',
    baths: '',
    size: '', // พื้นที่ใช้สอย (ตร.ม.) - บังคับ
    landSize: '', // ที่ดิน (ตร.ว.)
    yearBuilt: '',
    description: '',
    amenities: [],
    
    // Step 2: ที่ตั้ง
    address: '', // ที่อยู่ - บังคับ
    mapEmbed: '', // Google Maps Embed Code
    
    // Step 3: รูปภาพ
    images: [], // Array of base64 images
    watermark: {
      enabled: false,
      text1: '',
      text2: '',
      position: 'center' // center, top-left, top-right, bottom-left, bottom-right
    },
    
    // Step 4: ช่องทางติดต่อ
    lineId: '',
    phone: '',
    email: '',
    
    // Step 5: สรุปประกาศ
    publishStatus: 'publish' // 'publish' or 'draft'
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  const [contractData, setContractData] = useState({
    propertyId: '',
    tenantEmail: '',
    monthlyRent: '',
    leaseDuration: '12',
    deposit: '',
    conditions: '',
    startDate: ''
  });

  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, sender: 'contact', text: 'สนใจเช่าคอนโดนี้ได้ไหม?', time: '10:30' },
      { id: 2, sender: 'me', text: 'ได้ครับ พร้อมดูต่อตามที่ต้องการได้ครับ', time: '10:35' }
    ],
    2: [
      { id: 1, sender: 'contact', text: 'ราคากรรมสิทธิ์เท่าไหร่?', time: '09:15' }
    ]
  });

  const [messages, setMessages] = useState('');

  // Listings data - Load from localStorage or use default
  const [listings, setListings] = useState(() => {
    const savedListings = localStorage.getItem('sellerListings');
    if (savedListings) {
      try {
        return JSON.parse(savedListings);
      } catch (e) {
        console.error('Error parsing saved listings:', e);
      }
    }
    return [
    {
      id: 1,
      title: 'คอนโดหรู ริมแม่น้ำเจ้าพระยา',
      location: 'สาทร กรุงเทพฯ',
      price: 45000,
      type: 'rent',
      propertyType: 'คอนโด',
      beds: 2,
      baths: 2,
      size: 95,
      views: 2341,
      saves: 156,
      contacts: 45,
      status: 'active',
      expiryDate: '2025-02-10'
    },
    {
      id: 2,
      title: 'บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น',
      location: 'พระราม 9 กรุงเทพฯ',
      price: 12900000,
      type: 'sell',
      propertyType: 'บ้านเดี่ยว',
      beds: 4,
      baths: 3,
      size: 320,
      views: 1892,
      saves: 234,
      contacts: 67,
      status: 'active',
      expiryDate: '2025-01-05'
    },
    {
      id: 3,
      title: 'ทาวน์โฮม 3 ชั้น ใกล้ BTS',
      location: 'สุขุมวิท กรุงเทพฯ',
      price: 8500000,
      type: 'sell',
      propertyType: 'ทาวน์โฮม',
      beds: 3,
      baths: 3,
      size: 200,
      views: 1567,
      saves: 189,
      contacts: 52,
      status: 'expired',
      expiryDate: '2024-11-10'
    },
    {
      id: 4,
      title: 'Modern Condo Charan Build E',
      location: '232 Charan Sanit Wong Rd, Bang Phlat, Bangkok 10700',
      price: 10000,
      type: 'rent',
      propertyType: 'คอนโด',
      beds: 1,
      baths: 1,
      size: 35,
      views: 0,
      saves: 0,
      contacts: 0,
      status: 'draft',
      expiryDate: null
    },
    {
      id: 5,
      title: 'คอนโดมิเนียมหรู ใจกลางเมือง',
      location: 'สีลม กรุงเทพฯ',
      price: 25000,
      type: 'rent',
      propertyType: 'คอนโด',
      beds: 2,
      baths: 1,
      size: 65,
      views: 0,
      saves: 0,
      contacts: 0,
      status: 'draft',
      expiryDate: null
    },
    {
      id: 6,
      title: 'บ้านเดี่ยวสวย 3 ห้องนอน พร้อมสวน',
      location: 'บางนา กรุงเทพฯ',
      price: 15000000,
      type: 'sell',
      propertyType: 'บ้านเดี่ยว',
      beds: 3,
      baths: 2,
      size: 180,
      views: 0,
      saves: 0,
      contacts: 0,
      status: 'draft',
      expiryDate: null
    },
    {
      id: 7,
      title: 'อพาร์ทเมนท์ใหม่ ใกล้รถไฟฟ้า',
      location: 'อโศก กรุงเทพฯ',
      price: 18000,
      type: 'rent',
      propertyType: 'อพาร์ทเมนท์',
      beds: 1,
      baths: 1,
      size: 40,
      views: 0,
      saves: 0,
      contacts: 0,
      status: 'draft',
      expiryDate: null
    },
    {
      id: 8,
      title: 'ทาวน์โฮม 2 ชั้น พร้อมที่จอดรถ',
      location: 'ลาดพร้าว กรุงเทพฯ',
      price: 6500000,
      type: 'sell',
      propertyType: 'ทาวน์โฮม',
      beds: 3,
      baths: 2,
      size: 150,
      views: 0,
      saves: 0,
      contacts: 0,
      status: 'draft',
      expiryDate: null
    },
    {
      id: 9,
      title: 'คอนโดหรูใจกลางเมือง พร้อมเฟอร์นิเจอร์',
      location: 'สีลม กรุงเทพฯ',
      price: 35000,
      type: 'rent',
      propertyType: 'คอนโด',
      beds: 2,
      baths: 2,
      size: 75,
      views: 892,
      saves: 45,
      contacts: 12,
      status: 'pending_review',
      expiryDate: '2025-03-15',
      reportReason: 'รายงานว่า "ราคาไม่ถูกต้อง"'
    },
    {
      id: 10,
      title: 'บ้านเดี่ยว 4 ห้องนอน พร้อมสวนสวย',
      location: 'บางนา กรุงเทพฯ',
      price: 18000000,
      type: 'sell',
      propertyType: 'บ้านเดี่ยว',
      beds: 4,
      baths: 3,
      size: 350,
      views: 2341,
      saves: 189,
      contacts: 67,
      status: 'closed',
      expiryDate: '2025-02-20'
    }
    ];
  });

  // Auto-save listings to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('sellerListings', JSON.stringify(listings));
    } catch (e) {
      console.error('Error saving listings to localStorage:', e);
    }
  }, [listings]);

  // Stats
  const stats = {
    activeListings: listings.filter(l => l.status === 'active').length,
    totalViews: listings.reduce((sum, l) => sum + l.views, 0),
    totalSaves: listings.reduce((sum, l) => sum + l.saves, 0),
    totalContacts: listings.reduce((sum, l) => sum + l.contacts, 0)
  };

  const recentActivities = [
    { id: 1, property: 'คอนโดหรู', action: 'ได้รับติดต่อใหม่', time: '2 นาทีที่แล้ว', type: 'contact' },
    { id: 2, property: 'บ้านเดี่ยว', action: 'ถูกบันทึก 5 ครั้ง', time: '15 นาทีที่แล้ว', type: 'save' },
    { id: 3, property: 'ทาวน์โฮม', action: 'หมดอายุประกาศ', time: '1 ชั่วโมงที่แล้ว', type: 'alert' },
    { id: 4, property: 'คอนโดหรู', action: 'ยอดดูเพิ่ม 50 ครั้ง', time: '3 ชั่วโมงที่แล้ว', type: 'view' }
  ];

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      onNavigate('login');
    }, 500);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Format expiry date to consistent format (YYYY-MM-DD)
  const formatExpiryDate = (date) => {
    if (!date) return '-';
    
    // If already in YYYY-MM-DD format, return as is
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // If it's a Date object or string that can be parsed
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    // Format to YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Get expiry date 90 days from now in consistent format
  const getExpiryDate90Days = () => {
    const date = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    return formatExpiryDate(date);
  };

  // Auto-update expiryDate for active listings that don't have one
  useEffect(() => {
    const activeListingsWithoutExpiry = listings.filter(
      l => l.status === 'active' && !l.expiryDate
    );
    
    if (activeListingsWithoutExpiry.length > 0) {
      setListings(prevListings => {
        const updated = prevListings.map(l => 
          l.status === 'active' && !l.expiryDate
            ? { ...l, expiryDate: getExpiryDate90Days() }
            : l
        );
        // Only update if something actually changed
        const hasChanges = updated.some((l, i) => 
          l.expiryDate !== prevListings[i]?.expiryDate
        );
        return hasChanges ? updated : prevListings;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings.map(l => `${l.id}-${l.status}-${l.expiryDate || 'null'}`).join('|')]);

  // Auto-save profile data to localStorage (excluding images to avoid localStorage size limits)
  useEffect(() => {
    try {
      // Save profile data without images to avoid localStorage size issues
      // Images will be saved when user clicks save button
      const profileDataWithoutImages = {
        ...profileData,
        profileImage: null,
        coverPhoto: null
      };
      localStorage.setItem('sellerProfileBasic', JSON.stringify(profileDataWithoutImages));
    } catch (e) {
      console.error('Error auto-saving profile to localStorage:', e);
    }
  }, [profileData.name, profileData.email, profileData.phone, profileData.bio, profileData.userType, profileData.rating, profileData.reviewCount]);

  // Validation functions
  const validateStep1 = () => {
    const errors = {};
    if (!newListing.listingType) errors.listingType = 'กรุณาเลือกประเภทการประกาศ';
    if (!newListing.title?.trim()) errors.title = 'กรุณากรอกชื่อประกาศ';
    if (!newListing.price?.trim()) errors.price = 'กรุณากรอกราคา';
    if (!newListing.propertyType) errors.propertyType = 'กรุณาเลือกประเภททรัพย์';
    if (!newListing.size?.trim()) errors.size = 'กรุณากรอกพื้นที่ใช้สอย';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!newListing.address?.trim()) errors.address = 'กรุณากรอกที่อยู่';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (newListing.images.length === 0) errors.images = 'กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป';
    if (newListing.images.length > 30) errors.images = 'อัปโหลดได้สูงสุด 30 รูป';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = () => {
    const errors = {};
    const hasContact = newListing.lineId?.trim() || newListing.phone?.trim() || newListing.email?.trim();
    if (!hasContact) {
      errors.contact = 'กรุณากรอกช่องทางติดต่ออย่างน้อย 1 ช่องทาง';
    }
    if (newListing.phone && !/^[0-9]{9,10}$/.test(newListing.phone.replace(/[-\s]/g, ''))) {
      errors.phone = 'เบอร์โทรศัพท์ต้องเป็น 9-10 หลัก';
    }
    if (newListing.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newListing.email)) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle step navigation
  const handleNextStep = () => {
    let isValid = false;
    
    switch (listingStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      case 5:
        handleCreateListing();
      return;
      default:
        break;
    }
    
    if (isValid) {
      setListingStep(listingStep + 1);
      setValidationErrors({});
    }
  };

  const handlePrevStep = () => {
    if (listingStep > 1) {
      setListingStep(listingStep - 1);
      setValidationErrors({});
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + newListing.images.length > 30) {
      alert('อัปโหลดได้สูงสุด 30 รูป');
      return;
    }

    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setNewListing({
        ...newListing,
        images: [...newListing.images, ...images]
      });
    });
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + newListing.images.length > 20) {
      alert('อัปโหลดได้สูงสุด 20 รูป');
      return;
    }

    const imagePromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setNewListing({
        ...newListing,
        images: [...newListing.images, ...images]
      });
    });
  };

  const handleImageRemove = (index) => {
    setNewListing({
      ...newListing,
      images: newListing.images.filter((_, i) => i !== index)
    });
  };

  const handleImageReorder = (fromIndex, toIndex) => {
    const newImages = [...newListing.images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setNewListing({ ...newListing, images: newImages });
  };

  // Handle Create Listing (Final Step)
  const handleCreateListing = () => {
    const listing = {
      id: editingListingId || listings.length + 1,
      title: newListing.title,
      location: newListing.address,
      address: newListing.address,
      price: parseFloat(newListing.price),
      type: newListing.listingType,
      beds: newListing.beds || 0,
      baths: newListing.baths || 0,
      size: parseFloat(newListing.size),
      landSize: newListing.landSize ? parseFloat(newListing.landSize) : undefined,
      yearBuilt: newListing.yearBuilt || undefined,
      propertyType: newListing.propertyType,
      images: newListing.images,
      description: newListing.description,
      amenities: newListing.amenities || [],
      mapEmbed: newListing.mapEmbed || '',
      watermark: newListing.watermark || {
        enabled: false,
        text1: '',
        text2: '',
        position: 'center'
      },
      lineId: newListing.lineId || '',
      phone: newListing.phone || '',
      email: newListing.email || '',
      views: editingListingId ? listings.find(l => l.id === editingListingId)?.views || 0 : 0,
      saves: editingListingId ? listings.find(l => l.id === editingListingId)?.saves || 0 : 0,
      contacts: editingListingId ? listings.find(l => l.id === editingListingId)?.contacts || 0 : 0,
      status: newListing.publishStatus === 'publish' ? 'active' : 'draft',
      expiryDate: editingListingId 
        ? listings.find(l => l.id === editingListingId)?.expiryDate
        : (newListing.publishStatus === 'publish' 
          ? getExpiryDate90Days()
          : null)
    };

    if (editingListingId) {
      // Update existing listing
      setListings(listings.map(l => l.id === editingListingId ? listing : l));
    } else {
      // Create new listing
      setListings([...listings, listing]);
    }
    
    // Reset form
    setNewListing({
      listingType: '',
      title: '',
      price: '',
      propertyType: '',
      beds: '',
      baths: '',
      size: '',
      landSize: '',
      yearBuilt: '',
      description: '',
      amenities: [],
      address: '',
      mapEmbed: '',
      images: [],
      watermark: {
        enabled: false,
        text1: '',
        text2: '',
        position: 'center'
      },
      lineId: '',
      phone: '',
      email: '',
      publishStatus: 'publish'
    });
    setListingStep(1);
    setShowCreateListingPage(false);
    setEditingListingId(null);
    setActiveTab('listings');
    alert(editingListingId 
      ? 'แก้ไขประกาศสำเร็จ!' 
      : (newListing.publishStatus === 'publish' ? 'เพิ่มประกาศสำเร็จ! ประกาศจะแสดงในระบบทันที' : 'บันทึกเป็นร่างสำเร็จ!'));
  };

  // Handle Edit Listing
  const handleEditListing = (id) => {
    const listing = listings.find(l => l.id === id);
    if (!listing) return;
    
    // Convert listing data to newListing format
    setNewListing({
      listingType: listing.type || '',
      title: listing.title || '',
      price: listing.price?.toString() || '',
      propertyType: listing.propertyType || '',
      beds: listing.beds?.toString() || '',
      baths: listing.baths?.toString() || '',
      size: listing.size?.toString() || '',
      landSize: listing.landSize?.toString() || '',
      yearBuilt: listing.yearBuilt?.toString() || '',
      description: listing.description || '',
      amenities: listing.amenities || [],
      address: listing.location || listing.address || '',
      mapEmbed: listing.mapEmbed || '',
      images: listing.images || [],
      watermark: listing.watermark || {
        enabled: false,
        text1: '',
        text2: '',
        position: 'center'
      },
      lineId: listing.lineId || '',
      phone: listing.phone || '',
      email: listing.email || '',
      publishStatus: listing.status === 'active' ? 'publish' : 'draft'
    });
    
    setEditingListingId(id);
    setListingStep(1);
    setShowCreateListingPage(true);
  };

  // Handle Delete Listing
  const handleDeleteListing = (id) => {
    if (window.confirm('แน่ใจว่าต้องการลบประกาศนี้?')) {
      setListings(listings.filter(l => l.id !== id));
      alert('ลบประกาศสำเร็จ!');
    }
  };

  // Handle Repost Listing
  const handleRepostListing = (id) => {
    setListings(listings.map(l => 
      l.id === id 
        ? { ...l, status: 'active', expiryDate: getExpiryDate90Days() }
        : l
    ));
    alert('รีโพสต์ประกาศสำเร็จ!');
  };

  // Handle Create Contract
  const handleCreateContract = () => {
    if (!contractData.propertyId || !contractData.tenantEmail || !contractData.monthlyRent) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }
    alert('ร่างสัญญาสำเร็จ! ส่งไปยัง ' + contractData.tenantEmail);
    setShowContractModal(false);
    setContractData({
      propertyId: '',
      tenantEmail: '',
      monthlyRent: '',
      leaseDuration: '12',
      deposit: '',
      conditions: '',
      startDate: ''
    });
  };

  // Handle Send Message
  const handleSendMessage = () => {
    if (!messages.trim() || !selectedChatId) return;
    
    setChatMessages({
      ...chatMessages,
      [selectedChatId]: [
        ...chatMessages[selectedChatId],
        {
          id: chatMessages[selectedChatId].length + 1,
          sender: 'me',
          text: messages,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    });
    setMessages('');
  };

  // Function to get property icon - ใช้ไอคอนทรัพย์สำหรับทุกประเภท
  const getPropertyIcon = (propertyType, listingType) => {
    // ใช้ไอคอนทรัพย์ (🏘️) สำหรับทุกทรัพย์สิน
    return '🏘️';
  };

  // Handle profile image upload
  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData({ ...profileData, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Handle save profile
  const handleSaveProfile = () => {
    try {
      // Save complete profile data including images to localStorage
      localStorage.setItem('sellerProfile', JSON.stringify(profileData));
      // Also update basic profile data
      localStorage.setItem('sellerProfileBasic', JSON.stringify({
        ...profileData,
        profileImage: null,
        coverPhoto: null
      }));
      alert('บันทึกข้อมูลโปรไฟล์สำเร็จ!');
      setShowProfileModal(false);
    } catch (e) {
      console.error('Error saving profile to localStorage:', e);
      // If error is due to quota exceeded, try saving without images silently
      if (e.name === 'QuotaExceededError') {
        try {
          const profileDataWithoutImages = {
            ...profileData,
            profileImage: null,
            coverPhoto: null
          };
          localStorage.setItem('sellerProfileBasic', JSON.stringify(profileDataWithoutImages));
          alert('บันทึกข้อมูลโปรไฟล์สำเร็จ!');
          setShowProfileModal(false);
        } catch (e2) {
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลโปรไฟล์');
        }
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลโปรไฟล์');
      }
    }
  };

  // Dashboard View
  const renderDashboard = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>แดชบอร์ด</h2>
          <p>สวัสดีครับ! ยินดีต้อนรับกลับมา</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
        <div className="quick-stat-card purple">
          <div className="stat-icon-wrapper">
            <div className="stat-icon purple">
              <Building2 size={24} />
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-label">ประกาศที่ใช้งาน</div>
            <div className="stat-value">{stats.activeListings}</div>
            <div className="stat-change up">
              <TrendingUp size={14} />
              <span>ทั้งหมด {listings.length}</span>
            </div>
          </div>
        </div>

        <div className="quick-stat-card blue">
          <div className="stat-icon-wrapper">
            <div className="stat-icon blue">
              <Eye size={24} />
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-label">ยอดดู</div>
            <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
            <div className="stat-change up">
              <TrendingUp size={14} />
              <span>+12.5%</span>
            </div>
          </div>
        </div>

        <div className="quick-stat-card green">
          <div className="stat-icon-wrapper">
            <div className="stat-icon green">
              <Heart size={24} />
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-label">ยอดสนใจ</div>
            <div className="stat-value">{stats.totalSaves.toLocaleString()}</div>
            <div className="stat-change up">
              <TrendingUp size={14} />
              <span>+8.2%</span>
            </div>
          </div>
        </div>

        <div className="quick-stat-card orange">
          <div className="stat-icon-wrapper">
            <div className="stat-icon orange">
              <MessageCircle size={24} />
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-label">ยอดติดต่อ</div>
            <div className="stat-value">{stats.totalContacts.toLocaleString()}</div>
            <div className="stat-change up">
              <TrendingUp size={14} />
              <span>+5.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Top Listings */}
        <div className="card-section">
          <div className="section-header">
            <h3>ประกาศชั้นนำ</h3>
            <button className="btn-text">ดูทั้งหมด <ChevronRight size={16} /></button>
          </div>
          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th className="listings-name">ทรัพย์สิน</th>
                  <th>ประเภท</th>
                  <th>ยอดดู</th>
                  <th>สนใจ</th>
                  <th>ติดต่อ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {listings
                  .filter(listing => listing.status === 'active')
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 3)
                  .map(listing => (
                    <tr key={listing.id}>
                      <td>
                        <div className="table-property">
                          <div className="property-icon">{getPropertyIcon(listing.propertyType, listing.type)}</div>
                          <div>
                            <p className="property-name">{listing.title}</p>
                            <p className="property-location"><MapPin size={12} /> {listing.location}</p>
                          </div>
                        </div>
                      </td>
                      <td>{listing.type === 'sell' ? 'ขาย' : 'เช่า'}</td>
                      <td><strong>{listing.views}</strong></td>
                      <td><strong>{listing.saves}</strong></td>
                      <td><strong>{listing.contacts}</strong></td>
                      <td className="status-cell">
                        <span className="badge success">
                          ✓ ใช้งาน
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-section">
          <div className="section-header">
            <h3>กิจกรรมล่าสุด</h3>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'contact' && <MessageCircle size={16} />}
                  {activity.type === 'save' && <Heart size={16} />}
                  {activity.type === 'alert' && <Clock size={16} strokeWidth={2.5} />}
                  {activity.type === 'view' && <Eye size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-title">
                    <strong>{activity.property}</strong> - {activity.action}
                  </p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Progress Indicator
  const renderProgressIndicator = () => {
    const steps = [
      { number: 1, title: 'ข้อมูลทรัพย์' },
      { number: 2, title: 'ที่ตั้ง' },
      { number: 3, title: 'รูปภาพ' },
      { number: 4, title: 'ช่องทางติดต่อ' },
      { number: 5, title: 'สรุปประกาศ' }
    ];

    return (
      <div className="listing-progress">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`progress-step ${listingStep >= step.number ? 'active' : ''} ${listingStep === step.number ? 'current' : ''}`}>
              <div className="progress-step-circle">
                {listingStep > step.number ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className="progress-step-title">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-line ${listingStep > step.number ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Step 1: ข้อมูลทรัพย์
  const renderStep1 = () => {
    const propertyTypes = [
      'คอนโด', 'บ้านเดี่ยว', 'ทาวเฮ้าส์', 'ทาวโฮม', 'ที่ดิน', 
      'อพาร์ทเมนท์', 'หอพัก', 'ตึกแถว', 'อาคารพาณิชย์'
    ];
    
    const amenitiesList = [
      'สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ลิฟต์', 'ระบบรักษาความปลอดภัย',
      'สวน', 'ห้องซักผ้า', 'อินเทอร์เน็ต', 'เครื่องปรับอากาศ', 'เฟอร์นิเจอร์'
    ];

    return (
      <div className="listing-step-content">
        <h3 className="step-title">ขั้นตอนที่ 1: ข้อมูลทรัพย์</h3>
        
        <div className="form-group">
          <label>ประเภทการประกาศ <span className="required">*</span></label>
          <div className="listing-type-buttons">
        <button 
              type="button"
              className={`listing-type-btn ${newListing.listingType === 'sell' ? 'active' : ''}`}
              onClick={() => setNewListing({ ...newListing, listingType: 'sell' })}
            >
              ขาย
        </button>
            <button
              type="button"
              className={`listing-type-btn ${newListing.listingType === 'rent' ? 'active' : ''}`}
              onClick={() => setNewListing({ ...newListing, listingType: 'rent' })}
            >
              เช่า
            </button>
          </div>
          {validationErrors.listingType && (
            <span className="error-message">{validationErrors.listingType}</span>
          )}
      </div>

            <div className="form-group">
          <label>ชื่อประกาศ <span className="required">*</span></label>
              <input 
                type="text" 
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                placeholder="เช่น คอนโดหรู ริมแม่น้ำ"
            className={validationErrors.title ? 'error' : ''}
              />
          {validationErrors.title && (
            <span className="error-message">{validationErrors.title}</span>
          )}
            </div>

            <div className="form-group">
          <label>ราคา <span className="required">*</span></label>
                <input 
                  type="number" 
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  placeholder="ราคา"
            className={validationErrors.price ? 'error' : ''}
                />
          {validationErrors.price && (
            <span className="error-message">{validationErrors.price}</span>
          )}
              </div>

        <div className="form-group">
          <label>ประเภททรัพย์ <span className="required">*</span></label>
          <div className="property-type-grid">
            {propertyTypes.map(type => (
              <button
                key={type}
                type="button"
                className={`property-type-btn ${newListing.propertyType === type ? 'active' : ''}`}
                onClick={() => setNewListing({ ...newListing, propertyType: type })}
              >
                {type}
              </button>
            ))}
            </div>
          {validationErrors.propertyType && (
            <span className="error-message">{validationErrors.propertyType}</span>
          )}
          </div>

            <div className="form-row">
              <div className="form-group">
            <label>จำนวนห้องนอน</label>
                <input 
                  type="number" 
                  value={newListing.beds}
                  onChange={(e) => setNewListing({ ...newListing, beds: e.target.value })}
                  placeholder="จำนวนห้องนอน"
                />
              </div>
              <div className="form-group">
            <label>จำนวนห้องน้ำ</label>
                <input 
                  type="number" 
                  value={newListing.baths}
                  onChange={(e) => setNewListing({ ...newListing, baths: e.target.value })}
                  placeholder="จำนวนห้องน้ำ"
                />
              </div>
        </div>

              <div className="form-group">
          <label>พื้นที่ใช้สอย (ตร.ม.) <span className="required">*</span></label>
                <input 
                  type="number" 
                  value={newListing.size}
                  onChange={(e) => setNewListing({ ...newListing, size: e.target.value })}
            placeholder="พื้นที่ใช้สอย"
            className={validationErrors.size ? 'error' : ''}
                />
          {validationErrors.size && (
            <span className="error-message">{validationErrors.size}</span>
          )}
              </div>

        <div className="form-row">
          <div className="form-group">
            <label>ที่ดิน (ตร.ว.)</label>
            <input
              type="number"
              value={newListing.landSize}
              onChange={(e) => setNewListing({ ...newListing, landSize: e.target.value })}
              placeholder="ที่ดิน"
            />
            </div>
            <div className="form-group">
            <label>ปีที่สร้าง</label>
            <input
              type="number"
              value={newListing.yearBuilt}
              onChange={(e) => setNewListing({ ...newListing, yearBuilt: e.target.value })}
              placeholder="ปีที่สร้าง"
            />
          </div>
        </div>

        <div className="form-group">
          <label>รายละเอียดเพิ่มเติม</label>
              <textarea 
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                placeholder="อธิบายรายละเอียดเพิ่มเติม"
                rows="6"
              />
            </div>

        <div className="form-group">
          <label>สิ่งอำนวยความสะดวก</label>
          <div className="amenities-grid">
            {amenitiesList.map(amenity => (
              <label key={amenity} className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={newListing.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewListing({ ...newListing, amenities: [...newListing.amenities, amenity] });
                    } else {
                      setNewListing({ ...newListing, amenities: newListing.amenities.filter(a => a !== amenity) });
                    }
                  }}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Step 2: ที่ตั้ง
  const renderStep2 = () => {
    return (
      <div className="listing-step-content">
        <h3 className="step-title">ขั้นตอนที่ 2: ที่ตั้ง</h3>
        
            <div className="form-group">
          <label>ที่อยู่ <span className="required">*</span></label>
          <input
            type="text"
            value={newListing.address}
            onChange={(e) => setNewListing({ ...newListing, address: e.target.value })}
            placeholder="เช่น 123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110"
            className={validationErrors.address ? 'error' : ''}
          />
          {validationErrors.address && (
            <span className="error-message">{validationErrors.address}</span>
          )}
        </div>

        <div className="form-group">
          <label>แผนที่ (Google Maps Embed Code)</label>
          <textarea
            value={newListing.mapEmbed}
            onChange={(e) => setNewListing({ ...newListing, mapEmbed: e.target.value })}
            placeholder="วาง Google Maps Embed Code ที่นี่ (ไม่บังคับ)"
            rows="4"
          />
          <small className="form-hint">สามารถหา Embed Code ได้จาก Google Maps โดยคลิก Share → Embed a map</small>
        </div>
      </div>
    );
  };

  // Step 3: รูปภาพ
  const renderStep3 = () => {
    return (
      <div className="listing-step-content">
        <h3 className="step-title">ขั้นตอนที่ 3: รูปภาพ</h3>
        
        <div className="form-group">
          <label>อัปโหลดรูปภาพ <span className="required">*</span></label>
          <div 
            className="image-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              id="image-upload-input"
            />
            <label htmlFor="image-upload-input" className="image-upload-label">
              <Upload size={32} />
                <p>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก</p>
              <small>อัปโหลดได้สูงสุด 20 รูป (รูปแรกจะเป็นรูปหลัก)</small>
            </label>
              </div>
          {validationErrors.images && (
            <span className="error-message">{validationErrors.images}</span>
          )}
            </div>

        {newListing.images.length > 0 && (
          <div className="image-preview-grid">
            {newListing.images.map((image, index) => (
              <div key={index} className="image-preview-item">
                {index === 0 && <span className="primary-badge">รูปหลัก</span>}
                <img src={image} alt={`Preview ${index + 1}`} />
                <div className="image-preview-actions">
                  {index > 0 && (
                    <button
                      type="button"
                      className="image-action-btn"
                      onClick={() => handleImageReorder(index, index - 1)}
                      title="เลื่อนขึ้น"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="image-action-btn delete"
                    onClick={() => handleImageRemove(index)}
                    title="ลบ"
                  >
                    <X size={16} />
                  </button>
                  {index < newListing.images.length - 1 && (
                    <button
                      type="button"
                      className="image-action-btn"
                      onClick={() => handleImageReorder(index, index + 1)}
                      title="เลื่อนลง"
                    >
                      <ChevronRight size={16} />
                    </button>
                  )}
          </div>
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newListing.watermark.enabled}
              onChange={(e) => setNewListing({
                ...newListing,
                watermark: { ...newListing.watermark, enabled: e.target.checked }
              })}
            />
            <span>เปิดการใช้ลายน้ำ</span>
          </label>
          {newListing.watermark.enabled && (
            <div className="watermark-info-banner">
              <AlertCircle size={16} />
              <span>การตั้งค่าลายน้ำจะมีผลกับทุกประกาศของคุณ</span>
            </div>
          )}
        </div>

        {newListing.watermark.enabled && (
          <>
            <div className="form-group">
              <label>กรุณากรอกข้อมูลที่คุณต้องการแสดง</label>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ข้อความที่ 1</label>
                <div className="input-with-counter">
                  <input
                    type="text"
                    value={newListing.watermark.text1}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, 30);
                      setNewListing({
                        ...newListing,
                        watermark: { ...newListing.watermark, text1: text }
                      });
                    }}
                    maxLength={30}
                    placeholder="ข้อความที่ 1"
                  />
                  <span className="char-counter">{newListing.watermark.text1.length}/30</span>
                </div>
              </div>
              <div className="form-group">
                <label>ข้อความที่ 2</label>
                <div className="input-with-counter">
                  <input
                    type="text"
                    value={newListing.watermark.text2}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, 30);
                      setNewListing({
                        ...newListing,
                        watermark: { ...newListing.watermark, text2: text }
                      });
                    }}
                    maxLength={30}
                    placeholder="ข้อความที่ 2"
                  />
                  <span className="char-counter">{newListing.watermark.text2.length}/30</span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>กรุณาเลือกตำแหน่งของลายน้ำที่ต้องการ</label>
              <div className="watermark-position-grid">
                {['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'].map(pos => (
            <button 
                    key={pos}
                    type="button"
                    className={`watermark-position-btn ${newListing.watermark.position === pos ? 'active' : ''}`}
                    onClick={() => setNewListing({
                      ...newListing,
                      watermark: { ...newListing.watermark, position: pos }
                    })}
                  >
                    <div className="watermark-position-preview">
                      <div className={`watermark-preview-box ${pos}`}></div>
                    </div>
                    <span>
                      {pos === 'top-left' && 'บนซ้าย'}
                      {pos === 'top-right' && 'บนขวา'}
                      {pos === 'center' && 'ตรงกลาง'}
                      {pos === 'bottom-left' && 'ล่างซ้าย'}
                      {pos === 'bottom-right' && 'ล่างขวา'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Watermark Preview */}
            <div className="form-group">
              <label>ตัวอย่างแสดงลายน้ำ</label>
              <div className="watermark-preview-container">
                <div className="watermark-preview-image">
                  {newListing.images.length > 0 ? (
                    <img src={newListing.images[0]} alt="Watermark preview" />
                  ) : (
                    <div className="watermark-preview-placeholder">
                      <ImageIcon size={48} />
                      <p>อัปโหลดรูปภาพเพื่อดูตัวอย่างลายน้ำ</p>
                    </div>
                  )}
                  {newListing.watermark.enabled && (newListing.watermark.text1 || newListing.watermark.text2) && (
                    <div className={`watermark-overlay watermark-${newListing.watermark.position}`}>
                      <div className="watermark-content">
                        {newListing.watermark.text1 && (
                          <div className="watermark-text watermark-text1">{newListing.watermark.text1}</div>
                        )}
                        {newListing.watermark.text2 && (
                          <div className="watermark-text watermark-text2">{newListing.watermark.text2}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Step 4: ช่องทางติดต่อ
  const renderStep4 = () => {
    return (
      <div className="listing-step-content">
        <h3 className="step-title">ขั้นตอนที่ 4: ช่องทางติดต่อ</h3>
        <p className="step-description">กรุณากรอกช่องทางติดต่ออย่างน้อย 1 ช่องทาง</p>
        
        <div className="form-group">
          <label>ไลน์ (Line ID)</label>
          <input
            type="text"
            value={newListing.lineId}
            onChange={(e) => setNewListing({ ...newListing, lineId: e.target.value })}
            placeholder="Line ID"
          />
        </div>

        <div className="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input
            type="tel"
            value={newListing.phone}
            onChange={(e) => setNewListing({ ...newListing, phone: e.target.value })}
            placeholder="0xxxxxxxxx (9-10 หลัก)"
            className={validationErrors.phone ? 'error' : ''}
          />
          {validationErrors.phone && (
            <span className="error-message">{validationErrors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label>อีเมล</label>
          <input
            type="email"
            value={newListing.email}
            onChange={(e) => setNewListing({ ...newListing, email: e.target.value })}
            placeholder="email@example.com"
            className={validationErrors.email ? 'error' : ''}
          />
          {validationErrors.email && (
            <span className="error-message">{validationErrors.email}</span>
          )}
        </div>

        {validationErrors.contact && (
          <div className="error-message-block">{validationErrors.contact}</div>
        )}
      </div>
    );
  };

  // Step 5: สรุปประกาศ
  const renderStep5 = () => {
    return (
      <div className="listing-step-content">
        <h3 className="step-title">ขั้นตอนที่ 5: สรุปประกาศ</h3>
        
        <div className="summary-section">
          <h4>ข้อมูลทรัพย์</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">ประเภทการประกาศ:</span>
              <span className="summary-value">{newListing.listingType === 'sell' ? 'ขาย' : 'เช่า'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ชื่อประกาศ:</span>
              <span className="summary-value">{newListing.title || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ราคา:</span>
              <span className="summary-value">{newListing.price ? `฿${parseFloat(newListing.price).toLocaleString()}` : '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ประเภททรัพย์:</span>
              <span className="summary-value">{newListing.propertyType || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ห้องนอน/ห้องน้ำ:</span>
              <div className="summary-beds-baths">
                <div className="summary-icon-item">
                  <Bed size={18} />
                  <span className="summary-value">{newListing.beds || '0'}</span>
                </div>
                <div className="summary-icon-item">
                  <Bath size={18} />
                  <span className="summary-value">{newListing.baths || '0'}</span>
                </div>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-label">พื้นที่ใช้สอย:</span>
              <span className="summary-value">{newListing.size ? `${newListing.size} ตร.ม.` : '-'}</span>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h4>ที่ตั้ง</h4>
          <div className="summary-item">
            <span className="summary-label">ที่อยู่:</span>
            <span className="summary-value">{newListing.address || '-'}</span>
          </div>
        </div>

        <div className="summary-section">
          <h4>รูปภาพ</h4>
          <div className="summary-item">
            <span className="summary-label">จำนวนรูปภาพ:</span>
            <span className="summary-value">{newListing.images.length} รูป</span>
          </div>
          {newListing.images.length > 0 && (
            <div className="summary-images-grid">
              {newListing.images.map((image, index) => (
                <div key={index} className="summary-image-item">
                  {index === 0 && <span className="summary-primary-badge">รูปหลัก</span>}
                  <img src={image} alt={`Summary ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="summary-section">
          <h4>ช่องทางติดต่อ</h4>
          <div className="summary-grid">
            {newListing.lineId && (
              <div className="summary-item">
                <span className="summary-label">Line ID:</span>
                <span className="summary-value">{newListing.lineId}</span>
              </div>
            )}
            {newListing.phone && (
              <div className="summary-item">
                <span className="summary-label">เบอร์โทรศัพท์:</span>
                <span className="summary-value">{newListing.phone}</span>
              </div>
            )}
            {newListing.email && (
              <div className="summary-item">
                <span className="summary-label">อีเมล:</span>
                <span className="summary-value">{newListing.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>สถานะการเผยแพร่ <span className="required">*</span></label>
          <div className="publish-status-buttons">
            <button
              type="button"
              className={`publish-status-btn ${newListing.publishStatus === 'publish' ? 'active' : ''}`}
              onClick={() => setNewListing({ ...newListing, publishStatus: 'publish' })}
            >
              <CheckCircle2 size={20} />
              <div>
                <strong>เผยแพร่ทันที</strong>
                <small>ประกาศจะแสดงในระบบทันที (อายุ 90 วัน)</small>
              </div>
            </button>
            <button
              type="button"
              className={`publish-status-btn ${newListing.publishStatus === 'draft' ? 'active' : ''}`}
              onClick={() => setNewListing({ ...newListing, publishStatus: 'draft' })}
            >
              <FileText size={20} />
              <div>
                <strong>บันทึกเป็นร่าง</strong>
                <small>เก็บไว้เพื่อแก้ไขและเผยแพร่ภายหลัง</small>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Create Listing Page View
  const renderCreateListingPage = () => {
    const renderCurrentStep = () => {
      switch (listingStep) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep4();
        case 5: return renderStep5();
        default: return renderStep1();
      }
    };

    return (
      <div className="create-listing-page">
        <div className="create-listing-header">
          <button 
            className="btn-back"
              onClick={() => {
              if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการออก? ข้อมูลที่กรอกจะไม่ถูกบันทึก')) {
                setShowCreateListingPage(false);
                setListingStep(1);
                setEditingListingId(null);
                setNewListing({
                  listingType: '',
                  title: '',
                  price: '',
                  propertyType: '',
                  beds: '',
                  baths: '',
                  size: '',
                  landSize: '',
                  yearBuilt: '',
                  description: '',
                  amenities: [],
                  address: '',
                  mapEmbed: '',
                  images: [],
                  watermark: {
                    enabled: false,
                    text1: '',
                    text2: '',
                    position: 'center'
                  },
                  lineId: '',
                  phone: '',
                  email: '',
                  publishStatus: 'publish'
                });
                setValidationErrors({});
              }
            }}
          >
            <ArrowLeft size={20} />
            <span>กลับ</span>
          </button>
        </div>

        <div className="create-listing-content">
          {renderProgressIndicator()}
          
          <div className="create-listing-form">
            {renderCurrentStep()}
            
            <div className="form-actions">
              {listingStep > 1 && (
                <button 
                  className="btn-secondary"
                  onClick={handlePrevStep}
                >
                  <ChevronLeft size={18} />
                  ย้อนกลับ
                </button>
              )}
              <div className="form-actions-right">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิก? ข้อมูลที่กรอกจะไม่ถูกบันทึก')) {
                      setShowCreateListingPage(false);
                      setListingStep(1);
                      setEditingListingId(null);
                      setValidationErrors({});
                    }
              }}
            >
              ยกเลิก
            </button>
            <button 
              className="btn-primary"
                  onClick={handleNextStep}
            >
                  {listingStep === 5 ? (editingListingId ? 'ยืนยันการแก้ไข' : 'ยืนยันและบันทึก') : 'ถัดไป'}
                  {listingStep < 5 && <ChevronRight size={18} />}
            </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  // Filter function
  const filterListings = (listingList) => {
    return listingList.filter(listing => {
      // Filter by price
      if (filters.priceMin && listing.price < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && listing.price > parseFloat(filters.priceMax)) return false;
      
      // Filter by beds
      if (filters.beds && listing.beds !== parseInt(filters.beds)) return false;
      
      // Filter by size
      if (filters.sizeMin && listing.size < parseFloat(filters.sizeMin)) return false;
      if (filters.sizeMax && listing.size > parseFloat(filters.sizeMax)) return false;
      
      // Filter by allow pets (if listing has allowPets property)
      if (filters.allowPets !== '' && listing.allowPets !== (filters.allowPets === 'true')) return false;
      
      // Filter by near expiry (within 7 days)
      if (filters.nearExpiry && listing.expiryDate) {
        const expiryDate = new Date(listing.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry > 7 || daysUntilExpiry < 0) return false;
      }
      
      return true;
    });
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      beds: '',
      sizeMin: '',
      sizeMax: '',
      allowPets: '',
      nearExpiry: false
    });
  };

  const hasActiveFilters = () => {
    return filters.priceMin || filters.priceMax || filters.beds || 
           filters.sizeMin || filters.sizeMax || filters.allowPets !== '' || filters.nearExpiry;
  };

  // Listings View
  const renderListings = () => {
    const filteredListings = filterListings(listings.filter(l => l.status !== 'draft'));
    
    return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>ทรัพย์สิน</h2>
          <p>จัดการและเพิ่มประกาศทรัพย์สินของคุณ</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>กรอง</span>
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card-section">
          <div className="filter-panel">
            <div className="filter-header">
              <h3>กรองประกาศ</h3>
              {hasActiveFilters() && (
                <button className="btn-link" onClick={clearFilters}>
                  ล้างการกรอง
                </button>
              )}
            </div>
            <div className="filter-grid">
              {/* Price Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <TrendingUp size={16} />
                  <span>กรองตามราคา</span>
                </label>
                <div className="filter-range">
                  <input
                    type="number"
                    placeholder="ราคาต่ำสุด"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  />
                  <span className="filter-separator">ถึง</span>
                  <input
                    type="number"
                    placeholder="ราคาสูงสุด"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  />
                </div>
              </div>

              {/* Beds Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Bed size={16} />
                  <span>กรองตามจำนวนห้องนอน</span>
                </label>
                <select
                  value={filters.beds}
                  onChange={(e) => setFilters({...filters, beds: e.target.value})}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="1">1 ห้องนอน</option>
                  <option value="2">2 ห้องนอน</option>
                  <option value="3">3 ห้องนอน</option>
                  <option value="4">4 ห้องนอน</option>
                  <option value="5">5+ ห้องนอน</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Building2 size={16} />
                  <span>กรองตามพื้นที่ (ตร.ม.)</span>
                </label>
                <div className="filter-range">
                  <input
                    type="number"
                    placeholder="พื้นที่ต่ำสุด"
                    value={filters.sizeMin}
                    onChange={(e) => setFilters({...filters, sizeMin: e.target.value})}
                  />
                  <span className="filter-separator">ถึง</span>
                  <input
                    type="number"
                    placeholder="พื้นที่สูงสุด"
                    value={filters.sizeMax}
                    onChange={(e) => setFilters({...filters, sizeMax: e.target.value})}
                  />
                </div>
              </div>

              {/* Allow Pets Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Heart size={16} />
                  <span>กรองตามการอนุญาตเลี้ยงสัตว์</span>
                </label>
                <select
                  value={filters.allowPets}
                  onChange={(e) => setFilters({...filters, allowPets: e.target.value})}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="true">อนุญาต</option>
                  <option value="false">ไม่อนุญาต</option>
                </select>
              </div>

              {/* Near Expiry Filter */}
              <div className="filter-group filter-group-checkbox">
                <label className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.nearExpiry}
                    onChange={(e) => setFilters({...filters, nearExpiry: e.target.checked})}
                  />
                  <Clock size={16} />
                  <span>แสดงเฉพาะประกาศใกล้หมดอายุ (ภายใน 7 วัน)</span>
                </label>
              </div>
            </div>
            {hasActiveFilters() && (
              <div className="filter-results">
                <span>พบ {filteredListings.length} รายการ</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Draft Listings Section */}
      {listings.filter(l => l.status === 'draft').length > 0 && (
        <div className="card-section">
          <div className="section-header">
            <h3>ประกาศแบบร่าง</h3>
            <span className="draft-count">{listings.filter(l => l.status === 'draft').length} ร่าง</span>
          </div>
          <div className="draft-listings-grid">
            {listings.filter(l => l.status === 'draft').map(listing => (
              <div key={listing.id} className="draft-listing-card">
                <div className="draft-listing-header">
                  <div className="draft-listing-info">
                    <div className="property-icon-small">{getPropertyIcon(listing.propertyType, listing.type)}</div>
                    <div>
                      <h4 className="draft-listing-title">{listing.title || 'ไม่มีชื่อ'}</h4>
                      <p className="draft-listing-location">
                        <MapPin size={12} /> {listing.location || 'ยังไม่ได้ระบุที่อยู่'}
                      </p>
                    </div>
                  </div>
                  <span className="badge warning">📝 ร่าง</span>
                </div>
                <div className="draft-listing-details">
                  <div className="draft-detail-item">
                    <span className="draft-label">ประเภท:</span>
                    <span className="draft-value">{listing.type === 'sell' ? 'ขาย' : 'เช่า'}</span>
                  </div>
                  {listing.price && (
                    <div className="draft-detail-item">
                      <span className="draft-label">ราคา:</span>
                      <span className="draft-value">
                        {listing.type === 'sell' 
                          ? `฿${parseFloat(listing.price).toLocaleString()}` 
                          : `฿${parseFloat(listing.price).toLocaleString()}/เดือน`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="draft-listing-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleEditListing(listing.id)}
                  >
                    <Edit2 size={14} />
                    แก้ไข
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setListings(listings.map(l => 
                        l.id === listing.id 
                          ? { ...l, status: 'active', expiryDate: getExpiryDate90Days() }
                          : l
                      ));
                      alert('เผยแพร่ประกาศสำเร็จ!');
                    }}
                  >
                    <Eye size={14} />
                    เผยแพร่
                  </button>
                  <button 
                    className="btn-icon"
                    onClick={() => handleDeleteListing(listing.id)}
                    title="ลบ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-section">
        <div className="listings-table">
          <table>
            <thead>
              <tr>
                <th>ทรัพย์สิน</th>
                <th>ประเภท</th>
                <th>ราคา</th>
                <th>หมดอายุ</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map(listing => (
                <tr key={listing.id}>
                  <td>
                    <div className="table-property">
                      <div className="property-icon">{getPropertyIcon(listing.propertyType, listing.type)}</div>
                      <div>
                        <p className="property-name">{listing.title}</p>
                        <p className="property-location"><MapPin size={12} /> {listing.location}</p>
                      </div>
                    </div>
                  </td>
                  <td>{listing.type === 'sell' ? 'ขาย' : 'เช่า'}</td>
                  <td>
                    <strong>
                      {listing.type === 'sell' ? '฿' + listing.price.toLocaleString() : '฿' + listing.price.toLocaleString() + '/เดือน'}
                    </strong>
                  </td>
                  <td className="expiry-cell">{formatExpiryDate(listing.expiryDate)}</td>
                  <td className="status-cell">
                    <span className={`badge ${
                      listing.status === 'active' ? 'success' : 
                      listing.status === 'draft' ? 'warning' : 
                      listing.status === 'closed' ? 'secondary' :
                      listing.status === 'pending_review' ? 'warning' :
                      'danger'
                    }`}>
                      {listing.status === 'active' ? '✓ ใช้งาน' : 
                       listing.status === 'draft' ? '📝 ร่าง' : 
                       listing.status === 'closed' ? '💰 ปิดการขาย' :
                       listing.status === 'pending_review' ? '⚠️ รอแก้ไข' :
                       '✕ หมดอายุ'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="แก้ไข"
                        onClick={() => handleEditListing(listing.id)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon" 
                        title="ลบ"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                      {listing.status === 'expired' && (
                        <button 
                          className="btn-icon" 
                          title="รีโพสต์"
                          onClick={() => handleRepostListing(listing.id)}
                        >
                          <RotateCw size={16} />
                        </button>
                      )}
                      {listing.status === 'active' && (
                        <>
                          <button 
                            className="btn-icon" 
                            title="ปิดการขาย"
                            onClick={() => {
                              if (window.confirm('คุณต้องการปิดการขายประกาศนี้หรือไม่?')) {
                                setListings(listings.map(l => 
                                  l.id === listing.id ? { ...l, status: 'closed' } : l
                                ));
                                alert('ปิดการขายประกาศสำเร็จ');
                              }
                            }}
                          >
                            <X size={16} />
                          </button>
                          <button 
                            className="btn-icon" 
                            title="สร้างสัญญา"
                            onClick={() => {
                              setContractData({ ...contractData, propertyId: listing.id });
                              setShowContractModal(true);
                            }}
                          >
                            <FileText size={16} />
                          </button>
                        </>
                      )}
                      {listing.status === 'closed' && (
                        <button 
                          className="btn-icon" 
                          title="เปิดการขายอีกครั้ง"
                          onClick={() => {
                            if (window.confirm('คุณต้องการเปิดการขายประกาศนี้อีกครั้งหรือไม่?')) {
                              setListings(listings.map(l => 
                                l.id === listing.id ? { ...l, status: 'active' } : l
                              ));
                              alert('เปิดการขายประกาศสำเร็จ');
                            }
                          }}
                        >
                          <RotateCw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  // Analytics View
  const getChartData = () => {
    const allData = {
      '7': [
        { date: 'วันจันทร์', views: 240, saves: 85, contacts: 24 },
        { date: 'วันอังคาร', views: 421, saves: 98, contacts: 35 },
        { date: 'วันพุธ', views: 380, saves: 125, contacts: 38 },
        { date: 'วันพฤหัสบดี', views: 520, saves: 156, contacts: 52 },
        { date: 'วันศุกร์', views: 680, saves: 182, contacts: 68 },
        { date: 'วันเสาร์', views: 590, saves: 165, contacts: 45 },
        { date: 'วันอาทิตย์', views: 750, saves: 198, contacts: 75 }
      ],
      '14': [
        { date: 'วัน 1', views: 240, saves: 85, contacts: 24 },
        { date: 'วัน 2', views: 421, saves: 98, contacts: 35 },
        { date: 'วัน 3', views: 380, saves: 125, contacts: 38 },
        { date: 'วัน 4', views: 520, saves: 156, contacts: 52 },
        { date: 'วัน 5', views: 680, saves: 182, contacts: 68 },
        { date: 'วัน 6', views: 590, saves: 165, contacts: 45 },
        { date: 'วัน 7', views: 750, saves: 198, contacts: 75 },
        { date: 'วัน 8', views: 820, saves: 215, contacts: 82 },
        { date: 'วัน 9', views: 680, saves: 178, contacts: 65 },
        { date: 'วัน 10', views: 920, saves: 245, contacts: 95 },
        { date: 'วัน 11', views: 850, saves: 210, contacts: 78 },
        { date: 'วัน 12', views: 780, saves: 190, contacts: 72 },
        { date: 'วัน 13', views: 650, saves: 170, contacts: 58 },
        { date: 'วัน 14', views: 950, saves: 260, contacts: 98 }
      ],
      '30': [
        { date: '1-5 พ.ย.', views: 1200, saves: 420, contacts: 120 },
        { date: '6-10 พ.ย.', views: 1850, saves: 580, contacts: 185 },
        { date: '11-15 พ.ย.', views: 2100, saves: 650, contacts: 210 },
        { date: '16-20 พ.ย.', views: 1950, saves: 620, contacts: 195 },
        { date: '21-25 พ.ย.', views: 2300, saves: 720, contacts: 240 },
        { date: '26-30 พ.ย.', views: 2050, saves: 680, contacts: 210 }
      ],
      '90': [
        { date: 'ก.ย.', views: 5200, saves: 1620, contacts: 520 },
        { date: 'ต.ค.', views: 6800, saves: 2100, contacts: 680 },
        { date: 'พ.ย.', views: 7200, saves: 2300, contacts: 750 }
      ]
    };
    return allData[analyticsPeriod] || allData['7'];
  };

  const chartData = getChartData();

  const propertyTypeData = [
    { name: 'ขาย', value: listings.filter(l => l.type === 'sell').length, color: '#3B82F6' },
    { name: 'เช่า', value: listings.filter(l => l.type === 'rent').length, color: '#10B981' }
  ];

  const renderAnalytics = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>วิเคราะห์ประกาศ</h2>
          <p>ติดตามประสิทธิผลของประกาศ</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card-section full-width-stats">
          <div className="section-header">
            <h3>สรุปสถิติสำคัญ</h3>
          </div>
          
          <div className="stats-cards-grid-2x2">
            <div className="stat-card-2x2 blue">
              <div className="stat-card-2x2-top">
                <div className="stat-card-2x2-icon">👁</div>
                <div className="stat-card-2x2-label">ยอดดูทั้งหมด</div>
              </div>
              <div className="stat-card-2x2-value">{stats.totalViews.toLocaleString()}</div>
              <div className="stat-card-2x2-description">จำนวนครั้งที่ผู้ใช้เข้าดูประกาศของคุณ</div>
            </div>

            <div className="stat-card-2x2 green">
              <div className="stat-card-2x2-top">
                <div className="stat-card-2x2-icon">💚</div>
                <div className="stat-card-2x2-label">ยอดสนใจ</div>
              </div>
              <div className="stat-card-2x2-value">{stats.totalSaves.toLocaleString()}</div>
              <div className="stat-card-2x2-description">จำนวนคนที่บันทึกประกาศของคุณ</div>
            </div>

            <div className="stat-card-2x2 orange">
              <div className="stat-card-2x2-top">
                <div className="stat-card-2x2-icon">📞</div>
                <div className="stat-card-2x2-label">ยอดติดต่อ</div>
              </div>
              <div className="stat-card-2x2-value">{stats.totalContacts.toLocaleString()}</div>
              <div className="stat-card-2x2-description">จำนวนผู้ที่สนใจและติดต่อมา</div>
            </div>

            <div className="stat-card-2x2 purple">
              <div className="stat-card-2x2-top">
                <div className="stat-card-2x2-icon">📈</div>
                <div className="stat-card-2x2-label">อัตราการแปลง</div>
              </div>
              <div className="stat-card-2x2-value">{((stats.totalContacts / Math.max(stats.totalViews, 1)) * 100).toFixed(1)}%</div>
              <div className="stat-card-2x2-description">เปอร์เซ็นต์ผู้ดูที่ติดต่อ</div>
            </div>
          </div>
        </div>

        <div className="card-section large">
          <div className="section-header">
            <h3>{analyticsPeriod === '7' ? 'ภาพรวม' : `สถิติ ${analyticsPeriod === '14' ? '14 วัน' : analyticsPeriod === '30' ? '1 เดือน' : '3 เดือน'}ล่าสุด`}</h3>
            <select 
              className="period-select"
              value={analyticsPeriod}
              onChange={(e) => setAnalyticsPeriod(e.target.value)}
            >
              <option value="7">7 วัน</option>
              <option value="14">14 วัน</option>
              <option value="30">1 เดือน</option>
              <option value="90">3 เดือน</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="colorSaves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" fontSize={12} stroke="#718096" />
                <YAxis fontSize={12} stroke="#718096" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="views" 
                  fill="url(#colorViews)" 
                  name="ยอดดู"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList 
                    dataKey="views" 
                    position="top" 
                    formatter={(value) => value.toLocaleString()}
                    style={{ fontSize: '11px', fill: '#3B82F6', fontWeight: 600 }}
                  />
                </Bar>
                <Bar 
                  dataKey="saves" 
                  fill="url(#colorSaves)" 
                  name="ยอดสนใจ"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList 
                    dataKey="saves" 
                    position="top" 
                    formatter={(value) => value.toLocaleString()}
                    style={{ fontSize: '11px', fill: '#10B981', fontWeight: 600 }}
                  />
                </Bar>
                <Bar 
                  dataKey="contacts" 
                  fill="url(#colorContacts)" 
                  name="ยอดติดต่อ"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList 
                    dataKey="contacts" 
                    position="top" 
                    formatter={(value) => value.toLocaleString()}
                    style={{ fontSize: '11px', fill: '#F97316', fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <h3>คำแนะนำเพื่อเพิ่มยอดสนใจ</h3>
        </div>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">📸</div>
            <h4>อัปโหลดรูปภาพคุณภาพสูง</h4>
            <p>รูปภาพชัดใหญ่ช่วยเพิ่มยอดดู 70%</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📝</div>
            <h4>เขียนรายละเอียด</h4>
            <p>ข้อมูลครบถ้วนลดคำถามผู้สนใจ</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💬</div>
            <h4>ตอบแชทรวดเร็ว</h4>
            <p>ตอบจากในชั่วโมงแรก = สัญญาเพิ่ม 50%</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h4>รีโพสต์ประกาศ</h4>
            <p>รีโพสต์ทุก 3 เดือน รักษาความเด่น</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Chat View
  const renderChat = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>ข้อความ</h2>
          <p>ติดต่อสื่อสารกับผู้สนใจ</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-list">
          <div className="chat-list-header">
            <h3>Inbox</h3>
            <span className="unread-count">2</span>
          </div>
          <div className="chat-list-content">
            <div 
              className={`chat-item ${selectedChatId === 1 ? 'active' : ''}`}
              onClick={() => setSelectedChatId(1)}
            >
              <div className="chat-avatar">N</div>
              <div className="chat-info">
                <p className="chat-name">นายสินธ์ กิจการ</p>
                <p className="chat-preview">สนใจเช่าคอนโดนี้ได้ไหม?</p>
              </div>
              <span className="chat-time">10:30</span>
            </div>
            <div 
              className={`chat-item ${selectedChatId === 2 ? 'active' : ''}`}
              onClick={() => setSelectedChatId(2)}
            >
              <div className="chat-avatar">S</div>
              <div className="chat-info">
                <p className="chat-name">สมศรี อินทร์เสม</p>
                <p className="chat-preview">ราคากรรมสิทธิ์เท่าไหร่?</p>
              </div>
              <span className="chat-time">09:15</span>
            </div>
          </div>
        </div>

        <div className="chat-window">
          {selectedChatId ? (
            <>
              <div className="chat-window-header">
                <div className="chat-header-info">
                  <h3>{selectedChatId === 1 ? 'นายสินธ์ กิจการ' : 'สมศรี อินทร์เสม'}</h3>
                  <p>กำลังออนไลน์</p>
                </div>
              </div>

              <div className="messages-container">
                {chatMessages[selectedChatId]?.map((msg) => (
                  <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <input 
                  type="text" 
                  value={messages}
                  onChange={(e) => setMessages(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="พิมพ์ข้อความ..."
                  className="message-input"
                />
                <button className="btn-send" onClick={handleSendMessage}>
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <MessageCircle size={48} />
              <p>📬 เลือกแชทเพื่อเริ่มสนทนา</p>
              <p className="text-muted">เลือกแชทจากรายการทางซ้าย</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Contracts View
  const renderContracts = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>สัญญาดิจิทัล</h2>
          <p>บริหารสัญญา E-Contract ของคุณ</p>
        </div>
        <button className="btn-primary" onClick={() => setShowContractModal(true)}>
          <Plus size={18} /> สร้างสัญญาใหม่
        </button>
      </div>

      <div className="card-section">
        <div className="contracts-list">
          <div className="contract-item">
            <div className="contract-header">
              <div className="contract-info">
                <h4>สัญญาเช่า - คอนโดหรู ริมแม่น้ำ</h4>
                <p>ผู้เช่า: นายสินธ์ กิจการ</p>
              </div>
              <div className="contract-status">
                <span className="badge success">✓ ทั้งฝ่ายเซ็นแล้ว</span>
              </div>
            </div>
            <div className="contract-details">
              <div className="detail-item">
                <span>ระยะเวลาเช่า:</span>
                <strong>12 เดือน</strong>
              </div>
              <div className="detail-item">
                <span>ค่าเช่ารายเดือน:</span>
                <strong>฿45,000</strong>
              </div>
              <div className="detail-item">
                <span>เงินมัดจำ:</span>
                <strong>฿135,000</strong>
              </div>
              <div className="detail-item">
                <span>วันที่สร้าง:</span>
                <strong>24 พ.ย. 2568</strong>
              </div>
            </div>
            <div className="contract-actions">
              <button className="btn-secondary"><Download size={16} /> ดาวน์โหลด</button>
              <button className="btn-secondary"><Eye size={16} /> ดู</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Guide View
  const renderGuide = () => {
    const guideSections = [
      {
        id: 'listing',
        title: 'วิธีลงประกาศบนเว็บไซต์และแอปฯ',
        icon: <Plus size={24} />,
        content: (
          <div className="guide-section-content">
            <div className="guide-subsection">
              <h4>ประโยชน์ของการยืนยันตัวตน</h4>
              <ul>
                <li><strong>โปรไฟล์ที่เชื่อถือได้</strong> - แสดงสัญลักษณ์ "Verified"</li>
                <li><strong>เพิ่มความมั่นใจให้ผู้สนใจ</strong> - ลดโอกาสถูกมองว่าเป็นประกาศไม่จริง</li>
                <li><strong>ใช้งานฟีเจอร์ได้เต็มรูปแบบ</strong>
                  <ul>
                    <li>สร้างสัญญาดิจิทัล (E-Contract)</li>
                    <li>เซ็นสัญญาออนไลน์</li>
                    <li>ระบบแจ้งเตือนและแชทในระบบ</li>
                    <li>จัดการประกาศอย่างละเอียด</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="guide-subsection">
              <h4>ขั้นตอนการลงประกาศ (5 ขั้นตอน)</h4>
              <ol>
                <li><strong>คลิกปุ่ม "เพิ่มประกาศใหม่"</strong>
                  <p>ไปที่เมนู "รายการประกาศ" → คลิก "เพิ่มประกาศใหม่" หรือ "สร้างประกาศ"</p>
                </li>
                <li><strong>กรอกข้อมูลทรัพย์สิน</strong>
                  <p>ประเภทอสังหาริมทรัพย์, ราคา, พื้นที่, จำนวนห้องนอน, ห้องน้ำ, ที่ตั้ง</p>
                </li>
                <li><strong>อัปโหลดรูปภาพ</strong>
                  <p>ขั้นต่ำ 3 รูป - เลือกรูปภาพหลักที่จะแสดงเป็นภาพปก</p>
                </li>
                <li><strong>ระบุตำแหน่งบนแผนที่</strong>
                  <p>ปักหมุดตำแหน่งทรัพย์สินบนแผนที่</p>
                </li>
                <li><strong>ตรวจสอบและยืนยัน</strong>
                  <p>ตรวจสอบข้อมูลทั้งหมด - คลิก "ยืนยันการสร้างประกาศ" หรือ "เผยแพร่ประกาศ"</p>
                </li>
              </ol>
            </div>
          </div>
        )
      },
      {
        id: 'rules',
        title: 'กฎระเบียบและกติกา ในการระงับหรือปิดประกาศ ที่เกิดจากการถูกรายงาน',
        icon: <AlertCircle size={24} />,
        content: (
          <div className="guide-section-content">
            <div className="guide-subsection">
              <h4>วัตถุประสงค์</h4>
              <p>เพื่อให้ประกาศมีคุณภาพและความถูกต้องมากขึ้น</p>
            </div>

            <div className="guide-subsection">
              <h4>กระบวนการจัดการประกาศที่ถูกรายงาน</h4>
              <ul>
                <li>ระบบจะระงับการแสดงผลอัตโนมัติ</li>
                <li>ย้ายไปยังหมวดหมู่ "รอแก้ไข" หรือ "ปิดการขาย"</li>
                <li>ผู้ใช้สามารถแก้ไขหรือติดต่อทีมงานเพื่อขอความช่วยเหลือ</li>
              </ul>
            </div>

            <div className="guide-subsection">
              <h4>กฎระเบียบและกติกา (4 ข้อ)</h4>
              <ol>
                <li><strong>รายงานว่า "ขายหรือให้เช่าแล้ว" มากกว่า 2 ครั้ง</strong> หรือผู้ใช้ให้หลักฐานที่ยืนยันได้ว่าขายหรือให้เช่าแล้ว
                  <p className="guide-note">→ ระบบจะปิดประกาศอัตโนมัติ</p>
                </li>
                <li><strong>รายงานว่า "ราคาไม่ถูกต้อง"</strong>
                  <p className="guide-note">→ ระบบจะย้ายประกาศไปยังหมวด "รอแก้ไข"</p>
                </li>
                <li><strong>รายงานว่า "ใช้ภาพหรือข้อมูลของผู้อื่นโดยไม่ได้รับอนุญาต"</strong>
                  <p className="guide-note">→ ระบบจะย้ายประกาศไปยังหมวด "รอแก้ไข"</p>
                </li>
                <li><strong>รายงานและระบบพบว่า "ราคาที่ระบุในระบบและรายละเอียดไม่ตรงกัน"</strong>
                  <p className="guide-note">→ ระบบจะย้ายประกาศไปยังหมวด "รอแก้ไข"</p>
                </li>
              </ol>
            </div>

            <div className="guide-subsection">
              <h4>การป้องกันการรายงานเท็จ</h4>
              <ul>
                <li>ระบบมีทีมงานตรวจสอบและป้องกันการรายงานด้วยเจตนาร้าย</li>
                <li>ผู้รายงานต้องเข้าสู่ระบบ ทำให้ทราบตัวตนได้</li>
                <li>การรายงานเท็จเป็นความผิดทางกฎหมาย</li>
                <li>หากพบว่าการรายงานเป็นความเข้าใจผิด หรือข้อมูลประกาศของผู้ใช้ไม่ผิดกฎหมาย ระบบจะนำประกาศกลับมาแสดงผลตามปกติโดยไม่เสียค่าธรรมเนียมการลงประกาศใหม่</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'watermark',
        title: 'Watermark ใส่ภาพลายน้ำเพื่อป้องกันลิขสิทธิ์ภาพ',
        icon: <Shield size={24} />,
        content: (
          <div className="guide-section-content">
            <div className="guide-subsection">
              <h4>วัตถุประสงค์</h4>
              <p>ป้องกันการนำภาพไปใช้โดยไม่ได้ขออนุญาต</p>
            </div>

            <div className="guide-subsection">
              <h4>ฟีเจอร์</h4>
              <ul>
                <li>เลือกรูปแบบข้อความได้</li>
                <li>เลือกตำแหน่งของลายน้ำได้</li>
                <li>ป้องกันการปลอมแปลง หรือนำภาพไปใช้โดยไม่ได้รับอนุญาต</li>
                <li>ทำเองได้ ใช้งานง่าย ไม่ยุ่งยาก</li>
              </ul>
            </div>

            <div className="guide-subsection">
              <h4>คำเตือน</h4>
              <div className="guide-warning">
                <AlertCircle size={20} />
                <p>การคัดลอกภาพและนำมาใช้โดยไม่ได้รับอนุญาต มีความผิดทั้งทางแพ่งและอาญา</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'filter',
        title: 'MyStock Filter - สำหรับคนมีประกาศเยอะๆ',
        icon: <Search size={24} />,
        content: (
          <div className="guide-section-content">
            <div className="guide-subsection">
              <h4>วัตถุประสงค์</h4>
              <p>ช่วยให้ค้นหาประกาศได้ง่ายขึ้น สำหรับผู้ที่มีประกาศเยอะๆ</p>
            </div>

            <div className="guide-subsection">
              <h4>ฟีเจอร์การกรอง</h4>
              <ul>
                <li><strong>กรองตามราคา</strong> - ค้นหาประกาศตามช่วงราคาที่ต้องการ</li>
                <li><strong>กรองตามจำนวนห้องนอน</strong> - เลือกจำนวนห้องนอนที่ต้องการ</li>
                <li><strong>กรองตามพื้นที่</strong> - ระบุช่วงพื้นที่ที่ต้องการ</li>
                <li><strong>กรองตามการอนุญาตเลี้ยงสัตว์</strong> - เลือกประกาศที่อนุญาตหรือไม่อนุญาตเลี้ยงสัตว์</li>
                <li><strong>กรองตามประกาศใกล้หมดอายุ</strong> - แสดงรายการที่ใกล้หมดอายุภายใน 7 วัน</li>
              </ul>
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="dashboard-wrapper">
        <div className="page-header">
          <div className="page-header-content">
            <h2>คู่มือการใช้งาน</h2>
            <p>เรียนรู้วิธีใช้งานระบบและฟีเจอร์ต่างๆ</p>
          </div>
        </div>

        <div className="guide-container">
          <div className="guide-sidebar">
            <h3>หัวข้อ</h3>
            <nav className="guide-nav">
              {guideSections.map((section) => (
                <button
                  key={section.id}
                  className={`guide-nav-item ${activeGuideSection === section.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveGuideSection(section.id);
                    // Scroll animation
                    setTimeout(() => {
                      const element = document.querySelector(`.guide-content-section[data-section="${section.id}"]`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                  <span className="guide-nav-icon">{section.icon}</span>
                  <span className="guide-nav-text">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="guide-main">
            {guideSections.map((section) => (
              <div
                key={section.id}
                className={`guide-content-section ${activeGuideSection === section.id ? 'active' : ''}`}
                data-section={section.id}
              >
                <div className="guide-section-header">
                  <div className="guide-section-icon">{section.icon}</div>
                  <h3>{section.title}</h3>
                </div>
                <div className="guide-section-body">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Profile View
  const renderProfile = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>โปรไฟล์</h2>
          <p>ข้อมูลโปรไฟล์ของคุณ</p>
        </div>
        <button className="btn-primary" onClick={() => setShowProfileModal(true)}>
          <Edit2 size={18} /> แก้ไขโปรไฟล์
        </button>
      </div>

      <div className="card-section">
        <div className="profile-header">
          <div className="profile-avatar-large" style={{ position: 'relative' }}>
            {profileData.profileImage ? (
              <img src={profileData.profileImage} alt={profileData.name} />
            ) : (
              <div className="avatar-placeholder-large">{profileData.name.charAt(0).toUpperCase()}</div>
            )}
            {profileData.verified && (
              <span className="verify-badge" style={{ 
                position: 'absolute', 
                bottom: '-8px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                fontSize: '11px', 
                padding: '4px 10px',
                whiteSpace: 'nowrap',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}>
                <CheckCircle2 size={12} />
                <span>ยืนยันตัวตนแล้ว</span>
              </span>
            )}
          </div>
          <div className="profile-info">
            <h3 style={{ margin: 0 }}>{profileData.name}</h3>
            <p className="profile-type">{profileData.userType === 'agent' ? 'นายหน้าอสังหาริมทรัพย์' : 'เจ้าของทรัพย์'}</p>
            {profileData.rating > 0 && (
              <div className="rating-badge">
                ⭐ {profileData.rating.toFixed(1)} ({profileData.reviewCount} รีวิว)
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <h3>ข้อมูลติดต่อ</h3>
        </div>
        <div className="profile-details">
          <div className="detail-row">
            <label>
              <span>📧</span> อีเมล
            </label>
            <p>{profileData.email}</p>
          </div>
          <div className="detail-row">
            <label>
              <span>📱</span> เบอร์โทรศัพท์
            </label>
            <p>{profileData.phone}</p>
          </div>
        </div>
      </div>

      {profileData.bio && (
        <div className="card-section">
          <div className="section-header">
            <h3>ประวัติโดยย่อ</h3>
          </div>
          <div className="profile-bio">
            <p>{profileData.bio}</p>
          </div>
        </div>
      )}

      <div className="card-section">
        <div className="section-header">
          <h3>ภาพรวม</h3>
        </div>
        <div className="quick-stats-grid">
          <div className="quick-stat-card purple">
            <div className="stat-icon-wrapper">
              <div className="stat-icon purple">
                <BarChart3 size={24} />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-label">ประกาศทั้งหมด</div>
              <div className="stat-value">{stats.activeListings}</div>
            </div>
          </div>
          <div className="quick-stat-card blue">
            <div className="stat-icon-wrapper">
              <div className="stat-icon blue">
                <Eye size={24} />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-label">ยอดดูทั้งหมด</div>
              <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
            </div>
          </div>
          <div className="quick-stat-card green">
            <div className="stat-icon-wrapper">
              <div className="stat-icon green">
                <Heart size={24} />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-label">ยอดสนใจ</div>
              <div className="stat-value">{stats.totalSaves.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Listings Section */}
      {listings.filter(l => l.status === 'active').length > 0 && (
        <div className="card-section">
          <div className="section-header">
            <h3>ประกาศที่กำลังใช้งาน</h3>
            <span className="draft-count">{listings.filter(l => l.status === 'active').length} ประกาศ</span>
          </div>
          <div className="properties-grid-future">
            {listings.filter(l => l.status === 'active').map(listing => (
              <div key={listing.id} className="property-card-future">
                <div className="property-image-future">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.title} />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                      fontSize: '48px'
                    }}>
                      {getPropertyIcon(listing.propertyType, listing.type)}
                    </div>
                  )}
                  <div className="property-overlay-future" />
                  <div className="verified-badge-future">
                    <CheckCircle2 size={14} />
                    <span>ใช้งาน</span>
                  </div>
                  <div className="property-stats-future">
                    <div className="stat-badge-future">
                      <span>👁️ {listing.views.toLocaleString()}</span>
                    </div>
                    <div className="stat-badge-future">
                      <span>❤️ {listing.saves.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="property-content-future">
                  <div className="property-header-future">
                    <h3 className="property-title-future">{listing.title}</h3>
                    <div className="property-price-future">
                      {listing.type === 'sell' 
                        ? `฿${parseFloat(listing.price).toLocaleString()}` 
                        : `฿${parseFloat(listing.price).toLocaleString()}/เดือน`}
                    </div>
                  </div>
                  <div className="property-location-future">
                    <MapPin size={16} />
                    <span>{listing.location}</span>
                  </div>
                  <div className="property-meta-future">
                    {listing.beds && (
                      <span>
                        <Bed size={14} />
                        {listing.beds}
                      </span>
                    )}
                    {listing.baths && (
                      <span>
                        <Bath size={14} />
                        {listing.baths}
                      </span>
                    )}
                    {listing.size && (
                      <span>
                        <Building2 size={14} />
                        {listing.size} ตร.ม.
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button 
                      className="view-details-btn-future"
                      style={{ flex: 1, background: 'white', color: '#1976D2', border: '1px solid #1976D2' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('listings');
                        handleEditListing(listing.id);
                      }}
                    >
                      <Edit2 size={14} />
                      <span>แก้ไข</span>
                    </button>
                    <button 
                      className="view-details-btn-future"
                      style={{ flex: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('listings');
                      }}
                    >
                      <span>ดูรายละเอียด</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Settings View
  const renderSettings = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>ตั้งค่า</h2>
          <p>จัดการการตั้งค่าระบบ</p>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <h3>การแจ้งเตือน</h3>
        </div>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4>แจ้งเตือนอีเมล</h4>
              <p>รับการแจ้งเตือนผ่านอีเมล</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>แจ้งเตือนข้อความ</h4>
              <p>รับการแจ้งเตือนเมื่อมีข้อความใหม่</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`agent-container ${showCreateListingPage ? 'fullscreen-mode' : ''}`}>
      {/* Sidebar */}
      {!showCreateListingPage && (
      <aside className={`agent-sidebar ${!sidebarOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <Building2 size={24} />
            </div>
            <span className="brand-name">HaaTee Seller</span>
          </div>
        </div>

        <div 
          className="sidebar-user"
          onClick={() => setActiveTab('profile')}
          style={{ cursor: 'pointer' }}
        >
          <button 
            className="btn-edit-profile"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileModal(true);
            }}
            title="แก้ไขโปรไฟล์"
          >
            <Edit2 size={14} />
          </button>
          <div className="user-avatar-large" style={{ position: 'relative', overflow: 'visible' }}>
            {profileData.profileImage ? (
              <img src={profileData.profileImage} alt={profileData.name} className="avatar-image-large" />
            ) : (
              <div className="avatar-placeholder-large">{profileData.name.charAt(0).toUpperCase()}</div>
            )}
            <div className="user-status-large"></div>
            {profileData.verified && (
              <span className="verify-badge" style={{ 
                position: 'absolute', 
                bottom: '-6px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                fontSize: '10px', 
                padding: '3px 8px',
                whiteSpace: 'nowrap',
                zIndex: 10,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
              }}>
                <CheckCircle2 size={10} />
                <span>ยืนยันแล้ว</span>
              </span>
            )}
          </div>
          <div className="user-welcome">
            <p className="welcome-text">ยินดีต้อนรับกลับมา!</p>
            <h4 className="user-name">{profileData.name}</h4>
            <p className="user-type">{profileData.userType === 'agent' ? 'นายหน้าอสังหาริมทรัพย์' : 'เจ้าของทรัพย์'}</p>
            {profileData.rating > 0 && (
              <div className="user-rating">
                ⭐ {profileData.rating.toFixed(1)} ({profileData.reviewCount} รีวิว)
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">เมนูหลัก</div>
            <button
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={18} />
              <span>แดชบอร์ด</span>
            </button>
            <button
              className="nav-btn"
              onClick={() => {
                setShowCreateListingPage(true);
              }}
            >
              <Plus size={18} />
              <span>ลงประกาศใหม่</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <Building2 size={18} />
              <span>ทรัพย์สิน</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={18} />
              <span>วิเคราะห์</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contracts')}
            >
              <FileText size={18} />
              <span>สัญญา</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'guide' ? 'active' : ''}`}
              onClick={() => setActiveTab('guide')}
            >
              <BookOpen size={18} />
              <span>คู่มือ</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>ตั้งค่า</span>
          </button>
          <button
            className="nav-btn logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={18} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <div className="agent-main">
        {/* Header */}
        {!showCreateListingPage && (
        <header className="main-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <div className="header-title">
              <h2>{activeTab === 'dashboard' ? 'แดชบอร์ด' : activeTab === 'listings' ? 'ทรัพย์สิน' : activeTab === 'analytics' ? 'วิเคราะห์' : activeTab === 'chat' ? 'ข้อความ' : activeTab === 'contracts' ? 'สัญญา' : activeTab === 'guide' ? 'คู่มือ' : activeTab === 'settings' ? 'ตั้งค่า' : activeTab === 'profile' ? 'โปรไฟล์' : ''}</h2>
              <p className="header-subtitle">จัดการทรัพย์สินของคุณ</p>
            </div>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="ค้นหา..." />
            </div>
            <button 
              className="header-icon-btn"
              onClick={() => setActiveTab('chat')}
              title="ข้อความ"
            >
              <MessageCircle size={18} />
              <span className="notification-badge">2</span>
            </button>
            <button className="header-icon-btn">
              <Bell size={18} />
              <span className="notification-badge">2</span>
            </button>
          </div>
        </header>
        )}

        {/* Content Area */}
        {!showCreateListingPage && (
          <div className="content-area">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'listings' && renderListings()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'chat' && renderChat()}
            {activeTab === 'contracts' && renderContracts()}
            {activeTab === 'guide' && renderGuide()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        )}
      </div>

      {/* Full Screen Create Listing Page */}
      {showCreateListingPage && renderCreateListingPage()}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={handleLogoutCancel}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-header">
              <div className="logout-icon-wrapper">
                <LogOut size={32} />
              </div>
            </div>

            <div className="logout-modal-content">
              <h2 className="logout-modal-title">ออกจากระบบ</h2>
              <p className="logout-modal-message">
                คุณแน่ใจหรือว่าต้องการออกจากระบบ?
              </p>
              <p className="logout-modal-subtitle">
                คุณสามารถเข้าสู่ระบบได้อีกครั้งด้วยข้อมูลประจำตัวของคุณ
              </p>
            </div>

            <div className="logout-modal-footer">
              <button
                className="btn-logout-cancel"
                onClick={handleLogoutCancel}
              >
                ยกเลิก
              </button>
              <button
                className="btn-logout-confirm"
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <span className="spinner-mini"></span>
                    กำลังออก...
                  </>
                ) : (
                  'ยืนยันออกจากระบบ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>แก้ไขข้อมูลโปรไฟล์</h3>
              <button onClick={() => setShowProfileModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-edit-form">
                {/* Profile Image */}
                <div className="form-group">
                  <label>รูปโปรไฟล์</label>
                  <div className="profile-image-upload">
                    <div className="profile-image-preview">
                      {profileData.profileImage ? (
                        <img src={profileData.profileImage} alt="Profile" />
                      ) : (
                        <div className="avatar-placeholder-large">
                          {profileData.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <label className="btn-change-image">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          style={{ display: 'none' }}
                        />
                        <Edit2 size={16} />
                        <span>เปลี่ยนรูป</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="form-section-divider">
                  <h4>ข้อมูลโปรไฟล์พื้นฐาน</h4>
                </div>

                <div className="form-group">
                  <label>ชื่อ-นามสกุล <span className="required">*</span></label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>

                <div className="form-group">
                  <label>อีเมล <span className="required">*</span></label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>เบอร์โทรศัพท์ <span className="required">*</span></label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="0xxxxxxxxx"
                  />
                </div>

                <div className="form-group">
                  <label>ประเภทผู้ใช้ <span className="required">*</span></label>
                  <div className="user-type-buttons">
                    <button
                      type="button"
                      className={`user-type-btn ${profileData.userType === 'agent' ? 'active' : ''}`}
                      onClick={() => setProfileData({ ...profileData, userType: 'agent' })}
                    >
                      นายหน้า
                    </button>
                    <button
                      type="button"
                      className={`user-type-btn ${profileData.userType === 'owner' ? 'active' : ''}`}
                      onClick={() => setProfileData({ ...profileData, userType: 'owner' })}
                    >
                      เจ้าของทรัพย์
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>ประวัติโดยย่อ</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="เขียนประวัติโดยย่อเกี่ยวกับตัวคุณ..."
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>คะแนนรีวิว</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={profileData.rating}
                      onChange={(e) => setProfileData({ ...profileData, rating: parseFloat(e.target.value) })}
                      placeholder="4.8"
                    />
                  </div>
                  <div className="form-group">
                    <label>จำนวนรีวิว</label>
                    <input
                      type="number"
                      min="0"
                      value={profileData.reviewCount}
                      onChange={(e) => setProfileData({ ...profileData, reviewCount: parseInt(e.target.value) })}
                      placeholder="24"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowProfileModal(false)}>
                ยกเลิก
              </button>
              <button className="btn-primary" onClick={handleSaveProfile}>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Contract Modal - Global Modal accessible from all views */}
      {showContractModal && (
        <div className="modal-overlay" onClick={() => setShowContractModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>สร้างสัญญาดิจิทัล E-Contract</h3>
              <button onClick={() => setShowContractModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="contract-wizard">
                <div className="wizard-step active">
                  <h4>ขั้นที่ 1: เลือกทรัพย์สิน</h4>
                  <div className="form-group">
                    <label>ทรัพย์สิน *</label>
                    <select 
                      value={contractData.propertyId}
                      onChange={(e) => setContractData({ ...contractData, propertyId: e.target.value })}
                    >
                      <option value="">-- เลือกทรัพย์สิน --</option>
                      {listings.filter(l => l.status === 'active').map(l => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="wizard-step active">
                  <h4>ขั้นที่ 2: ข้อมูลผู้เช่า</h4>
                  <div className="form-group">
                    <label>อีเมลผู้เช่า *</label>
                    <input 
                      type="email"
                      value={contractData.tenantEmail}
                      onChange={(e) => setContractData({ ...contractData, tenantEmail: e.target.value })}
                      placeholder="ผู้เช่า@example.com"
                    />
                  </div>
                </div>

                <div className="wizard-step active">
                  <h4>ขั้นที่ 3: เงื่อนไขสัญญา</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>ค่าเช่ารายเดือน (฿) *</label>
                      <input 
                        type="number"
                        value={contractData.monthlyRent}
                        onChange={(e) => setContractData({ ...contractData, monthlyRent: e.target.value })}
                        placeholder="45000"
                      />
                    </div>
                    <div className="form-group">
                      <label>ระยะเวลาเช่า (เดือน) *</label>
                      <select 
                        value={contractData.leaseDuration}
                        onChange={(e) => setContractData({ ...contractData, leaseDuration: e.target.value })}
                      >
                        <option value="6">6 เดือน</option>
                        <option value="12">12 เดือน (1 ปี)</option>
                        <option value="24">24 เดือน (2 ปี)</option>
                        <option value="36">36 เดือน (3 ปี)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>เงินมัดจำ (฿)</label>
                    <input 
                      type="number"
                      value={contractData.deposit}
                      onChange={(e) => setContractData({ ...contractData, deposit: e.target.value })}
                      placeholder="แนะนำ: 3 เดือน"
                    />
                  </div>
                  <div className="form-group">
                    <label>วันที่เริ่มเช่า</label>
                    <input 
                      type="date"
                      value={contractData.startDate}
                      onChange={(e) => setContractData({ ...contractData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>เงื่อนไขและข้อตกลงเพิ่มเติม</label>
                    <textarea 
                      value={contractData.conditions}
                      onChange={(e) => setContractData({ ...contractData, conditions: e.target.value })}
                      placeholder="ระบุเงื่อนไขอื่นๆ เช่น ห้ามเลี้ยงสัตว์, สูบบุหรี่ ฯลฯ"
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              <div className="contract-preview">
                <h4>ตัวอย่างสัญญา</h4>
                <div className="preview-box">
                  <p><strong>สัญญาเช่าอสังหาริมทรัพย์</strong></p>
                  <p>ประเภท: ระหว่างปีที่ 1 ถึง 3 ปี</p>
                  <p>ผู้ให้เช่า: [ชื่อของคุณ]</p>
                  <p>ผู้เช่า: {contractData.tenantEmail}</p>
                  <p>ทรัพย์สิน: {listings.find(l => l.id == contractData.propertyId)?.title}</p>
                  <p>ค่าเช่ารายเดือน: ฿{contractData.monthlyRent}</p>
                  <p>ระยะเวลา: {contractData.leaseDuration} เดือน</p>
                  {contractData.conditions && <p>เงื่อนไข: {contractData.conditions}</p>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowContractModal(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={handleCreateContract}>ส่งสัญญาให้ผู้เช่า</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seller;
