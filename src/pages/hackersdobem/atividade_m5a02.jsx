import { useState, useEffect, useRef } from "react";
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ============================================================
//  QUESTION BANK – 15 situação-problema questions M5 Aula 02
// ============================================================
const QUESTION_BANK = [
  {
    id: 1,
    level: "Nível 1 — Iniciante",
    scenario: "Um administrador está configurando novos usuários no sistema do RH. Ele insere nome completo, e-mail, telefone e o departamento ao qual os usuários pertencem.",
    text: "No contexto de Gerenciamento de Identidades e Contas, essas informações inseridas (nome, e-mail, telefone e departamento) representam o quê?",
    options: [
      { letter: "A", text: "Políticas de senha, que exigem complexidade baseada nesses dados." },
      { letter: "B", text: "Atributos de conta, que fornecem detalhes sobre a identidade e função do usuário." },
      { letter: "C", text: "Privilégios de controle, que garantem o acesso ao sistema." },
      { letter: "D", text: "Mecanismos de autenticação para validar o login ao sistema." }
    ],
    correct: 1,
    explanation: "Os atributos de contas são informações específicas associadas a uma conta de usuário, fornecendo detalhes sobre a identidade e as características do usuário."
  },
  {
    id: 2,
    level: "Nível 1 — Iniciante",
    scenario: "Uma empresa precisa garantir que todos os funcionários alterem suas senhas a cada 90 dias, além de exigir no mínimo 8 caracteres contendo letras e números.",
    text: "Qual mecanismo o administrador deve utilizar para implementar e forçar obrigatoriamente essa regra para todos no ambiente do Windows?",
    options: [
      { letter: "A", text: "Políticas de Acesso (GPOs ou Objetos de Política de Grupo)." },
      { letter: "B", text: "Sistema de Auditoria de Contas (Tracking)." },
      { letter: "C", text: "Restrições de Geofencing para limitar a alteração remota." },
      { letter: "D", text: "Desabilitação de contas sempre que a expiração de 90 dias ocorrer." }
    ],
    correct: 0,
    explanation: "Uma forma de implementação das políticas de contas são os GPOs (Objetos de Política de Grupo) em redes Windows Active Directory."
  },
  {
    id: 3,
    level: "Nível 2 — Básico",
    scenario: "O departamento de segurança percebeu que muitos usuários estavam usando '123456' ou 'senha' como credencial de acesso.",
    text: "Quais aspectos de uma política de configurações de senhas de conta o administrador deve priorizar para resolver o problema de senhas fracas?",
    options: [
      { letter: "A", text: "Comprimento mínimo da senha e complexidade, além de proibição de senhas comuns." },
      { letter: "B", text: "Exigência de alteração a cada hora e bloqueio de tela a cada 2 minutos." },
      { letter: "C", text: "Uso obrigatório de biometria para evitar a criação de senhas textuais." },
      { letter: "D", text: "Definir que o usuário não pode acessar o sistema usando VPN, apenas rede local." }
    ],
    correct: 0,
    explanation: "Uma Política de Configurações de Senhas de Conta visa promover senhas fortes com base em comprimento mínimo, complexidade e a proibição de senhas comuns."
  },
  {
    id: 4,
    level: "Nível 2 — Básico",
    scenario: "A empresa possui um aplicativo em dispositivos móveis que só deve poder ser usado caso o funcionário esteja fisicamente dentro da área da fábrica.",
    text: "Como se chama a tecnologia de controle de acesso espacial que verifica a localização física do dispositivo para conceder o acesso?",
    options: [
      { letter: "A", text: "Gravação e Execução Condicional." },
      { letter: "B", text: "Auditoria Forense Espacial." },
      { letter: "C", text: "Network Address Translation (NAT)." },
      { letter: "D", text: "Geofencing, uma restrição baseada em localização." }
    ],
    correct: 3,
    explanation: "Geofencing é a tecnologia que delimita espaços geográficos utilizando dispositivos móveis ou geolocalização."
  },
  {
    id: 5,
    level: "Nível 3 — Intermediário",
    scenario: "Um ataque de força bruta foi deflagrado e um invasor tentou adivinhar a senha do diretor logando sem sucesso 15 vezes em menos de um minuto.",
    text: "Para defender as contas da empresa contra esse tipo de ataque, qual regra de segurança deve estar configurada?",
    options: [
      { letter: "A", text: "Exigência de alteração periódica da senha após o login falhar." },
      { letter: "B", text: "Bloqueio temporário (lockout) da conta após várias tentativas falhas." },
      { letter: "C", text: "Criptografia avançada em todos os e-mails recebidos pelo diretor." },
      { letter: "D", text: "Desabilitação permanente da conta ao registrar uma única tentativa falha." }
    ],
    correct: 1,
    explanation: "O bloqueio refere-se a uma medida temporária na qual o acesso é negado após um número definido de várias tentativas de login malsucedidas."
  },
  {
    id: 6,
    level: "Nível 3 — Intermediário",
    scenario: "O analista do centro de operações de segurança (SOC) identificou que o mesmo arquivo confidencial foi alterado por três usuários não autorizados nos últimos dois dias.",
    text: "Qual processo a equipe deve executar para revisar o histórico das atividades desses três usuários com o intuito de aplicar uma ação disciplinar?",
    options: [
      { letter: "A", text: "Aumentar os requisitos de complexidade de senha no sistema." },
      { letter: "B", text: "Revisar a auditoria de contas para a investigação forense dos eventos." },
      { letter: "C", text: "Desativar o Windows Firewall para capturar tráfego irrestrito na DMZ." },
      { letter: "D", text: "Modificar o Geofencing do arquivo para bloquear acesso de madrugada." }
    ],
    correct: 1,
    explanation: "A auditoria de contas é a análise sistemática das atividades, sendo essencial para detecção de violações e investigação forense."
  },
  {
    id: 7,
    level: "Nível 3 — Intermediário",
    scenario: "Um analista precisa abrir vários PDFs que contêm faturas na pasta do servidor, no entanto, ele não deve ser capaz de modificar ou apagar essas faturas.",
    text: "Quais permissões mínimas devem ser atribuídas à conta deste usuário na pasta do servidor de arquivos?",
    options: [
      { letter: "A", text: "Apenas Execução e Exclusão." },
      { letter: "B", text: "Gravação e Administração." },
      { letter: "C", text: "Apenas Leitura (Read)." },
      { letter: "D", text: "Leitura, Gravação e Administração." }
    ],
    correct: 2,
    explanation: "As permissões de conta determinam o que pode ser feito. A permissão de Leitura garante que o conteúdo posse ser visualizado sem chance de alteração ou apagamento acidental."
  },
  {
    id: 8,
    level: "Nível 4 — Avançado",
    scenario: "Um funcionário pediu desligamento e deixou a organização. Para garantir que ninguém fará o uso ilegítimo de sua conta por engano no futuro.",
    text: "A medida administrativa mais recomendada sobre o status dessa conta após sua saída deve ser:",
    options: [
      { letter: "A", text: "Bloqueio temporário com liberação diária para o novo funcionário." },
      { letter: "B", text: "Renomeá-la para um nome genérico, mas manter todas as permissões." },
      { letter: "C", text: "A desabilitação, uma ação permanente de desativação ou remoção do sistema." },
      { letter: "D", text: "Forçar a alteração de senha antes que a conta expire após um mês." }
    ],
    correct: 2,
    explanation: "A desabilitação da conta deve ocorrer permanentemente e de imediato sempre que um usuário se desliga ou deixa a organização, ou se a conta atrela-se a atividades fraudulentas."
  },
  {
    id: 9,
    level: "Nível 4 — Avançado",
    scenario: "A equipe de TI da organização precisa que o estagiário execute um de seus scripts que processam dados diariamente. O programa precisa abrir o arquivo, aplicar fórmulas e salvar as mudanças no mesmo lugar.",
    text: "Para que o script funcione perfeitamente com interações de arquivo, quais permissões básicas devem ser atribuídas ao estagiário?",
    options: [
      { letter: "A", text: "Apenas Leitura (r)." },
      { letter: "B", text: "Somente Execução (x) do script e Leitura (r)." },
      { letter: "C", text: "Leitura (r) para ler, Gravação (w) para salvar, e Execução (x) para o script." },
      { letter: "D", text: "Somente Administração." }
    ],
    correct: 2,
    explanation: "Garantir a execução e realizar mudanças implica que deve haver as permissões de Escrita (Gravação), Execução e Leitura simultaneamente aplicadas."
  },
  {
    id: 10,
    level: "Nível 4 — Avançado",
    scenario: "Uma empresa decidiu implementar auditoria em sua rede, mas o administrador de rede argumenta que auditar todas as ações de cada usuário vai sobrecarregar o armazenamento.",
    text: "Considerando as práticas ideais de gerenciamento e auditoria de contas, o que o administrador deve configurar?",
    options: [
      { letter: "A", text: "Registrar absolutamente todos os logs na mesma máquina cliente para não usar o servidor." },
      { letter: "B", text: "Configurar objetos de política (GPOs) para auditar eventos críticos ou anômalos em conformidade regulatória." },
      { letter: "C", text: "Descartar a auditoria se o usuário já tiver permissão administrativa na máquina." },
      { letter: "D", text: "Aplicar políticas de senha mais rigorosas em vez da auditoria, mitigando o risco." }
    ],
    correct: 1,
    explanation: "A auditoria deve ser realizada visando conformidade, investigações e foco em atividades que possam gerar violações de segurança para serem logadas sistematicamente."
  },
  {
    id: 11,
    level: "Nível 5 — Especialista",
    scenario: "O departamento de segurança precisa restringir o acesso remoto dos administradores, limitando-os das 08h às 18h em dias de semana e criando um controle rígido baseado na localização IP corporativa.",
    text: "Essas restrições enquadram-se principalmente em qual objetivo das Políticas de Contas?",
    options: [
      { letter: "A", text: "Diminuição da complexidade global da senha do usuário." },
      { letter: "B", text: "Segregação de funções em um modelo organizacional horizontal." },
      { letter: "C", text: "Aproximar o conceito de Restrições de Contas (como geofencing e restrições de horário)." },
      { letter: "D", text: "Criação de novos atributos informativos além da permissão de gravação." }
    ],
    correct: 2,
    explanation: "A combinação de horário com restrições por localização IP é descrita em segurança de acesso por Restrições de Contas limitadas e/ou Geofencing."
  },
  {
    id: 12,
    level: "Nível 5 — Especialista",
    scenario: "Durante uma investigação minuciosa com foco forense, descobriu-se que após uma tentativa mal sucedida de intrusão com força bruta a conta foi travada. Porém, o atacante mudou para outra conta esquecida e invadiu o sistema.",
    text: "Essa ocorrência demonstra falta do quê no ciclo de gerenciamento dessa segunda conta atacada?",
    options: [
      { letter: "A", text: "A desabilitação ou revisão de contas antigas e ociosas antes de poderem ser abusadas." },
      { letter: "B", text: "Ausência de um certificado ou smartcard em todas as estações com Windows 11." },
      { letter: "C", text: "Falta da permissão de 'gravação' na segunda conta." },
      { letter: "D", text: "Auditoria contínua somente sobre o grupo 'Administrators'." }
    ],
    correct: 0,
    explanation: "Uma conta antiga não deveria estar ativa; o procedimento natural exige a desabilitação periódica de contas inativas como premissa para evitar acessos por meio do esquecimento."
  },
  {
    id: 13,
    level: "Nível 2 — Básico",
    scenario: "O analista precisa conceder o controle para que uma nova aplicação funcione consumindo os dados do AD do usuário (ex: cargo, telefone e email), sem deixar alterar nada.",
    text: "Para que o aplicativo possa apenas reconhecer e obter essas informações, o que será consumido da conta?",
    options: [
      { letter: "A", text: "Senhas em texto." },
      { letter: "B", text: "Atributos da conta." },
      { letter: "C", text: "Logs da auditoria de sistema." },
      { letter: "D", text: "Histórico de horários de uso." }
    ],
    correct: 1,
    explanation: "O aplicativo precisará apenas dos Atributos de Contas associados aos usuários, como o nível de departamento, telefone, endereço, etc."
  },
  {
    id: 14,
    level: "Nível 3 — Intermediário",
    scenario: "Muitos usuários de escritório criam planilhas que as lideranças precisam ler e comentar no mesmo arquivo da rede corporativa.",
    text: "Como as políticas orientam para dar apenas a permissão adequada as lideranças, em prol da restrição condicional?",
    options: [
      { letter: "A", text: "Atribuir o poder de ser dono para a Liderança do grupo da pasta inteira." },
      { letter: "B", text: "Apenas leitura para a rede, sem comentários possíveis." },
      { letter: "C", text: "Leitura e Gravação sobre o diretório necessário de acesso das planilhas." },
      { letter: "D", text: "A permissão total incondicional a qualquer conta da gerência visando o uso livre e descentralizado." }
    ],
    correct: 2,
    explanation: "A permissão de leitura permite consultar o arquivo e a de gravação, modificá-lo - inserindo seus comentários, que é o limite das suas ações pretendidas pelas Lideranças."
  },
  {
    id: 15,
    level: "Nível 4 — Avançado",
    scenario: "Há um aumento do risco interno após diversas senhas de colaboradores terem sido descobertas recentemente em listas públicas ou fóruns (senhas como 'brasil123').",
    text: "Qual configuração na política deve ser enrijecida primeiramente?",
    options: [
      { letter: "A", text: "Políticas relacionadas diretamente a comprimento mínimo e também proibição de senhas comuns e fracas." },
      { letter: "B", text: "Limitar pelo geofencing o perímetro da cidade aos dados em rede interna." },
      { letter: "C", text: "Aplicar restrições baseadas unicamente em relatórios de auditoria diária do setor jurídico." },
      { letter: "D", text: "Garantir as permissões sobre leitura apenas no modo local." }
    ],
    correct: 0,
    explanation: "Para agir diretamente no vazamento das senhas ditas óbvias se utiliza da política de comprimento longo ou de complexidade ao lado da proibição e bloqueio de senhas comuns."
  }
];

