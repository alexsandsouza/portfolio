import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            textAlign: 'center'
        }}>
            <div className="container">
                <p>© {new Date().getFullYear()} Prof. Alexsander Farias. Todos os direitos reservados.</p>
                <p>
                    <a href="/links" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', fontSize: '0.85rem' }}>Links Úteis (Bio)</a>
                    <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>·</span>
                    <a href="https://adacademynet.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontSize: '0.85rem' }}>AD Academy</a>
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
        </footer>
    );
};

export default Footer;
