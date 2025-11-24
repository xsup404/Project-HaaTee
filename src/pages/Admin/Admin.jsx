import React, { useState, useEffect } from 'react';
import './Admin.css';
import propertiesData from '../../data/properties.json';
import usersData from '../../data/users.json';
import { 
  LayoutDashboard, Users, Building2, FileText, AlertCircle, 
  MessageSquare, Settings, TrendingUp, Shield, Award,
  Search, Bell, Menu, X, Eye, Ban, Home as HomeIcon,
  CheckCircle, XCircle, Filter, Download, Upload,
  Calendar, DollarSign, MapPin, Star, Phone, Mail,
  Edit, Trash2, Plus, ArrowUp, ArrowDown,
  Activity, PieChart, BarChart3, Clock, Package,
  UserCheck, FileCheck, Megaphone, Tag, ChevronRight,
  Inbox, CreditCard, HelpCircle, LogOut
} from 'lucide-react';

const Admin = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    activeContracts: 892,
    totalRevenue: 2456789,
    pendingReports: 0,
    pendingApprovals: 0,
    newUsers: 0,
    newProperties: 0,
    completedContracts: 445,
    monthlyGrowth: 18.5,
    flaggedListings: 0,
    verifiedUsers: 0,
    onlineUsers: 342
  });
  const [topProperties, setTopProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);

  // โหลดข้อมูลจริงจาก JSON
  useEffect(() => {
    try {
      // นับผู้ใช้
      const totalUsers = usersData.length;
      const verifiedUsers = usersData.filter(u => u.verified).length;
      const newUsersCount = Math.floor(totalUsers * 0.05);

      // นับทรัพย์สิน
      const totalProperties = propertiesData.length;
      const newPropertiesCount = propertiesData.slice(0, Math.floor(totalProperties * 0.1)).length;
      const flaggedCount = Math.floor(totalProperties * 0.005);

      // หาทรัพย์สินยอดนิยม (สูงสุด 8 อันดับแรก)
      const topProps = propertiesData
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8)
        .map((prop, idx) => ({
          id: prop.id,
          title: prop.title,
          views: prop.views || 0,
          location: prop.location,
          price: prop.price,
          type: prop.type,
          status: (prop.views || 0) > 5000 ? 'hot' : 'active'
        }));

      setStats(prev => ({
        ...prev,
        totalUsers,
        totalProperties,
        verifiedUsers,
        newUsers: newUsersCount,
        newProperties: newPropertiesCount,
        flaggedListings: flaggedCount,
        pendingReports: Math.floor(flaggedCount * 0.5)
      }));

      setTopProperties(topProps);
      setUsers(usersData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  const quickStats = [
    { 
      id: 1, 
      label: 'ผู้ใช้ใหม่', 
      value: stats.newUsers.toLocaleString(), 
      change: '+12.5%', 
      trend: 'up',
      icon: <Users size={24} />,
      color: 'purple'
    },
    { 
      id: 2, 
      label: 'ปัญหาที่รอแก้ไข', 
      value: stats.pendingReports.toLocaleString(), 
      change: '+5.2%', 
      trend: 'down',
      icon: <AlertCircle size={24} />,
      color: 'blue'
    },
    { 
      id: 3, 
      label: 'ทรัพย์สินใหม่', 
      value: stats.newProperties.toLocaleString(), 
      change: '+8.2%', 
      trend: 'up',
      icon: <Building2 size={24} />,
      color: 'green'
    },
    { 
      id: 4, 
      label: 'สัญญารอดำเนินการ', 
      value: stats.pendingApprovals.toLocaleString(), 
      change: '-5.1%', 
      trend: 'down',
      icon: <FileText size={24} />,
      color: 'orange'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'สมชาย ใจดี', action: 'ลงทะเบียนบัญชีใหม่', time: '2 นาทีที่แล้ว', type: 'user', icon: <UserCheck size={16} /> },
    { id: 2, user: 'วิภา สวยงาม', action: 'ลงประกาศทรัพย์ใหม่', time: '15 นาทีที่แล้ว', type: 'property', icon: <HomeIcon size={16} /> },
    { id: 3, user: 'สัญญา #CON-2845', action: 'รอการอนุมัติ', time: '1 ชั่วโมงที่แล้ว', type: 'contract', icon: <FileCheck size={16} /> },
    { id: 4, user: 'บุญมี ถูกใจ', action: 'รายงานทรัพย์ผิดปกติ', time: '2 ชั่วโมงที่แล้ว', type: 'alert', icon: <AlertCircle size={16} /> }
  ];

  const revenueData = [
    { month: 'ม.ค.', value: 65 },
    { month: 'ก.พ.', value: 78 },
    { month: 'มี.ค.', value: 72 },
    { month: 'เม.ย.', value: 85 },
    { month: 'พ.ค.', value: 90 },
    { month: 'มิ.ย.', value: 82 },
    { month: 'ก.ค.', value: 95 }
  ];

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      onNavigate('home');
    }, 500);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const renderDashboard = () => (
    <div className="dashboard-wrapper">
      {/* Quick Stats */}
      <div className="quick-stats-grid">
        {quickStats.map(stat => (
          <div key={stat.id} className={`quick-stat-card ${stat.color}`}>
            <div className="stat-icon-wrapper">
              <div className={`stat-icon ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="charts-grid">
        {/* Issues List */}
        <div className="chart-card large-chart">
          <div className="chart-header">
            <div>
              <h3>สิ่งที่ต้องเร่งแก้ไข</h3>
              <p className="chart-subtitle">ปัญหาที่เจอและต้องแก้ไข</p>
            </div>
            <select className="period-select" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <option value="thisWeek">สัปดาห์นี้</option>
              <option value="thisMonth">เดือนนี้</option>
              <option value="thisYear">ปีนี้</option>
            </select>
          </div>
          <div className="chart-body" style={{ padding: '20px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#FEE2E2', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
                <span style={{ color: '#EF4444', fontSize: '20px' }}>🔴</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '700', color: '#991B1B' }}>ปัญหาหนัก - ระบบ Database ล่ม</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#7F1D1D' }}>ต้องแก้ไขใน 24 ชั่วโมง</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#DC2626' }}>เร่งด่วน</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#FFEDD5', borderRadius: '8px', borderLeft: '4px solid #F97316' }}>
                <span style={{ color: '#F97316', fontSize: '20px' }}>🟠</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '700', color: '#92400E' }}>ปัญหาปานกลาง - บัญชีผู้ใช้ล็อคไม่ได้</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#B45309' }}>ต้องแก้ไขใน 3 วัน</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#EA580C' }}>สำคัญ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#FFEDD5', borderRadius: '8px', borderLeft: '4px solid #F97316' }}>
                <span style={{ color: '#F97316', fontSize: '20px' }}>🟠</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '700', color: '#92400E' }}>ปัญหาปานกลาง - UI/UX ไม่ตรงกับ Design</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#B45309' }}>ต้องแก้ไขใน 1 สัปดาห์</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#EA580C' }}>สำคัญ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#FEFCE8', borderRadius: '8px', borderLeft: '4px solid #FCD34D' }}>
                <span style={{ color: '#FCD34D', fontSize: '20px' }}>🟡</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '700', color: '#713F12' }}>ปัญหาเล็กน้อย - Performance ช้าลง</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#854D0E' }}>ต้องแก้ไขเมื่อมีเวลา</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#FBBD34' }}>ตามปกติ</span>
              </div>
            </div>
          </div>
          <div className="chart-footer">
            <div className="chart-legend" style={{ justifyContent: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span>
                <span>ปัญหาหนัก (1)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F97316' }}></span>
                <span>ปัญหาปานกลาง (2)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FCD34D' }}></span>
                <span>ปัญหาเล็กน้อย (1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Summary */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>สรุปปัญหา</h3>
              <p className="chart-subtitle">จำแนกตามระดับความรุนแรง</p>
            </div>
          </div>
          <div className="chart-body center">
            <div className="donut-chart">
              <svg viewBox="0 0 200 200" className="donut-svg">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E8EEF5" strokeWidth="30"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient1)" strokeWidth="30"
                  strokeDasharray="251.2 502.4" strokeDashoffset="0" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient2)" strokeWidth="30"
                  strokeDasharray="125.6 502.4" strokeDashoffset="-251.2" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient3)" strokeWidth="30"
                  strokeDasharray="62.8 502.4" strokeDashoffset="-376.8" transform="rotate(-90 100 100)"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444"/>
                    <stop offset="100%" stopColor="#DC2626"/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316"/>
                    <stop offset="100%" stopColor="#EA580C"/>
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D"/>
                    <stop offset="100%" stopColor="#FBD34D"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="donut-center">
                <h4>{stats.pendingReports}</h4>
                <p>ปัญหาทั้งหมด</p>
              </div>
            </div>
          </div>
          <div className="chart-footer">
            <div className="distribution-list">
              <div className="distribution-item">
                <span className="dist-color" style={{ background: '#EF4444' }}></span>
                <span className="dist-label">ปัญหาหนัก</span>
                <strong>45%</strong>
              </div>
              <div className="distribution-item">
                <span className="dist-color" style={{ background: '#F97316' }}></span>
                <span className="dist-label">ปัญหาปานกลาง</span>
                <strong>35%</strong>
              </div>
              <div className="distribution-item">
                <span className="dist-color" style={{ background: '#FCD34D' }}></span>
                <span className="dist-label">ปัญหาเล็กน้อย</span>
                <strong>20%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Recent Activity */}
        <div className="activity-card">
          <div className="card-header">
            <h3>
              <Activity size={20} />
              กิจกรรมล่าสุด
            </h3>
            <button className="view-all-btn">ดูทั้งหมด <ChevronRight size={16} /></button>
          </div>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <p className="activity-user">{activity.user}</p>
                  <p className="activity-action">{activity.action}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Properties */}
        <div className="properties-card">
          <div className="card-header">
            <h3>
              <TrendingUp size={20} />
              ทรัพย์สินยอดนิยม
            </h3>
            <button className="view-all-btn">ดูทั้งหมด <ChevronRight size={16} /></button>
          </div>
          <div className="properties-list">
            {topProperties.map((property, index) => (
              <div key={property.id} className="property-item">
                <div className="property-rank">{index + 1}</div>
                <div className="property-info">
                  <h4>{property.title}</h4>
                  <div className="property-meta">
                    <span><MapPin size={12} /> {property.location}</span>
                    <span className={`property-status ${property.status}`}>
                      {property.status === 'hot' ? '🔥 ฮอต' : 'ใช้งานอยู่'}
                    </span>
                  </div>
                </div>
                <div className="property-stats">
                  <p className="property-price">฿{property.price}</p>
                  <p className="property-views">
                    <Eye size={14} /> {property.views.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="content-section">
      <div className="section-header">
        <div className="section-header-left">
          <h3>ผู้ใช้งานทั้งหมด</h3>
          <p className="section-subtitle">จำนวนผู้ใช้: {stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="section-header-right">
          <button className="action-btn primary"><Plus size={16} /> เพิ่มผู้ใช้ใหม่</button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input type="text" placeholder="ค้นหาชื่อ อีเมล..." />
        </div>
        <select className="filter-select">
          <option>ประเภททั้งหมด</option>
          <option>ผู้ซื้อ</option>
          <option>เจ้าของ</option>
          <option>ตัวแทน</option>
        </select>
        <select className="filter-select">
          <option>สถานะทั้งหมด</option>
          <option>ใช้งาน</option>
          <option>รอการอนุมัติ</option>
          <option>ระงับ</option>
        </select>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>ประเภท</th>
              <th>สถานะ</th>
              <th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 10).map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}`} alt="" />
                    <div>
                      <div className="user-name">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td><span className="badge-type buyer">{user.role === 'agent' ? 'ตัวแทน' : 'เจ้าของ'}</span></td>
                <td><span className="status-badge active">{user.verified ? 'ยืนยันแล้ว' : 'รอยืนยัน'}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn"><Eye size={16} /></button>
                    <button className="icon-btn"><Edit size={16} /></button>
                    <button className="icon-btn danger"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-info">แสดง 1-5 จาก {stats.totalUsers.toLocaleString()} ผู้ใช้</span>
        <div className="pagination-controls">
          <button className="page-btn" disabled>&larr;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">&rarr;</button>
        </div>
      </div>
    </div>
  );

  const renderPropertyManagement = () => (
    <div className="content-section">
      <div className="section-header">
        <div className="section-header-left">
          <h3>ทรัพย์สินทั้งหมด</h3>
          <p className="section-subtitle">จำนวนทรัพย์สิน: {stats.totalProperties.toLocaleString()}</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input type="text" placeholder="ค้นหาทรัพย์สิน..." />
        </div>
        <select className="filter-select">
          <option>ประเภททั้งหมด</option>
          <option>ขาย</option>
          <option>เช่า</option>
        </select>
        <select className="filter-select">
          <option>สถานะทั้งหมด</option>
          <option>ใช้งาน</option>
          <option>ถูกรายงาน</option>
          <option>ลบแล้ว</option>
        </select>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่อทรัพย์สิน</th>
              <th>เจ้าของ</th>
              <th>ราคา</th>
              <th>ประเภท</th>
              <th>จำนวนดู</th>
              <th>สถานะ</th>
              <th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {topProperties.slice(0, 10).map(prop => (
              <tr key={prop.id}>
                <td><strong>{prop.title}</strong></td>
                <td>{prop.seller?.name || 'ไม่ระบุ'}</td>
                <td>{prop.price}</td>
                <td><span className="badge-type">{prop.type}</span></td>
                <td>{(prop.views || 0).toLocaleString()}</td>
                <td><span className="status-badge active">{prop.status === 'hot' ? 'ยอดนิยม' : 'ใช้งาน'}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn"><Eye size={16} /></button>
                    <button className="icon-btn"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-info">แสดง 1-5 จาก {stats.totalProperties.toLocaleString()} ทรัพย์สิน</span>
        <div className="pagination-controls">
          <button className="page-btn" disabled>&larr;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">&rarr;</button>
        </div>
      </div>
    </div>
  );

  const renderContractManagement = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '24px' }}>
        จัดการสัญญาดิจิทัล
      </h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="🔍 ค้นหาหมายเลขสัญญา..."
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '10px 14px',
            border: '1px solid #E8EEF5',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1a202c'
          }}
        />
        <select style={{
          padding: '10px 14px',
          border: '1px solid #E8EEF5',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          color: '#1a202c',
          background: 'white'
        }}>
          <option>-- สถานะ: ทั้งหมด --</option>
          <option>📝 ร่างฉบับ</option>
          <option>✓ ลงนามแล้ว</option>
          <option>✓✓ เสร็จสิ้น</option>
        </select>
        <select style={{
          padding: '10px 14px',
          border: '1px solid #E8EEF5',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          color: '#1a202c',
          background: 'white'
        }}>
          <option>-- ประเภท: ทั้งหมด --</option>
          <option>เช่า</option>
          <option>ขาย</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #E8EEF5', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>รวมทั้งหมด</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0066CC', margin: '0' }}>45</h3>
        </div>
        <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #E8EEF5', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>ลงนามแล้ว</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10B981', margin: '0' }}>40</h3>
        </div>
        <div style={{ background: '#fefce8', padding: '16px', borderRadius: '8px', border: '1px solid #E8EEF5', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>ร่างฉบับ</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B', margin: '0' }}>5</h3>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #E8EEF5' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>หมายเลข</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ผู้ลงประกาศ</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ผู้ซื้อ/เช่า</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ประเภท</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>สถานะ</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>วันที่</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'CON-2501', owner: 'สมชาย ใจดี', buyer: 'วิภา สวยงาม', type: 'เช่า', status: 'signed', date: '15/01/24' },
              { id: 'CON-2502', owner: 'บุญมี ถูกใจ', buyer: 'สุนทร เสรจริตร', type: 'ขาย', status: 'draft', date: '10/01/24' },
              { id: 'CON-2503', owner: 'สมหญิง ม่วง', buyer: 'ประยุกต์ สุขา', type: 'เช่า', status: 'completed', date: '05/01/24' },
              { id: 'CON-2504', owner: 'พัฒนา วงษ์', buyer: 'เกิดชัย บูรณ์', type: 'ขาย', status: 'signed', date: '01/01/24' },
            ].map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #E8EEF5' }}>
                <td style={{ padding: '12px', fontSize: '14px', color: '#0066CC', fontWeight: '600' }}>{c.id}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.owner}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.buyer}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.type}</td>
                <td style={{ padding: '12px' }}>
                  {c.status === 'signed' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>✓ ลงนามแล้ว</span>}
                  {c.status === 'draft' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#FEF3C7', color: '#92400E', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>📝 ร่างฉบับ</span>}
                  {c.status === 'completed' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#A7F3D0', color: '#065F46', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>✓✓ เสร็จสิ้น</span>}
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.date}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button style={{ padding: '6px 12px', marginRight: '6px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>👁️ ดู</button>
                  <button style={{ padding: '6px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️ ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContentModeration = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
        ตรวจสอบเนื้อหา
      </h2>

      <div style={{ background: '#FEE2E2', border: '2px solid #FECACA', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>🔴</span>
        <div>
          <p style={{ fontWeight: '600', color: '#991B1B', margin: '0 0 4px 0', fontSize: '14px' }}>15 รายงานรอตรวจสอบ</p>
          <p style={{ color: '#7F1D1D', fontSize: '13px', margin: '0' }}>จำเป็นต้องดำเนินการโดยเร็ว</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#FEE2E2', padding: '16px', borderRadius: '8px', border: '1px solid #FECACA', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#991B1B', marginBottom: '8px' }}>🔴 รอตรวจสอบ</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444', margin: '0' }}>15</h3>
        </div>
        <div style={{ background: '#D1FAE5', padding: '16px', borderRadius: '8px', border: '1px solid #A7F3D0', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#065F46', marginBottom: '8px' }}>✓ อนุมัติแล้ว</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10B981', margin: '0' }}>45</h3>
        </div>
        <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '8px', border: '1px solid #D1D5DB', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px' }}>✕ ปฏิเสธแล้ว</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#6B7280', margin: '0' }}>20</h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { id: 1, title: 'คอนโด The Peak', owner: 'สมชาย ใจดี', reason: 'ปลอมแปลง', count: 3, severity: 'high' },
          { id: 2, title: 'บ้านเดี่ยว Premium', owner: 'บุญมี ถูกใจ', reason: 'หลอกลวง', count: 2, severity: 'high' },
          { id: 3, title: 'ทาวน์โฮม Modern', owner: 'สมหญิง ม่วง', reason: 'ไม่เหมาะสม', count: 1, severity: 'medium' },
        ].map(r => (
          <div key={r.id} style={{
            background: 'white',
            border: `2px solid ${r.severity === 'high' ? '#EF4444' : '#F59E0B'}`,
            borderRadius: '10px',
            padding: '16px',
            borderLeft: `6px solid ${r.severity === 'high' ? '#EF4444' : '#F59E0B'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: '0 0 4px 0' }}>🏠 {r.title}</h3>
                <p style={{ fontSize: '13px', color: '#718096', margin: '0' }}>👤 {r.owner} | ⚠️ {r.reason} ({r.count} รายงาน)</p>
              </div>
              <span style={{ padding: '6px 12px', background: r.severity === 'high' ? '#FEE2E2' : '#FFEDD5', color: r.severity === 'high' ? '#991B1B' : '#92400E', borderRadius: '6px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                {r.severity === 'high' ? '🔴 เร่งด่วน' : '🟠 ปานกลาง'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 16px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>👁️ ดู</button>
              <button style={{ padding: '8px 16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✓ อนุมัติ</button>
              <button style={{ padding: '8px 16px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ ลบ</button>
              <button style={{ padding: '8px 16px', background: '#6B7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✕ ยกเลิก</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChatMonitoring = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
        ตรวจสอบการสื่อสาร
      </h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="🔍 ค้นหาชื่อผู้ใช้..." style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} />
        <select style={{ padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', color: '#1a202c', background: 'white' }}>
          <option>-- วันที่: ทั้งหมด --</option>
          <option>7 วันล่าสุด</option>
          <option>30 วันล่าสุด</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #E8EEF5' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ผู้ส่ง</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ผู้รับ</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ข้อความล่าสุด</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>สถานะ</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>เวลา</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {[
              { sender: 'สมชาย ใจดี', receiver: 'วิภา สวยงาม', message: 'ทรัพย์สินนี้เหมาะสำหรับคุณ', status: 'completed', time: '14:30' },
              { sender: 'บุญมี ถูกใจ', receiver: 'สุนทร เสรจริตร', message: 'ราคาอยู่ที่เท่านี้นะคะ', status: 'ongoing', time: '16:45' },
              { sender: 'สมหญิง ม่วง', receiver: 'เกิดชัย บูรณ์', message: 'ปัญหากับการสื่อสาร', status: 'issue', time: '09:20' },
            ].map((chat, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #E8EEF5', background: chat.status === 'issue' ? '#FEE2E2' : 'white' }}>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>👤 {chat.sender}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>👤 {chat.receiver}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#718096' }}>{chat.message}</td>
                <td style={{ padding: '12px' }}>
                  {chat.status === 'completed' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>✓ เสร็จสิ้น</span>}
                  {chat.status === 'ongoing' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#DBEAFE', color: '#1E40AF', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>⏳ ดำเนินการ</span>}
                  {chat.status === 'issue' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#FEE2E2', color: '#991B1B', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>⚠️ มีปัญหา</span>}
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>🕐 {chat.time}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button style={{ padding: '6px 12px', marginRight: '6px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>👁️ ดู</button>
                  <button style={{ padding: '6px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️ ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
        📊 รายงานและสถิติ
      </h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E8EEF5', paddingBottom: '12px' }}>
        <button style={{ fontSize: '14px', fontWeight: '600', color: '#0066CC', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: '3px solid #0066CC', paddingBottom: '8px' }}>👥 สถิติผู้ใช้</button>
        <button style={{ fontSize: '14px', fontWeight: '600', color: '#718096', background: 'transparent', border: 'none', cursor: 'pointer' }}>🏘️ สถิติประกาศ</button>
        <button style={{ fontSize: '14px', fontWeight: '600', color: '#718096', background: 'transparent', border: 'none', cursor: 'pointer' }}>📋 สถิติสัญญา</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #0066CC', boxShadow: '0 2px 8px rgba(0, 102, 204, 0.1)' }}>
          <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>👥 ผู้ใช้ใหม่ (สัปดาห์)</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#0066CC', margin: '0 0 4px 0' }}>124</h3>
          <p style={{ fontSize: '12px', color: '#10B981', margin: '0' }}>📈 +20% จากเดือนที่แล้ว</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #0066CC', boxShadow: '0 2px 8px rgba(0, 102, 204, 0.1)' }}>
          <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>👥 ผู้ใช้ใหม่ (เดือน)</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#0066CC', margin: '0 0 4px 0' }}>458</h3>
          <p style={{ fontSize: '12px', color: '#10B981', margin: '0' }}>📈 +15% จากเดือนที่แล้ว</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #10B981', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)' }}>
          <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>🟢 ผู้ใช้ออนไลน์</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#10B981', margin: '0 0 4px 0' }}>234</h3>
          <p style={{ fontSize: '12px', color: '#0066CC', margin: '0' }}>ตอนนี้</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #E8EEF5' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>#</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ชื่อผู้ใช้</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ประเภท</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>โพสต์</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>ออนไลน์ล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'สมชาย ใจดี', type: '🛒 ผู้ซื้อ', posts: 5, online: '2 ชั่วโมงที่แล้ว' },
              { name: 'วิภา สวยงาม', type: '🏠 เจ้าของ', posts: 12, online: '1 ชั่วโมงที่แล้ว' },
              { name: 'บุญมี ถูกใจ', type: '🤝 นายหน้า', posts: 8, online: '🟢 ออนไลน์' },
            ].map((u, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #E8EEF5' }}>
                <td style={{ padding: '12px', fontSize: '14px', color: '#718096' }}>{idx + 1}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>👤 {u.name}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#0066CC', fontWeight: '600' }}>{u.type}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{u.posts}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#718096' }}>{u.online}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '24px' }}>
        ⚙️ ตั้งค่าระบบ
      </h2>

      <div style={{ maxWidth: '700px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📅 เวลาหมดอายุประกาศ (วัน)</label>
          <input type="number" defaultValue="90" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>🏘️ จำนวนประกาศสูงสุด/ผู้ใช้</label>
          <input type="number" defaultValue="100" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📋 ข้อจำกัดสัญญา (ปี)</label>
          <input type="number" defaultValue="3" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📧 อีเมล Support</label>
          <input type="email" defaultValue="support@haatee.com" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📞 เบอร์โทร Support</label>
          <input type="tel" defaultValue="0x-xxx-xxxx" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} />
        </div>

        <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #E8EEF5' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '16px' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>🔍 เปิดใช้งาน Smart Filter</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>📝 เปิดใช้งาน Digital Contract</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ flex: 1, padding: '12px 20px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>💾 บันทึก</button>
          <button style={{ flex: 1, padding: '12px 20px', background: '#f3f4f6', color: '#1a202c', border: '1px solid #E8EEF5', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>❌ ยกเลิก</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUserManagement();
      case 'properties':
        return renderPropertyManagement();
      case 'contracts':
        return renderContractManagement();
      case 'reports':
        return renderContentModeration();
      case 'chat':
        return renderChatMonitoring();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">🏠</div>
            {sidebarOpen && <h1 className="brand-name">HaaTee</h1>}
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=667eea&color=fff" alt="Admin" />
            <span className="user-status"></span>
          </div>
          {sidebarOpen && (
            <div className="user-info">
              <h4>ยินดีต้อนรับ</h4>
              <p>Admin User</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-section-title">{sidebarOpen ? 'เมนูหลัก' : ''}</p>
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>แดชบอร์ด</span>}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              {sidebarOpen && <span>จัดการผู้ใช้</span>}
              {sidebarOpen && <span className="badge">{stats.newUsers}</span>}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <Building2 size={20} />
              {sidebarOpen && <span>ทรัพย์สิน</span>}
              {sidebarOpen && <span className="badge">{stats.newProperties}</span>}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contracts')}
            >
              <FileText size={20} />
              {sidebarOpen && <span>สัญญาดิจิทัล</span>}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <AlertCircle size={20} />
              {sidebarOpen && <span>รายงานปัญหา</span>}
              {sidebarOpen && stats.pendingReports > 0 && (
                <span className="badge danger">{stats.pendingReports}</span>
              )}
            </button>
          </div>

          <div className="nav-section">
            <p className="nav-section-title">{sidebarOpen ? 'เครื่องมือ' : ''}</p>
            <button
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={20} />
              {sidebarOpen && <span>ข้อความ</span>}
            </button>
            <button
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span>รายงานและสถิติ</span>}
            </button>
            <button
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              {sidebarOpen && <span>ตั้งค่า</span>}
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="nav-btn logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="main-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="header-title">
              <h2>
                {activeTab === 'dashboard' && 'แดชบอร์ด'}
                {activeTab === 'users' && 'จัดการผู้ใช้งาน'}
                {activeTab === 'properties' && 'จัดการทรัพย์สิน'}
                {activeTab === 'contracts' && 'สัญญาดิจิทัล'}
                {activeTab === 'reports' && 'รายงานปัญหา'}
                {activeTab === 'chat' && 'ระบบข้อความ'}
                {activeTab === 'analytics' && 'รายงานและสถิติ'}
                {activeTab === 'settings' && 'ตั้งค่าระบบ'}
              </h2>
              <p className="header-subtitle">
                {new Date().toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>
          </div>

          <div className="header-right">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="ค้นหา..." />
            </div>
            <button className="header-icon-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="header-avatar">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=667eea&color=fff" alt="Admin" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {renderContent()}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
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

export default Admin;