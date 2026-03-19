import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    id: 1,
    points: 10,
    title: "Declaração Simples",
    desc: "Declare uma matriz de inteiros chamada 'm' com 3 linhas e 3 colunas e inicialize todos os elementos com zero usando a sintaxe curta '{0}'. Não use #define.",
    placeholder: "// Digite seu código C aqui\n",
    hint: "Use: tipo nome[linhas][colunas] = {0};",
    keywords: ["int m[3][3]", "= {0}"],
    gabarito: `int m[3][3] = {0};`
  },
  {
    id: 2,
    points: 15,
    title: "Inicialização Explícita",
    desc: "Crie uma matriz 2x2 de inteiros chamada 'valores' contendo os números 10 e 20 na primeira linha, e 30 e 40 na segunda linha.",
    placeholder: "// Inicialize a matriz valores conforme a descrição\n",
    hint: "Use chaves aninhadas: {{10, 20}, {30, 40}}",
    keywords: ["int valores[2][2]", "{10, 20}", "{30, 40}"],
    gabarito: `int valores[2][2] = {{10, 20}, {30, 40}};`
  },
  {
    id: 3,
    points: 20,
    title: "Matriz de Ponto Flutuante",
    desc: "Declare uma matriz de float chamada 'notas' de tamanho 2x3 (2 alunos, 3 notas). Inicialize-a com zeros usando o método simplificado.",
    placeholder: "// Crie a matriz de float aqui\n",
    hint: "Lembre-se: float nome[L][C] = {0};",
    keywords: ["float notas[2][3]", "{0}"],
    gabarito: `float notas[2][3] = {0};`
  },
  {
    id: 4,
    points: 25,
    title: "Atribuição Manual",
    desc: "Declare uma matriz 'int dados[4][4]'. Sem inicializá-la na declaração, atribua o valor 99 especificamente ao elemento da terceira linha, quarta coluna.",
    placeholder: "int dados[4][4];\n// Atribua o valor agora\n",
    hint: "Lembre-se que índices começam em 0. Terceira linha = [2]. Quarta coluna = [3].",
    keywords: ["dados[2][3]", "= 99"],
    gabarito: `int dados[4][4];\ndados[2][3] = 99;`
  },
  {
    id: 5,
    points: 30,
    title: "Preenchimento com Loop For",
    desc: "Escreva dois laços 'for' aninhados para preencher uma matriz 'int matriz[5][5]' previamente declarada com o valor 1 em todas as posições.",
    placeholder: "int matriz[5][5];\nint i, j;\n\n// Escreva os laços aqui\n",
    hint: "Use for(i=0; i<5; i++) { for(j=0; j<5; j++) { matriz[i][j] = 1; } }",
    keywords: ["for", "i < 5", "j < 5", "matriz[i][j] = 1"],
    gabarito: `int matriz[5][5];\nint i, j;\nfor(i=0; i<5; i++) {\n    for(j=0; j<5; j++) {\n        matriz[i][j] = 1;\n    }\n}`
  }
];

const LEVELS = [
  { min: 95, label: "🏗️ ARQUITETO DE MATRIZES", color: "#6366f1", bg: "#0b0f1a", msg: "Você domina a base sólida de AED! Suas matrizes estão perfeitamente estruturadas." },
  { min: 70, label: "💎 EXPERT EM MEMÓRIA", color: "#10B981", bg: "#061a10", msg: "Excelente! Você entende como alocar e inicializar dados manualmente em C." },
  { min: 40, label: "🔧 TÉCNICO AED", color: "#3b82f6", bg: "#101a33", msg: "Bom trabalho! Você já consegue manipular as dimensões das matrizes com facilidade." },
  { min: 0, label: "🌱 RECRUTA DE MATRIZES", color: "#ef4444", bg: "#1a0606", msg: "Continue praticando! A inicialização correta evita 90% dos bugs em C." }
];

function getLevel(score) {
  return LEVELS.find(l => score >= l.min) || LEVELS[LEVELS.length - 1];
}

