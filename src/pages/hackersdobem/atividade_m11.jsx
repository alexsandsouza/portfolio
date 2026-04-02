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
  // M11 - Segurança em Redes e Equipamentos
  {
    type: "choice",
    category: "FUNDAMENTOS",
    text: "Qual protocolo atua associando um endereço IP a um endereço MAC?",
    answers: ["ARP (Address Resolution Protocol)", "STP (Spanning Tree Protocol)", "DHCP", "DNS"],
    correct: 0,
    feedback: "O ARP opera na camada 2 associando endereços IP a endereços MAC de forma que o switch saiba para onde encaminhar fisicamente os quadros.",
    points: 5
  },
  {
    type: "choice",
    category: "ARQUITETURA",
    text: "Para separar o tráfego de servidores web acessíveis publicamente da rede interna, um administrador deve implementar:",
    answers: ["Intranet isolada e protegida", "Zonas Desmilitarizadas (DMZ)", "Filtro de Conteúdo em roteador", "Segmentação de VLANs temporárias"],
    correct: 1,
    feedback: "A DMZ é uma área isolada, intermediária entre a rede interna e a externa (Internet), fornecendo segurança contra acessos diretos.",
    points: 5
  },
  {
    type: "choice",
    category: "ARQUITETURA",
    text: "No tráfego de um datacenter, os servidores estão realizando intensa troca de informações na rede interna. Como é classificado esse tipo de tráfego?",
    answers: ["Tráfego Norte-Sul", "Tráfego Leste-Oeste", "Tráfego DMZ-Intranet", "Tráfego Bridge-Router"],
    correct: 1,
    feedback: "Comunicação interna entre dispositivos no mesmo datacenter é classificada como tráfego Leste-Oeste.",
    points: 5
  },
  {
    type: "choice",
    category: "ARQUITETURA",
    text: "O modelo de segurança que redefine a proteção abolindo a 'confiança implícita' para dispositivos, exigindo verificação contínua, é:",
    answers: ["Defesa em Profundidade", "Segurança de Perímetro", "Controle baseado em Porta (PNAC)", "Zero Trust (Confiança Zero)"],
    correct: 3,
    feedback: "Para o Zero Trust nenhum dispositivo ou usuário é confiável por padrão, mesmo que já esteja dentro do perímetro.",
    points: 5
  },
  {
    type: "choice",
    category: "ATAQUES",
    text: "Um atacante tentou enviar diversas informações falsas a um switch, visando inundar sua tabela MAC e transformá-lo num 'hub'. Que ataque é esse?",
    answers: ["DHCP Spoofing", "MAC Flooding para interceptação (Sniffing)", "IP Spoofing", "MAC Flooding para ataque DDoS"],
    correct: 1,
    feedback: "MAC Flooding inunda a MAC Table do switch, forçando-o a retransmitir pacotes para todas as portas, tornando possível interceptar tráfego (Sniffing).",
    points: 5
  },
  {
    type: "choice",
    category: "EQUIPAMENTOS",
    text: "Qual funcionalidade previne a formação de loops indevidos caso switches não autorizados ou falsos BPDUs sejam conectados em portas de acesso?",
    answers: ["Port-Security", "DHCP Snooping", "Root Guard", "BPDU Guard"],
    correct: 3,
    feedback: "O BPDU Guard desliga imediatamente a porta caso receba BPDUs, prevenindo extensões acidentais ou intencionais do STP.",
    points: 5
  },
  {
    type: "choice",
    category: "EQUIPAMENTOS",
    text: "Qual técnica de segurança deve estar ativa nos switches para mitigar o fornecimento de IPs por um servidor DHCP falso?",
    answers: ["MAC Filtering", "DHCP Snooping", "Port-Security", "PNAC 802.1X"],
    correct: 1,
    feedback: "O DHCP Snooping confia apenas em portas específicas predefinidas para aceitar respostas (OFFER) de DHCP.",
    points: 5
  },
  {
    type: "choice",
    category: "FUNDAMENTOS",
    text: "Que recurso é utilizado para priorizar e classificar tráfegos críticos (como VoIP) garantindo sua entrega sem alta latência?",
    answers: ["Quality of Service (QoS)", "Balanceamento de Carga", "Clustering", "Port Mirroring"],
    correct: 0,
    feedback: "O QoS gerencia as filas para dar prioridade de banda, evitando atrasos que degradariam chamadas de voz ou vídeo.",
    points: 5
  },
  {
    type: "choice",
    category: "MONITORAMENTO",
    text: "Qual tipo de detecção num sistema IPS identificaria um ataque '0-day' recém lançado, sem precisar atualizar vacinas de assinatura?",
    answers: ["Anomaly-Based Detection", "Signature-Based Detection", "Heuristic Firewalling", "Behavior Authentication"],
    correct: 0,
    feedback: "A detecção por Anomalias constrói modelos normais (baselines) e percebe os desvios, flagrando 0-days nunca vistos.",
    points: 5
  },
  {
    type: "choice",
    category: "EQUIPAMENTOS",
    text: "Qual Network TAP copia e regenera pacotes eletronicamente, mas exige fonte de energia, podendo derrubar o link em caso de apagão físico sem failover?",
    answers: ["TAP Passivo", "SPAN via Software", "Port Mirror", "TAP Ativo"],
    correct: 3,
    feedback: "O TAP Ativo requer eletricidade para regenerar o sinal da comunicação em linha. Se falhar e não houver bypass, o tráfego é cortado.",
    points: 5
  },
  {
    type: "choice",
    category: "EQUIPAMENTOS",
    text: "Ferramenta implementada no gateway que faz inspeção e interceptação SSL/TLS e bloqueio avançado focado na navegação web de usuários corporativos:",
    answers: ["SWG (Secure Web Gateway)", "UTM (Unified Threat Management)", "Filtro de Conteúdo de Switch", "HIPS"],
    correct: 0,
    feedback: "O Secure Web Gateway é focado na navegação HTTPS/HTTP, com poder de análise profunda, filtragem web avançada e desofuscação.",
    points: 5
  },
  {
    type: "choice",
    category: "MONITORAMENTO",
    text: "Qual a diferença central de alvo direto entre NIDS e HIDS?",
    answers: ["Ambos monitoram assinaturas no antivírus.", "NIDS monitora pacotes em tráfego de rede (Switch/Core); HIDS monitora eventos dentro do SO.", "HIDS analisa tráfego comutado no switch.", "NIDS atua só bloqueando, HIDS só alertando."],
    correct: 1,
    feedback: "O 'Network-based' foca no fluxo de dados espelhado na rede toda. O 'Host-based' atua local em cima do kernel e eventos desse único endpoint.",
    points: 5
  },
  {
    type: "choice",
    category: "EQUIPAMENTOS",
    text: "Dispositivo 'tudo-em-um' com Firewall, IPS, VPN e Antivírus consolidado, muito amado por PMEs pela centralização:",
    answers: ["UEBA", "Clustering Ativo", "UTM (Unified Threat Management)", "Next-Gen Router"],
    correct: 2,
    feedback: "O Gerenciamento Unificado de Ameaças (UTM) agrupa várias ferramentas de proteção de perímetro numa caixa gerencial única.",
    points: 5
  },
  {
    type: "choice",
    category: "EQUIPAMENTOS",
    text: "Qual padrão e ferramenta aplica verificação e autenticação na própria porta do switch para permitir ou não acesso de dispositivos à infraestrutura?",
    answers: ["Filtragem de MAC", "IP Spoofing Check", "PNAC (Port-Based Network Access Control - IEEE 802.1x)", "QoS Restritivo"],
    correct: 2,
    feedback: "O 802.1X (PNAC) forçará o supplicant/cliente a provar quem é para o switch repassar log via RADIUS antes de dar acesso Layer 2.",
    points: 5
  },
  {
    type: "choice",
    category: "MONITORAMENTO",
    text: "Sistema de Machine Learning que avalia o 'padrão de ações' e anomalias individuais ligadas a sessões executivas e insiders:",
    answers: ["UEBA (User and Entity Behavior Analytics)", "Network TAP", "Anti-Bot Cloud", "Firewall de Estado (Stateful)"],
    correct: 0,
    feedback: "O UEBA é uma evolução em SIEM que compreende a rotina normal do usuário XYZ, e alarma se hoje ele logar às 3AM tentando baixar 10 GB de dados confidenciais.",
    points: 5
  },
  {
    type: "hangman",
    category: "ARQUITETURA",
    text: "Modelo de segurança que não confia em absolutamente nada por padrão, nem interno.",
    answer: "ZERO TRUST",
    feedback: "Confiança Zero — Validação contínua mesmo depois do login.",
    points: 10
  },
  {
    type: "hangman",
    category: "MONITORAMENTO",
    text: "Sistema local focado em alertar e monitorar modificação no Sistema Operacional, não na rede visível.",
    answer: "HIDS",
    feedback: "O Host-Based Intrusion Detection System não afeta comunicação Layer 2, olha arquivos locais e processos OS.",
    points: 10
  },
  {
    type: "hangman",
    category: "EQUIPAMENTOS",
    text: "Mecanismo que duplica o tráfego de um switch para uma porta analítica sem hardware físico intermediário.",
    answer: "PORT MIRRORING",
    feedback: "Também conhecido como SPAN, clona tudo software-based de uma porta X para a porta Y onde um Sniffer ou IDS está.",
    points: 10
  },
  {
    type: "scrambled",
    category: "ATAQUES",
    text: "Ação de assumir ilegalmente um endereço na rede local alterando falsamente respostas do mac layer.",
    answer: "SPOOFING",
    feedback: "Spoofing significa enganar e falsificar tráfego, seja ARP ou DHCP, para se passar por outro.",
    points: 8
  },
  {
    type: "scrambled",
    category: "MONITORAMENTO",
    text: "Processo em aprendizado de máquina onde criamos um perfil base normal para só assim julgar anomalias.",
    answer: "BASELINE",
    feedback: "Sistemas Anomaly-Based precisam de um 'baseline' (linha de base normal da rede) antes de detectar desvios.",
    points: 8
  }
];

