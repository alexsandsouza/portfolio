import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', // Education: Indigo -> Cyan
    'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)', // Security: Red -> Rose
    'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', // Dev: Violet -> Fuchsia
    'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'  // Innovation: Amber -> Orange
];

const iconsMap = {
    'school': '🎓',
    'lightbulb': '💡',
    'security': '🛡️',
    'code': '💻'
};

const CircuitCard = ({ area, index, total }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.03 });
    const bgGradient = gradients[index % gradients.length];

    return (
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            {/* Connecting Line (Roadmap Style) */}
            {index < total - 1 && (
                <div className="connector-line">
                    <div className="data-stream"></div>
                </div>
            )}

            <div ref={ref} style={{
                ...style.transform ? { transform: style.transform, transition: style.transition } : {},
                position: 'relative',
                zIndex: 2 // Above lines
            }}>
                {/* Node Dot Top */}
                <div style={{
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    width: '12px', height: '12px', background: 'var(--bg-color)',
                    border: '2px solid var(--text-secondary)', borderRadius: '50%',
                    zIndex: 3
                }}></div>

                <div className="card-glass" style={{
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%)',
                    borderRadius: '16px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Glow on Hover */}
                    {style.glow !== 'none' && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: `radial-gradient(circle at center, ${style.glow.replace('0.4', '0.1')}, transparent 70%)`,
                            pointerEvents: 'none'
                        }} />
                    )}

                    <div style={{
                        width: '70px', height: '70px',
                        background: bgGradient,
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                        border: '4px solid rgba(255,255,255,0.1)'
                    }}>
                        {iconsMap[area.icon] || '🚀'}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '700', minHeight: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {area.title}
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {area.desc}
                    </p>
                </div>

                {/* Node Dot Bottom */}
                <div style={{
                    position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                    width: '12px', height: '12px', background: bgGradient,
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    zIndex: 3
                }}></div>
            </div>

            <style>{`
                .connector-line {
                    position: absolute;
                    top: 50%;
                    left: 50%; /* Start from center of this card */
                    width: 100%; /* Stretch to next card center roughly */
                    height: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-50%);
                    z-index: 0;
                    overflow: hidden;
                }
                .data-stream {
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
                    animation: dataFlow 3s linear infinite;
                }
                @keyframes dataFlow { 0% { left: -100%; } 100% { left: 200%; } }
                
                @media (max-width: 768px) {
                    .connector-line {
                        display: none; /* Hide horizontal lines on mobile */
                    }
                }
            `}</style>
        </div>
    );
};

const Areas = () => {
    const { areas } = portfolioContent;

    return (
        <section id="areas" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Tech Background Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 60%)',
                zIndex: -1
            }}></div>

            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Meu Ecossistema</span>
                        <h2>Áreas de Atuação</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Conectando pilares fundamentais para transformar tecnologia em impacto real.
                        </p>
                    </div>
                </Reveal>

                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    padding: '2rem 0',
                    position: 'relative'
                }}>
                    {/* Horizontal Guide Line for Desktop */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0,
                        display: window.innerWidth > 768 ? 'block' : 'none'
                    }}></div>

                    {areas.map((area, index) => (
                        <Reveal key={index} delay={index * 150}>
                            <CircuitCard area={area} index={index} total={areas.length} />
                        </Reveal>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                     /* Stack vertically on mobile/tablet */
                     #areas .container > div:last-child {
                         flex-direction: column;
                         align-items: center;
                     } 
                     .connector-line { display: none; }
                     /* Center text in cards */
                    .card-glass { text-align: center !important; align-items: center !important; width: 100% !important; }
                }
            `}</style>
        </section>
    );
};

export default Areas;
