import React, { useState, useRef } from 'react';
import { Heart, MapPin, Bed, Bath, Building, ChevronLeft, Star, Send, Phone, MessageCircle } from 'lucide-react';
import '../styles/PropertyDetail.css';

const PropertyDetail = ({ property, onNavigate, onLoginRequired }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'owner', text: 'สวัสดีค่ะ ยินดีต้อนรับครับ', time: '10:30 AM' },
    { id: 2, sender: 'buyer', text: 'สวัสดีค่ะ ทรัพย์สินนี้ยังว่างอยู่ไหมค่ะ', time: '10:35 AM' },
    { id: 3, sender: 'owner', text: 'ว่างอยู่ครับ พร้อมให้ทำสัญญาได้เลยครับ', time: '10:36 AM' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: chatMessages.length + 1,
        sender: 'buyer',
        text: chatMessage,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatMessage('');
    setTimeout(scrollToBottom, 100);
  };

  if (!property) {
    return (
      <div className="property-detail-page">
        <div className="pd-error">ไม่พบข้อมูลทรัพย์สิน</div>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      {/* Header */}
      <header className="pd-header">
        <button className="pd-back-btn" onClick={() => onNavigate('properties')}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="pd-header-title">รายละเอียดทรัพย์สิน</h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Main Content */}
      <div className="pd-main">
        {/* Image Section */}
        <div className="pd-image-section">
          <img src={property.image} alt={property.title} />
          <div className="pd-type-badge">{property.type}</div>
          <button 
            className={`pd-save-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart size={24} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content Section */}
        <div className="pd-content">
          {/* Header Info */}
          <div className="pd-header-info">
            <h1 className="pd-title">{property.title}</h1>
            <div className="pd-price">{property.price}</div>
            <div className="pd-location">
              <MapPin size={18} />
              {property.location}
            </div>
          </div>

          {/* Specs */}
          <div className="pd-specs-grid">
            <div className="pd-spec-card">
              <Bed size={24} />
              <div className="pd-spec-info">
                <div className="pd-spec-label">ห้องนอน</div>
                <div className="pd-spec-value">{property.beds}</div>
              </div>
            </div>
            <div className="pd-spec-card">
              <Bath size={24} />
              <div className="pd-spec-info">
                <div className="pd-spec-label">ห้องน้ำ</div>
                <div className="pd-spec-value">{property.baths}</div>
              </div>
            </div>
            <div className="pd-spec-card">
              <Building size={24} />
              <div className="pd-spec-info">
                <div className="pd-spec-label">ขนาด</div>
                <div className="pd-spec-value">{property.size}</div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="pd-section">
            <h2 className="pd-section-title">แชทกับเจ้าของ</h2>
            <div className="pd-chat-box">
              <div className="pd-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`pd-message ${msg.sender}`}>
                    <div className="pd-msg-content">{msg.text}</div>
                    <div className="pd-msg-time">{msg.time}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="pd-input-box">
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความ..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pd-input"
                />
                <button className="pd-send-btn" onClick={handleSendMessage}>
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pd-actions">
            <button 
              className="pd-btn pd-contact-btn"
              onClick={() => onLoginRequired('ติดต่อเจ้าของ')}
            >
              <Phone size={20} />
              ติดต่อเจ้าของ
            </button>
            <button 
              className="pd-btn pd-chat-btn"
              onClick={() => onLoginRequired('แชทกับเจ้าของ')}
            >
              <MessageCircle size={20} />
              แชท
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
