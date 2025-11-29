import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield, User, Building2 } from 'lucide-react';
import '../styles/Login.css';

export default function Login({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('login');
  const [timer, setTimer] = useState(120);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('buyer');
  const [usersData, setUsersData] = useState([]);
  const [buyersData, setBuyersData] = useState([]);
  const otpRefs = useRef([]);

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const [sellersRes, buyersRes] = await Promise.all([
          fetch('/src/data/users.json'),
          fetch('/src/data/buyers.json')
        ]);
        const sellers = await sellersRes.json();
        const buyers = await buyersRes.json();
        setUsersData(sellers);
        setBuyersData(buyers);
      } catch (error) {
        console.error('Failed to load users data:', error);
      }
    };
    loadUsersData();
  }, []);

  const CREDENTIALS = {
    admin: {
      'admin@haatee.com': 'admin123456',
      'admin123': 'admin123456',
    },
    buyer: buyersData.reduce((acc, buyer) => {
      acc[buyer.email] = 'buyer123456';
      return acc;
    }, {}),
    seller: usersData.reduce((acc, user) => {
      acc[user.email] = 'seller123456';
      return acc;
    }, {})
  };

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }

    if (userType !== 'admin') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage({ type: 'error', text: 'รูปแบบอีเมลไม่ถูกต้อง' });
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      if (CREDENTIALS[userType][email] === password) {
        setMessage({ type: 'success', text: 'ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว' });
        setTimeout(() => {
          setStep('otp');
          setTimer(120);
          setMessage({ type: '', text: '' });
          setLoading(false);
          otpRefs.current[0]?.focus();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
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
      setMessage({ type: 'error', text: 'กรุณากรอกรหัส OTP 6 หลักให้ครบถ้วน' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (otpValue === '123456') {
        setMessage({ type: 'success', text: 'ยืนยันสำเร็จ! กำลังเข้าสู่ระบบ...' });
        setTimeout(() => {
          setStep('success');
          setLoading(false);
          setTimeout(() => {
            const userData = {
              email: email,
              type: userType,
              role: userType === 'admin' ? 'System Administrator' : userType === 'seller' ? 'seller' : 'Buyer',
              lastLogin: new Date().toLocaleString('th-TH')
            };

            if (onLogin) onLogin(userData);

            if (userType === 'admin') {
              localStorage.setItem('adminUser', JSON.stringify(userData));
              onNavigate('admin');
            } else if (userType === 'seller') {
              localStorage.setItem('sellerUser', JSON.stringify(userData));
              localStorage.setItem('sellerEmail', email);
              onNavigate('seller');
            } else {
              localStorage.setItem('buyerUser', JSON.stringify(userData));
              localStorage.setItem('buyerEmail', email);
              onNavigate('buyer');
            }
          }, 2000);
        }, 1200);
      } else {
        setMessage({ type: 'error', text: 'รหัส OTP ไม่ถูกต้อง (ทดสอบ: 123456)' });
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        setLoading(false);
      }
    }, 1200);
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(120);
    setMessage({ type: 'success', text: 'ส่งรหัส OTP ใหม่ไปยังอีเมลของคุณแล้ว' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTestCredentials = () => {
    switch(userType) {
      case 'admin':
        return { email: 'admin@haatee.com', password: 'admin123456' };
      case 'seller':
        return { email: 'damrong@haatee.com', password: 'seller123456' };
      default:
        return { email: 'buyer@haatee.com', password: 'buyer123456' };
    }
  };

  if (step === 'login') {
    const testCreds = getTestCredentials();

    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-visual" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=1600&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="visual-overlay"></div>
            </div>
          </div>

          <div className="login-right">
            <div className="login-form-container">
              <button className="btn-back-home" onClick={() => onNavigate('home')}>
                <ArrowLeft size={20} />
                <span>กลับหน้าหลัก</span>
              </button>

              <div className="login-header">
                <h2 className="login-title">เข้าสู่ระบบ</h2>
                <p className="login-subtitle">เลือกประเภทผู้ใช้และเข้าสู่ระบบ</p>
              </div>

              <div className="user-type-selector">
                <button
                  className={`type-btn ${userType === 'buyer' ? 'active' : ''}`}
                  onClick={() => {
                    setUserType('buyer');
                    setEmail('');
                    setPassword('');
                    setMessage({ type: '', text: '' });
                  }}
                >
                  <User size={20} />
                  <span>ผู้ซื้อ</span>
                </button>
                <button
                  className={`type-btn ${userType === 'seller' ? 'active' : ''}`}
                  onClick={() => {
                    setUserType('seller');
                    setEmail('');
                    setPassword('');
                    setMessage({ type: '', text: '' });
                  }}
                >
                  <Building2 size={20} />
                  <span>เจ้าของทรัพย์</span>
                </button>
                <button
                  className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                  onClick={() => {
                    setUserType('admin');
                    setEmail('');
                    setPassword('');
                    setMessage({ type: '', text: '' });
                  }}
                >
                  <Shield size={20} />
                  <span>Admin</span>
                </button>
              </div>

              {message.text && (
                <div className={`message message-${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label className="form-label">
                    {userType === 'admin' ? 'Admin ID / Email' : 'อีเมล'}
                  </label>
                  <div className="input-group">
                    <Mail size={20} className="input-icon" />
                    <input
                      type={userType === 'admin' ? 'text' : 'email'}
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={userType === 'admin' ? 'admin@haatee.com' : 'your@email.com'}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">รหัสผ่าน</label>
                  <div className="input-group">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-footer">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>จดจำฉันไว้</span>
                  </label>
                  <button type="button" className="forgot-password">
                    ลืมรหัสผ่าน?
                  </button>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>กำลังตรวจสอบ...</span>
                    </>
                  ) : (
                    <span>เข้าสู่ระบบ</span>
                  )}
                </button>
              </form>

              <div className="register-section">
                <p>
                  ยังไม่มีบัญชี?{' '}
                  <button onClick={() => onNavigate('register')} className="link-register">
                    สมัครสมาชิก
                  </button>
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
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-visual" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=1600&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="visual-overlay"></div>
            </div>
          </div>

          <div className="login-right">
            <div className="login-form-container">
              <button
                className="btn-back-home"
                onClick={() => {
                  setStep('login');
                  setOtp(['', '', '', '', '', '']);
                  setMessage({ type: '', text: '' });
                }}
              >
                <ArrowLeft size={20} />
                <span>กลับ</span>
              </button>

              <div className="login-header">
                <div className="otp-icon">🔐</div>
                <h2 className="login-title">ยืนยันตัวตน</h2>
                <p className="login-subtitle">
                  เราได้ส่งรหัส OTP 6 หลักไปยัง<br />
                  <strong>{email}</strong>
                </p>
              </div>

              {message.text && (
                <div className={`message message-${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="otp-form">
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
                      disabled={loading}
                    />
                  ))}
                </div>

                <div className="timer-display">
                  <span>รหัสหมดอายุใน {formatTime()}</span>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>กำลังยืนยัน...</span>
                    </>
                  ) : (
                    <span>ยืนยัน OTP</span>
                  )}
                </button>

                <div className="resend-section">
                  {timer <= 0 ? (
                    <button type="button" onClick={handleResendOtp} className="btn-resend">
                      ส่งรหัสใหม่อีกครั้ง
                    </button>
                  ) : (
                    <p className="resend-text">
                      ไม่ได้รับรหัส? รอ {formatTime()} เพื่อส่งใหม่
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-visual" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=1600&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="visual-overlay"></div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container success-container">
            <div className="success-icon">✓</div>
            <h2 className="success-title">เข้าสู่ระบบสำเร็จ!</h2>
            <p className="success-subtitle">ยินดีต้อนรับกลับสู่ HaaTee</p>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
