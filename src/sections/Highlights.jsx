import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const TrophyCard = ({ highlight, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.03 });

    return (
        <div ref={ref} className="card-glass trophy-card" style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            padding: '2.5rem',
            background: 'var(--card-bg)', // Adapts to theme
            borderRadius: '24px',
            textAlign: 'center',
            border: '1px solid rgba(255, 215, 0, 0.4)', // Gold border
            boxShadow: 'var(--card-shadow)',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
        }}>
            {/* Spot Light Effect */}
            <div style={{
                position: 'absolute',
                top: '-50%', left: '50%',
                transform: 'translateX(-50%)',
                width: '150px', height: '150px',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none'
            }}></div>

            {/* Shining Shimmer on Hover */}
            <div style={{
                position: 'absolute',
                top: 0, left: '-100%',
                width: '50%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                transform: 'skewX(-20deg)',
                animation: style.transform ? 'shine 1s forwards' : 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.4))',
                    animation: 'floatTrophy 3s ease-in-out infinite'
                }}>
                    🏆
                </div>

                <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: 'var(--text-heading)',
                    fontFamily: 'var(--font-heading)'
                }}>
                    {highlight.title}
                </h3>

                <div style={{
                    display: 'inline-block',
                    padding: '0.6rem 2rem',
                    background: 'linear-gradient(90deg, #FDB931 0%, #d4af37 100%)', // Gold Gradient
                    color: '#000',
                    borderRadius: '50px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                    marginBottom: '1.5rem'
                }}>
                    {highlight.result}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '1rem', flex: 1 }}>
                    {highlight.desc}
                </p>

                {highlight.link && (
                    <a href={highlight.link} target="_blank" rel="noopener noreferrer" className="highlight-link">
                        Assistir / Ver Mais 🔗
                    </a>
                )}

                <style>{`
                    .highlight-link {
                        margin-top: 1.5rem;
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        color: #FDB931;
                        border: 1px solid rgba(253, 185, 49, 0.3);
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    }
                    .highlight-link:hover {
                        background: rgba(253, 185, 49, 0.1);
                        transform: translateY(-2px);
                    }
                `}</style>
            </div>

            <style>{`
                @keyframes floatTrophy { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes shine { 100% { left: 200%; } }
                
                @media (max-width: 900px) {
                    .trophy-card {
                        text-align: center !important;
                        align-items: center !important;
                    }
                    .trophy-card > div {
                        align-items: center !important;
                        text-align: center !important;
                    }
                    .trophy-card h3, .trophy-card p, .trophy-card a {
                        text-align: center !important;
                    }
                }
            `}</style>
        </div>
    );
};

const Highlights = () => {
    const { highlights } = portfolioContent;

    if (!highlights) return null;

    return (
        <section id="highlights" className="section" style={{ position: 'relative' }}>
            {/* Background Gold Dust */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle, #FFD700 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.1,
                zIndex: -1
            }}></div>

            <div className="container">
                <Reveal>
                    <div className="section-header" style={{ marginBottom: '4rem' }}>
                        <span className="section-subtitle" style={{ color: '#d4af37' }}>Reconhecimento</span>
                        <h2>Premiações & Destaques</h2>
                    </div>
                </Reveal>

                <div className="grid-2" style={{ gap: '3rem', alignItems: 'stretch' }}>
                    {highlights.map((highlight, index) => (
                        <Reveal key={index} delay={index * 150} style={{ height: '100%' }}>
                            <TrophyCard highlight={highlight} index={index} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
