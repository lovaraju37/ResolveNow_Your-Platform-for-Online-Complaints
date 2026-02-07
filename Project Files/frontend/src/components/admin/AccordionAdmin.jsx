import React, { useState } from 'react';

const AccordionAdmin = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={{ marginBottom: '1rem', border: '1px solid #e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
            <div 
                onClick={toggleAccordion}
                style={{
                    backgroundColor: '#e6f2ff', // Light blue background like the image
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: '500',
                    color: '#2c3e50'
                }}
            >
                <span>{title}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div style={{ padding: '1rem', backgroundColor: '#f9f9f9' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default AccordionAdmin;
