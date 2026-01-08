import React from 'react';
import { portfolioContent } from '../data/content';

const Contact = () => {
    const { contact } = portfolioContent;

    return (
        <section id="contact" className="section" style={{ background: 'linear-gradient(to top, var(--surface-color), var(--bg-color))', paddingBottom: '8rem' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
                <h2 style={{ fontSize: '3rem' }}>{contact.title}</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                    {contact.text}
                </p>

                <a href="#" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
                    {contact.cta}
                </a>

                <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <a href="#" style={{ color: 'inherit' }}>LinkedIn</a>
                    <a href="#" style={{ color: 'inherit' }}>GitHub</a>
                    <a href="#" style={{ color: 'inherit' }}>Instagram</a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
