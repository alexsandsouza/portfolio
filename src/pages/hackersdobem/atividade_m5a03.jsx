import { useState, useEffect, useRef } from "react";
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ============================================================
//  QUESTION BANK – 15 situação-problema questions M5 Aula 03
// ============================================================
const QUESTION_BANK = [
  {
    id: 1,
    level: "Nível 1 — Iniciante",
    scenario: "Em uma pequena clínica, o médico que criou uma pasta de exames pode decidir independentemente quem mais na equipe tem permissão para acessá-la ou não, utilizando configurações do próprio sistema operacional.",
    text: "Qual modelo de controle de acesso está sendo utilizado, onde os próprios proprietários determinam as operações de outros?",
    options: [
      { letter: "A", text: "Role-Based Access Control (RBAC)." },
      { letter: "B", text: "Discretionary Access Control (DAC)." },
      { letter: "C", text: "Mandatory Access Control (MAC)." },
      { letter: "D", text: "Attribute-Based Access Control (ABAC)." }
    ],
    correct: 1,
    explanation: "No controle de acesso discricionário (DAC), o próprio criador ou proprietário do recurso gerencia quem pode acessá-lo e quais permissões conceder a outros."
  },
  {
    id: 2,
    level: "Nível 1 — Iniciante",
    scenario: "Um novo analista financeiro foi contratado. O sistema automaticamente concede a ele as mesmas permissões do analista sênior, simplesmente por ele assumir o cargo 'Analista Financeiro'.",
    text: "Qual modelo de autorização, muito comum nas empresas, aplica permissões baseando-se nos cargos exercidos organizacionalmente?",
    options: [
      { letter: "A", text: "Role-Based Access Control (RBAC)." },
      { letter: "B", text: "Mandatory Access Control (MAC)." },
      { letter: "C", text: "Discretionary Access Control (DAC)." },
      { letter: "D", text: "Privileged Access Management (PAM)." }
    ],
    correct: 0,
    explanation: "RBAC (Controle de Acesso Baseado em Função) mapeia as permissões a funções/cargos, e não diretamente a usuários individuais, facilitando a administração no mundo real."
  },
  {
    id: 3,
    level: "Nível 2 — Básico",
    scenario: "O governo implantou um sistema militar rigoroso em que dados confidenciais recebem rótulos de 'Alto' e só podem ser manipulados se o nível de segurança exigido pela política central do sistema for validado.",
    text: "Esse formato estrito centralizado em políticas mandatórias e rótulos de segurança é determinado por qual modelo?",
    options: [
      { letter: "A", text: "Attribute-Based Access Control (ABAC)." },
      { letter: "B", text: "Role-Based Access Control (RBAC)." },
      { letter: "C", text: "Discretionary Access Control (DAC)." },
      { letter: "D", text: "Mandatory Access Control (MAC)." }
    ],
    correct: 3,
    explanation: "No MAC (Controle de Acesso Obrigatório), as políticas são definidas estritamente pelo sistema e não há discrição de proprietários: dados e usuários recebem rótulos de segurança rigorosos."
  },
  {
    id: 4,
    level: "Nível 2 — Básico",
    scenario: "A permissão sobre um arquivo '.sh' no Linux é 'rwxr-xr-x'. Durante um incidente, um atacante com permissões de usuário padrão conseguiu descobrir o conteúdo exato do script observando o sistema de arquivos.",
    text: "Qual das permissões explícitas deste arquivo propiciou que o atacante lesse seu conteúdo?",
    options: [
      { letter: "A", text: "Escrita (w) habilitada no grupo." },
      { letter: "B", text: "Leitura (r) presente nas marcações finais (usuários normais)." },
      { letter: "C", text: "Execução (x) central." },
      { letter: "D", text: "Ausência de configuração MAC de bloqueio de rede." }
    ],
    correct: 1,
    explanation: "Nos sistemas de arquivos (como Linux com rwx), 'r' designa Read (Leitura), o que permitiu visualizar o que há dentro do arquivo."
  },
  {
    id: 5,
    level: "Nível 3 — Intermediário",
    scenario: "Com o aumento das ameaças internas, a organização precisa gerir e rastrear profundamente todas as credenciais sensíveis (ex. senhas de conta root ou administrator), além de implementar rotação de senhas e cofre seguro.",
    text: "Como se chama o procedimento focado em controlar exclusivamente o ciclo e atividades do acesso administrativo de alto nível?",
    options: [
      { letter: "A", text: "Security Assertion Markup Language (SAML)." },
      { letter: "B", text: "Simple Object Access Protocol (SOAP)." },
      { letter: "C", text: "Privileged Access Management (PAM)." },
      { letter: "D", text: "Federação de Identidades Restrita." }
    ],
    correct: 2,
    explanation: "O PAM (Privileged Access Management) engloba soluções focadas especificamente em controlar, monitorar e rotacionar as contas com privilégios super-administrativos."
  },
  {
    id: 6,
    level: "Nível 3 — Intermediário",
    scenario: "A infraestrutura da empresa cresceu consideravelmente e a equipe precisa de um repositório hierárquico, leve, ágil e em formato de diretório onde o email seja associado aos dados da filial para organizar as listagens.",
    text: "Qual protocolo e formato atende especificamente ao serviço de armazenamento de diretórios sendo uma versão viável baseada no X.500?",
    options: [
      { letter: "A", text: "RESTful HTTP." },
      { letter: "B", text: "SAML." },
      { letter: "C", text: "SOAP (Simple Object Access Protocol)." },
      { letter: "D", text: "LDAP (Lightweight Directory Access Protocol)." }
    ],
    correct: 3,
    explanation: "LDAP é um protocolo de serviços de diretório, simplificado em relação ao X.500, amplamente usado e projetado para organizar informações hierarquicamente de forma rápida."
  },
  {
    id: 7,
    level: "Nível 3 — Intermediário",
    scenario: "Ao analisar a configuração de usuários do Microsoft Active Directory, o analista visualizou a propriedade indicando que um objeto fazia parte de 'ou=RH,dc=empresa,dc=com'.",
    text: "O que 'OU' e 'DC' respectivamente representam em um diretório LDAP/X.500?",
    options: [
      { letter: "A", text: "Object Unifier (OU) e Domain Controller (DC)." },
      { letter: "B", text: "Organizational Unit (OU) e Domain Component (DC)." },
      { letter: "C", text: "Organization (OU) e Device Configuration (DC)." },
      { letter: "D", text: "Common Name (CN) travestido por Organization Unit (OU)." }
    ],
    correct: 1,
    explanation: "Nas árvores de diretórios (LDAP), 'OU' significa Organizational Unit (Unidade Organizacional) e 'DC' é o Domain Component (Componente de Domínio)."
  },
  {
    id: 8,
    level: "Nível 4 — Avançado",
    scenario: "Três diferentes empresas hospitalares formaram um consórcio. O médico da Empresa A quer usar as mesmas credenciais corporativas que já tem para fazer login diretamente no portal do hospital filial Empresa B, sem recriar senha.",
    text: "Qual modelo permite que várias organizações confiem nas identidades gerenciadas umas pelas outras para uma autenticação sem atrito interinstitucional?",
    options: [
      { letter: "A", text: "Mandatory Access Control Universal." },
      { letter: "B", text: "Federação." },
      { letter: "C", text: "Privileged Access Management Centralizado." },
      { letter: "D", text: "Compartilhamento Discretionary (DAC) manual." }
    ],
    correct: 1,
    explanation: "Federação (Federation) é o acordo em que um conjunto de organizações pode usar identidades estabelecidas em um provedor (IdP) e consumi-lo como provedores de serviço (SP) entre fronteiras tecnológicas."
  },
  {
    id: 9,
    level: "Nível 4 — Avançado",
    scenario: "Durante o processo de autenticação corporativa via Single Sign-On, o fluxo emitiu para o serviço solicitado tokens baseados em XML, chamados de 'Afirmações', para transacionar a autenticação entre os dois domínios.",
    text: "Esse documento de autenticação formatado em XML e emitido pelo IdP baseia-se em qual importante protocolo de Segurança de Rede?",
    options: [
      { letter: "A", text: "SAML (Security Assertion Markup Language)." },
      { letter: "B", text: "LDAP (Lightweight Directory Access Protocol)." },
      { letter: "C", text: "PAM Workflow XML." },
      { letter: "D", text: "OIDC (OpenID Connect)." }
    ],
    correct: 0,
    explanation: "O SAML é um padrão de protocolo estabelecido em XML que trabalha fundamentalmente utilizando assertions (afirmações de asserção) emitidas do IdP para o Service Provider (SP)."
  },
  {
    id: 10,
    level: "Nível 4 — Avançado",
    scenario: "Uma integração em lote (batch-run) utiliza trocas de mensagens robustas onde todas as requisições estão envolvidas em um Envelope contendo cabeçalho e corpo com esquemas sintaticamente padronizados em XML.",
    text: "Este cenário define a implementação de integração entre aplicativos baseada em qual protocolo de chamadas remotas de serviço?",
    options: [
      { letter: "A", text: "OAuth 2.0." },
      { letter: "B", text: "SOAP (Simple Object Access Protocol)." },
      { letter: "C", text: "ABAC em camadas." },
      { letter: "D", text: "LDAP Tree." }
    ],
    correct: 1,
    explanation: "O SOAP é um protocolo (geralmente sobre HTTP) caracterizado pelas mensagens baseadas em XML e pelo uso de 'Envelope SOAP' contendo Header e Body."
  },
  {
    id: 11,
    level: "Nível 5 — Especialista",
    scenario: "Uma startup liberou uma aplicação web moderna que pede ao usuário que autorize a plataforma a acessar seus arquivos em seu Google Drive. Isso ocorre através do fluxo clássico de delegação utilizando Tokens sem entregar a senha do Gmail do usuário ao aplicativo de terceiros.",
    text: "Esta delegação de autorização web em que terceiros podem assumir um papel restrito sem o conhecimento da credencial original do dono baseia-se em qual protocolo de mercado?",
    options: [
      { letter: "A", text: "SAML 2.0 Identity Binding." },
      { letter: "B", text: "Privileged Access Management Extranet." },
      { letter: "C", text: "RESTFUL OAuth." },
      { letter: "D", text: "LDAP Federation Interface (LFI)." }
    ],
    correct: 2,
    explanation: "O OAuth (ou RESTFUL OAuth) é o protocolo de delegação de acesso por excelência, projetado para conceder acesso restrito com uso de Access Tokens gerados sem pedir a credencial direta do provedor final."
  },
  {
    id: 12,
    level: "Nível 5 — Especialista",
    scenario: "Além do provedor autorizar o acesso remoto (OAuth 2), o app deseja especificamente autenticar e coletar o perfil digital de uma pessoa (IDToken) de forma previsível (em JSON) com suporte nativo na arquitetura de Nuvem.",
    text: "Qual protocolo atua como uma 'camada superior de autenticação' construída em cima do protocolo de autorização OAuth 2.0?",
    options: [
      { letter: "A", text: "SAML Asserções Integradas." },
      { letter: "B", text: "Simple Object Access Protocol Extensions (SOAP-Ex)." },
      { letter: "C", text: "OpenID Connect (OIDC)." },
      { letter: "D", text: "Controle discricionário de API." }
    ],
    correct: 2,
    explanation: "O OpenID Connect (OIDC) atua estritamente como a camada estandarizada de Identificação (autenticação real de quem o usuário é) desenvolvida em cima do protocolo OAuth2.0."
  },
  {
    id: 13,
    level: "Nível 2 — Básico",
    scenario: "O analista desenha uma regra de controle na qual 'Vendedores' só podem emitir nota se 'horário=Trabalho'. Se o vendedor for de homeoffice, há um contexto extra.",
    text: "Essa autorização minuciosa e dinâmica considerando quem é (cargo=Vendedor), ambiente (horário=Trabalho e localização=HomeOffice) e recursos (modulo=Fiscal) baseia-se majoritariamente no controle:",
    options: [
      { letter: "A", text: "DAC." },
      { letter: "B", text: "ABAC (Attribute-Based Access Control)." },
      { letter: "C", text: "MAC." },
      { letter: "D", text: "PAM." }
    ],
    correct: 1,
    explanation: "ABAC possibilita uma matriz flexível: baseia-se em vários atributos (horários, localidades, papéis) combinados."
  },
  {
    id: 14,
    level: "Nível 3 — Intermediário",
    scenario: "A corporação está madura de tal forma que qualquer senha de ROOT e de Banco de Dados de Produção não fica mais arquivada visível, e precisa ser 'reivindicada ('check-in / check-out')' sob gravação temporal, para o DB Admin agir e depois se auto trocar no fim da janela.",
    text: "Onde tipicamente ocorre isso?",
    options: [
      { letter: "A", text: "Uso do Attribute Base de Active Directory." },
      { letter: "B", text: "Ciclo de maturação do Protocolo LDAP." },
      { letter: "C", text: "Gestão do Privileged Access Management (PAM)." },
      { letter: "D", text: "Criação de chaves federativas OAuth passíveis de revogação." }
    ],
    correct: 2,
    explanation: "O provisionamento do acesso privilegiado, incluindo check-out e check-in com a rotação sistemática da senha e gravação da sessão é provido por plataformas focais de PAM."
  },
  {
    id: 15,
    level: "Nível 4 — Avançado",
    scenario: "Ao iniciar a depuração de tráfego (Auth), uma afirmação 'SAML' validada não passava da tela final. Visualizar os componentes SAML no tráfego revelou manipulações ou formatações inconsistentes. Na arquitetura descrita de SAML, existem os pacotes curtos utilizados para chamar as verdadeiras Asserções grandes.",
    text: "Como se chama o componente no padrão SAML associado a essas trocas curtas com IdPs?",
    options: [
      { letter: "A", text: "Resource Servers (RS)." },
      { letter: "B", text: "Security Tokens Header SOAP." },
      { letter: "C", text: "Identidades OIDC REST." },
      { letter: "D", text: "Pacotes de informações / Artifacts (SAML Artifacts)." }
    ],
    correct: 3,
    explanation: "Dentro do SAML existem fluxos como Artifact Resolution, e os 'SAML Artifacts' referenciam e recuperam asserções maiores remotamente da ponte das instituições."
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

export default function AtividadeM5A03() {
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
        module: "M05_A03" // Distinct identifier
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
      { min: 0, emoji: "🔰", label: "Iniciante em Acessos", color: "#5a7a9a" },
      { min: 20, emoji: "🛡️", label: "Controlador DAC", color: "#00e5ff" },
      { min: 40, emoji: "⚡", label: "Analista MAC", color: "#00ff88" },
      { min: 70, emoji: "🔑", label: "Arquiteto LDAP", color: "#ffd600" },
      { min: 100, emoji: "🏆", label: "Mestre da Federação!", color: "#ffd600" },
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
          <div className="header-badge">Atividade Interativa · Módulo 05 · Aula 03</div>
          <h1>Missão: <span>Soluções de Autorização</span></h1>
          <p className="header-sub">Prof. Alexsander Farias · DAC/RBAC/ABAC, PAM, LDAP, Federação & OAuth</p>
        </header>

        {screen === "start" && (
          <div style={{ textAlign: "center", background: "#0a1628", border: "1px solid #1a3a6e", borderRadius: 8, padding: "36px 32px" }}>
            <div style={{ width: 80, height: 80, margin: "0 auto 20px", background: "linear-gradient(135deg, #ff007b, #7c3aed)", clipPath: "polygon(50% 0%, 100% 20%, 100% 70%, 50% 100%, 0% 70%, 0% 20%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 0 20px #ff007b55" }}>⚡</div>
            <h2 style={{ fontFamily: "Orbitron", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 900, color: "#fff", marginBottom: 6 }}>Desafio <span style={{ color: "#ff007b" }}>Identificação Federada</span></h2>
            <p style={{ color: "#5a7a9a", fontSize: 15, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.5 }}>
              Defina os melhores modelos de acesso e protocolos avançados em serviços Web.
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
              <div style={{ fontSize: 13, color: "#5a7a9a" }}>Arquiteto: <strong style={{ color: "#ff007b", fontSize: 15 }}>{playerName}</strong></div>
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
