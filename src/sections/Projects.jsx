import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const ProjectCard = ({ project }) => {
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
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--primary-color)', paddingLeft: '0.8rem', display: 'block' }}>
                        <strong style={{ color: '#fff' }}>Meu papel:</strong> {project.role}
                    </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>O que foi desenvolvido:</h4>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                        {project.description}
                    </p>
                </div>

                <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0', color: '#fff' }}>
                        <span style={{ marginRight: '0.5rem' }}>💡</span> <strong>Impacto:</strong> {project.impact}
                    </p>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                        Ver Projeto Online 🔗
                    </a>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .card-glass > div { text-align: left !important; }
                    .card-glass h3 { text-align: left; }
                }
            `}</style>
        </div>
    );
};

const Projects = () => {
    const { projects, projectsHeadline } = portfolioContent;

    return (
        <section id="projects" className="section">
            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Portfólio Profissional</span>
                        <h2>Projetos Reais & Iniciativas em Tecnologia</h2>
                        <p style={{ maxWidth: '800px', margin: '1rem auto 0', color: 'var(--text-secondary)' }}>
                            {projectsHeadline}
                        </p>
                    </div>
                </Reveal>

                <div className="grid-2">
                    {projects.map((project, index) => (
                        <Reveal key={index} delay={index * 100}>
                            <ProjectCard project={project} />
                        </Reveal>
                    ))}
                </div>
            </div>

            <style>{`
                .grid-2 {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                }
                @media (max-width: 900px) {
                    .grid-2 { grid-template-columns: 1fr; }
                }
            `}</style>
        </section>
    );
};

export default Projects;
