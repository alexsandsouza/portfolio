import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ============================================================
//  QUESTION BANK – 15 Gerenciamento de E/S questions
// ============================================================
const QUESTION_BANK = [
  {
    id: 1,
    level: "Nível 1 — Iniciante",
    scenario: "Um estudante percebe que ao salvar um arquivo, o HD parece trabalhar com pedaços de tamanho fixo, enquanto o teclado envia dados conforme cada tecla é pressionada.",
    text: "Qual tipo de dispositivo armazena dados em blocos de tamanho fixo, cada um com seu próprio endereço, permitindo leitura e escrita independente?",
    options: [
      { letter: "A", text: "Dispositivos de Caracteres" },
      { letter: "B", text: "Dispositivos de Blocos" },
      { letter: "C", text: "Dispositivos de Fluxo Contínuo" },
      { letter: "D", text: "Dispositivos de Endereçamento Virtual" },
    ],
    correct: 1,
    explanation: "Dispositivos de blocos (como discos rígidos e SSDs) armazenam dados em blocos de tamanho fixo com endereços próprios, permitindo acesso aleatório e independente a cada bloco."
  },
  {
    id: 2,
    level: "Nível 1 — Iniciante",
    scenario: "Ao conectar um mouse e um teclado a um novo computador, o sistema os identifica como dispositivos que enviam um fluxo de dados sem endereçamento.",
    text: "Mouses, teclados e placas de rede são exemplos de qual categoria de dispositivos?",
    options: [
      { letter: "A", text: "Dispositivos de Blocos" },
      { letter: "B", text: "Dispositivos de Caracteres" },
      { letter: "C", text: "Dispositivos de Memória Direta" },
      { letter: "D", text: "Dispositivos de Interrupção Fixa" },
    ],
    correct: 1,
    explanation: "Dispositivos de caracteres não possuem endereçamento de blocos; eles transmitem ou recebem apenas um fluxo de caracteres sequencialmente."
  },
  {
    id: 3,
    level: "Nível 2 — Básico",
    scenario: "Em um sistema operacional antigo, a CPU inicia uma leitura de disco e fica em um loop repetitivo verificando se o dado já chegou, sem fazer mais nada.",
    text: "Qual é o nome técnico desse mecanismo de espera ocupada da CPU?",
    options: [
      { letter: "A", text: "DMA (Direct Memory Access)" },
      { letter: "B", text: "Interrupção de Hardware" },
      { letter: "C", text: "Polling ou Busy Wait" },
      { letter: "D", text: "Escalonamento de Processos" },
    ],
    correct: 2,
    explanation: "Polling (ou busy wait) ocorre quando a CPU fica em um processo repetitivo de teste, verificando a cada instante se a operação de E/S foi concluída, o que gera desperdício de processamento."
  },
  {
    id: 4,
    level: "Nível 2 — Básico",
    scenario: "Para evitar o desperdício de tempo do polling, a arquitetura de computadores evoluiu para permitir que o hardware avise a CPU quando terminar uma tarefa.",
    text: "Qual mecanismo permite que a CPU inicie uma operação de E/S, execute outras tarefas e seja notificada apenas quando o dado estiver pronto?",
    options: [
      { letter: "A", text: "Interrupção" },
      { letter: "B", text: "Polling Circular" },
      { letter: "C", text: "Acesso Sequencial" },
      { letter: "D", text: "Tradução de Endereços" },
    ],
    correct: 0,
    explanation: "No esquema de interrupção, a controladora sinaliza a CPU quando a ação termina, permitindo que o processador execute outros comandos enquanto espera."
  },
  {
    id: 5,
    level: "Nível 3 — Intermediário",
    scenario: "Um usuário conecta uma impressora nova que utiliza um protocolo de comunicação tailandês, mas o sistema operacional só entende 'português'.",
    text: "Qual módulo do Sistema Operacional atua como o 'intérprete' específico que traduz as solicitações do SO para uma linguagem que a controladora do hardware entenda?",
    options: [
      { letter: "A", text: "Kernel" },
      { letter: "B", text: "Shell" },
      { letter: "C", text: "Driver de Dispositivo" },
      { letter: "D", text: "BIOS/UEFI" },
    ],
    correct: 2,
    explanation: "O driver de dispositivo é o módulo do SO que serve como ponte de comunicação, traduzindo as solicitações genéricas do sistema para comandos específicos reconhecidos pelas controladoras de hardware."
  },
  {
    id: 6,
    level: "Nível 3 — Intermediário",
    scenario: "Durante o desenvolvimento de um sistema, a equipe percebe que precisa de softwares diferentes para cada marca de placa de vídeo do mercado.",
    text: "Por que o desenvolvimento de drivers é considerado uma tarefa complexa na engenharia de sistemas?",
    options: [
      { letter: "A", text: "Porque eles são genéricos demais e funcionam em qualquer hardware." },
      { letter: "B", text: "Porque devem conter informações muito específicas sobre o funcionamento interno de cada modelo de hardware." },
      { letter: "C", text: "Porque os drivers substituem a necessidade de placas controladoras." },
      { letter: "D", text: "Porque os drivers são responsáveis apenas pela interface visual do usuário." },
    ],
    correct: 1,
    explanation: "Drivers são complexos porque lidam com as particularidades de cada hardware, traduzindo comandos do SO para registros e regras específicas de cada controladora."
  },
  {
    id: 7,
    level: "Nível 4 — Avançado",
    scenario: "A CPU precisa carregar um filme de 4GB do SSD para a memória RAM. Se ela tivesse que mover cada byte individualmente, ficaria sobrecarregada.",
    text: "Qual técnica permite que a controladora transfira grandes volumes de dados diretamente para a memória principal sem intervenção constante da CPU?",
    options: [
      { letter: "A", text: "Polling Avançado" },
      { letter: "B", text: "DMA (Direct Memory Access)" },
      { letter: "C", text: "Memória Virtual" },
      { letter: "D", text: "Pipeline de Instruções" },
    ],
    correct: 1,
    explanation: "O DMA (Acesso Direto à Memória) permite que as controladoras acessem diretamente a memória principal para transferência de dados, liberando a CPU para realizar outros processamentos."
  },
  {
    id: 8,
    level: "Nível 4 — Avançado",
    scenario: "Em uma transferência via DMA, a CPU inicia o processo informando o endereço de origem e destino, e então vai realizar outros cálculos.",
    text: "Como o driver do periférico avisa a CPU que todo o processo de transferência para a memória foi concluído?",
    options: [
      { letter: "A", text: "Enviando um sinal de interrupção." },
      { letter: "B", text: "Alterando um valor na BIOS." },
      { letter: "C", text: "Reiniciando o barramento." },
      { letter: "D", text: "Aguardando um novo ciclo de polling." },
    ],
    correct: 0,
    explanation: "Quando o controlador DMA termina a transferência, ele envia uma interrupção para a CPU informar que o dado já está na memória e pronto para processamento."
  },
  {
    id: 9,
    level: "Nível 5 — Especialista",
    scenario: "Um arquiteto de SO estuda formas de reduzir a perda de tempo entre dois testes de verificação de hardware em sistemas embarcados simples.",
    text: "A técnica de 'verificar o dispositivo a intervalos regulares' para aproveitar o tempo entre testes, embora ainda gere perdas, é uma evolução do busy wait conhecida como:",
    options: [
      { letter: "A", text: "Escalonamento Round-robin" },
      { letter: "B", text: "Polling" },
      { letter: "C", text: "Multiprocessamento Simétrico" },
      { letter: "D", text: "Swapping" },
    ],
    correct: 1,
    explanation: "O polling é a técnica de verificar periodicamente o estado do dispositivo. É uma evolução do busy wait contínuo, mas ainda consome ciclos de CPU desnecessários se comparado a interrupções."
  },
  {
    id: 10,
    level: "Nível 2 — Básico",
    scenario: "Ao analisar a arquitetura de um HD, nota-se que ele pode entregar qualquer setor solicitado, sem precisar ler o disco desde o início.",
    text: "Qual característica dos dispositivos de blocos permite que eles sejam lidos ou gravados independentemente dos demais?",
    options: [
      { letter: "A", text: "O uso de endereços exclusivos para cada bloco." },
      { letter: "B", text: "O fato de serem dispositivos apenas de leitura." },
      { letter: "C", text: "A ausência de partes móveis em SSDs." },
      { letter: "D", text: "A conexão via cabo USB." },
    ],
    correct: 0,
    explanation: "A característica geral de dispositivos de blocos é que cada bloco tem seu próprio endereço, o que permite que sejam lidos ou gravados de forma independente e aleatória."
  },
  {
    id: 11,
    level: "Nível 1 — Iniciante",
    scenario: "Um técnico de hardware está separando peças e precisa classificar os discos de armazenamento (HDs e SSDs).",
    text: "Os discos de armazenamento são os exemplos mais comuns de:",
    options: [
      { letter: "A", text: "Dispositivos de Caracteres" },
      { letter: "B", text: "Dispositivos de Blocos" },
      { letter: "C", text: "Dispositivos de Barramento Único" },
      { letter: "D", text: "Dispositivos de Fluxo Serial" },
    ],
    correct: 1,
    explanation: "Discos são os exemplos clássicos de dispositivos de blocos devido à sua estrutura de armazenamento endereçável."
  },
  {
    id: 12,
    level: "Nível 3 — Intermediário",
    scenario: "Você comprou um scanner novo e, ao conectá-lo, o Windows avisa que não consegue se comunicar com ele até que um software específico seja instalado.",
    text: "Onde o Sistema Operacional costuma buscar drivers de dispositivos se eles não vierem pré-instalados?",
    options: [
      { letter: "A", text: "Diretamente no hardware físico do scanner." },
      { letter: "B", text: "Na memória RAM do computador." },
      { letter: "C", text: "Pela internet (site do fabricante) ou mídias como CDs." },
      { letter: "D", text: "No arquivo de texto 'Config.sys' do DOS." },
    ],
    correct: 2,
    explanation: "Drivers podem vir pré-instalados, mas frequentemente exigem download da internet ou instalação via mídia externa fornecida pelo fabricante."
  },
  {
    id: 13,
    level: "Nível 4 — Avançado",
    scenario: "A CPU envia um comando para a controladora: 'Leia o setor 10 do disco e coloque-o na memória'.",
    text: "No modelo de interrupção, o que a CPU faz IMEDIATAMENTE após dar esse comando à controladora?",
    options: [
      { letter: "A", text: "Fica travada aguardando o dado chegar." },
      { letter: "B", text: "Segue executando sua próxima tarefa (outros comandos)." },
      { letter: "C", text: "Desliga o barramento de dados para economizar energia." },
      { letter: "D", text: "Limpa todos os registros da memória cache." },
    ],
    correct: 1,
    explanation: "No esquema de interrupção, a CPU aciona a instrução de E/S e segue executando sua próxima tarefa, sendo interrompida apenas quando o resultado estiver pronto."
  },
  {
    id: 14,
    level: "Nível 5 — Especialista",
    scenario: "Um sistema de alta performance gerencia milhares de entradas e saídas por segundo usando DMA.",
    text: "Qual é a principal economia gerada pelo DMA em comparação à transferência controlada diretamente pela CPU (Programmed I/O)?",
    options: [
      { letter: "A", text: "Economia de espaço físico no gabinete." },
      { letter: "B", text: "Redução do número de interrupções por byte transferido." },
      { letter: "C", text: "Eliminação total do uso de drivers de dispositivo." },
      { letter: "D", text: "Aumento da velocidade de rotação dos discos rígidos." },
    ],
    correct: 1,
    explanation: "O DMA reduz drasticamente a carga sobre a CPU ao transferir grandes blocos de dados de uma só vez, gerando apenas uma interrupção ao final de toda a transferência de bloco, em vez de uma por palavra/byte."
  },
  {
    id: 15,
    level: "Nível 3 — Intermediário",
    scenario: "Um sistema operacional moderno tenta gerenciar um mouse, uma impressora térmica e um terminal de texto ao mesmo tempo.",
    text: "Qual componente de hardware é responsável por receber os sinais elétricos brutos do periférico e convertê-los em algo que o driver (software) consiga entender?",
    options: [
      { letter: "A", text: "Processador (CPU)" },
      { letter: "B", text: "Controladora do Dispositivo" },
      { letter: "C", text: "Unidade de Lógica e Aritmética" },
      { letter: "D", text: "Pente de Memória RAM" },
    ],
    correct: 1,
    explanation: "A controladora é a parte eletrônica (hardware) que atua diretamente no dispositivo e conversa com o driver do sistema operacional."
  }
];

