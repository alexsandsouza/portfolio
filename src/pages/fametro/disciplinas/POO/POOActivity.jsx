import { useState, useEffect, useRef } from "react";
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    id: 1,
    emoji: "🏗️",
    title: "Planta e Construção",
    subtitle: "Diferencie Classes de Objetos",
    color: "#1E3A8A",
    accent: "#3B82F6",
    points: 20,
    time: 180,
    type: "select",
    questions: [
      {
        id: "q1_1", pts: 4,
        text: "É o 'molde' ou 'planta' que define quais atributos e comportamentos um conjunto de elementos terá.",
        options: ["Objeto", "Classe", "Método", "Atributo"],
        answer: "Classe",
        feedback: "A Classe é a definição abstrata (o molde), enquanto o Objeto é a instância real."
      },
      {
        id: "q1_2", pts: 4,
        text: "Representa uma instância específica da classe, ocupando espaço na memória.",
        options: ["Classe", "Método", "Objeto", "Variável"],
        answer: "Objeto",
        feedback: "Um Objeto é a materialização de uma Classe na memória (ex: 'MeuFusca' é um objeto da classe 'Carro')."
      },
      {
        id: "q1_3", pts: 4,
        text: "Define as características ou dados que um objeto armazena.",
        options: ["Método", "Construtor", "Atributo", "Evento"],
        answer: "Atributo",
        feedback: "Atributos são as variáveis internas de um objeto (ex: cor, peso, nome)."
      },
      {
        id: "q1_4", pts: 4,
        text: "Define as ações ou comportamentos que um objeto pode realizar.",
        options: ["Atributo", "Método", "Interface", "Herança"],
        answer: "Método",
        feedback: "Métodos são as funções dentro da classe (ex: acelerar(), latir(), salvar())."
      },
      {
        id: "q1_5", pts: 4,
        text: "Método especial chamado automaticamente no momento em que o objeto é criado.",
        options: ["Destrutor", "Getter", "Setter", "Construtor"],
        answer: "Construtor",
        feedback: "O Construtor inicializa o estado inicial do objeto no 'new'."
      },
    ]
  },
  {
    id: 2,
    emoji: "🔒",
    title: "Cápsula de Segurança",
    subtitle: "Domine os Modificadores de Acesso",
    color: "#312E81",
    accent: "#6366F1",
    points: 20,
    time: 180,
    type: "match",
    questions: [
      {
        id: "q2_1", pts: 5,
        text: "O atributo pode ser acessado por qualquer classe do projeto.",
        options: ["public", "private", "protected", "default"],
        answer: "public",
        feedback: "Public: Visibilidade total. Use com cautela para evitar quebra de encapsulamento."
      },
      {
        id: "q2_2", pts: 5,
        text: "O atributo só é visível dentro da própria classe onde foi declarado.",
        options: ["public", "private", "protected", "static"],
        answer: "private",
        feedback: "Private: Essencial para o encapsulamento. Protege os dados internos da classe."
      },
      {
        id: "q2_3", pts: 5,
        text: "Visível na própria classe e em suas subclasses (herdeiras).",
        options: ["private", "public", "protected", "final"],
        answer: "protected",
        feedback: "Protected: Permite que filhos acessem recursos do pai, mas mantém fechado para o resto."
      },
      {
        id: "q2_4", pts: 5,
        text: "Prática de esconder detalhes internos e expor apenas o necessário via métodos.",
        options: ["Herança", "Polimorfismo", "Abstração", "Encapsulamento"],
        answer: "Encapsulamento",
        feedback: "Encapsular é proteger o estado interno do objeto contra acessos diretos e inválidos."
      },
    ]
  },
  {
    id: 3,
    emoji: "🧬",
    title: "Linhagem de Código",
    subtitle: "Estabeleça relações de Herança",
    color: "#5B21B6",
    accent: "#8B5CF6",
    points: 20,
    time: 180,
    type: "choice",
    questions: [
      {
        id: "q3_1", pts: 5,
        text: "Qual palavra-chave é usada em Java para indicar que uma classe herda de outra?",
        options: ["implements", "extends", "inherits", "super"],
        answer: "extends",
        feedback: "Extends: Uma classe 'estende' as funcionalidades da classe pai."
      },
      {
        id: "q3_2", pts: 5,
        text: "Na relação entre 'Veiculo' e 'Moto', a classe 'Veiculo' é chamada de:",
        options: ["Subclasse", "Interface", "Superclasse / Classe Pai", "Atributo"],
        answer: "Superclasse / Classe Pai",
        feedback: "A Superclasse é a base mais genérica, enquanto a subclasse é mais especializada."
      },
      {
        id: "q3_3", pts: 5,
        text: "A herança permite que uma subclasse aproveite código da superclasse. Isso promove:",
        options: ["Encapsulamento", "Reuso de Código", "Acoplamento Forte", "Polimorfismo Estático"],
        answer: "Reuso de Código",
        feedback: "Evitamos repetição de código comum (ex: se todo Animal respira, definimos respirar() apenas no pai)."
      },
      {
        id: "q3_4", pts: 5,
        text: "Uma classe 'Cachorro' que herda de 'Animal' pode ser referenciada como um 'Animal'?",
        options: ["Sim, devido ao polimorfismo", "Não, elas são tipos incompatíveis", "Apenas se Animal for interface", "Apenas via cast explícito"],
        answer: "Sim, devido ao polimorfismo",
        feedback: "Princípio da Substituição: Onde se espera um pai, pode-se entregar um filho."
      },
    ]
  },
  {
    id: 4,
    emoji: "🎭",
    title: "Múltiplas Formas",
    subtitle: "Identifique casos de Polimorfismo",
    color: "#065F46",
    accent: "#10B981",
    points: 20,
    time: 240,
    type: "polimorfismo",
    questions: [
      {
        id: "q4_1", pts: 5,
        text: "Quando uma subclasse redefine um método que já existe na classe pai (mesma assinatura).",
        options: ["Sobrecarga (Overload)", "Sobreescrita (Override)", "Abstração", "Agregação"],
        answer: "Sobreescrita (Override)",
        feedback: "Override: O filho decide 'como' fazer a ação do pai do seu próprio jeito (ex: Latir vs Miar)."
      },
      {
        id: "q4_2", pts: 5,
        text: "Quando temos vários métodos com o mesmo nome na mesma classe, mas parâmetros diferentes.",
        options: ["Sobrecarga (Overload)", "Sobreescrita (Override)", "Interface", "Recursão"],
        answer: "Sobrecarga (Overload)",
        feedback: "Overload: Diferentes formas de chamar a mesma ação (ex: somar(int a, int b) e somar(double a, double b))."
      },
      {
        id: "q4_3", pts: 5,
        text: "Polimorfismo de Sobreescrita acontece em tempo de:",
        options: ["Compilação", "Execução (Runtime)", "Linkagem", "Design"],
        answer: "Execução (Runtime)",
        feedback: "O Java descobre qual método chamar baseado no objeto real criado em memória durante a execução."
      },
      {
        id: "q4_4", pts: 5,
        text: "Polimorfismo de Sobrecarga acontece em tempo de:",
        options: ["Compilação", "Execução (Runtime)", "Serialização", "Deploy"],
        answer: "Compilação",
        feedback: "O compilador sabe qual versão chamar baseado no número e tipo de argumentos passados."
      },
    ]
  },
  {
    id: 5,
    emoji: "💎",
    title: "Boss Level: Arquiteto POO",
    subtitle: "Abstração e Design Patterns",
    color: "#701A75",
    accent: "#D946EF",
    points: 20,
    time: 300,
    type: "boss",
    scenario: "Você está desenhando um sistema para um Zoológico. Você sabe que todo Animal deve ter um método 'fazerSom()', mas um 'Animal' genérico não faz som sozinho — apenas os bichos específicos (Leão, Pássaro). Além disso, alguns animais podem 'Voar' e outros não.",
    questions: [
      {
        id: "q5_1", pts: 5,
        text: "Como você deve declarar a classe 'Animal' para impedir que alguém crie um 'new Animal()'?",
        type: "single",
        options: ["Classe Public", "Classe Static", "Classe Abstrata", "Classe Final"],
        answer: "Classe Abstrata",
        feedback: "Classes Abstratas não podem ser instanciadas e servem de modelo para subclasses."
      },
      {
        id: "q5_2", pts: 5,
        text: "Para a funcionalidade 'Voar', que nem todo animal tem, qual a melhor abordagem?",
        type: "single",
        options: [
          "Criar o método voar() na classe Animal (pai)",
          "Criar uma Interface 'Voador' e implementar apenas nos animais que voam",
          "Criar uma variável booleana 'consegueVoar'",
          "Fazer todos os animais herdarem de uma classe 'Aves'"
        ],
        answer: "Criar uma Interface 'Voador' e implementar apenas nos animais que voam",
        feedback: "Interfaces definem comportamentos/contratos que podem ser compartilhados por classes de linhagens diferentes."
      },
      {
        id: "q5_3", pts: 5,
        text: "Se você declarar o método 'fazerSom()' como abstrato na classe Animal, o que acontece?",
        type: "single",
        options: [
          "O programa não compila",
          "As subclasses são obrigadas a implementar o método",
          "O método fará um som padrão silenciando o sistema",
          "A classe vira uma Interface automaticamente"
        ],
        answer: "As subclasses são obrigadas a implementar o método",
        feedback: "Métodos Abstratos são contratos: o pai diz 'o que' deve ser feito, o filho é obrigado a dizer 'como'."
      },
      {
        id: "q5_4", pts: 5,
        text: "O conceito de focar apenas no que é essencial para o sistema, ignorando detalhes irrelevantes, denomina-se:",
        type: "single",
        options: ["Encapsulamento", "Polimorfismo", "Abstração", "Acoplamento"],
        answer: "Abstração",
        feedback: "Abstração: Extrair as características principais de um objeto do mundo real para o software."
      },
    ]
  }
];

