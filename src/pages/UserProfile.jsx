import React, { useState, useEffect } from 'react';
import { ChevronLeft, Mail, Phone, MapPin, Star, Building2, Eye, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/UserProfile.css';
import usersData from '../data/users.json';
import propertiesData from '../data/properties.json';

const UserProfile = ({ userId, previousPage, adminReportTab, adminActiveTab, onNavigate, onLoginRequired }) => {
  const [user, setUser] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Find user by ID
      const foundUser = usersData.find(u => u.id === parseInt(userId));
      if (foundUser) {
        setUser(foundUser);

        // Find all properties by this seller
        const properties = propertiesData.filter(p => p.seller?.id === foundUser.id);
        setUserProperties(properties);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="up-loading">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="up-error">ไม่พบข้อมูลผู้ใช้</div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* Header Bar */}
      <div className="up-header-bar">
        <button className="up-back-btn" onClick={() => onNavigate(previousPage || 'admin', { activeTab: adminActiveTab, reportTab: adminReportTab })}>
          <ChevronLeft size={24} />
          <span>กลับ</span>
        </button>
        <h1 className="up-page-title">โปรไฟล์ผู้ใช้</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Main Content */}
      <div className="up-main">
        {/* User Info Card */}
        <div className="up-user-card">
          <div className="up-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="up-user-info">
            <h2 className="up-user-name">{user.name}</h2>
            <p className="up-user-role">
              {user.type === 'seller' || userProperties.length > 0 ? '🏢 เจ้าของทรัพย์สิน' : '👤 ผู้ใช้ทั่วไป'}
            </p>
            <div className="up-contact-info">
              <div className="up-info-item">
                <Mail size={18} />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="up-info-item">
                  <Phone size={18} />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="up-info-item">
                  <MapPin size={18} />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="up-status-section">
          <h3 className="up-section-title">สถานะการยืนยัน</h3>
          <div className="up-status-grid">
            <div className={`up-status-item ${user.verified ? 'verified' : 'unverified'}`}>
              {user.verified ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{user.verified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}</span>
            </div>
            <div className="up-status-item info">
              <Calendar size={20} />
              <span>สมาชิกมาตั้งแต่ {user.joinDate || 'ไม่ระบุ'}</span>
            </div>
            {user.rating && (
              <div className="up-status-item info">
                <Star size={20} />
                <span>คะแนน {user.rating}/5.0</span>
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        {user.description && (
          <div className="up-details-section">
            <h3 className="up-section-title">รายละเอียด</h3>
            <p className="up-description">{user.description}</p>
          </div>
        )}

        {/* Properties Section */}
        {userProperties.length > 0 && (
          <div className="up-properties-section">
            <h3 className="up-section-title">
              🏠 ทรัพย์สินที่โพส ({userProperties.length})
            </h3>
            <div className="up-properties-grid">
              {userProperties.map(property => (
                <div 
                  key={property.id} 
                  className="up-property-card"
                  onClick={() => onNavigate('propertyDetail', { property, previousPage: 'admin', activeTab: 'moderation', reportTab: 'user' })}
                >
                  <div className="up-property-image">
                    <img src={property.image} alt={property.title} />
                    <span className="up-property-type">{property.type}</span>
                  </div>
                  <div className="up-property-info">
                    <h4 className="up-property-title">{property.title}</h4>
                    <p className="up-property-location">
                      <MapPin size={14} />
                      {property.location}
                    </p>
                    <div className="up-property-stats">
                      <span>
                        <Building2 size={14} /> {property.beds} นอน {property.baths} น้ำ
                      </span>
                      <span>
                        <Eye size={14} /> {property.views || 0} ครั้ง
                      </span>
                    </div>
                    <p className="up-property-price">{property.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userProperties.length === 0 && (
          <div className="up-no-properties">
            <p>ผู้ใช้นี้ไม่มีทรัพย์สินที่โพส</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
