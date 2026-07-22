import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../../firebase";
import { collection, query, onSnapshot, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Trophy, Users, Award, Clock, ArrowLeft, RefreshCw, Sparkles, BookOpen, Trash2, CheckCircle } from "lucide-react";

const LEVEL_CONFIG = [
  { min: 90, label: "EXCELÊNCIA DOCENTE", color: "#10B981", icon: "🏆" },
  { min: 75, label: "DISTINÇÃO EM IA", color: "#8B5CF6", icon: "⭐" },
  { min: 60, label: "APROVADO ENADE", color: "#3B82F6", icon: "✅" },
  { min: 0, label: "REVISAR PROMPTS", color: "#F59E0B", icon: "🔄" },
];

function getLevel(score) {
  return LEVEL_CONFIG.find(l => score >= l.min) || LEVEL_CONFIG[3];
}

function timeAgo(ts) {
  if (!ts) return "Recente";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

function formatTime(ms) {
  if (!ms && ms !== 0) return "00:00";
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function RankingFormacaoDocente({ onSwitchToQuiz }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(null);
  const [showClear, setShowClear] = useState(false);
  const [tick, setTick] = useState(0);
  const entriesRef = useRef([]);

  useEffect(() => { entriesRef.current = entries; }, [entries]);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "fametro_ranking"));
    const unsub = onSnapshot(q, (snapshot) => {
      let loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      loaded = loaded.filter(d => d.activityId === "formacao_docente_2026_2");
      loaded.sort((a, b) => (b.score - a.score) || (a.duration - b.duration));

      const old = entriesRef.current;
      if (loaded.length > old.length && old.length !== 0) {
        const newest = loaded.filter(e => !old.find(ox => ox.id === e.id));
        if (newest.length > 0) {
          setFlash(newest[0].id);
          setTimeout(() => setFlash(null), 3000);
        }
      }
      setEntries(loaded);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar ranking:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function clearAll() {
    try {
      const q = query(collection(db, "fametro_ranking"));
      const snapshot = await getDocs(q);
      const dels = snapshot.docs
        .filter(d => d.data().activityId === "formacao_docente_2026_2")
        .map(d => deleteDoc(doc(db, "fametro_ranking", d.id)));
      await Promise.all(dels);
      setShowClear(false);
    } catch (err) {
      console.error("Erro ao limpar ranking:", err);
    }
  }

  const averageScore = entries.length > 0
    ? (entries.reduce((acc, curr) => acc + (curr.score || 0), 0) / entries.length).toFixed(1)
    : 0;

  const topScorer = entries.length > 0 ? entries[0] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070B14",
      color: "#E2E8F0",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1rem 4rem"
    }}>
      <style>{`
        @keyframes flashAnim {
          0% { background: rgba(16, 185, 129, 0.3); transform: scale(1.01); }
          100% { background: transparent; transform: scale(1); }
        }
        .flash-card { animation: flashAnim 2.5s ease-out; }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Top bar navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <Link to="/fametro" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#94A3B8",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            transition: "color 0.2s"
          }}>
            <ArrowLeft size={18} /> Voltar ao Hub FAMETRO
          </Link>

          {onSwitchToQuiz && (
            <button
              onClick={onSwitchToQuiz}
              style={{
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                color: "#FFF",
                border: "none",
                borderRadius: "30px",
                padding: "0.6rem 1.4rem",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <BookOpen size={16} /> Responder Quiz da Oficina
            </button>
          )}
        </div>

        {/* Banner Header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          marginBottom: "2.5rem",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          textAlign: "center"
        }}>
          <div style={{
            position: "absolute",
            top: 0, right: 0,
            width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none"
          }} />

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(225, 29, 72, 0.15)",
            border: "1px solid rgba(225, 29, 72, 0.3)",
            padding: "4px 16px",
            borderRadius: "20px",
            color: "#F43F5E",
            fontSize: "0.75rem",
            fontWeight: "800",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "1rem"
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F43F5E", boxShadow: "0 0 10px #F43F5E" }}></span>
            FORMAÇÃO DOCENTE 2026.2 • PLACAR AO VIVO
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: "900",
            margin: "0.5rem 0 1rem",
            background: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Engenharia de Prompts com IA & Padrão ENADE
          </h1>

          <p style={{ color: "#94A3B8", maxWidth: "700px", margin: "0 auto", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Ranking em tempo real dos docentes participantes do Centro Universitário FAMETRO na oficina ministrada pelo Prof. Alexsander Farias.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.15)", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>Docentes Participantes</div>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#FFF" }}>{entries.length}</div>
            </div>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>Média da Turma</div>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#FFF" }}>{averageScore}%</div>
            </div>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trophy size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>Líder Atual</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" }}>
                {topScorer ? topScorer.userName || topScorer.name : "Nenhum"}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div style={{
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "1.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <Trophy size={20} color="#F59E0B" /> Tabela de Classificação
            </h2>

            {entries.length > 0 && (
              <button
                onClick={() => setShowClear(true)}
                style={{
                  background: "transparent",
                  color: "#EF4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Trash2 size={14} /> Limpar Tabela
              </button>
            )}
          </div>

          {showClear && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justify: "space-between"
            }}>
              <span style={{ fontSize: "0.85rem", color: "#FCA5A5" }}>Tem certeza de que deseja apagar todos os registros do ranking da oficina?</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={clearAll} style={{ background: "#EF4444", color: "#FFF", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}>Confirmar</button>
                <button onClick={() => setShowClear(false)} style={{ background: "rgba(255,255,255,0.1)", color: "#FFF", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.75rem", cursor: "pointer" }}>Cancelar</button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "#94A3B8" }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: "0.5rem" }} />
              <div>Carregando placar ao vivo...</div>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#94A3B8" }}>
              <Sparkles size={36} color="#3B82F6" style={{ marginBottom: "1rem" }} />
              <h3 style={{ color: "#FFF", margin: "0 0 0.5rem" }}>Aguardando os primeiros resultados...</h3>
              <p style={{ fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto 1.5rem" }}>
                Seja o primeiro docente a responder o simulado e figurar no topo do ranking!
              </p>
              {onSwitchToQuiz && (
                <button
                  onClick={onSwitchToQuiz}
                  style={{
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "30px",
                    padding: "0.7rem 1.8rem",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  Iniciar Quiz Agora
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {entries.map((entry, idx) => {
                const level = getLevel(entry.score);
                const isFlash = flash === entry.id;

                return (
                  <div
                    key={entry.id || idx}
                    className={isFlash ? "flash-card" : ""}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justify: "space-between",
                      background: idx === 0
                        ? "linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)"
                        : idx === 1
                          ? "linear-gradient(90deg, rgba(148, 163, 184, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)"
                          : idx === 2
                            ? "linear-gradient(90deg, rgba(180, 83, 9, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)"
                            : "rgba(30, 41, 59, 0.4)",
                      border: idx === 0
                        ? "1px solid rgba(245, 158, 11, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "14px",
                      padding: "1rem 1.25rem",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* Rank Position */}
                      <div style={{
                        width: "36px", height: "36px",
                        borderRadius: "50%",
                        background: idx === 0 ? "#F59E0B" : idx === 1 ? "#94A3B8" : idx === 2 ? "#D97706" : "rgba(255, 255, 255, 0.08)",
                        color: idx <= 2 ? "#000" : "#FFF",
                        fontWeight: "900",
                        fontSize: "0.95rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: idx === 0 ? "0 0 12px rgba(245, 158, 11, 0.5)" : "none"
                      }}>
                        {idx + 1}
                      </div>

                      {/* User Information */}
                      <div>
                        <div style={{ fontWeight: "800", color: "#FFF", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                          {entry.userName || entry.name}
                          {idx === 0 && <span title="Líder Atual">👑</span>}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                          <span>{entry.department || "Docente FAMETRO"}</span>
                          <span>•</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Clock size={12} /> {formatTime(entry.duration)}
                          </span>
                          <span>•</span>
                          <span>{timeAgo(entry.createdAt?.toMillis ? entry.createdAt.toMillis() : entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Level & Score Badge */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "2px 10px",
                        borderRadius: "20px",
                        background: `${level.color}20`,
                        color: level.color,
                        fontSize: "0.7rem",
                        fontWeight: "800",
                        marginBottom: "4px"
                      }}>
                        <span>{level.icon}</span> {level.label}
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: "900", color: level.color }}>
                        {entry.score}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ textAlign: "center", marginTop: "3rem", color: "#64748B", fontSize: "0.8rem" }}>
          Prof. Alexsander Farias • Centro Universitário FAMETRO • Formação Docente 2026.2
        </div>

      </div>
    </div>
  );
}
