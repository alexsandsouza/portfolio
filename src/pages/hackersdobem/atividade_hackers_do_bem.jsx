import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    id: 1,
    emoji: "🔍",
    title: "Reconhecimento de Identidades",
    subtitle: "Classifique o tipo de conta correto para cada cenário",
    color: "#0D47A1",
    accent: "#1976D2",
    points: 20,
    time: 240,
    type: "select",
    questions: [
      {
        id: "q1_1", pts: 4,
        text: "Joana é nova fornecedora e precisa acessar o sistema por apenas 3 dias.",
        options: ["Usuário Padrão", "Administrador / Root", "Conta de Convidado", "Conta de Serviço", "Chave SSH"],
        answer: "Conta de Convidado",
        feedback: "Acesso temporário e limitado com prazo de validade — característica das Contas de Convidados."
      },
      {
        id: "q1_2", pts: 4,
        text: "Carlos é responsável por instalar softwares e fazer backups em todos os servidores.",
        options: ["Usuário Padrão", "Administrador / Root", "Conta de Convidado", "Conta de Serviço", "Chave SSH"],
        answer: "Administrador / Root",
        feedback: "Instalar softwares e backups exigem privilégios elevados — típico de contas Administrador/Root."
      },
      {
        id: "q1_3", pts: 4,
        text: "Um processo automatizado executa tarefas de manutenção toda madrugada no sistema.",
        options: ["Usuário Padrão", "Administrador / Root", "Conta de Convidado", "Conta de Serviço", "Chave SSH"],
        answer: "Conta de Serviço",
        feedback: "Processos automatizados do sistema são gerenciados por Contas de Serviço (System/Local/Network Service)."
      },
      {
        id: "q1_4", pts: 4,
        text: "Ana é analista de RH e usa o sistema apenas para consultar a folha de pagamento.",
        options: ["Usuário Padrão", "Administrador / Root", "Conta de Convidado", "Conta de Serviço", "Chave SSH"],
        answer: "Usuário Padrão",
        feedback: "Acesso limitado e específico à função — princípio do Menor Privilégio aplicado ao Usuário Padrão."
      },
      {
        id: "q1_5", pts: 4,
        text: "O time de DevOps usa pares de chaves criptográficas para acessar servidores remotos.",
        options: ["Usuário Padrão", "Administrador / Root", "Conta de Convidado", "Conta de Serviço", "Chave SSH"],
        answer: "Chave SSH",
        feedback: "Pares de chaves criptográficas (pública/privada) para autenticação segura em servidores remotos — isso é SSH!"
      },
    ]
  },
  {
    id: 2,
    emoji: "📋",
    title: "Classificação de Políticas",
    subtitle: "Associe cada prática ao conceito de segurança correto",
    color: "#4A148C",
    accent: "#7B1FA2",
    points: 20,
    time: 240,
    type: "match",
    questions: [
      {
        id: "q2_1", pts: 5,
        text: "Nenhum funcionário pode autorizar E executar o mesmo pagamento sozinho.",
        options: ["Menor Privilégio", "Separação de Funções", "Licença Obrigatória", "Rotação de Cargos"],
        answer: "Separação de Funções",
        feedback: "Nenhum indivíduo deve ter controle absoluto sobre uma função crítica — isso é Separação de Funções."
      },
      {
        id: "q2_2", pts: 5,
        text: "A Ana acessa somente os arquivos estritamente necessários para seu trabalho.",
        options: ["Menor Privilégio", "Separação de Funções", "Licença Obrigatória", "Rotação de Cargos"],
        answer: "Menor Privilégio",
        feedback: "Usuário recebe apenas os direitos necessários para sua função — princípio do Menor Privilégio."
      },
      {
        id: "q2_3", pts: 5,
        text: "O gestor Pedro deve tirar férias e outro colaborador assume suas responsabilidades.",
        options: ["Menor Privilégio", "Separação de Funções", "Licença Obrigatória", "Rotação de Cargos"],
        answer: "Licença Obrigatória",
        feedback: "A Licença Obrigatória permite revisão independente das atividades e identificação de irregularidades."
      },
      {
        id: "q2_4", pts: 5,
        text: "O analista Lucas mudou de setor e assumiu novas responsabilidades na empresa.",
        options: ["Menor Privilégio", "Separação de Funções", "Licença Obrigatória", "Rotação de Cargos"],
        answer: "Rotação de Cargos",
        feedback: "Mudança de cargo previne abuso de poder e dependência individual — Rotação de Cargos."
      },
    ]
  },
  {
    id: 3,
    emoji: "⚠️",
    title: "Identificando Ameaças",
    subtitle: "Cada situação é um RISCO ou uma PRÁTICA SEGURA?",
    color: "#BF360C",
    accent: "#E64A19",
    points: 20,
    time: 240,
    type: "risk",
    questions: [
      {
        id: "q3_1", pts: 4,
        text: "A empresa usa tokens de autenticação, mas não controla quem pode reutilizá-los.",
        answer: "RISCO",
        feedback: "RISCO! Um ator malicioso pode capturar e reproduzir o token (ataque de replay) para obter acesso não autorizado."
      },
      {
        id: "q3_2", pts: 4,
        text: "Para acessar servidores remotos, o time usa chaves SSH ao invés de senhas simples.",
        answer: "SEGURO",
        feedback: "PRÁTICA SEGURA! Chaves SSH são mais resistentes a força bruta e phishing que senhas convencionais."
      },
      {
        id: "q3_3", pts: 4,
        text: "Certificados digitais são emitidos por Autoridades Certificadoras e armazenados em smart card.",
        answer: "SEGURO",
        feedback: "PRÁTICA SEGURA! Certificados de ACs reconhecidas em smart card garantem autenticação robusta via PKI."
      },
      {
        id: "q3_4", pts: 4,
        text: "Três funcionários diferentes compartilham as mesmas credenciais de acesso ao servidor.",
        answer: "RISCO",
        feedback: "RISCO! Credenciais compartilhadas eliminam rastreabilidade individual e violam o princípio de identidade única."
      },
      {
        id: "q3_5", pts: 4,
        text: "Após a demissão de um colaborador, a conta dele foi desativada imediatamente.",
        answer: "SEGURO",
        feedback: "PRÁTICA SEGURA! Desativar contas imediatamente no offboarding previne acessos não autorizados de ex-colaboradores."
      },
    ]
  },
  {
    id: 4,
    emoji: "🔄",
    title: "Onboarding & Offboarding",
    subtitle: "Distribua as ações nas fases corretas do ciclo de vida",
    color: "#1B5E20",
    accent: "#388E3C",
    points: 20,
    time: 240,
    type: "phase",
    actions: [
      { id: "A", text: "Revogar todos os acessos ao sistema", phase: "DESLIGAMENTO" },
      { id: "B", text: "Assinar o NDA (Acordo de Confidencialidade)", phase: "RECRUTAMENTO" },
      { id: "C", text: "Realizar verificação de antecedentes", phase: "RECRUTAMENTO" },
      { id: "D", text: "Devolver equipamentos da empresa", phase: "DESLIGAMENTO" },
      { id: "E", text: "Criar conta com permissões mínimas necessárias", phase: "OPERACAO" },
      { id: "F", text: "Realizar treinamento de segurança", phase: "OPERACAO" },
      { id: "G", text: "Auditar atividades do colaborador", phase: "DESLIGAMENTO" },
      { id: "H", text: "Desativar tokens e certificados digitais", phase: "DESLIGAMENTO" },
      { id: "I", text: "Transmitir credenciais de forma segura", phase: "RECRUTAMENTO" },
      { id: "J", text: "Rever e ajustar privilégios conforme função", phase: "OPERACAO" },
    ]
  },
  {
    id: 5,
    emoji: "🏆",
    title: "Boss Final: Auditoria Crítica",
    subtitle: "Analise o cenário e responda com seus conhecimentos",
    color: "#880E4F",
    accent: "#C2185B",
    points: 20,
    time: 240,
    type: "boss",
    scenario: "A empresa SeguraTech detectou um acesso suspeito. Um colaborador demitido há 2 semanas ainda conseguiu acessar o sistema usando as mesmas credenciais. Além disso, ele tinha privilégios de Administrador mesmo sendo analista júnior, e 3 funcionários usavam a mesma conta genérica para acessar o servidor de dados.",
    questions: [
      {
        id: "q5_1", pts: 5,
        text: "Quais falhas de segurança você identifica? (selecione todas que se aplicam)",
        type: "multi",
        options: [
          { text: "Conta não desativada após desligamento", correct: true },
          { text: "Violação do Menor Privilégio (analista com acesso Admin)", correct: true },
          { text: "Uso de senhas muito curtas", correct: false },
          { text: "Credenciais compartilhadas entre funcionários", correct: true },
          { text: "Ausência de auditoria e monitoramento", correct: true },
          { text: "Falta de antivírus nos servidores", correct: false },
        ],
        feedback: "As 4 falhas são: conta ativa pós-demissão, violação do Menor Privilégio, credenciais compartilhadas e falta de monitoramento."
      },
      {
        id: "q5_2", pts: 5,
        text: "Qual política NÃO foi aplicada no desligamento do colaborador?",
        type: "single",
        options: ["Política de Onboarding", "Política de Offboarding", "Separação de Funções", "Rotação de Cargos"],
        answer: "Política de Offboarding",
        feedback: "A Política de Offboarding exige revogação imediata de acessos, desativação de tokens e gerenciamento de contas ao desligar um colaborador."
      },
      {
        id: "q5_3", pts: 5,
        text: "Qual ação deve ser feita PRIMEIRO ao detectar o acesso indevido?",
        type: "single",
        options: [
          "Enviar e-mail ao ex-funcionário",
          "Revogar e desativar imediatamente a conta comprometida",
          "Realizar treinamento de segurança",
          "Contratar novo analista de segurança"
        ],
        answer: "Revogar e desativar imediatamente a conta comprometida",
        feedback: "A resposta imediata a incidentes exige contenção: revogar e desativar a conta é a prioridade para cessar o acesso não autorizado."
      },
      {
        id: "q5_4", pts: 5,
        text: "O princípio que determina que cada usuário deve ter apenas os acessos necessários para sua função é:",
        type: "single",
        options: ["Separação de Funções", "Rotação de Cargos", "Menor Privilégio", "Licença Obrigatória"],
        answer: "Menor Privilégio",
        feedback: "Menor Privilégio: o usuário recebe apenas os direitos necessários — um analista júnior jamais deveria ter acesso de Administrador."
      },
    ]
  }
];

