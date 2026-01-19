import React, { useEffect } from 'react';
import { portfolioContent } from '../data/content';
import { Printer, Download, ArrowLeft, Mail, Linkedin, Globe, MapPin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resume = () => {
    const { hero, about, professionalExperience, education, skills, projects } = portfolioContent;

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
                    background: '#2563eb', color: '#fff', padding: '1rem 2rem', borderRadius: '50px',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.4)', fontWeight: 'bold', fontSize: '1rem'
                }}>
                    <Printer size={20} /> Imprimir / Salvar PDF
                </button>
            </div>

            {/* A4 Paper Container */}
            <div className="resume-paper" style={{
                background: '#fff',
                width: '210mm',
                minHeight: '297mm',
                padding: '15mm 20mm', // Margins
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                color: '#334155',
                fontFamily: "'Inter', sans-serif",
                position: 'relative'
            }}>

                {/* Header */}
                <header style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1 }}>{hero.name}</h1>
                            <h2 style={{ fontSize: '1.2rem', color: '#2563eb', fontWeight: '600', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                                Professor Universitário | Dev Full Stack
                            </h2>
                            {/* <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', maxWidth: '80%' }}>
                                {about.description.slice(0, 200)}...
                            </p> */}
                        </div>
                        {/* <div style={{ width: '80px', height: '80px', background: '#0f172a', borderRadius: '50%', overflow: 'hidden' }}>
                            <img src="/Foto_Perfil_Round.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div> */}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={14} /> alexsandfarias@gmail.com
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Linkedin size={14} /> linkedin.com/in/alexsandfarias
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Github size={14} /> github.com/alexsandsouza
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={14} /> alexsander-farias.vercel.app
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} /> Manaus, AM
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

                    {/* Left Column (Main Content) */}
                    <div>
                        {/* Summary */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h3 className="section-title">Resumo Profissional</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'justify' }}>
                                {about.description}
                            </p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 'bold' }}>{about.resume_focus}</p>
                        </section>

                        {/* Experience */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h3 className="section-title">Experiência Profissional</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {professionalExperience.slice(0, 4).map((exp, idx) => (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{exp.role}</h4>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#2563eb' }}>{exp.period}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#475569', fontStyle: 'italic', marginBottom: '0.3rem' }}>{exp.institution}</div>
                                        <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{exp.description}</p>
                                        {/* <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '0.2rem' }}>✓ {exp.results}</div> */}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <h3 className="section-title">Projetos em Destaque</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {projects.slice(0, 3).map((proj, idx) => (
                                    <div key={idx} style={{ borderLeft: '3px solid #e2e8f0', paddingLeft: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>{proj.title}</h4>
                                            {/* <span style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{proj.role}</span> */}
                                        </div>
                                        <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}>{proj.description}</p>
                                        <a href={proj.link} target="_blank" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none' }}>{proj.link}</a>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div>
                        {/* Education */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h3 className="section-title">Formação Acadêmica</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {education.map((edu, idx) => (
                                    <div key={idx}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1.2 }}>{edu.course}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#475569' }}>{edu.institution}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{edu.level} • {edu.period}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h3 className="section-title">Competências</h3>

                            <div style={{ marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Tech Stack</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {[...skills.hard.tech, ...skills.hard.base.slice(0, 4)].map(skill => (
                                        <span key={skill} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#334155' }}>{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Infra & Security</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {skills.hard.infra.map(skill => (
                                        <span key={skill} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#334155' }}>{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Soft Skills</h4>
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#334155' }}>
                                    {skills.soft.slice(0, 5).map(skill => (
                                        <li key={skill} style={{ marginBottom: '0.2rem' }}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Languages / Extra */}
                        <section>
                            <h3 className="section-title">Idiomas</h3>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                    <span>Português</span> <b>Nativo</b>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Inglês</span> <b>Técnico / Intermediário</b>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>

                {/* Footer Quote */}
                <div style={{
                    marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0',
                    textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic'
                }}>
                    "Transformando carreiras através da tecnologia e educação de qualidade."
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                
                .section-title {
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                    color: #0f172a;
                    font-weight: 800;
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
                        padding: 10mm 15mm !important; /* Slightly adjusted margins for printer */
                    }
                    /* Ensure links are black or standard color, not blue underlines if desired */
                    a { text-decoration: none; color: inherit; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
