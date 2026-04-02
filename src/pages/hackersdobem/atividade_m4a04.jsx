import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    id: 1,
    emoji: "🧬",
    title: "Fundamentos da Biometria",
    subtitle: "Identifique os princípios corretos da autenticação biométrica",
    color: "#0D47A1",
    accent: "#1565C0",
    points: 20,
    time: 240,
    type: "select",
    questions: [
      {
        id: "q1_1", pts: 4,
        text: "Qual princípio da biometria garante que as características físicas ou comportamentais são ÚNICAS para cada indivíduo?",
        options: ["Universalidade", "Permanência", "Singularidade", "Coleta não invasiva", "Throughput"],
        answer: "Singularidade",
        feedback: "A Singularidade é o princípio que garante que as características biométricas são únicas para cada indivíduo — nenhuma pessoa possui impressão digital ou íris idênticas a de outra."
      },
      {
        id: "q1_2", pts: 4,
        text: "O princípio que indica que as características biométricas SEMPRE estão presentes em todos os seres humanos é chamado de:",
        options: ["Singularidade", "Permanência", "Universalidade", "Coleta não invasiva", "Scanning"],
        answer: "Universalidade",
        feedback: "Universalidade significa que todos os seres humanos possuem as características biométricas utilizadas pelo sistema — como rosto, voz, impressão digital."
      },
      {
        id: "q1_3", pts: 4,
        text: "A autenticação biométrica transforma características do corpo humano em representações matemáticas para comparação. Qual processo realiza essa transformação?",
        options: ["Tokenização", "Scanning", "Hashing HMAC", "Criptografia TOTP", "Certificação Digital"],
        answer: "Scanning",
        feedback: "O processo de Scanning captura e digitaliza as características biométricas, convertendo-as em representações matemáticas que podem ser comparadas de forma precisa para autenticação."
      },
      {
        id: "q1_4", pts: 4,
        text: "Qual característica biométrica é classificada como física E é citada como a mais amplamente implementada?",
        options: ["Assinatura dinâmica", "Padrão de digitação", "Impressão digital", "Comportamento com mouse", "Voz"],
        answer: "Impressão digital",
        feedback: "A impressão digital é o método biométrico físico mais amplamente implementado — relativamente barato, não intrusivo e de processo simples, apesar de poder ser afetado por umidade ou sujeira."
      },
      {
        id: "q1_5", pts: 4,
        text: "Qual é a diferença fundamental entre biometria FÍSICA e biometria COMPORTAMENTAL?",
        options: [
          "Biometria física usa câmeras; comportamental usa sensores",
          "Biometria física mede características do corpo; comportamental mede o que o usuário FAZ",
          "Biometria física é mais cara; comportamental é gratuita",
          "Biometria física requer senha adicional; comportamental não",
          "Biometria física é para acesso; comportamental é para logout"
        ],
        answer: "Biometria física mede características do corpo; comportamental mede o que o usuário FAZ",
        feedback: "A biometria física utiliza características do corpo (impressão digital, rosto, íris), enquanto a biometria comportamental analisa padrões e ações do usuário (forma de digitar, assinar, usar o mouse)."
      },
    ]
  },
  {
    id: 2,
    emoji: "👁️",
    title: "Reconhecimento Facial",
    subtitle: "Associe cada descrição ao conceito correto de reconhecimento facial",
    color: "#4A148C",
    accent: "#6A1B9A",
    points: 20,
    time: 240,
    type: "select",
    questions: [
      {
        id: "q2_1", pts: 5,
        text: "No reconhecimento facial, qual etapa converte os traços faciais capturados em dados matemáticos que formam o modelo biométrico?",
        options: ["Scanning", "Extração de características", "Armazenamento seguro", "Comparação e autenticação", "Atualização contínua"],
        answer: "Extração de características",
        feedback: "A Extração de características é a etapa em que algoritmos de reconhecimento facial retiram traços-chave da imagem digitalizada e os convertem em dados matemáticos que formam o modelo biométrico."
      },
      {
        id: "q2_2", pts: 5,
        text: "O reconhecimento facial registra indicadores como tamanho e formato do rosto, distância entre olhos e largura do nariz. Qual ponto de atenção é crítico na captura?",
        options: [
          "O usuário deve usar óculos escuros",
          "Deve ser realizado sob condições ideais de iluminação",
          "O usuário deve estar em movimento",
          "A câmera deve ser infravermelha obrigatoriamente",
          "A captura deve ocorrer apenas à noite"
        ],
        answer: "Deve ser realizado sob condições ideais de iluminação",
        feedback: "O reconhecimento facial requer condições ideais de iluminação para capturar e extrair características com precisão. Iluminação inadequada prejudica a qualidade da imagem e pode gerar falhas de autenticação."
      },
      {
        id: "q2_3", pts: 5,
        text: "Alguns sistemas de reconhecimento facial suportam 'aprendizado contínuo'. O que isso significa?",
        options: [
          "O sistema aprende novas senhas automaticamente",
          "O sistema se ajusta às mudanças na aparência do usuário ao longo do tempo",
          "O sistema aprende com os hackers para resistir a ataques",
          "O sistema memoriza os rostos dos visitantes sem autorização",
          "O sistema bloqueia novos usuários automaticamente"
        ],
        answer: "O sistema se ajusta às mudanças na aparência do usuário ao longo do tempo",
        feedback: "A atualização contínua permite que sistemas de reconhecimento facial se adaptem às mudanças naturais na aparência de uma pessoa (envelhecimento, mudança de estilo), mantendo a autenticação eficaz."
      },
      {
        id: "q2_4", pts: 5,
        text: "Qual é a limitação mais crítica do reconhecimento facial em termos de segurança e ética?",
        options: [
          "Alto consumo de energia do dispositivo",
          "Compatibilidade apenas com Android",
          "Questões legais de privacidade e altas taxas de falsa aceitação/rejeição",
          "Necessidade de conexão à internet constante",
          "Impossibilidade de uso em smartphones"
        ],
        answer: "Questões legais de privacidade e altas taxas de falsa aceitação/rejeição",
        feedback: "O reconhecimento facial apresenta desafios éticos e legais de privacidade, além de possuir altas taxas de falsa aceitação, falsa rejeição e vulnerabilidade à falsificação — limitações importantes a considerar na implementação."
      },
    ]
  },
  {
    id: 3,
    emoji: "📊",
    title: "Métricas Biométricas",
    subtitle: "Identifique a métrica correta para cada situação",
    color: "#1B5E20",
    accent: "#2E7D32",
    points: 20,
    time: 240,
    type: "select",
    questions: [
      {
        id: "q3_1", pts: 5,
        text: "João está cadastrado no sistema biométrico, mas o sistema NÃO o reconhece e nega seu acesso. Qual métrica está relacionada a este caso?",
        options: ["FAR (False Acceptance Rate)", "CER (Equal Error Rate)", "FRR (False Rejection Rate)", "FER (Failure Enroll Rate)", "Throughput Speed"],
        answer: "FRR (False Rejection Rate)",
        feedback: "A FRR (Taxa de Falsos Rejeitos) mede a frequência com que usuários legítimos e cadastrados são incorretamente negados pelo sistema — exatamente o caso de João."
      },
      {
        id: "q3_2", pts: 5,
        text: "Um impostor tenta acessar o sistema biométrico usando características falsas e o sistema ACEITA a entrada. Qual métrica registra esse tipo de falha?",
        options: ["FRR (False Rejection Rate)", "FER (Failure Enroll Rate)", "CER (Equal Error Rate)", "FAR (False Acceptance Rate)", "Throughput Speed"],
        answer: "FAR (False Acceptance Rate)",
        feedback: "A FAR (Taxa de Falsos Aceitos) mede a frequência com que impostores são aceitos incorretamente pelo sistema — um dos erros mais críticos em segurança biométrica."
      },
      {
        id: "q3_3", pts: 5,
        text: "O gestor de segurança precisa de uma métrica que mostre o PONTO DE EQUILÍBRIO entre os erros de falsa aceitação e falsa rejeição. Qual métrica usar?",
        options: ["FAR", "FRR", "FER", "CER (Equal Error Rate)", "Throughput Speed"],
        answer: "CER (Equal Error Rate)",
        feedback: "A CER (Taxa de Erro de Equalização) indica o ponto onde FAR e FRR são iguais — quanto menor a CER, mais preciso e eficaz é o sistema biométrico. É a principal métrica de comparação entre sistemas."
      },
      {
        id: "q3_4", pts: 5,
        text: "Durante a implantação do sistema, alguns funcionários não conseguem ter suas características biométricas CADASTRADAS com sucesso. Qual métrica avalia isso?",
        options: ["FAR", "FRR", "CER", "FER (Failure Enroll Rate)", "Throughput Speed"],
        answer: "FER (Failure Enroll Rate)",
        feedback: "A FER (Taxa de Erro de Falha no Cadastro) mede a porcentagem de usuários que não conseguem ter suas características biométricas cadastradas com sucesso — importante avaliar na implantação do sistema."
      },
    ]
  },
  {
    id: 4,
    emoji: "⚠️",
    title: "Análise de Cenários Biométricos",
    subtitle: "Cada situação representa um RISCO ou uma PRÁTICA SEGURA?",
    color: "#B71C1C",
    accent: "#C62828",
    points: 20,
    time: 240,
    type: "risk",
    questions: [
      {
        id: "q4_1", pts: 4,
        text: "Uma empresa usa apenas o reconhecimento facial sem nenhuma camada adicional de autenticação para acesso a dados altamente sensíveis.",
        answer: "RISCO",
        feedback: "RISCO! O reconhecimento facial sozinho pode sofrer falsificação e possui taxas de erro. Para dados sensíveis, deve-se combinar biometria com outros fatores (autenticação multifatorial)."
      },
      {
        id: "q4_2", pts: 4,
        text: "Os modelos biométricos dos funcionários são armazenados usando criptografia em um servidor seguro com controle de acesso físico rigoroso.",
        answer: "SEGURO",
        feedback: "PRÁTICA SEGURA! O armazenamento criptografado das informações biométricas com controle de acesso físico protege dados sensíveis e irreversíveis — uma vez comprometidos, não é possível alterar características biométricas."
      },
      {
        id: "q4_3", pts: 4,
        text: "Um sistema biométrico comportamental de uma empresa nunca foi atualizado e não monitora desvios no padrão de comportamento dos usuários.",
        answer: "RISCO",
        feedback: "RISCO! Sistemas biométricos comportamentais precisam de monitoramento contínuo para detectar desvios e comportamentos anormais. Sem atualização, o sistema não consegue identificar acessos suspeitos."
      },
      {
        id: "q4_4", pts: 4,
        text: "A empresa implementa biometria comportamental (padrão de digitação) como camada adicional de autenticação contínua em sistemas críticos.",
        answer: "SEGURO",
        feedback: "PRÁTICA SEGURA! A biometria comportamental como autenticação contínua é uma excelente camada adicional — monitora o comportamento durante toda a sessão, detectando acessos não autorizados mesmo após login inicial."
      },
      {
        id: "q4_5", pts: 4,
        text: "Fotografias de funcionários são coletadas e usadas para alimentar o sistema de reconhecimento facial sem consentimento explícito ou política de privacidade.",
        answer: "RISCO",
        feedback: "RISCO! A coleta de dados biométricos sem consentimento viola leis de privacidade (como a LGPD). Dados biométricos são dados pessoais sensíveis — sua coleta e uso exigem bases legais claras e consentimento."
      },
    ]
  },
  {
    id: 5,
    emoji: "🏆",
    title: "Boss Final: Incidente Biométrico",
    subtitle: "Analise o cenário crítico e responda com seus conhecimentos",
    color: "#880E4F",
    accent: "#AD1457",
    points: 20,
    time: 240,
    type: "boss",
    scenario: "A empresa BioSec implementou um sistema de acesso biométrico para sua sede. O sistema usa apenas reconhecimento facial, sem iluminação controlada e sem camada adicional de autenticação. Os modelos biométricos são armazenados sem criptografia em um banco de dados local desatualizado há 14 meses. Um ex-funcionário conseguiu acesso usando uma foto impressa de alta resolução. O sistema nunca foi calibrado e apresenta uma FRR alta para funcionários de pele escura.",
    questions: [
      {
        id: "q5_1", pts: 5,
        text: "Quais falhas de segurança você identifica no cenário? (selecione todas que se aplicam)",
        type: "multi",
        options: [
          { text: "Uso exclusivo de reconhecimento facial sem autenticação multifatorial", correct: true },
          { text: "Armazenamento de modelos biométricos sem criptografia", correct: true },
          { text: "Sistema desatualizado sem manutenção", correct: true },
          { text: "Alta FRR indicando discriminação algorítmica", correct: true },
          { text: "Uso de impressão digital como segundo fator", correct: false },
          { text: "Excesso de medidas de segurança biométrica", correct: false },
        ],
        feedback: "As 4 falhas são: ausência de MFA, armazenamento sem criptografia, sistema desatualizado/sem calibração e alta FRR discriminatória para determinados grupos."
      },
      {
        id: "q5_2", pts: 5,
        text: "O ex-funcionário acessou o sistema usando uma foto impressa. Qual métrica reflete diretamente essa vulnerabilidade?",
        type: "single",
        options: ["FRR (Taxa de Falsos Rejeitos)", "FER (Failure Enroll Rate)", "FAR (Taxa de Falsos Aceitos)", "Throughput Speed"],
        answer: "FAR (Taxa de Falsos Aceitos)",
        feedback: "A FAR (Taxa de Falsos Aceitos) mede exatamente isso — quando um impostor é aceito pelo sistema. Uma FAR alta indica que o sistema aceita características falsas ou falsificações, como uma foto."
      },
      {
        id: "q5_3", pts: 5,
        text: "Para evitar que uma foto enganasse o sistema, qual tecnologia adicional deveria ser implementada no reconhecimento facial?",
        type: "single",
        options: [
          "Câmera de maior resolução apenas",
          "Detecção de vivacidade (liveness detection)",
          "Banco de dados maior",
          "Tempo de exposição maior da câmera"
        ],
        answer: "Detecção de vivacidade (liveness detection)",
        feedback: "A detecção de vivacidade (liveness detection) verifica se o que está sendo apresentado à câmera é uma pessoa real e viva, e não uma foto, vídeo ou máscara — tecnologia essencial em sistemas robustos de reconhecimento facial."
      },
      {
        id: "q5_4", pts: 5,
        text: "A alta FRR para funcionários de pele escura demonstra qual problema nos sistemas biométricos?",
        type: "single",
        options: [
          "O sistema foi hackeado por concorrentes",
          "O banco de dados está desatualizado",
          "Viés algorítmico e discriminação nos dados de treinamento",
          "O sensor biométrico precisa de limpeza"
        ],
        answer: "Viés algorítmico e discriminação nos dados de treinamento",
        feedback: "A FRR diferenciada por grupos étnicos indica viés algorítmico — quando o modelo foi treinado com dados pouco representativos, gerando discriminação. É uma das preocupações éticas mais sérias na biometria moderna."
      },
    ]
  }
];

