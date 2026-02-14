import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import FooterC from './FooterC';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Navigate based on user type
      if (user.userType === 'Customer') {
        navigate('/customer-home');
      } else if (user.userType === 'Agent') {
        navigate('/agent-home');
      } else if (user.userType === 'Admin') {
        navigate('/admin-home');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => navigate('/')}>ResolveNow</div>
          <div className="navbar-links">
            <span className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>Home</span>
            <span className={`nav-link ${isActive('/signup') ? 'active' : ''}`} onClick={() => navigate('/signup')}>SignUp</span>
            <span className={`nav-link ${isActive('/login') ? 'active' : ''}`} onClick={() => navigate('/login')}>LogIn</span>
          </div>
        </div>
      </nav>

      <div className="auth-content" style={{ flex: 1 }}>
        <div className="auth-card">
          <h2 className="auth-title">Login For Registering the Complaint</h2>
          <p className="auth-subtitle">Please enter your credentials</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>SignUp</a></p>
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
};

export default Login;