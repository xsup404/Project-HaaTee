import React, { useState } from 'react';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin/Admin';
import Buyer from './pages/Buyer/Buyer';
import Seller from './pages/Seller/Seller';
// import AdminTest from './pages/Admin/AdminTest'; // Uncomment to test
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLoginRequired = (action) => {
    setToastMessage(`🔐 กรุณาเข้าสู่ระบบเพื่อ${action}`);
    setShowLoginToast(true);
    setTimeout(() => setShowLoginToast(false), 3000);
  };

  const navigateTo = (page, params = {}) => {
    if (page === 'propertyDetail' && params.property) {
      setSelectedProperty(params.property);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      {currentPage === 'home' && <Home onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
      {currentPage === 'properties' && <Properties onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
      {currentPage === 'propertyDetail' && <PropertyDetail property={selectedProperty} onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
      {currentPage === 'about' && <About onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
      {currentPage === 'contact' && <Contact onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
      {currentPage === 'login' && <Login onNavigate={navigateTo} />}
      {currentPage === 'register' && <Register onNavigate={navigateTo} />}
      {currentPage === 'admin' && <Admin onNavigate={navigateTo} />}
      {currentPage === 'buyer' && <Buyer onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}
      {currentPage === 'seller' && <Seller onNavigate={navigateTo} onLoginRequired={handleLoginRequired} />}

      {showLoginToast && (
        <div className="toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;