export default function MatrizesLab() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [currentEx, setCurrentEx] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [scores, setScores] = useState(new Array(STAGES.length).fill(0));
  const [hintsUsed, setHintsUsed] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); 
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [started, currentEx, finished]);

  useEffect(() => {
      if (started && !finished) {
          setUserCode(STAGES[currentEx].placeholder);
          setFeedback(null);
          setShowHint(false);
      }
  }, [currentEx, started, finished]);

  const normalize = (s) => s.replace(/\s+/g, ' ').replace(/\/\/[^\n]*/g,'').replace(/;/g, '').trim().toLowerCase();

  const handleCheck = () => {
    const ex = STAGES[currentEx];
    const code = normalize(userCode);
    const missing = ex.keywords.filter(kw => !code.includes(normalize(kw)));

    if (missing.length === 0) {
      let pts = ex.points;
      if (hintsUsed.has(currentEx)) pts = Math.max(1, Math.floor(pts * 0.5));
      
      const newScores = [...scores];
      newScores[currentEx] = pts;
      setScores(newScores);
      
      setFeedback({ type: 'ok', msg: `Perfeito! Comando C validado. +${pts} pts.` });
    } else {
      setFeedback({ type: 'err', msg: `Código incompleto. Verifique se declarou os tamanhos e atribuiu os valores corretamente.` });
    }
  };

  const handleNext = () => {
    if (currentEx < STAGES.length - 1) {
      setCurrentEx(currentEx + 1);
    } else {
      setFinished(true);
    }
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const level = getLevel(totalScore);

  if (!started) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050a18', color: '#cbd5e1', padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', background: 'rgba(30, 41, 59, 0.5)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔳</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>Matrix <span style={{ color: '#6366f1' }}>Lab</span></h1>
          <p style={{ marginBottom: '2.5rem', lineHeight: 1.6, color: '#94a3b8' }}>Prática Profissional: Inicialização de Matrizes em C sem uso de #define.</p>
          
          <input 
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Seu nome de Dev..."
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #1e2a4a', background: '#0a1025', color: '#fff', marginBottom: '1.5rem', outline: 'none' }}
          />

          <button 
            disabled={!name.trim()}
            onClick={() => setStarted(true)}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: name.trim() ? 'pointer' : 'not-allowed', opacity: name.trim() ? 1 : 0.5 }}
          >
            Iniciar Laboratório
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050a18', color: '#cbd5e1', padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>{name}</h2>
            <div style={{ fontSize: '5rem', fontWeight: 900, color: '#6366f1', fontFamily: 'monospace' }}>{totalScore}</div>
            <div style={{ color: '#94a3b8', marginBottom: '2rem' }}>PONTOS NO LAB</div>
            
            <div style={{ background: level.bg, border: `2px solid ${level.color}`, padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: level.color, marginBottom: '0.5rem', letterSpacing: '2px' }}>{level.label}</div>
                <p style={{ color: '#fff', lineHeight: 1.6 }}>{level.msg}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => window.location.reload()} style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid #1e2a4a', cursor: 'pointer' }}>Refazer Lab</button>
              <Link to="/fametro" style={{ padding: '1rem 2rem', borderRadius: '12px', background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Menu Principal</Link>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050a18', color: '#cbd5e1', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, letterSpacing: '3px' }}>AED LAB · ETAPA {currentEx + 1} / {STAGES.length}</span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '5px 0 0' }}>{STAGES[currentEx].title}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6366f1', fontFamily: 'monospace' }}>{totalScore} xp</div>
                <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '1px' }}>AED-SCORE</div>
            </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2.5rem', borderRadius: '24px', border: '1px solid #1e2a4a', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#e2e8f0', marginBottom: '2rem', borderLeft: '4px solid #6366f1', paddingLeft: '20px' }}>{STAGES[currentEx].desc}</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>// AED EDITOR (Linguagem C)</span>
                <textarea 
                    value={userCode}
                    onChange={e => setUserCode(e.target.value)}
                    disabled={scores[currentEx] > 0}
                    style={{ width: '100%', height: '220px', backgroundColor: '#020617', color: '#6366f1', padding: '1.5rem', borderRadius: '16px', border: '1px solid #1e2a4a', fontFamily: 'monospace', fontSize: '15px', lineHeight: 1.6, outline: 'none', resize: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {scores[currentEx] === 0 ? (
                    <>
                        <button onClick={handleCheck} style={{ padding: '0.8rem 2rem', borderRadius: '12px', background: '#6366f1', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', transition: '0.2s' }}>▶ Compilar e Testar</button>
                        <button onClick={() => { setHintsUsed(prev => new Set(prev).add(currentEx)); setShowHint(true); }} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid #1e2a4a', cursor: 'pointer' }}>💡 Ver Dica (-50% XP)</button>
                    </>
                ) : (
                    <button onClick={handleNext} style={{ padding: '0.8rem 2rem', borderRadius: '12px', background: '#10B981', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Próximo Exercício →</button>
                )}
            </div>

            {showHint && (
                <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8', fontSize: '0.9rem' }}>
                    <strong>SUGESTÃO:</strong> {STAGES[currentEx].hint}
                </div>
            )}

            {feedback && (
                <div style={{ marginTop: '1.5rem', padding: '1.2rem', borderRadius: '12px', background: feedback.type === 'ok' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${feedback.type === 'ok' ? '#10B981' : '#ef4444'}`, color: feedback.type === 'ok' ? '#34d399' : '#fca5a5', fontSize: '0.9rem' }}>
                    {feedback.msg}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
