import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  BookOpen, Trophy, Clock, CheckCircle, XCircle, Send, 
  ChevronLeft, ChevronRight, GraduationCap, ArrowLeft, 
  Sparkles, Award, RefreshCw, Cpu, Check, Copy, Share2 
} from "lucide-react";

import { WORKSHOP_INFO, QUESTIONS_FORMACAO_DOCENTE } from "../../../../data/formacaoDocenteData";
import RankingFormacaoDocente from "./RankingFormacaoDocente";

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
const theme = {
  bg: "#070B14",
  surface: "#0F172A",
  surfaceLight: "rgba(30, 41, 59, 0.6)",
  border: "rgba(255, 255, 255, 0.08)",
  borderActive: "#8B5CF6",
  accent: "#8B5CF6",
  accentGlow: "rgba(139, 92, 246, 0.2)",
  secondary: "#2563EB",
  text: "#CBD5E1",
  textMuted: "#94A3B8",
  white: "#FFFFFF",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.12)",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.12)"
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function FormacaoDocenteActivity() {
  const [activeTab, setActiveTab] = useState("quiz"); // 'quiz' | 'ranking'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [confirmedAnswers, setConfirmedAnswers] = useState({}); // { [questionId]: true }
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // User details for ranking submission
  const [userName, setUserName] = useState("");
  const [userDepartment, setUserDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedToRanking, setSubmittedToRanking] = useState(false);

  const timerRef = useRef(null);

  // Start timer on mount
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const questions = QUESTIONS_FORMACAO_DOCENTE;
  const currentQ = questions[currentIdx];
  const selectedOption = answers[currentQ.id];
  const isConfirmed = confirmedAnswers[currentQ.id];

  const handleSelectOption = (idx) => {
    if (isConfirmed || isFinished) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === undefined) return;
    setConfirmedAnswers(prev => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    setTimerActive(false);
    clearInterval(timerRef.current);

    // Calculate score
    let totalPoints = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        totalPoints += q.points;
      }
    });

    const finalScore = Math.round(totalPoints);
    setScore(finalScore);
    setIsFinished(true);
  };

  const handleRankingSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || submitting || submittedToRanking) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "fametro_ranking"), {
        activityId: "formacao_docente_2026_2",
        userName: userName.trim(),
        department: userDepartment.trim() || "Docente FAMETRO",
        score: score,
        duration: elapsedSeconds * 1000,
        createdAt: serverTimestamp()
      });
      setSubmittedToRanking(true);
      setSubmitting(false);
      setActiveTab("ranking");
    } catch (err) {
      console.error("Erro ao salvar pontuação no Firestore:", err);
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      paddingBottom: "4rem"
    }}>
      {/* Top Banner Navigation Header */}
      <header style={{
        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 11, 20, 0.8) 100%)",
        borderBottom: `1px solid ${theme.border}`,
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          {/* Brand & Workshop Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/fametro" style={{
              color: theme.textMuted,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: "600"
            }}>
              <ArrowLeft size={16} /> Fametro
            </Link>
            <div style={{ height: "20px", width: "1px", background: theme.border }}></div>
            <div>
              <div style={{ fontSize: "0.7rem", color: theme.accent, fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase" }}>
                {WORKSHOP_INFO.institution} • {WORKSHOP_INFO.edition}
              </div>
              <h1 style={{ fontSize: "1.1rem", fontWeight: "900", color: theme.white, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Cpu size={18} color="#8B5CF6" /> {WORKSHOP_INFO.subtitle}
              </h1>
            </div>
          </div>

          {/* Tab Switcher & Timer */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: `1px solid ${theme.border}`,
              borderRadius: "30px",
              padding: "4px",
              display: "flex",
              gap: "4px"
            }}>
              <button
                onClick={() => setActiveTab("quiz")}
                style={{
                  background: activeTab === "quiz" ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "transparent",
                  color: activeTab === "quiz" ? "#FFF" : theme.textMuted,
                  border: "none",
                  borderRadius: "20px",
                  padding: "0.4rem 1rem",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
              >
                <BookOpen size={14} /> Atividade
              </button>

              <button
                onClick={() => setActiveTab("ranking")}
                style={{
                  background: activeTab === "ranking" ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "transparent",
                  color: activeTab === "ranking" ? "#FFF" : theme.textMuted,
                  border: "none",
                  borderRadius: "20px",
                  padding: "0.4rem 1rem",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
              >
                <Trophy size={14} color="#F59E0B" /> Placar ao Vivo
              </button>
            </div>

            {/* Timer Badge */}
            <div style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "20px",
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#A78BFA",
              fontWeight: "700",
              fontSize: "0.85rem",
              fontFamily: "monospace"
            }}>
              <Clock size={15} /> {formatTime(elapsedSeconds)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === "ranking" ? (
        <RankingFormacaoDocente onSwitchToQuiz={() => setActiveTab("quiz")} />
      ) : (
        <main style={{ maxWidth: "900px", margin: "2rem auto 0", padding: "0 1.5rem" }}>
          
          {!isFinished ? (
            <div>
              {/* Progress & Meta bar */}
              <div style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                padding: "1.25rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: theme.white, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} color="#8B5CF6" /> Questão {currentIdx + 1} de {questions.length}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: theme.accent, background: theme.accentGlow, padding: "3px 10px", borderRadius: "12px" }}>
                    {currentQ.category}
                  </span>
                </div>

                {/* Progress track */}
                <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                    borderRadius: "10px",
                    transition: "width 0.3s ease"
                  }}></div>
                </div>
              </div>

              {/* Question Card */}
              <div style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "2rem",
                marginBottom: "1.5rem",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)"
              }}>
                {/* Bloom Level Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "4px 12px", borderRadius: "20px", color: "#60A5FA", fontSize: "0.75rem", fontWeight: "700", marginBottom: "1.25rem" }}>
                  <GraduationCap size={14} /> Nível Cognitivo Bloom: {currentQ.bloomLevel}
                </div>

                {/* Professional Context (Texto-Base / Situação-Problema) */}
                <div style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  borderLeft: `4px solid ${theme.accent}`,
                  borderRadius: "8px",
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                  lineHeight: "1.7",
                  fontSize: "0.95rem",
                  color: theme.text
                }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "1.5px", color: theme.accent, marginBottom: "0.5rem", textTransform: "uppercase" }}>
                    Contexto & Situação-Problema
                  </div>
                  {currentQ.context}
                </div>

                {/* Question Prompt Command */}
                <h2 style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: theme.white,
                  lineHeight: "1.6",
                  marginBottom: "1.75rem"
                }}>
                  {currentQ.text}
                </h2>

                {/* Answer Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {currentQ.answers.map((optText, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = currentQ.correct === optIdx;

                    let optionStyle = {
                      background: "rgba(30, 41, 59, 0.3)",
                      border: `1px solid ${theme.border}`,
                      color: theme.text
                    };

                    if (isConfirmed) {
                      if (isCorrect) {
                        optionStyle = {
                          background: theme.successBg,
                          border: `1px solid ${theme.success}`,
                          color: theme.white
                        };
                      } else if (isSelected && !isCorrect) {
                        optionStyle = {
                          background: theme.dangerBg,
                          border: `1px solid ${theme.danger}`,
                          color: theme.white
                        };
                      }
                    } else if (isSelected) {
                      optionStyle = {
                        background: "rgba(139, 92, 246, 0.15)",
                        border: `1px solid ${theme.accent}`,
                        color: theme.white
                      };
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        disabled={isConfirmed}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "1rem",
                          padding: "1.1rem 1.25rem",
                          borderRadius: "14px",
                          textAlign: "left",
                          cursor: isConfirmed ? "default" : "pointer",
                          fontSize: "0.92rem",
                          lineHeight: "1.6",
                          fontWeight: isSelected ? "600" : "400",
                          transition: "all 0.2s ease",
                          ...optionStyle
                        }}
                      >
                        {/* Option Letter Indicator */}
                        <div style={{
                          minWidth: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: isConfirmed && isCorrect
                            ? theme.success
                            : isConfirmed && isSelected && !isCorrect
                              ? theme.danger
                              : isSelected
                                ? theme.accent
                                : "rgba(255, 255, 255, 0.08)",
                          color: isSelected || (isConfirmed && (isCorrect || isSelected)) ? "#FFF" : theme.textMuted,
                          fontWeight: "800",
                          fontSize: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          justify: "center",
                          marginTop: "2px"
                        }}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>

                        <div style={{ flex: 1 }}>{optText}</div>

                        {/* Status Icon when Confirmed */}
                        {isConfirmed && isCorrect && <CheckCircle size={20} color={theme.success} style={{ marginTop: "2px" }} />}
                        {isConfirmed && isSelected && !isCorrect && <XCircle size={20} color={theme.danger} style={{ marginTop: "2px" }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box if Confirmed */}
                {isConfirmed && (
                  <div style={{
                    marginTop: "1.75rem",
                    padding: "1.25rem",
                    borderRadius: "14px",
                    background: selectedOption === currentQ.correct ? theme.successBg : theme.dangerBg,
                    border: `1px solid ${selectedOption === currentQ.correct ? theme.success : theme.danger}`
                  }}>
                    <div style={{
                      fontWeight: "800",
                      color: selectedOption === currentQ.correct ? theme.success : theme.danger,
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      {selectedOption === currentQ.correct ? (
                        <> <CheckCircle size={18} /> Resposta Correta! (+{currentQ.points} pts) </>
                      ) : (
                        <> <XCircle size={18} /> Resposta Incorreta </>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: theme.text, lineHeight: "1.6" }}>
                      {currentQ.feedback}
                    </p>
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
                  <button
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    style={{
                      background: "transparent",
                      color: currentIdx === 0 ? "rgba(255,255,255,0.2)" : theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "10px",
                      padding: "0.6rem 1.2rem",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>

                  {!isConfirmed ? (
                    <button
                      onClick={handleConfirmAnswer}
                      disabled={selectedOption === undefined}
                      style={{
                        background: selectedOption !== undefined
                          ? "linear-gradient(135deg, #10B981, #059669)"
                          : "rgba(255, 255, 255, 0.08)",
                        color: selectedOption !== undefined ? "#FFF" : "rgba(255,255,255,0.3)",
                        border: "none",
                        borderRadius: "10px",
                        padding: "0.7rem 1.8rem",
                        fontSize: "0.9rem",
                        fontWeight: "800",
                        cursor: selectedOption !== undefined ? "pointer" : "not-allowed",
                        boxShadow: selectedOption !== undefined ? "0 4px 15px rgba(16, 185, 129, 0.3)" : "none"
                      }}
                    >
                      Confirmar Resposta
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      style={{
                        background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                        color: "#FFF",
                        border: "none",
                        borderRadius: "10px",
                        padding: "0.7rem 1.8rem",
                        fontSize: "0.9rem",
                        fontWeight: "800",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      {currentIdx < questions.length - 1 ? (
                        <> Próxima Questão <ChevronRight size={16} /> </>
                      ) : (
                        <> Finalizar Oficina <Send size={16} /> </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ) : (
            /* Results Screen */
            <div style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "24px",
              padding: "3rem 2rem",
              textAlign: "center",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}>
              <div style={{
                width: "80px", height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(37, 99, 235, 0.2))",
                border: "2px solid #8B5CF6",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "#A78BFA"
              }}>
                <Trophy size={40} />
              </div>

              <h2 style={{ fontSize: "2rem", fontWeight: "900", color: theme.white, margin: "0 0 0.5rem" }}>
                Oficina Concluída com Sucesso!
              </h2>

              <p style={{ color: theme.textMuted, maxWidth: "500px", margin: "0 auto 2rem", fontSize: "0.95rem" }}>
                Parabéns por completar o módulo prático de Engenharia de Prompts com IA Generativa para o Padrão ENADE.
              </p>

              {/* Score Display Card */}
              <div style={{
                background: "rgba(30, 41, 59, 0.5)",
                border: `1px solid ${theme.border}`,
                borderRadius: "18px",
                padding: "2rem",
                maxWidth: "450px",
                margin: "0 auto 2.5rem"
              }}>
                <div style={{ fontSize: "0.8rem", color: theme.textMuted, textTransform: "uppercase", fontWeight: "800", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                  Sua Pontuação Final
                </div>
                <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "#8B5CF6", lineHeight: 1, marginBottom: "0.5rem" }}>
                  {score}%
                </div>
                <div style={{ fontSize: "0.85rem", color: theme.text, display: "flex", justifyContent: "center", gap: "15px" }}>
                  <span>Tempo: <strong>{formatTime(elapsedSeconds)}</strong></span>
                  <span>•</span>
                  <span>Acertos: <strong>{Object.keys(answers).filter(qId => answers[qId] === questions.find(q => q.id === Number(qId))?.correct).length}/{questions.length}</strong></span>
                </div>
              </div>

              {/* Form to submit to Leaderboard */}
              {!submittedToRanking ? (
                <form onSubmit={handleRankingSubmit} style={{
                  maxWidth: "450px",
                  margin: "0 auto",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "16px",
                  padding: "1.5rem",
                  textAlign: "left"
                }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "800", color: theme.white, margin: "0 0 1rem" }}>
                    🏆 Registrar seu Nome no Placar ao Vivo
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: theme.textMuted, fontWeight: "700", marginBottom: "0.4rem" }}>
                      Nome Completo do Docente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Prof. Dr. João Silva"
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        background: "rgba(30, 41, 59, 0.8)",
                        border: `1px solid ${theme.border}`,
                        color: "#FFF",
                        fontSize: "0.9rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: theme.textMuted, fontWeight: "700", marginBottom: "0.4rem" }}>
                      Curso / Unidade de Ensino
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Computação - FAMETRO Centro"
                      value={userDepartment}
                      onChange={e => setUserDepartment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        background: "rgba(30, 41, 59, 0.8)",
                        border: `1px solid ${theme.border}`,
                        color: "#FFF",
                        fontSize: "0.9rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      color: "#FFF",
                      border: "none",
                      borderRadius: "10px",
                      padding: "0.8rem",
                      fontWeight: "800",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    {submitting ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
                    Enviar Resultado para o Ranking
                  </button>
                </form>
              ) : (
                <div style={{
                  background: theme.successBg,
                  border: `1px solid ${theme.success}`,
                  borderRadius: "14px",
                  padding: "1.25rem",
                  maxWidth: "450px",
                  margin: "0 auto 1.5rem",
                  color: theme.success,
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  <CheckCircle size={20} /> Resultado registrado com sucesso no Placar ao Vivo!
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
                <button
                  onClick={() => setActiveTab("ranking")}
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "30px",
                    padding: "0.75rem 1.8rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Trophy size={18} color="#F59E0B" /> Ver Placar ao Vivo
                </button>

                <button
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentIdx(0);
                    setAnswers({});
                    setConfirmedAnswers({});
                    setElapsedSeconds(0);
                    setTimerActive(true);
                    setSubmittedToRanking(false);
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "30px",
                    padding: "0.75rem 1.8rem",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Refazer Simulado
                </button>
              </div>

            </div>
          )}

        </main>
      )}

    </div>
  );
}
