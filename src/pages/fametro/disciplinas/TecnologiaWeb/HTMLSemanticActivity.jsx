import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUESTIONS_POOL = [
  {
    category: "CONCEITOS",
    text: "O que significa o termo 'HTML Semântico'?",
    answers: ["HTML com muitos efeitos visuais", "HTML cujas tags descrevem o significado do conteúdo", "HTML que só funciona no Chrome", "HTML sem tags de fechamento"],
    correct: 1,
    feedback: "Semântica refere-se ao significado. Tags semânticas descrevem a função do bloco para navegadores e motores de busca.",
    points: 7
  },
  {
    category: "ESTRUTURA",
    text: "Qual é a função da tag <!DOCTYPE html> no início de um arquivo?",
    answers: ["Definir o título da página", "Declarar ao navegador que o documento é HTML5", "Criar um link para o CSS", "Adicionar um comentário invisível"],
    correct: 1,
    feedback: "A declaração DOCTYPE informa ao navegador a versão do HTML utilizada, garantindo a renderização correta.",
    points: 7
  },
  {
    category: "ACESSIBILIDADE",
    text: "Por que o atributo lang='pt-BR' na tag <html> é importante?",
    answers: ["Para mudar a cor do texto", "Para informar o idioma aos motores de busca e leitores de tela", "Para carregar fontes especiais", "Para traduzir o site automaticamente"],
    correct: 1,
    feedback: "O atributo lang ajuda softwares de acessibilidade (como leitores de tela) a usar a pronúncia correta e auxilia o SEO.",
    points: 7
  },
  {
    category: "METADADOS",
    text: "Onde devem ser inseridas as tags <meta>, <title> e os links para o CSS?",
    answers: ["Dentro da tag <body>", "Dentro da tag <header>", "Dentro da tag <head>", "No final do arquivo, após o </html>"],
    correct: 2,
    feedback: "O <head> contém metadados e informações de configuração que não são visíveis diretamente na página.",
    points: 7
  },
  {
    category: "SEMÂNTICA",
    text: "Qual tag semântica é ideal para conter o logo, nome do site e o menu de navegação principal?",
    answers: ["<main>", "<footer>", "<header>", "<section>"],
    correct: 2,
    feedback: "O <header> é o contêiner para o conteúdo introdutório ou conjunto de links de navegação.",
    points: 7
  },
  {
    category: "NAVEGAÇÃO",
    text: "Qual é a tag específica para agrupar links de navegação?",
    answers: ["<link>", "<a>", "<nav>", "<ul>"],
    correct: 2,
    feedback: "A tag <nav> informa ao navegador e tecnologias assistivas que aquele bloco contém links de navegação.",
    points: 7
  },
  {
    category: "CONTEÚDO",
    text: "Qual tag deve envolver o conteúdo central e único de uma página, excluindo cabeçalhos e rodapés repetidos?",
    answers: ["<section>", "<body>", "<main>", "<article>"],
    correct: 2,
    feedback: "A tag <main> deve conter o conteúdo principal da página, que é exclusivo para esse documento.",
    points: 7
  },
  {
    category: "ORGANIZAÇÃO",
    text: "Para que serve a tag <section> no HTML5?",
    answers: ["Para criar um botão", "Para definir um bloco de conteúdo temático (ex: Sobre, Contato)", "Para inserir uma imagem lateral", "Para formatar o texto em negrito"],
    correct: 1,
    feedback: "<section> representa uma seção genérica de conteúdo temático, geralmente com um título.",
    points: 7
  },
  {
    category: "COMPONENTES",
    text: "Qual a diferença entre <article> e <section>?",
    answers: ["Não há diferença", "<article> é para conteúdo independente que faz sentido sozinho; <section> é para partes de um todo", "<section> é sempre maior que <article>", "Article só pode ser usado em blogs"],
    correct: 1,
    feedback: "Um <article> deve ser independente e distribuível (ex: um post, um card de produto).",
    points: 7
  },
  {
    category: "COMPLEMENTAR",
    text: "Qual tag é usada para conteúdos relacionados ao conteúdo principal, como barras laterais ou glossários?",
    answers: ["<aside>", "<section>", "<div>", "<nav>"],
    correct: 0,
    feedback: "<aside> representa uma seção da página com conteúdo que é indiretamente relacionado ao conteúdo ao redor.",
    points: 7
  },
  {
    category: "RODAPÉ",
    text: "Onde geralmente inserimos informações de copyright e links para redes sociais?",
    answers: ["No <header>", "Na <section>", "No <footer>", "Dentro do <main>"],
    correct: 2,
    feedback: "O <footer> define o rodapé de um documento ou seção.",
    points: 7
  },
  {
    category: "CODIFICAÇÃO",
    text: "Qual metatag garante que acentos e caracteres especiais sejam exibidos corretamente?",
    answers: ["<meta name='viewport'>", "<meta charset='UTF-8'>", "<title>", "<html lang='pt'>"],
    correct: 1,
    feedback: "A codificação UTF-8 cobre quase todos os caracteres e símbolos do mundo.",
    points: 7
  },
  {
    category: "RESPONSIVIDADE",
    text: "O que a tag <meta name='viewport' content='width=device-width, initial-scale=1.0'> faz?",
    answers: ["Aumenta a velocidade do site", "Faz a página se adaptar ao tamanho da tela de dispositivos móveis", "Esconde a página em celulares", "Muda a cor do navegador"],
    correct: 1,
    feedback: "Ela é essencial para o design responsivo, controlando como a página é exibida em telas menores.",
    points: 7
  },
  {
    category: "VALIDAÇÃO",
    text: "Qual ferramenta online é recomendada para verificar se o seu código HTML possui erros de sintaxe?",
    answers: ["Google Search", "W3C Validator", "ChatGPT", "Facebook Developers"],
    correct: 1,
    feedback: "O validador da W3C verifica a conformidade do código com os padrões oficiais.",
    points: 7
  },
  {
    category: "COMENTÁRIOS",
    text: "Como se escreve um comentário no código HTML?",
    answers: ["// isto é um comentário", "/* isto é um comentário */", "<!-- isto é um comentário -->", "# isto é um comentário"],
    correct: 2,
    feedback: "Comentários HTML são usados para documentar o código e não são exibidos no navegador.",
    points: 6
  },
  {
    category: "GIT",
    text: "Qual comando Git é usado para salvar permanentemente as alterações no repositório local?",
    answers: ["git add", "git commit -m 'mensagem'", "git push", "git init"],
    correct: 1,
    feedback: "O commit cria um ponto na história do projeto com as mudanças atuais.",
    points: 6
  },
  {
    category: "GIT",
    text: "Para que serve o comando git push?",
    answers: ["Apagar o projeto", "Enviar os commits locais para o servidor remoto (ex: GitHub)", "Criar uma nova pasta", "Instalar o VS Code"],
    correct: 1,
    feedback: "Push 'empurra' suas alterações para o repositório remoto.",
    points: 6
  },
  {
    category: "GITHUB",
    text: "O que é o GitHub Pages?",
    answers: ["Um editor de código online", "Um serviço para hospedar e publicar sites estáticos gratuitamente", "Uma rede social para designers", "Um buscador de códigos"],
    correct: 1,
    feedback: "O GitHub Pages permite hospedar sites diretamente de um repositório GitHub.",
    points: 6
  },
  {
    category: "GIT",
    text: "Antes de fazer um commit, qual comando é usado para preparar os arquivos (colocar no staging)?",
    answers: ["git start", "git save", "git add .", "git go"],
    correct: 2,
    feedback: "git add prepara as modificações para serem incluídas no próximo commit.",
    points: 6
  },
  {
    category: "ESTRUTURA",
    text: "No VS Code, qual extensão é usada para abrir o site no navegador e atualizar automaticamente ao salvar?",
    answers: ["Live Server", "Auto Save", "HTML Preview", "Browser Sync"],
    correct: 0,
    feedback: "Live Server cria um servidor local que recarrega a página automaticamente a cada salvamento.",
    points: 6
  }
];

