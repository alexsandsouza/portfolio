import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            padding: '1rem 0',
            background: scrolled ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href="#" style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
                    Alex.<span style={{ color: 'var(--primary-color)' }}>Tech</span>
                </a>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#about" style={{ color: 'var(--text-text-primary)' }}>Sobre</a>
                    <a href="#projects" style={{ color: 'var(--text-text-primary)' }}>Projetos</a>
                    <a href="#services" style={{ color: 'var(--text-text-primary)' }}>Serviços</a>
                    <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Contato</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
