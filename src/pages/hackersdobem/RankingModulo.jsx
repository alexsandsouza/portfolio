/**
 * RankingModulo.jsx - Componente genérico de ranking para todos os módulos HDB.
 * 
 * Substitui os 12 arquivos ranking_m01.jsx ~ ranking_m12.jsx que tinham 99% do código idêntico.
 * A única diferença entre eles era: moduleId, título, descrição e link de volta.
 * 
 * Uso: <Route path="/hackersdobem/ranking-:modulo" element={<RankingModulo />} />
 */
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import './HackersDoBem.css';
import { Search } from 'lucide-react';

// Configuração centralizada de todos os módulos
const MODULE_CONFIG = {
  m01: { id: "HDB_M01", title: "Ranking Módulo 01", desc: "Princípios de Segurança da Informação", backLabel: "VOLTAR MISSÃO" },
  m02: { id: "HDB_M02", title: "Ranking Módulo 02", desc: "Ameaças, Malwares e Controles", backLabel: "VOLTAR MISSÃO" },
  m03: { id: "HDB_M03", title: "Ranking Módulo 03", desc: "Criptografia e Controle de Acesso", backLabel: "VOLTAR MISSÃO" },
  m04: { id: "HDB_M04", title: "Ranking Módulo 04", desc: "Segurança de Redes e Infraestrutura", backLabel: "VOLTAR MISSÃO" },
  m05: { id: "HDB_M05", title: "Ranking Módulo 05", desc: "Monitoramento e Resposta a Incidentes", backLabel: "VOLTAR MISSÃO" },
  m06: { id: "HDB_M06", title: "Ranking Módulo 06", desc: "Governança e Compliance", backLabel: "VOLTAR MISSÃO" },
  m07: { id: "HDB_M07", title: "Ranking Módulo 07", desc: "Segurança em Cloud Computing", backLabel: "VOLTAR MISSÃO" },
  m08: { id: "HDB_M08", title: "Ranking Módulo 08", desc: "Testes de Invasão e Pentest", backLabel: "VOLTAR MISSÃO" },
  m09: { id: "HDB_M09", title: "Ranking Módulo 09", desc: "Forense Digital e Análise de Evidências", backLabel: "VOLTAR MISSÃO" },
  m10: { id: "HDB_M10", title: "Ranking Módulo 10", desc: "Segurança em Aplicações Web", backLabel: "VOLTAR MISSÃO" },
  m11: { id: "HDB_M11", title: "Ranking Módulo 11", desc: "DevSecOps e Pipeline Seguro", backLabel: "VOLTAR MISSÃO" },
  m12: { id: "HDB_M12", title: "Ranking Módulo 12", desc: "Projeto Final e Certificação", backLabel: "VOLTAR MISSÃO" },
};

function BinaryRain() {
  const [bits, setBits] = useState([]);
  useEffect(() => {
    const newBits = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      duration: 5 + Math.random() * 10 + 's',
      delay: Math.random() * 5 + 's',
      content: Math.random() > 0.5 ? '1' : '0'
    }));
    setBits(newBits);
  }, []);
  return (
    <div className="hdb-binary-rain">
      {bits.map(bit => (
        <div key={bit.id} className="hdb-rain-bit" style={{ left: bit.left, animationDuration: bit.duration, animationDelay: bit.delay }}>{bit.content}</div>
      ))}
    </div>
  );
}

const LEVEL_CONFIG = [
  { min: 90, label: "LENDÁRIO", color: "#FFD700", icon: "👑" },
  { min: 75, label: "ESPECIALISTA", color: "#00E676", icon: "⚡" },
  { min: 60, label: "PROFICIENTE", color: "#40C4FF", icon: "🔷" },
  { min: 40, label: "APRENDIZ", color: "#FFB300", icon: "🔶" },
  { min: 0,  label: "INICIANTE",  color: "#FF5252", icon: "🔰" },
];

