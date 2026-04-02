import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    id: 1,
    emoji: "🔐",
    title: "Tecnologias de Autenticação",
    subtitle: "Identifique a tecnologia correta para cada cenário",
    color: "#1A237E",
    accent: "#283593",
    points: 20,
    time: 240,
    type: "select",
    questions: [
      {
        id: "q1_1", pts: 4,
        text: "Maria usa um cartão com chip que exige senha para acessar o sistema do banco. O microprocessador valida internamente e gera um código único.",
        options: ["Token USB", "Smart-Card", "TOTP", "Código Estático", "IEEE 802.1X"],
        answer: "Smart-Card",
        feedback: "O Smart-Card combina ownership + knowledge factor: o cartão físico (algo que possui) + a senha (algo que sabe), gerando um código único de autenticação."
      },
      {
        id: "q1_2", pts: 4,
        text: "O servidor da empresa armazena e distribui chaves criptográficas usadas para cifrar dados sensíveis. O dispositivo responsável é um HSM.",
        options: ["Smart-Card", "RADIUS", "Dispositivo de Gerenciamento de Chaves", "Token USB", "IEEE 802.1X"],
        answer: "Dispositivo de Gerenciamento de Chaves",
        feedback: "HSMs (Hardware Security Modules) são exemplos de Dispositivos de Gerenciamento de Chaves — responsáveis por gerar, armazenar e distribuir chaves criptográficas."
      },
      {
        id: "q1_3", pts: 4,
        text: "Ao conectar o notebook à rede corporativa via cabo, o switch exige autenticação antes de liberar o acesso à rede.",
        options: ["RADIUS", "TOTP", "IEEE 802.1X", "Smart-Card", "Código Estático"],
        answer: "IEEE 802.1X",
        feedback: "O IEEE 802.1X é o protocolo de controle de acesso à rede — eficaz em redes com fio e sem fio, amplamente usado em ambientes corporativos."
      },
      {
        id: "q1_4", pts: 4,
        text: "Um aplicativo gera um código de 6 dígitos que muda a cada 30 segundos, baseado no horário atual e numa chave secreta compartilhada.",
        options: ["HOTP", "Código Estático", "TOTP", "Smart-Card", "Token USB"],
        answer: "TOTP",
        feedback: "TOTP (Time-based One-Time Password) gera senhas únicas com base no tempo atual — exige sincronia temporal entre dispositivo e servidor."
      },
      {
        id: "q1_5", pts: 4,
        text: "Carlos usa um código PIN fixo para entrar no datacenter. Esse código não muda ao longo do tempo.",
        options: ["HOTP", "TOTP", "Código Estático", "Smart-Card", "RADIUS"],
        answer: "Código Estático",
        feedback: "Códigos Estáticos são senhas ou PINs que permanecem constantes — práticos, mas com maior risco de comprometimento por reutilização."
      },
    ]
  },
  {
    id: 2,
    emoji: "📡",
    title: "Protocolos e Componentes",
    subtitle: "Associe cada descrição ao protocolo ou componente correto",
    color: "#4A148C",
    accent: "#6A1B9A",
    points: 20,
    time: 240,
    type: "select",
    questions: [
      {
        id: "q2_1", pts: 5,
        text: "Protocolo que gerencia autenticação, autorização e contabilidade (AAA) operando em modelo cliente-servidor.",
        options: ["IEEE 802.1X", "RADIUS", "TOTP", "TPM", "EAP"],
        answer: "RADIUS",
        feedback: "RADIUS (Remote Authentication Dial-In User Service) gerencia o tripé AAA: autentica usuários, autoriza recursos e registra contabilidade de acesso."
      },
      {
        id: "q2_2", pts: 5,
        text: "No IEEE 802.1X, qual é o papel do dispositivo que busca acesso à rede (ex: notebook do usuário)?",
        options: ["Autenticador", "Servidor RADIUS", "Suplicante", "TPM", "HSM"],
        answer: "Suplicante",
        feedback: "O Suplicante (Supplicant) é o dispositivo que solicita acesso. O Autenticador é o switch/AP e o Servidor de Autenticação é geralmente o RADIUS."
      },
      {
        id: "q2_3", pts: 5,
        text: "Algoritmo baseado em HMAC que gera senhas únicas usando uma chave secreta combinada com um CONTADOR.",
        options: ["TOTP", "HOTP", "RADIUS", "IEEE 802.1X", "TPM"],
        answer: "HOTP",
        feedback: "HOTP (HMAC-based OTP) usa um contador incremental. Diferente do TOTP, os códigos são válidos até serem usados — sem dependência de sincronização de tempo."
      },
      {
        id: "q2_4", pts: 5,
        text: "Qual componente do IEEE 802.1X é responsável por definir políticas de autenticação e autorização para os suplicantes?",
        options: ["Suplicante", "Autenticador (Switch/AP)", "Servidor de Autenticação (RADIUS)", "HSM", "Token USB"],
        answer: "Servidor de Autenticação (RADIUS)",
        feedback: "O Servidor de Autenticação (normalmente RADIUS) define as políticas, processa as credenciais e informa ao Autenticador se o acesso deve ser liberado."
      },
    ]
  },
  {
    id: 3,
    emoji: "⚠️",
    title: "Analisando Cenários de Segurança",
    subtitle: "Cada situação representa um RISCO ou uma PRÁTICA SEGURA?",
    color: "#B71C1C",
    accent: "#C62828",
    points: 20,
    time: 240,
    type: "risk",
    questions: [
      {
        id: "q3_1", pts: 4,
        text: "O token USB de autenticação foi perdido por um funcionário, mas nenhuma medida foi tomada pois ele também precisa de senha.",
        answer: "RISCO",
        feedback: "RISCO! Um dispositivo comprometido (perdido/roubado) expõe a autenticação. A proteção do token deve ser imediata — revogar e emitir novo token é obrigatório."
      },
      {
        id: "q3_2", pts: 4,
        text: "A empresa implementou 2FA combinando senha + código TOTP gerado pelo Google Authenticator para acesso ao sistema.",
        answer: "SEGURO",
        feedback: "PRÁTICA SEGURA! A Verificação em Duas Etapas combina algo que o usuário sabe (senha) com algo que possui (TOTP), mitigando riscos de senhas comprometidas."
      },
      {
        id: "q3_3", pts: 4,
        text: "O servidor RADIUS não foi atualizado há 2 anos e não possui backup das configurações de autenticação.",
        answer: "RISCO",
        feedback: "RISCO! Dispositivos desatualizados acumulam vulnerabilidades. A ausência de backup e monitoramento viola as considerações básicas de segurança em gerenciamento de chaves."
      },
      {
        id: "q3_4", pts: 4,
        text: "Os certificados digitais da empresa são criados por uma HSM e armazenados com controle de acesso físico rigoroso.",
        answer: "SEGURO",
        feedback: "PRÁTICA SEGURA! HSMs com proteção física evitam acesso não autorizado às chaves criptográficas — implementação ideal para criação de certificados digitais."
      },
      {
        id: "q3_5", pts: 4,
        text: "O sistema usa apenas código PIN fixo (código estático) sem nenhuma camada adicional de autenticação para acesso remoto.",
        answer: "RISCO",
        feedback: "RISCO! Códigos estáticos sozinhos são vulneráveis a reutilização e ataques de força bruta. Devem ser combinados com outros fatores (2FA) especialmente em acesso remoto."
      },
    ]
  },
  {
    id: 4,
    emoji: "🔄",
    title: "HOTP vs. TOTP — Classificação",
    subtitle: "Classifique cada característica como HOTP, TOTP ou AMBOS",
    color: "#004D40",
    accent: "#00695C",
    points: 20,
    time: 240,
    type: "select",
    questions: [
      {
        id: "q4_1", pts: 4,
        text: "O fator de geração do código é baseado no TEMPO ATUAL, não em um contador.",
        options: ["Apenas HOTP", "Apenas TOTP", "Ambos (HOTP e TOTP)", "Nenhum dos dois", "RADIUS"],
        answer: "Apenas TOTP",
        feedback: "TOTP usa o tempo como fator variável — gera um código novo a cada intervalo (ex: 30 segundos). O HOTP usa um contador incremental."
      },
      {
        id: "q4_2", pts: 4,
        text: "Os códigos gerados são válidos SOMENTE ATÉ SEREM USADOS (não expiram por tempo).",
        options: ["Apenas HOTP", "Apenas TOTP", "Ambos (HOTP e TOTP)", "Nenhum dos dois", "Smart-Card"],
        answer: "Apenas HOTP",
        feedback: "No HOTP, os códigos são válidos até serem utilizados. No TOTP, eles expiram após um curto período de tempo, mesmo sem uso."
      },
      {
        id: "q4_3", pts: 4,
        text: "Exige SINCRONIA TEMPORAL entre o dispositivo do usuário e o servidor de autenticação.",
        options: ["Apenas HOTP", "Apenas TOTP", "Ambos (HOTP e TOTP)", "Nenhum dos dois", "IEEE 802.1X"],
        answer: "Apenas TOTP",
        feedback: "O TOTP depende do horário sincronizado entre cliente e servidor. O HOTP não precisa de sincronia temporal — usa um contador compartilhado."
      },
      {
        id: "q4_4", pts: 4,
        text: "Utiliza uma CHAVE SECRETA compartilhada entre o servidor e o dispositivo do usuário para gerar os códigos.",
        options: ["Apenas HOTP", "Apenas TOTP", "Ambos (HOTP e TOTP)", "Nenhum dos dois", "Código Estático"],
        answer: "Ambos (HOTP e TOTP)",
        feedback: "Tanto HOTP quanto TOTP compartilham uma chave secreta entre servidor e cliente — a diferença é o fator variável: contador (HOTP) ou tempo (TOTP)."
      },
      {
        id: "q4_5", pts: 4,
        text: "É mais adequado quando a sincronia temporal entre dispositivos é DIFÍCIL de garantir.",
        options: ["Apenas HOTP", "Apenas TOTP", "Ambos (HOTP e TOTP)", "Nenhum dos dois", "RADIUS"],
        answer: "Apenas HOTP",
        feedback: "O HOTP é recomendado quando não é possível garantir sincronia de relógio. O TOTP só funciona corretamente quando ambos os lados têm o horário sincronizado."
      },
    ]
  },
  {
    id: 5,
    emoji: "🏆",
    title: "Boss Final: Incidente de Autenticação",
    subtitle: "Analise o cenário crítico e responda com seus conhecimentos",
    color: "#880E4F",
    accent: "#AD1457",
    points: 20,
    time: 240,
    type: "boss",
    scenario: "A empresa TechSafe sofreu um incidente de segurança. Um ex-funcionário acessou o sistema remotamente usando suas credenciais antigas (usuário e senha estática). O sistema não tinha 2FA ativo. Além disso, o servidor RADIUS estava desatualizado há 18 meses e não havia backup das políticas de acesso. A rede corporativa não utilizava IEEE 802.1X para controle de acesso.",
    questions: [
      {
        id: "q5_1", pts: 5,
        text: "Quais falhas de segurança você identifica no cenário? (selecione todas que se aplicam)",
        type: "multi",
        options: [
          { text: "Uso exclusivo de código estático (senha) sem 2FA", correct: true },
          { text: "Credenciais não revogadas após desligamento", correct: true },
          { text: "Servidor RADIUS desatualizado e sem backup", correct: true },
          { text: "Ausência de controle de acesso IEEE 802.1X na rede", correct: true },
          { text: "Uso de Smart-Card ao invés de senha", correct: false },
          { text: "Excesso de fatores de autenticação", correct: false },
        ],
        feedback: "As 4 falhas são: senha estática sem 2FA, credenciais ativas pós-demissão, RADIUS desatualizado/sem backup e ausência de IEEE 802.1X."
      },
      {
        id: "q5_2", pts: 5,
        text: "Qual tecnologia, se implementada, teria impedido o acesso do ex-funcionário mesmo com a senha correta?",
        type: "single",
        options: ["Código Estático mais complexo", "Verificação em Duas Etapas (2FA)", "Atualização do Windows", "Firewall de rede"],
        answer: "Verificação em Duas Etapas (2FA)",
        feedback: "O 2FA (ex: TOTP via Google Authenticator) exigiria um segundo fator além da senha — mesmo com a senha comprometida, o acesso seria bloqueado sem o token."
      },
      {
        id: "q5_3", pts: 5,
        text: "O TOTP seria mais indicado que o HOTP neste cenário corporativo. Por quê?",
        type: "single",
        options: [
          "Porque o TOTP não precisa de chave secreta",
          "Porque o HOTP não gera códigos numéricos",
          "Porque o TOTP expira por tempo, dificultando ataques de replay",
          "Porque o TOTP dispensa servidor de autenticação"
        ],
        answer: "Porque o TOTP expira por tempo, dificultando ataques de replay",
        feedback: "O TOTP expira automaticamente após um curto período — mesmo que o código seja interceptado, ele rapidamente se torna inválido, protegendo contra ataques de replay."
      },
      {
        id: "q5_4", pts: 5,
        text: "Para proteger o acesso à rede interna, qual protocolo deveria ser implementado nos switches corporativos?",
        type: "single",
        options: ["RADIUS isolado", "Código PIN estático", "IEEE 802.1X com servidor RADIUS", "TOTP sem servidor"],
        answer: "IEEE 802.1X com servidor RADIUS",
        feedback: "O IEEE 802.1X integrado ao RADIUS é a combinação ideal: o 802.1X controla o acesso à porta de rede, enquanto o RADIUS autentica, autoriza e registra os acessos."
      },
    ]
  }
];

