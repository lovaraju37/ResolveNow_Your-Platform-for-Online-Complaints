import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import UserDropdown from './UserDropdown';
import FooterC from './FooterC';
import './Auth.css';

const Profile = ({ onUpdate }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isStandalonePage = location.pathname === '/update-profile';
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        userType: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    userType: res.data.userType || ''
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile',err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/users/profile', 
                { 
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Profile updated successfully!');
            
            // Update local storage user data (excluding password/sensitive info if any)
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            // Notify parent if needed (to update Navbar name etc)
            if (onUpdate) onUpdate(updatedUser);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const labelStyle = {
        color: '#34495e',
        fontWeight: '500',
        marginBottom: '0.5rem',
        display: 'block',
        fontSize: '0.95rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.6rem 0.8rem',
        border: '1px solid #ced6e0',
        borderRadius: '6px',
        fontSize: '0.95rem',
        backgroundColor: '#f8f9fa',
        color: '#2d3436',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxShadow: 'none'
    };

    const focusStyle = {
        borderColor: '#3498db',
        boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
    };

    if (loading) return <div style={{textAlign: 'center', padding: '2rem'}}>Loading profile...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            {isStandalonePage && (
                <nav className="auth-navbar" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div 
                        className="navbar-brand" 
                        style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
                        onClick={() => navigate('/')}
                    >
                        ResolveNow
                    </div>
                    <UserDropdown 
                        user={user} 
                        onLogout={handleLogout} 
                    />
                </nav>
            )}

            <div style={{ 
                flex: 1, 
                padding: '2rem', 
                maxWidth: '600px', 
                margin: isStandalonePage ? '0 auto' : '2rem auto', 
                width: '100%' 
            }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: 0, color: '#2c3e50' }}>Edit Profile</h2>
                        {isStandalonePage && (
                            <button 
                                onClick={() => navigate(-1)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #3498db',
                                    color: '#3498db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                ← Back
                            </button>
                        )}
                    </div>
                    
                    {message && <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', border: '1px solid #c3e6cb' }}>{message}</div>}
                    {error && <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', border: '1px solid #f5c6cb' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Name</label>
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#ced6e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Email</label>
                            <input 
                                name="email" 
                                type="email"
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#ced6e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Phone</label>
                            <input 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#ced6e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                        >
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>

            {isStandalonePage && <FooterC />}
        </div>
    );
};

export default Profile;
