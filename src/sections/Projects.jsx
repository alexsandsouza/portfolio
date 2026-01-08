import React from 'react';
import { portfolioContent } from '../data/content';

const Projects = () => {
    const { projects } = portfolioContent;

    return (
        <section id="projects" className="section">
            <div className="container">
                <h2>Projetos Desenvolvidos</h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {projects.map((project, index) => (
                        <div key={index} className="card">
                            <h3 style={{ color: 'var(--primary-color)' }}>{project.title}</h3>
                            <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>
                                {project.description}
                            </p>

                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Solução:</strong> <br />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{project.solution}</span>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                {project.tech.map((t, i) => (
                                    <span key={i} style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.8rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        marginRight: '0.5rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <strong style={{ color: 'var(--secondary-color)' }}>Resultado:</strong> {project.result}
                            </p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href={project.links.demo} className="btn-text" style={{ textDecoration: 'underline' }}>Ver Demo</a>
                                <a href={project.links.github} className="btn-text" style={{ textDecoration: 'underline' }}>GitHub</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
