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
  // M12 - Resposta a Incidentes e Protocolos Seguros
  {
    type: "choice",
    category: "LOGS",
    text: "Qual ferramenta é considerada uma solução de segurança que oferece gerenciamento de eventos e informações em tempo real, realizando coleta e correlação de logs de diversas fontes?",
    answers: ["Antivírus", "Firewall", "SIEM (Security Information and Event Management)", "Proxy"],
    correct: 2,
    feedback: "O SIEM centraliza logs e utiliza regras de correlação para detectar anomalias e possíveis incidentes em tempo real.",
    points: 5
  },
  {
    type: "choice",
    category: "PROTOCOLOS",
    text: "Qual protocolo é uma extensão que fornece uma camada adicional de proteção contra ataques de envenenamento de cache DNS (DNS Poisoning)?",
    answers: ["DHCP Snooping", "DNSSEC", "SSL/TLS", "IPSec"],
    correct: 1,
    feedback: "O DNSSEC utiliza assinaturas digitais e cadeia de confiança para garantir a integridade dos registros DNS.",
    points: 5
  },
  {
    type: "choice",
    category: "WIFI",
    text: "Em redes sem fio, qual é o padrão de segurança atual mais robusto, que utiliza criptografia de 192 bits e proteção avançada contra ataques de força bruta?",
    answers: ["WEP", "WPA", "WPA2", "WPA3"],
    correct: 3,
    feedback: "O WPA3 é a versão aprimorada do WPA2, oferecendo autenticação individualizada (SAE) e resistência a ataques de dicionário.",
    points: 5
  },
  {
    type: "choice",
    category: "PROCESSOS",
    text: "No plano de resposta a incidentes, qual é a sigla da equipe especializada e responsável por gerenciar e coordenar internamente a resposta a incidentes na organização?",
    answers: ["NOC", "CSIRT", "SOC", "Blue Team"],
    correct: 1,
    feedback: "A equipe CSIRT (Computer Security Incident Response Team) atua como o ponto de contato para mitigação de incidentes.",
    points: 5
  },
  {
    type: "choice",
    category: "EQUIPES",
    text: "Qual time de segurança atua simulando ataques cibernéticos e testando as defesas do ambiente para identificar vulnerabilidades de forma ofensiva?",
    answers: ["Blue Team", "Red Team", "Purple Team", "White Team"],
    correct: 1,
    feedback: "O Red Team possui uma função ofensiva e ética para estressar os controles de segurança vigentes.",
    points: 5
  },
  {
    type: "choice",
    category: "PROTOCOLOS",
    text: "Quais são os dois principais protocolos de proteção que compõem a arquitetura do IPSec?",
    answers: ["TCP e UDP", "AH (Authentication Header) e ESP (Encapsulation Security Payload)", "SSL e TLS", "HTTP e HTTPS"],
    correct: 1,
    feedback: "O AH fornece autenticação e integridade, enquanto o ESP fornece também confidencialidade (criptografia).",
    points: 5
  },
  {
    type: "choice",
    category: "INCIDENTES",
    text: "Qual framework de ataque divide as ações do invasor em estágios cronológicos que vão do Reconhecimento (Reconnaissance) e Entrega (Delivery) até as Ações nos Objetivos (Action on Objectives)?",
    answers: ["MITRE ATT&CK", "Cyber Kill Chain", "Modelo Diamante", "ISO 27001"],
    correct: 1,
    feedback: "O Cyber Kill Chain detalha o caminho percorrido por uma ameaça, permitindo que a defesa atue para quebrar a sequência em qualquer etapa.",
    points: 5
  },
  {
    type: "choice",
    category: "FERRAMENTAS",
    text: "Qual tecnologia opera em plataforma única orquestrando respostas a incidentes com automatização de tarefas e fluxos de trabalho combinados?",
    answers: ["DLP", "SOAR (Security Orchestration, Automation, and Response)", "UEBA", "IDS"],
    correct: 1,
    feedback: "O SOAR proporciona automação rápida e respostas padronizadas baseadas em playbooks.",
    points: 5
  },
  {
    type: "hangman",
    category: "EQUIPES",
    text: "Time de segurança com viés defensivo que atua no monitoramento da infraestrutura e na operação de ferramentas como firewalls e IDS.",
    answer: "BLUE TEAM",
    feedback: "A equipe de defesa foca em proteger, monitorar e responder proativamente a anomalias.",
    points: 10
  },
  {
    type: "hangman",
    category: "FRAMEWORK",
    text: "Modelo e base de conhecimento universal e matricial em cyber security focado em Táticas, Técnicas e Procedimentos (TTPs).",
    answer: "MITRE ATTACK",
    feedback: "MITRE ATT&CK é essencial para mapear ameaças avançadas usando TTPs.",
    points: 10
  },
  {
    type: "hangman",
    category: "REDES",
    text: "Classificação dada a um ponto de acesso malicioso criado para imitar redes autênticas e enganar clientes de uma infraestrutura sem fio corporativa (17 letras, em inglês, começa com R).",
    answer: "ROGUE ACCESS POINT",
    feedback: "Esses dispositivos criam brechas para ataques do tipo Man-in-the-Middle e captura de tráfego.",
    points: 10
  },
  {
    type: "hangman",
    category: "PROTOCOLOS",
    text: "Protocolo seguro utilizado para transferir arquivos entre sistemas utilizando a camada do SSH.",
    answer: "SFTP",
    feedback: "O SFTP (SSH File Transfer Protocol) garante integridade e confidencialidade no acesso e gestão de arquivos.",
    points: 10
  },
  {
    type: "hangman",
    category: "SEGURANÇA",
    text: "Sigla de 3 letras em inglês referente à prevenção de perda ou vazamento de dados corporativos ou sigilosos.",
    answer: "DLP",
    feedback: "Data Loss Prevention possui políticas severas de bloqueio de cópia e envio indevido de anexos.",
    points: 10
  },
  {
    type: "scrambled",
    category: "MONITORAMENTO",
    text: "Protocolo padrão amplamente consolidado para o envio formal de mensagens de log a um servidor central.",
    answer: "SYSLOG",
    feedback: "Pode ser centralizado em coletores ou SIEM para correlacionar eventos.",
    points: 8
  },
  {
    type: "scrambled",
    category: "DIR_SERVICE",
    text: "Variante criptograficamente segura para consultas em um serviço de diretório onde se validam credenciais centralizadas.",
    answer: "LDAPS",
    feedback: "Protege contra roubo de senhas por interceptações do tráfego LDAP plano.",
    points: 8
  },
  {
    type: "scrambled",
    category: "RESPOSTA",
    text: "Uma ocorrência, falha, violação de política ou incidente de segurança da informação recém acionado.",
    answer: "INCIDENTE",
    feedback: "Gerir um incidente é estancar sangramentos corporativos nos ativos e reputação.",
    points: 8
  },
  {
    type: "scrambled",
    category: "RESILIÊNCIA",
    text: "Sigla de 3 letras do plano que guia a corporação rumo à retomada dos sistemas de T.I. em caso de colapso do ambiente ou desastres naturais.",
    answer: "DRP",
    feedback: "O Disaster Recovery Plan garante os procedimentos e ordem exatos após um grande evento destrutivo.",
    points: 8
  },
  {
    type: "scrambled",
    category: "TECNOLOGIA",
    text: "Sigla de 4 letras de uma ferramenta analítica de comportamento de entidades e usuários visando identificar desvios do padrão esperado (Baseline).",
    answer: "UEBA",
    feedback: "Muito atrelada ao SIEM, a Análise UEBA foca na anomalia silenciosa.",
    points: 8
  },
  {
    type: "choice",
    category: "PROTOCOLOS",
    text: "Em switches L2, um ataque que injeta novos servidores DHCP maliciosos (Rogue DHCP) na rede para redirecionar tráfego é freado usando o recurso de:",
    answers: ["VLANs", "Port Security", "DHCP Snooping", "STP"],
    correct: 2,
    feedback: "O DHCP Snooping confia apenas em portas predefinidas como legítimas para o envio de ofertas DHCP.",
    points: 5
  },
  {
    type: "choice",
    category: "PROCESSOS",
    text: "Que documento traça as diretrizes para garantir que as operações essenciais para o fim que a organização se destina (o seu ganha pão) se preservem em instantes de gravidade extrema?",
    answers: ["IRP", "SLA", "BCP (Business Continuity Plan)", "NDA"],
    correct: 2,
    feedback: "O BCP (Plano de Continuidade de Negócios) mira a preservação corporativa como um todo e reordena prioridades.",
    points: 5
  }
];

