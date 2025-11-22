import React, { useState, useEffect, useRef } from 'react';
import '../styles/Login.css';

export default function Login({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('user');
  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const otpRefs = useRef([]);

  // Admin Credentials
  const ADMIN_CREDENTIALS = {
    'admin@haatee.com': '123456',
    'admin123': '123456',
  };

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  // User Login Handler
  const handleUserLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: '⚠️ กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: '⚠️ รูปแบบอีเมลไม่ถูกต้อง' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setMessage({ type: 'success', text: '✅ ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว' });
      setTimeout(() => {
        setStep('otp');
        setTimer(120);
        setMessage({ type: '', text: '' });
        setLoading(false);
        setLoginType('user');
        otpRefs.current[0]?.focus();
      }, 1500);
    }, 1200);
  };

  // Admin Login Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!adminId.trim() || !adminPassword.trim()) {
      setMessage({ type: 'error', text: '⚠️ กรุณากรอก Admin ID และรหัสผ่าน' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (ADMIN_CREDENTIALS[adminId] === adminPassword) {
        setMessage({ type: 'success', text: '✅ ส่งรหัส OTP ไปยังอีเมลแล้ว' });
        setTimeout(() => {
          setStep('otp');
          setTimer(120);
          setMessage({ type: '', text: '' });
          setLoading(false);
          setLoginType('admin');
          otpRefs.current[0]?.focus();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: '❌ Admin ID หรือรหัสผ่านไม่ถูกต้อง' });
        setLoading(false);
      }
    }, 1200);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (!otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    otpRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setMessage({ type: 'error', text: '⚠️ กรุณากรอกรหัส OTP 6 หลักให้ครบถ้วน' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (otpValue === '123456') {
        setMessage({ type: 'success', text: '✅ ยืนยันสำเร็จ! กำลังเข้าสู่ระบบ...' });
        setTimeout(() => {
          setStep('success');
          setLoading(false);
          setTimeout(() => {
            if (loginType === 'admin') {
              // บันทึก Admin User
              const adminData = {
                name: adminId === 'admin@haatee.com' ? 'Admin HaaTee' : 'Admin Manager',
                email: adminId,
                role: 'System Administrator',
                lastLogin: new Date().toLocaleString('th-TH')
              };
              localStorage.setItem('adminUser', JSON.stringify(adminData));
              console.log('Admin login successful, navigating to admin page', { loginType, adminId });
              alert('เข้าสู่ระบบ Admin สำเร็จ!');
              onNavigate('admin');
            } else {
              console.log('User login successful, navigating to home page', { loginType });
              alert('เข้าสู่ระบบ HaaTee สำเร็จ!');
              onNavigate('home');
            }
          }, 2000);
        }, 1200);
      } else {
        setMessage({ type: 'error', text: '⚠️ รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง (ทดสอบ: 123456)' });
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        setLoading(false);
      }
    }, 1200);
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(120);
    setMessage({ type: 'success', text: '📧 ส่งรหัส OTP ใหม่ไปยังอีเมลของคุณแล้ว' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (step === 'credentials') {
    return (
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-visual" style={{
            backgroundImage: 'url(/A.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="visual-overlay" style={{
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.3) 0%, rgba(0, 188, 212, 0.3) 100%)',
              backdropFilter: 'blur(2px)'
            }}></div>
          </div>

          <div className="auth-form-section">
            <div className="form-container">
              <div className="form-header">
                <div className="mobile-brand">
                  <div className="mobile-logo">🏠</div>
                  <h2 className="mobile-brand-name">HaaTee</h2>
                </div>
                <h1 className="form-title">เข้าสู่ระบบ</h1>
                <p className="form-subtitle">ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
              </div>

              {/* Tabs */}
              <div className="login-tabs" style={{
                display: 'flex',
                gap: '0',
                borderBottom: '2px solid var(--border)',
                marginBottom: 'var(--space-lg)'
              }}>
                <button
                  className={activeTab === 'user' ? 'tab-btn active' : 'tab-btn'}
                  onClick={() => {
                    setActiveTab('user');
                    setMessage({ type: '', text: '' });
                  }}
                  style={{
                    padding: '14px 24px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'user' ? '4px solid var(--primary)' : '4px solid transparent',
                    cursor: 'pointer',
                    fontWeight: '700',
                    color: activeTab === 'user' ? 'var(--primary)' : 'var(--text-gray)',
                    fontSize: '14px',
                    transition: 'all var(--transition)'
                  }}
                >
                  👤 ผู้ใช้ทั่วไป
                </button>
                <button
                  className={activeTab === 'admin' ? 'tab-btn active' : 'tab-btn'}
                  onClick={() => {
                    setActiveTab('admin');
                    setMessage({ type: '', text: '' });
                  }}
                  style={{
                    padding: '14px 24px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'admin' ? '4px solid var(--primary)' : '4px solid transparent',
                    cursor: 'pointer',
                    fontWeight: '700',
                    color: activeTab === 'admin' ? 'var(--primary)' : 'var(--text-gray)',
                    fontSize: '14px',
                    transition: 'all var(--transition)'
                  }}
                >
                  🛡️ Admin
                </button>
              </div>

              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  <span className="alert-icon">{message.type === 'error' ? '⚠️' : '✅'}</span>
                  <span className="alert-text">{message.text}</span>
                </div>
              )}

              {/* User Login Form */}
              {activeTab === 'user' && (
                <form onSubmit={handleUserLogin} className="login-form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      อีเมล <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">📧</span>
                      <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="กรุณากรอกอีเมลของคุณ"
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      รหัสผ่าน <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรุณากรอกรหัสผ่าน"
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="checkbox-label">จดจำฉันไว้</span>
                    </label>
                    <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                      ลืมรหัสผ่าน?
                    </a>
                  </div>

                  <button type="submit" className="btn-login" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>กำลังตรวจสอบ...</span>
                      </>
                    ) : (
                      <>
                        <span>🔐</span>
                        <span>เข้าสู่ระบบ</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Admin Login Form */}
              {activeTab === 'admin' && (
                <form onSubmit={handleAdminLogin} className="login-form">
                  <div style={{
                    padding: '12px 14px',
                    background: 'transparent',
                    border: '1px solid rgba(25, 118, 210, 0.15)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '12px',
                    fontSize: '11px',
                    color: 'var(--text-dark)',
                    lineHeight: '1.4'
                  }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '700' }}>💡 ทดสอบ:</p>
                    <p style={{ margin: '2px 0' }}>🆔 <code style={{ background: 'rgba(0,0,0,0.1)', padding: '1px 4px', borderRadius: '2px' }}>admin@haatee.com</code></p>
                    <p style={{ margin: '2px 0' }}>🔐 <code style={{ background: 'rgba(0,0,0,0.1)', padding: '1px 4px', borderRadius: '2px' }}>123456</code></p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminId" className="form-label">
                      Admin ID / Email <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">🆔</span>
                      <input
                        id="adminId"
                        type="text"
                        className="form-input"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        placeholder="admin@haatee.com"
                        disabled={loading}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminPassword" className="form-label">
                      รหัสผ่าน <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        id="adminPassword"
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="กรุณากรอกรหัสผ่าน"
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-login" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>กำลังตรวจสอบ...</span>
                      </>
                    ) : (
                      <>
                        <span>🔐</span>
                        <span>เข้าสู่ระบบ Admin</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="form-footer">
                <p className="footer-text">
                  ยังไม่มีบัญชี?{' '}
                  <a onClick={() => onNavigate('register')} className="link-register">
                    สมัครสมาชิกเลย
                  </a>
                </p>
                <p className="terms-text">
                  การเข้าสู่ระบบถือว่าคุณยอมรับ{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>เงื่อนไขการใช้งาน</a>
                  {' '}และ{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>นโยบายความเป็นส่วนตัว</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-visual" style={{
            backgroundImage: 'url(/A.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="visual-overlay" style={{
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.3) 0%, rgba(0, 188, 212, 0.3) 100%)',
              backdropFilter: 'blur(2px)'
            }}></div>
          </div>

          <div className="auth-form-section">
            <div className="form-container">
              <button onClick={() => {
                setStep('credentials');
                setOtp(['', '', '', '', '', '']);
                setMessage({ type: '', text: '' });
              }} className="btn-back">
                <span>←</span>
                <span>กลับ</span>
              </button>

              <div className="form-header">
                <div className="mobile-brand">
                  <div className="mobile-logo">🔐</div>
                </div>
                <h1 className="form-title">ยืนยันตัวตน</h1>
                <p className="form-subtitle">
                  เราได้ส่งรหัส OTP 6 หลักไปยัง<br />
                  <strong>{loginType === 'admin' ? adminId : email}</strong>
                </p>
              </div>

              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  <span className="alert-icon">{message.type === 'error' ? '⚠️' : '✅'}</span>
                  <span className="alert-text">{message.text}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="otp-form">
                <div className="form-group">
                  <label className="form-label">
                    รหัส OTP 6 หลัก <span className="required">*</span>
                  </label>
                  <div className="otp-inputs" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="otp-input"
                        placeholder="•"
                        disabled={loading}
                        autoComplete="off"
                      />
                    ))}
                  </div>
                </div>

                <div className="timer-container">
                  <div className="timer-display">
                    <span className="timer-icon">⏱️</span>
                    <span className="timer-label">หมดอายุใน:</span>
                    <span className="timer-value">{formatTime()}</span>
                  </div>
                </div>

                <button type="submit" className="btn-verify" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>กำลังยืนยัน...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>ยืนยัน OTP</span>
                    </>
                  )}
                </button>
              </form>

              <div className="resend-section">
                <p className="resend-text">ไม่ได้รับรหัส OTP?</p>
                {timer <= 0 ? (
                  <button onClick={handleResendOtp} className="btn-resend">
                    <span>📧</span>
                    <span>ส่งรหัสใหม่อีกครั้ง</span>
                  </button>
                ) : (
                  <p className="wait-text">
                    กรุณารอ <strong>{formatTime()}</strong> เพื่อส่งรหัสใหม่
                  </p>
                )}
              </div>

              <div className="security-note">
                <p>
                  <span className="note-icon">🔒</span>
                  รหัส OTP จะหมดอายุใน 2 นาที และใช้ได้เพียงครั้งเดียวเท่านั้น
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-visual" style={{
          backgroundImage: 'url(/A.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="visual-overlay" style={{
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.3) 0%, rgba(0, 188, 212, 0.3) 100%)',
            backdropFilter: 'blur(2px)'
          }}></div>
        </div>

        <div className="auth-form-section">
          <div className="form-container success-container">
            <div className="success-animation">
              <div className="success-checkmark">✓</div>
            </div>
            <h1 className="success-title">เข้าสู่ระบบสำเร็จ!</h1>
            <p className="success-subtitle">ยินดีต้อนรับกลับสู่ HaaTee</p>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
            <p className="redirect-text">กำลังนำคุณเข้าสู่หน้าหลัก...</p>
          </div>
        </div>
      </div>
    </div>
  );
}