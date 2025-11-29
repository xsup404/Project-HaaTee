import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Heart, MapPin, Bath, Bed, Search, Menu, X, ArrowRight, Building, Sparkles, CheckCircle, Star, TrendingUp, Users, Award, ChevronRight, ChevronDown, MessageCircle, Flag, Download, Calendar, User, Bell, Zap, Home as HomeIcon, FileCheck, Shield, Clock, BarChart3, Filter, MapPinIcon, Check, Trash2, Plus, Settings, FileText, Sliders, Lock, LogOut, Image as ImageIcon, Send, Camera, Edit2 } from 'lucide-react';
import propertiesData from '../../data/properties.json';
import SearchResults from './SearchResults';
import PropertyDetail from './PropertyDetail';
import { viewContractPDF, downloadContractPDF } from '../../utils/contractPdf';
import './Buyer.css';

const Buyer = ({ onNavigate, onLoginRequired, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTab, setCurrentTab] = useState('browse'); // browse, saved, chat, profile, searchResults
  const [searchMode, setSearchMode] = useState('buy'); // buy, rent
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [selectedType, setSelectedType] = useState('ทั้งหมด');
  const [selectedPrice, setSelectedPrice] = useState('ทั้งหมด');
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด');
  const [locationCategory, setLocationCategory] = useState(null);
  const [searchType, setSearchType] = useState('address');
  const [showSearchTypeMenu, setShowSearchTypeMenu] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [stationSearchInput, setStationSearchInput] = useState('');
  const [searchDropdownResults, setSearchDropdownResults] = useState([]);
  const [buyerChats, setBuyerChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatFileInputRef = useRef(null);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileTab, setProfileTab] = useState('info'); // info, edit, contract, settings
  
  // Get current buyer info (must be defined before loadProfileData)
  const getCurrentBuyer = () => {
    const buyerEmail = localStorage.getItem('buyerEmail') || localStorage.getItem('userEmail') || 'buyer@example.com';
    const buyerName = localStorage.getItem('buyerName') || localStorage.getItem('userName') || 'ผู้ซื้อ';
    return { email: buyerEmail, name: buyerName };
  };

  // Get property stats from localStorage
  const getPropertyStats = (propertyId) => {
    if (!propertyId) return { views: 0, saves: 0, contacts: 0 };
    
    try {
      const viewsKey = `property_views_${propertyId}`;
      const savesKey = `property_saves_${propertyId}`;
      const contactsKey = `property_contacts_${propertyId}`;
      
      const views = JSON.parse(localStorage.getItem(viewsKey) || '[]');
      const saves = JSON.parse(localStorage.getItem(savesKey) || '[]');
      const contacts = JSON.parse(localStorage.getItem(contactsKey) || '[]');
      
      return {
        views: views.length,
        saves: saves.length,
        contacts: contacts.length
      };
    } catch (e) {
      console.error('Error loading property stats:', e);
      return { views: 0, saves: 0, contacts: 0 };
    }
  };

  // Load profile data from localStorage
  const loadProfileData = () => {
    const buyer = getCurrentBuyer();
    const key = `profile_${buyer.email}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading profile:', e);
        return null;
      }
    }
    return null;
  };

  const [profileData, setProfileData] = useState(() => {
    const loaded = loadProfileData();
    const buyer = getCurrentBuyer();
    return loaded || {
      firstName: buyer.name || 'ผู้ใช้',
      lastName: '',
      email: buyer.email || 'user@haatee.com',
      phone: '',
      province: 'กรุงเทพมหานคร',
      district: '',
      profileImage: null,
      bio: '',
      facebook: '',
      instagram: '',
      line: '',
      tiktok: '',
      youtube: '',
      website: ''
    };
  });
  
  const profileImageInputRef = useRef(null);
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
    loginAlerts: true,
    deviceManagement: true
  });
  
  // Password change state
  const [passwordChange, setPasswordChange] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordError, setPasswordError] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingProperty, setReportingProperty] = useState(null);
  const [reportType, setReportType] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle profile image upload
  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Just update state, useEffect will auto-save
        setProfileData({ ...profileData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  // Save profile data to localStorage (now just shows success message since auto-save is handled by useEffect)
  const saveProfileData = () => {
    // Data is already saved by useEffect, just show success and switch tab
    alert('บันทึกข้อมูลสำเร็จ');
    setProfileTab('info');
  };

  // Load saved properties from localStorage
  const loadSavedProperties = () => {
    const buyer = getCurrentBuyer();
    const key = `savedProperties_${buyer.email}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure it's an array
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error loading saved properties:', e);
        return [];
      }
    }
    return [];
  };

  const [savedProperties, setSavedProperties] = useState(() => {
    // Initialize from localStorage on mount
    const loaded = loadSavedProperties();
    console.log('Loaded saved properties on mount:', loaded);
    return loaded; // Return loaded array (can be empty)
  });

  // Load buyer chats from localStorage
  const loadBuyerChats = useCallback(() => {
    try {
      // Get all chat keys from localStorage that belong to this buyer
      const buyer = getCurrentBuyer();
      const chats = [];
      
      // Find all chat keys (format: chat_{propertyId}_{sellerId})
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('chat_')) {
          try {
            const messages = JSON.parse(localStorage.getItem(key));
            if (messages && Array.isArray(messages) && messages.length > 0) {
              // Get property and seller info from messages
              const lastMessage = messages[messages.length - 1];
              
              // Extract propertyId and sellerId from key
              const parts = key.replace('chat_', '').split('_');
              const propertyId = parseInt(parts[0]);
              const sellerId = parseInt(parts[1]);
              
              // Try to get info from messages first (more reliable)
              const messageWithInfo = messages.find(m => m.propertyId || m.propertyTitle || m.sellerId || m.sellerName);
              
              // Find property info from allProperties if available (use current state)
              const property = Array.isArray(allProperties) && allProperties.length > 0 
                ? allProperties.find(p => p.id === propertyId) 
                : null;
              
              // Get seller name from property or messages - prioritize property data
              let sellerName = null;
              
              // First, try to get from property (most reliable) - check all possible fields
              if (property?.seller?.name) {
                sellerName = property.seller.name;
              } else if (property?.seller?.firstName && property?.seller?.lastName) {
                sellerName = `${property.seller.firstName} ${property.seller.lastName}`;
              } else if (property?.seller?.firstName) {
                sellerName = property.seller.firstName;
              } else if (property?.sellerName) {
                sellerName = property.sellerName;
              }
              
              // If not found in property, try from messages
              if (!sellerName) {
                sellerName = messageWithInfo?.sellerName || messageWithInfo?.seller?.name;
                // Try to combine firstName and lastName from messages
                if (!sellerName && messageWithInfo?.seller?.firstName) {
                  if (messageWithInfo?.seller?.lastName) {
                    sellerName = `${messageWithInfo.seller.firstName} ${messageWithInfo.seller.lastName}`;
                  } else {
                    sellerName = messageWithInfo.seller.firstName;
                  }
                }
              }
              
              // If still no seller name, try to get from property seller object (fallback)
              if (!sellerName && property?.seller) {
                sellerName = property.seller.name || 
                            (property.seller.firstName && property.seller.lastName ? `${property.seller.firstName} ${property.seller.lastName}` : null) ||
                            property.seller.firstName || 
                            property.seller.lastName;
              }
              
              // If still no seller name, use default
              if (!sellerName) {
                sellerName = 'เจ้าของทรัพย์สิน';
              }
              
              chats.push({
                chatKey: key,
                propertyId: propertyId,
                propertyTitle: messageWithInfo?.propertyTitle || property?.title || 'ทรัพย์สิน',
                sellerId: sellerId,
                sellerName: sellerName,
                lastMessage: lastMessage.text || (lastMessage.image ? '[รูปภาพ]' : ''),
                lastMessageTime: lastMessage.timestamp || lastMessage.time,
                unreadCount: 0,
                messages: messages
              });
            }
          } catch (e) {
            // Silently skip invalid chat entries
          }
        }
      });
      
      // Sort by last message time (newest first)
      chats.sort((a, b) => {
        const timeA = new Date(a.lastMessageTime || 0);
        const timeB = new Date(b.lastMessageTime || 0);
        return timeB - timeA;
      });
      
      setBuyerChats(chats);
    } catch (e) {
      console.error('Error in loadBuyerChats:', e);
      setBuyerChats([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load chat messages when tab changes or chats are loaded
  useEffect(() => {
    if (currentTab === 'chat') {
      loadBuyerChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, allProperties.length]);
  
  // Also reload when buyerChats change to ensure selectedChatId is valid
  useEffect(() => {
    if (selectedChatId && buyerChats.length > 0) {
      const chatExists = buyerChats.find(c => c.chatKey === selectedChatId);
      if (!chatExists) {
        // Selected chat no longer exists, select first available
        if (buyerChats.length > 0) {
          setSelectedChatId(buyerChats[0].chatKey);
        } else {
          setSelectedChatId(null);
        }
      }
    }
  }, [buyerChats, selectedChatId]);
  
  // Refresh chats periodically when on chat tab
  useEffect(() => {
    if (currentTab === 'chat') {
      const interval = setInterval(() => {
        loadBuyerChats();
      }, 2000); // Refresh every 2 seconds
      
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, allProperties.length]);
  
  // Listen for new chat messages from PropertyDetail
  useEffect(() => {
    const handleChatMessageSent = (event) => {
      // Reload chats when a new message is sent from PropertyDetail
      loadBuyerChats();
    };
    
    window.addEventListener('chatMessageSent', handleChatMessageSent);
    
    return () => {
      window.removeEventListener('chatMessageSent', handleChatMessageSent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChatId) {
      // Load directly from localStorage to get latest messages
      const stored = localStorage.getItem(selectedChatId);
      if (stored) {
        try {
          const messages = JSON.parse(stored);
          // Filter out auto-reply messages
          const filtered = messages.filter(msg => {
            const text = (msg.text || '').trim();
            return !text.includes('ได้รับข้อความแล้ว') && 
                   !(text.includes('ขอบคุณมาก') && text.includes('ได้รับ'));
          });
          // Sort messages by timestamp to ensure correct order
          filtered.sort((a, b) => {
            const timeA = new Date(a.timestamp || a.time || 0);
            const timeB = new Date(b.timestamp || b.time || 0);
            return timeA - timeB;
          });
          setCurrentChatMessages(filtered);
          // Scroll to bottom after loading
          setTimeout(() => scrollToBottom(), 100);
        } catch (e) {
          console.error('Error loading chat messages:', e);
          setCurrentChatMessages([]);
        }
      } else {
        setCurrentChatMessages([]);
      }
    } else {
      setCurrentChatMessages([]);
    }
  }, [selectedChatId]);
  
  // Refresh current chat messages periodically
  useEffect(() => {
    if (selectedChatId && currentTab === 'chat') {
      const interval = setInterval(() => {
        const stored = localStorage.getItem(selectedChatId);
        if (stored) {
          try {
            const messages = JSON.parse(stored);
            const filtered = messages.filter(msg => {
              const text = (msg.text || '').trim();
              return !text.includes('ได้รับข้อความแล้ว') && 
                     !(text.includes('ขอบคุณมาก') && text.includes('ได้รับ'));
            });
            // Sort messages by timestamp
            filtered.sort((a, b) => {
              const timeA = new Date(a.timestamp || a.time || 0);
              const timeB = new Date(b.timestamp || b.time || 0);
              return timeA - timeB;
            });
            setCurrentChatMessages(filtered);
          } catch (e) {
            console.error('Error refreshing messages:', e);
          }
        }
      }, 1000); // Refresh every 1 second
      
      return () => clearInterval(interval);
    }
  }, [selectedChatId, currentTab]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (currentTab === 'chat' && currentChatMessages.length > 0) {
      scrollToBottom();
    }
  }, [currentChatMessages, currentTab]);

  // Handle file select for chat
  const handleChatFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      // Handle image files
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setSelectedFile(null);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle other file types
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
      setSelectedImage(null);
    }
    // Reset input value to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };

  // Handle send message in buyer chat
  const handleBuyerChatSend = () => {
    if ((!chatInput.trim() && !selectedImage && !selectedFile) || !selectedChatId) return;
    
    const chat = buyerChats.find(c => c.chatKey === selectedChatId);
    if (!chat) return;
    
    const buyer = getCurrentBuyer();
    
    // Convert file to base64 if it's a file
    let fileData = null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        fileData = reader.result;
        sendMessageWithFile(fileData);
      };
      reader.readAsDataURL(selectedFile.file);
      return; // Will continue in sendMessageWithFile callback
    }
    
    sendMessageWithFile(null);
    
    function sendMessageWithFile(fileBase64) {
      const newMessage = {
        id: Date.now(),
        sender: 'buyer',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        type: selectedImage ? 'image' : selectedFile ? 'file' : 'text',
        image: selectedImage,
        file: fileBase64,
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size,
        fileType: selectedFile?.type,
        buyerEmail: buyer.email,
        buyerName: buyer.name,
        propertyId: chat.propertyId,
        propertyTitle: chat.propertyTitle,
        sellerId: chat.sellerId
      };
      
      // Get current messages from localStorage to ensure we have all messages
      const stored = localStorage.getItem(selectedChatId);
      let allMessages = stored ? JSON.parse(stored) : [];
      
      // Add new message
      allMessages.push(newMessage);
      
      // Update current chat messages
      setCurrentChatMessages([...currentChatMessages, newMessage]);
      
      // Save to localStorage (this is the chat history)
      try {
        localStorage.setItem(selectedChatId, JSON.stringify(allMessages));
      } catch (e) {
        console.error('Error saving message:', e);
      }
      
      // Also save to seller's chat list
      const sellerChatKey = `seller_chats_${chat.sellerId}`;
      const sellerStored = localStorage.getItem(sellerChatKey);
      let sellerChats = sellerStored ? JSON.parse(sellerStored) : {};
      
      const sellerChatId = `property_${chat.propertyId}`;
      if (!sellerChats[sellerChatId]) {
        sellerChats[sellerChatId] = {
          propertyId: chat.propertyId,
          propertyTitle: chat.propertyTitle,
          buyerEmail: buyer.email,
          buyerName: buyer.name,
          lastMessage: newMessage.text || (newMessage.image ? '[รูปภาพ]' : newMessage.file ? `[ไฟล์: ${newMessage.fileName}]` : ''),
          lastMessageTime: newMessage.timestamp,
          unreadCount: 0,
          messages: []
        };
      }
      
      // Add message to seller's chat history
      if (!sellerChats[sellerChatId].messages) {
        sellerChats[sellerChatId].messages = [];
      }
      sellerChats[sellerChatId].messages.push(newMessage);
      sellerChats[sellerChatId].lastMessage = newMessage.text || (newMessage.image ? '[รูปภาพ]' : newMessage.file ? `[ไฟล์: ${newMessage.fileName}]` : '');
      sellerChats[sellerChatId].lastMessageTime = newMessage.timestamp;
      sellerChats[sellerChatId].unreadCount = (sellerChats[sellerChatId].unreadCount || 0) + 1;
      
      try {
        localStorage.setItem(sellerChatKey, JSON.stringify(sellerChats));
      } catch (e) {
        console.error('Error saving to seller chat:', e);
      }
      
      // Trigger event to notify other components
      window.dispatchEvent(new CustomEvent('chatMessageSent', {
        detail: {
          chatKey: selectedChatId,
          propertyId: chat.propertyId,
          sellerId: chat.sellerId
        }
      }));
      
      // Reload chats to update last message
      loadBuyerChats();
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
      
      setChatInput('');
      setSelectedImage(null);
      setSelectedFile(null);
    }
  };

  // Track if we came from Home page
  const [cameFromHome, setCameFromHome] = useState(false);

  // Load search parameters from Home page
  useEffect(() => {
    const params = sessionStorage.getItem('homeSearchParams');
    const previousPage = sessionStorage.getItem('previousPageFromHome');
    if (params) {
      try {
        const searchParams = JSON.parse(params);
        if (searchParams.fromHome || previousPage === 'home') {
          setCameFromHome(true);
        }
        if (searchParams.searchTerm) {
          setSearchTerm(searchParams.searchTerm);
        } else if (searchParams.location) {
          setSearchTerm(searchParams.location);
        }
        if (searchParams.location) setSelectedLocation(searchParams.location);
        if (searchParams.type) setSelectedType(searchParams.type);
        if (searchParams.price) {
          // Map price ranges from Home.jsx to Buyer.jsx format
          const priceMap = {
            'under-1m': 'ต่ำกว่า 5 ล้าน',
            '1-3m': '5-10 ล้าน',
            '3-5m': '5-10 ล้าน',
            '5-10m': '10-20 ล้าน',
            'over-10m': 'มากกว่า 30 ล้าน'
          };
          if (priceMap[searchParams.price]) {
            setSelectedPrice(priceMap[searchParams.price]);
          } else {
            setSelectedPrice(searchParams.price);
          }
        }
        // Auto navigate to search results if there's a search term or filters
        if (searchParams.searchTerm || searchParams.location || searchParams.type || searchParams.price) {
          setCurrentTab('searchResults');
        }
        sessionStorage.removeItem('homeSearchParams');
        sessionStorage.removeItem('previousPageFromHome');
      } catch (e) {
        console.error('Error parsing search params:', e);
      }
    }
  }, []);

  // Save savedProperties to localStorage whenever it changes
  useEffect(() => {
    const buyer = getCurrentBuyer();
    const key = `savedProperties_${buyer.email}`;
    try {
      // Ensure savedProperties is an array before saving
      const toSave = Array.isArray(savedProperties) ? savedProperties : [];
      localStorage.setItem(key, JSON.stringify(toSave));
      console.log('Saved properties to localStorage:', toSave);
    } catch (e) {
      console.error('Error saving saved properties:', e);
    }
  }, [savedProperties]);

  // Reload saved properties when component mounts to ensure sync with localStorage
  useEffect(() => {
    // Only reload if localStorage has different data than current state
    const loaded = loadSavedProperties();
    const currentIds = Array.isArray(savedProperties) ? savedProperties : [];
    const loadedIds = Array.isArray(loaded) ? loaded : [];
    
    // Check if arrays are different
    const areDifferent = currentIds.length !== loadedIds.length || 
                         !currentIds.every(id => loadedIds.includes(id)) ||
                         !loadedIds.every(id => currentIds.includes(id));
    
    if (areDifferent && loadedIds.length >= 0) {
      console.log('Syncing saved properties from localStorage:', loadedIds);
      setSavedProperties(loadedIds);
    }
  }, []); // Only run once on mount

  // Auto-save profile data to localStorage whenever it changes
  useEffect(() => {
    const buyer = getCurrentBuyer();
    const key = `profile_${buyer.email}`;
    try {
      localStorage.setItem(key, JSON.stringify(profileData));
    } catch (e) {
      console.error('Error auto-saving profile:', e);
    }
  }, [profileData]);

  // Initialize and track user activity days
  useEffect(() => {
    const buyer = getCurrentBuyer();
    const joinDateKey = `joinDate_${buyer.email}`;
    const lastActiveKey = `lastActive_${buyer.email}`;
    const activityDaysKey = `activityDays_${buyer.email}`;
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Set join date if not exists
    if (!localStorage.getItem(joinDateKey)) {
      localStorage.setItem(joinDateKey, today);
    }
    
    // Update last active date
    const lastActive = localStorage.getItem(lastActiveKey);
    if (lastActive !== today) {
      localStorage.setItem(lastActiveKey, today);
      
      // Calculate activity days
      const joinDate = new Date(localStorage.getItem(joinDateKey));
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - joinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include today
      
      // Get unique active days
      let activityDays = JSON.parse(localStorage.getItem(activityDaysKey) || '[]');
      if (!activityDays.includes(today)) {
        activityDays.push(today);
        localStorage.setItem(activityDaysKey, JSON.stringify(activityDays));
      }
    }
  }, []);

  // Reload buyer chats when allProperties is loaded or updated
  useEffect(() => {
    if (allProperties.length > 0) {
      loadBuyerChats();
    }
  }, [allProperties.length]);

  // Load and filter properties
  useEffect(() => {
    try {
      // Sort by createdAt DESC (newest first)
      const sorted = [...propertiesData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      if (onLogout) {
        onLogout();
      } else {
        onNavigate('login');
      }
    }, 500);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Update search dropdown results when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() && showSearchOptions) {
      const searchLower = searchTerm.toLowerCase();
      const results = allProperties.filter(property => {
        const matchesLocation = property.location.toLowerCase().includes(searchLower);
        const matchesTitle = property.title.toLowerCase().includes(searchLower);
        const matchesDistrict = property.district?.toLowerCase().includes(searchLower) || false;
        const matchesBTS = property.bts?.station?.toLowerCase().includes(searchLower) || false;
        return matchesLocation || matchesTitle || matchesDistrict || matchesBTS;
      }).slice(0, 8); // Limit to 8 results
      setSearchDropdownResults(results);
    } else {
      setSearchDropdownResults([]);
    }
  }, [searchTerm, showSearchOptions, allProperties]);

  // Removed unused chatMessages useEffect

  // Reset price filter when switching between buy/rent modes
  useEffect(() => {
    setSelectedPrice('ทั้งหมด');
  }, [searchMode]);

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

  // Get transit line info from location/district
  const getTransitLineInfo = (location, district) => {
    const locationMap = {
      'สุขุมวิท': { line: 'BTS สายเขียว', color: 'green' },
      'ลาดพร้าว': { line: 'MRT สายน้ำเงิน', color: 'blue' },
      'สาทร': { line: 'MRT สายแดง', color: 'red' },
      'ระยอง': { line: 'MRT สายแดง', color: 'red' },
      'ปทุมวัน': { line: 'BTS สายเขียว', color: 'green' },
      'สยาม': { line: 'BTS สายเขียว', color: 'green' },
      'เชียงใหม่': { line: 'BTS สายม่วง', color: 'purple' },
      'ภูเก็ต': { line: 'BTS สายม่วง', color: 'purple' },
      'นนทบุรี': { line: 'BTS สายม่วง', color: 'purple' },
      'เอกมัย': { line: 'BTS สายเขียว', color: 'green' },
      'อนุสาวรีย์': { line: 'BTS สายม่วง', color: 'purple' },
    };
    return locationMap[location] || locationMap[district] || { line: 'BTS/MRT', color: 'gray' };
  };

  const locationData = {
    'เขต': ['ทั้งหมด', 'สุขุมวิท', 'สาทร', 'สีลม', 'ลุมพินี', 'ลาดพร้าว', 'มีนบุรี', 'บางนา', 'บางแค', 'ป่าแก้ว', 'บ้านแสน'],
    'จังหวัด': ['ทั้งหมด', 'กรุงเทพฯ', 'ปริมณฑล', 'นนทบุรี', 'สมุทรปราการ', 'สมุทรสาคร', 'สุพรรณบุรี', 'บางกอก'],
    'รถไฟฟ้า': ['ทั้งหมด', 'BTS สุขุมวิท', 'BTS สยาม', 'BTS ราชดำเนิน', 'BTS อนุสาวรีย์', 'BTS สวนจิตรลดา', 'BTS ศาลายา', 'BTS วิทยุ', 'BTS ชิดลม', 'MRT สุขุมวิท', 'MRT ลุมพินี']
  };

  // Helper function to parse price string to number
  const parsePriceFromString = (priceStr) => {
    if (!priceStr) return 0;
    // Remove all non-digit characters except decimal point
    const cleaned = priceStr.toString().replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const getDisplayPrice = (property) => {
    if (property.listingType === 'rent') {
      const rentPrice = property.rentPrice || property.priceValue || parsePriceFromString(property.price);
      return `฿${rentPrice.toLocaleString('th-TH')}/เดือน`;
    }
    const salePrice = property.salePrice || property.priceValue || parsePriceFromString(property.price);
    return property.price || `฿${salePrice.toLocaleString('th-TH')}`;
  };

  const propertyTypes = [
    { name: 'ทั้งหมด' },
    { name: 'บ้านเดี่ยว' },
    { name: 'คอนโด' },
    { name: 'ทาวน์เฮาส์' },
    { name: 'บ้านแฝด' },
    { name: 'วิลล่า' },
  ];

  const priceRanges = searchMode === 'rent' ? [
    { name: 'ทั้งหมด', min: 0, max: Infinity },
    { name: '1,000 - 10,000', min: 1000, max: 10000 },
    { name: '10,000 - 50,000', min: 10000, max: 50000 },
    { name: '50,000 - 100,000', min: 50000, max: 100000 },
    { name: '100,000 - 500,000', min: 100000, max: 500000 },
    { name: '500,000 - 1,000,000', min: 500000, max: 1000000 },
    { name: '1,000,000 ขึ้นไป', min: 1000000, max: Infinity },
  ] : [
    { name: 'ทั้งหมด', min: 0, max: Infinity },
    { name: 'ต่ำกว่า 1 ล้าน', min: 0, max: 1000000 },
    { name: '1 - 3 ล้าน', min: 1000000, max: 3000000 },
    { name: '3 - 5 ล้าน', min: 3000000, max: 5000000 },
    { name: '5 - 10 ล้าน', min: 5000000, max: 10000000 },
    { name: '10 - 20 ล้าน', min: 10000000, max: 20000000 },
    { name: '20 ล้านขึ้นไป', min: 20000000, max: Infinity },
  ];

  const locations = [
    { name: 'ทั้งหมด' },
    { name: 'กรุงเทพฯ' },
    { name: 'ภูเก็ต' },
    { name: 'เชียงใหม่' },
    { name: 'พัทยา' },
  ];

  const filteredProperties = allProperties.filter(property => {
    // If on saved tab, only show saved properties
    if (currentTab === 'saved') {
      return property.saved === true;
    }

    // Filter by search mode (buy/rent) for all tabs except saved
    if (searchMode === 'buy' && property.listingType !== 'sale') return false;
    if (searchMode === 'rent' && property.listingType !== 'rent') return false;

    // If on searchResults tab, filter by search term (if exists) + other filters
    if (currentTab === 'searchResults') {
      // If no search term, just use regular filters (no search required)
      if (!searchTerm.trim()) {
        const matchesType = selectedType === 'ทั้งหมด' || property.type === selectedType;
        const matchesLocation = selectedLocation === 'ทั้งหมด' || property.location.includes(selectedLocation);
        const priceRange = priceRanges.find(p => p.name === selectedPrice);
        // Use priceValue if available, otherwise calculate from salePrice or rentPrice
        const propertyPrice = property.priceValue || 
                               (searchMode === 'buy' ? property.salePrice : property.rentPrice) || 
                               parsePriceFromString(property.price) || 
                               0;
        const matchesPrice = !priceRange || (propertyPrice >= priceRange.min && propertyPrice <= priceRange.max);
        return matchesType && matchesLocation && matchesPrice;
      }
      
      // If search term exists, filter by search + other filters
      const searchLower = searchTerm.toLowerCase();
      const matchesLocation = property.location.toLowerCase().includes(searchLower);
      const matchesTitle = property.title.toLowerCase().includes(searchLower);
      const matchesDistrict = property.district?.toLowerCase().includes(searchLower) || false;
      const matchesBTS = property.bts?.station?.toLowerCase().includes(searchLower) || false;
      const searchMatches = matchesLocation || matchesTitle || matchesDistrict || matchesBTS;
      
      // Also apply type, location, and price filters on search results
      const matchesType = selectedType === 'ทั้งหมด' || property.type === selectedType;
      const matchesLocationFilter = selectedLocation === 'ทั้งหมด' || property.location.includes(selectedLocation);
      const priceRange = priceRanges.find(p => p.name === selectedPrice);
      // Use priceValue if available, otherwise calculate from salePrice or rentPrice
      const propertyPrice = property.priceValue || 
                           (searchMode === 'buy' ? property.salePrice : property.rentPrice) || 
                           parsePriceFromString(property.price) || 
                           0;
      const matchesPrice = !priceRange || (propertyPrice >= priceRange.min && propertyPrice <= priceRange.max);
      
      return searchMatches && matchesType && matchesLocationFilter && matchesPrice;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = property.title.toLowerCase().includes(searchLower) ||
                         property.location.toLowerCase().includes(searchLower) ||
                         property.district?.toLowerCase().includes(searchLower) ||
                         property.bts?.station?.toLowerCase().includes(searchLower) ||
                         false;
    const matchesType = selectedType === 'ทั้งหมด' || property.type === selectedType;
    const matchesLocation = selectedLocation === 'ทั้งหมด' || property.location.includes(selectedLocation);
    
    const priceRange = priceRanges.find(p => p.name === selectedPrice);
    // Use priceValue if available, otherwise calculate from salePrice or rentPrice
    const propertyPrice = property.priceValue || 
                           (searchMode === 'buy' ? property.salePrice : property.rentPrice) || 
                           parsePriceFromString(property.price) || 
                           0;
    const matchesPrice = !priceRange || (propertyPrice >= priceRange.min && propertyPrice <= priceRange.max);
    
    return matchesSearch && matchesType && matchesLocation && matchesPrice;
  }).sort((a, b) => {
    // Sort by search relevance (exact match first)
    if (searchTerm && currentTab === 'searchResults') {
      const searchLower = searchTerm.toLowerCase();
      
      // Score for a property
      const getScore = (prop) => {
        let score = 0;
        
        // Exact match (10 points)
        if (prop.location.toLowerCase() === searchLower) score += 10;
        if (prop.district?.toLowerCase() === searchLower) score += 10;
        if (prop.title.toLowerCase() === searchLower) score += 10;
        if (prop.bts?.station?.toLowerCase() === searchLower) score += 10;
        
        // Starts with (5 points)
        if (prop.location.toLowerCase().startsWith(searchLower)) score += 5;
        if (prop.district?.toLowerCase().startsWith(searchLower)) score += 5;
        if (prop.title.toLowerCase().startsWith(searchLower)) score += 5;
        if (prop.bts?.station?.toLowerCase().startsWith(searchLower)) score += 5;
        
        return score;
      };
      
      return getScore(b) - getScore(a);
    }
    return 0;
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
            <button 
              className={`nav-link-future ${currentTab === 'browse' || currentTab === 'searchResults' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('browse')}
            >
              ค้นหาทรัพย์สิน
            </button>
            <button 
              className={`nav-link-future ${currentTab === 'saved' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('saved')}
            >
              โปรดของฉัน
            </button>
            <button 
              className={`nav-link-future ${currentTab === 'chat' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('chat')}
            >
              แชท
            </button>
            <button 
              className={`nav-link-future ${currentTab === 'profile' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('profile')}
            >
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

              <div className="search-input-container-future">
                <Search size={18} style={{ color: '#1976D2' }} />
                <input 
                  type="text" 
                  placeholder="ค้นหาสถานที่ หรือ โครงการ" 
                  className="search-input-future"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchOptions(true)}
                  onBlur={() => setTimeout(() => setShowSearchOptions(false), 150)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      setCurrentTab('searchResults');
                      setShowSearchOptions(false);
                    }
                  }}
                />
                <button 
                  className="search-btn-future"
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    // Allow search with or without search term, but must have some filter active
                    const hasFilters = selectedType !== 'ทั้งหมด' || selectedLocation !== 'ทั้งหมด' || selectedPrice !== 'ทั้งหมด';
                    if (searchTerm.trim() || hasFilters) {
                      setCurrentTab('searchResults');
                      setShowSearchOptions(false);
                    }
                  }}
                  title="ค้นหา"
                >
                  <Search size={18} />
                </button>
                
                {showSearchOptions && (
                  <div className="search-dropdown-future">
                    {searchDropdownResults.length > 0 ? (
                      <div className="search-dropdown-results-future">
                        {searchDropdownResults.map((property) => (
                          <button
                            key={property.id}
                            className="search-dropdown-item-future"
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setCurrentTab('searchResults');
                              setShowSearchOptions(false);
                            }}
                          >
                            <div className="dropdown-item-content">
                              <div className="dropdown-item-title">{property.title}</div>
                              <div className="dropdown-item-info">
                                <span className="info-badge">{property.location}</span>
                                {property.district && <span className="info-badge">{property.district}</span>}
                                <span className={`info-badge transit-badge-${getTransitLineInfo(property.location, property.district).color}`}>
                                  {getTransitLineInfo(property.location, property.district).line}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchTerm.trim() ? (
                      <div className="search-dropdown-empty-future">
                        ไม่พบผลการค้นหา
                      </div>
                    ) : null}
                    <button
                      className="search-option-btn-future"
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setShowStationModal(true);
                        setShowSearchOptions(false);
                        setSelectedLine(null);
                        setStationSearchInput('');
                      }}
                      style={{
                        marginTop: searchTerm.trim() && searchDropdownResults.length > 0 ? '8px' : '0',
                        borderTop: searchTerm.trim() && searchDropdownResults.length > 0 ? '1px solid #eee' : 'none',
                        paddingTop: searchTerm.trim() && searchDropdownResults.length > 0 ? '8px' : '0'
                      }}
                    >
                      <MapPinIcon size={16} />
                      ค้นหาด้วยรถไฟฟ้า
                    </button>
                  </div>
                )}
              </div>

              <div className="search-filters-grid-future">
                <div className="filter-dropdown-future">
                  <button 
                    className="filter-btn-future"
                  >
                    <MapPin size={20} />
                    <div className="filter-btn-content-future">
                      <span className="filter-label-future">ทำเล</span>
                      <span className="filter-value-future">{selectedLocation}</span>
                    </div>
                    <ChevronDown size={18} />
                  </button>
                  <div className="filter-menu-future">
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('ทั้งหมด');
                      setShowStationModal(false);
                    }}>ทั้งหมด</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('กรุงเทพฯ');
                      setShowStationModal(false);
                    }}>กรุงเทพฯ</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('ปริมณฑล');
                      setShowStationModal(false);
                    }}>ปริมณฑล</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('นนทบุรี');
                      setShowStationModal(false);
                    }}>นนทบุรี</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('สมุทรปราการ');
                      setShowStationModal(false);
                    }}>สมุทรปราการ</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('สมุทรสาคร');
                      setShowStationModal(false);
                    }}>สมุทรสาคร</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('สุพรรณบุรี');
                      setShowStationModal(false);
                    }}>สุพรรณบุรี</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('ปทุมธานี');
                      setShowStationModal(false);
                    }}>ปทุมธานี</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('ระยอง');
                      setShowStationModal(false);
                    }}>ระยอง</button>
                    <button className="filter-menu-item-future" onClick={() => {
                      setSelectedLocation('ชลบุรี');
                      setShowStationModal(false);
                    }}>ชลบุรี</button>
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
                    {searchMode === 'rent' ? (
                      <>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('ทั้งหมด')}>ทั้งหมด</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('1,000 - 10,000')}>1,000 - 10,000</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('10,000 - 50,000')}>10,000 - 50,000</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('50,000 - 100,000')}>50,000 - 100,000</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('100,000 - 500,000')}>100,000 - 500,000</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('500,000 - 1,000,000')}>500,000 - 1,000,000</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('1,000,000 ขึ้นไป')}>1,000,000 ขึ้นไป</button>
                      </>
                    ) : (
                      <>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('ทั้งหมด')}>ทั้งหมด</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('ต่ำกว่า 1 ล้าน')}>ต่ำกว่า 1 ล้าน</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('1 - 3 ล้าน')}>1 - 3 ล้าน</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('3 - 5 ล้าน')}>3 - 5 ล้าน</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('5 - 10 ล้าน')}>5 - 10 ล้าน</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('10 - 20 ล้าน')}>10 - 20 ล้าน</button>
                        <button className="filter-menu-item-future" onClick={() => setSelectedPrice('20 ล้านขึ้นไป')}>20 ล้านขึ้นไป</button>
                      </>
                    )}
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
                  .map(property => {
                    const stats = getPropertyStats(property.id);
                    return { ...property, views: stats.views, saves: stats.saves, contacts: stats.contacts };
                  })
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
                        
                      <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
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
                          <h3 className="property-title-future">{property.title}</h3>
                          <div className="property-price-future">{getDisplayPrice(property)}</div>
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

                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button 
                            className="view-details-btn-future" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProperty(property);
                            }}
                            style={{ flex: 1 }}
                          >
                            <span>ดูรายละเอียด</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
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
                  .slice(0, 8)
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
                      
                      <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
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
                          <h3 className="property-title-future">{property.title}</h3>
                          <div className="property-price-future">{getDisplayPrice(property)}</div>
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

                        <button className="view-details-btn-future" onClick={() => setSelectedProperty(property)}>
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
                  .map(property => {
                    const stats = getPropertyStats(property.id);
                    return { ...property, views: stats.views, saves: stats.saves, contacts: stats.contacts };
                  })
                  .slice(0, 8)
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
                      
                      <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
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
                          <h3 className="property-title-future">{property.title}</h3>
                          <div className="property-price-future">{getDisplayPrice(property)}</div>
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

                        <button className="view-details-btn-future" onClick={() => setSelectedProperty(property)}>
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
                  .map(property => {
                    const stats = getPropertyStats(property.id);
                    return { ...property, views: stats.views, saves: stats.saves, contacts: stats.contacts };
                  })
                  .slice(0, 8)
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
                      
                      <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
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
                          <h3 className="property-title-future">{property.title}</h3>
                          <div className="property-price-future">{getDisplayPrice(property)}</div>
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

                        <button className="view-details-btn-future" onClick={() => setSelectedProperty(property)}>
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
                  .slice(0, 8)
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
                      
                      <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
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
                          <h3 className="property-title-future">{property.title}</h3>
                          <div className="property-price-future">{getDisplayPrice(property)}</div>
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

                        <button className="view-details-btn-future" onClick={() => setSelectedProperty(property)}>
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
                  .slice(0, 8)
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
                      
                      <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
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
                          <h3 className="property-title-future">{property.title}</h3>
                          <div className="property-price-future">{getDisplayPrice(property)}</div>
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

                        <button className="view-details-btn-future" onClick={() => setSelectedProperty(property)}>
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
                      
                      <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
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
                        <h3 className="property-title-future">{property.title}</h3>
                        <div className="property-price-future">{getDisplayPrice(property)}</div>
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

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button 
                          className="view-details-btn-future" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProperty(property);
                          }}
                          style={{ flex: 1 }}
                        >
                          <span>ดูรายละเอียด</span>
                          <ArrowRight size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportingProperty(property);
                            setShowReportModal(true);
                            setReportType('');
                            setReportDetails('');
                          }}
                          style={{
                            padding: '10px 16px',
                            background: 'transparent',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#666',
                            fontSize: '13px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f5f5f5';
                            e.currentTarget.style.borderColor = '#1976D2';
                            e.currentTarget.style.color = '#1976D2';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.color = '#666';
                          }}
                          title="รายงานโพส"
                        >
                          <Flag size={16} />
                        </button>
                      </div>
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

      {/* ===== SEARCH RESULTS TAB ===== */}
      {currentTab === 'searchResults' && (
        <SearchResults
          filteredProperties={filteredProperties}
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedLocation={selectedLocation}
          selectedPrice={selectedPrice}
          searchMode={searchMode}
          savedProperties={savedProperties}
          setSavedProperties={setSavedProperties}
          onPropertySelect={(property) => {
            console.log('Property selected:', property);
            setSelectedProperty(property);
          }}
          onBack={() => {
            if (cameFromHome) {
              // If came from Home, navigate back to Home
              onNavigate('home');
            } else {
              // Otherwise, go back to browse tab
              setCurrentTab('browse');
            }
          }}
          getDisplayPrice={getDisplayPrice}
        />
      )}

      {/* PROPERTY DETAILS MODAL - GLOBAL */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          savedProperties={savedProperties}
          setSavedProperties={setSavedProperties}
          onClose={() => setSelectedProperty(null)}
          onChat={() => {
            // When chat button is clicked, open chat in PropertyDetail
            // The chat is already built into PropertyDetail component
          }}
          getDisplayPrice={getDisplayPrice}
          openChatOnMount={selectedProperty.openChatOnMount === true}
          onReportProperty={(property) => {
            setReportingProperty(property);
            setShowReportModal(true);
            setReportType('');
            setReportDetails('');
          }}
        />
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
                          <p className="saved-item-price-future">{getDisplayPrice(property)}</p>
                        </div>

                        <div className="saved-item-actions-future">
                          <button 
                            className="contact-btn-future" 
                            onClick={() => {
                              setSelectedProperty({ ...property, openChatOnMount: true });
                            }}
                          >
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
                {buyerChats.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                    <MessageCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p>ยังไม่มีข้อความ</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>เริ่มแชทจากรายละเอียดทรัพย์สิน</p>
                  </div>
                ) : (
                  buyerChats.map((chat) => {
                    const sellerInitial = chat.sellerName ? chat.sellerName.charAt(0) : '?';
                    const lastMessageTime = chat.lastMessageTime 
                      ? new Date(chat.lastMessageTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                      : '';
                    const isActive = selectedChatId === chat.chatKey;
                    
                    return (
                      <div 
                        key={chat.chatKey}
                        className={`chat-item-future ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedChatId(chat.chatKey);
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        style={{ 
                          cursor: 'pointer',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none'
                        }}
                      >
                        <div className="chat-avatar-future">{sellerInitial}</div>
                        <div className="chat-info-future" style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{chat.sellerName}</h3>
                          <p style={{ margin: '4px 0', fontSize: '13px', opacity: 0.8 }}>{chat.propertyTitle}</p>
                          <p style={{ fontSize: '12px', color: isActive ? 'rgba(255,255,255,0.7)' : '#999', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {chat.lastMessage || 'ไม่มีข้อความ'}
                          </p>
                        </div>
                        <div style={{ 
                          marginLeft: 'auto', 
                          fontSize: '12px', 
                          color: isActive ? 'rgba(255,255,255,0.8)' : '#999',
                          flexShrink: 0
                        }}>
                          {lastMessageTime}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="chat-window-future">
                {selectedChatId ? (() => {
                  // Load chat info directly from localStorage to ensure we have latest data
                  const stored = localStorage.getItem(selectedChatId);
                  let selectedChat = buyerChats.find(c => c.chatKey === selectedChatId);
                  
                  // Extract propertyId and sellerId from chat key
                  const parts = selectedChatId.replace('chat_', '').split('_');
                  const propertyId = parseInt(parts[0]);
                  const sellerId = parseInt(parts[1]);
                  
                  // Always try to get property data to ensure we have the real seller name
                  const property = Array.isArray(allProperties) && allProperties.length > 0 
                    ? allProperties.find(p => p.id === propertyId) 
                    : null;
                  
                  // If chat not found in buyerChats, try to load from localStorage
                  if (!selectedChat && stored) {
                    try {
                      const messages = JSON.parse(stored);
                      if (messages && messages.length > 0) {
                        const lastMessage = messages[messages.length - 1];
                        const messageWithInfo = messages.find(m => m.propertyId || m.propertyTitle || m.sellerId || m.sellerName);
                        
                        // Get seller name - prioritize property.seller.name (real name from property data)
                        let sellerName = null;
                        if (property?.seller?.name) {
                          sellerName = property.seller.name;
                        } else if (property?.seller?.firstName && property?.seller?.lastName) {
                          sellerName = `${property.seller.firstName} ${property.seller.lastName}`;
                        } else if (property?.seller?.firstName) {
                          sellerName = property.seller.firstName;
                        } else if (property?.sellerName) {
                          sellerName = property.sellerName;
                        } else if (messageWithInfo?.sellerName) {
                          sellerName = messageWithInfo.sellerName;
                        } else {
                          sellerName = 'เจ้าของทรัพย์สิน';
                        }
                        
                        selectedChat = {
                          chatKey: selectedChatId,
                          propertyId: propertyId,
                          propertyTitle: messageWithInfo?.propertyTitle || property?.title || 'ทรัพย์สิน',
                          sellerId: sellerId,
                          sellerName: sellerName,
                          lastMessage: lastMessage.text || (lastMessage.image ? '[รูปภาพ]' : ''),
                          lastMessageTime: lastMessage.timestamp || lastMessage.time
                        };
                      }
                    } catch (e) {
                      console.error('Error loading chat info:', e);
                    }
                  }
                  
                  // Update sellerName from property data if available (even if selectedChat exists)
                  if (selectedChat && property) {
                    let realSellerName = null;
                    if (property.seller?.name) {
                      realSellerName = property.seller.name;
                    } else if (property.seller?.firstName && property.seller?.lastName) {
                      realSellerName = `${property.seller.firstName} ${property.seller.lastName}`;
                    } else if (property.seller?.firstName) {
                      realSellerName = property.seller.firstName;
                    } else if (property.sellerName) {
                      realSellerName = property.sellerName;
                    }
                    
                    // Update sellerName if we found a real name
                    if (realSellerName) {
                      selectedChat = {
                        ...selectedChat,
                        sellerName: realSellerName
                      };
                    }
                  }
                  
                  if (!selectedChat) {
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                        <div style={{ textAlign: 'center' }}>
                          <MessageCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                          <p>ไม่พบข้อมูลแชท</p>
                          <p style={{ fontSize: '14px', marginTop: '8px' }}>ลองเลือกแชทอื่น</p>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      <div className="chat-window-header-future">
                        <div>
                          <h3>{selectedChat.sellerName || 'เจ้าของทรัพย์สิน'}</h3>
                          <p>{selectedChat.propertyTitle || 'ทรัพย์สิน'}</p>
                        </div>
                      </div>

                      <div className="chat-messages-future">
                        {currentChatMessages.length === 0 ? (
                          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                            <p>ยังไม่มีข้อความ</p>
                            <p style={{ fontSize: '14px', marginTop: '8px' }}>เริ่มสนทนากันเลย!</p>
                          </div>
                        ) : (
                          currentChatMessages.map((msg) => (
                            <div key={msg.id} className={`message-group-future ${msg.sender === 'buyer' ? 'buyer' : 'owner'}`}>
                              <div className="message-future">
                                {msg.image && (
                                  <img src={msg.image} alt="Uploaded" style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '4px' }} />
                                )}
                                {msg.file && !msg.image && (
                                  <div style={{ 
                                    padding: '8px 12px', 
                                    background: 'rgba(0,0,0,0.05)', 
                                    borderRadius: '8px', 
                                    marginBottom: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}>
                                    <FileText size={16} />
                                    <div>
                                      <div style={{ fontWeight: '500', fontSize: '14px' }}>{msg.fileName}</div>
                                      <div style={{ fontSize: '12px', color: '#666' }}>
                                        {(msg.fileSize / 1024).toFixed(2)} KB
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {msg.text && <p>{msg.text}</p>}
                                <span className="message-time-future">{msg.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Image/File Preview */}
                      {(selectedImage || selectedFile) && (
                        <div style={{ 
                          padding: '12px', 
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          position: 'relative'
                        }}>
                          {selectedImage ? (
                            <div style={{ 
                              position: 'relative', 
                              display: 'inline-block',
                              maxWidth: '200px'
                            }}>
                              <img 
                                src={selectedImage} 
                                alt="Preview" 
                                style={{ 
                                  maxWidth: '200px', 
                                  maxHeight: '200px', 
                                  borderRadius: '8px',
                                  display: 'block'
                                }} 
                              />
                              <button 
                                onClick={() => setSelectedImage(null)}
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  background: 'rgba(0,0,0,0.6)',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'white'
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : selectedFile && (
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 12px',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              position: 'relative'
                            }}>
                              <FileText size={24} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: '500', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {selectedFile.name}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </div>
                              </div>
                              <button 
                                onClick={() => setSelectedFile(null)}
                                style={{
                                  background: 'rgba(0,0,0,0.3)',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'white',
                                  flexShrink: 0
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="chat-input-future">
                        <button 
                          className="chat-attach-btn-future" 
                          title="แนบไฟล์"
                          onClick={(e) => {
                            e.preventDefault();
                            chatFileInputRef.current?.click();
                          }}
                        >
                          <Plus size={20} />
                        </button>
                        <input 
                          type="file" 
                          ref={chatFileInputRef}
                          style={{ display: 'none' }}
                          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                          onChange={handleChatFileSelect}
                        />
                        <input 
                          type="text" 
                          placeholder="พิมพ์ข้อความ..." 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (chatInput.trim() || selectedImage || selectedFile) {
                                handleBuyerChatSend();
                              }
                            }
                          }}
                        />
                        <button 
                          className="chat-send-btn-future"
                          onClick={handleBuyerChatSend}
                          disabled={!chatInput.trim() && !selectedImage && !selectedFile}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </>
                  );
                })() : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                    <div style={{ textAlign: 'center' }}>
                      <MessageCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <p>เลือกแชทเพื่อเริ่มสนทนา</p>
                      <p style={{ fontSize: '14px', marginTop: '8px' }}>คลิกที่รายการแชททางซ้าย</p>
                    </div>
                  </div>
                )}
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
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div 
                      className="profile-avatar-pro-future"
                      style={{
                        backgroundImage: profileData.profileImage ? `url(${profileData.profileImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: profileData.profileImage ? 'transparent' : 'white',
                        fontSize: profileData.profileImage ? '0' : '48px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => profileImageInputRef.current?.click()}
                      onMouseOver={(e) => {
                        if (!profileData.profileImage) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!profileData.profileImage) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }
                      }}
                    >
                      {!profileData.profileImage && (profileData.firstName?.charAt(0) || 'ผ')}
                    </div>
                    <button
                      type="button"
                      onClick={() => profileImageInputRef.current?.click()}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#1976D2',
                        border: '3px solid white',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#1565C0';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#1976D2';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="อัปโหลดรูปโปรไฟล์"
                    >
                      <Camera size={18} />
                    </button>
                    <input
                      type="file"
                      ref={profileImageInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                    />
                  </div>
                  <div className="profile-header-info-future">
                    <h1>{profileData.firstName} {profileData.lastName}</h1>
                    <p>{profileData.email}</p>
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
                      {profileData.bio && (
                        <div className="info-item-future" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                          <span className="info-label-future">เกี่ยวกับฉัน</span>
                          <p style={{ margin: '8px 0 0 0', color: '#666', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{profileData.bio}</p>
                        </div>
                      )}
                      <div className="info-item-future">
                        <span className="info-label-future">ชื่อเต็ม</span>
                        <span className="info-value-future">{profileData.firstName} {profileData.lastName}</span>
                      </div>
                      <div className="info-item-future">
                        <span className="info-label-future">อีเมล</span>
                        <span className="info-value-future">{profileData.email}</span>
                      </div>
                      {profileData.phone && (
                        <div className="info-item-future">
                          <span className="info-label-future">เบอร์โทรศัพท์</span>
                          <span className="info-value-future">{profileData.phone}</span>
                        </div>
                      )}
                      {(profileData.province || profileData.district) && (
                        <div className="info-item-future">
                          <span className="info-label-future">ที่อยู่</span>
                          <span className="info-value-future">{profileData.district ? `${profileData.district}, ` : ''}{profileData.province}</span>
                        </div>
                      )}
                    </div>

                    <div className="profile-stats-card-future">
                      <h3>สถิติการใช้งาน</h3>
                      <div className="stat-item-future">
                        <div className="stat-number-future">
                          {(() => {
                            // Count saved properties that actually exist in allProperties
                            if (!Array.isArray(savedProperties) || !Array.isArray(allProperties)) {
                              return 0;
                            }
                            const validSavedProperties = savedProperties.filter(id => 
                              allProperties.some(prop => prop.id === id)
                            );
                            return validSavedProperties.length;
                          })()}
                        </div>
                        <div className="stat-label-future">ทรัพย์สินที่บันทึก</div>
                      </div>
                      <div className="stat-item-future">
                        <div className="stat-number-future">
                          {(() => {
                            // Count unique chats (unique propertyId + sellerId combinations)
                            if (!Array.isArray(buyerChats)) {
                              return 0;
                            }
                            // buyerChats already contains unique chats, so just return length
                            return buyerChats.length;
                          })()}
                        </div>
                        <div className="stat-label-future">การติดต่อ</div>
                      </div>
                      <div className="stat-item-future">
                        <div className="stat-number-future">
                          {(() => {
                            const buyer = getCurrentBuyer();
                            const activityDaysKey = `activityDays_${buyer.email}`;
                            try {
                              const activityDays = JSON.parse(localStorage.getItem(activityDaysKey) || '[]');
                              return Array.isArray(activityDays) && activityDays.length > 0 ? activityDays.length : 1;
                            } catch (e) {
                              return 1;
                            }
                          })()}
                        </div>
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
                    
                    {/* Profile Image Upload */}
                    <div className="form-group-pro-future" style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '12px' }}>รูปโปรไฟล์</label>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div 
                          style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: profileData.profileImage ? `url(${profileData.profileImage})` : 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: profileData.profileImage ? 'transparent' : 'white',
                            fontSize: profileData.profileImage ? '0' : '48px',
                            cursor: 'pointer',
                            border: '3px solid white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            margin: '0 auto'
                          }}
                          onClick={() => profileImageInputRef.current?.click()}
                        >
                          {!profileData.profileImage && (profileData.firstName?.charAt(0) || 'ผ')}
                        </div>
                        <button
                          type="button"
                          onClick={() => profileImageInputRef.current?.click()}
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: '#1976D2',
                            border: '3px solid white',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        >
                          <Camera size={16} />
                        </button>
                        <input
                          type="file"
                          ref={profileImageInputRef}
                          style={{ display: 'none' }}
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                        />
                      </div>
                      {profileData.profileImage && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedProfileData = { ...profileData, profileImage: null };
                            setProfileData(updatedProfileData);
                            
                            // Auto-save to localStorage
                            const buyer = getCurrentBuyer();
                            const key = `profile_${buyer.email}`;
                            try {
                              localStorage.setItem(key, JSON.stringify(updatedProfileData));
                            } catch (error) {
                              console.error('Error saving profile:', error);
                            }
                          }}
                          style={{
                            marginTop: '8px',
                            padding: '4px 12px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          ลบรูป
                        </button>
                      )}
                    </div>

                    <div className="form-grid-future">
                      <div className="form-group-pro-future">
                        <label>ชื่อ</label>
                        <input 
                          type="text" 
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        />
                      </div>
                      <div className="form-group-pro-future">
                        <label>นามสกุล</label>
                        <input 
                          type="text" 
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          placeholder="กรอกนามสกุล" 
                        />
                      </div>
                    </div>

                    <div className="form-group-pro-future">
                      <label>อีเมล</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group-pro-future">
                      <label>เบอร์โทรศัพท์</label>
                      <input 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="081-234-5678" 
                      />
                    </div>

                    <div className="form-grid-future">
                      <div className="form-group-pro-future">
                        <label>จังหวัด</label>
                        <select 
                          value={profileData.province}
                          onChange={(e) => setProfileData({ ...profileData, province: e.target.value })}
                        >
                          <option>กรุงเทพมหานคร</option>
                          <option>นนทบุรี</option>
                          <option>สมุทรปราการ</option>
                          <option>สมุทรสาคร</option>
                          <option>ปทุมธานี</option>
                          <option>นครปฐม</option>
                          <option>ชลบุรี</option>
                          <option>อื่นๆ</option>
                        </select>
                      </div>
                      <div className="form-group-pro-future">
                        <label>อำเภอ</label>
                        <input 
                          type="text" 
                          value={profileData.district}
                          onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                          placeholder="กรอกอำเภอ" 
                        />
                      </div>
                    </div>

                    <div className="form-group-pro-future">
                      <label>เกี่ยวกับฉัน</label>
                      <textarea 
                        rows={5}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="เขียนรายละเอียดเกี่ยวกับตัวคุณ..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          minHeight: '100px'
                        }}
                      />
                    </div>
                  </div>

                  <div className="edit-form-actions-future">
                    <button className="btn-save-pro-future" onClick={saveProfileData}>บันทึกข้อมูล</button>
                    <button className="btn-cancel-pro-future" onClick={() => {
                      // Reload profile data to cancel changes
                      const loaded = loadProfileData();
                      if (loaded) {
                        setProfileData(loaded);
                      }
                      setProfileTab('info');
                    }}>ยกเลิก</button>
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
                        <button 
                          className="btn-view-pro-future"
                          onClick={() => viewContractPDF({
                            contractNumber: 'HAA-2024-001',
                            contractType: 'สัญญาเช่า',
                            propertyTitle: 'คอนโดมิเนียมชมพร',
                            startDate: '1 มกราคม 2567',
                            endDate: '31 ธันวาคม 2567',
                            monthlyRent: '15,000',
                            deposit: '45,000',
                            status: 'อยู่ระหว่างสัญญา'
                          })}
                        >
                          ดูเอกสาร
                        </button>
                        <button 
                          className="btn-download-pro-future"
                          onClick={() => downloadContractPDF({
                            contractNumber: 'HAA-2024-001',
                            contractType: 'สัญญาเช่า',
                            propertyTitle: 'คอนโดมิเนียมชมพร',
                            startDate: '1 มกราคม 2567',
                            endDate: '31 ธันวาคม 2567',
                            monthlyRent: '15,000',
                            deposit: '45,000',
                            status: 'อยู่ระหว่างสัญญา'
                          })}
                        >
                          ดาวน์โหลด
                        </button>
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
                        <button 
                          className="btn-view-pro-future"
                          onClick={() => viewContractPDF({
                            contractNumber: 'HAA-2024-002',
                            contractType: 'สัญญาซื้อขาย',
                            propertyTitle: 'บ้านเดี่ยวสวนสยาม',
                            startDate: '15 กุมภาพันธ์ 2567',
                            price: '3,500,000',
                            status: 'เสร็จสิ้น'
                          })}
                        >
                          ดูเอกสาร
                        </button>
                        <button 
                          className="btn-download-pro-future"
                          onClick={() => downloadContractPDF({
                            contractNumber: 'HAA-2024-002',
                            contractType: 'สัญญาซื้อขาย',
                            propertyTitle: 'บ้านเดี่ยวสวนสยาม',
                            startDate: '15 กุมภาพันธ์ 2567',
                            price: '3,500,000',
                            status: 'เสร็จสิ้น'
                          })}
                        >
                          ดาวน์โหลด
                        </button>
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
                          <span className="setting-title-future">แจ้งเตือนการเข้าสู่ระบบ</span>
                          <span className="setting-desc-future">รับการแจ้งเตือนเมื่อมีการเข้าสู่ระบบจากอุปกรณ์ใหม่</span>
                        </div>
                        <label className="toggle-switch-future">
                          <input type="checkbox" checked={securitySettings.loginAlerts} onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})} />
                          <span className="toggle-slider-future"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-divider-future"></div>

                    {/* Change Password Form */}
                    <div className="settings-sub-group-future">
                      <h4>เปลี่ยนรหัสผ่าน</h4>
                      <p className="setting-desc-future" style={{ marginBottom: '20px' }}>เปลี่ยนรหัสผ่านของคุณเป็นประจำเพื่อรักษาความปลอดภัย</p>
                      
                      {passwordError && (
                        <div style={{
                          padding: '12px',
                          background: '#ffebee',
                          color: '#c62828',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          fontSize: '14px'
                        }}>
                          {passwordError}
                        </div>
                      )}
                      
                      <div className="form-group-pro-future" style={{ marginBottom: '16px' }}>
                        <label>รหัสผ่านเก่า</label>
                        <input 
                          type="password" 
                          value={passwordChange.oldPassword}
                          onChange={(e) => {
                            setPasswordChange({ ...passwordChange, oldPassword: e.target.value });
                            setPasswordError('');
                          }}
                          placeholder="กรอกรหัสผ่านเก่า"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div className="form-group-pro-future" style={{ marginBottom: '16px' }}>
                        <label>รหัสผ่านใหม่</label>
                        <input 
                          type="password" 
                          value={passwordChange.newPassword}
                          onChange={(e) => {
                            setPasswordChange({ ...passwordChange, newPassword: e.target.value });
                            setPasswordError('');
                          }}
                          placeholder="กรอกรหัสผ่านใหม่"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div className="form-group-pro-future" style={{ marginBottom: '20px' }}>
                        <label>ยืนยันรหัสผ่านใหม่</label>
                        <input 
                          type="password" 
                          value={passwordChange.confirmPassword}
                          onChange={(e) => {
                            setPasswordChange({ ...passwordChange, confirmPassword: e.target.value });
                            setPasswordError('');
                          }}
                          placeholder="ยืนยันรหัสผ่านใหม่"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <button 
                        className="btn-change-password-future"
                        onClick={() => {
                          // Validate password change
                          if (!passwordChange.oldPassword) {
                            setPasswordError('กรุณากรอกรหัสผ่านเก่า');
                            return;
                          }
                          if (!passwordChange.newPassword) {
                            setPasswordError('กรุณากรอกรหัสผ่านใหม่');
                            return;
                          }
                          if (passwordChange.newPassword.length < 6) {
                            setPasswordError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
                            return;
                          }
                          if (passwordChange.newPassword !== passwordChange.confirmPassword) {
                            setPasswordError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
                            return;
                          }

                          // Get stored password (in real app, this would be from server)
                          const buyer = getCurrentBuyer();
                          const storedPassword = localStorage.getItem(`password_${buyer.email}`);
                          
                          // Check old password
                          if (storedPassword && storedPassword !== passwordChange.oldPassword) {
                            setPasswordError('รหัสผ่านเก่าไม่ถูกต้อง');
                            return;
                          }

                          // Save new password
                          try {
                            localStorage.setItem(`password_${buyer.email}`, passwordChange.newPassword);
                            alert('เปลี่ยนรหัสผ่านสำเร็จ');
                            setPasswordChange({ oldPassword: '', newPassword: '', confirmPassword: '' });
                            setPasswordError('');
                          } catch (e) {
                            setPasswordError('เกิดข้อผิดพลาดในการบันทึกรหัสผ่าน');
                          }
                        }}
                        style={{
                          padding: '12px 24px',
                          background: '#1976D2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#1565C0';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#1976D2';
                        }}
                      >
                        บันทึกรหัสผ่านใหม่
                      </button>
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
                      .map((station) => {
                        // Find properties that can reach this station
                        const propertiesWithStation = allProperties.filter(prop => 
                          prop.bts?.station?.toLowerCase().includes(station.toLowerCase()) ||
                          prop.location?.toLowerCase().includes(station.toLowerCase()) ||
                          prop.district?.toLowerCase().includes(station.toLowerCase())
                        );
                        
                        return (
                          <button
                            key={station}
                            className="station-btn-future"
                            onClick={() => {
                              // Just set the search term, don't navigate yet
                              setSearchTerm(station);
                              setShowStationModal(false);
                              setSelectedLine(null);
                              setStationSearchInput('');
                              // Don't change tab - user must click search button first
                            }}
                            style={{
                              position: 'relative'
                            }}
                          >
                            {station}
                            {propertiesWithStation.length > 0 && (
                              <span style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: '#1976D2',
                                color: 'white',
                                borderRadius: '10px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                fontWeight: '600'
                              }}>
                                {propertiesWithStation.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && reportingProperty && (
        <div 
          className="logout-modal-overlay" 
          onClick={() => {
            setShowReportModal(false);
            setReportingProperty(null);
            setReportType('');
            setReportDetails('');
          }}
        >
          <div className="logout-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', position: 'relative' }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setShowReportModal(false);
                setReportingProperty(null);
                setReportType('');
                setReportDetails('');
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 1
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e0e0e0';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
              title="ปิด"
            >
              <X size={18} style={{ color: '#666' }} />
            </button>

            <div className="logout-modal-header">
              <div className="logout-icon-wrapper" style={{ background: '#ffebee' }}>
                <Flag size={32} style={{ color: '#c62828' }} />
              </div>
            </div>

            <div className="logout-modal-content">
              <h2 className="logout-modal-title">รายงานโพส</h2>
              <p className="logout-modal-message" style={{ marginBottom: '20px' }}>
                {reportingProperty.title}
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  เลือกประเภทการรายงาน
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'ข้อมูลไม่ถูกต้อง',
                    'รูปภาพไม่ตรงกับเนื้อหา',
                    'ราคาไม่ถูกต้อง',
                    'ข้อมูลติดต่อไม่ถูกต้อง',
                    'เนื้อหาที่ไม่เหมาะสม',
                    'สแปมหรือโฆษณา',
                    'อื่นๆ'
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      style={{
                        padding: '12px 16px',
                        background: reportType === type ? '#E3F2FD' : 'white',
                        border: `2px solid ${reportType === type ? '#1976D2' : '#ddd'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: reportType === type ? '#1976D2' : '#333',
                        fontWeight: reportType === type ? '600' : '400',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        if (reportType !== type) {
                          e.currentTarget.style.background = '#f5f5f5';
                          e.currentTarget.style.borderColor = '#bbb';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (reportType !== type) {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#ddd';
                        }
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  รายละเอียดเพิ่มเติม
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดเพิ่มเติม..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                />
              </div>
            </div>

            <div className="logout-modal-footer">
              <button
                className="logout-btn-cancel"
                onClick={() => {
                  setShowReportModal(false);
                  setReportingProperty(null);
                  setReportType('');
                  setReportDetails('');
                }}
              >
                ยกเลิก
              </button>
              <button
                className="logout-btn-confirm"
                onClick={() => {
                  if (!reportType) {
                    alert('กรุณาเลือกประเภทการรายงาน');
                    return;
                  }
                  
                  // Save report to localStorage
                  const report = {
                    id: Date.now(),
                    propertyId: reportingProperty.id,
                    propertyTitle: reportingProperty.title,
                    reportType: reportType,
                    reportDetails: reportDetails,
                    reporterEmail: getCurrentBuyer().email,
                    reporterName: getCurrentBuyer().name,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                  };
                  
                  // Get existing reports
                  const existingReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
                  existingReports.push(report);
                  localStorage.setItem('admin_reports', JSON.stringify(existingReports));
                  
                  alert('ส่งรายงานสำเร็จ ขอบคุณสำหรับการแจ้งเตือน');
                  setShowReportModal(false);
                  setReportingProperty(null);
                  setReportType('');
                  setReportDetails('');
                }}
                style={{
                  background: reportType ? '#1976D2' : '#ccc',
                  cursor: reportType ? 'pointer' : 'not-allowed'
                }}
              >
                ส่งรายงาน
              </button>
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

