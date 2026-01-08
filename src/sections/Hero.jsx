import React from 'react';
import { portfolioContent } from '../data/content';

const Hero = () => {
    const { hero } = portfolioContent;

    return (
        <section className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <div className="container">
                <span style={{
                    color: 'var(--secondary-color)',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                    display: 'block'
                }}>
                    {hero.positioning}
                </span>

                <h1 style={{ maxWidth: '900px', margin: '0 auto 1.5rem auto' }}>
                    {hero.headline}
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '600px',
                    margin: '0 auto 2.5rem auto'
                }}>
                    {hero.subheadline}
                </p>

                <div>
                    <a href="#contact" className="btn btn-primary">{hero.ctaPrimary}</a>
                    <a href="#projects" className="btn btn-secondary">{hero.ctaSecondary}</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
