import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgentInfo = () => {
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
                setError('Failed to fetch agents');
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

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

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {agents.map(agent => (
                <div key={agent._id} style={{ 
                    backgroundColor: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    minWidth: '200px'
                }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{agent.name}</div>
                    <div style={{ color: '#666' }}>{agent.email}</div>
                    <div style={{ color: '#666' }}>{agent.phone}</div>
                </div>
            ))}
        </div>
    );
};

export default AgentInfo;