const LEVELS = [
  { min: 90, label: "ARQUITETO SÊNIOR", title: "Mestre da Orientação a Objetos", color: "#FFD700", bg: "#1E1B4B", msg: "Incrível! Você domina todos os pilares da POO. Seus sistemas são modulares, reutilizáveis e fáceis de manter. A engenharia de software agradece!" },
  { min: 70, label: "DESENVOLVEDOR PLENO", title: "Especialista em Java/C#", color: "#34D399", bg: "#064E3B", msg: "Ótimo trabalho! Você tem conceitos sólidos sobre herança e encapsulamento. Revise polimorfismo dinâmico para chegar ao nível mestre." },
  { min: 50, label: "DESENVOLVEDOR JÚNIOR", title: "Praticante de Clean Code", color: "#60A5FA", bg: "#1E3A8A", msg: "Bom começo! Você já entende a diferença entre classes e objetos. Continue praticando a parte de interfaces e abstração." },
  { min: 30, label: "ESTAGIÁRIO", title: "Entusiasta de Código", color: "#FBBF24", bg: "#78350F", msg: "Continue estudando! POO é uma mudança de paradigma. Releia os pilares e tente focar em como os objetos se comunicam." },
  { min: 0, label: "INICIANTE", title: "Padawan do Java", color: "#F87171", bg: "#7F1D1D", msg: "Não desista! Todo grande programador começou batendo cabeça com as classes. Tente criar pequenos exemplos no papel antes de codar." },
];

