import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', // Education: Indigo -> Cyan
    'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)', // Security: Red -> Rose
    'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', // Dev: Violet -> Fuchsia
    'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'  // Innovation: Amber -> Orange
];

const icons = [
    '🎓', '💡', '🛡️', '💻'
];

const CyberCard = ({ feature, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.03 });
    const bgGradient = gradients[index % gradients.length];
    const isEven = index % 2 === 0;

    return (
        <div ref={ref} style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            position: 'relative',
            height: '100%',
            marginTop: isEven ? '0' : '40px', // Staggered layout for dynamic rhythm
            marginBottom: isEven ? '40px' : '0'
        }}>
            {/* Connection Line Top (for even) or Bottom (for odd) */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: isEven ? '100%' : 'auto',
                bottom: isEven ? 'auto' : '100%',
                width: '2px',
                height: '40px',
                background: 'linear-gradient(to bottom, var(--primary-color), transparent)',
                transform: 'translateX(-50%)',
                opacity: 0.5,
                boxShadow: '0 0 8px var(--primary-color)',
                zIndex: 0
            }}></div>

            <div className="card-glass" style={{
                height: '100%',
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
                {/* Active Neon Border on Hover */}
                <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '24px',
                    padding: '2px', // Thicker border
                    background: bgGradient,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: style.transform ? 1 : 0, // Only visible on hover
                    transition: 'opacity 0.3s'
                }}></div>

                {/* Internal Glow Effect */}
                {style.glow !== 'none' && (
                    <div style={{
                        position: 'absolute', top: -100, left: -100, right: -100, bottom: -100,
                        background: `radial-gradient(circle at center, ${style.glow.replace('0.4', '0.15')}, transparent 70%)`,
                        pointerEvents: 'none'
                    }} />
                )}

                {/* Icon Container with Pulse */}
                <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    zIndex: 2
                }}>
                    {icons[index % icons.length]}

                    {/* Rotating Ring */}
                    <div style={{
                        position: 'absolute', inset: -5, borderRadius: '50%',
                        borderTop: `2px solid ${bgGradient.split(',')[1].split(' ')[1]}`,
                        borderRight: '2px solid transparent',
                        borderBottom: `2px solid ${bgGradient.split(',')[2].split(' ')[1]}`,
                        borderLeft: '2px solid transparent',
                        animation: 'spinTech 8s linear infinite'
                    }}></div>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>{feature.desc}</p>

                {/* Tech Deco at bottom */}
                <div style={{
                    marginTop: '1.5rem',
                    width: '40px',
                    height: '3px',
                    background: bgGradient,
                    borderRadius: '2px',
                    opacity: 0.5
                }}></div>
            </div>
            <style>{`
                @keyframes spinTech { 100% { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    div[style*="marginTop: 40px"] { margin-top: 0 !important; }
                    div[style*="marginBottom: 40px"] { margin-bottom: 0 !important; }
                    /* Hide connection lines on mobile */
                    div[style*="height: 40px"][style*="background: linear-gradient"] { display: none; }
                }
            `}</style>
        </div>
    );
};

const BackendExpertise = () => {
    const { backendExpertise } = portfolioContent;

    return (
        <section className="section" id="backend" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Cyber Grid Background */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.2,
                zIndex: -1,
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
            }}></div>

            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Minhas Especialidades</span>
                        <h2 style={{ fontSize: '3rem' }}>{backendExpertise.title}</h2>

                        {/* Glowing Line */}
                        <div style={{
                            height: '2px',
                            width: '100px',
                            background: 'linear-gradient(90deg, transparent, var(--primary-color), transparent)',
                            margin: '1.5rem auto',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute', left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '8px', height: '8px',
                                background: '#fff', borderRadius: '50%',
                                boxShadow: '0 0 10px #fff'
                            }}></div>
                        </div>

                        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            {backendExpertise.description}
                        </p>
                    </div>
                </Reveal>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2.5rem',
                    alignItems: 'center',
                    padding: '2rem 0'
                }}>
                    {backendExpertise.features.map((feature, index) => (
                        <Reveal key={index} delay={index * 150}>
                            <CyberCard feature={feature} index={index} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BackendExpertise;
