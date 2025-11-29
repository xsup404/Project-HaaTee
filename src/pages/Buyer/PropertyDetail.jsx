import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Bed, Bath, Building, Heart, Flag, ChevronRight, MessageCircle, CheckCircle, User, Phone, Calculator, TrendingUp, DollarSign, Percent, Calendar, ChevronDown, Plus, Send, Image as ImageIcon, X } from 'lucide-react';
import '../../styles/PropertyDetail.css';

export default function PropertyDetail({
  property,
  savedProperties,
  setSavedProperties,
  onClose,
  onChat,
  getDisplayPrice,
  openChatOnMount = false,
  onReportProperty
}) {
  if (!property) return null;

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Ensure property has required fields
  const safeProperty = {
    id: property.id || 0,
    title: property.title || 'ไม่มีชื่อ',
    location: property.location || 'ไม่มีตำแหน่ง',
    image: property.image || 'https://via.placeholder.com/400x300?text=No+Image',
    beds: property.beds || 0,
    baths: property.baths || 0,
    size: property.size || 'N/A',
    type: property.type || 'N/A',
    description: property.description || 'ไม่มีรายละเอียด',
    amenities: property.amenities || [],
    verified: property.verified || false,
    salePrice: property.salePrice || property.priceValue || 0,
    seller: property.seller || { name: 'ไม่มีข้อมูลผู้ขาย', phone: 'N/A', email: 'N/A' },
    ...property
  };

  const isSaved = savedProperties.includes(safeProperty.id);
  
  // Track views, saves, and contacts
  const [propertyStats, setPropertyStats] = useState({
    views: 0,
    saves: 0,
    contacts: 0
  });

  // Load and track property views
  useEffect(() => {
    const propertyId = safeProperty.id;
    if (!propertyId) return;

    const buyer = getCurrentBuyer();
    const viewsKey = `property_views_${propertyId}`;
    const savesKey = `property_saves_${propertyId}`;
    const contactsKey = `property_contacts_${propertyId}`;

    // Load views
    try {
      const storedViews = localStorage.getItem(viewsKey);
      const views = storedViews ? JSON.parse(storedViews) : [];
      
      // Check if this user has already viewed this property today
      const today = new Date().toDateString();
      const userViewToday = views.find(v => 
        v.userEmail === buyer.email && 
        new Date(v.timestamp).toDateString() === today
      );

      // If not viewed today, add view
      if (!userViewToday) {
        const newView = {
          userEmail: buyer.email,
          userName: buyer.name,
          timestamp: new Date().toISOString()
        };
        views.push(newView);
        localStorage.setItem(viewsKey, JSON.stringify(views));
      }

      setPropertyStats(prev => ({ ...prev, views: views.length }));
    } catch (e) {
      console.error('Error tracking views:', e);
    }

    // Load saves count
    try {
      const storedSaves = localStorage.getItem(savesKey);
      const saves = storedSaves ? JSON.parse(storedSaves) : [];
      setPropertyStats(prev => ({ ...prev, saves: saves.length }));
    } catch (e) {
      console.error('Error loading saves:', e);
    }

    // Load contacts count
    try {
      const storedContacts = localStorage.getItem(contactsKey);
      const contacts = storedContacts ? JSON.parse(storedContacts) : [];
      setPropertyStats(prev => ({ ...prev, contacts: contacts.length }));
    } catch (e) {
      console.error('Error loading contacts:', e);
    }
  }, [safeProperty.id]);

  // Track save when property is saved
  useEffect(() => {
    if (isSaved) {
      const propertyId = safeProperty.id;
      const buyer = getCurrentBuyer();
      const savesKey = `property_saves_${propertyId}`;

      try {
        const storedSaves = localStorage.getItem(savesKey);
        const saves = storedSaves ? JSON.parse(storedSaves) : [];
        
        // Check if this user has already saved
        const userSave = saves.find(s => s.userEmail === buyer.email);
        
        if (!userSave) {
          const newSave = {
            userEmail: buyer.email,
            userName: buyer.name,
            timestamp: new Date().toISOString()
          };
          saves.push(newSave);
          localStorage.setItem(savesKey, JSON.stringify(saves));
          setPropertyStats(prev => ({ ...prev, saves: saves.length }));
        }
      } catch (e) {
        console.error('Error tracking save:', e);
      }
    }
  }, [isSaved, safeProperty.id]);

  // Track contact when chat is opened or phone is clicked
  const trackContact = (type = 'chat') => {
    const propertyId = safeProperty.id;
    const buyer = getCurrentBuyer();
    const contactsKey = `property_contacts_${propertyId}`;

    try {
      const storedContacts = localStorage.getItem(contactsKey);
      const contacts = storedContacts ? JSON.parse(storedContacts) : [];
      
      // Check if this user has already contacted today
      const today = new Date().toDateString();
      const userContactToday = contacts.find(c => 
        c.userEmail === buyer.email && 
        c.type === type &&
        new Date(c.timestamp).toDateString() === today
      );

      if (!userContactToday) {
        const newContact = {
          userEmail: buyer.email,
          userName: buyer.name,
          type: type, // 'chat' or 'phone'
          timestamp: new Date().toISOString()
        };
        contacts.push(newContact);
        localStorage.setItem(contactsKey, JSON.stringify(contacts));
        setPropertyStats(prev => ({ ...prev, contacts: contacts.length }));
      }
    } catch (e) {
      console.error('Error tracking contact:', e);
    }
  };
  
  // Mortgage Calculator State
  const [mortgageData, setMortgageData] = useState({
    price: safeProperty.salePrice || 0,
    downPaymentPercent: 10,
    interestRate: 3,
    loanTerm: 20
  });

  const [showMortgageDetails, setShowMortgageDetails] = useState(false);
  const [mortgageError, setMortgageError] = useState('');
  
  // Calculate initial mortgage on component load
  const initialMortgage = (() => {
    const price = safeProperty.salePrice || 0;
    const downPaymentPercent = 10;
    const interestRate = 3;
    const loanTerm = 20;

    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount > 0 && monthlyRate > 0 ? 
      loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1) : 0;
    
    const totalInterest = (monthlyPayment * numberOfPayments) - loanAmount;
    const principalPerMonth = monthlyPayment - (totalInterest / numberOfPayments);
    const interestPerMonth = totalInterest / numberOfPayments;
    const principalPercent = monthlyPayment > 0 ? Math.round((principalPerMonth / monthlyPayment) * 100) : 0;
    const interestPercent = monthlyPayment > 0 ? Math.round((interestPerMonth / monthlyPayment) * 100) : 0;

    return {
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principalPerMonth),
      interest: Math.round(interestPerMonth),
      principalPercent: principalPercent,
      interestPercent: interestPercent,
      price: price
    };
  })();
  
  const [calculatedMortgage, setCalculatedMortgage] = useState(initialMortgage);
  
  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Get current buyer info from localStorage
  const getCurrentBuyer = () => {
    const buyerEmail = localStorage.getItem('buyerEmail') || localStorage.getItem('userEmail') || 'buyer@example.com';
    const buyerName = localStorage.getItem('buyerName') || localStorage.getItem('userName') || 'ผู้ซื้อ';
    return { email: buyerEmail, name: buyerName };
  };
  
  // Generate chat key for this property
  const getChatKey = () => {
    const propertyId = property.id;
    const sellerId = property.sellerId || property.seller?.id;
    return `chat_${propertyId}_${sellerId}`;
  };
  
  // Load chat messages from localStorage
  const loadChatMessages = () => {
    const chatKey = getChatKey();
    const stored = localStorage.getItem(chatKey);
    if (stored) {
      try {
        const messages = JSON.parse(stored);
        // Filter out auto-reply messages - more comprehensive filtering
        const filteredMessages = messages.filter(msg => {
          const text = (msg.text || '').trim();
          const sender = msg.sender || '';
          
          // Remove auto-reply messages (various patterns)
          if (text.includes('ได้รับข้อความแล้ว')) {
            return false;
          }
          if (text.includes('ขอบคุณมาก') && text.includes('ได้รับ')) {
            return false;
          }
          if (text === 'ได้รับข้อความแล้วครับ ขอบคุณมากครับ') {
            return false;
          }
          if (text.includes('ได้รับข้อความแล้ว') && text.includes('ขอบคุณ')) {
            return false;
          }
          // Remove welcome messages that are auto-generated
          if (text.includes('สวัสดีครับ สนใจทรัพย์สินนี้ไหมครับ') && sender === 'seller' && !msg.timestamp) {
            return false;
          }
          // Remove any message from seller without proper timestamp (likely auto-generated)
          if (sender === 'seller' && !msg.timestamp && !msg.sellerId) {
            return false;
          }
          return true;
        });
        setChatMessages(filteredMessages);
        // Save filtered messages back to localStorage immediately
        if (filteredMessages.length !== messages.length) {
          saveChatMessages(filteredMessages);
        }
      } catch (e) {
        console.error('Error loading chat messages:', e);
        setChatMessages([]);
      }
    } else {
      // No chat history yet - start with empty array
      setChatMessages([]);
    }
  };
  
  // Save chat messages to localStorage
  const saveChatMessages = (messages) => {
    const chatKey = getChatKey();
    try {
      localStorage.setItem(chatKey, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat messages:', e);
    }
  };
  
  // Load messages when chat opens or property changes
  useEffect(() => {
    if (showChat) {
      loadChatMessages();
    }
  }, [showChat, property.id]);

  // Open chat automatically if openChatOnMount is true
  useEffect(() => {
    if (openChatOnMount) {
      setShowChat(true);
    }
  }, [openChatOnMount]);
  
  // Filter out auto-reply messages whenever chatMessages change (only filter, don't cause re-render loop)
  useEffect(() => {
    if (chatMessages.length > 0) {
      const hasAutoReply = chatMessages.some(msg => {
        const text = (msg.text || '').trim();
        return text.includes('ได้รับข้อความแล้ว') || 
               (text.includes('ขอบคุณมาก') && text.includes('ได้รับ')) ||
               text === 'ได้รับข้อความแล้วครับ ขอบคุณมากครับ';
      });
      
      if (hasAutoReply) {
        const filtered = chatMessages.filter(msg => {
          const text = (msg.text || '').trim();
          // Remove auto-reply messages
          if (text.includes('ได้รับข้อความแล้ว')) {
            return false;
          }
          if (text.includes('ขอบคุณมาก') && text.includes('ได้รับ')) {
            return false;
          }
          if (text === 'ได้รับข้อความแล้วครับ ขอบคุณมากครับ') {
            return false;
          }
          return true;
        });
        
        // Update state and save only if messages were filtered
        if (filtered.length !== chatMessages.length) {
          setChatMessages(filtered);
          saveChatMessages(filtered);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages.length]);

  // Scroll to bottom when new message
  useEffect(() => {
    if (showChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

  
  // Handle send message
  const handleSendMessage = () => {
    if (chatInput.trim() || selectedImage) {
      const buyer = getCurrentBuyer();
      const newMessage = {
        id: Date.now(),
        sender: 'buyer',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        type: selectedImage ? 'image' : 'text',
        image: selectedImage,
        timestamp: new Date().toISOString(),
        buyerEmail: buyer.email,
        buyerName: buyer.name,
        propertyId: property.id,
        propertyTitle: property.title,
        sellerId: property.sellerId || property.seller?.id
      };
      
      const updatedMessages = [...chatMessages, newMessage];
      setChatMessages(updatedMessages);
      saveChatMessages(updatedMessages);
      setChatInput('');
      setSelectedImage(null);
      
      // Also save to seller's chat list
      saveToSellerChatList(newMessage);
      
      // Trigger event to notify Buyer.jsx that a new message was sent
      window.dispatchEvent(new CustomEvent('chatMessageSent', {
        detail: {
          chatKey: getChatKey(),
          propertyId: property.id,
          sellerId: property.sellerId || property.seller?.id
        }
      }));
      
      // ABSOLUTELY NO AUTO-REPLY - Wait for seller to reply manually
      // No setTimeout, no automatic messages, nothing!
    }
  };
  
  // Save message to seller's chat list
  const saveToSellerChatList = (message) => {
    const sellerId = property.sellerId || property.seller?.id;
    if (!sellerId) {
      console.warn('No sellerId found for property:', property.id);
      return;
    }
    
    const sellerChatKey = `seller_chats_${sellerId}`;
    const stored = localStorage.getItem(sellerChatKey);
    let sellerChats = stored ? JSON.parse(stored) : {};
    
    // Create or update chat for this property
    const chatId = `property_${property.id}`;
    if (!sellerChats[chatId]) {
      sellerChats[chatId] = {
        propertyId: property.id,
        propertyTitle: property.title || 'ทรัพย์สิน',
        buyerEmail: message.buyerEmail,
        buyerName: message.buyerName || 'ผู้ซื้อ',
        lastMessage: message.text || (message.image ? '[รูปภาพ]' : ''),
        lastMessageTime: message.timestamp,
        unreadCount: 0,
        messages: []
      };
    }
    
    // Add message to chat history
    sellerChats[chatId].messages.push(message);
    sellerChats[chatId].lastMessage = message.text || (message.image ? '[รูปภาพ]' : '');
    sellerChats[chatId].lastMessageTime = message.timestamp;
    sellerChats[chatId].unreadCount = (sellerChats[chatId].unreadCount || 0) + 1;
    
    // Update buyer info if not set
    if (!sellerChats[chatId].buyerEmail) {
      sellerChats[chatId].buyerEmail = message.buyerEmail;
    }
    if (!sellerChats[chatId].buyerName) {
      sellerChats[chatId].buyerName = message.buyerName;
    }
    
    try {
      localStorage.setItem(sellerChatKey, JSON.stringify(sellerChats));
      console.log('Message saved to seller chat list:', chatId);
    } catch (e) {
      console.error('Error saving to seller chat list:', e);
    }
  };
  
  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate mortgage data
  const validateMortgageData = () => {
    const { price, downPaymentPercent, interestRate, loanTerm } = mortgageData;
    
    if (!price || price <= 0) {
      return 'กรุณากรอกราคาอสังหาริมทรัพย์';
    }
    
    if (downPaymentPercent < 0 || downPaymentPercent > 100) {
      return 'เงินดาวน์ต้องอยู่ระหว่าง 0-100%';
    }
    
    if (interestRate < 0.5) {
      return 'อัตราดอกเบี้ยขั้นต่ำ 0.5% ต่อปี';
    }
    
    if (interestRate > 20) {
      return 'อัตราดอกเบี้ยสูงสุด 20% ต่อปี';
    }
    
    if (loanTerm < 1) {
      return 'ระยะเวลากู้ขั้นต่ำ 1 ปี';
    }
    
    if (loanTerm > 50) {
      return 'ระยะเวลากู้สูงสุด 50 ปี';
    }
    
    return '';
  };

  // Calculate mortgage
  const calculateMortgage = () => {
    const price = mortgageData.price;
    const downPaymentPercent = mortgageData.downPaymentPercent;
    const interestRate = mortgageData.interestRate;
    const loanTerm = mortgageData.loanTerm;

    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount > 0 && monthlyRate > 0 ? 
      loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1) : 0;
    
    const totalInterest = (monthlyPayment * numberOfPayments) - loanAmount;
    const principalPerMonth = monthlyPayment - (totalInterest / numberOfPayments);
    const interestPerMonth = totalInterest / numberOfPayments;
    const principalPercent = monthlyPayment > 0 ? Math.round((principalPerMonth / monthlyPayment) * 100) : 0;
    const interestPercent = monthlyPayment > 0 ? Math.round((interestPerMonth / monthlyPayment) * 100) : 0;

    return {
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principalPerMonth),
      interest: Math.round(interestPerMonth),
      principalPercent: principalPercent,
      interestPercent: interestPercent,
      price: price
    };
  };

  // Use calculated mortgage (always use calculatedMortgage since it's initialized)
  const mortgage = calculatedMortgage;

  return (
    <>
      {/* Chat Box Modal */}
      {showChat && (
        <div className="pd-chat-modal" onClick={() => setShowChat(false)}>
          <div className="pd-chat-container" onClick={(e) => e.stopPropagation()}>
            {/* Chat Header */}
            <div className="pd-chat-header">
              <div className="pd-chat-header-info">
                <div className="pd-chat-avatar">
                  <User size={20} />
                </div>
                <div>
                  <h3>
                    {property.seller?.name || 
                     (property.seller?.firstName && property.seller?.lastName ? `${property.seller.firstName} ${property.seller.lastName}` : null) ||
                     property.seller?.firstName ||
                     property.seller?.lastName ||
                     'นายหน้า'}
                  </h3>
                  <p>ออนไลน์</p>
                </div>
              </div>
              <button className="pd-chat-close" onClick={() => setShowChat(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="pd-chat-messages">
              {chatMessages.map((message) => (
                <div key={message.id} className={`pd-chat-message ${message.sender === 'buyer' ? 'buyer' : 'seller'}`}>
                  {message.type === 'image' && message.image && (
                    <div className="pd-chat-image">
                      <img src={message.image} alt="Uploaded" />
                    </div>
                  )}
                  {message.text && (
                    <div className="pd-chat-text">{message.text}</div>
                  )}
                  <div className="pd-chat-time">{message.time}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="pd-chat-image-preview">
                <img src={selectedImage} alt="Preview" />
                <button onClick={() => setSelectedImage(null)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Chat Input */}
            <div className="pd-chat-input-area">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileSelect}
              />
              <button 
                className="pd-chat-attach-btn"
                onClick={() => fileInputRef.current?.click()}
                title="แนบรูปภาพ"
              >
                <Plus size={20} />
              </button>
              <input
                type="text"
                className="pd-chat-input"
                placeholder="พิมพ์ข้อความ..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (chatInput.trim() || selectedImage) {
                      handleSendMessage();
                    }
                  }
                }}
              />
              <button 
                className="pd-chat-send-btn"
                onClick={handleSendMessage}
                disabled={!chatInput.trim() && !selectedImage}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
      {/* Header Bar - Professional Design */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #F0F0F0',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFBFC 100%)',
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '8px 12px',
            color: '#1976D2',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            borderRadius: '6px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(25, 118, 210, 0.08)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
        >
          <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
          <span>กลับ</span>
        </button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => {
              if (isSaved) {
                setSavedProperties(savedProperties.filter(id => id !== property.id));
              } else {
                setSavedProperties([...savedProperties, property.id]);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              color: isSaved ? '#E91E63' : '#BDBDBD',
              transition: 'all 0.3s ease',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = isSaved ? 'rgba(233, 30, 99, 0.08)' : 'rgba(0, 0, 0, 0.04)';
              e.currentTarget.style.color = isSaved ? '#E91E63' : '#999';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = isSaved ? '#E91E63' : '#BDBDBD';
            }}
          >
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReportModal(true);
              setReportType('');
              setReportDetails('');
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              color: '#BDBDBD',
              transition: 'all 0.3s ease',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 152, 0, 0.1)';
              e.currentTarget.style.color = '#FF9800';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#BDBDBD';
            }}
            title="รายงานโพส"
          >
            <Flag size={20} />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#FAFBFC'
      }}>
        {/* Gallery Section - Premium Design */}
        <div style={{ marginBottom: '32px', paddingTop: '20px' }}>
          <div>
            {/* Main Large Image */}
            <div style={{ maxHeight: '400px', overflow: 'hidden', width: '90%', margin: '0 auto 20px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <img src={property.image} alt={property.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>

            {/* Thumbnail Images */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '0 20px' }}>
              {[property.image, property.image, property.image, property.image, property.image].map((img, idx) => (
                <div key={idx} style={{
                  width: '70px',
                  height: '70px',
                  border: idx === 0 ? '2px solid #1976D2' : '2px solid #E0E0E0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (idx !== 0) {
                    e.currentTarget.style.borderColor = '#1976D2';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (idx !== 0) {
                    e.currentTarget.style.borderColor = '#E0E0E0';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}>
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div style={{ padding: '0 20px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
            {/* Left Column - Main Content */}
            <div>
              {/* Header Info - Premium Typography */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', color: '#1A1A1A', lineHeight: '1.3' }}>{property.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px', color: '#666' }}>
                        <MapPin size={18} />
                        {property.location}
                      </div>
                      {property.verified && (
                        <span style={{ fontSize: '12px', background: '#E8F5E9', color: '#2E7D32', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>✓ ยืนยันแล้ว</span>
                      )}
                    </div>
                  </div>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1976D2', margin: '0', letterSpacing: '-0.5px' }}>{getDisplayPrice(property)}</h2>
              </div>

              {/* Specs - Card Style */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '28px', padding: '0' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E8E8E8', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <Bed size={26} style={{ color: '#1976D2' }} />
                  </div>
                  <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>{property.beds}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#999', fontWeight: '500' }}>ห้องนอน</p>
                </div>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E8E8E8', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <Bath size={26} style={{ color: '#FF9800' }} />
                  </div>
                  <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>{property.baths}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#999', fontWeight: '500' }}>ห้องน้ำ</p>
                </div>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E8E8E8', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <Building size={26} style={{ color: '#4CAF50' }} />
                  </div>
                  <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>{property.size}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#999', fontWeight: '500' }}>พื้นที่</p>
                </div>
              </div>

              {/* Description Section */}
              <div style={{ marginBottom: '28px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>รายละเอียด</h3>
                <p style={{ margin: '0', lineHeight: '1.7', color: '#555', fontSize: '15px' }}>{property.description}</p>
              </div>

              {/* Amenities Section */}
              {property.amenities && (
                <div style={{ marginBottom: '28px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>สิ่งอำนวยความสะดวก</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {property.amenities.map((amenity, idx) => (
                      <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                        <CheckCircle size={18} style={{ color: '#4CAF50', flexShrink: 0 }} />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Map Section */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>ตำแหน่งที่ตั้ง</h3>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31000.085226988802!2d100.58904807910157!3d13.778230999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6201bdc6add1%3A0xe50b0dc559cad94e!2sShowroom%20MASTER%20PLAN%20101!5e0!3m2!1sth!2sth!4v1764194781062!5m2!1sth!2sth" 
                    width="100%" 
                    height="300" 
                    style={{ border: '0' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666', background: 'white', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E8E8E8' }}>
                  <MapPin size={18} style={{ color: '#1976D2', flexShrink: 0 }} />
                  <span style={{ fontWeight: '500' }}>{property.location}</span>
                </div>
              </div>

              {/* Mortgage Calculator Section - Premium Design */}
              <div className="pd-mortgage-calculator">
                {/* Compact Header - Always Visible */}
                <div 
                  className={`pd-mortgage-header ${showMortgageDetails ? 'expanded' : ''}`}
                  onClick={() => setShowMortgageDetails(!showMortgageDetails)}
                >
                  <div className="pd-mortgage-header-content">
                    <div className="pd-mortgage-icon-wrapper">
                      <Calculator className="pd-mortgage-icon-svg" size={28} />
                    </div>
                    <div className="pd-mortgage-header-text">
                      <p className="pd-mortgage-label">คำนวณยอดสินเชื่อ</p>
                      <p className="pd-mortgage-amount">
                        ฿ {mortgage.monthlyPayment.toLocaleString('th-TH')}
                        <span className="pd-mortgage-period">/เดือน</span>
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`pd-mortgage-arrow-svg ${showMortgageDetails ? 'expanded' : ''}`} size={22} />
                </div>

                {/* Collapsible Details - Only when expanded */}
                {showMortgageDetails && (
                  <div className="pd-mortgage-details">
                    {/* Key Metrics - 4 Columns */}
                    <div className="pd-mortgage-metrics">
                      <div className="pd-mortgage-metric down-payment">
                        <div className="pd-mortgage-metric-icon">
                          <DollarSign size={20} />
                        </div>
                        <div className="pd-mortgage-metric-content">
                          <p className="pd-mortgage-metric-label">เงินดาวน์</p>
                          <p className="pd-mortgage-metric-value">฿ {mortgage.downPayment.toLocaleString('th-TH')}</p>
                        </div>
                      </div>
                      <div className="pd-mortgage-metric loan-amount">
                        <div className="pd-mortgage-metric-icon">
                          <TrendingUp size={20} />
                        </div>
                        <div className="pd-mortgage-metric-content">
                          <p className="pd-mortgage-metric-label">ยอดกู้</p>
                          <p className="pd-mortgage-metric-value">฿ {mortgage.loanAmount.toLocaleString('th-TH')}</p>
                        </div>
                      </div>
                      <div className="pd-mortgage-metric interest">
                        <div className="pd-mortgage-metric-icon">
                          <Percent size={20} />
                        </div>
                        <div className="pd-mortgage-metric-content">
                          <p className="pd-mortgage-metric-label">ดอกเบี้ย/เดือน</p>
                          <p className="pd-mortgage-metric-value">฿ {mortgage.interest.toLocaleString('th-TH')}</p>
                        </div>
                      </div>
                      <div className="pd-mortgage-metric term">
                        <div className="pd-mortgage-metric-icon">
                          <Calendar size={20} />
                        </div>
                        <div className="pd-mortgage-metric-content">
                          <p className="pd-mortgage-metric-label">ระยะเวลา</p>
                          <p className="pd-mortgage-metric-value">{mortgageData.loanTerm} ปี</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Composition Bar */}
                    <div className="pd-mortgage-composition">
                      <div className="pd-mortgage-bar">
                        <div 
                          className="pd-mortgage-bar-segment principal"
                          style={{ flex: mortgage.principalPercent / 100 }}
                        >
                          {mortgage.principalPercent > 20 && (
                            <span>{mortgage.principalPercent}%</span>
                          )}
                        </div>
                        <div 
                          className="pd-mortgage-bar-segment interest"
                          style={{ flex: mortgage.interestPercent / 100 }}
                        >
                          {mortgage.interestPercent > 20 && (
                            <span>{mortgage.interestPercent}%</span>
                          )}
                        </div>
                      </div>
                      <div className="pd-mortgage-legend">
                        <div className="pd-mortgage-legend-item">
                          <div className="pd-mortgage-legend-color principal"></div>
                          <span className="pd-mortgage-legend-text">
                            เงินต้น <span className="pd-mortgage-legend-value">฿{mortgage.principal.toLocaleString('th-TH')}</span>
                          </span>
                        </div>
                        <div className="pd-mortgage-legend-item">
                          <div className="pd-mortgage-legend-color interest"></div>
                          <span className="pd-mortgage-legend-text">
                            ดอกเบี้ย <span className="pd-mortgage-legend-value">฿{mortgage.interest.toLocaleString('th-TH')}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Calculator Inputs */}
                    <div className="pd-mortgage-inputs">
                      <div className="pd-mortgage-input-group">
                        <label className="pd-mortgage-input-label">ราคา (บาท)</label>
                        <div className="pd-mortgage-input-wrapper">
                          <span className="pd-mortgage-input-prefix">฿</span>
                          <input 
                            type="number" 
                            className="pd-mortgage-input"
                            value={mortgageData.price}
                            onChange={(e) => {
                              setMortgageData({...mortgageData, price: Number(e.target.value)});
                              setMortgageError('');
                            }}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="pd-mortgage-input-group">
                        <label className="pd-mortgage-input-label">เงินดาวน์ (%)</label>
                        <div className="pd-mortgage-input-wrapper">
                          <input 
                            type="number" 
                            className="pd-mortgage-input"
                            value={mortgageData.downPaymentPercent}
                            onChange={(e) => {
                              setMortgageData({...mortgageData, downPaymentPercent: Number(e.target.value)});
                              setMortgageError('');
                            }}
                            placeholder="10"
                          />
                          <span className="pd-mortgage-input-suffix">%</span>
                        </div>
                      </div>

                      <div className="pd-mortgage-input-group">
                        <label className="pd-mortgage-input-label">ดอกเบี้ย (%)</label>
                        <div className="pd-mortgage-input-wrapper">
                          <input 
                            type="number" 
                            className="pd-mortgage-input"
                            value={mortgageData.interestRate === 0 ? '' : mortgageData.interestRate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                setMortgageData({...mortgageData, interestRate: 0});
                                setMortgageError('');
                              } else if (!isNaN(value) && Number(value) >= 0) {
                                setMortgageData({...mortgageData, interestRate: parseFloat(value)});
                                setMortgageError('');
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                setMortgageData({...mortgageData, interestRate: 0});
                              }
                            }}
                            step="any"
                            min="0"
                            placeholder="3"
                          />
                          <span className="pd-mortgage-input-suffix">%</span>
                        </div>
                      </div>

                      <div className="pd-mortgage-input-group">
                        <label className="pd-mortgage-input-label">ระยะเวลา (ปี)</label>
                        <div className="pd-mortgage-input-wrapper">
                          <input 
                            type="number" 
                            className="pd-mortgage-input"
                            value={mortgageData.loanTerm}
                            onChange={(e) => {
                              setMortgageData({...mortgageData, loanTerm: Number(e.target.value)});
                              setMortgageError('');
                            }}
                            min="1"
                            placeholder="20"
                          />
                          <span className="pd-mortgage-input-suffix">ปี</span>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {mortgageError && (
                      <div className="pd-mortgage-error">
                        {mortgageError}
                      </div>
                    )}

                    {/* Calculate Button */}
                    <button 
                      className="pd-mortgage-calculate-btn"
                      onClick={() => {
                        const error = validateMortgageData();
                        if (error) {
                          setMortgageError(error);
                        } else {
                          setMortgageError('');
                          const result = calculateMortgage();
                          setCalculatedMortgage(result);
                          setShowMortgageDetails(true);
                        }
                      }}
                    >
                      <Calculator size={18} />
                      <span>คำนวณยอดสินเชื่อ</span>
                    </button>

                    {/* Summary Breakdown */}
                    <div className="pd-mortgage-summary">
                      <div className="pd-mortgage-summary-row">
                        <span className="pd-mortgage-summary-label">ราคาอสังหาฯ</span>
                        <span className="pd-mortgage-summary-value price">฿ {mortgage.price.toLocaleString('th-TH')}</span>
                      </div>
                      <div className="pd-mortgage-summary-row">
                        <span className="pd-mortgage-summary-label">เงินดาวน์ ({mortgageData.downPaymentPercent}%)</span>
                        <span className="pd-mortgage-summary-value down-payment">-฿ {mortgage.downPayment.toLocaleString('th-TH')}</span>
                      </div>
                      <div className="pd-mortgage-summary-row highlight">
                        <span className="pd-mortgage-summary-label">ยอดสินเชื่อ</span>
                        <span className="pd-mortgage-summary-value loan">฿ {mortgage.loanAmount.toLocaleString('th-TH')}</span>
                      </div>
                      <div className="pd-mortgage-summary-row highlight">
                        <span className="pd-mortgage-summary-label">ดอกเบี้ยทั้งหมด</span>
                        <span className="pd-mortgage-summary-value total-interest">฿ {mortgage.totalInterest.toLocaleString('th-TH')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Owner Card - Premium Design */}
              {property.seller && (
                <div style={{ background: 'white', padding: '18px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #E8E8E8' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={26} color="white" />
                    </div>
                    <div>
                      <p style={{ margin: '0', fontWeight: '700', fontSize: '15px', color: '#1A1A1A' }}>{property.seller.name}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#999', fontWeight: '500' }}>นายหน้า</p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          trackContact('chat');
                          setShowChat(true);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: 'none',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.35)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.25)';
                        }}
                      >
                        <MessageCircle size={16} />
                        <span>แชท</span>
                      </button>
                      <button 
                        onClick={() => {
                          trackContact('phone');
                          window.location.href = `tel:${property.seller.phone}`;
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: '1px solid #E8E8E8',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#1976D2',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#F0F7FF';
                          e.currentTarget.style.borderColor = '#1976D2';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#E8E8E8';
                        }}
                      >
                        <Phone size={16} />
                        <span>{property.seller.phone}</span>
                      </button>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowReportModal(true);
                        setReportType('');
                        setReportDetails('');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #E8E8E8',
                        borderRadius: '8px',
                        background: 'white',
                        color: '#666',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#FFF3E0';
                        e.currentTarget.style.borderColor = '#FF9800';
                        e.currentTarget.style.color = '#FF9800';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#E8E8E8';
                        e.currentTarget.style.color = '#666';
                      }}
                    >
                      <Flag size={16} />
                      <span>รายงานโพส</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Chat History Card */}
              <div style={{ background: 'white', padding: '18px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #E8E8E8' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '700', color: '#1A1A1A' }}>ประวัติการแชท</h4>
                {chatMessages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chatMessages.slice(-5).reverse().map((message, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setShowChat(true)}
                        style={{
                          padding: '10px',
                          background: '#F5F5F5',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderLeft: '3px solid #1976D2'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#EEEEEE';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#F5F5F5';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <p style={{ margin: '0', fontSize: '13px', color: '#1A1A1A', fontWeight: '600' }}>
                          {message.sender === 'buyer' ? 'คุณ' : 
                           (property.seller?.name || 
                            (property.seller?.firstName && property.seller?.lastName ? `${property.seller.firstName} ${property.seller.lastName}` : null) ||
                            property.seller?.firstName ||
                            property.seller?.lastName ||
                            'นายหน้า')}
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {message.text || '📷 ส่งภาพมา'}
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#CCC' }}>
                          {message.time || message.timestamp || 'เมื่อไม่นาน'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    <p style={{ margin: '0', fontSize: '13px' }}>ยังไม่มีการแชท</p>
                    <button
                      onClick={() => setShowChat(true)}
                      style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        background: '#1976D2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
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
                      เริ่มแชทเลย
                    </button>
                  </div>
                )}
              </div>

              {/* Save Property Card */}
              <div style={{ background: 'white', padding: '18px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #E8E8E8' }}>
                <button
                  onClick={() => {
                    if (isSaved) {
                      setSavedProperties(savedProperties.filter(id => id !== property.id));
                    } else {
                      setSavedProperties([...savedProperties, property.id]);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    border: isSaved ? 'none' : '1px solid #E8E8E8',
                    borderRadius: '8px',
                    background: isSaved ? 'linear-gradient(135deg, #FFE8E8 0%, #FFD6D6 100%)' : 'white',
                    color: isSaved ? '#E91E63' : '#999',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isSaved) {
                      e.currentTarget.style.borderColor = '#E91E63';
                      e.currentTarget.style.color = '#E91E63';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSaved) {
                      e.currentTarget.style.borderColor = '#E8E8E8';
                      e.currentTarget.style.color = '#999';
                    }
                  }}
                >
                  <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'บันทึกแล้ว' : 'บันทึกทรัพย์สิน'}</span>
                </button>
              </div>

              {/* Property Details Card */}
              <div style={{ background: 'white', padding: '18px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #E8E8E8' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '700', color: '#1A1A1A' }}>รายละเอียดเพิ่มเติม</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '10px', borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ color: '#999', fontWeight: '600' }}>โครงสร้าง</span>
                    <span style={{ fontWeight: '700', color: '#1A1A1A' }}>คอนกรีตเสริมเหล็ก</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '10px', borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ color: '#999', fontWeight: '600' }}>ปีที่สร้าง</span>
                    <span style={{ fontWeight: '700', color: '#1A1A1A' }}>2020</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '10px', borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ color: '#999', fontWeight: '600' }}>สถานะ</span>
                    <span style={{ fontWeight: '700', color: '#4CAF50' }}>พร้อมอยู่</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#999', fontWeight: '600' }}>ประเภท</span>
                    <span style={{ fontWeight: '700', color: '#1A1A1A' }}>{property.type}</span>
                  </div>
                </div>
              </div>

              {/* Nearby Places Card */}
              <div style={{ background: 'white', padding: '18px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #E8E8E8' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '700', color: '#1A1A1A' }}>สถานที่ใกล้เคียง</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ fontSize: '20px' }}>🏥</span>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#1A1A1A' }}>โรงพยาบาล</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#999' }}>500 ม.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ fontSize: '20px' }}>🏫</span>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#1A1A1A' }}>โรงเรียน</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#999' }}>800 ม.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ fontSize: '20px' }}>🛒</span>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#1A1A1A' }}>ห้างสรรพสินค้า</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#999' }}>1 กม.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🚊</span>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#1A1A1A' }}>สถานีรถไฟฟ้า</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#999' }}>1.5 กม.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div style={{ height: '40px' }}></div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && property && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={() => {
            setShowReportModal(false);
            setReportType('');
            setReportDetails('');
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '380px',
              width: '90%',
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowReportModal(false);
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

            {/* Close Button */}
            <button
              onClick={() => {
                setShowReportModal(false);
                setReportType('');
                setReportDetails('');
              }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '28px',
                height: '28px',
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
              <X size={16} style={{ color: '#666' }} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '16px', paddingTop: '8px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#ffebee', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <Flag size={20} style={{ color: '#c62828' }} />
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#333' }}>รายงานโพส</h3>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>{property?.title || 'ไม่มีชื่อ'}</p>
            </div>
              
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '13px' }}>
                เลือกประเภทการรายงาน
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                      padding: '10px 12px',
                      background: reportType === type ? '#E3F2FD' : 'white',
                      border: `1.5px solid ${reportType === type ? '#1976D2' : '#ddd'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '13px',
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

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '13px' }}>
                รายละเอียดเพิ่มเติม
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="กรุณาระบุรายละเอียดเพิ่มเติม..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '70px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportType('');
                  setReportDetails('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (!reportType) {
                    alert('กรุณาเลือกประเภทการรายงาน');
                    return;
                  }
                  
                  // Get current buyer info
                  const getCurrentBuyer = () => {
                    const buyerEmail = localStorage.getItem('buyerEmail') || localStorage.getItem('userEmail') || 'buyer@example.com';
                    const buyerName = localStorage.getItem('buyerName') || localStorage.getItem('userName') || 'ผู้ซื้อ';
                    return { email: buyerEmail, name: buyerName };
                  };
                  
                  const buyer = getCurrentBuyer();
                  
                  // Save report to localStorage
                  const report = {
                    id: Date.now(),
                    propertyId: property?.id || 0,
                    propertyTitle: property?.title || 'ไม่มีชื่อ',
                    reportType: reportType,
                    reportDetails: reportDetails,
                    reporterEmail: buyer.email,
                    reporterName: buyer.name,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                  };
                  
                  // Get existing reports
                  const existingReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
                  existingReports.push(report);
                  localStorage.setItem('admin_reports', JSON.stringify(existingReports));
                  
                  alert('ส่งรายงานสำเร็จ ขอบคุณสำหรับการแจ้งเตือน');
                  setShowReportModal(false);
                  setReportType('');
                  setReportDetails('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  background: reportType ? '#1976D2' : '#ccc',
                  color: 'white',
                  cursor: reportType ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (reportType) {
                    e.currentTarget.style.background = '#1565C0';
                  }
                }}
                onMouseOut={(e) => {
                  if (reportType) {
                    e.currentTarget.style.background = '#1976D2';
                  }
                }}
              >
                ส่งรายงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}