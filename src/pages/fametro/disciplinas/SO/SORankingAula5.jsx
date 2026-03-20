import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, query, onSnapshot, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';

const LEVEL_CONFIG = [
  { min: 1900, label: "LENDA", color: "#f472b6", icon: "👑" },
  { min: 1500, label: "ARQUITETO", color: "#4ade80", icon: "🧪" },
  { min: 750, label: "MESTRE DMA", color: "#fbbf24", icon: "⚡" },
  { min: 250, label: "ANALISTA", color: "#818cf8", icon: "💿" },
  { min: 50, label: "OPERADOR", color: "#38bdf8", icon: "🖱️" },
  { min: 0, label: "INICIANTE", color: "#94a3b8", icon: "💾" },
];

function getLevel(score) {
  return LEVEL_CONFIG.find(l => score >= l.min) || LEVEL_CONFIG[5];
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

export default function SORankingAula5() {
  const [entries, setEntries] = useState([]);
  const [flash, setFlash] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showClear, setShowClear] = useState(false);
  const entriesRef = useRef([]);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    const q = query(collection(db, "fametro_ranking"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let loaded = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.activityId === "so_aula5");

      loaded.sort((a, b) => (b.score - a.score) || (a.duration - b.duration));

      if (loaded.length > entriesRef.current.length && entriesRef.current.length !== 0) {
        const newest = loaded.filter(e => !entriesRef.current.find(ex => ex.id === e.id));
        if (newest.length > 0) {
          setFlash(newest[0].id);
          setTimeout(() => setFlash(null), 3500);
        }
      }
      setEntries(loaded);
    });
    
    return () => unsubscribe();
  }, []);

  async function clearRanking() {
    try {
      const q = query(collection(db, "fametro_ranking"));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs
        .filter(d => d.data().activityId === "so_aula5")
        .map(d => deleteDoc(doc(db, "fametro_ranking", d.id)));
      await Promise.all(deletePromises);
      setShowClear(false);
    } catch (e) { console.error(e); }
  }

  const displayed = filter === "top" ? entries.slice(0, 10) : entries;

  const stats = {
    total: entries.length,
    p90: entries.filter(e => e.score >= 1500).length,
    avg: entries.length ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : 0,
    top: entries[0] || null
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#020617",
      color: "#f1f5f9",
      padding: "80px 20px 40px",
      fontFamily: "'Inter', sans-serif",
      backgroundImage: "linear-gradient(180deg, #0f172a 0%, #020617 100%)"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap');
        
        .rank-card { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 25px; backdrop-filter: blur(10px); }
        .row-new { animation: flashRow 2s infinite; }
        @keyframes flashRow { 0%, 100% { border-color: transparent } 50% { border-color: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); } }
        .tab-btn { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 6px 16px; borderRadius: 20px; cursor: pointer; font-size: 13px; font-family: 'Orbitron'; }
        .tab-btn.active { border-color: #3b82f6; color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* BACK LINK */}
        <Link to="/fametro" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '13px', marginBottom: '20px', transition: '0.2s' }}>
          <span style={{ fontSize: '18px' }}>←</span> VOLTAR AO HUB DE DISCIPLINAS
        </Link>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontFamily: "Orbitron", fontSize: "28px", fontWeight: 900, margin: 0 }}>Hub Fametro · <span style={{ color: "#3b82f6" }}>SO Quest</span></h1>
            <p style={{ color: "#64748b", margin: "5px 0 0" }}>Aula 05: Gestão de E/S · Ranking em Tempo Real</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "20px", padding: "5px 15px" }}>
              <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e", fontFamily: "Orbitron" }}>LIVE FEED</span>
            </div>
            <button onClick={() => setShowClear(true)} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}>REINICIAR</button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            <div className="rank-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#3b82f6", fontFamily: "Orbitron" }}>{stats.total}</div>
                <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>ALUNOS FINALIZARAM</div>
            </div>
            <div className="rank-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#fbbf24", fontFamily: "Orbitron" }}>{stats.avg}</div>
                <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>PONTUAÇÃO MÉDIA</div>
            </div>
            <div className="rank-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#4ade80", fontFamily: "Orbitron" }}>{stats.p90}</div>
                <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>ARQUITETOS DO KERNEL</div>
            </div>
        </div>

        {/* CONTROLS */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>TODOS</button>
            <button className={`tab-btn ${filter === 'top' ? 'active' : ''}`} onClick={() => setFilter('top')}>TOP 10</button>
        </div>

        {/* TABLE */}
        <div className="rank-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "60px 1fr 120px 100px 140px", 
                padding: "15px 25px", 
                borderBottom: "1px solid rgba(255,255,255,0.05)", 
                background: "rgba(0,0,0,0.2)",
                fontSize: "11px",
                fontWeight: 700,
                color: "#64748b",
                fontFamily: "Orbitron"
            }}>
                <span>#</span>
                <span>ESTUDANTE</span>
                <span style={{ textAlign: "center" }}>SCORE</span>
                <span style={{ textAlign: "center" }}>TEMPO</span>
                <span style={{ textAlign: "right" }}>NÍVEL</span>
            </div>

            {displayed.length === 0 ? (
                <div style={{ padding: "100px 0", textAlign: "center", color: "#64748b" }}>
                    <p style={{ fontFamily: "Orbitron", letterSpacing: "2px" }}>AGUARDANDO TRANSCRIÇÕES DO BARRAMENTO...</p>
                </div>
            ) : (
                displayed.map((entry, idx) => {
                    const rank = entries.indexOf(entry) + 1;
                    const isNew = entry.id === flash;
                    const lvl = getLevel(entry.score);
                    
                    return (
                        <div key={entry.id} className={isNew ? "row-new" : ""} style={{ 
                            display: "grid", 
                            gridTemplateColumns: "60px 1fr 120px 100px 140px", 
                            padding: "18px 25px", 
                            borderBottom: "1px solid rgba(255,255,255,0.03)", 
                            alignItems: "center",
                            background: isNew ? "rgba(59, 130, 246, 0.1)" : "transparent",
                            transition: "background 0.5s",
                            borderLeft: isNew ? "4px solid #3b82f6" : "4px solid transparent"
                        }}>
                             <span style={{ 
                                fontFamily: "Orbitron", 
                                fontSize: rank <= 3 ? "18px" : "14px", 
                                color: rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : rank === 3 ? "#b45309" : "#475569",
                                fontWeight: 700
                             }}>
                                {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : rank}
                             </span>

                             <div>
                                <div style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9" }}>{entry.name}</div>
                                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{timeAgo(entry.timestamp)}</div>
                             </div>

                             <div style={{ textAlign: "center", fontFamily: "Orbitron", fontSize: "18px", fontWeight: 900, color: "#3b82f6" }}>
                                {entry.score}
                             </div>

                             <div style={{ textAlign: "center", fontSize: "13px", color: "#64748b", fontFamily: "monospace" }}>
                                {formatTime(entry.duration)}
                             </div>

                             <div style={{ textAlign: "right" }}>
                                <span style={{ 
                                    fontSize: "10px", 
                                    fontWeight: 700, 
                                    color: lvl.color, 
                                    border: `1px solid ${lvl.color}44`, 
                                    padding: "3px 10px", 
                                    borderRadius: "12px", 
                                    backgroundColor: `${lvl.color}11`,
                                    fontFamily: "Orbitron"
                                }}>
                                    {lvl.icon} {lvl.label}
                                </span>
                             </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* MODAL CLEAR */}
      {showClear && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#0f172a", border: "1px solid #ef4444", borderRadius: "16px", padding: "30px", maxWidth: "400px", textAlign: "center" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>⚠️ Formatar Ranking?</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "25px" }}>Esta ação irá apagar todos os registros de desempenho da Aula 05 permanentemente.</p>
                <div style={{ display: "flex", gap: "15px" }}>
                    <button onClick={() => setShowClear(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "transparent", color: "white", cursor: "pointer" }}>CANCELAR</button>
                    <button onClick={clearRanking} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#ef4444", color: "white", fontWeight: 700, cursor: "pointer" }}>CONFIRMAR</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
