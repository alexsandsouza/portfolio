import React, { useEffect } from 'react';
import { portfolioContent } from '../data/content';
import { Printer, ArrowLeft, Mail, Linkedin, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resume = () => {
    const { hero, about, professionalExperience, education, skills } = portfolioContent;

    useEffect(() => {
        document.title = "Currículo - Prof. Alexsander Farias";
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // Filtra apenas as 3 últimas experiências
    const latestExperience = professionalExperience.slice(0, 3);

    return (
        <div style={{ background: '#525659', minHeight: '100vh', padding: '2rem 0', display: 'flex', justifyContent: 'center', fontFamily: "'Roboto', sans-serif" }}>

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
                    background: '#0F172A', color: '#fff', padding: '1rem 2rem', borderRadius: '50px',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.4)', fontWeight: 'bold', fontSize: '1rem'
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
                gridTemplateColumns: '65% 35%', // Main Content (Left) / Sidebar (Right)
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden'
            }}>

                {/* === LEFT COLUMN (MAIN CONTENT) === */}
                <main style={{ padding: '40px 30px', color: '#333' }}>

                    {/* Header: Photo + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '100px', height: '100px', flexShrink: 0,
                            borderRadius: '50%', overflow: 'hidden',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            <img src="/Foto_Perfil_Round.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#000', lineHeight: 1, marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                                {hero.name}
                            </h1>
                            <h2 style={{ fontSize: '0.9rem', color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                Professor & Full Stack Dev
                            </h2>
                        </div>
                    </div>

                    {/* Resumo Profissional */}
                    <section style={{ marginBottom: '2.5rem' }}>
                        <h3 className="section-title">Resumo Profissional</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'justify', color: '#444' }}>
                            {about.description}
                        </p>
                    </section>

                    {/* Experiência Profissional */}
                    <section style={{ marginBottom: '2.5rem' }}>
                        <h3 className="section-title">Experiência Profissional</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {latestExperience.map((exp, idx) => (
                                <div key={idx}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000', marginBottom: '2px' }}>
                                        {exp.role}, {exp.institution}
                                    </h4>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                        {exp.period}
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#444', lineHeight: 1.5 }}>
                                        <li style={{ marginBottom: '4px' }}>{exp.description}</li>
                                        {exp.results && <li>{exp.results}</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Formação */}
                    <section>
                        <h3 className="section-title">Formação</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {education.slice(0, 4).map((edu, idx) => ( // Showing top 4 education
                                <div key={idx}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#000' }}>
                                        {edu.course}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#444' }}>
                                        {edu.institution}, <span style={{ fontSize: '0.8rem', color: '#666' }}>{edu.level}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>
                                        {edu.period}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>


                {/* === RIGHT COLUMN (SIDEBAR) === */}
                <aside style={{ background: '#0B2545', color: '#fff', padding: '40px 25px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* Dados Pessoais */}
                    <section>
                        <h3 className="sidebar-title">Dados Pessoais</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>Endereço</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> Manaus, AM, Brasil</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>E-mail</strong>
                                <a href="mailto:alexsandfarias@gmail.com" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> alexsandfarias@gmail.com</a>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>LinkedIn</strong>
                                <a href="https://linkedin.com/in/alexsandfarias" target="_blank" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><Linkedin size={14} /> /in/alexsandfarias</a>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>Portfólio / Site</strong>
                                <a href="https://alexsander-farias.vercel.app" target="_blank" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={14} /> alexsander-farias.vercel.app</a>
                            </div>
                        </div>
                    </section>

                    {/* Competências / Habilidades */}
                    <section>
                        <h3 className="sidebar-title">Competências</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="skill-item">
                                <span>Desenvolvimento Full Stack</span>
                                <div className="progress-bar"><div style={{ width: '95%' }}></div></div>
                            </div>
                            <div className="skill-item">
                                <span>Docência & Educação Tech</span>
                                <div className="progress-bar"><div style={{ width: '100%' }}></div></div>
                            </div>
                            <div className="skill-item">
                                <span>Cibersegurança & Redes</span>
                                <div className="progress-bar"><div style={{ width: '90%' }}></div></div>
                            </div>
                            <div className="skill-item">
                                <span>Gestão de Projetos</span>
                                <div className="progress-bar"><div style={{ width: '85%' }}></div></div>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.8rem', opacity: 0.8, textTransform: 'uppercase' }}>Ferramentas & Tech</h4>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', lineHeight: '1.6' }}>
                                <li>React.js & Node.js</li>
                                <li>Javascript / Python / Java</li>
                                <li>Git & GitHub</li>
                                <li>SQL & NoSQL Databases</li>
                                <li>Figma (UX/UI)</li>
                                <li>Metodologias Ágeis</li>
                            </ul>
                        </div>
                    </section>

                    {/* Idiomas */}
                    <section>
                        <h3 className="sidebar-title">Idiomas</h3>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>Português (Nativo)</div>
                            <div>Inglês (Técnico / Leitura Avançada)</div>
                        </div>
                    </section>

                </aside>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
                
                .resume-paper * { box-sizing: border-box; }

                .section-title {
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: #000;
                    border-bottom: 2px solid #000;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1.2rem;
                }

                .sidebar-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #fff;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    padding-bottom: 0.5rem;
                    margin-bottom: 1.2rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .skill-item { margin-bottom: 1rem; }
                .skill-item span { display: block; font-size: 0.85rem; margin-bottom: 0.3rem; }
                .progress-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; }
                .progress-bar div { height: 100%; background: #fff; border-radius: 2px; }

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
                        grid-template-columns: 65% 35% !important;
                    }
                    /* Ensure links are white in sidebar */
                    aside a { color: #fff !important; text-decoration: none; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
