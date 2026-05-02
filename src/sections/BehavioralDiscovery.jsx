import React from 'react';
import { Compass, Sparkles, Target, Zap, Users, Brain, ArrowRight, ExternalLink } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const BehavioralDiscovery = () => {
    const profiles = [
        {
            id: 'aguia',
            name: 'Águia',
            emoji: '🦅',
            slogan: 'Fazer Diferente',
            color: '#6C63FF',
            icon: <Sparkles size={24} />,
            desc: 'Criatividade, inovação e visão de futuro. Focada em novas possibilidades.',
            tags: ['Visionário', 'Criativo', 'Intuitivo']
        },
        {
            id: 'gato',
            name: 'Gato',
            emoji: '🐱',
            slogan: 'Fazer Junto',
            color: '#FF6B9D',
            icon: <Users size={24} />,
            desc: 'Sensibilidade, empatia e trabalho em equipe. Valoriza o capital humano.',
            tags: ['Empático', 'Comunicativo', 'Harmônico']
        },
        {
            id: 'lobo',
            name: 'Lobo',
            emoji: '🐺',
            slogan: 'Fazer Certo',
            color: '#00B894',
            icon: <Target size={24} />,
            desc: 'Organização, estratégia e qualidade. Focado em processos e detalhes.',
            tags: ['Estrategista', 'Organizado', 'Metódico']
        },
        {
            id: 'tubarao',
            name: 'Tubarão',
            emoji: '🦈',
            slogan: 'Fazer Rápido',
            color: '#FF7675',
            icon: <Zap size={24} />,
            desc: 'Ação, senso de urgência e resultados. Focado no "aqui e agora".',
            tags: ['Prático', 'Determinado', 'Ágil']
        }
    ];

    return (
        <section className="section" id="behavioral" style={{ background: 'var(--bg-color)', position: 'relative', overflow: 'hidden' }}>
            {/* Background Elements */}
            <div style={{
                position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px',
                background: 'rgba(124, 111, 250, 0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
            }}></div>
            <div style={{
                position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px',
                background: 'rgba(244, 63, 142, 0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="section-header">
                    <Reveal>
                        <span className="section-subtitle">Auto-conhecimento & Soft Skills</span>
                        <h2 className="text-gradient">DNA Comportamental</h2>
                        <p>Descubra seu perfil psicológico dominante baseado na metodologia de Ned Herrmann e IBC Coaching.</p>
                    </Reveal>
                </div>

                <div className="grid-responsive" style={{ gap: '1.5rem' }}>
                    {profiles.map((profile, index) => (
                        <Reveal key={profile.id} delay={index * 100}>
                            <div className="card-glass profile-feature-card" style={{
                                padding: '2rem',
                                borderTop: `4px solid ${profile.color}`,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{
                                        fontSize: '2.5rem',
                                        background: `rgba(${parseInt(profile.color.slice(1, 3), 16)}, ${parseInt(profile.color.slice(3, 5), 16)}, ${parseInt(profile.color.slice(5, 7), 16)}, 0.1)`,
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '12px'
                                    }}>
                                        {profile.emoji}
                                    </div>
                                    <div style={{ color: profile.color, opacity: 0.8 }}>
                                        {profile.icon}
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: profile.color }}>
                                        {profile.name}
                                    </h3>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        fontWeight: '700',
                                        opacity: 0.7
                                    }}>
                                        "{profile.slogan}"
                                    </span>
                                </div>

                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', flexGrow: 1 }}>
                                    {profile.desc}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {profile.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '0.7rem',
                                            padding: '4px 10px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '20px',
                                            border: `1px solid ${profile.color}22`,
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={500}>
                    <div style={{
                        marginTop: '4rem',
                        padding: '3rem',
                        background: 'linear-gradient(135deg, rgba(124, 111, 250, 0.1), rgba(244, 63, 142, 0.1))',
                        borderRadius: '24px',
                        border: '1px solid var(--card-border)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', background: 'var(--primary-color)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(124, 111, 250, 0.4)', marginBottom: '0.5rem'
                        }}>
                            <Brain size={40} color="white" />
                        </div>
                        <h3 style={{ fontSize: '2rem' }}>Pronto para descobrir o seu?</h3>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                            Realize o teste completo agora mesmo. O sistema gera um gráfico de radar detalhado 
                            e um relatório de competências baseado nas suas respostas.
                        </p>
                        <a 
                            href="/teste-afinidade" 
                            className="btn btn-primary"
                            style={{ gap: '10px', padding: '1.2rem 3rem', fontSize: '1.1rem' }}
                        >
                            🚀 Iniciar Avaliação <ArrowRight size={20} />
                        </a>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ExternalLink size={14} /> Ferramenta Educativa FAMETRO
                        </span>
                    </div>
                </Reveal>
            </div>

            <style>{`
                .profile-feature-card {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                }
                .profile-feature-card:hover {
                    transform: translateY(-10px) scale(1.02) !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                    background: rgba(255, 255, 255, 0.06) !important;
                }
                
                @media (max-width: 900px) {
                    .profile-feature-card {
                        text-align: left !important;
                        align-items: flex-start !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default BehavioralDiscovery;
