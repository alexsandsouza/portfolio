import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProgress } from './HDBProgress';
import { playSuccess, playError, playTick, playBadge } from './HDBAudio';
import HDBTerminalLoader from './HDBTerminalLoader';
import './HackersDoBem.css';

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUESTIONS_POOL = [
  // M10 - Segurança no Host
  {
    type: "choice",
    category: "ENDPOINTS",
    text: "Qual destes NÃO é considerado um 'Endpoint' em uma rede corporativa moderna?",
    answers: ["Laptop do funcionário", "Servidor de Banco de Dados", "Cabo de rede CAT6", "Smartphone corporativo"],
    correct: 2,
    feedback: "Endpoints são dispositivos finais que se conectam à rede. Cabos e switches são infraestrutura, não endpoints.",
    points: 5
  },
  {
    type: "choice",
    category: "HARDENING",
    text: "O processo de configurar um sistema operacional para remover serviços desnecessários e fechar portas vulneráveis é chamado de:",
    answers: ["Clonagem", "Hardening", "Virtualização", "Overclocking"],
    correct: 1,
    feedback: "Hardening (Endurecimento) visa reduzir a superfície de ataque do sistema ao mínimo necessário.",
    points: 5
  },
  {
    type: "choice",
    category: "HARDENING",
    text: "Em ambientes Windows, qual ferramenta é amplamente usada para aplicar políticas de segurança e hardening em massa em todos os hosts do domínio?",
    answers: ["Notepad++", "GPO (Group Policy Objects)", "Task Manager", "Disk Cleanup"],
    correct: 1,
    feedback: "As GPOs permitem que administradores definam configurações de segurança centralizadas para milhares de computadores.",
    points: 5
  },
  {
    type: "choice",
    category: "PROTEÇÃO",
    text: "Qual a principal diferença entre um Antivírus tradicional e um EDR (Endpoint Detection and Response)?",
    answers: ["EDR é apenas para servidores", "AV foca em assinaturas conhecidas; EDR foca em comportamento e resposta a incidentes", "EDR não precisa de internet", "AV é mais caro que EDR"],
    correct: 1,
    feedback: "Enquanto o AV busca arquivos conhecidos, o EDR monitora atividades suspeitas em tempo real para detectar ataques sofisticados.",
    points: 5
  },
  {
    type: "choice",
    category: "PROTEÇÃO",
    text: "Um sistema que monitora e bloqueia tentativas de invasão DIRETAMENTE no host, analisando logs e tráfego de rede local, é um:",
    answers: ["NIDS", "HIPS (Host-based Intrusion Prevention System)", "Proxy Server", "VPC"],
    correct: 1,
    feedback: "O HIPS atua dentro do host para prevenir atividades maliciosas baseadas em regras e assinaturas locais.",
    points: 5
  },
  {
    type: "choice",
    category: "ATUALIZAÇÃO",
    text: "O que é uma vulnerabilidade 'Zero-Day'?",
    answers: ["Uma falha que já foi corrigida há anos", "Uma falha desconhecida pelo fabricante e sem correção disponível no momento", "Uma falha que só acontece aos domingos", "Um vírus que apaga o relógio do sistema"],
    correct: 1,
    feedback: "Zero-Day indica que o 'dia zero' da correção ainda não chegou, tornando o ataque extremamente perigoso.",
    points: 5
  },
  {
    type: "choice",
    category: "ATUALIZAÇÃO",
    text: "Qual a função do 'Patch Management' no ciclo de vida de segurança de um host?",
    answers: ["Criar novas senhas", "Identificar, testar e aplicar correções de software", "Aumentar o brilho da tela", "Instalar novos jogos"],
    correct: 1,
    feedback: "Manter o sistema atualizado com os últimos patches de segurança é a defesa número 1 contra a maioria dos malwares.",
    points: 5
  },
  {
    type: "choice",
    category: "MONITORAMENTO",
    text: "O monitoramento FIM (File Integrity Monitoring) tem como objetivo principal:",
    answers: ["Aumentar o espaço em disco", "Detectar alterações não autorizadas em arquivos críticos do sistema", "Compactar arquivos antigos", "Mudar a extensão dos arquivos"],
    correct: 1,
    feedback: "O FIM alerta quando arquivos essenciais do Windows ou Linux são modificados, o que pode indicar a presença de um Rootkit.",
    points: 5
  },
  {
    type: "hangman",
    category: "CONCEITO",
    text: "Processo de endurecimento e proteção de um sistema operacional.",
    answer: "HARDENING",
    feedback: "O Hardening é o primeiro passo após a instalação de qualquer servidor.",
    points: 10
  },
  {
    type: "hangman",
    category: "TECNOLOGIA",
    text: "Plataforma de detecção e resposta para dispositivos finais.",
    answer: "EDR",
    feedback: "O EDR é essencial para a visibilidade de ameaças em endpoints modernos.",
    points: 10
  },
  {
    type: "hangman",
    category: "PROCESSO",
    text: "Gerenciamento e aplicação de correções de segurança no software.",
    answer: "PATCH MANAGEMENT",
    feedback: "Sem um bom gerenciamento de patches, o host fica vulnerável a exploits conhecidos.",
    points: 10
  },
  {
    type: "hangman",
    category: "DISPOSITIVO",
    text: "Qualquer dispositivo final que se conecta a uma rede corporativa.",
    answer: "ENDPOINT",
    feedback: "Endpoints são os principais alvos de ataques iniciais (Phishing, Malware).",
    points: 10
  },
  {
    type: "hangman",
    category: "SEGURANÇA",
    text: "Ferramenta que controla o tráfego de entrada e saída no próprio host.",
    answer: "FIREWALL DE HOST",
    feedback: "O Firewall de Host (como o Windows Firewall ou iptables) é uma camada vital de defesa.",
    points: 10
  },
  {
    type: "scrambled",
    category: "ATIVIDADE",
    text: "Ação de observar continuamente o estado e logs de um sistema.",
    answer: "MONITORAMENTO",
    feedback: "Monitoramento é a base para a detecção de incidentes.",
    points: 8
  },
  {
    type: "scrambled",
    category: "ESTADO",
    text: "Presença de uma falha ou fraqueza que pode ser explorada.",
    answer: "VULNERABILIDADE",
    feedback: "Identificar vulnerabilidades antes dos atacantes é o objetivo do PenTesting.",
    points: 8
  },
  {
    type: "scrambled",
    category: "MANUTENÇÃO",
    text: "Obter a versão mais recente e segura de um software.",
    answer: "ATUALIZACAO",
    feedback: "Sempre mantenha seus hosts atualizados!",
    points: 8
  },
  {
    type: "scrambled",
    category: "NORMA",
    text: "Estar em conformidade com as regras e políticas de segurança.",
    answer: "COMPLIANCE",
    feedback: "Compliance garante que os padrões mínimos de segurança sejam seguidos.",
    points: 8
  },
  {
    type: "scrambled",
    category: "COMPONENTE",
    text: "Software instalado no host para realizar a coleta de dados de segurança.",
    answer: "AGENTE",
    feedback: "Muitas soluções de EDR e SIEM usam um 'agente' local.",
    points: 8
  },
  {
    type: "choice",
    category: "ENDPOINTS",
    text: "Qual o risco principal de utilizar sistemas operacionais em fim de vida (End of Life - EOL)?",
    answers: ["O sistema fica mais lento", "Falta de suporte do fabricante e ausência de patches de segurança", "As cores da interface mudam", "Não é possível instalar o Office"],
    correct: 1,
    feedback: "Sistemas EOL não recebem mais atualizações de segurança, tornando-os alvos fáceis.",
    points: 5
  },
  {
    type: "choice",
    category: "HARDENING",
    text: "No contexto de Linux, o que significa desativar o acesso de 'root' via SSH?",
    answers: ["Apagar o usuário root", "Impedir conexões remotas diretas com o usuário superpoderoso", "Mudar a senha do root", "Desinstalar o SSH"],
    correct: 1,
    feedback: "É uma prática de hardening básica forçar o uso de um usuário comum e depois usar 'sudo'.",
    points: 5
  }
];