const BADGES = [
  { id: 'first_blood', emoji: '🎯', name: 'Primeiro Acerto', desc: 'Acertou a primeira questão', condition: (s) => s.firstCorrect },
  { id: 'consistency', emoji: '🔥', name: 'Em Chamas', desc: '3 acertos consecutivos', condition: (s) => s.streak >= 3 },
  { id: 'half_way', emoji: '⚡', name: 'Na Metade', desc: 'Completou 7 questões', condition: (s) => s.answered >= 7 },
  { id: 'perfectionist', emoji: '💎', name: 'Perfeccionista', desc: '100% de acertos até agora', condition: (s) => s.answered > 0 && s.correct === s.answered },
  { id: 'speed_demon', emoji: '🚀', name: 'Speed Demon', desc: 'Respondeu em menos de 10s', condition: (s) => s.fastAnswer },
  { id: 'champion', emoji: '🏆', name: 'Campeão', desc: 'Completou o quiz', condition: (s) => s.finished },
];

const CATEGORY_COLORS = {
  "CONCEITOS": "#E44D26",
  "ESTRUTURA": "#1572B6",
  "ACESSIBILIDADE": "#F7DF1E",
  "METADADOS": "#61DAFB",
  "SEMÂNTICA": "#E44D26",
  "NAVEGAÇÃO": "#1572B6",
  "CONTEÚDO": "#E44D26",
  "ORGANIZAÇÃO": "#1572B6",
  "RODAPÉ": "#1572B6",
  "CODIFICAÇÃO": "#61DAFB",
  "GIT": "#F05032",
  "GITHUB": "#181717",
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function QMap({ results, current, total }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => {
        let bg = 'rgba(255,255,255,0.05)';
        let border = 'rgba(255,255,255,0.1)';
        let color = 'rgba(255,255,255,0.3)';
        if (i === current) { border = '#E44D26'; color = '#E44D26'; bg = 'rgba(228,77,38,0.1)'; }
        else if (results[i] !== undefined) {
          if (results[i]) { bg = 'rgba(39,174,96,0.25)'; border = '#27AE60'; color = '#27AE60'; }
          else { bg = 'rgba(192,57,43,0.25)'; border = '#C0392B'; color = '#C0392B'; }
        }
        return (
          <div key={i} style={{
            width: 24, height: 24, borderRadius: 4, border: `1px solid ${border}`,
            background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color, transition: 'all 0.2s'
          }}>{i + 1}</div>
        );
      })}
    </div>
  );
}

