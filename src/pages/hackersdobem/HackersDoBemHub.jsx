import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Trophy, Lock, Unlock, Search, Rocket, ChevronRight, Terminal, CheckCircle, Globe, Key, Database, Wifi, AlertTriangle } from 'lucide-react';
import { getProgress } from './HDBProgress';
import './HackersDoBem.css';

function MatrixRain() {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Katakana + hacker chars
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF@#$%<>[]{}|/\\^~;:?!';

    const fontSize = 14;
    let columns, drops, animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    };

    resize();

    const draw = () => {
      // Fading black overlay — controls trail length
      ctx.fillStyle = 'rgba(10, 10, 18, 0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fira Code", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright white-green "head" character
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00FF88';
        ctx.fillStyle = '#CCFFE8';
        ctx.fillText(char, x, y);

        // Body trail — slightly dimmer (drawn on previous frames via fade)
        ctx.shadowBlur = 0;

        // Reset drop randomly after it passes bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.55,
      }}
    />
  );
}

export default function HackersDoBemHub() {
  const [progress, setProgress] = useState(getProgress());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    setProgress(getProgress());
    
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const missions = [
    {
      id: 'HDB_M01',
      title: 'Princípios de Segurança',
      module: 'Módulo 01 · Aulas 01 a 04',
      description: 'Fundamentos de Segurança da Informação, Tríade CID, Matriz de Riscos e NIST Framework.',
      path: '/hackersdobem/atividade-m01',
      rankingPath: '/hackersdobem/ranking-m01',
      icon: <Shield size={24} color="#00ff88" />,
      buttonText: 'Iniciar Recrutamento',
      status: 'active',
      accentColor: '#00ff88',
      badges: ['25 min', '150 pts']
    },
    {
      id: 'HDB_M02',
      title: 'Ameaças e Malwares',
      module: 'Módulo 02 · Aulas 01 a 04',
      description: 'Vírus, Worms, Trojans, Ransomware, Spyware e análise de vetores de infecção.',
      path: '/hackersdobem/atividade-m02',
      rankingPath: '/hackersdobem/ranking-m02',
      icon: <AlertTriangle size={24} color="#f43f5e" />,
      buttonText: 'Scannear Ameaças',
      status: 'active',
      accentColor: '#f43f5e',
      badges: ['25 min', '200 pts']
    },
    {
      id: 'HDB_M03',
      title: 'Identificação de Ameaças',
      module: 'Módulo 03 · Aulas 01 a 04',
      description: 'Scanners de vulnerabilidade, CVE, CVSS, varreduras intrusivas e análise de logs.',
      path: '/hackersdobem/atividade-m03',
      rankingPath: '/hackersdobem/ranking-m03',
      icon: <Search size={24} color="#3b82f6" />,
      buttonText: 'Detectar Alvos',
      status: 'active',
      accentColor: '#3b82f6',
      badges: ['25 min', '200 pts']
    },
    {
      id: 'HDB_M04',
      title: 'Controles de Acesso',
      module: 'Módulo 04 · Aulas 01 a 04',
      description: 'IAM, Autenticação Multifator (MFA), SSO, Biometria e protocolos de segurança.',
      path: '/hackersdobem/atividade-m04',
      rankingPath: '/hackersdobem/ranking-m04',
      icon: <Unlock size={24} color="#eab308" />,
      buttonText: 'Validar Acessos',
      status: 'active',
      accentColor: '#eab308',
      badges: ['30 min', '250 pts']
    },
    {
      id: 'HDB_M05',
      title: 'Gerenciamento de Identidades',
      module: 'Módulo 05 · Aulas 01 a 04',
      description: 'IAM, Onboarding/Offboarding, RBAC, MAC, DAC, OAuth, SAML e Políticas de Pessoal.',
      path: '/hackersdobem/atividade-m05',
      rankingPath: '/hackersdobem/ranking-m05',
      icon: <Key size={24} color="#a855f7" />,
      buttonText: 'Gerenciar Identidades',
      status: 'active',
      accentColor: '#a855f7',
      badges: ['30 min', '250 pts']
    },
    {
      id: 'HDB_M06',
      title: 'Proteção Web',
      module: 'Módulo 06 · Aulas 01 a 04',
      description: 'Ataques de Injeção (SQL, XML, LDAP), XSS, CSRF, Clickjacking e segurança em APIs.',
      path: '/hackersdobem/atividade-m06',
      rankingPath: '/hackersdobem/ranking-m06',
      icon: <Globe size={24} color="#f43f5e" />,
      buttonText: 'Blindar Aplicação',
      status: 'active',
      accentColor: '#f43f5e',
      badges: ['30 min', '300 pts']
    },
    {
      id: 'HDB_M07',
      title: 'Redundância & Backup',
      module: 'Módulo 07 · Aulas 01 a 04',
      description: 'Arquiteturas de RAID, tipos de Backup, failover, RTO/RPO e Segurança Física.',
      path: '/hackersdobem/atividade-m07',
      rankingPath: '/hackersdobem/ranking-m07',
      icon: <Database size={24} color="#00ff88" />,
      buttonText: 'Garantir Continuidade',
      status: 'active',
      accentColor: '#00ff88',
      badges: ['30 min', '250 pts']
    },
    {
      id: 'HDB_M08',
      title: 'Criptografia',
      module: 'Módulo 08 · Aulas 01 a 04',
      description: 'Confusão e difusão, cifras de bloco e fluxo, esteganografia, AES, DES e PKI.',
      path: '/hackersdobem/atividade-m08',
      rankingPath: '/hackersdobem/ranking-m08',
      icon: <Lock size={24} color="#facc15" />,
      buttonText: 'Analisar Código',
      status: 'active',
      accentColor: '#facc15',
      badges: ['30 min', '300 pts']
    },
    {
      id: 'HDB_M09',
      title: 'Chaves Públicas e Blockchain',
      module: 'Módulo 09 · Aulas 01 a 04',
      description: 'Infraestrutura de Chaves Públicas (PKI), Autoridades Certificadoras, SSL/TLS e Blockchain.',
      path: '/hackersdobem/atividade-m09',
      rankingPath: '/hackersdobem/ranking-m09',
      icon: <CheckCircle size={24} color="#3b82f6" />,
      buttonText: 'Validar Identidade',
      status: 'active',
      accentColor: '#3b82f6',
      badges: ['30 min', '300 pts']
    },
    {
      id: 'HDB_M10',
      title: 'Segurança no Host',
      module: 'Módulo 10 · Aulas 01 a 04',
      description: 'Blindagem de sistemas, AV vs EDR, Hardening e Gerenciamento de Patches para Endpoints.',
      path: '/hackersdobem/atividade-m10',
      rankingPath: '/hackersdobem/ranking-m10',
      icon: <Shield size={24} color="#00FF88" />,
      buttonText: 'Iniciar Defesa',
      status: 'active',
      accentColor: '#00FF88',
      badges: ['30 min', '300 pts']
    },
    {
      id: 'HDB_M11',
      title: 'Segurança em Redes',
      module: 'Módulo 11 · Aulas 01 a 04',
      description: 'Zonas Desmilitarizadas, IDS/IPS, Network TAP, UEBA e Segurança em Encaminhamento.',
      path: '/hackersdobem/atividade-m11',
      rankingPath: '/hackersdobem/ranking-m11',
      icon: <Wifi size={24} color="#00e5ff" />,
      buttonText: 'Inspecionar Tráfego',
      status: 'active',
      accentColor: '#00e5ff',
      badges: ['30 min', '300 pts']
    },
    {
      id: 'HDB_M12',
      title: 'Resposta a Incidentes',
      module: 'Módulo 12 · Aulas 01 a 04',
      description: 'Cyber Kill Chain, MITRE ATT&CK, CSIRT, Security Protocols e Gestão de Logs/SIEM.',
      path: '/hackersdobem/atividade-m12',
      rankingPath: '/hackersdobem/ranking-m12',
      icon: <Terminal size={24} color="#f59e0b" />,
      buttonText: 'Mitigar Incidentes',
      status: 'active',
      accentColor: '#f59e0b',
      badges: ['30 min', '300 pts']
    }
  ];

  return (
    <div className="hdb-scanlines" style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A12',
      color: '#cbd5e1',
      padding: '8rem 1.5rem 4rem',
      fontFamily: 'var(--hdb-main-font)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <MatrixRain />
      <div className="hdb-perspective-grid" />
      <div className="hdb-aura-follow" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Background Effects */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        backgroundColor: 'rgba(0, 255, 136, 0.05)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        backgroundColor: 'rgba(37, 99, 235, 0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
      }}></div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            Portal <span className="hdb-glow-green" style={{
              background: 'linear-gradient(to right, #4ade80, #059669)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              position: 'relative'
            }}>Hackers do Bem</span>
          </h1>
          <p style={{
            fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6'
          }}>
            Seja bem-vindo ao hub de atividades interativas. Complete as missões propostas em sala de aula, teste seus conhecimentos e dispute pelas melhores colocações no ranking oficial.
          </p>

          {/* Share URL Banner */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0', maxWidth: '100%',
            background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 20px rgba(74, 222, 128, 0.08)'
          }}>
            <div style={{
              padding: '10px 16px', fontSize: '0.75rem', letterSpacing: '0.08em',
              color: '#4ade80', fontFamily: 'monospace', fontWeight: '700',
              borderRight: '1px solid rgba(74, 222, 128, 0.2)', whiteSpace: 'nowrap',
              background: 'rgba(74, 222, 128, 0.06)'
            }}>🔗 LINK DA TURMA</div>
            <div style={{
              padding: '10px 16px', fontSize: '0.8rem', color: '#94a3b8',
              fontFamily: 'monospace', letterSpacing: '0.02em', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px'
            }}>alexsanderfarias\.vercel\.app/hackersdobem</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://alexsanderfarias\.vercel\.app/hackersdobem');
                const btn = document.getElementById('copy-btn-hub');
                if (btn) { btn.textContent = '✓ Copiado!'; btn.style.color = '#4ade80'; setTimeout(() => { btn.textContent = 'Copiar'; btn.style.color = '#94a3b8'; }, 2000); }
              }}
              id="copy-btn-hub"
              style={{
                padding: '10px 16px', fontSize: '0.75rem', fontWeight: '700',
                background: 'rgba(74, 222, 128, 0.1)', border: 'none', borderLeft: '1px solid rgba(74, 222, 128, 0.2)',
                color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                fontFamily: 'system-ui, sans-serif'
              }}
            >Copiar</button>
          </div>
        </div>

        {/* Missions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {missions.map((mission) => {
            const isCompleted = progress.modules[mission.id];
            return (
            <div key={mission.id} className="hdb-card" style={{
              display: 'flex', flexDirection: 'column', padding: '2.5rem 2rem', borderRadius: '16px',
              backgroundColor: isCompleted ? 'rgba(0, 255, 136, 0.03)' : 'rgba(30, 41, 59, 0.7)',
              border: `1px solid ${isCompleted ? '#00FF8844' : 'rgba(255, 255, 255, 0.1)'}`,
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
                  border: `1px solid ${isCompleted ? '#00FF8888' : 'rgba(255, 255, 255, 0.05)'}`, display: 'inline-flex',
                  boxShadow: isCompleted ? '0 0 15px rgba(0, 255, 136, 0.2)' : 'none'
                }}>
                  {isCompleted ? <CheckCircle size={24} color="#00FF88" /> : mission.icon}
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
                <h3 className="hdb-glow-blue" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.75rem', lineHeight: '1.3' }}>
                  {mission.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {mission.description}
                </p>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {mission.status === 'active' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Link to={mission.path} className="hdb-btn-neon" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box',
                        padding: '0.875rem 1.25rem', borderRadius: '12px', backgroundColor: isCompleted ? '#00FF88' : 'rgba(15, 23, 42, 0.8)',
                        color: isCompleted ? '#000' : '#fff', fontWeight: '800', fontSize: '0.875rem', textDecoration: 'none',
                        border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s',
                        '--hover-bg': mission.accentColor
                      }}>
                        <span>{isCompleted ? 'Refazer Missão' : mission.buttonText}</span>
                        <ChevronRight size={18} className="btn-icon" />
                      </Link>
                    {mission.rankingPath && (
                      <Link to={mission.rankingPath} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        width: '100%', boxSizing: 'border-box',
                        padding: '0.625rem 1.25rem', borderRadius: '10px',
                        backgroundColor: `${mission.accentColor}18`,
                        color: mission.accentColor, fontWeight: '600', fontSize: '0.8rem', textDecoration: 'none',
                        border: `1px solid ${mission.accentColor}40`, transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${mission.accentColor}30`; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${mission.accentColor}18`; }}
                      >
                        <Trophy size={14} />
                        Ver Ranking ao Vivo
                      </Link>
                    )}
                  </div>
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
            );
          })}

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
