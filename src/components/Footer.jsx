import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const linkStyle = {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.85rem',
        transition: 'color 0.3s ease',
    };

    const socialIconStyle = {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
    };

    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '2.5rem',
            paddingBottom: '2rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
        }}>
            <div className="container" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 2rem',
            }}>
                {/* Grid principal */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem',
                }}>
                    {/* Coluna 1: Sobre */}
                    <div>
                        <h4 style={{
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>Prof. Alexsander Farias</h4>
                        <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                            Professor Universitário, Dev Full Stack e Instrutor Cisco. Formando talentos em TI desde 2010.
                        </p>
                    </div>

                    {/* Coluna 2: Links Rápidos */}
                    <div>
                        <h4 style={{
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>Navegação</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <a href="#about" style={linkStyle}>Sobre</a>
                            <a href="#projects" style={linkStyle}>Projetos</a>
                            <a href="#contact" style={linkStyle}>Contato</a>
                            <a href="/cv" style={linkStyle}>Currículo</a>
                            <a href="/links" style={linkStyle}>Links (Bio)</a>
                        </div>
                    </div>

                    {/* Coluna 3: Ecossistema */}
                    <div>
                        <h4 style={{
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>Ecossistema</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <a href="https://adacademynet.vercel.app" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, color: 'var(--primary-color)' }}>AD Academy Net</a>
                            <a href="/hackersdobem" style={linkStyle}>Hackers do Bem</a>
                            <a href="/fametro" style={linkStyle}>Hub Fametro</a>
                            <a href="/mentoria" style={linkStyle}>Mentoria</a>
                        </div>
                    </div>

                    {/* Coluna 4: Legal + Social */}
                    <div>
                        <h4 style={{
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>Legal</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
                            <a href="/privacidade" style={linkStyle}>Política de Privacidade</a>
                        </div>

                        {/* Social Icons */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                            <a href="https://www.linkedin.com/in/alexsandfarias" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="LinkedIn">
                                💼
                            </a>
                            <a href="https://github.com/alexsandsouza" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="GitHub">
                                🐙
                            </a>
                            <a href="https://www.instagram.com/alexsandsouza/" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="Instagram">
                                📸
                            </a>
                            <a href="http://lattes.cnpq.br/2107081536584079" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="Lattes">
                                🎓
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <p style={{ fontSize: '0.8rem', margin: 0 }}>
                        © {currentYear} Prof. Alexsander Farias. Todos os direitos reservados.
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                    }}>
                        <span>Desenvolvido com <span style={{ color: '#ef4444' }}>❤</span> e Tecnologia Vite + React</span>
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
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