function BadgesGrid({ earned }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {BADGES.map(b => (
        <div key={b.id} title={b.desc} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '10px 6px', background: 'rgba(255,255,255,0.03)', border: `1px solid`,
          borderColor: earned.includes(b.id) ? '#F5A623' : 'rgba(255,255,255,0.08)',
          borderRadius: 8, opacity: earned.includes(b.id) ? 1 : 0.3,
          filter: earned.includes(b.id) ? 'none' : 'grayscale(1)',
          transition: 'all 0.4s', boxShadow: earned.includes(b.id) ? '0 0 12px rgba(245,166,35,0.3)' : 'none',
          animation: earned.includes(b.id) ? 'badgePop 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)' : 'none'
        }}>
          <span style={{ fontSize: 22 }}>{b.emoji}</span>
          <span style={{ fontSize: 9, color: earned.includes(b.id) ? '#F5A623' : '#6B6B7F', textAlign: 'center', fontFamily: 'monospace' }}>{b.name}</span>
        </div>
      ))}
    </div>
  );
}

function Leaderboard({ list, myName }) {
  const sorted = [...list].sort((a, b) => b.score - a.score).slice(0, 5);
  const rankColors = ['#F5A623', '#C0C0C8', '#CD7F32', null, null];
  const rankSymbols = ['①', '②', '③', '4', '5'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {sorted.map((p, i) => (
        <div key={p.name + i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
          background: p.name === myName ? 'rgba(228,77,38,0.15)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${p.name === myName ? '#E44D26' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 8, fontSize: 12, transition: 'all 0.3s'
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: rankColors[i] || 'rgba(255,255,255,0.3)', minWidth: 20 }}>{rankSymbols[i]}</span>
          <span style={{ flex: 1, fontWeight: p.name === myName ? 700 : 400, color: p.name === myName ? '#fff' : 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.name === myName ? '▶ ' + p.name : p.name}
          </span>
          <span style={{ fontFamily: 'monospace', color: '#F5A623', fontWeight: 700 }}>{p.score}</span>
        </div>
      ))}
    </div>
  );
}

