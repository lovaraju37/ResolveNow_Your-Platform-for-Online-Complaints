import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Complaint from './Complaint';
import Status from './Status';
import UserDropdown from '../common/UserDropdown';
import FooterC from '../common/FooterC';
import '../common/Auth.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeTab, setActiveTab] = useState('register'); // 'register', 'status'
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [targetComplaintId, setTargetComplaintId] = useState(null);
  const [userComplaintIds, setUserComplaintIds] = useState(new Set());
  const [userComplaints, setUserComplaints] = useState([]);
  const userComplaintIdsRef = React.useRef(new Set());

  // Update ref whenever userComplaintIds changes
  useEffect(() => {
    userComplaintIdsRef.current = userComplaintIds;
  }, [userComplaintIds]);

  // Fetch user complaints to know which IDs to listen for
  useEffect(() => {
    const fetchUserComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter for current user
            const filtered = response.data
                .filter(c => c.userId === user.id || c.userId._id === user.id)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            const ids = new Set(filtered.map(c => c._id));
            setUserComplaintIds(ids);
            setUserComplaints(filtered);
        } catch (err) {
            console.error(err);
            // Auto-logout on auth error
            if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };
    if (user) fetchUserComplaints();
  }, [user.id, navigate]);

  // Socket listener
  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000');
    
    socket.on('newMessage', (message) => {
        // Check if message belongs to one of user's complaints and is NOT from user
        if (userComplaintIdsRef.current.has(message.complaintId) && message.name !== user.name) {
            setNotifications(prev => [message, ...prev]);
        }
    });

    return () => socket.disconnect();
  }, [user.id, user.name]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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
                        navigate('/');
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

                            {/* Recent Complaints */}
                            <div style={{ marginTop: '3rem', textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                                <h3 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Recent Complaints</h3>
                                {userComplaints.length === 0 ? (
                                    <div style={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center' }}>No complaints found.</div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {userComplaints.slice(0, 3).map(complaint => (
                                            <div key={complaint._id} 
                                                style={{ 
                                                    padding: '1rem', 
                                                    backgroundColor: '#fff', 
                                                    borderRadius: '8px', 
                                                    border: '1px solid #eee', 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onClick={() => {
                                                    setTargetComplaintId(complaint._id);
                                                    setActiveTab('status');
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#2c3e50' }}>{complaint.name}</div>
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                                                        <span style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                        <span style={{ color: '#bdc3c7' }}>•</span>
                                                        <span style={{ color: '#555', fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {complaint.comment}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ 
                                                    padding: '0.3rem 0.8rem', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.8rem', 
                                                    fontWeight: '600',
                                                    backgroundColor: complaint.status === 'Resolved' ? '#e8f8f5' : complaint.status === 'In Progress' ? '#fef9e7' : '#fdedec',
                                                    color: complaint.status === 'Resolved' ? '#27ae60' : complaint.status === 'In Progress' ? '#f39c12' : '#e74c3c',
                                                    border: `1px solid ${complaint.status === 'Resolved' ? '#a9dfbf' : complaint.status === 'In Progress' ? '#f9e79f' : '#fadbd8'}`
                                                }}>
                                                    {complaint.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
            ) : (
                <Status user={user} targetComplaintId={targetComplaintId} />
            )}
        </div>

        <FooterC />
    </div>
  );
};

export default HomePage;
