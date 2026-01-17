import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const MentorshipShowcase = () => {
    // Array of just filenames since they follow a pattern, but explicit listing is safer
    const slides = [
        "Slide1.JPG", "Slide2.JPG", "Slide3.JPG", "Slide4.JPG",
        "Slide5.JPG", "Slide6.JPG", "Slide7.JPG", "Slide8.JPG",
        "Slide9.JPG", "Slide10.JPG", "Slide11.JPG", "Slide12.JPG"
    ];

    return (
        <section className="section" style={{ overflow: 'hidden', padding: '4rem 0' }}>
            <div className="container" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <Reveal>
                    <span className="section-subtitle">Por dentro da Mentoria</span>
                    <h2>Transformando Carreiras na Prática</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        Conteúdo denso, networking real e resultados comprovados. Veja um pouco do que entregamos.
                    </p>
                </Reveal>
            </div>

            {/* Infinite Marquee Slider */}
            <div className="marquee-container" style={{
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' // Soft edges
            }}>
                <div className="marquee-track" style={{ display: 'inline-flex', gap: '20px', animation: 'scroll 40s linear infinite' }}>
                    {/* Double the content for seamless loop */}
                    {[...slides, ...slides].map((slide, index) => (
                        <div key={index} style={{
                            width: '400px',
                            height: '225px', // 16:9 aspect ratio approx
                            flexShrink: 0,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <img
                                src={`/Marketing_Mentoria/${slide}`}
                                alt={`Mentoria Slide ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Reveal delay={200}>
                    <a href="/mentoria" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        👉 Ver Detalhes da Mentoria <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </a>
                </Reveal>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-100% / 2 - 10px)); } /* Adjust calculation based on gap */
                }
                
                /* Pause on hover for better view */
                .marquee-track:hover {
                    animation-play-state: paused;
                }

                @media (max-width: 768px) {
                    .marquee-track div {
                        width: 300px !important;
                        height: 168px !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default MentorshipShowcase;
