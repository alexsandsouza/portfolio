import React, { useState } from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const SocialNode = ({ platform, url, icon }) => {
    const { ref, style } = useHoverCard({ maxRotation: 10, scale: 1.2 });

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" ref={ref} style={{
            ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
        }} title={platform}>
            <div style={{
                width: '50px', height: '50px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                boxShadow: 'var(--card-shadow)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {style.glow !== 'none' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `radial-gradient(circle at center, ${style.glow.replace('0.4', '0.5')}, transparent 70%)`,
                    }} />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>{icon}</span>
            </div>
        </a>
    );
};

const Contact = () => {
    const { contact } = portfolioContent;
    const [formStatus, setFormStatus] = useState(null); // null, 'submitting', 'success'

    const handleSubmit = (e) => {
        // O envio real é feito pelo action do form, aqui só gerenciamos estado visual se necessário ou validação
        // Para este exemplo com FormSubmit, deixamos o form agir naturalmente ou usamos AJAX.
        // Vamos deixar o form nativo para garantir o envio robusto sem JS complexo.
        setFormStatus('submitting');
    };

    return (
        <section id="contact" className="section" style={{ position: 'relative', paddingBottom: '5rem', overflow: 'hidden' }}>
            {/* Cyber Grid Floor */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%',
                background: 'var(--contact-gradient)',
                zIndex: -2
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4rem',
                    alignItems: 'start'
                }} className="contact-grid">

                    {/* Left Column: Info & Socials */}
                    <Reveal width="100%">
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulseSignal 2s infinite', display: 'inline-block' }}>📡</div>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-heading)' }}>
                                {contact.title}
                            </h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Estou disponível para novos projetos acadêmicos, consultorias e desenvolvimento Full Stack.
                                Vamos construir algo incrível juntos?
                            </p>

                            {/* WhatsApp Button */}
                            <a href="https://wa.me/5592991199999" target="_blank" rel="noopener noreferrer" className="cyber-button-small" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                padding: '1rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: '#fff',
                                background: '#25D366', // WhatsApp Green
                                border: 'none',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                marginBottom: '3rem',
                                boxShadow: '0 0 20px rgba(37, 211, 102, 0.3)',
                                transition: 'all 0.3s'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>💬</span>
                                <span>Chamar no WhatsApp</span>
                            </a>

                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Conecte-se comigo:</h3>
                            <div className="social-links" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <SocialNode platform="LinkedIn" url="https://www.linkedin.com/in/alexsandfarias" icon="👔" />
                                <SocialNode platform="Lattes" url="http://lattes.cnpq.br/2107081536584079" icon="🎓" />
                                <SocialNode platform="GitHub" url="https://github.com/alexsandsouza" icon="🐙" />
                                <SocialNode platform="Instagram" url="https://www.instagram.com/alexsandsouza/" icon="📸" />
                                <SocialNode platform="Email" url="mailto:alexsandfarias@gmail.com" icon="📧" />
                            </div>
                        </div>
                    </Reveal>

                    {/* Right Column: Contact Form */}
                    <Reveal width="100%" delay={0.2}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                        }}>
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginBottom: '1.5rem' }}>Envie um E-mail</h3>

                            <form action="https://formsubmit.co/alexsandfarias@gmail.com" method="POST" onSubmit={() => setFormStatus('success')}>
                                {/* Configurações do FormSubmit */}
                                <input type="hidden" name="_subject" value="Novo contato do Portfólio!" />
                                <input type="hidden" name="_template" value="table" />
                                <input type="hidden" name="_captcha" value="false" />
                                <input type="hidden" name="_next" value="https://alexsander-farias.vercel.app/" /> {/* Redireciona de volta após envio */}

                                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Seu Nome</label>
                                    <input type="text" name="name" required style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }} placeholder="Ex: João Silva" />
                                </div>

                                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Seu E-mail</label>
                                    <input type="email" name="email" required style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }} placeholder="Ex: joao@email.com" />
                                </div>

                                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mensagem</label>
                                    <textarea name="message" required rows="4" style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }} placeholder="Como posso ajudar?"></textarea>
                                </div>

                                <button type="submit" className="cyber-button" style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    background: 'var(--primary-color)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'filter 0.3s'
                                }}>
                                    🚀 Enviar Mensagem
                                </button>
                            </form>
                        </div>
                    </Reveal>
                </div>

                {/* Footer Style Integration */}
                <div style={{
                    marginTop: '5rem',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '2rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                }}>
                    <p>© {new Date().getFullYear()} Prof. Alexsander Farias. Todos os direitos reservados.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Desenvolvido com <span style={{ color: '#ef4444' }}>❤</span> e Tecnologia Vite + React
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes pulseSignal { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
                .cyber-button:hover { filter: brightness(1.2); }
                .cyber-button-small:hover { transform: translateY(-3px); filter: brightness(1.1); }
                input:focus, textarea:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
                
                .contact-left-col { text-align: left; }
                
                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                    .contact-left-col {
                        text-align: center !important;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .social-links {
                        justify-content: center !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Contact;
