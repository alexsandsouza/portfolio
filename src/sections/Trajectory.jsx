import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const TimelineCard = ({ job, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.02 });
    const isEven = index % 2 === 0;

    return (
        <div
            className={`timeline-item ${isEven ? 'left' : 'right'}`}
            style={{
                display: 'flex',
                justifyContent: isEven ? 'flex-end' : 'flex-start',
                position: 'relative',
                marginBottom: '4rem',
                width: '100%'
            }}
        >
            {/* Center Node */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                background: 'var(--bg-color)',
                border: '3px solid var(--primary-color)',
                borderRadius: '50%',
                zIndex: 10,
                boxShadow: '0 0 15px var(--primary-color)'
            }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '6px', height: '6px', background: '#fff', borderRadius: '50%'
                }}></div>
            </div>

            {/* Date Bubble (Opposite side) */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                transform: `translateX(${isEven ? '30px' : '-130px'})`,
                color: 'var(--primary-color)',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                fontSize: '1rem',
                opacity: 0.8,
                paddingTop: '3px'
            }}>
                {job.period}
            </div>

            <div ref={ref} className="card-glass" style={{
                ...style.transform ? { transform: style.transform, transition: style.transition } : {},
                width: '45%',
                padding: '2rem',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                marginRight: isEven ? '50px' : '0',
                marginLeft: isEven ? '0' : '50px',
                textAlign: 'left' // Always left align text inside card
            }}>
                {/* Decorative Top Line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--secondary-color), transparent)'
                }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>{job.role}</h3>
                </div>

                <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--primary-color)', fontWeight: '600', letterSpacing: '0.5px' }}>
                    @{job.institution} <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>• {job.type}</span>
                </h4>

                <p style={{ marginBottom: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{job.description}</p>

                {job.results && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.8rem 1rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        borderLeft: '3px solid #10b981',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        <p style={{ fontSize: '0.9rem', color: '#e2e8f0', fontStyle: 'italic', margin: 0, display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>🏆</span>
                            {job.results}
                        </p>
                    </div>
                )}
            </div>

            {/* Connector Line to Card */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                width: '50px',
                height: '2px',
                background: 'linear-gradient(90deg, var(--primary-color), transparent)',
                transform: isEven ? 'translateX(-50px)' : 'translateX(0)',
                zIndex: 0
            }}></div>
        </div>
    );
};

const Experience = () => {
    const { professionalExperience } = portfolioContent;

    if (!professionalExperience) return null;

    return (
        <section id="experience" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Minha Trajetória</span>
                        <h2>Experiência Profissional</h2>
                    </div>
                </Reveal>

                <div style={{ maxWidth: '1000px', margin: '4rem auto 0', position: 'relative' }}>
                    {/* Central Laser Line */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: 'rgba(99, 102, 241, 0.3)',
                        transform: 'translateX(-50%)',
                        zIndex: 0
                    }}>
                        {/* Moving Pulse */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '50vh',
                            background: 'linear-gradient(to bottom, transparent, var(--primary-color), transparent)',
                            animation: 'laserFlow 3s linear infinite'
                        }}></div>
                    </div>

                    {professionalExperience.map((job, index) => (
                        <Reveal key={index} delay={index * 150} width="100%">
                            <TimelineCard job={job} index={index} />
                        </Reveal>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes laserFlow { 0% { top: -50vh; } 100% { top: 100%; } }
                
                @media (max-width: 768px) {
                    .timeline-item { flex-direction: column !important; align-items: center !important; margin-left: 0 !important; border-left: none !important; padding-left: 0 !important; margin-bottom: 3rem; }
                    .timeline-item .card-glass { width: 100% !important; margin: 0 !important; text-align: center !important; }
                    .timeline-item > div:first-child { display: none !important; } /* Hide Dot on mobile */
                    .timeline-item > div:nth-child(2) { position: relative !important; text-align: center !important; transform: none !important; left: 0 !important; margin-bottom: 0.5rem; width: 100%; } /* Date */
                     /* Hide central line on mobile and use per-item border */
                     div[style*="left: 50%"][style*="background: rgba(99, 102, 241, 0.3)"] { display: none; }
                     /* Center header inside card */
                     .timeline-item h3, .timeline-item h4 { justify-content: center; text-align: center; }
                     .timeline-item div[style*="display: flex"] { justify-content: center; }
                     .timeline-item p[style*="fontStyle: italic"] { justify-content: center; }
                }
            `}</style>
        </section>
    );
};

export default Experience;
