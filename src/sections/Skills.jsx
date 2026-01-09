import React from 'react';
import { portfolioContent } from '../data/content';

const Skills = () => {
    const { softSkills, hardSkills } = portfolioContent;

    return (
        <section id="skills" className="section">
            <div className="container">
                <div style={{ marginBottom: '4rem' }}>
                    <h2>Soft Skills</h2>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                        {softSkills.map((skill, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(100, 108, 255, 0.1)',
                                    borderRadius: '50%',
                                    margin: '0 auto 1rem auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary-color)',
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem'
                                }}>
                                    {index + 1}
                                </div>
                                <h3>{skill.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {skill.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2>Hard Skills</h2>
                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {Object.entries(hardSkills).map(([category, skills], index) => (
                            <div key={index} className="card">
                                <h3 style={{ borderBottom: '1px solid var(--text-secondary)', paddingBottom: '0.5rem', marginBottom: '1rem', textTransform: 'capitalize' }}>
                                    {category === 'infra' ? 'Infraestrutura & Redes' : category}
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {skills.map((s, i) => (
                                        <span key={i} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', margin: 0 }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
