import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Bath, Bed, Search, ChevronDown, Star, CheckCircle, SlidersHorizontal, ArrowRight, TrendingUp, Building, Sparkles, FileCheck, Shield, Zap, Clock, Bell, Award, Home as HomeIcon, BarChart3, Menu } from 'lucide-react';

import '../styles/Properties.css';
import propertiesData from '../data/properties.json';

const Properties = ({ onNavigate, onLoginRequired }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchType, setSearchType] = useState('buy'); // 'buy' for sale, 'rent' for rent
  const [selectedType, setSelectedType] = useState('ทั้งหมด');
  const [selectedPrice, setSelectedPrice] = useState('ทั้งหมด');
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Load properties from imported JSON
  useEffect(() => {
    try {
      setAllProperties(propertiesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading properties:', error);
      setAllProperties([]);
      setLoading(false);
    }
  }, []);

  const filteredProperties = allProperties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ทั้งหมด' || prop.type === selectedType;
    const matchesListingType = searchType === 'buy' ? prop.listingType === 'sale' : prop.listingType === 'rent';
    
    return matchesSearch && matchesType && matchesListingType;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>กำลังโหลดข้อมูล...</div>;
  }

  // Mock data removed - all data loaded from JSON
  
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
          
          {/* Pagination */}
          <div className="pagination-future" style={{ marginBottom: '20px', display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '8px 12px',
                  border: page === currentPage ? '2px solid #4CAF50' : '1px solid #ddd',
                  background: page === currentPage ? '#4CAF50' : 'white',
                  color: page === currentPage ? 'white' : 'black',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROPERTIES GRID ===== */}
      <section className="properties-listing-future">
        <div className="container-future">
          {paginatedProperties.length > 0 ? (
            <div className="properties-grid-future">
              {paginatedProperties.map((property) => (
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
                    
                    {property.listingType === 'rent' && (
                      <div className="listing-type-badge-future" style={{ background: '#FF6B6B', position: 'absolute', top: '45px', right: '10px', padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                        <span>เช่า</span>
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
              <p className="showing-text-future">แสดงหน้า {currentPage} จาก {totalPages} | ทั้งหมด {filteredProperties.length} รายการ</p>
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
