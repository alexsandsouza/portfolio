import { useState, useEffect, useRef } from "react";
import { db } from '../../../../firebase';
import { collection, query, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';

const LEVEL_CONFIG = [
  { min: 91, label: "ARQUITETO DE REQUISITOS", color: "#FFD700", icon: "🏆" },
  { min: 76, label: "ANALISTA SR.",            color: "#10B981", icon: "⭐" },
  { min: 61, label: "ANALISTA DE SISTEMAS",    color: "#40C4FF", icon: "✅" },
  { min: 41, label: "TRAINEE EM ANÁLISE",      color: "#FFB300", icon: "📚" },
  { min: 0,  label: "ESTUDANTE",               color: "#FF5252", icon: "🔄" },
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

export default function RankingRequisitos() {
  const [entries, setEntries] = useState([]);
  const [flash, setFlash] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showClear, setShowClear] = useState(false);
  const [tick, setTick] = useState(0);
  const entriesRef = useRef([]);

  useEffect(() => { entriesRef.current = entries; }, [entries]);

  // Tick to update time labels
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "fametro_ranking"));
    const unsub = onSnapshot(q, (snapshot) => {
      let loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      loaded = loaded.filter(d => d.activityId === "analise_requisitos");
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
    try {
      const q = query(collection(db, "fametro_ranking"));
      const snapshot = await getDocs(q);
      const dels = snapshot.docs
        .filter(d => d.data().activityId === "analise_requisitos")
        .map(d => deleteDoc(doc(db, "fametro_ranking", d.id)));
      await Promise.all(dels);
      setShowClear(false);
    } catch { }
  }

  const stats = {
    total: entries.length,
    avg: entries.length ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : 0,
    perfect: entries.filter(e => e.score === 100).length,
    top: entries[0] || null,
  };

  const displayed = filter === "top"
    ? entries.slice(0, 10)
    : filter === "recent"
      ? [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
      : entries;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #060A0F 0%, #0A0A0F 50%, #08060F 100%)",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      overflowY: "auto",
      padding: "0 0 60px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @keyframes slideIn { from { opacity:0; transform:translateY(-16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes flashBorder { 0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,0);} 50%{box-shadow:0 0 0 6px rgba(192,57,43,0.4);} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes countUp { from{opacity:0;transform:scale(0.7);} to{opacity:1;transform:scale(1);} }
        @keyframes pulseBg { 0%,100%{background:rgba(192,57,43,0.08)} 50%{background:rgba(192,57,43,0.16)} }
      `}</style>

      {/* Background Effect */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(192,57,43,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(41,128,185,0.04) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HEADER */}
      <div style={{
        background: "rgba(10,10,15,0.95)",
        borderBottom: "1px solid rgba(192,57,43,0.2)",
        padding: "28px 24px 24px",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(20px)"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "linear-gradient(135deg, #7B1A1A, #C0392B)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, boxShadow: "0 4px 16px rgba(192,57,43,0.5)"
              }}>📋</div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#C0392B", fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  FAMETRO · Análise de Requisitos · Aula 04
                </div>
                <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.1, fontFamily: "'Syne', sans-serif" }}>
                  REQQUEST — Ranking ao Vivo
                </h1>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 20, padding: "5px 12px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#C0392B", animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#C0392B", letterSpacing: 1 }}>AO VIVO</span>
              </div>
              {entries.length > 0 && (
                <button onClick={() => setShowClear(true)} style={{
                  background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.25)",
                  borderRadius: 8, padding: "6px 12px", color: "#FF5252", fontSize: 12,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>🗑 Limpar</button>
              )}
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            Prof. Alexsander Farias · Sistemas de Informação · CEUNI-FAMETRO · 2026.1
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", position: 'relative', zIndex: 1 }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Alunos Finalizaram", value: stats.total, icon: "👥", color: "#FF7675" },
            { label: "Média da Turma", value: stats.total ? `${stats.avg} pts` : "—", icon: "📊", color: "#C0392B" },
            { label: "Notas Perfeitas", value: stats.perfect, icon: "💯", color: "#FFD700" },
            { label: "Líder Atual", value: stats.top ? stats.top.name.split(" ")[0] : "—", icon: "🏆", color: "#F5A623" },
          ].map(card => (
            <div key={card.label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "16px 18px",
              display: "flex", alignItems: "center", gap: 12
            }}>
              <span style={{ fontSize: 28 }}>{card.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: card.color, fontFamily: "'JetBrains Mono', monospace", animation: "countUp 0.5s ease" }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PODIUM */}
        {entries.length >= 3 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
              TOP 3 — PÓDIO
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, justifyContent: "center" }}>
              {[1, 0, 2].map((rankIdx, i) => {
                const e = entries[rankIdx];
                if (!e) return null;
                const lvl = getLevel(e.score);
                const heights = [160, 200, 140];
                const podiumColors = ["#C0C0C0", "#FFD700", "#CD7F32"];
                const rank = rankIdx + 1;
                return (
                  <div key={e.id} style={{ flex: 1, maxWidth: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: rank === 1 ? 56 : 46, height: rank === 1 ? 56 : 46, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${lvl.color}44, ${lvl.color}22)`,
                      border: `2px solid ${podiumColors[i]}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: rank === 1 ? 24 : 20, boxShadow: `0 0 20px ${podiumColors[i]}40`
                    }}>
                      {rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉"}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{e.name.split(" ").slice(0, 2).join(" ")}</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: podiumColors[i], fontFamily: "'JetBrains Mono', monospace" }}>{e.score}pts</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{formatTime(e.duration)}</div>
                    </div>
                    <div style={{
                      width: "100%", height: heights[i],
                      background: `linear-gradient(180deg, ${podiumColors[i]}22, ${podiumColors[i]}08)`,
                      border: `1px solid ${podiumColors[i]}33`, borderRadius: "10px 10px 0 0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28, fontWeight: 900, color: podiumColors[i], fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {rank}°
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FILTER TABS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", marginRight: 4 }}>FILTRAR:</div>
          {[{ key: "all", label: "Todos" }, { key: "top", label: "Top 10" }, { key: "recent", label: "Recentes" }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "6px 14px", borderRadius: 20,
              border: `1px solid ${filter === f.key ? "#C0392B" : "rgba(255,255,255,0.1)"}`,
              background: filter === f.key ? "rgba(192,57,43,0.15)" : "transparent",
              color: filter === f.key ? "#C0392B" : "rgba(255,255,255,0.4)",
              fontSize: 12, fontWeight: filter === f.key ? 700 : 400,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
            }}>{f.label}</button>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace" }}>
            {entries.length} {entries.length === 1 ? "aluno" : "alunos"}
          </div>
        </div>

        {/* TABLE */}
        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Aguardando os primeiros alunos...</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>Conforme os alunos finalizarem o REQQUEST, os resultados aparecerão aqui automaticamente.</div>
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ width: 16, height: 16, border: "2px solid #C0392B", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 12, color: "#C0392B", fontFamily: "'JetBrains Mono', monospace" }}>Monitorando em tempo real...</span>
            </div>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 100px 90px 90px 110px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
              {["#", "ALUNO", "PONTUAÇÃO", "TEMPO", "NÍVEL", "ENVIADO"].map((h, i) => (
                <div key={h} style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", textAlign: i >= 2 ? "center" : "left" }}>{h}</div>
              ))}
            </div>

            {displayed.map((entry) => {
              const rank = entries.indexOf(entry) + 1;
              const lvl = getLevel(entry.score);
              const isNew = entry.id === flash;
              const isTop3 = rank <= 3;
              const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

              return (
                <div key={entry.id} style={{
                  display: "grid", gridTemplateColumns: "52px 1fr 100px 90px 90px 110px",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: isNew ? "rgba(192,57,43,0.06)" : isTop3 ? "rgba(255,255,255,0.02)" : "transparent",
                  animation: isNew ? "slideIn 0.5s ease, flashBorder 1.5s ease 2" : "slideIn 0.3s ease",
                  transition: "background 0.3s",
                  alignItems: "center",
                  borderLeft: isNew ? "3px solid #C0392B" : isTop3 ? `3px solid ${medalColors[rank - 1]}` : "3px solid transparent"
                }}>
                  <div style={{ fontSize: 18, textAlign: "center" }}>
                    {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : (
                      <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>{rank}</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: isNew ? "#FF7675" : "#E8EAF6", display: "flex", alignItems: "center", gap: 6 }}>
                      {entry.name}
                      {isNew && <span style={{ fontSize: 10, background: "#C0392B", color: "#fff", padding: "2px 6px", borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>NOVO!</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
                      Análise de Requisitos — Aula 04
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: 20, fontWeight: 900,
                      color: entry.score >= 91 ? "#FFD700" : entry.score >= 76 ? "#10B981" : entry.score >= 61 ? "#40C4FF" : entry.score >= 41 ? "#FFB300" : "#FF5252",
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>{entry.score}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>/ 100</div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatTime(entry.duration)}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      display: "inline-block", background: `${lvl.color}18`, border: `1px solid ${lvl.color}44`,
                      borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700,
                      color: lvl.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5
                    }}>
                      {lvl.icon} {lvl.label}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                    {timeAgo(entry.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DISTRIBUTION */}
        {entries.length > 0 && (
          <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", padding: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>DISTRIBUIÇÃO DE NÍVEIS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LEVEL_CONFIG.map(lvl => {
                const count = entries.filter(e => getLevel(e.score).label === lvl.label).length;
                const pct = entries.length ? (count / entries.length) * 100 : 0;
                return (
                  <div key={lvl.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 140, fontSize: 11, color: lvl.color, fontFamily: "'JetBrains Mono', monospace", textAlign: "right", flexShrink: 0 }}>
                      {lvl.icon} {lvl.label}
                    </div>
                    <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: lvl.color, transition: "width 0.8s ease", boxShadow: `0 0 8px ${lvl.color}60` }} />
                    </div>
                    <div style={{ width: 30, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace" }}>
          Atualização automática em tempo real · Prof. Alexsander Farias · FAMETRO 2026.1
        </div>
      </div>

      {/* CLEAR MODAL */}
      {showClear && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0D0A15", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 16, padding: 28, maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ margin: "0 0 8px", color: "#fff", fontSize: 18 }}>Limpar ranking?</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 24px" }}>Todos os resultados dos alunos do REQQUEST serão apagados permanentemente.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowClear(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: 14, cursor: "pointer" }}>Cancelar</button>
              <button onClick={clearAll} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#C0392B", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
