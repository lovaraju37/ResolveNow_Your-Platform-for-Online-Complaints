import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgentInfo = ({ refreshTrigger }) => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('http://localhost:5000/api/auth/agents', config);
                setAgents(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                } else {
                    setError('Failed to fetch agents');
                    setLoading(false);
                }
            }
        };

        fetchAgents();
    }, [refreshTrigger]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    if (agents.length === 0) {
        return (
            <div style={{ 
                padding: '1rem', 
                backgroundColor: '#e0f7fa', 
                color: '#006064', 
                borderRadius: '5px',
                display: 'inline-block'
            }}>
                No Agents to show
            </div>
        );
    }

    const sortedAgents = [...agents].sort((a, b) => {
        const countA = a.activeAssignments || 0;
        const countB = b.activeAssignments || 0;
        return countA - countB;
    });

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {sortedAgents.map(agent => {
                const active = agent.activeAssignments || 0;
                let tagLabel = '';
                let tagColor = '';
                let tagBg = '';

                if (active === 0) {
                    tagLabel = 'Available';
                    tagColor = '#27ae60';
                    tagBg = '#e8f8f5';
                } else if (active < 3) {
                    tagLabel = `${active}/3 Assigned`;
                    tagColor = '#f39c12';
                    tagBg = '#fef9e7';
                } else {
                    tagLabel = 'Unavailable';
                    tagColor = '#c0392b';
                    tagBg = '#fadbd8';
                }

                return (
                    <div key={agent._id} style={{ 
                        backgroundColor: 'white', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        minWidth: '200px',
                        position: 'relative'
                    }}>
                        <div style={{ 
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: tagBg,
                            color: tagColor,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            border: `1px solid ${tagColor}`
                        }}>
                            {tagLabel}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '1.5rem' }}>{agent.name}</div>
                        <div style={{ color: '#666' }}>{agent.email}</div>
                        <div style={{ color: '#666' }}>{agent.phone}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default AgentInfo;
