import React, { useState, useRef } from 'react';
import { Heart, MapPin, Bed, Bath, Building, ChevronLeft, Phone, MessageCircle, CheckCircle, User, Flag } from 'lucide-react';
import '../styles/PropertyDetail.css';

const PropertyDetail = ({ property, onNavigate, onLoginRequired }) => {
  const [isSaved, setIsSaved] = useState(false);
  const messagesEndRef = useRef(null);

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
          <div className="pd-gallery-main-container">
            <div className="pd-gallery-main">
              <img src={property.image} alt={property.title} />
              <div className="pd-gallery-badge">
                <span className="pd-badge-featured">Featured</span>
              </div>
            </div>
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

          {/* Location Map Section */}
          <div className="pd-section">
            <h3>📍 ตำแหน่งที่ตั้ง</h3>
            <div className="pd-map-container">
              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="pd-map">
                <rect width="400" height="300" fill="#E8F4F8" />
                <circle cx="100" cy="150" r="40" fill="#B3E5FC" opacity="0.5" />
                <circle cx="350" cy="100" r="30" fill="#B3E5FC" opacity="0.5" />
                <line x1="0" y1="75" x2="400" y2="75" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="225" x2="400" y2="225" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                <line x1="100" y1="0" x2="100" y2="300" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                <line x1="300" y1="0" x2="300" y2="300" stroke="#BDBDBD" strokeWidth="0.5" opacity="0.3" />
                <rect x="10" y="100" width="380" height="4" fill="#F9A825" opacity="0.6" />
                <rect x="50" y="10" width="4" height="280" fill="#F9A825" opacity="0.6" />
                <rect x="180" y="40" width="4" height="220" fill="#F9A825" opacity="0.6" />
                <rect x="30" y="50" width="30" height="30" fill="#90CAF9" />
                <rect x="80" y="60" width="25" height="25" fill="#90CAF9" />
                <rect x="250" y="120" width="35" height="35" fill="#90CAF9" />
                <rect x="320" y="180" width="28" height="28" fill="#90CAF9" />
                <circle cx="200" cy="150" r="12" fill="#F44336" />
                <circle cx="200" cy="150" r="8" fill="white" />
                <path d="M 200 160 L 195 175 L 200 180 L 205 175 Z" fill="#F44336" />
              </svg>
              <p className="pd-location-text">
                <MapPin size={18} />
                {property.location}
              </p>
            </div>
          </div>

          {/* Floor Plan Section */}
          {property.floorPlan && (
            <div className="pd-section">
              <h3>🏠 แปลนบ้าน</h3>
              <div className="pd-floorplan-container">
                <img src={property.floorPlan} alt="Floor Plan" className="pd-floorplan-image" />
              </div>
            </div>
          )}

          {/* Detailed Features Section */}
          <div className="pd-section">
            <h3>✨ รายละเอียดเพิ่มเติม</h3>
            <div className="pd-features-grid">
              <div className="pd-feature-item">
                <div className="pd-feature-icon">🏗️</div>
                <div className="pd-feature-content">
                  <p className="pd-feature-label">โครงสร้าง</p>
                  <p className="pd-feature-value">คอนกรีตเสริมเหล็ก</p>
                </div>
              </div>
              <div className="pd-feature-item">
                <div className="pd-feature-icon">📅</div>
                <div className="pd-feature-content">
                  <p className="pd-feature-label">ปีที่สร้าง</p>
                  <p className="pd-feature-value">2020</p>
                </div>
              </div>
              <div className="pd-feature-item">
                <div className="pd-feature-icon">🛏️</div>
                <div className="pd-feature-content">
                  <p className="pd-feature-label">ห้องนอน</p>
                  <p className="pd-feature-value">{property.beds} ห้อง</p>
                </div>
              </div>
              <div className="pd-feature-item">
                <div className="pd-feature-icon">🛁</div>
                <div className="pd-feature-content">
                  <p className="pd-feature-label">ห้องน้ำ</p>
                  <p className="pd-feature-value">{property.baths} ห้อง</p>
                </div>
              </div>
              <div className="pd-feature-item">
                <div className="pd-feature-icon">📐</div>
                <div className="pd-feature-content">
                  <p className="pd-feature-label">พื้นที่</p>
                  <p className="pd-feature-value">{property.size}</p>
                </div>
              </div>
              <div className="pd-feature-item">
                <div className="pd-feature-icon">🔑</div>
                <div className="pd-feature-content">
                  <p className="pd-feature-label">สถานะ</p>
                  <p className="pd-feature-value">พร้อมอยู่</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Amenities Section */}
          <div className="pd-section">
            <h3>🏪 สิ่งอำนวยความสะดวกใกล้เคียง</h3>
            <div className="pd-nearby-grid">
              <div className="pd-nearby-item">
                <div className="pd-nearby-icon">🏥</div>
                <p>โรงพยาบาล</p>
                <span>500 ม.</span>
              </div>
              <div className="pd-nearby-item">
                <div className="pd-nearby-icon">🏫</div>
                <p>โรงเรียน</p>
                <span>800 ม.</span>
              </div>
              <div className="pd-nearby-item">
                <div className="pd-nearby-icon">🛒</div>
                <p>ห้างสรรพสินค้า</p>
                <span>1 กม.</span>
              </div>
              <div className="pd-nearby-item">
                <div className="pd-nearby-icon">🚊</div>
                <p>สถานีรถไฟฟ้า</p>
                <span>1.5 กม.</span>
              </div>
              <div className="pd-nearby-item">
                <div className="pd-nearby-icon">🍔</div>
                <p>ร้านอาหาร</p>
                <span>300 ม.</span>
              </div>
              <div className="pd-nearby-item">
                <div className="pd-nearby-icon">🏋️</div>
                <p>ห้องฟิตเนส</p>
                <span>600 ม.</span>
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
