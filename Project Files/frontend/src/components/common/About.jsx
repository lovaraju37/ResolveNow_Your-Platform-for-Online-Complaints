import React from 'react';
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
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';

const About = ({ open, onClose }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
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
                    <InfoIcon color="primary" />
                    <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>About ResolveNow</span>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent style={{ padding: '1.5rem' }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant="body1" style={{ color: '#34495e', lineHeight: 1.6 }}>
                        ResolveNow is a comprehensive platform designed to streamline the process of reporting and tracking online complaints. Our mission is to bridge the gap between customers and service providers, ensuring every issue is heard and addressed promptly.
                    </Typography>

                    <Typography variant="h6" style={{ color: '#2c3e50', fontWeight: 'bold', marginTop: '0.5rem' }}>
                        Key Features:
                    </Typography>
                    <Box component="ul" style={{ paddingLeft: '1.2rem', margin: 0, color: '#34495e' }}>
                        <li><Typography variant="body2">Easy complaint registration with file attachments.</Typography></li>
                        <li><Typography variant="body2">Real-time status tracking for all your requests.</Typography></li>
                        <li><Typography variant="body2">Direct communication with support agents via built-in chat.</Typography></li>
                        <li><Typography variant="body2">Automated notifications for status updates and new messages.</Typography></li>
                        <li><Typography variant="body2">Service rating and feedback system to ensure quality support.</Typography></li>
                    </Box>

                    <Typography variant="body2" style={{ color: '#7f8c8d', fontStyle: 'italic', marginTop: '1rem' }}>
                        Version 1.0.0 | © {new Date().getFullYear()} ResolveNow Team
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions style={{ padding: '1rem 1.5rem', borderTop: '1px solid #eee' }}>
                <Button 
                    onClick={onClose} 
                    variant="contained" 
                    style={{ backgroundColor: '#3498db', textTransform: 'none' }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default About;
