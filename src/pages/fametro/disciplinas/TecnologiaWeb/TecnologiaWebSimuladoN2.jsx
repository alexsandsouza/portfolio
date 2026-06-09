import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  BookOpen, Trophy, Clock, CheckCircle, XCircle, Send, 
  FileText, ChevronLeft, ChevronRight, GraduationCap, 
  ArrowLeft, Copy, Check, Printer, AlertTriangle 
} from "lucide-react";

import { QUESTIONS_A, QUESTIONS_B, STUDY_CASE_A, STUDY_CASE_B } from "../../../../data/tecnologiaWebSimuladoData";

// ─── STYLING SYSTEM ──────────────────────────────────────────────────────────
const theme = {
  bg: "#070B14",
  surface: "#0F172A",
  surfaceLight: "rgba(30, 41, 59, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  borderActive: "#EC4899", // Rosa-choque para combinar com o tema de Tecnologia Web no Hub
  accent: "#EC4899",
  accentGlow: "rgba(236, 72, 153, 0.15)",
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
      background = "rgba(236, 72, 153, 0.02)";
      borderColor = "rgba(236, 72, 153, 0.1)";
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
          Simulado Acadêmico · Tecnologia Web I
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
          <div><strong>Curso:</strong> Sistemas de Informação (5º Período)</div>
          <div><strong>Disciplina:</strong> Tecnologia Web I</div>
          <div><strong>Professor:</strong> Alexsander Farias</div>
          <p style={{ marginTop: "0.75rem" }}>
            Seja bem-vindo ao simulado N2. Teste seus conhecimentos em Spring Boot, persistência com Spring Data JPA/Hibernate, templates Thymeleaf, mapeamento ORM e integridade relacional.
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
export default function TecnologiaWebSimuladoN2() {
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
        activityId: "tecnologia_web_simulado_n2",
        model: `Modelo ${model}`,
        module: "Tecnologia Web I",
        course: "Sistemas de Informação",
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
                      Discursiva · Tecnologia Web
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
                      placeholder="Redija sua análise dissertativa-argumentativa fundamentando tecnicamente as escolhas de persistência com Spring Data JPA vs JDBC/DAO, resolvendo a impedância de dados, detalhando mapeamento de associações e as técnicas de otimização de performance..."
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
                              { key: "A", label: "A) Justificativa Tecnológica (1,0 ponto)", desc: "Justificou a escolha do Spring Data JPA sobre JDBC puro/DAO considerando produtividade e manutenibilidade." },
                              { key: "B", label: "B) Resolução de Impedância ORM (1,0 ponto)", desc: "Explicou o problema de impedância de mapeamento objeto-relacional e o papel das anotações básicas de entidade." },
                              { key: "C", label: "C) Mapeamentos de Relacionamentos (1,0 ponto)", desc: "Descreveu o mapeamento de tabelas físicas (@Column) e mapeamentos de associações 1-para-N/N-para-1 com exemplo prático." },
                              { key: "D", label: "D) Limites e Otimização de Performance (1,0 ponto)", desc: "Avaliou riscos de performance (consulta N+1) e propôs soluções no JPA (carregamento Lazy, JOIN FETCH ou DTOs)." }
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

                          <div style={{ 
                            marginTop: "1.25rem", 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            background: "rgba(251, 191, 36, 0.05)",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "1px solid rgba(251, 191, 36, 0.2)"
                          }}>
                            <span style={{ fontSize: "0.85rem", color: theme.white, fontWeight: 700 }}>
                              Nota da Discursiva Computada:
                            </span>
                            <span style={{ fontSize: "1.1rem", color: "#FBBF24", fontWeight: 900 }}>
                              {discursiveScore.toFixed(2)} / 4.0
                            </span>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Navigation Bar */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem"
              }}>
                <button
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx(idx => idx - 1)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${theme.border}`,
                    color: activeQuestionIdx === 0 ? "rgba(255,255,255,0.2)" : theme.white,
                    padding: "12px 24px",
                    borderRadius: "12px",
                    cursor: activeQuestionIdx === 0 ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => { if (activeQuestionIdx !== 0) e.target.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { if (activeQuestionIdx !== 0) e.target.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  <ChevronLeft size={18} /> Anterior
                </button>

                {activeQuestionIdx < totalQuestions ? (
                  <button
                    onClick={() => setActiveQuestionIdx(idx => idx + 1)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: theme.accent,
                      border: "none",
                      color: theme.white,
                      padding: "12px 24px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxShadow: `0 4px 12px ${theme.accent}20`
                    }}
                  >
                    Próxima <ChevronRight size={18} />
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <button
                      onClick={handleFinishExam}
                      disabled={!showCriteria || Object.values(discursiveCriteria).some(val => val === null)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: (showCriteria && !Object.values(discursiveCriteria).some(val => val === null)) ? theme.success : "rgba(255,255,255,0.02)",
                        border: "none",
                        color: (showCriteria && !Object.values(discursiveCriteria).some(val => val === null)) ? theme.white : theme.textMuted,
                        padding: "12px 28px",
                        borderRadius: "12px",
                        cursor: (showCriteria && !Object.values(discursiveCriteria).some(val => val === null)) ? "pointer" : "not-allowed",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        boxShadow: (showCriteria && !Object.values(discursiveCriteria).some(val => val === null)) ? `0 4px 15px ${theme.success}30` : "none"
                      }}
                    >
                      Finalizar Simulado <Send size={16} />
                    </button>
                    {activeQuestionIdx === totalQuestions && showCriteria && Object.values(discursiveCriteria).some(val => val === null) && (
                      <span style={{ fontSize: "0.75rem", color: "#FBBF24", marginTop: "6px", fontWeight: 600 }}>
                        * Preencha os 4 critérios da autoavaliação discursiva.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Box: Navigator & Time */}
            <div className="simulado-sidebar">
              
              {/* Timer Widget */}
              <div className="simulado-timer-card" style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "1.25rem",
                textAlign: "center",
                marginBottom: "1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  color: theme.textMuted,
                  marginBottom: "4px"
                }}>
                  <Clock size={14} /> TEMPO DECORRIDO
                </div>
                <div style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: theme.white,
                  fontFamily: "monospace"
                }}>
                  {formatTime(secondsElapsed)}
                </div>
              </div>

              {/* Navigator Panel */}
              <div className="simulado-nav-card" style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <h3 style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: theme.white,
                  marginTop: 0,
                  marginBottom: "1rem",
                  borderBottom: `1px solid ${theme.border}`,
                  paddingBottom: "8px"
                }}>
                  Navegação (Modelo {model})
                </h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginBottom: "1.25rem"
                }}>
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isActive = activeQuestionIdx === idx;
                    
                    let bg = "rgba(255,255,255,0.02)";
                    let color = theme.textMuted;
                    let border = `1px solid ${theme.border}`;

                    if (isAnswered) {
                      border = `1px solid ${theme.borderActive}`;
                      color = theme.accent;
                      bg = "rgba(236, 72, 153, 0.05)";
                    }
                    if (isActive) {
                      bg = theme.accent;
                      color = theme.white;
                      border = `1px solid ${theme.accent}`;
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIdx(idx)}
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "10px",
                          border,
                          backgroundColor: bg,
                          color,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.1s"
                        }}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveQuestionIdx(totalQuestions)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: activeQuestionIdx === totalQuestions 
                      ? "1px solid #FBBF24"
                      : discursiveAnswer.trim()
                        ? "1px solid rgba(251, 191, 36, 0.4)"
                        : `1px solid ${theme.border}`,
                    backgroundColor: activeQuestionIdx === totalQuestions
                      ? "#FBBF24"
                      : discursiveAnswer.trim()
                        ? "rgba(251, 191, 36, 0.05)"
                        : "rgba(255,255,255,0.02)",
                    color: activeQuestionIdx === totalQuestions
                      ? "#000000"
                      : discursiveAnswer.trim()
                        ? "#FBBF24"
                        : theme.text,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Questão Discursiva
                </button>

                {/* Info List */}
                <div style={{
                  marginTop: "1.5rem",
                  fontSize: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  color: theme.textMuted
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.textMuted }} /> Não respondido
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.accent }} /> Respondido
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FBBF24" }} /> Discursiva
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* STEP 2: RESULTS REPORT */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            
            <div className="simulado-report-card" style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "24px",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              marginBottom: "2rem"
            }}>
              <div style={{ fontSize: "50px", marginBottom: "0.5rem" }}>🎓</div>
              
              <h2 style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                color: theme.white,
                margin: "0 0 6px"
              }}>
                Simulado Concluído!
              </h2>
              
              <p style={{ color: theme.textMuted, fontSize: "0.95rem", margin: "0 0 2rem" }}>
                Parabéns, <strong>{name}</strong>. Sua nota foi processada e enviada para o ranking do <strong>Modelo {model}</strong>.
              </p>

              {/* Stats Box */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
                maxWidth: "800px",
                margin: "0 auto 2rem"
              }}>
                {[
                  { 
                    label: "Nota das Objetivas", 
                    val: `${objectiveScoreReal.toFixed(2)} / 6.0`, 
                    color: theme.accent 
                  },
                  { 
                    label: "Nota da Discursiva (Autoavaliada)", 
                    val: `${discursiveScore.toFixed(2)} / 4.0`, 
                    color: "#FBBF24" 
                  },
                  { 
                    label: "Nota Final Consolidada", 
                    val: `${(objectiveScoreReal + discursiveScore).toFixed(2)} / 10.0`, 
                    color: (objectiveScoreReal + discursiveScore) >= 6.0 ? theme.success : theme.danger 
                  },
                  { 
                    label: "Acertos Objetivos", 
                    val: `${correctCount} / ${totalQuestions}`, 
                    color: theme.success 
                  }
                ].map(item => (
                  <div key={item.label} style={{
                    background: "rgba(0, 0, 0, 0.15)",
                    border: `1px solid ${theme.border}`,
                    padding: "1.25rem",
                    borderRadius: "16px"
                  }}>
                    <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ fontSize: "1.4rem", color: item.color, fontWeight: 900 }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Registry feedback */}
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {saveStatus === "saving" && (
                  <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>Sincronizando resultado com o servidor...</div>
                )}
                {saveStatus === "saved" && (
                  <div style={{ fontSize: "0.8rem", color: theme.success }}>✓ Pontuação registrada e integrada ao ranking de Tecnologia Web.</div>
                )}
                {saveStatus === "error" && (
                  <div style={{ fontSize: "0.8rem", color: theme.danger }}>⚠️ Falha de conexão. Imprima seu relatório para validação do professor.</div>
                )}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={handlePrint}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: `1px solid ${theme.border}`,
                    color: theme.white,
                    padding: "12px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.target.style.backgroundColor = "rgba(255,255,255,0.05)"}
                >
                  <Printer size={16} /> Imprimir Comprovante
                </button>

                <Link
                  to="/fametro/tecnologia-web/simulado-n2/ranking"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: theme.accent,
                    color: theme.white,
                    padding: "12px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 750,
                    textDecoration: "none",
                    boxShadow: `0 4px 12px ${theme.accent}20`
                  }}
                >
                  <Trophy size={16} /> Ver Placar ao Vivo
                </Link>
              </div>
            </div>

            {/* Discursive card proof */}
            <div className="simulado-correction-card" style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.white, margin: 0 }}>
                  Resposta Discursiva Enviada (Modelo {model})
                </h3>
                <button
                  onClick={handleCopyText}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: copied ? theme.successBg : "rgba(255,255,255,0.05)",
                    border: `1px solid ${copied ? theme.success : theme.border}`,
                    color: copied ? theme.success : theme.white,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 600
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado!" : "Copiar Resposta"}
                </button>
              </div>

              <div style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "1.25rem",
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                color: theme.text,
                fontSize: "0.9rem",
                lineHeight: 1.6,
                maxHeight: "220px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                textAlign: "left"
              }}>
                {discursiveAnswer || "(Nenhum rascunho textual foi digitado para a discursiva)."}
              </div>
            </div>

            {/* commented feedback */}
            <div className="simulado-correction-card" style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: theme.white,
                marginTop: 0,
                marginBottom: "2rem",
                borderBottom: `1px solid ${theme.border}`,
                paddingBottom: "10px",
                textAlign: "left"
              }}>
                Correção Detalhada das Questões (Modelo {model})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {questions.map((q, idx) => {
                  const userAns = answers[q.id];
                  const isRight = userAns === q.answer;

                  return (
                    <div 
                      key={q.id} 
                      className="simulado-correction-item"
                      style={{
                        padding: "1.5rem",
                        borderRadius: "16px",
                        border: `1.5px solid ${isRight ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                        backgroundColor: isRight ? "rgba(16, 185, 129, 0.01)" : "rgba(239, 68, 68, 0.01)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.white }}>
                          Questão {idx + 1} · {q.theme}
                        </span>
                        
                        <div>
                          {isRight ? (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: theme.success,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: theme.successBg,
                              padding: "4px 8px",
                              borderRadius: "6px"
                            }}>
                              <CheckCircle size={12} /> Correta (+0.75)
                            </span>
                          ) : (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: theme.danger,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: theme.dangerBg,
                              padding: "4px 8px",
                              borderRadius: "6px"
                            }}>
                              <XCircle size={12} /> Incorreta (+0.00)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enunciado formatado na tela de gabarito */}
                      <div style={{ marginBottom: "1.5rem" }}>
                        {renderQuestionText(q.text)}
                      </div>

                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        fontSize: "0.85rem",
                        marginBottom: "1.25rem",
                        color: theme.textMuted
                      }}>
                        <div>
                          <strong>Sua Resposta:</strong>{" "}
                          <span style={{ color: isRight ? theme.success : theme.danger, fontWeight: 700 }}>
                            {userAns ? `${userAns})` : "Sem Resposta"}
                          </span>
                        </div>
                        {!isRight && (
                          <div>
                            <strong>Gabarito Oficial:</strong>{" "}
                            <span style={{ color: theme.success, fontWeight: 700 }}>
                              {q.answer})
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        backgroundColor: "rgba(255,255,255,0.01)",
                        padding: "1rem",
                        borderRadius: "10px",
                        border: `1px solid ${theme.border}`,
                        color: theme.text
                      }}>
                        <strong style={{ color: theme.white, display: "block", marginBottom: "4px" }}>Explicação Pedagógica:</strong>
                        {q.feedback}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Retry link */}
              <div style={{ marginTop: "3rem", textAlign: "center" }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: theme.textMuted,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Realizar outro modelo de simulado
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
      
      {/* Responsive Grid Styles & Print Styles injected locally */}
      <style>{`
        .simulado-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 2rem;
          align-items: start;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .simulado-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .simulado-sidebar {
            order: -1;
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .simulado-sidebar > div {
            flex: 1;
            margin-bottom: 0 !important;
          }
        }

        @media (max-width: 600px) {
          .simulado-sidebar {
            flex-direction: column;
            gap: 0.75rem;
          }
          .simulado-timer-card {
            padding: 0.75rem !important;
          }
          .simulado-timer-card > div:first-child {
            font-size: 0.65rem !important;
          }
          .simulado-timer-card > div:last-child {
            font-size: 1.30rem !important;
          }
          .simulado-nav-card {
            padding: 0.85rem !important;
          }
          .simulado-nav-card h3 {
            margin-bottom: 0.75rem !important;
            font-size: 0.8rem !important;
            padding-bottom: 6px !important;
          }
          .simulado-nav-card button {
            font-size: 0.75rem !important;
            border-radius: 6px !important;
          }
          .simulado-question-card {
            padding: 1.15rem !important;
            border-radius: 16px !important;
          }
          .simulado-welcome-card {
            padding: 1.5rem 1rem !important;
            border-radius: 16px !important;
          }
          .simulado-report-card {
            padding: 1.5rem 1rem !important;
            border-radius: 16px !important;
          }
          .simulado-correction-card {
            padding: 1.15rem !important;
          }
          .simulado-correction-item {
            padding: 1rem !important;
          }
          div[style*="padding: 5rem 1.5rem 4rem"] {
            padding: 4rem 0.75rem 2rem !important;
          }
        }

        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          a, button, nav, .App-header, style {
            display: none !important;
          }
          div[style*="min-height"] {
            padding: 0 !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          div[style*="max-width"] {
            max-width: 100% !important;
          }
          div[style*="background-color: rgb(15, 23, 42)"],
          div[style*="background-color: rgba(30, 41, 59"] {
            background: #ffffff !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
