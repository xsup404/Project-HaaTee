import React, { useState, useRef } from 'react';
import { Heart, MapPin, Bed, Bath, Building, ChevronLeft, Send, Phone, MessageCircle, CheckCircle, User, Flag } from 'lucide-react';
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
      {/* Header Bar */}
      <div className="pd-header-bar">
        <button className="pd-back-btn" onClick={() => onNavigate('properties')}>
          <ChevronLeft size={24} />
          <span>กลับ</span>
        </button>
        <div className="pd-header-actions">
          <button 
            className={`pd-action-btn ${isSaved ? 'active' : ''}`}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart size={20} />
          </button>
          <button className="pd-action-btn">
            <Flag size={20} />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="pd-main">
        {/* Gallery Section */}
        <div className="pd-gallery-wrapper">
          <div className="pd-gallery-main">
            <img src={property.image} alt={property.title} />
          </div>
          <div className="pd-gallery-thumbnails">
            <div className="pd-thumbnail-item active">
              <img src={property.image} alt="Photo 1" />
            </div>
            <div className="pd-thumbnail-item">
              <img src={property.image} alt="Photo 2" />
            </div>
            <div className="pd-thumbnail-item">
              <img src={property.image} alt="Photo 3" />
            </div>
            <div className="pd-thumbnail-item">
              <img src={property.image} alt="Photo 4" />
            </div>
            <div className="pd-thumbnail-item">
              <img src={property.image} alt="Photo 5" />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="pd-content-inner">
          {/* Header Info */}
          <div className="pd-header-info">
            <h1 className="pd-title">{property.title}</h1>
            <div className="pd-meta-info">
              <p className="pd-location">
                <MapPin size={18} />
                {property.location}
              </p>
              {property.verified && (
                <span className="pd-verified-badge">✓ ยืนยันแล้ว</span>
              )}
            </div>
            <h2 className="pd-price">{property.price}</h2>
          </div>

          {/* Specs */}
          <div className="pd-specs-grid">
            <div className="pd-spec-box">
              <Bed size={24} />
              <div>
                <span className="pd-spec-label">ห้องนอน</span>
                <span className="pd-spec-value">{property.beds}</span>
              </div>
            </div>
            <div className="pd-spec-box">
              <Bath size={24} />
              <div>
                <span className="pd-spec-label">ห้องน้ำ</span>
                <span className="pd-spec-value">{property.baths}</span>
              </div>
            </div>
            <div className="pd-spec-box">
              <Building size={24} />
              <div>
                <span className="pd-spec-label">ขนาด</span>
                <span className="pd-spec-value">{property.size}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="pd-section">
            <h3>รายละเอียด</h3>
            <p>{property.description}</p>
          </div>

          {/* Amenities Section */}
          {property.amenities && (
            <div className="pd-section">
              <h3>สิ่งอำนวยความสะดวก</h3>
              <div className="pd-amenities-grid">
                {property.amenities.map((amenity, idx) => (
                  <span key={idx} className="pd-amenity-chip">
                    <CheckCircle size={16} />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Section */}
          {property.owner && (
            <div className="pd-section">
              <h3>ข้อมูลเจ้าของ</h3>
              <div className="pd-owner-card">
                <div className="pd-owner-avatar">
                  <User size={40} />
                </div>
                <div className="pd-owner-info">
                  <p className="pd-owner-name">{property.owner.name}</p>
                  <p className="pd-owner-role">เจ้าของทรัพย์สิน</p>
                  {property.owner.rating && (
                    <p className="pd-owner-rating">⭐ {property.owner.rating} / 5.0</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat Section */}
          <div className="pd-section">
            <h3>แชทกับเจ้าของ</h3>
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
              className="pd-btn pd-btn-primary"
              onClick={() => onLoginRequired('แชทกับเจ้าของ')}
            >
              <MessageCircle size={18} />
              <span>แชทกับเจ้าของ</span>
            </button>
            <button 
              className={`pd-btn pd-btn-secondary ${isSaved ? 'active' : ''}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart size={18} />
              <span>{isSaved ? 'บันทึกแล้ว' : 'บันทึก'}</span>
            </button>
          </div>

          {/* Bottom Spacing */}
          <div style={{ height: '40px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
