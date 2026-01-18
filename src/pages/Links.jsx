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
            label: 'Portfólio Completo',
            url: '/',
            icon: <ExternalLink size={20} />,
            internal: true
        },
        {
            label: 'LinkedIn Profissional',
            url: 'https://linkedin.com/in/alexsander-farias', // Ajuste se necessário
            icon: <Linkedin size={20} />,
        },
        {
            label: 'GitHub',
            url: 'https://github.com/alexsandsouza',
            icon: <Github size={20} />,
        },
        {
            label: 'Instagram',
            url: 'https://instagram.com/prof.alexsanderfarias', // Ajuste se necessário
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
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
                            Prof. Alexsander Farias
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Educação Tecnológica & Full Stack Dev.<br />
                            Transformando carreiras através da tecnologia.
                        </p>
                    </div>
                </Reveal>

                {/* Links Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

            <style>{`
                .profile-wrapper {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 1.5rem;
                    padding: 4px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
                }

                .bio-link {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: var(--text-heading);
                    text-decoration: none;
                    font-weight: 500;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .bio-link:hover {
                    transform: translateY(-3px) scale(1.02);
                    background: rgba(30, 41, 59, 0.6);
                    border-color: var(--primary-color);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }

                .bio-link.highlight {
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9));
                    border: none;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                }

                .bio-link.highlight:hover {
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.6);
                }

                .icon-wrapper {
                    display: flex;
                    align-items: center;
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
};

export default Links;