const LEVELS = [
  { min: 90, label: "LENDÁRIO", title: "Hacker do Bem Master", color: "#FFD700", bg: "#1A237E", msg: "Desempenho extraordinário! Você domina completamente o gerenciamento de identidades e contas. A SeguraTech está em boas mãos!" },
  { min: 75, label: "ESPECIALISTA", title: "Analista Sênior de Segurança", color: "#00E676", bg: "#1B5E20", msg: "Ótimo resultado! Você tem sólido conhecimento sobre identidades digitais. Pequenos ajustes e você chega ao topo!" },
  { min: 60, label: "PROFICIENTE", title: "Analista Pleno", color: "#40C4FF", bg: "#01579B", msg: "Bom desempenho! Você compreende os conceitos principais. Revise os pontos onde errou para consolidar seu conhecimento." },
  { min: 40, label: "APRENDIZ", title: "Analista Júnior", color: "#FFB300", bg: "#E65100", msg: "Continue estudando! Você está no caminho certo. Revise o material da Aula 01 focando em políticas de pessoal e tipos de contas." },
  { min: 0, label: "INICIANTE", title: "Estagiário de Segurança", color: "#FF5252", bg: "#B71C1C", msg: "Não desanime! Todo hacker do bem começa aqui. Releia o conteúdo completo da aula e tente novamente." },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getLevel(score) {
  return LEVELS.find(l => score >= l.min);
}

function useTimer(seconds, active) {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef(null);
  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);
  useEffect(() => {
    if (!active) { clearInterval(ref.current); return; }
    ref.current = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(ref.current);
  }, [active]);
  const pct = (remaining / seconds) * 100;
  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  return { remaining, display: `${mins}:${secs}`, pct, expired: remaining === 0 };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 6, borderRadius: 3,
          background: i < current ? "#00E676" : i === current ? "#40C4FF" : "rgba(255,255,255,0.15)",
          transition: "background 0.4s",
          boxShadow: i < current ? "0 0 8px #00E67680" : "none"
        }} />
      ))}
    </div>
  );
}