// ─── INTRO ────────────────────────────────────────────────────────────────────

function Intro({ onStart }) {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F5',
      fontFamily: "'Syne', sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(228,77,38,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(21,114,182,0.05) 0%, transparent 50%)',
      width: '100%', boxSizing: 'border-box'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes pulseBorder { 0%,100%{border-color:#E44D26;box-shadow:none} 50%{border-color:#ff7d5e;box-shadow:0 0 20px rgba(228,77,38,0.4)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes grid-move { from{background-position:0 0} to{background-position:40px 40px} }
        
        @media (max-width: 768px) {
          .title-quest { font-size: 38px !important; }
          .subtitle-quest { font-size: 11px !important; }
          .input-quest { padding: 14px 20px !important; font-size: 14px !important; }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Hub button */}
      <Link to="/fametro" style={{
        position: 'fixed', top: 20, left: 20, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 1,
        color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px',
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)',
        transition: 'all 0.2s', borderRadius: 8
      }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(228,77,38,0.6)'; e.currentTarget.style.background = 'rgba(228,77,38,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        ← HUB FAMETRO
      </Link>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, width: '100%', animation: 'fadeInUp 0.6s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#E44D26', border: '1px solid #E44D26', padding: '6px 12px', marginBottom: 24, animation: 'pulseBorder 2s infinite', borderRadius: 4 }}>
          FAMETRO · Sistemas de Informação · Tecnologia Web I
        </div>

        <h1 className="title-quest" style={{ 
          fontSize: 'clamp(32px, 6vw, 62px)', 
          fontWeight: 900, 
          lineHeight: '1.1', 
          letterSpacing: '-0.03em', 
          marginBottom: 12, 
          margin: '0 auto 12px',
          background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          textTransform: 'uppercase',
          maxWidth: '90%'
        }}>
          SEMANTIC<span style={{ background: 'linear-gradient(135deg, #E44D26 0%, #ff7d5e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QUEST</span>
        </h1>

        <div className="subtitle-quest" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 40, textAlign: 'center' }}>
          // HTML5 Semântico, Estrutura e Controle de Versão (Git)
        </div>

        {/* Difficulty Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, width: '100%', maxWidth: 700, marginBottom: 48 }}>
          {[
            { v: '15', l: 'Questões', i: '📋' },
            { v: '100', l: 'Pontos Max', i: '💎' },
            { v: '3min', l: 'p/ Questão', i: '⏱️' },
            { v: '6', l: 'Badges', i: '🏅' }
          ].map((item) => (
            <div key={item.l} style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(228,77,38,0.15)', 
              padding: '24px 16px', 
              textAlign: 'center', 
              position: 'relative', 
              overflow: 'hidden', 
              borderRadius: 20, 
              transition: 'transform 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #E44D26, transparent)' }} />
              <div style={{ fontSize: 20, marginBottom: 4 }}>{item.i}</div>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff', display: 'block', fontFamily: "'Syne', sans-serif" }}>{item.v}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: 1.5, color: '#E44D26', textTransform: 'uppercase' }}>{item.l}</span>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
          <div style={{ marginBottom: 10, fontSize: 10, letterSpacing: 3, color: 'rgba(228,77,38,0.8)', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>Identificação do Aluno</div>
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Nome ou Matrícula"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && onStart(name.trim())}
              maxLength={30}
              className="input-quest"
              style={{
                width: '100%', 
                background: 'rgba(255,255,255,0.03)', 
                border: '2px solid rgba(228,77,38,0.2)',
                borderRadius: 16, 
                padding: '20px 24px', 
                color: '#fff', 
                fontSize: 16,
                fontWeight: 600,
                outline: 'none', 
                transition: 'all 0.3s', 
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#E44D26'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(228,77,38,0.2)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
            />
          </div>

          <button
            onClick={() => name.trim() && onStart(name.trim())}
            disabled={!name.trim()}
            style={{
              width: '100%',
              padding: '20px', 
              borderRadius: 16, 
              border: 'none',
              background: name.trim() ? 'linear-gradient(135deg, #E44D26 0%, #A83212 100%)' : 'rgba(255,255,255,0.05)',
              color: name.trim() ? '#fff' : 'rgba(255,255,255,0.2)',
              fontFamily: "'Syne', sans-serif",
              fontSize: 16, 
              fontWeight: 800, 
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              textTransform: 'uppercase', 
              letterSpacing: 4, 
              transition: 'all 0.4s',
              boxShadow: name.trim() ? '0 10px 30px rgba(228,77,38,0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12
            }}
            onMouseEnter={e => { if(name.trim()) e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
            onMouseLeave={e => { if(name.trim()) e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
          >
            {name.trim() ? '⚡' : '🔒'} INICIAR DESAFIO
          </button>
        </div>

        <div style={{ marginTop: 40, fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>
          VERSÃO 1.0.4 · DATA_SYNC: ENABLED
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────

function Quiz({ playerName, onFinish }) {
  const [questions] = useState(() => {
    return [...QUESTIONS_POOL].sort(() => Math.random() - 0.5).slice(0, 15);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [firstCorrect, setFirstCorrect] = useState(false);
  const [fastAnswer, setFastAnswer] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [qResults, setQResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notification, setNotification] = useState(null);
  const [pointsFlash, setPointsFlash] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [leaderboard] = useState(() => {
    const fakes = [
      { name: 'Ana Web', score: 0 },
      { name: 'Marcos Dev', score: 0 },
      { name: 'Bruna CSS', score: 0 },
      { name: 'Diego Git', score: 0 },
    ];
    fakes.push({ name: playerName, score: 0, isMe: true });
    return fakes.sort(() => Math.random() - 0.5);
  });
  const [lbScores, setLbScores] = useState(() => {
    const obj = {};
    leaderboard.forEach(p => { obj[p.name] = 0; });
    return obj;
  });

  const timerRef = useRef(null);
  const fakeRef = useRef(null);

  // Question Timer
  useEffect(() => {
    if (showFeedback) {
      clearInterval(timerRef.current);
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
      setTotalDuration(d => d + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQ, showFeedback]);

  // Fake players updates
  useEffect(() => {
    fakeRef.current = setInterval(() => {
      setLbScores(prev => {
        const next = { ...prev };
        leaderboard.forEach(p => {
          if (!p.isMe && Math.random() < 0.2) {
            next[p.name] = Math.min(100, (next[p.name] || 0) + (Math.random() < 0.7 ? 7 : 0));
          }
        });
        return next;
      });
    }, 10000);
    return () => clearInterval(fakeRef.current);
  }, []);

  function handleTimeOut() {
    if (showFeedback) return;
    selectAnswer(-1); // Special value for timeout
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function selectAnswer(index) {
    if (showFeedback) return;
    const elapsed = (Date.now() - qStartTime) / 1000;
    const q = questions[currentQ];
    const isCorrect = index === q.correct;

    setSelectedAnswer(index);
    setShowFeedback(true);

    const newAnswered = answered + 1;
    const newCorrect = isCorrect ? correct + 1 : correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    const newScore = isCorrect ? score + q.points : score;
    const newFast = elapsed < 10 ? true : fastAnswer;
    const newFirstCorrect = isCorrect ? true : firstCorrect;

    setAnswered(newAnswered);
    setCorrect(newCorrect);
    setStreak(newStreak);
    setScore(newScore);
    setFastAnswer(newFast);
    if (isCorrect) setFirstCorrect(true);

    setQResults(prev => [...prev, isCorrect]);
    setLbScores(prev => ({ ...prev, [playerName]: newScore }));

    if (isCorrect) setPointsFlash(`+${q.points}`);

    // Check badges
    const state = {
      answered: newAnswered, correct: newCorrect, streak: newStreak,
      firstCorrect: newFirstCorrect, fastAnswer: newFast, finished: false
    };
    checkBadges(state, earnedBadges);

    playSound(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => setPointsFlash(null), 1300);
  }

  function checkBadges(state, current) {
    const newOnes = BADGES.filter(b => !current.includes(b.id) && b.id !== 'champion' && b.condition(state));
    if (newOnes.length > 0) {
      const updated = [...current, ...newOnes.map(b => b.id)];
      setEarnedBadges(updated);
      newOnes.forEach(b => {
        showNotif(`🏅 Conquista!`, `${b.emoji} ${b.name} — ${b.desc}`);
      });
    }
  }

  function showNotif(title, body) {
    setNotification({ title, body });
    setTimeout(() => setNotification(null), 3800);
  }

  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
      }
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }

  function nextQuestion() {
    if (currentQ + 1 >= questions.length) {
      handleFinish();
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(180);
      setQStartTime(Date.now());
    }
  }

  function handleFinish() {
    clearInterval(timerRef.current);
    clearInterval(fakeRef.current);
    const finalBadges = [...earnedBadges, 'champion'];
    setEarnedBadges(finalBadges);
    onFinish({ 
      score, 
      answered, 
      correct, 
      earnedBadges: finalBadges, 
      duration: totalDuration * 1000, 
      lbScores: { ...lbScores, [playerName]: score } 
    });
  }

  const q = questions[currentQ];
  const pct = Math.round((currentQ / questions.length) * 100);
  const timerDanger = timeLeft <= 30;
  const timerWarning = timeLeft <= 60;
  const catColor = CATEGORY_COLORS[q.category] || '#E44D26';
  const letters = ['A', 'B', 'C', 'D'];

  const lbList = leaderboard.map(p => ({ name: p.name, score: lbScores[p.name] || 0, isMe: p.isMe }));

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F5', fontFamily: "'Syne', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: '#13131A', borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16,
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>
            SEMANTIC<span style={{ color: '#E44D26' }}>QUEST</span>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)', display: 'none' }} />
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600,
            color: timerDanger ? '#E44D26' : timerWarning ? '#F5A623' : '#F0F0F5',
            animation: timerDanger ? 'blink 0.5s infinite' : timerWarning ? 'blink 1s infinite' : 'none',
          }}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div style={{ 
          flex: '1 1 200px', 
          maxWidth: 400,
          order: { base: 3, md: 0 } 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#6B6B7F', marginBottom: 2 }}>
            <span>Q {currentQ + 1} / {questions.length}</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#E44D26', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: '#F5A623', fontWeight: 600 }}>
            ⬡ {score} pts
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6B6B7F', display: 'none' }}>{playerName}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Question */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: catColor, textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 1, background: catColor }} />
            {q.category}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 72, fontWeight: 700, color: 'rgba(255,255,255,0.04)', lineHeight: 1, marginBottom: -20 }}>
            {String(currentQ + 1).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 700, lineHeight: 1.4, marginBottom: 32, color: '#F0F0F5' }}>
            {q.text}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {q.answers.map((ans, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectAnswer = i === q.correct;
              let borderColor = 'rgba(255,255,255,0.07)';
              let bgColor = '#13131A';
              let animation = 'none';

              if (showFeedback) {
                if (isCorrectAnswer) { borderColor = '#27AE60'; bgColor = 'rgba(39,174,96,0.15)'; animation = isSelected ? 'correctFlash 0.4s ease' : 'none'; }
                else if (isSelected) { borderColor = '#E44D26'; bgColor = 'rgba(228,77,38,0.15)'; animation = 'shake 0.4s ease'; }
              } else if (isSelected) {
                borderColor = '#E44D26'; bgColor = 'rgba(228,77,38,0.1)';
              }

              return (
                <button key={i} onClick={() => selectAnswer(i)} disabled={showFeedback}
                  style={{
                    background: bgColor, border: `1px solid ${borderColor}`, color: '#F0F0F5',
                    fontFamily: "'Syne', sans-serif", fontSize: 15, padding: '18px 20px',
                    cursor: showFeedback ? 'not-allowed' : 'pointer', textAlign: 'left',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: 14,
                    animation, opacity: showFeedback && !isCorrectAnswer && !isSelected ? 0.7 : 1
                  }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: showFeedback ? (isCorrectAnswer ? '#27AE60' : isSelected ? '#E44D26' : '#E44D26') : '#E44D26', minWidth: 20, flexShrink: 0 }}>{letters[i]}</span>
                  <span>{ans}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div style={{
              marginTop: 20, padding: '16px 20px', borderLeft: `3px solid ${selectedAnswer === q.correct ? '#27AE60' : '#E44D26'}`,
              background: selectedAnswer === q.correct ? 'rgba(39,174,96,0.06)' : 'rgba(228,77,38,0.06)',
              fontSize: 14, lineHeight: 1.6, color: '#ccc', animation: 'fadeInUp 0.3s ease'
            }}>
              {selectedAnswer === -1 ? "Tempo esgotado! " : ""}{q.feedback}
            </div>
          )}

          {showFeedback && (
            <button onClick={nextQuestion} style={{
              marginTop: 20, background: 'transparent', border: '1px solid #E44D26', color: '#E44D26',
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', padding: '12px 32px', cursor: 'pointer', transition: 'all 0.2s',
              animation: 'fadeInUp 0.3s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E44D26'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E44D26'; }}>
              {currentQ + 1 >= questions.length ? 'VER RESULTADO →' : 'PRÓXIMA →'}
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: '100%', maxWidth: { base: 'none', lg: '280px' }, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {/* Minimap */}
            <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 16, borderRadius: 12 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#6B6B7F', textTransform: 'uppercase', marginBottom: 12 }}>Progresso</div>
              <QMap results={qResults} current={currentQ} total={questions.length} />
            </div>

            {/* Badges */}
            <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 16, borderRadius: 12 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#6B6B7F', textTransform: 'uppercase', marginBottom: 12 }}>Conquistas</div>
              <BadgesGrid earned={earnedBadges} />
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 16, borderRadius: 12 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#6B6B7F', textTransform: 'uppercase', marginBottom: 12 }}>Placar</div>
            <Leaderboard list={lbList} myName={playerName} />
          </div>
        </div>
      </div>

      {/* Points flash */}
      {pointsFlash && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 700, color: '#F5A623',
          pointerEvents: 'none', zIndex: 9999, animation: 'pointsUp 1.2s ease forwards'
        }}>{pointsFlash}</div>
      )}

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: 80, right: 24, background: '#13131A', border: '1px solid #F5A623',
          borderLeft: '4px solid #F5A623', padding: '14px 20px', zIndex: 1000, maxWidth: 280,
          animation: 'slideInRight 0.4s ease', boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🏅 {notification.title}</div>
          <div style={{ fontSize: 12, color: '#6B6B7F', fontFamily: "'JetBrains Mono', monospace" }}>{notification.body}</div>
        </div>
      )}
    </div>
  );
}

