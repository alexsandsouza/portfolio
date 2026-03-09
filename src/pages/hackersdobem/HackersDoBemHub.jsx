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
      icon: <Shield size={24} className="text-green-400" />,
      buttonText: 'Iniciar Missão',
      status: 'active',
      color: 'from-green-500/10 to-emerald-900/30',
      border: 'border-green-500/20',
      badges: ['20 min', '100 pts']
    },
    {
      id: 2,
      title: 'Ranking: SeguraTech',
      module: 'Resultados Ao Vivo',
      description: 'Acompanhe as maiores pontuações e o tempo de conclusão da turma.',
      path: '/hackersdobem/ranking',
      icon: <Trophy size={24} className="text-yellow-400" />,
      buttonText: 'Ver Ranking',
      status: 'active',
      color: 'from-yellow-500/10 to-orange-900/20',
      border: 'border-yellow-500/20'
    },
    {
      id: 3,
      title: 'Desafio Web Application',
      module: 'Módulo 06',
      description: 'Em breve: Uma nova simulação de vulnerabilidades web para você explorar e resolver.',
      path: '#',
      icon: <Lock size={24} className="text-gray-500" />,
      buttonText: 'Bloqueado',
      status: 'locked',
      color: 'from-gray-800/30 to-gray-900/30',
      border: 'border-gray-700/50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-300 pt-24 pb-16 px-4 md:px-8 font-sans selection:bg-green-500/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 pt-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-green-500/5 rounded-2xl mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <Terminal size={32} className="text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 relative after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-2 after:bg-green-500/20 after:-z-10">Hackers do Bem</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mt-6">
            Seja bem-vindo ao hub de atividades interativas. Complete as missões propostas em sala de aula, teste seus conhecimentos e dispute pelas melhores colocações no ranking oficial.
          </p>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((mission) => (
            <div 
              key={mission.id}
              className={`group flex flex-col relative overflow-hidden rounded-2xl border bg-gradient-to-br ${mission.color} ${mission.border} p-6 sm:p-8 transition-all duration-300 ${mission.status === 'active' ? 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/5 z-10 bg-slate-900/80 backdrop-blur-sm' : 'opacity-80 grayscale-[30%] bg-slate-900/40 backdrop-blur-sm'}`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6 w-full">
                <div className="p-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 shadow-inner inline-flex items-center justify-center">
                  {mission.icon}
                </div>
                {mission.badges && (
                  <div className="flex gap-2">
                    {mission.badges.map(badge => (
                      <span key={badge} className="text-[10px] sm:text-xs font-bold font-mono tracking-wider px-2 py-1 bg-black/40 text-green-300 rounded-md border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="flex-1 w-full">
                <div className="text-[11px] font-mono tracking-widest text-slate-400 mb-2 uppercase">{mission.module}</div>
                <h3 className="text-xl font-bold text-white mb-3 leading-tight">{mission.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                  {mission.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/5 w-full">
                {mission.status === 'active' ? (
                  <Link 
                    to={mission.path}
                    className="group/btn flex items-center justify-between w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl bg-slate-800/80 text-white font-semibold text-sm transition-all duration-300 hover:bg-green-500 hover:text-black border border-slate-700/50 hover:border-green-400 shadow-sm"
                  >
                    <span>{mission.buttonText}</span>
                    <ChevronRight size={18} className="opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="flex justify-between w-full py-3.5 px-5 rounded-xl bg-slate-900/50 text-slate-500 font-semibold text-sm cursor-not-allowed border border-slate-800/50"
                  >
                    <span>{mission.buttonText}</span>
                    <Lock size={16} className="opacity-50" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Decorative Card */}
          <div className="hidden md:flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/50 bg-slate-800/20 p-8 text-center h-full min-h-[300px]">
            <Rocket size={32} className="text-slate-600 mb-4" />
            <div className="text-sm font-medium text-slate-500 max-w-[200px]">Mais desafios criptográficos e simulações de invasão serão adicionados nas próximas aulas...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
