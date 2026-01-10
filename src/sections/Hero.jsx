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
            <div style={{
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
                style={{
                    width: '80%',
                    height: '80%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '4px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                    position: 'relative',
                    zIndex: 2
                }}
            />

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
                @media (max-width: 768px) {
                     div[style*="width: 400px"] { width: 300px !important; height: 300px !important; margin: 0 auto; }
                }
            `}</style>
        </div>
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

            <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                    <Reveal>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                            {/* Animated Gradient Border */}
                            <div style={{
                                position: 'absolute', inset: -2, borderRadius: '50px',
                                background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color), var(--secondary-color), var(--primary-color))',
                                backgroundSize: '300% 100%',
                                animation: 'borderFlow 4s linear infinite',
                                filter: 'blur(3px)',
                                opacity: 0.7
                            }}></div>

                            {/* Inner Content */}
                            <div style={{
                                position: 'relative',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '0.8rem 1.8rem',
                                background: 'var(--surface-color)',
                                borderRadius: '50px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <span style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '10px', height: '10px',
                                    background: 'var(--accent-color)',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 10px var(--accent-color)',
                                    animation: 'pulseFast 1.5s infinite'
                                }}></span>

                                <span style={{
                                    color: 'var(--text-primary)',
                                    fontWeight: '700',
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    fontSize: '0.85rem',
                                    fontFamily: 'monospace'
                                }}>
                                    {hero.positioning}
                                </span>
                            </div>
                            <style>{`
                                @keyframes borderFlow { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
                                @keyframes pulseFast { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                            `}</style>
                        </div>
                    </Reveal>

                    <Reveal delay={200}>
                        <h1 style={{ marginBottom: '1.5rem', lineHeight: '1.1', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                            <span style={{ display: 'block', fontSize: '0.5em', color: 'var(--text-secondary)', fontWeight: '400', marginBottom: '0.5rem' }}>{greeting}, eu sou o</span>
                            <span className="text-gradient" style={{
                                backgroundSize: '200% auto',
                                animation: 'shine 5s linear infinite'
                            }}>
                                {hero.name}
                            </span>
                        </h1>
                        <h2 style={{
                            fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                            textAlign: 'left',
                            fontWeight: '400',
                            color: 'var(--text-heading)',
                            opacity: 0.9,
                            borderLeft: '4px solid var(--secondary-color)',
                            paddingLeft: '1.5rem',
                            marginBottom: '2.5rem'
                        }}>
                            {hero.title.split('\n').map((item, i) => (
                                <span key={i} style={{ display: 'block', marginBottom: '0.5rem' }}>{item.trim()}</span>
                            ))}
                        </h2>
                    </Reveal>

                    <Reveal delay={400}>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <a href="#projects" className="btn btn-primary" style={{ position: 'relative', overflow: 'hidden' }}>
                                <span style={{ position: 'relative', zIndex: 1 }}>{hero.ctaPrimary}</span>
                                <div style={{
                                    position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                    animation: 'slideRight 3s infinite'
                                }}></div>
                            </a>
                            <a href="#contact" className="btn btn-secondary">
                                {hero.ctaSecondary}
                            </a>
                        </div>
                    </Reveal>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Reveal delay={600}>
                        <GlowingProfile />
                    </Reveal>
                </div>
            </div>

            <style>{`
                @keyframes shine {
                    to { background-position: 200% center; }
                }
                @media (max-width: 900px) {
                    .container { grid-template-columns: 1fr !important; text-align: center; }
                    .container > div:first-child { text-align: center !important; order: 2; margin-top: 2rem; }
                    .container > div:last-child { order: 1; }
                    h2 { border-left: none !important; padding-left: 0 !important; border-bottom: 4px solid var(--secondary-color); padding-bottom: 1.5rem; display: inline-block; text-align: center !important; }
                    .btn { width: 100%; margin: 0.5rem 0; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
