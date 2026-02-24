import React from 'react';

const LoadingSpinner = ({ size = 'full' }) => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: size === 'full' ? '100vh' : '200px',
        width: '100%',
        backgroundColor: size === 'full' ? 'var(--navy)' : 'transparent'
    };

    const spinnerStyle = {
        width: '50px',
        height: '50px',
        border: '4px solid rgba(124, 58, 237, 0.2)',
        borderTopColor: 'var(--violet)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
        </div>
    );
};

export default LoadingSpinner;
