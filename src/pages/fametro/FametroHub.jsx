import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, GraduationCap, Rocket, ChevronRight, Layout, FileText } from 'lucide-react';

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
      icon: <Layout size={24} color="#3b82f6" />, 
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
      icon: <Layout size={24} color="#00d4ff" />, 
      buttonText: 'Iniciar Lab Java',
      status: 'active',
      accentColor: '#00d4ff',
      badges: ['Labs', 'Java']
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
      icon: <FileText size={24} color="#C0392B" />,
      buttonText: 'Acessar REQQUEST',
      status: 'active',
      accentColor: '#C0392B',
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
      icon: <Rocket size={24} color="#0EA5E9" />,
      buttonText: 'Acessar SO Quest',
      status: 'active',
      accentColor: '#0EA5E9',
      badges: ['Quiz', 'SO']
    },
    {
      id: 4,
      title: 'Estrutura de Dados',
      course: 'Sistemas de Informação',
      institution: 'Centro Universitário FAMETRO',
      professor: 'Alexsander Farias',
      period: '2026.1',
      description: 'Em breve: Desafios de Filas, Pilhas, Árvores e Algoritmos de Ordenação.',
      path: '#',
      icon: <BookOpen size={24} color="#94a3b8" />,
      buttonText: 'Bloqueado',
      status: 'locked',
      accentColor: '#64748b',
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      padding: '8rem 1.5rem 4rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        backgroundColor: 'rgba(147, 51, 234, 0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
      }}></div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', marginBottom: '1.5rem',
            border: '1px solid rgba(59, 130, 246, 0.2)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)'
          }}>
            <GraduationCap size={32} color="#3b82f6" />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '900', color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em'
          }}>
            Hub de <span style={{
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              position: 'relative'
            }}>Disciplinas Fametro</span>
          </h1>
          <p style={{
            fontSize: '1.125rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6'
          }}>
            Plataforma interativa de apoio às disciplinas presenciais. Acesse conteúdos, realize atividades gamificadas e eleve seu nível técnico.
          </p>
          <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
            Manaus - AM · 2026.1 · Prof. Alexsander Farias
          </div>
        </div>

        {/* Categories / Filters (Optional) */}
        
        {/* Disciplines Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {disciplines.map((item) => (
            <div key={item.id} className="hub-card" style={{
              display: 'flex', flexDirection: 'column', padding: '2.5rem 2rem', borderRadius: '24px',
              backgroundColor: item.status === 'active' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${item.status === 'active' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative', overflow: 'hidden',
              filter: item.status === 'locked' ? 'grayscale(0.5)' : 'none',
              opacity: item.status === 'locked' ? 0.7 : 1
            }}>
              {/* Card Decoration */}
              {item.status === 'active' && (
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: '100px', height: '100px',
                    background: `radial-gradient(circle at top right, ${item.accentColor}22, transparent)`,
                    zIndex: 0
                }}></div>
              )}

              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)', display: 'inline-flex'
                }}>
                  {item.icon}
                </div>
                {item.badges && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {item.badges.map(badge => (
                      <span key={badge} style={{
                        fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace', padding: '0.25rem 0.6rem',
                        backgroundColor: 'rgba(0,0,0,0.5)', color: item.accentColor, borderRadius: '20px',
                        border: `1px solid ${item.accentColor}40`, letterSpacing: '0.05em'
                      }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {item.course}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: '0 0 0.75rem', lineHeight: '1.2' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: item.accentColor }}></div>
                        {item.professor}
                    </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
                {item.status === 'active' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to={item.path} className="hub-btn" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box',
                      padding: '1rem 1.5rem', borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      color: '#fff', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '--hover-bg': item.accentColor
                    }}>
                      <span>{item.buttonText}</span>
                      <ChevronRight size={20} className="btn-icon" />
                    </Link>
                    {item.rankingPath && (
                      <Link to={item.rankingPath} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        width: '100%', boxSizing: 'border-box',
                        padding: '0.625rem 1.25rem', borderRadius: '12px',
                        backgroundColor: `${item.accentColor}18`,
                        color: item.accentColor, fontWeight: '600', fontSize: '0.8rem', textDecoration: 'none',
                        border: `1px solid ${item.accentColor}40`, transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${item.accentColor}30`; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${item.accentColor}18`; }}
                      >
                        <Trophy size={14} />
                        Ver Ranking ao Vivo
                      </Link>
                    )}
                  </div>
                ) : (
                  <button disabled style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box',
                    padding: '1rem 1.5rem', borderRadius: '16px', backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: '#64748b', fontWeight: '700', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'not-allowed'
                  }}>
                    <span>{item.buttonText}</span>
                    <Trophy size={18} opacity={0.5} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Decorative Empty Card */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2.5rem', borderRadius: '24px', border: '2px dashed rgba(148, 163, 184, 0.2)',
            backgroundColor: 'rgba(30, 41, 59, 0.1)', textAlign: 'center', minHeight: '350px'
          }}>
            <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(148, 163, 184, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
            }}>
                <Rocket size={32} color="#64748b" />
            </div>
            <h4 style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Novos Desafios</h4>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', maxWidth: '250px', lineHeight: '1.5' }}>
              Mais disciplinas e atividades práticas serão adicionadas conforme o cronograma do semestre.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .hub-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
          border-color: rgba(59, 130, 246, 0.3) !important;
        }
        .hub-btn:hover {
          background-color: var(--hover-bg) !important;
          color: #fff !important;
          border-color: var(--hover-bg) !important;
          box-shadow: 0 0 20px ${'rgba(59, 130, 246, 0.4)'};
        }
        .hub-btn .btn-icon {
          opacity: 0.7;
          transition: all 0.3s;
        }
        .hub-btn:hover .btn-icon {
          opacity: 1;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