function getLevel(score) {
  return LEVEL_CONFIG.find(l => score >= l.min) || LEVEL_CONFIG[4];
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

export default function RankingModulo() {
  const { modulo } = useParams();
  const config = MODULE_CONFIG[modulo];
  
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [flash, setFlash] = useState(null);
  const [filter, setFilter] = useState("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const entriesRef = useRef([]);

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    if (!config) return;
    const q = query(collection(db, "fametro_ranking"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (filter !== "global") {
        loaded = loaded.filter(doc => doc.module === config.id);
      }
      
      loaded.sort((a, b) => (b.score - a.score) || (a.duration - b.duration));
      if (loaded.length > entriesRef.current.length && entriesRef.current.length !== 0) {
        const newest = loaded.filter(e => !entriesRef.current.find(ex => ex.id === e.id));
        if (newest.length > 0) { setFlash(newest[0].id); setTimeout(() => setFlash(null), 3000); }
      }
      setEntries(loaded);
      entriesRef.current = loaded;
    });
    return () => unsubscribe();
  }, [filter, config?.id]);

  // Fallback if module not found (placed after all hook declarations)
  if (!config) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A12', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--hdb-main-font)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>❌</div>
          <h1 style={{ fontSize: 28 }}>Módulo não encontrado</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>O módulo "{modulo}" não existe.</p>
          <Link to="/hackersdobem" style={{ color: '#00FF88', display: 'block', marginTop: 20 }}>← VOLTAR AO HUB</Link>
        </div>
      </div>
    );
  }

  const moduleNum = modulo ? modulo.replace('m', '').toUpperCase() : '';

  const filteredEntries = entries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = entries.slice(0, 3);
  const others = filteredEntries.slice(searchTerm ? 0 : 3);

  return (
    <div className="hdb-scanlines" style={{ minHeight: '100vh', background: '#0A0A12', color: '#fff', padding: '60px 20px', fontFamily: 'var(--hdb-main-font)', position: 'relative', overflow: 'hidden' }}>
      <BinaryRain />
      <div className="hdb-perspective-grid" />
      <div className="hdb-aura-follow" style={{ left: mousePos.x, top: mousePos.y }} />
      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 }}>
          <Link to={`/hackersdobem/atividade-${modulo}`} style={{ color: '#00FF88', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>← {config.backLabel}</Link>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>HACKERS DO BEM · LEADERBOARD</div>
            <h1 style={{ fontSize: 40, fontWeight: 900, textShadow: '0 0 40px rgba(0,255,136,0.2)' }}>{config.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{config.desc}</p>
          </div>
          <div style={{ width: 100 }}></div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 15, marginBottom: 40, justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setFilter("all")} className="hdb-btn-neon" style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid", borderColor: filter === "all" ? "#00FF88" : "rgba(255,255,255,0.1)", background: filter === "all" ? "rgba(0,255,136,0.1)" : "transparent", color: filter === "all" ? "#00FF88" : "#666", cursor: "pointer", fontWeight: 700 }}>MÓDULO {moduleNum}</button>
            <button onClick={() => setFilter("global")} className="hdb-btn-neon" style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid", borderColor: filter === "global" ? "#40C4FF" : "rgba(255,255,255,0.1)", background: filter === "global" ? "rgba(64,196,255,0.1)" : "transparent", color: filter === "global" ? "#40C4FF" : "#666", cursor: "pointer", fontWeight: 700 }}>GLOBAL (TODOS)</button>
          </div>
          
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="text" 
              placeholder="Pesquisar agente..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontSize: 13 }}
            />
          </div>
        </div>

        {/* Podium */}
        {!searchTerm && entries.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 20, marginBottom: 50, padding: '0 20px' }}>
            {/* 2nd place */}
            <div style={{ textAlign: 'center', flex: 1, maxWidth: 150 }}>
              <div style={{ fontSize: 40 }}>🥈</div>
              <div className="hdb-card" style={{ padding: 15, borderRadius: '15px 15px 0 0', borderBottom: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{top3[1].name}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#C0C0C0' }}>{top3[1].score}</div>
              </div>
            </div>
            {/* 1st place */}
            <div style={{ textAlign: 'center', flex: 1, maxWidth: 180 }}>
              <div style={{ fontSize: 60 }}>🥇</div>
              <div className="hdb-card" style={{ padding: '25px 15px', borderRadius: '20px 20px 0 0', borderBottom: 'none', background: 'rgba(255,215,0,0.05) !important' }}>
                <div className="hdb-glow-green" style={{ fontSize: 16, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{top3[0].name}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#FFD700' }}>{top3[0].score}</div>
              </div>
            </div>
            {/* 3rd place */}
            <div style={{ textAlign: 'center', flex: 1, maxWidth: 140 }}>
              <div style={{ fontSize: 35 }}>🥉</div>
              <div className="hdb-card" style={{ padding: 12, borderRadius: '12px 12px 0 0', borderBottom: 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{top3[2].name}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#CD7F32' }}>{top3[2].score}</div>
              </div>
            </div>
          </div>
        )}

        <div className="hdb-card" style={{ background: '#13131A', borderRadius: 24, border: '1px solid #2A2A35', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 140px 140px 180px', padding: '25px', background: 'rgba(255,255,255,0.02)', fontWeight: 900, fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.2)', borderBottom: '1px solid #2A2A35' }}>
            <div>RANK</div><div>AGENTE</div><div style={{ textAlign: 'center' }}>SCORE</div><div style={{ textAlign: 'center' }}>TEMPO</div><div style={{ textAlign: 'center' }}>XP LEVEL</div>
          </div>
          {filteredEntries.length === 0 ? (
            <div style={{ padding: 100, textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: 18 }}>Aguardando submissões...</div>
          ) : (
            others.map((e, index) => {
              const i = searchTerm ? index : index + 3;
              const lvl = getLevel(e.score);
              const isNew = e.id === flash;
              return (
                <div key={e.id} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr 140px 140px 180px', padding: '20px 25px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center',
                  background: isNew ? 'rgba(0,255,136,0.08)' : 'transparent', transition: 'background 0.6s'
                }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.1)' }}>{i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{e.name} {e.module !== config.id && <span style={{ fontSize: 10, color: "rgba(64,196,255,0.5)", fontWeight: 400 }}>[{e.module || "OUTRO"}]</span>}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Concluído há {timeAgo(e.timestamp)}</div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, color: '#00FF88' }}>{e.score}</div>
                  <div style={{ textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{formatTime(e.duration)}</div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ background: `${lvl.color}15`, color: lvl.color, padding: '6px 16px', borderRadius: 30, fontSize: 11, fontWeight: 900, border: `1px solid ${lvl.color}30` }}>{lvl.icon} {lvl.label}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
