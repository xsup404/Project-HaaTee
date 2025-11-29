import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './Admin.css';
import propertiesData from '../../data/properties.json';
import usersData from '../../data/users.json';
import reportsData from '../../data/reports.json';
import chatMessagesData from '../../data/chatMessages.json';
import { 
  LayoutDashboard, Users, Building2, FileText, AlertCircle, 
  MessageSquare, Settings, TrendingUp, Shield, Award,
  Search, Bell, Menu, X, Eye, Ban, Home as HomeIcon,
  CheckCircle, XCircle, Filter, Download, Upload,
  Calendar, DollarSign, MapPin, Star, Phone, Mail,
  Edit, Trash2, Plus, ArrowUp, ArrowDown,
  Activity, PieChart, BarChart3, Clock, Package,
  UserCheck, FileCheck, Megaphone, Tag, ChevronRight,
  Inbox, CreditCard, HelpCircle, LogOut, Sparkles
} from 'lucide-react';

const Admin = ({ onNavigate, onLogout, adminReportTab, setAdminReportTab, adminActiveTab, setAdminActiveTab }) => {
  const [activeTab, setActiveTab] = useState(adminActiveTab || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [contractTab, setContractTab] = useState(adminReportTab || 'room');
  const [analyticsTab, setAnalyticsTab] = useState('user-stats');
  const [viewingReport, setViewingReport] = useState(null);
  const [viewingChat, setViewingChat] = useState(null);
  const [moderationModal, setModerationModal] = useState(null); // { type: 'ban'|'delete'|'message', issue, reason: '' }
  const [moderationReason, setModerationReason] = useState('');
  const [resolvedIssueIds, setResolvedIssueIds] = useState(new Set());
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [viewingContract, setViewingContract] = useState(null);
  // Settings States
  const [adSettings, setAdSettings] = useState({
    bannerAd: true,
    sidebarAds: 2,
    footerAd: true,
    adSize: 'medium'
  });
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@haatee.com',
    phone: '08x-xxx-xxxx',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=667eea&color=fff',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [buyerMenu, setBuyerMenu] = useState({
    home: true,
    properties: true,
    search: true,
    savedProperties: true,
    profile: true,
    messages: true,
    aboutContact: true
  });
  const [systemSettings, setSystemSettings] = useState({
    listingExpiry: 90,
    maxListingsPerUser: 100,
    contractYears: 3,
    supportEmail: 'support@haatee.com',
    supportPhone: '0x-xxx-xxxx',
    smartFilter: true,
    digitalContract: true
  });
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
  const [issues, setIssues] = useState([]);
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('ทั้งหมด');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('ทั้งหมด');

  // Helper function to get time ago - use useCallback to prevent recreation
  const getTimeAgo = useCallback((dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 30) return `${diffDays} วันที่แล้ว`;
    return `${Math.floor(diffDays / 30)} เดือนที่แล้ว`;
  }, []);
  
  // Helper function to parse time ago for sorting - use useCallback
  const parseTimeAgo = useCallback((timeStr) => {
    if (!timeStr || timeStr === 'ไม่ระบุ') return 0;
    const match = timeStr.match(/(\d+)/);
    if (!match) return 0;
    const num = parseInt(match[1]);
    if (timeStr.includes('นาที')) return num;
    if (timeStr.includes('ชั่วโมง')) return num * 60;
    if (timeStr.includes('วัน')) return num * 1440;
    if (timeStr.includes('เดือน')) return num * 43200;
    return 0;
  }, []);

  // Moderation handlers
  const handleBanAccount = useCallback((issue) => {
    setModerationModal({ type: 'ban', issue, reason: '' });
  }, []);

  const handleDeletePost = useCallback((issue) => {
    setModerationModal({ type: 'delete', issue, reason: '' });
  }, []);

  const handleSendMessage = useCallback((issue) => {
    setModerationModal({ type: 'message', issue, reason: '' });
  }, []);

  const confirmModeration = useCallback((action) => {
    if (!moderationReason.trim()) {
      alert('กรุณากรอกเหตุผลหรือข้อความ');
      return;
    }

    // Save moderation action to localStorage
    const moderationLog = JSON.parse(localStorage.getItem('admin_moderation_log') || '[]');
    moderationLog.push({
      id: `mod_${Date.now()}`,
      issueId: moderationModal.issue.id,
      action: moderationModal.type,
      reason: moderationReason,
      timestamp: new Date().toISOString(),
      adminId: 'admin_1'
    });
    localStorage.setItem('admin_moderation_log', JSON.stringify(moderationLog));

    // Mark issue as resolved
    setResolvedIssueIds(prev => new Set([...prev, moderationModal.issue.id]));

    // Filter out resolved issue
    setIssues(prev => prev.filter(i => i.id !== moderationModal.issue.id));

    // Close modal
    setModerationModal(null);
    setModerationReason('');

    // Show success message
    const actionText = moderationModal.type === 'ban' ? 'ระงับบัญชี' : 
                      moderationModal.type === 'delete' ? 'ลบโพสต์' : 'ส่งข้อความ';
    alert(`${actionText}สำเร็จ! รายงานลดลง 1 รายการ`);
  }, [moderationReason, moderationModal]);

  const handleResolveReport = useCallback((issue) => {
    // Mark as resolved
    setResolvedIssueIds(prev => new Set([...prev, issue.id]));

    // Save to resolution log
    const resolutionLog = JSON.parse(localStorage.getItem('admin_resolution_log') || '[]');
    resolutionLog.push({
      id: `res_${Date.now()}`,
      issueId: issue.id,
      timestamp: new Date().toISOString(),
      adminId: 'admin_1'
    });
    localStorage.setItem('admin_resolution_log', JSON.stringify(resolutionLog));

    // Remove from issues list
    setIssues(prev => prev.filter(i => i.id !== issue.id));

    // Show success message
    alert('✓ แก้ไขแล้ว! รายงานลดลง 1 รายการ');
  }, []);

  // Tab navigation handlers with useCallback
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleModerationTabChange = useCallback(() => {
    setActiveTab('moderation');
    setContractTab('room');
  }, []);

  const handleUserReportTabChange = useCallback(() => {
    setActiveTab('moderation');
    setContractTab('user');
  }, []);

  const handleChatReportTabChange = useCallback(() => {
    setActiveTab('moderation');
    setContractTab('chat');
  }, []);

  // โหลดข้อมูลจริงจาก JSON - ใช้ cache เพื่อลดการคำนวณ
  useEffect(() => {
    try {
      // ตรวจสอบ cache (cache ไว้ 10 นาที)
      const cacheKey = 'admin_stats_cache';
      const cacheTime = 10 * 60 * 1000; // 10 นาที
      const cached = localStorage.getItem(cacheKey);
      let cachedData = null;
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const now = Date.now();
          if (parsed.timestamp && (now - parsed.timestamp) < cacheTime) {
            cachedData = parsed.data;
          }
        } catch (e) {
          // Cache invalid, ignore
        }
      }

      if (cachedData) {
        // ใช้ข้อมูลจาก cache
        setStats(cachedData.stats);
        setTopProperties(cachedData.topProperties);
        setUsers(cachedData.users);
        setProperties(cachedData.properties);
        setIssues(cachedData.issues);
        return;
      }

      // คำนวณข้อมูลใหม่ (ถ้าไม่มี cache หรือ cache หมดอายุ)
      // นับผู้ใช้
      const totalUsers = usersData.length;
      const verifiedUsers = usersData.filter(u => u.verified).length;
      
      // นับผู้ใช้ใหม่ (สมมติว่าเป็นผู้ใช้ที่ join ในเดือนล่าสุด)
      const currentDate = new Date();
      const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      const newUsersCount = usersData.filter(u => {
        if (!u.joinDate) return false;
        const joinDate = new Date(u.joinDate);
        return joinDate >= oneMonthAgo;
      }).length;

      // นับทรัพย์สิน
      const totalProperties = propertiesData.length;
      
      // นับทรัพย์สินใหม่ (สมมติว่าเป็นทรัพย์สินที่สร้างในเดือนล่าสุด)
      const newPropertiesCount = propertiesData.filter(p => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        return createdDate >= oneMonthAgo;
      }).length;
      
      // นับทรัพย์สินที่ถูกรายงาน (จาก localStorage admin_reports)
      let adminReports = [];
      try {
        const storedReports = localStorage.getItem('admin_reports');
        if (storedReports) {
          adminReports = JSON.parse(storedReports);
        }
      } catch (e) {
        console.error('Error loading admin reports:', e);
      }
      const flaggedCount = adminReports.length;

      // หาทรัพย์สินยอดนิยม (จำกัดแค่ 10 อันแรก เพื่อลดการคำนวณ)
      const topProps = propertiesData
        .map((prop) => ({
          id: prop.id,
          title: prop.title,
          views: prop.views || 0,
          location: prop.location,
          price: prop.price,
          type: prop.type,
          seller: prop.seller,
          status: (prop.views || 0) > 5000 ? 'hot' : 'active'
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10); // จำกัดแค่ 10 อันแรก

      // คำนวณรายได้จากราคาทรัพย์สิน (สมมติว่าเป็น 5% ของราคาทรัพย์สินทั้งหมด)
      const totalRevenue = propertiesData.reduce((sum, prop) => {
        const priceValue = prop.priceValue || prop.salePrice || 0;
        return sum + (priceValue * 0.05);
      }, 0);

      // นับสัญญา (สมมติว่าเป็น 50% ของทรัพย์สิน)
      const activeContracts = Math.floor(totalProperties * 0.5);
      const completedContracts = Math.floor(totalProperties * 0.25);

      // คำนวณการเติบโต (เปรียบเทียบกับเดือนก่อน)
      const monthlyGrowth = newUsersCount > 0 ? ((newUsersCount / totalUsers) * 100).toFixed(1) : 0;

      const newStats = {
        totalUsers,
        totalProperties,
        verifiedUsers,
        newUsers: newUsersCount,
        newProperties: newPropertiesCount,
        flaggedListings: flaggedCount,
        pendingReports: adminReports.filter(r => r.status !== 'resolved' && r.status !== 'pending').length + reportsData.filter(r => r.status === 'open').length,
        pendingApprovals: Math.floor(activeContracts * 0.1), // สมมติว่า 10% ของสัญญารออนุมัติ
        totalRevenue: Math.floor(totalRevenue),
        activeContracts,
        completedContracts,
        monthlyGrowth: parseFloat(monthlyGrowth),
        onlineUsers: Math.floor(totalUsers * 0.3) // สมมติว่า 30% ของผู้ใช้ online
      };

      setStats(prev => ({ ...prev, ...newStats }));
      setTopProperties(topProps);
      setUsers(usersData.slice(0, 50)); // จำกัดแค่ 50 ผู้ใช้แรก
      setProperties(propertiesData.slice(0, 50)); // จำกัดแค่ 50 ทรัพย์สินแรก

      // โหลดรายงานจริงจาก reports.json และ localStorage
      const allReports = [...reportsData];
      adminReports.forEach(report => {
        allReports.push({
          id: `admin_${report.id || Date.now()}`,
          propertyId: report.propertyId,
          propertyTitle: report.propertyTitle,
          type: report.reportType || 'ข้อมูลไม่ถูกต้อง',
          description: report.reportDetails || '',
          severity: 'high',
          status: report.status || 'open',
          reportedBy: report.reportedBy || 'ผู้ใช้',
          reportedAt: report.reportedAt || new Date().toISOString()
        });
      });

      const severityConfig = {
        critical: {
          emoji: '🔴',
          bgColor: '#FEE2E2',
          borderColor: '#EF4444',
          textColor: '#991B1B',
          subtextColor: '#7F1D1D',
          priorityColor: '#DC2626'
        },
        high: {
          emoji: '🟠',
          bgColor: '#FFEDD5',
          borderColor: '#F97316',
          textColor: '#92400E',
          subtextColor: '#B45309',
          priorityColor: '#EA580C'
        },
        low: {
          emoji: '🟡',
          bgColor: '#FEFCE8',
          borderColor: '#FCD34D',
          textColor: '#713F12',
          subtextColor: '#854D0E',
          priorityColor: '#FBBD34'
        }
      };

      const reportIssues = allReports
        .filter(report => report.status === 'open')
        .sort((a, b) => {
          const severityOrder = { critical: 0, high: 1, low: 2 };
          return (severityOrder[a.severity] || 1) - (severityOrder[b.severity] || 1);
        })
        .map(report => {
          const config = severityConfig[report.severity] || severityConfig.high;
          return { ...report, ...config };
        });
      
      setIssues(reportIssues);

      // บันทึก cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: {
            stats: newStats,
            topProperties: topProps,
            users: usersData,
            properties: propertiesData,
            issues: reportIssues
          }
        }));
      } catch (e) {
        console.error('Error saving cache:', e);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // คำนวณ quickStats จากข้อมูลจริง - ใช้ useMemo แทน useEffect
  const quickStats = useMemo(() => {
    // คำนวณเปอร์เซ็นต์การเปลี่ยนแปลง
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };
    
    // สมมติว่ามีข้อมูลเดือนก่อน (ในอนาคตอาจเก็บใน localStorage)
    const previousMonthUsers = Math.floor(stats.totalUsers * 0.95);
    const previousMonthReports = Math.floor(stats.pendingReports * 0.95);
    const previousMonthProperties = Math.floor(stats.totalProperties * 0.92);
    const previousMonthContracts = Math.floor(stats.activeContracts * 0.95);
    
    return [
      { 
        id: 1, 
        label: 'ผู้ใช้ใหม่', 
        value: stats.newUsers.toLocaleString(), 
        change: calculateChange(stats.newUsers, Math.max(1, previousMonthUsers - stats.totalUsers + stats.newUsers)), 
        trend: stats.newUsers > 0 ? 'up' : 'down',
        icon: <Users size={24} />,
        color: 'purple'
      },
      { 
        id: 2, 
        label: 'ปัญหาที่รอแก้ไข', 
        value: stats.pendingReports.toLocaleString(), 
        change: calculateChange(stats.pendingReports, previousMonthReports), 
        trend: stats.pendingReports > previousMonthReports ? 'up' : 'down',
        icon: <AlertCircle size={24} />,
        color: 'blue'
      },
      { 
        id: 3, 
        label: 'ทรัพย์สินใหม่', 
        value: stats.newProperties.toLocaleString(), 
        change: calculateChange(stats.newProperties, Math.max(1, previousMonthProperties - stats.totalProperties + stats.newProperties)), 
        trend: stats.newProperties > 0 ? 'up' : 'down',
        icon: <Building2 size={24} />,
        color: 'green'
      },
      { 
        id: 4, 
        label: 'สัญญารอดำเนินการ', 
        value: stats.pendingApprovals.toLocaleString(), 
        change: calculateChange(stats.pendingApprovals, Math.floor(previousMonthContracts * 0.1)), 
        trend: stats.pendingApprovals > Math.floor(previousMonthContracts * 0.1) ? 'up' : 'down',
        icon: <FileText size={24} />,
        color: 'orange'
      }
    ];
  }, [stats]);

  // สร้าง recentActivities จากข้อมูลจริง - ใช้ useMemo และ cache
  const recentActivities = useMemo(() => {
    // ใช้ cache เพื่อลดการคำนวณ
    const cacheKey = 'admin_recent_activities_cache';
    const cacheTime = 2 * 60 * 1000; // 2 นาที
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        if (parsed.timestamp && (now - parsed.timestamp) < cacheTime) {
          // ใช้ cache แต่ต้องแปลง icon กลับเป็น React element
          return parsed.data.map(activity => ({
            ...activity,
            icon: activity.type === 'user' ? <UserCheck size={16} /> :
                  activity.type === 'property' ? <HomeIcon size={16} /> :
                  <AlertCircle size={16} />
          }));
        }
      } catch (e) {
        // Cache invalid, continue to calculate
      }
    }

    const activities = [];
    
    // เพิ่มผู้ใช้ใหม่ล่าสุด (จำกัดแค่ 2 คน)
    const sortedUsers = [...usersData].sort((a, b) => {
      const dateA = new Date(a.joinDate || 0);
      const dateB = new Date(b.joinDate || 0);
      return dateB - dateA;
    }).slice(0, 2);
    
    sortedUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        user: user.name,
        action: 'ลงทะเบียนบัญชีใหม่',
        time: getTimeAgo(user.joinDate),
        type: 'user',
        icon: <UserCheck size={16} />
      });
    });
    
    // เพิ่มทรัพย์สินใหม่ล่าสุด (จำกัดแค่ 2 รายการ)
    const sortedProperties = [...propertiesData].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    }).slice(0, 2);
    
    sortedProperties.forEach(prop => {
      activities.push({
        id: `prop_${prop.id}`,
        user: prop.seller?.name || 'ไม่ระบุ',
        action: `ลงประกาศทรัพย์ใหม่: ${prop.title}`,
        time: getTimeAgo(prop.createdAt),
        type: 'property',
        icon: <HomeIcon size={16} />
      });
    });
    
    // เพิ่มรายงานล่าสุด (จำกัดแค่ 1 รายการ)
    if (issues.length > 0) {
      const recentReport = issues[0];
      activities.push({
        id: `report_${recentReport.id}`,
        user: recentReport.reportedBy || 'ผู้ใช้',
        action: `รายงานทรัพย์ผิดปกติ: ${recentReport.propertyTitle || recentReport.propertyId}`,
        time: getTimeAgo(recentReport.reportedAt),
        type: 'alert',
        icon: <AlertCircle size={16} />
      });
    }
    
    // เรียงตามเวลา
    activities.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });
    
    const result = activities.slice(0, 5);
    
    // บันทึก cache (ไม่รวม React elements)
    try {
      const cacheData = result.map(activity => ({
        ...activity,
        icon: null // ไม่เก็บ React element ใน cache
      }));
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: cacheData
      }));
    } catch (e) {
      // Ignore cache errors
    }
    
    return result;
  }, [issues.length, getTimeAgo, parseTimeAgo]);

  // Memoize filtered issues by type - ลดการคำนวณซ้ำ
  const issuesByType = useMemo(() => {
    return {
      room: issues.filter(i => i.type === 'room'),
      user: issues.filter(i => i.type === 'user'),
      chat: issues.filter(i => i.type === 'chat')
    };
  }, [issues]);

  // Memoize paginated properties - ลดการคำนวณซ้ำ
  const paginatedProperties = useMemo(() => {
    const itemsPerPage = 10;
    const startIdx = (currentPage - 1) * itemsPerPage;
    return properties.slice(startIdx, startIdx + itemsPerPage);
  }, [properties, currentPage]);

  // Memoize paginated users - ลดการคำนวณซ้ำ
  const paginatedUsers = useMemo(() => {
    const itemsPerPage = 10;
    const startIdx = (currentPage - 1) * itemsPerPage;
    return users.slice(startIdx, startIdx + itemsPerPage);
  }, [users, currentPage]);

  // สร้าง revenueData จากข้อมูลจริง - ใช้ useMemo และ cache
  const revenueData = useMemo(() => {
    // ใช้ cache เพื่อลดการคำนวณ
    const cacheKey = 'admin_revenue_data_cache';
    const cacheTime = 10 * 60 * 1000; // 10 นาที (ข้อมูลรายได้ไม่ค่อยเปลี่ยน)
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        if (parsed.timestamp && (now - parsed.timestamp) < cacheTime) {
          return parsed.data;
        }
      } catch (e) {
        // Cache invalid, continue to calculate
      }
    }

    // คำนวณรายได้จากทรัพย์สินตามเดือน
    const monthlyRevenue = {};
    propertiesData.forEach(prop => {
      if (prop.createdAt) {
        const date = new Date(prop.createdAt);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const priceValue = prop.priceValue || prop.salePrice || 0;
        const revenue = priceValue * 0.05; // 5% commission
        
        if (!monthlyRevenue[monthKey]) {
          monthlyRevenue[monthKey] = 0;
        }
        monthlyRevenue[monthKey] += revenue;
      }
    });
    
    // แปลงเป็น array และเรียงตามเดือน
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const currentMonth = new Date().getMonth();
    const revenueArray = [];
    const revenueValues = Object.values(monthlyRevenue);
    const maxRevenue = revenueValues.length > 0 ? Math.max(...revenueValues, 1000000) : 1000000;
    
    // สร้างข้อมูล 7 เดือนล่าสุด
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(currentMonth - i);
      const monthKey = `${targetDate.getFullYear()}-${targetDate.getMonth()}`;
      const revenue = monthlyRevenue[monthKey] || 0;
      const percentage = maxRevenue > 0 ? Math.round((revenue / maxRevenue) * 100) : 0;
      
      revenueArray.push({
        month: months[targetDate.getMonth()],
        value: percentage,
        revenue: Math.floor(revenue)
      });
    }
    
    // บันทึก cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: revenueArray
      }));
    } catch (e) {
      // Ignore cache errors
    }
    
    return revenueArray;
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    if (isLoggingOut) return; // Prevent multiple clicks
    setIsLoggingOut(true);
    // Call onLogout immediately, don't wait for timeout
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate('home');
    }
    // Close modal after a short delay
    setTimeout(() => {
      setShowLogoutModal(false);
      setIsLoggingOut(false);
    }, 300);
  }, [onLogout, onNavigate]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutModal(false);
    setIsLoggingOut(false);
  }, []);

  // Memoize donut chart data to avoid recalculations
  const donutChartData = useMemo(() => {
    const roomCount = issuesByType.room.length;
    const userCount = issuesByType.user.length;
    const chatCount = issuesByType.chat.length;
    const total = roomCount + userCount + chatCount || 1;
    
    const roomPercentage = (roomCount / total) * 360;
    const userPercentage = (userCount / total) * 360;
    const chatPercentage = (chatCount / total) * 360;
    
    const gap = 8;
    
    return {
      roomPercentage,
      userPercentage,
      chatPercentage,
      gap,
      total: roomCount + userCount + chatCount,
      roomCount,
      userCount,
      chatCount
    };
  }, [issuesByType]);

  const renderDashboard = () => (
    <div className="dashboard-wrapper">
      {/* Quick Stats */}
      <div className="quick-stats-grid">
        {quickStats.length > 0 ? quickStats.map(stat => (
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
        )) : (
          // Fallback while loading
          <>
            <div className="quick-stat-card purple">
              <div className="stat-icon-wrapper">
                <div className="stat-icon purple">
                  <Users size={24} />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-label">ผู้ใช้ใหม่</p>
                <h3 className="stat-value">{stats.newUsers.toLocaleString()}</h3>
                <div className="stat-change up">
                  <ArrowUp size={14} />
                  <span>+0%</span>
                </div>
              </div>
            </div>
            <div className="quick-stat-card blue">
              <div className="stat-icon-wrapper">
                <div className="stat-icon blue">
                  <AlertCircle size={24} />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-label">ปัญหาที่รอแก้ไข</p>
                <h3 className="stat-value">{stats.pendingReports.toLocaleString()}</h3>
                <div className="stat-change down">
                  <ArrowDown size={14} />
                  <span>+0%</span>
                </div>
              </div>
            </div>
            <div className="quick-stat-card green">
              <div className="stat-icon-wrapper">
                <div className="stat-icon green">
                  <Building2 size={24} />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-label">ทรัพย์สินใหม่</p>
                <h3 className="stat-value">{stats.newProperties.toLocaleString()}</h3>
                <div className="stat-change up">
                  <ArrowUp size={14} />
                  <span>+0%</span>
                </div>
              </div>
            </div>
            <div className="quick-stat-card orange">
              <div className="stat-icon-wrapper">
                <div className="stat-icon orange">
                  <FileText size={24} />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-label">สัญญารอดำเนินการ</p>
                <h3 className="stat-value">{stats.activeContracts.toLocaleString()}</h3>
                <div className="stat-change down">
                  <ArrowDown size={14} />
                  <span>+0%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Charts Grid */}
      <div className="charts-grid">
        {/* Issues List */}
        <div className="chart-card large-chart" style={{ border: '2px solid #E2E8F0', borderRadius: '16px' }}>
          <div className="chart-header">
            <div>
              <h3>สิ่งที่ต้องเร่งแก้ไข</h3>
              <p className="chart-subtitle">จัดการรายงานและปัญหา</p>
            </div>
          </div>
          <div className="chart-body" style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {/* Room Reports */}
              <div style={{ background: 'white', border: '2px solid #FCA5A5', borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)' }} onClick={handleModerationTabChange}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏠</div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', margin: '0 0 6px 0' }}>รายงานห้อง</h4>
                <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 16px 0' }}>การร้องเรียนห้องและสถานที่</p>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#DC2626', marginBottom: '12px' }}>
                  {issuesByType.room.length}
                </div>
                <button onClick={handleModerationTabChange} style={{ width: '100%', padding: '10px 12px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}>ดูรายละเอียด</button>
              </div>

              {/* User Reports */}
              <div style={{ background: 'white', border: '2px solid #93C5FD', borderRadius: '12px', padding: '20px', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>👤</div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', margin: '0 0 6px 0' }}>รายงานผู้ใช้</h4>
                <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 16px 0' }}>การร้องเรียนเกี่ยวกับผู้ใช้</p>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563EB', marginBottom: '12px' }}>
                  {issuesByType.user.length}
                </div>
                <button 
                  onClick={handleUserReportTabChange}
                  style={{ width: '100%', padding: '10px 12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                >
                  ดูรายละเอียด
                </button>
              </div>

              {/* Chat Reports */}
              <div style={{ background: 'white', border: '2px solid #A7F3D0', borderRadius: '12px', padding: '20px', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', margin: '0 0 6px 0' }}>รายงานแชท</h4>
                <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 16px 0' }}>แชทไม่สุภาพและการทำร้ายอาจารย์</p>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#059669', marginBottom: '12px' }}>
                  {issuesByType.chat.length}
                </div>
                <button 
                  onClick={handleChatReportTabChange}
                  style={{ width: '100%', padding: '10px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                >
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Summary - Separate Card in Grid */}
        <div className="summary-chart-card">
          <div className="chart-header">
            <div>
              <h3>สรุปรายงาน</h3>
              <p className="chart-subtitle">จำแนกตามประเภท</p>
            </div>
          </div>
          <div className="chart-body center">
            <div className="donut-chart">
              <svg viewBox="0 0 200 200" className="donut-svg">
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                  <linearGradient id="roomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#FCA5A5', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#EF4444', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#FCA5A5', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#EF4444', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#FCA5A5', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#EF4444', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                
                {/* Background circle */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="32"/>
                
                {/* Room Reports - Red gradient */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#roomGrad)" strokeWidth="32"
                  strokeDasharray={`${(donutChartData.roomPercentage - donutChartData.gap) * 2.51} ${360 * 2.51}`} 
                  strokeDashoffset="0" transform="rotate(-90 100 100)" filter="url(#shadow)" strokeLinecap="round"/>
                
                {/* User Reports - Blue gradient */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#userGrad)" strokeWidth="32"
                  strokeDasharray={`${(donutChartData.userPercentage - donutChartData.gap) * 2.51} ${360 * 2.51}`} 
                  strokeDashoffset={`${-(donutChartData.roomPercentage) * 2.51}`} transform="rotate(-90 100 100)" 
                  filter="url(#shadow)" strokeLinecap="round"/>
                
                {/* Chat Reports - Teal gradient */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#chatGrad)" strokeWidth="32"
                  strokeDasharray={`${(donutChartData.chatPercentage - donutChartData.gap) * 2.51} ${360 * 2.51}`} 
                  strokeDashoffset={`${-(donutChartData.roomPercentage + donutChartData.userPercentage) * 2.51}`} transform="rotate(-90 100 100)" 
                  filter="url(#shadow)" strokeLinecap="round"/>
              </svg>
              <div className="donut-center">
                <h4>{issues.length}</h4>
                <p>รายงานทั้งหมด</p>
              </div>
            </div>
          </div>
          <div className="chart-footer">
            <div className="distribution-list">
              <div className="distribution-item">
                <span className="dist-color" style={{ background: '#EF4444' }}></span>
                <span className="dist-label">🏠 รายงานห้อง</span>
                <strong>{issuesByType.room.length}</strong>
              </div>
              <div className="distribution-item">
                <span className="dist-color" style={{ background: '#3B82F6' }}></span>
                <span className="dist-label">👤 รายงานผู้ใช้</span>
                <strong>{issuesByType.user.length}</strong>
              </div>
              <div className="distribution-item">
                <span className="dist-color" style={{ background: '#14B8A6' }}></span>
                <span className="dist-label">💬 รายงานแชท</span>
                <strong>{issuesByType.chat.length}</strong>
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
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input type="text" placeholder="ค้นหาชื่อ อีเมล..." />
        </div>
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
            {users.map(user => (
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
        <span className="pagination-info">แสดง {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, stats.totalUsers)} จาก {stats.totalUsers.toLocaleString()} ผู้ใช้</span>
        <div className="pagination-controls">
          <button 
            className="page-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &larr;
          </button>
          {[1, 2, 3].map(page => (
            <button 
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );

  // Memoize filtered properties to avoid recalculating on every render
  const filteredProperties = useMemo(() => {
    return propertiesData.filter(prop => {
      // Search filter
      const searchLower = propertySearchTerm.toLowerCase();
      const matchesSearch = !propertySearchTerm || 
                           prop.title.toLowerCase().includes(searchLower) ||
                           prop.location.toLowerCase().includes(searchLower) ||
                           prop.seller?.name?.toLowerCase().includes(searchLower) ||
                           prop.seller?.email?.toLowerCase().includes(searchLower);
      
      // Type filter (listing type: sale/rent)
      const matchesType = propertyTypeFilter === 'ทั้งหมด' || 
                         (propertyTypeFilter === 'ขาย' && prop.listingType === 'sale') ||
                         (propertyTypeFilter === 'เช่า' && prop.listingType === 'rent');
      
      // Status filter - simplified without issues.some() to avoid expensive lookup
      const views = prop.views || 0;
      const isPopular = views > 5000;
      const matchesStatus = propertyStatusFilter === 'ทั้งหมด' ||
                           (propertyStatusFilter === 'ใช้งาน' && !isPopular) ||
                           (propertyStatusFilter === 'ยอดนิยม' && isPopular) ||
                           (propertyStatusFilter === 'ลบแล้ว' && false);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [propertiesData, propertySearchTerm, propertyTypeFilter, propertyStatusFilter]);

  const renderPropertyManagement = () => {
    // Mock data for demo - show instantly
    const mockProperties = [
      { id: 1, title: 'คอนโด Modern Life Rama 9', seller: { name: 'สมชาย ใจดี' }, price: '2,500,000 บาท', type: 'ขาย', views: 8523, status: 'popular' },
      { id: 2, title: 'อพาร์ทเมนต์ The Parkland Petchburi', seller: { name: 'บุญมี ถูกใจ' }, price: '18,000 บาท/เดือน', type: 'เช่า', views: 6234, status: 'active' },
      { id: 3, title: 'บ้านแถวสุขาภิบาล 5', seller: { name: 'สมหญิง ม่วง' }, price: '3,800,000 บาท', type: 'ขาย', views: 4567, status: 'active' },
      { id: 4, title: 'เช่าห้องพักสุขุมวิท 77', seller: { name: 'พัฒนา วงษ์' }, price: '12,000 บาท/เดือน', type: 'เช่า', views: 3234, status: 'active' },
      { id: 5, title: 'ทาวน์เฮาส์ สัตหีบ', seller: { name: 'นิสา อนุรักษ์' }, price: '1,900,000 บาท', type: 'ขาย', views: 2891, status: 'active' },
      { id: 6, title: 'คอนโดมิเนียม Ames Ari', seller: { name: 'จิรายุ สวยมา' }, price: '25,000 บาท/เดือน', type: 'เช่า', views: 9234, status: 'popular' },
      { id: 7, title: 'บ้านเดี่ยวพระราม 2', seller: { name: 'ศรีวิทย์ มั่นคง' }, price: '4,200,000 บาท', type: 'ขาย', views: 5678, status: 'popular' },
      { id: 8, title: 'เช่าห้องสตูดิโอ บางรัก', seller: { name: 'วีรชัย ทองใจ' }, price: '8,500 บาท/เดือน', type: 'เช่า', views: 2145, status: 'active' },
    ];

    return (
      <div className="content-section">
        <div className="section-header">
          <div className="section-header-left">
            <h3>ทรัพย์สินทั้งหมด</h3>
            <p className="section-subtitle">จำนวนทรัพย์สิน: {mockProperties.length.toLocaleString()} จาก {stats.totalProperties.toLocaleString()}</p>
          </div>
        </div>

        <div className="filters-bar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาทรัพย์สิน..." 
              value={propertySearchTerm}
              onChange={(e) => setPropertySearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
          >
            <option>ประเภททั้งหมด</option>
            <option>ขาย</option>
            <option>เช่า</option>
          </select>
          <select 
            className="filter-select"
            value={propertyStatusFilter}
            onChange={(e) => setPropertyStatusFilter(e.target.value)}
          >
            <option>สถานะทั้งหมด</option>
            <option>ใช้งาน</option>
            <option>ยอดนิยม</option>
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
              {mockProperties.length > 0 ? (
                mockProperties.map(property => {
                  const views = property.views || 0;
                  const isPopular = views > 5000;
                  
                  return (
                    <tr key={property.id}>
                      <td><strong>{property.title}</strong></td>
                      <td>{property.seller?.name || 'ไม่ระบุ'}</td>
                      <td>{property.price}</td>
                      <td><span className="badge-type">{property.type}</span></td>
                      <td>{views.toLocaleString()}</td>
                      <td>
                        {isPopular && <span className="status-badge active">ยอดนิยม</span>}
                        {!isPopular && <span className="status-badge active">ใช้งาน</span>}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('propertyDetail', { property: property, activeTab: 'properties', reportTab: contractTab });
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="icon-btn danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                    <p>ไม่พบทรัพย์สินที่ค้นหา</p>
                    <button 
                      onClick={() => {
                        setPropertySearchTerm('');
                        setPropertyTypeFilter('ทั้งหมด');
                        setPropertyStatusFilter('ทั้งหมด');
                      }}
                      style={{ 
                        marginTop: '12px', 
                        padding: '8px 16px', 
                        background: '#0066CC', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      รีเซ็ตการค้นหา
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="pagination-info">แสดง {mockProperties.length > 0 ? '1' : '0'}-{Math.min(mockProperties.length, 50)} จาก {mockProperties.length.toLocaleString()} ทรัพย์สิน</span>
          <div className="pagination-controls">
            <button className="page-btn" disabled>&larr;</button>
            <button className="page-btn active">1</button>
            {mockProperties.length > 50 && <button className="page-btn">2</button>}
            {mockProperties.length > 50 && <button className="page-btn">&rarr;</button>}
          </div>
        </div>
      </div>
    );
  };

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
              { id: 'CON-2502', owner: 'บุญมี ถูกใจ', buyer: 'สุนทร เสรจริตร', type: 'เช่า', status: 'draft', date: '10/01/24' },
            ].map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #E8EEF5' }}>
                <td style={{ padding: '12px', fontSize: '14px', color: '#0066CC', fontWeight: '600' }}>{c.id}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.owner}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.buyer}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.type}</td>
                <td style={{ padding: '12px' }}>
                  {c.status === 'signed' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>✓ ลงนามแล้ว</span>}
                  {c.status === 'draft' && <span style={{ display: 'inline-block', padding: '4px 10px', background: '#FEF3C7', color: '#92400E', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>📝 ร่างฉบับ</span>}
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{c.date}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    onClick={() => setViewingContract(c)}
                    style={{ padding: '6px 12px', marginRight: '6px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>👁️ ดู</button>
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
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '24px' }}>
        จัดการรายงาน
      </h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E8EEF5', paddingBottom: '16px' }}>
        <button 
          onClick={() => setContractTab('room')}
          style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: contractTab === 'room' ? '#0066CC' : '#718096',
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            paddingBottom: '8px',
            borderBottom: contractTab === 'room' ? '3px solid #0066CC' : 'none'
          }}
        >
          🏠 รายงานห้อง ({issuesByType.room.length})
        </button>
        <button 
          onClick={() => setContractTab('user')}
          style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: contractTab === 'user' ? '#0066CC' : '#718096',
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            paddingBottom: '8px',
            borderBottom: contractTab === 'user' ? '3px solid #0066CC' : 'none'
          }}
        >
          👤 รายงานผู้ใช้ ({issuesByType.user.length})
        </button>
        <button 
          onClick={() => setContractTab('chat')}
          style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: contractTab === 'chat' ? '#0066CC' : '#718096',
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            paddingBottom: '8px',
            borderBottom: contractTab === 'chat' ? '3px solid #0066CC' : 'none'
          }}
        >
          💬 รายงานแชท ({issuesByType.chat.length})
        </button>
      </div>

      {/* Room Reports */}
      {contractTab === 'room' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {issuesByType.room.length > 0 ? (
            issuesByType.room.map(issue => (
              <div key={issue.id} style={{
                background: 'white',
                border: '2px solid #FCA5A5',
                borderRadius: '14px',
                padding: '20px',
                borderLeft: '8px solid #DC2626',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px solid #FEE2E2' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#991B1B', margin: '0 0 8px 0' }}>🏠 {issue.title}</h3>
                    <p style={{ fontSize: '13px', color: '#7F1D1D', margin: '0 0 6px 0' }}>👤 ผู้รายงาน: <strong>{issue.reporter}</strong></p>
                    <p style={{ fontSize: '13px', color: '#7F1D1D', margin: '0' }}>📝 {issue.description}</p>
                  </div>
                  <span style={{ padding: '8px 14px', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                    {issue.priority}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    if (issue.referenceId) {
                      const property = properties.find(p => p.id === issue.referenceId);
                      if (property) {
                        onNavigate('propertyDetail', { property, activeTab });
                      }
                    } else {
                      setViewingReport(issue);
                    }
                  }} style={{ padding: '10px 18px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>👁️ ดู</button>
                  <button onClick={(e) => { e.stopPropagation(); handleResolveReport(issue); }} style={{ padding: '10px 18px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✓ แก้ไขแล้ว</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeletePost(issue); }} style={{ padding: '10px 18px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ ลบโพสต์</button>
                  <button onClick={(e) => { e.stopPropagation(); handleSendMessage(issue); }} style={{ padding: '10px 18px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>💬 ติดต่อเจ้าของ</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#718096', background: '#F7FAFC', borderRadius: '14px', border: '2px dashed #E8EEF5' }}>
              <p style={{ fontSize: '16px' }}>ไม่มีรายงานห้อง</p>
            </div>
          )}
        </div>
      )}

      {/* User Reports */}
      {contractTab === 'user' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {issues.filter(i => i.type === 'user').length > 0 ? (
            issues.filter(i => i.type === 'user').map(issue => (
              <div key={issue.id} style={{
                background: 'white',
                border: '2px solid #93C5FD',
                borderRadius: '14px',
                padding: '20px',
                borderLeft: '8px solid #2563EB',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px solid #DBEAFE' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E40AF', margin: '0 0 8px 0' }}>👤 {issue.title}</h3>
                    <p style={{ fontSize: '13px', color: '#1E40AF', margin: '0 0 6px 0' }}>👤 ผู้รายงาน: <strong>{issue.reporter}</strong></p>
                    <p style={{ fontSize: '13px', color: '#1E40AF', margin: '0', opacity: 0.8 }}>📝 {issue.description}</p>
                  </div>
                  <span style={{ padding: '8px 14px', background: '#DBEAFE', color: '#1E40AF', borderRadius: '8px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                    {issue.priority}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (issue.referenceId) {
                        onNavigate('userProfile', { userId: issue.referenceId, activeTab, reportTab: 'user' });
                      } else {
                        setViewingReport(issue);
                      }
                    }} 
                    style={{ padding: '10px 18px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                  >
                    👁️ ดู
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveReport(issue);
                    }} 
                    style={{ padding: '10px 18px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                  >
                    ✓ แก้ไขแล้ว
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBanAccount(issue);
                    }} 
                    style={{ padding: '10px 18px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                  >
                    🚫 ระงับบัญชี
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage(issue);
                    }} 
                    style={{ padding: '10px 18px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                  >
                    💬 ส่งข้อความ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#718096', background: '#F7FAFC', borderRadius: '14px', border: '2px dashed #E8EEF5' }}>
              <p style={{ fontSize: '16px' }}>ไม่มีรายงานผู้ใช้</p>
            </div>
          )}
        </div>
      )}

      {/* Chat Reports */}
      {contractTab === 'chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {issuesByType.chat.length > 0 ? (
            issuesByType.chat.map(issue => (
              <div key={issue.id} style={{
                background: 'white',
                border: '2px solid #A7F3D0',
                borderRadius: '14px',
                padding: '20px',
                borderLeft: '8px solid #059669',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px solid #D1FAE5' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', margin: '0 0 8px 0' }}>💬 {issue.title}</h3>
                    <p style={{ fontSize: '13px', color: '#047857', margin: '0 0 6px 0' }}>👤 ผู้รายงาน: <strong>{issue.reporter}</strong></p>
                    <p style={{ fontSize: '13px', color: '#047857', margin: '0' }}>📝 {issue.description}</p>
                  </div>
                  <span style={{ padding: '8px 14px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                    {issue.priority}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={(e) => { e.stopPropagation(); setViewingChat(issue); }} style={{ padding: '10px 18px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>👁️ ดู</button>
                  <button onClick={(e) => { e.stopPropagation(); handleResolveReport(issue); }} style={{ padding: '10px 18px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✓ แก้ไขแล้ว</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeletePost(issue); }} style={{ padding: '10px 18px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ ลบแชท</button>
                  <button onClick={(e) => { e.stopPropagation(); handleBanAccount(issue); }} style={{ padding: '10px 18px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🚫 แบนผู้ใช้</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#718096', background: '#F7FAFC', borderRadius: '14px', border: '2px dashed #E8EEF5' }}>
              <p style={{ fontSize: '16px' }}>ไม่มีรายงานแชท</p>
            </div>
          )}
        </div>
      )}

      {/* Report Detail Modal */}
      {viewingReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }} onClick={() => setViewingReport(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '420px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingReport(null)} style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#F3F4F6',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>✕</button>
            
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
              {viewingReport.type === 'room' && '🏠'}
              {viewingReport.type === 'user' && '👤'}
              {viewingReport.type === 'problem' && '⚠️'}
              {viewingReport.type === 'chat' && '💬'}
              {' '}{viewingReport.title}
            </h2>
            
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #E8EEF5' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}><strong>ผู้รายงาน:</strong> {viewingReport.reporter}</p>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}><strong>วันที่รายงาน:</strong> {new Date(viewingReport.reportedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}><strong>ความเร่งด่วน:</strong> <span style={{ padding: '4px 10px', background: viewingReport.priority === 'เร่งด่วน' ? '#FEE2E2' : viewingReport.priority === 'สำคัญ' ? '#DBEAFE' : '#FEF3C7', color: viewingReport.priority === 'เร่งด่วน' ? '#991B1B' : viewingReport.priority === 'สำคัญ' ? '#1E40AF' : '#92400E', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{viewingReport.priority}</span></p>
              <p style={{ fontSize: '14px', color: '#718096' }}><strong>สถานะ:</strong> {viewingReport.status === 'open' ? 'เปิด' : 'อยู่ระหว่างดำเนินการ'}</p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>รายละเอียด</h3>
              <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6' }}>{viewingReport.description}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setViewingReport(null)} style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>✓ แก้ไขแล้ว</button>
              <button onClick={() => setViewingReport(null)} style={{ flex: 1, padding: '12px', background: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>⏸️ ถ้ำเลื่อน</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Viewer Modal */}
      {viewingChat && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }} onClick={() => setViewingChat(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '0',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            {/* Chat Header */}
            <div style={{ 
              padding: '20px',
              background: 'linear-gradient(135deg, #059669, #065F46)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #D1FAE5'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0' }}>💬 {viewingChat.title}</h2>
              <button onClick={() => setViewingChat(null)} style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '20px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>✕</button>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: '#F9FAFB'
            }}>
              {(() => {
                const chatData = chatMessagesData.find(c => c.reportId === viewingChat.id);
                if (!chatData || !chatData.messages) {
                  return <p style={{ textAlign: 'center', color: '#718096', margin: 'auto' }}>ไม่มีข้อมูลการสนทนา</p>;
                }
                return chatData.messages.map((msg) => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '8px',
                    animation: 'fadeIn 0.3s ease-in'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: msg.avatar || '#E8EEF5',
                      backgroundImage: `url(${msg.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px'
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>{msg.sender}</span>
                        <span style={{ fontSize: '12px', color: '#A0AEC0' }}>
                          {new Date(msg.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{
                        background: 'white',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #E8EEF5',
                        fontSize: '14px',
                        color: '#4B5563',
                        lineHeight: '1.5',
                        wordWrap: 'break-word'
                      }}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Chat Footer */}
            <div style={{
              padding: '16px 20px',
              background: 'white',
              borderTop: '2px solid #E8EEF5',
              display: 'flex',
              gap: '10px'
            }}>
              <button onClick={(e) => { e.stopPropagation(); handleResolveReport(viewingChat); setViewingChat(null); }} style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>✓ แก้ไขแล้ว</button>
              <button onClick={(e) => { e.stopPropagation(); handleBanAccount(viewingChat); setViewingChat(null); }} style={{ flex: 1, padding: '12px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>🚫 แบนผู้ใช้</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    // Mock data for each tab
    const analyticsData = {
      'user-stats': {
        title: '👥 สถิติผู้ใช้',
        stats: [
          { label: 'ผู้ใช้ใหม่ (สัปดาห์)', value: '124', change: '+20%', color: '#0066CC' },
          { label: 'ผู้ใช้ใหม่ (เดือน)', value: '458', change: '+15%', color: '#0066CC' },
          { label: 'ผู้ใช้ออนไลน์', value: '234', change: 'ตอนนี้', color: '#10B981' },
          { label: 'ผู้ใช้รวมทั้งหมด', value: '12,543', change: '+8%', color: '#F59E0B' },
        ],
        tableTitle: 'ผู้ใช้ที่ใช้งานมากที่สุด',
        tableData: [
          { name: 'สมชาย ใจดี', type: '🛒 ผู้ซื้อ', activity: 45, streak: '5 วัน' },
          { name: 'วิภา สวยงาม', type: '🏠 เจ้าของ', activity: 38, streak: '12 วัน' },
          { name: 'บุญมี ถูกใจ', type: '🤝 นายหน้า', activity: 32, streak: '8 วัน' },
          { name: 'ประยุกต์ สุขา', type: '🛒 ผู้ซื้อ', activity: 28, streak: '3 วัน' },
          { name: 'เกิดชัย บูรณ์', type: '🏠 เจ้าของ', activity: 25, streak: '7 วัน' },
        ]
      },
      'property-stats': {
        title: '🏘️ สถิติประกาศ',
        stats: [
          { label: 'ประกาศใหม่ (สัปดาห์)', value: '234', change: '+18%', color: '#0066CC' },
          { label: 'ประกาศใหม่ (เดือน)', value: '892', change: '+25%', color: '#0066CC' },
          { label: 'ประกาศยอดนิยม', value: '156', change: '+12%', color: '#F59E0B' },
          { label: 'ประกาศรวมทั้งหมด', value: '25,648', change: '+5%', color: '#10B981' },
        ],
        tableTitle: 'ประกาศที่ได้รับการดูมากที่สุด',
        tableData: [
          { name: 'คอนโด Modern Life Rama 9', type: 'ขาย', views: '8,523', likes: '245' },
          { name: 'อพาร์ทเมนต์ The Parkland', type: 'เช่า', views: '6,234', likes: '189' },
          { name: 'บ้านแถว สุขาภิบาล 5', type: 'ขาย', views: '5,678', likes: '156' },
          { name: 'วิลล่า สัตหีบ', type: 'ขาย', views: '4,892', likes: '134' },
          { name: 'ทาวน์เฮาส์ บ้านเลียบ', type: 'เช่า', views: '4,123', likes: '98' },
        ]
      },
      'contract-stats': {
        title: '📋 สถิติสัญญา',
        stats: [
          { label: 'สัญญาใหม่ (สัปดาห์)', value: '18', change: '+15%', color: '#0066CC' },
          { label: 'สัญญาใหม่ (เดือน)', value: '78', change: '+20%', color: '#0066CC' },
          { label: 'สัญญาเสร็จสิ้น', value: '445', change: '+10%', color: '#10B981' },
          { label: 'สัญญาทั้งหมด', value: '892', change: '+18%', color: '#F59E0B' },
        ],
        tableTitle: 'สัญญาที่สำเร็จ',
        tableData: [
          { name: 'สมชาย - วิภา', type: '✓ เสร็จสิ้น', amount: '฿2,500,000', date: '25 ต.ค. 2567' },
          { name: 'บุญมี - ประยุกต์', type: '✓ เสร็จสิ้น', amount: '฿1,200,000', date: '20 ต.ค. 2567' },
          { name: 'เกิดชัย - นิสา', type: '✓ เสร็จสิ้น', amount: '฿3,800,000', date: '18 ต.ค. 2567' },
          { name: 'จิรายุ - ศรีวิทย์', type: '✓ เสร็จสิ้น', amount: '฿2,100,000', date: '15 ต.ค. 2567' },
          { name: 'วีรชัย - สุนทร', type: '✓ เสร็จสิ้น', amount: '฿1,900,000', date: '12 ต.ค. 2567' },
        ]
      }
    };

    const currentData = analyticsData[analyticsTab];

    return (
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
          📊 รายงานและสถิติ
        </h2>

        {/* ========== Tab Navigation ========== */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E8EEF5', paddingBottom: '12px', overflowX: 'auto' }}>
          {[
            { key: 'user-stats', label: '👥 สถิติผู้ใช้' },
            { key: 'property-stats', label: '🏘️ สถิติประกาศ' },
            { key: 'contract-stats', label: '📋 สถิติสัญญา' }
          ].map(tab => (
            <button 
              key={tab.key}
              onClick={() => setAnalyticsTab(tab.key)}
              style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: analyticsTab === tab.key ? '#0066CC' : '#718096',
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                borderBottom: analyticsTab === tab.key ? '3px solid #0066CC' : 'none',
                paddingBottom: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========== Stats Cards ========== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {currentData.stats.map((stat, idx) => (
            <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `2px solid ${stat.color}`, boxShadow: `0 2px 8px rgba(0, 0, 0, 0.05)` }}>
              <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>{stat.label}</p>
              <h3 style={{ fontSize: '28px', fontWeight: '700', color: stat.color, margin: '0 0 4px 0' }}>{stat.value}</h3>
              <p style={{ fontSize: '12px', color: '#10B981', margin: '0' }}>📈 {stat.change}</p>
            </div>
          ))}
        </div>

        {/* ========== Data Table ========== */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderBottom: '2px solid #E8EEF5' }}>
            <h3 style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{currentData.tableTitle}</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #E8EEF5' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>
                  {analyticsTab === 'user-stats' ? 'ชื่อผู้ใช้' : analyticsTab === 'property-stats' ? 'ชื่อประกาศ' : 'ชื่อสัญญา'}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>
                  {analyticsTab === 'user-stats' ? 'ประเภท' : analyticsTab === 'property-stats' ? 'ประเภท' : 'สถานะ'}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>
                  {analyticsTab === 'user-stats' ? 'กิจกรรม' : analyticsTab === 'property-stats' ? 'จำนวนดู' : 'จำนวนเงิน'}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>
                  {analyticsTab === 'user-stats' ? 'สตริก' : analyticsTab === 'property-stats' ? 'ไลค์' : 'วันที่'}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.tableData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E8EEF5', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#718096' }}>{idx + 1}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c', fontWeight: '500' }}>{row.name}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#0066CC', fontWeight: '600' }}>{row.type}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>
                    {analyticsTab === 'user-stats' ? row.activity : analyticsTab === 'property-stats' ? row.views : row.amount}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#718096' }}>
                    {analyticsTab === 'user-stats' ? row.streak : analyticsTab === 'property-stats' ? row.likes : row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const handleAdSettingChange = (key, value) => {
      setAdSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleMenuToggle = (menu) => {
      setBuyerMenu(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const handleSystemSettingChange = (key, value) => {
      setSystemSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '24px' }}>
          ⚙️ ตั้งค่าระบบ
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* ========== พื้นที่โฆษณา ========== */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📢 ตั้งค่าโฆษณา
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '12px' }}>
                <input 
                  type="checkbox" 
                  checked={adSettings.bannerAd}
                  onChange={(e) => handleAdSettingChange('bannerAd', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }} 
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>🎨 โฆษณา Banner (หน้าแรก)</span>
              </label>
              {adSettings.bannerAd && (
                <div style={{ marginLeft: '30px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '3px solid #0066CC' }}>
                  <p style={{ fontSize: '12px', color: '#0066CC', margin: '0' }}>✓ แสดงโฆษณาแบนเนอร์ขนาด 1200x300px ที่หน้าแรก Buyer</p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                📍 จำนวนโฆษณาข้างเคียง
              </label>
              <select 
                value={adSettings.sidebarAds}
                onChange={(e) => handleAdSettingChange('sidebarAds', parseInt(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c', background: 'white', cursor: 'pointer' }}
              >
                <option value="0">ไม่มี</option>
                <option value="1">1 พื้นที่ (ด้านบน)</option>
                <option value="2">2 พื้นที่ (ด้านบน + ด้านล่าง)</option>
                <option value="3">3 พื้นที่ (บน + กลาง + ล่าง)</option>
              </select>
              <p style={{ fontSize: '12px', color: '#718096', margin: '8px 0 0 0' }}>แต่ละพื้นที่ 300x250px</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={adSettings.footerAd}
                  onChange={(e) => handleAdSettingChange('footerAd', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }} 
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>🦶 โฆษณาส่วนท้าย</span>
              </label>
              {adSettings.footerAd && (
                <div style={{ marginLeft: '30px', marginTop: '8px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '3px solid #0066CC' }}>
                  <p style={{ fontSize: '12px', color: '#0066CC', margin: '0' }}>✓ แสดงโฆษณา 1200x100px ที่ท้ายหน้า</p>
                </div>
              )}
            </div>

            {/* ========== อัปโหลดรูปโฆษณา ========== */}
            <div style={{ marginBottom: '20px', padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#92400e', margin: '0 0 12px 0' }}>📸 อัปโหลดรูปโฆษณา</h4>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                  🎨 Banner โฆษณา (1200x300px)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const fileName = e.target.files[0].name;
                        alert(`✅ อัปโหลด Banner โฆษณา: ${fileName} สำเร็จแล้ว!`);
                      }
                    }}
                    style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                  📍 โฆษณาข้างเคียง (300x250px)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const fileName = e.target.files[0].name;
                        alert(`✅ อัปโหลด โฆษณาข้างเคียง: ${fileName} สำเร็จแล้ว!`);
                      }
                    }}
                    style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                  🦶 โฆษณาส่วนท้าย (1200x100px)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const fileName = e.target.files[0].name;
                        alert(`✅ อัปโหลด โฆษณาส่วนท้าย: ${fileName} สำเร็จแล้ว!`);
                      }
                    }}
                    style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                alert('💾 บันทึกการตั้งค่าโฆษณาแล้ว!\n\n' + JSON.stringify(adSettings, null, 2));
              }}
              style={{ width: '100%', padding: '12px 20px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '16px' }}
            >
              💾 บันทึกการตั้งค่าโฆษณา
            </button>
          </div>

          {/* ========== เมนู Buyer ========== */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 เมนู Buyer
            </h3>

            {[
              { key: 'home', label: '🏠 หน้าแรก' },
              { key: 'properties', label: '🏘️ ทรัพย์สิน' },
              { key: 'search', label: '🔍 ค้นหา' },
              { key: 'savedProperties', label: '❤️ ชื่นชอบ' },
              { key: 'profile', label: '👤 โปรไฟล์' },
              { key: 'messages', label: '💬 ข้อความ' },
              { key: 'aboutContact', label: '📞 เกี่ยวกับ' }
            ].map(menu => (
              <label key={menu.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '16px', padding: '12px', borderRadius: '8px', background: buyerMenu[menu.key] ? '#f0fdf4' : '#f3f4f6' }}>
                <input 
                  type="checkbox" 
                  checked={buyerMenu[menu.key]}
                  onChange={() => handleMenuToggle(menu.key)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }} 
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: buyerMenu[menu.key] ? '#10B981' : '#9ca3af' }}>
                  {menu.label}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: buyerMenu[menu.key] ? '#10B981' : '#ef4444', fontWeight: '600' }}>
                  {buyerMenu[menu.key] ? '✓ เปิด' : '✕ ปิด'}
                </span>
              </label>
            ))}

            <button 
              onClick={() => {
                alert('💾 บันทึกการตั้งค่าเมนูแล้ว!\n\n' + JSON.stringify(buyerMenu, null, 2));
              }}
              style={{ width: '100%', padding: '12px 20px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '16px' }}
            >
              💾 บันทึกการตั้งค่าเมนู
            </button>
          </div>

          {/* ========== ตั้งค่าระบบทั่วไป ========== */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E8EEF5', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚙️ ตั้งค่าระบบทั่วไป
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📅 เวลาหมดอายุประกาศ (วัน)</label>
                <input 
                  type="number" 
                  value={systemSettings.listingExpiry}
                  onChange={(e) => handleSystemSettingChange('listingExpiry', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>🏘️ จำนวนประกาศสูงสุด/ผู้ใช้</label>
                <input 
                  type="number" 
                  value={systemSettings.maxListingsPerUser}
                  onChange={(e) => handleSystemSettingChange('maxListingsPerUser', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📋 ข้อจำกัดสัญญา (ปี)</label>
                <input 
                  type="number" 
                  value={systemSettings.contractYears}
                  onChange={(e) => handleSystemSettingChange('contractYears', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📧 อีเมล Support</label>
                <input 
                  type="email" 
                  value={systemSettings.supportEmail}
                  onChange={(e) => handleSystemSettingChange('supportEmail', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>📞 เบอร์โทร Support</label>
                <input 
                  type="tel" 
                  value={systemSettings.supportPhone}
                  onChange={(e) => handleSystemSettingChange('supportPhone', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8EEF5', borderRadius: '8px', fontSize: '14px', color: '#1a202c' }} 
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E8EEF5' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>🔧 ฟีเจอร์เพิ่มเติม</h4>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '12px' }}>
                <input 
                  type="checkbox" 
                  checked={systemSettings.smartFilter}
                  onChange={(e) => handleSystemSettingChange('smartFilter', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }} 
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>🔍 เปิดใช้งาน Smart Filter</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={systemSettings.digitalContract}
                  onChange={(e) => handleSystemSettingChange('digitalContract', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }} 
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>📝 เปิดใช้งาน Digital Contract</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => {
                  alert('💾 บันทึกการตั้งค่าระบบแล้ว!\n\n' + JSON.stringify(systemSettings, null, 2));
                }}
                style={{ flex: 1, padding: '12px 20px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
              >
                💾 บันทึกทั้งหมด
              </button>
              <button 
                style={{ flex: 1, padding: '12px 20px', background: '#f3f4f6', color: '#1a202c', border: '1px solid #E8EEF5', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
              >
                ❌ ยกเลิก
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Direct render based on activeTab - no memoization
  const renderContentDirect = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'properties':
        return renderPropertyManagement();
      case 'contracts':
        return renderContractManagement();
      case 'moderation':
        return renderContentModeration();
      case 'analytics':
        return renderAnalytics();
      case 'users':
        return renderUserManagement();
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
            <div className="brand-icon"><Sparkles size={24} /></div>
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
            <p className="nav-section-title">{sidebarOpen ? 'หลัก' : ''}</p>
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>แดชบอร์ด</span>}
            </button>
          </div>

          <div className="nav-section">
            <p className="nav-section-title">{sidebarOpen ? 'จัดการทรัพย์สิน' : ''}</p>
            <button 
              className={`nav-btn ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => handleTabChange('properties')}
            >
              <Building2 size={20} />
              {sidebarOpen && <span>ทรัพย์สิน</span>}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => handleTabChange('contracts')}
            >
              <FileText size={20} />
              {sidebarOpen && <span>สัญญา</span>}
            </button>
          </div>

          <div className="nav-section">
            <p className="nav-section-title">{sidebarOpen ? 'การจัดการรายงาน' : ''}</p>
            <button 
              className={`nav-btn ${activeTab === 'moderation' ? 'active' : ''}`}
              onClick={handleModerationTabChange}
            >
              <AlertCircle size={20} />
              {sidebarOpen && <span>รายงานปัญหา</span>}
              {sidebarOpen && issues.length > 0 && (
                <span className="badge danger">{issues.length}</span>
              )}
            </button>
          </div>

          <div className="nav-section">
            <p className="nav-section-title">{sidebarOpen ? 'ระบบ' : ''}</p>
            <button 
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => handleTabChange('analytics')}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span>สถิติ</span>}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => handleTabChange('users')}
            >
              <Users size={20} />
              {sidebarOpen && <span>ผู้ใช้</span>}
              {sidebarOpen && <span className="badge">{stats.newUsers}</span>}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleTabChange('settings')}
            >
              <Settings size={20} />
              {sidebarOpen && <span>ตั้งค่า</span>}
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="nav-btn logout-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowLogoutModal(true);
            }}
            type="button"
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
                {activeTab === 'properties' && 'จัดการทรัพย์สิน'}
                {activeTab === 'contracts' && 'จัดการสัญญา'}
                {activeTab === 'chat-monitoring' && 'ตรวจสอบการสื่อสาร'}
                {activeTab === 'moderation' && 'จัดการรายงาน'}
                {activeTab === 'analytics' && 'รายงานและสถิติ'}
                {activeTab === 'users' && 'จัดการผู้ใช้งาน'}
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
            <div style={{ position: 'relative' }}>
              <button 
                className="header-icon-btn"
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                style={{ cursor: 'pointer' }}
              >
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>

              {/* Notification Panel Dropdown */}
              {showNotificationPanel && (
                <div style={{
                  position: 'absolute',
                  top: '50px',
                  right: '0',
                  width: '380px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #E8EEF5',
                  zIndex: 1000,
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  {/* Header */}
                  <div style={{ padding: '16px', borderBottom: '2px solid #f0f1f3', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>🔔 การแจ้งเตือน</h3>
                    <span style={{ fontSize: '12px', background: '#EF4444', color: 'white', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>3 ใหม่</span>
                  </div>

                  {/* Recent Room Reports */}
                  <div style={{ padding: '12px 0' }}>
                    {[
                      {
                        id: 1,
                        icon: '🏠',
                        title: 'รายงานห้องใหม่',
                        room: 'คอนโด Modern Life Rama 9',
                        reason: 'ภาพไม่เหมาะสม',
                        time: 'เมื่อ 5 นาทีที่แล้ว',
                        severity: 'high',
                        status: 'ยังไม่ได้ตรวจสอบ'
                      },
                      {
                        id: 2,
                        icon: '🏠',
                        title: 'รายงานห้องใหม่',
                        room: 'บ้านแถว สุขาภิบาล 5',
                        reason: 'ราคาไม่สมจริง',
                        time: 'เมื่อ 15 นาทีที่แล้ว',
                        severity: 'medium',
                        status: 'ยังไม่ได้ตรวจสอบ'
                      },
                      {
                        id: 3,
                        icon: '🏠',
                        title: 'รายงานห้องใหม่',
                        room: 'วิลล่า สัตหีบ',
                        reason: 'ข้อมูลไม่ถูกต้อง',
                        time: 'เมื่อ 1 ชั่วโมงที่แล้ว',
                        severity: 'low',
                        status: 'ยังไม่ได้ตรวจสอบ'
                      }
                    ].map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          setActiveTab('moderation');
                          setContractTab('room');
                          setShowNotificationPanel(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f1f3',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: notif.severity === 'high' ? '#fef2f2' : 'white'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = notif.severity === 'high' ? '#fef2f2' : 'white'}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '20px', marginTop: '2px' }}>{notif.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px', marginBottom: '4px' }}>
                              <p style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{notif.title}</p>
                              <span style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: '600',
                                background: notif.severity === 'high' ? '#FEE2E2' : notif.severity === 'medium' ? '#FEF3C7' : '#DBEAFE',
                                color: notif.severity === 'high' ? '#991B1B' : notif.severity === 'medium' ? '#92400E' : '#1E40AF',
                                whiteSpace: 'nowrap'
                              }}>
                                {notif.severity === 'high' ? '🔴 เร่งด่วน' : notif.severity === 'medium' ? '🟠 ปกติ' : '🔵 ต่ำ'}
                              </span>
                            </div>
                            <p style={{ margin: '4px 0', fontSize: '12px', color: '#718096', fontWeight: '600' }}>
                              📍 {notif.room}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '12px', color: '#718096' }}>
                              เหตุผล: {notif.reason}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '11px', color: '#A0AEC0' }}>
                              ⏰ {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '12px 16px', background: '#f9fafb', borderTop: '2px solid #f0f1f3', textAlign: 'center', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <button
                      onClick={() => {
                        setActiveTab('moderation');
                        setContractTab('room');
                        setShowNotificationPanel(false);
                      }}
                      style={{
                        background: '#0066CC',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#0052A3'}
                      onMouseLeave={(e) => e.target.style.background = '#0066CC'}
                    >
                      ➜ ดูรายงานทั้งหมด
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div 
              className="header-avatar"
              onClick={() => setShowAdminProfileModal(true)}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <img src={adminProfile.avatar} alt="Admin" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {renderContentDirect()}
        </div>
      </main>

      {/* Moderation Modal */}
      {moderationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(2px)'
        }} onClick={() => { setModerationModal(null); setModerationReason(''); }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1F2937',
              margin: '0 0 8px 0',
              textAlign: 'center'
            }}>
              {moderationModal.type === 'ban' && '🚫 ระงับบัญชี'}
              {moderationModal.type === 'delete' && '🗑️ ลบเนื้อหา'}
              {moderationModal.type === 'message' && '💬 ส่งข้อความ'}
            </h2>
            
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              {moderationModal.type === 'ban' && 'โปรดระบุเหตุผลในการระงับบัญชีนี้'}
              {moderationModal.type === 'delete' && 'โปรดระบุเหตุผลในการลบเนื้อหา'}
              {moderationModal.type === 'message' && 'พิมพ์ข้อความที่ต้องการส่งไปยังผู้ใช้'}
            </p>

            {/* Input Field */}
            <textarea
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '24px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder={
                moderationModal.type === 'ban' ? 'เช่น: ใจเย็น, การวaggressiveness, การละเมิดข้อตกลง...' :
                moderationModal.type === 'delete' ? 'เช่น: เนื้อหาละเมิด, ภาพไม่เหมาะสม, สแปม...' :
                'พิมพ์ข้อความของคุณที่นี่...'
              }
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              autoFocus
            />

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => { setModerationModal(null); setModerationReason(''); }}
                style={{
                  padding: '10px 20px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  ':hover': { background: '#E5E7EB' }
                }}
                onMouseEnter={(e) => e.target.style.background = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.background = '#F3F4F6'}
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (moderationReason.trim()) {
                    confirmModeration(moderationModal.type);
                  } else {
                    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
                  }
                }}
                disabled={!moderationReason.trim()}
                style={{
                  padding: '10px 20px',
                  background: moderationReason.trim() ? 
                    (moderationModal.type === 'ban' ? '#EF4444' : moderationModal.type === 'delete' ? '#F59E0B' : '#3B82F6') : '#D1D5DB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: moderationReason.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  opacity: moderationReason.trim() ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (moderationReason.trim()) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {moderationModal.type === 'ban' ? '✓ ระงับบัญชี' : moderationModal.type === 'delete' ? '✓ ลบเนื้อหา' : '✓ ส่งข้อความ'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogoutCancel();
                }}
                type="button"
              >
                ยกเลิก
              </button>
              <button 
                className="btn-logout-confirm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogoutConfirm();
                }}
                disabled={isLoggingOut}
                type="button"
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

      {/* Admin Profile Edit Modal */}
      {showAdminProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(2px)'
        }} onClick={() => setShowAdminProfileModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1F2937',
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              👤 แก้ไขโปรไฟล์ Admin
            </h2>

            {/* Profile Picture Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '24px',
              borderBottom: '2px solid #E5E7EB'
            }}>
              <img 
                src={adminProfile.avatar} 
                alt="Admin" 
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  marginBottom: '16px',
                  objectFit: 'cover',
                  border: '3px solid #0066CC'
                }}
              />
              <label style={{
                padding: '8px 16px',
                background: '#0066CC',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#0052A3'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0066CC'}
              >
                📸 เปลี่ยนรูปภาพ
                <input 
                  type="file" 
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setAdminProfile({...adminProfile, avatar: event.target.result});
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Form Fields */}
            <div style={{ marginBottom: '24px' }}>
              {/* Name */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>ชื่อ Admin</p>
                <input 
                  type="text"
                  value={adminProfile.name}
                  onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066CC'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </label>

              {/* Email */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>อีเมล</p>
                <input 
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066CC'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </label>

              {/* Phone */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>เบอร์โทรศัพท์</p>
                <input 
                  type="tel"
                  value={adminProfile.phone}
                  onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066CC'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </label>

              {/* Password Section */}
              <div style={{ paddingTop: '16px', borderTop: '2px solid #E5E7EB', marginTop: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#1F2937', margin: '0 0 16px 0' }}>🔐 เปลี่ยนรหัสผ่าน</p>
                
                {/* Current Password */}
                <label style={{ display: 'block', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>รหัสผ่านปัจจุบัน *</p>
                  <input 
                    type="password"
                    value={adminProfile.currentPassword}
                    onChange={(e) => setAdminProfile({...adminProfile, currentPassword: e.target.value})}
                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0066CC'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                  <p style={{ fontSize: '11px', color: '#A0AEC0', margin: '4px 0 0 0' }}>ต้องกรอกเพื่อเปลี่ยนรหัสผ่าน</p>
                </label>

                {/* New Password */}
                <label style={{ display: 'block', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>รหัสผ่านใหม่</p>
                  <input 
                    type="password"
                    value={adminProfile.newPassword}
                    onChange={(e) => setAdminProfile({...adminProfile, newPassword: e.target.value})}
                    placeholder="กรอกรหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0066CC'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </label>

                {/* Confirm Password */}
                <label style={{ display: 'block', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>ยืนยันรหัสผ่าน</p>
                  <input 
                    type="password"
                    value={adminProfile.confirmPassword}
                    onChange={(e) => setAdminProfile({...adminProfile, confirmPassword: e.target.value})}
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0066CC'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </label>

                {adminProfile.newPassword && adminProfile.confirmPassword && adminProfile.newPassword !== adminProfile.confirmPassword && (
                  <p style={{ fontSize: '12px', color: '#EF4444', margin: '8px 0 16px 0', fontWeight: '600' }}>
                    ⚠️ รหัสผ่านใหม่ไม่ตรงกัน
                  </p>
                )}
                {adminProfile.newPassword && !adminProfile.currentPassword && (
                  <p style={{ fontSize: '12px', color: '#EF4444', margin: '8px 0 16px 0', fontWeight: '600' }}>
                    ⚠️ ต้องกรอกรหัสผ่านปัจจุบันก่อน
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '16px',
              borderTop: '2px solid #E5E7EB'
            }}>
              <button
                onClick={() => {
                  setShowAdminProfileModal(false);
                  setAdminProfile({...adminProfile, currentPassword: '', newPassword: '', confirmPassword: ''});
                }}
                style={{
                  padding: '10px 20px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.background = '#F3F4F6'}
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  // Validation
                  if (adminProfile.newPassword && !adminProfile.currentPassword) {
                    alert('⚠️ ต้องกรอกรหัสผ่านปัจจุบันก่อน');
                  } else if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
                    alert('⚠️ รหัสผ่านใหม่ไม่ตรงกัน');
                  } else {
                    alert('✅ บันทึกข้อมูล Admin แล้ว!\n\nชื่อ: ' + adminProfile.name + '\nอีเมล: ' + adminProfile.email + '\nเบอร์โทร: ' + adminProfile.phone + (adminProfile.newPassword ? '\n🔐 เปลี่ยนรหัสผ่านแล้ว' : ''));
                    setShowAdminProfileModal(false);
                    setAdminProfile({...adminProfile, currentPassword: '', newPassword: '', confirmPassword: ''});
                  }
                }}
                style={{
                  padding: '10px 20px',
                  background: '#0066CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#0052A3'}
                onMouseLeave={(e) => e.target.style.background = '#0066CC'}
              >
                ✓ บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Viewing Modal */}
      {viewingContract && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(2px)',
          padding: '20px'
        }} onClick={() => setViewingContract(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '700px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Contract Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #E8EEF5' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: '0 0 8px 0' }}>📄 สัญญา</h1>
              <p style={{ fontSize: '18px', color: '#0066CC', fontWeight: '700', margin: '0' }}>หมายเลข: {viewingContract.id}</p>
            </div>

            {/* Contract Content */}
            <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#1a202c', marginBottom: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: '0 0 12px 0' }}>ข้อมูลทั่วไป</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E8EEF5' }}>
                      <td style={{ padding: '8px 0', fontWeight: '600', width: '40%' }}>ประเภทสัญญา:</td>
                      <td style={{ padding: '8px 0' }}>🏠 สัญญาการเช่า</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E8EEF5' }}>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>สถานะ:</td>
                      <td style={{ padding: '8px 0' }}>{viewingContract.status === 'signed' ? '✓ ลงนามแล้ว' : '📝 ร่างฉบับ'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E8EEF5' }}>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>วันที่สร้าง:</td>
                      <td style={{ padding: '8px 0' }}>{viewingContract.date}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seller Info */}
              <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #E8EEF5' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: '0 0 12px 0' }}>🏠 ผู้ลงประกาศ (เจ้าของทรัพย์)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600', width: '40%' }}>ชื่อ:</td>
                      <td style={{ padding: '6px 0' }}>{viewingContract.owner}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600' }}>เลขประจำตัว:</td>
                      <td style={{ padding: '6px 0' }}>1234567890123</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600' }}>ที่อยู่:</td>
                      <td style={{ padding: '6px 0' }}>กรุงเทพฯ, ประเทศไทย</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600' }}>เบอร์โทร:</td>
                      <td style={{ padding: '6px 0' }}>08x-xxx-xxxx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Buyer Info */}
              <div style={{ marginBottom: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #E8EEF5' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: '0 0 12px 0' }}>👤 ผู้ซื้อ/ผู้เช่า</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600', width: '40%' }}>ชื่อ:</td>
                      <td style={{ padding: '6px 0' }}>{viewingContract.buyer}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600' }}>เลขประจำตัว:</td>
                      <td style={{ padding: '6px 0' }}>9876543210987</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600' }}>ที่อยู่:</td>
                      <td style={{ padding: '6px 0' }}>กรุงเทพฯ, ประเทศไทย</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', fontWeight: '600' }}>เบอร์โทร:</td>
                      <td style={{ padding: '6px 0' }}>08x-yyy-yyyy</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Transaction Details */}
              <div style={{ marginBottom: '24px', padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #E8EEF5' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: '0 0 12px 0' }}>💰 รายละเอียดการทำธุรกรรม</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E8EEF5' }}>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>จำนวนเงิน:</td>
                      <td style={{ padding: '8px 0' }}>฿ 2,500,000.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E8EEF5' }}>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>ระยะเวลา:</td>
                      <td style={{ padding: '8px 0' }}>3 ปี</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>วันเริ่มต้น:</td>
                      <td style={{ padding: '8px 0' }}>15 มกราคม 2567</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terms */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: '0 0 12px 0' }}>📋 เงื่อนไขและข้อกำหนด</h3>
                <p style={{ margin: '0', color: '#718096', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
1. ผู้เช่า/ผู้ซื้อยอมรับและเข้าใจทั้งหมดในสัญญานี้
2. การไม่ปฏิบัติตามเงื่อนไขจะถือว่าฝ่ายหนึ่งผิดสัญญา
3. ทรัพย์สินจะถูกสอบสวนให้เป็นจริงและถูกต้องตามกฎหมาย
4. ค่าธรรมเนียมและภาษีจะแบ่งตามที่กำหนดไว้ในสัญญา
5. สัญญานี้มีผลบังคับใช้ตั้งแต่วันลงนามจนกว่าจะมีการบอกเลิก
                </p>
              </div>

              {/* Signatures */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #E8EEF5' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 32px 0', fontSize: '12px', color: '#718096' }}>_____________________</p>
                    <p style={{ margin: '0', fontWeight: '600', color: '#1a202c' }}>ลายมือชื่อเจ้าของทรัพย์</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#718096' }}>({viewingContract.owner})</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 32px 0', fontSize: '12px', color: '#718096' }}>_____________________</p>
                    <p style={{ margin: '0', fontWeight: '600', color: '#1a202c' }}>ลายมือชื่อผู้ซื้อ/เช่า</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#718096' }}>({viewingContract.buyer})</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '2px solid #E8EEF5' }}>
              <button
                onClick={() => setViewingContract(null)}
                style={{
                  padding: '10px 20px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.background = '#F3F4F6'}
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  alert('✅ ดาวน์โหลดสัญญา ' + viewingContract.id + ' แล้ว!\n\nไฟล์: contract_' + viewingContract.id + '.pdf');
                  setViewingContract(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#0066CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#0052A3'}
                onMouseLeave={(e) => e.target.style.background = '#0066CC'}
              >
                📥 ดาวน์โหลด PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;