// Prize ladder
const PRIZES = [
  { q: 1, pts: 5, label: "5 pts", milestone: false },
  { q: 2, pts: 10, label: "10 pts", milestone: false },
  { q: 3, pts: 20, label: "20 pts", milestone: true },
  { q: 4, pts: 40, label: "40 pts", milestone: false },
  { q: 5, pts: 100, label: "100 pts", milestone: true },
];

export default function AtividadeM5A02() {
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lifelines, setLifelines] = useState({ "50": true, skip: true, time: true });
  const [selectedDisplayIdx, setSelectedDisplayIdx] = useState(null);
  const [correctDisplayIdx, setCorrectDisplayIdx] = useState(null);
  const [optOrder, setOptOrder] = useState([0, 1, 2, 3]);
  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function selectQuestions() {
    return shuffle(QUESTION_BANK).slice(0, 5);
  }

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
    setTotalTime((prev) => prev + 30);
  };

  const startQuiz = () => {
    if (playerName.trim().length < 2) return;
    const selected = selectQuestions();
    setQuestions(selected);
    setQIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTotalTime(0);
    setAnswered(false);
    setLifelines({ "50": true, skip: true, time: true });
    setStartTime(Date.now());
    prepareQuestion(selected[0], 0);
    setScreen("quiz");
  };

  const prepareQuestion = (q, idx) => {
    const order = shuffle([0, 1, 2, 3]);
    setOptOrder(order);
    const correctIdx = order.indexOf(q.correct);
    setCorrectDisplayIdx(correctIdx);
    setSelectedDisplayIdx(null);
    setAnswered(false);
    setTimeLeft(30);
  };

  const selectAnswer = (displayIdx, origIdx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setSelectedDisplayIdx(displayIdx);
    setTotalTime((prev) => prev + (30 - timeLeft));

    const q = questions[qIndex];
    if (origIdx === q.correct) {
      setCorrectCount((prev) => prev + 1);
      const pointsToAdd = PRIZES[qIndex].pts;
      setScore((prev) => prev + pointsToAdd);
    } else {
      setWrongCount((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (qIndex < 4) {
      const nextIdx = qIndex + 1;
      setQIndex(nextIdx);
      prepareQuestion(questions[nextIdx], nextIdx);
    } else {
      endQuiz();
    }
  };

  const endQuiz = async () => {
    const finalScore = score;
    const finalCorrect = correctCount;
    const finalWrong = answered && selectedDisplayIdx === null ? wrongCount : wrongCount; 
    const avgTime = Math.round(totalTime / 5);

    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName,
        score: finalScore,
        correct: finalCorrect,
        wrong: finalWrong,
        avgTime: avgTime,
        duration: totalTime * 1000,
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
        module: "M05_A02" // Distinct identifier
      });
    } catch (e) {
      console.error("Erro ao salvar ranking:", e);
    }

    setScreen("result");
  };

  const restartQuiz = () => {
    setScreen("start");
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
    setTotalTime(prev => prev + (30 - timeLeft));
  };

  const useLifelineTime = () => {
    if (!lifelines.time || answered) return;
    setLifelines(prev => ({ ...prev, time: false }));
    setTimeLeft(prev => Math.min(prev + 10, 30));
  };

  const getLevelInfo = (s) => {
    const levels = [
      { min: 0, emoji: "🔰", label: "Aprendiz de Políticas", color: "#5a7a9a" },
      { min: 20, emoji: "🛡️", label: "Analista de Senhas", color: "#00e5ff" },
      { min: 40, emoji: "⚡", label: "Controlador de Bloqueios", color: "#00ff88" },
      { min: 70, emoji: "🔑", label: "Auditor de Acessos", color: "#ffd600" },
      { min: 100, emoji: "🏆", label: "Mestre dos Atributos!", color: "#ffd600" },
    ];
    let lvl = levels[0];
    levels.forEach(l => { if (s >= l.min) lvl = l; });
    return lvl;
  };

  const q = questions[qIndex];

  return (
    <div style={{
      backgroundColor: "#050a1a",
      color: "#e0f0ff",
      fontFamily: "'Rajdhani', sans-serif",
      minHeight: "100vh",
      position: "relative",
      padding: "20px 16px",
      overflowX: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; opacity: 0.06;
          background-image: linear-gradient(#00e5ff 1px, transparent 1px), linear-gradient(90deg, #00e5ff 1px, transparent 1px);
          background-size: 50px 50px; pointer-events: none;
        }
        .container { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
        .header { text-align: center; padding: 24px 0 20px; border-bottom: 1px solid #1a3a6e; margin-bottom: 24px; }
        .header-badge { display: inline-block; font-family: 'Orbitron', sans-serif; font-size: 10px; letter-spacing: 3px; color: #ff007b; text-transform: uppercase; border: 1px solid #ff007b; padding: 4px 14px; border-radius: 2px; margin-bottom: 12px; box-shadow: 0 0 20px #ff007b55; }
        .header h1 { font-family: 'Orbitron', sans-serif; font-size: clamp(18px, 4vw, 28px); font-weight: 900; color: #fff; line-height: 1.2; }
        .header h1 span { color: #ff007b; }
        .header-sub { font-size: 13px; color: #5a7a9a; margin-top: 6px; letter-spacing: 1px; }
        
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 36px; border: none; border-radius: 4px; font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all .2s; }
        .btn-primary { background: #ff007b; color: #fff; box-shadow: 0 0 20px #ff007b55; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px #ff007b88; }
        .btn-primary:disabled { opacity: .4; cursor: not-allowed; transform: none; }
        .btn-outline { background: transparent; border: 1px solid #1a3a6e; color: #5a7a9a; }
        .btn-outline:hover { border-color: #ff007b; color: #ff007b; }

        .q-card { background: #0a1628; border: 1px solid #1a3a6e; border-radius: 8px; padding: 24px; margin-bottom: 16px; }
        .q-level { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #ffd600; margin-bottom: 10px; }
        .q-scenario { background: #0d1f3c; border-left: 3px solid #ff007b; border-radius: 0 4px 4px 0; padding: 12px 16px; font-size: 14px; color: #5a7a9a; line-height: 1.6; margin-bottom: 16px; font-style: italic; }
        .q-text { font-size: 17px; font-weight: 600; line-height: 1.5; color: #e0f0ff; }
        
        .opt-btn { background: #0a1628; border: 1px solid #1a3a6e; border-radius: 6px; padding: 14px 16px; color: #e0f0ff; font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 500; text-align: left; cursor: pointer; transition: all .15s; display: flex; gap: 10px; align-items: flex-start; line-height: 1.4; width: 100%; }
        .opt-btn:hover:not(:disabled) { border-color: #ff007b; background: #ff007b0a; box-shadow: 0 0 20px #ff007b55; transform: translateY(-1px); }
        .opt-letter { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #ff007b; min-width: 20px; margin-top: 1px; }
        .opt-btn.correct { border-color: #00ff88; background: #00ff8815; box-shadow: 0 0 20px #00ff8855; }
        .opt-btn.wrong { border-color: #ff3d3d; background: #ff3d3d15; }

        .feedback-box { background: #0d1f3c; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; font-size: 14px; line-height: 1.5; border-left: 3px solid transparent; }
        .correct-fb { border-color: #00ff88; color: #00ff88; }
        .wrong-fb { border-color: #ff3d3d; color: #ff9090; }

        .prize-ladder { background: #0a1628; border: 1px solid #1a3a6e; border-radius: 6px; padding: 12px; align-self: start; }
        .prize-item { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; border-radius: 3px; font-size: 12px; margin-bottom: 2px; }
        .prize-item.active { background: #ff007b18; border: 1px solid #ff007b; color: #ff007b; }
        .prize-item.done { background: #00ff8810; color: #00ff88; }
        .prize-item.milestone { color: #ffd600; font-weight: 700; }
        
        .timer-ring { width: 56px; height: 56px; position: relative; margin: 0 auto 20px; }
        .timer-circle { transition: stroke-dashoffset 1s linear, stroke .3s; }
      `}</style>

      <div className="grid-bg"></div>

      <div className="container">
        <header className="header">
          <div className="header-badge">Atividade Interativa · Módulo 05 · Aula 02</div>
          <h1>Missão: <span>Políticas de Contas</span></h1>
          <p className="header-sub">Prof. Alexsander Farias · Atributos, Geofencing, Permissões e Auditoria</p>
        </header>

        {screen === "start" && (
          <div style={{ textAlign: "center", background: "#0a1628", border: "1px solid #1a3a6e", borderRadius: 8, padding: "36px 32px" }}>
            <div style={{ width: 80, height: 80, margin: "0 auto 20px", background: "linear-gradient(135deg, #ff007b, #7c3aed)", clipPath: "polygon(50% 0%, 100% 20%, 100% 70%, 50% 100%, 0% 70%, 0% 20%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 0 20px #ff007b55" }}>⚡</div>
            <h2 style={{ fontFamily: "Orbitron", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 900, color: "#fff", marginBottom: 6 }}>Desafio <span style={{ color: "#ff007b" }}>Políticas de Acesso</span></h2>
            <p style={{ color: "#5a7a9a", fontSize: 15, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.5 }}>
              Sistematize a segurança de uma rede ajustando atributos, configurações e bloqueios.
            </p>
            
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>⏱️</span>
                <span style={{ fontFamily: "Orbitron", fontSize: 14, color: "#ff007b", fontWeight: 700 }}>30s</span>
                <span style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>por questão</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>🎯</span>
                <span style={{ fontFamily: "Orbitron", fontSize: 14, color: "#ff007b", fontWeight: 700 }}>5 etapas</span>
                <span style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>aleatórias</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>🏆</span>
                <span style={{ fontFamily: "Orbitron", fontSize: 14, color: "#ff007b", fontWeight: 700 }}>100 pts</span>
                <span style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>máximo</span>
              </div>
            </div>

            <div style={{ maxWidth: 360, margin: "0 auto 24px" }}>
              <label style={{ display: "block", fontSize: 12, letterSpacing: 2, color: "#5a7a9a", textTransform: "uppercase", marginBottom: 8 }}>Seu nome completo</label>
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Digite seu nome completo..."
                style={{ width: "100%", background: "#0a1628", border: "1px solid #1a3a6e", borderRadius: 4, padding: "12px 16px", color: "#e0f0ff", fontFamily: "Rajdhani", fontSize: 16, outline: "none" }}
              />
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={startQuiz}
              disabled={playerName.trim().length < 2}
            >
              Iniciar Desafio →
            </button>
          </div>
        )}

        {screen === "quiz" && q && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#5a7a9a" }}>Analista: <strong style={{ color: "#ff007b", fontSize: 15 }}>{playerName}</strong></div>
              <div style={{ fontFamily: "Orbitron", fontSize: 12, color: "#5a7a9a", textAlign: "center" }}>Etapa <span style={{ color: "#ffd600", fontSize: 20, fontWeight: 700 }}>{qIndex + 1}</span> de 5</div>
              <div style={{ textAlign: "right", fontFamily: "Orbitron", fontSize: 12, color: "#5a7a9a" }}>Pontos: <span style={{ color: "#00ff88", fontSize: 18, fontWeight: 700 }}>{score}</span></div>
            </div>

            <div style={{ height: 4, background: "#0d1f3c", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #ff007b, #00ff88)", width: `${(qIndex / 5) * 100}%`, transition: "width 0.4s ease", boxShadow: "0 0 20px #ff007b55" }}></div>
            </div>

            <div className="timer-ring">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#0d1f3c" strokeWidth="4"/>
                <circle 
                  className="timer-circle" 
                  cx="28" cy="28" r="24" fill="none" stroke={timeLeft <= 8 ? "#ff3d3d" : "#ff007b"} strokeWidth="4"
                  strokeDasharray="150.8" 
                  strokeDashoffset={150.8 * (1 - timeLeft / 30)} 
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Orbitron", fontSize: 16, fontWeight: 700, color: timeLeft <= 8 ? "#ff3d3d" : "#ff007b" }}>{timeLeft}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 20 }}>
              <div>
                <div className="q-card">
                  <div className="q-level">{q.level}</div>
                  <div className="q-scenario">{q.scenario}</div>
                  <div className="q-text">{q.text}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {optOrder.map((origIdx, displayIdx) => {
                    const opt = q.options[origIdx];
                    const letters = ["A", "B", "C", "D"];
                    let className = "opt-btn";
                    if (answered) {
                      if (origIdx === q.correct) className += " correct";
                      else if (displayIdx === selectedDisplayIdx) className += " wrong";
                    }
                    return (
                      <button 
                        key={displayIdx} 
                        className={className}
                        onClick={() => selectAnswer(displayIdx, origIdx)}
                        disabled={answered}
                      >
                        <span className="opt-letter">{letters[displayIdx]}</span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className={`feedback-box ${selectedDisplayIdx !== null && optOrder[selectedDisplayIdx] === q.correct ? "correct-fb" : "wrong-fb"}`}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      {selectedDisplayIdx === null ? "⏱️ Tempo esgotado!" : 
                       optOrder[selectedDisplayIdx] === q.correct ? "✅ Resposta correta!" : "❌ Resposta incorreta."}
                    </div>
                    <div style={{ color: "#5a7a9a", fontSize: 13 }}>{q.explanation}</div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                  <button className="btn-outline" style={{ padding: "8px 14px", fontSize: 13, borderRadius: 6, cursor: "pointer" }} disabled={!lifelines["50"] || answered} onClick={useLifeline50}>✂️ 50:50</button>
                  <button className="btn-outline" style={{ padding: "8px 14px", fontSize: 13, borderRadius: 6, cursor: "pointer" }} disabled={!lifelines.skip || answered} onClick={useLifelineSkip}>⏭️ Pular</button>
                  <button className="btn-outline" style={{ padding: "8px 14px", fontSize: 13, borderRadius: 6, cursor: "pointer" }} disabled={!lifelines.time || answered} onClick={useLifelineTime}>⏱️ +10s</button>
                </div>

                {answered && (
                  <div style={{ textAlign: "center" }}>
                    <button className="btn btn-primary" onClick={nextQuestion}>
                      {qIndex < 4 ? "Próxima Etapa →" : "Ver Resultado Final →"}
                    </button>
                  </div>
                )}
              </div>

              <div className="prize-ladder">
                <h3 style={{ fontFamily: "Orbitron", fontSize: 9, letterSpacing: 2, color: "#5a7a9a", textAlign: "center", marginBottom: 10 }}>📊 ETAPAS</h3>
                {[...PRIZES].reverse().map(p => (
                  <div key={p.q} className={`prize-item ${p.milestone ? "milestone" : ""} ${p.q === qIndex + 1 ? "active" : p.q < qIndex + 1 ? "done" : ""}`}>
                    <span>Etapa {p.q}</span>
                    <span style={{ fontFamily: "Orbitron", fontSize: 10 }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen === "result" && (
          <div style={{ maxWidth: 600, margin: "0 auto", background: "#0a1628", border: "1px solid #1a3a6e", borderRadius: 8, padding: "36px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{getLevelInfo(score).emoji}</div>
            <div style={{ fontFamily: "Orbitron", fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 900, margin: "12px 0", color: getLevelInfo(score).color }}>{getLevelInfo(score).label}</div>
            <div style={{ fontFamily: "Orbitron", fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 900, color: "#ff007b", lineHeight: 1, textShadow: "0 0 20px #ff007b55" }}>{score}</div>
            <div style={{ color: "#5a7a9a", fontSize: 14, marginBottom: 20 }}>pontos acumulados</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "#0d1f3c", border: "1px solid #1a3a6e", borderRadius: 6, padding: 12 }}>
                <div style={{ fontFamily: "Orbitron", fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#00ff88" }}>{correctCount}</div>
                <div style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>Acertos</div>
              </div>
              <div style={{ background: "#0d1f3c", border: "1px solid #1a3a6e", borderRadius: 6, padding: 12 }}>
                <div style={{ fontFamily: "Orbitron", fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#ff3d3d" }}>{wrongCount}</div>
                <div style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>Erros</div>
              </div>
              <div style={{ background: "#0d1f3c", border: "1px solid #1a3a6e", borderRadius: 6, padding: 12 }}>
                <div style={{ fontFamily: "Orbitron", fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#ffd600" }}>{Math.round(totalTime / 5)}s</div>
                <div style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>Tempo médio</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={restartQuiz}>🔄 Refazer Desafio</button>
              <button className="btn btn-outline" onClick={() => window.location.href = "/hackersdobem"}>🏠 Voltar ao Hub</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
