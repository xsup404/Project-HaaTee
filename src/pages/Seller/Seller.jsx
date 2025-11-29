import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Plus, BarChart3, MessageCircle, FileText, User, LogOut, 
  Building2, MapPin, DollarSign, AlertCircle, Check, Trash2, Edit2, Eye, Heart, 
  Clock, TrendingUp, Users, Award, Search, Calendar, Phone, Mail, 
  Bed, Bath, Zap, Download, ArrowRight, CheckCircle, Settings, Bell, Lock, Home as HomeIcon,
  ChevronRight, MoreVertical, AlertTriangle, Send, RotateCw } from 'lucide-react';
import usersData from '../../data/users.json';
import propertiesData from '../../data/properties.json';
import './Seller.css';

const Seller = ({ onNavigate, onLoginRequired }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);
  const [sellerProperties, setSellerProperties] = useState([]);
  
  // Modal states
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [showEditListingModal, setShowEditListingModal] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showAnalyticsCharts, setShowAnalyticsCharts] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [contractDrafts, setContractDrafts] = useState([]);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [showTenantSelector, setShowTenantSelector] = useState(false);
  const [showContractView, setShowContractView] = useState(false);
  const [viewingContract, setViewingContract] = useState(null);
  const [chatDrafts, setChatDrafts] = useState(() => {
    const saved = localStorage.getItem('sellerChatDrafts');
    return saved ? JSON.parse(saved) : {};
  });

  // Load seller data from localStorage and properties from JSON
  useEffect(() => {
    const sellerEmail = localStorage.getItem('sellerEmail');
    if (!sellerEmail) {
      onNavigate('login');
      return;
    }

    // ค้นหาเจ้าของทรัพย์สินจาก users.json
    const seller = usersData.find(u => u.email === sellerEmail);
    if (seller) {
      setCurrentSeller(seller);
      
      // ค้นหาทรัพย์สินที่เป็นของเจ้าของรายนี้
      const myProperties = propertiesData.filter(p => p.sellerId === seller.id);
      
      // แปลงข้อมูลให้เข้ากับรูปแบบของ listings
      const formattedProperties = myProperties.map(p => ({
        id: p.id,
        title: p.title,
        location: p.location,
        price: p.priceValue,
        type: p.type === 'ขาย' ? 'sell' : p.type === 'เช่า' ? 'rent' : 'sell',
        beds: p.beds,
        baths: p.baths,
        size: p.size.replace(' ตร.ม.', ''),
        views: p.views,
        saves: 0,
        contacts: 0,
        status: new Date(p.expiryDate) > new Date() ? 'active' : 'expired',
        expiryDate: p.expiryDate,
        description: p.description,
        amenities: p.amenities,
        image: p.image
      }));
      
      setSellerProperties(formattedProperties);
      setListings(formattedProperties);

      // โหลดข้อความแชทจาก localStorage
      const sellerChatKey = `seller_chats_${seller.id}`;
      const savedChats = localStorage.getItem(sellerChatKey);
      
      if (savedChats) {
        try {
          const chatsData = JSON.parse(savedChats);
          // แปลงรูปแบบข้อมูลจาก localStorage เป็นรูปแบบที่ใช้ใน state
          const messagesData = {};
          Object.keys(chatsData).forEach(chatId => {
            if (chatsData[chatId].messages && Array.isArray(chatsData[chatId].messages)) {
              // แปลง messages ให้เข้ากับรูปแบบเดิม
              messagesData[chatId] = chatsData[chatId].messages.map(msg => ({
                id: msg.id,
                sender: msg.sender === 'buyer' ? 'contact' : msg.sender === 'seller' ? 'me' : msg.sender,
                text: msg.text || msg.message,
                time: msg.time || (msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })),
                timestamp: msg.timestamp || new Date().toISOString()
              }));
            }
          });
          
          // ถ้ามีข้อมูลแชท ให้ใช้ข้อมูลนั้น ถ้าไม่มีให้ใช้ข้อมูลเริ่มต้น
          if (Object.keys(messagesData).length > 0) {
            setChatMessages(messagesData);
          } else {
            // ข้อมูลเริ่มต้นถ้ายังไม่มีแชท
            setChatMessages({
              1: [
                { id: 1, sender: 'contact', text: 'สนใจเช่าคอนโดนี้ได้ไหม?', time: '10:30' },
                { id: 2, sender: 'me', text: 'ได้ครับ พร้อมดูต่อตามที่ต้องการได้ครับ', time: '10:35' }
              ],
              2: [
                { id: 1, sender: 'contact', text: 'ราคากรรมสิทธิ์เท่าไหร่?', time: '09:15' }
              ]
            });
          }
        } catch (e) {
          console.error('Error loading chat messages:', e);
          // ข้อมูลเริ่มต้นถ้าโหลดไม่สำเร็จ
          setChatMessages({
            1: [
              { id: 1, sender: 'contact', text: 'สนใจเช่าคอนโดนี้ได้ไหม?', time: '10:30' },
              { id: 2, sender: 'me', text: 'ได้ครับ พร้อมดูต่อตามที่ต้องการได้ครับ', time: '10:35' }
            ],
            2: [
              { id: 1, sender: 'contact', text: 'ราคากรรมสิทธิ์เท่าไหร่?', time: '09:15' }
            ]
          });
        }
      } else {
        // ข้อมูลเริ่มต้นถ้ายังไม่มีแชทใน localStorage
        setChatMessages({
          1: [
            { id: 1, sender: 'contact', text: 'สนใจเช่าคอนโดนี้ได้ไหม?', time: '10:30' },
            { id: 2, sender: 'me', text: 'ได้ครับ พร้อมดูต่อตามที่ต้องการได้ครับ', time: '10:35' }
          ],
          2: [
            { id: 1, sender: 'contact', text: 'ราคากรรมสิทธิ์เท่าไหร่?', time: '09:15' }
          ]
        });
      }
    }
  }, [onNavigate]);

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
    tenantId: '',
    firstName: '',
    lastName: '',
    monthlyRent: '',
    leaseDuration: '12',
    deposit: '',
    conditions: '',
    startDate: ''
  });

  const [chatMessages, setChatMessages] = useState({});
  const [messages, setMessages] = useState('');

  // Auto-save chat messages to localStorage whenever they change
  useEffect(() => {
    if (currentSeller && Object.keys(chatMessages).length > 0) {
      saveChatToLocalStorage(chatMessages);
    }
  }, [chatMessages, currentSeller]);

  // Save chat drafts to localStorage
  useEffect(() => {
    localStorage.setItem('sellerChatDrafts', JSON.stringify(chatDrafts));
  }, [chatDrafts]);

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

  // Helper function to save chat messages to localStorage
  const saveChatToLocalStorage = (updatedMessages) => {
    if (!currentSeller) return;
    
    try {
      const sellerChatKey = `seller_chats_${currentSeller.id}`;
      const chatsData = {};
      
      // บันทึกข้อความทั้งหมดจาก state
      Object.keys(updatedMessages).forEach(chatId => {
        const allMessages = updatedMessages[chatId] || [];
        const lastMsg = allMessages[allMessages.length - 1];
        
        chatsData[chatId] = {
          propertyId: chatId,
          propertyTitle: 'ทรัพย์สิน',
          buyerEmail: '',
          buyerName: chatId === '1' ? 'นายสินธ์ กิจการ' : chatId === '2' ? 'สมศรี อินทร์เสม' : 'ผู้ติดต่อ',
          lastMessage: lastMsg?.text || '',
          lastMessageTime: lastMsg?.timestamp || new Date().toISOString(),
          unreadCount: 0,
          messages: allMessages.map(msg => ({
            id: msg.id,
            sender: msg.sender === 'me' ? 'seller' : msg.sender === 'contact' ? 'buyer' : msg.sender,
            text: msg.text,
            time: msg.time,
            timestamp: msg.timestamp || new Date().toISOString(),
            type: 'text'
          }))
        };
      });
      
      localStorage.setItem(sellerChatKey, JSON.stringify(chatsData));
    } catch (e) {
      console.error('Error saving chats to localStorage:', e);
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
    if (!contractData.propertyId || !contractData.firstName || !contractData.lastName || !contractData.monthlyRent) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }
    // Show tenant selector popup
    setShowTenantSelector(true);
  };

  const handleSendContractToTenant = (tenantId) => {
    // Add contract message to chat
    const contractMessage = `📋 ส่งสัญญาดิจิทัล E-Contract
ทรัพย์สิน: ${listings.find(l => l.id == contractData.propertyId)?.title}
ค่าเช่า: ฿${contractData.monthlyRent}/เดือน
ระยะเวลา: ${contractData.leaseDuration} เดือน
กรุณาตรวจสอบและลงนาม`;

    const newMessage = {
      id: (chatMessages[tenantId]?.length || 0) + 1,
      sender: 'me',
      text: contractMessage,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isContract: true,
      contractData: { ...contractData }
    };

    setChatMessages({
      ...chatMessages,
      [tenantId]: [
        ...chatMessages[tenantId],
        newMessage
      ]
    });
    
    alert('ส่งสัญญาเรียบร้อยแล้ว! ไปที่แชทเพื่อติดต่อผู้เช่า');
    setShowContractModal(false);
    setShowTenantSelector(false);
    setActiveTab('chat');
    setSelectedChatId(tenantId);
    setContractData({
      propertyId: '',
      tenantId: '',
      firstName: '',
      lastName: '',
      monthlyRent: '',
      leaseDuration: '12',
      deposit: '',
      conditions: '',
      startDate: ''
    });
  };

  const handleSaveDraft = () => {
    const newDraft = {
      id: editingDraftId || Date.now(),
      ...contractData,
      createdAt: new Date().toLocaleDateString('th-TH'),
      isDraft: true
    };
    if (editingDraftId) {
      setContractDrafts(contractDrafts.map(d => d.id === editingDraftId ? newDraft : d));
      alert('บันทึกร่างสัญญาเรียบร้อยแล้ว');
    } else {
      setContractDrafts([...contractDrafts, newDraft]);
      alert('บันทึกร่างสัญญาเรียบร้อยแล้ว');
    }
    setEditingDraftId(null);
    setShowContractModal(false);
    setContractData({
      propertyId: '',
      tenantId: '',
      firstName: '',
      lastName: '',
      monthlyRent: '',
      leaseDuration: '12',
      deposit: '',
      conditions: '',
      startDate: ''
    });
  };

  const handleLoadDraft = (draft) => {
    setContractData({
      propertyId: draft.propertyId,
      tenantId: draft.tenantId,
      firstName: draft.firstName,
      lastName: draft.lastName,
      monthlyRent: draft.monthlyRent,
      leaseDuration: draft.leaseDuration,
      deposit: draft.deposit,
      startDate: draft.startDate,
      conditions: draft.conditions
    });
    setEditingDraftId(draft.id);
    setShowContractModal(true);
  };

  const handleDeleteDraft = (draftId) => {
    setContractDrafts(contractDrafts.filter(d => d.id !== draftId));
    alert('ลบร่างสัญญาเรียบร้อยแล้ว');
  };

  const getAnalyticsData = () => {
    const periods = {
      '7': {
        title: '7 วันล่าสุด',
        labels: ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์'],
        views: [120, 135, 155, 128, 142, 165, 148],
        saves: [8, 12, 15, 10, 14, 18, 16],
        contacts: [3, 5, 7, 4, 6, 8, 7]
      },
      '14': {
        title: '2 สัปดาห์ล่าสุด',
        labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2'],
        views: [942, 1087],
        saves: [83, 102],
        contacts: [40, 47]
      },
      '30': {
        title: '1 เดือนล่าสุด',
        labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ที่ 4'],
        views: [942, 1087, 1156, 892],
        saves: [83, 102, 108, 78],
        contacts: [40, 47, 51, 35]
      },
      '90': {
        title: '3 เดือนล่าสุด',
        labels: ['เดือนที่ 1', 'เดือนที่ 2', 'เดือนที่ 3'],
        views: [4077, 4312, 3956],
        saves: [371, 410, 385],
        contacts: [173, 201, 188]
      }
    };
    return periods[selectedPeriod] || periods['7'];
  };

  // Handle Send Message
  // Helper function to save chat messages to localStorage
  const handleSendMessage = () => {
    if (!messages.trim() || !selectedChatId || !currentSeller) return;
    
    const newMessage = {
      id: (chatMessages[selectedChatId]?.length || 0) + 1,
      sender: 'me',
      text: messages,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    };

    const updatedChatMessages = {
      ...chatMessages,
      [selectedChatId]: [
        ...(chatMessages[selectedChatId] || []),
        newMessage
      ]
    };
    
    // Update state
    setChatMessages(updatedChatMessages);
    
    // Save message as draft
    setChatDrafts({
      ...chatDrafts,
      [selectedChatId]: messages
    });
    
    setMessages('');

    // Save to localStorage
    saveChatToLocalStorage(updatedChatMessages);
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
  const renderAnalytics = () => {
    const analyticsData = getAnalyticsData();
    const maxValue = Math.max(
      ...analyticsData.labels.map((_, i) => Math.max(analyticsData.views[i], analyticsData.saves[i], analyticsData.contacts[i]))
    );
    
    return (
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
            <h3>สถิติประกาศ</h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="7">7 วัน</option>
              <option value="14">14 วัน</option>
              <option value="30">1 เดือน</option>
              <option value="90">3 เดือน</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <div className="chart-svg">
              <svg viewBox="0 0 700 280" style={{ width: '100%', height: '250px' }}>
                {/* Grouped bar chart */}
                {analyticsData.labels.map((label, i) => {
                  const baseX = 60 + i * 80;
                  const viewsHeight = (analyticsData.views[i] / maxValue) * 180;
                  const savesHeight = (analyticsData.saves[i] / maxValue) * 180;
                  const contactsHeight = (analyticsData.contacts[i] / maxValue) * 180;
                  
                  return (
                    <g key={i}>
                      {/* Views bar */}
                      <rect x={baseX - 15} y={220 - viewsHeight} width="12" height={viewsHeight} fill="#3B82F6" opacity="0.8" />
                      {/* Saves bar */}
                      <rect x={baseX} y={220 - savesHeight} width="12" height={savesHeight} fill="#10B981" opacity="0.8" />
                      {/* Contacts bar */}
                      <rect x={baseX + 15} y={220 - contactsHeight} width="12" height={contactsHeight} fill="#F97316" opacity="0.8" />
                      {/* Label */}
                      <text x={baseX} y="240" fontSize="11" textAnchor="middle" fill="#718096">{label}</text>
                    </g>
                  );
                })}
                {/* Axes */}
                <line x1="50" y1="30" x2="50" y2="220" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="50" y1="220" x2="680" y2="220" stroke="#E2E8F0" strokeWidth="2" />
              </svg>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#3B82F6' }}></span>
                <span>ยอดดู</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#10B981' }}></span>
                <span>ยอดสนใจ</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#F97316' }}></span>
                <span>ยอดติดต่อ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-section">
          <div className="section-header">
            <h3>สัดส่วนประเภท</h3>
          </div>
          <div className="stat-info-grid">
            <div className="stat-info-item">
              <span className="stat-label">ขาย</span>
              <strong>{listings.filter(l => l.type === 'sell').length}</strong>
            </div>
            <div className="stat-info-item">
              <span className="stat-label">เช่า</span>
              <strong>{listings.filter(l => l.type === 'rent').length}</strong>
            </div>
          </div>

          <div className="stats-summary" style={{ marginTop: '20px' }}>
            <div className="summary-row">
              <span>ยอดดูทั้งหมด:</span>
              <strong>{stats.totalViews.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>ยอดสนใจทั้งหมด:</span>
              <strong>{stats.totalSaves.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>ยอดติดต่อทั้งหมด:</span>
              <strong>{stats.totalContacts.toLocaleString()}</strong>
            </div>
            <div className="summary-row" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginTop: '12px' }}>
              <span>อัตราการแปลง:</span>
              <strong style={{ color: '#10B981' }}>{((stats.totalContacts / Math.max(stats.totalViews, 1)) * 100).toFixed(1)}%</strong>
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
  };

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
                      {msg.isContract && (
                        <button 
                          onClick={() => {
                            setViewingContract(msg.contractData);
                            setShowContractView(true);
                          }}
                          style={{
                            marginTop: '8px',
                            padding: '6px 12px',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          👁️ ดูสัญญา
                        </button>
                      )}
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

      {/* View Contract Modal */}
      {showContractView && viewingContract && (
        <div className="modal-overlay" onClick={() => setShowContractView(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ดูสัญญาดิจิทัล E-Contract</h3>
              <button onClick={() => setShowContractView(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="contract-preview">
                <div className="preview-box">
                  <p><strong>สัญญาเช่าอสังหาริมทรัพย์</strong></p>
                  <p>ประเภท: ระหว่างปีที่ 1 ถึง 3 ปี</p>
                  <p>ผู้ให้เช่า: [ชื่อของคุณ]</p>
                  <p>ผู้เช่า: {viewingContract.firstName} {viewingContract.lastName}</p>
                  <p>ทรัพย์สิน: {listings.find(l => l.id == viewingContract.propertyId)?.title}</p>
                  <p>ค่าเช่ารายเดือน: ฿{viewingContract.monthlyRent}</p>
                  <p>ระยะเวลา: {viewingContract.leaseDuration} เดือน</p>
                  {viewingContract.deposit && <p>เงินมัดจำ: ฿{viewingContract.monthlyRent * viewingContract.deposit} ({viewingContract.deposit} เดือน)</p>}
                  {viewingContract.startDate && <p>วันที่เริ่มเช่า: {viewingContract.startDate}</p>}
                  {viewingContract.conditions && <p>เงื่อนไข: {viewingContract.conditions}</p>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowContractView(false)}>ปิด</button>
              <button className="btn-primary"><Download size={16} /> ดาวน์โหลด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
          {contractDrafts.length > 0 && (
            <>
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>📝 บันทึกร่างสัญญา ({contractDrafts.length})</h4>
                {contractDrafts.map(draft => (
                  <div key={draft.id} style={{ padding: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '13px', color: '#92400E' }}>
                        {listings.find(l => l.id == draft.propertyId)?.title}
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#B45309' }}>
                        ผู้เช่า: {draft.firstName} {draft.lastName} | สร้างเมื่อ: {draft.createdAt}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleLoadDraft(draft)}
                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✏️ แก้ไข
                      </button>
                      <button 
                        onClick={() => handleDeleteDraft(draft.id)}
                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>สัญญาที่เสร็จสมบูรณ์</h4>
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
                  <div className="form-row">
                    <div className="form-group">
                      <label>ชื่อผู้เช่า *</label>
                      <input 
                        type="text"
                        value={contractData.firstName}
                        onChange={(e) => setContractData({ ...contractData, firstName: e.target.value })}
                        placeholder="ชื่อ"
                      />
                    </div>
                    <div className="form-group">
                      <label>นามสกุลผู้เช่า *</label>
                      <input 
                        type="text"
                        value={contractData.lastName}
                        onChange={(e) => setContractData({ ...contractData, lastName: e.target.value })}
                        placeholder="นามสกุล"
                      />
                    </div>
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
                  <p>ผู้เช่า: {contractData.firstName} {contractData.lastName}</p>
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

      {/* Tenant Selector Modal */}
      {showTenantSelector && (
        <div className="modal-overlay" onClick={() => setShowTenantSelector(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>เลือกผู้เช่าเพื่อส่งสัญญา</h3>
              <button onClick={() => setShowTenantSelector(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="tenant-list">
                {chatList.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => handleSendContractToTenant(chat.id)}
                    style={{
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        backgroundColor: '#F3F4F6',
                        borderColor: '#3B82F6'
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                      e.currentTarget.style.borderColor = '#3B82F6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#1F2937' }}>
                      {chat.name}
                    </p>
                    <p style={{ margin: '0', fontSize: '13px', color: '#6B7280' }}>
                      {chat.lastMessage?.substring(0, 40) || 'ยังไม่มีข้อความ'}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowTenantSelector(false)}>ยกเลิก</button>
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
              <span>{currentSeller?.name?.[0] || 'A'}</span>
            </div>
            <div className="profile-info">
              <h3>{currentSeller?.name || 'เจ้าของทรัพย์'}</h3>
              <p>
                {currentSeller?.sellerType === 'agent' ? '👨‍💼 นายหน้า' : '🏠 เจ้าของทรัพย์'}
                {currentSeller?.role && ` / ${currentSeller.role}`}
              </p>
              {currentSeller?.verified && <div className="verify-badge">✅ ยืนยันแล้ว</div>}
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <label><Mail size={16} /> อีเมล</label>
              <p>{currentSeller?.email || 'N/A'}</p>
            </div>
            <div className="detail-row">
              <label><Phone size={16} /> เบอร์โทร</label>
              <p>{currentSeller?.phone || 'N/A'}</p>
            </div>
            <div className="detail-row">
              <label><Award size={16} /> ประเมินดี</label>
              <p>⭐ {currentSeller?.rating || 4.5} / 5.0</p>
            </div>
            {currentSeller?.certificates && currentSeller?.certificates.length > 0 && (
              <div className="detail-row">
                <label><CheckCircle size={16} /> ใบรับรอง</label>
                <p>{currentSeller.certificates.join(', ')}</p>
              </div>
            )}
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
              <span className="stat-icon">✅</span>
              <div>
                <p>ขายสำเร็จ</p>
                <strong>{currentSeller?.totalSold || 0}</strong>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱</span>
              <div>
                <p>เวลาตอบรับ</p>
                <strong>{currentSeller?.responseTime || '2 hours'}</strong>
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
            <div className="avatar-placeholder">{currentSeller?.name?.[0] || 'A'}</div>
            <div className="user-status"></div>
          </div>
          <div className="user-info">
            <h4>{currentSeller?.name || 'เจ้าของทรัพย์'}</h4>
            <p>{currentSeller?.sellerType === 'agent' ? '👨‍💼 นายหน้า' : '🏠 เจ้าของทรัพย์'}</p>
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
              <span>{currentSeller?.name?.[0] || 'A'}</span>
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
