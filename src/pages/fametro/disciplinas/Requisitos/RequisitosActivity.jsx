import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    category: "FUNDAMENTOS",
    text: "A construção de software começa muito antes da codificação. Qual é o primeiro passo fundamental nesse processo?",
    answers: [
      "Escolher a linguagem de programação",
      "Compreender profundamente as necessidades do negócio",
      "Definir o banco de dados",
      "Contratar a equipe de desenvolvedores"
    ],
    correct: 1,
    feedback: "A construção do SW começa com a compreensão profunda das necessidades do negócio, antes de qualquer decisão técnica.",
    points: 5
  },
  {
    category: "FUNDAMENTOS",
    text: "A Análise de Requisitos é definida como a arte de:",
    answers: [
      "Programar, testar e implantar sistemas",
      "Descobrir, documentar e gerenciar as necessidades dos stakeholders",
      "Criar interfaces visuais para usuários",
      "Gerenciar equipes de desenvolvimento ágil"
    ],
    correct: 1,
    feedback: "A Análise de Requisitos é a arte de Descobrir, Documentar e Gerenciar as Necessidades dos stakeholders.",
    points: 5
  },
  {
    category: "MODELAGEM CONCEITUAL",
    text: "Qual é a diferença entre Modelagem Conceitual e Casos de Uso?",
    answers: [
      "São a mesma coisa, apenas com nomes diferentes",
      "A modelagem conceitual foca na estrutura (entidades), os casos de uso focam no comportamento (ações)",
      "Casos de uso são mais detalhados que modelagem conceitual",
      "Modelagem conceitual é usada apenas por DBAs"
    ],
    correct: 1,
    feedback: "A Modelagem Conceitual foca na estrutura (entidades e relacionamentos), enquanto os Casos de Uso focam no comportamento (ações dos atores no sistema).",
    points: 5
  },
  {
    category: "ANÁLISE DE CONSISTÊNCIA",
    text: "O que define uma Inconsistência Lógica nos requisitos?",
    answers: [
      "Requisitos redigidos em idiomas diferentes",
      "Quando um requisito anula o outro — ex: 'sistema rápido' vs 'segurança máxima que o torne lento'",
      "Requisitos duplicados com mesmo conteúdo",
      "Requisitos sem identificador único"
    ],
    correct: 1,
    feedback: "Inconsistências lógicas ocorrem quando um requisito contradiz outro, como exigir velocidade máxima e também segurança máxima que tornaria o sistema lento.",
    points: 5
  },
  {
    category: "ANÁLISE DE CONSISTÊNCIA",
    text: "Qual é a definição de Inconsistência Semântica?",
    answers: [
      "Requisito com prazo impossível",
      "Requisito fora do escopo do projeto",
      "A mesma informação descrita de forma diferente em locais distintos",
      "Conflito entre requisitos funcionais e não funcionais"
    ],
    correct: 2,
    feedback: "Inconsistências semânticas ocorrem quando a mesma informação é descrita de forma diferente em locais distintos do documento de requisitos.",
    points: 5
  },
  {
    category: "ANÁLISE DE CONSISTÊNCIA",
    text: "Quais ferramentas podem ser usadas para rastrear dependências e identificar conflitos entre requisitos?",
    answers: [
      "Photoshop, Canva e Figma",
      "Word, Excel e PowerPoint",
      "JIRA, Trello e IBM DOORS Next",
      "GitHub, GitLab e Bitbucket"
    ],
    correct: 2,
    feedback: "Ferramentas como JIRA, Trello e IBM DOORS Next são usadas no gerenciamento de requisitos, ajudando a rastrear dependências e identificar conflitos.",
    points: 5
  },
  {
    category: "ANÁLISE DE VIABILIDADE",
    text: "O que a Análise de Viabilidade avalia em um projeto de software?",
    answers: [
      "Se o sistema terá boa interface gráfica",
      "Se o projeto é operacionalmente factível em termos técnicos e financeiros",
      "Se a equipe domina as tecnologias escolhidas",
      "Se o cliente está satisfeito com os protótipos"
    ],
    correct: 1,
    feedback: "A Análise de Viabilidade avalia se o projeto de SW é operacionalmente factível em termos técnicos e financeiros, auxiliando a decidir se deve prosseguir ou ser reavaliado.",
    points: 5
  },
  {
    category: "ANÁLISE DE VIABILIDADE",
    text: "Quais são os quatro tipos de viabilidade apresentados na aula?",
    answers: [
      "Legal, Ética, Cultural e Tecnológica",
      "Técnica, Financeira, Operacional e de Cronograma",
      "Humana, Material, Financeira e Temporal",
      "Estratégica, Tática, Operacional e de Mercado"
    ],
    correct: 1,
    feedback: "Os quatro tipos são: Viabilidade Técnica (temos a tecnologia?), Financeira (benefício justifica o custo?), Operacional (fluxo de trabalho?) e de Cronograma (concluído no prazo?).",
    points: 5
  },
  {
    category: "ANÁLISE DE VIABILIDADE",
    text: "Qual métrica financeira é frequentemente usada para justificar a decisão de seguir em frente com um projeto?",
    answers: [
      "NPS — Net Promoter Score",
      "ROI — Retorno sobre o Investimento",
      "KPI — Key Performance Indicator",
      "SLA — Service Level Agreement"
    ],
    correct: 1,
    feedback: "O ROI (Retorno sobre o Investimento) e a análise de custo-benefício são as métricas mais usadas para justificar a decisão de prosseguir com o projeto.",
    points: 5
  },
  {
    category: "ANÁLISE DE VIABILIDADE",
    text: "Quais são os três possíveis resultados de uma Análise de Viabilidade?",
    answers: [
      "Aprovar, Reprovar ou Suspender",
      "Seguir com o projeto, Redefinir o escopo ou Abortar o projeto",
      "Iniciar, Pausar ou Cancelar",
      "Acelerar, Manter ou Reduzir"
    ],
    correct: 1,
    feedback: "Os resultados possíveis são: Seguir com o projeto, Redefinir o escopo (reduzir ou aumentar) ou Abortar o projeto.",
    points: 5
  },
  {
    category: "PRIORIZAÇÃO",
    text: "O que significa a letra 'M' na técnica MoSCoW?",
    answers: [
      "Moderado — pode aguardar",
      "Must — requisito obrigatório",
      "Mínimo — escopo reduzido",
      "Melhor — ideal mas não necessário"
    ],
    correct: 1,
    feedback: "Na técnica MoSCoW: M = Must (Obrigatório), S = Should (Importante), C = Could (Desejável), W = Won't (Não essencial agora).",
    points: 5
  },
  {
    category: "PRIORIZAÇÃO",
    text: "Qual afirmação sobre Priorização de Requisitos é CORRETA?",
    answers: [
      "É um processo feito apenas uma vez, no início do projeto",
      "Deve ser realizada somente pelo analista de negócios",
      "É um processo contínuo e flexível, podendo ser alterado conforme o negócio evolui",
      "Substitui completamente a análise de viabilidade"
    ],
    correct: 2,
    feedback: "A priorização NÃO é estática! Deve ser um processo contínuo e flexível, pois requisitos podem ter sua prioridade alterada à medida que as necessidades de negócio evoluem.",
    points: 5
  },
  {
    category: "PRIORIZAÇÃO",
    text: "O Modelo Kano avalia a prioridade dos requisitos com base em qual critério?",
    answers: [
      "Custo de implementação",
      "Satisfação do cliente",
      "Complexidade técnica",
      "Prazo de entrega"
    ],
    correct: 1,
    feedback: "O Modelo Kano avalia a prioridade dos requisitos com base na satisfação do cliente, classificando-os como Essenciais ou Atraentes.",
    points: 5
  },
  {
    category: "CASO DE USO",
    text: "O que representa o ATOR em um Diagrama de Caso de Uso?",
    answers: [
      "Uma tela do sistema",
      "Um banco de dados externo",
      "Alguém ou algo que interage com o sistema para atingir um objetivo",
      "Uma função interna do software"
    ],
    correct: 2,
    feedback: "O Ator representa alguém (usuário, sistema externo) que interage com o sistema. É representado visualmente pelo ícone de boneco (stick figure).",
    points: 5
  },
  {
    category: "CASO DE USO",
    text: "Qual é a diferença entre os relacionamentos <<include>> e <<extend>> em Casos de Uso?",
    answers: [
      "Include é obrigatório (sempre acontece); Extend é opcional (acontece em condições específicas)",
      "Include é para usuários externos; Extend é para administradores",
      "Include representa herança; Extend representa composição",
      "Não há diferença prática entre eles"
    ],
    correct: 0,
    feedback: "<<include>> indica que o caso de uso A sempre inclui o comportamento de B (obrigatório). <<extend>> indica que B pode opcionalmente estender A em condições específicas.",
    points: 5
  },
  {
    category: "CASO DE USO",
    text: "Quais elementos compõem a estrutura descritiva de um Caso de Uso?",
    answers: [
      "Diagrama ER, Tabelas e Índices",
      "Nome claro, Ator principal, Pré-condição, Fluxo principal, Fluxos alternativos e Pós-condições",
      "Requisitos funcionais, Não funcionais e Restrições",
      "Wireframe, Protótipo e Mockup"
    ],
    correct: 1,
    feedback: "Um Caso de Uso descritivo inclui: Nome Claro, Ator Principal, Pré-condição, Fluxo Principal, Fluxos Alternativos e Pós-condições.",
    points: 5
  },
  {
    category: "MODELAGEM CONCEITUAL",
    text: "Quais são os três níveis da Modelagem de Dados apresentados na aula?",
    answers: [
      "Alto, Médio e Baixo",
      "Interno, Conceitual e Externo",
      "Conceitual, Lógica e Física",
      "Funcional, Estrutural e Comportamental"
    ],
    correct: 2,
    feedback: "Os três níveis são: Conceitual (visão do negócio), Lógica (independente de SGBD) e Física (específica para um SGBD).",
    points: 5
  },
  {
    category: "MODELAGEM CONCEITUAL",
    text: "Quais ferramentas são amplamente utilizadas para criar modelos conceituais?",
    answers: [
      "Eclipse, IntelliJ e VSCode",
      "MySQL Workbench, DBeaver e pgAdmin",
      "Lucidchart, Draw.io e Microsoft Visio",
      "Slack, Teams e Zoom"
    ],
    correct: 2,
    feedback: "Ferramentas de diagramação como Lucidchart, Draw.io e Microsoft Visio são amplamente utilizadas para criar modelos conceituais.",
    points: 5
  },
  {
    category: "GESTÃO DE DEMANDAS",
    text: "No Quadro Kanban, qual é a sequência correta das colunas do fluxo de trabalho?",
    answers: [
      "A Fazer → Backlog → Em Andamento → Concluído",
      "Backlog → A Fazer → Em Andamento → Concluído",
      "Ideia → Análise → Desenvolvimento → Entrega",
      "Concluído → Em Andamento → A Fazer → Backlog"
    ],
    correct: 1,
    feedback: "A sequência correta do quadro Kanban é: Backlog → A Fazer → Em Andamento → Concluído.",
    points: 5
  },
  {
    category: "INTEGRAÇÃO",
    text: "Qual afirmação melhor descreve a relação entre Análise de Requisitos e Modelagem Conceitual?",
    answers: [
      "São etapas independentes que não se relacionam",
      "A Modelagem Conceitual substitui a Análise de Requisitos",
      "Juntos, garantem que o SW não apenas funcione, mas resolva os problemas corretos e atenda às expectativas dos usuários",
      "A Análise de Requisitos ocorre somente após a Modelagem Conceitual"
    ],
    correct: 2,
    feedback: "Juntos, Análise de Requisitos e Modelagem Conceitual garantem que o SW não apenas funcione, mas que resolva os problemas corretos, de forma correta, atendendo às expectativas dos usuários.",
    points: 5
  }
];

