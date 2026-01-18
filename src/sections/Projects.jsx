import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const ProjectCard = ({ project }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.02 });

    return (
        <div ref={ref} className="card-glass project-card" style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)' // Ensure shadow
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
                <div className="project-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

                <div className="role-container" style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--primary-color)', paddingLeft: '0.8rem', display: 'block' }}>
                        <strong style={{ color: 'var(--text-heading)' }}>Meu papel:</strong> {project.role}
                    </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>O que foi desenvolvido:</h4>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, textAlign: 'left' }}>
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
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0', color: 'var(--text-primary)' }}>
                        <span style={{ marginRight: '0.5rem' }}>💡</span> <strong>Impacto:</strong> {project.impact}
                    </p>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                            Ver Projeto Online 🔗
                        </a>
                    ) : (
                        <div style={{
                            width: '100%', textAlign: 'center', padding: '0.8rem',
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)',
                            fontSize: '0.9rem', fontWeight: 'bold'
                        }}>
                            Você está navegando neste projeto 📍
                        </div>
                    )}
                </div>
            </div>


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

                <div className="grid-responsive">
                    {projects.map((project, index) => (
                        <Reveal key={index} delay={index * 100}>
                            <ProjectCard project={project} />
                        </Reveal>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .project-header, 
                    .project-header > div {
                        justify-content: center !important;
                        text-align: center !important;
                        width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                    
                    .project-header span, .project-header h3 {
                        text-align: center !important;
                        justify-content: center !important;
                        display: block !important;
                        width: 100% !important; /* Ensure full width for centering */
                    }

                    .role-container {
                        text-align: center !important;
                        justify-content: center !important;
                        display: flex !important;
                        width: 100%;
                    }

                    .role-container span {
                        border-left: none !important;
                        padding-left: 0 !important;
                        border-bottom: 2px solid var(--primary-color) !important;
                        padding-bottom: 0.5rem !important;
                        display: inline-block !important;
                        width: auto !important;
                    }

                    .project-card h4 {
                        text-align: center !important;
                        width: 100% !important;
                    }

                    .project-card p {
                        text-align: center !important;
                    }
                    
                     /* Impact Box */
                    .project-card > div > div:nth-last-of-type(2) {
                        text-align: center !important;
                    }
                    .project-card > div > div:nth-last-of-type(2) p {
                        justify-content: center !important;
                        display: flex !important;
                        align-items: center !important;
                         gap: 0.5rem;
                         flex-wrap: wrap; /* Permitir quebra se icon e texto forem longos */
                    }
                }
            `}</style>
        </section>
    );
};

export default Projects;
