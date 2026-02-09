import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Rating, Snackbar, Alert, Typography, Badge, Fab, IconButton
} from '@mui/material';
import { KeyboardArrowDown, AttachFile, Close } from '@mui/icons-material';
import '../common/Auth.css';

const Status = ({ user, targetComplaintId, onNavigate }) => {
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState({}); // { complaintId: feedback }
  const [loading, setLoading] = useState(true);
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, complaintId: null, rating: 0, comment: '' });
  const [messageDialog, setMessageDialog] = useState({ open: false, complaintId: null, text: '', messages: [], attachments: [] });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [unreadCounts, setUnreadCounts] = useState({});
  const chatContainerRef = React.useRef(null);
  const complaintRefs = React.useRef({});
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
        // Use timeout to ensure DOM is updated
        setTimeout(() => scrollToBottom('smooth'), 100);
    }
  }, [messageDialog.messages, messageDialog.open]);

  // Socket listener for real-time updates
  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000');
    
    socket.on('newMessage', (message) => {
        // If the message is NOT from me
        if (message.name !== user.name) {
            // Check if this message belongs to one of my complaints
            const isMyComplaint = complaints.some(c => c._id === message.complaintId);
            if (!isMyComplaint) return;

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
  }, [user, complaints, messageDialog.open, messageDialog.complaintId]);

  // Scroll to target complaint instead of auto-opening chat
  useEffect(() => {
    if (targetComplaintId && !loading && complaints.length > 0) {
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
                }, 2000);
            }, 100);
        }
    }
  }, [targetComplaintId, loading, complaints]);

  // Fetch messages when dialog opens
  useEffect(() => {
    const fetchMessages = async (complaintId) => {
        try {
            const token = localStorage.getItem('token');
            // Mark as read
            await axios.put(`http://localhost:5000/api/messages/read/${complaintId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Reset local count
            setUnreadCounts(prev => ({ ...prev, [complaintId]: 0 }));

            const response = await axios.get(`http://localhost:5000/api/messages/${complaintId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessageDialog(prev => ({ ...prev, messages: response.data }));
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    if (messageDialog.open && messageDialog.complaintId) {
        fetchMessages(messageDialog.complaintId);
    }
  }, [messageDialog.open, messageDialog.complaintId]);

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
        formData.append('name', user.name);
        formData.append('message', messageDialog.text || ' '); // Send space if only attachment
        
        messageDialog.attachments.forEach(file => {
            formData.append('attachments', file);
        });

        const response = await axios.post('http://localhost:5000/api/messages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Update local state
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

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/complaints', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter complaints for the current user
        // Note: Ideally, the backend should handle this filtering
        const userComplaints = response.data.filter(c => c.userId === user.id || c.userId._id === user.id);
        setComplaints(userComplaints);

        // Fetch feedbacks for these complaints
        const feedbacksMap = {};
        await Promise.all(userComplaints.map(async (c) => {
            if (c.status === 'Resolved') {
                try {
                    const fbRes = await axios.get(`http://localhost:5000/api/feedback/complaint/${c._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (fbRes.data) {
                        feedbacksMap[c._id] = fbRes.data;
                    }
                } catch {
                    // Ignore if no feedback found
                }
            }
        }));
        setFeedbacks(feedbacksMap);

      } catch (err) {
        console.error(err);
        if (err.response && (err.response.status === 401 || err.response.status === 400)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (onNavigate) onNavigate('login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [user.id]);

  // Fetch unread counts on mount
  useEffect(() => {
    const fetchUnreadCounts = async () => {
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
                if (onNavigate) onNavigate('login');
            }
        }
    };
    if (user) fetchUnreadCounts();
  }, [user]);

  const handleSubmitFeedback = async () => {
      if (feedbackDialog.rating === 0) {
          setSnackbar({ open: true, message: 'Please select a rating', severity: 'warning' });
          return;
      }

      try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:5000/api/feedback', {
              complaintId: feedbackDialog.complaintId,
              rating: feedbackDialog.rating,
              comment: feedbackDialog.comment
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });

          setFeedbacks(prev => ({ ...prev, [feedbackDialog.complaintId]: response.data }));
          setSnackbar({ open: true, message: 'Feedback submitted successfully', severity: 'success' });
          setFeedbackDialog({ open: false, complaintId: null, rating: 0, comment: '' });
      } catch (err) {
          console.error(err);
          setSnackbar({ open: true, message: 'Failed to submit feedback', severity: 'error' });
      }
  };

  if (loading) return <div>Loading...</div>;

  if (complaints.length === 0) {
    return <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>No complaints registered yet.</div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'stretch' }}>
      {complaints.map(complaint => (
        <div 
            key={complaint._id} 
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
                    {complaint.name}
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
            <div><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</div>
            <div><strong>City:</strong> {complaint.city}</div>
            <div><strong>Description:</strong> {complaint.comment}</div>
            
            {(complaint.attachments?.length > 0 || complaint.attachment) && (
                <div style={{ marginTop: '0.5rem' }}>
                    <strong>Attachments:</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.3rem' }}>
                        {/* Legacy Support */}
                        {complaint.attachment && (!complaint.attachments || complaint.attachments.length === 0) && (
                            <a 
                                href={`http://localhost:5000/${complaint.attachment.replace(/\\/g, '/')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: '#3498db', textDecoration: 'none' }}
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
                                style={{ color: '#3498db', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <span>📄 {att.name || att.originalName || 'Document'}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Chat Button for non-pending complaints */}
            {(complaint.status === 'Assigned' || complaint.status === 'In Progress' || complaint.status === 'Resolved') && (
                <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #eee' }}>
                    <Badge badgeContent={unreadCounts[complaint._id] || 0} color="error" style={{ width: '100%' }}>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            size="small" 
                            fullWidth 
                            onClick={() => setMessageDialog({ open: true, complaintId: complaint._id, text: '', messages: [], attachments: [] })}
                            style={{ marginBottom: '0' }}
                        >
                            Chat with Agent
                        </Button>
                    </Badge>
                </div>
            )}
            
            {complaint.status === 'Resolved' && (
                <div style={{ paddingTop: '0.5rem' }}>
                    {feedbacks[complaint._id] ? (
                        <div style={{ fontSize: '0.9rem', color: '#27ae60' }}>
                            <strong>Feedback Given:</strong>
                            <div>Rating: <Rating value={feedbacks[complaint._id].rating} readOnly size="small" /></div>
                            {feedbacks[complaint._id].comment && feedbacks[complaint._id].comment.trim() && (
                                <div>"{feedbacks[complaint._id].comment}"</div>
                            )}
                        </div>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            fullWidth
                            onClick={() => setFeedbackDialog({ open: true, complaintId: complaint._id, rating: 0, comment: '' })}
                        >
                            Give Feedback
                        </Button>
                    )}
                </div>
            )}
        </div>
      ))}

      {/* Message Dialog */}
      <Dialog 
        open={messageDialog.open} 
        onClose={() => setMessageDialog({ ...messageDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chat with Agent</DialogTitle>
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
                    id="chat-file-input"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />
                <label htmlFor="chat-file-input">
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

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog.open} onClose={() => setFeedbackDialog({ ...feedbackDialog, open: false })}>
        <DialogTitle>Rate Service</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Typography component="legend">Rating:</Typography>
                <Rating
                    name="simple-controlled"
                    value={feedbackDialog.rating}
                    onChange={(event, newValue) => {
                        setFeedbackDialog(prev => ({ ...prev, rating: newValue }));
                    }}
                />
            </div>
            <TextField
                label="Comment (Optional)"
                multiline
                rows={3}
                fullWidth
                value={feedbackDialog.comment}
                onChange={(e) => setFeedbackDialog(prev => ({ ...prev, comment: e.target.value }))}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setFeedbackDialog({ ...feedbackDialog, open: false })}>Cancel</Button>
            <Button onClick={handleSubmitFeedback} variant="contained" color="primary">Submit</Button>
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
    </div>
  );
};

export default Status;
