import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccordionAdmin from './AccordionAdmin';
import UserInfo from './UserInfo';
import AgentInfo from './AgentInfo';
import UserDropdown from '../common/UserDropdown';
import FooterC from '../common/FooterC';
import '../common/Auth.css'; 

const AdminHome = () => {
    const navigate = useNavigate();
    const user = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    })[0];
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAssignmentChange = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

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
                <AccordionAdmin title="Users Complaints" defaultOpen={true}>
                    <UserInfo onAssignmentChange={handleAssignmentChange} />
                </AccordionAdmin>

                <AccordionAdmin title="Agents" defaultOpen={true}>
                    <AgentInfo refreshTrigger={refreshTrigger} />
                </AccordionAdmin>
            </div>

            <FooterC />
        </div>
    );
};

export default AdminHome;