const BADGES = [
  { id: 'irs_expert', emoji: '🧑‍🚒', name: 'Incidence Responder', desc: 'Respondeu bem a incidentes críticos e CSIRT', condition: (s) => s.categories['PROCESSOS'] >= 1 && s.categories['INCIDENTES'] >= 1 },
  { id: 'proto_secure', emoji: '🔐', name: 'Protocolos Seguros', desc: 'Mestre nos protocolos L2, L3, L4 e HTTPS', condition: (s) => s.categories['PROTOCOLOS'] >= 3 },
  { id: 'log_hunter', emoji: '🔎', name: 'Log Hunter', desc: 'Sabe rastrear e correlacionar registros', condition: (s) => s.categories['LOGS'] >= 1 && s.categories['MONITORAMENTO'] >= 1 },
  { id: 'hangman_pro', emoji: '🪢', name: 'Mestre da Forca', desc: 'Decifrou as ameaças da forca', condition: (s) => s.types['hangman'] >= 4 },
  { id: 'unscrambler', emoji: '🧩', name: 'Decifrador', desc: 'Misturou e consertou conceitos-chave', condition: (s) => s.types['scrambled'] >= 4 },
  { id: 'm12_certified', emoji: '🎓', name: 'Proteção Plena', desc: 'Completou a Missão do M12 (Incidentes e Protocolos)', condition: (s) => s.finished },
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

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&".split("");

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

export default function AtividadeHDBM12() {
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
        const msg = new SpeechSynthesisUtterance(`Bem vindo Agente ${playerName}. Preparando defesas e incidentes do Sistema.`);
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
    saveProgress("HDB_M12", finalBadges, score);
    playBadge();

    try {
      const entry = {
        name: playerName,
        score,
        duration: duration * 1000,
        module: "HDB_M12",
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
        <div style={{ fontSize: 60, marginBottom: 20 }}>📡</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Resposta a Incidentes & Redes Seguras</h1>
        <h2 style={{ fontSize: 13, color: '#00FF88', letterSpacing: 3, marginBottom: 30, fontWeight: 700 }}>MÓDULO 12 · CYBER INCIDENTS</h2>
        <p className="hdb-high-contrast" style={{ marginBottom: 35, lineHeight: 1.6, fontSize: 16 }}>
          Proteja o perímetro corporativo! Enfrente 20 desafios sobre Resposta a Incidentes, Protocolos Seguros, Frameworks MITRE ATT&CK e Equipos de Defesa.
        </p>
        <input type="text" placeholder="ID DO AGENTE" value={playerName} onChange={e => setPlayerName(e.target.value)}
          style={{ width: '100%', padding: 15, borderRadius: 10, border: '1px solid #333', background: '#0A0A0F', color: '#fff', marginBottom: 20, textAlign: 'center', fontSize: 16 }} />
        <button onClick={startChallenge}
          style={{ width: '100%', padding: 18, borderRadius: 10, border: 'none', background: '#00FF88', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>INICIAR DEFESA</button>
        <Link to="/hackersdobem" style={{ display: 'block', marginTop: 20, color: '#666', textDecoration: 'none', fontSize: 12 }}>VOLTAR PARA O HUB →</Link>
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
            <Link to="/hackersdobem" style={{ flex: 1, padding: 20, borderRadius: 12, background: '#00FF88', color: '#000', textDecoration: 'none', fontWeight: 900 }}>HUB PRINCIPAL</Link>
          </div>
          <Link to="/hackersdobem" style={{ display: 'block', marginTop: 20, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Sair da Missão</Link>
        </div>

        {/* Modal da Credencial */}
        {showBadge && (
          <div className="hdb-no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30000, padding: 20 }}>
            <div className="hdb-badge-container hdb-badge-print">
              <div className="hdb-badge-head">
                <div style={{ fontSize: 10, letterSpacing: 4, color: '#00FF88', marginBottom: 5 }}>SECURITY CLEARANCE: LEVEL 1</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>AGENTE DE DEFESA INCIDENT RESPONSE</div>
              </div>
              
              <div style={{ display: 'flex', gap: 20, textAlign: 'left', marginBottom: 30 }}>
                <div style={{ width: 100, height: 120, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, borderRadius: 10 }}>📡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>NOME DO AGENTE</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 15 }}>{playerName.toUpperCase()}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>MISSÃO</div>
                  <div style={{ fontSize: 12, color: '#00FF88' }}>MÓDULO 12: INCIDENTS & PROTOCOLS</div>
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
