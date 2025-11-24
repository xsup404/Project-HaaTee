import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Plus, BarChart3, MessageCircle, FileText, User, LogOut, 
  Building2, MapPin, DollarSign, AlertCircle, Check, Trash2, Edit2, Eye, Heart, 
  Clock, TrendingUp, Users, Award, Search, Calendar, Phone, Mail, 
  Bed, Bath, Zap, Download, ArrowRight, CheckCircle, Settings, Bell, Lock, Home as HomeIcon,
  ChevronRight, MoreVertical, AlertTriangle, Send, RotateCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Seller.css';

const Seller = ({ onNavigate, onLoginRequired }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Modal states
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [showEditListingModal, setShowEditListingModal] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showAnalyticsCharts, setShowAnalyticsCharts] = useState(true);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7');

  // Form states
  const [newListing, setNewListing] = useState({
    title: '',
    location: '',
    price: '',
    type: 'sell',
    beds: '',
    baths: '',
    size: '',
    amenities: [],
    description: '',
    images: []
  });

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

  // Handle Create Listing
  const handleCreateListing = () => {
    if (!newListing.title || !newListing.location || !newListing.price) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    const listing = {
      id: listings.length + 1,
      ...newListing,
      views: 0,
      saves: 0,
      contacts: 0,
      status: 'active',
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH')
    };

    setListings([...listings, listing]);
    setNewListing({
      title: '',
      location: '',
      price: '',
      type: 'sell',
      beds: '',
      baths: '',
      size: '',
      amenities: [],
      description: '',
      images: []
    });
    setShowCreateListingModal(false);
    alert('เพิ่มประกาศสำเร็จ!');
  };

  // Handle Edit Listing
  const handleEditListing = (id) => {
    const listing = listings.find(l => l.id === id);
    setNewListing(listing);
    setEditingListingId(id);
    setShowEditListingModal(true);
  };

  const handleSaveEditListing = () => {
    setListings(listings.map(l => l.id === editingListingId ? { ...newListing, id: editingListingId } : l));
    setShowEditListingModal(false);
    setEditingListingId(null);
    setNewListing({
      title: '',
      location: '',
      price: '',
      type: 'sell',
      beds: '',
      baths: '',
      size: '',
      amenities: [],
      description: '',
      images: []
    });
    alert('แก้ไขประกาศสำเร็จ!');
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
        ? { ...l, status: 'active', expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH') }
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
        <button className="btn-primary" onClick={() => setShowCreateListingModal(true)}>
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
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Listing Modal */}
      {showCreateListingModal && (
        <div className="modal-overlay" onClick={() => setShowCreateListingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ลงประกาศใหม่</h3>
              <button onClick={() => setShowCreateListingModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>ชื่อทรัพย์ *</label>
                <input 
                  type="text" 
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  placeholder="เช่น คอนโดหรู ริมแม่น้ำ"
                />
              </div>
              <div className="form-group">
                <label>ที่อยู่ *</label>
                <input 
                  type="text" 
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                  placeholder="เช่น สาทร กรุงเทพฯ"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ประเภท *</label>
                  <select 
                    value={newListing.type}
                    onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                  >
                    <option value="sell">ขาย</option>
                    <option value="rent">เช่า</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ราคา *</label>
                  <input 
                    type="number" 
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    placeholder="ราคา"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ห้องนอน</label>
                  <input 
                    type="number" 
                    value={newListing.beds}
                    onChange={(e) => setNewListing({ ...newListing, beds: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>ห้องน้ำ</label>
                  <input 
                    type="number" 
                    value={newListing.baths}
                    onChange={(e) => setNewListing({ ...newListing, baths: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>ขนาด (ตร.ม.)</label>
                  <input 
                    type="number" 
                    value={newListing.size}
                    onChange={(e) => setNewListing({ ...newListing, size: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>รายละเอียด</label>
                <textarea 
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  placeholder="อธิบายรายละเอียดเพิ่มเติม"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>อัปโหลดรูปภาพ</label>
                <div className="image-upload">
                  <input type="file" multiple accept="image/*" />
                  <p>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateListingModal(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={handleCreateListing}>เพิ่มประกาศ</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {showEditListingModal && (
        <div className="modal-overlay" onClick={() => setShowEditListingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>แก้ไขประกาศ</h3>
              <button onClick={() => setShowEditListingModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>ชื่อทรัพย์ *</label>
                <input 
                  type="text" 
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>ที่อยู่ *</label>
                <input 
                  type="text" 
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ประเภท *</label>
                  <select 
                    value={newListing.type}
                    onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                  >
                    <option value="sell">ขาย</option>
                    <option value="rent">เช่า</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ราคา *</label>
                  <input 
                    type="number" 
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ห้องนอน</label>
                  <input 
                    type="number" 
                    value={newListing.beds}
                    onChange={(e) => setNewListing({ ...newListing, beds: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>ห้องน้ำ</label>
                  <input 
                    type="number" 
                    value={newListing.baths}
                    onChange={(e) => setNewListing({ ...newListing, baths: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>ขนาด (ตร.ม.)</label>
                  <input 
                    type="number" 
                    value={newListing.size}
                    onChange={(e) => setNewListing({ ...newListing, size: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>รายละเอียด</label>
                <textarea 
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditListingModal(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={handleSaveEditListing}>บันทึกการเปลี่ยนแปลง</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
        { date: 'ว่า1', views: 240, saves: 85, contacts: 24 },
        { date: 'ว่า2', views: 421, saves: 98, contacts: 35 },
        { date: 'ว่า3', views: 380, saves: 125, contacts: 38 },
        { date: 'ว่า4', views: 520, saves: 156, contacts: 52 },
        { date: 'ว่า5', views: 680, saves: 182, contacts: 68 },
        { date: 'ว่า6', views: 590, saves: 165, contacts: 45 },
        { date: 'ว่า7', views: 750, saves: 198, contacts: 75 },
        { date: 'ว่า8', views: 820, saves: 215, contacts: 82 },
        { date: 'ว่า9', views: 680, saves: 178, contacts: 65 },
        { date: 'ว่า10', views: 920, saves: 245, contacts: 95 },
        { date: 'ว่า11', views: 850, saves: 210, contacts: 78 },
        { date: 'ว่า12', views: 780, saves: 190, contacts: 72 },
        { date: 'ว่า13', views: 650, saves: 170, contacts: 58 },
        { date: 'ว่า14', views: 950, saves: 260, contacts: 98 }
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
        <div className="card-section large">
          <div className="section-header">
            <h3>สถิติ {analyticsPeriod === '7' ? '7 วัน' : analyticsPeriod === '14' ? '14 วัน' : analyticsPeriod === '30' ? '1 เดือน' : '3 เดือน'}ล่าสุด</h3>
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
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
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
                  cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3B82F6" 
                  name="ยอดดู"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 7, fill: '#0052A3' }}
                  fillOpacity={1} 
                  fill="url(#colorViews)"
                />
                <Line 
                  type="monotone" 
                  dataKey="saves" 
                  stroke="#10B981" 
                  name="ยอดสนใจ"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7, fill: '#059669' }}
                  fillOpacity={1} 
                  fill="url(#colorSaves)"
                />
                <Line 
                  type="monotone" 
                  dataKey="contacts" 
                  stroke="#F97316" 
                  name="ยอดติดต่อ"
                  strokeWidth={3}
                  dot={{ fill: '#F97316', r: 5 }}
                  activeDot={{ r: 7, fill: '#DC2626' }}
                  fillOpacity={1} 
                  fill="url(#colorContacts)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-section full-width-stats">
          <div className="section-header">
            <h3>สรุปสถิติสำคัญ</h3>
          </div>
          
          <div className="stats-cards-grid-wide">
            <div className="stat-card-wide blue">
              <div className="stat-card-wide-icon">👁</div>
              <div className="stat-card-wide-content">
                <p className="stat-card-wide-label">ยอดดูทั้งหมด</p>
                <p className="stat-card-wide-value">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card-wide green">
              <div className="stat-card-wide-icon">💚</div>
              <div className="stat-card-wide-content">
                <p className="stat-card-wide-label">ยอดสนใจ</p>
                <p className="stat-card-wide-value">{stats.totalSaves.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card-wide orange">
              <div className="stat-card-wide-icon">📞</div>
              <div className="stat-card-wide-content">
                <p className="stat-card-wide-label">ยอดติดต่อ</p>
                <p className="stat-card-wide-value">{stats.totalContacts.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card-wide purple">
              <div className="stat-card-wide-icon">📈</div>
              <div className="stat-card-wide-content">
                <p className="stat-card-wide-label">อัตราการแปลง</p>
                <p className="stat-card-wide-value">{((stats.totalContacts / Math.max(stats.totalViews, 1)) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="property-type-section">
            <h4>การแจกแจงประเภททรัพย์</h4>
            <div className="property-type-cards-wide">
              <div className="property-type-card-wide">
                <span className="property-icon">🏢</span>
                <div className="property-info">
                  <p className="property-label">ขายสิ่งปลูกสร้าง</p>
                  <p className="property-count">{listings.filter(l => l.type === 'sell').length} ประกาศ</p>
                </div>
              </div>
              <div className="property-type-card-wide">
                <span className="property-icon">🏠</span>
                <div className="property-info">
                  <p className="property-label">เช่าสิ่งปลูกสร้าง</p>
                  <p className="property-count">{listings.filter(l => l.type === 'rent').length} ประกาศ</p>
                </div>
              </div>
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

      {/* Create Contract Modal */}
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