const BADGES = [
  { id: 'first_blood', emoji: '🎯', name: 'Primeiro Acerto', desc: 'Acertou a primeira questão', condition: (s) => s.firstCorrect },
  { id: 'consistency', emoji: '🔥', name: 'Em Chamas', desc: '3 acertos consecutivos', condition: (s) => s.streak >= 3 },
  { id: 'half_way', emoji: '⚡', name: 'Na Metade', desc: 'Completou 10 questões', condition: (s) => s.answered >= 10 },
  { id: 'perfectionist', emoji: '💎', name: 'Perfeccionista', desc: '100% de acertos até agora', condition: (s) => s.answered > 0 && s.correct === s.answered },
  { id: 'speed_demon', emoji: '🚀', name: 'Speed Demon', desc: 'Respondeu em menos de 10s', condition: (s) => s.fastAnswer },
  { id: 'champion', emoji: '🏆', name: 'Campeão', desc: 'Completou o quiz', condition: (s) => s.finished },
];

const CATEGORY_COLORS = {
  "FUNDAMENTOS": "#C0392B",
  "MODELAGEM CONCEITUAL": "#8E44AD",
  "ANÁLISE DE CONSISTÊNCIA": "#E67E22",
  "ANÁLISE DE VIABILIDADE": "#27AE60",
  "PRIORIZAÇÃO": "#2980B9",
  "CASO DE USO": "#16A085",
  "GESTÃO DE DEMANDAS": "#D35400",
  "INTEGRAÇÃO": "#C0392B",
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function QMap({ results, current, total }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => {
        let bg = 'rgba(255,255,255,0.05)';
        let border = 'rgba(255,255,255,0.1)';
        let color = 'rgba(255,255,255,0.3)';
        if (i === current) { border = '#C0392B'; color = '#C0392B'; bg = 'rgba(192,57,43,0.1)'; }
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
          background: p.name === myName ? 'rgba(192,57,43,0.15)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${p.name === myName ? '#C0392B' : 'rgba(255,255,255,0.07)'}`,
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
      alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(192,57,43,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(41,128,185,0.05) 0%, transparent 50%)'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes pulseBorder { 0%,100%{border-color:#C0392B;box-shadow:none} 50%{border-color:#ff6b6b;box-shadow:0 0 20px rgba(192,57,43,0.4)} }
        @keyframes badgePop { 0%{transform:scale(0.5) rotate(-10deg)} 60%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{transform:translateX(120%)} to{transform:translateX(0)} }
        @keyframes fadeOutRight { to{opacity:0;transform:translateX(120%)} }
        @keyframes pointsUp { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-80px) scale(1.3)} }
        @keyframes correctFlash { 0%{transform:scale(1)} 50%{transform:scale(1.02)} 100%{transform:scale(1)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes blink { 50%{opacity:0.5} }
        @keyframes grid-move { from{background-position:0 0} to{background-position:40px 40px} }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Hub button */}
      <Link to="/fametro" style={{
        position: 'fixed', top: 20, left: 20, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 1,
        color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px',
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)',
        transition: 'all 0.2s'
      }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.6)'; e.currentTarget.style.background = 'rgba(192,57,43,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        ← HUB FAMETRO
      </Link>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, animation: 'fadeInUp 0.6s ease' }}>
        <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, color: '#C0392B', border: '1px solid #C0392B', padding: '6px 16px', marginBottom: 32, animation: 'pulseBorder 2s infinite' }}>
          FAMETRO · Sistemas de Informação · 2026.1
        </div>

        <div style={{ fontSize: 'clamp(52px, 10vw, 90px)', fontWeight: 800, lineHeight: 0.9, letterSpacing: -3, marginBottom: 8, background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          REQ<span style={{ background: 'linear-gradient(135deg, #C0392B 0%, #ff6b6b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QUEST</span>
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#6B6B7F', letterSpacing: 1, marginBottom: 48 }}>
          // Análise de Requisitos &amp; Modelagem Conceitual
        </div>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          {[['20', 'Questões'], ['100', 'Pontos'], ['1h30', 'Duração'], ['6', 'Badges']].map(([v, l]) => (
            <div key={l} style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#C0392B' }} />
              <span style={{ fontSize: 32, fontWeight: 800, color: '#C0392B', display: 'block' }}>{v}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#6B6B7F', textTransform: 'uppercase' }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 420, margin: '0 auto 32px' }}>
          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 2, color: '#6B6B7F', textTransform: 'uppercase', alignSelf: 'flex-start' }}>Seu nome / matrícula</label>
          <input
            ref={inputRef}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && onStart(name.trim())}
            placeholder="Ex: João Silva"
            maxLength={30}
            style={{
              width: '100%', background: '#13131A', border: '1px solid rgba(255,255,255,0.07)',
              borderBottom: '2px solid #C0392B', color: '#F0F0F5', fontFamily: "'Syne', sans-serif",
              fontSize: 20, fontWeight: 700, padding: '14px 18px', outline: 'none', letterSpacing: 1, boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={() => name.trim() && onStart(name.trim())}
          disabled={!name.trim()}
          style={{
            background: name.trim() ? '#C0392B' : '#333', color: 'white', border: 'none',
            fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, letterSpacing: 3,
            textTransform: 'uppercase', padding: '18px 56px', cursor: name.trim() ? 'pointer' : 'not-allowed',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            transition: 'all 0.2s', opacity: name.trim() ? 1 : 0.5
          }}
        >
          ▶ INICIAR QUIZ
        </button>
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────

function Quiz({ playerName, onFinish }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [firstCorrect, setFirstCorrect] = useState(false);
  const [fastAnswer, setFastAnswer] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [qResults, setQResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notification, setNotification] = useState(null);
  const [pointsFlash, setPointsFlash] = useState(null);
  const [leaderboard] = useState(() => {
    const fakes = [
      { name: 'Ana Lima', score: 0 },
      { name: 'Carlos M.', score: 0 },
      { name: 'Bruna F.', score: 0 },
      { name: 'Diego R.', score: 0 },
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

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    // Fake players
    fakeRef.current = setInterval(() => {
      setLbScores(prev => {
        const next = { ...prev };
        leaderboard.forEach(p => {
          if (!p.isMe && Math.random() < 0.3) {
            next[p.name] = Math.min(100, (next[p.name] || 0) + (Math.random() < 0.7 ? 5 : 0));
          }
        });
        return next;
      });
    }, 8000);
    return () => { clearInterval(timerRef.current); clearInterval(fakeRef.current); };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) handleFinish();
  }, [timeLeft]);

  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function selectAnswer(index) {
    if (showFeedback) return;
    const elapsed = (Date.now() - qStartTime) / 1000;
    const q = QUESTIONS[currentQ];
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
    if (currentQ + 1 >= QUESTIONS.length) {
      handleFinish();
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQStartTime(Date.now());
    }
  }

  function handleFinish() {
    clearInterval(timerRef.current);
    clearInterval(fakeRef.current);
    const finalBadges = [...earnedBadges, 'champion'];
    setEarnedBadges(finalBadges);
    onFinish({ score, answered, correct, earnedBadges: finalBadges, timeUsed: 90 * 60 - timeLeft, lbScores: { ...lbScores, [playerName]: score } });
  }

  const q = QUESTIONS[currentQ];
  const pct = Math.round((currentQ / QUESTIONS.length) * 100);
  const timerDanger = timeLeft <= 600;
  const timerWarning = timeLeft <= 1800;
  const catColor = CATEGORY_COLORS[q.category] || '#C0392B';
  const letters = ['A', 'B', 'C', 'D'];

  const lbList = leaderboard.map(p => ({ name: p.name, score: lbScores[p.name] || 0, isMe: p.isMe }));

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F5', fontFamily: "'Syne', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: '#13131A', borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 20,
        flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -1 }}>
          REQ<span style={{ color: '#C0392B' }}>QUEST</span>
        </div>
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.07)' }} />
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, letterSpacing: 2,
          color: timerDanger ? '#C0392B' : timerWarning ? '#F5A623' : '#F0F0F5',
          animation: timerDanger ? 'blink 0.5s infinite' : timerWarning ? 'blink 1s infinite' : 'none',
          minWidth: 90
        }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6B6B7F', marginBottom: 4 }}>
            <span>Q {currentQ + 1} / {QUESTIONS.length}</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#C0392B', transition: 'width 0.5s ease', borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: '#F5A623', fontWeight: 600 }}>
          ⬡ {score} pts
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6B6B7F' }}>{playerName}</div>
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
                else if (isSelected) { borderColor = '#C0392B'; bgColor = 'rgba(192,57,43,0.15)'; animation = 'shake 0.4s ease'; }
              } else if (isSelected) {
                borderColor = '#C0392B'; bgColor = 'rgba(192,57,43,0.1)';
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
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: showFeedback ? (isCorrectAnswer ? '#27AE60' : isSelected ? '#C0392B' : '#C0392B') : '#C0392B', minWidth: 20, flexShrink: 0 }}>{letters[i]}</span>
                  <span>{ans}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div style={{
              marginTop: 20, padding: '16px 20px', borderLeft: `3px solid ${selectedAnswer === q.correct ? '#27AE60' : '#C0392B'}`,
              background: selectedAnswer === q.correct ? 'rgba(39,174,96,0.06)' : 'rgba(192,57,43,0.06)',
              fontSize: 14, lineHeight: 1.6, color: '#ccc', animation: 'fadeInUp 0.3s ease'
            }}>
              {q.feedback}
            </div>
          )}

          {showFeedback && (
            <button onClick={nextQuestion} style={{
              marginTop: 20, background: 'transparent', border: '1px solid #C0392B', color: '#C0392B',
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', padding: '12px 32px', cursor: 'pointer', transition: 'all 0.2s',
              animation: 'fadeInUp 0.3s ease'
            }}
              onMouseEnter={e => { e.target.style.background = '#C0392B'; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#C0392B'; }}>
              {currentQ + 1 >= QUESTIONS.length ? 'VER RESULTADO →' : 'PRÓXIMA →'}
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Minimap */}
          <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#6B6B7F', textTransform: 'uppercase', marginBottom: 12 }}>Progresso</div>
            <QMap results={qResults} current={currentQ} total={QUESTIONS.length} />
          </div>

          {/* Badges */}
          <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#6B6B7F', textTransform: 'uppercase', marginBottom: 12 }}>Conquistas</div>
            <BadgesGrid earned={earnedBadges} />
          </div>

          {/* Leaderboard */}
          <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 16 }}>
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
  if (score >= 91) return { emoji: '🏆', title: 'EXCELÊNCIA', level: 'NÍVEL MASTER', role: 'Arquiteto de Requisitos', color: '#F5A623', desc: 'Domínio completo dos conceitos de Análise de Requisitos e Modelagem Conceitual. Você está pronto para liderar projetos complexos.' };
  if (score >= 76) return { emoji: '⭐', title: 'DISTINÇÃO', level: 'NÍVEL AVANÇADO', role: 'Analista de Negócios Senior', color: '#9B59B6', desc: 'Ótimo desempenho! Você demonstra forte compreensão dos fundamentos. Pequenos refinamentos te levarão ao próximo nível.' };
  if (score >= 61) return { emoji: '✅', title: 'APROVADO', level: 'NÍVEL INTERMEDIÁRIO', role: 'Analista de Sistemas', color: '#2980B9', desc: 'Bom trabalho! Você compreende os conceitos centrais. Continue praticando para consolidar seu conhecimento.' };
  if (score >= 41) return { emoji: '📚', title: 'EM DESENVOLVIMENTO', level: 'NÍVEL BÁSICO', role: 'Trainee em Análise', color: '#F5A623', desc: 'Você está no caminho certo! Revise os conceitos de Análise de Consistência e Casos de Uso para melhorar.' };
  return { emoji: '🔄', title: 'PRECISA REVISAR', level: 'NÍVEL INICIANTE', role: 'Estudante de Requisitos', color: '#C0392B', desc: 'Não desanime! Revise o material da Aula 04 e tente novamente. A prática leva à perfeição.' };
}

