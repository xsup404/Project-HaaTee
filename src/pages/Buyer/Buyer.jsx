import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Heart, MapPin, Bath, Bed, Search, Menu, X, ArrowRight, Building, Sparkles, CheckCircle, Star, TrendingUp, Users, Award, ChevronRight, ChevronDown, MessageCircle, Flag, Download, Calendar, User, Bell, Zap, Home as HomeIcon, FileCheck, Shield, Clock, BarChart3, Filter, MapPinIcon, Check, Trash2, Plus, Settings, FileText, Sliders, Lock, LogOut } from 'lucide-react';
import propertiesData from '../../data/properties.json';
import './Buyer.css';

const Buyer = ({ onNavigate, onLoginRequired }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTab, setCurrentTab] = useState('browse'); // browse, saved, chat, profile
  const [searchMode, setSearchMode] = useState('buy'); // buy, rent
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ทั้งหมด');
  const [selectedPrice, setSelectedPrice] = useState('ทั้งหมด');
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด');
  const [locationCategory, setLocationCategory] = useState(null);
  const [searchType, setSearchType] = useState('address');
  const [showSearchTypeMenu, setShowSearchTypeMenu] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [stationSearchInput, setStationSearchInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'owner', text: 'สวัสดีค่ะ ยินดีต้อนรับครับ', time: '10:30 AM' },
    { id: 2, sender: 'buyer', text: 'สวัสดีค่ะ ทรัพย์สินนี้ยังว่างอยู่ไหมค่ะ', time: '10:35 AM' },
    { id: 3, sender: 'owner', text: 'ว่างอยู่ครับ พร้อมให้ทำสัญญาได้เลยครับ', time: '10:36 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileTab, setProfileTab] = useState('info'); // info, edit, contract, settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newProperty: true,
    priceChange: true,
    agentMessage: true
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showPhoneNumber: true,
    allowMessages: true,
    shareActivity: false
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginAlerts: true,
    deviceManagement: true
  });
  const [savedProperties, setSavedProperties] = useState([8, 9]); // รหัส property ที่บันทึก
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load search parameters from Home page
  useEffect(() => {
    const params = sessionStorage.getItem('homeSearchParams');
    if (params) {
      try {
        const searchParams = JSON.parse(params);
        if (searchParams.location) setSelectedLocation(searchParams.location);
        if (searchParams.type) setSelectedType(searchParams.type);
        if (searchParams.price) setSelectedPrice(searchParams.price);
        sessionStorage.removeItem('homeSearchParams');
      } catch (e) {
        console.error('Error parsing search params:', e);
      }
    }
  }, []);

  // Load and filter properties - OPTIMIZED: Load first 1000 only for better performance
  useEffect(() => {
    try {
      // Sort by createdAt DESC (newest first) and limit to first 1000
      const sorted = [...propertiesData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 1000); // Limit for performance
      setAllProperties(sorted);
      setLoading(false);
    } catch (error) {
      console.error('Error loading properties:', error);
      setAllProperties([]);
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    // Auto-scroll disabled - chat stays at current position
  }, [chatMessages]);

  const stationsByLine = {
    'BTS สายสีเขียว': [
      'สะเดา', 'หลักสี่', 'จตุจักร', 'สามเสนนอก', 'รัชดา', 'พหลโยธิน59', 'อนุสาวรีย์ชัยสมรัจ', 'พญาไท', 'วิทยุ', 'สวนจิตรลดา', 'ศาลายา', 'มีนบุรี', 'เมืองทอง', 'บ้านสวน', 'บ้านสวนหลวง', 'เสนานิเวศน์', 'สำโรง', 'อุดมสุข', 'บ้านที่', 'ดินแดง', 'บ้านสวน', 'บ้านลน', 'โมเชน', 'บ้านสวน', 'ท่าบ้าน', 'ราชดำเนิน', 'ชิดลม', 'ปตท.สถานีสยาม', 'สยาม'
    ],
    'BTS สายสีม่วง': [
      'บ้านสวน', 'ตลาดบางใหญ่', 'แยกลำลูกกา', 'จังสมบัติ', 'บางระมาด', 'ซี่เหล็ก', 'พหลโยธิน32', 'พหลโยธิน63', 'สอบ', 'พหลโยธิน71', 'เบิกน้อย', 'เป่าจิตร', 'สนามหลวง', 'บ้านสวน', 'บางจาก', 'โรจนการ', 'ห้วยขวาง', 'ตัดใจ', 'คึกส์วิทยา', 'สถาบันราชภัฏ', 'ราชวิถี', 'ตลาดน้อย'
    ],
    'BTS สายสีแดง': [
      'แบริ่ง', 'สีลม', 'จุฬา', 'ศิรราช', 'ชินบัญชร', 'ลำลูกกา', 'สไตล์ชินวัตร', 'สายไหม', 'กัฟฟ้า', 'ศูนย์วัฒนา', 'บางพลี', 'บางโพ', 'นนทบุรี', 'ปากเกร็ด', 'บ้านอักษร', 'วงเวียนใหญ่', 'กรุงธนบุรี'
    ],
    'MRT สายสีน้ำเงิน': [
      'หลักสี่', 'พหลโยธิน59', 'อนุสาวรีย์ชัยสมรัจ', 'พญาไท', 'วิทยุ', 'สวนจิตรลดา', 'ศาลายา', 'สีลม', 'ลุมพินี', 'ศิลป์', 'เสนานิเวศน์', 'สุขุมวิท', 'พระยาไท', 'รัชดา', 'ลาดพร้าว', 'ประตูน้อย', 'เพ็ชรบุรี', 'ห้วยขวาง', 'ศรีนครินทร์', 'ท่าพระ'
    ],
    'MRT สายสีม่วง': [
      'บ้านสวน', 'ตลาดบางใหญ่', 'แยกลำลูกกา', 'จังสมบัติ', 'บางระมาด', 'ซี่เหล็ก', 'พหลโยธิน32', 'พหลโยธิน63', 'สอบ', 'พหลโยธิน71', 'เบิกน้อย', 'เป่าจิตร', 'สนามหลวง', 'บ้านสวน', 'บางจาก', 'โรจนการ', 'ห้วยขวาง', 'ตัดใจ', 'คึกส์วิทยา', 'สถาบันราชภัฏ', 'ราชวิถี', 'ตลาดน้อย'
    ]
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Lock body scroll when property detail or station modal is open
  useEffect(() => {
    if (selectedProperty || showStationModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [selectedProperty, showStationModal]);

  const locationData = {
    'เขต': ['ทั้งหมด', 'สุขุมวิท', 'สาทร', 'สีลม', 'ลุมพินี', 'ลาดพร้าว', 'มีนบุรี', 'บางนา', 'บางแค', 'ป่าแก้ว', 'บ้านแสน'],
    'จังหวัด': ['ทั้งหมด', 'กรุงเทพฯ', 'ปริมณฑล', 'นนทบุรี', 'สมุทรปราการ', 'สมุทรสาคร', 'สุพรรณบุรี', 'บางกอก'],
    'รถไฟฟ้า': ['ทั้งหมด', 'BTS สุขุมวิท', 'BTS สยาม', 'BTS ราชดำเนิน', 'BTS อนุสาวรีย์', 'BTS สวนจิตรลดา', 'BTS ศาลายา', 'BTS วิทยุ', 'BTS ชิดลม', 'MRT สุขุมวิท', 'MRT ลุมพินี']
  };

  const propertyTypes = [
    { name: 'ทั้งหมด' },
    { name: 'บ้านเดี่ยว' },
    { name: 'คอนโด' },
    { name: 'ทาวน์เฮาส์' },
    { name: 'บ้านแฝด' },
    { name: 'วิลล่า' },
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
    { name: 'เชียงใหม่' },
    { name: 'พัทยา' },
  ];

  const filteredProperties = allProperties.filter(property => {
    // Filter by search mode (buy/rent)
    if (searchMode === 'buy' && property.listingType !== 'sale') return false;
    if (searchMode === 'rent' && property.listingType !== 'rent') return false;

    // If on saved tab, only show saved properties
    if (currentTab === 'saved') {
      return property.saved === true;
    }
    
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ทั้งหมด' || property.type === selectedType;
    const matchesLocation = selectedLocation === 'ทั้งหมด' || property.location.includes(selectedLocation);
    
    const priceRange = priceRanges.find(p => p.name === selectedPrice);
    const matchesPrice = !priceRange || (property.priceValue >= priceRange.min && property.priceValue <= priceRange.max);
    
    return matchesSearch && matchesType && matchesLocation && matchesPrice;
  });

  return (
    <div className="buyer-page-future">
      <div
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* ===== HEADER ===== */}
      <header className={`header-future ${scrollY > 50 ? 'header-scrolled' : ''}`}>
        <div className="header-container-future">
          <div className="logo-future" onClick={() => setCurrentTab('browse')}>
            <Sparkles size={24} />
            <span>HaaTee</span>
          </div>

          <nav className="nav-menu-future">
            <button className="nav-link-future" onClick={() => setCurrentTab('browse')}>
              ค้นหาทรัพย์สิน
            </button>
            <button className="nav-link-future" onClick={() => setCurrentTab('saved')}>
              โปรดของฉัน
            </button>
            <button className="nav-link-future" onClick={() => setCurrentTab('chat')}>
              แชท
            </button>
            <button className="nav-link-future" onClick={() => setCurrentTab('profile')}>
              โปรไฟล์
            </button>
            <button className="nav-cta-future" onClick={() => setShowLogoutModal(true)}>
              ออกจากระบบ
            </button>
          </nav>

          <button className="menu-toggle-future" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ===== BROWSE TAB ===== */}
      {currentTab === 'browse' && (
        <>
          {/* HERO SECTION */}
              <section className="buyer-hero-future">
                <div className="buyer-hero-bg-future" style={{ backgroundImage: 'url(/B.jpg)' }}>
                  <div className="buyer-hero-overlay-future"></div>
                  <div className="pixel-pattern-future"></div>
                </div>
                <div className="container-future">
                  <div className="buyer-hero-content-future">
                    <h1 className="buyer-hero-title-future">
                      <span className="title-line-future">ค้นหาบ้าน</span>
                      <span className="title-line-future gradient-text-future">ที่เข้าใจคุณกว่าใคร</span>
                    </h1>
                  </div>
                </div>
              </section>

          {/* SEARCH BAR FLOATING */}
          <div className="search-bar-floating-future">
            <div className="search-bar-wrapper-future">
              <div className="search-mode-toggle-future">
                <button 
                  className={`toggle-btn-future ${searchMode === 'buy' ? 'active' : ''}`}
                  onClick={() => setSearchMode('buy')}
                >
                  ซื้อ
                </button>
                <button 
                  className={`toggle-btn-future ${searchMode === 'rent' ? 'active' : ''}`}
                  onClick={() => setSearchMode('rent')}
                >
                  เช่า
                </button>
              </div>

              <div className="search-input-container-future" onMouseEnter={() => setShowSearchTypeMenu(true)} onMouseLeave={() => setShowSearchTypeMenu(false)}>
                <Search size={20} />
                <input 
                  type="text" 
                  placeholder="ค้นหาสถานที่โครงการ..." 
                  className="search-input-future"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {showSearchTypeMenu && (
                  <div className="search-type-menu-inline-future">
                    <button 
                      className="search-type-menu-item-future active"
                      onClick={() => {
                        setShowStationModal(true);
                        setShowSearchTypeMenu(false);
                      }}
                    >
                      ค้นหาด้วยสถานีรถไฟฟ้า
                    </button>
                  </div>
                )}
              </div>

              <div className="search-filters-grid-future">
                <div className="filter-dropdown-future">
                  <button className="filter-btn-future">
                    <MapPin size={20} />
                    <div className="filter-btn-content-future">
                      <span className="filter-label-future">ทำเล</span>
                      <span className="filter-value-future">{selectedLocation}</span>
                    </div>
                    <ChevronDown size={18} />
                  </button>
                  <div className="filter-menu-future">
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('ทั้งหมด')}>ทั้งหมด</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('กรุงเทพฯ')}>กรุงเทพฯ</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('ปริมณฑล')}>ปริมณฑล</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('นนทบุรี')}>นนทบุรี</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('สมุทรปราการ')}>สมุทรปราการ</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('สมุทรสาคร')}>สมุทรสาคร</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('สุพรรณบุรี')}>สุพรรณบุรี</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('ปทุมธานี')}>ปทุมธานี</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('ระยอง')}>ระยอง</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedLocation('ชลบุรี')}>ชลบุรี</button>
                  </div>
                </div>

                <div className="filter-dropdown-future">
                  <button className="filter-btn-future">
                    <Building size={20} />
                    <div className="filter-btn-content-future">
                      <span className="filter-label-future">ประเภท</span>
                      <span className="filter-value-future">{selectedType}</span>
                    </div>
                    <ChevronDown size={18} />
                  </button>
                  <div className="filter-menu-future">
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('ทั้งหมด')}>ทั้งหมด</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('บ้านเดี่ยว')}>บ้านเดี่ยว</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('คอนโด')}>คอนโด</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('ทาวน์เฮาส์')}>ทาวน์เฮาส์</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('บ้านแฝด')}>บ้านแฝด</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('วิลล่า')}>วิลล่า</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('บ้านลิเวอรี่')}>บ้านลิเวอรี่</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('ห้องชุด')}>ห้องชุด</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('อพาร์ตเมนต์')}>อพาร์ตเมนต์</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedType('สตูดิโอ')}>สตูดิโอ</button>
                  </div>
                </div>

                <div className="filter-dropdown-future">
                  <button className="filter-btn-future">
                    <span className="price-icon-future">฿</span>
                    <div className="filter-btn-content-future">
                      <span className="filter-label-future">ราคา</span>
                      <span className="filter-value-future">{selectedPrice}</span>
                    </div>
                    <ChevronDown size={18} />
                  </button>
                  <div className="filter-menu-future">
                    <button className="filter-menu-item-future" onClick={() => setSelectedPrice('ทั้งหมด')}>ทั้งหมด</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedPrice('ต่ำกว่า 1 ล้าน')}>ต่ำกว่า 1 ล้าน</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedPrice('1 - 3 ล้าน')}>1 - 3 ล้าน</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedPrice('3 - 5 ล้าน')}>3 - 5 ล้าน</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedPrice('5 - 10 ล้าน')}>5 - 10 ล้าน</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedPrice('10 - 20 ล้าน')}>10 - 20 ล้าน</button>
                    <button className="filter-menu-item-future" onClick={() => setSelectedPrice('20 ล้านขึ้นไป')}>20 ล้านขึ้นไป</button>
                  </div>
                </div>

                <div className="filter-dropdown-future">
                  <button className="search-submit-btn-future">
                    <span>ค้นหา</span>
                    <ChevronDown size={18} />
                  </button>
                  <div className="filter-menu-future">
                    <button 
                      className={`filter-menu-item-future ${searchType === 'address' ? 'active' : ''}`}
                      onClick={() => setSearchType('address')}
                    >
                      ค้นหาด้วยชื่อที่อยู่
                    </button>
                    <button 
                      className={`filter-menu-item-future ${searchType === 'station' ? 'active' : ''}`}
                      onClick={() => setSearchType('station')}
                    >
                      ค้นหาด้วยสถานีรถไฟฟ้า
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TOP 3 MOST POPULAR */}
          <section className="featured-section-future">
            <div className="container-future">
              <div className="section-header-future">
                <div>
                  <h2 className="section-title-future">⭐ Top 3 ที่คนสนใจมากที่สุด</h2>
                  <p className="section-subtitle-future">ทรัพย์สินยอดนิยมที่ดูเยอะสุด</p>
                </div>
              </div>

              <div className="properties-grid-future">
                {allProperties
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 3)
                  .map((property) => (
                    <div key={property.id} className="property-card-future" onClick={() => setSelectedProperty(property)}>
                      <div className="property-image-future">
                        <img src={property.image} alt={property.title} />
                        <div className="property-overlay-future" />
                        
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
                          className={`favorite-btn-future ${savedProperties.includes(property.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (savedProperties.includes(property.id)) {
                              setSavedProperties(savedProperties.filter(id => id !== property.id));
                            } else {
                              setSavedProperties([...savedProperties, property.id]);
                            }
                          }}
                        >
                          <Heart size={18} />
                        </button>

                        <div className="property-stats-future">
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
            </div>
          </section>

          {/* HOUSES SECTION */}
          <section className="category-section-future">
            <div className="container-future">
              <div className="section-header-future">
                <div>
                  <h2 className="section-title-future">🏠 บ้านเดี่ยว</h2>
                  <p className="section-subtitle-future">{allProperties.filter(p => p.type === 'บ้านเดี่ยว').length} รายการ</p>
                </div>
              </div>

              <div className="properties-grid-wide-future">
                {allProperties
                  .filter(p => p.type === 'บ้านเดี่ยว')
                  .slice(0, 10)
                  .map((property) => (
                    <div key={property.id} className="property-card-future" onClick={() => setSelectedProperty(property)}>
                      <div className="property-image-future">
                        <img src={property.image} alt={property.title} />
                        <div className="property-overlay-future" />
                        
                        {property.verified && (
                          <div className="verified-badge-future">
                            <CheckCircle size={14} />
                            <span>ยืนยันแล้ว</span>
                          </div>
                        )}
                        
                        <button
                          className={`favorite-btn-future ${savedProperties.includes(property.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (savedProperties.includes(property.id)) {
                              setSavedProperties(savedProperties.filter(id => id !== property.id));
                            } else {
                              setSavedProperties([...savedProperties, property.id]);
                            }
                          }}
                        >
                          <Heart size={18} />
                        </button>

                        <div className="property-stats-future">
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

              <div className="view-more-container-future">
                <button className="view-more-btn-future" onClick={() => setSelectedType('บ้านเดี่ยว')}>
                  ดูเพิ่มเติม ({allProperties.filter(p => p.type === 'บ้านเดี่ยว').length} รายการ)
                </button>
              </div>
            </div>
          </section>

          {/* CONDOS SECTION */}
          <section className="category-section-future">
            <div className="container-future">
              <div className="section-header-future">
                <div>
                  <h2 className="section-title-future">🏢 คอนโด</h2>
                  <p className="section-subtitle-future">{allProperties.filter(p => p.type === 'คอนโด').length} รายการ</p>
                </div>
              </div>

              <div className="properties-grid-wide-future">
                {allProperties
                  .filter(p => p.type === 'คอนโด')
                  .slice(0, 10)
                  .map((property) => (
                    <div key={property.id} className="property-card-future" onClick={() => setSelectedProperty(property)}>
                      <div className="property-image-future">
                        <img src={property.image} alt={property.title} />
                        <div className="property-overlay-future" />
                        
                        {property.verified && (
                          <div className="verified-badge-future">
                            <CheckCircle size={14} />
                            <span>ยืนยันแล้ว</span>
                          </div>
                        )}
                        
                        <button
                          className={`favorite-btn-future ${savedProperties.includes(property.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (savedProperties.includes(property.id)) {
                              setSavedProperties(savedProperties.filter(id => id !== property.id));
                            } else {
                              setSavedProperties([...savedProperties, property.id]);
                            }
                          }}
                        >
                          <Heart size={18} />
                        </button>

                        <div className="property-stats-future">
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

              <div className="view-more-container-future">
                <button className="view-more-btn-future" onClick={() => setSelectedType('คอนโด')}>
                  ดูเพิ่มเติม ({allProperties.filter(p => p.type === 'คอนโด').length} รายการ)
                </button>
              </div>
            </div>
          </section>

          {/* TOWNHOUSES SECTION */}
          <section className="category-section-future">
            <div className="container-future">
              <div className="section-header-future">
                <div>
                  <h2 className="section-title-future">🏘️ ทาวน์เฮาส์</h2>
                  <p className="section-subtitle-future">{allProperties.filter(p => p.type === 'ทาวน์เฮาส์').length} รายการ</p>
                </div>
              </div>

              <div className="properties-grid-wide-future">
                {allProperties
                  .filter(p => p.type === 'ทาวน์เฮาส์')
                  .slice(0, 10)
                  .map((property) => (
                    <div key={property.id} className="property-card-future" onClick={() => setSelectedProperty(property)}>
                      <div className="property-image-future">
                        <img src={property.image} alt={property.title} />
                        <div className="property-overlay-future" />
                        
                        {property.verified && (
                          <div className="verified-badge-future">
                            <CheckCircle size={14} />
                            <span>ยืนยันแล้ว</span>
                          </div>
                        )}
                        
                        <button
                          className={`favorite-btn-future ${savedProperties.includes(property.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (savedProperties.includes(property.id)) {
                              setSavedProperties(savedProperties.filter(id => id !== property.id));
                            } else {
                              setSavedProperties([...savedProperties, property.id]);
                            }
                          }}
                        >
                          <Heart size={18} />
                        </button>

                        <div className="property-stats-future">
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

              <div className="view-more-container-future">
                <button className="view-more-btn-future" onClick={() => setSelectedType('ทาวน์เฮาส์')}>
                  ดูเพิ่มเติม ({allProperties.filter(p => p.type === 'ทาวน์เฮาส์').length} รายการ)
                </button>
              </div>
            </div>
          </section>

          {/* TWIN HOUSES SECTION */}
          <section className="category-section-future">
            <div className="container-future">
              <div className="section-header-future">
                <div>
                  <h2 className="section-title-future">🏡 บ้านแฝด</h2>
                  <p className="section-subtitle-future">{allProperties.filter(p => p.type === 'บ้านแฝด').length} รายการ</p>
                </div>
              </div>

              <div className="properties-grid-wide-future">
                {allProperties
                  .filter(p => p.type === 'บ้านแฝด')
                  .slice(0, 10)
                  .map((property) => (
                    <div key={property.id} className="property-card-future" onClick={() => setSelectedProperty(property)}>
                      <div className="property-image-future">
                        <img src={property.image} alt={property.title} />
                        <div className="property-overlay-future" />
                        
                        {property.verified && (
                          <div className="verified-badge-future">
                            <CheckCircle size={14} />
                            <span>ยืนยันแล้ว</span>
                          </div>
                        )}
                        
                        <button
                          className={`favorite-btn-future ${savedProperties.includes(property.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (savedProperties.includes(property.id)) {
                              setSavedProperties(savedProperties.filter(id => id !== property.id));
                            } else {
                              setSavedProperties([...savedProperties, property.id]);
                            }
                          }}
                        >
                          <Heart size={18} />
                        </button>

                        <div className="property-stats-future">
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

              <div className="view-more-container-future">
                <button className="view-more-btn-future" onClick={() => setSelectedType('บ้านแฝด')}>
                  ดูเพิ่มเติม ({allProperties.filter(p => p.type === 'บ้านแฝด').length} รายการ)
                </button>
              </div>
            </div>
          </section>

          {/* VILLAS SECTION */}
          <section className="category-section-future">
            <div className="container-future">
              <div className="section-header-future">
                <div>
                  <h2 className="section-title-future">🏖️ วิลล่า</h2>
                  <p className="section-subtitle-future">{allProperties.filter(p => p.type === 'วิลล่า').length} รายการ</p>
                </div>
              </div>

              <div className="properties-grid-wide-future">
                {allProperties
                  .filter(p => p.type === 'วิลล่า')
                  .slice(0, 10)
                  .map((property) => (
                    <div key={property.id} className="property-card-future" onClick={() => setSelectedProperty(property)}>
                      <div className="property-image-future">
                        <img src={property.image} alt={property.title} />
                        <div className="property-overlay-future" />
                        
                        {property.verified && (
                          <div className="verified-badge-future">
                            <CheckCircle size={14} />
                            <span>ยืนยันแล้ว</span>
                          </div>
                        )}
                        
                        <button
                          className={`favorite-btn-future ${savedProperties.includes(property.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (savedProperties.includes(property.id)) {
                              setSavedProperties(savedProperties.filter(id => id !== property.id));
                            } else {
                              setSavedProperties([...savedProperties, property.id]);
                            }
                          }}
                        >
                          <Heart size={18} />
                        </button>

                        <div className="property-stats-future">
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

              <div className="view-more-container-future">
                <button className="view-more-btn-future" onClick={() => setSelectedType('วิลล่า')}>
                  ดูเพิ่มเติม ({allProperties.filter(p => p.type === 'วิลล่า').length} รายการ)
                </button>
              </div>
            </div>
          </section>

          {/* PROPERTY DETAILS MODAL */}
          {selectedProperty && (
            <div className="property-fullpage-wrapper">
              {/* Header Bar */}
              <div className="property-fullpage-header">
                <button className="back-btn-fullpage" onClick={() => setSelectedProperty(null)}>
                  <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
                  <span>กลับ</span>
                </button>
                <div className="property-header-actions">
                  <button 
                    className={`action-icon-btn ${savedProperties.includes(selectedProperty.id) ? 'active' : ''}`}
                    onClick={() => {
                      if (savedProperties.includes(selectedProperty.id)) {
                        setSavedProperties(savedProperties.filter(id => id !== selectedProperty.id));
                      } else {
                        setSavedProperties([...savedProperties, selectedProperty.id]);
                      }
                    }}
                  >
                    <Heart size={20} />
                  </button>
                  <button className="action-icon-btn">
                    <Flag size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="property-fullpage-content">
                {/* Gallery */}
                <div className="property-gallery-wrapper">
                  <div className="property-gallery-main">
                    <img 
                      src={selectedProperty.image} 
                      alt={selectedProperty.title}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23666" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="property-gallery-thumbnails">
                    <div className="thumbnail-item active">
                      <img src={selectedProperty.image} alt="Photo 1" />
                    </div>
                    <div className="thumbnail-item">
                      <img src={selectedProperty.image} alt="Photo 2" />
                    </div>
                    <div className="thumbnail-item">
                      <img src={selectedProperty.image} alt="Photo 3" />
                    </div>
                    <div className="thumbnail-item">
                      <img src={selectedProperty.image} alt="Photo 4" />
                    </div>
                    <div className="thumbnail-item">
                      <img src={selectedProperty.image} alt="Photo 5" />
                    </div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="property-fullpage-inner">
                  {/* Header Info */}
                  <div className="property-fullpage-header-section">
                    <h1 className="property-fullpage-title">{selectedProperty.title}</h1>
                    <div className="property-fullpage-meta">
                      <p className="property-fullpage-location">
                        <MapPin size={18} />
                        {selectedProperty.location}
                      </p>
                      {selectedProperty.verified && (
                        <span className="property-fullpage-badge">✓ ยืนยันแล้ว</span>
                      )}
                    </div>
                    <h2 className="property-fullpage-price">{selectedProperty.price}</h2>
                  </div>

                  {/* Specs */}
                  <div className="property-fullpage-specs">
                    <div className="spec-box">
                      <Bed size={24} />
                      <div>
                        <span className="spec-label">ห้องนอน</span>
                        <span className="spec-value">{selectedProperty.beds}</span>
                      </div>
                    </div>
                    <div className="spec-box">
                      <Bath size={24} />
                      <div>
                        <span className="spec-label">ห้องน้ำ</span>
                        <span className="spec-value">{selectedProperty.baths}</span>
                      </div>
                    </div>
                    <div className="spec-box">
                      <Building size={24} />
                      <div>
                        <span className="spec-label">ขนาด</span>
                        <span className="spec-value">{selectedProperty.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="property-fullpage-section">
                    <h3>รายละเอียด</h3>
                    <p>{selectedProperty.description}</p>
                  </div>

                  {/* Amenities */}
                  <div className="property-fullpage-section">
                    <h3>สิ่งอำนวยความสะดวก</h3>
                    <div className="property-fullpage-amenities">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <span key={idx} className="amenity-chip">
                          <CheckCircle size={16} />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="property-fullpage-section">
                    <h3>ข้อมูลเจ้าของ</h3>
                    <div className="owner-fullpage-card">
                      <div className="owner-avatar">
                        <User size={40} />
                      </div>
                      <div className="owner-info">
                        <p className="owner-name">{selectedProperty.owner}</p>
                        <p className="owner-role">เจ้าของทรัพย์สิน</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Map */}
                  <div className="property-fullpage-section">
                    <h3>ตำแหน่งที่ตั้ง</h3>
                    <div className="property-map-container">
                      <div className="property-map">
                        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                          {/* Map background */}
                          <rect width="400" height="300" fill="#E8F4F8" />
                          {/* Water areas */}
                          <circle cx="100" cy="150" r="40" fill="#B3E5FC" opacity="0.5" />
                          <circle cx="350" cy="100" r="30" fill="#B3E5FC" opacity="0.5" />
                          {/* Grid lines */}
                          <line x1="0" y1="75" x2="400" y2="75" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                          <line x1="0" y1="150" x2="400" y2="150" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                          <line x1="0" y1="225" x2="400" y2="225" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                          <line x1="100" y1="0" x2="100" y2="300" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                          <line x1="200" y1="0" x2="200" y2="300" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                          <line x1="300" y1="0" x2="300" y2="300" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                          {/* Streets */}
                          <rect x="10" y="100" width="380" height="4" fill="#F9A825" opacity="0.6" />
                          <rect x="50" y="10" width="4" height="280" fill="#F9A825" opacity="0.6" />
                          <rect x="180" y="40" width="4" height="220" fill="#F9A825" opacity="0.6" />
                          {/* Buildings */}
                          <rect x="30" y="50" width="30" height="30" fill="#90CAF9" />
                          <rect x="80" y="60" width="25" height="25" fill="#90CAF9" />
                          <rect x="250" y="120" width="35" height="35" fill="#90CAF9" />
                          <rect x="320" y="180" width="28" height="28" fill="#90CAF9" />
                          {/* Location pin */}
                          <circle cx="200" cy="150" r="12" fill="#F44336" />
                          <circle cx="200" cy="150" r="8" fill="white" />
                          <path d="M 200 160 L 195 175 L 200 180 L 205 175 Z" fill="#F44336" />
                        </svg>
                      </div>
                      <p className="property-location-text">
                        <MapPin size={16} />
                        {selectedProperty.location}
                      </p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="property-fullpage-actions">
                    <button className="btn-primary-fullpage" onClick={() => setCurrentTab('chat')}>
                      <MessageCircle size={18} />
                      <span>แชทกับเจ้าของ</span>
                    </button>
                    <button 
                      className={`btn-secondary-fullpage ${savedProperties.includes(selectedProperty.id) ? 'active' : ''}`}
                      onClick={() => {
                        if (savedProperties.includes(selectedProperty.id)) {
                          setSavedProperties(savedProperties.filter(id => id !== selectedProperty.id));
                        } else {
                          setSavedProperties([...savedProperties, selectedProperty.id]);
                        }
                      }}
                    >
                      <Heart size={18} />
                      <span>{savedProperties.includes(selectedProperty.id) ? 'บันทึกแล้ว' : 'บันทึก'}</span>
                    </button>
                  </div>

                  {/* Bottom Spacing */}
                  <div style={{ height: '40px' }}></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== SEARCH RESULTS TAB ===== */}
      {currentTab === 'search' && (
        <section className="search-results-page-future">
          <div className="search-results-page-header">
            <div className="container-future">
              <button 
                className="search-back-btn-future"
                onClick={() => {
                  setCurrentTab('browse');
                  setSearchQuery('');
                  setSearchTerm('');
                }}
              >
                ← กลับ
              </button>
              <h1 className="search-results-page-title">🔍 ผลการค้นหา: {searchQuery}</h1>
              <p className="search-results-page-count">พบ {filteredProperties.length} รายการ</p>
            </div>
          </div>

          <div className="container-future search-results-page-content">
            {filteredProperties.length > 0 ? (
              <div className="properties-grid-wide-future">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="property-card-future" onClick={() => setSelectedProperty(property)}>
                    <div className="property-image-future">
                      <img src={property.image} alt={property.title} />
                      <div className="property-overlay-future" />
                      
                      {property.verified && (
                        <div className="verified-badge-future">
                          <CheckCircle size={14} />
                          <span>ยืนยันแล้ว</span>
                        </div>
                      )}
                      
                      <button
                        className={`favorite-btn-future ${savedProperties.includes(property.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (savedProperties.includes(property.id)) {
                            setSavedProperties(savedProperties.filter(id => id !== property.id));
                          } else {
                            setSavedProperties([...savedProperties, property.id]);
                          }
                        }}
                      >
                        <Heart size={18} />
                      </button>

                      <div className="property-stats-future">
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

                      <div style={{ fontSize: '12px', color: '#999', marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                        <div>📅 โพส: {property.createdAt}</div>
                        <div>⏰ หมดอายุ: {property.expiryDate}</div>
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
              <div className="no-results-message-future">
                <h2>ไม่พบผลการค้นหา</h2>
                <p>ไม่พบทรัพย์สินที่ตรงกับการค้นหา "{searchQuery}"</p>
                <button 
                  className="back-home-btn-future"
                  onClick={() => {
                    setCurrentTab('browse');
                    setSearchQuery('');
                    setSearchTerm('');
                  }}
                >
                  กลับไปหน้าหลัก
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== SAVED TAB ===== */}
      {currentTab === 'saved' && (
        <section className="saved-section-future">
          <div className="saved-section-wrapper-future">
            <div className="section-header-future">
              <div>
                <h2 className="section-title-future">❤️ รายการที่บันทึกไว้</h2>
                <p className="section-subtitle-future">ทรัพย์สินที่คุณสนใจ</p>
              </div>
            </div>

            <div className="saved-cart-wrapper-future">
              {/* LEFT SIDE - SAVED ITEMS LIST */}
              <div className="saved-items-list-future">
                <div className="saved-items-header-future">
                  <h3>รายการที่บันทึก ({allProperties.filter(p => savedProperties.includes(p.id)).length})</h3>
                </div>
                
                {allProperties.filter(p => savedProperties.includes(p.id)).length > 0 ? (
                  <div className="saved-items-future">
                    {allProperties.filter(p => savedProperties.includes(p.id)).map((property) => (
                      <div key={property.id} className="saved-item-row-future">
                        <div className="saved-item-image-future">
                          <img src={property.image} alt={property.title} />
                        </div>
                        
                        <div className="saved-item-details-future">
                          <h4>{property.title}</h4>
                          <p className="saved-item-location-future"><MapPin size={14} /> {property.location}</p>
                          <div className="saved-item-specs-future">
                            <span><Bed size={12} /> {property.beds}</span>
                            <span><Bath size={12} /> {property.baths}</span>
                            <span><Building size={12} /> {property.size}</span>
                          </div>
                          <p className="saved-item-price-future">{property.price}</p>
                        </div>

                        <div className="saved-item-actions-future">
                          <button className="contact-btn-future" onClick={() => setCurrentTab('chat')}>
                            <MessageCircle size={16} />
                            ติดต่อ
                          </button>
                          <button 
                            className="delete-btn-future"
                            onClick={() => setSavedProperties(savedProperties.filter(id => id !== property.id))}
                          >
                            <Trash2 size={16} />
                            ลบ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="saved-empty-future">
                    <p>ยังไม่มีรายการที่บันทึก</p>
                  </div>
                )}              </div>

              {/* RIGHT SIDE - SUMMARY */}
              {allProperties.filter(p => savedProperties.includes(p.id)).length > 0 && (
                <div className="saved-summary-future">
                  <div className="saved-summary-box-future">
                    <h3>สรุปรายการ</h3>
                    <div className="summary-item-future">
                      <span>จำนวนรายการ</span>
                      <strong>{allProperties.filter(p => savedProperties.includes(p.id)).length}</strong>
                    </div>
                    <div className="summary-divider-future"></div>
                    <button className="summary-action-btn-future">ดูทั้งหมด</button>
                  </div>

                  <div className="saved-alert-box-future">
                    <div className="alert-icon-future"><Bell size={24} /></div>
                    <h4>ตั้งแจ้งเตือนราคา</h4>
                    <p>รับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงราคา</p>
                    <button className="alert-action-btn-future">ตั้งแจ้งเตือน</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== CHAT TAB ===== */}
      {currentTab === 'chat' && (
        <section className="chat-section-future">
          <div className="container-future">
            <div className="chat-container-future">
              <div className="chat-list-future">
                <div className="chat-header-future">
                  <h2>💬 ข้อความของฉัน</h2>
                </div>
                <div className="chat-item-future active">
                  <div className="chat-avatar-future">สม</div>
                  <div className="chat-info-future">
                    <h3>สมชาย ศรีวิทย์</h3>
                    <p>บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น</p>
                  </div>
                </div>
                <div className="chat-item-future">
                  <div className="chat-avatar-future">น่อ</div>
                  <div className="chat-info-future">
                    <h3>นวลจันทร์ ทรัพย์สุข</h3>
                    <p>คอนโดหรู ริมแม่น้ำเจ้าพระยา</p>
                  </div>
                </div>
              </div>

              <div className="chat-window-future">
                <div className="chat-window-header-future">
                  <div>
                    <h3>สมชาย ศรีวิทย์</h3>
                    <p>บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น</p>
                  </div>
                </div>

                <div className="chat-messages-future">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`message-group-future ${msg.sender}`}>
                      <div className="message-future">
                        <p>{msg.text}</p>
                        <span className="message-time-future">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  {/* CONTRACT FILE MESSAGE */}
                  <div className="message-group-future owner">
                    <div className="message-future">
                      <div className="contract-file-message-future">
                        <FileCheck size={24} />
                        <div className="contract-file-info-future">
                          <p className="contract-file-name-future">สัญญาเช่า_3ปี.pdf</p>
                          <p className="contract-file-desc-future">สัญญาเช่า (≤3 ปี)</p>
                        </div>
                        <div className="contract-file-actions-future">
                          <button className="contract-file-download-future" title="ดาวน์โหลด">
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                      <span className="message-time-future">10:37 AM</span>
                    </div>
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-future">
                  <button 
                    className="chat-attach-btn-future" 
                    title="แนบไฟล์"
                    onClick={(e) => {
                      e.preventDefault();
                      const fileInput = document.getElementById('chat-file-input');
                      fileInput?.click();
                    }}
                  >
                    <Plus size={20} />
                  </button>
                  <input 
                    type="file" 
                    id="chat-file-input" 
                    style={{ display: 'none' }}
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        alert(`ไฟล์ที่เลือก: ${file.name}`);
                      }
                    }}
                  />
                  <input 
                    type="text" 
                    placeholder="พิมพ์ข้อความ..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatInput.trim()) {
                        const newMessage = {
                          id: chatMessages.length + 1,
                          sender: 'buyer',
                          text: chatInput,
                          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                        };
                        setChatMessages([...chatMessages, newMessage]);
                        setChatInput('');
                      }
                    }}
                  />
                  <button 
                    className="chat-send-btn-future"
                    onClick={() => {
                      if (chatInput.trim()) {
                        const newMessage = {
                          id: chatMessages.length + 1,
                          sender: 'buyer',
                          text: chatInput,
                          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                        };
                        setChatMessages([...chatMessages, newMessage]);
                        setChatInput('');
                      }
                    }}
                  >
                    <Zap size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== PROFILE TAB ===== */}
      {currentTab === 'profile' && (
        <section className="profile-section-future">
          <div className="container-future">
            <div className="profile-wrapper-future">
              {/* Profile Header */}
              <div className="profile-header-pro-future">
                <div className="profile-header-bg-future"></div>
                <div className="profile-header-content-future">
                  <div className="profile-avatar-pro-future">ผ</div>
                  <div className="profile-header-info-future">
                    <h1>ผู้ใช้ HaaTee</h1>
                    <p>user@haatee.com</p>
                    <span className="profile-verified-badge-future">✓ ยืนยันตัวตนแล้ว</span>
                  </div>
                </div>
              </div>

              {/* Profile Tabs */}
              <div className="profile-tabs-future">
                <button 
                  className={`profile-tab-btn-future ${profileTab === 'info' ? 'active' : ''}`}
                  onClick={() => setProfileTab('info')}
                >
                  <User size={18} />
                  ข้อมูลโปรไฟล์
                </button>
                <button 
                  className={`profile-tab-btn-future ${profileTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setProfileTab('edit')}
                >
                  <Settings size={18} />
                  แก้ไขข้อมูล
                </button>
                <button 
                  className={`profile-tab-btn-future ${profileTab === 'contract' ? 'active' : ''}`}
                  onClick={() => setProfileTab('contract')}
                >
                  <FileText size={18} />
                  สัญญา
                </button>
                <button 
                  className={`profile-tab-btn-future ${profileTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setProfileTab('settings')}
                >
                  <Sliders size={18} />
                  ตั้งค่า
                </button>
              </div>

              {/* Profile Content */}
              {profileTab === 'info' && (
                /* View Mode - Profile Info */
                <div className="profile-content-future">
                  <div className="profile-card-grid-future">
                    <div className="profile-info-card-future">
                      <h3>ข้อมูลส่วนตัว</h3>
                      <div className="info-item-future">
                        <span className="info-label-future">ชื่อเต็ม</span>
                        <span className="info-value-future">ผู้ใช้ HaaTee</span>
                      </div>
                      <div className="info-item-future">
                        <span className="info-label-future">อีเมล</span>
                        <span className="info-value-future">user@haatee.com</span>
                      </div>
                      <div className="info-item-future">
                        <span className="info-label-future">เบอร์โทรศัพท์</span>
                        <span className="info-value-future">081-234-5678</span>
                      </div>
                      <div className="info-item-future">
                        <span className="info-label-future">จังหวัด</span>
                        <span className="info-value-future">กรุงเทพมหานคร</span>
                      </div>
                    </div>

                    <div className="profile-stats-card-future">
                      <h3>สถิติการใช้งาน</h3>
                      <div className="stat-item-future">
                        <div className="stat-number-future">24</div>
                        <div className="stat-label-future">ทรัพย์สินที่บันทึก</div>
                      </div>
                      <div className="stat-item-future">
                        <div className="stat-number-future">8</div>
                        <div className="stat-label-future">การติดต่อ</div>
                      </div>
                      <div className="stat-item-future">
                        <div className="stat-number-future">15</div>
                        <div className="stat-label-future">วันที่ใช้งาน</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'edit' && (
                /* Edit Mode */
                <div className="profile-edit-form-future">
                  <div className="edit-form-section-future">
                    <h3>แก้ไขข้อมูลส่วนตัว</h3>
                    <div className="form-grid-future">
                      <div className="form-group-pro-future">
                        <label>ชื่อเต็ม</label>
                        <input type="text" defaultValue="ผู้ใช้ HaaTee" />
                      </div>
                      <div className="form-group-pro-future">
                        <label>นามสกุล</label>
                        <input type="text" placeholder="กรอกนามสกุล" />
                      </div>
                    </div>

                    <div className="form-group-pro-future">
                      <label>อีเมล</label>
                      <input type="email" defaultValue="user@haatee.com" />
                    </div>

                    <div className="form-group-pro-future">
                      <label>เบอร์โทรศัพท์</label>
                      <input type="tel" defaultValue="081-234-5678" />
                    </div>

                    <div className="form-grid-future">
                      <div className="form-group-pro-future">
                        <label>จังหวัด</label>
                        <select>
                          <option>กรุงเทพมหานคร</option>
                          <option>นนทบุรี</option>
                          <option>สมุทรปราการ</option>
                          <option>สมุทรสาคร</option>
                        </select>
                      </div>
                      <div className="form-group-pro-future">
                        <label>อำเภอ</label>
                        <input type="text" placeholder="กรอกอำเภอ" />
                      </div>
                    </div>
                  </div>

                  <div className="edit-form-section-future">
                    <h3>ช่องทางโซเชียลมีเดีย</h3>
                    <div className="social-media-grid-future">
                      <div className="form-group-pro-future">
                        <label>Facebook</label>
                        <div className="social-input-group-future">
                          <span className="social-icon-future">f</span>
                          <input type="text" placeholder="ชื่อ Facebook ของคุณ" />
                        </div>
                      </div>

                      <div className="form-group-pro-future">
                        <label>Instagram</label>
                        <div className="social-input-group-future">
                          <span className="social-icon-future">📷</span>
                          <input type="text" placeholder="@username" />
                        </div>
                      </div>

                      <div className="form-group-pro-future">
                        <label>Line</label>
                        <div className="social-input-group-future">
                          <span className="social-icon-future">🟢</span>
                          <input type="text" placeholder="Line ID" />
                        </div>
                      </div>

                      <div className="form-group-pro-future">
                        <label>TikTok</label>
                        <div className="social-input-group-future">
                          <span className="social-icon-future">🎵</span>
                          <input type="text" placeholder="@username" />
                        </div>
                      </div>

                      <div className="form-group-pro-future">
                        <label>YouTube</label>
                        <div className="social-input-group-future">
                          <span className="social-icon-future">▶️</span>
                          <input type="text" placeholder="ช่อง YouTube" />
                        </div>
                      </div>

                      <div className="form-group-pro-future">
                        <label>Website/Blog</label>
                        <div className="social-input-group-future">
                          <span className="social-icon-future">🌐</span>
                          <input type="url" placeholder="https://example.com" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="edit-form-actions-future">
                    <button className="btn-save-pro-future">บันทึกข้อมูล</button>
                    <button className="btn-cancel-pro-future" onClick={() => setProfileTab('info')}>ยกเลิก</button>
                  </div>
                </div>
              )}

              {profileTab === 'contract' && (
                /* Contract Tab */
                <div className="profile-content-future">
                  <div className="profile-section-header-future">
                    <h2>สัญญาและเอกสาร</h2>
                    <p>ประวัติการจดทะเบียนและสัญญาของคุณ</p>
                  </div>
                  <div className="contracts-list-future">
                    <div className="contract-card-future">
                      <div className="contract-header-future">
                        <div className="contract-info-future">
                          <h4>สัญญาเช่า - คอนโดมิเนียมชมพร</h4>
                          <p>หมายเลขสัญญา: HAA-2024-001</p>
                        </div>
                        <span className="contract-status-future">อยู่ระหว่างสัญญา</span>
                      </div>
                      <div className="contract-details-future">
                        <span>เริ่มต้น: 1 มกราคม 2567</span>
                        <span>สิ้นสุด: 31 ธันวาคม 2567</span>
                        <span>ค่าเช่า: 15,000 บาท/เดือน</span>
                      </div>
                      <div className="contract-actions-future">
                        <button className="btn-view-pro-future">ดูเอกสาร</button>
                        <button className="btn-download-pro-future">ดาวน์โหลด</button>
                      </div>
                    </div>

                    <div className="contract-card-future">
                      <div className="contract-header-future">
                        <div className="contract-info-future">
                          <h4>สัญญาซื้อขาย - บ้านเดี่ยวสวนสยาม</h4>
                          <p>หมายเลขสัญญา: HAA-2024-002</p>
                        </div>
                        <span className="contract-status-completed-future">เสร็จสิ้น</span>
                      </div>
                      <div className="contract-details-future">
                        <span>วันทำสัญญา: 15 กุมภาพันธ์ 2567</span>
                        <span>ราคา: 3,500,000 บาท</span>
                        <span>สถานะ: จดทะเบียนเสร็จเรียบร้อย</span>
                      </div>
                      <div className="contract-actions-future">
                        <button className="btn-view-pro-future">ดูเอกสาร</button>
                        <button className="btn-download-pro-future">ดาวน์โหลด</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'settings' && (
                /* Settings Tab */
                <div className="profile-content-future settings-content-future">
                  <div className="profile-section-header-future">
                    <h2>ตั้งค่า</h2>
                    <p>จัดการการแจ้งเตือน ความปลอดภัย และความเป็นส่วนตัว</p>
                  </div>

                  {/* Notification Settings */}
                  <div className="settings-section-future">
                    <div className="settings-section-header-future">
                      <Bell size={24} />
                      <div>
                        <h3>การแจ้งเตือน</h3>
                        <p>จัดการวิธีการแจ้งเตือนของคุณ</p>
                      </div>
                    </div>

                    <div className="settings-group-future">
                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">การแจ้งเตือนทางอีเมล</span>
                          <span className="setting-desc-future">รับการแจ้งเตือนสำคัญผ่านอีเมล</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={notificationSettings.emailNotifications} onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">การแจ้งเตือน Push</span>
                          <span className="setting-desc-future">รับการแจ้งเตือนทั่วไปบนอุปกรณ์ของคุณ</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={notificationSettings.pushNotifications} onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">การแจ้งเตือน SMS</span>
                          <span className="setting-desc-future">รับข้อความแจ้งเตือนสำคัญ</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={notificationSettings.smsNotifications} onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-divider-future"></div>

                    <div className="settings-sub-group-future">
                      <h4>ประเภทการแจ้งเตือน</h4>
                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">ทรัพย์สินใหม่ที่ตรงกับความต้องการ</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={notificationSettings.newProperty} onChange={(e) => setNotificationSettings({...notificationSettings, newProperty: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">เปลี่ยนแปลงราคาของทรัพย์สินที่บันทึก</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={notificationSettings.priceChange} onChange={(e) => setNotificationSettings({...notificationSettings, priceChange: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">ข้อความจากตัวแทน</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={notificationSettings.agentMessage} onChange={(e) => setNotificationSettings({...notificationSettings, agentMessage: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="settings-section-future">
                    <div className="settings-section-header-future">
                      <Lock size={24} />
                      <div>
                        <h3>ความเป็นส่วนตัว</h3>
                        <p>ควบคุมความมองเห็นและการแชร์ข้อมูลของคุณ</p>
                      </div>
                    </div>

                    <div className="settings-group-future">
                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">ช่วงโปรไฟล์สาธารณะ</span>
                          <span className="setting-desc-future">ให้ผู้อื่นค้นหาและเห็นโปรไฟล์ของคุณ</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={privacySettings.profileVisible} onChange={(e) => setPrivacySettings({...privacySettings, profileVisible: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">แสดงหมายเลขโทรศัพท์</span>
                          <span className="setting-desc-future">ให้ผู้อื่นสามารถดูหมายเลขโทรศัพท์ของคุณได้</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={privacySettings.showPhoneNumber} onChange={(e) => setPrivacySettings({...privacySettings, showPhoneNumber: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">อนุญาตให้ส่งข้อความ</span>
                          <span className="setting-desc-future">อนุญาตให้ผู้อื่นส่งข้อความหาคุณ</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={privacySettings.allowMessages} onChange={(e) => setPrivacySettings({...privacySettings, allowMessages: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">แชร์กิจกรรมของฉัน</span>
                          <span className="setting-desc-future">ให้ผู้ติดตามเห็นกิจกรรมของคุณ</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={privacySettings.shareActivity} onChange={(e) => setPrivacySettings({...privacySettings, shareActivity: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="settings-section-future">
                    <div className="settings-section-header-future">
                      <Shield size={24} />
                      <div>
                        <h3>ความปลอดภัย</h3>
                        <p>ปกป้องบัญชีของคุณจากการเข้าถึงโดยไม่ได้รับอนุญาต</p>
                      </div>
                    </div>

                    <div className="settings-group-future">
                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">การยืนยันตัวตน 2 ขั้น (2FA)</span>
                          <span className="setting-desc-future">เพิ่มชั้นความปลอดภัยเพิ่มเติมให้กับบัญชีของคุณ</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={securitySettings.twoFactor} onChange={(e) => setSecuritySettings({...securitySettings, twoFactor: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">แจ้งเตือนการเข้าสู่ระบบ</span>
                          <span className="setting-desc-future">รับการแจ้งเตือนเมื่อมีการเข้าสู่ระบบจากอุปกรณ์ใหม่</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" defaultChecked={securitySettings.loginAlerts} onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>

                      <div className="setting-item-future">
                        <div className="setting-label-future">
                          <span className="setting-title-future">การจัดการอุปกรณ์</span>
                          <span className="setting-desc-future">ดูและบริหารจัดการอุปกรณ์ที่เข้าสู่ระบบ</span>
                        </div>
                        <button className="btn-manage-device-future">จัดการอุปกรณ์</button>
                      </div>
                    </div>

                    <div className="settings-divider-future"></div>

                    <div className="settings-sub-group-future">
                      <h4>รหัสผ่าน</h4>
                      <button className="btn-change-password-future">เปลี่ยนรหัสผ่าน</button>
                      <p className="setting-desc-future">เปลี่ยนรหัสผ่านของคุณเป็นประจำเพื่อรักษาความปลอดภัย</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer-future">
        <div className="container-future">
          <div className="footer-grid-future">
            <div className="footer-col-future footer-about-future">
              <div className="footer-logo-future">
                <Sparkles size={24} />
                <span>HaaTee</span>
              </div>
              <p className="footer-desc-future">
                แพลตฟอร์มอสังหาริมทรัพย์ที่ทันสมัยและน่าเชื่อถือสำหรับผู้ซื้อและผู้เช่า
              </p>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">เมนูหลัก</h5>
              <ul className="footer-links-future">
                <li><button onClick={() => onNavigate('home')}>หน้าแรก</button></li>
                <li><button onClick={() => setCurrentTab('browse')}>ค้นหาทรัพย์สิน</button></li>
                <li><button onClick={() => setCurrentTab('saved')}>โปรดของฉัน</button></li>
                <li><button onClick={() => setCurrentTab('profile')}>โปรไฟล์</button></li>
              </ul>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">ข้อมูล</h5>
              <ul className="footer-links-future">
                <li><button>เกี่ยวกับเรา</button></li>
                <li><button>เงื่อนไขการใช้งาน</button></li>
                <li><button>นโยบายความเป็นส่วนตัว</button></li>
                <li><button>ติดต่อเรา</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-future">
            <p>&copy; 2025 HaaTee. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* STATION SELECTION MODAL */}
      {showStationModal && (
        <div className="station-modal-overlay-future" onClick={() => {
          setShowStationModal(false);
          setSelectedLine(null);
        }}>
          <div className="station-modal-future" onClick={(e) => e.stopPropagation()}>
            <div className={`station-modal-header-future ${selectedLine ? selectedLine.includes('เขียว') ? 'green-line' : selectedLine.includes('ม่วง') && selectedLine.includes('BTS') ? 'purple-line' : selectedLine.includes('แดง') ? 'red-line' : selectedLine.includes('น้ำเงิน') ? 'blue-line' : 'dark-purple-line' : ''}`}>
              <h2>{selectedLine ? selectedLine : 'เลือกสถานีรถไฟฟ้า'}</h2>
              <button className="station-modal-close-future" onClick={() => {
                setShowStationModal(false);
                setSelectedLine(null);
              }}>
                <X size={24} />
              </button>
            </div>

            <div className="station-modal-content-future">
              {!selectedLine ? (
                // Show lines selection
                <div className="station-lines-grid-future">
                  {Object.keys(stationsByLine).map((line) => (
                    <button
                      key={line}
                      className="station-line-btn-future"
                      onClick={() => setSelectedLine(line)}
                    >
                      {line}
                    </button>
                  ))}
                </div>
              ) : (
                // Show stations for selected line
                <div>
                  <button 
                    className="station-back-btn-future"
                    onClick={() => setSelectedLine(null)}
                  >
                    ← กลับ
                  </button>
                  <input
                    type="text"
                    className="station-search-input-future"
                    placeholder="ค้นหาสถานที่โครงการ..."
                    value={stationSearchInput}
                    onChange={(e) => setStationSearchInput(e.target.value)}
                  />
                  <div className="station-buttons-future">
                    {stationsByLine[selectedLine]
                      .filter((station) =>
                        station.toLowerCase().includes(stationSearchInput.toLowerCase())
                      )
                      .map((station) => (
                        <button
                          key={station}
                          className="station-btn-future"
                          onClick={() => {
                            setSearchTerm(station);
                            setShowStationModal(false);
                            setSelectedLine(null);
                            setStationSearchInput('');
                          }}
                        >
                          {station}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
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
    </div>
  );
};

export default Buyer;
