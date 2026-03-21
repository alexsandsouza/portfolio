import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, GraduationCap, Rocket, ChevronRight, Layout, FileText, Sparkles } from 'lucide-react';

export default function FametroHub() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const disciplines = [
    {
      id: 1,
      title: 'Orientação à Objetos - POO',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'Explore os pilares da POO através de desafios práticos e gamificados.',
      path: '/fametro/poo/atividade',
      rankingPath: '/fametro/poo/ranking',
      icon: <Layout size={26} color="#3b82f6" />, 
      buttonText: 'Acessar Missão Pilares',
      status: 'active',
      accentColor: '#3b82f6',
      badges: ['Conceitos', 'POO']
    },
    {
      id: 1.5,
      title: 'Prática Java: Classes e Atributos',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'Atividade de codificação direta: implemente classes, métodos e construtores em Java.',
      path: '/fametro/poo/java-atividade',
      icon: <Layout size={26} color="#00d4ff" />, 
      buttonText: 'Iniciar Lab Java',
      status: 'active',
      accentColor: '#00d4ff',
      badges: ['Labs', 'Java']
    },
    {
      id: 1.8,
      title: 'Lab: Classes, Getters, Setters & Construtor',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'Exercício prático progressivo: construa a classe Produto do zero, implementando atributos, getters, setters, construtor e toString() passo a passo.',
      path: '/fametro/poo/construtores',
      icon: <Layout size={26} color="#a855f7" />,
      buttonText: 'Iniciar Lab Construtor',
      status: 'active',
      accentColor: '#a855f7',
      badges: ['Labs', 'Construtor']
    },
    {
      id: 2,
      title: 'Análise de Requisitos',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'REQQUEST: Domine Análise de Requisitos, Modelagem Conceitual, Casos de Uso e Priorização MoSCoW neste quiz gamificado.',
      path: '/fametro/requisitos',
      rankingPath: '/fametro/requisitos/ranking',
      icon: <FileText size={26} color="#F59E0B" />,
      buttonText: 'Acessar REQQUEST',
      status: 'active',
      accentColor: '#F59E0B',
      badges: ['Quiz', 'Requisitos']
    },
    {
      id: 3,
      title: 'Sistemas Operacionais',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'SO Quest: Explore interrupções, gerenciamento de E/S, Kernel e modos de acesso nesta trilha interativa.',
      path: '/fametro/so',
      rankingPath: '/fametro/so/ranking',
      icon: <Rocket size={26} color="#0EA5E9" />,
      buttonText: 'Acessar SO Quest',
      status: 'active',
      accentColor: '#0EA5E9',
      badges: ['Quiz', 'SO']
    },
    {
      id: 3.5,
      title: 'SO Quest — Unidade I',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'Gamificação ativa: 15 questões situação-problema sobre Introdução aos SOs, Hierarquia de Memória, E/S, Barramento e Tradutor. Questões aleatórias a cada rodada!',
      path: '/fametro/so/unidade1',
      rankingPath: '/fametro/so-u1/ranking',
      icon: <Rocket size={26} color="#8b5cf6" />,
      buttonText: 'Iniciar Unidade I',
      status: 'active',
      accentColor: '#8b5cf6',
      badges: ['Gamificado', 'Unidade I']
    },
    {
      id: 3.6,
      title: 'SO Quest — Aula 05',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'Missão I/O: 15 etapas de pura tecnologia! Domine Drivers, DMA e Interrupções no estilo Hackers do Bem, com XP progressivo e ranking ao vivo.',
      path: '/fametro/so/aula5',
      rankingPath: '/fametro/so/aula5/ranking',
      icon: <Rocket size={26} color="#10B981" />,
      buttonText: 'Iniciar Missão I/O',
      status: 'active',
      accentColor: '#10B981',
      badges: ['Aula 05', 'I/O Control']
    },
    {
      id: 4,
      title: 'Estrutura de Dados',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'Matrix Quest & Lab: Desafios teóricos estilo ENADE e laboratório prático de codificação de matrizes.',
      path: '/fametro/aed/matrizes',
      rankingPath: '/fametro/aed/matrizes/ranking',
      labPath: '/fametro/aed/matrizes/lab',
      icon: <BookOpen size={26} color="#6366f1" />,
      buttonText: 'Acessar Matrix Quest',
      status: 'active',
      accentColor: '#6366f1',
      badges: ['ENADE', 'Prática', 'Matrizes']
    },
    {
      id: 5,
      title: 'Tecnologia Web I',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'SemanticQuest: Domine HTML5 Semântico, Estrutura de Documentos e Versionamento com Git neste desafio gamificado.',
      path: '/fametro/tecnologia-web/html-semantico',
      rankingPath: '/fametro/tecnologia-web/html-semantico/ranking',
      icon: <Layout size={26} color="#EC4899" />,
      buttonText: 'Acessar SemanticQuest',
      status: 'active',
      accentColor: '#EC4899',
      badges: ['HTML5', 'Semântica', 'Git']
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070B14', // Muito escuro para realçar os glows
      color: '#cbd5e1',
      padding: '8rem 1.5rem 6rem',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dynamic Animated Background */}
      <div className="fametro-bg-elements">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
        <div className="grid-overlay"></div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Modern Premium Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative' }}>
          
          <div className="header-icon-container">
            <div className="icon-glow"></div>
            <GraduationCap size={40} color="#60A5FA" style={{ position: 'relative', zIndex: 2 }} />
          </div>
          
          <h1 className="main-title">
            Hub de <span className="title-gradient">Disciplinas Fametro</span>
          </h1>
          
          <p style={{
            fontSize: '1.25rem', color: '#94A3B8', maxWidth: '750px', margin: '0 auto', lineHeight: '1.7',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Plataforma interativa de apoio às disciplinas presenciais. Acesse conteúdos, 
            realize atividades gamificadas e <span style={{color: '#fff', fontWeight: '500'}}>eleve seu nível técnico</span>.
          </p>
          
          <div style={{ 
            marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', backgroundColor: 'rgba(30, 41, 59, 0.5)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px',
            backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={16} color="#3b82f6" />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', letterSpacing: '0.05em' }}>
              MANAUS - AM · 2026.1 · PROF. ALEXSANDER FARIAS
            </span>
          </div>
        </div>

        {/* Premium Disciplines Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {disciplines.map((item) => (
            <div key={item.id} className="fametro-glass-card group" style={{
              '--card-accent': item.accentColor,
              filter: item.status === 'locked' ? 'grayscale(0.8)' : 'none',
              opacity: item.status === 'locked' ? 0.7 : 1
            }}>
              
              {/* Colorful Glow Background on Hover */}
              <div className="card-hover-glow"></div>

              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div className="card-icon-wrapper" style={{ boxShadow: `0 0 20px ${item.accentColor}33`, borderColor: `${item.accentColor}55` }}>
                  {item.icon}
                </div>
                {item.badges && (
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {item.badges.map(badge => (
                      <span key={badge} className="card-badge" style={{
                        color: item.accentColor, 
                        border: `1px solid ${item.accentColor}55`,
                        backgroundColor: `${item.accentColor}11`
                      }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.15em', 
                  color: item.accentColor, marginBottom: '0.8rem', textTransform: 'uppercase' 
                }}>
                  {item.course}
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', margin: '0 0 1rem', lineHeight: '1.25', letterSpacing: '-0.01em' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', paddingTop: '1.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
                {item.status === 'active' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link to={item.path} className="premium-btn primary">
                      <span>{item.buttonText}</span>
                      <ChevronRight size={20} className="btn-icon" />
                    </Link>
                    
                    {item.rankingPath && (
                      <Link to={item.rankingPath} className="premium-btn secondary" style={{ color: item.accentColor }}>
                        <Trophy size={16} />
                        Ver Ranking ao Vivo
                      </Link>
                    )}
                    
                    {item.labPath && (
                      <Link to={item.labPath} className="premium-btn secondary lab-btn">
                        <BookOpen size={16} />
                        Abrir Laboratório Prático
                      </Link>
                    )}
                  </div>
                ) : (
                  <button disabled className="premium-btn disabled">
                    <span>{item.buttonText}</span>
                    <Trophy size={20} opacity={0.5} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Decorative Empty Card */}
          <div className="fametro-glass-card empty-card">
            <div className="empty-icon-wrapper">
                <Rocket size={36} color="#64748b" />
            </div>
            <h4 style={{ color: '#e2e8f0', margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Novos Desafios</h4>
            <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '250px', lineHeight: '1.6' }}>
              Mais disciplinas e atividades práticas exclusivas serão desbloqueadas em breve.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* Background Animations */
        .fametro-bg-elements {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          z-index: 0; pointer-events: none; overflow: hidden;
        }
        
        .grid-overlay {
          position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
        }

        .bg-blob {
          position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.5;
          animation: floatBlob 20s infinite alternate ease-in-out;
        }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: rgba(59, 130, 246, 0.15); animation-delay: 0s; }
        .blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: rgba(147, 51, 234, 0.15); animation-delay: -5s; }
        .blob-3 { top: 40%; left: 40%; width: 40vw; height: 40vw; background: rgba(16, 185, 129, 0.1); animation-delay: -10s; }

        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.1); }
          100% { transform: translate(-5%, 10%) scale(0.9); }
        }

        /* Header Aesthetics */
        .header-icon-container {
          display: inline-flex; align-items: center; justify-content: center;
          width: 80px; height: 80px; border-radius: 24px;
          background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);
          margin-bottom: 2rem; position: relative;
        }
        .icon-glow {
          position: absolute; top: 50%; left: 50%; width: 100%; height: 100%;
          transform: translate(-50%, -50%); border-radius: 50%;
          background: rgba(59, 130, 246, 0.5); filter: blur(25px); z-index: 1;
        }

        .main-title {
          font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 900; color: #fff; 
          margin: 0 0 1.5rem; letter-spacing: -0.03em; line-height: 1.1;
        }
        .title-gradient {
          background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #EC4899 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 30px rgba(167, 139, 250, 0.2);
        }

        /* Premium Glassmorphism Cards */
        .fametro-glass-card {
          display: flex; flex-direction: column; padding: 2.5rem; border-radius: 28px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative; overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05);
        }

        .card-hover-glow {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at 50% -20%, var(--card-accent), transparent 70%);
          opacity: 0; transition: opacity 0.5s ease; pointer-events: none; mix-blend-mode: plus-lighter;
        }

        .fametro-glass-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.7), 0 0 40px -10px var(--card-accent);
        }
        .fametro-glass-card:hover .card-hover-glow { opacity: 0.15; }

        .card-icon-wrapper {
          padding: 1rem; border-radius: 16px; background: rgba(0, 0, 0, 0.4);
          border: 1px solid; border-color: inherit;
          display: inline-flex; transition: all 0.3s ease;
        }
        .fametro-glass-card:hover .card-icon-wrapper { transform: scale(1.1) rotate(5deg); }

        .card-badge {
          font-size: 0.75rem; font-weight: 700; font-family: 'Inter', sans-serif;
          padding: 0.3rem 0.8rem; border-radius: 20px; text-transform: uppercase;
        }

        /* Premium Buttons */
        .premium-btn {
          display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box;
          border-radius: 16px; text-decoration: none; font-weight: 700; transition: all 0.3s ease;
          position: relative; overflow: hidden;
        }
        
        .premium-btn.primary {
          padding: 1rem 1.5rem; font-size: 0.95rem; justify-content: space-between;
          background: var(--card-accent); color: #000; border: none;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .premium-btn.primary:hover {
          transform: translateY(-2px); filter: brightness(1.2);
          box-shadow: 0 8px 25px -5px var(--card-accent);
        }

        .premium-btn.secondary {
          padding: 0.8rem 1.2rem; font-size: 0.85rem; gap: 8px;
          background: transparent; border: 1px solid currentColor;
        }
        .premium-btn.secondary:hover { background: rgba(255,255,255,0.05); }

        .premium-btn.lab-btn { color: #cbd5e1; border-color: rgba(255,255,255,0.2); }
        .premium-btn.lab-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .premium-btn.disabled {
          padding: 1rem 1.5rem; justify-content: space-between; background: rgba(0, 0, 0, 0.4);
          color: #64748b; border: 1px solid rgba(255,255,255,0.05); cursor: not-allowed;
        }

        .btn-icon { transition: transform 0.3s ease; }
        .premium-btn.primary:hover .btn-icon { transform: translateX(5px); }

        /* Empty Card Styling */
        .empty-card {
          align-items: center; justify-content: center; text-align: center;
          border: 2px dashed rgba(148, 163, 184, 0.15); background: rgba(15, 23, 42, 0.3);
          box-shadow: none; min-height: 380px;
        }
        .empty-card:hover { transform: none; border-color: rgba(148, 163, 184, 0.3); box-shadow: none; }
        .empty-icon-wrapper {
          width: 80px; height: 80px; border-radius: 50%; background: rgba(148, 163, 184, 0.05);
          display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;
        }

        /* Reponsive Adjustments */
        @media (max-width: 768px) {
          .fametro-glass-card { padding: 2rem; }
          .main-title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}

