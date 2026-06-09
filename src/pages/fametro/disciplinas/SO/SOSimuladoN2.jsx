import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  BookOpen, Trophy, Clock, CheckCircle, XCircle, Send, 
  FileText, ChevronLeft, ChevronRight, GraduationCap, 
  ArrowLeft, Copy, Check, Printer, AlertTriangle 
} from "lucide-react";

import { QUESTIONS_A, QUESTIONS_B, STUDY_CASE_A, STUDY_CASE_B } from "../../../../data/soSimuladoData";

// ─── STYLING SYSTEM ──────────────────────────────────────────────────────────
const theme = {
  bg: "#070B14",
  surface: "#0F172A",
  surfaceLight: "rgba(30, 41, 59, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  borderActive: "#0EA5E9", // Azul-celeste/ciano para combinar com o tema de SO no Hub
  accent: "#0EA5E9",
  accentGlow: "rgba(14, 165, 233, 0.15)",
  text: "#CBD5E1",
  textMuted: "#94A3B8",
  white: "#FFFFFF",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.1)",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.1)"
};

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function renderQuestionText(text) {
  return text.split('\n\n').map((para, paraIdx) => {
    const isContext = para.startsWith("**Contexto Profissional:**") || para.startsWith("Contexto Profissional:");
    const isProblem = para.startsWith("**O Problema:**") || para.startsWith("O Problema:");
    const isQuestion = para.startsWith("**Questão:**") || para.startsWith("Questão:");

    let content = para;
    let title = "";
    let borderLeft = "";
    let background = "";
    let borderColor = "";

    if (isContext) {
      content = para.replace(/^\*\*Contexto Profissional:\*\*\s*/, "").replace(/^Contexto Profissional:\s*/, "");
      title = "CONTEXTO PROFISSIONAL";
      borderLeft = `4px solid ${theme.accent}`;
      background = "rgba(14, 165, 233, 0.02)";
      borderColor = "rgba(14, 165, 233, 0.1)";
    } else if (isProblem) {
      content = para.replace(/^\*\*O Problema:\*\*\s*/, "").replace(/^O Problema:\s*/, "");
      title = "O DESAFIO TÉCNICO";
      borderLeft = "4px solid #FBBF24";
      background = "rgba(251, 191, 36, 0.02)";
      borderColor = "rgba(251, 191, 36, 0.1)";
    } else if (isQuestion) {
      content = para.replace(/^\*\*Questão:\*\*\s*/, "").replace(/^Questão:\s*/, "");
      title = "ENUNCIADO DA QUESTÃO";
      borderLeft = "4px solid #10B981";
      background = "rgba(16, 185, 129, 0.02)";
      borderColor = "rgba(16, 185, 129, 0.1)";
    }

    if (isContext || isProblem || isQuestion) {
      return (
        <div 
          key={paraIdx} 
          style={{
            borderLeft,
            backgroundColor: background,
            borderTop: `1px solid ${borderColor}`,
            borderRight: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
            textAlign: "left"
          }}
        >
          <div style={{
            fontSize: "0.7rem",
            fontWeight: 900,
            letterSpacing: "1.5px",
            color: isContext ? theme.accent : isProblem ? "#FBBF24" : "#10B981",
            marginBottom: "0.5rem"
          }}>
            {title}
          </div>
          <p style={{
            fontSize: "0.95rem",
            color: isQuestion ? theme.white : theme.text,
            lineHeight: "1.6",
            margin: 0,
            fontWeight: isQuestion ? 600 : 400
          }}
          dangerouslySetInnerHTML={{
            __html: content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          }}
          />
        </div>
      );
    }

    return (
      <p key={paraIdx} style={{
        fontSize: "0.95rem",
        color: theme.text,
        lineHeight: "1.6",
        margin: "0 0 1rem",
        textAlign: "left"
      }}
      dangerouslySetInnerHTML={{
        __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      }}
      />
    );
  });
}

