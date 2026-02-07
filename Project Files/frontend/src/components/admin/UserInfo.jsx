import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Snackbar, Alert, Rating } from '@mui/material';

const UserInfo = () => {
    const [complaints, setComplaints] = useState([]);
    const [agents, setAgents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [feedbacks, setFeedbacks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [assigningComplaintId, setAssigningComplaintId] = useState(null);
    const [selectedAgentId, setSelectedAgentId] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'assigned', 'completed'
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' // 'success' | 'error' | 'warning' | 'info'
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [complaintsRes, agentsRes, assignmentsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/complaints', config),
                    axios.get('http://localhost:5000/api/auth/agents', config),
                    axios.get('http://localhost:5000/api/assigned', config)
                ]);

                setComplaints(complaintsRes.data);
                setAgents(agentsRes.data);
                setAssignments(assignmentsRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');
            if (resolvedComplaints.length === 0) return;

            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const feedbacksMap = {};

            await Promise.all(resolvedComplaints.map(async (c) => {
                try {
                    const fbRes = await axios.get(`http://localhost:5000/api/feedback/complaint/${c._id}`, config);
                    if (fbRes.data) {
                        feedbacksMap[c._id] = fbRes.data;
                    }
                } catch {
                    // Ignore
                }
            }));
            
            setFeedbacks(prev => ({ ...prev, ...feedbacksMap }));
        };

        if (complaints.length > 0) {
            fetchFeedbacks();
        }
    }, [complaints]);

    const handleAssignClick = (complaintId) => {
        setAssigningComplaintId(complaintId);
        setSelectedAgentId('');
    };

    const handleAssignSubmit = async (complaintId) => {
        if (!selectedAgentId) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const agent = agents.find(a => a._id === selectedAgentId);

            await axios.post('http://localhost:5000/api/assigned', {
                complaintId,
                agentId: selectedAgentId,
                agentName: agent.name
            }, config);
            
            setSnackbar({
                open: true,
                message: `Complaint assigned to ${agent.name} successfully!`,
                severity: 'success'
            });

            // Optimistic UI Update: Update the local state immediately
            setComplaints(prevComplaints => 
                prevComplaints.map(c => 
                    c._id === complaintId ? { ...c, status: 'Assigned' } : c
                )
            );

            setAssignments(prev => [
                ...prev, 
                { 
                    complaintId: { _id: complaintId },
                    agentId: selectedAgentId,
                    agentName: agent.name,
                    status: 'Assigned'
                }
            ]);

            setAssigningComplaintId(null);
            setRefreshKey(prev => prev + 1); // Refresh to ensure data consistency with backend
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                message: err.response?.data?.error || 'Failed to assign complaint',
                severity: 'error'
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const filteredComplaints = complaints.filter(complaint => {
        if (activeTab === 'pending') return complaint.status === 'Pending';
        if (activeTab === 'assigned') return complaint.status === 'Assigned' || complaint.status === 'In Progress';
        if (activeTab === 'completed') return complaint.status === 'Resolved';
        return true;
    });

    return (
        <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                <button 
                    onClick={() => setActiveTab('pending')}
                    style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        color: activeTab === 'pending' ? '#3498db' : '#666',
                        fontWeight: activeTab === 'pending' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'pending' ? '2px solid #3498db' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    Pending
                </button>
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
                    onClick={() => setActiveTab('completed')}
                    style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        color: activeTab === 'completed' ? '#3498db' : '#666',
                        fontWeight: activeTab === 'completed' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'completed' ? '2px solid #3498db' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    Completed
                </button>
            </div>

            {filteredComplaints.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
                    No complaints in {activeTab} status
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'stretch' }}>
                    {filteredComplaints.map(complaint => (
                        <div key={complaint._id} style={{ 
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
                                    backgroundColor: complaint.status === 'Resolved' ? '#e8f5e9' : (complaint.status === 'Assigned' ? '#e3f2fd' : '#fff3e0'),
                                    color: complaint.status === 'Resolved' ? '#2e7d32' : (complaint.status === 'Assigned' ? '#1976d2' : '#f57c00')
                                }}>
                                    {complaint.status}
                                </span>
                            </div>

                            <div><strong>Address:</strong> {complaint.address}</div>
                            <div><strong>City:</strong> {complaint.city}</div>
                            <div><strong>State:</strong> {complaint.state}</div>
                            <div><strong>Pincode:</strong> {complaint.pincode}</div>
                            <div><strong>Comment:</strong> {complaint.comment}</div>
                            {complaint.attachment && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <strong>Attachment:</strong>{' '}
                                    <a 
                                        href={`http://localhost:5000/${complaint.attachment.replace(/\\/g, '/')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ color: '#3498db', textDecoration: 'none' }}
                                    >
                                        View Document
                                    </a>
                                </div>
                            )}
                            
                            {(complaint.status === 'Assigned' || complaint.status === 'In Progress' || complaint.status === 'Resolved') && (
                                <div><strong>Assigned Agent:</strong> {
                                    assignments.find(a => {
                                        const aCompId = a.complaintId?._id || a.complaintId;
                                        return aCompId === complaint._id;
                                    })?.agentName || 'N/A'
                                }</div>
                            )}

                            {feedbacks[complaint._id] && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '0.2rem' }}>User Feedback:</div>
                                    <Rating value={feedbacks[complaint._id].rating} readOnly size="small" />
                                    <div style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>"{feedbacks[complaint._id].comment}"</div>
                                </div>
                            )}
                            
                            {activeTab === 'pending' && (
                                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                    {assigningComplaintId === complaint._id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select 
                value={selectedAgentId} 
                onChange={(e) => setSelectedAgentId(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            >
                <option value="">Select Agent</option>
                {agents
                    .sort((a, b) => (a.activeAssignments || 0) - (b.activeAssignments || 0))
                    .map(agent => {
                        const count = agent.activeAssignments || 0;
                        const isFull = count >= 3;
                        return (
                            <option 
                                key={agent._id} 
                                value={agent._id}
                                disabled={isFull}
                                style={{ color: isFull ? '#aaa' : 'inherit' }}
                            >
                                {agent.name} ({count}/3) {isFull ? '- Full' : ''}
                            </option>
                        );
                    })}
            </select>
                                            <button 
                                                onClick={() => handleAssignSubmit(complaint._id)}
                                                style={{ 
                                                    padding: '0.5rem 1rem', 
                                                    backgroundColor: '#f1c40f', 
                                                    border: 'none', 
                                                    borderRadius: '4px', 
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                ✓
                                            </button>
                                            <button 
                                                onClick={() => setAssigningComplaintId(null)}
                                                style={{ 
                                                    padding: '0.5rem 0.8rem', 
                                                    backgroundColor: '#e74c3c', 
                                                    color: 'white',
                                                    border: 'none', 
                                                    borderRadius: '4px', 
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleAssignClick(complaint._id)}
                                            style={{ 
                                                padding: '0.7rem 1.5rem', 
                                                backgroundColor: '#f1c40f', 
                                                border: 'none', 
                                                borderRadius: '5px', 
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                color: '#2c3e50',
                                                width: '100%',
                                                transition: 'background 0.3s'
                                            }}
                                        >
                                            Assign Agent
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UserInfo;
