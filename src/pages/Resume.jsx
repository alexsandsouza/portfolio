import React, { useEffect } from 'react';
import { portfolioContent } from '../data/content';
import { Printer, ArrowLeft, Mail, Linkedin, MapPin, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resume = () => {
    const { hero, about, professionalExperience, education, skills, highlights } = portfolioContent;

    useEffect(() => {
        document.title = "Currículo - Prof. Alexsander Farias";
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ background: '#525659', minHeight: '100vh', padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>

            {/* Floating Controls */}
            <div className="no-print" style={{
                position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', gap: '1rem', zIndex: 1000
            }}>
                <Link to="/" style={{
                    background: '#1e293b', color: '#fff', padding: '1rem', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    textDecoration: 'none'
                }} title="Voltar ao Site">
                    <ArrowLeft size={24} />
                </Link>
                <button onClick={handlePrint} style={{
                    background: '#e76f51', color: '#fff', padding: '1rem 2rem', borderRadius: '50px',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem',
                    boxShadow: '0 4px 12px rgba(231, 111, 81, 0.4)', fontWeight: 'bold', fontSize: '1rem'
                }}>
                    <Printer size={20} /> Imprimir / Salvar PDF
                </button>
            </div>

            {/* A4 Paper Container */}
            <div className="resume-paper" style={{
                background: '#fff',
                width: '210mm',
                minHeight: '297mm',
                display: 'grid',
                gridTemplateColumns: '32% 68%', // Left Sidebar / Right Main
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                fontFamily: "'Roboto', 'Inter', sans-serif",
                position: 'relative',
                overflow: 'hidden'
            }}>

                {/* === LEFT COLUMN (SIDEBAR) === */}
                <aside style={{ background: '#084c61', color: '#fff', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Photo */}
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <div style={{
                            width: '120px', height: '120px', margin: '0 auto',
                            borderRadius: '12px', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                        }}>
                            <img src="/Foto_Perfil_Round.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>

                    {/* Conquistas Chave */}
                    <section>
                        <h3 className="sidebar-title">Conquistas Chave</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {highlights.map((item, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e9c46a', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                                        <Star size={14} fill="#e9c46a" /> {item.title}
                                    </div>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.4, margin: 0 }}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                    {/* Habilidades */}
                    <section>
                        <h3 className="sidebar-title">Habilidades</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#e9c46a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tech Stack</h4>
                            <ul className="sidebar-list">
                                {[...skills.hard.tech, "Git/GitHub", "Database SQL/NoSQL"].map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#e9c46a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Infra & Security</h4>
                            <ul className="sidebar-list">
                                {skills.hard.infra.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                    </section>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                    {/* Idiomas */}
                    <section>
                        <h3 className="sidebar-title">Idiomas</h3>
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Português</span> <span style={{ opacity: 0.7 }}>Nativo</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Inglês</span> <span style={{ opacity: 0.7 }}>Téc. / Interm.</span>
                            </div>
                        </div>
                    </section>

                </aside>


                {/* === RIGHT COLUMN (MAIN CONTENT) === */}
                <main style={{ padding: '40px 30px', background: '#fff' }}>

                    {/* Header */}
                    <header style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#264653', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem' }}>
                            {hero.name}
                        </h1>
                        <h2 style={{ fontSize: '1.1rem', color: '#e76f51', fontWeight: '500', marginBottom: '1rem' }}>
                            {hero.title.replace(/\n/g, " | ")}
                        </h2>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Mail size={14} /> alexsandfarias@gmail.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Linkedin size={14} /> linkedin.com/in/alexsandfarias
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Globe size={14} /> alexsander-farias.vercel.app
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin size={14} /> Manaus, Brasil
                            </div>
                        </div>
                    </header>


                    {/* Resumo */}
                    <section className="main-section">
                        <h3 className="section-header">Resumo</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#4a4a4a', textAlign: 'justify' }}>
                            {about.description}
                        </p>
                    </section>


                    {/* Experiência */}
                    <section className="main-section">
                        <h3 className="section-header">Experiência</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {professionalExperience.map((exp, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#333' }}>{exp.role}</h4>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#333' }}>{exp.period}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#e76f51', fontWeight: '500', marginBottom: '6px' }}>
                                        {exp.institution} <span style={{ color: '#aaa', fontWeight: '400' }}>| {exp.type}</span>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>
                                        <li style={{ marginBottom: '4px' }}>{exp.description}</li>
                                        {exp.results && <li>{exp.results}</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Educação */}
                    <section className="main-section">
                        <h3 className="section-header">Educação</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {education.map((edu, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333' }}>{edu.course}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#e76f51' }}>{edu.institution}</div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', textAlign: 'right', color: '#666' }}>
                                        <div style={{ whiteSpace: 'nowrap' }}>{edu.period}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{edu.level}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
                
                .resume-paper * { box-sizing: border-box; }

                .sidebar-title {
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    padding-bottom: 8px;
                    margin-bottom: 1rem;
                    color: #fff;
                    font-weight: 700;
                }

                .sidebar-list {
                    margin: 0; padding: 0; list-style: none;
                }
                .sidebar-list li {
                    font-size: 0.85rem;
                    margin-bottom: 6px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .sidebar-list li::before {
                    content: '•'; color: #e76f51; font-weight: bold;
                }

                .main-section {
                    margin-bottom: 2rem;
                }

                .section-header {
                    font-size: 1rem;
                    text-transform: uppercase;
                    color: #666;
                    letter-spacing: 1.5px;
                    font-weight: 700;
                    margin-bottom: 1.2rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #eee;
                }

                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .resume-paper {
                        box-shadow: none !important;
                        margin: 0 !important;
                        width: 100% !important;
                        min-height: 100vh !important;
                        display: grid !important; 
                        grid-template-columns: 32% 68% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Resume;
