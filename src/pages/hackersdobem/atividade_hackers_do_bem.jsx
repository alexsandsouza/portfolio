import { useState, useEffect, useRef } from "react";
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ============================================================
//  QUESTION BANK – 15 situação-problema questions
// ============================================================
const QUESTION_BANK = [
  {
    id: 1,
    level: "Nível 1 — Iniciante",
    scenario: "A SeguraTech contratou um novo analista de suporte. O gestor de TI precisa criar a conta de acesso ao sistema interno e definir as permissões adequadas ao cargo.",
    text: "Qual abordagem está alinhada ao princípio de Menor Privilégio no processo de provisionamento dessa conta?",
    options: [
      { letter: "A", text: "Conceder ao analista acesso irrestrito ao sistema para evitar chamados recorrentes de suporte." },
      { letter: "B", text: "Atribuir apenas as permissões necessárias para as funções do cargo, realizando revisão periódica." },
      { letter: "C", text: "Criar uma conta genérica compartilhada com outros analistas para simplificar o gerenciamento." },
      { letter: "D", text: "Replicar as permissões do analista sênior como ponto de partida, ajustando depois se necessário." },
    ],
    correct: 1,
    explanation: "O princípio de Menor Privilégio determina que o usuário deve receber apenas os direitos estritamente necessários ao seu cargo, com auditorias periódicas para identificar não conformidades e revogar acessos desnecessários."
  },
  {
    id: 2,
    level: "Nível 1 — Iniciante",
    scenario: "Um fornecedor externo precisa acessar temporariamente o servidor de arquivos da SeguraTech para entregar um relatório. O prazo é de 48 horas.",
    text: "Qual tipo de conta é tecnicamente mais adequado para atender a essa demanda com segurança?",
    options: [
      { letter: "A", text: "Conta administrativa local com permissões elevadas para garantir acesso irrestrito ao servidor." },
      { letter: "B", text: "Conta padrão permanente criada no Active Directory vinculada ao domínio corporativo." },
      { letter: "C", text: "Conta de convidado com restrições de acesso, período de validade definido e monitoramento ativo." },
      { letter: "D", text: "Credencial compartilhada com a equipe interna para facilitar a entrega e evitar configurações extras." },
    ],
    correct: 2,
    explanation: "Contas de convidado são criadas exatamente para usuários externos ou temporários: possuem restrições de acesso, privilégios limitados, podem ter período de validade definido e devem ser monitoradas e auditadas."
  },
  {
    id: 3,
    level: "Nível 2 — Básico",
    scenario: "Durante uma auditoria, o time de segurança da SeguraTech identificou que o mesmo colaborador autoriza e executa transferências financeiras no sistema ERP sem nenhuma revisão por terceiros.",
    text: "Qual política de pessoal deveria ter sido implementada para mitigar esse risco operacional?",
    options: [
      { letter: "A", text: "Rotação de Cargos, transferindo o colaborador para outra função após determinado período." },
      { letter: "B", text: "Licença Obrigatória, afastando o colaborador periodicamente para identificar irregularidades." },
      { letter: "C", text: "Separação de Funções, dividindo as responsabilidades de autorização e execução entre pessoas distintas." },
      { letter: "D", text: "Verificação de Antecedentes, checando o histórico criminal do colaborador antes da concessão do acesso." },
    ],
    correct: 2,
    explanation: "A Separação de Funções determina que nenhum indivíduo deve ter controle absoluto sobre uma função crítica. Dividir autorização e execução entre pessoas distintas reduz riscos de abuso, erros e fraudes."
  },
  {
    id: 4,
    level: "Nível 2 — Básico",
    scenario: "A SeguraTech precisa que um processo de backup rode automaticamente toda madrugada no servidor Windows, acessando recursos de rede como compartilhamentos de arquivo sem interação humana.",
    text: "Qual categoria de conta deve ser utilizada para executar corretamente esse processo automatizado?",
    options: [
      { letter: "A", text: "Conta de Administrador local, pois possui privilégios suficientes para acessar todos os recursos." },
      { letter: "B", text: "Conta de Convidado temporária criada especificamente para a janela de execução do backup." },
      { letter: "C", text: "Conta de Serviço de Rede (Network Service Account), projetada para processos que acessam recursos de rede." },
      { letter: "D", text: "Conta padrão de usuário com permissões elevadas manualmente para a janela noturna de execução." },
    ],
    correct: 2,
    explanation: "A Conta de Serviço de Rede (Network Service Account) é exatamente o tipo projetado para executar serviços que precisam acessar recursos de rede como compartilhamentos, sem necessidade de conta administrativa ou interação humana."
  },
  {
    id: 5,
    level: "Nível 3 — Intermediário",
    scenario: "Um analista da SeguraTech precisa autenticar-se via SSH em múltiplos servidores Linux para tarefas de manutenção. O gestor de segurança avalia qual método de autenticação adotar.",
    text: "Considerando segurança e resistência a ataques, qual método oferece melhor proteção para esse cenário?",
    options: [
      { letter: "A", text: "Autenticação por senha complexa com troca mensal obrigatória em todos os servidores." },
      { letter: "B", text: "Chaves SSH com par criptográfico público-privado, mais resistentes a força bruta e phishing." },
      { letter: "C", text: "Token OTP gerado por provedor de identidade externo para cada sessão de acesso SSH." },
      { letter: "D", text: "Certificado digital emitido pela AC corporativa armazenado em smart card do analista." },
    ],
    correct: 1,
    explanation: "Chaves SSH usam pares criptográficos (chave pública e privada), sendo mais difíceis de comprometer por ataques de força bruta e menos suscetíveis a phishing do que senhas convencionais — vantagem técnica direta sobre os demais métodos."
  },
  {
    id: 6,
    level: "Nível 3 — Intermediário",
    scenario: "A SeguraTech implementou um sistema de Single Sign-On (SSO) integrado a um Provedor de Identidade (IdP). Um incidente de segurança revelou que tokens de sessão foram interceptados e reutilizados.",
    text: "Qual vulnerabilidade técnica esse incidente evidencia no modelo de autenticação por tokens?",
    options: [
      { letter: "A", text: "Ausência de certificado digital vinculando a identidade do usuário à infraestrutura de chaves públicas." },
      { letter: "B", text: "Uso de conta genérica compartilhada no IdP, impossibilitando auditoria individual das sessões." },
      { letter: "C", text: "Falha na separação de funções entre o provedor de identidade e as aplicações dependentes." },
      { letter: "D", text: "Possibilidade de replay attack, em que um ator malicioso reproduz o token para obter acesso não autorizado." },
    ],
    correct: 3,
    explanation: "O uso de tokens traz o risco de replay attack: um ator malicioso pode interceptar e reproduzir o token criptográfico, obtendo acesso não autorizado às aplicações sem precisar das credenciais originais."
  },
  {
    id: 7,
    level: "Nível 3 — Intermediário",
    scenario: "Um gerente financeiro da SeguraTech foi promovido e acumulou, ao longo de três anos, permissões de diferentes cargos anteriores. O time de TI nunca revogou os acessos antigos.",
    text: "Qual falha no processo de gestão de identidade esse cenário caracteriza tecnicamente?",
    options: [
      { letter: "A", text: "Ausência de verificação de antecedentes durante o recrutamento inicial do colaborador." },
      { letter: "B", text: "Não aplicação do princípio de Menor Privilégio com ausência de auditoria e revogação periódica de acessos." },
      { letter: "C", text: "Falha no processo de offboarding do cargo anterior, sem encerramento formal da conta de convidado." },
      { letter: "D", text: "Violação da política de rotação de cargos por permanência excessiva no mesmo departamento." },
    ],
    correct: 1,
    explanation: "O acúmulo de permissões viola o Menor Privilégio. A política exige auditorias periódicas para identificar não conformidades e diretrizes claras para revogação de privilégios quando o colaborador muda de função."
  },
  {
    id: 8,
    level: "Nível 4 — Avançado",
    scenario: "A SeguraTech contratou uma empresa parceira para um projeto de 6 meses. O contrato exige que os dados estratégicos compartilhados sejam mantidos em sigilo mesmo após o término do projeto.",
    text: "Qual instrumento jurídico-operacional deve ser formalizado durante o onboarding para garantir essa proteção?",
    options: [
      { letter: "A", text: "Política de Rotação de Cargos, exigindo que o parceiro alterne os profissionais envolvidos periodicamente." },
      { letter: "B", text: "Processo de verificação de antecedentes de todos os colaboradores da empresa parceira." },
      { letter: "C", text: "Acordo de Confidencialidade (NDA), estabelecendo termos e condições sobre a proteção das informações." },
      { letter: "D", text: "Criação de conta administrativa para o parceiro com auditoria completa de todas as ações realizadas." },
    ],
    correct: 2,
    explanation: "O Acordo de Confidencialidade (NDA) é exatamente o instrumento que estabelece termos e condições quanto à confidencialidade das informações, protegendo dados sensíveis e estratégicos mesmo após o término do projeto."
  },
  {
    id: 9,
    level: "Nível 4 — Avançado",
    scenario: "A SeguraTech detectou que um colaborador demitido há duas semanas ainda possui credenciais ativas no sistema de e-mail corporativo e acesso à VPN da empresa.",
    text: "Qual etapa do processo de offboarding foi negligenciada e que falha de segurança esse cenário representa?",
    options: [
      { letter: "A", text: "Ausência de verificação de antecedentes pós-demissão para identificar atividades suspeitas recentes." },
      { letter: "B", text: "Falha na etapa de Gerenciamento de Contas do offboarding, com credenciais não revogadas após desligamento." },
      { letter: "C", text: "Não aplicação da Separação de Funções durante o período de aviso prévio do colaborador." },
      { letter: "D", text: "Ausência de licença obrigatória prévia à demissão para revisão independente das atividades do colaborador." },
    ],
    correct: 1,
    explanation: "O offboarding inclui obrigatoriamente o Gerenciamento de Contas: revogar credenciais, desativar acessos e encerrar sessões ativas. Manter credenciais ativas após desligamento representa risco crítico de acesso não autorizado."
  },
  {
    id: 10,
    level: "Nível 4 — Avançado",
    scenario: "O administrador de redes da SeguraTech identificou que a conta 'root' do servidor Linux está sendo utilizada diretamente por três analistas diferentes para tarefas cotidianas de administração.",
    text: "Qual risco de segurança essa prática introduz e qual é a ação corretiva mais adequada?",
    options: [
      { letter: "A", text: "Risco de phishing nas contas individuais; a correção é habilitar autenticação multifator para o root." },
      { letter: "B", text: "Risco de ausência de auditoria individual; cada analista deve usar sua conta padrão com escalada controlada de privilégios." },
      { letter: "C", text: "Risco de separação de funções inadequada; deve-se criar contas de grupo de segurança para as tarefas compartilhadas." },
      { letter: "D", text: "Risco de token replay nas sessões root; a mitigação é implementar chaves SSH exclusivas para o acesso root." },
    ],
    correct: 1,
    explanation: "Contas root/Administrador devem ser monitoradas e auditadas. Compartilhá-las entre analistas elimina a rastreabilidade das ações. A correção é usar contas individuais com escalada controlada de privilégios (ex.: sudo), mantendo logs auditáveis por usuário."
  },
  {
    id: 11,
    level: "Nível 5 — Especialista",
    scenario: "A SeguraTech está avaliando a adoção de certificados digitais para autenticar dispositivos na rede interna. A equipe discute onde armazenar os certificados emitidos pela Autoridade Certificadora (AC) interna.",
    text: "Qual solução de armazenamento oferece maior segurança física e lógica para os certificados digitais dos dispositivos?",
    options: [
      { letter: "A", text: "Repositório centralizado em servidor de arquivos com permissões restritas ao grupo de administradores de TI." },
      { letter: "B", text: "Arquivo de configuração criptografado no próprio dispositivo, protegido por senha complexa do usuário." },
      { letter: "C", text: "Smart card ou token USB criptográfico, isolando a chave privada do ambiente computacional comum." },
      { letter: "D", text: "Cofre de senhas corporativo com acesso auditado via autenticação multifator para os analistas." },
    ],
    correct: 2,
    explanation: "Certificados digitais e suas chaves privadas podem ser armazenados em smart cards ou tokens USB criptográficos. Esse isolamento físico impede extração da chave privada do ambiente computacional, elevando significativamente a segurança."
  },
  {
    id: 12,
    level: "Nível 5 — Especialista",
    scenario: "A SeguraTech implementou um Provedor de Identidade (IdP) federado para que colaboradores acessem sistemas internos e serviços de parceiros usando uma única identidade corporativa.",
    text: "Qual benefício operacional direto esse modelo de federação de identidade proporciona aos usuários?",
    options: [
      { letter: "A", text: "Elimina a necessidade de certificados digitais, pois o IdP autentica todos os acessos via tokens OTP." },
      { letter: "B", text: "Permite acesso a múltiplos sistemas e serviços sem criar contas separadas em cada um deles." },
      { letter: "C", text: "Garante a separação de funções automática entre os diferentes sistemas acessados pelo colaborador." },
      { letter: "D", text: "Substitui a verificação de antecedentes, pois o IdP valida a identidade do usuário em tempo real." },
    ],
    correct: 1,
    explanation: "Provedores de Identidade federados permitem que, após autenticação única em um IdP confiável, o usuário utilize essa identidade em diferentes sites ou serviços sem precisar criar contas separadas para cada um."
  },
  {
    id: 13,
    level: "Nível 2 — Básico",
    scenario: "Durante o processo seletivo para uma vaga de analista financeiro sênior na SeguraTech, o RH recebe o currículo de um candidato com histórico profissional extenso, mas sem referências verificáveis.",
    text: "Qual procedimento de segurança de pessoal é mandatório para cargos com acesso a transações de alto valor?",
    options: [
      { letter: "A", text: "Aplicação de teste técnico eliminatório para avaliar o conhecimento em sistemas financeiros da empresa." },
      { letter: "B", text: "Assinatura do Acordo de Confidencialidade (NDA) antes da divulgação de qualquer informação interna." },
      { letter: "C", text: "Verificação de Antecedentes, avaliando identidade, histórico criminal e vínculos que comprometam o cargo." },
      { letter: "D", text: "Período de experiência monitorada de 90 dias antes da concessão de acesso ao sistema financeiro." },
    ],
    correct: 2,
    explanation: "Em ambientes com acesso a transações de alto valor, a Verificação de Antecedentes é mandatória. Ela avalia se o candidato é quem diz ser e se não possui vínculos, histórico criminal ou falências que o tornem inadequado ao cargo."
  },
  {
    id: 14,
    level: "Nível 3 — Intermediário",
    scenario: "A SeguraTech identificou que um analista de infraestrutura atua no mesmo cargo há cinco anos sem rotação. Durante esse período, ele acumulou conhecimento exclusivo sobre configurações críticas de firewall.",
    text: "Qual risco organizacional essa situação representa e qual política mitiga esse problema?",
    options: [
      { letter: "A", text: "Risco de falha técnica acumulada; a mitigação é licença obrigatória para revisão independente das configurações." },
      { letter: "B", text: "Risco de dependência de indivíduo chave e potencial abuso de poder; a mitigação é a Rotação de Cargos." },
      { letter: "C", text: "Risco de violação do Menor Privilégio por acúmulo de conhecimento; a mitigação é auditoria periódica de acessos." },
      { letter: "D", text: "Risco de separação de funções inadequada; a mitigação é distribuir as configurações entre múltiplos analistas." },
    ],
    correct: 1,
    explanation: "A Rotação de Cargos previne exatamente esse cenário: nenhuma pessoa deve permanecer no mesmo cargo por longo período, reduzindo dependência de indivíduo, prevenindo abuso de poder e aprimorando habilidades da equipe."
  },
  {
    id: 15,
    level: "Nível 4 — Avançado",
    scenario: "O gestor de segurança da SeguraTech suspeita que um colaborador está manipulando registros financeiros. Ele solicita ao RH que o colaborador seja afastado por 15 dias para uma investigação interna.",
    text: "Qual política de segurança de pessoal é aplicada nesse cenário e qual seu objetivo técnico-operacional?",
    options: [
      { letter: "A", text: "Rotação de Cargos, transferindo o colaborador para outra função durante o período de investigação." },
      { letter: "B", text: "Verificação de Antecedentes complementar, revisando o histórico do colaborador suspeito novamente." },
      { letter: "C", text: "Licença Obrigatória, permitindo revisão independente das atividades e identificação de irregularidades." },
      { letter: "D", text: "Separação de Funções emergencial, redistribuindo as responsabilidades do colaborador entre a equipe." },
    ],
    correct: 2,
    explanation: "A Licença Obrigatória determina que outra pessoa assuma as responsabilidades do colaborador afastado, possibilitando revisão independente das atividades e identificação de possíveis irregularidades ou manipulações."
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

export default function AtividadeHackersDoBem() {
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

  // ============================================================
  //  UTILS
  // ============================================================
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function selectQuestions() {
    // Basic shuffle and pick 5
    return shuffle(QUESTION_BANK).slice(0, 5);
  }

  // ============================================================
  //  TIMER
  // ============================================================
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

  // ============================================================
  //  ACTIONS
  // ============================================================
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
    const finalWrong = answered && selectedDisplayIdx === null ? wrongCount : wrongCount; // logic check
    const avgTime = Math.round(totalTime / 5);

    // Save to Firestore
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
        module: "M05A01"
      });
    } catch (e) {
      console.error("Erro ao salvar ranking:", e);
    }

    setScreen("result");
  };

  const restartQuiz = () => {
    setScreen("start");
  };

  // ============================================================
  //  LIFELINES
  // ============================================================
  const useLifeline50 = () => {
    if (!lifelines["50"] || answered) return;
    setLifelines(prev => ({ ...prev, "50": false }));
    // In a real implementation, we'd hide 2 wrong options.
    // Simplifying for React by marking which ones to hide.
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

  // ============================================================
  //  RENDER HELPERS
  // ============================================================
  const getLevelInfo = (s) => {
    const levels = [
      { min: 0, emoji: "🔰", label: "Aprendiz em Segurança", color: "#5a7a9a" },
      { min: 20, emoji: "🛡️", label: "Analista Iniciante", color: "#00e5ff" },
      { min: 40, emoji: "⚡", label: "Especialista em Acesso", color: "#00ff88" },
      { min: 70, emoji: "🔑", label: "Guardião de Identidades", color: "#ffd600" },
      { min: 100, emoji: "🏆", label: "Hacker do Bem — Elite!", color: "#ffd600" },
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
        .header-badge { display: inline-block; font-family: 'Orbitron', sans-serif; font-size: 10px; letter-spacing: 3px; color: #00e5ff; text-transform: uppercase; border: 1px solid #00e5ff; padding: 4px 14px; border-radius: 2px; margin-bottom: 12px; box-shadow: 0 0 20px #00e5ff55; }
        .header h1 { font-family: 'Orbitron', sans-serif; font-size: clamp(18px, 4vw, 28px); font-weight: 900; color: #fff; line-height: 1.2; }
        .header h1 span { color: #00e5ff; }
        .header-sub { font-size: 13px; color: #5a7a9a; margin-top: 6px; letter-spacing: 1px; }
        
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 36px; border: none; border-radius: 4px; font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all .2s; }
        .btn-primary { background: #00e5ff; color: #000; box-shadow: 0 0 20px #00e5ff55; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px #00e5ff88; }
        .btn-primary:disabled { opacity: .4; cursor: not-allowed; transform: none; }
        .btn-outline { background: transparent; border: 1px solid #1a3a6e; color: #5a7a9a; }
        .btn-outline:hover { border-color: #00e5ff; color: #00e5ff; }

        .q-card { background: #0a1628; border: 1px solid #1a3a6e; border-radius: 8px; padding: 24px; margin-bottom: 16px; }
        .q-level { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #ffd600; margin-bottom: 10px; }
        .q-scenario { background: #0d1f3c; border-left: 3px solid #00e5ff; border-radius: 0 4px 4px 0; padding: 12px 16px; font-size: 14px; color: #5a7a9a; line-height: 1.6; margin-bottom: 16px; font-style: italic; }
        .q-text { font-size: 17px; font-weight: 600; line-height: 1.5; color: #e0f0ff; }
        
        .opt-btn { background: #0a1628; border: 1px solid #1a3a6e; border-radius: 6px; padding: 14px 16px; color: #e0f0ff; font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 500; text-align: left; cursor: pointer; transition: all .15s; display: flex; gap: 10px; align-items: flex-start; line-height: 1.4; width: 100%; }
        .opt-btn:hover:not(:disabled) { border-color: #00e5ff; background: #00e5ff0a; box-shadow: 0 0 20px #00e5ff55; transform: translateY(-1px); }
        .opt-letter { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #00e5ff; min-width: 20px; margin-top: 1px; }
        .opt-btn.correct { border-color: #00ff88; background: #00ff8815; box-shadow: 0 0 20px #00ff8855; }
        .opt-btn.wrong { border-color: #ff3d3d; background: #ff3d3d15; }

        .feedback-box { background: #0d1f3c; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; font-size: 14px; line-height: 1.5; border-left: 3px solid transparent; }
        .correct-fb { border-color: #00ff88; color: #00ff88; }
        .wrong-fb { border-color: #ff3d3d; color: #ff9090; }

        .prize-ladder { background: #0a1628; border: 1px solid #1a3a6e; border-radius: 6px; padding: 12px; align-self: start; }
        .prize-item { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; border-radius: 3px; font-size: 12px; margin-bottom: 2px; }
        .prize-item.active { background: #00e5ff18; border: 1px solid #00e5ff; color: #00e5ff; }
        .prize-item.done { background: #00ff8810; color: #00ff88; }
        .prize-item.milestone { color: #ffd600; font-weight: 700; }
        
        .timer-ring { width: 56px; height: 56px; position: relative; margin: 0 auto 20px; }
        .timer-circle { transition: stroke-dashoffset 1s linear, stroke .3s; }
      `}</style>

      <div className="grid-bg"></div>

      <div className="container">
        <header className="header">
          <div className="header-badge">Hackers do Bem · Módulo 05</div>
          <h1>Missão: Proteja a <span>Rede da SeguraTech</span></h1>
          <p className="header-sub">Prof. Alexsander Farias · Aula 01 · Tipos de Contas e Identidades</p>
        </header>

        {/* START SCREEN */}
        {screen === "start" && (
          <div style={{ textAlign: "center", background: "#0a1628", border: "1px solid #1a3a6e", borderRadius: 8, padding: "36px 32px" }}>
            <div style={{ width: 80, height: 80, margin: "0 auto 20px", background: "linear-gradient(135deg, #00e5ff, #7c3aed)", clipPath: "polygon(50% 0%, 100% 20%, 100% 70%, 50% 100%, 0% 70%, 0% 20%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 0 20px #00e5ff55" }}>🛡️</div>
            <h2 style={{ fontFamily: "Orbitron", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 900, color: "#fff", marginBottom: 6 }}>Missão: Proteja a <span style={{ color: "#00e5ff" }}>SeguraTech</span></h2>
            <p style={{ color: "#5a7a9a", fontSize: 15, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.5 }}>
              Complete as 5 etapas, acumule pontos e descubra seu nível como especialista em segurança de identidades!
            </p>
            
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>⏱️</span>
                <span style={{ fontFamily: "Orbitron", fontSize: 14, color: "#00e5ff", fontWeight: 700 }}>30s</span>
                <span style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>por questão</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>🎯</span>
                <span style={{ fontFamily: "Orbitron", fontSize: 14, color: "#00e5ff", fontWeight: 700 }}>5 etapas</span>
                <span style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>por rodada</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>🏆</span>
                <span style={{ fontFamily: "Orbitron", fontSize: 14, color: "#00e5ff", fontWeight: 700 }}>100 pts</span>
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
              Iniciar Missão →
            </button>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {screen === "quiz" && q && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#5a7a9a" }}>Agente: <strong style={{ color: "#00e5ff", fontSize: 15 }}>{playerName}</strong></div>
              <div style={{ fontFamily: "Orbitron", fontSize: 12, color: "#5a7a9a", textAlign: "center" }}>Etapa <span style={{ color: "#ffd600", fontSize: 20, fontWeight: 700 }}>{qIndex + 1}</span> de 5</div>
              <div style={{ textAlign: "right", fontFamily: "Orbitron", fontSize: 12, color: "#5a7a9a" }}>Pontos: <span style={{ color: "#00ff88", fontSize: 18, fontWeight: 700 }}>{score}</span></div>
            </div>

            <div style={{ height: 4, background: "#0d1f3c", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #00e5ff, #00ff88)", width: `${(qIndex / 5) * 100}%`, transition: "width 0.4s ease", boxShadow: "0 0 20px #00e5ff55" }}></div>
            </div>

            <div className="timer-ring">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#0d1f3c" strokeWidth="4"/>
                <circle 
                  className="timer-circle" 
                  cx="28" cy="28" r="24" fill="none" stroke={timeLeft <= 8 ? "#ff3d3d" : "#00e5ff"} strokeWidth="4"
                  strokeDasharray="150.8" 
                  strokeDashoffset={150.8 * (1 - timeLeft / 30)} 
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Orbitron", fontSize: 16, fontWeight: 700, color: timeLeft <= 8 ? "#ff3d3d" : "#00e5ff" }}>{timeLeft}</div>
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
                  <div className={`feedback-box ${selectedDisplayIdx !== null && q.options[optOrder[selectedDisplayIdx]].letter === q.options[q.correct].letter ? "correct-fb" : "wrong-fb"}`}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      {selectedDisplayIdx === null ? "⏱️ Tempo esgotado!" : 
                       optOrder[selectedDisplayIdx] === q.correct ? "✅ Resposta correta! Excelente análise!" : "❌ Resposta incorreta. Veja o fundamento:"}
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

        {/* RESULT SCREEN */}
        {screen === "result" && (
          <div style={{ maxWidth: 600, margin: "0 auto", background: "#0a1628", border: "1px solid #1a3a6e", borderRadius: 8, padding: "36px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{getLevelInfo(score).emoji}</div>
            <div style={{ fontFamily: "Orbitron", fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 900, margin: "12px 0", color: getLevelInfo(score).color }}>{getLevelInfo(score).label}</div>
            <div style={{ fontFamily: "Orbitron", fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 900, color: "#00e5ff", lineHeight: 1, textShadow: "0 0 20px #00e5ff55" }}>{score}</div>
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
              <button className="btn btn-primary" onClick={restartQuiz}>🔄 Jogar Novamente</button>
              <button className="btn btn-outline" onClick={() => window.location.href = "/hackersdobem"}>🏠 Voltar ao Hub</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
