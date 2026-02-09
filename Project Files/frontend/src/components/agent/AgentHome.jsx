import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Select, MenuItem, Snackbar, Alert, Rating, Badge, Fab, IconButton
} from '@mui/material';
import { KeyboardArrowDown, AttachFile, Close } from '@mui/icons-material';
import AccordionAdmin from '../admin/AccordionAdmin';
import Profile from '../common/Profile';
import UserDropdown from '../common/UserDropdown';
import '../common/Auth.css';

const AgentHome = ({ onNavigate }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [view, setView] = useState('dashboard'); // 'dashboard', 'profile'
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
    const chatContainerRef = React.useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottom = (behavior = 'auto') => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: behavior
            });
        }
    };

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom);
        }
    };

    // Auto-scroll on new messages
    useEffect(() => {
        if (messageDialog.open) {
            setTimeout(() => scrollToBottom('smooth'), 100);
        }
    }, [messageDialog.messages, messageDialog.open]);

    // Socket listener for real-time unread counts
    useEffect(() => {
        if (!user) return;

        const socket = io('http://localhost:5000');
        
        socket.on('newMessage', (message) => {
            // If the message is NOT from me
            if (message.name !== user.name) {
                // If chat for this complaint is NOT open, increment count
                if (messageDialog.complaintId !== message.complaintId || !messageDialog.open) {
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
    }, [user, messageDialog.open, messageDialog.complaintId]);

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
                    onNavigate('login');
                }
            }
        };

        if (messageDialog.open && messageDialog.complaintId) {
            fetchMessages(messageDialog.complaintId);
        }
    }, [messageDialog.open, messageDialog.complaintId]);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!user || !user.id) return;

            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Using the updated endpoint that populates complaintId and its userId
                const response = await axios.get(`http://localhost:5000/api/assigned/agent/${user.id}`, config);
                setAssignments(response.data);
                
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
                                onNavigate('login');
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
                    onNavigate('login');
                    return;
                }
                setError('Failed to fetch assignments');
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [user]);

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
                    onNavigate('login');
                }
            }
        };
        fetchUnreadCounts();
    }, [user]);

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onNavigate('login');
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

    if (loading && !assignments.length && view === 'dashboard') {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
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
                <div className="navbar-brand" style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }} onClick={() => setView('dashboard')}>
                    ResolveNow
                </div>
                <UserDropdown 
                    user={user} 
                    onUpdateDetails={() => setView('profile')} 
                    onLogout={handleLogout} 
                />
            </nav>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                {view === 'dashboard' ? (
                    <AccordionAdmin title="Assigned Complaints" defaultOpen={true}>
                        {error && <div className="error-message">{error}</div>}
                        
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
                                        <div key={assignment._id} style={{ 
                                            backgroundColor: 'white', 
                                            padding: '1rem', 
                                            borderRadius: '8px', 
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                            width: '300px', // Fixed width like a book
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            border: '1px solid #e0e0e0'
                                        }}>
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
            ) : (
                <Profile onUpdate={handleUserUpdate} />
            )}
            </div>

            {/* Message Dialog */}
            <Dialog 
                open={messageDialog.open} 
                onClose={() => setMessageDialog({ ...messageDialog, open: false })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Chat with User</DialogTitle>
                <DialogContent>
                    <div style={{ position: 'relative' }}>
                        <div 
                            ref={chatContainerRef}
                            onScroll={handleScroll}
                            style={{ 
                                height: '300px', 
                                overflowY: 'auto', 
                                marginBottom: '1rem', 
                                padding: '1rem', 
                                border: '1px solid #e0e0e0', 
                                borderRadius: '4px',
                                backgroundColor: '#f9f9f9',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}
                        >
                            {!messageDialog.messages || messageDialog.messages.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#999', marginTop: 'auto', marginBottom: 'auto' }}>
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messageDialog.messages.map((msg, index) => {
                                    const isMe = msg.name === user.name;
                                    return (
                                        <div key={index} style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            backgroundColor: isMe ? '#3498db' : '#ecf0f1',
                                            color: isMe ? 'white' : '#2c3e50',
                                            padding: '0.5rem 0.8rem',
                                            borderRadius: '10px',
                                            borderBottomRightRadius: isMe ? '0' : '10px',
                                            borderBottomLeftRadius: isMe ? '10px' : '0',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.2rem', color: isMe ? '#e3f2fd' : '#7f8c8d' }}>
                                                {msg.name}
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                {msg.message}
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {msg.attachments.map((att, idx) => {
                                                            const fileUrl = `http://localhost:5000/${att.path.replace(/\\/g, '/')}`;
                                                            const isImage = att.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                            
                                                            return isImage ? (
                                                                <a 
                                                                    key={idx} 
                                                                    href={fileUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    style={{ display: 'block' }}
                                                                >
                                                                    <img 
                                                                        src={fileUrl} 
                                                                        alt={att.name} 
                                                                        style={{ 
                                                                            maxWidth: '200px', 
                                                                            maxHeight: '200px', 
                                                                            borderRadius: '8px', 
                                                                            objectFit: 'cover',
                                                                            border: '1px solid rgba(0,0,0,0.1)'
                                                                        }} 
                                                                    />
                                                                </a>
                                                            ) : (
                                                                <a 
                                                                    key={idx} 
                                                                    href={fileUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    style={{ 
                                                                        color: isMe ? 'white' : '#3498db', 
                                                                        textDecoration: 'underline', 
                                                                        fontSize: '0.85rem',
                                                                        display: 'block' 
                                                                    }}
                                                                >
                                                                    {att.name || 'Attachment'}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', textAlign: 'right', marginTop: '0.2rem', opacity: 0.8 }}>
                                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {showScrollButton && (
                            <Fab 
                                color="primary" 
                                size="small" 
                                onClick={() => scrollToBottom('smooth')}
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '20px',
                                    zIndex: 10,
                                    backgroundColor: '#3498db'
                                }}
                            >
                                <KeyboardArrowDown />
                            </Fab>
                        )}
                    </div>
                    
                    {/* File Previews */}
                    {messageDialog.attachments && messageDialog.attachments.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {messageDialog.attachments.map((file, idx) => (
                                <div key={idx} style={{ 
                                    backgroundColor: '#f0f0f0', 
                                    padding: '0.2rem 0.5rem', 
                                    borderRadius: '4px', 
                                    fontSize: '0.8rem', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.3rem' 
                                }}>
                                    <span>{file.name}</span>
                                    <Close 
                                        style={{ fontSize: '1rem', cursor: 'pointer', color: '#e74c3c' }} 
                                        onClick={() => handleRemoveAttachment(idx)} 
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <input
                            type="file"
                            multiple
                            id="agent-chat-file-input"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="agent-chat-file-input">
                            <IconButton component="span" color="primary" size="small">
                                <AttachFile />
                            </IconButton>
                        </label>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Type a message..."
                            type="text"
                            fullWidth
                            multiline
                            rows={2}
                            value={messageDialog.text}
                            onChange={(e) => setMessageDialog({ ...messageDialog, text: e.target.value })}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMessageDialog({ ...messageDialog, open: false })}>Close</Button>
                    <Button onClick={handleSendMessage} variant="contained" color="primary">Send</Button>
                </DialogActions>
            </Dialog>

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

            {/* Footer */}
            <footer style={{ backgroundColor: '#2c3e50', padding: '1rem', textAlign: 'center', color: 'white' }}>
                ResolveNow
            </footer>
        </div>
    );
};

export default AgentHome;
