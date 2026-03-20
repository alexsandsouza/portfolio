import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ============================================================
//  QUESTION BANK – 15 questions based on I/O Management PDF
// ============================================================
const QUESTION_BANK = [
  {
    id: 1,
    level: "Nível 1 — Hardware",
    scenario: "Você está montando um servidor e precisa classificar os dispositivos conectados. Um HD e um SSD precisam ser configurados para leitura por endereços fixos.",
    text: "Qual a principal característica que define esses dispositivos como 'dispositivos de bloco'?",
    options: [
      { letter: "A", text: "Eles enviam um fluxo contínuo de caracteres sem qualquer estrutura de endereçamento." },
      { letter: "B", text: "Eles armazenam informações em blocos de tamanho fixo, cada um com seu próprio endereço." },
      { letter: "C", text: "Eles só podem ser acessados via porta serial de baixa velocidade." },
      { letter: "D", text: "Eles não permitem operações de escrita, apenas de leitura sequencial." },
    ],
    correct: 1,
    explanation: "Dispositivos de bloco (HD, SSD) armazenam dados em blocos fixos e endereçáveis, permitindo que o SO acesse qualquer bloco de forma independente."
  },
  {
    id: 2,
    level: "Nível 1 — Periféricos",
    scenario: "Um usuário conecta um mouse USB e um teclado ao computador. O sistema operacional começa a receber um fluxo de dados conforme o usuário se movimenta.",
    text: "Como esses periféricos são classificados tecnicamente no gerenciamento de E/S?",
    options: [
      { letter: "A", text: "Dispositivos de Bloco, pois enviam dados em pacotes de 512 bytes." },
      { letter: "B", text: "Dispositivos Virtuais, pois não possuem existência física para o kernel." },
      { letter: "C", text: "Dispositivos de Caractere, pois enviam ou recebem um fluxo de caracteres sem blocos fixos." },
      { letter: "D", text: "Dispositivos de DMA, pois acessam a memória RAM diretamente." },
    ],
    correct: 2,
    explanation: "Dispositivos de caractere (mouse, teclado, impressoras) lidam com fluxos de bytes que não possuem estrutura de blocos ou endereçamento direto."
  },
  {
    id: 3,
    level: "Nível 2 — Transmissão",
    scenario: "Ao analisar um cabo de comunicação antigo para uma impressora térmica, você percebe que os dados são enviados um bit de cada vez por um único fio.",
    text: "Qual tipo de interface de transmissão está sendo utilizada nesse cenário?",
    options: [
      { letter: "A", text: "Transmissão Paralela, enviando múltiplos bits simultaneamente." },
      { letter: "B", text: "Transmissão Serial, enviando um bit por vez sequencialmente." },
      { letter: "C", text: "Transmissão DMA, enviando blocos inteiros para a memória." },
      { letter: "D", text: "Transmissão por Interrupção, enviando sinais elétricos de clock." },
    ],
    correct: 1,
    explanation: "A transmissão serial envia dados bit a bit por uma única linha, sendo comum em dispositivos como USB, RS-232 e mouses."
  },
  {
    id: 4,
    level: "Nível 2 — Transmissão",
    scenario: "Um engenheiro decide usar transmissão paralela para conectar dois chips na mesma placa-mãe, visando alta taxa de transferência.",
    text: "Qual a principal limitação da transmissão paralela em longas distâncias?",
    options: [
      { letter: "A", text: "Dificuldade de sincronizar os múltiplos bits e sensibilidade a ruídos externos." },
      { letter: "B", text: "Velocidade muito baixa comparada aos protocolos seriais modernos." },
      { letter: "C", text: "Incompatibilidade com o sistema de arquivos do computador." },
      { letter: "D", text: "Necessidade de uma CPU dedicada para cada fio de dados." },
    ],
    correct: 0,
    explanation: "Em cabos longos, os sinais em diferentes fios (transmissão paralela) podem chegar em tempos diferentes (skew), dificultando a sincronização."
  },
  {
    id: 5,
    level: "Nível 3 — Drivers",
    scenario: "A empresa comprou uma placa de captura de vídeo de um fabricante desconhecido. Ao conectar, o SO não consegue realizar nenhuma operação com a placa.",
    text: "Qual componente de software está faltando para 'traduzir' os comandos do SO para esse hardware específico?",
    options: [
      { letter: "A", text: "Compilador JIT." },
      { letter: "B", text: "Device Driver (Controlador de Dispositivo)." },
      { letter: "C", text: "Loader de sistema de arquivos." },
      { letter: "D", text: "Gerenciador de Janelas do Windows." },
    ],
    correct: 1,
    explanation: "O Device Driver é a ponte entre o sistema operacional e o hardware, transformando requisições genéricas em comandos específicos para o chip controlador."
  },
  {
    id: 6,
    level: "Nível 3 — Software de E/S",
    scenario: "Um desenvolvedor quer que seu driver seja o mais seguro possível e não afete o kernel caso ocorra um erro de programação.",
    text: "Onde os drivers de sistemas operacionais modernos geralmente residem para garantir performance, apesar do risco?",
    options: [
      { letter: "A", text: "No Modo Usuário, isolados de todas as funções críticas." },
      { letter: "B", text: "No firmware da BIOS, carregados antes do boot." },
      { letter: "C", text: "No Modo Núcleo (Kernel Mode), compartilhando o mesmo espaço de memória do SO." },
      { letter: "D", text: "Em um servidor remoto via nuvem por questões de redundância." },
    ],
    correct: 2,
    explanation: "A maioria dos drivers roda em Modo Núcleo para ter acesso rápido aos registradores de hardware e memória, embora um erro neles possa causar o 'Blue Screen'."
  },
  {
    id: 7,
    level: "Nível 4 — Polling",
    scenario: "Em um microcontrolador simples, o programador usa um loop 'while' infinito para verificar se um dado no teclado está pronto para ser lido.",
    text: "Qual o termo técnico para esse mecanismo de verificação constante e por que ele é ineficiente?",
    options: [
      { letter: "A", text: "Interrupção; é ineficiente pois gera trocas de contexto desnecessárias." },
      { letter: "B", text: "DMA; é ineficiente pois consome muita banda do barramento principal." },
      { letter: "C", text: "Polling (Espera Ocupada); é ineficiente pois a CPU gasta 100% dos ciclos apenas esperando o hardware." },
      { letter: "D", text: "Spooling; é ineficiente pois exige muito espaço em disco para o cache." },
    ],
    correct: 2,
    explanation: "No Polling (ou Busy Wait), a CPU 'perde tempo' em um laço de repetição consultando o status do dispositivo em vez de realizar outras tarefas úteis."
  },
  {
    id: 8,
    level: "Nível 4 — Interrupções",
    scenario: "Para evitar que a CPU perca tempo esperando um disco lento, o SO inicia a leitura e passa a executar outro processo de um usuário diferente.",
    text: "Como o hardware avisa à CPU que os dados do disco já foram lidos e estão prontos?",
    options: [
      { letter: "A", text: "Enviando um e-mail interno para o registrador de eventos." },
      { letter: "B", text: "Gerando um sinal elétrico chamado Interrupção." },
      { letter: "C", text: "O SO detecta automaticamente através do relógio (timer) de 1 ms." },
      { letter: "D", text: "O hardware escreve 'PRONTO' no setor zero do disco rígido." },
    ],
    correct: 1,
    explanation: "As interrupções permitem que o hardware chame a atenção da CPU apenas quando necessário, evitando a espera ociosa (polling)."
  },
  {
    id: 9,
    level: "Nível 5 — DMA",
    scenario: "Em um servidor de streaming, transferir vídeos 4K byte a byte usando interrupções está sobrecarregando a CPU com milhares de trocas de contexto.",
    text: "Qual tecnologia permite mover blocos de dados do disco para a RAM sem a CPU processar cada byte?",
    options: [
      { letter: "A", text: "Pipelining de Instruções." },
      { letter: "B", text: "Memória Virtual Paginada." },
      { letter: "C", text: "DMA (Direct Memory Access / Acesso Direto à Memória)." },
      { letter: "D", text: "Algoritmo de Escalonamento Round-Robin." },
    ],
    correct: 2,
    explanation: "O DMA utiliza um controlador especial que assume o comando do barramento e transfere dados diretamente entre dispositivo e RAM, liberando a CPU."
  },
  {
    id: 10,
    level: "Nível 5 — DMA",
    scenario: "Um controlador de DMA acabou de terminar a transferência de um bloco de 10 MB de um sensor de radar para a memória principal do SO.",
    text: "Qual a ação final realizada pelo DMA para liberar o CPU e avisar sobre a conclusão?",
    options: [
      { letter: "A", text: "Ele reinicia o computador para limpar os caches de escrita." },
      { letter: "B", text: "Ele gera uma única interrupção para o CPU ao final da transferência." },
      { letter: "C", text: "Ele envia uma instrução 'Wait' para todos os outros periféricos." },
      { letter: "D", text: "Ele entra em modo Polling até o kernel ler o endereço final." },
    ],
    correct: 1,
    explanation: "O DMA reduz o overhead: em vez de uma interrupção por byte, ele gera apenas uma interrupção por bloco transferido."
  },
  {
    id: 11,
    level: "Nível 6 — Buffering",
    scenario: "A velocidade da internet oscila muito enquanto você assiste a um vídeo. O player de vídeo reserva uma área na RAM para guardar alguns segundos à frente.",
    text: "Qual técnica de E/S está sendo usada para suavizar essas discrepâncias de velocidade?",
    options: [
      { letter: "A", text: "Swapping (Troca de processos)." },
      { letter: "B", text: "Buffering (Armazenamento Temporário)." },
      { letter: "C", text: "Fragmentação de Arquivos." },
      { letter: "D", text: "Pipelining de Cache." },
    ],
    correct: 1,
    explanation: "Buffering é o uso de áreas de memória para armazenar dados temporariamente, compensando diferenças de tempo de produção e consumo entre CPU e hardware."
  },
  {
    id: 12,
    level: "Nível 6 — Spooling",
    scenario: "Três usuários enviam documentos para a mesma impressora ao mesmo tempo. A impressora só consegue imprimir um documento por vez.",
    text: "Qual mecanismo o SO utiliza para guardar esses pedidos em disco e enviá-los em ordem?",
    options: [
      { letter: "A", text: "Paging (Paginação de Memória)." },
      { letter: "B", text: "DMA Multicanal." },
      { letter: "C", text: "Spooling (Simultaneous Peripheral Operation On-Line)." },
      { letter: "D", text: "Bus Architecture Parallelism." },
    ],
    correct: 2,
    explanation: "Spooling permite que múltiplos processos 'enviem' dados para um hardware exclusivo (como impressora) via um intermediário (disco)."
  },
  {
    id: 13,
    level: "Nível 7 — Barramento",
    scenario: "Um técnico precisa conectar uma GPU potente e um SSD NVMe. Ele sabe que a largura de banda desse canal de comunicação física é vital.",
    text: "Como se chama o conjunto de linhas físicas que interliga CPU, Memória e periféricos?",
    options: [
      { letter: "A", text: "Switch de Core Único." },
      { letter: "B", text: "Barramento (Bus)." },
      { letter: "C", text: "Interface de Soquete." },
      { letter: "D", text: "Gateway de Hardware." },
    ],
    correct: 1,
    explanation: "O Barramento (Bus) é o caminho físico por onde viajam os dados, endereços e sinais de controle entre os componentes do computador."
  },
  {
    id: 14,
    level: "Nível 7 — Controladores",
    scenario: "Na arquitetura do computador, o SO não fala 'diretamente' com o motor físico do HD, mas sim com uma placa eletrônica intermediária.",
    text: "Qual o nome dessa unidade eletrônica que interpreta os comandos lógicos do SO?",
    options: [
      { letter: "A", text: "ALU (Unidade Lógica e Aritmética)." },
      { letter: "B", text: "Bridge de Segmento." },
      { letter: "C", text: "Controlador de Dispositivo (Device Controller)." },
      { letter: "D", text: "Buffer de Saída Serial." },
    ],
    correct: 2,
    explanation: "O Controlador de Dispositivo (Chipset/Placa) é a parte eletrônica do periférico que lida com os sinais físicos e apresenta uma interface para o SO."
  },
  {
    id: 15,
    level: "⚔️ BOSS FINAL",
    scenario: "Você está projetando um servidor de alta disponibilidade que processa imagens de satélite gigantescas vindas de um conjunto de discos ópticos.",
    text: "Qual combinação de tecnologias de E/S oferece a melhor performance com o menor impacto de interrupções na CPU?",
    options: [
      { letter: "A", text: "Mecanismo de Polling com Transferência Serial Pura e Drivers em Modo Usuário." },
      { letter: "B", text: "Uso de Dispositivos de Caractere com Buffering Simples e Instruções Privilegiadas manuais." },
      { letter: "C", text: "Dispositivos de Bloco combinados com DMA, Interrupções ao fim dos blocos e Buffering Duplo." },
      { letter: "D", text: "Desativação total de interrupções e uso de memória compartilhada síncrona sem Barramento." },
    ],
    correct: 2,
    explanation: "Para alta performance: blocos permitem acesso paralelo, DMA move dados sem CPU, interrupções evitam perda de tempo e Buffering duplo permite ler enquanto processa."
  }
];