const BADGES = [
  { id: 'endpoint_expert', emoji: '💻', name: 'Endpoint Expert', desc: 'Sabe tudo sobre dispositivos finais', condition: (s) => s.categories['ENDPOINTS'] >= 2 },
  { id: 'hardening_master', emoji: '🏗️', name: 'Hardening Master', desc: 'Especialista em blindagem de sistemas', condition: (s) => s.categories['HARDENING'] >= 3 },
  { id: 'shield_agent', emoji: '🛡️', name: 'Agente Shield', desc: 'Domina proteção e monitoramento', condition: (s) => s.categories['PROTEÇÃO'] >= 1 && s.categories['MONITORAMENTO'] >= 1 },
  { id: 'hangman_pro', emoji: '🪢', name: 'Mestre da Forca', desc: 'Venceu 4 desafios de Forca', condition: (s) => s.types['hangman'] >= 4 },
  { id: 'unscrambler', emoji: '🧩', name: 'Decifrador', desc: 'Resolveu os enigmas de palavras', condition: (s) => s.types['scrambled'] >= 4 },
  { id: 'host_certified', emoji: '🎓', name: 'Host Certified', desc: 'Completou a Missão de Host Security', condition: (s) => s.finished },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function HangmanGame({ target, onComplete, disabled }) {
  const [guessed, setGuessed] = useState([]);
  const word = target.toUpperCase();
  const letters = word.split('');
  const uniqueLetters = [...new Set(word.replace(/ /g, '').split(''))];
  
  const mistakes = guessed.filter(l => l !== ' ' && !uniqueLetters.includes(l)).length;
  const maxMistakes = 6;
  const isWon = uniqueLetters.every(l => guessed.includes(l));
  const isLost = mistakes >= maxMistakes;

  useEffect(() => {
    if (isWon) onComplete(true);
    if (isLost) onComplete(false);
  }, [isWon, isLost, onComplete]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 20, color: '#FF5252', lineHeight: 1.2, textAlign: 'left', width: 100 }}>
        <pre>
          {`  +---+ \n  |   | \n  ${mistakes > 0 ? 'O' : ' '}   | \n ${mistakes > 2 ? '/' : ' '}${mistakes > 1 ? '|' : ' '}${mistakes > 3 ? '\\' : ' '}  | \n ${mistakes > 4 ? '/' : ' '} ${mistakes > 5 ? '\\' : ' '}  | \n      | \n=========`}
        </pre>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {letters.map((l, i) => (
          <div key={i} style={{ 
            width: l === ' ' ? 20 : 30, height: 40, borderBottom: l === ' ' ? 'none' : '2px solid #00E676', 
            fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: guessed.includes(l) || isLost ? (uniqueLetters.includes(l) ? '#00E676' : '#FF5252') : 'transparent'
          }}>
            {l === ' ' ? ' ' : (guessed.includes(l) || isLost ? l : '')}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 4, width: '100%', maxWidth: 400 }}>
        {alphabet.map(l => {
          const isGuessed = guessed.includes(l);
          return (
            <button key={l} onClick={() => !isGuessed && !disabled && setGuessed(g => [...g, l])}
              disabled={isGuessed || isLost || isWon || disabled}
              style={{
                padding: '8px 0', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                background: isGuessed ? (uniqueLetters.includes(l) ? 'rgba(0,230,118,0.2)' : 'rgba(255,82,82,0.2)') : 'rgba(255,255,255,0.05)',
                color: isGuessed ? (uniqueLetters.includes(l) ? '#00E676' : '#FF5252') : '#fff',
                fontSize: 12, fontWeight: 700, cursor: isGuessed || disabled ? 'default' : 'pointer'
              }}>{l}</button>
          );
        })}
      </div>
    </div>
  );
}

