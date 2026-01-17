import React from 'react';
import { PlayCircle, Download, ExternalLink, BookOpen, Award, MonitorPlay, Headphones } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const AcademyHub = () => {
    return (
        <section className="section" id="academy" style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
            {/* Decoration Background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 20%)',
                pointerEvents: 'none'
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="section-header">
                    <span className="section-subtitle">Conhecimento & Evolução</span>
                    <h2>Academy Hub</h2>
                    <p>Um ecossistema completo para acelerar sua carreira em tecnologia.</p>
                </div>

                {/* DESTAQUE: EVENTO E REPLAY */}
                <div style={{ marginBottom: '5rem' }}>
                    <Reveal>
                        <div className="card-glass" style={{
                            padding: '0',
                            overflow: 'hidden',
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 1fr',
                            borderColor: 'var(--primary-color)',
                            boxShadow: '0 0 30px rgba(99, 102, 241, 0.1)'
                        }}>
                            {/* Video Area (Placeholder) */}
                            <div style={{
                                background: '#000',
                                minHeight: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/MAv9jIVklZk"
                                    title="Evento TI"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                ></iframe>
                            </div>

                            {/* Content Area */}
                            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)',
                                    padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                                    width: 'fit-content', marginBottom: '1rem'
                                }}>
                                    <MonitorPlay size={16} /> REPLAY DISPONÍVEL
                                </div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                                    Como iniciar na Carreira de TI do Zero
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                    O caminho real para iniciantes. Assista à gravação completa do nosso encontro exclusivo e baixe o material de apoio.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {/* Botão de Download do Ebook */}
                                    <a href="https://drive.google.com/file/d/1f2Yh5vPDFhVaE-EgRQopnrx3j15i7Z__/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Download size={20} /> Baixar Ebook do Evento
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* GRID DE PORTAIS */}
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={24} color="var(--primary-color)" /> Portais de Aprendizado
                </h3>

                <div className="grid-2">
                    {/* Card 1: Formação Cisco */}
                    <Reveal delay={200}>
                        <a href="https://ad-academy-one.vercel.app" target="_blank" rel="noopener noreferrer" className="card-glass hover-card" style={{
                            display: 'block', padding: '2.5rem', height: '100%', textDecoration: 'none', transition: 'transform 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '60px', height: '60px', background: 'rgba(56, 189, 248, 0.1)',
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Award size={32} color="#38bdf8" />
                                </div>
                                <ExternalLink size={20} color="var(--text-secondary)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
                                Academy One (Cisco)
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                Formação Oficial Cisco NetAcad. Cursos profissionalizantes com certificação internacional em Redes e Infraestrutura.
                            </p>
                            <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                Acessar Portal Cisco <ExternalLink size={14} />
                            </span>
                        </a>
                    </Reveal>

                    {/* Card 2: Ebooks e Audiobooks */}
                    <Reveal delay={400}>
                        <a href="https://ad-academy-treinamentos.vercel.app" target="_blank" rel="noopener noreferrer" className="card-glass hover-card" style={{
                            display: 'block', padding: '2.5rem', height: '100%', textDecoration: 'none', transition: 'transform 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '60px', height: '60px', background: 'rgba(236, 72, 153, 0.1)',
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Headphones size={32} color="#ec4899" />
                                </div>
                                <ExternalLink size={20} color="var(--text-secondary)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
                                Treinamentos Digitais
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                Acervo de Ebooks e Audiobooks focados em soft skills, carreira e desenvolvimento técnico. Estude offline.
                            </p>
                            <span style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                Acessar Livraria Digital <ExternalLink size={14} />
                            </span>
                        </a>
                    </Reveal>
                </div>

            </div>

            <style>{`
                .hover-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary-color);
                }
                @media (max-width: 900px) {
                    .card-glass[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                    /* Reorder video to top on mobile */
                    .card-glass[style*="grid-template-columns"] > div:first-child {
                        min-height: 200px;
                    }
                }
            `}</style>
        </section>
    );
};

export default AcademyHub;
