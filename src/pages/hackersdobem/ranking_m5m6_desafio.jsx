import { useState, useEffect, useRef } from "react";
import { db } from '../../firebase';
import { collection, query, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';

const LEVEL_CONFIG = [
  { min: 400, label: "LENDÁRIO", color: "#FFD700", icon: "👑" },
  { min: 300, label: "ESPECIALISTA", color: "#00E676", icon: "⚡" },
  { min: 200, label: "PROFICIENTE", color: "#40C4FF", icon: "🔷" },
  { min: 100, label: "APRENDIZ", color: "#FFB300", icon: "🔶" },
  { min: 0,   label: "INICIANTE",  color: "#FF5252", icon: "🔰" },
];

function getLevel(score) {
  return LEVEL_CONFIG.find(l => score >= l.min) || LEVEL_CONFIG[4];
}

function timeAgo(ts) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

function formatTime(ms) {
    if (!ms) return "00:00";
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function RankingM5M6Desafio() {
  const [entries, setEntries] = useState([]);
  const [flash, setFlash] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [filter, setFilter] = useState("all");
  const [showClear, setShowClear] = useState(false);
  const entriesRef = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    const q = query(collection(db, "hackersdobem_ranking"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      loaded = loaded.filter(doc => doc.module === "M5M6_DESAFIO");
      loaded.sort((a, b) => (b.score - a.score) || (a.duration - b.duration));

      const oldEntries = entriesRef.current;
      if (loaded.length > oldEntries.length && oldEntries.length !== 0) {
        const newest = loaded.filter(e => !oldEntries.find(ex => ex.id === e.id));
        if (newest.length > 0) {
          setFlash(newest[0].id);
          setTimeout(() => setFlash(null), 3000);
        }
      }
      setEntries(loaded);
    });
    
    return () => unsubscribe();
  }, []);

  async function clearAll() {
    try {
      const q = query(collection(db, "hackersdobem_ranking"));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs
        .filter(document => document.data().module === "M5M6_DESAFIO")
        .map(document => deleteDoc(doc(db, "hackersdobem_ranking", document.id)));
      await Promise.all(deletePromises);
      setShowClear(false);
    } catch {}
  }

  const displayed = filter === "top"
    ? entries.slice(0, 10)
    : filter === "recent"
    ? [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
    : entries;

  const stats = {
    total: entries.length,
    avg: entries.length ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : 0,
    perfect: entries.filter(e => e.score >= 500).length,
    top: entries[0] || null,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #040812 0%, #080D1F 50%, #060B18 100%)",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      overflowY: "auto",
      padding: "0 0 60px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes flashBorder {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); }
          50%      { box-shadow: 0 0 0 6px rgba(34,211,238,0.4); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #0A1A2E 0%, transparent 100%)",
        borderBottom: "1px solid rgba(34,211,238,0.2)",
        padding: "24px",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(20px)"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#22d3ee", fontFamily: "'Space Mono', monospace" }}>
              HACKERS DO BEM · DESAFIO M5/M6
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#fff" }}>Ranking Supremo</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)", borderRadius: 20, padding: "5px 15px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22d3ee", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: "bold", color: "#22d3ee" }}>LIVE</span>
            </div>
            <button onClick={() => setShowClear(true)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "5px 12px", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Limpar</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 30 }}>
            {[
              { label: "Participantes", value: stats.total, color: "#3b82f6", icon: "👥" },
              { label: "Média Global", value: stats.avg, color: "#22d3ee", icon: "📊" },
              { label: "Alunos Alpha", value: stats.perfect, color: "#eab308", icon: "👑" },
              { label: "Top Player", value: stats.top?.name || "—", color: "#a855f7", icon: "🏆" }
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px", display: "flex", alignItems: "center", gap: 15 }}>
                <span style={{ fontSize: 32 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.label}</div>
                </div>
              </div>
            ))}
        </div>

        {/* TABLE */}
        <div style={{ background: "rgba(15, 23, 42, 0.4)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.05)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px 150px", padding: "15px 25px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "#64748b", fontWeight: "bold" }}>
            <span>POS</span>
            <span>ALUNO</span>
            <span style={{ textAlign: "center" }}>SCORE</span>
            <span style={{ textAlign: "center" }}>TEMPO</span>
            <span style={{ textAlign: "center" }}>PATENTE</span>
          </div>

          {displayed.map((e, idx) => {
            const rank = entries.indexOf(e) + 1;
            const lvl = getLevel(e.score);
            return (
              <div key={e.id} style={{ 
                display: "grid", gridTemplateColumns: "60px 1fr 120px 100px 150px", padding: "20px 25px", 
                borderBottom: "1px solid rgba(255,255,255,0.03)", alignItems: "center",
                backgroundColor: e.id === flash ? "rgba(34,211,238,0.1)" : "transparent",
                animation: e.id === flash ? "flashBorder 2s ease" : "none"
              }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: rank <= 3 ? (rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : "#b45309") : "#334155" }}>
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                </span>
                <div style={{ fontWeight: "bold", fontSize: 16 }}>{e.name}</div>
                <div style={{ textAlign: "center", fontWeight: 900, fontSize: 20, color: "#22d3ee" }}>{e.score}</div>
                <div style={{ textAlign: "center", color: "#64748b", fontFamily: "monospace" }}>{formatTime(e.duration)}</div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ backgroundColor: `${lvl.color}20`, color: lvl.color, padding: "5px 12px", borderRadius: 20, fontSize: 10, fontWeight: "bold", border: `1px solid ${lvl.color}40` }}>
                    {lvl.icon} {lvl.label}
                  </span>
                </div>
              </div>
            );
          })}

          {entries.length === 0 && (
            <div style={{ padding: 100, textAlign: "center", color: "#64748b" }}>Aguardando combatentes...</div>
          )}
        </div>
      </div>

      {showClear && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0D1330", padding: 30, borderRadius: 20, textAlign: "center", maxWidth: 400 }}>
            <h3>Limpar Ranking?</h3>
            <p>Isso removerá todos os resultados deste desafio.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowClear(false)} style={{ flex: 1, padding: 10, borderRadius: 8 }}>Cancelar</button>
              <button onClick={clearAll} style={{ flex: 1, padding: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8 }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