function TimerRing({ pct, display, expired }) {
  const r = 28, c = 2 * Math.PI * r;
  const color = pct > 50 ? "#00E676" : pct > 25 ? "#FFB300" : "#FF5252";
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
        <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
      </svg>
      <span style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700,
        color: expired ? "#FF5252" : color
      }}>{display}</span>
    </div>
  );
}

// ─── STAGE SCREENS ────────────────────────────────────────────────────────────

function SelectStage({ stage, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const timer = useTimer(stage.time, !submitted);

  function score() {
    return stage.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? q.pts : 0), 0);
  }

  function submit() {
    if (Object.keys(answers).length < stage.questions.length) {
      alert("Responda todas as questões antes de avançar!");
      return;
    }
    setSubmitted(true);
  }

  const s = score();

  return (
    <div>
      {!submitted && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} />
      </div>}

      {stage.questions.map((q, qi) => {
        const isRight = submitted && answers[q.id] === q.answer;
        const isWrong = submitted && answers[q.id] !== q.answer;
        return (
          <div key={q.id} style={{
            background: submitted ? (isRight ? "rgba(0,230,118,0.08)" : "rgba(255,82,82,0.08)") : "rgba(255,255,255,0.04)",
            border: `1px solid ${submitted ? (isRight ? "#00E676" : "#FF5252") : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, padding: "18px 20px", marginBottom: 14, transition: "all 0.3s"
          }}>
            <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "#E8EAF6", lineHeight: 1.5 }}>
              <span style={{ color: "#40C4FF", marginRight: 8 }}>{qi + 1}.</span>{q.text}
              <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>({q.pts} pts)</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {q.options.map(opt => {
                const sel = answers[q.id] === opt;
                const showRight = submitted && opt === q.answer;
                const showWrong = submitted && sel && opt !== q.answer;
                return (
                  <button key={opt} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: opt }))}
                    style={{
                      padding: "8px 16px", borderRadius: 8, border: `1.5px solid`,
                      borderColor: showRight ? "#00E676" : showWrong ? "#FF5252" : sel ? "#40C4FF" : "rgba(255,255,255,0.15)",
                      background: showRight ? "rgba(0,230,118,0.15)" : showWrong ? "rgba(255,82,82,0.15)" : sel ? "rgba(64,196,255,0.15)" : "rgba(255,255,255,0.04)",
                      color: showRight ? "#00E676" : showWrong ? "#FF5252" : sel ? "#40C4FF" : "#B0BEC5",
                      fontSize: 13, fontWeight: sel || showRight ? 700 : 400, cursor: submitted ? "default" : "pointer",
                      transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif"
                    }}>{opt}</button>
                );
              })}
            </div>
            {submitted && <p style={{ margin: "10px 0 0", fontSize: 13, color: isRight ? "#69F0AE" : "#FFAB91", fontStyle: "italic", lineHeight: 1.4 }}>
              {isRight ? "✓" : "✗"} {q.feedback}
            </p>}
          </div>
        );
      })}

      {!submitted
        ? <button onClick={submit} style={btnStyle(stage.accent)}>Verificar Respostas →</button>
        : <div>
          <div style={{ textAlign: "center", padding: "20px 0", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: s === stage.points ? "#00E676" : s >= stage.points * 0.6 ? "#FFB300" : "#FF5252", fontFamily: "'Space Mono', monospace" }}>{s}<span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)" }}>/{stage.points}</span></div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>pontos nesta etapa</div>
          </div>
          <button onClick={() => onComplete(s)} style={btnStyle("#00E676", "#000")}>Próxima Etapa →</button>
        </div>
      }
    </div>
  );
}

function RiskStage({ stage, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const timer = useTimer(stage.time, !submitted);

  function score() {
    return stage.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? q.pts : 0), 0);
  }

  function submit() {
    if (Object.keys(answers).length < stage.questions.length) {
      alert("Classifique todas as situações!");
      return;
    }
    setSubmitted(true);
  }

  const s = score();
  return (
    <div>
      {!submitted && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} />
      </div>}
      {stage.questions.map((q, qi) => {
        const sel = answers[q.id];
        const isRight = submitted && sel === q.answer;
        return (
          <div key={q.id} style={{
            background: submitted ? (isRight ? "rgba(0,230,118,0.06)" : "rgba(255,82,82,0.06)") : "rgba(255,255,255,0.04)",
            border: `1px solid ${submitted ? (isRight ? "#00E676" : "#FF5252") : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, padding: "16px 20px", marginBottom: 12
          }}>
            <p style={{ margin: "0 0 14px", fontSize: 15, color: "#E8EAF6", lineHeight: 1.5 }}>
              <span style={{ color: "#40C4FF", marginRight: 8 }}>{qi + 1}.</span>{q.text}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["RISCO", "SEGURO"].map(opt => {
                const isOpt = sel === opt;
                const showRight = submitted && q.answer === opt;
                const showWrong = submitted && isOpt && q.answer !== opt;
                const rColor = opt === "RISCO" ? "#FF5252" : "#00E676";
                return (
                  <button key={opt} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: opt }))}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 10,
                      border: `2px solid ${showRight ? rColor : showWrong ? rColor : isOpt ? rColor : "rgba(255,255,255,0.1)"}`,
                      background: showRight ? `${rColor}22` : showWrong ? `${rColor}11` : isOpt ? `${rColor}15` : "transparent",
                      color: showRight || isOpt ? rColor : "rgba(255,255,255,0.4)",
                      fontSize: 14, fontWeight: 700, cursor: submitted ? "default" : "pointer",
                      transition: "all 0.2s", fontFamily: "'Space Mono', monospace",
                      letterSpacing: 1
                    }}>{opt === "RISCO" ? "⚠ RISCO" : "✓ SEGURO"}</button>
                );
              })}
            </div>
            {submitted && <p style={{ margin: "10px 0 0", fontSize: 13, color: isRight ? "#69F0AE" : "#FFAB91", fontStyle: "italic" }}>
              {isRight ? "✓" : `✗ Correto: ${q.answer === "RISCO" ? "⚠ RISCO" : "✓ SEGURO"}`} — {q.feedback}
            </p>}
          </div>
        );
      })}
      {!submitted
        ? <button onClick={submit} style={btnStyle(stage.accent)}>Verificar Respostas →</button>
        : <div>
          <div style={{ textAlign: "center", padding: "20px 0", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: s >= 16 ? "#00E676" : s >= 10 ? "#FFB300" : "#FF5252", fontFamily: "'Space Mono', monospace" }}>{s}<span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)" }}>/{stage.points}</span></div>
          </div>
          <button onClick={() => onComplete(s)} style={btnStyle("#00E676", "#000")}>Próxima Etapa →</button>
        </div>
      }
    </div>
  );
}

