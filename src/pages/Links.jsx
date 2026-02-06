import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Youtube, ExternalLink, ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const Links = () => {
    const socialLinks = [
        {
            label: 'Matrícula Mentoria Tech',
            url: '/mentoria',
            icon: <ArrowRight size={20} />,
            highlight: true, // Estilo de destaque
            internal: true
        },
        {
            label: 'AD Academy One (Hub)',
            url: 'https://ad-academy-one.vercel.app',
            icon: <ExternalLink size={20} />,
        },
        {
            label: 'Podcast Routing Friends',
            url: 'https://www.youtube.com/live/G8lZCTndNV8?si=kOfQ7RC1XV9RVPbc',
            icon: <Youtube size={20} />,
        },
        {
            label: 'Currículo Lattes (CNPq)',
            url: 'http://lattes.cnpq.br/2107081536584079',
            icon: <ExternalLink size={20} />,
        },
        {
            label: 'Portfólio Completo',
            url: '/',
            icon: <ExternalLink size={20} />,
            internal: true
        },
        {
            label: 'Currículo Web (Live)',
            url: '/cv',
            icon: <ExternalLink size={20} />,
            internal: true
        },
        {
            label: 'LinkedIn Profissional',
            url: 'https://linkedin.com/in/alexsandfarias',
            icon: <Linkedin size={20} />,
        },
        {
            label: 'GitHub',
            url: 'https://github.com/alexsandsouza',
            icon: <Github size={20} />,
        },
        {
            label: 'Instagram',
            url: 'https://www.instagram.com/alexsandsouza/',
            icon: <Instagram size={20} />,
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '4rem 1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'fixed', top: '-20%', left: '-20%', width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
                zIndex: 0, pointerEvents: 'none', filter: 'blur(50px)'
            }} />
            <div style={{
                position: 'fixed', bottom: '-20%', right: '-20%', width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent 70%)',
                zIndex: 0, pointerEvents: 'none', filter: 'blur(50px)'
            }} />

            <div style={{ zIndex: 1, width: '100%', maxWidth: '400px', textAlign: 'center' }}>

                {/* Profile Section */}
                <Reveal>
                    <div style={{ marginBottom: '2rem' }}>
                        <div className="profile-wrapper">
                            <img
                                src="/Foto_Perfil_Round.png"
                                alt="Prof. Alexsander Farias"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.8rem', color: 'var(--text-heading)', fontWeight: '800', letterSpacing: '-0.5px' }}>
                            Prof. Alexsander Farias
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Prof. Universitário | Dev Full Stack | Avaliador TCC e Projetos<br />
                            Transformando carreiras através de mentorias na área da tecnologia da Informação - TI.
                        </p>

                        <a href="/contact.vcf" download="Alexsander_Farias.vcf" className="vcard-btn">
                            <span style={{ fontSize: '1.2rem' }}>📇</span> Salvar Contato
                        </a>
                    </div>
                </Reveal>

                <style>{`
                    .vcard-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 10px 20px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 25px;
                        color: var(--text-primary);
                        text-decoration: none;
                        font-size: 1rem;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    }
                    .vcard-btn:hover {
                        background: rgba(255, 255, 255, 0.2);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    }

                    .profile-wrapper {
                        width: 200px; /* Increased to 200px as requested */
                        height: 200px;
                        margin: 0 auto 1.5rem;
                        padding: 6px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
                        transition: transform 0.3s ease;
                    }
                    .profile-wrapper:hover {
                        transform: scale(1.05);
                    }

                    .bio-link {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1.2rem 1.5rem;
                        background: rgba(30, 41, 59, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 16px;
                        color: var(--text-heading);
                        text-decoration: none;
                        font-weight: 600;
                        font-size: 1.05rem;
                        backdrop-filter: blur(12px);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    .bio-link:hover {
                        transform: translateY(-4px) scale(1.02);
                        background: rgba(30, 41, 59, 0.8);
                        border-color: var(--primary-color);
                        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
                    }

                    .bio-link.highlight {
                        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        border: none;
                        color: white;
                        font-weight: 700;
                        font-size: 1.15rem;
                        padding: 1.4rem 1.5rem;
                        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
                        animation: pulse-border 2s infinite;
                    }

                    .bio-link.highlight:hover {
                        box-shadow: 0 15px 35px rgba(99, 102, 241, 0.6);
                        transform: translateY(-4px) scale(1.03);
                    }

                    .icon-wrapper {
                        display: flex;
                        align-items: center;
                        opacity: 0.9;
                    }
                    
                    @media (min-width: 600px) {
                        .bio-link { padding: 1.4rem 2rem; font-size: 1.1rem; }
                    }
                `}</style>

                {/* Links Stack - RESTORED */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                    {socialLinks.map((link, index) => (
                        <Reveal key={index} delay={index * 100} width="100%">
                            {link.internal ? (
                                <Link to={link.url} className={`bio-link ${link.highlight ? 'highlight' : ''}`}>
                                    <span>{link.label}</span>
                                    <span className="icon-wrapper">{link.icon}</span>
                                </Link>
                            ) : (
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className={`bio-link ${link.highlight ? 'highlight' : ''}`}>
                                    <span>{link.label}</span>
                                    <span className="icon-wrapper">{link.icon}</span>
                                </a>
                            )}
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={600}>
                    <footer style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.7 }}>
                        © 2026 Alexsander Farias
                    </footer>
                </Reveal>
            </div>
        </div>
    );
};

export default Links;
