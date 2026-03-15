import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        document.title = "404 — Página não encontrada";
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#080c1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#fff',
            padding: '2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Dot background */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(124, 111, 250, 0.09) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                pointerEvents: 'none'
            }} />

            {/* Ambient glow */}
            <div style={{
                position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '400px',
                background: 'radial-gradient(circle, rgba(124, 111, 250, 0.1) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* 404 */}
                <div style={{
                    fontSize: 'clamp(6rem, 20vw, 12rem)',
                    fontWeight: '900',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #7c6ffa, #f43f8e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    filter: glitch ? 'blur(2px)' : 'none',
                    transform: glitch ? 'translate(3px, -2px)' : 'none',
                    transition: 'filter 0.1s, transform 0.1s',
                    marginBottom: '1rem'
                }}>
                    404
                </div>

                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 16px',
                    background: 'rgba(124, 111, 250, 0.1)',
                    border: '1px solid rgba(124, 111, 250, 0.3)',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    color: '#7c6ffa',
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    marginBottom: '2rem'
                }}>
                    PÁGINA NÃO ENCONTRADA
                </div>

                <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: '600', marginBottom: '1rem', color: '#f8fafc' }}>
                    Ops! Esta rota não existe.
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '3rem', maxWidth: '400px', lineHeight: 1.7 }}>
                    A página que você está procurando foi movida, deletada ou nunca existiu.
                </p>

                <Link to="/" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '14px 36px',
                    background: 'linear-gradient(135deg, #7c6ffa, #f43f8e)',
                    color: '#fff',
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 10px 30px -5px rgba(124, 111, 250, 0.5)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(124, 111, 250, 0.6)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(124, 111, 250, 0.5)'; }}
                >
                    ← Voltar ao início
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