// ─── RESULT ───────────────────────────────────────────────────────────────────

function getClassification(score) {
  if (score >= 90) return { emoji: '🏆', title: 'EXCELÊNCIA', level: 'MASTER DEVELOPER', role: 'Full Stack Architect', color: '#F5A623', desc: 'Domínio excepcional do HTML5 Semântico e Git. Suas bases para o desenvolvimento web profissional são sólidas.' };
  if (score >= 75) return { emoji: '⭐', title: 'DISTINÇÃO', level: 'ADVANCED DEV', role: 'Front-End Engineer Sr.', color: '#9B59B6', desc: 'Ótimo desempenho! Você demonstra forte compreensão dos padrões modernos da web e versionamento.' };
  if (score >= 60) return { emoji: '✅', title: 'APROVADO', level: 'SOLID DEV', role: 'Front-End Developer', color: '#2980B9', desc: 'Bom trabalho! Você compreende bem a estrutura semântica. Pratique mais Git para chegar ao próximo nível.' };
  if (score >= 40) return { emoji: '📚', title: 'EM DESENVOLVIMENTO', level: 'JUNIOR DEV', role: 'Web Intern', color: '#F5A623', desc: 'Você está no caminho certo. Revise as tags de organização (<main>, <section>, <article>) e comandos Git.' };
  return { emoji: '🔄', title: 'PRECISA REVISAR', level: 'BEGINNER', role: 'Web Student', color: '#E44D26', desc: 'Não desanime! Revise o material da Aula 00 e 01 e tente novamente. A prática leva à perfeição.' };
}

