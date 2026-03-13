import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1, stage: "OBJ.347 — Nível 1", type: "Conceito Fundamental",
    context: "Você está usando seu computador quando ouve o som de notificação de um e-mail chegando. Por baixo dos panos, o sistema operacional acabou de tratar um evento importante.",
    q: "O que é uma INTERRUPÇÃO no contexto de Sistemas Operacionais?",
    opts: [
      "Um erro fatal que trava o sistema e exige reinicialização",
      "Um sinal assíncrono enviado ao processador solicitando atenção imediata, que suspende temporariamente o programa em execução",
      "Um comando do usuário para pausar um processo em execução",
      "Uma falha na memória RAM que corrompe dados do programa"
    ],
    ans: 1,
    feedback: "✅ Correto! A interrupção é o mecanismo fundamental que permite ao SO reagir a eventos externos (hardware, timer, software) sem que o programa em execução precise verificar continuamente. A CPU salva o contexto, executa a ISR e restaura o programa original.",
    xp: 100
  },
  {
    id: 2, stage: "OBJ.347 — Nível 2", type: "Tipos de Interrupção",
    context: "Em um servidor Linux, um processo Java está rodando quando o disco SSD conclui uma operação de leitura de arquivo. Ao mesmo tempo, o timer do escalonador chega a zero.",
    q: "Qual é a diferença fundamental entre uma interrupção de HARDWARE e uma interrupção de SOFTWARE (trap)?",
    opts: [
      "Interrupções de hardware são mais rápidas; de software são mais lentas",
      "Hardware: gerada por dispositivos externos, assíncrona. Software: gerada por instrução do programa (ex: SYSCALL/INT), síncrona e intencional",
      "Não há diferença — ambas funcionam exatamente da mesma forma",
      "Hardware ocorre em modo núcleo; software ocorre em modo usuário"
    ],
    ans: 1,
    feedback: "✅ Exato! Interrupções de hardware são assíncronas — podem ocorrer a qualquer momento, independente do que o programa está fazendo. Traps (interrupções de software) são síncronas — são causadas por instruções específicas do programa, como ao fazer uma system call.",
    xp: 120
  },
  {
    id: 3, stage: "OBJ.347 — Nível 3", type: "Exceções",
    context: "Um programador iniciante escreveu: int resultado = 100 / 0; O programa foi compilado com sucesso, mas ao executar trava instantaneamente com mensagem de erro.",
    q: "O que acontece INTERNAMENTE no SO quando ocorre divisão por zero?",
    opts: [
      "O SO ignora o erro e continua a execução com resultado = 0",
      "A CPU gera uma exceção do tipo FAULT, o SO captura via handler, registra o erro e encerra o processo com sinal (SIGFPE no Linux)",
      "O compilador deveria ter impedido — é um erro de compilação, não de execução",
      "O hardware da CPU simplesmente reinicia automaticamente o sistema"
    ],
    ans: 1,
    feedback: "✅ Perfeito! Divisão por zero é uma exceção síncrona do tipo Fault gerada pela CPU. No Linux, o handler do kernel envia o sinal SIGFPE (Floating Point Exception) ao processo. Se não tratado, o processo é encerrado. O sistema operacional continua funcionando normalmente.",
    xp: 130
  },
  {
    id: 4, stage: "OBJ.347 — Nível 4", type: "Técnicas de E/S",
    context: "Engenheiro deve escolher a técnica de E/S para um sistema de sensor IoT que lê temperatura a cada 100ms. Opção A: CPU verifica o sensor constantemente. Opção B: sensor avisa a CPU quando dado está pronto.",
    q: "Qual técnica de E/S a Opção B descreve, e por que ela é SUPERIOR à Opção A neste cenário?",
    opts: [
      "Opção B é E/S Programada (Polling) — a CPU precisa esperar ativamente",
      "Opção B é E/S por DMA — sempre a melhor escolha em qualquer situação",
      "Opção B é E/S Orientada a Interrupções — superior porque a CPU fica livre para outras tarefas durante os 100ms de espera, aumentando a eficiência",
      "Opção B é E/S por Buffer — armazena dados temporariamente na memória"
    ],
    ans: 2,
    feedback: "✅ Correto! E/S por Interrupção libera a CPU durante o período de espera (100ms a cada ciclo). Com Polling, a CPU desperdiçaria processamento verificando continuamente. O sensor gera uma interrupção quando dado está pronto, e a CPU só é envolvida então.",
    xp: 140
  },
  {
    id: 5, stage: "OBJ.347 — Nível 5", type: "DMA",
    context: "Um servidor precisa copiar 100MB de dados do SSD NVMe para a memória RAM. Com DMA disponível, o processador é envolvido apenas para iniciar a transferência e receber a conclusão.",
    q: "O que torna o DMA (Direct Memory Access) superior à E/S por Interrupção para grandes transferências de dados?",
    opts: [
      "DMA é mais seguro porque usa criptografia automática dos dados",
      "No DMA, o controlador transfere os dados DIRETAMENTE entre memória e dispositivo sem envolver a CPU a cada byte/bloco — a CPU só é notificada ao FINAL de toda a transferência",
      "DMA é mais lento mas consome menos energia elétrica",
      "No DMA, a CPU verifica cada bloco transferido para garantir integridade"
    ],
    ans: 1,
    feedback: "✅ Excelente! Com DMA, a CPU configura a transferência (endereço origem, destino, tamanho) e fica totalmente livre. O controlador DMA gerencia toda a transferência autonomamente, gerando apenas UMA interrupção no final. Para 100MB, isso significa milhões de operações sem envolver a CPU.",
    xp: 150
  },
  {
    id: 6, stage: "OBJ.347 — Nível 6", type: "Buffering vs Spooling",
    context: "Cenário A: placa de som recebendo áudio do microfone. Cenário B: 15 funcionários enviando documentos para a impressora compartilhada do escritório.",
    q: "Qual técnica é mais adequada para CADA cenário e por quê?",
    opts: [
      "Ambos usam Spooling — é sempre a melhor técnica para qualquer dispositivo",
      "Cenário A: Buffering (absorve diferença de velocidade CPU/hardware). Cenário B: Spooling (serializa acesso de múltiplos processos a dispositivo compartilhado)",
      "Cenário A: Polling. Cenário B: DMA",
      "Ambos usam Buffering — Spooling não existe em sistemas modernos"
    ],
    ans: 1,
    feedback: "✅ Perfeito! Buffering resolve o problema de velocidades diferentes — a placa de som gera dados mais lentamente que a CPU os consome. Spooling resolve o compartilhamento — múltiplos processos não podem usar a impressora ao mesmo tempo, então cada um entrega para a fila e continua trabalhando.",
    xp: 160
  },
  {
    id: 7, stage: "OBJ.347 — Nível 7", type: "Reentrância",
    context: "Um servidor Linux tem 50 processos abertos simultaneamente usando a função printf() para escrever logs. Apenas uma cópia do código de printf() existe na memória.",
    q: "Por que isso funciona sem que os logs de um processo misturem com os de outro?",
    opts: [
      "O Linux copia o código de printf() para cada processo, mas otimiza com copy-on-write",
      "printf() é uma função REENTRANTE: usa apenas variáveis locais na pilha de cada processo — cada chamada tem seu próprio conjunto de variáveis, completamente isolado",
      "Os processos usam printf() em sequência, nunca ao mesmo tempo",
      "O SO usa mutex global que impede qualquer execução simultânea de printf()"
    ],
    ans: 1,
    feedback: "✅ Exato! Código reentrante não usa variáveis globais ou estáticas modificáveis. Cada chamada usa a sua própria pilha com variáveis locais. 50 processos chamando printf() simultaneamente é completamente seguro porque cada um tem seu próprio espaço de variáveis na pilha.",
    xp: 170
  },
  {
    id: 8, stage: "OBJ.348 — Nível 8", type: "Funções do Kernel",
    context: "Você abre o Spotify no Windows. Ao iniciar, o aplicativo cria threads, aloca memória, abre arquivos de cache e estabelece conexão de rede.",
    q: "Qual componente do sistema é responsável por TODAS essas operações e por quê?",
    opts: [
      "O compilador do Spotify — é parte do código do aplicativo",
      "A BIOS/UEFI — gerencia diretamente o hardware",
      "O Kernel (Núcleo) do SO — é o único componente com privilégios para criar processos, alocar memória, acessar sistema de arquivos e controlar rede",
      "O driver da placa de rede — gerencia todas as conexões de todos os programas"
    ],
    ans: 2,
    feedback: "✅ Correto! O Kernel é o árbitro central que media TODOS os acessos ao hardware. Nenhum aplicativo pode diretamente criar threads, alocar memória real, abrir arquivos ou usar a rede — tudo passa pelo kernel via system calls. Isso garante proteção e isolamento entre processos.",
    xp: 180
  },
  {
    id: 9, stage: "OBJ.348 — Nível 9", type: "Modo de Acesso",
    context: "Em 2018, a vulnerabilidade Meltdown permitia que código em modo usuário lesse dados da memória do kernel — violando a barreira de proteção entre os modos de acesso.",
    q: "Por que a separação entre Modo Usuário e Modo Núcleo é CRÍTICA para a segurança dos sistemas operacionais?",
    opts: [
      "É apenas uma convenção de programação — qualquer programa poderia acessar hardware diretamente se quisesse",
      "Sem essa separação, qualquer processo poderia ler a memória de outros processos, modificar o kernel, acessar hardware livremente — sem isolamento ou proteção nenhuma",
      "Modo Usuário e Modo Núcleo são conceitos apenas de sistemas Unix — Windows não usa isso",
      "A separação existe apenas para melhorar a performance, não para segurança"
    ],
    ans: 1,
    feedback: "✅ Excelente análise! Sem a separação de modos, seria impossível garantir: (1) que um processo não leia dados de outro, (2) que um aplicativo malicioso não controle o hardware, (3) que um bug em um programa não trave o SO inteiro. A separação é implementada no HARDWARE (anéis de proteção), não apenas em software.",
    xp: 200
  },
  {
    id: 10, stage: "OBJ.348 — Nível 10", type: "System Calls",
    context: "Um desenvolvedor escreveu em C: FILE *f = fopen('dados.csv', 'r'); Para executar essa linha, a aplicação precisa interagir com o kernel do SO.",
    q: "O que acontece INTERNAMENTE quando fopen() é chamada — do modo usuário até o hardware?",
    opts: [
      "fopen() lê o arquivo diretamente do disco sem envolver o SO, para ser mais rápida",
      "fopen() chama a system call open() via SYSCALL/INT, CPU muda para modo núcleo, kernel valida permissões, acessa VFS, aciona driver, lê do disco, retorna o descritor — tudo em microssegundos",
      "fopen() é tratada exclusivamente pelo compilador C — não há interação com o SO",
      "fopen() solicita ao BIOS que leia o arquivo, sem envolver o kernel"
    ],
    ans: 1,
    feedback: "✅ Perfeito! fopen() → libc wrapper → configura registradores → SYSCALL → modo núcleo → sys_open() → VFS → driver do FS → driver do dispositivo → hardware. Todo esse caminho acontece em microssegundos, completamente transparente para o desenvolvedor. A transição de modo garante que a operação ocorra com as permissões corretas.",
    xp: 200
  },
  {
    id: 11, stage: "⚔️ BOSS FINAL — OBJ.347+348", type: "Desafio Integrador",
    context: "🚀 ÚLTIMO DESAFIO! Um engenheiro de software deve implementar um sistema de monitoramento em tempo real para uma UTI hospitalar. O sistema precisa: (1) receber dados dos monitores cardíacos via USB, (2) processar e exibir em telas, (3) gravar em banco de dados, (4) alertar médicos via rede se houver anomalia. O sistema roda em Linux embarcado.",
    q: "Qual das arquiteturas abaixo representa a implementação MAIS CORRETA e SEGURA para esse sistema crítico?",
    opts: [
      "Polling para todos os dispositivos USB (simples e confiável), sem uso de buffers (dados em tempo real), código não-reentrante (só um médico por vez), tudo em modo usuário",
      "E/S por DMA para USB → buffers circulares (absorvem variações de velocidade) → drivers reentrantes no kernel → alertas via system calls de rede → modo usuário para interface; modo núcleo apenas quando necessário",
      "Gravar tudo em spool de disco antes de processar (imprime como uma impressora) e usar modo núcleo para toda a aplicação, incluindo a interface gráfica",
      "Usar apenas system calls manuais sem biblioteca C, com código em modo núcleo para máxima velocidade"
    ],
    ans: 1,
    feedback: "🏆 CAMPEÃO! A arquitetura correta integra TODOS os conceitos: DMA para E/S eficiente sem gastar CPU, buffers circulares para dados de sensores (vazão constante), código reentrante para suportar múltiplos médicos, separação modo usuário/núcleo para segurança, e system calls para acessar rede. Esta é a base de qualquer sistema operacional moderno!",
    xp: 500
  }
];

