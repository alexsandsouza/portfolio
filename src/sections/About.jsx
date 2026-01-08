import React from 'react';
import { portfolioContent } from '../data/content';

const About = () => {
    const { about } = portfolioContent;

    return (
        <section id="about" className="section">
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                <div className="about-image">
                    {/* Placeholder for image */}
                    <div style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed var(--text-secondary)'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Foto do Alexsander</span>
                    </div>
                </div>

                <div className="about-content">
                    <h2>{about.title}</h2>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        {about.description}
                    </p>

                    <div className="highlight-box" style={{
                        background: 'rgba(100, 108, 255, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--primary-color)'
                    }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Missão</h4>
                        <p style={{ marginBottom: '1rem' }}>{about.mission}</p>
                        <h4 style={{ marginBottom: '0.5rem' }}>Visão</h4>
                        <p>{about.vision}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
