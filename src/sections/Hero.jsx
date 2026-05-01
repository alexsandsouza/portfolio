import React, { useEffect, useState } from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const TechBackground = () => (
    <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
    }}>
        {/* Grid Overlay */}
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.5,
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}></div>

        {/* Ambient Glow */}
        <div style={{
            position: 'absolute',
            top: '-20%', right: '-10%',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.8,
            animation: 'pulseGlow 8s ease-in-out infinite alternate'
        }}></div>
        <style>{`@keyframes pulseGlow { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.2); opacity: 0.8; } }`}</style>

        {/* Moving Tech Lines */}
        <div className="tech-line" style={{ top: '20%', left: '-10%', animationDelay: '0s' }}></div>
        <div className="tech-line" style={{ top: '60%', left: '-10%', animationDelay: '2s' }}></div>
        <div className="tech-line" style={{ top: '80%', left: '-10%', animationDelay: '4s' }}></div>

        <style>{`
            .tech-line {
                position: absolute;
                height: 1px;
                width: 200px;
                background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
                animation: slideRight 8s linear infinite;
                opacity: 0.7;
                box-shadow: 0 0 10px var(--primary-color);
            }
            @keyframes slideRight {
                0% { left: -20%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { left: 120%; opacity: 0; }
            }
        `}</style>
    </div>
);

