import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Plus, BarChart3, MessageCircle, FileText, User, LogOut, 
  Building2, MapPin, DollarSign, AlertCircle, Check, Trash2, Edit2, Eye, Heart, 
  Clock, TrendingUp, Users, Award, Search, Calendar, Phone, Mail, 
  Bed, Bath, Zap, Download, ArrowRight, CheckCircle, Settings, Bell, Lock, Home as HomeIcon,
  ChevronRight, MoreVertical, AlertTriangle } from 'lucide-react';
import './Seller.css';

const Seller = ({ onNavigate, onLoginRequired }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Listings data
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'คอนโดหรู ริมแม่น้ำเจ้าพระยา',
      location: 'สาทร กรุงเทพฯ',
      price: 45000,
      type: 'rent',
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
      beds: 3,
      baths: 3,
      size: 200,
      views: 1567,
      saves: 189,
      contacts: 52,
      status: 'expired',
      expiryDate: '2024-11-10'
    }
  ]);

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
              <Building2 size={32} />
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
              <Eye size={32} />
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
              <Heart size={32} />
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
              <MessageCircle size={32} />
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
                  <th>ทรัพย์สิน</th>
                  <th>ประเภท</th>
                  <th>ยอดดู</th>
                  <th>สนใจ</th>
                  <th>ติดต่อ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {listings.slice(0, 3).map(listing => (
                  <tr key={listing.id}>
                    <td>
                      <div className="table-property">
                        <div className="property-icon">{listing.type === 'sell' ? '🏠' : '🏢'}</div>
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
                    <td>
                      <span className={`badge ${listing.status === 'active' ? 'success' : 'danger'}`}>
                        {listing.status === 'active' ? '✓ ใช้งาน' : '✕ หมดอายุ'}
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
                  {activity.type === 'alert' && <AlertCircle size={16} />}
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

  // Listings View
  const renderListings = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>ทรัพย์สิน</h2>
          <p>จัดการและเพิ่มประกาศทรัพย์สินของคุณ</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} /> ลงประกาศใหม่
        </button>
      </div>

      <div className="card-section">
        <div className="listings-table">
          <table>
            <thead>
              <tr>
                <th>ทรัพย์สิน</th>
                <th>ประเภท</th>
                <th>ราคา</th>
                <th>ยอดดู</th>
                <th>สนใจ</th>
                <th>ติดต่อ</th>
                <th>หมดอายุ</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(listing => (
                <tr key={listing.id}>
                  <td>
                    <div className="table-property">
                      <div className="property-icon">{listing.type === 'sell' ? '🏠' : '🏢'}</div>
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
                  <td>{listing.views}</td>
                  <td>{listing.saves}</td>
                  <td>{listing.contacts}</td>
                  <td>{listing.expiryDate}</td>
                  <td>
                    <span className={`badge ${listing.status === 'active' ? 'success' : 'danger'}`}>
                      {listing.status === 'active' ? '✓ ใช้งาน' : '✕ หมดอายุ'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="แก้ไข"><Edit2 size={16} /></button>
                      <button className="btn-icon" title="ลบ"><Trash2 size={16} /></button>
                      <button className="btn-icon" title="เพิ่มเติม"><MoreVertical size={16} /></button>
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

  // Analytics View
  const renderAnalytics = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>วิเคราะห์ประกาศ</h2>
          <p>ติดตามประสิทธิผลของประกาศ</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card-section large">
          <div className="section-header">
            <h3>สถิติ 7 วันล่าสุด</h3>
            <select className="period-select">
              <option>7 วัน</option>
              <option>14 วัน</option>
              <option>1 เดือน</option>
              <option>3 เดือน</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <p>📊 แสดงแผนภูมิสถิติ (Views, Saves, Contacts)</p>
          </div>
        </div>

        <div className="card-section">
          <div className="section-header">
            <h3>สัดส่วนประเภท</h3>
          </div>
          <div className="stat-info-grid">
            <div className="stat-info-item">
              <span className="stat-label">ขาย</span>
              <strong>2</strong>
            </div>
            <div className="stat-info-item">
              <span className="stat-label">เช่า</span>
              <strong>1</strong>
            </div>
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

      <div className="card-section">
        <div className="chat-placeholder">
          <MessageCircle size={48} />
          <p>📬 ไม่มีข้อความใหม่</p>
          <p className="text-muted">ผู้สนใจจะติดต่อคุณผ่านช่องทางนี้</p>
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
        <button className="btn-primary">
          <Plus size={18} /> สร้างสัญญาใหม่
        </button>
      </div>

      <div className="card-section">
        <div className="empty-state">
          <FileText size={48} />
          <p>📄 ยังไม่มีสัญญา</p>
          <p className="text-muted">สร้างสัญญาดิจิทัล E-Contract ได้อย่างง่าย</p>
        </div>
      </div>
    </div>
  );

  // Profile View
  const renderProfile = () => (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h2>โปรไฟล์</h2>
          <p>จัดการข้อมูลส่วนตัว</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="card-section">
          <div className="profile-header">
            <div className="profile-avatar-large">
              <span>A</span>
            </div>
            <div className="profile-info">
              <h3>Admin Seller</h3>
              <p>🏢 นายหน้าอสังหาริมทรัพย์</p>
              <div className="verify-badge">✅ ยืนยันแล้ว</div>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <label><Mail size={16} /> อีเมล</label>
              <p>seller@haatee.com</p>
            </div>
            <div className="detail-row">
              <label><Phone size={16} /> เบอร์โทร</label>
              <p>081-2345-6789</p>
            </div>
            <div className="detail-row">
              <label><Building2 size={16} /> บริษัท</label>
              <p>Pro Real Estate</p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-secondary">แก้ไขข้อมูล</button>
            <button className="btn-secondary">ตั้งค่า</button>
          </div>
        </div>

        <div className="card-section">
          <h3>สถิติโปรไฟล์</h3>
          <div className="stats-list">
            <div className="stat-item">
              <span className="stat-icon">📊</span>
              <div>
                <p>ประกาศทั้งหมด</p>
                <strong>{listings.length}</strong>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👁</span>
              <div>
                <p>ยอดดู</p>
                <strong>{stats.totalViews.toLocaleString()}</strong>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💬</span>
              <div>
                <p>ยอดติดต่อ</p>
                <strong>{stats.totalContacts.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${!sidebarOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <Building2 size={24} />
            </div>
            <span className="brand-name">HaaTee Seller</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <div className="avatar-placeholder">A</div>
            <div className="user-status"></div>
          </div>
          <div className="user-info">
            <h4>Admin</h4>
            <p>เจ้าของทรัพย์</p>
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
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageCircle size={18} />
              <span>ข้อความ</span>
              <span className="badge">2</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contracts')}
            >
              <FileText size={18} />
              <span>สัญญา</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>โปรไฟล์</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            className="nav-btn logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={18} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <div className="header-title">
              <h2>{activeTab === 'dashboard' ? 'แดชบอร์ด' : activeTab === 'listings' ? 'ทรัพย์สิน' : activeTab === 'analytics' ? 'วิเคราะห์' : activeTab === 'chat' ? 'ข้อความ' : activeTab === 'contracts' ? 'สัญญา' : 'โปรไฟล์'}</h2>
              <p className="header-subtitle">จัดการทรัพย์สินของคุณ</p>
            </div>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="ค้นหา..." />
            </div>
            <button className="header-icon-btn">
              <Bell size={18} />
              <span className="notification-badge">2</span>
            </button>
            <div className="header-avatar">
              <span>A</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'listings' && renderListings()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'chat' && renderChat()}
          {activeTab === 'contracts' && renderContracts()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>

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
    </div>
  );
};

export default Seller;
