import React, { useState, useEffect } from "react";

// ─── STAGES ──────────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: 1,
    points: 10,
    badge: "📦",
    title: "Criando a Classe Produto",
    objective: "Declare a classe Produto com os atributos: String nome, double preco, int estoque.",
    context: `Imagine que você foi contratado como dev Jr em uma loja online. 
Sua primeira tarefa: criar a estrutura de dados que representa um Produto no estoque.`,
    placeholder: `// 📦 Etapa 1 — Declare a classe Produto com os 3 atributos
class Produto {

}`,
    hint: "Declare os 3 atributos dentro das chaves: String nome;  double preco;  int estoque;",
    keywords: ["class Produto", "String nome", "double preco", "int estoque"],
    gabarito: `class Produto {
    String nome;
    double preco;
    int estoque;
}`
  },
  {
    id: 2,
    points: 15,
    badge: "🔍",
    title: "Getters — Lendo os Dados",
    objective: "Adicione os métodos getter para os 3 atributos: getNome(), getPreco() e getEstoque().",
    context: `Outros módulos do sistema precisam ler os dados do Produto.
Crie os getters para expor os valores de forma controlada.`,
    placeholder: `class Produto {
    String nome;
    double preco;
    int estoque;

    // 🔍 Etapa 2 — Adicione os 3 métodos get abaixo

}`,
    hint: "String getNome() { return this.nome; } — repita o padrão para preco (double) e estoque (int).",
    keywords: [
      "getNome", "return this.nome",
      "getPreco", "return this.preco",
      "getEstoque", "return this.estoque"
    ],
    gabarito: `class Produto {
    String nome;
    double preco;
    int estoque;

    String getNome() {
        return this.nome;
    }

    double getPreco() {
        return this.preco;
    }

    int getEstoque() {
        return this.estoque;
    }
}`
  },
  {
    id: 3,
    points: 15,
    badge: "✏️",
    title: "Setters — Alterando os Dados",
    objective: "Adicione os métodos setter: setNome(String nome), setPreco(double preco) e setEstoque(int estoque).",
    context: `O sistema de estoque precisa atualizar os dados de um produto já cadastrado.
Os setters permitem alterar os valores de forma segura.`,
    placeholder: `class Produto {
    String nome;
    double preco;
    int estoque;

    // ... (getters já existem)

    // ✏️ Etapa 3 — Adicione os 3 métodos set abaixo

}`,
    hint: "void setNome(String nome) { this.nome = nome; } — use void pois setter não retorna valor.",
    keywords: [
      "setNome", "void", "this.nome = nome",
      "setPreco", "this.preco = preco",
      "setEstoque", "this.estoque = estoque"
    ],
    gabarito: `class Produto {
    String nome;
    double preco;
    int estoque;

    String getNome() { return this.nome; }
    double getPreco() { return this.preco; }
    int getEstoque() { return this.estoque; }

    void setNome(String nome) {
        this.nome = nome;
    }

    void setPreco(double preco) {
        this.preco = preco;
    }

    void setEstoque(int estoque) {
        this.estoque = estoque;
    }
}`
  },
  {
    id: 4,
    points: 20,
    badge: "🏗️",
    title: "Construtor Principal",
    objective: "Adicione o construtor Produto(String nome, double preco, int estoque) que inicializa os 3 atributos.",
    context: `O time quer poder criar um produto já com todos os dados desde o início.
Implemente o construtor que recebe nome, preco e estoque como parâmetros.`,
    placeholder: `class Produto {
    String nome;
    double preco;
    int estoque;

    // 🏗️ Etapa 4 — Escreva o construtor aqui

    // ... (getters e setters já existem)
}`,
    hint: "Produto(String nome, double preco, int estoque) { this.nome = nome; this.preco = preco; this.estoque = estoque; }",
    keywords: [
      "Produto(", "String nome, double preco", "int estoque",
      "this.nome = nome", "this.preco = preco", "this.estoque = estoque"
    ],
    gabarito: `class Produto {
    String nome;
    double preco;
    int estoque;

    Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    String getNome() { return this.nome; }
    double getPreco() { return this.preco; }
    int getEstoque() { return this.estoque; }

    void setNome(String nome) { this.nome = nome; }
    void setPreco(double preco) { this.preco = preco; }
    void setEstoque(int estoque) { this.estoque = estoque; }
}`
  },
  {
    id: 5,
    points: 20,
    badge: "🔎",
    title: "Método toString()",
    objective: "Adicione o método toString() que retorna: \"Produto: \" + nome + \" | Preço: R$ \" + preco + \" | Estoque: \" + estoque.",
    context: `O time de QA precisa imprimir os dados do produto facilmente.
Implemente o toString() para que o println exiba as informações formatadas.`,
    placeholder: `class Produto {
    String nome;
    double preco;
    int estoque;

    // ... (construtor, getters e setters já existem)

    // 🔎 Etapa 5 — Implemente o toString() aqui

}`,
    hint: "String toString() { return \"Produto: \" + nome + \" | Preço: R$ \" + preco + \" | Estoque: \" + estoque; }",
    keywords: [
      "String toString()", "return", "Produto:", "nome",
      "Preço: R$", "preco", "Estoque:", "estoque"
    ],
    gabarito: `class Produto {
    String nome;
    double preco;
    int estoque;

    Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    String getNome() { return this.nome; }
    double getPreco() { return this.preco; }
    int getEstoque() { return this.estoque; }

    void setNome(String nome) { this.nome = nome; }
    void setPreco(double preco) { this.preco = preco; }
    void setEstoque(int estoque) { this.estoque = estoque; }

    String toString() {
        return "Produto: " + nome + " | Preço: R$ " + preco + " | Estoque: " + estoque;
    }
}`
  },
  {
    id: 6,
    points: 25,
    badge: "🚀",
    title: "Instanciando e Usando o Objeto",
    objective: "No método main: crie um objeto Produto usando o construtor, altere o preço para 49.90 via setter e imprima com System.out.println(produto.toString()).",
    context: `Hora de usar tudo que você construiu! 
Crie um produto "Notebook Gamer" com preço 3500.00 e estoque 10, depois atualize o preço e mostre na tela.`,
    placeholder: `public class Main {
    public static void main(String[] args) {
        // 🚀 Etapa 6 — Instancie o produto, use o setter e imprima

    }
}`,
    hint: "Produto p = new Produto(\"Notebook Gamer\", 3500.00, 10); p.setPreco(49.90); System.out.println(p.toString());",
    keywords: [
      "new Produto(", "Notebook Gamer",
      "setPreco", "49.90",
      "System.out.println", "toString()"
    ],
    gabarito: `public class Main {
    public static void main(String[] args) {
        Produto p = new Produto("Notebook Gamer", 3500.00, 10);
        p.setPreco(49.90);
        System.out.println(p.toString());
    }
}`
  }
];