const GlowingProfile = () => {
    const { ref, style } = useHoverCard({ maxRotation: 10, scale: 1.05 });

    return (
        <div ref={ref} style={{
            position: 'relative',
            width: '400px',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style.transform ? { transform: style.transform, transition: style.transition } : {}
        }}>
            {/* Outer Rotating Ring */}
            <div className="spin-ring" style={{
                position: 'absolute',
                width: '100%', height: '100%',
                borderRadius: '50%',
                border: '1px dashed rgba(99, 102, 241, 0.3)',
                animation: 'spin 20s linear infinite'
            }}></div>

            {/* Inner Reverse Rotating Ring */}
            <div className="spin-ring-reverse" style={{
                position: 'absolute',
                width: '90%', height: '90%',
                borderRadius: '50%',
                borderTop: '2px solid var(--secondary-color)',
                borderBottom: '2px solid var(--accent-color)',
                borderLeft: '2px solid transparent',
                borderRight: '2px solid transparent',
                animation: 'spinReverse 15s linear infinite',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
            }}></div>

            {/* Glowing Background behind Image */}
            <div className="profile-glow" style={{
                position: 'absolute',
                width: '85%', height: '85%',
                background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
                opacity: 0.2,
                filter: 'blur(40px)',
                animation: 'pulse 3s ease-in-out infinite'
            }}></div>

            {/* Main Image */}
            <img
                src="/Foto_Perfil_Round.png"
                alt="Prof. Alexsander Farias"
                width={320}
                height={320}
                loading="eager"
                className="hero-profile-img"
                style={{
                    width: '80%',
                    height: '80%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    position: 'relative',
                    zIndex: 2
                }}
            />

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }

                .hero-profile-img {
                    border: 4px solid rgba(255,255,255,0.1);
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);
                }
                [data-theme="light"] .hero-profile-img {
                    border: 4px solid rgba(124, 111, 250, 0.25);
                    box-shadow: 0 10px 40px rgba(100, 116, 139, 0.2), 0 0 0 1px rgba(148, 163, 184, 0.1);
                }
                [data-theme="light"] .profile-glow {
                    opacity: 0.15 !important;
                }
                [data-theme="light"] .spin-ring {
                    border-color: rgba(99, 102, 241, 0.2) !important;
                }
                [data-theme="light"] .spin-ring-reverse {
                    box-shadow: 0 0 15px rgba(99, 102, 241, 0.15) !important;
                }
                @media (max-width: 768px) {
                     div[style*="width: 400px"] { width: 300px !important; height: 300px !important; margin: 0 auto; }
                }
            `}</style>
        </div>
    );
};

const Typewriter = ({ text, speed = 100, delay = 1000 }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    useEffect(() => {
        const i = loopNum % text.length;
        const fullText = text[i];

        const handleType = () => {
            setCurrentText(isDeleting
                ? fullText.substring(0, currentText.length - 1)
                : fullText.substring(0, currentText.length + 1)
            );

            if (!isDeleting && currentText === fullText) {
                setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, isDeleting ? 30 : speed);

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, loopNum, text, speed, delay]);

    return (
        <span>
            {currentText}
            <span className="cursor" style={{ color: 'var(--accent-color)' }}>|</span>
        </span>
    );
};

const Hero = () => {
    const { hero } = portfolioContent;
    const [greeting, setGreeting] = useState('Olá');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);

    return (
        <section className="section" style={{
            minHeight: '95vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '120px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <TechBackground />

            <div className="container grid-2-col hero-container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'left' }} className="hero-content">
                    <Reveal>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                            {/* Glassmorphism Card */}
                            <div style={{
                                position: 'relative',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 24px',
                                background: 'var(--card-bg)', // Use CSS variable for theme awareness
                                backdropFilter: 'blur(10px)',
                                borderRadius: '50px',
                                border: '1px solid var(--card-border)', // Use CSS variable
                                boxShadow: 'var(--card-shadow)' // Use CSS variable
                            }}>
                                <span style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '8px', height: '8px',
                                    background: 'var(--accent-color)', // Use theme accent
                                    borderRadius: '50%',
                                    boxShadow: '0 0 12px var(--accent-color)',
                                    animation: 'pulseFast 2s infinite'
                                }}></span>

                                <span style={{
                                    color: 'var(--text-heading)', // Use theme text color
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    fontSize: '0.85rem',
                                    fontFamily: 'monospace'
                                }}>
                                    {hero.positioning}
                                </span>
                            </div>
                            <style>{`
                                @keyframes pulseFast { 0% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.6; transform: scale(1); } }
                            `}</style>
                        </div>
                    </Reveal>

                    <Reveal delay={200}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            color: '#22c55e',
                            fontWeight: '600',
                            marginBottom: '1.5rem'
                        }}>
                            <span style={{
                                width: '8px', height: '8px',
                                background: '#22c55e',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #22c55e',
                                animation: 'pulseGreen 2s infinite'
                            }}></span>
                            Disponível para Projetos
                        </div>
                        <style>{`@keyframes pulseGreen { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>

                        <h1 style={{ marginBottom: '1.5rem', lineHeight: '1.1', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                            <span style={{ display: 'block', fontSize: '0.5em', color: 'var(--text-secondary)', fontWeight: '400', marginBottom: '0.5rem' }}>{greeting}, eu sou o</span>
                            <span className="text-gradient" style={{
                                backgroundSize: '200% auto',
                                animation: 'shine 5s linear infinite'
                            }}>
                                {hero.name}
                            </span>
                        </h1>
                        <h2 className="hero-subtitle" style={{
                            fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                            textAlign: 'left',
                            fontWeight: '400',
                            color: 'var(--text-heading)',
                            opacity: 0.9,
                            borderLeft: '4px solid var(--secondary-color)',
                            paddingLeft: '1.5rem',
                            marginBottom: '2.5rem',
                            minHeight: '2em', // Prevent layout shift
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Typewriter text={hero.title.split('\n')} speed={50} delay={1500} />
                        </h2>
                    </Reveal>

                    <style>{`
                        @keyframes blink { 50% { opacity: 0; } }
                        .cursor { animation: blink 1s step-end infinite; }
                    `}</style>

                    <Reveal delay={400}>
                        <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <a href="/mentoria" className="btn" style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                                borderRadius: '30px',
                                padding: '12px 32px',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                letterSpacing: '0.5px',
                                boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.5)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(168, 85, 247, 0.6)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(168, 85, 247, 0.5)'; }}
                            >
                                Mentoria: Iniciar em TI 🚀
                            </a>

                            <a href="/hackersdobem" className="btn" style={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
                                borderRadius: '30px',
                                padding: '12px 32px',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                letterSpacing: '0.5px',
                                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(16, 185, 129, 0.6)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.5)'; }}
                            >
                                Hackers do Bem 🛡️
                            </a>

                            <a href="/fametro" className="btn" style={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                borderRadius: '30px',
                                padding: '12px 32px',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                letterSpacing: '0.5px',
                                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(59, 130, 246, 0.6)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.5)'; }}
                            >
                                Hub Fametro 🎓
                            </a>

                            <a href="https://adacademynet.vercel.app" target="_blank" rel="noopener noreferrer" className="btn" style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                                borderRadius: '30px',
                                padding: '12px 32px',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                letterSpacing: '0.5px',
                                boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(139, 92, 246, 0.6)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(139, 92, 246, 0.5)'; }}
                            >
                                AD Academy 🌐
                            </a>

                            <a href="#projects" style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                padding: '10px 20px',
                                fontWeight: '500',
                                borderBottom: '1px solid transparent',
                                transition: 'all 0.3s'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderBottomColor = 'var(--text-primary)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                            >
                                {hero.ctaPrimary}
                            </a>
                        </div>
                    </Reveal>
                </div>

                <div className="flex-center">
                    <Reveal delay={600}>
                        <GlowingProfile />
                    </Reveal>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2,
                opacity: 0.6
            }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace' }}>scroll</span>
                <div style={{ animation: 'heroBounce 1.8s ease-in-out infinite' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>

            <style>{`
                @keyframes heroBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(6px); }
                }
                @keyframes shine {
                    to { background-position: 200% center; }
                }
                
                /* Mobile Specific Overrides controlled by class logic */
                @media (max-width: 900px) {
                    .hero-container {
                        /* grid-2-col handles column stack */
                         /* We want to center text on mobile for Hero usually */
                        text-align: center !important;
                    }
                    .hero-content {
                        order: 2;
                        text-align: center !important;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .hero-container > div:last-child {
                        order: 1;
                        margin-bottom: 2rem;
                    }
                    
                    .hero-subtitle {
                        border-left: none !important;
                        padding-left: 0 !important;
                        border-bottom: 4px solid var(--secondary-color);
                        padding-bottom: 1rem;
                        justify-content: center;
                        text-align: center !important;
                        margin-left: auto;
                        margin-right: auto;
                        display: inline-flex;
                    }
                    
                    .hero-buttons {
                        justify-content: center;
                    }
                    .btn { width: 100%; margin: 0.5rem 0; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
