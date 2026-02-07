import React, { useState } from 'react';
import AccordionAdmin from './AccordionAdmin';
import UserInfo from './UserInfo';
import AgentInfo from './AgentInfo';
import Profile from '../common/Profile';
import UserDropdown from '../common/UserDropdown';
import '../common/Auth.css'; 

const AdminHome = ({ onNavigate }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [view, setView] = useState('dashboard'); // 'dashboard', 'profile'

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onNavigate('login');
    };

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
                    <>
                        <AccordionAdmin title="Users Complaints" defaultOpen={true}>
                            <UserInfo />
                        </AccordionAdmin>

                        <AccordionAdmin title="Agents" defaultOpen={true}>
                            <AgentInfo />
                        </AccordionAdmin>
                    </>
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

export default AdminHome;
