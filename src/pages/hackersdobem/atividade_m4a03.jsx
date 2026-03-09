import { useState, useEffect, useRef } from "react";
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    id: 1,
    emoji: "🔌",
    title: "Eco-Sistema IEEE 802.1X",
    subtitle: "Identifique quem é quem no protocolo de controle de acesso à rede.",
    timeLimit: 240,
    type: "select",
    items: [
      { id: "s1", term: "Dispositivo cliente (laptop, IoT) que busca acesso à rede.", correct: "Suplicante" },
      { id: "s2", term: "Ponto de acesso (Switch ou AP Wi-Fi) que controla as portas.", correct: "Autenticador" },
      { id: "s3", term: "Servidor que processa as políticas e autorizações (geralmente RADIUS).", correct: "Servidor de Autenticação" },
    ],
    options: ["Autenticador", "Servidor de Autenticação", "Suplicante"]
  },
  {
    id: 2,
    emoji: "📋",
    title: "Conceitos de Autenticação",
    subtitle: "Associe corretamente as tecnologias de autenticação.",
    timeLimit: 240,
    type: "match",
    pairs: [
        { c: "RADIUS", d: "Protocolo cliente-servidor para Autenticação, Autorização e Contabilidade (AAA)." },
        { c: "TOTP", d: "Senha única que expira rápido, baseada no tempo. Exige sincronia de horário." },
        { c: "HOTP", d: "Senha única baseada num contador (HMAC), útil quando a sincronia de tempo é difícil." },
        { c: "Smart-Card", d: "Dispositivo de Ownership Factor com microprocessador que valida senhas internamente." }
    ]
  },
  {
    id: 3,
    emoji: "⚠️",
    title: "Análise de Risco Operacional",
    subtitle: "Avalie se as práticas descritas são SEGURAS ou representam um RISCO.",
    timeLimit: 240,
    type: "risk",
    items: [
      {
        scenario: "Utilizar apenas um Código PIN Estático de 4 dígitos como proteção para um servidor corporativo.",
        isRisk: true,
        explanation: "RISCO: Códigos estáticos não mudam, logo podem ser reutilizados ou roubados. O uso exclusivo deles é ineficaz."
      },
      {
        scenario: "Atualizar e monitorar fisicamente o Hardware Security Module (HSM) da empresa.",
        isSafe: true,
        explanation: "SEGURO: É uma premissa básica de segurança para evitar acesso não autorizado a chaves criptográficas."
      },
      {
        scenario: "Deixar o celular desbloqueado e sem senha de tela no qual está instalado o Google Authenticator da sua conta.",
        isRisk: true,
        explanation: "RISCO: Seu dispositivo de 'ownership' torna-se vulnerável, enfraquecendo totalmente o duplo fator."
      }
    ]
  },
  {
    id: 4,
    emoji: "🔄",
    title: "Fatores de Autenticação",
    subtitle: "Classifique os itens como 'Fator de Conhecimento' (Sabe) ou 'Fator de Posse' (Possui).",
    timeLimit: 240,
    type: "drag",
    categories: [
      { id: "knowledge", name: "O que você SABE", color: "#3B82F6" },
      { id: "ownership", name: "O que você POSSUI", color: "#8B5CF6" }
    ],
    items: [
      { id: "f1", label: "Senha Pessoal", cat: "knowledge" },
      { id: "f2", label: "Token USB", cat: "ownership" },
      { id: "f3", label: "Smart-Card", cat: "ownership" },
      { id: "f4", label: "Código PIN", cat: "knowledge" },
      { id: "f5", label: "Smartphone (Google Auth)", cat: "ownership" }
    ]
  },
  {
    id: 5,
    emoji: "🏆",
    title: "Boss: Implantação 2FA",
    subtitle: "Selecione TODAS as boas práticas corretas para a Verificação em Duas Etapas (2FA) e Tecnologias de Token.",
    timeLimit: 240,
    type: "boss",
    question: "Quais das opções abaixo são consideradas boas práticas segundo o material estudado?",
    options: [
      { id: "b1", text: "Diversificação dos fatores (ex: aliar uma senha conhecida a um token temporário físico).", correct: true },
      { id: "b2", text: "Usar senhas fortes longas e remover e abandonar a Verificação em Duas Etapas por conveniência.", correct: false },
      { id: "b3", text: "Gerar senhas de backup físico ou guardar códigos de recuperação num local seguro.", correct: true },
      { id: "b4", text: "Utilizar o protocolo TOTP em ambientes onde os servidores e clientes nunca conseguirão ter os relógios sincronizados.", correct: false },
      { id: "b5", text: "Integrar sua autenticação com ferramentas robustas de Gerenciamento de Identidade.", correct: true }
    ]
  }
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function TimerRing({ timeLeft, totalTime }) {
  const pct = Math.max(0, timeLeft / totalTime);
  const color = pct > 0.5 ? "#4CAF50" : pct > 0.2 ? "#FFEB3B" : "#F44336";
  const dash = pct * 113; // 2 * PI * 18 = 113.09

  return (
    <div style={{ position: "relative", width: 50, height: 50 }}>
      <svg width="50" height="50" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={113} strokeDashoffset={113 - dash}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: "bold", color: "#fff"
      }}>
        {Math.ceil(timeLeft)}s
      </div>
    </div>
  );
}