const LEVELS = [
  { min: 0, icon: '🌱', name: 'Iniciante', desc: 'Primeiros passos em SO' },
  { min: 200, icon: '⚡', name: 'Aprendiz', desc: 'Domina conceitos básicos' },
  { min: 500, icon: '🔧', name: 'Desenvolvedor', desc: 'Aplica conceitos de E/S' },
  { min: 900, icon: '💻', name: 'Analista', desc: 'Compreende o Kernel' },
  { min: 1400, icon: '🛡️', name: 'Engenheiro', desc: 'Domina Modo e Syscalls' },
  { min: 2000, icon: '🏆', name: 'Arquiteto de SO', desc: 'Mestre em Sistemas Operacionais!' },
];

const BADGES = [
  { score: 0, icon: '🎓', name: 'Participante', color: '#64748B', stars: 1 },
  { score: 400, icon: '⚡', name: 'Estudante Ativo', color: '#0EA5E9', stars: 2 },
  { score: 800, icon: '🔧', name: 'Técnico em SO', color: '#10B981', stars: 3 },
  { score: 1300, icon: '💻', name: 'Analista SO', color: '#F59E0B', stars: 4 },
  { score: 1800, icon: '🏆', name: 'Mestre em SO', color: '#F59E0B', stars: 5 },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const COLORS = {
  navy: '#0D1B4B', blue: '#1A56DB', sky: '#0EA5E9',
  lblue: '#DBEAFE', white: '#FFFFFF', dark: '#1E293B',
  mid: '#64748B', lgray: '#F1F5F9', accent: '#F59E0B',
  green: '#065F46', lgreen: '#D1FAE5',
  red: '#7F1D1D', lred: '#FEE2E2',
  teal: '#0891B2', purple: '#6D28D9',
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function SOActivity() {
  const [screen, setScreen] = useState('start');
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredSteps, setAnsweredSteps] = useState([]);
  const [timerVal, setTimerVal] = useState(180);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [comboAnim, setComboAnim] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Timer logic
  useEffect(() => {
    if (screen === 'game' && !showFeedback) {
      timerRef.current = setInterval(() => {
        setTimerVal(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, step, showFeedback]);

  const handleTimeOut = () => {
    setFeedbackType('timeout');
    setShowFeedback(true);
    setCombo(1);
    setAnsweredSteps(prev => [...prev, step]);
  };

  const playSound = (type) => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      if (type === 'correct') {
        o.frequency.setValueAtTime(880, ctx.currentTime);
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        o.start(); o.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(220, ctx.currentTime);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        o.start(); o.stop(ctx.currentTime + 0.4);
      }
    } catch (e) { }
  };

  const startGame = () => {
    if (playerName.trim().length < 2) return;
    setScreen('game');
    setStep(0);
    setScore(0);
    setCorrectCount(0);
    setAnsweredSteps([]);
    setTimerVal(180);
    setGameStartTime(Date.now());
  };

  const selectAnswer = (idx) => {
    if (showFeedback) return;
    const q = QUESTIONS[step];
    const isCorrect = idx === q.ans;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    setFeedbackType(isCorrect ? 'ok' : 'no');

    if (isCorrect) {
      playSound('correct');
      const timeBonus = Math.floor(timerVal / 180 * 100);
      const pts = Math.round(q.xp * (1 + timeBonus / 100) * combo);
      setScore(prev => prev + pts);
      setCorrectCount(prev => prev + 1);
      const newCombo = Math.min(combo + 1, 5);
      setCombo(newCombo);
      if (newCombo > 1) {
        setComboAnim(true);
        setTimeout(() => setComboAnim(false), 1000);
      }
    } else {
      playSound('wrong');
      setCombo(1);
    }
    setMaxCombo(prev => Math.max(prev, combo));
    setAnsweredSteps(prev => [...prev, step]);
  };

  const nextStep = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
      setTimerVal(180);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setScreen('end');
    // Save to Firebase
    try {
      const finalScorePct = Math.round((correctCount / QUESTIONS.length) * 100);
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName,
        score: finalScorePct, // Usado para manter padrão com outras disciplinas
        points: score, // XP total
        duration: Date.now() - gameStartTime,
        timestamp: Date.now(),
        activityId: "sistemas_operacionais",
        lvl: getLevel(score).name,
        badge: getBadge(score).name
      });
    } catch (e) {
      console.error("Error saving score:", e);
    }
  };

  const getLevel = (s) => {
    let lv = LEVELS[0];
    LEVELS.forEach(l => { if (s >= l.min) lv = l; });
    return lv;
  };

  const getBadge = (s) => {
    let b = BADGES[0];
    BADGES.forEach(bg => { if (s >= bg.score) b = bg; });
    return b;
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60), s = t % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  // ─── RENDERING ─────────────────────────────────────────────────────────────

  return (
    <div style={{
      backgroundColor: COLORS.navy,
      color: COLORS.white,
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      padding: '80px 20px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style>{`
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(14,165,233,.6); } 50% { box-shadow: 0 0 0 8px rgba(14,165,233,0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes combo-anim { 0%{opacity:1;transform:translate(-50%,-50%) scale(0.5);} 50%{opacity:1;transform:translate(-50%,-80%) scale(1.2);} 100%{opacity:0;transform:translate(-50%,-120%) scale(1);} }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      {/* Header for back navigation */}
      <Link to="/fametro" style={{
        position: 'fixed', top: 20, left: 20, zIndex: 100,
        color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)'
      }}>
        ← Hub Fametro
      </Link>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {screen === 'start' && (
          <div className="animate-in">
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 12, letterSpacing: 4, color: COLORS.sky, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>CEUNI-FAMETRO · Sistemas Operacionais · 2026.1</div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, margin: 0 }}>⚙️ SO Quest</h1>
              <p style={{ color: '#93C5FD', fontSize: 14 }}>Trilha de Aprendizagem Interativa — OBJ. 347 e 348</p>
            </div>

            <div style={{ 
              background: '#1A1000', border: `1px solid ${COLORS.accent}`, 
              borderRadius: 24, padding: 32, textAlign: 'center',
              boxShadow: `0 20px 50px rgba(0,0,0,0.3)`
            }}>
              <p style={{ fontSize: 18, color: '#FEF3C7', marginBottom: 24 }}><b>Bem-vindo à Trilha!</b><br/>Domine os fundamentos do Kernel, E/S e Proteção de Sistemas.</p>
              
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                {[['11', 'Desafios'], ['3 min', 'Por Etapa'], ['XP', 'Recompensas']].map(([v, l]) => (
                  <div key={l} style={{ background: '#0A1540', border: '1px solid #1E3A6E', borderRadius: 16, padding: '16px 24px', minWidth: 120 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.sky }}>{v}</div>
                    <div style={{ fontSize: 10, color: COLORS.mid, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ maxWidth: 400, margin: '0 auto 24px' }}>
                <input 
                  type="text" 
                  placeholder="Seu nome completo..." 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  style={{
                    width: '100%', padding: '16px 20px', borderRadius: 12, border: `2px solid #1E3A6E`,
                    background: '#0A1540', color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none'
                  }}
                />
              </div>

              <button 
                onClick={startGame}
                disabled={playerName.length < 2}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.sky}, ${COLORS.blue})`,
                  color: '#fff', border: 'none', padding: '16px 48px', borderRadius: 16,
                  fontSize: 18, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                  opacity: playerName.length < 2 ? 0.5 : 1
                }}>
                🚀 Iniciar a Trilha
              </button>
            </div>
          </div>
        )}

        {screen === 'game' && (
          <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.sky, letterSpacing: 2 }}>{playerName.toUpperCase()}</div>
                <h2 style={{ margin: 0 }}>{QUESTIONS[step].stage}</h2>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ background: '#0A1E5C', padding: '10px 16px', borderRadius: 12, textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.sky }}>{score}</div>
                  <div style={{ fontSize: 9, color: COLORS.mid }}>PONTOS</div>
                </div>
                <div style={{ background: '#0A1E5C', padding: '10px 16px', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: timerVal < 30 ? '#EF4444' : '#fff' }}>{formatTime(timerVal)}</div>
                  <div style={{ fontSize: 9, color: COLORS.mid }}>TEMPO</div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div style={{ background: '#1E3A6E', height: 8, borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
              <div style={{ width: `${(step / QUESTIONS.length) * 100}%`, height: '100%', background: COLORS.sky, transition: 'width 0.5s' }} />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: 50, border: '2px solid #1E3A6E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                  backgroundColor: i === step ? COLORS.sky : answeredSteps.includes(i) ? '#10B981' : 'transparent',
                  borderColor: i === step ? COLORS.sky : answeredSteps.includes(i) ? '#10B981' : '#1E3A6E'
                }}>
                  {i === QUESTIONS.length - 1 ? '👑' : i + 1}
                </div>
              ))}
            </div>

            <div style={{ 
              background: '#0A1E5C', border: '1px solid #1E3A6E', borderRadius: 24, padding: 32,
              position: 'relative'
            }} className={feedbackType === 'no' ? 'shake' : ''}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
                <span style={{ background: COLORS.sky, padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>Q{step + 1}</span>
                <span style={{ fontSize: 10, color: COLORS.mid, letterSpacing: 1 }}>{QUESTIONS[step].type.toUpperCase()}</span>
              </div>

              <div style={{ background: '#1e3a8a33', borderLeft: `4px solid ${COLORS.accent}`, padding: '16px 20px', borderRadius: '0 12px 12px 0', marginBottom: 20, fontStyle: 'italic', fontSize: 15, color: '#FEF3C7' }}>
                {QUESTIONS[step].context}
              </div>

              <h3 style={{ fontSize: 20, lineHeight: 1.4, marginBottom: 24 }}>{QUESTIONS[step].q}</h3>

              <div style={{ display: 'grid', gap: 12 }}>
                {QUESTIONS[step].opts.map((opt, i) => {
                  let border = '#1E3A6E';
                  let bg = '#0A1540';
                  if (showFeedback) {
                    if (i === QUESTIONS[step].ans) { border = '#10B981'; bg = '#065F4633'; }
                    else if (i === selectedAnswer) { border = '#EF4444'; bg = '#7F1D1D33'; }
                  }
                  return (
                    <button 
                      key={i} 
                      onClick={() => selectAnswer(i)}
                      disabled={showFeedback}
                      style={{
                        padding: '16px 20px', borderRadius: 12, border: `2px solid ${border}`,
                        background: bg, color: '#fff', textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer',
                        display: 'flex', gap: 16, alignItems: 'center', fontSize: 15, transition: 'all 0.2s'
                      }}>
                      <span style={{ width: 28, height: 28, background: border, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div style={{ 
                  marginTop: 24, padding: 20, borderRadius: 16, 
                  background: feedbackType === 'ok' ? '#065F4633' : '#7F1D1D33',
                  border: `1px solid ${feedbackType === 'ok' ? '#10B981' : '#EF4444'}`,
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{QUESTIONS[step].feedback}</p>
                  <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <button 
                      onClick={nextStep}
                      style={{
                        background: COLORS.sky, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10,
                        fontWeight: 700, cursor: 'pointer'
                      }}>
                      {step === QUESTIONS.length - 1 ? 'Finalizar' : 'Próxima Etapa'} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {screen === 'end' && (
          <div className="animate-in" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 48, marginBottom: 32 }}>🏆 Trilha Concluída!</h1>
            
            <div style={{ background: '#1A1000', borderRadius: 24, padding: 40, border: `2px solid ${COLORS.accent}`, marginBottom: 32 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{getLevel(score).icon}</div>
              <h2 style={{ fontSize: 32, color: COLORS.sky, margin: 0 }}>{getLevel(score).name}</h2>
              <p style={{ color: COLORS.mid, marginBottom: 24 }}>{getLevel(score).desc}</p>
              
              <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.accent }}>{score.toLocaleString('pt-BR')} <span style={{ fontSize: 20 }}>pts</span></div>
              
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
                <div style={{ background: '#0A1540', padding: '16px 24px', borderRadius: 16, border: '1px solid #1E3A6E' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>{Math.round((correctCount/QUESTIONS.length)*100)}%</div>
                  <div style={{ fontSize: 10, color: COLORS.mid }}>ACURÁCIA</div>
                </div>
                <div style={{ background: '#0A1540', padding: '16px 24px', borderRadius: 16, border: '1px solid #1E3A6E' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.accent }}>{getBadge(score).icon}</div>
                  <div style={{ fontSize: 10, color: COLORS.mid }}>{getBadge(score).name}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button onClick={() => setScreen('start')} style={{ background: 'transparent', border: '1px solid #334155', color: '#fff', padding: '16px 32px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>🔄 Tentar Novamente</button>
              <Link to="/fametro/so/ranking" style={{ background: COLORS.sky, color: '#fff', padding: '16px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>📊 Ver Ranking Global</Link>
            </div>
          </div>
        )}

      </div>

      {comboAnim && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: 48, fontWeight: 900, color: COLORS.accent, zIndex: 1000,
          textShadow: '0 0 20px rgba(245,158,11,0.8)', animation: 'combo-anim 1s ease-out forwards'
        }}>
          ⚡ COMBO ×{combo}
        </div>
      )}
    </div>
  );
}
