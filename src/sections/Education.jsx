import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const EduCard = ({ edu, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.02 });

    const isInProgress = edu.period.toLowerCase().includes('andamento') || edu.period.toLowerCase().includes('atual');
    const statusColor = isInProgress ? '#f59e0b' : '#10b981'; // Amber vs Emerald

    return (
        <div ref={ref} className="card-glass" style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto',
            gap: '1.5rem',
            alignItems: 'center',
            padding: '2rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            borderRadius: '20px'
        }}>
            {/* Glow Overlay */}
            {style.glow !== 'none' && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at center, ${style.glow.replace('0.4', '0.1')}, transparent 70%)`,
                    pointerEvents: 'none'
                }} />
            )}

            {/* Active Border Gradient on Left */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                background: isInProgress
                    ? 'linear-gradient(to bottom, #f59e0b, #fcd34d)'
                    : 'linear-gradient(to bottom, #10b981, #34d399)'
            }}></div>

            {/* Icon Box */}
            <div style={{
                width: '80px', height: '80px',
                background: isInProgress ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                border: `1px solid ${statusColor}40`,
                color: statusColor,
                boxShadow: `0 0 20px ${statusColor}20` // soft glow
            }}>
                {isInProgress ? '⏳' : '🎓'}
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: statusColor,
                    fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    {isInProgress && <span className="pulse-dot" style={{ width: '8px', height: '8px', background: statusColor, borderRadius: '50%' }}></span>}
                    {edu.period}
                </span>

                <h3 style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: '700' }}>{edu.course}</h3>

                <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                    {edu.institution}
                </h4>
            </div>

            {/* Badge (Desktop only mostly) */}
            <div className="edu-badge" style={{
                padding: '0.5rem 1rem',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '50px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                textAlign: 'center'
            }}>
                {edu.level}
            </div>

            <style>{`
                .pulse-dot { animation: pulseFast 1.5s infinite; }
                @keyframes pulseFast { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
                
                @media (max-width: 900px) {
                    .card-glass { grid-template-columns: 1fr !important; text-align: center; justify-items: center; gap: 1.5rem !important; padding: 2.5rem 1.5rem !important; }
                    .edu-badge { width: auto !important; display: inline-block !important; margin-top: 0.5rem; padding: 0.6rem 2rem !important; align-self: center !important; }
                    div[style*="left: 0"][style*="width: 4px"] { width: 100% !important; height: 4px !important; bottom: auto !important; top: 0 !important; }
                    /* Center Icon box margins just in case */
                    div[style*="width: '80px'"] { margin: 0 auto; }
                    /* Ensure headers wrap nicely */
                    h3 { font-size: 1.4rem !important; line-height: 1.4; text-align: center !important; }
                    h4 { justify-content: center; text-align: center !important; }
                    span[style*="display: flex"] { justify-content: center; }
                }
            `}</style>
        </div>
    );
};

const Education = () => {
    const { education } = portfolioContent;

    return (
        <section id="education" className="section" style={{ position: 'relative' }}>
            {/* Background Decoration */}
            <div style={{
                position: 'absolute', top: '10%', right: '5%',
                fontSize: '20rem', opacity: 0.03,
                fontFamily: 'serif', pointerEvents: 'none',
                color: '#fff', zIndex: -1
            }}>
                🎓
            </div>

            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Base de Conhecimento</span>
                        <h2>Formação Acadêmica</h2>
                    </div>
                </Reveal>

                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {education.map((edu, index) => (
                        <Reveal key={index} delay={index * 150}>
                            <EduCard edu={edu} index={index} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
