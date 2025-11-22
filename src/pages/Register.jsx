import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Check, ChevronRight } from 'lucide-react';
import '../styles/Register.css';

export default function Register({ onNavigate }) {
  const [step, setStep] = useState('userType');
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    idCardNumber: '',
    companyName: '',
    licenseNumber: '',
    agentType: 'company',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedCommunity, setAgreedCommunity] = useState(false);
  const [agreedVerification, setAgreedVerification] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^0\d{9}$/.test(phone);
  const validatePassword = (pwd) => pwd.length >= 8;

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMessage({ type: 'error', text: '⚠️ กรุณากรอกชื่อและนามสกุล' });
      return;
    }
    if (!validateEmail(formData.email)) {
      setMessage({ type: 'error', text: '⚠️ รูปแบบอีเมลไม่ถูกต้อง' });
      return;
    }
    if (!validatePhone(formData.phone)) {
      setMessage({ type: 'error', text: '⚠️ เบอร์โทรศัพท์ต้องเป็น 0xxxxxxxxx' });
      return;
    }
    if (!validatePassword(formData.password)) {
      setMessage({ type: 'error', text: '⚠️ รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: '⚠️ รหัสผ่านไม่ตรงกัน' });
      return;
    }

    if (userType === 'buyer') {
      setStep('consent');
    } else if (userType === 'seller') {
      setStep('verification');
    } else if (userType === 'agent') {
      setStep('agent-info');
    }
    setMessage({ type: '', text: '' });
  };

  const handleConsent = () => {
    if (!agreedTerms || !agreedPrivacy || !agreedCommunity) {
      setMessage({ type: 'error', text: '⚠️ กรุณายอมรับเอกสารทั้งหมด' });
      return;
    }
    setStep('otp');
    setMessage({ type: '', text: '' });
    setTimer(120);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setMessage({ type: 'error', text: '⚠️ กรุณากรอก OTP ให้ครบ 6 หลัก' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  // STEP 1: USER TYPE SELECTION
  if (step === 'userType') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '50px 40px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>👥</div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1A202C', margin: '0 0 10px 0' }}>
              เลือกประเภทผู้ใช้งาน
            </h1>
            <p style={{ fontSize: '15px', color: '#718096', margin: '0', lineHeight: '1.6' }}>
              เลือกประเภทที่เหมาะกับการใช้งานของคุณ
            </p>
          </div>

          {message.text && (
            <div style={{
              background: message.type === 'error' ? '#FEE' : '#EFF',
              border: `1px solid ${message.type === 'error' ? '#FCC' : '#CFF'}`,
              color: message.type === 'error' ? '#C33' : '#033',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {[
              { id: 'buyer', icon: '🛍️', title: 'ผู้ซื้อ / ผู้เช่า', desc: 'ค้นหาและบันทึกทรัพย์สิน' },
              { id: 'seller', icon: '🏠', title: 'เจ้าของทรัพย์สิน', desc: 'ลงประกาศและค้นหาผู้ซื้อ' },
              { id: 'agent', icon: '👔', title: 'นายหน้า / ตัวแทน', desc: 'บริหารทรัพย์สินหลาย ชิ้น' }
            ].map(type => (
              <div
                key={type.id}
                onClick={() => setUserType(type.id)}
                style={{
                  border: userType === type.id ? '2px solid #1976D2' : '2px solid #E0E0E0',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  background: userType === type.id ? '#F0F8FF' : 'white',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{type.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: '#1A202C' }}>
                  {type.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#718096', margin: '0' }}>{type.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onNavigate('login')}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'white',
                color: '#1976D2',
                border: '2px solid #1976D2',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              ← กลับ
            </button>
            <button
              onClick={() => userType ? setStep('accountInfo') : setMessage({ type: 'error', text: '⚠️ กรุณาเลือกประเภทผู้ใช้งาน' })}
              disabled={!userType}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: userType ? 'linear-gradient(135deg, #1976D2, #00BCD4)' : '#CCC',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: userType ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <span>ดำเนินการต่อ</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ fontSize: '14px', color: '#718096', margin: '0' }}>
              มีบัญชีแล้ว?{' '}
              <button
                onClick={() => onNavigate('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1976D2',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                เข้าสู่ระบบ
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render progress bar
  const renderProgressBar = () => {
    const steps = ['userType', 'accountInfo', 'verification', 'agent-info', 'consent', 'otp'];
    const stepLabels = ['ประเภท', 'ข้อมูล', 'ยืนยัน', 'บริษัท', 'ตกลง', 'OTP'];
    const currentIndex = steps.indexOf(step);

    return (
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          {steps.map((s, idx) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Step Circle */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: idx <= currentIndex ? 'linear-gradient(135deg, #1976D2, #00BCD4)' : '#E0E0E0',
                color: idx <= currentIndex ? 'white' : '#718096',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}>
                {idx < currentIndex ? '✓' : idx + 1}
              </div>
              {/* Label */}
              <div style={{
                fontSize: '12px',
                color: idx <= currentIndex ? '#1976D2' : '#718096',
                fontWeight: idx === currentIndex ? '600' : '400',
                marginLeft: '6px',
                minWidth: '50px',
                transition: 'all 0.3s ease'
              }}>
                {stepLabels[idx]}
              </div>
              {/* Connector */}
              {idx < steps.length - 1 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: idx < currentIndex ? 'linear-gradient(90deg, #1976D2, #00BCD4)' : '#E0E0E0',
                  margin: '0 6px',
                  transition: 'all 0.3s ease'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // STEP 2: ACCOUNT INFO
  if (step === 'accountInfo') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '40px',
          position: 'relative'
        }}>
          {/* Back Button - Top Left */}
          <button
            onClick={() => { setStep('userType'); setMessage({ type: '', text: '' }); }}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              background: 'white',
              color: '#1976D2',
              border: '2px solid #1976D2',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              zIndex: 10
            }}
          >
            ← กลับ
          </button>

          {renderProgressBar()}

          <div style={{ 
            background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
            padding: '20px 24px',
            borderRadius: '16px',
            marginBottom: '30px',
            color: 'white',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '24px', marginTop: '2px', flexShrink: 0 }}>📝</span>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0' }}>
                  ขั้นตอนที่ 2: ข้อมูลส่วนตัว
                </h1>
                <p style={{ fontSize: '14px', margin: '0', opacity: '0.95' }}>
                  {userType === 'buyer' && 'กรุณากรอกข้อมูลส่วนตัวสำหรับสมัครสมาชิกผู้ซื้อ/ผู้เช่า'}
                  {userType === 'seller' && 'กรุณากรอกข้อมูลส่วนตัวสำหรับสมัครสมาชิกเจ้าของทรัพย์สิน'}
                  {userType === 'agent' && 'กรุณากรอกข้อมูลส่วนตัวสำหรับสมัครสมาชิกนายหน้า'}
                </p>
              </div>
            </div>
          </div>

          {message.text && (
            <div style={{
              background: message.type === 'error' ? '#FEE' : '#EFF',
              border: `1px solid ${message.type === 'error' ? '#FCC' : '#CFF'}`,
              color: message.type === 'error' ? '#C33' : '#033',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleStep1Submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Row 1: Name & Last Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>ชื่อ</label>
              <input
                type="text"
                name="firstName"
                placeholder="ชื่อจริง"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>นามสกุล</label>
              <input
                type="text"
                name="lastName"
                placeholder="นามสกุล"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Row 2: Email & Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>อีเมล</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>เบอร์โทรศัพท์</label>
              <input
                type="tel"
                name="phone"
                placeholder="0812345678"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength="10"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Row 3: ID Card or Date of Birth (full width) */}
            {userType === 'buyer' && (
              <>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>วันเดือนปีเกิด</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </>
            )}

            {(userType === 'seller' || userType === 'agent') && (
              <>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>เลขประจำตัวประชาชน</label>
                  <input
                    type="text"
                    name="idCardNumber"
                    placeholder="เลขประจำตัวประชาชน"
                    value={formData.idCardNumber}
                    onChange={handleInputChange}
                    maxLength="13"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </>
            )}

            {/* Row 4: Password & Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>รหัสผ่าน</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>ยืนยันรหัสผ่าน</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Requirements Box (full width) */}
            <div style={{ gridColumn: '1 / -1', background: '#F5F5F5', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#718096', lineHeight: '1.5' }}>
              <strong style={{ color: '#1A202C', display: 'block', marginBottom: '6px' }}>✓ ข้อกำหนดรหัสผ่าน:</strong>
              • 8 ตัวอักษร<br/>
              • ตัวพิมพ์ใหญ่ ตัวเลข สัญลักษณ์
            </div>

            {/* Buttons (full width) */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)'
                }}
                onMouseHover={(e) => e.target.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)'}
                onMouseOut={(e) => e.target.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.3)'}
              >
                <span>ดำเนินการต่อ</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // STEP 3: VERIFICATION (for seller/agent)
  if (step === 'verification') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '40px',
        }}>
          {renderProgressBar()}
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A202C', marginBottom: '20px' }}>
            ยืนยันตัวตน
          </h1>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            กรุณากรอกข้อมูลการยืนยันตัวตนตามบัตรประชาชน
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              เลขประจำตัวประชาชน
            </label>
            <input
              type="text"
              name="idCardNumber"
              placeholder="เลขประจำตัวประชาชน (13 หลัก)"
              value={formData.idCardNumber}
              onChange={handleInputChange}
              maxLength="13"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setStep('accountInfo'); setMessage({ type: '', text: '' }); }}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'white',
                color: '#1976D2',
                border: '2px solid #1976D2',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ← กลับ
            </button>
            <button
              onClick={() => setStep('consent')}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #1976D2, #00BCD4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>ดำเนินการต่อ</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3b: AGENT INFO
  if (step === 'agent-info') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '40px',
        }}>
          {renderProgressBar()}
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A202C', marginBottom: '20px' }}>
            ข้อมูลนายหน้า
          </h1>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              ประเภทนายหน้า
            </label>
            <select
              value={formData.agentType}
              onChange={(e) => setFormData({ ...formData, agentType: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            >
              <option value="company">สังกัดบริษัท</option>
              <option value="freelance">ฟรีแลนซ์</option>
            </select>
          </div>

          {formData.agentType === 'company' && (
            <input
              type="text"
              name="companyName"
              placeholder="ชื่อบริษัท/สำนักงาน"
              value={formData.companyName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          )}

          <input
            type="text"
            name="licenseNumber"
            placeholder="ใบประกอบวิชาชีพ/หมายเลขใบอนุญาต (ถ้ามี)"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '16px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setStep('accountInfo'); setMessage({ type: '', text: '' }); }}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'white',
                color: '#1976D2',
                border: '2px solid #1976D2',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ← กลับ
            </button>
            <button
              onClick={() => setStep('verification')}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #1976D2, #00BCD4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>ดำเนินการต่อ</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 4: CONSENT
  if (step === 'consent') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '40px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          {renderProgressBar()}
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A202C', marginBottom: '20px' }}>
            ยอมรับเอกสาร
          </h1>

          {message.text && (
            <div style={{
              background: message.type === 'error' ? '#FEE' : '#EFF',
              border: `1px solid ${message.type === 'error' ? '#FCC' : '#CFF'}`,
              color: message.type === 'error' ? '#C33' : '#033',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          )}

          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E0E0E0' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <div>
                <strong style={{ fontSize: '14px' }}>ข้อตกลงการใช้งาน</strong>
                <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>
                  ฉันได้อ่านและยอมรับเงื่อนไขการใช้งาน
                </p>
              </div>
            </label>
          </div>

          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E0E0E0' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => setAgreedPrivacy(e.target.checked)}
                style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <div>
                <strong style={{ fontSize: '14px' }}>นโยบายความเป็นส่วนตัว</strong>
                <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>
                  ฉันเข้าใจและยอมรับการประมวลผลข้อมูลส่วนบุคคล
                </p>
              </div>
            </label>
          </div>

          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E0E0E0' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreedCommunity}
                onChange={(e) => setAgreedCommunity(e.target.checked)}
                style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <div>
                <strong style={{ fontSize: '14px' }}>กฎเกณฑ์ชุมชน</strong>
                <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>
                  ฉันเข้าใจและจะปฏิบัติตามกฎเกณฑ์ชุมชน
                </p>
              </div>
            </label>
          </div>

          {(userType === 'seller' || userType === 'agent') && (
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E0E0E0' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreedVerification}
                  onChange={(e) => setAgreedVerification(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ fontSize: '14px' }}>ข้อมูลการยืนยันตัวตน</strong>
                  <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>
                    ฉันรับทราบว่าข้อมูลประชาชนของฉันจะถูกตรวจสอบ
                  </p>
                </div>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setStep(userType === 'seller' ? 'verification' : userType === 'agent' ? 'agent-info' : 'accountInfo'); setMessage({ type: '', text: '' }); }}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'white',
                color: '#1976D2',
                border: '2px solid #1976D2',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ← กลับ
            </button>
            <button
              onClick={handleConsent}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #1976D2, #00BCD4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>ส่ง OTP</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 5: OTP VERIFICATION
  if (step === 'otp') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '40px',
          textAlign: 'center'
        }}>
          {renderProgressBar()}
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A202C', marginBottom: '10px' }}>
            ยืนยัน OTP
          </h1>
          <p style={{ color: '#718096', marginBottom: '30px' }}>
            เราได้ส่ง OTP ไปยัง {formData.phone}
          </p>

          {message.text && (
            <div style={{
              background: message.type === 'error' ? '#FEE' : '#EFF',
              border: `1px solid ${message.type === 'error' ? '#FCC' : '#CFF'}`,
              color: message.type === 'error' ? '#C33' : '#033',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '30px' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (otpRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                style={{
                  width: '50px',
                  height: '50px',
                  fontSize: '24px',
                  fontWeight: '600',
                  textAlign: 'center',
                  border: '2px solid #E0E0E0',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => { setStep('consent'); setMessage({ type: '', text: '' }); }}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'white',
                color: '#1976D2',
                border: '2px solid #1976D2',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ← กลับ
            </button>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: loading ? '#CCC' : 'linear-gradient(135deg, #1976D2, #00BCD4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน OTP'}</span>
            </button>
          </div>

          <p style={{ color: '#718096', fontSize: '14px' }}>
            หมดเวลา: <strong>{timer}s</strong>
          </p>
        </div>
      </div>
    );
  }

  // STEP 6: SUCCESS
  if (step === 'success') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '40px',
          textAlign: 'center'
        }}>
          {renderProgressBar()}
          <div style={{
            width: '80px',
            height: '80px',
            background: '#4CAF50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '40px'
          }}>
            <Check size={40} color="white" />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A202C', marginBottom: '10px' }}>
            สมัครสำเร็จ!
          </h1>
          <p style={{ fontSize: '16px', color: '#718096', marginBottom: '30px' }}>
            ยินดีต้อนรับเข้าสู่ HaaTee<br />
            คุณสามารถเข้าสู่ระบบได้แล้ว
          </p>

          <button
            onClick={() => onNavigate('login')}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #1976D2, #00BCD4)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            ไปหน้า เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }
}

