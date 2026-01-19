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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '70px', height: '70px', flexShrink: 0,
                            borderRadius: '50%', overflow: 'hidden',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            <img src="/Foto_Perfil_Round.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#000', lineHeight: 1, marginBottom: '0.1rem', textTransform: 'uppercase' }}>
                                Alexsand Farias de Souza
                            </h1>
                            <h2 style={{ fontSize: '0.75rem', color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Prof. Universitário | Dev Full Stack | Avaliador TCC & Projetos
                            </h2>
                        </div>
                    </div>

                    {/* Resumo Profissional (Encurtado) */}
                    <section style={{ marginBottom: '1rem' }}>
                        <h3 className="section-title">Resumo Profissional</h3>
                        <p style={{ fontSize: '0.75rem', lineHeight: 1.3, textAlign: 'justify', color: '#444' }}>
                            Professor Universitário e Desenvolvedor Full Stack com sólida experiência em formação de talentos em TI (Engenharia de Software, Redes, Cibersegurança). Atuo como Avaliador de Projetos/TCC e consultor técnico, conectando teoria acadêmica à prática de mercado com foco em inovação e transformação digital. Fundador da AD Academy.
                        </p>
                    </section>

                    {/* Experiência Profissional */}
                    <section style={{ marginBottom: '1rem' }}>
                        <h3 className="section-title">Experiência Profissional</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {latestExperience.map((exp, idx) => (
                                <div key={idx} style={{ pageBreakInside: 'avoid', marginBottom: '0.4rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#000', marginBottom: '1px' }}>
                                        {exp.role}, {exp.institution}
                                    </h4>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                        {exp.period}
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1rem', marginTop: '2px', fontSize: '0.75rem', color: '#444', lineHeight: 1.3 }}>
                                        <li style={{ marginBottom: '1px' }}>{exp.description}</li>
                                        {exp.results && <li>{exp.results}</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Formação */}
                    <section>
                        <h3 className="section-title">Formação</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {education.slice(0, 4).map((edu, idx) => ( // Showing top 4 education
                                <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#000' }}>
                                        {edu.course}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#444' }}>
                                        {edu.institution}, <span style={{ fontSize: '0.7rem', color: '#666' }}>{edu.level}</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>
                                        {edu.period}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>


                {/* === RIGHT COLUMN (SIDEBAR) === */}
                <aside style={{ background: '#0B2545', color: '#fff', padding: '20px 15px', display: 'flex', flexDirection: 'column', gap: '1.2rem', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>

                    {/* Dados Pessoais */}
                    <section>
                        <h3 className="sidebar-title">Dados Pessoais</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.75rem' }}>
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
                                <a href="https://www.linkedin.com/in/alexsandfarias/" target="_blank" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><Linkedin size={14} /> /in/alexsandfarias</a>
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
                    h2 { font-size: 1rem !important; }
                    
                    /* Hide floating buttons partially if needed or adjust position */
                    .no-print {
                        width: 100%;
                        justify-content: center;
                        bottom: 1rem;
                        right: 0;
                    }
                }

                /* === PRINT STYLES (Force A4 Desktop Layout even on Mobile) === */
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
                        padding: 20px 20px !important; /* Aggressive padding reduction */
                        color: #000 !important; 
                        visibility: visible !important;
                    }
                    
                    /* Header Profile Image */
                    div[style*="width: 100px"] { /* Target wrapper */
                        width: 70px !important;
                        height: 70px !important;
                    }
                    .resume-paper img {
                        width: 100% !important;
                        height: 100% !important;
                    }
                    
                    /* Header Text */
                    div[style*="marginBottom: 2.5rem"] { margin-bottom: 1.5rem !important; } /* Header margin */

                    h1 { 
                        font-size: 1.6rem !important; 
                        margin-bottom: 0.1rem !important; 
                        line-height: 1 !important;
                    }
                    h2 { font-size: 0.75rem !important; margin-bottom: 0 !important; }

                    /* Reduce Section Spacing */
                    section { margin-bottom: 1rem !important; } 
                    .section-title { 
                        font-size: 0.95rem !important; 
                        margin-bottom: 0.4rem !important; 
                        padding-bottom: 0.2rem !important;
                        border-bottom-width: 1px !important;
                    }
                    
                    /* Compact Descriptions */
                    p, li { 
                        font-size: 0.75rem !important; 
                        line-height: 1.3 !important; 
                    }
                    h4 { 
                        font-size: 0.85rem !important; 
                        margin-bottom: 1px !important; 
                    }
                    
                    /* Experience/Education Gap */
                    div[style*="gap: 2rem"] { gap: 0.6rem !important; } /* Major reduction */
                    div[style*="gap: 1rem"] { gap: 0.4rem !important; }

                    /* Experience Items */
                    div[style*="pageBreakInside: avoid"] {
                        margin-bottom: 0.4rem !important;
                    }
                    
                    ul { 
                        padding-left: 1rem !important; 
                        margin-top: 2px !important;
                    }
                    li { margin-bottom: 1px !important; }

                    /* --- SIDEBAR COMPACT --- */
                    aside { 
                        padding: 20px 15px !important;
                        gap: 1.2rem !important; 
                        background-color: #0B2545 !important; 
                        color: #fff !important;
                        height: 100% !important;
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact;
                    }
                    
                    aside h3.sidebar-title {
                        font-size: 0.85rem !important;
                        margin-bottom: 0.5rem !important;
                        padding-bottom: 0.2rem !important;
                    }

                    aside strong, aside span, aside div, aside a, aside li {
                        font-size: 0.7rem !important;
                    }
                    
                    .skill-item { margin-bottom: 0.4rem !important; }

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
