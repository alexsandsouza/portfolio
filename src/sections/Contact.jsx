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
    const [formStatus, setFormStatus] = useState(null);
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText('alexsandfarias@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('submitting');
        const form = e.target;
        const data = new FormData(form);
        try {
            const res = await fetch('https://formsubmit.co/ajax/alexsandfarias@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: data
            });
            if (res.ok) {
                setFormStatus('success');
                form.reset();
            } else {
                setFormStatus('error');
            }
        } catch {
            setFormStatus('error');
        }
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
                        <div style={{
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulseSignal 2s infinite', display: 'inline-block' }}>📡</div>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-heading)' }}>
                                {contact.title}
                            </h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Estou disponível para novos projetos acadêmicos, consultorias e desenvolvimento Full Stack.
                                Vamos construir algo incrível juntos?
                            </p>

                            {/* WhatsApp Button */}
                            <a href="https://wa.me/5592981425690" target="_blank" rel="noopener noreferrer" className="cyber-button-small" style={{
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

                            <button onClick={copyEmail} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: copied ? 'rgba(34, 197, 94, 0.1)' : 'var(--card-bg)',
                                border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.5)' : 'var(--card-border)'}`,
                                borderRadius: '50px',
                                color: copied ? '#22c55e' : 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                marginBottom: '2rem',
                                fontFamily: 'monospace'
                            }}>
                                {copied ? '✓ Copiado!' : '📋 alexsandfarias@gmail.com'}
                            </button>

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

                            {formStatus === 'success' && (
                                <div style={{
                                    padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem',
                                    background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                                    <p style={{ color: '#22c55e', fontWeight: '600', margin: 0 }}>Mensagem enviada com sucesso!</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>Responderei em breve.</p>
                                </div>
                            )}

                            {formStatus === 'error' && (
                                <div style={{
                                    padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem',
                                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}>
                                    <p style={{ color: '#ef4444', margin: 0, fontSize: '0.9rem' }}>❌ Erro ao enviar. Tente pelo WhatsApp.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="_subject" value="Novo contato do Portfólio!" />

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

                                <button type="submit" className="cyber-button" disabled={formStatus === 'submitting'} style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    background: formStatus === 'submitting' ? 'rgba(124,111,250,0.5)' : 'var(--primary-color)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer',
                                    transition: 'filter 0.3s'
                                }}>
                                    {formStatus === 'submitting' ? '⏳ Enviando...' : '🚀 Enviar Mensagem'}
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
                    <p>
                        <a href="/links" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', fontSize: '0.85rem' }}>Links Úteis (Bio)</a>
                    </p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Desenvolvido com <span style={{ color: '#ef4444' }}>❤</span> e Tecnologia Vite + React
                        <button
                            onClick={() => window.dispatchEvent(new Event('open-terminal'))}
                            style={{
                                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-secondary)', borderRadius: '4px', padding: '2px 6px',
                                cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.7rem',
                                opacity: 0.5, transition: 'all 0.3s'
                            }}
                            title="Terminal Mode"
                            onMouseEnter={(e) => { e.target.style.opacity = '1'; e.target.style.borderColor = '#4ade80'; e.target.style.color = '#4ade80' }}
                            onMouseLeave={(e) => { e.target.style.opacity = '0.5'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'var(--text-secondary)' }}
                        >
                            &gt;_
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes pulseSignal { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
                .cyber-button:hover { filter: brightness(1.2); }
                .cyber-button-small:hover { transform: translateY(-3px); filter: brightness(1.1); }
                input:focus, textarea:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
                
                .contact-left-col { text-align: left; }
                
                @media (max-width: 900px) {
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
                    
                    /* Force center text for all headers and paragraphs on mobile left col */
                    h2, h3, p { text-align: center !important; }
                }
            `}</style>
        </section>
    );
};

export default Contact;
