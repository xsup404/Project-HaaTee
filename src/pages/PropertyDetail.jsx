import React, { useState, useRef } from 'react';
import { Heart, MapPin, Bed, Bath, Building, ChevronLeft, Phone, MessageCircle, CheckCircle, User, Flag } from 'lucide-react';
import '../styles/PropertyDetail.css';

const PropertyDetail = ({ property, previousPage, adminReportTab, adminActiveTab, onNavigate, onLoginRequired }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const messagesEndRef = useRef(null);

  const propertyImages = [
    property?.image,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&h=800&fit=crop',
  ];

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
        <button className="pd-back-btn" onClick={() => onNavigate(previousPage || 'properties', { reportTab: adminReportTab, activeTab: adminActiveTab })}>
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
          <div className="pd-gallery-container">
            {/* Main Large Image */}
            <div className="pd-gallery-main">
              <img src={propertyImages[selectedImage]} alt={property.title} />
              <div className="pd-gallery-badge">
                <span className="pd-badge-featured">Featured</span>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="pd-gallery-thumbnails">
              {propertyImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`pd-thumbnail-item ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${property.title} - Photo ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="pd-content-inner">
          <div className="pd-layout-grid">
            {/* Left Column - Main Content */}
            <div className="pd-main-column">
              {/* Header Info */}
              <div className="pd-header-info">
                <h1 className="pd-title">{property.title}</h1>
                <div className="pd-meta-info">
                  <p className="pd-location">
                    <MapPin size={20} />
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
                    <span className="pd-spec-value">{property.beds}</span>
                    <span className="pd-spec-label">ห้องนอน</span>
                  </div>
                </div>
                <div className="pd-spec-box">
                  <Bath size={24} />
                  <div>
                    <span className="pd-spec-value">{property.baths}</span>
                    <span className="pd-spec-label">ห้องน้ำ</span>
                  </div>
                </div>
                <div className="pd-spec-box">
                  <Building size={24} />
                  <div>
                    <span className="pd-spec-value">{property.size}</span>
                    <span className="pd-spec-label">พื้นที่ใช้สอย</span>
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

              {/* Location Map Section */}
              <div className="pd-section">
                <h3>ตำแหน่งที่ตั้ง</h3>
                <div className="pd-map-container" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31000.085226988802!2d100.58904807910157!3d13.778230999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6201bdc6add1%3A0xe50b0dc559cad94e!2sShowroom%20MASTER%20PLAN%20101!5e0!3m2!1sth!2sth!4v1764194781062!5m2!1sth!2sth" 
                    width="100%" 
                    height="350" 
                    style={{ border: '0' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <p className="pd-location-text">
                    <MapPin size={18} />
                    {property.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="pd-sidebar-column">
              {/* Owner Card */}
              {property.owner && (
                <div className="pd-sidebar-card pd-owner-section">
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

                  {/* Contact Buttons */}
                  <div className="pd-contact-buttons">
                    <button
                      className="pd-btn pd-btn-primary"
                      onClick={() => onLoginRequired('แชทกับเจ้าของ')}
                    >
                      <MessageCircle size={18} />
                      <span>แชทกับเจ้าของ</span>
                    </button>
                    <button
                      className="pd-btn pd-btn-secondary"
                      onClick={() => onLoginRequired('โทรหาเจ้าของ')}
                    >
                      <Phone size={18} />
                      <span>โทรหา</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Save Property Card */}
              <div className="pd-sidebar-card pd-save-card">
                <button
                  className={`pd-btn pd-btn-save ${isSaved ? 'active' : ''}`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'บันทึกแล้ว' : 'บันทึกทรัพย์สิน'}</span>
                </button>
              </div>

              {/* Property Details Card */}
              <div className="pd-sidebar-card pd-details-card">
                <h4>รายละเอียดเพิ่มเติม</h4>
                <div className="pd-details-list">
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">โครงสร้าง</span>
                    <span className="pd-detail-value">คอนกรีตเสริมเหล็ก</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">ปีที่สร้าง</span>
                    <span className="pd-detail-value">2020</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">สถานะ</span>
                    <span className="pd-detail-value">พร้อมอยู่</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">ประเภท</span>
                    <span className="pd-detail-value">{property.type}</span>
                  </div>
                </div>
              </div>

              {/* Nearby Places Card */}
              <div className="pd-sidebar-card pd-nearby-card">
                <h4>สถานที่ใกล้เคียง</h4>
                <div className="pd-nearby-list">
                  <div className="pd-nearby-row">
                    <span className="pd-nearby-icon">🏥</span>
                    <div className="pd-nearby-content">
                      <span className="pd-nearby-name">โรงพยาบาล</span>
                      <span className="pd-nearby-distance">500 ม.</span>
                    </div>
                  </div>
                  <div className="pd-nearby-row">
                    <span className="pd-nearby-icon">🏫</span>
                    <div className="pd-nearby-content">
                      <span className="pd-nearby-name">โรงเรียน</span>
                      <span className="pd-nearby-distance">800 ม.</span>
                    </div>
                  </div>
                  <div className="pd-nearby-row">
                    <span className="pd-nearby-icon">🛒</span>
                    <div className="pd-nearby-content">
                      <span className="pd-nearby-name">ห้างสรรพสินค้า</span>
                      <span className="pd-nearby-distance">1 กม.</span>
                    </div>
                  </div>
                  <div className="pd-nearby-row">
                    <span className="pd-nearby-icon">🚊</span>
                    <div className="pd-nearby-content">
                      <span className="pd-nearby-name">สถานีรถไฟฟ้า</span>
                      <span className="pd-nearby-distance">1.5 กม.</span>
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
    </div>
  );
};

export default PropertyDetail;