// ─── WELCOME SUB-COMPONENT ───────────────────────────────────────────────────
function Welcome({ name, setName, model, setModel, onStart }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim(), model);
    }
  };

  return (
    <div className="simulado-welcome-card" style={{
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "24px",
      padding: "2.5rem 1.5rem",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.005) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.005) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          width: "70px",
          height: "70px",
          backgroundColor: theme.accentGlow,
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          border: `1px solid ${theme.borderActive}`
        }}>
          <GraduationCap size={38} color={theme.accent} />
        </div>

        <div style={{ 
          fontSize: "0.75rem", 
          letterSpacing: "4px", 
          color: theme.accent, 
          fontWeight: 900, 
          marginBottom: "0.5rem" 
        }}>
          AVALIAÇÃO INSTITUCIONAL N2
        </div>

        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: 900,
          color: theme.white,
          margin: "0 0 1rem",
          lineHeight: 1.2
        }}>
          Simulado Acadêmico · Sistemas Operacionais
        </h1>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          maxWidth: "600px",
          margin: "0 auto 2rem",
          fontSize: "0.9rem",
          color: theme.textMuted,
          lineHeight: 1.5
        }}>
          <div><strong>Curso:</strong> Análise e Desenvolvimento de Sistemas</div>
          <div><strong>Disciplina:</strong> Sistemas Operacionais</div>
          <div><strong>Professor:</strong> Alexsander Farias</div>
          <p style={{ marginTop: "0.75rem" }}>
            Seja bem-vindo ao simulado N2. Teste seus conhecimentos sobre algoritmos de substituição de páginas, gerência de Entrada e Saída (I/O), arquitetura de DMA, tabelas de alocação de arquivos (FAT), paginação, TLB, page faults e mapas de bits (bitmap).
          </p>
        </div>

        {/* Info Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "10px",
          maxWidth: "600px",
          margin: "0 auto 2.5rem"
        }}>
          {[
            { label: "Múltipla Escolha", val: "8 questões (0,75 cada)" },
            { label: "Discursiva", val: "1 questão (4,0 pontos)" },
            { label: "Pontuação Total", val: "10,0 pontos" },
            { label: "Cronômetro", val: "Tempo Real" }
          ].map(item => (
            <div key={item.label} style={{
              background: theme.surfaceLight,
              padding: "0.85rem",
              borderRadius: "14px",
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginBottom: "2px" }}>{item.label}</div>
              <div style={{ fontSize: "0.9rem", color: theme.white, fontWeight: 700 }}>{item.val}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "440px", margin: "0 auto", textAlign: "left" }}>
          
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: theme.white, fontWeight: 600, marginBottom: "6px" }}>
              Nome Completo do Aluno
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite seu nome para o ranking..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: `1.5px solid ${theme.border}`,
                background: "rgba(255,255,255,0.03)",
                color: theme.white,
                outline: "none",
                boxSizing: "border-box",
                fontSize: "0.95rem"
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: theme.white, fontWeight: 600, marginBottom: "8px" }}>
              Selecione o Modelo de Prova
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["A", "B"].map(m => {
                const isSelected = model === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border: `1.5px solid ${isSelected ? theme.borderActive : theme.border}`,
                      backgroundColor: isSelected ? theme.accentGlow : "transparent",
                      color: isSelected ? theme.white : theme.textMuted,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Modelo {m === "A" ? "A (Original)" : "B (Simulado)"}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "14px",
              border: "none",
              background: theme.accent,
              color: theme.white,
              fontWeight: 800,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: `0 8px 20px ${theme.accent}40`,
              transition: "transform 0.2s, filter 0.2s"
            }}
            onMouseEnter={e => e.target.style.filter = "brightness(1.15)"}
            onMouseLeave={e => e.target.style.filter = "none"}
          >
            Iniciar Simulado ({model}) →
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SOSimuladoN2() {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Exam, 2: Final Report
  const [name, setName] = useState("");
  const [model, setModel] = useState("A");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0); // 0-7: Objectives, 8: Discursive
  const [answers, setAnswers] = useState({}); // { [questionId]: "A" | "B" | ... }
  const [discursiveAnswer, setDiscursiveAnswer] = useState("");
  const [discursiveCriteria, setDiscursiveCriteria] = useState({
    A: null,
    B: null,
    C: null,
    D: null
  });
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showCriteria, setShowCriteria] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved", "error"
  const [copied, setCopied] = useState(false);

  const timerRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(discursiveAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateTextareaLines = () => {
    if (!discursiveAnswer) return 0;
    return discursiveAnswer.split("\n").filter(Boolean).length;
  };

  const questions = model === "A" ? QUESTIONS_A : QUESTIONS_B;
  const studyCase = model === "A" ? STUDY_CASE_A : STUDY_CASE_B;
  const totalQuestions = questions.length; // 8

  // Timer Control
  useEffect(() => {
    if (step === 1) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, activeQuestionIdx]);

  const handleStartExam = (pName, selectedModel) => {
    setName(pName);
    setModel(selectedModel);
    setStep(1);
    setSecondsElapsed(0);
  };

  const handleSelectOption = (qId, optionChar) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optionChar
    }));
  };

  // Grade calculation
  const correctCount = questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
  
  // Multiple choice value: 0.75 points each (Total 6.0)
  const objectiveScoreReal = correctCount * 0.75;
  // Score to register in ranking out of 100
  const scoreTotalRanking = correctCount * 12.5;

  // Discursive score calculated dynamically
  const discursiveScore = Object.values(discursiveCriteria).reduce((acc, val) => acc + (val || 0), 0);

  const handleFinishExam = async () => {
    const unansweredCount = questions.filter(q => !answers[q.id]).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(`Você possui ${unansweredCount} questões objetivas sem resposta. Deseja finalizar assim mesmo?`);
      if (!confirmSubmit) return;
    } else if (!discursiveAnswer.trim()) {
      const confirmSubmit = window.confirm("Sua resposta discursiva está em branco. Deseja finalizar o simulado mesmo assim?");
      if (!confirmSubmit) return;
    } else if (Object.values(discursiveCriteria).some(val => val === null)) {
      alert("Por favor, preencha todos os 4 critérios da autoavaliação discursiva antes de finalizar.");
      return;
    } else {
      const confirmSubmit = window.confirm("Deseja realmente finalizar e entregar o simulado?");
      if (!confirmSubmit) return;
    }

    setStep(2);
    setSaveStatus("saving");

    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: name.trim(),
        score: scoreTotalRanking,
        duration: secondsElapsed * 1000,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
        activityId: "so_simulado_n2",
        model: `Modelo ${model}`,
        module: "Sistemas Operacionais",
        course: "Análise e Desenvolvimento de Sistemas",
        professor: "Alexsander Farias",
        period: "2026.1",
        discursiveScore: discursiveScore,
        discursiveCriteria: discursiveCriteria,
        objectiveScoreReal: objectiveScoreReal,
        totalScoreReal: objectiveScoreReal + discursiveScore
      });
      setSaveStatus("saved");
    } catch (e) {
      console.error("Erro ao salvar no Firebase: ", e);
      setSaveStatus("error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', sans-serif",
      padding: "5rem 1.5rem 4rem",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Hub Back Link */}
        {step < 2 && (
          <Link to="/fametro" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: theme.textMuted,
            textDecoration: "none",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.color = theme.white}
          onMouseLeave={(e) => e.target.style.color = theme.textMuted}
          >
            <ArrowLeft size={14} /> Voltar para o Hub
          </Link>
        )}

        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <Welcome 
            name={name} 
            setName={setName} 
            model={model} 
            setModel={setModel} 
            onStart={handleStartExam} 
          />
        )}

        {/* STEP 1: EXAM */}
        {step === 1 && (
          <div className="simulado-grid">
            
            {/* Left Box: Active Question */}
            <div>
              {activeQuestionIdx < totalQuestions ? (
                // Objective Question
                (() => {
                  const q = questions[activeQuestionIdx];
                  const chosenOpt = answers[q.id];
                  return (
                    <div className="simulado-question-card" style={{
                      backgroundColor: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "20px",
                      padding: "2rem",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: theme.accent,
                          backgroundColor: theme.accentGlow,
                          padding: "4px 12px",
                          borderRadius: "20px",
                          border: `1px solid ${theme.borderActive}`
                        }}>
                          {q.theme}
                        </span>
                        <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>
                          Questão {activeQuestionIdx + 1} de {totalQuestions + 1}
                        </span>
                      </div>

                      {/* Formatted Question Stem Paragraphs */}
                      <div style={{ marginBottom: "2rem" }}>
                        {renderQuestionText(q.text)}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {q.options.map(opt => {
                          const optionChar = opt.charAt(0);
                          const isSelected = chosenOpt === optionChar;

                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectOption(q.id, optionChar)}
                              style={{
                                textAlign: "left",
                                padding: "1.1rem 1.4rem",
                                borderRadius: "14px",
                                border: `1.5px solid ${isSelected ? theme.borderActive : theme.border}`,
                                backgroundColor: isSelected ? theme.accentGlow : "transparent",
                                color: isSelected ? theme.white : theme.text,
                                fontSize: "0.95rem",
                                lineHeight: 1.5,
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={e => {
                                if (!isSelected) {
                                  e.target.style.borderColor = "rgba(255,255,255,0.2)";
                                  e.target.style.backgroundColor = "rgba(255,255,255,0.01)";
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isSelected) {
                                  e.target.style.borderColor = theme.border;
                                  e.target.style.backgroundColor = "transparent";
                                }
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Discursive Question
                <div className="simulado-question-card" style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "20px",
                  padding: "2rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#FBBF24",
                      backgroundColor: "rgba(251, 191, 36, 0.1)",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      border: "1px solid rgba(251, 191, 36, 0.2)"
                    }}>
                      Discursiva · Sistemas Operacionais
                    </span>
                    <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>
                      Questão {totalQuestions + 1} de {totalQuestions + 1}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.white, margin: "0 0 1rem" }}>
                    {studyCase.title}
                  </h3>

                  <div style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: theme.textMuted,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                    fontStyle: "italic",
                    margin: "0 0 2rem",
                    textAlign: "left"
                  }}>
                    {studyCase.context}
                  </div>

                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.white, marginBottom: "1rem" }}>
                    ENUNCIADO DA ATIVIDADE E DIRETRIZES:
                  </h4>

                  <div style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: theme.text,
                    paddingLeft: "12px",
                    borderLeft: `3px solid ${theme.accent}`,
                    marginBottom: "2rem",
                    whiteSpace: "pre-line",
                    textAlign: "left"
                  }}>
                    {studyCase.statement}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "0.85rem", color: theme.white, fontWeight: 600 }}>
                        Texto de Resposta do Estudante (mínimo de 30 linhas recomendadas)
                      </label>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        color: calculateTextareaLines() >= 30 ? theme.success : theme.textMuted,
                        fontWeight: 600
                      }}>
                        Linhas: {calculateTextareaLines()} | Palavras: {discursiveAnswer ? discursiveAnswer.trim().split(/\s+/).length : 0}
                      </span>
                    </div>

                    <textarea
                      value={discursiveAnswer}
                      onChange={e => setDiscursiveAnswer(e.target.value)}
                      placeholder="Redija seu parecer técnico-argumentativo fundamentando tecnicamente o diagnóstico e a solução da fragmentação de espaço em disco, a mecânica da hiperpaginação e sua mitigação, a topologia de diretórios em árvore e a aplicação de Listas de Controle de Acesso (ACLs)..."
                      style={{
                        width: "100%",
                        height: "280px",
                        padding: "1.25rem",
                        borderRadius: "14px",
                        border: `1.5px solid ${calculateTextareaLines() >= 30 ? theme.success : theme.border}`,
                        background: "rgba(0, 0, 0, 0.2)",
                        color: theme.white,
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        outline: "none",
                        boxSizing: "border-box",
                        resize: "vertical",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>

                  {calculateTextareaLines() < 30 && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#FBBF24",
                      fontSize: "0.8rem",
                      backgroundColor: "rgba(251, 191, 36, 0.05)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(251, 191, 36, 0.1)"
                    }}>
                      <AlertTriangle size={14} /> Recomendamos que desenvolva melhor a sua argumentação técnica para atingir a meta pedagógica de 30 linhas.
                    </div>
                  )}

                  {/* Show Criteria Toggle Button */}
                  <div style={{ marginTop: "2rem", borderTop: `1px solid ${theme.border}`, paddingTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                    {!showCriteria ? (
                      <button
                        onClick={() => setShowCriteria(true)}
                        disabled={!discursiveAnswer.trim()}
                        style={{
                          background: discursiveAnswer.trim() ? "rgba(251, 191, 36, 0.15)" : "rgba(255,255,255,0.02)",
                          border: `1.5px solid ${discursiveAnswer.trim() ? "#FBBF24" : theme.border}`,
                          color: discursiveAnswer.trim() ? "#FBBF24" : theme.textMuted,
                          padding: "10px 20px",
                          borderRadius: "10px",
                          cursor: discursiveAnswer.trim() ? "pointer" : "not-allowed",
                          fontWeight: 700,
                          fontSize: "0.85rem"
                        }}
                      >
                        Revelar Critérios e Gabarito de Correção
                      </button>
                    ) : (
                      <div style={{
                        width: "100%",
                        background: "rgba(16, 185, 129, 0.03)",
                        border: `1.5px solid ${theme.success}`,
                        padding: "1.5rem",
                        borderRadius: "14px",
                        textAlign: "left",
                        animation: "fadeIn 0.3s ease"
                      }}>
                        <h4 style={{ color: theme.success, margin: "0 0 1rem", fontSize: "0.95rem", fontWeight: 800 }}>
                          ✓ DIRETRIZES E GABARITO OFICIAL DO PROFESSOR:
                        </h4>
                        <div style={{
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                          color: theme.text,
                          whiteSpace: "pre-wrap",
                          marginBottom: "1.5rem"
                        }}>
                          {studyCase.criteria}
                        </div>

                        {/* Painel de Autoavaliação da Discursiva */}
                        <div style={{
                          borderTop: `1px dashed ${theme.success}`,
                          paddingTop: "1.5rem",
                          marginTop: "1.5rem"
                        }}>
                          <h4 style={{ color: "#FBBF24", margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 800 }}>
                            ★ AUTOAVALIAÇÃO INSTRUCIONAL:
                          </h4>
                          <p style={{ fontSize: "0.85rem", color: theme.textMuted, margin: "0 0 1.5rem" }}>
                            Com base nas diretrizes do gabarito acima, avalie sua resposta para cada um dos 4 requisitos técnicos da questão discursiva:
                          </p>

                          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            {[
                              { key: "A", label: "A) Política de Alocação de Espaço em Disco (1,0 ponto)", desc: "Diagnosticou a fragmentação externa na alocação contígua e propôs alocação indexada/inodos para solucionar o espaço ocioso." },
                              { key: "B", label: "B) Gerenciamento de Memória Virtual (1,0 ponto)", desc: "Nomeou o fenômeno da hiperpaginação (thrashing), detalhou a mecânica associada e sugeriu uma mitigação viável por software." },
                              { key: "C", label: "C) Topologia de Diretórios (1,0 ponto)", desc: "Argumentou contra a topologia de diretório plano e explicou as vantagens da estrutura em árvore na organização e busca." },
                              { key: "D", label: "D) Controle de Acesso e Segurança (1,0 ponto)", desc: "Fundamentou a insuficiência das permissões simples no diretório plano e sugeriu a implementação de Listas de Controle de Acesso (ACLs) granulares." }
                            ].map(criterion => {
                              const selectedVal = discursiveCriteria[criterion.key];
                              return (
                                <div key={criterion.key} style={{
                                  background: "rgba(0,0,0,0.2)",
                                  padding: "1rem",
                                  borderRadius: "10px",
                                  border: `1px solid ${selectedVal !== null ? "rgba(251, 191, 36, 0.2)" : theme.border}`
                                }}>
                                  <div style={{ fontSize: "0.85rem", color: theme.white, fontWeight: 700, marginBottom: "2px" }}>
                                    {criterion.label}
                                  </div>
                                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "8px" }}>
                                    {criterion.desc}
                                  </div>
                                  
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    {[
                                      { value: 0.0, label: "Não atendeu (0.0)" },
                                      { value: 0.5, label: "Parcialmente (0.5)" },
                                      { value: 1.0, label: "Totalmente (1.0)" }
                                    ].map(opt => {
                                      const isSelected = selectedVal === opt.value;
                                      let btnBg = "transparent";
                                      let btnBorder = `1px solid ${theme.border}`;
                                      let btnColor = theme.textMuted;

                                      if (isSelected) {
                                        btnColor = theme.white;
                                        if (opt.value === 0.0) {
                                          btnBg = "rgba(239, 68, 68, 0.2)";
                                          btnBorder = "1px solid #EF4444";
                                        } else if (opt.value === 0.5) {
                                          btnBg = "rgba(245, 158, 11, 0.2)";
                                          btnBorder = "1px solid #F59E0B";
                                        } else {
                                          btnBg = "rgba(16, 185, 129, 0.2)";
                                          btnBorder = "1px solid #10B981";
                                        }
                                      }

                                      return (
                                        <button
                                          key={opt.value}
                                          type="button"
                                          onClick={() => setDiscursiveCriteria(prev => ({ ...prev, [criterion.key]: opt.value }))}
                                          style={{
                                            flex: 1,
                                            padding: "6px 10px",
                                            fontSize: "0.75rem",
                                            borderRadius: "6px",
                                            backgroundColor: btnBg,
                                            border: btnBorder,
                                            color: btnColor,
                                            fontWeight: isSelected ? 700 : 400,
                                            cursor: "pointer",
                                            transition: "all 0.15s"
                                          }}
                                        >
                                          {opt.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem"
              }}>
                <button
                  disabled={activeQuestionIdx === 0}
                  onClick={() => {
                    setActiveQuestionIdx(prev => prev - 1);
                    setShowCriteria(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "transparent",
                    border: `1px solid ${activeQuestionIdx === 0 ? "rgba(255,255,255,0.03)" : theme.border}`,
                    color: activeQuestionIdx === 0 ? theme.textMuted : theme.white,
                    padding: "10px 18px",
                    borderRadius: "10px",
                    cursor: activeQuestionIdx === 0 ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "all 0.2s"
                  }}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                  {Array.from({ length: totalQuestions + 1 }).map((_, idx) => {
                    const isCurrent = activeQuestionIdx === idx;
                    const isDiscursive = idx === totalQuestions;
                    const isAnswered = isDiscursive ? discursiveAnswer.trim().length > 0 : !!answers[questions[idx].id];

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveQuestionIdx(idx);
                          setShowCriteria(false);
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: `1.5px solid ${isCurrent ? theme.borderActive : "transparent"}`,
                          backgroundColor: isCurrent ? theme.accentGlow : isAnswered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
                          color: isCurrent ? theme.white : isAnswered ? theme.white : theme.textMuted,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {activeQuestionIdx < totalQuestions ? (
                  <button
                    onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "transparent",
                      border: `1px solid ${theme.border}`,
                      color: theme.white,
                      padding: "10px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      transition: "all 0.2s"
                    }}
                  >
                    Próximo <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: theme.success,
                      border: "none",
                      color: theme.white,
                      padding: "10px 20px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      boxShadow: `0 4px 12px ${theme.success}40`,
                      transition: "transform 0.15s"
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  >
                    Entregar Prova <Send size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Box: Info & Timer */}
            <div className="simulado-sidebar" style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}>
              
              {/* Timer card */}
              <div style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                padding: "1.25rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "4px" }}>
                  <Clock size={12} /> TEMPO DE PROVA
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: theme.white, fontFamily: "monospace" }}>
                  {formatTime(secondsElapsed)}
                </div>
              </div>

              {/* Student Identification card */}
              <div style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                padding: "1.25rem"
              }}>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px" }}>ESTUDANTE</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.white }}>{name}</div>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "6px" }}>PROVA: Modelo {model}</div>
              </div>

              {/* Summary / Progress bar */}
              <div style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                padding: "1.25rem"
              }}>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "8px" }}>PROGRESSO DO SIMULADO</div>
                
                {/* Visual line */}
                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{
                    width: `${((Object.keys(answers).length + (discursiveAnswer.trim() ? 1 : 0)) / (totalQuestions + 1)) * 100}%`,
                    height: "100%",
                    background: theme.accent,
                    transition: "width 0.3s ease"
                  }} />
                </div>

                <div style={{ fontSize: "0.8rem", color: theme.text, display: "flex", justifyContent: "space-between" }}>
                  <span>Questões Objetivas:</span>
                  <strong>{Object.keys(answers).length} / {totalQuestions}</strong>
                </div>
                <div style={{ fontSize: "0.8rem", color: theme.text, display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span>Questão Discursiva:</span>
                  <strong>{discursiveAnswer.trim() ? "Respondida" : "Pendente"}</strong>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: RESULTS REPORT */}
        {step === 2 && (
          <div className="simulado-report-card" style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            boxShadow: "0 15px 40px rgba(0,0,0,0.5)"
          }}>
            <style>{`
              @media print {
                body { background: #fff !important; color: #000 !important; }
                .no-print { display: none !important; }
                .print-box { border: 1px solid #000 !important; background: #fff !important; color: #000 !important; }
              }
            `}</style>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }} className="no-print">
              <span style={{ fontSize: "0.75rem", color: theme.textMuted, display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle size={14} color={theme.success} /> Simulado Finalizado com Sucesso
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handlePrint}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${theme.border}`,
                    color: theme.white,
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  <Printer size={14} /> Imprimir Gabarito
                </button>
                <Link
                  to="/fametro/so/simulado-n2/ranking"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: theme.accent,
                    border: "none",
                    color: theme.white,
                    padding: "8px 16px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    boxShadow: `0 4px 12px ${theme.accent}30`
                  }}
                >
                  <Trophy size={14} /> Ver Ranking Geral
                </Link>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: theme.successBg,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem"
              }}>
                <Trophy size={32} color={theme.success} />
              </div>
              <h2 style={{ fontSize: "1.6rem", color: theme.white, margin: "0 0 4px" }}>
                Folha de Desempenho do Estudante
              </h2>
              <p style={{ color: theme.textMuted, margin: 0, fontSize: "0.9rem" }}>
                {name} · Modelo {model}
              </p>
              <div style={{ fontSize: "0.8rem", color: theme.textMuted, marginTop: "4px" }}>
                Duração da prova: {formatTime(secondsElapsed)} | Realizado em: {new Date().toLocaleString()}
              </div>
            </div>

            {/* Score Cards Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2.5rem"
            }}>
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                padding: "1.25rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px" }}>PONTUAÇÃO OBJETIVA</div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: theme.accent }}>
                  {objectiveScoreReal.toFixed(2)} <span style={{ fontSize: "1rem", color: theme.textMuted }}>/ 6,00</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: theme.text, marginTop: "4px" }}>
                  Acertos: {correctCount} de {totalQuestions} questões
                </div>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                padding: "1.25rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px" }}>PONTUAÇÃO DISCURSIVA</div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FBBF24" }}>
                  {discursiveScore.toFixed(2)} <span style={{ fontSize: "1rem", color: theme.textMuted }}>/ 4,00</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: theme.text, marginTop: "4px" }}>
                  Autoavaliação baseada em critérios
                </div>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                padding: "1.25rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px" }}>NOTA FINAL CONSOLIDADA</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 950, color: theme.success }}>
                  {(objectiveScoreReal + discursiveScore).toFixed(2)} <span style={{ fontSize: "1rem", color: theme.textMuted }}>/ 10,00</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: theme.text, marginTop: "4px" }}>
                  Valor acadêmico de prova real
                </div>
              </div>
            </div>

            {/* Live database saving status */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              padding: "10px",
              background: saveStatus === "saved" ? "rgba(16, 185, 129, 0.05)" : saveStatus === "error" ? "rgba(239, 68, 68, 0.05)" : "transparent",
              border: `1px solid ${saveStatus === "saved" ? "rgba(16, 185, 129, 0.15)" : saveStatus === "error" ? "rgba(239, 68, 68, 0.15)" : "transparent"}`,
              borderRadius: "10px",
              marginBottom: "2.5rem",
              fontSize: "0.85rem"
            }} className="no-print">
              {saveStatus === "saving" && (
                <>
                  <div className="spinner" style={{ width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.2)", borderTop: `2px solid ${theme.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <span style={{ color: theme.textMuted }}>Enviando folha de respostas para o ranking ao vivo...</span>
                </>
              )}
              {saveStatus === "saved" && (
                <span style={{ color: theme.success, fontWeight: 600 }}>✓ Nota sincronizada no Firebase com sucesso!</span>
              )}
              {saveStatus === "error" && (
                <span style={{ color: theme.danger, fontWeight: 600 }}>❌ Erro ao salvar nota no Firebase. Verifique sua conexão.</span>
              )}
            </div>

            {/* Objectives feedback list */}
            <h3 style={{ fontSize: "1.1rem", color: theme.white, borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px", marginBottom: "1.25rem" }}>
              Gabarito Detalhado das Questões Objetivas
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="print-box">
              {questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.answer;
                return (
                  <div key={q.id} style={{
                    background: "rgba(0,0,0,0.15)",
                    border: `1px solid ${isCorrect ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                    borderRadius: "14px",
                    padding: "1.25rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.white }}>
                        {idx + 1}. {q.theme}
                      </span>
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: isCorrect ? theme.success : theme.danger,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: isCorrect ? theme.successBg : theme.dangerBg
                      }}>
                        {isCorrect ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {isCorrect ? "Correto" : "Incorreto"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.9rem", color: theme.text, marginBottom: "8px", lineHeight: "1.5" }} dangerouslySetInnerHTML={{ __html: q.text.split('\n\n')[0] }} />

                    <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", margin: "10px 0", padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                      <div>Sua resposta: <strong style={{ color: isCorrect ? theme.success : theme.danger }}>{answers[q.id] || "Sem resposta"}</strong></div>
                      <div>Gabarito oficial: <strong style={{ color: theme.success }}>{q.answer}</strong></div>
                    </div>

                    <div style={{
                      fontSize: "0.82rem",
                      color: theme.textMuted,
                      background: "rgba(255,255,255,0.01)",
                      borderLeft: `3px solid ${isCorrect ? theme.success : theme.danger}`,
                      padding: "8px 12px",
                      borderRadius: "0 6px 6px 0",
                      lineHeight: "1.4"
                    }}>
                      <strong>Comentário pedagógico:</strong> {q.feedback}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discursive feedback section */}
            <h3 style={{ fontSize: "1.1rem", color: theme.white, borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px", marginTop: "2.5rem", marginBottom: "1.25rem" }}>
              Análise e Autoavaliação Discursiva
            </h3>

            <div style={{
              background: "rgba(0,0,0,0.15)",
              border: `1px solid ${theme.border}`,
              borderRadius: "14px",
              padding: "1.25rem"
            }} className="print-box">
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.white, marginBottom: "8px" }}>
                Gabarito de Autoavaliação · {studyCase.title}
              </div>

              {/* Dynamic Criteria Breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", margin: "1rem 0" }}>
                {[
                  { key: "A", name: "A) Alocação de Espaço", val: discursiveCriteria.A },
                  { key: "B", name: "B) Memória Virtual", val: discursiveCriteria.B },
                  { key: "C", name: "C) Topologia de Diretórios", val: discursiveCriteria.C },
                  { key: "D", name: "D) Controle de Acesso", val: discursiveCriteria.D }
                ].map(crit => (
                  <div key={crit.key} style={{
                    background: "rgba(0,0,0,0.2)",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    padding: "8px 12px"
                  }}>
                    <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>{crit.name}</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FBBF24" }}>
                      {crit.val !== null ? `${crit.val.toFixed(1)} / 1,0` : "— / 1,0"}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>Texto de resposta enviado pelo estudante:</span>
                  <button
                    onClick={handleCopyText}
                    className="no-print"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "transparent",
                      border: "none",
                      color: copied ? theme.success : theme.accent,
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copiado!" : "Copiar Resposta"}
                  </button>
                </div>
                
                <div style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  maxHeight: "300px",
                  overflowY: "auto",
                  textAlign: "left"
                }}>
                  {discursiveAnswer || "(Resposta em branco)"}
                </div>
              </div>

              <div style={{
                marginTop: "1.5rem",
                padding: "12px",
                background: "rgba(16, 185, 129, 0.02)",
                border: `1px solid rgba(16, 185, 129, 0.15)`,
                borderRadius: "8px",
                fontSize: "0.8rem",
                color: theme.text,
                lineHeight: "1.4"
              }}>
                <strong>Critérios oficiais de correção adotados:</strong>
                <div style={{ whiteSpace: "pre-wrap", color: theme.textMuted, marginTop: "6px", fontFamily: "sans-serif" }}>
                  {studyCase.criteria}
                </div>
              </div>
            </div>

            {/* Back button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }} className="no-print">
              <Link
                to="/fametro"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${theme.border}`,
                  color: theme.white,
                  padding: "10px 24px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.05)"}
              >
                Voltar ao Hub de Disciplinas
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
