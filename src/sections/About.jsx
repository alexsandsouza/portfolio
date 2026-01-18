import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const CyberFrame = () => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.01 });

    return (
        <div ref={ref} style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            position: 'relative',
            zIndex: 10,
            padding: '20px', // Space for markers
            height: '100%', // Fill the grid column height
            display: 'flex',
            alignItems: 'center'
        }}>
            {/* Animated Corners */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '40px', height: '40px',
                borderTop: '2px solid var(--primary-color)', borderLeft: '2px solid var(--primary-color)',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute', top: 0, right: 0, width: '40px', height: '40px',
                borderTop: '2px solid var(--secondary-color)', borderRight: '2px solid var(--secondary-color)',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px',
                borderBottom: '2px solid var(--accent-color)', borderLeft: '2px solid var(--accent-color)',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px',
                borderBottom: '2px solid var(--primary-color)', borderRight: '2px solid var(--primary-color)',
                zIndex: 0
            }}></div>

            {/* Main Image Container */}
            <div style={{
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                width: '100%',
                height: '100%', // Force full height
                minHeight: '500px', // Fallback
                zIndex: 1
            }}>
                {/* Scanning Line Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '5px',
                    background: 'rgba(99, 102, 241, 0.8)',
                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.8)',
                    animation: 'scan 4s linear infinite',
                    zIndex: 5,
                    opacity: 0.5
                }}></div>

                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent 40%)',
                    zIndex: 2
                }}></div>

                <img
                    src="/Foto_Perfil_Nova.jpg"
                    alt="Prof. Alexsander Farias"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <style>{`
                @keyframes scan { 0% { top: -10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
            `}</style>
        </div>
    );
}

const HolographicStats = ({ stats }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px', // Separation for grid lines
            background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)', // Top border illusion
            marginBottom: '2rem',
            paddingTop: '1px',
            position: 'relative'
        }}>
            {/* Cyber Line Top */}
            <div style={{
                position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--primary-color), transparent)',
                boxShadow: '0 0 10px var(--primary-color)'
            }}></div>

            {stats.map((stat, i) => (
                <div key={i} style={{
                    textAlign: 'center',
                    padding: '1.5rem 0.5rem',
                    background: 'var(--card-bg)', // Glass effect
                    backdropFilter: 'blur(4px)',
                    boxShadow: 'var(--card-shadow)', // Added shadow
                    border: '1px solid var(--card-border)' // Added border
                }}>
                    <strong style={{
                        display: 'block',
                        fontSize: '2rem',
                        fontWeight: '800',
                        lineHeight: 1,
                        background: i === 0 ? 'linear-gradient(to bottom, var(--text-heading), var(--primary-color))' : i === 1 ? 'linear-gradient(to bottom, var(--text-heading), var(--secondary-color))' : 'linear-gradient(to bottom, var(--text-heading), var(--accent-color))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>{stat.value}</strong>
                    <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginTop: '0.5rem',
                        display: 'block',
                        fontWeight: '600'
                    }}>{stat.label}</span>
                </div>
            ))}
        </div>
    );
};

const About = () => {
    const { about } = portfolioContent;

    return (
        <section id="about" className="section" style={{ position: 'relative', overflow: 'visible' }}>
            <div className="container">
                <div className="grid-2-col" style={{ alignItems: 'stretch' }}>
                    {/* Image Column */}
                    <Reveal>
                        <CyberFrame />
                    </Reveal>

                    {/* Content Column */}
                    <div className="text-left-mobile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Reveal delay={200}>
                            <div style={{ marginBottom: '2rem' }}>
                                <span className="section-subtitle">Minha Jornada</span>
                                <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{about.title}</h2>
                                <h3 className="about-headline" style={{
                                    color: 'var(--primary-color)',
                                    marginBottom: '1.5rem',
                                    fontSize: '1.25rem',
                                    fontWeight: '500',
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-line' // Respond to \n
                                }}>
                                    {about.headline}
                                </h3>

                                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
                                    {about.description.replace(/\*\*/g, '')}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={400}>
                            {about.stats && <HolographicStats stats={about.stats} />}

                            <div className="card-glass about-highlight-card" style={{
                                padding: '1.25rem',
                                border: '1px solid var(--card-border)',
                                background: 'linear-gradient(90deg, var(--card-bg) 0%, transparent 100%)',
                                boxShadow: 'var(--card-shadow)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>🚀</span>
                                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>
                                    "{about.resume_focus}"
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            <style>{`
                /* Desktop default for headline */
                .about-headline {
                    border-left: 3px solid var(--secondary-color);
                    padding-left: 1rem;
                    text-align: left;
                }
                
                @media (max-width: 900px) {
                    /* Force Center Everything on Mobile */
                    .text-left-mobile {
                        text-align: center !important;
                        align-items: center !important;
                    }
                    .text-left-mobile h2, 
                    .text-left-mobile p {
                        text-align: center !important;
                    }
                    
                    /* Adjust Headline Border */
                    .about-headline {
                        border-left: none !important;
                        padding-left: 0 !important;
                        border-bottom: 3px solid var(--secondary-color);
                        padding-bottom: 1rem;
                        text-align: center !important;
                        width: 100%;
                    }
                    
                    /* Adjust Highlight Card */
                    .about-highlight-card {
                        justify-content: center !important;
                        text-align: center !important;
                        flex-direction: column;
                    }
                }
            `}</style>
        </section>
    );
};

export default About;
