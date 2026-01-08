import React from 'react';
import { portfolioContent } from '../data/content';

const Trajectory = () => {
    const { trajectory } = portfolioContent;

    return (
        <section id="trajectory" className="section">
            <div className="container">
                <h2>Minha Trajetória</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: 'var(--primary-color)',
                        opacity: 0.3
                    }}></div>

                    {trajectory.map((item, index) => (
                        <div key={index} style={{
                            paddingLeft: '2rem',
                            paddingBottom: '3rem',
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

                            <span style={{
                                color: 'var(--primary-color)',
                                fontWeight: 'bold',
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                {item.year}
                            </span>
                            <h3 style={{ marginBottom: '0.5rem' }}>{item.role}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Trajectory;
