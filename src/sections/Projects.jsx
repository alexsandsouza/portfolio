import React from 'react';
import { portfolioContent } from '../data/content';

const Projects = () => {
    const { projects } = portfolioContent;

    return (
        <section id="projects" className="section">
            <div className="container">
                <h2>Projetos e Iniciativas</h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                    {projects.map((project, index) => (
                        <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {project.context}
                            </span>
                            <h3 style={{ color: 'var(--primary-color)', margin: '0.5rem 0' }}>{project.title}</h3>

                            <p style={{ margin: '1rem 0', flex: 1 }}>{project.objective}</p>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>Meu papel:</strong> {project.role}
                                </p>
                                <p style={{ fontSize: '0.9rem' }}>
                                    <strong>Impacto:</strong> {project.impact}
                                </p>
                            </div>

                            {project.tech && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                                    {project.tech.map((t, i) => (
                                        <span key={i} style={{
                                            background: 'var(--surface-color)',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: 'var(--text-secondary)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
