import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, query, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';

const LEVEL_CONFIG = [
  { min: 2200, label: "SOBERANO DE MATRIZES", color: "#FFD700", icon: "🏆" },
  { min: 1600, label: "ARQUITETO DE AED",      color: "#10B981", icon: "🛡️" },
  { min: 1100, label: "ANALISTA DE DADOS",    color: "#6366f1", icon: "💻" },
  { min: 700,  label: "ALGORITMO MASTER",      color: "#FFB300", icon: "🔧" },
  { min: 300,  label: "C-CODER EM MATRIZES",   color: "#FF7675", icon: "⚡" },
  { min: 0,    label: "RECRUTA AED",           color: "#64748B", icon: "🌱" },
];

function getLevel(pts) {
  return LEVEL_CONFIG.find(l => pts >= l.min) || LEVEL_CONFIG[LEVEL_CONFIG.length - 1];
}

function timeAgo(ts) {
  if (!ts) return "agora";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

function formatDuration(ms) {
  if (!ms) return "00:00";
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function MatrizesRanking() {
  const [entries, setEntries] = useState([]);
  const [flash, setFlash] = useState(null);
  const [filter, setFilter] = useState("all");
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
      loaded = loaded.filter(d => d.activityId === "aed_matrizes");
      loaded.sort((a, b) => (b.points - a.points) || (a.duration - b.duration));

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
        .filter(d => d.data().activityId === "aed_matrizes")
        .map(d => deleteDoc(doc(db, "fametro_ranking", d.id)));
      await Promise.all(dels);
      setShowClear(false);
    } catch { }
  }

  const stats = {
    total: entries.length,
    avg: entries.length ? Math.round(entries.reduce((a, b) => a + (b.points || 0), 0) / entries.length) : 0,
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
      background: "#050a18",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      padding: "80px 20px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <Link to="/fametro/aed/matrizes" style={{
        position: 'fixed', top: 20, left: 20, zIndex: 100,
        color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', fontSize: 13
      }}>
        ← Voltar ao Quiz
      </Link>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
           <div style={{ fontSize: 12, letterSpacing: 4, color: "#6366f1", fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'JetBrains Mono' }}>AED · Estrutura de Dados · 2026.1</div>
           <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, margin: 0, background: 'linear-gradient(135deg, #6366f1, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 Ranking — Matrix Quest</h1>
           <p style={{ color: '#94A3B8' }}>Top Performers em Cenários Reais de Matrizes (Estilo ENADE)</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: "Estudantes", value: stats.total, icon: "👤" },
            { label: "Média de XP", value: stats.avg, icon: "⚡" },
            { label: "O Melhor Rank", value: stats.top ? stats.top.name : "—", icon: "🔥" },
          ].map(s => (
            <div key={s.label} style={{ background: '#0a1025', border: '1px solid #1e2a4a', borderRadius: 20, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#6366f1", fontFamily: 'JetBrains Mono' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
           {[{key: 'all', label: 'Todos'}, {key: 'top', label: 'Top 10'}, {key: 'recent', label: 'Recentes'}].map(f => (
             <button key={f.key} onClick={() => setFilter(f.key)} style={{
               background: filter === f.key ? '#6366f1' : '#0a1025',
               color: '#fff', border: '1px solid #1e2a4a', padding: '8px 20px', borderRadius: 12,
               cursor: 'pointer', fontWeight: 700, transition: '0.2s', fontSize: 14
             }}>{f.label}</button>
           ))}
           {entries.length > 0 && (
             <button onClick={() => setShowClear(true)} style={{ marginLeft: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', padding: '8px 16px', borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑 Limpar Resultados</button>
           )}
        </div>

        <div style={{ background: 'rgba(10, 16, 37, 0.8)', border: '1px solid #1e2a4a', borderRadius: 24, overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          {entries.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔳</div>
              <p>Nenhum registro encontrado para AED.</p>
              <Link to="/fametro/aed/matrizes" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>Seja o primeiro a jogar →</Link>
            </div>
          ) : (
            displayed.map((entry, i) => {
              const rank = entries.indexOf(entry) + 1;
              const lvl = getLevel(entry.points || 0);
              const isNew = entry.id === flash;
              return (
                <div key={entry.id} style={{
                  display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px',
                  borderBottom: '1px solid #1e2a4a',
                  background: isNew ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  animation: isNew ? 'slideIn 0.5s ease' : 'none',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 50, background: rank <= 3 ? 'linear-gradient(135deg, #FFD700, #F59E0B)' : '#050a18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: rank <= 3 ? '#000' : '#6366f1', border: '2px solid #1e2a4a' }}>
                    {rank}
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{entry.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'JetBrains Mono' }}>{entry.badge} · {timeAgo(entry.timestamp)}</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 100 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#6366f1", fontFamily: 'JetBrains Mono' }}>{entry.points?.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: '#64748B', letterSpacing: 1 }}>XP AED</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 120 }}>
                     <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: `${lvl.color}22`, color: lvl.color, fontSize: 10, fontWeight: 800, border: `1px solid ${lvl.color}44` }}>
                       {lvl.icon} {lvl.label}
                     </div>
                     <div style={{ fontSize: 9, color: '#64748B', marginTop: 4, fontFamily: 'JetBrains Mono' }}>Tempo: {formatDuration(entry.duration)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {showClear && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: "#0a1025", border: "1px solid #EF4444", borderRadius: 24, padding: 32, maxWidth: 360, textAlign: "center" }}>
            <h3 style={{ margin: "0 0 16px", color: '#fff' }}>Resetar Ranking AED?</h3>
            <p style={{ color: "#94A3B8", marginBottom: 32, fontSize: 14 }}>Esta ação apagará permanentemente todos os resultados do quiz de Matrizes.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowClear(false)} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #1e2a4a", background: "transparent", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Manter</button>
              <button onClick={clearAll} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "#EF4444", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Apagar Tudo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
