import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FooterC from './FooterC';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.userType === 'Customer') return '/customer-home';
    if (user.userType === 'Agent') return '/agent-home';
    if (user.userType === 'Admin') return '/admin-home';
    return '/';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate(getHomeLink())}>ResolveNow</div>
          <div className="navbar-links">
            <span 
              className={`nav-link ${isActive('/') || isActive('/customer-home') || isActive('/agent-home') || isActive('/admin-home') ? 'active' : ''}`} 
              style={{ cursor: 'pointer' }} 
              onClick={() => navigate(getHomeLink())}
            >
              Home
            </span>
            {user ? (
              <span 
                className={`nav-link ${isActive('/update-profile') ? 'active' : ''}`} 
                style={{ cursor: 'pointer' }} 
                onClick={() => navigate('/update-profile')}
              >
                Profile
              </span>
            ) : (
              <>
                <span 
                  className={`nav-link ${isActive('/signup') ? 'active' : ''}`} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => navigate('/signup')}
                >
                  SignUp
                </span>
                <span 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => navigate('/login')}
                >
                  Login
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-image">
            <div className="illustration-placeholder">
              <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                {/* Customer service illustration */}
                <circle cx="250" cy="200" r="150" fill="#E8F4F8"/>
                <rect x="150" y="250" width="200" height="120" rx="10" fill="#4A90E2"/>
                <circle cx="250" cy="150" r="50" fill="#F5A623"/>
                <path d="M 220 150 Q 220 140 230 140 Q 240 140 240 150" stroke="#333" strokeWidth="3" fill="none"/>
                <path d="M 260 150 Q 260 140 270 140 Q 280 140 280 150" stroke="#333" strokeWidth="3" fill="none"/>
                <path d="M 230 170 Q 250 180 270 170" stroke="#333" strokeWidth="3" fill="none"/>
                <rect x="180" y="280" width="140" height="15" rx="7" fill="#FFF" opacity="0.7"/>
                <rect x="180" y="305" width="100" height="15" rx="7" fill="#FFF" opacity="0.5"/>
                <circle cx="400" cy="100" r="30" fill="#7ED321" opacity="0.6"/>
                <circle cx="100" cy="300" r="25" fill="#F8E71C" opacity="0.6"/>
                <path d="M 380 200 L 390 210 L 410 190" stroke="#4A90E2" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">Empower Your Team,</h1>
            <p className="hero-subtitle">
              Exceed Customer Expectations: Discover our Complaint Management Solution
            </p>
            <button 
              className="cta-button"
              onClick={() => navigate(user ? getHomeLink() : '/signup')}
            >
              {user ? 'Go to Dashboard' : 'Register your Complaint'}
            </button>
          </div>
        </div>
      </section>
      <FooterC />
    </div>
  );
};

export default Home;