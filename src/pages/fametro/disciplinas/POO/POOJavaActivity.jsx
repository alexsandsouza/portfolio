import React, { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    id: 1,
    points: 10,
    title: "Hello World em Java",
    desc: "Escreva uma classe chamada HelloWorld com o método main que imprime na tela: Olá, Mundo!",
    placeholder: "// Digite seu código Java aqui\npublic class HelloWorld {\n    \n}",
    hint: "Use System.out.println(\"Olá, Mundo!\"); dentro do método public static void main(String[] args){}",
    keywords: ["public class HelloWorld", "public static void main", "System.out.println", "Olá, Mundo"],
    gabarito: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Olá, Mundo!");\n    }\n}`
  },
  {
    id: 2,
    points: 15,
    title: "Criando uma Classe",
    desc: "Crie uma classe chamada Pessoa com os seguintes atributos: String nome, int idade, String email.",
    placeholder: "// Crie a classe Pessoa com os atributos indicados\n",
    hint: "class NomeDaClasse { TipoAtributo nomeAtributo; } — use String para texto e int para número inteiro.",
    keywords: ["class Pessoa", "String nome", "int idade", "String email"],
    gabarito: `class Pessoa {\n    String nome;\n    int idade;\n    String email;\n}`
  },
  {
    id: 3,
    points: 15,
    title: "Métodos GET",
    desc: "Adicione à classe Pessoa os três métodos get: getNome(), getIdade(), getEmail().",
    placeholder: "class Pessoa {\n    String nome;\n    int idade;\n    String email;\n\n    // Adicione os métodos get aqui\n\n}",
    hint: "String getNome() { return this.nome; } — o tipo de retorno deve corresponder ao tipo do atributo.",
    keywords: ["getNome", "getIdade", "getEmail", "return this.nome", "return this.idade", "return this.email"],
    gabarito: `class Pessoa {\n    String nome;\n    int idade;\n    String email;\n\n    String getNome() {\n        return this.nome;\n    }\n\n    int getIdade() {\n        return this.idade;\n    }\n\n    String getEmail() {\n        return this.email;\n    }\n}`
  },
  {
    id: 4,
    points: 15,
    title: "Métodos SET",
    desc: "Adicione à classe Pessoa os três métodos set: setNome(String nome), setIdade(int idade), setEmail(String email).",
    placeholder: "class Pessoa {\n    String nome;\n    int idade;\n    String email;\n\n    // Gets de antes + novos Sets\n\n}",
    hint: "void setNome(String nome) { this.nome = nome; } — use void pois set não retorna valor.",
    keywords: ["setNome", "setIdade", "setEmail", "void", "this.nome = nome", "this.idade = idade", "this.email = email"],
    gabarito: `class Pessoa {\n    String nome;\n    int idade;\n    String email;\n\n    String getNome() { return this.nome; }\n    int getIdade() { return this.idade; }\n    String getEmail() { return this.email; }\n\n    void setNome(String nome) {\n        this.nome = nome;\n    }\n\n    void setIdade(int idade) {\n        this.idade = idade;\n    }\n\n    void setEmail(String email) {\n        this.email = email;\n    }\n}`
  },
  {
    id: 5,
    points: 20,
    title: "Método Construtor",
    desc: "Adicione à classe Pessoa um construtor que receba nome, idade e email como parâmetros.",
    placeholder: "class Pessoa {\n    String nome;\n    int idade;\n    String email;\n\n    // Escreva o construtor aqui\n\n    // Gets e Sets...\n}",
    hint: "Pessoa(String nome, int idade, String email) { this.nome = nome; this.idade = idade; this.email = email; }",
    keywords: ["Pessoa(", "String nome, int idade", "String email", "this.nome = nome", "this.idade = idade", "this.email = email"],
    gabarito: `class Pessoa {\n    String nome;\n    int idade;\n    String email;\n\n    Pessoa(String nome, int idade, String email) {\n        this.nome = nome;\n        this.idade = idade;\n        this.email = email;\n    }\n\n    String getNome() { return this.nome; }\n    int getIdade() { return this.idade; }\n    String getEmail() { return this.email; }\n\n    void setNome(String nome) { this.nome = nome; }\n    void setIdade(int idade) { this.idade = idade; }\n    void setEmail(String email) { this.email = email; }\n}`
  },
  {
    id: 6,
    points: 25,
    title: "Instanciando um Objeto",
    desc: "No main da classe Main: Crie um objeto Pessoa chamado 'aluno', mude seu nome para 'João Silva' e imprima os dados via get.",
    placeholder: "public class Main {\n    public static void main(String[] args) {\n        // Crie o objeto Pessoa aqui\n    }\n}",
    hint: "Pessoa aluno = new Pessoa(\"Maria\", 20, \"maria@email.com\"); aluno.setNome(\"João Silva\");",
    keywords: ["new Pessoa(", "aluno.setNome", "João Silva", "aluno.getNome()", "aluno.getIdade()", "aluno.getEmail()", "System.out.println"],
    gabarito: `public class Main {\n    public static void main(String[] args) {\n        Pessoa aluno = new Pessoa("Maria", 20, "maria@email.com");\n        aluno.setNome("João Silva");\n        System.out.println("Nome: " + aluno.getNome());\n        System.out.println("Idade: " + aluno.getIdade());\n        System.out.println("Email: " + aluno.getEmail());\n    }\n}`
  }
];