// ─── STAGES IMPLEMENTATION ───────────────────────────────────────────────────

function SelectStage({ stage, onComplete }) {
  const [answers, setAnswers] = useState({});
  const ObjectKeys = stage.items.map(i => i.id);

  function check() {
    let hits = 0;
    stage.items.forEach(item => {
      if (answers[item.id] === item.correct) hits++;
    });
    return (hits / stage.items.length) * 20;
  }

  return (
    <div style={{ padding: 20 }}>
      <p style={{ color: "#aaa", marginBottom: 20, fontSize: 16 }}>
        Para cada componente IEEE 802.1X, selecione a definição correta:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {stage.items.map(item => (
          <div key={item.id} style={{
            background: "rgba(255,255,255,0.05)", padding: 15, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <strong style={{ color: "#fff", display: "block", marginBottom: 10, fontSize: 15 }}>{item.term}</strong>
            <select
              value={answers[item.id] || ""}
              onChange={e => setAnswers({ ...answers, [item.id]: e.target.value })}
              style={{
                width: "100%", padding: 12, borderRadius: 8, background: "#1E2A38", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)", outline: "none", fontSize: 15
              }}
            >
              <option value="" disabled>Selecione...</option>
              {stage.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => onComplete(check())}
        disabled={Object.keys(answers).length < stage.items.length}
        style={{
          marginTop: 20, width: "100%", padding: 15, borderRadius: 10, border: "none",
          background: Object.keys(answers).length < stage.items.length ? "#555" : "#4ade80",
          color: Object.keys(answers).length < stage.items.length ? "#888" : "#000",
          fontWeight: "bold", fontSize: 16, cursor: Object.keys(answers).length < stage.items.length ? "not-allowed" : "pointer",
          transition: "0.2s"
        }}
      >
        Verificar Respostas
      </button>
    </div>
  );
}

function MatchStage({ stage, onComplete }) {
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [matches, setMatches] = useState({}); 
  const [concepts, setConcepts] = useState([]);
  const [descs, setDescs] = useState([]);

  useEffect(() => {
    setConcepts([...stage.pairs].sort(() => Math.random() - 0.5));
    setDescs([...stage.pairs].sort(() => Math.random() - 0.5));
  }, [stage]);

  function handleSelectDesc(targetDesc) {
    if (!selectedConcept) return;
    setMatches({ ...matches, [selectedConcept]: targetDesc });
    setSelectedConcept(null);
  }

  function check() {
    let hits = 0;
    stage.pairs.forEach(p => {
      if (matches[p.c] === p.d) hits++;
    });
    return (hits / stage.pairs.length) * 20;
  }

  return (
    <div style={{ padding: 20 }}>
      <p style={{ color: "#aaa", marginBottom: 20 }}>Clique em um CONCEITO e depois em sua DESCRIÇÃO correspondente.</p>
      <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        {concepts.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setSelectedConcept(p.c)}
              style={{
                flex: 1, padding: 15, borderRadius: 8, border: "1px solid", fontFamily: "monospace", fontSize: 13,
                borderColor: selectedConcept === p.c ? "#4ade80" : matches[p.c] ? "#6366F1" : "rgba(255,255,255,0.2)",
                background: selectedConcept === p.c ? "rgba(74, 222, 128, 0.2)" : matches[p.c] ? "rgba(99, 102, 241, 0.2)" : "transparent",
                color: "#fff", cursor: "pointer", transition: "0.2s"
              }}
            >
              {p.c} {matches[p.c] && "✓"}
            </button>
            <button
              onClick={() => handleSelectDesc(descs[i].d)}
              style={{
                flex: 2, padding: 15, borderRadius: 8, border: "1px solid", fontSize: 12, textAlign: "left",
                borderColor: Object.values(matches).includes(descs[i].d) ? "#6366F1" : "rgba(255,255,255,0.2)",
                background: Object.values(matches).includes(descs[i].d) ? "rgba(99, 102, 241, 0.1)" : "transparent",
                color: "#ddd", cursor: "pointer", transition: "0.2s"
              }}
            >
              {descs[i].d}
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onComplete(check())}
        disabled={Object.keys(matches).length < stage.pairs.length}
        style={{
          marginTop: 20, width: "100%", padding: 15, borderRadius: 10, border: "none",
          background: Object.keys(matches).length < stage.pairs.length ? "#555" : "#4ade80",
          color: Object.keys(matches).length < stage.pairs.length ? "#888" : "#000",
          fontWeight: "bold", fontSize: 16, cursor: Object.keys(matches).length < stage.pairs.length ? "not-allowed" : "pointer"
        }}
      >
        Verificar Respostas
      </button>
    </div>
  );
}

function RiskStage({ stage, onComplete }) {
  const [answers, setAnswers] = useState({});

  function check() {
    let hits = 0;
    stage.items.forEach((item, i) => {
      const isRiskAns = answers[i] === "risk";
      const isSafeAns = answers[i] === "safe";
      if ((isRiskAns && item.isRisk) || (isSafeAns && item.isSafe)) hits++;
    });
    return (hits / stage.items.length) * 20;
  }

  return (
    <div style={{ padding: 20 }}>
      <p style={{ color: "#aaa", marginBottom: 20 }}>Classifique os cenários como RISCO ou SEGURO de acordo com a premissa de autenticação.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {stage.items.map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.05)", padding: 15, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ color: "#fff", margin: "0 0 15px", fontSize: 14, lineHeight: 1.5 }}>{item.scenario}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setAnswers({ ...answers, [i]: "risk" })}
                style={{
                  flex: 1, padding: 10, borderRadius: 6, fontWeight: "bold", border: answers[i] === "risk" ? "2px solid #EF4444" : "1px solid rgba(255,255,255,0.2)",
                  background: answers[i] === "risk" ? "rgba(239, 68, 68, 0.2)" : "transparent", color: answers[i] === "risk" ? "#EF4444" : "#ccc", cursor: "pointer"
                }}
              >⚠️ RISCO</button>
              <button
                onClick={() => setAnswers({ ...answers, [i]: "safe" })}
                style={{
                  flex: 1, padding: 10, borderRadius: 6, fontWeight: "bold", border: answers[i] === "safe" ? "2px solid #10B981" : "1px solid rgba(255,255,255,0.2)",
                  background: answers[i] === "safe" ? "rgba(16, 185, 129, 0.2)" : "transparent", color: answers[i] === "safe" ? "#10B981" : "#ccc", cursor: "pointer"
                }}
              >🛡️ SEGURO</button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onComplete(check())}
        disabled={Object.keys(answers).length < stage.items.length}
        style={{
          marginTop: 20, width: "100%", padding: 15, borderRadius: 10, border: "none",
          background: Object.keys(answers).length < stage.items.length ? "#555" : "#4ade80",
          color: Object.keys(answers).length < stage.items.length ? "#888" : "#000",
          fontWeight: "bold", fontSize: 16, cursor: Object.keys(answers).length < stage.items.length ? "not-allowed" : "pointer"
        }}
      >
        Verificar Avaliação
      </button>
    </div>
  );
}

function DragStage({ stage, onComplete }) {
  const [assignments, setAssignments] = useState({});

  function check() {
    let hits = 0;
    stage.items.forEach(item => {
      if (assignments[item.id] === item.cat) hits++;
    });
    return (hits / stage.items.length) * 20;
  }

  return (
    <div style={{ padding: 20 }}>
      <p style={{ color: "#aaa", marginBottom: 20 }}>Mapeie cada tecnologia para a categoria de duplo-fator (O que você Sabe x O que você Possui).</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {stage.items.map(item => (
          <div key={item.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(255,255,255,0.05)", padding: "10px 15px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <span style={{ color: "#fff", fontSize: 14 }}>{item.label}</span>
            <div style={{ display: "flex", gap: 5 }}>
              {stage.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setAssignments({ ...assignments, [item.id]: cat.id })}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: "bold",
                    background: assignments[item.id] === cat.id ? cat.color : "rgba(255,255,255,0.1)",
                    color: assignments[item.id] === cat.id ? "#fff" : "#aaa", cursor: "pointer", transition: "0.2s"
                  }}
                >{cat.name}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onComplete(check())}
        disabled={Object.keys(assignments).length < stage.items.length}
        style={{
          marginTop: 20, width: "100%", padding: 15, borderRadius: 10, border: "none",
          background: Object.keys(assignments).length < stage.items.length ? "#555" : "#4ade80",
          color: Object.keys(assignments).length < stage.items.length ? "#888" : "#000",
          fontWeight: "bold", fontSize: 16, cursor: Object.keys(assignments).length < stage.items.length ? "not-allowed" : "pointer"
        }}
      >
        Confirmar Classificação
      </button>
    </div>
  );
}

function BossStage({ stage, onComplete }) {
  const [selected, setSelected] = useState({});

  function check() {
    let hits = 0;
    stage.options.forEach(opt => {
      const isSelected = !!selected[opt.id];
      if (isSelected === opt.correct) hits++;
    });
    return (hits / stage.options.length) * 20;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 60, marginBottom: 10 }}>👹</div>
        <h3 style={{ color: "#FFA500", margin: 0 }}>CENÁRIO FINAL (BOSS)</h3>
      </div>
      <p style={{ color: "#fff", fontSize: 16, marginBottom: 20, lineHeight: 1.5, fontWeight: "bold" }}>{stage.question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {stage.options.map(opt => (
          <label key={opt.id} style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: 15, borderRadius: 8,
            background: selected[opt.id] ? "rgba(74, 222, 128, 0.15)" : "rgba(255,255,255,0.05)",
            border: selected[opt.id] ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "0.25s"
          }}>
            <input type="checkbox" checked={!!selected[opt.id]} onChange={() => setSelected({ ...selected, [opt.id]: !selected[opt.id] })}
              style={{ width: 20, height: 20, accentColor: "#4ade80", marginTop: 2 }} />
            <span style={{ color: selected[opt.id] ? "#fff" : "#ccc", fontSize: 14, lineHeight: 1.4 }}>{opt.text}</span>
          </label>
        ))}
      </div>
      <button
        onClick={() => onComplete(check())}
        style={{
          marginTop: 25, width: "100%", padding: 15, borderRadius: 10, border: "none",
          background: "linear-gradient(90deg, #F59E0B, #EF4444)", color: "#fff", textTransform: "uppercase",
          fontWeight: "bold", fontSize: 16, cursor: "pointer", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)"
        }}
      >
        Enfrentar o Boss
      </button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function AtividadeHackersDoBemM4A03() {
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
      const entry = {
        name,
        score: total,
        stageScores: allScores,
        duration,
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "hackersdobem_m4a03_ranking"), entry);
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
    <div style={{
      minHeight: "100vh", background: "#0D1117", fontFamily: "system-ui, sans-serif",
      color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: 20
    }}>
      <div ref={scrollRef} style={{
        width: "100%", maxWidth: 600, background: "#161B22", borderRadius: 16, border: "1px solid #30363D",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)", overflowY: "auto", maxHeight: "90vh"
      }}>
        
        {screen === "welcome" && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🔐</div>
            <h1 style={{ margin: "0 0 10px", color: "#4ade80", fontSize: 24, textTransform: "uppercase" }}>Módulo 04 • Aula 03</h1>
            <h2 style={{ margin: "0 0 20px", fontSize: 28 }}>Tecnologias de Autenticação</h2>
            <p style={{ color: "#aaa", fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
              Sua missão é provar seu domínio sobre os conceitos de controle de acesso.
              Identifique as tecnologias ideais e defina os fatores de autenticação com exatidão.
            </p>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              style={{
                width: "100%", padding: 15, borderRadius: 8, border: "1px solid #30363D",
                background: "#0D1117", color: "#fff", fontSize: 16, marginBottom: 20, boxSizing: "border-box", outline: "none"
              }}
            />
            <button
              onClick={() => start(studentName)}
              disabled={studentName.trim().length < 3}
              style={{
                width: "100%", padding: 16, borderRadius: 8, border: "none", background: studentName.trim().length < 3 ? "#30363D" : "#4ade80",
                color: studentName.trim().length < 3 ? "#888" : "#000", fontWeight: "bold", fontSize: 18, cursor: studentName.trim().length < 3 ? "not-allowed" : "pointer"
              }}
            >
              Iniciar Verificação de Sistemas
            </button>
          </div>
        )}

        {screen === "stage" && (
          <div>
            <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                  Etapa {stage.id} de {STAGES.length}
                </span>
                <h2 style={{ margin: "5px 0 0", fontSize: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{stage.emoji}</span> {stage.title}
                </h2>
                <p style={{ color: "#aaa", margin: "5px 0 0", fontSize: 13 }}>{stage.subtitle}</p>
              </div>
            </div>

            <hr style={{ border: 0, borderBottom: "1px solid #30363D", margin: "20px 0" }} />
            
            <div style={{ height: "calc(100% - 140px)" }}>
              {stage.type === "select" && <SelectStage stage={stage} onComplete={completeStage} />}
              {stage.type === "match" && <MatchStage stage={stage} onComplete={completeStage} />}
              {stage.type === "risk" && <RiskStage stage={stage} onComplete={completeStage} />}
              {stage.type === "drag" && <DragStage stage={stage} onComplete={completeStage} />}
              {stage.type === "boss" && <BossStage stage={stage} onComplete={completeStage} />}
            </div>
          </div>
        )}

        {screen === "result" && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 10 }}>🎉</div>
            <h1 style={{ margin: "0 0 5px", color: "#4ade80", fontSize: 14, letterSpacing: 2 }}>MISSÃO CUMPRIDA</h1>
            <h2 style={{ margin: "0 0 30px", fontSize: 24 }}>{studentName}</h2>
            
            <div style={{ background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)", padding: 30, borderRadius: 16, marginBottom: 30 }}>
              <div style={{ fontSize: 48, fontWeight: "900", color: "#4ade80", lineHeight: 1 }}>
                {Math.round(scores.reduce((a, b) => a + b, 0))}
              </div>
              <div style={{ color: "#4ade80", opacity: 0.8, fontSize: 14, marginTop: 5, textTransform: "uppercase", letterSpacing: 1 }}>
                / 100 pontos
              </div>
            </div>

            <div style={{ textAlign: "left", background: "#0D1117", padding: 20, borderRadius: 12, border: "1px solid #30363D" }}>
              <h3 style={{ margin: "0 0 15px", color: "#aaa", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Desempenho por Etapa</h3>
              {STAGES.map((s, i) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: "#ccc" }}>Etapa {s.id}: <span style={{ opacity: 0.6 }}>{s.title}</span></span>
                  <span style={{ color: scores[i] === 20 ? "#4ade80" : scores[i] > 10 ? "#fbbf24" : "#f87171", fontWeight: "bold" }}>
                    {Math.round(scores[i])}/20
                  </span>
                </div>
              ))}
            </div>

            <button
               onClick={() => { window.location.href = '/hackersdobem'; }}
               style={{
                 marginTop: 30, width: "100%", padding: 15, borderRadius: 8, border: "1px solid #4ade80",
                 background: "transparent", color: "#4ade80", fontWeight: "bold", fontSize: 16, cursor: "pointer"
               }}
            >
              Voltar ao Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
