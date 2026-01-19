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
        <div className="resume-wrapper" style={{ background: '#525659', minHeight: '100vh', padding: '2rem 0', display: 'flex', justifyContent: 'center', fontFamily: "'Roboto', sans-serif" }}>

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
                <main style={{ padding: '20px 20px', color: '#333' }}>

                    {/* Header: Photo + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.2rem' }}>
                        <div style={{
                            width: '60px', height: '60px', flexShrink: 0,
                            borderRadius: '50%', overflow: 'hidden',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            <img src="/Foto_Perfil_Round.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#000', lineHeight: 1, marginBottom: '0', textTransform: 'uppercase' }}>
                                Alexsand Farias de Souza
                            </h1>
                            {/* Subtitle Removed per user request */}
                        </div>
                    </div>

                    {/* Resumo Profissional */}
                    <section style={{ marginBottom: '1rem' }}>
                        <h3 className="section-title">Resumo Profissional</h3>
                        <p style={{ fontSize: '0.7rem', lineHeight: 1.3, textAlign: 'justify', color: '#000' }}>
                            Professor Universitário e Desenvolvedor Full Stack com sólida experiência em formação de talentos em TI (Engenharia de Software, Redes, Cibersegurança). Atuo como Avaliador de Projetos/TCC e consultor técnico, conectando teoria acadêmica à prática de mercado com foco em inovação e transformação digital. Fundador da AD Academy.
                        </p>
                    </section>

                    {/* Experiência Profissional */}
                    <section style={{ marginBottom: '0.8rem' }}>
                        <h3 className="section-title">Experiência Profissional</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {latestExperience.map((exp, idx) => (
                                <div key={idx} style={{ pageBreakInside: 'avoid', marginBottom: '0.2rem' }}>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#000', marginBottom: '1px' }}>
                                        {exp.role}, {exp.institution}
                                    </h4>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                                        {exp.period}
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1rem', marginTop: '1px', fontSize: '0.7rem', color: '#000', lineHeight: 1.25, textAlign: 'justify' }}>
                                        <li style={{ marginBottom: '1px' }}>{exp.description}</li>
                                        {exp.results && <li>{exp.results}</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Formação */}
                    <section style={{ marginBottom: '0.8rem' }}>
                        <h3 className="section-title">Formação</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {education.slice(0, 4).map((edu, idx) => (
                                <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#000' }}>
                                        {edu.course}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#333' }}>
                                        {edu.institution}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Formação Complementar (NEW) */}
                    <section>
                        <h3 className="section-title">Formação Complementar</h3>
                        <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: '#000', lineHeight: 1.3, textAlign: 'justify' }}>
                            <li>Instrutor Cisco Networking Academy</li>
                            <li>Formação e Certificação Cisco CCNA (ITN-SWRE-ENSA)</li>
                            <li>Curso Formação Profissional em CyberSegurança Cisco</li>
                            <li>Formação CyberOPS Associate Cisco</li>
                            <li>Formação Networking Security Cisco</li>
                            <li>Formação Dev Full Stack - Alura/Oracle</li>
                        </ul>
                    </section>

                </main>


                {/* === RIGHT COLUMN (SIDEBAR) === */}
                <aside style={{ background: '#0B2545', color: '#fff', padding: '20px 15px', display: 'flex', flexDirection: 'column', gap: '1.2rem', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>

                    {/* Dados Pessoais */}
                    <section>
                        <h3 className="sidebar-title">Dados Pessoais</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.7rem' }}>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>Endereço</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> Manaus, AM, Brasil</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>E-mail</strong>
                                <a href="mailto:alexsandfarias@gmail.com" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}><Mail size={12} /> alexsandfarias@gmail.com</a>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>LinkedIn</strong>
                                <a href="https://www.linkedin.com/in/alexsandfarias/" target="_blank" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '6px', wordBreak: 'break-all', lineHeight: 1.2 }}><Linkedin size={12} /> https://www.linkedin.com/in/alexsandfarias/</a>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '2px', opacity: 0.7 }}>Site</strong>
                                <a href="https://alexsander-farias.vercel.app" target="_blank" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '6px', wordBreak: 'break-all', lineHeight: 1.2 }}><Globe size={12} /> https://alexsander-farias.vercel.app</a>
                            </div>
                        </div>
                    </section>

                    {/* Competências / Habilidades */}
                    <section>
                        <h3 className="sidebar-title">Competências</h3>

                        <div style={{ marginBottom: '1.2rem' }}>
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
                            <h4 style={{ fontSize: '0.75rem', color: '#fff', marginBottom: '0.6rem', opacity: 0.8, textTransform: 'uppercase' }}>Ferramentas & Tech</h4>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.7rem', lineHeight: '1.4' }}>
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
                        <div style={{ fontSize: '0.7rem' }}>
                            <div style={{ marginBottom: '0.4rem' }}>Português (Nativo)</div>
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

                /* === RESPONSIVE SCREEN STYLES (MOBILE) === */
                @media screen and (max-width: 768px) {
                    .resume-paper {
                        width: 100% !important;
                        min-height: auto !important;
                        height: auto !important;
                        display: flex !important; /* Stack vertically on mobile screen */
                        flex-direction: column-reverse !important; /* Content first, then profile/sidebar at bottom (or swap if preferred) */
                        margin: 0 !important;
                        box-shadow: none !important;
                    }
                    
                    /* Re-order for Mobile: Header/Sidebar Top, Main Content Bottom */
                     .resume-paper {
                        flex-direction: column !important;
                    }

                    .resume-paper > aside {
                        width: 100% !important;
                        padding: 2rem !important;
                    }

                    .resume-paper > main {
                        width: 100% !important;
                        padding: 2rem !important;
                    }

                    /* Adjust header on mobile screen */
                    h1 { font-size: 2rem !important; }
                    
                    /* Hide floating buttons partially if needed or adjust position */
                    .no-print {
                        width: 100%;
                        justify-content: center;
                        bottom: 1rem;
                        right: 0;
                    }
                }

                /* === PRINT STYLES (Force A4 Desktop Layout) === */
                @media print {
                    @page { 
                        size: A4 portrait; 
                        margin: 0 !important; 
                    }
                    
                    body {
                        display: block !important; 
                        visibility: hidden; 
                        background: #fff !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        -webkit-print-color-adjust: exact;
                        
                        /* FORCE DESKTOP WIDTH FOR PRINT RENDERER */
                        min-width: 210mm !important; 
                    }

                    .no-print { display: none !important; }

                    .resume-paper {
                        visibility: visible;
                        display: grid !important; /* FORCE GRID (2 Columns) back on print */
                        position: absolute;
                        left: 0;
                        top: 0;
                        
                        width: 210mm !important;
                        height: 297mm !important;
                        max-height: 297mm !important;
                        
                        margin: 0 !important;
                        padding: 0 !important;
                        
                        grid-template-columns: 66% 34% !important; /* Slight adjust */
                        box-shadow: none !important;
                        
                        background-color: #fff !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        z-index: 9999;
                        overflow: hidden;
                        
                        /* Reset Mobile Flex/Stacking overrides */
                        flex-direction: row !important; 
                    }

                    .resume-paper * {
                        visibility: visible;
                    }
                    
                    /* Ensure Sidebar and Main width are reset for grid */
                    .resume-paper > aside, .resume-paper > main {
                        width: auto !important;
                    }

                    /* --- COMPACT LAYOUT FOR PRINT --- */
                    
                    /* Reduce Main Content Padding */
                    main { 
                        padding: 20px 20px !important;
                        color: #000 !important; 
                    }
                    
                    /* Header Profile Image */
                    div[style*="width: 100px"], div[style*="width: 70px"], div[style*="width: 60px"] { 
                        width: 60px !important; height: 60px !important; /* Smaller photo */
                    }
                    
                    /* Header Text */
                    div[style*="marginBottom: 2.5rem"], div[style*="marginBottom: 1.5rem"], div[style*="marginBottom: 1.2rem"] { 
                        margin-bottom: 1rem !important; 
                    }

                    h1 { 
                        font-size: 1.4rem !important; 
                        margin-bottom: 0 !important; 
                    }

                    /* Reduce Section Spacing */
                    section { margin-bottom: 0.8rem !important; } 
                    .section-title { 
                        font-size: 0.9rem !important; 
                        margin-bottom: 0.3rem !important; 
                        padding-bottom: 0.2rem !important;
                        border-bottom-width: 1px !important;
                    }
                    
                    /* Compact Descriptions */
                    p, li, strong, span, div, a { 
                        font-size: 0.7rem !important; 
                        line-height: 1.25 !important; 
                    }
                    h4 { 
                        font-size: 0.8rem !important; 
                        margin-bottom: 1px !important; 
                    }
                    
                    /* Experience/Education Gap */
                    div[style*="gap: 2rem"], div[style*="gap: 1rem"], div[style*="gap: 0.6rem"], div[style*="gap: 0.5rem"], div[style*="gap: 0.8rem"] { 
                        gap: 0.4rem !important; 
                    }

                    /* Experience Items */
                    div[style*="pageBreakInside: avoid"] {
                        margin-bottom: 0.3rem !important;
                    }
                    
                    ul { padding-left: 1rem !important; margin-top: 1px !important; }

                    /* --- SIDEBAR COMPACT --- */
                    aside { 
                        padding: 20px 15px !important;
                        gap: 1rem !important; 
                        background-color: #0B2545 !important; 
                        color: #fff !important;
                    }
                    
                    aside h3.sidebar-title {
                        font-size: 0.8rem !important;
                        margin-bottom: 0.4rem !important;
                        padding-bottom: 0.2rem !important;
                    }

                    .skill-item { margin-bottom: 0.3rem !important; }

                    aside * { 
                        color: #fff !important; 
                        border-color: rgba(255,255,255,0.3) !important;
                    }
                    .section-title { border-color: #000 !important; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