const BADGES = [
  { id: 'net_architect', emoji: '📐', name: 'Arquiteto de Redes', desc: 'Compreende segmentação e arquitetura.', condition: (s) => s.categories['ARQUITETURA'] >= 2 },
  { id: 'packet_inspector', emoji: '🔎', name: 'Inspetor de Pacote', desc: 'Sabe como TAPs e SPANs e monitoramentos atuam.', condition: (s) => s.categories['MONITORAMENTO'] >= 2 },
  { id: 'firewall_ninja', emoji: '🧱', name: 'Ninja Equipamentos', desc: 'Domina técnicas de mitigações de switch e gates.', condition: (s) => s.categories['EQUIPAMENTOS'] >= 2 },
  { id: 'hangman_pro', emoji: '🪢', name: 'Mestre da Forca', desc: 'Venceu 3 desafios de Forca', condition: (s) => s.types['hangman'] >= 3 },
  { id: 'unscrambler', emoji: '🧩', name: 'Decifrador', desc: 'Resolveu os enigmas de palavras de rede.', condition: (s) => s.types['scrambled'] >= 2 },
  { id: 'net_certified', emoji: '🏅', name: 'Network Certified', desc: 'Completou a Missão de Tráfego de Redes.', condition: (s) => s.finished },
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
      {/* Forca ASCII com cores azuis/cyans pro módulo 11 */}
      <div style={{ fontFamily: 'monospace', fontSize: 20, color: '#FF5252', lineHeight: 1.2, textAlign: 'left', width: 100 }}>
        <pre>
          {`  +---+ \n  |   | \n  ${mistakes > 0 ? 'O' : ' '}   | \n ${mistakes > 2 ? '/' : ' '}${mistakes > 1 ? '|' : ' '}${mistakes > 3 ? '\\' : ' '}  | \n ${mistakes > 4 ? '/' : ' '} ${mistakes > 5 ? '\\' : ' '}  | \n      | \n=========`}
        </pre>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {letters.map((l, i) => (
          <div key={i} style={{ 
            width: l === ' ' ? 20 : 30, height: 40, borderBottom: l === ' ' ? 'none' : '2px solid #00E5FF', 
            fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: guessed.includes(l) || isLost ? (uniqueLetters.includes(l) ? '#00E5FF' : '#FF5252') : 'transparent'
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
                background: isGuessed ? (uniqueLetters.includes(l) ? 'rgba(0,229,255,0.2)' : 'rgba(255,82,82,0.2)') : 'rgba(255,255,255,0.05)',
                color: isGuessed ? (uniqueLetters.includes(l) ? '#00E5FF' : '#FF5252') : '#fff',
                fontSize: 12, fontWeight: 700, cursor: isGuessed || disabled ? 'default' : 'pointer', transition: 'all 0.2s'
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
      <div style={{ letterSpacing: 8, fontSize: 32, fontWeight: 900, color: '#00E5FF', marginBottom: 20 }}>{scrambled}</div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} disabled={disabled}
        placeholder="DECIFRE A PALAVRA..."
        style={{ width: '100%', padding: 15, borderRadius: 10, background: '#0A0A0F', border: '1px solid #333', color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 700 }} />
    </form>
  );
}

export default function AtividadeHDBM11() {
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
  const [showBadge, setShowBadge] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === "quiz" && !showFeedback) { // Pausa o timer enquanto o feedback está visível
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
  }, [screen, showFeedback]);

  const startChallenge = () => {
    if (!playerName.trim()) return;
    setScreen("bypass");
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(`Bem vindo Agente ${playerName}. Iniciando verificação de tráfego.`);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
      }
    } catch (e) {
      console.warn("Voz não suportada.");
    }
  };

  const onBypassComplete = () => {
    // 20 questions based on pool.
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
    saveProgress("HDB_M11", finalBadges, score);
    playBadge();

    try {
      const entry = {
        name: playerName,
        score,
        duration: duration * 1000,
        module: "M11",
        badges: finalBadges,
        timestamp: serverTimestamp()
      };
      // A coleção do M11 está no fametro_ranking e sendo filtrada em ranking_m11 pelo attr module: "M11"
      await addDoc(collection(db, "fametro_ranking"), entry);
    } catch (err) {
      console.warn("Ranking Error:", err);
    }
  };

  if (screen === "intro") return (
    <div className="hdb-scanlines" style={{ minHeight: '100vh', background: '#050a1a', color: '#e0f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'var(--hdb-main-font)' }}>
      <div className="hdb-card" style={{ maxWidth: 500, textAlign: 'center', background: '#0a1628', padding: 40, borderRadius: 20, border: '1px solid #1a3a6e', boxShadow: '0 20px 50px rgba(0, 229, 255, 0.15)' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🌐</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Net & SOC Challenge</h1>
        <h2 style={{ fontSize: 13, color: '#00E5FF', letterSpacing: 3, marginBottom: 30, fontWeight: 700 }}>MÓDULO 11 · SEGURANÇA EM REDES</h2>
        <p className="hdb-high-contrast" style={{ marginBottom: 35, lineHeight: 1.6, fontSize: 16 }}>
          Proteja o tráfego da empresa! Realize 20 inspeções profundas abrangendo Zero Trust, QoS, IDS/IPS de rede e detecção via Anomalias (UEBA).
        </p>
        <input type="text" placeholder="ID DO ESPECIALISTA SOC" value={playerName} onChange={e => setPlayerName(e.target.value)}
          style={{ width: '100%', padding: 15, borderRadius: 10, border: '1px solid #1a3a6e', background: '#050a1a', color: '#00E5FF', marginBottom: 20, textAlign: 'center', fontSize: 16 }} />
        <button onClick={startChallenge}
          style={{ width: '100%', padding: 18, borderRadius: 10, border: 'none', background: '#00E5FF', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>INICIAR ANÁLISE DE BORDAS</button>
        <Link to="/hackersdobem/ranking-m11" style={{ display: 'block', marginTop: 20, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 12 }}>RANKING M11 →</Link>
      </div>
    </div>
  );

  if (screen === "quiz") {
    const q = questions[currentQ];
    return (
      <div className="hdb-scanlines" style={{ minHeight: '100vh', background: '#050a1a', color: '#e0f0ff', padding: '100px 20px', fontFamily: 'var(--hdb-main-font)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, background: '#0a1628', padding: '15px 25px', borderRadius: 15, border: '1px solid #1a3a6e' }}>
            <div style={{ color: '#00E5FF', fontWeight: 700 }}>{playerName}</div>
            <div style={{ color: timeLeft < 30 ? '#FF5252' : '#FFD600', fontFamily: 'monospace', fontWeight: 700 }}>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
            <div style={{ fontWeight: 700 }}>Score: {score}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)' }}>{currentQ + 1}/20</div>
          </div>
          <div className="hdb-card" style={{ background: '#0a1628', padding: 40, borderRadius: 24, border: '1px solid #1a3a6e', minHeight: 450, display: 'flex', flexDirection: 'column', boxShadow: '0 0 40px rgba(0, 229, 255, 0.05)' }}>
            <div style={{ fontSize: 11, color: '#00E5FF', letterSpacing: 3, marginBottom: 15 }}>{q.category} · {q.points} PTS</div>
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
                        background: showFeedback ? (i === q.correct ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.02)') : 'rgba(255,255,255,0.03)',
                        borderColor: showFeedback ? (i === q.correct ? '#00E5FF' : 'rgba(255,82,82,0.5)') : 'rgba(255,255,255,0.05)',
                        color: showFeedback && i === q.correct ? '#00E5FF' : '#eee', textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer', fontSize: 15, transition: 'all 0.2s'
                      }}>{ans}</button>
                  ))}
                </div>
              )}
              {q.type === "hangman" && <HangmanGame target={q.answer} onComplete={handleComplete} disabled={showFeedback} />}
              {q.type === "scrambled" && <ScrambledGame target={q.answer} onComplete={handleComplete} disabled={showFeedback} />}
            </div>
            {showFeedback && (
              <div style={{ marginTop: 40, animation: 'fadeIn 0.4s' }}>
                <div style={{ padding: 25, borderRadius: 15, background: isCorrect ? 'rgba(0, 229, 255, 0.05)' : 'rgba(255,82,82,0.03)', borderLeft: `5px solid ${isCorrect ? '#00E5FF' : '#FF5252'}`, marginBottom: 25 }}>
                  <div style={{ fontWeight: 900, color: isCorrect ? '#00E5FF' : '#FF5252', fontSize: 18, marginBottom: 8 }}>{isCorrect ? "INSPEÇÃO COM SUCESSO (+"+q.points+" pts)" : "VULNERABILIDADE NÃO CONTIDA"}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{q.feedback}</div>
                </div>
                <button onClick={nextQuestion} style={{ width: '100%', padding: 20, borderRadius: 12, border: 'none', background: '#00E5FF', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 229, 255, 0.2)' }}>
                  {currentQ + 1 < questions.length ? "PRÓXIMO TRÁFEGO →" : "ENCERRAR EXPERIÊNCIA 🏆"}
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
      <div className="hdb-scanlines" style={{ minHeight: '100vh', background: '#050a1a', color: '#e0f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'var(--hdb-main-font)' }}>
        <div className="hdb-card" style={{ maxWidth: 650, width: '100%', textAlign: 'center', background: '#0a1628', padding: 50, borderRadius: 30, border: '1px solid #1a3a6e', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
          <div style={{ fontSize: 90, marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>PONTUAÇÃO DE DEFESA 11</h2>
          <div style={{ fontSize: 80, fontWeight: 900, color: '#00E5FF', textShadow: '0 0 30px rgba(0, 229, 255, 0.4)', lineHeight: 1 }}>{score}</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', margin: '20px 0 40px', letterSpacing: 4 }}>AGENTE {playerName.toUpperCase()}</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 40 }}>
            <div style={{ background: '#050a1a', padding: 20, borderRadius: 15, border: '1px solid #1a3a6e' }}><div style={{ fontSize: 24, fontWeight: 700 }}>20</div><div style={{ fontSize: 11, color: '#666' }}>MÁQUINAS AVALIADAS</div></div>
            <div style={{ background: '#050a1a', padding: 20, borderRadius: 15, border: '1px solid #1a3a6e' }}><div style={{ fontSize: 24, fontWeight: 700 }}>{Math.floor(duration/60)}:{String(duration%60).padStart(2,'0')}</div><div style={{ fontSize: 11, color: '#666' }}>TEMPO</div></div>
            <div style={{ background: '#050a1a', padding: 20, borderRadius: 15, border: '1px solid #1a3a6e' }}><div style={{ fontSize: 24, fontWeight: 700 }}>{earnedBadges.length}</div><div style={{ fontSize: 11, color: '#666' }}>BADGES</div></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 50 }}>
            {earnedBadges.map(bid => {
              const b = BADGES.find(x => x.id === bid);
              if (!b) return null;
              return <div key={bid} title={b.desc} style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', border: '1px solid rgba(0, 229, 255, 0.3)', padding: '10px 20px', borderRadius: 30, fontSize: 12, fontWeight: 700 }}>{b.emoji} {b.name}</div>
            })}
          </div>

          <div style={{ display: 'flex', gap: 15 }}>
            <button onClick={() => setShowBadge(true)} style={{ flex: 1, padding: 20, borderRadius: 12, background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', border: '1px solid #00E5FF', fontWeight: 900, cursor: 'pointer' }}>GERAR CREDENCIAL</button>
            <Link to="/hackersdobem/ranking-m11" style={{ flex: 1, padding: 20, borderRadius: 12, background: '#00E5FF', color: '#000', textDecoration: 'none', fontWeight: 900 }}>RANKING M11</Link>
          </div>
          <Link to="/hackersdobem" style={{ display: 'block', marginTop: 20, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Sair do NOC HUB</Link>
        </div>

        {/* Modal da Credencial */}
        {showBadge && (
          <div className="hdb-no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30000, padding: 20 }}>
            <div className="hdb-badge-container hdb-badge-print">
              <div className="hdb-badge-head" style={{ background: 'linear-gradient(135deg, #004d4d, #001a1a)', borderBottom: '3px solid #00E5FF' }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: '#00E5FF', marginBottom: 5 }}>SECURITY CLEARANCE: LEVEL 2</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>AGENTE DE REDES</div>
              </div>
              
              <div style={{ display: 'flex', gap: 20, textAlign: 'left', marginBottom: 30 }}>
                <div style={{ width: 100, height: 120, background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, borderRadius: 10 }}>📡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>NOME DO AGENTE</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 15 }}>{playerName.toUpperCase()}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>MISSÃO</div>
                  <div style={{ fontSize: 12, color: '#00E5FF' }}>MÓDULO 11: NETWORK SECURITY</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 30 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>SCORE TOTAL</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#00E5FF' }}>{score}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>QUALIFICAÇÃO</div>
                  <div style={{ fontSize: 14, fontWeight: 900, marginTop: 5 }}>APROVADO</div>
                </div>
              </div>

              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>CONQUISTAS DE REDE</div>
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
      <div style={{ height: '100vh', background: '#050a1a' }}>
        <HDBTerminalLoader 
          onComplete={onBypassComplete} 
          message={`AUTENTICANDO ANALISTA: ${playerName.toUpperCase()}...`} 
        />
      </div>
    );
  }

  return null;
}
