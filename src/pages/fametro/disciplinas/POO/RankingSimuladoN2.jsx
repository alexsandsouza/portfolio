import { useState, useEffect, useRef } from "react";
import { db } from '../../../../firebase';
import { collection, query, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const LEVEL_CONFIG = [
  { min: 90, label: "EXCELÊNCIA", color: "#FFD700", icon: "🏆" },
  { min: 70, label: "DISTINÇÃO",  color: "#A78BFA", icon: "⭐" },
  { min: 50, label: "APROVADO",   color: "#3B82F6", icon: "✅" },
  { min: 0,  label: "REVISAR",    color: "#EF4444", icon: "🔄" },
];

function getLevel(score) {
  return LEVEL_CONFIG.find(l => score >= l.min);
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

function formatTime(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function RankingSimuladoN2() {
  const [entries, setEntries] = useState([]);
  const [flash, setFlash] = useState(null);
  const [filterModel, setFilterModel] = useState("all"); // 'all' | 'Modelo A' | 'Modelo B'
  const [showClear, setShowClear] = useState(false);
  const [tick, setTick] = useState(0);
  const entriesRef = useRef([]);

  useEffect(() => { entriesRef.current = entries; }, [entries]);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "fametro_ranking"));
    const unsub = onSnapshot(q, (snapshot) => {
      let loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      loaded = loaded.filter(d => d.activityId === "poo_simulado");
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
    });
    return () => unsub();
  }, []);

  async function clearAll() {
    const pwd = window.prompt("Ação restrita. Insira a senha de administrador:");
    if (pwd !== "admin123") {
      alert("Senha incorreta. Ação bloqueada.");
      setShowClear(false);
      return;
    }
    
    try {
      const q = query(collection(db, "fametro_ranking"));
      const snapshot = await getDocs(q);
      const dels = snapshot.docs
        .filter(d => d.data().activityId === "poo_simulado")
        .map(d => deleteDoc(doc(db, "fametro_ranking", d.id)));
      await Promise.all(dels);
      alert("Ranking limpo com sucesso.");
      setShowClear(false);
    } catch (error) {
      alert("Erro ao limpar. Possivelmente as regras de segurança estão ativas e bloqueando deleções públicas no Firebase.");
      console.error(error);
      setShowClear(false);
    }
  }

  const displayed = filterModel === "all"
    ? entries
    : entries.filter(e => e.model === filterModel);

  const stats = {
    total: displayed.length,
    avg: displayed.length ? Math.round(displayed.reduce((a, b) => a + b.score, 0) / displayed.length) : 0,
    perfect: displayed.filter(e => e.score === 100).length,
    top: displayed[0] || null,
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#070B14",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      padding: "0 0 60px"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes slideIn { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flashBorder { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0);} 50%{box-shadow:0 0 0 6px rgba(59,130,246,0.3);} }
        @keyframes pulse { 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>

      {/* Glow Effects */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(ellipse at 10% 50%, rgba(59,130,246,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.04) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HEADER */}
      <div style={{
        background: "rgba(13,19,33,0.95)",
        borderBottom: "1px solid rgba(59,130,246,0.2)",
        padding: "24px 24px",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(20px)"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "linear-gradient(135deg, #3B82F6, #1E3A8A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 4px 16px rgba(59,130,246,0.3)"
            }}>🏆</div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "#3B82F6", fontFamily: "monospace", textTransform: 'uppercase' }}>
                FAMETRO · Linguagem de Programação Orientada a Objetos
              </div>
              <h1 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
                Simulado N2 — Placar ao Vivo
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 20, padding: "5px 12px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 10, fontFamily: "monospace", color: "#3B82F6", fontWeight: 700 }}>LIVE</span>
            </div>
            {entries.length > 0 && (
              <button onClick={() => setShowClear(true)} style={{
                background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.25)",
                borderRadius: 8, padding: "6px 12px", color: "#FF5252", fontSize: 11,
                cursor: "pointer", fontWeight: 600
              }}>🗑 Limpar</button>
            )}
            <Link to="/fametro" style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 12px", color: "#ccc", fontSize: 11,
              textDecoration: "none", fontWeight: 600
            }}>Hub</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", position: 'relative', zIndex: 1 }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Participantes", value: stats.total, icon: "👥", color: "#3B82F6" },
            { label: "Média da Turma", value: stats.total ? `${stats.avg} pts` : "—", icon: "📊", color: "#10B981" },
            { label: "Gênios Analíticos", value: stats.perfect, icon: "💯", color: "#FFD700" },
            { label: "Líder Atual", value: stats.top ? stats.top.name.split(" ")[0] : "—", icon: "🏆", color: "#A78BFA" },
          ].map(card => (
            <div key={card.label} style={{
              background: "rgba(13,19,33,0.4)", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12
            }}>
              <span style={{ fontSize: 26 }}>{card.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 950, color: card.color, fontFamily: "monospace" }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MODEL SELECT FILTER */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#64748B", fontWeight: 700, marginRight: 4 }}>FILTRAR PROVA:</div>
          {[
            { key: "all", label: "Todas" },
            { key: "Modelo A", label: "Modelo A" },
            { key: "Modelo B", label: "Modelo B" }
          ].map(f => (
            <button key={f.key} onClick={() => setFilterModel(f.key)} style={{
              padding: "6px 14px", borderRadius: 20,
              border: `1px solid ${filterModel === f.key ? "#3B82F6" : "rgba(255,255,255,0.08)"}`,
              background: filterModel === f.key ? "rgba(59,130,246,0.15)" : "transparent",
              color: filterModel === f.key ? "#fff" : "#94A3B8",
              fontSize: 12, fontWeight: filterModel === f.key ? 700 : 400,
              cursor: "pointer", transition: "all 0.2s"
            }}>{f.label}</button>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#64748B", fontFamily: "monospace" }}>
            Total Filtrado: {displayed.length}
          </div>
        </div>

        {/* TABLE */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(13,19,33,0.4)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#94A3B8", marginBottom: 6 }}>Aguardando os primeiros resultados...</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Os resultados aparecerão aqui automaticamente após o término do simulador.</div>
          </div>
        ) : (
          <div style={{ background: "rgba(13,19,33,0.4)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 100px 90px 110px 100px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(13,19,33,0.8)" }}>
              {["#", "ALUNO", "PONTUAÇÃO", "PROVA", "NÍVEL", "ENVIADO"].map((h, i) => (
                <div key={h} style={{ fontSize: 10, letterSpacing: 1.5, color: "#64748B", fontWeight: 700, textAlign: i >= 2 ? "center" : "left" }}>{h}</div>
              ))}
            </div>

            {displayed.map((entry, idx) => {
              const rank = idx + 1;
              const lvl = getLevel(entry.score);
              const isNew = entry.id === flash;
              const isTop3 = rank <= 3;
              const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

              return (
                <div key={entry.id} style={{
                  display: "grid", gridTemplateColumns: "52px 1fr 100px 90px 110px 100px",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: isNew ? "rgba(59,130,246,0.06)" : "transparent",
                  animation: isNew ? "slideIn 0.5s ease, flashBorder 1.5s ease 2" : "slideIn 0.3s ease",
                  transition: "background 0.3s",
                  alignItems: "center",
                  borderLeft: isNew ? "3px solid #3B82F6" : isTop3 ? `3px solid ${medalColors[rank - 1]}` : "3px solid transparent"
                }}>
                  <div style={{ fontSize: 16, textAlign: "center" }}>
                    {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : (
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#475569", fontFamily: "monospace" }}>{rank}</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                      {entry.name}
                      {isNew && <span style={{ fontSize: 9, background: "#3B82F6", color: "#fff", padding: "2px 6px", borderRadius: 10, fontFamily: "monospace" }}>NOVO!</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>
                      Simulado N2 - Programação Orientada a Objetos
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: 18, fontWeight: 900,
                      color: lvl.color,
                      fontFamily: "monospace"
                    }}>{entry.score}</div>
                    <div style={{ fontSize: 9, color: "#475569" }}>/ 100</div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 12, color: "#CBD5E1", fontWeight: 600 }}>
                    {entry.model || "Modelo A"}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      display: "inline-block", background: `${lvl.color}15`, border: `1px solid ${lvl.color}33`,
                      borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700,
                      color: lvl.color, fontFamily: "monospace"
                    }}>
                      {lvl.icon} {lvl.label}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, color: "#64748B" }}>
                    {timeAgo(entry.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 40, fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
          Prof. Alexsander Farias · FAMETRO 2026.1
        </div>
      </div>

      {/* CLEAR MODAL */}
      {showClear && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0D1321", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 16, padding: 28, maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ margin: "0 0 8px", color: "#fff", fontSize: 18 }}>Limpar ranking?</h3>
            <p style={{ color: "#94A3B8", fontSize: 13, margin: "0 0 24px", lineHeight: 1.5 }}>Todos os resultados dos alunos salvos no Simulado N2 serão apagados permanentemente do Firestore.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowClear(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
              <button onClick={clearAll} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#3B82F6", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
