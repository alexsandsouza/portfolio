import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Trophy, Lock, Rocket, ChevronRight, Terminal } from 'lucide-react';

export default function HackersDoBemHub() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const missions = [
    {
      id: 1,
      title: 'Proteja a Rede da SeguraTech',
      module: 'Módulo 05 · Aula 01',
      description: 'Identifique contas e classifique as fases de onboarding e offboarding em um ambiente simulado.',
      path: '/hackersdobem/atividade',
      icon: <Shield size={24} color="#4ade80" />, 
      buttonText: 'Iniciar Missão',
      status: 'active',
      accentColor: '#4ade80',
      badges: ['20 min', '100 pts']
    },
    {
      id: 2,
      title: 'Ranking: SeguraTech',
      module: 'Resultados Ao Vivo',
      description: 'Acompanhe as maiores pontuações e o tempo de conclusão da turma.',
      path: '/hackersdobem/ranking',
      icon: <Trophy size={24} color="#facc15" />, 
      buttonText: 'Ver Ranking',
      status: 'active',
      accentColor: '#facc15',
    },
    {
      id: 3,
      title: 'Desafio Web Application',
      module: 'Módulo 06',
      description: 'Em breve: Uma nova simulação de vulnerabilidades web para você explorar e resolver.',
      path: '#',
      icon: <Lock size={24} color="#94a3b8" />,
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
        backgroundColor: 'rgba(22, 163, 74, 0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        backgroundColor: 'rgba(37, 99, 235, 0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
      }}></div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '16px', marginBottom: '1.5rem',
            border: '1px solid rgba(34, 197, 94, 0.2)', boxShadow: '0 0 30px rgba(34, 197, 94, 0.1)'
          }}>
            <Terminal size={32} color="#4ade80" />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '900', color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em'
          }}>
            Portal <span style={{
              background: 'linear-gradient(to right, #4ade80, #059669)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              position: 'relative'
            }}>Hackers do Bem</span>
          </h1>
          <p style={{
            fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'
          }}>
            Seja bem-vindo ao hub de atividades interativas. Complete as missões propostas em sala de aula, teste seus conhecimentos e dispute pelas melhores colocações no ranking oficial.
          </p>
        </div>

        {/* Missions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {missions.map((mission) => (
            <div key={mission.id} className="hub-card" style={{
              display: 'flex', flexDirection: 'column', padding: '2.5rem 2rem', borderRadius: '16px',
              backgroundColor: mission.status === 'active' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${mission.status === 'active' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              position: 'relative', overflow: 'hidden',
              filter: mission.status === 'locked' ? 'grayscale(0.5)' : 'none',
              opacity: mission.status === 'locked' ? 0.7 : 1
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{
                  padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)', display: 'inline-flex'
                }}>
                  {mission.icon}
                </div>
                {mission.badges && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {mission.badges.map(badge => (
                      <span key={badge} style={{
                        fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(0,0,0,0.5)', color: mission.accentColor, borderRadius: '6px',
                        border: `1px solid ${mission.accentColor}40`
                      }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {mission.module}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.75rem', lineHeight: '1.3' }}>
                  {mission.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {mission.description}
                </p>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {mission.status === 'active' ? (
                  <Link to={mission.path} className="hub-btn" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box',
                    padding: '0.875rem 1.25rem', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: '#fff', fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s',
                    '--hover-bg': mission.accentColor
                  }}>
                    <span>{mission.buttonText}</span>
                    <ChevronRight size={18} className="btn-icon" />
                  </Link>
                ) : (
                  <button disabled style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box',
                    padding: '0.875rem 1.25rem', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: '#64748b', fontWeight: '600', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'not-allowed'
                  }}>
                    <span>{mission.buttonText}</span>
                    <Lock size={16} opacity={0.5} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Decorative Card */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', borderRadius: '16px', border: '1px dashed rgba(148, 163, 184, 0.3)',
            backgroundColor: 'rgba(30, 41, 59, 0.2)', textAlign: 'center', minHeight: '300px'
          }}>
            <Rocket size={32} color="#64748b" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', maxWidth: '200px' }}>
              Mais desafios criptográficos e simulações de invasão serão adicionados nas próximas aulas...
            </p>
          </div>
        </div>
      </div>

      {/* Global styles since there's no Tailwind/styled-components set up specifically for it */}
      <style>{`
        body { margin: 0; }
        .hub-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .hub-btn {
          position: relative;
          overflow: hidden;
        }
        .hub-btn:hover {
          background-color: var(--hover-bg) !important;
          color: #000 !important;
          border-color: var(--hover-bg) !important;
          box-shadow: 0 0 15px var(--hover-bg);
        }
        .hub-btn .btn-icon {
          opacity: 0.7;
          transition: all 0.2s;
        }
        .hub-btn:hover .btn-icon {
          opacity: 1;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
