import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const SocialNode = ({ platform, url, icon }) => {
    const { ref, style } = useHoverCard({ maxRotation: 10, scale: 1.2 });

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" ref={ref} style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
        }}>
            <div style={{
                width: '60px', height: '60px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#fff',
                boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {style.glow !== 'none' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `radial-gradient(circle at center, ${style.glow.replace('0.4', '0.5')}, transparent 70%)`,
                    }} />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>{icon}</span>
            </div>
            {/* Label on Hover */}
            <div style={{
                position: 'absolute',
                bottom: '-30px',
                fontSize: '0.8rem',
                opacity: style.transform ? 1 : 0,
                transform: style.transform ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.3s',
                color: 'var(--primary-color)',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                {platform}
            </div>
        </a>
    );
};

const Contact = () => {
    const { contact } = portfolioContent;

    return (
        <section id="contact" className="section" style={{ position: 'relative', paddingBottom: '2rem', overflow: 'hidden' }}>
            {/* Cyber Grid Floor */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%',
                background: 'linear-gradient(to top, #020617 0%, var(--bg-color) 100%)',
                zIndex: -2
            }}></div>

            <div style={{
                position: 'absolute', bottom: 0, left: '-50%', right: '-50%', height: '500px',
                backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                transform: 'perspective(500px) rotateX(60deg)',
                opacity: 0.3,
                zIndex: -1,
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
            }}></div>

            <div className="container" style={{ textAlign: 'center', maxWidth: '800px', position: 'relative', zIndex: 1 }}>
                <Reveal>
                    <div className="section-header" style={{ marginBottom: '3rem' }}>
                        {/* Signal Icon */}
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulseSignal 2s infinite' }}>📡</div>
                        <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {contact.title}
                        </h2>
                        <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {contact.text}
                        </p>
                    </div>

                    <a href="https://wa.me/5592991199999" target="_blank" rel="noopener noreferrer" className="cyber-button" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.2rem 4rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        background: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
                        transition: 'all 0.3s'
                    }}>
                        <span>{contact.cta}</span>
                        <span style={{ fontSize: '1.5rem' }}>🚀</span>

                        {/* Shimmer */}
                        <div style={{
                            position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'btnShine 3s infinite'
                        }}></div>
                    </a>
                </Reveal>

                <div style={{ marginTop: '6rem', position: 'relative' }}>
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '3rem',
                        marginBottom: '4rem'
                    }}>
                        <SocialNode platform="LinkedIn" url="#" icon="👔" />
                        <SocialNode platform="GitHub" url="#" icon="🐙" />
                        <SocialNode platform="Instagram" url="#" icon="📸" />
                        <SocialNode platform="Email" url="mailto:contato@alexsander.com" icon="📧" />
                    </div>

                    {/* Integrated Footer content */}
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: '2rem',
                        color: 'rgba(148, 163, 184, 0.6)',
                        fontSize: '0.9rem'
                    }}>
                        <p>© {new Date().getFullYear()} Prof. Alexsander Farias. Todos os direitos reservados.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            Desenvolvido com <span style={{ color: '#ef4444' }}>❤</span> e Tecnologia Vite + React
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulseSignal { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
                @keyframes btnShine { 0% { left: -100%; } 20% { left: 100%; } 100% { left: 100%; } }
                .cyber-button:hover { transform: translateY(-3px); box-shadow: 0 0 50px rgba(99, 102, 241, 0.8) !important; filter: brightness(1.2); }
            `}</style>
        </section>
    );
};

export default Contact;
