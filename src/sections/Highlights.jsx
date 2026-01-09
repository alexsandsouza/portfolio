import React from 'react';
import { portfolioContent } from '../data/content';

const Highlights = () => {
    const { highlights2025 } = portfolioContent;

    return (
        <section id="highlights" className="section" style={{ background: 'linear-gradient(135deg, var(--surface-color) 0%, var(--bg-color) 100%)' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center' }}>Destaques 2025 🏆</h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '3rem' }}>
                    {highlights2025.map((highlight, index) => (
                        <div key={index} style={{
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '16px',
                            textAlign: 'center',
                            border: '1px solid var(--secondary-color)',
                            boxShadow: '0 0 20px rgba(255, 64, 129, 0.1)'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{highlight.title}</h3>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.5rem 1.5rem',
                                background: 'var(--secondary-color)',
                                color: 'white',
                                borderRadius: '50px',
                                fontWeight: 'bold'
                            }}>
                                {highlight.result}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
