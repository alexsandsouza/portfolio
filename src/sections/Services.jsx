import React from 'react';
import { portfolioContent } from '../data/content';

const Services = () => {
    const { services } = portfolioContent;

    return (
        <section id="services" className="section" style={{ background: 'var(--surface-color)' }}>
            <div className="container">
                <h2>Serviços Oferecidos</h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {services.map((service, index) => (
                        <div key={index} style={{
                            padding: '2rem',
                            background: 'var(--bg-color)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h3 style={{ marginBottom: '1rem' }}>{service.title}</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--secondary-color)', marginRight: '0.5rem' }}>➝</span>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff' }}>Para quem:</strong>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{service.target}</span>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--secondary-color)', marginRight: '0.5rem' }}>★</span>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff' }}>Benefícios:</strong>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{service.benefits}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