const LEVELS = [
  { min: 90, label: "LENDÁRIO", title: "Hacker do Bem Master", color: "#FFD700", bg: "#1A237E", msg: "Desempenho extraordinário! Você domina completamente as tecnologias de autenticação. A TechSafe está em boas mãos!" },
  { min: 75, label: "ESPECIALISTA", title: "Analista Sênior de Segurança", color: "#00E676", bg: "#1B5E20", msg: "Ótimo resultado! Você tem sólido conhecimento sobre protocolos e tecnologias de autenticação. Pequenos ajustes e você chega ao topo!" },
  { min: 60, label: "PROFICIENTE", title: "Analista Pleno", color: "#40C4FF", bg: "#01579B", msg: "Bom desempenho! Você compreende os conceitos principais. Revise as diferenças entre HOTP/TOTP e os componentes do IEEE 802.1X." },
  { min: 40, label: "APRENDIZ", title: "Analista Júnior", color: "#FFB300", bg: "#E65100", msg: "Continue estudando! Você está no caminho certo. Revise o material da Aula 03 focando em Smart-Card, RADIUS e verificação em duas etapas." },
  { min: 0, label: "INICIANTE", title: "Estagiário de Segurança", color: "#FF5252", bg: "#B71C1C", msg: "Não desanime! Todo hacker do bem começa aqui. Releia o conteúdo completo da aula e tente novamente." },
];

