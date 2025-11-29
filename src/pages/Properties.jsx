import React, { useState, useEffect, useMemo } from 'react';
import { Heart, MapPin, Bath, Bed, Search, ChevronDown, Star, CheckCircle, SlidersHorizontal, ArrowRight, TrendingUp, Building, Sparkles, FileCheck, Shield, Zap, Clock, Bell, Award, Home as HomeIcon, BarChart3, Menu, X } from 'lucide-react';

import '../styles/Home.css';
import '../pages/Buyer/Buyer.css';
import propertiesData from '../data/properties.json';

const Properties = ({ onNavigate, onLoginRequired }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('buy'); // 'buy' for sale, 'rent' for rent
  const [selectedType, setSelectedType] = useState('ทั้งหมด');
  const [selectedPrice, setSelectedPrice] = useState('ทั้งหมด');
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด');
  // Load properties immediately - no useEffect needed
  const [allProperties] = useState(() => {
    try {
      if (propertiesData && Array.isArray(propertiesData)) {
        return propertiesData;
      }
      return [];
    } catch (error) {
      console.error('Error loading properties:', error);
      return [];
    }
  });
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price-low', 'price-high'
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayCount, setDisplayCount] = useState(24); // Show 24 properties initially

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto slide hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load search parameters from Home page
  useEffect(() => {
    const params = sessionStorage.getItem('homeSearchParams');
    if (params) {
      try {
        const searchParams = JSON.parse(params);
        if (searchParams.location) {
          setSearchTerm(searchParams.location);
        }
        if (searchParams.type) {
          setSelectedType(searchParams.type);
        }
        if (searchParams.price) {
          // Map price ranges from Home.jsx to Properties.jsx format
          const priceMap = {
            'under-1m': 'ต่ำกว่า 5 ล้าน',
            '1-3m': '5-10 ล้าน',
            '3-5m': '5-10 ล้าน',
            '5-10m': '10-20 ล้าน',
            'over-10m': 'มากกว่า 30 ล้าน'
          };
          if (priceMap[searchParams.price]) {
            setSelectedPrice(priceMap[searchParams.price]);
          }
        }
        sessionStorage.removeItem('homeSearchParams');
      } catch (e) {
        console.error('Error parsing search params:', e);
      }
    }
  }, []);

  // Helper function to parse price string to number
  const parsePriceValue = (priceStr) => {
    if (!priceStr) return 0;
    const cleaned = priceStr.toString().replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Get actual price value for sorting/filtering
  const getPropertyPriceValue = (property) => {
    if (!property) return 0;
    return property.priceValue || 
           (searchType === 'buy' ? property.salePrice : property.rentPrice) || 
           parsePriceValue(property.price) || 
           0;
  };

  // Helper to parse price from string
  const parsePriceFromString = (priceStr) => {
    if (!priceStr) return 0;
    const cleaned = priceStr.toString().replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Get display price (เหมือน Buyer.jsx)
  const getDisplayPrice = (property) => {
    if (!property) return 'ราคาไม่ระบุ';
    if (searchType === 'rent') {
      const rentPrice = property.rentPrice || property.priceValue || parsePriceFromString(property.price);
      return rentPrice > 0 ? `฿${rentPrice.toLocaleString('th-TH')}/เดือน` : property.price || 'ราคาไม่ระบุ';
    }
    const salePrice = property.salePrice || property.priceValue || parsePriceFromString(property.price);
    return property.price || (salePrice > 0 ? `฿${salePrice.toLocaleString('th-TH')}` : 'ราคาไม่ระบุ');
  };

  // Price ranges for filtering
  const priceRanges = [
    { name: 'ทั้งหมด', min: 0, max: Infinity },
    { name: 'ต่ำกว่า 5 ล้าน', min: 0, max: 5000000 },
    { name: '5-10 ล้าน', min: 5000000, max: 10000000 },
    { name: '10-20 ล้าน', min: 10000000, max: 20000000 },
    { name: '20-30 ล้าน', min: 20000000, max: 30000000 },
    { name: 'มากกว่า 30 ล้าน', min: 30000000, max: Infinity },
  ];

  const filteredProperties = useMemo(() => {
    if (!Array.isArray(allProperties) || allProperties.length === 0) {
      return [];
    }
    
    try {
      return allProperties.filter(prop => {
        if (!prop) return false;
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
                             (prop.title && prop.title.toLowerCase().includes(searchLower)) ||
                             (prop.location && prop.location.toLowerCase().includes(searchLower)) ||
                             (prop.district && prop.district.toLowerCase().includes(searchLower)) ||
                             (prop.bts?.station && prop.bts.station.toLowerCase().includes(searchLower));
        const matchesType = selectedType === 'ทั้งหมด' || prop.type === selectedType;
        const matchesListingType = searchType === 'buy' ? prop.listingType === 'sale' : prop.listingType === 'rent';
        
        // Location filter
        const matchesLocation = selectedLocation === 'ทั้งหมด' || 
                               (prop.location && prop.location.toLowerCase().includes(selectedLocation.toLowerCase())) ||
                               (prop.district && prop.district.toLowerCase().includes(selectedLocation.toLowerCase()));
        
        // Price filter
        const priceRange = priceRanges.find(p => p.name === selectedPrice);
        const propertyPrice = getPropertyPriceValue(prop);
        const matchesPrice = !priceRange || (propertyPrice >= priceRange.min && propertyPrice <= priceRange.max);
        
        return matchesSearch && matchesType && matchesListingType && matchesLocation && matchesPrice;
      });
    } catch (error) {
      console.error('Error filtering properties:', error);
      return [];
    }
  }, [allProperties, searchTerm, selectedType, selectedLocation, selectedPrice, searchType]);

  // Sort properties based on sortOrder
  const sortedProperties = useMemo(() => {
    if (!filteredProperties || filteredProperties.length === 0) return [];
    const sorted = [...filteredProperties];
    if (sortOrder === 'price-low') {
      sorted.sort((a, b) => {
        const priceA = getPropertyPriceValue(a);
        const priceB = getPropertyPriceValue(b);
        return priceA - priceB;
      });
    } else if (sortOrder === 'price-high') {
      sorted.sort((a, b) => {
        const priceA = getPropertyPriceValue(a);
        const priceB = getPropertyPriceValue(b);
        return priceB - priceA;
      });
    }
    return sorted;
  }, [filteredProperties, sortOrder, searchType]);

  // Display limited properties initially for better performance
  const displayedProperties = useMemo(() => {
    return sortedProperties.slice(0, displayCount);
  }, [sortedProperties, displayCount]);
  
  // Check if there are more properties to load
  const hasMore = sortedProperties.length > displayCount;

  // Get featured properties for hero slider (memoized)
  const featuredProperties = useMemo(() => allProperties.slice(0, 3), [allProperties]);
  
  // Memoize property types to avoid recalculating on every render
  const propertyTypes = useMemo(() => [
    { name: 'ทั้งหมด', count: allProperties.length },
    { name: 'บ้านเดี่ยว', count: allProperties.filter(p => p.type === 'บ้านเดี่ยว').length },
    { name: 'คอนโด', count: allProperties.filter(p => p.type === 'คอนโด').length },
    { name: 'ทาวน์เฮาส์', count: allProperties.filter(p => p.type === 'ทาวน์เฮาส์').length },
    { name: 'วิลล่า', count: allProperties.filter(p => p.type === 'วิลล่า').length },
  ], [allProperties]);

  const locations = [
    { name: 'ทั้งหมด' },
    { name: 'กรุงเทพฯ' },
    { name: 'ภูเก็ต' },
    { name: 'ปทุมธานี' },
    { name: 'เชียงใหม่' },
    { name: 'พัทยา' },
  ];

  return (
    <div className="home-page-future">
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
          <div className="logo-future" onClick={() => onNavigate('home')}>
            <Sparkles size={24} />
            <span>HaaTee</span>
          </div>

          <nav className="nav-menu-future">
            <button className="nav-link-future active" onClick={() => onNavigate('properties')}>
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

          <button className="menu-toggle-future" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu-future">
            <button className="mobile-link-future" onClick={() => { onNavigate('properties'); setIsMenuOpen(false); }}>
              ค้นหาทรัพย์สิน
            </button>
            <button className="mobile-link-future" onClick={() => { onNavigate('about'); setIsMenuOpen(false); }}>
              เกี่ยวกับเรา
            </button>
            <button className="mobile-link-future" onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }}>
              ติดต่อเรา
            </button>
            <button className="mobile-cta-future" onClick={() => { onNavigate('login'); setIsMenuOpen(false); }}>
              เข้าสู่ระบบ
            </button>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION (แบบ Home.jsx) ===== */}
      <section className="hero-future">
        <div className="hero-bg-slider">
          {featuredProperties.map((property, idx) => (
            <div
              key={property.id || idx}
              className={`hero-slide-future ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${property.image || '/B.jpg'})` }}
            >
              <div className="hero-gradient-overlay" />
            </div>
          ))}
        </div>

        <div className="geometric-pattern" />

        <div className="hero-content-future">
          <div className="hero-badge-future">
            <Sparkles size={14} />
            <span>ค้นหาบ้านในฝันของคุณ</span>
          </div>

          <h1 className="hero-title-future">
            ค้นหาทรัพย์สิน<br />
            <span className="gradient-text-future">ที่ใช่สำหรับคุณ</span>
          </h1>

          <p className="hero-subtitle-future">
            แพลตฟอร์มอสังหาริมทรัพย์ครบวงจร พร้อมระบบค้นหาอัจฉริยะ สัญญาดิจิทัลถูกกฎหมาย และการยืนยันตัวตนที่ปลอดภัย
          </p>
        </div>
      </section>

      {/* SEARCH BAR FLOATING OVERLAY */}
      <div className="search-bar-floating-future">
        <div className="search-bar-wrapper-future">
          <div className="search-mode-toggle-future">
            <button 
              className={`toggle-btn-future ${searchType === 'buy' ? 'active' : ''}`}
              onClick={() => setSearchType('buy')}
            >
              ซื้อ
            </button>
            <button 
              className={`toggle-btn-future ${searchType === 'rent' ? 'active' : ''}`}
              onClick={() => setSearchType('rent')}
            >
              เช่า
            </button>
          </div>

          <div className="search-input-container-future">
            <Search size={18} style={{ color: '#1976D2' }} />
            <input 
              type="text" 
              placeholder="ค้นหาสถานที่ หรือ โครงการ" 
              className="search-input-future"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  const resultsSection = document.querySelector('[data-results-section]');
                  if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
            />
            <button 
              className="search-btn-future"
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                const resultsSection = document.querySelector('[data-results-section]');
                if (resultsSection) {
                  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              title="ค้นหา"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="search-filters-grid-future">
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
                    {locations.map((loc, idx) => (
                      <button
                        key={idx}
                        className="filter-menu-item-future"
                        onClick={() => setSelectedLocation(loc.name)}
                      >
                        {loc.name}
                      </button>
                    ))}
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
                    {propertyTypes.map((type, idx) => (
                      <button
                        key={idx}
                        className="filter-menu-item-future"
                        onClick={() => setSelectedType(type.name)}
                      >
                        {type.name}
                      </button>
                    ))}
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
                    {priceRanges.map((range, idx) => (
                      <button
                        key={idx}
                        className="filter-menu-item-future"
                        onClick={() => setSelectedPrice(range.name)}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* ===== SEARCH RESULTS SECTION (เหมือน Buyer) ===== */}
      <section data-results-section style={{ 
        marginTop: '40px', 
        paddingTop: '40px', 
        paddingBottom: '40px',
        position: 'relative', 
        minHeight: 'auto', 
        background: '#FAFAFA',
        width: '100%'
      }}>
        <div style={{ 
          padding: '0 48px 40px 48px', 
          maxWidth: '1400px', 
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '32px', 
            marginBottom: '40px', 
            flexWrap: 'wrap' 
          }}>
            <button 
              onClick={() => onNavigate('home')}
              style={{
                padding: '10px 16px',
                background: 'white',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#F5F5F5';
                e.currentTarget.style.borderColor = '#1976D2';
                e.currentTarget.style.color = '#1976D2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.color = '#333';
              }}
            >
              ← ย้อนกลับ
            </button>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0A0A0A', margin: '0 0 8px 0', lineHeight: '1.2' }}>ผลการค้นหา</h2>
              <p style={{ fontSize: '16px', color: '#666', margin: '0 0 8px 0' }}>{searchTerm || 'ทั้งหมด'}</p>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                {searchTerm && <span>ค้นหา: <strong>{searchTerm}</strong></span>}
                {selectedType !== 'ทั้งหมด' && (
                  <>
                    {searchTerm && <span> • </span>}
                    <span>ประเภท: <strong>{selectedType}</strong></span>
                  </>
                )}
                {selectedLocation !== 'ทั้งหมด' && (
                  <>
                    {(searchTerm || selectedType !== 'ทั้งหมด') && <span> • </span>}
                    <span>ทำเล: <strong>{selectedLocation}</strong></span>
                  </>
                )}
                {selectedPrice !== 'ทั้งหมด' && (
                  <>
                    {(searchTerm || selectedType !== 'ทั้งหมด' || selectedLocation !== 'ทั้งหมด') && <span> • </span>}
                    <span>ราคา: <strong>{selectedPrice}</strong></span>
                  </>
                )}
                {searchType === 'buy' && (
                  <>
                    {(searchTerm || selectedType !== 'ทั้งหมด' || selectedLocation !== 'ทั้งหมด' || selectedPrice !== 'ทั้งหมด') && <span> • </span>}
                    <span>โหมด: <strong>ซื้อ</strong></span>
                  </>
                )}
                {searchType === 'rent' && (
                  <>
                    {(searchTerm || selectedType !== 'ทั้งหมด' || selectedLocation !== 'ทั้งหมด' || selectedPrice !== 'ทั้งหมด') && <span> • </span>}
                    <span>โหมด: <strong>เช่า</strong></span>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: '500', whiteSpace: 'nowrap' }}>
                พบ {sortedProperties.length} รายการ
                {displayCount < sortedProperties.length && ` (แสดง ${displayCount} รายการ)`}
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #E8E8E8',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#1976D2';
                    e.currentTarget.style.color = '#1976D2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#E8E8E8';
                    e.currentTarget.style.color = '#333';
                  }}
                >
                  <span>เรียงตาม: </span>
                  <span style={{ fontWeight: '600' }}>
                    {sortOrder === 'price-low' ? 'ราคาต่ำไปสูง' : 
                     sortOrder === 'price-high' ? 'ราคาสูงไปต่ำ' : 
                     'ค่าเริ่มต้น'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                {showSortDropdown && (
                  <>
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 998
                      }}
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'white',
                        border: '1px solid #E8E8E8',
                        borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        zIndex: 999,
                        minWidth: '200px',
                        overflow: 'hidden'
                      }}
                    >
                      <button
                        onClick={() => {
                          setSortOrder('default');
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: sortOrder === 'default' ? '#F0F7FF' : 'white',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: sortOrder === 'default' ? '#1976D2' : '#333',
                          fontWeight: sortOrder === 'default' ? '600' : '400',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (sortOrder !== 'default') {
                            e.currentTarget.style.background = '#F5F5F5';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (sortOrder !== 'default') {
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        ค่าเริ่มต้น
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder('price-low');
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: sortOrder === 'price-low' ? '#F0F7FF' : 'white',
                          border: 'none',
                          borderTop: '1px solid #F0F0F0',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: sortOrder === 'price-low' ? '#1976D2' : '#333',
                          fontWeight: sortOrder === 'price-low' ? '600' : '400',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (sortOrder !== 'price-low') {
                            e.currentTarget.style.background = '#F5F5F5';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (sortOrder !== 'price-low') {
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        ราคาต่ำไปสูง
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder('price-high');
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: sortOrder === 'price-high' ? '#F0F7FF' : 'white',
                          border: 'none',
                          borderTop: '1px solid #F0F0F0',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: sortOrder === 'price-high' ? '#1976D2' : '#333',
                          fontWeight: sortOrder === 'price-high' ? '600' : '400',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (sortOrder !== 'price-high') {
                            e.currentTarget.style.background = '#F5F5F5';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (sortOrder !== 'price-high') {
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        ราคาสูงไปต่ำ
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            {sortedProperties.length > 0 ? (
              <>
                <div className="search-results-grid-future" style={{ gridTemplateColumns: 'repeat(4, 1fr)', display: 'grid', gap: '24px' }}>
                  {displayedProperties.map((property) => {
                    if (!property || !property.id) return null;
                    return (
                      <div key={property.id} className="property-card-future" onClick={() => onNavigate('propertyDetail', { property })}>
                        <div className="property-image-future">
                          <img 
                            src={property.image || '/placeholder.jpg'} 
                            alt={property.title || 'ทรัพย์สิน'} 
                            loading="lazy"
                            onError={(e) => { e.target.src = '/placeholder.jpg'; }} 
                          />
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
                          
                          <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                            <button
                              className="favorite-btn-future"
                              onClick={(e) => {
                                e.stopPropagation();
                                onLoginRequired('บันทึกรายการโปรด');
                              }}
                            >
                              <Heart size={18} />
                            </button>
                          </div>

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
                            <h3 className="property-title-future">{property.title || 'ไม่มีชื่อ'}</h3>
                            <div className="property-price-future">{getDisplayPrice(property)}</div>
                          </div>

                          <div className="property-location-future">
                            <MapPin size={16} />
                            <span>{property.location || 'ไม่ระบุที่อยู่'}</span>
                          </div>

                          <div className="property-meta-future">
                            <span>
                              <Bed size={14} />
                              {property.beds || '-'}
                            </span>
                            <span>
                              <Bath size={14} />
                              {property.baths || '-'}
                            </span>
                            <span>
                              <Building size={14} />
                              {property.size || '-'}
                            </span>
                          </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button 
                          className="view-details-btn-future"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('propertyDetail', { property });
                          }}
                          style={{ flex: 1 }}
                        >
                          <span>ดูรายละเอียด</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                    );
                  })}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '40px',
                  padding: '20px 0'
                }}>
                  <button
                    onClick={() => setDisplayCount(prev => prev + 24)}
                    style={{
                      padding: '14px 32px',
                      background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(25, 118, 210, 0.3)';
                    }}
                  >
                    โหลดเพิ่ม ({sortedProperties.length - displayCount} รายการ)
                  </button>
                </div>
              )}
              </>
            ) : (
              <div className="no-results-future">
                <Search size={48} />
                <h3>ไม่พบผลการค้นหา</h3>
                <p>ลองค้นหาด้วยคำอื่น หรือปรับเปลี่ยนตัวกรอง</p>
              </div>
            )}
          </div>
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
