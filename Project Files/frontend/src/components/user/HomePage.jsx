import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Complaint from './Complaint';
import Status from './Status';
import Profile from '../common/Profile';
import UserDropdown from '../common/UserDropdown';
import '../common/Auth.css';

const HomePage = ({ onNavigate }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeTab, setActiveTab] = useState('register'); // 'register', 'status', 'profile'
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [targetComplaintId, setTargetComplaintId] = useState(null);
  const [userComplaintIds, setUserComplaintIds] = useState(new Set());

  // Fetch user complaints to know which IDs to listen for
  useEffect(() => {
    const fetchUserComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter for current user
            const ids = new Set(response.data
                .filter(c => c.userId === user.id || c.userId._id === user.id)
                .map(c => c._id));
            setUserComplaintIds(ids);
        } catch (err) {
            console.error(err);
            // Auto-logout on auth error
            if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                onNavigate('login');
            }
        }
    };
    if (user) fetchUserComplaints();
  }, [user]);

  // Socket listener
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('newMessage', (message) => {
        // Check if message belongs to one of user's complaints and is NOT from user
        if (userComplaintIds.has(message.complaintId) && message.name !== user.name) {
            setNotifications(prev => [message, ...prev]);
        }
    });

    return () => socket.disconnect();
  }, [user, userComplaintIds]);

  useEffect(() => {
    if (!user) {
      onNavigate('login');
    }
  }, [user, onNavigate]);

  const handleUserUpdate = (updatedUser) => {
      setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onNavigate('home');
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        {/* Navbar */}
        <nav className="auth-navbar" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div 
                    className="navbar-brand" 
                    style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
                    onClick={() => {
                        setActiveTab('register');
                        setShowForm(false);
                    }}
                >
                    ResolveNow
                </div>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => setActiveTab('register')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'register' ? '#3498db' : 'white',
                            fontWeight: activeTab === 'register' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '0.5rem',
                            borderBottom: activeTab === 'register' ? '2px solid #3498db' : '2px solid transparent'
                        }}
                    >
                        Complaint Register
                    </button>
                    <button 
                        onClick={() => setActiveTab('status')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'status' ? '#3498db' : 'white',
                            fontWeight: activeTab === 'status' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '0.5rem',
                            borderBottom: activeTab === 'status' ? '2px solid #3498db' : '2px solid transparent'
                        }}
                    >
                        Status
                    </button>
                </div>
            </div>

            <UserDropdown 
                user={user} 
                onUpdateDetails={() => setActiveTab('profile')} 
                onLogout={handleLogout} 
            />
        </nav>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {activeTab === 'register' ? (
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#2c3e50' }}>Register Complaint</h2>
                    {!showForm ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <button 
                                onClick={() => setShowForm(true)}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1.2rem',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(52, 152, 219, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Register New Complaint
                            </button>

                            {/* Notifications */}
                            {notifications.length > 0 && (
                                <div style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto 0' }}>
                                    {notifications.map((msg, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => {
                                                setTargetComplaintId(msg.complaintId);
                                                setActiveTab('status');
                                                // Remove notification
                                                setNotifications(prev => prev.filter((_, i) => i !== index));
                                            }}
                                            style={{
                                                backgroundColor: '#e3f2fd',
                                                border: '1px solid #90caf9',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                marginBottom: '1rem',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bbdefb'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: '#1565c0', marginBottom: '0.2rem' }}>
                                                    New message from {msg.name}
                                                </div>
                                                <div style={{ color: '#555', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                                                    {msg.message}
                                                </div>
                                            </div>
                                            <div style={{ color: '#1976d2', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                View →
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                             <button 
                                onClick={() => setShowForm(false)}
                                style={{
                                    marginBottom: '1rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ← Back
                            </button>
                            <Complaint 
                                user={user} 
                                onSuccess={() => {
                                    setActiveTab('status');
                                    setShowForm(false);
                                }} 
                            />
                        </div>
                    )}
                </div>
            ) : activeTab === 'status' ? (
                <Status user={user} targetComplaintId={targetComplaintId} onNavigate={onNavigate} />
            ) : (
                <Profile onUpdate={handleUserUpdate} />
            )}
        </div>

        {/* Footer */}
        <footer style={{ backgroundColor: '#2c3e50', padding: '1rem', textAlign: 'center', color: 'white' }}>
            ResolveNow
        </footer>
    </div>
  );
};

export default HomePage;
