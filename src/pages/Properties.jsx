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
      views: 756
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
      views: 1120
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
      views: 423
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
      views: 542
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
      views: 678
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
      views: 980
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
      views: 534
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
      views: 890
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
      views: 742
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
      views: 856
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
      views: 645
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
      views: 521
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
      views: 412
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
      views: 634
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
      views: 1250
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
      views: 945
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
      views: 678
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
            <span className="logo-badge-future">Beta</span>
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
                <div key={property.id} className="property-card-future">
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