function PhaseStage({ stage, onComplete }) {
  const [placements, setPlacements] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const timer = useTimer(stage.time, !submitted);
  const phases = ["RECRUTAMENTO", "OPERACAO", "DESLIGAMENTO"];
  const phaseLabels = { RECRUTAMENTO: "📥 Recrutamento", OPERACAO: "⚙️ Operação", DESLIGAMENTO: "📤 Desligamento" };
  const phaseColors = { RECRUTAMENTO: "#0D47A1", OPERACAO: "#1B5E20", DESLIGAMENTO: "#B71C1C" };

  function calcScore() {
    return stage.actions.reduce((acc, a) => acc + (placements[a.id] === a.phase ? (a.phase === "DESLIGAMENTO" ? 2 : 2) : 0), 0);
  }

  function submit() {
    if (Object.keys(placements).length < stage.actions.length) {
      alert("Classifique todas as ações nas fases!");
      return;
    }
    setSubmitted(true);
  }

  const s = Math.min(calcScore(), stage.points);

  return (
    <div>
      {!submitted && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} />
      </div>}

      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Para cada ação, escolha a fase correta do ciclo de vida do colaborador:</p>

      {stage.actions.map(action => {
        const sel = placements[action.id];
        const isRight = submitted && sel === action.phase;
        const isWrong = submitted && sel !== action.phase;
        return (
          <div key={action.id} style={{
            background: submitted ? (isRight ? "rgba(0,230,118,0.06)" : "rgba(255,82,82,0.06)") : "rgba(255,255,255,0.04)",
            border: `1px solid ${submitted ? (isRight ? "#00E676" : "#FF5252") : "rgba(255,255,255,0.08)"}`,
            borderRadius: 10, padding: "12px 16px", marginBottom: 10,
            display: "flex", flexDirection: "column", gap: 10
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#40C4FF", flexShrink: 0,
                fontFamily: "'Space Mono', monospace"
              }}>{action.id}</span>
              <span style={{ fontSize: 14, color: "#E8EAF6", flex: 1 }}>{action.text}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {phases.map(phase => {
                const isSelected = sel === phase;
                const isCorrectPhase = submitted && action.phase === phase;
                const col = phaseColors[phase];
                return (
                  <button key={phase} onClick={() => !submitted && setPlacements(p => ({ ...p, [action.id]: phase }))}
                    style={{
                      flex: 1, minWidth: 90, padding: "7px 6px", borderRadius: 8,
                      border: `1.5px solid ${isCorrectPhase ? "#00E676" : isSelected && submitted ? "#FF5252" : isSelected ? col : "rgba(255,255,255,0.1)"}`,
                      background: isCorrectPhase ? "rgba(0,230,118,0.12)" : isSelected ? `${col}22` : "transparent",
                      color: isCorrectPhase ? "#00E676" : isSelected && submitted ? "#FF5252" : isSelected ? "#fff" : "rgba(255,255,255,0.35)",
                      fontSize: 12, fontWeight: isSelected ? 700 : 400, cursor: submitted ? "default" : "pointer",
                      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
                    }}>{phaseLabels[phase]}</button>
                );
              })}
            </div>
            {submitted && isWrong && (
              <p style={{ margin: 0, fontSize: 12, color: "#FFAB91" }}>✗ Correto: {phaseLabels[action.phase]}</p>
            )}
          </div>
        );
      })}

      {!submitted
        ? <button onClick={submit} style={btnStyle(stage.accent)}>Verificar Respostas →</button>
        : <div>
          <div style={{ textAlign: "center", padding: "20px 0", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: s >= 16 ? "#00E676" : s >= 10 ? "#FFB300" : "#FF5252", fontFamily: "'Space Mono', monospace" }}>{s}<span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)" }}>/{stage.points}</span></div>
          </div>
          <button onClick={() => onComplete(s)} style={btnStyle("#00E676", "#000")}>Próxima Etapa →</button>
        </div>
      }
    </div>
  );
}