function getLevel(score) {
  return LEVELS.find(l => score >= l.min);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

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
    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24, marginTop: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 6, borderRadius: 3,
          background: i < current ? "#10B981" : i === current ? "#3B82F6" : "rgba(255,255,255,0.1)",
          transition: "all 0.4s",
          boxShadow: i < current ? "0 0 10px rgba(16, 185, 129, 0.4)" : "none"
        }} />
      ))}
    </div>
  );
}

function TimerRing({ pct, display, expired }) {
  const r = 28, c = 2 * Math.PI * r;
  const color = pct > 50 ? "#10B981" : pct > 25 ? "#FBBF24" : "#EF4444";
  return (
    <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
      <svg width={64} height={64} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={32} cy={32} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
        <circle cx={32} cy={32} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
      </svg>
      <span style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "monospace", fontSize: 13, fontWeight: 800,
        color: expired ? "#EF4444" : color
      }}>{display}</span>
    </div>
  );
}

// ─── STAGE SCREENS ────────────────────────────────────────────────────────────

function CommonStage({ stage, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const timer = useTimer(stage.time, !submitted);

  function score() {
    return stage.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? q.pts : 0), 0);
  }

  function submit() {
    if (Object.keys(answers).length < stage.questions.length) {
      alert("Por favor, responda todas as questões!");
      return;
    }
    setSubmitted(true);
  }

  const currentScore = score();

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      {!submitted && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TEMA: {stage.title.toUpperCase()}</span>
            <TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {stage.questions.map((q, qi) => {
          const isRight = submitted && answers[q.id] === q.answer;
          const isWrong = submitted && answers[q.id] !== q.answer;
          return (
            <div key={q.id} style={{
              background: submitted ? (isRight ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)") : "rgba(30, 41, 59, 0.5)",
              border: `1px solid ${submitted ? (isRight ? "#10B981" : "#EF4444") : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px", padding: "20px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              <p style={{ margin: "0 0 16px", fontSize: '0.95rem', fontWeight: 600, color: "#fff", lineHeight: 1.5 }}>
                <span style={{ color: stage.accent, marginRight: 8 }}>{qi + 1}.</span> {q.text}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {q.options.map(opt => {
                  const sel = answers[q.id] === opt;
                  const showRight = submitted && opt === q.answer;
                  const showWrong = submitted && sel && opt !== q.answer;
                  
                  let borderColor = "rgba(255,255,255,0.1)";
                  let bgColor = "rgba(255,255,255,0.03)";
                  let textColor = "#94a3b8";

                  if (sel) {
                    borderColor = stage.accent;
                    bgColor = `${stage.accent}20`;
                    textColor = "#fff";
                  }
                  if (showRight) {
                    borderColor = "#10B981";
                    bgColor = "rgba(16, 185, 129, 0.15)";
                    textColor = "#fff";
                  }
                  if (showWrong) {
                    borderColor = "#EF4444";
                    bgColor = "rgba(239, 68, 68, 0.15)";
                    textColor = "#fff";
                  }

                  return (
                    <button key={opt} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: opt }))}
                      style={{
                        padding: "10px 18px", borderRadius: "10px", border: "2px solid",
                        borderColor, backgroundColor: bgColor, color: textColor,
                        fontSize: "0.85rem", fontWeight: 700, cursor: submitted ? "default" : "pointer",
                        transition: "all 0.2s"
                      }}>{opt}</button>
                  );
                })}
              </div>
              {submitted && (
                <div style={{ marginTop: 12, fontSize: "0.8rem", color: isRight ? "#34D399" : "#F87171", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  {isRight ? "✓ " : "✗ "} {q.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 30 }}>
        {!submitted ? (
            <button onClick={submit} className="pulse-btn" style={btnStyle(stage.accent)}>
                Validar Respostas →
            </button>
        ) : (
            <div style={{ textAlign: "center", animation: "slideUp 0.4s ease-out" }}>
                 <div style={{ 
                    padding: "24px", background: "rgba(30, 41, 59, 0.8)", borderRadius: "16px", marginBottom: "16px",
                    border: "1px solid rgba(255,255,255,0.05)" 
                }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Score da Etapa</span>
                    <div style={{ fontSize: "2.5rem", fontWeight: 900, color: currentScore >= stage.points * 0.7 ? "#10B981" : "#FBBF24" }}>
                        {currentScore}<span style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.2)" }}>/{stage.points}</span>
                    </div>
                </div>
                <button onClick={() => onComplete(currentScore)} style={btnStyle("#10B981")}>
                    Continuar Missão →
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

function BossStage({ stage, onComplete }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const timer = useTimer(stage.time, !submitted);
  
    function score() {
      return stage.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? q.pts : 0), 0);
    }
  
    function submit() {
      if (Object.keys(answers).length < stage.questions.length) {
        alert("O Arquiteto precisa de todas as decisões!");
        return;
      }
      setSubmitted(true);
    }
  
    const currentScore = score();
  
    return (
      <div style={{ animation: "fadeIn 0.6s ease-out" }}>
        <div style={{ 
            background: "linear-gradient(135deg, rgba(112, 26, 117, 0.2), rgba(162, 28, 175, 0.1))", 
            border: "1px solid rgba(217, 70, 239, 0.3)", 
            borderRadius: "20px", padding: "24px", marginBottom: "30px", position: "relative"
        }}>
            <div style={{ 
                position: "absolute", top: -15, left: 24, padding: "4px 12px", 
                backgroundColor: "#D946EF", color: "#fff", borderRadius: "8px", 
                fontSize: "0.7rem", fontWeight: 900, letterSpacing: 1
            }}>
                CENÁRIO DE ARQUITETURA
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#F5D0FE", lineHeight: 1.7, fontStyle: "italic" }}>
                "{stage.scenario}"
            </p>
        </div>

        {!submitted && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <TimerRing pct={timer.pct} display={timer.display} expired={timer.expired} />
            </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stage.questions.map((q, qi) => {
                const isSelected = !!answers[q.id];
                const isRight = submitted && answers[q.id] === q.answer;

                return (
                    <div key={q.id} style={{
                        background: submitted ? (isRight ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)") : "rgba(30, 41, 59, 0.5)",
                        border: `1px solid ${submitted ? (isRight ? "#10B981" : "#EF4444") : isSelected ? "rgba(217, 70, 239, 0.4)" : "rgba(255,255,255,0.05)"}`,
                        borderRadius: "16px", padding: "20px"
                    }}>
                        <p style={{ margin: "0 0 16px", fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
                            {qi + 1}. {q.text}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {q.options.map(opt => {
                                const sel = answers[q.id] === opt;
                                const showRight = submitted && opt === q.answer;
                                const showWrong = submitted && sel && opt !== q.answer;

                                return (
                                    <button key={opt} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: opt }))}
                                        style={{
                                            padding: "12px 16px", borderRadius: "12px", border: "1.5px solid",
                                            textAlign: "left", fontSize: "0.85rem", transition: "all 0.2s",
                                            borderColor: showRight ? "#10B981" : showWrong ? "#EF4444" : sel ? "#D946EF" : "rgba(255,255,255,0.1)",
                                            backgroundColor: showRight ? "rgba(16, 185, 129, 0.1)" : showWrong ? "rgba(239, 68, 68, 0.1)" : sel ? "rgba(217, 70, 239, 0.1)" : "transparent",
                                            color: sel || showRight || showWrong ? "#fff" : "#94a3b8",
                                            fontWeight: sel || showRight ? 700 : 500
                                        }}>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                        {submitted && (
                             <div style={{ marginTop: 12, fontSize: "0.8rem", color: isRight ? "#34D399" : "#F87171", fontWeight: 500 }}>
                                {isRight ? "✓ EXCELENTE: " : "✗ CORREÇÃO: "} {q.feedback}
                             </div>
                        )}
                    </div>
                );
            })}
        </div>
  
        <div style={{ marginTop: 30 }}>
          {!submitted ? (
              <button onClick={submit} style={btnStyle(stage.accent)}>Finalizar Consultoria Técnica 🏁</button>
          ) : (
              <div style={{ textAlign: "center" }}>
                  <button onClick={() => onComplete(currentScore)} style={btnStyle("#10B981")}>Ver Veredito Final 🎓</button>
              </div>
          )}
        </div>
      </div>
    );
}

function btnStyle(bg) {
  return {
    width: "100%", padding: "16px", borderRadius: "14px", border: "none",
    background: bg, color: "#fff", fontSize: "1rem", fontWeight: 800, cursor: "pointer",
    boxShadow: `0 8px 24px ${bg}40`, transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    textTransform: "uppercase", letterSpacing: 1
  };
}

// ─── MAIN SCREENS ────────────────────────────────────────────────────────────

function Welcome({ onStart }) {
  const [name, setName] = useState("");
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "60px 20px" }}>
      <div style={{ width: 100, height: 100, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <span style={{ fontSize: 50 }}>💎</span>
      </div>
      <div style={{ fontSize: 12, letterSpacing: 5, color: "#3B82F6", fontWeight: 900, marginBottom: 12 }}>POO · DESAFIO DOS PILARES</div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
        Domine a <span style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Programação Orientada a Objetos</span>
      </h1>
      <p style={{ color: "#94a3b8", fontSize: "1.05rem", margin: "0 0 40px", lineHeight: 1.6 }}>
        Enfrente 5 níveis de desafios técnicos. Prove que você entende de classes, herança e polimorfismo para se tornar um Arquiteto de Software.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 30, marginBottom: 40, flexWrap: "wrap" }}>
        {[["⏱", "15 min"], ["🧩", "5 Estágios"], ["💯", "100 pts"]].map(([ic, lb]) => (
          <div key={lb} style={{ display: "center", background: "rgba(255,255,255,0.03)", padding: "12px 20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 24, marginRight: 8 }}>{ic}</span>
            <span style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>{lb}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: 20 }}>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Seu nome completo..."
            style={{
              width: "100%", padding: "18px 24px", borderRadius: "16px",
              border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              color: "#fff", fontSize: "1rem", outline: "none", boxSizing: "border-box",
              transition: "all 0.3s"
            }}
          />
      </div>

      <button onClick={() => name.trim() && onStart(name.trim())}
        disabled={!name.trim()}
        className="main-start-btn"
        style={{
          ...btnStyle("#3B82F6"),
          opacity: name.trim() ? 1 : 0.4,
          cursor: name.trim() ? "pointer" : "not-allowed"
        }}>
        Iniciar Desafio →
      </button>

      <div style={{ marginTop: 40, fontSize: "0.8rem", color: "#64748b" }}>
        <strong>Sistemas de Informação</strong> · FAMETRO · Prof. Alexsander Farias
      </div>
    </div>
  );
}

function FinalResult({ name, scores }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const level = getLevel(total);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontSize: 70, marginBottom: 10 }}>🎓</div>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>Parabéns, {name.split(' ')[0]}!</h2>
        <p style={{ color: "#94a3b8", margin: 0 }}>Você concluiu a trilha de Lógica Orientada a Objetos.</p>
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${level.bg}, rgba(15, 23, 42, 0.9))`,
        border: `2px solid ${level.color}44`,
        borderRadius: "24px", padding: "40px 30px", marginBottom: 30, textAlign: "center",
        boxShadow: `0 20px 40px rgba(0,0,0,0.4)`
      }}>
        <div style={{ fontSize: "0.8rem", letterSpacing: 4, color: level.color, fontWeight: 900, marginBottom: 15 }}>RANKING ALCANÇADO</div>
        <div style={{ fontSize: "5rem", fontWeight: 900, color: "#fff", fontFamily: "monospace", lineHeight: 1 }}>{total}</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.2rem", marginBottom: 25 }}>PONTOS</div>
        
        <div style={{ 
            display: "inline-block", background: level.color, color: "#000", 
            padding: "8px 24px", borderRadius: "12px", fontWeight: 900, 
            fontSize: "1rem", letterSpacing: 1, marginBottom: 12 
        }}>
          {level.label}
        </div>
        <h3 style={{ color: "#fff", fontSize: "1.4rem", margin: 0 }}>{level.title}</h3>
      </div>

      <div style={{ background: "rgba(30, 41, 59, 0.5)", borderRadius: "20px", padding: "24px", marginBottom: 30, border: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ margin: "0 0 20px", fontSize: "0.8rem", color: "#64748b", letterSpacing: 2 }}>BREAKDOWN DOS PILARES</h4>
        {STAGES.map((stage, i) => {
          const sc = scores[i] || 0;
          const pct = (sc / stage.points) * 100;
          return (
            <div key={stage.id} style={{ marginBottom: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 600 }}>{stage.emoji} {stage.title}</span>
                <span style={{ fontSize: "0.9rem", color: pct >= 70 ? "#10B981" : "#94a3b8", fontWeight: 700 }}>{sc}/{stage.points}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: stage.accent, borderRadius: 3, transition: "width 1s ease-out" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: `${level.color}11`, border: `1px solid ${level.color}33`,
        borderRadius: "16px", padding: "24px", textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontSize: "1rem", color: "#fff", lineHeight: 1.6 }}>
           "{level.msg}"
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={() => window.location.reload()} style={{ background: 'transparent', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>
              Tentar novamente
          </button>
      </div>
    </div>
  );
}

export default function POOActivity() {
  const [step, setStep] = useState(0); // 0: Welcome, 1..5: Stages, 6: Result
  const [name, setName] = useState("");
  const [scores, setScores] = useState([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  function handleStart(n) {
    setName(n);
    setStep(1);
  }

  async function handleComplete(s) {
    const newScores = [...scores, s];
    setScores(newScores);
    
    if (step === 5) {
      // Final step, save to ranking
      const total = newScores.reduce((a, b) => a + b, 0);
      try {
        await addDoc(collection(db, "fametro_ranking"), {
          name,
          score: total,
          duration: Date.now() - startTime,
          timestamp: Date.now(),
          serverTimestamp: serverTimestamp(),
          activityId: "poo_pilares",
          module: "POO",
          course: "Sistemas de Informação",
          professor: "Alexsander Farias"
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    
    setStep(prev => prev + 1);
  }

  const currentStage = STAGES[step - 1];

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#0f172a", color: "#cbd5e1",
      padding: "6rem 1.5rem 4rem", fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {step === 0 && <Welcome onStart={handleStart} />}
        
        {step >= 1 && step <= 5 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 16px', borderRadius: '20px', color: '#3B82F6', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    POO · QUEST {step} DE 5
                </div>
                <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", margin: "10px 0 4px" }}>
                    {currentStage.emoji} {currentStage.title}
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "1rem" }}>{currentStage.subtitle}</p>
                <ProgressBar current={step} total={5} />
            </div>

            {step === 5 
              ? <BossStage key={step} stage={currentStage} onComplete={handleComplete} />
              : <CommonStage key={step} stage={currentStage} onComplete={handleComplete} />
            }
          </div>
        )}

        {step === 6 && <FinalResult name={name} scores={scores} />}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .pulse-btn:hover { transform: scale(1.02); filter: brightness(1.1); }
        .main-start-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4); }
      `}</style>
    </div>
  );
}