// Prize ladder
const PRIZES = [
  { q: 1, pts: 10, label: "Aprendiz", milestone: false },
  { q: 2, pts: 25, label: "Técnico", milestone: false },
  { q: 3, pts: 50, label: "Operador", milestone: true },
  { q: 4, pts: 100, label: "Analista", milestone: false },
  { q: 5, pts: 250, label: "Arquiteto", milestone: true },
  { q: 6, pts: 500, label: "Mestre E/S", milestone: false },
  { q: 7, pts: 1000, label: "Kernel Master", milestone: true },
];

export default function SOAula5Activity() {
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [totalTime, setTotalTime] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lifelines, setLifelines] = useState({ "50": true, skip: true, time: true });
  const [selectedDisplayIdx, setSelectedDisplayIdx] = useState(null);
  const [correctDisplayIdx, setCorrectDisplayIdx] = useState(null);
  const [optOrder, setOptOrder] = useState([0, 1, 2, 3]);
  const [stageScores, setStageScores] = useState([]);

  const timerRef = useRef(null);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const startQuiz = () => {
    if (playerName.trim().length < 2) return;
    const selected = shuffle(QUESTION_BANK).slice(0, 7);
    setQuestions(selected);
    setQIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTotalTime(0);
    setStageScores([]);
    setAnswered(false);
    setLifelines({ "50": true, skip: true, time: true });
    prepareQuestion(selected[0]);
    setScreen("quiz");
  };

  const prepareQuestion = (q) => {
    const order = shuffle([0, 1, 2, 3]);
    setOptOrder(order);
    const correctIdx = order.indexOf(q.correct);
    setCorrectDisplayIdx(correctIdx);
    setSelectedDisplayIdx(null);
    setAnswered(false);
    setTimeLeft(25);
  };

  useEffect(() => {
    if (screen === "quiz" && !answered) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, answered, qIndex]);

  const timeExpired = () => {
    if (answered) return;
    setAnswered(true);
    setWrongCount((prev) => prev + 1);
    setStageScores(prev => [...prev, 0]);
    setTotalTime((prev) => prev + 25);
  };

  const selectAnswer = (displayIdx, origIdx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setSelectedDisplayIdx(displayIdx);
    setTotalTime((prev) => prev + (25 - timeLeft));

    const q = questions[qIndex];
    if (origIdx === q.correct) {
      setCorrectCount((prev) => prev + 1);
      const points = PRIZES[qIndex].pts;
      setScore((prev) => prev + points);
      setStageScores(prev => [...prev, points]);
    } else {
      setWrongCount((prev) => prev + 1);
      setStageScores(prev => [...prev, 0]);
    }
  };

  const nextQuestion = () => {
    if (qIndex < 6) {
      const nextIdx = qIndex + 1;
      setQIndex(nextIdx);
      prepareQuestion(questions[nextIdx]);
    } else {
      endQuiz();
    }
  };

  const endQuiz = async () => {
    const finalScore = score;
    const avgTime = Math.round(totalTime / 7);

    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName,
        score: finalScore,
        correct: correctCount,
        wrong: wrongCount,
        avgTime: avgTime,
        duration: totalTime * 1000,
        stageScores: stageScores,
        timestamp: Date.now(),
        activityId: "so_aula5",
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Erro ao salvar ranking:", e);
    }

    setScreen("result");
  };

  const getLevelInfo = (s) => {
    const levels = [
      { min: 0, emoji: "💾", label: "Iniciante em Hardware", color: "#94a3b8" },
      { min: 50, emoji: "🖱️", label: "Operador de E/S", color: "#38bdf8" },
      { min: 250, emoji: "💿", label: "Analista de Drivers", color: "#818cf8" },
      { min: 750, emoji: "⚡", label: "Mestre do DMA", color: "#fbbf24" },
      { min: 1500, emoji: "🧪", label: "Arquiteto de Kernel", color: "#4ade80" },
      { min: 1900, emoji: "👑", label: "Lenda dos Sistemas Operacionais", color: "#f472b6" },
    ];
    let lvl = levels[0];
    levels.forEach(l => { if (s >= l.min) lvl = l; });
    return lvl;
  };

  const q = questions[qIndex];

  return (
    <div style={{
      backgroundColor: "#020617",
      color: "#f1f5f9",
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundImage: "radial-gradient(circle at top right, #1e293b, transparent), radial-gradient(circle at bottom left, #0f172a, transparent)"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap');
        
        .card { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; backdrop-filter: blur(12px); width: 100%; max-width: 800px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .btn-primary { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; color: white; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; font-family: 'Orbitron', sans-serif; letter-spacing: 1px; }
        .btn-primary:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .opt-btn { width: 100%; background: rgba(51, 65, 85, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 18px 24px; text-align: left; color: #cbd5e1; cursor: pointer; transition: 0.2s; font-size: 16px; display: flex; gap: 15px; margin-bottom: 12px; }
        .opt-btn:hover:not(:disabled) { background: rgba(51, 65, 85, 0.6); border-color: #3b82f6; }
        .opt-btn.correct { background: rgba(34, 197, 94, 0.2); border-color: #22c55e; color: #4ade80; }
        .opt-btn.wrong { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; color: #f87171; }
        
        .timer-bar { height: 6px; background: #1e293b; border-radius: 3px; margin: 20px 0; overflow: hidden; width: 100%; }
        .timer-fill { height: 100%; transition: width 1s linear; }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ fontFamily: "Orbitron", color: "#3b82f6", fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" }}>Sistemas Operacionais · Aula 05</h2>
        <h1 style={{ fontFamily: "Orbitron", fontSize: "32px", fontWeight: 900, background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Missão: Gestão de E/S</h1>
      </div>

      {screen === "start" && (
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔌</div>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>Bem-vindo ao Lab de Dispositivos</h3>
          <p style={{ color: "#94a3b8", marginBottom: "30px", lineHeight: "1.6" }}>
            Você enfrentará 7 desafios sobre Drivers, DMA, Polling e a arquitetura de entrada e saída. <br/>
            Seja rápido para ganhar mais pontos e subir no ranking!
          </p>
          
          <div style={{ marginBottom: "30px" }}>
            <input 
              type="text" 
              placeholder="Digite seu nome completo..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={{ padding: "15px 20px", borderRadius: "12px", border: "1px solid #334155", background: "#0f172a", color: "white", width: "80%", maxWidth: "400px", fontSize: "16px", outline: "none" }}
            />
          </div>
          
          <button className="btn-primary" disabled={playerName.length < 3} onClick={startQuiz}>INICIAR DESAFIO</button>
        </div>
      )}

      {screen === "quiz" && q && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", fontFamily: "Orbitron" }}>
            <span>DESAFIO {qIndex + 1}/7</span>
            <span>{playerName.split(' ')[0].toUpperCase()} · {score} PTS</span>
          </div>

          <div className="timer-bar">
            <div className="timer-fill" style={{ 
              width: `${(timeLeft / 25) * 100}%`, 
              backgroundColor: timeLeft < 7 ? "#ef4444" : "#3b82f6" 
            }} />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <div style={{ color: "#fbbf24", fontSize: "11px", letterSpacing: "2px", fontWeight: 700, marginBottom: "8px" }}>{q.level.toUpperCase()}</div>
            <div style={{ background: "rgba(15, 23, 42, 0.4)", padding: "15px", borderRadius: "10px", fontStyle: "italic", color: "#94a3b8", fontSize: "14px", marginBottom: "15px", borderLeft: "3px solid #3b82f6" }}>
               "{q.scenario}"
            </div>
            <h4 style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1.4 }}>{q.text}</h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {optOrder.map((origIdx, displayIdx) => {
              const opt = q.options[origIdx];
              let className = "opt-btn";
              if (answered) {
                if (origIdx === q.correct) className += " correct";
                else if (displayIdx === selectedDisplayIdx) className += " wrong";
              }
              return (
                <button 
                  key={displayIdx} 
                  className={className} 
                  disabled={answered}
                  onClick={() => selectAnswer(displayIdx, origIdx)}
                >
                  <span style={{ color: "#3b82f6", fontWeight: 900, fontFamily: "Orbitron" }}>{["A", "B", "C", "D"][displayIdx]}</span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {answered && (
            <div style={{ marginTop: "24px", padding: "20px", borderRadius: "15px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <div style={{ fontWeight: 700, color: selectedDisplayIdx !== null && optOrder[selectedDisplayIdx] === q.correct ? "#4ade80" : "#f87171", marginBottom: "8px" }}>
                {selectedDisplayIdx === null ? "⏱️ Tempo Esgotado!" : optOrder[selectedDisplayIdx] === q.correct ? "✅ Excelente analista!" : "❌ Compreensão de sistema incompleta..."}
              </div>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.5 }}>{q.explanation}</p>
              
              <div style={{ textAlign: "right", marginTop: "15px" }}>
                <button className="btn-primary" onClick={nextQuestion}>
                  {qIndex < 6 ? "PRÓXIMO NÍVEL →" : "FINALIZAR MISSÃO →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {screen === "result" && (
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "70px", marginBottom: "10px" }}>{getLevelInfo(score).emoji}</div>
          <h2 style={{ fontFamily: "Orbitron", color: getLevelInfo(score).color, fontSize: "28px", marginBottom: "5px" }}>{getLevelInfo(score).label}</h2>
          <div style={{ fontSize: "64px", fontWeight: 900, color: "white", fontFamily: "Orbitron", margin: "20px 0" }}>{score} <span style={{ fontSize: "20px", color: "#64748b" }}>PTS</span></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "30px" }}>
            <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
              <div style={{ color: "#22c55e", fontSize: "20px", fontWeight: 800 }}>{correctCount}</div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>ACERTOS</div>
            </div>
            <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
              <div style={{ color: "#ef4444", fontSize: "20px", fontWeight: 800 }}>{wrongCount}</div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>ERROS</div>
            </div>
            <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
              <div style={{ color: "#3b82f6", fontSize: "20px", fontWeight: 800 }}>{Math.round(totalTime / 7)}s</div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>MÉDIA T.</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <button className="btn-primary" onClick={startQuiz}>RECOMEÇAR</button>
            <button className="btn-primary" style={{ background: "transparent", border: "1px solid #334155" }} onClick={() => window.location.href = "/fametro"}>VOLTAR AO HUB</button>
          </div>
        </div>
      )}
    </div>
  );
}