function ScrambledGame({ target, onComplete, disabled }) {
  const word = target.replace(/ /g, '').toUpperCase();
  const [input, setInput] = useState("");
  const scrambled = useRef(word.split('').sort(() => Math.random() - 0.5).join('')).current;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    onComplete(input.toUpperCase() === word);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
      <div style={{ letterSpacing: 8, fontSize: 32, fontWeight: 900, color: '#00D676', marginBottom: 20 }}>{scrambled}</div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} disabled={disabled}
        placeholder="DECIFRE A PALAVRA..."
        style={{ width: '100%', padding: 15, borderRadius: 10, background: '#0A0A0F', border: '1px solid #333', color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 700 }} />
    </form>
  );
}

export default function AtividadeHDBM10() {
  const [screen, setScreen] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [playerName, setPlayerName] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [stats, setStats] = useState({ categories: {}, types: {}, fastAnswers: 0, finished: false });
  const [duration, setDuration] = useState(0);
  const [isBypassing, setIsBypassing] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === "quiz") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleComplete(false); return 0; }
          if (t <= 10) playTick();
          return t - 1;
        });
        setDuration(d => d + 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [screen]);

  const startChallenge = () => {
    if (!playerName.trim()) return;
    setScreen("bypass");
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(`Bem vindo Agente ${playerName}. Iniciando defesa do host.`);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
      }
    } catch (e) {
      console.warn("Voz não suportada.");
    }
  };

  const onBypassComplete = () => {
    const shuffled = [...QUESTIONS_POOL].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(shuffled);
    setScreen("quiz");
  };

  const handleComplete = (correct) => {
    if (showFeedback) return;
    setIsCorrect(correct);
    setShowFeedback(true);

    const q = questions[currentQ];
    const newStats = { ...stats };
    if (correct) {
      playSuccess();
      setScore(s => s + q.points);
      newStats.categories[q.category] = (newStats.categories[q.category] || 0) + 1;
      newStats.types[q.type] = (newStats.types[q.type] || 0) + 1;
      if (timeLeft > 150) newStats.fastAnswers++;
    } else {
      playError();
    }
    setStats(newStats);
    const newBadges = BADGES.filter(b => !earnedBadges.includes(b.id) && b.condition(newStats));
    if (newBadges.length > 0) {
      playBadge();
      setEarnedBadges(prev => [...prev, ...newBadges.map(b => b.id)]);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(c => c + 1);
      setShowFeedback(false);
      setTimeLeft(180);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    const finalStats = { ...stats, finished: true };
    const finalBadges = BADGES.filter(b => b.condition(finalStats)).map(b => b.id);
    
    setScreen("result");
    setEarnedBadges(finalBadges);
    saveProgress("HDB_M10", finalBadges, score);
    playBadge();

    try {
      const entry = {
        name: playerName,
        score,
        duration: duration * 1000,
        module: "HDB_M10",
        badges: finalBadges,
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, "fametro_ranking"), entry);
    } catch (err) {
      console.warn("Ranking Error:", err);
    }
  };

  if (screen === "intro") return (
    <div className="hdb-scanlines" style={{ minHeight: '100vh', background: '#0A0A0F', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'var(--hdb-main-font)' }}>
      <div className="hdb-card" style={{ maxWidth: 500, textAlign: 'center', background: '#13131A', padding: 40, borderRadius: 20, border: '1px solid #2A2A35', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🛡️</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Host Security Challenge</h1>
        <h2 style={{ fontSize: 13, color: '#00FF88', letterSpacing: 3, marginBottom: 30, fontWeight: 700 }}>MÓDULO 10 · SEGURANÇA NO HOST</h2>
        <p className="hdb-high-contrast" style={{ marginBottom: 35, lineHeight: 1.6, fontSize: 16 }}>
          Proteja os endpoints da SeguraTech! Enfrente 20 desafios sobre Hardening, AV/EDR e Patch Management. Randomizado e Cronometrado.
        </p>
        <input type="text" placeholder="ID DO AGENTE" value={playerName} onChange={e => setPlayerName(e.target.value)}
          style={{ width: '100%', padding: 15, borderRadius: 10, border: '1px solid #333', background: '#0A0A0F', color: '#fff', marginBottom: 20, textAlign: 'center', fontSize: 16 }} />
        <button onClick={startChallenge}
          style={{ width: '100%', padding: 18, borderRadius: 10, border: 'none', background: '#00FF88', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>INICIAR DEFESA</button>
        <Link to="/hackersdobem/ranking-m10" style={{ display: 'block', marginTop: 20, color: '#666', textDecoration: 'none', fontSize: 12 }}>RANKING M10 →</Link>
      </div>
    </div>
  );

  if (screen === "quiz") {
    const q = questions[currentQ];
    return (
      <div className="hdb-scanlines" style={{ minHeight: '100vh', background: '#0A0A12', color: '#fff', padding: '100px 20px', fontFamily: 'var(--hdb-main-font)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, background: '#13131A', padding: '15px 25px', borderRadius: 15, border: '1px solid #2A2A35' }}>
            <div style={{ color: '#00FF88', fontWeight: 700 }}>{playerName}</div>
            <div style={{ color: timeLeft < 30 ? '#FF5252' : '#FFD600', fontFamily: 'monospace', fontWeight: 700 }}>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
            <div style={{ fontWeight: 700 }}>Score: {score}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)' }}>{currentQ + 1}/20</div>
          </div>
          <div className="hdb-card" style={{ background: '#13131A', padding: 40, borderRadius: 24, border: '1px solid #2A2A35', minHeight: 450, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, color: '#00FF88', letterSpacing: 3, marginBottom: 15 }}>{q.category} · {q.points} PTS</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 40, lineHeight: 1.4 }}>{q.text}</h3>
            <div style={{ flex: 1 }}>
              {q.type === "choice" && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 15 }}>
                  {q.answers.map((ans, i) => (
                    <button key={i} onClick={() => !showFeedback && handleComplete(i === q.correct)}
                      disabled={showFeedback}
                      className="hdb-btn-neon"
                      style={{
                        padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
                        background: showFeedback ? (i === q.correct ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.02)') : 'rgba(255,255,255,0.03)',
                        borderColor: showFeedback ? (i === q.correct ? '#00FF88' : 'rgba(255,82,82,0.5)') : 'rgba(255,255,255,0.05)',
                        color: '#eee', textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer', fontSize: 15
                      }}>{ans}</button>
                  ))}
                </div>
              )}
              {q.type === "hangman" && <HangmanGame target={q.answer} onComplete={handleComplete} disabled={showFeedback} />}
              {q.type === "scrambled" && <ScrambledGame target={q.answer} onComplete={handleComplete} disabled={showFeedback} />}
            </div>
            {showFeedback && (
              <div style={{ marginTop: 40, animation: 'fadeIn 0.4s' }}>
                <div style={{ padding: 25, borderRadius: 15, background: isCorrect ? 'rgba(0,255,136,0.03)' : 'rgba(255,82,82,0.03)', borderLeft: `5px solid ${isCorrect ? '#00FF88' : '#FF5252'}`, marginBottom: 25 }}>
                  <div style={{ fontWeight: 900, color: isCorrect ? '#00FF88' : '#FF5252', fontSize: 18, marginBottom: 8 }}>{isCorrect ? "MISSION SUCCESS (+"+q.points+" pts)" : "MISSION FAILED"}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{q.feedback}</div>
                </div>
                <button onClick={nextQuestion} style={{ width: '100%', padding: 20, borderRadius: 12, border: 'none', background: '#fff', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}>
                  {currentQ + 1 < questions.length ? "PRÓXIMA FASE →" : "ENCERRAR MISSÃO 🏆"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "result") {
    return (
      <div className="hdb-scanlines" style={{ minHeight: '100vh', background: '#0A0A0F', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'var(--hdb-main-font)' }}>
        <div className="hdb-card" style={{ maxWidth: 650, width: '100%', textAlign: 'center', background: '#13131A', padding: 50, borderRadius: 30, border: '1px solid #2A2A35', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
          <div style={{ fontSize: 90, marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>PONTUAÇÃO FINAL</h2>
          <div style={{ fontSize: 80, fontWeight: 900, color: '#00FF88', textShadow: '0 0 30px rgba(0,255,136,0.4)', lineHeight: 1 }}>{score}</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', margin: '20px 0 40px', letterSpacing: 4 }}>AGENTE {playerName.toUpperCase()}</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 40 }}>
            <div style={{ background: '#0A0A0F', padding: 20, borderRadius: 15 }}><div style={{ fontSize: 24, fontWeight: 700 }}>20</div><div style={{ fontSize: 11, color: '#666' }}>QUESTÕES</div></div>
            <div style={{ background: '#0A0A0F', padding: 20, borderRadius: 15 }}><div style={{ fontSize: 24, fontWeight: 700 }}>{Math.floor(duration/60)}:{String(duration%60).padStart(2,'0')}</div><div style={{ fontSize: 11, color: '#666' }}>TEMPO</div></div>
            <div style={{ background: '#0A0A0F', padding: 20, borderRadius: 15 }}><div style={{ fontSize: 24, fontWeight: 700 }}>{earnedBadges.length}</div><div style={{ fontSize: 11, color: '#666' }}>BADGES</div></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 50 }}>
            {earnedBadges.map(bid => {
              const b = BADGES.find(x => x.id === bid);
              if (!b) return null;
              return <div key={bid} title={b.desc} style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)', padding: '10px 20px', borderRadius: 30, fontSize: 12, fontWeight: 700 }}>{b.emoji} {b.name}</div>
            })}
          </div>

          <div style={{ display: 'flex', gap: 15 }}>
            <button onClick={() => setShowBadge(true)} style={{ flex: 1, padding: 20, borderRadius: 12, background: 'rgba(0, 255, 136, 0.1)', color: '#00FF88', border: '1px solid #00FF88', fontWeight: 900, cursor: 'pointer' }}>GERAR CREDENCIAL</button>
            <Link to="/hackersdobem/ranking-m10" style={{ flex: 1, padding: 20, borderRadius: 12, background: '#00FF88', color: '#000', textDecoration: 'none', fontWeight: 900 }}>RANKING M10</Link>
          </div>
          <Link to="/hackersdobem" style={{ display: 'block', marginTop: 20, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Sair da Missão</Link>
        </div>

        {/* Modal da Credencial */}
        {showBadge && (
          <div className="hdb-no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30000, padding: 20 }}>
            <div className="hdb-badge-container hdb-badge-print">
              <div className="hdb-badge-head">
                <div style={{ fontSize: 10, letterSpacing: 4, color: '#00FF88', marginBottom: 5 }}>SECURITY CLEARANCE: LEVEL 1</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>AGENTE DE DEFESA</div>
              </div>
              
              <div style={{ display: 'flex', gap: 20, textAlign: 'left', marginBottom: 30 }}>
                <div style={{ width: 100, height: 120, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, borderRadius: 10 }}>👨‍💻</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>NOME DO AGENTE</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 15 }}>{playerName.toUpperCase()}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>MISSÃO</div>
                  <div style={{ fontSize: 12, color: '#00FF88' }}>MÓDULO 10: HOST SECURITY</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 30 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>SCORE TOTAL</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#00FF88' }}>{score}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>QUALIFICAÇÃO</div>
                  <div style={{ fontSize: 14, fontWeight: 900, marginTop: 5 }}>APROVADO</div>
                </div>
              </div>

              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>CONQUISTAS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 30 }}>
                {earnedBadges.slice(0,4).map(bid => {
                  const b = BADGES.find(x => x.id === bid);
                  return <span key={bid} style={{ fontSize: 14 }} title={b?.name}>{b?.emoji}</span>
                })}
              </div>

              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>VERIFICADO POR ALEXSANDER FARIAS · 2026</div>

              <div className="hdb-no-print" style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => window.print()} style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', background: '#fff', color: '#000', fontWeight: 900, cursor: 'pointer' }}>IMPRIMIR / PDF</button>
                <button onClick={() => setShowBadge(false)} style={{ padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>FECHAR</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (screen === "bypass") {
    return (
      <div style={{ height: '100vh', background: '#0A0A12' }}>
        <HDBTerminalLoader 
          onComplete={onBypassComplete} 
          message={`AUTENTICANDO AGENTE: ${playerName.toUpperCase()}...`} 
        />
      </div>
    );
  }

  return null;
}
