import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const SoftSkillItem = ({ skill, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 3, scale: 1.02 });

    return (
        <div ref={ref} className="soft-skill-item" style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderLeft: `3px solid var(--secondary-color)`,
            padding: '1.2rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Scanning Effect */}
            <div style={{
                position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                animation: `scanLight 3s ease-in-out infinite ${index * 0.5}s`
            }}></div>

            <div style={{
                width: '32px', height: '32px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--primary-color)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem'
            }}>
                0{index + 1}
            </div>

            <span style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>
                {skill}
            </span>

            <style>{`
                @keyframes scanLight { 0% { left: -100%; } 100% { left: 200%; } }
             `}</style>
        </div>
    );
};

const HardSkillChip = ({ skill }) => (
    <span style={{
        padding: '0.6rem 1.2rem',
        background: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '50px',
        fontSize: '0.85rem',
        color: 'var(--text-primary)',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 0 10px rgba(56, 189, 248, 0.1)',
        transition: 'all 0.3s ease'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-color)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'transparent';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-color)';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
        }}
    >
        <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%' }}></span>
        {skill}
    </span>
);

const Skills = () => {
    const { skills } = portfolioContent;

    // Flatten hard skills for specific display logic if needed, or keep grouped
    const categories = [
        { id: 'tech', label: 'Tech Stack', color: '#38bdf8' },
        { id: 'infra', label: 'Infraestrutura', color: '#10b981' },
        { id: 'base', label: 'Fundamentos', color: '#f43f5e' }
    ];

    return (
        <section id="skills" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Binary Background */}
            <div style={{
                position: 'absolute', inset: 0,
                opacity: 0.05,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828M22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                zIndex: -1
            }}></div>

            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Competências</span>
                        <h2>Minhas Habilidades</h2>
                    </div>
                </Reveal>

                <div className="grid-2" style={{ alignItems: 'stretch', gap: '3rem' }}>

                    {/* Panel 1: Human Interface (Soft Skills) */}
                    <div className="glass-panel" style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)', // Highlighted border
                        boxShadow: 'var(--card-shadow)', // Depth and glow
                        borderRadius: '24px',
                        padding: '2.5rem',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}>
                        <Reveal>
                            <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: 'var(--secondary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🧠</div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Soft Skills</h3>
                            </div>
                        </Reveal>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            {skills.soft.map((skill, index) => (
                                <Reveal key={index} delay={index * 100}>
                                    <SoftSkillItem skill={skill} index={index} />
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* Panel 2: System Core (Hard Skills) */}
                    <div className="glass-panel" style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)', // Highlighted border
                        boxShadow: 'var(--card-shadow)', // Depth and glow
                        borderRadius: '24px',
                        padding: '2.5rem',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}>
                        <Reveal>
                            <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💻</div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Hard Skills</h3>
                            </div>
                        </Reveal>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
                            {categories.map((cat, idx) => (
                                <Reveal key={idx} delay={idx * 150}>
                                    <div className="skill-category" style={{ position: 'relative' }}>
                                        <h4 style={{
                                            color: cat.color,
                                            marginBottom: '1rem',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1.5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', background: cat.color }}></span>
                                            {cat.label}
                                        </h4>
                                        <div className="skill-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                            {(skills.hard[cat.id] || []).map((skill, i) => (
                                                <HardSkillChip key={i} skill={skill} />
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .glass-panel { padding: 1.5rem !important; }
                    .panel-header { justify-content: center; }
                    .skill-category h4 { justify-content: center; }
                    .skill-chips { justify-content: center; }
                    
                    /* Soft Skills Mobile Optimization */
                    .soft-skill-item {
                        flex-direction: column !important;
                        align-items: center !important;
                        text-align: center !important;
                        border-left: none !important;
                        border-bottom: 3px solid var(--secondary-color) !important;
                        border-radius: 12px !important;
                        padding: 1.5rem !important;
                    }
                    .soft-skill-item > div { margin-bottom: 0.5rem; } /* Icon box */
                    .soft-skill-item span { /* Skill text */
                        text-align: center !important;
                        width: 100% !important;
                        display: block !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Skills;
