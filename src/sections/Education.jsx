import React from 'react';
import { portfolioContent } from '../data/content';

const Education = () => {
    const { education } = portfolioContent;

    return (
        <section id="education" className="section">
            <div className="container">
                <h2>Formação Acadêmica</h2>
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {education.map((edu, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1.5rem',
                            borderLeft: `4px solid ${edu.distinct ? 'var(--secondary-color)' : 'var(--primary-color)'}`,
                            background: 'var(--surface-color)',
                            borderRadius: '0 12px 12px 0'
                        }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{edu.period || 'Ano a definir'}</span>
                            <h3 style={{ marginBottom: '0.5rem' }}>{edu.course}</h3>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{edu.institution}</h4>
                            <span style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontStyle: 'italic' }}>{edu.area}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
