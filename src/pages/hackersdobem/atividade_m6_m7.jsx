import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUESTIONS_POOL = [
  // M6 - Proteção Web
  {
    type: "choice",
    category: "ATAQUES WEB",
    text: "O ataque onde um invasor intercepta e retransmite dados de comunicação válidos para obter acesso não autorizado é conhecido como:",
    answers: ["SQL Injection", "Replay Attack", "Clickjacking", "SSL Strip"],
    correct: 1,
    feedback: "O Replay Attack (Ataque de Repetição) consiste em capturar uma comunicação legítima e 'repeti-la' para enganar o sistema.",
    points: 5
  },
  {
    type: "choice",
    category: "ATAQUES WEB",
    text: "Qual técnica é usada para representar caracteres especiais em URLs, substituindo-os por '%' seguido de dois dígitos hexadecimais?",
    answers: ["Base64 Encoding", "Percent Encoding", "UTF-8 Masking", "Binary Shifting"],
    correct: 1,
    feedback: "Percent Encoding (ou URL Encoding) é essencial para transmitir caracteres como espaços (%20) ou barras (%2F) de forma segura em URLs.",
    points: 5
  },
  {
    type: "choice",
    category: "API SECURITY",
    text: "Qual destes é um método comum de autenticação em APIs que utiliza uma chave única gerada para o aplicativo?",
    answers: ["RBAC", "API Key", "SSL Strip", "Directory Traversal"],
    correct: 1,
    feedback: "API Keys são tokens simples usados para identificar e autenticar um aplicativo ou usuário que acessa uma API.",
    points: 5
  },
  {
    type: "choice",
    category: "ATAQUES WEB",
    text: "O ataque que mascara itens de uma página real usando uma camada maliciosa invisível por cima para enganar o clique do usuário é o:",
    answers: ["Session Hijacking", "Cross-Site Scripting", "Clickjacking", "CSRF"],
    correct: 2,
    feedback: "Clickjacking (sequestro de clique) engana o usuário fazendo-o clicar em algo diferente do que ele imagina estar vendo.",
    points: 5
  },
  {
    type: "choice",
    category: "PROTEÇÃO WEB",
    text: "Qual mecanismo de segurança (cabeçalho HTTP) informa ao navegador que o site só deve ser acessado via HTTPS?",
    answers: ["X-Frame-Options", "HSTS (Strict Transport Security)", "CORS", "Content-Security-Policy"],
    correct: 1,
    feedback: "O HSTS garante que todas as conexões futuras sejam automaticamente convertidas para HTTPS, prevenindo ataques de SSL Strip.",
    points: 5
  },
  {
    type: "choice",
    category: "INJEÇÃO",
    text: "Para mitigar ataques de SQL Injection, qual é a prática de desenvolvimento MAIS recomendada?",
    answers: ["Esconder as mensagens de erro", "Usar Consultas Parametrizadas (Prepared Statements)", "Limpar o cache do servidor diariamente", "Aumentar o tempo de sessão"],
    correct: 1,
    feedback: "Consultas parametrizadas separam o código SQL dos dados fornecidos pelo usuário, impedindo que comandos maliciosos sejam executados.",
    points: 5
  },
  {
    type: "choice",
    category: "SESSÃO",
    text: "O ataque CSRF (Cross-Site Request Forgery) explora principalmente:",
    answers: ["A senha do usuário", "A confiança que um site tem no navegador de um usuário já autenticado", "Vulnerabilidades no hardware do servidor", "A falta de criptografia no banco de dados"],
    correct: 1,
    feedback: "No CSRF, o atacante induz o navegador da vítima a realizar uma ação indesejada em um site onde ela já possui uma sessão ativa.",
    points: 5
  },
  {
    type: "choice",
    category: "ATAQUES WEB",
    text: "Qual tipo de XSS ocorre quando o script malicioso é armazenado permanentemente no banco de dados do servidor (ex: em um comentário)?",
    answers: ["XSS Refletido", "XSS de DOM", "XSS Armazenado (Stored)", "XSS de Cabeçalho"],
    correct: 2,
    feedback: "O Stored XSS é mais perigoso pois o script malicioso é servido para todos os usuários que acessarem a página comprometida.",
    points: 5
  },
  // M7 - Redundância, Backup e Segurança Física
  {
    type: "choice",
    category: "DISPONIBILIDADE",
    text: "O conceito de manter sistemas duplicados para garantir que o serviço não pare em caso de falha de um componente é chamado de:",
    answers: ["Integridade", "Redundância", "Confidencialidade", "Não-Repúdio"],
    correct: 1,
    feedback: "Redundância é um pilar da Disponibilidade, garantindo que haja um 'plano B' imediato para falhas de hardware ou software.",
    points: 5
  },
  {
    type: "choice",
    category: "BACKUP",
    text: "Qual tipo de backup copia todos os dados alterados desde o ÚLTIMO backup COMPLETO (Full)?",
    answers: ["Backup Incremental", "Backup Diferencial", "Backup Espelhamento", "Backup de Log"],
    correct: 1,
    feedback: "O Backup Diferencial acumula todas as mudanças desde o último Full, facilitando a restauração (Full + Último Diferencial).",
    points: 5
  },
  {
    type: "choice",
    category: "SEGURANÇA FÍSICA",
    text: "Qual técnica de destruição física de dados utiliza campos magnéticos para apagar informações de discos rígidos (HDDs)?",
    answers: ["Shredding (Trituração)", "Degaussing (Desmagnetização)", "Incineration", "Formatting"],
    correct: 1,
    feedback: "O Degaussing neutraliza o campo magnético do disco, tornando os dados irrecuperáveis e o disco muitas vezes inutilizável.",
    points: 5
  },
  {
    type: "choice",
    category: "SEGURANÇA FÍSICA",
    text: "Em um datacenter, qual o objetivo principal de um sistema de contenção de corredores frios/quentes?",
    answers: ["Prevenir incêndios", "Otimizar a eficiência do resfriamento (climatização)", "Controlar a iluminação", "Facilitar o acesso físico dos técnicos"],
    correct: 1,
    feedback: "A separação de fluxos de ar evita que o ar quente exaurido pelos servidores se misture com o ar frio, reduzindo custos de energia.",
    points: 5
  },
  // HANGMAN (Forca)
  {
    type: "hangman",
    category: "TERMO TÉCNICO",
    text: "Ataque onde o invasor assume o controle da sessão de um usuário legítimo.",
    answer: "SESSION HIJACKING",
    feedback: "Session Hijacking (Sequestro de Sessão) permite que o atacante aja como se fosse o usuário logado.",
    points: 10
  },
  {
    type: "hangman",
    category: "PROTEÇÃO",
    text: "Princípio de dar apenas os acessos estritamente necessários ao cargo do usuário.",
    answer: "MENOR PRIVILEGIO",
    feedback: "O Princípio do Menor Privilégio minimiza os danos em caso de comprometimento de uma conta.",
    points: 10
  },
  {
    type: "hangman",
    category: "REDUNDÂNCIA",
    text: "Tecnologia de combinar vários discos rígidos para proteção de dados ou desempenho.",
    answer: "RAID",
    feedback: "RAID (Redundant Array of Independent Disks) é fundamental para servidores e storage.",
    points: 10
  },
  {
    type: "hangman",
    category: "SEGURANÇA FÍSICA",
    text: "Tipo de controle de acesso que usa características físicas (impressão digital, íris).",
    answer: "BIOMETRIA",
    feedback: "Biometria é um dos métodos mais seguros de controle de acesso físico pessoal.",
    points: 10
  },
  // SCRAMBLED (Palavra Embaralhada / Crossword light)
  {
    type: "scrambled",
    category: "API",
    text: "Processo que verifica se o usuário autenticado tem permissão para acessar um recurso.",
    answer: "AUTORIZACAO",
    feedback: "Autenticação verifica QUEM você é; Autorização verifica O QUE você pode fazer.",
    points: 8
  },
  {
    type: "scrambled",
    category: "ATAQUE WEB",
    text: "Inserção de scripts maliciosos em páginas web para execução no navegador da vítima.",
    answer: "CROSS SITE SCRIPTING",
    feedback: "Também conhecido como XSS, é um dos ataques web mais comuns.",
    points: 8
  },
  {
    type: "scrambled",
    category: "DISPONIBILIDADE",
    text: "Cópia de segurança dos dados realizada periodicamente.",
    answer: "BACKUP",
    feedback: "O backup é a última linha de defesa contra perda total de dados.",
    points: 8
  },
  {
    type: "scrambled",
    category: "PROTEÇÃO",
    text: "Técnica de limpar ou remover partes perigosas de uma entrada de dados.",
    answer: "SANITIZACAO",
    feedback: "Sanitizar inputs é crucial para prevenir Injeção e XSS.",
    points: 8
  }
];

