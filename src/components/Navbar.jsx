import React, { useState, useEffect } from 'react';
import { QrCode, X, Grid } from 'lucide-react';

const Navbar = ({ triggerMatrix }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showApps, setShowApps] = useState(false);

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
                top: '40px', // Adjusted for TopBanner
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
                            <a href="/mentoria" className="btn" style={{
                                padding: '0.6rem 1.5rem',
                                fontSize: '0.9rem',
                                marginLeft: '1rem',
                                whiteSpace: 'nowrap',
                                background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                            }}>
                                Mentoria 🚀
                            </a>
                            <a href="#contact" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}>
                                Contato
                            </a>
                            <button
                                onClick={() => setShowQR(true)}
                                className="nav-link"
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                title="Gerar QR Code"
                            >
                                <QrCode size={20} />
                            </button>

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowApps(!showApps)}
                                    className="nav-link"
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}
                                    title="Ecossistema Alexsander"
                                >
                                    <Grid size={20} />
                                </button>
                                {showApps && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '140%',
                                        right: '-10px',
                                        width: '280px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        padding: '1rem',
                                        zIndex: 10005,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.8rem'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                            Navegar no Ecossistema
                                        </div>

                                        <a href="https://ad-academy-one.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: '#0ea5e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>AO</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Academy One</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Formação Cisco</div>
                                            </div>
                                        </a>

                                        <a href="https://ad-academy-treinamentos.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: '#ec4899', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>TR</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Treinamentos</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Livraria Digital</div>
                                            </div>
                                        </a>

                                        <style>{`.app-link:hover { background: rgba(255,255,255,0.05); }`}</style>
                                    </div>
                                )}
                            </div>
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
                    <a href="/mentoria" onClick={() => setIsOpen(false)} className="mobile-link" style={{ color: '#ec4899' }}>Mentoria 🚀</a>
                    <a href="#contact" onClick={() => setIsOpen(false)} className="mobile-link" style={{ color: 'var(--primary-color)' }}>Contato</a>

                    {/* Mobile Apps Section */}
                    <div style={{ width: '100%', padding: '0 2rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>Ecossistema</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <a href="https://ad-academy-one.vercel.app" target="_blank" className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                                <div style={{ width: '30px', height: '30px', background: '#0ea5e9', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>AO</div>
                                <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Academy One</span>
                            </a>
                            <a href="https://ad-academy-treinamentos.vercel.app" target="_blank" className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                                <div style={{ width: '30px', height: '30px', background: '#ec4899', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>TR</div>
                                <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Treinamentos</span>
                            </a>
                        </div>
                    </div>

                    <button onClick={() => { setShowQR(true); setIsOpen(false); }} className="mobile-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)', marginTop: '1rem' }}>
                        <QrCode size={24} /> Compartilhar
                    </button>
                </div>

                {/* QR Code Modal */}
                {showQR && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 10002,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setShowQR(false)}>
                        <div style={{
                            background: '#fff', padding: '2rem', borderRadius: '20px',
                            textAlign: 'center', position: 'relative', maxWidth: '90%', width: '300px'
                        }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowQR(false)} style={{
                                position: 'absolute', top: '10px', right: '10px',
                                background: 'transparent', border: 'none', cursor: 'pointer', color: '#333'
                            }}>
                                <X size={24} />
                            </button>
                            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Scan Me! 📱</h3>
                            <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', display: 'inline-block' }}>
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://alexsander-farias.vercel.app"
                                    alt="QR Code"
                                    style={{ display: 'block' }}
                                />
                            </div>
                            <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.9rem' }}>
                                Compartilhe o portfólio facilmente.
                            </p>
                        </div>
                    </div>
                )}
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
        </nav >
    );
};

export default Navbar;
