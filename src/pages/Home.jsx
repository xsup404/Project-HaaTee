import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Bath, Bed, Search, ChevronRight, Menu, X, ArrowRight, Home as HomeIcon, Building, Key, Shield, Clock, CheckCircle, Star, TrendingUp, Users, Award, Sparkles, ChevronLeft, FileCheck, Bell, Zap } from 'lucide-react';
import '../styles/Home.css';
import propertiesData from '../data/properties.json';

const Home = ({ onNavigate, onLoginRequired }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [savedProperties, setSavedProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load featured properties from imported JSON
  useEffect(() => {
    try {
      // Get first 20 properties, shuffle them
      const shuffled = [...propertiesData].sort(() => Math.random() - 0.5).slice(0, 20);
      setFeaturedProperties(shuffled);
      setLoading(false);
    } catch (error) {
      console.error('Error loading properties:', error);
      setFeaturedProperties([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      icon: <Building size={32} />,
      name: 'บ้านเดี่ยว',
      count: '3,245',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      gradient: 'from-blue-500/80 to-cyan-500/80'
    },
    {
      icon: <Building size={32} />,
      name: 'คอนโดมิเนียม',
      count: '5,890',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      gradient: 'from-violet-500/80 to-purple-500/80'
    },
    {
      icon: <HomeIcon size={32} />,
      name: 'ทาวน์เฮาส์',
      count: '2,156',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      gradient: 'from-emerald-500/80 to-teal-500/80'
    },
    {
      icon: <Star size={32} />,
      name: 'รีสอร์ท',
      count: '892',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      gradient: 'from-amber-500/80 to-orange-500/80'
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const handleLoginClick = () => {
    console.log('Navigating to login page');
    onNavigate('login');
  };

  const handleSearch = () => {
    const searchParams = {
      location: searchLocation,
      type: searchType,
      price: searchPrice
    };
    sessionStorage.setItem('homeSearchParams', JSON.stringify(searchParams));
    onNavigate('properties');
  };

  const toggleSavedProperty = (propertyId) => {
    if (savedProperties.includes(propertyId)) {
      setSavedProperties(savedProperties.filter(id => id !== propertyId));
    } else {
      setSavedProperties([...savedProperties, propertyId]);
    }
  };

  return (
    <div className="home-page-future">
      <div
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      <header className={`header-future ${scrollY > 50 ? 'header-scrolled' : ''}`}>
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

      <section className="hero-future">
        <div className="hero-bg-slider">
          {featuredProperties.slice(0, 3).map((property, idx) => (
            <div
              key={property.id}
              className={`hero-slide-future ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${property.image})` }}
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
            Your Next Home,<br />
            <span className="gradient-text-future">Just a Click Away</span>
          </h1>

          <p className="hero-subtitle-future">
            แพลตฟอร์มอสังหาริมทรัพย์ครบวงจร พร้อมระบบค้นหาอัจฉริยะ สัญญาดิจิทัลถูกกฎหมาย และการยืนยันตัวตนที่ปลอดภัย
          </p>

          <div className="hero-search-future">
            <div className="search-field-future">
              <MapPin size={18} />
              <input 
                type="text" 
                placeholder="ค้นหาทำเล, ประเภททรัพย์สิน, ชื่อโครงการ..." 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="search-field-future">
              <Building size={18} />
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="">ประเภททรัพย์สิน</option>
                <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                <option value="คอนโด">คอนโด</option>
                <option value="ทาวน์โฮม">ทาวน์โฮม</option>
                <option value="ที่ดิน">ที่ดิน</option>
                <option value="อพาร์ทเม้นท์">อพาร์ทเม้นท์</option>
                <option value="อาคารพาณิชย์">อาคารพาณิชย์</option>
              </select>
            </div>
            <div className="search-field-future">
              <span className="currency-icon">฿</span>
              <select value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)}>
                <option value="">ช่วงราคา</option>
                <option value="under-1m">ต่ำกว่า 1 ล้าน</option>
                <option value="1-3m">1-3 ล้าน</option>
                <option value="3-5m">3-5 ล้าน</option>
                <option value="5-10m">5-10 ล้าน</option>
                <option value="over-10m">มากกว่า 10 ล้าน</option>
              </select>
            </div>
            <button className="search-btn-future" onClick={handleSearch}>
              <Search size={18} />
              <span>ค้นหา</span>
            </button>
          </div>

          
        </div>

        
      </section>

      <section className="stats-floating-future">
        <div className="container-future">
          <div className="stats-grid-future">
            <div className="stat-card-future">
              <div className="stat-icon-future">
                <Building size={24} />
              </div>
              <h3 className="stat-value-future">12.5K+</h3>
              <p className="stat-label-future">ทรัพย์สินทั้งหมด</p>
            </div>
            <div className="stat-card-future">
              <div className="stat-icon-future">
                <Users size={24} />
              </div>
              <h3 className="stat-value-future">85K+</h3>
              <p className="stat-label-future">ผู้ใช้งานทั่วประเทศ</p>
            </div>
            <div className="stat-card-future">
              <div className="stat-icon-future">
                <Award size={24} />
              </div>
              <h3 className="stat-value-future">45K+</h3>
              <p className="stat-label-future">ธุรกรรมสำเร็จ</p>
            </div>
            <div className="stat-card-future">
              <div className="stat-icon-future">
                <TrendingUp size={24} />
              </div>
              <h3 className="stat-value-future">99.8%</h3>
              <p className="stat-label-future">ความพึงพอใจ</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-future">
        <div className="container-future">
          <div className="section-header-future">
            <div>
              <h2 className="section-title-future">ทรัพย์สินเด่น</h2>
              <p className="section-subtitle-future">ค้นพบทรัพย์สินคุณภาพมากกว่า 50,000 รายการทั่วประเทศ</p>
            </div>
            <button className="view-all-future" onClick={() => onNavigate('properties')}>
              <span>ดูทรัพย์สินทั้งหมด</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="properties-grid-future">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="property-card-future"
                onClick={() => onNavigate('propertyDetail', { property })}
              >
                <div className="property-image-future">
                  <img src={property.image} alt={property.title} />
                  <div className="property-overlay-future" />
                  <div className="property-type-badge-future">{property.type}</div>
                  <button
                    className="favorite-btn-future"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedProperty(property.id);
                    }}
                  >
                    <Heart size={16} fill={savedProperties.includes(property.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="property-content-future">
                  <div className="property-header-future">
                    <h3 className="property-title-future">{property.title}</h3>
                    <div className="property-price-future">{property.price}</div>
                  </div>
                  <p className="property-location-future">
                    <MapPin size={14} />
                    {property.location}
                  </p>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-future">
        <div className="container-future">
          <div className="section-header-center-future">
            <h2 className="section-title-future">ประเภททรัพย์สิน</h2>
            <p className="section-subtitle-future">เลือกประเภททรัพย์สินที่เหมาะกับคุณ</p>
          </div>

          <div className="categories-grid-future">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="category-card-future"
                onClick={() => onNavigate('properties')}
              >
                <div
                  className="category-image-future"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className={`category-gradient bg-gradient-to-br ${category.gradient}`} />
                </div>
                <div className="category-content-future">
                  <div className="category-icon-future">
                    {category.icon}
                  </div>
                  <h3 className="category-name-future">{category.name}</h3>
                  <p className="category-count-future">{category.count} ประกาศ</p>
                  <button className="category-btn-future">
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-future">
        <div className="features-bg-pattern" />
        <div className="container-future">
          <div className="features-content-future">
            <div className="features-header-future">
              <h2 className="features-title-future">
                ทำไมต้องเลือก <span className="gradient-text-future">HaaTee</span>?
              </h2>
              <p className="features-subtitle-future">
                ระบบกรองอัจฉริยะ สัญญาดิจิทัล ยืนยันตัวตน<br />
                แชทในระบบ ไม่มีค่านายหน้า และดูสถิติ Real-time
              </p>
            </div>

            <div className="features-grid-future">
              <div className="feature-card-future">
                <div className="feature-icon-wrapper-future">
                  <FileCheck size={24} />
                </div>
                <h3 className="feature-title-future">ระบบกรองอัจฉริยะ</h3>
                <p className="feature-desc-future">
                  ค้นหาง่าย เจอไว ตรงใจ ด้วยตัวกรองอัจฉริยะ
                </p>
              </div>

              <div className="feature-card-future">
                <div className="feature-icon-wrapper-future">
                  <Shield size={24} />
                </div>
                <h3 className="feature-title-future">สัญญาดิจิทัล</h3>
                <p className="feature-desc-future">
                  ทำสัญญาออนไลน์ ถูกกฎหมาย สำหรับสัญญาเช่า ≤3 ปี
                </p>
              </div>

              <div className="feature-card-future">
                <div className="feature-icon-wrapper-future">
                  <Zap size={24} />
                </div>
                <h3 className="feature-title-future">ยืนยันตัวตน</h3>
                <p className="feature-desc-future">
                  ปลอดภัย 100% ไม่โดนหลอก ด้วยการยืนยันตัวตนที่เข้มงวด
                </p>
              </div>

              <div className="feature-card-future">
                <div className="feature-icon-wrapper-future">
                  <Clock size={24} />
                </div>
                <h3 className="feature-title-future">แชทในระบบ</h3>
                <p className="feature-desc-future">
                  คุยกับเจ้าของได้ทันที ไม่ต้องออกจากแพลตฟอร์ม
                </p>
              </div>

              <div className="feature-card-future">
                <div className="feature-icon-wrapper-future">
                  <Bell size={24} />
                </div>
                <h3 className="feature-title-future">ไม่มีค่านายหน้า</h3>
                <p className="feature-desc-future">
                  ติดต่อตรง ประหยัดกว่า ไม่มีค่านายหน้าในระบบ
                </p>
              </div>

              <div className="feature-card-future">
                <div className="feature-icon-wrapper-future">
                  <Award size={24} />
                </div>
                <h3 className="feature-title-future">ดูสถิติ Real-time</h3>
                <p className="feature-desc-future">
                  รู้ทันที ใครสนใจ กี่คนดู ด้วยแดชบอร์ดมืออาชีพ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-future">
        <div className="cta-gradient-bg" />
        <div className="container-future">
          <div className="cta-content-future">
            <h2 className="cta-title-future">
              พร้อมค้นหา<br />
              <span className="gradient-text-future">บ้านในฝันของคุณแล้วไหม?</span>
            </h2>
            <p className="cta-subtitle-future">
              เข้าร่วมกับผู้ใช้งานกว่า 85,000 คนที่วางใจ HaaTee<br />
              เริ่มต้นค้นหาบ้านในฝันของคุณวันนี้
            </p>
            <div className="cta-buttons-future">
              <button className="cta-btn-primary-future" onClick={() => onNavigate('properties')}>
                <Search size={18} />
                <span>เริ่มค้นหาทรัพย์สิน</span>
              </button>
              <button className="cta-btn-secondary-future" onClick={() => onNavigate('login')}>
                <Key size={18} />
                <span>ลงประกาศฟรี</span>
              </button>
            </div>
            <div className="cta-features-future">
              <div className="cta-feature-future">
                <CheckCircle size={16} />
                <span>ลงประกาศฟรี 100%</span>
              </div>
              <div className="cta-feature-future">
                <CheckCircle size={16} />
                <span>สัญญาดิจิทัล ≤3 ปี</span>
              </div>
              <div className="cta-feature-future">
                <CheckCircle size={16} />
                <span>ยืนยันตัวตนปลอดภัย</span>
              </div>
            </div>
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
              <h5 className="footer-title-future">ข้อมูล</h5>
              <ul className="footer-links-future">
                <li><button onClick={() => onNavigate('about')}>เกี่ยวกับเรา</button></li>
                <li><button>Blog & ข่าวสาร</button></li>
                <li><button>คำถามที่พบบ่อย</button></li>
                <li><button>แนวทางชุมชน</button></li>
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

export default Home;