const LEVELS = [
  { min: 95, emoji: "⚡", label: "MESTRE POO", color: "#ffd600", msg: "Domínio completo! Você domina classes, construtores, getters, setters e objetos com maestria." },
  { min: 70, emoji: "🟣", label: "ARQUITETO", color: "#a855f7", msg: "Excelente! Você domina os pilares de criação de objetos em Java." },
  { min: 50, emoji: "🔵", label: "PLENO", color: "#3b82f6", msg: "Muito bom! Você entende os conceitos centrais de classes e métodos." },
  { min: 25, emoji: "🟢", label: "JÚNIOR", color: "#22c55e", msg: "Bom começo! Continue praticando." },
  { min: 0,  emoji: "🔴", label: "INICIANTE", color: "#ef4444", msg: "Todo expert começou assim. Continue com foco!" }
];

function getLevel(score) {
  return LEVELS.find(l => score >= l.min) || LEVELS[LEVELS.length - 1];
}

// ─── MINI PROGRESS BAR ───────────────────────────────────────────────────────
function StageBar({ stages, current, scores }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: "2rem" }}>
      {stages.map((s, i) => {
        const done = scores[i] > 0;
        const active = i === current;
        return (
          <div key={s.id} style={{ flex: 1, height: 6, borderRadius: 3,
            background: done ? "#22c55e" : active ? "#00d4ff" : "rgba(255,255,255,0.08)",
            transition: "background 0.3s",
            boxShadow: active ? "0 0 8px #00d4ff88" : "none"
          }} />
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function POOConstrutoresActivity() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [currentEx, setCurrentEx] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [scores, setScores] = useState(new Array(STAGES.length).fill(0));
  const [hintsUsed, setHintsUsed] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showGabarito, setShowGabarito] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [started, currentEx, finished]);

  useEffect(() => {
    if (started && !finished) {
      setUserCode(STAGES[currentEx].placeholder);
      setFeedback(null);
      setShowHint(false);
      setShowGabarito(false);
    }
  }, [currentEx, started, finished]);

  const normalize = (s) => s.replace(/\s+/g, " ").replace(/\/\/[^\n]*/g, "").trim().toLowerCase();

  const handleCheck = () => {
    const ex = STAGES[currentEx];
    const code = normalize(userCode);
    const missing = ex.keywords.filter(kw => !code.includes(normalize(kw)));

    if (missing.length === 0) {
      let pts = ex.points;
      if (hintsUsed.has(currentEx)) pts = Math.max(1, Math.floor(pts * 0.6));
      if (showGabarito) pts = Math.max(1, Math.floor(pts * 0.3));
      const newScores = [...scores];
      if (newScores[currentEx] === 0) newScores[currentEx] = pts;
      setScores(newScores);
      setFeedback({ type: "ok", msg: `✅ Correto! +${newScores[currentEx]} pontos!` });
    } else {
      setFeedback({ type: "err", msg: `❌ Quase lá! Verifique: ${missing.slice(0, 2).join(", ")}${missing.length > 2 ? "..." : ""}` });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (currentEx < STAGES.length - 1) setCurrentEx(currentEx + 1);
    else setFinished(true);
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = STAGES.reduce((a, s) => a + s.points, 0);
  const pct = Math.round((totalScore / maxScore) * 100);
  const level = getLevel(pct);
  const stage = STAGES[currentEx];

  // ── START SCREEN ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
          * { box-sizing: border-box; }
          .start-input:focus { border-color: #00d4ff !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.15); }
          .start-input { transition: all 0.2s; }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          .float { animation: float 3s ease-in-out infinite; }
        `}</style>

        <div style={{ maxWidth: 640, width: "100%", textAlign: "center" }}>
          <div className="float" style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>☕</div>

          <div style={{ display: "inline-block", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", borderRadius: 8, padding: "4px 14px", fontSize: "0.7rem", letterSpacing: "3px", color: "#00d4ff", fontFamily: "JetBrains Mono", marginBottom: "1.5rem" }}>
            LAB PRÁTICO · POO · FAMETRO 2026.1
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#fff", margin: "0 0 1rem", lineHeight: 1.15, fontFamily: "Inter" }}>
            Classes, Getters, Setters<br />
            <span style={{ background: "linear-gradient(90deg, #00d4ff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>& Construtores em Java</span>
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 2.5rem", fontSize: "1rem" }}>
            6 exercícios práticos progressivos. Você irá construir a classe <strong style={{ color: "#fff" }}>Produto</strong> do zero, etapa por etapa, do atributo ao objeto instanciado.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {[
              { icon: "🎯", label: "6 Etapas", sub: "progressivas" },
              { icon: "⚡", label: "100 pts", sub: "máximo" },
              { icon: "💡", label: "Dicas", sub: "disponíveis" },
              { icon: "📋", label: "Gabarito", sub: "ao final" }
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{s.label}</div>
                <div style={{ color: "#64748b", fontSize: "0.7rem" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem", textAlign: "left" }}>
              Seu nome completo
            </label>
            <input
              className="start-input"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && name.trim().length >= 2 && setStarted(true)}
              placeholder="Digite seu nome..."
              style={{ width: "100%", padding: "1rem 1.2rem", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: "1rem", outline: "none", marginBottom: "1.25rem", fontFamily: "Inter" }}
            />
            <button
              disabled={name.trim().length < 2}
              onClick={() => setStarted(true)}
              style={{
                width: "100%", padding: "1rem", borderRadius: 12, border: "none",
                background: name.trim().length >= 2 ? "linear-gradient(90deg, #00d4ff, #3b82f6)" : "rgba(255,255,255,0.05)",
                color: name.trim().length >= 2 ? "#000" : "#475569",
                fontWeight: 800, fontSize: "1rem", cursor: name.trim().length >= 2 ? "pointer" : "not-allowed",
                transition: "all 0.2s", letterSpacing: "1px"
              }}>
              Iniciar Lab Java →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FINISHED SCREEN ────────────────────────────────────────────────────────
  if (finished) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Inter, system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap'); * { box-sizing: border-box; } @keyframes pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } } .pop { animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }`}</style>

        <div className="pop" style={{ maxWidth: 580, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>{level.emoji}</div>
          <div style={{ color: level.color, fontWeight: 900, fontSize: "1.1rem", letterSpacing: "3px", marginBottom: "0.5rem", fontFamily: "JetBrains Mono" }}>{level.label}</div>
          <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem" }}>{name}</h2>

          <div style={{ margin: "1.5rem 0" }}>
            <div style={{ fontSize: "4rem", fontWeight: 900, color: level.color, fontFamily: "JetBrains Mono", lineHeight: 1 }}>{totalScore}</div>
            <div style={{ color: "#64748b", fontSize: "0.8rem", letterSpacing: "2px" }}>DE {maxScore} PONTOS · {pct}%</div>
          </div>

          {/* Bar */}
          <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 5, overflow: "hidden", margin: "1.5rem 0" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, #00d4ff, ${level.color})`, borderRadius: 5, transition: "width 1s ease", boxShadow: `0 0 12px ${level.color}88` }} />
          </div>

          {/* Score breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "2rem" }}>
            {STAGES.map((s, i) => (
              <div key={s.id} style={{ background: scores[i] > 0 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${scores[i] > 0 ? "#22c55e44" : "#ef444444"}`, borderRadius: 10, padding: "10px" }}>
                <div style={{ fontSize: "1.2rem" }}>{s.badge}</div>
                <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontWeight: 800, color: scores[i] > 0 ? "#4ade80" : "#f87171", fontFamily: "JetBrains Mono" }}>{scores[i]}/{s.points}</div>
              </div>
            ))}
          </div>

          <div style={{ background: `${level.color}18`, border: `1px solid ${level.color}44`, borderRadius: 16, padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ color: "#fff", lineHeight: 1.7, margin: 0 }}>{level.msg}</p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => window.location.reload()} style={{ padding: "0.9rem 2rem", borderRadius: 12, background: "linear-gradient(90deg,#00d4ff,#3b82f6)", color: "#000", fontWeight: 800, border: "none", cursor: "pointer", fontSize: "0.95rem" }}>
              🔄 Refazer Lab
            </button>
            <button onClick={() => window.location.href = "/fametro"} style={{ padding: "0.9rem 2rem", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: "0.95rem" }}>
              🏠 Voltar ao Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)", padding: "2rem 1.5rem", fontFamily: "Inter, system-ui, sans-serif", color: "#cbd5e1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        textarea:focus { outline: none; border-color: rgba(0,212,255,0.4) !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.08); }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .shake { animation: shake 0.4s ease; }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .slide-up { animation: slideUp 0.3s ease; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#00d4ff", fontWeight: 700, letterSpacing: "3px", fontFamily: "JetBrains Mono", marginBottom: 4 }}>
              ETAPA {currentEx + 1} DE {STAGES.length}
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: 900, color: "#fff" }}>
              {stage.badge} {stage.title}
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#00d4ff", fontFamily: "JetBrains Mono", lineHeight: 1 }}>{totalScore}</div>
            <div style={{ fontSize: "0.65rem", color: "#475569", letterSpacing: "2px" }}>DE {maxScore} PTS</div>
          </div>
        </div>

        {/* PROGRESS */}
        <StageBar stages={STAGES} current={currentEx} scores={scores} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem" }}>
          {/* MAIN PANEL */}
          <div>
            {/* Context */}
            <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.65rem", color: "#00d4ff", letterSpacing: "3px", fontFamily: "JetBrains Mono", marginBottom: "0.5rem" }}>CONTEXTO</div>
              <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7, fontSize: "0.9rem", whiteSpace: "pre-line" }}>{stage.context}</p>
            </div>

            {/* Objective */}
            <div style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.65rem", color: "#a855f7", letterSpacing: "3px", fontFamily: "JetBrains Mono", marginBottom: "0.5rem" }}>OBJETIVO</div>
              <p style={{ margin: 0, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.7 }}>{stage.objective}</p>
            </div>

            {/* Code Editor */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", color: "#475569", fontFamily: "JetBrains Mono", letterSpacing: "2px" }}>EDITOR JAVA</span>
                {scores[currentEx] > 0 && (
                  <span style={{ fontSize: "0.7rem", color: "#4ade80", fontFamily: "JetBrains Mono", background: "rgba(34,197,94,0.1)", padding: "2px 10px", borderRadius: 20 }}>✓ CONCLUÍDO</span>
                )}
              </div>
              <textarea
                className={shake ? "shake" : ""}
                value={userCode}
                onChange={e => setUserCode(e.target.value)}
                disabled={scores[currentEx] > 0}
                style={{
                  width: "100%", height: 260,
                  background: "#020817", color: "#e2e8f0",
                  border: `1px solid ${scores[currentEx] > 0 ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 14, padding: "1.25rem",
                  fontFamily: "JetBrains Mono", fontSize: "13px", lineHeight: 1.7,
                  resize: "none", transition: "border-color 0.2s"
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {scores[currentEx] === 0 ? (
                <>
                  <button onClick={handleCheck}
                    style={{ padding: "0.8rem 1.75rem", borderRadius: 10, background: "linear-gradient(90deg,#00d4ff,#3b82f6)", color: "#000", fontWeight: 800, border: "none", cursor: "pointer", fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                    ▶ Verificar
                  </button>
                  <button onClick={() => { setHintsUsed(prev => new Set(prev).add(currentEx)); setShowHint(h => !h); }}
                    style={{ padding: "0.8rem 1.25rem", borderRadius: 10, background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", cursor: "pointer", fontSize: "0.9rem" }}>
                    💡 Dica {hintsUsed.has(currentEx) ? "(ativa)" : "(-40% pts)"}
                  </button>
                  <button onClick={() => setShowGabarito(g => !g)}
                    style={{ padding: "0.8rem 1.25rem", borderRadius: 10, background: "rgba(255,179,0,0.08)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", cursor: "pointer", fontSize: "0.9rem" }}>
                    📋 Gabarito {showGabarito ? "▲" : "▼"} (-70% pts)
                  </button>
                </>
              ) : (
                <button onClick={handleNext}
                  style={{ padding: "0.8rem 1.75rem", borderRadius: 10, background: "#22c55e", color: "#fff", fontWeight: 800, border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
                  {currentEx < STAGES.length - 1 ? "Próxima Etapa →" : "Ver Resultado →"}
                </button>
              )}
            </div>

            {/* Hint */}
            {showHint && (
              <div className="slide-up" style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "rgba(168,85,247,0.08)", borderRadius: 12, border: "1px solid rgba(168,85,247,0.25)", color: "#c4b5fd", fontSize: "0.9rem", lineHeight: 1.7, fontFamily: "JetBrains Mono" }}>
                <strong style={{ color: "#a855f7" }}>DICA:</strong> {stage.hint}
              </div>
            )}

            {/* Gabarito */}
            {showGabarito && (
              <div className="slide-up" style={{ marginTop: "0.75rem", padding: "1rem 1.25rem", background: "rgba(251,191,36,0.05)", borderRadius: 12, border: "1px solid rgba(251,191,36,0.25)" }}>
                <div style={{ fontSize: "0.65rem", color: "#fbbf24", letterSpacing: "2px", fontFamily: "JetBrains Mono", marginBottom: "0.5rem" }}>GABARITO (pontuação reduzida)</div>
                <pre style={{ margin: 0, color: "#e2e8f0", fontFamily: "JetBrains Mono", fontSize: "12px", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>{stage.gabarito}</pre>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className="slide-up" style={{ marginTop: "1rem", padding: "1rem 1.25rem", borderRadius: 12, background: feedback.type === "ok" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${feedback.type === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, color: feedback.type === "ok" ? "#4ade80" : "#fca5a5", fontSize: "0.95rem", fontWeight: 600 }}>
                {feedback.msg}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div>
            {/* Student */}
            <div style={{ background: "rgba(30,41,59,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.6rem", color: "#475569", letterSpacing: "2px", fontFamily: "JetBrains Mono", marginBottom: 6 }}>ALUNO</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{name}</div>
              <div style={{ color: "#3b82f6", fontSize: "0.75rem", fontFamily: "JetBrains Mono", marginTop: 4 }}>FAMETRO · POO 2026.1</div>
            </div>

            {/* Stages list */}
            <div style={{ background: "rgba(30,41,59,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.6rem", color: "#475569", letterSpacing: "2px", fontFamily: "JetBrains Mono", marginBottom: "0.75rem" }}>PROGRESSO</div>
              {STAGES.map((s, i) => {
                const done = scores[i] > 0;
                const active = i === currentEx;
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, marginBottom: 4, background: active ? "rgba(0,212,255,0.06)" : "transparent", border: `1px solid ${active ? "rgba(0,212,255,0.2)" : "transparent"}` }}>
                    <div style={{ fontSize: "0.9rem" }}>{done ? "✅" : active ? "▶️" : "⬜"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.7rem", color: done ? "#4ade80" : active ? "#00d4ff" : "#475569", fontWeight: active ? 700 : 400 }}>{s.title}</div>
                    </div>
                    <div style={{ fontSize: "0.65rem", color: done ? "#4ade80" : "#475569", fontFamily: "JetBrains Mono" }}>{scores[i]}/{s.points}</div>
                  </div>
                );
              })}
            </div>

            {/* Score card */}
            <div style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 14, padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.6rem", color: "#475569", letterSpacing: "2px", fontFamily: "JetBrains Mono", marginBottom: "0.5rem" }}>PONTUAÇÃO</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#00d4ff", fontFamily: "JetBrains Mono", lineHeight: 1 }}>{totalScore}</div>
              <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: 4 }}>de {maxScore} pontos</div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginTop: "0.75rem", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#00d4ff,#a855f7)", borderRadius: 3, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "#00d4ff", marginTop: 4, fontFamily: "JetBrains Mono" }}>{pct}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
