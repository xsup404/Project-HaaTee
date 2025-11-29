import React, { useState, useMemo } from 'react';
import { MapPin, Bed, Bath, Building, ArrowRight, Heart, CheckCircle, Star, Search, ChevronDown } from 'lucide-react';

export default function SearchResults({
  filteredProperties = [],
  searchTerm = '',
  selectedType = 'ทั้งหมด',
  selectedLocation = 'ทั้งหมด',
  selectedPrice = 'ทั้งหมด',
  searchMode = 'buy',
  savedProperties = [],
  setSavedProperties,
  onPropertySelect,
  onBack,
  getDisplayPrice
}) {
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price-low', 'price-high'
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Helper function to parse price string to number
  const parsePriceValue = (priceStr) => {
    if (!priceStr) return 0;
    // Remove all non-digit characters except decimal point
    const cleaned = priceStr.toString().replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };
  
  // Get actual price value for sorting/filtering
  const getPropertyPriceValue = (property) => {
    if (!property) return 0;
    return property.priceValue || 
           (searchMode === 'buy' ? property.salePrice : property.rentPrice) || 
           parsePriceValue(property.price) || 
           0;
  };

  // Sort properties based on sortOrder
  const sortedProperties = useMemo(() => {
    if (!filteredProperties || filteredProperties.length === 0) return [];
    const sorted = [...filteredProperties];
    if (sortOrder === 'price-low') {
      sorted.sort((a, b) => {
        const priceA = getPropertyPriceValue(a);
        const priceB = getPropertyPriceValue(b);
        return priceA - priceB;
      });
    } else if (sortOrder === 'price-high') {
      sorted.sort((a, b) => {
        const priceA = getPropertyPriceValue(a);
        const priceB = getPropertyPriceValue(b);
        return priceB - priceA;
      });
    }
    return sorted;
  }, [filteredProperties, sortOrder, searchMode]);
  
  // Display all properties (no limit) - show all filtered results
  const displayedProperties = sortedProperties;
  return (
    <section className="search-results-section-future">
      <div className="search-results-wrapper-future">
        <div className="search-results-header-future">
          <button 
            className="back-to-browse-btn-future"
            onClick={onBack}
          >
            ← ย้อนกลับ
          </button>
          <div>
            <h2 className="search-results-title-future">ผลการค้นหา</h2>
            <p className="search-results-query-future">{searchTerm}</p>
            <div className="search-filters-summary-future" style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              {searchTerm && <span>ค้นหา: <strong>{searchTerm}</strong></span>}
              {selectedType !== 'ทั้งหมด' && (
                <>
                  {searchTerm && <span> • </span>}
                  <span>ประเภท: <strong>{selectedType}</strong></span>
                </>
              )}
              {selectedLocation !== 'ทั้งหมด' && (
                <>
                  {(searchTerm || selectedType !== 'ทั้งหมด') && <span> • </span>}
                  <span>ทำเล: <strong>{selectedLocation}</strong></span>
                </>
              )}
              {selectedPrice !== 'ทั้งหมด' && (
                <>
                  {(searchTerm || selectedType !== 'ทั้งหมด' || selectedLocation !== 'ทั้งหมด') && <span> • </span>}
                  <span>ราคา: <strong>{selectedPrice}</strong></span>
                </>
              )}
              {searchMode === 'buy' && (
                <>
                  {(searchTerm || selectedType !== 'ทั้งหมด' || selectedLocation !== 'ทั้งหมด' || selectedPrice !== 'ทั้งหมด') && <span> • </span>}
                  <span>โหมด: <strong>ซื้อ</strong></span>
                </>
              )}
              {searchMode === 'rent' && (
                <>
                  {(searchTerm || selectedType !== 'ทั้งหมด' || selectedLocation !== 'ทั้งหมด' || selectedPrice !== 'ทั้งหมด') && <span> • </span>}
                  <span>โหมด: <strong>เช่า</strong></span>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="search-results-count-future">
              พบ {filteredProperties.length} รายการ
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #E8E8E8',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#333',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#1976D2';
                  e.currentTarget.style.color = '#1976D2';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.color = '#333';
                }}
              >
                <span>เรียงตาม: </span>
                <span style={{ fontWeight: '600' }}>
                  {sortOrder === 'price-low' ? 'ราคาต่ำไปสูง' : 
                   sortOrder === 'price-high' ? 'ราคาสูงไปต่ำ' : 
                   'ค่าเริ่มต้น'}
                </span>
                <ChevronDown size={16} />
              </button>
              {showSortDropdown && (
                <>
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 998
                    }}
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: 'white',
                      border: '1px solid #E8E8E8',
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      zIndex: 999,
                      minWidth: '200px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => {
                        setSortOrder('default');
                        setShowSortDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: sortOrder === 'default' ? '#F0F7FF' : 'white',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: sortOrder === 'default' ? '#1976D2' : '#333',
                        fontWeight: sortOrder === 'default' ? '600' : '400',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        if (sortOrder !== 'default') {
                          e.currentTarget.style.background = '#F5F5F5';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (sortOrder !== 'default') {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      ค่าเริ่มต้น
                    </button>
                    <button
                      onClick={() => {
                        setSortOrder('price-low');
                        setShowSortDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: sortOrder === 'price-low' ? '#F0F7FF' : 'white',
                        border: 'none',
                        borderTop: '1px solid #F0F0F0',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: sortOrder === 'price-low' ? '#1976D2' : '#333',
                        fontWeight: sortOrder === 'price-low' ? '600' : '400',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        if (sortOrder !== 'price-low') {
                          e.currentTarget.style.background = '#F5F5F5';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (sortOrder !== 'price-low') {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      ราคาต่ำไปสูง
                    </button>
                    <button
                      onClick={() => {
                        setSortOrder('price-high');
                        setShowSortDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: sortOrder === 'price-high' ? '#F0F7FF' : 'white',
                        border: 'none',
                        borderTop: '1px solid #F0F0F0',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: sortOrder === 'price-high' ? '#1976D2' : '#333',
                        fontWeight: sortOrder === 'price-high' ? '600' : '400',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        if (sortOrder !== 'price-high') {
                          e.currentTarget.style.background = '#F5F5F5';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (sortOrder !== 'price-high') {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      ราคาสูงไปต่ำ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="search-results-content-future">
          {sortedProperties.length > 0 ? (
            <>
              <div className="search-results-grid-future" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {displayedProperties.map((property) => (
                <div key={property.id} className="property-card-future" onClick={() => onPropertySelect(property)}>
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
                          onPropertySelect(property);
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
            </>
          ) : (
            <div className="no-results-future">
              <Search size={48} />
              <h3>ไม่พบผลการค้นหา</h3>
              <p>ลองค้นหาด้วยคำอื่น หรือปรับเปลี่ยนตัวกรอง</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