// Prize ladder - 15 positions
const PRIZES = [
  { q: 1, pts: 10, label: "10 XP", milestone: false },
  { q: 2, pts: 25, label: "25 XP", milestone: false },
  { q: 3, pts: 50, label: "50 XP", milestone: true },
  { q: 4, pts: 75, label: "75 XP", milestone: false },
  { q: 5, pts: 100, label: "100 XP", milestone: true },
  { q: 6, pts: 150, label: "150 XP", milestone: false },
  { q: 7, pts: 200, label: "200 XP", milestone: false },
  { q: 8, pts: 300, label: "300 XP", milestone: true },
  { q: 9, pts: 400, label: "400 XP", milestone: false },
  { q: 10, pts: 500, label: "500 XP", milestone: true },
  { q: 11, pts: 700, label: "700 XP", milestone: false },
  { q: 12, pts: 900, label: "900 XP", milestone: false },
  { q: 13, pts: 1200, label: "1.2k XP", milestone: true },
  { q: 14, pts: 1500, label: "1.5k XP", milestone: false },
  { q: 15, pts: 2000, label: "2.0k XP", milestone: true },
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
  const [optOrder, setOptOrder] = useState([0, 1, 2, 3]);
  const [stageScores, setStageScores] = useState([]);
  
  const timerRef = useRef(null);

  // ============================================================
  //  LOGIC
  // ============================================================
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    if (screen === "quiz" && !answered) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, answered, qIndex]);

  const handleTimeout = () => {
    if (answered) return;
    setAnswered(true);
    setWrongCount((prev) => prev + 1);
    setTotalTime((prev) => prev + 25);
  };

  const startQuiz = () => {
    if (playerName.trim().length < 2) return;
    const shuffled = shuffle(QUESTION_BANK);
    setQuestions(shuffled);
    setQIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTotalTime(0);
    setLifelines({ "50": true, skip: true, time: true });
    prepareQuestion(shuffled[0]);
    setScreen("quiz");
  };

  const prepareQuestion = (currentQ) => {
    setOptOrder(shuffle([0, 1, 2, 3]));
    setSelectedDisplayIdx(null);
    setAnswered(false);
    setTimeLeft(25);
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
      setStageScores(prev => [...prev, true]);
    } else {
      setWrongCount((prev) => prev + 1);
      setStageScores(prev => [...prev, false]);
    }
  };

  const nextQuestion = () => {
    if (qIndex < 14) {
      const nextIdx = qIndex + 1;
      setQIndex(nextIdx);
      prepareQuestion(questions[nextIdx]);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setScreen("result");
    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName,
        score: score,
        correct: correctCount,
        wrong: wrongCount,
        duration: totalTime * 1000,
        timestamp: Date.now(),
        activityId: "so_aula5",
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Erro ao salvar ranking:", e);
    }
  };

  const getLevelInfo = (s) => {
    const levels = [
      { min: 0, icon: "💾", label: "Iniciante BIOS", color: "#94a3b8" },
      { min: 250, icon: "💿", label: "Analista de Periféricos", color: "#38bdf8" },
      { min: 750, icon: "⚡", label: "Mestre do DMA", color: "#fbbf24" },
      { min: 1500, icon: "🧪", label: "Arquiteto do Kernel", color: "#4ade80" },
      { min: 1900, icon: "👑", label: "LENDA DO I/O", color: "#f472b6" },
    ];
    let lvl = levels[0];
    levels.forEach(l => { if (s >= l.min) lvl = l; });
    return lvl;
  };

  const useLifeline50 = () => {
    if (!lifelines["50"] || answered) return;
    setLifelines(prev => ({ ...prev, "50": false }));
  };

  const useLifelineSkip = () => {
    if (!lifelines.skip || answered) return;
    setLifelines(prev => ({ ...prev, skip: false }));
    setAnswered(true);
    setWrongCount(prev => prev + 1);
    nextQuestion();
  };

  const useLifelineTime = () => {
    if (!lifelines.time || answered) return;
    setLifelines(prev => ({ ...prev, time: false }));
    setTimeLeft(prev => prev + 10);
  };

  const q = questions[qIndex];

  return (
    <div style={{
      backgroundColor: "#050a1b",
      color: "#e2e8f0",
      fontFamily: "'Rajdhani', sans-serif",
      minHeight: "100vh",
      padding: "20px 16px",
      position: "relative",
      overflowX: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        
        .grid-overlay {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .main-container { max-width: 1000px; margin: 0 auto; position: relative; z-index: 1; }
        .header { text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px; }
        .header-tag { display: inline-block; font-family: 'Orbitron', sans-serif; font-size: 10px; color: #3b82f6; border: 1px solid #3b82f6; padding: 4px 12px; letter-spacing: 2px; border-radius: 40px; margin-bottom: 15px; box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
        .header h1 { font-family: 'Orbitron', sans-serif; font-size: 26px; font-weight: 900; color: #fff; margin: 0; }
        .header span { color: #3b82f6; }
        .header-sub { font-size: 13px; color: #64748b; margin-top: 5px; }

        .btn-io { font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s; letter-spacing: 1px; }
        .btn-io-primary { background: #3b82f6; color: #fff; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
        .btn-io-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6); }
        .btn-io-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .quiz-card { background: #0a1324; border: 1px solid #1e293b; border-radius: 8px; padding: 25px; margin-bottom: 15px; }
        .q-tag { font-family: 'Orbitron', sans-serif; font-size: 10px; color: #fbbf24; margin-bottom: 8px; font-weight: 700; letter-spacing: 1px; }
        .q-context { background: #0f172a; border-left: 4px solid #3b82f6; padding: 12px 15px; font-size: 14px; color: #94a3b8; line-height: 1.6; font-style: italic; margin-bottom: 15px; }
        .q-question { font-size: 18px; font-weight: 600; color: #f1f5f9; line-height: 1.4; }

        .opt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .opt-btn { background: #0a1324; border: 1px solid #1e293b; color: #e2e8f0; padding: 15px; border-radius: 6px; text-align: left; transition: 0.1s; cursor: pointer; display: flex; gap: 12px; font-family: 'Rajdhani', sans-serif; font-size: 15px; font-weight: 500; min-height: 60px; align-items: center; }
        .opt-btn:hover:not(:disabled) { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
        .opt-btn.correct { border-color: #4ade80; background: rgba(74, 222, 128, 0.1); color: #4ade80; }
        .opt-btn.wrong { border-color: #f87171; background: rgba(248, 113, 113, 0.1); color: #f87171; }
        .opt-let { font-family: 'Orbitron', sans-serif; font-size: 12px; color: #3b82f6; font-weight: 900; }

        .feedback { background: #0f172a; border-radius: 6px; padding: 15px; margin-bottom: 20px; border-left: 3px solid #3b82f6; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .sidebar-ladder { background: #0a1324; border: 1px solid #1e293b; border-radius: 8px; padding: 15px; height: fit-content; }
        .step-item { display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding: 4px 6px; border-radius: 4px; margin-bottom: 2px; color: #64748b; }
        .step-item.active { background: rgba(59, 130, 246, 0.15); border: 1px solid #3b82f6; color: #3b82f6; font-weight: 700; }
        .step-item.done { color: #4ade80; }
        .step-item.milestone { color: #fbbf24; }

        .timer-circular { position: relative; width: 60px; height: 60px; margin: 0 auto 20px; }
        .timer-svg { transform: rotate(-90deg); }
        .timer-bg { fill: none; stroke: #1e293b; stroke-width: 4; }
        .timer-bar { fill: none; stroke: #3b82f6; stroke-width: 4; stroke-dasharray: 175.9; transition: stroke-dashoffset 1s linear; }
      `}</style>
      
      <div className="grid-overlay"></div>

      <div className="main-container">
        <header className="header">
          <div className="header-tag">SO QUEST · HUB FAMETRO</div>
          <h1>Missão: Gerenciamento de <span>Entrada e Saída</span></h1>
          <p className="header-sub">Prof. Alexsander Farias · Aula 05 · Periféricos e Controladores</p>
        </header>

        {/* --- TELA INICIAL --- */}
        {screen === "start" && (
          <div style={{ textAlign: "center", background: "#0a1324", border: "1px solid #1e293b", padding: "40px", borderRadius: "12px", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🖱️</div>
            <h2 style={{ fontFamily: "Orbitron", fontSize: "28px", color: "#fff", marginBottom: "15px" }}>Infiltrar no <span style={{ color: "#3b82f6" }}>Barramento</span></h2>
            <p style={{ color: "#94a3b8", marginBottom: "30px", lineHeight: "1.6", fontSize: "16px" }}>
              Analise os periféricos, configure o DMA e gerencie interrupções para completar as 15 etapas desta missão técnica. ACESSO RESTRITO.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "40px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#3b82f6", fontSize: "24px", fontWeight: "bold", fontFamily: "Orbitron" }}>25s</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>P/ QUESTÃO</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#3b82f6", fontSize: "24px", fontWeight: "bold", fontFamily: "Orbitron" }}>15</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>ETAPAS</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#fbbf24", fontSize: "24px", fontWeight: "bold", fontFamily: "Orbitron" }}>2.0k</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>XP MÁXIMO</div>
              </div>
            </div>

            <div style={{ maxWidth: "400px", margin: "0 auto 25px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "#64748b", textTransform: "uppercase", marginBottom: "8px", textAlign: "left", letterSpacing: "1px" }}>Identificação do Aluno</label>
              <input 
                type="text" 
                placeholder="Insira seu nome completo..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", padding: "12px 15px", borderRadius: "6px", color: "#fff", fontFamily: "Rajdhani", fontSize: "16px", outline: "none" }}
              />
            </div>

            <button className="btn-io btn-io-primary" disabled={playerName.length < 2} onClick={startQuiz}>INICIAR PROTOCOLO E/S →</button>
          </div>
        )}

        {/* --- TELA QUIZ --- */}
        {screen === "quiz" && q && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: "25px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>ALUNO: <b>{playerName.toUpperCase()}</b></div>
                  <div style={{ fontFamily: "Orbitron", fontSize: "11px", color: "#3b82f6" }}>ETAPA <span style={{ fontSize: "18px" }}>{qIndex + 1}</span> DE 15</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>SCORE ACUMULADO</div>
                  <div style={{ fontFamily: "Orbitron", fontSize: "20px", color: "#fbbf24", fontWeight: "900" }}>{score} XP</div>
                </div>
              </div>

              <div className="timer-circular">
                <svg className="timer-svg" width="60" height="60">
                   <circle className="timer-bg" cx="30" cy="30" r="28" />
                   <circle 
                    className="timer-bar" 
                    cx="30" cy="30" r="28" 
                    style={{ 
                      strokeDashoffset: 175.9 * (1 - timeLeft / 25),
                      stroke: timeLeft < 8 ? "#f87171" : "#3b82f6"
                    }} 
                   />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Orbitron", fontSize: "15px", fontWeight: "700", color: timeLeft < 8 ? "#f87171" : "#fff" }}>{timeLeft}s</div>
              </div>

              <div className="quiz-card">
                <div className="q-tag">{q.level}</div>
                <div className="q-context">{q.scenario}</div>
                <div className="q-question">{q.text}</div>
              </div>

              <div className="opt-grid">
                {optOrder.map((origIdx, dIdx) => {
                   const opt = q.options[origIdx];
                   let statusClass = "";
                   if (answered) {
                      if (origIdx === q.correct) statusClass = "correct";
                      else if (dIdx === selectedDisplayIdx) statusClass = "wrong";
                   }
                   return (
                     <button 
                      key={dIdx} 
                      className={`opt-btn ${statusClass}`}
                      disabled={answered}
                      onClick={() => selectAnswer(dIdx, origIdx)}
                     >
                        <span className="opt-let">{["A", "B", "C", "D"][dIdx]}</span>
                        {opt.text}
                     </button>
                   );
                })}
              </div>

              {answered && (
                <div className="feedback">
                  <div style={{ fontWeight: "700", color: "#f1f5f9", marginBottom: "5px" }}>
                    {selectedDisplayIdx === null ? "⏱️ TIME OVER" : 
                     optOrder[selectedDisplayIdx] === q.correct ? "✅ ACESSO CONCEDIDO" : "❌ INTERCEPÇÃO FALHOU"}
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: "1.5" }}>{q.explanation}</p>
                  <div style={{ textAlign: "right", marginTop: "15px" }}>
                    <button className="btn-io btn-io-primary" onClick={nextQuestion}>PRÓXIMA ETAPA →</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px", opacity: answered ? 0.3 : 1 }}>
                <button disabled={!lifelines["50"] || answered} className="btn-io" style={{ background: "#1e293b", color: "#94a3b8", flex: 1 }} onClick={useLifeline50}>✂️ 50:50</button>
                <button disabled={!lifelines.skip || answered} className="btn-io" style={{ background: "#1e293b", color: "#94a3b8", flex: 1 }} onClick={useLifelineSkip}>⏭️ PULAR</button>
                <button disabled={!lifelines.time || answered} className="btn-io" style={{ background: "#1e293b", color: "#94a3b8", flex: 1 }} onClick={useLifelineTime}>⏱️ +10S</button>
              </div>
            </div>

            <aside className="sidebar-ladder">
               <h3 style={{ fontFamily: "Orbitron", fontSize: "10px", textAlign: "center", color: "#64748b", borderBottom: "1px solid #1e293b", paddingBottom: "10px", marginBottom: "10px", letterSpacing: "2px" }}>SEQUÊNCIA DE E/S</h3>
               {[...PRIZES].reverse().map(p => (
                 <div key={p.q} className={`step-item ${p.milestone ? "milestone" : ""} ${p.q === qIndex + 1 ? "active" : p.q < qIndex + 1 ? "done" : ""}`}>
                    <span>Etapa {p.q}</span>
                    <span style={{ fontFamily: "monospace" }}>{p.label}</span>
                 </div>
               ))}
            </aside>
          </div>
        )}

        {/* --- TELA RESULTADO --- */}
        {screen === "result" && (
          <div style={{ textAlign: "center", background: "#0a1324", border: "1px solid #1e293b", padding: "50px 30px", borderRadius: "12px", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "70px", marginBottom: "10px" }}>{getLevelInfo(score).icon}</div>
            <h2 style={{ fontFamily: "Orbitron", fontSize: "20px", color: getLevelInfo(score).color, letterSpacing: "2px", marginBottom: "10px" }}>{getLevelInfo(score).label}</h2>
            <div style={{ fontFamily: "Orbitron", fontSize: "70px", fontWeight: "900", color: "#3b82f6", textShadow: "0 0 30px rgba(59, 130, 246, 0.5)", lineHeight: 1 }}>{score}</div>
            <p style={{ color: "#64748b", margin: "10px 0 40px", fontSize: "14px" }}>PONTOS XP ADQUIRIDOS NO HUB</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "40px" }}>
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "15px", borderRadius: "8px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4ade80" }}>{correctCount}</div>
                <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>ACERTOS</div>
              </div>
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "15px", borderRadius: "8px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f87171" }}>{wrongCount}</div>
                <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>FALHAS</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button className="btn-io btn-io-primary" onClick={() => setScreen("start")}>REINICIAR MISSÃO</button>
              <Link to="/fametro" style={{ textDecoration: "none" }}>
                <button className="btn-io" style={{ background: "transparent", border: "1px solid #1e293b", color: "#94a3b8" }}>HUB FAMETRO</button>
              </Link>
              <Link to="/fametro/so/aula5/ranking" style={{ textDecoration: "none" }}>
                <button className="btn-io" style={{ background: "rgba(251, 191, 36, 0.1)", border: "1px solid #fbbf24", color: "#fbbf24" }}>RANKING</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
