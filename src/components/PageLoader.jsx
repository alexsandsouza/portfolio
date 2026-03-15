import React from 'react';

const PageLoader = () => (
    <div style={{
        position: 'fixed',
        inset: 0,
        background: '#080c1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: '1.5rem'
    }}>
        <div style={{
            position: 'relative',
            width: '64px',
            height: '64px'
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '3px solid rgba(124, 111, 250, 0.15)',
                borderTop: '3px solid #7c6ffa',
                animation: 'loaderSpin 0.8s linear infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                inset: '8px',
                borderRadius: '50%',
                border: '2px solid rgba(0, 212, 255, 0.15)',
                borderBottom: '2px solid #00d4ff',
                animation: 'loaderSpin 1.2s linear infinite reverse'
            }}></div>
        </div>
        <span style={{
            color: 'var(--primary-color, #7c6ffa)',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            opacity: 0.7,
            animation: 'loaderPulse 1.5s ease-in-out infinite'
        }}>Carregando...</span>
        <style>{`
            @keyframes loaderSpin { 100% { transform: rotate(360deg); } }
            @keyframes loaderPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        `}</style>
    </div>
);

export default PageLoader;