const LEVELS = [
  { min: 95, label: "⚡ MESTRE POO", color: "#00d4ff", bg: "#0b0f1a", msg: "Domínio completo! Você compreendeu o paradigma orientado a objetos com maestria." },
  { min: 80, label: "🟣 ARQUITETO", color: "#8b5cf6", bg: "#1a1033", msg: "Excelente desempenho! Você domina classes, atributos, getters, setters e construtores." },
  { min: 65, label: "🔵 PLENO", color: "#3b82f6", bg: "#101a33", msg: "Muito bom! Você entende os conceitos centrais de POO." },
  { min: 50, label: "🟢 JÚNIOR", color: "#22c55e", bg: "#061a10", msg: "Bom trabalho! Você já consegue criar objetos e usar métodos." },
  { min: 0, label: "🔴 INICIANTE", color: "#ef4444", bg: "#1a0606", msg: "Continue praticando! Todo grande programador começou batendo cabeça com as classes." }
];

function getLevel(score) {
  return LEVELS.find(l => score >= l.min) || LEVELS[LEVELS.length - 1];
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

export default function POOJavaActivity() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [currentEx, setCurrentEx] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [scores, setScores] = useState(new Array(STAGES.length).fill(0));
  const [hintsUsed, setHintsUsed] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'ok'|'err', msg: string }
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

  const normalize = (s) => s.replace(/\s+/g, ' ').replace(/\/\/[^\n]*/g,'').trim().toLowerCase();

  const handleCheck = () => {
    const ex = STAGES[currentEx];
    const code = normalize(userCode);
    const missing = ex.keywords.filter(kw => !code.includes(normalize(kw)));

    if (missing.length === 0) {
      let pts = ex.points;
      if (hintsUsed.has(currentEx)) pts = Math.max(1, Math.floor(pts * 0.6));
      
      const newScores = [...scores];
      newScores[currentEx] = pts;
      setScores(newScores);
      
      setFeedback({ type: 'ok', msg: `Correto! +${pts} pontos acumulados.` });
    } else {
      setFeedback({ type: 'err', msg: `Quase lá! Falta: ${missing.slice(0, 2).join(', ')}${missing.length > 2 ? '...' : ''}` });
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
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#cbd5e1', padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', background: 'rgba(30, 41, 59, 0.5)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>☕</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>Java POO: <span style={{ color: '#00d4ff' }}>Prática Profissional</span></h1>
          <p style={{ marginBottom: '2.5rem', lineHeight: 1.6 }}>Atividade de codificação direta: Classes, Atributos, Métodos e Construtores no padrão Fametro.</p>
          
          <input 
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Seu nome completo..."
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', marginBottom: '1.5rem', outline: 'none' }}
          />

          <button 
            disabled={!name.trim()}
            onClick={() => setStarted(true)}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: '#00d4ff', color: '#000', fontWeight: 800, fontSize: '1rem', cursor: name.trim() ? 'pointer' : 'not-allowed', opacity: name.trim() ? 1 : 0.5 }}
          >
            Começar Atividade
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#cbd5e1', padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>{name}</h2>
            <div style={{ fontSize: '5rem', fontWeight: 900, color: level.color, fontFamily: 'monospace' }}>{totalScore}</div>
            <div style={{ color: '#94a3b8', marginBottom: '2rem' }}>PONTOS TOTAIS</div>
            
            <div style={{ background: level.bg, border: `2px solid ${level.color}`, padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: level.color, marginBottom: '0.5rem', letterSpacing: '2px' }}>{level.label}</div>
                <p style={{ color: '#fff', lineHeight: 1.6 }}>{level.msg}</p>
            </div>

            <button onClick={() => window.location.reload()} style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Reiniciar Desafio</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#cbd5e1', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
                <span style={{ fontSize: '0.8rem', color: '#00d4ff', fontWeight: 700, letterSpacing: '2px' }}>EXERCÍCIO {currentEx + 1} DE {STAGES.length}</span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{STAGES[currentEx].title}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00d4ff', fontFamily: 'monospace' }}>{totalScore} pts</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ALVO: 100 PTS</div>
            </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1.5rem' }}>{STAGES[currentEx].desc}</p>
            
            <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>EDITOR JAVA</span>
                <textarea 
                    value={userCode}
                    onChange={e => setUserCode(e.target.value)}
                    disabled={scores[currentEx] > 0}
                    style={{ width: '100%', height: '250px', backgroundColor: '#020617', color: '#00d4ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.6, outline: 'none', resize: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {scores[currentEx] === 0 ? (
                    <>
                        <button onClick={handleCheck} style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: '#00d4ff', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>▶ Verificar Código</button>
                        <button onClick={() => { setHintsUsed(prev => new Set(prev).add(currentEx)); setShowHint(true); }} style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>💡 Dica</button>
                    </>
                ) : (
                    <button onClick={handleNext} style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: '#22c55e', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Avançar →</button>
                )}
            </div>

            {showHint && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.3)', color: '#a78bfa', fontSize: '0.9rem' }}>
                    <strong>DICA:</strong> {STAGES[currentEx].hint}
                </div>
            )}

            {feedback && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: feedback.type === 'ok' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${feedback.type === 'ok' ? '#22c55e' : '#ef4444'}`, color: feedback.type === 'ok' ? '#4ade80' : '#fca5a5', fontSize: '0.9rem' }}>
                    {feedback.msg}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
