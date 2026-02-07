import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const SignUp = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'Customer'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate phone number
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword: _confirmPassword, ...dataToSend } = formData;
      const response = await axios.post('http://localhost:5000/api/auth/register', dataToSend);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Registration successful but automatic login failed. Please login manually.');
      }

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        // Navigate based on user type
        if (user.userType === 'Customer') {
          onNavigate('customer-home');
        } else if (user.userType === 'Agent') {
          onNavigate('agent-home');
        } else if (user.userType === 'Admin') {
          onNavigate('admin-home');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <nav className="auth-navbar">
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => onNavigate('home')}>ResolveNow</div>
          <div className="navbar-links">
            <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
            <a href="#signup" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}>SignUp</a>
            <a href="#login" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>LogIn</a>
          </div>
        </div>
      </nav>

      <div className="auth-content">
        <div className="auth-card">
          <h2 className="auth-title">SignUp For Registering the Complaint</h2>
          <p className="auth-subtitle">Please enter your details</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="userType">User Type</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="Customer">Customer</option>
                <option value="Agent">Agent</option>
                <option value="Admin">Admin</option>
              </select>
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
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'SignUp'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>LogIn</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;