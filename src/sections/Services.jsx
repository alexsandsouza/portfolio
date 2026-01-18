import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const serviceGradients = [
    'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Mentoria: Emerald
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Consultoria: Blue
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'  // Treinamentos: Rose
];

const ServiceCard = ({ service, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 6, scale: 1.03 });
    const gradient = serviceGradients[index % serviceGradients.length];

    return (
        <div ref={ref} className="card-glass" style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            borderTop: `4px solid ${index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#f43f5e'}`
        }}>
            {style.glow !== 'none' && (
                <div style={{
                    position: 'absolute',
                    top: -100, left: -100, right: -100, bottom: -100,
                    background: `radial-gradient(circle at center, ${style.glow.replace('0.4', '0.15')}, transparent 70%)`,
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
            )}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: gradient,
                    borderRadius: '16px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    color: '#fff',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}>
                    {index + 1}
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px', display: 'inline-block' }}>
                    <strong style={{ color: '#fff' }}>Alvo:</strong> {service.target}
                </p>
                <p style={{ color: 'var(--text-primary)', flex: 1, marginBottom: '2rem', lineHeight: 1.6 }}>{service.benefits}</p>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <a href="#contact" style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        Solicitar Proposta <span style={{ transition: 'transform 0.2s' }}>→</span>
                    </a>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .card-glass { text-align: center !important; align-items: center !important; }
                    .card-glass > div { align-items: center !important; }
                    .card-glass h3, .card-glass p, .card-glass a { text-align: center !important; justify-content: center !important; }
                }
            `}</style>
        </div>
    );
};

const Services = () => {
    const { services } = portfolioContent;

    return (
        <section id="services" className="section">
            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">O que ofereço</span>
                        <h2>Serviços & Soluções</h2>
                    </div>
                </Reveal>

                <div className="grid-3">
                    {services.map((service, index) => (
                        <Reveal key={index} delay={index * 100}>
                            <ServiceCard service={service} index={index} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
