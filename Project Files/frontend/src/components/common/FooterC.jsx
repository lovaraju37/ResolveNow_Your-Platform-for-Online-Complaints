import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography,
    Box,
    IconButton
} from '@mui/material';
import { 
    Close as CloseIcon, 
    Email as EmailIcon, 
    Phone as PhoneIcon, 
    LocationOn as LocationIcon 
} from '@mui/icons-material';
import About from './About';

const FooterC = () => {
    const navigate = useNavigate();
    const [aboutOpen, setAboutOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const currentYear = new Date().getFullYear();
    
    const user = (() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    })();

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.userType === 'Customer') return '/customer-home';
        if (user.userType === 'Agent') return '/agent-home';
        if (user.userType === 'Admin') return '/admin-home';
        return '/';
    };

    const footerStyle = {
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        padding: '1.5rem 0',
        marginTop: 'auto',
        width: '100%',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };

    const linkStyle = {
        color: '#3498db',
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        fontWeight: '500'
    };

    const dotStyle = {
        color: '#7f8c8d',
        fontSize: '1rem',
        userSelect: 'none',
        display: 'inline-block',
        margin: '0 8px'
    };

    const handleLinkHover = (e, isHover) => {
        e.target.style.color = isHover ? '#ecf0f1' : '#3498db';
        e.target.style.textDecoration = isHover ? 'underline' : 'none';
    };

    const bottomStyle = {
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#7f8c8d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem'
    };

    return (
        <footer style={footerStyle}>
            <div style={bottomStyle}>
                {/* Horizontal Links */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {user ? (
                        <>
                            <span 
                                style={linkStyle} 
                                onClick={() => navigate(getDashboardLink())}
                                onMouseOver={(e) => handleLinkHover(e, true)}
                                onMouseOut={(e) => handleLinkHover(e, false)}
                            >
                                Home
                            </span>
                            <span style={dotStyle}>•</span>
                            <span 
                                style={linkStyle} 
                                onClick={() => setAboutOpen(true)}
                                onMouseOver={(e) => handleLinkHover(e, true)}
                                onMouseOut={(e) => handleLinkHover(e, false)}
                            >
                                About
                            </span>
                            <span style={dotStyle}>•</span>
                            <span 
                                style={linkStyle} 
                                onClick={() => navigate('/update-profile')}
                                onMouseOver={(e) => handleLinkHover(e, true)}
                                onMouseOut={(e) => handleLinkHover(e, false)}
                            >
                                Profile
                            </span>
                        </>
                    ) : (
                        <>
                            <span 
                                style={linkStyle} 
                                onClick={() => navigate('/')}
                                onMouseOver={(e) => handleLinkHover(e, true)}
                                onMouseOut={(e) => handleLinkHover(e, false)}
                            >
                                Home
                            </span>
                            <span style={dotStyle}>•</span>
                            <span 
                                style={linkStyle} 
                                onClick={() => setAboutOpen(true)}
                                onMouseOver={(e) => handleLinkHover(e, true)}
                                onMouseOut={(e) => handleLinkHover(e, false)}
                            >
                                About
                            </span>
                            <span style={dotStyle}>•</span>
                            <span 
                                style={linkStyle} 
                                onClick={() => navigate('/login')}
                                onMouseOver={(e) => handleLinkHover(e, true)}
                                onMouseOut={(e) => handleLinkHover(e, false)}
                            >
                                Login
                            </span>
                            <span style={dotStyle}>•</span>
                            <span 
                                style={linkStyle} 
                                onClick={() => navigate('/signup')}
                                onMouseOver={(e) => handleLinkHover(e, true)}
                                onMouseOut={(e) => handleLinkHover(e, false)}
                            >
                                SignUp
                            </span>
                        </>
                    )}
                    <span style={dotStyle}>•</span>
                    <span 
                        style={linkStyle}
                        onClick={() => setContactOpen(true)}
                        onMouseOver={(e) => handleLinkHover(e, true)}
                        onMouseOut={(e) => handleLinkHover(e, false)}
                    >
                        Contact me
                    </span>
                </div>

                <div>&copy; {currentYear} ResolveNow. All rights reserved.</div>
            </div>

            <About open={aboutOpen} onClose={() => setAboutOpen(false)} />

            <Dialog 
                open={contactOpen} 
                onClose={() => setContactOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: { borderRadius: '12px' }
                }}
            >
                <DialogTitle style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    padding: '1rem 1.5rem'
                }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon color="primary" />
                        <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Contact Us</span>
                    </Box>
                    <IconButton onClick={() => setContactOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{ padding: '1.5rem' }}>
                    <Box display="flex" flexDirection="column" gap={2.5}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <EmailIcon style={{ color: '#3498db' }} />
                            <Box>
                                <Typography variant="caption" color="textSecondary" style={{ display: 'block' }}>Email</Typography>
                                <Typography variant="body1" style={{ color: '#2c3e50' }}>support@resolvenow.com</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <PhoneIcon style={{ color: '#3498db' }} />
                            <Box>
                                <Typography variant="caption" color="textSecondary" style={{ display: 'block' }}>Phone</Typography>
                                <Typography variant="body1" style={{ color: '#2c3e50' }}>+1 (555) 123-4567</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <LocationIcon style={{ color: '#3498db' }} />
                            <Box>
                                <Typography variant="caption" color="textSecondary" style={{ display: 'block' }}>Address</Typography>
                                <Typography variant="body1" style={{ color: '#2c3e50' }}>123 Support St, Tech City</Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions style={{ padding: '1rem 1.5rem', borderTop: '1px solid #eee' }}>
                    <Button 
                        onClick={() => setContactOpen(false)} 
                        variant="contained" 
                        style={{ backgroundColor: '#3498db', textTransform: 'none' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </footer>
    );
};

export default FooterC;
