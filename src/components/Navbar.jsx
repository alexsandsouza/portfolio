import React, { useState, useEffect } from 'react';
import { QrCode, X, Grid } from 'lucide-react';

const Navbar = ({ triggerMatrix }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showApps, setShowApps] = useState(false);

    useEffect(() => {
        // Hamburger antes de os CTAs serem cortados na borda direita
        const handleResize = () => setIsMobile(window.innerWidth <= 1360);
        handleResize();
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

    // Trava o scroll do body quando o menu mobile está aberto
    useEffect(() => {
        if (isOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
        return undefined;
    }, [isOpen]);

    const navLinks = [
        { name: 'Sobre', href: '#about' },
        { name: 'Expertise', href: '#backend' },
        { name: 'Experiência', href: '#experience' },
        { name: 'Projetos', href: '#projects' },
        { name: 'Diferenciais', href: '#behavioral' },
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
            <div className="container navbar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', gap: '1rem', overflow: 'visible' }}>
                <a href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        // Easter Egg Trigger Logic
                        if (!window.clickCount) window.clickCount = 0;
                        window.clickCount++;

                        if (window.clickTimer) clearTimeout(window.clickTimer);
                        window.clickTimer = setTimeout(() => { window.clickCount = 0; }, 1000);

                        if (window.clickCount >= 5) {
                            window.dispatchEvent(new Event('trigger-challenge'));
                            window.clickCount = 0;
                        }

                        if (triggerMatrix && window.clickCount === 2) triggerMatrix(); // Keep double click behavior mostly
                    }}
                    className="dev-logo notranslate" translate="no" style={{
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        fontFamily: "'JetBrains Mono', monospace", // Code font
                        color: '#fff',
                        letterSpacing: '-0.03em',
                        position: 'relative',
                        zIndex: 1001,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'var(--logo-bg)', // Use variable
                        border: '1px solid var(--logo-border)',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        userSelect: 'none',
                        flexShrink: 0
                    }}>
                    <span style={{ color: 'var(--logo-keyword)' }}>const</span>
                    <span style={{ color: 'var(--logo-var)' }}>Prof</span>
                    <span style={{ color: 'var(--logo-operator)' }}>=</span>
                    <span style={{ color: 'var(--logo-string)' }}>'Alexsander'</span>
                    <span className="blinking-cursor">_</span>

                    {/* Tooltip on Hover */}
                    <div className="logo-tooltip">
                        <span style={{ color: '#61afef' }}>role:</span> <span style={{ color: '#98c379' }}>'Bug Hunter?'</span>
                    </div>
                </a>

                <style>{`
                    :root {
                        --logo-bg: #1e293b;
                        --logo-border: rgba(255, 255, 255, 0.1);
                        --logo-keyword: #c678dd;
                        --logo-var: #e5c07b;
                        --logo-operator: #abb2bf;
                        --logo-string: #98c379;
                    }

                    [data-theme="light"] {
                        --logo-bg: rgba(15, 23, 42, 0.05);
                        --logo-border: rgba(15, 23, 42, 0.1);
                        --logo-keyword: #a626a4;
                        --logo-var: #986801;
                        --logo-operator: #383a42;
                        --logo-string: #50a14f;
                    }

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
                        background: rgba(255, 255, 255, 0.9) !important;
                        backdrop-filter: blur(10px) !important;
                        border-bottom: 1px solid rgba(100, 116, 139, 0.1) !important;
                        box-shadow: 0 4px 20px rgba(100, 116, 139, 0.08) !important;
                    }

                    .dev-logo:hover {
                        background: var(--logo-bg) !important;
                        filter: brightness(1.1);
                        border-color: var(--primary-color) !important;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                    }
                    [data-theme="light"] .dev-logo:hover {
                         background: rgba(15, 23, 42, 0.08) !important;
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
                        z-index: 1002;
                    }
                    [data-theme="light"] .logo-tooltip {
                        background: #fff;
                        color: #383a42;
                        border: 1px solid rgba(100, 116, 139, 0.2);
                        box-shadow: 0 4px 15px rgba(100, 116, 139, 0.15);
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
                    [data-theme="light"] .logo-tooltip::before {
                        background: #fff;
                        border-color: rgba(100, 116, 139, 0.2);
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
                            <a href="/cv" target="_blank" className="nav-link" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                CV <span style={{ fontSize: '1.1em' }}>↓</span>
                            </a>
                            <a href="/teste-afinidade" title="Teste de Perfil" className="btn nav-cta" style={{
                                padding: '0.45rem 0.75rem',
                                fontSize: '0.78rem',
                                whiteSpace: 'nowrap',
                                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                                flexShrink: 0
                            }}>
                                Teste 🧬
                            </a>
                            <a href="/formacao-docente" title="Formação Docente" className="btn nav-cta" style={{
                                padding: '0.45rem 0.75rem',
                                fontSize: '0.78rem',
                                whiteSpace: 'nowrap',
                                background: 'linear-gradient(90deg, #7c3aed, #2563eb)',
                                color: 'white',
                                border: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.5)',
                                flexShrink: 0
                            }}>
                                Docente 🎓
                            </a>
                            <a href="#contact" className="btn btn-primary nav-cta" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                Contato
                            </a>
                            <button
                                onClick={() => setShowQR(true)}
                                className="nav-link nav-icon-btn"
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0.35rem' }}
                                title="Gerar QR Code"
                            >
                                <QrCode size={18} />
                            </button>

                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <button
                                    onClick={() => setShowApps(!showApps)}
                                    className="nav-link nav-icon-btn"
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.35rem' }}
                                    title="Ecossistema Alexsander"
                                >
                                    <Grid size={18} />
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

                                        <a href="https://adacademynet.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>AD</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>AD Academy <span style={{ fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a78bfa', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>NOVO</span></div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Portal de Infraestrutura de TI</div>
                                            </div>
                                        </a>

                                        <a href="https://ad-academy-treinamentos.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: '#ec4899', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>TR</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Treinamentos</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Livraria Digital</div>
                                            </div>
                                        </a>

                                        <a href="/hackersdobem" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: '#22c55e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>H</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Hackers do Bem</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Portal de Atividades</div>
                                            </div>
                                        </a>

                                        <a href="/fametro" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>F</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Hub Fametro</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Atividades e rankings</div>
                                            </div>
                                        </a>

                                        <a href="/mentoria" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: '#a855f7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Mentoria</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Próxima turma</div>
                                            </div>
                                        </a>

                                        <a href="/teste-afinidade" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>🧬</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Perfil Comportamental</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Teste IBC Coaching</div>
                                            </div>
                                        </a>

                                        <a href="/links" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }} className="app-link">
                                            <div style={{ width: '36px', height: '36px', background: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>🔗</div>
                                            <div>
                                                <div style={{ color: 'var(--text-heading)', fontWeight: '600', fontSize: '0.9rem' }}>Meus Links</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Bio / Redes Sociais</div>
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
                    aria-label="Menu de navegação"
                    aria-expanded={isOpen}
                    aria-controls="mobile-navigation-menu"
                >
                    <div style={{ width: '24px', height: '2px', background: 'var(--text-heading)', marginBottom: '6px', transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none', transition: '0.3s' }}></div>
                    <div style={{ width: '24px', height: '2px', background: 'var(--text-heading)', opacity: isOpen ? 0 : 1, transition: '0.3s' }}></div>
                    <div style={{ width: '24px', height: '2px', background: 'var(--text-heading)', marginTop: '6px', transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none', transition: '0.3s' }}></div>
                </button>

                {/* Mobile Menu Overlay */}
                <div id="mobile-navigation-menu" className={`mobile-menu ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Menu mobile">
                    <div className="mobile-menu-inner">
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
                        <a href="/cv" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="mobile-link" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            CV <span style={{ fontSize: '0.8em' }}>↓</span>
                        </a>
                        <a href="/mentoria" onClick={() => setIsOpen(false)} className="mobile-link" style={{ color: '#a855f7', fontWeight: 'bold' }}>Mentoria — próxima turma</a>
                        <a href="/formacao-docente" onClick={() => setIsOpen(false)} className="mobile-link" style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Formação Docente 2026.2 🎓</a>
                        <a href="/teste-afinidade" onClick={() => setIsOpen(false)} className="mobile-link" style={{ color: '#3b82f6' }}>Teste de Perfil 🧬</a>
                        <a href="#contact" onClick={() => setIsOpen(false)} className="mobile-link" style={{ color: 'var(--primary-color)' }}>Contato</a>

                        {/* Mobile Apps Section */}
                        <div style={{ width: '100%', padding: '0 1.25rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Ecossistema</span>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <a href="https://adacademynet.vercel.app" target="_blank" rel="noopener noreferrer" className="mobile-app-card" style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(99, 102, 241, 0.2)', gridColumn: 'span 2' }}>
                                    <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>AD</div>
                                    <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>AD Academy Net</span>
                                    <span style={{ display: 'block', color: '#a78bfa', fontSize: '0.65rem', marginTop: '2px' }}>Portal de Infraestrutura</span>
                                </a>
                                <a href="https://ad-academy-treinamentos.vercel.app" target="_blank" rel="noopener noreferrer" className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '30px', height: '30px', background: '#ec4899', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>TR</div>
                                    <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Treinamentos</span>
                                </a>
                                <a href="/mentoria" onClick={() => setIsOpen(false)} className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '30px', height: '30px', background: '#a855f7', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>M</div>
                                    <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Mentoria</span>
                                </a>
                                <a href="/hackersdobem" onClick={() => setIsOpen(false)} className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '30px', height: '30px', background: '#22c55e', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>H</div>
                                    <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Hackers do Bem</span>
                                </a>
                                <a href="/fametro" onClick={() => setIsOpen(false)} className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '30px', height: '30px', background: '#3b82f6', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>F</div>
                                    <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Hub Fametro</span>
                                </a>
                                <a href="/teste-afinidade" onClick={() => setIsOpen(false)} className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)', gridColumn: 'span 2' }}>
                                    <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>🧬</div>
                                    <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Perfil Comportamental</span>
                                    <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.65rem', marginTop: '2px' }}>Teste DNA Humano</span>
                                </a>
                                <a href="/links" onClick={() => setIsOpen(false)} className="mobile-app-card" style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--border-color)', gridColumn: 'span 2' }}>
                                    <div style={{ width: '30px', height: '30px', background: '#8b5cf6', borderRadius: '6px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>🔗</div>
                                    <span style={{ display: 'block', color: 'var(--text-heading)', fontSize: '0.8rem', fontWeight: 'bold' }}>Meus Links (Bio)</span>
                                </a>
                            </div>
                        </div>

                        <button onClick={() => { setShowQR(true); setIsOpen(false); }} className="mobile-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)', marginTop: '0.5rem', marginBottom: '2rem' }}>
                            <QrCode size={22} /> Compartilhar
                        </button>
                    </div>
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
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://alexsanderfarias\.vercel\.app"
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
                .navbar {
                    overflow: visible;
                }
                .desktop-nav {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-left: auto;
                    flex-shrink: 0;
                }
                .nav-link {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                    transition: color 0.2s;
                    text-decoration: none;
                    white-space: nowrap;
                }
                .nav-link:hover {
                    color: var(--text-heading);
                }
                .mobile-toggle {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    z-index: 10001;
                    padding: 0.5rem;
                    flex-shrink: 0;
                }
                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: #0f172a !important;
                    height: 100dvh;
                    max-height: 100dvh;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 10000;
                    overflow: hidden;
                }
                .mobile-menu-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                    padding: 5.5rem 1rem 2.5rem;
                    overscroll-behavior: contain;
                }
                @media (max-width: 1360px) {
                    .mobile-menu { display: flex; }
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block; }
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
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: var(--text-heading);
                    text-decoration: none;
                    text-align: center;
                    padding: 0.15rem 0.5rem;
                }
            `}</style>
        </nav >
    );
};

export default Navbar;