function BossStage({ stage, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const timer = useTimer(stage.time, !submitted);

  function toggleMulti(qid, opt) {
    setAnswers(a => {
      const cur = a[qid] || [];
      return { ...a, [qid]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] };
    });
  }

  function scoreQ(q) {
    if (q.type === "multi") {
      const correct = q.options.filter(o => o.correct).map(o => o.text);
      const sel = answers[q.id] || [];
      const hits = sel.filter(s => correct.includes(s)).length;
      const wrong = sel.filter(s => !correct.includes(s)).length;
      return Math.max(0, Math.round((hits / correct.length) * q.pts) - wrong);
    }
    return answers[q.id] === q.answer ? q.pts : 0;
  }

  function totalScore() {
    return stage.questions.reduce((acc, q) => acc + scoreQ(q), 0);
  }

  function submit() {
    const unanswered = stage.questions.filter(q => {
      if (q.type === "multi") return !(answers[q.id] && answers[q.id].length > 0);
      return !answers[q.id];
    });
    if (unanswered.length > 0) { alert("Responda todas as questões!"); return; }
    setSubmitted(true);
  }

  const s = Math.min(totalScore(), stage.points);

  return (
    <div>
      <div style={{
        background: "rgba(255,82,82,0.08)", border: "1px solid rgba(255,82,82,0.3)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 24
      }}>
        <p style={{ margin: 0, fontSize: 13, color: "#FFCDD2", lineHeight: 1.6, fontStyle: "italic" }}>
          <span style={{ color: "#FF5252", fontWeight: 700, fontStyle: "normal" }}>⚠ CENÁRIO CRÍTICO: </span>
          {stage.scenario}
        </p>
      </div>

      {!submitted && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} />
      </div>}

      {stage.questions.map((q, qi) => {
        const qScore = submitted ? scoreQ(q) : null;
        const isRight = submitted && qScore === q.pts;
        return (
          <div key={q.id} style={{
            background: submitted ? (isRight ? "rgba(0,230,118,0.06)" : qScore > 0 ? "rgba(255,179,0,0.06)" : "rgba(255,82,82,0.06)") : "rgba(255,255,255,0.04)",
            border: `1px solid ${submitted ? (isRight ? "#00E676" : qScore > 0 ? "#FFB300" : "#FF5252") : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, padding: "16px 20px", marginBottom: 14
          }}>
            <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "#E8EAF6", lineHeight: 1.5 }}>
              <span style={{ color: "#F48FB1", marginRight: 8 }}>Q{qi + 1}.</span>{q.text}
              {submitted && <span style={{ marginLeft: 8, fontSize: 13, color: isRight ? "#00E676" : "#FF5252", fontFamily: "'Space Mono', monospace" }}>({qScore}/{q.pts}pts)</span>}
            </p>
            {q.type === "multi" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map(opt => {
                  const sel = (answers[q.id] || []).includes(opt.text);
                  const showRight = submitted && opt.correct;
                  const showWrong = submitted && sel && !opt.correct;
                  return (
                    <label key={opt.text} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                      borderRadius: 8, cursor: submitted ? "default" : "pointer",
                      background: showRight ? "rgba(0,230,118,0.1)" : showWrong ? "rgba(255,82,82,0.1)" : sel ? "rgba(255,255,255,0.06)" : "transparent",
                      border: `1px solid ${showRight ? "#00E676" : showWrong ? "#FF5252" : sel ? "rgba(255,255,255,0.2)" : "transparent"}`,
                      transition: "all 0.2s"
                    }}>
                      <input type="checkbox" checked={sel} onChange={() => !submitted && toggleMulti(q.id, opt.text)}
                        style={{ accentColor: "#40C4FF", width: 16, height: 16 }} />
                      <span style={{ fontSize: 14, color: showRight ? "#69F0AE" : showWrong ? "#FF8A80" : "#E8EAF6" }}>{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map(opt => {
                  const sel = answers[q.id] === opt;
                  const showRight = submitted && opt === q.answer;
                  const showWrong = submitted && sel && opt !== q.answer;
                  return (
                    <label key={opt} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                      borderRadius: 8, cursor: submitted ? "default" : "pointer",
                      background: showRight ? "rgba(0,230,118,0.1)" : showWrong ? "rgba(255,82,82,0.1)" : sel ? "rgba(255,255,255,0.06)" : "transparent",
                      border: `1px solid ${showRight ? "#00E676" : showWrong ? "#FF5252" : sel ? "rgba(255,255,255,0.2)" : "transparent"}`,
                      transition: "all 0.2s"
                    }}>
                      <input type="radio" name={q.id} checked={sel} onChange={() => !submitted && setAnswers(a => ({ ...a, [q.id]: opt }))}
                        style={{ accentColor: "#40C4FF", width: 16, height: 16 }} />
                      <span style={{ fontSize: 14, color: showRight ? "#69F0AE" : showWrong ? "#FF8A80" : "#E8EAF6" }}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}
            {submitted && <p style={{ margin: "12px 0 0", fontSize: 13, color: isRight ? "#69F0AE" : "#FFAB91", fontStyle: "italic", lineHeight: 1.4 }}>
              💡 {q.feedback}
            </p>}
          </div>
        );
      })}

      {!submitted
        ? <button onClick={submit} style={btnStyle(stage.accent)}>Finalizar Missão 🏆</button>
        : <div>
          <div style={{ textAlign: "center", padding: "20px 0", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: s >= 16 ? "#00E676" : s >= 10 ? "#FFB300" : "#FF5252", fontFamily: "'Space Mono', monospace" }}>{s}<span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)" }}>/{stage.points}</span></div>
          </div>
          <button onClick={() => onComplete(s)} style={btnStyle("#00E676", "#000")}>Ver Resultado Final 🏆</button>
        </div>
      }
    </div>
  );
}

function btnStyle(bg, color = "#fff") {
  return {
    width: "100%", padding: "14px", borderRadius: 10, border: "none",
    background: bg, color, fontSize: 15, fontWeight: 700, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
    boxShadow: `0 4px 20px ${bg}60`, transition: "transform 0.15s, box-shadow 0.15s",
    marginTop: 8
  };
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function Welcome({ onStart }) {
  const [name, setName] = useState("");
  return (
    <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛡️</div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "#00E676", fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>HACKERS DO BEM — MÓDULO 05</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2, fontFamily: "'DM Sans', sans-serif" }}>
        Missão: Proteja a<br /><span style={{ color: "#40C4FF" }}>Rede da SeguraTech</span>
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, margin: "12px 0 32px", lineHeight: 1.6 }}>
        Complete as 5 etapas, acumule pontos e descubra seu nível como especialista em segurança de identidades!
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 36, flexWrap: "wrap" }}>
        {[["⏱", "20 min"], ["🎯", "5 etapas"], ["🏆", "100 pts"]].map(([ic, lb]) => (
          <div key={lb} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 24 }}>{ic}</span>
            <span style={{ fontSize: 13, color: "#40C4FF", fontFamily: "'Space Mono', monospace" }}>{lb}</span>
          </div>
        ))}
      </div>

      <input value={name} onChange={e => setName(e.target.value)}
        placeholder="Digite seu nome completo..."
        style={{
          width: "100%", padding: "14px 18px", borderRadius: 10,
          border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)",
          color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box",
          fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
          transition: "border 0.2s"
        }}
        onFocus={e => e.target.style.borderColor = "#40C4FF"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
      />

      <button onClick={() => name.trim() && onStart(name.trim())}
        disabled={!name.trim()}
        style={{
          ...btnStyle("#40C4FF", "#000"),
          opacity: name.trim() ? 1 : 0.4,
          cursor: name.trim() ? "pointer" : "not-allowed"
        }}>
        Iniciar Missão →
      </button>

      <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
        Prof. Alexsander Farias · Aula 01 · Tipos de Contas e Identidades
      </p>
    </div>
  );
}

function FinalResult({ name, scores, stageScores }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const level = getLevel(total);
  const pct = total;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#00E676", fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>RESULTADO FINAL</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>{name}</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: 14 }}>Hackers do Bem — Módulo 05, Aula 01</p>
      </div>

      {/* Score ring */}
      <div style={{
        background: `linear-gradient(135deg, ${level.bg}cc, ${level.bg}88)`,
        border: `2px solid ${level.color}44`,
        borderRadius: 20, padding: 28, marginBottom: 24, textAlign: "center"
      }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: level.color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>
          {total}
        </div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>/ 100 pontos</div>
        <div style={{ display: "inline-block", background: level.color, color: "#000", padding: "6px 20px", borderRadius: 30, fontWeight: 900, fontSize: 14, letterSpacing: 2, marginBottom: 8 }}>
          {level.label}
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 600 }}>{level.title}</div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 10,
            background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)`,
            transition: "width 1s ease", boxShadow: `0 0 12px ${level.color}80`
          }} />
        </div>
      </div>

      {/* Per-stage breakdown */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}>DESEMPENHO POR ETAPA</h3>
        {STAGES.map((stage, i) => {
          const sc = scores[i] || 0;
          const pctS = (sc / stage.points) * 100;
          const col = pctS >= 80 ? "#00E676" : pctS >= 50 ? "#FFB300" : "#FF5252";
          return (
            <div key={stage.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{stage.emoji} Etapa {stage.id}: {stage.title}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col, fontFamily: "'Space Mono', monospace" }}>{sc}/{stage.points}</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pctS}%`, background: col, borderRadius: 5, transition: "width 0.8s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback message */}
      <div style={{
        background: `${level.color}11`, border: `1px solid ${level.color}33`,
        borderRadius: 12, padding: "16px 20px", marginBottom: 24
      }}>
        <p style={{ margin: 0, fontSize: 15, color: "#E8EAF6", lineHeight: 1.6 }}>
          💬 <strong style={{ color: level.color }}>Feedback do Professor:</strong> {level.msg}
        </p>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
        Prof. Alexsander Farias · Hackers do Bem · 09/03/2026
      </p>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function AtividadeHackersDoBem() {
  const [screen, setScreen] = useState("welcome"); // welcome | stage | result
  const [studentName, setStudentName] = useState("");
  const [stageIdx, setStageIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const scrollRef = useRef(null);

  function start(name) {
    setStudentName(name);
    setStageIdx(0);
    setScores([]);
    setStartTime(Date.now());
    setScreen("stage");
  }

  async function saveToLeaderboard(name, allScores, duration) {
    try {
      const total = allScores.reduce((a, b) => a + b, 0);
      const id = `hdb_score:${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const entry = {
        id,
        name,
        score: total,
        stageScores: allScores,
        duration,
        timestamp: Date.now(),
      };
      await window.storage.set(id, JSON.stringify(entry), true);
    } catch (e) {
      console.warn("Não foi possível salvar no ranking:", e);
    }
  }

  function completeStage(pts) {
    const newScores = [...scores, pts];
    setScores(newScores);
    if (stageIdx < STAGES.length - 1) {
      setStageIdx(i => i + 1);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else {
      const duration = startTime ? Date.now() - startTime : 0;
      saveToLeaderboard(studentName, newScores, duration);
      setScreen("result");
    }
  }

  const stage = STAGES[stageIdx];

  return (
    <div ref={scrollRef} style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #080B1A 0%, #0D1330 40%, #0A1A2E 100%)",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      overflowY: "auto"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        input[type=checkbox], input[type=radio] { cursor: pointer; }
        button:hover { transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {screen === "welcome" && <Welcome onStart={start} />}

      {screen === "stage" && (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "24px 20px 40px" }}>
          <ProgressBar current={stageIdx} total={STAGES.length} />

          {/* Stage header */}
          <div style={{
            background: `linear-gradient(135deg, ${stage.color}cc, ${stage.accent}88)`,
            borderRadius: 16, padding: "20px 24px", marginBottom: 24,
            border: `1px solid ${stage.accent}44`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>{stage.emoji}</span>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', monospace" }}>
                  ETAPA {stage.id} DE {STAGES.length} · {stage.points} PONTOS
                </div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#fff" }}>{stage.title}</h2>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{stage.subtitle}</p>
          </div>

          {/* Stage content */}
          {stage.type === "select" && <SelectStage stage={stage} onComplete={completeStage} />}
          {stage.type === "match" && <SelectStage stage={stage} onComplete={completeStage} />}
          {stage.type === "risk" && <RiskStage stage={stage} onComplete={completeStage} />}
          {stage.type === "phase" && <PhaseStage stage={stage} onComplete={completeStage} />}
          {stage.type === "boss" && <BossStage stage={stage} onComplete={completeStage} />}
        </div>
      )}

      {screen === "result" && <FinalResult name={studentName} scores={scores} stageScores={scores} />}
    </div>
  );
}