const LEVELS = [
  { min: 90, label: "LENDÁRIO", title: "Hacker do Bem Master", color: "#FFD700", bg: "#1A237E", msg: "Desempenho extraordinário! Você domina completamente os sistemas de autenticação biométrica. Impressionante!" },
  { min: 75, label: "ESPECIALISTA", title: "Analista Sênior de Segurança", color: "#00E676", bg: "#1B5E20", msg: "Ótimo resultado! Você tem sólido conhecimento sobre biometria e suas aplicações. Continue assim!" },
  { min: 60, label: "PROFICIENTE", title: "Analista Pleno", color: "#40C4FF", bg: "#01579B", msg: "Bom desempenho! Você compreende os conceitos principais. Revise as métricas biométricas e os riscos de privacidade." },
  { min: 40, label: "APRENDIZ", title: "Analista Júnior", color: "#FFB300", bg: "#E65100", msg: "Continue estudando! Revise o material da Aula 04 focando em FRR, FAR, reconhecimento facial e tecnologias comportamentais." },
  { min: 0, label: "INICIANTE", title: "Estagiário de Segurança", color: "#FF5252", bg: "#B71C1C", msg: "Não desanime! Todo hacker do bem começa aqui. Releia o conteúdo completo sobre autenticação biométrica e tente novamente." },
];

function getLevel(score) {
  return LEVELS.find(l => score >= l.min);
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
      <div style={{ fontSize: 64, marginBottom: 16 }}>🧬</div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "#00E676", fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>HACKERS DO BEM — MÓDULO 04</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2, fontFamily: "'DM Sans', sans-serif" }}>
        Missão: Proteja a<br /><span style={{ color: "#40C4FF" }}>BioSec com Biometria</span>
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, margin: "12px 0 32px", lineHeight: 1.6 }}>
        Domine impressão digital, reconhecimento facial, biometria comportamental e métricas como FRR, FAR e CER. Complete as 5 etapas!
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
        Prof. Alexsander Farias · Aula 04 · Autenticação por Biometria
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
        <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: 14 }}>Hackers do Bem — Módulo 04, Aula 04</p>
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
        Prof. Alexsander Farias · Hackers do Bem · 11/03/2026
      </p>
    </div>
  );
}

export default function AtividadeHackersDoBemM4A04() {
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
        module: "M04A04"
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
