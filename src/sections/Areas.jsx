import React from 'react';
import { portfolioContent } from '../data/content';

const Areas = () => {
    const { areas } = portfolioContent;

    return (
        <section id="areas" className="section" style={{ background: 'var(--surface-color)' }}>
            <div className="container">
                <h2>Áreas de Atuação</h2>
                <div className="grid desktop-grid-5" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {areas.map((area, index) => (
                        <div key={index} style={{
                            background: 'var(--bg-color)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.3s ease'
                        }}
                            className="area-card"
                        >
                            <div style={{
                                fontSize: '2rem',
                                marginBottom: '1rem',
                                color: 'var(--primary-color)'
                            }}>
                                {/* Placeholder for icons based on area.icon string */}
                                {area.icon === 'educator' && '🎓'}
                                {area.icon === 'mentor' && '🤝'}
                                {area.icon === 'code' && '💻'}
                                {area.icon === 'security' && '🛡️'}
                                {area.icon === 'rocket' && '🚀'}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: 0 }}>{area.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Areas;
