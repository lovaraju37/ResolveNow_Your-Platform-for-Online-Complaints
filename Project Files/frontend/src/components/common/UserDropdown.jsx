import React, { useState, useRef, useEffect } from 'react';

const UserDropdown = ({ user, onUpdateDetails, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div 
                onClick={toggleDropdown}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    borderRadius: '50%', 
                    backgroundColor: '#3498db', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    marginRight: '0.5rem'
                }}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ color: 'white', fontWeight: '500' }}>
                    {user?.name}
                    <span style={{ fontSize: '0.8rem', opacity: 0.8, display: 'block' }}>
                        {user?.userType || 'User'}
                    </span>
                </div>
                <div style={{ marginLeft: '0.5rem', color: 'white', fontSize: '0.8rem' }}>
                    ▼
                </div>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '200px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    marginTop: '0.5rem',
                    overflow: 'hidden'
                }}>
                    <button 
                        onClick={() => {
                            onUpdateDetails();
                            setIsOpen(false);
                        }}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '1rem',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'white',
                            color: '#2c3e50',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f1f2f6',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >
                        Update Details
                    </button>
                    <button 
                        onClick={() => {
                            onLogout();
                            setIsOpen(false);
                        }}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '1rem',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'white',
                            color: '#e74c3c',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fff5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