function Result({ playerName, data }) {
  const cls = getClassification(data.score);
  const totalQuestions = 15;
  const accuracy = Math.round((data.correct / totalQuestions) * 100);

  function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}m ${rs}s`;
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F5',
      fontFamily: "'Syne', sans-serif", padding: '60px 24px', display: 'flex',
      flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      backgroundImage: 'radial-gradient(ellipse at center, rgba(228,77,38,0.08) 0%, transparent 70%)'
    }}>
      <div style={{ maxWidth: 800, animation: 'fadeInUp 0.6s ease' }}>
        <div style={{ fontSize: 80, marginBottom: 24, animation: 'badgePop 0.8s' }}>{cls.emoji}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 4, color: cls.color, fontWeight: 700, marginBottom: 12 }}>{cls.level}</div>
        <h2 style={{ fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1 }}>{cls.title}</h2>
        <p style={{ fontSize: 18, color: '#6B6B7F', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6 }}>{cls.desc}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 48 }}>
          {[
            ['PONTUAÇÃO', data.score, '#E44D26'],
            ['ACERTOS', `${data.correct}/${totalQuestions}`, '#27AE60'],
            ['PRECISÃO', `${accuracy}%`, '#2980B9'],
            ['TEMPO TOTAL', formatDuration(data.duration), '#F5A623']
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: '24px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6B6B7F', letterSpacing: 2, marginBottom: 8 }}>{l}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 32, marginBottom: 48, textAlign: 'left' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6B6B7F', letterSpacing: 2, marginBottom: 24, textTransform: 'uppercase' }}>Conquistas Desbloqueadas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {BADGES.map(b => (
              <div key={b.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                background: data.earnedBadges.includes(b.id) ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: `1px solid ${data.earnedBadges.includes(b.id) ? '#C0392B' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: 12, opacity: data.earnedBadges.includes(b.id) ? 1 : 0.2,
                filter: data.earnedBadges.includes(b.id) ? 'none' : 'grayscale(1)', transition: 'all 0.3s'
              }}>
                <span style={{ fontSize: 24 }}>{b.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: data.earnedBadges.includes(b.id) ? '#fff' : '#6B6B7F' }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: '#6B6B7F' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} style={{
            background: 'white', color: '#0A0A0F', border: 'none',
            fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800,
            padding: '16px 40px', cursor: 'pointer', transition: 'all 0.2s'
          }}>TENTAR NOVAMENTE</button>
          <Link to="/fametro/tecnologia-web/html-semantico/ranking" style={{
            background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800,
            padding: '16px 40px', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none'
          }}>VER RANKING GLOBAL</Link>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function HTMLSemanticActivity() {
  const [gameState, setGameState] = useState('intro'); // intro, quiz, result
  const [playerName, setPlayerName] = useState('');
  const [resultData, setResultData] = useState(null);

  async function handleStart(name) {
    setPlayerName(name);
    setGameState('quiz');
  }

  async function handleFinish(data) {
    setResultData(data);
    setGameState('result');

    // Save to Firebase
    try {
      await addDoc(collection(db, "fametro_ranking"), {
        activityId: "tecnologia_web_html_semantico",
        name: playerName,
        score: data.score,
        duration: data.duration,
        correct: data.correct,
        answered: data.answered,
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error saving score:", e);
    }
  }

  if (gameState === 'intro') return <Intro onStart={handleStart} />;
  if (gameState === 'quiz') return <Quiz playerName={playerName} onFinish={handleFinish} />;
  if (gameState === 'result') return <Result playerName={playerName} data={resultData} />;
  return null;
}
