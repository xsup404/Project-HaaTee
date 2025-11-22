import React from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Compass,
  Crown,
  Feather,
  Layers,
  Search,
  Shield,
  Sparkles,
  Menu
} from 'lucide-react';
import '../styles/About.css';

const About = ({ onNavigate, onLoginRequired }) => {
  const aboutSections = [
    {
      title: ' About HaaTee',
      subtitle: ' อสังหาฯ ที่เข้าใจคุณกว่าใคร'
    }
  ];

  const storySection = {
    title: 'Our Story',
    content: `HaaTee เป็นแพลตฟอร์มอสังหาริมทรัพย์ที่ออกแบบมาเพื่อแก้ไขความท้าทายที่มีอยู่ในตลาดไทย ตั้งแต่การค้นหาทรัพย์สินที่ลำบาก ความเสี่ยงการถูกหลอก ไปจนถึงการจัดการเอกสารที่ยุ่งยาก

เราคำนึงถึงความต้องการของทุกฝ่ายในการทำธุรกรรมอสังหาริมทรัพย์ จึงสร้าง HaaTee ให้เป็นแพลตฟอร์มที่
- เข้าถึงง่าย ทั้งสำหรับผู้ซื้อ ผู้เช่า เจ้าของทรัพย์ และนายหน้า
- ปลอดภัย ด้วยระบบยืนยันตัวตนและเอกสารดิจิทัลที่ถูกกฎหมาย
- ประเมินประสิทธิภาพได้ ผ่านสถิติและข้อมูลเชิงลึก`
  };

  const missionSection = {
    title: 'Our Mission',
    content: '"ให้อสังหาริมทรัพย์กลายเป็นสิ่งที่เข้าใจแต่ละคน"\n\nเราเชื่อว่าการค้นหาบ้าน ห้องชุด หรือพื้นที่ทำงานที่เหมาะสม ไม่ควรซับซ้อน และการทำธุรกรรมควรเป็นขบวนการที่สะดวก โปร่งใส และไว้วางใจได้'
  };

  const valuesHighlights = [
    {
      title: '🎯 Accessibility – การเข้าถึงที่ง่าย',
      copy: 'เราต้องการให้ทุกคนสามารถใช้แพลตฟอร์มได้อย่างง่ายดาย ไม่ว่าจะมีประสบการณ์ดิจิทัลมากน้อยเพียงใด',
      icon: Compass
    },
    {
      title: '🔒 Transparency – ความโปร่งใส',
      copy: 'ข้อมูลทั้งหมดควรชัดเจน ครบถ้วน และไม่มีการซ่อนเร้น เพื่อให้ผู้ใช้ตัดสินใจได้อย่างมั่นใจ',
      icon: Shield
    },
    {
      title: '💪 Trust – ความไว้วางใจ',
      copy: 'เราป้องกันการลวงแลง ตรวจสอบบัญชีผู้ใช้ และให้หลักฐานเอกสารที่มีประสิทธิภาพ',
      icon: Crown
    }
  ];

  const solutionsForBuyers = [
    { title: 'Smart Filter', desc: 'ค้นหาทรัพย์สินตามเกณฑ์เฉพาะของคุณได้อย่างแม่นยำ' },
    { title: 'Comprehensive Information', desc: 'รูปภาพ แผนที่ รีวิว และรายละเอียดทั้งหมดในที่เดียว' },
    { title: 'Secure Communication', desc: 'สื่อสารกับเจ้าของผ่านแพลตฟอร์มที่ปลอดภัย' },
    { title: 'Digital Contracts', desc: 'เซ็นสัญญาออนไลน์ได้อย่างง่าย ถูกกฎหมาย' },
    { title: 'Save & Alerts', desc: 'บันทึกทรัพย์ที่สนใจและรับแจ้งเตือนทรัพย์ใหม่' }
  ];

  const solutionsForOwners = [
    { title: 'Instant Listing', desc: 'ลงประกาศได้ทันทีโดยไม่ต้องรออนุมัติ' },
    { title: 'Analytics Dashboard', desc: 'ดูสถิติยอดดู ยอดสนใจ ยอดติดต่ออย่างรายละเอียด' },
    { title: 'Auto Re-posting', desc: 'ประกาศหมดอายุหลัง 3 เดือน แต่สามารถรีโพสต์ได้ง่ายๆ' },
    { title: 'Digital Contract Builder', desc: 'สร้างและจัดการสัญญาเช่าจากเทมเพลตที่มีอยู่' },
    { title: 'Centralized Inbox', desc: 'ตอบสนองลูกค้าทั้งหมดในตัวแพลตฟอร์มเดียว' }
  ];

  const solutionsForAdmin = [
    { title: 'User Management', desc: 'ตรวจสอบ ยืนยันตัวตน และจัดการบัญชีผู้ใช้' },
    { title: 'Content Moderation', desc: 'ตรวจสอบประกาศ แชท และรายงานปัญหา' },
    { title: 'System Analytics', desc: 'วิเคราะห์ข้อมูลระบบรวม ผู้ใช้ และการเติบโต' },
    { title: 'Feature Control', desc: 'เปิด/ปิดฟีเจอร์ และสื่อสารกับผู้ใช้ทั้งกลุ่ม' }
  ];

  const ethosValues = [
    {
      icon: CheckCircle,
      title: 'ทำไมต้องเลือก HaaTee',
      copy: 'Instant Listing, Legal E-Contracts, Smart Search, Detailed Analytics, Quality Control, In-Platform Communication, Complete Management'
    }
  ];

  const teamMembers = [
    {
      name: '[ชื่อผู้ก่อตั้ง 1]',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      quote: '[บรรยายสั้นๆ เกี่ยวกับประสบการณ์ เป้าหมาย และเหตุผลในการเริ่ม HaaTee]'
    },
    {
      name: '[ชื่อผู้ก่อตั้ง 2]',
      role: 'Co-Founder & CTO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
      quote: '[บรรยายสั้นๆ เกี่ยวกับประสบการณ์ เป้าหมาย และบทบาทในการพัฒนา HaaTee]'
    },
    {
      name: '[ชื่อผู้ก่อตั้ง 3]',
      role: 'Co-Founder & COO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop',
      quote: '[บรรยายสั้นๆ เกี่ยวกับประสบการณ์ เป้าหมาย และบทบาทในการดำเนินงาน HaaTee]'
    }
  ];

  const partnerLogos = ['Instant Listing', 'Legal E-Contracts', 'Smart Search', 'Detailed Analytics'];

  const impactStats = [
    { number: '', label: 'Listings', desc: 'ทรัพย์สินที่ลงประกาศบน HaaTee' },
    { number: '', label: 'Active Users', desc: 'ผู้ซื้อ ผู้เช่า เจ้าของ และนายหน้า' },
    { number: '', label: 'Growth', desc: 'การเติบโตทั้งปี' },
    { number: '', label: 'Successful Contracts', desc: 'สัญญาดิจิทัลที่ประสบความสำเร็จ' }
  ];

  const futureVisions = [
    { icon: '🏘️', title: 'Neighborhood Insights', desc: 'ข้อมูลเชิงลึกเกี่ยวกับพื้นที่ต่างๆ' },
    { icon: '📱', title: 'Mobile App', desc: 'แอปพลิเคชันมือถือที่ครบครัน' },
    { icon: '🌍', title: 'Regional Expansion', desc: 'ขยายบริการไปสู่ภูมิภาคอื่นๆ' },
    { icon: '💡', title: 'Advanced Features', desc: 'ฟีเจอร์เพิ่มเติมตามความต้องการของผู้ใช้' }
  ];

  return (
    <>
      <header className="header-future">
        <div className="header-container-future">
          <div className="logo-future" onClick={() => onNavigate('home')}>
            <Sparkles size={24} />
            <span>HaaTee</span>
            <span className="logo-badge-future">Beta</span>
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
      <div className="about-luxe-page">

      <section
        className="about-luxe-hero"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1600&h=1200&fit=crop)'
        }}
      >
        <div className="about-luxe-hero__overlay" />
        <div className="about-luxe-container">
          <div className="about-luxe-hero__frame">
            <h1>
              About HaaTee
              <span>อสังหาฯ ที่เข้าใจคุณกว่าใคร</span>
            </h1>
            <p>
              แพลตฟอร์มอสังหาริมทรัพย์ที่ออกแบบมาเพื่อแก้ไขความท้าทายในตลาดไทย พร้อมระบบสัญญาดิจิทัลและความปลอดภัยสูงสุด
            </p>
            <div className="hero-cta">
              <button className="hero-btn primary" onClick={() => onNavigate('properties')}>
                <Search size={18} />
                ค้นหาทรัพย์ตอนนี้
              </button>
              <button className="hero-btn ghost" onClick={() => onNavigate('contact')}>
                ติดต่อเรา
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll</span>
        </div>
      </section>

      <section className="about-luxe-story">
        <div className="about-luxe-container story-grid">
          <div className="story-copy">
            <p className="eyebrow">Our Story</p>
            <h2>
              {storySection.title}
            </h2>
            <p>
              {storySection.content.split('\n\n')[0]}
            </p>
            <p>
              {storySection.content.split('\n\n')[1]}
            </p>
            <ul className="story-pillars">
              {storySection.content.split('- ').slice(1).map((item, idx) => (
                <li key={idx}>
                  <span>{item.split('**')[1] || 'Feature'}</span>
                  <p>{item.split('** ')[1] || item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="story-cards">
            {valuesHighlights.map((item) => (
              <article key={item.title} className="story-card">
                <div className="icon">
                  {item.title.includes('🎯') && <Compass size={22} />}
                  {item.title.includes('🔒') && <Shield size={22} />}
                  {item.title.includes('💪') && <Crown size={22} />}
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-luxe-brands">
        <div className="about-luxe-container">
          <p className="eyebrow">Our Mission</p>
          <h2>
            "ให้อสังหาริมทรัพย์กลายเป็นสิ่งที่เข้าใจแต่ละคน"
          </h2>
          <p className="mission-content">
            เราเชื่อว่าการค้นหาบ้าน ห้องชุด หรือพื้นที่ทำงานที่เหมาะสม ไม่ควรซับซ้อน และการทำธุรกรรมควรเป็นขบวนการที่สะดวก โปร่งใส และไว้วางใจได้
          </p>
        </div>
      </section>

      <section className="about-luxe-magazine">
        <div className="about-luxe-container">
          <div className="magazine-heading">
            <div>
              <p className="eyebrow">Our Solutions</p>
              <h2>
                เพื่อผู้ซื้อและผู้เช่า
                <span>Smart Tools สำหรับการค้นหา ติดต่อ และทำสัญญา</span>
              </h2>
            </div>
          </div>
          <div className="magazine-grid solutions-grid">
            {solutionsForBuyers.map((solution) => (
              <article key={solution.title} className="magazine-card standard">
                <div className="magazine-content">
                  <h3>{solution.title}</h3>
                  <p className="description">{solution.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-luxe-magazine alt">
        <div className="about-luxe-container">
          <div className="magazine-heading">
            <div>
              <p className="eyebrow">Our Solutions</p>
              <h2>
                เพื่อเจ้าของทรัพย์และนายหน้า
                <span>Dashboard และเครื่องมือจัดการประกาศครบวงจร</span>
              </h2>
            </div>
          </div>
          <div className="magazine-grid solutions-grid">
            {solutionsForOwners.map((solution) => (
              <article key={solution.title} className="magazine-card standard">
                <div className="magazine-content">
                  <h3>{solution.title}</h3>
                  <p className="description">{solution.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-luxe-magazine admin">
        <div className="about-luxe-container">
          <div className="magazine-heading">
            <div>
              <p className="eyebrow">Our Solutions</p>
              <h2>
                เพื่อผู้บริหาร
                <span>เครื่องมือควบคุมและวิเคราะห์ระบบ</span>
              </h2>
            </div>
          </div>
          <div className="magazine-grid solutions-grid">
            {solutionsForAdmin.map((solution) => (
              <article key={solution.title} className="magazine-card standard">
                <div className="magazine-content">
                  <h3>{solution.title}</h3>
                  <p className="description">{solution.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-luxe-panels">
        <div className="about-luxe-container">
          <div className="panels-header">
            <div>
              <p className="eyebrow">Why HaaTee?</p>
              <h2>
                ทำไมคุณควรเลือก HaaTee
                <span>ฟีเจอร์และประโยชน์ที่ไม่ได้มีที่ไหน</span>
              </h2>
            </div>
          </div>
          <div className="panels-grid">
            <article className="panel-card primary">
              <div className="panel-stat">✅ Instant Listing</div>
              <p>ลงประกาศได้ทันที ไม่มีการรอ</p>
            </article>
            <article className="panel-card primary">
              <div className="panel-stat">✅ Legal E-Contracts</div>
              <p>สัญญาดิจิทัลที่ถูกกฎหมายและปลอดภัย</p>
            </article>
            <article className="panel-card primary">
              <div className="panel-stat">✅ Smart Search</div>
              <p>ผู้ซื้อหาทรัพย์ที่ตรงใจได้เร็วขึ้น</p>
            </article>
            <article className="panel-card primary">
              <div className="panel-stat">✅ Detailed Analytics</div>
              <p>ข้อมูลเชิงลึกเพื่อปรับปรุงประกาศ</p>
            </article>
            <article className="panel-card primary">
              <div className="panel-stat">✅ Quality Control</div>
              <p>ระบบตรวจสอบคุณภาพเพื่อลดความเสี่ยง</p>
            </article>
            <article className="panel-card primary">
              <div className="panel-stat">✅ In-Platform Communication</div>
              <p>สื่อสารปลอดภัยในตัวแพลตฟอร์ม</p>
            </article>
            <article className="panel-card primary">
              <div className="panel-stat">✅ Complete Management</div>
              <p>บริหารทรัพย์สินอย่างครบวงจรในที่เดียว</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-luxe-impact">
        <div className="about-luxe-container">
          <div className="impact-header">
            <p className="eyebrow">Our Impact</p>
            <h2>ผลลัพธ์ที่วัดได้</h2>
          </div>
          <div className="impact-grid">
            {impactStats.map((stat) => (
              <article key={stat.label} className="impact-card">
                <div className="impact-number-box">
                  <div className="impact-number">{stat.number}</div>
                </div>
                <h3>📊 {stat.label}</h3>
                <p>{stat.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-luxe-ethos">
        <div className="about-luxe-container">
          <div className="ethos-copy">
            <p className="eyebrow">Our Vision for the Future</p>
            <h2>
              🚀 HaaTee ไม่ได้หยุดที่นี่
              <span>เรากำลังพัฒนาฟีเจอร์เพิ่มเติม</span>
            </h2>
            <p>
              HaaTee ยังคงพัฒนาตัวเอง เพื่อให้บริการครอบคลุม และตอบสนองความต้องการของผู้ใช้อย่างไม่สิ้นสุด
            </p>
          </div>
          <div className="ethos-grid">
            {futureVisions.map((vision) => (
              <article key={vision.title} className="ethos-card">
                <div className="icon">{vision.icon}</div>
                <h3>{vision.title}</h3>
                <p>{vision.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-luxe-team">
        <div className="about-luxe-container">
          <div className="team-heading">
            <div>
              <p className="eyebrow">Meet Our Team</p>
              <h2>
                👨‍💼 ผู้บริหารและทีมงาน
                <span>ที่มีประสบการณ์มากมายด้านอสังหาริมทรัพย์</span>
              </h2>
            </div>
            <button className="hero-btn primary" onClick={() => onNavigate('contact')}>
              นัดหมายปรึกษา
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <article key={member.name} className="team-card">
                <div className="portrait" style={{ backgroundImage: `url(${member.image})` }} />
                <div className="team-meta">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                  <p>{member.quote}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-luxe-cta">
        <div className="about-luxe-container cta-grid">
          <div>
            <p className="eyebrow">Get Started Today</p>
            <h2>
              ร่วมเป็นส่วนหนึ่งของ HaaTee<br />
              <span>ไม่ว่าคุณเป็นใครในตลาดอสังหาริมทรัพย์</span>
            </h2>
            
          </div>
          <div className="cta-actions">
            <button className="hero-btn primary" onClick={() => onNavigate('properties')}>
              <Search size={18} />
              เริ่มค้นหาทรัพย์ตอนนี้
            </button>
            <button className="hero-btn primary" onClick={() => onNavigate('contact')}>
              ติดต่อทีมที่ปรึกษา
            </button>
          </div>
        </div>
      </section>

      
      </div>

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
    </>
  );
};

export default About;