const BADGES = [
  { id: 'web_warden', emoji: '🛡️', name: 'Guardião Web', desc: 'Acertou todas de Proteção Web', condition: (s) => s.categories['ATAQUES WEB'] >= 3 },
  { id: 'hardware_hero', emoji: '🏗️', name: 'Herói do Hardware', desc: 'Domina Redundância e Backup', condition: (s) => s.categories['DISPONIBILIDADE'] >= 1 && s.categories['BACKUP'] >= 1 },
  { id: 'hangman_master', emoji: '🪢', name: 'Mestre da Forca', desc: 'Venceu todos os desafios de Forca', condition: (s) => s.types['hangman'] >= 4 },
  { id: 'unscrambler', emoji: '🧩', name: 'Decifrador', desc: 'Resolveu as palavras embaralhadas', condition: (s) => s.types['scrambled'] >= 4 },
  { id: 'time_wizard', emoji: '⏳', name: 'Mago do Tempo', desc: 'Respondeu 3 questões em < 30s', condition: (s) => s.fastAnswers >= 3 },
  { id: 'hdb_certified', emoji: '🎓', name: 'Certificado HDB', desc: 'Completou a Missão M6/M7', condition: (s) => s.finished },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function HangmanGame({ target, onComplete, disabled }) {
  const [guessed, setGuessed] = useState([]);
  const word = target.toUpperCase().replace(/ /g, ' ');
  const letters = word.split('');
  const uniqueLetters = [...new Set(word.replace(/ /g, '').split(''))];
  
  const mistakes = guessed.filter(l => !uniqueLetters.includes(l)).length;
  const maxMistakes = 6;
  const isWon = uniqueLetters.every(l => guessed.includes(l));
  const isLost = mistakes >= maxMistakes;

  useEffect(() => {
    if (isWon) onComplete(true);
    if (isLost) onComplete(false);
  }, [isWon, isLost]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Gallow / Visual */}
      <div style={{ fontFamily: 'monospace', fontSize: 20, color: '#FF5252', lineHeight: 1.2, textAlign: 'left', width: 100 }}>
        <pre>
          {`  +---+ \n  |   | \n  ${mistakes > 0 ? 'O' : ' '}   | \n ${mistakes > 2 ? '/' : ' '}${mistakes > 1 ? '|' : ' '}${mistakes > 3 ? '\\' : ' '}  | \n ${mistakes > 4 ? '/' : ' '} ${mistakes > 5 ? '\\' : ' '}  | \n      | \n=========`}
        </pre>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {letters.map((l, i) => (
          <div key={i} style={{ 
            width: 30, height: 40, borderBottom: l === ' ' ? 'none' : '2px solid #00E676', 
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
          const isCorrect = uniqueLetters.includes(l);
          return (
            <button key={l} onClick={() => !isGuessed && !disabled && setGuessed(g => [...g, l])}
              disabled={isGuessed || isLost || isWon || disabled}
              style={{
                padding: '8px 0', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                background: isGuessed ? (isCorrect ? 'rgba(0,230,118,0.2)' : 'rgba(255,82,82,0.2)') : 'rgba(255,255,255,0.05)',
                color: isGuessed ? (isCorrect ? '#00E676' : '#FF5252') : '#fff',
                fontSize: 12, fontWeight: 700, cursor: isGuessed || disabled ? 'default' : 'pointer'
              }}>{l}</button>
          );
        })}
      </div>
    </div>
  );
}

function ScrambledGame({ target, onComplete, disabled }) {
  const [current, setCurrent] = useState("");
  const isCorrect = current.toUpperCase().replace(/ /g, '') === target.toUpperCase().replace(/ /g, '');

  const scramble = (str) => {
    return str.split('').sort(() => Math.random() - 0.5).join('');
  };

  const [scrambled, setScrambled] = useState(() => scramble(target.replace(/ /g, '')));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>LETRAS DISPONÍVEIS:</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: '#00E5FF', letterSpacing: 4, fontFamily: 'monospace', background: 'rgba(0,229,255,0.1)', padding: '10px 20px', borderRadius: 8 }}>
        {scrambled.toUpperCase()}
      </div>
      
      <input 
        type="text" 
        value={current} 
        onChange={(e) => !disabled && setCurrent(e.target.value.toUpperCase())}
        placeholder="DIGITE A RESPOSTA"
        disabled={disabled}
        style={{
          width: '100%', maxWidth: 300, padding: '12px', borderRadius: 8, border: '1px solid #00E5FF',
          background: 'rgba(255,255,255,0.05)', color: '#fff', textAlign: 'center', fontSize: 18,
          outline: 'none', fontFamily: 'monospace'
        }}
      />
      
      <button onClick={() => onComplete(isCorrect)} disabled={disabled || !current}
        style={{
          padding: '12px 30px', borderRadius: 8, border: 'none', background: '#00E5FF', color: '#000',
          fontWeight: 700, cursor: 'pointer', opacity: disabled || !current ? 0.5 : 1
        }}>VERIFICAR</button>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function AtividadeHDBM6M7() {
  const [screen, setScreen] = useState("intro");
  const [playerName, setPlayerName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [stats, setStats] = useState({ categories: {}, types: {}, fastAnswers: 0, finished: false });
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === "quiz" && !showFeedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleComplete(false);
            return 0;
          }
          return t - 1;
        });
        setDuration(d => d + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, showFeedback]);

  const startChallenge = () => {
    if (!playerName.trim()) return;
    const shuffled = [...QUESTIONS_POOL].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(shuffled);
    setScreen("quiz");
  };

  const handleComplete = (correct) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    
    const q = questions[currentQ];
    const newStats = { ...stats };
    
    if (correct) {
      setScore(s => s + q.points);
      newStats.categories[q.category] = (newStats.categories[q.category] || 0) + 1;
      newStats.types[q.type] = (newStats.types[q.type] || 0) + 1;
      if (timeLeft > 150) newStats.fastAnswers++;
    }

    setStats(newStats);
    checkBadges(newStats);
  };

  const checkBadges = (currentStats) => {
    const newBadges = BADGES.filter(b => !earnedBadges.includes(b.id) && b.condition(currentStats));
    if (newBadges.length > 0) {
      setEarnedBadges(prev => [...prev, ...newBadges.map(b => b.id)]);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(c => c + 1);
      setTimeLeft(180);
      setShowFeedback(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    // 1. Calcular medalhas finais
    const finalStats = { ...stats, finished: true };
    const finalBadges = BADGES.filter(b => b.condition(finalStats)).map(b => b.id);
    
    // 2. Transição imediata
    setScreen("result");
    setEarnedBadges(finalBadges);

    // 3. Salvar no Firebase em background
    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName, 
        score, 
        duration: duration * 1000, 
        timestamp: Date.now(), 
        serverTimestamp: serverTimestamp ? serverTimestamp() : null,
        module: "HDB_M6M7", 
        badges: finalBadges 
      });
    } catch (e) { 
      console.warn("Erro ao salvar no ranking:", e); 
    }
  };

  if (screen === "intro") return (
    <div style={{ minHeight: '100vh', background: '#050A1A', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Rajdhani, sans-serif' }}>
      <div style={{ maxWidth: 500, textAlign: 'center', background: '#0A1628', padding: 40, borderRadius: 16, border: '1px solid #1A3A6E' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🕵️‍♂️</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Missão Hacker do Bem</h1>
        <h2 style={{ fontSize: 16, color: '#00E5FF', letterSpacing: 3, marginBottom: 30 }}>MÓDULO 06 & 07: O DESAFIO FINAL</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 30, lineHeight: 1.6 }}>
          Enfrente 20 desafios aleatórios sobre Proteção Web, Segurança Física e Disponibilidade. Forca, Palavras Embaralhadas e Testes de Conhecimento!
        </p>
        <input 
          type="text" 
          placeholder="SEU NOME DE AGENTE" 
          value={playerName} 
          onChange={e => setPlayerName(e.target.value)}
          style={{ width: '100%', padding: 15, borderRadius: 8, border: '1px solid #1A3A6E', background: '#050A1A', color: '#fff', marginBottom: 20, textAlign: 'center', outline: 'none' }}
        />
        <button 
          onClick={startChallenge}
          style={{ width: '100%', padding: 15, borderRadius: 8, border: 'none', background: '#00E5FF', color: '#000', fontWeight: 900, letterSpacing: 2, cursor: 'pointer' }}
        >INICIAR MISSÃO</button>
        <Link to="/hackersdobem/ranking-m6-m7" style={{ display: 'block', marginTop: 20, color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecoration: 'none' }}>VER RANKING →</Link>
      </div>
    </div>
  );

  if (screen === "quiz") {
    const q = questions[currentQ];
    return (
      <div style={{ minHeight: '100vh', background: '#050A1A', color: '#fff', padding: 20, fontFamily: 'Rajdhani, sans-serif' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Header Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, background: '#0A1628', padding: '15px 20px', borderRadius: 12, border: '1px solid #1A3A6E' }}>
            <div>AGENTE: <span style={{ color: '#00E5FF', fontWeight: 700 }}>{playerName}</span></div>
            <div style={{ color: timeLeft < 30 ? '#FF5252' : '#fff' }}>⏱️ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
            <div>Score: <span style={{ color: '#00FF88', fontWeight: 700 }}>{score}</span></div>
            <div>Q: <span style={{ color: '#FFD600' }}>{currentQ + 1}/20</span></div>
          </div>

          {/* Question Card */}
          <div style={{ background: '#0A1628', padding: 30, borderRadius: 16, border: '1px solid #1A3A6E', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 12, color: '#FFD600', letterSpacing: 2, marginBottom: 10 }}>{q.category} · {q.points} PTS</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 30, lineHeight: 1.4 }}>{q.text}</h3>

            {/* Activity Type Switcher */}
            <div style={{ flex: 1 }}>
              {q.type === "choice" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {q.answers.map((ans, i) => (
                    <button key={i} onClick={() => !showFeedback && handleComplete(i === q.correct)}
                      disabled={showFeedback}
                      style={{
                        padding: 20, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                        background: showFeedback ? (i === q.correct ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.03)') : 'rgba(255,255,255,0.05)',
                        borderColor: showFeedback ? (i === q.correct ? '#00FF88' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.1)',
                        color: '#fff', textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer', fontSize: 16
                      }}>{ans}</button>
                  ))}
                </div>
              )}

              {q.type === "hangman" && <HangmanGame target={q.answer} onComplete={handleComplete} disabled={showFeedback} />}
              
              {q.type === "scrambled" && <ScrambledGame target={q.answer} onComplete={handleComplete} disabled={showFeedback} />}
            </div>

            {/* Feedback & Next */}
            {showFeedback && (
              <div style={{ marginTop: 30, animation: 'fadeIn 0.3s' }}>
                <div style={{ padding: 20, borderRadius: 8, background: isCorrect ? 'rgba(0,255,136,0.05)' : 'rgba(255,82,82,0.05)', borderLeft: `4px solid ${isCorrect ? '#00FF88' : '#FF5252'}`, marginBottom: 20 }}>
                  <div style={{ fontWeight: 900, color: isCorrect ? '#00FF88' : '#FF5252', marginBottom: 5 }}>{isCorrect ? "CORRETO (+"+q.points+" pts)" : "OPS..."}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{q.feedback}</div>
                </div>
                <button onClick={nextQuestion} style={{ width: '100%', padding: 15, borderRadius: 8, border: 'none', background: '#00E5FF', color: '#000', fontWeight: 900, cursor: 'pointer' }}>
                  {currentQ + 1 < questions.length ? "PRÓXIMO DESAFIO →" : "VER RESULTADO FINAL 🏆"}
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
      <div style={{ minHeight: '100vh', background: '#050A1A', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Rajdhani, sans-serif' }}>
        <div style={{ maxWidth: 600, width: '100%', textAlign: 'center', background: '#0A1628', padding: 40, borderRadius: 16, border: '1px solid #1A3A6E' }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 5 }}>MISSÃO CUMPRIDA!</h2>
          <div style={{ fontSize: 14, color: '#00E5FF', letterSpacing: 2, marginBottom: 30 }}>AGENTE: {playerName}</div>
          
          <div style={{ fontSize: 60, fontWeight: 900, color: '#00FF88', marginBottom: 10 }}>{score}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 30 }}>PONTOS TOTAIS</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 40 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>20</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>QUESTÕES</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{Math.floor(duration/60)}m {duration%60}s</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>TEMPO TOTAL</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{earnedBadges.length}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>MEDALHAS</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
            {earnedBadges.map(bid => {
              const b = BADGES.find(x => x.id === bid);
              return (
                <div key={bid} title={b.desc} style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid #00E5FF', padding: '10px 15px', borderRadius: 20, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{b.emoji}</span> {b.name}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => window.location.reload()} style={{ flex: 1, padding: 15, borderRadius: 8, border: '1px solid #1A3A6E', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>REPETIR</button>
            <Link to="/hackersdobem/ranking-m6-m7" style={{ flex: 1, padding: 15, borderRadius: 8, background: '#00E5FF', color: '#000', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>VER RANKING →</Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
