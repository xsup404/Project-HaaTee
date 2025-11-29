import React, { useState, useEffect, Component } from 'react';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin/Admin';
import Buyer from './pages/Buyer/Buyer';
import Seller from './pages/Seller/Seller';
import { initializeSellerChats } from './utils/generateSellerChats';
// import AdminTest from './pages/Admin/AdminTest'; // Uncomment to test
import './App.css';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: '#FAFAFA',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            maxWidth: '600px'
          }}>
            <h2 style={{ color: '#D32F2F', marginBottom: '16px' }}>เกิดข้อผิดพลาด</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              มีปัญหาในการโหลดหน้าเว็บ กรุณาลองรีเฟรชหน้าหรือกลับไปหน้าแรก
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              style={{
                padding: '12px 24px',
                background: '#1976D2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              กลับไปหน้าแรก
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  // Load current page from sessionStorage on mount, default to 'home'
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem('currentPage');
    return savedPage || 'home';
  });
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [adminReportTab, setAdminReportTab] = useState('room');
  const [adminActiveTab, setAdminActiveTab] = useState('dashboard');
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Initialize seller chats on app load (only once)
  useEffect(() => {
    // Check if we've already initialized seller chats
    const initialized = localStorage.getItem('seller_chats_initialized');
    if (!initialized) {
      try {
        initializeSellerChats();
        localStorage.setItem('seller_chats_initialized', 'true');
      } catch (e) {
        console.error('Error initializing seller chats:', e);
      }
    }
  }, []);

  // Save current page to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  // Load login state from localStorage on mount
  useEffect(() => {
    const savedLoginState = localStorage.getItem('haatee_login_state');
    if (savedLoginState) {
      try {
        const loginState = JSON.parse(savedLoginState);
        setLoggedInUser(loginState);
        // Only redirect to dashboard if there's a search request from Home
        // Otherwise, stay on current page (restored from sessionStorage)
        const hasSearchFromHome = sessionStorage.getItem('homeSearchParams') || sessionStorage.getItem('previousPageFromHome');
        if (hasSearchFromHome) {
          // If there's a search from Home, navigate to buyer page
          if (loginState.type === 'buyer') {
            setCurrentPage('buyer');
          } else if (loginState.type === 'admin') {
            setCurrentPage('admin');
          } else if (loginState.type === 'seller') {
            setCurrentPage('seller');
          }
        }
        // If no search from Home, keep current page (already restored from sessionStorage)
      } catch (error) {
        console.error('Failed to restore login state:', error);
      }
    }
    // If not logged in, keep current page (already restored from sessionStorage, default to 'home')
  }, []);

  const handleLoginRequired = (action) => {
    setToastMessage(`🔐 กรุณาเข้าสู่ระบบเพื่อ${action}`);
    setShowLoginToast(true);
    setTimeout(() => setShowLoginToast(false), 3000);
  };

  const navigateTo = (page, params = {}) => {
    if (page === 'propertyDetail' && params.property) {
      setSelectedProperty(params.property);
      setPreviousPage(currentPage);
      if (currentPage === 'admin') {
        setAdminActiveTab(params.activeTab || 'dashboard');
      }
      if (params.reportTab) {
        setAdminReportTab(params.reportTab);
      }
    }
    if (page === 'userProfile' && params.userId) {
      setSelectedUserId(params.userId);
      setPreviousPage(currentPage);
      if (currentPage === 'admin') {
        setAdminActiveTab(params.activeTab || 'dashboard');
      }
      if (params.reportTab) {
        setAdminReportTab(params.reportTab);
      }
    }
    setCurrentPage(page);
    // Save to sessionStorage immediately
    sessionStorage.setItem('currentPage', page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
    localStorage.setItem('haatee_login_state', JSON.stringify(userData));
    // Navigate to appropriate dashboard
    if (userData.type === 'admin') {
      setCurrentPage('admin');
    } else if (userData.type === 'seller') {
      setCurrentPage('seller');
    } else if (userData.type === 'buyer') {
      setCurrentPage('buyer');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('haatee_login_state');
    setCurrentPage('home');
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        {currentPage === 'home' && <Home onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
        {currentPage === 'properties' && (
          <ErrorBoundary>
            <Properties onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />
          </ErrorBoundary>
        )}
        {currentPage === 'propertyDetail' && <PropertyDetail property={selectedProperty} previousPage={previousPage} adminReportTab={adminReportTab} adminActiveTab={adminActiveTab} onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
        {currentPage === 'userProfile' && <UserProfile userId={selectedUserId} previousPage={previousPage} adminReportTab={adminReportTab} adminActiveTab={adminActiveTab} onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
        {currentPage === 'about' && <About onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
        {currentPage === 'contact' && <Contact onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
        {currentPage === 'login' && <Login onNavigate={navigateTo} onLogin={handleLogin} />}
        {currentPage === 'register' && <Register onNavigate={navigateTo} />}
        {currentPage === 'admin' && <Admin onNavigate={navigateTo} onLogout={handleLogout} adminReportTab={adminReportTab} setAdminReportTab={setAdminReportTab} adminActiveTab={adminActiveTab} setAdminActiveTab={setAdminActiveTab} />}
        {currentPage === 'buyer' && <Buyer onNavigate={navigateTo} onLoginRequired={handleLoginRequired} onLogout={handleLogout} />}
        {currentPage === 'seller' && <Seller onNavigate={navigateTo} onLoginRequired={handleLoginRequired} onLogout={handleLogout} />}

        {showLoginToast && (
          <div className="toast">
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;