function getLevel(score) {
  return LEVELS.find(l => score >= l.min);
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

function useTimer(seconds, active) {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef(null);
  useEffect(() => { setRemaining(seconds); }, [seconds]);
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

function btnStyle(bg, color = "#fff") {
  return {
    width: "100%", padding: "14px", borderRadius: 10, border: "none",
    background: bg, color, fontSize: 15, fontWeight: 700, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
    boxShadow: `0 4px 20px ${bg}60`, transition: "transform 0.15s, box-shadow 0.15s",
    marginTop: 8
  };
}

function ScoreBox({ s, max }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 16 }}>
      <div style={{ fontSize: 48, fontWeight: 900, color: s >= max * 0.8 ? "#00E676" : s >= max * 0.5 ? "#FFB300" : "#FF5252", fontFamily: "'Space Mono', monospace" }}>
        {s}<span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)" }}>/{max}</span>
      </div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>pontos nesta etapa</div>
    </div>
  );
}

function SelectStage({ stage, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const timer = useTimer(stage.time, !submitted);

  function score() {
    return stage.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? q.pts : 0), 0);
  }

  function submit() {
    if (Object.keys(answers).length < stage.questions.length) { alert("Responda todas as questões antes de avançar!"); return; }
    setSubmitted(true);
  }

  const s = score();
  return (
    <div>
      {!submitted && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} /></div>}
      {stage.questions.map((q, qi) => {
        const isRight = submitted && answers[q.id] === q.answer;
        const isWrong = submitted && answers[q.id] !== q.answer;
        return (
          <div key={q.id} style={{
            background: submitted ? (isRight ? "rgba(0,230,118,0.08)" : "rgba(255,82,82,0.08)") : "rgba(255,255,255,0.04)",
            border: `1px solid ${submitted ? (isRight ? "#00E676" : "#FF5252") : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, padding: "18px 20px", marginBottom: 14
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
                      padding: "8px 16px", borderRadius: 8, border: "1.5px solid",
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
        : <><ScoreBox s={s} max={stage.points} /><button onClick={() => onComplete(s)} style={btnStyle("#00E676", "#000")}>Próxima Etapa →</button></>
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
    if (Object.keys(answers).length < stage.questions.length) { alert("Classifique todas as situações!"); return; }
    setSubmitted(true);
  }

  const s = score();
  return (
    <div>
      {!submitted && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} /></div>}
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
                      transition: "all 0.2s", fontFamily: "'Space Mono', monospace", letterSpacing: 1
                    }}>{opt === "RISCO" ? "⚠ RISCO" : "✓ SEGURO"}</button>
                );
              })}
            </div>
            {submitted && <p style={{ margin: "10px 0 0", fontSize: 13, color: isRight ? "#69F0AE" : "#FFAB91", fontStyle: "italic" }}>
              {isRight ? "✓" : `✗ Correto: ${q.answer}`} — {q.feedback}
            </p>}
          </div>
        );
      })}
      {!submitted
        ? <button onClick={submit} style={btnStyle(stage.accent)}>Verificar Respostas →</button>
        : <><ScoreBox s={s} max={stage.points} /><button onClick={() => onComplete(s)} style={btnStyle("#00E676", "#000")}>Próxima Etapa →</button></>
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

  function submit() {
    const unanswered = stage.questions.filter(q => {
      if (q.type === "multi") return !(answers[q.id] && answers[q.id].length > 0);
      return !answers[q.id];
    });
    if (unanswered.length > 0) { alert("Responda todas as questões!"); return; }
    setSubmitted(true);
  }

  const s = Math.min(stage.questions.reduce((acc, q) => acc + scoreQ(q), 0), stage.points);

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

      {!submitted && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}><TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} /></div>}

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
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8,
                      cursor: submitted ? "default" : "pointer",
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
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8,
                      cursor: submitted ? "default" : "pointer",
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
        : <><ScoreBox s={s} max={stage.points} /><button onClick={() => onComplete(s)} style={btnStyle("#00E676", "#000")}>Ver Resultado Final 🏆</button></>
      }
    </div>
  );
}

function Welcome({ onStart }) {
  const [name, setName] = useState("");
  return (
    <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔐</div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "#00E676", fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>HACKERS DO BEM — MÓDULO 04</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2, fontFamily: "'DM Sans', sans-serif" }}>
        Missão: Proteja a<br /><span style={{ color: "#40C4FF" }}>Autenticação da TechSafe</span>
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, margin: "12px 0 32px", lineHeight: 1.6 }}>
        Domine Smart-Cards, RADIUS, IEEE 802.1X, HOTP, TOTP e 2FA. Complete as 5 etapas e descubra seu nível!
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
          fontFamily: "'DM Sans', sans-serif", marginBottom: 16
        }}
        onFocus={e => e.target.style.borderColor = "#40C4FF"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
      />
      <button onClick={() => name.trim() && onStart(name.trim())} disabled={!name.trim()}
        style={{ ...btnStyle("#40C4FF", "#000"), opacity: name.trim() ? 1 : 0.4, cursor: name.trim() ? "pointer" : "not-allowed" }}>
        Iniciar Missão →
      </button>
      <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
        Prof. Alexsander Farias · Aula 03 · Tecnologias de Autenticação
      </p>
    </div>
  );
}

function FinalResult({ name, scores }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const level = getLevel(total);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#00E676", fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>RESULTADO FINAL</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>{name}</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: 14 }}>Hackers do Bem — Módulo 04, Aula 03</p>
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${level.bg}cc, ${level.bg}88)`,
        border: `2px solid ${level.color}44`, borderRadius: 20, padding: 28, marginBottom: 24, textAlign: "center"
      }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: level.color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>/ 100 pontos</div>
        <div style={{ display: "inline-block", background: level.color, color: "#000", padding: "6px 20px", borderRadius: 30, fontWeight: 900, fontSize: 14, letterSpacing: 2, marginBottom: 8 }}>{level.label}</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 600 }}>{level.title}</div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${total}%`, borderRadius: 10, background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)`, transition: "width 1s ease", boxShadow: `0 0 12px ${level.color}80` }} />
        </div>
      </div>

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

      <div style={{ background: `${level.color}11`, border: `1px solid ${level.color}33`, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
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

export default function AtividadeHackersDoBemM4A03() {
  const [screen, setScreen] = useState("welcome");
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
        module: "M04A03"
      };
      await addDoc(collection(db, "fametro_ranking"), entry);
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
      color: "#fff", fontFamily: "'DM Sans', sans-serif", overflowY: "auto"
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

          {(stage.type === "select" || stage.type === "match") && <SelectStage key={stageIdx} stage={stage} onComplete={completeStage} />}
          {stage.type === "risk" && <RiskStage key={stageIdx} stage={stage} onComplete={completeStage} />}
          {stage.type === "boss" && <BossStage key={stageIdx} stage={stage} onComplete={completeStage} />}
        </div>
      )}

      {screen === "result" && <FinalResult name={studentName} scores={scores} />}
    </div>
  );
}
