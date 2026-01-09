import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const ProjectCard = ({ project, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.02 });

    return (
        <div ref={ref} className="card-glass" style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            {/* Ambient Glow */}
            {style.glow !== 'none' && (
                <div style={{
                    position: 'absolute',
                    top: -100, left: -100, right: -100, bottom: -100,
                    background: `radial-gradient(circle at center, ${style.glow.replace('0.4', '0.1')}, transparent 70%)`,
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
            )}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--accent-color)',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            fontWeight: '700',
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>
                            {project.context}
                        </span>
                        <h3 style={{ fontSize: '1.5rem', margin: '0', lineHeight: 1.2 }}>{project.title}</h3>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}>
                        🚀
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--primary-color)', paddingLeft: '0.8rem' }}>
                        {project.role}
                    </span>
                </div>

                <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                    {project.objective}
                </p>

                <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0', color: '#fff' }}>
                        <span style={{ marginRight: '0.5rem' }}>💡</span> {project.impact}
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                    {project.tech.map((t, i) => (
                        <span key={i} style={{
                            fontSize: '0.8rem',
                            padding: '0.4rem 1rem',
                            borderRadius: '50px',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.2s'
                        }}>
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .card-glass > div { align-items: center !important; text-align: center !important; }
                    .card-glass > div > div:first-child { flex-direction: column-reverse; gap: 1rem; align-items: center !important; } /* Icon on top, Title below */
                    .card-glass h3 { text-align: center; }
                    .card-glass h4 { text-align: center; }
                    .card-glass p { text-align: center; }
                    .card-glass span[style*="borderLeft"] { border-left: none !important; border-bottom: 2px solid var(--primary-color); padding-left: 0 !important; padding-bottom: 0.5rem; display: inline-block; }
                    .card-glass div[style*="justify-content: space-between"] { justify-content: center !important; }
                    .card-glass div[style*="flex-wrap: wrap"] { justify-content: center !important; }
                }
            `}</style>
        </div>
    );
};

const Projects = () => {
    const { projects } = portfolioContent;

    return (
        <section id="projects" className="section">
            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Portfólio</span>
                        <h2>Projetos em Destaque</h2>
                    </div>
                </Reveal>

                <div className="grid-3">
                    {projects.map((project, index) => (
                        <Reveal key={index} delay={index * 100}>
                            <ProjectCard project={project} index={index} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