function Result({ playerName, data }) {
  const { score, answered, correct, earnedBadges: badges, timeUsed, lbScores } = data;
  const cls = getClassification(score);
  const minutes = Math.floor(timeUsed / 60);
  const seconds = timeUsed % 60;
  const earnedList = BADGES.filter(b => badges.includes(b.id));
  const lbList = Object.entries(lbScores).map(([name, s]) => ({ name, score: s })).sort((a, b) => b.score - a.score);
  const myRank = lbList.findIndex(p => p.name === playerName) + 1;

  // Confetti
  useEffect(() => {
    if (score >= 80) {
      const colors = ['#C0392B', '#F5A623', '#27AE60', '#2980B9', '#9B59B6', '#fff'];
      for (let i = 0; i < 80; i++) {
        setTimeout(() => {
          const piece = document.createElement('div');
          piece.style.cssText = `position:fixed;pointer-events:none;z-index:9998;border-radius:${Math.random() > 0.5 ? '50%' : '0'};left:${Math.random() * 100}vw;background:${colors[Math.floor(Math.random() * colors.length)]};width:${Math.random() * 10 + 4}px;height:${Math.random() * 10 + 4}px;animation:confettiFall ${Math.random() * 2 + 2}s linear ${Math.random() * 0.5}s forwards`;
          document.body.appendChild(piece);
          setTimeout(() => piece.remove(), 4000);
        }, i * 30);
      }
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F5', fontFamily: "'Syne', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 32, textAlign: 'center' }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}} @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>

      <div style={{ fontSize: 80, animation: 'float 3s ease-in-out infinite' }}>{cls.emoji}</div>

      <div>
        <div style={{ fontSize: 'clamp(36px, 8vw, 70px)', fontWeight: 800, letterSpacing: -2, lineHeight: 1, background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{cls.title}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: '#C0392B', letterSpacing: 3, textTransform: 'uppercase', marginTop: 8 }}>{cls.level}</div>
      </div>

      <div style={{ fontSize: 'clamp(64px, 15vw, 110px)', fontWeight: 800, lineHeight: 1, background: 'linear-gradient(135deg, #F5A623 0%, #ff9f00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{score}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6B6B7F', letterSpacing: 3, marginTop: -20 }}>PONTOS DE 100</div>

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { v: correct, l: 'ACERTOS', c: '#27AE60' },
          { v: answered - correct, l: 'ERROS', c: '#C0392B' },
          { v: `${minutes}m${String(seconds).padStart(2, '0')}s`, l: 'TEMPO', c: '#2980B9' },
          { v: `#${myRank}`, l: 'RANKING', c: '#F5A623' },
        ].map(({ v, l, c }) => (
          <div key={l} style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px', minWidth: 100 }}>
            <span style={{ fontSize: 28, fontWeight: 800, display: 'block', color: c }}>{v}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6B6B7F', letterSpacing: 1 }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', borderTop: `3px solid ${cls.color}`, padding: '24px 36px', maxWidth: 480, width: '100%' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: '#6B6B7F', marginBottom: 8 }}>// CLASSIFICAÇÃO FINAL</div>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: cls.color }}>{cls.role}</div>
        <div style={{ fontSize: 14, color: '#6B6B7F', lineHeight: 1.6 }}>{cls.desc}</div>
      </div>

      {earnedList.length > 0 && (
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: '#6B6B7F', textTransform: 'uppercase', marginBottom: 16 }}>Conquistas Desbloqueadas</div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {earnedList.map(b => (
              <div key={b.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 36 }}>{b.emoji}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#F5A623', letterSpacing: 1 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.07)', padding: 24, maxWidth: 480, width: '100%', maxHeight: 280, overflowY: 'auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: '#6B6B7F', marginBottom: 12, textTransform: 'uppercase' }}>Placar Final</div>
        {lbList.map((p, i) => (
          <div key={p.name + i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: p.name === playerName ? 'rgba(192,57,43,0.12)' : 'transparent', fontSize: 14 }}>
            <span style={{ fontSize: 18, minWidth: 30, textAlign: 'center' }}>{['🥇', '🥈', '🥉'][i] || `${i + 1}°`}</span>
            <span style={{ flex: 1, fontWeight: p.name === playerName ? 700 : 400 }}>{p.name === playerName ? '▶ ' + p.name : p.name}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#F5A623', fontWeight: 700 }}>{p.score} pts</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => window.location.reload()} style={{
          background: '#C0392B', color: 'white', border: 'none',
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2,
          textTransform: 'uppercase', padding: '14px 40px', cursor: 'pointer', transition: 'all 0.2s',
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'
        }}>↺ JOGAR NOVAMENTE</button>
        <Link to="/fametro" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'transparent', color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'Syne', sans-serif",
          fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
          padding: '14px 32px', transition: 'all 0.2s',
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >← HUB FAMETRO</Link>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function RequisitosActivity() {
  const [screen, setScreen] = useState('intro'); // 'intro' | 'quiz' | 'result'
  const [playerName, setPlayerName] = useState('');
  const [resultData, setResultData] = useState(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  async function handleStart(name) {
    setPlayerName(name);
    startTimeRef.current = Date.now();
    setScreen('quiz');
  }

  async function handleFinish(data) {
    setResultData(data);
    setScreen('result');
    // Save to Firestore
    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName,
        score: data.score,
        duration: Date.now() - startTimeRef.current,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
        activityId: "analise_requisitos",
        module: "Engenharia de Software",
        course: "Sistemas de Informação",
        professor: "Alexsander Farias"
      });
    } catch (e) {
      console.error("Erro ao salvar ranking:", e);
    }
  }

  if (screen === 'intro') return <Intro onStart={handleStart} />;
  if (screen === 'quiz') return <Quiz playerName={playerName} onFinish={handleFinish} />;
  if (screen === 'result') return <Result playerName={playerName} data={resultData} />;
}
