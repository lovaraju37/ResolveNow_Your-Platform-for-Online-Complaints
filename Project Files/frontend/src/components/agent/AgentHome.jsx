import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { 
    Button, Select, MenuItem, Snackbar, Alert, Rating, Badge, IconButton
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import AccordionAdmin from '../admin/AccordionAdmin';
import UserDropdown from '../common/UserDropdown';
import FooterC from '../common/FooterC';
import ChatWindow from '../common/ChatWindow';
import '../common/Auth.css';

const AgentHome = () => {
    const navigate = useNavigate();
    const user = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    })[0];
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // New States for Status and Message
    const [statusUpdates, setStatusUpdates] = useState({}); // { complaintId: 'NewStatus' }
    const [messageDialog, setMessageDialog] = useState({ open: false, complaintId: null, text: '', messages: [], attachments: [] });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [feedbacks, setFeedbacks] = useState({});
    const [activeTab, setActiveTab] = useState('assigned'); // 'assigned', 'in_progress', 'resolved'
    const [unreadCounts, setUnreadCounts] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [targetComplaintId, setTargetComplaintId] = useState(null);
    const complaintRefs = React.useRef({});
    const assignmentsRef = React.useRef(assignments);
    const messageDialogRef = React.useRef(messageDialog);

    // Update refs whenever state changes
    useEffect(() => {
        assignmentsRef.current = assignments;
    }, [assignments]);

    useEffect(() => {
        messageDialogRef.current = messageDialog;
    }, [messageDialog]);

    // Fetch assignments and unread counts

    // Socket listener for real-time unread counts and notifications
    useEffect(() => {
        if (!user) return;

        const socket = io('http://localhost:5000');
        
        socket.on('newMessage', (message) => {
            // If the message is NOT from me
            if (message.name !== user.name) {
                // Check if this message belongs to one of my assigned complaints
                const isMyAssignment = assignmentsRef.current.some(a => a.complaintId?._id === message.complaintId);
                if (!isMyAssignment) return;

                // Add to notifications if chat is not open
                const currentDialog = messageDialogRef.current;
                if (currentDialog.complaintId !== message.complaintId || !currentDialog.open) {
                    setNotifications(prev => [message, ...prev]);
                    
                    // Increment unread count
                    setUnreadCounts(prev => ({
                        ...prev,
                        [message.complaintId]: (prev[message.complaintId] || 0) + 1
                    }));
                } else {
                    // If chat IS open, append message and mark as read
                    setMessageDialog(prev => ({
                        ...prev,
                        messages: [...prev.messages, message]
                    }));

                     const token = localStorage.getItem('token');
                     axios.put(`http://localhost:5000/api/messages/read/${message.complaintId}`, {}, {
                         headers: { Authorization: `Bearer ${token}` }
                     }).catch(err => console.error(err));
                }
            }
        });

        return () => socket.disconnect();
    }, [user.id, user.name]);

    // Fetch messages when dialog opens
    useEffect(() => {
        const fetchMessages = async (complaintId) => {
            try {
                const token = localStorage.getItem('token');
                // Mark messages as read
                await axios.put(`http://localhost:5000/api/messages/read/${complaintId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Reset unread count locally
                setUnreadCounts(prev => ({ ...prev, [complaintId]: 0 }));

                const response = await axios.get(`http://localhost:5000/api/messages/${complaintId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessageDialog(prev => ({ ...prev, messages: response.data }));
            } catch (err) {
                console.error('Failed to fetch messages', err);
                if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        };

        if (messageDialog.open && messageDialog.complaintId) {
            fetchMessages(messageDialog.complaintId);
        }
    }, [messageDialog.open, messageDialog.complaintId, navigate]);

    // Scroll to target complaint effect
    useEffect(() => {
        if (targetComplaintId && !loading && assignments.length > 0) {
            const element = complaintRefs.current[targetComplaintId];
            if (element) {
                // Small delay to ensure rendering
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight effect
                    element.style.transition = 'all 0.5s ease';
                    element.style.boxShadow = '0 0 0 2px #3498db, 0 4px 12px rgba(52, 152, 219, 0.3)';
                    element.style.transform = 'scale(1.02)';
                    
                    setTimeout(() => {
                        element.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                        element.style.transform = 'scale(1)';
                        setTargetComplaintId(null); // Clear after highlighting
                    }, 2000);
                }, 100);
            }
        }
    }, [targetComplaintId, loading, assignments]);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!user || !user.id) return;

            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Using the updated endpoint that populates complaintId and its userId
                const response = await axios.get(`http://localhost:5000/api/assigned/agent/${user.id}`, config);
                
                // Sort assignments by complaint creation date (recent first)
                const sortedAssignments = response.data.sort((a, b) => {
                    const dateA = a.complaintId ? new Date(a.complaintId.createdAt) : 0;
                    const dateB = b.complaintId ? new Date(b.complaintId.createdAt) : 0;
                    return dateB - dateA;
                });
                setAssignments(sortedAssignments);
                
                // Fetch feedbacks for assignments
                const feedbacksMap = {};
                await Promise.all(response.data.map(async (a) => {
                    const c = a.complaintId;
                    if (c && c.status === 'Resolved') {
                        try {
                            const fbRes = await axios.get(`http://localhost:5000/api/feedback/complaint/${c._id}`, config);
                            if (fbRes.data) {
                                feedbacksMap[c._id] = fbRes.data;
                            }
                        } catch (err) {
                            // Auto-logout on auth error
                            if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                navigate('/login');
                                return;
                            }
                        }
                    }
                }));
                setFeedbacks(feedbacksMap);
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }
                setError('Failed to fetch assignments');
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [user, navigate]);

    // Fetch unread counts on mount
    useEffect(() => {
        const fetchUnreadCounts = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/messages/unread/counts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUnreadCounts(response.data);
            } catch (err) {
                console.error('Failed to fetch unread counts', err);
                if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        };
        fetchUnreadCounts();
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleStatusChange = async (complaintId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/complaints/${complaintId}`, { status: newStatus });
            
            // Update local state
            setAssignments(prev => prev.map(a => {
                if (a.complaintId && a.complaintId._id === complaintId) {
                    return { ...a, complaintId: { ...a.complaintId, status: newStatus } };
                }
                return a;
            }));

            setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
            setStatusUpdates(prev => {
                const newState = { ...prev };
                delete newState[complaintId];
                return newState;
            });
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setMessageDialog(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const handleRemoveAttachment = (index) => {
        setMessageDialog(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSendMessage = async () => {
        if (!messageDialog.text.trim() && messageDialog.attachments.length === 0) return;

        try {
            const formData = new FormData();
            formData.append('complaintId', messageDialog.complaintId);
            formData.append('name', user.name); // Sending agent's name
            formData.append('message', messageDialog.text || ' '); // Send space if only attachment
            
            messageDialog.attachments.forEach(file => {
                formData.append('attachments', file);
            });

            const response = await axios.post('http://localhost:5000/api/messages', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update local state instead of closing
            setMessageDialog(prev => ({ 
                ...prev, 
                text: '',
                attachments: [],
                messages: [...prev.messages, response.data]
            }));
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: 'Failed to send message', severity: 'error' });
        }
    };

    if (loading && !assignments.length) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading assignments...</div>;
    }

    const filteredAssignments = assignments.filter(assignment => {
        const status = assignment.complaintId?.status;
        if (activeTab === 'assigned') return status === 'Assigned';
        if (activeTab === 'in_progress') return status === 'In Progress';
        if (activeTab === 'resolved') return status === 'Resolved';
        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            {/* Navbar */}
            <nav className="auth-navbar" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="navbar-brand" style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }} onClick={() => navigate('/')}>
                    ResolveNow
                </div>
                <UserDropdown 
                    user={user} 
                    onLogout={handleLogout} 
                />
            </nav>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <AccordionAdmin title="Assigned Complaints" defaultOpen={true}>
                    {error && <div className="error-message">{error}</div>}
                    
                    {/* Notifications */}
                    {notifications.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            {notifications.map((msg, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => {
                                        setTargetComplaintId(msg.complaintId);
                                        setMessageDialog({ open: true, complaintId: msg.complaintId, text: '', messages: [], attachments: [] });
                                        // Find complaint status to switch tab if needed
                                        const complaint = assignments.find(a => a.complaintId?._id === msg.complaintId)?.complaintId;
                                        if (complaint) {
                                            if (complaint.status === 'Assigned') setActiveTab('assigned');
                                            else if (complaint.status === 'In Progress') setActiveTab('in_progress');
                                            else if (complaint.status === 'Resolved') setActiveTab('resolved');
                                        }
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
                                        <div style={{ color: '#555', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>
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
                    
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                            <button 
                                onClick={() => setActiveTab('assigned')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: activeTab === 'assigned' ? '#3498db' : '#666',
                                    fontWeight: activeTab === 'assigned' ? 'bold' : 'normal',
                                    borderBottom: activeTab === 'assigned' ? '2px solid #3498db' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Assigned
                            </button>
                            <button 
                                onClick={() => setActiveTab('in_progress')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: activeTab === 'in_progress' ? '#3498db' : '#666',
                                    fontWeight: activeTab === 'in_progress' ? 'bold' : 'normal',
                                    borderBottom: activeTab === 'in_progress' ? '2px solid #3498db' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                In Progress
                            </button>
                            <button 
                                onClick={() => setActiveTab('resolved')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: activeTab === 'resolved' ? '#3498db' : '#666',
                                    fontWeight: activeTab === 'resolved' ? 'bold' : 'normal',
                                    borderBottom: activeTab === 'resolved' ? '2px solid #3498db' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Resolved
                            </button>
                        </div>

                        {!loading && filteredAssignments.length === 0 ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
                                No complaints in {activeTab.replace('_', ' ')} status.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'stretch' }}>
                                {filteredAssignments.map(assignment => {
                                    const complaint = assignment.complaintId;
                                    if (!complaint) return null;

                                    return (
                                        <div 
                                            key={assignment._id} 
                                            ref={el => complaintRefs.current[complaint._id] = el}
                                            style={{ 
                                                backgroundColor: 'white', 
                                                padding: '1rem', 
                                                borderRadius: '8px', 
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                width: '300px', // Fixed width like a book
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                border: '1px solid #e0e0e0'
                                            }}
                                        >
                                            {/* Card Header */}
                                            <div style={{ 
                                                borderBottom: '1px solid #eee', 
                                            paddingBottom: '0.5rem', 
                                            marginBottom: '0.5rem',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            color: '#2c3e50',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                                {complaint.userId?.name || 'Unknown'}
                                            </span>
                                            <span style={{ 
                                                fontSize: '0.8rem', 
                                                padding: '0.2rem 0.6rem', 
                                                borderRadius: '15px', 
                                                backgroundColor: complaint.status === 'Resolved' ? '#e8f5e9' : '#fff3e0',
                                                color: complaint.status === 'Resolved' ? '#2e7d32' : '#f57c00'
                                            }}>
                                                {complaint.status}
                                            </span>
                                        </div>

                                        {/* Card Content */}
                                        <div><strong>Product Name:</strong> {complaint.name}</div>
                                        <div><strong>Address:</strong> {complaint.address}</div>
                                        <div><strong>City:</strong> {complaint.city}</div>
                                        <div><strong>State:</strong> {complaint.state}</div>
                                        <div><strong>Pincode:</strong> {complaint.pincode}</div>
                                        <div><strong>Comment:</strong> {complaint.comment}</div>
                                        {(complaint.attachments?.length > 0 || complaint.attachment) && (
                                                <div style={{ marginTop: '0.5rem', borderTop: '1px dashed #eee', paddingTop: '0.5rem' }}>
                                                    <strong>Attachments:</strong>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.3rem' }}>
                                                        {/* Legacy Support */}
                                                        {complaint.attachment && (!complaint.attachments || complaint.attachments.length === 0) && (
                                                            <a 
                                                                href={`http://localhost:5000/${complaint.attachment.replace(/\\/g, '/')}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                style={{ color: '#3498db', textDecoration: 'none', fontSize: '0.9rem' }}
                                                            >
                                                                View Document
                                                            </a>
                                                        )}
                                                        {/* New Array Support */}
                                                        {complaint.attachments?.map((att, idx) => (
                                                            <a 
                                                                key={idx}
                                                                href={`http://localhost:5000/${att.path.replace(/\\/g, '/')}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                style={{ color: '#3498db', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                                                            >
                                                                <span>📄 {att.name || att.originalName || 'Document'}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        
                                        {/* Agent specific info (assignment status) */}
                                        <div style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee' }}>
                                            Assigned on: {new Date(assignment.assignedAt).toLocaleDateString()}
                                        </div>

                                        {feedbacks[complaint._id] && (
                                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '0.2rem' }}>User Feedback:</div>
                                                <Rating value={feedbacks[complaint._id].rating} readOnly size="small" />
                                                {feedbacks[complaint._id].comment && feedbacks[complaint._id].comment.trim() && (
                                                    <div style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>"{feedbacks[complaint._id].comment}"</div>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                            {/* Status Change */}
                                        {complaint.status !== 'Resolved' && (
                                            <div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#34495e' }}>
                                                    Update Status:
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <Select
                                                        value={statusUpdates[complaint._id] || complaint.status}
                                                        onChange={(e) => setStatusUpdates({ ...statusUpdates, [complaint._id]: e.target.value })}
                                                        size="small"
                                                        fullWidth
                                                        style={{ backgroundColor: '#fff' }}
                                                    >
                                                        <MenuItem value={complaint.status}>{complaint.status}</MenuItem>
                                                        {complaint.status === 'Assigned' && (
                                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                                        )}
                                                        {complaint.status === 'In Progress' && (
                                                            <MenuItem value="Resolved">Resolved</MenuItem>
                                                        )}
                                                    </Select>
                                                    {statusUpdates[complaint._id] && statusUpdates[complaint._id] !== complaint.status && (
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleStatusChange(complaint._id, statusUpdates[complaint._id])}
                                                        >
                                                            Save
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                            {/* Message Button */}
                                            <Badge badgeContent={unreadCounts[complaint._id] || 0} color="error" style={{ width: '100%' }}>
                                                <Button 
                                                    variant="outlined" 
                                                    color="secondary" 
                                                    size="small" 
                                                    fullWidth
                                                    onClick={() => setMessageDialog({ open: true, complaintId: complaint._id, text: '', messages: [], attachments: [] })}
                                                >
                                                    Message
                                                </Button>
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </AccordionAdmin>
            </div>

            {/* Message Dialog */}
            <ChatWindow 
                open={messageDialog.open}
                onClose={() => setMessageDialog({ ...messageDialog, open: false })}
                title="Chat with User"
                messages={messageDialog.messages}
                onSendMessage={handleSendMessage}
                onFileSelect={handleFileSelect}
                onRemoveAttachment={handleRemoveAttachment}
                attachments={messageDialog.attachments}
                inputText={messageDialog.text}
                onInputChange={(val) => setMessageDialog({ ...messageDialog, text: val })}
                currentUser={user}
            />

            {/* Snackbar */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <FooterC />
        </div>
    );
};

export default AgentHome;
