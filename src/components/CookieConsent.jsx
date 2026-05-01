import React, { useState, useEffect } from 'react';

/**
 * CookieConsent — Banner de consentimento LGPD
 * 
 * Exibe um banner fixo no rodapé pedindo consentimento para cookies
 * e uso de dados conforme a LGPD (Lei 13.709/2018).
 * 
 * Persiste a escolha do usuário via localStorage.
 */
const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('lgpd-consent');
        if (!consent) {
            // Exibir com delay para não bloquear o carregamento visual
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('lgpd-consent', 'accepted');
        localStorage.setItem('lgpd-consent-date', new Date().toISOString());
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('lgpd-consent', 'declined');
        localStorage.setItem('lgpd-consent-date', new Date().toISOString());
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <>
            {/* Overlay sutil */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                zIndex: 99998,
                backdropFilter: 'blur(2px)',
                transition: 'opacity 0.4s ease',
                opacity: visible ? 1 : 0,
            }} />

            {/* Banner */}
            <div
                role="dialog"
                aria-label="Consentimento de Cookies e LGPD"
                aria-modal="true"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 99999,
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(124, 111, 250, 0.3)',
                    padding: '0',
                    transform: visible ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.4)',
                }}
            >
                {/* Barra de destaque superior */}
                <div style={{
                    height: '3px',
                    background: 'linear-gradient(90deg, #7c6ffa, #f43f8e, #00d4ff, #7c6ffa)',
                    backgroundSize: '200% 100%',
                    animation: 'gradientSlide 3s linear infinite',
                }} />

                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                }}>
                    {/* Ícone + Texto */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '0.5rem',
                        }}>
                            <span style={{
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(124, 111, 250, 0.15)',
                                border: '1px solid rgba(124, 111, 250, 0.3)',
                                flexShrink: 0,
                            }}>
                                🔒
                            </span>
                            <h3 style={{
                                color: '#f8fafc',
                                fontSize: '1rem',
                                fontWeight: 700,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                margin: 0,
                            }}>
                                Privacidade & Proteção de Dados
                            </h3>
                        </div>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            margin: 0,
                        }}>
                            Este site utiliza cookies e tecnologias semelhantes para melhorar sua experiência
                            de navegação. Em conformidade com a{' '}
                            <strong style={{ color: '#c4b5fd' }}>LGPD (Lei 13.709/2018)</strong>,
                            seus dados são tratados com transparência e segurança.{' '}
                            <a
                                href="/privacidade"
                                style={{
                                    color: '#7c6ffa',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '3px',
                                }}
                            >
                                Política de Privacidade
                            </a>
                        </p>
                    </div>

                    {/* Botões */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexShrink: 0,
                        alignItems: 'center',
                    }}>
                        <button
                            onClick={handleDecline}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid rgba(148, 163, 184, 0.3)',
                                background: 'transparent',
                                color: '#94a3b8',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.borderColor = 'rgba(148, 163, 184, 0.6)';
                                e.target.style.color = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                                e.target.style.color = '#94a3b8';
                            }}
                        >
                            Recusar
                        </button>
                        <button
                            onClick={handleAccept}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #7c6ffa, #6366f1)',
                                color: '#fff',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(124, 111, 250, 0.4)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(124, 111, 250, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(124, 111, 250, 0.4)';
                            }}
                        >
                            ✓ Aceitar Cookies
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes gradientSlide {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }
                @media (max-width: 768px) {
                    [role="dialog"] > div:last-of-type {
                        flex-direction: column !important;
                        text-align: center !important;
                        padding: 1.25rem 1rem !important;
                    }
                }
            `}</style>
        </>
    );
};

export default CookieConsent;
