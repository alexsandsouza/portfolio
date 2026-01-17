import React, { useState, useEffect } from 'react';

const Navbar = ({ triggerMatrix }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900);
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Sobre', href: '#about' },
        { name: 'Expertise', href: '#backend' },
        { name: 'Experiência', href: '#experience' },
        { name: 'Projetos', href: '#projects' },
    ];

    return (
        <nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                height: '80px',
                display: 'flex',
                alignItems: 'center'
            }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <a href="#" onDoubleClick={(e) => { e.preventDefault(); if (triggerMatrix) triggerMatrix(); }} className="dev-logo notranslate" translate="no" style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    fontFamily: "'JetBrains Mono', monospace", // Code font
                    color: '#fff',
                    letterSpacing: '-0.03em',
                    position: 'relative',
                    zIndex: 1001,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#1e293b', // Solid dark for code look
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                }}>
                    <span style={{ color: '#c678dd' }}>const</span> {/* Purple for const */}
                    <span style={{ color: '#e5c07b' }}>Prof</span> {/* Yellow/Gold for Variable */}
                    <span style={{ color: '#abb2bf' }}>=</span>
                    <span style={{ color: '#98c379' }}>'Alexsander'</span> {/* Green for String */}
                    <span className="blinking-cursor">_</span>

                    {/* Tooltip on Hover */}
                    <div className="logo-tooltip">
                        <span style={{ color: '#61afef' }}>role:</span> <span style={{ color: '#98c379' }}>'Tech Educator'</span>
                    </div>
                </a>

                <style>{`
                    .navbar {
                        background: transparent;
                        transition: all 0.3s ease;
                        border-bottom: 1px solid transparent;
                    }
                    .navbar.scrolled {
                        background: rgba(15, 23, 42, 0.85); /* Semitransparent body color */
                        border-bottom: none;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                        backdrop-filter: blur(10px);
                    }
                    [data-theme="light"] .navbar.scrolled {
                        background: #ffffff !important;
                        backdrop-filter: none !important;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;
                    }

                    .dev-logo:hover {
                        background: rgba(30, 41, 59, 0.9) !important;
                        border-color: rgba(99, 102, 241, 0.5) !important;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                    }
                    .blinking-cursor {
                        display: inline-block;
                        width: 8px;
                        height: 1.2rem;
                        background: var(--primary-color);
                        animation: blink 1s step-end infinite;
                        margin-left: 2px;
                    }
                    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                    .logo-tooltip {
                        position: absolute;
                        bottom: -40px;
                        left: 0;
                        background: #282c34;
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 0.8rem;
                        white-space: nowrap;
                        opacity: 0;
                        transform: translateY(-10px);
                        transition: all 0.3s ease;
                        pointer-events: none;
                        border: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    }
                    .logo-tooltip::before {
                        content: '';
                        position: absolute;
                        top: -4px;
                        left: 20px;
                        width: 8px;
                        height: 8px;
                        background: #282c34;
                        transform: rotate(45deg);
                        border-left: 1px solid rgba(255,255,255,0.1);
                        border-top: 1px solid rgba(255,255,255,0.1);
                    }
                    .dev-logo:hover .logo-tooltip {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `}</style>

                {/* Desktop Nav */}
                {/* Desktop Nav - JS Guard */}
                {
                    !isMobile && (
                        <div className="desktop-nav">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="nav-link">
                                    {link.name}
                                </a>
                            ))}
                            <a href="/resume.pdf" target="_blank" className="nav-link" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                CV <span style={{ fontSize: '1.1em' }}>↓</span>
                            </a>
                            <a href="#contact" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}>
                                Contato
                            </a>
                        </div>
                    )
                }

                {/* Mobile Toggle Button */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu"
                >
                    <div style={{ width: '24px', height: '2px', background: 'var(--text-heading)', marginBottom: '6px', transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none', transition: '0.3s' }}></div>
                    <div style={{ width: '24px', height: '2px', background: 'var(--text-heading)', opacity: isOpen ? 0 : 1, transition: '0.3s' }}></div>
                    <div style={{ width: '24px', height: '2px', background: 'var(--text-heading)', marginTop: '6px', transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none', transition: '0.3s' }}></div>
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="mobile-link"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a href="/resume.pdf" target="_blank" className="mobile-link" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        CV <span style={{ fontSize: '0.8em' }}>↓</span>
                    </a>
                    <a href="#contact" onClick={() => setIsOpen(false)} className="mobile-link" style={{ color: 'var(--primary-color)' }}>Contato</a>
                </div>
            </div>

            <style>{`
                .desktop-nav {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .nav-link {
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                    transition: color 0.2s;
                    text-decoration: none;
                }
                .nav-link:hover {
                    color: var(--text-heading);
                }
                .mobile-toggle {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    z-index: 10001; /* Above mobile menu (10000) */
                    padding: 0.5rem;
                }
                .mobile-menu {
                    display: none; /* Hide on desktop */
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: #0f172a !important; /* Force solid dark background */
                    height: 100vh; /* Ensure full height */
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 2rem;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 10000;
                }
                @media (max-width: 900px) {
                    .mobile-menu { display: flex; }
                }
                [data-theme="light"] .mobile-menu {
                    background: #f8fafc !important;
                }
                .mobile-menu.open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                .mobile-link {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--text-heading);
                    text-decoration: none;
                }

                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block; }
                    /* .container { justify-content: center !important; } Removed to fix overlap */
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
