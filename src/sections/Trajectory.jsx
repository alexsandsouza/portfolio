import React from 'react';
import { portfolioContent } from '../data/content';

const Experience = () => {
    const { experience } = portfolioContent;

    return (
        <section id="experience" className="section">
            <div className="container">
                <h2>Experiência Profissional</h2>
                <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>

                    {/* Linha vertical centralizada em telas grandes */}
                    <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: 'var(--primary-color)',
                        opacity: 0.3
                    }}></div>

                    {experience.map((job, index) => (
                        <div key={index} style={{
                            paddingLeft: '2.5rem',
                            paddingBottom: '4rem',
                            position: 'relative'
                        }}>
                            {/* Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-9px',
                                top: '0',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'var(--bg-color)',
                                border: '4px solid var(--primary-color)'
                            }}></div>

                            <div className="card" style={{ padding: '1.5rem', borderLeft: 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>{job.role}</h3>
                                    <span style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '0.2rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem'
                                    }}>{job.type}</span>
                                </div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{job.institution}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{job.period}</p>

                                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-text-primary)' }}>
                                    {job.responsibilities.map((resp, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{resp}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
