import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import Countdown from '../components/Countdown';
import { Check, ShoppingCart, Clock, Calendar, Users, Target, BookOpen, Star, AlertTriangle, ArrowRight, QrCode, X } from 'lucide-react';

const MentorshipPage = () => {
    const [showQR, setShowQR] = useState(false);
    const checkoutLink = "https://checkout.nubank.com.br/838c10MWr63yhajw";

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="mentorship-page">
            <Navbar />

            {/* Custom Floating Cart for this page */}
            <a href="/mentoria/matricula" className="floating-cart btn btn-primary" style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.6)' }}>
                <ShoppingCart size={24} />
            </a>

            <style>{`
                .floating-cart {
                    position: fixed;
                    bottom: 170px; /* Above WhatsApp */
                    right: 2rem;
                    z-index: 999;
                    animation: bounceIn 1s;
                }
                @media (max-width: 768px) {
                    .floating-cart {
                        bottom: 160px; 
                        right: 2rem;
                        width: 50px !important;
                        height: 50px !important;
                    }
                }
                @keyframes bounceIn {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
            `}</style>

            {/* SEÇÃO 1 – HERO */}
            <section className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="reveal-visible">
                        <span className="section-subtitle">Mentoria de Carreira</span>
                        <h1 style={{ marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem auto' }}>
                            Entre na área de TI com <span className="text-gradient">estratégia</span>.
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
                            Dois meses de clareza valem anos de tentativas.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="/mentoria/matricula" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
                                👉 Quero garantir minha vaga
                            </a>
                            <button onClick={() => setShowQR(true)} className="btn btn-secondary" style={{ padding: '1.2rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <QrCode size={20} /> Compartilhar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* QR Code Modal for Mentorship */}
            {showQR && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 10002,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setShowQR(false)}>
                    <div style={{
                        background: '#fff', padding: '2rem', borderRadius: '20px',
                        textAlign: 'center', position: 'relative', maxWidth: '90%', width: '320px'
                    }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowQR(false)} style={{
                            position: 'absolute', top: '10px', right: '10px',
                            background: 'transparent', border: 'none', cursor: 'pointer', color: '#333'
                        }}>
                            <X size={24} />
                        </button>
                        <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Convide Amigos! 🚀</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Escaneie para acessar a Mentoria</p>

                        <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '15px', display: 'inline-block', marginBottom: '1rem' }}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://alexsander-farias.vercel.app/mentoria`}
                                alt="QR Code Mentoria"
                                style={{ display: 'block', width: '200px', height: '200px' }}
                            />
                        </div>
                        <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            alexsander-farias.vercel.app/mentoria
                        </p>
                    </div>
                </div>
            )}

            {/* SEÇÃO 2 – IDENTIFICAÇÃO */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="grid-2">
                        <div>
                            <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Quer entrar em TI, mas não sabe por onde começar?</h2>
                        </div>
                        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                            <p>O problema não é você.</p>
                            <p style={{ color: 'var(--text-heading)', fontWeight: 'bold', fontSize: '1.5rem' }}>É a falta de direção.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 3 – O PROBLEMA */}
            <section className="section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="card-glass" style={{ maxWidth: '800px', margin: '0 auto', borderColor: 'var(--secondary-color)' }}>
                        <AlertTriangle size={48} color="var(--secondary-color)" style={{ marginBottom: '1rem' }} />
                        <h2 className="text-gradient-primary">Informação demais. Direção de menos.</h2>
                        <p style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
                            Cursos sozinhos não resolvem isso. <br />
                            <strong style={{ color: 'var(--primary-color)' }}>Estratégia resolve.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 4 – A SOLUÇÃO */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">A Solução</span>
                        <h2>Mentoria Estratégica em Carreira de TI</h2>
                        <p>Sprint de 2 meses. Direcionamento real para iniciantes e transição de carreira.</p>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 5 – COMO FUNCIONA */}
            <section className="section">
                <div className="container">
                    <h2 style={{ marginBottom: '3rem' }}>Como Funciona</h2>
                    <div className="grid-3">
                        <div className="card-glass">
                            <Clock size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                            <h3>2 meses de acompanhamento</h3>
                        </div>
                        <div className="card-glass">
                            <Users size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                            <h3>8 encontros ao vivo</h3>
                            <p>Todos os sábados</p>
                        </div>
                        <div className="card-glass">
                            <Target size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                            <h3>Foco Total</h3>
                            <p>1h30 por encontro. Turma com até 10 alunos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 6 – O QUE VOCÊ CONSTRÓI */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '3rem' }}>O que você constrói</h2>
                    <div className="grid-2">
                        <ul style={{ listStyle: 'none' }}>
                            {[
                                "Clareza de carreira",
                                "Plano de estudo personalizado",
                                "Roadmap profissional",
                                "Portfólio estratégico",
                                "LinkedIn otimizado"
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.2rem' }}>
                                    <Check size={24} color="var(--accent-color)" style={{ marginRight: '1rem' }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Target size={120} color="var(--text-secondary)" style={{ opacity: 0.2 }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 7 – MATERIAIS E BÔNUS */}
            <section className="section">
                <div className="container">
                    <h2 style={{ marginBottom: '3rem' }}>Materiais e Bônus</h2>
                    <div className="grid-3">
                        {[
                            "Ebook Digital – Carreira em TI",
                            "Audiobook",
                            "PDF offline",
                            "Templates de currículo",
                            "Templates de LinkedIn",
                            "Checklist de carreira",
                            "Certificado"
                        ].map((item, i) => (
                            <div key={i} className="card-glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <BookOpen size={24} style={{ marginBottom: '0.5rem', color: 'var(--secondary-color)' }} />
                                <h4>{item}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEÇÃO 8 – AUTORIDADE */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', marginBottom: '1.5rem', padding: '4px' }}>
                            <img src="https://github.com/alexsandsouza.png" alt="Alexsander Farias" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                        <h3>Alexsander Farias</h3>
                        <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Mentor de Carreiras em TI</p>
                        <p>Estratégia, clareza e posicionamento profissional.</p>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 9, 10, 11 – OFERTA */}
            <section className="section" style={{ padding: '6rem 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="card-glass" style={{ maxWidth: '600px', margin: '0 auto', border: '2px solid var(--primary-color)', position: 'relative', overflow: 'hidden' }}>
                        {/* Faixa de Desconto */}
                        <div style={{ position: 'absolute', top: '20px', right: '-35px', background: 'var(--secondary-color)', padding: '5px 40px', transform: 'rotate(45deg)', color: 'white', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                            50% OFF
                        </div>

                        <span className="section-subtitle">Oferta Especial</span>
                        <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Mentoria Completa</h2>
                        <p style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>De R$ 1.194,00</p>

                        <div style={{ margin: '2rem 0' }}>
                            <p style={{ fontSize: '1.2rem' }}>Por apenas</p>
                            <h3 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', lineHeight: 1 }}>R$ 597</h3>
                            <p>no Pix</p>
                            <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>ou 12x de R$ 59,61 no cartão</p>
                        </div>

                        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed var(--secondary-color)' }}>
                            <p style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>🔥 Oferta válida até 07/02</p>
                            <Countdown targetDate="2026-02-07T23:59:59" />
                            <p style={{ fontSize: '0.9rem' }}>Apenas 10 vagas. Quando fechar, encerra.</p>
                        </div>

                        <a href="/mentoria/matricula" className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.3rem' }}>
                            Quero garantir minha vaga
                        </a>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 11.5 - PERGUNTAS FREQUENTES (FAQ) */}
            <section className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ marginBottom: '3rem', textAlign: 'center' }}>Perguntas Frequentes</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { q: "Preciso saber programar para participar?", a: "Não. A mentoria é focada em estratégia de carreira, cobrindo desde quem está começando do zero até quem já estuda mas se sente perdido." },
                            { q: "Como funcionam os encontros?", a: "São 8 encontros ao vivo, todos os sábados, via Google Meet/Zoom. Cada sessão tem duração média de 1h30 com conteúdo e tira-dúvidas." },
                            { q: "E se eu perder uma aula ao vivo?", a: "Fique tranquilo! Todos os encontros são gravados e disponibilizados na área de membros para você assistir quando quiser." },
                            { q: "Quais as formas de pagamento?", a: "Você pode pagar à vista via Pix com desconto ou parcelar em até 12x no cartão de crédito." },
                            { q: "Tem garantia?", a: "Sim! Você tem garantia incondicional de 7 dias. Se achar que não é para você, devolvemos seu investimento." }
                        ].map((item, i) => (
                            <details key={i} className="card-glass" style={{ cursor: 'pointer', padding: '1.5rem' }}>
                                <summary style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none' }}>
                                    {item.q}
                                    <span style={{ color: 'var(--primary-color)' }}>+</span>
                                </summary>
                                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEÇÃO 12 – CTA FINAL */}
            <section className="section" style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '2rem' }}>Quem tem direção, avança.</h2>
                    <a href="/mentoria/matricula" className="btn btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>
                        👉 Quero garantir minha vaga agora
                    </a>
                </div>
            </section>

            <WhatsAppButton message="Olá Alex, estou na página da Mentoria Carreira TI e tenho algumas dúvidas antes de me matricular." />
        </div>
    );
};

export default MentorshipPage;
