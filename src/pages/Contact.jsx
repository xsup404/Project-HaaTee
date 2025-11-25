import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Headphones,
  Menu
} from 'lucide-react';

import '../styles/Contact.css';

const Contact = ({ onNavigate, onLoginRequired }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactStats = [
    { value: '≤3 ปี', label: 'E-Contract พร้อมใช้' },
    { value: '24/7', label: 'Concierge Team' },
    { value: '15 นาที', label: 'เวลาตอบกลับเฉลี่ย' }
  ];

  const touchPoints = [
    {
      icon: Phone,
      label: 'โทรหาเรา',
      value: '02-XXX-XXXX',
    },
    {
      icon: MessageCircle,
      label: 'Line Official',
      value: '@haatee',
    },
    {
      icon: Mail,
      label: 'อีเมล',
      value: 'support@haatee.com',
    },
    {
      icon: MapPin,
      label: 'สำนักงาน',
      value: '999/99 อาคาร Example Tower',
      note: '09:00-18:00 น. (จันทร์-ศุกร์)'
    }
  ];

  const supportHighlights = [
    {
      icon: Shield,
      title: 'ทีมสัญญาดิจิทัล',
      copy: 'ดูแลการออก E-Contract ≤3 ปี และยืนยันตัวตนทุกคู่สัญญา',
      cta: 'ดูขั้นตอน',
      action: () => onNavigate('properties')
    },
    {
      icon: Headphones,
      title: 'Concierge ส่วนตัว',
      copy: 'ให้คำแนะนำการลงประกาศหรือคัดเลือกทรัพย์แบบ one-on-one',
      cta: 'จองเวลา',
      action: () => onNavigate('contact')
    },
    {
      icon: Sparkles,
      title: 'ช่วยเหลือการลงประกาศ',
      copy: 'ช่วยปรับภาพและคัดคำสำคัญให้ประกาศของคุณโดดเด่น',
      cta: 'รับคู่มือ',
      action: () => onNavigate('properties')
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-page-luxe">
      <header className="header-future">
        <div className="header-container-future">
          <div className="logo-future" onClick={() => onNavigate('home')}>
            <Sparkles size={24} />
            <span>HaaTee</span>
          </div>

          <nav className="nav-menu-future">
            <button className="nav-link-future" onClick={() => onNavigate('properties')}>
              ค้นหาทรัพย์สิน
            </button>
            <button className="nav-link-future" onClick={() => onNavigate('about')}>
              เกี่ยวกับเรา
            </button>
            <button className="nav-link-future" onClick={() => onNavigate('contact')}>
              ติดต่อเรา
            </button>
            <button className="nav-cta-future" onClick={() => onNavigate('login')}>
              เข้าสู่ระบบ
            </button>
          </nav>

          <button className="menu-toggle-future">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <section className="contact-hero-luxe">
        <div className="contact-hero-glow" />
        <div className="contact-hero-inner">
          <div className="contact-hero-content">
            <h1>คุยกับทีมเราได้ทุกช่องทาง</h1>
            <p>
              ต้องการความช่วยเหลือหรือมีคำถาม? ทีม HaaTee พร้อมตอบรับคุณผ่านหลายช่องทาง
            </p>
            <div className="contact-hero-stats">
              {contactStats.map((stat) => (
                <div key={stat.label}>
                  <span className="value">{stat.value}</span>
                  <span className="label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="contact-hero-board">
            <div className="hero-card primary">
              <h3>E-Contract Desk</h3>
              <p>สัญญาดิจิทัล ≤3 ปี ทำสัญญาสะดวก ปลอดภัย ถูกกฎหมาย</p>
              <button onClick={() => onNavigate('properties')}>
                ขั้นตอนสัญญา
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="hero-card secondary">
              <h3>Concierge</h3>
              <p>โทรหรือแชทเมื่อไรก็ได้ ทีมจริงตอบกลับ ไม่ใช่แค่บอต</p>
              <span>02-123-4567</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-panel-luxe">
        <div className="contact-panel-grid">
          <div className="contact-form-card">
            <div className="card-header">
              <h2>ฝากข้อความสั้น ๆ</h2>
            </div>

            <div className="form-wrapper-future">
              {isSubmitted && (
                <div className="success-message-future">
                  <CheckCircle size={24} />
                  <div>
                    <h4>ส่งข้อความสำเร็จ!</h4>
                    <p>ทีมงานกำลังติดต่อกลับไปหาคุณ</p>
                  </div>
                </div>
              )}

              <form className="contact-form-future" onSubmit={handleSubmit}>
                <div className="form-row-future">
                  <div className="form-group-future">
                    <label htmlFor="name">ชื่อ - นามสกุล *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="ชื่อ-นามสกุล"
                      required
                    />
                  </div>
                  <div className="form-group-future">
                    <label htmlFor="email">อีเมล *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-future">
                  <div className="form-group-future">
                    <label htmlFor="phone">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0xx-xxx-xxxx"
                      required
                    />
                  </div>
                  <div className="form-group-future">
                    <label htmlFor="subject">หัวข้อ *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="เรื่องที่ต้องการติดต่อ"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-future full-future">
                  <label htmlFor="message">ข้อความ *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="เขียนข้อความของคุณที่นี่..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-future btn-primary-future submit-btn-future">
                  <Send size={20} />
                  <span>ส่งข้อความ</span>
                </button>
              </form>
            </div>
          </div>

          <div className="contact-info-stack">
            <div className="info-feature">
              <div>
                <p>HaaTee Assistance</p>
                <h3>เลือกช่องทางที่คุณถนัด แล้วเริ่มคุยกับเรา</h3>
              </div>
              
            </div>

            <div className="info-grid">
              {touchPoints.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="info-card">
                    <div className="icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p>{item.label}</p>
                      <h4>{item.value}</h4>
                      <span>{item.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="info-meta">
              <div>
                <span>เวลาทำการ</span>
                <p>09.00 - 22.00 น. </p>
              </div>
              <div>
                <span>ศูนย์ตรวจเอกสาร</span>
                <p>ชั้น 12 อาคาร T-One, BTS ทองหล่อ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-support-luxe">
        <div className="contact-support-grid">
          {supportHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="support-card">
                <div className="support-icon">
                  <Icon size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <button onClick={item.action}>
                  {item.cta}
                  <ArrowRight size={14} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="contact-cta-banner">
        <div className="cta-badge">Ready 24/7</div>
        <h2>อยากเริ่มต้นประกาศหรือหาทรัพย์เลยไหม?</h2>
        <p>ติดต่อเราได้ทุกเมื่อที่คุณต้องการ</p>
        <div className="cta-actions">
          <button className="hero-btn primary" onClick={() => onNavigate('properties')}>
            <Phone size={18} />
            โทร 02-123-4567
          </button>
          <button className="hero-btn outline" onClick={() => onNavigate('contact')}>
            <MessageCircle size={18} />
            ส่งข้อความหาเรา
          </button>
        </div>
      </section>

      <footer className="footer-future">
        <div className="container-future">
          <div className="footer-grid-future">
            <div className="footer-col-future footer-about-future">
              <div className="footer-logo-future">
                <Sparkles size={24} />
                <span>HaaTee</span>
              </div>
              <p className="footer-desc-future">
                แพลตฟอร์มอสังหาริมทรัพย์ที่ทันสมัยและน่าเชื่อถือที่สุดในประเทศไทย
                พร้อมระบบสัญญาดิจิทัลและการยืนยันตัวตนที่ปลอดภัย
              </p>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">เมนูหลัก</h5>
              <ul className="footer-links-future">
                <li><button onClick={() => onNavigate('home')}>หน้าแรก</button></li>
                <li><button onClick={() => onNavigate('properties')}>ค้นหาทรัพย์สิน</button></li>
                <li><button onClick={() => onNavigate('about')}>เกี่ยวกับเรา</button></li>
                <li><button onClick={() => onNavigate('contact')}>ติดต่อเรา</button></li>
                <li><button onClick={() => onNavigate('login')}>เข้าสู่ระบบ</button></li>
              </ul>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">ประเภททรัพย์สิน</h5>
              <ul className="footer-links-future">
                <li><button onClick={() => onNavigate('properties')}>บ้านเดี่ยว</button></li>
                <li><button onClick={() => onNavigate('properties')}>คอนโดมิเนียม</button></li>
                <li><button onClick={() => onNavigate('properties')}>ทาวน์เฮาส์</button></li>
                <li><button onClick={() => onNavigate('properties')}>อาคารพาณิชย์</button></li>
              </ul>
            </div>

            <div className="footer-col-future">
              <h5 className="footer-title-future">ติดต่อเรา</h5>
              <ul className="footer-links-future">
                <li><button>support@haatee.com</button></li>
                <li><button>02-xxx-xxxx</button></li>
                <li><button>Facebook</button></li>
                <li><button>Line @haatee</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-future">
            <p>&copy; 2025 HaaTee. All rights reserved.</p>
            <div className="footer-links-bottom-future">
              <button>Privacy Policy</button>
              <button>Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
